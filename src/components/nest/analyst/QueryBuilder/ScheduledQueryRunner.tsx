// FORGE Wave 6 — ScheduledQueryRunner.
//
// Mounts once high in the analyst surface. Every 60 seconds it walks
// the saved-queries list, fires `executeQuery` for any that are due,
// and records the result via the store. Renders a compact strip
// showing how many queries are running on schedule + when the next
// one is due.

import { useEffect, useMemo, useRef, useState } from 'react';
import { C, F, R, S } from '@/design/tokens';
import { useAnalystStore } from '@/stores/analystStore';
import { dueQueries, nextRunIn } from '@/lib/analyst/queryScheduler';
import { executeQuery } from '@/lib/analyst/queryExecutor';

const TICK_MS = 60 * 1000;

export function ScheduledQueryRunner() {
  const queries = useAnalystStore((s) => s.savedQueries);
  const recordQueryRun = useAnalystStore((s) => s.recordQueryRun);
  const [now, setNow] = useState<number>(() => Date.now());
  const runningRef = useRef<Set<string>>(new Set());

  // Tick every minute to drive both display refresh and re-run checks.
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), TICK_MS);
    return () => clearInterval(id);
  }, []);

  // Run any due queries. Guards against double-fire via `runningRef`.
  useEffect(() => {
    const due = dueQueries(queries, now);
    if (due.length === 0) return;
    let cancelled = false;
    (async () => {
      for (const q of due) {
        if (runningRef.current.has(q.id)) continue;
        runningRef.current.add(q.id);
        try {
          const result = await executeQuery(q.ast);
          if (!cancelled) recordQueryRun(q.id, result);
        } finally {
          runningRef.current.delete(q.id);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [queries, now, recordQueryRun]);

  // Scheduled-query summary for the strip.
  const scheduled = useMemo(
    () => queries.filter((q) => q.schedule !== 'none'),
    [queries],
  );
  const nextLabel = useMemo(() => {
    if (scheduled.length === 0) return null;
    // Find the soonest-next label across all scheduled queries.
    const labels = scheduled.map((q) => nextRunIn(q, now)).filter((l): l is string => !!l);
    if (labels.length === 0) return null;
    // Sort by string presence of minutes < hours < days.
    const score = (s: string): number => {
      if (s.endsWith('m')) return 0;
      if (s.endsWith('h')) return 1;
      if (s.endsWith('d')) return 2;
      return 3;
    };
    labels.sort((a, b) => score(a) - score(b));
    return labels[0];
  }, [scheduled, now]);

  if (scheduled.length === 0) return null;

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: S.md,
        padding: `${S.sm} ${S.md}`,
        background: C.bgSurface,
        border: `1px solid ${C.borderDefault}`,
        borderLeft: `2px solid ${C.falconGold}`,
        borderRadius: R.md,
      }}
    >
      <span
        style={{
          fontFamily: F.mono,
          fontSize: 10,
          fontWeight: 600,
          letterSpacing: '0.16em',
          textTransform: 'uppercase',
          color: C.falconGold,
        }}
      >
        ⏱ SCHEDULED
      </span>
      <span
        style={{
          fontFamily: F.mono,
          fontSize: 11,
          color: C.textSecondary,
          letterSpacing: '0.06em',
        }}
      >
        {scheduled.length} {scheduled.length === 1 ? 'query' : 'queries'} on schedule
        {nextLabel && (
          <>
            {' · '}next{' '}
            <span style={{ color: C.textPrimary, fontWeight: 600 }}>{nextLabel}</span>
          </>
        )}
      </span>
    </div>
  );
}
