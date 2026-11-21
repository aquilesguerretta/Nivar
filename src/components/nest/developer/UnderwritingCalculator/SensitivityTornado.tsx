// FORGE Wave 5 — Sensitivity tornado chart.
//
// Classic tornado: each lever is a horizontal bar pair (down delta on
// the left of zero, up delta on the right). Sorted by absolute IRR
// impact descending so the reader sees the dominant lever first.

import { useMemo } from 'react';
import { C, F, R, S } from '@/design/tokens';
import { ContainedCard } from '@/components/terminal/ContainedCard';
import type { SensitivityEntry } from '@/lib/underwriting/types';

interface Props {
  entries: SensitivityEntry[];
  baseIRR: number;
}

const ROW_HEIGHT = 28;

export function SensitivityTornado({ entries, baseIRR }: Props) {
  const maxAbs = useMemo(() => {
    let m = 0;
    for (const e of entries) {
      if (Math.abs(e.irrDeltaDown) > m) m = Math.abs(e.irrDeltaDown);
      if (Math.abs(e.irrDeltaUp) > m) m = Math.abs(e.irrDeltaUp);
    }
    return m || 0.01;
  }, [entries]);

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
          marginBottom: S.md,
        }}
      >
        SENSITIVITY · IRR DELTA BY LEVER
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {entries.map((entry) => {
          const downWidthPct = (Math.abs(entry.irrDeltaDown) / maxAbs) * 45;
          const upWidthPct = (Math.abs(entry.irrDeltaUp) / maxAbs) * 45;
          const downColor =
            entry.irrDeltaDown < 0 ? C.alertCritical : C.alertNormal;
          const upColor =
            entry.irrDeltaUp >= 0 ? C.alertNormal : C.alertCritical;
          return (
            <div
              key={entry.label}
              style={{
                display: 'grid',
                gridTemplateColumns: '140px 1fr 140px',
                alignItems: 'center',
                height: ROW_HEIGHT,
                gap: S.sm,
              }}
            >
              <span
                style={{
                  fontFamily: F.mono,
                  fontSize: 11,
                  color: C.textSecondary,
                  letterSpacing: '0.10em',
                  textTransform: 'uppercase',
                }}
              >
                {entry.label}
              </span>

              {/* Bar track */}
              <div
                style={{
                  position: 'relative',
                  height: 12,
                  background: C.bgSurface,
                  border: `1px solid ${C.borderDefault}`,
                  borderRadius: R.sm,
                  overflow: 'hidden',
                }}
              >
                {/* Down bar (left of center) */}
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    bottom: 0,
                    right: '50%',
                    width: `${downWidthPct}%`,
                    background: downColor,
                    opacity: 0.85,
                  }}
                />
                {/* Up bar (right of center) */}
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    bottom: 0,
                    left: '50%',
                    width: `${upWidthPct}%`,
                    background: upColor,
                    opacity: 0.85,
                  }}
                />
                {/* Center line */}
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    bottom: 0,
                    left: '50%',
                    width: 1,
                    background: C.borderStrong,
                  }}
                />
              </div>

              {/* Delta labels */}
              <span
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontFamily: F.mono,
                  fontSize: 11,
                  fontVariantNumeric: 'tabular-nums',
                  fontWeight: 600,
                  gap: S.sm,
                }}
              >
                <span style={{ color: downColor }}>
                  {entry.irrDeltaDown >= 0 ? '+' : '−'}
                  {(Math.abs(entry.irrDeltaDown) * 100).toFixed(1)}pp
                </span>
                <span style={{ color: upColor }}>
                  {entry.irrDeltaUp >= 0 ? '+' : '−'}
                  {(Math.abs(entry.irrDeltaUp) * 100).toFixed(1)}pp
                </span>
              </span>
            </div>
          );
        })}
      </div>

      <div
        style={{
          marginTop: S.md,
          paddingTop: S.md,
          borderTop: `1px solid ${C.borderDefault}`,
          display: 'flex',
          justifyContent: 'space-between',
          fontFamily: F.mono,
          fontSize: 10,
          color: C.textMuted,
          letterSpacing: '0.10em',
          textTransform: 'uppercase',
        }}
      >
        <span>BASE IRR{' '}
          <span style={{ color: C.textPrimary, fontWeight: 600 }}>
            {Number.isFinite(baseIRR) ? `${(baseIRR * 100).toFixed(1)}%` : '—'}
          </span>
        </span>
        <span>Δ shown in percentage points of IRR</span>
      </div>
    </ContainedCard>
  );
}
