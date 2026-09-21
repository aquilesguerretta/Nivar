"""Identity primitives — password hashing, stateless sessions, cookie policy.

PORTABILITY — deliberate Wave 9 decision, not an accident of today's deploy.

The final domain topology does not exist yet. Today frontend and backend
share one Railway origin; the stated intent is a move to a self-hosted VPS,
possibly with separate domains. Three choices here keep that move cheap:

1. The session token is a real JWT signed with JWT_SECRET, not an opaque
   server-side session. Validation is a signature check, so it holds no
   state in the backend process and survives several instances behind a
   load balancer with no shared session store.
2. A caller may present the token in the httpOnly cookie *or* in an
   ``Authorization: Bearer`` header. The cookie is what the same-origin
   deploy uses today; the header is what works without friction once the
   frontend sits on another domain, or a native client appears.
3. sameSite, secure and cookie domain are read from the environment with
   defaults tuned for today. Changing topology is an env change, not a
   rewrite.

Password hashing is Argon2id (argon2-cffi defaults), chosen over bcrypt
because it has no 72-byte truncation and is the current OWASP first
recommendation.
"""

from __future__ import annotations

import os
import uuid
from datetime import datetime, timedelta, timezone
from typing import Literal

import jwt
from argon2 import PasswordHasher
from argon2.exceptions import (
    InvalidHashError,
    VerificationError,
    VerifyMismatchError,
)
from fastapi import Depends, HTTPException, Request, Response, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.db.models.user import User
from app.db.session import get_db

# ── configuration ────────────────────────────────────────────────────────
# Never hardcoded. JWT_SECRET absent must not take down /health or the
# Wave 7/8 infra endpoints, so the failure is per-request (503) rather
# than at import.
JWT_SECRET = os.environ.get("JWT_SECRET", "").strip()
JWT_ALGORITHM = "HS256"
JWT_ISSUER = "gridalpha"

SESSION_TTL_DAYS = int(os.environ.get("SESSION_TTL_DAYS", "30"))
SESSION_COOKIE_NAME = os.environ.get("SESSION_COOKIE_NAME", "ga_session").strip()
SESSION_COOKIE_PATH = os.environ.get("SESSION_COOKIE_PATH", "/").strip() or "/"

# Empty means host-only, which is what the same-origin deploy wants. Set
# to e.g. ".gridalpha.com" once backend and frontend are sibling subdomains.
SESSION_COOKIE_DOMAIN = os.environ.get("SESSION_COOKIE_DOMAIN", "").strip() or None

_raw_samesite = os.environ.get("SESSION_COOKIE_SAMESITE", "lax").strip().lower()
SESSION_COOKIE_SAMESITE: Literal["lax", "strict", "none"] = (
    _raw_samesite if _raw_samesite in ("lax", "strict", "none") else "lax"  # type: ignore[assignment]
)

_raw_secure = os.environ.get("SESSION_COOKIE_SECURE", "true").strip().lower()
# Browsers reject SameSite=None without Secure, so cross-site config forces it.
SESSION_COOKIE_SECURE = (
    True if SESSION_COOKIE_SAMESITE == "none" else _raw_secure in ("1", "true", "yes", "on")
)

# Opt-in transport for non-browser callers: only these get the raw token in
# the response body. Browsers stay cookie-only, so nothing readable by XSS
# ever lands in the payload.
BEARER_TRANSPORT_HEADER = "X-Auth-Transport"

_hasher = PasswordHasher()


# ── password hashing ─────────────────────────────────────────────────────
def hash_password(password: str) -> str:
    return _hasher.hash(password)


def verify_password(password_hash: str, password: str) -> bool:
    try:
        _hasher.verify(password_hash, password)
    except (VerifyMismatchError, VerificationError, InvalidHashError):
        return False
    return True


def needs_rehash(password_hash: str) -> bool:
    try:
        return _hasher.check_needs_rehash(password_hash)
    except InvalidHashError:
        return False


def normalize_email(email: str) -> str:
    """Lower-case and trim — the form every write and lookup uses.

    This is what lets the plain UNIQUE constraint on users.email carry the
    "one account per address, whatever the auth method" invariant.
    """
    return email.strip().lower()


# ── stateless session tokens ─────────────────────────────────────────────
def _require_secret() -> str:
    if not JWT_SECRET:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="auth unavailable: JWT_SECRET is not configured",
        )
    return JWT_SECRET


def issue_token(user: User) -> tuple[str, datetime]:
    """Sign a session JWT. Returns the token and its absolute expiry."""
    now = datetime.now(timezone.utc)
    expires_at = now + timedelta(days=SESSION_TTL_DAYS)
    payload = {
        "sub": str(user.id),
        "email": user.email,
        "iss": JWT_ISSUER,
        "iat": int(now.timestamp()),
        "exp": int(expires_at.timestamp()),
    }
    return jwt.encode(payload, _require_secret(), algorithm=JWT_ALGORITHM), expires_at


def decode_token(token: str) -> dict:
    return jwt.decode(
        token,
        _require_secret(),
        algorithms=[JWT_ALGORITHM],
        issuer=JWT_ISSUER,
        options={"require": ["exp", "iat", "sub", "iss"]},
    )


def set_session_cookie(response: Response, token: str) -> None:
    response.set_cookie(
        key=SESSION_COOKIE_NAME,
        value=token,
        max_age=SESSION_TTL_DAYS * 24 * 60 * 60,
        path=SESSION_COOKIE_PATH,
        domain=SESSION_COOKIE_DOMAIN,
        secure=SESSION_COOKIE_SECURE,
        httponly=True,
        samesite=SESSION_COOKIE_SAMESITE,
    )


def clear_session_cookie(response: Response) -> None:
    response.delete_cookie(
        key=SESSION_COOKIE_NAME,
        path=SESSION_COOKIE_PATH,
        domain=SESSION_COOKIE_DOMAIN,
        secure=SESSION_COOKIE_SECURE,
        httponly=True,
        samesite=SESSION_COOKIE_SAMESITE,
    )


def wants_bearer_transport(request: Request) -> bool:
    header = request.headers.get(BEARER_TRANSPORT_HEADER, "")
    return header.strip().lower() == "bearer"


# ── request authentication ───────────────────────────────────────────────
def _extract_token(request: Request) -> tuple[str | None, Literal["header", "cookie", None]]:
    """Authorization header wins over cookie — explicit beats ambient."""
    authorization = request.headers.get("Authorization", "").strip()
    if authorization:
        scheme, _, value = authorization.partition(" ")
        if scheme.lower() == "bearer" and value.strip():
            return value.strip(), "header"
    cookie = request.cookies.get(SESSION_COOKIE_NAME)
    if cookie:
        return cookie, "cookie"
    return None, None


def _unauthorized(detail: str) -> HTTPException:
    return HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail=detail,
        headers={"WWW-Authenticate": "Bearer"},
    )


def get_current_user(
    request: Request,
    response: Response,
    db: Session = Depends(get_db),
) -> User:
    """Resolve the authenticated user, sliding the session window forward.

    Renewal is cookie-transport only. A Bearer caller holds a token it
    obtained at login and re-authenticates when it expires — this wave
    ships no refresh-token endpoint, and silently minting a new token
    into a response header would invent a contract nobody consumes yet.
    """
    token, transport = _extract_token(request)
    if not token:
        raise _unauthorized("not authenticated")

    try:
        payload = decode_token(token)
    except jwt.ExpiredSignatureError as e:
        raise _unauthorized("session expired") from e
    except jwt.InvalidTokenError as e:
        raise _unauthorized("invalid session") from e

    try:
        user_id = uuid.UUID(str(payload.get("sub")))
    except (TypeError, ValueError) as e:
        raise _unauthorized("invalid session") from e

    user = db.execute(select(User).where(User.id == user_id)).scalar_one_or_none()
    if user is None:
        # Signature valid but the row is gone — a deleted account still
        # holding a token that has not expired.
        raise _unauthorized("account no longer exists")

    if transport == "cookie":
        fresh, _ = issue_token(user)
        set_session_cookie(response, fresh)

    return user
