// FORGE Wave 6 — PublishReportButton.
//
// Static import of reportRenderer — no dynamic feature-detect (learned
// from Wave 2's ExportMemoButton bug). On click: render PDF + reveal
// the shareable URL inline so the analyst can copy it.

import { useState } from 'react';
import { C, F, R, S } from '@/design/tokens';
import { renderReportPDF } from '@/lib/analyst/reportRenderer';
import { useAnalystStore } from '@/stores/analystStore';
import type { Report } from '@/lib/analyst/types';

interface Props {
  report: Report;
}

export function PublishReportButton({ report }: Props) {
  const savedQueries = useAnalystStore((s) => s.savedQueries);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [shareUrl, setShareUrl] = useState<string | null>(null);

  async function handleClick() {
    setError(null);
    setShareUrl(null);
    try {
      setBusy(true);
      const res = await renderReportPDF(report, savedQueries);
      if (!res.success) {
        setError(res.error ?? 'Publish failed.');
        return;
      }
      if (res.shareUrl) setShareUrl(res.shareUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Publish failed.');
    } finally {
      setBusy(false);
    }
  }

  async function copyShareUrl() {
    if (!shareUrl) return;
    try {
      await navigator.clipboard.writeText(shareUrl);
    } catch {
      // Best-effort; some browsers block on insecure contexts.
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: S.xs }}>
      <button
        type="button"
        onClick={handleClick}
        disabled={busy}
        style={{
          background: busy ? 'transparent' : C.electricBlue,
          border: `1px solid ${busy ? C.borderDefault : C.electricBlue}`,
          borderRadius: R.md,
          padding: `0 ${S.lg}`,
          height: 40,
          fontFamily: F.mono,
          fontSize: 12,
          fontWeight: 600,
          letterSpacing: '0.16em',
          textTransform: 'uppercase',
          color: busy ? C.textMuted : C.textPrimary,
          cursor: busy ? 'not-allowed' : 'pointer',
          opacity: busy ? 0.55 : 1,
        }}
      >
        {busy ? 'PUBLISHING…' : 'PUBLISH REPORT'}
      </button>
      {error && (
        <div
          style={{
            fontFamily: F.mono,
            fontSize: 11,
            color: C.alertCritical,
            letterSpacing: '0.10em',
          }}
        >
          {error}
        </div>
      )}
      {shareUrl && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: S.sm,
            padding: S.sm,
            background: C.bgSurface,
            border: `1px solid ${C.borderDefault}`,
            borderRadius: R.sm,
          }}
        >
          <span
            style={{
              fontFamily: F.mono,
              fontSize: 10,
              fontWeight: 600,
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              color: C.electricBlueLight,
            }}
          >
            SHARE URL
          </span>
          <code
            style={{
              fontFamily: F.mono,
              fontSize: 11,
              color: C.textSecondary,
              flex: 1,
              minWidth: 0,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {shareUrl}
          </code>
          <button
            type="button"
            onClick={copyShareUrl}
            style={{
              background: 'transparent',
              border: `1px solid ${C.borderDefault}`,
              borderRadius: R.sm,
              padding: '4px 8px',
              fontFamily: F.mono,
              fontSize: 10,
              fontWeight: 600,
              letterSpacing: '0.10em',
              textTransform: 'uppercase',
              color: C.textSecondary,
              cursor: 'pointer',
            }}
          >
            COPY
          </button>
        </div>
      )}
    </div>
  );
}
