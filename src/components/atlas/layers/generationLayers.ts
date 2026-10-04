// ATLAS Wave 5 — All-US generation layer specifications.
//
// Three layers consumed by `GridAtlasMap.tsx` from a single
// `all-us-generation` GeoJSON source (cluster: true). Renders ~15K
// EIA generators nationally. Pattern parallels Wave 1's PJM
// `plant-clusters` / `plant-cluster-count` / `plant-circles` trio
// but reads the new lowercase `fuel` + numeric `capacityMw`
// properties from the `GenerationUnit` shape.
//
// Source registration must be:
//   <Source id="all-us-generation" type="geojson"
//     data={genGeoJson}
//     cluster={true} clusterMaxZoom={8} clusterRadius={40}>

import type { LayerProps } from 'react-map-gl';
import { fuelColorExpression, clusterColorExpression } from './colorRamps';

/**
 * Cluster bubble — visible when point_count exists. Three-step radius
 * (small / medium / large) matching the cluster color tier so the
 * size and color reinforce the same density signal.
 */
export const allUsGenClusterLayer: LayerProps = {
  id:     'all-us-gen-clusters',
  type:   'circle',
  source: 'all-us-generation',
  filter: ['has', 'point_count'],
  paint: {
    'circle-color':        clusterColorExpression,
    'circle-radius':       [
      'step', ['get', 'point_count'],
      14, 10,
      20, 50,
      28, 200,
      36,
    ] as any,
    'circle-stroke-width': 1.5,
    'circle-stroke-color': 'rgba(255,255,255,0.6)',
    'circle-opacity':      0.85,
  },
};

/**
 * Cluster count label — abbreviates 1.2k / 12k etc. via Mapbox's
 * built-in {point_count_abbreviated}.
 */
export const allUsGenClusterCountLayer: LayerProps = {
  id:     'all-us-gen-cluster-count',
  type:   'symbol',
  source: 'all-us-generation',
  filter: ['has', 'point_count'],
  layout: {
    'text-field': '{point_count_abbreviated}',
    'text-font':  ['Open Sans Bold', 'Arial Unicode MS Bold'],
    'text-size':  11,
  },
  paint: {
    'text-color':      '#FFFFFF',
    'text-halo-color': 'rgba(0,0,0,0.6)',
    'text-halo-width': 1,
  },
};

/**
 * Individual generator dot — visible when point_count is absent
 * (i.e., the cluster has resolved to single features at higher zoom).
 * Color encodes fuel via `fuelColorExpression`; radius interpolates
 * on `capacityMw` (2 px for sub-utility / 10 px for the 5 GW class).
 *
 * Layer id `all-us-gen-circle` is registered in the map's
 * `interactiveLayerIds` so clicks fire the asset-detail handler.
 */
export const allUsGenCircleLayer: LayerProps = {
  id:     'all-us-gen-circle',
  type:   'circle',
  source: 'all-us-generation',
  filter: ['!', ['has', 'point_count']],
  paint: {
    'circle-color':        fuelColorExpression,
    'circle-radius':       [
      'interpolate', ['linear'], ['get', 'capacityMw'],
      0,    2,
      500,  4,
      2000, 7,
      5000, 10,
    ] as any,
    'circle-stroke-width': 0.5,
    'circle-stroke-color': 'rgba(255,255,255,0.4)',
    'circle-opacity':      0.92,
  },
};
