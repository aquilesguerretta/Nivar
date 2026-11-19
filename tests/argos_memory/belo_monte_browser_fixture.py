"""Local browser fixture with real auth and isolated synthetic Argos snapshots."""

from __future__ import annotations

import json
import os
import secrets
from datetime import datetime, timedelta, timezone
from uuid import uuid4

import uvicorn
from sqlalchemy.engine import make_url


def main():
    url = make_url(os.environ["DATABASE_URL"])
    if (
        url.host != "127.0.0.1"
        or url.database != "niv66_test"
        or url.get_backend_name() != "postgresql"
        or url.query
        or "RAILWAY_ENVIRONMENT_NAME" in os.environ
    ):
        raise SystemExit("Use the disposable niv66_test database on loopback.")

    os.environ["ARGOS_BELO_MONTE_DEV"] = "1"
    os.environ["ADVISORY_OPERATOR_EMAIL"] = os.environ["NIV66_BROWSER_OPERATOR"]
    os.environ["SESSION_COOKIE_SECURE"] = "false"
    os.environ["JWT_SECRET"] = secrets.token_hex(32)
    # Import after setting the isolated auth configuration.
    from app.db.session import SessionLocal
    from app.main import app
    from app.services import argos_belo_monte as service
    from app.services.argos_memory import capture_snapshot
    from tests.argos_memory.test_belo_monte import TEST_SOURCE, csv_bytes, make_row

    real_snapshot = os.environ.get("NIV66_BROWSER_REAL_SNAPSHOT")
    if real_snapshot:
        ids = [real_snapshot]
    else:
        codes = (("TEST-NIV65-UG01", "01"), ("TEST-NIV65-UG02", "02"))
        service.SOURCE_ID = f"{TEST_SOURCE}.browser.{uuid4().hex}"
        service.DEFAULT_RESOURCE_URL = "test://niv66/browser"
        service.SITES = (service.Site("pimental", "Pimental (dados sintéticos)", "PIMENTAL", codes, ()),)

        # Clearly label this fixture even when viewed outside the test runner.
        @app.middleware("http")
        async def mark_test_only(request, call_next):
            response = await call_next(request)
            response.headers["X-NIV66-Browser-Fixture"] = "synthetic"
            return response

        ids = []
        base_row = make_row(codes[0][0], site="PIMENTAL")
        second_unit = make_row(codes[1][0], site="PIMENTAL", number="02")
        external = make_row("TEST-NIV66-EXTERNAL", ceg="TEST-OTHER-CEG")
        changed_external = dict(external, val_potenciaefetiva="101.00")
        versions = (
            (base_row, second_unit, external),
            (base_row, second_unit, changed_external),
            (
                dict(base_row, val_potenciaefetiva="99.50"),
                dict(second_unit, nom_usina="TEST CONFLICT"),
                changed_external,
            ),
        )
        retrieved = datetime.now(timezone.utc) - timedelta(minutes=1)
        for i, rows in enumerate(versions):
            with SessionLocal.begin() as db:
                snapshot = capture_snapshot(
                    db,
                    source_id=service.SOURCE_ID,
                    data=csv_bytes(*rows),
                    content_type="text/csv",
                    adapter_version=service.ADAPTER_VERSION,
                    retrieved_at=retrieved - timedelta(seconds=i),
                    acquisition_metadata={"url": service.DEFAULT_RESOURCE_URL},
                    rights_record_ref=service.RIGHTS_RECORD_REF,
                    rights_summary_state=service.RIGHTS_SUMMARY_STATE,
                )
                ids.append(str(snapshot.id))

    os.environ[service.SNAPSHOTS_ENV] = json.dumps(ids)
    with SessionLocal() as db:
        result = service.inspect_belo_monte(db)
        if not real_snapshot and len(result["availableVersions"]) != len(ids):
            raise SystemExit("Enable track_commit_timestamp on disposable PostgreSQL before seeding.")
    uvicorn.run(app, host="127.0.0.1", port=8617, lifespan="off")


if __name__ == "__main__":
    main()
