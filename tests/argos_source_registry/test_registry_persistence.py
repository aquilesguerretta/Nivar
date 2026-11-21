from concurrent.futures import ThreadPoolExecutor
from datetime import UTC, datetime, timedelta
import os
from threading import Barrier

import pytest
from alembic import command
from alembic.config import Config
from pydantic import ValidationError
from sqlalchemy import create_engine, select, text
from sqlalchemy.engine import make_url
from sqlalchemy.exc import DBAPIError
from sqlalchemy.orm import Session

from app.db.models.argos_source_registry import ArgosSourceRevision
from app.services.argos_memory import capture_snapshot, reconstruct_snapshot
from app.services.argos_source_registry import (
    ChannelState,
    DecisionReason,
    HealthStatus,
    SourceId,
    SourceRegistryConflict,
    UsageChannel,
    read_source,
    record_source_check,
    register_source,
    revise_source,
)
from app.services.argos_source_registry.seed import ONS_CAPACITY_SOURCE

T0 = datetime(2026, 9, 16, tzinfo=UTC)
SOURCE_ID = ONS_CAPACITY_SOURCE.source_id
LOCAL = UsageChannel.LOCAL_ARCHIVE


@pytest.fixture(scope="module")
def engine():
    url = os.getenv("ARGOS_SOURCE_REGISTRY_TEST_DATABASE_URL")
    if not url:
        pytest.skip("set ARGOS_SOURCE_REGISTRY_TEST_DATABASE_URL to an empty disposable local PostgreSQL database")
    if make_url(url).host not in {"127.0.0.1", "localhost", "::1"}:
        pytest.fail("registry migration tests require local disposable PostgreSQL")
    engine = create_engine(url, hide_parameters=True)
    config = Config("alembic.ini")
    with pytest.MonkeyPatch.context() as env:
        env.setenv("DATABASE_URL", url)
        command.upgrade(config, "head")
        try:
            yield engine
        finally:
            engine.dispose()
            command.downgrade(config, "base")


@pytest.fixture
def db(engine):
    with Session(engine, autoflush=False) as session:
        yield session


def test_register_duplicate_and_read_authorized_projection(db):
    assert not read_source(db, SOURCE_ID, LOCAL, now=T0).allowed
    assert register_source(db, ONS_CAPACITY_SOURCE) == 1
    with pytest.raises(SourceRegistryConflict, match="already registered"):
        register_source(db, ONS_CAPACITY_SOURCE)

    allowed = read_source(db, SOURCE_ID, LOCAL, now=T0)
    assert allowed.allowed and allowed.source is not None
    assert allowed.source.definition == ONS_CAPACITY_SOURCE
    assert allowed.source.policy_version == 1
    assert allowed.source.health.status == HealthStatus.NOT_CHECKED
    assert allowed.source.health.last_success_at is None

    for channel in (UsageChannel.CLIENT_DISPLAY, UsageChannel.EXTERNAL_API):
        restricted = read_source(db, SOURCE_ID, channel, now=T0)
        assert not restricted.allowed and restricted.source is None
        assert restricted.channel_state == ChannelState.HOLD

    invalid = read_source(db, SOURCE_ID, "public_html", now=T0)
    assert invalid.channel is None and invalid.reason == DecisionReason.INVALID_CHANNEL
    for candidate in ("eia.electricity.retail_sales.co.res.price.monthly", "sec.edgar.submissions.0001119639"):
        for channel in UsageChannel:
            absent = read_source(db, candidate, channel, now=T0)
            assert absent.reason == DecisionReason.UNKNOWN_SOURCE and absent.source is None


def test_write_revalidates_metadata_copied_without_validation(db):
    copied = ONS_CAPACITY_SOURCE.model_copy(update={"resource_locator": "https://example.test/?token=synthetic-secret"})
    with pytest.raises(ValidationError) as error:
        register_source(db, copied)
    assert "synthetic-secret" not in str(error.value)
    assert not read_source(db, SOURCE_ID, LOCAL, now=T0).allowed


def test_source_policy_changes_do_not_rewrite_snapshot_lineage(db):
    ref = ONS_CAPACITY_SOURCE.rights.rights_record_ref
    first = capture_snapshot(
        db, source_id=SOURCE_ID, data=b"synthetic prior", content_type="text/csv",
        adapter_version="ons.capacidade_geracao@1", retrieved_at=T0,
        rights_record_ref=ref, rights_summary_state="cleared",
    )
    register_source(db, ONS_CAPACITY_SOURCE)
    second = capture_snapshot(
        db, source_id=SOURCE_ID, data=b"synthetic successor", content_type="text/csv",
        adapter_version="ons.capacidade_geracao@1", retrieved_at=T0 + timedelta(seconds=1),
        rights_record_ref=ref, rights_summary_state="cleared",
    )

    revoked = ONS_CAPACITY_SOURCE.model_copy(update={
        "rights": ONS_CAPACITY_SOURCE.rights.model_copy(update={"revoked": True})
    })
    assert revise_source(db, revoked, expected_policy_version=1) == 2
    decision = read_source(db, SOURCE_ID, LOCAL, now=T0)
    assert decision.reason == DecisionReason.RIGHTS_REVOKED and decision.source is None

    restricted = ONS_CAPACITY_SOURCE.model_copy(update={"status": "restricted"})
    assert revise_source(db, restricted, expected_policy_version=2) == 3
    assert read_source(db, SOURCE_ID, LOCAL, now=T0).reason == DecisionReason.SOURCE_RESTRICTED

    tombstone = ONS_CAPACITY_SOURCE.model_copy(update={"status": "deleted"})
    assert revise_source(db, tombstone, expected_policy_version=3) == 4
    with pytest.raises(SourceRegistryConflict, match="deleted"):
        revise_source(db, ONS_CAPACITY_SOURCE, expected_policy_version=4)
    assert read_source(db, SOURCE_ID, LOCAL, now=T0).reason == DecisionReason.SOURCE_DELETED

    rows = db.scalars(
        select(ArgosSourceRevision)
        .where(ArgosSourceRevision.source_id == SOURCE_ID)
        .order_by(ArgosSourceRevision.policy_version)
    ).all()
    assert [row.policy_version for row in rows] == [1, 2, 3, 4]
    assert rows[0].definition == ONS_CAPACITY_SOURCE.model_dump(mode="json")
    assert rows[-1].definition == {"status": "deleted"}
    assert second.prior_snapshot_id == first.id
    capture, payload = reconstruct_snapshot(db, first.id)
    assert payload == b"synthetic prior"
    assert capture.rights_record_ref == ref and capture.rights_summary_state == "cleared"


def test_health_distinguishes_success_failure_staleness_and_recovery(db):
    version = register_source(db, ONS_CAPACITY_SOURCE)

    def check(at, succeeded):
        return record_source_check(
            db, SOURCE_ID, policy_version=version, checked_at=at,
            succeeded=succeeded, resource_locator=ONS_CAPACITY_SOURCE.resource_locator,
        )

    assert check(T0, True)
    first_success = read_source(db, SOURCE_ID, LOCAL, now=T0).source.health
    assert first_success.status == HealthStatus.HEALTHY
    assert first_success.last_checked_at == first_success.last_success_at == T0
    late = T0 + timedelta(seconds=ONS_CAPACITY_SOURCE.stale_after_seconds)
    assert read_source(db, SOURCE_ID, LOCAL, now=late).source.health.status == HealthStatus.STALE

    assert check(late, False)
    failure = read_source(db, SOURCE_ID, LOCAL, now=late).source.health
    assert failure.status == HealthStatus.BROKEN
    assert failure.last_success_at == T0 and failure.last_checked_at == late
    assert not check(T0, True)
    recovery = late + timedelta(seconds=5)
    assert check(recovery, True)
    assert read_source(db, SOURCE_ID, LOCAL, now=recovery).source.health.status == HealthStatus.HEALTHY


@pytest.mark.parametrize("change", ["resource", "notice"])
def test_policy_drift_latches_and_does_not_store_observed_values(db, caplog, change):
    version = register_source(db, ONS_CAPACITY_SOURCE)
    resource = ONS_CAPACITY_SOURCE.resource_locator
    observed_resource = resource + "?api_key=synthetic-secret" if change == "resource" else resource
    observed_notice = "unreviewed-notice" if change == "notice" else None

    denied = read_source(
        db, SOURCE_ID, LOCAL, now=T0, observed_resource_locator=observed_resource,
        observed_license_notice_version=observed_notice,
    )
    assert denied.reason == DecisionReason.POLICY_DRIFT and denied.source is None
    assert record_source_check(
        db, SOURCE_ID, policy_version=version, checked_at=T0, succeeded=True,
        resource_locator=observed_resource, license_notice_version=observed_notice,
    )
    assert read_source(db, SOURCE_ID, LOCAL, now=T0).reason == DecisionReason.POLICY_DRIFT
    assert not record_source_check(
        db, SOURCE_ID, policy_version=version, checked_at=T0 + timedelta(seconds=1),
        succeeded=True, resource_locator=resource,
    )
    row = db.get(ArgosSourceRevision, (SOURCE_ID, version))
    assert row.last_success_at is None
    assert "synthetic-secret" not in repr(row.definition) + caplog.text

    assert revise_source(db, ONS_CAPACITY_SOURCE, expected_policy_version=version) == 2
    assert read_source(db, SOURCE_ID, LOCAL, now=T0).source.health.status == HealthStatus.NOT_CHECKED
    with pytest.raises(SourceRegistryConflict, match="policy has changed"):
        record_source_check(db, SOURCE_ID, policy_version=version, checked_at=T0,
                            succeeded=True, resource_locator=resource)


def test_raw_dml_cannot_rewrite_or_erase_prior_policy(db):
    register_source(db, ONS_CAPACITY_SOURCE)
    for sql in (
        "UPDATE argos_source_revision SET definition = '{}' WHERE source_id = :source",
        "DELETE FROM argos_source_revision WHERE source_id = :source",
    ):
        with pytest.raises(DBAPIError, match="source policy revisions cannot"), db.begin_nested():
            db.execute(text(sql), {"source": SOURCE_ID})
    assert read_source(db, SOURCE_ID, LOCAL, now=T0).allowed


def test_concurrent_reviews_cannot_both_replace_the_same_policy(engine):
    source = ONS_CAPACITY_SOURCE.model_copy(update={"source_id": SourceId("test.concurrent_review")})
    with Session(engine) as session, session.begin():
        register_source(session, source)

    barrier = Barrier(2)

    def revise(status):
        try:
            with Session(engine) as session, session.begin():
                barrier.wait(timeout=10)
                return revise_source(session, source.model_copy(update={"status": status}), expected_policy_version=1)
        except SourceRegistryConflict:
            return None

    with ThreadPoolExecutor(max_workers=2) as workers:
        a = workers.submit(revise, "restricted")
        b = workers.submit(revise, "paused")
        assert {a.result(timeout=15), b.result(timeout=15)} == {None, 2}
