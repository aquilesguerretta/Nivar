"""Alembic migration environment — PostGIS / SQLAlchemy 2."""

from __future__ import annotations

import os
from logging.config import fileConfig

from alembic import context
from sqlalchemy import engine_from_config, pool

from app.db.base import Base
from app.db.models import argos_memory as _argos_memory  # noqa: F401 — register models
from app.db.models import conta_luz as _conta_luz  # noqa: F401 — register models
from app.db.models import conversation as _conversation  # noqa: F401
from app.db.models import country_energy as _country_energy  # noqa: F401 — register models
from app.db.models import diagnostico as _diagnostico  # noqa: F401
from app.db.models import infrastructure as _infra  # noqa: F401
from app.db.models import product_access as _product_access  # noqa: F401
from app.db.models import progress as _progress  # noqa: F401
from app.db.models import solar_proposal as _solar_proposal  # noqa: F401
from app.db.models import user as _user  # noqa: F401

config = context.config
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

target_metadata = Base.metadata


def get_url() -> str:
    url = os.environ.get("DATABASE_URL", "").strip()
    if not url:
        url = config.get_main_option("sqlalchemy.url") or ""
    if url.startswith("postgres://"):
        url = "postgresql://" + url[len("postgres://") :]
    return url


def run_migrations_offline() -> None:
    url = get_url()
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )
    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online() -> None:
    configuration = config.get_section(config.config_ini_section) or {}
    configuration["sqlalchemy.url"] = get_url()
    connectable = engine_from_config(
        configuration,
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )
    with connectable.connect() as connection:
        context.configure(connection=connection, target_metadata=target_metadata)
        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
