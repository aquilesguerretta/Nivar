// FORGE Wave 5 — PPA benchmark overlay.
//
// Horizontal axis representing $/MWh price space. A shaded band shows
// the PPA benchmark floor / median / ceiling for the project's tech.
// A marker shows the project's breakeven LMP. Verdict:
//   - breakeven < floor  → green dot, "Above-PPA attractive"
//   - breakeven > ceiling → red dot, "Not financeable at current market"
//   - otherwise → falcon-gold dot, "Within benchmark band"

import { C, F, R, S } from '@/design/tokens';
import { ContainedCard } from '@/components/terminal/ContainedCard';
import type { PPABenchmarkBand } from '@/lib/underwriting/types';

interface Props {
  benchmark: PPABenchmarkBand;
  breakevenLMP: number;
}

const CHART_HEIGHT = 80;

export function PPABenchmarkOverlay({ benchmark, breakevenLMP }: Props) {
  // Axis bounds — pad ±20% around the wider of breakeven and band.
  const lo = Math.min(benchmark.floor, breakevenLMP);
  const hi = Math.max(benchmark.ceiling, breakevenLMP);
  const range = hi - lo;
  const padLo = Math.max(0, lo - range * 0.2);
  const padHi = hi + range * 0.2;
  const span = padHi - padLo || 1;

  function xFor(value: number): number {
    return ((value - padLo) / span) * 100;
  }

  let verdict: { text: string; color: string };
  if (!Number.isFinite(breakevenLMP)) {
    verdict = {
      text: 'Breakeven not computable for this scenario.',
      color: C.textMuted,
    };
  } else if (breakevenLMP < benchmark.floor) {
    verdict = {
      text: `Below PPA floor — project clears a fixed-price offtake handily.`,
      color: C.alertNormal,
    };
  } else if (breakevenLMP > benchmark.ceiling) {
    verdict = {
      text: `Above PPA ceiling — not financeable at current PPA market.`,
      color: C.alertCritical,
    };
  } else {
    verdict = {
      text: `Within PPA benchmark band — competitive but margins are thin.`,
      color: C.falconGold,
    };
  }

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
        PPA BENCHMARK · {benchmark.technology.toUpperCase()}
      </div>

      <div
        style={{
          position: 'relative',
          height: CHART_HEIGHT,
          background: C.bgSurface,
          border: `1px solid ${C.borderDefault}`,
          borderRadius: R.md,
          overflow: 'hidden',
        }}
      >
        {/* Band: floor → ceiling */}
        <div
          style={{
            position: 'absolute',
            top: 16,
            bottom: 16,
            left: `${xFor(benchmark.floor)}%`,
            width: `${xFor(benchmark.ceiling) - xFor(benchmark.floor)}%`,
            background: C.electricBlueWash,
            border: `1px solid ${C.borderActive}`,
            borderRadius: R.sm,
          }}
          title={`PPA range $${benchmark.floor.toFixed(2)} – $${benchmark.ceiling.toFixed(2)}/MWh`}
        />
        {/* Median tick */}
        <div
          style={{
            position: 'absolute',
            top: 12,
            bottom: 12,
            left: `${xFor(benchmark.median)}%`,
            width: 1,
            background: C.electricBlue,
          }}
          title={`Median $${benchmark.median.toFixed(2)}/MWh`}
        />
        {/* Breakeven marker */}
        {Number.isFinite(breakevenLMP) && (
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: `${xFor(breakevenLMP)}%`,
              transform: 'translate(-50%, -50%)',
              width: 14,
              height: 14,
              borderRadius: '50%',
              background: verdict.color,
              border: `2px solid ${C.bgBase}`,
              boxShadow: 'none',
            }}
            title={`Breakeven $${breakevenLMP.toFixed(2)}/MWh`}
          />
        )}
        {/* Axis labels */}
        <div
          style={{
            position: 'absolute',
            bottom: 4,
            left: 6,
            fontFamily: F.mono,
            fontSize: 10,
            color: C.textMuted,
            letterSpacing: '0.08em',
          }}
        >
          ${padLo.toFixed(0)}
        </div>
        <div
          style={{
            position: 'absolute',
            bottom: 4,
            right: 6,
            fontFamily: F.mono,
            fontSize: 10,
            color: C.textMuted,
            letterSpacing: '0.08em',
          }}
        >
          ${padHi.toFixed(0)}/MWh
        </div>
      </div>

      <div
        style={{
          marginTop: S.md,
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: S.md,
        }}
      >
        <Stat label="PPA FLOOR" value={`$${benchmark.floor.toFixed(2)}`} />
        <Stat label="PPA MEDIAN" value={`$${benchmark.median.toFixed(2)}`} />
        <Stat label="PPA CEILING" value={`$${benchmark.ceiling.toFixed(2)}`} />
      </div>

      <div
        style={{
          marginTop: S.md,
          paddingTop: S.md,
          borderTop: `1px solid ${C.borderDefault}`,
          fontFamily: F.sans,
          fontSize: 13,
          color: verdict.color,
          lineHeight: 1.5,
        }}
      >
        {verdict.text}
      </div>
      <div
        style={{
          marginTop: 4,
          fontFamily: F.mono,
          fontSize: 10,
          color: C.textMuted,
          letterSpacing: '0.10em',
          textTransform: 'uppercase',
        }}
      >
        Sample · {benchmark.sampleCount} deals
      </div>
    </ContainedCard>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
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
        {label}
      </div>
      <div
        style={{
          fontFamily: F.mono,
          fontSize: 14,
          fontWeight: 600,
          fontVariantNumeric: 'tabular-nums',
          color: C.textPrimary,
        }}
      >
        {value}
      </div>
    </div>
  );
}
