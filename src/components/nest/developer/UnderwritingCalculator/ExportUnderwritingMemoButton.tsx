// FORGE Wave 5 — Underwriting memo PDF export button.
//
// Static import of CONDUIT-2's `exportUnderwritingMemo`. The PDF
// pipeline is unconditionally available — no dynamic feature-detect.
// (Learned from Wave 2's ExportMemoButton bug where the `@/` alias
// never resolved inside an `import(/* @vite-ignore */)` call.)

import { useState } from 'react';
import { C, F, R, S } from '@/design/tokens';
import { exportUnderwritingMemo } from '@/services/pdfExport';
import type {
  ProjectSpec,
  UnderwritingResults,
} from '@/lib/underwriting/types';

interface Props {
  spec: ProjectSpec;
  results: UnderwritingResults;
}

export function ExportUnderwritingMemoButton({ spec, results }: Props) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleClick() {
    setError(null);
    try {
      setBusy(true);
      const out = await exportUnderwritingMemo(spec, results);
      if (!out.success) {
        setError(out.error ?? 'Export failed.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Export failed.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: S.xs }}>
      <button
        type="button"
        onClick={handleClick}
        disabled={busy}
        title={
          busy
            ? 'Generating underwriting memo…'
            : 'Export this project as a board-ready PDF memo.'
        }
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
        {busy ? 'Generating…' : 'Export Memo (PDF)'}
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
    </div>
  );
}
