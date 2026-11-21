"""Seed the three NIV-52 scenarios into a fresh disposable database.

This command never contacts ONS. It captures committed synthetic fixture bytes
as real Argos Memory snapshots, prints their UUID configuration, and leaves the
operator GET endpoint read-only.

Run after applying migrations to a disposable PostgreSQL database::

    py -3 -m app.scripts.seed_argos_signal_inspection
"""

from __future__ import annotations

import json
import sys
from datetime import datetime, timedelta, timezone
from pathlib import Path

from app.db.session import SessionLocal
from app.services.argos_memory import capture_snapshot
from app.services.argos_ons_capacidade_geracao_diff import SOURCE_ID
from app.services.argos_ons_capacidade_geracao_signal import RIGHTS_RECORD_REF
from app.services.argos_ons_capacidade_signal_inspection import SNAPSHOT_CONFIG_ENV


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


def run() -> dict[str, dict[str, str]]:
    session = SessionLocal()
    now = datetime.now(timezone.utc)
    result: dict[str, dict[str, str]] = {}
    try:
        offset = 0
        for scenario_id, paths in SCENARIO_FIXTURES.items():
            ids: list[str] = []
            for role, path in zip(("from", "to"), paths):
                snapshot = capture_snapshot(
                    session,
                    source_id=SOURCE_ID,
                    data=path.read_bytes(),
                    content_type="text/csv",
                    adapter_version="niv-52.synthetic-inspection@1",
                    retrieved_at=now + timedelta(minutes=offset),
                    acquisition_metadata={
                        "environment": "synthetic_disposable_demo",
                        "inspection_scenario": scenario_id,
                        "inspection_role": role,
                    },
                    rights_record_ref=RIGHTS_RECORD_REF,
                    rights_summary_state="cleared",
                )
                session.commit()
                session.refresh(snapshot)
                ids.append(str(snapshot.id))
                offset += 1
            result[scenario_id] = {"from": ids[0], "to": ids[1]}
    except Exception:
        session.rollback()
        raise
    finally:
        session.close()
    return result


def main() -> int:
    try:
        encoded = json.dumps(run(), separators=(",", ":"))
    except Exception as exc:
        print(f"seed failed: {exc}", file=sys.stderr)
        return 1
    print(encoded)
    print(f"PowerShell: $env:{SNAPSHOT_CONFIG_ENV}='{encoded}'")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
