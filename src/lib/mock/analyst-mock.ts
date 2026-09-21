// FOUNDRY mock — Analyst Nest data.
// Comparison series, saved queries, annotations, correlation matrix,
// seasonal pattern, anomaly detections.

export interface AnalystSavedQuery {
  id: string;
  name: string;
  savedAt: string;
}

export interface AnalystAnnotation {
  id: string;
  text: string;
  chartRef: string;
  timestamp: string;
}

export interface AnalystAnomalyDetection {
  date: string;
  sigma: number;
  zone: string;
  description: string;
}

// 90-day deterministic daily series.
const buildDaily = (base: number, amp: number, phase: number, seed: number): number[] => {
  const out: number[] = [];
  for (let i = 0; i < 90; i++) {
    const seasonal = Math.sin((i / 90) * Math.PI * 2 + phase) * amp;
    const noise = (((seed + i * 7) % 11) - 5) * 0.4;
    out.push(Number((base + seasonal + noise).toFixed(2)));
  }
  return out;
};

export const COMPARISON_SERIES = {
  zoneA: { key: 'PSEG',     label: 'PSEG',     daily: buildDaily(34.5, 4.5, 0.0, 13) },
  zoneB: { key: 'WEST_HUB', label: 'WEST HUB', daily: buildDaily(33.2, 3.8, 0.5, 29) },
};

export const SAVED_QUERIES: AnalystSavedQuery[] = [
  { id: 'sq-001', name: 'PSEG basis vs WEST HUB',         savedAt: '2026-04-18' },
  { id: 'sq-002', name: 'COMED neg-pricing windows',       savedAt: '2026-04-12' },
  { id: 'sq-003', name: 'AEP coal retirement impact',      savedAt: '2026-03-30' },
  { id: 'sq-004', name: 'DOMINION load growth signal',     savedAt: '2026-03-22' },
  { id: 'sq-005', name: 'RECO interface congestion',       savedAt: '2026-02-14' },
  { id: 'sq-006', name: 'PJM-wide spark spread, 4-hour',   savedAt: '2026-01-08' },
];

export const ANNOTATIONS: AnalystAnnotation[] = [
  { id: 'an-001', text: 'Q1 cold snap — Feb 14 polar vortex tail.', chartRef: 'pseg-90d',     timestamp: '2026-02-14T07:00:00Z' },
  { id: 'an-002', text: 'Peach Bottom maintenance outage begins.',  chartRef: 'west-hub-90d', timestamp: '2026-03-08T00:00:00Z' },
  { id: 'an-003', text: 'PJM capacity auction results published.',  chartRef: 'pseg-90d',     timestamp: '2026-03-21T16:30:00Z' },
  { id: 'an-004', text: 'COMED wind ramp event — 1.8 GW in 90 min.', chartRef: 'comed-vol',    timestamp: '2026-04-11T03:15:00Z' },
];

// 5×5 correlation matrix in fixed row/col order:
// rows/cols = ['WEST_HUB', 'AEP', 'PSEG', 'COMED', 'RECO']
export const CORRELATION_ZONES = ['WEST_HUB', 'AEP', 'PSEG', 'COMED', 'RECO'] as const;

export const CORRELATION_MATRIX: number[][] = [
  [1.00, 0.68, 0.82, 0.49, 0.74],
  [0.68, 1.00, 0.55, 0.62, 0.59],
  [0.82, 0.55, 1.00, 0.41, 0.71],
  [0.49, 0.62, 0.41, 1.00, 0.38],
  [0.74, 0.59, 0.71, 0.38, 1.00],
];

export const SEASONAL_PATTERN: number[] = [
  41.2, 38.9, 33.4, 30.1, 31.8, 38.6,
  46.3, 47.1, 38.4, 32.6, 34.2, 39.8,
];

export const ANOMALY_DETECTIONS: AnalystAnomalyDetection[] = [
  { date: '2026-04-25', sigma: 4.2,  zone: 'RECO',     description: 'LMP printed $58.40 vs 24h avg $36.60.' },
  { date: '2026-04-25', sigma: 3.6,  zone: 'PSEG',     description: 'DA-RT spread reached $6.83 vs $1.50 baseline.' },
  { date: '2026-04-25', sigma: 2.9,  zone: 'COMED',    description: 'Wind output 6.4 GW vs 4.1 GW expected during overnight ramp.' },
  { date: '2026-04-25', sigma: -3.1, zone: 'AEP',      description: 'Reserve margin 11.2% vs 19.6% mean — 14-month low.' },
  { date: '2026-04-24', sigma: 2.4,  zone: 'DOMINION', description: 'Mid-day load 19.84 GW vs 17.9 GW forecast — data-center signal.' },
];

// ─── FORGE Wave 6 — report templates ─────────────────────────────
//
// Seed report templates surfaced by ReportTemplateLibrary. Each
// template's sections use placeholder ids that ReportEditor re-keys
// on instantiation. Query-result sections reference `savedQueryId`
// strings the analyst hooks up after creating the report (the editor
// shows a "Pick a saved query" prompt when the id doesn't resolve).

import type {
  ReportSection,
  ReportTemplate,
} from '@/lib/analyst/types';

function tplId(prefix: string, i: number): string {
  return `${prefix}-${i}`;
}

const WEEKLY_PJM_REVIEW_SECTIONS: ReportSection[] = [
  { id: tplId('wk', 1), kind: 'heading', text: 'Top stories of the week', level: 1 },
  {
    id: tplId('wk', 2),
    kind: 'commentary',
    body: 'Lead with the **single most-important** market move this week. ' +
      'A storm? An outage? A negative-LMP run? Keep this to two sentences and ' +
      'cite the metric you used to surface it.',
  },
  { id: tplId('wk', 3), kind: 'heading', text: 'LMP performance', level: 2 },
  {
    id: tplId('wk', 4),
    kind: 'query-result',
    savedQueryId: '',
    display: 'table',
    caption: 'Top-N LMP hours by zone — fill in with a saved query.',
  },
  { id: tplId('wk', 5), kind: 'heading', text: 'Fuel mix shifts', level: 2 },
  {
    id: tplId('wk', 6),
    kind: 'commentary',
    body: 'Note any structural shift in marginal fuel mix. Pair with a ' +
      '*fuel-mix-pct* query if useful.',
  },
  { id: tplId('wk', 7), kind: 'heading', text: 'Outage commentary', level: 2 },
  {
    id: tplId('wk', 8),
    kind: 'commentary',
    body: 'Surface any > 500 MW outage that materially moved settles.',
  },
];

const STORM_POSTMORTEM_SECTIONS: ReportSection[] = [
  { id: tplId('storm', 1), kind: 'heading', text: 'Storm postmortem', level: 1 },
  {
    id: tplId('storm', 2),
    kind: 'commentary',
    body: 'Set the frame: which storm, dates affected, region. Reference the ' +
      'Atlas time-travel snapshot if available.',
  },
  { id: tplId('storm', 3), kind: 'heading', text: 'Peak hour analysis', level: 2 },
  {
    id: tplId('storm', 4),
    kind: 'query-result',
    savedQueryId: '',
    display: 'chart',
    caption: 'Peak LMP × hour across affected zones.',
  },
  { id: tplId('storm', 5), kind: 'heading', text: 'Fuel response', level: 2 },
  {
    id: tplId('storm', 6),
    kind: 'commentary',
    body: 'Which fuels picked up the slack? Any unusual peakers online? ' +
      'Did renewables outperform or under-deliver vs forecast?',
  },
  { id: tplId('storm', 7), kind: 'heading', text: 'Lessons', level: 2 },
  {
    id: tplId('storm', 8),
    kind: 'commentary',
    body: '*Three to five bullets* — what we should price into the next ' +
      'forward curve, what hedges held up, what didn\'t.',
  },
];

const CAPACITY_OUTLOOK_SECTIONS: ReportSection[] = [
  { id: tplId('cap', 1), kind: 'heading', text: 'Monthly capacity outlook', level: 1 },
  {
    id: tplId('cap', 2),
    kind: 'commentary',
    body: 'Open with the headline: is the system tighter or looser than last ' +
      'month? Quote the reserve-margin trend in one sentence.',
  },
  { id: tplId('cap', 3), kind: 'heading', text: 'Reserve margin trend', level: 2 },
  {
    id: tplId('cap', 4),
    kind: 'query-result',
    savedQueryId: '',
    display: 'chart',
    caption: 'Reserve margin × day — last 30 days.',
  },
  { id: tplId('cap', 5), kind: 'heading', text: 'Top outages', level: 2 },
  {
    id: tplId('cap', 6),
    kind: 'commentary',
    body: 'Highlight outages > 800 MW that may not return before the next ' +
      'capacity window.',
  },
  { id: tplId('cap', 7), kind: 'heading', text: 'Forward signals', level: 2 },
  {
    id: tplId('cap', 8),
    kind: 'commentary',
    body: 'What does the forward curve imply about clearing prices in the ' +
      'next BRA window? Any structural changes to flag?',
  },
];

export const REPORT_TEMPLATES: ReportTemplate[] = [
  {
    id: 'tpl-weekly-pjm-review',
    name: 'Weekly PJM Review',
    description:
      'Four-section weekly recap: top stories, LMP performance, fuel-mix shifts, outage commentary.',
    sections: WEEKLY_PJM_REVIEW_SECTIONS,
  },
  {
    id: 'tpl-storm-postmortem',
    name: 'Storm Postmortem',
    description:
      'Storm-specific deep-dive: setting, peak analysis, fuel response, lessons learned.',
    sections: STORM_POSTMORTEM_SECTIONS,
  },
  {
    id: 'tpl-monthly-capacity-outlook',
    name: 'Monthly Capacity Outlook',
    description:
      'Reserve margin trend, top outages worth flagging, and forward-curve implications for the next BRA.',
    sections: CAPACITY_OUTLOOK_SECTIONS,
  },
];
