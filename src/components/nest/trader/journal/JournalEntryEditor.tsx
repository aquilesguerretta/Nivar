// FORGE — Journal entry editor.
// Shared by "create" and "edit" modes. Inline form: trading date, stance,
// title, body, zones (toggleable PJM chips), tags (free-form), P&L,
// attachments (drag-drop + file picker, 5 MB cap per file).

import { useEffect, useRef, useState } from 'react';
import { C, F, R, S } from '@/design/tokens';
import { ContainedCard } from '@/components/terminal/ContainedCard';
import { useJournalStore } from '@/stores/journalStore';
import type {
  EntryStance,
  JournalAttachment,
  JournalEntry,
} from '@/lib/types/journal';
import type { NewEntryInput } from '@/stores/journalStore';

const PJM_ZONES = ['WEST_HUB', 'AEP', 'PSEG', 'COMED', 'RECO'] as const;
const STANCES: EntryStance[] = ['long', 'short', 'flat', 'observation'];

const TITLE_MAX = 120;
const BODY_MAX = 5000;

export type EditorSavePayload =
  | { mode: 'create'; input: NewEntryInput }
  | { mode: 'edit'; id: string; patch: Partial<JournalEntry> };

interface Props {
  initialEntry?: JournalEntry;
  onSave: (payload: EditorSavePayload) => void;
  onCancel: () => void;
}

export function JournalEntryEditor({ initialEntry, onSave, onCancel }: Props) {
  const isEdit = Boolean(initialEntry);
  const todayIso = new Date().toISOString().slice(0, 10);

  const [tradingDate, setTradingDate] = useState(
    initialEntry?.tradingDate ?? todayIso,
  );
  const [stance, setStance] = useState<EntryStance>(
    initialEntry?.stance ?? 'observation',
  );
  const [title, setTitle] = useState(initialEntry?.title ?? '');
  const [body, setBody] = useState(initialEntry?.body ?? '');
  const [zones, setZones] = useState<string[]>(initialEntry?.zones ?? []);
  const [tags, setTags] = useState<string[]>(initialEntry?.tags ?? []);
  const [tagDraft, setTagDraft] = useState('');
  const [pnlText, setPnlText] = useState<string>(
    initialEntry?.pnl == null ? '' : String(initialEntry.pnl),
  );
  const [attachments, setAttachments] = useState<JournalAttachment[]>(
    initialEntry?.attachments ?? [],
  );
  const [attachError, setAttachError] = useState<string | null>(null);
  const [titleError, setTitleError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { attachToEntry, removeAttachment } = useJournalStore();

  useEffect(() => {
    if (title.length > TITLE_MAX) {
      setTitleError(`Title is too long (max ${TITLE_MAX} chars).`);
    } else {
      setTitleError(null);
    }
  }, [title]);

  function toggleZone(z: string) {
    setZones((prev) =>
      prev.includes(z) ? prev.filter((x) => x !== z) : [...prev, z],
    );
  }

  function commitTag() {
    const trimmed = tagDraft.trim().toLowerCase().replace(/\s+/g, '-');
    if (!trimmed) return;
    if (tags.includes(trimmed)) {
      setTagDraft('');
      return;
    }
    setTags([...tags, trimmed]);
    setTagDraft('');
  }

  function removeTag(t: string) {
    setTags(tags.filter((x) => x !== t));
  }

  async function handleFiles(fileList: FileList | null) {
    if (!fileList || fileList.length === 0) return;
    setAttachError(null);

    if (!isEdit || !initialEntry) {
      // For "create" mode, we read the file inline and stash a transient
      // attachment on local state. The store's attachToEntry only works
      // after an entry has an id.
      try {
        setUploading(true);
        const next: JournalAttachment[] = [];
        for (const file of Array.from(fileList)) {
          if (file.size > 5 * 1024 * 1024) {
            throw new Error(
              `${file.name} too large. Maximum 5 MB; received ${(file.size / 1024 / 1024).toFixed(2)} MB.`,
            );
          }
          const dataUrl = await readFileAsDataUrl(file);
          next.push({
            id: `att_local_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
            name: file.name,
            mimeType: file.type,
            dataUrl,
            attachedAt: new Date().toISOString(),
          });
        }
        setAttachments((prev) => [...prev, ...next]);
      } catch (err) {
        setAttachError(err instanceof Error ? err.message : 'Upload failed.');
      } finally {
        setUploading(false);
      }
      return;
    }

    // Edit mode — push directly to the store, then sync local state.
    try {
      setUploading(true);
      for (const file of Array.from(fileList)) {
        const att = await attachToEntry(initialEntry.id, file);
        setAttachments((prev) => [...prev, att]);
      }
    } catch (err) {
      setAttachError(err instanceof Error ? err.message : 'Upload failed.');
    } finally {
      setUploading(false);
    }
  }

  function handleRemoveAttachment(attId: string) {
    setAttachments((prev) => prev.filter((a) => a.id !== attId));
    if (isEdit && initialEntry) {
      removeAttachment(initialEntry.id, attId);
    }
  }

  function handleSave() {
    if (!title.trim()) {
      setTitleError('Title is required.');
      return;
    }
    if (title.length > TITLE_MAX) return;
    if (body.length > BODY_MAX) return;

    const pnl = pnlText.trim() === '' ? null : Number(pnlText);
    if (pnlText.trim() !== '' && !Number.isFinite(pnl)) return;

    if (isEdit && initialEntry) {
      onSave({
        mode: 'edit',
        id: initialEntry.id,
        patch: {
          tradingDate,
          stance,
          title: title.trim(),
          body,
          zones,
          tags,
          pnl,
          attachments,
        },
      });
    } else {
      onSave({
        mode: 'create',
        input: {
          tradingDate,
          stance,
          title: title.trim(),
          body,
          zones,
          tags,
          pnl,
        },
      });
    }
  }

  return (
    <ContainedCard padding={S.xl}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: S.md,
          marginBottom: S.lg,
        }}
      >
        <span
          style={{
            fontFamily: F.mono,
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            color: C.electricBlueLight,
          }}
        >
          {isEdit ? 'EDIT ENTRY' : 'NEW ENTRY'}
        </span>
        <span style={{ marginLeft: 'auto', display: 'flex', gap: S.md }}>
          <span style={labelStyle()}>DATE</span>
          <input
            type="date"
            value={tradingDate}
            onChange={(e) => setTradingDate(e.target.value)}
            style={{
              ...inputBaseStyle(),
              fontFamily: F.mono,
              fontSize: 12,
              padding: '6px 8px',
            }}
          />
          <span style={labelStyle()}>STANCE</span>
          <select
            value={stance}
            onChange={(e) => setStance(e.target.value as EntryStance)}
            style={{
              ...inputBaseStyle(),
              fontFamily: F.mono,
              fontSize: 12,
              padding: '6px 8px',
            }}
          >
            {STANCES.map((s) => (
              <option key={s} value={s}>
                {s.toUpperCase()}
              </option>
            ))}
          </select>
        </span>
      </div>

      {/* Title */}
      <input
        type="text"
        value={title}
        placeholder="Title — what happened today?"
        onChange={(e) => setTitle(e.target.value)}
        maxLength={TITLE_MAX + 50}
        style={{
          ...inputBaseStyle(),
          width: '100%',
          height: 48,
          fontFamily: F.sans,
          fontSize: 18,
          fontWeight: 500,
          padding: `0 ${S.md}`,
          marginBottom: S.sm,
        }}
      />
      {titleError && (
        <div
          style={{
            fontFamily: F.mono,
            fontSize: 11,
            color: C.alertCritical,
            marginBottom: S.sm,
          }}
        >
          {titleError}
        </div>
      )}

      {/* Body */}
      <textarea
        value={body}
        placeholder="What did you see? What did you do? Why?"
        onChange={(e) => setBody(e.target.value)}
        maxLength={BODY_MAX}
        style={{
          ...inputBaseStyle(),
          width: '100%',
          minHeight: 200,
          fontFamily: F.sans,
          fontSize: 14,
          lineHeight: 1.6,
          padding: S.md,
          resize: 'vertical',
          marginBottom: S.sm,
        }}
      />
      <div
        style={{
          fontFamily: F.mono,
          fontSize: 10,
          color: C.textMuted,
          textAlign: 'right',
          marginBottom: S.lg,
        }}
      >
        {body.length} / {BODY_MAX}
      </div>

      {/* Zones */}
      <div style={{ marginBottom: S.lg }}>
        <div style={{ ...labelStyle(), marginBottom: S.sm }}>ZONES</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: S.sm }}>
          {PJM_ZONES.map((z) => {
            const active = zones.includes(z);
            return (
              <button
                key={z}
                type="button"
                onClick={() => toggleZone(z)}
                style={{
                  fontFamily: F.mono,
                  fontSize: 11,
                  fontWeight: 600,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  padding: '6px 10px',
                  borderRadius: R.sm,
                  border: `1px solid ${active ? C.electricBlue : C.borderDefault}`,
                  background: active ? C.electricBlueWash : 'transparent',
                  color: active ? C.electricBlueLight : C.textSecondary,
                  cursor: 'pointer',
                  transition: 'all 150ms cubic-bezier(0.4, 0, 0.2, 1)',
                }}
              >
                {z}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tags */}
      <div style={{ marginBottom: S.lg }}>
        <div style={{ ...labelStyle(), marginBottom: S.sm }}>TAGS</div>
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            gap: S.sm,
          }}
        >
          {tags.map((t) => (
            <span
              key={t}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                fontFamily: F.mono,
                fontSize: 11,
                fontWeight: 500,
                color: C.textPrimary,
                background: C.bgSurface,
                padding: '4px 8px',
                borderRadius: R.sm,
              }}
            >
              #{t}
              <button
                type="button"
                onClick={() => removeTag(t)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  color: C.textMuted,
                  padding: 0,
                  fontFamily: F.mono,
                  fontSize: 12,
                }}
              >
                ×
              </button>
            </span>
          ))}
          <input
            type="text"
            value={tagDraft}
            placeholder="Add tag, press Enter"
            onChange={(e) => setTagDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ',') {
                e.preventDefault();
                commitTag();
              } else if (e.key === 'Backspace' && tagDraft === '' && tags.length) {
                setTags(tags.slice(0, -1));
              }
            }}
            style={{
              ...inputBaseStyle(),
              fontFamily: F.mono,
              fontSize: 12,
              padding: '6px 8px',
              minWidth: 180,
              flex: 1,
            }}
          />
        </div>
      </div>

      {/* P&L */}
      <div style={{ marginBottom: S.lg, display: 'flex', alignItems: 'center', gap: S.sm }}>
        <span style={labelStyle()}>P&amp;L</span>
        <span
          style={{
            fontFamily: F.mono,
            fontSize: 14,
            color: C.textMuted,
          }}
        >
          $
        </span>
        <input
          type="number"
          step="any"
          value={pnlText}
          placeholder="0.00"
          onChange={(e) => setPnlText(e.target.value)}
          style={{
            ...inputBaseStyle(),
            fontFamily: F.mono,
            fontSize: 14,
            fontVariantNumeric: 'tabular-nums',
            padding: '6px 8px',
            width: 160,
          }}
        />
        <span
          style={{
            fontFamily: F.mono,
            fontSize: 10,
            color: C.textMuted,
            letterSpacing: '0.10em',
          }}
        >
          (leave blank if no result yet)
        </span>
      </div>

      {/* Attachments */}
      <div style={{ marginBottom: S.lg }}>
        <div style={{ ...labelStyle(), marginBottom: S.sm }}>SCREENSHOTS</div>

        <div
          onDragOver={(e) => {
            e.preventDefault();
          }}
          onDrop={(e) => {
            e.preventDefault();
            handleFiles(e.dataTransfer.files);
          }}
          style={{
            border: `1px dashed ${C.borderStrong}`,
            borderRadius: R.md,
            padding: S.lg,
            background: C.bgSurface,
            color: C.textSecondary,
            fontFamily: F.mono,
            fontSize: 12,
            textAlign: 'center',
            cursor: 'pointer',
          }}
          onClick={() => fileInputRef.current?.click()}
        >
          {uploading
            ? 'Uploading…'
            : 'Drop screenshots here, or click to upload (max 5 MB each)'}
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          style={{ display: 'none' }}
          onChange={(e) => {
            handleFiles(e.target.files);
            if (fileInputRef.current) fileInputRef.current.value = '';
          }}
        />

        {attachError && (
          <div
            style={{
              fontFamily: F.mono,
              fontSize: 11,
              color: C.alertCritical,
              marginTop: S.sm,
            }}
          >
            {attachError}
          </div>
        )}

        {attachments.length > 0 && (
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: S.sm,
              marginTop: S.md,
            }}
          >
            {attachments.map((a) => (
              <div
                key={a.id}
                style={{
                  position: 'relative',
                  width: 80,
                  height: 80,
                  border: `1px solid ${C.borderDefault}`,
                  borderRadius: R.md,
                  overflow: 'hidden',
                  background: C.bgSurface,
                }}
              >
                <img
                  src={a.dataUrl}
                  alt={a.name}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
                <button
                  type="button"
                  onClick={() => handleRemoveAttachment(a.id)}
                  style={{
                    position: 'absolute',
                    top: 4,
                    right: 4,
                    width: 20,
                    height: 20,
                    borderRadius: '50%',
                    border: 'none',
                    background: 'rgba(0,0,0,0.7)',
                    color: C.textPrimary,
                    fontFamily: F.mono,
                    fontSize: 12,
                    cursor: 'pointer',
                    lineHeight: 1,
                  }}
                  title="Remove"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer actions */}
      <div
        style={{
          display: 'flex',
          gap: S.sm,
          justifyContent: 'flex-end',
          paddingTop: S.md,
          borderTop: `1px solid ${C.borderDefault}`,
        }}
      >
        <button
          type="button"
          onClick={onCancel}
          style={{
            background: 'transparent',
            border: `1px solid ${C.borderDefault}`,
            borderRadius: R.md,
            padding: `${S.sm} ${S.lg}`,
            fontFamily: F.mono,
            fontSize: 12,
            fontWeight: 600,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: C.textSecondary,
            cursor: 'pointer',
          }}
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSave}
          disabled={uploading || !title.trim() || title.length > TITLE_MAX}
          style={{
            background: C.electricBlue,
            border: 'none',
            borderRadius: R.md,
            padding: `${S.sm} ${S.lg}`,
            fontFamily: F.mono,
            fontSize: 12,
            fontWeight: 600,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: C.textPrimary,
            cursor: uploading ? 'not-allowed' : 'pointer',
            opacity: uploading || !title.trim() ? 0.5 : 1,
          }}
        >
          {isEdit ? 'Save changes' : 'Save entry'}
        </button>
      </div>
    </ContainedCard>
  );
}

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

function labelStyle(): React.CSSProperties {
  return {
    fontFamily: F.mono,
    fontSize: 10,
    fontWeight: 500,
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    color: C.textMuted,
  };
}

function inputBaseStyle(): React.CSSProperties {
  return {
    background: C.bgSurface,
    border: `1px solid ${C.borderDefault}`,
    borderRadius: R.md,
    color: C.textPrimary,
    outline: 'none',
  };
}
