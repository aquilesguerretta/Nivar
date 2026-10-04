"""Bounded PostgreSQL-backed file intake for Conta de Luz Express V1."""

from __future__ import annotations

import hashlib
import os
import re
from dataclasses import dataclass
from pathlib import PurePath

from fastapi import UploadFile


DEFAULT_SOURCE_MAX_BYTES = 15 * 1024 * 1024
DEFAULT_DELIVERABLE_MAX_BYTES = 20 * 1024 * 1024

_CONTROL_CHARS = re.compile(r"[\x00-\x1f\x7f]")
_GENERIC_CONTENT_TYPES = {"", "application/octet-stream"}
_SOURCE_CONTENT_TYPES = {
    "application/pdf",
    "image/jpeg",
    "image/png",
    "image/webp",
}


class InvalidUpload(ValueError):
    def __init__(self, detail: str, *, status_code: int = 422):
        super().__init__(detail)
        self.detail = detail
        self.status_code = status_code


@dataclass(frozen=True)
class StoredUpload:
    filename: str
    content_type: str
    size_bytes: int
    sha256: str
    data: bytes


def _positive_env_int(name: str, default: int) -> int:
    raw = os.environ.get(name, "").strip()
    if not raw:
        return default
    try:
        value = int(raw)
    except ValueError as exc:
        raise RuntimeError(f"{name} must be an integer number of bytes") from exc
    if value <= 0:
        raise RuntimeError(f"{name} must be greater than zero")
    return value


def source_max_bytes() -> int:
    return _positive_env_int("CLE_MAX_SOURCE_BYTES", DEFAULT_SOURCE_MAX_BYTES)


def deliverable_max_bytes() -> int:
    return _positive_env_int(
        "CLE_MAX_DELIVERABLE_BYTES",
        DEFAULT_DELIVERABLE_MAX_BYTES,
    )


def _safe_filename(filename: str | None, fallback: str) -> str:
    leaf = PurePath((filename or "").replace("\\", "/")).name
    leaf = _CONTROL_CHARS.sub("", leaf).strip().strip(".")
    if not leaf:
        leaf = fallback
    return leaf[:255]


def _detected_content_type(data: bytes) -> str | None:
    if data.startswith(b"%PDF-"):
        return "application/pdf"
    if data.startswith(b"\xff\xd8\xff"):
        return "image/jpeg"
    if data.startswith(b"\x89PNG\r\n\x1a\n"):
        return "image/png"
    if len(data) >= 12 and data[:4] == b"RIFF" and data[8:12] == b"WEBP":
        return "image/webp"
    return None


async def _read_bounded(upload: UploadFile, max_bytes: int) -> bytes:
    try:
        data = await upload.read(max_bytes + 1)
    finally:
        await upload.close()
    if not data:
        raise InvalidUpload("uploaded file is empty")
    if len(data) > max_bytes:
        raise InvalidUpload(
            f"uploaded file exceeds the {max_bytes}-byte limit",
            status_code=413,
        )
    return data


def _validated_content_type(
    *,
    declared: str | None,
    detected: str | None,
    allowed: set[str],
) -> str:
    normalized = (declared or "").split(";", 1)[0].strip().lower()
    if detected is None or detected not in allowed:
        raise InvalidUpload(
            "unsupported file: expected PDF, JPEG, PNG or WebP",
            status_code=415,
        )
    if normalized not in _GENERIC_CONTENT_TYPES and normalized != detected:
        raise InvalidUpload(
            f"declared content type '{normalized}' does not match file signature '{detected}'",
            status_code=415,
        )
    return detected


async def read_source_upload(upload: UploadFile) -> StoredUpload:
    data = await _read_bounded(upload, source_max_bytes())
    detected = _detected_content_type(data)
    content_type = _validated_content_type(
        declared=upload.content_type,
        detected=detected,
        allowed=_SOURCE_CONTENT_TYPES,
    )
    return StoredUpload(
        filename=_safe_filename(upload.filename, "conta-de-luz"),
        content_type=content_type,
        size_bytes=len(data),
        sha256=hashlib.sha256(data).hexdigest(),
        data=data,
    )


async def read_deliverable_upload(upload: UploadFile) -> StoredUpload:
    data = await _read_bounded(upload, deliverable_max_bytes())
    detected = _detected_content_type(data)
    content_type = _validated_content_type(
        declared=upload.content_type,
        detected=detected,
        allowed={"application/pdf"},
    )
    return StoredUpload(
        filename=_safe_filename(upload.filename, "relatorio-conta-de-luz.pdf"),
        content_type=content_type,
        size_bytes=len(data),
        sha256=hashlib.sha256(data).hexdigest(),
        data=data,
    )


__all__ = [
    "InvalidUpload",
    "StoredUpload",
    "deliverable_max_bytes",
    "read_deliverable_upload",
    "read_source_upload",
    "source_max_bytes",
]
