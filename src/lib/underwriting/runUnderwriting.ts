// FORGE Wave 5 — Underwriting orchestrator.
//
// Walks each year of the project's economic life, building a complete
// cashflow stream and computing IRR / NPV / payback / breakeven on the
// equity portion. Runs the same calculation for base / upside /
// downside scenarios so the results panel can show all three at once.
// Computes a sensitivity tornado at the end.
//
// Pattern mirrors `src/lib/simulator/runSimulation.ts`: pure function
// from `(spec, options) → results`. No store reads, no async.

import { PPA_BENCHMARKS } from '@/lib/mock/developer-mock';
import type {
  CashflowYear,
  PPABenchmarkBand,
  PolicyAttribution,
  ProjectSpec,
  ScenarioName,
  ScenarioOverrides,
  ScenarioResult,
  ScenarioSet,
  SensitivityEntry,
  UnderwritingAssumptions,
  UnderwritingResults,
} from './types';
import {
  computeAnnualDebtService,
  computeBreakevenLMP,
  computeIRR,
  computeNPV,
  computePayback,
} from './finance';
import {
  annualCF,
  averageLifetimeCF,
  lifetimeCFTrajectory,
} from './capacityFactor';
import {
  forwardAnnualLMP,
  meanForwardLMP,
} from './forwardCurve';
import { resolvePolicy } from './policyResolver';

// ─── Default scenario set ────────────────────────────────────────

export const DEFAULT_SCENARIOS: ScenarioSet = {
  base: {
    lmpMultiplier: 1.0,
    capacityFactorDelta: 0,
    capexMultiplier: 1.0,
  },
  upside: {
    lmpMultiplier: 1.2,
    capacityFactorDelta: 0.02,
    capexMultiplier: 0.92,
  },
  downside: {
    lmpMultiplier: 0.75,
    capacityFactorDelta: -0.03,
    capexMultiplier: 1.08,
    itcOverride: false, // model policy expiry under stress
  },
};

const HOURS_PER_YEAR = 8760;

// ─── Per-scenario cashflow build ─────────────────────────────────

function buildCashflows(
  spec: ProjectSpec,
  overrides: ScenarioOverrides,
  forwardLMP: number[],
): { cashflows: CashflowYear[]; equityStream: number[]; cfByYear: number[]; debtService: number } {
  const totalCapex = spec.capacityMW * spec.capexPerMW * overrides.capexMultiplier;
  const debtPrincipal = totalCapex * spec.debtRatio;
  const equityCapex = totalCapex - debtPrincipal;
  const annualDebt = computeAnnualDebtService(
    debtPrincipal,
    spec.debtRate,
    spec.debtTenor,
  );

  // Resolve policy under this scenario's overrides.
  const effectiveSpec: ProjectSpec = {
    ...spec,
    itcEligible: overrides.itcOverride === undefined ? spec.itcEligible : overrides.itcOverride,
    ptcEligible: overrides.ptcOverride === undefined ? spec.ptcEligible : overrides.ptcOverride,
  };
  const policy = resolvePolicy(effectiveSpec);
  const itcCredit = totalCapex * policy.itcRate; // realized in year 1
  const capacityRevenue = spec.capacityMW * policy.capacityPerMWYear;

  // Linear depreciation over MACRS 5-year (solar/storage) or 10-year (wind)
  // simplified to a 5-year SL for V1 — close enough for headline NPV.
  const depreciationYears = 5;
  const annualDepreciation = totalCapex / depreciationYears;

  const cashflows: CashflowYear[] = [];
  const cfByYear: number[] = [];

  // Year 0 — equity contribution.
  const yearZero: CashflowYear = {
    year: 0,
    calendarYear: spec.codYear - 1,
    revenueUSD: 0,
    capacityRevenueUSD: 0,
    opexUSD: 0,
    debtServiceUSD: 0,
    taxesUSD: 0,
    itcCreditUSD: 0,
    ptcCreditUSD: 0,
    capacityFactor: 0,
    equityCashflowUSD: -equityCapex,
    cumulativeEquityCFUSD: -equityCapex,
  };
  cashflows.push(yearZero);

  let cumulative = -equityCapex;

  for (let y = 1; y <= spec.economicLifeYears; y++) {
    const cf = annualCF(
      spec.technology,
      spec.zone,
      y,
      overrides.capacityFactorDelta,
    );
    cfByYear.push(cf);
    const generationMWh = spec.capacityMW * cf * HOURS_PER_YEAR;
    const lmpThisYear = forwardLMP[y - 1] ?? forwardLMP[forwardLMP.length - 1] ?? 0;
    const revenue = generationMWh * lmpThisYear;

    // Opex escalates 2%/year.
    const opex = spec.capacityMW * spec.opexPerMWYear * Math.pow(1.02, y - 1);

    // Debt service runs for `debtTenor` years.
    const debtPay = y <= spec.debtTenor ? annualDebt : 0;

    // PTC realized for years 1-10 if eligible.
    const ptcCredit =
      y <= 10 && policy.ptcPerMWh > 0 ? generationMWh * policy.ptcPerMWh : 0;

    // ITC realized in year 1.
    const itcRealized = y === 1 ? itcCredit : 0;

    // Tax: (revenue + capacity − opex − depreciation − interest portion)
    // For V1 we approximate interest as `min(annualDebt, debtPrincipal*debtRate)`
    // and depreciation as straight-line over `depreciationYears`.
    const interest =
      y <= spec.debtTenor
        ? Math.min(annualDebt, debtPrincipal * spec.debtRate)
        : 0;
    const depreciation = y <= depreciationYears ? annualDepreciation : 0;
    const taxableIncome = revenue + capacityRevenue - opex - depreciation - interest;
    const taxesGross = Math.max(0, taxableIncome) * spec.taxRate;
    // PTC and ITC offset taxes dollar-for-dollar.
    const taxesAfterCredits = Math.max(
      0,
      taxesGross - ptcCredit - itcRealized,
    );

    // Equity cashflow: revenue + capacity − opex − debt − taxes after credits.
    const equityCF =
      revenue + capacityRevenue - opex - debtPay - taxesAfterCredits;
    cumulative += equityCF;

    cashflows.push({
      year: y,
      calendarYear: spec.codYear + y - 1,
      revenueUSD: revenue,
      capacityRevenueUSD: capacityRevenue,
      opexUSD: opex,
      debtServiceUSD: debtPay,
      taxesUSD: taxesAfterCredits,
      itcCreditUSD: itcRealized,
      ptcCreditUSD: ptcCredit,
      capacityFactor: cf,
      equityCashflowUSD: equityCF,
      cumulativeEquityCFUSD: cumulative,
    });
  }

  const equityStream = cashflows.map((c) => c.equityCashflowUSD);
  return { cashflows, equityStream, cfByYear, debtService: annualDebt };
}

// ─── Policy attribution ──────────────────────────────────────────

/**
 * Decompose discounted equity NPV into base-energy contribution
 * (without policy adders) + ITC + PTC + capacity-market contribution.
 *
 * Mirrors the structure of the PolicyAttribution waterfall chart.
 */
function attributePolicy(
  spec: ProjectSpec,
  cashflows: CashflowYear[],
): PolicyAttribution {
  const r = spec.discountRate;
  const itcValueUSD = cashflows.reduce(
    (s, c) => s + c.itcCreditUSD / Math.pow(1 + r, c.year),
    0,
  );
  const ptcValueUSD = cashflows.reduce(
    (s, c) => s + c.ptcCreditUSD / Math.pow(1 + r, c.year),
    0,
  );
  const capacityValueUSD = cashflows.reduce(
    (s, c) => s + c.capacityRevenueUSD / Math.pow(1 + r, c.year),
    0,
  );
  // Strip policy adders from each year's equity cashflow to get the
  // base-energy NPV component.
  const baseEnergyNPVUSD = cashflows.reduce((s, c) => {
    const stripped =
      c.equityCashflowUSD -
      c.itcCreditUSD -
      c.ptcCreditUSD -
      c.capacityRevenueUSD;
    return s + stripped / Math.pow(1 + r, c.year);
  }, 0);

  return { itcValueUSD, ptcValueUSD, capacityValueUSD, baseEnergyNPVUSD };
}

// ─── Sensitivity tornado ─────────────────────────────────────────

interface SensitivityLever {
  label: string;
  apply: (spec: ProjectSpec, ov: ScenarioOverrides, sign: 1 | -1) => {
    spec: ProjectSpec;
    overrides: ScenarioOverrides;
  };
}

const SENSITIVITY_LEVERS: SensitivityLever[] = [
  {
    label: 'Capex ±20%',
    apply: (spec, ov, sign) => ({
      spec,
      overrides: { ...ov, capexMultiplier: ov.capexMultiplier * (1 + sign * 0.2) },
    }),
  },
  {
    label: 'LMP ±20%',
    apply: (spec, ov, sign) => ({
      spec,
      overrides: { ...ov, lmpMultiplier: ov.lmpMultiplier * (1 + sign * 0.2) },
    }),
  },
  {
    label: 'CF ±10pp',
    apply: (spec, ov, sign) => ({
      spec,
      overrides: { ...ov, capacityFactorDelta: ov.capacityFactorDelta + sign * 0.10 },
    }),
  },
  {
    label: 'Debt rate ±200bps',
    apply: (spec, ov, sign) => ({
      spec: { ...spec, debtRate: spec.debtRate + sign * 0.02 },
      overrides: ov,
    }),
  },
  {
    label: 'Economic life ±5 yrs',
    apply: (spec, ov, sign) => ({
      spec: { ...spec, economicLifeYears: Math.max(5, spec.economicLifeYears + sign * 5) },
      overrides: ov,
    }),
  },
];

function tornadoEntries(
  spec: ProjectSpec,
  baseIRR: number,
  baseOverrides: ScenarioOverrides,
): SensitivityEntry[] {
  const entries: SensitivityEntry[] = [];
  for (const lever of SENSITIVITY_LEVERS) {
    const up = lever.apply(spec, baseOverrides, +1);
    const dn = lever.apply(spec, baseOverrides, -1);
    const upIRR = computeScenarioIRR(up.spec, up.overrides);
    const dnIRR = computeScenarioIRR(dn.spec, dn.overrides);
    entries.push({
      label: lever.label,
      irrDeltaUp: Number.isFinite(upIRR) ? upIRR - baseIRR : 0,
      irrDeltaDown: Number.isFinite(dnIRR) ? dnIRR - baseIRR : 0,
    });
  }
  // Sort by largest absolute IRR impact first.
  entries.sort(
    (a, b) =>
      Math.max(Math.abs(b.irrDeltaUp), Math.abs(b.irrDeltaDown)) -
      Math.max(Math.abs(a.irrDeltaUp), Math.abs(a.irrDeltaDown)),
  );
  return entries;
}

function computeScenarioIRR(
  spec: ProjectSpec,
  overrides: ScenarioOverrides,
): number {
  const forwardLMP = forwardAnnualLMP({
    zone: spec.zone,
    codYear: spec.codYear,
    economicLifeYears: spec.economicLifeYears,
    lmpMultiplier: overrides.lmpMultiplier,
  });
  const { equityStream } = buildCashflows(spec, overrides, forwardLMP);
  return computeIRR(equityStream);
}

// ─── PPA benchmark ───────────────────────────────────────────────

function buildPPABenchmark(spec: ProjectSpec): PPABenchmarkBand {
  const filtered = PPA_BENCHMARKS.filter(
    (p) => p.technology.toLowerCase() === spec.technology.toLowerCase(),
  );
  if (filtered.length === 0) {
    // Fall back to all PPAs if no tech-specific row exists.
    const all = PPA_BENCHMARKS;
    const prices = all.map((p) => p.pricePerMwh);
    return {
      technology: spec.technology,
      floor: Math.min(...prices),
      ceiling: Math.max(...prices),
      median: prices[Math.floor(prices.length / 2)],
      sampleCount: all.length,
    };
  }
  const prices = filtered.map((p) => p.pricePerMwh).sort((a, b) => a - b);
  return {
    technology: spec.technology,
    floor: prices[0],
    ceiling: prices[prices.length - 1],
    median: prices[Math.floor(prices.length / 2)],
    sampleCount: prices.length,
  };
}

// ─── Per-scenario result ─────────────────────────────────────────

function runScenario(
  spec: ProjectSpec,
  scenarioName: ScenarioName,
  overrides: ScenarioOverrides,
  liveAnnualLMP?: number[],
): ScenarioResult {
  const forwardLMP = forwardAnnualLMP({
    zone: spec.zone,
    codYear: spec.codYear,
    economicLifeYears: spec.economicLifeYears,
    lmpMultiplier: overrides.lmpMultiplier,
    liveAnnualLMP,
  });

  const { cashflows, equityStream, cfByYear } = buildCashflows(
    spec,
    overrides,
    forwardLMP,
  );

  const irr = computeIRR(equityStream);
  const npvUSD = computeNPV(equityStream, spec.discountRate);
  const paybackYears = computePayback(equityStream);

  const meanLMP = meanForwardLMP(forwardLMP);
  const year1 = cashflows.find((c) => c.year === 1);
  const year1Generation =
    year1 && meanLMP > 0 ? year1.revenueUSD / meanLMP : 0;
  const breakevenLMPPerMWh = computeBreakevenLMP(
    spec,
    npvUSD,
    meanLMP,
    year1Generation,
  );

  const policyAttribution = attributePolicy(spec, cashflows);

  return {
    scenario: scenarioName,
    irr,
    npvUSD,
    paybackYears,
    breakevenLMPPerMWh,
    cashflows,
    capacityFactorByYear: cfByYear,
    policyAttribution,
  };
}

// ─── Entry point ─────────────────────────────────────────────────

export interface RunUnderwritingOptions {
  /** Optional override for the scenario set. Defaults to DEFAULT_SCENARIOS. */
  scenarios?: ScenarioSet;
  /**
   * Optional live forward-LMP override. Used when a future PJM forward
   * market hook ships; the engine prefers live values for the early
   * years and falls back to the synthetic curve for later years.
   */
  liveAnnualLMP?: number[];
}

export function runUnderwriting(
  spec: ProjectSpec,
  options: RunUnderwritingOptions = {},
): UnderwritingResults {
  const scenarioSet = options.scenarios ?? DEFAULT_SCENARIOS;

  const base = runScenario(spec, 'base', scenarioSet.base, options.liveAnnualLMP);
  const upside = runScenario(spec, 'upside', scenarioSet.upside, options.liveAnnualLMP);
  const downside = runScenario(
    spec,
    'downside',
    scenarioSet.downside,
    options.liveAnnualLMP,
  );

  const ppaBenchmark = buildPPABenchmark(spec);
  const sensitivity = tornadoEntries(spec, base.irr, scenarioSet.base);

  const baseForwardLMP = forwardAnnualLMP({
    zone: spec.zone,
    codYear: spec.codYear,
    economicLifeYears: spec.economicLifeYears,
    lmpMultiplier: scenarioSet.base.lmpMultiplier,
    liveAnnualLMP: options.liveAnnualLMP,
  });
  const lifetimeCF = averageLifetimeCF(
    spec.technology,
    spec.zone,
    spec.economicLifeYears,
    scenarioSet.base.capacityFactorDelta,
  );
  const baseCashflows = base.cashflows;
  void lifetimeCFTrajectory; // re-exported for callers that want it

  const totalCapex =
    spec.capacityMW * spec.capexPerMW * scenarioSet.base.capexMultiplier;
  const equityCapex = totalCapex * (1 - spec.debtRatio);
  const annualDebt = computeAnnualDebtService(
    totalCapex * spec.debtRatio,
    spec.debtRate,
    spec.debtTenor,
  );
  const policy = resolvePolicy(spec);

  const assumptions: UnderwritingAssumptions = {
    meanForwardLMP: meanForwardLMP(baseForwardLMP),
    lifetimeAvgCF: lifetimeCF,
    totalCapexUSD: totalCapex,
    equityCapexUSD: equityCapex,
    annualDebtServiceUSD: annualDebt,
    itcRate: policy.itcRate,
    ptcPerMWh: policy.ptcPerMWh,
    capacityPerMWYear: policy.capacityPerMWYear,
    notes: [
      `Forward LMP from ZONE_REVENUE_HISTORY_24M with 2.5%/yr escalation and long-run blend to $${55}/MWh.`,
      `Capacity factor: technology base × zone tilt × monthly seasonality × linear degradation.`,
      `MACRS 5-yr straight-line depreciation (V1 simplification).`,
      `ITC realized in year 1; PTC over years 1-10 if eligible.`,
      `Capacity payment: zone $/MW-yr × technology ELCC factor.`,
    ],
  };

  // Reference the cashflows to silence the unused-binding lint and
  // make it explicit that consumers read these via scenarios.base.
  void baseCashflows;

  return {
    spec,
    scenarios: { base, upside, downside },
    ppaBenchmark,
    sensitivity,
    assumptions,
  };
}
