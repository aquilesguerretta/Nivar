// FORGE Wave 6 — ReportDraftingView orchestrator.
//
// State machine:
//   no reports → template library + blank-report button
//   report selected → editor (left) + preview + publish (right)
//
// A dropdown at the top lets the analyst switch between saved reports.

import { useEffect, useState } from 'react';
import { C, F, R, S } from '@/design/tokens';
import { ContainedCard } from '@/components/terminal/ContainedCard';
import { useAnalystStore } from '@/stores/analystStore';
import { setAnalystReportState } from '@/services/contextProviders/analystNestContext';
import type { Report } from '@/lib/analyst/types';
import { ReportEditor } from './ReportEditor';
import { ReportPreview } from './ReportPreview';
import { ReportTemplateLibrary } from './ReportTemplateLibrary';
import { PublishReportButton } from './PublishReportButton';

export function ReportDraftingView() {
  const reports = useAnalystStore((s) => s.reports);
  const deleteReport = useAnalystStore((s) => s.deleteReport);
  const [activeId, setActiveId] = useState<string | null>(null);

  // Auto-select the most recent report when the page loads.
  useEffect(() => {
    if (!activeId && reports.length > 0) {
      setActiveId(reports[0].id);
    }
  }, [activeId, reports]);

  const active: Report | undefined = reports.find((r) => r.id === activeId);

  // Publish active report state into ORACLE context.
  useEffect(() => {
    setAnalystReportState({ report: active ?? null });
    return () => setAnalystReportState({ report: null });
  }, [active]);

  if (!active) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: S.lg }}>
        <ContainedCard padding={S.xl}>
          <div
            style={{
              fontFamily: F.mono,
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              color: C.electricBlueLight,
              marginBottom: S.sm,
            }}
          >
            NO REPORTS YET
          </div>
          <div
            style={{
              fontFamily: F.sans,
              fontSize: 13,
              color: C.textSecondary,
              lineHeight: 1.6,
            }}
          >
            Pick a template below — or start blank — to create your first
            research note. Reports auto-save as you type and survive across
            sessions.
          </div>
        </ContainedCard>
        <ReportTemplateLibrary onCreated={(r) => setActiveId(r.id)} />
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: S.lg }}>
      {/* Selector + actions */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: S.md,
          flexWrap: 'wrap',
        }}
      >
        <select
          value={active.id}
          onChange={(e) => setActiveId(e.target.value)}
          style={{
            background: C.bgSurface,
            border: `1px solid ${C.borderDefault}`,
            borderRadius: R.md,
            padding: '6px 10px',
            fontFamily: F.mono,
            fontSize: 12,
            fontWeight: 600,
            letterSpacing: '0.10em',
            textTransform: 'uppercase',
            color: C.textPrimary,
            outline: 'none',
            minWidth: 240,
            cursor: 'pointer',
          }}
        >
          {reports.map((r) => (
            <option key={r.id} value={r.id}>
              {r.title || 'Untitled'}
            </option>
          ))}
        </select>
        <span
          style={{
            fontFamily: F.mono,
            fontSize: 10,
            color: C.textMuted,
            letterSpacing: '0.10em',
          }}
        >
          {reports.length} {reports.length === 1 ? 'REPORT' : 'REPORTS'}
        </span>
        <button
          type="button"
          onClick={() => setActiveId(null)}
          style={{
            background: 'transparent',
            border: `1px solid ${C.borderDefault}`,
            borderRadius: R.md,
            padding: '6px 12px',
            fontFamily: F.mono,
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: C.electricBlueLight,
            cursor: 'pointer',
          }}
        >
          + NEW REPORT
        </button>
        <button
          type="button"
          onClick={() => {
            deleteReport(active.id);
            setActiveId(null);
          }}
          style={{
            background: 'transparent',
            border: `1px solid ${C.alertCritical}`,
            borderRadius: R.md,
            padding: '6px 12px',
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
        <span style={{ marginLeft: 'auto' }}>
          <PublishReportButton report={active} />
        </span>
      </div>

      {/* Editor + preview, side-by-side */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: S.lg,
          alignItems: 'start',
        }}
      >
        <ReportEditor report={active} />
        <ReportPreview report={active} />
      </div>
    </div>
  );
}
