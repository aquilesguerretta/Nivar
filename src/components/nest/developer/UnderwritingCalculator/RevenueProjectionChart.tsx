// FORGE Wave 5 — Revenue projection chart.
//
// Annual revenue over the project's economic life, plotted for all
// three scenarios (base solid, upside dashed, downside dotted) per
// terminal-motion.md restraint rules.

import {
  CartesianGrid,
  Line,
  LineChart,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { C, F, R, S } from '@/design/tokens';
import { ContainedCard } from '@/components/terminal/ContainedCard';
import { AnnotatableChart } from '@/components/shared/AnnotatableChart';
import type { UnderwritingResults } from '@/lib/underwriting/types';

interface Props {
  projectId: string;
  results: UnderwritingResults;
}

function formatUSDLong(v: number): string {
  if (!Number.isFinite(v)) return '—';
  const sign = v < 0 ? '−' : '';
  const abs = Math.abs(v);
  if (abs >= 1_000_000) return `${sign}$${(abs / 1_000_000).toFixed(1)}M`;
  if (abs >= 1_000) return `${sign}$${(abs / 1_000).toFixed(0)}k`;
  return `${sign}$${abs.toFixed(0)}`;
}

export function RevenueProjectionChart({ projectId, results }: Props) {
  // Year 0 has zero revenue (pre-COD); start at year 1.
  const baseFlows = results.scenarios.base.cashflows.filter((c) => c.year > 0);
  const upFlows = results.scenarios.upside.cashflows.filter((c) => c.year > 0);
  const dnFlows = results.scenarios.downside.cashflows.filter((c) => c.year > 0);

  const data = baseFlows.map((b, i) => {
    const u = upFlows[i];
    const d = dnFlows[i];
    return {
      year: b.year,
      base: b.revenueUSD + b.capacityRevenueUSD,
      upside: (u?.revenueUSD ?? 0) + (u?.capacityRevenueUSD ?? 0),
      downside: (d?.revenueUSD ?? 0) + (d?.capacityRevenueUSD ?? 0),
    };
  });

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
        REVENUE PROJECTION · ECONOMIC LIFE
      </div>

      <AnnotatableChart chartId={`uw-revenue-${projectId}`}>
        <div style={{ height: 240 }}>
          <ResponsiveContainer>
            <LineChart
              data={data}
              margin={{ top: 8, right: 16, bottom: 8, left: 8 }}
            >
              <CartesianGrid stroke={C.borderDefault} vertical={false} />
              <XAxis
                dataKey="year"
                stroke={C.textMuted}
                tick={{ fontFamily: F.mono, fontSize: 10, fill: C.textMuted }}
                tickFormatter={(v) => `Y${v}`}
                interval={2}
              />
              <YAxis
                stroke={C.textMuted}
                tick={{ fontFamily: F.mono, fontSize: 10, fill: C.textMuted }}
                tickFormatter={(v: number) => formatUSDLong(v)}
                width={72}
              />
              <Tooltip
                cursor={{ stroke: C.borderStrong, strokeDasharray: '2 4' }}
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
                  return [formatUSDLong(n), String(name)];
                }}
                labelFormatter={(v) => `Year ${v}`}
              />
              <Legend
                wrapperStyle={{
                  fontFamily: F.mono,
                  fontSize: 11,
                  color: C.textSecondary,
                }}
              />
              <Line
                type="monotone"
                dataKey="upside"
                name="Upside"
                stroke={C.alertNormal}
                strokeWidth={2}
                strokeDasharray="6 3"
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="base"
                name="Base"
                stroke={C.electricBlue}
                strokeWidth={2}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="downside"
                name="Downside"
                stroke={C.alertCritical}
                strokeWidth={2}
                strokeDasharray="2 4"
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </AnnotatableChart>
    </ContainedCard>
  );
}
