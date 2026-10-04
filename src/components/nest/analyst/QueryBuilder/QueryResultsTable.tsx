// FORGE Wave 6 — QueryResultsTable.
// Compact-density tabular view of query results. Sortable by clicking
// a column header. For V1 we render all rows (no virtualization yet);
// the executor caps result size at one quarter so row counts stay
// manageable. A future revision adds windowed virtualization for the
// quarter-of-5-min-intervals × 20-zones case.

import { useMemo, useState } from 'react';
import { C, F, S } from '@/design/tokens';
import type { ColumnSchema, QueryResult, QueryResultRow } from '@/lib/analyst/types';

interface Props {
  result: QueryResult;
  /** Max rows to render. Default 200. */
  maxRows?: number;
}

type SortDirection = 'asc' | 'desc';

function formatCell(value: string | number | null, col: ColumnSchema): string {
  if (value === null || value === undefined) return '—';
  if (typeof value === 'number') {
    if (col.format?.startsWith('$')) {
      return `$${value.toFixed(2)}`;
    }
    if (col.format?.includes('%')) {
      return `${value.toFixed(1)}%`;
    }
    return value.toLocaleString(undefined, { maximumFractionDigits: 2 });
  }
  return String(value);
}

export function QueryResultsTable({ result, maxRows = 200 }: Props) {
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<SortDirection>('asc');

  const sortedRows: QueryResultRow[] = useMemo(() => {
    if (!sortKey) return result.rows;
    const sorted = [...result.rows].sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      if (typeof av === 'number' && typeof bv === 'number') {
        return sortDir === 'asc' ? av - bv : bv - av;
      }
      return sortDir === 'asc'
        ? String(av ?? '').localeCompare(String(bv ?? ''))
        : String(bv ?? '').localeCompare(String(av ?? ''));
    });
    return sorted;
  }, [result.rows, sortKey, sortDir]);

  const visibleRows = sortedRows.slice(0, maxRows);

  function toggleSort(key: string) {
    if (sortKey === key) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDir('desc');
    }
  }

  if (result.rows.length === 0) {
    return (
      <div
        style={{
          padding: S.lg,
          fontFamily: F.mono,
          fontSize: 12,
          color: C.textMuted,
          textAlign: 'center',
        }}
      >
        No rows match this query.
      </div>
    );
  }

  return (
    <div style={{ overflowX: 'auto', overflowY: 'auto', maxHeight: 360 }}>
      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          fontFamily: F.mono,
          fontSize: 11,
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        <thead
          style={{
            position: 'sticky',
            top: 0,
            background: C.bgElevated,
            zIndex: 1,
          }}
        >
          <tr>
            {result.schema.map((col) => {
              const isSorted = sortKey === col.key;
              return (
                <th
                  key={col.key}
                  onClick={() => toggleSort(col.key)}
                  style={{
                    textAlign: col.type === 'number' ? 'right' : 'left',
                    padding: `${S.sm} ${S.md}`,
                    borderBottom: `1px solid ${C.borderDefault}`,
                    fontFamily: F.mono,
                    fontSize: 10,
                    fontWeight: 600,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: isSorted ? C.electricBlueLight : C.textMuted,
                    cursor: 'pointer',
                    userSelect: 'none',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {col.label}
                  {isSorted ? (sortDir === 'asc' ? ' ↑' : ' ↓') : ''}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {visibleRows.map((row, idx) => (
            <tr
              key={idx}
              style={{
                background: idx % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.015)',
              }}
            >
              {result.schema.map((col) => (
                <td
                  key={col.key}
                  style={{
                    textAlign: col.type === 'number' ? 'right' : 'left',
                    padding: `${S.xs} ${S.md}`,
                    borderBottom: `1px solid ${C.borderDefault}`,
                    color: C.textPrimary,
                    whiteSpace: 'nowrap',
                  }}
                >
                  {formatCell(row[col.key], col)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {result.rows.length > maxRows && (
        <div
          style={{
            padding: S.sm,
            fontFamily: F.mono,
            fontSize: 10,
            color: C.textMuted,
            letterSpacing: '0.10em',
            textTransform: 'uppercase',
            textAlign: 'center',
          }}
        >
          Showing first {maxRows} of {result.rows.length} rows
        </div>
      )}
    </div>
  );
}
