import { useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
} from 'recharts';
import { C, F, R, S } from '@/design/tokens';
import { ContainedCard } from '@/components/terminal/ContainedCard';
import { EditorialIdentity } from '@/components/terminal/EditorialIdentity';
import { FlowSection } from '@/components/terminal/FlowSection';
import { HeroNumber } from '@/components/terminal/HeroNumber';
import { PageAtmosphere } from '@/components/terminal/PageAtmosphere';
import { AnnotatableChart } from '@/components/shared/AnnotatableChart';
import { useLMP } from '@/hooks/data/useLMP';
import {
  COMPARISON_SERIES,
  SAVED_QUERIES,
  ANNOTATIONS,
  CORRELATION_ZONES,
  CORRELATION_MATRIX,
  SEASONAL_PATTERN,
  ANOMALY_DETECTIONS,
} from '@/lib/mock/analyst-mock';
import { QueryBuilderView } from './QueryBuilder/QueryBuilderView';
import { ReportDraftingView } from './ReportDrafting/ReportDraftingView';

type AnalystTab = 'overview' | 'query-builder' | 'report-drafting';

const DATE_RANGES = ['1D', '1W', '1M', '3M', '6M', '1Y', 'Custom'] as const;
type DateRange = typeof DATE_RANGES[number];

const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// ─── HERO BLOCK ────────────────────────────────────────────────────
function AnalystHeroBlock() {
  const [activeRange, setActiveRange] = useState<DateRange>('3M');

  // Wave 4: live LMP for the comparison pair (WEST_HUB vs AEP).
  const westHub = useLMP('WEST_HUB');
  const aep = useLMP('AEP');
  const westValue = westHub.data?.lmp_total ?? 33.80;
  const aepValue = aep.data?.lmp_total ?? 31.22;

  const eyebrowStyle = {
    fontFamily: F.mono,
    fontSize: 11,
    fontWeight: 600,
    letterSpacing: '0.18em',
    textTransform: 'uppercase' as const,
    color: C.electricBlue,
    marginBottom: S.sm,
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: S.lg }}>
      <div style={eyebrowStyle}>ANALYST WORKBENCH · COMPARISON MODE</div>
      <EditorialIdentity size="hero">Compare across time.</EditorialIdentity>

      <div style={{ display: 'flex', alignItems: 'flex-end', gap: S.xl, marginTop: S.sm }}>
        {/* Zone A */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: S.xs }}>
          <HeroNumber value={westValue.toFixed(2)} unit="$/MWh" size={80} />
          <div style={{
            fontFamily: F.mono,
            fontSize: 11,
            color: C.textMuted,
            letterSpacing: '0.10em',
            textTransform: 'uppercase',
          }}>
            WEST HUB · NOW
          </div>
        </div>

        {/* Zone B */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: S.xs }}>
          <HeroNumber value={aepValue.toFixed(2)} unit="$/MWh" size={80} />
          <div style={{
            fontFamily: F.mono,
            fontSize: 11,
            color: C.textMuted,
            letterSpacing: '0.10em',
            textTransform: 'uppercase',
          }}>
            AEP · NOW
          </div>
        </div>

        {/* Delta */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: S.xs, paddingBottom: 4 }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            fontFamily: F.mono,
            fontSize: 18,
            fontWeight: 600,
            color: C.falconGold,
            letterSpacing: '0.04em',
            fontVariantNumeric: 'tabular-nums',
          }}>
            <ArrowUp />
            +2.58
          </div>
          <div style={{
            fontFamily: F.mono,
            fontSize: 10,
            color: C.textMuted,
            letterSpacing: '0.10em',
            textTransform: 'uppercase',
          }}>
            DELTA · $/MWh
          </div>
        </div>
      </div>

      {/* Date range buttons */}
      <div style={{ display: 'flex', gap: S.xs, marginTop: S.sm }}>
        {DATE_RANGES.map((r) => {
          const active = r === activeRange;
          return (
            <button
              key={r}
              onClick={() => setActiveRange(r)}
              style={{
                height: 32,
                paddingInline: S.md,
                background: 'transparent',
                color: active ? C.electricBlue : C.textSecondary,
                border: `1px solid ${active ? C.electricBlue : C.borderDefault}`,
                borderRadius: R.md,
                fontFamily: F.mono,
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: '0.10em',
                textTransform: 'uppercase',
                cursor: 'pointer',
                transition: 'border-color 150ms cubic-bezier(0.4, 0, 0.2, 1), color 150ms cubic-bezier(0.4, 0, 0.2, 1)',
              }}
            >
              {r}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function ArrowUp() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
      <path d="M6 2L10 8H2L6 2Z" fill={C.falconGold} />
    </svg>
  );
}

// ─── COMPARISON CHART ──────────────────────────────────────────────
function ComparisonChartCard() {
  const data = COMPARISON_SERIES.zoneA.daily.map((value, i) => ({
    day: i + 1,
    pseg: value,
    westHub: COMPARISON_SERIES.zoneB.daily[i],
  }));

  return (
    <ContainedCard minHeight={360}>
      <SectionHeader eyebrow="PSEG vs WEST HUB · 90-DAY" identity="Side by side." />
      <div style={{ height: 270, marginTop: S.md }}>
        <AnnotatableChart chartId="analyst:comparison-pseg-westhub">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 8, right: 12, bottom: 8, left: -8 }}>
            <CartesianGrid stroke={C.borderDefault} strokeDasharray="2 4" vertical={false} />
            <XAxis
              dataKey="day"
              tick={{ fontFamily: F.mono, fontSize: 10, fill: C.textMuted }}
              tickLine={false}
              axisLine={{ stroke: C.borderDefault }}
              interval={14}
            />
            <YAxis
              tick={{ fontFamily: F.mono, fontSize: 10, fill: C.textMuted }}
              tickLine={false}
              axisLine={{ stroke: C.borderDefault }}
              width={48}
              domain={['dataMin - 2', 'dataMax + 2']}
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
              formatter={(v, name) => v != null ? [`$${Number(v).toFixed(2)}/MWh`, name === 'pseg' ? 'PSEG' : 'WEST HUB'] : ['—', '—']}
            />
            <Line type="monotone" dataKey="pseg" stroke={C.electricBlue} strokeWidth={1.5} dot={false} name="pseg" />
            <Line type="monotone" dataKey="westHub" stroke={C.falconGold} strokeWidth={1.5} dot={false} name="westHub" />
          </LineChart>
        </ResponsiveContainer>
        </AnnotatableChart>
      </div>
      <div style={{ display: 'flex', gap: S.lg, marginTop: S.sm }}>
        <LegendChip label="PSEG" color={C.electricBlue} />
        <LegendChip label="WEST HUB" color={C.falconGold} />
      </div>
    </ContainedCard>
  );
}

function LegendChip({ label, color }: { label: string; color: string }) {
  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      fontFamily: F.mono,
      fontSize: 11,
      fontWeight: 500,
      letterSpacing: '0.10em',
      textTransform: 'uppercase',
      color: C.textSecondary,
    }}>
      <span aria-hidden style={{ width: 10, height: 2, background: color, borderRadius: 1 }} />
      {label}
    </span>
  );
}

// ─── CORRELATION MATRIX CARD ───────────────────────────────────────
function CorrelationMatrixCard() {
  const labels = CORRELATION_ZONES.map((z) => z.replace('_HUB', '').replace('_', ' '));
  const cellStyle = (val: number, isHeader = false): React.CSSProperties => ({
    fontFamily: F.mono,
    fontSize: 10,
    color: isHeader ? C.textMuted : C.textPrimary,
    background: isHeader ? 'transparent' : `rgba(59,130,246,${(val * 0.85).toFixed(2)})`,
    textAlign: 'center',
    padding: 0,
    height: 22,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    letterSpacing: isHeader ? '0.08em' : 0,
    textTransform: isHeader ? 'uppercase' : 'none',
    borderRadius: 2,
    fontVariantNumeric: 'tabular-nums',
  });

  return (
    <ContainedCard minHeight={200}>
      <SectionHeader eyebrow="CORRELATION MATRIX" identity="How they move together." />
      <div style={{
        display: 'grid',
        gridTemplateColumns: '40px repeat(5, 1fr)',
        gap: 2,
        marginTop: S.md,
      }}>
        {/* Top-left empty */}
        <div />
        {/* Column headers */}
        {labels.map((l) => <div key={`h-${l}`} style={cellStyle(0, true)}>{l}</div>)}
        {/* Rows */}
        {labels.map((rowLabel, rowI) => (
          <>
            <div key={`r-${rowLabel}`} style={cellStyle(0, true)}>{rowLabel}</div>
            {CORRELATION_MATRIX[rowI].map((val, colI) => (
              <div key={`c-${rowI}-${colI}`} style={cellStyle(val)}>
                {val.toFixed(2)}
              </div>
            ))}
          </>
        ))}
      </div>
    </ContainedCard>
  );
}

// ─── SEASONAL PATTERN CARD ─────────────────────────────────────────
function SeasonalPatternCard() {
  const data = SEASONAL_PATTERN.map((v, i) => ({ month: MONTH_LABELS[i], value: v }));
  return (
    <ContainedCard minHeight={200}>
      <SectionHeader eyebrow="SEASONAL PATTERN" identity="The yearly rhythm." />
      <div style={{ height: 120, marginTop: S.md }}>
        {/* hideToolbar — chart is only 120px tall; dots still render. */}
        <AnnotatableChart chartId="analyst:seasonal-pattern" hideToolbar>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 4, right: 8, bottom: 4, left: -16 }}>
            <CartesianGrid stroke={C.borderDefault} strokeDasharray="2 4" vertical={false} />
            <XAxis
              dataKey="month"
              tick={{ fontFamily: F.mono, fontSize: 9, fill: C.textMuted }}
              tickLine={false}
              axisLine={{ stroke: C.borderDefault }}
            />
            <YAxis
              tick={{ fontFamily: F.mono, fontSize: 9, fill: C.textMuted }}
              tickLine={false}
              axisLine={false}
              width={28}
            />
            <Line type="monotone" dataKey="value" stroke={C.electricBlue} strokeWidth={1.5} dot={{ r: 2, fill: C.electricBlue }} />
          </LineChart>
        </ResponsiveContainer>
        </AnnotatableChart>
      </div>
    </ContainedCard>
  );
}

// ─── ANOMALY DETECTION CARD ────────────────────────────────────────
function AnomalyDetectionCard() {
  const data = ANOMALY_DETECTIONS.map((a) => ({
    label: `${a.zone}`,
    sigma: a.sigma,
  }));
  return (
    <ContainedCard minHeight={200}>
      <SectionHeader eyebrow="ANOMALY DETECTION" identity="σ deviations." />
      <div style={{ height: 120, marginTop: S.md }}>
        {/* hideToolbar — chart is only 120px tall; dots still render. */}
        <AnnotatableChart chartId="analyst:anomaly-detection" hideToolbar>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 4, right: 8, bottom: 4, left: -16 }}>
            <CartesianGrid stroke={C.borderDefault} strokeDasharray="2 4" vertical={false} />
            <XAxis
              dataKey="label"
              tick={{ fontFamily: F.mono, fontSize: 9, fill: C.textMuted }}
              tickLine={false}
              axisLine={{ stroke: C.borderDefault }}
            />
            <YAxis
              tick={{ fontFamily: F.mono, fontSize: 9, fill: C.textMuted }}
              tickLine={false}
              axisLine={false}
              width={28}
              domain={[-5, 5]}
            />
            <Bar dataKey="sigma">
              {data.map((d, i) => (
                <Cell key={i} fill={d.sigma >= 0 ? C.falconGold : C.electricBlue} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        </AnnotatableChart>
      </div>
    </ContainedCard>
  );
}

// ─── SAVED QUERIES (right column) ──────────────────────────────────
function SavedQueriesSection() {
  return (
    <FlowSection eyebrow="SAVED QUERIES" identity="Your work.">
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {SAVED_QUERIES.map((q) => (
          <SavedQueryRow key={q.id} name={q.name} savedAt={q.savedAt} />
        ))}
      </div>
    </FlowSection>
  );
}

function SavedQueryRow({ name, savedAt }: { name: string; savedAt: string }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        height: 48,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: S.sm,
        paddingInline: S.sm,
        borderBottom: `1px solid ${C.borderDefault}`,
        background: hovered ? 'rgba(255,255,255,0.02)' : 'transparent',
        transition: 'background-color 150ms cubic-bezier(0.4, 0, 0.2, 1)',
        cursor: 'pointer',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0 }}>
        <div style={{
          fontFamily: F.sans,
          fontSize: 13,
          color: C.textPrimary,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}>
          {name}
        </div>
        <div style={{
          fontFamily: F.mono,
          fontSize: 10,
          color: C.textMuted,
          letterSpacing: '0.06em',
        }}>
          {savedAt}
        </div>
      </div>
      <PlayIcon color={hovered ? C.electricBlue : C.textMuted} />
    </div>
  );
}

function PlayIcon({ color }: { color: string }) {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden style={{ flexShrink: 0 }}>
      <path d="M3 2L12 7L3 12V2Z" fill={color} />
    </svg>
  );
}

// ─── ANNOTATIONS (right column) ────────────────────────────────────
function AnnotationsSection() {
  return (
    <FlowSection eyebrow="ANNOTATIONS" identity="Your notes.">
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {ANNOTATIONS.map((a) => (
          <div
            key={a.id}
            style={{
              padding: `${S.sm} ${S.sm}`,
              borderBottom: `1px solid ${C.borderDefault}`,
              display: 'flex',
              flexDirection: 'column',
              gap: S.xs,
            }}
          >
            <div style={{ fontFamily: F.sans, fontSize: 13, color: C.textPrimary, lineHeight: 1.4 }}>
              {a.text}
            </div>
            <div style={{
              display: 'flex',
              gap: S.md,
              fontFamily: F.mono,
              fontSize: 10,
              color: C.textMuted,
              letterSpacing: '0.06em',
            }}>
              <span>{a.chartRef.toUpperCase()}</span>
              <span>·</span>
              <span>{new Date(a.timestamp).toISOString().slice(0, 10)}</span>
            </div>
          </div>
        ))}
      </div>
    </FlowSection>
  );
}

// ─── EXPORT PANEL ──────────────────────────────────────────────────
function ExportPanelCard() {
  return (
    <ContainedCard>
      <SectionHeader eyebrow="EXPORT" identity="Take it with you." />
      <div style={{ display: 'flex', flexDirection: 'column', gap: S.sm, marginTop: S.md }}>
        {[
          'Chart as PNG',
          'Data as CSV',
          'Full Report PDF',
        ].map((label) => (
          <ExportButton key={label} label={label} />
        ))}
      </div>
    </ContainedCard>
  );
}

function ExportButton({ label }: { label: string }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        height: 40,
        background: 'transparent',
        color: C.electricBlue,
        border: `1px solid ${hovered ? C.electricBlue : C.borderDefault}`,
        borderRadius: R.md,
        fontFamily: F.mono,
        fontSize: 11,
        fontWeight: 600,
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        cursor: 'pointer',
        transition: 'border-color 150ms cubic-bezier(0.4, 0, 0.2, 1)',
      }}
    >
      {label}
    </button>
  );
}

// ─── SHARED SECTION HEADER (eyebrow + identity) ────────────────────
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
function AnalystTabButton({
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

// ─── MAIN ──────────────────────────────────────────────────────────
export function AnalystNest() {
  const [tab, setTab] = useState<AnalystTab>('overview');

  return (
    <PageAtmosphere tint="analyst">
      {/* Tab strip — Wave 6 surgical addition */}
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
        <AnalystTabButton
          active={tab === 'overview'}
          onClick={() => setTab('overview')}
        >
          OVERVIEW
        </AnalystTabButton>
        <AnalystTabButton
          active={tab === 'query-builder'}
          onClick={() => setTab('query-builder')}
        >
          QUERY BUILDER
        </AnalystTabButton>
        <AnalystTabButton
          active={tab === 'report-drafting'}
          onClick={() => setTab('report-drafting')}
        >
          REPORT DRAFTING
        </AnalystTabButton>
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
            <AnalystHeroBlock />
            <ComparisonChartCard />
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: S.md,
              }}
            >
              <CorrelationMatrixCard />
              <SeasonalPatternCard />
              <AnomalyDetectionCard />
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: S.xl }}>
            <SavedQueriesSection />
            <AnnotationsSection />
            <ExportPanelCard />
          </div>
        </div>
      )}

      {tab === 'query-builder' && (
        <div style={{ padding: S.xl }}>
          <QueryBuilderView />
        </div>
      )}

      {tab === 'report-drafting' && (
        <div style={{ padding: S.xl }}>
          <ReportDraftingView />
        </div>
      )}
    </PageAtmosphere>
  );
}
