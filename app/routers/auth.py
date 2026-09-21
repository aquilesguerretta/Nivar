"""Platform identity — email/password authentication (Wave 9).

Responses are plain JSON, not the Wave-5 {meta, data, summary} envelope.
That envelope exists to carry data-freshness affordances (``timestamp``,
``data_age_seconds``) for market and infrastructure reads; none of it
means anything for an identity call, and the whole identity domain is
kept on one shape rather than split mid-domain.

Google OAuth (``/api/auth/google/*``) is deliberately absent: Wave 9's
audit found no GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET in the Railway
environment, and the brief forbids a placeholder that pretends to work.
"""

from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, Request, Response, status
from pydantic import BaseModel, EmailStr, Field
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.db.models.user import User
from app.db.session import get_db
from app.services.auth_service import (
    clear_session_cookie,
    get_current_user,
    hash_password,
    issue_token,
    needs_rehash,
    normalize_email,
    set_session_cookie,
    verify_password,
    wants_bearer_transport,
)

router = APIRouter(prefix="/api/auth", tags=["auth"])

# 8 is the NIST floor. The ceiling is a denial-of-service guard: Argon2id
# hashing cost scales with input, so an unbounded field is an attack.
_MIN_PASSWORD = 8
_MAX_PASSWORD = 1024


class SignupRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=_MIN_PASSWORD, max_length=_MAX_PASSWORD)
    name: str = Field(min_length=1, max_length=200)


class LoginRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=1, max_length=_MAX_PASSWORD)


def user_payload(user: User) -> dict:
    methods = []
    if user.password_hash:
        methods.append("password")
    if user.google_id:
        methods.append("google")
    return {
        "id": str(user.id),
        "email": user.email,
        "name": user.name,
        "authMethods": methods,
        "createdAt": user.created_at.isoformat(),
        "updatedAt": user.updated_at.isoformat(),
    }


def _establish_session(request: Request, response: Response, user: User) -> dict:
    token, expires_at = issue_token(user)
    set_session_cookie(response, token)
    body = {"user": user_payload(user), "expiresAt": expires_at.isoformat()}
    # Cookie-only by default, so a browser payload holds nothing XSS can
    # lift. Native and cross-domain callers opt in and read it themselves.
    if wants_bearer_transport(request):
        body["token"] = token
    return body


@router.post("/signup", status_code=status.HTTP_201_CREATED)
def signup(
    payload: SignupRequest,
    request: Request,
    response: Response,
    db: Session = Depends(get_db),
):
    email = normalize_email(payload.email)
    name = payload.name.strip()
    if not name:
        raise HTTPException(status_code=422, detail="name must not be blank")

    existing = db.execute(select(User).where(User.email == email)).scalar_one_or_none()
    if existing is not None:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="email already registered")

    user = User(email=email, name=name, password_hash=hash_password(payload.password))
    db.add(user)
    try:
        db.commit()
    except IntegrityError as e:
        # Two signups for the same address raced past the check above; the
        # UNIQUE constraint is what actually guarantees one account.
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT, detail="email already registered"
        ) from e
    db.refresh(user)

    return _establish_session(request, response, user)


@router.post("/login")
def login(
    payload: LoginRequest,
    request: Request,
    response: Response,
    db: Session = Depends(get_db),
):
    email = normalize_email(payload.email)
    user = db.execute(select(User).where(User.email == email)).scalar_one_or_none()

    # One message for every failure mode — unknown address, wrong password,
    # and Google-only account must be indistinguishable, or the endpoint
    # becomes an oracle for which addresses are registered.
    invalid = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED, detail="invalid email or password"
    )
    if user is None or not user.password_hash:
        raise invalid
    if not verify_password(user.password_hash, payload.password):
        raise invalid

    if needs_rehash(user.password_hash):
        user.password_hash = hash_password(payload.password)
        db.commit()
        db.refresh(user)

    return _establish_session(request, response, user)


@router.post("/logout")
def logout(response: Response):
    """Clear the session cookie.

    The token is stateless by design, so this revokes the browser's copy
    and nothing else: a Bearer token already in a caller's hands stays
    valid until it expires. Real revocation needs a denylist or short
    access tokens plus refresh — neither is in this wave's scope.
    """
    clear_session_cookie(response)
    return {"ok": True}


@router.get("/me")
def me(user: User = Depends(get_current_user)):
    return {"user": user_payload(user)}
