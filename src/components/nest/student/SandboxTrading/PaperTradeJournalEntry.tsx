// FORGE Wave 7 — Promote a closed paper trade into the Trader Journal.
//
// `promoteToJournalEntry` is the one entry-point both the
// TradeAnnotations button and any future autopilot can call. It builds
// a journal entry stub from the position record + cached annotations
// and threads the new entry back into the sandbox store so the
// position card can show a "linked to journal" pill.
//
// The exported `PaperTradeJournalEntryBadge` is a small inline chip
// shown on closed cards once a stub exists. Clicking it should
// scroll/navigate to the journal — V1 routes via window.location
// because the per-tab router lives one layer above us.

import { C, F, R, S } from '@/design/tokens';
import { useJournalStore } from '@/stores/journalStore';
import { useSandboxStore } from '@/lib/sandbox/positionState';
import { computeClosedPositionPnL } from '@/lib/sandbox/markToMarket';
import type { Position } from '@/lib/sandbox/types';

/**
 * Build a Trader Journal entry from a closed sandbox position and
 * link it back. Safe to call multiple times — the second call replaces
 * the link rather than minting duplicate entries.
 */
export function promoteToJournalEntry(position: Position): string {
  const pnl = computeClosedPositionPnL(position);
  const stance = position.direction === 'long' ? 'long' : 'short';
  const titleBase = `${position.zone} ${position.direction.toUpperCase()} ${position.sizeMW} MW`;
  const body = buildEntryBody(position, pnl);

  const journal = useJournalStore.getState();
  const sandbox = useSandboxStore.getState();

  const entry = journal.addEntry({
    title: `${titleBase} · ${pnl >= 0 ? '+' : '−'}$${Math.abs(Math.round(pnl)).toLocaleString()}`,
    body,
    tradingDate: position.entryDate,
    zones: [position.zone],
    tags: ['sandbox', position.direction],
    stance,
    pnl,
  });

  sandbox.linkJournalEntry(position.id, entry.id);
  return entry.id;
}

function buildEntryBody(position: Position, pnl: number): string {
  const reasoning = position.reasoning?.trim();
  const annotations = position.annotations
    .slice()
    .sort((a, b) => a.addedAt.localeCompare(b.addedAt));

  const mark =
    typeof position.exitLMP === 'number'
      ? `Exit LMP: $${position.exitLMP.toFixed(2)}`
      : 'Exit LMP: pending';
  const pnlLine = `Realized PnL: ${pnl >= 0 ? '+' : '−'}$${Math.abs(Math.round(pnl)).toLocaleString()} on ${position.sizeMW} MW × ${position.holdHours}h.`;

  const sections: string[] = [
    `Paper trade promoted from the Student Sandbox.`,
    `Entry LMP: $${position.entryLMP.toFixed(2)} (${position.entryDate}, ${String(
      position.entryHour,
    ).padStart(2, '0')}:00).`,
    mark,
    pnlLine,
  ];
  if (reasoning) {
    sections.push(`\nEntry reasoning:\n${reasoning}`);
  }
  if (annotations.length > 0) {
    sections.push(
      `\nPost-trade notes:\n${annotations
        .map((a) => `• ${a.note}`)
        .join('\n')}`,
    );
  }
  return sections.join('\n\n');
}

// ─── Inline badge ────────────────────────────────────────────────

interface BadgeProps {
  position: Position;
  onOpenJournal?: (entryId: string) => void;
}

export function PaperTradeJournalEntryBadge({
  position,
  onOpenJournal,
}: BadgeProps) {
  if (!position.journalEntryId) return null;

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        onOpenJournal?.(position.journalEntryId!);
      }}
      style={{
        marginTop: S.sm,
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        padding: '4px 8px',
        background: C.falconGoldWash,
        border: `1px solid ${C.falconGold}`,
        borderRadius: R.sm,
        fontFamily: F.mono,
        fontSize: 10,
        fontWeight: 600,
        letterSpacing: '0.14em',
        textTransform: 'uppercase',
        color: C.falconGold,
        cursor: 'pointer',
      }}
    >
      <span
        style={{
          width: 4,
          height: 4,
          borderRadius: '50%',
          background: C.falconGold,
        }}
      />
      LINKED TO JOURNAL
    </div>
  );
}
