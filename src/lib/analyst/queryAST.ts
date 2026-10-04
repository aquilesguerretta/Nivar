// FORGE Wave 6 — Query AST helpers.
// `buildAST` consolidates composer state into the canonical AST;
// `serializeAST` / `deserializeAST` round-trip through JSON for
// localStorage persistence; `describeAST` produces a one-line plan
// preview rendered in the QueryComposer's monospace footer.

import type {
  Aggregation,
  Dimension,
  Filter,
  Metric,
  QueryAST,
  TimeRange,
} from './types';

// ─── Default constructors ────────────────────────────────────────

export function emptyAST(): QueryAST {
  return {
    dimensions: [{ kind: 'time-of-day' }],
    metrics: [{ kind: 'lmp' }],
    aggregation: { kind: 'avg' },
    filters: [],
    timeRange: { kind: 'last-7d' },
    zones: ['WEST_HUB'],
  };
}

// ─── Builder ─────────────────────────────────────────────────────

export interface BuildASTInput {
  dimensions: Dimension[];
  metrics: Metric[];
  aggregation: Aggregation;
  filters: Filter[];
  timeRange: TimeRange;
  zones: string[];
}

export function buildAST(input: BuildASTInput): QueryAST {
  return {
    dimensions: input.dimensions.length === 0 ? [{ kind: 'time-of-day' }] : input.dimensions,
    metrics: input.metrics.length === 0 ? [{ kind: 'lmp' }] : input.metrics,
    aggregation: input.aggregation,
    filters: input.filters,
    timeRange: input.timeRange,
    zones: input.zones,
  };
}

// ─── (De)serialization ───────────────────────────────────────────

export function serializeAST(ast: QueryAST): string {
  return JSON.stringify(ast);
}

export function deserializeAST(payload: string): QueryAST {
  const parsed = JSON.parse(payload) as Partial<QueryAST>;
  // Defensive defaults so a malformed payload doesn't blow up the
  // composer the next time the user opens it.
  return {
    dimensions: parsed.dimensions ?? [{ kind: 'time-of-day' }],
    metrics: parsed.metrics ?? [{ kind: 'lmp' }],
    aggregation: parsed.aggregation ?? { kind: 'avg' },
    filters: parsed.filters ?? [],
    timeRange: parsed.timeRange ?? { kind: 'last-7d' },
    zones: parsed.zones ?? [],
  };
}

// ─── Plan description ────────────────────────────────────────────

const DIMENSION_LABEL: Record<Dimension['kind'], string> = {
  zone: 'zone',
  'time-of-day': 'hour-of-day',
  'day-of-week': 'day-of-week',
  date: 'date',
  month: 'month',
  fuel: 'fuel',
};

const METRIC_LABEL: Record<Metric['kind'], string> = {
  lmp: 'LMP',
  congestion: 'congestion',
  'marginal-fuel-share': 'marginal-fuel share',
  load: 'load (MW)',
  'reserve-margin': 'reserve margin (%)',
  'fuel-mix-pct': 'fuel-mix %',
};

function aggregationVerb(a: Aggregation): string {
  switch (a.kind) {
    case 'avg': return 'average';
    case 'sum': return 'sum';
    case 'min': return 'min';
    case 'max': return 'max';
    case 'top-n': return `top ${a.n ?? 5}`;
    case 'bottom-n': return `bottom ${a.n ?? 5}`;
    case 'percentile': return `p${a.percentile ?? 95}`;
    case 'count': return 'count';
  }
}

function timeRangeLabel(t: TimeRange): string {
  switch (t.kind) {
    case 'last-7d': return 'last 7 days';
    case 'last-30d': return 'last 30 days';
    case 'last-quarter': return 'last quarter';
    case 'last-year': return 'last year';
    case 'mtd': return 'month-to-date';
    case 'ytd': return 'year-to-date';
    case 'custom':
      return t.start && t.end ? `${t.start} → ${t.end}` : 'custom';
  }
}

function filterClause(f: Filter): string {
  const valueStr = Array.isArray(f.value) ? `[${f.value.join(', ')}]` : String(f.value);
  return `${f.field} ${f.operator} ${valueStr}`;
}

/**
 * Single-line plan description rendered in the composer's monospace
 * footer. Designed to read like a sentence in 10-12 words.
 */
export function describeAST(ast: QueryAST): string {
  const metric = ast.metrics.map((m) => METRIC_LABEL[m.kind]).join(' + ');
  const dim = ast.dimensions.map((d) => DIMENSION_LABEL[d.kind]).join(' × ');
  const zonesStr = ast.zones.length === 0
    ? 'all zones'
    : ast.zones.length <= 3
      ? ast.zones.join(', ')
      : `${ast.zones.length} zones`;
  const verb = aggregationVerb(ast.aggregation);
  const time = timeRangeLabel(ast.timeRange);
  const filters = ast.filters.length === 0
    ? ''
    : ` where ${ast.filters.map(filterClause).join(' AND ')}`;
  return `${verb} of ${metric} for ${zonesStr}, grouped by ${dim}, over ${time}${filters}`;
}
