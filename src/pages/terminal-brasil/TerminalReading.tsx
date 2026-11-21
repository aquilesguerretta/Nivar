import { ArrowUpRight } from "lucide-react";
import { formatValue, METRICS, REGIONS, SAMPLE_VERSION } from "./sample";
import type { MetricId, Observation, RegionId } from "./sample";
import "./terminal-reading.css";

export interface TerminalReadingProps {
  region: RegionId;
  metric: MetricId;
  observation: Observation | null;
  sourceMode?: "sample" | "unavailable";
  compact?: boolean;
  className?: string;
  onInspectSource?: () => void;
  href?: string;
}
/** Shared evidence presentation for the actual instrument and its public narrative.
 * No independent series, inferred measurement, timer or source lookup lives here. */
export function TerminalReading({ region, metric, observation, sourceMode = "sample", compact = false,
  className = "", onInspectSource, href }: TerminalReadingProps) {
  const regionInfo = REGIONS.find(item => item.id === region)!;
  const available = sourceMode === "sample" && observation !== null;
  const content = <>
    <span className="g23-reading-label">{available ? "OBSERVAÇÃO SELECIONADA" : "SEM OBSERVAÇÃO"}<ArrowUpRight size={13} aria-hidden="true" /></span>
    <span className="g23-reading-context">{regionInfo.code}<i />{METRICS[metric].label}<i />{available ? observation.label : "—"}</span>
    <strong className="g23-reading-value">{available ? formatValue(observation.value, metric) : "—"}<small>{METRICS[metric].unit}</small></strong>
    <span className="g23-reading-source">{available ? "Base sintética · fonte e método" : "Fonte indisponível · ausência declarada"}</span>
    {!compact && <span className="g23-reading-record">{available ? `${observation.timestamp} · ${SAMPLE_VERSION}` : "Sem dado de mercado conectado"}</span>}
  </>;
  const classes = `g23-terminal-reading ${compact ? "is-compact" : ""} ${className}`;
  if (onInspectSource) return <button type="button" className={classes} onClick={onInspectSource} aria-label="Examinar a proveniência da observação selecionada">{content}</button>;
  if (href) return <a className={classes} href={href}>{content}</a>;
  return <div className={classes}>{content}</div>;
}
