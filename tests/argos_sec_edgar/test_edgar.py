from __future__ import annotations

import json
import os
import subprocess
import sys
from datetime import date, datetime, timedelta, timezone
from pathlib import Path

import httpx
import pytest

from app.adapters.argos_sec_edgar import (
    SOURCE,
    EdgarClient,
    EdgarConfigurationError,
    EdgarPayloadError,
    EdgarRequestError,
)
from app.adapters.argos_sec_edgar import client as edgar_module
from app.adapters.argos_sec_edgar.client import DEVELOPMENT_ENV, USER_AGENT_ENV

FIXTURES = Path(__file__).parent / "fixtures"
USER_AGENT = "Fixture Harness metadata@fixture.invalid"
RECENT = "/submissions/CIK0001119639.json"
ARCHIVE = "/submissions/CIK0001119639-submissions-001.json"
ARCHIVE_2 = "/submissions/CIK0001119639-submissions-002.json"
ARCHIVE_3 = "/submissions/CIK0001119639-submissions-003.json"
LAST_MODIFIED = "Sat, 01 Jan 2000 00:00:00 GMT"


def payload(name):
    return json.loads((FIXTURES / f"submissions_{name}.json").read_text(encoding="utf-8"))


class Replay:
    def __init__(self, *responses):
        self.responses = iter(responses)
        self.requests = []
        self.time = 0.0

    def client(self):
        return EdgarClient(
            user_agent=USER_AGENT,
            transport=httpx.MockTransport(self.handle),
            clock=lambda: self.time,
            sleep=self.advance,
        )

    def advance(self, seconds):
        self.time += seconds

    def handle(self, request):
        assert request.method == "GET"
        assert request.url.scheme == "https"
        assert request.url.host == "data.sec.gov"
        assert request.headers["User-Agent"] == USER_AGENT
        assert request.headers["Accept"] == "application/json"
        self.requests.append((request, self.time))
        return next(self.responses)

    @property
    def paths(self):
        return [request.url.path for request, _ in self.requests]

    @property
    def times(self):
        return [started_at for _, started_at in self.requests]


def test_new_unchanged_corrected_amended_and_reverted_metadata():
    replay = Replay(
        httpx.Response(200, json=payload("initial"), headers={"ETag": '"a"', "Last-Modified": LAST_MODIFIED}),
        httpx.Response(304),
        httpx.Response(200, json=payload("corrected"), headers={"ETag": '"b"'}),
        httpx.Response(200, json=payload("initial")),
    )
    with replay.client() as client:
        first = client.poll()
        unchanged = client.poll()
        changed = client.poll()
        reverted = client.poll()

    assert replay.paths == [RECENT] * 4
    assert replay.times == [0, 1, 2, 3]
    assert replay.requests[1][0].headers["If-None-Match"] == '"a"'
    assert replay.requests[1][0].headers["If-Modified-Since"] == LAST_MODIFIED
    assert replay.requests[3][0].headers["If-None-Match"] == '"b"'
    assert "If-Modified-Since" not in replay.requests[3][0].headers
    assert first.checked_at.utcoffset() == timedelta(0)
    assert [change.kind for change in first.changes] == ["new", "new"]
    assert [change.kind for change in unchanged.changes] == ["unchanged", "unchanged"]
    assert unchanged.changes[1].version is first.changes[1].version
    assert [change.kind for change in changed.changes] == ["unchanged", "corrected", "new"]
    original = first.changes[1].version
    correction = changed.changes[1].version
    amendment = changed.changes[2].version
    assert original.metadata.form == "20-F"
    assert original.metadata.accepted_at == "2099-04-22T22:00:00.000Z"
    assert original.metadata.filed_on == date(2099, 4, 23)
    assert original.metadata.report_date == date(2098, 12, 31)
    assert original.metadata.source_id == SOURCE.source_id == "sec.edgar.submissions.0001119639"
    assert original.metadata.corporate_entity_ref == "sec-cik:0001119639"
    assert original.metadata.language is None
    assert original.metadata.evidence_scope == "edgar_filing_metadata"
    assert original.metadata.filing_content_scope == "filer_submission_unreviewed"
    assert original.metadata.original_url == (
        "https://www.sec.gov/Archives/edgar/data/1119639/000000000099000101/synthetic-annual.htm"
    )
    assert len(original.metadata_sha256) == 64
    assert correction.metadata.document_id == original.metadata.document_id
    assert correction.metadata_sha256 != original.metadata_sha256
    assert correction.supersedes_version_id == original.version_id
    assert correction.revision == 2
    assert amendment.metadata.is_amendment
    assert amendment.metadata.document_id != original.metadata.document_id
    assert amendment.supersedes_version_id is None
    # Dropping an accession from the next response does not declare a withdrawal.
    assert [change.kind for change in reverted.changes] == ["unchanged", "corrected"]
    reversion = reverted.changes[1].version
    assert reversion.metadata_sha256 == original.metadata_sha256
    assert reversion.version_id != original.version_id
    assert reversion.supersedes_version_id == correction.version_id
    assert reversion.revision == 3


def test_identical_metadata_with_reordered_columns_and_unrelated_fields():
    initial = payload("initial")
    rewritten = payload("initial")
    for values in rewritten["filings"]["recent"].values():
        values.reverse()
    rewritten["filings"]["recent"]["primaryDocDescription"] = ["Synthetic", "Synthetic"]
    with Replay(httpx.Response(200, json=initial), httpx.Response(200, json=rewritten)).client() as client:
        first = client.poll()
        second = client.poll()
    assert [change.version for change in first.changes] == [change.version for change in second.changes]
    assert all(change.kind == "unchanged" for change in second.changes)


def test_archive_is_bounded_and_conditionally_refetched_after_recent_304():
    initial = payload("initial")
    initial["filings"]["files"].extend(
        {"name": f"CIK0001119639-submissions-{index:03d}.json"} for index in range(2, 5)
    )
    replay = Replay(
        httpx.Response(200, json=initial, headers={"ETag": '"recent"'}),
        httpx.Response(200, json=payload("archive"), headers={"ETag": '"archive"'}),
        httpx.Response(200, json=payload("archive")),
        httpx.Response(200, json=payload("archive")),
        httpx.Response(304),
        httpx.Response(304),
    )
    with replay.client() as client:
        first = client.poll(archive_pages=3)
        second = client.poll(archive_pages=1)
    assert replay.paths == [RECENT, ARCHIVE, ARCHIVE_2, ARCHIVE_3, RECENT, ARCHIVE]
    assert replay.times == [0, 1, 2, 3, 4, 5]
    assert first.archive_pages_available == second.archive_pages_available == 4
    assert first.archive_pages_read == 3
    assert second.archive_pages_read == 1
    assert len(first.changes) == len(second.changes) == 3
    assert replay.requests[-1][0].headers["If-None-Match"] == '"archive"'
    old = second.changes[0].version.metadata
    assert old.accepted_at is None
    assert old.primary_document is None
    assert old.original_url.endswith("/0000000000-98-000099-index.html")


def test_failed_archive_leaves_cache_and_versions_unchanged():
    replay = Replay(
        httpx.Response(200, json=payload("initial"), headers={"ETag": '"old"'}),
        httpx.Response(200, json=payload("corrected"), headers={"ETag": '"new"'}),
        httpx.Response(503),
        httpx.Response(304),
    )
    with replay.client() as client:
        first = client.poll()
        with pytest.raises(EdgarRequestError) as failed:
            client.poll(archive_pages=1)
        previous = client.poll()
    assert failed.value.status_code == 503
    assert replay.requests[-1][0].headers["If-None-Match"] == '"old"'
    assert [change.version for change in previous.changes] == [change.version for change in first.changes]


def test_inclusive_filing_window_skips_archive_outside_coverage():
    replay = Replay(
        httpx.Response(200, json=payload("initial")),
        httpx.Response(200, json=payload("initial")),
        httpx.Response(200, json=payload("archive")),
    )
    one_day = date(2099, 4, 23)
    with replay.client() as client:
        recent = client.poll(archive_pages=3, filed_from=one_day, filed_through=one_day)
        archive = client.poll(
            archive_pages=3, filed_from=date(2098, 1, 1), filed_through=date(2098, 11, 10)
        )
    assert replay.paths == [RECENT, RECENT, ARCHIVE]
    assert recent.archive_pages_available == recent.archive_pages_read == 0
    assert recent.filed_from == recent.filed_through == one_day
    assert [change.version.metadata.filed_on for change in recent.changes] == [one_day]
    assert archive.archive_pages_available == archive.archive_pages_read == 1
    assert [change.version.metadata.filed_on for change in archive.changes] == [date(2098, 11, 10)]


def test_empty_feed_is_not_a_no_change_result():
    initial = payload("initial")
    initial["filings"]["recent"] = {"accessionNumber": [], "form": [], "filingDate": []}
    replay = Replay(httpx.Response(200, json=initial))
    with replay.client() as client, pytest.raises(EdgarPayloadError, match="empty"):
        client.poll()


def test_conflicting_duplicate_accession_fails_entire_poll():
    recent = payload("initial")
    overlap = {key: values[:1] for key, values in recent["filings"]["recent"].items()}
    overlap["primaryDocument"] = ["synthetic-conflict.htm"]
    replay = Replay(httpx.Response(200, json=recent), httpx.Response(200, json=overlap))
    with replay.client() as client, pytest.raises(EdgarPayloadError, match="Conflicting SEC metadata"):
        client.poll(archive_pages=1)


@pytest.mark.parametrize("pages", [-1, 4, 1.5, True])
def test_invalid_page_budget_never_requests(pages):
    replay = Replay()
    with replay.client() as client, pytest.raises(ValueError, match="archive_pages"):
        client.poll(archive_pages=pages)
    assert replay.requests == []


@pytest.mark.parametrize("name", [
    "../CIK0001119639-submissions-001.json",
    "https://somewhere.invalid/CIK0001119639-submissions-001.json",
    "CIK0000000001-submissions-001.json",
    "CIK0001119639-submissions-001.json?next=1",
])
def test_untrusted_archive_name_never_fetched(name):
    initial = payload("initial")
    initial["filings"]["files"][0]["name"] = name
    replay = Replay(httpx.Response(200, json=initial))
    with replay.client() as client, pytest.raises(EdgarPayloadError, match="archive filename"):
        client.poll(archive_pages=1)
    assert replay.paths == [RECENT]


def test_bad_filer_or_column_cannot_be_returned_as_unchanged():
    wrong_filer = payload("initial")
    wrong_filer["cik"] = "0000000000"
    misaligned = payload("initial")
    misaligned["filings"]["recent"]["form"].pop()
    replay = Replay(httpx.Response(200, json=wrong_filer), httpx.Response(200, json=misaligned))
    with replay.client() as client:
        with pytest.raises(EdgarPayloadError, match="filer CIK"):
            client.poll()
        with pytest.raises(EdgarPayloadError, match="column: form"):
            client.poll()


def test_unsolicited_304_is_not_a_success():
    with Replay(httpx.Response(304)).client() as client, pytest.raises(EdgarPayloadError, match="304"):
        client.poll()


def test_403_stops_requests_and_blocks_subsequent_calls_during_cooldown():
    replay = Replay(
        httpx.Response(200, json=payload("initial"), headers={"ETag": '"a"'}),
        httpx.Response(403, text="synthetic error body"),
        httpx.Response(304),
    )
    with replay.client() as client:
        client.poll()
        with pytest.raises(EdgarRequestError, match="HTTP 403") as failed:
            client.poll()
        assert failed.value.status_code == 403
        assert failed.value.retry_after_seconds == 600
        with pytest.raises(EdgarRequestError, match="cooldown"):
            client.poll()
        replay.advance(600)
        recovered = client.poll()
    assert replay.times == [0, 1, 601]
    assert all(change.kind == "unchanged" for change in recovered.changes)


@pytest.mark.parametrize("retry_after", [None, "7"])
def test_429_enforces_sec_cooldown_before_caller_retry(retry_after):
    headers = {"Retry-After": retry_after} if retry_after else {}
    replay = Replay(
        httpx.Response(429, headers=headers),
        httpx.Response(200, json=payload("initial")),
    )
    with replay.client() as client:
        with pytest.raises(EdgarRequestError, match="HTTP 429") as failed:
            client.poll()
        assert failed.value.retry_after_seconds == 600
        with pytest.raises(EdgarRequestError, match="cooldown"):
            client.poll()
        replay.advance(600)
        assert len(client.poll().changes) == 2
    assert replay.times == [0, 600]


def test_long_retry_after_has_no_automatic_retry():
    replay = Replay(httpx.Response(429, headers={"Retry-After": "900"}))
    with replay.client() as client:
        with pytest.raises(EdgarRequestError, match="HTTP 429") as failed:
            client.poll()
        assert failed.value.retry_after_seconds == 900
        replay.advance(870)
        with pytest.raises(EdgarRequestError, match="cooldown") as paused:
            client.poll()
        assert paused.value.retry_after_seconds == 30
    assert replay.paths == [RECENT]


def test_retry_after_supports_http_date(monkeypatch):
    class FixedDatetime(datetime):
        @classmethod
        def now(cls, tz=None):
            return cls(2099, 5, 12, 0, 0, tzinfo=tz)

    monkeypatch.setattr(edgar_module, "datetime", FixedDatetime)
    replay = Replay(httpx.Response(429, headers={"Retry-After": "Tue, 12 May 2099 00:20:00 GMT"}))
    with replay.client() as client, pytest.raises(EdgarRequestError) as failed:
        client.poll()
    assert failed.value.retry_after_seconds == 1200


def test_redirect_is_rejected_without_following_location():
    replay = Replay(httpx.Response(302, headers={"Location": "https://elsewhere.invalid"}))
    with replay.client() as client, pytest.raises(EdgarRequestError, match="HTTP 302"):
        client.poll()
    assert replay.paths == [RECENT]


@pytest.mark.parametrize("response", [
    httpx.Response(200, text="synthetic html", headers={"Content-Type": "text/html"}),
    httpx.Response(200, content=b"{", headers={"Content-Type": "application/json"}),
])
def test_non_json_and_invalid_json_fail(response):
    with Replay(response).client() as client, pytest.raises(EdgarPayloadError):
        client.poll()


@pytest.mark.parametrize("user_agent", [None, "", "Generic/1.0", "Agent metadata@fixture.invalid\r\nOther: x"])
def test_missing_or_invalid_user_agent_fails_before_request(user_agent):
    transport = httpx.MockTransport(lambda _: pytest.fail("unexpected request"))
    with pytest.raises(EdgarConfigurationError, match=USER_AGENT_ENV):
        EdgarClient(user_agent=user_agent, transport=transport)


def test_live_requires_development_explicit_opt_in_and_real_contact(monkeypatch):
    # Every invocation fails during configuration, before a transport is created.
    monkeypatch.setenv(DEVELOPMENT_ENV, "development")
    monkeypatch.setenv(USER_AGENT_ENV, USER_AGENT)
    monkeypatch.delenv("APP_ENV", raising=False)
    monkeypatch.delenv("RAILWAY_ENVIRONMENT", raising=False)
    monkeypatch.delenv("VERCEL_ENV", raising=False)
    with pytest.raises(EdgarConfigurationError, match="--allow-live"):
        EdgarClient()
    with pytest.raises(EdgarConfigurationError, match="real contact"):
        EdgarClient(allow_live=True)
    monkeypatch.delenv(USER_AGENT_ENV)
    with pytest.raises(EdgarConfigurationError, match=USER_AGENT_ENV):
        EdgarClient(allow_live=True)
    monkeypatch.setenv("RAILWAY_ENVIRONMENT", "production")
    with pytest.raises(EdgarConfigurationError, match="outside deployments"):
        EdgarClient(allow_live=True)


def test_default_transport_clients_share_rate_and_cooldown_without_network(monkeypatch):
    replay = Replay(httpx.Response(200, json=payload("initial")), httpx.Response(429))
    create_client = httpx.Client
    gate = edgar_module._RequestGate(lambda: replay.time, replay.advance)

    def mock_default_transport(**kwargs):
        assert kwargs["transport"] is None
        kwargs["transport"] = httpx.MockTransport(replay.handle)
        return create_client(**kwargs)

    monkeypatch.setattr(edgar_module, "_LIVE_GATE", gate)
    monkeypatch.setattr(edgar_module, "_validate_user_agent", lambda agent, *, live: USER_AGENT)
    monkeypatch.setattr(edgar_module.httpx, "Client", mock_default_transport)
    monkeypatch.setenv(DEVELOPMENT_ENV, "development")
    for name in ("APP_ENV", "RAILWAY_ENVIRONMENT", "VERCEL_ENV"):
        monkeypatch.delenv(name, raising=False)

    with EdgarClient(allow_live=True) as first, EdgarClient(allow_live=True) as second:
        first.poll()
        with pytest.raises(EdgarRequestError, match="HTTP 429"):
            second.poll()
        with pytest.raises(EdgarRequestError, match="cooldown"):
            first.poll()
    assert replay.times == [0, 1]


def test_command_requires_live_flag_and_development():
    env = dict(os.environ)
    env[DEVELOPMENT_ENV] = "production"
    env.pop(USER_AGENT_ENV, None)
    result = subprocess.run(
        [sys.executable, "-m", "app.adapters.argos_sec_edgar", "--allow-live"],
        capture_output=True,
        text=True,
        timeout=15,
        env=env,
    )
    assert result.returncode == 1
    assert "development" in result.stderr
    assert result.stdout == ""


def test_candidate_denies_known_and_unknown_rights_channels():
    assert SOURCE.policy_version == 1
    assert SOURCE.rights_record_ref is None
    assert SOURCE.allowed_use_modes == frozenset()
    assert SOURCE.channel_state("local_archive") == "unknown"
    assert SOURCE.channel_state("client_display") == "unknown"
    assert SOURCE.channel_state("external_api") == "unknown"
    assert SOURCE.channel_state("unrecognized") == "denied"
