import { useState } from 'react';
import { C, F, R, S } from '@/design/tokens';
import { ContainedCard } from '@/components/terminal/ContainedCard';
import { EditorialIdentity } from '@/components/terminal/EditorialIdentity';
import { FlowSection } from '@/components/terminal/FlowSection';
import { PageAtmosphere } from '@/components/terminal/PageAtmosphere';
import {
  TODAY_EXPLAINER,
  STUDENT_CONCEPT_NODES,
  INTERVIEW_QUESTIONS,
  JOB_POSTINGS,
  COHORT_MEMBERS,
  SANDBOX_PNL,
} from '@/lib/mock/student-mock';
import type { ConceptNode } from '@/lib/types/vault';
import { SandboxTradingView } from './SandboxTrading/SandboxTradingView';
import { ProjectSandboxView } from './ProjectSandbox/ProjectSandboxView';

type StudentTab = 'overview' | 'sandbox' | 'projects';

// ─── HERO BLOCK ───────────────────────────────────────────────────
function StudentHeroBlock() {
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
        TODAY IN MARKETS
      </div>
      <EditorialIdentity size="hero">What's happening today.</EditorialIdentity>

      <div style={{
        fontFamily: F.display,
        fontStyle: 'italic',
        fontSize: 30,
        fontWeight: 400,
        lineHeight: 1.3,
        letterSpacing: '-0.01em',
        color: 'rgba(255,255,255,0.72)',
        marginTop: S.sm,
      }}>
        {TODAY_EXPLAINER.headline}
      </div>

      <div style={{
        fontFamily: F.sans,
        fontSize: 14,
        lineHeight: 1.6,
        color: C.textSecondary,
        maxWidth: 720,
      }}>
        {TODAY_EXPLAINER.summary}
      </div>

      <div style={{ display: 'flex', gap: S.lg, marginTop: S.xs }}>
        <InlineLink>[Read more]</InlineLink>
        <InlineLink>[What's a spark spread?]</InlineLink>
      </div>
    </div>
  );
}

function InlineLink({ children }: { children: string }) {
  const [hovered, setHovered] = useState(false);
  return (
    <a
      href="#"
      onClick={(e) => e.preventDefault()}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        fontFamily: F.mono,
        fontSize: 11,
        fontWeight: 600,
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        color: hovered ? C.electricBlueLight : C.electricBlue,
        textDecoration: 'none',
        cursor: 'pointer',
      }}
    >
      {children}
    </a>
  );
}

// ─── CONCEPT MAP ──────────────────────────────────────────────────
function ConceptMapCard() {
  // SVG dimensions
  const width = 800;
  const height = 480;

  // Map mock x/y (provided 80–720, 80–400) into SVG with margins.
  const padX = 70;
  const padY = 30;
  const projX = (x: number) => padX + (x - 80) * ((width - padX * 2) / (720 - 80));
  const projY = (y: number) => padY + (y - 80) * ((height - padY * 2) / (400 - 80));

  // Build edges from `parents`
  type Edge = { fromId: string; toId: string };
  const edges: Edge[] = [];
  STUDENT_CONCEPT_NODES.forEach((n) => {
    n.parents.forEach((p) => edges.push({ fromId: p, toId: n.id }));
  });

  const nodeById = (id: string) => STUDENT_CONCEPT_NODES.find((n) => n.id === id);
  const tierLabels = [
    { y: 80,  label: 'FOUNDATION' },
    { y: 240, label: 'MECHANICS' },
    { y: 400, label: 'ADVANCED' },
  ];

  return (
    <ContainedCard minHeight={520}>
      <SectionHeader eyebrow="ALEXANDRIA · YOUR CONCEPT MAP" identity="What you've explored." />

      <div style={{ marginTop: S.md, width: '100%' }}>
        <svg
          viewBox={`0 0 ${width} ${height}`}
          width="100%"
          height={460}
          style={{ display: 'block' }}
          aria-label="Concept map"
        >
          {/* Tier band labels */}
          {tierLabels.map((t) => (
            <text
              key={t.label}
              x={12}
              y={projY(t.y) + 4}
              style={{
                fontFamily: F.mono,
                fontSize: 9,
                fontWeight: 600,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                fill: C.textMuted,
              }}
            >
              {t.label}
            </text>
          ))}

          {/* Edges */}
          {edges.map((e, i) => {
            const from = nodeById(e.fromId);
            const to = nodeById(e.toId);
            if (!from || !to) return null;
            const bothUnlocked = from.unlocked && to.unlocked;
            return (
              <line
                key={i}
                x1={projX(from.x)}
                y1={projY(from.y)}
                x2={projX(to.x)}
                y2={projY(to.y)}
                stroke={bothUnlocked ? C.electricBlue : 'rgba(255,255,255,0.15)'}
                strokeWidth={bothUnlocked ? 1.5 : 1}
                strokeDasharray={bothUnlocked ? undefined : '3 4'}
              />
            );
          })}

          {/* Nodes */}
          {STUDENT_CONCEPT_NODES.map((n) => (
            <ConceptNodeRect key={n.id} node={n} cx={projX(n.x)} cy={projY(n.y)} />
          ))}
        </svg>
      </div>
    </ContainedCard>
  );
}

function ConceptNodeRect({ node, cx, cy }: { node: ConceptNode; cx: number; cy: number }) {
  const w = 120;
  const h = 60;
  const x = cx - w / 2;
  const y = cy - h / 2;
  const opacity = node.unlocked ? 1 : 0.5;

  return (
    <g opacity={opacity}>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx={8}
        ry={8}
        fill={C.bgSurface}
        stroke={node.unlocked ? C.electricBlue : 'transparent'}
        strokeWidth={1}
      />
      <text
        x={cx}
        y={cy + 4}
        textAnchor="middle"
        style={{
          fontFamily: F.mono,
          fontSize: 11,
          fontWeight: 600,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          fill: C.textPrimary,
        }}
      >
        {node.label}
      </text>
    </g>
  );
}

// ─── EXPLAINER FEED ───────────────────────────────────────────────
const TODAYS_LESSONS = [
  {
    id: 'le-001',
    headline: 'What is congestion?',
    summary: 'A binding transmission constraint creates different prices in different zones, even when the underlying energy cost is the same.',
    concept: 'CONGESTION',
  },
  {
    id: 'le-002',
    headline: 'How a spark spread works',
    summary: 'A gas plant\'s gross margin: LMP minus the fuel cost adjusted for the plant\'s heat rate.',
    concept: 'SPARK SPREAD',
  },
  {
    id: 'le-003',
    headline: 'Why batteries cycle around peak',
    summary: 'Charge during the pre-dawn trough, discharge into the evening peak — bound by efficiency losses and degradation cost.',
    concept: 'BATTERY ARBITRAGE',
  },
];

function TodaysLessonsSection() {
  return (
    <FlowSection eyebrow="TODAY'S LESSONS" identity="Bite-sized.">
      <div style={{ display: 'flex', flexDirection: 'column', gap: S.sm }}>
        {TODAYS_LESSONS.map((l) => (
          <ContainedCard key={l.id} minHeight={80}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <div style={{ fontFamily: F.sans, fontSize: 14, fontWeight: 500, color: C.textPrimary }}>
                {l.headline}
              </div>
              <div style={{
                fontFamily: F.sans,
                fontSize: 12,
                color: C.textSecondary,
                lineHeight: 1.5,
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}>
                {l.summary}
              </div>
              <div style={{
                fontFamily: F.mono,
                fontSize: 10,
                fontWeight: 600,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: C.electricBlue,
                marginTop: 2,
              }}>
                {l.concept}
              </div>
            </div>
          </ContainedCard>
        ))}
      </div>
    </FlowSection>
  );
}

// ─── INTERVIEW PREP (right column) ────────────────────────────────
function InterviewPrepSection() {
  return (
    <FlowSection eyebrow="INTERVIEW PREP" identity="Get ready.">
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {INTERVIEW_QUESTIONS.slice(0, 3).map((q) => (
          <div
            key={q.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: S.sm,
              padding: `${S.sm} ${S.sm}`,
              borderBottom: `1px solid ${C.borderDefault}`,
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0, flex: 1 }}>
              <div style={{
                fontFamily: F.sans,
                fontSize: 13,
                color: C.textPrimary,
                lineHeight: 1.4,
              }}>
                {q.question}
              </div>
              <div style={{
                fontFamily: F.mono,
                fontSize: 10,
                color: C.textMuted,
                letterSpacing: '0.10em',
                textTransform: 'uppercase',
              }}>
                {q.difficulty} · {q.topic}
              </div>
            </div>
            <PracticeButton />
          </div>
        ))}
      </div>
    </FlowSection>
  );
}

function PracticeButton() {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        height: 28,
        paddingInline: S.sm,
        background: 'transparent',
        color: C.electricBlue,
        border: `1px solid ${hovered ? C.electricBlue : C.borderDefault}`,
        borderRadius: R.md,
        fontFamily: F.mono,
        fontSize: 10,
        fontWeight: 600,
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        cursor: 'pointer',
        flexShrink: 0,
        transition: 'border-color 150ms cubic-bezier(0.4, 0, 0.2, 1)',
      }}
    >
      Practice
    </button>
  );
}

// ─── CAREER INTEL (right column) ──────────────────────────────────
function CareerIntelSection() {
  return (
    <FlowSection eyebrow="CAREER INTEL" identity="Where this leads.">
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {JOB_POSTINGS.map((j) => (
          <div
            key={j.id}
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
              padding: `${S.sm} ${S.sm}`,
              borderBottom: `1px solid ${C.borderDefault}`,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: S.sm }}>
              <span style={{ fontFamily: F.sans, fontSize: 13, fontWeight: 600, color: C.textPrimary }}>
                {j.company}
              </span>
              <span style={{
                fontFamily: F.mono,
                fontSize: 11,
                fontWeight: 600,
                color: C.falconGold,
                fontVariantNumeric: 'tabular-nums',
                whiteSpace: 'nowrap',
              }}>
                {j.salaryRange}
              </span>
            </div>
            <div style={{ fontFamily: F.sans, fontSize: 13, color: C.textSecondary }}>
              {j.title}
            </div>
            <div style={{
              fontFamily: F.mono,
              fontSize: 10,
              color: C.textMuted,
              letterSpacing: '0.10em',
              textTransform: 'uppercase',
            }}>
              {j.location}
            </div>
          </div>
        ))}
      </div>
    </FlowSection>
  );
}

// ─── SANDBOX (right column) ───────────────────────────────────────
function SandboxSection({ onOpenSandbox }: { onOpenSandbox: () => void }) {
  const [hovered, setHovered] = useState(false);
  return (
    <FlowSection eyebrow="SANDBOX" identity="Try a trade.">
      <div style={{ display: 'flex', flexDirection: 'column', gap: S.sm, padding: S.sm }}>
        <div style={{
          fontFamily: F.mono,
          fontSize: 13,
          color: C.textSecondary,
          letterSpacing: '0.04em',
        }}>
          Your sim portfolio:
          <span style={{
            color: C.falconGold,
            fontWeight: 600,
            marginLeft: S.xs,
            fontVariantNumeric: 'tabular-nums',
          }}>
            +${SANDBOX_PNL.thisWeek.toLocaleString()} this week
          </span>
        </div>
        <button
          onClick={onOpenSandbox}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          style={{
            height: 36,
            background: hovered ? C.electricBlueMuted : C.electricBlue,
            color: C.textPrimary,
            border: 'none',
            borderRadius: R.md,
            fontFamily: F.mono,
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            cursor: 'pointer',
            transition: 'background-color 150ms cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        >
          Continue trading
        </button>
      </div>
    </FlowSection>
  );
}

// ─── COHORT (right column) ────────────────────────────────────────
function CohortSection() {
  return (
    <FlowSection eyebrow="COHORT" identity="Your study group.">
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {COHORT_MEMBERS.map((m) => (
          <div
            key={m.id}
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: S.xs,
              padding: `${S.sm} ${S.sm}`,
              borderBottom: `1px solid ${C.borderDefault}`,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: S.sm }}>
              <span style={{
                fontFamily: F.sans,
                fontSize: 13,
                color: C.textPrimary,
              }}>
                {m.name}
              </span>
              <span style={{
                fontFamily: F.mono,
                fontSize: 11,
                color: C.textMuted,
                fontVariantNumeric: 'tabular-nums',
              }}>
                {m.conceptProgress}%
              </span>
            </div>
            <div style={{
              height: 4,
              background: C.borderDefault,
              borderRadius: 2,
              overflow: 'hidden',
            }}>
              <div style={{
                height: '100%',
                width: `${m.conceptProgress}%`,
                background: C.electricBlue,
              }} />
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
function StudentTabButton({
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
        transition: 'color 150ms cubic-bezier(0.4, 0, 0.2, 1)',
      }}
    >
      {children}
    </button>
  );
}

// ─── MAIN ─────────────────────────────────────────────────────────
export function StudentNest() {
  const [tab, setTab] = useState<StudentTab>('overview');

  return (
    <PageAtmosphere tint="student">
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
        <StudentTabButton
          active={tab === 'overview'}
          onClick={() => setTab('overview')}
        >
          OVERVIEW
        </StudentTabButton>
        <StudentTabButton
          active={tab === 'sandbox'}
          onClick={() => setTab('sandbox')}
        >
          SANDBOX TRADING
        </StudentTabButton>
        <StudentTabButton
          active={tab === 'projects'}
          onClick={() => setTab('projects')}
        >
          PROJECT SANDBOX
        </StudentTabButton>
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
            <StudentHeroBlock />
            <ConceptMapCard />
            <TodaysLessonsSection />
          </div>

          {/* RIGHT COLUMN */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: S.xl }}>
            <InterviewPrepSection />
            <CareerIntelSection />
            <SandboxSection onOpenSandbox={() => setTab('sandbox')} />
            <CohortSection />
          </div>
        </div>
      )}

      {tab === 'sandbox' && <SandboxTradingView />}
      {tab === 'projects' && <ProjectSandboxView />}
    </PageAtmosphere>
  );
}
