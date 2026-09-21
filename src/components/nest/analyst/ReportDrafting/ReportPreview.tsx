// FORGE Wave 6 — ReportPreview.
//
// Read-only render of the report — different visual treatment than
// the editor. Single column, generous line-height, F.mono captions on
// embedded tables/charts.

import { useMemo } from 'react';
import { C, F, S } from '@/design/tokens';
import { ContainedCard } from '@/components/terminal/ContainedCard';
import { useAnalystStore } from '@/stores/analystStore';
import type { Report } from '@/lib/analyst/types';
import { SectionBlock } from './SectionBlock';

interface Props {
  report: Report;
}

export function ReportPreview({ report }: Props) {
  const savedQueries = useAnalystStore((s) => s.savedQueries);
  const updatedAtLabel = useMemo(() => {
    try {
      return new Date(report.updatedAt).toLocaleString();
    } catch {
      return report.updatedAt;
    }
  }, [report.updatedAt]);
  void savedQueries; // used inside SectionBlock through the store

  return (
    <ContainedCard padding={S.xl}>
      <div
        style={{
          fontFamily: F.mono,
          fontSize: 11,
          fontWeight: 600,
          letterSpacing: '0.16em',
          textTransform: 'uppercase',
          color: C.electricBlueLight,
          marginBottom: 6,
        }}
      >
        PREVIEW · {report.sections.length}{' '}
        {report.sections.length === 1 ? 'SECTION' : 'SECTIONS'} · UPDATED{' '}
        {updatedAtLabel}
      </div>

      <h1
        style={{
          fontFamily: F.sans,
          fontSize: 32,
          fontWeight: 600,
          color: C.textPrimary,
          margin: 0,
          lineHeight: 1.2,
          letterSpacing: '-0.01em',
        }}
      >
        {report.title || 'Untitled report'}
      </h1>
      {report.subtitle && (
        <div
          style={{
            fontFamily: F.sans,
            fontSize: 16,
            fontStyle: 'italic',
            color: C.textSecondary,
            marginTop: 6,
            lineHeight: 1.4,
          }}
        >
          {report.subtitle}
        </div>
      )}

      <hr
        style={{
          border: 'none',
          borderTop: `1px solid ${C.borderDefault}`,
          margin: `${S.lg} 0`,
        }}
      />

      <div style={{ display: 'flex', flexDirection: 'column', gap: S.lg }}>
        {report.sections.length === 0 ? (
          <div
            style={{
              fontFamily: F.sans,
              fontSize: 14,
              color: C.textMuted,
              lineHeight: 1.6,
            }}
          >
            No sections yet. Switch to the editor and add a heading or commentary
            to start.
          </div>
        ) : (
          report.sections.map((section) => (
            <SectionBlock
              key={section.id}
              section={section}
              isEditing={false}
              onChange={() => {}}
              onDelete={() => {}}
              onMoveUp={() => {}}
              onMoveDown={() => {}}
            />
          ))
        )}
      </div>
    </ContainedCard>
  );
}
