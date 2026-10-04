// CONDUIT-2 — PDF export pipeline entry point.
//
// Public API: one function per template, plus utility helpers
// (filename builder, SVG → PNG rasterizer). New templates expose a
// sibling `exportXxx()` function and register themselves in
// `PDF_TEMPLATES`.
//
// Calling convention: positional args, second arg may be a single
// `StrategyResult` OR an array. This matches FORGE's
// `ExportMemoButton.tsx` integration point — that component calls
// `api.exportStrategyMemo(profile, result)` with a singular result —
// while still letting other callers pass a full ranked-strategy list
// for the ranking table.

import { pdf } from '@react-pdf/renderer';
import type { DocumentProps } from '@react-pdf/renderer';
import { createElement } from 'react';
import type { ReactElement } from 'react';
import { StrategyMemoTemplate } from './pdfTemplates/StrategyMemoTemplate';
import { StorageBidPackTemplate } from './pdfTemplates/StorageBidPackTemplate';
import { DeveloperSiteReportTemplate } from './pdfTemplates/DeveloperSiteReportTemplate';
import { AnalystReportTemplate } from './pdfTemplates/AnalystReportTemplate';
import type {
  FacilityProfile,
  ScenarioName,
  StrategyResult,
} from '@/lib/types/simulator';
import type { Fleet, FleetResult } from '@/lib/types/storage';
import type {
  ProjectSpec,
  UnderwritingResults,
} from '@/lib/underwriting/types';
import type { Report, SavedQuery } from '@/lib/analyst/types';
import type {
  PDFDocumentMeta,
  PDFExportOptions,
  PDFExportResult,
} from './pdfTemplates/types';

// ─── Utilities ─────────────────────────────────────────────────────

/** ISO date string (YYYY-MM-DD) for the page-header date stamp. */
function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

/** Sanitize an arbitrary string into a filename-safe slug. */
function slug(s: string): string {
  return (
    s
      .toLowerCase()
      .replace(/[^a-z0-9-]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 60) || 'gridalpha'
  );
}

/** Trigger a browser download for a Blob. Returns the filename used. */
function downloadBlob(blob: Blob, filename: string): string {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  // Defer revoke so iOS Safari has time to start the download.
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  return filename;
}

/**
 * Rasterize an SVG markup string into a PNG data URL using the browser
 * canvas. Templates accept PNG data URLs (not SVG) because
 * `@react-pdf/renderer`'s `<Image>` rasterizes raster formats reliably
 * but doesn't natively render arbitrary SVG. Returns `null` outside a
 * browser environment so callers can fall back to text-only content.
 */
export async function svgStringToPngDataUrl(
  svg: string,
  width: number,
  height: number,
): Promise<string | null> {
  if (typeof document === 'undefined' || typeof Image === 'undefined') {
    return null;
  }
  const blob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const i = new Image();
      i.onload = () => resolve(i);
      i.onerror = () => reject(new Error('Failed to load SVG into Image'));
      i.src = url;
    });
    const canvas = document.createElement('canvas');
    // 2× pixel ratio for crisp rasterization at print scale.
    const scale = 2;
    canvas.width = width * scale;
    canvas.height = height * scale;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;
    ctx.scale(scale, scale);
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, width, height);
    ctx.drawImage(img, 0, 0, width, height);
    return canvas.toDataURL('image/png');
  } catch {
    return null;
  } finally {
    URL.revokeObjectURL(url);
  }
}

// ─── Strategy memo ─────────────────────────────────────────────────

interface ExportStrategyMemoOptions extends PDFExportOptions {
  /** Optional pre-rasterized chart PNG data URLs. The template falls
   *  back to text-only digests when these aren't supplied. */
  chartImages?: { sensitivity?: string; dispatch?: string };
}

/**
 * Export an Industrial Strategy Simulator memo.
 *
 * Calling shape (matches FORGE's `ExportMemoButton` integration):
 *   `exportStrategyMemo(profile, result)` — single strategy
 *   `exportStrategyMemo(profile, results, scenario, options)` — full set
 *
 * Returns `PDFExportResult`; FORGE's button awaits and discards, our
 * own `PDFExportButton` reads `success` and `error` to surface UI.
 */
export async function exportStrategyMemo(
  facilityProfile: FacilityProfile,
  resultOrResults: StrategyResult | StrategyResult[],
  scenario: ScenarioName = 'base',
  options?: ExportStrategyMemoOptions,
): Promise<PDFExportResult> {
  try {
    // Normalize to an array — single result still produces a memo,
    // just with a one-row strategy ranking table.
    const results: StrategyResult[] = Array.isArray(resultOrResults)
      ? resultOrResults
      : [resultOrResults];

    if (results.length === 0) {
      return {
        success: false,
        error: 'exportStrategyMemo requires at least one StrategyResult.',
      };
    }

    const meta: PDFDocumentMeta = {
      documentType: 'STRATEGY MEMO',
      documentTitle: `${facilityProfile.name} · Strategy Analysis`,
      authorName: 'GridAlpha',
      generatedDate: todayIso(),
      facilityName: facilityProfile.name,
      zone: facilityProfile.zone,
      brandLine: 'GridAlpha · PJM Market Intelligence',
      ...options?.meta,
    };

    const element = createElement(StrategyMemoTemplate, {
      facilityProfile,
      results,
      scenarioForCharts: scenario,
      chartImages: options?.chartImages,
      meta,
    });

    // Template renders `<Document>` via `BasePDFTemplate`. TS can't see
    // through the function-component boundary, so we cast at the
    // `pdf()` boundary — this is the only place the assertion is
    // needed and the call is purely structural.
    const blob = await pdf(
      element as unknown as ReactElement<DocumentProps>,
    ).toBlob();
    const filename =
      options?.filename ??
      `gridalpha-strategy-memo-${slug(facilityProfile.name)}-${todayIso()}.pdf`;

    downloadBlob(blob, filename);

    return { success: true, blob, filename };
  } catch (err) {
    const message =
      err instanceof Error ? err.message : 'Unknown PDF export error';
    if (typeof console !== 'undefined') {
      // eslint-disable-next-line no-console
      console.error('[CONDUIT-2] PDF export failed:', err);
    }
    return { success: false, error: message };
  }
}

// ─── Storage bid pack ─────────────────────────────────────────────

interface ExportStorageBidPackOptions extends PDFExportOptions {
  /** Optional pre-rasterized SOC chart PNG data URLs by asset id. */
  chartImages?: { socByAssetId?: Record<string, string> };
}

/**
 * Export a storage operator's day-ahead bid pack as a PDF.
 *
 * The pack covers every asset in the fleet: hourly bid schedule,
 * revenue attribution, optional SOC trajectory chart (if rasterized),
 * sensitivity strip, methodology note, and review-before-submit
 * disclaimer. Mirrors the strategy-memo error/return contract.
 */
export async function exportStorageBidPack(
  fleet: Fleet,
  result: FleetResult,
  options?: ExportStorageBidPackOptions,
): Promise<PDFExportResult> {
  try {
    if (!result || !result.perAssetRanking || result.perAssetRanking.length === 0) {
      return {
        success: false,
        error: 'exportStorageBidPack requires a FleetResult with at least one asset.',
      };
    }

    const meta: PDFDocumentMeta = {
      documentType: 'DA BID PACK',
      documentTitle: `${fleet.operatorName} · Day-Ahead Bid Pack`,
      authorName: 'GridAlpha',
      generatedDate: todayIso(),
      facilityName: fleet.operatorName,
      brandLine: 'GridAlpha · PJM Storage Optimizer',
      ...options?.meta,
    };

    const element = createElement(StorageBidPackTemplate, {
      fleet,
      result,
      meta,
      chartImages: options?.chartImages,
    });

    const blob = await pdf(
      element as unknown as ReactElement<DocumentProps>,
    ).toBlob();
    const filename =
      options?.filename ??
      `gridalpha-bid-pack-${slug(fleet.operatorName)}-${todayIso()}.pdf`;

    downloadBlob(blob, filename);

    return { success: true, blob, filename };
  } catch (err) {
    const message =
      err instanceof Error ? err.message : 'Unknown PDF export error';
    if (typeof console !== 'undefined') {
      // eslint-disable-next-line no-console
      console.error('[FORGE Wave 3] Bid pack export failed:', err);
    }
    return { success: false, error: message };
  }
}

// ─── Developer underwriting memo ──────────────────────────────────

/**
 * Export a Developer/IPP Underwriting Memo as a PDF.
 *
 * Six-page memo: project summary + hero, forward-LMP / CF assumptions,
 * year-by-year cashflows, scenario comparison, PPA + sensitivity
 * tornado, policy + methodology appendix.
 */
export async function exportUnderwritingMemo(
  spec: ProjectSpec,
  results: UnderwritingResults,
  options?: PDFExportOptions,
): Promise<PDFExportResult> {
  try {
    if (!spec || !results) {
      return {
        success: false,
        error: 'exportUnderwritingMemo requires both spec and results.',
      };
    }

    const meta: PDFDocumentMeta = {
      documentType: 'UNDERWRITING MEMO',
      documentTitle: `${spec.name} · Underwriting`,
      authorName: 'GridAlpha',
      generatedDate: todayIso(),
      facilityName: spec.name,
      zone: spec.zone,
      brandLine: 'GridAlpha · Developer/IPP Underwriting',
      ...options?.meta,
    };

    const element = createElement(DeveloperSiteReportTemplate, {
      spec,
      results,
      meta,
    });

    const blob = await pdf(
      element as unknown as ReactElement<DocumentProps>,
    ).toBlob();
    const filename =
      options?.filename ??
      `gridalpha-underwriting-memo-${slug(spec.name)}-${todayIso()}.pdf`;

    downloadBlob(blob, filename);

    return { success: true, blob, filename };
  } catch (err) {
    const message =
      err instanceof Error ? err.message : 'Unknown PDF export error';
    if (typeof console !== 'undefined') {
      // eslint-disable-next-line no-console
      console.error('[FORGE Wave 5] Underwriting memo export failed:', err);
    }
    return { success: false, error: message };
  }
}

// ─── Analyst research note ─────────────────────────────────────────

/**
 * Export an Analyst research note as a PDF.
 *
 * The report's sections (heading, commentary, query-result) render as
 * a newspaper-style single-column PDF. Query-result sections embed
 * the matching SavedQuery's `lastResult` as a table; chart-display
 * sections fall back to the same table in V1 (no SVG rasterizer).
 */
export async function exportAnalystReport(
  report: Report,
  savedQueries: SavedQuery[],
  options?: PDFExportOptions,
): Promise<PDFExportResult> {
  try {
    if (!report) {
      return { success: false, error: 'exportAnalystReport requires a Report.' };
    }

    const meta: PDFDocumentMeta = {
      documentType: 'RESEARCH NOTE',
      documentTitle: report.title,
      authorName: report.authorName || 'GridAlpha',
      generatedDate: todayIso(),
      brandLine: 'GridAlpha · Analyst Research',
      ...options?.meta,
    };

    const element = createElement(AnalystReportTemplate, {
      report,
      savedQueries,
      meta,
    });
    const blob = await pdf(
      element as unknown as ReactElement<DocumentProps>,
    ).toBlob();
    const filename =
      options?.filename ??
      `gridalpha-analyst-${slug(report.title)}-${todayIso()}.pdf`;
    downloadBlob(blob, filename);
    return { success: true, blob, filename };
  } catch (err) {
    const message =
      err instanceof Error ? err.message : 'Unknown PDF export error';
    if (typeof console !== 'undefined') {
      // eslint-disable-next-line no-console
      console.error('[FORGE Wave 6] Analyst report export failed:', err);
    }
    return { success: false, error: message };
  }
}

// ─── Template registry ─────────────────────────────────────────────

/**
 * Map of available template export functions. New templates register
 * here so dev tooling and any future "export from anywhere" UI can
 * list them without each caller knowing the function names.
 */
export const PDF_TEMPLATES = {
  strategyMemo: exportStrategyMemo,
  storageBidPack: exportStorageBidPack,
  underwritingMemo: exportUnderwritingMemo,
  analystReport: exportAnalystReport,
  // Future:
  //   traderBrief: exportTraderBrief,
} as const;

export type PDFTemplateKey = keyof typeof PDF_TEMPLATES;
