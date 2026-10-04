// FORGE Wave 7 — Lightweight hypothetical-project form.
//
// Reuses the FORGE Wave 6 underwriting engine: the student picks the
// four educational inputs (tech, capacity, zone, COD year) and
// everything else (capex, opex, debt, policy eligibility) snaps to
// UNDERWRITING_DEFAULTS for the technology. That's enough to give a
// pedagogically meaningful IRR / NPV / breakeven without the full
// 11-field form.

import { useMemo, useState } from 'react';
import { C, F, R, S } from '@/design/tokens';
import { ContainedCard } from '@/components/terminal/ContainedCard';
import { EditorialIdentity } from '@/components/terminal/EditorialIdentity';
import {
  UNDERWRITING_DEFAULTS,
  type DeveloperTechnology,
} from '@/lib/mock/developer-mock';
import { runUnderwriting } from '@/lib/underwriting/runUnderwriting';
import type { ProjectSpec } from '@/lib/underwriting/types';
import { useSandboxStore } from '@/lib/sandbox/positionState';
import type { HypotheticalProject } from '@/lib/sandbox/types';

const ZONES = [
  'WEST_HUB',
  'PSEG',
  'JCPL',
  'BGE',
  'DOMINION',
  'COMED',
  'AEP',
  'RECO',
];

const TECHS: DeveloperTechnology[] = ['Solar', 'Wind', 'BESS', 'Hybrid'];

interface Props {
  /** Called after the engine builds and persists the new project so the
   *  parent can switch the highlight to it. */
  onCreated: (project: HypotheticalProject) => void;
  /** Max projects allowed in the sandbox. V1 caps at 5 to keep
   *  the library scannable. */
  maxProjects?: number;
}

function makeId(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

function specFor(
  name: string,
  technology: DeveloperTechnology,
  capacityMW: number,
  zone: string,
  codYear: number,
): ProjectSpec {
  const d = UNDERWRITING_DEFAULTS[technology];
  return {
    id: makeId('hp'),
    name,
    technology,
    capacityMW,
    zone,
    codYear,
    economicLifeYears: d.economicLifeYears,
    capexPerMW: d.capexPerMW,
    opexPerMWYear: d.opexPerMWYear,
    debtRatio: d.debtRatio,
    debtTenor: d.debtTenor,
    debtRate: d.debtRate,
    taxRate: 0.21,
    discountRate: d.discountRate,
    itcEligible: true,
    ptcEligible: technology === 'Wind' || technology === 'Hybrid',
  };
}

export function HypotheticalProjectForm({ onCreated, maxProjects = 5 }: Props) {
  const addProject = useSandboxStore((s) => s.addProject);
  const projects = useSandboxStore((s) => s.projects);

  const [name, setName] = useState<string>('My First Project');
  const [technology, setTechnology] = useState<DeveloperTechnology>('Solar');
  const [capacityMW, setCapacityMW] = useState<number>(100);
  const [zone, setZone] = useState<string>('PSEG');
  const [codYear, setCodYear] = useState<number>(2028);
  const [isRunning, setIsRunning] = useState(false);
  const [lastError, setLastError] = useState<string | null>(null);

  const atCap = projects.length >= maxProjects;

  const errors = useMemo<string[]>(() => {
    const errs: string[] = [];
    if (!name.trim()) errs.push('Give the project a name.');
    if (capacityMW < 1 || capacityMW > 500)
      errs.push('Capacity must be 1–500 MW.');
    if (codYear < 2026 || codYear > 2032) errs.push('COD year must be 2026–2032.');
    if (atCap) errs.push(`Max ${maxProjects} projects in the sandbox.`);
    return errs;
  }, [name, capacityMW, codYear, atCap, maxProjects]);

  function handleRun() {
    if (errors.length > 0) return;
    setIsRunning(true);
    setLastError(null);
    try {
      const spec = specFor(name.trim(), technology, capacityMW, zone, codYear);
      const projection = runUnderwriting(spec);
      const project: HypotheticalProject = {
        id: spec.id,
        name: spec.name,
        technology,
        capacityMW,
        zone,
        codYear,
        createdAt: new Date().toISOString(),
        projection,
        performance: null,
      };
      addProject(project);
      onCreated(project);
    } catch (err) {
      setLastError(
        err instanceof Error ? err.message : 'Failed to run underwriting.',
      );
    } finally {
      setIsRunning(false);
    }
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
        HYPOTHETICAL PROJECT
      </div>
      <EditorialIdentity size="section" marginBottom={S.lg}>
        Sketch a project. We'll underwrite it.
      </EditorialIdentity>

      <FormRow label="NAME">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Penn State 50 MW Solar"
          style={{ ...inputStyle(), flex: 1, fontFamily: F.sans }}
        />
      </FormRow>

      <FormRow label="TECHNOLOGY">
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

      {(errors.length > 0 || lastError) && (
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
          {lastError && <div>• {lastError}</div>}
        </div>
      )}

      <div
        style={{
          marginTop: S.lg,
          paddingTop: S.md,
          borderTop: `1px solid ${C.borderDefault}`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <span
          style={{
            fontFamily: F.mono,
            fontSize: 11,
            color: C.textMuted,
            letterSpacing: '0.10em',
          }}
        >
          {projects.length}/{maxProjects} PROJECTS · DEFAULTS FROM
          UNDERWRITING_DEFAULTS[{technology.toUpperCase()}]
        </span>
        <button
          type="button"
          disabled={errors.length > 0 || isRunning}
          onClick={handleRun}
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
            cursor: errors.length > 0 || isRunning ? 'not-allowed' : 'pointer',
            opacity: errors.length > 0 || isRunning ? 0.5 : 1,
          }}
        >
          {isRunning ? 'UNDERWRITING…' : 'UNDERWRITE →'}
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
      <div style={{ width: 160, flexShrink: 0, ...labelStyle() }}>{label}</div>
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
  return { ...inputStyle(), minWidth: 180, cursor: 'pointer' };
}

function chipStyle(active: boolean): React.CSSProperties {
  return {
    background: active ? C.electricBlueWash : 'transparent',
    border: `1px solid ${active ? C.electricBlue : C.borderDefault}`,
    borderRadius: R.sm,
    padding: '4px 12px',
    fontFamily: F.mono,
    fontSize: 11,
    fontWeight: 600,
    letterSpacing: '0.14em',
    textTransform: 'uppercase',
    color: active ? C.electricBlueLight : C.textSecondary,
    cursor: 'pointer',
  };
}
