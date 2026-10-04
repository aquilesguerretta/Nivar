from __future__ import annotations

import uuid
from types import SimpleNamespace

import httpx
import pytest
from fastapi import FastAPI
from fastapi.testclient import TestClient

from app.routers import ai
from app.services.auth_service import get_current_user


VALID_PAYLOAD = {
    "model": "claude-sonnet-4-20250514",
    "max_tokens": 1_000,
    "system": "Answer as an energy-market analyst.",
    "messages": [{"role": "user", "content": "Explain this LMP move."}],
}


class MockAnthropicClient:
    calls: list[dict] = []

    def __init__(self, **kwargs):
        self.kwargs = kwargs

    async def __aenter__(self):
        return self

    async def __aexit__(self, exc_type, exc, traceback):
        return False

    async def post(self, url, **kwargs):
        type(self).calls.append({"url": url, **kwargs})
        return httpx.Response(
            200,
            json={"content": [{"type": "text", "text": "mocked"}]},
        )


@pytest.fixture(autouse=True)
def reset_ai_state(monkeypatch):
    ai._rate_limit_windows.clear()
    ai._global_rate_limit_window.clear()
    MockAnthropicClient.calls.clear()
    monkeypatch.setenv("ANTHROPIC_API_KEY", "server-secret-for-test")
    monkeypatch.delenv("AI_GLOBAL_RATE_LIMIT_REQUESTS", raising=False)


@pytest.fixture
def test_app() -> FastAPI:
    app = FastAPI()
    app.include_router(ai.router)
    return app


def authenticate(app: FastAPI) -> None:
    user = SimpleNamespace(id=uuid.uuid4())
    app.dependency_overrides[get_current_user] = lambda: user


def test_unauthenticated_request_is_rejected_without_calling_anthropic(
    test_app: FastAPI, monkeypatch
):
    class ForbiddenClient:
        def __init__(self, **kwargs):
            raise AssertionError("Anthropic must not be reached")

    monkeypatch.setattr(ai.httpx, "AsyncClient", ForbiddenClient)
    response = TestClient(test_app).post("/api/ai/complete", json=VALID_PAYLOAD)

    assert response.status_code == 401


def test_authenticated_request_reaches_mocked_anthropic(
    test_app: FastAPI, monkeypatch
):
    authenticate(test_app)
    monkeypatch.setattr(ai.httpx, "AsyncClient", MockAnthropicClient)

    response = TestClient(test_app).post("/api/ai/complete", json=VALID_PAYLOAD)

    assert response.status_code == 200
    assert response.json()["content"][0]["text"] == "mocked"
    assert len(MockAnthropicClient.calls) == 1
    call = MockAnthropicClient.calls[0]
    assert call["url"] == "https://api.anthropic.com/v1/messages"
    assert call["json"] == VALID_PAYLOAD
    assert call["headers"]["x-api-key"] == "server-secret-for-test"


@pytest.mark.parametrize(
    "change",
    [
        {"model": "claude-user-selected-model"},
        {"max_tokens": 2_001},
        {"temperature": 1},
        {"messages": []},
    ],
)
def test_prohibited_or_excessive_parameters_are_rejected(
    test_app: FastAPI, monkeypatch, change: dict
):
    authenticate(test_app)
    monkeypatch.setattr(ai.httpx, "AsyncClient", MockAnthropicClient)
    payload = {**VALID_PAYLOAD, **change}

    response = TestClient(test_app).post("/api/ai/complete", json=payload)

    assert response.status_code == 422
    assert MockAnthropicClient.calls == []


def test_oversized_body_is_rejected_before_anthropic(test_app: FastAPI, monkeypatch):
    authenticate(test_app)
    monkeypatch.setattr(ai.httpx, "AsyncClient", MockAnthropicClient)
    payload = {
        **VALID_PAYLOAD,
        "messages": [{"role": "user", "content": "x" * 70_000}],
    }

    response = TestClient(test_app).post("/api/ai/complete", json=payload)

    assert response.status_code == 413
    assert MockAnthropicClient.calls == []


def test_per_process_rate_limit_rejects_burst(test_app: FastAPI, monkeypatch):
    authenticate(test_app)
    monkeypatch.setattr(ai.httpx, "AsyncClient", MockAnthropicClient)
    client = TestClient(test_app)

    responses = [
        client.post("/api/ai/complete", json=VALID_PAYLOAD)
        for _ in range(ai._RATE_LIMIT_REQUESTS + 1)
    ]

    assert all(response.status_code == 200 for response in responses[:-1])
    assert responses[-1].status_code == 429
    assert responses[-1].headers["retry-after"] == "60"
    assert len(MockAnthropicClient.calls) == ai._RATE_LIMIT_REQUESTS


def test_global_rate_limit_applies_across_different_accounts(
    test_app: FastAPI, monkeypatch
):
    limit = 3
    monkeypatch.setenv("AI_GLOBAL_RATE_LIMIT_REQUESTS", str(limit))
    monkeypatch.setattr(ai.httpx, "AsyncClient", MockAnthropicClient)
    users = iter(SimpleNamespace(id=uuid.uuid4()) for _ in range(limit + 1))
    test_app.dependency_overrides[get_current_user] = lambda: next(users)
    client = TestClient(test_app)

    responses = [
        client.post("/api/ai/complete", json=VALID_PAYLOAD)
        for _ in range(limit + 1)
    ]

    assert all(response.status_code == 200 for response in responses[:-1])
    assert responses[-1].status_code == 429
    assert responses[-1].json()["detail"] == "AI global request rate limit exceeded"
    assert responses[-1].headers["retry-after"] == "60"
    assert len(ai._rate_limit_windows) == limit + 1
    assert all(len(window) <= 1 for window in ai._rate_limit_windows.values())
    assert len(MockAnthropicClient.calls) == limit
