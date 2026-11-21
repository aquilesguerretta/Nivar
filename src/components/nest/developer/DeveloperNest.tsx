import { useState } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { C, F, R, S } from '@/design/tokens';
import { ContainedCard } from '@/components/terminal/ContainedCard';
import { EditorialIdentity } from '@/components/terminal/EditorialIdentity';
import { FlowSection } from '@/components/terminal/FlowSection';
import { HeroNumber } from '@/components/terminal/HeroNumber';
import { PageAtmosphere } from '@/components/terminal/PageAtmosphere';
import { AnnotatableChart } from '@/components/shared/AnnotatableChart';
import {
  PROJECT_PIPELINE,
  ZONE_REVENUE_HISTORY_24M,
  INTERCONNECTION_QUEUE,
  BINDING_CONSTRAINTS_12M,
  PPA_BENCHMARKS,
  POLICY_TRACKER,
  UNDERWRITING_DEFAULTS,
} from '@/lib/mock/developer-mock';
import { CalculatorView } from './UnderwritingCalculator/CalculatorView';
import { setUnderwritingState } from '@/services/contextProviders/developerNestContext';
import type { ProjectSpec } from '@/lib/underwriting/types';

type DeveloperTab = 'overview' | 'underwriting';

// FORGE Wave 5 — seed the Underwriting Calculator from the first
// project in PROJECT_PIPELINE so the form is pre-filled when the user
// switches to the Underwriting tab for the first time.
function seedUnderwritingSpec(): ProjectSpec {
  const project = PROJECT_PIPELINE[0];
  const defaults = UNDERWRITING_DEFAULTS[project.technology];
  const zoneFromName = ['WEST_HUB', 'PSEG', 'JCPL', 'BGE', 'DOMINION', 'COMED', 'AEP', 'RECO'].find(
    (z) => project.name.toUpperCase().includes(z),
  ) ?? 'WEST_HUB';
  const codYear = Number(project.expectedCod.slice(0, 4));
  return {
    id: project.id,
    name: project.name,
    technology: project.technology,
    capacityMW: project.mw,
    zone: zoneFromName,
    codYear: Number.isFinite(codYear) ? codYear : 2028,
    economicLifeYears: defaults.economicLifeYears,
    capexPerMW: defaults.capexPerMW,
    opexPerMWYear: defaults.opexPerMWYear,
    debtRatio: defaults.debtRatio,
    debtTenor: defaults.debtTenor,
    debtRate: defaults.debtRate,
    taxRate: 0.21,
    discountRate: defaults.discountRate,
    itcEligible: true,
    ptcEligible: project.technology === 'Wind' || project.technology === 'Hybrid',
  };
}
import type {
  DeveloperProject,
  DeveloperTechnology,
  PolicyTrackerItem,
} from '@/lib/mock/developer-mock';

const TECH_COLOR: Record<DeveloperTechnology, string> = {
  BESS: C.electricBlue,
  Solar: C.falconGold,
  Wind: C.alertNormal,
  Hybrid: C.alertDiagnostic,
};

const POLICY_IMPACT_COLOR: Record<PolicyTrackerItem['impact'], string> = {
  positive: C.alertNormal,
  neutral: C.textMuted,
  negative: C.alertCritical,
};

// ─── HERO BLOCK + PIPELINE STRIP ─────────────────────────────────
function DeveloperHeroBlock() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: S.lg }}>
      <div style={{
        fontFamily: F.mono,
        fontSize: 11,
        fontWeight: 600,
        letterSpacing: '0.18em',
        textTransform: 'uppercase',
        color: C.electricBlue,
      }}>
        PROJECT PIPELINE · {PROJECT_PIPELINE.length} ACTIVE
      </div>
      <EditorialIdentity size="hero">What you're building.</EditorialIdentity>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: S.sm,
          marginTop: S.md,
        }}
      >
        {PROJECT_PIPELINE.map((p) => (
          <ProjectCard key={p.id} project={p} />
        ))}
      </div>
    </div>
  );
}

function ProjectCard({ project }: { project: DeveloperProject }) {
  return (
    <ContainedCard minHeight={220}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: S.sm, height: '100%' }}>
        {/* Name */}
        <div style={{ fontFamily: F.sans, fontSize: 14, fontWeight: 600, color: C.textPrimary, lineHeight: 1.3 }}>
          {project.name}
        </div>

        {/* MW + tech badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: S.sm }}>
          <span style={{
            fontFamily: F.mono,
            fontSize: 12,
            fontWeight: 600,
            color: C.textPrimary,
            fontVariantNumeric: 'tabular-nums',
          }}>
            {project.mw} MW
          </span>
          <TechBadge technology={project.technology} />
        </div>

        {/* Stage label */}
        <div style={{
          fontFamily: F.mono,
          fontSize: 10,
          fontWeight: 600,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: C.textMuted,
        }}>
          {project.stage}
        </div>

        {/* IRR (gold) */}
        <div style={{ marginTop: 'auto' }}>
          <HeroNumber
            value={`${(project.forecastedIrr * 100).toFixed(1)}%`}
            size={56}
            color={C.falconGold}
          />
          <div style={{
            fontFamily: F.mono,
            fontSize: 10,
            fontWeight: 600,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: C.textMuted,
            marginTop: 2,
          }}>
            FORECAST IRR · COD {project.expectedCod.slice(0, 7)}
          </div>
        </div>
      </div>
    </ContainedCard>
  );
}

function TechBadge({ technology }: { technology: DeveloperTechnology }) {
  const color = TECH_COLOR[technology];
  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      paddingInline: 6,
      height: 18,
      fontFamily: F.mono,
      fontSize: 9,
      fontWeight: 600,
      letterSpacing: '0.10em',
      textTransform: 'uppercase',
      color,
      background: `${color}1A`,
      border: `1px solid ${color}66`,
      borderRadius: R.sm,
    }}>
      {technology}
    </span>
  );
}

// ─── ZONE REVENUE 24M ────────────────────────────────────────────
function ZoneRevenueCard() {
  const data = ZONE_REVENUE_HISTORY_24M.map((m) => ({
    month: m.month,
    cumulative: m.cumulativeRevenue / 1_000_000,
    cycles: m.cycles,
  }));
  const lastTotal = ZONE_REVENUE_HISTORY_24M[ZONE_REVENUE_HISTORY_24M.length - 1].cumulativeRevenue;
  const totalCycles = ZONE_REVENUE_HISTORY_24M[ZONE_REVENUE_HISTORY_24M.length - 1].cycles;
  const avgCyclesPerDay = (totalCycles / (24 * 30)).toFixed(2);

  return (
    <ContainedCard minHeight={360}>
      <SectionHeader eyebrow="ZONE REVENUE SIMULATION · 4-HR BATTERY" identity="What this zone would have earned." />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 200px', gap: S.lg, marginTop: S.md }}>
        {/* Chart */}
        <div style={{ height: 220 }}>
          <AnnotatableChart chartId="developer:zone-revenue-24m">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 4, right: 8, bottom: 4, left: -4 }}>
              <CartesianGrid stroke={C.borderDefault} strokeDasharray="2 4" vertical={false} />
              <XAxis
                dataKey="month"
                tick={{ fontFamily: F.mono, fontSize: 10, fill: C.textMuted }}
                tickLine={false}
                axisLine={{ stroke: C.borderDefault }}
                tickFormatter={(v: number) => `M${v}`}
              />
              <YAxis
                tick={{ fontFamily: F.mono, fontSize: 10, fill: C.textMuted }}
                tickLine={false}
                axisLine={{ stroke: C.borderDefault }}
                width={48}
                tickFormatter={(v: number) => `$${v.toFixed(0)}M`}
              />
              <Tooltip
                contentStyle={{
                  background: C.bgSurface,
                  border: `1px solid ${C.borderDefault}`,
                  borderRadius: R.md,
                  fontFamily: F.mono,
                  fontSize: 11,
                  color: C.textPrimary,
                }}
                labelStyle={{ color: C.textMuted }}
                formatter={(v) => v != null ? [`$${Number(v).toFixed(2)}M`, 'Cumulative'] : ['—', '—']}
              />
              <Line type="monotone" dataKey="cumulative" stroke={C.electricBlue} strokeWidth={1.75} dot={false} />
            </LineChart>
          </ResponsiveContainer>
          </AnnotatableChart>
        </div>

        {/* Inputs (visual only, non-functional) */}
        <ZoneRevenueInputs />
      </div>

      {/* KPIs */}
      <div style={{
        display: 'flex',
        gap: S.lg,
        marginTop: S.lg,
        paddingTop: S.md,
        borderTop: `1px solid ${C.borderDefault}`,
        flexWrap: 'wrap',
      }}>
        <KpiCell label="TOTAL REVENUE" value={`$${(lastTotal / 1_000_000).toFixed(1)}M`} />
        <KpiCell label="AVG CYCLES/DAY" value={avgCyclesPerDay} />
        <KpiCell label="BEST MONTH" value="JAN 2024" />
        <KpiCell label="WORST MONTH" value="OCT 2024" />
      </div>
    </ContainedCard>
  );
}

function KpiCell({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <span style={{
        fontFamily: F.mono,
        fontSize: 10,
        fontWeight: 600,
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        color: C.textMuted,
      }}>
        {label}
      </span>
      <span style={{
        fontFamily: F.mono,
        fontSize: 14,
        fontWeight: 600,
        color: C.textPrimary,
        fontVariantNumeric: 'tabular-nums',
      }}>
        {value}
      </span>
    </div>
  );
}

function ZoneRevenueInputs() {
  const [zone, setZone] = useState('PSEG');
  const [duration, setDuration] = useState<'2H' | '4H' | '6H' | '8H'>('4H');
  const [capacity, setCapacity] = useState('100');
  const [efficiency, setEfficiency] = useState(87);

  const inputLabelStyle: React.CSSProperties = {
    fontFamily: F.mono,
    fontSize: 10,
    fontWeight: 600,
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    color: C.textMuted,
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: S.md }}>
      {/* Zone selector */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: S.xs }}>
        <span style={inputLabelStyle}>ZONE</span>
        <select
          value={zone}
          onChange={(e) => setZone(e.target.value)}
          style={{
            height: 32,
            background: C.bgSurface,
            color: C.textPrimary,
            border: `1px solid ${C.borderDefault}`,
            borderRadius: R.md,
            paddingInline: S.sm,
            fontFamily: F.mono,
            fontSize: 12,
            cursor: 'pointer',
          }}
        >
          {['PSEG', 'WEST_HUB', 'AEP', 'COMED', 'RECO', 'DOMINION'].map((z) => (
            <option key={z} value={z}>{z}</option>
          ))}
        </select>
      </div>

      {/* Duration chips */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: S.xs }}>
        <span style={inputLabelStyle}>DURATION</span>
        <div style={{ display: 'flex', gap: S.xs }}>
          {(['2H', '4H', '6H', '8H'] as const).map((d) => {
            const active = d === duration;
            return (
              <button
                key={d}
                onClick={() => setDuration(d)}
                style={{
                  flex: 1,
                  height: 28,
                  background: 'transparent',
                  color: active ? C.electricBlue : C.textSecondary,
                  border: `1px solid ${active ? C.electricBlue : C.borderDefault}`,
                  borderRadius: R.md,
                  fontFamily: F.mono,
                  fontSize: 10,
                  fontWeight: 600,
                  letterSpacing: '0.10em',
                  cursor: 'pointer',
                  transition: 'border-color 150ms cubic-bezier(0.4, 0, 0.2, 1), color 150ms cubic-bezier(0.4, 0, 0.2, 1)',
                }}
              >
                {d}
              </button>
            );
          })}
        </div>
      </div>

      {/* Capacity */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: S.xs }}>
        <span style={inputLabelStyle}>CAPACITY (MW)</span>
        <input
          type="text"
          value={capacity}
          onChange={(e) => setCapacity(e.target.value)}
          style={{
            height: 32,
            background: C.bgSurface,
            color: C.textPrimary,
            border: `1px solid ${C.borderDefault}`,
            borderRadius: R.md,
            paddingInline: S.sm,
            fontFamily: F.mono,
            fontSize: 12,
            outline: 'none',
          }}
        />
      </div>

      {/* Efficiency slider */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: S.xs }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={inputLabelStyle}>ROUND-TRIP η</span>
          <span style={{ fontFamily: F.mono, fontSize: 11, color: C.textPrimary, fontVariantNumeric: 'tabular-nums' }}>
            {efficiency}%
          </span>
        </div>
        <input
          type="range"
          min={70}
          max={95}
          value={efficiency}
          onChange={(e) => setEfficiency(Number(e.target.value))}
          style={{ width: '100%', accentColor: C.electricBlue }}
        />
      </div>
    </div>
  );
}

// ─── CONGESTION PATTERN ──────────────────────────────────────────
function CongestionPatternCard() {
  const data = BINDING_CONSTRAINTS_12M.map((b) => ({
    name: b.name.length > 26 ? b.name.slice(0, 24) + '…' : b.name,
    frequency: b.frequencyPct,
    rent: b.avgCongestionRent,
  }));
  return (
    <ContainedCard minHeight={240}>
      <SectionHeader eyebrow="CONSTRAINT FREQUENCY · PSEG · 12 MONTHS" identity="Where the bottlenecks are." />
      <div style={{ height: 160, marginTop: S.md }}>
        <AnnotatableChart chartId="developer:binding-constraints-12mo">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ top: 4, right: 24, bottom: 4, left: 8 }}>
            <CartesianGrid stroke={C.borderDefault} strokeDasharray="2 4" horizontal={false} />
            <XAxis
              type="number"
              tick={{ fontFamily: F.mono, fontSize: 10, fill: C.textMuted }}
              tickLine={false}
              axisLine={{ stroke: C.borderDefault }}
              tickFormatter={(v: number) => `${v}%`}
            />
            <YAxis
              type="category"
              dataKey="name"
              tick={{ fontFamily: F.mono, fontSize: 10, fill: C.textSecondary }}
              tickLine={false}
              axisLine={false}
              width={180}
            />
            <Tooltip
              contentStyle={{
                background: C.bgSurface,
                border: `1px solid ${C.borderDefault}`,
                borderRadius: R.md,
                fontFamily: F.mono,
                fontSize: 11,
                color: C.textPrimary,
              }}
              labelStyle={{ color: C.textMuted }}
              formatter={(v, name) => {
                if (v == null) return ['—', '—'];
                if (name === 'frequency') return [`${Number(v).toFixed(1)}% binding`, 'Frequency'];
                return [String(v), String(name)];
              }}
            />
            <Bar dataKey="frequency" fill={C.electricBlue} radius={[0, 2, 2, 0]} barSize={14} />
          </BarChart>
        </ResponsiveContainer>
        </AnnotatableChart>
      </div>
    </ContainedCard>
  );
}

// ─── INTERCONNECTION QUEUE (right column) ────────────────────────
function InterconnectionQueueSection() {
  return (
    <FlowSection eyebrow="INTERCONNECTION QUEUE" identity="Who else is coming.">
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {INTERCONNECTION_QUEUE.map((q) => (
          <div
            key={q.id}
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: S.xs,
              padding: `${S.sm} ${S.sm}`,
              borderBottom: `1px solid ${C.borderDefault}`,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: S.sm }}>
              <span style={{
                fontFamily: F.mono,
                fontSize: 12,
                fontWeight: 600,
                color: C.textPrimary,
                letterSpacing: '0.06em',
              }}>
                {q.queuePosition}
              </span>
              <span style={{
                fontFamily: F.mono,
                fontSize: 12,
                color: C.textPrimary,
                fontVariantNumeric: 'tabular-nums',
              }}>
                {q.mw} MW
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: S.sm }}>
              <span style={{
                fontFamily: F.mono,
                fontSize: 10,
                color: C.textMuted,
                letterSpacing: '0.10em',
                textTransform: 'uppercase',
              }}>
                {q.technology}
              </span>
              <span style={{
                fontFamily: F.mono,
                fontSize: 10,
                color: q.attritionProbability > 0.5 ? C.alertCritical : C.textMuted,
                letterSpacing: '0.06em',
              }}>
                ATTRITION RISK {(q.attritionProbability * 100).toFixed(0)}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </FlowSection>
  );
}

// ─── POLICY TRACKER (right column) ───────────────────────────────
function PolicyTrackerSection() {
  return (
    <FlowSection eyebrow="POLICY TRACKER" identity="What changed.">
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {POLICY_TRACKER.map((p) => (
          <div
            key={p.id}
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: S.xs,
              padding: `${S.sm} ${S.sm}`,
              borderBottom: `1px solid ${C.borderDefault}`,
            }}
          >
            <div style={{ fontFamily: F.sans, fontSize: 13, color: C.textPrimary, lineHeight: 1.4 }}>
              {p.title}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: S.sm }}>
              <span style={{
                fontFamily: F.mono,
                fontSize: 10,
                color: C.textMuted,
                letterSpacing: '0.06em',
              }}>
                {p.date}
              </span>
              <span style={{
                fontFamily: F.mono,
                fontSize: 10,
                fontWeight: 600,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: POLICY_IMPACT_COLOR[p.impact],
              }}>
                {p.impact}
              </span>
            </div>
          </div>
        ))}
      </div>
    </FlowSection>
  );
}

// ─── PPA BENCHMARKS (right column) ───────────────────────────────
function PPABenchmarksSection() {
  return (
    <FlowSection eyebrow="PPA BENCHMARKS" identity="What deals are clearing.">
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {PPA_BENCHMARKS.map((p) => (
          <div
            key={p.id}
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: S.xs,
              padding: `${S.sm} ${S.sm}`,
              borderBottom: `1px solid ${C.borderDefault}`,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: S.sm }}>
              <span style={{
                fontFamily: F.sans,
                fontSize: 13,
                fontWeight: 600,
                color: C.textPrimary,
              }}>
                {p.counterparty}
              </span>
              <span style={{
                fontFamily: F.mono,
                fontSize: 13,
                fontWeight: 600,
                color: C.falconGold,
                fontVariantNumeric: 'tabular-nums',
                whiteSpace: 'nowrap',
              }}>
                ${p.pricePerMwh.toFixed(2)}/MWh
              </span>
            </div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              gap: S.sm,
              fontFamily: F.mono,
              fontSize: 10,
              color: C.textMuted,
              letterSpacing: '0.06em',
            }}>
              <span>{p.mw} MW · {p.technology.toUpperCase()}</span>
              <span>{p.signedDate}</span>
            </div>
          </div>
        ))}
      </div>
    </FlowSection>
  );
}

// ─── SHARED SECTION HEADER ────────────────────────────────────────
function SectionHeader({ eyebrow, identity }: { eyebrow: string; identity: string }) {
  return (
    <div>
      <div style={{
        fontFamily: F.mono,
        fontSize: 11,
        fontWeight: 600,
        letterSpacing: '0.18em',
        textTransform: 'uppercase',
        color: C.electricBlue,
        marginBottom: S.xs,
      }}>
        {eyebrow}
      </div>
      <EditorialIdentity size="section">{identity}</EditorialIdentity>
    </div>
  );
}

// ─── TAB STRIP ────────────────────────────────────────────────────
function DeveloperTabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        background: 'transparent',
        border: 'none',
        cursor: 'pointer',
        fontFamily: F.mono,
        fontSize: 12,
        fontWeight: 600,
        letterSpacing: '0.16em',
        textTransform: 'uppercase',
        color: active ? C.electricBlue : C.textMuted,
        padding: `${S.sm} 0`,
        borderBottom: active
          ? `2px solid ${C.electricBlue}`
          : '2px solid transparent',
        marginBottom: -1,
        transition: 'color 150ms cubic-bezier(0.4, 0, 0.2, 1)',
      }}
    >
      {children}
    </button>
  );
}

// ─── MAIN ─────────────────────────────────────────────────────────
export function DeveloperNest() {
  const [tab, setTab] = useState<DeveloperTab>('overview');
  const [underwritingSeed] = useState<ProjectSpec>(() => seedUnderwritingSpec());

  return (
    <PageAtmosphere tint="developer">
      {/* Tab strip — surgical addition above the existing layout */}
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          gap: S.lg,
          padding: `${S.md} ${S.xl} 0`,
          borderBottom: `1px solid ${C.borderDefault}`,
        }}
      >
        <DeveloperTabButton
          active={tab === 'overview'}
          onClick={() => setTab('overview')}
        >
          OVERVIEW
        </DeveloperTabButton>
        <DeveloperTabButton
          active={tab === 'underwriting'}
          onClick={() => setTab('underwriting')}
        >
          UNDERWRITING CALCULATOR
        </DeveloperTabButton>
      </div>

      {tab === 'overview' && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '2fr 1fr',
            gap: S.sm,
            padding: S.xl,
          }}
        >
          {/* LEFT COLUMN */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: S.xl }}>
            <DeveloperHeroBlock />
            <ZoneRevenueCard />
            <CongestionPatternCard />
          </div>

          {/* RIGHT COLUMN */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: S.xl }}>
            <InterconnectionQueueSection />
            <PolicyTrackerSection />
            <PPABenchmarksSection />
          </div>
        </div>
      )}

      {tab === 'underwriting' && (
        <div style={{ padding: S.xl }}>
          <CalculatorView
            initial={underwritingSeed}
            onResultsChange={(s) =>
              setUnderwritingState({
                spec: s.spec,
                results: s.results,
                scenario: s.scenario,
              })
            }
          />
        </div>
      )}
    </PageAtmosphere>
  );
}
