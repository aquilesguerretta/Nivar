// FORGE Wave 5 — Underwriting Calculator main view.
//
// Three states:
//   1. no spec → ProjectInputForm only (full-width)
//   2. running → form + Skeleton placeholders for the results pane
//   3. results → form (left) + results pane (right, sticky scenario)
//
// Pattern mirrors SimulatorView (Industrial) and OptimizerView
// (Storage) so the visual feel transfers between depth-complete
// profiles. Runs the engine synchronously in a setTimeout(50) tick so
// the UI can paint the loading state.

import { useMemo, useState } from 'react';
import { C, F, R, S } from '@/design/tokens';
import { ContainedCard } from '@/components/terminal/ContainedCard';
import { EditorialIdentity } from '@/components/terminal/EditorialIdentity';
import { Skeleton } from '@/components/terminal/Skeleton';
import {
  runUnderwriting,
  DEFAULT_SCENARIOS,
} from '@/lib/underwriting/runUnderwriting';
import type {
  ProjectSpec,
  ScenarioName,
  ScenarioSet,
  UnderwritingResults,
} from '@/lib/underwriting/types';
import { ProjectInputForm } from './ProjectInputForm';
import { ScenarioToggles } from './ScenarioToggles';
import { ResultsHero } from './ResultsHero';
import { CashflowWaterfall } from './CashflowWaterfall';
import { RevenueProjectionChart } from './RevenueProjectionChart';
import { CapacityFactorChart } from './CapacityFactorChart';
import { ScenarioComparison } from './ScenarioComparison';
import { PolicyAttribution } from './PolicyAttribution';
import { PPABenchmarkOverlay } from './PPABenchmarkOverlay';
import { SensitivityTornado } from './SensitivityTornado';
import { ExportUnderwritingMemoButton } from './ExportUnderwritingMemoButton';

interface Props {
  /** Optional initial spec — DeveloperNest seeds this with a selected project. */
  initial?: ProjectSpec | null;
  /**
   * Callback fired whenever results change. DeveloperNest uses this to
   * push the latest state into ORACLE's developerNestContext.
   */
  onResultsChange?: (state: {
    spec: ProjectSpec | null;
    results: UnderwritingResults | null;
    scenario: ScenarioName;
  }) => void;
}

export function CalculatorView({ initial, onResultsChange }: Props) {
  const [spec, setSpec] = useState<ProjectSpec | null>(initial ?? null);
  const [scenarioSet] = useState<ScenarioSet>(DEFAULT_SCENARIOS);
  const [activeScenario, setActiveScenario] =
    useState<ScenarioName>('base');
  const [results, setResults] = useState<UnderwritingResults | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  function notifyContext(next: {
    spec: ProjectSpec | null;
    results: UnderwritingResults | null;
    scenario: ScenarioName;
  }) {
    if (onResultsChange) onResultsChange(next);
  }

  function handleFormSubmit(nextSpec: ProjectSpec) {
    setSpec(nextSpec);
    setIsRunning(true);
    // Defer one tick so the Skeleton can paint.
    setTimeout(() => {
      try {
        const out = runUnderwriting(nextSpec, { scenarios: scenarioSet });
        setResults(out);
        notifyContext({ spec: nextSpec, results: out, scenario: activeScenario });
      } finally {
        setIsRunning(false);
      }
    }, 50);
  }

  function handleScenarioChange(next: ScenarioName) {
    setActiveScenario(next);
    if (results) notifyContext({ spec, results, scenario: next });
  }

  const activeResult = useMemo(
    () => (results ? results.scenarios[activeScenario] : null),
    [results, activeScenario],
  );

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: results ? '360px 1fr' : '1fr',
        gap: S.lg,
        alignItems: 'start',
      }}
    >
      <div>
        <ProjectInputForm initial={spec} onSubmit={handleFormSubmit} />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: S.lg }}>
        {isRunning && (
          <>
            <ContainedCard padding={S.lg}>
              <div
                style={{
                  fontFamily: F.mono,
                  fontSize: 11,
                  fontWeight: 600,
                  letterSpacing: '0.16em',
                  textTransform: 'uppercase',
                  color: C.electricBlueLight,
                  marginBottom: S.md,
                }}
              >
                CRUNCHING NUMBERS
              </div>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: S.lg,
                }}
              >
                <Skeleton.HeroNumber size={56} digits={6} label="IRR" />
                <Skeleton.HeroNumber size={56} digits={8} label="NPV" />
                <Skeleton.HeroNumber size={56} digits={6} label="Breakeven" />
              </div>
            </ContainedCard>
            <Skeleton.Chart height={260} label="Cashflow waterfall loading" />
            <Skeleton.Chart height={220} label="Revenue projection loading" />
          </>
        )}

        {!results && !isRunning && (
          <ContainedCard padding={S.xl}>
            <div
              style={{
                fontFamily: F.mono,
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
                color: C.electricBlueLight,
                marginBottom: 4,
              }}
            >
              READY TO UNDERWRITE
            </div>
            <EditorialIdentity size="section" marginBottom={S.md}>
              Fill the form on the left and click Run Underwriting.
            </EditorialIdentity>
            <div
              style={{
                fontFamily: F.sans,
                fontSize: 13,
                lineHeight: 1.6,
                color: C.textSecondary,
              }}
            >
              The calculator runs base / upside / downside scenarios against
              a synthesized forward LMP curve for the project's zone,
              applies the project's capacity-factor and degradation
              profile, layers ITC / PTC / capacity-market value where
              eligible, and produces equity IRR, NPV, payback, and
              breakeven LMP. PPA benchmarks for the selected technology
              are shown alongside the breakeven so you can tell whether
              the project is above- or below-market.
            </div>
          </ContainedCard>
        )}

        {results && activeResult && spec && (
          <>
            <ScenarioToggles
              active={activeScenario}
              onChange={handleScenarioChange}
            />
            <ResultsHero spec={spec} result={activeResult} />
            <CashflowWaterfall
              projectId={spec.id}
              cashflows={activeResult.cashflows}
            />
            <RevenueProjectionChart
              projectId={spec.id}
              results={results}
            />
            <CapacityFactorChart
              projectId={spec.id}
              spec={spec}
              capacityFactorByYear={activeResult.capacityFactorByYear}
            />
            <ScenarioComparison
              results={results}
              spec={spec}
            />
            <PolicyAttribution
              attribution={activeResult.policyAttribution}
            />
            <PPABenchmarkOverlay
              benchmark={results.ppaBenchmark}
              breakevenLMP={activeResult.breakevenLMPPerMWh}
            />
            <SensitivityTornado
              entries={results.sensitivity}
              baseIRR={results.scenarios.base.irr}
            />
            <ExportFooter spec={spec} results={results} />
          </>
        )}
      </div>
    </div>
  );
}

// ─── Export footer ───────────────────────────────────────────────

function ExportFooter({
  spec,
  results,
}: {
  spec: ProjectSpec;
  results: UnderwritingResults;
}) {
  return (
    <ContainedCard padding={S.lg}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: S.lg,
        }}
      >
        <div style={{ flex: 1 }}>
          <div
            style={{
              fontFamily: F.mono,
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              color: C.electricBlueLight,
              marginBottom: 4,
            }}
          >
            UNDERWRITING MEMO
          </div>
          <div
            style={{
              fontFamily: F.sans,
              fontSize: 13,
              color: C.textSecondary,
              lineHeight: 1.6,
            }}
          >
            Export the full memo as a board-ready PDF — assumptions,
            scenario table, cashflows, PPA comparison, sensitivity
            tornado, methodology appendix. Review before sharing.
          </div>
        </div>
        <ExportUnderwritingMemoButton spec={spec} results={results} />
      </div>
      <div
        style={{
          marginTop: S.md,
          paddingTop: S.md,
          borderTop: `1px solid ${C.borderDefault}`,
          fontFamily: F.mono,
          fontSize: 10,
          color: C.textMuted,
          letterSpacing: '0.10em',
          textTransform: 'uppercase',
        }}
      >
        Methodology · {results.assumptions.notes.length} notes ·{' '}
        Forward LMP ${results.assumptions.meanForwardLMP.toFixed(2)}/MWh ·{' '}
        Lifetime CF {(results.assumptions.lifetimeAvgCF * 100).toFixed(1)}%
      </div>
      {/* explicit reference so the linter doesn't strip the {R} import */}
      <span style={{ display: 'none' }}>{R.md}</span>
    </ContainedCard>
  );
}
