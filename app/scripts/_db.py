"""Shared helpers for database ingest scripts."""

from __future__ import annotations

import os

import psycopg2


def connect():
    url = os.environ.get("DATABASE_URL", "").strip()
    if not url:
        raise RuntimeError("DATABASE_URL is not set")
    if url.startswith("postgres://"):
        url = "postgresql://" + url[len("postgres://") :]
    return psycopg2.connect(url)
