from __future__ import annotations

import os
from collections import deque
from threading import Lock
from time import monotonic
from typing import Literal

import httpx
from fastapi import APIRouter, Depends, HTTPException, Request, status
from fastapi.responses import JSONResponse
from pydantic import (
    BaseModel,
    ConfigDict,
    Field,
    ValidationError,
    field_validator,
    model_validator,
)

from app.db.models.user import User
from app.services.auth_service import get_current_user

router = APIRouter(prefix="/api/ai", tags=["ai"])

_ANTHROPIC_URL = "https://api.anthropic.com/v1/messages"
_ANTHROPIC_VERSION = "2023-06-01"
_ALLOWED_MODELS = frozenset({"claude-sonnet-4-20250514"})
_MAX_TOKENS = 2_000
_MAX_BODY_BYTES = 64 * 1024
_MAX_TOTAL_TEXT_CHARS = 48_000
_RATE_LIMIT_REQUESTS = 20
_RATE_LIMIT_WINDOW_SECONDS = 60.0
_DEFAULT_GLOBAL_RATE_LIMIT_REQUESTS = 60
_GLOBAL_RATE_LIMIT_ENV = "AI_GLOBAL_RATE_LIMIT_REQUESTS"

_rate_limit_windows: dict[str, deque[float]] = {}
_global_rate_limit_window: deque[float] = deque()
_rate_limit_lock = Lock()


def _global_rate_limit_requests() -> int:
    raw_value = os.environ.get(_GLOBAL_RATE_LIMIT_ENV, "").strip()
    if not raw_value:
        return _DEFAULT_GLOBAL_RATE_LIMIT_REQUESTS
    try:
        configured = int(raw_value)
    except ValueError:
        return _DEFAULT_GLOBAL_RATE_LIMIT_REQUESTS
    return configured if configured > 0 else _DEFAULT_GLOBAL_RATE_LIMIT_REQUESTS


class AnthropicMessage(BaseModel):
    model_config = ConfigDict(extra="forbid")

    role: Literal["user", "assistant"]
    content: str = Field(min_length=1, max_length=16_000)


class AICompletionRequest(BaseModel):
    model_config = ConfigDict(extra="forbid")

    model: str = Field(min_length=1, max_length=100)
    max_tokens: int = Field(ge=1, le=_MAX_TOKENS)
    messages: list[AnthropicMessage] = Field(min_length=1, max_length=32)
    system: str | None = Field(default=None, max_length=30_000)

    @field_validator("model")
    @classmethod
    def validate_model(cls, value: str) -> str:
        if value not in _ALLOWED_MODELS:
            raise ValueError("model is not allowed")
        return value

    @model_validator(mode="after")
    def validate_total_text_size(self) -> AICompletionRequest:
        total = len(self.system or "") + sum(
            len(message.content) for message in self.messages
        )
        if total > _MAX_TOTAL_TEXT_CHARS:
            raise ValueError(
                f"combined system and message text exceeds {_MAX_TOTAL_TEXT_CHARS} characters"
            )
        return self


async def _parse_payload(request: Request) -> AICompletionRequest:
    content_type = request.headers.get("content-type", "").split(";", 1)[0].lower()
    if content_type != "application/json":
        raise HTTPException(status.HTTP_415_UNSUPPORTED_MEDIA_TYPE, detail="application/json required")

    raw_length = request.headers.get("content-length")
    if raw_length:
        try:
            if int(raw_length) > _MAX_BODY_BYTES:
                raise HTTPException(
                    status.HTTP_413_CONTENT_TOO_LARGE,
                    detail=f"request body exceeds {_MAX_BODY_BYTES} bytes",
                )
        except ValueError as exc:
            raise HTTPException(
                status.HTTP_400_BAD_REQUEST, detail="invalid Content-Length header"
            ) from exc

    body = bytearray()
    async for chunk in request.stream():
        body.extend(chunk)
        if len(body) > _MAX_BODY_BYTES:
            raise HTTPException(
                status.HTTP_413_CONTENT_TOO_LARGE,
                detail=f"request body exceeds {_MAX_BODY_BYTES} bytes",
            )

    try:
        return AICompletionRequest.model_validate_json(body)
    except ValidationError as exc:
        raise HTTPException(
            status.HTTP_422_UNPROCESSABLE_CONTENT,
            detail=exc.errors(
                include_url=False,
                include_context=False,
                include_input=False,
            ),
        ) from exc


def _require_ai_user(user: User = Depends(get_current_user)) -> User:
    now = monotonic()
    cutoff = now - _RATE_LIMIT_WINDOW_SECONDS
    user_key = str(user.id)

    with _rate_limit_lock:
        window = _rate_limit_windows.setdefault(user_key, deque())
        while window and window[0] <= cutoff:
            window.popleft()
        while _global_rate_limit_window and _global_rate_limit_window[0] <= cutoff:
            _global_rate_limit_window.popleft()

        if len(window) >= _RATE_LIMIT_REQUESTS:
            raise HTTPException(
                status.HTTP_429_TOO_MANY_REQUESTS,
                detail="AI request rate limit exceeded",
                headers={"Retry-After": str(int(_RATE_LIMIT_WINDOW_SECONDS))},
            )

        if len(_global_rate_limit_window) >= _global_rate_limit_requests():
            raise HTTPException(
                status.HTTP_429_TOO_MANY_REQUESTS,
                detail="AI global request rate limit exceeded",
                headers={"Retry-After": str(int(_RATE_LIMIT_WINDOW_SECONDS))},
            )

        window.append(now)
        _global_rate_limit_window.append(now)

        # Bound memory even when many distinct accounts touch one process.
        stale_keys = [
            key
            for key, timestamps in _rate_limit_windows.items()
            if not timestamps or timestamps[-1] <= cutoff
        ]
        for key in stale_keys:
            if key != user_key:
                del _rate_limit_windows[key]

    return user


@router.post("/complete")
async def complete(
    _user: User = Depends(_require_ai_user),
    payload: AICompletionRequest = Depends(_parse_payload),
):
    api_key = os.environ.get("ANTHROPIC_API_KEY", "").strip()
    if not api_key:
        raise HTTPException(503, detail="ANTHROPIC_API_KEY is not configured")

    try:
        async with httpx.AsyncClient(timeout=60.0) as client:
            resp = await client.post(
                _ANTHROPIC_URL,
                headers={
                    "Content-Type": "application/json",
                    "x-api-key": api_key,
                    "anthropic-version": _ANTHROPIC_VERSION,
                },
                json=payload.model_dump(exclude_none=True),
            )

        content = resp.json()
        return JSONResponse(status_code=resp.status_code, content=content)
    except httpx.RequestError as exc:
        raise HTTPException(502, detail="Anthropic request failed") from exc
    except ValueError as exc:
        raise HTTPException(502, detail="Anthropic response parse failed") from exc
