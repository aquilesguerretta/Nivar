// FORGE — Trade Journal main view.
// Two-column layout (8/12 + 4/12). LEFT: P&L chart, +New Entry, filters,
// entry list (with inline editor when creating/editing). RIGHT: weekly
// review panel, lightweight stats card.

import { useMemo, useState } from 'react';
import { C, F, R, S } from '@/design/tokens';
import { ContainedCard } from '@/components/terminal/ContainedCard';
import { EditorialIdentity } from '@/components/terminal/EditorialIdentity';
import { useJournalStore } from '@/stores/journalStore';
import type { EntryFilters } from '@/stores/journalStore';
import type { JournalEntry as JE } from '@/lib/types/journal';
import { JournalEntry } from './JournalEntry';
import { JournalEntryEditor } from './JournalEntryEditor';
import type { EditorSavePayload } from './JournalEntryEditor';
import { JournalPnLChart } from './JournalPnLChart';
import { JournalReviewPanel } from './JournalReviewPanel';
import { JournalFilters } from './JournalFilters';

type Mode = 'list' | 'creating' | 'editing';

export function JournalView() {
  const entries = useJournalStore((s) => s.entries);
  const addEntry = useJournalStore((s) => s.addEntry);
  const updateEntry = useJournalStore((s) => s.updateEntry);
  const deleteEntry = useJournalStore((s) => s.deleteEntry);
  const markReviewed = useJournalStore((s) => s.markReviewed);

  const [mode, setMode] = useState<Mode>('list');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [filters, setFilters] = useState<EntryFilters>({});
  const [pendingDelete, setPendingDelete] = useState<JE | null>(null);
  const [relatedFilter, setRelatedFilter] = useState<string[] | null>(null);

  const editingEntry = useMemo(
    () => (editingId ? entries.find((e) => e.id === editingId) ?? null : null),
    [entries, editingId],
  );

  const availableTags = useMemo(() => {
    const set = new Set<string>();
    for (const e of entries) for (const t of e.tags) set.add(t);
    return Array.from(set).sort();
  }, [entries]);

  const visibleEntries = useMemo(() => {
    let list = entries.filter((e) => {
      if (filters.zones?.length) {
        if (!filters.zones.some((z) => e.zones.includes(z))) return false;
      }
      if (filters.tags?.length) {
        if (!filters.tags.some((t) => e.tags.includes(t))) return false;
      }
      if (filters.stance && e.stance !== filters.stance) return false;
      if (filters.fromDate && e.tradingDate < filters.fromDate) return false;
      if (filters.toDate && e.tradingDate > filters.toDate) return false;
      return true;
    });
    if (relatedFilter) {
      list = list.filter((e) => relatedFilter.includes(e.id));
    }
    return list
      .slice()
      .sort((a, b) => b.tradingDate.localeCompare(a.tradingDate));
  }, [entries, filters, relatedFilter]);

  function handleNewEntry() {
    setEditingId(null);
    setMode('creating');
  }

  function handleEdit(entry: JE) {
    setEditingId(entry.id);
    setMode('editing');
  }

  function handleSave(payload: EditorSavePayload) {
    if (payload.mode === 'create') {
      addEntry(payload.input);
    } else {
      updateEntry(payload.id, payload.patch);
    }
    setMode('list');
    setEditingId(null);
  }

  function handleCancel() {
    setMode('list');
    setEditingId(null);
  }

  function confirmDelete() {
    if (pendingDelete) {
      deleteEntry(pendingDelete.id);
      setPendingDelete(null);
      if (editingId === pendingDelete.id) {
        setEditingId(null);
        setMode('list');
      }
    }
  }

  const reviewedCount = entries.filter((e) => e.reviewed).length;
  const attachmentCount = entries.reduce(
    (sum, e) => sum + e.attachments.length,
    0,
  );

  return (
    <div
      style={{
        position: 'relative',
        zIndex: 1,
        padding: S.xl,
        display: 'flex',
        flexDirection: 'column',
        gap: S.lg,
      }}
    >
      {/* Page header — eyebrow + editorial identity, matching the rhythm
          used across VaultIndex, Alexandria, and the per-profile Nests.
          Replaces the previous sans-32 "Journal" H1 (which competed with
          the identity line beneath it). */}
      <div style={{ marginBottom: S.sm }}>
        <div
          style={{
            fontFamily: F.mono,
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: '0.18em',
            textTransform: 'uppercase' as const,
            color: C.electricBlue,
            marginBottom: S.xs,
          }}
        >
          TRADE LEDGER · {entries.length} {entries.length === 1 ? 'ENTRY' : 'ENTRIES'}
        </div>
        <EditorialIdentity size="hero">Your record.</EditorialIdentity>
      </div>

      {/* Two-column grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr',
          gap: S.lg,
          alignItems: 'start',
        }}
      >
        {/* LEFT */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: S.lg }}>
          <JournalPnLChart />

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: S.md,
            }}
          >
            <button
              type="button"
              onClick={handleNewEntry}
              disabled={mode !== 'list'}
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
                cursor: mode === 'list' ? 'pointer' : 'not-allowed',
                opacity: mode === 'list' ? 1 : 0.5,
              }}
            >
              + NEW ENTRY
            </button>

            {relatedFilter && (
              <button
                type="button"
                onClick={() => setRelatedFilter(null)}
                style={{
                  background: C.falconGoldWash,
                  border: `1px solid ${C.falconGold}`,
                  borderRadius: R.md,
                  padding: `0 ${S.md}`,
                  height: 40,
                  fontFamily: F.mono,
                  fontSize: 11,
                  fontWeight: 600,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: C.falconGold,
                  cursor: 'pointer',
                }}
              >
                Showing {relatedFilter.length} related — clear
              </button>
            )}
          </div>

          <JournalFilters
            filters={filters}
            onChange={setFilters}
            availableTags={availableTags}
          />

          {(mode === 'creating' || mode === 'editing') && (
            <JournalEntryEditor
              initialEntry={editingEntry ?? undefined}
              onSave={handleSave}
              onCancel={handleCancel}
            />
          )}

          {visibleEntries.length === 0 ? (
            <ContainedCard padding={S.xxl}>
              <div
                style={{
                  textAlign: 'center',
                  color: C.textMuted,
                  fontFamily: F.sans,
                  fontSize: 14,
                  lineHeight: 1.6,
                }}
              >
                {entries.length === 0
                  ? 'Add your first entry to start your journal.'
                  : 'No entries match the current filters.'}
              </div>
            </ContainedCard>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: S.md }}>
              {visibleEntries.map((e) => (
                <JournalEntry
                  key={e.id}
                  entry={e}
                  onEdit={handleEdit}
                  onDelete={(target) => setPendingDelete(target)}
                  onMarkReviewed={markReviewed}
                />
              ))}
            </div>
          )}
        </div>

        {/* RIGHT */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: S.lg }}>
          <JournalReviewPanel
            onSelectRelated={(ids) => {
              setRelatedFilter(ids);
              setMode('list');
            }}
          />

          <ContainedCard padding={S.lg}>
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
              JOURNAL STATS
            </div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: S.sm,
              }}
            >
              <Stat label="ENTRIES" value={entries.length} />
              <Stat label="REVIEWED" value={reviewedCount} />
              <Stat label="ATTACHMENTS" value={attachmentCount} />
            </div>
          </ContainedCard>
        </div>
      </div>

      {/* Delete confirm dialog */}
      {pendingDelete && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.7)',
            zIndex: 9700,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onClick={() => setPendingDelete(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: C.bgElevated,
              border: `1px solid ${C.borderStrong}`,
              borderTop: `1px solid ${C.alertCritical}`,
              borderRadius: R.lg,
              padding: S.xl,
              maxWidth: 460,
              width: '90%',
            }}
          >
            <div
              style={{
                fontFamily: F.mono,
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
                color: C.alertCritical,
                marginBottom: S.sm,
              }}
            >
              CONFIRM DELETE
            </div>
            <div
              style={{
                fontFamily: F.sans,
                fontSize: 14,
                lineHeight: 1.6,
                color: C.textPrimary,
                marginBottom: S.lg,
              }}
            >
              Delete entry “{pendingDelete.title}” from {pendingDelete.tradingDate}? This
              cannot be undone.
            </div>
            <div
              style={{
                display: 'flex',
                gap: S.sm,
                justifyContent: 'flex-end',
              }}
            >
              <button
                type="button"
                onClick={() => setPendingDelete(null)}
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
                onClick={confirmDelete}
                style={{
                  background: C.alertCritical,
                  border: 'none',
                  borderRadius: R.md,
                  padding: `${S.sm} ${S.lg}`,
                  fontFamily: F.mono,
                  fontSize: 12,
                  fontWeight: 600,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: C.textPrimary,
                  cursor: 'pointer',
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div>
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
      <div
        style={{
          fontFamily: F.mono,
          fontSize: 22,
          fontWeight: 600,
          fontVariantNumeric: 'tabular-nums',
          color: C.textPrimary,
        }}
      >
        {value}
      </div>
    </div>
  );
}
