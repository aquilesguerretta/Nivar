// FORGE Wave 7 — Sandbox mark-to-market engine.
//
// Pure PnL math + a thin helper that walks all open positions and asks
// the FORGE Wave 5 `fetchLMPHistory` endpoint for the realized LMP at
// the entry hour. Once we have the realized price, the open position
// becomes a settled one with cached `realizedPnL`.
//
// Math convention (one MW held for one hour = one MWh):
//   long  PnL ($)  = (markPrice − entryLMP) × sizeMW × holdHours
//   short PnL ($)  = (entryLMP − markPrice) × sizeMW × holdHours
//
// The helper is paranoid: an LMP fetch can fail, the date can be in the
// future, or the user can be offline (mock mode). When the realized
// price isn't yet available the caller is told "still open" and the
// position stays in `open` status.

import { fetchLMPHistory } from '@/services/api/lmp';
import type { LMPHistoryData } from '@/lib/types/api';
import type {
  PortfolioSummary,
  Position,
  PositionPnL,
} from './types';

// ─── Pure PnL math ──────────────────────────────────────────────

/**
 * Compute paper PnL in $ for a given position at a given mark price.
 * Positive = profit, negative = loss. Uses the position's hold duration.
 */
export function computePositionPnL(pos: Position, markPrice: number): number {
  const diff =
    pos.direction === 'long'
      ? markPrice - pos.entryLMP
      : pos.entryLMP - markPrice;
  return diff * pos.sizeMW * pos.holdHours;
}

/**
 * Convenience for closed positions — reads the cached `realizedPnL` if
 * present, otherwise re-derives from `exitLMP`. Falls back to 0 only
 * if neither is available (a sentinel state that shouldn't happen in
 * practice — every closed position is settled with at least one of
 * the two fields set).
 */
export function computeClosedPositionPnL(pos: Position): number {
  if (pos.status !== 'closed') return 0;
  if (typeof pos.realizedPnL === 'number') return pos.realizedPnL;
  if (typeof pos.exitLMP === 'number') {
    return computePositionPnL(pos, pos.exitLMP);
  }
  return 0;
}

// ─── Realized price lookup ──────────────────────────────────────

/**
 * Build the ISO start/end window for /api/lmp/history that covers a
 * single entry hour on the position's entry date. We grab 65 minutes
 * starting at minute :00 so the hourly bar comfortably falls inside.
 */
function entryWindow(pos: Position): { start: string; end: string } {
  const [yyyy, mm, dd] = pos.entryDate.split('-').map((n) => Number(n));
  const start = new Date(yyyy, (mm ?? 1) - 1, dd ?? 1, pos.entryHour, 0, 0);
  const end = new Date(start.getTime() + 65 * 60 * 1000);
  return { start: start.toISOString(), end: end.toISOString() };
}

/**
 * Pull the realized hourly LMP for the position's entry hour. Returns
 * the mean of every 5-min bar inside the window when the V2 backend is
 * online, the mocked series mean when offline. Returns null if no bar
 * is available (e.g. entry date is in the future).
 */
export async function fetchRealizedLMP(pos: Position): Promise<number | null> {
  const { start, end } = entryWindow(pos);
  let envelope: { data: LMPHistoryData };
  try {
    envelope = await fetchLMPHistory({
      zone: pos.zone,
      start,
      end,
      interval: 'hourly',
    });
  } catch {
    return null;
  }
  const points = envelope.data ?? [];
  if (points.length === 0) return null;
  // Prefer the bar whose hour matches entryHour, fall back to mean.
  const exact = points.find(
    (p) => new Date(p.timestamp).getHours() === pos.entryHour,
  );
  if (exact) return exact.lmp_total;
  const sum = points.reduce((s, p) => s + p.lmp_total, 0);
  return sum / points.length;
}

/**
 * Mark a single open position. Returns a PositionPnL when a mark price
 * is available, null when not.
 */
export async function markPosition(pos: Position): Promise<PositionPnL | null> {
  if (pos.status === 'closed') {
    return {
      positionId: pos.id,
      pnlUSD: computeClosedPositionPnL(pos),
      markPrice: pos.exitLMP ?? pos.entryLMP,
      isRealized: true,
      computedAt: new Date().toISOString(),
    };
  }
  const markPrice = await fetchRealizedLMP(pos);
  if (markPrice === null) return null;
  return {
    positionId: pos.id,
    pnlUSD: computePositionPnL(pos, markPrice),
    markPrice,
    isRealized: false,
    computedAt: new Date().toISOString(),
  };
}

// ─── Portfolio aggregates ───────────────────────────────────────

/**
 * Roll up positions into a portfolio-wide summary. Open-position PnL
 * is treated as zero when the caller doesn't pass a `markCache` —
 * mark-to-market is async and the summary still has to render
 * synchronously.
 */
export function summarizePortfolio(
  positions: Position[],
  markCache: Record<string, PositionPnL> = {},
): PortfolioSummary {
  const open = positions.filter((p) => p.status === 'open');
  const closed = positions.filter((p) => p.status === 'closed');

  const realizedPnLUSD = closed.reduce(
    (sum, p) => sum + computeClosedPositionPnL(p),
    0,
  );
  const unrealizedPnLUSD = open.reduce((sum, p) => {
    const cached = markCache[p.id];
    return sum + (cached?.pnlUSD ?? 0);
  }, 0);

  const wins = closed.filter((p) => computeClosedPositionPnL(p) > 0).length;
  const winRate = closed.length === 0 ? Number.NaN : wins / closed.length;

  const closedPnLs = closed.map(computeClosedPositionPnL);
  const bestTradePnL = closedPnLs.length === 0 ? 0 : Math.max(...closedPnLs);
  const worstTradePnL = closedPnLs.length === 0 ? 0 : Math.min(...closedPnLs);

  const averageHoldHours =
    closed.length === 0
      ? Number.NaN
      : closed.reduce((s, p) => s + p.holdHours, 0) / closed.length;

  return {
    totalPositions: positions.length,
    openPositions: open.length,
    closedPositions: closed.length,
    realizedPnLUSD,
    unrealizedPnLUSD,
    totalPnLUSD: realizedPnLUSD + unrealizedPnLUSD,
    winRate,
    bestTradePnL,
    worstTradePnL,
    averageHoldHours,
  };
}

/**
 * Cumulative realized PnL over time. Sorted by exit date ascending.
 * Useful for the Performance History chart.
 */
export function cumulativePnLSeries(
  positions: Position[],
): Array<{ at: string; cumulativePnLUSD: number; positionId: string }> {
  const closed = positions
    .filter((p) => p.status === 'closed' && p.exitAt)
    .sort((a, b) => (a.exitAt! < b.exitAt! ? -1 : 1));

  let cumulative = 0;
  return closed.map((p) => {
    cumulative += computeClosedPositionPnL(p);
    return {
      at: p.exitAt!,
      cumulativePnLUSD: cumulative,
      positionId: p.id,
    };
  });
}
