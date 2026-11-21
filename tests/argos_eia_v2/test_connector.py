import json
import socket
from datetime import UTC, datetime, timedelta
from decimal import Decimal
from email.utils import format_datetime
from pathlib import Path

import pytest

from app.adapters.argos_eia_v2.connector import EiaConnector, HttpResponse
from app.adapters.argos_eia_v2.series import MAX_RESPONSE_BYTES, UNIT, Window

WINDOW = Window("2024-01", "2024-02")
EPOCH = datetime(2024, 5, 1, tzinfo=UTC)
FIXTURE = Path(__file__).parent / "fixtures" / "co_res_monthly_synthetic.json"


class Replay:
    """Scripted transport and advancing clock. Retries consume zero real time."""

    def __init__(self, *responses, jitter=lambda: 0.0):
        self.responses = iter(responses)
        self.calls = []
        self.delays = []
        self.seconds = 0.0
        self.connector = EiaConnector(
            self.request,
            clock=self.now,
            monotonic=lambda: self.seconds,
            sleep=self.sleep,
            jitter=jitter,
        )

    def request(self, route, query, *, timeout):
        self.calls.append((route, dict(query), timeout, self.seconds))
        response = next(self.responses)
        if isinstance(response, OSError):
            raise response
        return response

    def now(self):
        return EPOCH + timedelta(seconds=self.seconds)

    def sleep(self, seconds):
        self.delays.append(seconds)
        self.seconds += seconds


@pytest.fixture(autouse=True)
def forbid_network(monkeypatch):
    def fail(*args, **kwargs):
        pytest.fail("NIV-87 tests require an offline transport")

    monkeypatch.setattr(socket, "create_connection", fail)
    monkeypatch.setattr(socket.socket, "connect", fail)
    monkeypatch.setattr(socket.socket, "connect_ex", fail)


@pytest.fixture
def document():
    return json.loads(FIXTURE.read_bytes())


def json_response(document):
    return HttpResponse(
        200, {"Content-Type": "application/json; charset=UTF-8"}, json.dumps(document).encode()
    )


def test_bounded_request_and_provenance(document):
    replay = Replay(json_response(document))
    result = replay.connector.collect(WINDOW)

    assert replay.calls == [
        (
            "https://api.eia.gov/v2/electricity/retail-sales/data",
            {
                "frequency": "monthly",
                "data[]": "price",
                "facets[stateid][]": "CO",
                "facets[sectorid][]": "RES",
                "start": "2023-12-31",
                "end": "2024-02-01",
                "sort[0][column]": "period",
                "sort[0][direction]": "asc",
                "offset": "0",
                "length": "2",
            },
            5.0,
            0.0,
        )
    ]
    assert result.status == "complete"
    assert result.environment == "fixture"
    assert result.source_id == "eia.electricity.retail_sales.co.res.price.monthly"
    assert result.canonical_route == replay.calls[0][0]
    assert result.rights_summary_state == "unknown"
    assert result.rights_record_ref is None
    assert result.adapter_version == "0.1.0"
    assert result.api_version == "2.1.12"
    assert result.attempts == 1
    assert result.ref_period == result.history.last_success_ref_period == "2024-02"
    assert result.last_success_at == result.checked_at == EPOCH
    jan, feb = result.history.versions
    assert (jan.ref_period, feb.ref_period) == WINDOW.periods
    assert jan.published_value == "42.01"
    assert jan.value == Decimal("42.01")
    assert jan.unit == UNIT
    assert jan.published_at is None
    assert jan.collected_at == EPOCH
    assert jan.api_version == "2.1.12"
    assert jan.supersedes is None


def test_no_default_transport_even_with_environment_key(monkeypatch):
    monkeypatch.setenv("EIA_API_KEY_DEV", "synthetic-key-used-only-by-this-test")
    result = EiaConnector(clock=lambda: EPOCH).collect(WINDOW)
    assert result.status == "disabled"
    assert result.attempts == 0
    assert result.ref_period is None
    assert result.last_success_at is None
    assert [row.coverage for row in result.periods] == ["unverified", "unverified"]


@pytest.mark.parametrize(
    ("start", "end"),
    [
        ("2023-12", "2023-11"),
        ("2024-01", "2025-02"),
        ("2000-12", "2001-01"),
        ("2024-1", "2024-02"),
        ("2024-00", "2024-02"),
        ("2024-01", "2024-13"),
        ("2024-01-01", "2024-02"),
    ],
)
def test_out_of_scope_windows(start, end):
    with pytest.raises(ValueError):
        Window(start, end)


def test_inclusive_query_across_a_leap_month():
    params = dict(Window("2024-03", "2024-03").query())
    assert params["start"] == "2024-02-29"
    assert params["end"] == "2024-03-01"
    assert params["length"] == "1"
    assert len(Window("2025-08", "2026-08").periods) == 13


def test_technical_version_and_echo_are_separate_from_price_identity(document):
    base = json_response(document)
    document["apiVersion"] = "2.1.13"
    key = "synthetic-only-echo-value"
    document["request"]["params"]["api_key"] = key
    replay = Replay(base, json_response(document))
    initial = replay.connector.collect(WINDOW)
    same_prices = replay.connector.collect(WINDOW, previous=initial.history)
    assert same_prices.api_version == "2.1.13"
    assert same_prices.history.versions == initial.history.versions
    assert same_prices.periods[0].version.api_version == "2.1.12"
    assert key not in repr(same_prices)
    assert all("api_key" not in query for _, query, _, _ in replay.calls)


def test_technical_version_may_be_absent(document):
    del document["apiVersion"]
    result = Replay(json_response(document)).connector.collect(WINDOW)
    assert result.status == "complete"
    assert result.api_version is None
    assert result.periods[0].version.api_version is None


def test_idempotency_and_revision_reverting_to_prior_value(document):
    initial_response = json_response(document)
    rows = document["response"]["data"]
    rows[0]["price"] = "42.0100"
    rows.reverse()
    equivalent = json_response(document)
    rows[1]["price"] = "42.11"
    revision = json_response(document)
    replay = Replay(initial_response, equivalent, revision, initial_response)

    first = replay.connector.collect(WINDOW)
    same = replay.connector.collect(WINDOW, previous=first.history)
    change = replay.connector.collect(WINDOW, previous=same.history)
    revert = replay.connector.collect(WINDOW, previous=change.history)

    assert same.history.versions == first.history.versions
    assert same.last_success_at > first.last_success_at
    assert same.periods[0].version.collected_at == first.checked_at
    assert change.history.versions[:2] == first.history.versions
    assert change.history.versions[2].supersedes == first.periods[0].version.version_id
    assert revert.history.versions[3].published_value == first.periods[0].version.published_value
    assert revert.history.versions[3].supersedes == change.periods[0].version.version_id
    assert revert.history.versions[3].version_id != first.periods[0].version.version_id
    assert Replay(equivalent).connector.collect(WINDOW).periods[0].version.version_id == (
        first.periods[0].version.version_id
    )


def test_zero_null_and_disappearing_month_are_distinct(document):
    original = json_response(document)
    payload = document["response"]
    payload["data"][0]["price"] = "0"
    payload["data"].pop()
    payload["total"] = "1"
    one_row = json_response(document)
    payload["data"][0]["price"] = None
    null_row = json_response(document)
    replay = Replay(original, one_row, null_row)

    first = replay.connector.collect(WINDOW)
    partial = replay.connector.collect(WINDOW, previous=first.history)
    empty = replay.connector.collect(WINDOW, previous=partial.history)

    assert partial.status == "partial"
    assert partial.periods[0].version.value == Decimal(0)
    assert partial.periods[1].coverage == "missing_row"
    assert partial.periods[1].coverage_lost
    assert partial.periods[1].version is None
    assert partial.ref_period == "2024-01"
    assert partial.last_success_at == first.last_success_at
    assert partial.history.last_success_ref_period == "2024-02"
    assert empty.status == "no_data"
    assert empty.periods[0].coverage == "missing_value"
    assert empty.periods[0].coverage_lost
    assert empty.ref_period is None
    assert empty.history == partial.history


def test_empty_page_and_http_not_found_are_distinct(document):
    document["response"].update(total="0", data=[])
    replay = Replay(json_response(document), HttpResponse(404, {}, b""))
    empty = replay.connector.collect(WINDOW)
    missing = replay.connector.collect(WINDOW, previous=empty.history)
    assert empty.status == "no_data"
    assert all(row.coverage == "missing_row" for row in empty.periods)
    assert missing.status == "not_found"
    assert all(row.coverage == "unverified" for row in missing.periods)
    assert empty.history == missing.history


@pytest.mark.parametrize(
    ("field", "value"),
    [
        ("stateid", "NY"),
        ("sectorid", "ALL"),
        ("period", "2024-03"),
        ("period", "2024-01"),
        ("price-units", "dollars per kilowatthour"),
        ("price", 42.12),
        ("price", "NaN"),
        ("price", "W"),
        ("price", "Infinity"),
        ("price", "-1"),
    ],
)
def test_invalid_row_rejects_the_whole_page(document, field, value):
    initial = json_response(document)
    document["response"]["data"][0]["price"] = "42.11"
    document["response"]["data"][1][field] = value
    replay = Replay(initial, json_response(document))
    prior = replay.connector.collect(WINDOW)
    result = replay.connector.collect(WINDOW, previous=prior.history)
    assert result.status == "invalid_response"
    assert result.history is prior.history
    assert all(row.coverage == "unverified" and row.version is None for row in result.periods)


@pytest.mark.parametrize(
    "patch",
    [
        {"total": "3"},
        {"total": 2},
        {"frequency": "annual"},
        {"dateFormat": "YYYY"},
        {"warnings": ["truncated"]},
        {"data": [{"period": "2024-01", "stateid": "CO", "sectorid": "RES", "price-units": UNIT}]},
    ],
)
def test_invalid_response_metadata_or_missing_field(document, patch):
    document["response"].update(patch)
    if "data" in patch:
        document["response"]["total"] = "1"
    assert Replay(json_response(document)).connector.collect(WINDOW).status == "invalid_response"


@pytest.mark.parametrize(
    ("content_type", "body"),
    [
        ("text/html", b"<h1>Service unavailable</h1>"),
        ("application/json", b"{incomplete"),
        ("application/json", b"\xff"),
        ("application/json", b" " * (MAX_RESPONSE_BYTES + 1)),
        ("application/json", b'{"response": {}, "response": {}}'),
        ("application/json", b'{"error": "wrong data column", "code": 400}'),
        ("application/json", b'{"warning": "possible truncation", "response": {}}'),
        ("application/json", b'{"apiVersion": "unexpected-token", "response": {}}'),
    ],
    ids=[
        "media-type", "malformed-json", "invalid-encoding", "body-limit",
        "duplicate-keys", "api-error", "truncation-warning", "invalid-api-version",
    ],
)
def test_invalid_http_payload(content_type, body):
    reply = HttpResponse(200, {"content-type": content_type}, body)
    result = Replay(reply).connector.collect(WINDOW)
    assert result.status == "invalid_response"
    assert result.attempts == 1


@pytest.mark.parametrize("status", [400, 401, 403, 404, 422, 301])
def test_permanent_failure_or_redirect_does_not_retry(status):
    reply = HttpResponse(status, {"Location": "https://invalid.example"}, b"test-provider-detail")
    replay = Replay(reply)
    result = replay.connector.collect(WINDOW)
    expected = {401: "access_denied", 403: "access_denied", 404: "not_found"}
    assert result.status == expected.get(status, "request_rejected")
    assert result.attempts == 1
    assert not replay.delays
    assert "test-provider-detail" not in repr(result)
    assert "invalid.example" not in repr(reply)


def test_recovers_from_429_then_503_with_bounded_attempts(document):
    deadline = format_datetime(EPOCH + timedelta(seconds=4), usegmt=True)
    replay = Replay(
        HttpResponse(429, {"Retry-After": "2"}, b""),
        HttpResponse(503, {"retry-after": deadline}, b""),
        json_response(document),
    )
    result = replay.connector.collect(WINDOW)
    assert result.status == "complete"
    assert result.attempts == 3
    assert replay.delays == [2, 2]
    assert result.last_success_at == EPOCH + timedelta(seconds=4)


def test_backoff_jitter_respects_retry_after_lower_bound(document):
    replay = Replay(
        HttpResponse(429, {"Retry-After": "2"}, b""),
        HttpResponse(503, {}, b""),
        json_response(document),
        jitter=lambda: 0.25,
    )
    assert replay.connector.collect(WINDOW).status == "complete"
    assert replay.delays == [2, 2.25]


def test_long_retry_after_survives_another_invocation(document):
    replay = Replay(HttpResponse(429, {"Retry-After": "90"}, b""), json_response(document))
    assert replay.connector.collect(WINDOW).status == "rate_limited"
    blocked = replay.connector.collect(WINDOW)
    assert blocked.status == "rate_limited"
    assert blocked.attempts == 0
    assert not replay.delays
    replay.seconds = 90
    assert replay.connector.collect(WINDOW).status == "complete"


def test_exhausted_transient_retries_keep_prior_success_and_hide_error_details(document):
    replay = Replay(
        json_response(document),
        HttpResponse(503, {"Retry-After": "malformed"}, b"test-provider-detail"),
        TimeoutError("secret-in-exception"),
        OSError("secret-in-exception"),
    )
    success = replay.connector.collect(WINDOW)
    failed = replay.connector.collect(WINDOW, previous=success.history)
    assert failed.status == "transport_error"
    assert failed.attempts == 3
    assert replay.delays == [1, 1, 2]
    assert failed.history is success.history
    assert failed.last_success_at == EPOCH
    assert failed.ref_period is None
    assert "secret-in-exception" not in repr(failed)
