// ORACLE Wave 2 + FORGE Wave 6 — Analyst Nest context provider.
//
// Wave 6 addition: when the analyst is composing a query or drafting a
// report, ORACLE synthesis references the specific work — the query's
// plan sentence, the report's title and section count — instead of
// the generic overview. The two views write into module-level
// snapshots via `setAnalystQueryState` / `setAnalystReportState`; the
// provider reads on each invocation.

import type { ContextProvider } from '../aiContext';
import { ANOMALY_DETECTIONS, CORRELATION_ZONES } from '@/lib/mock/analyst-mock';
import { describeAST } from '@/lib/analyst/queryAST';
import type { QueryAST, QueryResult, Report } from '@/lib/analyst/types';

// ─── State bridge ────────────────────────────────────────────────

interface QuerySnapshot {
  ast: QueryAST | null;
  lastResult: QueryResult | null;
  /** When non-null, the analyst is editing this saved query. */
  savedQueryId: string | null;
  savedQueryName: string | null;
}

interface ReportSnapshot {
  report: Report | null;
}

let querySnapshot: QuerySnapshot = {
  ast: null,
  lastResult: null,
  savedQueryId: null,
  savedQueryName: null,
};
let reportSnapshot: ReportSnapshot = {
  report: null,
};

export function setAnalystQueryState(next: QuerySnapshot): void {
  querySnapshot = next;
}

export function setAnalystReportState(next: ReportSnapshot): void {
  reportSnapshot = next;
}

export function getAnalystQueryState(): QuerySnapshot {
  return querySnapshot;
}

export function getAnalystReportState(): ReportSnapshot {
  return reportSnapshot;
}

// ─── Provider ────────────────────────────────────────────────────

export const analystNestContextProvider: ContextProvider = (input) => {
  const zone = input.selectedZone ?? null;

  const topAnomalies = ANOMALY_DETECTIONS.slice(0, 3).map(
    (a) => `${a.zone} (${a.sigma.toFixed(1)}σ): ${a.description}`,
  );

  // Compose state-aware description.
  const parts: string[] = ['Analyst Nest.'];
  let selectedTab = 'overview';
  const metrics: Record<string, string | number> = {
    correlatedZones: CORRELATION_ZONES.join(', '),
    anomalyCount: ANOMALY_DETECTIONS.length,
  };

  if (querySnapshot.ast) {
    selectedTab = 'query-builder';
    const plan = describeAST(querySnapshot.ast);
    parts.push(`The analyst is composing a query: ${plan}.`);
    if (querySnapshot.savedQueryName) {
      parts.push(`Editing the saved query "${querySnapshot.savedQueryName}".`);
      metrics.editingSavedQuery = querySnapshot.savedQueryName;
    }
    if (querySnapshot.lastResult) {
      parts.push(
        `Last run returned ${querySnapshot.lastResult.rows.length} rows; ${querySnapshot.lastResult.summary}`,
      );
      metrics.lastQueryRowCount = querySnapshot.lastResult.rows.length;
      metrics.lastQuerySource = querySnapshot.lastResult.source;
    }
  } else if (reportSnapshot.report) {
    selectedTab = 'report-drafting';
    const r = reportSnapshot.report;
    parts.push(
      `The analyst is drafting "${r.title || 'Untitled report'}" — ` +
        `${r.sections.length} section${r.sections.length === 1 ? '' : 's'}.`,
    );
    metrics.draftingReport = r.title || 'Untitled';
    metrics.reportSectionCount = r.sections.length;
    const embeddedQueryCount = r.sections.filter((s) => s.kind === 'query-result').length;
    if (embeddedQueryCount > 0) {
      parts.push(`${embeddedQueryCount} embedded query result${embeddedQueryCount === 1 ? '' : 's'}.`);
      metrics.embeddedQueryCount = embeddedQueryCount;
    }
  } else {
    parts.push(
      `Comparison series view, saved-query rail, and correlation matrix ` +
        `across ${CORRELATION_ZONES.join(', ')}.`,
    );
  }

  return {
    surfaceLabel:
      selectedTab === 'query-builder'
        ? 'Analyst Nest · Query Builder'
        : selectedTab === 'report-drafting'
          ? 'Analyst Nest · Report Drafting'
          : 'Analyst Nest',
    selectedZone: zone,
    selectedTab,
    currentItemId: reportSnapshot.report?.id,
    currentItemTitle: reportSnapshot.report?.title,
    visibleData: {
      description: parts.join(' '),
      metrics,
      alerts: topAnomalies,
    },
  };
};
