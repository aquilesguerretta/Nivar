"""Resend-backed transactional email for Solar Proposal Validator."""

from __future__ import annotations

import html
import os
import uuid
from dataclasses import dataclass

import httpx

from app.services.advisory_email import (
    DEFAULT_RESEND_API_URL,
    AdvisoryEmailDeliveryError,
    AdvisoryEmailReceipt,
    send_transactional_email,
)


class SolarEmailConfigurationError(RuntimeError):
    pass


@dataclass(frozen=True)
class SolarEmailConfig:
    api_key: str
    sender: str
    operator_email: str
    app_base_url: str
    api_url: str


def _required_env(name: str) -> str:
    value = os.environ.get(name, "").strip()
    if not value:
        raise SolarEmailConfigurationError(f"{name} is not configured")
    return value


def email_config() -> SolarEmailConfig:
    base_url = _required_env("SPV_APP_BASE_URL").rstrip("/")
    if not base_url.startswith(("https://", "http://")):
        raise SolarEmailConfigurationError(
            "SPV_APP_BASE_URL must be an absolute HTTP(S) URL"
        )
    operator = _required_env("ADVISORY_OPERATOR_EMAIL").lower()
    if "@" not in operator:
        raise SolarEmailConfigurationError(
            "ADVISORY_OPERATOR_EMAIL must be an email address"
        )
    return SolarEmailConfig(
        api_key=_required_env("RESEND_API_KEY"),
        sender=_required_env("SPV_EMAIL_FROM"),
        operator_email=operator,
        app_base_url=base_url,
        api_url=os.environ.get("SPV_RESEND_API_URL", "").strip()
        or DEFAULT_RESEND_API_URL,
    )


def operator_email() -> str:
    """Return the shared Advisory operator without requiring email delivery config."""
    return os.environ.get("ADVISORY_OPERATOR_EMAIL", "").strip().lower()


def _send(
    *,
    config: SolarEmailConfig,
    to: str,
    subject: str,
    text: str,
    html_body: str,
    idempotency_key: str,
    client: httpx.Client | None,
) -> AdvisoryEmailReceipt:
    return send_transactional_email(
        api_key=config.api_key,
        api_url=config.api_url,
        sender=config.sender,
        reply_to=config.operator_email,
        to=to,
        subject=subject,
        text=text,
        html_body=html_body,
        idempotency_key=idempotency_key,
        user_agent="NIVAR-Solar-Proposal-Validator/1.0",
        client=client,
    )


def notify_operator_new_submission(
    *,
    config: SolarEmailConfig,
    submission_id: uuid.UUID,
    customer_name: str,
    customer_email: str,
    source_filename: str,
    client: httpx.Client | None = None,
) -> AdvisoryEmailReceipt:
    submission_url = (
        f"{config.app_base_url}/api/solar-proposal-validator/submissions/"
        f"{submission_id}"
    )
    source_url = f"{submission_url}/source"
    text = (
        "Nova submissão no Solar Proposal Validator.\n\n"
        f"Cliente: {customer_name} <{customer_email}>\n"
        f"Arquivo: {source_filename}\n"
        f"Submissão: {submission_id}\n"
        f"Revisar: {submission_url}\n"
        f"Baixar proposta: {source_url}\n"
    )
    html_body = (
        "<h1>Nova submissão no Solar Proposal Validator</h1>"
        f"<p><strong>Cliente:</strong> {html.escape(customer_name)} "
        f"&lt;{html.escape(customer_email)}&gt;</p>"
        f"<p><strong>Arquivo:</strong> {html.escape(source_filename)}</p>"
        f"<p><strong>Submissão:</strong> {submission_id}</p>"
        f'<p><a href="{html.escape(submission_url, quote=True)}">'
        "Revisar submissão</a></p>"
        f'<p><a href="{html.escape(source_url, quote=True)}">'
        "Baixar proposta original</a></p>"
    )
    return _send(
        config=config,
        to=config.operator_email,
        subject="Nova proposta solar para revisar",
        text=text,
        html_body=html_body,
        idempotency_key=f"spv-submission-{submission_id}",
        client=client,
    )


def notify_customer_deliverable_ready(
    *,
    config: SolarEmailConfig,
    submission_id: uuid.UUID,
    customer_name: str,
    customer_email: str,
    client: httpx.Client | None = None,
) -> AdvisoryEmailReceipt:
    profile_url = f"{config.app_base_url}/solar-proposal-validator"
    download_url = (
        f"{config.app_base_url}/api/solar-proposal-validator/submissions/"
        f"{submission_id}/deliverable"
    )
    text = (
        f"Olá, {customer_name}.\n\n"
        "Seu relatório do Solar Proposal Validator está pronto.\n"
        f"Ver no produto: {profile_url}\n"
        f"Baixar PDF: {download_url}\n"
    )
    html_body = (
        f"<p>Olá, {html.escape(customer_name)}.</p>"
        "<p>Seu relatório do <strong>Solar Proposal Validator</strong> "
        "está pronto.</p>"
        f'<p><a href="{html.escape(profile_url, quote=True)}">'
        "Ver no produto</a></p>"
        f'<p><a href="{html.escape(download_url, quote=True)}">'
        "Baixar PDF</a></p>"
    )
    return _send(
        config=config,
        to=customer_email,
        subject="Seu relatório do Solar Proposal Validator está pronto",
        text=text,
        html_body=html_body,
        idempotency_key=f"spv-ready-{submission_id}",
        client=client,
    )


__all__ = [
    "AdvisoryEmailDeliveryError",
    "AdvisoryEmailReceipt",
    "SolarEmailConfig",
    "SolarEmailConfigurationError",
    "email_config",
    "notify_customer_deliverable_ready",
    "notify_operator_new_submission",
    "operator_email",
]
