// FORGE Wave 7 — Cumulative-PnL performance chart.
//
// Walks the closed positions in exit-date order and plots running
// cumulative PnL. Significant events (gains ≥ +$1k, losses ≤ −$1k)
// surface as Falcon Gold reference dots that double-click into the
// underlying position via the consumer-supplied `onSelectEvent`.
//
// The chart uses Recharts to match every other time-series surface
// in the platform (LMP24HChart, JournalPnLChart, etc.).

import { useMemo } from 'react';
import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceDot,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { C, F, S } from '@/design/tokens';
import { ContainedCard } from '@/components/terminal/ContainedCard';
import { EditorialIdentity } from '@/components/terminal/EditorialIdentity';
import { useSandboxStore } from '@/lib/sandbox/positionState';
import {
  computeClosedPositionPnL,
  cumulativePnLSeries,
} from '@/lib/sandbox/markToMarket';

interface Props {
  onSelectEvent?: (positionId: string) => void;
}

const SIGNIFICANT_THRESHOLD_USD = 1000;

interface ChartPoint {
  at: string;
  /** Numeric x-axis index — Recharts works better with deterministic numeric x. */
  index: number;
  cumulativePnLUSD: number;
  positionId: string;
  /** Single-trade PnL for the tooltip. */
  tradePnLUSD: number;
}

export function PerformanceHistory({ onSelectEvent }: Props) {
  const positions = useSandboxStore((s) => s.positions);

  const points: ChartPoint[] = useMemo(() => {
    const cum = cumulativePnLSeries(positions);
    const byId = new Map(positions.map((p) => [p.id, p]));
    return cum.map((c, i) => {
      const pos = byId.get(c.positionId);
      return {
        at: c.at,
        index: i + 1,
        cumulativePnLUSD: Math.round(c.cumulativePnLUSD),
        positionId: c.positionId,
        tradePnLUSD: pos ? Math.round(computeClosedPositionPnL(pos)) : 0,
      };
    });
  }, [positions]);

  if (points.length === 0) {
    return (
      <ContainedCard padding={S.xl}>
        <div style={{ marginBottom: S.md }}>
          <div
            style={{
              fontFamily: F.mono,
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: C.electricBlue,
              marginBottom: S.xs,
            }}
          >
            PERFORMANCE HISTORY
          </div>
          <EditorialIdentity size="section">Your trajectory.</EditorialIdentity>
        </div>

        <div
          style={{
            textAlign: 'center',
            fontFamily: F.sans,
            fontSize: 13,
            color: C.textMuted,
            padding: S.xl,
            lineHeight: 1.6,
          }}
        >
          Close a position to start building your performance history.
        </div>
      </ContainedCard>
    );
  }

  const lineColor =
    points[points.length - 1].cumulativePnLUSD >= 0
      ? C.alertNormal
      : C.alertCritical;

  return (
    <ContainedCard padding={S.lg}>
      <div style={{ marginBottom: S.md }}>
        <div
          style={{
            fontFamily: F.mono,
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: C.electricBlue,
            marginBottom: S.xs,
          }}
        >
          PERFORMANCE HISTORY · {points.length} CLOSED
        </div>
        <EditorialIdentity size="section">Your trajectory.</EditorialIdentity>
      </div>

      <div style={{ width: '100%', height: 260 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={points}
            margin={{ top: 12, right: 18, bottom: 12, left: 12 }}
          >
            <CartesianGrid
              stroke={C.borderDefault}
              strokeDasharray="3 4"
              vertical={false}
            />
            <XAxis
              dataKey="index"
              type="number"
              domain={[0.5, points.length + 0.5]}
              ticks={points.map((p) => p.index)}
              tick={{
                fill: C.textMuted,
                fontFamily: F.mono,
                fontSize: 10,
              }}
              stroke={C.borderDefault}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              tick={{
                fill: C.textMuted,
                fontFamily: F.mono,
                fontSize: 10,
              }}
              tickFormatter={(v) =>
                v === 0 ? '$0' : v > 0 ? `+$${v}` : `−$${Math.abs(v)}`
              }
              stroke={C.borderDefault}
              tickLine={false}
              axisLine={false}
              width={70}
            />
            <Tooltip
              cursor={{ stroke: C.electricBlue, strokeDasharray: '3 3' }}
              contentStyle={{
                background: C.bgElevated,
                border: `1px solid ${C.borderStrong}`,
                borderRadius: 4,
                fontFamily: F.mono,
                fontSize: 11,
                color: C.textPrimary,
              }}
              labelFormatter={(v) => `Trade #${v}`}
              formatter={(value, _name, ctx) => {
                if (value == null) return ['—', 'cumulative'];
                const n = Number(value);
                const trade = (ctx?.payload as ChartPoint | undefined)
                  ?.tradePnLUSD;
                const tradeSign = trade !== undefined && trade < 0 ? '−' : '+';
                return [
                  `$${Math.abs(n).toLocaleString()}`,
                  trade !== undefined
                    ? `cumulative (this trade ${tradeSign}$${Math.abs(trade).toLocaleString()})`
                    : 'cumulative',
                ];
              }}
            />
            <Line
              type="monotone"
              dataKey="cumulativePnLUSD"
              stroke={lineColor}
              strokeWidth={1.5}
              dot={{ r: 3, fill: lineColor, stroke: lineColor }}
              activeDot={{ r: 4 }}
              isAnimationActive={false}
            />
            {points
              .filter((p) => Math.abs(p.tradePnLUSD) >= SIGNIFICANT_THRESHOLD_USD)
              .map((p) => (
                <ReferenceDot
                  key={p.positionId}
                  x={p.index}
                  y={p.cumulativePnLUSD}
                  r={5}
                  fill={C.falconGold}
                  stroke={C.falconGold}
                  onClick={() => onSelectEvent?.(p.positionId)}
                />
              ))}
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div
        style={{
          marginTop: S.sm,
          paddingTop: S.sm,
          borderTop: `1px solid ${C.borderDefault}`,
          fontFamily: F.mono,
          fontSize: 10,
          fontWeight: 500,
          letterSpacing: '0.10em',
          textTransform: 'uppercase',
          color: C.textMuted,
        }}
      >
        GOLD DOTS = TRADES ≥ ±${SIGNIFICANT_THRESHOLD_USD.toLocaleString()} · CLICK TO INSPECT
      </div>
    </ContainedCard>
  );
}
