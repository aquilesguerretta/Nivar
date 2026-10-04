"""Progress event recording — the derivation rules for Wave 11's read caches.

``record_event`` is the only place that writes ``aula_status``,
``badge_award``, or ``study_streak``. Every branch here is a DERIVATION
rule, not a fact — if one of these turns out wrong later (streak math,
what counts as "still in progress"), the fix is changing the rule and
recomputing against ``progress_event``, never a destructive migration.
See app/db/models/progress.py for why the derived tables exist at all.

Two asymmetries are deliberate, both read literally off the Wave 11 brief:

- ``aula_iniciada`` sets ``started_at`` only if it is not already set
  (COALESCE) — the first time a lesson was opened, not the most recent.
- ``aula_concluida`` overwrites ``completed_at`` unconditionally — the
  brief's wording only qualifies ``started_at`` with "se ainda não
  existir"; ``completed_at`` carries no such qualifier. A lesson can be
  reopened and re-completed, and ``completed_at`` tracks the latest time
  that happened.

POST-CLOSE FIX (not part of the original Wave 11 delivery): the first
cut of ``aula_iniciada`` set ``status='em_andamento'`` unconditionally,
which reverted an already-``concluido`` lesson back to in-progress on a
mere revisit — real completed progress erased by re-opening a lesson.
``aula_iniciada`` now never downgrades a ``concluido`` row: the CASE in
``_mark_aula_iniciada`` keeps the existing status when it is already
``concluido`` and only writes ``em_andamento`` for a new row or a row
that was not yet ``concluido``. Deliberately reverting a completion for
real (e.g. re-extracted content invalidates prior progress) needs its
own explicit event type — out of scope here, and never an accidental
side effect of the student just opening the lesson again.

Badge award is idempotent by construction (``ON CONFLICT DO NOTHING``),
identical in shape to Wave 9's product activation. WHEN a badge should be
awarded is out of scope here — this only records that it was.

Streak recomputation is one atomic ``INSERT ... ON CONFLICT DO UPDATE``
with a ``CASE`` comparing the stored ``last_active_date`` to
``CURRENT_DATE`` at the database's clock, not Python's — this makes the
three-way branch (same day / consecutive day / gap) race-free under
concurrent requests for the same user.
"""

from __future__ import annotations

import uuid
from dataclasses import dataclass
from datetime import date, datetime

from sqlalchemy import case, func, select, text
from sqlalchemy.dialects.postgresql import insert as pg_insert
from sqlalchemy.orm import Session

from app.db.models.progress import AULA_STATUSES, EVENT_TYPES, AulaStatus, BadgeAward, ProgressEvent

_STREAK_UPSERT_SQL = text(
    """
    INSERT INTO study_streak (user_id, current_streak_days, longest_streak_days, last_active_date, updated_at)
    VALUES (:user_id, 1, 1, CURRENT_DATE, now())
    ON CONFLICT (user_id) DO UPDATE SET
      current_streak_days = CASE
        WHEN study_streak.last_active_date = CURRENT_DATE THEN study_streak.current_streak_days
        WHEN study_streak.last_active_date = CURRENT_DATE - 1 THEN study_streak.current_streak_days + 1
        ELSE 1
      END,
      longest_streak_days = GREATEST(
        study_streak.longest_streak_days,
        CASE
          WHEN study_streak.last_active_date = CURRENT_DATE THEN study_streak.current_streak_days
          WHEN study_streak.last_active_date = CURRENT_DATE - 1 THEN study_streak.current_streak_days + 1
          ELSE 1
        END
      ),
      last_active_date = CURRENT_DATE,
      updated_at = now()
    RETURNING current_streak_days, longest_streak_days, last_active_date;
    """
)


@dataclass(frozen=True)
class StreakState:
    current_streak_days: int
    longest_streak_days: int
    last_active_date: date


@dataclass(frozen=True)
class RecordedEvent:
    event_id: uuid.UUID
    event_type: str
    entity_id: str
    occurred_at: datetime
    streak: StreakState
    aula_status: AulaStatus | None
    badge_already_awarded: bool | None


def _upsert_streak(db: Session, user_id: uuid.UUID) -> StreakState:
    row = db.execute(_STREAK_UPSERT_SQL, {"user_id": str(user_id)}).one()
    return StreakState(
        current_streak_days=row.current_streak_days,
        longest_streak_days=row.longest_streak_days,
        last_active_date=row.last_active_date,
    )


def _mark_aula_iniciada(db: Session, user_id: uuid.UUID, aula_id: str, now: datetime) -> AulaStatus:
    stmt = pg_insert(AulaStatus).values(
        user_id=user_id, aula_id=aula_id, status="em_andamento", started_at=now
    )
    stmt = stmt.on_conflict_do_update(
        index_elements=["user_id", "aula_id"],
        set_={
            # Never downgrade a completed lesson back to in-progress just
            # because it was opened again — see module docstring.
            "status": case(
                (AulaStatus.status == "concluido", AulaStatus.status),
                else_=stmt.excluded.status,
            ),
            # First time this lesson was opened, not the most recent.
            "started_at": func.coalesce(AulaStatus.started_at, stmt.excluded.started_at),
            "updated_at": func.now(),
        },
    ).returning(AulaStatus)
    return db.execute(stmt).scalar_one()


def _mark_aula_concluida(db: Session, user_id: uuid.UUID, aula_id: str, now: datetime) -> AulaStatus:
    stmt = pg_insert(AulaStatus).values(
        user_id=user_id,
        aula_id=aula_id,
        status="concluido",
        started_at=now,
        completed_at=now,
    )
    stmt = stmt.on_conflict_do_update(
        index_elements=["user_id", "aula_id"],
        set_={
            "status": "concluido",
            # Overwritten unconditionally — see module docstring.
            "completed_at": stmt.excluded.completed_at,
            "updated_at": func.now(),
        },
    ).returning(AulaStatus)
    return db.execute(stmt).scalar_one()


def _award_badge(db: Session, user_id: uuid.UUID, badge_id: str, now: datetime) -> bool:
    """Returns True if the badge was already awarded before this call."""
    stmt = (
        pg_insert(BadgeAward)
        .values(user_id=user_id, badge_id=badge_id, awarded_at=now)
        .on_conflict_do_nothing(index_elements=["user_id", "badge_id"])
        .returning(BadgeAward.awarded_at)
    )
    inserted = db.execute(stmt).scalar_one_or_none()
    return inserted is None


def record_event(
    db: Session,
    *,
    user_id: uuid.UUID,
    event_type: str,
    entity_id: str,
    metadata: dict | None,
) -> RecordedEvent:
    if event_type not in EVENT_TYPES:
        raise ValueError(f"unknown event_type '{event_type}'")
    if not entity_id or not entity_id.strip():
        raise ValueError("entity_id must be a non-empty string")

    event = ProgressEvent(
        user_id=user_id,
        event_type=event_type,
        entity_id=entity_id,
        event_metadata=metadata,
    )
    db.add(event)
    db.flush()  # populate event.id / event.occurred_at before building the response

    aula_status: AulaStatus | None = None
    badge_already_awarded: bool | None = None

    if event_type == "aula_iniciada":
        aula_status = _mark_aula_iniciada(db, user_id, entity_id, event.occurred_at)
    elif event_type == "aula_concluida":
        aula_status = _mark_aula_concluida(db, user_id, entity_id, event.occurred_at)
    elif event_type == "badge_conquistado":
        badge_already_awarded = _award_badge(db, user_id, entity_id, event.occurred_at)
    # instrumento_usado / exercicio_respondido: log-only, no derived table.

    streak = _upsert_streak(db, user_id)

    db.commit()

    return RecordedEvent(
        event_id=event.id,
        event_type=event.event_type,
        entity_id=event.entity_id,
        occurred_at=event.occurred_at,
        streak=streak,
        aula_status=aula_status,
        badge_already_awarded=badge_already_awarded,
    )


def get_progress_summary(db: Session, user_id: uuid.UUID) -> dict:
    rows = db.execute(
        select(AulaStatus.aula_id, AulaStatus.status).where(AulaStatus.user_id == user_id)
    ).all()
    aulas_concluidas = [r.aula_id for r in rows if r.status == "concluido"]
    aulas_em_andamento = [r.aula_id for r in rows if r.status == "em_andamento"]

    badge_rows = db.execute(
        select(BadgeAward.badge_id, BadgeAward.awarded_at)
        .where(BadgeAward.user_id == user_id)
        .order_by(BadgeAward.awarded_at)
    ).all()
    badges = [{"badgeId": r.badge_id, "awardedAt": r.awarded_at.isoformat()} for r in badge_rows]

    streak_row = db.execute(
        text(
            "SELECT current_streak_days, longest_streak_days, last_active_date "
            "FROM study_streak WHERE user_id = :user_id"
        ),
        {"user_id": str(user_id)},
    ).one_or_none()
    if streak_row is None:
        streak = {"atual": 0, "maior": 0, "ultimoDiaAtivo": None}
    else:
        streak = {
            "atual": streak_row.current_streak_days,
            "maior": streak_row.longest_streak_days,
            "ultimoDiaAtivo": streak_row.last_active_date.isoformat(),
        }

    return {
        "aulasConcluidas": aulas_concluidas,
        "aulasEmAndamento": aulas_em_andamento,
        "badges": badges,
        "streak": streak,
    }


def get_aula_status(db: Session, user_id: uuid.UUID, aula_id: str) -> AulaStatus | None:
    return db.execute(
        select(AulaStatus).where(AulaStatus.user_id == user_id, AulaStatus.aula_id == aula_id)
    ).scalar_one_or_none()


__all__ = [
    "AULA_STATUSES",
    "EVENT_TYPES",
    "RecordedEvent",
    "StreakState",
    "get_aula_status",
    "get_progress_summary",
    "record_event",
]
