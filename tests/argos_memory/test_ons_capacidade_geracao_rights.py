"""Rights-lineage test for the ``ons.capacidade_geracao`` adapter (NIV-38).

NIV-13 produced the canonical rights record for the ONS P0 datasets after the
adapter was first written; the adapter carried a stale placeholder
(``rights_record_ref=None``, ``rights_summary_state="unknown"``) since. This
confirms the adapter now carries the canonical NIV-7/NIV-13 record for the
one use it actually performs — internal archival, cleared per the External
data / content licensing register — and that ``capture_snapshot`` persists
that lineage exactly, not the old placeholder.
"""

from __future__ import annotations

import os
import uuid
from datetime import datetime, timezone

import pytest
from alembic import command
from alembic.config import Config
from sqlalchemy import create_engine
from sqlalchemy.exc import OperationalError
from sqlalchemy.orm import Session

from app.scripts.ingest_argos_ons_capacidade_geracao import (
    ADAPTER_VERSION,
    RIGHTS_RECORD_REF,
    RIGHTS_SUMMARY_STATE,
    SOURCE_ID,
)
from app.services.argos_memory import capture_snapshot


def _database_url() -> str | None:
    url = os.environ.get("DATABASE_URL", "").strip()
    return url or None


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
    reason="DATABASE_URL not set or Postgres unreachable — see test_capture_persistence.py",
)


@pytest.fixture()
def db_session():
    url = _URL
    assert url is not None

    config = Config("alembic.ini")
    config.set_main_option("sqlalchemy.url", url)
    command.upgrade(config, "head")

    engine = create_engine(url)
    session = Session(bind=engine)
    try:
        yield session
    finally:
        session.rollback()
        session.close()
        engine.dispose()
        command.downgrade(config, "base")


def test_adapter_constants_match_canonical_niv13_rights_record():
    assert SOURCE_ID == "ons.capacidade_geracao"
    assert RIGHTS_RECORD_REF == "NIV7-EXT-ONS-OPEN-DATA-2026-09-16"
    # Source Registry summary stays "restricted" — this is the narrower,
    # snapshot-level state for the one use this adapter performs (internal
    # archival), which the licensing register records as cleared for that use.
    assert RIGHTS_SUMMARY_STATE == "cleared"


def test_capture_persists_canonical_ons_rights_lineage_not_the_old_placeholder(db_session):
    source_id = f"test.rights.{uuid.uuid4().hex[:12]}"

    snapshot = capture_snapshot(
        db_session,
        source_id=source_id,
        data=b"capacidade;usina\n100;UTE Teste\n",
        content_type="text/csv",
        adapter_version=ADAPTER_VERSION,
        retrieved_at=datetime.now(timezone.utc),
        rights_record_ref=RIGHTS_RECORD_REF,
        rights_summary_state=RIGHTS_SUMMARY_STATE,
    )
    db_session.commit()

    assert snapshot.rights_record_ref == "NIV7-EXT-ONS-OPEN-DATA-2026-09-16"
    assert snapshot.rights_summary_state == "cleared"
    assert snapshot.rights_record_ref is not None  # not the stale NIV-12 placeholder
