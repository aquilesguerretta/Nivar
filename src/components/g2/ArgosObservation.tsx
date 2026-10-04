import { useEffect, useId, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight, Pause, Play, RotateCcw } from "lucide-react";
import { Link } from "react-router-dom";
import { BRASIL_OUTLINE_D, BRASIL_VIEWBOX, SUBMERCADOS } from "../../lib/geo/brasil-outline";
import "./argos-observation.css";

const STEPS = ["Território", "Detecção", "Evidência", "Avaliação", "Resultado"] as const;
const REGIONS = [
  { id: "norte", label: "N", name: "Norte" },
  { id: "nordeste", label: "NE", name: "Nordeste" },
  { id: "sudesteCentroOeste", label: "SE/CO", name: "Sudeste / C. Oeste" },
  { id: "sul", label: "S", name: "Sul" },
] as const;
type RegionId = (typeof REGIONS)[number]["id"];
type CaseId = "record" | "missing" | "editorial";

// NIV-53: visual fixtures only. These bounded scenarios follow SG-004/018/013;
// no runtime calls, storage, eligibility calculation or operator actions.
const CASES = {
  record: {
    label: "Registro alterado", caseRef: "SG-004", code: "PROMOTE", result: "SIGNAL / PROMOTE",
    title: "Potência efetiva registrada", before: "20,0", after: "22,5", unit: "MW",
    observation: "O campo de potência efetiva registrado mudou entre duas observações preservadas.",
    reason: "Mudança material e reconstruível.",
    explanation: "A cadeia sustenta um fato delimitado. O evento pode ser apresentado como Signal, junto de sua evidência e de seus limites.",
    gates: [["Evidência", "Reconstruível"], ["Semântica", "Campo compreendido"], ["Materialidade", "Presente neste caso"], ["Uso", "Exibição humana permitida"]],
  },
  missing: {
    label: "Evidência indisponível", caseRef: "SG-018", code: "HOLD", result: "HOLD",
    title: "Uma referência ainda falta", before: "—", after: "—", unit: "SEM COMPARAÇÃO",
    observation: "Uma referência necessária não pode ser reconstruída neste cenário. Não há base para afirmar um valor de mudança.",
    reason: "Evidência não reconstruível.",
    explanation: "O evento permanece em exame. A lacuna fica visível e nenhum Signal é emitido até que a evidência possa ser reconstruída.",
    gates: [["Evidência", "Referência indisponível"], ["Semântica", "Avaliação não concluída"], ["Materialidade", "Não afirmada"], ["Uso", "Nenhum Signal emitido"]],
  },
  editorial: {
    label: "Mudança editorial", caseRef: "SG-013", code: "REJECT", result: "REJECT",
    title: "Mudou a apresentação", before: "A", after: "A′", unit: "NOME EXIBIDO",
    observation: "Mudou apenas o nome de apresentação. Os campos substantivos permaneceram estáveis neste cenário.",
    reason: "Alteração apenas de apresentação.",
    explanation: "A diferença continua examinável, mas não constitui um Signal elegível. O registro é preservado; a promoção não ocorre.",
    gates: [["Evidência", "Reconstruível"], ["Semântica", "Apenas apresentação"], ["Materialidade", "Ausente neste caso"], ["Uso", "Nenhum Signal emitido"]],
  },
} as const;

const PHASE_COPY = [
  ["O campo antes do sinal.", "Selecione um território. A observação começa com um recorte, antes de qualquer afirmação."],
  ["Uma diferença pede atenção.", "O pulso marca uma mudança demonstrativa. A linha segue sua origem; o evento ainda não é um Signal."],
  ["Abrir o que sustenta a leitura.", "Observação, referência e limite permanecem juntos. Nada é promovido só porque mudou."],
  ["A evidência encontra o critério.", "Reconstrução, semântica, materialidade e uso delimitam a avaliação do evento."],
  ["Cada resultado conserva seu porquê.", "Promover, manter em exame ou rejeitar a promoção: três desfechos distintos, com a razão à vista."],
] as const;

export function ArgosObservation() {
  const [phase, setPhase] = useState(0);
  const [region, setRegion] = useState<RegionId>("sudesteCentroOeste");
  const [caseId, setCaseId] = useState<CaseId>("record");
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
  const scenario = CASES[caseId];

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
      // Deliberately measured, segmented trace: an observation-to-proof relation,
      // not Ariadne's organic continuity thread. Elbows stay between the endpoints.
      const elbowX = x + (endX - x) * .66;
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
  }, [region, phase, caseId]);

  useEffect(() => {
    if (!playing) return;
    if (phase === STEPS.length - 1) return;
    const timer = window.setTimeout(() => setPhase((value) => value + 1), [2600, 2400, 3600, 3400][phase]);
    return () => window.clearTimeout(timer);
  }, [playing, phase, run]);

  const goTo = (next: number) => { setPlaying(false); setPhase(next); };
  const play = () => { setPhase(0); setRun((value) => value + 1); setPlaying(true); };
  const inPlayback = playing && phase < 4;

  return (
    <section id="argos-observation" className="g24-argos g2-container" data-phase={phase} data-result={scenario.code} aria-label="Demonstração da linguagem de observação Argos">
      <header className="g24-argos__header">
        <div>
          <span className="g24-argos__kicker">ARGOS / CADERNO DE OBSERVAÇÃO</span>
          <h2>Do território<br /><em>até a evidência.</em></h2>
        </div>
        <div className="g24-argos__intro">
          <p>Observar uma mudança.<br />Rastrear o que a sustenta.</p>
          <button className="g24-argos__play" type="button" onClick={inPlayback ? () => setPlaying(false) : play}>
            {inPlayback ? <Pause size={14} /> : phase === 4 ? <RotateCcw size={14} /> : <Play size={14} />}
            {inPlayback ? "Pausar percurso" : phase === 4 ? "Rever percurso" : "Ver o percurso"}
            <span>12 s</span>
          </button>
        </div>
      </header>

      <nav className="g24-argos__steps" aria-label="Etapas da observação Argos">
        {STEPS.map((step, index) => (
          <button type="button" key={step} onClick={() => goTo(index)} aria-pressed={phase === index} data-complete={phase > index}>
            <span>{String(index + 1).padStart(2, "0")}</span><span>{step}</span>
          </button>
        ))}
      </nav>
      <p className="g24-argos__announcement" role="status" aria-live="polite" aria-atomic="true">Etapa {phase + 1} de 5: {STEPS[phase]}.{phase === 4 ? ` ${scenario.result}. ${scenario.reason}` : ""}</p>

      <div className="g24-argos__instrument" ref={instrumentRef}>
        <div className="g24-argos__territory">
          <div className="g24-argos__field-label"><span>BRASIL / CAMPO DE OBSERVAÇÃO</span><span>01—04</span></div>
          <div className="g24-argos__map-frame">
            <svg className="g24-argos__map" viewBox={BRASIL_VIEWBOX} role="img" aria-label={`Mapa do Brasil: ${selectedRegion.name}. Localização ilustrativa, evento sintético.`}>
              <defs><pattern id={hatchId} patternUnits="userSpaceOnUse" width="8" height="8" patternTransform="rotate(35)"><line x1="0" y1="0" x2="0" y2="8" stroke="currentColor" strokeWidth=".7" /></pattern></defs>
              <path className="g24-argos__outline" d={BRASIL_OUTLINE_D} />
              {SUBMERCADOS.map((item) => <path key={item.id} d={item.d} className="g24-argos__market" data-selected={item.id === region} />)}
              <path className="g24-argos__hatch" d={territory.d} fill={`url(#${hatchId})`} />
              <g key={`${region}-${run}-${phase === 0}`} transform={`translate(${territory.centroid[0]} ${territory.centroid[1]})`} className="g24-argos__target" aria-hidden="true">
                <circle className="g24-argos__pulse" r="18" />
                <path className="g24-argos__focus-frame" d="M-31 -48 H-48 V-31 M31 -48 H48 V-31 M48 31 V48 H31 M-31 48 H-48 V31" />
                <circle ref={markerRef} className="g24-argos__target-core" r="4" />
              </g>
            </svg>
            <div className="g24-argos__map-caption"><span>{selectedRegion.label}</span><p>{selectedRegion.name}<small>TERRITÓRIO ILUSTRATIVO</small></p></div>
          </div>
          <div className="g24-argos__regions" role="group" aria-label="Selecionar território ilustrativo">
            {REGIONS.map((item) => <button type="button" key={item.id} onClick={() => { setRegion(item.id); setPlaying(false); setPhase(1); }} aria-pressed={region === item.id} aria-label={item.name}><span>{item.label}</span><span>{item.name}</span></button>)}
          </div>
          <p className="g24-argos__geo-note">Malha IBGE · recorte por submercado. A seleção explora a composição; não localiza um evento real.</p>
        </div>

        <svg key={`${region}-${run}-${phase >= 2}`} className="g24-argos__trajectory" viewBox={`0 0 ${line.width} ${line.height}`} preserveAspectRatio="none" aria-hidden="true">
          <defs><mask id={traceMaskId} maskUnits="userSpaceOnUse" x="0" y="0" width={line.width} height={line.height}><path className="g24-argos__trace-reveal" d={line.path} pathLength="1" /></mask></defs>
          <path className="g24-argos__trajectory-base" d={line.path} />
          <path className="g24-argos__trajectory-draw" d={line.path} mask={`url(#${traceMaskId})`} />
        </svg>

        <article className="g24-argos__reading" aria-label={`${STEPS[phase]}: cenário sintético`} onFocusCapture={() => setPlaying(false)}>
          <header className="g24-argos__reading-header"><span ref={arrivalRef} className="g24-argos__arrival" aria-hidden="true" /><span>REGISTRO DEMONSTRATIVO / {scenario.caseRef}</span><span>{String(phase + 1).padStart(2, "0")}</span></header>
          <div className="g24-argos__reading-body" key={`${phase}-${caseId}`}>
            <span className="g24-argos__kicker">{phase < 2 ? "ANTES DA AFIRMAÇÃO" : phase === 2 ? "CADEIA DE EVIDÊNCIA" : phase === 3 ? "CRITÉRIOS DE ELEGIBILIDADE" : "RESULTADO ILUSTRATIVO"}</span>
            <h3>{phase !== 4 ? PHASE_COPY[phase][0] : caseId === "record" ? "Uma mudança sustentada." : caseId === "missing" ? "O limite permanece visível." : "Nem toda diferença é um sinal."}</h3>
            {phase < 2 ? <>
              <p className="g24-argos__description">{PHASE_COPY[phase][1]}</p>
              <div className="g24-argos__waiting"><span className="g24-argos__waiting-mark" aria-hidden="true">{phase === 0 ? "01" : "02"}</span><p>{phase === 0 ? "Território em foco" : scenario.title}<small>{phase === 0 ? "Nenhum evento em exame" : "Candidato observado · ainda sem resultado"}</small></p></div>
            </> : phase === 2 ? <>
              <p className="g24-argos__event-name">{scenario.title}</p>
              <div className="g24-argos__delta"><span>{scenario.before}</span><ArrowRight size={20} /><strong>{scenario.after}</strong><small>{scenario.unit}</small></div>
              <dl className="g24-argos__meta"><div><dt>ONDE</dt><dd>{selectedRegion.label} · unidade fictícia</dd></div><div><dt>QUANDO</dt><dd>{caseId === "missing" ? "Sem par de observações reconstruível" : "Observação A → Observação B"}</dd></div><div><dt>FONTE</dt><dd>ons.capacidade_geracao<small>Referência do cenário; sem consulta ao vivo</small></dd></div></dl>
              <details className="g24-argos__evidence" onToggle={(event) => { if (event.currentTarget.open) setPlaying(false); }}><summary>Abrir cadeia de evidência <span>↓</span></summary><ol><li><strong>01 / OBSERVAÇÃO</strong><span>{caseId === "missing" ? "Reconstrução indisponível" : "Duas observações preservadas no cenário"}</span></li><li><strong>02 / EVENTO DETERMINÍSTICO</strong><span>{caseId === "record" ? "Mudança no campo de potência efetiva" : caseId === "editorial" ? "Alteração apenas no nome de apresentação" : "Evento em exame; evidência requerida ausente"}</span></li><li><strong>03 / FONTE</strong><span>ons.capacidade_geracao · referência conceitual</span></li><li><strong>04 / EVIDÊNCIA</strong><span>{caseId === "missing" ? "DEMO-REF-AUSENTE · sem par reconstruível" : "DEMO-OBS-A → DEMO-OBS-B · fixtures sintéticas"}</span></li></ol><p>{scenario.observation}</p></details>
            </> : phase === 3 ? <>
              <p className="g24-argos__description">{PHASE_COPY[phase][1]}</p>
              <ol className="g24-argos__checks">{scenario.gates.map(([label, value], index) => <li key={label}><span>{String(index + 1).padStart(2, "0")}</span><div><strong>{label}</strong><p>{value}</p></div></li>)}</ol>
              <p className="g24-argos__boundary">A avaliação delimita um Signal. Não recomenda uma decisão para uma organização.</p>
            </> : <>
              <div className="g24-argos__result"><span>{scenario.result}</span><strong>{scenario.reason}</strong></div>
              <p className="g24-argos__description">{scenario.explanation}</p>
              <div className="g24-argos__pack"><span>{caseId === "record" ? "SIGNAL CLAIM PACK" : "SEM SIGNAL CLAIM PACK"}</span><p>{caseId === "record" ? "Fato delimitado + evidência + ressalvas + direitos." : "O evento e a razão continuam examináveis."}</p></div>
              <button className="g24-argos__source-descent" type="button" onClick={() => goTo(2)}>Descer até a evidência<ArrowRight size={14} /></button>
              <p className="g24-argos__boundary">{caseId === "record" ? "Mudança no campo registrado. Não afirma expansão física, investimento ou causa." : "Nenhum Signal é emitido neste cenário."}</p>
            </>}
          </div>
          <div className="g24-argos__reading-foot"><span>EXEMPLO SINTÉTICO</span><span>{phase < 4 ? "RESULTADO NÃO EMITIDO" : scenario.code}</span></div>
        </article>
      </div>

      <div className="g24-argos__scenarios"><span>CENÁRIOS<br />DEMONSTRATIVOS</span><div role="group" aria-label="Explorar cenários sintéticos">{(Object.keys(CASES) as CaseId[]).map((id, index) => <button type="button" key={id} aria-pressed={caseId === id} onClick={() => { setCaseId(id); setPlaying(false); }}><span>{String(index + 1).padStart(2, "0")}</span>{CASES[id].label}</button>)}</div></div>
      <footer className="g24-argos__footer">
        <p>ESTUDO VISUAL NIV-53 <span>·</span> SEM DADO AO VIVO</p>
        <div><button type="button" onClick={() => goTo(phase - 1)} disabled={phase === 0} aria-label="Etapa anterior"><ArrowLeft size={16} /></button>{phase < 4 ? <button type="button" className="g24-argos__next" onClick={() => goTo(phase + 1)}>{STEPS[phase + 1]}<ArrowRight size={16} /></button> : <Link to="/br/terminal">Explorar Terminal Brasil<ArrowUpRight size={16} /></Link>}</div>
      </footer>
    </section>
  );
}
