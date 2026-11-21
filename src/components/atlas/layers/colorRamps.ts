// ATLAS Wave 5 — Map color ramp registry.
//
// Single source of truth for every paint expression that depends on
// fuel, voltage, LMP, or cluster size. Two flavors:
//
//   `…Expression`         → New schema (Wave 5 all-US layers).
//                           Reads typed properties from the new
//                           `GenerationUnit` / `TransmissionSegment`
//                           shapes (numeric `voltageKv`, lowercase
//                           `fuel`). Token-driven via `C.fuel*`.
//
//   `legacy…Expression`   → Old schema (PJM-only static GeoJSON).
//                           Reads `'VOLTAGE'` (string) or
//                           upcased `PRIM_FUEL`/`fuel_type` from
//                           `public/data/transmission-lines.geojson`
//                           and `power-plants.geojson`. Byte-identical
//                           to the inline expressions they replaced
//                           in `GridAtlasMap.tsx` — preserved verbatim
//                           so the existing PJM render is unchanged.
//
// Why two flavors: FOUNDRY's Wave 10a contracts (`infrastructure.ts`)
// use a different shape than the legacy HIFLD GeoJSON files that
// shipped with PJM-only Atlas. Both render side by side via
// independent toggles. Migrating the legacy GeoJSONs to the new
// schema is a future cleanup, not a Wave 5 deliverable.

import { C } from '@/design/tokens';

// ── Wave 5 — new schema (all-US layers) ────────────────────────────────

/**
 * Voltage color ramp — applied to all-US transmission lines.
 * Reads numeric `voltage_kv` from `TransmissionSegment.voltageKv`.
 * 765/735 kV → white, 500 → cyan, 345 → blue, 230/161/138/115 → violet
 * gradient. <115 falls back to the deepest violet so unmapped tiers
 * still render a discoverable line.
 */
export const voltageColorExpression: any = [
  'step',
  ['get', 'voltage_kv'],
  '#4B3D8F',                  // < 115 fallback
  115, '#6D28D9',
  138, '#7C3AED',
  161, '#8B5CF6',
  230, '#6B7FD4',
  345, '#00A3FF',
  500, '#00FFF0',
  735, C.textPrimary,
  765, C.textPrimary,
];

/**
 * Fuel color ramp — applied to all-US generators. Reads lowercase
 * `fuel` from `GenerationUnit.fuel` (FuelType union). All values
 * sourced from `C.fuel*` tokens; biomass/geothermal/oil are outside
 * the standard FOUNDRY palette and use literal hexes.
 */
export const fuelColorExpression: any = [
  'match',
  ['get', 'fuel'],
  'gas',        C.fuelGas,
  'coal',       C.fuelCoal,
  'nuclear',    C.fuelNuclear,
  'wind',       C.fuelWind,
  'solar',      C.fuelSolar,
  'hydro',      C.fuelHydro,
  'pumped',     C.fuelHydro,
  'biomass',    '#7FB069',
  'geothermal', '#FF6B35',
  'oil',        '#A0522D',
  C.fuelOther,
];

/**
 * LMP heat ramp — hub-dots. Linear interpolation across `lmp`:
 * 30 → blue, 34 → amber, 37 → red. Same schema as Wave 1; extracted
 * here so Wave 12+ can share the ramp with future heatmap layers.
 */
export const lmpHeatExpression: any = [
  'interpolate', ['linear'], ['get', 'lmp'],
  30, '#00A3FF',
  34, '#FFB800',
  37, '#FF3B3B',
];

/**
 * Cluster step color — point_count thresholds for the all-US
 * generation cluster layer. <10 calm blue, <30 falcon gold,
 * ≥30 alert red. Matches the platform alert vocabulary
 * (low / notable / critical).
 */
export const clusterColorExpression: any = [
  'step', ['get', 'point_count'],
  C.electricBlue, 10,
  C.falconGold,    30,
  C.alertCritical,
];

// ── Legacy — PJM-only static GeoJSON layers (byte-identical) ───────────

/**
 * Legacy voltage color ramp — keyed on `'VOLTAGE'` string property
 * from `public/data/transmission-lines.geojson` and
 * `MOCK_SUBSTATIONS`. Preserves Wave 1's exact paint output for
 * the PJM-focused `tx-glow` / `tx-core` / `substations` layers.
 *
 * NB: source uses string voltage values ('500', '345', etc.), not
 * numeric. Switching to `voltageColorExpression` would silently
 * change the render because `'step'` requires numeric input.
 */
export const legacyVoltageColorExpression: any = [
  'match',
  ['get', 'VOLTAGE'],
  '735',  C.textPrimary,
  '765',  C.textPrimary,
  '500',  '#00FFF0',
  '345',  '#00A3FF',
  '230',  '#6B7FD4',
  '161',  '#8B5CF6',
  '138',  '#7C3AED',
  '115',  '#6D28D9',
  '#4B3D8F',
];

/**
 * Legacy voltage width — zoom-interpolated line width with an inner
 * voltage match. Used by the PJM `tx-glow` and `tx-core` layers.
 */
export const legacyVoltageWidthExpression: any = [
  'interpolate', ['linear'], ['zoom'],
  4,  ['match', ['get', 'VOLTAGE'], '500', 1.5, '345', 1.2, '230', 0.8, 0.4],
  8,  ['match', ['get', 'VOLTAGE'], '500', 3.0, '345', 2.5, '230', 1.8, 1.0],
  12, ['match', ['get', 'VOLTAGE'], '500', 5.0, '345', 4.0, '230', 3.0, 1.8],
];

/**
 * Legacy fuel color ramp — coalesces `PRIM_FUEL` (HIFLD) with
 * `fuel_type` (PJM API) and upcases. Used by the PJM `plant-circles`
 * fallback layer. Hex values match the Wave 1 inline definitions.
 */
export const legacyFuelColorExpression: any = [
  'match', ['upcase', ['coalesce', ['get', 'PRIM_FUEL'], ['get', 'fuel_type'], '']],
  'NG',    '#E67E22',
  'GAS',   '#E67E22',
  'NUC',   '#9B59B6',
  'NUCLEAR','#9B59B6',
  'WIND',  '#00A3FF',
  'WND',   '#00A3FF',
  'SUN',   '#F1C40F',
  'SOLAR', '#F1C40F',
  'COAL',  '#636E72',
  'COL',   '#636E72',
  'WAT',   '#3498DB',
  'HYDRO', '#3498DB',
  'BAT',   '#00E676',
  'GEO',   '#FF6B35',
  'OIL',   '#A0522D',
  '#BDC3C7',
];

/**
 * Legacy cluster step color for the PJM `plant-clusters` layer.
 * Hex values match the Wave 1 inline definitions (cyan / amber / red).
 */
export const legacyClusterColorExpression: any = [
  'step', ['get', 'point_count'],
  '#00A3FF', 10,
  '#FFB800', 30,
  '#FF3B3B',
];

/**
 * Legacy fuel ramp for outage rings. The `OutageSnapshot.fuel`
 * field is uppercase ('NG' | 'COAL' | 'NUC' | …) — matches the
 * AtlasSnapshot contract, not the new GenerationUnit schema.
 */
export const legacyFuelOutageColorExpression: any = [
  'match', ['upcase', ['coalesce', ['get', 'fuel'], '']],
  'NG',    '#E67E22',
  'NUC',   '#9B59B6',
  'COAL',  '#636E72',
  'WIND',  '#00A3FF',
  'SOLAR', '#F1C40F',
  'HYDRO', '#3498DB',
  'BAT',   '#00E676',
  'OIL',   '#A0522D',
  '#FF3B3B',
];
