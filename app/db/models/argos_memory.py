"""ORM models — Argos Memory raw evidence and snapshot/version records (NIV-12).

Argos Memory is the external-world memory layer of NIVAR: can NIVAR preserve
exactly what an external source showed at a past point in time, detect that
it later changed, and reconstruct the prior state without depending on the
source's current state? Two tables answer that, deliberately kept separate:

``ArgosRawArtifact`` is immutable evidence — the exact bytes acquired from an
external source before any semantic interpretation, content-addressed by
SHA-256 so the same bytes retrieved twice are stored once. It reuses the
BYTEA-in-Postgres pattern already established by ``ContaLuzSubmission`` /
``SolarProposalSubmission`` (see ``docs/conta-luz-express-wave-2-backend.md``
for why: the Railway web container has no persistent volume, so Postgres is
the only durable storage already provisioned — no S3/R2/GCS is introduced
here).

``ArgosSnapshot`` is one retrieval/version event: it points at the artifact
that was captured, when, under which adapter, and how it relates to the
previous capture of the same source (``first`` / ``unchanged`` / ``changed``
per M1's byte-level-only scope — no semantic diff yet). ``source_id`` is a
plain string matching the Source Registry's canonical identifier (NIV-11,
e.g. ``ons.capacidade_geracao``); there is no FK to a Source Registry table
because NIV-11 has not been ported to code yet, and building that table is
not this issue's job.

Both tables are made immutable at the database level by a trigger installed
in the migration (``argos_reject_mutation``) — no ORM-level enforcement is
relied on, since a raw SQL statement must be rejected too. Current state for
a source is never stored as a second, independently-mutated row: it is
resolved live from this history by the ``argos_current_snapshot`` view (see
the migration), so there is exactly one place drift could happen and it
cannot.

``argos_snapshot_one_root_per_source_idx`` (partial unique on ``source_id``
where ``prior_snapshot_id IS NULL``) guarantees at most one root per source
even under concurrent inserts or a direct SQL bypass — a plain
``UNIQUE(prior_snapshot_id)`` alone does not, since NULL is never equal to
NULL. ``app.services.argos_memory.capture_snapshot`` additionally takes a
transaction-scoped Postgres advisory lock keyed by ``source_id`` before
reading the current snapshot, so two concurrent captures of the same source
serialize into a single linear chain instead of racing into this
constraint.
"""

from __future__ import annotations

import uuid
from datetime import datetime

from sqlalchemy import (
    BigInteger,
    CheckConstraint,
    DateTime,
    ForeignKey,
    ForeignKeyConstraint,
    Index,
    LargeBinary,
    Text,
    UniqueConstraint,
    desc,
    func,
    text,
)
from sqlalchemy.dialects.postgresql import JSONB, UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base


# Processing is capture-only in M1 — no parser pipeline exists yet. The
# CHECK constraint is intentionally a one-value enum: it documents the
# current boundary rather than pretending a wider state machine exists.
PROCESSING_STATUSES: tuple[str, ...] = ("captured",)

# Mirrors the Source Registry v0.1 rights vocabulary (NIV-11, canonical in
# Notion). ``unknown`` is the default: NIV-13 has not produced a rights
# record for any P0 source yet, and that absence must stay explicit rather
# than defaulting to a permissive state.
RIGHTS_SUMMARY_STATES: tuple[str, ...] = ("cleared", "restricted", "unclear", "unknown")

# M1 proves byte-level memory only: same hash as the immediately prior
# snapshot for this source, or not. Semantic diffing is M2.
REVISION_RELATIONS: tuple[str, ...] = ("first", "unchanged", "changed")


class ArgosRawArtifact(Base):
    """Immutable, content-addressed raw bytes acquired from an external source."""

    __tablename__ = "argos_raw_artifact"
    __table_args__ = (
        CheckConstraint(
            "byte_size > 0",
            name="argos_raw_artifact_byte_size_check",
        ),
    )

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        server_default=func.gen_random_uuid(),
    )
    sha256: Mapped[str] = mapped_column(Text, nullable=False, unique=True)
    content_type: Mapped[str] = mapped_column(Text, nullable=False)
    byte_size: Mapped[int] = mapped_column(BigInteger, nullable=False)
    data: Mapped[bytes] = mapped_column(LargeBinary, nullable=False)

    first_captured_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        server_default=func.now(),
    )


class ArgosSnapshot(Base):
    """One retrieval event: the source state Argos actually observed, once."""

    __tablename__ = "argos_snapshot"
    __table_args__ = (
        Index(
            "argos_snapshot_source_retrieved_idx",
            "source_id",
            desc("retrieved_at"),
        ),
        Index("argos_snapshot_artifact_idx", "artifact_id"),
        UniqueConstraint(
            "prior_snapshot_id",
            name="argos_snapshot_prior_snapshot_id_key",
        ),
        # PostgreSQL requires the referenced columns of a composite FK to be
        # unique. This keeps ``id`` as the primary key while allowing lineage
        # to prove that a child and its parent belong to the same source.
        UniqueConstraint(
            "id",
            "source_id",
            name="argos_snapshot_id_source_id_key",
        ),
        ForeignKeyConstraint(
            ["prior_snapshot_id", "source_id"],
            ["argos_snapshot.id", "argos_snapshot.source_id"],
            name="argos_snapshot_prior_snapshot_source_fkey",
            ondelete="RESTRICT",
        ),
        Index(
            "argos_snapshot_one_root_per_source_idx",
            "source_id",
            unique=True,
            postgresql_where=text("prior_snapshot_id IS NULL"),
        ),
        CheckConstraint(
            "reference_time_start IS NULL OR reference_time_end IS NULL "
            "OR reference_time_start <= reference_time_end",
            name="argos_snapshot_reference_time_order_check",
        ),
        CheckConstraint(
            "(revision_relation = 'first') = (prior_snapshot_id IS NULL)",
            name="argos_snapshot_first_requires_no_prior_check",
        ),
        CheckConstraint(
            "revision_relation IN ('first', 'unchanged', 'changed')",
            name="argos_snapshot_revision_relation_check",
        ),
        CheckConstraint(
            "processing_status IN ('captured')",
            name="argos_snapshot_processing_status_check",
        ),
        CheckConstraint(
            "rights_summary_state IN ('cleared', 'restricted', 'unclear', 'unknown')",
            name="argos_snapshot_rights_summary_state_check",
        ),
    )

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        server_default=func.gen_random_uuid(),
    )

    # Source Registry (NIV-11) canonical identifier, e.g. "ons.capacidade_geracao".
    # Plain TEXT, not a FK — see module docstring.
    source_id: Mapped[str] = mapped_column(Text, nullable=False)

    artifact_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("argos_raw_artifact.id", ondelete="RESTRICT"),
        nullable=False,
    )

    # --- Acquisition -------------------------------------------------
    retrieved_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    acquisition_metadata: Mapped[dict | None] = mapped_column(JSONB, nullable=True)

    # --- Source time — explicit-unknown, never backfilled from retrieved_at ---
    published_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    reference_time_start: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True), nullable=True
    )
    reference_time_end: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True), nullable=True
    )
    source_timezone: Mapped[str | None] = mapped_column(Text, nullable=True)

    # --- Processing ----------------------------------------------------
    adapter_version: Mapped[str] = mapped_column(Text, nullable=False)
    parser_version: Mapped[str | None] = mapped_column(Text, nullable=True)
    processing_status: Mapped[str] = mapped_column(
        Text, nullable=False, server_default="captured"
    )

    # --- Governance (NIV-7 / NIV-13) ------------------------------------
    rights_record_ref: Mapped[str | None] = mapped_column(Text, nullable=True)
    rights_summary_state: Mapped[str] = mapped_column(
        Text, nullable=False, server_default="unknown"
    )

    # --- Version chain ---------------------------------------------------
    prior_snapshot_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True),
        nullable=True,
    )
    revision_relation: Mapped[str] = mapped_column(Text, nullable=False)

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        server_default=func.now(),
    )
