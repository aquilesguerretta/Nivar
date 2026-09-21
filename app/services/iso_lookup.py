"""Point-in-polygon ISO assignment using bundled footprint GeoJSONs.

Footprints are approximate service territories (bounding regions) for the
seven contiguous organized markets in scope. Where regions overlap, the first
match in ``ISO_FILE_PRECEDENCE`` wins (smaller / more specific footprints
listed first).

Ingest scripts and optional tooling import this module; API handlers read
``iso`` from the database.
"""

from __future__ import annotations

import json
import logging
from functools import lru_cache
from pathlib import Path

from shapely.geometry import Point, shape

logger = logging.getLogger(__name__)

# File stem -> contract ISO code (must match DB CHECK and FOUNDRY IsoMarket).
ISO_FILE_PRECEDENCE: list[tuple[str, str]] = [
    ("nyiso", "NYISO"),
    ("iso-ne", "ISO-NE"),
    ("ercot", "ERCOT"),
    ("caiso", "CAISO"),
    ("pjm", "PJM"),
    ("miso", "MISO"),
    ("spp", "SPP"),
]

_REPO_ROOT = Path(__file__).resolve().parents[2]
_DEFAULT_FOOTPRINT_DIR = _REPO_ROOT / "data" / "iso_footprints"


@lru_cache(maxsize=1)
def _load_footprints(
    footprint_dir: str | None = None,
) -> tuple[list[str], list[object]]:
    base = Path(footprint_dir) if footprint_dir else _DEFAULT_FOOTPRINT_DIR
    isos: list[str] = []
    geoms: list[object] = []
    for stem, iso_code in ISO_FILE_PRECEDENCE:
        path = base / f"{stem}.geojson"
        if not path.is_file():
            logger.warning("missing ISO footprint file: %s", path)
            continue
        with path.open(encoding="utf-8") as f:
            gj = json.load(f)
        fc = gj.get("features") or []
        polys: list[object] = []
        for feat in fc:
            g = feat.get("geometry")
            if not g:
                continue
            polys.append(shape(g))
        if not polys:
            continue
        merged = polys[0]
        for p in polys[1:]:
            merged = merged.union(p)
        geoms.append(merged)
        isos.append(iso_code)
    return isos, geoms


def iso_for_point(
    lat: float,
    lon: float,
    *,
    footprint_dir: str | None = None,
) -> str:
    """Return ISO market code for a WGS84 point, or ``OTHER`` if none match."""
    isos, geoms = _load_footprints(footprint_dir)
    if not geoms:
        return "OTHER"
    pt = Point(lon, lat)
    for iso, g in zip(isos, geoms):
        if g.intersects(pt):
            return iso
    return "OTHER"


def reload_footprints() -> None:
    """Clear footprint cache (e.g. after replacing GeoJSON files)."""
    _load_footprints.cache_clear()
