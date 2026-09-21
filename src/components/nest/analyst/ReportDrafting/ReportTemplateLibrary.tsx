// FORGE Wave 6 — ReportTemplateLibrary.
//
// Three-card menu of starter templates. Picking one creates a fresh
// Report from the template's section blueprints (re-keyed IDs) and
// surfaces the new report in the editor.

import { C, F, R, S } from '@/design/tokens';
import { ContainedCard } from '@/components/terminal/ContainedCard';
import { useAnalystStore } from '@/stores/analystStore';
import { REPORT_TEMPLATES } from '@/lib/mock/analyst-mock';
import type {
  Report,
  ReportSection,
  ReportTemplate,
} from '@/lib/analyst/types';

interface Props {
  onCreated: (report: Report) => void;
}

function rekeySections(sections: ReportSection[]): ReportSection[] {
  return sections.map((s, i) => ({
    ...s,
    id: `sec_${Date.now()}_${i}_${Math.random().toString(36).slice(2, 6)}`,
  }));
}

export function ReportTemplateLibrary({ onCreated }: Props) {
  const createReport = useAnalystStore((s) => s.createReport);

  function instantiate(tpl: ReportTemplate) {
    const next = createReport({
      title: tpl.name,
      templateId: tpl.id,
      sections: rekeySections(tpl.sections),
    });
    onCreated(next);
  }

  function instantiateBlank() {
    const next = createReport({ title: 'Untitled report', sections: [] });
    onCreated(next);
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
          marginBottom: S.md,
        }}
      >
        START FROM TEMPLATE
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: S.md,
        }}
      >
        {REPORT_TEMPLATES.map((tpl) => (
          <button
            key={tpl.id}
            type="button"
            onClick={() => instantiate(tpl)}
            style={{
              background: C.bgSurface,
              border: `1px solid ${C.borderDefault}`,
              borderRadius: R.md,
              padding: S.md,
              textAlign: 'left',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              gap: S.sm,
            }}
          >
            <div
              style={{
                fontFamily: F.sans,
                fontSize: 15,
                fontWeight: 600,
                color: C.textPrimary,
                lineHeight: 1.3,
              }}
            >
              {tpl.name}
            </div>
            <div
              style={{
                fontFamily: F.sans,
                fontSize: 12,
                color: C.textSecondary,
                lineHeight: 1.5,
              }}
            >
              {tpl.description}
            </div>
            <div
              style={{
                fontFamily: F.mono,
                fontSize: 10,
                color: C.textMuted,
                letterSpacing: '0.08em',
                marginTop: 'auto',
              }}
            >
              {tpl.sections.length} sections
            </div>
          </button>
        ))}
      </div>

      <div
        style={{
          marginTop: S.md,
          paddingTop: S.md,
          borderTop: `1px solid ${C.borderDefault}`,
          display: 'flex',
          justifyContent: 'flex-end',
        }}
      >
        <button
          type="button"
          onClick={instantiateBlank}
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
            color: C.textSecondary,
            cursor: 'pointer',
          }}
        >
          + BLANK REPORT
        </button>
      </div>
    </ContainedCard>
  );
}
