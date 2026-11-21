"""ORM models — US infrastructure (PostGIS)."""

from __future__ import annotations

from datetime import date

from geoalchemy2 import Geometry
from sqlalchemy import Date, Integer, Numeric, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base


class GenerationUnit(Base):
    __tablename__ = "generation_units"

    id: Mapped[str] = mapped_column(Text, primary_key=True)
    eia_plant_id: Mapped[int | None] = mapped_column(Integer, nullable=True)
    eia_generator_id: Mapped[str | None] = mapped_column(Text, nullable=True)
    name: Mapped[str] = mapped_column(Text, nullable=False)
    owner: Mapped[str | None] = mapped_column(Text, nullable=True)
    iso: Mapped[str] = mapped_column(Text, nullable=False)  # IsoMarket code
    state: Mapped[str] = mapped_column(Text, nullable=False)
    fuel: Mapped[str] = mapped_column(Text, nullable=False)
    capacity_mw: Mapped[float] = mapped_column(Numeric(10, 2), nullable=False)
    status: Mapped[str] = mapped_column(Text, nullable=False)
    cod_date: Mapped[date | None] = mapped_column(Date, nullable=True)
    retirement_date: Mapped[date | None] = mapped_column(Date, nullable=True)
    geom: Mapped[object] = mapped_column(
        Geometry(geometry_type="POINT", srid=4326),
        nullable=False,
    )


class TransmissionSegment(Base):
    __tablename__ = "transmission_segments"

    id: Mapped[str] = mapped_column(Text, primary_key=True)
    voltage_kv: Mapped[int] = mapped_column(Integer, nullable=False)
    name: Mapped[str | None] = mapped_column(Text, nullable=True)
    owner: Mapped[str | None] = mapped_column(Text, nullable=True)
    iso: Mapped[str] = mapped_column(Text, nullable=False)
    segment_length_km: Mapped[float] = mapped_column(Numeric(10, 2), nullable=False)
    geom: Mapped[object] = mapped_column(
        Geometry(geometry_type="LINESTRING", srid=4326),
        nullable=False,
    )
    geom_mid: Mapped[object] = mapped_column(
        Geometry(geometry_type="LINESTRING", srid=4326),
        nullable=False,
    )
    geom_low: Mapped[object] = mapped_column(
        Geometry(geometry_type="LINESTRING", srid=4326),
        nullable=False,
    )


class BatteryAsset(Base):
    __tablename__ = "battery_assets"

    id: Mapped[str] = mapped_column(Text, primary_key=True)
    eia_plant_id: Mapped[int | None] = mapped_column(Integer, nullable=True)
    eia_generator_id: Mapped[str | None] = mapped_column(Text, nullable=True)
    name: Mapped[str] = mapped_column(Text, nullable=False)
    owner: Mapped[str | None] = mapped_column(Text, nullable=True)
    iso: Mapped[str] = mapped_column(Text, nullable=False)
    state: Mapped[str] = mapped_column(Text, nullable=False)
    capacity_mw: Mapped[float] = mapped_column(Numeric(10, 2), nullable=False)
    capacity_mwh: Mapped[float | None] = mapped_column(Numeric(12, 2), nullable=True)
    duration_hours: Mapped[float | None] = mapped_column(Numeric(6, 2), nullable=True)
    status: Mapped[str] = mapped_column(Text, nullable=False)
    cod_date: Mapped[date | None] = mapped_column(Date, nullable=True)
    retirement_date: Mapped[date | None] = mapped_column(Date, nullable=True)
    geom: Mapped[object] = mapped_column(
        Geometry(geometry_type="POINT", srid=4326),
        nullable=False,
    )
