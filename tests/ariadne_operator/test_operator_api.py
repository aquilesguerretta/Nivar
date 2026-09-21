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
from app.db.models.ariadne_core import AriadneModelDefinition, AriadneModelVersion
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


def _create_workspace(
    client: TestClient, label: str = "Synthetic API test", *, synthetic: bool = True
) -> dict:
    response = client.post(
        "/api/operator/ariadne/workspaces",
        json={"label": label, "synthetic": synthetic},
    )
    assert response.status_code == 201, response.text
    return response.json()


def _post_ok(client: TestClient, path: str, payload: dict) -> dict:
    response = client.post(path, json=payload)
    assert response.status_code == 201, response.text
    return response.json()


def _all_keys(value):
    if isinstance(value, dict):
        for key, child in value.items():
            yield key
            yield from _all_keys(child)
    elif isinstance(value, list):
        for child in value:
            yield from _all_keys(child)


def _build_protocol(client: TestClient, root: str, prefix: str) -> dict:
    model_id = client.get(root).json()["models"][0]["id"]
    evidence = _post_ok(
        client,
        f"{root}/evidence",
        {
            "sourceArtifactId": f"{prefix}-E1",
            "sourceVersion": "1",
            "locator": f"illustrative://{prefix.lower()}/value-10",
        },
    )
    private_object = _post_ok(
        client, f"{root}/objects", {"objectType": f"{prefix.lower()}_scalar"}
    )
    state = _post_ok(
        client,
        f"{root}/objects/{private_object['id']}/states",
        {"payload": {"value": 10}, "evidenceRefIds": [evidence["id"]]},
    )
    assumption_set = _post_ok(
        client, f"{root}/assumption-sets", {"name": f"{prefix} assumptions"}
    )
    assumption_version = _post_ok(
        client,
        f"{root}/assumption-sets/{assumption_set['id']}/versions",
        {
            "values": {"multiplier": 2},
            "origin": "human_defined",
            "valueSchema": {"multiplier": "integer"},
        },
    )
    scenario = _post_ok(
        client,
        f"{root}/scenarios",
        {
            "name": f"{prefix} scenario",
            "stateVersionId": state["id"],
            "assumptionSetVersionId": assumption_version["id"],
            "hypotheticalState": {},
        },
    )
    run = _post_ok(
        client,
        f"{root}/runs",
        {
            "scenarioId": scenario["id"],
            "modelVersionId": model_id,
        },
    )
    return {
        "model_id": model_id,
        "evidence": evidence,
        "object": private_object,
        "state": state,
        "assumption_set": assumption_set,
        "assumption_version": assumption_version,
        "scenario": scenario,
        "run": run,
    }


def test_every_operator_route_declares_real_auth_dependency():
    for route in ariadne_router.router.routes:
        dependency_calls = {dependency.call for dependency in route.dependant.dependencies}
        assert get_current_user in dependency_calls, f"missing auth dependency: {route.path}"


def test_unauthenticated_request_is_rejected(api_context):
    api = FastAPI()
    api.include_router(ariadne_router.router)

    def db_override():
        with api_context["factory"]() as session:
            yield session

    api.dependency_overrides[get_db] = db_override
    with TestClient(api) as client:
        response = client.get("/api/operator/ariadne/workspaces")
    assert response.status_code == 401
    assert response.json()["detail"] == "not authenticated"


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


def test_normal_workspace_is_empty_and_object_label_is_operator_metadata(
    api_context, monkeypatch
):
    operator = api_context["operator"]
    api_context["current"]["user"] = operator
    _authorize(monkeypatch, operator)
    client = api_context["client"]
    workspace = _create_workspace(
        client, "Manual authoring workspace", synthetic=False
    )
    root = f"/api/operator/ariadne/workspaces/{workspace['id']}"

    initial = client.get(root).json()
    assert initial["workspace"]["synthetic"] is False
    assert initial["models"] == []
    assert initial["evidenceRefs"] == []
    assert initial["objects"] == []
    assert initial["stateVersions"] == []
    assert initial["assumptionSets"] == []

    created = _post_ok(
        client,
        f"{root}/objects",
        {"objectType": "installation", "displayLabel": "Unidade principal"},
    )
    persisted = client.get(root).json()["objects"]
    assert persisted == [
        {
            "id": created["id"],
            "objectType": "installation",
            "displayLabel": "Unidade principal",
            "createdAt": persisted[0]["createdAt"],
            "currentStateVersionId": None,
        }
    ]


def test_internal_model_enablement_is_explicit_idempotent_and_server_controlled(
    api_context, monkeypatch
):
    operator = api_context["operator"]
    api_context["current"]["user"] = operator
    _authorize(monkeypatch, operator)
    client = api_context["client"]
    workspace = _create_workspace(
        client, "Explicit model enablement", synthetic=False
    )
    root = f"/api/operator/ariadne/workspaces/{workspace['id']}"

    assert client.get(root).json()["models"] == []
    first = client.post(f"{root}/models/internal-test", json={})
    second = client.post(f"{root}/models/internal-test", json={})
    assert first.status_code == 201, first.text
    assert second.status_code == 201, second.text
    assert first.json() == second.json()

    models = client.get(root).json()["models"]
    assert len(models) == 1
    assert models[0]["name"] == "deterministic_scalar_model"
    assert models[0]["semanticVersion"] == "1.0.0"
    assert models[0]["implementationIdentity"] == (
        "ariadne.deterministic_scalar.multiply.v1"
    )

    tenant_id = tenant_id_for(uuid.UUID(workspace["id"]))
    with api_context["factory"]() as session:
        definitions = session.execute(
            select(AriadneModelDefinition).where(
                AriadneModelDefinition.tenant_id == tenant_id
            )
        ).scalars().all()
        versions = session.execute(
            select(AriadneModelVersion).where(
                AriadneModelVersion.tenant_id == tenant_id
            )
        ).scalars().all()
        assert len(definitions) == 1
        assert len(versions) == 1

    arbitrary = client.post(
        f"{root}/models/internal-test",
        json={
            "implementationIdentity": "browser.supplied.code",
            "name": "fake_energy_model",
        },
    )
    assert arbitrary.status_code == 422
    assert len(client.get(root).json()["models"]) == 1

    arbitrary_config = client.post(
        f"{root}/runs",
        json={
            "scenarioId": str(uuid.uuid4()),
            "modelVersionId": first.json()["id"],
            "executionConfiguration": {"browser": "chosen"},
        },
    )
    assert arbitrary_config.status_code == 422


def test_internal_model_enablement_requires_operator_and_owned_workspace(
    api_context, monkeypatch
):
    operator = api_context["operator"]
    api_context["current"]["user"] = operator
    _authorize(monkeypatch, operator)
    client = api_context["client"]
    workspace = _create_workspace(client, "Protected model enablement", synthetic=False)
    endpoint = (
        f"/api/operator/ariadne/workspaces/{workspace['id']}/models/internal-test"
    )

    monkeypatch.setenv("ADVISORY_OPERATOR_EMAIL", "somebody-else@example.test")
    unauthorized = client.post(endpoint, json={})
    assert unauthorized.status_code == 403

    api_context["current"]["user"] = api_context["other"]
    monkeypatch.setattr(ariadne_router, "require_operator", lambda _user: None)
    foreign = client.post(endpoint, json={})
    assert foreign.status_code == 404
    api_context["current"]["user"] = operator


@pytest.mark.parametrize(
    "authority_field",
    ["tenant_id", "tenantId", "privateContext", "private_context_id"],
)
def test_browser_cannot_submit_authority_fields(api_context, monkeypatch, authority_field):
    operator = api_context["operator"]
    api_context["current"]["user"] = operator
    _authorize(monkeypatch, operator)
    client = api_context["client"]
    workspace = _create_workspace(client, f"Strict authority {authority_field}")
    root = f"/api/operator/ariadne/workspaces/{workspace['id']}"
    injected = {authority_field: "chosen-by-browser"}
    attempts = [
        ("/api/operator/ariadne/workspaces", {"label": "Injected workspace"}),
        (
            f"{root}/evidence",
            {
                "sourceArtifactId": "INJECTED",
                "sourceVersion": "1",
                "locator": "illustrative://injected",
            },
        ),
        (f"{root}/objects", {"objectType": "injected"}),
        (
            f"{root}/objects/{uuid.uuid4()}/states",
            {"payload": {"value": 1}, "evidenceRefIds": [str(uuid.uuid4())]},
        ),
        (f"{root}/assumption-sets", {"name": "Injected"}),
        (
            f"{root}/assumption-sets/{uuid.uuid4()}/versions",
            {"values": {}, "origin": "human_defined", "valueSchema": {}},
        ),
        (
            f"{root}/scenarios",
            {
                "name": "Injected",
                "stateVersionId": str(uuid.uuid4()),
                "assumptionSetVersionId": str(uuid.uuid4()),
                "hypotheticalState": {},
            },
        ),
        (
            f"{root}/runs",
            {
                "scenarioId": str(uuid.uuid4()),
                "modelVersionId": str(uuid.uuid4()),
            },
        ),
    ]
    for path, payload in attempts:
        response = client.post(path, json={**payload, **injected})
        assert response.status_code == 422, (path, response.text)

    detail = client.get(root).json()
    response_keys = set(_all_keys(detail))
    assert response_keys.isdisjoint(
        {"tenant_id", "tenantId", "privateContext", "private_context_id"}
    )


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


def test_missing_workspace_is_explicit_404(api_context, monkeypatch):
    operator = api_context["operator"]
    api_context["current"]["user"] = operator
    _authorize(monkeypatch, operator)
    response = api_context["client"].get(
        f"/api/operator/ariadne/workspaces/{uuid.uuid4()}"
    )
    assert response.status_code == 404
    assert response.json()["detail"] == "Ariadne workspace not found"


def test_models_get_is_read_only_and_does_not_repair_missing_rows(api_context, monkeypatch):
    operator = api_context["operator"]
    api_context["current"]["user"] = operator
    _authorize(monkeypatch, operator)
    client = api_context["client"]
    workspace = _create_workspace(client, "Read-only model listing")
    root = f"/api/operator/ariadne/workspaces/{workspace['id']}"
    tenant_id = tenant_id_for(uuid.UUID(workspace["id"]))

    with api_context["factory"]() as session:
        versions = list(
            session.execute(
                select(AriadneModelVersion).where(AriadneModelVersion.tenant_id == tenant_id)
            ).scalars()
        )
        definitions = list(
            session.execute(
                select(AriadneModelDefinition).where(
                    AriadneModelDefinition.tenant_id == tenant_id
                )
            ).scalars()
        )
        for row in versions:
            session.delete(row)
        session.flush()
        for row in definitions:
            session.delete(row)
        session.commit()

    response = client.get(f"{root}/models")
    assert response.status_code == 200
    assert response.json() == {"data": []}
    with api_context["factory"]() as session:
        assert session.execute(
            select(AriadneModelVersion).where(AriadneModelVersion.tenant_id == tenant_id)
        ).scalars().all() == []
        assert session.execute(
            select(AriadneModelDefinition).where(AriadneModelDefinition.tenant_id == tenant_id)
        ).scalars().all() == []


def test_duplicate_assumption_set_returns_conflict_not_500(api_context, monkeypatch):
    operator = api_context["operator"]
    api_context["current"]["user"] = operator
    _authorize(monkeypatch, operator)
    client = api_context["client"]
    workspace = _create_workspace(client, "Duplicate set handling")
    root = f"/api/operator/ariadne/workspaces/{workspace['id']}"

    first = client.post(f"{root}/assumption-sets", json={"name": "Same label"})
    second = client.post(f"{root}/assumption-sets", json={"name": "Same label"})
    assert first.status_code == 201
    assert second.status_code == 409
    assert "refresh" in second.json()["detail"]


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


def test_every_cross_workspace_reference_is_rejected(api_context, monkeypatch):
    operator = api_context["operator"]
    api_context["current"]["user"] = operator
    _authorize(monkeypatch, operator)
    client = api_context["client"]
    first = _create_workspace(client, "Cross-scope A")
    second = _create_workspace(client, "Cross-scope B")
    root_a = f"/api/operator/ariadne/workspaces/{first['id']}"
    root_b = f"/api/operator/ariadne/workspaces/{second['id']}"
    graph_a = _build_protocol(client, root_a, "A")
    graph_b = _build_protocol(client, root_b, "B")

    attempts = [
        client.post(
            f"{root_a}/objects/{graph_a['object']['id']}/states",
            json={
                "payload": {"value": 11},
                "evidenceRefIds": [graph_b["evidence"]["id"]],
            },
        ),
        client.post(
            f"{root_a}/objects/{graph_b['object']['id']}/states",
            json={
                "payload": {"value": 11},
                "evidenceRefIds": [graph_a["evidence"]["id"]],
            },
        ),
        client.post(
            f"{root_a}/assumption-sets/{graph_b['assumption_set']['id']}/versions",
            json={
                "values": {"multiplier": 3},
                "origin": "human_defined",
                "valueSchema": {},
            },
        ),
        client.post(
            f"{root_a}/scenarios",
            json={
                "name": "Foreign state",
                "stateVersionId": graph_b["state"]["id"],
                "assumptionSetVersionId": graph_a["assumption_version"]["id"],
                "hypotheticalState": {},
            },
        ),
        client.post(
            f"{root_a}/scenarios",
            json={
                "name": "Foreign assumptions",
                "stateVersionId": graph_a["state"]["id"],
                "assumptionSetVersionId": graph_b["assumption_version"]["id"],
                "hypotheticalState": {},
            },
        ),
        client.post(
            f"{root_a}/runs",
            json={
                "scenarioId": graph_b["scenario"]["id"],
                "modelVersionId": graph_a["model_id"],
            },
        ),
        client.post(
            f"{root_a}/runs",
            json={
                "scenarioId": graph_a["scenario"]["id"],
                "modelVersionId": graph_b["model_id"],
            },
        ),
        client.get(f"{root_a}/results/{graph_b['run']['resultId']}/lineage"),
        client.post(f"{root_a}/results/{graph_b['run']['resultId']}/replay"),
    ]
    for response in attempts:
        assert response.status_code == 422, response.text
        assert "not available in tenant" in response.json()["detail"]
