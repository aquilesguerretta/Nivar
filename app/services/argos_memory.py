"""Argos Memory — deterministic capture core and persistence (NIV-12).

Two layers, kept apart on purpose:

* **Deterministic core** — ``compute_sha256`` and ``classify_relation`` are
  pure functions with no I/O. Whether two byte strings are equal, and what
  that means for the version chain (``first`` / ``unchanged`` / ``changed``),
  is decided here and only here. Nothing upstream — including a future AI
  interpretation layer — determines byte equality or revision relation; it
  can only consume what this module already decided.
* **Persistence** — ``capture_snapshot``, ``get_current_snapshot`` and
  ``reconstruct_snapshot`` do the actual database work. They follow the
  existing router convention (``db.add`` / ``db.flush`` here, ``db.commit``
  at the caller) rather than owning the transaction boundary themselves.

M1 scope only: byte-level memory. ``classify_relation`` cannot return
anything richer than "changed" — semantic diffing is M2, not built here.

``capture_snapshot`` takes a transaction-scoped Postgres advisory lock
(``pg_advisory_xact_lock``) keyed by ``source_id`` before reading the
current snapshot. Two concurrent captures of the *same* source therefore
serialize: the second waits for the first to commit or roll back, then
correctly sees it as the prior snapshot, instead of both racing to read "no
prior" and both inserting a root. The lock is scoped to one source (a hash
collision only causes unrelated sources to serialize against each other
too — extra serialization, never wrong history) and releases automatically
on commit/rollback — no explicit unlock, no external lock manager. This is
belt-and-suspenders: ``argos_snapshot_one_root_per_source_idx`` (see the
model/migration) is the actual correctness guarantee that holds even if
this lock is bypassed entirely (e.g. a direct SQL insert); the lock exists
so the normal service path degrades to "wait, then link correctly" instead
of "race, then fail."
"""

from __future__ import annotations

import hashlib
import uuid
from dataclasses import dataclass
from datetime import datetime
from typing import Any

from sqlalchemy import select, text
from sqlalchemy.orm import Session, aliased

from app.db.models.argos_memory import ArgosRawArtifact, ArgosSnapshot


@dataclass(frozen=True)
class CapturedArtifact:
    """Result of hashing/sizing raw bytes already acquired by an adapter."""

    content_type: str
    byte_size: int
    sha256: str
    data: bytes


def compute_sha256(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def read_captured_artifact(data: bytes, content_type: str) -> CapturedArtifact:
    """Hash and size raw bytes. Pure — does not touch the database."""
    if not data:
        raise ValueError("captured payload is empty")
    return CapturedArtifact(
        content_type=content_type,
        byte_size=len(data),
        sha256=compute_sha256(data),
        data=data,
    )


def classify_relation(prior_sha256: str | None, new_sha256: str) -> str:
    """Decide how a new capture relates to the immediately prior one.

    Pure byte comparison — no semantic interpretation. ``prior_sha256=None``
    means this is the first capture ever recorded for the source.
    """
    if prior_sha256 is None:
        return "first"
    return "unchanged" if new_sha256 == prior_sha256 else "changed"


def _lock_source_for_capture(session: Session, source_id: str) -> None:
    """Serialize captures for one ``source_id`` within the current transaction.

    Blocks until any other transaction currently capturing this same
    ``source_id`` commits or rolls back. Unrelated ``source_id`` values hash
    to (almost certainly) different lock keys and remain fully independent.
    """
    session.execute(
        text("SELECT pg_advisory_xact_lock(hashtext(:source_id)::bigint)"),
        {"source_id": source_id},
    )


def get_current_snapshot(session: Session, source_id: str) -> ArgosSnapshot | None:
    """Current state for a source, resolved as the lineage head.

    The head is the snapshot for this ``source_id`` that no other snapshot
    names as its ``prior_snapshot_id`` — *not* the one with the latest
    ``retrieved_at``. ``retrieved_at`` is observation time, and a delayed
    capture can commit after a later one while still being that later one's
    lineage predecessor (see module docstring). ``prior_snapshot_id``'s
    uniqueness constraint plus the one-root-per-source index guarantee this
    resolves to at most one row. Equivalent to a lookup against the
    ``argos_current_snapshot`` view, expressed directly against the base
    table so it composes with an already-open ORM session.
    """
    successor = aliased(ArgosSnapshot)
    has_successor = (
        select(successor.id)
        .where(
            successor.prior_snapshot_id == ArgosSnapshot.id,
            successor.source_id == ArgosSnapshot.source_id,
        )
        .exists()
    )
    return session.execute(
        select(ArgosSnapshot).where(ArgosSnapshot.source_id == source_id, ~has_successor)
    ).scalar_one_or_none()


def _get_or_create_artifact(session: Session, captured: CapturedArtifact) -> ArgosRawArtifact:
    """Content-addressed dedup: the same bytes are stored physically once."""
    existing = session.execute(
        select(ArgosRawArtifact).where(ArgosRawArtifact.sha256 == captured.sha256)
    ).scalar_one_or_none()
    if existing is not None:
        return existing
    artifact = ArgosRawArtifact(
        sha256=captured.sha256,
        content_type=captured.content_type,
        byte_size=captured.byte_size,
        data=captured.data,
    )
    session.add(artifact)
    session.flush()
    return artifact


def capture_snapshot(
    session: Session,
    *,
    source_id: str,
    data: bytes,
    content_type: str,
    adapter_version: str,
    retrieved_at: datetime,
    published_at: datetime | None = None,
    reference_time_start: datetime | None = None,
    reference_time_end: datetime | None = None,
    source_timezone: str | None = None,
    acquisition_metadata: dict[str, Any] | None = None,
    rights_record_ref: str | None = None,
    rights_summary_state: str = "unknown",
) -> ArgosSnapshot:
    """Record one retrieval event for ``source_id``.

    Acquires a per-``source_id`` advisory lock first (see module docstring),
    then looks up the immediately prior snapshot for this source, hashes the
    new payload, dedupes the raw artifact by content hash, classifies the
    revision relation deterministically, and inserts (does not mutate) the
    new snapshot row. Flushes but does not commit — the caller owns the
    transaction, matching the existing router convention.
    """
    captured = read_captured_artifact(data, content_type)
    _lock_source_for_capture(session, source_id)
    prior = get_current_snapshot(session, source_id)
    prior_sha256 = _sha256_of(session, prior) if prior is not None else None
    relation = classify_relation(prior_sha256, captured.sha256)
    artifact = _get_or_create_artifact(session, captured)

    snapshot = ArgosSnapshot(
        source_id=source_id,
        artifact_id=artifact.id,
        retrieved_at=retrieved_at,
        acquisition_metadata=acquisition_metadata,
        published_at=published_at,
        reference_time_start=reference_time_start,
        reference_time_end=reference_time_end,
        source_timezone=source_timezone,
        adapter_version=adapter_version,
        parser_version=None,
        processing_status="captured",
        rights_record_ref=rights_record_ref,
        rights_summary_state=rights_summary_state,
        prior_snapshot_id=prior.id if prior is not None else None,
        revision_relation=relation,
    )
    session.add(snapshot)
    session.flush()
    return snapshot


def _sha256_of(session: Session, snapshot: ArgosSnapshot) -> str:
    artifact = session.get(ArgosRawArtifact, snapshot.artifact_id)
    assert artifact is not None, "snapshot.artifact_id must reference an existing artifact"
    return artifact.sha256


def reconstruct_snapshot(session: Session, snapshot_id: uuid.UUID) -> tuple[ArgosSnapshot, bytes]:
    """Reconstruct a historical capture from stored evidence only.

    Never touches the live external source — everything returned here comes
    from ``argos_snapshot`` and ``argos_raw_artifact`` as they were written.
    """
    snapshot = session.get(ArgosSnapshot, snapshot_id)
    if snapshot is None:
        raise LookupError(f"no argos_snapshot with id {snapshot_id}")
    artifact = session.get(ArgosRawArtifact, snapshot.artifact_id)
    assert artifact is not None, "snapshot.artifact_id must reference an existing artifact"
    return snapshot, artifact.data


__all__ = [
    "CapturedArtifact",
    "capture_snapshot",
    "classify_relation",
    "compute_sha256",
    "get_current_snapshot",
    "read_captured_artifact",
    "reconstruct_snapshot",
]
