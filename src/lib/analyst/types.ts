// FORGE Wave 6 — Analyst Saved Query + Report Drafting type system.
// Stable contract for the query AST, executor, scheduler, and report
// editor. Extend, don't reshape.

import type { PjmZone } from '@/lib/types/api';

// ─── Query dimensions / metrics ──────────────────────────────────

/**
 * What the user is slicing the data by. Each kind carries the
 * parameter it needs — zone identifier, time bucket, fuel family, etc.
 */
export type DimensionKind =
  | 'zone'           // group/filter by PJM zone
  | 'time-of-day'    // 0-23 hour bucket
  | 'day-of-week'    // 0-6 (Sun-Sat)
  | 'date'           // calendar date
  | 'month'          // 1-12
  | 'fuel';          // natural_gas, nuclear, coal, …

export interface Dimension {
  kind: DimensionKind;
}

/**
 * The numeric series the analyst pulls. Each maps to a hook from the
 * Wave 5 data layer when live, or a deterministic mock when offline.
 */
export type MetricKind =
  | 'lmp'                   // $/MWh hourly LMP
  | 'congestion'            // $/MWh congestion component
  | 'marginal-fuel-share'   // fraction of intervals where fuel was marginal
  | 'load'                  // MW load
  | 'reserve-margin'        // % reserve margin
  | 'fuel-mix-pct';         // % of generation from a fuel kind

export interface Metric {
  kind: MetricKind;
  /**
   * Optional fuel filter when `kind === 'fuel-mix-pct'`. Ignored for
   * other metrics.
   */
  fuel?: string;
}

// ─── Aggregations ────────────────────────────────────────────────

/** Top-level operation applied across the dimension grouping. */
export type AggregationKind =
  | 'avg'
  | 'sum'
  | 'min'
  | 'max'
  | 'top-n'
  | 'bottom-n'
  | 'percentile'
  | 'count';

export interface Aggregation {
  kind: AggregationKind;
  /** N for top-n / bottom-n. */
  n?: number;
  /** Percentile 0-100. */
  percentile?: number;
}

// ─── Filters ─────────────────────────────────────────────────────

export type FilterOperator = '=' | '!=' | '>' | '<' | '>=' | '<=' | 'IN' | 'NOT IN';

export type FilterValue =
  | number
  | string
  | (string | number)[];

export interface Filter {
  /** Field — dimension shorthand or metric kind. */
  field: DimensionKind | MetricKind;
  operator: FilterOperator;
  value: FilterValue;
}

// ─── Time range ──────────────────────────────────────────────────

export type TimeRangeKind =
  | 'last-7d'
  | 'last-30d'
  | 'last-quarter'
  | 'last-year'
  | 'mtd'
  | 'ytd'
  | 'custom';

export interface TimeRange {
  kind: TimeRangeKind;
  /** ISO date for custom-range start. */
  start?: string;
  /** ISO date for custom-range end. */
  end?: string;
}

// ─── Query AST ───────────────────────────────────────────────────

export interface QueryAST {
  /** What we're slicing by. Order matters for the group-by sequence. */
  dimensions: Dimension[];
  /** Numeric series being analyzed (typically one for V1). */
  metrics: Metric[];
  /** Reducer applied across rows. */
  aggregation: Aggregation;
  /** Optional pre-aggregation filters. */
  filters: Filter[];
  timeRange: TimeRange;
  /** PJM zones in scope. Empty = all. */
  zones: (PjmZone | string)[];
}

// ─── Result shape ────────────────────────────────────────────────

export type ColumnType = 'string' | 'number' | 'datetime';

export interface ColumnSchema {
  /** Column key in the row object. */
  key: string;
  /** Human-readable label. */
  label: string;
  type: ColumnType;
  /** Numeric formatter hint — e.g. '$0,0.00' or '0.00%'. Free-form for V1. */
  format?: string;
}

export interface QueryResultRow {
  [key: string]: string | number | null;
}

export interface QueryResult {
  /** Schema describing each column in `rows`. */
  schema: ColumnSchema[];
  rows: QueryResultRow[];
  /** ISO timestamp the query was executed. */
  runAt: string;
  /** Seconds elapsed between the underlying data and the run. */
  ageSeconds: number;
  /** Free-form summary line for AI / tooltips. */
  summary: string;
  /** Source flag — `live` when backed by Wave-5 hooks, `mock` otherwise. */
  source: 'live' | 'mock';
}

// ─── Saved query / schedule ──────────────────────────────────────

export type ScheduleKind =
  | 'none'
  | 'hourly'
  | 'daily-8am'
  | 'weekly-monday'
  | 'monthly-1st';

export interface SavedQuery {
  id: string;
  name: string;
  description?: string;
  tags: string[];
  ast: QueryAST;
  schedule: ScheduleKind;
  /** ISO timestamp of the last run. */
  lastRunAt: string | null;
  /** Cached last-run result. Persisted to localStorage. */
  lastResult: QueryResult | null;
  /** ISO timestamp of creation. */
  createdAt: string;
}

// ─── Report drafting ─────────────────────────────────────────────

export type ReportSectionKind =
  | 'commentary'    // markdown-ish text
  | 'query-result'  // embed saved query results
  | 'heading';      // section heading

export interface ReportSectionBase {
  id: string;
  kind: ReportSectionKind;
}

export interface CommentarySection extends ReportSectionBase {
  kind: 'commentary';
  /** Free-form text. Newlines preserved; **bold** / *italic* / `code` parsed. */
  body: string;
}

export interface HeadingSection extends ReportSectionBase {
  kind: 'heading';
  /** Heading text. */
  text: string;
  level: 1 | 2 | 3;
}

export interface QueryResultSection extends ReportSectionBase {
  kind: 'query-result';
  /** SavedQuery.id of the embedded query. */
  savedQueryId: string;
  /** How to render the result. */
  display: 'table' | 'chart';
  /** Optional caption for the table / chart. */
  caption?: string;
}

export type ReportSection = CommentarySection | HeadingSection | QueryResultSection;

export interface Report {
  id: string;
  title: string;
  authorName: string;
  /** Optional subtitle below the title in the preview / PDF. */
  subtitle?: string;
  sections: ReportSection[];
  createdAt: string;
  updatedAt: string;
  /** Template the report was seeded from (if any). */
  templateId?: string;
}

// ─── Report templates ────────────────────────────────────────────

export interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  /** Pre-populated sections. IDs are placeholders — re-keyed on instantiation. */
  sections: ReportSection[];
}
