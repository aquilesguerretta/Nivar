"""Resend-backed transactional email for Conta de Luz Express."""

from __future__ import annotations

import html
import os
import uuid
from dataclasses import dataclass

import httpx


DEFAULT_RESEND_API_URL = "https://api.resend.com/emails"


class EmailConfigurationError(RuntimeError):
    pass


class EmailDeliveryError(RuntimeError):
    pass


@dataclass(frozen=True)
class EmailConfig:
    api_key: str
    sender: str
    operator_email: str
    app_base_url: str
    api_url: str


@dataclass(frozen=True)
class EmailReceipt:
    provider_id: str


def _required_env(name: str) -> str:
    value = os.environ.get(name, "").strip()
    if not value:
        raise EmailConfigurationError(f"{name} is not configured")
    return value


def email_config() -> EmailConfig:
    base_url = _required_env("CLE_APP_BASE_URL").rstrip("/")
    if not base_url.startswith(("https://", "http://")):
        raise EmailConfigurationError("CLE_APP_BASE_URL must be an absolute HTTP(S) URL")
    operator = _required_env("ADVISORY_OPERATOR_EMAIL").lower()
    if "@" not in operator:
        raise EmailConfigurationError(
            "ADVISORY_OPERATOR_EMAIL must be an email address"
        )
    return EmailConfig(
        api_key=_required_env("RESEND_API_KEY"),
        sender=_required_env("CLE_EMAIL_FROM"),
        operator_email=operator,
        app_base_url=base_url,
        api_url=os.environ.get("CLE_RESEND_API_URL", "").strip()
        or DEFAULT_RESEND_API_URL,
    )


def operator_email() -> str:
    """Return the configured operator identity without requiring all email config."""
    return os.environ.get("ADVISORY_OPERATOR_EMAIL", "").strip().lower()


def send_transactional_email(
    *,
    config: EmailConfig,
    to: str,
    subject: str,
    text: str,
    html_body: str,
    idempotency_key: str,
    client: httpx.Client | None = None,
) -> EmailReceipt:
    payload = {
        "from": config.sender,
        "to": [to],
        "subject": subject,
        "text": text,
        "html": html_body,
        "reply_to": config.operator_email,
    }
    headers = {
        "Authorization": f"Bearer {config.api_key}",
        "Content-Type": "application/json",
        "Idempotency-Key": idempotency_key,
        "User-Agent": "NIVAR-Conta-Luz-Express/1.0",
    }

    owns_client = client is None
    http = client or httpx.Client(timeout=10.0)
    try:
        response = http.post(config.api_url, headers=headers, json=payload)
    except httpx.HTTPError as exc:
        raise EmailDeliveryError(f"Resend request failed: {exc}") from exc
    finally:
        if owns_client:
            http.close()

    if response.status_code < 200 or response.status_code >= 300:
        detail = response.text.strip().replace("\n", " ")[:500]
        raise EmailDeliveryError(
            f"Resend returned HTTP {response.status_code}: {detail or 'empty response'}"
        )
    try:
        provider_id = str(response.json()["id"]).strip()
    except (ValueError, KeyError, TypeError) as exc:
        raise EmailDeliveryError("Resend response did not contain an email id") from exc
    if not provider_id:
        raise EmailDeliveryError("Resend response contained an empty email id")
    return EmailReceipt(provider_id=provider_id)


def notify_operator_new_submission(
    *,
    config: EmailConfig,
    submission_id: uuid.UUID,
    customer_name: str,
    customer_email: str,
    source_filename: str,
    client: httpx.Client | None = None,
) -> EmailReceipt:
    submission_url = (
        f"{config.app_base_url}/api/conta-luz-express/submissions/{submission_id}"
    )
    source_url = f"{submission_url}/source"
    text = (
        "Nova submissão no Conta de Luz Express.\n\n"
        f"Cliente: {customer_name} <{customer_email}>\n"
        f"Arquivo: {source_filename}\n"
        f"Submissão: {submission_id}\n"
        f"Revisar: {submission_url}\n"
        f"Baixar arquivo: {source_url}\n"
    )
    html_body = (
        "<h1>Nova submissão no Conta de Luz Express</h1>"
        f"<p><strong>Cliente:</strong> {html.escape(customer_name)} "
        f"&lt;{html.escape(customer_email)}&gt;</p>"
        f"<p><strong>Arquivo:</strong> {html.escape(source_filename)}</p>"
        f"<p><strong>Submissão:</strong> {submission_id}</p>"
        f'<p><a href="{html.escape(submission_url, quote=True)}">Revisar submissão</a></p>'
        f'<p><a href="{html.escape(source_url, quote=True)}">Baixar arquivo original</a></p>'
    )
    return send_transactional_email(
        config=config,
        to=config.operator_email,
        subject="Nova conta de luz para revisar",
        text=text,
        html_body=html_body,
        idempotency_key=f"cle-submission-{submission_id}",
        client=client,
    )


def notify_customer_deliverable_ready(
    *,
    config: EmailConfig,
    submission_id: uuid.UUID,
    customer_name: str,
    customer_email: str,
    client: httpx.Client | None = None,
) -> EmailReceipt:
    profile_url = f"{config.app_base_url}/conta-de-luz-express"
    download_url = (
        f"{config.app_base_url}/api/conta-luz-express/submissions/"
        f"{submission_id}/deliverable"
    )
    text = (
        f"Olá, {customer_name}.\n\n"
        "Seu relatório do Conta de Luz Express está pronto.\n"
        f"Ver no perfil: {profile_url}\n"
        f"Baixar PDF: {download_url}\n"
    )
    html_body = (
        f"<p>Olá, {html.escape(customer_name)}.</p>"
        "<p>Seu relatório do <strong>Conta de Luz Express</strong> está pronto.</p>"
        f'<p><a href="{html.escape(profile_url, quote=True)}">Ver no perfil</a></p>'
        f'<p><a href="{html.escape(download_url, quote=True)}">Baixar PDF</a></p>'
    )
    return send_transactional_email(
        config=config,
        to=customer_email,
        subject="Seu relatório do Conta de Luz Express está pronto",
        text=text,
        html_body=html_body,
        idempotency_key=f"cle-ready-{submission_id}",
        client=client,
    )


__all__ = [
    "EmailConfig",
    "EmailConfigurationError",
    "EmailDeliveryError",
    "EmailReceipt",
    "email_config",
    "notify_customer_deliverable_ready",
    "notify_operator_new_submission",
    "operator_email",
    "send_transactional_email",
]
