"""GET /api/infra/transmission — viewport query with LOD geometry (PostGIS)."""

from __future__ import annotations

import json
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import and_, func, select
from sqlalchemy.orm import Session
from geoalchemy2.functions import ST_Intersects, ST_MakeEnvelope

from app.db.session import get_db
from app.db.models.infrastructure import TransmissionSegment
from app.services.envelope import build_envelope

router = APIRouter()

ISO_SET = frozenset(
    {"PJM", "MISO", "NYISO", "ISO-NE", "CAISO", "SPP", "ERCOT", "WECC", "AK", "QC", "OTHER"}
)

LOD_DEFAULT_VOLT = {"low": 345, "mid": 230, "high": 115}


def _parse_bbox(bbox: str) -> tuple[float, float, float, float]:
    parts = [p.strip() for p in bbox.split(",")]
    if len(parts) != 4:
        raise HTTPException(
            status_code=422, detail="bbox must be min_lon,min_lat,max_lon,max_lat"
        )
    try:
        min_lon, min_lat, max_lon, max_lat = (
            float(parts[0]),
            float(parts[1]),
            float(parts[2]),
            float(parts[3]),
        )
    except ValueError as e:
        raise HTTPException(status_code=422, detail="bbox values must be floats") from e
    if not (-180 <= min_lon <= 180 and -180 <= max_lon <= 180):
        raise HTTPException(status_code=422, detail="longitude out of range")
    if not (-90 <= min_lat <= 90 and -90 <= max_lat <= 90):
        raise HTTPException(status_code=422, detail="latitude out of range")
    if max_lon <= min_lon or max_lat <= min_lat:
        raise HTTPException(
            status_code=422, detail="bbox requires max_lon > min_lon and max_lat > min_lat"
        )
    return min_lon, min_lat, max_lon, max_lat


def _validate_iso(values: list[str] | None) -> None:
    if not values:
        return
    bad = [v for v in values if v not in ISO_SET]
    if bad:
        raise HTTPException(
            status_code=422,
            detail=f"unknown iso: {', '.join(bad)}",
        )


@router.get("/transmission")
def transmission(
    bbox: str = Query(..., description="min_lon,min_lat,max_lon,max_lat"),
    lod: str = Query(..., pattern="^(low|mid|high)$"),
    voltage_min_kv: int | None = Query(None, ge=1),
    voltage_max_kv: int | None = Query(None, ge=1),
    iso: Annotated[list[str] | None, Query()] = None,
    limit: int = Query(10000, ge=1, le=10000),
    db: Session = Depends(get_db),
):
    _validate_iso(iso)
    min_lon, min_lat, max_lon, max_lat = _parse_bbox(bbox)
    vmin = voltage_min_kv if voltage_min_kv is not None else LOD_DEFAULT_VOLT[lod]
    vmax = voltage_max_kv
    if vmax is not None and vmax < vmin:
        raise HTTPException(
            status_code=422, detail="voltage_max_kv must be >= voltage_min_kv"
        )

    geom_col = TransmissionSegment.geom_low if lod == "low" else (
        TransmissionSegment.geom_mid if lod == "mid" else TransmissionSegment.geom
    )
    envelope = ST_MakeEnvelope(min_lon, min_lat, max_lon, max_lat, 4326)

    filters = [
        ST_Intersects(geom_col, envelope),
        TransmissionSegment.voltage_kv >= vmin,
    ]
    if vmax is not None:
        filters.append(TransmissionSegment.voltage_kv <= vmax)
    if iso:
        filters.append(TransmissionSegment.iso.in_(iso))

    stmt = (
        select(
            TransmissionSegment.id,
            TransmissionSegment.voltage_kv,
            TransmissionSegment.name,
            TransmissionSegment.owner,
            TransmissionSegment.iso,
            TransmissionSegment.segment_length_km,
            func.ST_AsGeoJSON(geom_col).label("gj"),
        )
        .where(and_(*filters))
        .limit(limit + 1)
    )

    rows = db.execute(stmt).all()
    truncated = len(rows) > limit
    rows = rows[:limit]

    data: list[dict] = []
    for r in rows:
        coords = json.loads(r.gj)["coordinates"]
        data.append(
            {
                "id": r.id,
                "voltageKv": int(r.voltage_kv),
                "name": r.name,
                "owner": r.owner,
                "iso": r.iso,
                "geometry": coords,
                "segmentLengthKm": float(r.segment_length_km),
            }
        )

    iso_label = ",".join(iso) if iso else "all ISOs"
    return build_envelope(
        meta={
            "source": "hifld+postgis",
            "data_age_seconds": 0,
            "count": len(data),
            "truncated": truncated,
            "bbox": bbox,
            "lod": lod,
            "voltage_min_kv": vmin,
            "voltage_max_kv": vmax,
            "iso_filter": iso,
            "limit": limit,
        },
        data=data,
        summary=f"{len(data):,} transmission segments in viewport ({iso_label}, lod={lod}, ≥{vmin} kV).",
    )
