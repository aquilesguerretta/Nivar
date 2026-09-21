// FORGE Wave 6 — CommentaryBlock.
// Markdown-ish text section. V1 supports inline **bold** / *italic* /
// `code` and paragraph breaks (blank line). Editing happens in a
// textarea; preview rendering is a separate component.

import { C, F, R, S } from '@/design/tokens';
import type { CommentarySection } from '@/lib/analyst/types';

interface Props {
  section: CommentarySection;
  /** Editor mode — when false the textarea is collapsed to a preview. */
  isEditing: boolean;
  onChange: (next: CommentarySection) => void;
  onDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
}

export function CommentaryBlock({
  section,
  isEditing,
  onChange,
  onDelete,
  onMoveUp,
  onMoveDown,
}: Props) {
  return (
    <SectionShell
      label="COMMENTARY"
      onDelete={onDelete}
      onMoveUp={onMoveUp}
      onMoveDown={onMoveDown}
    >
      {isEditing ? (
        <textarea
          value={section.body}
          placeholder="Write the analysis. **bold**, *italic*, `code`, blank line for paragraph."
          onChange={(e) => onChange({ ...section, body: e.target.value })}
          rows={6}
          style={{
            width: '100%',
            background: C.bgSurface,
            border: `1px solid ${C.borderDefault}`,
            borderRadius: R.md,
            padding: S.md,
            fontFamily: F.sans,
            fontSize: 14,
            lineHeight: 1.6,
            color: C.textPrimary,
            outline: 'none',
            resize: 'vertical',
          }}
        />
      ) : (
        <div
          style={{
            fontFamily: F.sans,
            fontSize: 14,
            lineHeight: 1.7,
            color: C.textPrimary,
            whiteSpace: 'pre-wrap',
          }}
        >
          {renderMarkdown(section.body)}
        </div>
      )}
    </SectionShell>
  );
}

// ─── Lightweight inline-markdown renderer ─────────────────────────

/**
 * Parses **bold**, *italic*, `code` inline. Returns a React fragment.
 * Paragraphs are split on blank lines (caller handles via whiteSpace).
 */
function renderMarkdown(body: string): React.ReactNode {
  // Process inline tokens in order: code (most fragile), bold, italic.
  // Use a simple regex split to interleave plain text with spans.
  return body.split('\n').map((line, lineIdx) => {
    const parts: React.ReactNode[] = [];
    const regex = /(`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*)/g;
    let lastIdx = 0;
    let match: RegExpExecArray | null;
    while ((match = regex.exec(line)) !== null) {
      if (match.index > lastIdx) parts.push(line.slice(lastIdx, match.index));
      const token = match[0];
      if (token.startsWith('`') && token.endsWith('`')) {
        parts.push(
          <code
            key={`${lineIdx}-${match.index}`}
            style={{
              fontFamily: F.mono,
              fontSize: 13,
              background: C.bgSurface,
              border: `1px solid ${C.borderDefault}`,
              borderRadius: 2,
              padding: '1px 4px',
              color: C.electricBlueLight,
            }}
          >
            {token.slice(1, -1)}
          </code>,
        );
      } else if (token.startsWith('**') && token.endsWith('**')) {
        parts.push(
          <strong key={`${lineIdx}-${match.index}`} style={{ fontWeight: 600 }}>
            {token.slice(2, -2)}
          </strong>,
        );
      } else if (token.startsWith('*') && token.endsWith('*')) {
        parts.push(
          <em key={`${lineIdx}-${match.index}`} style={{ fontStyle: 'italic' }}>
            {token.slice(1, -1)}
          </em>,
        );
      } else {
        parts.push(token);
      }
      lastIdx = match.index + token.length;
    }
    if (lastIdx < line.length) parts.push(line.slice(lastIdx));
    return (
      <div key={lineIdx}>
        {parts.length === 0 ? ' ' : parts}
      </div>
    );
  });
}

// ─── Shell ────────────────────────────────────────────────────────

export function SectionShell({
  label,
  onDelete,
  onMoveUp,
  onMoveDown,
  children,
}: {
  label: string;
  onDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        background: C.bgElevated,
        border: `1px solid ${C.borderDefault}`,
        borderRadius: R.md,
        padding: S.md,
        display: 'flex',
        flexDirection: 'column',
        gap: S.sm,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <span
          style={{
            fontFamily: F.mono,
            fontSize: 10,
            fontWeight: 600,
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            color: C.textMuted,
          }}
        >
          {label}
        </span>
        <div style={{ display: 'flex', gap: S.xs }}>
          <BlockBtn onClick={onMoveUp} title="Move up">▲</BlockBtn>
          <BlockBtn onClick={onMoveDown} title="Move down">▼</BlockBtn>
          <BlockBtn onClick={onDelete} title="Delete">×</BlockBtn>
        </div>
      </div>
      {children}
    </div>
  );
}

function BlockBtn({
  onClick,
  title,
  children,
}: {
  onClick: () => void;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      style={{
        background: 'transparent',
        border: `1px solid ${C.borderDefault}`,
        borderRadius: 2,
        width: 22,
        height: 22,
        fontFamily: F.mono,
        fontSize: 10,
        color: C.textMuted,
        cursor: 'pointer',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 0,
        lineHeight: 1,
      }}
    >
      {children}
    </button>
  );
}
