// FORGE Wave 2 — Strategy Simulator main view.
// Three states: (1) no profile yet → render FacilityProfileForm;
// (2) profile set, no results → render the form (so the user can edit)
// + a CTA to run; (3) results in hand → render StrategyRanking +
// StrategyDetail in a 1fr/2fr grid.

import { useEffect, useMemo, useState } from 'react';
import { C, F, R, S } from '@/design/tokens';
import { ContainedCard } from '@/components/terminal/ContainedCard';
import { EditorialIdentity } from '@/components/terminal/EditorialIdentity';
import { Skeleton } from '@/components/terminal/Skeleton';
import { useSimulator } from '@/hooks/useSimulator';
import { useDAForecast } from '@/hooks/data/useDAForecast';
import { FacilityProfileForm } from './FacilityProfileForm';
import { StrategyRanking } from './StrategyRanking';
import { StrategyDetail } from './StrategyDetail';
import type { FacilityProfile } from '@/lib/types/simulator';

export function SimulatorView() {
  const {
    profile,
    results,
    isRunning,
    selectedStrategyId,
    selectedScenario,
    run,
    setProfile,
    selectStrategy,
    selectScenario,
    clear,
  } = useSimulator();

  // Pull the DA hourly forecast for the active facility's zone. When
  // the response lands, run() picks up the 24-hour array via the
  // `hourlyLMP` override. Engine falls back to tariff when absent.
  const daForecast = useDAForecast(profile?.zone ?? null);
  const liveHourlyLMP: number[] | undefined =
    daForecast.data && daForecast.data.length === 24
      ? daForecast.data.map((p) => p.lmp)
      : undefined;

  const [editing, setEditing] = useState(false);

  // After the user submits the form, immediately run the simulation
  // with whatever live LMP we have on hand (or fall back).
  function handleProfileSubmit(p: FacilityProfile) {
    setProfile(p);
    setEditing(false);
    setTimeout(() => run(liveHourlyLMP), 0);
  }

  // Auto-select top result when results land.
  const selectedResult = useMemo(() => {
    if (!results || results.length === 0) return null;
    if (selectedStrategyId) {
      return (
        results.find((r) => r.strategy.id === selectedStrategyId) ??
        results[0]
      );
    }
    return results[0];
  }, [results, selectedStrategyId]);

  // First-load: if a profile is persisted but no results, prompt to run.
  useEffect(() => {
    if (profile && !results && !isRunning) {
      // Don't auto-run on mount — let the user click "Run Simulation"
      // so we don't surprise them with a long synchronous tick.
    }
  }, [profile, results, isRunning]);

  return (
    <div
      style={{
        position: 'relative',
        zIndex: 1,
        padding: S.xl,
        display: 'flex',
        flexDirection: 'column',
        gap: S.lg,
      }}
    >
      {/* Header */}
      <div>
        <div
          style={{
            fontFamily: F.mono,
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: C.electricBlue,
            marginBottom: S.xs,
          }}
        >
          04 · INDUSTRIAL · STRATEGY SIMULATOR
        </div>
        <EditorialIdentity size="hero">
          What's the optimal energy strategy for your facility?
        </EditorialIdentity>
      </div>

      {/* No profile yet — full-width form */}
      {!profile && (
        <FacilityProfileForm onSubmit={handleProfileSubmit} />
      )}

      {/* Profile set, user clicked EDIT PROFILE — re-render form pre-filled */}
      {profile && editing && (
        <FacilityProfileForm
          initial={profile}
          onSubmit={handleProfileSubmit}
        />
      )}

      {/* Profile set, no results, not editing — CTA */}
      {profile && !results && !isRunning && !editing && (
        <ContainedCard padding={S.xl}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: S.md,
              alignItems: 'flex-start',
            }}
          >
            <div
              style={{
                fontFamily: F.mono,
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
                color: C.electricBlueLight,
              }}
            >
              READY TO RUN
            </div>
            <EditorialIdentity size="section">
              {profile.name + '.'}
            </EditorialIdentity>
            <div
              style={{
                fontFamily: F.sans,
                fontSize: 14,
                color: C.textSecondary,
                lineHeight: 1.6,
              }}
            >
              {profile.zone} · {profile.annualBaselineMWh.toLocaleString()}{' '}
              MWh/yr · capital budget $
              {(profile.capitalBudgetUSD / 1_000_000).toFixed(1)}M
            </div>
            <button
              type="button"
              onClick={() => run(liveHourlyLMP)}
              style={{
                background: C.electricBlue,
                border: 'none',
                borderRadius: R.md,
                padding: `0 ${S.xl}`,
                height: 44,
                fontFamily: F.mono,
                fontSize: 12,
                fontWeight: 600,
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
                color: C.textPrimary,
                cursor: 'pointer',
              }}
            >
              RUN SIMULATION →
            </button>
          </div>
        </ContainedCard>
      )}

      {/* Running — CHROMA Wave 4 loading affordance: status line + a
          short stack of Skeleton.Block stand-ins for the result panel
          that's about to land. Pulsing dot signals "active work". */}
      {isRunning && (
        <ContainedCard padding={S.xl}>
          <div
            style={{
              display:    'flex',
              alignItems: 'center',
              gap:        S.md,
              marginBottom: S.lg,
            }}
          >
            <span
              aria-hidden
              style={{
                width:        8,
                height:       8,
                borderRadius: '50%',
                background:   C.electricBlue,
                animation:    'ga-connection-reconnect 1.2s ease-in-out infinite',
                flexShrink:   0,
              }}
            />
            <div
              style={{
                fontFamily: F.mono,
                fontSize: 13,
                color: C.electricBlueLight,
                letterSpacing: '0.10em',
                textTransform: 'uppercase',
              }}
            >
              Running 8,760-hour dispatch simulation across 11 strategies × 3
              scenarios…
            </div>
          </div>
          {/* Result-panel scaffold: a hero line + a chart-shaped block */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: S.md }}>
            <Skeleton.Line width="60%" height={20} label="Loading strategy ranking" />
            <Skeleton.Chart height={180} gridLines={3} label="Loading dispatch chart" />
          </div>
        </ContainedCard>
      )}

      {/* Results */}
      {profile && results && !isRunning && (
        <>
          {/* Toolbar — re-edit profile / clear */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: S.md,
            }}
          >
            <span
              style={{
                fontFamily: F.mono,
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: C.textSecondary,
              }}
            >
              {profile.name}
            </span>
            <span
              style={{
                fontFamily: F.mono,
                fontSize: 11,
                color: C.textMuted,
                letterSpacing: '0.10em',
              }}
            >
              · {results.length}{' '}
              {results.length === 1 ? 'STRATEGY' : 'STRATEGIES'} EVALUATED
            </span>

            <span style={{ marginLeft: 'auto', display: 'flex', gap: S.sm }}>
              <button
                type="button"
                onClick={() => setEditing(true)}
                style={toolbarBtnStyle()}
              >
                EDIT PROFILE
              </button>
              <button
                type="button"
                onClick={() => run(liveHourlyLMP)}
                style={toolbarBtnStyle()}
              >
                RE-RUN
              </button>
              <button
                type="button"
                onClick={clear}
                style={toolbarBtnStyle(C.alertCritical)}
              >
                CLEAR
              </button>
            </span>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 2fr',
              gap: S.lg,
              alignItems: 'start',
            }}
          >
            <StrategyRanking
              results={results}
              selectedId={selectedStrategyId}
              onSelect={selectStrategy}
            />
            {selectedResult && (
              <StrategyDetail
                result={selectedResult}
                profile={profile}
                scenario={selectedScenario}
                onScenarioChange={selectScenario}
              />
            )}
          </div>
        </>
      )}
    </div>
  );
}

function toolbarBtnStyle(color?: string): React.CSSProperties {
  return {
    background: 'transparent',
    border: `1px solid ${color ?? C.borderDefault}`,
    borderRadius: R.sm,
    padding: '6px 10px',
    fontFamily: F.mono,
    fontSize: 11,
    fontWeight: 600,
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    color: color ?? C.textSecondary,
    cursor: 'pointer',
  };
}
