"""Integration tests for Argos Memory persistence (NIV-12) — TEST 1/2/3/5/6/7/8.

Requires a real, reachable Postgres. Skips the whole module when
``DATABASE_URL`` is not set or the database cannot be reached — there is no
Postgres in the build sandbox this suite was authored in, and pointing it at
the shared Railway-hosted database from an automated test run was
deliberately avoided. Set ``DATABASE_URL`` to a disposable Postgres (local
or CI service container) to actually run this file; it applies the real
Alembic migration chain, including the immutability trigger and the
``argos_current_snapshot`` view, so it exercises the same schema production
uses — not a hand-rolled substitute.
"""

from __future__ import annotations

import os
import uuid
from datetime import datetime, timedelta, timezone

import pytest
import sqlalchemy
from alembic import command
from alembic.config import Config
from sqlalchemy import create_engine, text
from sqlalchemy.exc import OperationalError
from sqlalchemy.orm import Session

from app.services.argos_memory import capture_snapshot, get_current_snapshot, reconstruct_snapshot


def _database_url() -> str | None:
    url = os.environ.get("DATABASE_URL", "").strip()
    return url or None


def _reachable(url: str) -> bool:
    try:
        engine = create_engine(url)
        with engine.connect():
            pass
        engine.dispose()
        return True
    except OperationalError:
        return False


_URL = _database_url()
pytestmark = pytest.mark.skipif(
    _URL is None or not _reachable(_URL),
    reason="DATABASE_URL not set or Postgres unreachable — see module docstring",
)


@pytest.fixture()
def db_session():
    """Apply the real migration chain to a disposable database, then tear it down.

    ``DATABASE_URL`` must point at a database this suite is allowed to
    create/drop tables in — never point it at shared/production Postgres.
    """
    url = _URL
    assert url is not None

    config = Config("alembic.ini")
    config.set_main_option("sqlalchemy.url", url)
    command.upgrade(config, "head")

    engine = create_engine(url)
    session = Session(bind=engine)
    try:
        yield session
    finally:
        session.rollback()
        session.close()
        engine.dispose()
        command.downgrade(config, "base")


def _source_id() -> str:
    # Unique per test run so repeated local runs against a persistent
    # database never collide with a prior run's chain.
    return f"test.source.{uuid.uuid4().hex[:12]}"


# --- TEST 1 — first capture ------------------------------------------------


def test_first_capture_preserves_bytes_hash_and_identity(db_session):
    source_id = _source_id()
    data = b"capacidade;usina\n100;UTE Teste\n"
    retrieved_at = datetime.now(timezone.utc)

    snapshot = capture_snapshot(
        db_session,
        source_id=source_id,
        data=data,
        content_type="text/csv",
        adapter_version="test@1",
        retrieved_at=retrieved_at,
    )
    db_session.commit()

    assert snapshot.revision_relation == "first"
    assert snapshot.prior_snapshot_id is None
    assert snapshot.source_id == source_id

    _, restored_bytes = reconstruct_snapshot(db_session, snapshot.id)
    assert restored_bytes == data

    artifact = db_session.execute(
        text("SELECT sha256, byte_size FROM argos_raw_artifact WHERE id = :id"),
        {"id": snapshot.artifact_id},
    ).one()
    import hashlib

    assert artifact.sha256 == hashlib.sha256(data).hexdigest()
    assert artifact.byte_size == len(data)


# --- TEST 2 — identical capture --------------------------------------------


def test_identical_capture_dedupes_artifact_without_fabricating_a_revision(db_session):
    source_id = _source_id()
    data = b"capacidade;usina\n100;UTE Teste\n"

    first = capture_snapshot(
        db_session,
        source_id=source_id,
        data=data,
        content_type="text/csv",
        adapter_version="test@1",
        retrieved_at=datetime.now(timezone.utc),
    )
    db_session.commit()

    second = capture_snapshot(
        db_session,
        source_id=source_id,
        data=data,
        content_type="text/csv",
        adapter_version="test@1",
        retrieved_at=datetime.now(timezone.utc) + timedelta(minutes=1),
    )
    db_session.commit()

    assert second.revision_relation == "unchanged"
    assert second.prior_snapshot_id == first.id
    # Same physical artifact row — dedup by content hash, not two BYTEA copies.
    assert second.artifact_id == first.artifact_id

    artifact_count = db_session.execute(
        text("SELECT count(*) FROM argos_raw_artifact")
    ).scalar_one()
    assert artifact_count == 1


# --- TEST 3 — changed bytes -------------------------------------------------


def test_changed_bytes_preserve_old_artifact_and_link_new_snapshot(db_session):
    source_id = _source_id()
    data_a = b"capacidade;usina\n100;UTE Teste\n"
    data_b = b"capacidade;usina\n150;UTE Teste\n"

    snap_a = capture_snapshot(
        db_session,
        source_id=source_id,
        data=data_a,
        content_type="text/csv",
        adapter_version="test@1",
        retrieved_at=datetime.now(timezone.utc),
    )
    db_session.commit()

    snap_b = capture_snapshot(
        db_session,
        source_id=source_id,
        data=data_b,
        content_type="text/csv",
        adapter_version="test@1",
        retrieved_at=datetime.now(timezone.utc) + timedelta(minutes=1),
    )
    db_session.commit()

    assert snap_b.revision_relation == "changed"
    assert snap_b.prior_snapshot_id == snap_a.id
    assert snap_b.artifact_id != snap_a.artifact_id

    # Old evidence is untouched and still reconstructible.
    _, restored_a = reconstruct_snapshot(db_session, snap_a.id)
    _, restored_b = reconstruct_snapshot(db_session, snap_b.id)
    assert restored_a == data_a
    assert restored_b == data_b


# --- TEST 4 — unknown source time ------------------------------------------


def test_missing_source_time_stays_explicit_not_copied_from_retrieved_at(db_session):
    source_id = _source_id()
    retrieved_at = datetime.now(timezone.utc)

    snapshot = capture_snapshot(
        db_session,
        source_id=source_id,
        data=b"payload",
        content_type="text/csv",
        adapter_version="test@1",
        retrieved_at=retrieved_at,
        published_at=None,
        reference_time_start=None,
        reference_time_end=None,
    )
    db_session.commit()

    assert snapshot.retrieved_at is not None
    assert snapshot.published_at is None
    assert snapshot.reference_time_start is None
    assert snapshot.reference_time_end is None


# --- TEST 5 — historical reconstruction from evidence only -----------------


def test_historical_reconstruction_uses_only_stored_evidence(db_session):
    source_id = _source_id()
    data = b"historical payload, source is now unreachable"

    snapshot = capture_snapshot(
        db_session,
        source_id=source_id,
        data=data,
        content_type="text/csv",
        adapter_version="test@1",
        retrieved_at=datetime.now(timezone.utc),
    )
    db_session.commit()

    # A fresh session simulates a later reviewer with no adapter, no network
    # — only what NIVAR persisted.
    reconstructed_snapshot, reconstructed_bytes = reconstruct_snapshot(db_session, snapshot.id)
    assert reconstructed_bytes == data
    assert reconstructed_snapshot.source_id == source_id


# --- TEST 6 — current projection resolves from history ---------------------


def test_current_projection_resolves_from_snapshot_history(db_session):
    source_id = _source_id()
    data_a = b"version A"
    data_b = b"version B"

    capture_snapshot(
        db_session,
        source_id=source_id,
        data=data_a,
        content_type="text/csv",
        adapter_version="test@1",
        retrieved_at=datetime.now(timezone.utc),
    )
    db_session.commit()

    latest = capture_snapshot(
        db_session,
        source_id=source_id,
        data=data_b,
        content_type="text/csv",
        adapter_version="test@1",
        retrieved_at=datetime.now(timezone.utc) + timedelta(minutes=1),
    )
    db_session.commit()

    current = get_current_snapshot(db_session, source_id)
    assert current is not None
    assert current.id == latest.id

    # No second mutable truth table — the view agrees with the service query.
    view_row = db_session.execute(
        text("SELECT id FROM argos_current_snapshot WHERE source_id = :sid"),
        {"sid": source_id},
    ).one()
    assert str(view_row.id) == str(latest.id)


# --- TEST 7 — rights lineage -------------------------------------------------


def test_rights_state_is_preserved_and_left_unknown_when_unresolved(db_session):
    source_id = _source_id()

    snapshot = capture_snapshot(
        db_session,
        source_id=source_id,
        data=b"payload",
        content_type="text/csv",
        adapter_version="test@1",
        retrieved_at=datetime.now(timezone.utc),
        rights_record_ref=None,
        rights_summary_state="unknown",
    )
    db_session.commit()

    assert snapshot.rights_record_ref is None
    assert snapshot.rights_summary_state == "unknown"

    # Once NIV-13 produces a rights record, a later capture can resolve it —
    # the schema supports the linkage without pretending clearance exists.
    later = capture_snapshot(
        db_session,
        source_id=source_id,
        data=b"payload v2",
        content_type="text/csv",
        adapter_version="test@1",
        retrieved_at=datetime.now(timezone.utc) + timedelta(minutes=1),
        rights_record_ref="niv7-rights-record:ons-open-data:v1",
        rights_summary_state="cleared",
    )
    db_session.commit()
    assert later.rights_record_ref == "niv7-rights-record:ons-open-data:v1"
    assert later.rights_summary_state == "cleared"


# --- TEST 8 — immutability ---------------------------------------------------


def test_direct_sql_update_of_raw_artifact_is_rejected(db_session):
    snapshot = capture_snapshot(
        db_session,
        source_id=_source_id(),
        data=b"immutable payload",
        content_type="text/csv",
        adapter_version="test@1",
        retrieved_at=datetime.now(timezone.utc),
    )
    db_session.commit()

    with pytest.raises(sqlalchemy.exc.DBAPIError):
        db_session.execute(
            text("UPDATE argos_raw_artifact SET content_type = 'tampered' WHERE id = :id"),
            {"id": snapshot.artifact_id},
        )
        db_session.commit()
    db_session.rollback()


# --- TEST 9 — chain head resolves by lineage, not retrieved_at (NIV-37) ----


def test_current_snapshot_resolves_by_lineage_not_out_of_order_retrieved_at(db_session):
    """Reproduces the NIV-37 defect and proves the lineage-head fix.

    Worker B fetches source bytes at a later wall-clock time but commits
    first, becoming the root. Worker A fetches earlier but was delayed, and
    only commits afterward — it is appended as B's successor while
    preserving its own (earlier) ``retrieved_at``. Lineage is B -> A, but
    ``max(retrieved_at)`` is still B. A query keyed on ``retrieved_at``
    would resolve B as current even though B already has a child, and a
    third capture would then try to chain onto B and collide with A on
    ``argos_snapshot_prior_snapshot_id_key``.
    """
    source_id = _source_id()
    t0 = datetime.now(timezone.utc)
    later_retrieved_at = t0 + timedelta(minutes=5)  # B's observation time
    earlier_retrieved_at = t0  # A's observation time — earlier, but commits second

    snap_b = capture_snapshot(
        db_session,
        source_id=source_id,
        data=b"snapshot B payload",
        content_type="text/csv",
        adapter_version="test@1",
        retrieved_at=later_retrieved_at,
    )
    db_session.commit()
    assert snap_b.prior_snapshot_id is None
    assert snap_b.revision_relation == "first"

    snap_a = capture_snapshot(
        db_session,
        source_id=source_id,
        data=b"snapshot A payload",
        content_type="text/csv",
        adapter_version="test@1",
        retrieved_at=earlier_retrieved_at,
    )
    db_session.commit()
    assert snap_a.prior_snapshot_id == snap_b.id
    assert snap_a.retrieved_at < snap_b.retrieved_at

    # --- immediately after A: the head is A, not B (max retrieved_at) ------

    current = get_current_snapshot(db_session, source_id)
    assert current is not None
    assert current.id == snap_a.id, (
        "get_current_snapshot() returned the max(retrieved_at) row instead of "
        "the lineage head — retrieved_at is observation time, not chain order"
    )

    view_row = db_session.execute(
        text("SELECT id FROM argos_current_snapshot WHERE source_id = :sid"),
        {"sid": source_id},
    ).one()
    assert str(view_row.id) == str(snap_a.id), (
        "argos_current_snapshot view disagrees with get_current_snapshot() "
        "or resolves by retrieved_at instead of lineage"
    )

    # --- a third capture must append to the true head (A), not fork off B --

    snap_c = capture_snapshot(
        db_session,
        source_id=source_id,
        data=b"snapshot C payload",
        content_type="text/csv",
        adapter_version="test@1",
        retrieved_at=t0 + timedelta(minutes=10),
    )
    db_session.commit()  # would raise IntegrityError (UniqueViolation) on the old code path

    assert snap_c.prior_snapshot_id == snap_a.id

    rows = db_session.execute(
        text(
            "SELECT id, prior_snapshot_id, retrieved_at FROM argos_snapshot "
            "WHERE source_id = :sid"
        ),
        {"sid": source_id},
    ).all()
    assert len(rows) == 3

    by_id = {str(r.id): r for r in rows}
    roots = [r for r in rows if r.prior_snapshot_id is None]
    assert len(roots) == 1, f"expected exactly one root, got {len(roots)}"
    assert str(roots[0].id) == str(snap_b.id)

    children_of: dict[str, list] = {}
    for row in rows:
        if row.prior_snapshot_id is not None:
            children_of.setdefault(str(row.prior_snapshot_id), []).append(row)
    for parent_id, children in children_of.items():
        assert len(children) == 1, f"fork detected under {parent_id}: {children}"

    # Chain is linear: B -> A -> C, with no orphaned head.
    assert str(by_id[str(snap_a.id)].prior_snapshot_id) == str(snap_b.id)
    assert str(by_id[str(snap_c.id)].prior_snapshot_id) == str(snap_a.id)

    heads = [r for r in rows if str(r.id) not in children_of]
    assert len(heads) == 1, f"expected exactly one head, got {len(heads)}"
    assert str(heads[0].id) == str(snap_c.id)

    # retrieved_at values were preserved exactly, never rewritten to make
    # lineage ordering convenient.
    assert by_id[str(snap_b.id)].retrieved_at == later_retrieved_at
    assert by_id[str(snap_a.id)].retrieved_at == earlier_retrieved_at

    final_current = get_current_snapshot(db_session, source_id)
    assert final_current is not None
    assert final_current.id == snap_c.id


def test_direct_sql_delete_of_snapshot_is_rejected(db_session):
    snapshot = capture_snapshot(
        db_session,
        source_id=_source_id(),
        data=b"immutable payload 2",
        content_type="text/csv",
        adapter_version="test@1",
        retrieved_at=datetime.now(timezone.utc),
    )
    db_session.commit()

    with pytest.raises(sqlalchemy.exc.DBAPIError):
        db_session.execute(
            text("DELETE FROM argos_snapshot WHERE id = :id"),
            {"id": snapshot.id},
        )
        db_session.commit()
    db_session.rollback()
