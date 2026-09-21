// FORGE Wave 5 — Finance primitives for the Underwriting Calculator.
// Pure functions. No store reads, no time-of-day side effects.
// Cashflow convention: index 0 is year 0 (typically a negative number
// representing the equity contribution); subsequent indices are end-of-
// year cashflows for years 1 .. N.

import type { ProjectSpec } from './types';

// ─── Constants ───────────────────────────────────────────────────

const IRR_MAX_ITERATIONS = 80;
const IRR_TOLERANCE = 1e-7;

// ─── NPV ─────────────────────────────────────────────────────────

/**
 * Net present value of a cashflow stream at the given annual rate.
 *
 * @param cashflows  index 0 = year 0 (typically negative equity invest)
 *                   index k = end-of-year k
 * @param rate       annual discount rate, decimal (0.08 = 8%)
 */
export function computeNPV(cashflows: number[], rate: number): number {
  let npv = 0;
  for (let t = 0; t < cashflows.length; t++) {
    npv += cashflows[t] / Math.pow(1 + rate, t);
  }
  return npv;
}

/** First derivative of NPV with respect to the rate, used by Newton's method. */
function npvDerivative(cashflows: number[], rate: number): number {
  let d = 0;
  for (let t = 1; t < cashflows.length; t++) {
    d -= (t * cashflows[t]) / Math.pow(1 + rate, t + 1);
  }
  return d;
}

// ─── IRR ─────────────────────────────────────────────────────────

/**
 * Internal rate of return of the cashflow stream. Returns NaN when the
 * cashflows don't admit a real IRR in (-0.99, 10).
 *
 * Algorithm:
 *   1. Quick sanity: require at least one negative and one positive flow.
 *   2. Newton's method from a 10% seed. Bail to bisection on divergence.
 *   3. Bisection over [-0.99, 10] as a robust fallback.
 */
export function computeIRR(cashflows: number[]): number {
  if (cashflows.length < 2) return Number.NaN;
  let hasNeg = false;
  let hasPos = false;
  for (const v of cashflows) {
    if (v < 0) hasNeg = true;
    if (v > 0) hasPos = true;
    if (hasNeg && hasPos) break;
  }
  if (!hasNeg || !hasPos) return Number.NaN;

  // Newton's method.
  let rate = 0.1;
  for (let i = 0; i < IRR_MAX_ITERATIONS; i++) {
    const f = computeNPV(cashflows, rate);
    if (!Number.isFinite(f)) break;
    if (Math.abs(f) < IRR_TOLERANCE) return rate;
    const fp = npvDerivative(cashflows, rate);
    if (!Number.isFinite(fp) || Math.abs(fp) < 1e-12) break;
    const next = rate - f / fp;
    if (!Number.isFinite(next) || next <= -1) break;
    if (Math.abs(next - rate) < IRR_TOLERANCE) return next;
    rate = next;
  }

  // Bisection fallback.
  let lo = -0.99;
  let hi = 10;
  let fLo = computeNPV(cashflows, lo);
  let fHi = computeNPV(cashflows, hi);
  if (!Number.isFinite(fLo) || !Number.isFinite(fHi)) return Number.NaN;
  if (fLo * fHi > 0) return Number.NaN;
  for (let i = 0; i < IRR_MAX_ITERATIONS; i++) {
    const mid = (lo + hi) / 2;
    const fMid = computeNPV(cashflows, mid);
    if (!Number.isFinite(fMid)) return Number.NaN;
    if (Math.abs(fMid) < IRR_TOLERANCE) return mid;
    if (fLo * fMid < 0) {
      hi = mid;
      fHi = fMid;
    } else {
      lo = mid;
      fLo = fMid;
    }
    if (hi - lo < IRR_TOLERANCE) return (lo + hi) / 2;
  }
  return (lo + hi) / 2;
}

// ─── Payback ─────────────────────────────────────────────────────

/**
 * Simple payback period in years (linear interpolation between the year
 * cumulative cashflow crosses zero and the year before). Returns null
 * when the cashflows never recoup the initial outlay within the horizon.
 *
 * Convention matches NPV / IRR: index 0 is year 0 (typically negative).
 */
export function computePayback(cashflows: number[]): number | null {
  let cumulative = 0;
  let previous = 0;
  for (let t = 0; t < cashflows.length; t++) {
    previous = cumulative;
    cumulative += cashflows[t];
    if (previous < 0 && cumulative >= 0) {
      const yearCF = cashflows[t];
      if (yearCF <= 0) return t;
      // Fraction of this year needed to cross zero.
      const fraction = -previous / yearCF;
      return Math.max(0, t - 1 + fraction);
    }
  }
  return null;
}

// ─── Annuity / debt service ──────────────────────────────────────

/**
 * Level annual debt-service payment (interest + principal) for a fully
 * amortizing loan. Returns 0 when principal is 0.
 */
export function computeAnnualDebtService(
  principal: number,
  annualRate: number,
  tenorYears: number,
): number {
  if (principal <= 0 || tenorYears <= 0) return 0;
  if (Math.abs(annualRate) < 1e-9) return principal / tenorYears;
  const r = annualRate;
  const n = tenorYears;
  return (principal * r) / (1 - Math.pow(1 + r, -n));
}

// ─── Breakeven LMP ───────────────────────────────────────────────

/**
 * Closed-form breakeven LMP, $/MWh, for the project's equity NPV to
 * equal zero — given the equity NPV produced by `baseRevenueNPV` USD of
 * pre-PPA revenue contribution. The relationship is approximately
 * linear in average LMP since revenue is proportional to LMP and most
 * other costs are not. We use a simple scaling that assumes the
 * baseline scenario's revenue / LMP ratio holds.
 *
 * @param spec               project spec
 * @param equityNPVAtBase    equity NPV at the base scenario, USD
 * @param baseAvgLMP         mean forward LMP that produced equityNPVAtBase, $/MWh
 * @param annualGenerationMWh first-year energy generation, MWh
 */
export function computeBreakevenLMP(
  spec: ProjectSpec,
  equityNPVAtBase: number,
  baseAvgLMP: number,
  annualGenerationMWh: number,
): number {
  if (annualGenerationMWh <= 0) return Number.NaN;
  // Approximate present-value annuity factor over the economic life at
  // the equity hurdle — the factor that converts a $1/MWh price delta
  // into an equity NPV delta.
  const r = spec.discountRate;
  const n = spec.economicLifeYears;
  const annuityFactor =
    Math.abs(r) < 1e-9 ? n : (1 - Math.pow(1 + r, -n)) / r;
  // Equity-after-tax fraction of revenue. Simplified: (1 - taxRate) of
  // gross. This understates the value of credits but is a useful
  // first-order solver and gets refined when the engine iterates.
  const equityShare = 1 - spec.taxRate;
  const npvPerDollarPerMWh =
    annualGenerationMWh * annuityFactor * equityShare;
  if (npvPerDollarPerMWh <= 0) return Number.NaN;
  const deltaLMP = -equityNPVAtBase / npvPerDollarPerMWh;
  return baseAvgLMP + deltaLMP;
}
