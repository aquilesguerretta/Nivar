import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { formatValue, getSeries, REGIONS, SAMPLE_VERSION } from "../../pages/terminal-brasil/sample";
import type { RegionId } from "../../pages/terminal-brasil/sample";
import "./terminal-threshold.css";

/** A close view of the existing fixture, with the same observation at entry. */
export function TerminalThreshold() {
  const root = useRef<HTMLDivElement>(null);
  const curve = useRef<SVGPathElement>(null), previous = useRef("");
  const [entered, setEntered] = useState(false);
  const [compact, setCompact] = useState(() => matchMedia("(max-width:700px)").matches);
  const [region, setRegion] = useState<RegionId>("sudesteCentroOeste");
  const [index, setIndex] = useState(14);
  const series = useMemo(() => getSeries(region, "24h", "price"), [region]);
  const selected = series[index];
  const name = REGIONS.find(item => item.id === region)!.short;
  const plotWidth = compact ? 390 : 760;
  const x = (i: number) => 36 + i * ((plotWidth - 76) / 23);
  const y = (value: number) => 224 - value * .67;
  const line = series.map((point, i) => `${i ? "L" : "M"}${x(i).toFixed(2)} ${y(point.value).toFixed(2)}`).join(" ");
  useEffect(() => {
    const media = matchMedia("(max-width:700px)");
    const update = () => setCompact(media.matches);
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setEntered(true); observer.disconnect(); }
    }, { threshold: .18 });
    if (root.current) observer.observe(root.current);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    const node = curve.current, from = previous.current;
    previous.current = line;
    if (!node || !from || matchMedia("(prefers-reduced-motion: reduce)").matches || !CSS.supports("d", `path("${line}")`)) return;
    const animation = node.animate([{ d: `path("${from}")` }, { d: `path("${line}")` }], { duration: 450, easing: "cubic-bezier(.2,.7,.2,1)" });
    return () => {
      const shown = getComputedStyle(node).getPropertyValue("d").match(/^path\("(.*)"\)$/)?.[1];
      if (shown) previous.current = shown;
      animation.cancel();
    };
  }, [line]);
  return <div className="g22-terminal-threshold" ref={root} data-entered={entered}>
    <div className="g22-threshold-top"><span>NIVAR / TERMINAL BRASIL</span><span>10 SET 2026 · AMOSTRA SINTÉTICA</span></div>
    <div className="g22-threshold-layout">
      <div className="g22-threshold-regions" role="group" aria-label="Submercado da prévia do Terminal">
        <span>01 / ESCOLHA O TERRITÓRIO</span>
        {REGIONS.map(item => <button key={item.id} aria-label={item.name} aria-pressed={region === item.id} onClick={() => setRegion(item.id)}><span>{item.code}</span><strong>{item.short}</strong><i aria-hidden="true">↗</i></button>)}
        <p>Uma região. Uma observação.<br />A origem permanece junto.</p>
      </div>
      <div className="g22-threshold-instrument">
        <div className="g22-threshold-reading"><div><span>02 / PREÇO SIMULADO · {name}</span><p><strong>{formatValue(selected.value, "price")}</strong><span>R$/MWh</span></p></div><time dateTime={selected.timestamp}>{selected.label}<small>10.09.2026 · UTC−3</small></time></div>
        <svg viewBox={`0 0 ${plotWidth} 260`} className="g22-threshold-plot" aria-hidden="true">
          <defs><linearGradient id="g22-threshold-fill" x1="0" x2="0" y1="0" y2="1"><stop stopColor="#c5a67b" stopOpacity=".16"/><stop offset="1" stopColor="#c5a67b" stopOpacity="0"/></linearGradient></defs>
          <g className="g22-threshold-grid">{[0, 100, 200, 300].map(value => <g key={value}><line x1="36" x2={plotWidth - 40} y1={y(value)} y2={y(value)} /><text x="23" y={y(value) + 4} textAnchor="end">{value}</text></g>)}{[0, 6, 12, 18, 23].map(i => <text key={i} x={x(i)} y="249" textAnchor="middle">{series[i].label}</text>)}</g>
          <path className="g22-threshold-area" d={`${line} L${x(23)} 224 L36 224 Z`} fill="url(#g22-threshold-fill)"/>
          <path ref={curve} className="g22-threshold-line" d={line} pathLength="1" />
          <g className="g22-threshold-probe"><line x1={x(index)} x2={x(index)} y1={y(selected.value)} y2="224"/><circle cx={x(index)} cy={y(selected.value)} r="9"/><circle cx={x(index)} cy={y(selected.value)} r="3"/></g>
        </svg>
        <label className="g22-threshold-scrub"><span>EXAMINAR UM INSTANTE</span><input aria-label="Horário da observação na prévia do Terminal" aria-valuetext={`${selected.label}, ${formatValue(selected.value, "price")} R$/MWh, ${name}`} type="range" min="0" max="23" step="1" value={index} onChange={event => setIndex(Number(event.target.value))}/><output>{selected.label}</output></label>
      </div>
    </div>
    <div className="g22-threshold-bottom"><details><summary>03 / VOLTAR À ORIGEM</summary><p>Série sintética NIVAR · {SAMPLE_VERSION}. Perfil fixo para explorar o produto. Não representa PLD, preço executável ou previsão. A linha conecta as 24 observações; a seleção não demonstra uma causa.</p></details><Link to={`/br/terminal?region=${region}&period=24h&metric=price&observation=${index}`}>Continuar desta observação <ArrowUpRight size={18}/></Link></div>
  </div>;
}
