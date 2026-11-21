// FORGE Wave 6 — QueryBuilderView orchestrator.
//
// Two-column layout:
//   LEFT (320px)  → SavedQueryLibrary + ScheduledQueryRunner strip
//   RIGHT (flex)  → QueryComposer + results panel (table / chart toggle)
//
// The composer holds local AST state. Run produces a QueryResult; the
// user can then either toggle table/chart or save. Saving opens a
// modal, persists to the analyst store, and selects the new query in
// the library.

import { useCallback, useEffect, useState } from 'react';
import { C, F, R, S } from '@/design/tokens';
import { ContainedCard } from '@/components/terminal/ContainedCard';
import { EditorialIdentity } from '@/components/terminal/EditorialIdentity';
import { Skeleton } from '@/components/terminal/Skeleton';
import { useAnalystStore } from '@/stores/analystStore';
import { emptyAST } from '@/lib/analyst/queryAST';
import { executeQuery } from '@/lib/analyst/queryExecutor';
import { setAnalystQueryState } from '@/services/contextProviders/analystNestContext';
import type {
  QueryAST,
  QueryResult,
  SavedQuery,
  ScheduleKind,
} from '@/lib/analyst/types';
import { QueryComposer } from './QueryComposer';
import { QueryResultsTable } from './QueryResultsTable';
import { QueryResultsChart } from './QueryResultsChart';
import { SavedQueryLibrary } from './SavedQueryLibrary';
import { SaveQueryModal } from './SaveQueryModal';
import { ScheduledQueryRunner } from './ScheduledQueryRunner';

export function QueryBuilderView() {
  const addSavedQuery = useAnalystStore((s) => s.addSavedQuery);
  const recordQueryRun = useAnalystStore((s) => s.recordQueryRun);
  const savedQueries = useAnalystStore((s) => s.savedQueries);

  const [ast, setAST] = useState<QueryAST>(() => emptyAST());
  const [result, setResult] = useState<QueryResult | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [view, setView] = useState<'table' | 'chart'>('table');
  const [saveModalOpen, setSaveModalOpen] = useState(false);
  const [selectedSavedId, setSelectedSavedId] = useState<string | null>(null);
  const [lastError, setLastError] = useState<string | null>(null);

  // Publish state into ORACLE context. Cleared on unmount so the
  // provider falls back to the overview narrative.
  useEffect(() => {
    const savedName = selectedSavedId
      ? savedQueries.find((q) => q.id === selectedSavedId)?.name ?? null
      : null;
    setAnalystQueryState({
      ast,
      lastResult: result,
      savedQueryId: selectedSavedId,
      savedQueryName: savedName,
    });
    return () => {
      setAnalystQueryState({
        ast: null,
        lastResult: null,
        savedQueryId: null,
        savedQueryName: null,
      });
    };
  }, [ast, result, selectedSavedId, savedQueries]);

  const handleRun = useCallback(async () => {
    setLastError(null);
    setIsRunning(true);
    try {
      const res = await executeQuery(ast);
      setResult(res);
      // If we have a saved query loaded, update its cached result too.
      if (selectedSavedId) recordQueryRun(selectedSavedId, res);
    } catch (err) {
      setLastError(err instanceof Error ? err.message : 'Run failed.');
    } finally {
      setIsRunning(false);
    }
  }, [ast, selectedSavedId, recordQueryRun]);

  function handleLoadSaved(q: SavedQuery) {
    setAST(q.ast);
    setSelectedSavedId(q.id);
    setResult(q.lastResult);
    setLastError(null);
  }

  function handleSave(input: {
    name: string;
    description: string;
    tags: string[];
    schedule: ScheduleKind;
  }) {
    const saved = addSavedQuery({
      ...input,
      ast,
    });
    if (result) recordQueryRun(saved.id, result);
    setSelectedSavedId(saved.id);
  }

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '320px 1fr',
        gap: S.lg,
        alignItems: 'start',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: S.lg }}>
        <SavedQueryLibrary
          selectedId={selectedSavedId}
          onLoad={handleLoadSaved}
        />
        <ScheduledQueryRunner />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: S.lg }}>
        <QueryComposer
          ast={ast}
          onChange={(next) => {
            setAST(next);
            setSelectedSavedId(null);
          }}
          onRun={handleRun}
          onSave={() => setSaveModalOpen(true)}
          isRunning={isRunning}
        />

        {lastError && (
          <ContainedCard padding={S.md}>
            <div
              style={{
                fontFamily: F.mono,
                fontSize: 11,
                color: C.alertCritical,
                letterSpacing: '0.10em',
              }}
            >
              {lastError}
            </div>
          </ContainedCard>
        )}

        {isRunning && !result && (
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
              EXECUTING QUERY
            </div>
            <Skeleton.Chart height={280} label="Query result loading" />
          </ContainedCard>
        )}

        {!isRunning && !result && (
          <ContainedCard padding={S.xl}>
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
              READY
            </div>
            <EditorialIdentity size="section" marginBottom={S.md}>
              Compose a query above and click Run.
            </EditorialIdentity>
            <div
              style={{
                fontFamily: F.sans,
                fontSize: 13,
                lineHeight: 1.6,
                color: C.textSecondary,
              }}
            >
              Pick a metric, group it by one or more dimensions, choose an
              aggregation, set a time window, and the executor returns a
              shape-matched result you can save and embed in a research note.
            </div>
          </ContainedCard>
        )}

        {result && (
          <ContainedCard padding={S.lg}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: S.md,
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
                RESULTS · {result.rows.length}{' '}
                {result.rows.length === 1 ? 'ROW' : 'ROWS'}
              </div>
              <div style={{ display: 'flex', gap: S.xs }}>
                <ViewToggle
                  active={view === 'table'}
                  onClick={() => setView('table')}
                >
                  TABLE
                </ViewToggle>
                <ViewToggle
                  active={view === 'chart'}
                  onClick={() => setView('chart')}
                >
                  CHART
                </ViewToggle>
              </div>
            </div>

            {view === 'table' ? (
              <QueryResultsTable result={result} />
            ) : (
              <QueryResultsChart
                result={result}
                chartId={`analyst-query-${selectedSavedId ?? 'live'}`}
              />
            )}

            <div
              style={{
                marginTop: S.md,
                paddingTop: S.md,
                borderTop: `1px solid ${C.borderDefault}`,
                display: 'flex',
                justifyContent: 'space-between',
                fontFamily: F.mono,
                fontSize: 10,
                color: C.textMuted,
                letterSpacing: '0.10em',
              }}
            >
              <span>{result.summary}</span>
              <span>
                SOURCE · {result.source.toUpperCase()}{' '}
                {result.source === 'mock' && '(LIVE DATA WHEN HOOKS WIRED)'}
              </span>
            </div>
          </ContainedCard>
        )}
      </div>

      <SaveQueryModal
        open={saveModalOpen}
        onClose={() => setSaveModalOpen(false)}
        onSave={handleSave}
      />
    </div>
  );
}

function ViewToggle({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        background: active ? C.electricBlueWash : 'transparent',
        border: `1px solid ${active ? C.electricBlue : C.borderDefault}`,
        borderRadius: R.sm,
        padding: '4px 10px',
        fontFamily: F.mono,
        fontSize: 10,
        fontWeight: 600,
        letterSpacing: '0.14em',
        color: active ? C.electricBlueLight : C.textSecondary,
        cursor: 'pointer',
      }}
    >
      {children}
    </button>
  );
}
