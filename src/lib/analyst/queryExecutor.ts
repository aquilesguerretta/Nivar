// FORGE Wave 6 — Query executor.
//
// Pure function from `QueryAST` → `QueryResult`. The V1 executor runs
// against shape-matched mock data derived from `pjm/mock-data` so the
// app works offline. When `dataSource` is `'live'`, the executor still
// shapes the result the same way — future Cursor backend work will
// swap the body of `runLiveQuery` to hit a real `/api/analyst/query`
// endpoint (not present yet).

import type {
  Aggregation,
  ColumnSchema,
  Dimension,
  Filter,
  Metric,
  QueryAST,
  QueryResult,
  QueryResultRow,
  TimeRange,
} from './types';
import {
  ZONE_24H_PRICES,
  ZONE_LMP,
} from '@/lib/pjm/mock-data';

export type DataSource = 'mock' | 'live';

// ─── Constants ───────────────────────────────────────────────────

const DOW_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTH_LABELS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

// ─── Helpers ─────────────────────────────────────────────────────

function timeRangeDays(t: TimeRange): number {
  switch (t.kind) {
    case 'last-7d': return 7;
    case 'last-30d': return 30;
    case 'last-quarter': return 90;
    case 'last-year': return 365;
    case 'mtd': return new Date().getDate();
    case 'ytd':
      return Math.floor(
        (Date.now() - new Date(new Date().getFullYear(), 0, 1).getTime()) / 86400000,
      );
    case 'custom': {
      if (!t.start || !t.end) return 30;
      return Math.max(1, Math.round((Date.parse(t.end) - Date.parse(t.start)) / 86400000));
    }
  }
}

function metricLabel(m: Metric): string {
  switch (m.kind) {
    case 'lmp': return 'LMP ($/MWh)';
    case 'congestion': return 'Congestion ($/MWh)';
    case 'marginal-fuel-share': return 'Marginal-fuel share (%)';
    case 'load': return 'Load (MW)';
    case 'reserve-margin': return 'Reserve margin (%)';
    case 'fuel-mix-pct': return m.fuel ? `${m.fuel} mix (%)` : 'Fuel mix (%)';
  }
}

function dimensionLabel(d: Dimension): string {
  switch (d.kind) {
    case 'zone': return 'Zone';
    case 'time-of-day': return 'Hour';
    case 'day-of-week': return 'Day of week';
    case 'date': return 'Date';
    case 'month': return 'Month';
    case 'fuel': return 'Fuel';
  }
}

function passesFilters(row: QueryResultRow, filters: Filter[]): boolean {
  for (const f of filters) {
    const v = row[f.field];
    if (v === undefined || v === null) return false;
    switch (f.operator) {
      case '=': if (v !== f.value) return false; break;
      case '!=': if (v === f.value) return false; break;
      case '>': if (!(typeof v === 'number' && typeof f.value === 'number' && v > f.value)) return false; break;
      case '<': if (!(typeof v === 'number' && typeof f.value === 'number' && v < f.value)) return false; break;
      case '>=': if (!(typeof v === 'number' && typeof f.value === 'number' && v >= f.value)) return false; break;
      case '<=': if (!(typeof v === 'number' && typeof f.value === 'number' && v <= f.value)) return false; break;
      case 'IN': if (!Array.isArray(f.value) || !f.value.includes(v as string | number)) return false; break;
      case 'NOT IN': if (Array.isArray(f.value) && f.value.includes(v as string | number)) return false; break;
    }
  }
  return true;
}

// ─── Synthetic data fabricator ───────────────────────────────────
//
// Generates one row per (zone, day, hour) triple within the time
// range, then groups by the AST's dimensions and applies the
// aggregation. Numbers are deterministic seeded by zone + dow + hour
// so successive runs produce stable plots.

interface Sample {
  zone: string;
  date: string;        // YYYY-MM-DD
  dow: number;         // 0-6
  month: number;       // 0-11
  hour: number;        // 0-23
  lmp: number;
  congestion: number;
  load: number;
  reserveMargin: number;
  marginalFuel: string;
  fuelGas: number;
  fuelNuclear: number;
  fuelCoal: number;
  fuelWind: number;
  fuelSolar: number;
}

function generateSamples(ast: QueryAST): Sample[] {
  const days = Math.min(timeRangeDays(ast.timeRange), 92); // cap at one quarter for V1
  const zones = ast.zones.length === 0
    ? Object.keys(ZONE_24H_PRICES).filter((z) => z !== 'DEFAULT')
    : ast.zones;
  const samples: Sample[] = [];
  const now = Date.now();
  for (let zi = 0; zi < zones.length; zi++) {
    const zone = zones[zi];
    const seriesSrc = ZONE_24H_PRICES[zone] ?? ZONE_24H_PRICES.DEFAULT;
    const lmpSeed = ZONE_LMP[zone]?.price ?? 35;
    for (let d = 0; d < days; d++) {
      const t = now - (days - 1 - d) * 86400000;
      const date = new Date(t);
      const dateStr = date.toISOString().slice(0, 10);
      const dow = date.getUTCDay();
      const month = date.getUTCMonth();
      for (let h = 0; h < 24; h++) {
        // Hourly LMP shape with a weekday/weekend tilt.
        const baseLMP = seriesSrc[h] ?? lmpSeed;
        const dowTilt = dow === 0 || dow === 6 ? -4 : 0;
        const noise = ((d * 31 + h * 7 + zi * 13) % 11) - 5;
        const lmp = Math.max(-15, Number((baseLMP + dowTilt + noise * 0.6).toFixed(2)));
        const congestion = Number(((lmp - lmpSeed) * 0.45).toFixed(2));
        // Load — simple shape: low overnight, peak 17-19.
        const loadBase = 4500 + ((zi * 9 + month * 5) % 7) * 110;
        const loadShape = [
          0.78, 0.74, 0.72, 0.72, 0.74, 0.79, 0.86, 0.93,
          0.97, 0.98, 0.97, 0.96, 0.95, 0.95, 0.97, 1.00,
          1.04, 1.06, 1.03, 0.98, 0.93, 0.88, 0.84, 0.80,
        ];
        const load = Math.round(loadBase * loadShape[h]);
        // Reserve margin — varies with peak load.
        const reserveMargin = Number((28 - (load - 4500) * 0.0035).toFixed(1));
        // Marginal fuel — cheap renewables overnight, gas at peak.
        const marginalFuel =
          h >= 17 && h <= 20 ? 'natural_gas' : h <= 4 ? 'wind' : h >= 10 && h <= 14 ? 'solar' : 'coal';
        samples.push({
          zone,
          date: dateStr,
          dow,
          month,
          hour: h,
          lmp,
          congestion,
          load,
          reserveMargin,
          marginalFuel,
          fuelGas: 38 + ((d * 5 + h * 3) % 7) - 3,
          fuelNuclear: 22,
          fuelCoal: 14,
          fuelWind: 18 - ((d * 3 + h) % 5),
          fuelSolar: h >= 8 && h <= 16 ? 8 + ((h * 2) % 6) : 0,
        });
      }
    }
  }
  return samples;
}

// ─── Sample → row (pre-aggregation) ─────────────────────────────

function sampleToRow(s: Sample, ast: QueryAST): QueryResultRow {
  const row: QueryResultRow = {};
  for (const d of ast.dimensions) {
    switch (d.kind) {
      case 'zone': row.zone = s.zone; break;
      case 'time-of-day': row['time-of-day'] = s.hour; break;
      case 'day-of-week': row['day-of-week'] = DOW_LABELS[s.dow]; break;
      case 'date': row.date = s.date; break;
      case 'month': row.month = MONTH_LABELS[s.month]; break;
      case 'fuel': row.fuel = s.marginalFuel; break;
    }
  }
  for (const m of ast.metrics) {
    switch (m.kind) {
      case 'lmp': row.lmp = s.lmp; break;
      case 'congestion': row.congestion = s.congestion; break;
      case 'load': row.load = s.load; break;
      case 'reserve-margin': row['reserve-margin'] = s.reserveMargin; break;
      case 'marginal-fuel-share':
        // 1 if the marginal fuel matches an optional fuel filter, else 0.
        row['marginal-fuel-share'] = s.marginalFuel === (m.fuel ?? 'natural_gas') ? 100 : 0;
        break;
      case 'fuel-mix-pct': {
        const f = m.fuel ?? 'natural_gas';
        const pct =
          f === 'natural_gas' ? s.fuelGas
          : f === 'nuclear' ? s.fuelNuclear
          : f === 'coal' ? s.fuelCoal
          : f === 'wind' ? s.fuelWind
          : f === 'solar' ? s.fuelSolar
          : 0;
        row['fuel-mix-pct'] = pct;
        break;
      }
    }
  }
  return row;
}

// ─── Group + aggregate ──────────────────────────────────────────

function groupKey(row: QueryResultRow, ast: QueryAST): string {
  return ast.dimensions.map((d) => String(row[dimensionKey(d)])).join('​');
}

function dimensionKey(d: Dimension): string {
  return d.kind;
}

function metricKey(m: Metric): string {
  return m.kind;
}

function aggregateValues(values: number[], a: Aggregation): number {
  if (values.length === 0) return Number.NaN;
  switch (a.kind) {
    case 'avg':
      return values.reduce((s, v) => s + v, 0) / values.length;
    case 'sum':
      return values.reduce((s, v) => s + v, 0);
    case 'min':
      return Math.min(...values);
    case 'max':
      return Math.max(...values);
    case 'count':
      return values.length;
    case 'percentile': {
      const sorted = [...values].sort((x, y) => x - y);
      const p = Math.max(0, Math.min(100, a.percentile ?? 95)) / 100;
      const idx = Math.min(sorted.length - 1, Math.floor(p * sorted.length));
      return sorted[idx];
    }
    case 'top-n':
    case 'bottom-n':
      // top-n / bottom-n are handled at the result-set level, not per-group.
      return values.reduce((s, v) => s + v, 0) / values.length;
  }
}

// ─── Result schema ──────────────────────────────────────────────

function buildSchema(ast: QueryAST): ColumnSchema[] {
  const cols: ColumnSchema[] = [];
  for (const d of ast.dimensions) {
    const isNumeric = d.kind === 'time-of-day' || d.kind === 'date' || d.kind === 'month';
    cols.push({
      key: dimensionKey(d),
      label: dimensionLabel(d),
      type: isNumeric && d.kind === 'time-of-day' ? 'number' : 'string',
    });
  }
  for (const m of ast.metrics) {
    cols.push({
      key: metricKey(m),
      label: metricLabel(m),
      type: 'number',
      format: m.kind === 'lmp' || m.kind === 'congestion' ? '$0,0.00' : '0,0.00',
    });
  }
  return cols;
}

// ─── Public API ─────────────────────────────────────────────────

export interface ExecuteQueryOptions {
  dataSource?: DataSource;
}

export async function executeQuery(
  ast: QueryAST,
  options: ExecuteQueryOptions = {},
): Promise<QueryResult> {
  const source: DataSource = options.dataSource ?? 'mock';
  if (source === 'live') {
    // V1: live path mirrors the mock path. Future work swaps this for
    // a /api/analyst/query call when Cursor lands the analyst endpoint.
    return runMockQuery(ast, 'live');
  }
  return runMockQuery(ast, 'mock');
}

function runMockQuery(ast: QueryAST, source: DataSource): QueryResult {
  const samples = generateSamples(ast);
  const rows = samples.map((s) => sampleToRow(s, ast));
  const filtered = rows.filter((r) => passesFilters(r, ast.filters));

  // Group by composite key, aggregate each metric.
  const groups = new Map<string, QueryResultRow[]>();
  for (const row of filtered) {
    const k = groupKey(row, ast);
    const arr = groups.get(k) ?? [];
    arr.push(row);
    groups.set(k, arr);
  }

  let resultRows: QueryResultRow[] = Array.from(groups.entries()).map(([, members]) => {
    const out: QueryResultRow = {};
    // Copy first member's dimension values.
    if (members.length > 0) {
      const first = members[0];
      for (const d of ast.dimensions) {
        out[dimensionKey(d)] = first[dimensionKey(d)] ?? null;
      }
    }
    // Aggregate each metric.
    for (const m of ast.metrics) {
      const values = members
        .map((r) => r[metricKey(m)])
        .filter((v): v is number => typeof v === 'number');
      const agg = aggregateValues(values, ast.aggregation);
      out[metricKey(m)] = Number.isFinite(agg) ? Number(agg.toFixed(2)) : null;
    }
    return out;
  });

  // Top-N / Bottom-N: sort by the first metric and slice.
  if (ast.aggregation.kind === 'top-n' || ast.aggregation.kind === 'bottom-n') {
    const n = ast.aggregation.n ?? 5;
    const firstMetric = metricKey(ast.metrics[0]);
    resultRows.sort((a, b) => {
      const av = (a[firstMetric] as number) ?? 0;
      const bv = (b[firstMetric] as number) ?? 0;
      return ast.aggregation.kind === 'top-n' ? bv - av : av - bv;
    });
    resultRows = resultRows.slice(0, n);
  } else {
    // Stable sort by first dimension for a deterministic display order.
    const firstDimKey = dimensionKey(ast.dimensions[0]);
    resultRows.sort((a, b) => {
      const av = a[firstDimKey];
      const bv = b[firstDimKey];
      if (typeof av === 'number' && typeof bv === 'number') return av - bv;
      return String(av ?? '').localeCompare(String(bv ?? ''));
    });
  }

  const schema = buildSchema(ast);

  return {
    schema,
    rows: resultRows,
    runAt: new Date().toISOString(),
    ageSeconds: 12, // synthetic — real live source would set this from meta
    summary: buildSummary(ast, resultRows),
    source,
  };
}

function buildSummary(ast: QueryAST, rows: QueryResultRow[]): string {
  if (rows.length === 0) return 'No rows match the query.';
  const firstMetricKey = metricKey(ast.metrics[0]);
  const values = rows
    .map((r) => r[firstMetricKey])
    .filter((v): v is number => typeof v === 'number');
  if (values.length === 0) return `${rows.length} rows.`;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const mean = values.reduce((s, v) => s + v, 0) / values.length;
  const label = metricLabel(ast.metrics[0]);
  return `${rows.length} rows · ${label}: min ${min.toFixed(2)}, mean ${mean.toFixed(2)}, max ${max.toFixed(2)}.`;
}
