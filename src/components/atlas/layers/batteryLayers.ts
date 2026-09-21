// ATLAS Wave 5 — All-US battery storage layer specification.
//
// Single circle layer rendered from `all-us-batteries` source. No
// clustering — battery fleet count is small enough nationally
// (~3-4k late 2025) that individual dots scale fine. Distinct
// visual category from generation: thicker stroke (1.5 px vs 0.5),
// purple fill, status-encoded stroke color so under-construction
// and retired entries read at a glance without an extra layer.

import type { LayerProps } from 'react-map-gl';
import { C } from '@/design/tokens';

/**
 * Battery dot — purple fill (`C.fuelBattery`), radius interpolated
 * on `capacityMw` (3 → 10 px), stroke color discriminated by status:
 *   operating          → white-translucent (the default)
 *   under-construction → falcon gold
 *   planned            → falcon gold (same hue, treated as in-flight)
 *   retired/cancelled  → alert red
 *   standby            → muted (textMuted)
 *
 * Layer id `all-us-batteries-circle` is registered in the map's
 * `interactiveLayerIds` so clicks fire the asset-detail handler.
 */
export const allUsBatteryCircleLayer: LayerProps = {
  id:     'all-us-batteries-circle',
  type:   'circle',
  source: 'all-us-batteries',
  paint: {
    'circle-color':         C.fuelBattery,
    'circle-radius':        [
      'interpolate', ['linear'], ['get', 'capacityMw'],
      0,    3,
      10,   3,
      100,  6,
      500,  10,
      1000, 12,
    ] as any,
    'circle-stroke-width':  1.5,
    'circle-stroke-color':  [
      'match', ['get', 'status'],
      'operating',          'rgba(255,255,255,0.85)',
      'under-construction', C.falconGold,
      'planned',            C.falconGold,
      'retired',            C.alertCritical,
      'cancelled',          C.alertCritical,
      'standby',            C.textMuted,
      'rgba(255,255,255,0.85)',
    ] as any,
    'circle-opacity':       0.95,
  },
};
