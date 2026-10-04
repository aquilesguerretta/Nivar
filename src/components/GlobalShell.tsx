import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { C, F, R, S, T } from '@/design/tokens';
import {
  Area, ComposedChart, Line, Bar, BarChart, Cell,
  XAxis, YAxis, Tooltip, ReferenceLine,
  ResponsiveContainer, CartesianGrid,
} from 'recharts';
import FalconLogo from "./FalconLogo";
import { LMPFullPage } from "./LMPCard";
import { useAuthStore } from '@/stores/authStore';
import { TraderNest } from './nest/trader/TraderNest';
import { ProfileSwitcher } from './dev/ProfileSwitcher';
import GridAtlasView from "./atlas/GridAtlasView";
import AnalyticsPage from "./AnalyticsPage";
import GenerationMixFullPage from "./GenerationMixFullPage";
import PeregrineFullPage from "./peregrine/PeregrineFullPage";
// FOUNDRY Phase D — global overlays. Each handles its own visibility
// via uiStore (see ROUTING ARCHITECTURE in CLAUDE.md).
import { AIAssistant } from './shared/AIAssistant';
import { AIAssistantTrigger } from './shared/AIAssistantTrigger';
import { CommandPalette } from './shared/CommandPalette';
// CONDUIT — saved views trigger lives in the top nav next to the LMP readout.
import { SavedViewsTrigger } from './shared/SavedViewsTrigger';
// FOUNDRY Phase E — global keyboard shortcuts. Mounted once at the
// shell root so Cmd+K / Cmd+P / Cmd+/ / ESC work everywhere inside.
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
// CONDUIT — restore an encoded `?v=...` view from the URL if present.
import { useShareableUrl } from '@/hooks/useShareableUrl';
import { useHenryHub } from '../hooks/data/useEnergyPrices';
import { useFuelMix } from '../hooks/data/useAtlasData';
import { useLiveOpsData } from '../hooks/data/useLiveOpsData';
import { useLMPStream } from '../hooks/data/useLMPStream';
import { ConnectionStatusDot, type ConnectionStatus } from './terminal/ConnectionStatusDot';

// ── EveryoneNest + shared chart primitives ───────────────────────
// EveryoneNest is the fallback Nest used when selectedProfile is null
// or 'everyone'. Its chart primitives (SparkSpreadChart, SOCGauge),
// helpers (avg/maxWindowAverage/minWindowAverage/hourWindowLabel) and
// StatusDot are re-imported here for use by the KPI deep-dive pages
// (SpreadFullPage, BatteryFullPage, GapFullPage) and SuiteCard / TopBar.
import {
  EveryoneNest,
  SparkSpreadChart,
  SOCGauge,
  StatusDot,
  avg,
  maxWindowAverage,
  minWindowAverage,
  hourWindowLabel,
} from './nest/everyone/EveryoneNest';

// ── Per-profile Nests (TERMINAL) ─────────────────────────────────
// All five non-Trader Nests have shipped — placeholders removed.
import { AnalystNest }    from './nest/analyst/AnalystNest';
import { StorageNest }    from './nest/storage/StorageNest';
import { IndustrialNest } from './nest/industrial/IndustrialNest';
import { StudentNest }    from './nest/student/StudentNest';
import { DeveloperNest }  from './nest/developer/DeveloperNest';

// ── Vault destination ────────────────────────────────────────────
// ATLAS shipped src/components/vault/Vault.tsx — the shell now renders it
// at /vault. Sub-views (CaseStudyView, Alexandria) are switched on by URL
// inside the Vault component, but require ARCHITECT to extend routing so
// that /vault/:id and /vault/alexandria reach this same GlobalShell mount.
import { Vault } from './vault/Vault';


type NavItem = {
  id: string;
  icon: React.ReactNode;
  label: string;
  code: string;
};

const navItems: NavItem[] = [
  { id: "nest",      code: "01", icon: <HexagonIcon />,    label: "THE NEST"   },
  { id: "atlas",     code: "02", icon: <DiamondIcon />,    label: "GRID ATLAS" },
  { id: "peregrine", code: "03", icon: <FalconNavIcon />,  label: "PEREGRINE"  },
  { id: "analytics", code: "04", icon: <TargetIcon />,     label: "ANALYTICS"  },
  { id: "vault",     code: "05", icon: <VaultIcon />,      label: "VAULT"      },
];

// Icons
function HexagonIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 2L21.5 7.5V16.5L12 22L2.5 16.5V7.5L12 2Z" />
    </svg>
  );
}

function DiamondIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 2L22 12L12 22L2 12L12 2Z" />
      <path d="M12 7L17 12L12 17L7 12L12 7Z" />
    </svg>
  );
}

function TargetIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="12" cy="12" r="1" fill="currentColor" />
    </svg>
  );
}

function VaultIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="3" y="6" width="18" height="14" rx="2" />
      <path d="M7 6V4a2 2 0 012-2h6a2 2 0 012 2v2" />
      <line x1="8" y1="11" x2="8" y2="15" />
      <line x1="12" y1="11" x2="12" y2="15" />
      <line x1="16" y1="11" x2="16" y2="15" />
    </svg>
  );
}

// Stylized peregrine wing — a chevron-down silhouette echoing the
// raptor logo. Same 14×14 / 1.5 stroke as the other nav icons.
function FalconNavIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 7L12 18L21 7" />
      <path d="M7 7L12 13L17 7" opacity="0.55" />
    </svg>
  );
}

// FalconLogo imported from ./FalconLogo (Spline 3D + Zustand)

// StatusDot is now imported from ./nest/everyone/EveryoneNest

// Entry Overlay - cinematic splash screen
function EntryOverlay({ onDismiss }: { onDismiss: () => void }) {
  const [visible, setVisible] = useState(true);
  const [collapsing, setCollapsing] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setCollapsing(true);
      setTimeout(() => {
        setVisible(false);
        onDismiss();
      }, 600);
    }, 2000);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  const handleClick = () => {
    setCollapsing(true);
    setTimeout(() => {
      setVisible(false);
      onDismiss();
    }, 600);
  };

  if (!visible) return null;

  return (
    <div
      onClick={handleClick}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        backgroundColor: '#0A0A0B',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '16px',
        transition: 'opacity 600ms ease-out, transform 600ms ease-out',
        opacity: collapsing ? 0 : 1,
        transform: collapsing ? 'translateY(-100%)' : 'translateY(0)',
        cursor: 'pointer',
      }}
    >
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(ellipse at center, rgba(6,182,212,0.08) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      <span style={{
        fontFamily: F.mono,
        fontSize: '36px',
        fontWeight: 700,
        color: C.textPrimary,
        letterSpacing: '0.15em',
      }}>
        GRIDALPHA
      </span>
      <span style={{
        fontFamily: F.mono,
        fontSize: '12px',
        fontWeight: 400,
        color: 'rgba(255,255,255,0.4)',
        letterSpacing: '0.3em',
      }}>
        PJM MARKET INTELLIGENCE TERMINAL
      </span>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
        <div style={{
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          backgroundColor: C.electricBlue,
          boxShadow: '0 0 12px rgba(6,182,212,0.8)',
        }} />
        <span style={{
          fontFamily: F.mono,
          fontSize: '11px',
          color: C.electricBlue,
          letterSpacing: '0.2em',
        }}>
          LIVE · $31.85 /MWh · NORMAL OPERATIONS
        </span>
      </div>
      <span style={{
        position: 'absolute',
        bottom: '32px',
        fontFamily: F.mono,
        fontSize: '9px',
        color: 'rgba(255,255,255,0.2)',
        letterSpacing: '0.2em',
      }}>
        CLICK ANYWHERE TO ENTER
      </span>
    </div>
  );
}


// Pulsing Dot Grid Background (kept for future use)
// @ts-ignore: preserved component
function PulsingDotGrid() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <svg width="100%" height="100%" className="animate-dot-pulse">
        <defs>
          <pattern id="dotGrid" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1" fill={C.electricBlue} fillOpacity="0.3" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#dotGrid)" />
      </svg>
    </div>
  );
}

// PJM Territory Outline with Hub Dots (kept for future use)
// @ts-ignore: preserved component
function PJMTerritory() {
  const hubs = [
    { x: 100, y: 55, label: "WEST HUB", delay: 0 },
    { x: 75, y: 70, label: "AEP", delay: 0.3 },
    { x: 130, y: 45, label: "PSEG", delay: 0.6 },
    { x: 60, y: 50, label: "COMED", delay: 0.9 },
    { x: 145, y: 65, label: "PECO", delay: 1.2 },
    { x: 85, y: 85, label: "DOMINION", delay: 1.5 },
    { x: 115, y: 75, label: "PPL", delay: 1.8 },
    { x: 50, y: 65, label: "DUQ", delay: 2.1 },
    { x: 140, y: 85, label: "JCPL", delay: 2.4 },
    { x: 70, y: 40, label: "ATSI", delay: 2.7 },
  ];

  return (
    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 200 160" preserveAspectRatio="xMidYMid meet">
      {/* PJM Territory - PA-centered hexagonal cluster */}
      <path
        d="M40,60 L55,35 L85,25 L115,25 L145,35 L160,60 L150,85 L120,100 L80,100 L50,85 Z"
        stroke={C.electricBlue}
        strokeWidth="1"
        fill="none"
        opacity="0.6"
      />
      {/* Inner transmission lines */}
      <path d="M55,35 L100,55 L145,35" stroke={C.electricBlue} strokeWidth="0.5" fill="none" opacity="0.3" />
      <path d="M40,60 L100,55 L160,60" stroke={C.electricBlue} strokeWidth="0.5" fill="none" opacity="0.3" />
      <path d="M50,85 L100,55 L150,85" stroke={C.electricBlue} strokeWidth="0.5" fill="none" opacity="0.3" />
      <path d="M80,100 L100,55 L120,100" stroke={C.electricBlue} strokeWidth="0.5" fill="none" opacity="0.3" />
      {/* Hub dots with staggered pulsing */}
      {hubs.map((hub, i) => (
        <g key={i}>
          <circle
            cx={hub.x}
            cy={hub.y}
            r="6"
            fill={C.electricBlue}
            fillOpacity="0.15"
            className="animate-dot-pulse"
            style={{ animationDelay: `${hub.delay}s` }}
          />
          <circle cx={hub.x} cy={hub.y} r="3" fill={C.electricBlue} fillOpacity="0.8" />
          <text
            x={hub.x}
            y={hub.y - 8}
            textAnchor="middle"
            fill="rgba(255,255,255,0.3)"
            fontSize="5"
            fontFamily={F.mono}
          >
            {hub.label}
          </text>
        </g>
      ))}
    </svg>
  );
}

// BentoCard moved to ./nest/everyone/EveryoneNest

// 24h Price Sparkline
function PriceSparkline24h() {
  // Realistic PJM price curve data points (24 hours)
  const priceData = [28, 26, 24, 23, 22, 24, 29, 35, 42, 38, 34, 32, 30, 31, 33, 36, 45, 52, 48, 40, 35, 32, 30, 31.85];
  const max = Math.max(...priceData);
  const min = Math.min(...priceData);
  const range = max - min;
  const points = priceData.map((v, i) => `${(i / 23) * 140 + 5},${35 - ((v - min) / range) * 30}`).join(" ");
  
  return (
    <svg width="150" height="40" className="mt-2">
      <polyline points={points} fill="none" stroke={C.electricBlue} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="145" cy={35 - ((31.85 - min) / range) * 30} r="2.5" fill={C.electricBlueLight} />
    </svg>
  );
}

// LMP Scorecard with enhanced glow and delta (kept for future use)
// @ts-ignore: preserved component
function LMPScorecard() {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full py-2">
      <span className="text-[10px] tracking-wider mb-1" style={{ fontFamily: F.mono, color: "rgba(255, 255, 255, 0.4)" }}>WEST HUB LMP</span>
      <span
        className="text-5xl font-medium"
        style={{ fontFamily: F.mono, fontVariantNumeric: "tabular-nums", color: C.electricBlueLight, textShadow: "0 0 20px rgba(34, 211, 238, 0.6), 0 0 40px rgba(34, 211, 238, 0.3)" }}
      >
        31.85
      </span>
      <div className="flex items-center gap-2 mt-1">
        <span className="text-[10px] tracking-wider" style={{ fontFamily: F.mono, color: C.electricBlue }}>$/MWh</span>
        <span className="text-[10px] font-medium" style={{ fontFamily: F.mono, color: "#FFB800" }}>▲ +2.4%</span>
      </div>
      <PriceSparkline24h />
    </div>
  );
}

// Mini Sparkline
// ── Peregrine Feed data model ────────────────────────────────────
type AlertCategory = 'CONGESTION' | 'PRICE' | 'DISPATCH' | 'WEATHER' | 'SYSTEM' | 'GENERATION';
type AlertPriority = 'CRITICAL' | 'HIGH' | 'NORMAL' | 'INFO';

interface FeedAlert {
  id: string; time: string; category: AlertCategory; priority: AlertPriority;
  headline: string; detail?: string; zone?: string; value?: string;
}

const CATEGORY_COLORS: Record<AlertCategory, string> = {
  CONGESTION: C.alertHigh, PRICE: C.electricBlue, DISPATCH: C.falconGold,
  WEATHER: '#38BDF8', SYSTEM: C.alertNormal, GENERATION: C.alertDiagnostic,
};

const PRIORITY_CONFIG: Record<AlertPriority, { dot: string; rowOpacity: number }> = {
  CRITICAL: { dot: C.alertCritical, rowOpacity: 1.0 },
  HIGH:     { dot: C.alertHigh,     rowOpacity: 0.95 },
  NORMAL:   { dot: C.electricBlue,  rowOpacity: 0.80 },
  INFO:     { dot: C.textMuted,     rowOpacity: 0.55 },
};

const FEED_ALERTS: FeedAlert[] = [
  { id: '1', time: '09:42', category: 'CONGESTION', priority: 'HIGH',
    headline: 'Artificial Island interface binding — PSEG import constrained',
    detail: 'PJM-EAST import limit reached 97% of rated capacity. PSEG congestion component elevated to +$1.58/MWh. Expected to persist through peak hours.',
    zone: 'PSEG', value: '+$1.58/MWh' },
  { id: '2', time: '09:32', category: 'PRICE', priority: 'NORMAL',
    headline: 'DA/RT spread exceeded 8% threshold — West Hub',
    detail: 'Day-ahead price $38.20 vs real-time $35.90 creates -$2.30/MWh convergence spread. Virtual selling opportunity identified.',
    zone: 'WEST_HUB', value: '-$2.30 spread' },
  { id: '3', time: '09:15', category: 'DISPATCH', priority: 'INFO',
    headline: 'PJM dispatch signal: NORMAL — no emergency conditions',
    detail: 'System operating normally. Reserve margin at 18.4%, above 15% minimum threshold.',
    value: '18.4% margin' },
  { id: '4', time: '08:58', category: 'GENERATION', priority: 'HIGH',
    headline: 'Wind ramp detected — COMED 850 MW curtailment order',
    detail: 'Sudden wind generation increase causing local oversupply. COMED LMP negative for 12-minute interval. Wind operators issued curtailment signal.',
    zone: 'COMED', value: '-850 MW curtail' },
  { id: '5', time: '08:44', category: 'WEATHER', priority: 'NORMAL',
    headline: 'NOAA forecast update — demand revision +2.1 GW vs yesterday',
    detail: 'Temperature forecast revised upward for PJM footprint. Peak load forecast increased from 126.3 GW to 128.4 GW. Affects afternoon spark spread outlook.',
    value: '+2.1 GW demand' },
  { id: '6', time: '08:21', category: 'PRICE', priority: 'CRITICAL',
    headline: 'RECO LMP spike: $62.40/MWh — 73% above system average',
    detail: 'Import constraints from PSEG combined with local load growth driving extreme congestion. RECO historically spikes during morning ramp. Alert threshold: $50/MWh.',
    zone: 'RECO', value: '$62.40/MWh' },
  { id: '7', time: '08:05', category: 'SYSTEM', priority: 'INFO',
    headline: 'Market opening — PJM real-time LMP feed active',
    detail: 'All 20 zones reporting. Data latency: 4 seconds. Next scheduled maintenance: Apr 15 02:00–04:00 ET.' },
];

interface NewsItem {
  id: string; timeAgo: string; headline: string; summary?: string;
  source: string; tags: string[];
}

const ENERGY_NEWS: NewsItem[] = [
  { id: 'n1', timeAgo: '1 hr ago', headline: 'PJM Targets 15 Gigawatts of New Power for Data Center Boom',
    summary: 'Grid operator accelerates interconnection queue to meet surging AI infrastructure demand across the Mid-Atlantic and Midwest.',
    source: 'Bloomberg', tags: ['PJM', 'capacity', 'data centers'] },
  { id: 'n2', timeAgo: '2 hr ago', headline: 'Natural Gas Futures Fall as Storage Builds Ahead of Summer',
    summary: 'Henry Hub spot prices retreat to $3.38/MMBtu as mild temperatures reduce heating demand.',
    source: 'Reuters', tags: ['natural gas', 'Henry Hub', 'spark spread'] },
  { id: 'n3', timeAgo: '3 hr ago', headline: 'FERC Approves Transmission Upgrade Along PJM Eastern Interface',
    summary: 'New 500kV line will add 2,400 MW of import capacity to constrained PSEG and JCPL zones.',
    source: 'S&P Global', tags: ['FERC', 'transmission', 'PSEG'] },
  { id: 'n4', timeAgo: '4 hr ago', headline: 'Coal Plant Retirements Accelerate in PJM as Carbon Costs Rise',
    summary: 'Three AEP facilities totaling 1.8 GW scheduled for retirement by Q3 2026, tightening summer reserve margins.',
    source: 'Bloomberg', tags: ['coal', 'AEP', 'retirements'] },
  { id: 'n5', timeAgo: '5 hr ago', headline: 'Wind Generation Breaks PJM Record at 32,400 MW Overnight',
    summary: 'Overnight wind surge pushed real-time prices negative in COMED and DAY zones for six consecutive intervals.',
    source: 'PJM', tags: ['wind', 'COMED', 'negative prices'] },
  { id: 'n6', timeAgo: '6 hr ago', headline: 'Inflation Reduction Act Tax Credits Reshape Merchant Generation Economics',
    summary: 'Production tax credits shifting dispatch economics for wind and solar, compressing spark spreads in low-demand hours.',
    source: 'Reuters', tags: ['IRA', 'solar', 'spark spread'] },
  { id: 'n7', timeAgo: '7 hr ago', headline: 'Battery Storage Developers Rush to Secure PJM Capacity Agreements',
    summary: 'Over 8 GW of 4-hour BESS projects in advanced development targeting 2026-2027 commercial operation.',
    source: 'S&P Global', tags: ['battery', 'BESS', 'capacity market'] },
];

// avg / maxWindowAverage / minWindowAverage / hourWindowLabel
// moved to ./nest/everyone/EveryoneNest (re-imported above).

// SparkSpreadChart moved to ./nest/everyone/EveryoneNest (re-imported above).

// SparkKPIView moved to ./nest/everyone/EveryoneNest.

// SOCGauge moved to ./nest/everyone/EveryoneNest (re-imported above).
// BatteryKPIView moved to ./nest/everyone/EveryoneNest.

// ── ResourceGapChart ──────────────────────────────────────────────
function ResourceGapChart({ capacity, load, regime }: { capacity: number[]; load: number[]; regime: 'ADEQUATE' | 'TIGHT' | 'EMERGENCY' }) {
  const gapColor = regime === 'ADEQUATE' ? C.alertNormal : regime === 'TIGHT' ? C.falconGold : C.alertCritical;
  const data = capacity.map((cap, i) => ({
    i, cap, load: load[i],
    label: i === 0 ? '12A' : i === 6 ? '6A' : i === 12 ? '12P' : i === 18 ? '6P' : i === 23 ? '11P' : String(i),
  }));
  const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload?.length) return null;
    const cap = payload.find((p: any) => p.dataKey === 'cap')?.value;
    const ld  = payload.find((p: any) => p.dataKey === 'load')?.value;
    return (
      <div style={{ background: C.bgOverlay, border: `1px solid ${C.borderStrong}`, borderRadius: R.md, padding: '8px 12px' }}>
        <div style={{ fontFamily: F.sans, fontSize: 11, color: C.textMuted, marginBottom: 6 }}>{payload[0]?.payload?.label}</div>
        <div style={{ fontFamily: F.mono, fontSize: 12, color: C.electricBlue, marginBottom: 3 }}>CAP {cap} GW</div>
        <div style={{ fontFamily: F.mono, fontSize: 12, color: C.textSecondary, marginBottom: 3 }}>LOAD {ld} GW</div>
        <div style={{ fontFamily: F.mono, fontSize: 12, color: gapColor, fontWeight: 600 }}>GAP {cap != null && ld != null ? (cap - ld).toFixed(1) : '—'} GW</div>
      </div>
    );
  };
  return (
    <div style={{ width: '100%', height: '100%', background: '#111318', borderRadius: R.md, padding: 4, boxSizing: 'border-box' }}>
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data} margin={{ top: 10, right: 16, bottom: 0, left: 8 }}>
          <defs>
            <linearGradient id="gapGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={gapColor} stopOpacity={0.35} />
              <stop offset="95%" stopColor={gapColor} stopOpacity={0.06} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="2 4" stroke="rgba(255,255,255,0.10)" vertical={false} />
          <XAxis dataKey="label" tick={{ fontFamily: F.mono, fontSize: 11, fill: 'rgba(229,231,235,0.55)' }} axisLine={{ stroke: 'rgba(229,231,235,0.12)' }} tickLine={false} interval={5} />
          <YAxis tick={{ fontFamily: F.mono, fontSize: 11, fill: 'rgba(229,231,235,0.55)' }} axisLine={false} tickLine={false} width={40} domain={['auto', 'auto']} />
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: C.electricBlue, strokeWidth: 1, strokeDasharray: '3 3' }} />
          <Area type="monotone" dataKey="cap" fill="url(#gapGrad)" stroke="none" isAnimationActive={false} legendType="none" />
          <Line type="monotone" dataKey="cap"  stroke={C.electricBlue}   strokeWidth={2.5} dot={false} activeDot={{ r: 5, fill: C.electricBlue,   stroke: C.bgElevated, strokeWidth: 2 }} isAnimationActive={false} name="CAPACITY" />
          <Line type="monotone" dataKey="load" stroke={C.textSecondary} strokeWidth={2.5} dot={false} activeDot={{ r: 5, fill: C.textSecondary, stroke: C.bgElevated, strokeWidth: 2 }} isAnimationActive={false} name="LOAD" />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}

// GapKPIView moved to ./nest/everyone/EveryoneNest.

// ── Full-page KPI views ───────────────────────────────────────────

function SpreadFullPage({ selectedZone }: { selectedZone: string | null }) {
  const { data: henryHub } = useHenryHub();
  const liveOps = useLiveOpsData(selectedZone);
  const gasPrice = henryHub.current_price_mmbtu;
  const gasPriceLive = henryHub.live;
  const heatRate = 7.2;
  const historyBase = liveOps.zoneHistory.length ? liveOps.zoneHistory : [
    26, 24, 22, 21, 20, 21, 28, 35, 42, 44, 43, 40,
    38, 36, 35, 34, 38, 44, 50, 52, 48, 43, 38, 32,
  ];
  const spreadHistory = historyBase.map((p) => p - gasPrice * heatRate);
  const spreadValue = (liveOps.lmpPrice || historyBase[historyBase.length - 1] || 0) - gasPrice * heatRate;
  const avg24hSpread = avg(spreadHistory);
  const peakSpread = spreadHistory.reduce((m, v) => (v > m ? v : m), -Infinity);
  const peakIdx = spreadHistory.findIndex((v) => v === peakSpread);
  const hoursBurning = spreadHistory.filter((v) => v > 0).length;
  const regime: 'BURNING' | 'SUPPRESSED' | 'NEUTRAL' =
    spreadValue > 8 ? 'BURNING' : spreadValue < 0 ? 'SUPPRESSED' : 'NEUTRAL';
  const SPARK_DATA = {
    zone: selectedZone ?? liveOps.apiZone ?? 'SYSTEM',
    regime,
    spreadValue,
    gasPrice,
    heatRate,
    powerPrice: liveOps.lmpPrice || historyBase[historyBase.length - 1] || 0,
    gasEquivPrice: gasPrice * heatRate,
    netSpread: spreadValue,
    avg24h: avg24hSpread,
    peak: { value: peakSpread, hour: `${peakIdx >= 0 ? peakIdx : 0}:00` },
    hoursBurning,
    history: spreadHistory,
  };
  const regimeColor = SPARK_DATA.regime === 'BURNING' ? C.falconGold : SPARK_DATA.regime === 'SUPPRESSED' ? C.alertCritical : C.textSecondary;
  const regimeBg = SPARK_DATA.regime === 'BURNING' ? C.falconGoldWash : SPARK_DATA.regime === 'SUPPRESSED' ? 'rgba(239,68,68,0.10)' : 'rgba(255,255,255,0.06)';
  const regimeBorder = SPARK_DATA.regime === 'BURNING' ? 'rgba(245,158,11,0.30)' : SPARK_DATA.regime === 'SUPPRESSED' ? 'rgba(239,68,68,0.30)' : 'rgba(255,255,255,0.20)';

  return (
    <div style={{ height: 'calc(100vh - 64px)', width: '100%', background: C.bgBase, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Sub-header */}
      <div style={{ height: '44px', display: 'flex', alignItems: 'center', padding: '0 24px', borderBottom: `0.5px solid ${C.borderDefault}`, flexShrink: 0, gap: '16px' }}>
        <span style={{ fontFamily: F.mono, fontSize: '11px', color: C.textMuted, letterSpacing: '0.15em' }}>SPARK SPREAD INTELLIGENCE</span>
        <span style={{ fontFamily: F.mono, fontSize: '11px', color: C.electricBlue, letterSpacing: '0.10em' }}>/ {SPARK_DATA.zone}</span>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 8px', background: regimeBg, border: `1px solid ${regimeBorder}`, borderRadius: R.sm, color: regimeColor, fontFamily: F.mono, fontSize: '10px', fontWeight: '500', letterSpacing: '0.10em' }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: regimeColor }} />
          {SPARK_DATA.regime}
        </div>
      </div>

      {/* Body */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '24px', gap: '24px', overflow: 'hidden' }}>
        {/* Top: dominant + metrics */}
        <div style={{ display: 'flex', gap: '48px', flexShrink: 0, alignItems: 'flex-end' }}>
          <div>
            <div style={{ fontFamily: F.mono, fontSize: '64px', fontWeight: '700', color: regimeColor, lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>
              {SPARK_DATA.spreadValue >= 0 ? '+' : ''}{SPARK_DATA.spreadValue.toFixed(1)}
            </div>
            <div style={{ fontFamily: F.mono, fontSize: '13px', color: C.textMuted, marginTop: '8px' }}>$/MWh NET SPREAD · {SPARK_DATA.zone}</div>
          </div>
          <div style={{ display: 'flex', gap: '1px', flex: 1 }}>
            {[
              { label: 'CURRENT SPREAD', value: `${SPARK_DATA.spreadValue >= 0 ? '+' : ''}${SPARK_DATA.spreadValue.toFixed(1)}`, color: regimeColor },
              { label: '24H AVG',         value: `+${SPARK_DATA.avg24h.toFixed(1)}`,      color: C.textPrimary },
              { label: 'GAS PRICE',       value: `$${SPARK_DATA.gasPrice}`,               color: C.textPrimary, isGas: true },
              { label: 'HEAT RATE',       value: `${SPARK_DATA.heatRate}×`,               color: C.textPrimary },
            ].map(tile => (
              <div key={tile.label} style={{ flex: 1, background: C.bgOverlay, padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontFamily: F.mono, fontSize: '10px', color: C.textMuted, letterSpacing: '0.10em', textTransform: 'uppercase' as const }}>{tile.label}</span>
                  {'isGas' in tile && tile.isGas && (
                    <span style={{ fontFamily: F.mono, fontSize: '0.5rem', color: gasPriceLive ? '#10B981' : '#FFB800', letterSpacing: '0.1em' }}>
                      {gasPriceLive ? '● LIVE' : '◐ EIA'}
                    </span>
                  )}
                </div>
                <span style={{ fontFamily: F.mono, fontSize: '22px', fontWeight: '600', color: tile.color, fontVariantNumeric: 'tabular-nums' }}>{tile.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Chart */}
        <div style={{ flex: 1, minHeight: 0, position: 'relative' }}>
          <div style={{ position: 'absolute', inset: 0 }}>
            <SparkSpreadChart history={SPARK_DATA.history} regime={SPARK_DATA.regime} />
          </div>
        </div>

        {/* Bottom panels */}
        <div style={{ display: 'flex', gap: '1px', flexShrink: 0, height: '120px' }}>
          {[
            { label: 'GAS PRICE INPUTS', color: C.falconGold, rows: [{ k: 'Henry Hub', v: `$${SPARK_DATA.gasPrice}/MMBtu` }, { k: 'Heat rate', v: `${SPARK_DATA.heatRate}×` }, { k: 'Gas equiv price', v: `$${SPARK_DATA.gasEquivPrice.toFixed(2)}/MWh` }] },
            { label: 'PLANT ECONOMICS', color: C.electricBlue, rows: [{ k: 'Power price', v: `$${SPARK_DATA.powerPrice.toFixed(2)}/MWh` }, { k: 'Net spread', v: `+$${SPARK_DATA.netSpread.toFixed(2)}/MWh` }, { k: 'Hrs burning', v: `${SPARK_DATA.hoursBurning}/24` }] },
            { label: 'DISPATCH SIGNAL', color: C.textPrimary, rows: [{ k: 'Status', v: SPARK_DATA.regime }, { k: '24H avg', v: `+$${SPARK_DATA.avg24h.toFixed(1)}/MWh` }, { k: 'Peak spread', v: `+$${SPARK_DATA.peak.value.toFixed(1)} at ${SPARK_DATA.peak.hour}` }] },
          ].map(panel => (
            <div key={panel.label} style={{ flex: 1, background: C.bgOverlay, borderLeft: `2px solid ${panel.color}`, padding: '12px 16px' }}>
              <div style={{ fontFamily: F.mono, fontSize: '10px', color: C.textMuted, letterSpacing: '0.10em', textTransform: 'uppercase' as const, marginBottom: '10px' }}>{panel.label}</div>
              {panel.rows.map(row => (
                <div key={row.k} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ fontFamily: F.mono, fontSize: '12px', color: C.textMuted }}>{row.k}</span>
                  <span style={{ fontFamily: F.mono, fontSize: '12px', color: C.textPrimary, fontVariantNumeric: 'tabular-nums' }}>{row.v}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── ChargeScheduleChart ──────────────────────────────────────────
function ChargeScheduleChart({ chargeLMP, dischargeLMP }: { chargeLMP: number; dischargeLMP: number }) {
  const priceData = [
    26,24,22,21,20,21,28,35,42,44,43,40,
    38,36,35,34,38,44,50,52,48,43,38,32,
  ].map((price, i) => ({
    hour: i,
    label: i === 0 ? '12A' : i === 6 ? '6A' : i === 12 ? '12P' : i === 18 ? '6P' : i === 23 ? '11P' : String(i),
    price,
    action: price <= chargeLMP ? 'charge' : price >= dischargeLMP ? 'discharge' : 'idle',
    chargeBar:    price <= chargeLMP    ? price : 0,
    dischargeBar: price >= dischargeLMP ? price : 0,
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload?.length) return null;
    const d = payload[0]?.payload;
    const actionColor = d.action === 'charge' ? C.electricBlue : d.action === 'discharge' ? C.falconGold : C.textMuted;
    return (
      <div style={{ background: C.bgOverlay, border: `1px solid ${C.borderStrong}`, borderRadius: R.md, padding: '8px 12px' }}>
        <div style={{ fontFamily: F.sans, fontSize: 11, color: C.textMuted, marginBottom: 4 }}>{d.label}</div>
        <div style={{ fontFamily: F.mono, fontSize: 14, fontWeight: 600, color: C.textPrimary, marginBottom: 3, fontVariantNumeric: 'tabular-nums' }}>${d.price}/MWh</div>
        <div style={{ fontFamily: F.mono, fontSize: 11, color: actionColor, letterSpacing: '0.08em', textTransform: 'uppercase' as const }}>{d.action}</div>
      </div>
    );
  };

  return (
    <div style={{ width: '100%', height: '100%', background: '#111318', borderRadius: R.md, padding: 4, boxSizing: 'border-box' as const }}>
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={priceData} margin={{ top: 10, right: 16, bottom: 0, left: 8 }}>
          <CartesianGrid strokeDasharray="2 4" stroke="rgba(255,255,255,0.10)" vertical={false} />
          <ReferenceLine y={chargeLMP} stroke={C.electricBlue} strokeDasharray="3 3" strokeOpacity={0.5}
            label={{ value: 'CHARGE', position: 'insideTopRight', style: { fontFamily: F.mono, fontSize: 9, fill: C.electricBlue } }} />
          <ReferenceLine y={dischargeLMP} stroke={C.falconGold} strokeDasharray="3 3" strokeOpacity={0.5}
            label={{ value: 'DISCHARGE', position: 'insideTopRight', style: { fontFamily: F.mono, fontSize: 9, fill: C.falconGold } }} />
          <XAxis dataKey="label" tick={{ fontFamily: F.mono, fontSize: 11, fill: 'rgba(229,231,235,0.55)' }} axisLine={{ stroke: 'rgba(229,231,235,0.12)' }} tickLine={false} interval={5} />
          <YAxis tick={{ fontFamily: F.mono, fontSize: 11, fill: 'rgba(229,231,235,0.55)' }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v}`} width={40} />
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: C.electricBlue, strokeWidth: 1, strokeDasharray: '3 3' }} />
          <Bar dataKey="chargeBar" fill={C.electricBlue} opacity={0.35} isAnimationActive={false} name="CHARGE" />
          <Bar dataKey="dischargeBar" fill={C.falconGold} opacity={0.35} isAnimationActive={false} name="DISCHARGE" />
          <Line type="monotone" dataKey="price" stroke={C.textSecondary} strokeWidth={2} dot={false}
            activeDot={{ r: 5, fill: C.textSecondary, stroke: C.bgElevated, strokeWidth: 2 }} isAnimationActive={false} name="PRICE" />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}

function BatteryFullPage({ selectedZone }: { selectedZone: string | null }) {
  const liveOps = useLiveOpsData(selectedZone);
  // User-controlled parameters
  const [batteryMW,   setBatteryMW]   = useState(100);
  const [durationH,   setDurationH]   = useState(4);
  const [efficiency,  setEfficiency]  = useState(87);
  const [cyclingCost, setCyclingCost] = useState(20);

  // Derived calculations
  const energyMWh        = batteryMW * durationH;
  const history = liveOps.zoneHistory.length ? liveOps.zoneHistory : [
    26, 24, 22, 21, 20, 21, 28, 35, 42, 44, 43, 40,
    38, 36, 35, 34, 38, 44, 50, 52, 48, 43, 38, 32,
  ];
  const chargeWindow = minWindowAverage(history, durationH);
  const dischargeWindow = maxWindowAverage(history, durationH);
  const chargeLMP        = chargeWindow.value;
  const dischargeLMP     = dischargeWindow.value;
  const grossSpread      = dischargeLMP - chargeLMP;
  const efficiencyFactor = efficiency / 100;
  const netSpread        = (grossSpread * efficiencyFactor) - cyclingCost;
  const dailyRevenue     = Math.round(netSpread * energyMWh);
  const grossRevenue     = Math.round(grossSpread * efficiencyFactor * energyMWh);

  // Arbitrage signal
  const signal: 'HIGH' | 'MODERATE' | 'LOW' = netSpread > 25 ? 'HIGH' : netSpread > 12 ? 'MODERATE' : 'LOW';
  const signalColor = signal === 'HIGH' ? C.falconGold : signal === 'MODERATE' ? C.electricBlue : C.textSecondary;

  const targetSoc = Math.max(15, Math.min(95, Math.round(((history[history.length - 1] - Math.min(...history)) / (Math.max(...history) - Math.min(...history) || 1)) * 100)));
  const isCharging = history[history.length - 1] <= chargeLMP + 0.5;
  const stateBadgeColor = isCharging ? C.alertNormal : C.falconGold;

  const inputStyle: React.CSSProperties = {
    background: C.bgSurface,
    border: `1px solid ${C.borderDefault}`,
    borderRadius: R.md,
    color: C.textPrimary,
    fontFamily: F.mono,
    fontSize: '15px',
    fontWeight: '600',
    padding: '4px 8px',
    outline: 'none',
    fontVariantNumeric: 'tabular-nums',
  };

  return (
    <div style={{ height: 'calc(100vh - 64px)', width: '100%', background: C.bgBase, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* ROW 1 — Sub-header */}
      <div style={{ height: '44px', display: 'flex', alignItems: 'center', padding: '0 24px', borderBottom: `0.5px solid ${C.borderDefault}`, flexShrink: 0, gap: '16px' }}>
        <span style={{ fontFamily: F.mono, fontSize: '11px', color: C.textMuted, letterSpacing: '0.15em' }}>BATTERY ARBITRAGE</span>
        <span style={{ fontFamily: F.mono, fontSize: '11px', color: C.electricBlue, letterSpacing: '0.10em' }}>/ {selectedZone ?? 'WEST HUB'}</span>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '2px 8px', borderRadius: R.sm, backgroundColor: `${stateBadgeColor}18`, border: `1px solid ${stateBadgeColor}50` }}>
          <span style={{ fontFamily: F.mono, fontSize: T.labelSize, color: stateBadgeColor, letterSpacing: T.labelSpacing }}>{isCharging ? 'CHARGING' : 'DISCHARGING'}</span>
        </div>
      </div>

      {/* ROW 2 — Parameters */}
      <div style={{ display: 'flex', gap: S.xl, flexShrink: 0, padding: `${S.md} 24px`, borderBottom: `1px solid ${C.borderDefault}`, alignItems: 'center' }}>
        {/* Battery Size */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: S.xs }}>
          <span style={{ fontFamily: F.mono, fontSize: '10px', color: C.textMuted, letterSpacing: '0.10em', textTransform: 'uppercase' as const }}>BATTERY SIZE</span>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: S.xs }}>
            <input type="number" value={batteryMW} onChange={e => setBatteryMW(Math.max(1, Number(e.target.value)))} style={{ ...inputStyle, width: '72px' }} />
            <span style={{ fontFamily: F.mono, fontSize: '11px', color: C.textMuted }}>MW</span>
          </div>
        </div>
        {/* Duration */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: S.xs }}>
          <span style={{ fontFamily: F.mono, fontSize: '10px', color: C.textMuted, letterSpacing: '0.10em', textTransform: 'uppercase' as const }}>DURATION</span>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: S.xs }}>
            <input type="number" value={durationH} min={1} max={12} onChange={e => setDurationH(Math.max(1, Math.min(12, Number(e.target.value))))} style={{ ...inputStyle, width: '56px' }} />
            <span style={{ fontFamily: F.mono, fontSize: '11px', color: C.textMuted }}>H</span>
          </div>
        </div>
        {/* Divider */}
        <div style={{ width: '1px', height: '40px', background: C.borderDefault }} />
        {/* Efficiency slider */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: S.xs, flex: 1, maxWidth: '220px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontFamily: F.mono, fontSize: '10px', color: C.textMuted, letterSpacing: '0.10em', textTransform: 'uppercase' as const }}>ROUND-TRIP EFF.</span>
            <span style={{ fontFamily: F.mono, fontSize: '10px', color: C.electricBlue, fontVariantNumeric: 'tabular-nums' }}>{efficiency}%</span>
          </div>
          <input type="range" min={60} max={98} value={efficiency} onChange={e => setEfficiency(Number(e.target.value))} style={{ width: '100%', accentColor: C.electricBlue, cursor: 'pointer' }} />
        </div>
        {/* Cycling cost slider */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: S.xs, flex: 1, maxWidth: '220px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontFamily: F.mono, fontSize: '10px', color: C.textMuted, letterSpacing: '0.10em', textTransform: 'uppercase' as const }}>CYCLING COST</span>
            <span style={{ fontFamily: F.mono, fontSize: '10px', color: C.falconGold, fontVariantNumeric: 'tabular-nums' }}>${cyclingCost}/MWh</span>
          </div>
          <input type="range" min={0} max={60} value={cyclingCost} onChange={e => setCyclingCost(Number(e.target.value))} style={{ width: '100%', accentColor: C.falconGold, cursor: 'pointer' }} />
        </div>
      </div>

      {/* ROW 3 — Computed metrics */}
      <div style={{ display: 'flex', gap: '1px', flexShrink: 0 }}>
        {[
          { label: 'NET PROFIT',  value: `$${dailyRevenue.toLocaleString()}`, sub: '/day', color: C.falconGold },
          { label: 'NET SPREAD',  value: `+$${netSpread.toFixed(2)}`,         sub: '/MWh', color: C.falconGold },
          { label: 'ENERGY CAP',  value: `${energyMWh}`,                      sub: ' MWh', color: C.textPrimary },
          { label: 'ARB SIGNAL',  value: signal,                               sub: '',     color: signalColor },
        ].map(tile => (
          <div key={tile.label} style={{ flex: 1, background: C.bgSurface, padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <span style={{ fontFamily: F.mono, fontSize: '10px', color: C.textMuted, letterSpacing: '0.10em', textTransform: 'uppercase' as const }}>{tile.label}</span>
            <span style={{ fontFamily: F.mono, fontSize: '22px', fontWeight: '600', color: tile.color, fontVariantNumeric: 'tabular-nums' }}>
              {tile.value}<span style={{ fontSize: '12px', color: C.textMuted }}>{tile.sub}</span>
            </span>
          </div>
        ))}
      </div>

      {/* ROW 4 — Left: signal+ops+gauge | Right: schedule chart */}
      <div style={{ flex: 1, display: 'flex', padding: '16px 24px', gap: '24px', overflow: 'hidden', minHeight: 0 }}>
        {/* Left column */}
        <div style={{ width: '220px', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: S.lg, overflowY: 'auto' }}>
          {/* SOC gauge */}
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <SOCGauge soc={targetSoc} size={140} />
          </div>
          {/* Arbitrage signal */}
          <div style={{ background: C.bgSurface, padding: S.lg, borderRadius: R.md, borderLeft: `2px solid ${signalColor}` }}>
            <div style={{ fontFamily: F.mono, fontSize: '10px', color: C.textMuted, letterSpacing: '0.10em', marginBottom: S.sm }}>ARB SIGNAL</div>
            <div style={{ fontFamily: F.mono, fontSize: '18px', fontWeight: '700', color: signalColor, marginBottom: S.xs }}>{signal}</div>
            <div style={{ fontFamily: F.sans, fontSize: '11px', color: C.textMuted, lineHeight: 1.4 }}>
              {signal === 'HIGH' ? 'Strong price separation. Maximize cycles.'
               : signal === 'MODERATE' ? 'Moderate spread. Standard operations.'
               : 'Low spread. Consider reducing cycles.'}
            </div>
          </div>
          {/* Daily operations */}
          <div style={{ background: C.bgSurface, padding: S.lg, borderRadius: R.md }}>
            <div style={{ fontFamily: F.mono, fontSize: '10px', color: C.textMuted, letterSpacing: '0.10em', marginBottom: S.md }}>DAILY OPERATIONS</div>
            {[
              { label: 'Charging',    hours: durationH,          color: C.electricBlue },
              { label: 'Discharging', hours: durationH,          color: C.falconGold },
              { label: 'Idle',        hours: 24 - durationH * 2, color: C.textMuted },
            ].map(op => (
              <div key={op.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: S.sm }}>
                <span style={{ fontFamily: F.sans, fontSize: '12px', color: C.textSecondary }}>{op.label}</span>
                <span style={{ fontFamily: F.mono, fontSize: '13px', fontWeight: '600', color: op.color, fontVariantNumeric: 'tabular-nums' }}>{op.hours}h</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: schedule chart */}
        <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ fontFamily: F.mono, fontSize: T.labelSize, color: C.textMuted, letterSpacing: T.labelSpacing, textTransform: 'uppercase' as const, flexShrink: 0 }}>CHARGE / DISCHARGE SCHEDULE</div>
          <div style={{ flex: 1, minHeight: 0, position: 'relative' }}>
            <div style={{ position: 'absolute', inset: 0 }}>
              <ChargeScheduleChart chargeLMP={chargeLMP} dischargeLMP={dischargeLMP} />
            </div>
          </div>
        </div>
      </div>

      {/* ROW 5 — Bottom panels */}
      <div style={{ display: 'flex', gap: '1px', flexShrink: 0, height: '110px', borderTop: `0.5px solid ${C.borderDefault}` }}>
        {[
          { label: 'CHARGE WINDOW', color: C.alertNormal, rows: [{ k: 'Window', v: hourWindowLabel(chargeWindow.start, durationH) }, { k: 'Avg price', v: `$${chargeLMP.toFixed(2)}/MWh` }, { k: 'Duration', v: `${durationH}h` }] },
          { label: 'DISCHARGE WINDOW', color: C.falconGold, rows: [{ k: 'Window', v: hourWindowLabel(dischargeWindow.start, durationH) }, { k: 'Avg price', v: `$${dischargeLMP.toFixed(2)}/MWh` }, { k: 'Duration', v: `${durationH}h` }] },
          { label: 'ARBITRAGE ECONOMICS', color: C.electricBlue, rows: [{ k: 'Gross spread', v: `+$${grossSpread.toFixed(2)}/MWh` }, { k: 'After eff+cost', v: `+$${netSpread.toFixed(2)}/MWh` }, { k: 'Net revenue', v: `$${grossRevenue.toLocaleString()} gross − $${(grossRevenue - dailyRevenue).toLocaleString()} costs = $${dailyRevenue.toLocaleString()}/day` }] },
        ].map(panel => (
          <div key={panel.label} style={{ flex: 1, background: C.bgOverlay, borderLeft: `2px solid ${panel.color}`, padding: '12px 16px' }}>
            <div style={{ fontFamily: F.mono, fontSize: '10px', color: C.textMuted, letterSpacing: '0.10em', textTransform: 'uppercase' as const, marginBottom: '8px' }}>{panel.label}</div>
            {panel.rows.map(row => (
              <div key={row.k} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ fontFamily: F.mono, fontSize: '11px', color: C.textMuted }}>{row.k}</span>
                <span style={{ fontFamily: F.mono, fontSize: '11px', color: C.textPrimary, fontVariantNumeric: 'tabular-nums' }}>{row.v}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── ReliabilityGauge ─────────────────────────────────────────────
function ReliabilityGauge({ score, color }: { score: number; color: string }) {
  const SIZE = 120, CX = 60, CY = 70, RAD = 44, STROKE = 7;
  const START = 200, SWEEP = 140;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const pt = (deg: number) => ({ x: CX + RAD * Math.cos(toRad(deg)), y: CY + RAD * Math.sin(toRad(deg)) });
  const filled = (score / 10) * SWEEP;
  const bgS = pt(START), bgE = pt(START + SWEEP), fgE = pt(START + filled);
  const bgLarge = SWEEP > 180 ? 1 : 0, fgLarge = filled > 180 ? 1 : 0;

  return (
    <svg width={SIZE} height={SIZE * 0.75} viewBox={`0 0 ${SIZE} ${SIZE * 0.75}`}>
      <path d={`M ${bgS.x} ${bgS.y} A ${RAD} ${RAD} 0 ${bgLarge} 1 ${bgE.x} ${bgE.y}`}
        fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth={STROKE} strokeLinecap="round" />
      {score > 0 && (
        <path d={`M ${bgS.x} ${bgS.y} A ${RAD} ${RAD} 0 ${fgLarge} 1 ${fgE.x} ${fgE.y}`}
          fill="none" stroke={color} strokeWidth={STROKE} strokeLinecap="round"
          style={{ filter: `drop-shadow(0 0 5px ${color}60)` }} />
      )}
      <text x={CX} y={CY - 4} textAnchor="middle"
        style={{ fontFamily: F.mono, fontSize: '24px', fontWeight: '700', fill: color, fontVariantNumeric: 'tabular-nums' }}>
        {score.toFixed(1)}
      </text>
      <text x={CX} y={CY + 14} textAnchor="middle"
        style={{ fontFamily: F.mono, fontSize: '9px', fill: C.textMuted }}>
        / 10
      </text>
    </svg>
  );
}

// ── SupplyGapWaterfall ──────────────────────────────────────────
function SupplyGapWaterfall({ data, loadForecast }: { data: { name: string; value: number; type: string }[]; loadForecast: number }) {
  const COLORS: Record<string, string> = {
    base: C.textSecondary, negative: C.alertCritical, positive: C.alertNormal,
    result: C.electricBlue, benchmark: C.falconGold,
  };
  const chartData = data.map(d => ({
    ...d,
    displayValue: Math.abs(d.value),
    fill: COLORS[d.type] ?? C.textMuted,
    label: `${d.value > 0 ? '+' : ''}${(d.value / 1000).toFixed(1)} GW`,
  }));
  const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload?.length) return null;
    const d = payload[0]?.payload;
    return (
      <div style={{ background: C.bgOverlay, border: `1px solid ${C.borderStrong}`, borderRadius: R.md, padding: '8px 12px' }}>
        <div style={{ fontFamily: F.sans, fontSize: 11, color: C.textMuted, marginBottom: 4 }}>{d.name.replace('\n', ' ')}</div>
        <div style={{ fontFamily: F.mono, fontSize: 14, fontWeight: 600, color: d.fill, fontVariantNumeric: 'tabular-nums' }}>{d.label}</div>
      </div>
    );
  };

  return (
    <div style={{ width: '100%', height: '100%', background: '#111318', borderRadius: R.md, padding: 4, boxSizing: 'border-box' as const }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 20, right: 24, bottom: 24, left: 48 }} barCategoryGap="30%">
          <CartesianGrid strokeDasharray="2 4" stroke="rgba(255,255,255,0.10)" vertical={false} />
          <XAxis dataKey="name" tick={{ fontFamily: F.mono, fontSize: 11, fill: 'rgba(229,231,235,0.55)' }} axisLine={{ stroke: 'rgba(229,231,235,0.12)' }} tickLine={false} />
          <YAxis tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} tick={{ fontFamily: F.mono, fontSize: 11, fill: 'rgba(229,231,235,0.55)' }} axisLine={false} tickLine={false} width={44} />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.04)' }} />
          <ReferenceLine y={loadForecast} stroke={C.falconGold} strokeDasharray="4 4" strokeOpacity={0.6}
            label={{ value: 'LOAD FORECAST', position: 'insideTopRight', style: { fontFamily: F.mono, fontSize: 9, fill: C.falconGold } }} />
          <Bar dataKey="displayValue" isAnimationActive={false} radius={[3, 3, 0, 0]}>
            {chartData.map((entry, index) => (
              <Cell key={index} fill={entry.fill} fillOpacity={0.85} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

function GapFullPage({ selectedZone }: { selectedZone: string | null }) {
  const liveOps = useLiveOpsData(selectedZone);
  const { data: fuelMixData } = useFuelMix();
  const [activeView, setActiveView] = useState<'realtime' | 'structural'>('realtime');

  const capacityData = [68,69,70,71,72,72,73,74,74,73,72,71,70,70,71,72,73,74,73,72,71,70,69,68];
  const loadData     = [52,50,49,48,50,54,60,65,66,67,68,67,66,65,64,65,67,70,71,70,66,62,58,55];
  const generationMw = (fuelMixData.fuels ?? []).reduce((s, x) => s + x.mw, 0);
  const loadForecastMw = liveOps.loadForecastMw || generationMw * 0.9;
  const actualLoadMw = liveOps.actualLoadMw || loadForecastMw;
  const capacityMw = generationMw > 0 ? generationMw : loadForecastMw * 1.15;
  const reserveMargin = loadForecastMw > 0 ? ((capacityMw - loadForecastMw) / loadForecastMw) * 100 : 0;
  const systemLoadGw = loadForecastMw / 1000;
  const capacityGw = capacityMw / 1000;
  const peakForecastGw = Math.max(systemLoadGw, actualLoadMw / 1000);
  const gapColor   = reserveMargin < 15 ? C.alertCritical : reserveMargin < 18 ? C.falconGold : C.electricBlue;
  const badgeLabel = reserveMargin < 15 ? 'EMERGENCY' : reserveMargin < 18 ? 'TIGHT' : 'ADEQUATE';
  const badgeBg    = reserveMargin < 15 ? `${C.alertCritical}18` : reserveMargin < 18 ? `${C.falconGold}18` : `${C.electricBlue}18`;
  const badgeBorder= reserveMargin < 15 ? `${C.alertCritical}50` : reserveMargin < 18 ? `${C.falconGold}50` : `${C.electricBlue}50`;

  // Structural data
  const STRUCTURAL = {
    reliabilityScore: 4.2,
    riskLabel: 'LOW RISK' as 'LOW RISK' | 'MODERATE RISK' | 'HIGH RISK',
    waterfall: [
      { name: 'Current\nCapacity',      value: 152100, type: 'base'      },
      { name: 'Scheduled\nRetirements', value: -8400,  type: 'negative'  },
      { name: 'New\nProjects',          value: 11200,  type: 'positive'  },
      { name: 'Net\nPosition',          value: 154900, type: 'result'    },
      { name: 'Load\nForecast',         value: 134200, type: 'benchmark' },
    ],
    netPosition:  154900,
    loadForecast: 134200,
    gap:          20700,
    investmentSignal: {
      headline: 'Balanced supply outlook.',
      detail: 'Monitor coal retirements scheduled for 2026–2028. Wind additions compensating for thermal exits. Reserve margin buffer is adequate but narrowing toward summer peak.',
    },
  };
  const riskColor = STRUCTURAL.reliabilityScore < 4 ? C.alertNormal : STRUCTURAL.reliabilityScore < 7 ? C.falconGold : C.alertCritical;

  return (
    <div style={{ height: 'calc(100vh - 64px)', width: '100%', background: C.bgBase, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Sub-header */}
      <div style={{ height: '44px', display: 'flex', alignItems: 'center', padding: '0 24px', borderBottom: `0.5px solid ${C.borderDefault}`, flexShrink: 0, gap: '16px' }}>
        <span style={{ fontFamily: F.mono, fontSize: '11px', color: C.textMuted, letterSpacing: '0.15em' }}>RESOURCE GAP ANALYSIS</span>
        <span style={{ fontFamily: F.mono, fontSize: '11px', color: C.electricBlue, letterSpacing: '0.10em' }}>/ {selectedZone ?? 'WEST HUB'}</span>
        <div style={{ display: 'inline-flex', alignItems: 'center', padding: '2px 8px', borderRadius: R.sm, backgroundColor: badgeBg, border: `1px solid ${badgeBorder}` }}>
          <span style={{ fontFamily: F.mono, fontSize: T.labelSize, color: gapColor, letterSpacing: T.labelSpacing }}>{badgeLabel}</span>
        </div>
      </div>

      {/* Metrics strip */}
      <div style={{ display: 'flex', gap: '1px', flexShrink: 0 }}>
        {[
          { label: 'RESERVE MARGIN', value: `${reserveMargin.toFixed(1)}%`, color: gapColor },
          { label: 'SYSTEM LOAD',    value: `${systemLoadGw.toFixed(1)} GW`, color: C.textPrimary },
          { label: 'INSTALLED CAP',  value: `${capacityGw.toFixed(1)} GW`,   color: C.electricBlue },
          { label: 'PEAK FORECAST',  value: `${peakForecastGw.toFixed(1)} GW`, color: C.falconGold },
        ].map(tile => (
          <div key={tile.label} style={{ flex: 1, background: C.bgOverlay, padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <span style={{ fontFamily: F.mono, fontSize: '10px', color: C.textMuted, letterSpacing: '0.10em', textTransform: 'uppercase' as const }}>{tile.label}</span>
            <span style={{ fontFamily: F.mono, fontSize: '22px', fontWeight: '600', color: tile.color, fontVariantNumeric: 'tabular-nums' }}>{tile.value}</span>
          </div>
        ))}
      </div>

      {/* View tabs */}
      <div style={{ display: 'flex', gap: 0, flexShrink: 0, borderBottom: `1px solid ${C.borderDefault}` }}>
        {[
          { id: 'realtime',   label: '24H REAL-TIME' },
          { id: 'structural', label: 'SUPPLY GAP ANALYSIS' },
        ].map(tab => (
          <button key={tab.id} onClick={() => setActiveView(tab.id as 'realtime' | 'structural')} style={{
            padding: '8px 20px', background: 'transparent', border: 'none',
            borderBottom: activeView === tab.id ? `2px solid ${C.electricBlue}` : '2px solid transparent',
            color: activeView === tab.id ? C.electricBlue : C.textMuted,
            fontFamily: F.mono, fontSize: '10px', fontWeight: '500', letterSpacing: '0.10em',
            textTransform: 'uppercase' as const, cursor: 'pointer',
            transition: 'all 150ms cubic-bezier(0.4, 0, 0.2, 1)',
          }}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Body — conditional on active view */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '16px 24px', overflow: 'hidden', minHeight: 0 }}>

        {activeView === 'realtime' && (
          <>
            {/* Dominant number */}
            <div style={{ flexShrink: 0, marginBottom: S.lg }}>
              <div style={{ fontFamily: F.mono, fontSize: '48px', fontWeight: 300, color: gapColor, lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>
                {reserveMargin.toFixed(1)}%
              </div>
              <div style={{ fontFamily: F.mono, fontSize: '12px', color: C.textMuted, marginTop: '6px' }}>
                RESERVE MARGIN · {selectedZone ?? 'WEST HUB'} · 15.0% REQUIRED · <span style={{ color: gapColor }}>+{(reserveMargin - 15).toFixed(1)}% BUFFER</span>
              </div>
            </div>
            {/* 24H chart */}
            <div style={{ flex: 1, minHeight: 0, position: 'relative' }}>
              <div style={{ position: 'absolute', inset: 0 }}>
                <ResourceGapChart capacity={capacityData} load={loadData} regime={badgeLabel as 'ADEQUATE' | 'TIGHT' | 'EMERGENCY'} />
              </div>
            </div>
          </>
        )}

        {activeView === 'structural' && (
          <div style={{ flex: 1, minHeight: 0, display: 'flex', gap: S.xl, overflow: 'hidden' }}>
            {/* LEFT — Risk gauge + signal + gap + methodology */}
            <div style={{ width: '280px', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: S.lg, overflowY: 'auto' }}>
              {/* Reliability Risk Score */}
              <div style={{ background: C.bgSurface, borderRadius: R.lg, padding: S.lg, borderLeft: `2px solid ${riskColor}` }}>
                <div style={{ fontFamily: F.mono, fontSize: '10px', color: C.textMuted, letterSpacing: '0.10em', textTransform: 'uppercase' as const, marginBottom: S.md }}>RELIABILITY RISK SCORE</div>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: S.md }}>
                  <ReliabilityGauge score={STRUCTURAL.reliabilityScore} color={riskColor} />
                </div>
                <div style={{ textAlign: 'center' as const }}>
                  <div style={{ fontFamily: F.mono, fontSize: '13px', fontWeight: '600', color: riskColor, letterSpacing: '0.10em' }}>{STRUCTURAL.riskLabel}</div>
                  <div style={{ fontFamily: F.sans, fontSize: '11px', color: C.textMuted, marginTop: S.xs }}>PJM system adequacy</div>
                </div>
              </div>

              {/* Strategic Investment Signal */}
              <div style={{ background: C.bgSurface, borderRadius: R.lg, padding: S.lg, borderLeft: `2px solid ${C.electricBlue}` }}>
                <div style={{ fontFamily: F.mono, fontSize: '10px', color: C.textMuted, letterSpacing: '0.10em', textTransform: 'uppercase' as const, marginBottom: S.md }}>STRATEGIC SIGNAL</div>
                <div style={{ fontFamily: F.sans, fontSize: '13px', fontWeight: '600', color: C.textPrimary, marginBottom: S.sm, lineHeight: 1.4 }}>{STRUCTURAL.investmentSignal.headline}</div>
                <div style={{ fontFamily: F.sans, fontSize: '12px', color: C.textSecondary, lineHeight: 1.6 }}>{STRUCTURAL.investmentSignal.detail}</div>
              </div>

              {/* Gap summary */}
              <div style={{ background: C.bgSurface, borderRadius: R.lg, padding: S.lg }}>
                {[
                  { label: 'NET POSITION',  value: `${(STRUCTURAL.netPosition / 1000).toFixed(1)} GW`,  color: C.electricBlue },
                  { label: 'LOAD FORECAST', value: `${(STRUCTURAL.loadForecast / 1000).toFixed(1)} GW`, color: C.textPrimary },
                  { label: 'CAPACITY GAP',  value: `+${(STRUCTURAL.gap / 1000).toFixed(1)} GW`,         color: C.alertNormal },
                ].map((row, i) => (
                  <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', paddingBottom: i < 2 ? S.sm : 0, marginBottom: i < 2 ? S.sm : 0, borderBottom: i < 2 ? `1px solid ${C.borderDefault}` : 'none' }}>
                    <span style={{ fontFamily: F.mono, fontSize: '10px', color: C.textMuted, letterSpacing: '0.08em' }}>{row.label}</span>
                    <span style={{ fontFamily: F.mono, fontSize: '14px', fontWeight: '600', color: row.color, fontVariantNumeric: 'tabular-nums' }}>{row.value}</span>
                  </div>
                ))}
              </div>

              {/* Methodology */}
              <div style={{ background: C.bgSurface, borderRadius: R.lg, padding: S.lg, opacity: 0.7 }}>
                <div style={{ fontFamily: F.mono, fontSize: '9px', color: C.textMuted, letterSpacing: '0.10em', textTransform: 'uppercase' as const, marginBottom: S.sm }}>METHODOLOGY</div>
                <div style={{ fontFamily: F.sans, fontSize: '11px', color: C.textMuted, lineHeight: 1.6 }}>
                  <strong style={{ color: C.textSecondary }}>Resource Adequacy</strong> measures whether the grid has sufficient generation capacity to meet forecasted demand plus reserves. Reliability scores above 7 indicate supply deficits requiring new capacity additions. <strong style={{ color: C.textSecondary }}>RMR</strong> (Reliability Must Run) units are generators kept online specifically for local reliability despite being uneconomic.
                </div>
              </div>
            </div>

            {/* RIGHT — Waterfall chart */}
            <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: S.md }}>
              <div style={{ fontFamily: F.mono, fontSize: '10px', color: C.textMuted, letterSpacing: '0.10em', textTransform: 'uppercase' as const }}>SUPPLY GAP ANALYSIS — CAPACITY WATERFALL vs LOAD FORECAST (MW)</div>
              <div style={{ flex: 1, minHeight: 0 }}>
                <SupplyGapWaterfall data={STRUCTURAL.waterfall} loadForecast={STRUCTURAL.loadForecast} />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom panels */}
      <div style={{ display: 'flex', gap: '1px', flexShrink: 0, height: '110px', borderTop: `0.5px solid ${C.borderDefault}` }}>
        {[
          { label: 'CAPACITY POSITION', color: C.electricBlue, rows: [{ k: 'Installed', v: `${capacityGw.toFixed(1)} GW` }, { k: 'Committed', v: `${(capacityGw * 0.95).toFixed(1)} GW` }, { k: 'Available', v: `${(capacityGw * 0.05).toFixed(1)} GW` }] },
          { label: 'LOAD ANALYSIS', color: C.textSecondary, rows: [{ k: 'Current load', v: `${(actualLoadMw / 1000).toFixed(1)} GW` }, { k: 'Peak forecast', v: `${peakForecastGw.toFixed(1)} GW` }, { k: 'Avg 24H', v: `${(avg(loadData)).toFixed(1)} GW` }] },
          { label: 'SYSTEM STATUS', color: gapColor, rows: [{ k: 'Reserve margin', v: `${reserveMargin.toFixed(1)}%` }, { k: 'Status', v: badgeLabel }, { k: 'Required min', v: '15.0%' }] },
        ].map(panel => (
          <div key={panel.label} style={{ flex: 1, background: C.bgOverlay, borderLeft: `2px solid ${panel.color}`, padding: '12px 16px' }}>
            <div style={{ fontFamily: F.mono, fontSize: '10px', color: C.textMuted, letterSpacing: '0.10em', textTransform: 'uppercase' as const, marginBottom: '8px' }}>{panel.label}</div>
            {panel.rows.map(row => (
              <div key={row.k} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                <span style={{ fontFamily: F.mono, fontSize: '11px', color: C.textMuted }}>{row.k}</span>
                <span style={{ fontFamily: F.mono, fontSize: '11px', color: C.textPrimary, fontVariantNumeric: 'tabular-nums' }}>{row.v}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── PeregrineFeed ────────────────────────────────────────────────
// No longer rendered in The Nest (moved to Analytics). Kept + exported
// so the code path remains available if we reinstate an inline feed.
export function PeregrineFeed({ onZoneClick, onOpenFull }: { onZoneClick: (zoneId: string) => void; onOpenFull?: () => void }) {
  const [feedMode, setFeedMode]         = useState<'market' | 'news'>('market');
  const [activeFilter, setActiveFilter] = useState<AlertCategory | 'ALL'>('ALL');
  const [expandedId, setExpandedId]     = useState<string | null>(null);

  const filteredAlerts = activeFilter === 'ALL' ? FEED_ALERTS : FEED_ALERTS.filter(a => a.category === activeFilter);
  const activeCategories = Array.from(new Set(FEED_ALERTS.map(a => a.category)));

  const sourceColor = (src: string) =>
    src === 'Bloomberg' ? C.falconGold : src === 'Reuters' ? C.electricBlue : src === 'PJM' ? C.alertNormal : C.textSecondary;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>

      {/* Card label */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 16px', borderBottom: `0.5px solid ${C.borderDefault}`, flexShrink: 0 }}>
        <span style={{ fontFamily: F.mono, fontSize: '10px', fontWeight: '600', letterSpacing: '0.14em', textTransform: 'uppercase' as const, color: C.textMuted }}>PEREGRINE FEED</span>
        {onOpenFull && (
          <span onClick={onOpenFull} style={{ fontFamily: F.mono, fontSize: '8px', color: 'rgba(255,255,255,0.2)', letterSpacing: '0.1em', cursor: 'pointer' }}>
            ↗ EXPAND
          </span>
        )}
      </div>

      {/* Top: regime badge + status */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: `${S.sm} ${S.lg}`, flexShrink: 0, background: 'rgba(6,182,212,0.04)', borderBottom: `1px solid ${C.borderDefault}` }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '3px 8px', background: 'rgba(6,182,212,0.08)', border: '1px solid rgba(6,182,212,0.25)', borderRadius: R.sm }}>
          <div style={{ width: 5, height: 5, borderRadius: '50%', background: C.electricBlue, animation: 'livePulse 2s infinite' }} />
          <span style={{ fontFamily: F.mono, fontSize: '10px', fontWeight: '600', color: C.electricBlue, letterSpacing: '0.10em' }}>NORMAL</span>
          <span style={{ fontFamily: F.sans, fontSize: '10px', color: C.textMuted }}>· Balanced supply</span>
        </div>
      </div>

      {/* Feed mode tabs */}
      <div style={{ display: 'flex', flexShrink: 0, borderBottom: `1px solid ${C.borderDefault}` }}>
        {[
          { id: 'market', label: 'MARKET ALERTS', count: FEED_ALERTS.length },
          { id: 'news',   label: 'ENERGY NEWS',   count: ENERGY_NEWS.length },
        ].map(tab => (
          <button key={tab.id} onClick={() => setFeedMode(tab.id as 'market' | 'news')} style={{
            flex: 1, padding: '9px 0', background: 'transparent', border: 'none',
            borderBottom: feedMode === tab.id ? `2px solid ${C.electricBlue}` : '2px solid transparent',
            color: feedMode === tab.id ? C.electricBlue : C.textMuted,
            fontFamily: F.mono, fontSize: '10px', fontWeight: '600', letterSpacing: '0.10em',
            textTransform: 'uppercase' as const, cursor: 'pointer',
            transition: 'all 150ms cubic-bezier(0.4, 0, 0.2, 1)',
          }}>
            {tab.label}<span style={{ marginLeft: 5, opacity: 0.6 }}>{tab.count}</span>
          </button>
        ))}
      </div>

      {/* ── MARKET ALERTS TAB ── */}
      {feedMode === 'market' && (
        <>
          {/* Category filter chips */}
          <div style={{ display: 'flex', gap: S.xs, padding: `${S.sm} ${S.lg}`, flexShrink: 0, flexWrap: 'wrap' as const, borderBottom: `1px solid ${C.borderDefault}` }}>
            <button onClick={() => setActiveFilter('ALL')} style={{
              padding: '2px 8px', background: activeFilter === 'ALL' ? C.electricBlueWash : 'transparent',
              border: `1px solid ${activeFilter === 'ALL' ? C.electricBlue : C.borderDefault}`, borderRadius: R.sm,
              color: activeFilter === 'ALL' ? C.electricBlue : C.textMuted, fontFamily: F.mono, fontSize: '9px',
              fontWeight: '500', letterSpacing: '0.10em', textTransform: 'uppercase' as const, cursor: 'pointer',
            }}>ALL {FEED_ALERTS.length}</button>
            {activeCategories.map(cat => {
              const count = FEED_ALERTS.filter(a => a.category === cat).length;
              const color = CATEGORY_COLORS[cat];
              const active = activeFilter === cat;
              return (
                <button key={cat} onClick={() => setActiveFilter(active ? 'ALL' : cat)} style={{
                  padding: '2px 8px', background: active ? `${color}18` : 'transparent',
                  border: `1px solid ${active ? color : C.borderDefault}`, borderRadius: R.sm,
                  color: active ? color : C.textMuted, fontFamily: F.mono, fontSize: '9px',
                  fontWeight: '500', letterSpacing: '0.10em', textTransform: 'uppercase' as const, cursor: 'pointer',
                }}>{cat} {count}</button>
              );
            })}
          </div>

          {/* Alert stream */}
          <div style={{ flex: 1, overflowY: 'auto', padding: `${S.sm} 0` }}>
            {filteredAlerts.map(alert => {
              const catColor = CATEGORY_COLORS[alert.category];
              const priConfig = PRIORITY_CONFIG[alert.priority];
              const isExpanded = expandedId === alert.id;
              return (
                <div key={alert.id} onClick={() => setExpandedId(isExpanded ? null : alert.id)} style={{
                  padding: `${S.sm} ${S.lg}`,
                  borderLeft: `2px solid ${alert.priority === 'CRITICAL' ? C.alertCritical : alert.priority === 'HIGH' ? catColor : 'transparent'}`,
                  opacity: priConfig.rowOpacity, cursor: 'pointer',
                  background: isExpanded ? 'rgba(255,255,255,0.03)' : 'transparent',
                  borderBottom: `1px solid ${C.borderDefault}`, transition: 'background 120ms ease',
                }}
                  onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.03)'; }}
                  onMouseLeave={e => { if (!isExpanded) (e.currentTarget as HTMLDivElement).style.background = 'transparent'; }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: S.sm, marginBottom: S.xs }}>
                    <div style={{ width: 5, height: 5, borderRadius: '50%', background: priConfig.dot, flexShrink: 0 }} />
                    <span style={{ fontFamily: F.mono, fontSize: '10px', color: C.textMuted, flexShrink: 0, fontVariantNumeric: 'tabular-nums' }}>{alert.time}</span>
                    <span style={{ padding: '1px 5px', background: `${catColor}15`, border: `1px solid ${catColor}40`, borderRadius: '3px', color: catColor, fontFamily: F.mono, fontSize: '8px', fontWeight: '600', letterSpacing: '0.10em', textTransform: 'uppercase' as const, flexShrink: 0 }}>{alert.category}</span>
                    {alert.value && (
                      <span style={{ marginLeft: 'auto', fontFamily: F.mono, fontSize: '11px', fontWeight: '600', color: catColor, fontVariantNumeric: 'tabular-nums', flexShrink: 0 }}>{alert.value}</span>
                    )}
                  </div>
                  <div style={{ fontFamily: F.sans, fontSize: '13px', fontWeight: '500', color: alert.priority === 'CRITICAL' || alert.priority === 'HIGH' ? C.textPrimary : C.textSecondary, lineHeight: 1.4, paddingLeft: S.lg }}>
                    {alert.headline}
                  </div>
                  {isExpanded && alert.detail && (
                    <div style={{ marginTop: S.sm, paddingLeft: S.lg, paddingTop: S.sm, borderTop: `1px solid ${C.borderDefault}` }}>
                      <div style={{ fontFamily: F.sans, fontSize: '11px', color: C.textMuted, lineHeight: 1.6, marginBottom: S.sm }}>{alert.detail}</div>
                      {alert.zone && (
                        <button onClick={e => { e.stopPropagation(); onZoneClick(alert.zone!); }} style={{
                          display: 'inline-flex', alignItems: 'center', gap: S.xs, padding: '3px 8px',
                          background: C.electricBlueWash, border: '1px solid rgba(6,182,212,0.25)', borderRadius: R.sm,
                          color: C.electricBlue, fontFamily: F.mono, fontSize: '9px', fontWeight: '500',
                          letterSpacing: '0.10em', textTransform: 'uppercase' as const, cursor: 'pointer',
                        }}>→ VIEW {alert.zone} IN NEST</button>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
            <div style={{ padding: `${S.sm} ${S.lg}`, opacity: 0.5 }}>
              <span style={{ fontFamily: F.mono, fontSize: '11px', color: C.textMuted, fontVariantNumeric: 'tabular-nums' }}>
                {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}
              </span>
              <span style={{ display: 'inline-block', width: '8px', height: '14px', background: C.electricBlue, marginLeft: '2px', verticalAlign: 'middle', animation: 'blink 1s step-end infinite' }} />
            </div>
          </div>
        </>
      )}

      {/* ── ENERGY NEWS TAB ── */}
      {feedMode === 'news' && (
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {ENERGY_NEWS.map(item => (
            <div key={item.id} style={{
              display: 'flex', gap: S.md, padding: `${S.md} ${S.lg}`,
              borderBottom: `1px solid ${C.borderDefault}`, cursor: 'pointer',
              transition: 'background 120ms ease',
            }}
              onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.025)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.background = 'transparent'; }}
            >
              {/* Left: timestamp + source */}
              <div style={{ width: '56px', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 3, paddingTop: 2 }}>
                <span style={{ fontFamily: F.mono, fontSize: '10px', color: C.textMuted, fontVariantNumeric: 'tabular-nums' }}>{item.timeAgo}</span>
                <span style={{ fontFamily: F.mono, fontSize: '9px', color: sourceColor(item.source), letterSpacing: '0.06em' }}>{item.source.toUpperCase()}</span>
              </div>

              {/* Center: headline + summary + tags */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: F.sans, fontSize: '13px', fontWeight: '500', color: C.textPrimary, lineHeight: 1.4, marginBottom: item.summary ? S.xs : 0 }}>
                  {item.headline}
                </div>
                {item.summary && (
                  <div style={{ fontFamily: F.sans, fontSize: '11px', color: C.textMuted, lineHeight: 1.5, marginBottom: S.xs }}>{item.summary}</div>
                )}
                <div style={{ display: 'flex', gap: S.xs, flexWrap: 'wrap' as const }}>
                  {item.tags.slice(0, 3).map(tag => (
                    <span key={tag} style={{ padding: '1px 5px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '3px', fontFamily: F.mono, fontSize: '8px', color: C.textMuted, letterSpacing: '0.06em' }}>{tag}</span>
                  ))}
                </div>
              </div>

              {/* Right: thumbnail placeholder */}
              <div style={{ width: '48px', height: '38px', flexShrink: 0, background: C.bgSurface, borderRadius: R.sm, border: `1px solid ${C.borderDefault}`, display: 'flex', alignItems: 'center', justifyContent: 'center', alignSelf: 'flex-start', marginTop: 2 }}>
                <span style={{ fontSize: '16px', opacity: 0.4 }}>
                  {item.tags[0]?.includes('wind') ? '💨' : item.tags[0]?.includes('gas') || item.tags[0]?.includes('natural') ? '🔥' : item.tags[0]?.includes('battery') || item.tags[0]?.includes('BESS') ? '⚡' : item.tags[0]?.includes('coal') ? '⬛' : item.tags[0]?.includes('solar') || item.tags[0]?.includes('IRA') ? '☀️' : '📡'}
                </span>
              </div>
            </div>
          ))}
          <div style={{ padding: `${S.sm} ${S.lg}`, opacity: 0.4 }}>
            <span style={{ fontFamily: F.sans, fontSize: '10px', color: C.textMuted }}>LIVE · Refreshes every 5 minutes</span>
          </div>
        </div>
      )}

      {/* Open full feed hint */}
      {onOpenFull && (
        <div onClick={onOpenFull} style={{
          flexShrink: 0, textAlign: 'center' as const,
          padding: `${S.sm} 0`, borderTop: `1px solid ${C.borderDefault}`,
          cursor: 'pointer',
        }}>
          <span style={{ fontFamily: F.mono, fontSize: '9px', color: C.textMuted, letterSpacing: '0.10em', opacity: 0.6 }}>
            › OPEN FULL FEED
          </span>
        </div>
      )}
    </div>
  );
}

// ── PeregrineFeedMarketAlerts (standalone alert stream for full page) ──
export function PeregrineFeedMarketAlerts({ onZoneClick }: { onZoneClick: (zoneId: string) => void }) {
  const [activeFilter, setActiveFilter] = useState<AlertCategory | 'ALL'>('ALL');
  const [expandedId, setExpandedId]     = useState<string | null>(null);
  const filteredAlerts = activeFilter === 'ALL' ? FEED_ALERTS : FEED_ALERTS.filter(a => a.category === activeFilter);
  const activeCategories = Array.from(new Set(FEED_ALERTS.map(a => a.category)));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Filter chips */}
      <div style={{ display: 'flex', gap: S.xs, padding: `${S.md} ${S.lg}`, flexShrink: 0, flexWrap: 'wrap' as const, borderBottom: `1px solid ${C.borderDefault}` }}>
        <button onClick={() => setActiveFilter('ALL')} style={{
          padding: '2px 8px', background: activeFilter === 'ALL' ? C.electricBlueWash : 'transparent',
          border: `1px solid ${activeFilter === 'ALL' ? C.electricBlue : C.borderDefault}`, borderRadius: R.sm,
          color: activeFilter === 'ALL' ? C.electricBlue : C.textMuted, fontFamily: F.mono, fontSize: '9px',
          fontWeight: '500', letterSpacing: '0.10em', textTransform: 'uppercase' as const, cursor: 'pointer',
        }}>ALL {FEED_ALERTS.length}</button>
        {activeCategories.map(cat => {
          const count = FEED_ALERTS.filter(a => a.category === cat).length;
          const color = CATEGORY_COLORS[cat];
          const active = activeFilter === cat;
          return (
            <button key={cat} onClick={() => setActiveFilter(active ? 'ALL' : cat)} style={{
              padding: '2px 8px', background: active ? `${color}18` : 'transparent',
              border: `1px solid ${active ? color : C.borderDefault}`, borderRadius: R.sm,
              color: active ? color : C.textMuted, fontFamily: F.mono, fontSize: '9px',
              fontWeight: '500', letterSpacing: '0.10em', textTransform: 'uppercase' as const, cursor: 'pointer',
            }}>{cat} {count}</button>
          );
        })}
      </div>
      {/* Alert stream */}
      <div style={{ flex: 1, overflowY: 'auto', padding: `${S.sm} 0` }}>
        {filteredAlerts.map(alert => {
          const catColor = CATEGORY_COLORS[alert.category];
          const priConfig = PRIORITY_CONFIG[alert.priority];
          const isExpanded = expandedId === alert.id;
          return (
            <div key={alert.id} onClick={() => setExpandedId(isExpanded ? null : alert.id)} style={{
              padding: `${S.sm} ${S.lg}`,
              borderLeft: `2px solid ${alert.priority === 'CRITICAL' ? C.alertCritical : alert.priority === 'HIGH' ? catColor : 'transparent'}`,
              opacity: priConfig.rowOpacity, cursor: 'pointer',
              background: isExpanded ? 'rgba(255,255,255,0.03)' : 'transparent',
              borderBottom: `1px solid ${C.borderDefault}`, transition: 'background 120ms ease',
            }}
              onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.03)'; }}
              onMouseLeave={e => { if (!isExpanded) (e.currentTarget as HTMLDivElement).style.background = 'transparent'; }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: S.sm, marginBottom: S.xs }}>
                <div style={{ width: 5, height: 5, borderRadius: '50%', background: priConfig.dot, flexShrink: 0 }} />
                <span style={{ fontFamily: F.mono, fontSize: '10px', color: C.textMuted, flexShrink: 0, fontVariantNumeric: 'tabular-nums' }}>{alert.time}</span>
                <span style={{ padding: '1px 5px', background: `${catColor}15`, border: `1px solid ${catColor}40`, borderRadius: '3px', color: catColor, fontFamily: F.mono, fontSize: '8px', fontWeight: '600', letterSpacing: '0.10em', textTransform: 'uppercase' as const, flexShrink: 0 }}>{alert.category}</span>
                {alert.value && (
                  <span style={{ marginLeft: 'auto', fontFamily: F.mono, fontSize: '10px', fontWeight: '600', color: catColor, fontVariantNumeric: 'tabular-nums', flexShrink: 0 }}>{alert.value}</span>
                )}
              </div>
              <div style={{ fontFamily: F.sans, fontSize: '12px', color: alert.priority === 'CRITICAL' || alert.priority === 'HIGH' ? C.textPrimary : C.textSecondary, lineHeight: 1.4, paddingLeft: S.lg }}>
                {alert.headline}
              </div>
              {isExpanded && alert.detail && (
                <div style={{ marginTop: S.sm, paddingLeft: S.lg, paddingTop: S.sm, borderTop: `1px solid ${C.borderDefault}` }}>
                  <div style={{ fontFamily: F.sans, fontSize: '11px', color: C.textMuted, lineHeight: 1.6, marginBottom: S.sm }}>{alert.detail}</div>
                  {alert.zone && (
                    <button onClick={e => { e.stopPropagation(); onZoneClick(alert.zone!); }} style={{
                      display: 'inline-flex', alignItems: 'center', gap: S.xs, padding: '3px 8px',
                      background: C.electricBlueWash, border: '1px solid rgba(6,182,212,0.25)', borderRadius: R.sm,
                      color: C.electricBlue, fontFamily: F.mono, fontSize: '9px', fontWeight: '500',
                      letterSpacing: '0.10em', textTransform: 'uppercase' as const, cursor: 'pointer',
                    }}>→ VIEW {alert.zone} IN NEST</button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// nestFuelColor + PJM_ZONES + NestView all moved to
// ./nest/everyone/EveryoneNest. The NestView function is now exported
// from EveryoneNest.tsx as `EveryoneNest` and rendered by renderContent
// when selectedProfile is null or 'everyone'.

// NOTE: ContextualDrawer, LayerControlPill, TimeSpine, StatusBadge (standalone),
// ContextualInfoPanel, VolumetricFlowLayer, SwoopOverlay, CommandPalette, and
// the inline GridAtlasView were removed — replaced by src/components/atlas/GridAtlasView.tsx

// Animated Line Chart Thumbnail (Intelligence Suite)
function GhostlyLineChart() {
  return (
    <svg viewBox="0 0 80 40" className="w-full h-10 mb-3">
      <defs>
        <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={C.electricBlue} stopOpacity="0.1" />
          <stop offset="100%" stopColor={C.electricBlue} stopOpacity="0.6" />
        </linearGradient>
      </defs>
      <path
        d="M0,30 Q10,28 15,25 T30,20 T45,22 T60,15 T75,18 L80,16"
        fill="none"
        stroke="url(#lineGradient)"
        strokeWidth="1.5"
        strokeDasharray="100"
        className="animate-line-draw"
      />
      <path
        d="M0,30 Q10,28 15,25 T30,20 T45,22 T60,15 T75,18 L80,16 L80,40 L0,40 Z"
        fill="url(#lineGradient)"
        fillOpacity="0.1"
      />
    </svg>
  );
}

// Animated Stacked Bar (Resource Suite)
function AnimatedStackedBar() {
  return (
    <div className="w-full h-10 mb-3 flex items-end gap-1">
      {[60, 80, 45, 70, 55, 85, 65].map((h, i) => (
        <div key={i} className="flex-1 flex flex-col justify-end">
          <div
            className="w-full rounded-t-sm animate-bar-fill"
            style={{
              height: `${h}%`,
              background: `linear-gradient(to top, rgba(6,182,212,0.2), rgba(6,182,212,0.5))`,
              animationDelay: `${i * 0.1}s`,
            }}
          />
        </div>
      ))}
    </div>
  );
}

// Enhanced Suite Card with hover, sub-modules, and animated thumbnails.
// Previously the Analytics landing page; kept + exported for reuse.
export function SuiteCard({ title, subModules, showFormula, cardType }: { title: string; subModules: string[]; showFormula?: boolean; cardType?: "intelligence" | "resource" | "optimizer" }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="flex-1 flex flex-col rounded-lg overflow-hidden transition-all duration-300"
      style={{
        backgroundColor: "rgba(10, 10, 11, 0.7)",
        backdropFilter: "blur(12px)",
        border: "0.5px solid rgba(255, 255, 255, 0.08)",
        transform: hovered ? "translateY(-4px)" : "none",
        boxShadow: hovered ? "0 0 30px rgba(6, 182, 212, 0.1)" : "none",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="px-4 py-3 relative" style={{ borderBottom: "0.5px solid rgba(255, 255, 255, 0.06)" }}>
        <div className="absolute top-3 right-3"><StatusDot status="live" /></div>
        <span className="text-[10px] font-semibold tracking-widest uppercase" style={{ fontFamily: F.sans, color: "#EDEDED" }}>{title}</span>
      </div>
      <div className="flex-1 flex flex-col p-4 relative">
        {/* Formula watermark for Optimizer - more visible */}
        {showFormula && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
            <span 
              className="text-[9px] whitespace-nowrap transform -rotate-3" 
              style={{
                fontFamily: F.mono,
                color: "rgba(6, 182, 212, 0.08)",
                letterSpacing: "0.05em",
              }}
            >
              Spark Spread = Electricity Price - (Heat Rate × Fuel Price)
            </span>
          </div>
        )}
        
        {/* Animated Thumbnails */}
        {cardType === "intelligence" && <GhostlyLineChart />}
        {cardType === "resource" && <AnimatedStackedBar />}
        {/* SparkSpreadSurface3D thumbnail removed along with the orphan
            3D surface component — SuiteCard itself is no longer rendered. */}
        
        {/* Sub-modules list */}
        <div className="space-y-2 mb-4">
          {subModules.map((mod, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="w-1 h-1 rounded-full" style={{ backgroundColor: "rgba(6, 182, 212, 0.5)" }} />
              <span className="text-[9px] tracking-wide" style={{ fontFamily: F.sans, color: "rgba(255, 255, 255, 0.4)" }}>{mod}</span>
            </div>
          ))}
        </div>
        {/* Coming Soon Badge */}
        <div className="mt-auto flex justify-center">
          <div className="px-3 py-1 rounded-full" style={{ backgroundColor: "rgba(34, 211, 238, 0.1)", border: "1px solid rgba(34, 211, 238, 0.3)" }}>
            <span className="text-[9px] font-medium tracking-widest" style={{ fontFamily: F.mono, color: C.electricBlueLight }}>COMING SOON</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ANALYTICS View
// AnalyticsView removed — Analytics is now the standalone AnalyticsPage
// component (src/components/AnalyticsPage.tsx). The old SuiteCard grid is gone;
// Peregrine Intelligence is the default Analytics tab.

// VAULT View — inline VaultView() removed. The /vault route now renders
// the imported `Vault` component (placeholder until ATLAS ships
// src/components/vault/Vault.tsx). See top of file.

function TopBar({ activeNav, onNavChange }: { activeNav: string; onNavChange: (id: string) => void }) {
  const liveOps = useLiveOpsData(null);
  const lmpValue = liveOps.rtoPrice || 31.85;
  const isLive = liveOps.live;

  // CHROMA Wave 4 — surface the SSE stream's connection state in the
  // header next to the LIVE indicator. The hook returns 5 states:
  // map idle/connecting → reconnecting (amber pulse), and the rest
  // through to the ConnectionStatusDot's 3-state vocabulary.
  const stream = useLMPStream();
  const dotStatus: ConnectionStatus =
    stream.connectionStatus === 'connected'
      ? 'connected'
      : stream.connectionStatus === 'disconnected'
        ? 'disconnected'
        : 'reconnecting';
  // Peregrine is a top-level destination now, not a KPI sub-page —
  // omit it here so the TopBar shows the full 5-item nav, not the
  // back-to-Nest breadcrumb.
  const kpiPages = ['lmp', 'spread', 'battery', 'gap'];
  const isKPI = kpiPages.includes(activeNav);

  // Map-first views (Grid Atlas) drop the solid header bar entirely
  // and render only the nav icons as a floating translucent pill in
  // the top-left corner. No wordmark, no LMP badge, no background bar.
  const isMapFirst = activeNav === 'atlas';
  // `collapsed` is kept as a marker for legacy nodes below — on atlas
  // most of them hide entirely, so this just disables their label text.
  const collapsed = isMapFirst;

  return (
    <div
      data-atlas-collapsed={isMapFirst ? '1' : '0'}
      style={isMapFirst ? {
        // Floating icon-only pill — matches the timeline scrubber pill style.
        position:       'fixed',
        top:            12,
        left:           12,
        height:         'auto',
        zIndex:         100,
        display:        'flex',
        alignItems:     'center',
        gap:            4,
        padding:        '4px 6px',
        background:     'rgba(10,10,11,0.55)',
        border:         `1px solid ${C.borderDefault}`,
        borderRadius:   22,
        backdropFilter: 'blur(14px)',
        WebkitBackdropFilter: 'blur(14px)',
        boxShadow:      '0 8px 22px rgba(0,0,0,0.35)',
        pointerEvents:  'auto',
      } : {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: 64,
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        backgroundColor: 'rgba(12,13,16,0.88)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: `1px solid ${C.borderDefault}`,
        padding: '0 20px',
        gap: 24,
        overflow: 'hidden',
    }}>
      {/* Falcon icon + Wordmark — fully removed on map-first views */}
      {!isMapFirst && (
      <div style={{
        display: 'flex', alignItems: 'center', gap: S.md,
      }}>
        <div style={{ width: '42px', height: '42px', flexShrink: 0, overflow: 'hidden', borderRadius: '6px' }}>
          <FalconLogo collapsed={false} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
          {/* CHROMA-PROPOSAL: consider F.display at fontSize 18px,
              letterSpacing -0.01em, fontWeight 400 (not 700), with no
              uppercase transform — this would mirror the masthead
              treatment used by the editorial AuthLayout and give the
              wordmark stronger brand authority. Current F.mono caps
              treatment reads as a system label rather than a name.
              ARCHITECT to decide. */}
          <span style={{
            fontFamily: F.mono,
            fontSize: '15px',
            fontWeight: '700',
            letterSpacing: '0.20em',
            color: C.textPrimary,
            lineHeight: 1,
          }}>GRIDALPHA</span>
          <span style={{
            fontFamily: F.mono,
            fontSize: '10px',
            color: C.electricBlue,
            letterSpacing: '0.15em',
          }}>{viewLabels[activeNav]}</span>
        </div>
        <span style={{ color: C.textMuted, fontSize: '14px', opacity: 0.4 }}>/</span>
        {isKPI && (
          <span style={{
            fontFamily: F.mono,
            fontSize: '12px',
            color: C.electricBlue,
            letterSpacing: '0.15em',
          }}>{viewLabels[activeNav]}</span>
        )}
      </div>
      )}
      {isKPI ? (
        /* Breadcrumb: back to THE NEST */
        <nav style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={() => onNavChange('nest')}
            style={{
              fontFamily: F.sans,
              fontSize: '12px',
              fontWeight: '500',
              letterSpacing: '0.02em',
              color: C.textSecondary,
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '6px 12px',
              borderRadius: R.md,
            }}
          >
            ← THE NEST
          </button>
        </nav>
      ) : (
        <nav style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => onNavChange(item.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: collapsed ? 0 : 8,
                padding: collapsed ? '3px 6px' : '6px 12px',
                backgroundColor: activeNav === item.id ? C.electricBlueWash : 'transparent',
                border: `1px solid ${activeNav === item.id ? C.borderActive : 'transparent'}`,
                borderRadius: R.md,
                cursor: 'pointer',
                transition: 'padding 220ms cubic-bezier(0.4,0,0.2,1), gap 220ms cubic-bezier(0.4,0,0.2,1)',
              }}
            >
              <span style={{ color: activeNav === item.id ? C.electricBlue : C.textSecondary }}>
                {item.icon}
              </span>
              <span style={{
                fontFamily: F.sans,
                fontSize: '12px',
                color: activeNav === item.id ? C.electricBlue : C.textSecondary,
                letterSpacing: '0.02em',
                fontWeight: activeNav === item.id ? '600' : '500',
                maxWidth: collapsed ? 0 : 120,
                opacity: collapsed ? 0 : 1,
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                transition: 'max-width 220ms cubic-bezier(0.4,0,0.2,1), opacity 180ms ease-out',
              }}>
                {item.label}
              </span>
            </button>
          ))}
        </nav>
      )}
      {!isMapFirst && (
        <>
          <div style={{ flex: 1 }} />
          {/* CONDUIT — saved views trigger sits between the nav and the LMP readout. */}
          <SavedViewsTrigger />
          <div style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            fontFamily: F.mono, fontSize: '11px',
          }}>
            <span style={{ color: C.textSecondary }}>LMP</span>
            <span style={{ fontSize: '15px', fontWeight: '700', color: C.falconGold }}>${lmpValue.toFixed(2)}</span>
            <StatusDot status={isLive ? 'live' : 'stale'} />
            <span style={{ color: isLive ? C.alertNormal : C.alertWarning }}>{isLive ? 'LIVE' : 'STALE'}</span>
            {/* CHROMA Wave 4 — SSE stream connection state. Sits to the
                right of LIVE/STALE so users can distinguish "data
                fresh" from "stream connected" at a glance. */}
            <ConnectionStatusDot status={dotStatus} />
          </div>
        </>
      )}
    </div>
  );
}

type NavState = 'nest' | 'atlas' | 'analytics' | 'vault' | 'lmp' | 'spread' | 'battery' | 'gap' | 'genmix' | 'peregrine';

const viewLabels: Record<string, string> = {
  nest:      'THE NEST',
  atlas:     'GRID ATLAS',
  peregrine: 'PEREGRINE',
  analytics: 'ANALYTICS',
  vault:     'VAULT',
  lmp:       'LMP INTELLIGENCE',
  spread:    'SPARK SPREAD',
  battery:   'BATTERY ARB',
  gap:       'RESOURCE GAP',
  genmix:    'GENERATION MIX',
};

type GlobalShellProps = {
  initialView?: 'nest' | 'atlas' | 'peregrine' | 'analytics' | 'vault';
};

export default function GlobalShell({ initialView = 'nest' }: GlobalShellProps = {}) {
  // FOUNDRY Phase E — wires Cmd+K / Cmd+P / Cmd+/ / ESC globally.
  useKeyboardShortcuts();
  // CONDUIT — restore an encoded view from the URL if present (`?v=...`).
  useShareableUrl();

  const location = useLocation();
  // Suppress EntryOverlay splash when arriving from the auth flow.
  // Direct-URL / first-load visits still play the splash.
  const fromAuth = (location.state as { fromAuth?: boolean } | null)?.fromAuth === true;
  const [activeNav, setActiveNav] = useState<NavState>(initialView);
  const [entryDismissed, setEntryDismissed] = useState(fromAuth);
  const [selectedZone, setSelectedZone] = useState<string | null>('WEST_HUB');
  const selectedProfile = useAuthStore((s) => s.selectedProfile);

  // KPI deep-dive views — drive ESC handling and the TopBar breadcrumb.
  // `peregrine` used to be in this list when it was a Nest sub-cell, but
  // it is now a top-level destination (its own /peregrine route + nav
  // item), so it must NOT trigger the breadcrumb or the ESC-back behavior.
  const kpiPages: NavState[] = ['lmp', 'spread', 'battery', 'gap', 'genmix'];
  const fullScreenPages: NavState[] = ['lmp', 'spread', 'battery', 'gap', 'genmix'];
  const isFullScreenPage = (fullScreenPages as string[]).includes(activeNav);

  // ESC returns from KPI full page to Nest
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && (kpiPages as string[]).includes(activeNav)) {
        setActiveNav('nest');
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [activeNav]);

  const renderContent = () => {
    switch (activeNav) {
      case "nest": {
        // Profile-route the Nest. Trader is fully built; the other five
        // profiles fall back to placeholders until TERMINAL ships them.
        // Everyone (or unset) renders the legacy bento layout (EveryoneNest).
        switch (selectedProfile) {
          case 'trader':     return <TraderNest />;
          case 'analyst':    return <AnalystNest />;
          case 'storage':    return <StorageNest />;
          case 'industrial': return <IndustrialNest />;
          case 'student':    return <StudentNest />;
          case 'developer':  return <DeveloperNest />;
          default:
            return (
              <EveryoneNest
                selectedZone={selectedZone}
                setSelectedZone={setSelectedZone}
                onNavigateKPI={(tab) => setActiveNav(tab as NavState)}
              />
            );
        }
      }
      case "atlas": return <GridAtlasView />;
      case "peregrine": return (
        <PeregrineFullPage
          selectedZone={selectedZone}
          onZoneClick={(zoneId) => { setSelectedZone(zoneId); setActiveNav('nest'); }}
          marketAlerts={null}
        />
      );
      case "analytics": return (
        <AnalyticsPage
          selectedZone={selectedZone}
          onZoneClick={(zoneId) => { setSelectedZone(zoneId); setActiveNav('nest'); }}
        />
      );
      case "vault": return <Vault />;
      case "lmp": return <LMPFullPage selectedZone={selectedZone} />;
      case "spread": return <SpreadFullPage selectedZone={selectedZone} />;
      case "battery": return <BatteryFullPage selectedZone={selectedZone} />;
      case "gap": return <GapFullPage selectedZone={selectedZone} />;
      case "genmix": return <GenerationMixFullPage onBack={() => setActiveNav('nest')} />;
      default: {
        switch (selectedProfile) {
          case 'trader':     return <TraderNest />;
          case 'analyst':    return <AnalystNest />;
          case 'storage':    return <StorageNest />;
          case 'industrial': return <IndustrialNest />;
          case 'student':    return <StudentNest />;
          case 'developer':  return <DeveloperNest />;
          default:
            return (
              <EveryoneNest
                selectedZone={selectedZone}
                setSelectedZone={setSelectedZone}
                onNavigateKPI={(tab) => setActiveNav(tab as NavState)}
              />
            );
        }
      }
    }
  };

  return (
    <>
      {!entryDismissed && <EntryOverlay onDismiss={() => setEntryDismissed(true)} />}
      {!isFullScreenPage && (
        <TopBar activeNav={activeNav} onNavChange={(id) => setActiveNav(id as NavState)} />
      )}
      {/* Floating back button for KPI full pages that lack their own header.
          GenerationMixFullPage provides its own back button. */}
      {isFullScreenPage && activeNav !== 'genmix' && (
        <button
          onClick={() => setActiveNav('nest')}
          style={{
            position:       'fixed',
            top:            12,
            left:           12,
            zIndex:         100,
            padding:        '6px 12px',
            background:     C.bgElevated,
            border:         `1px solid ${C.borderDefault}`,
            borderRadius:   R.sm,
            color:          C.textSecondary,
            fontFamily:     F.mono,
            fontSize:       '10px',
            fontWeight:     '600',
            letterSpacing:  '0.10em',
            cursor:         'pointer',
            transition:     'border-color 150ms cubic-bezier(0.4, 0, 0.2, 1), color 150ms cubic-bezier(0.4, 0, 0.2, 1)',
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.borderColor = C.electricBlue;
            (e.currentTarget as HTMLButtonElement).style.color = C.electricBlue;
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.borderColor = C.borderDefault;
            (e.currentTarget as HTMLButtonElement).style.color = C.textSecondary;
          }}
        >
          ← THE NEST
        </button>
      )}
      <div style={{
        position: 'fixed',
        top: isFullScreenPage ? 0 : (activeNav === 'atlas' ? 0 : 64),
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        backgroundColor: C.bgBase,
        transition: 'top 220ms cubic-bezier(0.4,0,0.2,1)',
      }}>
        {renderContent()}
      </div>
      {/* Global overlays — each manages its own visibility via uiStore.
          ProfileSwitcher only renders in dev. */}
      <AIAssistantTrigger />
      <AIAssistant />
      <CommandPalette />
      {import.meta.env.DEV && <ProfileSwitcher />}
    </>
  );
}
