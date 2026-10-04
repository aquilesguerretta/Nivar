import { formatValue } from "./sample";
import type { MetricId, RegionId } from "./sample";
import type { AnalysisScale } from "./workspace-state";

export const SERIES_COLORS: Record<RegionId, string> = { sudesteCentroOeste: "var(--g2t-accent)", norte: "var(--g23-blue)", nordeste: "var(--g23-lilac)", sul: "var(--g23-stone)" };
export function plotValue(value: number | null, metric: MetricId, scale: AnalysisScale) {
  return value === null ? "—" : scale === "native" ? formatValue(value, metric) : value.toLocaleString("pt-BR", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
}
