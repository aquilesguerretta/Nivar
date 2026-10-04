// ATLAS Wave 5 — All-US transmission layer specifications.
//
// Two layers (glow + core) consumed by `GridAtlasMap.tsx` from a
// single `all-us-transmission` GeoJSON source. Voltage range nationally
// spans 115 → 765 kV — wider than the PJM-focused legacy layer that
// caps at 500 kV in practice — so the line-width interpolation uses
// an exponential-1.5 zoom ramp with an inner voltage interpolation,
// not the discrete `match` pattern the legacy layer uses.
//
// Source registration must be (no clustering for line geometry):
//   <Source id="all-us-transmission" type="geojson" data={...}>

import type { LayerProps } from 'react-map-gl';
import { voltageColorExpression } from './colorRamps';

/**
 * Width interpolation — exponential on zoom, linear on voltage_kv.
 * At zoom 3: 115 kV → 0.3 px, 765 kV → 1.5 px (continental view,
 * thin lines so the country reads as a graph not a blob).
 * At zoom 8: 115 kV → 1.0 px, 765 kV → 4.0 px (asset zoom, the
 * 765 kV trunk lines pop while distribution still renders).
 */
const lineWidthExpression: any = [
  'interpolate', ['exponential', 1.5], ['zoom'],
  3, ['interpolate', ['linear'], ['get', 'voltage_kv'], 115, 0.3, 765, 1.5],
  8, ['interpolate', ['linear'], ['get', 'voltage_kv'], 115, 1.0, 765, 4.0],
];

/**
 * Glow layer — soft halo behind the core line. Same color/width
 * expressions, blurred and dimmed. Renders first so the core line
 * sits on top.
 */
export const allUsTxGlowLayer: LayerProps = {
  id:     'all-us-tx-glow',
  type:   'line',
  source: 'all-us-transmission',
  paint: {
    'line-color':   voltageColorExpression,
    'line-width':   lineWidthExpression,
    'line-blur':    6,
    'line-opacity': 0.35,
  },
};

/**
 * Core line — sharp, voltage-colored. The data eye's primary signal.
 */
export const allUsTxCoreLayer: LayerProps = {
  id:     'all-us-tx-core',
  type:   'line',
  source: 'all-us-transmission',
  paint: {
    'line-color':   voltageColorExpression,
    'line-width':   lineWidthExpression,
    'line-opacity': 0.9,
  },
};
