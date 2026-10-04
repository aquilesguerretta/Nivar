// FORGE Wave 5 — Developer/IPP Underwriting Memo template.
//
// 6-page board-ready memo:
//   1. Project summary + IRR/NPV/Breakeven hero
//   2. Forward LMP + capacity factor assumptions
//   3. Cashflow table (year-by-year)
//   4. Scenario comparison table
//   5. PPA benchmark + sensitivity tornado
//   6. Policy eligibility + methodology appendix
//
// Mirrors the StrategyMemoTemplate / StorageBidPackTemplate structure
// so the visual language matches across exporters.

import { View, Text } from '@react-pdf/renderer';
import { BasePDFTemplate } from './BasePDFTemplate';
import { PDFEyebrow } from './components/PDFEyebrow';
import { PDFHeading } from './components/PDFHeading';
import { PDFBody, PDFBulletList } from './components/PDFBody';
import { PDFTable } from './components/PDFTable';
import type { PDFTableColumn } from './components/PDFTable';
import { PDFMetricCallout } from './components/PDFMetricCallout';
import type { PDFDocumentMeta } from './types';
import type {
  ProjectSpec,
  UnderwritingResults,
} from '@/lib/underwriting/types';

interface Props {
  spec: ProjectSpec;
  results: UnderwritingResults;
  meta: PDFDocumentMeta;
}

function formatUSD(v: number): string {
  if (!Number.isFinite(v)) return '—';
  const sign = v < 0 ? '−' : '';
  const abs = Math.abs(v);
  if (abs >= 1_000_000_000) return `${sign}$${(abs / 1_000_000_000).toFixed(2)}B`;
  if (abs >= 1_000_000) return `${sign}$${(abs / 1_000_000).toFixed(2)}M`;
  if (abs >= 1_000) return `${sign}$${(abs / 1_000).toFixed(0)}k`;
  return `${sign}$${abs.toFixed(0)}`;
}

function formatPct(v: number): string {
  if (!Number.isFinite(v)) return '—';
  return `${(v * 100).toFixed(1)}%`;
}

export function DeveloperSiteReportTemplate({ spec, results, meta }: Props) {
  const base = results.scenarios.base;
  return (
    <BasePDFTemplate meta={meta}>
      <Page1Summary spec={spec} results={results} />
      <Page2Assumptions spec={spec} results={results} />
      <Page3Cashflows results={results} />
      <Page4Scenarios spec={spec} results={results} />
      <Page5PPAandTornado spec={spec} results={results} />
      <Page6PolicyMethodology spec={spec} results={results} baseIRR={base.irr} />
      {/* keep `Text` import referenced for templates that need raw text */}
      <View style={{ display: 'none' }}>
        <Text>{spec.name}</Text>
      </View>
    </BasePDFTemplate>
  );
}

// ─── Page 1: Project summary + hero ──────────────────────────────

function Page1Summary({ spec, results }: { spec: ProjectSpec; results: UnderwritingResults }) {
  const base = results.scenarios.base;
  const specCols: PDFTableColumn[] = [
    { label: 'FIELD', flex: 1.2 },
    { label: 'VALUE', flex: 1, align: 'right' },
  ];
  const specRows: (string | number)[][] = [
    ['Project', spec.name],
    ['Technology', spec.technology],
    ['Capacity', `${spec.capacityMW} MW`],
    ['Zone', spec.zone],
    ['COD year', String(spec.codYear)],
    ['Economic life', `${spec.economicLifeYears} yr`],
    ['Capex (total)', formatUSD(spec.capacityMW * spec.capexPerMW)],
    ['Debt ratio', `${(spec.debtRatio * 100).toFixed(0)}%`],
    ['Hurdle rate', `${(spec.discountRate * 100).toFixed(1)}%`],
  ];

  return (
    <View>
      <PDFEyebrow variant="hero">UNDERWRITING MEMO · BASE CASE</PDFEyebrow>
      <PDFHeading level={1}>{spec.name}</PDFHeading>
      <PDFHeading level={3} subtitle>
        {spec.technology} · {spec.capacityMW} MW · {spec.zone} · COD {spec.codYear}
      </PDFHeading>

      <View style={{ flexDirection: 'row', gap: 8, marginTop: 14 }}>
        <PDFMetricCallout
          label="EQUITY IRR (BASE)"
          value={formatPct(base.irr)}
          tone={base.irr >= spec.discountRate ? 'positive' : 'negative'}
        />
        <PDFMetricCallout
          label="EQUITY NPV (BASE)"
          value={formatUSD(base.npvUSD)}
          tone={base.npvUSD >= 0 ? 'positive' : 'negative'}
        />
        <PDFMetricCallout
          label="BREAKEVEN LMP"
          value={`$${base.breakevenLMPPerMWh.toFixed(2)}/MWh`}
          tone="neutral"
        />
      </View>

      <View style={{ marginTop: 18 }}>
        <PDFEyebrow>PROJECT SPECIFICATION</PDFEyebrow>
        <PDFTable columns={specCols} rows={specRows} />
      </View>
    </View>
  );
}

// ─── Page 2: Assumptions ─────────────────────────────────────────

function Page2Assumptions({ spec, results }: { spec: ProjectSpec; results: UnderwritingResults }) {
  const a = results.assumptions;
  const cols: PDFTableColumn[] = [
    { label: 'ASSUMPTION', flex: 1.2 },
    { label: 'VALUE', flex: 1, align: 'right' },
  ];
  const rows: (string | number)[][] = [
    ['Mean forward LMP', `$${a.meanForwardLMP.toFixed(2)}/MWh`],
    ['Lifetime average CF', formatPct(a.lifetimeAvgCF)],
    ['Total capex', formatUSD(a.totalCapexUSD)],
    ['Equity contribution', formatUSD(a.equityCapexUSD)],
    ['Annual debt service', formatUSD(a.annualDebtServiceUSD)],
    ['Debt rate', `${(spec.debtRate * 100).toFixed(2)}%`],
    ['Debt tenor', `${spec.debtTenor} yr`],
    ['ITC rate', formatPct(a.itcRate)],
    ['PTC ($/MWh)', `$${a.ptcPerMWh.toFixed(2)}`],
    ['Capacity payment', `$${a.capacityPerMWYear.toLocaleString()}/MW-yr`],
    ['Tax rate', formatPct(spec.taxRate)],
  ];

  return (
    <View break style={{ marginTop: 18 }}>
      <PDFEyebrow>ASSUMPTIONS</PDFEyebrow>
      <PDFHeading level={2}>Forward LMP and capacity factor</PDFHeading>
      <PDFBody>
        Forward LMP curve derived from `ZONE_REVENUE_HISTORY_24M` with{' '}
        2.5%/yr escalation and long-run blend to $55/MWh. Capacity factor
        is technology base × zone tilt × monthly seasonality × linear
        degradation. Live PJM forward-market data is not yet wired —
        when it ships, the engine prefers live values for the early
        years and falls back to this synthetic curve later.
      </PDFBody>
      <View style={{ marginTop: 8 }}>
        <PDFTable columns={cols} rows={rows} />
      </View>
    </View>
  );
}

// ─── Page 3: Cashflow table ──────────────────────────────────────

function Page3Cashflows({ results }: { results: UnderwritingResults }) {
  const base = results.scenarios.base;
  const cols: PDFTableColumn[] = [
    { label: 'YR', flex: 0.5, align: 'right' },
    { label: 'REVENUE', flex: 1.0, align: 'right' },
    { label: 'OPEX', flex: 0.9, align: 'right' },
    { label: 'DEBT', flex: 0.9, align: 'right' },
    { label: 'TAX', flex: 0.9, align: 'right' },
    { label: 'CREDITS', flex: 0.9, align: 'right' },
    { label: 'EQUITY CF', flex: 1.1, align: 'right' },
    { label: 'CUMUL.', flex: 1.1, align: 'right' },
  ];
  const rows: (string | number)[][] = base.cashflows.map((c) => [
    c.year,
    formatUSD(c.revenueUSD + c.capacityRevenueUSD),
    formatUSD(-c.opexUSD),
    formatUSD(-c.debtServiceUSD),
    formatUSD(-c.taxesUSD),
    formatUSD(c.itcCreditUSD + c.ptcCreditUSD),
    formatUSD(c.equityCashflowUSD),
    formatUSD(c.cumulativeEquityCFUSD),
  ]);

  return (
    <View break style={{ marginTop: 18 }}>
      <PDFEyebrow>CASHFLOWS · BASE CASE</PDFEyebrow>
      <PDFHeading level={2}>Year-by-year equity cashflow</PDFHeading>
      <PDFBody>
        Yr 0 reflects the equity contribution at financial close. Revenue
        is the sum of energy and capacity-market revenue. Credits column
        combines ITC (Year 1 only) and PTC (Years 1–10 if eligible).
      </PDFBody>
      <View style={{ marginTop: 8 }}>
        <PDFTable columns={cols} rows={rows} />
      </View>
    </View>
  );
}

// ─── Page 4: Scenario comparison ─────────────────────────────────

function Page4Scenarios({
  spec,
  results,
}: {
  spec: ProjectSpec;
  results: UnderwritingResults;
}) {
  const cols: PDFTableColumn[] = [
    { label: 'METRIC', flex: 1.2 },
    { label: 'BASE', flex: 1, align: 'right' },
    { label: 'UPSIDE', flex: 1, align: 'right' },
    { label: 'DOWNSIDE', flex: 1, align: 'right' },
  ];
  const base = results.scenarios.base;
  const up = results.scenarios.upside;
  const dn = results.scenarios.downside;
  const rows: (string | number)[][] = [
    ['IRR', formatPct(base.irr), formatPct(up.irr), formatPct(dn.irr)],
    ['NPV', formatUSD(base.npvUSD), formatUSD(up.npvUSD), formatUSD(dn.npvUSD)],
    [
      'Breakeven $/MWh',
      `$${base.breakevenLMPPerMWh.toFixed(2)}`,
      `$${up.breakevenLMPPerMWh.toFixed(2)}`,
      `$${dn.breakevenLMPPerMWh.toFixed(2)}`,
    ],
    [
      'Payback (yr)',
      base.paybackYears === null ? 'never' : base.paybackYears.toFixed(1),
      up.paybackYears === null ? 'never' : up.paybackYears.toFixed(1),
      dn.paybackYears === null ? 'never' : dn.paybackYears.toFixed(1),
    ],
  ];

  return (
    <View break style={{ marginTop: 18 }}>
      <PDFEyebrow>SCENARIO COMPARISON</PDFEyebrow>
      <PDFHeading level={2}>Base / Upside / Downside</PDFHeading>
      <PDFBody>
        Upside: LMP +20%, CF +2pp, capex −8%. Downside: LMP −25%, CF −3pp,
        capex +8%, ITC expiry. Target IRR for {spec.technology.toLowerCase()}:{' '}
        {formatPct(spec.discountRate)}.
      </PDFBody>
      <View style={{ marginTop: 8 }}>
        <PDFTable columns={cols} rows={rows} />
      </View>
    </View>
  );
}

// ─── Page 5: PPA + Tornado ───────────────────────────────────────

function Page5PPAandTornado({
  spec,
  results,
}: {
  spec: ProjectSpec;
  results: UnderwritingResults;
}) {
  const ppa = results.ppaBenchmark;
  const base = results.scenarios.base;
  const spread = ppa.median - base.breakevenLMPPerMWh;
  const tornadoCols: PDFTableColumn[] = [
    { label: 'LEVER', flex: 1.4 },
    { label: 'Δ DOWN', flex: 1, align: 'right' },
    { label: 'Δ UP', flex: 1, align: 'right' },
  ];
  const tornadoRows: (string | number)[][] = results.sensitivity.map((e) => [
    e.label,
    `${e.irrDeltaDown >= 0 ? '+' : '−'}${(Math.abs(e.irrDeltaDown) * 100).toFixed(1)}pp`,
    `${e.irrDeltaUp >= 0 ? '+' : '−'}${(Math.abs(e.irrDeltaUp) * 100).toFixed(1)}pp`,
  ]);

  return (
    <View break style={{ marginTop: 18 }}>
      <PDFEyebrow>PPA BENCHMARK</PDFEyebrow>
      <PDFHeading level={2}>
        Breakeven vs market PPA · {spec.technology}
      </PDFHeading>
      <View style={{ flexDirection: 'row', gap: 8, marginTop: 10 }}>
        <PDFMetricCallout label="PPA FLOOR" value={`$${ppa.floor.toFixed(2)}`} tone="neutral" />
        <PDFMetricCallout label="PPA MEDIAN" value={`$${ppa.median.toFixed(2)}`} tone="neutral" />
        <PDFMetricCallout label="PPA CEILING" value={`$${ppa.ceiling.toFixed(2)}`} tone="neutral" />
        <PDFMetricCallout
          label="SPREAD vs MEDIAN"
          value={`${spread >= 0 ? '+' : '−'}$${Math.abs(spread).toFixed(2)}`}
          tone={spread >= 0 ? 'positive' : 'negative'}
        />
      </View>
      <PDFBody>
        Sample size: {ppa.sampleCount} {ppa.technology} PPAs from
        PJM-footprint developers (counterparty-disclosed).
      </PDFBody>

      <View style={{ marginTop: 18 }}>
        <PDFEyebrow>SENSITIVITY TORNADO</PDFEyebrow>
        <PDFHeading level={2}>IRR delta by lever</PDFHeading>
        <PDFTable columns={tornadoCols} rows={tornadoRows} />
      </View>
    </View>
  );
}

// ─── Page 6: Policy + methodology ────────────────────────────────

function Page6PolicyMethodology({
  spec,
  results,
  baseIRR,
}: {
  spec: ProjectSpec;
  results: UnderwritingResults;
  baseIRR: number;
}) {
  const a = results.assumptions;
  const policy = results.scenarios.base.policyAttribution;
  return (
    <View break style={{ marginTop: 18 }}>
      <PDFEyebrow>POLICY ELIGIBILITY</PDFEyebrow>
      <PDFHeading level={2}>
        Tax credits and capacity-market value
      </PDFHeading>
      <PDFBulletList
        items={[
          `ITC: ${formatPct(a.itcRate)} of total capex (${spec.itcEligible ? 'eligible' : 'not elected'}). Realized in Year 1.`,
          `PTC: $${a.ptcPerMWh.toFixed(2)}/MWh (${spec.ptcEligible ? 'eligible' : 'not elected'}). Years 1–10.`,
          `Capacity payment: $${a.capacityPerMWYear.toLocaleString()}/MW-yr × ${spec.capacityMW} MW = $${(a.capacityPerMWYear * spec.capacityMW).toLocaleString()}/yr.`,
          `Discounted value attribution: base energy ${formatUSD(policy.baseEnergyNPVUSD)} + ITC ${formatUSD(policy.itcValueUSD)} + PTC ${formatUSD(policy.ptcValueUSD)} + capacity ${formatUSD(policy.capacityValueUSD)}.`,
        ]}
      />

      <View style={{ marginTop: 18 }}>
        <PDFEyebrow>METHODOLOGY APPENDIX</PDFEyebrow>
        <PDFHeading level={2}>How these numbers were computed</PDFHeading>
        <PDFBulletList items={a.notes} />
        <PDFBody>
          Base IRR computed via Newton's method with bisection fallback on
          the equity cashflow stream. NPV at the spec's discount rate.
          Breakeven LMP solves for the price level that brings equity NPV
          to zero, holding all other levers constant. Solver assumes
          linear revenue-in-LMP and equity-share = (1 − tax rate).
        </PDFBody>
      </View>

      <View style={{ marginTop: 18 }}>
        <PDFEyebrow>DISCLAIMER</PDFEyebrow>
        <PDFBody>
          This memo is a decision-support artifact, not investment
          advice. Forward LMP, capacity factor, and policy assumptions
          are mid-2026 industry medians; real outcomes vary with market
          conditions, technology vintage, and legislative change.
          GridAlpha is not a registered investment advisor.
        </PDFBody>
        <PDFBody>
          Base IRR shown:{' '}
          {Number.isFinite(baseIRR) ? formatPct(baseIRR) : '—'}.
        </PDFBody>
      </View>
    </View>
  );
}
