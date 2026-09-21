// FORGE Wave 6 — DimensionPicker.
// Multi-select chip set for the query's grouping dimensions.
// Single source of truth: the parent owns the array; this is dumb.

import { C, F, R, S } from '@/design/tokens';
import type { Dimension } from '@/lib/analyst/types';

interface Props {
  selected: Dimension[];
  onChange: (next: Dimension[]) => void;
}

const OPTIONS: { kind: Dimension['kind']; label: string }[] = [
  { kind: 'zone', label: 'ZONE' },
  { kind: 'time-of-day', label: 'HOUR-OF-DAY' },
  { kind: 'day-of-week', label: 'DAY-OF-WEEK' },
  { kind: 'date', label: 'DATE' },
  { kind: 'month', label: 'MONTH' },
  { kind: 'fuel', label: 'FUEL' },
];

export function DimensionPicker({ selected, onChange }: Props) {
  function toggle(kind: Dimension['kind']) {
    const exists = selected.some((d) => d.kind === kind);
    if (exists) {
      onChange(selected.filter((d) => d.kind !== kind));
    } else {
      onChange([...selected, { kind }]);
    }
  }

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: S.sm }}>
      {OPTIONS.map((o) => {
        const active = selected.some((d) => d.kind === o.kind);
        return (
          <button
            key={o.kind}
            type="button"
            onClick={() => toggle(o.kind)}
            style={{
              background: active ? C.electricBlueWash : 'transparent',
              border: `1px solid ${active ? C.electricBlue : C.borderDefault}`,
              borderRadius: R.sm,
              padding: '4px 10px',
              fontFamily: F.mono,
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: active ? C.electricBlueLight : C.textSecondary,
              cursor: 'pointer',
            }}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}
