// FORGE Wave 6 — SectionBlock.
//
// Polymorphic block — dispatches to the right child editor based on
// `section.kind`. Heading is handled inline here (small enough); the
// commentary and query-result variants live in sibling files.

import { C, F, R, S } from '@/design/tokens';
import { CommentaryBlock, SectionShell } from './CommentaryBlock';
import { QueryResultBlock } from './QueryResultBlock';
import type {
  CommentarySection,
  HeadingSection,
  QueryResultSection,
  ReportSection,
} from '@/lib/analyst/types';

interface Props {
  section: ReportSection;
  isEditing: boolean;
  onChange: (next: ReportSection) => void;
  onDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
}

export function SectionBlock({
  section,
  isEditing,
  onChange,
  onDelete,
  onMoveUp,
  onMoveDown,
}: Props) {
  switch (section.kind) {
    case 'commentary':
      return (
        <CommentaryBlock
          section={section as CommentarySection}
          isEditing={isEditing}
          onChange={(next) => onChange(next)}
          onDelete={onDelete}
          onMoveUp={onMoveUp}
          onMoveDown={onMoveDown}
        />
      );
    case 'query-result':
      return (
        <QueryResultBlock
          section={section as QueryResultSection}
          isEditing={isEditing}
          onChange={(next) => onChange(next)}
          onDelete={onDelete}
          onMoveUp={onMoveUp}
          onMoveDown={onMoveDown}
        />
      );
    case 'heading':
      return (
        <HeadingBlock
          section={section as HeadingSection}
          isEditing={isEditing}
          onChange={(next) => onChange(next)}
          onDelete={onDelete}
          onMoveUp={onMoveUp}
          onMoveDown={onMoveDown}
        />
      );
  }
}

// ─── Heading variant ────────────────────────────────────────────

function HeadingBlock({
  section,
  isEditing,
  onChange,
  onDelete,
  onMoveUp,
  onMoveDown,
}: {
  section: HeadingSection;
  isEditing: boolean;
  onChange: (next: HeadingSection) => void;
  onDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
}) {
  const fontSize = section.level === 1 ? 26 : section.level === 2 ? 20 : 16;
  return (
    <SectionShell
      label="HEADING"
      onDelete={onDelete}
      onMoveUp={onMoveUp}
      onMoveDown={onMoveDown}
    >
      {isEditing ? (
        <div style={{ display: 'flex', gap: S.sm, alignItems: 'center' }}>
          <select
            value={section.level}
            onChange={(e) =>
              onChange({ ...section, level: Number(e.target.value) as 1 | 2 | 3 })
            }
            style={selectStyle()}
          >
            <option value={1}>H1</option>
            <option value={2}>H2</option>
            <option value={3}>H3</option>
          </select>
          <input
            type="text"
            value={section.text}
            onChange={(e) => onChange({ ...section, text: e.target.value })}
            placeholder="Heading text"
            style={{
              ...selectStyle(),
              flex: 1,
              fontFamily: F.sans,
              fontSize,
              fontWeight: 600,
            }}
          />
        </div>
      ) : (
        <div
          style={{
            fontFamily: F.sans,
            fontSize,
            fontWeight: 600,
            color: C.textPrimary,
            lineHeight: 1.3,
          }}
        >
          {section.text || 'Untitled heading'}
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
    fontSize: 12,
    color: C.textPrimary,
    outline: 'none',
    cursor: 'pointer',
  };
}
