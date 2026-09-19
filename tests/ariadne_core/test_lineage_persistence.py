"""PostgreSQL integration tests for Ariadne Core v0 (NIV-46).

Set ``DATABASE_URL`` to a disposable PostgreSQL database.  The real Alembic
chain is applied and removed.  The suite skips when no disposable database is
available; it must never be pointed at a shared or production database.
"""

from __future__ import annotations

import os
import uuid
from datetime import datetime, timezone

import pytest
import sqlalchemy
from alembic import command
from alembic.config import Config
from sqlalchemy import create_engine, select, text
from sqlalchemy.exc import OperationalError
from sqlalchemy.orm import Session

from app.db.models.ariadne_core import (
    AriadneModelRun,
    AriadneModelVersion,
    AriadnePrivateStateVersion,
    AriadneResult,
    AriadneScenario,
)
from app.services.ariadne_core import (
    DETERMINISTIC_SCALAR_IMPLEMENTATION,
    DETERMINISTIC_SCALAR_MODEL,
    TenantScopeError,
    create_assumption_set,
    create_assumption_set_version,
    create_evidence_ref,
    create_model_definition,
    create_model_version,
    create_private_object,
    create_scenario,
    create_state_version,
    execute_scenario,
    get_current_state_version,
    reconstruct_result_lineage,
    replay_result,
)


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


@pytest.fixture(scope="module")
def migrated_engine():
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


def _tenant(prefix: str) -> str:
    return f"{prefix}-{uuid.uuid4().hex}"


def _build_versioned_fixture(session: Session, tenant_id: str):
    evidence_v1 = create_evidence_ref(
        session,
        tenant_id=tenant_id,
        source_artifact_id="synthetic-source-001",
        source_version="content-v1",
        locator="field:value",
        observed_at=datetime.now(timezone.utc),
    )
    private_object = create_private_object(
        session, tenant_id=tenant_id, object_type="synthetic_scalar"
    )
    state_v1 = create_state_version(
        session,
        tenant_id=tenant_id,
        object_id=private_object.id,
        payload={"value": 10},
        evidence_ref_ids=[evidence_v1.id],
    )
    assumption_set = create_assumption_set(
        session, tenant_id=tenant_id, name="synthetic multiplier"
    )
    assumption_v1 = create_assumption_set_version(
        session,
        tenant_id=tenant_id,
        assumption_set_id=assumption_set.id,
        values={"multiplier": 2},
        value_schema={"multiplier": {"type": "integer", "unit": None}},
        origin="human_defined",
    )
    model_definition = create_model_definition(
        session, tenant_id=tenant_id, name=DETERMINISTIC_SCALAR_MODEL
    )
    model_version = create_model_version(
        session,
        tenant_id=tenant_id,
        model_definition_id=model_definition.id,
        semantic_version="1.0.0",
        implementation_identity=DETERMINISTIC_SCALAR_IMPLEMENTATION,
        input_contract={
            "observed_state": {"value": "integer"},
            "assumptions": {"multiplier": "integer"},
        },
        output_contract={"scalar_result": {"value": "integer"}},
    )
    scenario_v1 = create_scenario(
        session,
        tenant_id=tenant_id,
        name="synthetic scenario v1",
        state_version_id=state_v1.id,
        assumption_set_version_id=assumption_v1.id,
        # Deliberately collides by key with observed state.  It remains a
        # separate scenario hypothesis and cannot mutate or replace V1.
        hypothetical_state={"value": 999},
    )
    run_v1 = execute_scenario(
        session,
        tenant_id=tenant_id,
        scenario_id=scenario_v1.id,
        model_version_id=model_version.id,
    )
    session.commit()

    evidence_v2 = create_evidence_ref(
        session,
        tenant_id=tenant_id,
        source_artifact_id="synthetic-source-001",
        source_version="content-v2",
        locator="field:value",
        observed_at=datetime.now(timezone.utc),
        transform_ref="correction-of:content-v1",
    )
    state_v2 = create_state_version(
        session,
        tenant_id=tenant_id,
        object_id=private_object.id,
        payload={"value": 12},
        evidence_ref_ids=[evidence_v2.id],
    )
    scenario_v2 = create_scenario(
        session,
        tenant_id=tenant_id,
        name="synthetic scenario v2",
        state_version_id=state_v2.id,
        assumption_set_version_id=assumption_v1.id,
    )
    run_v2 = execute_scenario(
        session,
        tenant_id=tenant_id,
        scenario_id=scenario_v2.id,
        model_version_id=model_version.id,
    )
    session.commit()
    return {
        "evidence_v1": evidence_v1,
        "evidence_v2": evidence_v2,
        "private_object": private_object,
        "state_v1": state_v1,
        "state_v2": state_v2,
        "assumption_v1": assumption_v1,
        "model_version": model_version,
        "scenario_v1": scenario_v1,
        "scenario_v2": scenario_v2,
        "run_v1": run_v1,
        "run_v2": run_v2,
    }


def test_v1_v2_runs_remain_reconstructible_and_reproducible(migrated_engine):
    tenant_id = _tenant("vertical-slice")
    with Session(migrated_engine) as session:
        fixture = _build_versioned_fixture(session, tenant_id)

        state_v1 = fixture["state_v1"]
        state_v2 = fixture["state_v2"]
        run_v1 = fixture["run_v1"]
        run_v2 = fixture["run_v2"]

        assert state_v1.version == 1
        assert state_v1.payload == {"value": 10}
        assert state_v1.previous_version_id is None
        assert state_v2.version == 2
        assert state_v2.payload == {"value": 12}
        assert state_v2.previous_version_id == state_v1.id

        current = get_current_state_version(
            session, tenant_id=tenant_id, object_id=fixture["private_object"].id
        )
        assert current is not None and current.id == state_v2.id
        view_id = session.execute(
            text(
                "SELECT id FROM ariadne_current_state_version "
                "WHERE tenant_id = :tenant_id AND object_id = :object_id"
            ),
            {"tenant_id": tenant_id, "object_id": fixture["private_object"].id},
        ).scalar_one()
        assert view_id == state_v2.id

        lineage_v1 = reconstruct_result_lineage(
            session, tenant_id=tenant_id, result_id=run_v1.result.id
        )
        assert lineage_v1.result.payload == {"value": 20}
        assert lineage_v1.model_run.id == run_v1.model_run.id
        assert lineage_v1.model_version.id == fixture["model_version"].id
        assert lineage_v1.scenario.id == fixture["scenario_v1"].id
        assert lineage_v1.scenario.hypothetical_state == {"value": 999}
        assert lineage_v1.assumption_set_version.id == fixture["assumption_v1"].id
        assert lineage_v1.state_version.id == state_v1.id
        assert lineage_v1.state_version.payload == {"value": 10}
        assert [ref.id for ref in lineage_v1.evidence_refs] == [fixture["evidence_v1"].id]

        lineage_v2 = reconstruct_result_lineage(
            session, tenant_id=tenant_id, result_id=run_v2.result.id
        )
        assert lineage_v2.result.payload == {"value": 24}
        assert lineage_v2.state_version.id == state_v2.id
        assert [ref.id for ref in lineage_v2.evidence_refs] == [fixture["evidence_v2"].id]

        replay_v1 = replay_result(session, tenant_id=tenant_id, result_id=run_v1.result.id)
        replay_v2 = replay_result(session, tenant_id=tenant_id, result_id=run_v2.result.id)
        assert replay_v1.matches and replay_v1.replayed_payload == {"value": 20}
        assert replay_v2.matches and replay_v2.replayed_payload == {"value": 24}


def test_known_result_id_does_not_cross_tenant_boundary(migrated_engine):
    owner_tenant = _tenant("owner")
    other_tenant = _tenant("other")
    with Session(migrated_engine) as session:
        fixture = _build_versioned_fixture(session, owner_tenant)
        result_id = fixture["run_v1"].result.id
        object_id = fixture["private_object"].id

        with pytest.raises(TenantScopeError):
            reconstruct_result_lineage(session, tenant_id=other_tenant, result_id=result_id)
        with pytest.raises(TenantScopeError):
            get_current_state_version(session, tenant_id=other_tenant, object_id=object_id)


def test_historical_records_reject_update_and_delete(migrated_engine):
    tenant_id = _tenant("immutable")
    with Session(migrated_engine) as session:
        fixture = _build_versioned_fixture(session, tenant_id)
        mutations = (
            (
                "UPDATE ariadne_private_state_version SET payload = '{\"value\": 999}' "
                "WHERE id = :id",
                fixture["state_v1"].id,
            ),
            (
                "UPDATE ariadne_model_version SET implementation_identity = 'changed' "
                "WHERE id = :id",
                fixture["model_version"].id,
            ),
            (
                "UPDATE ariadne_scenario SET hypothetical_state = '{}' WHERE id = :id",
                fixture["scenario_v1"].id,
            ),
            (
                "DELETE FROM ariadne_model_run WHERE id = :id",
                fixture["run_v1"].model_run.id,
            ),
            (
                "UPDATE ariadne_result SET payload = '{\"value\": 999}' WHERE id = :id",
                fixture["run_v1"].result.id,
            ),
        )
        for statement, row_id in mutations:
            with pytest.raises(sqlalchemy.exc.DBAPIError, match="ariadne"):
                session.execute(text(statement), {"id": row_id})
                session.commit()
            session.rollback()

        assert session.execute(
            select(AriadnePrivateStateVersion.payload).where(
                AriadnePrivateStateVersion.id == fixture["state_v1"].id
            )
        ).scalar_one() == {"value": 10}
        assert session.get(AriadneModelVersion, fixture["model_version"].id) is not None
        assert session.get(AriadneScenario, fixture["scenario_v1"].id) is not None
        assert session.get(AriadneModelRun, fixture["run_v1"].model_run.id) is not None
        assert session.get(AriadneResult, fixture["run_v1"].result.id) is not None
