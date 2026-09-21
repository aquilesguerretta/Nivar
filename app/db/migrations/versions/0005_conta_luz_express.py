"""Conta de Luz Express — submissions and deliverables.

Revision ID: 0005_conta_luz_express
Revises: 0004_progress
Create Date: 2026-08-23

Additive only. Creates a sibling domain linked to ``users``; it does not
alter ``product_access`` or any Alexandria progress table.
"""

from typing import Sequence, Union

from alembic import op


revision: str = "0005_conta_luz_express"
down_revision: Union[str, None] = "0004_progress"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.execute(
        """
        CREATE TABLE conta_luz_submission (
          id                         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id                    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          status                     TEXT NOT NULL DEFAULT 'submitted'
                                     CHECK (status IN ('submitted', 'ready')),

          source_filename            TEXT NOT NULL,
          source_content_type        TEXT NOT NULL,
          source_size_bytes          BIGINT NOT NULL CHECK (source_size_bytes > 0),
          source_sha256              TEXT NOT NULL,
          source_data                BYTEA NOT NULL,

          deliverable_filename       TEXT,
          deliverable_content_type   TEXT,
          deliverable_size_bytes     BIGINT,
          deliverable_sha256         TEXT,
          deliverable_data           BYTEA,

          operator_email_id          TEXT,
          operator_notified_at       TIMESTAMPTZ,
          customer_email_id          TEXT,
          customer_notified_at       TIMESTAMPTZ,

          created_at                 TIMESTAMPTZ NOT NULL DEFAULT now(),
          updated_at                 TIMESTAMPTZ NOT NULL DEFAULT now(),
          delivered_at               TIMESTAMPTZ,

          CONSTRAINT conta_luz_submission_deliverable_state_check CHECK (
            (
              status = 'submitted'
              AND deliverable_data IS NULL
              AND deliverable_filename IS NULL
              AND deliverable_content_type IS NULL
              AND deliverable_size_bytes IS NULL
              AND deliverable_sha256 IS NULL
              AND delivered_at IS NULL
            )
            OR
            (
              status = 'ready'
              AND deliverable_data IS NOT NULL
              AND deliverable_filename IS NOT NULL
              AND deliverable_content_type = 'application/pdf'
              AND deliverable_size_bytes > 0
              AND deliverable_sha256 IS NOT NULL
              AND delivered_at IS NOT NULL
            )
          )
        );
        """
    )
    op.execute(
        "CREATE INDEX conta_luz_submission_user_created_idx "
        "ON conta_luz_submission(user_id, created_at DESC);"
    )
    op.execute(
        "CREATE INDEX conta_luz_submission_status_created_idx "
        "ON conta_luz_submission(status, created_at);"
    )


def downgrade() -> None:
    op.execute("DROP TABLE IF EXISTS conta_luz_submission CASCADE;")
