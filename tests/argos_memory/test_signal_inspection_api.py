"""NIV-52 read-only inspection API and authority-boundary tests."""

from __future__ import annotations

import json
import os
import uuid
from dataclasses import replace
from datetime import datetime, timedelta, timezone
from pathlib import Path

import pytest
from alembic import command
from alembic.config import Config
from fastapi import FastAPI
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.exc import OperationalError
from sqlalchemy.orm import sessionmaker

import app.routers.argos_signal_inspection as inspection_router
import app.services.argos_ons_capacidade_signal_inspection as inspection_service
from app.db.models.user import User
from app.db.session import get_db
from app.services.argos_memory import capture_snapshot
from app.services.argos_ons_capacidade_geracao_diff import SOURCE_ID
from app.services.argos_ons_capacidade_geracao_signal import (
    RIGHTS_RECORD_REF,
    RightsContext,
    SnapshotPairObservation,
    build_candidate_events,
)
from app.services.auth_service import get_current_user


REPO_ROOT = Path(__file__).resolve().parents[2]
FIXTURES = REPO_ROOT / "tests" / "argos_memory" / "fixtures" / "ons_capacidade_geracao"
GOLD_FIXTURES = (
    REPO_ROOT
    / "tests"
    / "argos_memory"
    / "gold_sets"
    / "ons_capacidade"
    / "v0_1"
    / "fixtures"
)
SCENARIO_FIXTURES = {
    "promote-effective-power": (
        FIXTURES / "fixture_a.csv",
        FIXTURES / "fixture_b_known_field_change.csv",
    ),
    "hold-removal-health-unresolved": (
        FIXTURES / "fixture_a.csv",
        FIXTURES / "fixture_b_added_removed.csv",
    ),
    "reject-presentation-only": (
        GOLD_FIXTURES / "gold_baseline.csv",
        GOLD_FIXTURES / "sg013_presentation_label_b.csv",
    ),
}


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
            email=f"argos-operator-{uuid.uuid4().hex}@example.test",
            name="Argos Operator",
            password_hash="not-a-real-password-hash",
        )
        other = User(
            email=f"argos-other-{uuid.uuid4().hex}@example.test",
            name="Other User",
            password_hash="not-a-real-password-hash",
        )
        session.add_all([operator, other])
        session.commit()

        pairs: dict[str, dict[str, str]] = {}
        now = datetime.now(timezone.utc)
        offset = 0
        for scenario_id, fixture_paths in SCENARIO_FIXTURES.items():
            ids: list[str] = []
            for role, path in zip(("from", "to"), fixture_paths):
                snapshot = capture_snapshot(
                    session,
                    source_id=SOURCE_ID,
                    data=path.read_bytes(),
                    content_type="text/csv",
                    adapter_version="test.niv-52@1",
                    retrieved_at=now + timedelta(minutes=offset),
                    acquisition_metadata={
                        "synthetic": True,
                        "scenario": scenario_id,
                        "role": role,
                    },
                    rights_record_ref=RIGHTS_RECORD_REF,
                    rights_summary_state="cleared",
                )
                session.commit()
                ids.append(str(snapshot.id))
                offset += 1
            pairs[scenario_id] = {"from": ids[0], "to": ids[1]}

    current = {"user": operator}
    api = FastAPI()
    api.include_router(inspection_router.router)

    def db_override():
        with factory() as session:
            yield session

    api.dependency_overrides[get_db] = db_override
    api.dependency_overrides[get_current_user] = lambda: current["user"]
    client = TestClient(api)
    old_config = os.environ.get(inspection_service.SNAPSHOT_CONFIG_ENV)
    os.environ[inspection_service.SNAPSHOT_CONFIG_ENV] = json.dumps(pairs)
    old_operator = os.environ.get("ADVISORY_OPERATOR_EMAIL")
    os.environ["ADVISORY_OPERATOR_EMAIL"] = operator.email
    try:
        yield {
            "client": client,
            "factory": factory,
            "operator": operator,
            "other": other,
            "current": current,
            "pairs": pairs,
        }
    finally:
        client.close()
        if old_config is None:
            os.environ.pop(inspection_service.SNAPSHOT_CONFIG_ENV, None)
        else:
            os.environ[inspection_service.SNAPSHOT_CONFIG_ENV] = old_config
        if old_operator is None:
            os.environ.pop("ADVISORY_OPERATOR_EMAIL", None)
        else:
            os.environ["ADVISORY_OPERATOR_EMAIL"] = old_operator
        engine.dispose()
        command.downgrade(config, "base")


def _get(api_context, scenario_id: str):
    response = api_context["client"].get(
        f"/api/operator/argos/ons-capacidade/inspection/{scenario_id}"
    )
    assert response.status_code == 200, response.text
    return response.json()


def test_route_is_authenticated_and_read_only(api_context):
    for route in inspection_router.router.routes:
        dependencies = {dependency.call for dependency in route.dependant.dependencies}
        assert get_current_user in dependencies
        assert route.methods == {"GET"}

    api = FastAPI()
    api.include_router(inspection_router.router)

    def db_override():
        with api_context["factory"]() as session:
            yield session

    api.dependency_overrides[get_db] = db_override
    with TestClient(api) as client:
        response = client.get(
            "/api/operator/argos/ons-capacidade/inspection/promote-effective-power"
        )
    assert response.status_code == 401

    api_context["current"]["user"] = api_context["other"]
    forbidden = api_context["client"].get(
        "/api/operator/argos/ons-capacidade/inspection/promote-effective-power"
    )
    assert forbidden.status_code == 403
    api_context["current"]["user"] = api_context["operator"]

    post = api_context["client"].post(
        "/api/operator/argos/ons-capacidade/inspection/promote-effective-power",
        json={"source_health_state": "HEALTHY_COMPLETE"},
    )
    assert post.status_code == 405


def test_promote_read_model_uses_minted_claim_and_exact_snapshot_ids(api_context):
    payload = _get(api_context, "promote-effective-power")
    pair = api_context["pairs"]["promote-effective-power"]

    assert payload["scenario"] == {
        "id": "promote-effective-power",
        "label": "Potência efetiva registrada",
        "goldReference": "SG-004",
        "synthetic": True,
    }
    assert payload["promotion"]["decision"] == "PROMOTE"
    assert payload["promotion"]["reasonCode"] == "MATERIAL_RECONSTRUCTIBLE_CHANGE"
    assert payload["claim"]["factualClaim"] == (
        "The effective power recorded for unit TEST-EQ-002 changed from 20.0 MW "
        "to 22.5 MW between two stored observations of the ONS dataset."
    )
    assert payload["observations"] == {
        "fromSnapshotId": pair["from"],
        "toSnapshotId": pair["to"],
    }
    assert payload["evidence"]["refs"] == [pair["from"], pair["to"]]
    assert payload["evidence"]["fromSnapshotId"] == pair["from"]
    assert payload["evidence"]["toSnapshotId"] == pair["to"]
    assert payload["event"]["parserVersion"] == "ons.capacidade_geracao.parser@1"
    assert payload["event"]["diffVersion"] == "ons.capacidade_geracao.diff@1"
    assert payload["promotion"]["rights"] == {
        "surface": "human_signal_display",
        "state": "CLEARED_WITH_ATTRIBUTION",
        "rightsRecordRef": RIGHTS_RECORD_REF,
        "attributionRequired": True,
    }
    assert "fixture" not in json.dumps(payload).lower()


@pytest.mark.parametrize(
    ("scenario_id", "decision", "reason"),
    [
        (
            "hold-removal-health-unresolved",
            "HOLD",
            "SOURCE_HEALTH_UNRESOLVED",
        ),
        (
            "reject-presentation-only",
            "REJECT",
            "PRESENTATION_ONLY_CHANGE",
        ),
    ],
)
def test_hold_and_reject_never_contain_a_signal_claim(
    api_context, scenario_id, decision, reason
):
    payload = _get(api_context, scenario_id)
    pair = api_context["pairs"][scenario_id]
    assert payload["promotion"]["decision"] == decision
    assert payload["promotion"]["reasonCode"] == reason
    assert payload["claim"] is None
    assert payload["evidence"]["refs"] == [pair["from"], pair["to"]]
    if decision == "HOLD":
        assert payload["promotion"]["sourceHealthState"] == "UNRESOLVED"
        assert "Absence is not zero." in payload["promotion"]["caveats"]


@pytest.mark.parametrize(
    "authority_field",
    [
        "source_health_state",
        "evidence_reconstructible",
        "semantics_understood",
        "materiality_state",
        "rights",
        "attribution_required",
        "from_snapshot_id",
        "to_snapshot_id",
    ],
)
def test_browser_cannot_inject_evidence_or_promotion_authority(
    api_context, authority_field
):
    response = api_context["client"].get(
        "/api/operator/argos/ons-capacidade/inspection/promote-effective-power",
        params={authority_field: "browser-controlled"},
    )
    assert response.status_code == 400
    assert response.json()["detail"].startswith("inspection context is server-owned")


@pytest.mark.parametrize("gate", ["rights", "source_health", "materiality"])
def test_server_context_drift_fails_closed(api_context, monkeypatch, gate):
    scenario = inspection_service.SCENARIOS["promote-effective-power"]
    if gate == "rights":
        scenario = replace(
            scenario,
            rights=RightsContext(
                surface="machine_api_redistribution",
                state="UNCLEAR",
                rights_record_ref=RIGHTS_RECORD_REF,
            ),
        )
    elif gate == "source_health":
        scenario = replace(scenario, source_health_state="UNAVAILABLE")
    else:
        scenario = replace(scenario, materiality_state="NON_MATERIAL")
    monkeypatch.setattr(
        inspection_service,
        "SCENARIOS",
        {**inspection_service.SCENARIOS, "promote-effective-power": scenario},
    )
    response = api_context["client"].get(
        "/api/operator/argos/ons-capacidade/inspection/promote-effective-power"
    )
    assert response.status_code == 503
    assert response.json()["detail"] == "bounded inspection scenario failed closed"


def test_unattested_pure_builder_event_cannot_reach_surface(
    api_context, monkeypatch
):
    pair = api_context["pairs"]["promote-effective-power"]
    from_bytes = SCENARIO_FIXTURES["promote-effective-power"][0].read_bytes()
    to_bytes = SCENARIO_FIXTURES["promote-effective-power"][1].read_bytes()
    unattested = build_candidate_events(
        SnapshotPairObservation(
            source_id=SOURCE_ID,
            from_bytes=from_bytes,
            to_bytes=to_bytes,
            from_evidence_ref=pair["from"],
            to_evidence_ref=pair["to"],
        )
    )
    monkeypatch.setattr(
        inspection_service,
        "build_candidate_events_from_snapshots",
        lambda *_args, **_kwargs: unattested,
    )
    response = api_context["client"].get(
        "/api/operator/argos/ons-capacidade/inspection/promote-effective-power"
    )
    assert response.status_code == 503
    assert response.json()["detail"] == "bounded inspection scenario failed closed"


def test_unknown_or_unconfigured_scenario_fails_closed(api_context, monkeypatch):
    unknown = api_context["client"].get(
        "/api/operator/argos/ons-capacidade/inspection/browser-invented"
    )
    assert unknown.status_code == 404

    monkeypatch.delenv(inspection_service.SNAPSHOT_CONFIG_ENV)
    unavailable = api_context["client"].get(
        "/api/operator/argos/ons-capacidade/inspection/promote-effective-power"
    )
    assert unavailable.status_code == 503
