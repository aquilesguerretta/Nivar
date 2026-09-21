import { useState } from 'react';
import { C, F, R, S } from '@/design/tokens';
import type { PDFExportResult } from '@/services/pdfTemplates/types';

// CONDUIT-2 — reusable export button.
// Surfaces (Industrial simulator, Analyst report, Trader brief, etc.)
// pass a single `onExport` async function that produces a
// `PDFExportResult`. The button manages loading and error UI in-place
// so callers don't have to.

interface Props {
  onExport: () => Promise<PDFExportResult>;
  label?: string;
  /** Compact 28px-tall variant for use inside dense card chrome. */
  size?: 'default' | 'compact';
  disabled?: boolean;
}

export function PDFExportButton({
  onExport,
  label = 'Export to PDF',
  size = 'default',
  disabled = false,
}: Props) {
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hover, setHover] = useState(false);

  const handleClick = async () => {
    setIsExporting(true);
    setError(null);
    try {
      const result = await onExport();
      if (!result.success) {
        setError(result.error ?? 'Export failed');
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unexpected error');
    } finally {
      setIsExporting(false);
    }
  };

  const isDisabled = disabled || isExporting;

  const height = size === 'compact' ? 28 : 36;
  const paddingY = size === 'compact' ? S.xs : S.sm;
  const paddingX = size === 'compact' ? S.md : S.lg;

  return (
    <div style={{ display: 'inline-flex', flexDirection: 'column', gap: S.xs }}>
      <button
        type="button"
        onClick={handleClick}
        disabled={isDisabled}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: S.xs,
          height,
          padding: `${paddingY} ${paddingX}`,
          background: isDisabled
            ? C.electricBlueWash
            : hover
              ? C.electricBlueLight
              : C.electricBlue,
          color: isDisabled ? C.textMuted : C.textPrimary,
          border: 'none',
          borderRadius: R.md,
          fontFamily: F.mono,
          fontSize: 11,
          fontWeight: 600,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          cursor: isDisabled ? 'not-allowed' : 'pointer',
          transition:
            'background-color 150ms cubic-bezier(0.4, 0, 0.2, 1), color 150ms cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        {isExporting && <Spinner />}
        <span>{isExporting ? 'Generating…' : label}</span>
      </button>
      {error && (
        <span
          role="alert"
          style={{
            fontFamily: F.sans,
            fontSize: 11,
            color: C.alertCritical,
            lineHeight: 1.4,
          }}
        >
          {error}
        </span>
      )}
    </div>
  );
}

function Spinner() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      style={{
        animation: 'conduit2-spin 800ms linear infinite',
      }}
      aria-hidden
    >
      <path d="M12 3a9 9 0 0 1 9 9" />
      <style>{`@keyframes conduit2-spin { to { transform: rotate(360deg); } }`}</style>
    </svg>
  );
}
