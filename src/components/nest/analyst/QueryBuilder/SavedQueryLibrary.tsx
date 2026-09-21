// FORGE Wave 6 — SavedQueryLibrary.
// Sidebar list of saved queries with search + tag filter. Each row
// surfaces the schedule (if any), last-run age, and tags. Click to
// load into the composer; the × removes.

import { useMemo, useState } from 'react';
import { C, F, R, S } from '@/design/tokens';
import { ContainedCard } from '@/components/terminal/ContainedCard';
import { useAnalystStore } from '@/stores/analystStore';
import type { SavedQuery } from '@/lib/analyst/types';

interface Props {
  /** Currently-selected saved query id, if any. */
  selectedId: string | null;
  onLoad: (q: SavedQuery) => void;
}

function formatAge(iso: string | null): string {
  if (!iso) return 'never run';
  const secs = Math.max(0, Math.round((Date.now() - Date.parse(iso)) / 1000));
  if (secs < 60) return `${secs}s ago`;
  if (secs < 3600) return `${Math.floor(secs / 60)}m ago`;
  if (secs < 86400) return `${Math.floor(secs / 3600)}h ago`;
  return `${Math.floor(secs / 86400)}d ago`;
}

function scheduleLabel(kind: SavedQuery['schedule']): string {
  switch (kind) {
    case 'hourly': return 'HOURLY';
    case 'daily-8am': return 'DAILY 8AM';
    case 'weekly-monday': return 'WEEKLY MON';
    case 'monthly-1st': return 'MONTHLY 1ST';
    case 'none': return '';
  }
}

export function SavedQueryLibrary({ selectedId, onLoad }: Props) {
  const queries = useAnalystStore((s) => s.savedQueries);
  const deleteSavedQuery = useAnalystStore((s) => s.deleteSavedQuery);
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return queries;
    return queries.filter(
      (q) =>
        q.name.toLowerCase().includes(term) ||
        q.tags.some((t) => t.includes(term)) ||
        (q.description?.toLowerCase().includes(term) ?? false),
    );
  }, [queries, search]);

  return (
    <ContainedCard padding={S.lg}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: S.sm,
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
          }}
        >
          SAVED QUERIES
        </div>
        <span
          style={{
            fontFamily: F.mono,
            fontSize: 10,
            color: C.textMuted,
            letterSpacing: '0.10em',
          }}
        >
          {queries.length} {queries.length === 1 ? 'QUERY' : 'QUERIES'}
        </span>
      </div>

      <input
        type="text"
        placeholder="Search by name or tag…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          width: '100%',
          background: C.bgSurface,
          border: `1px solid ${C.borderDefault}`,
          borderRadius: R.md,
          padding: '6px 10px',
          fontFamily: F.mono,
          fontSize: 12,
          color: C.textPrimary,
          outline: 'none',
          marginBottom: S.sm,
        }}
      />

      {filtered.length === 0 ? (
        <div
          style={{
            padding: `${S.lg} ${S.md}`,
            fontFamily: F.mono,
            fontSize: 11,
            color: C.textMuted,
            textAlign: 'center',
            letterSpacing: '0.10em',
          }}
        >
          {queries.length === 0
            ? 'NO SAVED QUERIES YET'
            : 'NO MATCHES'}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {filtered.map((q) => {
            const isSelected = q.id === selectedId;
            const sched = scheduleLabel(q.schedule);
            return (
              <div
                key={q.id}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: S.sm,
                  padding: S.sm,
                  borderBottom: `1px solid ${C.borderDefault}`,
                  borderLeft: isSelected
                    ? `2px solid ${C.electricBlue}`
                    : '2px solid transparent',
                  background: isSelected ? C.electricBlueWash : 'transparent',
                  cursor: 'pointer',
                }}
                onClick={() => onLoad(q)}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontFamily: F.sans,
                      fontSize: 13,
                      fontWeight: 500,
                      color: C.textPrimary,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {q.name}
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      gap: S.sm,
                      flexWrap: 'wrap',
                      marginTop: 4,
                    }}
                  >
                    <span
                      style={{
                        fontFamily: F.mono,
                        fontSize: 10,
                        color: C.textMuted,
                        letterSpacing: '0.08em',
                      }}
                    >
                      {formatAge(q.lastRunAt)}
                    </span>
                    {sched && (
                      <span
                        style={{
                          fontFamily: F.mono,
                          fontSize: 10,
                          color: C.falconGold,
                          letterSpacing: '0.08em',
                        }}
                      >
                        ⏱ {sched}
                      </span>
                    )}
                    {q.tags.slice(0, 3).map((t) => (
                      <span
                        key={t}
                        style={{
                          fontFamily: F.mono,
                          fontSize: 10,
                          color: C.electricBlueLight,
                          letterSpacing: '0.06em',
                        }}
                      >
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteSavedQuery(q.id);
                  }}
                  title="Delete saved query"
                  style={{
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    color: C.textMuted,
                    fontFamily: F.mono,
                    fontSize: 14,
                    lineHeight: 1,
                    padding: 0,
                  }}
                >
                  ×
                </button>
              </div>
            );
          })}
        </div>
      )}
    </ContainedCard>
  );
}
