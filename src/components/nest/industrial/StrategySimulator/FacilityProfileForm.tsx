// FORGE Wave 2 — Facility profile form.
// User enters their facility's parameters; submission writes a complete
// FacilityProfile into the simulator store and triggers run() via the
// onSubmit callback. Form-fields stay numeric and explicit — sliders
// for ranges, inputs for currency, dropdowns for tariff kind.

import { useMemo, useState } from 'react';
import { C, F, R, S } from '@/design/tokens';
import { ContainedCard } from '@/components/terminal/ContainedCard';
import { EditorialIdentity } from '@/components/terminal/EditorialIdentity';
import {
  FACILITY_PROFILES,
  TARIFF_LIBRARY,
} from '@/lib/mock/simulator-mock';
import type {
  FacilityProfile,
  TariffKind,
} from '@/lib/types/simulator';

interface Props {
  initial?: FacilityProfile | null;
  onSubmit: (profile: FacilityProfile) => void;
}

const ZONES = ['WEST_HUB', 'AEP', 'PSEG', 'COMED', 'RECO'];
const TARIFF_KINDS: TariffKind[] = [
  'flat',
  'time-of-use',
  'demand-charge',
  'real-time',
];
const TARIFF_LABEL: Record<TariffKind, string> = {
  flat: 'FLAT',
  'time-of-use': 'TIME-OF-USE',
  'demand-charge': 'DEMAND CHARGE',
  'real-time': 'REAL-TIME LMP',
};

const PRESET_BLANK_ID = '__custom';

export function FacilityProfileForm({ initial, onSubmit }: Props) {
  const seed = initial ?? FACILITY_PROFILES[0];

  const [presetId, setPresetId] = useState<string>(seed.id);
  const [name, setName] = useState(seed.name);
  const [zone, setZone] = useState(seed.zone);
  const [annualMWh, setAnnualMWh] = useState(seed.annualBaselineMWh);
  const [tariffKind, setTariffKind] = useState<TariffKind>(seed.tariff.type);
  const [energyRate, setEnergyRate] = useState(seed.tariff.energyRate);
  const [demandCharge, setDemandCharge] = useState(
    seed.tariff.demandCharge ?? 0,
  );
  const [solarKW, setSolarKW] = useState(seed.existingSolarKW);
  const [batteryKWh, setBatteryKWh] = useState(seed.existingBatteryKWh);
  const [batteryKW, setBatteryKW] = useState(seed.existingBatteryKW);
  const [budget, setBudget] = useState(seed.capitalBudgetUSD);
  const [discountPct, setDiscountPct] = useState(
    Math.round(seed.discountRate * 100),
  );

  function applyPreset(id: string) {
    setPresetId(id);
    if (id === PRESET_BLANK_ID) return;
    const preset = FACILITY_PROFILES.find((p) => p.id === id);
    if (!preset) return;
    setName(preset.name);
    setZone(preset.zone);
    setAnnualMWh(preset.annualBaselineMWh);
    setTariffKind(preset.tariff.type);
    setEnergyRate(preset.tariff.energyRate);
    setDemandCharge(preset.tariff.demandCharge ?? 0);
    setSolarKW(preset.existingSolarKW);
    setBatteryKWh(preset.existingBatteryKWh);
    setBatteryKW(preset.existingBatteryKW);
    setBudget(preset.capitalBudgetUSD);
    setDiscountPct(Math.round(preset.discountRate * 100));
  }

  const errors = useMemo(() => {
    const errs: string[] = [];
    if (!name.trim()) errs.push('Facility name is required.');
    if (annualMWh < 1_000) errs.push('Annual consumption must be ≥ 1,000 MWh.');
    if (energyRate <= 0) errs.push('Energy rate must be positive.');
    if (budget < 100_000) errs.push('Capital budget must be ≥ $100,000.');
    if (discountPct < 1 || discountPct > 25)
      errs.push('Discount rate must be 1-25%.');
    return errs;
  }, [name, annualMWh, energyRate, budget, discountPct]);

  function handleSubmit() {
    if (errors.length > 0) return;

    // Pull the load profile shape from the matching preset. If user picked
    // "custom", scale the closest preset's profile to the chosen MWh.
    const sourcePreset =
      FACILITY_PROFILES.find((p) => p.id === presetId) ?? FACILITY_PROFILES[0];
    const scale = annualMWh / sourcePreset.annualBaselineMWh;
    const hourlyLoadProfile = sourcePreset.hourlyLoadProfile.map((row) =>
      row.map((v) => Number((v * scale).toFixed(4))),
    );

    const tariff =
      tariffKind === 'time-of-use'
        ? {
            ...TARIFF_LIBRARY.tou_industrial,
            energyRate,
          }
        : {
            type: tariffKind,
            energyRate,
            demandCharge:
              tariffKind === 'demand-charge' ? demandCharge : undefined,
          };

    const profile: FacilityProfile = {
      id:
        presetId === PRESET_BLANK_ID
          ? `custom_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`
          : presetId,
      name: name.trim(),
      zone,
      annualBaselineMWh: annualMWh,
      hourlyLoadProfile,
      tariff,
      existingSolarKW: solarKW,
      existingBatteryKWh: batteryKWh,
      existingBatteryKW: batteryKW,
      capitalBudgetUSD: budget,
      discountRate: discountPct / 100,
    };

    onSubmit(profile);
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
        FACILITY PROFILE
      </div>
      <EditorialIdentity size="section" marginBottom={S.lg}>
        Tell us about the site.
      </EditorialIdentity>

      {/* Preset row */}
      <FormRow label="START FROM PRESET">
        <select
          value={presetId}
          onChange={(e) => applyPreset(e.target.value)}
          style={selectStyle()}
        >
          {FACILITY_PROFILES.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
          <option value={PRESET_BLANK_ID}>— Custom —</option>
        </select>
      </FormRow>

      <FormRow label="FACILITY NAME">
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
        label="ANNUAL CONSUMPTION (MWh/YR)"
        value={annualMWh}
        onChange={setAnnualMWh}
        min={5_000}
        max={500_000}
        step={1_000}
        format={(v) => v.toLocaleString()}
      />

      <FormRow label="TARIFF TYPE">
        <select
          value={tariffKind}
          onChange={(e) => setTariffKind(e.target.value as TariffKind)}
          style={selectStyle()}
        >
          {TARIFF_KINDS.map((k) => (
            <option key={k} value={k}>
              {TARIFF_LABEL[k]}
            </option>
          ))}
        </select>
      </FormRow>

      <FormRow label="ENERGY RATE ($/MWh)">
        <input
          type="number"
          value={energyRate}
          onChange={(e) => setEnergyRate(Number(e.target.value))}
          style={{ ...inputStyle(), width: 140 }}
        />
      </FormRow>

      {tariffKind === 'demand-charge' && (
        <FormRow label="DEMAND CHARGE ($/MW-MONTH)">
          <input
            type="number"
            value={demandCharge}
            onChange={(e) => setDemandCharge(Number(e.target.value))}
            style={{ ...inputStyle(), width: 140 }}
          />
        </FormRow>
      )}

      <SliderRow
        label="EXISTING SOLAR (kW DC)"
        value={solarKW}
        onChange={setSolarKW}
        min={0}
        max={50_000}
        step={100}
        format={(v) => v.toLocaleString()}
      />

      <SliderRow
        label="EXISTING BATTERY ENERGY (kWh)"
        value={batteryKWh}
        onChange={setBatteryKWh}
        min={0}
        max={50_000}
        step={100}
        format={(v) => v.toLocaleString()}
      />

      <SliderRow
        label="EXISTING BATTERY POWER (kW)"
        value={batteryKW}
        onChange={setBatteryKW}
        min={0}
        max={20_000}
        step={50}
        format={(v) => v.toLocaleString()}
      />

      <SliderRow
        label="CAPITAL BUDGET (USD)"
        value={budget}
        onChange={setBudget}
        min={100_000}
        max={50_000_000}
        step={100_000}
        format={(v) => `$${(v / 1_000_000).toFixed(2)}M`}
      />

      <SliderRow
        label="DISCOUNT RATE (%)"
        value={discountPct}
        onChange={setDiscountPct}
        min={1}
        max={25}
        step={1}
        format={(v) => `${v}%`}
      />

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
          RUN SIMULATION →
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
