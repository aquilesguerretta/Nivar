// FORGE Wave 7 — MarkToMarketEngine display component.
//
// Renders the current PnL for a single position alongside the mark
// price the PnL was computed against. Used inside PositionLibrary
// cards. The actual fetch + math lives in `markToMarket.ts`; this
// component is a stateful binding between the position record and
// the most recent mark.
//
// Realized positions show their cached `realizedPnL` instantly. Open
// positions kick off a one-shot fetch via `fetchRealizedLMP`. If no
// price is available yet (entry date in the future or backend offline),
// the engine shows an inline freshness chip explaining the state.

import { useEffect, useRef, useState } from 'react';
import { C, F, R, S } from '@/design/tokens';
import {
  computeClosedPositionPnL,
  computePositionPnL,
  fetchRealizedLMP,
} from '@/lib/sandbox/markToMarket';
import { useSandboxStore } from '@/lib/sandbox/positionState';
import type { Position } from '@/lib/sandbox/types';

interface Props {
  position: Position;
  /** Caller-supplied callback fired the first time we compute a mark
   *  for an open position. Lets PortfolioOverview keep a synchronous
   *  cache without re-asking the network. */
  onMark?: (positionId: string, pnlUSD: number, markPrice: number) => void;
  /** When true the engine auto-closes the position once it has a
   *  realized mark AND the configured hold has elapsed. */
  autoSettle?: boolean;
}

interface MarkState {
  pnlUSD: number;
  markPrice: number;
  status: 'pending' | 'marked' | 'unavailable' | 'closed';
}

function isHoldComplete(pos: Position): boolean {
  const [yyyy, mm, dd] = pos.entryDate.split('-').map((n) => Number(n));
  const settleAt = new Date(
    yyyy,
    (mm ?? 1) - 1,
    dd ?? 1,
    pos.entryHour + pos.holdHours,
    0,
    0,
  );
  return Date.now() >= settleAt.getTime();
}

export function MarkToMarketEngine({ position, onMark, autoSettle = true }: Props) {
  const closePosition = useSandboxStore((s) => s.closePosition);

  const [state, setState] = useState<MarkState>(() => {
    if (position.status === 'closed') {
      return {
        pnlUSD: computeClosedPositionPnL(position),
        markPrice: position.exitLMP ?? position.entryLMP,
        status: 'closed',
      };
    }
    return { pnlUSD: 0, markPrice: position.entryLMP, status: 'pending' };
  });

  const fetchedRef = useRef<string | null>(null);

  useEffect(() => {
    if (position.status === 'closed') {
      setState({
        pnlUSD: computeClosedPositionPnL(position),
        markPrice: position.exitLMP ?? position.entryLMP,
        status: 'closed',
      });
      return;
    }

    if (fetchedRef.current === position.id) return;
    fetchedRef.current = position.id;

    let cancelled = false;
    (async () => {
      const price = await fetchRealizedLMP(position);
      if (cancelled) return;
      if (price === null) {
        setState({
          pnlUSD: 0,
          markPrice: position.entryLMP,
          status: 'unavailable',
        });
        return;
      }
      const pnl = computePositionPnL(position, price);
      setState({ pnlUSD: pnl, markPrice: price, status: 'marked' });
      onMark?.(position.id, pnl, price);
      if (autoSettle && isHoldComplete(position)) {
        closePosition(position.id, price, pnl);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [position, autoSettle, closePosition, onMark]);

  const isProfit = state.pnlUSD > 0;
  const isLoss = state.pnlUSD < 0;
  const color = isProfit
    ? C.alertNormal
    : isLoss
      ? C.alertCritical
      : C.textSecondary;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        gap: 2,
      }}
    >
      <div
        style={{
          fontFamily: F.mono,
          fontSize: 22,
          fontWeight: 700,
          fontVariantNumeric: 'tabular-nums',
          letterSpacing: '-0.01em',
          color,
        }}
      >
        {state.status === 'pending'
          ? '—'
          : state.status === 'unavailable'
            ? 'PENDING'
            : `${state.pnlUSD >= 0 ? '+' : ''}$${Math.abs(state.pnlUSD).toLocaleString(undefined, {
                maximumFractionDigits: 0,
              })}`}
      </div>
      <div
        style={{
          fontFamily: F.mono,
          fontSize: 10,
          fontWeight: 500,
          letterSpacing: '0.10em',
          textTransform: 'uppercase',
          color: C.textMuted,
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        {state.status === 'closed'
          ? `EXIT $${state.markPrice.toFixed(2)}`
          : state.status === 'marked'
            ? `MARK $${state.markPrice.toFixed(2)}`
            : state.status === 'unavailable'
              ? 'AWAITING LMP'
              : 'COMPUTING…'}
      </div>
      {state.status === 'unavailable' && (
        <div
          style={{
            marginTop: 4,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 4,
            padding: '2px 6px',
            background: C.falconGoldWash,
            border: `1px solid ${C.falconGold}`,
            borderRadius: R.sm,
            fontFamily: F.mono,
            fontSize: 9,
            fontWeight: 600,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: C.falconGold,
          }}
        >
          <span
            style={{
              width: 4,
              height: 4,
              borderRadius: '50%',
              background: C.falconGold,
            }}
          />
          IN-FLIGHT
        </div>
      )}
    </div>
  );
}

/**
 * Inline span used elsewhere (e.g. PortfolioOverview, journal stubs).
 * Just renders the colored PnL number with no side-effects.
 */
export function PnLChip({ pnlUSD }: { pnlUSD: number }) {
  const isProfit = pnlUSD > 0;
  const isLoss = pnlUSD < 0;
  const color = isProfit
    ? C.alertNormal
    : isLoss
      ? C.alertCritical
      : C.textSecondary;
  return (
    <span
      style={{
        fontFamily: F.mono,
        fontSize: 13,
        fontWeight: 700,
        fontVariantNumeric: 'tabular-nums',
        color,
      }}
    >
      {pnlUSD >= 0 ? '+' : '−'}${Math.abs(pnlUSD).toLocaleString(undefined, {
        maximumFractionDigits: 0,
      })}
    </span>
  );
}

/**
 * One-line direction × size summary, e.g. "LONG 50 MW @ $42.18 · 1h".
 * Used both in cards and the journal entry stub body.
 */
export function PositionSummaryLine({ position }: { position: Position }) {
  const directionColor =
    position.direction === 'long' ? C.electricBlue : C.falconGold;
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'baseline',
        gap: S.sm,
        fontFamily: F.mono,
        fontSize: 13,
        fontWeight: 500,
        color: C.textSecondary,
        fontVariantNumeric: 'tabular-nums',
      }}
    >
      <span
        style={{
          fontWeight: 700,
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          color: directionColor,
        }}
      >
        {position.direction.toUpperCase()}
      </span>
      <span style={{ color: C.textPrimary, fontWeight: 600 }}>
        {position.sizeMW} MW
      </span>
      <span>@ ${position.entryLMP.toFixed(2)}</span>
      <span style={{ color: C.textMuted }}>· {position.holdHours}h</span>
    </div>
  );
}
