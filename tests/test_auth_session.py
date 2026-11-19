"""Ordinary identity endpoint checks against disposable local PostgreSQL."""

import os
from datetime import datetime, timedelta, timezone
from http.cookies import SimpleCookie
from uuid import uuid4

import pytest
from fastapi import FastAPI
from fastapi.testclient import TestClient
from jwt import api_jwt
from sqlalchemy.engine import make_url

from app.routers import auth, products
from app.services import auth_service


@pytest.fixture
def account_client(monkeypatch):
    raw_url = os.environ.get("DATABASE_URL")
    if not raw_url:
        pytest.skip("requires the disposable niv66_test database on loopback")
    url = make_url(raw_url)
    if url.host != "127.0.0.1" or url.database != "niv66_test" or url.query:
        pytest.skip("requires the disposable niv66_test database on loopback")
    monkeypatch.setattr(auth_service, "JWT_SECRET", uuid4().hex)
    monkeypatch.setattr(auth_service, "SESSION_TTL_DAYS", 30)
    monkeypatch.setattr(auth_service, "SESSION_COOKIE_SECURE", True)
    monkeypatch.setattr(auth_service, "SESSION_COOKIE_SAMESITE", "lax")
    monkeypatch.setattr(auth_service, "SESSION_COOKIE_DOMAIN", None)
    monkeypatch.setattr(auth_service, "SESSION_COOKIE_PATH", "/")

    app = FastAPI()
    app.include_router(auth.router)
    app.include_router(products.router)
    credentials = {"email": f"niv69-{uuid4().hex}@example.com", "password": uuid4().hex}
    with TestClient(app, base_url="https://testserver") as registration:
        signup = registration.post("/api/auth/signup", json={**credentials, "name": "NIV-69 QA"})
        assert signup.status_code == 201
        assert len(signup.headers.get_list("set-cookie")) == 1
        assert auth_service.SESSION_COOKIE_NAME in signup.cookies
        assert "token" not in signup.json()
    with TestClient(app, base_url="https://testserver") as client:
        yield client, credentials


def test_cookie_login_then_protected_reads_and_logout(account_client):
    client, credentials = account_client
    name = auth_service.SESSION_COOKIE_NAME
    assert client.get("/api/auth/me").status_code == 401

    login = client.post("/api/auth/login", json=credentials)
    assert login.status_code == 200
    assert "token" not in login.json()
    assert len(login.headers.get_list("set-cookie")) == 1
    session_cookie = SimpleCookie(login.headers["set-cookie"])[name]
    assert session_cookie["httponly"]
    assert session_cookie["secure"]
    assert session_cookie["samesite"] == "lax"
    assert session_cookie["path"] == "/"
    assert int(session_cookie["max-age"]) == 30 * 24 * 60 * 60
    claims = auth_service.decode_token(client.cookies[name])
    assert claims["exp"] - claims["iat"] == 30 * 24 * 60 * 60
    assert claims["exp"] == int(datetime.fromisoformat(login.json()["expiresAt"]).timestamp())

    for path in ("/api/auth/me", "/api/products/me"):
        read = client.get(path)
        assert read.status_code == 200
        assert "set-cookie" not in read.headers

    logout = client.post("/api/auth/logout")
    assert logout.status_code == 200
    assert SimpleCookie(logout.headers["set-cookie"])[name]["max-age"] == "0"
    assert name not in client.cookies
    for path in ("/api/auth/me", "/api/products/me"):
        assert client.get(path).status_code == 401


def test_cookie_session_expires_at_its_original_deadline(account_client, monkeypatch):
    client, credentials = account_client
    login = client.post("/api/auth/login", json=credentials)
    assert login.status_code == 200
    claims = auth_service.decode_token(client.cookies[auth_service.SESSION_COOKIE_NAME])
    expiry = datetime.fromtimestamp(claims["exp"], timezone.utc)
    simulated_time = expiry - timedelta(seconds=1)

    class ValidationClock(datetime):
        @classmethod
        def now(cls, tz=None):
            return simulated_time

    monkeypatch.setattr(api_jwt, "datetime", ValidationClock)
    before_expiry = client.get("/api/auth/me")
    assert before_expiry.status_code == 200
    assert "set-cookie" not in before_expiry.headers

    simulated_time = expiry
    expired = client.get("/api/auth/me")
    assert expired.status_code == 401
    assert expired.json() == {"detail": "session expired"}
    assert "set-cookie" not in expired.headers


def test_bearer_login_and_protected_read(account_client):
    client, credentials = account_client
    login = client.post(
        "/api/auth/login", json=credentials, headers={"X-Auth-Transport": "bearer"},
    )
    assert login.status_code == 200
    token = login.json()["token"]
    client.cookies.clear()
    read = client.get("/api/auth/me", headers={"Authorization": f"Bearer {token}"})
    assert read.status_code == 200
    assert read.json()["user"]["email"] == credentials["email"]
    assert "set-cookie" not in read.headers
