// FORGE Wave 6 — SaveQueryModal.
// Inline modal — name, tags, schedule, description. Stage state, then
// commit via onSave.

import { useState } from 'react';
import { C, F, R, S } from '@/design/tokens';
import type { ScheduleKind } from '@/lib/analyst/types';

interface Props {
  open: boolean;
  onClose: () => void;
  onSave: (input: {
    name: string;
    description: string;
    tags: string[];
    schedule: ScheduleKind;
  }) => void;
}

const SCHEDULE_OPTIONS: { kind: ScheduleKind; label: string }[] = [
  { kind: 'none', label: 'NONE (RUN ON DEMAND)' },
  { kind: 'hourly', label: 'HOURLY' },
  { kind: 'daily-8am', label: 'DAILY · 8 AM' },
  { kind: 'weekly-monday', label: 'WEEKLY · MONDAY 8 AM' },
  { kind: 'monthly-1st', label: 'MONTHLY · 1ST' },
];

export function SaveQueryModal({ open, onClose, onSave }: Props) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [tagsRaw, setTagsRaw] = useState('');
  const [schedule, setSchedule] = useState<ScheduleKind>('none');
  const [error, setError] = useState<string | null>(null);

  if (!open) return null;

  function handleSave() {
    if (!name.trim()) {
      setError('Name is required.');
      return;
    }
    const tags = tagsRaw
      .split(',')
      .map((t) => t.trim().toLowerCase())
      .filter(Boolean);
    onSave({ name: name.trim(), description: description.trim(), tags, schedule });
    setName('');
    setDescription('');
    setTagsRaw('');
    setSchedule('none');
    setError(null);
    onClose();
  }

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.75)',
        zIndex: 9700,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: S.xl,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: 520,
          background: C.bgElevated,
          border: `1px solid ${C.borderStrong}`,
          borderTop: `1px solid ${C.electricBlue}`,
          borderRadius: R.lg,
          padding: S.xl,
        }}
      >
        <div
          style={{
            fontFamily: F.mono,
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            color: C.electricBlueLight,
            marginBottom: S.md,
          }}
        >
          SAVE QUERY
        </div>

        <Field label="NAME">
          <input
            type="text"
            value={name}
            placeholder="Top negative-LMP hours, COMED, last week"
            onChange={(e) => setName(e.target.value)}
            style={{ ...inputStyle(), width: '100%' }}
          />
        </Field>

        <Field label="DESCRIPTION (OPTIONAL)">
          <textarea
            value={description}
            placeholder="Why this query matters, what to watch for…"
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            style={{ ...inputStyle(), width: '100%', resize: 'vertical' }}
          />
        </Field>

        <Field label="TAGS (COMMA-SEPARATED)">
          <input
            type="text"
            value={tagsRaw}
            placeholder="lmp, comed, negative-prices"
            onChange={(e) => setTagsRaw(e.target.value)}
            style={{ ...inputStyle(), width: '100%' }}
          />
        </Field>

        <Field label="SCHEDULE">
          <select
            value={schedule}
            onChange={(e) => setSchedule(e.target.value as ScheduleKind)}
            style={{ ...inputStyle(), width: '100%', cursor: 'pointer' }}
          >
            {SCHEDULE_OPTIONS.map((o) => (
              <option key={o.kind} value={o.kind}>
                {o.label}
              </option>
            ))}
          </select>
        </Field>

        {error && (
          <div
            style={{
              fontFamily: F.mono,
              fontSize: 11,
              color: C.alertCritical,
              marginBottom: S.sm,
            }}
          >
            {error}
          </div>
        )}

        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: S.sm,
            marginTop: S.lg,
            paddingTop: S.md,
            borderTop: `1px solid ${C.borderDefault}`,
          }}
        >
          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'transparent',
              border: `1px solid ${C.borderDefault}`,
              borderRadius: R.md,
              padding: `${S.sm} ${S.lg}`,
              fontFamily: F.mono,
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: C.textSecondary,
              cursor: 'pointer',
            }}
          >
            CANCEL
          </button>
          <button
            type="button"
            onClick={handleSave}
            style={{
              background: C.electricBlue,
              border: `1px solid ${C.electricBlue}`,
              borderRadius: R.md,
              padding: `${S.sm} ${S.lg}`,
              fontFamily: F.mono,
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: C.textPrimary,
              cursor: 'pointer',
            }}
          >
            SAVE
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: S.md }}>
      <div
        style={{
          fontFamily: F.mono,
          fontSize: 10,
          fontWeight: 500,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: C.textMuted,
          marginBottom: 4,
        }}
      >
        {label}
      </div>
      {children}
    </div>
  );
}

function inputStyle(): React.CSSProperties {
  return {
    background: C.bgSurface,
    border: `1px solid ${C.borderDefault}`,
    borderRadius: R.md,
    padding: '6px 10px',
    fontFamily: F.mono,
    fontSize: 13,
    fontVariantNumeric: 'tabular-nums',
    color: C.textPrimary,
    outline: 'none',
  };
}
