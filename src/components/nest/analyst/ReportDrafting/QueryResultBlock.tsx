// FORGE Wave 6 — QueryResultBlock.
// Embeds a saved query's last result inline in the report — either as
// a table or as a chart, toggled via the block's display prop.

import { C, F, R, S } from '@/design/tokens';
import { useAnalystStore } from '@/stores/analystStore';
import { QueryResultsTable } from '../QueryBuilder/QueryResultsTable';
import { QueryResultsChart } from '../QueryBuilder/QueryResultsChart';
import { SectionShell } from './CommentaryBlock';
import type { QueryResultSection } from '@/lib/analyst/types';

interface Props {
  section: QueryResultSection;
  isEditing: boolean;
  onChange: (next: QueryResultSection) => void;
  onDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
}

export function QueryResultBlock({
  section,
  isEditing,
  onChange,
  onDelete,
  onMoveUp,
  onMoveDown,
}: Props) {
  const savedQueries = useAnalystStore((s) => s.savedQueries);
  const query = savedQueries.find((q) => q.id === section.savedQueryId);
  const result = query?.lastResult ?? null;

  return (
    <SectionShell
      label="QUERY RESULT"
      onDelete={onDelete}
      onMoveUp={onMoveUp}
      onMoveDown={onMoveDown}
    >
      {isEditing && (
        <div style={{ display: 'flex', gap: S.sm, alignItems: 'center' }}>
          <select
            value={section.savedQueryId}
            onChange={(e) =>
              onChange({ ...section, savedQueryId: e.target.value })
            }
            style={selectStyle()}
          >
            <option value="">— Choose query —</option>
            {savedQueries.map((q) => (
              <option key={q.id} value={q.id}>
                {q.name}
              </option>
            ))}
          </select>
          <select
            value={section.display}
            onChange={(e) =>
              onChange({
                ...section,
                display: e.target.value as QueryResultSection['display'],
              })
            }
            style={selectStyle()}
          >
            <option value="table">TABLE</option>
            <option value="chart">CHART</option>
          </select>
          <input
            type="text"
            placeholder="Caption (optional)"
            value={section.caption ?? ''}
            onChange={(e) => onChange({ ...section, caption: e.target.value })}
            style={{ ...selectStyle(), flex: 1, minWidth: 0 }}
          />
        </div>
      )}

      {query && result ? (
        <>
          {section.display === 'chart' ? (
            <QueryResultsChart
              result={result}
              chartId={`analyst-report-${section.id}`}
            />
          ) : (
            <QueryResultsTable result={result} />
          )}
          {section.caption && (
            <div
              style={{
                fontFamily: F.mono,
                fontSize: 11,
                color: C.textMuted,
                letterSpacing: '0.08em',
                textAlign: 'center',
              }}
            >
              {section.caption}
            </div>
          )}
        </>
      ) : (
        <div
          style={{
            padding: S.lg,
            border: `1px dashed ${C.borderDefault}`,
            borderRadius: R.md,
            fontFamily: F.mono,
            fontSize: 11,
            color: C.textMuted,
            textAlign: 'center',
            letterSpacing: '0.08em',
          }}
        >
          {section.savedQueryId
            ? `Saved query ${section.savedQueryId} has not been run yet.`
            : 'Pick a saved query to embed here.'}
        </div>
      )}
    </SectionShell>
  );
}

function selectStyle(): React.CSSProperties {
  return {
    background: C.bgSurface,
    border: `1px solid ${C.borderDefault}`,
    borderRadius: R.md,
    padding: '6px 10px',
    fontFamily: F.mono,
    fontSize: 11,
    color: C.textPrimary,
    outline: 'none',
    cursor: 'pointer',
  };
}
