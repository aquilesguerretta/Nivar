// ATLAS Wave 5 — Battery-assets fetcher.
//
// Viewport-scoped wrapper around CURSOR's /api/infra/batteries.
// Battery fleet is small enough nationally (~3-4k assets late 2025)
// that no clustering is needed; the layer renders every result
// inside the viewport. MOCK_MODE clips FOUNDRY's MOCK_BATTERY_ASSETS
// to the requested bbox.

import { BASE_URL, MOCK_MODE } from './client';
import type { BatteryAsset, IsoMarket, AssetStatus } from '@/lib/types/infrastructure';
import { MOCK_BATTERY_ASSETS } from '@/lib/mock/infrastructure-mock';
import type { Bbox } from './generation';

export interface BatteryAssetsQuery {
  bbox: Bbox;
  iso?: IsoMarket[];
  /** Floor on power capacity in MW. Useful for hiding sub-utility-scale rows. */
  minCapacityMw?: number;
  status?: AssetStatus;
  limit?: number;
}

export interface BatteryAssetsResponse {
  data: BatteryAsset[];
  live: boolean;
  fetchedAt: string;
  count: number;
  truncated: boolean;
  /** Sum of capacityMw across `data` — saves a client-side reduce for the intel panel. */
  totalMw: number;
  /** Sum of capacityMwh across `data` (null entries treated as 0). */
  totalMwh: number;
}

function clipToBbox(units: BatteryAsset[], bbox: Bbox): BatteryAsset[] {
  const [minLon, minLat, maxLon, maxLat] = bbox;
  return units.filter(
    (b) => b.lon >= minLon && b.lon <= maxLon && b.lat >= minLat && b.lat <= maxLat,
  );
}

function applyFilters(units: BatteryAsset[], q: BatteryAssetsQuery): BatteryAsset[] {
  let out = units;
  if (q.iso?.length)            out = out.filter((b) => q.iso!.includes(b.iso));
  if (q.minCapacityMw != null)  out = out.filter((b) => b.capacityMw >= q.minCapacityMw!);
  if (q.status)                 out = out.filter((b) => b.status === q.status);
  if (q.limit)                  out = out.slice(0, q.limit);
  return out;
}

export async function fetchBatteryAssets(
  q: BatteryAssetsQuery,
  signal?: AbortSignal,
): Promise<BatteryAssetsResponse> {
  if (MOCK_MODE) {
    const inBox = clipToBbox(MOCK_BATTERY_ASSETS, q.bbox);
    const filtered = applyFilters(inBox, q);
    const totalMw  = filtered.reduce((s, b) => s + b.capacityMw, 0);
    const totalMwh = filtered.reduce((s, b) => s + (b.capacityMwh ?? 0), 0);
    return {
      data: filtered,
      live: false,
      fetchedAt: new Date().toISOString(),
      count: filtered.length,
      truncated: q.limit != null && inBox.length > q.limit,
      totalMw,
      totalMwh,
    };
  }

  const params = new URLSearchParams({
    bbox: q.bbox.join(','),
    ...(q.iso?.length          ? { iso: q.iso.join(',') }                  : {}),
    ...(q.minCapacityMw != null? { min_capacity_mw: String(q.minCapacityMw) } : {}),
    ...(q.status               ? { status: q.status }                      : {}),
    ...(q.limit                ? { limit: String(q.limit) }                : {}),
  });
  const r = await fetch(`${BASE_URL}/api/infra/batteries?${params}`, { signal });
  if (!r.ok) throw new Error(`batteries ${r.status}`);
  return (await r.json()) as BatteryAssetsResponse;
}
