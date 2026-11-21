// ORACLE Wave 2 + FORGE Wave 5 — Developer / IPP Nest context provider.
//
// Wave 5 addition: when the Underwriting Calculator has produced results,
// the AI synthesis surface references the specific project — its name,
// IRR / NPV / breakeven / payback / PPA verdict — instead of the
// generic project-pipeline summary. The CalculatorView writes its
// current state into the module-level snapshot via `setUnderwritingState`;
// the provider reads from it on each invocation.

import type { ContextProvider } from '../aiContext';
import {
  PROJECT_PIPELINE,
  INTERCONNECTION_QUEUE,
  POLICY_TRACKER,
} from '@/lib/mock/developer-mock';
import type {
  ProjectSpec,
  ScenarioName,
  UnderwritingResults,
} from '@/lib/underwriting/types';

// ─── Underwriting state bridge ───────────────────────────────────

interface UnderwritingSnapshot {
  spec: ProjectSpec | null;
  results: UnderwritingResults | null;
  scenario: ScenarioName;
}

let underwritingSnapshot: UnderwritingSnapshot = {
  spec: null,
  results: null,
  scenario: 'base',
};

/**
 * Setter called by `CalculatorView`'s `onResultsChange` whenever the
 * user runs a calculation or flips scenarios. The provider reads the
 * latest value on its next invocation.
 */
export function setUnderwritingState(next: UnderwritingSnapshot): void {
  underwritingSnapshot = next;
}

/** Read-only accessor — exported for tests / debugging. */
export function getUnderwritingState(): UnderwritingSnapshot {
  return underwritingSnapshot;
}

// ─── Helpers ─────────────────────────────────────────────────────

function formatUSDShort(v: number): string {
  if (!Number.isFinite(v)) return '—';
  const sign = v < 0 ? '−' : '';
  const abs = Math.abs(v);
  if (abs >= 1_000_000_000) return `${sign}$${(abs / 1_000_000_000).toFixed(2)}B`;
  if (abs >= 1_000_000) return `${sign}$${(abs / 1_000_000).toFixed(1)}M`;
  if (abs >= 1_000) return `${sign}$${(abs / 1_000).toFixed(0)}k`;
  return `${sign}$${abs.toFixed(0)}`;
}

function describeUnderwriting(snap: UnderwritingSnapshot): {
  description: string;
  metrics: Record<string, string | number>;
} | null {
  if (!snap.spec || !snap.results) return null;
  const r = snap.results.scenarios[snap.scenario];
  const irrPct = Number.isFinite(r.irr) ? `${(r.irr * 100).toFixed(1)}%` : '—';
  const npvLabel = formatUSDShort(r.npvUSD);
  const breakevenLabel = Number.isFinite(r.breakevenLMPPerMWh)
    ? `$${r.breakevenLMPPerMWh.toFixed(2)}/MWh`
    : '—';
  const paybackLabel =
    r.paybackYears === null ? 'never' : `${r.paybackYears.toFixed(1)} yr`;
  const ppa = snap.results.ppaBenchmark;
  let ppaVerdict = 'within band';
  if (Number.isFinite(r.breakevenLMPPerMWh)) {
    if (r.breakevenLMPPerMWh < ppa.floor) ppaVerdict = 'below PPA floor';
    else if (r.breakevenLMPPerMWh > ppa.ceiling) ppaVerdict = 'above PPA ceiling';
  }

  const description =
    `The user is reviewing an underwriting analysis of "${snap.spec.name}" — ` +
    `a ${snap.spec.capacityMW} MW ${snap.spec.technology.toLowerCase()} project in ${snap.spec.zone} with ${snap.spec.codYear} COD. ` +
    `Under the ${snap.scenario.toUpperCase()} scenario, equity IRR is ${irrPct}, ` +
    `NPV ${npvLabel}, breakeven LMP ${breakevenLabel}, payback ${paybackLabel}. ` +
    `Breakeven is ${ppaVerdict} (PPA range $${ppa.floor.toFixed(2)}-$${ppa.ceiling.toFixed(2)}/MWh, ` +
    `median $${ppa.median.toFixed(2)}, ${ppa.sampleCount} deals). ` +
    `Lifetime CF ${(snap.results.assumptions.lifetimeAvgCF * 100).toFixed(1)}%, ` +
    `mean forward LMP $${snap.results.assumptions.meanForwardLMP.toFixed(2)}/MWh. ` +
    `Top sensitivity: ${snap.results.sensitivity[0]?.label ?? '—'}.`;

  return {
    description,
    metrics: {
      projectName: snap.spec.name,
      technology: snap.spec.technology,
      capacityMW: snap.spec.capacityMW,
      zone: snap.spec.zone,
      codYear: snap.spec.codYear,
      scenario: snap.scenario,
      irrPct,
      npvUSD: Math.round(r.npvUSD),
      breakevenLMPPerMWh: Number(r.breakevenLMPPerMWh.toFixed(2)),
      paybackYears: r.paybackYears === null ? 'never' : Number(r.paybackYears.toFixed(2)),
      ppaFloor: ppa.floor,
      ppaCeiling: ppa.ceiling,
      ppaMedian: ppa.median,
      ppaVerdict,
    },
  };
}

// ─── Provider ────────────────────────────────────────────────────

export const developerNestContextProvider: ContextProvider = (input) => {
  const zone = input.selectedZone ?? null;

  const totalMw = PROJECT_PIPELINE.reduce((sum, p) => sum + p.mw, 0);
  const stages = [...new Set(PROJECT_PIPELINE.map((p) => p.stage))];

  // Wave 5: prefer the underwriting-aware description when the user has
  // actively run a calculation.
  const underwriting = describeUnderwriting(underwritingSnapshot);

  const description = underwriting
    ? underwriting.description
    : `Developer / IPP Nest. Project pipeline shows ${PROJECT_PIPELINE.length} ` +
      `assets totalling ${Math.round(totalMw)} MW across stages: ${stages.join(', ')}. ` +
      `24-month zone revenue history, ${INTERCONNECTION_QUEUE.length} ` +
      `interconnection-queue entries, binding constraints, PPA benchmarks, ` +
      `and a policy tracker with ${POLICY_TRACKER.length} active items. ` +
      `The user manages siting, financing, and policy intelligence for new builds.`;

  const metrics: Record<string, string | number> = underwriting
    ? underwriting.metrics
    : {
        projectsInPipeline: PROJECT_PIPELINE.length,
        totalPipelineMw: Math.round(totalMw),
        queueDepth: INTERCONNECTION_QUEUE.length,
        policyItems: POLICY_TRACKER.length,
      };

  return {
    surfaceLabel: underwriting
      ? 'Developer Nest · Underwriting Calculator'
      : 'Developer Nest',
    selectedZone: zone,
    selectedTab: underwriting ? 'underwriting' : 'overview',
    currentItemId: underwriting?.metrics.projectName as string | undefined,
    currentItemTitle: underwriting?.metrics.projectName as string | undefined,
    visibleData: {
      description,
      metrics,
    },
  };
};
