// FORGE Wave 7 — Hypothetical-project library.
//
// Shows up to 5 hypothetical projects as project cards. Each card
// surfaces the projected IRR / NPV / breakeven from runUnderwriting
// plus, once the COD year has been reached, the realized snapshot
// from the ProjectPerformanceTracker.

import { useMemo } from 'react';
import { C, F, R, S } from '@/design/tokens';
import { ContainedCard } from '@/components/terminal/ContainedCard';
import { EditorialIdentity } from '@/components/terminal/EditorialIdentity';
import { useSandboxStore } from '@/lib/sandbox/positionState';
import type { HypotheticalProject } from '@/lib/sandbox/types';

interface Props {
  selectedProjectId: string | null;
  onSelect: (projectId: string) => void;
}

export function HypotheticalProjectLibrary({
  selectedProjectId,
  onSelect,
}: Props) {
  const projects = useSandboxStore((s) => s.projects);

  const sorted = useMemo(() => {
    return projects
      .slice()
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }, [projects]);

  if (sorted.length === 0) {
    return (
      <ContainedCard padding={S.xxl}>
        <div
          style={{
            textAlign: 'center',
            fontFamily: F.sans,
            fontSize: 14,
            color: C.textMuted,
            lineHeight: 1.6,
          }}
        >
          No projects yet. Underwrite your first hypothetical to start a portfolio.
        </div>
      </ContainedCard>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: S.sm }}>
      <div style={{ marginBottom: S.xs }}>
        <div
          style={{
            fontFamily: F.mono,
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: C.electricBlueLight,
            marginBottom: S.xs,
          }}
        >
          PROJECT PORTFOLIO · {sorted.length}
        </div>
        <EditorialIdentity size="section">What you've sketched.</EditorialIdentity>
      </div>

      {sorted.map((p) => (
        <ProjectCard
          key={p.id}
          project={p}
          isSelected={p.id === selectedProjectId}
          onSelect={() => onSelect(p.id)}
        />
      ))}
    </div>
  );
}

function ProjectCard({
  project,
  isSelected,
  onSelect,
}: {
  project: HypotheticalProject;
  isSelected: boolean;
  onSelect: () => void;
}) {
  const deleteProject = useSandboxStore((s) => s.deleteProject);

  const base = project.projection.scenarios.base;
  const irrPct = (base.irr * 100).toFixed(1);
  const npvMM = (base.npvUSD / 1_000_000).toFixed(1);
  const breakeven = base.breakevenLMPPerMWh;

  const isCodReached = new Date().getFullYear() >= project.codYear;
  const perf = project.performance;

  const borderColor = isSelected ? C.electricBlue : C.borderDefault;
  const irrColor =
    base.irr >= 0.12
      ? C.alertNormal
      : base.irr <= 0.06
        ? C.alertCritical
        : C.textPrimary;

  return (
    <div
      onClick={onSelect}
      style={{
        background: C.bgSurface,
        border: `1px solid ${borderColor}`,
        borderRadius: R.md,
        padding: S.md,
        display: 'flex',
        flexDirection: 'column',
        gap: S.sm,
        cursor: 'pointer',
        transition: 'border-color 150ms cubic-bezier(0.4, 0, 0.2, 1)',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: S.sm,
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <div
            style={{
              fontFamily: F.sans,
              fontSize: 15,
              fontWeight: 600,
              color: C.textPrimary,
              lineHeight: 1.3,
            }}
          >
            {project.name}
          </div>
          <div
            style={{
              fontFamily: F.mono,
              fontSize: 11,
              fontWeight: 500,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: C.textMuted,
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            {project.technology.toUpperCase()} · {project.capacityMW} MW ·{' '}
            {project.zone} · COD {project.codYear}
          </div>
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            deleteProject(project.id);
          }}
          style={{
            background: 'transparent',
            border: `1px solid ${C.borderDefault}`,
            borderRadius: R.sm,
            padding: '4px 8px',
            fontFamily: F.mono,
            fontSize: 9,
            fontWeight: 600,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: C.textMuted,
            cursor: 'pointer',
          }}
        >
          DELETE
        </button>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: S.md,
          paddingTop: S.sm,
          borderTop: `1px solid ${C.borderDefault}`,
        }}
      >
        <Metric
          label="PROJECTED IRR"
          value={`${irrPct}%`}
          color={irrColor}
        />
        <Metric
          label="NPV (BASE)"
          value={`${base.npvUSD >= 0 ? '+' : '−'}$${Math.abs(
            Number(npvMM),
          ).toFixed(1)}M`}
          color={base.npvUSD >= 0 ? C.textPrimary : C.alertCritical}
        />
        <Metric
          label="BREAKEVEN LMP"
          value={`$${breakeven.toFixed(0)}/MWh`}
        />
      </div>

      {/* Performance status strip */}
      <div
        style={{
          paddingTop: S.sm,
          borderTop: `1px solid ${C.borderDefault}`,
          display: 'flex',
          alignItems: 'center',
          gap: S.sm,
          fontFamily: F.mono,
          fontSize: 10,
          fontWeight: 600,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
        }}
      >
        {!isCodReached ? (
          <>
            <span
              style={{
                width: 4,
                height: 4,
                borderRadius: '50%',
                background: C.textMuted,
              }}
            />
            <span style={{ color: C.textMuted }}>
              PRE-COD · {project.codYear - new Date().getFullYear()} YR TO GO
            </span>
          </>
        ) : perf ? (
          <>
            <span
              style={{
                width: 4,
                height: 4,
                borderRadius: '50%',
                background:
                  perf.irrDelta >= 0 ? C.alertNormal : C.alertCritical,
              }}
            />
            <span
              style={{
                color: perf.irrDelta >= 0 ? C.alertNormal : C.alertCritical,
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              REALIZED · {perf.irrDelta >= 0 ? '+' : ''}
              {(perf.irrDelta * 100).toFixed(2)}pp VS UNDERWRITING
            </span>
          </>
        ) : (
          <>
            <span
              style={{
                width: 4,
                height: 4,
                borderRadius: '50%',
                background: C.electricBlueLight,
              }}
            />
            <span style={{ color: C.electricBlueLight }}>
              COD REACHED · TAP TO MARK PERFORMANCE
            </span>
          </>
        )}
      </div>
    </div>
  );
}

function Metric({
  label,
  value,
  color = C.textPrimary,
}: {
  label: string;
  value: string;
  color?: string;
}) {
  return (
    <div>
      <div
        style={{
          fontFamily: F.mono,
          fontSize: 9,
          fontWeight: 500,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: C.textMuted,
          marginBottom: 2,
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontFamily: F.mono,
          fontSize: 16,
          fontWeight: 600,
          fontVariantNumeric: 'tabular-nums',
          color,
        }}
      >
        {value}
      </div>
    </div>
  );
}
