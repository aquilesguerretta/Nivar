"""Integration tests for the progress read paths (Peça D).

Requires a real, reachable Postgres. Skips the whole module when
``DATABASE_URL`` is not set or the database cannot be reached — same
mechanism and same reasoning as ``tests/argos_memory/test_capture_persistence.py``:
there is no Postgres in the sandbox this suite was authored in, and
pointing an automated test run at the shared Railway-hosted database was
deliberately avoided. Set ``DATABASE_URL`` to a DISPOSABLE Postgres to
actually run this file; the fixture applies the real Alembic chain and
then downgrades to base, so it will drop every table in that database.

Everything here needs Postgres for a reason, not by accident: the day
bucketing is ``occurred_at AT TIME ZONE :tz``, the practice aggregation
is ``count(*) FILTER`` / ``count(DISTINCT …)`` over JSONB, and the point
of the exercise is that those run in the database rather than in Python.
The pure arithmetic they feed is covered without a database in
``test_streak_math.py``.
"""

from __future__ import annotations

import json
import os
import uuid
from datetime import date, datetime, timedelta, timezone

import pytest
from alembic import command
from alembic.config import Config
from sqlalchemy import create_engine, text
from sqlalchemy.exc import OperationalError
from sqlalchemy.orm import Session

from app.services.progress_service import (
    derive_streak,
    get_aula_practice,
    get_entity_practice,
    get_practice_overview,
    get_progress_summary,
    record_event,
    streak_payload,
)

SP = "America/Sao_Paulo"


def _database_url() -> str | None:
    url = os.environ.get("DATABASE_URL", "").strip()
    return url or None


def _reachable(url: str) -> bool:
    try:
        engine = create_engine(url)
        with engine.connect():
            pass
        engine.dispose()
        return True
    except OperationalError:
        return False


_URL = _database_url()
pytestmark = pytest.mark.skipif(
    _URL is None or not _reachable(_URL),
    reason="DATABASE_URL not set or Postgres unreachable — see module docstring",
)


@pytest.fixture()
def db_session():
    """Apply the real migration chain to a disposable database, then tear it down.

    ``DATABASE_URL`` must point at a database this suite is allowed to
    create/drop tables in — never at shared or production Postgres.
    """
    url = _URL
    assert url is not None

    config = Config("alembic.ini")
    config.set_main_option("sqlalchemy.url", url)
    command.upgrade(config, "head")

    engine = create_engine(url)
    session = Session(bind=engine)
    try:
        yield session
    finally:
        session.rollback()
        session.close()
        engine.dispose()
        command.downgrade(config, "base")


# --- fixtures' small helpers -------------------------------------------


def _new_user(db: Session) -> uuid.UUID:
    return db.execute(
        text(
            "INSERT INTO users (email, name, password_hash) "
            "VALUES (:email, 'Peça D', 'not-a-real-hash') RETURNING id"
        ),
        {"email": f"peca-d-{uuid.uuid4().hex[:12]}@example.test"},
    ).scalar_one()


_INSERT_AT_INSTANT = text(
    "INSERT INTO progress_event (user_id, event_type, entity_id, metadata, occurred_at) "
    "VALUES (:user_id, :event_type, :entity_id, CAST(:metadata AS JSONB), :occurred_at)"
)

# Local wall-clock -> instant, done by Postgres so the test never has to
# hardcode an offset. `timestamp AT TIME ZONE 'America/Sao_Paulo'` is the
# inverse of the derivation's `timestamptz AT TIME ZONE …`.
_INSERT_AT_LOCAL_CLOCK = text(
    "INSERT INTO progress_event (user_id, event_type, entity_id, metadata, occurred_at) "
    "VALUES (:user_id, :event_type, :entity_id, CAST(:metadata AS JSONB), "
    "        ((:dia)::date + (:hora)::time) AT TIME ZONE :tz)"
)


def _event_at_instant(
    db: Session,
    user_id: uuid.UUID,
    event_type: str,
    entity_id: str,
    occurred_at: datetime,
    metadata: dict | None = None,
) -> None:
    db.execute(
        _INSERT_AT_INSTANT,
        {
            "user_id": str(user_id),
            "event_type": event_type,
            "entity_id": entity_id,
            "metadata": json.dumps(metadata) if metadata is not None else None,
            "occurred_at": occurred_at,
        },
    )


def _event_on_local_day(
    db: Session,
    user_id: uuid.UUID,
    event_type: str,
    entity_id: str,
    dia: date,
    hora: str = "12:00",
    tz: str = SP,
    metadata: dict | None = None,
) -> None:
    db.execute(
        _INSERT_AT_LOCAL_CLOCK,
        {
            "user_id": str(user_id),
            "event_type": event_type,
            "entity_id": entity_id,
            "metadata": json.dumps(metadata) if metadata is not None else None,
            "dia": dia,
            "hora": hora,
            "tz": tz,
        },
    )


def _today_in(db: Session, tz: str = SP) -> date:
    """The test's own, independent reading of 'today' in a zone."""
    return db.execute(
        text("SELECT (now() AT TIME ZONE :tz)::date"), {"tz": tz}
    ).scalar_one()


# --- 1. The Practiced axis is readable at all ---------------------------


def test_practice_events_are_no_longer_write_only(db_session):
    """Before Peça D no SELECT in app/ touched progress_event at all."""
    user_id = _new_user(db_session)
    aula = "modulo-04-aula-02"

    _event_on_local_day(
        db_session, user_id, "instrumento_usado", "calc-fator-potencia",
        date(2026, 9, 10), metadata={"aulaId": aula},
    )
    _event_on_local_day(
        db_session, user_id, "instrumento_usado", "calc-fator-potencia",
        date(2026, 9, 11), metadata={"aulaId": aula},
    )
    _event_on_local_day(
        db_session, user_id, "exercicio_respondido", "ex-04-02-a",
        date(2026, 9, 11), metadata={"aulaId": aula},
    )
    db_session.flush()

    overview = get_practice_overview(db_session, user_id)
    assert overview["semRegistro"] is False
    assert overview["totalTentativas"] == 3
    assert overview["instrumentos"] == {"tentativas": 2, "distintos": 1}
    assert overview["exercicios"] == {"tentativas": 1, "distintos": 1}
    assert overview["aulasComPratica"] == [aula]
    assert overview["totalAulasComPratica"] == 1
    assert overview["eventosSemAulaVinculada"] == 0


def test_practice_counts_lessons_only_through_the_metadata_link(db_session):
    """An attempt with no ``aulaId`` is counted as unlinked, never guessed at."""
    user_id = _new_user(db_session)

    _event_on_local_day(
        db_session, user_id, "instrumento_usado", "calc-a",
        date(2026, 9, 10), metadata={"aulaId": "modulo-01-aula-01"},
    )
    _event_on_local_day(
        db_session, user_id, "instrumento_usado", "calc-b",
        date(2026, 9, 10), metadata={"aula_id": "modulo-02-aula-01"},  # snake_case also read
    )
    # No metadata at all — exactly what the front sends today.
    _event_on_local_day(
        db_session, user_id, "exercicio_respondido", "ex-sem-vinculo", date(2026, 9, 10)
    )
    # Metadata present but no lesson key.
    _event_on_local_day(
        db_session, user_id, "exercicio_respondido", "ex-outro",
        date(2026, 9, 10), metadata={"lente": "residencial"},
    )
    db_session.flush()

    overview = get_practice_overview(db_session, user_id)
    assert overview["totalTentativas"] == 4
    assert overview["aulasComPratica"] == ["modulo-01-aula-01", "modulo-02-aula-01"]
    assert overview["totalAulasComPratica"] == 2
    # The size of what the lesson count cannot see, reported rather than hidden.
    assert overview["eventosSemAulaVinculada"] == 2


def test_practice_of_one_lesson_is_grouped_by_entity(db_session):
    user_id = _new_user(db_session)
    aula = "modulo-07-aula-03"

    for _ in range(3):
        _event_on_local_day(
            db_session, user_id, "instrumento_usado", "simulador-carga",
            date(2026, 9, 12), metadata={"aulaId": aula},
        )
    _event_on_local_day(
        db_session, user_id, "exercicio_respondido", "ex-07-03-a",
        date(2026, 9, 12), metadata={"aulaId": aula},
    )
    # Another lesson's practice must not leak in.
    _event_on_local_day(
        db_session, user_id, "instrumento_usado", "simulador-carga",
        date(2026, 9, 12), metadata={"aulaId": "modulo-08-aula-01"},
    )
    db_session.flush()

    data = get_aula_practice(db_session, user_id, aula)
    assert data["semRegistro"] is False
    assert data["totalTentativas"] == 4
    assert [i["entityId"] for i in data["instrumentos"]] == ["simulador-carga"]
    assert data["instrumentos"][0]["tentativas"] == 3  # not 4 — the other lesson's row is out
    assert data["instrumentos"][0]["primeiraTentativa"] is not None
    assert data["instrumentos"][0]["ultimaTentativa"] is not None
    assert [e["entityId"] for e in data["exercicios"]] == ["ex-07-03-a"]


def test_practice_of_an_untouched_lesson_is_declared_absence_not_an_error(db_session):
    user_id = _new_user(db_session)
    data = get_aula_practice(db_session, user_id, "modulo-99-aula-99")
    assert data["semRegistro"] is True
    assert data["totalTentativas"] == 0
    assert data["instrumentos"] == []
    assert data["exercicios"] == []


def test_practice_of_one_instrument_across_lessons(db_session):
    user_id = _new_user(db_session)

    _event_on_local_day(
        db_session, user_id, "instrumento_usado", "calc-tarifa",
        date(2026, 9, 10), metadata={"aulaId": "modulo-03-aula-01"},
    )
    _event_on_local_day(
        db_session, user_id, "instrumento_usado", "calc-tarifa",
        date(2026, 9, 11), metadata={"aulaId": "modulo-05-aula-02"},
    )
    db_session.flush()

    data = get_entity_practice(db_session, user_id, "calc-tarifa")
    assert data["semRegistro"] is False
    assert data["totalTentativas"] == 2
    assert data["porTipo"][0]["eventType"] == "instrumento_usado"
    assert data["porTipo"][0]["tentativas"] == 2
    assert data["aulas"] == ["modulo-03-aula-01", "modulo-05-aula-02"]

    untouched = get_entity_practice(db_session, user_id, "calc-que-ninguem-usou")
    assert untouched["semRegistro"] is True
    assert untouched["totalTentativas"] == 0
    assert untouched["aulas"] == []


def test_practice_is_scoped_to_the_account(db_session):
    mine = _new_user(db_session)
    theirs = _new_user(db_session)
    _event_on_local_day(
        db_session, theirs, "instrumento_usado", "calc-a",
        date(2026, 9, 10), metadata={"aulaId": "modulo-01-aula-01"},
    )
    db_session.flush()
    assert get_practice_overview(db_session, mine)["semRegistro"] is True


# --- 2. The learner's day, not UTC's day --------------------------------


def test_studying_at_22h_in_brasilia_does_not_earn_two_days(db_session):
    """The defect, stated as a test.

    Two sessions inside ONE Brazilian evening: 20:00 and 22:00 on
    10 September. The second is 01:00 UTC on the 11th, so the old
    ``CURRENT_DATE`` rule saw two calendar days and added one to the
    streak. In the learner's zone it is one day.
    """
    user_id = _new_user(db_session)

    # 2026-09-10 20:00 BRT == 2026-09-10 23:00 UTC
    _event_at_instant(
        db_session, user_id, "aula_iniciada", "modulo-01-aula-01",
        datetime(2026, 9, 10, 23, 0, tzinfo=timezone.utc),
    )
    # 2026-09-10 22:00 BRT == 2026-09-11 01:00 UTC
    _event_at_instant(
        db_session, user_id, "aula_concluida", "modulo-01-aula-01",
        datetime(2026, 9, 11, 1, 0, tzinfo=timezone.utc),
    )
    db_session.flush()

    sp = derive_streak(db_session, user_id, tz=SP)
    assert sp.longest_streak_days == 1, "one Brazilian evening is one day"
    assert sp.last_active_date == date(2026, 9, 10)
    assert sp.longest_streak_ended_on == date(2026, 9, 10)

    # The same rows under the old clock, to prove the zone is what moved
    # and that this test would fail against the previous implementation.
    utc = derive_streak(db_session, user_id, tz="UTC")
    assert utc.longest_streak_days == 2
    assert utc.last_active_date == date(2026, 9, 11)


def test_midnight_to_one_am_in_brasilia_is_still_the_new_day(db_session):
    """The mirror case: past midnight local IS a new local day."""
    user_id = _new_user(db_session)
    # 2026-09-10 23:30 BRT == 2026-09-11 02:30 UTC
    _event_at_instant(
        db_session, user_id, "aula_iniciada", "a",
        datetime(2026, 9, 11, 2, 30, tzinfo=timezone.utc),
    )
    # 2026-09-11 00:30 BRT == 2026-09-11 03:30 UTC
    _event_at_instant(
        db_session, user_id, "aula_iniciada", "b",
        datetime(2026, 9, 11, 3, 30, tzinfo=timezone.utc),
    )
    db_session.flush()

    sp = derive_streak(db_session, user_id, tz=SP)
    assert sp.longest_streak_days == 2
    assert sp.last_active_date == date(2026, 9, 11)


def test_an_unknown_zone_is_a_value_error_not_a_crash(db_session):
    user_id = _new_user(db_session)
    with pytest.raises(ValueError):
        derive_streak(db_session, user_id, tz="Mars/Olympus_Mons")


# --- 3. The machine's own award cannot extend the learner's streak ------


def test_badge_conquistado_does_not_extend_the_streak(db_session):
    user_id = _new_user(db_session)

    _event_on_local_day(db_session, user_id, "aula_concluida", "modulo-01-aula-01", date(2026, 9, 10))
    # The badge the machine hands out the next day. Under the old rule
    # this made it a two-day streak with no learner action behind it.
    _event_on_local_day(db_session, user_id, "badge_conquistado", "badge-guardiao-fp", date(2026, 9, 11))
    db_session.flush()

    derived = derive_streak(db_session, user_id, tz=SP)
    assert derived.longest_streak_days == 1
    assert derived.last_active_date == date(2026, 9, 10)


def test_an_account_with_only_badges_has_no_streak_at_all(db_session):
    user_id = _new_user(db_session)
    _event_on_local_day(db_session, user_id, "badge_conquistado", "badge-a", date(2026, 9, 10))
    db_session.flush()

    derived = derive_streak(db_session, user_id, tz=SP)
    assert derived.has_record is False
    assert derived.current_streak_days is None
    assert streak_payload(derived)["semRegistro"] is True


def test_recording_a_badge_writes_no_streak_cache_row(db_session):
    """The cache must not invent a `last_active_date` to satisfy NOT NULL."""
    user_id = _new_user(db_session)
    recorded = record_event(
        db_session,
        user_id=user_id,
        event_type="badge_conquistado",
        entity_id="badge-primeiro-passo",
        metadata=None,
    )
    assert recorded.streak.has_record is False

    row = db_session.execute(
        text("SELECT count(*) FROM study_streak WHERE user_id = :u"), {"u": str(user_id)}
    ).scalar_one()
    assert row == 0


# --- 4. The record and the day it ended ---------------------------------


def test_longest_streak_carries_the_day_it_ended(db_session):
    """The field that used to have no source — derived, not stored."""
    user_id = _new_user(db_session)
    hoje = _today_in(db_session)

    # A five-day run that ended long ago, an isolated day, then the last
    # two days including today.
    for offset in (19, 18, 17, 16, 15, 10, 1, 0):
        _event_on_local_day(
            db_session, user_id, "aula_iniciada", f"aula-{offset}", hoje - timedelta(days=offset)
        )
    db_session.flush()

    derived = derive_streak(db_session, user_id, tz=SP)
    assert derived.longest_streak_days == 5
    assert derived.longest_streak_ended_on == hoje - timedelta(days=15)
    assert derived.last_active_date == hoje
    assert derived.current_streak_days == 2

    payload = streak_payload(derived)
    assert payload["maiorAte"] == (hoje - timedelta(days=15)).isoformat()
    assert payload["fuso"] == SP
    assert payload["semRegistro"] is False


def test_the_streak_cache_is_written_from_the_derivation(db_session):
    """`study_streak` is a cache of the derivation, never a blind increment."""
    user_id = _new_user(db_session)
    hoje = _today_in(db_session)

    for offset in (4, 3, 2, 1, 0):
        _event_on_local_day(
            db_session, user_id, "aula_iniciada", f"aula-{offset}", hoje - timedelta(days=offset)
        )
    db_session.flush()

    # A sixth event today must not make it a six-day streak.
    record_event(
        db_session,
        user_id=user_id,
        event_type="instrumento_usado",
        entity_id="calc-a",
        metadata={"aulaId": "modulo-01-aula-01"},
    )

    cached = db_session.execute(
        text(
            "SELECT current_streak_days, longest_streak_days, last_active_date "
            "FROM study_streak WHERE user_id = :u"
        ),
        {"u": str(user_id)},
    ).one()
    assert cached.current_streak_days == 5
    assert cached.longest_streak_days == 5
    assert cached.last_active_date == hoje

    derived = derive_streak(db_session, user_id, tz=SP)
    assert derived.current_streak_days == cached.current_streak_days
    assert derived.longest_streak_days == cached.longest_streak_days
    assert derived.last_active_date == cached.last_active_date


def test_repeated_events_on_one_day_do_not_inflate_the_streak(db_session):
    user_id = _new_user(db_session)
    hoje = _today_in(db_session)
    for hora in ("08:00", "13:00", "22:30"):
        _event_on_local_day(
            db_session, user_id, "aula_iniciada", "modulo-01-aula-01", hoje, hora=hora
        )
    db_session.flush()

    assert derive_streak(db_session, user_id, tz=SP).current_streak_days == 1


# --- 5. The empty learner: absence, declared ----------------------------


def test_a_learner_with_no_events_gets_declared_absence_not_zero(db_session):
    user_id = _new_user(db_session)
    summary = get_progress_summary(db_session, user_id, tz=SP)

    assert summary["aulasConcluidas"] == []
    assert summary["aulasEmAndamento"] == []
    assert summary["badges"] == []

    streak = summary["streak"]
    assert streak["semRegistro"] is True
    assert streak["atual"] is None
    assert streak["maior"] is None
    assert streak["ultimoDiaAtivo"] is None
    assert streak["maiorAte"] is None
    assert streak["fuso"] == SP

    pratica = summary["pratica"]
    assert pratica["semRegistro"] is True
    assert pratica["aulasComPratica"] == []
    assert pratica["primeiraTentativa"] is None


def test_a_broken_streak_reports_a_real_zero_distinct_from_absence(db_session):
    user_id = _new_user(db_session)
    hoje = _today_in(db_session)
    _event_on_local_day(
        db_session, user_id, "aula_concluida", "modulo-01-aula-01", hoje - timedelta(days=9)
    )
    _event_on_local_day(
        db_session, user_id, "aula_concluida", "modulo-01-aula-02", hoje - timedelta(days=8)
    )
    db_session.flush()

    streak = streak_payload(derive_streak(db_session, user_id, tz=SP))
    assert streak["semRegistro"] is False  # there IS a record
    assert streak["atual"] == 0  # and the current run is a measured zero
    assert streak["maior"] == 2
    assert streak["maiorAte"] == (hoje - timedelta(days=8)).isoformat()


def test_summary_keeps_the_practiced_axis_separate_from_the_streak(db_session):
    """bar.md §S3: evidence and motivation never merge into one number."""
    user_id = _new_user(db_session)
    hoje = _today_in(db_session)
    _event_on_local_day(
        db_session, user_id, "exercicio_respondido", "ex-a", hoje,
        metadata={"aulaId": "modulo-01-aula-01"},
    )
    db_session.flush()

    summary = get_progress_summary(db_session, user_id, tz=SP)
    assert set(summary) == {
        "aulasConcluidas",
        "aulasEmAndamento",
        "badges",
        "streak",
        "pratica",
    }
    assert summary["pratica"]["totalTentativas"] == 1
    assert summary["streak"]["atual"] == 1
    # No combined field anywhere — no percentage, no "X of Y".
    assert "percentual" not in summary
    assert "progresso" not in summary
