import { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  ArrowLeft,
  ChartNoAxesColumn,
  Copy,
  Download,
  History,
  TriangleAlert,
} from "lucide-react";
import { AriadneContext, AriadneSourceAction } from "./AriadneWorkspaceChrome";
import {
  ComposedChart,
  LineChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { closeApi } from "../../lib/ariadne/closeApi";
import {
  PlanningRequests,
  samePlanAssumptions,
  planMonthKey,
  selectedPlanMonth,
  planPreviewForDisplay,
} from "../../lib/ariadne/planningSelection";
import {
  planningApi,
  planRoot,
  type PlanView,
  type SavedPlan,
  type PlanAssumptions,
} from "../../lib/ariadne/planningApi";
import "./ariadne-review-desk.css";
import "./ariadne-planning.css";
const brl = (s: string | null | undefined) =>
  s == null
    ? "Não coberto"
    : `R$ ${s.replace(
        /^(-?)(\d+)(?:\.(\d+))?$/,
        (_, sign, int, fraction) =>
          `${sign}${int.replace(/\B(?=(\d{3})+(?!\d))/g, ".")}${fraction ? `,${fraction}` : ""}`,
      )}`;
const errorText = (e: unknown) =>
  e instanceof Error ? e.message : "Falha de planejamento";
// Development-only, numeric timing evidence; no workspace/source fields in logs.
function measure(name: string, start: number) {
  const end = performance.now();
  performance.measure(name, { start, end });
  console.debug(`[ariadne-plan] ${name}: ${(end - start).toFixed(2)} ms`);
}

export function AriadnePlanning() {
  const [query, setQuery] = useSearchParams(),
    w = query.get("workspace") || "",
    r = query.get("review") || "",
    b = query.get("baseline") || "";
  const scenarioId = query.get("scenario") || "",
    root = planRoot(w, r, b);
  const [view, setView] = useState<PlanView | null>(null),
    [saved, setSaved] = useState<SavedPlan[]>([]);
  const [candidate, setCandidate] = useState(""),
    [normal, setNormal] = useState(false),
    [applicable, setApplicable] = useState(false);
  const [month, setMonth] = useState(""),
    [name, setName] = useState("Alternativa"),
    [historical, setHistorical] = useState(false);
  const [pending, setPending] = useState(false),
    [busy, setBusy] = useState(""),
    [error, setError] = useState(""),
    [notice, setNotice] = useState("");
  const [compare, setCompare] = useState(false),
    [original, setOriginal] = useState("");
  const requests = useRef(new PlanningRequests()),
    epoch = useRef(requests.current.loads),
    previewEpoch = useRef(requests.current.previews),
    actions = useRef(requests.current.actions);
  const liveContext = useRef("");
  liveContext.current = JSON.stringify([
    w,
    r,
    b,
    scenarioId,
    candidate,
    normal,
    applicable,
  ]);
  const selected = saved.find((s) => s.id === scenarioId);
  const preserved =
    !!selected &&
    samePlanAssumptions(selected.output.assumptions, {
      candidateKw: candidate,
      normalRegime: normal,
      tariffApplicability: applicable,
    });
  useEffect(() => {
    const ticket = epoch.current.next(),
      controller = new AbortController();
    actions.current.next();
    setView(null);
    setSaved([]);
    setCandidate("");
    setMonth("");
    setError("");
    setPending(true);
    setCompare(false);
    setBusy("");
    setNotice("");
    setHistorical(false);
    setOriginal("");
    if (!w || !r || !b) {
      setPending(false);
      return;
    }
    const started = performance.now();
    Promise.all([
      planningApi.baseline(root, controller.signal),
      planningApi.saved(root, controller.signal),
    ])
      .then(([base, branches]) => {
        if (!epoch.current.current(ticket)) return;
        const preserved = branches.find((s) => s.id === scenarioId);
        if (scenarioId && !preserved)
          throw new Error("Cenário não disponível neste baseline privado.");
        const current = preserved || base;
        setView(current);
        setSaved(branches);
        setCandidate(current.output.assumptions.candidateKw);
        setNormal(current.output.assumptions.normalRegime);
        setApplicable(current.output.assumptions.tariffApplicability);
        const remembered =
          selectedPlanMonth(current.output.months, query.get("item") || "") ||
          current.output.months.find((m) => m.label === query.get("month")) ||
          current.output.months.find((m) => m.physicalCovered);
        setMonth(remembered ? planMonthKey(remembered) : "");
        setName(preserved?.name || "Alternativa");
        requestAnimationFrame(() =>
          measure("ariadne-plan-first-useful", started),
        );
      })
      .catch((e) => {
        if (!controller.signal.aborted && epoch.current.current(ticket))
          setError(errorText(e));
      })
      .finally(() => {
        if (epoch.current.current(ticket)) setPending(false);
      });
    return () => {
      controller.abort();
      epoch.current.next();
    };
  }, [w, r, b, scenarioId]);
  useEffect(() => {
    if (!view) return;
    if (!candidate) {
      setPending(false);
      setError("Informe a demanda candidata; campo vazio não significa zero.");
      return;
    }
    const ticket = previewEpoch.current.next(),
      controller = new AbortController(),
      started = performance.now(),
      context = liveContext.current;
    setPending(true);
    setError("");
    const timer = setTimeout(() => {
      const assumptions: PlanAssumptions = {
        candidateKw: candidate,
        normalRegime: normal,
        tariffApplicability: applicable,
      };
      planningApi
        .preview(root, assumptions, controller.signal)
        .then((response) => {
          if (
            !previewEpoch.current.current(ticket) ||
            context !== liveContext.current
          )
            return;
          measure("ariadne-plan-candidate-response", started);
          setView(planPreviewForDisplay(response, selected, assumptions));
          setPending(false);
          requestAnimationFrame(() =>
            measure("ariadne-plan-candidate-visual", started),
          );
        })
        .catch((e) => {
          if (
            !controller.signal.aborted &&
            previewEpoch.current.current(ticket) &&
            context === liveContext.current
          ) {
            setError(errorText(e));
            setPending(false);
          }
        });
    }, 120);
    return () => {
      clearTimeout(timer);
      controller.abort();
      previewEpoch.current.next();
    };
  }, [w, r, b, candidate, normal, applicable]);
  const output = view?.output,
    proof = output ? selectedPlanMonth(output.months, month) : undefined;
  useEffect(() => {
    setOriginal("");
    if (!proof?.sourceRef.sourceId || !proof.sourceRef.page) return;
    const controller = new AbortController();
    let objectUrl = "";
    fetch(closeApi.originalUrl(w, r, proof.sourceRef.sourceId), {
      credentials: "include",
      signal: controller.signal,
    })
      .then(async (response) => {
        if (!response.ok) throw new Error("Original privado indisponível");
        return response.blob();
      })
      .then((blob) => {
        if (controller.signal.aborted) return;
        objectUrl = URL.createObjectURL(blob);
        setOriginal(objectUrl);
      })
      .catch((e) => {
        if (!controller.signal.aborted) setError(errorText(e));
      });
    return () => {
      controller.abort();
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [w, r, b, proof?.sourceRef.sourceId, proof?.sourceRef.page]);
  async function act(
    label: string,
    fn: (current: () => boolean) => Promise<void>,
  ) {
    const ticket = actions.current.next(),
      context = liveContext.current,
      current = () =>
        actions.current.current(ticket) && context === liveContext.current;
    setBusy(label);
    setError("");
    setNotice("");
    try {
      await fn(current);
    } catch (e) {
      if (current()) setError(errorText(e));
    } finally {
      if (actions.current.current(ticket)) setBusy("");
    }
  }
  function chooseMonth(key: string, label: string) {
    const start = performance.now();
    setMonth(key);
    setQuery(
      (previous) => {
        const next = new URLSearchParams(previous);
        next.set("month", label);
        next.set("item", key);
        return next;
      },
      { replace: true },
    );
    requestAnimationFrame(() => measure("ariadne-plan-month-proof", start));
  }
  if (!w || !r || !b)
    return (
      <section className="desk plan">
        <AriadneContext title="Planejamento" status="Desenvolvimento" />
        <div className="aw-empty">
          <h2>Planeje a partir de um estado revisado</h2>
          <p>Abra uma revisão com observações de demanda para começar.</p>
          <Link className="aw-back" to="/operador/ariadne/fechamento">
            <ArrowLeft size={15} aria-hidden /> Ir para a mesa de revisão
          </Link>
        </div>
      </section>
    );
  return (
    <section
      className="desk plan"
      aria-label="Laboratório de demanda contratada"
    >
      <AriadneContext
        title="Planejamento"
        navigation={
          <Link
            className="aw-back"
            to={`/operador/ariadne/fechamento?workspace=${w}&review=${r}&result=${b}`}
          >
            <ArrowLeft size={15} aria-hidden /> Estado revisado
          </Link>
        }
        context={
          output && (
            <>
              Unidade {output.scope}
              {proof && ` · ${proof.label}`} · Desenvolvimento
            </>
          )
        }
        status={
          output &&
          (pending
            ? "Atualizando…"
            : preserved
              ? "Cenário preservado"
              : "Explorando")
        }
        announcement={
          output ? (preserved ? "Cenário preservado" : "Explorando") : ""
        }
        actions={
          output && (
            <div className="plan__save">
              <label>
                Nome do cenário
                <input
                  value={name}
                  maxLength={160}
                  onChange={(e) => setName(e.target.value)}
                />
              </label>
              <button
                className="desk__primary"
                disabled={
                  pending ||
                  !!busy ||
                  !name.trim() ||
                  !!error ||
                  (!historical && view?.newerBaselineExists)
                }
                onClick={() =>
                  void act("Preservando cenário…", async (current) => {
                    const result = await planningApi.save(root, {
                      candidateKw: candidate,
                      normalRegime: normal,
                      tariffApplicability: applicable,
                      name,
                      acknowledgeHistoricalBaseline: historical,
                    });
                    if (current())
                      setQuery({
                        workspace: w,
                        review: r,
                        baseline: b,
                        ...(proof ? { month: proof.label, item: month } : {}),
                        scenario: result.id,
                      });
                  })
                }
              >
                Preservar cenário
              </button>
            </div>
          )
        }
      />
      {error && (
        <p role="alert" className="desk__error">
          {error}
        </p>
      )}
      {notice && (
        <p role="status" className="desk__notice">
          {notice}
        </p>
      )}
      {!output ? (
        <p role="status" className="aw-empty">
          {pending ? "Abrindo o estado preservado…" : "Baseline indisponível."}
        </p>
      ) : (
        <>
          {view?.newerBaselineExists && (
            <p className="desk__warnings">
              Existe um estado revisado mais recente. Este cenário mantém o
              baseline histórico.{" "}
              <label>
                <input
                  type="checkbox"
                  checked={historical}
                  onChange={(e) => setHistorical(e.target.checked)}
                />{" "}
                Reconheço o uso do baseline histórico
              </label>
            </p>
          )}
          <div className="plan__workspace" aria-busy={pending}>
            <aside className="plan__baseline">
              <div className="plan__branches">
                <label>
                  Cenário{" "}
                  <select
                    value={scenarioId}
                    onChange={(e) =>
                      setQuery({
                        workspace: w,
                        review: r,
                        baseline: b,
                        ...(proof ? { month: proof.label, item: month } : {}),
                        ...(e.target.value ? { scenario: e.target.value } : {}),
                      })
                    }
                  >
                    <option value="">
                      Baseline observado · {output.baselineKw} kW
                    </option>
                    {saved.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} · {s.output.assumptions.candidateKw} kW
                      </option>
                    ))}
                  </select>
                </label>
                <button
                  disabled={!!busy || pending}
                  onClick={() => setCompare(!compare)}
                  aria-expanded={compare}
                  aria-controls={
                    compare ? "ariadne-preserved-comparison" : undefined
                  }
                >
                  <ChartNoAxesColumn size={15} aria-hidden /> Comparar
                  preservados ({saved.length})
                </button>
              </div>
              <h2>Meses do baseline</h2>
              <p className="plan__muted">
                {output.coverage.physical}/{output.coverage.total} físicos ·{" "}
                {output.coverage.covered}/{output.coverage.total} com custo
              </p>
              <div className="plan__months">
                {output.months.map((m, i) => (
                  <button
                    key={m.label + i}
                    aria-pressed={month === planMonthKey(m)}
                    className={
                      month === planMonthKey(m) ? "plan__selected" : ""
                    }
                    onClick={() => chooseMonth(planMonthKey(m), m.label)}
                  >
                    <span className="plan__month-label" title={m.label}>
                      {m.label.startsWith("Página ")
                        ? m.label.split(" · ")[0]
                        : m.label}
                    </span>
                    <strong>
                      {m.demandKw == null ? "—" : `${m.demandKw} kW`}
                    </strong>
                    <small className="aw-coverage">
                      {m.covered
                        ? "Coberto"
                        : m.physicalCovered
                          ? "Só demanda"
                          : "Sem leitura"}
                      {m.trigger && (
                        <span
                          className="plan__overrun"
                          title="Ultrapassagem modelada"
                        >
                          <TriangleAlert size={12} aria-hidden />
                          <span className="aw-sr-only">
                            {" "}
                            · ultrapassagem modelada
                          </span>
                        </span>
                      )}
                    </small>
                  </button>
                ))}
              </div>
              <p className="plan__muted">
                Fonte pesquisável de documento escaneado. Sem novo OCR;
                históricos sobrepostos não preenchem lacunas.
              </p>
            </aside>
            <section
              className="plan__canvas"
              aria-labelledby="ariadne-demand-title"
            >
              <h2 id="ariadne-demand-title">Demanda contratada</h2>
              <p className="plan__muted">
                Contrato observado: {output.baselineKw} kW · máximo de{" "}
                {output.maximumKw ?? "—"} kW
              </p>
              <div className="plan__candidate">
                <div className="plan__decision">
                  <label>
                    Demanda candidata · kW
                    <input
                      aria-label="Demanda candidata em kW"
                      type="number"
                      min="30"
                      max="100000"
                      step="0.01"
                      value={candidate}
                      onChange={(e) => setCandidate(e.target.value)}
                    />
                  </label>
                </div>
                <input
                  aria-label="Explorar demanda contratada"
                  className="plan__slider"
                  type="range"
                  min={view?.curve?.[0]?.candidateKw || 30}
                  max={view?.curve?.at(-1)?.candidateKw || 1000}
                  step="1"
                  value={candidate}
                  onChange={(e) => setCandidate(e.target.value)}
                />
              </div>
              <p className="plan__legend">
                <span data-key="registered">Registrado</span>
                <span data-key="baseline">Contrato observado</span>
                <span data-key="candidate">Candidato</span>
                {normal && <span data-key="threshold">Limiar de 105%</span>}
                <span data-key="uncovered">Sem custo coberto</span>
              </p>
              <div
                className="plan__demand"
                aria-label="Perfil mensal de demanda e limiar"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart
                    data={output.months.map((m) => ({
                      ...m,
                      value: m.demandKw == null ? null : Number(m.demandKw),
                    }))}
                    margin={{ left: 0, right: 12, top: 12, bottom: 0 }}
                    onClick={(state) => {
                      if (state.activeTooltipIndex == null) return;
                      const selectedMonth =
                        output.months[Number(state.activeTooltipIndex)];
                      if (selectedMonth)
                        chooseMonth(
                          planMonthKey(selectedMonth),
                          selectedMonth.label,
                        );
                    }}
                  >
                    <XAxis
                      dataKey="label"
                      tick={{ fontSize: 10 }}
                      tickFormatter={(label) =>
                        String(label).startsWith("Página ")
                          ? `p.${String(label).split(" ")[1]}`
                          : String(label)
                      }
                    />
                    <YAxis unit=" kW" width={62} domain={[0, "auto"]} />
                    <Tooltip
                      cursor={{ fill: "var(--desk-select)", opacity: 0.65 }}
                    />
                    <Bar
                      dataKey="value"
                      name="Registrado"
                      isAnimationActive={false}
                    >
                      {output.months.map((m, i) => (
                        <Cell
                          key={i}
                          opacity={m.covered ? 1 : 0.4}
                          fill={
                            planMonthKey(m) === month
                              ? "var(--aw-accent)"
                              : m.trigger
                                ? "var(--aw-chart-overrun)"
                                : "var(--aw-chart-bar)"
                          }
                        />
                      ))}
                    </Bar>
                    <ReferenceLine
                      y={Number(output.baselineKw)}
                      stroke="var(--aw-chart-neutral)"
                    />
                    <ReferenceLine
                      y={Number(output.assumptions.candidateKw)}
                      stroke="var(--aw-accent)"
                      strokeWidth={2.5}
                    />
                    {normal && (
                      <ReferenceLine
                        y={Number(output.months[0]?.thresholdKw)}
                        stroke="var(--aw-chart-neutral)"
                        strokeDasharray="4 4"
                      />
                    )}
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
              <div className="plan__curve">
                <h2>
                  Custo × demanda contratada{" "}
                  <small>
                    {output.coverage.covered}/{output.coverage.total} meses
                  </small>
                </h2>
                {!!view?.curve?.length && (
                  <ResponsiveContainer width="100%" height={145}>
                    <LineChart
                      data={(view?.curve || []).map((p) => ({
                        kw: Number(p.candidateKw),
                        cost: p.cost == null ? null : Number(p.cost),
                      }))}
                      margin={{ left: 0, right: 15, top: 12 }}
                    >
                      <XAxis
                        dataKey="kw"
                        type="number"
                        domain={["dataMin", "dataMax"]}
                        unit=" kW"
                      />
                      <YAxis width={62} domain={["auto", "auto"]} />
                      <Tooltip />
                      <Line
                        type="linear"
                        dataKey="cost"
                        name="BRL cobertos"
                        stroke="var(--aw-accent)"
                        dot={false}
                        isAnimationActive={false}
                        connectNulls={false}
                      />
                      <ReferenceLine
                        x={Number(output.assumptions.candidateKw)}
                        stroke="var(--aw-chart-neutral)"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                )}
                <p>
                  {view?.lowestExplored
                    ? `Menor custo modelado no intervalo explorado: ${view.lowestExplored.candidateKw} kW · ${brl(view.lowestExplored.cost)}.`
                    : preserved && !pending
                      ? `Resultado preservado no modelo ${output.version}. Altere uma premissa para explorar com o modelo atual.`
                      : "Reconheça as premissas para explorar custos."}{" "}
                  Não é recomendação contratual.
                </p>
              </div>
              <div className="plan__saved-actions">
                {selected && (
                  <button
                    disabled={!!busy || pending}
                    onClick={() =>
                      void act("Duplicando…", async (current) => {
                        const copy = await planningApi.duplicate(
                          root,
                          selected.id,
                          `${selected.name} · cópia`,
                          historical,
                        );
                        if (current())
                          setQuery({
                            workspace: w,
                            review: r,
                            baseline: b,
                            ...(proof
                              ? { month: proof.label, item: month }
                              : {}),
                            scenario: copy.id,
                          });
                      })
                    }
                  >
                    <Copy size={15} aria-hidden /> Duplicar cenário
                  </button>
                )}
                {selected && (
                  <div className="plan__actions">
                    <button
                      disabled={!!busy}
                      onClick={() =>
                        void act("Reconstruindo…", async (current) => {
                          const result = await planningApi.replay(
                            root,
                            selected.id,
                          );
                          if (current())
                            setNotice(
                              result.matches
                                ? "Replay exato: resultado idêntico."
                                : "Falha de replay.",
                            );
                        })
                      }
                    >
                      <History size={15} aria-hidden /> Reconstruir resultado
                    </button>
                    <a href={planningApi.exportUrl(root, selected.id)}>
                      <Download size={15} aria-hidden /> Exportar cenário exato
                    </a>
                  </div>
                )}
              </div>
            </section>
            <aside className="plan__impact">
              <h2>Impacto no escopo coberto</h2>
              <p className="plan__delta">{pending ? "…" : brl(output.delta)}</p>
              <p>
                Candidato menos baseline modelado · {output.coverage.covered}/
                {output.coverage.total} meses
              </p>
              <p>Referência tarifária antes de tributos</p>
              <dl>
                <div>
                  <dt>Custo modelado</dt>
                  <dd>{pending ? "…" : brl(output.cost)}</dd>
                </div>
                <div>
                  <dt>Baseline modelado</dt>
                  <dd>{brl(output.baselineCost)}</dd>
                </div>
              </dl>
              <details className="aw-disclosure plan__impact-detail">
                <summary>Detalhes do impacto</summary>
                <dl>
                  <div>
                    <dt>Ultrapassagem / exposição não usada</dt>
                    <dd>
                      {brl(output.overrunCost)} / {brl(output.unusedExposure)}
                    </dd>
                  </div>
                  <div>
                    <dt>Meses acima do limite / abaixo do contrato</dt>
                    <dd>
                      {output.overrunMonths} / {output.unusedMonths} ·{" "}
                      {output.coverage.physical} meses físicos
                    </dd>
                  </div>
                </dl>
              </details>
              {busy && <p role="status">{busy}</p>}
              {proof && (
                <article className="plan__proof">
                  <h2>{proof.label} · prova</h2>
                  <AriadneSourceAction
                    href={
                      proof.sourceRef.page
                        ? original
                          ? `${original}#page=${proof.sourceRef.page}`
                          : undefined
                        : closeApi.originalUrl(w, r, proof.sourceRef.sourceId)
                    }
                    page={proof.sourceRef.page}
                  />
                  <dl>
                    <div>
                      <dt>Demanda observada</dt>
                      <dd>
                        {proof.demandKw == null
                          ? "Sem leitura"
                          : `${proof.demandKw} kW`}
                      </dd>
                    </div>
                    <div>
                      <dt>Demanda candidata</dt>
                      <dd>{output.assumptions.candidateKw} kW</dd>
                    </div>
                    <div>
                      <dt>Referência externa</dt>
                      <dd>
                        {proof.rate
                          ? `${brl(proof.rate.rate)}/kW`
                          : "Não coberta"}
                      </dd>
                    </div>
                    {pending ? (
                      <div>
                        <dt>Subtotal modelado</dt>
                        <dd>Atualizando…</dd>
                      </div>
                    ) : proof.modeled ? (
                      <>
                        <div>
                          <dt>Componente regular</dt>
                          <dd>{brl(proof.modeled.regular)}</dd>
                        </div>
                        <div>
                          <dt>Ultrapassagem modelada</dt>
                          <dd>{brl(proof.modeled.overrun)}</dd>
                        </div>
                        <div className="plan__proof-total">
                          <dt>Subtotal modelado do mês</dt>
                          <dd>{brl(proof.modeled.total)}</dd>
                        </div>
                      </>
                    ) : (
                      <div>
                        <dt>Subtotal modelado</dt>
                        <dd>Não coberto</dd>
                      </div>
                    )}
                  </dl>
                  {proof.reasons.map((reason) => (
                    <p className="desk__invalid" key={reason}>
                      {reason}
                    </p>
                  ))}
                  <details>
                    <summary>Localizadores e valores brutos</summary>
                    <pre>
                      {JSON.stringify(
                        {
                          raw: proof.raw,
                          source: proof.sourceRef,
                          rate: proof.rate?.sourceRef,
                        },
                        null,
                        2,
                      )}
                    </pre>
                    <p>
                      Imagem embutida acima do limite seguro de prévia; original
                      preservado para inspeção.
                    </p>
                  </details>
                  <details>
                    <summary>Regra e fórmula · {output.version}</summary>
                    <p>{proof.formula}</p>
                    <p>{output.policy.rule}</p>
                    <p>{proof.rate?.authority}</p>
                    {proof.rate && (
                      <p>
                        Vigência da referência: {proof.rate.effective_from}–
                        {proof.rate.effective_to}
                      </p>
                    )}
                    <p>{output.policy.rounding}</p>
                    <a
                      href={output.policy.authorityUrl}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Publicação normativa
                    </a>
                    <p>
                      Janela verificada: 2019-03–2020-02. Contrato e exceções
                      reais exigem revisão qualificada.
                    </p>
                  </details>
                </article>
              )}
              <details className="aw-disclosure" open={!scenarioId}>
                <summary>Premissas do cenário</summary>
                <fieldset disabled={!!busy}>
                  <legend>Premissas explícitas</legend>
                  <label>
                    <input
                      type="checkbox"
                      checked={normal}
                      onChange={(e) => setNormal(e.target.checked)}
                    />{" "}
                    Simular regime normal, sem sazonalidade reconhecida, rural
                    ou período de teste.
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      checked={applicable}
                      onChange={(e) => setApplicable(e.target.checked)}
                    />{" "}
                    Reconheço a referência A4 verde ordinária e sua base antes
                    de tributos; sem comparação à fatura bruta.
                  </label>
                </fieldset>
              </details>
            </aside>
          </div>
          {compare && (
            <div className="plan__comparison" id="ariadne-preserved-comparison">
              <h2>Baseline e alternativas preservadas</h2>
              <table>
                <thead>
                  <tr>
                    <th>Cenário</th>
                    <th>Premissa kW</th>
                    <th>Custo modelado</th>
                    <th>Delta</th>
                    <th>Ultrapassagem</th>
                    <th>Cobertura</th>
                    <th>Premissas reconhecidas</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Baseline observado</td>
                    <td>{output.baselineKw}</td>
                    <td>{brl(output.baselineCost)}</td>
                    <td>{brl("0.00")}</td>
                    <td>Ver perfil observado</td>
                    <td>
                      {output.coverage.covered}/{output.coverage.total}
                    </td>
                    <td>
                      Regime normal: {normal ? "sim" : "não"} · tarifa:{" "}
                      {applicable ? "sim" : "não"}
                    </td>
                  </tr>
                  {saved.map((s) => (
                    <tr key={s.id}>
                      <td>{s.name}</td>
                      <td>{s.output.assumptions.candidateKw}</td>
                      <td>{brl(s.output.cost)}</td>
                      <td>{brl(s.output.delta)}</td>
                      <td>
                        {s.output.overrunMonths} / {s.output.coverage.physical}{" "}
                        meses físicos
                      </td>
                      <td>
                        {s.output.coverage.covered}/{s.output.coverage.total}
                      </td>
                      <td>
                        Regime normal:{" "}
                        {s.output.assumptions.normalRegime ? "sim" : "não"} ·
                        tarifa:{" "}
                        {s.output.assumptions.tariffApplicability
                          ? "sim"
                          : "não"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <footer className="plan__limits">
            {output.warning} Não coberto: {output.exclusions.join(" · ")}.
          </footer>
        </>
      )}
    </section>
  );
}
