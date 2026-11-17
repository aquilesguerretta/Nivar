"""Integration tests for the spaced-review read (LYCEUM, 15/11/2026).

``GET /api/progress/revisao`` hands the front's scheduling rule the raw
exercise attempts, each with the learner's LOCAL day. Same database
requirement and same skip mechanism as ``test_progress_reads.py``: set
``DATABASE_URL`` to a DISPOSABLE Postgres to run this file — the fixture
applies the Alembic chain and downgrades to base afterwards. Never point
it at the shared Railway database.

The schedule itself is pure TypeScript, tested without a database in
``tests/alexandria-progresso/revisao-agenda.test.ts``.
"""

from __future__ import annotations

import json
import os
import uuid
from datetime import date

import pytest
from alembic import command
from alembic.config import Config
from sqlalchemy import create_engine, text
from sqlalchemy.exc import OperationalError
from sqlalchemy.orm import Session

from app.services.progress_service import REVIEW_ANSWER_CHARS, get_review_attempts

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


def _new_user(db: Session) -> uuid.UUID:
    return db.execute(
        text(
            "INSERT INTO users (email, name, password_hash) "
            "VALUES (:email, 'Revisão', 'not-a-real-hash') RETURNING id"
        ),
        {"email": f"revisao-{uuid.uuid4().hex[:12]}@example.test"},
    ).scalar_one()


_INSERT_AT_LOCAL_CLOCK = text(
    "INSERT INTO progress_event (user_id, event_type, entity_id, metadata, occurred_at) "
    "VALUES (:user_id, :event_type, :entity_id, CAST(:metadata AS JSONB), "
    "        ((:dia)::date + (:hora)::time) AT TIME ZONE :tz)"
)


def _event(db, user_id, event_type, entity_id, dia, hora="12:00", metadata=None, tz=SP):
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


def _ex(aula="aula-01-01", **extra):
    return {"aulaId": aula, "moduloId": "modulo-01", "ato": "exercicio", "antesDaReferencia": True, **extra}


def test_no_attempt_is_declared_absence(db_session):
    user_id = _new_user(db_session)
    data = get_review_attempts(db_session, user_id, tz=SP)
    assert data["semRegistro"] is True
    assert data["tentativas"] == []
    assert data["truncado"] is False
    assert data["fuso"] == SP


def test_only_exercise_acts_come_back_oldest_first(db_session):
    user_id = _new_user(db_session)
    _event(db_session, user_id, "exercicio_respondido", "m01-ex-01", date(2026, 11, 2), metadata=_ex(resposta="b"))
    _event(db_session, user_id, "exercicio_respondido", "m01-ex-01", date(2026, 11, 1), metadata=_ex(resposta="a"))
    # not review items: a prediction, the module test, an instrument
    _event(db_session, user_id, "exercicio_respondido", "aula-01-08#previsao", date(2026, 11, 1),
           metadata={"aulaId": "aula-01-08", "ato": "previsao"})
    _event(db_session, user_id, "exercicio_respondido", "modulo-01#avaliacao", date(2026, 11, 1),
           metadata={"aulaId": "aula-01-09", "ato": "avaliacao"})
    _event(db_session, user_id, "instrumento_usado", "inst-01", date(2026, 11, 1), metadata={"aulaId": "aula-01-01"})
    db_session.flush()

    data = get_review_attempts(db_session, user_id, tz=SP)
    assert [t["resposta"] for t in data["tentativas"]] == ["a", "b"]
    assert {t["entityId"] for t in data["tentativas"]} == {"m01-ex-01"}
    assert data["tentativas"][0]["aulaId"] == "aula-01-01"
    assert data["tentativas"][0]["moduloId"] == "modulo-01"


def test_the_day_is_the_learners_day(db_session):
    """22:30 in Brasília is still that day, though it is the next day in UTC."""
    user_id = _new_user(db_session)
    _event(db_session, user_id, "exercicio_respondido", "m01-ex-02", date(2026, 11, 10), hora="22:30", metadata=_ex())
    db_session.flush()
    data = get_review_attempts(db_session, user_id, tz=SP)
    assert data["tentativas"][0]["dia"] == "2026-11-10"


def test_review_metadata_travels_and_long_answers_are_cut_declared(db_session):
    user_id = _new_user(db_session)
    _event(db_session, user_id, "exercicio_respondido", "m01-ex-03", date(2026, 11, 3),
           metadata=_ex(resposta="x" * (REVIEW_ANSWER_CHARS + 50), origem="revisao", autoavaliacao="atende em parte"))
    db_session.flush()
    t = get_review_attempts(db_session, user_id, tz=SP)["tentativas"][0]
    assert t["origem"] == "revisao"
    assert t["autoavaliacao"] == "atende em parte"
    assert len(t["resposta"]) == REVIEW_ANSWER_CHARS
    assert t["respostaCortada"] is True


def test_attempts_are_scoped_to_the_account(db_session):
    a = _new_user(db_session)
    b = _new_user(db_session)
    _event(db_session, a, "exercicio_respondido", "m01-ex-01", date(2026, 11, 1), metadata=_ex())
    db_session.flush()
    assert get_review_attempts(db_session, b, tz=SP)["semRegistro"] is True


def test_an_unknown_zone_is_a_value_error(db_session):
    user_id = _new_user(db_session)
    with pytest.raises(ValueError):
        get_review_attempts(db_session, user_id, tz="Mars/Olympus_Mons")
