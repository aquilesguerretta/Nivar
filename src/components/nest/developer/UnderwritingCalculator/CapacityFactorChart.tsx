// FORGE Wave 5 — Capacity factor chart.
//
// Combination chart:
//   - Bars: current-year monthly CF (12 columns)
//   - Line: annual CF trend across the project's economic life
//     (degradation curve)
//
// Both share the same Y-axis (CF percentage). Used to convey both
// the seasonal shape and the lifetime trajectory at a glance.

import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { C, F, R, S } from '@/design/tokens';
import { ContainedCard } from '@/components/terminal/ContainedCard';
import { AnnotatableChart } from '@/components/shared/AnnotatableChart';
import { generateMonthlyCFProfile } from '@/lib/underwriting/capacityFactor';
import type { ProjectSpec } from '@/lib/underwriting/types';

interface Props {
  projectId: string;
  spec: ProjectSpec;
  capacityFactorByYear: number[];
}

const MONTH_LABELS = [
  'JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN',
  'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC',
];

export function CapacityFactorChart({
  projectId,
  spec,
  capacityFactorByYear,
}: Props) {
  // Year 1 monthly profile by default.
  const monthly = generateMonthlyCFProfile(spec.technology, spec.zone, 1);
  const data = monthly.map((cf, i) => ({
    month: MONTH_LABELS[i],
    monthlyPct: Number((cf * 100).toFixed(2)),
    // Project a smoothed annual trend line across 12 columns by linear-
    // interpolating the lifetime CF trajectory so the line and the bars
    // share an X-axis. Map month index i to year i × (life-1)/11.
    annualPct: (() => {
      const ratio = i / 11;
      const yearIdx = Math.min(
        capacityFactorByYear.length - 1,
        Math.floor(ratio * (capacityFactorByYear.length - 1)),
      );
      return Number(((capacityFactorByYear[yearIdx] ?? 0) * 100).toFixed(2));
    })(),
  }));

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
        CAPACITY FACTOR · MONTHLY × LIFETIME
      </div>

      <AnnotatableChart chartId={`uw-cf-${projectId}`}>
        <div style={{ height: 220 }}>
          <ResponsiveContainer>
            <ComposedChart
              data={data}
              margin={{ top: 8, right: 16, bottom: 8, left: 8 }}
            >
              <CartesianGrid stroke={C.borderDefault} vertical={false} />
              <XAxis
                dataKey="month"
                stroke={C.textMuted}
                tick={{ fontFamily: F.mono, fontSize: 10, fill: C.textMuted }}
              />
              <YAxis
                stroke={C.textMuted}
                tick={{ fontFamily: F.mono, fontSize: 10, fill: C.textMuted }}
                tickFormatter={(v: number) => `${v.toFixed(0)}%`}
                width={44}
              />
              <Tooltip
                cursor={{ fill: 'rgba(255,255,255,0.04)' }}
                contentStyle={{
                  background: C.bgElevated,
                  border: `1px solid ${C.borderStrong}`,
                  borderRadius: R.md,
                  fontFamily: F.mono,
                  fontSize: 12,
                  color: C.textPrimary,
                }}
                labelStyle={{ color: C.textMuted }}
                formatter={(value, name) => {
                  const n = typeof value === 'number' ? value : Number(value);
                  return [`${n.toFixed(2)}%`, String(name)];
                }}
              />
              <Bar
                dataKey="monthlyPct"
                name="Monthly Yr 1"
                fill={C.electricBlue}
                fillOpacity={0.55}
                radius={[2, 2, 0, 0]}
              />
              <Line
                type="monotone"
                dataKey="annualPct"
                name="Lifetime trend"
                stroke={C.falconGold}
                strokeWidth={2}
                dot={false}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </AnnotatableChart>
      <div
        style={{
          marginTop: S.sm,
          fontFamily: F.mono,
          fontSize: 11,
          color: C.textMuted,
          letterSpacing: '0.06em',
        }}
      >
        Year-1 CF{' '}
        <span style={{ color: C.textPrimary, fontWeight: 600 }}>
          {((capacityFactorByYear[0] ?? 0) * 100).toFixed(1)}%
        </span>
        {' · '}
        Year-{capacityFactorByYear.length} CF{' '}
        <span style={{ color: C.textPrimary, fontWeight: 600 }}>
          {(
            (capacityFactorByYear[capacityFactorByYear.length - 1] ?? 0) * 100
          ).toFixed(1)}
          %
        </span>
      </div>
    </ContainedCard>
  );
}
