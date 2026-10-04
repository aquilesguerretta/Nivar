import { useId, useRef, useState, type FormEvent, type ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  FileText,
  Upload,
  X,
} from "lucide-react";
import { NivarShell, SectionLabel } from "./NivarShell";
import { useAuth } from "../../lib/auth/AuthContext";
import { AuthError } from "../../lib/auth/authApi";
import {
  criarClienteSubmissoes,
  FLUXOS_SUBMISSAO,
  type Submissao,
} from "../../lib/submissoes/api";
import { DESTINOS_BR } from "../../lib/data/br-destinos";
import "./advisory-intake.css";
import { formatarDataHora, formatarTamanho } from "./advisory-intake-format";

export interface AdvisoryProductDescription {
  id: string;
  title: string;
  headline: ReactNode;
  description: string;
  purpose: string;
  input: string;
  output: string;
  scope: readonly [string, string][];
  preparation: string;
}

export function AdvisoryProductFrame({
  product,
  children,
}: {
  product: AdvisoryProductDescription;
  children: ReactNode;
}) {
  const { user } = useAuth();
  const available =
    DESTINOS_BR.find((item) => item.id === product.id)?.status === "disponivel";
  return (
    <NivarShell family="advisory" title={product.title}>
      <div className="g23-product g2-container" data-product={product.id}>
        <nav
          className="g23-product__breadcrumb"
          aria-label="Localização do produto"
        >
          <Link to="/br/advisory">
            <ArrowLeft size={13} /> Advisory
          </Link>
          <span>/</span>
          <span>{product.title}</span>
        </nav>
        <section
          className="g23-product__hero"
          aria-labelledby="advisory-product-title"
        >
          <div className="g23-product__opening">
            <span className="g2-eyebrow">
              NIVAR ADVISORY / EXAME INDEPENDENTE
            </span>
            <h1 id="advisory-product-title">{product.title}</h1>
            <h2>{product.headline}</h2>
            <p className="g2-lead">{product.description}</p>
            <p className="g23-product__purpose">{product.purpose}</p>
            <div className="g23-product__availability">
              <span className="g2-mono">
                {available
                  ? "ENVIO DISPONÍVEL"
                  : "ABERTURA PÚBLICA EM PREPARAÇÃO"}
              </span>
              <p>
                {available
                  ? "Leitura humana. Sem cobrança na etapa de envio."
                  : product.preparation}
              </p>
            </div>
            <a
              className="g2-text-link g23-product__start"
              href={user ? "#envio" : "#acesso"}
            >
              {available
                ? user
                  ? "Preparar meu envio"
                  : "Continuar com minha conta"
                : user
                  ? "Consultar a área da conta"
                  : "Consultar disponibilidade"}
              <ArrowRight size={16} />
            </a>
          </div>
          <aside className="g23-product__object" aria-label="Escopo do exame">
            <div className="g23-product__object-top">
              <span className="g2-mono">O QUE ENTRA NO EXAME</span>
              <FileText size={20} aria-hidden="true" />
            </div>
            <h3>{product.input}</h3>
            <div className="g23-product__scope">
              {product.scope.map(([label, detail], i) => (
                <div key={label}>
                  <span className="g2-mono">0{i + 1}</span>
                  <div>
                    <strong>{label}</strong>
                    <p>{detail}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="g23-product__object-output">
              <ArrowDownMark />
              <div>
                <span className="g2-mono">O QUE VOCÊ RECEBE</span>
                <p>{product.output}</p>
              </div>
            </div>
            <span className="g23-product__object-note">
              Fonte, premissa e limite acompanham a leitura.
            </span>
          </aside>
        </section>
        {children}
        <section className="g23-product__method">
          <SectionLabel>Independência por construção</SectionLabel>
          <div>
            <h2>
              Seu documento.
              <br />
              <em>Seu poder de decisão.</em>
            </h2>
            <p>
              A NIVAR não vende energia, não intermedeia contratos e não recebe
              comissão pela conclusão. O parecer pode confirmar uma hipótese,
              contrariá-la ou reconhecer que ainda falta evidência.
            </p>
          </div>
          <Link className="g2-text-link" to="/br/metodo">
            Conhecer o método da casa <ArrowRight size={17} />
          </Link>
        </section>
      </div>
    </NivarShell>
  );
}

function ArrowDownMark() {
  return (
    <span className="g23-product__down" aria-hidden="true">
      ↓
    </span>
  );
}

export function AdvisoryAccess({
  productId,
  action,
}: {
  productId: string;
  action: string;
}) {
  const { loading } = useAuth();
  const location = useLocation();
  const available =
    DESTINOS_BR.find((item) => item.id === productId)?.status === "disponivel";
  return (
    <section
      id="acesso"
      className="g23-product__access"
      aria-label="Acesso do cliente"
    >
      <div>
        <span className="g2-mono">
          {available ? "CONTINUE COM SUA CONTA" : "ESTADO DO PRODUTO"}
        </span>
        <h2>
          {available
            ? "Um envio. Um registro seu."
            : "Uma leitura cuidadosa começa pelo escopo certo."}
        </h2>
        <p>
          {available
            ? "A conta mantém seu documento e o parecer no mesmo lugar. Entre ou crie sua conta para continuar."
            : "A abertura pública está em preparação. Os requisitos e limites já podem ser consultados aqui; quem tem um atendimento em andamento pode acompanhá-lo pela conta."}
        </p>
      </div>
      <div>
        {loading ? (
          <p role="status">Verificando sua sessão…</p>
        ) : (
          <Link
            className="g2-primary"
            to={available ? "/entrar" : "/conta"}
            state={available ? { de: location.pathname } : undefined}
          >
            {available ? action : "Acompanhar meus atendimentos"}
            <ArrowUpRight size={18} />
          </Link>
        )}
        <Link className="g2-text-link" to="/br/advisory">
          Ver outros produtos Advisory <ArrowRight size={16} />
        </Link>
      </div>
    </section>
  );
}

export function AdvisoryPreparationNotice({
  productId,
}: {
  productId: string;
}) {
  const available =
    DESTINOS_BR.find((item) => item.id === productId)?.status === "disponivel";
  return available ? null : (
    <div className="g23-product__account-notice">
      <span className="g2-mono">ÁREA DA SUA CONTA</span>
      <p>
        A abertura pública deste produto está em preparação. O fluxo de envio
        existente continua disponível nesta área; a confirmação só aparece
        quando o recebimento for registrado.
      </p>
    </div>
  );
}

export function ClientError({ children }: { children: ReactNode }) {
  return (
    <div className="g23-client-error" role="alert">
      <span aria-hidden="true">×</span>
      <p>{children}</p>
    </div>
  );
}

const ACCEPT = "application/pdf,image/jpeg,image/png,image/webp";
const CLIENTS = new Map(
  FLUXOS_SUBMISSAO.map((flow) => [
    flow.productId,
    criarClienteSubmissoes(flow.prefixo),
  ]),
);
function uploadError(error: unknown): string {
  if (!(error instanceof AuthError))
    return "Algo falhou do nosso lado. Tente de novo em instantes.";
  switch (error.status) {
    case 0:
      return "Não foi possível falar com o servidor. Verifique a conexão.";
    case 401:
      return "A sessão expirou. Entre de novo para enviar.";
    case 403:
      return "O produto não está ativo nesta conta. Recarregue a página e tente de novo.";
    case 413:
      return "Arquivo grande demais. O limite é 15 MB.";
    case 415:
      return "O servidor não reconheceu o formato. Envie PDF, JPG, PNG ou WEBP.";
    case 502:
      return "O aviso à equipe de análise falhou e o envio não foi registrado. Tente de novo em instantes.";
    case 503:
      return "Não foi possível receber o documento agora. O arquivo continua selecionado; tente novamente em instantes.";
    default:
      return "Algo falhou do nosso lado. Tente de novo em instantes.";
  }
}

/** The two document products retain one-file multipart, entitlement-before-POST and server-confirmed receipts. */
export function AdvisoryDocumentIntake({
  product,
  fileLabel,
  fileHint,
}: {
  product: AdvisoryProductDescription;
  fileLabel: string;
  fileHint: string;
}) {
  const { user, loading, myProducts, activateProduct } = useAuth();
  const location = useLocation();
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [fileInvalid, setFileInvalid] = useState(false);
  const [sending, setSending] = useState(false);
  const [receipt, setReceipt] = useState<Submissao | null>(null);
  const [dragging, setDragging] = useState(false);
  const fileId = useId();
  const input = useRef<HTMLInputElement>(null);
  const picker = useRef<HTMLButtonElement>(null);
  const receiptHeading = useRef<HTMLHeadingElement>(null);
  const solar = product.id === "solar-proposal-validator";
  function selectFile(next: File | null) {
    setError(null);
    setFileInvalid(false);
    if (next && !ACCEPT.split(",").includes(next.type)) {
      setFile(null);
      setError("Formato não aceito. Envie PDF, JPG, PNG ou WEBP.");
      setFileInvalid(true);
      if (input.current) input.current.value = "";
      return;
    }
    setFile(next);
  }
  function reset() {
    setFile(null);
    setError(null);
    setFileInvalid(false);
    setReceipt(null);
    if (input.current) input.current.value = "";
  }
  async function send(event: FormEvent) {
    event.preventDefault();
    if (!file || sending || !user || loading) return;
    setError(null);
    setSending(true);
    try {
      const { products } = await myProducts();
      if (!products.some((item) => item.productId === product.id))
        await activateProduct(product.id);
      const client = CLIENTS.get(product.id);
      if (!client) throw new Error("Fluxo de envio não registrado");
      const created = await client.enviar(file);
      setReceipt(created);
      window.requestAnimationFrame(() => receiptHeading.current?.focus());
    } catch (err) {
      if (!(err instanceof Error && err.name === "AbortError")) {
        setError(uploadError(err));
        setFileInvalid(
          err instanceof AuthError &&
            (err.status === 413 || err.status === 415),
        );
      }
    } finally {
      setSending(false);
    }
  }
  return (
    <AdvisoryProductFrame product={product}>
      {!user ? (
        <AdvisoryAccess
          productId={product.id}
          action={
            solar ? "Entrar para enviar proposta" : "Entrar para enviar fatura"
          }
        />
      ) : (
        <section
          className="g23-product__intake"
          id="envio"
          aria-label={solar ? "Envio da proposta" : "Envio da fatura"}
        >
          <AdvisoryPreparationNotice productId={product.id} />
          <div className="g23-product__section-heading">
            <span className="g2-mono">
              01 / {receipt ? "REGISTRO DO ENVIO" : "SEU DOCUMENTO"}
            </span>
            <span className="g2-mono">
              {receipt
                ? "RECEBIMENTO CONFIRMADO"
                : "PDF · JPG · PNG · WEBP / ATÉ 15 MB"}
            </span>
          </div>
          {receipt ? (
            <div className="g23-receipt">
              <div>
                <span className="g23-receipt__mark" aria-hidden="true">
                  ↳
                </span>
                <h2 ref={receiptHeading} tabIndex={-1}>
                  {solar ? "Proposta recebida." : "Fatura recebida."}
                </h2>
                <p>
                  O registro abaixo foi confirmado pelo servidor. O parecer
                  ficará na sua conta, com aviso por email quando a leitura
                  terminar.
                </p>
              </div>
              <div>
                <dl>
                  <div>
                    <dt>Documento</dt>
                    <dd>
                      {receipt.source.filename}
                      <small>{formatarTamanho(receipt.source.sizeBytes)}</small>
                    </dd>
                  </div>
                  <div>
                    <dt>Protocolo</dt>
                    <dd className="g23-client-mono">{receipt.id}</dd>
                  </div>
                  <div>
                    <dt>Recebido em</dt>
                    <dd>{formatarDataHora(receipt.createdAt)}</dd>
                  </div>
                  <div>
                    <dt>Estado</dt>
                    <dd>
                      {receipt.status === "ready"
                        ? "Parecer pronto"
                        : "Recebido para leitura humana"}
                    </dd>
                  </div>
                </dl>
                <div className="g23-client-actions">
                  <Link className="g2-primary" to="/conta">
                    Acompanhar na minha conta <ArrowUpRight size={17} />
                  </Link>
                  <button
                    className="g23-client-link"
                    type="button"
                    onClick={reset}
                  >
                    Enviar {solar ? "outra proposta" : "outra fatura"}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="g23-product__form-layout">
              <div className="g23-product__form-intro">
                <h2>
                  Comece pelo
                  <br />
                  <em>documento completo.</em>
                </h2>
                <p>{fileHint}</p>
                <dl>
                  <div>
                    <dt>Quem examina</dt>
                    <dd>Uma pessoa da NIVAR.</dd>
                  </div>
                  <div>
                    <dt>O que acontece depois</dt>
                    <dd>
                      O parecer volta à sua conta com os limites da leitura.
                    </dd>
                  </div>
                  <div>
                    <dt>O que não prometemos</dt>
                    <dd>Economia garantida ou conclusão automática.</dd>
                  </div>
                </dl>
              </div>
              <form onSubmit={send} noValidate className="g23-document-form">
                <label className="g23-client-label" htmlFor={fileId}>
                  {fileLabel}
                  <span>Obrigatório · um arquivo por envio</span>
                </label>
                <div
                  className={`g23-document-drop${dragging ? " is-dragging" : ""}${file ? " has-file" : ""}`}
                  onDragOver={(event) => {
                    event.preventDefault();
                    if (!sending) setDragging(true);
                  }}
                  onDragLeave={() => setDragging(false)}
                  onDrop={(event) => {
                    event.preventDefault();
                    setDragging(false);
                    if (!sending)
                      selectFile(event.dataTransfer.files[0] ?? null);
                  }}
                >
                  <Upload size={25} aria-hidden="true" />
                  <strong>
                    {file
                      ? "Documento selecionado"
                      : "Selecione ou arraste seu documento"}
                  </strong>
                  <p>PDF, JPG, PNG ou WEBP. Até 15 MB.</p>
                  <input
                    ref={input}
                    id={fileId}
                    className="g23-document-input"
                    type="file"
                    tabIndex={-1}
                    accept={ACCEPT}
                    disabled={sending}
                    onChange={(event) =>
                      selectFile(event.target.files?.[0] ?? null)
                    }
                    aria-describedby={`${fileId}-hint${error ? ` ${fileId}-error` : ""}`}
                    aria-invalid={fileInvalid || undefined}
                  />
                  <button
                    ref={picker}
                    type="button"
                    className="g23-document-picker"
                    disabled={sending}
                    onClick={() => input.current?.click()}
                    aria-controls={fileId}
                    aria-describedby={`${fileId}-hint${error ? ` ${fileId}-error` : ""}`}
                  >
                    {file ? "Trocar documento" : "Selecionar documento"}
                  </button>
                </div>
                <p id={`${fileId}-hint`} className="g23-client-hint">
                  O arquivo fica nesta página até você confirmar o envio.
                </p>
                {file && (
                  <div className="g23-document-record">
                    <FileText size={22} aria-hidden="true" />
                    <div>
                      <strong title={file.name}>{file.name}</strong>
                      <span>
                        {formatarTamanho(file.size)} ·{" "}
                        {file.type.split("/")[1].toUpperCase()}
                      </span>
                    </div>
                    <button
                      type="button"
                      aria-label="Remover arquivo selecionado"
                      disabled={sending}
                      onClick={() => {
                        selectFile(null);
                        if (input.current) input.current.value = "";
                        picker.current?.focus();
                      }}
                    >
                      <X size={17} />
                    </button>
                  </div>
                )}
                {error && (
                  <div id={`${fileId}-error`}>
                    <ClientError>{error}</ClientError>
                    {error.startsWith("A sessão") && (
                      <Link
                        className="g23-client-link"
                        to="/entrar"
                        state={{ de: location.pathname }}
                      >
                        Entrar novamente
                      </Link>
                    )}
                  </div>
                )}
                <div className="g23-client-actions">
                  <button
                    type="submit"
                    className="g2-primary"
                    disabled={!file || sending || loading}
                    aria-busy={sending || undefined}
                  >
                    {sending
                      ? "Enviando documento…"
                      : solar
                        ? "Enviar proposta"
                        : "Enviar para análise"}
                    <ArrowRight size={17} aria-hidden="true" />
                  </button>
                  <span role="status">
                    {sending
                      ? "Aguarde a confirmação do recebimento."
                      : "Sem cobrança nesta etapa."}
                  </span>
                </div>
              </form>
            </div>
          )}
        </section>
      )}
      <section className="g23-product__journey">
        <SectionLabel number="02">Do envio ao parecer</SectionLabel>
        <ol>
          {[
            [
              "O documento entra",
              "Um arquivo completo, associado à sua conta. O recebimento é confirmado com protocolo e data.",
            ],
            [
              "Uma pessoa examina",
              solar
                ? "Enquadramento, regime de compensação, geração e custos são examinados. Fatos e premissas permanecem distinguíveis."
                : "Modalidade tarifária, demanda contratada e medida, tributos e encargos são examinados com contexto.",
            ],
            [
              "A leitura retorna",
              "Um parecer humano com contraditório. Você recebe aviso por email e acessa o documento na sua conta.",
            ],
          ].map(([title, detail], i) => (
            <li key={title}>
              <span className="g2-mono">0{i + 1}</span>
              <h3>{title}</h3>
              <p>{detail}</p>
            </li>
          ))}
        </ol>
      </section>
    </AdvisoryProductFrame>
  );
}
