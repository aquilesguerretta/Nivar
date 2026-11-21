// FORGE Wave 5 — Results hero: three headline numbers.
//
// IRR — Falcon Gold below target, Cyan at/above. NaN renders as "—".
// NPV — alertCritical if negative, textPrimary if positive.
// Breakeven LMP ($/MWh).
//
// Compact: lives at the top of the results panel above the chart trio.

import { C, F, S } from '@/design/tokens';
import { ContainedCard } from '@/components/terminal/ContainedCard';
import { HeroNumber } from '@/components/terminal/HeroNumber';
import { EditorialIdentity } from '@/components/terminal/EditorialIdentity';
import { UNDERWRITING_DEFAULTS } from '@/lib/mock/developer-mock';
import type {
  ProjectSpec,
  ScenarioResult,
} from '@/lib/underwriting/types';

interface Props {
  spec: ProjectSpec;
  result: ScenarioResult;
}

function formatUSD(v: number): string {
  if (!Number.isFinite(v)) return '—';
  const sign = v < 0 ? '−' : '';
  const abs = Math.abs(v);
  if (abs >= 1_000_000_000) return `${sign}$${(abs / 1_000_000_000).toFixed(2)}B`;
  if (abs >= 1_000_000) return `${sign}$${(abs / 1_000_000).toFixed(1)}M`;
  if (abs >= 1_000) return `${sign}$${(abs / 1_000).toFixed(0)}k`;
  return `${sign}$${abs.toFixed(0)}`;
}

export function ResultsHero({ spec, result }: Props) {
  const target = UNDERWRITING_DEFAULTS[spec.technology].targetIRR;
  const irrPct = Number.isFinite(result.irr) ? result.irr * 100 : Number.NaN;
  const irrColor = !Number.isFinite(result.irr)
    ? C.textMuted
    : result.irr < target
      ? C.falconGold
      : C.alertNormal;
  const npvColor =
    result.npvUSD >= 0 ? C.textPrimary : C.alertCritical;
  const irrVerdict = !Number.isFinite(result.irr)
    ? 'Equity stream never goes positive — project does not return capital under this scenario.'
    : result.irr < target
      ? `Below the ${(target * 100).toFixed(0)}% target IRR for ${spec.technology.toLowerCase()} projects.`
      : `At or above the ${(target * 100).toFixed(0)}% target IRR — financeable.`;

  return (
    <ContainedCard padding={S.lg}>
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
        UNDERWRITING RESULT · {result.scenario.toUpperCase()}
      </div>
      <EditorialIdentity size="section" marginBottom={S.lg}>
        {spec.name + '.'}
      </EditorialIdentity>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: S.lg,
          paddingTop: S.md,
          borderTop: `1px solid ${C.borderDefault}`,
        }}
      >
        <KpiCell label="EQUITY IRR">
          <HeroNumber
            value={Number.isFinite(irrPct) ? `${irrPct.toFixed(1)}%` : '—'}
            size={56}
            color={irrColor}
          />
        </KpiCell>
        <KpiCell label="EQUITY NPV">
          <HeroNumber
            value={formatUSD(result.npvUSD)}
            size={56}
            color={npvColor}
          />
        </KpiCell>
        <KpiCell label="BREAKEVEN LMP">
          <HeroNumber
            value={
              Number.isFinite(result.breakevenLMPPerMWh)
                ? `$${result.breakevenLMPPerMWh.toFixed(2)}`
                : '—'
            }
            unit="/MWh"
            size={56}
          />
        </KpiCell>
      </div>

      <div
        style={{
          marginTop: S.md,
          paddingTop: S.md,
          borderTop: `1px solid ${C.borderDefault}`,
          fontFamily: F.sans,
          fontSize: 13,
          lineHeight: 1.6,
          color: C.textSecondary,
        }}
      >
        {irrVerdict}{' '}
        Payback{' '}
        <span style={{ color: C.textPrimary, fontFamily: F.mono, fontWeight: 600 }}>
          {result.paybackYears === null
            ? 'never'
            : `${result.paybackYears.toFixed(1)} yr`}
        </span>
        .
      </div>
    </ContainedCard>
  );
}

function KpiCell({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div
        style={{
          fontFamily: F.mono,
          fontSize: 10,
          fontWeight: 500,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: C.textMuted,
          marginBottom: 6,
        }}
      >
        {label}
      </div>
      {children}
    </div>
  );
}
