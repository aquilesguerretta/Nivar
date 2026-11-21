// FORGE Wave 5 — Annual equity cashflow waterfall.
//
// Each year a column. Stack:
//   + revenue + capacity_revenue + itc + ptc       (gains, falcon gold)
//   − opex − debt_service − taxes                  (costs, alert critical)
//   = equity_cashflow (net)                        (line overlay)
//
// Wrapped in AnnotatableChart so reviewers can pin notes to specific
// years. Renders all 26 columns (year 0 + economic life).

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
import type { CashflowYear } from '@/lib/underwriting/types';

interface Props {
  /** Project id used as the AnnotatableChart key. */
  projectId: string;
  /** Cashflow rows including year 0 (negative equity contribution). */
  cashflows: CashflowYear[];
}

function formatTickUSD(v: number): string {
  const sign = v < 0 ? '−' : '';
  const abs = Math.abs(v);
  if (abs >= 1_000_000) return `${sign}$${(abs / 1_000_000).toFixed(1)}M`;
  if (abs >= 1_000) return `${sign}$${(abs / 1_000).toFixed(0)}k`;
  return `${sign}$${abs.toFixed(0)}`;
}

export function CashflowWaterfall({ projectId, cashflows }: Props) {
  // Recharts requires positive and negative bars on separate dataKeys
  // so each segment stacks visually correctly. We pre-compute:
  //   revenuePositive  = revenue + capacityRevenue + itc + ptc
  //   costsNegative    = -(opex + debtService + taxes)
  //   net              = equityCashflow (overlay line)

  const data = cashflows.map((c) => {
    const revenueGroup =
      c.revenueUSD + c.capacityRevenueUSD + c.itcCreditUSD + c.ptcCreditUSD;
    const costsGroup = -(c.opexUSD + c.debtServiceUSD + c.taxesUSD);
    // Year 0: equity contribution is the negative side; revenue side
    // is zero.
    return {
      year: c.year,
      revenue: c.revenueUSD,
      capacity: c.capacityRevenueUSD,
      itc: c.itcCreditUSD,
      ptc: c.ptcCreditUSD,
      opex: -c.opexUSD,
      debt: -c.debtServiceUSD,
      taxes: -c.taxesUSD,
      // Year 0 negative equity contribution lives in `debt` so it appears
      // on the costs side without a new bar series.
      equityInvest: c.year === 0 ? c.equityCashflowUSD : 0,
      net: c.equityCashflowUSD,
      revenueGroup,
      costsGroup,
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
        CASHFLOW WATERFALL · ANNUAL EQUITY
      </div>

      <AnnotatableChart chartId={`uw-cashflow-${projectId}`}>
        <div style={{ height: 280 }}>
          <ResponsiveContainer>
            <ComposedChart
              data={data}
              margin={{ top: 8, right: 16, bottom: 8, left: 8 }}
              stackOffset="sign"
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
                tickFormatter={(v: number) => formatTickUSD(v)}
                width={64}
              />
              <Tooltip
                cursor={{ fill: 'rgba(255,255,255,0.04)' }}
                contentStyle={{
                  background: C.bgElevated,
                  border: `1px solid ${C.borderStrong}`,
                  borderRadius: R.md,
                  fontFamily: F.mono,
                  fontSize: 11,
                  color: C.textPrimary,
                }}
                labelStyle={{ color: C.textMuted }}
                formatter={(value, name) => {
                  const n = typeof value === 'number' ? value : Number(value);
                  return [formatTickUSD(n), String(name)];
                }}
                labelFormatter={(v) => `Year ${v}`}
              />
              <Bar
                dataKey="revenue"
                stackId="cashflow"
                fill={C.falconGold}
                fillOpacity={0.75}
                name="Revenue"
              />
              <Bar
                dataKey="capacity"
                stackId="cashflow"
                fill={C.falconGoldLight}
                fillOpacity={0.55}
                name="Capacity rev."
              />
              <Bar
                dataKey="itc"
                stackId="cashflow"
                fill={C.alertNormal}
                fillOpacity={0.55}
                name="ITC"
              />
              <Bar
                dataKey="ptc"
                stackId="cashflow"
                fill={C.electricBlue}
                fillOpacity={0.5}
                name="PTC"
              />
              <Bar
                dataKey="opex"
                stackId="cashflow"
                fill={C.alertWarning}
                fillOpacity={0.55}
                name="Opex"
              />
              <Bar
                dataKey="debt"
                stackId="cashflow"
                fill={C.alertCritical}
                fillOpacity={0.55}
                name="Debt service"
              />
              <Bar
                dataKey="taxes"
                stackId="cashflow"
                fill={C.alertHigh}
                fillOpacity={0.55}
                name="Taxes"
              />
              <Bar
                dataKey="equityInvest"
                stackId="cashflow"
                fill={C.alertCritical}
                fillOpacity={0.8}
                name="Equity invest"
              />
              <Line
                type="linear"
                dataKey="net"
                stroke={C.textPrimary}
                strokeWidth={2}
                dot={{ r: 2, fill: C.textPrimary }}
                name="Net equity CF"
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </AnnotatableChart>
    </ContainedCard>
  );
}
