// FORGE Wave 6 — ReportEditor.
//
// Section-based editor. Auto-saves to the analyst store on every
// change. Add via the bottom add-row (commentary / query-result /
// heading); reorder via the ▲▼ inside each section.

import { useCallback } from 'react';
import { C, F, R, S } from '@/design/tokens';
import { ContainedCard } from '@/components/terminal/ContainedCard';
import { EditorialIdentity } from '@/components/terminal/EditorialIdentity';
import { useAnalystStore } from '@/stores/analystStore';
import type {
  Report,
  ReportSection,
  ReportSectionKind,
} from '@/lib/analyst/types';
import { SectionBlock } from './SectionBlock';

interface Props {
  report: Report;
}

function makeSectionId(): string {
  return `sec_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

function blankSection(kind: ReportSectionKind): ReportSection {
  const id = makeSectionId();
  switch (kind) {
    case 'commentary':
      return { id, kind: 'commentary', body: '' };
    case 'heading':
      return { id, kind: 'heading', text: '', level: 2 };
    case 'query-result':
      return { id, kind: 'query-result', savedQueryId: '', display: 'table' };
  }
}

export function ReportEditor({ report }: Props) {
  const updateReport = useAnalystStore((s) => s.updateReport);

  const setTitle = useCallback(
    (title: string) => updateReport(report.id, { title }),
    [report.id, updateReport],
  );
  const setSubtitle = useCallback(
    (subtitle: string) => updateReport(report.id, { subtitle }),
    [report.id, updateReport],
  );
  const setSections = useCallback(
    (sections: ReportSection[]) => updateReport(report.id, { sections }),
    [report.id, updateReport],
  );

  function patchSection(index: number, next: ReportSection) {
    const copy = [...report.sections];
    copy[index] = next;
    setSections(copy);
  }

  function deleteSection(index: number) {
    setSections(report.sections.filter((_, i) => i !== index));
  }

  function moveSection(index: number, dir: -1 | 1) {
    const target = index + dir;
    if (target < 0 || target >= report.sections.length) return;
    const copy = [...report.sections];
    [copy[index], copy[target]] = [copy[target], copy[index]];
    setSections(copy);
  }

  function addSection(kind: ReportSectionKind) {
    setSections([...report.sections, blankSection(kind)]);
  }

  return (
    <ContainedCard padding={S.lg}>
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
        REPORT EDITOR
      </div>
      <EditorialIdentity size="section" marginBottom={S.lg}>
        Draft the note.
      </EditorialIdentity>

      {/* Title + subtitle */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: S.sm, marginBottom: S.md }}>
        <input
          type="text"
          value={report.title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Report title"
          style={{
            background: C.bgSurface,
            border: `1px solid ${C.borderDefault}`,
            borderRadius: R.md,
            padding: '10px 12px',
            fontFamily: F.sans,
            fontSize: 22,
            fontWeight: 600,
            color: C.textPrimary,
            outline: 'none',
          }}
        />
        <input
          type="text"
          value={report.subtitle ?? ''}
          onChange={(e) => setSubtitle(e.target.value)}
          placeholder="Subtitle (optional)"
          style={{
            background: 'transparent',
            border: 'none',
            borderBottom: `1px solid ${C.borderDefault}`,
            padding: '6px 0',
            fontFamily: F.sans,
            fontSize: 14,
            fontStyle: 'italic',
            color: C.textSecondary,
            outline: 'none',
          }}
        />
      </div>

      {/* Sections */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: S.md }}>
        {report.sections.length === 0 ? (
          <div
            style={{
              padding: S.lg,
              fontFamily: F.mono,
              fontSize: 11,
              color: C.textMuted,
              textAlign: 'center',
              letterSpacing: '0.10em',
              border: `1px dashed ${C.borderDefault}`,
              borderRadius: R.md,
            }}
          >
            NO SECTIONS YET — ADD ONE BELOW
          </div>
        ) : (
          report.sections.map((section, i) => (
            <SectionBlock
              key={section.id}
              section={section}
              isEditing
              onChange={(next) => patchSection(i, next)}
              onDelete={() => deleteSection(i)}
              onMoveUp={() => moveSection(i, -1)}
              onMoveDown={() => moveSection(i, +1)}
            />
          ))
        )}
      </div>

      {/* Add row */}
      <div
        style={{
          display: 'flex',
          gap: S.sm,
          marginTop: S.lg,
          paddingTop: S.md,
          borderTop: `1px solid ${C.borderDefault}`,
        }}
      >
        <AddBtn onClick={() => addSection('heading')}>+ HEADING</AddBtn>
        <AddBtn onClick={() => addSection('commentary')}>+ COMMENTARY</AddBtn>
        <AddBtn onClick={() => addSection('query-result')}>+ QUERY RESULT</AddBtn>
      </div>
    </ContainedCard>
  );
}

function AddBtn({
  onClick,
  children,
}: {
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
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
      {children}
    </button>
  );
}
