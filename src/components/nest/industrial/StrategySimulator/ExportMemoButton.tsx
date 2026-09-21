// FORGE Wave 2 — Export-memo button.
// CONDUIT-2's PDF pipeline is now shipped at `@/services/pdfExport`, so
// this button is a thin static-import wrapper. (V1 used a dynamic
// `@vite-ignore` import for feature-detection that never resolved the
// `@/` alias and left the button permanently disabled — replaced.)

import { useState } from 'react';
import { C, F, R, S } from '@/design/tokens';
import { exportStrategyMemo } from '@/services/pdfExport';
import type {
  FacilityProfile,
  StrategyResult,
} from '@/lib/types/simulator';

interface Props {
  result: StrategyResult;
  profile: FacilityProfile;
}

export function ExportMemoButton({ result, profile }: Props) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleClick() {
    setError(null);
    try {
      setBusy(true);
      const out = await exportStrategyMemo(profile, result);
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
        title={busy ? 'Generating memo…' : 'Export this strategy as a board-ready PDF memo.'}
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
