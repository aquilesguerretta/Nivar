import { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  closeApi,
  CLOSE_FIELDS,
  SelectionEpoch,
  type Calculation,
  type Candidate,
  type CloseDetail,
  type CloseRole,
  type Inspection,
  type Mapping,
} from "../../lib/ariadne/closeApi";
import "./ariadne-review-desk.css";
import {
  DeskSelection,
  reviewedSelection,
  sameInterpretation,
} from "../../lib/ariadne/deskSelection";

const reviewMode = (p: Inspection, role: CloseRole): Mapping['reviewMode'] =>
  p.demandProfile ? 'demand_profile' : p.tariffReferences ? 'tariff_reference' :
  role === 'context' ? 'context' : p.observations ? 'observations' : 'table';
const structured = (p: Inspection) => !!(p.demandProfile || p.tariffReferences || p.observations);
const roles: Record<CloseRole, string> = {
  invoice: "Fatura / valores faturados",
  quantity: "Quantidade independente",
  price: "Preço revisado",
  context: "Referência contextual",
};
const money = (value?: string | null) => (value == null ? "—" : `${value} BRL`);
const errorText = (e: unknown) =>
  e instanceof Error ? e.message : "Falha inesperada";
const rowLabel = (r: Candidate) => {
  const raw = r.raw || r.values || {};
  return (
    raw.rate_kind === 'OFFICIAL_TARIFF_REFERENCE' ? `${raw.effective_from}–${raw.effective_to} · ${raw.rate} BRL/kW` :
    r.demand_kw ? `${r.label} · ${r.demand_kw} kW / contrato ${r.contracted_kw} kW` : r.label ||
    r.item_key ||
    (raw.DscModalidadeTarifaria
      ? `${raw.DscSubGrupo} · ${raw.DscModalidadeTarifaria} · ${raw.NomPostoTarifario}`
      : Object.values(raw)[0]) ||
    `Linha ${r.index}`
  );
};
const rowValues = (r: Candidate) => {
  const raw = r.raw || r.values || {};
  return raw.rate_kind === 'OFFICIAL_TARIFF_REFERENCE' ? ['rate','unit','basis','modality'].map(k=>[k,raw[k]] as const) : raw.VlrTE !== undefined
    ? ["VlrTUSD", "VlrTE", "DscUnidadeTerciaria"].map(
        (k) => [k, raw[k]] as const,
      )
    : Object.entries(raw).slice(0, 3);
};
type Pending = {
  file: File;
  preview: Inspection;
  provenance?: Record<string, unknown>;
};

export function AriadneReviewDesk() {
  const [query, setQuery] = useSearchParams();
  const workspace = query.get("workspace") || "",
    review = query.get("review") || "";
  const epoch = useRef(new SelectionEpoch()),
    busyRef = useRef(false);
  const selection = useRef(new DeskSelection());
  const [detail, setDetail] = useState<CloseDetail | null>(null),
    [calculation, setCalculation] = useState<Calculation | null>(null);
  const [pending, setPending] = useState<Pending | null>(null),
    [activeSource, setActiveSource] = useState(query.get("source") || "");
  const [itemId, setItemId] = useState(query.get("item") || ""),
    [selectedRow, setSelectedRow] = useState(1),
    [selected, setSelected] = useState<number[]>([]);
  const [proofRef, setProofRef] = useState<{
    sourceId: string;
    locator: string;
  } | null>(null);
  const [selectedLocator, setSelectedLocator] = useState("");
  const [role, setRole] = useState<CloseRole>("context"),
    [scope, setScope] = useState(""),
    [period, setPeriod] = useState("");
  const [mapping, setMapping] = useState<Mapping>({
    sheet: "",
    mapping: {},
    numericMode: "strict",
    manualRows: [],
  });
  const [candidates, setCandidates] = useState<Candidate[]>([]),
    [busy, setBusy] = useState(""),
    [error, setError] = useState(""),
    [notice, setNotice] = useState("");
  const [original, setOriginal] = useState(""),
    [showDocument, setShowDocument] = useState(false);
  const [pageError, setPageError] = useState(false);
  const [treatmentStatus, setTreatmentStatus] = useState("follow_up"),
    [reason, setReason] = useState(""),
    [note, setNote] = useState("");
  const [saved, setSaved] = useState(""),
    [history, setHistory] = useState(false),
    [historyRows, setHistoryRows] = useState<
      { workspace: string; review: string; label: string }[]
    >([]);
  const [loadToken, setLoadToken] = useState(0);
  const visibleSources = calculation?.inputs.sources || detail?.sources || [];
  const source = pending
    ? undefined
    : visibleSources.find((s) => s.id === activeSource);
  selection.current.select(
    JSON.stringify([
      workspace,
      review,
      query.get("result"),
      calculation?.id,
      activeSource,
      pending?.file.name,
      mapping,
      itemId,
      selectedRow,
      proofRef,
      role,
      scope,
      period,
    ]),
  );
  const preview = pending?.preview || source?.preview;
  const item = calculation?.output.items.find((i) => i.id === itemId);
  const preservedPackage = saved || detail?.packages.find(p => p.resultId === calculation?.id)?.id;
  const rawRows =
    preview?.demandProfile || preview?.tariffReferences || preview?.observations ||
    (source?.role === "context" || role === "context"
      ? preview?.tables.flatMap((t) => t.rows)
      : preview?.tables.find((t) => t.name === mapping.sheet)?.rows) ||
    [];
  const rows = candidates.length ? candidates : rawRows;
  const row =
    (proofRef
      ? calculation?.inputs.records.find(
          (r) =>
            r.source_id === proofRef.sourceId && r.locator === proofRef.locator,
        )
      : item?.candidate) ||
    rows.find((r) =>
      selectedLocator ? r.locator === selectedLocator : r.index === selectedRow,
    );
  const pdf = preview?.kind === "pdf";
  const pageNumber =
    row?.page || Number(row?.locator?.match(/^page:(\d+)/)?.[1] || 1);

  useEffect(() => setPageError(false), [activeSource, pageNumber]);

  useEffect(() => {
    const ticket = epoch.current.next();
    setError("");
    setSaved("");
    setCalculation(null);
    setDetail(null);
    setCandidates([]);
    setProofRef(null);
    setReason("");
    setNote("");
    if (!workspace || !review) return;
    const controller = new AbortController();
    void closeApi
      .detail(workspace, review, controller.signal)
      .then(async (data) => {
        if (!epoch.current.current(ticket)) return;
        setDetail(data);
        setScope(data.review.scope);
        setPeriod(data.review.period);
        setActiveSource((current) =>
          data.sources.some((s) => s.id === current)
            ? current
            : data.sources[0]?.id || "",
        );
        const resultId =
          query.get("result") ||
          (!query.get("source") ? data.calculations[0]?.id : undefined);
        if (resultId) {
          const result = await closeApi.result(
            workspace,
            review,
            resultId,
            controller.signal,
          );
          if (!epoch.current.current(ticket)) return;
          const selectedItem =
            result.output.items.find((i) => i.id === query.get("item")) ||
            result.output.items[0];
          setCalculation(result);
          setItemId(
            query.get("source") &&
              !query.get("item") &&
              selectedItem?.internal.sourceRefs[0]?.sourceId !==
                query.get("source")
              ? ""
              : selectedItem?.id || "",
          );
          setActiveSource(
            query.get("source") ||
              selectedItem?.internal.sourceRefs[0]?.sourceId ||
              data.sources[0]?.id ||
              "",
          );
        }
      })
      .catch((e) => {
        if (!controller.signal.aborted && epoch.current.current(ticket))
          setError(errorText(e));
      });
    return () => {
      controller.abort();
      epoch.current.next();
    };
  }, [workspace, review, query.get("result"), loadToken]); // exact saved result retained in URL

  useEffect(() => {
    setCandidates([]);
    setSelectedRow(1);
    setSelectedLocator("");
    setSelected([]);
    if (source) {
      setRole(source.role);
      const table = source.preview.tables[0];
      const confirmed = source.confirmation;
      setMapping(
        confirmed
          ? {
              sheet: confirmed.sheet,
              mapping: confirmed.mapping,
              numericMode: confirmed.numericMode,
              manualRows: confirmed.manualRows,
              reviewMode: confirmed.reviewMode,
              defaults: confirmed.defaults,
            }
          : {
              sheet: table?.name || "",
              mapping: table?.proposedMapping || {},
              numericMode: "strict",
              manualRows: [],
              reviewMode:
                reviewMode(source.preview, source.role),
              defaults: {
                scope: detail!.review.scope,
                period: detail!.review.period,
              },
            },
      );
    }
  }, [activeSource, source?.confirmationVersionId]);

  useEffect(() => {
    if (
      !source ||
      pending ||
      calculation ||
      (!structured(source.preview) && source.role !== "context")
    )
      return;
    const controller = new AbortController();
    const next: Mapping = {
      sheet: source.preview.tables[0]?.name || "",
      mapping: {},
      numericMode: "strict",
      manualRows: [],
      reviewMode: reviewMode(source.preview, source.role),
    };
    void closeApi
      .candidates(workspace, review, source.id, next, controller.signal)
      .then((response) => {
        if (controller.signal.aborted) return;
        setMapping(next);
        setCandidates(response.rows);
        setSelected(
          reviewedSelection(response.rows, next, source.confirmation),
        );
      })
      .catch((e) => {
        if (!controller.signal.aborted) setError(errorText(e));
      });
    return () => controller.abort();
  }, [
    workspace,
    review,
    activeSource,
    source?.confirmationVersionId,
    pending,
    calculation?.id,
  ]);

  useEffect(() => {
    setOriginal("");
    if (!pdf) return;
    if (pending) {
      const url = URL.createObjectURL(pending.file);
      setOriginal(url);
      return () => URL.revokeObjectURL(url);
    }
    if (!source) return;
    const controller = new AbortController();
    let url = "";
    void fetch(closeApi.originalUrl(workspace, review, source.id), {
      credentials: "include",
      signal: controller.signal,
    })
      .then(async (response) => {
        if (!response.ok)
          throw new Error("Original indisponível; verifique sua sessão");
        const blob = await response.blob();
        if (controller.signal.aborted) return;
        url = URL.createObjectURL(blob);
        setOriginal(url);
      })
      .catch((e) => {
        if (!controller.signal.aborted) setError(errorText(e));
      });
    return () => {
      controller.abort();
      if (url) URL.revokeObjectURL(url);
    };
  }, [pdf, pending, workspace, review, activeSource]);

  async function act(
    label: string,
    action: (current: () => boolean) => Promise<void>,
  ) {
    if (busyRef.current) return;
    busyRef.current = true;
    setBusy(label);
    setError("");
    setNotice("");
    const current = selection.current.capture();
    try {
      await action(current);
    } catch (e) {
      if (current()) setError(errorText(e));
    } finally {
      busyRef.current = false;
      setBusy("");
    }
  }
  async function inspect(files: File[]) {
    await act("Inspecionando com segurança…", async (current) => {
      const documents = files.filter((f) => !f.name.endsWith(".json"));
      if (documents.length !== 1)
        throw new Error(
          "Selecione um documento por vez, com seu arquivo de proveniência JSON opcional.",
        );
      const file = documents[0],
        sidecar = files.find((f) => f.name === file.name + ".provenance.json");
      let provenance: Record<string, unknown> | undefined;
      if (sidecar) {
        if (sidecar.size > 16384) throw new Error("Proveniência excede 16 KiB");
        provenance = JSON.parse(await sidecar.text()) as Record<
          string,
          unknown
        >;
      }
      let w = workspace;
      if (!w) {
        w = (
          await closeApi.createWorkspace(
            "Revisão privada " + new Date().toISOString(),
            false,
          )
        ).id;
      }
      if (!current()) return;
      const result = await closeApi.inspect(w, file);
      if (!current()) return;
      if (!workspace) setQuery({ workspace: w });
      setPending({ file, preview: result, provenance });
      setCalculation(null);
      setItemId("");
      setCandidates([]);
      setSelectedRow(1);
      setRole(result.proposal?.role || "context");
      setScope(detail?.review.scope || result.proposal?.scope || "");
      setPeriod(detail?.review.period || result.proposal?.period || "");
      const table = result.tables[0];
      setMapping({
        sheet: table?.name || "",
        mapping: table?.proposedMapping || {},
        numericMode: "strict",
        manualRows: [],
        reviewMode:
          reviewMode(result, result.proposal?.role || "context"),
      });
      setSelected(
        (result.demandProfile || result.tariffReferences || result.observations || table?.rows || [])
          .filter((r) => !r.issues?.length)
          .map((r) => r.index),
      );
      setShowDocument(false);
    });
  }
  async function importPending() {
    if (!pending) return;
    await act("Preservando fonte e contexto…", async (current) => {
      if (!scope.trim() || !/^\d{4}-(0[1-9]|1[0-2])$/.test(period))
        throw new Error(
          "Confirme a unidade e a competência antes de importar.",
        );
      const r =
        review || (await closeApi.start(workspace, scope, period, "0.2.0")).id;
      if (!current()) return;
      const imported = await closeApi.upload(
        workspace,
        r,
        pending.file,
        role,
        "",
        true,
        pending.provenance,
      );
      if (!current()) return;
      setPending(null);
      setActiveSource(imported.id);
      setQuery({ workspace, review: r, source: imported.id });
      setLoadToken((t) => t + 1);
      setNotice("Fonte preservada. Revise os candidatos antes de confirmar.");
    });
  }
  async function validate() {
    if (!source) return;
    await act("Validando região…", async (current) => {
      const next = {
        ...mapping,
        reviewMode:
          reviewMode(source.preview, source.role),
      } as Mapping;
      const response = await closeApi.candidates(
        workspace,
        review,
        source.id,
        next,
      );
      if (!current()) return;
      setMapping(next);
      setCandidates(response.rows);
      setSelected(reviewedSelection(response.rows, next, source.confirmation));
    });
  }
  async function confirm() {
    if (!source) return;
    await act("Confirmando interpretação…", async (current) => {
      await closeApi.confirm(
        workspace,
        review,
        source.id,
        mapping,
        selected,
        source.confirmationVersionId,
      );
      if (!current()) return;
      setLoadToken((t) => t + 1);
      setNotice(
        source.preview.tariffReferences
          ? "Referência revisada. A aplicabilidade no planejamento ainda exige premissa explícita; nenhum preço bruto foi validado."
          : source.role === "context"
          ? "Referência reconhecida; continua sem elegibilidade financeira."
          : "Interpretação confirmada. A confirmação não prova a verdade da fonte.",
      );
    });
  }
  function selectItem(id: string) {
    const next = calculation?.output.items.find((i) => i.id === id);
    setProofRef(null);
    setItemId(id);
    setSelectedRow(next?.candidate.index || 1);
    setActiveSource(next?.internal.sourceRefs[0]?.sourceId || "");
    setReason("");
    setNote("");
    if (calculation && next)
      setQuery({
        workspace,
        review,
        result: calculation.id,
        item: id,
        source: next.internal.sourceRefs[0]?.sourceId || "",
      });
  }
  const uploadControl = (
    <label className="desk__import">
      Importar arquivos
      <input
        aria-label="Importar arquivos"
        type="file"
        accept=".csv,.xlsx,.pdf,.json"
        multiple
        disabled={!!busy}
        onChange={(e) => {
          void inspect(Array.from(e.target.files || []));
          e.target.value = "";
        }}
      />
    </label>
  );

  return (
    <section
      className="desk"
      aria-label="Mesa de revisão Ariadne"
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        e.preventDefault();
        void inspect(Array.from(e.dataTransfer.files));
      }}
    >
      <header className="desk__bar">
        <div>
          <span>ARIADNE / FECHAMENTO ASSISTIDO</span>
          <h1>
            {period
              ? `${period.slice(5)}/${period.slice(0, 4)} · ${preview?.proposal?.distributor || detail?.sources.find((s) => s.preview.proposal?.distributor)?.preview.proposal?.distributor || "Revisão de energia"}`
              : "Mesa de revisão"}
          </h1>
          {scope && (
            <small>Unidade {scope} · desenvolvimento experimental</small>
          )}
        </div>
        <nav>
          {(preview || detail) && uploadControl}
          <button
            disabled={!!busy}
            onClick={() => {
              epoch.current.next();
              setPending(null);
              setDetail(null);
              setCalculation(null);
              setActiveSource("");
              setScope("");
              setPeriod("");
              setQuery({});
            }}
          >
            Nova revisão
          </button>
          <button
            disabled={!!busy}
            onClick={() => {
              setHistory(!history);
              void act("Abrindo histórico…", async () => {
                const workspaces = await closeApi.workspaces();
                const entries = [];
                for (const w of workspaces.data) {
                  for (const r of (await closeApi.reviews(w.id)).data)
                    entries.push({
                      workspace: w.id,
                      review: r.id,
                      label: `${r.period} · ${r.scope}`,
                    });
                }
                setHistoryRows(entries);
              });
            }}
          >
            Histórico
          </button>
        </nav>
      </header>
      {history && (
        <aside className="desk__history">
          <strong>Revisões preservadas</strong>
          {historyRows.map((r) => (
            <button
              disabled={!!busy}
              key={r.review}
              onClick={() => {
                setPending(null);
                setHistory(false);
                setQuery({ workspace: r.workspace, review: r.review });
              }}
            >
              {r.label}
            </button>
          ))}
          <Link to={`/operador/ariadne/fechamento/avancado?${query}`}>
            Configuração e linhagem avançadas
          </Link>
        </aside>
      )}
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
      {busy && (
        <p role="status" className="desk__notice">
          {busy}
        </p>
      )}
      <div className="desk__panes">
        <aside className="desk__sources">
          <h2>
            Fontes <small>{visibleSources.length}</small>
          </h2>
          {pending && (
            <div className="desk__source desk__source--selected">
              <strong>{pending.file.name}</strong>
              <span>{pending.preview.proposal?.description}</span>
              <small>Inspecionada · aguardando contexto</small>
            </div>
          )}
          {visibleSources.map((s) => (
            <button
              className={`desk__source ${!pending && s.id === activeSource ? "desk__source--selected" : ""}`}
              key={s.id}
              disabled={!!busy}
              onClick={() => {
                setPending(null);
                setActiveSource(s.id);
                setItemId("");
                setProofRef(null);
                setQuery({
                  workspace,
                  review,
                  ...(calculation ? { result: calculation.id } : {}),
                  source: s.id,
                });
              }}
            >
              <strong>{s.filename}</strong>
              <span>{s.preview.proposal?.description || roles[s.role]}</span>
              <small>
                {s.confirmationVersionId
                  ? "Interpretação revisada"
                  : "A revisar"}{" "}
                · {s.kind.toUpperCase()}
              </small>
              {s.preview.proposal?.period && (
                <small>
                  {s.preview.proposal.period} · unidade{" "}
                  {s.preview.proposal.scope}
                </small>
              )}
            </button>
          ))}
          {!pending && !detail?.sources.length && (
            <p>
              Os documentos entram primeiro. A unidade e o período vêm da
              inspeção.
            </p>
          )}
          {preview?.warnings?.length ? (
            <div className="desk__warnings">
              <h3>Limites desta fonte</h3>
              {preview.warnings.map((w, i) => (
                <p key={i}>{w}</p>
              ))}
            </div>
          ) : null}
          {preview?.sheets?.map((s) => (
            <details key={s.name}>
              <summary>
                {s.name} {s.hidden ? "· oculta" : ""}
              </summary>
              {s.warnings.map((w) => (
                <p key={w}>{w}</p>
              ))}
              {s.cells
                .filter((c) => c.formula !== undefined || c.issues.length)
                .slice(0, 30)
                .map((c) => (
                  <p key={c.locator}>
                    <code>{c.locator}</code> ·{" "}
                    {c.formula
                      ? `Fórmula ${c.formula}; cache ${c.cachedValue ?? "ausente"}`
                      : c.raw}{" "}
                    · {c.issues.join("; ")}
                  </p>
                ))}
            </details>
          ))}
        </aside>
        <main className="desk__review">
          <div className="desk__pane-title">
            <h2>Revisão</h2>
            <span>
              {calculation
                ? "Resultado preservado"
                : pending
                  ? "Proposta · confirme antes de usar"
                  : "Interpretações e cobertura"}
            </span>
          </div>
          {!preview && !calculation && (
            <div className="desk__drop">
              <h2>Solte a fatura ou a planilha aqui</h2>
              <p>
                Inspecione o documento, confirme a interpretação e revise cada
                conclusão com sua fonte.
              </p>
              {uploadControl}
              <small>
                PDF nativo, CSV UTF-8 e regiões XLSX · 8 MiB por arquivo.
                <br />
                Fórmulas não executadas; sem OCR. Arquivo de proveniência
                opcional junto ao documento.
              </small>
            </div>
          )}
          {pending && (
            <form
              className="desk__context"
              onSubmit={(e) => {
                e.preventDefault();
                void importPending();
              }}
            >
              <p>
                {preview?.proposal?.description}. Confirme ou corrija a
                proposta.
              </p>
              <div>
                <label>
                  Papel proposto
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as CloseRole)}
                  >
                    {Object.entries(roles).map(([v, l]) => (
                      <option value={v} key={v}>
                        {l}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  Competência
                  <input
                    type="month"
                    value={period}
                    disabled={!!review}
                    onChange={(e) => setPeriod(e.target.value)}
                  />
                </label>
                <label>
                  Unidade / escopo
                  <input
                    value={scope}
                    disabled={!!review}
                    onChange={(e) => setScope(e.target.value)}
                  />
                </label>
                <button className="desk__primary" disabled={!!busy}>
                  Confirmar contexto e preservar fonte
                </button>
              </div>
              {preview?.proposal?.evidence.length ? (
                <small>
                  Proposta sustentada por{" "}
                  {preview.proposal.evidence.join(" · ")}
                </small>
              ) : (
                <small>
                  Contexto não inferido: precisa de confirmação humana.
                </small>
              )}
            </form>
          )}
          {!pending && source && !calculation && (
            <div className="desk__batch">
              <strong>
                {source.preview.demandProfile
                  ? "Demanda mensal observada · confira cada página; não é medição independente"
                  : source.preview.tariffReferences
                    ? "Referência externa antes de tributos · revise dimensões e vigência"
                    : source.role === "context"
                  ? "Referência contextual; não entra no cálculo como preço"
                  : source.preview.observations
                    ? "Observações nativas da fatura; somente checks internos"
                    : "Selecione uma região e revise o mapeamento"}
              </strong>
              {source.role !== "context" && !structured(source.preview) && (
                <>
                  <label>
                    Região
                    <select
                      disabled={!!busy}
                      value={mapping.sheet}
                      onChange={(e) => {
                        const t = source.preview.tables.find(
                          (t) => t.name === e.target.value,
                        );
                        setMapping({
                          ...mapping,
                          sheet: e.target.value,
                          mapping: t?.proposedMapping || {},
                        });
                        setCandidates([]);
                      }}
                    >
                      {source.preview.tables.map((t) => (
                        <option key={t.name}>{t.name}</option>
                      ))}
                    </select>
                  </label>
                  <details open>
                    <summary>Mapeamento proposto</summary>
                    <div className="desk__mapping">
                      {CLOSE_FIELDS.map((f) => (
                        <label key={f}>
                          {f}
                          <select
                            disabled={!!busy}
                            value={mapping.mapping[f] || ""}
                            onChange={(e) => {
                              setMapping({
                                ...mapping,
                                mapping: {
                                  ...mapping.mapping,
                                  [f]: e.target.value,
                                },
                              });
                              setCandidates([]);
                            }}
                          >
                            <option value="">Sem coluna</option>
                            {source.preview.tables
                              .find((t) => t.name === mapping.sheet)
                              ?.columns.map((c) => (
                                <option key={c}>{c}</option>
                              ))}
                          </select>
                        </label>
                      ))}
                    </div>
                    <label>
                      Separador decimal
                      <select
                        disabled={!!busy}
                        value={mapping.numericMode}
                        onChange={(e) => {
                          setMapping({
                            ...mapping,
                            numericMode: e.target
                              .value as Mapping["numericMode"],
                          });
                          setCandidates([]);
                        }}
                      >
                        <option value="strict">
                          Exigir interpretação sem ambiguidade
                        </option>
                        <option value="comma">
                          Vírgula decimal · milhares explícitos
                        </option>
                        <option value="dot">
                          Ponto decimal · milhares explícitos
                        </option>
                      </select>
                    </label>
                  </details>
                </>
              )}
              <div className="desk__actions">
                {source.role !== "context" && !structured(source.preview) && (
                  <button disabled={!!busy} onClick={() => void validate()}>
                    Revisar candidatos
                  </button>
                )}
                <button
                  disabled={
                    !!busy ||
                    !candidates.length ||
                    (!!source.confirmation &&
                      sameInterpretation(mapping, source.confirmation) &&
                      JSON.stringify([...selected].sort((a, b) => a - b)) ===
                        JSON.stringify(
                          source.confirmation.rows
                            .filter((r) => r.eligible || r.planningConfirmed)
                            .map((r) => r.index)
                            .sort((a, b) => a - b),
                        ))
                  }
                  className="desk__primary"
                  onClick={() => void confirm()}
                >
                  {source.role === "context"
                    ? "Reconhecer referência contextual"
                    : "Confirmar linhas selecionadas"}
                </button>
                {source.confirmationVersionId && (
                  <span>Confirmação preservada</span>
                )}
              </div>
            </div>
          )}
          {calculation ? (
            <>
              <p className="desk__coverage">
                {calculation.output.coverage.internalChecks} checks internos ·{" "}
                {calculation.output.coverage.independentlyCovered} itens com
                evidência independente ·{" "}
                {calculation.output.coverage.notVerified} não verificáveis
                independentemente
              </p>
              <div className="desk__table-scroll">
                <table>
                  <thead>
                    <tr>
                      <th>Componente / check</th>
                      <th>Faturado</th>
                      <th>Interno</th>
                      <th>Independente</th>
                    </tr>
                  </thead>
                  <tbody>
                    {calculation.output.items.map((i) => (
                      <tr key={i.id} aria-selected={i.id === itemId}>
                        <td>
                          <button onClick={() => selectItem(i.id)}>
                            {i.itemKey || i.group}
                          </button>
                        </td>
                        <td>{money(i.billed)}</td>
                        <td>
                          {i.internal.classification === "reconciled"
                            ? "Consistente"
                            : i.internal.classification === "divergence"
                              ? "Divergência"
                              : "Sem regra"}
                        </td>
                        <td>
                          {i.independent.classification === "not_verifiable"
                            ? "Não verificável"
                            : i.independent.label}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div
                className="desk__chart"
                aria-label="Valores faturados e esperados internamente"
              >
                <ResponsiveContainer width="100%" height={160}>
                  <BarChart
                    data={calculation.output.items
                      .filter((i) => i.internal.expected !== null)
                      .map((i) => ({
                        label: i.itemKey,
                        billed: Number(i.billed),
                        expected: Number(i.internal.expected),
                        id: i.id,
                      }))}
                    onClick={(state) => {
                      if (state.activeTooltipIndex != null) {
                        const covered = calculation.output.items.filter(
                          (i) => i.internal.expected !== null,
                        );
                        const i = covered[Number(state.activeTooltipIndex)];
                        if (i) selectItem(i.id);
                      }
                    }}
                  >
                    <XAxis dataKey="label" hide />
                    <YAxis width={45} />
                    <Tooltip />
                    <Bar dataKey="billed" name="Faturado" fill="#89704e" />
                    <Bar
                      dataKey="expected"
                      name="Esperado interno"
                      fill="#687866"
                    />
                  </BarChart>
                </ResponsiveContainer>
                <small>
                  Faturado × esperado interno · BRL · gráfico ilustrativo dos
                  valores persistidos, sem auditoria independente
                </small>
              </div>
            </>
          ) : rows.length ? (
            <div className="desk__table-scroll">
              <table>
                <thead>
                  <tr>
                    {!pending && candidates.length > 0 && <th>Confirmar</th>}
                    <th>Observação / linha</th>
                    <th>Valor na fonte</th>
                    <th>Localizador / validação</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r, i) => (
                    <tr
                      key={`${r.locator}-${i}`}
                      aria-selected={
                        selectedLocator
                          ? r.locator === selectedLocator
                          : r.index === selectedRow
                      }
                    >
                      {!pending && candidates.length > 0 && (
                        <td>
                          <input
                            aria-label={`Confirmar linha ${r.index}`}
                            type="checkbox"
                            checked={selected.includes(r.index)}
                            disabled={
                              r.errors?.length > 0 || (source?.role === "context" && !source.preview.tariffReferences)
                            }
                            onChange={(e) =>
                              setSelected(
                                e.target.checked
                                  ? [...selected, r.index]
                                  : selected.filter((v) => v !== r.index),
                              )
                            }
                          />
                        </td>
                      )}
                      <td>
                        <button
                          onClick={() => {
                            setSelectedRow(r.index);
                            setSelectedLocator(r.locator);
                          }}
                        >
                          {rowLabel(r)}
                        </button>
                      </td>
                      <td>
                        {r.amount
                          ? money(r.amount)
                          : rowValues(r).map(([k, v]) => (
                              <span className="desk__raw" key={k}>
                                {k}: {v ?? "em branco"}
                              </span>
                            ))}
                      </td>
                      <td>
                        <small>{r.locator}</small>
                        {(r.errors || r.issues || []).map((e, i) => (
                          <p className="desk__invalid" key={i}>
                            {e}
                          </p>
                        ))}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            preview && (
              <p className="desk__empty">
                Documento preservável, sem campos automáticos para este layout.
                Abra o original. Use a revisão avançada para registros manuais
                com página; este limite não prova ausência de cobrança.
              </p>
            )
          )}
          {detail && (
            <footer className="desk__footer">
              <button
                disabled={
                  !!busy ||
                  !detail.sources.some(
                    (s) => s.role === "invoice" && s.confirmationVersionId,
                  )
                }
                className="desk__primary"
                onClick={() =>
                  void act(
                    "Executando checks e preservando resultado…",
                    async (current) => {
                      const result = await closeApi.calculate(
                        workspace,
                        review,
                        detail.sources,
                      );
                      if (!current()) return;
                      setQuery({ workspace, review, result: result.id });
                      setLoadToken((t) => t + 1);
                    },
                  )
                }
              >
                Verificar e preservar resultado
              </button>
              {calculation && (
                <>
                  {import.meta.env.DEV && import.meta.env.VITE_ARIADNE_PLAN_DEV === '1' &&
                    calculation.inputs.records.some(row => row.recordKind === 'demand_fact' && row.eligible && !row.errors.length) &&
                    <Link className="desk__primary" to={`/operador/ariadne/planejamento?workspace=${workspace}&review=${review}&baseline=${calculation.id}`}>Planejar a partir deste estado →</Link>}
                  <button
                    disabled={!!busy}
                    onClick={() =>
                      void act("Salvando pacote exato…", async (current) => {
                        const pack = await closeApi.save(
                          workspace,
                          review,
                          calculation.id,
                        );
                        if (!current()) return;
                        setSaved(pack.id);
                        setNotice(
                          "Pacote salvo com este resultado e tratamentos. Histórico não usa dados mais recentes.",
                        );
                      })
                    }
                  >
                    Salvar pacote
                  </button>
                  <button
                    disabled={!!busy}
                    onClick={() =>
                      void act("Reconstituindo histórico…", async (current) => {
                        const r = await closeApi.replay(
                          workspace,
                          review,
                          calculation.id,
                        );
                        if (!current()) return;
                        setNotice(
                          r.matches
                            ? "Histórico reconstruído: resultado idêntico."
                            : "Falha: histórico divergiu.",
                        );
                      })
                    }
                  >
                    Reconstituir
                  </button>
                </>
              )}
                {preservedPackage && (
                  <a href={closeApi.exportUrl(workspace, review, preservedPackage)}>
                  Baixar pacote ZIP
                </a>
              )}
            </footer>
          )}
        </main>
        <aside className="desk__proof">
          <div className="desk__pane-title">
            <h2>Fonte → cálculo → conclusão</h2>
          </div>
          {preview ? (
            <>
              <div className="desk__source-actions">
                {original && (
                  <>
                    <a
                      href={original + `#page=${pageNumber}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Abrir documento · página {pageNumber}
                    </a>
                    {source && (
                      <button onClick={() => setShowDocument(!showDocument)}>
                        {showDocument ? "Voltar à prova" : "Ver página aqui"}
                      </button>
                    )}
                  </>
                )}
                {source && (
                  <a href={closeApi.originalUrl(workspace, review, source.id)}>
                    Baixar original
                  </a>
                )}
                {source && pdf && <a href={closeApi.pageUrl(workspace, review, source.id, pageNumber)} target="_blank" rel="noreferrer">Ampliar página</a>}
              </div>
              {source?.role === "context" && rawRows.length > 1 && (
                <label>Linha de referência
                  <select value={selectedRow} onChange={e => {setSelectedRow(Number(e.target.value)); setSelectedLocator(""); setProofRef(null);}}>
                    {rawRows.map((r, i) => <option key={r.locator + i} value={r.index}>{r.locator} · {rowLabel(r)}</option>)}
                  </select>
                </label>
              )}
              {showDocument && source && pdf ? (
                pageError ? (
                  <p role="alert">
                    Página indisponível. Baixe o original ou volte à prova
                    textual; verifique sua sessão antes de tentar novamente.
                  </p>
                ) : (
                  <img
                    alt={`Página ${pageNumber} do documento original`}
                    className="desk__pdf"
                    src={closeApi.pageUrl(
                      workspace,
                      review,
                      source.id,
                      pageNumber,
                    )}
                    onError={() => setPageError(true)}
                  />
                )
              ) : (
                <>
                  <h3>Fonte {row?.locator && <small>{row.locator}</small>}</h3>
                  <pre className="desk__snippet">
                    {row?.snippet ||
                      Object.entries(row?.raw || row?.values || {})
                        .map(
                          ([k, v]) =>
                            `${k}: ${v ?? "[em branco]"}${row?.cells?.[k] ? ` · ${row.cells[k]}` : ""}`,
                        )
                        .join("\n") ||
                      preview.pages.find((p) => p.number === pageNumber)
                        ?.text ||
                      "Selecione uma linha para inspecionar os valores e células."}
                  </pre>
                  {row && (
                    <>
                      <h3>Interpretação</h3>
                      <dl>
                        <div>
                          <dt>Valor</dt>
                          <dd>{money(row.amount)}</dd>
                        </div>
                        {row.quantity && (
                          <div>
                            <dt>
                              {source?.role === "quantity"
                                ? "Quantidade na fonte independente"
                                : "Fator / quantidade na fonte"}
                            </dt>
                            <dd>
                              {row.quantity}
                              {source?.role === "invoice"
                                ? " · não é medição independente"
                                : ""}
                            </dd>
                          </div>
                        )}
                        {row.price && (
                          <div>
                            <dt>
                              {source?.role === "price"
                                ? "Preço na fonte revisada"
                                : "Preço / fator na fatura"}
                            </dt>
                            <dd>{row.price}</dd>
                          </div>
                        )}
                        <div>
                          <dt>Autoridade</dt>
                          <dd>
                            {source?.confirmationVersionId
                              ? "Interpretação humana preservada"
                              : "Candidato ainda não confirmado"}
                          </dd>
                        </div>
                      </dl>
                    </>
                  )}
                  {item && (
                    <>
                      <h3>Consistência interna</h3>
                      <strong>{item.internal.label}</strong>
                      <p className="desk__formula">
                        {item.internal.calculation ||
                          "Sem cálculo esperado neste escopo"}
                      </p>
                      <dl>
                        <div>
                          <dt>Esperado interno</dt>
                          <dd>{money(item.internal.expected)}</dd>
                        </div>
                        <div>
                          <dt>Faturado − esperado</dt>
                          <dd>{money(item.internal.difference)}</dd>
                        </div>
                      </dl>
                      {item.internal.reasons.map((r) => (
                        <p key={r}>{r}</p>
                      ))}
                      <h3>Verificação independente</h3>
                      <strong className="desk__unverified">
                        {item.independent.label}
                      </strong>
                      {item.independent.reasons.map((r) => (
                        <p key={r}>{r}</p>
                      ))}
                      <h3>Fontes do cálculo</h3>
                      {item.internal.sourceRefs.map((ref, i) => (
                        <button
                          className="desk__reference"
                          key={i}
                          onClick={() => {
                            setProofRef({
                              sourceId: ref.sourceId,
                              locator: ref.locator,
                            });
                            setActiveSource(ref.sourceId);
                            setShowDocument(true);
                          }}
                        >
                          {
                            visibleSources.find((s) => s.id === ref.sourceId)
                              ?.filename
                          }{" "}
                          · {ref.locator}
                        </button>
                      ))}
                      <details className="desk__treatment" open>
                        <summary>Tratamento da conclusão</summary>
                        {calculation?.treatments
                          .filter((t) => t.itemId === item.id)
                          .map((t) => (
                            <p key={t.id}>
                              {t.status}: {t.reason} · {t.note}
                            </p>
                          ))}
                        <label>
                          Status
                          <select
                            value={treatmentStatus}
                            onChange={(e) => setTreatmentStatus(e.target.value)}
                          >
                            <option value="follow_up">Acompanhar</option>
                            <option value="explained">Explicada</option>
                            <option value="accepted">
                              Aceita pelo operador
                            </option>
                            <option value="open">Em aberto</option>
                          </select>
                        </label>
                        <label>
                          Motivo
                          <input
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            maxLength={500}
                          />
                        </label>
                        <label>
                          Nota / ação
                          <textarea
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            maxLength={4000}
                          />
                        </label>
                        <button
                          disabled={!!busy || !reason.trim() || !note.trim()}
                          onClick={() =>
                            void act(
                              "Registrando tratamento…",
                              async (current) => {
                                await closeApi.treat(
                                  workspace,
                                  review,
                                  calculation!.id,
                                  item.id,
                                  treatmentStatus,
                                  reason,
                                  note,
                                );
                                if (!current()) return;
                                setLoadToken((t) => t + 1);
                              },
                            )
                          }
                        >
                          Registrar tratamento
                        </button>
                        <small>
                          Tratamento não transforma diferença em conciliação.
                        </small>
                      </details>
                    </>
                  )}
                </>
              )}
              <details className="desk__provenance">
                <summary>Proveniência e limites</summary>
                <pre>
                  {JSON.stringify(
                    pending?.provenance ||
                      preview.provenance || {
                        status: "Sem metadados atribuídos; original preservado",
                      },
                    null,
                    2,
                  )}
                </pre>
                <p>
                  Metadados atribuídos precisam de revisão. Não são certificação
                  de autenticidade. Nenhum URL da fonte é buscado pela
                  aplicação.
                </p>
              </details>
            </>
          ) : (
            <p>
              Selecione uma fonte ou importe um documento. Toda conclusão deve
              levar a uma página ou célula.
            </p>
          )}
        </aside>
      </div>
      {calculation && (
        <details className="desk__lineage">
          <summary>Histórico avançado · identidades e regras</summary>
          <p>
            Cálculo {calculation.id} · {calculation.implementation} · versão{" "}
            {calculation.output.ruleVersion}
          </p>
          <p>
            Estado {calculation.stateVersionId} · premissa{" "}
            {calculation.assumptionVersionId}
          </p>
          <label>
            Resultado preservado
            <select
              value={calculation.id}
              disabled={!!busy}
              onChange={(e) =>
                setQuery({ workspace, review, result: e.target.value })
              }
            >
              {detail?.calculations.map((c) => (
                <option value={c.id} key={c.id}>
                  {c.producedAt}
                </option>
              ))}
            </select>
          </label>
          <pre>{JSON.stringify(calculation.output.coverage, null, 2)}</pre>
        </details>
      )}
    </section>
  );
}
