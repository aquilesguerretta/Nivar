"""Neutral Resend transport primitives for Advisory product email."""

from __future__ import annotations

from dataclasses import dataclass

import httpx


DEFAULT_RESEND_API_URL = "https://api.resend.com/emails"


class AdvisoryEmailDeliveryError(RuntimeError):
    pass


@dataclass(frozen=True)
class AdvisoryEmailReceipt:
    provider_id: str


def send_transactional_email(
    *,
    api_key: str,
    api_url: str,
    sender: str,
    reply_to: str,
    to: str,
    subject: str,
    text: str,
    html_body: str,
    idempotency_key: str,
    user_agent: str,
    client: httpx.Client | None = None,
) -> AdvisoryEmailReceipt:
    payload = {
        "from": sender,
        "to": [to],
        "subject": subject,
        "text": text,
        "html": html_body,
        "reply_to": reply_to,
    }
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json",
        "Idempotency-Key": idempotency_key,
        "User-Agent": user_agent,
    }

    owns_client = client is None
    http = client or httpx.Client(timeout=10.0)
    try:
        response = http.post(api_url, headers=headers, json=payload)
    except httpx.HTTPError as exc:
        raise AdvisoryEmailDeliveryError(
            f"Resend request failed: {exc}"
        ) from exc
    finally:
        if owns_client:
            http.close()

    if response.status_code < 200 or response.status_code >= 300:
        detail = response.text.strip().replace("\n", " ")[:500]
        raise AdvisoryEmailDeliveryError(
            f"Resend returned HTTP {response.status_code}: "
            f"{detail or 'empty response'}"
        )
    try:
        provider_id = str(response.json()["id"]).strip()
    except (ValueError, KeyError, TypeError) as exc:
        raise AdvisoryEmailDeliveryError(
            "Resend response did not contain an email id"
        ) from exc
    if not provider_id:
        raise AdvisoryEmailDeliveryError(
            "Resend response contained an empty email id"
        )
    return AdvisoryEmailReceipt(provider_id=provider_id)


__all__ = [
    "DEFAULT_RESEND_API_URL",
    "AdvisoryEmailDeliveryError",
    "AdvisoryEmailReceipt",
    "send_transactional_email",
]
