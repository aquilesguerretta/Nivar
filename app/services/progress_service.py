"""Progress: the write path (derived caches) and the read path (derivation).

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

PEÇA D — what changed, and why no migration was needed
------------------------------------------------------

1. THE PRACTICED AXIS BECAME READABLE. ``instrumento_usado`` and
   ``exercicio_respondido`` were accepted, written, and then read by
   nothing at all — no SELECT anywhere in ``app/`` touched
   ``progress_event``. They are now read, aggregated IN THE DATABASE
   (``count(*) FILTER``, ``count(DISTINCT …)``, ``GROUP BY``), never by
   pulling the log into Python.

   The lesson a practice attempt belongs to is NOT ``entity_id`` —
   ``entity_id`` is the instrument's or exercise's own id. The link can
   only come from ``metadata`` (``aulaId``, or the snake_case
   ``aula_id``; both are read, ``aulaId`` is canonical). Today nothing
   sends it, so the honest answer for most rows is "this attempt is not
   tied to a lesson", and that count is REPORTED as
   ``eventosSemAulaVinculada`` rather than guessed at. Absence is
   declared, never filled in by plausibility.

2. THE DAY-STREAK IS DERIVED, NOT INCREMENTED. The old
   ``_STREAK_UPSERT_SQL`` compared ``last_active_date`` to
   ``CURRENT_DATE`` — the database clock, in UTC — and added one for any
   event of any type. Three defects, all fixed here without new schema:

   · ZONE. The day is now ``(occurred_at AT TIME ZONE :tz)::date``, with
     ``DEFAULT_LEARNER_TIMEZONE`` (America/Sao_Paulo) declared in the
     contract and overridable per request. Someone studying at 22:00 in
     Brasília is at 01:00 UTC of the following day; under the old rule
     two sessions inside one Brazilian evening could count as two days.

   · WHAT COUNTS. Only ``STREAK_EVENT_TYPES``. ``badge_conquistado`` is
     emitted by the award mechanism itself and can no longer extend a
     learner's streak.

   · WHEN THE RECORD ENDED. ``study_streak`` stores the record's length
     and not the day it ended, so "longest: 5 days, until 12 September"
     had no source. Rather than add a column — the chain head is
     ``0010_argos_lineage_head``, an actively-worked Argos revision, and
     a competing ``0011`` would have to be untangled by hand — the end
     date is derived from the log, which is the declared source of truth
     anyway. ``progress_event.occurred_at`` is TIMESTAMPTZ and
     ``progress_event_user_idx (user_id, occurred_at DESC)`` already
     exists; nothing new was needed.

   ``study_streak`` survives as a reconstructible cache, now written
   FROM the derivation instead of by blind increment. No read path
   depends on it: every endpoint derives.

3. ABSENCE IS A VALUE. A learner with no qualifying event has no streak
   — not a zero-day streak. ``StreakDerivation.has_record`` is False and
   every number is ``None``, surfacing as ``"semRegistro": true`` with
   null fields. Zero is a measurement; absence is not.

The SQL day bucketing and the run arithmetic are split on purpose:
``_local_study_days`` asks the database for the DISTINCT calendar days
(one row per active day, not one per event, and never the whole table in
Python), and ``compute_streak_from_days`` — pure, no session, no clock —
turns days into runs. The second half is unit-testable without Postgres.
"""

from __future__ import annotations

import re
import uuid
from dataclasses import dataclass
from datetime import date, datetime
from typing import Sequence

from sqlalchemy import bindparam, case, func, select, text
from sqlalchemy.dialects.postgresql import insert as pg_insert
from sqlalchemy.exc import DBAPIError
from sqlalchemy.orm import Session

from app.db.models.progress import (
    AULA_STATUSES,
    DEFAULT_LEARNER_TIMEZONE,
    EVENT_TYPES,
    PRACTICE_EVENT_TYPES,
    STREAK_EVENT_TYPES,
    FOTO_MAX_BYTES,
    FOTO_TIPOS,
    AlexandriaPerfil,
    AulaStatus,
    BadgeAward,
    ProgressEvent,
)

# The lesson a practice attempt belongs to lives in `metadata`, never in
# `entity_id`. A constant SQL fragment, not user input — interpolated
# into the statements below so the two accepted spellings are written
# once. `aulaId` is canonical; `aula_id` is accepted because the rest of
# this backend speaks snake_case and a caller may reasonably send either.
_AULA_LINK = "COALESCE(metadata->>'aulaId', metadata->>'aula_id')"

# Conservative shape check so an obviously bogus zone fails as a 422
# instead of as a database error. Postgres remains the authority on
# whether the zone actually exists (it carries its own tzdata; Python's
# zoneinfo is not guaranteed to have one on Windows).
_TZ_RE = re.compile(r"^[A-Za-z][A-Za-z0-9_+\-]*(?:/[A-Za-z0-9_+\-]+){0,2}$")


def normalize_timezone(tz: str | None) -> str:
    """Return a syntactically plausible zone name, or raise ValueError."""
    name = (tz or "").strip() or DEFAULT_LEARNER_TIMEZONE
    if len(name) > 64 or not _TZ_RE.match(name):
        raise ValueError(f"invalid timezone '{tz}'")
    return name


# --- Streak derivation ---------------------------------------------------

_LOCAL_STUDY_DAYS_SQL = text(
    """
    SELECT DISTINCT (occurred_at AT TIME ZONE :tz)::date AS dia
    FROM progress_event
    WHERE user_id = :user_id
      AND event_type IN :types
    ORDER BY dia
    """
).bindparams(bindparam("types", expanding=True))

_TODAY_IN_ZONE_SQL = text("SELECT (now() AT TIME ZONE :tz)::date AS hoje")

# Written from the derivation, never incremented. `study_streak` is a
# cache: this statement can be replayed at any time and must produce the
# same row the log implies.
_STREAK_CACHE_SQL = text(
    """
    INSERT INTO study_streak
      (user_id, current_streak_days, longest_streak_days, last_active_date, updated_at)
    VALUES (:user_id, :current, :longest, :last_active, now())
    ON CONFLICT (user_id) DO UPDATE SET
      current_streak_days = EXCLUDED.current_streak_days,
      longest_streak_days = EXCLUDED.longest_streak_days,
      last_active_date = EXCLUDED.last_active_date,
      updated_at = now()
    """
)


@dataclass(frozen=True)
class StreakFacts:
    """Pure arithmetic over a set of calendar days. No zone, no clock."""

    has_record: bool
    current_streak_days: int | None
    longest_streak_days: int | None
    last_active_date: date | None
    longest_streak_ended_on: date | None


@dataclass(frozen=True)
class StreakDerivation:
    """``StreakFacts`` plus the zone and reference day it was computed in."""

    timezone_name: str
    reference_day: date
    has_record: bool
    current_streak_days: int | None
    longest_streak_days: int | None
    last_active_date: date | None
    longest_streak_ended_on: date | None


def compute_streak_from_days(days: Sequence[date], today: date) -> StreakFacts:
    """Turn distinct study days into current/longest runs.

    Pure: the caller has already decided which events count and which
    zone names the day. Rules, all deliberate:

    - No days at all -> no record. Every number is ``None``, not 0. A
      learner who has never studied does not have a zero-day streak; the
      product must say "no record", not print a zero.
    - The current run stays alive through the whole day after the last
      study day: ``today - last_day <= 1``. Studying yesterday and not
      yet today is a live streak, not a broken one. A gap of two or more
      days makes the current streak 0 — a real, measured zero, unlike the
      absence above.
    - On a tie for longest, the EARLIEST run wins, because that is when
      the record was actually first set.
    """
    ordered = sorted(set(days))
    if not ordered:
        return StreakFacts(False, None, None, None, None)

    runs: list[tuple[date, date]] = []
    start = previous = ordered[0]
    for day in ordered[1:]:
        if (day - previous).days == 1:
            previous = day
        else:
            runs.append((start, previous))
            start = previous = day
    runs.append((start, previous))

    longest_len = 0
    longest_end: date | None = None
    for run_start, run_end in runs:
        length = (run_end - run_start).days + 1
        if length > longest_len:  # strict `>` keeps the earliest longest run
            longest_len = length
            longest_end = run_end

    last_start, last_end = runs[-1]
    current = (last_end - last_start).days + 1 if (today - last_end).days <= 1 else 0

    return StreakFacts(
        has_record=True,
        current_streak_days=current,
        longest_streak_days=longest_len,
        last_active_date=last_end,
        longest_streak_ended_on=longest_end,
    )


def _local_study_days(db: Session, user_id: uuid.UUID, tz: str) -> list[date]:
    """DISTINCT calendar days with a qualifying event, bucketed by ``tz``.

    The DISTINCT happens in Postgres: this returns at most one row per
    day the learner studied, never one row per event and never the table.
    """
    rows = db.execute(
        _LOCAL_STUDY_DAYS_SQL,
        {"user_id": str(user_id), "tz": tz, "types": list(STREAK_EVENT_TYPES)},
    ).all()
    return [r.dia for r in rows]


def _today_in_zone(db: Session, tz: str) -> date:
    return db.execute(_TODAY_IN_ZONE_SQL, {"tz": tz}).scalar_one()


def derive_streak(db: Session, user_id: uuid.UUID, *, tz: str | None = None) -> StreakDerivation:
    """The learner's day-streak, derived from the log. Never read from cache."""
    zone = normalize_timezone(tz)
    try:
        today = _today_in_zone(db, zone)
        days = _local_study_days(db, user_id, zone)
    except DBAPIError as e:
        # Postgres is the authority on zone names; an unknown one is a
        # bad request, not a 500.
        raise ValueError(f"unknown timezone '{zone}'") from e

    facts = compute_streak_from_days(days, today)
    return StreakDerivation(
        timezone_name=zone,
        reference_day=today,
        has_record=facts.has_record,
        current_streak_days=facts.current_streak_days,
        longest_streak_days=facts.longest_streak_days,
        last_active_date=facts.last_active_date,
        longest_streak_ended_on=facts.longest_streak_ended_on,
    )


def _refresh_streak_cache(db: Session, user_id: uuid.UUID, derived: StreakDerivation) -> None:
    """Write ``study_streak`` from the derivation.

    Skipped entirely when there is no record: ``last_active_date`` is NOT
    NULL, and inventing a date to satisfy the column would be exactly the
    fabrication this module exists to prevent. No row IS the absence.
    """
    if not derived.has_record:
        return
    db.execute(
        _STREAK_CACHE_SQL,
        {
            "user_id": str(user_id),
            "current": derived.current_streak_days,
            "longest": derived.longest_streak_days,
            "last_active": derived.last_active_date,
        },
    )


def streak_payload(derived: StreakDerivation) -> dict:
    """Wire shape. ``atual``/``maior`` keep their Wave 11 names."""
    return {
        "atual": derived.current_streak_days,
        "maior": derived.longest_streak_days,
        "ultimoDiaAtivo": (
            derived.last_active_date.isoformat() if derived.last_active_date else None
        ),
        "maiorAte": (
            derived.longest_streak_ended_on.isoformat()
            if derived.longest_streak_ended_on
            else None
        ),
        "fuso": derived.timezone_name,
        "diaDeReferencia": derived.reference_day.isoformat(),
        "semRegistro": not derived.has_record,
    }


# --- The Practiced axis --------------------------------------------------

_PRACTICE_OVERVIEW_SQL = text(
    f"""
    SELECT
      count(*)                                                    AS eventos,
      count(*) FILTER (WHERE event_type = 'instrumento_usado')     AS instrumento_eventos,
      count(DISTINCT entity_id)
        FILTER (WHERE event_type = 'instrumento_usado')            AS instrumento_distintos,
      count(*) FILTER (WHERE event_type = 'exercicio_respondido')  AS exercicio_eventos,
      count(DISTINCT entity_id)
        FILTER (WHERE event_type = 'exercicio_respondido')         AS exercicio_distintos,
      count(DISTINCT {_AULA_LINK})                                 AS aulas_com_pratica,
      count(*) FILTER (WHERE {_AULA_LINK} IS NULL)                 AS eventos_sem_aula,
      min(occurred_at)                                             AS primeiro,
      max(occurred_at)                                             AS ultimo
    FROM progress_event
    WHERE user_id = :user_id
      AND event_type IN :types
    """
).bindparams(bindparam("types", expanding=True))

_PRACTICE_AULA_IDS_SQL = text(
    f"""
    SELECT DISTINCT {_AULA_LINK} AS aula_id
    FROM progress_event
    WHERE user_id = :user_id
      AND event_type IN :types
      AND {_AULA_LINK} IS NOT NULL
    ORDER BY aula_id
    """
).bindparams(bindparam("types", expanding=True))

_PRACTICE_BY_AULA_SQL = text(
    f"""
    SELECT event_type,
           entity_id,
           count(*)         AS tentativas,
           min(occurred_at) AS primeira,
           max(occurred_at) AS ultima
    FROM progress_event
    WHERE user_id = :user_id
      AND event_type IN :types
      AND {_AULA_LINK} = :aula_id
    GROUP BY event_type, entity_id
    ORDER BY event_type, entity_id
    """
).bindparams(bindparam("types", expanding=True))

_PRACTICE_BY_ENTITY_SQL = text(
    """
    SELECT event_type,
           count(*)         AS tentativas,
           min(occurred_at) AS primeira,
           max(occurred_at) AS ultima
    FROM progress_event
    WHERE user_id = :user_id
      AND event_type IN :types
      AND entity_id = :entity_id
    GROUP BY event_type
    ORDER BY event_type
    """
).bindparams(bindparam("types", expanding=True))

_PRACTICE_ENTITY_AULAS_SQL = text(
    f"""
    SELECT DISTINCT {_AULA_LINK} AS aula_id
    FROM progress_event
    WHERE user_id = :user_id
      AND event_type IN :types
      AND entity_id = :entity_id
      AND {_AULA_LINK} IS NOT NULL
    ORDER BY aula_id
    """
).bindparams(bindparam("types", expanding=True))


def _iso(value: datetime | None) -> str | None:
    return value.isoformat() if value is not None else None


def get_practice_overview(db: Session, user_id: uuid.UUID) -> dict:
    """How much practice this account has on record, aggregated in Postgres.

    Counts attempts and distinct entities and — separately — how many
    lessons have practice on record and how many attempts carry no lesson
    link at all. Those last two are reported side by side on purpose: the
    second is the honest size of what the first cannot see, so the front
    can say "3 lessons with practice, 40 attempts not tied to a lesson"
    instead of implying the 40 are nowhere.

    Never returns "X of Y lessons" or a percentage — the backend has no
    curriculum table and does not pretend to.
    """
    types = list(PRACTICE_EVENT_TYPES)
    row = db.execute(_PRACTICE_OVERVIEW_SQL, {"user_id": str(user_id), "types": types}).one()

    if row.eventos == 0:
        return {
            "semRegistro": True,
            "totalTentativas": 0,
            "aulasComPratica": [],
            "totalAulasComPratica": 0,
            "eventosSemAulaVinculada": 0,
            "instrumentos": {"tentativas": 0, "distintos": 0},
            "exercicios": {"tentativas": 0, "distintos": 0},
            "primeiraTentativa": None,
            "ultimaTentativa": None,
            "vinculoPor": "metadata.aulaId",
        }

    aula_rows = db.execute(
        _PRACTICE_AULA_IDS_SQL, {"user_id": str(user_id), "types": types}
    ).all()

    return {
        "semRegistro": False,
        "totalTentativas": row.eventos,
        "aulasComPratica": [r.aula_id for r in aula_rows],
        "totalAulasComPratica": row.aulas_com_pratica,
        "eventosSemAulaVinculada": row.eventos_sem_aula,
        "instrumentos": {
            "tentativas": row.instrumento_eventos,
            "distintos": row.instrumento_distintos,
        },
        "exercicios": {
            "tentativas": row.exercicio_eventos,
            "distintos": row.exercicio_distintos,
        },
        "primeiraTentativa": _iso(row.primeiro),
        "ultimaTentativa": _iso(row.ultimo),
        "vinculoPor": "metadata.aulaId",
    }


def _split_by_type(rows) -> tuple[list[dict], list[dict], int]:
    instrumentos: list[dict] = []
    exercicios: list[dict] = []
    total = 0
    for r in rows:
        total += r.tentativas
        item = {
            "entityId": r.entity_id,
            "tentativas": r.tentativas,
            "primeiraTentativa": _iso(r.primeira),
            "ultimaTentativa": _iso(r.ultima),
        }
        if r.event_type == "instrumento_usado":
            instrumentos.append(item)
        else:
            exercicios.append(item)
    return instrumentos, exercicios, total


def get_aula_practice(db: Session, user_id: uuid.UUID, aula_id: str) -> dict:
    """Practice state of ONE lesson, grouped in the database.

    ``semRegistro`` is True — with a 200, not a 404 — when this account
    has no practice attempt linked to this lesson. "Nothing practised
    here yet" is a normal, displayable state of the Praticado axis and
    the front needs to render it as such. (``GET /aulas/{id}``, the
    Percorrido read, still 404s; that endpoint answers a different
    question and its shape is unchanged.)

    Only ``metadata.aulaId`` links an attempt to a lesson. An attempt
    without it is invisible here by construction — see
    ``eventosSemAulaVinculada`` on the overview for its size.
    """
    rows = db.execute(
        _PRACTICE_BY_AULA_SQL,
        {"user_id": str(user_id), "aula_id": aula_id, "types": list(PRACTICE_EVENT_TYPES)},
    ).all()
    instrumentos, exercicios, total = _split_by_type(rows)
    return {
        "aulaId": aula_id,
        "semRegistro": total == 0,
        "totalTentativas": total,
        "instrumentos": instrumentos,
        "exercicios": exercicios,
        "vinculoPor": "metadata.aulaId",
    }


def get_entity_practice(db: Session, user_id: uuid.UUID, entity_id: str) -> dict:
    """Practice state of one instrument or exercise, grouped in the database."""
    types = list(PRACTICE_EVENT_TYPES)
    rows = db.execute(
        _PRACTICE_BY_ENTITY_SQL,
        {"user_id": str(user_id), "entity_id": entity_id, "types": types},
    ).all()

    por_tipo = [
        {
            "eventType": r.event_type,
            "tentativas": r.tentativas,
            "primeiraTentativa": _iso(r.primeira),
            "ultimaTentativa": _iso(r.ultima),
        }
        for r in rows
    ]
    total = sum(r.tentativas for r in rows)

    aulas: list[str] = []
    if total:
        aulas = [
            r.aula_id
            for r in db.execute(
                _PRACTICE_ENTITY_AULAS_SQL,
                {"user_id": str(user_id), "entity_id": entity_id, "types": types},
            ).all()
        ]

    return {
        "entityId": entity_id,
        "semRegistro": total == 0,
        "totalTentativas": total,
        "porTipo": por_tipo,
        "aulas": aulas,
        "vinculoPor": "metadata.aulaId",
    }


# --- Spaced review: the raw attempts the scheduling rule reads ----------
#
# LYCEUM, 15/11/2026 (Founder: "pode fazer a revisão"). The review
# SCHEDULE is a product rule that lives in the front
# (``src/lib/alexandria/revisao/agenda.ts``), pure and tested there. The
# backend only hands it the facts it derives from: every exercise
# attempt of this account, each with the learner's LOCAL day — the same
# ``occurred_at AT TIME ZONE :tz`` bucketing the streak uses, so "due
# today" and "studied today" agree on what today is.
#
# No migration and no new event type: a review IS an attempt, and it is
# logged as ``exercicio_respondido`` like the lesson's. What a review adds
# lives in ``metadata`` (``origem: 'revisao'``, ``autoavaliacao``), which
# is the loose JSONB the model docstring kept open for exactly this.
#
# Only ``ato = 'exercicio'`` rows are returned: predictions, the module
# test and the self-check acts have no statement to bring back, so they
# can never be review items. ``resposta`` is cut to 600 characters on the
# way out — the rule reads it only to compare a multiple-choice answer
# with the alternative's text, and an open answer never needs to travel
# back whole. The cut is declared per row (``respostaCortada``).

REVIEW_ATTEMPT_LIMIT = 5000
REVIEW_ANSWER_CHARS = 600

_REVIEW_ATTEMPTS_SQL = text(
    f"""
    SELECT entity_id,
           {_AULA_LINK}                                   AS aula_id,
           metadata->>'moduloId'                          AS modulo_id,
           metadata->>'origem'                            AS origem,
           metadata->>'autoavaliacao'                     AS autoavaliacao,
           left(metadata->>'resposta', :corte)            AS resposta,
           length(metadata->>'resposta') > :corte         AS resposta_cortada,
           occurred_at,
           (occurred_at AT TIME ZONE :tz)::date           AS dia
    FROM progress_event
    WHERE user_id = :user_id
      AND event_type = 'exercicio_respondido'
      AND metadata->>'ato' = 'exercicio'
    ORDER BY occurred_at DESC
    LIMIT :limite
    """
)


def get_review_attempts(db: Session, user_id: uuid.UUID, *, tz: str | None = None) -> dict:
    """Exercise attempts of this account, oldest first, with the local day.

    ``semRegistro`` (200, not 404) when there is none: "nothing to review
    yet" is a state the Home renders. ``truncado`` says the newest
    ``REVIEW_ATTEMPT_LIMIT`` rows came back and older ones did not — a
    declared cut, never a silent one.
    """
    zone = normalize_timezone(tz)
    try:
        today = _today_in_zone(db, zone)
        rows = db.execute(
            _REVIEW_ATTEMPTS_SQL,
            {
                "user_id": str(user_id),
                "tz": zone,
                "corte": REVIEW_ANSWER_CHARS,
                "limite": REVIEW_ATTEMPT_LIMIT + 1,
            },
        ).all()
    except DBAPIError as e:
        raise ValueError(f"unknown timezone '{zone}'") from e

    truncado = len(rows) > REVIEW_ATTEMPT_LIMIT
    rows = list(reversed(rows[:REVIEW_ATTEMPT_LIMIT]))

    return {
        "fuso": zone,
        "diaDeReferencia": today.isoformat(),
        "semRegistro": not rows,
        "truncado": truncado,
        "tentativas": [
            {
                "entityId": r.entity_id,
                "aulaId": r.aula_id,
                "moduloId": r.modulo_id,
                "origem": r.origem,
                "autoavaliacao": r.autoavaliacao,
                "resposta": r.resposta,
                "respostaCortada": bool(r.resposta_cortada),
                "occurredAt": _iso(r.occurred_at),
                "dia": r.dia.isoformat(),
            }
            for r in rows
        ],
    }


# --- Write path ----------------------------------------------------------


@dataclass(frozen=True)
class RecordedEvent:
    event_id: uuid.UUID
    event_type: str
    entity_id: str
    occurred_at: datetime
    streak: StreakDerivation
    aula_status: AulaStatus | None
    badge_already_awarded: bool | None


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
    tz: str | None = None,
) -> RecordedEvent:
    if event_type not in EVENT_TYPES:
        raise ValueError(f"unknown event_type '{event_type}'")
    if not entity_id or not entity_id.strip():
        raise ValueError("entity_id must be a non-empty string")

    zone = normalize_timezone(tz)

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
    # instrumento_usado / exercicio_respondido: no derived table of their
    # own — the Praticado reads aggregate the log directly.

    # Derived from the log, including the row just flushed above, and
    # then cached. A `badge_conquistado` on an account with no study
    # event derives to "no record" and writes nothing — the machine's own
    # award cannot manufacture a streak.
    streak = derive_streak(db, user_id, tz=zone)
    _refresh_streak_cache(db, user_id, streak)

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


# --- Read path -----------------------------------------------------------


def get_progress_summary(db: Session, user_id: uuid.UUID, *, tz: str | None = None) -> dict:
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

    # Derived from `progress_event`, not read from `study_streak`. The
    # cache is a cache; the log is the source.
    streak = streak_payload(derive_streak(db, user_id, tz=tz))

    return {
        "aulasConcluidas": aulas_concluidas,
        "aulasEmAndamento": aulas_em_andamento,
        "badges": badges,
        "streak": streak,
        "pratica": get_practice_overview(db, user_id),
    }


def get_aula_status(db: Session, user_id: uuid.UUID, aula_id: str) -> AulaStatus | None:
    return db.execute(
        select(AulaStatus).where(AulaStatus.user_id == user_id, AulaStatus.aula_id == aula_id)
    ).scalar_one_or_none()


__all__ = [
    "AULA_STATUSES",
    "DEFAULT_LEARNER_TIMEZONE",
    "EVENT_TYPES",
    "PRACTICE_EVENT_TYPES",
    "STREAK_EVENT_TYPES",
    "RecordedEvent",
    "StreakDerivation",
    "StreakFacts",
    "compute_streak_from_days",
    "derive_streak",
    "get_aula_practice",
    "get_aula_status",
    "get_entity_practice",
    "get_practice_overview",
    "get_progress_summary",
    "get_review_attempts",
    "normalize_timezone",
    "record_event",
    "streak_payload",
]

# --- Perfil da Alexandria (LYCEUM, V2) -----------------------------------
#
# Two raw reads for the profile page and the photo/banner store. Nothing
# here computes XP, a level, a medal or a percentage: those are house
# rules over the curriculum, and the curriculum lives in the frontend.
# What the backend hands over is what it can prove from the log:
#   · ``dias``      — study days (learner's zone) with how many study
#                     events each had, for the calendar;
#   · ``primeiras`` — the FIRST occurrence of each (event type, entity),
#                     which is what "repetition does not earn" needs, and
#                     what the history line is made of.

PERFIL_DIAS = 400

_PERFIL_DIAS_SQL = text(
    """
    SELECT (occurred_at AT TIME ZONE :tz)::date AS dia, count(*) AS eventos
    FROM progress_event
    WHERE user_id = :user_id
      AND event_type IN :types
      AND occurred_at >= now() - make_interval(days => :janela)
    GROUP BY 1
    ORDER BY 1
    """
).bindparams(bindparam("types", expanding=True))

_PERFIL_PRIMEIRAS_SQL = text(
    f"""
    SELECT DISTINCT ON (event_type, entity_id)
           event_type, entity_id, occurred_at, {_AULA_LINK} AS aula_id
    FROM progress_event
    WHERE user_id = :user_id
      AND event_type IN :types
    ORDER BY event_type, entity_id, occurred_at ASC
    """
).bindparams(bindparam("types", expanding=True))

_FOTO_ASSINATURAS: dict[str, tuple[bytes, ...]] = {
    "image/png": (b"\x89PNG\r\n\x1a\n",),
    "image/jpeg": (b"\xff\xd8\xff",),
}


def foto_tipo_real(dados: bytes) -> str | None:
    """The image type the bytes themselves declare, or None.

    The caller's claimed content type is never trusted on its own: a
    photo is stored only if its first bytes are a WebP, JPEG or PNG
    signature, and the type saved is the one the bytes carry.
    """
    if len(dados) >= 12 and dados[:4] == b"RIFF" and dados[8:12] == b"WEBP":
        return "image/webp"
    for tipo, assinaturas in _FOTO_ASSINATURAS.items():
        if any(dados.startswith(a) for a in assinaturas):
            return tipo
    return None


def get_perfil(db: Session, user_id: uuid.UUID, *, tz: str | None = None) -> dict:
    zone = normalize_timezone(tz)
    try:
        # Asks Postgres for today in the zone first: with no rows, the
        # day query below would never evaluate the zone and a bogus one
        # would pass silently.
        _today_in_zone(db, zone)
        dias = db.execute(
            _PERFIL_DIAS_SQL,
            {
                "user_id": str(user_id),
                "tz": zone,
                "types": list(STREAK_EVENT_TYPES),
                "janela": PERFIL_DIAS,
            },
        ).all()
    except DBAPIError as e:
        db.rollback()
        raise ValueError(f"unknown timezone: {zone}") from e

    primeiras = db.execute(
        _PERFIL_PRIMEIRAS_SQL,
        {"user_id": str(user_id), "types": list(STREAK_EVENT_TYPES)},
    ).all()

    perfil = db.get(AlexandriaPerfil, user_id)
    desde = min((r.occurred_at for r in primeiras), default=None)

    return {
        "fuso": zone,
        "janelaDias": PERFIL_DIAS,
        "dias": [{"dia": r.dia.isoformat(), "eventos": int(r.eventos)} for r in dias],
        "primeiras": [
            {
                "tipo": r.event_type,
                "entityId": r.entity_id,
                "em": _iso(r.occurred_at),
                "aulaId": r.aula_id,
            }
            for r in sorted(primeiras, key=lambda r: r.occurred_at)
        ],
        "desde": _iso(desde),
        "semRegistro": not primeiras,
        "faixa": perfil.faixa if perfil else None,
        "temFoto": bool(perfil and perfil.foto is not None),
        "fotoAtualizadaEm": _iso(perfil.foto_atualizada_em) if perfil else None,
    }


def _perfil_da_conta(db: Session, user_id: uuid.UUID) -> AlexandriaPerfil:
    perfil = db.get(AlexandriaPerfil, user_id)
    if perfil is None:
        perfil = AlexandriaPerfil(user_id=user_id)
        db.add(perfil)
    return perfil


def get_foto(db: Session, user_id: uuid.UUID) -> tuple[bytes, str, datetime | None] | None:
    perfil = db.get(AlexandriaPerfil, user_id)
    if perfil is None or perfil.foto is None or perfil.foto_tipo is None:
        return None
    return perfil.foto, perfil.foto_tipo, perfil.foto_atualizada_em


def set_foto(db: Session, user_id: uuid.UUID, dados: bytes) -> datetime:
    """Store the photo. Raises ValueError when the bytes are not an image
    this table accepts or are larger than ``FOTO_MAX_BYTES``."""
    if not dados:
        raise ValueError("empty photo")
    if len(dados) > FOTO_MAX_BYTES:
        raise ValueError(f"photo larger than {FOTO_MAX_BYTES} bytes")
    tipo = foto_tipo_real(dados)
    if tipo is None or tipo not in FOTO_TIPOS:
        raise ValueError("photo must be a WebP, JPEG or PNG image")
    perfil = _perfil_da_conta(db, user_id)
    agora = db.execute(text("SELECT now()")).scalar_one()
    perfil.foto = dados
    perfil.foto_tipo = tipo
    perfil.foto_atualizada_em = agora
    db.commit()
    return agora


def delete_foto(db: Session, user_id: uuid.UUID) -> None:
    perfil = db.get(AlexandriaPerfil, user_id)
    if perfil is None or perfil.foto is None:
        return
    perfil.foto = None
    perfil.foto_tipo = None
    perfil.foto_atualizada_em = None
    db.commit()


_FAIXA_RE = re.compile(r"^[a-z0-9][a-z0-9-]{0,63}$")


def set_faixa(db: Session, user_id: uuid.UUID, faixa: str | None) -> str | None:
    if faixa is not None and not _FAIXA_RE.match(faixa):
        raise ValueError("banner id must match ^[a-z0-9][a-z0-9-]{0,63}$")
    perfil = _perfil_da_conta(db, user_id)
    perfil.faixa = faixa
    db.commit()
    return faixa
