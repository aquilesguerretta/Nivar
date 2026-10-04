import { useEffect, useRef, useState } from 'react';
import { C, F, R, S } from '@/design/tokens';
import { useAnnotations } from '@/hooks/useAnnotations';
import { AnnotationDot } from './AnnotationDot';

// CONDUIT shared — overlay that sits on top of any chart container and
// adds annotation capability. Pointer events pass through to the chart
// underneath unless `enabled` is true (annotation-add mode), in which
// case clicks on empty space drop a new annotation at the click point.
//
// The parent container must have `position: relative` (or any non-static
// positioning) so this layer's `inset: 0` works correctly. AnnotatableChart
// handles that automatically.

interface Props {
  /** Stable identifier "<screen>:<chart-id>" pattern. */
  chartId: string;
  /** When true, clicking empty space opens a new-annotation input. */
  enabled?: boolean;
  /** Called by the input UI on Save/Cancel so the parent (toolbar) can
   *  flip back out of add-mode. Optional — caller may keep enabled
   *  toggled manually. */
  onAddDone?: () => void;
  /** Optional id of the annotation to highlight (e.g. drawer-selected). */
  activeId?: string | null;
  /** Click handler when an existing dot is clicked. */
  onDotClick?: (id: string) => void;
}

interface DraftPos {
  xNormalized: number;
  yNormalized: number;
}

export function AnnotationLayer({
  chartId,
  enabled = false,
  onAddDone,
  activeId,
  onDotClick,
}: Props) {
  const { annotations, add } = useAnnotations(chartId);
  const layerRef = useRef<HTMLDivElement>(null);
  const [draft, setDraft] = useState<DraftPos | null>(null);
  const [draftText, setDraftText] = useState('');

  // Reset the draft whenever add-mode is turned off externally.
  useEffect(() => {
    if (!enabled) {
      setDraft(null);
      setDraftText('');
    }
  }, [enabled]);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!enabled) return;
    if (!layerRef.current) return;
    const rect = layerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setDraft({ xNormalized: x, yNormalized: y });
    setDraftText('');
  };

  const commitDraft = () => {
    if (!draft) return;
    const trimmed = draftText.trim();
    if (trimmed.length === 0) {
      setDraft(null);
      onAddDone?.();
      return;
    }
    add(draft.xNormalized, draft.yNormalized, trimmed);
    setDraft(null);
    setDraftText('');
    onAddDone?.();
  };

  const cancelDraft = () => {
    setDraft(null);
    setDraftText('');
    onAddDone?.();
  };

  return (
    <div
      ref={layerRef}
      onClick={handleClick}
      style={{
        position: 'absolute',
        inset: 0,
        // Pass clicks through unless we're in add-mode. Existing dots are
        // children of this layer but each dot opts back IN to pointer
        // events on its own button.
        pointerEvents: enabled ? 'auto' : 'none',
        cursor: enabled && !draft ? 'crosshair' : 'default',
        zIndex: 10,
      }}
    >
      {annotations.map((a) => (
        <div key={a.id} style={{ pointerEvents: 'auto' }}>
          <AnnotationDot
            sequence={a.sequence}
            xPercent={a.xNormalized * 100}
            yPercent={a.yNormalized * 100}
            active={a.id === activeId}
            onClick={() => onDotClick?.(a.id)}
            title={a.text}
          />
        </div>
      ))}

      {draft && (
        <div
          style={{
            position: 'absolute',
            left: `${draft.xNormalized * 100}%`,
            top: `${draft.yNormalized * 100}%`,
            transform: 'translate(8px, -50%)',
            pointerEvents: 'auto',
            zIndex: 20,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div
            style={{
              width: 220,
              background: C.bgElevated,
              border: `1px solid ${C.borderActive}`,
              borderRadius: R.md,
              padding: S.sm,
              display: 'flex',
              flexDirection: 'column',
              gap: S.xs,
              boxShadow: '0 8px 18px rgba(0,0,0,0.40)',
            }}
          >
            <textarea
              autoFocus
              value={draftText}
              onChange={(e) => setDraftText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  commitDraft();
                } else if (e.key === 'Escape') {
                  e.preventDefault();
                  cancelDraft();
                }
              }}
              placeholder="Add note..."
              rows={3}
              style={{
                width: '100%',
                minHeight: 60,
                background: C.bgSurface,
                border: `1px solid ${C.borderDefault}`,
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
            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                gap: S.xs,
              }}
            >
              <button
                type="button"
                onClick={cancelDraft}
                style={{
                  height: 24,
                  padding: `0 ${S.sm}`,
                  background: 'transparent',
                  border: `1px solid ${C.borderDefault}`,
                  borderRadius: R.sm,
                  color: C.textSecondary,
                  fontFamily: F.sans,
                  fontSize: 11,
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={commitDraft}
                style={{
                  height: 24,
                  padding: `0 ${S.sm}`,
                  background: C.electricBlue,
                  border: 'none',
                  borderRadius: R.sm,
                  color: C.textPrimary,
                  fontFamily: F.sans,
                  fontSize: 11,
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
