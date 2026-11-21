"""Per-account learning progress (Cursor Wave 11).

Revision ID: 0004_progress
Revises: 0003_country_energy
Create Date: 2026-08-02

Additive only. Touches no Wave 7/8/9/10 table. Mirrors the brief's literal
DDL exactly, plus indexes and FKs; no independent schema decisions were
made here (see app/db/models/progress.py for the reasoning that IS this
wave's own — event log vs. derived cache, and the metadata column).
"""

from typing import Sequence, Union

from alembic import op

revision: str = "0004_progress"
down_revision: Union[str, None] = "0003_country_energy"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.execute(
        """
        CREATE TABLE progress_event (
          id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id      UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          event_type   TEXT NOT NULL CHECK (event_type IN (
                         'aula_iniciada', 'aula_concluida',
                         'instrumento_usado', 'exercicio_respondido',
                         'badge_conquistado'
                       )),
          entity_id    TEXT NOT NULL,
          metadata     JSONB,
          occurred_at  TIMESTAMPTZ NOT NULL DEFAULT now()
        );
        """
    )
    op.execute("CREATE INDEX progress_event_user_idx ON progress_event(user_id, occurred_at DESC);")
    op.execute(
        "CREATE INDEX progress_event_type_idx ON progress_event(user_id, event_type, entity_id);"
    )

    op.execute(
        """
        CREATE TABLE aula_status (
          user_id       UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          aula_id       TEXT NOT NULL,
          status        TEXT NOT NULL CHECK (status IN ('em_andamento', 'concluido')),
          started_at    TIMESTAMPTZ,
          completed_at  TIMESTAMPTZ,
          updated_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
          PRIMARY KEY (user_id, aula_id)
        );
        """
    )

    op.execute(
        """
        CREATE TABLE badge_award (
          user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          badge_id    TEXT NOT NULL,
          awarded_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
          PRIMARY KEY (user_id, badge_id)
        );
        """
    )

    op.execute(
        """
        CREATE TABLE study_streak (
          user_id              UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
          current_streak_days  INTEGER NOT NULL DEFAULT 0,
          longest_streak_days  INTEGER NOT NULL DEFAULT 0,
          last_active_date     DATE NOT NULL DEFAULT CURRENT_DATE,
          updated_at           TIMESTAMPTZ NOT NULL DEFAULT now()
        );
        """
    )


def downgrade() -> None:
    op.execute("DROP TABLE IF EXISTS study_streak CASCADE;")
    op.execute("DROP TABLE IF EXISTS badge_award CASCADE;")
    op.execute("DROP TABLE IF EXISTS aula_status CASCADE;")
    op.execute("DROP TABLE IF EXISTS progress_event CASCADE;")
