// FORGE Wave 5 — Scenario toggles strip.
//
// Three-button row that selects which scenario the rest of the
// calculator displays: BASE / UPSIDE / DOWNSIDE. Lives at the top of
// the results panel, sticky behavior is the parent's responsibility.
//
// Visual: chips per terminal-color.md — no pills. Active state uses
// the scenario's accent color (base = electricBlue, upside = alertNormal,
// downside = alertCritical) so the user always knows which scenario's
// numbers they're looking at.

import { C, F, R, S } from '@/design/tokens';
import type { ScenarioName } from '@/lib/underwriting/types';

interface Props {
  active: ScenarioName;
  onChange: (next: ScenarioName) => void;
}

const SCENARIO_LABELS: Record<ScenarioName, string> = {
  base: 'BASE',
  upside: 'UPSIDE',
  downside: 'DOWNSIDE',
};

const SCENARIO_COLOR: Record<ScenarioName, string> = {
  base: C.electricBlue,
  upside: C.alertNormal,
  downside: C.alertCritical,
};

const SCENARIO_DESCRIPTION: Record<ScenarioName, string> = {
  base: 'Forward LMP from history × 2.5%/yr escalation',
  upside: 'LMP +20%, CF +2pp, capex −8%',
  downside: 'LMP −25%, CF −3pp, capex +8%, policy expiry',
};

export function ScenarioToggles({ active, onChange }: Props) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: S.sm }}>
      <div
        style={{
          fontFamily: F.mono,
          fontSize: 10,
          fontWeight: 500,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: C.textMuted,
        }}
      >
        SCENARIO
      </div>
      <div style={{ display: 'flex', gap: S.sm }}>
        {(Object.keys(SCENARIO_LABELS) as ScenarioName[]).map((s) => {
          const isActive = s === active;
          const color = SCENARIO_COLOR[s];
          return (
            <button
              key={s}
              type="button"
              onClick={() => onChange(s)}
              style={{
                background: isActive ? `${color}22` : 'transparent',
                border: `1px solid ${isActive ? color : C.borderDefault}`,
                borderRadius: R.sm,
                padding: `6px ${S.md}`,
                fontFamily: F.mono,
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: isActive ? color : C.textSecondary,
                cursor: 'pointer',
                transition: 'all 150ms cubic-bezier(0.4, 0, 0.2, 1)',
              }}
            >
              {SCENARIO_LABELS[s]}
            </button>
          );
        })}
      </div>
      <div
        style={{
          fontFamily: F.mono,
          fontSize: 11,
          color: C.textMuted,
          letterSpacing: '0.06em',
        }}
      >
        {SCENARIO_DESCRIPTION[active]}
      </div>
    </div>
  );
}
