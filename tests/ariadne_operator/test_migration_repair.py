"""PostgreSQL coverage for the Ariadne workspace production repair.

These tests intentionally manipulate migration state and relations.  Point
``DATABASE_URL`` only at a disposable PostgreSQL database.
"""

from __future__ import annotations

import os
import uuid

import pytest
import sqlalchemy
from alembic import command
from alembic.config import Config
from alembic.script import ScriptDirectory
from sqlalchemy import create_engine, text
from sqlalchemy.exc import OperationalError


REVISION_0013 = "0013_ariadne_operator_workspace"
REVISION_0014 = "0014_ariadne_workspace_repair"


def _database_url() -> str | None:
    return os.environ.get("DATABASE_URL", "").strip() or None


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
    reason="DATABASE_URL not set or disposable PostgreSQL unreachable",
)


@pytest.fixture()
def clean_database():
    """Start and finish at Alembic base on a disposable database."""
    assert _URL is not None
    config = Config("alembic.ini")
    config.set_main_option("sqlalchemy.url", _URL)
    command.downgrade(config, "base")
    try:
        yield config, _URL
    finally:
        command.downgrade(config, "base")


def _version(connection) -> str:
    return connection.execute(text("SELECT version_num FROM alembic_version")).scalar_one()


def _relation_oid(connection, relation: str) -> int | None:
    return connection.execute(
        text("SELECT to_regclass(:relation)::oid"), {"relation": relation}
    ).scalar_one()


def _workspace_catalog(connection) -> dict[str, object]:
    columns = {
        row.column_name: {
            "type": row.data_type,
            "nullable": row.is_nullable,
            "default": row.column_default,
        }
        for row in connection.execute(
            text(
                """
                SELECT column_name, data_type, is_nullable, column_default
                FROM information_schema.columns
                WHERE table_schema = 'public'
                  AND table_name = 'ariadne_operator_workspace'
                ORDER BY ordinal_position
                """
            )
        )
    }
    constraints = {
        row.conname: row.definition
        for row in connection.execute(
            text(
                """
                SELECT conname, pg_get_constraintdef(oid) AS definition
                FROM pg_constraint
                WHERE conrelid = 'public.ariadne_operator_workspace'::regclass
                """
            )
        )
    }
    indexes = {
        row.indexname: row.indexdef
        for row in connection.execute(
            text(
                """
                SELECT indexname, indexdef
                FROM pg_indexes
                WHERE schemaname = 'public'
                  AND tablename = 'ariadne_operator_workspace'
                """
            )
        )
    }
    return {"columns": columns, "constraints": constraints, "indexes": indexes}


def _assert_workspace_schema(connection) -> None:
    assert _relation_oid(connection, "public.ariadne_operator_workspace") is not None
    catalog = _workspace_catalog(connection)
    columns = catalog["columns"]
    assert columns == {
        "id": {
            "type": "uuid",
            "nullable": "NO",
            "default": "gen_random_uuid()",
        },
        "owner_user_id": {"type": "uuid", "nullable": "NO", "default": None},
        "label": {"type": "text", "nullable": "NO", "default": None},
        "synthetic": {"type": "boolean", "nullable": "NO", "default": "true"},
        "created_at": {
            "type": "timestamp with time zone",
            "nullable": "NO",
            "default": "now()",
        },
    }

    constraints = catalog["constraints"]
    assert constraints["ariadne_operator_workspace_pkey"] == "PRIMARY KEY (id)"
    assert constraints["ariadne_operator_workspace_label_check"] == (
        "CHECK ((length(label) > 0))"
    )
    assert constraints["ariadne_operator_workspace_owner_user_id_fkey"] == (
        "FOREIGN KEY (owner_user_id) REFERENCES users(id) ON DELETE RESTRICT"
    )

    index = catalog["indexes"]["ariadne_operator_workspace_owner_created_idx"]
    assert index.endswith(
        "USING btree (owner_user_id, created_at)"
    )


def test_clean_chain_reaches_one_head_with_exact_workspace_schema(clean_database):
    config, url = clean_database
    heads = ScriptDirectory.from_config(config).get_heads()
    assert heads == [REVISION_0014]

    command.upgrade(config, "head")
    engine = create_engine(url)
    try:
        with engine.connect() as connection:
            assert _version(connection) == REVISION_0014
            assert _relation_oid(connection, "public.ariadne_model_run") is not None
            _assert_workspace_schema(connection)
    finally:
        engine.dispose()


def test_0014_repairs_0013_history_with_only_workspace_table_missing(clean_database):
    config, url = clean_database
    command.upgrade(config, REVISION_0013)
    engine = create_engine(url)
    tenant_id = f"repair-preservation-{uuid.uuid4().hex}"
    try:
        with engine.begin() as connection:
            _assert_workspace_schema(connection)
            object_id = connection.execute(
                text(
                    """
                    INSERT INTO ariadne_private_object (tenant_id, object_type)
                    VALUES (:tenant_id, 'migration_repair_sentinel')
                    RETURNING id
                    """
                ),
                {"tenant_id": tenant_id},
            ).scalar_one()
            predecessor_oids = {
                relation: _relation_oid(connection, relation)
                for relation in (
                    "public.users",
                    "public.ariadne_private_object",
                    "public.ariadne_model_run",
                )
            }
            connection.execute(text("DROP TABLE public.ariadne_operator_workspace"))

        with engine.connect() as connection:
            assert _version(connection) == REVISION_0013
            assert _relation_oid(connection, "public.ariadne_operator_workspace") is None

        command.upgrade(config, "head")

        with engine.connect() as connection:
            assert _version(connection) == REVISION_0014
            _assert_workspace_schema(connection)
            assert {
                relation: _relation_oid(connection, relation)
                for relation in predecessor_oids
            } == predecessor_oids
            assert connection.execute(
                text(
                    """
                    SELECT object_type
                    FROM ariadne_private_object
                    WHERE id = :object_id AND tenant_id = :tenant_id
                    """
                ),
                {"object_id": object_id, "tenant_id": tenant_id},
            ).scalar_one() == "migration_repair_sentinel"
    finally:
        engine.dispose()


def test_normal_0013_to_0014_is_noop_and_downgrade_keeps_0013_table(clean_database):
    config, url = clean_database
    command.upgrade(config, REVISION_0013)
    engine = create_engine(url)
    try:
        with engine.connect() as connection:
            workspace_oid = _relation_oid(connection, "public.ariadne_operator_workspace")
            assert workspace_oid is not None
            before = _workspace_catalog(connection)

        command.upgrade(config, "head")
        with engine.connect() as connection:
            assert _version(connection) == REVISION_0014
            assert _relation_oid(connection, "public.ariadne_operator_workspace") == workspace_oid
            assert _workspace_catalog(connection) == before

        command.downgrade(config, REVISION_0013)
        with engine.connect() as connection:
            assert _version(connection) == REVISION_0013
            assert _relation_oid(connection, "public.ariadne_operator_workspace") == workspace_oid
            assert _workspace_catalog(connection) == before
    finally:
        engine.dispose()


def test_0014_fails_closed_when_required_core_relation_is_missing(clean_database):
    config, url = clean_database
    command.upgrade(config, REVISION_0013)
    engine = create_engine(url)
    try:
        with engine.begin() as connection:
            connection.execute(text("DROP TABLE public.ariadne_model_run CASCADE"))

        with pytest.raises(
            sqlalchemy.exc.DBAPIError,
            match=(
                "Ariadne operator workspace repair refused: required predecessor "
                r"relation\(s\) missing: public\.ariadne_model_run"
            ),
        ):
            command.upgrade(config, "head")

        with engine.connect() as connection:
            assert _version(connection) == REVISION_0013
            assert _relation_oid(connection, "public.ariadne_model_run") is None
            assert _relation_oid(connection, "public.ariadne_private_object") is not None
            assert _relation_oid(connection, "public.ariadne_operator_workspace") is not None
    finally:
        engine.dispose()
