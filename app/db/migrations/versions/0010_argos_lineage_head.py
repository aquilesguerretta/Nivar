"""Argos Memory — redefine argos_current_snapshot as the lineage head (NIV-37).

Revision ID: 0010_argos_lineage_head
Revises: 0009_argos_memory
Create Date: 2026-09-16

0009 (already merged) defined ``argos_current_snapshot`` as ``DISTINCT ON
(source_id) * ORDER BY source_id, retrieved_at DESC, id DESC`` — i.e. the row
with the latest ``retrieved_at`` per source. ``retrieved_at`` is observation
time: when NIVAR actually acquired those bytes. It is not the same thing as
version-chain order.

Concrete failure this closes: worker A fetches source bytes at 10:00 but is
delayed; worker B fetches at 10:05 and commits first; A later acquires the
per-source advisory lock and commits as B's successor, correctly preserving
``retrieved_at = 10:00``. Lineage is B -> A (A is the chain head), but
``max(retrieved_at)`` is still B. A view/query keyed on ``retrieved_at``
would select B as "current" even though B already has a child (A) — a third
capture reading B as prior then collides with A on
``argos_snapshot_prior_snapshot_id_key`` (UniqueViolation), or the stale
state (B) gets presented as current.

Fix: the chain head for a ``source_id`` is redefined as the snapshot that no
other snapshot names as its ``prior_snapshot_id`` — a ``NOT EXISTS`` against
the same table, expressed purely over the existing ``prior_snapshot_id``
lineage column. No new column, index, or table. This resolves to at most one
row per ``source_id`` because of constraints 0009 already installed:
``argos_snapshot_prior_snapshot_id_key`` (a snapshot can be at most one
snapshot's prior — no forks) and ``argos_snapshot_one_root_per_source_idx``
(at most one root per source) — together they keep the chain linear, so
"no successor" is unique per source. This is the same predicate
``app.services.argos_memory.get_current_snapshot`` now uses, so the service
and the view agree.

View-only change. No historical row is touched; ``retrieved_at`` values are
read, never rewritten. No second, independently-mutable "current" table is
introduced — current state is still a live projection over immutable
history, just projected by lineage instead of by timestamp.
"""

from typing import Sequence, Union

from alembic import op


revision: str = "0010_argos_lineage_head"
down_revision: Union[str, None] = "0009_argos_memory"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.execute("DROP VIEW argos_current_snapshot;")
    op.execute(
        """
        CREATE VIEW argos_current_snapshot AS
        SELECT s.*
        FROM argos_snapshot s
        WHERE NOT EXISTS (
          SELECT 1 FROM argos_snapshot child WHERE child.prior_snapshot_id = s.id
        );
        """
    )


def downgrade() -> None:
    op.execute("DROP VIEW argos_current_snapshot;")
    op.execute(
        """
        CREATE VIEW argos_current_snapshot AS
        SELECT DISTINCT ON (source_id) *
        FROM argos_snapshot
        ORDER BY source_id, retrieved_at DESC, id DESC;
        """
    )
