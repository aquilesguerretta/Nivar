"""Ingest HIFLD electric transmission lines (≥115 kV) into ``transmission_segments``.

Resolves a public FeatureServer layer at runtime (ArcGIS Hub search), then
pages through ``query`` results so no single multi‑hundred‑MB GeoJSON is held
in memory.

Run from repo root::

    DATABASE_URL=... py -3 -m app.scripts.ingest_hifld_transmission

Environment:

- ``DATABASE_URL`` — PostgreSQL + PostGIS (required)
- ``HIFLD_TRANSMISSION_LAYER_URL`` — optional full layer URL ending in
  ``.../FeatureServer/0`` (skips Hub search)
"""

from __future__ import annotations

import json
import logging
import os
import sys
from typing import Any

import requests
from psycopg2.extras import execute_batch
from shapely.geometry import LineString, MultiLineString, shape

from app.scripts._db import connect
from app.scripts.ingest_eia_860 import USER_AGENT
from app.services.iso_lookup import iso_for_point

logging.basicConfig(level=logging.INFO, format="%(levelname)s %(message)s")
logger = logging.getLogger(__name__)

DEFAULT_LAYER = (
    "https://services2.arcgis.com/LYMgRMwHfrWWEg3s/arcgis/rest/services/"
    "HIFLD_US_Electric_Power_Transmission_Lines/FeatureServer/0"
)

SEARCH_URL = "https://www.arcgis.com/sharing/rest/search"

UPSERT_SQL = """
INSERT INTO transmission_segments (
  id, voltage_kv, name, owner, iso, segment_length_km, geom, geom_mid, geom_low
)
SELECT
  %(id)s,
  %(voltage_kv)s,
  %(name)s,
  %(owner)s,
  %(iso)s,
  ST_Length(g::geography) / 1000.0,
  g,
  -- ST_Simplify returns NULL when the tolerance collapses the line (segments
  -- shorter than ~111 m at mid, ~1.1 km at low). geom_mid/geom_low are NOT
  -- NULL, so fall back to the full geometry instead of inventing a stub.
  COALESCE(ST_Simplify(g, 0.001), g),
  COALESCE(ST_Simplify(g, 0.01), g)
FROM (SELECT ST_SetSRID(ST_GeomFromGeoJSON(%(gj)s), 4326) AS g) AS _
ON CONFLICT (id) DO UPDATE SET
  voltage_kv = EXCLUDED.voltage_kv,
  name = EXCLUDED.name,
  owner = EXCLUDED.owner,
  iso = EXCLUDED.iso,
  segment_length_km = EXCLUDED.segment_length_km,
  geom = EXCLUDED.geom,
  geom_mid = EXCLUDED.geom_mid,
  geom_low = EXCLUDED.geom_low;
"""


def _normalize_layer_url(url: str) -> str:
    u = url.rstrip("/")
    if not u.lower().endswith(("featureserver/0", "featureserver")):
        return u
    if u.lower().endswith("featureserver"):
        return u + "/0"
    return u


def resolve_layer_url() -> str:
    env = os.environ.get("HIFLD_TRANSMISSION_LAYER_URL", "").strip()
    if env:
        return _normalize_layer_url(env)
    r = requests.get(
        SEARCH_URL,
        params={
            "q": 'title:"HIFLD_US_Electric_Power_Transmission_Lines" type:"Feature Service"',
            "f": "json",
            "num": 10,
        },
        headers={"User-Agent": USER_AGENT},
        timeout=90,
    )
    r.raise_for_status()
    data = r.json()
    for item in data.get("results", []):
        url = (item.get("url") or "").rstrip("/")
        if "FeatureServer" not in url:
            continue
        if not url.lower().endswith("/0"):
            url = url + "/0"
        return url
    logger.warning("Hub search failed — using default HIFLD transmission layer")
    return DEFAULT_LAYER


def _layer_meta(layer_url: str) -> tuple[int, str]:
    """Return (page_size, object_id_field).

    The object id field is needed to make ``resultOffset`` paging deterministic —
    without an explicit sort, ArcGIS may repeat or skip features between pages.
    """
    try:
        r = requests.get(
            layer_url,
            params={"f": "json"},
            headers={"User-Agent": USER_AGENT},
            timeout=60,
        )
        r.raise_for_status()
        d = r.json()
        page = min(int(d.get("maxRecordCount") or 2000), 2000)
        return page, str(d.get("objectIdField") or "OBJECTID")
    except (OSError, ValueError, requests.RequestException):
        return 2000, "OBJECTID"


def _linestring_to_geojson(g: LineString) -> str:
    coords = list(g.coords)
    return json.dumps({"type": "LineString", "coordinates": coords})


def _iter_features(geom: object, fid: str) -> list[tuple[str, LineString]]:
    if isinstance(geom, LineString):
        return [(fid, geom)]
    if isinstance(geom, MultiLineString):
        out: list[tuple[str, LineString]] = []
        for i, g in enumerate(geom.geoms):
            out.append((f"{fid}:{i}", g))
        return out
    return []


def _iso_for_line(g: LineString) -> str:
    pt = g.interpolate(0.5, normalized=True)
    return iso_for_point(pt.y, pt.x)


def ingest() -> int:
    layer = resolve_layer_url()
    logger.info("HIFLD layer: %s", layer)
    page, oid_field = _layer_meta(layer)
    logger.info("page size %s, ordering by %s", page, oid_field)
    offset = 0
    total = 0
    conn = connect()
    try:
        cur = conn.cursor()
        while True:
            r = requests.get(
                f"{layer.rstrip('/')}/query",
                params={
                    "where": "VOLTAGE >= 115",
                    "outFields": "ID,VOLTAGE,OWNER,SUB_1,SUB_2",
                    "returnGeometry": "true",
                    "outSR": "4326",
                    "f": "geojson",
                    "orderByFields": oid_field,
                    "resultOffset": offset,
                    "resultRecordCount": page,
                },
                headers={"User-Agent": USER_AGENT},
                timeout=300,
            )
            r.raise_for_status()
            fc = r.json()
            feats = fc.get("features") or []
            if not feats:
                break
            batch: list[dict[str, Any]] = []
            for feat in feats:
                props = feat.get("properties") or {}
                geomj = feat.get("geometry")
                if not geomj:
                    continue
                try:
                    g = shape(geomj)
                except Exception:
                    continue
                fid = str(props.get("ID") or "").strip()
                if not fid:
                    continue
                try:
                    v = props.get("VOLTAGE")
                    if v is None:
                        continue
                    voltage = int(round(float(v)))
                except (TypeError, ValueError):
                    continue
                if voltage < 115:
                    continue
                owner = props.get("OWNER")
                owner_s = str(owner).strip() if owner else None
                sub1 = props.get("SUB_1")
                sub2 = props.get("SUB_2")
                name_parts = [str(x).strip() for x in (sub1, sub2) if x]
                name_s = " – ".join(name_parts) if name_parts else None

                for row_id, lg in _iter_features(g, fid):
                    if len(lg.coords) < 2:
                        continue
                    gj = _linestring_to_geojson(lg)
                    iso = _iso_for_line(lg)
                    batch.append(
                        {
                            "id": row_id,
                            "voltage_kv": voltage,
                            "name": name_s,
                            "owner": owner_s,
                            "iso": iso,
                            "gj": gj,
                        }
                    )

            # One round trip per row is unusable over the public proxy; group them.
            execute_batch(cur, UPSERT_SQL, batch, page_size=200)
            conn.commit()
            n = len(batch)
            total += n
            offset += len(feats)
            if total % 5000 < page or n == 0:
                logger.info("ingested %s segments (offset %s)", total, offset)
            if len(feats) < page:
                break
        cur.close()
    finally:
        conn.close()
    logger.info("done — %s transmission_segments rows upserted", total)
    return 0


def main() -> int:
    return ingest()


if __name__ == "__main__":
    sys.exit(main())
