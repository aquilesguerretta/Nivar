"""Alexandria profile (LYCEUM, V2): study days, first occurrences, photo, banner.

The pure checks (image signature) run anywhere. The rest needs a real,
DISPOSABLE Postgres in ``DATABASE_URL`` — same skip mechanism and same
warning as ``test_progress_reads.py``: the fixture applies the whole
Alembic chain and downgrades to base afterwards.
"""

from __future__ import annotations

import json
import os
import uuid
from datetime import datetime, timedelta, timezone

import pytest
from alembic import command
from alembic.config import Config
from sqlalchemy import create_engine, text
from sqlalchemy.exc import IntegrityError, OperationalError
from sqlalchemy.orm import Session

from app.services.progress_service import (
    delete_foto,
    foto_tipo_real,
    get_foto,
    get_perfil,
    set_faixa,
    set_foto,
)

SP = "America/Sao_Paulo"
WEBP = b"RIFF\x10\x00\x00\x00WEBPVP8 " + b"\x00" * 32
PNG = b"\x89PNG\r\n\x1a\n" + b"\x00" * 32


# --- pure ---------------------------------------------------------------


def test_assinatura_de_imagem():
    assert foto_tipo_real(WEBP) == "image/webp"
    assert foto_tipo_real(PNG) == "image/png"
    assert foto_tipo_real(b"\xff\xd8\xff\xe0" + b"\x00" * 8) == "image/jpeg"
    assert foto_tipo_real(b"<svg xmlns='http://www.w3.org/2000/svg'/>") is None
    assert foto_tipo_real(b"GIF89a") is None
    assert foto_tipo_real(b"") is None


# --- database -----------------------------------------------------------


def _url() -> str | None:
    u = os.environ.get("DATABASE_URL", "").strip()
    if not u:
        return None
    try:
        e = create_engine(u)
        with e.connect():
            pass
        e.dispose()
        return u
    except OperationalError:
        return None


_URL = _url()
precisa_banco = pytest.mark.skipif(_URL is None, reason="DATABASE_URL not set or unreachable")


@pytest.fixture()
def db():
    config = Config("alembic.ini")
    config.set_main_option("sqlalchemy.url", _URL)
    command.upgrade(config, "head")
    engine = create_engine(_URL)
    session = Session(bind=engine)
    try:
        yield session
    finally:
        session.rollback()
        session.close()
        engine.dispose()
        command.downgrade(config, "base")


def _user(db: Session) -> uuid.UUID:
    uid = db.execute(
        text(
            "INSERT INTO users (email, name, password_hash) "
            "VALUES (:e, 'Perfil', 'x') RETURNING id"
        ),
        {"e": f"perfil-{uuid.uuid4().hex[:12]}@example.test"},
    ).scalar_one()
    db.commit()
    return uid


def _evento(db, uid, tipo, entidade, quando, meta=None):
    db.execute(
        text(
            "INSERT INTO progress_event (user_id, event_type, entity_id, metadata, occurred_at) "
            "VALUES (:u, :t, :e, CAST(:m AS JSONB), :q)"
        ),
        {"u": str(uid), "t": tipo, "e": entidade, "m": json.dumps(meta) if meta else None, "q": quando},
    )
    db.commit()


@precisa_banco
def test_perfil_sem_registro(db):
    uid = _user(db)
    p = get_perfil(db, uid, tz=SP)
    assert p["semRegistro"] is True
    assert p["dias"] == [] and p["primeiras"] == []
    assert p["desde"] is None and p["faixa"] is None and p["temFoto"] is False


@precisa_banco
def test_primeira_vez_e_dias(db):
    uid = _user(db)
    agora = datetime.now(timezone.utc).replace(microsecond=0)
    ontem = agora - timedelta(days=1)
    # Same exercise answered twice: only the first counts as a first occurrence.
    _evento(db, uid, "exercicio_respondido", "aula-01-03#ex-1", ontem, {"aulaId": "aula-01-03"})
    _evento(db, uid, "exercicio_respondido", "aula-01-03#ex-1", agora, {"aulaId": "aula-01-03"})
    _evento(db, uid, "aula_concluida", "aula-01-03", agora)
    # A badge is machine-emitted: never a study day, never a first occurrence.
    _evento(db, uid, "badge_conquistado", "conclusao.primeira-aula", agora)

    p = get_perfil(db, uid, tz=SP)
    assert p["semRegistro"] is False
    tipos = sorted((x["tipo"], x["entityId"]) for x in p["primeiras"])
    assert tipos == [("aula_concluida", "aula-01-03"), ("exercicio_respondido", "aula-01-03#ex-1")]
    ex = next(x for x in p["primeiras"] if x["tipo"] == "exercicio_respondido")
    assert ex["aulaId"] == "aula-01-03"
    assert datetime.fromisoformat(ex["em"]) == ontem
    assert datetime.fromisoformat(p["desde"]) == ontem
    assert sum(d["eventos"] for d in p["dias"]) == 3
    assert [x["em"] for x in p["primeiras"]] == sorted(x["em"] for x in p["primeiras"])


@precisa_banco
def test_fuso_invalido(db):
    uid = _user(db)
    with pytest.raises(ValueError):
        get_perfil(db, uid, tz="Marte/Olympus")


@precisa_banco
def test_foto_guarda_le_e_apaga(db):
    uid = _user(db)
    assert get_foto(db, uid) is None
    set_foto(db, uid, WEBP)
    dados, tipo, em = get_foto(db, uid)
    assert dados == WEBP and tipo == "image/webp" and em is not None
    assert get_perfil(db, uid)["temFoto"] is True
    set_foto(db, uid, PNG)
    assert get_foto(db, uid)[1] == "image/png"
    delete_foto(db, uid)
    assert get_foto(db, uid) is None
    delete_foto(db, uid)  # idempotent


@precisa_banco
def test_foto_recusa_o_que_nao_e_imagem_ou_e_grande(db):
    uid = _user(db)
    for ruim in (b"", b"<svg/>", b"RIFF" + b"\x00" * 300_001):
        with pytest.raises(ValueError):
            set_foto(db, uid, ruim)
    assert get_foto(db, uid) is None


@precisa_banco
def test_faixa(db):
    uid = _user(db)
    assert set_faixa(db, uid, "trilha-ii") == "trilha-ii"
    assert get_perfil(db, uid)["faixa"] == "trilha-ii"
    assert set_faixa(db, uid, None) is None
    for ruim in ("Trilha", "a b", "-x", "x" * 65, "../etc"):
        with pytest.raises(ValueError):
            set_faixa(db, uid, ruim)


@precisa_banco
def test_banco_recusa_foto_sem_tipo(db):
    uid = _user(db)
    with pytest.raises(IntegrityError):
        db.execute(
            text("INSERT INTO alexandria_perfil (user_id, foto) VALUES (:u, :f)"),
            {"u": str(uid), "f": WEBP},
        )
        db.commit()
    db.rollback()


@precisa_banco
def test_apagar_conta_apaga_perfil(db):
    uid = _user(db)
    set_foto(db, uid, WEBP)
    db.execute(text("DELETE FROM users WHERE id = :u"), {"u": str(uid)})
    db.commit()
    assert db.execute(text("SELECT count(*) FROM alexandria_perfil")).scalar_one() == 0


@precisa_banco
def test_rotas_http(db):
    from fastapi.testclient import TestClient

    from app.db.models.user import User
    from app.db.session import get_db
    from app.main import app
    from app.services.auth_service import get_current_user

    uid = _user(db)
    app.dependency_overrides[get_db] = lambda: db
    app.dependency_overrides[get_current_user] = lambda: db.get(User, uid)
    try:
        c = TestClient(app)
        assert c.get("/api/progress/perfil/foto").status_code == 404
        r = c.put("/api/progress/perfil/foto", content=WEBP, headers={"Content-Type": "image/webp"})
        assert r.status_code == 200 and r.json()["temFoto"] is True
        r = c.get("/api/progress/perfil/foto")
        assert r.status_code == 200 and r.content == WEBP
        assert r.headers["content-type"] == "image/webp"
        assert r.headers["x-content-type-options"] == "nosniff"
        assert c.put("/api/progress/perfil/foto", content=b"<svg/>").status_code == 422
        assert c.put("/api/progress/perfil/foto", content=b"\x00" * 300_001).status_code == 413
        assert c.put("/api/progress/perfil/faixa", json={"faixa": "trilha-i"}).json() == {"faixa": "trilha-i"}
        assert c.put("/api/progress/perfil/faixa", json={"faixa": "../x"}).status_code == 422
        p = c.get("/api/progress/perfil", params={"tz": SP}).json()["data"]
        assert p["temFoto"] is True and p["faixa"] == "trilha-i" and p["semRegistro"] is True
        assert c.delete("/api/progress/perfil/foto").status_code == 204
        assert c.get("/api/progress/perfil/foto").status_code == 404
    finally:
        app.dependency_overrides.clear()
