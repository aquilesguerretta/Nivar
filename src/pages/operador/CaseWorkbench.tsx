import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronDown,
  Download,
  FileText,
  Fingerprint,
  Link2,
  Plus,
  Save,
  Upload,
  X,
} from "lucide-react";
import {
  ANATOMIA_FATURA,
  FICHAS_MOCK,
  FIO_MOCK,
  LIVRO_RAZAO_MOCK,
  NATUREZAS_SOLAR,
  AGORA_DA_AMOSTRA,
  type PedidoNaFila,
} from "../../lib/operador/mock";
import {
  nomeDoProduto,
  produtoComFilaPorId,
} from "../../lib/operador/catalogo";
import { formatarIdade, formatarData } from "../../lib/operador/idade";
import { estadoDoPedido } from "./operatorViewUtils";

interface Evidence {
  id: string;
  label: string;
  value: string | null;
  unit?: string;
  origin: string;
}
interface Annotation {
  note: string;
  reference: string;
  nature: string;
  sourceHash?: string;
}
interface LocalSource {
  url: string;
  filename: string;
  mime: string;
  bytes: number;
  hash: string;
}
interface LocalEvent {
  at: string;
  action: string;
}
interface Draft {
  text: string;
  annotations: Record<string, Annotation>;
  questions: string;
  history: LocalEvent[];
}
const emptyDraft = (): Draft => ({
  text: "",
  annotations: {},
  questions: "",
  history: [],
});
const keyFor = (id: string) => `nivar.g2.case-draft.${id}`;
const isRecord = (value: unknown): value is Record<string, unknown> =>
  Boolean(value) && typeof value === "object" && !Array.isArray(value);
function readDraft(id: string): Draft {
  try {
    const raw: unknown = JSON.parse(
      sessionStorage.getItem(keyFor(id)) ?? "null",
    );
    if (!isRecord(raw)) return emptyDraft();
    const annotations: Record<string, Annotation> = {};
    for (const [key, value] of Object.entries(
      isRecord(raw.annotations) ? raw.annotations : {},
    )) {
      if (!isRecord(value) || key === "__proto__") continue;
      annotations[key] = {
        note: typeof value.note === "string" ? value.note : "",
        reference: typeof value.reference === "string" ? value.reference : "",
        nature: typeof value.nature === "string" ? value.nature : "",
        ...(typeof value.sourceHash === "string" &&
        /^[a-f0-9]{64}$/i.test(value.sourceHash)
          ? { sourceHash: value.sourceHash.toLowerCase() }
          : {}),
      };
    }
    return {
      text: typeof raw.text === "string" ? raw.text : "",
      questions: typeof raw.questions === "string" ? raw.questions : "",
      annotations,
      history: Array.isArray(raw.history)
        ? raw.history.filter(
            (h): h is LocalEvent =>
              isRecord(h) &&
              typeof h.at === "string" &&
              Number.isFinite(Date.parse(h.at)) &&
              typeof h.action === "string",
          )
        : [],
    };
  } catch {
    return emptyDraft();
  }
}
function evidenceFor(p: PedidoNaFila): Evidence[] {
  const natureza = produtoComFilaPorId(p.produtoId)?.natureza;
  if (natureza === "documento-padronizado")
    return ANATOMIA_FATURA.map((f) => ({
      id: f.chave,
      label: f.rotulo,
      value: null,
      unit: f.unidade,
      origin: "Campo esperado na fatura · valor ausente na amostra",
    }));
  if (natureza === "documento-aberto")
    return (LIVRO_RAZAO_MOCK[p.id] ?? []).map((l, i) => ({
      id: l.id,
      label: `${String(i + 1).padStart(2, "0")} / ${l.trilha}`,
      value: l.afirmacao,
      origin: "Alegação ilustrativa da proposta · não verificada",
    }));
  const f = FICHAS_MOCK[p.id];
  return f
    ? [
        {
          id: "sector",
          label: "Setor",
          value: f.sector,
          origin: "Ficha ilustrativa · declaração do cliente",
        },
        {
          id: "consumption",
          label: "Consumo mensal",
          value: f.monthlyConsumptionBand,
          origin: "Ficha ilustrativa · faixa declarada, não medição",
        },
        {
          id: "tariff",
          label: "Modalidade tarifária",
          value: f.tariffModality,
          origin: "Ficha ilustrativa · declaração do cliente",
        },
        {
          id: "concern",
          label: "A pergunta do cliente",
          value: f.concern,
          origin: "Ficha ilustrativa · relato sem comprovação documental",
        },
      ]
    : [];
}

/** A local evidence instrument over declared fixtures. No server writes or invented PDF extraction. */
export function CaseWorkbench({ pedido }: { pedido: PedidoNaFila }) {
  const [draft, setDraft] = useState<Draft>(() => readDraft(pedido.id));
  const [tab, setTab] = useState<
    "evidence" | "questions" | "opinion" | "activity"
  >("evidence");
  const [selected, setSelected] = useState(
    () => evidenceFor(pedido)[0]?.id ?? "",
  );
  const [source, setSource] = useState<LocalSource | null>(null);
  const [sourceBusy, setSourceBusy] = useState(false);
  const [sourceError, setSourceError] = useState("");
  const [saved, setSaved] = useState("");
  const [dirty, setDirty] = useState(false);
  const [page, setPage] = useState(1);
  const fileRef = useRef<HTMLInputElement>(null);
  const sequence = useRef(0);
  const evidence = evidenceFor(pedido);
  const current = evidence.find((e) => e.id === selected) ?? evidence[0];
  const annotation = current ? draft.annotations[current.id] : undefined;
  const documented = evidence.filter((e) =>
    Boolean(draft.annotations[e.id]?.note?.trim()),
  ).length;
  const natureza = produtoComFilaPorId(pedido.produtoId)?.natureza;
  const isSolar = natureza === "documento-aberto";
  const isDiagnostic = natureza === "ficha";
  useEffect(
    () => () => {
      if (source) URL.revokeObjectURL(source.url);
    },
    [source],
  );
  useEffect(
    () => () => {
      sequence.current += 1;
    },
    [],
  );

  function updateDraft(patch: Partial<Draft>) {
    setDraft((d) => ({ ...d, ...patch }));
    setDirty(true);
    setSaved("");
  }
  function updateAnnotation(patch: Partial<Annotation>) {
    if (!current) return;
    const previous = draft.annotations[current.id] ?? {
      note: "",
      reference: "",
      nature: "",
    };
    updateDraft({
      annotations: {
        ...draft.annotations,
        [current.id]: { ...previous, ...patch },
      },
    });
  }
  function record(action: string) {
    setDraft((d) => ({
      ...d,
      history: [...d.history, { at: new Date().toISOString(), action }],
    }));
    setDirty(true);
    setSaved("");
  }
  function save() {
    const next = {
      ...draft,
      history: [
        ...draft.history,
        {
          at: new Date().toISOString(),
          action: "Rascunho salvo nesta sessão.",
        },
      ],
    };
    setDraft(next);
    try {
      sessionStorage.setItem(keyFor(pedido.id), JSON.stringify(next));
      setSaved("Salvo nesta sessão. Nenhum envio realizado.");
      setDirty(false);
    } catch {
      setSaved(
        "Armazenamento indisponível. Exporte o caderno para conservar o rascunho.",
      );
    }
  }
  async function attach(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    const request = ++sequence.current;
    setSourceError("");
    if (file.size > 20 * 1024 * 1024) {
      setSourceError("Use um PDF, PNG ou JPEG de até 20 MB.");
      return;
    }
    setSourceBusy(true);
    try {
      const bytes = await file.arrayBuffer();
      const head = new Uint8Array(bytes.slice(0, 8));
      const mime =
        head[0] === 0x25 &&
        head[1] === 0x50 &&
        head[2] === 0x44 &&
        head[3] === 0x46
          ? "application/pdf"
          : head[0] === 0x89 &&
              head[1] === 0x50 &&
              head[2] === 0x4e &&
              head[3] === 0x47
            ? "image/png"
            : head[0] === 0xff && head[1] === 0xd8 && head[2] === 0xff
              ? "image/jpeg"
              : null;
      if (!mime)
        throw new Error("Este arquivo não é um PDF, PNG ou JPEG reconhecido.");
      const digest = await crypto.subtle.digest("SHA-256", bytes);
      if (request !== sequence.current) return;
      const hash = Array.from(new Uint8Array(digest), (n) =>
        n.toString(16).padStart(2, "0"),
      ).join("");
      setSource({
        url: URL.createObjectURL(new Blob([bytes], { type: mime })),
        filename: file.name,
        mime,
        bytes: file.size,
        hash,
      });
      setPage(1);
      record(`Fonte local aberta: ${file.name}. SHA-256 ${hash}. Não enviada.`);
    } catch (error) {
      if (request === sequence.current)
        setSourceError(
          error instanceof Error
            ? error.message
            : "Não foi possível abrir a fonte.",
        );
    } finally {
      if (request === sequence.current) setSourceBusy(false);
    }
  }
  function exportDraft() {
    const entry = {
      at: new Date().toISOString(),
      action: "Caderno exportado como arquivo local.",
    };
    const exported = {
      version: "NIVAR-G2-EXPERIMENTAL/1",
      disclaimer:
        "Amostra ilustrativa. Anotações locais não verificadas. Não é parecer emitido pela NIVAR. Nenhum dado foi enviado ao servidor.",
      case: pedido,
      sampleClock: AGORA_DA_AMOSTRA.toISOString(),
      source: source
        ? {
            filename: source.filename,
            mime: source.mime,
            bytes: source.bytes,
            sha256: source.hash,
            localOnly: true,
          }
        : null,
      evidence,
      draft: { ...draft, history: [...draft.history, entry] },
      exportedAt: entry.at,
    };
    const url = URL.createObjectURL(
      new Blob([JSON.stringify(exported, null, 2)], {
        type: "application/json",
      }),
    );
    const a = document.createElement("a");
    a.href = url;
    a.download = `nivar-g2-${pedido.id}-rascunho.json`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    record(entry.action);
    setSaved("Caderno exportado. Arquivo local, sem envio.");
  }

  return (
    <div className="g2-case">
      <Link className="g2-case__back" to={`/operador/${pedido.produtoId}`}>
        <ArrowLeft size={13} /> {nomeDoProduto(pedido.produtoId)}
      </Link>
      <header className="g2-case__heading">
        <div>
          <p className="g2-ops__eyebrow">CADERNO {pedido.id.toUpperCase()}</p>
          <h1>{pedido.cliente}</h1>
          <p>
            <span>{estadoDoPedido(pedido)}</span>
            <span>Recebido {formatarData(pedido.criadoEm)}</span>
            <span>
              {formatarIdade(pedido.criadoEm, AGORA_DA_AMOSTRA)} na amostra
            </span>
          </p>
        </div>
        <button type="button" className="g2-ops__button" onClick={exportDraft}>
          <Download size={14} /> Exportar caderno
        </button>
      </header>
      <div className="g2-case__process" aria-label="Método do caderno">
        <span>
          <b>01</b> Evidência
        </span>
        <ArrowRight size={13} />
        <span>
          <b>02</b> Estrutura
        </span>
        <ArrowRight size={13} />
        <span>
          <b>03</b> Contraditório
        </span>
        <ArrowRight size={13} />
        <span>
          <b>04</b> Parecer
        </span>
      </div>
      <div className="g2-case__workspace">
        <aside className="g2-case__source-panel" aria-label="Fonte do caso">
          <div className="g2-case__section-heading">
            <h2>O que chegou.</h2>
            <span>{isDiagnostic ? "FICHA" : "DOCUMENTO"}</span>
          </div>
          {isDiagnostic && (
            <div className="g2-case__intake">
              <span>RELATO ILUSTRATIVO DO CLIENTE</span>
              <blockquote>
                {FICHAS_MOCK[pedido.id]?.concern ?? "Relato ausente."}
              </blockquote>
              <p>
                Uma declaração inicia a investigação. Ela ainda precisa ser
                confrontada com evidência.
              </p>
            </div>
          )}
          {source ? (
            <div className="g2-case__document">
              <div className="g2-case__document-toolbar">
                <span title={source.filename}>{source.filename}</span>
                <button
                  type="button"
                  aria-label="Remover documento local"
                  onClick={() => {
                    setSource(null);
                    record("Fonte local removida da visualização.");
                  }}
                >
                  <X size={15} />
                </button>
              </div>
              {source.mime === "application/pdf" ? (
                <iframe
                  src={`${source.url}#page=${page}`}
                  title={`Documento local ${source.filename}, página solicitada ${page}`}
                />
              ) : (
                <img
                  src={source.url}
                  alt={`Documento local: ${source.filename}`}
                />
              )}
              <div className="g2-case__document-controls">
                {source.mime === "application/pdf" && (
                  <label>
                    Página{" "}
                    <input
                      type="number"
                      min={1}
                      max={9999}
                      value={page}
                      onChange={(e) =>
                        setPage(
                          Math.min(
                            9999,
                            Math.max(1, Number(e.target.value) || 1),
                          ),
                        )
                      }
                    />
                  </label>
                )}
                <a href={source.url} target="_blank" rel="noreferrer">
                  Abrir fonte local ↗
                </a>
              </div>
            </div>
          ) : (
            <div className="g2-case__source-empty">
              <FileText size={32} strokeWidth={1} />
              <span>{pedido.arquivo ?? "Evidência complementar"}</span>
              <h3>
                {isDiagnostic
                  ? "O relato abre a pergunta."
                  : "O nome do arquivo não é a evidência."}
              </h3>
              <p>
                {isDiagnostic
                  ? "Abra uma fonte local para confrontar o que foi declarado."
                  : "O documento original não integra esta amostra. Nenhum valor foi extraído ou verificado."}
              </p>
              <button
                type="button"
                className="g2-ops__button"
                onClick={() => fileRef.current?.click()}
                disabled={sourceBusy}
              >
                <Upload size={14} />{" "}
                {sourceBusy ? "Verificando arquivo…" : "Abrir documento local"}
              </button>
              <small>
                PDF, PNG ou JPEG · até 20 MB
                <br />
                Processado no navegador. Nunca enviado.
              </small>
            </div>
          )}
          <input
            ref={fileRef}
            type="file"
            accept="application/pdf,image/png,image/jpeg"
            onChange={attach}
            className="g2-ops__sr"
            tabIndex={-1}
            aria-label="Selecionar documento local"
          />
          {sourceError && (
            <p className="g2-case__error" role="alert">
              {sourceError}
            </p>
          )}
          {source && (
            <>
              <div className="g2-case__source-meta">
                <span>
                  <Fingerprint size={14} /> IDENTIDADE DA FONTE LOCAL
                </span>
                <dl>
                  <div>
                    <dt>Tipo / tamanho</dt>
                    <dd>
                      {source.mime} ·{" "}
                      {source.bytes < 1024
                        ? source.bytes + " B"
                        : Math.round(source.bytes / 1024) + " KB"}
                    </dd>
                  </div>
                  <div>
                    <dt>SHA-256</dt>
                    <dd className="g2-case__hash">{source.hash}</dd>
                  </div>
                  <div>
                    <dt>Transporte</dt>
                    <dd>Local · não enviado</dd>
                  </div>
                </dl>
                <p>
                  O hash identifica estes bytes. Não comprova a autenticidade do
                  conteúdo.
                </p>
              </div>
              <button
                type="button"
                className="g2-ops__text-button"
                disabled={sourceBusy}
                onClick={() => fileRef.current?.click()}
              >
                <Plus size={13} /> Abrir outra fonte local
              </button>
            </>
          )}
          <div className="g2-case__source-note">
            <span>REGRA DE LEITURA</span>
            <p>
              Ausência não é zero.
              <br />
              Estimativa não é medição.
              <br />
              Uma alegação não é uma conclusão.
            </p>
          </div>
        </aside>
        <section className="g2-case__analysis" aria-label="Análise do caso">
          <nav className="g2-case__tabs" aria-label="Seções do caderno">
            {(
              [
                ["evidence", "Leitura"],
                ["questions", "Contraditório"],
                ["opinion", "Parecer"],
                ["activity", "Histórico"],
              ] as const
            ).map(([id, title]) => (
              <button
                key={id}
                type="button"
                aria-current={tab === id ? "true" : undefined}
                onClick={() => setTab(id)}
              >
                {title}
                {id === "evidence" && <span>{evidence.length}</span>}
              </button>
            ))}
          </nav>
          {tab === "evidence" && (
            <>
              <div className="g2-case__reading-title">
                <h2>
                  {isSolar
                    ? "O que a proposta afirma."
                    : isDiagnostic
                      ? "A declaração, campo a campo."
                      : "Anatomia da fatura."}
                </h2>
                <span>
                  {documented}/{evidence.length} com anotação local
                </span>
              </div>
              <div className="g2-case__evidence-list">
                {evidence.map((e) => (
                  <button
                    key={e.id}
                    type="button"
                    aria-pressed={current?.id === e.id}
                    onClick={() => setSelected(e.id)}
                  >
                    <span className="g2-case__evidence-label">{e.label}</span>
                    <span
                      className={`g2-case__evidence-value${e.value === null ? " g2-case__evidence-value--missing" : ""}`}
                    >
                      {e.value ?? "Sem dado disponível"}
                      {e.unit && <small>{e.unit}</small>}
                    </span>
                    <span className="g2-case__evidence-indicator">
                      {draft.annotations[e.id]?.note ? (
                        <Check size={13} aria-label="Com anotação local" />
                      ) : (
                        <ChevronDown size={13} />
                      )}
                    </span>
                  </button>
                ))}
              </div>
              {current && (
                <section className="g2-case__annotation">
                  <div className="g2-case__annotation-title">
                    <Link2 size={16} />
                    <span>VÍNCULO DE EVIDÊNCIA</span>
                  </div>
                  <h3>{current.label}</h3>
                  <p>{current.origin}.</p>
                  <div className="g2-case__annotation-meta">
                    <span>FONTE LOCAL ABERTA</span>
                    <strong>
                      {source ? source.filename : "Nenhuma fonte local aberta"}
                    </strong>
                  </div>
                  {source && annotation?.sourceHash !== source.hash && (
                    <button
                      type="button"
                      className="g2-ops__text-button"
                      onClick={() => {
                        updateAnnotation({ sourceHash: source.hash });
                        record(
                          `Anotação ${current.label} vinculada explicitamente à fonte local ${source.filename}. SHA-256 ${source.hash}.`,
                        );
                      }}
                    >
                      <Link2 size={13} /> Vincular anotação a esta fonte
                    </button>
                  )}
                  {!annotation?.sourceHash && (
                    <p className="g2-case__annotation-hash">
                      Anotação sem vínculo documental. Abrir um arquivo não
                      comprova que ele seja o original da amostra.
                    </p>
                  )}
                  {annotation?.sourceHash && (
                    <p className="g2-case__annotation-hash">
                      Anotação vinculada ao SHA-256{" "}
                      <code>{annotation.sourceHash}</code>
                      {source && annotation.sourceHash !== source.hash
                        ? " · a fonte aberta agora é diferente."
                        : !source
                          ? " · reabra a fonte para conferir."
                          : ""}
                    </p>
                  )}
                  <div className="g2-case__annotation-fields">
                    <label>
                      Referência na fonte
                      <input
                        type="text"
                        placeholder="Página, seção ou trecho"
                        value={annotation?.reference ?? ""}
                        onChange={(e) =>
                          updateAnnotation({ reference: e.target.value })
                        }
                      />
                    </label>
                    <label>
                      {isSolar
                        ? "Natureza da alegação"
                        : "Resultado da leitura"}
                      <select
                        value={annotation?.nature ?? ""}
                        onChange={(e) =>
                          updateAnnotation({ nature: e.target.value })
                        }
                      >
                        <option value="">Não classificada</option>
                        {(isSolar
                          ? [...NATUREZAS_SOLAR]
                          : [
                              "apoia a hipótese",
                              "contradiz a hipótese",
                              "evidência insuficiente",
                              "requer verificação",
                            ]
                        ).map((n) => (
                          <option key={n} value={n}>
                            {n}
                          </option>
                        ))}
                      </select>
                    </label>
                  </div>
                  <label className="g2-case__note-label">
                    Anotação do analista <span>LOCAL · NÃO VERIFICADA</span>
                    <textarea
                      rows={3}
                      placeholder="Registre o que a fonte permite afirmar — e o que ainda não permite."
                      value={annotation?.note ?? ""}
                      onChange={(e) =>
                        updateAnnotation({ note: e.target.value })
                      }
                    />
                  </label>
                </section>
              )}
            </>
          )}
          {tab === "questions" && (
            <section className="g2-case__questions">
              <span className="g2-ops__eyebrow">
                CONTRADITÓRIO / EXAME DA PREMISSA
              </span>
              <h2>
                O que faria esta
                <br />
                <em>conclusão mudar?</em>
              </h2>
              <p className="g2-case__lede">
                Uma boa análise precisa suportar a hipótese contrária. As
                perguntas abaixo orientam a leitura; não são achados deste caso.
              </p>
              <ol>
                {(isSolar
                  ? [
                      "A economia prometida resiste a outras trajetórias tarifárias?",
                      "Que fonte sustenta a geração estimada e suas perdas?",
                      "Quais custos ou limites não aparecem na proposta?",
                    ]
                  : isDiagnostic
                    ? [
                        "O aumento decorre de consumo, tarifa, demanda ou outra variável?",
                        "O relato se confirma em mais de um ciclo de faturamento?",
                        "Que documento eliminaria uma das hipóteses?",
                      ]
                    : [
                        "A variação de custo acompanha a variação de consumo?",
                        "Demanda contratada e medida foram comparadas no mesmo período?",
                        "O que ainda falta verificar antes de recomendar uma mudança?",
                      ]
                ).map((q, i) => (
                  <li key={q}>
                    <span>0{i + 1}</span>
                    {q}
                  </li>
                ))}
              </ol>
              <label className="g2-case__note-label">
                Contrapontos e diligências <span>RASCUNHO LOCAL</span>
                <textarea
                  rows={7}
                  placeholder="Registre hipóteses alternativas, evidências contrárias e documentos que faltam."
                  value={draft.questions}
                  onChange={(e) => updateDraft({ questions: e.target.value })}
                />
              </label>
            </section>
          )}
          {tab === "opinion" && (
            <section className="g2-case__opinion">
              <span className="g2-ops__eyebrow">PARECER / RASCUNHO LOCAL</span>
              <h2>
                A verdade vem antes
                <br />
                da recomendação.
              </h2>
              <p>
                Separe observação, premissa e conclusão. Explicite os limites da
                análise e cite a evidência que sustenta cada afirmação.
              </p>
              <div className="g2-case__opinion-status">
                <span>
                  {source ? "1 fonte local aberta" : "Fonte documental ausente"}
                </span>
                <span>{documented} anotações locais</span>
                <span>
                  {draft.questions.trim()
                    ? "Contrapontos registrados"
                    : "Contrapontos ainda não registrados"}
                </span>
              </div>
              <label className="g2-case__note-label">
                Texto do parecer
                <textarea
                  className="g2-case__opinion-text"
                  rows={14}
                  placeholder="Objeto da análise\n\nEvidências examinadas\n\nPremissas e método\n\nContrapontos e limitações\n\nConclusão — inclusive quando não há evidência suficiente para concluir."
                  value={draft.text}
                  onChange={(e) => updateDraft({ text: e.target.value })}
                />
              </label>
              <p className="g2-case__opinion-disclaimer">
                Este texto é um rascunho experimental. Não será entregue ao
                cliente e não altera o estado do pedido.
              </p>
            </section>
          )}
          {tab === "activity" && (
            <section className="g2-case__activity">
              <span className="g2-ops__eyebrow">HISTÓRICO LOCAL</span>
              <h2>O percurso da leitura.</h2>
              <p>
                Registro desta sessão, exportável junto do caderno. Não é uma
                trilha de auditoria do servidor.
              </p>
              <ol>
                <li>
                  <span>{formatarData(pedido.criadoEm)}</span>
                  <p>Pedido presente na amostra ilustrativa.</p>
                </li>
                {(FIO_MOCK[pedido.id] ?? []).map((m) => (
                  <li key={m.id}>
                    <span>
                      {m.role === "customer" ? "Cliente" : "NIVAR"} · amostra
                    </span>
                    <p>{m.body}</p>
                  </li>
                ))}
                {draft.history.map((h, i) => (
                  <li key={`${h.at}-${i}`}>
                    <span>
                      {new Date(h.at).toLocaleTimeString("pt-BR", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}{" "}
                      · local
                    </span>
                    <p>{h.action}</p>
                  </li>
                ))}
              </ol>
            </section>
          )}
          <footer className="g2-case__save">
            <div>
              <span>
                {dirty ? "ALTERAÇÕES LOCAIS NÃO SALVAS" : "CADERNO LOCAL"}
              </span>
              <p role="status">
                {saved ||
                  "Os documentos locais não são conservados ao sair. Exporte suas anotações antes de encerrar."}
              </p>
            </div>
            <button
              type="button"
              className="g2-ops__button g2-ops__button--dark"
              onClick={save}
            >
              <Save size={14} /> Salvar rascunho
            </button>
          </footer>
        </section>
      </div>
    </div>
  );
}
