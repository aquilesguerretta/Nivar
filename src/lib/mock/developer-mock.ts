// FOUNDRY mock — Developer / IPP Nest data.
// 4 projects, 24-month zone revenue history, interconnection queue,
// binding constraints, PPA benchmarks, policy tracker.

export type DeveloperTechnology = 'BESS' | 'Solar' | 'Wind' | 'Hybrid';

export interface DeveloperProject {
  id: string;
  name: string;
  mw: number;
  technology: DeveloperTechnology;
  stage: string;
  forecastedIrr: number;
  expectedCod: string;
}

export interface ZoneRevenueMonth {
  month: number;
  cumulativeRevenue: number;
  cycles: number;
}

export interface InterconnectionQueueItem {
  id: string;
  queuePosition: string;
  mw: number;
  technology: string;
  attritionProbability: number;
}

export interface BindingConstraint {
  name: string;
  frequencyPct: number;
  avgCongestionRent: number;
}

export interface PPABenchmark {
  id: string;
  mw: number;
  technology: string;
  pricePerMwh: number;
  counterparty: string;
  signedDate: string;
}

export interface PolicyTrackerItem {
  id: string;
  title: string;
  date: string;
  impact: 'positive' | 'neutral' | 'negative';
}

export const PROJECT_PIPELINE: DeveloperProject[] = [
  { id: 'pj-001', name: 'PSEG Battery 200MW', mw: 200, technology: 'BESS',  stage: 'Development',           forecastedIrr: 0.142, expectedCod: '2027-06-01' },
  { id: 'pj-002', name: 'COMED Solar 100MW',  mw: 100, technology: 'Solar', stage: 'Interconnection Study', forecastedIrr: 0.098, expectedCod: '2028-09-01' },
  { id: 'pj-003', name: 'AEP Wind 150MW',     mw: 150, technology: 'Wind',  stage: 'PPA Negotiation',       forecastedIrr: 0.116, expectedCod: '2027-12-01' },
  { id: 'pj-004', name: 'WEST_HUB BESS 50MW', mw: 50,  technology: 'BESS',  stage: 'Commercial Operation',  forecastedIrr: 0.158, expectedCod: '2024-08-15' },
];

// 24 monthly cumulative revenue + cycles for a 4-hr battery in PSEG.
const buildZoneRevenue = (): ZoneRevenueMonth[] => {
  const months: ZoneRevenueMonth[] = [];
  let cumulative = 0;
  let cycles = 0;
  const base = 880_000;
  for (let i = 0; i < 24; i++) {
    const seasonal = Math.sin((i / 12) * Math.PI * 2 + Math.PI / 2) * 220_000;
    const noise = ((i * 13) % 7 - 3) * 18_000;
    const monthlyRev = Math.round(base + seasonal + noise);
    cumulative += monthlyRev;
    cycles += 28 + ((i * 5) % 7 - 3);
    months.push({ month: i + 1, cumulativeRevenue: cumulative, cycles });
  }
  return months;
};

export const ZONE_REVENUE_HISTORY_24M: ZoneRevenueMonth[] = buildZoneRevenue();

export const INTERCONNECTION_QUEUE: InterconnectionQueueItem[] = [
  { id: 'q-001', queuePosition: 'AE2-031', mw: 80,  technology: 'Solar',   attritionProbability: 0.42 },
  { id: 'q-002', queuePosition: 'AE2-074', mw: 100, technology: 'BESS',    attritionProbability: 0.31 },
  { id: 'q-003', queuePosition: 'AE2-112', mw: 150, technology: 'Hybrid',  attritionProbability: 0.58 },
  { id: 'q-004', queuePosition: 'AE2-148', mw: 250, technology: 'Wind',    attritionProbability: 0.47 },
];

export const BINDING_CONSTRAINTS_12M: BindingConstraint[] = [
  { name: 'Artificial Island Interface',     frequencyPct: 18.4, avgCongestionRent: 4.82 },
  { name: 'Bergen-Linden Corridor',          frequencyPct: 12.1, avgCongestionRent: 3.41 },
  { name: 'NY-NJ Interface',                 frequencyPct: 9.8,  avgCongestionRent: 6.18 },
  { name: 'Meadow Brook-Loudoun',            frequencyPct: 7.2,  avgCongestionRent: 2.94 },
  { name: 'Conemaugh-Hunterstown 500kV',     frequencyPct: 5.6,  avgCongestionRent: 2.18 },
];

export const PPA_BENCHMARKS: PPABenchmark[] = [
  { id: 'ppa-001', mw: 250, technology: 'Solar', pricePerMwh: 47.50, counterparty: 'Microsoft (Virginia)',  signedDate: '2026-02-14' },
  { id: 'ppa-002', mw: 180, technology: 'Wind',  pricePerMwh: 52.20, counterparty: 'Amazon (Pennsylvania)', signedDate: '2025-11-08' },
  { id: 'ppa-003', mw: 100, technology: 'BESS',  pricePerMwh: 68.40, counterparty: 'Google (Ohio)',         signedDate: '2025-09-21' },
];

export const POLICY_TRACKER: PolicyTrackerItem[] = [
  { id: 'pol-001', title: 'PJM 2025/26 BRA clears at $269.92/MW-day',      date: '2024-07-30', impact: 'positive' },
  { id: 'pol-002', title: 'FERC Order 2023 interconnection reform effective', date: '2024-04-21', impact: 'positive' },
  { id: 'pol-003', title: 'PA approves Conemaugh coal early retirement',    date: '2026-04-12', impact: 'neutral'  },
];

// ─── FORGE Wave 5 — Underwriting Calculator data ─────────────────
//
// CAPACITY_FACTOR_PROFILES and UNDERWRITING_DEFAULTS feed
// src/lib/underwriting/. The values are mid-2026 industry medians
// (NREL ATB 2025 + PJM zone irradiance / wind regime data) — defensible
// without being procurement-grade. The shape stays stable when live
// PJM forward market data arrives; the values move.

/** Base annual capacity factor (decimal) by technology, before zone tilt. */
export const TECH_BASE_CAPACITY_FACTOR: Record<DeveloperTechnology, number> = {
  Solar:  0.22,
  Wind:   0.33,
  BESS:   0.35, // effective CF assuming ~1.5 cycles/day on a 4-hr battery
  Hybrid: 0.28,
};

/**
 * Zone-tech CF multiplier. Anchored to 1.00 for the median PJM zone;
 * applied multiplicatively on TECH_BASE_CAPACITY_FACTOR.
 *
 *   Solar — best CF in southern/western zones (DOMINION, AEP) with
 *           higher irradiance; reduced in cloudier PSEG/JCPL.
 *   Wind  — best in COMED / AEP (Great Plains–adjacent regimes);
 *           coastal PSEG / RECO has the variable-pressure shape
 *           that depresses average CF.
 *   BESS  — assumed roughly zone-uniform on the cycle side; what
 *           varies is the price spread, which the optimizer captures
 *           via the forward LMP curve, not the CF.
 */
export const ZONE_CF_MULTIPLIER: Record<string, Partial<Record<DeveloperTechnology, number>>> = {
  WEST_HUB: { Solar: 1.00, Wind: 1.00, BESS: 1.00, Hybrid: 1.00 },
  PSEG:     { Solar: 0.92, Wind: 0.88, BESS: 1.00, Hybrid: 0.92 },
  COMED:    { Solar: 0.96, Wind: 1.10, BESS: 1.00, Hybrid: 1.02 },
  AEP:      { Solar: 1.05, Wind: 1.08, BESS: 1.00, Hybrid: 1.04 },
  DOMINION: { Solar: 1.07, Wind: 0.94, BESS: 1.00, Hybrid: 1.00 },
  BGE:      { Solar: 1.02, Wind: 0.92, BESS: 1.00, Hybrid: 0.98 },
  JCPL:     { Solar: 0.94, Wind: 0.95, BESS: 1.00, Hybrid: 0.96 },
  RECO:     { Solar: 0.93, Wind: 0.96, BESS: 1.00, Hybrid: 0.95 },
  DEFAULT:  { Solar: 1.00, Wind: 1.00, BESS: 1.00, Hybrid: 1.00 },
};

/**
 * Monthly CF seasonality shape (12 multipliers normalized so the
 * 12-month mean = 1.00). One profile per technology.
 *
 *   Solar peaks Jun–Aug, troughs Dec–Jan.
 *   Wind peaks Nov–Mar, troughs Jul–Sep.
 *   BESS is roughly flat — slightly elevated in summer/winter where
 *     price spreads widen.
 *   Hybrid is a blend.
 */
export const TECH_MONTHLY_CF_SHAPE: Record<DeveloperTechnology, number[]> = {
  Solar:  [0.62, 0.74, 0.95, 1.10, 1.20, 1.28, 1.30, 1.24, 1.06, 0.86, 0.66, 0.55],
  Wind:   [1.30, 1.22, 1.16, 1.04, 0.92, 0.82, 0.74, 0.78, 0.92, 1.08, 1.18, 1.24],
  BESS:   [1.04, 1.02, 0.98, 0.96, 0.96, 1.06, 1.10, 1.08, 1.00, 0.96, 0.96, 1.02],
  Hybrid: [0.96, 0.98, 1.02, 1.04, 1.04, 1.10, 1.10, 1.08, 1.00, 0.92, 0.92, 0.96],
};

/** Annual CF degradation (decimal) — fraction of nameplate lost per year. */
export const TECH_CF_DEGRADATION: Record<DeveloperTechnology, number> = {
  Solar:  0.005,
  Wind:   0.003,
  BESS:   0.020, // calendar fade dominates; cycling adds on top in reality
  Hybrid: 0.010,
};

export interface UnderwritingDefaults {
  /** $/MW installed all-in. */
  capexPerMW: number;
  /** $/MW-year operating expense. */
  opexPerMWYear: number;
  /** Default debt ratio (0–1). */
  debtRatio: number;
  /** Default debt tenor in years. */
  debtTenor: number;
  /** Default annual debt rate (decimal). */
  debtRate: number;
  /** Default equity hurdle / discount rate (decimal). */
  discountRate: number;
  /** Default economic life in years. */
  economicLifeYears: number;
  /** Target IRR for the technology — chips below this read as RISK. */
  targetIRR: number;
}

/**
 * Per-technology underwriting defaults. Mid-2026 industry medians.
 * Solar / Wind capex per MW reflects NREL ATB 2025 utility-scale
 * benchmarks; BESS reflects 4-hr Li-ion installed cost; Hybrid
 * weights ~60% solar / 40% storage.
 */
export const UNDERWRITING_DEFAULTS: Record<DeveloperTechnology, UnderwritingDefaults> = {
  Solar: {
    capexPerMW:        1_100_000,
    opexPerMWYear:        16_000,
    debtRatio:              0.65,
    debtTenor:                18,
    debtRate:              0.065,
    discountRate:          0.08,
    economicLifeYears:        25,
    targetIRR:             0.10,
  },
  Wind: {
    capexPerMW:        1_650_000,
    opexPerMWYear:        38_000,
    debtRatio:              0.60,
    debtTenor:                17,
    debtRate:              0.068,
    discountRate:          0.085,
    economicLifeYears:        25,
    targetIRR:             0.11,
  },
  BESS: {
    capexPerMW:        1_120_000, // 4-hr nominal: $280/kWh × 4 hr
    opexPerMWYear:        12_500,
    debtRatio:              0.55,
    debtTenor:                12,
    debtRate:              0.075,
    discountRate:          0.10,
    economicLifeYears:        20,
    targetIRR:             0.14,
  },
  Hybrid: {
    capexPerMW:        1_580_000,
    opexPerMWYear:        22_000,
    debtRatio:              0.60,
    debtTenor:                15,
    debtRate:              0.070,
    discountRate:          0.09,
    economicLifeYears:        22,
    targetIRR:             0.12,
  },
};

/** Default PJM capacity payment, $/MW-year. Tunable per zone. */
export const CAPACITY_PAYMENT_PER_MW_YEAR: Record<string, number> = {
  WEST_HUB: 60_000,
  PSEG:     98_000,
  COMED:    72_000,
  AEP:      55_000,
  DOMINION: 64_000,
  JCPL:     90_000,
  BGE:      82_000,
  RECO:     94_000,
  DEFAULT:  68_000,
};
