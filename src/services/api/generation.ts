// ATLAS Wave 5 — Generation-units fetcher.
//
// Viewport-scoped wrapper around CURSOR's /api/infra/generation-units.
// Bbox-driven (the map's onMoveEnd extracts current bounds), with
// optional fuel / capacity / status / iso filters. MOCK_MODE branch
// returns FOUNDRY's MOCK_GENERATION_UNITS clipped to the requested
// bbox so offline dev still demos the layer.
//
// Endpoint contract (CURSOR Wave 7):
//   GET /api/infra/generation-units?bbox=lon,lat,lon,lat
//                                  &iso=PJM,CAISO
//                                  &fuel=gas,solar
//                                  &min_capacity_mw=100
//                                  &status=operating
//                                  &limit=5000
//   Response: { data: GenerationUnit[], live, fetchedAt, count, truncated }

import { BASE_URL, MOCK_MODE } from './client';
import type { GenerationUnit, IsoMarket, FuelType, AssetStatus } from '@/lib/types/infrastructure';
import { MOCK_GENERATION_UNITS } from '@/lib/mock/infrastructure-mock';

/** Bbox tuple in [minLon, minLat, maxLon, maxLat] order — Mapbox convention. */
export type Bbox = [number, number, number, number];

export interface GenerationUnitsQuery {
  bbox: Bbox;
  iso?: IsoMarket[];
  fuel?: FuelType[];
  minCapacityMw?: number;
  status?: AssetStatus;
  /** Hard cap on rows returned. Backend truncates when over. */
  limit?: number;
}

export interface GenerationUnitsResponse {
  data: GenerationUnit[];
  /**
   * `true` when the upstream feed is live-streaming. EIA-derived data
   * is published periodically (annual EIA-860 + monthly EIA-860M) so
   * `live: false` is normal and not a stale-data warning.
   */
  live: boolean;
  fetchedAt: string;
  count: number;
  truncated: boolean;
}

function clipToBbox(units: GenerationUnit[], bbox: Bbox): GenerationUnit[] {
  const [minLon, minLat, maxLon, maxLat] = bbox;
  return units.filter(
    (g) => g.lon >= minLon && g.lon <= maxLon && g.lat >= minLat && g.lat <= maxLat,
  );
}

function applyFilters(units: GenerationUnit[], q: GenerationUnitsQuery): GenerationUnit[] {
  let out = units;
  if (q.iso?.length)        out = out.filter((g) => q.iso!.includes(g.iso));
  if (q.fuel?.length)       out = out.filter((g) => q.fuel!.includes(g.fuel));
  if (q.minCapacityMw != null) out = out.filter((g) => g.capacityMw >= q.minCapacityMw!);
  if (q.status)             out = out.filter((g) => g.status === q.status);
  if (q.limit)              out = out.slice(0, q.limit);
  return out;
}

export async function fetchGenerationUnits(
  q: GenerationUnitsQuery,
  signal?: AbortSignal,
): Promise<GenerationUnitsResponse> {
  if (MOCK_MODE) {
    const inBox = clipToBbox(MOCK_GENERATION_UNITS, q.bbox);
    const filtered = applyFilters(inBox, q);
    return {
      data: filtered,
      live: false,
      fetchedAt: new Date().toISOString(),
      count: filtered.length,
      truncated: q.limit != null && inBox.length > q.limit,
    };
  }

  const params = new URLSearchParams({
    bbox: q.bbox.join(','),
    ...(q.iso?.length          ? { iso: q.iso.join(',') }                  : {}),
    ...(q.fuel?.length         ? { fuel: q.fuel.join(',') }                : {}),
    ...(q.minCapacityMw != null? { min_capacity_mw: String(q.minCapacityMw) } : {}),
    ...(q.status               ? { status: q.status }                      : {}),
    ...(q.limit                ? { limit: String(q.limit) }                : {}),
  });
  const r = await fetch(`${BASE_URL}/api/infra/generation-units?${params}`, { signal });
  if (!r.ok) throw new Error(`generation-units ${r.status}`);
  return (await r.json()) as GenerationUnitsResponse;
}
