import { useCallback, useEffect, useMemo, useState } from 'react';

import { browserApiUrl } from '@/lib/backendBase';

type Envelope<T> = { data: T };

type LmpCurrent = {
  lmp_total: number;
  lmp_energy: number;
  lmp_congestion: number;
  lmp_loss: number;
};

type LmpAllZones = Record<string, { lmp_total: number }>;
type LmpHistoryRow = { timestamp: string; lmp_total: number };

type WeatherData = {
  points: Array<{ temperature_c: number; precip_mm: number }>;
};

type ReserveMargin = {
  load_forecast_mw: number;
  load_actual_mw: number;
};

type ZonePriceExtreme = {
  zone: string;
  price: number;
};

const CANONICAL_ZONES = new Set([
  'WEST_HUB', 'COMED', 'AEP', 'ATSI', 'DAY', 'DEOK', 'DUQ', 'DOMINION',
  'DPL', 'EKPC', 'PPL', 'PECO', 'PSEG', 'JCPL', 'PEPCO', 'BGE', 'METED',
  'PENELEC', 'RECO', 'OVEC',
]);

const ZONE_ALIASES: Record<string, string> = {
  DOM: 'DOMINION',
  MET_ED: 'METED',
  'PJM-RTO': 'WEST_HUB',
  SYSTEM: 'WEST_HUB',
  WEST: 'WEST_HUB',
  WESTERN_HUB: 'WEST_HUB',
};

function toApiZone(zone: string | null): string {
  const requested = (zone || 'WEST_HUB').toUpperCase();
  const canonical = ZONE_ALIASES[requested] ?? requested;
  return CANONICAL_ZONES.has(canonical) ? canonical : 'WEST_HUB';
}

async function fetchJson<T>(path: string): Promise<T> {
  const res = await fetch(browserApiUrl(path), {
    signal: AbortSignal.timeout(8000),
    headers: { Accept: 'application/json' },
  });
  if (!res.ok) throw new Error(`${path} HTTP ${res.status}`);
  return (await res.json()) as T;
}

function avg(values: number[]): number {
  if (!values.length) return 0;
  return values.reduce((s, x) => s + x, 0) / values.length;
}

export interface LiveOpsData {
  live: boolean;
  apiZone: string;
  lmpPrice: number;
  lmpDelta: number;
  lmpEnergy: number;
  lmpCongestion: number;
  lmpLoss: number;
  zoneHistory: number[];
  rtoPrice: number;
  temperatureF: number;
  weatherSampleSize: number;
  loadForecastMw: number;
  actualLoadMw: number;
  weatherAlert: string;
  highestZone: ZonePriceExtreme | null;
  lowestZone: ZonePriceExtreme | null;
  avg24h: number;
}

export function useLiveOpsData(selectedZone: string | null): LiveOpsData {
  const [current, setCurrent] = useState<LmpCurrent | null>(null);
  const [allZones, setAllZones] = useState<LmpAllZones>({});
  const [historyRows, setHistoryRows] = useState<LmpHistoryRow[]>([]);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [reserve, setReserve] = useState<ReserveMargin | null>(null);
  const apiZone = useMemo(() => toApiZone(selectedZone), [selectedZone]);

  const fetchSnapshot = useCallback(async (zone: string) => {
    return Promise.all([
      fetchJson<Envelope<LmpCurrent>>(
        `/api/lmp/current?zone=${encodeURIComponent(zone)}`,
      ),
      fetchJson<Envelope<LmpAllZones>>('/api/lmp/all-zones'),
      fetchJson<WeatherData>('/api/weather/current'),
      fetchJson<Envelope<ReserveMargin>>('/api/reserve-margin/current'),
    ]);
  }, []);

  const fetchZoneHistory = useCallback(async (zone: string) => {
    return fetchJson<Envelope<LmpHistoryRow[]>>(
      `/api/lmp/24h?zone=${encodeURIComponent(zone)}`,
    );
  }, []);

  useEffect(() => {
    let mounted = true;
    const run = async () => {
      try {
        const [lmp, zones, weatherNow, reserveNow] = await fetchSnapshot(apiZone);
        if (!mounted) return;
        setCurrent(lmp.data);
        setAllZones(zones.data);
        setWeather(weatherNow);
        setReserve(reserveNow.data);
      } catch {
        // Preserve the last good snapshot during transient backend failures.
      }
    };
    void run();
    const id = setInterval(() => void run(), 60_000);
    return () => {
      mounted = false;
      clearInterval(id);
    };
  }, [apiZone, fetchSnapshot]);

  useEffect(() => {
    let mounted = true;
    const run = async () => {
      try {
        const history = await fetchZoneHistory(apiZone);
        if (mounted) setHistoryRows(history.data);
      } catch {
        // Preserve the last good history during transient backend failures.
      }
    };
    void run();
    const id = setInterval(() => void run(), 300_000);
    return () => {
      mounted = false;
      clearInterval(id);
    };
  }, [apiZone, fetchZoneHistory]);

  const zoneHistory = historyRows.map((row) => Number(row.lmp_total || 0));
  const delta =
    zoneHistory.length >= 2
      ? zoneHistory[zoneHistory.length - 1] - zoneHistory[zoneHistory.length - 2]
      : 0;
  const temperatures = weather?.points.map((point) => point.temperature_c) ?? [];
  const averageTemperatureC = avg(temperatures);
  const hasPrecipitation = weather?.points.some((point) => point.precip_mm > 0) ?? false;
  const zonePrices = Object.entries(allZones)
    .map(([zone, value]) => ({ zone, price: Number(value.lmp_total) }))
    .filter((entry) => Number.isFinite(entry.price));
  const highestZone = zonePrices.length
    ? zonePrices.reduce((highest, entry) => entry.price > highest.price ? entry : highest)
    : null;
  const lowestZone = zonePrices.length
    ? zonePrices.reduce((lowest, entry) => entry.price < lowest.price ? entry : lowest)
    : null;

  return {
    live: current !== null && weather !== null,
    apiZone,
    lmpPrice: Number(current?.lmp_total ?? 0),
    lmpDelta: Number(delta),
    lmpEnergy: Number(current?.lmp_energy ?? 0),
    lmpCongestion: Number(current?.lmp_congestion ?? 0),
    lmpLoss: Number(current?.lmp_loss ?? 0),
    zoneHistory,
    rtoPrice: Number(allZones.WEST_HUB?.lmp_total ?? 0),
    temperatureF: temperatures.length ? averageTemperatureC * 9 / 5 + 32 : 0,
    weatherSampleSize: temperatures.length,
    loadForecastMw: Number(reserve?.load_forecast_mw ?? 0),
    actualLoadMw: Number(reserve?.load_actual_mw ?? 0),
    weatherAlert: weather
      ? hasPrecipitation ? 'Precipitation' : 'No precipitation'
      : 'Unavailable',
    highestZone,
    lowestZone,
    avg24h: avg(zoneHistory),
  };
}
