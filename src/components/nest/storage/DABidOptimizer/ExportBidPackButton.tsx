// FORGE Wave 3 — Export Bid Pack PDF button.
//
// Static import of `@/services/pdfExport`. NO dynamic feature-detect.
// CONDUIT-2's pipeline ships unconditionally, so the button is always
// available. (The dynamic-import pattern used in Wave 2's
// ExportMemoButton failed at the @/ alias resolution and left the
// button permanently disabled — explicitly avoided here.)

import { useState } from 'react';
import { C, F, R, S } from '@/design/tokens';
import { exportStorageBidPack } from '@/services/pdfExport';
import type { Fleet, FleetResult } from '@/lib/types/storage';

interface Props {
  fleet: Fleet;
  result: FleetResult;
}

export function ExportBidPackButton({ fleet, result }: Props) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleClick() {
    setError(null);
    try {
      setBusy(true);
      const out = await exportStorageBidPack(fleet, result);
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
            ? 'Generating bid pack…'
            : 'Export the day-ahead bid pack as a PDF for review.'
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
        {busy ? 'Generating…' : 'Export Bid Pack (PDF)'}
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
