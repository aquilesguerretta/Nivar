"""Alexandria profile: the learner's photo and chosen banner (LYCEUM, V2).

Revision ID: 0017_alexandria_perfil
Revises: 0015_ariadne_operator_label
Create Date: 2026-11-15

Additive only: one new table, no change to any existing one. It holds the
two profile facts the event log cannot carry (a photo and a banner
choice). XP, level, medals, calendar and history stay derived from
``progress_event`` — see ``app/db/models/progress.py``.

Chain note: shipped on ``feature/full-shell-buildout`` (production) on
17/11/2026, where the head was ``0015_ariadne_operator_label``, so this
revision follows it. The Codex revision ``0016_ariadne_close`` was not
merged upstream; when it lands it must be re-pointed after this one (or
joined with an alembic merge revision). The id keeps "0017" on purpose.
"""

from typing import Sequence, Union

from alembic import op

revision: str = "0017_alexandria_perfil"
down_revision: Union[str, None] = "0015_ariadne_operator_label"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.execute(
        """
        CREATE TABLE alexandria_perfil (
          user_id             UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
          foto                BYTEA,
          foto_tipo           TEXT,
          foto_atualizada_em  TIMESTAMPTZ,
          faixa               TEXT,
          atualizado_em       TIMESTAMPTZ NOT NULL DEFAULT now(),
          CONSTRAINT alexandria_perfil_foto_tipo_check
            CHECK (foto_tipo IS NULL OR foto_tipo IN ('image/webp', 'image/jpeg', 'image/png')),
          CONSTRAINT alexandria_perfil_foto_tamanho_check
            CHECK (foto IS NULL OR octet_length(foto) <= 300000),
          CONSTRAINT alexandria_perfil_foto_par_check
            CHECK ((foto IS NULL) = (foto_tipo IS NULL)),
          CONSTRAINT alexandria_perfil_faixa_check
            CHECK (faixa IS NULL OR faixa ~ '^[a-z0-9][a-z0-9-]{0,63}$')
        )
        """
    )


def downgrade() -> None:
    op.execute("DROP TABLE IF EXISTS alexandria_perfil")
