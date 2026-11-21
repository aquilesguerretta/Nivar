import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Pause, Play, RotateCcw } from "lucide-react";
import { Wordmark } from "./Brand";
import "./hero-film.css";

const CHAPTER_MS = 3000;
const FILM_MS = CHAPTER_MS * 6;
const CHAPTERS = [
  {
    id: "medir",
    verb: "Medir",
    family: "Hardware",
    title: "Da geração ao registro.",
    detail: "Medir uma grandeza. Preservar o instante e a unidade.",
  },
  {
    id: "organizar",
    verb: "Organizar",
    family: "Software",
    title: "Um número precisa de contexto.",
    detail: "Fonte, período e unidade acompanham a evidência.",
  },
  {
    id: "observar",
    verb: "Observar",
    family: "Intelligence",
    title: "Uma hipótese pede exame.",
    detail: "A sequência sugere uma alta. A cobertura sustenta a leitura?",
  },
  {
    id: "questionar",
    verb: "Questionar",
    family: "Advisory",
    title: "A conclusão muda com a evidência.",
    detail: "Dois intervalos ausentes. Tendência não demonstrada.",
  },
  {
    id: "transmitir",
    verb: "Transmitir",
    family: "Academy",
    title: "Conhecimento que pode ser examinado.",
    detail: "Publicar a interpretação. Preservar seus limites.",
  },
  {
    id: "procurar",
    verb: "Procurar",
    family: "NIVAR",
    title: "A investigação continua.",
    detail: "Evidência. Método. Uma pergunta melhor.",
  },
] as const;

/**
 * Eighteen-second native product film. One evidence record and one evidence
 * plane persist through all chapters; only their relationship and density change.
 * Sequence: source → ledger → series → missing evidence → publication → inquiry.
 * This is an authored illustration, not a recording or a live market feed.
 */
export function HeroFilm({ className = "" }: { className?: string }) {
  const stageRef = useRef<HTMLElement>(null);
  const progressRef = useRef<HTMLSpanElement>(null);
  const timeRef = useRef<HTMLSpanElement>(null);
  const elapsedRef = useRef(0);
  const activeRef = useRef(0);
  const [chapter, setChapter] = useState(0);
  const [playing, setPlaying] = useState(
    () => !window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  const [visible, setVisible] = useState(!document.hidden);
  const [inView, setInView] = useState(true);
  const running = playing && visible && inView;
  const current = CHAPTERS[chapter];

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onPreference = () => {
      if (media.matches) setPlaying(false);
    };
    const onVisibility = () => setVisible(!document.hidden);
    media.addEventListener("change", onPreference);
    document.addEventListener("visibilitychange", onVisibility);
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.intersectionRatio >= 0.12),
      { threshold: 0.12 },
    );
    if (stageRef.current) observer.observe(stageRef.current);
    return () => {
      media.removeEventListener("change", onPreference);
      document.removeEventListener("visibilitychange", onVisibility);
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!running) return;
    let frame = 0;
    let previous = 0;
    const advance = (now: number) => {
      if (previous)
        elapsedRef.current =
          (elapsedRef.current + Math.min(now - previous, 100)) % FILM_MS;
      previous = now;
      const next = Math.floor(elapsedRef.current / CHAPTER_MS);
      if (activeRef.current !== next) {
        activeRef.current = next;
        setChapter(next);
      }
      if (progressRef.current)
        progressRef.current.style.transform = `scaleX(${(elapsedRef.current % CHAPTER_MS) / CHAPTER_MS})`;
      if (timeRef.current)
        timeRef.current.textContent = `${String(Math.floor(elapsedRef.current / 1000)).padStart(2, "0")} / 18 s`;
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
    if (timeRef.current)
      timeRef.current.textContent = `${String(index * 3).padStart(2, "0")} / 18 s`;
  };

  const replay = () => {
    selectChapter(0);
    setPlaying(true);
  };

  return (
    <figure
      className={`g2-hero-film ${className}`}
      ref={stageRef}
      data-chapter={current.id}
      data-playing={running}
      aria-label="O método NIVAR, em seis movimentos"
    >
      <div
        className="g2-film-stage"
        role="img"
        aria-label={`${current.verb}. ${current.title} ${current.detail} Paisagem gerada para comunicação visual. Exemplo didático com uma série sintética, unidade MW, período de 00 a 20 horas. Quatro valores disponíveis: 68, 64, 81 e 108 MW; dois intervalos ausentes.`}
      >
        <div className="g2-film-topline" aria-hidden="true">
          <span>CADERNO DE EVIDÊNCIA</span>
          <span className="g2-film-example">
            <i /> EXEMPLO
          </span>
        </div>

        {/* Context is explicitly illustrative; EV—001 is the continuous evidence object. */}
        <div className="g2-film-context" aria-hidden="true">
          <img src="/g2/reservoir-landscape.webp" alt="" fetchPriority="high" />
          <span className="g2-film-context-credit">Paisagem gerada</span>
        </div>

        <div className="g2-film-measurement" aria-hidden="true">
          <span className="g2-film-measure-label">
            MEDIÇÃO DE POTÊNCIA ATIVA
          </span>
          <div className="g2-film-circuit">
            <div>
              <svg viewBox="0 0 44 44" fill="none">
                <circle cx="22" cy="22" r="17" />
                <path d="M15 23C19 10 25 34 29 21" />
              </svg>
              <span>Gerador</span>
            </div>
            <span className="g2-film-circuit-wire">
              <i />
            </span>
            <div>
              <svg viewBox="0 0 44 44" fill="none">
                <path d="M0 22H44" />
                <circle cx="22" cy="22" r="13" />
                <path d="M18 8V0M26 36V44" />
              </svg>
              <span>TC / TP</span>
            </div>
            <span className="g2-film-circuit-wire">
              <i />
            </span>
            <div>
              <svg viewBox="0 0 44 44" fill="none">
                <path d="M6 5H38V39H6Z" />
                <path d="M18 30V14H25C32 14 32 23 25 23H18" />
              </svg>
              <span>Medidor</span>
            </div>
          </div>
          <p>
            Tensão e corrente <span>→</span> potência ativa
          </p>
          <span className="g2-film-record-link">
            <i />
          </span>
        </div>

        <div className="g2-film-plane" aria-hidden="true">
          <div className="g2-film-plane-head">
            <span>EV—001</span>
            <span className="g2-film-plane-state">
              {chapter === 4
                ? "NOTA DE MÉTODO"
                : chapter === 3
                  ? "HIPÓTESE REVISTA"
                  : chapter === 5
                    ? "EVIDÊNCIA ABERTA"
                    : "REGISTRO"}
            </span>
          </div>
          <div className="g2-film-source-ticket">
            <span>POTÊNCIA ATIVA</span>
            <strong>
              68 <small>MW</small>
            </strong>
            <div>
              <span>00:00 h</span>
              <span>Amostra 001</span>
            </div>
          </div>
          <div className="g2-film-ledger">
            <div>
              <span>FONTE</span>
              <strong>Série sintética NIVAR</strong>
            </div>
            <div>
              <span>PERÍODO</span>
              <strong>Dia ilustrativo · 00–20 h</strong>
            </div>
            <div>
              <span>UNIDADE</span>
              <strong>MW · potência ativa</strong>
            </div>
            <div>
              <span>COBERTURA</span>
              <strong>
                4 de 6 intervalos <em>· 2 ausentes</em>
              </strong>
            </div>
            <p>O contexto pertence ao dado.</p>
          </div>
          <div className="g2-film-analysis">
            <div className="g2-film-plot-title">
              <span>Potência ativa</span>
              <span>MW</span>
            </div>
            <svg
              className="g2-film-plot"
              viewBox="0 0 360 175"
              role="presentation"
            >
              <g className="g2-film-plot-grid">
                <path d="M40 22H344M40 70H344M40 118H344" />
              </g>
              <g className="g2-film-plot-axis">
                <text x="0" y="27">
                  120
                </text>
                <text x="9" y="75">
                  90
                </text>
                <text x="9" y="123">
                  60
                </text>
                <text x="25" y="153">
                  00 h
                </text>
                <text x="139" y="153">
                  08 h
                </text>
                <text x="255" y="153">
                  16 h
                </text>
                <text x="315" y="153">
                  20 h
                </text>
              </g>
              <path
                className="g2-film-plot-unknown"
                d="M100 112L220 84M220 84L340 41"
              />
              <path className="g2-film-plot-known" d="M40 105L100 112" />
              <g className="g2-film-plot-points">
                <circle cx="40" cy="105" r="4" />
                <circle cx="100" cy="112" r="4" />
                <circle cx="220" cy="84" r="4" />
                <circle cx="340" cy="41" r="4" />
              </g>
              <g className="g2-film-plot-gaps">
                <path d="M160 27V120M280 27V120" />
                <circle cx="160" cy="98" r="9" />
                <circle cx="280" cy="63" r="9" />
                <path d="M155 93L165 103M165 93L155 103M275 58L285 68M285 58L275 68" />
              </g>
              <text className="g2-film-plot-value" x="302" y="28">
                108
              </text>
            </svg>
            <div className="g2-film-plot-key">
              <span>
                <i /> Amostra
              </span>
              <span>
                <i />{" "}
                {chapter === 3 ? "2 intervalos ausentes" : "Ligação hipotética"}
              </span>
            </div>
          </div>
          <div className="g2-film-publication">
            <h3>Tendência não demonstrada.</h3>
            <ol className="g2-film-method-steps">
              <li>
                Comparar os extremos: <strong>68 → 108 MW.</strong>
              </li>
              <li>
                Verificar a cobertura: <strong>4 de 6 intervalos.</strong>
              </li>
              <li>Medir as lacunas antes de concluir.</li>
            </ol>
            <div>
              <span>ABERTA A NOVA EVIDÊNCIA</span>
              <ArrowUpRight size={17} />
            </div>
          </div>
          <div className="g2-film-return-sample">
            <span>SEIS INTERVALOS / MW</span>
            <div>
              {[
                { h: "00 h", v: "68" },
                { h: "04 h", v: "64" },
                { h: "08 h", v: "—" },
                { h: "12 h", v: "81" },
                { h: "16 h", v: "—" },
                { h: "20 h", v: "108" },
              ].map((point) => (
                <span key={point.h} data-missing={point.v === "—"}>
                  <small>{point.h}</small>
                  <strong>{point.v}</strong>
                </span>
              ))}
            </div>
          </div>
          <div className="g2-film-plane-bottom">
            <span>MESMA FONTE · MESMO REGISTRO</span>
            <span>↗</span>
          </div>
        </div>

        <div className="g2-film-reading" aria-hidden="true">
          <span>
            {chapter === 3 ? "HIPÓTESE REVISTA" : "HIPÓTESE / A EXAMINAR"}
          </span>
          <p className="g2-film-hypothesis">Uma tendência de alta?</p>
          <p className="g2-film-revision">Tendência não demonstrada.</p>
          <small>2 de 6 intervalos ausentes.</small>
        </div>

        <div className="g2-film-inquiry" aria-hidden="true">
          <Wordmark height={32} />
          <p>Nullius in verba.</p>
          <div>
            <span>A PRÓXIMA PERGUNTA</span>
            <h3>O que falta medir?</h3>
            <p>08 h e 16 h continuam em aberto.</p>
          </div>
        </div>

        <div className="g2-film-provenance" aria-hidden="true">
          <span>
            <b>FONTE</b> Série sintética NIVAR
          </span>
          <span>
            <b>UNIDADE</b> MW
          </span>
          <span>
            <b>PERÍODO</b> Dia ilustrativo · 00–20 h
          </span>
        </div>
      </div>

      <figcaption className="g2-film-caption">
        <div>
          <span className="g2-film-caption-index">
            0{chapter + 1} <span>/ 06</span>
          </span>
          <div>
            <p>{current.title}</p>
            <span>{current.detail}</span>
          </div>
        </div>
        <div className="g2-film-transport">
          <button
            type="button"
            onClick={() => setPlaying((value) => !value)}
            aria-label={
              playing
                ? "Pausar filme do método NIVAR"
                : "Reproduzir filme do método NIVAR"
            }
            title={playing ? "Pausar filme" : "Reproduzir filme"}
          >
            {playing ? <Pause size={15} /> : <Play size={15} />}
          </button>
          <button
            type="button"
            onClick={replay}
            aria-label="Reiniciar filme de 18 segundos"
            title="Reiniciar filme"
          >
            <RotateCcw size={14} />
          </button>
          <span ref={timeRef}>00 / 18 s</span>
        </div>
      </figcaption>
      <div
        className="g2-film-chapters"
        role="group"
        aria-label="Capítulos do filme. A seleção pausa a reprodução."
      >
        {CHAPTERS.map((item, index) => (
          <button
            type="button"
            key={item.id}
            onClick={() => selectChapter(index)}
            aria-pressed={chapter === index}
            aria-label={`${index + 1}. ${item.verb} — ${item.family}`}
          >
            <span className="g2-film-chapter-progress">
              {chapter === index && <span ref={progressRef} />}
            </span>
            <span className="g2-film-chapter-number">0{index + 1}</span>
            {item.verb}
          </button>
        ))}
      </div>
      <span className="g2-film-sr-only" role="status">
        {!playing ? `${current.verb}. Filme pausado.` : ""}
      </span>
    </figure>
  );
}

export default HeroFilm;
