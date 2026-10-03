"""Targeted regressions: disposable PostgreSQL and instrumented ASGI receive."""

import asyncio
import uuid
import httpx
import pytest
from sqlalchemy import text
from sqlalchemy.exc import DBAPIError
from app.routers import ariadne_close
from app.services.auth_service import get_current_user
from app.db.session import get_db
from app.services import ariadne_core as core
from app.services import auth_service
from tests.ariadne_close import test_api as existing
from tests.ariadne_close.test_intake import xlsx_hidden_variant
from tests.ariadne_core.test_lineage_persistence import _build_versioned_fixture

api = existing.api
gates = existing.gates
pytestmark = existing.pytestmark


def streamed_post(api, path, body=b"not yet read", headers=None, before_receive=None):
    """Count application receive calls, not just whether parsing ran."""
    observation = {"reads": 0, "bytes": 0, "status": None, "messages": []}
    scope = {
        "type": "http",
        "asgi": {"version": "3.0"},
        "http_version": "1.1",
        "method": "POST",
        "scheme": "http",
        "path": path,
        "raw_path": path.encode(),
        "query_string": b"",
        "root_path": "",
        "headers": (
            [(key.lower(), value) for key, value in headers]
            if headers
            else [
                (b"content-type", b"multipart/form-data; boundary=synthetic"),
                (b"idempotency-key", str(uuid.uuid4()).encode()),
            ]
        ),
        "client": ("127.0.0.1", 12345),
        "server": ("testserver", 80),
    }

    async def run():
        async def receive():
            if before_receive:
                before_receive()
            observation["reads"] += 1
            observation["bytes"] += len(body)
            return {"type": "http.request", "body": body, "more_body": False}

        async def send(message):
            observation["messages"].append(message)
            if message["type"] == "http.response.start":
                observation["status"] = message["status"]

        await api["client"].app(scope, receive, send)

    asyncio.run(run())
    return observation


@pytest.mark.parametrize("body_kind", ["malformed", "oversized"])
@pytest.mark.parametrize(
    "denial",
    [
        "disabled",
        "production",
        "unauthenticated",
        "expired",
        "nonoperator",
        "foreign",
        "missing-review",
    ],
)
def test_rejection_precedes_any_body_receive(api, monkeypatch, denial, body_kind):
    workspace, root = existing.fresh(api)
    application = api["client"].app
    expected = {
        "disabled": 404,
        "production": 404,
        "unauthenticated": 401,
        "expired": 401,
        "nonoperator": 403,
        "foreign": 404,
        "missing-review": 404,
    }[denial]
    if denial == "disabled":
        monkeypatch.setenv("ARIADNE_CLOSE_DEV", "0")
    elif denial == "production":
        monkeypatch.setenv("APP_ENV", "production")
    elif denial == "expired":
        api["state"]["expired"] = True
    elif denial in ("nonoperator", "foreign"):
        api["state"]["user"] = api["other"]
        if denial == "foreign":
            monkeypatch.setenv("ADVISORY_OPERATOR_EMAIL", api["other"].email)
    elif denial == "missing-review":
        root = root.rsplit("/", 1)[0] + "/" + str(uuid.uuid4())
    original = application.dependency_overrides.get(get_current_user)
    if denial == "unauthenticated":
        # Exercise the real session dependency with no cookie/header, not a fake user.
        application.dependency_overrides.pop(get_current_user)

    def forbidden(*args, **kwargs):
        raise AssertionError("rejected request reached file processing")

    monkeypatch.setattr(ariadne_close, "parse_isolated", forbidden)
    try:
        body = (
            b"broken multipart"
            if body_kind == "malformed"
            else b"x" * (9 * 1024 * 1024)
        )
        result = streamed_post(api, root + "/sources", body)
        assert result["status"] == expected
        assert result["reads"] == 0 and result["bytes"] == 0
    finally:
        if original is not None:
            application.dependency_overrides[get_current_user] = original


def test_authorized_stream_preserves_processing_and_bound(api, monkeypatch):
    workspace, root = existing.fresh(api)
    request = httpx.Request(
        "POST",
        "http://testserver" + root + "/sources",
        data={"role": "invoice"},
        files={
            "file": (
                "invoice.csv",
                (existing.FIXTURES / "invoice.csv").read_bytes(),
                "text/csv",
            )
        },
        headers={"Idempotency-Key": str(uuid.uuid4())},
    )
    result = streamed_post(
        api, root + "/sources", request.read(), list(request.headers.raw)
    )
    assert result["status"] == 201 and result["reads"] > 0
    assert len(api["client"].get(root).json()["sources"]) == 1
    monkeypatch.setattr(
        ariadne_close,
        "parse_isolated",
        lambda *args: pytest.fail("oversize reached parser"),
    )
    oversized = streamed_post(api, root + "/sources", b"x" * (9 * 1024 * 1024))
    assert oversized["status"] == 413 and oversized["reads"] == 1


@pytest.mark.parametrize("expired", [False, True])
def test_real_cookie_session_and_preflight_resource_cleanup(api, monkeypatch, expired):
    _, root = existing.fresh(api)
    application = api["client"].app
    original_auth = application.dependency_overrides.pop(get_current_user)
    original_db = application.dependency_overrides[get_db]
    resources = {"active": 0, "opened": 0, "closed": 0}

    def tracked_db():
        with api["factory"]() as db:
            resources["active"] += 1
            resources["opened"] += 1
            try:
                yield db
            finally:
                resources["active"] -= 1
                resources["closed"] += 1

    def before_receive():
        # Database/auth resources must be released before a potentially slow body.
        assert resources == {"active": 0, "opened": 1, "closed": 1}

    application.dependency_overrides[get_db] = tracked_db
    monkeypatch.setattr(auth_service, "JWT_SECRET", "synthetic-test-session-only-" * 2)
    monkeypatch.setattr(auth_service, "SESSION_TTL_DAYS", -1 if expired else 30)
    token, _ = auth_service.issue_token(api["user"])
    request = httpx.Request(
        "POST",
        "http://testserver" + root + "/sources",
        data={"role": "invoice"},
        files={
            "file": (
                "invoice.csv",
                (existing.FIXTURES / "invoice.csv").read_bytes(),
                "text/csv",
            )
        },
        headers={
            "Idempotency-Key": str(uuid.uuid4()),
            "Cookie": f"{auth_service.SESSION_COOKIE_NAME}={token}",
        },
    )
    try:
        result = streamed_post(
            api,
            root + "/sources",
            request.read(),
            list(request.headers.raw),
            before_receive,
        )
        if expired:
            assert result["status"] == 401 and result["reads"] == 0
            assert resources == {"active": 0, "opened": 1, "closed": 1}
        else:
            assert result["status"] == 201 and result["reads"] > 0
            assert resources == {"active": 0, "opened": 2, "closed": 2}
            start = next(
                message
                for message in result["messages"]
                if message["type"] == "http.response.start"
            )
            assert any(
                key == b"set-cookie"
                and auth_service.SESSION_COOKIE_NAME.encode() in value
                for key, value in start["headers"]
            )
    finally:
        application.dependency_overrides[get_current_user] = original_auth
        application.dependency_overrides[get_db] = original_db


@pytest.mark.parametrize("target", ["row", "column"])
@pytest.mark.parametrize(
    "value,accepted",
    [
        ("1", False),
        ("true", False),
        ("0", True),
        ("false", True),
        (None, True),
        ("TRUE", False),
        ("2", False),
    ],
)
def test_xlsx_hidden_validation_actual_import(api, target, value, accepted):
    workspace, root = existing.fresh(api)
    data = xlsx_hidden_variant([["value", "blank"], ["250.125", None]], target, value)
    existing.upload(
        api, root, "context", data, "layout.xlsx", status=201 if accepted else 422
    )
    sources = api["client"].get(root).json()["sources"]
    assert len(sources) == int(accepted)
    if accepted:
        row = sources[0]["preview"]["tables"][0]["rows"][0]
        assert row["values"] == {"value": "250.125", "blank": None}
        assert row["cells"] == {"value": "Inputs!A2", "blank": "Inputs!B2"}


def test_update_guards_restrictive_fk_and_controlled_lifecycle(api):
    retained, retained_root, retained_sources, retained_result = existing.build(api)
    retained_package = existing.post(
        api, retained_root + f"/calculations/{retained_result['id']}/packages"
    )
    export_path = retained_root + f"/packages/{retained_package['id']}/export"
    retained_export = api["client"].get(export_path).content
    scalar_tenant = "retained-synthetic-scalar-" + str(uuid.uuid4())
    with api["factory"]() as db:
        fixture = _build_versioned_fixture(db, scalar_tenant)
        scalar_results = [fixture["run_v1"].result.id, fixture["run_v2"].result.id]

    workspace, root, sources, result = existing.build(api)
    item = result["output"]["items"][0]
    existing.post(
        api,
        root + f"/calculations/{result['id']}/treatments",
        {
            "itemId": item["id"],
            "status": "explained",
            "reason": "synthetic",
            "note": "retention test",
        },
    )
    existing.post(api, root + f"/calculations/{result['id']}/packages")
    revised = existing.upload(
        api,
        root,
        "invoice",
        (existing.FIXTURES / "invoice.csv").read_bytes().replace(b"26000", b"25000"),
        "revised.csv",
        supersedes=sources["invoice"],
    )
    existing.confirm(api, root, revised["id"])
    existing.calculate(api, root)
    tables = (
        "ariadne_close_review",
        "ariadne_close_source",
        "ariadne_close_receipt",
        "ariadne_close_treatment",
        "ariadne_close_package",
    )
    with api["factory"]() as db:
        for table in tables:
            key = "workspace_id" if table.endswith("receipt") else "id"
            with pytest.raises(DBAPIError) as error:
                db.execute(
                    text(
                        f"UPDATE {table} SET {key}={key} WHERE workspace_id=:workspace"
                    ),
                    {"workspace": workspace["id"]},
                )
            assert error.value.orig.pgcode == "P0001"
            db.rollback()
        # Parents remain protected by their live dependencies, not a DELETE guard.
        for statement, identity in (
            (
                "DELETE FROM ariadne_close_review WHERE workspace_id=:id",
                workspace["id"],
            ),
            ("DELETE FROM ariadne_close_source WHERE id=:id", sources["invoice"]),
            ("DELETE FROM ariadne_result WHERE id=:id", result["id"]),
            ("DELETE FROM ariadne_operator_workspace WHERE id=:id", workspace["id"]),
        ):
            with pytest.raises(DBAPIError) as error:
                db.execute(text(statement), {"id": identity})
            assert error.value.orig.pgcode == "23503"
            db.rollback()
        # Explicit disposable lifecycle action; no disabling triggers, TRUNCATE or cascade.
        for table in ("ariadne_close_package", "ariadne_close_treatment"):
            db.execute(
                text(f"DELETE FROM {table} WHERE workspace_id=:id"),
                {"id": workspace["id"]},
            )
        db.execute(
            text("DELETE FROM ariadne_close_source WHERE id=:id"), {"id": revised["id"]}
        )
        db.execute(
            text("DELETE FROM ariadne_close_source WHERE workspace_id=:id"),
            {"id": workspace["id"]},
        )
        for table in ("ariadne_close_receipt", "ariadne_close_review"):
            db.execute(
                text(f"DELETE FROM {table} WHERE workspace_id=:id"),
                {"id": workspace["id"]},
            )
        db.commit()
        for table in tables:
            assert (
                db.execute(
                    text(f"SELECT count(*) FROM {table} WHERE workspace_id=:id"),
                    {"id": workspace["id"]},
                ).scalar_one()
                == 0
            )
        # Removing original metadata is not an erasure claim: Core snapshots still exist.
        assert (
            db.execute(
                text(
                    "SELECT count(*) FROM ariadne_private_state_version WHERE tenant_id=:tenant"
                ),
                {"tenant": "ariadne-operator-workspace:" + workspace["id"]},
            ).scalar_one()
            > 0
        )
        assert [
            core.replay_result(
                db, tenant_id=scalar_tenant, result_id=identity
            ).replayed_payload
            for identity in scalar_results
        ] == [{"value": 20}, {"value": 24}]
    replay = (
        api["client"]
        .get(retained_root + f"/calculations/{retained_result['id']}/replay")
        .json()
    )
    assert replay["matches"] and replay["stored"] == retained_result["output"]
    assert api["client"].get(export_path).content == retained_export


def test_no_destructive_close_endpoint(api):
    workspace, root, sources, result = existing.build(api)
    assert (
        api["client"]
        .delete(root + f"/sources/{sources['invoice']}/original")
        .status_code
        == 405
    )
    close_paths = {
        path: methods
        for path, methods in api["client"].app.openapi()["paths"].items()
        if "/close/" in path or path.endswith("/close")
    }
    # Inspect effective runtime registration, including included-router wrappers.
    assert close_paths
    assert all(
        not ({"delete", "put", "patch"} & methods.keys())
        for methods in close_paths.values()
    )
    assert (
        api["client"].get(root + f"/sources/{sources['invoice']}/original").status_code
        == 200
    )
