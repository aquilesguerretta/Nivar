// FORGE Wave 6 — Report renderer.
//
// Thin façade over CONDUIT-2's `exportAnalystReport` pipeline. The
// brief calls out `reportRenderer.ts` as the orchestrator the
// PublishReportButton invokes; we keep that module identifier stable
// so future replacements (e.g. server-side rendering) don't ripple
// through every consumer.

import { exportAnalystReport } from '@/services/pdfExport';
import type { Report, SavedQuery } from './types';

export interface RenderReportPDFOptions {
  /** Override the auto-generated filename. */
  filename?: string;
}

export interface RenderReportPDFResult {
  success: boolean;
  filename?: string;
  /** Optional shareable URL (V1: localStorage-hash fallback). */
  shareUrl?: string;
  error?: string;
}

/**
 * Produce a PDF for the given report. Returns success/filename plus an
 * optional `shareUrl` — V1 is a `localStorage://` placeholder
 * resolved by `buildShareUrl` below; a future Cursor wave swaps it
 * for an actual upload to a shareable URL.
 */
export async function renderReportPDF(
  report: Report,
  savedQueries: SavedQuery[],
  options: RenderReportPDFOptions = {},
): Promise<RenderReportPDFResult> {
  const pdfRes = await exportAnalystReport(report, savedQueries, {
    filename: options.filename,
  });
  if (!pdfRes.success) {
    return { success: false, error: pdfRes.error };
  }
  const shareUrl = buildShareUrl(report);
  return {
    success: true,
    filename: pdfRes.filename,
    shareUrl,
  };
}

/**
 * V1 shareable URL: a deterministic localStorage hash. The Analyst Nest
 * surfaces it as copyable for now; a future backend wave swaps it for
 * a real upload + signed link.
 */
function buildShareUrl(report: Report): string {
  return `localstorage://gridalpha/analyst/report/${report.id}`;
}
