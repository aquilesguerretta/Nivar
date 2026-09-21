// src/components/atlas/GridAtlasView.tsx
// Grid Atlas view — full Mapbox native layer map.
// react-map-gl Source+Layer renders everything inside Mapbox GPU pipeline.
// No deck.gl. No floating layers.

import {
  useState, useEffect, useRef, useCallback, useMemo, lazy, Suspense,
} from 'react';
import { C, F } from '@/design/tokens';
import { CardSkeleton } from '../shared/CardSkeleton';
import { ErrorBoundary } from '../shared/ErrorBoundary';
import { captureError } from '../../lib/shared/error-tracking';
import {
  CARTO_DARK, MAPBOX_SATELLITE, MAPBOX_TERRAIN, MAPBOX_MINIMAL,
  type GridAtlasMapHandle,
} from './GridAtlasMap';

import {
  useFuelMix,
  useBindingConstraints,
  useSubstations,
  useGasPipelines,
  useEarthquakes,
} from '../../hooks/data/useAtlasData';
import { useWeatherData } from '../../hooks/data/useWeatherData';

// Wave 2 — time travel infrastructure
import { useTimeTravelData } from '@/hooks/useTimeTravelData';
import { useTimeTravelStore } from '@/stores/timeTravelStore';
import { TimeTravelScrubber } from './TimeTravelScrubber';
// Wave 3 — fires the multi-zone /api/lmp/history fetch when an event is
// selected and pushes assembled snapshots back into the time-travel
// store. Side-effect-only; no return value.
import { useAtlasHistorical } from '@/hooks/data/useAtlasHistorical';
// Wave 5 — all-US infrastructure data hooks. Bbox-driven viewport fetches
// against CURSOR's /api/infra/* endpoints (or FOUNDRY mock fixtures
// under MOCK_MODE).
import { useGenerationUnits } from '@/hooks/data/useGenerationUnits';
import { useTransmissionSegments } from '@/hooks/data/useTransmissionSegments';
import { useBatteryAssets } from '@/hooks/data/useBatteryAssets';
import type {
  AssetStatus,
  BatteryAsset,
  FuelType,
  GenerationUnit,
  IsoMarket,
  LodLevel,
} from '@/lib/types/infrastructure';
import { AssetDetailPanel, type SelectedAsset } from './panels/AssetDetailPanel';

const GridAtlasMap = lazy(() => import('./GridAtlasMap'));

// ── Types ─────────────────────────────────────────────────────────────────

export type FuelFilter = {
  NG: boolean; NUC: boolean; WIND: boolean; SUN: boolean;
  COAL: boolean; WAT: boolean; BAT: boolean; GEO: boolean;
  OIL: boolean; OTHER: boolean;
};

export const DEFAULT_FUEL_FILTER: FuelFilter = {
  NG: true, NUC: true, WIND: true, SUN: true,
  COAL: true, WAT: true, BAT: true, GEO: true, OIL: true, OTHER: true,
};

interface PlantTooltip {
  name: string; fuel: string; capacity: number; state: string;
  x: number; y: number;
}

interface SearchResult {
  id: string; label: string; type: 'zone' | 'plant';
  lon: number; lat: number; zoom: number;
}

// ── Map style options ─────────────────────────────────────────────────────

const MAP_STYLES = [
  { id: 'terminal'  as const, label: 'TERMINAL',  style: CARTO_DARK         },
  { id: 'satellite' as const, label: 'SATELLITE', style: MAPBOX_SATELLITE   },
  { id: 'terrain'   as const, label: 'TERRAIN',   style: MAPBOX_TERRAIN     },
  { id: 'minimal'   as const, label: 'MINIMAL',   style: MAPBOX_MINIMAL     },
];
type MapStyleId = typeof MAP_STYLES[number]['id'];

// ── PJM hub centroids for search / map nodes ───────────────────────────────
// `lmp` is static demo $/MWh for extrusion height only — not live PJM (see V1 SSE / LMPCard).

const PJM_ZONES = [
  { id: 'WEST_HUB', label: 'WEST HUB', lon: -80.52, lat: 40.46, lmp: 35.9 },
  { id: 'COMED',    label: 'COMED',    lon: -87.83, lat: 41.76, lmp: 31.2 },
  { id: 'AEP',      label: 'AEP',      lon: -82.01, lat: 39.46, lmp: 32.4 },
  { id: 'ATSI',     label: 'ATSI',     lon: -81.24, lat: 41.08, lmp: 31.8 },
  { id: 'DAY',      label: 'DAY',      lon: -84.19, lat: 39.76, lmp: 32.1 },
  { id: 'DEOK',     label: 'DEOK',     lon: -84.51, lat: 38.74, lmp: 31.5 },
  { id: 'DUQ',      label: 'DUQ',      lon: -79.99, lat: 40.44, lmp: 33.2 },
  { id: 'DOMINION', label: 'DOMINION', lon: -77.46, lat: 37.54, lmp: 34.1 },
  { id: 'DPL',      label: 'DPL',      lon: -75.52, lat: 38.91, lmp: 33.8 },
  { id: 'EKPC',     label: 'EKPC',     lon: -83.94, lat: 37.78, lmp: 30.9 },
  { id: 'PPL',      label: 'PPL',      lon: -76.30, lat: 40.90, lmp: 33.5 },
  { id: 'PECO',     label: 'PECO',     lon: -75.37, lat: 40.00, lmp: 34.2 },
  { id: 'PSEG',     label: 'PSEG',     lon: -74.41, lat: 40.56, lmp: 35.1 },
  { id: 'JCPL',     label: 'JCPL',     lon: -74.37, lat: 40.10, lmp: 34.7 },
  { id: 'PEPCO',    label: 'PEPCO',    lon: -77.01, lat: 38.91, lmp: 33.9 },
  { id: 'BGE',      label: 'BGE',      lon: -76.61, lat: 39.29, lmp: 33.6 },
  { id: 'METED',    label: 'METED',    lon: -76.02, lat: 40.32, lmp: 33.4 },
  { id: 'PENELEC',  label: 'PENELEC',  lon: -79.10, lat: 41.00, lmp: 32.8 },
  { id: 'RECO',     label: 'RECO',     lon: -74.10, lat: 41.12, lmp: 36.6 },
  { id: 'OVEC',     label: 'OVEC',     lon: -82.52, lat: 38.72, lmp: 31.1 },
];

// ── Fuel filter UI metadata ───────────────────────────────────────────────

const FUEL_UI = [
  { key: 'NG'   as keyof FuelFilter, label: 'Natural Gas', color: '#E67E22' },
  { key: 'NUC'  as keyof FuelFilter, label: 'Nuclear',     color: '#9B59B6' },
  { key: 'WIND' as keyof FuelFilter, label: 'Wind',        color: '#00A3FF' },
  { key: 'SUN'  as keyof FuelFilter, label: 'Solar',       color: '#F1C40F' },
  { key: 'COAL' as keyof FuelFilter, label: 'Coal',        color: '#636E72' },
  { key: 'WAT'  as keyof FuelFilter, label: 'Hydro',       color: '#3498DB' },
  { key: 'BAT'  as keyof FuelFilter, label: 'Battery',     color: '#00E676' },
  { key: 'GEO'  as keyof FuelFilter, label: 'Geothermal',  color: '#FF6B35' },
  { key: 'OIL'  as keyof FuelFilter, label: 'Oil',         color: '#A0522D' },
  { key: 'OTHER'as keyof FuelFilter, label: 'Other',       color: '#BDC3C7' },
];

/** PJM API fuel_type strings vary ("Gas", "Natural Gas", …) — match loosely for bar colors. */
function fuelMixBarColor(type: string): string {
  const t = type.toLowerCase();
  if (t.includes('gas')) return '#E67E22';
  if (t.includes('nuclear')) return '#9B59B6';
  if (t.includes('wind')) return '#00A3FF';
  if (t.includes('solar')) return '#F1C40F';
  if (t.includes('coal')) return '#636E72';
  if (t.includes('hydro') || t.includes('water')) return '#3498DB';
  if (t.includes('storage') || t.includes('battery')) return '#00E676';
  if (t.includes('oil') || t.includes('diesel')) return '#A0522D';
  return '#BDC3C7';
}

// ── Helper: filter plant GeoJSON by fuel and min capacity ─────────────────

function filterPlants(
  geojson: GeoJSON.FeatureCollection | null,
  fuelFilter: FuelFilter,
  minCap: number,
): GeoJSON.FeatureCollection | null {
  if (!geojson) return null;
  const fuelKey = (raw: string): keyof FuelFilter => {
    const n = (raw ?? '').toUpperCase().trim();
    if (n === 'NG' || n === 'GAS') return 'NG';
    if (n === 'NUC' || n === 'NUCLEAR') return 'NUC';
    if (n === 'WIND' || n === 'WND') return 'WIND';
    if (n === 'SUN' || n === 'SOLAR') return 'SUN';
    if (n === 'COAL' || n === 'COL') return 'COAL';
    if (n === 'WAT' || n === 'HYDRO') return 'WAT';
    if (n === 'BAT') return 'BAT';
    if (n === 'GEO') return 'GEO';
    if (n === 'OIL') return 'OIL';
    return 'OTHER';
  };
  const fuelIconMap: Record<string, string> = {
    NG: 'fuel-gas', GAS: 'fuel-gas',
    NUC: 'fuel-nuclear', NUCLEAR: 'fuel-nuclear',
    WIND: 'fuel-wind', WND: 'fuel-wind',
    SUN: 'fuel-solar', SOLAR: 'fuel-solar',
    COAL: 'fuel-coal', COL: 'fuel-coal',
    WAT: 'fuel-hydro', HYDRO: 'fuel-hydro',
    BAT: 'fuel-battery',
    GEO: 'fuel-geo',
    OIL: 'fuel-oil',
  };

  return {
    ...geojson,
    features: geojson.features
      .filter(f => {
        const p    = f.properties as Record<string, unknown>;
        const fuel = fuelKey((p?.PRIM_FUEL ?? p?.fuel_type ?? '') as string);
        const cap  = ((p?.INSTALL_MW ?? p?.capacity_mw ?? 0) as number);
        return fuelFilter[fuel] && cap >= minCap;
      })
      .map(f => {
        const raw = ((f.properties as Record<string, unknown>)?.PRIM_FUEL ??
                     (f.properties as Record<string, unknown>)?.fuel_type ?? '') as string;
        return {
          ...f,
          properties: {
            ...f.properties,
            fuel_icon: fuelIconMap[raw.toUpperCase()] ?? 'fuel-default',
          },
        };
      }),
  };
}

// ── Mock infrastructure data (replaced by backend when live) ──────────────

const MOCK_GAS_PIPELINES: GeoJSON.FeatureCollection = {
  type: 'FeatureCollection',
  features: [
    { type:'Feature', properties:{ NAME:'Transcontinental Gas Pipeline', OPERATOR:'Williams' }, geometry:{ type:'LineString', coordinates:[[-80.5,36.8],[-79.2,37.4],[-77.5,38.2],[-76.1,39.0],[-75.2,39.8],[-74.5,40.5],[-74.0,40.9]] } },
    { type:'Feature', properties:{ NAME:'Tennessee Gas Pipeline', OPERATOR:'Kinder Morgan' }, geometry:{ type:'LineString', coordinates:[[-88.5,39.2],[-86.8,39.5],[-84.9,39.8],[-83.2,40.1],[-81.5,40.4],[-79.8,40.6],[-78.1,40.8],[-76.4,41.0],[-74.9,41.2]] } },
    { type:'Feature', properties:{ NAME:'Columbia Gas Transmission', OPERATOR:'TC Energy' }, geometry:{ type:'LineString', coordinates:[[-82.5,38.2],[-81.2,38.8],[-79.9,39.4],[-78.6,39.9],[-77.3,40.3],[-76.0,40.7],[-74.8,40.9]] } },
    { type:'Feature', properties:{ NAME:'Texas Eastern Transmission', OPERATOR:'Enbridge' }, geometry:{ type:'LineString', coordinates:[[-89.2,38.5],[-87.5,38.9],[-85.8,39.3],[-84.1,39.7],[-82.4,40.1],[-80.7,40.4],[-79.0,40.7],[-77.3,41.0],[-75.6,41.2],[-74.1,40.8]] } },
    { type:'Feature', properties:{ NAME:'Iroquois Gas Transmission', OPERATOR:'Iroquois' }, geometry:{ type:'LineString', coordinates:[[-74.2,41.5],[-73.8,41.8],[-73.3,42.1],[-72.8,42.3]] } },
    { type:'Feature', properties:{ NAME:'Rockies Express Pipeline', OPERATOR:'Tallgrass' }, geometry:{ type:'LineString', coordinates:[[-90.5,39.8],[-88.8,39.9],[-87.1,40.0],[-85.4,40.1],[-83.7,40.2],[-82.0,40.3],[-80.3,40.3]] } },
    { type:'Feature', properties:{ NAME:'Eastern Gas Transmission', OPERATOR:'EQT' }, geometry:{ type:'LineString', coordinates:[[-80.2,39.8],[-79.0,39.9],[-77.8,40.1],[-76.5,40.4],[-75.3,40.6]] } },
    { type:'Feature', properties:{ NAME:'Algonquin Gas Transmission', OPERATOR:'Enbridge' }, geometry:{ type:'LineString', coordinates:[[-74.1,40.7],[-73.5,41.1],[-72.9,41.4],[-72.1,41.6],[-71.5,41.8],[-71.0,42.0]] } },
  ],
};

const MOCK_SUBSTATIONS: GeoJSON.FeatureCollection = {
  type: 'FeatureCollection',
  features: [
    { type:'Feature', properties:{ NAME:'Susquehanna', VOLTAGE:500 }, geometry:{ type:'Point', coordinates:[-76.15,41.10] } },
    { type:'Feature', properties:{ NAME:'Juniata', VOLTAGE:500 }, geometry:{ type:'Point', coordinates:[-77.86,40.47] } },
    { type:'Feature', properties:{ NAME:'Keystone', VOLTAGE:500 }, geometry:{ type:'Point', coordinates:[-79.20,40.55] } },
    { type:'Feature', properties:{ NAME:'Tabb', VOLTAGE:500 }, geometry:{ type:'Point', coordinates:[-76.42,37.09] } },
    { type:'Feature', properties:{ NAME:'Doubs', VOLTAGE:500 }, geometry:{ type:'Point', coordinates:[-77.38,39.42] } },
    { type:'Feature', properties:{ NAME:'Kemptown', VOLTAGE:500 }, geometry:{ type:'Point', coordinates:[-77.22,39.38] } },
    { type:'Feature', properties:{ NAME:'Meadow Brook', VOLTAGE:500 }, geometry:{ type:'Point', coordinates:[-77.55,38.95] } },
    { type:'Feature', properties:{ NAME:'Elroy', VOLTAGE:345 }, geometry:{ type:'Point', coordinates:[-75.31,40.08] } },
    { type:'Feature', properties:{ NAME:'Burlington', VOLTAGE:345 }, geometry:{ type:'Point', coordinates:[-74.88,39.95] } },
    { type:'Feature', properties:{ NAME:'Otter Creek', VOLTAGE:345 }, geometry:{ type:'Point', coordinates:[-82.54,41.32] } },
    { type:'Feature', properties:{ NAME:'Beaver', VOLTAGE:345 }, geometry:{ type:'Point', coordinates:[-80.34,40.75] } },
    { type:'Feature', properties:{ NAME:'Hatfield Ferry', VOLTAGE:345 }, geometry:{ type:'Point', coordinates:[-80.13,39.88] } },
    { type:'Feature', properties:{ NAME:'Tidd', VOLTAGE:345 }, geometry:{ type:'Point', coordinates:[-80.70,40.35] } },
    { type:'Feature', properties:{ NAME:'Marysville', VOLTAGE:230 }, geometry:{ type:'Point', coordinates:[-77.02,40.08] } },
    { type:'Feature', properties:{ NAME:'Peach Bottom', VOLTAGE:230 }, geometry:{ type:'Point', coordinates:[-76.27,39.76] } },
    { type:'Feature', properties:{ NAME:'Plymouth Meeting', VOLTAGE:230 }, geometry:{ type:'Point', coordinates:[-75.28,40.10] } },
    { type:'Feature', properties:{ NAME:'Whitpain', VOLTAGE:230 }, geometry:{ type:'Point', coordinates:[-75.32,40.14] } },
    { type:'Feature', properties:{ NAME:'Conemaugh', VOLTAGE:230 }, geometry:{ type:'Point', coordinates:[-79.14,40.46] } },
    { type:'Feature', properties:{ NAME:'Wylie Ridge', VOLTAGE:230 }, geometry:{ type:'Point', coordinates:[-80.03,39.76] } },
    { type:'Feature', properties:{ NAME:'Greensburg', VOLTAGE:230 }, geometry:{ type:'Point', coordinates:[-79.53,40.30] } },
    { type:'Feature', properties:{ NAME:'Cresap', VOLTAGE:230 }, geometry:{ type:'Point', coordinates:[-79.05,39.55] } },
    { type:'Feature', properties:{ NAME:'Loudoun', VOLTAGE:230 }, geometry:{ type:'Point', coordinates:[-77.62,38.98] } },
    { type:'Feature', properties:{ NAME:'Ox', VOLTAGE:230 }, geometry:{ type:'Point', coordinates:[-77.35,38.78] } },
    { type:'Feature', properties:{ NAME:'Possum Point', VOLTAGE:230 }, geometry:{ type:'Point', coordinates:[-77.23,38.57] } },
    { type:'Feature', properties:{ NAME:'Chalk Point', VOLTAGE:230 }, geometry:{ type:'Point', coordinates:[-76.67,38.53] } },
    { type:'Feature', properties:{ NAME:'Conastone', VOLTAGE:115 }, geometry:{ type:'Point', coordinates:[-76.17,39.55] } },
    { type:'Feature', properties:{ NAME:'Stony Point', VOLTAGE:115 }, geometry:{ type:'Point', coordinates:[-74.02,41.23] } },
    { type:'Feature', properties:{ NAME:'Lambertville', VOLTAGE:115 }, geometry:{ type:'Point', coordinates:[-74.94,40.37] } },
    { type:'Feature', properties:{ NAME:'Mickleton', VOLTAGE:115 }, geometry:{ type:'Point', coordinates:[-75.24,39.79] } },
    { type:'Feature', properties:{ NAME:'Elsinboro', VOLTAGE:115 }, geometry:{ type:'Point', coordinates:[-75.46,39.49] } },
  ],
};

// Wave 2 swap: the legacy 49-frame `buildLMPFrames` system was replaced
// by the typed AtlasSnapshot pipeline (see src/lib/atlas/historicalSnapshots.ts
// + src/hooks/useTimeTravelData.ts). The map now consumes a single snapshot
// per render — produced by the historical buffer (live/scrubbed) or the
// curated event library (event-replay).

// ── Left panel icon definitions ───────────────────────────────────────────

type PanelId = 'search' | 'layers' | 'fuel' | 'intel' | 'style';

const PANEL_ICONS: Array<{ id: PanelId; icon: string; label: string }> = [
  { id: 'search', icon: '\u2315', label: 'Search' },
  { id: 'layers', icon: '\u25A3', label: 'Layers' },
  { id: 'fuel',   icon: '\u26A1', label: 'Fuel type' },
  { id: 'intel',  icon: '\u25CE', label: 'Intelligence' },
  { id: 'style',  icon: '\u25D4', label: 'Map style' },
];

// ── Main component ────────────────────────────────────────────────────────

export default function GridAtlasView() {
  // Layer visibility
  const [showTx,        setShowTx]        = useState(true);
  const [showPlants,    setShowPlants]    = useState(true);
  const [showNodes,     setShowNodes]     = useState(true);
  const [showSubstations,    setShowSubstations]    = useState(false);
  const [showGasPipelines,   setShowGasPipelines]   = useState(false);
  const [showEarthquakes,    setShowEarthquakes]    = useState(true);
  const [showWeather,        setShowWeather]        = useState(true);
  // Wave 5 — all-US infrastructure layer toggles (off by default so
  // first-time visitors see the curated PJM view; one click reveals
  // the national surface).
  const [showAllUsGeneration,   setShowAllUsGeneration]   = useState(false);
  const [showAllUsTransmission, setShowAllUsTransmission] = useState(false);
  const [showBatteries,         setShowBatteries]         = useState(false);

  // Wave 5 — selected asset for the top-right detail panel. Cleared on
  // close (✕ click, ESC key, or click outside any asset dot).
  const [selectedAsset, setSelectedAsset] = useState<SelectedAsset | null>(null);

  // Map style
  const [activeStyle, setActiveStyle] = useState<MapStyleId>('terminal');

  // Wave 5 — current viewport bbox + LOD. Phase 6 wires onMoveEnd to
  // refresh these from the live map. Until then we seed with a CONUS
  // bbox at low LOD so the layers render the full mock fixture set
  // immediately on mount.
  const [viewport, setViewport] = useState<{
    bbox: [number, number, number, number];
    lod:  LodLevel;
    zoom: number;
  }>({
    bbox: [-125, 24, -66, 49],
    lod:  'low',
    zoom: 5.5,
  });

  // Zone / plant interaction
  const [selectedZone,  setSelectedZone]  = useState<string | null>(null);
  const [hoveredZone,   setHoveredZone]   = useState<string | null>(null);
  const [plantTooltip,  setPlantTooltip]  = useState<PlantTooltip | null>(null);

  // Fuel filters
  const [fuelFilter,  setFuelFilter]  = useState<FuelFilter>(DEFAULT_FUEL_FILTER);
  const [minCapacity, setMinCapacity] = useState(0);

  // GeoJSON data
  const [txGeoJson,    setTxGeoJson]    = useState<GeoJSON.FeatureCollection | null>(null);
  const [rawPlants,    setRawPlants]    = useState<GeoJSON.FeatureCollection | null>(null);

  // Search
  const [searchQuery,   setSearchQuery]   = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [showResults,   setShowResults]   = useState(false);

  // Which left-panel icon is expanded (null = all collapsed to icon rail).
  const [expandedPanel, setExpandedPanel] = useState<PanelId | null>(null);

  // Wave 2 — derive every time-driven map input from the AtlasSnapshot.
  const snapshot   = useTimeTravelData();
  const ttMode     = useTimeTravelStore((s) => s.mode);
  const isLiveFrame = ttMode === 'live';

  // Wave 3 — mount the event-load orchestrator. Watches activeEventId
  // on the store and fires fetchHistoricalWindow when a named event
  // is selected. Side-effect-only; no render contribution.
  useAtlasHistorical();

  // Wave 5 — bbox-driven viewport queries. Pass `null` to disable each
  // hook when its layer is toggled off; the hooks return empty data
  // shapes and the layer renders nothing.
  const generation = useGenerationUnits(
    showAllUsGeneration ? { bbox: viewport.bbox, limit: 5000 } : null,
  );

  // Adapter: GenerationUnit[] → GeoJSON.FeatureCollection. Mapbox cluster
  // sources need this exact shape; we pass through every typed property
  // so onClick handlers can read the unit fields off the feature.
  const allUsGenerationGeoJson = useMemo<GeoJSON.FeatureCollection>(() => ({
    type: 'FeatureCollection',
    features: generation.data.map((g) => ({
      type: 'Feature' as const,
      properties: {
        id:             g.id,
        name:           g.name,
        owner:          g.owner,
        iso:            g.iso,
        state:          g.state,
        fuel:           g.fuel,
        capacityMw:     g.capacityMw,
        status:         g.status,
        codDate:        g.codDate,
        retirementDate: g.retirementDate,
        eiaPlantId:     g.eiaPlantId,
        eiaGeneratorId: g.eiaGeneratorId,
        kind:           'generation' as const,
      },
      geometry: { type: 'Point' as const, coordinates: [g.lon, g.lat] },
    })),
  }), [generation.data]);

  // Wave 5 — transmission. LOD passes through to the backend so the
  // returned geometry is already simplified to the requested precision.
  const transmission = useTransmissionSegments(
    showAllUsTransmission ? { bbox: viewport.bbox, lod: viewport.lod, limit: 10000 } : null,
  );

  const allUsTransmissionGeoJson = useMemo<GeoJSON.FeatureCollection>(() => ({
    type: 'FeatureCollection',
    features: transmission.data.map((t) => ({
      type: 'Feature' as const,
      properties: {
        id:              t.id,
        name:            t.name,
        owner:           t.owner,
        iso:             t.iso,
        // The new schema uses numeric voltage_kv — colorRamps reads this.
        voltage_kv:      t.voltageKv,
        segmentLengthKm: t.segmentLengthKm,
        kind:            'transmission' as const,
      },
      geometry: { type: 'LineString' as const, coordinates: t.geometry },
    })),
  }), [transmission.data]);

  // Wave 5 — battery storage. No clustering; the layer renders every
  // result. Server returns totalMw / totalMwh aggregates which the
  // intel panel consumes directly (Phase 8).
  const batteries = useBatteryAssets(
    showBatteries ? { bbox: viewport.bbox, limit: 5000 } : null,
  );

  // Wave 5 — national readouts derived from the viewport-resident
  // datasets. Computed in the view (not the hook) so the intel panel
  // can mix server-side aggregates (batteries.totalMw / totalMwh)
  // with client-side rollups (top fuels, transmission km) under one
  // memo umbrella.
  const nationalTopFuels = useMemo<Array<{ fuel: FuelType; mw: number }>>(() => {
    if (generation.data.length === 0) return [];
    const byFuel = new Map<FuelType, number>();
    for (const g of generation.data) {
      byFuel.set(g.fuel, (byFuel.get(g.fuel) ?? 0) + g.capacityMw);
    }
    return Array.from(byFuel.entries())
      .map(([fuel, mw]) => ({ fuel, mw }))
      .sort((a, b) => b.mw - a.mw)
      .slice(0, 5);
  }, [generation.data]);

  const nationalTxKm = useMemo<number>(
    () => transmission.data.reduce((sum, t) => sum + t.segmentLengthKm, 0),
    [transmission.data],
  );

  // True if any all-US layer is active — gates the "NATIONAL · VIEWPORT"
  // section in the intel panel.
  const hasAllUsLayerOn = showAllUsGeneration || showAllUsTransmission || showBatteries;

  const allUsBatteriesGeoJson = useMemo<GeoJSON.FeatureCollection>(() => ({
    type: 'FeatureCollection',
    features: batteries.data.map((b) => ({
      type: 'Feature' as const,
      properties: {
        id:             b.id,
        name:           b.name,
        owner:          b.owner,
        iso:            b.iso,
        state:          b.state,
        capacityMw:     b.capacityMw,
        capacityMwh:    b.capacityMwh,
        durationHours:  b.durationHours,
        status:         b.status,
        codDate:        b.codDate,
        retirementDate: b.retirementDate,
        eiaPlantId:     b.eiaPlantId,
        eiaGeneratorId: b.eiaGeneratorId,
        kind:           'battery' as const,
      },
      geometry: { type: 'Point' as const, coordinates: [b.lon, b.lat] },
    })),
  }), [batteries.data]);

  // Live data hooks (gracefully return empty when backend not ready)
  // Note: live useOutages() is replaced by snapshot.outages — the time-travel
  // pipeline is the single source of truth for outage state on the map.
  const { data: fuelMixData,    live: fuelLive   } = useFuelMix();
  const { data: constraintData } = useBindingConstraints();
  const { data: substationGeoJsonBackend } = useSubstations();
  const { data: pipelineGeoJsonBackend }   = useGasPipelines();
  const substationGeoJson = substationGeoJsonBackend ?? MOCK_SUBSTATIONS;
  const pipelineGeoJson   = pipelineGeoJsonBackend   ?? MOCK_GAS_PIPELINES;
  const earthquakeGeoJson            = useEarthquakes();
  const { data: weatherData, live: weatherLive } = useWeatherData();

  const totalOutageMW = useMemo(
    () => snapshot.outages.reduce((sum, o) => sum + o.mw, 0),
    [snapshot.outages],
  );

  const weatherGeoJson = useMemo((): GeoJSON.FeatureCollection => ({
    type: 'FeatureCollection',
    features: weatherData.points.map(p => ({
      type: 'Feature',
      properties: {
        label:       p.label,
        temp_c:      p.temperature_c,
        temp_f:      Math.round(p.temperature_c * 9/5 + 32),
        wind_ms:     p.wind_speed_ms,
        wind_mph:    Math.round(p.wind_speed_ms * 2.237),
        wind_dir:    p.wind_direction_deg,
        cloud_pct:   p.cloud_cover_pct,
        precip_mm:   p.precip_mm,
        wind_color:  p.wind_speed_ms < 4 ? '#00A3FF'
                   : p.wind_speed_ms < 8 ? '#FFB800'
                   : '#FF3B3B',
        temp_color:  p.temperature_c < 5  ? '#00A3FF'
                   : p.temperature_c < 20 ? C.textPrimary
                   : '#FF3B3B',
        display_label: `${p.label}\n${Math.round(p.temperature_c * 9/5 + 32)}°F · ${Math.round(p.wind_speed_ms * 2.237)}mph`,
      },
      geometry: { type: 'Point' as const, coordinates: [p.lon, p.lat] },
    })),
  }), [weatherData]);

  // Map ref for flyTo
  const mapRef = useRef<GridAtlasMapHandle>(null);

  // Load all GeoJSON on mount
  useEffect(() => {
    fetch('/data/transmission-lines.geojson')
      .then(r => { if (!r.ok) throw new Error(`${r.status}`); return r.json(); })
      .then((d: GeoJSON.FeatureCollection) => setTxGeoJson(d))
      .catch(() => { /* tx lines file may not exist — gracefully skip */ });

    fetch('/data/power-plants.geojson')
      .then(r => r.json())
      .then((d: GeoJSON.FeatureCollection) => setRawPlants(d))
      .catch(err => captureError(err, { context: 'plants-fetch' }));
  }, []);

  // Filtered plant GeoJSON
  const plantGeoJson = filterPlants(rawPlants, fuelFilter, minCapacity);

  // Build hub node GeoJSON from PJM_ZONES centroids. LMP is driven by the
  // AtlasSnapshot — hub dot colors animate as the scrubber moves through
  // the historical buffer or an event timeline.
  const hubGeoJson: GeoJSON.FeatureCollection = useMemo(() => {
    return {
      type: 'FeatureCollection',
      features: PJM_ZONES.map(z => ({
        type: 'Feature' as const,
        properties: {
          id:    z.id,
          label: z.label,
          lmp:   snapshot.zoneStates[z.id]?.lmp ?? z.lmp ?? 33,
        },
        geometry: { type: 'Point' as const, coordinates: [z.lon, z.lat] },
      })),
    };
  }, [snapshot.zoneStates]);

  // Outage markers — one feature per active outage in the current snapshot.
  // Markers fade in/out as outages enter/leave the snapshot's roster.
  const outagesGeoJson: GeoJSON.FeatureCollection = useMemo(() => ({
    type: 'FeatureCollection',
    features: snapshot.outages.map((o) => ({
      type: 'Feature' as const,
      properties: {
        id:   o.id,
        name: o.name,
        zone: o.zone,
        mw:   o.mw,
        fuel: o.fuel,
        kind: o.kind,
      },
      geometry: { type: 'Point' as const, coordinates: [o.lon, o.lat] },
    })),
  }), [snapshot.outages]);

  // Search
  const handleSearch = useCallback((q: string) => {
    setSearchQuery(q);
    if (q.length < 2) { setSearchResults([]); setShowResults(false); return; }
    const upper   = q.toUpperCase();
    const results: SearchResult[] = [];

    PJM_ZONES
      .filter(z => z.label.includes(upper) || z.id.includes(upper))
      .forEach(z => results.push({
        id: z.id, label: z.label, type: 'zone',
        lon: z.lon, lat: z.lat, zoom: 8,
      }));

    if (rawPlants) {
      rawPlants.features
        .filter(f => {
          const n = ((f.properties?.NAME ?? f.properties?.name ?? '') as string).toUpperCase();
          return n.includes(upper);
        })
        .slice(0, 6)
        .forEach(f => {
          const coords = (f.geometry as GeoJSON.Point).coordinates;
          const name   = (f.properties?.NAME ?? f.properties?.name ?? 'Unknown') as string;
          results.push({
            id: name, label: name, type: 'plant',
            lon: coords[0] as number, lat: coords[1] as number, zoom: 13,
          });
        });
    }
    setSearchResults(results.slice(0, 8));
    setShowResults(results.length > 0);
  }, [rawPlants]);

  const handleSelectResult = useCallback((r: SearchResult) => {
    setSearchQuery(r.label);
    setShowResults(false);
    mapRef.current?.flyTo(r.lon, r.lat, r.zoom);
    if (r.type === 'zone') setSelectedZone(r.id);
  }, []);

  // Plant hover handler
  const handlePlantHover = useCallback(
    (props: Record<string, unknown> | null, x: number, y: number) => {
      if (!props) { setPlantTooltip(null); return; }
      setPlantTooltip({
        name:     (props.NAME ?? props.name ?? 'Unknown') as string,
        fuel:     (props.PRIM_FUEL ?? props.fuel_type ?? '') as string,
        capacity: (props.INSTALL_MW ?? props.capacity_mw ?? 0) as number,
        state:    (props.STATE ?? props.state ?? '') as string,
        x, y,
      });
    },
    [],
  );

  const toggleFuel = (key: keyof FuelFilter) =>
    setFuelFilter(prev => ({ ...prev, [key]: !prev[key] }));

  const allOn   = Object.values(fuelFilter).every(Boolean);
  const toggleAll = () => setFuelFilter(
    Object.fromEntries(Object.keys(fuelFilter).map(k => [k, !allOn])) as FuelFilter,
  );

  const currentStyle = MAP_STYLES.find(s => s.id === activeStyle)!.style;
  const plantCount   = plantGeoJson?.features.length ?? 0;

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>

      {/* ── Map ───────────────────────────────────────── */}
      <ErrorBoundary label="GRID ATLAS">
        <Suspense fallback={<CardSkeleton rows={4} />}>
          <GridAtlasMap
            ref={mapRef}
            mapStyle={currentStyle}
            txGeoJson={txGeoJson}
            plantGeoJson={plantGeoJson}
            hubGeoJson={hubGeoJson}
            outagesGeoJson={outagesGeoJson}
            substationGeoJson={substationGeoJson}
            pipelineGeoJson={pipelineGeoJson}
            earthquakeGeoJson={earthquakeGeoJson}
            allUsGenerationGeoJson={allUsGenerationGeoJson}
            allUsTransmissionGeoJson={allUsTransmissionGeoJson}
            allUsBatteriesGeoJson={allUsBatteriesGeoJson}
            showTx={showTx}
            showPlants={showPlants}
            showNodes={showNodes}
            showSubstations={showSubstations}
            showGasPipelines={showGasPipelines}
            showEarthquakes={showEarthquakes}
            showAllUsGeneration={showAllUsGeneration}
            showAllUsTransmission={showAllUsTransmission}
            showBatteries={showBatteries}
            weatherGeoJson={showWeather ? weatherGeoJson : null}
            onZoneClick={setSelectedZone}
            onPlantHover={handlePlantHover}
            onZoneHover={setHoveredZone}
            onViewportChange={setViewport}
            onGeneratorClick={(props) => {
              // Reconstruct the typed shape from the unwrapped Mapbox
              // properties bag. Mapbox returns a flat object; we cast
              // back to the FOUNDRY contract (lat/lon are absent on
              // the props since they live on the geometry — the panel
              // doesn't render them).
              const p = props as Record<string, unknown>;
              setSelectedAsset({
                kind:           'generation',
                id:             String(p.id ?? ''),
                eiaPlantId:     (p.eiaPlantId as number | null) ?? null,
                eiaGeneratorId: (p.eiaGeneratorId as string | null) ?? null,
                name:           String(p.name ?? 'Unknown'),
                owner:          (p.owner as string | null) ?? null,
                iso:            (p.iso as IsoMarket) ?? 'OTHER',
                state:          String(p.state ?? '—'),
                lat:            0,
                lon:            0,
                fuel:           (p.fuel as FuelType) ?? 'other',
                capacityMw:     Number(p.capacityMw ?? 0),
                status:         (p.status as AssetStatus) ?? 'operating',
                codDate:        (p.codDate as string | null) ?? null,
                retirementDate: (p.retirementDate as string | null) ?? null,
              } satisfies { kind: 'generation' } & GenerationUnit);
            }}
            onBatteryClick={(props) => {
              const p = props as Record<string, unknown>;
              setSelectedAsset({
                kind:           'battery',
                id:             String(p.id ?? ''),
                eiaPlantId:     (p.eiaPlantId as number | null) ?? null,
                eiaGeneratorId: (p.eiaGeneratorId as string | null) ?? null,
                name:           String(p.name ?? 'Unknown'),
                owner:          (p.owner as string | null) ?? null,
                iso:            (p.iso as IsoMarket) ?? 'OTHER',
                state:          String(p.state ?? '—'),
                lat:            0,
                lon:            0,
                capacityMw:     Number(p.capacityMw ?? 0),
                capacityMwh:    (p.capacityMwh as number | null) ?? null,
                durationHours:  (p.durationHours as number | null) ?? null,
                status:         (p.status as AssetStatus) ?? 'operating',
                codDate:        (p.codDate as string | null) ?? null,
                retirementDate: (p.retirementDate as string | null) ?? null,
              } satisfies { kind: 'battery' } & BatteryAsset);
            }}
          />
        </Suspense>
      </ErrorBoundary>

      {/* ── Top status bar ───────────────────────────── */}
      <div style={{
        position: 'absolute', top: 12, left: '50%',
        transform: 'translateX(-50%)', zIndex: 10,
        display: 'flex', alignItems: 'center', gap: 12,
        pointerEvents: 'none', whiteSpace: 'nowrap',
      }}>
        <div style={{
          background: 'rgba(10,10,11,0.88)',
          border: `1px solid ${isLiveFrame ? C.borderDefault : 'rgba(245,158,11,0.4)'}`,
          borderRadius: 20, padding: '6px 18px',
          backdropFilter: 'blur(12px)',
          display: 'flex', alignItems: 'center', gap: 8,
        }}>
          {isLiveFrame ? (
            <>
              <span style={{
                display: 'inline-block', width: 6, height: 6, borderRadius: '50%',
                background: '#10B981',
                boxShadow: '0 0 6px rgba(16,185,129,0.8)',
              }} />
              <span style={{ fontFamily: F.mono, fontSize: '0.65rem', color: C.electricBlue, letterSpacing: '0.15em' }}>
                PJM · REAL-TIME · 5-MIN DISPATCH
              </span>
              <span style={{ fontFamily: F.mono, fontSize: '0.6rem', color: '#10B981', letterSpacing: '0.15em' }}>
                · LIVE
              </span>
            </>
          ) : (
            <>
              <span style={{ fontFamily: F.mono, fontSize: '0.65rem', color: '#FBBF24', letterSpacing: '0.15em' }}>
                PJM · {ttMode === 'event-replay' ? 'EVENT REPLAY' : 'HISTORICAL'} · {new Date(snapshot.timestamp).toLocaleString('en-US', {
                  month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit', timeZone: 'America/New_York',
                })} EPT
              </span>
            </>
          )}
        </div>
        <div style={{
          background: 'rgba(10,10,11,0.88)',
          border: `1px solid ${C.borderDefault}`,
          borderRadius: 6, padding: '5px 14px',
          backdropFilter: 'blur(12px)',
          display: 'flex', gap: 16,
        }}>
          {[
            { label: 'ZONES',   value: '20',               warn: false },
            { label: 'PLANTS',  value: String(plantCount),  warn: false },
            { label: 'OUTAGES', value: totalOutageMW > 0 ? `${(totalOutageMW/1000).toFixed(1)}GW` : '–', warn: totalOutageMW > 2000 },
            { label: 'UPDATED', value: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', timeZone: 'America/New_York' }) + ' EPT', warn: false },
          ].map(item => (
            <span key={item.label} style={{ fontFamily: F.mono, fontSize: '0.6rem' }}>
              <span style={{ color: C.textMuted, letterSpacing: '0.1em' }}>{item.label}: </span>
              <span style={{ color: item.warn ? '#FFB800' : C.electricBlue }}>{item.value}</span>
            </span>
          ))}
        </div>
      </div>

      {/* ── Left icon rail (always visible, minimal) ─── */}
      {/* Offset below the floating nav pill so the two don't stack. */}
      <div style={{
        position: 'absolute', top: 64, left: 12, zIndex: 25,
        display: 'flex', flexDirection: 'column', gap: 4,
        pointerEvents: 'auto',
      }}>
        {PANEL_ICONS.map(p => {
          const active = expandedPanel === p.id;
          return (
            <button
              key={p.id}
              onClick={() => setExpandedPanel(prev => prev === p.id ? null : p.id)}
              aria-label={p.label}
              title={p.label}
              style={{
                width: 32, height: 32, flexShrink: 0,
                background: active ? 'rgba(59,130,246,0.18)' : 'rgba(10,10,11,0.82)',
                border: `1px solid ${active ? 'rgba(59,130,246,0.55)' : C.borderDefault}`,
                borderRadius: 6, cursor: 'pointer',
                color: active ? C.electricBlue : C.textSecondary,
                fontFamily: F.mono, fontSize: 14,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                backdropFilter: 'blur(10px)',
                transition: 'background 150ms cubic-bezier(0.4,0,0.2,1), border-color 150ms cubic-bezier(0.4,0,0.2,1), color 150ms cubic-bezier(0.4,0,0.2,1)',
              }}
            >
              {p.icon}
            </button>
          );
        })}
      </div>

      {/* ── Floating expanded panel (on-demand, overlays the map) ─ */}
      {/* Anchors at the same vertical position as its trigger button
          and extends to the right of the toolbar. 280px wide, scrolls
          internally if content exceeds the viewport budget. */}
      <div style={{
        position: 'absolute',
        top: expandedPanel
          ? 64 + (PANEL_ICONS.findIndex(p => p.id === expandedPanel) * 36)
          : 64 + (PANEL_ICONS.length * 36) + 8,
        left: 52,
        width: 280, zIndex: 24,
        display: (expandedPanel || selectedZone) ? 'flex' : 'none',
        flexDirection: 'column', gap: 8,
        pointerEvents: 'auto',
        maxHeight: 'calc(100vh - 160px)', overflowY: 'auto',
      }}>

        {expandedPanel === 'search' && (
        <Panel label="">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontFamily: F.mono, fontSize: '0.75rem', color: C.textMuted }}>⌕</span>
            <input
              type="text"
              placeholder="FLY TO ZONE OR PLANT"
              value={searchQuery}
              onChange={e => handleSearch(e.target.value)}
              onFocus={() => searchQuery.length >= 2 && setShowResults(true)}
              onBlur={() => setTimeout(() => setShowResults(false), 180)}
              style={{
                background: 'transparent', border: 'none', outline: 'none',
                fontFamily: F.mono, fontSize: '0.58rem',
                color: C.textPrimary, width: '100%',
              }}
            />
          </div>
          {showResults && searchResults.length > 0 && (
            <div style={{ borderTop: `1px solid ${C.borderDefault}`, maxHeight: 180, overflowY: 'auto' }}>
              {searchResults.map(r => (
                <button key={`${r.type}-${r.id}`}
                  onMouseDown={() => handleSelectResult(r)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    width: '100%', padding: '5px 0',
                    background: 'transparent', border: 'none', cursor: 'pointer',
                    textAlign: 'left' as const,
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(0,163,255,0.08)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  <span style={{ fontFamily: F.mono, fontSize: '0.5rem', color: r.type === 'zone' ? C.electricBlue : C.falconGold, minWidth: 30, letterSpacing: '0.1em' }}>
                    {r.type === 'zone' ? 'ZONE' : 'PLANT'}
                  </span>
                  <span style={{ fontFamily: F.mono, fontSize: '0.58rem', color: C.textPrimary }}>
                    {r.label}
                  </span>
                </button>
              ))}
            </div>
          )}
        </Panel>
        )}

        {/* Layers */}
        {expandedPanel === 'layers' && (
        <Panel label="LAYERS">
          <Toggle label="TRANSMISSION"      active={showTx}               color="#00FFF0"             onToggle={() => setShowTx(p => !p)} />
          <Toggle label="POWER PLANTS"      active={showPlants}           color={C.electricBlueLight} onToggle={() => setShowPlants(p => !p)} />
          <Toggle label="HUB NODES"         active={showNodes}            color="#FFB800"             onToggle={() => setShowNodes(p => !p)} />
          <Toggle label="GAS PIPELINES"     active={showGasPipelines}     color="#F97316"             onToggle={() => setShowGasPipelines(p => !p)} />
          <Toggle label="SUBSTATIONS"       active={showSubstations}      color={C.textPrimary}       onToggle={() => setShowSubstations(p => !p)} />
          <Toggle label="SEISMIC ALERTS"    active={showEarthquakes}      color="#FF3B3B"             onToggle={() => setShowEarthquakes(p => !p)} />
          <Toggle label="WEATHER"           active={showWeather}          color="#00FFF0"             onToggle={() => setShowWeather(p => !p)} />
          {/* Wave 5 — all-US infrastructure layer toggles. The new
              layers render alongside (not in place of) the PJM-focused
              ones above; the user can show either or both. */}
          <Toggle label="ALL-US GENERATION" active={!!showAllUsGeneration}   color={C.electricBlueLight} onToggle={() => setShowAllUsGeneration(p => !p)} />
          <Toggle label="ALL-US TRANSMISSION" active={!!showAllUsTransmission} color="#00FFF0"           onToggle={() => setShowAllUsTransmission(p => !p)} />
          <Toggle label="BATTERY STORAGE"   active={!!showBatteries}         color={C.fuelBattery}     onToggle={() => setShowBatteries(p => !p)} />
        </Panel>
        )}

        {/* Fuel type filter */}
        {expandedPanel === 'fuel' && showPlants && (
          <Panel label="FUEL TYPE">
            <button onClick={toggleAll} style={{
              background: 'transparent',
              border: `1px solid ${C.borderDefault}`,
              borderRadius: 4, color: C.textSecondary,
              fontFamily: F.mono, fontSize: '0.55rem',
              letterSpacing: '0.1em', cursor: 'pointer',
              padding: '3px 8px', marginBottom: 4,
            }}>
              {allOn ? 'HIDE ALL' : 'SHOW ALL'}
            </button>
            {FUEL_UI.map(f => (
              <button key={f.key} onClick={() => toggleFuel(f.key)}
                style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'transparent', border: 'none', cursor: 'pointer', padding: '2px 0', width: '100%' }}>
                <div style={{
                  width: 8, height: 8, borderRadius: '50%',
                  background: fuelFilter[f.key] ? f.color : 'transparent',
                  border: `1.5px solid ${fuelFilter[f.key] ? f.color : C.textMuted}`,
                  flexShrink: 0,
                }} />
                <span style={{ fontFamily: F.mono, fontSize: '0.58rem', color: fuelFilter[f.key] ? C.textPrimary : C.textMuted }}>
                  {f.label}
                </span>
              </button>
            ))}
            <div style={{ marginTop: 8, borderTop: `1px solid ${C.borderDefault}`, paddingTop: 8 }}>
              <span style={{ fontFamily: F.mono, fontSize: '0.55rem', color: C.textMuted }}>
                MIN CAPACITY: {minCapacity === 0 ? 'ALL' : `${minCapacity} MW`}
              </span>
              <input type="range" min={0} max={1000} step={50} value={minCapacity}
                onChange={e => setMinCapacity(Number(e.target.value))}
                style={{
                  width: '100%', marginTop: 6, appearance: 'none', height: 3,
                  borderRadius: 2, outline: 'none', cursor: 'pointer',
                  background: `linear-gradient(to right, ${C.electricBlue} ${minCapacity / 10}%, rgba(255,255,255,0.1) ${minCapacity / 10}%)`,
                }}
              />
            </div>
          </Panel>
        )}

        {/* Live Intelligence Panel */}
        {expandedPanel === 'intel' && (
        <Panel label="GRID INTELLIGENCE">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <span style={{ fontFamily: F.mono, fontSize: '0.55rem', color: C.textMuted }}>DATA SOURCE</span>
            <span style={{
              fontFamily: F.mono, fontSize: '0.5rem',
              color: fuelLive ? '#10B981' : '#FFB800',
              letterSpacing: '0.1em',
            }}>
              {fuelLive ? '\u25CF LIVE' : '\u25D0 SIMULATED'}
            </span>
          </div>
          {!fuelLive && fuelMixData.fuels.length === 0 && (
            <div style={{
              fontFamily: F.mono, fontSize: '0.5rem', color: C.textMuted,
              marginBottom: 6, lineHeight: 1.35,
            }}>
              No live generation mix yet — confirm V2 `/api/atlas/generation-fuel` and PJM credentials.
            </div>
          )}
          {fuelMixData.fuels.length > 0 && (
            <div style={{ marginBottom: 8 }}>
              <span style={{ fontFamily: F.mono, fontSize: '0.55rem', color: C.textMuted, letterSpacing: '0.1em' }}>
                GENERATION MIX
              </span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 3, marginTop: 4 }}>
                {fuelMixData.fuels
                  .sort((a, b) => b.mw - a.mw)
                  .slice(0, 5)
                  .map(f => {
                    const total = fuelMixData.fuels.reduce((s, x) => s + x.mw, 0);
                    const pct   = total > 0 ? (f.mw / total) * 100 : 0;
                    const color = fuelMixBarColor(f.type);
                    return (
                      <div key={f.type} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <div style={{ width: `${pct}%`, maxWidth: '60%', height: 4, borderRadius: 2, background: color, flexShrink: 0 }} />
                        <span style={{ fontFamily: F.mono, fontSize: '0.55rem', color: C.textSecondary }}>
                          {f.type} {f.mw.toLocaleString()}MW
                        </span>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}
          {constraintData.constraints.length > 0 && (
            <div style={{ marginBottom: 8, borderTop: `1px solid ${C.borderDefault}`, paddingTop: 8 }}>
              <span style={{ fontFamily: F.mono, fontSize: '0.55rem', color: '#FF3B3B', letterSpacing: '0.1em' }}>
                BINDING CONSTRAINTS
              </span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 3, marginTop: 4 }}>
                {constraintData.constraints.slice(0, 3).map((c, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontFamily: F.mono, fontSize: '0.5rem', color: C.textSecondary, maxWidth: 120, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {c.name}
                    </span>
                    <span style={{ fontFamily: F.mono, fontSize: '0.55rem', color: '#FF3B3B' }}>
                      ${c.shadow_price.toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
          {totalOutageMW > 0 && (
            <div style={{ borderTop: `1px solid ${C.borderDefault}`, paddingTop: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontFamily: F.mono, fontSize: '0.55rem', color: C.textMuted, letterSpacing: '0.1em' }}>OUTAGES</span>
                <span style={{ fontFamily: F.mono, fontSize: '0.65rem', color: '#FFB800' }}>{totalOutageMW.toLocaleString()} MW</span>
              </div>
            </div>
          )}
          {showWeather && weatherData.points.length > 0 && (
            <div style={{ borderTop: `1px solid ${C.borderDefault}`, paddingTop: 8, marginTop: 4 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <span style={{ fontFamily: F.mono, fontSize: '0.55rem', color: C.textMuted, letterSpacing: '0.1em' }}>
                  WEATHER
                </span>
                <span style={{ fontFamily: F.mono, fontSize: '0.5rem', color: weatherLive ? '#10B981' : '#FFB800' }}>
                  {weatherLive ? '● LIVE' : '◐ SIMULATED'}
                </span>
              </div>
              {(() => {
                const windiest = [...weatherData.points].sort((a, b) => b.wind_speed_ms - a.wind_speed_ms)[0];
                const hottest  = [...weatherData.points].sort((a, b) => b.temperature_c - a.temperature_c)[0];
                return (
                  <>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                      <span style={{ fontFamily: F.mono, fontSize: '0.5rem', color: C.textMuted }}>MAX WIND</span>
                      <span style={{ fontFamily: F.mono, fontSize: '0.55rem', color: '#00A3FF' }}>
                        {windiest.label} {Math.round(windiest.wind_speed_ms * 2.237)}mph
                      </span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontFamily: F.mono, fontSize: '0.5rem', color: C.textMuted }}>MAX TEMP</span>
                      <span style={{ fontFamily: F.mono, fontSize: '0.55rem', color: '#FF3B3B' }}>
                        {hottest.label} {Math.round(hottest.temperature_c * 9/5 + 32)}°F
                      </span>
                    </div>
                  </>
                );
              })()}
            </div>
          )}

          {/* Wave 5 — National readouts. Visible whenever any all-US
              layer is on. Pulls from the same hooks the layers consume,
              so what the user sees on the map matches what the panel
              counts. */}
          {hasAllUsLayerOn && (
            <div style={{ borderTop: `1px solid ${C.borderDefault}`, paddingTop: 8, marginTop: 4 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <span style={{ fontFamily: F.mono, fontSize: '0.55rem', color: C.electricBlueLight, letterSpacing: '0.1em' }}>
                  NATIONAL · VIEWPORT
                </span>
                <span style={{ fontFamily: F.mono, fontSize: '0.5rem', color: C.textMuted, letterSpacing: '0.08em' }}>
                  LOD {viewport.lod.toUpperCase()}
                </span>
              </div>

              {/* Top 5 fuels by capacity — only when generation toggle is on */}
              {showAllUsGeneration && nationalTopFuels.length > 0 && (() => {
                const total = nationalTopFuels.reduce((s, f) => s + f.mw, 0);
                return (
                  <div style={{ marginBottom: 6 }}>
                    <span style={{
                      fontFamily: F.mono, fontSize: '0.5rem',
                      color: C.textMuted, letterSpacing: '0.1em',
                    }}>
                      TOP FUELS · {generation.count.toLocaleString()} UNITS
                    </span>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 3, marginTop: 4 }}>
                      {nationalTopFuels.map((f) => {
                        const pct = total > 0 ? (f.mw / total) * 100 : 0;
                        return (
                          <div key={f.fuel} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <div style={{
                              width:        `${Math.max(4, pct)}%`,
                              maxWidth:     '60%',
                              height:       4,
                              borderRadius: 2,
                              background:   fuelMixBarColor(f.fuel),
                              flexShrink:   0,
                            }} />
                            <span style={{
                              fontFamily:         F.mono,
                              fontSize:           '0.55rem',
                              color:              C.textSecondary,
                              fontVariantNumeric: 'tabular-nums',
                            }}>
                              {f.fuel} {(f.mw / 1000).toFixed(1)}GW
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })()}

              {/* Battery aggregate (server-side from useBatteryAssets) */}
              {showBatteries && batteries.count > 0 && (
                <div style={{ marginBottom: 6 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontFamily: F.mono, fontSize: '0.5rem', color: C.textMuted, letterSpacing: '0.1em' }}>
                      BATTERY · {batteries.count.toLocaleString()}
                    </span>
                    <span style={{
                      fontFamily:         F.mono,
                      fontSize:           '0.55rem',
                      color:              C.fuelBattery,
                      fontVariantNumeric: 'tabular-nums',
                    }}>
                      {(batteries.totalMw / 1000).toFixed(2)}GW · {(batteries.totalMwh / 1000).toFixed(1)}GWh
                    </span>
                  </div>
                </div>
              )}

              {/* Transmission km — sum of segmentLengthKm in viewport */}
              {showAllUsTransmission && transmission.count > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontFamily: F.mono, fontSize: '0.5rem', color: C.textMuted, letterSpacing: '0.1em' }}>
                    TX · {transmission.count.toLocaleString()} SEG
                  </span>
                  <span style={{
                    fontFamily:         F.mono,
                    fontSize:           '0.55rem',
                    color:              '#00A3FF',
                    fontVariantNumeric: 'tabular-nums',
                  }}>
                    {nationalTxKm.toLocaleString()} km
                  </span>
                </div>
              )}

              {/* Truncation hint when any layer's response was capped */}
              {(generation.truncated || transmission.truncated || batteries.truncated) && (
                <div style={{
                  marginTop:     6,
                  fontFamily:    F.mono,
                  fontSize:      '0.45rem',
                  color:         '#FFB800',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                }}>
                  ⚠ result truncated · zoom in for full set
                </div>
              )}
            </div>
          )}
        </Panel>
        )}

        {expandedPanel === 'style' && (
        <Panel label="MAP STYLE">
          {MAP_STYLES.map(s => (
            <button key={s.id} onClick={() => setActiveStyle(s.id)} style={{
              width: '100%', padding: '5px 8px',
              background: activeStyle === s.id ? 'rgba(0,163,255,0.12)' : 'transparent',
              border: activeStyle === s.id ? '1px solid rgba(0,163,255,0.3)' : '1px solid transparent',
              borderRadius: 4,
              color: activeStyle === s.id ? C.electricBlue : C.textSecondary,
              fontFamily: F.mono, fontSize: '0.6rem', letterSpacing: '0.1em',
              cursor: 'pointer', textAlign: 'left' as const,
            }}>
              {activeStyle === s.id ? '● ' : '○ '}{s.label}
            </button>
          ))}
        </Panel>
        )}

        {/* Selected zone — always visible while a zone is selected */}
        {selectedZone && (
          <Panel label="SELECTED ZONE">
            <span style={{ fontFamily: F.mono, fontSize: '0.75rem', color: C.electricBlue }}>
              {selectedZone}
            </span>
            <button onClick={() => setSelectedZone(null)} style={{
              marginTop: 4, background: 'transparent', border: 'none',
              color: C.textMuted, fontFamily: F.mono, fontSize: '0.55rem',
              cursor: 'pointer', padding: 0, textAlign: 'left' as const,
            }}>
              CLEAR SELECTION
            </button>
          </Panel>
        )}
      </div>

      {/* ── Plant tooltip ─────────────────────────────── */}
      {plantTooltip && (
        <div style={{
          position: 'fixed', left: plantTooltip.x + 14, top: plantTooltip.y - 10,
          zIndex: 50, background: 'rgba(10,10,11,0.95)',
          border: `1px solid ${C.borderDefault}`, borderRadius: 6,
          backdropFilter: 'blur(12px)', padding: '8px 12px',
          pointerEvents: 'none', minWidth: 160,
        }}>
          <div style={{ fontFamily: F.mono, fontSize: '0.7rem', color: C.textPrimary, fontWeight: 600, marginBottom: 4 }}>
            {plantTooltip.name}
          </div>
          {[
            { label: 'FUEL',     value: plantTooltip.fuel || '–'                            },
            { label: 'CAPACITY', value: `${Number(plantTooltip.capacity).toLocaleString()} MW` },
            { label: 'STATE',    value: plantTooltip.state || '–'                           },
          ].map(row => (
            <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
              <span style={{ fontFamily: F.mono, fontSize: '0.55rem', color: C.textMuted }}>{row.label}</span>
              <span style={{ fontFamily: F.mono, fontSize: '0.6rem', color: C.textSecondary }}>{row.value}</span>
            </div>
          ))}
        </div>
      )}

      {/* ── Zone hover label ──────────────────────────── */}
      {hoveredZone && !plantTooltip && (
        <div style={{
          position: 'absolute', bottom: 90, left: '50%',
          transform: 'translateX(-50%)',
          background: 'rgba(10,10,11,0.92)',
          border: `1px solid ${C.electricBlue}`,
          borderRadius: 6, padding: '6px 16px',
          fontFamily: F.mono, fontSize: '0.65rem',
          color: C.electricBlue, letterSpacing: '0.12em',
          pointerEvents: 'none', zIndex: 10, whiteSpace: 'nowrap',
        }}>
          {hoveredZone}
        </div>
      )}

      {/* ── TIME TRAVEL ACTIVE indicator (top-right) ────────────── */}
      {!isLiveFrame && (
        <div style={{
          position:       'absolute',
          top:            12,
          right:          12,
          zIndex:         15,
          padding:        '6px 12px',
          background:     'rgba(15,15,18,0.92)',
          border:         '1px solid rgba(245,158,11,0.55)',
          borderRadius:   18,
          backdropFilter: 'blur(12px)',
          display:        'flex',
          alignItems:     'center',
          gap:            6,
          pointerEvents:  'none',
        }}>
          <span style={{
            display:      'inline-block',
            width:        6,
            height:       6,
            borderRadius: '50%',
            background:   '#FBBF24',
            boxShadow:    '0 0 6px rgba(251,191,36,0.85)',
          }} />
          <span style={{
            fontFamily:    F.mono,
            fontSize:      '0.6rem',
            fontWeight:    700,
            letterSpacing: '0.18em',
            color:         '#FBBF24',
            textTransform: 'uppercase',
          }}>
            TIME TRAVEL ACTIVE
          </span>
        </div>
      )}

      {/* ── Wave 2 time-travel scrubber ────────────────────────── */}
      <TimeTravelScrubber />

      {/* ── Wave 5 asset detail panel (top-right) ─────────────── */}
      <AssetDetailPanel
        asset={selectedAsset}
        onClose={() => setSelectedAsset(null)}
      />
    </div>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────

function Panel({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{
      background: 'rgba(10,10,11,0.88)',
      border: `1px solid ${C.borderDefault}`,
      borderRadius: 6, backdropFilter: 'blur(12px)',
      padding: '10px 12px',
      display: 'flex', flexDirection: 'column' as const, gap: 6,
    }}>
      {label && (
        <span style={{
          fontFamily: F.mono, fontSize: '0.55rem', color: C.textMuted,
          letterSpacing: '0.15em', textTransform: 'uppercase' as const, marginBottom: 2,
        }}>
          {label}
        </span>
      )}
      {children}
    </div>
  );
}

function Toggle({ label, active, color, onToggle }: {
  label: string; active: boolean; color: string; onToggle: () => void;
}) {
  return (
    <button onClick={onToggle} style={{
      display: 'flex', alignItems: 'center', gap: 8,
      background: 'transparent', border: 'none', cursor: 'pointer',
      padding: '2px 0', width: '100%',
    }}>
      <div style={{
        width: 10, height: 10, borderRadius: '50%',
        background: active ? color : 'transparent',
        border: `1.5px solid ${active ? color : C.textMuted}`,
        flexShrink: 0,
      }} />
      <span style={{
        fontFamily: F.mono, fontSize: '0.6rem',
        color: active ? C.textPrimary : C.textMuted,
        letterSpacing: '0.08em',
      }}>
        {label}
      </span>
    </button>
  );
}
