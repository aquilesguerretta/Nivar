import json
import uuid
import zipfile
import io
from pathlib import Path
import pytest
from tests.ariadne_close.test_api import api, gates, post
from tests.ariadne_close.test_inspection import complex_book, PUBLIC
from tests.ariadne_close.test_hardening_api import streamed_post


def new_review(api):
    w = post(
        api,
        "/api/operator/ariadne/close/workspaces",
        {"label": "Public engineering review", "synthetic": False},
    )
    path = f"/api/operator/ariadne/workspaces/{w['id']}/close"
    r = post(
        api,
        path + "/reviews",
        {"scope": "9010675", "period": "2021-09", "ruleVersion": "0.2.0"},
    )
    return path, path + "/reviews/" + r["id"]


def upload(api, root, file, role, provenance=None, key=None):
    response = api["client"].post(
        root + "/sources",
        data={
            "role": role,
            "inspection": "true",
            **({"provenance": json.dumps(provenance)} if provenance else {}),
        },
        files={"file": (file.name, file.read_bytes(), "application/octet-stream")},
        headers={"Idempotency-Key": str(key or uuid.uuid4())},
    )
    assert response.status_code == 201, response.text
    return response.json()["id"]


def test_inspection_uses_owned_workspace_and_preserves_complex_regions(api):
    path, _ = new_review(api)
    result = api["client"].post(
        path + "/inspect",
        files={"file": ("ordinary.xlsx", complex_book(), "application/octet-stream")},
    )
    assert result.status_code == 200, result.text
    assert result.json()["tables"][0]["headerRow"] == 3
    api["state"]["user"] = api["other"]
    result = api["client"].post(
        path + "/inspect",
        files={"file": ("ordinary.xlsx", complex_book(), "application/octet-stream")},
    )
    assert result.status_code == 403  # nonoperator rejected before intake


@pytest.mark.parametrize(
    "denial,status",
    [("disabled", 404), ("production", 404), ("expired", 401), ("foreign", 404)],
)
def test_new_inspection_rejects_before_body(api, monkeypatch, denial, status):
    path, _ = new_review(api)
    if denial == "disabled":
        monkeypatch.setenv("ARIADNE_CLOSE_DEV", "0")
    if denial == "production":
        monkeypatch.setenv("APP_ENV", "production")
    if denial == "expired":
        api["state"]["expired"] = True
    if denial == "foreign":
        api["state"]["user"] = api["other"]
        monkeypatch.setenv("ADVISORY_OPERATOR_EMAIL", api["other"].email)
    observation = streamed_post(api, path + "/inspect", b"x" * 1024)
    assert observation["status"] == status
    assert observation["reads"] == 0


def test_new_import_lost_committed_response_recovers(api, tmp_path):
    _, root = new_review(api)
    file = tmp_path / "ordinary.xlsx"
    file.write_bytes(complex_book())
    key = uuid.uuid4()
    api["state"]["lose"] = True
    response = api["client"].post(
        root + "/sources",
        data={"role": "context", "inspection": "true"},
        files={"file": (file.name, file.read_bytes(), "application/octet-stream")},
        headers={"Idempotency-Key": str(key)},
    )
    assert response.status_code == 500
    source = upload(api, root, file, "context", key=key)
    assert api["client"].get(root).json()["sources"][0]["id"] == source
    assert len(api["client"].get(root).json()["sources"]) == 1


def test_requesting_v2_does_not_silently_reuse_v1_review(api):
    w = post(
        api,
        "/api/operator/ariadne/close/workspaces",
        {"label": "Retained Alpha", "synthetic": True},
    )
    path = f"/api/operator/ariadne/workspaces/{w['id']}/close/reviews"
    post(api, path, {"scope": "SAME", "period": "2021-09"})
    response = api["client"].post(
        path,
        json={"scope": "SAME", "period": "2021-09", "ruleVersion": "0.2.0"},
        headers={"Idempotency-Key": str(uuid.uuid4())},
    )
    assert response.status_code == 409


def test_inspection_import_into_retained_v1_rejects_before_processing(api, monkeypatch):
    w = post(
        api,
        "/api/operator/ariadne/close/workspaces",
        {"label": "Retained v1", "synthetic": True},
    )
    path = f"/api/operator/ariadne/workspaces/{w['id']}/close/reviews"
    r = post(api, path, {"scope": "old", "period": "2021-09"})

    def unexpected(*args, **kwargs):
        pytest.fail("inspection parser must not run for a retained v1 review")

    monkeypatch.setattr("app.routers.ariadne_close.parse_isolated", unexpected)
    response = api["client"].post(
        path + "/" + r["id"] + "/sources",
        data={"role": "invoice", "inspection": "true"},
        files={"file": ("invoice.pdf", b"%PDF", "application/pdf")},
        headers={"Idempotency-Key": str(uuid.uuid4())},
    )
    assert response.status_code == 409
    assert api["client"].get(path + "/" + r["id"]).json()["sources"] == []


@pytest.mark.skipif(
    not PUBLIC.exists(), reason="authentic public corpus acquired separately"
)
def test_public_review_exact_replay_export_and_context(api):
    path, root = new_review(api)
    pdf = PUBLIC / "aris-invoice-131111946-physical-page-190.pdf"
    inspected = api["client"].post(
        path + "/inspect",
        files={"file": (pdf.name, pdf.read_bytes(), "application/pdf")},
    )
    assert inspected.status_code == 200, inspected.text
    source = upload(api, root, pdf, "invoice")
    body = {
        "sheet": "",
        "mapping": {},
        "numericMode": "strict",
        "manualRows": [],
        "reviewMode": "observations",
    }
    candidates = (
        api["client"]
        .post(root + f"/sources/{source}/candidates", json=body)
        .json()["rows"]
    )
    assert len(candidates) == 7
    assert all(not r["errors"] for r in candidates)
    post(
        api,
        root + f"/sources/{source}/confirm",
        {**body, "selectedRows": list(range(1, 8))},
    )
    csv = PUBLIC / "aneel-enel-ce-b3-application-2021-09-original-rows.csv"
    provenance = json.loads(Path(str(csv) + ".provenance.json").read_text())
    context = upload(api, root, csv, "context", provenance)
    post(
        api,
        root + f"/sources/{context}/confirm",
        {**body, "reviewMode": "context", "selectedRows": []},
    )
    detail = api["client"].get(root).json()
    calculation = post(
        api,
        root + "/calculate",
        {
            "confirmationVersions": {
                s["id"]: s["confirmationVersionId"] for s in detail["sources"]
            }
        },
    )
    result = api["client"].get(root + "/calculations/" + calculation["id"]).json()
    assert result["output"]["coverage"]["internalChecks"] == 4
    assert result["output"]["coverage"]["independentlyCovered"] == 0
    assert result["output"]["items"][-1]["internal"]["expected"] == "91.43"
    assert result["output"]["items"][-1]["internal"]["difference"] == "0.00"
    assert all(
        i["independent"]["classification"] == "not_verifiable"
        for i in result["output"]["items"]
    )
    assert (
        api["client"]
        .get(root + "/calculations/" + calculation["id"] + "/replay")
        .json()["matches"]
    )
    package = post(api, root + "/calculations/" + calculation["id"] + "/packages")
    exported = api["client"].get(root + "/packages/" + package["id"] + "/export")
    manifest = json.loads(
        zipfile.ZipFile(io.BytesIO(exported.content)).read("manifest.json")
    )
    frozen = next(s for s in manifest["inputs"]["sources"] if s["id"] == context)
    assert frozen["preview"]["provenance"]["attributed"][
        "original_csv_rows_1_based_including_header"
    ] == [178262, 178264, 178265, 178266, 178270]
    assert manifest["output"] == result["output"]
