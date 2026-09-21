"""Diagnóstico Energético — structured scoping intake.

Revision ID: 0008_diagnostico_energetico
Revises: 0007_conversation
Create Date: 2026-09-01

Additive only. Does not alter ``conversation``, ``message``,
``conta_luz_submission``, ``solar_proposal_submission`` or ``product_access``.
No BYTEA — the intake is four text fields.
"""

from typing import Sequence, Union

from alembic import op


revision: str = "0008_diagnostico_energetico"
down_revision: Union[str, None] = "0007_conversation"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.execute(
        """
        CREATE TABLE diagnostico_energetico_submission (
          id                         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id                    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          sector                     TEXT NOT NULL,
          monthly_consumption_band   TEXT NOT NULL,
          tariff_modality            TEXT,
          concern                    TEXT NOT NULL,
          created_at                 TIMESTAMPTZ NOT NULL DEFAULT now(),
          updated_at                 TIMESTAMPTZ NOT NULL DEFAULT now(),
          CONSTRAINT diagnostico_energetico_submission_sector_check
            CHECK (char_length(sector) > 0),
          CONSTRAINT diagnostico_energetico_submission_band_check
            CHECK (char_length(monthly_consumption_band) > 0),
          CONSTRAINT diagnostico_energetico_submission_concern_check
            CHECK (char_length(concern) > 0)
        );
        """
    )
    op.execute(
        "CREATE INDEX diagnostico_energetico_submission_user_created_idx "
        "ON diagnostico_energetico_submission(user_id, created_at DESC);"
    )


def downgrade() -> None:
    op.execute("DROP TABLE IF EXISTS diagnostico_energetico_submission;")
