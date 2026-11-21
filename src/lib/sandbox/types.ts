// FORGE Wave 7 — Student Sandbox types.
//
// Owned by FORGE; consumed by the Student Nest's Sandbox Trading and
// Project Sandbox surfaces. Two domains live side-by-side here:
//
//  1. Paper LMP positions — the user posts a hypothetical long or short
//     against a zone-hour-date triple at the entry LMP. Once the entry
//     hour has elapsed the engine marks-to-market against the realized
//     LMP from /api/lmp/history. Auto-closes after the configured hold.
//
//  2. Hypothetical projects — a lightweight wrapper around the FORGE
//     Wave 6 Underwriting Calculator (a few inputs, default-filled
//     assumptions, runUnderwriting under the hood). Once each project's
//     COD year is reached, realized LMP marks the projection.
//
// Persisted to localStorage via sandboxStore (Phase 1 ships the types;
// the store ships in Phase 2 alongside the entry/library UIs).

import type { DeveloperTechnology } from '@/lib/mock/developer-mock';
import type { UnderwritingResults } from '@/lib/underwriting/types';

// ─── Paper LMP positions ─────────────────────────────────────────

export type PositionDirection = 'long' | 'short';
export type PositionStatus = 'open' | 'closed';

export interface PositionAnnotation {
  id: string;
  /** ISO timestamp when the annotation was added. */
  addedAt: string;
  /** Free-form note from the user — "why I closed this", "what I learned". */
  note: string;
}

export interface Position {
  id: string;
  /** PJM zone the user is taking the position against. */
  zone: string;
  /** 'long'  = profit when realized LMP > entryLMP.
   *  'short' = profit when realized LMP < entryLMP. */
  direction: PositionDirection;
  /** Size of the position in MW. PnL math treats one hour as 1 MW × 1h = 1 MWh. */
  sizeMW: number;
  /** Hour of day the position is active (0–23 local). */
  entryHour: number;
  /** LMP at which the position was opened, $/MWh. Snapped from the live
   *  feed when available, falls back to the seeded reference price. */
  entryLMP: number;
  /** Calendar date of the entry hour. ISO date (YYYY-MM-DD). */
  entryDate: string;
  /** Optional rationale captured at entry time. */
  reasoning: string;
  /** Hold duration in hours. V1 defaults to 1 (close at end of entry hour). */
  holdHours: number;
  /** ISO timestamp of when the position was created. */
  createdAt: string;
  status: PositionStatus;

  // Set only when status === 'closed'.
  /** Realized LMP at the exit hour, $/MWh. */
  exitLMP?: number;
  /** ISO timestamp when the engine closed the position. */
  exitAt?: string;
  /** Cached PnL at close in $. Lets us avoid re-running mark-to-market
   *  every render once the position is settled. */
  realizedPnL?: number;

  /** Post-trade annotations — added freely after open or close. */
  annotations: PositionAnnotation[];

  /** Trader Journal entry id if this position generated a journal stub. */
  journalEntryId?: string;
}

// ─── Mark-to-market output ───────────────────────────────────────

export interface PositionPnL {
  positionId: string;
  /** Open positions: marked against the latest LMP we have for the entry
   *  zone/hour. Closed positions: realized PnL at exit. */
  pnlUSD: number;
  /** The LMP the PnL was computed against, $/MWh. */
  markPrice: number;
  /** Whether the mark price is provisional (open) or final (closed). */
  isRealized: boolean;
  /** ISO timestamp the mark was computed at. */
  computedAt: string;
}

// ─── Hypothetical project sandbox ────────────────────────────────

export interface HypotheticalProject {
  id: string;
  /** Free-form user-supplied project name. */
  name: string;
  /** Generation technology. Reuses FOUNDRY's DeveloperTechnology union. */
  technology: DeveloperTechnology;
  /** Nameplate capacity in MW (AC). */
  capacityMW: number;
  /** PJM zone the project sits in. */
  zone: string;
  /** Commercial operation date year (e.g. 2028). */
  codYear: number;
  /** ISO timestamp the user added the project. */
  createdAt: string;
  /** Cached underwriting projection at creation time. The base scenario's
   *  year-1 revenue + IRR drive the dashboard tile. */
  projection: UnderwritingResults;
  /** Realized-vs-projected snapshot once COD is reached. Null while
   *  pre-COD. */
  performance: ProjectPerformanceSnapshot | null;
}

export interface ProjectPerformanceSnapshot {
  /** Calendar year the snapshot was generated for. */
  forCalendarYear: number;
  /** Energy revenue the underwriting model projected for that year, USD. */
  projectedRevenueUSD: number;
  /** Realized revenue computed against actual LMP data, USD. */
  realizedRevenueUSD: number;
  /** Mean realized LMP across the year, $/MWh. */
  realizedMeanLMP: number;
  /** Mean projected LMP from the forward curve, $/MWh. */
  projectedMeanLMP: number;
  /** IRR delta vs underwriting (realized − projected, decimal). Negative
   *  means the project under-performed the underwriting assumption. */
  irrDelta: number;
  /** ISO timestamp when the snapshot was computed. */
  computedAt: string;
}

// ─── Portfolio aggregates ────────────────────────────────────────

export interface PortfolioSummary {
  totalPositions: number;
  openPositions: number;
  closedPositions: number;
  /** Sum of realized PnL across closed positions, USD. */
  realizedPnLUSD: number;
  /** Mark-to-market PnL across open positions at the most recent compute. */
  unrealizedPnLUSD: number;
  /** realizedPnL + unrealizedPnL. */
  totalPnLUSD: number;
  /** Closed wins / total closed. NaN when no positions are closed. */
  winRate: number;
  /** Largest single realized win, USD. 0 when no closed positions. */
  bestTradePnL: number;
  /** Largest single realized loss (signed, ≤ 0). 0 when no closed positions. */
  worstTradePnL: number;
  /** Mean hold duration across closed positions, hours. NaN when none. */
  averageHoldHours: number;
}
