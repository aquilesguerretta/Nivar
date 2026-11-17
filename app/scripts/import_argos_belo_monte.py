"""Archive the independently verified Founder-local NIV-66 capture.

Run against a disposable loopback Postgres database from the repository root:
    py -m app.scripts.import_argos_belo_monte <path-to-original-csv>
"""

from __future__ import annotations

import argparse
import os
from pathlib import Path

from sqlalchemy import select, text
from sqlalchemy.engine import make_url

from app.db.models.argos_memory import ArgosRawArtifact, ArgosSnapshot
from app.db.session import SessionLocal
from app.scripts.ingest_argos_ons_capacidade_geracao import DEFAULT_RESOURCE_URL, persist_capture
from app.services.argos_belo_monte import REVIEWED_CAPTURE_AT, REVIEWED_CAPTURE_SHA256, read_version
from app.services.argos_memory import compute_sha256
from app.services.argos_ons_capacidade_geracao_diff import SOURCE_ID, parse_capacidade_geracao


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("csv", type=Path)
    args = parser.parse_args()

    db_url = make_url(os.environ.get("DATABASE_URL", ""))
    if (
        db_url.host != "127.0.0.1" or db_url.get_backend_name() != "postgresql"
        or db_url.query or db_url.database not in {"niv66_demo", "niv66_test"}
        or "RAILWAY_ENVIRONMENT_NAME" in os.environ
        or os.environ.get("ENVIRONMENT", "").lower() == "production"
        or os.environ.get("APP_ENV", "").lower() == "production"
    ):
        parser.error("Use a dedicated local niv66_demo or niv66_test database")

    data = args.csv.read_bytes()
    if compute_sha256(data) != REVIEWED_CAPTURE_SHA256:
        parser.error("The SHA-256 differs from the verified Founder-local capture")
    parse_capacidade_geracao(data)

    with SessionLocal.begin() as db:
        # Serialize repeated imports of this one acquisition.
        db.execute(text("SELECT pg_advisory_xact_lock(hashtext('niv-66-local-import')::bigint)"))
        snapshot = db.scalars(
            select(ArgosSnapshot)
            .join(ArgosRawArtifact, ArgosSnapshot.artifact_id == ArgosRawArtifact.id)
            .where(
                ArgosSnapshot.source_id == SOURCE_ID,
                ArgosSnapshot.retrieved_at == REVIEWED_CAPTURE_AT,
                ArgosRawArtifact.sha256 == REVIEWED_CAPTURE_SHA256,
            )
            .order_by(ArgosSnapshot.created_at)
            .limit(1)
        ).first()
        if snapshot is None:
            snapshot = persist_capture(
                db,
                data,
                {
                    "url": DEFAULT_RESOURCE_URL,
                    "method": "verified_founder_local_import",
                    "capture_time_reported_utc": "2026-11-17T17:40:18.1382312Z",
                },
                REVIEWED_CAPTURE_AT,
            )
        read_version(db, snapshot)
        snapshot_id = snapshot.id

    print(snapshot_id)


if __name__ == "__main__":
    main()
