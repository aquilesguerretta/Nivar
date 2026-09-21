// FORGE Wave 5 — Capacity factor projection primitives.
//
// Produces a per-year and per-month capacity factor for the project
// based on technology, zone, project year, and a scenario CF delta.
// All numbers are derived from `developer-mock.ts` tables so the
// "feel" of the calculator stays consistent with the rest of the
// Developer Nest's mocked appearance.
//
// V1 simplifications (documented future-work):
//   - Zone CF multipliers are static medians; real CF varies year to
//     year with wind regime / cloud cover.
//   - BESS CF assumes a fixed 1.5 cycles/day; live cycle-count from
//     the Storage Optimizer could feed in here.
//   - Degradation is linear; in practice solar/wind CF drops faster
//     in years 1-5 and stabilizes.

import type { DeveloperTechnology } from '@/lib/mock/developer-mock';
import {
  TECH_BASE_CAPACITY_FACTOR,
  TECH_CF_DEGRADATION,
  TECH_MONTHLY_CF_SHAPE,
  ZONE_CF_MULTIPLIER,
} from '@/lib/mock/developer-mock';

/**
 * Look up the zone × tech CF multiplier, falling back to 1.00 if the
 * zone or tech isn't in the static table.
 */
function zoneCFMultiplier(
  technology: DeveloperTechnology,
  zone: string,
): number {
  const zoneRow = ZONE_CF_MULTIPLIER[zone] ?? ZONE_CF_MULTIPLIER.DEFAULT;
  return zoneRow[technology] ?? 1.0;
}

/**
 * Year-1 base CF for the project — applied to all hours in year 1
 * before degradation, scenario delta, or seasonality.
 */
export function year1BaseCF(
  technology: DeveloperTechnology,
  zone: string,
): number {
  const base = TECH_BASE_CAPACITY_FACTOR[technology];
  const mult = zoneCFMultiplier(technology, zone);
  return base * mult;
}

/**
 * Project-year CF (annual mean) accounting for technology degradation
 * and any scenario CF delta.
 *
 * @param technology         project technology
 * @param zone               PJM zone
 * @param projectYear        1-indexed year over the economic life
 * @param scenarioCFDelta    additive percentage-point adjustment
 *                           (e.g. -0.02 = 2pp below base)
 */
export function annualCF(
  technology: DeveloperTechnology,
  zone: string,
  projectYear: number,
  scenarioCFDelta: number = 0,
): number {
  const base = year1BaseCF(technology, zone);
  const deg = TECH_CF_DEGRADATION[technology];
  const yearsElapsed = Math.max(0, projectYear - 1);
  // Linear degradation: (1 - deg × elapsed)
  const afterDeg = base * Math.max(0, 1 - deg * yearsElapsed);
  return Math.max(0, afterDeg + scenarioCFDelta);
}

/**
 * Generate the 12-element CF profile for a single project year.
 *
 *   Each element is the average CF for that month, derived from the
 *   technology's seasonality shape multiplied by the project-year mean.
 */
export function generateMonthlyCFProfile(
  technology: DeveloperTechnology,
  zone: string,
  projectYear: number,
  scenarioCFDelta: number = 0,
): number[] {
  const meanThisYear = annualCF(technology, zone, projectYear, scenarioCFDelta);
  const shape = TECH_MONTHLY_CF_SHAPE[technology];
  return shape.map((s) => Math.max(0, Math.min(1, meanThisYear * s)));
}

/**
 * CF trajectory across the project's economic life — one element per
 * project year. Used by the CapacityFactorChart to draw the annual
 * trend overlay.
 */
export function lifetimeCFTrajectory(
  technology: DeveloperTechnology,
  zone: string,
  economicLifeYears: number,
  scenarioCFDelta: number = 0,
): number[] {
  const out: number[] = [];
  for (let y = 1; y <= economicLifeYears; y++) {
    out.push(annualCF(technology, zone, y, scenarioCFDelta));
  }
  return out;
}

/**
 * Average lifetime CF — used by the assumptions block in the PDF
 * memo and by the AI context provider.
 */
export function averageLifetimeCF(
  technology: DeveloperTechnology,
  zone: string,
  economicLifeYears: number,
  scenarioCFDelta: number = 0,
): number {
  const trajectory = lifetimeCFTrajectory(
    technology,
    zone,
    economicLifeYears,
    scenarioCFDelta,
  );
  if (trajectory.length === 0) return 0;
  return trajectory.reduce((s, v) => s + v, 0) / trajectory.length;
}
