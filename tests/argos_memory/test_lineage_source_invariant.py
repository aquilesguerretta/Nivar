"""Real-Postgres coverage for the NIV-41 same-source lineage invariant."""

from __future__ import annotations

import os
from io import StringIO
import uuid
from datetime import datetime, timedelta, timezone

import pytest
import sqlalchemy
from alembic import command
from alembic.config import Config
from sqlalchemy import create_engine, text
from sqlalchemy.exc import OperationalError
from sqlalchemy.orm import Session

from app.services.argos_memory import capture_snapshot, get_current_snapshot


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
    reason="DATABASE_URL not set or Postgres unreachable — real PostgreSQL is required",
)


@pytest.fixture()
def migrated_database():
    """Start from Alembic base and leave the disposable test DB at base."""
    url = _URL
    assert url is not None
    config = Config("alembic.ini")
    config.set_main_option("sqlalchemy.url", url)
    command.downgrade(config, "base")
    try:
        yield config, url
    finally:
        command.downgrade(config, "base")


def _source_id(label: str) -> str:
    return f"test.niv41.{label}.{uuid.uuid4().hex[:12]}"


def _insert_snapshot(
    session: Session,
    *,
    source_id: str,
    artifact_id: uuid.UUID,
    prior_snapshot_id: uuid.UUID | None,
    relation: str,
) -> uuid.UUID:
    return session.execute(
        text(
            """
            INSERT INTO argos_snapshot
              (source_id, artifact_id, retrieved_at, adapter_version,
               revision_relation, prior_snapshot_id)
            VALUES (:source_id, :artifact_id, now(), 'niv41-direct@1',
                    :relation, :prior_snapshot_id)
            RETURNING id
            """
        ),
        {
            "source_id": source_id,
            "artifact_id": artifact_id,
            "relation": relation,
            "prior_snapshot_id": prior_snapshot_id,
        },
    ).scalar_one()


def _capture(session: Session, source_id: str, payload: bytes, retrieved_at: datetime):
    return capture_snapshot(
        session,
        source_id=source_id,
        data=payload,
        content_type="text/csv",
        adapter_version="niv41-test@1",
        retrieved_at=retrieved_at,
    )


def test_0010_accepts_corrupt_cross_source_history_but_0011_stops_without_repair(
    migrated_database,
):
    """The mandatory preflight reports evidence; it never rewrites it."""
    config, url = migrated_database
    command.upgrade(config, "0010_argos_lineage_head")
    engine = create_engine(url)
    parent_source = _source_id("preflight-parent")
    child_source = _source_id("preflight-child")

    try:
        with Session(engine) as session:
            parent = _capture(session, parent_source, b"parent", datetime.now(timezone.utc))
            session.commit()
            parent_id = parent.id
            artifact_id = parent.artifact_id
            child_id = _insert_snapshot(
                session,
                source_id=child_source,
                artifact_id=artifact_id,
                prior_snapshot_id=parent_id,
                relation="changed",
            )
            session.commit()  # 0010 accepts this invalid cross-source child.

        with pytest.raises(sqlalchemy.exc.DBAPIError, match="NIV-41 preflight found cross-source"):
            command.upgrade(config, "0011_argos_same_source_lineage")

        with engine.connect() as connection:
            assert connection.execute(text("SELECT version_num FROM alembic_version")).scalar_one() == (
                "0010_argos_lineage_head"
            )
            persisted = connection.execute(
                text(
                    """
                    SELECT child.id, child.source_id, child.prior_snapshot_id,
                    parent.source_id AS parent_source_id
                    FROM argos_snapshot child
                    JOIN argos_snapshot parent ON parent.id = child.prior_snapshot_id
                    WHERE child.id = :child_id
                    """
                ),
                {"child_id": child_id},
            ).one()
        assert persisted.id == child_id
        assert persisted.source_id == child_source
        assert persisted.prior_snapshot_id == parent_id
        assert persisted.parent_source_id == parent_source
    finally:
        engine.dispose()


def test_0011_offline_render_keeps_the_runtime_preflight_guard(migrated_database):
    """Offline SQL must fail at execution time before adding the composite FK."""
    del migrated_database  # Offline rendering does not need a live connection.
    config = Config("alembic.ini", output_buffer=StringIO())
    config.set_main_option("sqlalchemy.url", "postgresql://offline-render")
    command.upgrade(config, "head", sql=True)
    rendered_sql = config.output_buffer.getvalue()
    guard_index = rendered_sql.index("NIV-41 preflight found cross-source")
    constraint_index = rendered_sql.index("argos_snapshot_prior_snapshot_source_fkey")
    assert "DO $$" in rendered_sql
    assert "JOIN argos_snapshot parent ON parent.id = child.prior_snapshot_id" in rendered_sql
    assert guard_index < constraint_index


def test_clean_0011_rejects_a_direct_sql_cross_source_child(migrated_database):
    config, url = migrated_database
    command.upgrade(config, "head")  # explicit base -> head migration check
    engine = create_engine(url)
    parent_source = _source_id("fk-parent")
    child_source = _source_id("fk-child")
    try:
        with Session(engine) as session:
            parent = _capture(session, parent_source, b"parent", datetime.now(timezone.utc))
            session.commit()
            with pytest.raises(sqlalchemy.exc.IntegrityError):
                _insert_snapshot(
                    session,
                    source_id=child_source,
                    artifact_id=parent.artifact_id,
                    prior_snapshot_id=parent.id,
                    relation="changed",
                )
                session.commit()
            session.rollback()
            assert session.execute(
                text("SELECT count(*) FROM argos_snapshot WHERE source_id = :source_id"),
                {"source_id": child_source},
            ).scalar_one() == 0
    finally:
        engine.dispose()


def test_same_source_chain_root_and_fork_guards_remain_intact(migrated_database):
    config, url = migrated_database
    command.upgrade(config, "head")
    engine = create_engine(url)
    source_id = _source_id("chain")
    try:
        with Session(engine) as session:
            root = _capture(session, source_id, b"A", datetime.now(timezone.utc))
            session.commit()
            child = _capture(
                session,
                source_id,
                b"B",
                datetime.now(timezone.utc) + timedelta(minutes=1),
            )
            session.commit()
            assert child.prior_snapshot_id == root.id

            with pytest.raises(sqlalchemy.exc.IntegrityError):
                _insert_snapshot(
                    session,
                    source_id=source_id,
                    artifact_id=root.artifact_id,
                    prior_snapshot_id=None,
                    relation="first",
                )
            session.rollback()

            with pytest.raises(sqlalchemy.exc.IntegrityError):
                _insert_snapshot(
                    session,
                    source_id=source_id,
                    artifact_id=root.artifact_id,
                    prior_snapshot_id=root.id,
                    relation="changed",
                )
            session.rollback()
    finally:
        engine.dispose()


def test_lineage_head_is_source_scoped_and_view_matches_service(migrated_database):
    config, url = migrated_database
    command.upgrade(config, "head")
    engine = create_engine(url)
    source_id = _source_id("out-of-order")
    unrelated_source_id = _source_id("unrelated")
    now = datetime.now(timezone.utc)
    try:
        with Session(engine) as session:
            # NIV-37 ordering: B commits first with a later observation time,
            # then A, then C. C is the lineage head despite the timestamps.
            snap_b = _capture(session, source_id, b"B", now + timedelta(minutes=5))
            session.commit()
            snap_a = _capture(session, source_id, b"A", now)
            session.commit()
            snap_c = _capture(session, source_id, b"C", now + timedelta(minutes=10))
            session.commit()

            unrelated = _capture(session, unrelated_source_id, b"other", now)
            session.commit()

            assert snap_a.prior_snapshot_id == snap_b.id
            assert snap_c.prior_snapshot_id == snap_a.id
            current = get_current_snapshot(session, source_id)
            assert current is not None and current.id == snap_c.id
            view_id = session.execute(
                text("SELECT id FROM argos_current_snapshot WHERE source_id = :source_id"),
                {"source_id": source_id},
            ).scalar_one()
            assert view_id == current.id

            unrelated_current = get_current_snapshot(session, unrelated_source_id)
            assert unrelated_current is not None and unrelated_current.id == unrelated.id
            assert session.execute(
                text("SELECT id FROM argos_current_snapshot WHERE source_id = :source_id"),
                {"source_id": unrelated_source_id},
            ).scalar_one() == unrelated.id
    finally:
        engine.dispose()


def test_raw_artifacts_and_snapshots_remain_append_only(migrated_database):
    config, url = migrated_database
    command.upgrade(config, "head")
    engine = create_engine(url)
    try:
        with Session(engine) as session:
            snapshot = _capture(
                session,
                _source_id("immutable"),
                b"unchangeable",
                datetime.now(timezone.utc),
            )
            session.commit()
            mutations = (
                ("UPDATE argos_raw_artifact SET content_type = 'tampered' WHERE id = :id", snapshot.artifact_id),
                ("DELETE FROM argos_raw_artifact WHERE id = :id", snapshot.artifact_id),
                ("UPDATE argos_snapshot SET adapter_version = 'tampered' WHERE id = :id", snapshot.id),
                ("DELETE FROM argos_snapshot WHERE id = :id", snapshot.id),
            )
            for statement, row_id in mutations:
                with pytest.raises(sqlalchemy.exc.DBAPIError):
                    session.execute(text(statement), {"id": row_id})
                    session.commit()
                session.rollback()
    finally:
        engine.dispose()


def test_0011_downgrade_and_reupgrade_restore_the_expected_fk(migrated_database):
    config, url = migrated_database
    command.upgrade(config, "head")
    engine = create_engine(url)
    try:
        with engine.connect() as connection:
            assert connection.execute(
                text(
                    "SELECT conname FROM pg_constraint "
                    "WHERE conrelid = 'argos_snapshot'::regclass "
                    "AND conname = 'argos_snapshot_prior_snapshot_source_fkey'"
                )
            ).scalar_one() == "argos_snapshot_prior_snapshot_source_fkey"

        command.downgrade(config, "0010_argos_lineage_head")
        with engine.connect() as connection:
            assert connection.execute(
                text(
                    "SELECT conname FROM pg_constraint "
                    "WHERE conrelid = 'argos_snapshot'::regclass "
                    "AND conname = 'argos_snapshot_prior_snapshot_id_fkey'"
                )
            ).scalar_one() == "argos_snapshot_prior_snapshot_id_fkey"

        command.upgrade(config, "head")
        with engine.connect() as connection:
            assert connection.execute(text("SELECT version_num FROM alembic_version")).scalar_one() == (
                "0011_argos_same_source_lineage"
            )
    finally:
        engine.dispose()
