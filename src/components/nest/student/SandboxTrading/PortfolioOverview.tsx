// FORGE Wave 7 — Portfolio overview tile.
//
// Hero number is cumulative PnL (realized + open marks). Sub-metrics:
// win rate, best/worst trade, average hold time, total positions.
//
// Open-position marks come from a synchronous cache the caller passes
// through `markCache` — populated by the MarkToMarketEngine inside the
// position cards. When the cache is empty the unrealized component
// shows as zero rather than missing.

import { useMemo } from 'react';
import { C, F, S } from '@/design/tokens';
import { ContainedCard } from '@/components/terminal/ContainedCard';
import { EditorialIdentity } from '@/components/terminal/EditorialIdentity';
import { HeroNumber } from '@/components/terminal/HeroNumber';
import { useSandboxStore } from '@/lib/sandbox/positionState';
import { summarizePortfolio } from '@/lib/sandbox/markToMarket';
import type { PositionPnL } from '@/lib/sandbox/types';

interface Props {
  markCache: Record<string, PositionPnL>;
}

export function PortfolioOverview({ markCache }: Props) {
  const positions = useSandboxStore((s) => s.positions);

  const summary = useMemo(
    () => summarizePortfolio(positions, markCache),
    [positions, markCache],
  );

  const totalPnL = summary.totalPnLUSD;
  const heroColor =
    totalPnL > 0
      ? C.alertNormal
      : totalPnL < 0
        ? C.alertCritical
        : C.textPrimary;
  const sign = totalPnL >= 0 ? '+' : '−';
  const heroValue = `${sign}$${Math.abs(totalPnL).toLocaleString(undefined, {
    maximumFractionDigits: 0,
  })}`;

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
          PORTFOLIO · {summary.totalPositions} POSITIONS
        </div>
        <EditorialIdentity size="section">Your scoreboard.</EditorialIdentity>
      </div>

      <div style={{ marginBottom: S.lg }}>
        <div
          style={{
            fontFamily: F.mono,
            fontSize: 10,
            fontWeight: 500,
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            color: C.textMuted,
            marginBottom: 4,
          }}
        >
          CUMULATIVE PNL
        </div>
        <HeroNumber value={heroValue} size={84} color={heroColor} />
        <div
          style={{
            marginTop: S.xs,
            fontFamily: F.mono,
            fontSize: 11,
            fontWeight: 500,
            letterSpacing: '0.10em',
            color: C.textMuted,
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          REALIZED ${Math.round(summary.realizedPnLUSD).toLocaleString()} ·
          UNREALIZED ${Math.round(summary.unrealizedPnLUSD).toLocaleString()}
        </div>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: S.sm,
          paddingTop: S.md,
          borderTop: `1px solid ${C.borderDefault}`,
        }}
      >
        <MetricCell
          label="WIN RATE"
          value={
            Number.isNaN(summary.winRate)
              ? '—'
              : `${(summary.winRate * 100).toFixed(0)}%`
          }
          sub={`${summary.closedPositions} CLOSED`}
        />
        <MetricCell
          label="BEST TRADE"
          value={
            summary.bestTradePnL === 0
              ? '—'
              : `+$${Math.round(summary.bestTradePnL).toLocaleString()}`
          }
          accentColor={summary.bestTradePnL > 0 ? C.alertNormal : undefined}
        />
        <MetricCell
          label="WORST TRADE"
          value={
            summary.worstTradePnL === 0
              ? '—'
              : `−$${Math.round(Math.abs(summary.worstTradePnL)).toLocaleString()}`
          }
          accentColor={summary.worstTradePnL < 0 ? C.alertCritical : undefined}
        />
        <MetricCell
          label="AVG HOLD"
          value={
            Number.isNaN(summary.averageHoldHours)
              ? '—'
              : `${summary.averageHoldHours.toFixed(1)} h`
          }
          sub={`${summary.openPositions} OPEN`}
        />
      </div>
    </ContainedCard>
  );
}

function MetricCell({
  label,
  value,
  sub,
  accentColor,
}: {
  label: string;
  value: string;
  sub?: string;
  accentColor?: string;
}) {
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
          fontSize: 22,
          fontWeight: 600,
          fontVariantNumeric: 'tabular-nums',
          color: accentColor ?? C.textPrimary,
        }}
      >
        {value}
      </div>
      {sub && (
        <div
          style={{
            marginTop: 2,
            fontFamily: F.mono,
            fontSize: 10,
            fontWeight: 500,
            letterSpacing: '0.10em',
            color: C.textMuted,
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          {sub}
        </div>
      )}
    </div>
  );
}
