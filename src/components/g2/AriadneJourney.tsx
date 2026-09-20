import { useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, ArrowUpRight, FileText } from "lucide-react";
import { BRASIL_OUTLINE_D, BRASIL_VIEWBOX, SUBMERCADOS } from "../../lib/geo/brasil-outline";
import { formatValue, getSeries, REGIONS, SAMPLE_VERSION, SOURCE_RECORDS } from "../../pages/terminal-brasil/sample";
import type { RegionId } from "../../pages/terminal-brasil/sample";
import "./ariadne-journey.css";

const loadTerminal = () => import("../../pages/terminal-brasil/TerminalBrasil");
const STAGES = ["Território", "Observação", "Origem", "Instrumento"];

/** A presentation of the existing deterministic fixture. It never fetches or invents telemetry. */
export function AriadneJourney({ compact = false }: { compact?: boolean }) {
  const id = useId();
  const journey = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const record = useRef<HTMLDivElement>(null);
  const chart = useRef<SVGPathElement>(null);
  const area = useRef<SVGPathElement>(null);
  const filament = useRef<SVGPathElement>(null);
  const previousPath = useRef("");
  const previousAreaPath = useRef("");
  const [phase, setPhase] = useState(0);
  const [region, setRegion] = useState<RegionId>("sudesteCentroOeste");
  const [selectedIndex, setSelectedIndex] = useState(14);
  const [showTerminal, setShowTerminal] = useState(false);
  const [EarnedTerminal, setEarnedTerminal] = useState<typeof import("../../pages/terminal-brasil/TerminalBrasil").TerminalPreview | null>(null);
  const [terminalEntryUrl, setTerminalEntryUrl] = useState<string | null>(null);
  const transfer = useRef<HTMLDivElement>(null);
  const instrumentEntered = useRef(false);
  const [handoff, setHandoff] = useState<{ x: number; y: number; width: number; height: number } | null>(null);
  const [introducing, setIntroducing] = useState(false);
  const [reduced, setReduced] = useState(() => window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  const series = useMemo(() => getSeries(region, "24h", "price"), [region]);
  const regionInfo = REGIONS.find(item => item.id === region)!;
  const market = SUBMERCADOS.find(item => item.id === region)!;
  const observation = series[selectedIndex];
  const plotHeight = phase >= 2 ? 138 : 192;
  const baseline = plotHeight - 26;
  const ordinate = (value: number) => baseline - value * ((plotHeight - 50) / 250);
  const points = series.map((point, index) => ({ x: 28 + index * 23.4, y: ordinate(point.value) }));
  const selectedPoint = points[selectedIndex];
  const path = points.map((point, index) => `${index ? "L" : "M"}${point.x.toFixed(2)} ${point.y.toFixed(2)}`).join(" ");
  const areaPath = `${path} L566.2 ${baseline} L28 ${baseline} Z`;

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(media.matches);
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (!introducing) return;
    const timer = window.setTimeout(() => setIntroducing(false), 650);
    return () => window.clearTimeout(timer);
  }, [introducing]);

  useEffect(() => {
    if (phase > 0) void loadTerminal();
  }, [phase]);

  const terminalReady = Boolean(terminalEntryUrl);

  // A selected receipt crosses into the graph in viewport space. The receiving
  // annotation is the same fixture value, not a second authored data example.
  useLayoutEffect(() => {
    if (!showTerminal || !terminalReady || instrumentEntered.current) return;
    instrumentEntered.current = true;
    let frame = 0;
    let animation: Animation | undefined;
    let typeAnimation: Animation | undefined;
    let finished = false;
    const deadline = performance.now() + 1200;
    const complete = () => { finished = true; setHandoff(null); };
    const enter = () => {
      const instrument = journey.current?.querySelector<HTMLElement>(".g22-aj-terminal");
      const destination = instrument?.querySelector<HTMLElement>(".g2t-context-plane");
      if (!instrument || !destination) {
        if (performance.now() < deadline) frame = requestAnimationFrame(enter);
        else { instrument?.scrollIntoView({ block: "start", behavior: "instant" }); complete(); }
        return;
      }
      destination.scrollIntoView({ block: "center", behavior: "instant" });
      const target = destination.getBoundingClientRect();
      if (reduced) { complete(); return; }
      if (!handoff || !transfer.current) { complete(); return; }
      const receipt = transfer.current;
      const value = receipt.querySelector("strong");
      const duration = 620;
      animation = receipt.animate([
        { left: `${handoff.x}px`, top: `${handoff.y}px`, width: `${handoff.width}px`, height: `${handoff.height}px`, opacity: 1 },
        { left: `${target.x}px`, top: `${target.y}px`, width: `${target.width}px`, height: `${target.height}px`, opacity: 1, offset: .88 },
        { left: `${target.x}px`, top: `${target.y}px`, width: `${target.width}px`, height: `${target.height}px`, opacity: 1 },
      ], { duration, easing: "cubic-bezier(.2,.76,.2,1)", fill: "forwards" });
      typeAnimation = value?.animate([{ fontSize: "38px" }, { fontSize: getComputedStyle(destination.querySelector("strong")!).fontSize }], { duration: duration * .88, easing: "cubic-bezier(.2,.76,.2,1)", fill: "forwards" });
      animation.onfinish = complete;
    };
    // Allow the newly mounted responsive chart to establish its receiving point.
    frame = requestAnimationFrame(() => { frame = requestAnimationFrame(enter); });
    return () => {
      cancelAnimationFrame(frame);
      animation?.cancel();
      typeAnimation?.cancel();
      if (!finished) instrumentEntered.current = false;
    };
  }, [showTerminal, terminalReady, handoff, reduced]);

  useEffect(() => {
    const element = chart.current;
    const from = previousPath.current;
    const fromArea = previousAreaPath.current;
    const areaElement = area.current;
    previousPath.current = path;
    previousAreaPath.current = areaPath;
    if (!element || !from || reduced || phase === 0) return;
    const animation = element.animate([{ d: `path("${from}")` }, { d: `path("${path}")` }], {
      duration: 620,
      easing: "cubic-bezier(.2,.75,.25,1)",
    });
    const areaAnimation = areaElement?.animate([
      { d: `path("${fromArea}")` },
      { d: `path("${areaPath}")` },
    ], { duration:620, easing:"cubic-bezier(.2,.75,.25,1)" });
    return () => {
      // A rapid second selection continues from the shape actually on screen.
      const rendered = getComputedStyle(element).getPropertyValue("d").match(/^path\("(.*)"\)$/)?.[1];
      const renderedArea = areaElement && getComputedStyle(areaElement).getPropertyValue("d").match(/^path\("(.*)"\)$/)?.[1];
      if (rendered) previousPath.current = rendered;
      if (renderedArea) previousAreaPath.current = renderedArea;
      animation.cancel();
      areaAnimation?.cancel();
    };
  }, [path, areaPath, reduced, phase]);

  // One filament follows two actual, selected objects through their native layout motion.
  useLayoutEffect(() => {
    const surface = stage.current;
    if (!surface || phase === 0) return;
    let frame = 0;
    let until = 0;
    const draw = (time: number) => {
      const source = surface.querySelector(`[data-market="${region}"] circle`)?.getBoundingClientRect();
      const destination = record.current?.querySelector(".g22-aj-record-head i")?.getBoundingClientRect();
      if (source && destination && filament.current) {
        const bounds = surface.getBoundingClientRect();
        const x1 = source.x + source.width / 2 - bounds.x;
        const y1 = source.y + source.height / 2 - bounds.y;
        const x2 = destination.x + destination.width / 2 - bounds.x;
        const y2 = destination.y + destination.height / 2 - bounds.y;
        const bend = Math.max(40, Math.abs(x2 - x1) * .55);
        filament.current.setAttribute("d", `M${x1} ${y1} C${x1 + bend} ${y1}, ${x2 - bend} ${y2}, ${x2} ${y2}`);
      }
      if (time < until && !reduced) frame = requestAnimationFrame(draw);
    };
    const track = () => { cancelAnimationFrame(frame); until = performance.now() + 1050; frame = requestAnimationFrame(draw); };
    const observer = new ResizeObserver(track);
    observer.observe(surface);
    track();
    return () => { cancelAnimationFrame(frame); observer.disconnect(); };
  }, [region, phase, reduced]);

  function chooseRegion(next: RegionId) {
    if (phase === 3) return;
    const origin = stage.current?.querySelector(`[data-market="${next}"]`)?.getBoundingClientRect();
    setRegion(next);
    if (phase > 0) return;
    setPhase(1);
    setIntroducing(!reduced);
    if (reduced || !origin) return;
    requestAnimationFrame(() => {
      const element = record.current;
      if (!element) return;
      const destination = element.getBoundingClientRect();
      element.animate([
        { transform: `translate(${origin.x + origin.width / 2 - destination.x}px, ${origin.y + origin.height / 2 - destination.y}px) scale(.07)`, opacity: 0.25 },
        { transform: "translate(0,0) scale(1)", opacity: 1 },
      ], { duration: 520, easing: "cubic-bezier(.18,.76,.2,1)", fill: "backwards" });
    });
  }

  function openOrigin() {
    setPhase(2);
    requestAnimationFrame(() => stage.current?.scrollIntoView({ block: "start", behavior: reduced ? "instant" : "smooth" }));
  }

  async function openInstrument() {
    const module = await loadTerminal();
    setEarnedTerminal(() => module.TerminalPreview);
    const bounds = record.current?.querySelector(".g22-aj-measurement")?.getBoundingClientRect();
    if (bounds && !reduced) setHandoff({ x: bounds.x, y: bounds.y, width: bounds.width, height: Math.max(108, bounds.height) });
    instrumentEntered.current = false;
    setTerminalEntryUrl(null);
    setPhase(3);
    setShowTerminal(true);
  }

  return (
    <div ref={journey} className={`g22-ariadne${compact ? " g22-ariadne--compact" : ""}`} data-phase={phase} data-introducing={introducing} data-handoff={!!handoff} data-reduced-motion={reduced}>
      <div className="g22-aj-orientation">
        <span className="g22-aj-kicker">ARIADNE / O FIO DA LEITURA</span>
        <ol aria-label="Percurso até o Terminal">
          {STAGES.map((label, index) => <li key={label} data-current={phase === index} data-complete={phase > index}>
            <span>{String(index + 1).padStart(2, "0")}</span><span>{label}</span>
          </li>)}
        </ol>
      </div>

      <div className="g22-aj-stage" ref={stage} aria-hidden={phase === 3} inert={phase === 3}>
        <svg className="g22-aj-filament" aria-hidden="true"><path ref={filament} /></svg>
        <figure className="g22-aj-patron">
          <img src="/g2/g21/emblems/ariadne-hero-1200.webp" alt="Ariadne segura o fio entre as mãos. Gravura editorial gerada." width={1200} height={1200} loading="lazy" />
        </figure>

        <div className="g22-aj-invitation" aria-hidden={phase > 0}>
          <span className="g22-aj-kicker">01 / ESCOLHA UMA REGIÃO</span>
          <h3>O contexto<br /><em>vem primeiro.</em></h3>
          <p>Selecione um lugar.<br />Acompanhe o que se conecta a ele.</p>
        </div>

        <div className="g22-aj-geography">
          <svg viewBox={BRASIL_VIEWBOX} aria-label="Submercados brasileiros. Selecione uma região nos controles abaixo." role="img">
            <path className="g22-aj-outline" d={BRASIL_OUTLINE_D} />
            {SUBMERCADOS.map(item => <path key={item.id} d={item.d} className="g22-aj-market" data-selected={phase > 0 && region === item.id} onClick={() => chooseRegion(item.id)} />)}
            {SUBMERCADOS.map(item => <g key={item.id} data-market={item.id} transform={`translate(${item.centroid[0]} ${item.centroid[1]})`} className="g22-aj-map-mark" data-selected={phase > 0 && region === item.id} aria-hidden="true">
              <circle r="7" /><text x="15" y="6">{item.sigla}</text>
            </g>)}
            {phase > 0 && <circle className="g22-aj-map-ring" cx={market.centroid[0]} cy={market.centroid[1]} r="20" />}
          </svg>
          <span className="g22-aj-map-caption">IBGE · SUBMERCADOS</span>
        </div>

        <div className="g22-aj-record" ref={record} aria-hidden={phase === 0} inert={phase === 0}>
          <div className="g22-aj-record-head">
            <span><i />{regionInfo.code}<span className="g22-aj-full-region"> / {regionInfo.short}</span></span>
            <span>{observation.label} · 10 SET 2026</span>
          </div>
          <div className="g22-aj-measurement">
            <div><span className="g22-aj-kicker">{phase === 3 ? "CONTEXTO DE ENTRADA" : "OBSERVAÇÃO SELECIONADA"}</span><strong>{formatValue(observation.value, "price")}<small>R$/MWh</small></strong></div>
            <span className="g22-aj-sample">AMOSTRA<br />SINTÉTICA</span>
          </div>
          <div className="g22-aj-plot">
            <svg viewBox={`0 0 600 ${plotHeight}`} role="img" aria-label={`Preço simulado em ${regionInfo.name}, 24 observações horárias. Seleção: ${observation.label}, ${formatValue(observation.value, "price")} reais por megawatt-hora. Não são dados de mercado.`}>
              <defs><linearGradient id={`${id}-fill`} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#9a8eaa" stopOpacity=".22" /><stop offset="100%" stopColor="#9a8eaa" stopOpacity="0" /></linearGradient></defs>
              <g className="g22-aj-axis">
                {[100, 200].map(value => <g key={value}><line x1="28" x2="567" y1={ordinate(value)} y2={ordinate(value)} /><text x="579" y={ordinate(value)+4}>{value}</text></g>)}
                <line x1="28" x2="567" y1={baseline} y2={baseline} /><text x="28" y={plotHeight-3}>00h</text><text x="290" y={plotHeight-3}>12h</text><text x="546" y={plotHeight-3}>23h</text>
              </g>
              <path className="g22-aj-area" ref={area} d={areaPath} fill={`url(#${id}-fill)`} />
              <path className="g22-aj-curve" ref={chart} d={path} pathLength="1" />
              <g className="g22-aj-probe" style={{ transform: `translate(${selectedPoint.x}px, ${selectedPoint.y}px)` }}><line y1="0" y2={baseline - selectedPoint.y} /><circle r="6" /><circle className="g22-aj-point-core" r="2" /></g>
            </svg>
            <label className="g22-aj-scrubber"><span>SEGUIR UM INSTANTE</span><input type="range" min="0" max="23" value={selectedIndex} disabled={phase === 3} onChange={event => setSelectedIndex(Number(event.target.value))} aria-label="Selecionar observação horária da amostra" aria-valuetext={`${observation.label}, ${formatValue(observation.value, "price")} R$/MWh, amostra sintética`} /><span>{observation.label}</span></label>
          </div>
          <div className="g22-aj-record-bottom"><span>24 INSTANTES · MESMA REGIÃO · MESMA UNIDADE</span><span>EV / {String(selectedIndex + 1).padStart(2, "0")}</span></div>

          <div className="g22-aj-origin" aria-hidden={phase < 2} inert={phase < 2}>
            <div className="g22-aj-source-binding"><FileText size={16} /><span>A ORIGEM DESTA OBSERVAÇÃO</span><span>{regionInfo.code} / {observation.label}</span></div>
            <h4>O número não<br />viaja sozinho.</h4>
            <p>{SOURCE_RECORDS[0].text}</p>
            <dl><div><dt>REFERÊNCIA</dt><dd>{observation.timestamp}</dd></div><div><dt>NATUREZA</dt><dd>Demonstração. Sem fonte oficial conectada.</dd></div></dl>
            <button type="button" className="g22-aj-origin-enter" onClick={openInstrument}>Levar esta observação ao Terminal <ArrowRight size={16} /></button>
          </div>
        </div>

        <div className="g22-aj-thread" aria-live="polite" aria-atomic="true">
          <span>{phase === 0 ? "O PERCURSO AINDA ESTÁ ABERTO" : `${regionInfo.code} → ${observation.label} → ${phase >= 2 ? "ORIGEM DECLARADA" : "EXAMINAR A ORIGEM"}`}</span>
        </div>
      </div>

      <div className="g22-aj-controls">
        <div className="g22-aj-regions" role="group" aria-label="Selecionar região para seguir o fio da leitura">
          {REGIONS.map(item => <button type="button" key={item.id} disabled={phase === 3} onClick={() => chooseRegion(item.id)} aria-pressed={phase > 0 && region === item.id}><span>{item.code}</span><span>{item.short}</span><i /></button>)}
        </div>
        <div className="g22-aj-action">
          {phase === 0 && <span>Comece pela região ↑</span>}
          {phase === 1 && <button type="button" onClick={openOrigin}>Seguir até a fonte <ArrowRight size={18} /></button>}
          {phase === 2 && <><button type="button" className="g22-aj-back" onClick={() => setPhase(1)} aria-label="Voltar à observação"><ArrowLeft size={17} /></button><button type="button" onClick={openInstrument}>Revelar o Terminal <ArrowRight size={18} /></button></>}
          {phase === 3 && <button type="button" onClick={() => { setShowTerminal(false); setPhase(2); }}><ArrowLeft size={17} />Rever o percurso</button>}
        </div>
      </div>
      <p className="g22-aj-disclosure">{SAMPLE_VERSION} · Série demonstrativa fixa. Sem cotação, previsão ou telemetria ao vivo.</p>

      {showTerminal && EarnedTerminal && <div className="g22-aj-terminal"><div className="g22-aj-terminal-title"><button type="button" className="g22-aj-return" onClick={() => { setShowTerminal(false); setHandoff(null); setPhase(2); }}><ArrowLeft size={15} /> Rever percurso</button><span>04 / O INSTRUMENTO</span><p>O fio continua.</p><Link to={terminalEntryUrl ?? `/br/terminal?region=${encodeURIComponent(region)}&observation=${selectedIndex}`}>Abrir em tela inteira <ArrowUpRight size={16} /></Link></div><EarnedTerminal initialRegion={region} initialProbeIndex={selectedIndex} onEntryUrlChange={setTerminalEntryUrl} /></div>}
      {handoff && createPortal(<div ref={transfer} className="g22-aj-transfer" aria-hidden="true" style={{ left: handoff.x, top: handoff.y, width: handoff.width, height: handoff.height }}><span>OBSERVAÇÃO / {regionInfo.code}</span><strong>{formatValue(observation.value, "price")}<small>R$/MWh</small></strong><span>{observation.label} · AMOSTRA SINTÉTICA</span></div>, document.body)}
    </div>
  );
}
