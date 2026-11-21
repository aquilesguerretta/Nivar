"""Conditional GET for the local ONS fixture. Capture stays in Argos Memory."""

from dataclasses import dataclass
from datetime import datetime, timezone
from email.utils import parsedate_to_datetime
from http.client import HTTPConnection, HTTPException, HTTPResponse
from re import fullmatch
from socket import SHUT_RDWR
from threading import Timer
from time import monotonic, sleep
from typing import Callable
from urllib.parse import urlsplit

MAX_BYTES = 8 * 1024 * 1024
USER_AGENT = "NIVAR-Argos-Source-Watch/1.0"


def fixture_target(url: str) -> str:
    parsed = urlsplit(url)
    if (
        parsed.scheme != "http"
        or parsed.netloc != "127.0.0.1:5284"
        or not parsed.path.startswith("/")
        or parsed.query
        or parsed.fragment
        or not parsed.path.isascii()
        or any(ord(char) <= 32 or ord(char) == 127 for char in url)
    ):
        raise ValueError("expected a synthetic HTTP URL on 127.0.0.1:5284 without query or fragment")
    return parsed.path


@dataclass(frozen=True)
class Validators:
    etag: str | None = None
    last_modified: str | None = None

    def headers(self) -> dict[str, str]:
        headers = {}
        if self.etag and fullmatch(r'(?:W/)?"[!#-~]{0,256}"', self.etag):
            headers["If-None-Match"] = self.etag
        if self.last_modified and fullmatch(r"[A-Za-z0-9,: +\-]{1,40}", self.last_modified):
            headers["If-Modified-Since"] = self.last_modified
        return headers


@dataclass(frozen=True)
class FetchResult:
    status: int
    attempts: int
    validators: Validators
    body: bytes | None = None
    content_type: str | None = None


class FetchFailed(Exception):
    def __init__(self, reason: str, attempts: int, status: int | None = None):
        super().__init__(reason)
        self.attempts = attempts
        self.status = status


def _retry_after_seconds(value: str | None) -> float:
    if not value:
        return 0
    try:
        if value.isascii() and value.isdecimal():
            return float(value)
        retry_at = parsedate_to_datetime(value)
        if retry_at.tzinfo is not None:
            return max(0, (retry_at - datetime.now(timezone.utc)).total_seconds())
    except (ValueError, OverflowError):
        pass
    return 0


def _read_csv(response: HTTPResponse, attempt: int) -> bytes:
    encoding = response.getheader("Content-Encoding", "identity").lower()
    if encoding != "identity":
        raise FetchFailed("unsupported_content_encoding", attempt, 200)
    expected = response.length
    if expected is not None and expected > MAX_BYTES:
        raise FetchFailed("payload_limit_exceeded", attempt, 200)
    body = bytearray()
    while chunk := response.read1(64 * 1024):
        body.extend(chunk)
        if len(body) > MAX_BYTES:
            raise FetchFailed("payload_limit_exceeded", attempt, 200)
    if expected is not None and len(body) != expected:
        raise FetchFailed("incomplete_payload", attempt, 200)
    return bytes(body)


def fetch_fixture(
    url: str,
    validators: Validators,
    *,
    timeout: float,
    max_attempts: int,
    wait: Callable[[float], None] = sleep,
) -> FetchResult:
    target = fixture_target(url)
    conditional = validators.headers()
    headers = {"User-Agent": USER_AGENT, "Accept-Encoding": "identity", **conditional}

    for attempt in range(1, max_attempts + 1):
        connection = HTTPConnection("127.0.0.1", 5284, timeout=timeout)
        status = None
        retry_after = 0.0
        deadline = monotonic() + timeout
        timer = None
        try:
            connection.connect()
            connection_socket = connection.sock
            remaining = deadline - monotonic()
            if remaining <= 0:
                raise TimeoutError

            def interrupt_read(sock=connection_socket):
                try:
                    sock.shutdown(SHUT_RDWR)
                except OSError:
                    pass

            # The socket timeout limits inactivity. This timer also bounds
            # a response that drips headers or a body until the deadline.
            timer = Timer(remaining, interrupt_read)
            timer.daemon = True
            timer.start()
            connection.request("GET", target, headers=headers)
            with connection.getresponse() as response:
                if monotonic() >= deadline:
                    raise TimeoutError
                status = response.status
                if status == 200:
                    body = _read_csv(response, attempt)
                    if monotonic() >= deadline:
                        raise TimeoutError
                    observed = Validators(response.getheader("ETag"), response.getheader("Last-Modified"))
                    return FetchResult(status, attempt, observed, body, response.getheader("Content-Type"))
                if status == 304:
                    if not conditional:
                        raise FetchFailed("unexpected_not_modified", attempt, status)
                    return FetchResult(status, attempt, validators)
                if status != 429 and not 500 <= status <= 599:
                    raise FetchFailed("unexpected_http_status", attempt, status)
                reason = "retryable_http_status"
                retry_after = _retry_after_seconds(response.getheader("Retry-After"))
        except FetchFailed:
            if monotonic() < deadline:
                raise
            reason = "http_timeout"
        except (OSError, HTTPException) as exc:
            timed_out = isinstance(exc, TimeoutError) or monotonic() >= deadline
            reason = "http_timeout" if timed_out else "http_transport_failure"
        finally:
            if timer is not None:
                timer.cancel()
            connection.close()

        if attempt == max_attempts or retry_after > 5:
            raise FetchFailed(reason, attempt, status)
        wait(max(retry_after, min(5, 0.25 * 2 ** (attempt - 1))))

    raise AssertionError("max_attempts must be positive")
