"""Argos Memory — first adapter: ONS Capacidade Instalada de Geração (NIV-12).

source_id: ``ons.capacidade_geracao``. Selected as P0 #1 because ONS
explicitly documents this as a current-state dataset with no historical
information of its own — the strongest case in the P0 set for why losing a
prior captured state would be irreversible (NIV-10 decision, recorded in
``Argos Memory — M0 P0 Source Set & Source Registry v0.1``).

This adapter's job is narrow and deliberately dumb: fetch the exact bytes
ONS is serving right now, and hand them to ``app.services.argos_memory`` for
hashing, dedup and version-chain linkage. It does not parse the CSV, does
not interpret capacity values, does not create Signals, and does not use an
LLM. Capture first — interpretation is out of scope for M1.

Run from repo root::

    DATABASE_URL=... py -3 -m app.scripts.ingest_argos_ons_capacidade_geracao

Environment:

- ``DATABASE_URL`` — PostgreSQL (required)
- ``ARGOS_ONS_CAPACIDADE_GERACAO_URL`` — optional override of the resource
  URL (defaults to the CSV resource resolved from the ONS CKAN package
  ``capacidade-geracao``, verified reachable at authoring time)
"""

from __future__ import annotations

import logging
import os
import sys
from datetime import datetime, timezone

import requests

from app.db.session import SessionLocal
from app.services.argos_memory import capture_snapshot

logging.basicConfig(level=logging.INFO, format="%(levelname)s %(message)s")
logger = logging.getLogger(__name__)

USER_AGENT = "GridAlpha/1.0 (+https://github.com/aquilesguerretta/gridalpha-v2)"

SOURCE_ID = "ons.capacidade_geracao"
ADAPTER_VERSION = "ons.capacidade_geracao@1"

# Canonical NIV-7/NIV-13 rights record for the ONS P0 datasets (External data /
# content licensing register). Its "Internal archival / immutable snapshots"
# use mode is CLEARED for ons.capacidade_geracao — that is the use this
# adapter performs. The source-level Source Registry summary stays
# ``restricted`` (bulk/API redistribution remains gated pending Legal); that
# is a separate, coarser field this snapshot-level state does not override.
RIGHTS_RECORD_REF = "NIV7-EXT-ONS-OPEN-DATA-2026-09-16"
RIGHTS_SUMMARY_STATE = "cleared"

DEFAULT_RESOURCE_URL = (
    "https://ons-aws-prod-opendata.s3.amazonaws.com/dataset/"
    "capacidade-geracao/CAPACIDADE_GERACAO.csv"
)
REQUEST_TIMEOUT_SECONDS = 60


def resource_url() -> str:
    return os.environ.get("ARGOS_ONS_CAPACIDADE_GERACAO_URL", "").strip() or DEFAULT_RESOURCE_URL


def fetch() -> tuple[bytes, dict[str, str | int | None]]:
    """Acquire the exact bytes ONS is serving right now.

    Returns the raw payload plus acquisition context (URL, HTTP status,
    hosting-layer headers). The hosting layer's ``Last-Modified``/``ETag``
    are recorded as acquisition metadata only — S3 object metadata is not a
    publisher-declared publication time and must never be written to
    ``published_at``.
    """
    url = resource_url()
    response = requests.get(
        url,
        headers={"User-Agent": USER_AGENT},
        timeout=REQUEST_TIMEOUT_SECONDS,
    )
    response.raise_for_status()
    metadata: dict[str, str | int | None] = {
        "url": url,
        "http_status": response.status_code,
        "response_content_type": response.headers.get("Content-Type"),
        "hosting_last_modified": response.headers.get("Last-Modified"),
        "hosting_etag": response.headers.get("ETag"),
    }
    return response.content, metadata


def run() -> None:
    data, metadata = fetch()
    retrieved_at = datetime.now(timezone.utc)

    session = SessionLocal()
    try:
        snapshot = capture_snapshot(
            session,
            source_id=SOURCE_ID,
            data=data,
            content_type="text/csv",
            adapter_version=ADAPTER_VERSION,
            retrieved_at=retrieved_at,
            # ONS does not establish a publication or reference time for this
            # current-state dataset — left explicitly unknown, not backfilled
            # from retrieved_at.
            published_at=None,
            reference_time_start=None,
            reference_time_end=None,
            source_timezone="America/Sao_Paulo",
            acquisition_metadata=metadata,
            rights_record_ref=RIGHTS_RECORD_REF,
            rights_summary_state=RIGHTS_SUMMARY_STATE,
        )
        session.commit()
        session.refresh(snapshot)
    except Exception:
        session.rollback()
        raise
    finally:
        session.close()

    logger.info(
        "argos snapshot captured: source_id=%s snapshot_id=%s relation=%s "
        "artifact_id=%s bytes=%d retrieved_at=%s",
        SOURCE_ID,
        snapshot.id,
        snapshot.revision_relation,
        snapshot.artifact_id,
        len(data),
        retrieved_at.isoformat(),
    )


def main() -> int:
    try:
        run()
    except Exception:
        logger.exception("argos ons.capacidade_geracao capture failed")
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
