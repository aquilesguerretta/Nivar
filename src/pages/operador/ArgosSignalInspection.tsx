import { useEffect, useId, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight, Pause, Play, RotateCcw } from "lucide-react";
import { Link } from "react-router-dom";
import { BRASIL_OUTLINE_D, BRASIL_VIEWBOX, SUBMERCADOS } from "../../lib/geo/brasil-outline";
import {
  ARGOS_INSPECTION_SCENARIOS,
  fetchArgosInspection,
  surfaceableClaim,
  type ArgosInspectionReadModel,
  type ArgosInspectionScenarioId,
} from "../../lib/argos/signalInspectionApi";
import "./argos-signal-inspection.css";

const STEPS = ["Território", "Detecção", "Observação", "Evidência", "Resultado"] as const;
const REGIONS = [
  { id: "norte", label: "N", name: "Norte" },
  { id: "nordeste", label: "NE", name: "Nordeste" },
  { id: "sudesteCentroOeste", label: "SE/CO", name: "Sudeste / C. Oeste" },
  { id: "sul", label: "S", name: "Sul" },
] as const;
type RegionId = (typeof REGIONS)[number]["id"];

const EVENT_TITLES: Record<string, string> = {
  EFFECTIVE_POWER_CHANGED: "Potência efetiva registrada",
  UNIT_REMOVED_FROM_DATASET: "Unidade ausente da observação posterior",
  PRESENTATION_LABEL_CHANGED: "Nome de apresentação alterado",
};

const PHASE_COPY = [
  ["O campo antes do sinal.", "O território orienta a investigação. A localização desta demonstração é ilustrativa; a autoridade está nas observações preservadas."],
  ["Uma diferença pede atenção.", "O pulso marca um Event candidato reconstruído. Ele ainda não é um Signal."],
  ["O que foi observado.", "O evento e seus fatos vêm do parser e do diff aceitos, sem causalidade criada no navegador."],
  ["Abrir o que sustenta a leitura.", "UUIDs, relação de bytes, versões e delta permanecem juntos para inspeção."],
  ["Cada resultado conserva seu porquê.", "PROMOTE, HOLD e REJECT chegam prontos do runtime canônico; esta superfície não os recalcula."],
] as const;

function fact(inspection: ArgosInspectionReadModel | null, key: string, fallback = "—") {
  const value = inspection?.event.facts[key];
  return value === undefined ? fallback : String(value);
}

function deltaSummary(inspection: ArgosInspectionReadModel) {
  const delta = inspection.event.delta;
  if (!delta) return "Sem delta estruturado para este resultado determinístico.";
  const changedFields = delta.changed.reduce((total, row) => total + row.changes.length, 0);
  return `${delta.added.length} adicionada(s) · ${delta.removed.length} removida(s) · ${changedFields} campo(s) alterado(s)`;
}

export function ArgosSignalInspection() {
  const [phase, setPhase] = useState(0);
  const [region, setRegion] = useState<RegionId>("sudesteCentroOeste");
  const [scenarioId, setScenarioId] = useState<ArgosInspectionScenarioId>("promote-effective-power");
  const [inspection, setInspection] = useState<ArgosInspectionReadModel | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [playing, setPlaying] = useState(false);
  const [run, setRun] = useState(0);
  const [line, setLine] = useState({ path: "", width: 1, height: 1 });
  const instrumentRef = useRef<HTMLDivElement>(null);
  const markerRef = useRef<SVGCircleElement>(null);
  const arrivalRef = useRef<HTMLSpanElement>(null);
  const instanceId = useId().replace(/:/g, "");
  const hatchId = `${instanceId}-hatch`;
  const traceMaskId = `${instanceId}-trace-mask`;
  const selectedRegion = REGIONS.find((item) => item.id === region)!;
  const territory = SUBMERCADOS.find((item) => item.id === region)!;
  const decision = inspection?.promotion.decision ?? "HOLD";
  const claim = inspection ? surfaceableClaim(inspection) : null;

  useEffect(() => {
    const controller = new AbortController();
    fetchArgosInspection(scenarioId, controller.signal)
      .then((payload) => setInspection(payload))
      .catch((caught: unknown) => {
        if (caught instanceof DOMException && caught.name === "AbortError") return;
        setInspection(null);
        setError(caught instanceof Error ? caught.message : "Falha de inspeção.");
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [scenarioId]);

  useEffect(() => {
    const instrument = instrumentRef.current;
    if (!instrument) return;
    const measure = () => {
      const area = instrument.getBoundingClientRect();
      const marker = markerRef.current?.getBoundingClientRect();
      const arrival = arrivalRef.current?.getBoundingClientRect();
      if (!marker || !arrival || !area.width) return;
      const x = marker.x + marker.width / 2 - area.x;
      const y = marker.y + marker.height / 2 - area.y;
      const endX = arrival.x + arrival.width / 2 - area.x;
      const endY = arrival.y + arrival.height / 2 - area.y;
      const vertical = arrival.y > marker.bottom + 130;
      const elbowX = x + (endX - x) * 0.66;
      const path = vertical
        ? `M ${x} ${y} H ${area.width - 8} V ${endY - 18} H ${endX} V ${endY}`
        : `M ${x} ${y} H ${elbowX} V ${endY} H ${endX}`;
      setLine({ path, width: area.width, height: area.height });
    };
    const observer = new ResizeObserver(measure);
    observer.observe(instrument);
    if (arrivalRef.current?.parentElement) observer.observe(arrivalRef.current.parentElement);
    measure();
    return () => observer.disconnect();
  }, [region, phase, scenarioId, inspection]);

  useEffect(() => {
    if (!playing || phase === STEPS.length - 1) return;
    const timer = window.setTimeout(() => setPhase((value) => value + 1), [2200, 2200, 3000, 3600][phase]);
    return () => window.clearTimeout(timer);
  }, [playing, phase, run]);

  const goTo = (next: number) => { setPlaying(false); setPhase(next); };
  const play = () => { setPhase(0); setRun((value) => value + 1); setPlaying(true); };
  const inPlayback = playing && phase < 4;
  const eventTitle = inspection ? EVENT_TITLES[inspection.event.kind] ?? inspection.event.kind : "Inspeção indisponível";

  return (
    <section id="argos-signal-inspection" className="g24-argos g24-argos--operator" data-phase={phase} data-result={decision} aria-label="Inspeção operacional do Signal Argos">
      <header className="g24-argos__header">
        <div><span className="g24-argos__kicker">ARGOS / INSPEÇÃO DE SIGNAL V0</span><h1>Do território<br /><em>até a evidência.</em></h1></div>
        <div className="g24-argos__intro"><p>Observar uma mudança.<br />Rastrear o que a sustenta.</p><button className="g24-argos__play" type="button" onClick={inPlayback ? () => setPlaying(false) : play}>{inPlayback ? <Pause size={14} /> : phase === 4 ? <RotateCcw size={14} /> : <Play size={14} />}{inPlayback ? "Pausar percurso" : phase === 4 ? "Rever percurso" : "Ver o percurso"}<span>13 s</span></button></div>
      </header>

      <nav className="g24-argos__steps" aria-label="Etapas da inspeção Argos">
        {STEPS.map((step, index) => <button type="button" key={step} onClick={() => goTo(index)} aria-pressed={phase === index} data-complete={phase > index}><span>{String(index + 1).padStart(2, "0")}</span><span>{step}</span></button>)}
      </nav>
      <p className="g24-argos__announcement" role="status" aria-live="polite" aria-atomic="true">Etapa {phase + 1} de 5: {STEPS[phase]}.{phase === 4 && inspection ? ` ${decision}. ${inspection.promotion.reasonCode}` : ""}</p>

      <div className="g24-argos__instrument" ref={instrumentRef}>
        <div className="g24-argos__territory">
          <div className="g24-argos__field-label"><span>BRASIL / CAMPO DE OBSERVAÇÃO</span><span>01—04</span></div>
          <div className="g24-argos__map-frame">
            <svg className="g24-argos__map" viewBox={BRASIL_VIEWBOX} role="img" aria-label={`Mapa do Brasil: ${selectedRegion.name}. Localização ilustrativa; evidência sintética.`}>
              <defs><pattern id={hatchId} patternUnits="userSpaceOnUse" width="8" height="8" patternTransform="rotate(35)"><line x1="0" y1="0" x2="0" y2="8" stroke="currentColor" strokeWidth=".7" /></pattern></defs>
              <path className="g24-argos__outline" d={BRASIL_OUTLINE_D} />
              {SUBMERCADOS.map((item) => <path key={item.id} d={item.d} className="g24-argos__market" data-selected={item.id === region} />)}
              <path className="g24-argos__hatch" d={territory.d} fill={`url(#${hatchId})`} />
              <g key={`${region}-${run}-${phase === 0}`} transform={`translate(${territory.centroid[0]} ${territory.centroid[1]})`} className="g24-argos__target" aria-hidden="true"><circle className="g24-argos__pulse" r="18" /><path className="g24-argos__focus-frame" d="M-31 -48 H-48 V-31 M31 -48 H48 V-31 M48 31 V48 H31 M-31 48 H-48 V31" /><circle ref={markerRef} className="g24-argos__target-core" r="4" /></g>
            </svg>
            <div className="g24-argos__map-caption"><span>{selectedRegion.label}</span><p>{selectedRegion.name}<small>TERRITÓRIO ILUSTRATIVO</small></p></div>
          </div>
          <div className="g24-argos__regions" role="group" aria-label="Selecionar território ilustrativo">{REGIONS.map((item) => <button type="button" key={item.id} onClick={() => { setRegion(item.id); setPlaying(false); setPhase(1); }} aria-pressed={region === item.id} aria-label={item.name}><span>{item.label}</span><span>{item.name}</span></button>)}</div>
          <p className="g24-argos__geo-note">Geometria territorial existente · recorte demonstrativo. O mapa não localiza o evento real nem concede autoridade ao navegador.</p>
        </div>

        <svg key={`${region}-${run}-${phase >= 2}`} className="g24-argos__trajectory" viewBox={`0 0 ${line.width} ${line.height}`} preserveAspectRatio="none" aria-hidden="true"><defs><mask id={traceMaskId} maskUnits="userSpaceOnUse" x="0" y="0" width={line.width} height={line.height}><path className="g24-argos__trace-reveal" d={line.path} pathLength="1" /></mask></defs><path className="g24-argos__trajectory-base" d={line.path} /><path className="g24-argos__trajectory-draw" d={line.path} mask={`url(#${traceMaskId})`} /></svg>

        <article className="g24-argos__reading" aria-label={`${STEPS[phase]}: cenário sintético snapshot-backed`} onFocusCapture={() => setPlaying(false)}>
          <header className="g24-argos__reading-header"><span ref={arrivalRef} className="g24-argos__arrival" aria-hidden="true" /><span>RUNTIME NIV-51 / {inspection?.scenario.goldReference ?? "—"}</span><span>{String(phase + 1).padStart(2, "0")}</span></header>
          <div className="g24-argos__reading-body" key={`${phase}-${scenarioId}-${loading}`}>
            {loading ? <div className="g24-argos__runtime-state"><span>RECONSTRUINDO SNAPSHOTS</span><p>Nenhum resultado é exibido antes da resposta canônica.</p></div> : error ? <div className="g24-argos__runtime-state" role="alert"><span>FALHA FECHADA</span><p>{error}</p></div> : inspection && phase < 2 ? <><span className="g24-argos__kicker">ANTES DA AFIRMAÇÃO</span><h2>{PHASE_COPY[phase][0]}</h2><p className="g24-argos__description">{PHASE_COPY[phase][1]}</p><div className="g24-argos__waiting"><span className="g24-argos__waiting-mark" aria-hidden="true">{phase === 0 ? "01" : "02"}</span><p>{phase === 0 ? "Território em foco" : eventTitle}<small>{phase === 0 ? "Nenhum claim em exibição" : "Event candidato · resultado ainda fechado"}</small></p></div></> : inspection && phase === 2 ? <><span className="g24-argos__kicker">EVENTO DETERMINÍSTICO</span><h2>{PHASE_COPY[phase][0]}</h2><p className="g24-argos__event-name">{eventTitle}</p><div className="g24-argos__delta"><span>{fact(inspection, "before", fact(inspection, "identity"))}</span><ArrowRight size={20} /><strong>{fact(inspection, "after", inspection.event.kind === "UNIT_REMOVED_FROM_DATASET" ? "AUSENTE" : "—")}</strong><small>{inspection.event.kind === "EFFECTIVE_POWER_CHANGED" ? "MW" : inspection.event.kind}</small></div><dl className="g24-argos__meta"><div><dt>FONTE</dt><dd>{inspection.source.sourceId}</dd></div><div><dt>EVENT</dt><dd>{inspection.event.kind}</dd></div><div><dt>RELAÇÃO</dt><dd>{inspection.event.byteRelation}<small>{deltaSummary(inspection)}</small></dd></div></dl></> : inspection && phase === 3 ? <><span className="g24-argos__kicker">CADEIA DE EVIDÊNCIA</span><h2>{PHASE_COPY[phase][0]}</h2><p className="g24-argos__description">{PHASE_COPY[phase][1]}</p><details className="g24-argos__evidence" data-testid="argos-evidence"><summary>Abrir evidência exata <span>↓</span></summary><ol><li><strong>01 / FROM SNAPSHOT</strong><span>{inspection.observations.fromSnapshotId}</span></li><li><strong>02 / TO SNAPSHOT</strong><span>{inspection.observations.toSnapshotId}</span></li><li><strong>03 / PARSER</strong><span>{inspection.event.parserVersion ?? "não aplicável"}</span></li><li><strong>04 / DIFF</strong><span>{inspection.event.diffVersion ?? "não aplicável"}</span></li><li><strong>05 / BYTES</strong><span>{inspection.event.byteRelation}</span></li></ol><p>{deltaSummary(inspection)}</p></details><ol className="g24-argos__checks"><li><span>01</span><div><strong>Saúde da fonte</strong><p>{inspection.promotion.sourceHealthState}</p></div></li><li><span>02</span><div><strong>Semântica</strong><p>{inspection.promotion.semanticsState}</p></div></li><li><span>03</span><div><strong>Materialidade</strong><p>{inspection.promotion.materialityState}</p></div></li><li><span>04</span><div><strong>Direitos</strong><p>{inspection.promotion.rights.state}</p></div></li></ol></> : inspection ? <><span className="g24-argos__kicker">RESULTADO CANÔNICO</span><h2>{PHASE_COPY[phase][0]}</h2><div className="g24-argos__result"><span>{decision === "PROMOTE" ? "SIGNAL / PROMOTE" : decision}</span><strong>{inspection.promotion.reasonCode}</strong></div>{claim ? <div className="g24-argos__claim"><span>SIGNAL CLAIM PACK</span><p>{claim}</p></div> : <div className="g24-argos__pack"><span>SEM SIGNAL CLAIM PACK</span><p>O Event e a razão continuam examináveis. Nenhum factual_claim foi recebido.</p></div>}<ul className="g24-argos__caveats">{inspection.promotion.caveats.map((item) => <li key={item}>{item}</li>)}</ul><button className="g24-argos__source-descent" type="button" onClick={() => goTo(3)}>Descer até a evidência<ArrowRight size={14} /></button><p className="g24-argos__boundary">{decision === "PROMOTE" ? `Exibição humana · ${inspection.promotion.rights.state}${inspection.promotion.rights.attributionRequired ? " · atribuição requerida" : ""}.` : decision === "HOLD" ? "Uma condição obrigatória permanece não resolvida. Ausência não significa zero." : "A observação é preservada, mas não constitui Signal."}</p></> : null}
          </div>
          <div className="g24-argos__reading-foot"><span>SNAPSHOTS SINTÉTICOS · RUNTIME REAL</span><span>{loading ? "CARREGANDO" : error ? "FAIL CLOSED" : decision}</span></div>
        </article>
      </div>

      <div className="g24-argos__scenarios"><span>CENÁRIOS<br />SERVER-OWNED</span><div role="group" aria-label="Selecionar cenário de inspeção">{ARGOS_INSPECTION_SCENARIOS.map((scenario, index) => <button type="button" key={scenario.id} aria-pressed={scenarioId === scenario.id} onClick={() => { setLoading(true); setError(null); setInspection(null); setScenarioId(scenario.id); setPlaying(false); }}><span>{String(index + 1).padStart(2, "0")}</span>{scenario.label}<small>{scenario.goldReference}</small></button>)}</div></div>
      <footer className="g24-argos__footer"><p>NIV-52 <span>·</span> SEM DADO AO VIVO <span>·</span> SEM MUTATION</p><div><button type="button" onClick={() => goTo(phase - 1)} disabled={phase === 0} aria-label="Etapa anterior"><ArrowLeft size={16} /></button>{phase < 4 ? <button type="button" className="g24-argos__next" onClick={() => goTo(phase + 1)}>{STEPS[phase + 1]}<ArrowRight size={16} /></button> : <Link to="/br/terminal">Explorar Terminal Brasil<ArrowUpRight size={16} /></Link>}</div></footer>
    </section>
  );
}

export default ArgosSignalInspection;
