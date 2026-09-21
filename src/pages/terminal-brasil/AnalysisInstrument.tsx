import { Area, CartesianGrid, ComposedChart, Line, ReferenceDot, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ArrowUpRight } from "lucide-react";
import { BRASIL_OUTLINE_D, BRASIL_VIEWBOX, SUBMERCADOS } from "../../lib/geo/brasil-outline";
import { formatValue, METRICS, REGIONS } from "./sample";
import type { MetricId, Observation, RegionId } from "./sample";
import type { AnalysisSeries } from "./analysis";
import type { AnalysisScale, Representation } from "./workspace-state";
import { SERIES_COLORS, plotValue } from "./analysis-format";

const dashes: Record<RegionId, string> = { sudesteCentroOeste: "", norte: "7 3", nordeste: "3 3", sul: "10 3 2 3" };
interface InstrumentProps {
  models: AnalysisSeries[];
  allModels: AnalysisSeries[];
  metric: MetricId;
  scale: AnalysisScale;
  view: Representation;
  selected: Observation;
  id: string;
  inspect: (index: number) => void;
  selectRegion: (region: RegionId) => void;
  onSource: () => void;
}

function ComparisonTooltip({ active, payload, models, metric, scale }: {
  active?: boolean; payload?: readonly { payload?: { index: number } }[];
  models: AnalysisSeries[]; metric: MetricId; scale: AnalysisScale;
}) {
  const index = payload?.[0]?.payload?.index;
  if (!active || index === undefined) return null;
  const offset = models[0].observations.findIndex(point => point.index === index);
  if (offset < 0) return null;
  return <div className="g2t-tooltip g23-comparison-tooltip"><span>{models[0].observations[offset].label} · AMOSTRA SINTÉTICA</span>{models.map(model => <div key={model.region}><span style={{ color: SERIES_COLORS[model.region] }}>{REGIONS.find(region => region.id === model.region)!.code}</span><strong>{plotValue(model.values[offset], metric, scale)} <small>{scale === "index" ? "índice" : METRICS[metric].unit}</small></strong></div>)}</div>;
}

export function AnalysisInstrument({ models, allModels, metric, scale, view, selected, id, inspect, selectRegion, onSource }: InstrumentProps) {
  const first = models[0];
  const points = first.observations;
  const offset = points.findIndex(point => point.index === selected.index);
  const selectedValue = first.values[offset] ?? null;
  const unit = scale === "index" ? "ÍNDICE · BASE 100" : METRICS[metric].unit;
  const rows = points.map((point, index) => ({ ...point, ...Object.fromEntries(models.map(model => [model.region, model.values[index]])) }));
  if (view === "table") return <div className="g23-analysis-table" tabIndex={0} aria-label="Tabela comparativa da análise; rolagem horizontal quando necessária"><table><caption>Valores da seleção · {unit} · base sintética</caption><thead><tr><th scope="col">Referência</th>{models.map(model => <th key={model.region} scope="col"><i style={{ background: SERIES_COLORS[model.region] }} />{REGIONS.find(region => region.id === model.region)!.code}</th>)}</tr></thead><tbody>{points.map((point, index) => <tr key={point.timestamp} data-selected={point.index === selected.index}><th scope="row"><button type="button" onClick={() => inspect(point.index)} aria-pressed={point.index === selected.index} aria-label={`Inspecionar ${point.label}`}>{point.label}<ArrowUpRight size={11} /></button></th>{models.map(model => <td key={model.region}>{plotValue(model.values[index], metric, scale)}{scale === "index" && <small>{formatValue(model.observations[index].value, metric)} {METRICS[metric].unit}</small>}</td>)}</tr>)}</tbody></table></div>;
  if (view === "spatial") {
    const currentValues = allModels.map(model => model.values[offset] ?? null);
    const finite = currentValues.filter((value): value is number => value !== null);
    const min = Math.min(...finite), max = Math.max(...finite);
    return <div className="g23-spatial-analysis"><div className="g23-spatial-heading"><span>RETRATO DA AMOSTRA</span><strong>{selected.label}<small>{unit}</small></strong></div><svg viewBox={BRASIL_VIEWBOX} role="group" aria-label={`Valores sintéticos por região em ${selected.label}`}><path d={BRASIL_OUTLINE_D} className="g2t-map-outline" />{SUBMERCADOS.map(market => {
      const model = allModels.find(item => item.region === market.id)!;
      const value = model.values[offset];
      const included = models.some(item => item.region === market.id);
      return <g key={market.id}><path d={market.d} className="g23-spatial-region" tabIndex={0} role="button" aria-label={`Examinar ${market.nome}: ${plotValue(value, metric, scale)} ${unit}, amostra sintética`} aria-pressed={first.region === market.id} style={{ fill: value === null ? "var(--g2t-map)" : `color-mix(in srgb, var(--g2t-accent) ${18 + ((value - min) / (max - min || 1)) * 48}%, var(--g2t-bg))`, stroke: first.region === market.id ? "var(--g2t-ink)" : "var(--g2t-map-stroke)", strokeWidth: first.region === market.id ? 3 : 1, opacity: included ? 1 : .48 }} onClick={() => selectRegion(market.id)} onKeyDown={event => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); selectRegion(market.id); } }} /><text x={market.centroid[0]} y={market.centroid[1] - 11} textAnchor="middle" className="g23-spatial-code">{REGIONS.find(region => region.id === market.id)!.code}</text><text x={market.centroid[0]} y={market.centroid[1] + 11} textAnchor="middle" className="g23-spatial-value">{plotValue(value, metric, scale)}</text></g>;
    })}</svg><div className="g23-spatial-legend"><span>{plotValue(min, metric, scale)}</span><i /><span>{plotValue(max, metric, scale)}</span></div><p>Geometria IBGE · valores sintéticos.<br />Opacidade reduzida: região fora da comparação.</p></div>;
  }
  const indices = [points[0].index, points[Math.round((points.length - 1) / 3)].index, points[Math.round((points.length - 1) * 2 / 3)].index, points[points.length - 1].index];
  return <><ResponsiveContainer width="100%" height="100%" minWidth={0} initialDimension={{ width: 650, height: 320 }}><ComposedChart data={rows} margin={{ top: 32, right: 27, bottom: 8, left: 4 }} accessibilityLayer onClick={state => { const index = Number(state.activeTooltipIndex); if (state.activeTooltipIndex != null && Number.isInteger(index) && points[index]) inspect(points[index].index); }}><defs><linearGradient id={`${id}-analysis-fill`} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={SERIES_COLORS[first.region]} stopOpacity={models.length > 1 ? .1 : .23} /><stop offset="100%" stopColor={SERIES_COLORS[first.region]} stopOpacity={0} /></linearGradient></defs><CartesianGrid stroke="var(--g2t-rule)" vertical={false} strokeOpacity={.6} /><XAxis dataKey="index" type="number" domain={[points[0].index, points[points.length - 1].index]} ticks={[...new Set(indices)]} tickFormatter={index => points.find(point => point.index === index)?.label ?? ""} tick={{ fill: "var(--g2t-muted)", fontSize: 11, fontFamily: "var(--g2-mono)" }} axisLine={false} tickLine={false} tickMargin={14} /><YAxis domain={[(value: number) => Math.floor(value - Math.max(Math.abs(value) * .07, 1)), (value: number) => Math.ceil(value + Math.max(Math.abs(value) * .07, 1))]} tickCount={4} tick={{ fill: "var(--g2t-muted)", fontSize: 11, fontFamily: "var(--g2-mono)" }} tickFormatter={value => value.toLocaleString("pt-BR", { maximumFractionDigits: 1 })} axisLine={false} tickLine={false} width={45} /><ReferenceLine y={scale === "index" ? 100 : first.values[0] ?? undefined} stroke="var(--g2t-muted)" strokeDasharray="5 5" strokeOpacity={.5} /><ReferenceLine x={selected.index} stroke="var(--g2t-accent)" strokeOpacity={.7} label={{ value: selected.label, fill: "var(--g2t-secondary)", fontSize: 11, fontFamily: "var(--g2-mono)", position: "insideTopRight" }} /><Area className={`g23-curve-${first.region}`} type="linear" dataKey={first.region} stroke={SERIES_COLORS[first.region]} strokeWidth={2} fill={`url(#${id}-analysis-fill)`} dot={false} connectNulls={false} activeDot={{ r: 4 }} isAnimationActive={false} />{models.slice(1).map(model => <Line className={`g23-curve-${model.region}`} key={model.region} type="linear" dataKey={model.region} stroke={SERIES_COLORS[model.region]} strokeWidth={1.8} strokeDasharray={dashes[model.region]} dot={false} connectNulls={false} activeDot={{ r: 4 }} isAnimationActive={false} />)}{models.map(model => model.values[offset] !== null && model.values[offset] !== undefined ? <ReferenceDot key={model.region} x={selected.index} y={model.values[offset]!} r={model.region === first.region ? 4.5 : 3} fill={SERIES_COLORS[model.region]} stroke="var(--g2t-bg)" strokeWidth={2} /> : null)}<Tooltip content={<ComparisonTooltip models={models} metric={metric} scale={scale} />} cursor={{ stroke: "var(--g2t-muted)", strokeDasharray: "3 3" }} /></ComposedChart></ResponsiveContainer><div className="g2t-evidence-dock" data-placement={selectedValue !== null && selectedValue > Math.max(...first.values.filter((value): value is number => value !== null)) * .8 ? "below" : "above"} style={{ left: `clamp(111px, ${18 + (offset / (points.length - 1)) * 74}%, calc(100% - 111px))` }}><div className="g2t-context-plane"><div className="g2t-context-heading"><span>OBSERVAÇÃO · {REGIONS.find(region => region.id === first.region)!.code}</span><button type="button" onClick={onSource} aria-label="Rastrear esta observação nas fontes">Fonte <ArrowUpRight size={12} /></button></div><div className="g2t-context-value"><strong>{plotValue(selectedValue, metric, scale)}</strong><span>{scale === "index" ? "índice" : METRICS[metric].unit}</span></div><p>{selected.label}<i />{scale === "index" ? `${formatValue(selected.value, metric)} ${METRICS[metric].unit}` : "AMOSTRA"}</p></div></div></>;
}
