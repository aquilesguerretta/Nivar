"""GET /api/infra/generation-units — viewport query (PostGIS)."""

from __future__ import annotations

from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import and_, func, select
from sqlalchemy.orm import Session
from geoalchemy2.functions import ST_Intersects, ST_MakeEnvelope

from app.db.session import get_db
from app.db.models.infrastructure import GenerationUnit
from app.services.envelope import build_envelope

router = APIRouter()

ISO_SET = frozenset(
    {"PJM", "MISO", "NYISO", "ISO-NE", "CAISO", "SPP", "ERCOT", "WECC", "AK", "QC", "OTHER"}
)
FUEL_SET = frozenset(
    {
        "gas",
        "coal",
        "nuclear",
        "wind",
        "solar",
        "hydro",
        "pumped",
        "biomass",
        "geothermal",
        "oil",
        "other",
    }
)
STATUS_SET = frozenset(
    {"operating", "planned", "under-construction", "standby", "retired", "cancelled"}
)


def _parse_bbox(bbox: str) -> tuple[float, float, float, float]:
    parts = [p.strip() for p in bbox.split(",")]
    if len(parts) != 4:
        raise HTTPException(
            status_code=422, detail="bbox must be min_lon,min_lat,max_lon,max_lat"
        )
    try:
        min_lon, min_lat, max_lon, max_lat = (float(parts[0]), float(parts[1]), float(parts[2]), float(parts[3]))
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


def _validate_set(name: str, values: list[str] | None, allowed: frozenset[str]) -> None:
    if not values:
        return
    bad = [v for v in values if v not in allowed]
    if bad:
        raise HTTPException(
            status_code=422,
            detail=f"unknown {name}: {', '.join(bad)}",
        )


@router.get("/generation-units")
def generation_units(
    bbox: str = Query(..., description="min_lon,min_lat,max_lon,max_lat"),
    iso: Annotated[list[str] | None, Query()] = None,
    fuel: Annotated[list[str] | None, Query()] = None,
    min_capacity_mw: float = Query(0, ge=0),
    status: str = Query("operating"),
    limit: int = Query(5000, ge=1, le=10000),
    db: Session = Depends(get_db),
):
    status = status.strip()
    _validate_set("iso", iso, ISO_SET)
    _validate_set("fuel", fuel, FUEL_SET)
    if status not in STATUS_SET:
        raise HTTPException(status_code=422, detail=f"unknown status '{status}'")
    min_lon, min_lat, max_lon, max_lat = _parse_bbox(bbox)
    envelope = ST_MakeEnvelope(min_lon, min_lat, max_lon, max_lat, 4326)

    filters = [
        ST_Intersects(GenerationUnit.geom, envelope),
        GenerationUnit.capacity_mw >= min_capacity_mw,
        GenerationUnit.status == status,
    ]
    if iso:
        filters.append(GenerationUnit.iso.in_(iso))
    if fuel:
        filters.append(GenerationUnit.fuel.in_(fuel))

    stmt = (
        select(
            GenerationUnit.id,
            GenerationUnit.eia_plant_id,
            GenerationUnit.eia_generator_id,
            GenerationUnit.name,
            GenerationUnit.owner,
            GenerationUnit.iso,
            GenerationUnit.state,
            GenerationUnit.fuel,
            GenerationUnit.capacity_mw,
            GenerationUnit.status,
            GenerationUnit.cod_date,
            GenerationUnit.retirement_date,
            func.ST_Y(GenerationUnit.geom).label("lat"),
            func.ST_X(GenerationUnit.geom).label("lon"),
        )
        .where(and_(*filters))
        .limit(limit + 1)
    )

    rows = db.execute(stmt).all()
    truncated = len(rows) > limit
    rows = rows[:limit]

    data: list[dict] = []
    for r in rows:
        cod = r.cod_date.isoformat() if r.cod_date else None
        ret = r.retirement_date.isoformat() if r.retirement_date else None
        data.append(
            {
                "id": r.id,
                "eiaPlantId": int(r.eia_plant_id) if r.eia_plant_id is not None else None,
                "eiaGeneratorId": r.eia_generator_id,
                "name": r.name,
                "owner": r.owner,
                "iso": r.iso,
                "state": r.state,
                "lat": float(r.lat),
                "lon": float(r.lon),
                "fuel": r.fuel,
                "capacityMw": float(r.capacity_mw),
                "status": r.status,
                "codDate": cod,
                "retirementDate": ret,
            }
        )

    iso_label = ",".join(iso) if iso else "all ISOs"
    return build_envelope(
        meta={
            "source": "eia-860+postgis",
            "data_age_seconds": 0,
            "count": len(data),
            "truncated": truncated,
            "bbox": bbox,
            "iso_filter": iso,
            "fuel_filter": fuel,
            "min_capacity_mw": min_capacity_mw,
            "status": status,
            "limit": limit,
        },
        data=data,
        summary=f"{len(data):,} generation units in viewport ({iso_label}, {status}).",
    )
