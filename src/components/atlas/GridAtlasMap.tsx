// src/components/atlas/GridAtlasMap.tsx
// Native Mapbox GL rendering via react-map-gl Source+Layer components.
// All layers render inside Mapbox's GPU pipeline — no floating at any pitch.
// CARTO Dark Matter basemap for perfect dark aesthetic.

import {
  useState, useRef, useEffect, useMemo, useCallback, forwardRef, useImperativeHandle,
} from 'react';
import Map, {
  Source, Layer,
  type MapRef,
  type LayerProps,
} from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import {
  gasPipelineLayer,
  gasPipelineGlowLayer,
  pipelineTerminusHaloLayer,
  pipelineTerminusDotLayer,
  pipelineTerminusLabelLayer,
  substationLayer,
  substationLabelLayer,
} from './layers/infrastructureLayers';
import {
  earthquakeLayer,
  earthquakeLabelLayer,
} from './layers/intelligenceLayers';
import { buildPipelineTermini } from './utils/buildPipelineTermini';
import { C } from '@/design/tokens';
// ATLAS Wave 5 — color ramps lifted out of this file. See
// `layers/colorRamps.ts` header for the new-vs-legacy split rationale.
import {
  lmpHeatExpression,
  legacyClusterColorExpression,
  legacyFuelColorExpression,
  legacyFuelOutageColorExpression,
  legacyVoltageColorExpression,
  legacyVoltageWidthExpression,
} from './layers/colorRamps';
// ATLAS Wave 5 — all-US infrastructure layer specs. Each module owns
// the LayerProps for one source (generation / transmission / batteries).
import {
  allUsGenClusterLayer,
  allUsGenClusterCountLayer,
  allUsGenCircleLayer,
} from './layers/generationLayers';
import {
  allUsTxGlowLayer,
  allUsTxCoreLayer,
} from './layers/transmissionLayers';
import {
  allUsBatteryCircleLayer,
} from './layers/batteryLayers';

// ── Constants ─────────────────────────────────────────────────────────────

export const CARTO_DARK =
  'mapbox://styles/aquiles-guerretta/cmns0ux4s002s01s3au66boo8';

export const MAPBOX_SATELLITE =
  'mapbox://styles/mapbox/satellite-streets-v12';

export const MAPBOX_TERRAIN =
  'mapbox://styles/mapbox/outdoors-v12';

export const MAPBOX_MINIMAL =
  'mapbox://styles/mapbox/light-v11';

// PJM footprint overview — all 20 zones visible, labels readable.
const PJM_OVERVIEW = {
  longitude: -79.5,
  latitude:   39.8,
  zoom:       5.5,
  pitch:      0,
  bearing:    0,
} as const;

// Globe entry — camera zoomed out; intro animation flies into PJM_OVERVIEW.
const GLOBE_START = {
  longitude: -60,
  latitude:   25,
  zoom:       1.6,
  pitch:      0,
  bearing:    0,
} as const;

// Session-scoped camera persistence so Atlas remembers position
// when user navigates away and back.
const SS_CAMERA_KEY   = 'gridalpha:atlas-camera';
const SS_INTRO_PLAYED = 'gridalpha:atlas-intro-played';

interface CameraState {
  longitude: number; latitude: number;
  zoom:      number; pitch:    number; bearing: number;
}

function readSavedCamera(): CameraState | null {
  try {
    const raw = sessionStorage.getItem(SS_CAMERA_KEY);
    return raw ? JSON.parse(raw) as CameraState : null;
  } catch { return null; }
}

function saveCamera(c: CameraState): void {
  try { sessionStorage.setItem(SS_CAMERA_KEY, JSON.stringify(c)); } catch { /* ignore */ }
}

function pickInitialView(): CameraState {
  // If we already played intro this session, restore last position.
  const saved = readSavedCamera();
  if (saved) return saved;
  // First visit in this session — start at globe; intro will fly to PJM.
  const introPlayed = (() => {
    try { return sessionStorage.getItem(SS_INTRO_PLAYED) === '1'; } catch { return false; }
  })();
  return introPlayed ? PJM_OVERVIEW : GLOBE_START;
}

// ── Layer style definitions ───────────────────────────────────────────────

// All overlay layers use `slot: 'top'` so Mapbox Standard (Terminal) style
// renders them ABOVE its basemap composite — without this, fuel/hub colors
// get crushed to near-black by the Monochrome Night dark theme.

const txGlowLayer: LayerProps = {
  id:   'tx-glow',
  type: 'line',
  paint: {
    'line-color':   legacyVoltageColorExpression,
    'line-width':   legacyVoltageWidthExpression,
    'line-blur':    6,
    'line-opacity': 0.35,
  },
};

const txCoreLayer: LayerProps = {
  id:   'tx-core',
  type: 'line',
  paint: {
    'line-color':   legacyVoltageColorExpression,
    'line-width':   legacyVoltageWidthExpression,
    'line-opacity': 0.9,
  },
};

const plantClusterLayer: LayerProps = {
  id:     'plant-clusters',
  type:   'circle',
  filter: ['has', 'point_count'],
  paint:  {
    'circle-color':        legacyClusterColorExpression,
    'circle-radius':       ['step', ['get', 'point_count'], 14, 10, 20, 30, 26] as any,
    'circle-opacity':      0.95,
    'circle-stroke-width': 1.5,
    'circle-stroke-color': 'rgba(255,255,255,0.55)',
  },
};

const plantClusterCountLayer: LayerProps = {
  id:     'plant-cluster-count',
  type:   'symbol',
  filter: ['has', 'point_count'],
  layout: {
    'text-field':  '{point_count_abbreviated}',
    'text-size':   11,
    'text-font':   ['Open Sans Bold', 'Arial Unicode MS Bold'],
  },
  paint: {
    'text-color':      C.textPrimary,
    'text-halo-color': 'rgba(0,0,0,0.8)',
    'text-halo-width': 1,
  },
};

// ── Hub node layers ───────────────────────────────────────────────────────

const hubDotLayer: LayerProps = {
  id:   'hub-dots',
  type: 'circle',
  paint: {
    'circle-radius':       [
      'interpolate', ['linear'], ['zoom'],
      4, 6,  8, 12,  12, 18,
    ] as any,
    'circle-color':        lmpHeatExpression,
    'circle-opacity':      1.0,
    'circle-stroke-width': 2,
    'circle-stroke-color': 'rgba(255,255,255,0.75)',
  },
};

const hubLabelLayer: LayerProps = {
  id:     'hub-labels',
  type:   'symbol',
  layout: {
    'text-field':       ['get', 'label'],
    'text-font':        ['Open Sans Bold', 'Arial Unicode MS Bold'],
    'text-size':        11,
    'text-offset':      [0, -2],
    'text-anchor':      'bottom',
    'text-allow-overlap': true,
  },
  paint: {
    'text-color':      'rgba(255,255,255,0.85)',
    'text-halo-color': 'rgba(0,0,0,0.8)',
    'text-halo-width': 1.5,
  },
};

// ── Outage markers (Wave 2 — driven by AtlasSnapshot.outages) ─────────────
// Outage rings appear / disappear as the scrubber moves through each
// outage's active window. Color encodes fuel; halo encodes severity.

const outageHaloLayer: LayerProps = {
  id:   'outages-halo',
  type: 'circle',
  paint: {
    'circle-radius': [
      'interpolate', ['linear'],
      ['coalesce', ['get', 'mw'], 500],
      300,  16,
      1000, 24,
      2500, 36,
    ] as any,
    'circle-color':         '#FF3B3B',
    'circle-opacity':       0.18,
    'circle-blur':          0.55,
    'circle-stroke-width':  0,
  },
};

const outageRingLayer: LayerProps = {
  id:   'outages-ring',
  type: 'circle',
  paint: {
    'circle-radius': [
      'interpolate', ['linear'],
      ['coalesce', ['get', 'mw'], 500],
      300,  10,
      1000, 14,
      2500, 20,
    ] as any,
    'circle-color':        'rgba(0,0,0,0)',
    'circle-stroke-color': legacyFuelOutageColorExpression,
    'circle-stroke-width': 2,
    'circle-opacity':      1,
  },
};

const outageLabelLayer: LayerProps = {
  id:     'outage-labels',
  type:   'symbol',
  minzoom: 6,
  layout: {
    'text-field':       ['concat', ['get', 'name'], ' · -', ['to-string', ['get', 'mw']], ' MW'] as any,
    'text-font':        ['Open Sans Bold', 'Arial Unicode MS Bold'],
    'text-size':        10,
    'text-offset':      [0, 1.6],
    'text-anchor':      'top',
    'text-allow-overlap': false,
    'text-optional':    true,
  },
  paint: {
    'text-color':      '#FF3B3B',
    'text-halo-color': 'rgba(0,0,0,0.85)',
    'text-halo-width': 1.5,
  },
};

// ── Plant fallback circle layer (renders immediately, before SVG icons load) ─

const plantCircleFallback: LayerProps = {
  id:     'plant-circles',
  type:   'circle',
  filter: ['!', ['has', 'point_count']],
  paint: {
    'circle-radius': [
      'interpolate', ['linear'],
      ['coalesce', ['get', 'INSTALL_MW'], ['get', 'capacity_mw'], 100],
      50, 4, 500, 7, 2000, 12, 5000, 18,
    ] as any,
    'circle-color':        legacyFuelColorExpression,
    'circle-opacity':      1.0,
    'circle-stroke-width': 1,
    'circle-stroke-color': 'rgba(255,255,255,0.55)',
  },
};

// SVG circle icon generator
// ── FlyTo helper exposed to parent ────────────────────────────────────────

export interface GridAtlasMapHandle {
  flyTo: (lon: number, lat: number, zoom: number) => void;
}

// ── Props ─────────────────────────────────────────────────────────────────

export interface GridAtlasMapProps {
  mapStyle:           string;
  txGeoJson:          GeoJSON.FeatureCollection | null;
  plantGeoJson:       GeoJSON.FeatureCollection | null;
  hubGeoJson:         GeoJSON.FeatureCollection | null;
  /**
   * ATLAS Wave 2 — outage markers driven by the AtlasSnapshot. Markers
   * appear/disappear as the scrubber moves through outages' active windows.
   */
  outagesGeoJson?:    GeoJSON.FeatureCollection | null;
  substationGeoJson:  GeoJSON.FeatureCollection | null;
  pipelineGeoJson:    GeoJSON.FeatureCollection | null;
  earthquakeGeoJson:  GeoJSON.FeatureCollection | null;
  weatherGeoJson:     GeoJSON.FeatureCollection | null;
  /**
   * ATLAS Wave 5 — all-US generation FeatureCollection. ~15K EIA
   * generators when wired to live; bbox-clipped before render so
   * only viewport-resident features hit the GPU.
   */
  allUsGenerationGeoJson?: GeoJSON.FeatureCollection | null;
  /**
   * ATLAS Wave 5 — all-US transmission FeatureCollection. LineString
   * features. Backend pre-simplifies geometry to the requested LOD;
   * the frontend just renders what came back.
   */
  allUsTransmissionGeoJson?: GeoJSON.FeatureCollection | null;
  /**
   * ATLAS Wave 5 — all-US battery storage FeatureCollection. Point
   * features. No clustering — fleet size is small enough that
   * individual dots scale to a national render.
   */
  allUsBatteriesGeoJson?: GeoJSON.FeatureCollection | null;
  showTx:             boolean;
  showPlants:         boolean;
  showNodes:          boolean;
  showSubstations:    boolean;
  showGasPipelines:   boolean;
  showEarthquakes:    boolean;
  /** Wave 5 toggle — controls visibility of the all-US generation layer. */
  showAllUsGeneration?: boolean;
  /** Wave 5 toggle — controls visibility of the all-US transmission layer. */
  showAllUsTransmission?: boolean;
  /** Wave 5 toggle — controls visibility of the battery storage layer. */
  showBatteries?: boolean;
  onZoneClick:        (zoneId: string | null) => void;
  onPlantHover:       (props: Record<string, unknown> | null, x: number, y: number) => void;
  onZoneHover:        (name: string | null) => void;
  /**
   * Wave 5 — fired when the user clicks an individual all-US generator
   * dot. Properties are the unwrapped GenerationUnit shape.
   */
  onGeneratorClick?:  (props: Record<string, unknown>) => void;
  /**
   * Wave 5 — fired when the user clicks a battery dot. Properties
   * are the unwrapped BatteryAsset shape.
   */
  onBatteryClick?:    (props: Record<string, unknown>) => void;
  /**
   * Wave 5 — fired on every map moveend (debounced upstream by
   * GridAtlasView before it fires the bbox-driven hooks). Carries
   * current viewport bounds + LOD derived from zoom.
   */
  onViewportChange?:  (v: {
    bbox: [number, number, number, number];
    lod:  'low' | 'mid' | 'high';
    zoom: number;
  }) => void;
}

// ── Component ─────────────────────────────────────────────────────────────

const GridAtlasMap = forwardRef<GridAtlasMapHandle, GridAtlasMapProps>(
  function GridAtlasMap(
    {
      mapStyle, txGeoJson, plantGeoJson, hubGeoJson, outagesGeoJson,
      substationGeoJson, pipelineGeoJson, earthquakeGeoJson,
      weatherGeoJson,
      allUsGenerationGeoJson, allUsTransmissionGeoJson, allUsBatteriesGeoJson,
      showTx, showPlants, showNodes,
      showSubstations, showGasPipelines, showEarthquakes,
      showAllUsGeneration, showAllUsTransmission, showBatteries,
      onZoneClick, onPlantHover, onZoneHover,
      onGeneratorClick, onBatteryClick, onViewportChange,
    },
    ref,
  ) {
    const mapRef = useRef<MapRef>(null);
    const [styleLoaded, setStyleLoaded] = useState(false);

    // Derived terminus points for gas pipelines (first + last coord of each line)
    const pipelineTerminiGeoJson = useMemo(
      () => buildPipelineTermini(pipelineGeoJson),
      [pipelineGeoJson],
    );

    useImperativeHandle(ref, () => ({
      flyTo: (lon, lat, zoom) => {
        mapRef.current?.flyTo({
          center: [lon, lat],
          zoom,
          duration: 1400,
          essential: true,
        });
      },
    }));

    const onMapClick = useCallback((e: any) => {
      const features = e.features as any[];
      if (!features?.length) { onZoneClick(null); return; }
      const f = features[0];
      // Wave 5 — branch on the layer that produced the hit so the
      // asset detail panel and the legacy zone-select don't compete.
      if (f.layer?.id === 'all-us-gen-circle' && onGeneratorClick) {
        onGeneratorClick(f.properties as Record<string, unknown>);
        return;
      }
      if (f.layer?.id === 'all-us-batteries-circle' && onBatteryClick) {
        onBatteryClick(f.properties as Record<string, unknown>);
        return;
      }
      const zoneId =
        f?.properties?.zone_id ??
        f?.properties?.ZONE ??
        f?.properties?.name ??
        null;
      onZoneClick(zoneId);
    }, [onZoneClick, onGeneratorClick, onBatteryClick]);

    const onMouseMove = useCallback((e: any) => {
      const features = e.features as any[];
      if (!features?.length) {
        onPlantHover(null, 0, 0);
        onZoneHover(null);
        return;
      }
      const f = features[0];
      if (f.layer?.id === 'plant-circles' || f.layer?.id === 'plant-clusters') {
        onPlantHover(f.properties as Record<string, unknown>, e.point.x, e.point.y);
        onZoneHover(null);
      }
    }, [onPlantHover, onZoneHover]);

    const onMouseLeave = useCallback(() => {
      onPlantHover(null, 0, 0);
      onZoneHover(null);
    }, [onPlantHover, onZoneHover]);

    // Re-applies terrain + Standard style config + fog. Safe to call
    // on every `styledata` event so the look survives style swaps.
    const applyStyleSetup = useCallback(() => {
      const map = mapRef.current?.getMap();
      if (!map) return;

      try {
        if (!map.getSource('mapbox-dem')) {
          map.addSource('mapbox-dem', {
            type:     'raster-dem',
            url:      'mapbox://mapbox.mapbox-terrain-dem-v1',
            tileSize:  512,
            maxzoom:   14,
          });
        }
        map.setTerrain({ source: 'mapbox-dem', exaggeration: 1.5 });
      } catch { /* ignore */ }

      // Force Standard style config — `dusk` keeps the dark aesthetic
      // without the aggressive color darkening that `night` applies
      // to slot:'top' overlay layers (which crushes fuel/hub colors).
      try {
        map.setConfigProperty('basemap', 'lightPreset', 'dusk');
        map.setConfigProperty('basemap', 'showPointOfInterestLabels', false);
        map.setConfigProperty('basemap', 'showTransitLabels', false);
      } catch { /* style may not support config */ }

      try {
        map.setFog({
          color:            '#0A0A0B',
          'high-color':     '#0D1520',
          'horizon-blend':   0.04,
          'space-color':    C.bgBase,
          'star-intensity':  0.7,
        } as any);
      } catch { /* ignore */ }
    }, []);

    const onMapLoad = useCallback(() => {
      const map = mapRef.current?.getMap();
      if (!map) return;

      applyStyleSetup();
      setStyleLoaded(true);

      // Wave 5 — fire an initial onViewportChange so the bbox-driven
      // hooks in GridAtlasView can refresh from the resolved camera
      // (which may differ from the GridAtlasView seed, e.g. when a
      // returning user lands at a saved camera position).
      const b = map.getBounds();
      if (b && onViewportChange) {
        const zoom = map.getZoom();
        const lod: 'low' | 'mid' | 'high' =
          zoom <= 4 ? 'low' : zoom <= 7 ? 'mid' : 'high';
        onViewportChange({
          bbox: [b.getWest(), b.getSouth(), b.getEast(), b.getNorth()],
          lod,
          zoom,
        });
      }

      // Cinematic intro — only once per session.
      let introPlayed = false;
      try { introPlayed = sessionStorage.getItem(SS_INTRO_PLAYED) === '1'; } catch { /* ignore */ }
      const hasSavedCamera = !!readSavedCamera();

      if (!introPlayed && !hasSavedCamera) {
        // Small delay so the globe renders a frame before the fly-in.
        setTimeout(() => {
          map.flyTo({
            ...PJM_OVERVIEW,
            duration:  3500,
            essential: true,
            curve:     1.6,
            speed:     0.9,
          });
          try { sessionStorage.setItem(SS_INTRO_PLAYED, '1'); } catch { /* ignore */ }
        }, 350);
      }
    }, [applyStyleSetup, onViewportChange]);

    // Re-apply terrain/config whenever a new style loads (style swap).
    useEffect(() => {
      const map = mapRef.current?.getMap();
      if (!map) return;
      const handler = () => {
        if (!map.isStyleLoaded()) return;
        applyStyleSetup();
      };
      map.on('styledata', handler);
      return () => { try { map.off('styledata', handler); } catch { /* ignore */ } };
    }, [applyStyleSetup]);

    // Persist camera to sessionStorage so nav-away / nav-back restores position.
    // Wave 5 — same handler also fires onViewportChange (debounced 250ms via
    // a ref-held timer) so the bbox-driven hooks in GridAtlasView refetch
    // for the new viewport without spamming the network during a pan.
    const bboxFetchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const onMoveEnd = useCallback(() => {
      const map = mapRef.current?.getMap();
      if (!map) return;
      const c = map.getCenter();
      saveCamera({
        longitude: c.lng,
        latitude:  c.lat,
        zoom:      map.getZoom(),
        pitch:     map.getPitch(),
        bearing:   map.getBearing(),
      });

      // Debounced viewport fan-out — coalesce a flurry of moveends
      // (e.g. inertial pan) into a single fetch for the resting frame.
      if (bboxFetchTimer.current) clearTimeout(bboxFetchTimer.current);
      bboxFetchTimer.current = setTimeout(() => {
        const m = mapRef.current?.getMap();
        if (!m || !onViewportChange) return;
        const b = m.getBounds();
        if (!b) return;
        const zoom = m.getZoom();
        // LOD ladder — must match the backend's LodLevel ranges.
        const lod: 'low' | 'mid' | 'high' =
          zoom <= 4 ? 'low' : zoom <= 7 ? 'mid' : 'high';
        onViewportChange({
          bbox: [b.getWest(), b.getSouth(), b.getEast(), b.getNorth()],
          lod,
          zoom,
        });
      }, 250);
    }, [onViewportChange]);

    // Tear down the pending fetch timer on unmount so a stale callback
    // doesn't fire after the map is gone.
    useEffect(() => {
      return () => {
        if (bboxFetchTimer.current) clearTimeout(bboxFetchTimer.current);
      };
    }, []);

    const interactiveLayerIds = [
      ...(showPlants ? ['plant-circles', 'plant-clusters'] : []),
      ...(showNodes  ? ['hub-dots'] : []),
      // Wave 5 — clicking a single all-US generator opens the asset
      // detail panel via onGeneratorClick. Cluster bubbles aren't
      // interactive (would need a fly-into-cluster handler — future).
      ...(showAllUsGeneration ? ['all-us-gen-circle'] : []),
      ...(showBatteries       ? ['all-us-batteries-circle'] : []),
    ];

    return (
      <Map
        ref={mapRef}
        initialViewState={pickInitialView()}
        mapStyle={mapStyle}
        mapboxAccessToken={import.meta.env.VITE_MAPBOX_TOKEN as string}
        style={{ position: 'absolute', inset: 0 }}
        projection={{ name: 'globe' } as any}
        interactiveLayerIds={interactiveLayerIds}
        onClick={onMapClick}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
        onLoad={onMapLoad}
        onMoveEnd={onMoveEnd}
        cursor="crosshair"
      >
        {/* Transmission Lines */}
        {styleLoaded && showTx && txGeoJson && (
          <Source id="transmission" type="geojson" data={txGeoJson}>
            <Layer {...txGlowLayer} />
            <Layer {...txCoreLayer} />
          </Source>
        )}

        {/* All-US Transmission — Wave 5. Renders above the PJM-focused
            `transmission` source. LineString features pre-simplified
            backend-side to the requested LOD. ~50K segments at high LOD. */}
        {styleLoaded && showAllUsTransmission && allUsTransmissionGeoJson && (
          <Source id="all-us-transmission" type="geojson" data={allUsTransmissionGeoJson}>
            <Layer {...allUsTxGlowLayer} />
            <Layer {...allUsTxCoreLayer} />
          </Source>
        )}

        {/* Power Plants */}
        {styleLoaded && showPlants && plantGeoJson && (
          <Source
            id="plants" type="geojson" data={plantGeoJson}
            cluster={true} clusterMaxZoom={8} clusterRadius={40}
          >
            <Layer {...plantClusterLayer} />
            <Layer {...plantClusterCountLayer} />
            <Layer {...plantCircleFallback} />
          </Source>
        )}

        {/* All-US Generation — Wave 5. Renders above the PJM `plants`
            source. ~15K EIA generators clustered by Mapbox to z8.
            Source data flows from useGenerationUnits via a
            FeatureCollection adapter in GridAtlasView. */}
        {styleLoaded && showAllUsGeneration && allUsGenerationGeoJson && (
          <Source
            id="all-us-generation" type="geojson" data={allUsGenerationGeoJson}
            cluster={true} clusterMaxZoom={8} clusterRadius={40}
          >
            <Layer {...allUsGenClusterLayer} />
            <Layer {...allUsGenClusterCountLayer} />
            <Layer {...allUsGenCircleLayer} />
          </Source>
        )}

        {/* Battery storage — Wave 5. ~3-4k national fleet, no
            clustering. Status-coded stroke discriminates operating /
            under-construction / retired without an extra layer. */}
        {styleLoaded && showBatteries && allUsBatteriesGeoJson && (
          <Source id="all-us-batteries" type="geojson" data={allUsBatteriesGeoJson}>
            <Layer {...allUsBatteryCircleLayer} />
          </Source>
        )}

        {/* Hub Nodes */}
        {styleLoaded && showNodes && hubGeoJson && (
          <Source id="hub-nodes" type="geojson" data={hubGeoJson}>
            <Layer {...hubDotLayer} />
            <Layer {...hubLabelLayer} />
          </Source>
        )}

        {/* Gas Pipelines */}
        {styleLoaded && showGasPipelines && pipelineGeoJson && (
          <Source id="gas-pipelines" type="geojson" data={pipelineGeoJson}>
            <Layer {...gasPipelineGlowLayer} />
            <Layer {...gasPipelineLayer} />
          </Source>
        )}

        {/* Pipeline terminus markers — anchor every line end with a dot + label */}
        {styleLoaded && showGasPipelines && pipelineTerminiGeoJson.features.length > 0 && (
          <Source id="gas-pipeline-termini" type="geojson" data={pipelineTerminiGeoJson}>
            <Layer {...pipelineTerminusHaloLayer} />
            <Layer {...pipelineTerminusDotLayer} />
            <Layer {...pipelineTerminusLabelLayer} />
          </Source>
        )}

        {/* Substations */}
        {styleLoaded && showSubstations && substationGeoJson && (
          <Source id="substations" type="geojson" data={substationGeoJson}>
            <Layer {...substationLayer} />
            <Layer {...substationLabelLayer} />
          </Source>
        )}

        {/* Earthquakes */}
        {styleLoaded && showEarthquakes && earthquakeGeoJson && (
          <Source id="earthquakes" type="geojson" data={earthquakeGeoJson}>
            <Layer {...earthquakeLayer} />
            <Layer {...earthquakeLabelLayer} />
          </Source>
        )}

        {/* Outages — Wave 2 time-travel-driven generator outage rings.
            Source is keyed on `outages` so re-mounting the source on
            every snapshot change triggers a smooth Mapbox repaint. */}
        {styleLoaded && outagesGeoJson && outagesGeoJson.features.length > 0 && (
          <Source id="outages" type="geojson" data={outagesGeoJson}>
            <Layer {...outageHaloLayer} />
            <Layer {...outageRingLayer} />
            <Layer {...outageLabelLayer} />
          </Source>
        )}

        {/* Weather Overlay */}
        {styleLoaded && weatherGeoJson && (
          <Source id="weather" type="geojson" data={weatherGeoJson}>
            <Layer
              id="weather-wind"
              type="circle"
              paint={{
                'circle-radius': [
                  'interpolate', ['linear'],
                  ['get', 'wind_ms'],
                  0,  8,
                  5,  14,
                  10, 20,
                  15, 28,
                ] as any,
                'circle-color':        ['get', 'wind_color'] as any,
                'circle-opacity':       0.15,
                'circle-stroke-color': ['get', 'wind_color'] as any,
                'circle-stroke-width':  1.5,
                'circle-stroke-opacity': 0.7,
              }}
            />
            <Layer
              id="weather-labels"
              type="symbol"
              layout={{
                'text-field':   ['get', 'display_label'] as any,
                'text-size':     10,
                'text-font':    ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
                'text-offset':  [0, 2.2] as any,
                'text-anchor':  'top',
                'text-optional': true,
              }}
              paint={{
                'text-color':       ['get', 'temp_color'] as any,
                'text-halo-color':  'rgba(0,0,0,0.85)',
                'text-halo-width':   1.5,
              }}
            />
          </Source>
        )}
      </Map>
    );
  },
);

export default GridAtlasMap;
