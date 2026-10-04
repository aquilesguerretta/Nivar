import { useEffect, useState } from 'react';
import { C, F, R, S } from '@/design/tokens';
import { useAnnotations } from '@/hooks/useAnnotations';

// CONDUIT shared — right-edge sliding panel that lists every annotation
// for a given chart and lets the user edit, delete, or clear them.
// Pure UI: caller toggles `open` and decides what `chartId` to bind to.
// Inline edit happens in place — clicking a row promotes its text to a
// textarea, blur or Enter commits.

interface Props {
  chartId: string;
  open: boolean;
  onClose: () => void;
  /** Called when user clicks "+ Add annotation" — caller flips the
   *  AnnotationLayer into add-mode. */
  onRequestAdd?: () => void;
  /** Optional id of the row to highlight (when a dot was clicked). */
  activeId?: string | null;
  /** Called when a row is clicked — typically the caller mirrors this
   *  back into AnnotationLayer's `activeId`. */
  onRowClick?: (id: string) => void;
}

export function AnnotationDrawer({
  chartId,
  open,
  onClose,
  onRequestAdd,
  activeId,
  onRowClick,
}: Props) {
  const { annotations, update, remove, clearAll } = useAnnotations(chartId);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState('');
  const [hoverClose, setHoverClose] = useState(false);
  const [hoverAdd, setHoverAdd] = useState(false);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (editingId) {
          setEditingId(null);
          return;
        }
        e.stopPropagation();
        onClose();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, editingId, onClose]);

  if (!open) return null;

  const startEdit = (id: string, current: string) => {
    setEditingId(id);
    setEditingText(current);
  };

  const commitEdit = () => {
    if (!editingId) return;
    const trimmed = editingText.trim();
    if (trimmed.length > 0) {
      update(editingId, trimmed);
    }
    setEditingId(null);
    setEditingText('');
  };

  const handleClearAll = () => {
    if (annotations.length === 0) return;
    if (window.confirm('Clear all annotations on this chart?')) {
      clearAll();
    }
  };

  return (
    <aside
      role="complementary"
      aria-label="Annotations"
      style={{
        position: 'fixed',
        top: 0,
        right: 0,
        width: 360,
        height: '100vh',
        background: C.bgOverlay,
        borderLeft: `1px solid ${C.borderDefault}`,
        borderTop: `1px solid ${C.borderActive}`,
        zIndex: 9300,
        display: 'flex',
        flexDirection: 'column',
        // Subtle lift — borders carry the hierarchy, the shadow only
        // separates the drawer from the page behind it.
        boxShadow: '-8px 0 24px rgba(0,0,0,0.20)',
      }}
    >
      {/* Header */}
      <header
        style={{
          padding: `${S.lg} ${S.lg} ${S.md}`,
          borderBottom: `1px solid ${C.borderDefault}`,
          display: 'flex',
          flexDirection: 'column',
          gap: S.xs,
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
          }}
        >
          <div
            style={{
              fontFamily: F.mono,
              fontSize: 10,
              fontWeight: 600,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: C.textMuted,
            }}
          >
            ANNOTATIONS
          </div>
          <button
            type="button"
            onClick={onClose}
            onMouseEnter={() => setHoverClose(true)}
            onMouseLeave={() => setHoverClose(false)}
            aria-label="Close annotations panel"
            style={{
              width: 24,
              height: 24,
              padding: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'transparent',
              border: 'none',
              borderRadius: R.sm,
              color: hoverClose ? C.textPrimary : C.textMuted,
              cursor: 'pointer',
              transition: 'color 150ms cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          >
            <CloseIcon />
          </button>
        </div>
        <div
          style={{
            fontFamily: F.sans,
            fontSize: 18,
            fontWeight: 500,
            color: C.textPrimary,
          }}
        >
          Your notes.
        </div>
      </header>

      {/* List */}
      <div style={{ flex: 1, overflowY: 'auto', padding: `${S.sm} 0` }}>
        {annotations.length === 0 ? (
          <div
            style={{
              padding: S.lg,
              fontFamily: F.sans,
              fontSize: 13,
              color: C.textMuted,
              textAlign: 'center',
              lineHeight: 1.5,
            }}
          >
            No annotations on this chart yet. Click "+ Add annotation" below to drop your first note.
          </div>
        ) : (
          annotations.map((a) => (
            <Row
              key={a.id}
              id={a.id}
              sequence={a.sequence}
              text={a.text}
              updatedAt={a.updatedAt}
              active={a.id === activeId}
              isEditing={editingId === a.id}
              editingText={editingText}
              onSelect={() => onRowClick?.(a.id)}
              onStartEdit={() => startEdit(a.id, a.text)}
              onChangeEdit={setEditingText}
              onCommitEdit={commitEdit}
              onCancelEdit={() => setEditingId(null)}
              onDelete={() => {
                if (window.confirm('Delete this annotation?')) remove(a.id);
              }}
            />
          ))
        )}
      </div>

      {/* Footer */}
      <footer
        style={{
          padding: S.md,
          borderTop: `1px solid ${C.borderDefault}`,
          display: 'flex',
          flexDirection: 'column',
          gap: S.sm,
        }}
      >
        <button
          type="button"
          onClick={onRequestAdd}
          onMouseEnter={() => setHoverAdd(true)}
          onMouseLeave={() => setHoverAdd(false)}
          style={{
            height: 36,
            background: hoverAdd ? C.electricBlueLight : C.electricBlue,
            border: 'none',
            borderRadius: R.md,
            color: C.textPrimary,
            fontFamily: F.sans,
            fontSize: 13,
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'background-color 150ms cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        >
          + Add annotation
        </button>
        <button
          type="button"
          onClick={handleClearAll}
          disabled={annotations.length === 0}
          style={{
            height: 28,
            background: 'transparent',
            border: 'none',
            color: annotations.length === 0 ? C.textMuted : C.textSecondary,
            fontFamily: F.sans,
            fontSize: 12,
            cursor: annotations.length === 0 ? 'default' : 'pointer',
            textDecoration: 'underline',
            textUnderlineOffset: 3,
            opacity: annotations.length === 0 ? 0.4 : 1,
          }}
        >
          Clear all annotations
        </button>
      </footer>
    </aside>
  );
}

interface RowProps {
  id: string;
  sequence: number;
  text: string;
  updatedAt: string;
  active: boolean;
  isEditing: boolean;
  editingText: string;
  onSelect: () => void;
  onStartEdit: () => void;
  onChangeEdit: (text: string) => void;
  onCommitEdit: () => void;
  onCancelEdit: () => void;
  onDelete: () => void;
}

function Row({
  sequence,
  text,
  updatedAt,
  active,
  isEditing,
  editingText,
  onSelect,
  onStartEdit,
  onChangeEdit,
  onCommitEdit,
  onCancelEdit,
  onDelete,
}: RowProps) {
  const [hover, setHover] = useState(false);
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={onSelect}
      style={{
        padding: `${S.sm} ${S.lg}`,
        display: 'flex',
        gap: S.sm,
        background: active
          ? 'rgba(59,130,246,0.10)'
          : hover
            ? 'rgba(255,255,255,0.03)'
            : 'transparent',
        cursor: isEditing ? 'default' : 'pointer',
        transition: 'background-color 150ms cubic-bezier(0.4, 0, 0.2, 1)',
        borderLeft: active ? `2px solid ${C.electricBlue}` : '2px solid transparent',
      }}
    >
      <div
        style={{
          width: 22,
          height: 22,
          flexShrink: 0,
          marginTop: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: active ? C.electricBlue : 'rgba(59,130,246,0.20)',
          border: `1px solid ${C.electricBlue}`,
          borderRadius: '50%',
          color: active ? C.textPrimary : C.electricBlueLight,
          fontFamily: F.mono,
          fontSize: 10,
          fontWeight: 700,
        }}
      >
        {sequence}
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
        {isEditing ? (
          <textarea
            autoFocus
            value={editingText}
            onChange={(e) => onChangeEdit(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                onCommitEdit();
              } else if (e.key === 'Escape') {
                e.preventDefault();
                onCancelEdit();
              }
            }}
            onBlur={onCommitEdit}
            onClick={(e) => e.stopPropagation()}
            rows={3}
            style={{
              width: '100%',
              minHeight: 50,
              background: C.bgSurface,
              border: `1px solid ${C.borderActive}`,
              borderRadius: R.sm,
              padding: S.xs,
              color: C.textPrimary,
              fontFamily: F.sans,
              fontSize: 13,
              resize: 'none',
              outline: 'none',
              caretColor: C.electricBlue,
            }}
          />
        ) : (
          <div
            onDoubleClick={(e) => {
              e.stopPropagation();
              onStartEdit();
            }}
            style={{
              fontFamily: F.sans,
              fontSize: 13,
              color: C.textPrimary,
              lineHeight: 1.5,
              wordBreak: 'break-word',
            }}
          >
            {text}
          </div>
        )}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: S.sm,
          }}
        >
          <span
            style={{
              fontFamily: F.mono,
              fontSize: 10,
              color: C.textMuted,
              letterSpacing: '0.04em',
            }}
          >
            {formatTimestamp(updatedAt)}
          </span>
          {hover && !isEditing && (
            <div style={{ display: 'flex', gap: 4 }}>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onStartEdit();
                }}
                aria-label="Edit annotation"
                style={iconButtonStyle()}
              >
                <PencilIcon />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete();
                }}
                aria-label="Delete annotation"
                style={iconButtonStyle()}
              >
                <TrashIcon />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function iconButtonStyle(): React.CSSProperties {
  return {
    width: 22,
    height: 22,
    padding: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'transparent',
    border: 'none',
    borderRadius: R.sm,
    color: C.textMuted,
    cursor: 'pointer',
  };
}

function formatTimestamp(iso: string): string {
  try {
    const d = new Date(iso);
    return d.toLocaleString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return iso;
  }
}

function CloseIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function PencilIcon() {
  return (
    <svg
      width="11"
      height="11"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4z" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg
      width="11"
      height="11"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M3 6h18" />
      <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
    </svg>
  );
}
