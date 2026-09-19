"""PostgreSQL HTTP integration tests for the NIV-48 operator surface.

The suite deliberately skips without a reachable disposable ``DATABASE_URL``.
It applies and removes the real Alembic chain; never point it at shared data.
"""

from __future__ import annotations

import os
import uuid

import pytest
from alembic import command
from alembic.config import Config
from fastapi import FastAPI
from fastapi.testclient import TestClient
from sqlalchemy import create_engine, select
from sqlalchemy.exc import OperationalError
from sqlalchemy.orm import sessionmaker

import app.routers.ariadne_operator as ariadne_router
from app.db.models.ariadne_core import AriadneModelDefinition
from app.db.models.user import User
from app.db.session import get_db
from app.services.ariadne_operator import tenant_id_for
from app.services.auth_service import get_current_user


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
def api_context():
    assert _URL is not None
    config = Config("alembic.ini")
    config.set_main_option("sqlalchemy.url", _URL)
    command.upgrade(config, "head")
    engine = create_engine(_URL)
    factory = sessionmaker(bind=engine, expire_on_commit=False)

    with factory() as session:
        operator = User(
            email=f"operator-{uuid.uuid4().hex}@example.test",
            name="Operator One",
            password_hash="not-a-real-password-hash",
        )
        other = User(
            email=f"operator-{uuid.uuid4().hex}@example.test",
            name="Operator Two",
            password_hash="not-a-real-password-hash",
        )
        session.add_all([operator, other])
        session.commit()

    current = {"user": operator}
    api = FastAPI()
    api.include_router(ariadne_router.router)

    def db_override():
        with factory() as session:
            yield session

    api.dependency_overrides[get_db] = db_override
    api.dependency_overrides[get_current_user] = lambda: current["user"]
    client = TestClient(api)
    try:
        yield {
            "client": client,
            "factory": factory,
            "operator": operator,
            "other": other,
            "current": current,
        }
    finally:
        client.close()
        engine.dispose()
        command.downgrade(config, "base")


def _authorize(monkeypatch, user: User) -> None:
    monkeypatch.setenv("ADVISORY_OPERATOR_EMAIL", user.email)


def _create_workspace(client: TestClient, label: str = "Synthetic API test") -> dict:
    response = client.post("/api/operator/ariadne/workspaces", json={"label": label})
    assert response.status_code == 201, response.text
    return response.json()


def test_non_operator_cannot_access(api_context, monkeypatch):
    monkeypatch.setenv("ADVISORY_OPERATOR_EMAIL", "somebody-else@example.test")
    response = api_context["client"].get("/api/operator/ariadne/workspaces")
    assert response.status_code == 403
    assert response.json()["detail"] == "operator access required"


def test_operator_creates_workspace_and_server_derives_context(api_context, monkeypatch):
    operator = api_context["operator"]
    _authorize(monkeypatch, operator)
    workspace = _create_workspace(api_context["client"])

    assert workspace["synthetic"] is True
    with api_context["factory"]() as session:
        model = session.execute(select(AriadneModelDefinition)).scalar_one()
        assert model.tenant_id == tenant_id_for(uuid.UUID(workspace["id"]))
        assert str(operator.id) not in model.tenant_id

    injected = api_context["client"].post(
        "/api/operator/ariadne/workspaces",
        json={"label": "Attempt", "tenant_id": "chosen-by-browser"},
    )
    assert injected.status_code == 422


def test_workspace_owner_is_enforced_when_operator_gate_allows_multiple_users(
    api_context, monkeypatch
):
    operator = api_context["operator"]
    _authorize(monkeypatch, operator)
    workspace = _create_workspace(api_context["client"], "Owned by first operator")

    api_context["current"]["user"] = api_context["other"]
    monkeypatch.setattr(ariadne_router, "require_operator", lambda _user: None)
    response = api_context["client"].get(
        f"/api/operator/ariadne/workspaces/{workspace['id']}"
    )
    assert response.status_code == 404
    api_context["current"]["user"] = operator


def test_full_v1_v2_lineage_and_replay_flow(api_context, monkeypatch):
    operator = api_context["operator"]
    api_context["current"]["user"] = operator
    _authorize(monkeypatch, operator)
    client = api_context["client"]
    workspace = _create_workspace(client, "End-to-end synthetic flow")
    root = f"/api/operator/ariadne/workspaces/{workspace['id']}"

    detail = client.get(root).json()
    model_id = detail["models"][0]["id"]

    e1 = client.post(
        f"{root}/evidence",
        json={
            "sourceArtifactId": "SYNTHETIC-E1",
            "sourceVersion": "1",
            "locator": "illustrative://scalar/input/value-10",
        },
    ).json()
    obj = client.post(
        f"{root}/objects", json={"objectType": "synthetic_scalar_observation"}
    ).json()
    v1_response = client.post(
        f"{root}/objects/{obj['id']}/states",
        json={"payload": {"value": 10}, "evidenceRefIds": [e1["id"]]},
    )
    assert v1_response.status_code == 201, v1_response.text
    v1 = v1_response.json()
    assumption_set = client.post(
        f"{root}/assumption-sets", json={"name": "A1 — Multiplicador sintético"}
    ).json()
    a1 = client.post(
        f"{root}/assumption-sets/{assumption_set['id']}/versions",
        json={
            "values": {"multiplier": 2},
            "origin": "human_defined",
            "valueSchema": {"multiplier": "integer"},
        },
    ).json()
    s1 = client.post(
        f"{root}/scenarios",
        json={
            "name": "S1 — Estado observado V1",
            "stateVersionId": v1["id"],
            "assumptionSetVersionId": a1["id"],
            "hypotheticalState": {},
        },
    ).json()
    r1_response = client.post(
        f"{root}/runs",
        json={
            "scenarioId": s1["id"],
            "modelVersionId": model_id,
            "executionConfiguration": {"arithmetic": "integer"},
        },
    )
    assert r1_response.status_code == 201, r1_response.text
    r1 = r1_response.json()
    assert r1["payload"] == {"value": 20}

    e2 = client.post(
        f"{root}/evidence",
        json={
            "sourceArtifactId": "SYNTHETIC-E2",
            "sourceVersion": "2",
            "locator": "illustrative://scalar/input/value-12",
        },
    ).json()
    v2 = client.post(
        f"{root}/objects/{obj['id']}/states",
        json={"payload": {"value": 12}, "evidenceRefIds": [e2["id"]]},
    ).json()
    assert v2["version"] == 2
    s2 = client.post(
        f"{root}/scenarios",
        json={
            "name": "S2 — Estado observado V2",
            "stateVersionId": v2["id"],
            "assumptionSetVersionId": a1["id"],
            "hypotheticalState": {},
        },
    ).json()
    r2 = client.post(
        f"{root}/runs",
        json={
            "scenarioId": s2["id"],
            "modelVersionId": model_id,
            "executionConfiguration": {"arithmetic": "integer"},
        },
    ).json()
    assert r2["payload"] == {"value": 24}

    detail = client.get(root).json()
    current = next(row for row in detail["stateVersions"] if row["current"])
    assert current["id"] == v2["id"]
    assert current["payload"] == {"value": 12}

    lineage_response = client.get(f"{root}/results/{r1['resultId']}/lineage")
    assert lineage_response.status_code == 200, lineage_response.text
    lineage = lineage_response.json()
    assert lineage["state"]["id"] == v1["id"]
    assert lineage["state"]["version"] == 1
    assert lineage["evidenceRefs"][0]["id"] == e1["id"]
    assert lineage["result"]["payload"] == {"value": 20}

    replay = client.post(f"{root}/results/{r1['resultId']}/replay").json()
    assert replay == {
        "resultId": r1["resultId"],
        "storedPayload": {"value": 20},
        "replayedPayload": {"value": 20},
        "matches": True,
    }


def test_cross_workspace_reference_is_rejected(api_context, monkeypatch):
    operator = api_context["operator"]
    api_context["current"]["user"] = operator
    _authorize(monkeypatch, operator)
    client = api_context["client"]
    first = _create_workspace(client, "Cross-scope A")
    second = _create_workspace(client, "Cross-scope B")
    root_a = f"/api/operator/ariadne/workspaces/{first['id']}"
    root_b = f"/api/operator/ariadne/workspaces/{second['id']}"
    obj = client.post(f"{root_a}/objects", json={"objectType": "synthetic"}).json()
    foreign_evidence = client.post(
        f"{root_b}/evidence",
        json={
            "sourceArtifactId": "FOREIGN",
            "sourceVersion": "1",
            "locator": "illustrative://foreign",
        },
    ).json()

    response = client.post(
        f"{root_a}/objects/{obj['id']}/states",
        json={
            "payload": {"value": 10},
            "evidenceRefIds": [foreign_evidence["id"]],
        },
    )
    assert response.status_code == 422
    assert "not available in tenant" in response.json()["detail"]
