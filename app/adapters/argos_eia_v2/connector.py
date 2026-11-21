"""Run the bounded EIA pilot against an injected offline HTTP transport."""

from __future__ import annotations

import hashlib
import json
import random
import time
from dataclasses import dataclass, field
from datetime import UTC, datetime
from decimal import Decimal
from email.utils import parsedate_to_datetime
from threading import Lock
from typing import Callable, Literal, Mapping, Protocol

from .series import (
    ADAPTER_VERSION,
    CANONICAL_ROUTE,
    SOURCE_ID,
    UNIT,
    Coverage,
    PricePage,
    SourceId,
    Window,
    parse_prices,
)

MAX_ATTEMPTS = 3
MIN_REQUEST_INTERVAL = 1.0
MAX_RETRY_WAIT = 30.0
TIMEOUT = 5.0
RETRYABLE_HTTP = {408, 429, 500, 502, 503, 504}

Failure = Literal[
    "disabled", "not_found", "rate_limited", "access_denied", "request_rejected",
    "upstream_error", "transport_error", "invalid_response",
]
Status = Failure | Literal["complete", "partial", "no_data"]


@dataclass(frozen=True)
class HttpResponse:
    status: int
    headers: Mapping[str, str] = field(repr=False)
    body: bytes = field(repr=False)

    def header(self, name: str) -> str:
        return next((value for key, value in self.headers.items() if key.lower() == name), "")


class Transport(Protocol):
    def __call__(
        self, route: str, query: tuple[tuple[str, str], ...], *, timeout: float
    ) -> HttpResponse: ...


@dataclass(frozen=True)
class PriceVersion:
    ref_period: str
    published_value: str
    collected_at: datetime
    version_id: str
    supersedes: str | None
    value: Decimal
    api_version: str | None
    unit: str = UNIT
    published_at: None = None
    adapter_version: str = ADAPTER_VERSION


@dataclass(frozen=True)
class History:
    """Immutable private replay state for this series."""

    versions: tuple[PriceVersion, ...] = ()
    last_success_at: datetime | None = None
    last_success_ref_period: str | None = None


@dataclass(frozen=True)
class PeriodResult:
    ref_period: str
    coverage: Coverage
    version: PriceVersion | None = None
    coverage_lost: bool = False


@dataclass(frozen=True)
class CollectionResult:
    status: Status
    checked_at: datetime
    periods: tuple[PeriodResult, ...]
    history: History
    attempts: int
    api_version: str | None = None
    source_id: SourceId = field(default=SOURCE_ID, init=False)
    canonical_route: str = field(default=CANONICAL_ROUTE, init=False)
    rights_summary_state: Literal["unknown"] = field(default="unknown", init=False)
    rights_record_ref: None = field(default=None, init=False)
    adapter_version: str = field(default=ADAPTER_VERSION, init=False)
    environment: Literal["fixture"] = field(default="fixture", init=False)

    @property
    def ref_period(self) -> str | None:
        return next((row.ref_period for row in reversed(self.periods) if row.version), None)

    @property
    def last_success_at(self) -> datetime | None:
        return self.history.last_success_at


def _http_failure(status: int) -> Failure:
    if status == 404:
        return "not_found"
    if status == 429:
        return "rate_limited"
    if status in {401, 403}:
        return "access_denied"
    if status in RETRYABLE_HTTP or status >= 500:
        return "upstream_error"
    return "request_rejected"


def _retry_after(value: str, now: datetime) -> float:
    value = value.strip()
    if value.isascii() and value.isdigit():
        return float(value)
    try:
        deadline = parsedate_to_datetime(value)
        if deadline.tzinfo is None:
            deadline = deadline.replace(tzinfo=UTC)
        return max((deadline - now).total_seconds(), 0.0)
    except (TypeError, ValueError, OverflowError):
        return 0.0


def _version(
    period: str, price: str, api_version: str | None, at: datetime, prior: PriceVersion | None
) -> PriceVersion:
    value = Decimal(price)
    if prior is not None and prior.value == value:
        return prior

    # Render with a fixed decimal point and no insignificant zeros, without a
    # Decimal context operation that could round under the caller's precision.
    canonical = format(value, "f")
    if "." in canonical:
        canonical = canonical.rstrip("0").rstrip(".")
    supersedes = prior.version_id if prior is not None else None
    identity = json.dumps((SOURCE_ID, period, UNIT, canonical, supersedes)).encode("utf-8")
    return PriceVersion(
        ref_period=period,
        published_value=price,
        collected_at=at,
        version_id=hashlib.sha256(identity).hexdigest(),
        supersedes=supersedes,
        value=value,
        api_version=api_version,
    )


def _reconcile(
    window: Window, page: PricePage, prior: History, at: datetime, attempts: int
) -> CollectionResult:
    heads = {version.ref_period: version for version in prior.versions}
    appended: list[PriceVersion] = []
    periods: list[PeriodResult] = []
    observed = 0
    for period in window.periods:
        previous = heads.get(period)
        price = page.prices.get(period)
        if price is None:
            coverage = "missing_value" if period in page.prices else "missing_row"
            periods.append(PeriodResult(period, coverage, coverage_lost=previous is not None))
            continue

        version = _version(period, price, page.api_version, at, previous)
        if version is not previous:
            appended.append(version)
        periods.append(PeriodResult(period, "observed", version))
        observed += 1

    if observed == len(periods):
        status = "complete"
        history = History(prior.versions + tuple(appended), at, window.end)
    else:
        status = "partial" if observed else "no_data"
        history = History(
            prior.versions + tuple(appended), prior.last_success_at, prior.last_success_ref_period
        )
    return CollectionResult(status, at, tuple(periods), history, attempts, page.api_version)


class EiaConnector:
    """Fail-closed without a fixture transport. Never reads API credentials."""

    def __init__(
        self,
        transport: Transport | None = None,
        *,
        clock: Callable[[], datetime] = lambda: datetime.now(UTC),
        monotonic: Callable[[], float] = time.monotonic,
        sleep: Callable[[float], None] = time.sleep,
        jitter: Callable[[], float] = lambda: random.uniform(0.0, 0.25),
    ) -> None:
        self._transport = transport
        self._clock = clock
        self._monotonic = monotonic
        self._sleep = sleep
        self._jitter = jitter
        self._request_lock = Lock()
        self._next_request_at: float | None = None
        self._last_failure: Failure = "rate_limited"

    def collect(self, window: Window, *, previous: History = History()) -> CollectionResult:
        """Replay one window against the supplied history. The caller owns state commits."""
        response, attempts = self._fetch(window)
        at = self._clock()
        if isinstance(response, HttpResponse):
            media_type = response.header("content-type").partition(";")[0].strip().lower()
            if media_type == "application/json":
                try:
                    page = parse_prices(response.body, window)
                except (ValueError, RecursionError):
                    pass
                else:
                    return _reconcile(window, page, previous, at, attempts)
            response = "invalid_response"

        periods = tuple(PeriodResult(period, "unverified") for period in window.periods)
        return CollectionResult(response, at, periods, previous, attempts)

    def _fetch(self, window: Window) -> tuple[HttpResponse | Failure, int]:
        if self._transport is None:
            return "disabled", 0

        query = window.query()
        with self._request_lock:
            for attempt in range(1, MAX_ATTEMPTS + 1):
                if self._next_request_at is not None:
                    wait = self._next_request_at - self._monotonic()
                    if wait > MAX_RETRY_WAIT:
                        return self._last_failure, attempt - 1
                    if wait > 0:
                        self._sleep(wait)

                self._next_request_at = self._monotonic() + MIN_REQUEST_INTERVAL
                try:
                    response = self._transport(CANONICAL_ROUTE, query, timeout=TIMEOUT)
                except OSError:
                    # Injected transports translate I/O errors to OSError.
                    # Provider bodies, headers and exception details stay out of projections.
                    failure: Failure = "transport_error"
                    retry_after = 0.0
                else:
                    if response.status == 200:
                        return response, attempt
                    failure = _http_failure(response.status)
                    if response.status not in RETRYABLE_HTTP:
                        return failure, attempt
                    retry_after = _retry_after(response.header("retry-after"), self._clock())

                self._last_failure = failure
                delay = max(2 ** (attempt - 1) + self._jitter(), retry_after)
                self._next_request_at = max(self._next_request_at, self._monotonic() + delay)
            return self._last_failure, MAX_ATTEMPTS
