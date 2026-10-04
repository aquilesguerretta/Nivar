// FORGE Wave 3 — Asset registration form.
// Operators register a single asset (or pick a preset fleet to import a
// whole portfolio at once). Submitting the form initializes the active
// fleet in the store, optionally adding the asset to an existing fleet.

import { useMemo, useState } from 'react';
import { C, F, R, S } from '@/design/tokens';
import { ContainedCard } from '@/components/terminal/ContainedCard';
import { EditorialIdentity } from '@/components/terminal/EditorialIdentity';
import { FLEETS } from '@/lib/mock/storage-optimizer-mock';
import type {
  AncillaryService,
  BatteryAsset,
  Fleet,
} from '@/lib/types/storage';

interface Props {
  /** Existing active fleet — when present, the form adds an asset to it. */
  existing?: Fleet | null;
  onSubmit: (fleet: Fleet) => void;
}

const ZONES = [
  'WEST_HUB',
  'PSEG',
  'JCPL',
  'BGE',
  'DOMINION',
  'COMED',
  'AEP',
  'RECO',
  'ATSI',
  'DPL',
  'PEPCO',
  'AECO',
  'METED',
  'PENELEC',
  'PPL',
  'DAY',
  'DUQ',
  'EKPC',
  'OVEC',
];

const DURATION_PRESETS = [1, 2, 4, 8] as const;

const ANCILLARY_OPTIONS: { value: AncillaryService; label: string }[] = [
  { value: 'reg-d', label: 'REG-D (FAST)' },
  { value: 'reg-a', label: 'REG-A (STANDARD)' },
  { value: 'spin', label: 'SYNC RESERVE' },
];

const PRESET_BLANK_ID = '__custom';

export function AssetRegistrationForm({ existing, onSubmit }: Props) {
  const [presetId, setPresetId] = useState<string>(
    existing?.id ?? FLEETS[1].id,
  );
  const [operatorName, setOperatorName] = useState(
    existing?.operatorName ?? FLEETS[1].operatorName,
  );

  // Single asset entry (used when adding to an existing fleet OR when
  // the user picks "custom").
  const [name, setName] = useState('New Battery Asset');
  const [zone, setZone] = useState(ZONES[1]);
  const [powerKW, setPowerKW] = useState(50_000);
  const [durationHours, setDurationHours] = useState<number>(4);
  const [customDuration, setCustomDuration] = useState(4);
  const [rte, setRte] = useState(0.88);
  const [degradation, setDegradation] = useState(5);
  const [ancillaryEnabled, setAncillaryEnabled] = useState(false);
  const [ancillaryService, setAncillaryService] =
    useState<AncillaryService>('reg-d');
  const [installDate, setInstallDate] = useState<string>('');
  const [cyclesToDate, setCyclesToDate] = useState<number>(0);

  const errors = useMemo(() => {
    const errs: string[] = [];
    if (!operatorName.trim()) errs.push('Operator name is required.');
    if (!name.trim() && presetId === PRESET_BLANK_ID)
      errs.push('Asset name is required.');
    if (powerKW < 100) errs.push('Power must be ≥ 100 kW.');
    if (durationHours < 1) errs.push('Duration must be ≥ 1 hour.');
    if (rte < 0.7 || rte > 0.95) errs.push('RTE must be 0.70 – 0.95.');
    if (degradation < 0 || degradation > 30)
      errs.push('Degradation cost must be $0 – $30 / MWh.');
    return errs;
  }, [operatorName, name, presetId, powerKW, durationHours, rte, degradation]);

  function handleSubmit() {
    if (errors.length > 0) return;

    if (presetId !== PRESET_BLANK_ID) {
      // User chose a preset fleet — submit as-is.
      const preset = FLEETS.find((f) => f.id === presetId);
      if (preset) {
        onSubmit({ ...preset, operatorName: operatorName.trim() });
        return;
      }
    }

    // Custom — assemble a single-asset fleet (or append to existing).
    const newAsset: BatteryAsset = {
      id: `asset_custom_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      name: name.trim(),
      zone,
      powerKW,
      durationHours,
      capacityKWh: powerKW * durationHours,
      rte,
      socMin: 0.10,
      socMax: 0.95,
      degradationCostPerMWh: degradation,
      ancillaryEnabled,
      ancillaryService: ancillaryEnabled ? ancillaryService : undefined,
      installDate: installDate || undefined,
      cyclesToDate: cyclesToDate || undefined,
    };

    if (existing) {
      onSubmit({
        ...existing,
        operatorName: operatorName.trim(),
        assets: [...existing.assets, newAsset],
      });
    } else {
      onSubmit({
        id: `fleet_custom_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
        operatorName: operatorName.trim(),
        assets: [newAsset],
        forecastSource: 'pjm-da-forecast',
      });
    }
  }

  return (
    <ContainedCard padding={S.xl}>
      <div
        style={{
          fontFamily: F.mono,
          fontSize: 11,
          fontWeight: 600,
          letterSpacing: '0.16em',
          textTransform: 'uppercase',
          color: C.electricBlueLight,
          marginBottom: 4,
        }}
      >
        REGISTER FLEET / ADD ASSET
      </div>
      <EditorialIdentity size="section" marginBottom={S.lg}>
        Tell us what you operate.
      </EditorialIdentity>

      <FormRow label="START FROM PRESET FLEET">
        <select
          value={presetId}
          onChange={(e) => {
            setPresetId(e.target.value);
            const f = FLEETS.find((x) => x.id === e.target.value);
            if (f) setOperatorName(f.operatorName);
          }}
          style={selectStyle()}
        >
          {FLEETS.map((f) => (
            <option key={f.id} value={f.id}>
              {f.operatorName} — {f.assets.length} asset
              {f.assets.length === 1 ? '' : 's'}
            </option>
          ))}
          <option value={PRESET_BLANK_ID}>— Custom (single asset) —</option>
        </select>
      </FormRow>

      <FormRow label="OPERATOR NAME">
        <input
          type="text"
          value={operatorName}
          onChange={(e) => setOperatorName(e.target.value)}
          style={{ ...inputStyle(), flex: 1, fontFamily: F.sans }}
        />
      </FormRow>

      {presetId === PRESET_BLANK_ID && (
        <>
          <FormRow label="ASSET NAME">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{ ...inputStyle(), flex: 1, fontFamily: F.sans }}
            />
          </FormRow>

          <FormRow label="PJM ZONE">
            <select
              value={zone}
              onChange={(e) => setZone(e.target.value)}
              style={selectStyle()}
            >
              {ZONES.map((z) => (
                <option key={z} value={z}>
                  {z}
                </option>
              ))}
            </select>
          </FormRow>

          <SliderRow
            label="POWER RATING (kW)"
            value={powerKW}
            onChange={setPowerKW}
            min={100}
            max={200_000}
            step={500}
            format={(v) => v.toLocaleString()}
          />

          <FormRow label="DURATION (HR)">
            <div style={{ display: 'flex', gap: S.sm }}>
              {DURATION_PRESETS.map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setDurationHours(d)}
                  style={chipStyle(durationHours === d)}
                >
                  {d}H
                </button>
              ))}
              <button
                type="button"
                onClick={() => setDurationHours(customDuration)}
                style={chipStyle(
                  !DURATION_PRESETS.includes(durationHours as 1 | 2 | 4 | 8),
                )}
              >
                CUSTOM
              </button>
              {!DURATION_PRESETS.includes(durationHours as 1 | 2 | 4 | 8) && (
                <input
                  type="number"
                  min={1}
                  max={24}
                  value={customDuration}
                  onChange={(e) => {
                    const v = Math.max(1, Math.min(24, Number(e.target.value)));
                    setCustomDuration(v);
                    setDurationHours(v);
                  }}
                  style={{ ...inputStyle(), width: 64 }}
                />
              )}
            </div>
          </FormRow>

          <SliderRow
            label="ROUND-TRIP EFFICIENCY"
            value={rte}
            onChange={setRte}
            min={0.80}
            max={0.95}
            step={0.01}
            format={(v) => `${(v * 100).toFixed(0)}%`}
          />

          <SliderRow
            label="DEGRADATION COST ($/MWh)"
            value={degradation}
            onChange={setDegradation}
            min={0}
            max={15}
            step={0.5}
            format={(v) => `$${v.toFixed(1)}`}
          />

          <FormRow label="ANCILLARY SERVICES">
            <button
              type="button"
              onClick={() => setAncillaryEnabled((v) => !v)}
              style={chipStyle(ancillaryEnabled)}
            >
              {ancillaryEnabled ? 'ENABLED' : 'DISABLED'}
            </button>
            {ancillaryEnabled && (
              <select
                value={ancillaryService}
                onChange={(e) =>
                  setAncillaryService(e.target.value as AncillaryService)
                }
                style={selectStyle()}
              >
                {ANCILLARY_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            )}
          </FormRow>

          <FormRow label="INSTALL DATE (OPTIONAL)">
            <input
              type="date"
              value={installDate}
              onChange={(e) => setInstallDate(e.target.value)}
              style={{ ...inputStyle(), width: 180 }}
            />
          </FormRow>

          <FormRow label="CYCLES TO DATE (OPTIONAL)">
            <input
              type="number"
              min={0}
              value={cyclesToDate}
              onChange={(e) =>
                setCyclesToDate(Math.max(0, Number(e.target.value)))
              }
              style={{ ...inputStyle(), width: 140 }}
            />
          </FormRow>
        </>
      )}

      {errors.length > 0 && (
        <div
          style={{
            marginTop: S.md,
            padding: S.sm,
            background: 'rgba(239,68,68,0.10)',
            border: `1px solid ${C.alertCritical}`,
            borderRadius: R.md,
            fontFamily: F.mono,
            fontSize: 11,
            color: C.alertCritical,
          }}
        >
          {errors.map((e, i) => (
            <div key={i}>• {e}</div>
          ))}
        </div>
      )}

      <div
        style={{
          marginTop: S.xl,
          paddingTop: S.lg,
          borderTop: `1px solid ${C.borderDefault}`,
          display: 'flex',
          justifyContent: 'flex-end',
        }}
      >
        <button
          type="button"
          disabled={errors.length > 0}
          onClick={handleSubmit}
          style={{
            background: C.electricBlue,
            border: 'none',
            borderRadius: R.md,
            padding: `0 ${S.xl}`,
            height: 44,
            fontFamily: F.mono,
            fontSize: 12,
            fontWeight: 600,
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            color: C.textPrimary,
            cursor: errors.length > 0 ? 'not-allowed' : 'pointer',
            opacity: errors.length > 0 ? 0.5 : 1,
          }}
        >
          {existing ? 'ADD ASSET' : 'REGISTER FLEET →'}
        </button>
      </div>
    </ContainedCard>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────

function FormRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: S.lg,
        padding: `${S.sm} 0`,
        borderBottom: `1px solid ${C.borderDefault}`,
      }}
    >
      <div
        style={{
          width: 240,
          flexShrink: 0,
          ...labelStyle(),
        }}
      >
        {label}
      </div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: S.sm,
          flex: 1,
        }}
      >
        {children}
      </div>
    </div>
  );
}

function SliderRow({
  label,
  value,
  onChange,
  min,
  max,
  step,
  format,
}: {
  label: string;
  value: number;
  onChange: (n: number) => void;
  min: number;
  max: number;
  step: number;
  format: (v: number) => string;
}) {
  return (
    <FormRow label={label}>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{ flex: 1, accentColor: C.electricBlue }}
      />
      <span
        style={{
          width: 130,
          textAlign: 'right',
          fontFamily: F.mono,
          fontSize: 13,
          fontWeight: 600,
          fontVariantNumeric: 'tabular-nums',
          color: C.textPrimary,
        }}
      >
        {format(value)}
      </span>
    </FormRow>
  );
}

function labelStyle(): React.CSSProperties {
  return {
    fontFamily: F.mono,
    fontSize: 11,
    fontWeight: 500,
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    color: C.textMuted,
  };
}

function inputStyle(): React.CSSProperties {
  return {
    background: C.bgSurface,
    border: `1px solid ${C.borderDefault}`,
    borderRadius: R.md,
    padding: '6px 10px',
    fontFamily: F.mono,
    fontSize: 13,
    fontWeight: 500,
    fontVariantNumeric: 'tabular-nums',
    color: C.textPrimary,
    outline: 'none',
  };
}

function selectStyle(): React.CSSProperties {
  return {
    ...inputStyle(),
    minWidth: 220,
    cursor: 'pointer',
  };
}

function chipStyle(active: boolean): React.CSSProperties {
  return {
    background: active ? C.electricBlueWash : 'transparent',
    border: `1px solid ${active ? C.electricBlue : C.borderDefault}`,
    borderRadius: R.sm,
    padding: '6px 10px',
    fontFamily: F.mono,
    fontSize: 11,
    fontWeight: 600,
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    color: active ? C.electricBlueLight : C.textSecondary,
    cursor: 'pointer',
  };
}
