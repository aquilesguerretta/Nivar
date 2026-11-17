"""Bounded Belo Monte identity, historical replay, and access policy checks."""

from __future__ import annotations

import csv
import io
import json
import os
from dataclasses import replace
from datetime import timedelta
from pathlib import Path
from uuid import uuid4

import pytest
from fastapi import FastAPI
from fastapi.testclient import TestClient
from sqlalchemy.engine import make_url

from app.db.models.user import User
from app.db.session import SessionLocal, get_db
from app.routers.argos_belo_monte import router
from app.services import argos_belo_monte as service
from app.services.argos_memory import capture_snapshot, compute_sha256, reconstruct_snapshot
from app.services.argos_ons_capacidade_geracao_diff import (
    EXPECTED_HEADER,
    DuplicateRowIdentityError,
    SchemaError,
    parse_capacidade_geracao,
)
from app.services.auth_service import get_current_user


API_PATH = "/api/operator/argos/belo-monte"
TEST_SOURCE = "test.argos_memory.niv66.controlled_capacity_revision"
TEST_SITE = service.Site(
    "test-only", "Test site", "TEST SITE", (("TEST-NIV65-UG01", "01"),), (),
)
REPLAY_AT = service.REVIEWED_CAPTURE_AT + timedelta(days=1)


def csv_bytes(*rows, header=EXPECTED_HEADER):
    output = io.StringIO()
    writer = csv.DictWriter(output, fieldnames=header, delimiter=";")
    writer.writeheader()
    writer.writerows(rows)
    return output.getvalue().encode("utf-8")


def make_row(code, *, site="TEST SITE", number="01", capacity="100.00"):
    return {
        "ceg": service.CEG,
        "nom_usina": site,
        "cod_equipamento": code,
        "num_unidadegeradora": number,
        "val_potenciaefetiva": capacity,
        "nom_agenteproprietario": "Test agent",
        "nom_agenteoperador": "Different test agent",
    }


def evidence(rows):
    data = csv_bytes(*rows)
    return service.EvidenceVersion(
        str(uuid4()), REPLAY_AT, None, None, None,
        compute_sha256(data), len(data), parse_capacidade_geracao(data),
    )


def test_original_ons_file():
    path = os.environ.get("NIV66_ORIGINAL_CSV")
    if not path:
        pytest.skip("NIV66_ORIGINAL_CSV requires the independently verified private original")
    data = Path(path).read_bytes()
    assert len(data) == 1_318_263 and compute_sha256(data) == service.REVIEWED_CAPTURE_SHA256
    assert "id_ons" not in EXPECTED_HEADER
    rows = parse_capacidade_geracao(data)
    assert len(rows) == 5837
    assert all(row["ceg"] for row in rows.values())

    scoped_rows = [row for row in rows.values() if row["ceg"] == service.CEG]
    assert len(scoped_rows) == 24
    model = service.compose_read_model(
        service.EvidenceVersion(
            str(uuid4()), service.REVIEWED_CAPTURE_AT, None, None, None,
            compute_sha256(data), len(data), rows,
        )
    )
    assert model["state"] == "VERIFIED"
    assert model["totalMW"] == "11233.08"
    assert [len(site["units"]) for site in model["sites"]] == [18, 6]
    first_units = [site["units"][0] for site in model["sites"]]
    assert [unit["unitNumber"] for unit in first_units] == ["01", "01"]
    assert len({unit["id"] for unit in first_units}) == 2
    assert [unit["observation"]["value"] for unit in first_units] == ["611.11", "38.85"]
    assert model["concession"]["company"]["cnpj"] == "12.300.288/0001-07"


@pytest.mark.parametrize(
    ("rows", "header", "reason"),
    [
        ([make_row(" ")], EXPECTED_HEADER, SchemaError),
        ([make_row("TEST-NIV65-UG01"), make_row("TEST-NIV65-UG01  ")],
         EXPECTED_HEADER, DuplicateRowIdentityError),
        ([make_row("TEST-NIV65-UG01")], EXPECTED_HEADER + ("id_ons",), SchemaError),
    ],
)
def test_parser_fails_closed(rows, header, reason):
    with pytest.raises(reason):
        parse_capacidade_geracao(csv_bytes(*rows, header=header))


@pytest.mark.parametrize(
    ("rows", "identity", "new_codes"),
    [
        ([], "UNKNOWN", 0),
        ([make_row("PABM--0UG01", site="PIMENTAL")], "UNRESOLVED", 0),
        ([make_row("PABM--0UG99", site="BELO MONTE")], "UNKNOWN", 1),
    ],
)
def test_absent_conflicting_or_unreviewed_identities_withhold_observation(rows, identity, new_codes):
    model = service.compose_read_model(evidence(rows))
    unit = model["sites"][0]["units"][0]
    assert model["state"] == "UNRESOLVED"
    assert model["unreviewedUnitCount"] == new_codes
    assert unit["identityState"] == identity
    assert unit["observation"] is None
    assert model["totalMW"] is None
    assert "decommissioned" not in unit


@pytest.mark.parametrize("invalid", ["", "0", "-1", "NaN", "Infinity", "TWh"])
def test_unknown_nominal_capacity_is_never_substituted(invalid):
    version = evidence([make_row("PABM--0UG01", site="BELO MONTE", capacity=invalid)])
    model = service.compose_read_model(version)
    unit = model["sites"][0]["units"][0]
    assert unit["identityState"] == "VERIFIED"
    assert unit["observationState"] == "UNKNOWN"
    assert unit["observation"] is None
    assert model["concession"]["company"]["name"] == "Norte Energia S.A."
    assert model["concession"]["role"] == "concessionaire"
    assert "Test agent" not in json.dumps(model, default=str)
    assert "equity_owner" not in json.dumps(model, default=str)


def test_padding_change_does_not_equal_a_parsed_change(monkeypatch):
    monkeypatch.setattr(service, "SITES", (TEST_SITE,))
    before = evidence([make_row(TEST_SITE.unit_codes[0][0])])
    after = replace(before, id=str(uuid4()), sha256=compute_sha256(b"different formatting"))
    comparison = service.compose_read_model(after, before)["comparison"]
    assert comparison["rawBytesChanged"] is True
    assert comparison["parsedContentChanged"] is False


@pytest.fixture
def local_db():
    raw_url = os.environ.get("DATABASE_URL")
    if not raw_url:
        pytest.skip("requires the dedicated disposable niv66_test database")
    url = make_url(raw_url)
    if url.host != "127.0.0.1" or url.database != "niv66_test" or url.query:
        pytest.skip("requires the dedicated disposable niv66_test database")
    with SessionLocal() as db:
        yield db
        db.rollback()


@pytest.fixture
def browser_api(monkeypatch, local_db):
    monkeypatch.setenv("ARGOS_BELO_MONTE_DEV", "1")
    monkeypatch.setenv("ADVISORY_OPERATOR_EMAIL", "niv66-operator@example.test")
    app = FastAPI()
    app.include_router(router)
    app.dependency_overrides[get_db] = lambda: local_db
    with TestClient(app) as client:
        yield client, app.dependency_overrides


def allow_operator(overrides):
    overrides[get_current_user] = lambda: User(email="niv66-operator@example.test", name="Reviewer")


def test_route_requires_operator_session_and_rejects_non_display_modes(browser_api, monkeypatch):
    client, overrides = browser_api
    denied = client.get(API_PATH)
    assert denied.status_code == 401
    assert denied.headers["cache-control"] == "private, no-store"

    overrides[get_current_user] = lambda: User(email="different@example.test", name="Other")
    assert client.get(API_PATH).status_code == 403
    allow_operator(overrides)
    assert client.get(API_PATH, headers={"Authorization": "Bearer test"}).status_code == 403

    for restricted in ("?raw=true", "?snapshot=" + str(uuid4()), "?format=csv",
                       "?thumbnail=1", "?known_at=2018-01-01", "?known_at=x&known_at=x"):
        response = client.get(API_PATH + restricted)
        assert response.status_code == 400
        assert response.headers["cache-control"] == "private, no-store"
    for restricted in ("/raw", "/bulk", "/export", "/documents/legal.pdf", "/thumbnail"):
        assert client.get(API_PATH + restricted).status_code == 404

    monkeypatch.setenv("ARGOS_BELO_MONTE_DEV", "0")
    assert client.get(API_PATH).status_code == 404
    monkeypatch.setenv("ARGOS_BELO_MONTE_DEV", "1")
    monkeypatch.setenv("RAILWAY_ENVIRONMENT_NAME", "staging")
    assert client.get(API_PATH).status_code == 404


def test_actual_snapshot_read_and_early_unknown(browser_api, monkeypatch):
    snapshot_id = os.environ.get("NIV66_REAL_SNAPSHOT")
    if not snapshot_id:
        pytest.skip("requires the private snapshot ID in NIV66_REAL_SNAPSHOT")
    client, overrides = browser_api
    allow_operator(overrides)
    monkeypatch.setenv(service.SNAPSHOTS_ENV, json.dumps([snapshot_id]))
    assert client.get(API_PATH, params={"known_at": "2018-01-01T00:00:00Z"}).json() == {
        "state": "UNKNOWN", "reason": "NO_EVIDENCE_AT_REQUESTED_TIME",
    }
    response = client.get(API_PATH)
    assert response.status_code == 200
    assert response.headers["cache-control"] == "private, no-store"
    result = response.json()
    assert result["version"]["id"] == snapshot_id
    assert result["version"]["sha256"] == service.REVIEWED_CAPTURE_SHA256
    assert result["version"]["publishedAt"] is None
    assert result["comparison"] is None
    assert "nom_agenteproprietario" not in response.text
    assert "cod_equipamento;" not in response.text


def test_controlled_replay_one_read_model_for_both_views(browser_api, local_db, monkeypatch):
    client, overrides = browser_api
    allow_operator(overrides)
    code, _ = TEST_SITE.unit_codes[0]
    before = csv_bytes(make_row(code))
    after = csv_bytes(make_row(code, capacity="99.50"))
    captures = []
    for offset, data in enumerate((before, after)):
        captures.append(capture_snapshot(
            local_db,
            source_id=TEST_SOURCE,
            data=data,
            content_type="text/csv",
            adapter_version=service.ADAPTER_VERSION,
            retrieved_at=REPLAY_AT + timedelta(seconds=offset),
            acquisition_metadata={"url": "test://niv66/control"},
            rights_summary_state=service.RIGHTS_SUMMARY_STATE,
            rights_record_ref=service.RIGHTS_RECORD_REF,
        ))
    first, second = captures
    monkeypatch.setenv(service.SNAPSHOTS_ENV, json.dumps([str(first.id), str(second.id)]))
    assert client.get(API_PATH).status_code == 503  # fixture is never an official capture

    # Exercise the same read model in a test-only configuration.
    monkeypatch.setattr(service, "SOURCE_ID", TEST_SOURCE)
    monkeypatch.setattr(service, "DEFAULT_RESOURCE_URL", "test://niv66/control")
    monkeypatch.setattr(service, "SITES", (TEST_SITE,))
    for _view in ("map", "terminal"):
        current = client.get(API_PATH).json()
        past = client.get(API_PATH, params={"known_at": REPLAY_AT.isoformat()}).json()
        current_unit = current["sites"][0]["units"][0]
        past_unit = past["sites"][0]["units"][0]
        assert current_unit["id"] == past_unit["id"]
        assert current_unit["observation"]["value"] == "99.50"
        assert past_unit["observation"]["value"] == "100.00"
        assert current_unit["observation"]["comparison"]["fromObservationId"] == past_unit["observation"]["id"]
        assert current["totalMW"] == "99.50" and past["totalMW"] == "100.00"
        assert current["version"]["id"] == str(second.id)
        assert past["version"]["id"] == str(first.id)
        assert current["comparison"]["parsedContentChanged"] is True
        assert current["comparison"]["rawBytesChanged"] is True
        assert len(past["availableVersions"]) == 1
        assert "signal" not in json.dumps(current).lower()
    assert reconstruct_snapshot(local_db, first.id)[1] == before
    assert reconstruct_snapshot(local_db, second.id)[1] == after
    assert second.prior_snapshot_id == first.id


def test_snapshot_without_internal_clearance_is_rejected(browser_api, local_db, monkeypatch):
    client, overrides = browser_api
    allow_operator(overrides)
    snapshot = capture_snapshot(
        local_db,
        source_id=service.SOURCE_ID,
        data=csv_bytes(make_row("PABM--0UG01", site="BELO MONTE")),
        content_type="text/csv",
        adapter_version=service.ADAPTER_VERSION,
        retrieved_at=REPLAY_AT,
        acquisition_metadata={"url": service.DEFAULT_RESOURCE_URL},
        rights_summary_state="restricted",
        rights_record_ref=service.RIGHTS_RECORD_REF,
    )
    monkeypatch.setenv(service.SNAPSHOTS_ENV, json.dumps([str(snapshot.id)]))
    response = client.get(API_PATH)
    assert response.status_code == 503
    assert response.headers["cache-control"] == "private, no-store"
    assert response.json()["state"] == "UNRESOLVED"
