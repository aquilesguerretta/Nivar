"""Enforce same-source Argos snapshot lineage (NIV-41).

``prior_snapshot_id`` was initially a single-column self-reference.  It
ensured that a parent existed but could not prove that the child belonged to
the parent's ``source_id``.  This forward-only migration first reads the
existing immutable history for cross-source links.  It intentionally stops
on any finding: historical evidence must be reported, never rewritten or
silently hidden just to make a new constraint install.
"""

from typing import Sequence, Union

from alembic import op


revision: str = "0011_argos_same_source_lineage"
down_revision: Union[str, None] = "0010_argos_lineage_head"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # This runtime guard precedes every DDL statement that installs or
    # validates the new FK. It works in both online execution and Alembic's
    # offline SQL rendering; do not repair, delete, reparent, or otherwise
    # alter the row that makes it fail.
    op.execute(
        """
        DO $$
        DECLARE
          violation RECORD;
        BEGIN
          SELECT child.id, child.source_id, child.prior_snapshot_id,
                 parent.source_id AS parent_source_id
          INTO violation
          FROM argos_snapshot child
          JOIN argos_snapshot parent ON parent.id = child.prior_snapshot_id
          WHERE child.prior_snapshot_id IS NOT NULL
            AND child.source_id <> parent.source_id
          LIMIT 1;

          IF FOUND THEN
            RAISE EXCEPTION USING
              MESSAGE = format(
                'NIV-41 preflight found cross-source argos_snapshot lineage; '
                'migration stopped without rewriting history '
                '(child_id=%s, child_source_id=%L, prior_snapshot_id=%s, parent_source_id=%L)',
                violation.id,
                violation.source_id,
                violation.prior_snapshot_id,
                violation.parent_source_id
              );
          END IF;
        END;
        $$;
        """
    )

    # ``id`` remains the primary key. PostgreSQL additionally requires the
    # exact referenced pair to be unique before it accepts a composite FK.
    op.execute(
        "ALTER TABLE argos_snapshot "
        "ADD CONSTRAINT argos_snapshot_id_source_id_key UNIQUE (id, source_id);"
    )
    op.execute(
        "ALTER TABLE argos_snapshot "
        "DROP CONSTRAINT argos_snapshot_prior_snapshot_id_fkey;"
    )
    # Deliberately not NOT VALID: upgrade validates all existing rows after
    # the explicit preflight, so it cannot finish with an unvalidated guard.
    op.execute(
        "ALTER TABLE argos_snapshot "
        "ADD CONSTRAINT argos_snapshot_prior_snapshot_source_fkey "
        "FOREIGN KEY (prior_snapshot_id, source_id) "
        "REFERENCES argos_snapshot (id, source_id) ON DELETE RESTRICT;"
    )

    # Keep the DB projection defensive too. The FK makes this predicate
    # redundant after 0011, but it prevents an unrelated source's row from
    # ever being treated as a successor by the view.
    op.execute("DROP VIEW argos_current_snapshot;")
    op.execute(
        """
        CREATE VIEW argos_current_snapshot AS
        SELECT s.*
        FROM argos_snapshot s
        WHERE NOT EXISTS (
          SELECT 1
          FROM argos_snapshot child
          WHERE child.prior_snapshot_id = s.id
            AND child.source_id = s.source_id
        );
        """
    )


def downgrade() -> None:
    # Recreate 0010's view exactly before restoring its single-column FK.
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
    op.execute(
        "ALTER TABLE argos_snapshot "
        "DROP CONSTRAINT argos_snapshot_prior_snapshot_source_fkey;"
    )
    op.execute(
        "ALTER TABLE argos_snapshot "
        "ADD CONSTRAINT argos_snapshot_prior_snapshot_id_fkey "
        "FOREIGN KEY (prior_snapshot_id) REFERENCES argos_snapshot (id) ON DELETE RESTRICT;"
    )
    op.execute(
        "ALTER TABLE argos_snapshot "
        "DROP CONSTRAINT argos_snapshot_id_source_id_key;"
    )
