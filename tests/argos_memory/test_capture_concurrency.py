"""Concurrency integration tests for Argos Memory version-chain integrity (NIV-12).

Requires a real, reachable Postgres — same gating/rationale as
``test_capture_persistence.py``. These tests exercise TRUE concurrent
transactions (independent sessions/connections racing against the same
``source_id``), not a sequential simulation: that is the only way to
actually exercise the partial unique index and the advisory-lock
serialization that close the two-root race documented on NIV-12.
"""

from __future__ import annotations

import os
import threading
import uuid
from datetime import datetime, timezone

import pytest
import sqlalchemy
from alembic import command
from alembic.config import Config
from sqlalchemy import create_engine, select, text
from sqlalchemy.exc import OperationalError
from sqlalchemy.orm import Session

from app.db.models.argos_memory import ArgosSnapshot
from app.services.argos_memory import capture_snapshot


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
    reason="DATABASE_URL not set or Postgres unreachable — see test_capture_persistence.py",
)

JOIN_TIMEOUT_SECONDS = 30


@pytest.fixture()
def migrated_engine():
    """Apply the real migration chain to a disposable database, then tear it down.

    Yields a SQLAlchemy Engine (not a single Session) — concurrency tests
    need independent sessions/connections racing each other, which a single
    shared Session cannot provide.
    """
    url = _URL
    assert url is not None

    config = Config("alembic.ini")
    config.set_main_option("sqlalchemy.url", url)
    command.upgrade(config, "head")

    engine = create_engine(url)
    try:
        yield engine
    finally:
        engine.dispose()
        command.downgrade(config, "base")


def _source_id(label: str) -> str:
    return f"test.concurrency.{label}.{uuid.uuid4().hex[:12]}"


# --- TEST A — simultaneous first capture -----------------------------------


def test_simultaneous_first_capture_of_new_source_produces_one_root(migrated_engine):
    source_id = _source_id("simultaneous-first")
    data = b"identical concurrent payload"
    barrier = threading.Barrier(2)
    outcomes: dict[str, Exception | None] = {}
    lock = threading.Lock()

    def worker(name: str) -> None:
        barrier.wait()
        session = Session(bind=migrated_engine)
        try:
            capture_snapshot(
                session,
                source_id=source_id,
                data=data,
                content_type="text/csv",
                adapter_version="concurrency-test@1",
                retrieved_at=datetime.now(timezone.utc),
            )
            session.commit()
            with lock:
                outcomes[name] = None
        except Exception as exc:  # noqa: BLE001 — captured for assertion, not swallowed
            session.rollback()
            with lock:
                outcomes[name] = exc
        finally:
            session.close()

    t1 = threading.Thread(target=worker, args=("A",))
    t2 = threading.Thread(target=worker, args=("B",))
    t1.start()
    t2.start()
    t1.join(timeout=JOIN_TIMEOUT_SECONDS)
    t2.join(timeout=JOIN_TIMEOUT_SECONDS)

    assert not t1.is_alive() and not t2.is_alive(), "workers did not complete — possible deadlock"
    assert outcomes == {"A": None, "B": None}, f"a worker failed unexpectedly: {outcomes}"

    verify = Session(bind=migrated_engine)
    try:
        rows = (
            verify.execute(select(ArgosSnapshot).where(ArgosSnapshot.source_id == source_id))
            .scalars()
            .all()
        )
        assert len(rows) == 2, f"expected exactly 2 snapshots, got {len(rows)}"

        roots = [r for r in rows if r.prior_snapshot_id is None]
        assert len(roots) == 1, f"expected exactly one root (no sibling roots), got {len(roots)}"
        root = roots[0]
        assert root.revision_relation == "first"

        successors = [r for r in rows if r.id != root.id]
        assert len(successors) == 1
        second = successors[0]
        assert second.prior_snapshot_id == root.id
        # Identical bytes -> the second capture (the one that waited on the
        # advisory lock) must see the committed root and classify as unchanged.
        assert second.revision_relation == "unchanged"

        # Content-addressed dedup: one physical artifact for both.
        assert second.artifact_id == root.artifact_id
        artifact_count = verify.execute(
            text("SELECT count(*) FROM argos_raw_artifact")
        ).scalar_one()
        assert artifact_count == 1
    finally:
        verify.close()


# --- TEST B — database invariant bypass -------------------------------------


def test_direct_sql_second_root_for_same_source_is_rejected(migrated_engine):
    source_id = _source_id("bypass-root")
    session = Session(bind=migrated_engine)
    try:
        first = capture_snapshot(
            session,
            source_id=source_id,
            data=b"root payload",
            content_type="text/csv",
            adapter_version="concurrency-test@1",
            retrieved_at=datetime.now(timezone.utc),
        )
        session.commit()

        with pytest.raises(sqlalchemy.exc.IntegrityError):
            session.execute(
                text(
                    """
                    INSERT INTO argos_snapshot
                      (source_id, artifact_id, retrieved_at, adapter_version,
                       revision_relation, prior_snapshot_id)
                    VALUES (:source_id, :artifact_id, now(), 'bypass@1', 'first', NULL)
                    """
                ),
                {"source_id": source_id, "artifact_id": str(first.artifact_id)},
            )
        session.rollback()

        rows = (
            session.execute(select(ArgosSnapshot).where(ArgosSnapshot.source_id == source_id))
            .scalars()
            .all()
        )
        assert len(rows) == 1
        assert rows[0].id == first.id
    finally:
        session.close()


# --- steady-state concurrency must remain safe ------------------------------


def test_simultaneous_capture_against_existing_history_stays_linear(migrated_engine):
    source_id = _source_id("steady-state")

    seed_session = Session(bind=migrated_engine)
    try:
        seed = capture_snapshot(
            seed_session,
            source_id=source_id,
            data=b"seed payload",
            content_type="text/csv",
            adapter_version="concurrency-test@1",
            retrieved_at=datetime.now(timezone.utc),
        )
        seed_session.commit()
        seed_id = seed.id
    finally:
        seed_session.close()

    barrier = threading.Barrier(2)
    outcomes: dict[str, Exception | None] = {}
    lock = threading.Lock()

    def worker(name: str, payload: bytes) -> None:
        barrier.wait()
        session = Session(bind=migrated_engine)
        try:
            capture_snapshot(
                session,
                source_id=source_id,
                data=payload,
                content_type="text/csv",
                adapter_version="concurrency-test@1",
                retrieved_at=datetime.now(timezone.utc),
            )
            session.commit()
            with lock:
                outcomes[name] = None
        except Exception as exc:  # noqa: BLE001
            session.rollback()
            with lock:
                outcomes[name] = exc
        finally:
            session.close()

    t1 = threading.Thread(target=worker, args=("A", b"steady payload A"))
    t2 = threading.Thread(target=worker, args=("B", b"steady payload B"))
    t1.start()
    t2.start()
    t1.join(timeout=JOIN_TIMEOUT_SECONDS)
    t2.join(timeout=JOIN_TIMEOUT_SECONDS)

    assert not t1.is_alive() and not t2.is_alive(), "workers did not complete — possible deadlock"
    assert outcomes == {"A": None, "B": None}, f"a worker failed unexpectedly: {outcomes}"

    verify = Session(bind=migrated_engine)
    try:
        rows = (
            verify.execute(
                select(ArgosSnapshot)
                .where(ArgosSnapshot.source_id == source_id)
                .order_by(ArgosSnapshot.created_at)
            )
            .scalars()
            .all()
        )
        assert len(rows) == 3  # seed + A + B

        roots = [r for r in rows if r.prior_snapshot_id is None]
        assert len(roots) == 1
        assert roots[0].id == seed_id

        children_of: dict[uuid.UUID, list] = {}
        for row in rows:
            if row.prior_snapshot_id is not None:
                children_of.setdefault(row.prior_snapshot_id, []).append(row)
        for parent_id, children in children_of.items():
            assert len(children) == 1, f"fork detected under {parent_id}: {children}"
    finally:
        verify.close()
