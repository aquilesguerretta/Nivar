// FORGE Wave 6 — AggregationPicker.
// Single-aggregation select with conditional N / percentile sub-input.

import { C, F, R, S } from '@/design/tokens';
import type { Aggregation, AggregationKind } from '@/lib/analyst/types';

interface Props {
  value: Aggregation;
  onChange: (next: Aggregation) => void;
}

const OPTIONS: { kind: AggregationKind; label: string }[] = [
  { kind: 'avg', label: 'AVERAGE' },
  { kind: 'sum', label: 'SUM' },
  { kind: 'min', label: 'MIN' },
  { kind: 'max', label: 'MAX' },
  { kind: 'top-n', label: 'TOP N' },
  { kind: 'bottom-n', label: 'BOTTOM N' },
  { kind: 'percentile', label: 'PERCENTILE' },
  { kind: 'count', label: 'COUNT' },
];

export function AggregationPicker({ value, onChange }: Props) {
  const showN = value.kind === 'top-n' || value.kind === 'bottom-n';
  const showPercentile = value.kind === 'percentile';
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: S.sm }}>
      <select
        value={value.kind}
        onChange={(e) =>
          onChange({ ...value, kind: e.target.value as AggregationKind })
        }
        style={{
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
          minWidth: 140,
          cursor: 'pointer',
        }}
      >
        {OPTIONS.map((o) => (
          <option key={o.kind} value={o.kind}>
            {o.label}
          </option>
        ))}
      </select>
      {showN && (
        <>
          <span
            style={{
              fontFamily: F.mono,
              fontSize: 10,
              color: C.textMuted,
              letterSpacing: '0.10em',
              textTransform: 'uppercase',
            }}
          >
            N
          </span>
          <input
            type="number"
            min={1}
            max={100}
            value={value.n ?? 5}
            onChange={(e) => onChange({ ...value, n: Math.max(1, Number(e.target.value)) })}
            style={inputStyle()}
          />
        </>
      )}
      {showPercentile && (
        <>
          <span
            style={{
              fontFamily: F.mono,
              fontSize: 10,
              color: C.textMuted,
              letterSpacing: '0.10em',
              textTransform: 'uppercase',
            }}
          >
            P
          </span>
          <input
            type="number"
            min={1}
            max={99}
            value={value.percentile ?? 95}
            onChange={(e) => onChange({ ...value, percentile: Math.max(1, Math.min(99, Number(e.target.value))) })}
            style={inputStyle()}
          />
        </>
      )}
    </div>
  );
}

function inputStyle(): React.CSSProperties {
  return {
    background: C.bgSurface,
    border: `1px solid ${C.borderDefault}`,
    borderRadius: R.md,
    padding: '6px 10px',
    fontFamily: F.mono,
    fontSize: 12,
    fontVariantNumeric: 'tabular-nums',
    color: C.textPrimary,
    outline: 'none',
    width: 72,
  };
}
