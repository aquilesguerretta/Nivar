"""Bounded, conditional requests for the Petrobras SEC submissions feed."""

from __future__ import annotations

import json
import math
import os
import re
import time
from collections.abc import Callable
from dataclasses import dataclass, replace
from datetime import date, datetime, timezone
from email.utils import parsedate_to_datetime
from threading import Lock

import httpx

from .metadata import (
    RECENT_PAGE,
    SUBMISSIONS_BASE,
    EdgarPayloadError,
    FilingChange,
    FilingMetadata,
    FilingVersion,
    Page,
    parse_page,
)

USER_AGENT_ENV = "ARGOS_SEC_EDGAR_USER_AGENT"
DEVELOPMENT_ENV = "ARGOS_SEC_EDGAR_ENV"
MAX_ARCHIVE_PAGES = 3
_MAX_PAGE_BYTES = 8 * 1024 * 1024
_SEC_COOLDOWN_SECONDS = 600
_IDENTIFIED_USER_AGENT = re.compile(r"[^@]+\s+[^\s@]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}")
_PLACEHOLDER_DOMAIN = re.compile(r"(^|\.)(example\.(com|net|org)|example|test|invalid|localhost)$")


class EdgarConfigurationError(ValueError):
    """The request is missing a declared identity or live authorization."""


class EdgarRequestError(RuntimeError):
    """A request failed or is paused. A failed check is never a no-change result."""

    def __init__(
        self, message: str, *, status_code: int | None = None, retry_after_seconds: int | None = None
    ) -> None:
        super().__init__(message)
        self.status_code = status_code
        self.retry_after_seconds = retry_after_seconds


class _RequestGate:
    def __init__(self, clock: Callable[[], float], sleep: Callable[[float], None]) -> None:
        self.lock = Lock()
        self.clock = clock
        self.sleep = sleep
        self.next_request_at = 0.0
        self.blocked_until = 0.0

    def start(self) -> None:
        now = self.clock()
        cooldown = math.ceil(self.blocked_until - now)
        if cooldown > 0:
            raise EdgarRequestError("SEC access cooldown is active", retry_after_seconds=cooldown)
        wait = self.next_request_at - now
        if wait > 0:
            self.sleep(wait)
        self.next_request_at = self.clock() + 1


_LIVE_GATE = _RequestGate(time.monotonic, time.sleep)


@dataclass(frozen=True)
class _CachedPage:
    page: Page
    etag: str | None
    last_modified: str | None


@dataclass(frozen=True)
class PollResult:
    checked_at: datetime
    filed_from: date | None
    filed_through: date | None
    archive_pages_read: int
    archive_pages_available: int
    changes: tuple[FilingChange, ...]


class EdgarClient:
    """An internal pilot session. Pass a transport for offline replay."""

    def __init__(
        self,
        *,
        transport: httpx.BaseTransport | None = None,
        user_agent: str | None = None,
        allow_live: bool = False,
        clock: Callable[[], float] = time.monotonic,
        sleep: Callable[[float], None] = time.sleep,
    ) -> None:
        if transport is None:
            if (
                allow_live is not True
                or os.environ.get(DEVELOPMENT_ENV) != "development"
                or os.environ.get("APP_ENV", "").lower() in {"prod", "production"}
                or os.environ.get("RAILWAY_ENVIRONMENT")
                or os.environ.get("VERCEL_ENV")
            ):
                raise EdgarConfigurationError(
                    f"Live SEC access requires --allow-live and {DEVELOPMENT_ENV}=development outside deployments"
                )
            user_agent = os.environ.get(USER_AGENT_ENV)
            self._gate = _LIVE_GATE
        else:
            self._gate = _RequestGate(clock, sleep)

        declared_agent = _validate_user_agent(user_agent, live=transport is None)
        self._http = httpx.Client(
            timeout=10.0,
            follow_redirects=False,
            trust_env=False,
            transport=transport,
            headers={"User-Agent": declared_agent, "Accept": "application/json"},
        )
        self._poll_lock = Lock()
        self._cache: dict[str, _CachedPage] = {}
        self._versions: dict[str, FilingVersion] = {}

    def __enter__(self) -> EdgarClient:
        return self

    def __exit__(self, *exc: object) -> None:
        self.close()

    def close(self) -> None:
        with self._poll_lock:
            self._http.close()
            self._cache.clear()
            self._versions.clear()

    def poll(
        self,
        *,
        archive_pages: int = 0,
        filed_from: date | None = None,
        filed_through: date | None = None,
    ) -> PollResult:
        if type(archive_pages) is not int or not 0 <= archive_pages <= MAX_ARCHIVE_PAGES:
            raise ValueError(f"archive_pages must be an integer from 0 to {MAX_ARCHIVE_PAGES}")
        if any(bound is not None and type(bound) is not date for bound in (filed_from, filed_through)):
            raise ValueError("filing window bounds must be calendar dates")
        if filed_from and filed_through and filed_from > filed_through:
            raise ValueError("filing window must end on or after its start")

        with self._poll_lock:
            recent = self._read_page(RECENT_PAGE)
            archives = [page for page in recent.page.archives if page.overlaps(filed_from, filed_through)]
            pages = {RECENT_PAGE: recent}
            for page in archives[:archive_pages]:
                pages[page.filename] = self._read_page(page.filename)
            filings = _combine_pages(pages)
            checked_at = datetime.now(timezone.utc)
            changes = tuple(
                self._compare(filing, checked_at)
                for _, filing in sorted(filings.items())
                if (filed_from is None or filed_from <= filing.filed_on)
                and (filed_through is None or filing.filed_on <= filed_through)
            )
            # Publish cache and comparison state only after validating every selected page.
            self._cache = pages
            self._versions.update(
                (change.version.metadata.accession_number, change.version) for change in changes
            )
            return PollResult(checked_at, filed_from, filed_through, len(pages) - 1, len(archives), changes)

    def _compare(self, metadata: FilingMetadata, observed_at: datetime) -> FilingChange:
        previous = self._versions.get(metadata.accession_number)
        digest = metadata.metadata_hash()
        if previous is not None and previous.metadata_sha256 == digest:
            return FilingChange("unchanged", previous)
        if previous is None:
            return FilingChange("new", FilingVersion(metadata, digest, 1, observed_at, None))
        version = FilingVersion(metadata, digest, previous.revision + 1, observed_at, previous.version_id)
        return FilingChange("corrected", version)

    def _read_page(self, name: str) -> _CachedPage:
        cached = self._cache.get(name)
        headers = {}
        if cached and cached.etag:
            headers["If-None-Match"] = cached.etag
        if cached and cached.last_modified:
            headers["If-Modified-Since"] = cached.last_modified

        status, validators, payload = self._get(name, headers)
        etag, last_modified = validators
        if status == 304:
            if cached is None or not headers:
                raise EdgarPayloadError("SEC returned 304 without a matching conditional request")
            return replace(
                cached, etag=etag or cached.etag, last_modified=last_modified or cached.last_modified
            )
        return _CachedPage(parse_page(name, payload), etag, last_modified)

    def _get(
        self, name: str, headers: dict[str, str]
    ) -> tuple[int, tuple[str | None, str | None], object]:
        with self._gate.lock:
            self._gate.start()
            try:
                with self._http.stream("GET", SUBMISSIONS_BASE + name, headers=headers) as response:
                    status = response.status_code
                    validators = (response.headers.get("ETag"), response.headers.get("Last-Modified"))
                    if status == 304:
                        return status, validators, None
                    if status in (403, 429):
                        delay = max(_SEC_COOLDOWN_SECONDS, _retry_after(response.headers.get("Retry-After")))
                        self._gate.blocked_until = self._gate.clock() + delay
                        raise EdgarRequestError(
                            f"SEC paused access (HTTP {status})",
                            status_code=status,
                            retry_after_seconds=delay,
                        )
                    if status != 200:
                        raise EdgarRequestError(f"SEC request failed (HTTP {status})", status_code=status)
                    return status, validators, _read_json(response)
            except httpx.HTTPError:
                raise EdgarRequestError("SEC submissions transport failed") from None


def _validate_user_agent(user_agent: str | None, *, live: bool) -> str:
    if user_agent is None or any(not " " <= char <= "~" for char in user_agent):
        raise EdgarConfigurationError(f"{USER_AGENT_ENV} must declare an organization and contact email")
    user_agent = user_agent.strip()
    if not _IDENTIFIED_USER_AGENT.fullmatch(user_agent):
        raise EdgarConfigurationError(f"{USER_AGENT_ENV} must declare an organization and contact email")
    domain = user_agent.rsplit("@", 1)[-1].lower()
    if live and _PLACEHOLDER_DOMAIN.search(domain):
        raise EdgarConfigurationError(f"{USER_AGENT_ENV} must use the operator's real contact email")
    return user_agent


def _retry_after(value: str | None) -> int:
    if not value:
        return 0
    if re.fullmatch(r"[0-9]{1,10}", value):
        return int(value)
    try:
        retry_at = parsedate_to_datetime(value)
    except (TypeError, ValueError, OverflowError):
        return 0
    if retry_at.tzinfo is None:
        retry_at = retry_at.replace(tzinfo=timezone.utc)
    return math.ceil((retry_at - datetime.now(timezone.utc)).total_seconds())


def _read_json(response: httpx.Response) -> object:
    content_type = response.headers.get("Content-Type", "").split(";", 1)[0].strip().lower()
    if content_type != "application/json":
        raise EdgarPayloadError("SEC submissions response was not JSON")
    data = bytearray()
    for chunk in response.iter_bytes(chunk_size=64 * 1024):
        if len(data) + len(chunk) > _MAX_PAGE_BYTES:
            raise EdgarPayloadError("SEC submissions response exceeded the pilot size limit")
        data.extend(chunk)
    try:
        return json.loads(data)
    except (UnicodeError, ValueError, RecursionError):
        raise EdgarPayloadError("Invalid SEC submissions JSON") from None


def _combine_pages(pages: dict[str, _CachedPage]) -> dict[str, FilingMetadata]:
    filings = {}
    for page in pages.values():
        for filing in page.page.filings:
            previous = filings.setdefault(filing.accession_number, filing)
            if previous != filing:
                raise EdgarPayloadError("Conflicting SEC metadata for one accession across submissions rows")
    return filings
