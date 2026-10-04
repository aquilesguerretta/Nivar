import { useEffect, useState, type ReactNode } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { ArrowUpRight, Download, LogOut } from "lucide-react";
import { DESTINOS_BR } from "../../lib/data/br-destinos";
import { useAuth } from "../../lib/auth/AuthContext";
import {
  listarEscopos,
  type SubmissaoDiagnostico,
} from "../../lib/diagnostico/api";
import type { ProductsResponse } from "../../lib/auth/authApi";
import {
  criarClienteSubmissoes,
  FLUXOS_SUBMISSAO,
  type Submissao,
} from "../../lib/submissoes/api";
import { ContaShell } from "./ContaShell";

const titleFor = (id: string) =>
  DESTINOS_BR.find((d) => d.id === id)?.titulo ??
  id
    .split("-")
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join(" ");
const dateFor = (value: string) => {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "Data não informada"
    : date.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      });
};
const VIEWS = [
  ["overview", "Sua identidade"],
  ["requests", "Análises e pedidos"],
  ["products", "Seus produtos"],
  ["security", "Acesso e segurança"],
] as const;

/** Production identity and data contracts are unchanged. No account fixtures or local credentials. */
export function PerfilPlataforma() {
  const { user, loading, logout, myProducts } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [view, setView] = useState<(typeof VIEWS)[number][0]>("overview");
  const [produtos, setProdutos] = useState<ProductsResponse | null>(null);
  const [erroProdutos, setErroProdutos] = useState(false);
  const [saindo, setSaindo] = useState(false);
  const [erroSaida, setErroSaida] = useState(false);
  const [submissoesPor, setSubmissoesPor] = useState<
    Record<string, Submissao[] | null>
  >({});
  const [erroSubmissoesPor, setErroSubmissoesPor] = useState<
    Record<string, boolean>
  >({});
  const [escopos, setEscopos] = useState<SubmissaoDiagnostico[] | null>(null);
  const [erroEscopos, setErroEscopos] = useState(false);
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    if (!user) return;
    const ctrl = new AbortController();
    myProducts(ctrl.signal)
      .then((r) => {
        if (!ctrl.signal.aborted) {
          setProdutos(r);
          setErroProdutos(false);
        }
      })
      .catch((err: unknown) => {
        if (
          !ctrl.signal.aborted &&
          !(err instanceof Error && err.name === "AbortError")
        )
          setErroProdutos(true);
      });
    return () => ctrl.abort();
  }, [user, myProducts, retry]);
  useEffect(() => {
    if (!user) return;
    const ctrl = new AbortController();
    for (const fluxo of FLUXOS_SUBMISSAO) {
      if (!fluxo.aoVivo) continue;
      criarClienteSubmissoes(fluxo.prefixo)
        .listar(ctrl.signal)
        .then((r) => {
          if (!ctrl.signal.aborted) {
            setSubmissoesPor((s) => ({ ...s, [fluxo.productId]: r.data }));
            setErroSubmissoesPor((s) => ({ ...s, [fluxo.productId]: false }));
          }
        })
        .catch((err: unknown) => {
          if (
            !ctrl.signal.aborted &&
            !(err instanceof Error && err.name === "AbortError")
          )
            setErroSubmissoesPor((s) => ({ ...s, [fluxo.productId]: true }));
        });
    }
    return () => ctrl.abort();
  }, [user, retry]);
  useEffect(() => {
    if (!user) return;
    const ctrl = new AbortController();
    listarEscopos(ctrl.signal)
      .then((r) => {
        if (!ctrl.signal.aborted) {
          setEscopos(r.data);
          setErroEscopos(false);
        }
      })
      .catch((err: unknown) => {
        if (
          !ctrl.signal.aborted &&
          !(err instanceof Error && err.name === "AbortError")
        )
          setErroEscopos(true);
      });
    return () => ctrl.abort();
  }, [user, retry]);

  async function aoSair() {
    setSaindo(true);
    setErroSaida(false);
    try {
      await logout();
      navigate("/br", { replace: true });
    } catch {
      setErroSaida(true);
    } finally {
      setSaindo(false);
    }
  }

  if (loading)
    return (
      <ContaShell
        eyebrow="Conta NIVAR"
        titulo="Encontrando seu lugar."
        largura="prancha"
      >
        <p role="status">Verificando sua sessão…</p>
      </ContaShell>
    );
  // AuthProvider clears its local user even if logout fails. Keep the failure
  // visible here: only the server can confirm deletion of the httpOnly cookie.
  if (!user && (saindo || erroSaida))
    return (
      <ContaShell
        eyebrow="Conta NIVAR"
        titulo="Encerrar sua sessão."
        largura="prancha"
      >
        {erroSaida ? (
          <div className="g2-account__empty" role="alert">
            <p>
              O servidor não confirmou o encerramento da sessão. Seu acesso pode
              continuar ativo neste navegador.
            </p>
            <button
              type="button"
              className="conta-botao"
              style={{ width: "auto" }}
              onClick={aoSair}
            >
              Tentar sair novamente
            </button>
          </div>
        ) : (
          <p role="status">Encerrando a sessão…</p>
        )}
      </ContaShell>
    );
  if (!user)
    return <Navigate to="/entrar" replace state={{ de: location.pathname }} />;
  const activated = new Map(
    (produtos?.products ?? []).map((p) => [p.productId, p.activatedAt]),
  );
  const retryAction = () => setRetry((n) => n + 1);

  return (
    <ContaShell
      eyebrow="Seu lugar na NIVAR"
      titulo={`Olá, ${user.name.split(" ")[0]}.`}
      subtitulo="O que você acompanha, aprende e examina começa aqui."
      largura="prancha"
    >
      <div className="g2-account__profile-grid">
        <nav className="g2-account__profile-nav" aria-label="Seções da conta">
          {VIEWS.map(([id, title]) => (
            <button
              key={id}
              type="button"
              aria-current={view === id ? "true" : undefined}
              onClick={() => setView(id)}
            >
              {title}
            </button>
          ))}
          <p>
            Uma conta de plataforma.
            <br />O mesmo acesso em cada produto.
          </p>
        </nav>
        <div>
          {view === "overview" && (
            <>
              <section className="g2-account__profile-section">
                <h2>Sua identidade</h2>
                <Facts
                  items={[
                    ["Nome", user.name],
                    ["Email", user.email],
                    ["Membro desde", dateFor(user.createdAt)],
                    ["Última atualização", dateFor(user.updatedAt)],
                  ]}
                />
                <p>
                  Estes são os dados da sua conta. A edição de nome e email
                  ainda não está disponível.
                </p>
              </section>
              <section className="g2-account__profile-section">
                <h2>Continue a investigação.</h2>
                <ul className="g2-account__product-list">
                  <li>
                    <div>
                      <strong>Acompanhar uma análise</strong>
                      <p>Seus arquivos enviados, escopos e pareceres.</p>
                    </div>
                    <button
                      type="button"
                      className="conta-botao"
                      style={{ width: "auto" }}
                      onClick={() => setView("requests")}
                    >
                      Ver pedidos
                    </button>
                  </li>
                  <li>
                    <div>
                      <strong>Explorar seus produtos</strong>
                      <p>
                        {produtos
                          ? `${activated.size} de ${produtos.catalog.length} produtos ativados.`
                          : "O catálogo aparece assim que a consulta terminar."}
                      </p>
                    </div>
                    <button
                      type="button"
                      className="conta-botao"
                      style={{ width: "auto" }}
                      onClick={() => setView("products")}
                    >
                      Ver produtos
                    </button>
                  </li>
                </ul>
              </section>
            </>
          )}
          {view === "products" && (
            <section className="g2-account__profile-section">
              <h2>Seus produtos</h2>
              <p>
                Cada produto é ativado quando você o acessa. A lista abaixo
                acompanha o catálogo da sua conta.
              </p>
              {erroProdutos ? (
                <ReadError onRetry={retryAction} />
              ) : !produtos ? (
                <p role="status">Consultando seus produtos…</p>
              ) : (
                <ul className="g2-account__product-list">
                  {produtos.catalog.map((id) => {
                    const destino = DESTINOS_BR.find((d) => d.id === id);
                    const at = activated.get(id);
                    return (
                      <li key={id}>
                        <div>
                          <strong>{titleFor(id)}</strong>
                          <span className="g2-account__state">
                            {at ? "ATIVADO" : "AINDA NÃO ATIVADO"}
                          </span>
                          <p>
                            {at
                              ? `Desde ${dateFor(at)}`
                              : "Ativa no primeiro acesso."}
                          </p>
                        </div>
                        {destino?.status === "disponivel" && destino.rota ? (
                          <Link className="conta-link" to={destino.rota}>
                            Abrir <ArrowUpRight size={15} />
                          </Link>
                        ) : (
                          <span className="g2-account__state">
                            Acesso em preparação
                          </span>
                        )}
                      </li>
                    );
                  })}
                </ul>
              )}
            </section>
          )}
          {view === "requests" && (
            <>
              <section className="g2-account__profile-section">
                <h2>Análises e pedidos</h2>
                <p>
                  Cada envio conserva seu protocolo. Quando houver um parecer
                  disponível, o documento aparece junto da solicitação.
                </p>
              </section>
              {FLUXOS_SUBMISSAO.map((flow) => {
                const items = submissoesPor[flow.productId] ?? null;
                return (
                  <section
                    className="g2-account__profile-section"
                    key={flow.productId}
                  >
                    <h2>{titleFor(flow.productId)}</h2>
                    {!flow.aoVivo ? (
                      <div className="g2-account__empty">
                        O envio deste produto ainda não está aberto.
                      </div>
                    ) : erroSubmissoesPor[flow.productId] ? (
                      <ReadError onRetry={retryAction} />
                    ) : items === null ? (
                      <p role="status">Consultando envios…</p>
                    ) : items.length === 0 ? (
                      <div className="g2-account__empty">
                        {flow.copy.vazioCorpo}
                        <br />
                        <Link className="conta-link" to={flow.rotaEnvio}>
                          {flow.copy.vazioCta} <ArrowUpRight size={13} />
                        </Link>
                      </div>
                    ) : (
                      items.map((item) => (
                        <Submission
                          key={item.id}
                          item={item}
                          reading={flow.copy.emLeitura}
                        />
                      ))
                    )}
                  </section>
                );
              })}
              <section className="g2-account__profile-section">
                <h2>Diagnóstico Energético</h2>
                {erroEscopos ? (
                  <ReadError onRetry={retryAction} />
                ) : escopos === null ? (
                  <p role="status">Consultando escopos…</p>
                ) : escopos.length === 0 ? (
                  <div className="g2-account__empty">
                    Nenhum escopo aberto por esta conta. Conte o que acontece na
                    sua operação para começar.
                    <br />
                    <Link className="conta-link" to="/diagnostico-energetico">
                      Abrir um diagnóstico <ArrowUpRight size={13} />
                    </Link>
                  </div>
                ) : (
                  escopos.map((scope) => (
                    <article className="g2-account__request" key={scope.id}>
                      <div className="g2-account__request-head">
                        <h3>{scope.sector}</h3>
                        <span>{dateFor(scope.createdAt)}</span>
                      </div>
                      <Facts
                        items={[
                          ["Protocolo", scope.id],
                          ["Consumo mensal", scope.monthlyConsumptionBand],
                          [
                            "Modalidade",
                            scope.tariffModality ?? "Não informada",
                          ],
                        ]}
                      />
                      <p>{scope.concern}</p>
                      <Link className="conta-link" to="/diagnostico-energetico">
                        Abrir acompanhamento <ArrowUpRight size={15} />
                      </Link>
                    </article>
                  ))
                )}
              </section>
            </>
          )}
          {view === "security" && (
            <>
              <section className="g2-account__profile-section">
                <h2>Acesso e segurança</h2>
                <Facts
                  items={[
                    [
                      "Método de acesso",
                      user.authMethods
                        .map((m) => (m === "password" ? "Email e senha" : m))
                        .join(", "),
                    ],
                    ["Email da conta", user.email],
                  ]}
                />
                <p>
                  Sua sessão permanece ativa neste navegador até você sair ou
                  ela expirar. Alteração e recuperação de senha ainda não estão
                  disponíveis.
                </p>
                <div className="g2-account__logout">
                  <button
                    type="button"
                    onClick={aoSair}
                    disabled={saindo}
                    className="conta-botao"
                  >
                    <LogOut size={14} style={{ marginRight: 9 }} />
                    {saindo ? "Saindo…" : "Sair da conta"}
                  </button>
                  <p>Encerra a sessão deste navegador.</p>
                </div>
              </section>
              <section className="g2-account__profile-section">
                <h2>Assinatura</h2>
                <div className="g2-account__empty">
                  Não há plano de assinatura ou cobrança na plataforma neste
                  momento. Seu acesso aos produtos abertos não depende de
                  pagamento.
                </div>
              </section>
            </>
          )}
        </div>
      </div>
    </ContaShell>
  );
}
function Facts({ items }: { items: [string, ReactNode][] }) {
  return (
    <dl className="g2-account__facts">
      {items.map(([label, value]) => (
        <div key={label}>
          <dt>{label}</dt>
          <dd>{value}</dd>
        </div>
      ))}
    </dl>
  );
}
function ReadError({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="g2-account__empty" role="alert">
      Não foi possível consultar estes dados. A ausência de resposta não
      significa que não há registros.
      <br />
      <button
        className="conta-botao"
        type="button"
        style={{ width: "auto", marginTop: 16 }}
        onClick={onRetry}
      >
        Tentar novamente
      </button>
    </div>
  );
}
function Submission({ item, reading }: { item: Submissao; reading: string }) {
  const ready = item.status === "ready" && item.deliverable !== null;
  return (
    <article className="g2-account__request">
      <div className="g2-account__request-head">
        <h3>{item.source.filename}</h3>
        <span>{ready ? "PARECER PRONTO" : "EM LEITURA"}</span>
      </div>
      <Facts
        items={[
          ["Protocolo", item.id],
          ["Enviado em", dateFor(item.createdAt)],
          [
            "SHA-256 da fonte",
            <span style={{ fontFamily: "var(--g2-mono)", fontSize: 10 }}>
              {item.source.sha256 || "Não informado"}
            </span>,
          ],
        ]}
      />
      {ready && item.deliverable ? (
        <>
          <p>
            {item.deliveredAt
              ? `Parecer disponibilizado em ${dateFor(item.deliveredAt)}.`
              : "Parecer disponível; data de entrega não informada."}
          </p>
          <a
            className="conta-link"
            href={item.deliverable.downloadUrl}
            download={item.deliverable.filename}
          >
            <Download size={15} /> {item.deliverable.filename}{" "}
            <span>
              ({Math.max(1, Math.round(item.deliverable.sizeBytes / 1024))} KB)
            </span>
          </a>
        </>
      ) : (
        <p>{reading}</p>
      )}
    </article>
  );
}
export default PerfilPlataforma;
