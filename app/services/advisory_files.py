"""Neutral bounded-file primitives for manually reviewed Advisory products."""

from __future__ import annotations

import hashlib
import os
import re
from dataclasses import dataclass
from pathlib import PurePath
from urllib.parse import quote

from fastapi import UploadFile


PDF_CONTENT_TYPE = "application/pdf"
IMAGE_CONTENT_TYPES = frozenset({"image/jpeg", "image/png", "image/webp"})
PDF_OR_IMAGE_CONTENT_TYPES = frozenset({PDF_CONTENT_TYPE, *IMAGE_CONTENT_TYPES})

_CONTROL_CHARS = re.compile(r"[\x00-\x1f\x7f]")
_GENERIC_CONTENT_TYPES = {"", "application/octet-stream"}


class InvalidAdvisoryUpload(ValueError):
    def __init__(self, detail: str, *, status_code: int = 422):
        super().__init__(detail)
        self.detail = detail
        self.status_code = status_code


@dataclass(frozen=True)
class StoredAdvisoryUpload:
    filename: str
    content_type: str
    size_bytes: int
    sha256: str
    data: bytes


def positive_env_int(name: str, default: int) -> int:
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


def safe_filename(filename: str | None, fallback: str) -> str:
    leaf = PurePath((filename or "").replace("\\", "/")).name
    leaf = _CONTROL_CHARS.sub("", leaf).strip().strip(".")
    if not leaf:
        leaf = fallback
    return leaf[:255]


def download_headers(filename: str) -> dict[str, str]:
    safe_ascii = "".join(
        char if 32 <= ord(char) < 127 and char not in '"\\' else "_"
        for char in filename
    )
    return {
        "Content-Disposition": (
            f"attachment; filename=\"{safe_ascii}\"; "
            f"filename*=UTF-8''{quote(filename)}"
        ),
        "X-Content-Type-Options": "nosniff",
        "Cache-Control": "private, no-store",
    }


def detected_content_type(data: bytes) -> str | None:
    if data.startswith(b"%PDF-"):
        return PDF_CONTENT_TYPE
    if data.startswith(b"\xff\xd8\xff"):
        return "image/jpeg"
    if data.startswith(b"\x89PNG\r\n\x1a\n"):
        return "image/png"
    if len(data) >= 12 and data[:4] == b"RIFF" and data[8:12] == b"WEBP":
        return "image/webp"
    return None


async def read_bounded(upload: UploadFile, max_bytes: int) -> bytes:
    try:
        data = await upload.read(max_bytes + 1)
    finally:
        await upload.close()
    if not data:
        raise InvalidAdvisoryUpload("uploaded file is empty")
    if len(data) > max_bytes:
        raise InvalidAdvisoryUpload(
            f"uploaded file exceeds the {max_bytes}-byte limit",
            status_code=413,
        )
    return data


def validated_content_type(
    *,
    declared: str | None,
    detected: str | None,
    allowed: frozenset[str],
    expected_label: str,
) -> str:
    normalized = (declared or "").split(";", 1)[0].strip().lower()
    if detected is None or detected not in allowed:
        raise InvalidAdvisoryUpload(
            f"unsupported file: expected {expected_label}",
            status_code=415,
        )
    if normalized not in _GENERIC_CONTENT_TYPES and normalized != detected:
        raise InvalidAdvisoryUpload(
            f"declared content type '{normalized}' does not match file signature "
            f"'{detected}'",
            status_code=415,
        )
    return detected


async def read_advisory_upload(
    upload: UploadFile,
    *,
    max_bytes: int,
    allowed: frozenset[str],
    expected_label: str,
    fallback_filename: str,
) -> StoredAdvisoryUpload:
    data = await read_bounded(upload, max_bytes)
    content_type = validated_content_type(
        declared=upload.content_type,
        detected=detected_content_type(data),
        allowed=allowed,
        expected_label=expected_label,
    )
    return StoredAdvisoryUpload(
        filename=safe_filename(upload.filename, fallback_filename),
        content_type=content_type,
        size_bytes=len(data),
        sha256=hashlib.sha256(data).hexdigest(),
        data=data,
    )


__all__ = [
    "IMAGE_CONTENT_TYPES",
    "PDF_CONTENT_TYPE",
    "PDF_OR_IMAGE_CONTENT_TYPES",
    "InvalidAdvisoryUpload",
    "StoredAdvisoryUpload",
    "detected_content_type",
    "download_headers",
    "positive_env_int",
    "read_advisory_upload",
    "read_bounded",
    "safe_filename",
    "validated_content_type",
]
