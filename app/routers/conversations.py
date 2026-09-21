"""Platform messaging — human-to-human threads, any entitled product.

Not the Anthropic proxy. Role is derived from the caller: customer
endpoints always insert ``customer``; operator endpoints always insert
``operator``. ``origin_kind`` / ``origin_id`` is an opaque pair except
when the kind is the Diagnóstico submission this wave owns, in which
case ownership of the case is checked in-process — still no FK.
"""

from __future__ import annotations

import uuid

from fastapi import APIRouter, Depends, HTTPException, Path, status
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field, field_validator, model_validator
from sqlalchemy import func, select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.db.models.conversation import (
    ORIGIN_DIAGNOSTICO_SUBMISSION,
    Conversation,
    Message,
)
from app.db.models.diagnostico import DiagnosticoEnergeticoSubmission
from app.db.models.product_access import PRODUCT_IDS, ProductAccess
from app.db.models.user import User
from app.db.session import get_db
from app.services.advisory_operator import (
    is_advisory_operator,
    require_advisory_operator,
)
from app.services.auth_service import get_current_user


router = APIRouter(prefix="/api/conversations", tags=["conversations"])
operator_router = APIRouter(
    prefix="/api/operator/conversations",
    tags=["operator-conversations"],
)

_BODY_MAX = 8000
_SUBJECT_MAX = 200
_ORIGIN_KIND_MAX = 80


class CreateConversationRequest(BaseModel):
    product_id: str = Field(alias="productId")
    origin_kind: str | None = Field(default=None, alias="originKind")
    origin_id: uuid.UUID | None = Field(default=None, alias="originId")
    subject: str | None = None
    body: str | None = None

    model_config = {"populate_by_name": True}

    @field_validator("product_id")
    @classmethod
    def product_ok(cls, value: str) -> str:
        product_id = value.strip().lower()
        if product_id not in PRODUCT_IDS:
            raise ValueError(f"unknown product '{product_id}'")
        return product_id

    @field_validator("origin_kind")
    @classmethod
    def kind_ok(cls, value: str | None) -> str | None:
        if value is None:
            return None
        text = value.strip()
        if not text:
            return None
        if len(text) > _ORIGIN_KIND_MAX:
            raise ValueError(
                f"originKind must be at most {_ORIGIN_KIND_MAX} characters"
            )
        return text

    @field_validator("subject")
    @classmethod
    def subject_ok(cls, value: str | None) -> str | None:
        if value is None:
            return None
        text = value.strip()
        if not text:
            return None
        if len(text) > _SUBJECT_MAX:
            raise ValueError(f"subject must be at most {_SUBJECT_MAX} characters")
        return text

    @field_validator("body")
    @classmethod
    def body_ok(cls, value: str | None) -> str | None:
        if value is None:
            return None
        text = value.strip()
        if not text:
            return None
        if len(text) > _BODY_MAX:
            raise ValueError(f"body must be at most {_BODY_MAX} characters")
        return text

    @model_validator(mode="after")
    def origin_pair(self) -> CreateConversationRequest:
        kind, origin = self.origin_kind, self.origin_id
        if (kind is None) != (origin is None):
            raise ValueError("originKind and originId must be sent together")
        return self


class CreateMessageRequest(BaseModel):
    body: str

    @field_validator("body")
    @classmethod
    def body_ok(cls, value: str) -> str:
        text = value.strip()
        if not text:
            raise ValueError("body is required")
        if len(text) > _BODY_MAX:
            raise ValueError(f"body must be at most {_BODY_MAX} characters")
        return text


def _require_entitlement(db: Session, user: User, product_id: str) -> None:
    access_id = db.execute(
        select(ProductAccess.id).where(
            ProductAccess.user_id == user.id,
            ProductAccess.product_id == product_id,
        )
    ).scalar_one_or_none()
    if access_id is None:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f"product '{product_id}' is not active for this account",
        )


def _require_any_entitlement(db: Session, user: User) -> None:
    access_id = db.execute(
        select(ProductAccess.id).where(ProductAccess.user_id == user.id).limit(1)
    ).scalar_one_or_none()
    if access_id is None:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="messaging requires an active product on this account",
        )


def _message_payload(row: Message) -> dict:
    return {
        "id": str(row.id),
        "conversationId": str(row.conversation_id),
        "authorUserId": str(row.author_user_id),
        "role": row.role,
        "body": row.body,
        "createdAt": row.created_at.isoformat(),
    }


def _conversation_payload(
    row: Conversation,
    *,
    messages: list[Message] | None = None,
    message_count: int | None = None,
) -> dict:
    payload = {
        "id": str(row.id),
        "userId": str(row.user_id),
        "productId": row.product_id,
        "status": row.status,
        "subject": row.subject,
        "originKind": row.origin_kind,
        "originId": str(row.origin_id) if row.origin_id else None,
        "createdAt": row.created_at.isoformat(),
        "updatedAt": row.updated_at.isoformat(),
    }
    if messages is not None:
        payload["messages"] = [_message_payload(item) for item in messages]
        payload["messageCount"] = len(messages)
    elif message_count is not None:
        payload["messageCount"] = message_count
    return payload


def _require_visible_conversation(
    db: Session,
    conversation_id: uuid.UUID,
    user: User,
) -> Conversation:
    row = db.execute(
        select(Conversation).where(Conversation.id == conversation_id)
    ).scalar_one_or_none()
    if row is None or (
        row.user_id != user.id and not is_advisory_operator(user)
    ):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="conversation not found",
        )
    return row


def _messages_for(db: Session, conversation_id: uuid.UUID) -> list[Message]:
    return list(
        db.execute(
            select(Message)
            .where(Message.conversation_id == conversation_id)
            .order_by(Message.created_at.asc())
        ).scalars()
    )


def _verify_diagnostico_origin(
    db: Session, user: User, origin_id: uuid.UUID
) -> None:
    case = db.execute(
        select(DiagnosticoEnergeticoSubmission.id).where(
            DiagnosticoEnergeticoSubmission.id == origin_id,
            DiagnosticoEnergeticoSubmission.user_id == user.id,
        )
    ).scalar_one_or_none()
    if case is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="submission not found",
        )


def _append_message(
    db: Session,
    conversation: Conversation,
    *,
    author: User,
    role: str,
    body: str,
) -> Message:
    if conversation.status != "open":
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="conversation is closed",
        )
    row = Message(
        conversation_id=conversation.id,
        author_user_id=author.id,
        role=role,
        body=body,
    )
    db.add(row)
    conversation.updated_at = func.now()
    db.commit()
    db.refresh(row)
    db.refresh(conversation)
    return row


@router.post("", status_code=status.HTTP_201_CREATED)
def open_conversation(
    body: CreateConversationRequest,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    _require_entitlement(db, user, body.product_id)
    if (
        body.origin_kind == ORIGIN_DIAGNOSTICO_SUBMISSION
        and body.origin_id is not None
    ):
        if body.product_id != "diagnostico-energetico":
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail="diagnostico origin requires productId diagnostico-energetico",
            )
        _verify_diagnostico_origin(db, user, body.origin_id)

    existing = None
    if body.origin_id is not None:
        existing = db.execute(
            select(Conversation).where(
                Conversation.origin_kind == body.origin_kind,
                Conversation.origin_id == body.origin_id,
            )
        ).scalar_one_or_none()
        if existing is not None:
            if existing.user_id != user.id:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="conversation not found",
                )
            messages = _messages_for(db, existing.id)
            return JSONResponse(
                status_code=status.HTTP_200_OK,
                content={
                    **_conversation_payload(existing, messages=messages),
                    "alreadyOpen": True,
                },
            )

    conversation = Conversation(
        user_id=user.id,
        product_id=body.product_id,
        status="open",
        subject=body.subject,
        origin_kind=body.origin_kind,
        origin_id=body.origin_id,
    )
    db.add(conversation)
    try:
        db.flush()
    except IntegrityError:
        db.rollback()
        raced = db.execute(
            select(Conversation).where(
                Conversation.origin_kind == body.origin_kind,
                Conversation.origin_id == body.origin_id,
            )
        ).scalar_one()
        if raced.user_id != user.id:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="conversation not found",
            )
        messages = _messages_for(db, raced.id)
        return JSONResponse(
            status_code=status.HTTP_200_OK,
            content={
                **_conversation_payload(raced, messages=messages),
                "alreadyOpen": True,
            },
        )

    if body.body:
        db.add(
            Message(
                conversation_id=conversation.id,
                author_user_id=user.id,
                role="customer",
                body=body.body,
            )
        )
        conversation.updated_at = func.now()
    db.commit()
    db.refresh(conversation)
    messages = _messages_for(db, conversation.id)
    return {
        **_conversation_payload(conversation, messages=messages),
        "alreadyOpen": False,
    }


@router.get("")
def list_my_conversations(
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    _require_any_entitlement(db, user)
    rows = list(
        db.execute(
            select(Conversation)
            .where(Conversation.user_id == user.id)
            .order_by(Conversation.updated_at.desc())
        ).scalars()
    )
    data = [_conversation_payload(row) for row in rows]
    return {"data": data, "summary": {"count": len(data)}}


@router.get("/{conversation_id}")
def get_conversation(
    conversation_id: uuid.UUID = Path(...),
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    row = _require_visible_conversation(db, conversation_id, user)
    messages = _messages_for(db, row.id)
    return _conversation_payload(row, messages=messages)


@router.post("/{conversation_id}/messages", status_code=status.HTTP_201_CREATED)
def post_customer_message(
    body: CreateMessageRequest,
    conversation_id: uuid.UUID = Path(...),
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    conversation = _require_visible_conversation(db, conversation_id, user)
    if conversation.user_id != user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="operator access required",
        )
    row = _append_message(
        db, conversation, author=user, role="customer", body=body.body
    )
    return _message_payload(row)


@operator_router.get("")
def list_open_conversations(
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    require_advisory_operator(user)
    rows = list(
        db.execute(
            select(Conversation)
            .where(Conversation.status == "open")
            .order_by(Conversation.updated_at.desc())
        ).scalars()
    )
    data = [_conversation_payload(row) for row in rows]
    return {
        "data": data,
        "summary": {"count": len(data), "product": "any"},
    }


@operator_router.get("/{conversation_id}")
def get_operator_conversation(
    conversation_id: uuid.UUID = Path(...),
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    require_advisory_operator(user)
    row = db.execute(
        select(Conversation).where(Conversation.id == conversation_id)
    ).scalar_one_or_none()
    if row is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="conversation not found",
        )
    messages = _messages_for(db, row.id)
    return _conversation_payload(row, messages=messages)


@operator_router.post(
    "/{conversation_id}/messages",
    status_code=status.HTTP_201_CREATED,
)
def post_operator_message(
    body: CreateMessageRequest,
    conversation_id: uuid.UUID = Path(...),
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    require_advisory_operator(user)
    conversation = db.execute(
        select(Conversation).where(Conversation.id == conversation_id)
    ).scalar_one_or_none()
    if conversation is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="conversation not found",
        )
    row = _append_message(
        db, conversation, author=user, role="operator", body=body.body
    )
    return _message_payload(row)
