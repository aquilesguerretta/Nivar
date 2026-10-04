import { getSeries, METRICS, REGIONS, SAMPLE_VERSION } from "./sample.ts";
import type { MetricId, Observation, PeriodId, RegionId } from "./sample.ts";
import type { AnalysisScale } from "./workspace-state.ts";

export interface AnalysisSeries { region: RegionId; observations: Observation[]; values: (number | null)[] }
/** Notes refer to fixed observations in the full frequency window, never to a crop. */
export function noteAnchors(fullSeries: Observation[]): Observation[] {
  return [0.3, 0.6, 0.82].map(fraction => fullSeries[Math.round((fullSeries.length - 1) * fraction)]);
}
export function observationInWindow(index: number, start: number, end: number): boolean {
  return index >= start && index <= end;
}
export function selectionForWindow(fullSeries: Observation[], selectedIndex: number, start: number, end: number) {
  const index = Math.max(start, Math.min(selectedIndex, end));
  return { point: fullSeries[index], moved: index !== selectedIndex };
}
/** Daily presets share timestamps, even though their observation indices differ. */
export function selectionForDailySeries(selected: Observation, nextSeries: Observation[]) {
  const same = nextSeries.find(point => point.timestamp === selected.timestamp);
  if (same) return { point: same, moved: false };
  const selectedTime = Date.parse(selected.timestamp);
  const nearest = nextSeries.reduce((closest, point) =>
    Math.abs(Date.parse(point.timestamp) - selectedTime) < Math.abs(Date.parse(closest.timestamp) - selectedTime) ? point : closest);
  return { point: nearest, moved: true };
}
export function indexValue(value: number | null, baseline: number | null): number | null {
  return value === null || baseline === null || !Number.isFinite(value) || !Number.isFinite(baseline) || baseline === 0
    ? null : value / baseline * 100;
}
export function makeAnalysis(regions: RegionId[], period: PeriodId, metric: MetricId, start: number, end: number, scale: AnalysisScale): AnalysisSeries[] {
  return [...new Set(regions)].map(region => {
    const observations = getSeries(region, period, metric).slice(start, end + 1);
    const baseline = observations[0]?.value ?? null;
    return { region, observations, values: observations.map(point => scale === "index" ? indexValue(point.value, baseline) : point.value) };
  });
}
export function analysisCsv(series: AnalysisSeries[], metric: MetricId, period: PeriodId, scale: AnalysisScale) {
  const rows: (string | number)[][] = [["versao", "classificacao", "submercado", "frequencia", "referencia", "metrica", "valor_original", "unidade_original", "transformacao", "base_referencia", "valor_exibido", "unidade_exibida"]];
  for (const item of series) for (let index = 0; index < item.observations.length; index++) {
    const point = item.observations[index];
    rows.push([SAMPLE_VERSION, "DEMONSTRACAO_SINTETICA", REGIONS.find(region => region.id === item.region)!.name,
      period === "24h" ? "horaria_UTC-03:00" : "diaria", point.timestamp, METRICS[metric].longLabel, point.value,
      METRICS[metric].unit, scale === "index" ? "valor / primeira_observacao_visivel * 100" : "sem_transformacao",
      item.observations[0].timestamp, item.values[index] ?? "", scale === "index" ? "indice_base_100" : METRICS[metric].unit]);
  }
  return "\uFEFF" + rows.map(row => row.map(value => `"${String(value).replace(/"/g, '""')}"`).join(";")).join("\r\n");
}
