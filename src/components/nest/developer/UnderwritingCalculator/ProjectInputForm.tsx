// FORGE Wave 5 — Project input form for the Underwriting Calculator.
//
// The developer either picks an existing project from PROJECT_PIPELINE
// (auto-fills the form) or builds a custom spec from scratch. Every
// numeric input snaps to UNDERWRITING_DEFAULTS for the selected
// technology when the user hasn't typed in that field yet.
//
// All numeric values use F.mono + tabular-nums. Sliders for ranges,
// number inputs for currency, dropdowns for enums. No drop shadows,
// no pills — chips only on the technology/scenario toggles.

import { useEffect, useMemo, useState } from 'react';
import { C, F, R, S } from '@/design/tokens';
import { ContainedCard } from '@/components/terminal/ContainedCard';
import { EditorialIdentity } from '@/components/terminal/EditorialIdentity';
import {
  PROJECT_PIPELINE,
  UNDERWRITING_DEFAULTS,
  type DeveloperProject,
  type DeveloperTechnology,
} from '@/lib/mock/developer-mock';
import type { ProjectSpec } from '@/lib/underwriting/types';

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

const TECHS: DeveloperTechnology[] = ['Solar', 'Wind', 'BESS', 'Hybrid'];

const PRESET_CUSTOM = '__custom';

interface Props {
  /** Existing spec (when editing). When null, form starts at defaults. */
  initial?: ProjectSpec | null;
  /** Called when the user clicks "Run Underwriting" with a valid spec. */
  onSubmit: (spec: ProjectSpec) => void;
}

function specFromProject(p: DeveloperProject): ProjectSpec {
  const defaults = UNDERWRITING_DEFAULTS[p.technology];
  const zoneFromName = ZONES.find((z) => p.name.toUpperCase().includes(z)) ?? 'WEST_HUB';
  const codYear = Number(p.expectedCod.slice(0, 4));
  return {
    id: p.id,
    name: p.name,
    technology: p.technology,
    capacityMW: p.mw,
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
    ptcEligible: p.technology === 'Wind' || p.technology === 'Hybrid',
  };
}

export function ProjectInputForm({ initial, onSubmit }: Props) {
  const initialPresetId =
    initial && PROJECT_PIPELINE.find((p) => p.id === initial.id)
      ? initial.id
      : PROJECT_PIPELINE[0].id;
  const [presetId, setPresetId] = useState<string>(initialPresetId);

  const seed = useMemo<ProjectSpec>(() => {
    if (initial) return initial;
    return specFromProject(PROJECT_PIPELINE[0]);
  }, [initial]);

  const [name, setName] = useState(seed.name);
  const [technology, setTechnology] = useState<DeveloperTechnology>(seed.technology);
  const [capacityMW, setCapacityMW] = useState<number>(seed.capacityMW);
  const [zone, setZone] = useState(seed.zone);
  const [codYear, setCodYear] = useState(seed.codYear);
  const [economicLifeYears, setEconomicLifeYears] = useState(seed.economicLifeYears);
  const [capexPerMW, setCapexPerMW] = useState(seed.capexPerMW);
  const [opexPerMWYear, setOpexPerMWYear] = useState(seed.opexPerMWYear);
  const [debtRatio, setDebtRatio] = useState(seed.debtRatio);
  const [debtTenor, setDebtTenor] = useState(seed.debtTenor);
  const [debtRate, setDebtRate] = useState(seed.debtRate);
  const [taxRate, setTaxRate] = useState(seed.taxRate);
  const [discountRate, setDiscountRate] = useState(seed.discountRate);
  const [itcEligible, setItcEligible] = useState(seed.itcEligible);
  const [ptcEligible, setPtcEligible] = useState(seed.ptcEligible);

  // When the user picks a preset, repopulate every field.
  function applyPreset(id: string) {
    setPresetId(id);
    if (id === PRESET_CUSTOM) return;
    const project = PROJECT_PIPELINE.find((p) => p.id === id);
    if (!project) return;
    const spec = specFromProject(project);
    setName(spec.name);
    setTechnology(spec.technology);
    setCapacityMW(spec.capacityMW);
    setZone(spec.zone);
    setCodYear(spec.codYear);
    setEconomicLifeYears(spec.economicLifeYears);
    setCapexPerMW(spec.capexPerMW);
    setOpexPerMWYear(spec.opexPerMWYear);
    setDebtRatio(spec.debtRatio);
    setDebtTenor(spec.debtTenor);
    setDebtRate(spec.debtRate);
    setTaxRate(spec.taxRate);
    setDiscountRate(spec.discountRate);
    setItcEligible(spec.itcEligible);
    setPtcEligible(spec.ptcEligible);
  }

  // When tech changes (without preset), reset technology-dependent
  // defaults so the user doesn't have to remember to update them.
  useEffect(() => {
    if (presetId !== PRESET_CUSTOM) return;
    const d = UNDERWRITING_DEFAULTS[technology];
    setCapexPerMW(d.capexPerMW);
    setOpexPerMWYear(d.opexPerMWYear);
    setDebtRatio(d.debtRatio);
    setDebtTenor(d.debtTenor);
    setDebtRate(d.debtRate);
    setDiscountRate(d.discountRate);
    setEconomicLifeYears(d.economicLifeYears);
    setPtcEligible(technology === 'Wind' || technology === 'Hybrid');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [technology]);

  const errors = useMemo(() => {
    const errs: string[] = [];
    if (!name.trim()) errs.push('Project name is required.');
    if (capacityMW < 1) errs.push('Capacity must be ≥ 1 MW.');
    if (capacityMW > 1500) errs.push('Capacity exceeds 1.5 GW — unrealistic for V1.');
    if (codYear < 2026 || codYear > 2040) errs.push('COD year must be 2026–2040.');
    if (economicLifeYears < 10 || economicLifeYears > 35)
      errs.push('Economic life must be 10–35 years.');
    if (debtRatio < 0 || debtRatio > 0.85)
      errs.push('Debt ratio must be 0–0.85.');
    return errs;
  }, [name, capacityMW, codYear, economicLifeYears, debtRatio]);

  function handleSubmit() {
    if (errors.length > 0) return;
    const spec: ProjectSpec = {
      id: presetId === PRESET_CUSTOM
        ? `custom_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`
        : presetId,
      name: name.trim(),
      technology,
      capacityMW,
      zone,
      codYear,
      economicLifeYears,
      capexPerMW,
      opexPerMWYear,
      debtRatio,
      debtTenor,
      debtRate,
      taxRate,
      discountRate,
      itcEligible,
      ptcEligible,
    };
    onSubmit(spec);
  }

  return (
    <ContainedCard padding={S.lg}>
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
        PROJECT SPEC
      </div>
      <EditorialIdentity size="section" marginBottom={S.lg}>
        Tell us about the project.
      </EditorialIdentity>

      <FormRow label="START FROM">
        <select
          value={presetId}
          onChange={(e) => applyPreset(e.target.value)}
          style={selectStyle()}
        >
          {PROJECT_PIPELINE.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
          <option value={PRESET_CUSTOM}>— Custom —</option>
        </select>
      </FormRow>

      <FormRow label="NAME">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ ...inputStyle(), flex: 1, fontFamily: F.sans }}
        />
      </FormRow>

      <FormRow label="TECHNOLOGY">
        <div style={{ display: 'flex', gap: S.sm }}>
          {TECHS.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTechnology(t)}
              style={chipStyle(technology === t)}
            >
              {t.toUpperCase()}
            </button>
          ))}
        </div>
      </FormRow>

      <SliderRow
        label="CAPACITY (MW)"
        value={capacityMW}
        onChange={setCapacityMW}
        min={10}
        max={500}
        step={5}
        format={(v) => `${v} MW`}
      />

      <FormRow label="ZONE">
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
        label="COD YEAR"
        value={codYear}
        onChange={setCodYear}
        min={2026}
        max={2032}
        step={1}
        format={(v) => String(v)}
      />

      <SliderRow
        label="ECONOMIC LIFE (YEARS)"
        value={economicLifeYears}
        onChange={setEconomicLifeYears}
        min={15}
        max={30}
        step={1}
        format={(v) => `${v} yr`}
      />

      <FormRow label="CAPEX ($/MW)">
        <input
          type="number"
          value={capexPerMW}
          onChange={(e) => setCapexPerMW(Number(e.target.value))}
          step={10000}
          style={{ ...inputStyle(), width: 160 }}
        />
        <span style={hintStyle()}>
          ≈ ${((capacityMW * capexPerMW) / 1_000_000).toFixed(1)}M total
        </span>
      </FormRow>

      <SliderRow
        label="DEBT RATIO"
        value={debtRatio}
        onChange={setDebtRatio}
        min={0}
        max={0.85}
        step={0.05}
        format={(v) => `${(v * 100).toFixed(0)}%`}
      />

      <SliderRow
        label="TARGET IRR"
        value={discountRate}
        onChange={setDiscountRate}
        min={0.05}
        max={0.15}
        step={0.005}
        format={(v) => `${(v * 100).toFixed(1)}%`}
      />

      <FormRow label="POLICY ELIGIBILITY">
        <button
          type="button"
          onClick={() => setItcEligible((v) => !v)}
          style={chipStyle(itcEligible)}
        >
          ITC
        </button>
        <button
          type="button"
          onClick={() => setPtcEligible((v) => !v)}
          style={chipStyle(ptcEligible)}
        >
          PTC
        </button>
      </FormRow>

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
          marginTop: S.lg,
          paddingTop: S.md,
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
            padding: `0 ${S.lg}`,
            height: 40,
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
          RUN UNDERWRITING →
        </button>
      </div>
    </ContainedCard>
  );
}

// ─── Helpers ─────────────────────────────────────────────────────

function FormRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: S.md,
        padding: `${S.sm} 0`,
        borderBottom: `1px solid ${C.borderDefault}`,
      }}
    >
      <div style={{ width: 180, flexShrink: 0, ...labelStyle() }}>{label}</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: S.sm, flex: 1 }}>
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
          width: 110,
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
  return { ...inputStyle(), minWidth: 220, cursor: 'pointer' };
}

function chipStyle(active: boolean): React.CSSProperties {
  return {
    background: active ? C.electricBlueWash : 'transparent',
    border: `1px solid ${active ? C.electricBlue : C.borderDefault}`,
    borderRadius: R.sm,
    padding: '4px 8px',
    fontFamily: F.mono,
    fontSize: 11,
    fontWeight: 600,
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    color: active ? C.electricBlueLight : C.textSecondary,
    cursor: 'pointer',
  };
}

function hintStyle(): React.CSSProperties {
  return {
    fontFamily: F.mono,
    fontSize: 11,
    color: C.textMuted,
    letterSpacing: '0.10em',
  };
}
