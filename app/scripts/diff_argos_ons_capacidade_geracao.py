"""Argos Memory — reviewer CLI: deterministic diff between two stored
ons.capacidade_geracao snapshots (NIV-39).

Compares two snapshot IDs already captured by
``app.scripts.ingest_argos_ons_capacidade_geracao`` (M1). Reads both from
NIVAR's own Postgres via ``reconstruct_snapshot`` — this script **never**
contacts ONS. See ``app.services.argos_ons_capacidade_geracao_diff`` for the
parser/diff implementation, its row-identity choice and its normalization
rules.

Run from repo root::

    DATABASE_URL=... py -3 -m app.scripts.diff_argos_ons_capacidade_geracao \\
        --from <snapshot-id> --to <snapshot-id>

Prints a deterministic JSON report to stdout and exits 0. On any failure
(snapshot not found, source_id not accepted, source_id mismatch, schema
drift, duplicate identity) prints a JSON error object to stderr and exits
nonzero — it never silently substitutes a different snapshot (e.g. the
current head) for the one the caller asked for.

Accepted source IDs
--------------------
This is a source-specific reviewer for ``ons.capacidade_geracao`` — it does
not validate a source_id by inferring "this looks like the right CSV shape"
from the parsed payload. Only two source_id forms are accepted, both
checked as an exact/prefix string match before any parsing happens:

* the canonical publisher source, ``SOURCE_ID`` (``ons.capacidade_geracao``);
* the explicit NIV-39 controlled-test namespace,
  ``CONTROLLED_TEST_SOURCE_NAMESPACE``
  (``test.argos_memory.ons_capacidade_geracao.controlled_revision``) and its
  per-test suffixed variants (``<namespace>.<suffix>``).

Any other source_id is rejected outright, even if both snapshots agree with
each other and even if their bytes happen to parse cleanly under the
18-column schema — agreement between two arbitrary unrelated sources is not
evidence that either one is actually ``ons.capacidade_geracao`` data.
"""

from __future__ import annotations

import argparse
import hashlib
import json
import sys
import uuid

from sqlalchemy.orm import Session

from app.db.session import SessionLocal
from app.db.models.argos_memory import ArgosSnapshot
from app.services.argos_memory import reconstruct_snapshot
from app.services.argos_ons_capacidade_geracao_diff import (
    CONTROLLED_TEST_SOURCE_NAMESPACE,
    DIFF_VERSION,
    PARSER_VERSION,
    SOURCE_ID,
    diff_capacidade_geracao,
    parse_capacidade_geracao,
)

LIMITATIONS: tuple[str, ...] = (
    "Row identity is cod_equipamento, validated unique across the full live "
    "ONS payload as of 2026-09-16 (NIV-39 Phase 0) — it is not a documented "
    "ONS primary key, only an empirically defensible one.",
    "Field values are compared after stripping leading/trailing whitespace "
    "only (fixed-width upstream export padding); no other normalization "
    "(units, rounding, blanks, labels) is applied.",
    "This report makes no causal claim. A reported content change is not a "
    "claim that ONS corrected, revised, or published anything — only that "
    "the two captured payloads differ under this deterministic comparison.",
)


class DiffCliError(ValueError):
    """A caller-facing failure: bad snapshot id, mismatched source, bad schema."""


def _is_accepted_source_id(source_id: str) -> bool:
    """True only for the canonical publisher source or the NIV-39 test namespace.

    Deliberately a string allowlist, not an inference from parsed content —
    two snapshots under some unrelated source_id must never pass through
    this reviewer merely because their bytes happen to fit the
    ons.capacidade_geracao CSV shape.
    """
    if source_id == SOURCE_ID:
        return True
    return source_id == CONTROLLED_TEST_SOURCE_NAMESPACE or source_id.startswith(
        CONTROLLED_TEST_SOURCE_NAMESPACE + "."
    )


def _load_snapshot(
    session: Session, snapshot_id: uuid.UUID, *, label: str
) -> tuple[ArgosSnapshot, bytes]:
    try:
        snapshot, raw_bytes = reconstruct_snapshot(session, snapshot_id)
    except LookupError as exc:
        raise DiffCliError(f"{label} snapshot {snapshot_id} not found: {exc}") from exc
    return snapshot, raw_bytes


def build_diff_report(session: Session, from_id: uuid.UUID, to_id: uuid.UUID) -> dict:
    """Compose the full deterministic diff report for two exact snapshot IDs.

    Binds to the caller-supplied ``from_id``/``to_id`` exactly — never the
    current lineage head, never the latest ``retrieved_at``, never the
    newest ``created_at``. Both snapshots must share the same ``source_id``
    as each other, AND that shared source_id must be one this reviewer
    actually accepts (see module docstring / ``_is_accepted_source_id``) —
    the real ``ons.capacidade_geracao`` id or the NIV-39 controlled-test
    namespace. "Same source_id as each other" alone is not sufficient: two
    snapshots under some unrelated-but-matching source_id must not pass
    through just because their bytes happen to fit the 18-column schema.
    """
    from_snapshot, from_bytes = _load_snapshot(session, from_id, label="--from")
    to_snapshot, to_bytes = _load_snapshot(session, to_id, label="--to")

    if from_snapshot.source_id != to_snapshot.source_id:
        raise DiffCliError(
            f"--from snapshot {from_id} has source_id={from_snapshot.source_id!r}, "
            f"--to snapshot {to_id} has source_id={to_snapshot.source_id!r} — "
            "refusing to diff mismatched sources"
        )

    if not _is_accepted_source_id(from_snapshot.source_id):
        raise DiffCliError(
            f"source_id={from_snapshot.source_id!r} is not accepted by this reviewer — "
            f"only {SOURCE_ID!r} or the {CONTROLLED_TEST_SOURCE_NAMESPACE!r} "
            "controlled-test namespace are diffed, regardless of payload shape"
        )

    from_sha256 = hashlib.sha256(from_bytes).hexdigest()
    to_sha256 = hashlib.sha256(to_bytes).hexdigest()
    raw_bytes_equal = from_sha256 == to_sha256

    from_rows = parse_capacidade_geracao(from_bytes)
    to_rows = parse_capacidade_geracao(to_bytes)
    delta = diff_capacidade_geracao(from_rows, to_rows)

    return {
        "source_id": from_snapshot.source_id,
        "from_snapshot_id": str(from_snapshot.id),
        "to_snapshot_id": str(to_snapshot.id),
        "from_sha256": from_sha256,
        "to_sha256": to_sha256,
        "parser_version": PARSER_VERSION,
        "diff_version": DIFF_VERSION,
        "raw_bytes_equal": raw_bytes_equal,
        "content_equal": delta.content_equal,
        "counts": {
            "added": len(delta.added),
            "removed": len(delta.removed),
            "changed": len(delta.changed),
        },
        "added": delta.added,
        "removed": delta.removed,
        "changed": [
            {
                "row_identity": row.identity,
                "changed_fields": [
                    {"field": c.field, "before": c.before, "after": c.after}
                    for c in row.changes
                ],
            }
            for row in delta.changed
        ],
        "limitations": list(LIMITATIONS),
    }


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(
        prog="diff_argos_ons_capacidade_geracao",
        description=(
            "Deterministic content diff between two stored ons.capacidade_geracao "
            "Argos Memory snapshots. Reads NIVAR storage only; never contacts ONS."
        ),
    )
    parser.add_argument("--from", dest="from_id", required=True, type=uuid.UUID)
    parser.add_argument("--to", dest="to_id", required=True, type=uuid.UUID)
    args = parser.parse_args(argv)

    session = SessionLocal()
    try:
        report = build_diff_report(session, args.from_id, args.to_id)
    except (DiffCliError, ValueError) as exc:
        print(json.dumps({"error": str(exc)}, ensure_ascii=False), file=sys.stderr)
        return 1
    finally:
        session.close()

    print(json.dumps(report, indent=2, sort_keys=False, ensure_ascii=False))
    return 0


if __name__ == "__main__":
    sys.exit(main())
