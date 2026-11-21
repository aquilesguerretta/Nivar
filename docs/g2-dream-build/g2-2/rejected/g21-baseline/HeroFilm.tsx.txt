import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Pause, Play, RotateCcw } from "lucide-react";
import { Wordmark } from "./Brand";
import "./hero-film.css";

const CHAPTER_MS = 4000;
const FILM_MS = CHAPTER_MS * 6;
const CHAPTERS = [
  { id: "medir", verb: "Medir", family: "Hardware", title: "A realidade vem primeiro.", detail: "Uma grandeza. Um instante. Um registro." },
  { id: "organizar", verb: "Organizar", family: "Software", title: "O dado ganha companhia.", detail: "Fonte, período e unidade permanecem juntos." },
  { id: "observar", verb: "Observar", family: "Intelligence", title: "O que a sequência sugere?", detail: "De 68 a 108 MW. A cobertura sustenta essa leitura?" },
  { id: "questionar", verb: "Questionar", family: "Advisory", title: "A conclusão precisa resistir.", detail: "Dois intervalos ausentes. Tendência não demonstrada." },
  { id: "transmitir", verb: "Transmitir", family: "Academy", title: "Uma leitura que pode ser examinada.", detail: "A interpretação circula com seus limites." },
  { id: "procurar", verb: "Procurar", family: "NIVAR", title: "O dado não encerra a pergunta.", detail: "A investigação continua. A evidência permanece aberta." },
] as const;
const SAMPLES = [68, 64, null, 81, null, 108];

/** A 24-second authored composition. Generated footage establishes territory and
 * material; native UI carries one explicitly synthetic evidence record.
 * Images do not identify a power plant or constitute the source of this series. */
export function HeroFilm({ className = "" }: { className?: string }) {
  const stageRef = useRef<HTMLElement>(null);
  const progressRef = useRef<HTMLSpanElement>(null);
  const timeRef = useRef<HTMLSpanElement>(null);
  const elapsedRef = useRef(0);
  const activeRef = useRef(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [chapter, setChapter] = useState(0);
  const [playing, setPlaying] = useState(() => !window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  const [visible, setVisible] = useState(!document.hidden);
  const [inView, setInView] = useState(true);
  const [failed, setFailed] = useState(false);
  const [compact, setCompact] = useState(() => window.matchMedia("(max-width: 700px)").matches);
  const running = playing && visible && inView;
  const current = CHAPTERS[chapter];
  const scene = chapter === 4 ? "document-evidence" : chapter === 1 ? "hydro-flow" : "transmission-locked";

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const viewport = window.matchMedia("(max-width: 700px)");
    const onViewport = () => setCompact(viewport.matches);
    const onPreference = () => { if (media.matches) setPlaying(false); };
    const onVisibility = () => setVisible(!document.hidden);
    media.addEventListener("change", onPreference);
    viewport.addEventListener("change", onViewport);
    document.addEventListener("visibilitychange", onVisibility);
    const observer = new IntersectionObserver(([entry]) => setInView(entry.intersectionRatio >= 0.12), { threshold: 0.12 });
    if (stageRef.current) observer.observe(stageRef.current);
    return () => { media.removeEventListener("change", onPreference); viewport.removeEventListener("change", onViewport); document.removeEventListener("visibilitychange", onVisibility); observer.disconnect(); };
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (running) void video.play().catch(() => { /* Poster and manual transport remain available. */ });
    else video.pause();
  }, [running, scene, compact]);

  useEffect(() => {
    if (!running) return;
    let frame = 0;
    let previous = 0;
    const advance = (now: number) => {
      if (previous) elapsedRef.current = (elapsedRef.current + Math.min(now - previous, 100)) % FILM_MS;
      previous = now;
      const next = Math.floor(elapsedRef.current / CHAPTER_MS);
      if (activeRef.current !== next) { activeRef.current = next; setChapter(next); }
      if (progressRef.current) progressRef.current.style.transform = `scaleX(${(elapsedRef.current % CHAPTER_MS) / CHAPTER_MS})`;
      if (timeRef.current) timeRef.current.textContent = `${String(Math.floor(elapsedRef.current / 1000)).padStart(2, "0")} / 24 s`;
      frame = requestAnimationFrame(advance);
    };
    frame = requestAnimationFrame(advance);
    return () => cancelAnimationFrame(frame);
  }, [running]);

  const selectChapter = (index: number) => {
    setPlaying(false);
    elapsedRef.current = index * CHAPTER_MS;
    activeRef.current = index;
    setChapter(index);
    if (progressRef.current) progressRef.current.style.transform = "scaleX(0)";
    if (timeRef.current) timeRef.current.textContent = `${String(index * 4).padStart(2, "0")} / 24 s`;
  };

  return (
    <figure className={`g2-hero-film ${className}`} ref={stageRef} data-chapter={current.id} data-playing={running} aria-label="O método NIVAR, em seis movimentos">
      <div className="g2-film-stage">
        <div className="g2-film-cinema" aria-hidden="true">
          <video key={`${scene}-${compact ? "mobile" : "desktop"}`} ref={videoRef} muted loop playsInline preload="metadata" poster={`/g2/g21/${scene}-${compact ? "mobile" : "desktop"}-poster.webp`} onCanPlay={() => setFailed(false)} onError={() => setFailed(true)}>
            <source src={`/g2/g21/${scene}-mobile.mp4`} media="(max-width: 700px)" type="video/mp4" />
            <source src={`/g2/g21/${scene}-desktop.mp4`} type="video/mp4" />
          </video>
          <div className="g2-film-cinema-shade" /><div className="g2-film-cinema-grain" />
        </div>
        <div className="g2-film-topline"><span>CADERNO DE EVIDÊNCIA VIVO</span><span><i /> BRASIL / FILME DE MÉTODO<button className="g21-film-stage-pause" onClick={() => setPlaying((v) => !v)} aria-label={playing ? "Pausar animação de abertura" : "Reproduzir animação de abertura"}>{playing ? <Pause size={13} /> : <Play size={13} />}</button></span></div>
        <div className="g2-film-territory-label" aria-hidden="true"><span>01 / TERRITÓRIO</span><p>Energia é mundo.<br />Antes de ser número.</p></div>
        <svg className="g2-film-thread" viewBox="0 0 1400 620" preserveAspectRatio="none" aria-hidden="true"><path className="g2-film-thread-base" d="M440 204 H518 L744 356 H848" /><path className="g2-film-thread-current" d="M440 204 H518 L744 356 H848" /><circle cx="440" cy="204" r="4" /><circle cx="848" cy="356" r="4" /></svg>
        <div className="g2-film-evidence" aria-label="Registro EV—001. Exemplo didático com série sintética de potência ativa, unidade MW, de 00 a 20 horas. Valores 68, 64, ausente, 81, ausente e 108.">
          <div className="g2-film-evidence-head"><span>EV—001</span><span>SÉRIE SINTÉTICA</span><i /></div>
          <div className="g2-film-evidence-title"><span className="g2-film-record-kicker">{chapter === 4 ? "NOTA DE MÉTODO" : chapter === 3 ? "EXAME DA HIPÓTESE" : "POTÊNCIA ATIVA"}</span><h3>{chapter === 3 || chapter === 4 ? "Tendência não demonstrada." : chapter === 5 ? "Aberta a nova evidência." : chapter === 2 ? "O começo de uma hipótese." : "Preservar o instante."}</h3></div>
          <div className="g2-film-record" aria-hidden="true"><strong>68<small>MW</small></strong><div><span>00:00 h</span><span>GRANDEZA / TEMPO / UNIDADE</span></div></div>
          <div className="g2-film-ledger" aria-hidden="true"><div className="g2-film-ledger-head"><span>INSTANTE</span><span>POTÊNCIA</span><span>COBERTURA</span></div>{SAMPLES.map((v, i) => <div key={i} data-missing={v === null}><span>{String(i * 4).padStart(2, "0")}:00</span><strong>{v ?? "—"}<small>{v === null ? "" : " MW"}</small></strong><span>{v === null ? "ausente" : "disponível"}</span></div>)}</div>
          <div className="g2-film-plot" aria-hidden="true">
            <div className="g2-film-plot-caption"><span>POTÊNCIA / MW</span><span>4 DE 6 INTERVALOS</span></div>
            <svg viewBox="0 0 510 190" role="presentation">
              <defs><linearGradient id="g2-film-gap"><stop stopColor="#ca956b" stopOpacity=".03" /><stop offset=".5" stopColor="#ca956b" stopOpacity=".2" /><stop offset="1" stopColor="#ca956b" stopOpacity=".03" /></linearGradient></defs>
              {[36, 94, 152].map((y, i) => <g key={y}><line x1="30" x2="492" y1={y} y2={y} className="g2-film-gridline" /><text x="0" y={y + 4}>{[120, 90, 60][i]}</text></g>)}
              <g className="g2-film-gap-bands"><rect x="196" y="24" width="33" height="134" fill="url(#g2-film-gap)" /><rect x="376" y="24" width="33" height="134" fill="url(#g2-film-gap)" /></g>
              <path d="M32 136.5 L122 144.3" className="g2-film-data-path" />
              {SAMPLES.map((v, i) => <g key={i} className={v === null ? "g2-film-null-point" : "g2-film-valid-point"}>{v === null ? <><line x1={32 + i * 90} x2={32 + i * 90} y1="24" y2="158" strokeDasharray="3 6" /><text x={32 + i * 90} y="94" textAnchor="middle">—</text></> : <><circle cx={32 + i * 90} cy={152 - (v - 60) * 1.93} r="4" /><text x={32 + i * 90} y={138 - (v - 60) * 1.93} textAnchor="middle">{v}</text></>}<text className="g2-film-axis" x={32 + i * 90} y="181" textAnchor="middle">{String(i * 4).padStart(2, "0")}:00</text></g>)}
            </svg>
            <p className="g2-film-plot-question"><span>08:00 + 16:00</span> O que aconteceu nos intervalos que faltam?</p>
          </div>
          <div className="g2-film-publication" aria-hidden="true"><div><span>01</span><p>Comparar os extremos.<strong>68 → 108 MW.</strong></p></div><div><span>02</span><p>Verificar a cobertura.<strong>4 de 6 intervalos.</strong></p></div><div><span>03</span><p>Medir as lacunas antes de concluir.</p></div><span className="g2-film-publication-open">ABERTA A NOVA EVIDÊNCIA <ArrowUpRight size={16} /></span></div>
          <div className="g2-film-evidence-foot"><span>FONTE <b>Série sintética NIVAR</b></span><span>PERÍODO <b>Dia ilustrativo · 00–20 h</b></span></div>
        </div>
        <div className="g2-film-final" aria-hidden="true"><Wordmark height={49} /><p>Independência<br />para ver melhor.</p><span>NULLIUS IN VERBA.</span></div>
        <div className="g2-film-bottomline"><span>IMAGENS GERADAS · CENAS ILUSTRATIVAS</span><span>{failed ? "POSTER · VÍDEO INDISPONÍVEL" : "MESMA FONTE. MESMO REGISTRO."}</span></div>
      </div>
      <figcaption className="g2-film-caption"><span className="g2-film-chapter-count">0{chapter + 1}<small>/ 06</small></span><div className="g2-film-chapter-copy"><h2>{current.title}</h2><p>{current.detail}</p></div><div className="g2-film-control-group"><span ref={timeRef}>00 / 24 s</span><button onClick={() => setPlaying((v) => !v)} aria-label={playing ? "Pausar filme" : "Reproduzir filme"}>{playing ? <Pause size={16} /> : <Play size={16} />}</button><button onClick={() => { selectChapter(0); setPlaying(true); }} aria-label="Reiniciar filme"><RotateCcw size={16} /></button></div></figcaption>
      <div className="g2-film-chapters" role="group" aria-label="Capítulos do filme">{CHAPTERS.map((c, i) => <button key={c.id} onClick={() => selectChapter(i)} aria-pressed={chapter === i}><span className="g2-film-chapter-rule">{chapter === i && <span ref={progressRef} />}</span><span className="g2-film-chapter-index">0{i + 1}</span><span>{c.verb}</span><small>{c.family}</small></button>)}</div>
    </figure>
  );
}
