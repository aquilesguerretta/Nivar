import { useEffect, useId, useMemo, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  ArrowDownToLine,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  ChevronDown,
  Crosshair,
  Database,
  Moon,
  Copy,
  Save,
  Maximize2,
  Minimize2,
  Trash2,
  Search,
  Sun,
  X,
} from "lucide-react";

import {
  BRASIL_OUTLINE_D,
  BRASIL_VIEWBOX,
  SUBMERCADOS,
} from "../../lib/geo/brasil-outline";
import { FamilyEmblem, Wordmark } from "../../components/g2/Brand";
import { useNivarFavicon } from "../../components/g2/use-nivar-favicon";
import {
  describeSeries,
  formatValue,
  getSeries,
  METRICS,
  REGIONS,
  SAMPLE_VERSION,
  SOURCE_RECORDS,
} from "./sample";
import type { MetricId, Observation, PeriodId, RegionId } from "./sample";
import { AnalysisInstrument } from "./AnalysisInstrument";
import { SERIES_COLORS, plotValue } from "./analysis-format";
import { makeAnalysis, analysisCsv, noteAnchors, observationInWindow, selectionForWindow, selectionForDailySeries } from "./analysis";
import { parseWorkspace, serializeWorkspace, parseSavedWorkspaces, SAVED_WORKSPACE_KEY } from "./workspace-state";
import type { WorkspaceState, SavedWorkspace, Representation, AnalysisScale } from "./workspace-state";
import { TerminalReading } from "./TerminalReading";
import { useTerminalMotion } from "./terminal-motion";
import "../../components/g2/g2.css";
import "../../components/g2/g21-fonts.css";
import "./terminal-brasil.css";
import "./terminal-workspace.css";

interface TerminalBrasilProps {
  compact?: boolean;
  initialWorkspace?: WorkspaceState;
  initialRegion?: RegionId;
  initialProbeIndex?: number;
  initialPeriod?: PeriodId;
  initialMetric?: MetricId;
  initialSourceMode?: "sample" | "unavailable";
  initialTone?: "graphite" | "paper";
  initialEventIndex?: number;
  onEntryUrlChange?: (url: string) => void;
}

const periodNames: Record<PeriodId, string> = {
  "24h": "10 SET 2026 · HORÁRIO",
  "7d": "04 — 10 SET 2026 · DIÁRIO",
  "30d": "12 AGO — 10 SET 2026 · DIÁRIO",
};

const questions: Record<MetricId, { hypothesis: string; check: string }[]> = {
  price: [
    {
      hypothesis: "Uma mudança na oferta poderia explicar este movimento.",
      check:
        "Examinar disponibilidade de geração, despacho e intercâmbio na mesma janela. Uma curva de preço sozinha não distingue esses efeitos.",
    },
    {
      hypothesis:
        "A diferença entre regiões pode sugerir uma restrição de transmissão.",
      check:
        "Confrontar limites e fluxos reais de intercâmbio antes de atribuir o afastamento a uma restrição. Os ajustes desta amostra foram escritos no código.",
    },
    {
      hypothesis:
        "Um valor mais alto pode coincidir com uma mudança na demanda.",
      check:
        "Comparar carga, geração marginal e condições hidrológicas. Coincidência temporal é um ponto de partida, não uma conclusão.",
    },
  ],
  load: [
    {
      hypothesis: "O calendário de atividade pode explicar parte do movimento.",
      check:
        "Separar dias úteis, feriados e efeitos de temperatura. Esta amostra não inclui essas variáveis.",
    },
    {
      hypothesis: "Uma alteração de temperatura poderia elevar a demanda.",
      check:
        "Comparar observações meteorológicas e carga por hora, preservando fuso e cobertura. A série sintética não permite testar essa hipótese.",
    },
    {
      hypothesis: "Um patamar maior pode tornar a oferta menos flexível.",
      check:
        "Verificar reserva disponível, disponibilidade de usinas e intercâmbio. Carga elevada, isoladamente, não demonstra escassez.",
    },
  ],
  storage: [
    {
      hypothesis: "Uma redução de afluências poderia contribuir para a queda.",
      check:
        "Examinar energia natural afluente, armazenamento e defluência na mesma base. O percentual da amostra não contém essas relações.",
    },
    {
      hypothesis:
        "O despacho hidrelétrico pode alterar o ritmo de armazenamento.",
      check:
        "Confrontar geração e balanço hídrico. Um recuo de armazenamento não revela, por si, o motivo do despacho.",
    },
    {
      hypothesis: "Uma janela mais longa pode mudar a leitura da reserva.",
      check:
        "Comparar sazonalidade e séries históricas reais. Percentuais iguais em épocas distintas não significam condições equivalentes.",
    },
  ],
};

function RegionalTrace({ series, selectedIndex }: { series: Observation[]; selectedIndex: number }) {
  const low = Math.min(...series.map((point) => point.value));
  const high = Math.max(...series.map((point) => point.value));
  const coordinate = (point: Observation) => [
    2 + ((point.index - series[0].index) / (series.length - 1)) * 72,
    24 - ((point.value - low) / (high - low || 1)) * 20,
  ];
  const selected = coordinate(series.find(point => point.index === selectedIndex) ?? series[series.length - 1]);
  return (
    <svg className="g2t-region-trace" viewBox="0 0 76 28" aria-hidden="true">
      <polyline points={series.map((point) => coordinate(point).join(",")).join(" ")} />
      <circle cx={selected[0]} cy={selected[1]} r="2" />
    </svg>
  );
}

function TerminalBrasil({
  compact = false,
  initialWorkspace,
  initialRegion = "sudesteCentroOeste",
  initialProbeIndex,
  initialPeriod = "24h",
  initialMetric = "price",
  initialSourceMode = "sample",
  initialTone = "graphite",
  initialEventIndex = 1,
  onEntryUrlChange,
}: TerminalBrasilProps) {
  const initialSeries = getSeries(initialRegion, initialPeriod, initialMetric);
  const initialNote = noteAnchors(initialSeries)[initialEventIndex];
  const initialProbe = initialProbeIndex !== undefined && Number.isInteger(initialProbeIndex) && initialProbeIndex >= 0 ? initialProbeIndex : undefined;
  const initialSelection = selectionForWindow(initialSeries, initialProbe ?? initialNote.index,
    initialWorkspace?.start ?? 0, initialWorkspace?.end ?? initialSeries.length - 1);
  useEffect(() => {
    if (compact) return;
    const previousTitle = document.title;
    document.title = "Terminal Brasil — NIVAR · Ambiente demonstrativo";
    return () => {
      document.title = previousTitle;
    };
  }, [compact]);
  const [region, setRegion] = useState<RegionId>(initialRegion);
  const [period, setPeriod] = useState<PeriodId>(initialPeriod);
  const [metric, setMetric] = useState<MetricId>(initialMetric);
  const [sourceMode, setSourceMode] = useState<"sample" | "unavailable">(
    initialSourceMode,
  );
  const [tone, setTone] = useState<"graphite" | "paper">(initialTone);
  const [eventIndex, setEventIndex] = useState(initialEventIndex);
  const [comparisons, setComparisons] = useState<RegionId[]>(initialWorkspace?.compare ?? []);
  const [representation, setRepresentation] = useState<Representation>(initialWorkspace?.view ?? "chart");
  const [analysisScale, setAnalysisScale] = useState<AnalysisScale>(initialWorkspace?.scale ?? "native");
  const [rangeStart, setRangeStart] = useState(initialWorkspace?.start ?? 0);
  const [rangeEnd, setRangeEnd] = useState(initialWorkspace?.end ?? getSeries(initialRegion, initialPeriod, initialMetric).length - 1);
  const [focused, setFocused] = useState(false);
  const [viewName, setViewName] = useState("");
  const [shareFallback, setShareFallback] = useState("");
  const [savedViews, setSavedViews] = useState<SavedWorkspace[]>(() => {
    try { return parseSavedWorkspaces(localStorage.getItem(SAVED_WORKSPACE_KEY)); } catch { return []; }
  });
  const [probeIndex, setProbeIndex] = useState<number | null>(() =>
    initialProbe !== undefined || initialSelection.moved ? initialSelection.point.index : null);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [mapOpen, setMapOpen] = useState(false);
  const [sourceSearch, setSourceSearch] = useState("");
  const [announcement, setAnnouncement] = useState(() => initialSelection.moved
    ? `A nota de ${initialNote.label} está fora do recorte. Observação selecionada: ${initialSelection.point.label}.` : "");
  const WorkspaceElement = compact ? "div" : "main";
  const dialogRef = useRef<HTMLDialogElement>(null);
  const terminalRef = useTerminalMotion(reducedMotion);
  const [selectionRevision, setSelectionRevision] = useState(0);
  const [selectionKind, setSelectionKind] = useState("initial");
  const id = useId().replace(/:/g, "");
  const isSample = sourceMode === "sample";
  const regionInfo = REGIONS.find((r) => r.id === region)!;
  const metricInfo = METRICS[metric];
  const fullSeries = useMemo(
    () => getSeries(region, period, metric),
    [region, period, metric],
  );
  const safeStart = Math.min(rangeStart, fullSeries.length - 2);
  const safeEnd = Math.max(safeStart + 1, Math.min(rangeEnd, fullSeries.length - 1));
  const series = useMemo(() => fullSeries.slice(safeStart, safeEnd + 1), [fullSeries, safeStart, safeEnd]);
  const selectedRegions = useMemo(() => [region, ...comparisons.filter(item => item !== region)], [region, comparisons]);
  const analysisModels = useMemo(() => makeAnalysis(selectedRegions, period, metric, safeStart, safeEnd, analysisScale), [selectedRegions, period, metric, safeStart, safeEnd, analysisScale]);
  const allModels = useMemo(() => makeAnalysis(REGIONS.map(item => item.id), period, metric, safeStart, safeEnd, analysisScale), [period, metric, safeStart, safeEnd, analysisScale]);
  const summary = useMemo(
    () => describeSeries(series, metric),
    [series, metric],
  );
  const eventPoints = noteAnchors(fullSeries);
  const selectedPoint = eventPoints[eventIndex];
  const currentSelection = selectionForWindow(fullSeries, probeIndex ?? selectedPoint.index, safeStart, safeEnd);
  const inspectedPoint = currentSelection.point;
  const inspectingNote = probeIndex === null && !currentSelection.moved;
  const selectedNoteInWindow = observationInWindow(selectedPoint.index, safeStart, safeEnd);
  // The public handoff is derived from the current instrument, including its
  // absence state. A note stays a note; a manually inspected point stays a point.
  const workspaceState: WorkspaceState = {
    region, period, metric, source: sourceMode, tone, note: eventIndex,
    observation: inspectingNote ? undefined : inspectedPoint.index,
    compare: comparisons.filter(item => item !== region), view: representation, scale: analysisScale,
    start: safeStart, end: safeEnd,
  };
  const entryUrl = serializeWorkspace(workspaceState);
  useEffect(() => {
    onEntryUrlChange?.(entryUrl);
    // Keep React mounted while replacing transient scrub/analysis state in the URL.
    // React Router still handles actual navigation and browser back/forward.
    if (!compact && window.location.pathname === "/br/terminal") window.history.replaceState(window.history.state, "", entryUrl);
  }, [entryUrl, onEntryUrlChange, compact]);
  const selectedMarket = SUBMERCADOS.find((market) => market.id === region)!;
  const question = questions[metric][eventIndex];
  const normalizedSearch = sourceSearch
    .toLocaleLowerCase("pt-BR")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
  const filteredSources = SOURCE_RECORDS.filter((record) =>
    `${record.kind} ${record.title} ${record.text} ${record.detail}`
      .toLocaleLowerCase("pt-BR")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .includes(normalizedSearch),
  );
  const metricName =
    metric === "price"
      ? "O preço"
      : metric === "load"
        ? "A carga"
        : "A reserva";
  const direction =
    summary.change > 0
      ? "avança"
      : summary.change < 0
        ? "recua"
        : "permanece estável";

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(preference.matches);
    update();
    preference.addEventListener("change", update);
    return () => preference.removeEventListener("change", update);
  }, []);

  function selectEvent(index: number) {
    if (!isSample || !observationInWindow(eventPoints[index].index, safeStart, safeEnd)) return;
    setEventIndex(index);
    setProbeIndex(null);
    setAnnouncement("");
    propagate("observation");
  }

  function propagate(kind: string) {
    setSelectionKind(kind);
    setSelectionRevision((revision) => revision + 1);
  }

  function selectRegion(next: RegionId) {
    if (next === region) return;
    if (comparisons.length) setComparisons(items => [...new Set([...items, region])].filter(item => item !== next));
    setRegion(next);
    propagate("region");
  }

  function selectPeriod(next: PeriodId) {
    if (next === period) return;
    // A daily observation retains its timestamp when its window changes.
    // Hourly and daily fixtures are distinct frequencies, not aggregates.
    if (period !== "24h" && next !== "24h") {
      const nextSeries = getSeries(region, next, metric);
      const selection = selectionForDailySeries(inspectedPoint, nextSeries);
      setProbeIndex(selection.point.index);
      setAnnouncement(selection.moved
        ? `${inspectedPoint.label} está fora da janela de ${next}. Observação selecionada: ${selection.point.label}.`
        : `Janela de ${next}. Observação de ${selection.point.label} preservada.`);
    } else {
      setProbeIndex(null);
      const nextNote = noteAnchors(getSeries(region, next, metric))[eventIndex];
      setAnnouncement(`Frequência alterada. As amostras horárias e diárias são independentes. Nota selecionada: ${nextNote.label}.`);
    }
    setRangeStart(0);
    setRangeEnd(getSeries(region, next, metric).length - 1);
    setPeriod(next);
    propagate("period");
  }

  function selectMetric(next: MetricId) {
    if (next === metric) return;
    setMetric(next);
    propagate("metric");
  }

  function inspectPoint(index: number) {
    setProbeIndex(Math.max(safeStart, Math.min(index, safeEnd)));
    setAnnouncement("");
    propagate("observation");
  }

  function changeWindow(start: number, end: number) {
    const selection = selectionForWindow(fullSeries, inspectedPoint.index, start, end);
    setRangeStart(start);
    setRangeEnd(end);
    if (selection.moved) setProbeIndex(selection.point.index);
    setAnnouncement(selection.moved
      ? `A observação de ${inspectedPoint.label} ficou fora do recorte. Observação selecionada: ${selection.point.label}. As notas mantêm suas referências originais.`
      : `Recorte de ${fullSeries[start].label} a ${fullSeries[end].label}. Observação de ${selection.point.label} preservada.`);
    propagate("window");
  }

  function openSources() {
    setSourceSearch("");
    dialogRef.current?.showModal();
  }

  function exportCsv() {
    if (!isSample) return;
    const blob = new Blob([analysisCsv(analysisModels, metric, period, analysisScale)], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `NIVAR-AMOSTRA-${selectedRegions.length}regioes-${metric}-${period}-${analysisScale}.csv`;
    anchor.hidden = true;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 5000);
    setAnnouncement(
      `CSV demonstrativo de ${selectedRegions.length} regiões, ${series.length} observações por região, ${metricInfo.label} exportado.`,
    );
  }

  function toggleComparison(next: RegionId) {
    if (next === region) return;
    setComparisons(items => items.includes(next) ? items.filter(item => item !== next) : [...items, next]);
    propagate("comparison");
  }

  function restoreWorkspace(state: WorkspaceState) {
    const restoredSeries = getSeries(state.region, state.period, state.metric);
    const requested = state.observation ?? noteAnchors(restoredSeries)[state.note].index;
    const selection = selectionForWindow(restoredSeries, requested, state.start, state.end);
    setRegion(state.region); setPeriod(state.period); setMetric(state.metric); setSourceMode(state.source);
    setTone(state.tone); setEventIndex(state.note); setProbeIndex(state.observation !== undefined || selection.moved ? selection.point.index : null);
    setComparisons(state.compare); setRepresentation(state.view); setAnalysisScale(state.scale);
    setRangeStart(state.start); setRangeEnd(state.end); setFocused(false); setShareFallback("");
    propagate("workspace");
    return selection.moved ? ` A referência de ${restoredSeries[requested].label} está fora do recorte. Observação selecionada: ${selection.point.label}.` : "";
  }

  function writeSavedViews(next: SavedWorkspace[]) {
    try { localStorage.setItem(SAVED_WORKSPACE_KEY, JSON.stringify(next)); setSavedViews(next); return true; }
    catch { setAnnouncement("O navegador não permitiu salvar. Copie o link para preservar a análise."); return false; }
  }

  function saveWorkspace() {
    const name = viewName.trim() || `${metricInfo.label} · ${selectedRegions.map(item => REGIONS.find(r => r.id === item)!.code).join(" + ")} · ${period}`;
    const next = { id: crypto.randomUUID(), name: name.slice(0, 80), url: entryUrl, savedAt: new Date().toISOString(), dataset: SAMPLE_VERSION };
    if (writeSavedViews([next, ...savedViews].slice(0, 12))) { setAnnouncement(`Análise “${next.name}” salva neste navegador.`); setViewName(""); }
  }

  async function shareWorkspace() {
    const url = `${window.location.origin}${entryUrl}`;
    try { await navigator.clipboard.writeText(url); setShareFallback(""); setAnnouncement("Link da análise copiado. A seleção e a base demonstrativa acompanham o link."); }
    catch { setShareFallback(url); setAnnouncement("Copie o link no campo exibido para preservar esta análise."); }
  }

  function changeTone() {
    const next = tone === "graphite" ? "paper" : "graphite";
    setTone(next);
    try { localStorage.setItem("nivar-g2-mode", next === "graphite" ? "dark" : "light"); } catch { /* The visible theme remains usable without storage. */ }
  }

  return (
    <section
      ref={terminalRef}
      className={`g2-terminal${compact ? " g2-terminal--compact" : ""}`}
      data-tone={tone}
      data-source={sourceMode}
      data-map-open={mapOpen}
      data-period={period}
      data-scale={analysisScale}
      data-window={`${safeStart}/${safeEnd}`}
      data-focus={focused}
      data-metric={metric}
      data-selection={selectionKind}
      data-selection-revision={selectionRevision}
      aria-label="Terminal Brasil — ambiente demonstrativo"
      onKeyDown={event => { if (event.key === "Escape" && focused && !dialogRef.current?.open) setFocused(false); }}
    >
      <header className="g2t-header">
        <Link
          to="/br"
          className="g2t-brand"
          aria-label="NIVAR — voltar ao Portal Brasil"
        >
          <Wordmark height={22} />
          <span><FamilyEmblem family="intelligence" size={16} decorative />INTELLIGENCE</span>
        </Link>
        <div className="g2t-product">
          <span>
            Terminal Brasil<small>UM INSTRUMENTO DE ANÁLISE</small>
          </span>
        </div>
        <nav aria-label="Navegação do Terminal" className="g2t-nav">
          <a href={`#${id}-panorama`} aria-current="page">
            Panorama
          </a>
          {!compact && <a href={`#${id}-caderno`}>Caderno</a>}
        </nav>
        <div className="g2t-header-actions">
          <button
            type="button"
            className="g2t-icon-button"
            onClick={changeTone}
            aria-label={
              tone === "graphite" ? "Usar tema claro" : "Usar tema escuro"
            }
            title={tone === "graphite" ? "Tema claro" : "Tema escuro"}
          >
            {tone === "graphite" ? <Sun size={17} /> : <Moon size={17} />}
          </button>
          <button
            type="button"
            className="g2t-source-button"
            aria-label="Fontes e método"
            onClick={openSources}
          >
            <BookOpen size={15} />
            <span>Fontes & método</span>
          </button>
          {!compact && (
            <Link to="/conta" className="g2t-account">
              Minha conta <ArrowUpRight size={14} />
            </Link>
          )}
        </div>
      </header>

      <div className="g2t-page">
        {!compact && (
          <div className="g2t-masthead">
            <div>
              <div className="g2t-eyebrow">
                <span className="g2t-cross" aria-hidden="true">
                  +
                </span>{" "}
                BRASIL / CADERNO 001
              </div>
              <h1>Uma pergunta. Mais de uma perspectiva.</h1>
            </div>
            <p>
              Observar o sinal.
              <br />
              <span>Comparar. Examinar. Preservar.</span>
            </p>
          </div>
        )}

        <div className="g2t-toolbar" id={`${id}-panorama`}>
          <div className="g2t-source-select">
            <span
              className={`g2t-status-dot${!isSample ? " g2t-status-dot--unavailable" : ""}`}
              aria-hidden="true"
            />
            <label className="g2t-visually-hidden" htmlFor={`${id}-source`}>
              Base de dados
            </label>
            <select
              id={`${id}-source`}
              value={sourceMode}
              onChange={(event) => {
                setSourceMode(event.target.value as "sample" | "unavailable");
                setAnnouncement("");
              }}
            >
              <option value="sample">Base demonstrativa</option>
              <option value="unavailable">Fonte indisponível</option>
            </select>
            <ChevronDown size={12} aria-hidden="true" />
            <span className="g2t-source-date">
              {isSample
                ? "REFERÊNCIA FIXA · 10 SET 2026"
                : "SEM API BRASILEIRA CONECTADA"}
            </span>
          </div>
          <div
            className="g2t-period-control"
            role="group"
            aria-label="Janela da série"
          >
            {(["24h", "7d", "30d"] as const).map((item) => (
              <button
                type="button"
                key={item}
                onClick={() => selectPeriod(item)}
                aria-pressed={period === item}
              >
                {item}
              </button>
            ))}
          </div>
          <button
            type="button"
            className="g2t-export"
            onClick={exportCsv}
            disabled={!isSample}
          >
            <ArrowDownToLine size={14} />
            <span>Exportar seleção</span>
          </button>
        </div>

        {!compact && <div className="g23-workspace-tools">
          <div className="g23-workspace-label"><span>ANÁLISE / 001</span><strong>{selectedRegions.length > 1 ? `${selectedRegions.length} regiões em comparação` : "Uma região em exame"}</strong><small>{isSample ? `${series.length} observações · ${period === "24h" ? "UTC−03:00" : "frequência diária"}` : "sem observações disponíveis"}</small></div>
          <div className="g23-workspace-actions"><button type="button" onClick={() => { void shareWorkspace(); }}><Copy size={14} />Copiar link</button><details className="g23-saved-views"><summary><Save size={14} />Análises salvas<small>{savedViews.length.toString().padStart(2, "0")}</small><ChevronDown size={12} /></summary><div className="g23-saved-panel"><h3>Voltar a uma boa pergunta.</h3><p>Até 12 análises neste navegador. Os links preservam a configuração da base demonstrativa.</p><label htmlFor={`${id}-view-name`}>Nome da análise</label><div className="g23-save-input"><input id={`${id}-view-name`} value={viewName} maxLength={80} placeholder={`${metricInfo.label} · ${regionInfo.code} · ${period}`} onChange={event => setViewName(event.target.value)} /><button type="button" onClick={saveWorkspace}>Salvar</button></div>{savedViews.length ? <ul>{savedViews.map(saved => <li key={saved.id}><button type="button" onClick={() => { const adjustment = restoreWorkspace(parseWorkspace(new URLSearchParams(saved.url.split("?")[1]))); setAnnouncement(`Análise “${saved.name}” restaurada.${adjustment}`); }}><strong>{saved.name}</strong><small>{new Date(saved.savedAt).toLocaleDateString("pt-BR")} · AMOSTRA</small></button><button type="button" aria-label={`Excluir análise ${saved.name}`} onClick={() => writeSavedViews(savedViews.filter(item => item.id !== saved.id))}><Trash2 size={14} /></button></li>)}</ul> : <div className="g23-saved-empty">Sua próxima análise pode começar daqui.</div>}</div></details><button type="button" onClick={() => setFocused(value => !value)} aria-pressed={focused}>{focused ? <Minimize2 size={14} /> : <Maximize2 size={14} />}{focused ? "Sair do foco" : "Modo foco"}</button><button type="button" className="g23-reset" onClick={() => { restoreWorkspace({ ...parseWorkspace(new URLSearchParams()), tone }); setAnnouncement("Análise inicial restaurada."); }}>Recomeçar</button></div>
          {shareFallback && <label className="g23-share-fallback">Link desta análise<input readOnly value={shareFallback} onFocus={event => event.target.select()} /></label>}
          {announcement && <p className="g23-workspace-feedback">{announcement}</p>}
        </div>}
        <WorkspaceElement className="g2t-workspace">
          <button className="g2t-mobile-map-toggle" type="button" aria-expanded={mapOpen} aria-controls={`${id}-geography`} onClick={() => setMapOpen(!mapOpen)}>
            <Crosshair size={14} /><span>{mapOpen ? "Recolher geografia" : "Explorar geografia"}</span><span>{regionInfo.code}</span><ChevronDown size={14} />
          </button>
          <section
            className="g2t-geography"
            id={`${id}-geography`}
            aria-labelledby={`${id}-map-title`}
          >
            <div className="g2t-panel-heading">
              <h2 id={`${id}-map-title`}>
                01 <span>Geografia do sinal</span>
              </h2>
              <span>4 REGIÕES</span>
            </div>
            <div className="g2t-map-stage">
              <div className="g2t-map-index" aria-hidden="true">
                <span>PROJEÇÃO / BR</span><span>SELEÇÃO ESPACIAL</span>
              </div>
              <span className="g2t-map-coordinate g2t-map-coordinate--top">
                05° N
              </span>
              <span className="g2t-map-coordinate g2t-map-coordinate--bottom">
                34° S
              </span>
              <svg
                viewBox={BRASIL_VIEWBOX}
                className="g2t-map"
                role="group"
                aria-label="Selecionar submercado brasileiro"
              >
                <defs>
                  <linearGradient id={`${id}-map-light`} x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="var(--g2t-map-selected)" />
                    <stop offset="100%" stopColor="var(--g2t-map)" />
                  </linearGradient>
                </defs>
                <path d={BRASIL_OUTLINE_D} className="g2t-map-outline" />
                {SUBMERCADOS.map((submarket) => (
                  <path
                    key={submarket.id}
                    d={submarket.d}
                    className={`g2t-map-region${region === submarket.id ? " is-selected" : ""}`}
                    style={region === submarket.id ? { fill: `url(#${id}-map-light)` } : undefined}
                    tabIndex={0}
                    role="button"
                    aria-label={`Selecionar ${submarket.nome}`}
                    aria-pressed={region === submarket.id}
                    onClick={() => selectRegion(submarket.id)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        selectRegion(submarket.id);
                      }
                    }}
                  >
                    <title>{submarket.nome}</title>
                  </path>
                ))}
                <g className="g2t-map-crosshair" style={{ transform: `translate(${selectedMarket.centroid[0]}px, ${selectedMarket.centroid[1]}px)` }} aria-hidden="true">
                  <line x1="-720" y1="0" x2="720" y2="0" />
                  <line x1="0" y1="-755" x2="0" y2="755" />
                  <circle r="23" />
                  <circle className="g2t-map-target" r="10" />
                </g>
                {SUBMERCADOS.map((submarket) => (
                  <g
                    key={submarket.id}
                    className={`g2t-map-label${region === submarket.id ? " is-selected" : ""}`}
                    transform={`translate(${submarket.centroid[0]}, ${submarket.centroid[1]})`}
                    aria-hidden="true"
                  >
                    <circle r="5" />
                    <text y="-17" textAnchor="middle">
                      {REGIONS.find((r) => r.id === submarket.id)!.code}
                    </text>
                  </g>
                ))}
              </svg>
              <div className="g2t-spatial-tag">
                <Crosshair size={12} />
                <span>{regionInfo.code}<small>REGIÃO SELECIONADA</small></span>
              </div>
              <div className="g2t-map-caption">
                <span>BR / SUBMERCADOS</span>
                <button
                  type="button"
                  onClick={() => {
                    openSources();
                    setSourceSearch("geografia");
                  }}
                >
                  IBGE · geometria <ArrowUpRight size={10} />
                </button>
              </div>
            </div>
            <div
              className="g2t-regions"
              role="group"
              aria-label="Submercado selecionado"
            >
              {REGIONS.map((item) => {
                const regionalSeries = getSeries(item.id, period, metric).slice(safeStart, safeEnd + 1);
                const regional = describeSeries(
                  regionalSeries,
                  metric,
                );
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => selectRegion(item.id)}
                    aria-pressed={region === item.id}
                  >
                    <span className="g2t-region-code">{item.code}</span>
                    <span className="g2t-region-name">{item.short}</span>
                    {isSample && <RegionalTrace series={regionalSeries} selectedIndex={inspectedPoint.index} />}
                    <span className="g2t-region-value">
                      {isSample ? formatValue(regional.last, metric) : "—"}
                    </span>
                    <ArrowUpRight size={12} />
                  </button>
                );
              })}
            </div>
            <div className="g2t-map-footnote">
              {isSample
                ? `${metricInfo.unit} · última observação simulada`
                : "Valores ausentes · sem conexão"}
              <span>A cor identifica a seleção.</span>
            </div>
          </section>

          <section
            className="g2t-series"
            aria-labelledby={`${id}-series-title`}
          >
            <div className="g2t-panel-heading">
              <h2 id={`${id}-series-title`}>
                02 <span>{regionInfo.name}</span>
              </h2>
              <label className="g2t-mobile-market">
                <span className="g2t-visually-hidden">Submercado da série</span>
                <select
                  value={region}
                  onChange={(event) =>
                    selectRegion(event.target.value as RegionId)
                  }
                >
                  {REGIONS.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.short}
                    </option>
                  ))}
                </select>
                <ChevronDown size={14} aria-hidden="true" />
              </label>
              <span>{regionInfo.code}</span>
            </div>
            <div
              className="g2t-metric-control"
              role="group"
              aria-label="Métrica da série"
            >
              {(Object.keys(METRICS) as MetricId[]).map((item) => (
                <button
                  key={item}
                  type="button"
                  aria-pressed={metric === item}
                  onClick={() => selectMetric(item)}
                >
                  {METRICS[item].label}
                </button>
              ))}
              <div
                className="g2t-mobile-period"
                role="group"
                aria-label="Janela da série no celular"
              >
                {(["24h", "7d", "30d"] as const).map((item) => (
                  <button
                    type="button"
                    key={item}
                    onClick={() => selectPeriod(item)}
                    aria-pressed={period === item}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
            <div className="g23-series-manager"><span>COMPARAR REGIÕES</span><div role="group" aria-label="Regiões na comparação">{REGIONS.map(item => <button type="button" key={item.id} aria-pressed={selectedRegions.includes(item.id)} onClick={() => toggleComparison(item.id)} disabled={item.id === region} title={item.id === region ? "Região principal da análise" : `Adicionar ou remover ${item.name}`} style={{ "--series-color": SERIES_COLORS[item.id] } as import("react").CSSProperties}><i />{item.code}{item.id === region && <small>principal</small>}</button>)}</div></div>
            <div className="g2t-series-reading">
              <div>
                <span className="g2t-value-label">{metricInfo.longLabel} · última observação</span>
                <div className="g2t-major-value">
                  {isSample ? formatValue(summary.last, metric) : "—"}
                  <span>{metricInfo.unit}</span>
                </div>
              </div>
              <div className="g2t-change">
                <span>{isSample ? summary.delta : "SEM DADO"}</span>
                <small>
                  {isSample ? "na janela selecionada" : "variação indisponível"}
                </small>
              </div>
            </div>
            <div className="g23-analysis-controls"><div className="g23-representations" role="group" aria-label="Representação da análise">{([["chart", "Gráfico"], ["table", "Tabela"], ["spatial", "Espacial"]] as const).map(([value, label]) => <button key={value} type="button" onClick={() => { setRepresentation(value); propagate("representation"); }} aria-pressed={representation === value}>{label}</button>)}</div><label className="g23-scale-control"><span className="g2t-visually-hidden">Escala da comparação</span><select value={analysisScale} onChange={event => { setAnalysisScale(event.target.value as AnalysisScale); propagate("scale"); }}><option value="native">Valores originais</option><option value="index">Índice · base 100</option></select><ChevronDown size={12} /></label></div>
            <div className="g2t-chart-legend">
              <span>
                <i />
                {isSample ? "SÉRIE SINTÉTICA" : "SÉRIE INDISPONÍVEL"}
              </span>
              <span>{safeStart === 0 && safeEnd === fullSeries.length - 1 ? periodNames[period] : `${series[0].label} — ${series[series.length - 1].label} · ${period === "24h" ? "HORÁRIO" : "DIÁRIO"}`}</span>
            </div>
            {isSample ? (
              <figure className="g2t-chart-figure">
                <div
                  className="g2t-chart"
                  data-representation={representation}
                  aria-label={`${metricInfo.longLabel} em ${regionInfo.name}. Início ${formatValue(summary.first, metric)}, fim ${formatValue(summary.last, metric)} ${metricInfo.unit}. Variação ${summary.delta}. Base demonstrativa.`}
                >
                  <AnalysisInstrument models={analysisModels} allModels={allModels} metric={metric} scale={analysisScale} view={representation} selected={inspectedPoint} id={id} inspect={inspectPoint} selectRegion={selectRegion} onSource={openSources} />
                </div>
                <div className="g2t-time-inspector">
                  <div className="g2t-probe-heading">
                    <span><Crosshair size={12} /> {inspectingNote ? `NOTA 0${eventIndex + 1}` : "OBSERVAÇÃO"} / {regionInfo.code}</span>
                    <output htmlFor={`${id}-time-scrub`}><b>{inspectedPoint.label}</b><span>{formatValue(inspectedPoint.value, metric)} <small>{metricInfo.unit}</small></span></output>
                  </div>
                  <label className="g2t-visually-hidden" htmlFor={`${id}-time-scrub`}>Inspecionar observação da série</label>
                  <input
                    id={`${id}-time-scrub`}
                    className="g2t-time-scrub"
                    type="range"
                    min={safeStart}
                    max={safeEnd}
                    step={1}
                    value={inspectedPoint.index}
                    aria-valuetext={`${inspectedPoint.label}: ${formatValue(inspectedPoint.value, metric)} ${metricInfo.unit}. Amostra sintética.`}
                    onChange={(event) => inspectPoint(Number(event.target.value))}
                  />
                  <div className="g2t-timeline-events" role="group" aria-label="Notas na linha do tempo">
                    {eventPoints.map((point, index) => (
                      <button key={index} type="button" onClick={() => selectEvent(index)} aria-pressed={eventIndex === index && inspectingNote} disabled={!observationInWindow(point.index, safeStart, safeEnd)}>
                        <i aria-hidden="true" /><span>0{index + 1}</span><strong>{point.label}</strong>{observationInWindow(point.index, safeStart, safeEnd) ? <ArrowUpRight size={11} /> : <small>fora do recorte</small>}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="g23-comparison-readout" aria-label="Valores das regiões na observação selecionada">{analysisModels.map(model => { const point = model.observations.find(item => item.index === inspectedPoint.index)!; const value = model.values[model.observations.findIndex(item => item.index === inspectedPoint.index)]; const difference = point.value - inspectedPoint.value; return <button type="button" key={model.region} onClick={() => selectRegion(model.region)} aria-pressed={model.region === region} style={{ "--series-color": SERIES_COLORS[model.region] } as import("react").CSSProperties}><span><i />{REGIONS.find(item => item.id === model.region)!.code}<small>{model.region === region ? "PRINCIPAL" : "COMPARAÇÃO"}</small></span><strong>{plotValue(value, metric, analysisScale)}<small>{analysisScale === "index" ? "índice" : metricInfo.unit}</small></strong><small>{model.region === region ? `${point.label} · base sintética` : `${difference > 0 ? "+" : ""}${formatValue(difference, metric)} ${metric === "storage" ? "p.p." : metricInfo.unit} vs. ${regionInfo.code}`}</small></button>; })}</div>
                <details className="g23-range-control"><summary>Recortar a janela<small>{series[0].label} — {series[series.length - 1].label}</small><ChevronDown size={12} /></summary><div><label>Início<select value={safeStart} onChange={event => changeWindow(Number(event.target.value), safeEnd)}>{fullSeries.slice(0, safeEnd).map(point => <option key={point.index} value={point.index}>{point.label}</option>)}</select></label><span>até</span><label>Fim<select value={safeEnd} onChange={event => changeWindow(safeStart, Number(event.target.value))}>{fullSeries.slice(safeStart + 1).map(point => <option key={point.index} value={point.index}>{point.label}</option>)}</select></label><button type="button" onClick={() => changeWindow(0, fullSeries.length - 1)}>Janela completa</button></div><p>O recorte altera o gráfico, a comparação, o cálculo e o CSV. As notas mantêm suas referências; uma observação excluída passa ao limite mais próximo, com aviso. Horário e diário são amostras independentes.</p></details>
                <figcaption>
                  <span className="g2t-baseline-key" />
                  {analysisScale === "index" ? `Base 100: ${series[0].label} · valor / início × 100` : "Tracejado: primeira observação"}
                  <span className="g2t-simulation-note">
                    Demonstração · sem dado de mercado
                  </span>
                </figcaption>
              </figure>
            ) : (
              <div className="g2t-unavailable" role="status">
                <Database size={25} strokeWidth={1} />
                <h3>A ausência também é informação.</h3>
                <p>
                  Nenhuma fonte de mercado brasileiro está conectada. Série,
                  variação e interpretação permanecem indisponíveis.
                </p>
                <button type="button" onClick={() => setSourceMode("sample")}>
                  Explorar a base demonstrativa <ArrowRight size={14} />
                </button>
              </div>
            )}
            <div className="g2t-series-extents">
              <div>
                <span>INÍCIO DA JANELA</span>
                <strong>
                  {isSample ? formatValue(summary.first, metric) : "—"}
                </strong>
              </div>
              <div>
                <span>MÍNIMO</span>
                <strong>
                  {isSample ? formatValue(summary.min, metric) : "—"}
                </strong>
              </div>
              <div>
                <span>MÁXIMO</span>
                <strong>
                  {isSample ? formatValue(summary.max, metric) : "—"}
                </strong>
              </div>
              <div>
                <span>OBSERVAÇÕES</span>
                <strong>
                  {isSample ? String(series.length).padStart(2, "0") : "—"}{" "}
                  <small>{period === "24h" ? "horárias" : "diárias"}</small>
                </strong>
              </div>
            </div>
          </section>

          <aside
            className="g2t-interpretation"
            aria-labelledby={`${id}-reading-title`}
          >
            <div className="g2t-panel-heading">
              <h2 id={`${id}-reading-title`}>
                03 <span>Caderno de leitura</span>
              </h2>
              <BookOpen size={13} />
            </div>
            <div className="g2t-reading-body">
              <span className="g2t-eyebrow">
                {isSample ? "LEITURA DA AMOSTRA" : "LEITURA SUSPENSA"}
              </span>
              <h3>
                {isSample
                  ? `${metricName} ${direction} na janela.`
                  : "Sem observação, sem conclusão."}
              </h3>
              <p>
                {isSample ? (
                  <>
                    Em {regionInfo.name}, a série vai de{" "}
                    <strong>{formatValue(summary.first, metric)}</strong> a{" "}
                    <strong>
                      {formatValue(summary.last, metric)} {metricInfo.unit}
                    </strong>
                    . A variação de <strong>{summary.delta}</strong> descreve a
                    amostra; não explica o movimento.
                  </>
                ) : (
                  "Uma fonte indisponível não equivale a um valor zero, a um mercado estável ou à continuidade da última leitura."
                )}
              </p>
              <div className="g2t-reading-annotation">
                <span>
                  {isSample ? "01 / EVIDÊNCIA" : "01 / DISPONIBILIDADE"}
                </span>
                <p>
                  {isSample
                    ? `${series.length} observações sintéticas. Janela e submercado identificados. Cálculo reproduzível no CSV.`
                    : "API brasileira não conectada. Nenhum dado substituto é tratado como observação."}
                </p>
              </div>
              {isSample && <TerminalReading className="g2t-observation-trace" region={region} metric={metric} observation={inspectedPoint} onInspectSource={openSources} compact />}
              {isSample && selectedRegions.length > 1 && <div className="g23-comparison-method"><span>COMPARAÇÃO / {selectedRegions.length} REGIÕES</span><p>{analysisScale === "index" ? `Cada série começa em 100 em ${series[0].label}. O índice compara trajetórias; os valores originais continuam disponíveis na tabela e no CSV.` : "Mesma métrica, mesma frequência e mesma janela. A distância entre curvas descreve a amostra; não demonstra restrição de transmissão."}</p></div>}
              <div className="g2t-reading-annotation g2t-reading-annotation--question">
                <span>02 / CONTRADITÓRIO</span>
                <p>
                  {isSample
                    ? `Nota 0${eventIndex + 1} · ${selectedPoint.label}${selectedNoteInWindow ? ": uma hipótese." : " · fora do recorte."}`
                    : "O que falta para retomar?"}
                </p>
                <small>
                  {isSample
                    ? question.hypothesis
                    : "Uma fonte identificada, cobertura conhecida, horário de referência e método verificável."}
                </small>
              </div>
            </div>
            <button
              type="button"
              className="g2t-reading-link"
              onClick={openSources}
            >
              Abrir fontes & método <ArrowUpRight size={15} />
            </button>
          </aside>
        </WorkspaceElement>

        {!compact && (
          <section
            className="g2t-notebook"
            id={`${id}-caderno`}
            aria-labelledby={`${id}-notes-title`}
          >
            <div className="g2t-notebook-intro">
              <div className="g2t-eyebrow">DO SINAL À PERGUNTA</div>
              <h2 id={`${id}-notes-title`}>
                Nada se explica
                <br />
                sozinho.
              </h2>
              <p>
                Selecione uma observação.
                <br />
                Examine uma hipótese possível.
              </p>
              <span className="g2t-demo-label">NOTAS ILUSTRATIVAS</span>
            </div>
            <div className="g2t-observations">
              <div
                className="g2t-event-control"
                role="group"
                aria-label="Observação para examinar"
              >
                {eventPoints.map((point, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => selectEvent(index)}
                    aria-pressed={eventIndex === index && inspectingNote}
                    disabled={!isSample || !observationInWindow(point.index, safeStart, safeEnd)}
                  >
                    <span>
                      NOTA 0{index + 1}
                      <ArrowUpRight size={13} />
                    </span>
                    <strong>{isSample ? point.label : "—"}</strong>
                    <small>
                      {isSample
                        ? observationInWindow(point.index, safeStart, safeEnd) ? `${formatValue(point.value, metric)} ${metricInfo.unit}` : "fora do recorte"
                        : "sem observação"}
                    </small>
                  </button>
                ))}
              </div>
              <div className="g2t-event-dossier" key={`${metric}-${eventIndex}`} aria-live="polite">
                <div>
                  <span className="g2t-eyebrow">
                    HIPÓTESE A EXAMINAR / 0{eventIndex + 1}{isSample ? ` · ${selectedPoint.label}${selectedNoteInWindow ? "" : " · fora do recorte"}` : ""}
                  </span>
                  <h3>
                    {isSample
                      ? question.hypothesis
                      : "A investigação aguarda uma fonte."}
                  </h3>
                </div>
                <div>
                  <span className="g2t-eyebrow">COMO COLOCÁ-LA À PROVA</span>
                  <p>
                    {isSample
                      ? question.check
                      : "Conectar uma série com fonte e período verificáveis. Retomar a investigação quando existir observação."}
                  </p>
                </div>
              </div>
              {isSample && (
                <details className="g2t-data-table">
                  <summary>
                    Consultar as {series.length} observações da seleção{" "}
                    <ChevronDown size={13} />
                  </summary>
                  <div className="g2t-table-scroll">
                    <table>
                      <caption>
                        {regionInfo.name} · {metricInfo.longLabel} · {period} ·{" "}
                        {SAMPLE_VERSION}
                      </caption>
                      <thead>
                        <tr>
                          <th scope="col">
                            Referência{" "}
                            {period === "24h" ? "(UTC−03:00)" : "(dia)"}
                          </th>
                          <th scope="col">Valor ({metricInfo.unit})</th>
                          <th scope="col">Classificação</th>
                        </tr>
                      </thead>
                      <tbody>
                        {series.map((point) => (
                          <tr key={point.index}>
                            <th scope="row">{point.timestamp}</th>
                            <td>{formatValue(point.value, metric)}</td>
                            <td>Demonstração sintética</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </details>
              )}
            </div>
          </section>
        )}

        <footer className="g2t-footer">
          <Link to="/br">
            <ArrowLeft size={12} /> Portal Brasil
          </Link>
          <button
            type="button"
            className="g2t-mobile-export"
            onClick={exportCsv}
            disabled={!isSample}
          >
            <ArrowDownToLine size={13} /> Exportar amostra
          </button>
          <span>
            {isSample
              ? `AMOSTRA FIXA · ${SAMPLE_VERSION}`
              : "SEM FONTE CONECTADA · SEM ATUALIZAÇÃO"}
          </span>
          <button type="button" onClick={openSources}>
            Proveniência visível <ArrowUpRight size={12} />
          </button>
        </footer>
        <p className="g2t-visually-hidden" role="status">
          {announcement}
        </p>
      </div>

      <dialog
        ref={dialogRef}
        className="g2t-source-dialog"
        aria-labelledby={`${id}-sources-title`}
        onKeyDown={(event) => {
          if (event.key === "Escape") {
            event.preventDefault();
            dialogRef.current?.close();
          }
        }}
        onClick={(event) => {
          if (event.target === event.currentTarget) dialogRef.current?.close();
        }}
      >
        <div className="g2t-dialog-inner">
          <div className="g2t-dialog-top">
            <span className="g2t-eyebrow">REGISTRO DE PROVENIÊNCIA</span>
            <button
              className="g2t-icon-button"
              type="button"
              aria-label="Fechar fontes e método"
              onClick={() => dialogRef.current?.close()}
            >
              <X size={19} />
            </button>
          </div>
          <h2 id={`${id}-sources-title`}>
            Uma leitura precisa
            <br />
            poder ser examinada.
          </h2>
          <p className="g2t-dialog-intro">
            Origem, cálculo e limites desta tela — no mesmo lugar.
          </p>
          <div className="g2t-source-context" aria-label="Contexto preservado da seleção">
            <span><Crosshair size={14} /> {isSample ? "OBSERVAÇÃO EM EXAME" : "FONTE INDISPONÍVEL"}</span>
            <strong>{regionInfo.name} <i /> {metricInfo.label}</strong>
            <div><b>{isSample ? formatValue(inspectedPoint.value, metric) : "—"} <small>{metricInfo.unit}</small></b><span>{isSample ? inspectedPoint.timestamp : "sem observação"}</span></div>
            <small>{isSample ? SAMPLE_VERSION : "Nenhum valor de mercado conectado"}</small>
            {isSample && <p className="g23-source-selection">{selectedRegions.length} regiões · {series[0].timestamp} a {series[series.length - 1].timestamp}. {analysisScale === "index" ? "Índice = valor original / primeira observação visível × 100. Baseline nulo ou zero resulta em ausência. O CSV preserva original e transformado." : "Valores originais, sem transformação."}</p>}
          </div>
          <label className="g2t-source-search">
            <Search size={16} />
            <span className="g2t-visually-hidden">Buscar fonte ou método</span>
            <input
              type="search"
              value={sourceSearch}
              onChange={(event) => setSourceSearch(event.target.value)}
              placeholder="Buscar fonte, cálculo, limite…"
            />
          </label>
          <p className="g2t-search-count" role="status">
            {filteredSources.length}{" "}
            {filteredSources.length === 1 ? "registro" : "registros"}
          </p>
          <div className="g2t-source-records">
            {filteredSources.length ? (
              filteredSources.map((record) => (
                <article key={record.id}>
                  <span className="g2t-eyebrow">{record.kind}</span>
                  <h3>{record.title}</h3>
                  <p>{record.text}</p>
                  <p className="g2t-record-detail">{record.detail}</p>
                  {record.href && (
                    <a href={record.href} target="_blank" rel="noreferrer">
                      Consultar malha primária do IBGE{" "}
                      <ArrowUpRight size={13} />
                    </a>
                  )}
                </article>
              ))
            ) : (
              <p className="g2t-no-results">
                Nenhum registro para “{sourceSearch}”. Tente “amostra”,
                “cálculo” ou “geografia”.
              </p>
            )}
          </div>
          <div className="g2t-dialog-bottom">
            <span>NIVAR / MÉTODO ANTES DA CONCLUSÃO</span>
            <button type="button" onClick={() => dialogRef.current?.close()}>
              Voltar à leitura <ArrowRight size={13} />
            </button>
          </div>
        </div>
      </dialog>
    </section>
  );
}

export function TerminalPreview({ initialRegion, initialProbeIndex, onEntryUrlChange }: Pick<TerminalBrasilProps, "initialRegion" | "initialProbeIndex" | "onEntryUrlChange"> = {}) {
  return <TerminalBrasil compact initialRegion={initialRegion} initialProbeIndex={initialProbeIndex} onEntryUrlChange={onEntryUrlChange} />;
}
/** Public entry accepts only known presentation context. The observation bound
 * comes from the selected fixture window. No query can supply a datum or API. */
export default function TerminalPage() {
  useNivarFavicon();
  const [params] = useSearchParams();
  const initial = parseWorkspace(params);
  if (!params.has("tone")) {
    try { const stored = localStorage.getItem("nivar-g2-mode"); if (stored === "light") initial.tone = "paper"; else if (stored === "dark") initial.tone = "graphite"; } catch { /* Explicit URL/default remains valid. */ }
  }
  const contextKey = params.toString();
  return <TerminalBrasil key={contextKey} initialWorkspace={initial} initialRegion={initial.region} initialPeriod={initial.period} initialMetric={initial.metric} initialSourceMode={initial.source} initialTone={initial.tone} initialEventIndex={initial.note} initialProbeIndex={initial.observation} />;
}
