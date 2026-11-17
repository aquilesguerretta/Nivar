"""Portão de acesso (app/services/acesso.py).

A parte pura roda sem banco. A parte de login e criação de conta precisa de
um Postgres DESCARTÁVEL em DATABASE_URL (mesma regra de tests/progress): o
fixture aplica a cadeia Alembic inteira e desce até a base no fim.
"""

from __future__ import annotations

import os
import uuid

import pytest

os.environ.setdefault("JWT_SECRET", "segredo-de-teste-" + "x" * 32)

from app.services import acesso  # noqa: E402
from app.services.acesso import email_liberado, portao_ativo, rota_livre  # noqa: E402

LIBERADO = "aquilesguerretta@gmail.com"


@pytest.fixture()
def portao(monkeypatch):
    monkeypatch.setenv("ACCESS_GATE", "on")
    monkeypatch.delenv("ACCESS_ALLOWLIST", raising=False)
    yield
    monkeypatch.delenv("ACCESS_GATE", raising=False)


# --- puro ------------------------------------------------------------------


def test_aberto_por_padrao_fora_da_producao(monkeypatch):
    monkeypatch.delenv("ACCESS_GATE", raising=False)
    monkeypatch.delenv("RAILWAY_ENVIRONMENT_NAME", raising=False)
    assert portao_ativo() is False
    assert email_liberado("qualquer@exemplo.com") is True


def test_ativo_na_producao_do_railway(monkeypatch):
    monkeypatch.delenv("ACCESS_GATE", raising=False)
    monkeypatch.setenv("RAILWAY_ENVIRONMENT_NAME", "production")
    assert portao_ativo() is True
    monkeypatch.setenv("ACCESS_GATE", "off")
    assert portao_ativo() is False


def test_lista_padrao_e_normalizacao(portao):
    assert email_liberado(LIBERADO)
    assert email_liberado("  AndersonODev@Gmail.com ")
    assert not email_liberado("outra@pessoa.com")
    assert not email_liberado("")
    assert not email_liberado(None)


def test_lista_por_variavel(portao, monkeypatch):
    monkeypatch.setenv("ACCESS_ALLOWLIST", "a@b.com, C@D.com")
    assert email_liberado("c@d.com")
    assert not email_liberado(LIBERADO)


def test_rotas_livres():
    assert rota_livre("/api/auth/login")
    assert rota_livre("/api/auth/me")
    assert not rota_livre("/api/progress/me")
    assert not rota_livre("/api/auth/loginx")
    assert acesso.MENSAGEM.startswith("Acesso restrito")


# --- middleware, sem banco ---------------------------------------------------


def _token(email: str) -> str:
    import jwt as pyjwt
    from datetime import datetime, timedelta, timezone

    agora = datetime.now(timezone.utc)
    return pyjwt.encode(
        {"sub": str(uuid.uuid4()), "email": email, "iss": "gridalpha", "iat": int(agora.timestamp()),
         "exp": int((agora + timedelta(hours=1)).timestamp())},
        os.environ["JWT_SECRET"],
        algorithm="HS256",
    )


def test_middleware_fecha_api_publica(portao):
    from fastapi.testclient import TestClient

    from app.main import app

    c = TestClient(app)
    # rota pública antes do portão (não precisa de banco para recusar)
    assert c.get("/api/atlas/world/countries").status_code == 401
    assert c.get("/api/progress/me", cookies={"ga_session": "lixo"}).status_code == 401
    r = c.get("/api/progress/me", cookies={"ga_session": _token("intruso@exemplo.com")})
    assert r.status_code == 403 and r.json()["detail"].startswith("Acesso restrito")
    # preflight de CORS passa
    assert c.options("/api/progress/me", headers={"Origin": "http://localhost:5173",
                                                    "Access-Control-Request-Method": "GET"}).status_code in (200, 400)


def test_middleware_aberto_sem_portao(monkeypatch):
    monkeypatch.setenv("ACCESS_GATE", "off")
    from fastapi.testclient import TestClient

    from app.main import app

    r = TestClient(app).get("/api/progress/me")
    assert r.status_code == 401  # o próprio endpoint pede login; o portão não interfere
    assert r.json()["detail"] == "not authenticated"


# --- login e criação de conta, com banco descartável --------------------------


def _url() -> str | None:
    u = os.environ.get("DATABASE_URL", "").strip()
    if not u:
        return None
    from sqlalchemy import create_engine
    from sqlalchemy.exc import OperationalError

    try:
        e = create_engine(u)
        with e.connect():
            pass
        e.dispose()
        return u
    except OperationalError:
        return None


_URL = _url()
precisa_banco = pytest.mark.skipif(_URL is None, reason="DATABASE_URL não definido ou inalcançável")


@pytest.fixture()
def cliente(portao):
    from alembic import command
    from alembic.config import Config
    from fastapi.testclient import TestClient
    from sqlalchemy import create_engine
    from sqlalchemy.orm import Session

    from app.db.session import get_db
    from app.main import app

    cfg = Config("alembic.ini")
    cfg.set_main_option("sqlalchemy.url", _URL)
    command.upgrade(cfg, "head")
    engine = create_engine(_URL)
    db = Session(bind=engine)
    app.dependency_overrides[get_db] = lambda: db
    try:
        yield TestClient(app, base_url="https://testserver")
    finally:
        app.dependency_overrides.clear()
        db.close()
        engine.dispose()
        command.downgrade(cfg, "base")


@precisa_banco
def test_conta_liberada_entra_e_usa(cliente):
    senha = "senha-de-teste-123"
    r = cliente.post("/api/auth/signup", json={"email": LIBERADO, "password": senha, "name": "Aquiles"})
    assert r.status_code == 201
    assert cliente.get("/api/auth/me").status_code == 200
    assert cliente.get("/api/progress/me").status_code == 200
    cliente.post("/api/auth/logout")
    assert cliente.post("/api/auth/login", json={"email": LIBERADO.upper(), "password": senha}).status_code == 200


@precisa_banco
def test_conta_nao_liberada_nao_cria_nem_entra(cliente):
    r = cliente.post("/api/auth/signup", json={"email": "intruso@exemplo.com", "password": "x" * 12, "name": "X"})
    assert r.status_code == 403
    assert cliente.post("/api/auth/login", json={"email": "intruso@exemplo.com", "password": "x" * 12}).status_code == 401


@precisa_banco
def test_conta_antiga_nao_liberada_perde_a_sessao(cliente, monkeypatch):
    # criada com o portão aberto…
    monkeypatch.setenv("ACCESS_GATE", "off")
    r = cliente.post("/api/auth/signup", json={"email": "antiga@exemplo.com", "password": "y" * 12, "name": "Y"})
    assert r.status_code == 201
    # …e o portão fecha
    monkeypatch.setenv("ACCESS_GATE", "on")
    assert cliente.get("/api/auth/me").status_code == 403
    assert cliente.get("/api/progress/me").status_code == 403
    assert cliente.post("/api/auth/login", json={"email": "antiga@exemplo.com", "password": "y" * 12}).status_code == 403
