// ATLAS Wave 5 — Transmission-segments fetcher.
//
// Viewport + LOD-scoped wrapper around CURSOR's
// /api/infra/transmission-segments. The LOD param controls geometry
// precision and voltage filtering — `low` returns simplified
// continental-scale segments at ≥345 kV, `high` returns native-
// precision rows down to 115 kV. MOCK_MODE returns the FOUNDRY
// fixtures clipped to the bbox; LOD just affects voltage filtering
// in mock since the fixture geometries are already 2-point.

import { BASE_URL, MOCK_MODE } from './client';
import type { TransmissionSegment, IsoMarket, LodLevel } from '@/lib/types/infrastructure';
import { MOCK_TRANSMISSION_SEGMENTS } from '@/lib/mock/infrastructure-mock';
import type { Bbox } from './generation';

export interface TransmissionSegmentsQuery {
  bbox: Bbox;
  lod: LodLevel;
  iso?: IsoMarket[];
  /** Lower bound for voltage (kV). Defaults are LOD-driven on the backend. */
  minVoltageKv?: number;
  limit?: number;
}

export interface TransmissionSegmentsResponse {
  data: TransmissionSegment[];
  live: boolean;
  fetchedAt: string;
  count: number;
  truncated: boolean;
  /** Echoed back so the UI can show the resolved LOD if it differs. */
  lod: LodLevel;
}

const LOD_MIN_KV: Record<LodLevel, number> = {
  low:  345,
  mid:  138,
  high: 0,
};

/** True if any vertex of the LineString lies inside the bbox. */
function lineStringIntersectsBbox(coords: [number, number][], bbox: Bbox): boolean {
  const [minLon, minLat, maxLon, maxLat] = bbox;
  return coords.some(([lon, lat]) => lon >= minLon && lon <= maxLon && lat >= minLat && lat <= maxLat);
}

export async function fetchTransmissionSegments(
  q: TransmissionSegmentsQuery,
  signal?: AbortSignal,
): Promise<TransmissionSegmentsResponse> {
  if (MOCK_MODE) {
    const minKv = q.minVoltageKv ?? LOD_MIN_KV[q.lod];
    let out = MOCK_TRANSMISSION_SEGMENTS.filter(
      (t) => t.voltageKv >= minKv && lineStringIntersectsBbox(t.geometry, q.bbox),
    );
    if (q.iso?.length) out = out.filter((t) => q.iso!.includes(t.iso));
    if (q.limit)       out = out.slice(0, q.limit);
    return {
      data: out,
      live: false,
      fetchedAt: new Date().toISOString(),
      count: out.length,
      truncated: false,
      lod: q.lod,
    };
  }

  const params = new URLSearchParams({
    bbox: q.bbox.join(','),
    lod:  q.lod,
    ...(q.iso?.length         ? { iso: q.iso.join(',') }                  : {}),
    ...(q.minVoltageKv != null? { min_voltage_kv: String(q.minVoltageKv) }: {}),
    ...(q.limit               ? { limit: String(q.limit) }                : {}),
  });
  const r = await fetch(`${BASE_URL}/api/infra/transmission-segments?${params}`, { signal });
  if (!r.ok) throw new Error(`transmission-segments ${r.status}`);
  return (await r.json()) as TransmissionSegmentsResponse;
}
