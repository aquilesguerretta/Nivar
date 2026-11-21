import { C, F } from '@/design/tokens';
import {
  AreaChart, Area, ComposedChart, Line,
  XAxis, YAxis, Tooltip, ReferenceLine, CartesianGrid,
  ResponsiveContainer,
} from 'recharts'

import {
  ZONE_LMP_DETAIL, ZONE_SPARKLINE, ZONE_24H_PRICES,
  ZONE_CONSTRAINTS, ZONE_GEN_MIX, ZONE_FORECAST,
  PRICE_MIN, PRICE_MAX,
} from '../lib/pjm/mock-data'
import { useLiveOpsData } from '../hooks/data/useLiveOpsData';

/* ─── HELPERS ─────────────────────────────────────────────────── */

/* FIX 10 — Peak at 45% from top (y=45), trough at 82% (y=82) */
function sparklinePoints(values: number[]): string {
  const w = 100 / (values.length - 1)
  return values.map((v, i) => `${i * w},${82 - v * 37}`).join(' ')
}

/* ─── SUB-COMPONENTS ──────────────────────────────────────────── */

function LMPExpandedSystem() {
  const liveOps = useLiveOpsData(null);
  const hubData = ZONE_LMP_DETAIL['WEST_HUB']
  const hubPrices = ZONE_24H_PRICES['WEST_HUB']
  const loadForecastGw = liveOps.loadForecastMw / 1000;
  const actualLoadGw = liveOps.actualLoadMw / 1000;
  const loadDeltaGw = actualLoadGw - loadForecastGw;
  const hasWeather = liveOps.weatherSampleSize > 0;
  const hasLoadComparison = loadForecastGw > 0 && actualLoadGw > 0;
  const loadProgressPct = hasLoadComparison
    ? Math.max(0, Math.min(100, (actualLoadGw / loadForecastGw) * 100))
    : 0;

  return (
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px', height: '100%', overflow: 'auto' }}>
      {/* West Hub dominant price */}
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '16px' }}>
        <span style={{ fontFamily: F.mono, fontSize: '72px', fontWeight: 'bold', color: C.textPrimary, lineHeight: 1 }}>
          {hubData.price.toFixed(2)}
        </span>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <span style={{ fontFamily: F.mono, fontSize: '14px', color: 'rgba(255,255,255,0.4)' }}>$/MWh</span>
          <span style={{ fontFamily: F.mono, fontSize: '11px', color: hubData.delta >= 0 ? '#FFB800' : C.electricBlue }}>
            {hubData.delta >= 0 ? '▲' : '▼'} {Math.abs(hubData.delta).toFixed(2)} vs −1H
          </span>
        </div>
        <span style={{ fontFamily: F.mono, fontSize: '11px', color: 'rgba(255,255,255,0.2)', marginLeft: '8px' }}>
          WEST HUB · SYSTEM REFERENCE
        </span>
      </div>

      {/* 24h trend chart */}
      <div style={{ flexShrink: 0, height: '200px', minHeight: '200px', position: 'relative', display: 'flex', flexDirection: 'column' }}>
        <span style={{ fontFamily: F.mono, fontSize: '9px', color: 'rgba(255,255,255,0.2)', letterSpacing: '0.15em', flexShrink: 0 }}>
          24H LMP TREND — WEST HUB
        </span>
        <div style={{ flex: 1, minHeight: 0, marginTop: '8px' }}>
          <div style={{ width: '100%', height: '100%', background: '#111318', borderRadius: '8px', padding: '4px', boxSizing: 'border-box' as const }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={hubPrices.map((p, i) => ({ hour: i, price: p }))} margin={{ top: 4, right: 0, bottom: 0, left: 0 }}>
                <defs>
                  <linearGradient id="hubAreaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor={C.electricBlue} stopOpacity={0.30} />
                    <stop offset="95%" stopColor={C.electricBlue} stopOpacity={0.04} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="2 4" stroke="rgba(255,255,255,0.08)" vertical={false} />
                <XAxis dataKey="hour" hide />
                <YAxis hide domain={['auto', 'auto']} />
                <Area dataKey="price" fill="url(#hubAreaGrad)" stroke={C.electricBlue} strokeWidth={2.5} dot={false} type="monotone" isAnimationActive={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Market Drivers row */}
      <div style={{ display: 'flex', gap: '16px' }}>
        {/* Weather */}
        <div style={{ flex: 1, padding: '16px', border: '0.5px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)' }}>
          <div style={{ fontFamily: F.mono, fontSize: '8px', color: 'rgba(255,255,255,0.2)', letterSpacing: '0.15em', marginBottom: '8px' }}>WEATHER</div>
          <div style={{ fontFamily: F.mono, fontSize: '28px', color: C.textPrimary, fontWeight: 'bold' }}>
            {hasWeather ? `${liveOps.temperatureF.toFixed(0)}F` : '—'}
          </div>
          <div style={{ fontFamily: F.sans, fontSize: '10px', color: 'rgba(255,255,255,0.3)', marginTop: '4px' }}>
            {hasWeather
              ? `${liveOps.weatherAlert} · PJM regional avg · ${liveOps.weatherSampleSize}-location sample`
              : 'PJM regional weather unavailable'}
          </div>
        </div>
        {/* Load vs Forecast */}
        <div style={{ flex: 1, padding: '16px', border: '0.5px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)' }}>
          <div style={{ fontFamily: F.mono, fontSize: '8px', color: 'rgba(255,255,255,0.2)', letterSpacing: '0.15em', marginBottom: '8px' }}>LOAD VS FORECAST</div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
            <span style={{ fontFamily: F.mono, fontSize: '28px', color: C.textPrimary, fontWeight: 'bold' }}>
              {loadForecastGw > 0 ? loadForecastGw.toFixed(1) : '—'}
            </span>
            <span style={{ fontFamily: F.mono, fontSize: '11px', color: 'rgba(255,255,255,0.3)' }}>GW</span>
            <span style={{ fontFamily: F.sans, fontSize: '10px', color: loadDeltaGw > 0 ? '#FFB800' : C.electricBlue }}>
              {hasLoadComparison
                ? `${loadDeltaGw >= 0 ? '▲' : '▼'} ${Math.abs(loadDeltaGw).toFixed(1)} GW vs forecast`
                : 'Comparison unavailable'}
            </span>
          </div>
          <div style={{ height: '4px', background: 'rgba(255,255,255,0.08)', marginTop: '8px' }}>
            <div
              style={{
                height: '100%',
                width: `${loadProgressPct}%`,
                background: C.electricBlue,
              }}
            />
          </div>
        </div>
        {/* Zone extremes */}
        <div style={{ flex: 2, padding: '16px', border: '0.5px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)' }}>
          <div style={{ fontFamily: F.mono, fontSize: '8px', color: 'rgba(255,255,255,0.2)', letterSpacing: '0.15em', marginBottom: '12px' }}>ZONE EXTREMES</div>
          <div style={{ display: 'flex', gap: '24px' }}>
            {[
              { label: 'HIGHEST', zone: liveOps.highestZone?.zone ?? 'Unavailable', price: liveOps.highestZone?.price ?? null, color: '#FF4444' },
              { label: 'LOWEST', zone: liveOps.lowestZone?.zone ?? 'Unavailable', price: liveOps.lowestZone?.price ?? null, color: C.electricBlue },
              { label: 'MOST CONGESTED', zone: 'Unavailable', price: null, color: '#FFB800' },
            ].map(({ label, zone, price, color }) => (
              <div key={label}>
                <div style={{ fontFamily: F.mono, fontSize: '8px', color: 'rgba(255,255,255,0.2)', marginBottom: '4px' }}>{label}</div>
                <div style={{ fontFamily: F.mono, fontSize: '18px', color, fontWeight: 'bold' }}>{price === null ? '—' : price.toFixed(2)}</div>
                <div style={{ fontFamily: F.mono, fontSize: '9px', color: 'rgba(255,255,255,0.3)' }}>{zone}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function LMPExpandedZone({ zone }: { zone: string }) {
  const data = ZONE_LMP_DETAIL[zone] ?? ZONE_LMP_DETAIL['DEFAULT']
  const prices = ZONE_24H_PRICES[zone] ?? ZONE_24H_PRICES['DEFAULT']
  const hubPrices = ZONE_24H_PRICES['WEST_HUB']
  const constraints = ZONE_CONSTRAINTS[zone] ?? ZONE_CONSTRAINTS['DEFAULT']
  const genMix = ZONE_GEN_MIX[zone] ?? ZONE_GEN_MIX['DEFAULT']
  const forecast = ZONE_FORECAST[zone] ?? ZONE_FORECAST['DEFAULT']

  /* FIX 6 — absolute values for stacked bar */
  const energyAbs = Math.abs(data.energy)
  const congestionAbs = Math.abs(data.congestion)
  const lossAbs = Math.abs(data.loss)
  const total = energyAbs + congestionAbs + lossAbs


  return (
    <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '20px', height: '100%', overflow: 'auto' }}>

      {/* TOP SECTION — Zone header + component breakdown */}
      <div className="lmp-section-enter" style={{ display: 'flex', gap: '32px', alignItems: 'flex-start', flexShrink: 0 }}>
        {/* Price block */}
        <div>
          <div style={{ fontFamily: F.mono, fontSize: '11px', color: 'rgba(255,255,255,0.25)', letterSpacing: '0.2em', marginBottom: '4px' }}>
            {zone}
          </div>
          <div style={{ fontFamily: F.mono, fontSize: '64px', fontWeight: 'bold', color: C.textPrimary, lineHeight: 1 }}>
            {data.price.toFixed(2)}
          </div>
          <div style={{ fontFamily: F.mono, fontSize: '11px', color: 'rgba(255,255,255,0.3)', marginTop: '2px' }}>
            $/MWh
          </div>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            marginTop: '8px',
            padding: '3px 10px',
            background: data.delta >= 0 ? 'rgba(255,183,0,0.1)' : 'rgba(6,182,212,0.1)',
            border: `0.5px solid ${data.delta >= 0 ? 'rgba(255,183,0,0.3)' : 'rgba(6,182,212,0.3)'}`,
          }}>
            <span style={{ fontFamily: F.mono, fontSize: '11px', color: data.delta >= 0 ? '#FFB800' : C.electricBlue, fontWeight: 'bold' }}>
              {data.delta >= 0 ? '▲' : '▼'} {Math.abs(data.delta).toFixed(2)} vs −1H
            </span>
          </div>
        </div>

        {/* Component breakdown */}
        <div style={{ flex: 1, paddingTop: '8px' }}>
          <div style={{ fontFamily: F.mono, fontSize: '8px', color: 'rgba(255,255,255,0.2)', letterSpacing: '0.15em', marginBottom: '12px' }}>
            LMP COMPONENT BREAKDOWN
          </div>
          <div style={{ display: 'flex', gap: '32px', marginBottom: '12px' }}>
            {[
              { label: 'ENERGY',     value: data.energy,     color: C.electricBlue },
              { label: 'CONGESTION', value: data.congestion, color: data.congestion > 0.5 ? '#FFB800' : data.congestion < -0.1 ? '#FF4444' : C.electricBlue },
              { label: 'LOSS',       value: data.loss,        color: 'rgba(255,120,120,0.8)' },
            ].map(({ label, value, color }) => (
              <div
                key={label}
                title={label === 'ENERGY' ? 'Marginal cost of energy at system reference' : label === 'CONGESTION' ? 'Transmission congestion rent — positive = import constraint' : 'Line loss adjustment'}
                style={{ cursor: 'help', transition: 'transform 0.1s ease' }}
                onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.05)')}
                onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
              >
                <div style={{ fontFamily: F.mono, fontSize: '8px', color: 'rgba(255,255,255,0.2)', marginBottom: '4px' }}>{label}</div>
                <div style={{ fontFamily: F.mono, fontSize: '22px', color, fontWeight: 'bold' }}>
                  {value >= 0 ? '+' : ''}{value.toFixed(2)}
                </div>
              </div>
            ))}
          </div>
          {/* FIX 6 — Proportional stacked bar — 8px, absolute values, overflow visible */}
          <div style={{ display: 'flex', height: '8px', width: '100%', overflow: 'visible' }}>
            <div className="lmp-bar-segment" style={{ display: 'block', height: '100%', width: `${(energyAbs / total) * 100}%`, background: C.electricBlue, borderRadius: 0 }} />
            <div className="lmp-bar-segment" style={{ display: 'block', height: '100%', width: `${(congestionAbs / total) * 100}%`, background: data.congestion > 0 ? '#FFB800' : '#FF4444', borderRadius: 0 }} />
            <div className="lmp-bar-segment" style={{ display: 'block', height: '100%', width: `${(lossAbs / total) * 100}%`, background: 'rgba(255,120,120,0.8)', borderRadius: 0 }} />
          </div>
          <div style={{ display: 'flex', gap: '16px', marginTop: '6px' }}>
            {[
              { label: 'Energy', color: C.electricBlue },
              { label: 'Congestion', color: '#FFB800' },
              { label: 'Loss', color: 'rgba(255,120,120,0.8)' },
            ].map(({ label, color }) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <div style={{ width: '6px', height: '6px', background: color }} />
                <span style={{ fontFamily: F.sans, fontSize: '8px', color: 'rgba(255,255,255,0.25)' }}>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FIX 9 — METRICS STRIP — fixed 72px height */}
      <div className="lmp-section-enter" style={{
        height: '72px',
        flexShrink: 0,
        display: 'flex',
        background: 'rgba(255,255,255,0.02)',
        borderTop: '0.5px solid rgba(255,255,255,0.05)',
        borderBottom: '0.5px solid rgba(255,255,255,0.05)',
      }}>
        {[
          {
            label: '24H AVERAGE',
            value: data.avg24h.toFixed(2),
            sub: '$/MWh',
            color: C.textPrimary,
          },
          {
            label: '24H PEAK',
            value: data.peak.price.toFixed(2),
            sub: data.peak.hour,
            color: '#FF4444',
          },
          {
            label: '24H LOW',
            value: data.cheapest.price.toFixed(2),
            sub: data.cheapest.hour,
            color: C.electricBlue,
          },
          {
            label: 'AVG CONGESTION',
            value: (data.avgCongestion24h >= 0 ? '+' : '') + data.avgCongestion24h.toFixed(2),
            sub: '24H MEAN',
            color: data.avgCongestion24h > 0.3 ? '#FFB800' : C.electricBlue,
          },
        ].map(({ label, value, sub, color }, i, arr) => (
          <div
            key={label}
            className="lmp-metric-tile"
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              padding: '0 20px',
              borderRight: i < arr.length - 1
                ? '0.5px solid rgba(255,255,255,0.06)'
                : 'none',
            }}
          >
            <div style={{
              fontFamily: F.mono,
              fontSize: '8px',
              color: 'rgba(255,255,255,0.2)',
              letterSpacing: '0.15em',
              marginBottom: '4px',
              textTransform: 'uppercase',
            }}>
              {label}
            </div>
            <div style={{
              fontFamily: F.mono,
              fontSize: '22px',
              fontWeight: 'bold',
              color,
              lineHeight: 1,
            }}>
              {value}
            </div>
            <div style={{
              fontFamily: F.mono,
              fontSize: '9px',
              color: 'rgba(255,255,255,0.3)',
              marginTop: '3px',
            }}>
              {sub}
            </div>
          </div>
        ))}
      </div>

      {/* ── 24H PRICE CHART ── */}
      <div className="lmp-section-enter" style={{
        background: 'rgba(255,255,255,0.01)',
        padding: '16px 24px',
        minHeight: '240px',
        flex: '1 1 240px',
        borderBottom: '0.5px solid rgba(255,255,255,0.06)',
        display: 'flex',
        flexDirection: 'column',
      }}>
        {/* Chart header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', flexShrink: 0 }}>
          <span style={{ fontFamily: F.mono, fontSize: '8px', color: 'rgba(255,255,255,0.2)', letterSpacing: '0.15em' }}>
            24H PRICE TREND — {zone} vs WEST HUB
          </span>
          <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '20px', height: '2px', background: C.electricBlue }} />
              <span style={{ fontFamily: F.mono, fontSize: '11px', color: 'rgba(255,255,255,0.55)', letterSpacing: '0.08em' }}>{zone}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '20px', height: '0', borderTop: '1.5px dashed rgba(255,255,255,0.3)' }} />
              <span style={{ fontFamily: F.mono, fontSize: '11px', color: 'rgba(255,255,255,0.55)', letterSpacing: '0.08em' }}>WEST HUB</span>
            </div>
          </div>
        </div>

        {/* Recharts ComposedChart */}
        {(() => {
          const chartData = prices.map((p, i) => ({ hour: i, zone: p, hub: hubPrices[i] }))
          const peakIdx = prices.indexOf(Math.max(...prices))
          const lowIdx  = prices.indexOf(Math.min(...prices))

          const LMPTooltip = ({ active, payload, label }: any) => {
            if (!active || !payload?.length) return null
            const zonePrice = payload.find((p: any) => p.dataKey === 'zone')?.value
            const hubPrice  = payload.find((p: any) => p.dataKey === 'hub')?.value
            if (zonePrice == null) return null
            const spread = hubPrice != null ? zonePrice - hubPrice : null
            return (
              <div style={{ background: C.bgOverlay, border: `1px solid ${C.borderAccent}`, borderRadius: '6px', padding: '8px 12px', boxShadow: '0 4px 16px rgba(0,0,0,0.4)' }}>
                <div style={{ fontFamily: F.sans, fontSize: '11px', color: 'rgba(229,231,235,0.55)', marginBottom: '5px', letterSpacing: '0.06em' }}>{label}:00</div>
                <div style={{ fontFamily: F.mono, fontSize: '15px', fontWeight: '600', color: C.textPrimary, fontVariantNumeric: 'tabular-nums' }}>${zonePrice.toFixed(2)}/MWh</div>
                {spread != null && (
                  <div style={{ fontFamily: F.mono, fontSize: '11px', color: spread > 0 ? 'rgba(255,183,0,0.9)' : 'rgba(6,182,212,0.9)', marginTop: '3px', fontVariantNumeric: 'tabular-nums' }}>
                    {spread >= 0 ? '+' : ''}{spread.toFixed(2)} vs Hub
                  </div>
                )}
              </div>
            )
          }

          const PeakDot = (props: any) => {
            const { cx, cy, index } = props
            if (index === peakIdx) return <circle cx={cx} cy={cy} r={5} fill="#FF4444" stroke="#0A0A0B" strokeWidth={2} />
            if (index === lowIdx)  return <circle cx={cx} cy={cy} r={5} fill={C.electricBlue} stroke="#0A0A0B" strokeWidth={2} />
            return null
          }

          return (
            <div style={{ flex: 1, minHeight: 0 }}>
              <div style={{ width: '100%', height: '100%', background: '#111318', borderRadius: '8px', padding: '4px', boxSizing: 'border-box' as const }}>
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={chartData} margin={{ top: 10, right: 16, bottom: 20, left: 8 }}>
                    <defs>
                      <linearGradient id="zoneAreaGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%"  stopColor={C.electricBlue} stopOpacity={0.30} />
                        <stop offset="95%" stopColor={C.electricBlue} stopOpacity={0.05} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="2 4" stroke="rgba(255,255,255,0.10)" vertical={false} />
                    <XAxis
                      dataKey="hour"
                      type="number"
                      domain={[0, 23]}
                      ticks={[0, 3, 6, 9, 12, 15, 18, 21, 23]}
                      tickFormatter={h => `${h}:00`}
                      tick={{ fontFamily: F.sans, fontSize: 11, fill: 'rgba(229,231,235,0.55)' }}
                      axisLine={{ stroke: 'rgba(229,231,235,0.12)' }}
                      tickLine={false}
                    />
                    <YAxis
                      domain={[PRICE_MIN, PRICE_MAX]}
                      ticks={[25, 30, 35, 40, 45, 50, 55, 60]}
                      tickFormatter={v => `$${v}`}
                      tick={{ fontFamily: F.sans, fontSize: 11, fill: 'rgba(229,231,235,0.55)' }}
                      axisLine={false}
                      tickLine={false}
                      width={40}
                    />
                    <ReferenceLine y={data.avg24h} stroke="rgba(255,255,255,0.15)" strokeDasharray="4 4" strokeWidth={1} />
                    <Tooltip
                      content={<LMPTooltip />}
                      cursor={{ stroke: 'rgba(255,255,255,0.20)', strokeWidth: 1, strokeDasharray: '3 3' }}
                    />
                    <Area dataKey="zone" fill="url(#zoneAreaGrad)" stroke={C.electricBlue} strokeWidth={2.5} dot={<PeakDot />} type="monotone" isAnimationActive={false} />
                    <Line dataKey="hub" stroke="rgba(255,255,255,0.28)" strokeDasharray="4 4" strokeWidth={1.5} dot={false} type="monotone" isAnimationActive={false} />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </div>
          )
        })()}
      </div>

      {/* BOTTOM SECTION — Three panels, fixed 200px, never shrinks */}
      <div className="lmp-section-enter" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', flexShrink: 0, height: '200px', borderTop: '0.5px solid rgba(255,255,255,0.06)' }}>

        {/* Panel 1: Congestion Intelligence — accent left border */}
        <div className="lmp-panel-congestion" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', border: 'none', borderLeft: '2px solid rgba(255,183,0,0.4)', background: 'rgba(255,183,0,0.02)', padding: '16px 20px' }}>
          <div style={{
            fontFamily: F.mono,
            fontSize: '9px',
            color: 'rgba(255,183,0,0.6)',
            letterSpacing: '0.15em',
            paddingBottom: '8px',
            marginBottom: '12px',
            borderBottom: '0.5px solid rgba(255,255,255,0.06)',
            flexShrink: 0,
          }}>
            CONGESTION INTELLIGENCE
          </div>
          <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0' }}>
            {constraints.map((c, i) => (
              <div key={i} className="lmp-constraint-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="constraint-name" style={{ fontFamily: F.mono, fontSize: '9px', color: 'rgba(255,255,255,0.4)', transition: 'color 0.15s ease' }}>
                  {c.name}
                </span>
                <span style={{ fontFamily: F.mono, fontSize: '11px', fontWeight: 'bold', color: c.impact > 0.5 ? '#FFB800' : c.impact < 0 ? '#FF4444' : 'rgba(255,255,255,0.3)' }}>
                  {c.impact >= 0 ? '+' : ''}{c.impact.toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Panel 2: Zone Generation Mix — accent left border */}
        <div className="lmp-panel-genmix" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', border: 'none', borderLeft: '2px solid rgba(6,182,212,0.3)', background: 'rgba(6,182,212,0.01)', padding: '16px 20px' }}>
          <div style={{
            fontFamily: F.mono,
            fontSize: '9px',
            color: 'rgba(6,182,212,0.6)',
            letterSpacing: '0.15em',
            paddingBottom: '8px',
            marginBottom: '12px',
            borderBottom: '0.5px solid rgba(255,255,255,0.06)',
            flexShrink: 0,
          }}>
            ZONE GENERATION MIX
          </div>
          <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0' }}>
            <div style={{ display: 'flex', height: '6px', marginBottom: '4px', overflow: 'hidden', flexShrink: 0 }}>
              {genMix.map(({ fuel, pct, color }) => (
                <div key={fuel} className="lmp-bar-segment" style={{ width: `${pct}%`, background: color }} />
              ))}
            </div>
            {genMix.map(({ fuel, pct, color }) => (
              <div key={fuel} className="lmp-genmix-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <div style={{ width: '6px', height: '6px', background: color }} />
                  <span style={{ fontFamily: F.mono, fontSize: '9px', color: 'rgba(255,255,255,0.4)' }}>{fuel}</span>
                </div>
                <span style={{ fontFamily: F.mono, fontSize: '11px', color: 'rgba(255,255,255,0.6)', fontWeight: 'bold' }}>
                  {pct}%
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Panel 3: Price Forecast — accent left border */}
        <div className="lmp-panel-forecast" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', border: 'none', borderLeft: '2px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.01)', padding: '16px 20px' }}>
          <div style={{
            fontFamily: F.mono,
            fontSize: '9px',
            color: 'rgba(255,255,255,0.35)',
            letterSpacing: '0.15em',
            paddingBottom: '8px',
            marginBottom: '12px',
            borderBottom: '0.5px solid rgba(255,255,255,0.06)',
            flexShrink: 0,
          }}>
            PRICE FORECAST
          </div>
          <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0' }}>
            {forecast.map(({ hour, price }) => {
              const delta = price - data.price
              return (
                <div key={hour} className="lmp-forecast-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontFamily: F.mono, fontSize: '9px', color: 'rgba(255,255,255,0.3)' }}>{hour}</span>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <span style={{ fontFamily: F.mono, fontSize: '13px', fontWeight: 'bold', color: C.textPrimary }}>
                      {price.toFixed(2)}
                    </span>
                    <span style={{ fontFamily: F.mono, fontSize: '9px', color: delta >= 0 ? '#FFB800' : C.electricBlue }}>
                      {delta >= 0 ? '▲' : '▼'}{Math.abs(delta).toFixed(2)}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

/* ─── MAIN COMPONENT ──────────────────────────────────────────── */

export function LMPCard({ selectedZone, onExpand }: { selectedZone: string | null; onExpand?: () => void }) {
  const liveOps = useLiveOpsData(selectedZone);
  const zoneKey = selectedZone ?? 'WEST_HUB'
  const baseData = ZONE_LMP_DETAIL[zoneKey] ?? ZONE_LMP_DETAIL['DEFAULT']
  const lmpData = {
    ...baseData,
    price: liveOps.live ? liveOps.lmpPrice : baseData.price,
    delta: liveOps.live ? liveOps.lmpDelta : baseData.delta,
    energy: liveOps.live ? liveOps.lmpEnergy : baseData.energy,
    congestion: liveOps.live ? liveOps.lmpCongestion : baseData.congestion,
    loss: liveOps.live ? liveOps.lmpLoss : baseData.loss,
  }
  const sparkData = ZONE_SPARKLINE[zoneKey] ?? ZONE_SPARKLINE['DEFAULT']

  return (
    <div
      onClick={onExpand}
      style={{
        position: 'absolute',
        inset: 0,
        padding: 0,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        cursor: onExpand ? 'pointer' : 'default',
      }}
    >
        {/* FIX 2+10 — Background sparkline — opacity 0.12, strokeWidth 3 */}
        <svg
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.12, pointerEvents: 'none' }}
          preserveAspectRatio="none"
          viewBox="0 0 100 100"
        >
          <polyline
            points={sparklinePoints(sparkData)}
            fill="none"
            stroke={C.electricBlue}
            strokeWidth="3"
          />
        </svg>

        {/* ZONE 1 — Top 20% — Zone name + LIVE badge */}
        <div style={{
          flex: '0 0 20%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 16px',
        }}>
          <span style={{
            fontFamily: F.mono,
            fontSize: '9px',
            color: 'rgba(255,255,255,0.35)',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
          }}>
            {selectedZone ?? 'WEST HUB'} LMP
          </span>
          <span style={{
            fontFamily: F.mono,
            fontSize: '8px',
            color: C.alertNormal,
            letterSpacing: '0.15em',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
          }}>
            <span className="live-dot" style={{ width: '5px', height: '5px', borderRadius: '50%', background: C.alertNormal, display: 'inline-block' }} />
            LIVE
          </span>
        </div>

        {/* ZONE 2 — Middle 50% — Dominant price + delta badge */}
        <div style={{
          flex: '0 0 50%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
        }}>
          <div style={{
            fontFamily: F.mono,
            fontSize: '42px',
            fontWeight: 'bold',
            color: C.textPrimary,
            lineHeight: 1,
            letterSpacing: '-0.02em',
          }}>
            {lmpData.price.toFixed(2)}
          </div>
          <div style={{
            fontFamily: F.mono,
            fontSize: '10px',
            color: 'rgba(255,255,255,0.3)',
            letterSpacing: '0.1em',
          }}>
            $/MWh
          </div>
          {/* Delta badge */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            padding: '2px 8px',
            borderRadius: '2px',
            background: lmpData.delta >= 0 ? 'rgba(255,183,0,0.1)' : 'rgba(6,182,212,0.1)',
            border: `0.5px solid ${lmpData.delta >= 0 ? 'rgba(255,183,0,0.3)' : 'rgba(6,182,212,0.3)'}`,
          }}>
            <span style={{
              fontFamily: F.mono,
              fontSize: '10px',
              color: lmpData.delta >= 0 ? '#FFB800' : C.electricBlue,
              fontWeight: 'bold',
            }}>
              {lmpData.delta >= 0 ? '▲' : '▼'} {Math.abs(lmpData.delta).toFixed(2)} vs −1H
            </span>
          </div>
        </div>

        {/* ZONE 3 — Bottom 30% — FIX 3: Component rows + expand hint */}
        <div style={{
          flex: '0 0 30%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          padding: '0 16px 14px 16px',
          gap: '6px',
          overflow: 'visible',
        }}>
          {[
            { label: 'ENERGY',     value: lmpData.energy,     color: C.electricBlue },
            { label: 'CONGESTION', value: lmpData.congestion, color: lmpData.congestion > 0.5 ? '#FFB800' : lmpData.congestion < -0.1 ? '#FF4444' : C.electricBlue },
            { label: 'LOSS',       value: lmpData.loss,        color: 'rgba(255,100,100,0.7)' },
          ].map(({ label, value, color }) => (
            <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontFamily: F.mono, fontSize: '8px', color: 'rgba(255,255,255,0.25)', letterSpacing: '0.15em' }}>
                {label}
              </span>
              <span style={{ fontFamily: F.mono, fontSize: '10px', color, fontWeight: 'bold' }}>
                {value >= 0 ? '+' : ''}{value.toFixed(2)}
              </span>
            </div>
          ))}
          {/* Navigate hint */}
          {onExpand && (
            <div style={{ textAlign: 'center', marginTop: '2px' }}>
              <span style={{ fontFamily: F.mono, fontSize: '8px', color: 'rgba(255,255,255,0.15)', letterSpacing: '0.1em' }}>
                › OPEN FULL VIEW
              </span>
            </div>
          )}
        </div>
      </div>
  )
}

// ── LMPFullPage ─────────────────────────────────────────────────
export function LMPFullPage({ selectedZone }: { selectedZone: string | null }) {
  return (
    <div style={{ height: 'calc(100vh - 64px)', width: '100%', background: C.bgBase, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Sub-header */}
      <div style={{
        height: '44px',
        display: 'flex',
        alignItems: 'center',
        padding: '0 24px',
        borderBottom: `0.5px solid ${C.borderDefault}`,
        flexShrink: 0,
        gap: '16px',
      }}>
        <span style={{ fontFamily: F.mono, fontSize: '11px', color: 'rgba(255,255,255,0.5)', letterSpacing: '0.15em' }}>
          LMP INTELLIGENCE
        </span>
        {selectedZone && (
          <span style={{ fontFamily: F.mono, fontSize: '11px', color: C.electricBlue, letterSpacing: '0.1em' }}>
            / {selectedZone}
          </span>
        )}
      </div>
      {/* Content — branches based on zone selection */}
      <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        {selectedZone ? <LMPExpandedZone zone={selectedZone} /> : <LMPExpandedSystem />}
      </div>
    </div>
  )
}
