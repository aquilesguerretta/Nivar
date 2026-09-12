import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowUpRight, Pause, Play, RotateCcw } from "lucide-react";
import { Link } from "react-router-dom";
import { FamilyEmblem, Wordmark } from "./Brand";
import { METHOD_SAMPLES, METHOD_HOURS } from "./method-evidence";
import { TerminalReading } from "../../pages/terminal-brasil/TerminalReading";
import { getSeries } from "../../pages/terminal-brasil/sample";
import "./hero-film.css";

const DURATION = 24;
const CHAPTER_DURATION = 4;
const SAMPLES = METHOD_SAMPLES;
const TERMINAL_OBSERVATION = getSeries("sudesteCentroOeste", "24h", "price")[14];
const TERMINAL_HREF = "/br/terminal?region=sudesteCentroOeste&period=24h&metric=price&observation=14";
const CHAPTERS = [
  { id: "medir", verb: "Medir", family: "hardware", patron: "Hefesto", title: "A realidade vem primeiro.", detail: "Uma grandeza. Uma unidade. Um instante." },
  { id: "organizar", verb: "Organizar", family: "software", patron: "Ariadne", title: "O dado ganha companhia.", detail: "Fonte, período e unidade permanecem juntos." },
  { id: "observar", verb: "Observar", family: "intelligence", patron: "Argos", title: "O que a sequência sugere?", detail: "De 68 a 108 MW. A cobertura sustenta essa leitura?" },
  { id: "questionar", verb: "Questionar", family: "advisory", patron: "Sócrates", title: "A conclusão precisa resistir.", detail: "Dois intervalos ausentes. Tendência não demonstrada." },
  { id: "transmitir", verb: "Transmitir", family: "academy", patron: "Perseu", title: "Uma leitura que pode ser examinada.", detail: "A interpretação circula com seus limites." },
  { id: "procurar", verb: "Procurar", family: "house", patron: "Diógenes", title: "O dado não encerra a pergunta.", detail: "A investigação continua. A evidência permanece aberta." },
] as const;
const clamp = (n: number) => Math.max(0, Math.min(1, n));
const ramp = (t: number, a: number, b: number) => { const n = clamp((t - a) / (b - a)); return n * n * (3 - 2 * n); };
const mix = (a: number, b: number, p: number) => a + (b - a) * p;

/** Same keyed sample groups throughout: records move, their values never tween.
 * Historical photographs and synthetic series have independent provenance. */
export function HeroFilm({ className = "" }: { className?: string }) {
  const stage = useRef<HTMLElement>(null), clock = useRef(0), active = useRef(0);
  const samples = useRef<(SVGGElement | null)[]>([]);
  const progress = useRef<HTMLSpanElement>(null), time = useRef<HTMLSpanElement>(null);
  const scrub = useRef<HTMLInputElement>(null);
  const [chapter, setChapter] = useState(0);
  const [playing, setPlaying] = useState(() => !matchMedia("(prefers-reduced-motion: reduce)").matches);
  const [inView, setInView] = useState(false), [visible, setVisible] = useState(!document.hidden);
  const [compact, setCompact] = useState(() => matchMedia("(max-width: 700px)").matches);
  const running = playing && inView && visible, current = CHAPTERS[chapter];
  const width = compact ? 390 : 1400, height = compact ? 620 : 650;
  const px = compact ? 59 : 182, step = compact ? 55 : 211, floor = compact ? 365 : 410, scale = compact ? 1.9 : 3;

  const draw = useCallback((seconds: number) => {
    // Six four-second movements leave room for the source and its limits.
    const t = seconds * 1.5, returning = ramp(t, 33.6, 36), remain = 1 - returning;
    const returnTravel = ramp(t, 33.8, 35.5) * 750;
    const el = stage.current; if (!el) return;
    const data = ramp(t, 3.8, 5.1), order = ramp(t, 6.6, 8.8), chart = ramp(t, 12.2, 15.5);
    const fan = ramp(t, 12.2, 13.7), rise = ramp(t, 13.7, 15.4);
    const question = ramp(t, 18.3, 20.4), turn = ramp(t, 24.3, 26.6), publication = turn >= .5 ? 1 : 0, open = ramp(t, 30.1, 31.3);
    const turnAngle = turn < .5 ? turn * 180 : (turn - 1) * 180;
    const focus = ramp(t, 15.7, 16.7) * (1 - ramp(t, 18, 18.3));
    const paperTop = (compact ? 109 : 65) + (1 - publication) * 650;
    const paperInk = (y: number) => ramp(y, paperTop - 7, paperTop + 7);
    const ink = (p: number) => `rgb(${mix(233, 69, p)} ${mix(224, 54, p)} ${mix(214, 51, p)})`;
    const values: Record<string, number> = { data, order, chart, publication, open, focus, examine: Math.max(question * (1 - ramp(t, 23.2, 23.9)), ramp(t, 30.3, 31.3)), stamp: ramp(t, 5.4, 6.2), question: question * (1 - ramp(t, 23.2, 23.9)), "publish-copy": ramp(t, 26, 27) * (1 - ramp(t, 29.2, 29.9)), field: Math.max(1 - ramp(t, 5.8, 8.4), returning), territory: Math.max(1 - ramp(t, 3.2, 4.7), ramp(t, 35.1, 36)), portrait: ramp(t, 4.1, 5.7) * (1 - ramp(t, 23.3, 24.1)) * remain, aerial: Math.max(1 - ramp(t, 2.4, 3.5), returning), pylons: ramp(t, 2.4, 3.5) * (1 - ramp(t, 7.1, 8.8)) * remain, room: ramp(t, 7.1, 8.8) * remain, "terrain-scale": mix(mix(1.02, 1.13, clamp(t / 8)), 1.02, returning), remain, "turn-angle": turnAngle, "return-travel": returnTravel, "paper-travel": (1 - publication) * 650 + returnTravel };
    Object.entries(values).forEach(([k, v]) => el.style.setProperty(`--${k}`, String(v)));
    el.style.setProperty("--axis", String(ramp(t, 14, 15.5)));
    // Clear the source lane before the question enters it; never cross-fade text.
    el.style.setProperty("--source-visible", String(ramp(t, 5.4, 6.2) * (1 - ramp(t, 18, 18.25)) * remain));
    el.style.setProperty("--segment", String(ramp(t, 15.4, 16.2)));
    el.style.setProperty("--fan", String(fan));
    el.dataset.filmTime = seconds.toFixed(3);
    el.querySelectorAll<SVGTextElement>(".g22-film-chart-scaffold text").forEach(node => { node.style.fill = ink(paperInk(Number(node.getAttribute("y")) - (compact ? 0 : publication * 35))); });
    el.style.setProperty("--study-ink", ink(paperInk(compact ? 137 : 105)));
    samples.current.forEach((g, i) => {
      if (!g) return; const v = SAMPLES[i];
      const x = mix(mix(compact ? 197 : 940, compact ? 182 : 940, order), px + i * step, fan);
      const y = mix(mix(compact ? 353 : 354, (compact ? 256 : 201) + i * (compact ? 39 : 56), order), v === null ? floor - 55 : floor - (v - 60) * scale, rise);
      const font = mix(mix(compact ? 94 : 122, compact ? 24 : 43, order), compact ? 18 : 38, chart) * (1 + (i === 0 || i === 5 ? .2 * focus : 0));
      g.setAttribute("transform", `translate(${x.toFixed(2)} ${y.toFixed(2)})`);
      g.style.opacity = String((i === 0 ? data : ramp(t, 7.6 + i * .46, 8.5 + i * .46)) * (i === 0 || i === 5 ? 1 : 1 - .52 * focus));
      const text = g.querySelector<SVGTextElement>(".g22-sample-value"); if (text) { text.style.fontSize = `${font}px`; text.setAttribute("y", String(-12 * chart)); text.style.fill = ink(paperInk(y - 20 - (compact ? 0 : publication * 35))); }
      const dot = g.querySelector<SVGCircleElement>(".g22-sample-dot"); if (dot) dot.style.opacity = String(chart);
      const bw = mix(mix(compact ? 77 : 101, compact ? 37 : 58, order), compact ? 21 : 46, chart);
      const bh = mix(mix(compact ? 84 : 110, compact ? 30 : 48, order), compact ? 26 : 47, chart);
      g.querySelector(".g22-sample-bracket")?.setAttribute("d", `M${-bw + 10} ${-bh} H${-bw} V10 H${-bw + 10} M${bw - 10} ${-bh} H${bw} V10 H${bw - 10}`);
      const stamp = g.querySelector<SVGTextElement>(".g22-sample-time");
      if (stamp) {
        stamp.style.fill = ink(paperInk(floor + 34 - (compact ? 0 : publication * 35)));
        // Travel below the bracket first, then rise only after clearing its edge.
        const stampAcross = ramp(order, 0, .55), stampUp = ramp(order, .55, 1);
        stamp.setAttribute("x", String(mix(mix(0, compact ? -88 : -156, stampAcross), 0, fan)));
        // Hide the timestamp only while it crosses the reserved heading band;
        // restore it on the fixed axis after the data has reached the plot.
        stamp.setAttribute("y", String(mix(mix(56, -6, stampUp), floor + 34 - y, rise)));
        stamp.style.opacity = String(ramp(t, i ? 7.7 + i * .45 : 5.4, i ? 8.2 + i * .45 : 6.2) * (1 - ramp(t, 11.8, 12.15) + ramp(t, 15.5, 15.9)));
      }
      const unit = g.querySelector<SVGTextElement>(".g22-sample-unit");
      if (unit) { unit.setAttribute("x", String(mix(mix(compact ? 98 : 125, 75, order), 0, fan))); unit.style.opacity = String(ramp(t, 4.8, 5.5) * (1 - ramp(t, 12, 12.6))); }
    });
    if (progress.current) progress.current.style.transform = `scaleX(${(seconds % CHAPTER_DURATION) / CHAPTER_DURATION})`;
    if (time.current) time.current.textContent = `${String(Math.floor(seconds)).padStart(2, "0")} / ${DURATION} s`;
    if (scrub.current) { scrub.current.value = String(seconds); scrub.current.setAttribute("aria-valuetext", `${seconds.toFixed(1).replace(".", ",")} segundos, ${CHAPTERS[Math.min(5, Math.floor(seconds / CHAPTER_DURATION))].verb}`); }
  }, [compact, px, step, floor, scale]);

  useEffect(() => {
    const mq = matchMedia("(max-width: 700px)"), reduced = matchMedia("(prefers-reduced-motion: reduce)");
    const resize = () => setCompact(mq.matches);
    const preference = () => { if (reduced.matches) { setPlaying(false); clock.current = 14.67; active.current = 3; setChapter(3); draw(14.67); } };
    const visibility = () => setVisible(!document.hidden);
    mq.addEventListener("change", resize); reduced.addEventListener("change", preference); document.addEventListener("visibilitychange", visibility);
    const observer = new IntersectionObserver(([e]) => setInView(e.isIntersecting && e.intersectionRatio > .15), { threshold: [0, .15] });
    if (stage.current) observer.observe(stage.current); preference(); draw(clock.current);
    return () => { mq.removeEventListener("change", resize); reduced.removeEventListener("change", preference); document.removeEventListener("visibilitychange", visibility); observer.disconnect(); };
  }, [draw]);
  useEffect(() => {
    draw(clock.current); if (!running) return; let frame = 0, previous = 0;
    const tick = (now: number) => {
      if (previous) clock.current = (clock.current + Math.min(now - previous, 100) / 1000) % DURATION; previous = now;
      const next = Math.min(5, Math.floor(clock.current / CHAPTER_DURATION)); if (next !== active.current) { active.current = next; setChapter(next); }
      draw(clock.current); frame = requestAnimationFrame(tick);
    }; frame = requestAnimationFrame(tick); return () => cancelAnimationFrame(frame);
  }, [running, draw]);
  const seekTime = (seconds: number) => { clock.current = seconds; const next = Math.min(5, Math.floor(seconds / CHAPTER_DURATION)); active.current = next; setChapter(next); setPlaying(false); draw(seconds); };
  const seek = (i: number, start = false) => { clock.current = start ? 0 : [3.73, 7.33, 11.33, 14.67, 19, 21.67][i]; active.current = i; setChapter(i); setPlaying(start); draw(clock.current); };
  const toggle = () => setPlaying(v => !v);

  return <figure id="filme-do-metodo" className={`g2-hero-film g22-hero-film ${className}`} ref={stage} data-chapter={current.id} data-playing={running} aria-label="O método NIVAR: fotografias reais de Itaipu e uma série didática independente">
    <div className="g2-film-stage">
      <div className="g22-film-physical" aria-hidden="true">{["itaipu-aerial", "itaipu-power-lines", "itaipu-control-room"].map((name, i) => <picture className={`g22-film-photo g22-film-photo-${i}`} key={name}><source media="(max-width:700px)" srcSet={`/g2/g22/real-brazil/${name}-mobile.webp`} /><img src={`/g2/g22/real-brazil/${name}.webp`} alt="" fetchPriority={i === 0 ? "high" : "auto"} decoding="async" /></picture>)}<div className="g22-film-physical-shade" /></div>
      <div className="g2-film-topline"><span>CADERNO DE EVIDÊNCIA VIVO</span><span>BRASIL / FILME DE MÉTODO<button className="g21-film-stage-pause" onClick={toggle} aria-label={playing ? "Pausar animação de abertura" : "Reproduzir animação de abertura"}>{playing ? <Pause size={15} /> : <Play size={15} />}</button></span></div>
      <div className="g22-film-geography"><span>ITAIPU / BRASIL — PARAGUAI</span><p>Energia é mundo.<br />Antes de ser número.</p><span>FOTOGRAFIA REAL · INFRAESTRUTURA BINACIONAL</span></div>
      <div className="g22-film-patron" aria-hidden="true" key={current.family}><FamilyEmblem family={current.family} variant="hero" size={420} decorative /><div><span>{current.patron}</span><strong>{current.verb}.</strong></div></div>
      <div className="g22-film-evidence-plane">
      <div className="g22-film-paper" aria-hidden="true" />
      <div className="g22-film-study-label"><i /><span>ENSAIO DE MÉTODO <b>Série sintética NIVAR · potência ativa</b></span></div>
      <svg className="g22-film-composition" viewBox={`0 0 ${width} ${height}`} aria-hidden="true">
        <defs><linearGradient id="g22-gap-glass"><stop stopColor="#d5b4ca" stopOpacity=".02" /><stop offset=".5" stopColor="#d5b4ca" stopOpacity=".19" /><stop offset="1" stopColor="#d5b4ca" stopOpacity=".03" /></linearGradient></defs>
        <g className="g22-film-table-rules">{SAMPLES.map((_, i) => <line key={i} x1={compact ? 65 : 760} x2={compact ? 325 : 1250} y1={(compact ? 256 : 201) + i * (compact ? 39 : 56) + 18} y2={(compact ? 256 : 201) + i * (compact ? 39 : 56) + 18} />)}<text x={compact ? 65 : 760} y={compact ? 215 : 144}>INSTANTE</text><text x={compact ? 220 : 1063} y={compact ? 215 : 144}>POTÊNCIA / MW</text></g>
        <g className="g22-film-chart-scaffold">{[60, 90, 120].map(v => <g key={v}><line x1={px - 10} x2={px + step * 5 + 8} y1={floor - (v - 60) * scale} y2={floor - (v - 60) * scale} /><text x={px - 20} y={floor - (v - 60) * scale + 4} textAnchor="end">{v}</text></g>)}<text x={px - 10} y={floor - 60 * scale - 37}>MW</text><text x={px + step * 5} y={floor + 61} textAnchor="end">DIA ILUSTRATIVO / 00–20 h</text></g>
        <path className="g22-film-data-segment" pathLength="1" d={`M${px} ${floor - 8 * scale} L${px + step} ${floor - 4 * scale}`} />
        <g className="g22-film-gap-lenses">{[2, 4].map(i => <g key={i}><rect x={px + i * step - (compact ? 19 : 33)} y={floor - 60 * scale - 11} width={compact ? 38 : 66} height={60 * scale + 24} fill="url(#g22-gap-glass)" /><line x1={px + i * step} x2={px + i * step} y1={floor - 60 * scale - 11} y2={floor + 12} strokeDasharray="2 6" /></g>)}</g>
        {SAMPLES.map((v, i) => <g className="g22-film-sample" data-sample={i} data-missing={v === null} key={i} ref={node => { samples.current[i] = node; }}><path className="g22-sample-bracket" /><text className="g22-sample-value" textAnchor="middle">{v ?? "—"}</text><text className="g22-sample-time" textAnchor="middle">{METHOD_HOURS[i]}</text><text className="g22-sample-unit">{v === null ? "ausente" : "MW"}</text>{v !== null && <circle className="g22-sample-dot" r="3" />}</g>)}
      </svg>
      <div className="g22-film-focus">EXTREMOS EM FOCO / 68 → 108 MW</div>
      <div className="g22-film-question"><span>08:00 + 16:00 / SEM OBSERVAÇÃO</span><h3>O intervalo muda<br /><em>a conclusão.</em></h3><p>68 → 108 MW entre extremos.<br /><strong>A continuidade não está demonstrada.</strong></p></div>
      <div className="g22-film-publication"><span>NOTA DE MÉTODO / 01</span><h3>Levar a leitura.<br /><em>Levar também o limite.</em></h3><p>Quatro observações. Duas ausências.<br />A hipótese continua aberta.</p></div>
      <div className="g22-film-open"><span><Wordmark height={18} /> NULLIUS IN VERBA.</span><h3>O que falta observar<br /><em>para mudar a leitura?</em></h3><Link to={TERMINAL_HREF}>Continue no Terminal Brasil <ArrowUpRight size={17} /></Link></div>
      <div className="g22-film-source"><span>FONTE DA SÉRIE</span><strong>Série sintética NIVAR</strong><span>Dia ilustrativo · 00–20 h · 4 de 6 observações</span></div>
      </div>
      <div className="g22-film-image-credit"><span>ITAIPU · FOTOGRAFIAS HISTÓRICAS, 2010–2013</span><a href="/g2/g22/real-brazil/credits.html" target="_blank" rel="noreferrer">Fontes e licenças ↗</a></div>
    </div>
    <figcaption className="g2-film-caption"><span className="g2-film-chapter-count">0{chapter + 1}<small>/ 06</small></span><div className="g2-film-chapter-copy"><h2>{current.title}</h2><p>{current.detail}</p></div><div className="g2-film-control-group"><span ref={time}>00 / 24 s</span><button onClick={toggle} aria-label={playing ? "Pausar filme" : "Reproduzir filme"}>{playing ? <Pause size={17} /> : <Play size={17} />}</button><button onClick={() => seek(0, true)} aria-label="Reiniciar filme"><RotateCcw size={17} /></button></div></figcaption>
    <label className="g23-film-scrub"><span>PERCORRER O FILME</span><input ref={scrub} type="range" aria-label="Posição do filme" min="0" max="23.99" step="0.1" defaultValue="0" onChange={event => seekTime(Number(event.target.value))} /><span>24 s</span></label>
    <div className="g2-film-chapters" role="group" aria-label="Capítulos do filme">{CHAPTERS.map((c, i) => <button key={c.id} onClick={() => seek(i)} aria-pressed={chapter === i}><span className="g2-film-chapter-rule">{chapter === i && <span ref={progress} />}</span><span>0{i + 1}</span><strong>{c.verb}</strong><small>{c.patron}</small></button>)}</div>
    <div className="g23-film-terminal"><div><span>DO GESTO AO INSTRUMENTO</span><h3>A pergunta ganha<br /><em>um lugar para continuar.</em></h3><p>No Terminal, escolha território, compare períodos e examine cada origem. Esta é uma outra amostra: preço simulado, em R$/MWh.</p><Link to={TERMINAL_HREF}>Abrir esta observação <ArrowUpRight size={17} /></Link></div><TerminalReading region="sudesteCentroOeste" metric="price" observation={TERMINAL_OBSERVATION} href={TERMINAL_HREF} /></div>
    <details className="g22-film-transcript"><summary>Ler o filme e verificar as fontes</summary><p>As fotografias mostram Itaipu, infraestrutura binacional Brasil–Paraguai: vista aérea de 2013, torres fotografadas do lado paraguaio em 2012 e sala de controle em 2010. Não são imagens em tempo real.</p><p>O ensaio de método é independente das fotografias. A série sintética NIVAR representa potência ativa, em MW: 00:00 — 68; 04:00 — 64; 08:00 — sem observação; 12:00 — 81; 16:00 — sem observação; 20:00 — 108. Comparar os extremos não demonstra uma tendência contínua. As ausências e a fonte acompanham a publicação.</p><p>O registro do Terminal vem de sua própria base sintética: SE/CO, preço, 10 de setembro de 2026, 14h. O link mantém essa seleção. Nenhuma das duas séries descreve a produção de Itaipu.</p><a href="/g2/g22/real-brazil/credits.html" target="_blank" rel="noreferrer">Autoria, datas e licenças das fotografias ↗</a></details>
  </figure>;
}
