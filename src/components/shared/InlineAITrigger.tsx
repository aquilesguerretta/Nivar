// ORACLE Wave 2 — InlineAITrigger primitive.
//
// Wraps any element with an "ask AI about this" affordance. Three visual
// treatments:
//   - 'inline'  : a tiny icon button rendered next to the wrapped content
//   - 'overlay' : an icon that fades in on hover, positioned absolutely
//                 over the top-right corner of the wrapped content
//   - 'wrapped' : the wrapped content itself becomes the click target
//
// On click, the trigger:
//   1. Writes a PendingTrigger { prompt, subContext, autoSubmit } into
//      conversationStore.
//   2. Opens the AIAssistant panel via uiStore.toggleAIAssistant.
//   3. The AIAssistant consumes the pending trigger on render and either
//      pre-fills the input OR auto-submits — depending on `autoSubmit`.
//
// Other agents wrap their charts / values / terms in this primitive when
// they're ready. ORACLE does not retrofit any existing component in this
// sprint — the primitive is opt-in.

import { useState, type ReactNode } from 'react';
import { C, F, R, S } from '@/design/tokens';
import { useUIStore } from '@/stores/uiStore';
import { useConversationStore } from '@/stores/conversationStore';
import type { SurfaceContext } from '@/services/aiContext';

export type InlineAITreatment = 'inline' | 'overlay' | 'wrapped';

export interface InlineAITriggerProps {
  /** The content the trigger is "about". */
  children: ReactNode;
  /** The prompt that will pre-populate the AIAssistant input. */
  contextPrompt: string;
  /**
   * Optional sub-context merged into the surface snapshot when the
   * AIAssistant opens. Useful for adding the specific chart id, hovered
   * data point, or focused element to the LLM's context.
   */
  subContext?: Partial<SurfaceContext>;
  /**
   * Visual treatment. Defaults to 'overlay' — icon-on-hover, the most
   * unobtrusive option.
   */
  treatment?: InlineAITreatment;
  /**
   * If true, the AIAssistant auto-submits the prompt on open instead of
   * just pre-filling the input. Default false — let the user review and
   * edit the prompt before sending.
   */
  autoSubmit?: boolean;
  /** Accessible label for the trigger button. */
  ariaLabel?: string;
}

export function InlineAITrigger({
  children,
  contextPrompt,
  subContext,
  treatment = 'overlay',
  autoSubmit = false,
  ariaLabel = 'Ask GridAlpha AI about this',
}: InlineAITriggerProps) {
  const setPendingTrigger = useConversationStore((s) => s.setPendingTrigger);
  const aiOpen = useUIStore((s) => s.aiAssistantOpen);
  const toggleAI = useUIStore((s) => s.toggleAIAssistant);
  const [hovered, setHovered] = useState(false);

  const fire = () => {
    setPendingTrigger({
      prompt: contextPrompt,
      subContext,
      autoSubmit,
    });
    if (!aiOpen) toggleAI();
  };

  if (treatment === 'wrapped') {
    return (
      <div
        role="button"
        tabIndex={0}
        aria-label={ariaLabel}
        onClick={fire}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            fire();
          }
        }}
        style={{
          cursor: 'pointer',
          display: 'inline-block',
          borderRadius: R.sm,
          transition: 'background-color 150ms cubic-bezier(0.4, 0, 0.2, 1)',
          background: hovered ? C.electricBlueWash : 'transparent',
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {children}
      </div>
    );
  }

  if (treatment === 'inline') {
    return (
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: S.xs,
        }}
      >
        {children}
        <TriggerIconButton onClick={fire} ariaLabel={ariaLabel} />
      </span>
    );
  }

  // 'overlay' — icon fades in on hover, positioned at top-right.
  return (
    <span
      style={{ position: 'relative', display: 'inline-block' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {children}
      <span
        style={{
          position: 'absolute',
          top: -8,
          right: -8,
          opacity: hovered ? 1 : 0,
          pointerEvents: hovered ? 'auto' : 'none',
          transition: 'opacity 150ms cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        <TriggerIconButton onClick={fire} ariaLabel={ariaLabel} />
      </span>
    </span>
  );
}

// ─── Small icon button ───────────────────────────────────────────────

function TriggerIconButton({
  onClick,
  ariaLabel,
}: {
  onClick: () => void;
  ariaLabel: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      style={{
        width: 18,
        height: 18,
        borderRadius: '50%',
        background: C.electricBlue,
        border: 'none',
        cursor: 'pointer',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 1px 4px rgba(0,0,0,0.35)',
      }}
    >
      <span
        style={{
          fontFamily: F.mono,
          fontSize: 10,
          fontWeight: 700,
          color: C.textPrimary,
          lineHeight: 1,
        }}
      >
        AI
      </span>
    </button>
  );
}
