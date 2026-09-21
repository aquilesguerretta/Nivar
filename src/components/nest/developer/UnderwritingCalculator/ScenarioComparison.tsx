// FORGE Wave 5 — Scenario comparison table.
//
// 3-column compact table: Base / Upside / Downside.
// Rows: IRR, NPV, Breakeven, Payback, PPA spread.

import { C, F, R, S } from '@/design/tokens';
import { ContainedCard } from '@/components/terminal/ContainedCard';
import type {
  ProjectSpec,
  ScenarioName,
  ScenarioResult,
  UnderwritingResults,
} from '@/lib/underwriting/types';

interface Props {
  spec: ProjectSpec;
  results: UnderwritingResults;
}

const SCENARIO_COLOR: Record<ScenarioName, string> = {
  base: C.electricBlue,
  upside: C.alertNormal,
  downside: C.alertCritical,
};

const SCENARIO_LABEL: Record<ScenarioName, string> = {
  base: 'BASE',
  upside: 'UPSIDE',
  downside: 'DOWNSIDE',
};

function formatUSD(v: number): string {
  if (!Number.isFinite(v)) return '—';
  const sign = v < 0 ? '−' : '';
  const abs = Math.abs(v);
  if (abs >= 1_000_000) return `${sign}$${(abs / 1_000_000).toFixed(1)}M`;
  if (abs >= 1_000) return `${sign}$${(abs / 1_000).toFixed(0)}k`;
  return `${sign}$${abs.toFixed(0)}`;
}

function formatIRR(v: number): string {
  if (!Number.isFinite(v)) return '—';
  return `${(v * 100).toFixed(1)}%`;
}

function formatPayback(years: number | null): string {
  if (years === null) return 'never';
  if (years > 99) return '>99 y';
  return `${years.toFixed(1)} y`;
}

function ppaSpread(result: ScenarioResult, ppaMedian: number): number {
  return Number.isFinite(result.breakevenLMPPerMWh)
    ? ppaMedian - result.breakevenLMPPerMWh
    : Number.NaN;
}

export function ScenarioComparison({ spec, results }: Props) {
  void spec;
  const ppaMedian = results.ppaBenchmark.median;
  const scenarios: ScenarioName[] = ['base', 'upside', 'downside'];

  const rows: Array<{
    label: string;
    cells: (s: ScenarioName) => { text: string; color?: string };
  }> = [
    {
      label: 'IRR',
      cells: (s) => {
        const r = results.scenarios[s];
        return {
          text: formatIRR(r.irr),
          color:
            !Number.isFinite(r.irr)
              ? C.textMuted
              : r.irr < 0.08
                ? C.alertCritical
                : r.irr < 0.12
                  ? C.falconGold
                  : C.alertNormal,
        };
      },
    },
    {
      label: 'NPV',
      cells: (s) => {
        const r = results.scenarios[s];
        return {
          text: formatUSD(r.npvUSD),
          color: r.npvUSD < 0 ? C.alertCritical : C.textPrimary,
        };
      },
    },
    {
      label: 'BREAKEVEN $/MWh',
      cells: (s) => {
        const r = results.scenarios[s];
        return {
          text: Number.isFinite(r.breakevenLMPPerMWh)
            ? `$${r.breakevenLMPPerMWh.toFixed(2)}`
            : '—',
          color: C.textPrimary,
        };
      },
    },
    {
      label: 'PAYBACK',
      cells: (s) => ({
        text: formatPayback(results.scenarios[s].paybackYears),
        color: C.textPrimary,
      }),
    },
    {
      label: 'PPA SPREAD $/MWh',
      cells: (s) => {
        const v = ppaSpread(results.scenarios[s], ppaMedian);
        return {
          text: Number.isFinite(v) ? `${v >= 0 ? '+' : '−'}$${Math.abs(v).toFixed(2)}` : '—',
          color: v >= 0 ? C.alertNormal : C.alertCritical,
        };
      },
    },
  ];

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
          marginBottom: S.md,
        }}
      >
        SCENARIO COMPARISON
      </div>

      {/* Header row */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '180px repeat(3, 1fr)',
          gap: S.md,
          padding: `${S.xs} ${S.sm}`,
          borderBottom: `1px solid ${C.borderDefault}`,
          fontFamily: F.mono,
          fontSize: 10,
          fontWeight: 600,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: C.textMuted,
        }}
      >
        <span>METRIC</span>
        {scenarios.map((s) => (
          <span
            key={s}
            style={{
              textAlign: 'right',
              color: SCENARIO_COLOR[s],
            }}
          >
            {SCENARIO_LABEL[s]}
          </span>
        ))}
      </div>

      {rows.map((row, idx) => (
        <div
          key={row.label}
          style={{
            display: 'grid',
            gridTemplateColumns: '180px repeat(3, 1fr)',
            gap: S.md,
            padding: `${S.sm}`,
            borderBottom:
              idx === rows.length - 1
                ? 'none'
                : `1px solid ${C.borderDefault}`,
            alignItems: 'baseline',
          }}
        >
          <span
            style={{
              fontFamily: F.mono,
              fontSize: 11,
              color: C.textSecondary,
              letterSpacing: '0.10em',
              textTransform: 'uppercase',
            }}
          >
            {row.label}
          </span>
          {scenarios.map((s) => {
            const cell = row.cells(s);
            return (
              <span
                key={s}
                style={{
                  fontFamily: F.mono,
                  fontSize: 14,
                  fontWeight: 600,
                  fontVariantNumeric: 'tabular-nums',
                  textAlign: 'right',
                  color: cell.color ?? C.textPrimary,
                }}
              >
                {cell.text}
              </span>
            );
          })}
        </div>
      ))}

      {/* PPA reference footnote */}
      <div
        style={{
          marginTop: S.sm,
          paddingTop: S.sm,
          borderTop: `1px solid ${C.borderDefault}`,
          fontFamily: F.mono,
          fontSize: 10,
          color: C.textMuted,
          letterSpacing: '0.10em',
        }}
      >
        PPA SPREAD vs MEDIAN ${ppaMedian.toFixed(2)}/MWh (
        {results.ppaBenchmark.sampleCount} deals,{' '}
        {results.ppaBenchmark.technology})
      </div>
      <span style={{ display: 'none' }}>{R.sm}</span>
    </ContainedCard>
  );
}
