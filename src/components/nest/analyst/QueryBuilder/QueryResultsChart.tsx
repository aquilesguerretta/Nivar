// FORGE Wave 6 — QueryResultsChart.
//
// Auto-infers chart type from the result schema:
//   - one numeric metric × one numeric/time dimension → line chart
//   - one numeric metric × one categorical dimension  → bar chart
//   - two dimensions (one categorical, one numeric)   → grouped bar
//   - anything else (degenerate) → falls back to a bar of the first
//     metric vs the first dimension
//
// Wrapped in AnnotatableChart so analysts can pin notes to specific
// data points.

import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Legend,
} from 'recharts';
import { C, F, R, S } from '@/design/tokens';
import { AnnotatableChart } from '@/components/shared/AnnotatableChart';
import type { ColumnSchema, QueryResult } from '@/lib/analyst/types';

interface Props {
  result: QueryResult;
  /** Chart container id — used by AnnotatableChart for note targeting. */
  chartId: string;
}

type ChartKind = 'line' | 'bar' | 'grouped-bar';

interface ChartPlan {
  kind: ChartKind;
  xKey: string;
  xLabel: string;
  yKeys: string[];
  yLabels: string[];
}

function inferChartPlan(result: QueryResult): ChartPlan {
  const dimCols = result.schema.filter((c) => c.type !== 'number' || c.key === 'time-of-day' || c.key === 'date' || c.key === 'month');
  const metricCols = result.schema.filter(
    (c) => c.type === 'number' && c.key !== 'time-of-day' && c.key !== 'date' && c.key !== 'month',
  );
  const firstDim = dimCols[0] ?? result.schema[0];
  const firstMetric = metricCols[0] ?? result.schema[result.schema.length - 1];

  // Two dimensions × one metric → grouped bar: x = first dim, series = unique values of second dim.
  if (dimCols.length >= 2 && metricCols.length >= 1) {
    return {
      kind: 'grouped-bar',
      xKey: firstDim.key,
      xLabel: firstDim.label,
      yKeys: [firstMetric.key],
      yLabels: [firstMetric.label],
    };
  }
  // One dim × one metric: line if the dim is numeric/time-like, bar otherwise.
  const isNumericDim =
    firstDim.key === 'time-of-day' ||
    firstDim.key === 'date' ||
    firstDim.key === 'month' ||
    firstDim.type === 'number';
  return {
    kind: isNumericDim ? 'line' : 'bar',
    xKey: firstDim.key,
    xLabel: firstDim.label,
    yKeys: [firstMetric.key],
    yLabels: [firstMetric.label],
  };
}

function formatTickNumber(v: number, col?: ColumnSchema): string {
  if (col?.format?.startsWith('$')) return `$${v.toFixed(0)}`;
  if (col?.format?.includes('%')) return `${v.toFixed(0)}%`;
  return v.toLocaleString(undefined, { maximumFractionDigits: 1 });
}

export function QueryResultsChart({ result, chartId }: Props) {
  if (result.rows.length === 0) {
    return (
      <div
        style={{
          padding: S.lg,
          fontFamily: F.mono,
          fontSize: 12,
          color: C.textMuted,
          textAlign: 'center',
        }}
      >
        No data to chart.
      </div>
    );
  }

  const plan = inferChartPlan(result);
  const data = result.rows.map((row) => {
    const out: Record<string, string | number | null> = {};
    out[plan.xKey] = row[plan.xKey];
    for (const yk of plan.yKeys) out[yk] = row[yk];
    return out;
  });
  const metricCol = result.schema.find((c) => c.key === plan.yKeys[0]);

  const sharedTooltip = (
    <Tooltip
      cursor={
        plan.kind === 'line'
          ? { stroke: C.borderStrong, strokeDasharray: '2 4' }
          : { fill: 'rgba(255,255,255,0.04)' }
      }
      contentStyle={{
        background: C.bgElevated,
        border: `1px solid ${C.borderStrong}`,
        borderRadius: R.md,
        fontFamily: F.mono,
        fontSize: 11,
        color: C.textPrimary,
      }}
      labelStyle={{ color: C.textMuted }}
      formatter={(value, name) => {
        const n = typeof value === 'number' ? value : Number(value);
        if (!Number.isFinite(n)) return [String(value), String(name)];
        return [formatTickNumber(n, metricCol), String(name)];
      }}
    />
  );

  const sharedAxes = (
    <>
      <CartesianGrid stroke={C.borderDefault} vertical={false} />
      <XAxis
        dataKey={plan.xKey}
        stroke={C.textMuted}
        tick={{ fontFamily: F.mono, fontSize: 10, fill: C.textMuted }}
        tickMargin={6}
        interval={plan.kind === 'line' ? 'preserveStartEnd' : 0}
      />
      <YAxis
        stroke={C.textMuted}
        tick={{ fontFamily: F.mono, fontSize: 10, fill: C.textMuted }}
        tickFormatter={(v: number) => formatTickNumber(v, metricCol)}
        width={72}
      />
    </>
  );

  return (
    <AnnotatableChart chartId={chartId}>
      <div style={{ height: 280 }}>
        <ResponsiveContainer>
          {plan.kind === 'line' ? (
            <LineChart
              data={data}
              margin={{ top: 8, right: 16, bottom: 8, left: 8 }}
            >
              {sharedAxes}
              {sharedTooltip}
              <Legend
                wrapperStyle={{
                  fontFamily: F.mono,
                  fontSize: 11,
                  color: C.textSecondary,
                }}
              />
              {plan.yKeys.map((yk, i) => (
                <Line
                  key={yk}
                  type="monotone"
                  dataKey={yk}
                  name={plan.yLabels[i]}
                  stroke={C.electricBlue}
                  strokeWidth={2}
                  dot={false}
                />
              ))}
            </LineChart>
          ) : (
            <BarChart
              data={data}
              margin={{ top: 8, right: 16, bottom: 8, left: 8 }}
            >
              {sharedAxes}
              {sharedTooltip}
              <Legend
                wrapperStyle={{
                  fontFamily: F.mono,
                  fontSize: 11,
                  color: C.textSecondary,
                }}
              />
              {plan.yKeys.map((yk, i) => (
                <Bar
                  key={yk}
                  dataKey={yk}
                  name={plan.yLabels[i]}
                  fill={C.electricBlue}
                  fillOpacity={0.7}
                  radius={[2, 2, 0, 0]}
                />
              ))}
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    </AnnotatableChart>
  );
}
