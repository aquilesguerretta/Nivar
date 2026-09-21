// FORGE Wave 5 — Synthetic forward LMP curve for underwriting.
//
// Produces an annual mean LMP trajectory over the project's economic
// life. Base case is derived from `ZONE_REVENUE_HISTORY_24M` (Developer
// Nest mock) — we extract an implied price level by dividing cumulative
// revenue by an assumed energy throughput, then escalate 2.5%/year with
// a long-run drift toward $55/MWh as renewable penetration depresses
// peak prices and supports floor prices.
//
// Pattern mirrors `src/lib/simulator/runSimulation.ts`'s
// "synthetic data + optional live data override" approach: callers can
// pass an optional `liveAnnualLMP` array (from a future PJM forward-
// market hook) and the engine prefers it for matching years.
//
// V1 simplifications:
//   - Seasonality shape is annual mean only — hourly shape is rolled
//     into the capacity-factor side of the math.
//   - Scenario LMP multipliers are flat across years; in reality a
//     downside curve compresses faster in late years as renewables
//     scale.

import { ZONE_REVENUE_HISTORY_24M } from '@/lib/mock/developer-mock';

interface ForwardCurveParams {
  /** PJM zone — drives the level. */
  zone: string;
  /** First project year (COD year). */
  codYear: number;
  /** Length of curve to produce, years. */
  economicLifeYears: number;
  /** Scenario LMP multiplier (1.0 = base). */
  lmpMultiplier: number;
  /** Optional override: live annual LMP values for the early years. */
  liveAnnualLMP?: number[];
}

// ─── Base level ──────────────────────────────────────────────────

const LONG_RUN_LMP = 55; // $/MWh — target long-run zone-blended LMP
const ANNUAL_ESCALATION = 0.025; // 2.5%/yr base escalation
const LONG_RUN_BLEND = 0.6; // 60% weight on long-run by year 25

/**
 * Implied year-0 base LMP for the zone, derived from the 24-month
 * cumulative revenue series.
 *
 * `ZONE_REVENUE_HISTORY_24M` is tuned for a 50 MW × 4-hr battery
 * dispatching ~1.5 cycles/day. A battery's revenue per cycled-MWh
 * is roughly the peak-to-trough spread divided by 2 (symmetric
 * arbitrage), and the average grid LMP is roughly half of the
 * peak-to-trough spread. Net: average LMP ≈ (revenue / cycled_MWh)
 * × ~0.45 (the 0.45 compensates for tax + RTE leakage).
 *
 * Clamped to a defensible PJM band so a tuning misstep in the mock
 * doesn't blow up the entire calculator.
 */
function impliedBaseLMP(_zone: string): number {
  const total = ZONE_REVENUE_HISTORY_24M.length;
  if (total === 0) return 42;
  const cumulative = ZONE_REVENUE_HISTORY_24M[total - 1].cumulativeRevenue;
  const implied = (cumulative / 220_000) * 0.45;
  if (!Number.isFinite(implied) || implied <= 0) return 42;
  // PJM defensible band: $30/MWh floor, $80/MWh ceiling.
  return Math.max(30, Math.min(80, implied));
}

// ─── Annual curve ────────────────────────────────────────────────

/**
 * Return the annual mean LMP, $/MWh, over the project's economic life.
 * Indexed by project year (length = economicLifeYears, element 0 =
 * COD year).
 */
export function forwardAnnualLMP(params: ForwardCurveParams): number[] {
  const { zone, codYear, economicLifeYears, lmpMultiplier, liveAnnualLMP } =
    params;
  const base = impliedBaseLMP(zone);
  const out: number[] = [];
  for (let y = 0; y < economicLifeYears; y++) {
    const escalated = base * Math.pow(1 + ANNUAL_ESCALATION, y);
    // Blend toward the long-run LMP as the project matures.
    const blendWeight = Math.min(
      LONG_RUN_BLEND,
      (y / Math.max(1, economicLifeYears)) * LONG_RUN_BLEND,
    );
    const blended = escalated * (1 - blendWeight) + LONG_RUN_LMP * blendWeight;
    let value = blended * lmpMultiplier;
    if (liveAnnualLMP && y < liveAnnualLMP.length && Number.isFinite(liveAnnualLMP[y])) {
      // Live override wins for the years it covers; scenario multiplier
      // still applies so upside/downside scenarios remain meaningful.
      value = liveAnnualLMP[y] * lmpMultiplier;
    }
    out.push(Number(value.toFixed(2)));
  }
  void codYear;
  return out;
}

/**
 * Energy-weighted average LMP over the entire curve. Used by the
 * breakeven solver and the assumptions block.
 */
export function meanForwardLMP(curve: number[]): number {
  if (curve.length === 0) return 0;
  return curve.reduce((s, v) => s + v, 0) / curve.length;
}

/**
 * Build the three scenario LMP curves at once (base / upside / downside).
 * Multipliers are conventional: upside +20%, downside −25%.
 */
export function buildScenarioCurves(params: Omit<ForwardCurveParams, 'lmpMultiplier'>): {
  base: number[];
  upside: number[];
  downside: number[];
} {
  return {
    base: forwardAnnualLMP({ ...params, lmpMultiplier: 1.0 }),
    upside: forwardAnnualLMP({ ...params, lmpMultiplier: 1.2 }),
    downside: forwardAnnualLMP({ ...params, lmpMultiplier: 0.75 }),
  };
}
