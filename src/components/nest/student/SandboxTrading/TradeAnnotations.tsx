// FORGE Wave 7 — Trade annotations panel.
//
// Sits beside the selected position in the library and lets the
// student add free-form notes after the fact — "why I closed this",
// "what I learned", "what I'd do differently". Mirrors the post-trade
// reflection pattern from the Trader Journal but lives inside the
// sandbox so the student can iterate before promoting an annotation
// into a permanent journal entry (Phase 4 continued).

import { useState } from 'react';
import { C, F, R, S } from '@/design/tokens';
import { ContainedCard } from '@/components/terminal/ContainedCard';
import { EditorialIdentity } from '@/components/terminal/EditorialIdentity';
import { useSandboxStore } from '@/lib/sandbox/positionState';
import type { Position } from '@/lib/sandbox/types';

interface Props {
  position: Position;
  /** Callback fired when the user asks to promote this position into the
   *  Trader Journal as a stub. Wired up by the parent so this component
   *  doesn't need to know about the journal store. */
  onPromoteToJournal: () => void;
}

export function TradeAnnotations({ position, onPromoteToJournal }: Props) {
  const attachAnnotation = useSandboxStore((s) => s.attachAnnotation);
  const closePosition = useSandboxStore((s) => s.closePosition);
  const deletePosition = useSandboxStore((s) => s.deletePosition);

  const [draft, setDraft] = useState('');
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  function handleAdd() {
    if (!draft.trim()) return;
    attachAnnotation(position.id, draft.trim());
    setDraft('');
  }

  function handleManualClose() {
    // Manual close uses the entry LMP as the mark — a pedagogical signal
    // that the student bailed without realized data. PnL = 0.
    closePosition(position.id, position.entryLMP, 0);
  }

  return (
    <ContainedCard padding={S.lg}>
      <div style={{ marginBottom: S.md }}>
        <div
          style={{
            fontFamily: F.mono,
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: C.electricBlue,
            marginBottom: S.xs,
          }}
        >
          ANNOTATIONS · {position.annotations.length}
        </div>
        <EditorialIdentity size="section">What did you learn?</EditorialIdentity>
      </div>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: S.sm,
          marginBottom: S.md,
        }}
      >
        {position.annotations.length === 0 ? (
          <div
            style={{
              padding: S.md,
              fontFamily: F.sans,
              fontSize: 13,
              color: C.textMuted,
              fontStyle: 'italic',
              border: `1px dashed ${C.borderDefault}`,
              borderRadius: R.md,
              textAlign: 'center',
            }}
          >
            No annotations yet. Add the first reflection below.
          </div>
        ) : (
          position.annotations
            .slice()
            .sort((a, b) => a.addedAt.localeCompare(b.addedAt))
            .map((a) => (
              <div
                key={a.id}
                style={{
                  background: C.bgSurface,
                  border: `1px solid ${C.borderDefault}`,
                  borderRadius: R.md,
                  padding: S.md,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 4,
                }}
              >
                <div
                  style={{
                    fontFamily: F.mono,
                    fontSize: 10,
                    fontWeight: 500,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: C.textMuted,
                    fontVariantNumeric: 'tabular-nums',
                  }}
                >
                  {a.addedAt.slice(0, 16).replace('T', ' ')}
                </div>
                <div
                  style={{
                    fontFamily: F.sans,
                    fontSize: 13,
                    color: C.textPrimary,
                    lineHeight: 1.55,
                    whiteSpace: 'pre-wrap',
                  }}
                >
                  {a.note}
                </div>
              </div>
            ))
        )}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: S.sm }}>
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Why did you take (or close) this trade? What did you see in the data?"
          rows={3}
          style={{
            background: C.bgSurface,
            border: `1px solid ${C.borderDefault}`,
            borderRadius: R.md,
            padding: S.sm,
            fontFamily: F.sans,
            fontSize: 13,
            color: C.textPrimary,
            resize: 'vertical',
            outline: 'none',
            minHeight: 72,
          }}
        />
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            gap: S.sm,
          }}
        >
          <div style={{ display: 'flex', gap: S.sm }}>
            <button
              type="button"
              onClick={handleAdd}
              disabled={!draft.trim()}
              style={{
                background: C.electricBlue,
                border: 'none',
                borderRadius: R.md,
                padding: `0 ${S.md}`,
                height: 32,
                fontFamily: F.mono,
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: C.textPrimary,
                cursor: draft.trim() ? 'pointer' : 'not-allowed',
                opacity: draft.trim() ? 1 : 0.5,
              }}
            >
              + ANNOTATION
            </button>

            {position.status === 'closed' && !position.journalEntryId && (
              <button
                type="button"
                onClick={onPromoteToJournal}
                style={{
                  background: C.falconGoldWash,
                  border: `1px solid ${C.falconGold}`,
                  borderRadius: R.md,
                  padding: `0 ${S.md}`,
                  height: 32,
                  fontFamily: F.mono,
                  fontSize: 11,
                  fontWeight: 600,
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  color: C.falconGold,
                  cursor: 'pointer',
                }}
              >
                → PROMOTE TO JOURNAL
              </button>
            )}

            {position.status === 'open' && (
              <button
                type="button"
                onClick={handleManualClose}
                style={{
                  background: 'transparent',
                  border: `1px solid ${C.borderDefault}`,
                  borderRadius: R.md,
                  padding: `0 ${S.md}`,
                  height: 32,
                  fontFamily: F.mono,
                  fontSize: 11,
                  fontWeight: 600,
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  color: C.textSecondary,
                  cursor: 'pointer',
                }}
              >
                MANUAL CLOSE
              </button>
            )}
          </div>

          <div style={{ display: 'flex', gap: S.sm }}>
            {confirmingDelete ? (
              <>
                <button
                  type="button"
                  onClick={() => setConfirmingDelete(false)}
                  style={{
                    background: 'transparent',
                    border: `1px solid ${C.borderDefault}`,
                    borderRadius: R.md,
                    padding: `0 ${S.md}`,
                    height: 32,
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
                  onClick={() => deletePosition(position.id)}
                  style={{
                    background: C.alertCritical,
                    border: 'none',
                    borderRadius: R.md,
                    padding: `0 ${S.md}`,
                    height: 32,
                    fontFamily: F.mono,
                    fontSize: 11,
                    fontWeight: 600,
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    color: C.textPrimary,
                    cursor: 'pointer',
                  }}
                >
                  CONFIRM DELETE
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => setConfirmingDelete(true)}
                style={{
                  background: 'transparent',
                  border: `1px solid ${C.borderDefault}`,
                  borderRadius: R.md,
                  padding: `0 ${S.md}`,
                  height: 32,
                  fontFamily: F.mono,
                  fontSize: 11,
                  fontWeight: 600,
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  color: C.alertCritical,
                  cursor: 'pointer',
                }}
              >
                DELETE
              </button>
            )}
          </div>
        </div>
      </div>
    </ContainedCard>
  );
}
