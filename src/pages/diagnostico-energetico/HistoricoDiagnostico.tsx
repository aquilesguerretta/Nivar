import { formatarDataHora } from "../../components/g2/advisory-intake-format";
import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { ArrowRight, RefreshCw } from "lucide-react";
import { AuthError } from "../../lib/auth/authApi";
import {
  listarEscopos,
  type SubmissaoDiagnostico,
} from "../../lib/diagnostico/api";
import {
  abrirConversa,
  enviarMensagem,
  lerConversa,
  listarConversas,
  ORIGEM_DIAGNOSTICO,
  type Conversa,
  type Mensagem,
} from "../../lib/conversas/api";
import { ClientError } from "../../components/g2/AdvisoryIntakeTheme";

function message(error: unknown) {
  if (!(error instanceof AuthError))
    return "Não foi possível carregar o atendimento. Tente de novo.";
  switch (error.status) {
    case 0:
      return "Não foi possível falar com o servidor. Verifique a conexão.";
    case 401:
      return "A sessão expirou. Entre de novo para continuar.";
    case 403:
      return "Esta conversa não pertence a esta conta.";
    case 404:
      return "O atendimento não está disponível.";
    case 409:
      return "A conversa está encerrada. Atualize o atendimento para consultar o estado mais recente.";
    case 422:
      return "O servidor recusou a mensagem. Revise o texto e tente de novo.";
    default:
      return "Não foi possível concluir a operação. Tente de novo.";
  }
}

/** Real scope records and real case-linked correspondence. There is no operational event API. */
export function HistoricoDiagnostico({
  casoNovo,
}: {
  casoNovo?: SubmissaoDiagnostico | null;
}) {
  const id = useId();
  const [cases, setCases] = useState<SubmissaoDiagnostico[]>([]);
  const [selected, setSelected] = useState("");
  const [conversation, setConversation] = useState<Conversa | null>(null);
  const [messages, setMessages] = useState<readonly Mensagem[]>([]);
  const [loadingCases, setLoadingCases] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [casesFailed, setCasesFailed] = useState(false);
  const [messagesFailed, setMessagesFailed] = useState(false);
  const [sending, setSending] = useState(false);
  const [text, setText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [refresh, setRefresh] = useState(0);
  const [lastSent, setLastSent] = useState(false);
  const selectedRef = useRef(selected);
  const newId = casoNovo?.id;
  const current = cases.find((item) => item.id === selected) ?? null;
  const closed = conversation?.status === "closed";
  useEffect(() => {
    selectedRef.current = selected;
  }, [selected]);
  useEffect(() => {
    const controller = new AbortController();
    setLoadingCases(true);
    setCasesFailed(false);
    setError(null);
    void listarEscopos(controller.signal)
      .then(({ data }) => {
        if (controller.signal.aborted) return;
        setCases(data);
        setSelected((previous) =>
          newId && data.some((item) => item.id === newId)
            ? newId
            : data.some((item) => item.id === previous)
              ? previous
              : (data[0]?.id ?? ""),
        );
      })
      .catch((err) => {
        if (!controller.signal.aborted) {
          setCasesFailed(true);
          setError(message(err));
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoadingCases(false);
      });
    return () => controller.abort();
  }, [newId, refresh]);
  useEffect(() => {
    const controller = new AbortController();
    setConversation(null);
    setMessages([]);
    setText("");
    setLastSent(false);
    setMessagesFailed(false);
    if (!selected) {
      setLoadingMessages(false);
      return () => controller.abort();
    }
    setLoadingMessages(true);
    // Opening a view never creates a conversation. The first explicit message does.
    void (async () => {
      try {
        const { data } = await listarConversas(controller.signal);
        const existing = data.find(
          (item) =>
            item.originKind === ORIGEM_DIAGNOSTICO &&
            item.originId === selected,
        );
        if (!existing) return;
        const full = await lerConversa(existing.id, controller.signal);
        if (controller.signal.aborted) return;
        setConversation(full);
        setMessages(full.messages ?? []);
      } catch (err) {
        if (!controller.signal.aborted) {
          setMessagesFailed(true);
          setError(message(err));
        }
      } finally {
        if (!controller.signal.aborted) setLoadingMessages(false);
      }
    })();
    return () => controller.abort();
  }, [selected, refresh]);
  async function respond(event: FormEvent) {
    event.preventDefault();
    const body = text.trim();
    if (
      !body ||
      !current ||
      sending ||
      loadingMessages ||
      messagesFailed ||
      closed
    )
      return;
    const caseId = current.id;
    setError(null);
    setSending(true);
    setLastSent(false);
    try {
      if (conversation) {
        const sent = await enviarMensagem(conversation.id, body);
        if (selectedRef.current === caseId)
          setMessages((previous) => [...previous, sent]);
      } else {
        const created = await abrirConversa({
          productId: "diagnostico-energetico",
          origem: { kind: ORIGEM_DIAGNOSTICO, id: caseId },
        });
        if (selectedRef.current === caseId) {
          setConversation(created);
          setMessages(created.messages ?? []);
        }
        // The origin may have been opened by another session after our GET.
        // A reused conversation ignores an opening body, so send through the
        // message endpoint after resolving the id in either case.
        const sent = await enviarMensagem(created.id, body);
        if (selectedRef.current === caseId)
          setMessages((previous) => [...previous, sent]);
      }
      if (selectedRef.current === caseId) {
        setText("");
        setLastSent(true);
      }
    } catch (err) {
      if (!(err instanceof Error && err.name === "AbortError"))
        setError(message(err));
    } finally {
      setSending(false);
    }
  }
  return (
    <section
      id="acompanhamento"
      className="g23-client-history"
      aria-label="Acompanhamento dos seus diagnósticos"
    >
      <div className="g23-client-history__header">
        <div>
          <span className="g2-mono">02 / SEUS ATENDIMENTOS</span>
          <h2>
            O contexto continua
            <br />
            <em>na conversa.</em>
          </h2>
        </div>
        <button
          type="button"
          className="g23-client-link"
          onClick={() => setRefresh((value) => value + 1)}
          disabled={loadingCases || loadingMessages || sending}
        >
          <RefreshCw size={14} aria-hidden="true" /> Atualizar
        </button>
      </div>
      {error && <ClientError>{error}</ClientError>}
      {loadingCases ? (
        <p role="status" className="g23-client-empty">
          Consultando seus escopos…
        </p>
      ) : casesFailed && cases.length === 0 ? (
        <p className="g23-client-empty">
          Seus escopos não puderam ser consultados. Use Atualizar para tentar
          novamente.
        </p>
      ) : cases.length === 0 ? (
        <div className="g23-client-empty">
          <p>Nenhum escopo recebido por esta conta.</p>
          <p>
            Depois do primeiro envio, o registro e a conversa aparecem aqui.
            Nenhum avanço de análise é presumido.
          </p>
        </div>
      ) : (
        <div className="g23-client-history__grid">
          <div>
            <div className="g23-case-select">
              <label htmlFor={`${id}-case`}>Atendimento em exibição</label>
              <select
                id={`${id}-case`}
                value={selected}
                disabled={sending}
                onChange={(event) => {
                  setError(null);
                  setSelected(event.target.value);
                }}
              >
                {cases.map((item) => (
                  <option value={item.id} key={item.id}>
                    {item.sector} ·{" "}
                    {new Date(item.createdAt).toLocaleDateString("pt-BR")} ·{" "}
                    {item.id.slice(0, 8)}
                  </option>
                ))}
              </select>
            </div>
            {current && (
              <article className="g23-case-record">
                <span className="g2-mono">ESCOPO RECEBIDO</span>
                <h3>{current.sector}</h3>
                <dl>
                  <div>
                    <dt>Protocolo</dt>
                    <dd className="g23-client-mono">{current.id}</dd>
                  </div>
                  <div>
                    <dt>Recebido em</dt>
                    <dd>{formatarDataHora(current.createdAt)}</dd>
                  </div>
                  <div>
                    <dt>Consumo mensal</dt>
                    <dd>{current.monthlyConsumptionBand}</dd>
                  </div>
                  <div>
                    <dt>Modalidade</dt>
                    <dd>{current.tariffModality ?? "Não informada"}</dd>
                  </div>
                </dl>
                <p>{current.concern}</p>
                <small>
                  Este registro confirma o recebimento do escopo. As próximas
                  informações sobre o atendimento são comunicadas na conversa.
                </small>
              </article>
            )}
          </div>
          <div className="g23-messages">
            <h3>Conversa do atendimento.</h3>
            <div aria-live="polite">
              {loadingMessages ? (
                <p role="status" className="g23-client-empty">
                  Consultando a conversa…
                </p>
              ) : messagesFailed ? (
                <p className="g23-client-empty">
                  A conversa não pôde ser consultada. Atualize antes de
                  continuar.
                </p>
              ) : messages.length === 0 ? (
                <p className="g23-client-empty">
                  Nenhuma mensagem neste atendimento. Você pode acrescentar
                  contexto ou fazer uma pergunta abaixo.
                </p>
              ) : (
                messages.map((item) => (
                  <article
                    key={item.id}
                    className="g23-message"
                    data-author={
                      item.role === "customer" ? "customer" : "nivar"
                    }
                  >
                    <div>
                      <span>{item.role === "customer" ? "VOCÊ" : "NIVAR"}</span>
                      <time dateTime={item.createdAt}>
                        {formatarDataHora(item.createdAt)}
                      </time>
                    </div>
                    <p>{item.body}</p>
                  </article>
                ))
              )}
            </div>
            <form onSubmit={respond}>
              <div className="g23-scope-field">
                <label htmlFor={`${id}-message`}>Sua mensagem</label>
                <textarea
                  id={`${id}-message`}
                  rows={3}
                  maxLength={8000}
                  value={text}
                  disabled={
                    sending ||
                    loadingMessages ||
                    messagesFailed ||
                    closed ||
                    !current
                  }
                  onChange={(event) => {
                    setText(event.target.value);
                    setLastSent(false);
                  }}
                  placeholder="Acrescente contexto ou faça uma pergunta."
                  aria-describedby={`${id}-message-hint`}
                />
                <small id={`${id}-message-hint`}>
                  {closed
                    ? "Esta conversa está encerrada e permanece disponível para consulta."
                    : "A mensagem fica vinculada ao atendimento selecionado."}
                </small>
              </div>
              <div className="g23-client-actions">
                <button
                  type="submit"
                  className="g2-primary"
                  disabled={
                    !text.trim() ||
                    sending ||
                    loadingMessages ||
                    messagesFailed ||
                    closed ||
                    !current
                  }
                  aria-busy={sending || undefined}
                >
                  {sending ? "Enviando mensagem…" : "Enviar mensagem"}
                  <ArrowRight size={17} />
                </button>
                <span role="status">
                  {sending
                    ? "Aguarde a confirmação."
                    : lastSent
                      ? "Mensagem registrada."
                      : "Conversa com a NIVAR."}
                </span>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
