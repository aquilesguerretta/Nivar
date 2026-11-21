import os
from concurrent.futures import ThreadPoolExecutor
from dataclasses import replace
from datetime import datetime, timedelta, timezone
from threading import Event
from uuid import UUID

import pytest
from alembic import command
from alembic.config import Config
from sqlalchemy import create_engine, func, select, text
from sqlalchemy.exc import DBAPIError
from sqlalchemy.orm import sessionmaker

from app.db.models.argos_memory import ArgosRawArtifact, ArgosSnapshot
from app.scripts.diff_argos_ons_capacidade_geracao import build_diff_report
from app.scripts.ingest_argos_ons_capacidade_geracao import RIGHTS_RECORD_REF, SOURCE_ID
from app.services.argos_memory import reconstruct_snapshot
from app.services.argos_source_watch.http import FetchFailed, Validators, fetch_fixture
from app.services.argos_source_watch.rights import ArchiveRequest, SourceId, synthetic_archive_policy
from app.services.argos_source_watch.worker import FIXTURE_SOURCE_ID, SourceWatch, WatchConfig
from tests.argos_source_watch.fixture_server import LAST_MODIFIED, URL, Reply, archived_fixtures, fixture_server, script

VERIFY_DATABASE = "postgresql://argos_watch@127.0.0.1:54884/argos_watch_verify"


@pytest.fixture
def sessions(monkeypatch):
    if os.environ.get("ARGOS_WATCH_TEST_POSTGRES") != "1":
        pytest.skip("set ARGOS_WATCH_TEST_POSTGRES=1 with the disposable argos_watch_verify database")
    monkeypatch.setenv("DATABASE_URL", VERIFY_DATABASE)
    command.upgrade(Config("alembic.ini"), "0011")
    engine = create_engine(VERIFY_DATABASE)
    try:
        with engine.begin() as connection:
            connection.execute(text("TRUNCATE argos_snapshot, argos_raw_artifact"))
        yield sessionmaker(engine)
    finally:
        engine.dispose()


def test_scheduled_update_failures_recovery_and_immutable_history(sessions, monkeypatch):
    clock = datetime.now(timezone.utc)
    waits = []

    def advance(seconds):
        nonlocal clock
        waits.append(seconds)
        clock += timedelta(seconds=seconds)

    monkeypatch.setattr("app.services.argos_source_watch.worker.uniform", lambda low, high: high / 2)
    watch = SourceWatch(
        URL, sessions, WatchConfig(interval=1, jitter=0.2, stale_after=1.3),
        policy=synthetic_archive_policy(URL), now=lambda: clock, wait=advance,
    )
    assert watch.report()["status"] == "not_checked"
    with fixture_server([*script(), Reply(200, b"not a CSV"), Reply(403)]) as (requests, _):
        reports = list(watch.run(6))
        malformed = watch.check()
        forbidden = watch.check()

    assert [report["status"] for report in reports] == [
        "last_success", "no_content_change", "stale", "changed", "no_content_change", "no_content_change",
    ]
    first, conditional, stale, changed, reordered, identical = reports
    assert requests[1][1]["If-None-Match"] == '"a"'
    assert requests[1][1]["If-Modified-Since"] == LAST_MODIFIED
    assert conditional["basis"] == "http_not_modified"
    assert conditional["evidence"]["snapshot_id"] == first["evidence"]["snapshot_id"]
    assert stale["last_outcome"] == "failed"
    assert stale["last_success_at"] == conditional["last_success_at"]
    assert stale["http_status"] == 503
    assert "evidence" not in stale
    assert changed["evidence"]["delta"]["counts"] == {"added": 0, "removed": 0, "changed": 1}
    assert changed["signal"]["evaluation"] == "not_run"
    assert changed["signal"]["claim_published"] is False
    assert changed["publisher_revision_confirmed"] is False
    assert reordered["evidence"]["snapshot_byte_relation"] == "changed"
    assert reordered["evidence"]["delta"]["content_equal"] is True
    assert identical["basis"] == "identical_sha256"
    assert identical["captured"] is False
    assert identical["metrics"] == {
        "checks": 6, "successes": 5, "failures": 1, "consecutive_failures": 0,
        "rights_holds": 0, "skipped_busy": 0, "http_attempts": 9, "retries": 3, "captures": 3,
    }
    assert waits == [1.1, 1.1, 0.25, 0.5, 1.1, 0.25, 1.1, 1.1]
    assert malformed["status"] == "failed"
    assert malformed["reason"] == "ons_schema_or_diff_rejected"
    assert forbidden["status"] == "failed" and forbidden["http_status"] == 403
    assert forbidden["last_success_at"] == identical["last_success_at"]

    baseline, modified, order_only = archived_fixtures()
    first_id = UUID(first["evidence"]["snapshot_id"])
    changed_id = UUID(changed["evidence"]["snapshot_id"])
    reordered_id = UUID(reordered["evidence"]["snapshot_id"])
    with sessions() as db:
        assert db.scalar(select(func.count()).select_from(ArgosSnapshot)) == 3
        assert db.scalar(select(func.count()).select_from(ArgosRawArtifact)) == 3
        for report, expected in zip((first, changed, reordered), (baseline, modified, order_only)):
            snapshot, payload = reconstruct_snapshot(db, UUID(report["evidence"]["snapshot_id"]))
            assert payload == expected
            assert snapshot.source_id == FIXTURE_SOURCE_ID
            assert snapshot.rights_record_ref == RIGHTS_RECORD_REF
            assert snapshot.published_at is None
            assert snapshot.acquisition_metadata["mode"] == "non_prod_synthetic"
        delta = build_diff_report(db, first_id, changed_id)
        assert delta["changed"][0]["row_identity"] == "TEST-EQ-002"
        assert delta["changed"][0]["changed_fields"] == [
            {"field": "val_potenciaefetiva", "before": "20.0", "after": "22.5"},
        ]
        assert db.get(ArgosSnapshot, changed_id).prior_snapshot_id == first_id
        assert db.get(ArgosSnapshot, reordered_id).prior_snapshot_id == changed_id
        with pytest.raises(DBAPIError, match="immutable"):
            db.execute(text("UPDATE argos_snapshot SET published_at = now() WHERE id = :id"), {"id": first_id})


def test_overlapping_workers_do_not_append_duplicate_check(sessions):
    a, b, _ = archived_fixtures()
    release = Event()
    policy = synthetic_archive_policy(URL)
    first = SourceWatch(URL, sessions, WatchConfig(), policy=policy)
    other = SourceWatch(URL, sessions, WatchConfig(), policy=policy)
    replies = [Reply(200, a), Reply(200, b, release=release), Reply(200, b)]
    with fixture_server(replies) as (requests, received), ThreadPoolExecutor(1) as pool:
        assert first.check()["status"] == "last_success"
        received.clear()
        updating = pool.submit(first.check)
        try:
            assert received.wait(4)
            skipped = other.check()
            assert skipped["skipped"] == "source_check_in_progress"
            assert skipped["status"] == "not_checked"
            assert len(requests) == 2
        finally:
            release.set()
        assert updating.result(timeout=5)["status"] == "changed"
        assert other.check()["basis"] == "identical_sha256"
    with sessions() as db:
        assert db.scalar(select(func.count()).select_from(ArgosSnapshot)) == 2


def test_unavailable_or_incomplete_rights_stop_before_db_or_http():
    policy = synthetic_archive_policy(URL)
    grant = policy(ArchiveRequest(SourceId(SOURCE_ID), URL))

    def contacts_db():
        pytest.fail("rights must be evaluated before the database is opened")

    cases = [
        lambda request: replace(grant, channel_state="hold"),
        lambda request: replace(grant, attribution=None),
        lambda request: replace(grant, retention=None),
        lambda request: replace(grant, rights_record_ref="unreviewed"),
        synthetic_archive_policy(URL + ".other"),
    ]
    assert SourceWatch(URL, contacts_db, WatchConfig()).check()["status"] == "rights_hold"
    assert policy(ArchiveRequest(SourceId(SOURCE_ID), URL, "client_display")).allowed is False
    assert policy(ArchiveRequest(SourceId(SOURCE_ID), URL, "external_api")).allowed is False
    for policy in cases:
        report = SourceWatch(URL, contacts_db, WatchConfig(), policy=policy).check()
        assert report["status"] == "rights_hold"
        assert "evidence" not in report
        assert report["metrics"]["http_attempts"] == 0


@pytest.mark.parametrize("url", [
    "https://dados.ons.org.br/dataset/capacidade-geracao",
    "http://localhost:5284/capacity.csv",
    "http://127.0.0.1:5284@outside.invalid/file",
    "http://127.0.0.1:5285/capacity.csv",
])
def test_http_transport_is_confined_to_the_fixture(url):
    with pytest.raises(ValueError, match="synthetic HTTP URL"):
        fetch_fixture(url, Validators(), timeout=1, max_attempts=1)


def test_unconditional_304_redirect_truncation_and_retry_after_fail_closed():
    replies = [
        Reply(304), Reply(307, headers={"Location": "http://outside.invalid"}),
        Reply(200, b"short", headers={"Content-Length": "99"}),
        Reply(429, headers={"Retry-After": "30"}),
        Reply(200, b"delayed", delay=1),
    ]
    with fixture_server(replies) as (requests, _):
        for reason, attempts in (
            ("unexpected_not_modified", 3), ("unexpected_http_status", 3), ("incomplete_payload", 3),
            ("retryable_http_status", 3), ("http_timeout", 1),
        ):
            with pytest.raises(FetchFailed, match=reason) as failure:
                fetch_fixture(
                    URL, Validators(), timeout=0.4, max_attempts=attempts,
                    wait=lambda seconds: pytest.fail("no retry expected"),
                )
            assert failure.value.attempts == 1
        assert len(requests) == 5
