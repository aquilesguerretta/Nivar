import { getSeries, REGIONS, SAMPLE_VERSION } from "./sample.ts";
import type { MetricId, PeriodId, RegionId } from "./sample.ts";

export type Representation = "chart" | "table" | "spatial";
export type AnalysisScale = "native" | "index";
export interface WorkspaceState {
  region: RegionId;
  period: PeriodId;
  metric: MetricId;
  source: "sample" | "unavailable";
  tone: "graphite" | "paper";
  note: number;
  observation?: number;
  compare: RegionId[];
  view: Representation;
  scale: AnalysisScale;
  start: number;
  end: number;
}
const isRegion = (value: string): value is RegionId => REGIONS.some(region => region.id === value);
export function parseWorkspace(params: URLSearchParams): WorkspaceState {
  const regionValue = params.get("region") ?? "";
  const region = isRegion(regionValue) ? regionValue : "sudesteCentroOeste";
  const period = (["24h", "7d", "30d"] as const).find(value => value === params.get("period")) ?? "24h";
  const metric = (["price", "load", "storage"] as const).find(value => value === params.get("metric")) ?? "price";
  const length = getSeries(region, period, metric).length;
  const bounded = (name: string, max: number) => {
    const value = params.get(name);
    if (value === null || !/^\d+$/.test(value)) return undefined;
    const index = Number(value);
    return Number.isSafeInteger(index) && index <= max ? index : undefined;
  };
  const requestedStart = bounded("start", length - 2) ?? 0;
  const requestedEnd = bounded("end", length - 1) ?? length - 1;
  const start = requestedStart < requestedEnd ? requestedStart : 0;
  const end = requestedStart < requestedEnd ? requestedEnd : length - 1;
  const observation = bounded("observation", length - 1);
  return {
    region, period, metric,
    source: params.get("source") === "unavailable" ? "unavailable" : "sample",
    tone: params.get("tone") === "paper" ? "paper" : "graphite",
    note: bounded("note", 2) ?? 1,
    observation: observation !== undefined && observation >= start && observation <= end ? observation : undefined,
    compare: [...new Set((params.get("compare") ?? "").split(",").filter(isRegion))].filter(value => value !== region),
    view: (["chart", "table", "spatial"] as const).find(value => value === params.get("view")) ?? "chart",
    scale: params.get("scale") === "index" ? "index" : "native",
    start, end,
  };
}

export function serializeWorkspace(state: WorkspaceState): string {
  const params = new URLSearchParams({ region: state.region, period: state.period, metric: state.metric,
    source: state.source, tone: state.tone, note: String(state.note), view: state.view, scale: state.scale,
    start: String(state.start), end: String(state.end), dataset: SAMPLE_VERSION });
  if (state.observation !== undefined) params.set("observation", String(state.observation));
  if (state.compare.length) params.set("compare", state.compare.join(","));
  return `/br/terminal?${params.toString()}`;
}

export const SAVED_WORKSPACE_KEY = "nivar-terminal-brasil-views-v1";
export interface SavedWorkspace { id: string; name: string; url: string; savedAt: string; dataset: string }
/** Treat local browser storage as untrusted input; stored URLs never become arbitrary navigation. */
export function parseSavedWorkspaces(raw: string | null): SavedWorkspace[] {
  try {
    const values: unknown = JSON.parse(raw ?? "[]");
    if (!Array.isArray(values)) return [];
    return values.slice(0, 12).flatMap((value: unknown) => {
      if (!value || typeof value !== "object") return [];
      const record = value as Record<string, unknown>;
      if (typeof record.id !== "string" || typeof record.name !== "string" || typeof record.url !== "string"
        || typeof record.savedAt !== "string" || record.dataset !== SAMPLE_VERSION
        || !record.url.startsWith("/br/terminal?")) return [];
      return [{ id: record.id.slice(0, 100), name: record.name.slice(0, 80),
        url: serializeWorkspace(parseWorkspace(new URLSearchParams(record.url.split("?")[1]))),
        savedAt: record.savedAt.slice(0, 40), dataset: SAMPLE_VERSION }];
    });
  } catch { return []; }
}
