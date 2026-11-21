// ORACLE Wave 3 — AI lesson-summary panel.
//
// Sits at the top of each entry layer. Click "Show AI summary" to
// generate (or read from cache). The summary is intended as a comparison
// reference for students reviewing their own notes — short paragraph in
// terminal voice, marked with a small "AI" badge so the user knows it's
// generated.

import { useState } from 'react';
import { C, F, R, S } from '@/design/tokens';
import { ContainedCard } from '@/components/terminal/ContainedCard';
import { useLessonSummary } from '@/hooks/useLessonSummary';
import type { LayerKey } from '@/lib/types/curriculum';

interface Props {
  entrySlug: string;
  layer: LayerKey;
}

export function LessonSummaryPanel({ entrySlug, layer }: Props) {
  const { summary, isGenerating, error, generate, regenerate } =
    useLessonSummary(entrySlug, layer);
  const [expanded, setExpanded] = useState(false);

  const handleToggle = () => {
    if (!summary && !isGenerating) {
      void generate();
    }
    setExpanded((v) => !v);
  };

  return (
    <ContainedCard padding={S.md} style={{ marginBottom: S.lg }}>
      <div
        style={{
          display:    'flex',
          alignItems: 'center',
          gap:        S.md,
          flexWrap:   'wrap',
        }}
      >
        <span
          style={{
            display:       'inline-flex',
            alignItems:    'center',
            gap:           S.xs,
            fontFamily:    F.mono,
            fontSize:      11,
            fontWeight:    600,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color:         C.electricBlue,
          }}
        >
          <AIBadge />
          AI Summary · {layer}
        </span>
        <button
          type="button"
          onClick={handleToggle}
          disabled={isGenerating}
          style={{
            marginLeft:    'auto',
            fontFamily:    F.mono,
            fontSize:      11,
            fontWeight:    600,
            letterSpacing: '0.10em',
            textTransform: 'uppercase',
            color:         isGenerating ? C.textMuted : C.electricBlueLight,
            background:    'transparent',
            border:        `1px solid ${
              isGenerating ? C.borderDefault : C.borderActive
            }`,
            borderRadius:  R.sm,
            padding:       `${S.xs} ${S.md}`,
            cursor:        isGenerating ? 'default' : 'pointer',
            transition:    'all 150ms cubic-bezier(0.4,0,0.2,1)',
          }}
        >
          {isGenerating
            ? 'Generating…'
            : summary
              ? expanded
                ? 'Hide'
                : 'Show'
              : 'Show AI summary'}
        </button>
      </div>

      {expanded && (
        <div style={{ marginTop: S.md }}>
          {error && (
            <div
              role="alert"
              style={{
                padding:      `${S.sm} ${S.md}`,
                background:   'rgba(239,68,68,0.08)',
                border:       `1px solid ${C.borderAlert}`,
                borderRadius: R.md,
                fontFamily:   F.sans,
                fontSize:     13,
                lineHeight:   1.4,
                color:        C.alertCritical,
                marginBottom: S.sm,
              }}
            >
              {error}
            </div>
          )}
          {summary ? (
            <>
              <p
                style={{
                  margin:     0,
                  fontFamily: F.sans,
                  fontSize:   14,
                  lineHeight: 1.55,
                  color:      C.textPrimary,
                  maxWidth:   780,
                }}
              >
                {summary.text}
              </p>
              <div
                style={{
                  marginTop:     S.sm,
                  display:       'flex',
                  alignItems:    'center',
                  gap:           S.md,
                  fontFamily:    F.mono,
                  fontSize:      10,
                  letterSpacing: '0.10em',
                  textTransform: 'uppercase',
                  color:         C.textMuted,
                }}
              >
                <span>Cached · {summary.generatedAt.slice(0, 10)}</span>
                <button
                  type="button"
                  onClick={() => void regenerate()}
                  disabled={isGenerating}
                  style={{
                    background:    'transparent',
                    border:        'none',
                    padding:       0,
                    fontFamily:    F.mono,
                    fontSize:      10,
                    fontWeight:    500,
                    letterSpacing: '0.10em',
                    textTransform: 'uppercase',
                    color:         isGenerating
                      ? C.textMuted
                      : C.electricBlue,
                    cursor:        isGenerating ? 'default' : 'pointer',
                  }}
                >
                  Regenerate
                </button>
              </div>
            </>
          ) : (
            !isGenerating && (
              <div
                style={{
                  fontFamily: F.sans,
                  fontSize:   13,
                  lineHeight: 1.5,
                  color:      C.textMuted,
                }}
              >
                Click "Show AI summary" to generate a 4–5 sentence
                comparison reference from this entry. You can compare it
                against your own notes.
              </div>
            )
          )}
        </div>
      )}
    </ContainedCard>
  );
}

function AIBadge() {
  return (
    <span
      aria-hidden
      style={{
        display:       'inline-flex',
        alignItems:    'center',
        justifyContent: 'center',
        width:         16,
        height:        16,
        borderRadius:  '50%',
        background:    C.electricBlue,
        color:         C.textPrimary,
        fontFamily:    F.mono,
        fontSize:      8,
        fontWeight:    700,
        letterSpacing: '0.04em',
      }}
    >
      AI
    </span>
  );
}

export default LessonSummaryPanel;
