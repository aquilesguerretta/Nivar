// FORGE Wave 5 — Policy eligibility resolver.
//
// Encodes the IRA-era (Sections 45 / 48) ITC, PTC, and PJM capacity-
// payment logic as of May 2026. Policy state changes over time —
// expiry / extension is exposed as a scenario lever (the scenario
// overrides can drop ITC or PTC at will), so when Congress moves the
// goalposts the values here move but the calling surface doesn't.
//
// Default conservative assumptions:
//   - Solar:  ITC 30% through 2032 (IRA Section 48E base)
//   - BESS:   ITC 30% through 2032 (Section 48E, post-2025 inclusion)
//   - Wind:   developers typically elect the PTC at $27.50/MWh (2026)
//             for the first 10 years; ITC is an alternative.
//   - Hybrid: ITC 30% on the storage portion + PTC on the solar
//             portion. V1 assumes the developer takes the higher of
//             ITC-only or PTC-only treatment depending on tech mix.

import type { DeveloperTechnology } from '@/lib/mock/developer-mock';
import { CAPACITY_PAYMENT_PER_MW_YEAR } from '@/lib/mock/developer-mock';
import type { ProjectSpec } from './types';

// ─── ITC ─────────────────────────────────────────────────────────

/** Base ITC schedule by technology. Higher COD year → lower ITC after step-down. */
const ITC_BASE: Record<DeveloperTechnology, number> = {
  Solar:  0.30,
  BESS:   0.30,
  Wind:   0.30, // optional ITC election in lieu of PTC
  Hybrid: 0.30,
};

/** ITC stepdown schedule starts in 2033 — values decline 6pp/year for 5 years. */
function itcStepdown(codYear: number): number {
  if (codYear <= 2032) return 1.0;
  if (codYear === 2033) return 0.8;
  if (codYear === 2034) return 0.6;
  if (codYear === 2035) return 0.4;
  if (codYear === 2036) return 0.2;
  return 0;
}

/** Return the ITC rate applicable to a project, decimal (0.30 = 30%). */
export function resolveITC(spec: Pick<ProjectSpec, 'technology' | 'codYear' | 'itcEligible'>): number {
  if (!spec.itcEligible) return 0;
  // Wind developers normally choose PTC over ITC — return 0 here so the
  // caller layers PTC instead. To take the ITC instead of PTC on Wind,
  // resolve PTC first to 0 then call this.
  if (spec.technology === 'Wind') return 0;
  const base = ITC_BASE[spec.technology] ?? 0;
  return base * itcStepdown(spec.codYear);
}

// ─── PTC ─────────────────────────────────────────────────────────

/** PTC rate ($/MWh) for first 10 years by technology. */
const PTC_BASE: Record<DeveloperTechnology, number> = {
  Solar:  27.50, // option, but most solar developers take ITC
  Wind:   27.50,
  BESS:   0,     // BESS doesn't qualify for PTC
  Hybrid: 27.50, // weighted; conservative assumption
};

/** PTC tenor years from COD. */
export const PTC_TENOR_YEARS = 10;

function ptcStepdown(codYear: number): number {
  if (codYear <= 2032) return 1.0;
  if (codYear === 2033) return 0.8;
  if (codYear === 2034) return 0.6;
  if (codYear === 2035) return 0.4;
  if (codYear === 2036) return 0.2;
  return 0;
}

/** Return PTC value applicable per MWh delivered. */
export function resolvePTC(spec: Pick<ProjectSpec, 'technology' | 'codYear' | 'ptcEligible'>): number {
  if (!spec.ptcEligible) return 0;
  // Solar PTC vs ITC: prefer ITC unless explicitly Wind. V1 returns 0
  // for Solar PTC since the resolver layers ITC on Solar; downstream
  // callers can flip ptcEligible off and itcEligible off to model
  // alternative scenarios.
  if (spec.technology !== 'Wind' && spec.technology !== 'Hybrid') return 0;
  const base = PTC_BASE[spec.technology] ?? 0;
  return base * ptcStepdown(spec.codYear);
}

// ─── Capacity payment ────────────────────────────────────────────

/**
 * Annual PJM capacity payment, $/MW-year, by zone. Tech-aware ELCC
 * derate is applied: solar/wind get ~50%/40% of nameplate count toward
 * capacity, BESS gets ~90% (4-hr), Hybrid gets ~70%.
 */
const ELCC_FACTOR: Record<DeveloperTechnology, number> = {
  Solar:  0.50,
  Wind:   0.40,
  BESS:   0.90,
  Hybrid: 0.70,
};

export function resolveCapacityPayment(
  spec: Pick<ProjectSpec, 'technology' | 'zone'>,
): number {
  const zoneRate =
    CAPACITY_PAYMENT_PER_MW_YEAR[spec.zone] ??
    CAPACITY_PAYMENT_PER_MW_YEAR.DEFAULT;
  const elcc = ELCC_FACTOR[spec.technology] ?? 0.50;
  return zoneRate * elcc;
}

// ─── Disclosure bundle ───────────────────────────────────────────

export interface PolicySnapshot {
  /** ITC rate (decimal). */
  itcRate: number;
  /** PTC $/MWh. */
  ptcPerMWh: number;
  /** PTC tenor years from COD. */
  ptcTenorYears: number;
  /** Effective capacity payment $/MW-year (zone × ELCC). */
  capacityPerMWYear: number;
}

/**
 * Return the full resolved policy snapshot for a project. Used by the
 * orchestrator to thread credits into the cashflow build, and exposed
 * to the UI's PolicyAttribution component.
 */
export function resolvePolicy(spec: ProjectSpec): PolicySnapshot {
  return {
    itcRate: resolveITC(spec),
    ptcPerMWh: resolvePTC(spec),
    ptcTenorYears: PTC_TENOR_YEARS,
    capacityPerMWYear: resolveCapacityPayment(spec),
  };
}
