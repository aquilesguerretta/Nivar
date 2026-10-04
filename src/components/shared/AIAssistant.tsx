import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { C, F, R, S } from '@/design/tokens';
import { useUIStore } from '@/stores/uiStore';
import { StatusDot } from '@/components/terminal/StatusDot';
import { useAIChat } from '@/hooks/useAIChat';
import { useAIContextSnapshot } from '@/hooks/useAIContextSnapshot';
import { useAuth } from '@/lib/auth/AuthContext';
import { useConversationStore } from '@/stores/conversationStore';
import {
  CONTEXTUAL_PROMPT_LABELS,
  CONTEXTUAL_PROMPTS,
  QUICK_ACTION_CHIP_IDS,
  type ContextualPromptId,
} from '@/lib/prompts/contextualPrompts';
import {
  extractRelatedConcepts,
  isVaultSurface,
} from '@/services/relatedConcepts';

// ORACLE shared — floating AI Assistant chat panel.
// Bottom-right, 360×480, zIndex 9000. Streams real Claude responses via
// useAIChat. Conversation persists in sessionStorage.

const CARET_KEYFRAMES_ID = 'oracle-ai-caret-keyframes';
const CARET_KEYFRAMES_CSS =
  '@keyframes oracle-ai-caret-blink { 0%, 49% { opacity: 1; } 50%, 100% { opacity: 0; } }';

export function AIAssistant() {
  const open = useUIStore((s) => s.aiAssistantOpen);
  const { user, loading: authLoading } = useAuth();
  // Capture a fresh surface snapshot whenever the panel opens or the user
  // navigates while it's open. The hook already memoises on pathname /
  // profile / search params. The pending-trigger's subContext is merged
  // into the snapshot via the hook's `subContext` option below.
  const consumePendingTrigger = useConversationStore(
    (s) => s.consumePendingTrigger,
  );
  const pendingTrigger = useConversationStore((s) => s.pendingTrigger);
  const snapshot = useAIContextSnapshot({
    subContext: pendingTrigger?.subContext,
  });
  const { messages, isStreaming, streamingText, error, send, clear } =
    useAIChat(snapshot);
  const setError = useConversationStore((s) => s.setError);

  const [draft, setDraft] = useState('');
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const canUseAI = !authLoading && user !== null;
  const authRequired = !authLoading && user === null;
  const accessLabel = authLoading
    ? 'Checking access'
    : canUseAI
      ? 'Online'
      : 'Sign in required';

  // Auto-scroll to bottom whenever the visible content grows.
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [messages, streamingText, isStreaming, error, open]);

  // Consume any pending InlineAITrigger payload on open. Pre-fill the
  // input or auto-submit depending on `autoSubmit`.
  useEffect(() => {
    if (!open || authLoading) return;
    const pending = consumePendingTrigger();
    if (!pending) return;
    if (pending.autoSubmit && canUseAI) {
      void send(pending.prompt);
    } else {
      setDraft(pending.prompt);
    }
  }, [open, authLoading, canUseAI, consumePendingTrigger, send]);

  if (!open) return null;

  const handleSubmit = () => {
    const text = draft;
    if (!canUseAI || !text.trim() || isStreaming) return;
    setDraft('');
    void send(text);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div
      role="dialog"
      aria-label="GridAlpha AI Assistant"
      style={{
        position: 'fixed',
        right: 24,
        bottom: 84,
        width: 360,
        height: 480,
        background: C.bgElevated,
        border: `1px solid ${C.borderDefault}`,
        borderTop: `1px solid ${C.borderActive}`,
        borderRadius: R.lg,
        display: 'flex',
        flexDirection: 'column',
        zIndex: 9000,
        overflow: 'hidden',
      }}
    >
      <style id={CARET_KEYFRAMES_ID}>{CARET_KEYFRAMES_CSS}</style>

      {/* Header */}
      <div
        style={{
          height: 48,
          display: 'flex',
          alignItems: 'center',
          gap: S.sm,
          padding: `0 ${S.lg}`,
          borderBottom: `1px solid ${C.borderDefault}`,
          fontFamily: F.mono,
          fontSize: 11,
          fontWeight: 600,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: C.textPrimary,
          flexShrink: 0,
        }}
      >
        <StatusDot status={canUseAI ? 'live' : 'offline'} />
        <span>GridAlpha AI · {accessLabel}</span>
        <div style={{ flex: 1 }} />
        {messages.length > 0 && (
          <button
            type="button"
            onClick={clear}
            disabled={isStreaming}
            style={{
              background: 'transparent',
              border: 'none',
              padding: 0,
              fontFamily: F.mono,
              fontSize: 10,
              fontWeight: 500,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: isStreaming ? C.textMuted : C.textSecondary,
              cursor: isStreaming ? 'default' : 'pointer',
              transition: 'color 150ms cubic-bezier(0.4, 0, 0.2, 1)',
            }}
            aria-label="Clear conversation"
          >
            Clear
          </button>
        )}
      </div>

      {/* Context chip — shows what surface the assistant is analysing. */}
      <ContextChip snapshot={snapshot} />

      {/* Surface-mismatch notice — appears when the user reopens a
          conversation on a different surface than where it started. */}
      <SurfaceMismatchNotice
        snapshot={snapshot}
        onStartFresh={clear}
      />

      {/* Chat history */}
      <div
        ref={scrollRef}
        style={{
          flex: 1,
          padding: S.lg,
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: S.md,
        }}
      >
        {authRequired && (
          <div
            role="status"
            style={{
              alignSelf: 'stretch',
              marginTop: S.md,
              padding: S.lg,
              border: `1px solid ${C.borderAccent}`,
              borderRadius: R.md,
              background: C.electricBlueWash,
              fontFamily: F.sans,
              fontSize: 13,
              lineHeight: 1.5,
              color: C.textSecondary,
              textAlign: 'center',
            }}
          >
            Sign in to use GridAlpha AI.
            <Link
              to="/entrar"
              style={{
                display: 'block',
                marginTop: S.md,
                fontFamily: F.mono,
                fontSize: 10,
                fontWeight: 600,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: C.electricBlueLight,
                textDecoration: 'none',
              }}
            >
              Sign in to NIVAR
            </Link>
          </div>
        )}

        {authLoading && messages.length === 0 && (
          <div
            style={{
              alignSelf: 'center',
              marginTop: S.xl,
              fontFamily: F.sans,
              fontSize: 13,
              color: C.textMuted,
            }}
          >
            Checking account access…
          </div>
        )}

        {canUseAI && messages.length === 0 && !isStreaming && !error && (
          <div
            style={{
              alignSelf: 'center',
              marginTop: S.xl,
              maxWidth: '90%',
              textAlign: 'center',
              fontFamily: F.sans,
              fontSize: 13,
              lineHeight: 1.5,
              color: C.textMuted,
            }}
          >
            Ask anything about today&apos;s PJM market — zones, plants,
            spreads, capacity, basis. I&apos;ll explain at the depth your
            profile needs.
          </div>
        )}

        {messages.map((m, i) => (
          <div
            key={i}
            style={{
              alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
              maxWidth: '80%',
              display: 'flex',
              flexDirection: 'column',
              gap: S.xs,
            }}
          >
            <div
              style={{
                padding: `${S.sm} ${S.md}`,
                background: m.role === 'user' ? C.electricBlueWash : C.bgSurface,
                border: `1px solid ${
                  m.role === 'user' ? C.borderAccent : C.borderDefault
                }`,
                borderRadius: R.md,
                fontFamily: F.sans,
                fontSize: 13,
                lineHeight: 1.5,
                color: m.role === 'user' ? C.textPrimary : C.textSecondary,
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
              }}
            >
              {m.content}
            </div>
            {m.role === 'assistant' &&
              isVaultSurface(snapshot.surface.surface) && (
                <RelatedConceptsFooter
                  text={m.content}
                  excludeSlug={snapshot.surface.currentItemId}
                />
              )}
          </div>
        ))}

        {isStreaming && (
          <div
            style={{
              alignSelf: 'flex-start',
              maxWidth: '80%',
              padding: `${S.sm} ${S.md}`,
              background: C.bgSurface,
              border: `1px solid ${C.borderDefault}`,
              borderRadius: R.md,
              fontFamily: F.sans,
              fontSize: 13,
              lineHeight: 1.5,
              color: C.textSecondary,
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
            }}
          >
            {streamingText}
            <span
              aria-hidden
              style={{
                display: 'inline-block',
                marginLeft: 2,
                color: C.electricBlue,
                animation:
                  'oracle-ai-caret-blink 1s cubic-bezier(0.4, 0, 0.2, 1) infinite',
              }}
            >
              ▊
            </span>
          </div>
        )}
      </div>

      {/* Error banner */}
      {error && (
        <div
          role="alert"
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: S.sm,
            padding: `${S.sm} ${S.md}`,
            borderTop: `1px solid ${C.borderAlert}`,
            background: 'rgba(239,68,68,0.08)',
            fontFamily: F.sans,
            fontSize: 12,
            lineHeight: 1.45,
            color: C.alertCritical,
            flexShrink: 0,
          }}
        >
          <span style={{ flex: 1 }}>{error}</span>
          <button
            type="button"
            onClick={() => setError(null)}
            aria-label="Dismiss error"
            style={{
              background: 'transparent',
              border: 'none',
              padding: 0,
              fontFamily: F.mono,
              fontSize: 14,
              lineHeight: 1,
              color: C.alertCritical,
              cursor: 'pointer',
            }}
          >
            ×
          </button>
        </div>
      )}

      {/* Quick-action chips — pre-populated prompts for common questions
          about the current surface. Hidden once the conversation has any
          messages so the chips don't compete with the chat history. */}
      {messages.length === 0 && !isStreaming && !error && canUseAI && (
        <QuickActionChips
          onPick={(id) => {
            void send(CONTEXTUAL_PROMPTS[id]);
          }}
        />
      )}

      {/* Input bar */}
      <div
        style={{
          minHeight: 48,
          padding: `${S.sm} ${S.md}`,
          borderTop: `1px solid ${C.borderDefault}`,
          display: 'flex',
          alignItems: 'flex-end',
          gap: S.sm,
          flexShrink: 0,
        }}
      >
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={1}
          placeholder={
            authLoading
              ? 'Checking account access…'
              : canUseAI
              ? "Ask anything about today's market..."
              : 'Sign in to a NIVAR account to use the AI service.'
          }
          aria-label="Ask the GridAlpha AI"
          disabled={!canUseAI}
          style={{
            flex: 1,
            resize: 'none',
            background: 'transparent',
            border: 'none',
            outline: 'none',
            fontFamily: F.sans,
            fontSize: 13,
            lineHeight: 1.4,
            color: C.textPrimary,
            caretColor: C.electricBlue,
            maxHeight: 96,
          }}
        />
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!canUseAI || isStreaming || !draft.trim()}
          aria-label="Send message"
          style={{
            flexShrink: 0,
            padding: `${S.xs} ${S.md}`,
            background:
              !canUseAI || isStreaming || !draft.trim()
                ? 'transparent'
                : C.electricBlueWash,
            border: `1px solid ${
              !canUseAI || isStreaming || !draft.trim()
                ? C.borderDefault
                : C.borderActive
            }`,
            borderRadius: R.md,
            fontFamily: F.mono,
            fontSize: 10,
            fontWeight: 600,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color:
              !canUseAI || isStreaming || !draft.trim()
                ? C.textMuted
                : C.electricBlue,
            cursor:
              !canUseAI || isStreaming || !draft.trim()
                ? 'default'
                : 'pointer',
            transition: 'all 150ms cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        >
          {isStreaming ? '···' : 'Send'}
        </button>
      </div>
    </div>
  );
}

// ─── Context chip ────────────────────────────────────────────────────
// Sits below the header and above the message list. Shows the surface
// the assistant is currently analysing — the user always knows what
// "this" refers to in their question.

interface ContextChipProps {
  snapshot: ReturnType<typeof useAIContextSnapshot>;
}

function ContextChip({ snapshot }: ContextChipProps) {
  const { surface } = snapshot;
  const parts: string[] = [surface.surfaceLabel];
  if (surface.selectedZone) parts.push(surface.selectedZone);
  if (surface.currentItemTitle) parts.push(surface.currentItemTitle);
  if (surface.currentLayer) parts.push(surface.currentLayer);
  if (surface.selectedTab) parts.push(surface.selectedTab.toUpperCase());

  const label = parts.join(' · ');

  // Wave 4 — derive the freshness indicator state. Order of precedence:
  //   1. Atlas time-travel replay → amber "replay" indicator
  //   2. Any stale source → amber
  //   3. All sources fresh → green (alertNormal)
  //   4. No freshness data → grey (textMuted), no claim either way.
  const freshness = surface.visibleData?.freshness;
  const inReplay = surface.timeTravelMode === 'event-replay';
  const inScrub = surface.timeTravelMode === 'scrubbed';
  const dotState: FreshnessDotState =
    inReplay || inScrub
      ? 'replay'
      : !freshness
        ? 'unknown'
        : freshness.staleSourceCount > 0
          ? 'stale'
          : 'live';
  const dotTitle = freshnessDotTitle(dotState, snapshot);

  return (
    <div
      role="status"
      aria-label="AI Assistant context"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: S.xs,
        padding: `${S.xs} ${S.lg}`,
        background: C.bgElevated,
        borderBottom: `1px solid ${C.borderDefault}`,
        flexShrink: 0,
      }}
    >
      <ContextEyeIcon />
      <span
        style={{
          fontFamily: F.mono,
          fontSize: 11,
          fontWeight: 600,
          letterSpacing: '0.10em',
          textTransform: 'uppercase',
          color: C.electricBlue,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          flex: 1,
        }}
        title={label}
      >
        Analyzing&nbsp;·&nbsp;{label}
      </span>
      <FreshnessDot state={dotState} title={dotTitle} />
    </div>
  );
}

// ─── Freshness dot ───────────────────────────────────────────────────
// Wave 4. Sits at the right edge of the context chip. 8×8 dot, colour
// keyed to state. The browser tooltip (`title`) names the sources or
// the replayed event so the user can hover to learn what's behind the
// state without expanding the chip.

type FreshnessDotState = 'live' | 'stale' | 'replay' | 'unknown';

const FRESHNESS_DOT_COLOR: Record<FreshnessDotState, string> = {
  live:    C.alertNormal,
  stale:   C.alertWarning,
  replay:  C.falconGold,
  unknown: C.textMuted,
};

function FreshnessDot({
  state,
  title,
}: {
  state: FreshnessDotState;
  title: string;
}) {
  return (
    <span
      aria-label={`Data freshness: ${state}`}
      title={title}
      style={{
        display:      'inline-block',
        width:        8,
        height:       8,
        borderRadius: '50%',
        background:   FRESHNESS_DOT_COLOR[state],
        flexShrink:   0,
      }}
    />
  );
}

function freshnessDotTitle(
  state: FreshnessDotState,
  snapshot: ReturnType<typeof useAIContextSnapshot>,
): string {
  const { surface } = snapshot;
  if (state === 'replay' && surface.replayEvent) {
    return `Replaying ${surface.replayEvent.name} (${surface.replayEvent.window}) — historical data.`;
  }
  if (state === 'replay') {
    return 'Time-travel scrub mode — historical data.';
  }
  const fr = surface.visibleData?.freshness;
  if (!fr) return 'Data freshness unmeasured on this surface.';
  if (state === 'stale') {
    const staleNames = fr.sources
      .filter((s) => s.isStale)
      .map((s) => s.label)
      .join(', ');
    const oldestMin = Math.round(fr.oldestDataAgeSeconds / 60);
    return `${fr.staleSourceCount} of ${fr.sources.length} sources stale (oldest ~${oldestMin} min ago)${staleNames ? `: ${staleNames}` : ''}.`;
  }
  return `All ${fr.sources.length} sources live (oldest ${fr.oldestDataAgeSeconds}s old).`;
}

function ContextEyeIcon() {
  return (
    <svg
      viewBox="0 0 16 16"
      width={11}
      height={11}
      fill="none"
      stroke={C.electricBlue}
      strokeWidth={1.5}
      aria-hidden
      style={{ flexShrink: 0 }}
    >
      <path d="M1 8s2.5-5 7-5 7 5 7 5-2.5 5-7 5-7-5-7-5z" />
      <circle cx="8" cy="8" r="2" />
    </svg>
  );
}

// ─── Quick-action chips ──────────────────────────────────────────────
// Pre-populated prompts for common questions about the current surface.
// Sit above the input bar; hidden once the conversation has messages.

interface QuickActionChipsProps {
  onPick: (id: ContextualPromptId) => void;
}

function QuickActionChips({ onPick }: QuickActionChipsProps) {
  return (
    <div
      role="toolbar"
      aria-label="Quick prompts"
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: S.xs,
        padding: `${S.sm} ${S.md} 0 ${S.md}`,
        flexShrink: 0,
      }}
    >
      {QUICK_ACTION_CHIP_IDS.map((id) => (
        <button
          key={id}
          type="button"
          onClick={() => onPick(id)}
          style={{
            padding: `${S.xs} ${S.sm}`,
            background: 'transparent',
            border: `1px solid ${C.borderAccent}`,
            borderRadius: R.sm,
            fontFamily: F.mono,
            fontSize: 10,
            fontWeight: 500,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: C.electricBlueLight,
            cursor: 'pointer',
            transition: 'all 150ms cubic-bezier(0.4, 0, 0.2, 1)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = C.electricBlueWash;
            e.currentTarget.style.borderColor = C.borderActive;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.borderColor = C.borderAccent;
          }}
        >
          {CONTEXTUAL_PROMPT_LABELS[id]}
        </button>
      ))}
    </div>
  );
}

// ─── Surface mismatch notice ─────────────────────────────────────────
// When the user reopens a conversation that was anchored on a different
// surface than the current view, show a small banner letting them
// continue or start fresh. Only renders when both an anchor exists AND
// the current surface differs from it.

interface SurfaceMismatchNoticeProps {
  snapshot: ReturnType<typeof useAIContextSnapshot>;
  onStartFresh: () => void;
}

function SurfaceMismatchNotice({
  snapshot,
  onStartFresh,
}: SurfaceMismatchNoticeProps) {
  const stored = useConversationStore((s) => s.surfaceContext);
  const messageCount = useConversationStore((s) => s.messages.length);
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;
  if (!stored || messageCount === 0) return null;
  if (stored.surface.surface === snapshot.surface.surface) return null;

  return (
    <div
      role="alert"
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: S.xs,
        padding: `${S.sm} ${S.md}`,
        borderBottom: `1px solid ${C.borderDefault}`,
        background: C.falconGoldWash,
        flexShrink: 0,
      }}
    >
      <span
        style={{
          fontFamily: F.sans,
          fontSize: 12,
          lineHeight: 1.4,
          color: C.textPrimary,
        }}
      >
        This conversation was started on{' '}
        <strong style={{ color: C.falconGold }}>
          {stored.surface.surfaceLabel}
        </strong>
        . You&apos;re now on{' '}
        <strong style={{ color: C.electricBlue }}>
          {snapshot.surface.surfaceLabel}
        </strong>
        .
      </span>
      <div style={{ display: 'flex', gap: S.sm }}>
        <button
          type="button"
          onClick={() => setDismissed(true)}
          style={{
            padding: `${S.xs} ${S.sm}`,
            background: 'transparent',
            border: `1px solid ${C.borderDefault}`,
            borderRadius: R.sm,
            fontFamily: F.mono,
            fontSize: 10,
            fontWeight: 500,
            letterSpacing: '0.10em',
            textTransform: 'uppercase',
            color: C.textSecondary,
            cursor: 'pointer',
          }}
        >
          Continue
        </button>
        <button
          type="button"
          onClick={() => {
            onStartFresh();
            setDismissed(false);
          }}
          style={{
            padding: `${S.xs} ${S.sm}`,
            background: C.electricBlueWash,
            border: `1px solid ${C.borderActive}`,
            borderRadius: R.sm,
            fontFamily: F.mono,
            fontSize: 10,
            fontWeight: 500,
            letterSpacing: '0.10em',
            textTransform: 'uppercase',
            color: C.electricBlue,
            cursor: 'pointer',
          }}
        >
          Start fresh
        </button>
      </div>
    </div>
  );
}

// ─── Related concepts footer ─────────────────────────────────────────
// Rendered below assistant messages on Vault surfaces. Scans the message
// for canonical Alexandria concept terms and surfaces them as Links the
// user can click to jump to the matching entry.

interface RelatedConceptsFooterProps {
  text: string;
  /** Slug of the entry currently being viewed — excluded from the footer. */
  excludeSlug?: string;
}

function RelatedConceptsFooter({
  text,
  excludeSlug,
}: RelatedConceptsFooterProps) {
  const concepts = extractRelatedConcepts(text, excludeSlug);
  if (concepts.length === 0) return null;

  return (
    <div
      role="navigation"
      aria-label="Related Alexandria concepts"
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: S.xs,
        padding: `0 ${S.xs}`,
        marginTop: S.xs,
      }}
    >
      <span
        style={{
          fontFamily: F.mono,
          fontSize: 9,
          fontWeight: 600,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: C.textMuted,
          marginRight: S.xs,
        }}
      >
        Related
      </span>
      {concepts.map(({ term, slug }) => (
        <Link
          key={slug}
          to={`/vault/alexandria/entry/${slug}`}
          style={{
            padding: `2px ${S.xs}`,
            border: `1px solid ${C.borderAccent}`,
            borderRadius: R.sm,
            fontFamily: F.mono,
            fontSize: 10,
            fontWeight: 500,
            letterSpacing: '0.04em',
            color: C.electricBlueLight,
            textDecoration: 'none',
            transition: 'all 150ms cubic-bezier(0.4, 0, 0.2, 1)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = C.electricBlueWash;
            e.currentTarget.style.borderColor = C.borderActive;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.borderColor = C.borderAccent;
          }}
        >
          {term}
        </Link>
      ))}
    </div>
  );
}
