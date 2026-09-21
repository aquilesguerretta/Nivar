// FORGE Wave 5 — Developer/IPP Underwriting Calculator types.
// Stable contract consumed by the underwriting engine, the calculator
// store, every UnderwritingCalculator UI component, and the PDF memo
// exporter. Mirrors the Industrial Simulator's contract shape so the
// patterns transfer.

import type { DeveloperTechnology } from '@/lib/mock/developer-mock';

// ─── Project spec ────────────────────────────────────────────────

export interface ProjectSpec {
  /** Identifier — typically derived from the seed PROJECT_PIPELINE entry. */
  id: string;
  /** Human-readable project name. */
  name: string;
  /** Generation technology. Reuses FOUNDRY's DeveloperTechnology union. */
  technology: DeveloperTechnology;
  /** Nameplate capacity in MW (AC). */
  capacityMW: number;
  /** PJM zone the project sits in. */
  zone: string;
  /** Commercial operation date year (e.g. 2028). Month/day not modeled in V1. */
  codYear: number;
  /** Economic life in years from COD (15–30 typical). */
  economicLifeYears: number;
  /** Total installed cost per MW, USD. */
  capexPerMW: number;
  /** Annual operating expense per MW-year, USD. Escalated 2%/year by default. */
  opexPerMWYear: number;
  /** Debt-to-capex ratio (0–0.85). */
  debtRatio: number;
  /** Debt tenor in years. */
  debtTenor: number;
  /** Annual debt interest rate (decimal, e.g. 0.065). */
  debtRate: number;
  /** Effective tax rate (decimal). */
  taxRate: number;
  /** Equity discount rate / hurdle for NPV calc (decimal). */
  discountRate: number;
  /** ITC eligibility flag — resolver may downgrade based on COD/tech. */
  itcEligible: boolean;
  /** PTC eligibility flag — resolver may downgrade. */
  ptcEligible: boolean;
}

// ─── Scenario set ────────────────────────────────────────────────

export type ScenarioName = 'base' | 'upside' | 'downside';

export interface ScenarioOverrides {
  /** Multiplier on the base forward LMP curve (1.0 = base). */
  lmpMultiplier: number;
  /** Additive percent-point adjustment to capacity factor (0.02 = +2pp). */
  capacityFactorDelta: number;
  /** Multiplier on capex (1.0 = base). */
  capexMultiplier: number;
  /** Drop ITC under this scenario (e.g. policy expiry). */
  itcOverride?: boolean;
  /** Drop PTC under this scenario. */
  ptcOverride?: boolean;
}

export interface ScenarioSet {
  base: ScenarioOverrides;
  upside: ScenarioOverrides;
  downside: ScenarioOverrides;
}

// ─── Cashflow per year ───────────────────────────────────────────

export interface CashflowYear {
  /** Year index, 1 .. economicLifeYears. */
  year: number;
  /** Calendar year (codYear + year - 1). */
  calendarYear: number;
  /** Energy revenue at the forward LMP × CF × capacity. */
  revenueUSD: number;
  /** Capacity payment revenue, USD. */
  capacityRevenueUSD: number;
  /** Operating expense USD (escalated). */
  opexUSD: number;
  /** Interest + principal on outstanding debt, USD. */
  debtServiceUSD: number;
  /** Cash taxes paid USD (after credits). */
  taxesUSD: number;
  /** ITC credit in this year (typically year 1 only), USD. */
  itcCreditUSD: number;
  /** PTC credit in this year (years 1–10 for eligible tech), USD. */
  ptcCreditUSD: number;
  /** Capacity factor used in the year (0–1). */
  capacityFactor: number;
  /** Net equity cashflow for the year. */
  equityCashflowUSD: number;
  /** Running total of equity cashflow through this year. */
  cumulativeEquityCFUSD: number;
}

// ─── Scenario result ─────────────────────────────────────────────

export interface ScenarioResult {
  scenario: ScenarioName;
  /** Equity IRR (decimal — 0.12 = 12%). NaN if the equity stream never goes positive. */
  irr: number;
  /** Equity NPV at the spec's discount rate, USD. */
  npvUSD: number;
  /** Payback period in years (linear interp). null = never. */
  paybackYears: number | null;
  /** Breakeven hourly LMP that yields zero equity NPV, $/MWh. */
  breakevenLMPPerMWh: number;
  /** Annual cashflows over the economic life. */
  cashflows: CashflowYear[];
  /** Capacity factor per project year (length = economicLifeYears). */
  capacityFactorByYear: number[];
  /** Discounted total value contribution of each policy lever (signed). */
  policyAttribution: PolicyAttribution;
}

export interface PolicyAttribution {
  /** Discounted ITC value added to equity, USD. */
  itcValueUSD: number;
  /** Discounted PTC value added to equity, USD. */
  ptcValueUSD: number;
  /** Discounted capacity-market value added to equity, USD. */
  capacityValueUSD: number;
  /** Base energy revenue NPV before policy adders, USD. */
  baseEnergyNPVUSD: number;
}

// ─── Top-level result ────────────────────────────────────────────

export interface UnderwritingResults {
  spec: ProjectSpec;
  scenarios: Record<ScenarioName, ScenarioResult>;
  /** PPA benchmark band for the project's tech, $/MWh. */
  ppaBenchmark: PPABenchmarkBand;
  /** Sensitivity tornado entries, sorted by absolute IRR impact descending. */
  sensitivity: SensitivityEntry[];
  /** Generated assumptions block — written to PDF + AI context. */
  assumptions: UnderwritingAssumptions;
}

export interface PPABenchmarkBand {
  technology: string;
  /** Lowest observed PPA price in the benchmark set, $/MWh. */
  floor: number;
  /** Highest observed PPA price, $/MWh. */
  ceiling: number;
  /** Median PPA price, $/MWh. */
  median: number;
  /** Sample size used. */
  sampleCount: number;
}

export interface SensitivityEntry {
  /** Human-readable lever label, e.g. "Capex ±20%". */
  label: string;
  /** IRR delta when lever moves negative (downside test), decimal. */
  irrDeltaDown: number;
  /** IRR delta when lever moves positive (upside test), decimal. */
  irrDeltaUp: number;
}

export interface UnderwritingAssumptions {
  /** Mean forward LMP applied (annual energy-weighted), $/MWh. */
  meanForwardLMP: number;
  /** Lifetime average capacity factor, decimal. */
  lifetimeAvgCF: number;
  /** Capex used after scenario multiplier, USD total. */
  totalCapexUSD: number;
  /** Equity contribution (capex × (1 − debtRatio)), USD. */
  equityCapexUSD: number;
  /** Annual debt service (level annuity), USD. */
  annualDebtServiceUSD: number;
  /** ITC rate applied (decimal). */
  itcRate: number;
  /** PTC $/MWh applied. */
  ptcPerMWh: number;
  /** Capacity payment $/MW-year applied. */
  capacityPerMWYear: number;
  /** Free-form lines for the PDF methodology appendix. */
  notes: string[];
}

// ─── Calculator orchestration ────────────────────────────────────

export interface CalculatorState {
  spec: ProjectSpec | null;
  scenarioSet: ScenarioSet;
  /** Currently-displayed scenario. */
  activeScenario: ScenarioName;
  /** Most recent run results. Null while never run. */
  results: UnderwritingResults | null;
  isRunning: boolean;
}
