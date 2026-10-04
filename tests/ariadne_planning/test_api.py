"""HTTP, exact Core preservation and lost-response tests in disposable PG17."""

import uuid
import pytest
from sqlalchemy import select, func
from tests.ariadne_close.test_api import api, post, calculate
from tests.ariadne_planning.test_demand_intake import demand_csv, PUBLIC
from app.routers import ariadne_planning
from app.db.models.ariadne_core import AriadneModelRun, AriadneAssumptionSetVersion
from app.services import ariadne_planning as service


@pytest.fixture(autouse=True)
def gates(monkeypatch, api):
    if not any(
        getattr(r, "path", "").endswith("/planning/preview")
        for r in api["client"].app.routes
    ):
        api["client"].app.include_router(ariadne_planning.router)
    monkeypatch.setenv("ARIADNE_CLOSE_DEV", "1")
    monkeypatch.setenv("ARIADNE_CLOSE_ENV", "test")
    monkeypatch.setenv("ARIADNE_PLAN_DEV", "1")
    monkeypatch.setenv("ADVISORY_OPERATOR_EMAIL", api["user"].email)
    api["state"].update(user=api["user"], expired=False, lose=False)


def tariff_csv():
    return (
        "supplier_cnpj,subgroup,modality,class,subclass,detail,time_band,unit,rate,currency,basis,effective_from,effective_to,authority,reference_id,rate_kind\n"
        "07047251000170,A4,Verde,Não se aplica,Não se aplica,Não se aplica,Não se aplica,kW,15.20,BRL,PRE_TAX_REFERENCE,2019-04-22,2020-04-21,Synthetic verified fixture,TEST-T1,OFFICIAL_TARIFF_REFERENCE\n"
    ).encode()


def upload_confirm(api, root, data, filename, role, mode, supersedes=None):
    form = {"role": role, "inspection": "true"}
    if supersedes:
        form["supersedesId"] = supersedes
    response = api["client"].post(
        root + "/sources",
        data=form,
        files={"file": (filename, data)},
        headers={"Idempotency-Key": str(uuid.uuid4())},
    )
    assert response.status_code == 201, response.text
    id = response.json()["id"]
    detail = api["client"].get(root).json()
    source = next(s for s in detail["sources"] if s["id"] == id)
    mapping = {
        "sheet": (
            source["preview"]["tables"][0]["name"]
            if source["preview"]["tables"]
            else ""
        ),
        "mapping": {},
        "numericMode": "strict",
        "manualRows": [],
        "reviewMode": mode,
    }
    preview = post(api, root + f"/sources/{id}/candidates", mapping, status=200)
    post(
        api,
        root + f"/sources/{id}/confirm",
        {
            **mapping,
            "selectedRows": [r["index"] for r in preview["rows"] if not r["errors"]],
            "previousConfirmationVersionId": None,
        },
    )
    return id


def build(api, **changes):
    w = post(
        api,
        "/api/operator/ariadne/close/workspaces",
        {"label": "Planning synthetic", "synthetic": True},
    )
    root = f"/api/operator/ariadne/workspaces/{w['id']}/close/reviews"
    r = post(
        api, root, {"scope": "TEST-UNIT", "period": "2019-06", "ruleVersion": "0.2.0"}
    )
    root += "/" + r["id"]
    source = upload_confirm(
        api, root, demand_csv(**changes), "demand.csv", "invoice", "demand_profile"
    )
    upload_confirm(
        api, root, tariff_csv(), "tariffs.csv", "context", "tariff_reference"
    )
    result = calculate(api, root)
    return w, root, root + f"/calculations/{result['id']}/planning", source, result


BODY = {
    "candidateKw": "280",
    "normalRegime": True,
    "tariffApplicability": True,
    "name": "Alternativa",
    "acknowledgeHistoricalBaseline": False,
}


def test_preview_save_duplicate_compare_export_exact_replay_without_copied_state(api):
    w, root, p, _, baseline = build(api)
    initial = api["client"].get(p).json()
    assert (
        initial["output"]["cost"] is None
        and initial["output"]["baselineKw"] == "280.00"
    )
    preview = post(
        api,
        p + "/preview?curve=true",
        {k: BODY[k] for k in ("candidateKw", "normalRegime", "tariffApplicability")},
        status=200,
    )
    saved = post(api, p + "/scenarios", BODY)
    assert saved["output"] == preview["output"]
    second = post(
        api, p + "/scenarios", {**BODY, "candidateKw": "260"}
    )  # same human name is legal
    copy = post(api, p + f"/scenarios/{second['id']}/duplicate", {"name": "Cópia"})
    assert copy["output"] == second["output"] and copy["parentResultId"] == second["id"]
    assert (
        saved["stateVersionId"] == copy["stateVersionId"] == initial["stateVersionId"]
    )
    assert saved["assumptionVersionId"] != copy["assumptionVersionId"]
    comparison = post(
        api,
        p + "/compare",
        {"resultIds": [saved["id"], second["id"], copy["id"]]},
        status=200,
    )
    assert len(comparison) == 3
    export = api["client"].get(p + f"/scenarios/{saved['id']}/export").json()
    assert export["output"] == saved["output"]
    assert api["client"].get(p + f"/scenarios/{saved['id']}/replay").json()["matches"]
    snapshot = api["client"].get(f"/api/operator/ariadne/workspaces/{w['id']}").json()
    assert not any(
        m.get("name") == "demand_contract_screening" for m in snapshot.get("models", [])
    )
    # Alpha can't mutate reserved assumptions or bypass the closed workflow.
    with api["factory"]() as db:
        av = db.get(
            AriadneAssumptionSetVersion, uuid.UUID(saved["assumptionVersionId"])
        )
        set_id = av.assumption_set_id
    alpha = f"/api/operator/ariadne/workspaces/{w['id']}"
    assert (
        api["client"]
        .post(
            alpha + f"/assumption-sets/{set_id}/versions",
            json={"values": {}, "origin": "human_defined", "value_schema": {}},
        )
        .status_code
        == 422
    )
    assert (
        api["client"].get(alpha + f"/results/{saved['id']}/lineage").status_code == 404
    )
    assert (
        api["client"].post(alpha + f"/results/{saved['id']}/replay").status_code == 404
    )


def test_save_committed_response_lost_retries_without_extra_run(api):
    _, _, p, _, _ = build(api)
    key = str(uuid.uuid4())
    with api["factory"]() as db:
        before = db.scalar(select(func.count()).select_from(AriadneModelRun))
    api["state"]["lose"] = True
    assert (
        api["client"]
        .post(p + "/scenarios", json=BODY, headers={"Idempotency-Key": key})
        .status_code
        == 500
    )
    saved = post(api, p + "/scenarios", BODY, key=key)
    assert post(api, p + "/scenarios", BODY, key=key)["id"] == saved["id"]
    with api["factory"]() as db:
        assert (
            db.scalar(select(func.count()).select_from(AriadneModelRun)) == before + 1
        )
    post(api, p + "/scenarios", {**BODY, "candidateKw": "260"}, key=key, status=409)


def test_duplicate_committed_response_lost_retries_same_branch(api):
    _, _, p, _, _ = build(api)
    saved = post(api, p + "/scenarios", BODY)
    key = str(uuid.uuid4())
    body = {"name": "Duplicate"}
    path = p + f"/scenarios/{saved['id']}/duplicate"
    api["state"]["lose"] = True
    assert (
        api["client"]
        .post(path, json=body, headers={"Idempotency-Key": key})
        .status_code
        == 500
    )
    copy = post(api, path, body, key=key)
    assert post(api, path, body, key=key)["id"] == copy["id"]


def test_correction_stale_baseline_old_replay_and_export_preserved(api):
    _, root, p, source, baseline = build(api)
    saved = post(api, p + "/scenarios", BODY)
    upload_confirm(
        api,
        root,
        demand_csv(demand_kw="270"),
        "revised.csv",
        "invoice",
        "demand_profile",
        source,
    )
    newer = calculate(api, root)
    assert api["client"].get(p).json()["newerBaselineExists"]
    post(api, p + "/scenarios", BODY, status=409)
    historical = post(
        api, p + "/scenarios", {**BODY, "acknowledgeHistoricalBaseline": True}
    )
    assert historical["output"] == saved["output"]
    assert (
        api["client"].get(p + f"/scenarios/{saved['id']}/export").json()["output"]
        == saved["output"]
    )
    assert api["client"].get(p + f"/scenarios/{saved['id']}/replay").json()["matches"]
    new_path = root + f"/calculations/{newer['id']}/planning"
    assert api["client"].get(new_path + f"/scenarios/{saved['id']}").status_code == 404
    assert (
        api["client"]
        .get(root + f"/calculations/{baseline['id']}/replay")
        .json()["matches"]
    )


def test_foreign_workspace_result_preview_export_and_expired_session(api):
    _, _, p, _, _ = build(api)
    saved = post(api, p + "/scenarios", BODY)
    api["state"]["user"] = api["other"]
    for path in (
        p,
        p + "/scenarios",
        p + f"/scenarios/{saved['id']}",
        p + f"/scenarios/{saved['id']}/export",
        p + f"/scenarios/{saved['id']}/replay",
    ):
        assert api["client"].get(path).status_code == 403
    api["state"]["user"] = api["user"]
    api["state"]["expired"] = True
    assert api["client"].get(p).status_code == 401


@pytest.mark.parametrize("contract", ["30.01", "99999.99"])
def test_curve_ticks_remain_valid_near_limits(api, contract):
    _, _, p, _, _ = build(api, contracted_kw=contract)
    preview = post(
        api,
        p + "/preview?curve=true",
        {"candidateKw": contract, "normalRegime": True, "tariffApplicability": True},
        status=200,
    )
    assert len(preview["curve"]) == 61


def test_wrong_review_receipt_binding_and_foreign_result(api):
    w, root, p, _, _ = build(api)
    key = uuid.uuid4()
    saved = post(api, p + "/scenarios", BODY, key=key)
    reviewroot = root.rsplit("/", 1)[0]
    other = post(
        api, reviewroot, {"scope": "OTHER", "period": "2019-06", "ruleVersion": "0.2.0"}
    )
    foreignpath = p.replace(root, reviewroot + "/" + other["id"])
    post(api, foreignpath + "/scenarios", BODY, key=key, status=409)
    assert (
        api["client"].get(foreignpath + f"/scenarios/{saved['id']}/export").status_code
        == 404
    )


def test_planning_gate_rejects_before_receiving_body(api, monkeypatch):
    import asyncio

    _, _, p, _, _ = build(api)
    monkeypatch.setenv("ARIADNE_PLAN_DEV", "0")
    messages = []
    receives = []

    async def receive():
        receives.append(1)
        return {"type": "http.request", "body": b"{}", "more_body": False}

    async def send(m):
        messages.append(m)

    asyncio.run(
        api["client"].app(
            {
                "type": "http",
                "asgi": {"version": "3.0"},
                "http_version": "1.1",
                "scheme": "http",
                "method": "POST",
                "path": p + "/preview",
                "raw_path": (p + "/preview").encode(),
                "query_string": b"",
                "headers": [(b"content-type", b"application/json")],
                "client": ("127.0.0.1", 1),
                "server": ("127.0.0.1", 80),
            },
            receive,
            send,
        )
    )
    assert not receives
    assert messages[0]["status"] == 404


@pytest.mark.skipif(not PUBLIC.exists(), reason="authentic corpus unavailable")
def test_authentic_file_actual_intake_api_path_without_manual_values(api):
    import json
    from pathlib import Path

    w = post(
        api,
        "/api/operator/ariadne/close/workspaces",
        {"label": "Authentic public verification", "synthetic": False},
    )
    root = f"/api/operator/ariadne/workspaces/{w['id']}/close/reviews"
    r = post(
        api, root, {"scope": "429967", "period": "2020-02", "ruleVersion": "0.2.0"}
    )
    root += "/" + r["id"]
    upload_confirm(
        api, root, PUBLIC.read_bytes(), "sobral.pdf", "invoice", "demand_profile"
    )
    upload_confirm(
        api,
        root,
        Path(
            r"C:\dev\ariadne-planning-public-evaluation-20261003\source-review\tariff-reference.csv"
        ).read_bytes(),
        "tariffs.csv",
        "context",
        "tariff_reference",
    )
    b = calculate(api, root)
    p = root + f"/calculations/{b['id']}/planning"
    result = post(api, p + "/scenarios", BODY)
    assert result["output"]["coverage"] == {
        "covered": 7,
        "physical": 9,
        "total": 12,
        "complete": False,
    }
    oracle = json.loads(
        (Path(__file__).parent / "oracle-auto-expected.json").read_text(
            encoding="utf-8"
        )
    )
    curve = post(
        api,
        p + "/preview?curve=true",
        {
            "candidateKw": "280",
            "normalRegime": True,
            "tariffApplicability": True,
        },
        status=200,
    )
    expected = oracle["explored_curve"]["points"]
    assert len(curve["curve"]) == len(expected) == 61
    for point, answer in zip(curve["curve"], expected):
        assert point["cost"] == answer["covered_7_months_subtotal_brl"]
        assert point["covered"] == 7
    assert curve["lowestExplored"]["cost"] == "30938.69"
    assert curve["lowestExplored"]["candidateKw"] == "288.000000"
