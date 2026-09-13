import { lazy, Suspense, useCallback, useEffect, useRef, useState } from "react";
import { ArrowUpRight, Pause, Play, RotateCcw } from "lucide-react";
import { Link } from "react-router-dom";
import { FamilyEmblem, Wordmark } from "./Brand";
import { TerminalReading } from "../../pages/terminal-brasil/TerminalReading";
import { formatValue, getSeries, SAMPLE_VERSION } from "../../pages/terminal-brasil/sample";
import "./hero-film.css";

const Instrument = lazy(() => import("./HeroInstrument"));
const SERIES = getSeries("sudesteCentroOeste", "24h", "load");
const OBSERVATION = SERIES[18];
const TERMINAL_HREF = "/br/terminal?region=sudesteCentroOeste&period=24h&metric=load&observation=18";
const DURATION = 32;
const SCENES = [
  { start: 0, id: "realidade", family: "house", patron: "A casa", verb: "Realidade", title: "Tudo começa fora da tela.", detail: "Território, infraestrutura, matéria. A realidade vem primeiro." },
  { start: 4, id: "medir", family: "hardware", patron: "Hefesto", verb: "Medir", title: "Um instante ganha medida.", detail: "A grandeza só faz sentido com unidade, instante e origem." },
  { start: 9, id: "organizar", family: "software", patron: "Ariadne", verb: "Organizar", title: "O registro encontra seu lugar.", detail: "A fonte e o período acompanham cada observação." },
  { start: 13, id: "observar", family: "intelligence", patron: "Argos", verb: "Observar", title: "Um ponto passa a ter contexto.", detail: "A janela revela o que o número isolado não mostra." },
  { start: 18, id: "questionar", family: "advisory", patron: "Sócrates", verb: "Questionar", title: "Uma alta. Qual explicação?", detail: "A curva mostra uma mudança. Não demonstra sua causa." },
  { start: 23, id: "transmitir", family: "academy", patron: "Perseu", verb: "Transmitir", title: "A leitura circula com seus limites.", detail: "O registro pode ser levado adiante — e examinado por outra pessoa." },
  { start: 27, id: "procurar", family: "house", patron: "Diógenes", verb: "Procurar", title: "A investigação está aberta.", detail: "O mesmo registro. Agora, um instrumento para continuar." },
] as const;
const sceneAt = (time: number) => SCENES.reduce((found, scene, index) => time >= scene.start ? index : found, 0);
const smooth = (time: number, from: number, to: number) => { const p = Math.max(0, Math.min(1, (time - from) / (to - from))); return p * p * (3 - 2 * p); };

/** One directed clock. Source footage and the evidence sheet have separate physical
 * planes. The exact Terminal fixture continues from the first record to the link. */
export function HeroFilm({ className = "" }: { className?: string }) {
  const stage = useRef<HTMLElement>(null);
  const clock = useRef(0);
  const active = useRef(0);
  const calibration = useRef<HTMLVideoElement>(null);
  const optical = useRef<HTMLVideoElement>(null);
  const [scene, setScene] = useState(0);
  const [reduced, setReduced] = useState(() => matchMedia("(prefers-reduced-motion: reduce)").matches);
  const [still, setStill] = useState(() => matchMedia("(prefers-reduced-motion: reduce)").matches);
  const [playing, setPlaying] = useState(true);
  const [complete, setComplete] = useState(false);
  const [inView, setInView] = useState(false);
  const [visible, setVisible] = useState(!document.hidden);
  const [mediaFailed, setMediaFailed] = useState(false);
  const [mediaReady, setMediaReady] = useState(false);
  const staticMode = still || reduced;
  const current = SCENES[staticMode ? 6 : scene];
  const running = playing && !complete && !staticMode && inView && visible;

  const draw = useCallback((seconds: number) => {
    const el = stage.current;
    if (!el) return;
    el.dataset.filmTime = seconds.toFixed(3);
    const properties = {
      "landscape-cut": smooth(seconds, 2.35, 2.8),
      "territory-out": smooth(seconds, 3.65, 4.2),
      "sheet-enter": smooth(seconds, 4.25, 5.1),
      "sheet-expand": smooth(seconds, 12.55, 13.45),
      "instrument-reveal": smooth(seconds, 13.05, 14.15),
      "full-instrument": smooth(seconds, 26.65, 27.6),
      "world-drift": seconds / DURATION,
      "reading-settle": smooth(seconds, 8.65, 9.4),
    };
    Object.entries(properties).forEach(([name, value]) => el.style.setProperty(`--${name}`, String(value)));
  }, []);

  useEffect(() => {
    const motion = matchMedia("(prefers-reduced-motion: reduce)");
    const preference = () => { setReduced(motion.matches); if (motion.matches) setStill(true); };
    const visibility = () => setVisible(!document.hidden);
    motion.addEventListener("change", preference);
    document.addEventListener("visibilitychange", visibility);
    const observer = new IntersectionObserver(([entry]) => {
      setInView(entry.isIntersecting && entry.intersectionRatio > .12);
      if (entry.isIntersecting) setMediaReady(true);
    }, { threshold: [0, .12] });
    if (stage.current) observer.observe(stage.current);
    return () => { observer.disconnect(); motion.removeEventListener("change", preference); document.removeEventListener("visibilitychange", visibility); };
  }, []);

  useEffect(() => {
    draw(staticMode ? DURATION : clock.current);
    if (!running) return;
    let frame = 0, previous = 0;
    const tick = (now: number) => {
      if (previous) clock.current = Math.min(DURATION, clock.current + Math.min(now - previous, 100) / 1000);
      previous = now;
      draw(clock.current);
      const next = sceneAt(clock.current);
      if (next !== active.current) { active.current = next; setScene(next); }
      if (clock.current >= DURATION) { setComplete(true); return; }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [running, staticMode, draw]);

  // Native media is stopped when the clock stops, the scene exits, or the tab hides.
  // It plays once. No videos or autoplay requests are mounted in reduced motion.
  useEffect(() => {
    const synchronize = (video: HTMLVideoElement | null, start: number, end: number) => {
      if (!video) return;
      if (running && clock.current >= start && clock.current < end) {
        if (Math.abs(video.currentTime - (clock.current - start)) > .4) video.currentTime = Math.max(0, clock.current - start);
        void video.play().catch(() => setMediaFailed(true));
      } else video.pause();
    };
    synchronize(calibration.current, 4, 10);
    synchronize(optical.current, 23, 27);
  }, [running, scene, mediaReady]);

  const replay = () => {
    if (reduced) return;
    clock.current = 0; active.current = 0;
    setScene(0); setStill(false); setComplete(false); setPlaying(true); draw(0);
    if (calibration.current) calibration.current.currentTime = 0;
    if (optical.current) optical.current.currentTime = 0;
  };
  const toggleStill = () => {
    if (staticMode) replay();
    else { setStill(true); setPlaying(false); }
  };
  const openInstrument = staticMode || scene >= 6;
  const records = [0, 6, 12, 18].map(index => SERIES[index]);

  return <figure id="filme-do-metodo" ref={stage} className={`g231-hero-film ${className}`}
    data-scene={current.id} data-playing={running} data-static={staticMode} data-complete={complete}
    aria-label="Da realidade ao instrumento: filme de método NIVAR">
    <div className="g231-film-stage">
      <div className="g231-world" aria-hidden="true">
        <picture className="g231-world-reservoir"><source media="(max-width:700px)" srcSet="/g2/g231/hero/real/tucurui-reservoir-mobile.webp" /><img src="/g2/g231/hero/real/tucurui-reservoir.webp" alt="" decoding="async" /></picture>
        <picture className="g231-world-transmission"><source media="(max-width:700px)" srcSet="/g2/g231/hero/real/transmission-landscape-mobile.webp" /><img src="/g2/g231/hero/real/transmission-landscape.webp" alt="" decoding="async" /></picture>
      </div>
      <div className="g231-film-topline"><span><Wordmark height={16} /><i />CADERNO DE CAMPO / 01</span><span>BRASIL{(complete || staticMode) ? !reduced && <button onClick={replay} aria-label="Rever filme desde o início"><RotateCcw size={14} /></button> : <button onClick={() => setPlaying(value => !value)} aria-label={playing ? "Pausar filme" : "Reproduzir filme"}>{playing ? <Pause size={14} /> : <Play size={14} />}</button>}</span></div>
      {current.id === "realidade" && <div className="g231-territory-copy"><span>TERRITÓRIO / INFRAESTRUTURA</span><h2>Antes de ser dado,<br /><em>é mundo.</em></h2><p>Um lugar. Uma escala.<br />Uma pergunta por fazer.</p></div>}
      <div className="g231-material" aria-hidden="true">
        <div className="g231-material-calibration">
          <img src="/g2/g231/hero/editorial/calibration-poster.webp" alt="" />
          {mediaReady && !staticMode && <video ref={calibration} muted playsInline preload="none" poster="/g2/g231/hero/editorial/calibration-poster.webp" onError={() => setMediaFailed(true)}><source src="/g2/g231/hero/editorial/calibration-960.mp4" type="video/mp4" /></video>}
        </div>
        <div className="g231-material-optical">
          <img src="/g2/g231/hero/editorial/optical-poster.webp" alt="" />
          {mediaReady && !staticMode && <video ref={optical} muted playsInline preload="none" poster="/g2/g231/hero/editorial/optical-poster.webp" onError={() => setMediaFailed(true)}><source src="/g2/g231/hero/editorial/optical-960.mp4" type="video/mp4" /></video>}
        </div>
      </div>
      <div className="g231-sheet" aria-hidden={scene === 0 && !staticMode} inert={scene === 0 && !staticMode}>
        <div className="g231-sheet-heading"><span>REGISTRO / 18h</span><span>ENSAIO INDEPENDENTE · BASE SINTÉTICA</span></div>
        <div className="g231-evidence-layout">
          <aside className="g231-record">
            <div className="g231-record-patron"><FamilyEmblem family={current.family} size={24} decorative /><span>{current.patron} / {current.verb}</span></div>
            <TerminalReading region="sudesteCentroOeste" metric="load" observation={OBSERVATION} compact />
            <div className="g231-record-origin"><span>10 SET 2026 · UTC−3</span><span>{SAMPLE_VERSION}</span></div>
            <div className="g231-margin-note" key={current.id}>
              {scene === 4 && !staticMode ? <><span>A PERGUNTA</span><h3>O que explica<br /><em>esta alta?</em></h3><p>A curva localiza uma mudança.<br />A causa ainda exige evidência.</p></> : scene === 5 && !staticMode ? <><span>NOTA PARA OUTRA PESSOA</span><h3>Levar a leitura.<br /><em>E o limite.</em></h3><p>Uma série demonstrativa.<br />Nenhuma causa estabelecida.</p></> : openInstrument ? <><span>NULLIUS IN VERBA.</span><h3>O que falta<br /><em>observar?</em></h3><Link to={TERMINAL_HREF}>Continuar no Terminal <ArrowUpRight size={17} /></Link></> : scene >= 3 ? <><span>JANELA / 24 HORAS</span><h3>Um ponto.<br /><em>Um contexto.</em></h3><p>O mesmo registro, agora entre<br />as outras observações.</p></> : null}
            </div>
          </aside>
          <div className="g231-register" aria-hidden={scene !== 2 || staticMode}>
            <div className="g231-register-header"><span>INSTANTE</span><span>CARGA / GW</span></div>
            {records.map((point, index) => <div className="g231-register-row" key={point.index} data-selected={point.index === 18} style={{ "--row": index } as React.CSSProperties}><time>{point.label}</time><strong>{formatValue(point.value, "load")}</strong><span>{point.index === 18 ? "REGISTRO EM EXAME" : "SE/CO"}</span></div>)}
            <p>4 registros destacados de 24.<br />A unidade e a origem permanecem juntas.</p>
          </div>
          <div className="g231-instrument" inert={!openInstrument} aria-hidden={!openInstrument}>
            <div className="g231-instrument-heading"><span><FamilyEmblem family="software" size={20} decorative />NIVAR / TERMINAL BRASIL</span><span>CARGA · SE/CO · 24h</span></div>
            {(scene >= 2 || staticMode) && <Suspense fallback={<div className="g231-instrument-loading">Preparando o instrumento…</div>}><Instrument /></Suspense>}
            <div className="g231-instrument-source"><span>BASE SINTÉTICA · SEM DADO DE MERCADO CONECTADO</span><span>10.09.2026</span></div>
          </div>
        </div>
        <div className="g231-sheet-foot"><span>{scene < 3 && !staticMode ? "UMA GRANDEZA. UMA UNIDADE. UM INSTANTE." : "OBSERVAR NÃO É CONCLUIR."}</span><span>SÉRIE DEMONSTRATIVA · NÃO DESCREVE AS FOTOGRAFIAS</span></div>
      </div>
      <div className="g231-film-credit"><span>{current.id === "realidade" ? "TUCURUÍ, 2008 / TRANSMISSÃO NO BRASIL, 2012 · FOTOGRAFIAS HISTÓRICAS" : "MATÉRIA E LUZ · PLANOS EDITORIAIS GERADOS"}{mediaFailed ? " · IMAGEM FIXA DISPONÍVEL" : ""}</span><a href="/g2/g231/hero/real/credits.html" target="_blank" rel="noreferrer">Fontes e criação ↗</a></div>
    </div>
    <figcaption className="g231-film-caption"><div><span>{current.patron} / {current.verb}</span><h2>{current.title}</h2><p>{current.detail}</p></div><div className="g231-film-controls">{(complete || staticMode) && !reduced && <button onClick={replay}><RotateCcw size={14} />Rever o filme</button>}<button onClick={toggleStill} disabled={reduced} aria-pressed={staticMode}>{staticMode ? "Leitura sem movimento" : "Ver sem movimento"}</button></div></figcaption>
    <details className="g231-film-transcript"><summary>Ler a sequência e verificar suas origens</summary><ol>{SCENES.map(item => <li key={item.id}><strong>{item.patron} / {item.verb}.</strong> {item.detail}</li>)}</ol><p>Fotografias históricas reais: reservatório e usina de Tucuruí, 2008; transmissão no Brasil, 2012. As cenas de calibração e transmissão óptica são criações editoriais geradas, sem representar um equipamento ou local real.</p><p>O registro de 68,1 GW às 18h pertence à base sintética do próprio Terminal: SE/CO, carga, 10/09/2026. O filme usa os mesmos dados, gráfico e componente de observação do produto. A série não representa Tucuruí, a fotografia de transmissão nem uma medição do SIN. O destino mantém região, métrica, período e observação.</p><p>O filme termina uma vez. A preferência de movimento reduzido abre a leitura estática sem carregar vídeos; “Ver sem movimento” oferece a mesma leitura a qualquer visitante.</p><a href="/g2/g231/hero/real/credits.html" target="_blank" rel="noreferrer">Autoria, licenças e criação ↗</a></details>
  </figure>;
}
