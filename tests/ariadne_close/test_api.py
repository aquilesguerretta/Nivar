"""Real HTTP + PostgreSQL lifecycle. Never run on a shared/production DB."""

import io
import json
import os
import uuid
import zipfile
from pathlib import Path
import pytest
from alembic import command
from alembic.config import Config
from fastapi import FastAPI, HTTPException
from fastapi.testclient import TestClient
from sqlalchemy import create_engine, select, func, text
from sqlalchemy.orm import Session, sessionmaker
from app.db.models.ariadne_close import CloseSource, CloseTreatment, ClosePackage
from app.db.models.ariadne_core import AriadneModelRun, AriadnePrivateStateVersion
from app.db.models.user import User
from app.db.session import get_db
from app.services.auth_service import get_current_user
from app.routers import ariadne_close, ariadne_operator
from tests.ariadne_close.test_intake import xlsx_bytes, pdf_bytes

URL = os.environ.get("DATABASE_URL", "")
pytestmark = pytest.mark.skipif(not URL, reason="disposable DATABASE_URL required")
FIXTURES = Path(__file__).parent / "fixtures"


@pytest.fixture(scope="module")
def api():
    assert (
        "ariadne_close_test" in URL
    ), "assisted close lifecycle requires the named disposable test DB"
    config = Config("alembic.ini")
    config.set_main_option("sqlalchemy.url", URL)
    command.upgrade(config, "head")
    database = create_engine(URL)
    state = {"lose": False, "expired": False}

    class LostResponseSession(Session):
        def commit(self):
            super().commit()
            if state["lose"]:
                state["lose"] = False
                raise ConnectionError("synthetic transport loss AFTER commit")

    factory = sessionmaker(
        bind=database, class_=LostResponseSession, expire_on_commit=False
    )
    with factory() as db:
        user = User(
            email=f"close-{uuid.uuid4()}@example.test",
            name="Synthetic Operator",
            password_hash="synthetic",
        )
        other = User(
            email=f"close-{uuid.uuid4()}@example.test",
            name="Foreign Operator",
            password_hash="synthetic",
        )
        db.add_all([user, other])
        db.commit()
    state["user"] = user
    application = FastAPI()
    application.include_router(ariadne_operator.router)
    application.include_router(ariadne_close.router)

    def db_override():
        with factory() as db:
            yield db

    def current():
        if state["expired"]:
            raise HTTPException(401, "expired")
        return state["user"]

    application.dependency_overrides[get_db] = db_override
    application.dependency_overrides[get_current_user] = current
    with TestClient(application, raise_server_exceptions=False) as client:
        yield {
            "client": client,
            "state": state,
            "user": user,
            "other": other,
            "factory": factory,
            "config": config,
        }
    database.dispose()
    command.downgrade(config, "base")


@pytest.fixture(autouse=True)
def gates(monkeypatch, api):
    monkeypatch.setenv("ARIADNE_CLOSE_DEV", "1")
    monkeypatch.setenv("ARIADNE_CLOSE_ENV", "test")
    monkeypatch.setenv("ADVISORY_OPERATOR_EMAIL", api["user"].email)
    api["state"].update(user=api["user"], lose=False, expired=False)


def post(api, path, body=None, *, key=None, status=201, **kwargs):
    response = api["client"].post(
        path, json=body, headers={"Idempotency-Key": str(key or uuid.uuid4())}, **kwargs
    )
    assert response.status_code == status, response.text
    return response.json()


def fresh(api):
    workspace = post(
        api,
        "/api/operator/ariadne/close/workspaces",
        {"label": "Synthetic engineering", "synthetic": True},
    )
    root = f"/api/operator/ariadne/workspaces/{workspace['id']}/close/reviews"
    review = post(api, root, {"scope": "SYNTHETIC-UNIT", "period": "2026-09"})
    return workspace, root + "/" + review["id"]


def upload(api, root, role, data, filename, *, key=None, supersedes=None, status=201):
    form = {"role": role}
    if supersedes:
        form["supersedesId"] = supersedes
    response = api["client"].post(
        root + "/sources",
        data=form,
        files={
            "file": (
                filename,
                data,
                {
                    "csv": "text/csv",
                    "xlsx": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                    "pdf": "application/pdf",
                }[filename.rsplit(".", 1)[-1]],
            )
        },
        headers={"Idempotency-Key": str(key or uuid.uuid4())},
    )
    assert response.status_code == status, response.text
    return response.json()


def confirm(
    api,
    root,
    source_id,
    *,
    selected=None,
    mode="strict",
    mapping=None,
    previous=None,
    key=None,
    status=201,
):
    detail = api["client"].get(root).json()
    source = next(s for s in detail["sources"] if s["id"] == source_id)
    table = source["preview"]["tables"][0]
    body = {
        "sheet": table["name"],
        "mapping": mapping or table["proposedMapping"],
        "numericMode": mode,
        "manualRows": [],
        "selectedRows": (
            selected if selected is not None else [r["index"] for r in table["rows"]]
        ),
        "previousConfirmationVersionId": previous,
    }
    return post(
        api, root + f"/sources/{source_id}/confirm", body, key=key, status=status
    )


def calculate(api, root, *, key=None, status=201):
    detail = api["client"].get(root).json()
    body = {
        "confirmationVersions": {
            s["id"]: s["confirmationVersionId"] for s in detail["sources"]
        }
    }
    return post(api, root + "/calculate", body, key=key, status=status)


def build(api):
    workspace, root = fresh(api)
    sources = {}
    for role in ("invoice", "quantity", "price"):
        data = (FIXTURES / f"{role}.csv").read_bytes()
        sources[role] = upload(api, root, role, data, role + ".csv")["id"]
        confirm(api, root, sources[role])
    run = calculate(api, root)
    result = api["client"].get(root + f"/calculations/{run['id']}").json()
    return workspace, root, sources, result


def test_complete_real_import_confirm_calculate_treat_package_replay(api):
    workspace, root, sources, result = build(api)
    items = result["output"]["items"]
    assert (
        items[0]["independent"]["expected"] == "25000.00"
        and items[0]["independent"]["difference"] == "1000.00"
    )
    assert items[1]["independent"]["classification"] == "reconciled"
    assert items[2]["independent"]["expected"] == "-500.00"
    assert items[3]["independent"]["expected"] is None
    assert items[4]["independent"]["expected"] == "0.00"
    assert items[5]["independent"]["expected"] is None
    assert all(
        i["independent"]["classification"] == "not_verifiable" for i in items[6:]
    )
    assert result["output"]["coverage"]["independentlyCovered"] == 4
    path = root + f"/calculations/{result['id']}"
    treatment = post(
        api,
        path + "/treatments",
        {
            "itemId": items[0]["id"],
            "status": "accepted",
            "reason": "Synthetic explanation",
            "note": "Operator acceptance does not change arithmetic.",
        },
    )
    assert treatment["status"] == "accepted"
    assert (
        api["client"]
        .get(path)
        .json()["output"]["items"][0]["independent"]["difference"]
        == "1000.00"
    )
    package = post(api, path + "/packages")
    raw = api["client"].get(root + f"/packages/{package['id']}/export")
    assert (
        raw.status_code == 200 and raw.headers["cache-control"] == "private, no-store"
    )
    with zipfile.ZipFile(io.BytesIO(raw.content)) as z:
        manifest = json.loads(z.read("manifest.json"))
        assert (
            manifest["id"] == result["id"]
            and manifest["treatments"][0]["status"] == "accepted"
        )
        assert b"25000.00" in z.read("report.txt") and b"'-500.00" in z.read(
            "items.csv"
        )
    assert api["client"].get(path + "/replay").json()["matches"] is True


@pytest.mark.parametrize(
    "write",
    [
        "workspace",
        "review",
        "import",
        "confirmation",
        "calculate",
        "treatment",
        "package",
    ],
)
def test_committed_response_lost_is_retry_safe(api, write):
    workspace, root, sources, result = build(api)
    key = uuid.uuid4()
    client = api["client"]
    if write == "workspace":
        path = "/api/operator/ariadne/close/workspaces"
        body = {"label": "Lost workspace", "synthetic": True}
    elif write == "review":
        path = root.rsplit("/", 1)[0]
        body = {"scope": "SYNTHETIC-UNIT", "period": "2026-10"}
    elif write == "confirmation":
        source = client.get(root).json()["sources"][0]
        table = source["preview"]["tables"][0]
        path = root + f"/sources/{source['id']}/confirm"
        body = {
            "sheet": table["name"],
            "mapping": table["proposedMapping"],
            "numericMode": "strict",
            "manualRows": [],
            "selectedRows": [r["index"] for r in table["rows"]],
            "previousConfirmationVersionId": source["confirmationVersionId"],
        }
    elif write == "calculate":
        path = root + "/calculate"
        body = {
            "confirmationVersions": {
                s["id"]: s["confirmationVersionId"]
                for s in client.get(root).json()["sources"]
            }
        }
    elif write == "treatment":
        path = root + f"/calculations/{result['id']}/treatments"
        body = {
            "itemId": result["output"]["items"][0]["id"],
            "status": "explained",
            "reason": "response loss",
            "note": "synthetic",
        }
    elif write == "package":
        path = root + f"/calculations/{result['id']}/packages"
        body = None
    else:
        path = root + "/sources"
        body = None

    def send():
        if write == "import":
            return client.post(
                path,
                data={"role": "context"},
                files={"file": ("context.pdf", pdf_bytes(), "application/pdf")},
                headers={"Idempotency-Key": str(key)},
            )
        return client.post(path, json=body, headers={"Idempotency-Key": str(key)})

    api["state"]["lose"] = True
    assert send().status_code == 500
    api["state"]["expired"] = True
    assert send().status_code == 401
    api["state"]["expired"] = False
    response = send()
    assert response.status_code == 201, response.text
    assert send().json() == response.json()
    with api["factory"]() as db:
        assert (
            db.execute(
                text(
                    "SELECT count(*) FROM ariadne_close_receipt WHERE request_key=:key"
                ),
                {"key": str(key)},
            ).scalar_one()
            == 1
        )


def test_key_payload_conflict_and_stale_confirmation(api):
    workspace, root = fresh(api)
    key = uuid.uuid4()
    source = upload(
        api, root, "invoice", (FIXTURES / "invoice.csv").read_bytes(), "invoice.csv"
    )
    confirmed = confirm(api, root, source["id"], key=key)
    confirm(api, root, source["id"], key=key, selected=[], status=409)
    confirm(api, root, source["id"], status=409)
    assert confirmed["version"] == 1


def test_duplicate_file_and_conflicting_versions(api):
    workspace, root, sources, result = build(api)
    duplicate = upload(
        api, root, "invoice", (FIXTURES / "invoice.csv").read_bytes(), "same.csv"
    )
    assert duplicate == {"id": sources["invoice"], "duplicate": True}
    old = {
        s["id"]: s["confirmationVersionId"]
        for s in api["client"].get(root).json()["sources"]
    }
    confirm(api, root, sources["invoice"], previous=old[sources["invoice"]])
    post(api, root + "/calculate", {"confirmationVersions": old}, status=409)


def test_correction_preserves_old_result_and_export(api):
    workspace, root, sources, result = build(api)
    client = api["client"]
    original_path = root + f"/calculations/{result['id']}"
    package = post(api, original_path + "/packages")
    export_path = root + f"/packages/{package['id']}/export"
    before = client.get(export_path).content
    corrected = (
        (FIXTURES / "invoice.csv")
        .read_bytes()
        .replace(b",26000,100000,", b",25000,100000,")
    )
    source = upload(
        api, root, "invoice", corrected, "corrected.csv", supersedes=sources["invoice"]
    )
    confirm(api, root, source["id"])
    new = calculate(api, root)
    assert (
        client.get(root + f"/calculations/{new['id']}").json()["output"]["items"][0][
            "independent"
        ]["difference"]
        == "0.00"
    )
    assert client.get(original_path).json()["output"] == result["output"]
    assert client.get(original_path + "/replay").json()["matches"] is True
    assert client.get(export_path).content == before
    post(
        api,
        original_path + "/treatments",
        {
            "itemId": result["output"]["items"][0]["id"],
            "status": "explained",
            "reason": "later",
            "note": "Not included in earlier package",
        },
    )
    assert client.get(export_path).content == before


def test_foreign_workspace_all_private_routes(api, monkeypatch):
    workspace, root, sources, result = build(api)
    package = post(api, root + f"/calculations/{result['id']}/packages")
    api["state"]["user"] = api["other"]
    monkeypatch.setenv("ADVISORY_OPERATOR_EMAIL", api["other"].email)
    for suffix in (
        "",
        f"/sources/{sources['invoice']}/original",
        f"/calculations/{result['id']}",
        f"/calculations/{result['id']}/replay",
        f"/packages/{package['id']}/export",
    ):
        assert api["client"].get(root + suffix).status_code == 404
    for suffix in (
        f"/calculations/{result['id']}/packages",
        f"/sources/{sources['invoice']}/candidates",
        f"/sources/{sources['invoice']}/confirm",
    ):
        body = (
            {
                "sheet": "CSV",
                "mapping": {},
                "numericMode": "strict",
                "manualRows": [],
                "selectedRows": [],
            }
            if suffix.endswith("confirm")
            else (
                {"sheet": "CSV", "mapping": {}}
                if suffix.endswith("candidates")
                else None
            )
        )
        assert (
            api["client"]
            .post(
                root + suffix, json=body, headers={"Idempotency-Key": str(uuid.uuid4())}
            )
            .status_code
            == 404
        )
    # Same authorized owner with another workspace also cannot dereference known IDs.
    api["state"]["user"] = api["user"]
    monkeypatch.setenv("ADVISORY_OPERATOR_EMAIL", api["user"].email)
    other_workspace, other_root = fresh(api)
    assert (
        api["client"]
        .get(other_root + f"/sources/{sources['invoice']}/original")
        .status_code
        == 404
    )
    assert (
        api["client"].get(other_root + f"/calculations/{result['id']}").status_code
        == 404
    )
    assert (
        api["client"].get(other_root + f"/packages/{package['id']}/export").status_code
        == 404
    )


def test_expired_session_and_gate(api, monkeypatch):
    workspace, root = fresh(api)
    api["state"]["expired"] = True
    assert api["client"].get(root).status_code == 401
    api["state"]["expired"] = False
    monkeypatch.setenv("ARIADNE_CLOSE_DEV", "0")
    assert api["client"].get(root).status_code == 404
    monkeypatch.setenv("ARIADNE_CLOSE_DEV", "1")
    monkeypatch.setenv("APP_ENV", "production")
    assert api["client"].get(root).status_code == 404


def test_invalid_preview_no_confirmation_blank_and_ambiguous(api):
    workspace, root = fresh(api)
    data = b"item_key,component,scope,period,currency,tax_basis,amount\na,energy,WRONG,2026-13,BRL,exclusive,\nb,energy,SYNTHETIC-UNIT,2026-09,BRL,exclusive,\nc,energy,SYNTHETIC-UNIT,2026-09,BRL,exclusive,1.000\n"
    source = upload(api, root, "invoice", data, "ambiguous.csv")
    detail = api["client"].get(root).json()
    table = detail["sources"][0]["preview"]["tables"][0]
    mapped = post(
        api,
        root + f"/sources/{source['id']}/candidates",
        {"sheet": "CSV", "mapping": table["proposedMapping"]},
        status=200,
    )
    assert (
        mapped["rows"][0]["errors"]
        and mapped["rows"][1]["amount"] is None
        and mapped["rows"][2]["errors"]
    )
    confirm(api, root, source["id"], status=422)
    confirm(api, root, source["id"], selected=[2])
    saved = calculate(api, root)
    assert all(
        i["independent"]["expected"] is None
        for i in api["client"]
        .get(root + f"/calculations/{saved['id']}")
        .json()["output"]["items"]
    )


def test_xlsx_numeric_and_pdf_manual_reconfirmation(api):
    workspace, root = fresh(api)
    source = upload(
        api,
        root,
        "price",
        xlsx_bytes(
            [
                [
                    "item_key",
                    "component",
                    "scope",
                    "period",
                    "currency",
                    "tax_basis",
                    "price",
                    "price_unit",
                ],
                [
                    "manual",
                    "energy",
                    "SYNTHETIC-UNIT",
                    "2026-09",
                    "BRL",
                    "exclusive",
                    250.125,
                    "BRL/MWh",
                ],
            ]
        ),
        "price.xlsx",
    )
    confirmed = confirm(api, root, source["id"], mode="comma")
    assert confirmed["confirmedRows"] == 1
    pdf = upload(api, root, "invoice", pdf_bytes(), "manual.pdf")
    manual = {
        "page": 1,
        "item_key": "manual",
        "component": "energy",
        "scope": "SYNTHETIC-UNIT",
        "period": "2026-09",
        "currency": "BRL",
        "tax_basis": "exclusive",
        "amount": "25012.50",
    }
    body = {
        "sheet": "PDF",
        "mapping": {},
        "numericMode": "dot",
        "manualRows": [manual],
        "selectedRows": [1],
        "previousConfirmationVersionId": None,
    }
    first = post(api, root + f"/sources/{pdf['id']}/confirm", body)
    detail = api["client"].get(root).json()
    stored = next(s for s in detail["sources"] if s["id"] == pdf["id"])
    assert stored["confirmation"]["manualRows"] == [manual]
    body["previousConfirmationVersionId"] = first["id"]
    second = post(api, root + f"/sources/{pdf['id']}/confirm", body)
    assert second["version"] == 2


@pytest.mark.parametrize(
    "data,name",
    [
        (b"not pdf", "bad.pdf"),
        (xlsx_bytes([["a"], ["=1+1"]]), "active.xlsx"),
        (b"x" * (8 * 1024 * 1024 + 1), "large.csv"),
    ],
    ids=["signature", "formula", "oversized"],
)
def test_failed_or_interrupted_import_leaves_no_partial_rows(api, data, name):
    workspace, root = fresh(api)
    expected = 413 if name == "large.csv" else 422
    upload(api, root, "invoice", data, name, status=expected)
    assert api["client"].get(root).json()["sources"] == []


def test_append_only_metadata_enforced_database(api):
    workspace, root, sources, result = build(api)
    with api["factory"]() as db:
        from sqlalchemy.exc import DBAPIError

        with pytest.raises(DBAPIError):
            db.execute(
                text("UPDATE ariadne_close_source SET role='context' WHERE id=:id"),
                {"id": sources["invoice"]},
            )
        db.rollback()


def test_alpha_cannot_overwrite_workflow_confirmation(api):
    workspace, root, sources, result = build(api)
    from app.db.models.ariadne_close import CloseSource

    with api["factory"]() as db:
        source = db.get(CloseSource, uuid.UUID(sources["invoice"]))
        object_id = source.object_id
        evidence_id = source.evidence_id
    legacy = f"/api/operator/ariadne/workspaces/{workspace['id']}"
    assert not api["client"].get(legacy).json()["objects"]
    assert not api["client"].get(legacy).json()["evidenceRefs"]
    post(
        api,
        legacy + f"/objects/{object_id}/states",
        {"payload": {"value": 10}, "evidenceRefIds": [str(evidence_id)]},
        status=422,
    )
    assert (
        api["client"]
        .get(root + f"/calculations/{result['id']}/replay")
        .json()["matches"]
        is True
    )


def test_alpha_can_reuse_workflow_evidence_without_exposing_other_row_refs(api):
    workspace, root, sources, result = build(api)
    with api["factory"]() as db:
        evidence_id = db.get(CloseSource, uuid.UUID(sources["invoice"])).evidence_id
    legacy = f"/api/operator/ariadne/workspaces/{workspace['id']}"
    obj = post(api, legacy + "/objects", {"objectType": "synthetic-alpha"})
    post(
        api,
        legacy + f"/objects/{obj['id']}/states",
        {"payload": {"value": 10}, "evidenceRefIds": [str(evidence_id)]},
    )
    snapshot = api["client"].get(legacy).json()
    assert [r["id"] for r in snapshot["evidenceRefs"]] == [str(evidence_id)]


def test_unselected_sheets_and_duplicate_correction_are_explicit(api):
    workspace, root = fresh(api)
    csv_data = (FIXTURES / "invoice.csv").read_bytes()
    import csv

    rows = list(csv.reader(io.StringIO(csv_data.decode())))
    source = upload(
        api, root, "invoice", xlsx_bytes(rows, extra_sheet=True), "multi.xlsx"
    )
    confirm(api, root, source["id"])
    result = calculate(api, root)
    coverage = (
        api["client"]
        .get(root + f"/calculations/{result['id']}")
        .json()["output"]["coverage"]
    )
    assert coverage["unselectedSheets"] == [
        {"sourceId": source["id"], "sheet": "Other", "rows": 1}
    ]
    other = upload(api, root, "invoice", csv_data, "invoice.csv")
    upload(
        api, root, "invoice", csv_data, "same.csv", supersedes=source["id"], status=409
    )


def test_total_multipart_size_bounded_before_spooling(api):
    workspace, root = fresh(api)
    client = api["client"]
    response = client.post(
        root + "/sources",
        content=b"x" * (9 * 1024 * 1024),
        headers={
            "Content-Type": "multipart/form-data; boundary=synthetic",
            "Idempotency-Key": str(uuid.uuid4()),
        },
    )
    assert response.status_code == 413
    assert client.get(root).json()["sources"] == []


def test_connection_interrupted_during_upload_no_partial_commit(api):
    workspace, root = fresh(api)

    def interrupted():
        yield b'--synthetic\r\nContent-Disposition: form-data; name="file"; filename="source.csv"\r\nContent-Type: text/csv\r\n\r\na,b\n'
        raise ConnectionError("synthetic upload interruption")

    response = api["client"].post(
        root + "/sources",
        content=interrupted(),
        headers={
            "Content-Type": "multipart/form-data; boundary=synthetic",
            "Idempotency-Key": str(uuid.uuid4()),
        },
    )
    assert response.status_code >= 400
    assert api["client"].get(root).json()["sources"] == []


def test_concurrent_same_key_calculation_commits_once(api):
    from concurrent.futures import ThreadPoolExecutor

    workspace, root, sources, result = build(api)
    detail = api["client"].get(root).json()
    key = uuid.uuid4()
    body = {
        "confirmationVersions": {
            s["id"]: s["confirmationVersionId"] for s in detail["sources"]
        }
    }

    def send(_):
        return api["client"].post(
            root + "/calculate", json=body, headers={"Idempotency-Key": str(key)}
        )

    with ThreadPoolExecutor(max_workers=3) as pool:
        responses = list(pool.map(send, range(3)))
    assert all(r.status_code == 201 for r in responses)
    assert len({r.json()["id"] for r in responses}) == 1
    assert len(api["client"].get(root).json()["calculations"]) == 2


def test_negative_numeric_xlsx_price_stays_invalid(api):
    workspace, root = fresh(api)
    source = upload(
        api,
        root,
        "price",
        xlsx_bytes(
            [
                [
                    "item_key",
                    "component",
                    "scope",
                    "period",
                    "currency",
                    "tax_basis",
                    "price",
                    "price_unit",
                ],
                [
                    "negative",
                    "energy",
                    "SYNTHETIC-UNIT",
                    "2026-09",
                    "BRL",
                    "exclusive",
                    -250.125,
                    "BRL/MWh",
                ],
            ]
        ),
        "negative.xlsx",
    )
    table = api["client"].get(root).json()["sources"][0]["preview"]["tables"][0]
    body = {
        "sheet": table["name"],
        "mapping": table["proposedMapping"],
        "numericMode": "comma",
        "manualRows": [],
    }
    row = post(api, root + f"/sources/{source['id']}/candidates", body, status=200)[
        "rows"
    ][0]
    assert row["price"] == "-250.125" and row["validation"] == "invalid"
    assert any("preço negativo" in error for error in row["errors"])
    confirm(api, root, source["id"], mode="comma", status=422)


@pytest.mark.parametrize("value", [250.5, {"nested": "value"}, "x" * 2001])
def test_pdf_manual_values_require_bounded_exact_strings(api, value):
    workspace, root = fresh(api)
    source = upload(api, root, "invoice", pdf_bytes(), "manual.pdf")
    body = {
        "sheet": "PDF",
        "mapping": {},
        "numericMode": "dot",
        "manualRows": [{"page": 1, "amount": value}],
    }
    post(api, root + f"/sources/{source['id']}/candidates", body, status=422)


def test_alpha_literal_namespace_does_not_hide_unrelated_object_type(api):
    workspace, root = fresh(api)
    legacy = f"/api/operator/ariadne/workspaces/{workspace['id']}"
    created = post(
        api,
        legacy + "/objects",
        {"objectType": "assistedXcloseYcustom", "displayLabel": "Unrelated Alpha type"},
    )
    assert api["client"].get(legacy).json()["objects"][0]["id"] == created["id"]


def test_summary_and_alpha_do_not_load_hidden_historical_payloads(api):
    from sqlalchemy import event
    from app.db.models.ariadne_core import AriadneResult, AriadnePrivateStateVersion

    workspace, root, sources, result = build(api)
    post(api, root + f"/calculations/{result['id']}/packages")
    loaded = []

    def capture(instance, context):
        loaded.append(type(instance).__name__)

    classes = (AriadneResult, ClosePackage, AriadnePrivateStateVersion)
    for model in classes:
        event.listen(model, "load", capture)
    try:
        summary = api["client"].get(root).json()
        assert len(summary["calculations"]) == 1 and len(summary["packages"]) == 1
        assert "AriadneResult" not in loaded and "ClosePackage" not in loaded
        loaded.clear()
        alpha = (
            api["client"]
            .get(f"/api/operator/ariadne/workspaces/{workspace['id']}")
            .json()
        )
        assert alpha["objects"] == [] and alpha["results"] == []
        assert not loaded
    finally:
        for model in classes:
            event.remove(model, "load", capture)


def test_unsupported_currency_export_preserves_raw_without_false_brl(api):
    workspace, root = fresh(api)
    source = upload(
        api,
        root,
        "invoice",
        b"item_key,component,scope,period,currency,tax_basis,amount\nforeign,energy,SYNTHETIC-UNIT,2026-09,USD,exclusive,100\n",
        "foreign.csv",
    )
    confirm(api, root, source["id"], selected=[])
    calculation = calculate(api, root)
    package = post(api, root + f"/calculations/{calculation['id']}/packages")
    response = api["client"].get(root + f"/packages/{package['id']}/export")
    with zipfile.ZipFile(io.BytesIO(response.content)) as archive:
        manifest = json.loads(archive.read("manifest.json"))
        item = manifest["output"]["items"][0]
        assert (
            item["billed"] is None
            and item["candidate"]["amount"] == "100"
            and item["currency"] == "USD"
        )
        report = archive.read("report.txt").decode()
        assert "100 USD" in report and "Faturado: 100.00 BRL" not in report
