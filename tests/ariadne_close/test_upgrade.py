import os
import uuid
import pytest
from alembic import command
from alembic.config import Config
from sqlalchemy import create_engine, select, text
from sqlalchemy.orm import Session
from app.db.models.user import User
from app.services import ariadne_core as core
from app.services.ariadne_operator import create_workspace, tenant_id_for
from tests.ariadne_core.test_lineage_persistence import _build_versioned_fixture


@pytest.mark.skipif(
    not os.environ.get("DATABASE_URL"), reason="disposable DATABASE_URL required"
)
def test_upgrade_existing_alpha_preserves_exact_historical_run():
    url = os.environ["DATABASE_URL"]
    assert "ariadne_close_test" in url
    config = Config("alembic.ini")
    config.set_main_option("sqlalchemy.url", url)
    command.downgrade(config, "base")
    command.upgrade(config, "0015_ariadne_operator_label")
    engine = create_engine(url)
    try:
        with Session(engine) as db:
            user = User(
                email=f"migration-{uuid.uuid4()}@example.test",
                name="Synthetic Alpha operator",
                password_hash="synthetic",
            )
            db.add(user)
            db.flush()
            workspace = create_workspace(
                db,
                owner_user_id=user.id,
                label="Existing synthetic Alpha",
                synthetic=False,
            )
            workspace_id = workspace.id
            tenant = tenant_id_for(workspace_id)
            fixture = _build_versioned_fixture(db, tenant)
            # Existing helper returns exact historical entities; take the persisted result.
            from app.db.models.ariadne_core import AriadneResult

            result = (
                db.execute(
                    select(AriadneResult).where(AriadneResult.tenant_id == tenant)
                )
                .scalars()
                .first()
            )
            if result is None:
                # Helper builds the scenario; execute its exact binding.
                from app.db.models.ariadne_core import (
                    AriadneScenario,
                    AriadneModelVersion,
                )

                scenario = (
                    db.execute(
                        select(AriadneScenario).where(
                            AriadneScenario.tenant_id == tenant
                        )
                    )
                    .scalars()
                    .first()
                )
                model = (
                    db.execute(
                        select(AriadneModelVersion).where(
                            AriadneModelVersion.tenant_id == tenant
                        )
                    )
                    .scalars()
                    .first()
                )
                result = core.execute_scenario(
                    db,
                    tenant_id=tenant,
                    scenario_id=scenario.id,
                    model_version_id=model.id,
                ).result
            saved_id = result.id
            saved_payload = result.payload
            db.commit()
        command.upgrade(config, "head")
        with Session(engine) as db:
            outcome = core.replay_result(db, tenant_id=tenant, result_id=saved_id)
            assert outcome.matches and outcome.stored_payload == saved_payload
            assert (
                db.execute(text("SELECT version_num FROM alembic_version")).scalar_one()
                == "0016_ariadne_close"
            )
            assert (
                db.execute(
                    text("SELECT label FROM ariadne_operator_workspace WHERE id=:id"),
                    {"id": workspace_id},
                ).scalar_one()
                == "Existing synthetic Alpha"
            )
    finally:
        engine.dispose()
        command.downgrade(config, "base")
