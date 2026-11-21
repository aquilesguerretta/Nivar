// src/components/nest/everyone/EveryoneNest.tsx
// ARCHITECT — fallback Nest used when selectedProfile is null or 'everyone'.
// Extracted as-is from the inline NestView in GlobalShell. Public component
// signature is identical (selectedZone, setSelectedZone, onNavigateKPI).
//
// In addition to the EveryoneNest default export, this file re-exports the
// chart primitives and window helpers that GlobalShell's KPI deep-dive
// pages (SpreadFullPage, BatteryFullPage) still need. StatusDot is also
// re-exported because PeregrineFeed/SuiteCard in GlobalShell use it.

import { useEffect, useState } from 'react';
import {
  Area, AreaChart, CartesianGrid, ReferenceLine,
  ResponsiveContainer, Tooltip, XAxis, YAxis,
} from 'recharts';
import { C, F, R, S, T } from '@/design/tokens';
import { LMPCard } from '../../LMPCard';
import { ErrorBoundary } from '../../shared/ErrorBoundary';
import { useFuelMix } from '../../../hooks/data/useAtlasData';
import { useHenryHub } from '../../../hooks/data/useEnergyPrices';
import { useLiveOpsData } from '../../../hooks/data/useLiveOpsData';

// ── StatusDot ─────────────────────────────────────────────────────
// Re-exported for PeregrineFeed / SuiteCard in GlobalShell.
export function StatusDot({ status }: { status: 'live' | 'stale' | 'fallback' }) {
  const colors = { live: C.alertNormal, stale: C.alertWarning, fallback: C.alertCritical };
  return (
    <div style={{ position: 'relative' }}>
      {status === 'live' && (
        <div
          className="rounded-full animate-live-ping"
          style={{ position: 'absolute', inset: 0, backgroundColor: colors[status] }}
        />
      )}
      <div
        className={`rounded-full ${status === 'live' ? 'animate-status-pulse' : ''}`}
        style={{ position: 'relative', width: 8, height: 8, backgroundColor: colors[status], color: colors[status] }}
      />
    </div>
  );
}

// ── BentoCard ─────────────────────────────────────────────────────
function BentoCard({
  title, children, status = 'live', className = '', style = {}, onTitleClick,
}: {
  title: string;
  children: React.ReactNode;
  status?: 'live' | 'stale' | 'fallback';
  className?: string;
  style?: React.CSSProperties;
  onTitleClick?: () => void;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className={className}
      style={{
        position: 'relative',
        backgroundColor: C.bgElevated,
        border: `1px solid ${C.borderDefault}`,
        borderTop: `1px solid ${hovered ? C.borderActive : C.borderAccent}`,
        borderRadius: R.lg,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        transition: 'border-top-color 150ms cubic-bezier(0.4, 0, 0.2, 1)',
        ...style,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={{ position: 'absolute', top: 12, right: 12, zIndex: 10 }}>
        <StatusDot status={status} />
      </div>
      <div
        style={{
          padding: '10px 16px',
          borderBottom: `0.5px solid ${C.borderDefault}`,
          flexShrink: 0,
          cursor: onTitleClick ? 'pointer' : 'default',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}
        onClick={onTitleClick}
      >
        <span style={{
          fontFamily: F.mono,
          fontSize: '10px',
          fontWeight: '600',
          letterSpacing: '0.16em',
          textTransform: 'uppercase' as const,
          color: C.textMuted,
        }}>{title}</span>
        {onTitleClick && (
          <span style={{
            fontFamily: F.mono,
            fontSize: '8px',
            color: 'rgba(255,255,255,0.2)',
            letterSpacing: '0.1em',
          }}>
            ↗ EXPAND
          </span>
        )}
      </div>
      <div style={{ flex: 1, minHeight: 0, position: 'relative', overflow: 'hidden' }}>
        {children}
      </div>
    </div>
  );
}

// ── Window-average helpers ───────────────────────────────────────
// Re-exported for SpreadFullPage / BatteryFullPage / GapFullPage in
// GlobalShell.
export function avg(values: number[]): number {
  if (!values.length) return 0;
  return values.reduce((s, x) => s + x, 0) / values.length;
}

export function maxWindowAverage(values: number[], width: number): { value: number; start: number } {
  if (!values.length || width <= 0) return { value: 0, start: 0 };
  if (values.length <= width) return { value: avg(values), start: 0 };
  let best = -Infinity;
  let start = 0;
  for (let i = 0; i <= values.length - width; i += 1) {
    const v = avg(values.slice(i, i + width));
    if (v > best) {
      best = v;
      start = i;
    }
  }
  return { value: best, start };
}

export function minWindowAverage(values: number[], width: number): { value: number; start: number } {
  if (!values.length || width <= 0) return { value: 0, start: 0 };
  if (values.length <= width) return { value: avg(values), start: 0 };
  let best = Infinity;
  let start = 0;
  for (let i = 0; i <= values.length - width; i += 1) {
    const v = avg(values.slice(i, i + width));
    if (v < best) {
      best = v;
      start = i;
    }
  }
  return { value: best, start };
}

export function hourWindowLabel(startHour: number, width: number): string {
  const end = (startHour + width) % 24;
  return `${String(startHour).padStart(2, '0')}:00-${String(end).padStart(2, '0')}:00`;
}

// ── SparkSpreadChart ─────────────────────────────────────────────
// Re-exported for SpreadFullPage in GlobalShell.
export function SparkSpreadChart({ history, regime }: { history: number[]; regime: 'BURNING' | 'SUPPRESSED' | 'NEUTRAL' }) {
  const lineColor = regime === 'BURNING' ? C.falconGold : regime === 'SUPPRESSED' ? C.alertCritical : C.textSecondary;
  void lineColor; // referenced by regime, kept for future use
  const data = history.map((value, i) => ({
    i,
    label: i === 0 ? '12A' : i === 6 ? '6A' : i === 12 ? '12P' : i === 18 ? '6P' : i === 23 ? '11P' : String(i),
    positive: value >= 0 ? value : 0,
    negative: value < 0 ? value : 0,
    value,
  }));
  const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload?.length) return null;
    const v = payload[0]?.payload?.value ?? 0;
    const lbl = payload[0]?.payload?.label;
    return (
      <div style={{ background: C.bgOverlay, border: `1px solid ${C.borderStrong}`, borderRadius: R.md, padding: '8px 12px' }}>
        <div style={{ fontFamily: F.sans, fontSize: 11, color: C.textMuted, marginBottom: 4 }}>{lbl}</div>
        <div style={{ fontFamily: F.mono, fontSize: 15, fontWeight: 600, color: v >= 0 ? C.falconGold : C.alertCritical, fontVariantNumeric: 'tabular-nums' }}>
          {v >= 0 ? '+' : ''}{v.toFixed(1)} $/MWh
        </div>
      </div>
    );
  };
  return (
    <div style={{ width: '100%', height: '100%', background: '#111318', borderRadius: R.md, padding: 4, boxSizing: 'border-box' }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 16, bottom: 0, left: 8 }}>
          <defs>
            <linearGradient id="posGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={C.falconGold} stopOpacity={0.45} />
              <stop offset="95%" stopColor={C.falconGold} stopOpacity={0.08} />
            </linearGradient>
            <linearGradient id="negGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={C.alertCritical} stopOpacity={0.08} />
              <stop offset="95%" stopColor={C.alertCritical} stopOpacity={0.40} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="2 4" stroke="rgba(255,255,255,0.10)" vertical={false} />
          <XAxis dataKey="label" tick={{ fontFamily: F.mono, fontSize: 11, fill: 'rgba(229,231,235,0.55)' }} axisLine={{ stroke: 'rgba(229,231,235,0.12)' }} tickLine={false} interval={5} />
          <YAxis tick={{ fontFamily: F.mono, fontSize: 11, fill: 'rgba(229,231,235,0.55)' }} axisLine={false} tickLine={false} tickFormatter={(v) => v > 0 ? `+${v}` : String(v)} width={36} />
          <ReferenceLine y={0} stroke={C.textMuted} strokeDasharray="4 4" strokeOpacity={0.6} label={{ value: 'BREAKEVEN', position: 'insideTopLeft', style: { fontFamily: F.mono, fontSize: 9, fill: C.textMuted } }} />
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: C.electricBlue, strokeWidth: 1, strokeDasharray: '3 3' }} />
          <Area type="monotone" dataKey="positive" stroke={C.falconGold} strokeWidth={2.5} fill="url(#posGrad)" dot={false} activeDot={{ r: 5, fill: C.falconGold, stroke: C.bgElevated, strokeWidth: 2 }} isAnimationActive={false} />
          <Area type="monotone" dataKey="negative" stroke={C.alertCritical} strokeWidth={2.5} fill="url(#negGrad)" dot={false} activeDot={{ r: 5, fill: C.alertCritical, stroke: C.bgElevated, strokeWidth: 2 }} isAnimationActive={false} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

// ── SparkKPIView ──────────────────────────────────────────────────
function SparkKPIView({ selectedZone, onNavigate }: { selectedZone: string | null; onNavigate?: () => void }) {
  const { data: henryHub } = useHenryHub();
  const liveOps = useLiveOpsData(selectedZone);
  const gasPrice = henryHub.current_price_mmbtu;
  const gasPriceLive = henryHub.live;
  const heatRate = 7.2;
  const fallbackHistory = [
    -2.4, -1.8, -0.6, 2.1, 4.8, 8.2, 14.1, 18.2, 16.8, 15.2, 13.4, 12.8,
    11.9, 10.4, 9.8, 11.2, 13.6, 14.9, 12.4, 10.8, 9.2, 7.6, 5.4, 3.8,
  ];
  const historyBase = liveOps.zoneHistory.length ? liveOps.zoneHistory : fallbackHistory.map((x) => x + 26.5);
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

  const regimeColor = SPARK_DATA.regime === 'BURNING'
    ? C.falconGold
    : SPARK_DATA.regime === 'SUPPRESSED'
      ? C.alertCritical
      : C.textSecondary;

  const regimeBg = SPARK_DATA.regime === 'BURNING'
    ? C.falconGoldWash
    : SPARK_DATA.regime === 'SUPPRESSED'
      ? 'rgba(239,68,68,0.10)'
      : 'rgba(255,255,255,0.06)';

  const regimeBorder = SPARK_DATA.regime === 'BURNING'
    ? 'rgba(245,158,11,0.30)'
    : SPARK_DATA.regime === 'SUPPRESSED'
      ? 'rgba(239,68,68,0.30)'
      : 'rgba(255,255,255,0.20)';

  const RegimeBadge = () => (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: '3px 8px', background: regimeBg,
      border: `1px solid ${regimeBorder}`, borderRadius: R.sm,
      color: regimeColor, fontFamily: F.mono, fontSize: '10px',
      fontWeight: '500', letterSpacing: '0.10em', textTransform: 'uppercase' as const,
    }}>
      <div style={{ width: 6, height: 6, borderRadius: '50%', background: regimeColor, flexShrink: 0 }} />
      {SPARK_DATA.regime}
    </div>
  );

  return (
    <div
      onClick={onNavigate}
      style={{
        display: 'flex', flexDirection: 'column', position: 'absolute', inset: 0,
        padding: `${S.lg} ${S.lg} ${S.md} ${S.lg}`, gap: S.md,
        overflow: 'hidden', cursor: onNavigate ? 'pointer' : 'default',
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
        <span style={{ fontFamily: F.mono, fontSize: '10px', fontWeight: '600', letterSpacing: '0.16em', textTransform: 'uppercase' as const, color: C.textMuted }}>
          SPARK SPREAD · {SPARK_DATA.zone}
        </span>
        <RegimeBadge />
      </div>

      {/* Dominant number */}
      <div style={{ flexShrink: 0 }}>
        <div style={{ fontFamily: F.mono, fontSize: T.dataLgSize, fontWeight: T.dataLgWeight, color: regimeColor, lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>
          {SPARK_DATA.regime === 'BURNING' ? '+' : ''}{SPARK_DATA.spreadValue.toFixed(1)}
        </div>
        <div style={{ fontFamily: F.mono, fontSize: T.labelSize, color: C.textMuted, marginTop: S.xs, letterSpacing: '0.08em' }}>
          $/MWh NET SPREAD
        </div>
      </div>

      {/* Input breakdown */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: S.xs, flexShrink: 0, paddingTop: S.xs, borderTop: `1px solid ${C.borderDefault}` }}>
        {[
          { label: 'PWR PRICE',  value: `$${SPARK_DATA.powerPrice.toFixed(2)}`,    color: C.electricBlue },
          { label: 'GAS EQUIV',  value: `$${SPARK_DATA.gasEquivPrice.toFixed(2)}`, color: C.falconGold },
          { label: 'NET SPREAD', value: `$${SPARK_DATA.netSpread.toFixed(2)}`,     color: regimeColor },
        ].map(row => (
          <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontFamily: F.mono, fontSize: '11px', color: C.textMuted, letterSpacing: '0.08em', textTransform: 'uppercase' as const }}>{row.label}</span>
            <span style={{ fontFamily: F.mono, fontSize: T.dataSmSize, fontWeight: '500', color: row.color, fontVariantNumeric: 'tabular-nums' }}>
              {row.value}<span style={{ color: C.textMuted, fontSize: '10px', marginLeft: 3 }}>/MWh</span>
            </span>
          </div>
        ))}
        <div style={{ display: 'flex', gap: S.xl, marginTop: S.xs, alignItems: 'center' }}>
          {[{ label: 'GAS', value: `$${SPARK_DATA.gasPrice}/MMBtu` }, { label: 'HR', value: `${SPARK_DATA.heatRate}×` }].map(item => (
            <div key={item.label} style={{ display: 'flex', gap: S.xs, alignItems: 'baseline' }}>
              <span style={{ fontFamily: F.mono, fontSize: '10px', color: C.textMuted, letterSpacing: '0.08em' }}>{item.label}</span>
              <span style={{ fontFamily: F.mono, fontSize: '11px', color: C.textSecondary }}>{item.value}</span>
            </div>
          ))}
          <span style={{
            fontFamily: F.mono,
            fontSize: '0.5rem',
            color: gasPriceLive ? '#10B981' : '#FFB800',
            letterSpacing: '0.1em',
          }}>
            {gasPriceLive ? '● LIVE' : '◐ EIA'}
          </span>
        </div>
      </div>

      {/* Bottom stats */}
      <div style={{ display: 'flex', justifyContent: 'space-between', flexShrink: 0, paddingTop: S.sm, borderTop: `1px solid ${C.borderDefault}` }}>
        {[
          { label: '24H AVG',     value: `+${SPARK_DATA.avg24h.toFixed(1)}`,    color: C.falconGold },
          { label: 'HRS BURNING', value: `${SPARK_DATA.hoursBurning}/24`,        color: C.textPrimary },
          { label: 'PEAK SPREAD', value: `+${SPARK_DATA.peak.value.toFixed(1)}`, color: C.falconGold },
        ].map(stat => (
          <div key={stat.label} style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <span style={{ fontFamily: F.mono, fontSize: '9px', color: C.textMuted, letterSpacing: '0.10em', textTransform: 'uppercase' as const }}>{stat.label}</span>
            <span style={{ fontFamily: F.mono, fontSize: '13px', fontWeight: '600', color: stat.color, fontVariantNumeric: 'tabular-nums' }}>{stat.value}</span>
          </div>
        ))}
      </div>

      {/* Navigate hint */}
      {onNavigate && (
        <div style={{ fontFamily: F.mono, fontSize: '9px', color: C.textMuted, letterSpacing: '0.10em', textAlign: 'center' as const, paddingTop: S.sm, opacity: 0.6 }}>
          › OPEN FULL VIEW
        </div>
      )}
    </div>
  );
}

// ── SOCGauge ──────────────────────────────────────────────────────
// Re-exported for BatteryFullPage in GlobalShell.
export function SOCGauge({ soc, size = 140 }: { soc: number; size?: number }) {
  const SIZE = size;
  const CX = SIZE / 2;
  const CY = SIZE / 2;
  const RADIUS = Math.round(SIZE * 0.371); // ~52px at 140, ~74px at 200
  const START_DEG = -220;
  const SWEEP_DEG = 260;
  const STROKE = 8;

  const degToRad = (d: number) => (d * Math.PI) / 180;
  const polarToXY = (deg: number, r: number) => ({
    x: CX + r * Math.cos(degToRad(deg)),
    y: CY + r * Math.sin(degToRad(deg)),
  });

  const arcPath = (startDeg: number, sweepDeg: number, r: number) => {
    const start = polarToXY(startDeg, r);
    const end   = polarToXY(startDeg + sweepDeg, r);
    const large = sweepDeg > 180 ? 1 : 0;
    return `M ${start.x},${start.y} A ${r},${r} 0 ${large} 1 ${end.x},${end.y}`;
  };

  const trackPath  = arcPath(START_DEG, SWEEP_DEG, RADIUS);
  const filledSweep = (soc / 100) * SWEEP_DEG;
  const filledPath = arcPath(START_DEG, filledSweep, RADIUS);

  const arcLen = (SWEEP_DEG / 360) * 2 * Math.PI * RADIUS;
  const filledLen = (soc / 100) * arcLen;

  return (
    <svg
      width={SIZE}
      height={SIZE}
      viewBox={`0 0 ${SIZE} ${SIZE}`}
      style={{ display: 'block', flexShrink: 0 }}
    >
      <defs>
        <filter id="socGlow">
          <feGaussianBlur stdDeviation="2.5" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>
      {/* Track */}
      <path
        d={trackPath}
        fill="none"
        stroke={C.borderDefault}
        strokeWidth={STROKE}
        strokeLinecap="round"
      />
      {/* Filled arc */}
      {soc > 0 && (
        <path
          d={filledPath}
          fill="none"
          stroke={C.electricBlue}
          strokeWidth={STROKE}
          strokeLinecap="round"
          strokeDasharray={`${filledLen} ${arcLen}`}
          filter="url(#socGlow)"
        />
      )}
      {/* SOC value */}
      <text
        x={CX}
        y={CY - 4}
        textAnchor="middle"
        style={{ fontFamily: F.mono, fontSize: `${Math.round(SIZE * 0.171)}px`, fontWeight: 600, fill: C.electricBlue }}
      >
        {soc}%
      </text>
      <text
        x={CX}
        y={CY + Math.round(SIZE * 0.1)}
        textAnchor="middle"
        style={{ fontFamily: F.mono, fontSize: `${Math.round(SIZE * 0.064)}px`, fill: C.textMuted, letterSpacing: '0.12em' }}
      >
        STATE OF CHARGE
      </text>
    </svg>
  );
}

// ── BatteryKPIView ────────────────────────────────────────────────
function BatteryKPIView({ selectedZone, onNavigate }: { selectedZone: string | null; onNavigate?: () => void }) {
  const liveOps = useLiveOpsData(selectedZone);
  const history = liveOps.zoneHistory.length ? liveOps.zoneHistory : [
    26, 24, 22, 21, 20, 21, 28, 35, 42, 44, 43, 40,
    38, 36, 35, 34, 38, 44, 50, 52, 48, 43, 38, 32,
  ];
  const charge = minWindowAverage(history, 4);
  const discharge = maxWindowAverage(history, 4);
  const chargeLMP = charge.value;
  const dischargeLMP = discharge.value;
  const netSpread = dischargeLMP - chargeLMP;
  const targetSoc = Math.max(15, Math.min(95, Math.round(((history[history.length - 1] - Math.min(...history)) / (Math.max(...history) - Math.min(...history) || 1)) * 100)));
  const [animSoc, setAnimSoc] = useState(0);

  useEffect(() => {
    setAnimSoc(0);
    let start: number | null = null;
    const duration = 1200;
    const step = (ts: number) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setAnimSoc(Math.round(eased * targetSoc));
      if (progress < 1) requestAnimationFrame(step);
    };
    const raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [selectedZone, targetSoc]);

  const isCharging = history[history.length - 1] <= chargeLMP + 0.5;
  const stateBadgeColor = isCharging ? C.alertNormal : C.falconGold;

  const StateBadge = () => (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '2px 8px', borderRadius: R.sm, backgroundColor: `${stateBadgeColor}18`, border: `1px solid ${stateBadgeColor}50` }}>
      <span style={{ fontFamily: F.mono, fontSize: T.labelSize, color: stateBadgeColor, letterSpacing: T.labelSpacing }}>{isCharging ? 'CHARGING' : 'DISCHARGING'}</span>
    </div>
  );

  return (
    <div
      onClick={onNavigate}
      style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', padding: S.lg, gap: S.sm, overflow: 'hidden', cursor: onNavigate ? 'pointer' : 'default' }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
        <span style={{ fontFamily: F.mono, fontSize: '10px', fontWeight: '600', color: C.textMuted, letterSpacing: '0.16em', textTransform: 'uppercase' as const }}>{selectedZone ?? 'WEST HUB'} ARB</span>
        <StateBadge />
      </div>
      {/* Gauge */}
      <div style={{ display: 'flex', justifyContent: 'center', flexShrink: 0 }}>
        <SOCGauge soc={animSoc} />
      </div>
      {/* Three columns */}
      <div style={{ display: 'flex', gap: S.sm, flexShrink: 0 }}>
        <div style={{ flex: 1, padding: '6px 8px', borderRadius: R.sm, backgroundColor: C.bgOverlay, border: `1px solid ${C.borderDefault}`, display: 'flex', flexDirection: 'column', gap: '3px' }}>
          <span style={{ fontFamily: F.mono, fontSize: '8px', color: C.textMuted, letterSpacing: T.labelSpacing, textTransform: 'uppercase' as const }}>CHARGE</span>
          <span style={{ fontFamily: F.mono, fontSize: T.dataSmSize, color: C.alertNormal, fontWeight: T.dataSmWeight }}>${chargeLMP.toFixed(2)}</span>
          <span style={{ fontFamily: F.mono, fontSize: '8px', color: C.textMuted }}>{hourWindowLabel(charge.start, 4)}</span>
        </div>
        <div style={{ flex: 1, padding: '6px 8px', borderRadius: R.sm, backgroundColor: `${C.falconGold}0A`, border: `1px solid ${C.falconGold}30`, display: 'flex', flexDirection: 'column', gap: '3px', alignItems: 'center' }}>
          <span style={{ fontFamily: F.mono, fontSize: '8px', color: C.textMuted, letterSpacing: T.labelSpacing, textTransform: 'uppercase' as const }}>CYCLE SPREAD</span>
          <span style={{ fontFamily: F.mono, fontSize: '18px', color: C.falconGold, fontWeight: 600 }}>{netSpread >= 0 ? '+' : ''}{netSpread.toFixed(2)}</span>
          <span style={{ fontFamily: F.mono, fontSize: '8px', color: C.textMuted }}>$/MWh</span>
        </div>
        <div style={{ flex: 1, padding: '6px 8px', borderRadius: R.sm, backgroundColor: C.bgOverlay, border: `1px solid ${C.borderDefault}`, display: 'flex', flexDirection: 'column', gap: '3px' }}>
          <span style={{ fontFamily: F.mono, fontSize: '8px', color: C.textMuted, letterSpacing: T.labelSpacing, textTransform: 'uppercase' as const }}>DISCHARGE</span>
          <span style={{ fontFamily: F.mono, fontSize: T.dataSmSize, color: C.falconGold, fontWeight: T.dataSmWeight }}>${dischargeLMP.toFixed(2)}</span>
          <span style={{ fontFamily: F.mono, fontSize: '8px', color: C.textMuted }}>{hourWindowLabel(discharge.start, 4)}</span>
        </div>
      </div>
      {/* Revenue */}
      <div style={{ flexShrink: 0, padding: '8px 12px', borderRadius: R.sm, backgroundColor: C.bgOverlay, border: `1px solid ${C.borderDefault}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontFamily: F.mono, fontSize: T.labelSize, color: C.textMuted, letterSpacing: T.labelSpacing, textTransform: 'uppercase' as const }}>EST. DAILY REVENUE</span>
        <span style={{ fontFamily: F.mono, fontSize: T.dataMdSize, color: C.falconGold, fontWeight: 600 }}>${Math.round(Math.max(0, netSpread) * 400).toLocaleString()}</span>
      </div>
      {/* Navigate hint */}
      {onNavigate && (
        <div style={{ fontFamily: F.mono, fontSize: '9px', color: C.textMuted, letterSpacing: '0.10em', textAlign: 'center' as const, paddingTop: S.sm, opacity: 0.6 }}>
          › OPEN FULL VIEW
        </div>
      )}
    </div>
  );
}

// ── GapKPIView ────────────────────────────────────────────────────
function GapKPIView({ selectedZone, onNavigate }: { selectedZone: string | null; onNavigate?: () => void }) {
  const liveOps = useLiveOpsData(selectedZone);
  const { data: fuelMixData } = useFuelMix();
  const generationMw = (fuelMixData.fuels ?? []).reduce((s, x) => s + x.mw, 0);
  const loadForecastMw = liveOps.loadForecastMw || generationMw * 0.9;
  const capacityMw = generationMw > 0 ? generationMw : loadForecastMw * 1.15;
  const reserveMargin = loadForecastMw > 0 ? ((capacityMw - loadForecastMw) / loadForecastMw) * 100 : 0;
  const systemLoadGw = loadForecastMw / 1000;
  const capacityGw = capacityMw / 1000;
  const peakForecastGw = Math.max(systemLoadGw, (liveOps.actualLoadMw || loadForecastMw) / 1000);
  const gapColor   = reserveMargin < 15 ? C.alertCritical : reserveMargin < 18 ? C.falconGold : C.electricBlue;
  const badgeLabel = reserveMargin < 15 ? 'EMERGENCY'   : reserveMargin < 18 ? 'TIGHT'      : 'ADEQUATE';
  const badgeBg    = reserveMargin < 15 ? `${C.alertCritical}18` : reserveMargin < 18 ? `${C.falconGold}18` : `${C.electricBlue}18`;
  const badgeBorder= reserveMargin < 15 ? `${C.alertCritical}50` : reserveMargin < 18 ? `${C.falconGold}50` : `${C.electricBlue}50`;

  const StatusBadge = () => (
    <div style={{ display: 'inline-flex', alignItems: 'center', padding: '2px 8px', borderRadius: R.sm, backgroundColor: badgeBg, border: `1px solid ${badgeBorder}` }}>
      <span style={{ fontFamily: F.mono, fontSize: T.labelSize, color: gapColor, letterSpacing: T.labelSpacing }}>{badgeLabel}</span>
    </div>
  );

  const metrics = [
    { label: 'SYSTEM LOAD', value: `${systemLoadGw.toFixed(1)} GW`, color: C.textSecondary },
    { label: 'CAPACITY',    value: `${capacityGw.toFixed(1)} GW`, color: C.electricBlue },
    { label: 'PEAK FCST',   value: `${peakForecastGw.toFixed(1)} GW`, color: C.falconGold },
  ];

  return (
    <div
      onClick={onNavigate}
      style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', padding: S.lg, gap: S.sm, overflow: 'hidden', cursor: onNavigate ? 'pointer' : 'default' }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
        <span style={{ fontFamily: F.mono, fontSize: '10px', fontWeight: '600', color: C.textMuted, letterSpacing: '0.16em', textTransform: 'uppercase' as const }}>
          {selectedZone ?? 'WEST HUB'} RESOURCE GAP
        </span>
        <StatusBadge />
      </div>
      {/* Hero number */}
      <div style={{ flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: S.sm }}>
          <span style={{ fontFamily: F.mono, fontSize: '36px', fontWeight: 300, color: gapColor, lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>
            {reserveMargin.toFixed(1)}%
          </span>
        </div>
        <div style={{ fontFamily: F.mono, fontSize: T.labelSize, color: C.textMuted, letterSpacing: T.labelSpacing, textTransform: 'uppercase' as const, marginTop: S.xs }}>
          RESERVE MARGIN
        </div>
      </div>
      {/* Metrics strip */}
      <div style={{ display: 'flex', gap: S.sm, flexShrink: 0 }}>
        {metrics.map(m => (
          <div key={m.label} style={{ flex: 1, padding: '5px 8px', borderRadius: R.sm, backgroundColor: C.bgOverlay, border: `1px solid ${C.borderDefault}` }}>
            <div style={{ fontFamily: F.mono, fontSize: '8px', color: C.textMuted, letterSpacing: T.labelSpacing, textTransform: 'uppercase' as const, marginBottom: '3px' }}>{m.label}</div>
            <div style={{ fontFamily: F.mono, fontSize: T.dataSmSize, color: m.color, fontWeight: T.dataSmWeight }}>{m.value}</div>
          </div>
        ))}
      </div>
      {/* Navigate hint */}
      {onNavigate && (
        <div style={{ fontFamily: F.mono, fontSize: '9px', color: C.textMuted, letterSpacing: '0.10em', textAlign: 'center' as const, paddingTop: S.sm, opacity: 0.6 }}>
          › OPEN FULL VIEW
        </div>
      )}
    </div>
  );
}

/** Map PJM `fuel_type` strings to design tokens (same idea as Grid Atlas). */
function nestFuelColor(type: string): string {
  const t = type.toLowerCase();
  if (t.includes('gas')) return C.fuelGas;
  if (t.includes('nuclear')) return C.fuelNuclear;
  if (t.includes('wind')) return C.fuelWind;
  if (t.includes('solar')) return C.fuelSolar;
  if (t.includes('coal')) return C.fuelCoal;
  if (t.includes('hydro') || t.includes('water')) return C.fuelHydro;
  if (t.includes('storage') || t.includes('battery')) return C.fuelBattery;
  return C.fuelOther;
}

// PJM zone dropdown options — id drives selectedZone, name is the display label.
const PJM_ZONES: Array<{ id: string; name: string }> = [
  { id: 'WEST_HUB',    name: 'WEST HUB' },
  { id: 'PSEG',        name: 'PSEG'     },
  { id: 'RECO',        name: 'RECO'     },
  { id: 'COMED',       name: 'COMED'    },
  { id: 'AEP',         name: 'AEP'      },
  { id: 'DOMINION',    name: 'DOM'      },
  { id: 'DUQ',         name: 'DUQ'      },
  { id: 'JCPL',        name: 'JCPL'     },
  { id: 'PPL',         name: 'PPL'      },
  { id: 'PECO',        name: 'PECO'     },
  { id: 'BGE',         name: 'BGE'      },
  { id: 'PENELEC',     name: 'PENELEC'  },
  { id: 'METED',       name: 'MET-ED'   },
  { id: 'ATSI',        name: 'ATSI'     },
  { id: 'DEOK',        name: 'DEOK'     },
  { id: 'DAY',         name: 'DAY'      },
  { id: 'DPL',         name: 'DPL'      },
  { id: 'EKPC',        name: 'EKPC'     },
  { id: 'PEPCO',       name: 'PEPCO'    },
  { id: 'OVEC',        name: 'OVEC'     },
];

// ── EveryoneNest (the legacy NestView, fallback when profile is null/everyone) ──
export function EveryoneNest({
  selectedZone,
  setSelectedZone,
  onNavigateKPI,
}: {
  selectedZone: string | null;
  setSelectedZone: (z: string | null) => void;
  onNavigateKPI: (tab: 'lmp' | 'spread' | 'battery' | 'gap' | 'peregrine' | 'genmix') => void;
}) {
  const { data: fuelMixData, live: fuelMixLive } = useFuelMix();
  void useLiveOpsData(selectedZone);

  const genMixSegments = (() => {
    const fuels = fuelMixData.fuels ?? [];
    const sorted = [...fuels].sort((a, b) => b.mw - a.mw).slice(0, 8);
    const totalMw = sorted.reduce((s, x) => s + x.mw, 0);
    if (totalMw <= 0) return [];
    return sorted.map((f) => ({
      type: f.type,
      mw: f.mw,
      pct: (f.mw / totalMw) * 100,
      gw: f.mw / 1000,
      color: nestFuelColor(f.type),
    }));
  })();

  const zoneValue = selectedZone ?? 'WEST_HUB';
  const kpiCells: Array<{ key: string; label: string; view: React.ReactNode }> = [
    { key: 'lmp',     label: 'LMP HUB',      view: <LMPCard       selectedZone={selectedZone} onExpand={()  => onNavigateKPI('lmp')}     /> },
    { key: 'spark',   label: 'SPARK SPREAD', view: <SparkKPIView  selectedZone={selectedZone} onNavigate={() => onNavigateKPI('spread')}  /> },
    { key: 'battery', label: 'BATTERY ARB',  view: <BatteryKPIView selectedZone={selectedZone} onNavigate={() => onNavigateKPI('battery')} /> },
    { key: 'gap',     label: 'RESOURCE GAP', view: <GapKPIView    selectedZone={selectedZone} onNavigate={() => onNavigateKPI('gap')}     /> },
  ];

  return (
    <div style={{
      display:         'flex',
      flexDirection:   'column',
      height:          '100%',
      width:           '100%',
      backgroundColor: C.bgBase,
      boxSizing:       'border-box' as const,
      overflow:        'hidden',
    }}>
      {/* ── Zone selector bar — 48px ───────────────────── */}
      <div style={{
        height:       48,
        flexShrink:   0,
        display:      'flex',
        alignItems:   'center',
        gap:          S.xl,
        padding:      `0 ${S.xl}`,
        background:   C.bgElevated,
        borderBottom: `1px solid ${C.borderDefault}`,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: S.md }}>
          <span style={{
            fontFamily:    F.mono,
            fontSize:      '9px',
            color:         C.textMuted,
            letterSpacing: '0.14em',
            textTransform: 'uppercase' as const,
          }}>
            SELECTED ZONE
          </span>
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <select
              value={zoneValue}
              onChange={e => setSelectedZone(e.target.value)}
              style={{
                background:       C.bgSurface,
                border:           `1px solid ${C.borderDefault}`,
                borderRadius:     R.md,
                color:            C.textPrimary,
                fontFamily:       F.mono,
                fontSize:         '12px',
                fontWeight:       '600',
                padding:          '6px 32px 6px 12px',
                cursor:           'pointer',
                outline:          'none',
                letterSpacing:    '0.06em',
                appearance:       'none',
                WebkitAppearance: 'none',
                minWidth:         '180px',
              }}
            >
              {PJM_ZONES.map(z => (
                <option key={z.id} value={z.id}>{z.name}</option>
              ))}
            </select>
            <div style={{
              position:      'absolute',
              right:         10,
              top:           '50%',
              transform:     'translateY(-50%)',
              pointerEvents: 'none',
              color:         C.textMuted,
              fontSize:      '10px',
            }}>▾</div>
          </div>
        </div>

        <div style={{
          flex:           1,
          display:        'flex',
          alignItems:     'center',
          justifyContent: 'flex-end',
          gap:            S.lg,
          minWidth:       0,
        }}>
          <span style={{
            fontFamily:    F.mono,
            fontSize:      '10px',
            color:         C.textMuted,
            letterSpacing: '0.10em',
            whiteSpace:    'nowrap' as const,
          }}>
            PJM · REAL-TIME · 5-MIN DISPATCH
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: S.xs }}>
            <span
              aria-hidden
              style={{
                width:        6,
                height:       6,
                borderRadius: '50%',
                background:   C.alertNormal,
                boxShadow:    `0 0 6px ${C.alertNormal}`,
              }}
            />
            <span style={{
              fontFamily:    F.mono,
              fontSize:      '10px',
              fontWeight:    '600',
              color:         C.alertNormal,
              letterSpacing: '0.10em',
            }}>
              LIVE
            </span>
          </div>
        </div>
      </div>

      {/* ── 2×2 KPI grid — explicit height so it exactly fits between
          zone-selector (48) and genmix strip (96) below the 64px top nav. */}
      <div style={{
        height:              'calc(100vh - 64px - 48px - 96px)',
        display:             'grid',
        gridTemplateColumns: '1fr 1fr',
        gridTemplateRows:    '1fr 1fr',
        gap:                 '6px',
        padding:             '6px',
        overflow:            'hidden',
        minWidth:            0,
        minHeight:           0,
      }}>
        {kpiCells.map(cell => (
          <div key={cell.key} style={{
            position:     'relative',
            background:   C.bgElevated,
            border:       `1px solid ${C.borderDefault}`,
            borderTop:    `1px solid ${C.borderAccent}`,
            borderRadius: R.lg,
            overflow:     'hidden',
            minWidth:     0,
            minHeight:    0,
          }}>
            <ErrorBoundary label={cell.label}>
              <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
                {cell.view}
              </div>
            </ErrorBoundary>
          </div>
        ))}
      </div>

      {/* ── Generation Mix strip — bottom, full width ── */}
      <div style={{
        height:     96,
        flexShrink: 0,
        padding:    `0 ${S.sm} ${S.sm} ${S.sm}`,
      }}>
      <BentoCard
        title="GENERATION MIX"
        status={fuelMixLive ? 'live' : genMixSegments.length ? 'stale' : 'fallback'}
        onTitleClick={() => onNavigateKPI('genmix')}
      >
        <ErrorBoundary label="GENERATION MIX">
        <div style={{ height: '100%', padding: '6px 16px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '4px' }}>
          {genMixSegments.length === 0 ? (
            <span style={{ fontFamily: F.mono, fontSize: '8px', color: C.textMuted, letterSpacing: '0.06em' }}>
              NO LIVE PJM MIX — CHECK V2 API / CREDENTIALS
            </span>
          ) : (
            <>
              <div style={{ display: 'flex', width: '100%' }}>
                {genMixSegments.map((s, i) => (
                  <div
                    key={`${s.type}-${i}`}
                    style={{ width: `${s.pct}%`, display: 'flex', justifyContent: 'center', minWidth: 0 }}
                  >
                    <span style={{
                      fontFamily: F.mono, fontSize: '8px', fontVariantNumeric: 'tabular-nums', color: s.color,
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '100%',
                    }}>
                      {s.gw >= 10 ? s.gw.toFixed(1) : s.gw.toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
              <div style={{ height: '20px', width: '100%', display: 'flex', borderRadius: R.sm, overflow: 'hidden', flexShrink: 0 }}>
                {genMixSegments.map((s, i) => (
                  <div
                    key={`bar-${s.type}-${i}`}
                    style={{ width: `${s.pct}%`, height: '100%', backgroundColor: s.color, flexShrink: 0 }}
                  />
                ))}
              </div>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                {genMixSegments.map((s, i) => (
                  <div key={`leg-${s.type}-${i}`} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <div style={{ width: '6px', height: '6px', borderRadius: R.sm, backgroundColor: s.color, flexShrink: 0 }} />
                    <span style={{ fontFamily: F.sans, fontSize: '8px', color: C.textSecondary }}>
                      {s.type} {Math.round(s.pct)}%
                    </span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
        </ErrorBoundary>
      </BentoCard>
      </div>
    </div>
  );
}

export default EveryoneNest;
