// ATLAS Wave 5 — Asset detail panel.
//
// Anchored top-right of the GridAtlasView, mirrors the left-rail
// panel pattern (bgOverlay tier, R.lg, 14px backdrop blur, scroll
// internal). Discriminated union: renders GenerationUnit or
// BatteryAsset, with battery-only fields gated behind the kind tag.
//
// Mounted by GridAtlasView; opens when the user clicks any
// individual all-US generator dot or battery dot. The map's onClick
// handler dispatches to onGeneratorClick / onBatteryClick on
// GridAtlasView, which sets `selectedAsset` to drive the panel.
//
// Click-outside / ✕ close → setSelectedAsset(null).

import { useEffect } from 'react';
import { C, F, R, S } from '@/design/tokens';
import type {
  AssetStatus,
  BatteryAsset,
  FuelType,
  GenerationUnit,
} from '@/lib/types/infrastructure';

// ── Discriminated union via a `kind` tag projected on the GeoJSON
// properties when GridAtlasView builds the FeatureCollections. The
// click handler unwraps the props and tags them so this panel can
// branch without re-querying the source.

export type SelectedAsset =
  | ({ kind: 'generation' } & GenerationUnit)
  | ({ kind: 'battery' }    & BatteryAsset);

interface Props {
  asset: SelectedAsset | null;
  onClose: () => void;
}

// ── Status → color key (matches FOUNDRY's AssetStatus union) ───────────

const STATUS_COLOR: Record<AssetStatus, string> = {
  operating:            C.electricBlue,
  planned:              C.falconGold,
  'under-construction': C.falconGold,
  standby:              C.textMuted,
  retired:              C.alertCritical,
  cancelled:            C.alertCritical,
};

// ── Fuel → color key (matches FOUNDRY's FuelType union) ────────────────

const FUEL_COLOR: Record<FuelType, string> = {
  gas:        C.fuelGas,
  coal:       C.fuelCoal,
  nuclear:    C.fuelNuclear,
  wind:       C.fuelWind,
  solar:      C.fuelSolar,
  hydro:      C.fuelHydro,
  pumped:     C.fuelHydro,
  biomass:    '#7FB069',
  geothermal: '#FF6B35',
  oil:        '#A0522D',
  other:      C.fuelOther,
};

// ── Helpers ────────────────────────────────────────────────────────────

const fmtMw = (mw: number) =>
  mw >= 1000 ? `${(mw / 1000).toFixed(2)} GW` : `${mw.toLocaleString()} MW`;

const fmtMwh = (mwh: number | null) =>
  mwh == null ? '—'
  : mwh >= 1000 ? `${(mwh / 1000).toFixed(2)} GWh`
  : `${mwh.toLocaleString()} MWh`;

const fmtDate = (iso: string | null) => {
  if (!iso) return '—';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short' }).toUpperCase();
};

const titleCase = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

// ── Component ──────────────────────────────────────────────────────────

export function AssetDetailPanel({ asset, onClose }: Props) {
  // ESC closes — matches the left-rail panel + scrubber affordance.
  useEffect(() => {
    if (!asset) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [asset, onClose]);

  if (!asset) return null;

  const statusColor = STATUS_COLOR[asset.status] ?? C.textMuted;

  return (
    <div
      role="dialog"
      aria-label="Asset detail"
      style={{
        position:      'absolute',
        top:           64,
        right:         12,
        width:         320,
        maxHeight:     'calc(100vh - 160px)',
        overflowY:     'auto',
        zIndex:        25,
        background:    C.bgOverlay,
        border:        `1px solid ${C.borderDefault}`,
        borderTop:     `1px solid ${C.borderActive}`,
        borderRadius:  R.lg,
        backdropFilter: 'blur(14px)',
        WebkitBackdropFilter: 'blur(14px)',
        boxShadow:     '0 12px 32px rgba(0,0,0,0.45)',
        padding:       S.md,
        display:       'flex',
        flexDirection: 'column',
        gap:           S.sm,
        pointerEvents: 'auto',
      }}
    >
      {/* Header — eyebrow + close ────────────────────────────────────── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{
          fontFamily:    F.mono,
          fontSize:      10,
          fontWeight:    700,
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          color:         C.electricBlue,
        }}>
          {asset.kind === 'battery' ? 'BATTERY STORAGE' : 'GENERATION UNIT'}
        </span>
        <button
          onClick={onClose}
          aria-label="Close"
          style={{
            background:  'transparent',
            border:      'none',
            color:       C.textMuted,
            fontFamily:  F.mono,
            fontSize:    14,
            cursor:      'pointer',
            padding:     0,
            lineHeight:  1,
          }}
        >
          ✕
        </button>
      </div>

      {/* Name ─────────────────────────────────────────────────────────── */}
      <div style={{
        fontFamily:    F.mono,
        fontSize:      14,
        fontWeight:    700,
        color:         C.textPrimary,
        letterSpacing: '0.02em',
        lineHeight:    1.3,
      }}>
        {asset.name}
      </div>

      {/* Owner + ISO + state row ─────────────────────────────────────── */}
      <div style={{
        display:        'flex',
        justifyContent: 'space-between',
        alignItems:     'center',
        gap:            S.sm,
        fontFamily:     F.mono,
        fontSize:       10,
        color:          C.textSecondary,
        letterSpacing:  '0.06em',
      }}>
        <span>{asset.owner ?? 'Owner unknown'}</span>
        <span style={{
          padding:       '2px 6px',
          border:        `1px solid ${C.borderStrong}`,
          borderRadius:  R.sm,
          fontWeight:    700,
          letterSpacing: '0.12em',
          color:         C.electricBlueLight,
        }}>
          {asset.iso}
        </span>
      </div>

      <Divider />

      {/* Fuel + Capacity ─────────────────────────────────────────────── */}
      {asset.kind === 'generation' && (
        <Row label="Fuel">
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <span style={{
              display:      'inline-block',
              width:        8,
              height:       8,
              borderRadius: '50%',
              background:   FUEL_COLOR[asset.fuel] ?? C.fuelOther,
            }} />
            <span style={{
              fontFamily: F.mono,
              fontSize:   12,
              color:      C.textPrimary,
              fontWeight: 600,
            }}>
              {titleCase(asset.fuel)}
            </span>
          </span>
        </Row>
      )}

      <Row label="Capacity">{fmtMw(asset.capacityMw)}</Row>

      {/* Battery-only fields ─────────────────────────────────────────── */}
      {asset.kind === 'battery' && (
        <>
          <Row label="Energy">{fmtMwh(asset.capacityMwh)}</Row>
          <Row label="Duration">
            {asset.durationHours != null ? `${asset.durationHours.toFixed(1)} hr` : '—'}
          </Row>
        </>
      )}

      {/* State ───────────────────────────────────────────────────────── */}
      <Row label="State">{asset.state}</Row>

      {/* Status ──────────────────────────────────────────────────────── */}
      <Row label="Status">
        <span style={{
          display:        'inline-flex',
          alignItems:     'center',
          gap:            6,
          fontFamily:     F.mono,
          fontSize:       10,
          fontWeight:     700,
          letterSpacing:  '0.14em',
          textTransform:  'uppercase',
          color:          statusColor,
        }}>
          <span style={{
            display:      'inline-block',
            width:        6,
            height:       6,
            borderRadius: '50%',
            background:   statusColor,
          }} />
          {asset.status.replace(/-/g, ' ')}
        </span>
      </Row>

      <Divider />

      {/* Dates ──────────────────────────────────────────────────────── */}
      <Row label="COD">{fmtDate(asset.codDate)}</Row>
      <Row label="Retirement">{fmtDate(asset.retirementDate)}</Row>

      <Divider />

      {/* EIA reference ──────────────────────────────────────────────── */}
      <div style={{
        fontFamily:    F.mono,
        fontSize:      9,
        color:         C.textMuted,
        letterSpacing: '0.10em',
        textTransform: 'uppercase',
      }}>
        EIA · plant {asset.eiaPlantId ?? '—'} · gen {asset.eiaGeneratorId ?? '—'}
      </div>
    </div>
  );
}

// ── Internal layout helpers ─────────────────────────────────────────────

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{
      display:        'flex',
      justifyContent: 'space-between',
      alignItems:     'center',
      gap:            S.sm,
      fontFamily:     F.mono,
      fontSize:       12,
      color:          C.textPrimary,
      fontVariantNumeric: 'tabular-nums',
    }}>
      <span style={{
        fontFamily:    F.mono,
        fontSize:      10,
        color:         C.textMuted,
        letterSpacing: '0.10em',
        textTransform: 'uppercase',
      }}>
        {label}
      </span>
      <span style={{ fontWeight: 600 }}>{children}</span>
    </div>
  );
}

function Divider() {
  return (
    <div style={{
      height:     1,
      background: C.borderDefault,
      margin:     `${S.xs} 0`,
    }} />
  );
}
