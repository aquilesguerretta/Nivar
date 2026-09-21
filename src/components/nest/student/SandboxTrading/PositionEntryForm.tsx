// FORGE Wave 7 — Paper-trade entry form.
//
// Educational by design: the form snaps entry LMP from the live PJM
// feed so the student doesn't have to invent the price, gates the
// "Place position" button on a non-empty zone + non-zero size, and
// labels every input with the unit the student should be thinking in
// (MWh, $, $/MWh).
//
// All sliders, dropdowns, and chips inherit from the same patterns the
// Developer Underwriting form establishes: F.mono + tabular-nums on
// data, electric-blue chips for active state, Falcon Gold for the
// short direction (a directional signal, not a warning).

import { useEffect, useMemo, useState } from 'react';
import { C, F, R, S } from '@/design/tokens';
import { ContainedCard } from '@/components/terminal/ContainedCard';
import { EditorialIdentity } from '@/components/terminal/EditorialIdentity';
import { useLMP } from '@/hooks/data/useLMP';
import type { NewPositionInput } from '@/lib/sandbox/positionState';
import type { PositionDirection } from '@/lib/sandbox/types';

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
];

interface Props {
  onSubmit: (input: NewPositionInput) => void;
}

function todayISO(): string {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

export function PositionEntryForm({ onSubmit }: Props) {
  const [zone, setZone] = useState<string>('WEST_HUB');
  const [direction, setDirection] = useState<PositionDirection>('long');
  const [sizeMW, setSizeMW] = useState<number>(50);
  const [entryHour, setEntryHour] = useState<number>(new Date().getHours());
  const [holdHours, setHoldHours] = useState<number>(1);
  const [reasoning, setReasoning] = useState<string>('');
  const [overrideLMP, setOverrideLMP] = useState<number | null>(null);
  const [date, setDate] = useState<string>(todayISO());

  const live = useLMP(zone);

  // Resolve entry LMP: explicit override > live feed > zone-default 40.
  const effectiveLMP = useMemo(() => {
    if (typeof overrideLMP === 'number' && Number.isFinite(overrideLMP)) {
      return overrideLMP;
    }
    if (live.data?.lmp_total != null) return live.data.lmp_total;
    return 40;
  }, [overrideLMP, live.data]);

  // Reset the override when the zone changes so a stale price doesn't carry.
  useEffect(() => {
    setOverrideLMP(null);
  }, [zone]);

  const errors = useMemo<string[]>(() => {
    const errs: string[] = [];
    if (!zone) errs.push('Pick a zone.');
    if (sizeMW < 1) errs.push('Size must be at least 1 MW.');
    if (sizeMW > 500) errs.push('Size capped at 500 MW for the sandbox.');
    if (entryHour < 0 || entryHour > 23) errs.push('Entry hour must be 0–23.');
    if (holdHours < 1 || holdHours > 24) errs.push('Hold must be 1–24 hours.');
    if (!date) errs.push('Pick an entry date.');
    return errs;
  }, [zone, sizeMW, entryHour, holdHours, date]);

  function handleSubmit() {
    if (errors.length > 0) return;
    onSubmit({
      zone,
      direction,
      sizeMW,
      entryHour,
      entryLMP: effectiveLMP,
      entryDate: date,
      reasoning: reasoning.trim(),
      holdHours,
    });
    setReasoning('');
    setOverrideLMP(null);
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
        NEW PAPER POSITION
      </div>
      <EditorialIdentity size="section" marginBottom={S.lg}>
        Pick a zone, a direction, a size.
      </EditorialIdentity>

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

      <FormRow label="DIRECTION">
        <button
          type="button"
          onClick={() => setDirection('long')}
          style={chipStyle(direction === 'long', C.electricBlue)}
        >
          LONG
        </button>
        <button
          type="button"
          onClick={() => setDirection('short')}
          style={chipStyle(direction === 'short', C.falconGold)}
        >
          SHORT
        </button>
        <span style={hintStyle()}>
          {direction === 'long'
            ? 'Profit if LMP rises'
            : 'Profit if LMP falls'}
        </span>
      </FormRow>

      <SliderRow
        label="SIZE (MW)"
        value={sizeMW}
        onChange={setSizeMW}
        min={1}
        max={500}
        step={1}
        format={(v) => `${v} MW`}
      />

      <FormRow label="ENTRY DATE">
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          style={{ ...inputStyle(), width: 180 }}
        />
      </FormRow>

      <SliderRow
        label="ENTRY HOUR"
        value={entryHour}
        onChange={setEntryHour}
        min={0}
        max={23}
        step={1}
        format={(v) => `${String(v).padStart(2, '0')}:00`}
      />

      <SliderRow
        label="HOLD (HOURS)"
        value={holdHours}
        onChange={setHoldHours}
        min={1}
        max={24}
        step={1}
        format={(v) => `${v} h`}
      />

      <FormRow label="ENTRY LMP ($/MWh)">
        <input
          type="number"
          value={
            overrideLMP === null
              ? Number(effectiveLMP.toFixed(2))
              : overrideLMP
          }
          onChange={(e) => {
            const n = Number(e.target.value);
            setOverrideLMP(Number.isFinite(n) ? n : null);
          }}
          step={0.5}
          style={{ ...inputStyle(), width: 140 }}
        />
        {live.data?.lmp_total != null && overrideLMP === null && (
          <span
            style={{
              ...hintStyle(),
              color: C.electricBlueLight,
            }}
          >
            LIVE · {zone}
          </span>
        )}
        {overrideLMP !== null && (
          <button
            type="button"
            onClick={() => setOverrideLMP(null)}
            style={{
              background: 'transparent',
              border: `1px solid ${C.borderDefault}`,
              borderRadius: R.sm,
              padding: '4px 8px',
              fontFamily: F.mono,
              fontSize: 10,
              fontWeight: 600,
              letterSpacing: '0.10em',
              textTransform: 'uppercase',
              color: C.textSecondary,
              cursor: 'pointer',
            }}
          >
            USE LIVE
          </button>
        )}
      </FormRow>

      <FormRow label="REASONING">
        <textarea
          value={reasoning}
          onChange={(e) => setReasoning(e.target.value)}
          placeholder="What's the thesis? (optional)"
          rows={3}
          style={{
            ...inputStyle(),
            fontFamily: F.sans,
            flex: 1,
            resize: 'vertical',
            minHeight: 64,
          }}
        />
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
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <span style={hintStyle()}>
          Notional: ${(sizeMW * effectiveLMP * holdHours).toLocaleString()}
        </span>
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
          PLACE POSITION →
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
  return { ...inputStyle(), minWidth: 200, cursor: 'pointer' };
}

function chipStyle(active: boolean, activeColor: string): React.CSSProperties {
  return {
    background: active
      ? activeColor === C.falconGold
        ? C.falconGoldWash
        : C.electricBlueWash
      : 'transparent',
    border: `1px solid ${active ? activeColor : C.borderDefault}`,
    borderRadius: R.sm,
    padding: '4px 14px',
    fontFamily: F.mono,
    fontSize: 11,
    fontWeight: 600,
    letterSpacing: '0.14em',
    textTransform: 'uppercase',
    color: active ? activeColor : C.textSecondary,
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
