// FORGE Wave 6 — QueryComposer.
//
// Form-based query builder for V1. State is local; the parent receives
// the final AST + a Run trigger. Live plan preview in F.mono below the
// form so the analyst sees a sentence-style description of what they
// just composed.

import { useMemo } from 'react';
import { C, F, R, S } from '@/design/tokens';
import { ContainedCard } from '@/components/terminal/ContainedCard';
import { EditorialIdentity } from '@/components/terminal/EditorialIdentity';
import { describeAST } from '@/lib/analyst/queryAST';
import { PJM_ZONES } from '@/lib/types/api';
import type {
  Filter,
  Metric,
  MetricKind,
  QueryAST,
  TimeRange,
  TimeRangeKind,
} from '@/lib/analyst/types';
import { DimensionPicker } from './DimensionPicker';
import { AggregationPicker } from './AggregationPicker';
import { FilterBar } from './FilterBar';

interface Props {
  ast: QueryAST;
  onChange: (next: QueryAST) => void;
  onRun: () => void;
  onSave: () => void;
  isRunning?: boolean;
}

const METRIC_OPTIONS: { kind: MetricKind; label: string }[] = [
  { kind: 'lmp', label: 'LMP' },
  { kind: 'congestion', label: 'CONGESTION' },
  { kind: 'load', label: 'LOAD' },
  { kind: 'reserve-margin', label: 'RESERVE MARGIN' },
  { kind: 'marginal-fuel-share', label: 'MARGINAL FUEL SHARE' },
  { kind: 'fuel-mix-pct', label: 'FUEL MIX %' },
];

const TIME_RANGE_OPTIONS: { kind: TimeRangeKind; label: string }[] = [
  { kind: 'last-7d', label: 'LAST 7 DAYS' },
  { kind: 'last-30d', label: 'LAST 30 DAYS' },
  { kind: 'last-quarter', label: 'LAST QUARTER' },
  { kind: 'last-year', label: 'LAST YEAR' },
  { kind: 'mtd', label: 'MTD' },
  { kind: 'ytd', label: 'YTD' },
  { kind: 'custom', label: 'CUSTOM' },
];

export function QueryComposer({ ast, onChange, onRun, onSave, isRunning }: Props) {
  const plan = useMemo(() => describeAST(ast), [ast]);

  function setMetricKind(kind: MetricKind) {
    const fuel = kind === 'fuel-mix-pct' || kind === 'marginal-fuel-share' ? 'natural_gas' : undefined;
    const next: Metric = { kind, fuel };
    onChange({ ...ast, metrics: [next] });
  }

  function setTimeRangeKind(kind: TimeRangeKind) {
    const next: TimeRange = { ...ast.timeRange, kind };
    onChange({ ...ast, timeRange: next });
  }

  function toggleZone(zone: string) {
    const exists = ast.zones.includes(zone);
    const next = exists ? ast.zones.filter((z) => z !== zone) : [...ast.zones, zone];
    onChange({ ...ast, zones: next });
  }

  function setFilters(next: Filter[]) {
    onChange({ ...ast, filters: next });
  }

  const currentMetric = ast.metrics[0] ?? { kind: 'lmp' };

  return (
    <ContainedCard padding={S.lg}>
      <div
        style={{
          fontFamily: F.mono,
          fontSize: 11,
          fontWeight: 600,
          letterSpacing: '0.16em',
          textTransform: 'uppercase',
          color: C.electricBlueLight,
          marginBottom: 4,
        }}
      >
        QUERY COMPOSER
      </div>
      <EditorialIdentity size="section" marginBottom={S.lg}>
        Compose a question.
      </EditorialIdentity>

      <Row label="METRIC">
        <select
          value={currentMetric.kind}
          onChange={(e) => setMetricKind(e.target.value as MetricKind)}
          style={selectStyle()}
        >
          {METRIC_OPTIONS.map((o) => (
            <option key={o.kind} value={o.kind}>
              {o.label}
            </option>
          ))}
        </select>
        {(currentMetric.kind === 'fuel-mix-pct' ||
          currentMetric.kind === 'marginal-fuel-share') && (
          <select
            value={currentMetric.fuel ?? 'natural_gas'}
            onChange={(e) =>
              onChange({ ...ast, metrics: [{ ...currentMetric, fuel: e.target.value }] })
            }
            style={selectStyle()}
          >
            {['natural_gas', 'nuclear', 'coal', 'wind', 'solar'].map((f) => (
              <option key={f} value={f}>
                {f}
              </option>
            ))}
          </select>
        )}
      </Row>

      <Row label="GROUP BY">
        <DimensionPicker
          selected={ast.dimensions}
          onChange={(next) => onChange({ ...ast, dimensions: next })}
        />
      </Row>

      <Row label="AGGREGATION">
        <AggregationPicker
          value={ast.aggregation}
          onChange={(next) => onChange({ ...ast, aggregation: next })}
        />
      </Row>

      <Row label="TIME RANGE">
        <select
          value={ast.timeRange.kind}
          onChange={(e) => setTimeRangeKind(e.target.value as TimeRangeKind)}
          style={selectStyle()}
        >
          {TIME_RANGE_OPTIONS.map((o) => (
            <option key={o.kind} value={o.kind}>
              {o.label}
            </option>
          ))}
        </select>
        {ast.timeRange.kind === 'custom' && (
          <>
            <input
              type="date"
              value={ast.timeRange.start ?? ''}
              onChange={(e) =>
                onChange({ ...ast, timeRange: { ...ast.timeRange, start: e.target.value } })
              }
              style={inputStyle()}
            />
            <input
              type="date"
              value={ast.timeRange.end ?? ''}
              onChange={(e) =>
                onChange({ ...ast, timeRange: { ...ast.timeRange, end: e.target.value } })
              }
              style={inputStyle()}
            />
          </>
        )}
      </Row>

      <Row label="ZONES">
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: S.sm, maxWidth: '100%' }}>
          {PJM_ZONES.map((z) => {
            const active = ast.zones.includes(z);
            return (
              <button
                key={z}
                type="button"
                onClick={() => toggleZone(z)}
                style={{
                  background: active ? C.electricBlueWash : 'transparent',
                  border: `1px solid ${active ? C.electricBlue : C.borderDefault}`,
                  borderRadius: R.sm,
                  padding: '3px 8px',
                  fontFamily: F.mono,
                  fontSize: 10,
                  fontWeight: 600,
                  letterSpacing: '0.08em',
                  color: active ? C.electricBlueLight : C.textSecondary,
                  cursor: 'pointer',
                }}
              >
                {z}
              </button>
            );
          })}
        </div>
      </Row>

      <Row label="FILTERS">
        <div style={{ flex: 1, minWidth: 0 }}>
          <FilterBar filters={ast.filters} onChange={setFilters} />
        </div>
      </Row>

      {/* Plan preview */}
      <div
        style={{
          marginTop: S.lg,
          padding: S.md,
          background: C.bgSurface,
          border: `1px solid ${C.borderDefault}`,
          borderLeft: `2px solid ${C.electricBlue}`,
          borderRadius: R.sm,
        }}
      >
        <div
          style={{
            fontFamily: F.mono,
            fontSize: 10,
            fontWeight: 500,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: C.textMuted,
            marginBottom: 4,
          }}
        >
          QUERY PLAN
        </div>
        <code
          style={{
            fontFamily: F.mono,
            fontSize: 12,
            color: C.textPrimary,
            lineHeight: 1.55,
            display: 'block',
            whiteSpace: 'pre-wrap',
          }}
        >
          {plan}
        </code>
      </div>

      <div
        style={{
          marginTop: S.lg,
          paddingTop: S.md,
          borderTop: `1px solid ${C.borderDefault}`,
          display: 'flex',
          gap: S.sm,
          justifyContent: 'flex-end',
        }}
      >
        <button
          type="button"
          onClick={onSave}
          style={{
            background: 'transparent',
            border: `1px solid ${C.borderDefault}`,
            borderRadius: R.md,
            padding: `0 ${S.lg}`,
            height: 36,
            fontFamily: F.mono,
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: C.textSecondary,
            cursor: 'pointer',
          }}
        >
          SAVE QUERY
        </button>
        <button
          type="button"
          disabled={isRunning}
          onClick={onRun}
          style={{
            background: isRunning ? 'transparent' : C.electricBlue,
            border: `1px solid ${isRunning ? C.borderDefault : C.electricBlue}`,
            borderRadius: R.md,
            padding: `0 ${S.lg}`,
            height: 36,
            fontFamily: F.mono,
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: isRunning ? C.textMuted : C.textPrimary,
            cursor: isRunning ? 'not-allowed' : 'pointer',
            opacity: isRunning ? 0.55 : 1,
          }}
        >
          {isRunning ? 'RUNNING…' : 'RUN QUERY →'}
        </button>
      </div>
    </ContainedCard>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: S.md,
        padding: `${S.sm} 0`,
        borderBottom: `1px solid ${C.borderDefault}`,
      }}
    >
      <div
        style={{
          width: 140,
          flexShrink: 0,
          paddingTop: 6,
          fontFamily: F.mono,
          fontSize: 10,
          fontWeight: 500,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: C.textMuted,
        }}
      >
        {label}
      </div>
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: S.sm,
          flex: 1,
          flexWrap: 'wrap',
        }}
      >
        {children}
      </div>
    </div>
  );
}

function selectStyle(): React.CSSProperties {
  return {
    background: C.bgSurface,
    border: `1px solid ${C.borderDefault}`,
    borderRadius: R.md,
    padding: '6px 10px',
    fontFamily: F.mono,
    fontSize: 12,
    fontWeight: 600,
    letterSpacing: '0.10em',
    textTransform: 'uppercase',
    color: C.textPrimary,
    outline: 'none',
    minWidth: 160,
    cursor: 'pointer',
  };
}

function inputStyle(): React.CSSProperties {
  return {
    background: C.bgSurface,
    border: `1px solid ${C.borderDefault}`,
    borderRadius: R.md,
    padding: '6px 10px',
    fontFamily: F.mono,
    fontSize: 12,
    color: C.textPrimary,
    outline: 'none',
  };
}
