// FORGE Wave 7 — Project performance tracker.
//
// Once a hypothetical project's COD year has been reached, the
// tracker marks the projection against realized LMP. V1 samples the
// most recent 168 hours (the upstream cap on `/api/lmp/history`) and
// uses that mean as the year's realized average — a defensible proxy
// for educational use, called out explicitly in the UI as
// "trailing-7-day proxy".
//
// Shows: projected vs realized revenue, projected vs realized mean
// LMP, IRR delta. Records the snapshot back into the sandbox store
// so HypotheticalProjectLibrary's status strip flips green/red.

import { useEffect, useMemo } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { C, F, R, S } from '@/design/tokens';
import { ContainedCard } from '@/components/terminal/ContainedCard';
import { EditorialIdentity } from '@/components/terminal/EditorialIdentity';
import { useLMPHistory } from '@/hooks/data/useLMPHistory';
import { useSandboxStore } from '@/lib/sandbox/positionState';
import type {
  HypotheticalProject,
  ProjectPerformanceSnapshot,
} from '@/lib/sandbox/types';

const HOURS_PER_YEAR = 8760;
const SAMPLE_DAYS = 7;

interface Props {
  project: HypotheticalProject;
}

function trailingWindow(days: number): { start: string; end: string } {
  const end = new Date();
  const start = new Date(end.getTime() - days * 24 * 3600 * 1000);
  return { start: start.toISOString(), end: end.toISOString() };
}

export function ProjectPerformanceTracker({ project }: Props) {
  const recordPerformance = useSandboxStore((s) => s.recordProjectPerformance);

  const currentYear = new Date().getFullYear();
  const isCodReached = currentYear >= project.codYear;

  const { start, end } = useMemo(() => trailingWindow(SAMPLE_DAYS), []);
  const history = useLMPHistory({
    zone: isCodReached ? project.zone : null,
    start: isCodReached ? start : null,
    end: isCodReached ? end : null,
    interval: 'hourly',
  });

  // Pull year-1 from the base projection. (Underwriting indexes year
  // arrays from 1, with year 0 being the equity contribution row.)
  const projectionYear1 = useMemo(() => {
    const base = project.projection.scenarios.base;
    return base.cashflows.find((c) => c.year === 1) ?? null;
  }, [project]);

  const projectedMeanLMP = useMemo(() => {
    if (!projectionYear1) return 0;
    const generation =
      project.capacityMW * projectionYear1.capacityFactor * HOURS_PER_YEAR;
    if (generation === 0) return 0;
    return projectionYear1.revenueUSD / generation;
  }, [projectionYear1, project.capacityMW]);

  const realizedMeanLMP = useMemo(() => {
    const points = history.data ?? [];
    if (points.length === 0) return null;
    const sum = points.reduce((s, p) => s + p.lmp_total, 0);
    return sum / points.length;
  }, [history.data]);

  const snapshot: ProjectPerformanceSnapshot | null = useMemo(() => {
    if (!isCodReached || !projectionYear1 || realizedMeanLMP === null) {
      return null;
    }
    const projectedRevenue = projectionYear1.revenueUSD;
    const generation =
      project.capacityMW * projectionYear1.capacityFactor * HOURS_PER_YEAR;
    const realizedRevenue = generation * realizedMeanLMP;
    // Approximate IRR delta: revenue change as fraction of equity
    // contribution → first-order IRR sensitivity. Not exact but
    // pedagogically correct (positive realized → IRR up).
    const equity = project.projection.assumptions.equityCapexUSD;
    const irrDelta =
      equity > 0
        ? (realizedRevenue - projectedRevenue) / equity / project.projection.spec.economicLifeYears
        : 0;
    return {
      forCalendarYear: currentYear,
      projectedRevenueUSD: projectedRevenue,
      realizedRevenueUSD: realizedRevenue,
      realizedMeanLMP,
      projectedMeanLMP,
      irrDelta,
      computedAt: new Date().toISOString(),
    };
  }, [
    isCodReached,
    projectionYear1,
    realizedMeanLMP,
    projectedMeanLMP,
    currentYear,
    project,
  ]);

  // Persist snapshot when we have one.
  useEffect(() => {
    if (snapshot) recordPerformance(project.id, snapshot);
  }, [snapshot, recordPerformance, project.id]);

  return (
    <ContainedCard padding={S.lg}>
      <div style={{ marginBottom: S.md }}>
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
          PERFORMANCE · {project.name}
        </div>
        <EditorialIdentity size="section">Projected versus realized.</EditorialIdentity>
      </div>

      {!isCodReached ? (
        <PreCodBlock project={project} />
      ) : history.isLoading ? (
        <LoadingBlock />
      ) : snapshot ? (
        <SnapshotBlock snapshot={snapshot} project={project} />
      ) : (
        <NoDataBlock />
      )}
    </ContainedCard>
  );
}

// ─── States ─────────────────────────────────────────────────────

function PreCodBlock({ project }: { project: HypotheticalProject }) {
  const years = project.codYear - new Date().getFullYear();
  return (
    <div
      style={{
        padding: S.xl,
        textAlign: 'center',
        fontFamily: F.sans,
        fontSize: 13,
        color: C.textMuted,
        lineHeight: 1.6,
      }}
    >
      Pre-COD. Performance tracking unlocks in{' '}
      <span style={{ color: C.electricBlueLight, fontFamily: F.mono }}>
        {years} year{years === 1 ? '' : 's'}
      </span>{' '}
      ({project.codYear}).
    </div>
  );
}

function LoadingBlock() {
  return (
    <div
      style={{
        padding: S.xl,
        textAlign: 'center',
        fontFamily: F.mono,
        fontSize: 12,
        color: C.textMuted,
        letterSpacing: '0.10em',
      }}
    >
      LOADING REALIZED LMP…
    </div>
  );
}

function NoDataBlock() {
  return (
    <div
      style={{
        padding: S.xl,
        textAlign: 'center',
        fontFamily: F.sans,
        fontSize: 13,
        color: C.textMuted,
        lineHeight: 1.6,
      }}
    >
      No realized LMP data available for this zone yet. Try again later or
      switch to a zone with more history.
    </div>
  );
}

function SnapshotBlock({
  snapshot,
  project,
}: {
  snapshot: ProjectPerformanceSnapshot;
  project: HypotheticalProject;
}) {
  const irrColor =
    snapshot.irrDelta >= 0 ? C.alertNormal : C.alertCritical;

  const revenueData = [
    {
      label: 'PROJECTED',
      value: Math.round(snapshot.projectedRevenueUSD / 1_000_000),
      color: C.electricBlueLight,
    },
    {
      label: 'REALIZED',
      value: Math.round(snapshot.realizedRevenueUSD / 1_000_000),
      color: snapshot.realizedRevenueUSD >= snapshot.projectedRevenueUSD
        ? C.alertNormal
        : C.alertCritical,
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: S.lg }}>
      {/* Headline row */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: S.md,
        }}
      >
        <Stat
          label="REALIZED LMP"
          value={`$${snapshot.realizedMeanLMP.toFixed(2)}`}
          unit="/MWh"
          sub={`PROJECTED $${snapshot.projectedMeanLMP.toFixed(2)}`}
        />
        <Stat
          label="REALIZED REVENUE"
          value={`$${(snapshot.realizedRevenueUSD / 1_000_000).toFixed(2)}M`}
          sub={`PROJECTED $${(snapshot.projectedRevenueUSD / 1_000_000).toFixed(2)}M`}
        />
        <Stat
          data-hero
          label="IRR DELTA"
          value={`${snapshot.irrDelta >= 0 ? '+' : ''}${(snapshot.irrDelta * 100).toFixed(2)}pp`}
          color={irrColor}
          sub="VS UNDERWRITING"
          isHero
        />
      </div>

      {/* Side-by-side revenue bars */}
      <div style={{ width: '100%', height: 220 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={revenueData}
            margin={{ top: 20, right: 18, bottom: 12, left: 12 }}
          >
            <CartesianGrid
              stroke={C.borderDefault}
              strokeDasharray="3 4"
              vertical={false}
            />
            <XAxis
              dataKey="label"
              tick={{
                fill: C.textMuted,
                fontFamily: F.mono,
                fontSize: 10,
                letterSpacing: '0.12em',
              }}
              stroke={C.borderDefault}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              tick={{
                fill: C.textMuted,
                fontFamily: F.mono,
                fontSize: 10,
              }}
              tickFormatter={(v) => `$${v}M`}
              stroke={C.borderDefault}
              tickLine={false}
              axisLine={false}
              width={60}
            />
            <Tooltip
              cursor={{ fill: 'rgba(59,130,246,0.05)' }}
              contentStyle={{
                background: C.bgElevated,
                border: `1px solid ${C.borderStrong}`,
                borderRadius: 4,
                fontFamily: F.mono,
                fontSize: 11,
                color: C.textPrimary,
              }}
              formatter={(value) =>
                value != null ? [`$${Number(value)}M`, 'revenue'] : ['—', 'revenue']
              }
            />
            <Legend
              wrapperStyle={{
                fontFamily: F.mono,
                fontSize: 10,
                letterSpacing: '0.10em',
                color: C.textMuted,
              }}
            />
            <Bar dataKey="value" name="Annual revenue (Year 1)" isAnimationActive={false}>
              {revenueData.map((d) => (
                <Cell key={d.label} fill={d.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Methodology line */}
      <div
        style={{
          paddingTop: S.sm,
          borderTop: `1px solid ${C.borderDefault}`,
          fontFamily: F.mono,
          fontSize: 10,
          fontWeight: 500,
          letterSpacing: '0.10em',
          textTransform: 'uppercase',
          color: C.textMuted,
          lineHeight: 1.5,
        }}
      >
        SOURCE · {SAMPLE_DAYS}-DAY TRAILING LMP MEAN FROM /api/lmp/history ·{' '}
        PROJECT {project.technology.toUpperCase()} {project.capacityMW} MW @ {project.zone}
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  unit,
  sub,
  color = C.textPrimary,
  isHero = false,
}: {
  label: string;
  value: string;
  unit?: string;
  sub?: string;
  color?: string;
  isHero?: boolean;
}) {
  return (
    <div
      data-hero={isHero ? 'true' : undefined}
      style={{
        background: C.bgSurface,
        border: `1px solid ${isHero ? C.electricBlue : C.borderDefault}`,
        borderRadius: R.md,
        padding: S.md,
      }}
    >
      <div
        style={{
          fontFamily: F.mono,
          fontSize: 10,
          fontWeight: 500,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: C.textMuted,
          marginBottom: 4,
        }}
      >
        {label}
      </div>
      <div
        style={{
          display: 'flex',
          alignItems: 'baseline',
          gap: 6,
          fontFamily: F.mono,
          fontSize: 22,
          fontWeight: 700,
          fontVariantNumeric: 'tabular-nums',
          color,
        }}
      >
        <span>{value}</span>
        {unit && (
          <span
            style={{
              fontSize: 12,
              fontWeight: 500,
              letterSpacing: '0.06em',
              color: C.textMuted,
            }}
          >
            {unit}
          </span>
        )}
      </div>
      {sub && (
        <div
          style={{
            marginTop: 2,
            fontFamily: F.mono,
            fontSize: 10,
            fontWeight: 500,
            letterSpacing: '0.10em',
            color: C.textMuted,
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          {sub}
        </div>
      )}
    </div>
  );
}
