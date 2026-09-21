import { useId, useLayoutEffect, useRef, useState } from "react";
import type { CSSProperties, PointerEvent } from "react";
import { ArrowLeft, ArrowRight, Expand, Minus, Plus, RotateCcw, ScanEye } from "lucide-react";
import { AriadneArchiveRecord } from "./AriadneArchiveRecord";
import type { ArchiveFocus } from "./AriadneArchiveRecord";
import "./ariadne-journey.css";

const STAGES = ["Organização", "Estado", "Cenário", "Decisão"] as const;
const OBJECTS = [
  { id: "v1", label: "Estado v1", note: "Preservado", x: .34, y: .66, pin: "v1" },
  { id: "v2", label: "Estado v2", note: "Atual", x: .68, y: .26, pin: "v2" },
  { id: "scenario-a", label: "Cenário A", note: "Origem v1", x: .15, y: .36, pin: "A" },
  { id: "scenario-b", label: "Cenário B", note: "Origem v2", x: .425, y: .13, pin: "B" },
] as const;
const WALK: ArchiveFocus[] = ["v1", "scenario-a", "result-a", "v2", "compare", "scenario-b", "result-b"];
const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));
const objectFor = (focus: ArchiveFocus | null) => OBJECTS.find(object => object.id === (focus === "result-a" ? "v1" : focus === "result-b" ? "v2" : focus));
const stageFor = (focus: ArchiveFocus | null) => !focus ? 0 : focus.startsWith("scenario") ? 2 : focus.startsWith("result") ? 3 : 1;

/** An explorable editorial illustration, with local synthetic records only. */
export function AriadneJourney({ compact = false }: { compact?: boolean }) {
  const [focus, setFocus] = useState<ArchiveFocus | null>(null);
  const [camera, setCamera] = useState({ zoom: 1, x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const drag = useRef<{ id: number; x: number; y: number; startX: number; startY: number } | null>(null);
  const overviewButton = useRef<HTMLButtonElement>(null);
  const recordPanel = useRef<HTMLDivElement>(null);
  const visual = useRef<HTMLDivElement>(null);
  const focusRecord = useRef(false);
  const recordId = useId();
  const activeStage = stageFor(focus);
  const selectedObject = objectFor(focus);
  const selectedV1 = focus === "v1" || focus === "scenario-a" || focus === "result-a";

  function frame(zoom: number, x = selectedObject?.x ?? .5, y = selectedObject?.y ?? .5) {
    const limit = (zoom - 1) / 2;
    setCamera({ zoom, x: clamp((.5 - x) * zoom, -limit, limit), y: clamp((.5 - y) * zoom, -limit, limit) });
  }
  useLayoutEffect(() => {
    if (!focus) return;
    const readingRequested = focusRecord.current;
    if (readingRequested) {
      recordPanel.current?.focus({ preventScroll: true });
      focusRecord.current = false;
    }
    // Keep a newly opened object in view, including selections made below the art.
    const narrow = (visual.current?.closest(".g24-ariadne")?.clientWidth ?? 0) <= 690;
    const target = narrow && readingRequested ? recordPanel.current : visual.current;
    const bounds = target?.getBoundingClientRect();
    if (bounds && (bounds.top < 135 || bounds.top > window.innerHeight * .45)) {
      target?.scrollIntoView({ block: "start", behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
    }
  }, [focus]);

  function select(next: ArchiveFocus, moveFocus = false) {
    focusRecord.current = moveFocus;
    setFocus(next);
    const object = objectFor(next);
    frame(object ? (next.startsWith("scenario") ? 1.85 : 1.55) : 1, object?.x, object?.y);
  }
  function overview() { setFocus(null); frame(1); }
  function selectStage(index: number) {
    if (index === 0) overview();
    else if (index === 1) select(selectedV1 ? "v1" : "v2");
    else if (index === 2) select(selectedV1 ? "scenario-a" : "scenario-b");
    else select(selectedV1 ? "result-a" : "result-b");
  }
  function startDrag(event: PointerEvent<HTMLDivElement>) {
    if (camera.zoom <= 1 || event.button !== 0 || (event.target as HTMLElement).closest("button")) return;
    drag.current = { id: event.pointerId, x: event.clientX, y: event.clientY, startX: camera.x, startY: camera.y };
    event.currentTarget.setPointerCapture(event.pointerId);
    setDragging(true);
  }
  function moveDrag(event: PointerEvent<HTMLDivElement>) {
    if (!drag.current || event.pointerId !== drag.current.id) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const limit = (camera.zoom - 1) / 2;
    setCamera({ ...camera, x: clamp(drag.current.startX + (event.clientX - drag.current.x) / rect.width, -limit, limit), y: clamp(drag.current.startY + (event.clientY - drag.current.y) / rect.height, -limit, limit) });
  }
  function endDrag() { drag.current = null; setDragging(false); }
  const worldStyle = { "--archive-zoom": camera.zoom, transform: `translate(${camera.x * 100}%, ${camera.y * 100}%) scale(${camera.zoom})` } as CSSProperties;

  return (
    <section className={`g24-ariadne${compact ? " g24-ariadne--compact" : ""}`} data-stage={activeStage} data-focus={focus ?? "overview"} aria-label="Ariadne: continuidade do contexto privado" onKeyDown={event => { if (event.key === "Escape" && focus) { overview(); overviewButton.current?.focus(); } }}>
      <header className="g24-ariadne__orientation">
        <span className="g24-ariadne__kicker">ARIADNE / ARQUIVO VIVO</span>
        <ol aria-label="Explorar a continuidade Ariadne">
          {STAGES.map((stage, index) => <li key={stage} data-current={activeStage === index}><button type="button" onClick={() => selectStage(index)} aria-pressed={activeStage === index} aria-controls={recordId}><span>{String(index + 1).padStart(2, "0")}</span><span>{stage}</span></button></li>)}
        </ol>
      </header>

      <figure className="g24-ariadne__scene">
        <figcaption className="g24-ariadne__art-copy" data-inspecting={focus !== null}>
          <div className="g24-ariadne__invitation">
            <span className="g24-ariadne__kicker">A ORGANIZAÇÃO COMO ESTADO VIVO</span>
            <h2>O presente<br />não apaga<br /><em>o passado.</em></h2>
            <p>Dois tempos da mesma organização.<br />Um arquivo que você pode percorrer.</p>
            <button className="g24-ariadne__enter" onClick={() => select("v1", true)}><ScanEye size={17} /><span>Explorar o primeiro estado</span><ArrowRight size={16} /></button>
            <div className="g24-ariadne__patron"><img src="/g2/g21/emblems/ariadne-hero-1200.webp" alt="Ariadne com seu carretel." width={1200} height={1200} loading="lazy" /><span>ARIADNE<strong>O contexto muda.<br />O vínculo permanece.</strong></span></div>
          </div>
          <div id={recordId} ref={recordPanel} tabIndex={-1} className="g24-ariadne__record" role="region" aria-label="Detalhes do objeto selecionado" aria-live="polite" aria-atomic="false">
            {focus && <AriadneArchiveRecord key={focus} focus={focus} onSelect={next => select(next, true)} />}
          </div>
        </figcaption>

        <div ref={visual} className="g24-ariadne__visual">
          <div className="g24-ariadne__camera-bar">
            <span>ORG-DEMO-01 <span>· ARQUIVO ILUSTRATIVO</span></span>
            <div role="group" aria-label="Enquadramento da arte">
              <button type="button" onClick={() => frame(clamp(camera.zoom - .35, 1, 2.4))} disabled={camera.zoom <= 1} aria-label="Afastar a cena"><Minus size={16} /></button>
              <output aria-label="Ampliação da cena">{Math.round(camera.zoom * 100)}%</output>
              <button type="button" onClick={() => frame(clamp(camera.zoom + .35, 1, 2.4))} disabled={camera.zoom >= 2.4} aria-label="Aproximar a cena"><Plus size={16} /></button>
              <button type="button" ref={overviewButton} onClick={overview} aria-label="Voltar à visão completa"><Expand size={16} /></button>
            </div>
          </div>
          <div className="g24-ariadne__art" data-dragging={dragging} data-zoomed={camera.zoom > 1} tabIndex={0} role="group" aria-label="Arquivo ilustrado interativo. Selecione um livro ou uma folha. Quando ampliado, arraste a cena ou use as setas para deslocar." onPointerDown={startDrag} onPointerMove={moveDrag} onPointerUp={endDrag} onPointerCancel={endDrag} onLostPointerCapture={endDrag} onKeyDown={event => {
            if (event.target !== event.currentTarget || camera.zoom <= 1 || !["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(event.key)) return;
            event.preventDefault();
            const limit = (camera.zoom - 1) / 2;
            setCamera({ ...camera, x: clamp(camera.x + (event.key === "ArrowLeft" ? .06 : event.key === "ArrowRight" ? -.06 : 0), -limit, limit), y: clamp(camera.y + (event.key === "ArrowUp" ? .06 : event.key === "ArrowDown" ? -.06 : 0), -limit, limit) });
          }}>
            <div className="g24-ariadne__world" style={worldStyle}>
              <img className="g24-ariadne__art-light" src="/g2/niv53/ariadne-archive-light.webp" alt="Dois fólios conservam versões da mesma organização. Folhas de cenário permanecem ligadas ao seu livro por um fio de cobre." width={2048} height={1360} loading="lazy" draggable={false} />
              <img className="g24-ariadne__art-dark" src="/g2/niv53/ariadne-archive-dark.webp" alt="Dois fólios conservam versões da mesma organização. Folhas de cenário permanecem ligadas ao seu livro por um fio de cobre." width={2048} height={1360} loading="lazy" draggable={false} />
              {OBJECTS.map(object => {
                const screenX = .5 + (object.x - .5) * camera.zoom + camera.x;
                const screenY = .5 + (object.y - .5) * camera.zoom + camera.y;
                return <button type="button" key={object.id} className="g24-ariadne__pin" style={{ left: `${object.x * 100}%`, top: `${object.y * 100}%`, visibility: screenX < .06 || screenX > .94 || screenY < .09 || screenY > .91 ? "hidden" : "visible" }} data-selected={selectedObject?.id === object.id} aria-pressed={selectedObject?.id === object.id} aria-label={`Inspecionar ${object.label}`} aria-controls={recordId} onClick={() => select(object.id)}><span>{object.pin}</span><span>{object.label}<small>{object.note}</small></span><Plus size={12} /></button>;
              })}
            </div>
            <span className="g24-ariadne__scene-hint" aria-hidden="true">{camera.zoom > 1 ? "ARRASTE PARA EXAMINAR OS DETALHES" : "TOQUE NOS LIVROS E NAS FOLHAS"}</span>
          </div>
          <div className="g24-ariadne__object-index" role="group" aria-label="Objetos do arquivo">
            {OBJECTS.map(object => <button type="button" key={object.id} onClick={() => select(object.id)} aria-pressed={selectedObject?.id === object.id} aria-controls={recordId}><strong>{object.pin}</strong><span>{object.label}<small>{object.note}</small></span></button>)}
          </div>
          <div className="g24-ariadne__art-note"><span>{focus ? `${focus === "compare" ? "V1 / V2" : selectedObject?.label.toUpperCase()} · REGISTRO ABERTO` : "DOIS TEMPOS. UMA IDENTIDADE."}</span><button type="button" onClick={() => select("compare")} aria-pressed={focus === "compare"} aria-controls={recordId}>Comparar v1 e v2 <ArrowRight size={14} /></button></div>
        </div>
      </figure>

      <footer className="g24-ariadne__controls">
        <span>{focus ? `EXPLORANDO / ${focus === "compare" ? "O QUE MUDA · O QUE PERMANECE" : focus.startsWith("result") ? `RESULTADO ${selectedV1 ? "A" : "B"}` : selectedObject?.label.toUpperCase()}` : "EXPLORE LIVROS, PREMISSAS E ORIGENS."}</span>
        <div>
          <button type="button" onClick={overview} aria-label="Recomeçar a exploração"><RotateCcw size={14} /></button>
          <button type="button" disabled={!focus} onClick={() => { const step = WALK.indexOf(focus!); if (step <= 0) overview(); else select(WALK[step - 1]); }} aria-label="Explorar a etapa anterior"><ArrowLeft size={15} /> Anterior</button>
          <button type="button" onClick={() => select(WALK[(focus ? WALK.indexOf(focus) + 1 : 0) % WALK.length])}>Seguir o fio <ArrowRight size={15} /></button>
        </div>
      </footer>
      <p className="g24-ariadne__disclosure">ILUSTRAÇÃO INTERATIVA · EXEMPLO PRIVADO SINTÉTICO · NENHUM DADO DE CLIENTE</p>
    </section>
  );
}
