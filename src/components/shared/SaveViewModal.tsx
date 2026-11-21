import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { C, F, R, S } from '@/design/tokens';

// CONDUIT shared — modal dialog asking the user to name a saved view.
// Visual treatment matches the FOUNDRY CommandPalette modal: full-viewport
// backdrop with blur, centered elevated panel, electric-blue active edge.
//
// Rendered through a portal to `document.body` so the modal escapes the
// TopBar stacking context (the trigger that mounts this modal lives
// inside TopBar; without a portal the modal would render below the AI
// Assistant trigger and other root-level overlays).

interface Props {
  open: boolean;
  onClose: () => void;
  onSave: (name: string) => void;
  /** Short summary of what's being saved, e.g. "/nest · Trader". */
  preview: string;
}

export function SaveViewModal({ open, onClose, onSave, preview }: Props) {
  const [name, setName] = useState('');
  const [hoverPrimary, setHoverPrimary] = useState(false);
  const [hoverGhost, setHoverGhost] = useState(false);

  useEffect(() => {
    if (!open) return;
    setName('');
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onClose();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onClose]);

  if (!open) return null;

  const trimmed = name.trim();
  const canSave = trimmed.length > 0;

  const submit = () => {
    if (!canSave) return;
    onSave(trimmed);
  };

  return createPortal(
    <div
      role="dialog"
      aria-label="Save current view"
      aria-modal
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        // Modal backdrop — slightly bluer-and-darker than pure black, so
        // the panel reads as "lifted" rather than "punched out".
        background: 'rgba(8,9,11,0.72)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        paddingTop: 140,
        zIndex: 10000,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: 480,
          position: 'relative',
          zIndex: 10001,
          background: C.bgElevated,
          border: `1px solid ${C.borderDefault}`,
          borderTop: `1px solid ${C.borderActive}`,
          borderRadius: R.lg,
          padding: S.xl,
          display: 'flex',
          flexDirection: 'column',
          gap: S.lg,
        }}
      >
        {/* Eyebrow */}
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
          SAVE CURRENT VIEW
        </div>

        {/* Identity line */}
        <div
          style={{
            fontFamily: F.sans,
            fontSize: 18,
            fontWeight: 500,
            color: C.textPrimary,
            lineHeight: 1.3,
            marginTop: -8,
          }}
        >
          Name your view.
        </div>

        {/* Input */}
        <input
          autoFocus
          type="text"
          placeholder="e.g., Morning routine"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              submit();
            }
          }}
          style={{
            height: 48,
            background: C.bgSurface,
            border: `1px solid ${C.borderDefault}`,
            borderRadius: R.md,
            padding: `0 ${S.md}`,
            outline: 'none',
            fontFamily: F.sans,
            fontSize: 15,
            color: C.textPrimary,
            caretColor: C.electricBlue,
          }}
        />

        {/* Preview line */}
        <div
          style={{
            fontFamily: F.mono,
            fontSize: 11,
            color: C.textMuted,
            letterSpacing: '0.06em',
          }}
        >
          {preview}
        </div>

        {/* Buttons */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: S.sm,
            marginTop: S.sm,
          }}
        >
          <button
            type="button"
            onClick={onClose}
            onMouseEnter={() => setHoverGhost(true)}
            onMouseLeave={() => setHoverGhost(false)}
            style={{
              height: 36,
              padding: `0 ${S.md}`,
              background: 'transparent',
              border: `1px solid ${hoverGhost ? C.borderStrong : C.borderDefault}`,
              borderRadius: R.md,
              color: C.textSecondary,
              fontFamily: F.sans,
              fontSize: 13,
              cursor: 'pointer',
              transition: 'border-color 150ms cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={submit}
            disabled={!canSave}
            onMouseEnter={() => setHoverPrimary(true)}
            onMouseLeave={() => setHoverPrimary(false)}
            style={{
              height: 36,
              padding: `0 ${S.lg}`,
              background: canSave
                ? hoverPrimary
                  ? C.electricBlueLight
                  : C.electricBlue
                : C.electricBlueWash,
              border: 'none',
              borderRadius: R.md,
              color: canSave ? C.textPrimary : C.textMuted,
              fontFamily: F.sans,
              fontSize: 13,
              fontWeight: 600,
              cursor: canSave ? 'pointer' : 'not-allowed',
              transition: 'background-color 150ms cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          >
            Save view
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
