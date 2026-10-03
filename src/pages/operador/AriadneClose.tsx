import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  closeApi,
  CLOSE_FIELDS,
  SelectionEpoch,
  type Source,
  type Mapping,
  type Candidate,
  type Calculation,
  type CloseDetail,
  type CloseRole,
  type Review,
  type Check,
} from "../../lib/ariadne/closeApi";
import type { WorkspaceSummary } from "../../lib/ariadne/operatorApi";
import "./ariadne-close.css";

const roles: Record<CloseRole, string> = {
  invoice: "Valores faturados",
  quantity: "Quantidade independente",
  price: "Preço revisado",
  context: "Documento contextual",
};
const money = (value: string | null | undefined) =>
  value == null ? "Não disponível" : `${value} BRL`;
const compact = (value: string | null | undefined, limit = 160) => {
  const text = value || "Sem identificação";
  return text.length > limit ? text.slice(0, limit) + "…" : text;
};
const pdfStatus = (status?: string) =>
  status === "native_text_manual_only"
    ? "Texto nativo · campos somente por confirmação manual"
    : status === "unsupported_native_layout_manual_only"
      ? "Layout de PDF sem extração nativa neste v0. Abra o original; confirmação manual."
      : "Documento escaneado/sem texto nativo. Abra o original; confirmação manual.";
const message = (e: unknown) =>
  e instanceof Error ? e.message : "Falha inesperada";

function CheckDetail({ check, title }: { check: Check; title: string }) {
  return (
    <section>
      <h3>{title}</h3>
      <strong>{check.label}</strong>
      <dl>
        <div>
          <dt>Esperado coberto</dt>
          <dd>{money(check.expected)}</dd>
        </div>
        <div>
          <dt>Faturado − esperado</dt>
          <dd>{money(check.difference)}</dd>
        </div>
      </dl>
      {check.calculation && (
        <p className="close__formula">{check.calculation}</p>
      )}
      {check.reasons.map((r) => (
        <p key={r}>{r}</p>
      ))}
    </section>
  );
}

function BatchReview({
  source,
  detail,
  workspaceId,
  busy,
  perform,
  onConfirmed,
}: {
  source: Source;
  detail: CloseDetail;
  workspaceId: string;
  busy: boolean;
  perform: (
    action: (isCurrent: () => boolean) => Promise<unknown>,
  ) => Promise<void>;
  onConfirmed: () => void;
}) {
  const table = source.preview.tables[0];
  const [mapping, setMapping] = useState<Mapping>(
    source.confirmation
      ? {
          sheet: source.confirmation.sheet,
          mapping: source.confirmation.mapping,
          numericMode: source.confirmation.numericMode,
          manualRows: source.confirmation.manualRows ?? [],
        }
      : {
          sheet: table?.name ?? "PDF",
          mapping: table?.proposedMapping ?? {},
          numericMode: "strict",
          manualRows: [],
        },
  );
  const [manual, setManual] = useState<Record<string, string>>({ page: "1" });
  const [rows, setRows] = useState<Candidate[] | null>(null);
  const [selected, setSelected] = useState<number[]>([]);
  const [error, setError] = useState("");
  const [validating, setValidating] = useState(false);
  const epoch = useRef(new SelectionEpoch());
  const columns =
    source.preview.tables.find((t) => t.name === mapping.sheet)?.columns ?? [];
  const change = (next: Mapping) => {
    epoch.current.next();
    setMapping(next);
    setRows(null);
    setSelected([]);
    setError("");
    setValidating(false);
  };
  useEffect(
    () => () => {
      epoch.current.next();
    },
    [],
  );
  const validate = async () => {
    const token = epoch.current.next();
    setValidating(true);
    setError("");
    try {
      const response = await closeApi.candidates(
        workspaceId,
        detail.review.id,
        source.id,
        mapping,
      );
      if (epoch.current.current(token)) {
        setRows(response.rows);
        const prior = source.confirmation;
        const sameMapping =
          prior &&
          JSON.stringify(prior.mapping) === JSON.stringify(mapping.mapping) &&
          prior.sheet === mapping.sheet &&
          prior.numericMode === mapping.numericMode &&
          JSON.stringify(prior.manualRows ?? []) ===
            JSON.stringify(mapping.manualRows);
        setSelected(
          response.rows
            .filter(
              (r) =>
                !r.errors.length &&
                (!sameMapping ||
                  prior.rows.some(
                    (old) => old.index === r.index && old.eligible,
                  )),
            )
            .map((r) => r.index),
        );
      }
    } catch (e) {
      if (epoch.current.current(token)) setError(message(e));
    } finally {
      if (epoch.current.current(token)) setValidating(false);
    }
  };
  return (
    <section className="close__batch" aria-label="Revisão do lote">
      <header>
        <div>
          <span>REVISAR LOTE / {roles[source.role]}</span>
          <h2>{source.filename}</h2>
        </div>
        <span>
          {source.confirmationVersionId
            ? "Confirmado · nova revisão cria versão"
            : "Candidatos propostos"}
        </span>
      </header>
      <p>
        Confirme associação e colunas uma vez. Confirmação humana não comprova a
        verdade da fonte. Campos vazios não viram zero.
      </p>
      {source.kind === "pdf" ? (
        <>
          <p>
            PDF preservado. Sem extração automática de campos. Página e registro
            manual ficam vinculados ao original.
          </p>
          <div className="close__mapping">
            <label>
              Página
              <input
                type="number"
                min="1"
                max={source.preview.pages.length}
                value={manual.page}
                onChange={(e) => setManual({ ...manual, page: e.target.value })}
              />
            </label>
            {CLOSE_FIELDS.map((f) => (
              <label key={f}>
                {f}
                <input
                  value={manual[f] ?? ""}
                  onChange={(e) =>
                    setManual({ ...manual, [f]: e.target.value })
                  }
                />
              </label>
            ))}
          </div>
          <button
            type="button"
            disabled={busy}
            onClick={() => {
              change({
                ...mapping,
                manualRows: [
                  ...mapping.manualRows,
                  { ...manual, page: Number(manual.page) },
                ],
              });
            }}
          >
            Adicionar registro da página
          </button>
          <p>{mapping.manualRows.length} registros manuais neste lote</p>
        </>
      ) : (
        <>
          <label>
            Planilha
            <select
              aria-label="Planilha"
              value={mapping.sheet}
              disabled={busy}
              onChange={(e) => {
                const next = source.preview.tables.find(
                  (t) => t.name === e.target.value,
                )!;
                change({
                  ...mapping,
                  sheet: next.name,
                  mapping: next.proposedMapping,
                });
              }}
            >
              {source.preview.tables.map((t) => (
                <option key={t.name}>{t.name}</option>
              ))}
            </select>
          </label>
          <div className="close__mapping">
            {CLOSE_FIELDS.map((f) => (
              <label key={f}>
                {f}
                <select
                  aria-label={`Coluna ${f}`}
                  value={mapping.mapping[f] ?? ""}
                  disabled={busy}
                  onChange={(e) => {
                    const next = { ...mapping.mapping };
                    if (e.target.value) next[f] = e.target.value;
                    else delete next[f];
                    change({ ...mapping, mapping: next });
                  }}
                >
                  <option value="">Não informado</option>
                  {columns.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </label>
            ))}
          </div>
          <details>
            <summary>Prévia bruta · colunas e amostra de linhas</summary>
            <div className="close__scroll">
              <table>
                <thead>
                  <tr>
                    <th>Origem</th>
                    {columns.map((c) => (
                      <th key={c}>{c}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {source.preview.tables
                    .find((t) => t.name === mapping.sheet)
                    ?.rows.slice(0, 5)
                    .map((r) => (
                      <tr key={r.index}>
                        <td>{r.locator}</td>
                        {columns.map((c) => (
                          <td key={c}>
                            {r.raw?.[c] ??
                              (
                                r as unknown as {
                                  values: Record<string, string>;
                                }
                              ).values?.[c] ??
                              "vazio"}
                          </td>
                        ))}
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </details>
        </>
      )}
      <div className="close__actions">
        <label>
          Formato numérico
          <select
            aria-label="Formato numérico"
            value={mapping.numericMode}
            disabled={busy}
            onChange={(e) =>
              change({
                ...mapping,
                numericMode: e.target.value as Mapping["numericMode"],
              })
            }
          >
            <option value="strict">
              Estrito · ambiguidades exigem revisão
            </option>
            <option value="dot">Ponto decimal · sem milhares</option>
            <option value="comma">Vírgula decimal · sem milhares</option>
          </select>
        </label>
        <button
          type="button"
          disabled={busy || validating}
          onClick={() => void validate()}
        >
          {validating ? "Validando…" : "Validar mapeamento"}
        </button>
      </div>
      {error && <p role="alert">{error}</p>}
      {rows && (
        <>
          <div className="close__scroll">
            <table>
              <thead>
                <tr>
                  <th>Confirmar</th>
                  <th>Item / fonte</th>
                  <th>Valor</th>
                  <th>Quantidade</th>
                  <th>Preço</th>
                  <th>Validação</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.index}>
                    <td>
                      <input
                        aria-label={`Confirmar linha ${r.index}`}
                        type="checkbox"
                        disabled={busy || !!r.errors.length}
                        checked={selected.includes(r.index)}
                        onChange={(e) =>
                          setSelected(
                            e.target.checked
                              ? [...selected, r.index]
                              : selected.filter((i) => i !== r.index),
                          )
                        }
                      />
                    </td>
                    <td>
                      {r.item_key || "Sem item"}
                      <small>{r.locator}</small>
                    </td>
                    <td>{r.amount ?? "vazio"}</td>
                    <td>{r.quantity ?? "vazio"}</td>
                    <td>{r.price ?? "vazio"}</td>
                    <td>
                      {r.errors.length
                        ? r.errors.join("; ")
                        : "Válido · revisar fonte"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p>
            {selected.length}/{rows.length} linhas elegíveis selecionadas. As
            demais permanecem excluídas e visíveis.
          </p>
          <button
            className="close__primary"
            type="button"
            disabled={busy}
            onClick={() =>
              void perform(async (isCurrent) => {
                await closeApi.confirm(
                  workspaceId,
                  detail.review.id,
                  source.id,
                  mapping,
                  selected,
                  source.confirmationVersionId,
                );
                if (isCurrent()) onConfirmed();
              })
            }
          >
            Confirmar lote revisado
          </button>
        </>
      )}
    </section>
  );
}

export function AriadneClose() {
  const [query, setQuery] = useSearchParams();
  const workspaceId = query.get("workspace") ?? "";
  const reviewId = query.get("review") ?? "";
  const resultId = query.get("result") ?? "";
  const itemId = query.get("item") ?? "";
  const filter = query.get("filter") ?? "all";
  const [workspaces, setWorkspaces] = useState<WorkspaceSummary[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [detail, setDetail] = useState<CloseDetail | null>(null);
  const [result, setResult] = useState<Calculation | null>(null);
  const [workspaceLabel, setWorkspaceLabel] = useState("");
  const [synthetic, setSynthetic] = useState(false);
  const [scope, setScope] = useState("");
  const [period, setPeriod] = useState("");
  const [role, setRole] = useState<CloseRole>("invoice");
  const [file, setFile] = useState<File | null>(null);
  const [supersedes, setSupersedes] = useState("");
  const [sourceId, setSourceId] = useState("");
  const [sourcePage, setSourcePage] = useState(1);
  const [sourceLocator, setSourceLocator] = useState("");
  const [batchId, setBatchId] = useState("");
  const [status, setStatus] = useState("explained");
  const [reason, setReason] = useState("");
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [refresh, setRefresh] = useState(0);
  const [replayed, setReplayed] = useState<string | null>(null);
  const epoch = useRef(new SelectionEpoch());
  const lock = useRef(false);
  const queryRef = useRef(query);
  queryRef.current = query;
  const lastContext = useRef("");
  const fileInput = useRef<HTMLInputElement>(null);
  const changeQuery = (updates: Record<string, string | null>) => {
    const next = new URLSearchParams(queryRef.current);
    Object.entries(updates).forEach(([k, v]) => {
      if (v) next.set(k, v);
      else next.delete(k);
    });
    setQuery(next);
  };
  useEffect(() => {
    let active = true;
    void closeApi
      .workspaces()
      .then((r) => {
        if (active) setWorkspaces(r.data);
      })
      .catch((e) => {
        if (active) setError(message(e));
      });
    return () => {
      active = false;
    };
  }, [refresh]);
  useEffect(() => {
    const token = epoch.current.next();
    const controller = new AbortController();
    setLoading(!!workspaceId);
    setError("");
    setDetail(null);
    setResult(null);
    setReviews([]);
    setReplayed(null);
    const contextKey = workspaceId + "/" + reviewId;
    if (lastContext.current !== contextKey) {
      setBatchId("");
      setSourceId("");
      setSourcePage(1);
      setSourceLocator("");
      setFile(null);
      setSupersedes("");
      setNotice("");
      lastContext.current = contextKey;
    }
    if (!workspaceId) {
      setLoading(false);
      return () => controller.abort();
    }
    void (async () => {
      try {
        const index = await closeApi.reviews(workspaceId, controller.signal);
        if (!epoch.current.current(token)) return;
        setReviews(index.data);
        if (reviewId) {
          const data = await closeApi.detail(
            workspaceId,
            reviewId,
            controller.signal,
          );
          if (!epoch.current.current(token)) return;
          setDetail(data);
          if (resultId) {
            const calculation = await closeApi.result(
              workspaceId,
              reviewId,
              resultId,
              controller.signal,
            );
            if (epoch.current.current(token)) setResult(calculation);
          }
        }
      } catch (e) {
        if (!controller.signal.aborted && epoch.current.current(token))
          setError(message(e));
      } finally {
        if (epoch.current.current(token)) setLoading(false);
      }
    })();
    return () => {
      controller.abort();
      epoch.current.next();
    };
  }, [workspaceId, reviewId, resultId, refresh]);
  useEffect(() => {
    setReason("");
    setNote("");
    setStatus("explained");
  }, [itemId, resultId]);
  const perform = async (
    action: (isCurrent: () => boolean) => Promise<unknown>,
  ) => {
    if (lock.current) return;
    lock.current = true;
    const token = epoch.current.next();
    const startingContext = workspaceId + "/" + reviewId;
    const isCurrent = () =>
      epoch.current.current(token) &&
      startingContext ===
        (queryRef.current.get("workspace") ?? "") +
          "/" +
          (queryRef.current.get("review") ?? "");
    setBusy(true);
    setError("");
    try {
      await action(isCurrent);
      if (isCurrent()) setRefresh((v) => v + 1);
    } catch (e) {
      if (isCurrent()) setError(message(e));
    } finally {
      lock.current = false;
      setBusy(false);
    }
  };
  const workspace = workspaces.find((w) => w.id === workspaceId);
  const activeSources =
    detail?.sources.filter(
      (s) => !detail.sources.some((other) => other.supersedesId === s.id),
    ) ?? [];
  const items = useMemo(
    () =>
      result?.output.items.filter(
        (i) => filter === "all" || i.independent.classification === filter,
      ) ?? [],
    [result?.output.items, filter],
  );
  const item = items.find((i) => i.id === itemId) ?? items[0];
  const lastEffectiveItem = useRef("");
  useEffect(() => {
    if (!result) return;
    const next = result.id + "/" + (item?.id ?? "");
    if (next !== lastEffectiveItem.current) {
      setReason("");
      setNote("");
      setStatus("explained");
      setSourceId("");
      setSourcePage(1);
      setSourceLocator("");
      lastEffectiveItem.current = next;
    }
  }, [item?.id, resultId]);
  const batch = activeSources.find((s) => s.id === batchId);
  const source = (
    batchId === sourceId
      ? (detail?.sources ?? [])
      : (result?.inputs.sources ?? detail?.sources ?? [])
  ).find((s) => s.id === sourceId);
  const sourceRows =
    source?.confirmation?.rows.filter((r) =>
      sourceLocator
        ? r.locator === sourceLocator
        : !item ||
          item.independent.sourceRefs.some(
            (ref) => ref.sourceId === source.id && ref.locator === r.locator,
          ),
    ) ?? [];
  const groups = useMemo(() => {
    const grouped = new Map<string, typeof items>();
    for (const item of items) {
      const bucket = grouped.get(item.group);
      if (bucket) bucket.push(item);
      else grouped.set(item.group, [item]);
    }
    return grouped;
  }, [items]);
  const historicalInputsChanged =
    !!result &&
    activeSources.some(
      (current) =>
        !result.inputs.sources.some(
          (saved) =>
            saved.id === current.id &&
            saved.confirmationVersionId === current.confirmationVersionId &&
            !(saved as Source & { superseded?: boolean }).superseded,
        ),
    );
  const chart = useMemo(
    () =>
      items
        .filter((i) => i.independent.expected !== null)
        .map((i) => ({
          id: i.id,
          name: compact(i.itemKey, 32),
          Faturado: Number(i.billed),
          Esperado: Number(i.independent.expected),
        })),
    [items],
  );
  const updateItem = (id: string) => {
    changeQuery({ item: id });
    setSourceId("");
    setSourcePage(1);
    setSourceLocator("");
  };
  const selectSource = (id: string, locator: string) => {
    setBatchId("");
    setSourceId(id);
    setSourceLocator(locator);
    const page = /page:(\d+)/.exec(locator);
    setSourcePage(page ? Number(page[1]) : 1);
  };
  return (
    <div className="ariadne close">
      <header className="close__heading">
        <div>
          <p className="g2-ops__eyebrow">
            ARIADNE / EXPERIMENTO DE DESENVOLVIMENTO
          </p>
          <h1>Fechamento assistido</h1>
          <p>Importe o período, revise fontes e conclua o pacote de revisão.</p>
        </div>
        <Link to="/operador/ariadne">Abrir Alpha →</Link>
      </header>
      <div className="close__context">
        <label>
          Workspace privado
          <select
            aria-label="Workspace privado"
            value={workspaceId}
            disabled={busy}
            onChange={(e) =>
              changeQuery({
                workspace: e.target.value,
                review: null,
                result: null,
                item: null,
              })
            }
          >
            <option value="">Selecione um workspace</option>
            {workspaces.map((w) => (
              <option key={w.id} value={w.id}>
                {w.label}
                {w.synthetic ? " · sintético" : ""}
              </option>
            ))}
          </select>
        </label>
        {workspace && (
          <span>
            {workspace.synthetic
              ? "DADOS SINTÉTICOS / ILUSTRATIVOS"
              : "DADOS PRIVADOS DO OPERADOR"}
          </span>
        )}
      </div>
      {!workspaceId && (
        <form
          className="close__start"
          onSubmit={(e) => {
            e.preventDefault();
            void perform(async (isCurrent) => {
              const w = await closeApi.createWorkspace(
                workspaceLabel,
                synthetic,
              );
              if (isCurrent()) changeQuery({ workspace: w.id });
            });
          }}
        >
          <h2>Comece por um workspace privado</h2>
          <p>
            CSV UTF-8 e tabelas XLSX comuns. PDFs ficam preservados para revisão
            por página. Sem OCR e sem suporte a documentos ativos.
          </p>
          <label>
            Nome
            <input
              required
              maxLength={160}
              value={workspaceLabel}
              onChange={(e) => setWorkspaceLabel(e.target.value)}
            />
          </label>
          <label className="close__check">
            <input
              type="checkbox"
              checked={synthetic}
              onChange={(e) => setSynthetic(e.target.checked)}
            />{" "}
            Este workspace usa evidência sintética de engenharia
          </label>
          <button className="close__primary" disabled={busy}>
            Criar workspace privado
          </button>
        </form>
      )}
      {workspaceId && (
        <div className="close__context">
          <label>
            Revisão salva
            <select
              aria-label="Revisão salva"
              value={reviewId}
              disabled={busy || loading}
              onChange={(e) =>
                changeQuery({
                  review: e.target.value,
                  result: null,
                  item: null,
                })
              }
            >
              <option value="">Novo período e escopo</option>
              {reviews.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.period} · {r.scope}
                </option>
              ))}
            </select>
          </label>
          {detail && (
            <strong>
              {detail.review.period} / {detail.review.scope}
            </strong>
          )}
        </div>
      )}
      {workspaceId && !reviewId && !loading && (
        <form
          className="close__start"
          onSubmit={(e) => {
            e.preventDefault();
            void perform(async (isCurrent) => {
              const r = await closeApi.start(workspaceId, scope, period);
              if (isCurrent()) changeQuery({ review: r.id, result: null });
            });
          }}
        >
          <h2>Iniciar revisão mensal</h2>
          <div className="close__actions">
            <label>
              Escopo privado
              <input
                required
                maxLength={160}
                value={scope}
                onChange={(e) => setScope(e.target.value)}
                placeholder="Identificador da unidade/escopo"
              />
            </label>
            <label>
              Competência
              <input
                required
                type="month"
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
              />
            </label>
            <button className="close__primary" disabled={busy}>
              Iniciar revisão
            </button>
          </div>
        </form>
      )}
      {error && (
        <p className="close__message" role="alert">
          {error}
        </p>
      )}
      {notice && <p role="status">{notice}</p>}
      {(loading || busy) && (
        <p role="status" aria-live="polite">
          {busy ? "Salvando ação…" : "Carregando contexto privado…"}
        </p>
      )}
      {detail && (
        <>
          <div className="close__progress">
            <span>1 · Importar {activeSources.length} fontes</span>
            <span>
              2 · Revisar{" "}
              {activeSources.filter((s) => s.confirmationVersionId).length}/
              {activeSources.length}
            </span>
            <span>3 · {detail.calculations.length} cálculos salvos</span>
            <span>4 · {detail.packages.length} pacotes</span>
          </div>
          <section className="close__intake">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (file)
                  void perform(async (isCurrent) => {
                    const uploaded = await closeApi.upload(
                      workspaceId,
                      reviewId,
                      file,
                      role,
                      supersedes,
                    );
                    if (!isCurrent()) return;
                    setFile(null);
                    if (fileInput.current) fileInput.current.value = "";
                    setSupersedes("");
                    setBatchId(uploaded.id);
                    setSourceId(uploaded.id);
                    setSourcePage(1);
                    setSourceLocator("");
                    setNotice(
                      uploaded.duplicate
                        ? "Fonte duplicada: original recuperado."
                        : "Fonte importada para revisão.",
                    );
                  });
              }}
            >
              <label>
                Papel da fonte
                <select
                  aria-label="Papel da fonte"
                  value={role}
                  disabled={busy}
                  onChange={(e) => {
                    setRole(e.target.value as CloseRole);
                    setSupersedes("");
                  }}
                >
                  {Object.entries(roles).map(([v, l]) => (
                    <option key={v} value={v}>
                      {l}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Arquivo · até 8 MiB
                <input
                  ref={fileInput}
                  type="file"
                  accept=".csv,.xlsx,.pdf"
                  disabled={busy}
                  onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                />
              </label>
              <label>
                Correção de fonte
                <select
                  aria-label="Correção de fonte"
                  value={supersedes}
                  disabled={busy}
                  onChange={(e) => setSupersedes(e.target.value)}
                >
                  <option value="">Nova fonte</option>
                  {activeSources
                    .filter((s) => s.role === role)
                    .map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.filename}
                      </option>
                    ))}
                </select>
              </label>
              <button className="close__primary" disabled={busy || !file}>
                Importar fonte
              </button>
            </form>
            <p>
              Planilhas sem fórmulas, macros, links externos ou células
              mescladas. Quantidade e preço exigem fontes independentes do
              faturamento.
            </p>
          </section>
          <div className="close__sources">
            {detail.sources.map((s) => (
              <div
                key={s.id}
                data-superseded={!activeSources.some((a) => a.id === s.id)}
              >
                <span>{roles[s.role]}</span>
                <strong>{s.filename}</strong>
                <small>
                  {!activeSources.some((a) => a.id === s.id)
                    ? "Substituída · histórico preservado"
                    : s.confirmationVersionId
                      ? "Lote confirmado"
                      : "Revisão pendente"}
                </small>
                <button
                  type="button"
                  disabled={busy || !activeSources.some((a) => a.id === s.id)}
                  onClick={() => {
                    setBatchId(s.id);
                    setSourceId(s.id);
                    setSourcePage(1);
                    setSourceLocator("");
                  }}
                >
                  {s.confirmationVersionId ? "Revisar versão" : "Revisar lote"}
                </button>
              </div>
            ))}
          </div>
          {batch && (
            <BatchReview
              key={batch.id + (batch.confirmationVersionId ?? "")}
              source={batch}
              detail={detail}
              workspaceId={workspaceId}
              busy={busy}
              perform={perform}
              onConfirmed={() => {
                setBatchId("");
                setNotice(
                  "Lote confirmado. Entradas preservadas para o próximo cálculo.",
                );
              }}
            />
          )}
          <div className="close__actions">
            <button
              className="close__primary"
              type="button"
              disabled={busy || !activeSources.length}
              onClick={() =>
                void perform(async (isCurrent) => {
                  const saved = await closeApi.calculate(
                    workspaceId,
                    reviewId,
                    detail.sources,
                  );
                  if (isCurrent())
                    changeQuery({ result: saved.id, item: null });
                })
              }
            >
              Calcular e salvar revisão
            </button>
            <label>
              Cálculo histórico
              <select
                aria-label="Cálculo histórico"
                value={resultId}
                disabled={busy}
                onChange={(e) =>
                  changeQuery({ result: e.target.value, item: null })
                }
              >
                <option value="">Selecione um cálculo salvo</option>
                {detail.calculations.map((c) => (
                  <option key={c.id} value={c.id}>
                    {new Date(c.producedAt).toLocaleString("pt-BR")} ·{" "}
                    {c.id.slice(0, 8)}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </>
      )}
      {result && (
        <>
          {historicalInputsChanged && (
            <p className="close__message" role="status">
              Este cálculo usa as versões salvas. Há fontes ou confirmações
              posteriores; calcule uma nova revisão para usá-las.
            </p>
          )}
          <div className="close__coverage">
            <strong>
              {result.output.coverage.independentlyCovered}/
              {result.output.coverage.invoiceItems} itens com verificação
              independente
            </strong>
            <span>
              {result.output.coverage.internalChecks} verificações internas ·{" "}
              {result.output.coverage.notVerified} não verificados
            </span>
            <small>
              Cálculo salvo {result.id.slice(0, 8)} · regras{" "}
              {result.output.ruleVersion} · nenhuma extrapolação de total
            </small>
            {result.output.coverage.unreviewedSources.length > 0 && (
              <p>
                {result.output.coverage.unreviewedSources.length} fontes ainda
                não revisadas.
              </p>
            )}
            {result.output.coverage.unselectedSheets.length > 0 && (
              <p>
                Planilhas excluídas desta confirmação:{" "}
                {result.output.coverage.unselectedSheets
                  .map((s) => `${s.sheet} (${s.rows} linhas)`)
                  .join(", ")}
              </p>
            )}
            {result.output.coverage.orphanInputs.length > 0 && (
              <p>
                {result.output.coverage.orphanInputs.length} entradas sem item
                faturado correspondente.
              </p>
            )}
          </div>
          <div className="close__actions">
            <label>
              Filtrar resultado
              <select
                aria-label="Filtrar resultado"
                value={filter}
                onChange={(e) =>
                  changeQuery({ filter: e.target.value, item: null })
                }
              >
                <option value="all">Todos os itens</option>
                <option value="divergence">Divergências</option>
                <option value="reconciled">Conciliados</option>
                <option value="not_verifiable">Não verificáveis</option>
              </select>
            </label>
            <button
              type="button"
              disabled={busy}
              onClick={async () => {
                const token = epoch.current.next();
                try {
                  const replay = await closeApi.replay(
                    workspaceId,
                    reviewId,
                    resultId,
                  );
                  if (epoch.current.current(token))
                    setReplayed(
                      replay.matches
                        ? "Replay exato confirmado"
                        : "Replay divergiu; investigar",
                    );
                } catch (e) {
                  if (epoch.current.current(token)) setError(message(e));
                }
              }}
            >
              Reconstruir cálculo
            </button>
            <button
              type="button"
              disabled={busy}
              onClick={() =>
                void perform(async () => {
                  await closeApi.save(workspaceId, reviewId, resultId);
                })
              }
            >
              Salvar pacote de revisão
            </button>
            {detail?.packages
              .filter((p) => p.resultId === resultId)
              .map((p, index) => (
                <a
                  className="close__download"
                  key={p.id}
                  href={closeApi.exportUrl(workspaceId, reviewId, p.id)}
                >
                  Exportar pacote {index + 1} ↓
                </a>
              ))}
          </div>
          {replayed && <p role="status">{replayed}</p>}
          {chart.length > 0 && (
            <figure className="close__chart">
              <figcaption>
                Faturado e esperado independente · somente itens cobertos
                <small>
                  Gráfico aproximado para navegação. Valores monetários exatos
                  na tabela.
                </small>
              </figcaption>
              <ResponsiveContainer width="100%" height={180}>
                <BarChart
                  data={chart}
                  margin={{ left: 14, right: 20, top: 12, bottom: 0 }}
                >
                  <CartesianGrid stroke="var(--ops-rule)" vertical={false} />
                  <XAxis
                    dataKey="name"
                    tick={{ fill: "var(--ops-muted)", fontSize: 11 }}
                  />
                  <YAxis tick={{ fill: "var(--ops-muted)", fontSize: 11 }} />
                  <Legend verticalAlign="top" wrapperStyle={{ fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      background: "var(--ops-paper)",
                      border: "1px solid var(--ops-rule)",
                      borderRadius: 0,
                      color: "var(--ops-ink)",
                    }}
                  />
                  <Bar
                    dataKey="Faturado"
                    isAnimationActive={false}
                    fill="var(--ops-ink)"
                    onClick={(d) => updateItem(d.id as string)}
                  >
                    {chart.map((d) => (
                      <Cell key={d.id} opacity={item?.id === d.id ? 1 : 0.55} />
                    ))}
                  </Bar>
                  <Bar
                    dataKey="Esperado"
                    isAnimationActive={false}
                    fill="var(--ops-accent)"
                    onClick={(d) => updateItem(d.id as string)}
                  />
                </BarChart>
              </ResponsiveContainer>
            </figure>
          )}
          <div className="close__scroll">
            <table aria-label="Itens do fechamento">
              <thead>
                <tr>
                  <th>Item / componente</th>
                  <th>Faturado</th>
                  <th>Esperado independente</th>
                  <th>Diferença</th>
                  <th>Resultado independente</th>
                  <th>Interno</th>
                </tr>
              </thead>
              <tbody>
                {[...groups].map(([group, members]) => (
                  <Fragment key={group}>
                    {members.length > 1 && (
                      <tr className="close__group">
                        <td colSpan={6}>
                          {members.length} registros relacionados · {group} ·
                          verificar duplicidade
                        </td>
                      </tr>
                    )}
                    {members.map((i) => (
                      <tr key={i.id} data-selected={i.id === item?.id}>
                        <td>
                          <button
                            type="button"
                            onClick={() => updateItem(i.id)}
                          >
                            {compact(i.itemKey || "Sem identificação")}
                          </button>
                          <small>
                            {i.component} · {compact(i.group)}
                          </small>
                        </td>
                        <td>
                          {money(i.billed)}
                          {i.billed == null && i.candidate.amount != null && (
                            <small>
                              Fonte: {i.candidate.amount}{" "}
                              {i.currency || "moeda ausente"} · não normalizado
                            </small>
                          )}
                        </td>
                        <td>{money(i.independent.expected)}</td>
                        <td>{money(i.independent.difference)}</td>
                        <td>{i.independent.label}</td>
                        <td>{i.internal.label}</td>
                      </tr>
                    ))}
                  </Fragment>
                ))}
              </tbody>
            </table>
            {items.length === 0 && <p>Nenhum item corresponde ao filtro.</p>}
          </div>
          {item && (
            <div className="close__investigation">
              <article>
                <header>
                  <span>ITEM SELECIONADO</span>
                  <h2>
                    {compact(item.itemKey)} / {item.component}
                  </h2>
                  <p>Faturado: {money(item.billed)}</p>
                  {(item.itemKey?.length ?? 0) > 160 && (
                    <details>
                      <summary>Identificação completa</summary>
                      <p>{item.itemKey}</p>
                    </details>
                  )}
                </header>
                <CheckDetail
                  check={item.independent}
                  title="Verificação independente"
                />
                <CheckDetail
                  check={item.internal}
                  title="Consistência interna da fatura"
                />
                <section>
                  <h3>Fontes e associações deste cálculo</h3>
                  {item.independent.sourceRefs.map((ref, i) => (
                    <button
                      className="close__ref"
                      type="button"
                      key={i}
                      onClick={() => selectSource(ref.sourceId, ref.locator)}
                    >
                      {roles[ref.role]} · {ref.locator} →
                    </button>
                  ))}
                  {result.output.relatedGroups
                    ?.filter((group) => group.group === item.group)
                    .map((group) => (
                      <details key={group.group}>
                        <summary>
                          {group.reason} · {group.sourceRefs.length} referências
                          relacionadas
                        </summary>
                        {group.sourceRefs.map((ref, index) => (
                          <button
                            className="close__ref"
                            type="button"
                            key={index}
                            onClick={() =>
                              selectSource(ref.sourceId, ref.locator)
                            }
                          >
                            {roles[ref.role]} · {ref.locator} →
                          </button>
                        ))}
                      </details>
                    ))}
                </section>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    void perform(() =>
                      closeApi.treat(
                        workspaceId,
                        reviewId,
                        resultId,
                        item.id,
                        status,
                        reason,
                        note,
                      ),
                    );
                  }}
                >
                  <h3>Tratamento da exceção</h3>
                  <p>Explicar ou aceitar preserva o resultado matemático.</p>
                  <label>
                    Status
                    <select
                      aria-label="Status"
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                    >
                      <option value="open">Aberta</option>
                      <option value="explained">Explicada</option>
                      <option value="accepted">Aceita pelo operador</option>
                      <option value="follow_up">Acompanhar</option>
                    </select>
                  </label>
                  <label>
                    Motivo
                    <input
                      required
                      maxLength={500}
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                    />
                  </label>
                  <label>
                    Nota / ação
                    <textarea
                      required
                      maxLength={4000}
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                    />
                  </label>
                  <button type="submit" disabled={busy}>
                    Registrar tratamento
                  </button>
                </form>
                {result.treatments
                  .filter((t) => t.itemId === item.id)
                  .map((t) => (
                    <p key={t.id}>
                      <strong>
                        {t.status} · {t.reason}
                      </strong>
                      <br />
                      {t.note}
                    </p>
                  ))}
              </article>
              <article className="close__source-panel">
                <h2>Fonte ao lado do cálculo</h2>
                {source ? (
                  <>
                    <h3>{source.filename}</h3>
                    <small>Versão SHA-256 {source.sha256}</small>
                    <a
                      className="close__download"
                      href={closeApi.originalUrl(
                        workspaceId,
                        reviewId,
                        source.id,
                      )}
                    >
                      Abrir original privado ↓
                    </a>
                    {source.kind === "pdf" ? (
                      <>
                        <label>
                          Página
                          <select
                            aria-label="Página"
                            value={sourcePage}
                            onChange={(e) =>
                              setSourcePage(Number(e.target.value))
                            }
                          >
                            {source.preview.pages.map((p) => (
                              <option key={p.number} value={p.number}>
                                Página {p.number}
                              </option>
                            ))}
                          </select>
                        </label>
                        <p>
                          {pdfStatus(
                            source.preview.pages[sourcePage - 1]?.status,
                          )}
                        </p>
                        <pre>
                          {source.preview.pages[sourcePage - 1]?.text ||
                            "Sem texto nativo disponível"}
                        </pre>
                      </>
                    ) : (
                      <>
                        {sourceRows.length ? (
                          sourceRows.map((r) => (
                            <section key={r.index}>
                              <h3>{r.locator}</h3>
                              <dl>
                                {Object.entries(r.raw).map(([k, v]) => (
                                  <div key={k}>
                                    <dt>
                                      {k}
                                      <small>{r.cells?.[k]}</small>
                                    </dt>
                                    <dd>{v ?? "vazio"}</dd>
                                  </div>
                                ))}
                              </dl>
                            </section>
                          ))
                        ) : (
                          <p>
                            Fonte ainda não confirmada neste cálculo. Prévia
                            preservada.
                          </p>
                        )}
                      </>
                    )}
                  </>
                ) : (
                  <p>
                    Selecione uma referência para abrir os valores e
                    localizadores preservados.
                  </p>
                )}
              </article>
            </div>
          )}
          <details className="close__limits">
            <summary>Escopo excluído e identidade do cálculo</summary>
            <p>{result.output.exclusions.join(" · ")}</p>
            <p>
              Execução: {result.runId} · Estado: {result.stateVersionId} ·
              Premissas: {result.assumptionVersionId}
            </p>
            <p>Implementação: {result.implementation}</p>
            <p>
              Este pacote não afirma auditoria, conformidade legal,
              sobrecobrança confirmada ou economia verificada.
            </p>
          </details>
        </>
      )}
      {!result && source?.kind === "pdf" && (
        <section className="close__source-panel">
          <h2>{source.filename}</h2>
          <label>
            Página
            <select
              aria-label="Página"
              value={sourcePage}
              onChange={(e) => setSourcePage(Number(e.target.value))}
            >
              {source.preview.pages.map((p) => (
                <option key={p.number} value={p.number}>
                  {p.number}
                </option>
              ))}
            </select>
          </label>
          <p>{pdfStatus(source.preview.pages[sourcePage - 1]?.status)}</p>
          <pre>
            {source.preview.pages[sourcePage - 1]?.text ||
              "Escaneado/sem texto nativo. Confirmação manual vinculada à página."}
          </pre>
          <a href={closeApi.originalUrl(workspaceId, reviewId, source.id)}>
            Abrir original privado ↓
          </a>
        </section>
      )}
    </div>
  );
}
