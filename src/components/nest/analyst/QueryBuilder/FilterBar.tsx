// FORGE Wave 6 — FilterBar.
// Compact chip list of active filters. Add via the three-field inline
// form (field / op / value); remove via the × on each chip.

import { useState } from 'react';
import { C, F, R, S } from '@/design/tokens';
import type {
  Filter,
  FilterOperator,
} from '@/lib/analyst/types';

interface Props {
  filters: Filter[];
  onChange: (next: Filter[]) => void;
}

const FIELDS: Filter['field'][] = [
  'lmp', 'congestion', 'load', 'reserve-margin', 'fuel-mix-pct',
  'zone', 'time-of-day', 'day-of-week', 'fuel',
];

const OPS: FilterOperator[] = ['=', '!=', '>', '<', '>=', '<=', 'IN', 'NOT IN'];

export function FilterBar({ filters, onChange }: Props) {
  const [field, setField] = useState<Filter['field']>('lmp');
  const [op, setOp] = useState<FilterOperator>('<');
  const [value, setValue] = useState<string>('0');

  function addFilter() {
    if (!field || !op || value === '') return;
    let parsed: Filter['value'];
    if (op === 'IN' || op === 'NOT IN') {
      parsed = value.split(',').map((s) => {
        const trimmed = s.trim();
        const n = Number(trimmed);
        return Number.isFinite(n) && trimmed !== '' ? n : trimmed;
      });
    } else {
      const n = Number(value);
      parsed = Number.isFinite(n) && value.trim() !== '' ? n : value;
    }
    onChange([...filters, { field, operator: op, value: parsed }]);
    setValue('');
  }

  function removeAt(idx: number) {
    onChange(filters.filter((_, i) => i !== idx));
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: S.sm }}>
      {/* Active filter chips */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: S.sm, minHeight: 28 }}>
        {filters.length === 0 ? (
          <span
            style={{
              fontFamily: F.mono,
              fontSize: 11,
              color: C.textMuted,
              letterSpacing: '0.10em',
              textTransform: 'uppercase',
            }}
          >
            No filters
          </span>
        ) : (
          filters.map((f, i) => (
            <span
              key={i}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                background: C.bgSurface,
                border: `1px solid ${C.borderDefault}`,
                borderRadius: R.sm,
                padding: '4px 8px',
                fontFamily: F.mono,
                fontSize: 11,
                color: C.textPrimary,
                letterSpacing: '0.06em',
              }}
            >
              <span style={{ color: C.electricBlueLight }}>{f.field}</span>
              <span style={{ color: C.textMuted }}>{f.operator}</span>
              <span style={{ fontVariantNumeric: 'tabular-nums' }}>
                {Array.isArray(f.value) ? `[${f.value.join(', ')}]` : String(f.value)}
              </span>
              <button
                type="button"
                onClick={() => removeAt(i)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  color: C.textMuted,
                  fontFamily: F.mono,
                  fontSize: 12,
                  lineHeight: 1,
                  padding: 0,
                }}
              >
                ×
              </button>
            </span>
          ))
        )}
      </div>

      {/* Add row */}
      <div style={{ display: 'flex', gap: S.sm, alignItems: 'center' }}>
        <select
          value={field}
          onChange={(e) => setField(e.target.value as Filter['field'])}
          style={selectStyle()}
        >
          {FIELDS.map((f) => (
            <option key={f} value={f}>
              {f}
            </option>
          ))}
        </select>
        <select
          value={op}
          onChange={(e) => setOp(e.target.value as FilterOperator)}
          style={selectStyle()}
        >
          {OPS.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={op === 'IN' || op === 'NOT IN' ? 'a, b, c' : 'value'}
          style={inputStyle()}
        />
        <button
          type="button"
          onClick={addFilter}
          style={{
            background: 'transparent',
            border: `1px solid ${C.electricBlue}`,
            color: C.electricBlueLight,
            borderRadius: R.md,
            padding: '6px 10px',
            fontFamily: F.mono,
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: '0.10em',
            textTransform: 'uppercase',
            cursor: 'pointer',
          }}
        >
          + Add filter
        </button>
      </div>
    </div>
  );
}

function selectStyle(): React.CSSProperties {
  return {
    background: C.bgSurface,
    border: `1px solid ${C.borderDefault}`,
    borderRadius: R.md,
    padding: '6px 8px',
    fontFamily: F.mono,
    fontSize: 11,
    color: C.textPrimary,
    outline: 'none',
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
    fontVariantNumeric: 'tabular-nums',
    color: C.textPrimary,
    outline: 'none',
    flex: 1,
    minWidth: 120,
  };
}
