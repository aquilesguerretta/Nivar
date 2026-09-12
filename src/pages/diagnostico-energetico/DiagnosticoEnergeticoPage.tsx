import { formatarDataHora } from "../../components/g2/advisory-intake-format";
import { useId, useRef, useState, type FormEvent } from "react";
import { Link, useLocation } from "react-router-dom";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { useAuth } from "../../lib/auth/AuthContext";
import { AuthError } from "../../lib/auth/authApi";
import {
  enviarEscopo,
  type SubmissaoDiagnostico,
} from "../../lib/diagnostico/api";
import {
  AdvisoryAccess,
  AdvisoryPreparationNotice,
  AdvisoryProductFrame,
  ClientError,
  type AdvisoryProductDescription,
} from "../../components/g2/AdvisoryIntakeTheme";
import { HistoricoDiagnostico } from "./HistoricoDiagnostico";

const PRODUCT: AdvisoryProductDescription = {
  id: "diagnostico-energetico",
  title: "Diagnóstico Energético",
  headline: (
    <>
      O custo é uma consequência.
      <br />
      <em>Abra o contexto.</em>
    </>
  ),
  description:
    "Análise do contexto energético de uma operação industrial: consumo, modalidade, contratos e questões a examinar.",
  purpose:
    "O trabalho começa com um escopo. Você descreve a operação e o que está em jogo; o exame independente parte dessa pergunta, sem exigir que você já conheça a resposta.",
  input: "O contexto da sua operação.",
  output: "Escopo registrado e conversa vinculada ao atendimento.",
  scope: [
    ["Operação", "Setor e faixa de consumo mensal."],
    ["Enquadramento", "Modalidade tarifária, quando conhecida."],
    ["Questão", "Prioridades, dúvidas e contexto da decisão."],
  ],
  preparation:
    "A abertura pública está em preparação. O escopo e a conversa já compõem o fluxo existente da conta.",
};
const SECTORS = [
  { value: "manufatura", label: "Manufatura" },
  { value: "mineracao", label: "Mineração" },
  { value: "agronegocio", label: "Agronegócio" },
  { value: "data-center", label: "Data center" },
  { value: "varejo", label: "Varejo e comércio" },
  { value: "saneamento", label: "Saneamento" },
  { value: "outro", label: "Outro" },
];
const BANDS = [
  { value: "ate-50", label: "Até 50 MWh/mês" },
  { value: "50-200", label: "50 a 200 MWh/mês" },
  { value: "200-500", label: "200 a 500 MWh/mês" },
  { value: "500-1500", label: "500 a 1.500 MWh/mês" },
  { value: "acima-1500", label: "Acima de 1.500 MWh/mês" },
];
const TARIFFS = [
  { value: "nao-sei", label: "Não sei dizer" },
  { value: "a4-azul", label: "Grupo A · Azul" },
  { value: "a4-verde", label: "Grupo A · Verde" },
  { value: "grupo-b", label: "Grupo B" },
  { value: "livre", label: "Já estou no mercado livre" },
];
const CONCERNS = [
  { id: "custo", label: "Custo total subindo" },
  { id: "demanda", label: "Multa por demanda" },
  { id: "migracao", label: "Avaliar mercado livre" },
  { id: "contrato", label: "Revisar contrato vigente" },
  { id: "expansao", label: "Expansão de carga" },
];
function message(error: unknown) {
  if (!(error instanceof AuthError))
    return "Algo falhou do nosso lado. Tente de novo em instantes.";
  switch (error.status) {
    case 0:
      return "Não foi possível falar com o servidor. Verifique a conexão.";
    case 401:
      return "A sessão expirou. Entre de novo para enviar.";
    case 403:
      return "O produto não está ativo nesta conta. Recarregue a página e tente de novo.";
    case 422:
      return "O servidor recusou o escopo. Revise os campos e tente de novo.";
    default:
      return "Algo falhou do nosso lado. Tente de novo em instantes.";
  }
}

export function DiagnosticoEnergeticoPage() {
  const { user, loading, myProducts, activateProduct } = useAuth();
  const location = useLocation();
  const id = useId();
  const [sector, setSector] = useState("");
  const [band, setBand] = useState("");
  const [tariff, setTariff] = useState("nao-sei");
  const [marked, setMarked] = useState<ReadonlySet<string>>(new Set());
  const [context, setContext] = useState("");
  const [errors, setErrors] = useState<{
    sector?: string;
    band?: string;
    concern?: string;
  }>({});
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [review, setReview] = useState(false);
  const [receipt, setReceipt] = useState<SubmissaoDiagnostico | null>(null);
  const receiptHeading = useRef<HTMLHeadingElement>(null);
  const reviewHeading = useRef<HTMLHeadingElement>(null);
  const labels = CONCERNS.filter((item) => marked.has(item.id)).map(
    (item) => item.label,
  );
  const concern = [
    labels.length ? `Em jogo: ${labels.join(" · ")}` : "",
    context.trim(),
  ]
    .filter(Boolean)
    .join("\n\n");
  const sectorLabel =
    SECTORS.find((item) => item.value === sector)?.label ?? "—";
  const bandLabel = BANDS.find((item) => item.value === band)?.label ?? "—";
  const tariffLabel =
    TARIFFS.find((item) => item.value === tariff)?.label ?? "—";
  const scope = {
    sector: sectorLabel,
    monthlyConsumptionBand: bandLabel,
    tariffModality: tariff === "nao-sei" ? null : tariffLabel,
    concern,
  };
  function validate() {
    const found: typeof errors = {};
    if (!sector) found.sector = "Escolha o setor da operação.";
    if (!band) found.band = "Escolha a faixa de consumo.";
    if (!concern)
      found.concern = "Marque uma prioridade ou escreva o contexto.";
    else if (concern.length > 4000)
      found.concern =
        "O escopo completo deve ter no máximo 4.000 caracteres. Reduza o contexto.";
    setErrors(found);
    const first = Object.keys(found)[0];
    if (first) document.getElementById(`${id}-${first}`)?.focus();
    return !first;
  }
  async function submit(event: FormEvent) {
    event.preventDefault();
    if (sending || !user || loading || !validate()) return;
    if (!review) {
      setReview(true);
      window.requestAnimationFrame(() => reviewHeading.current?.focus());
      return;
    }
    setError(null);
    setSending(true);
    try {
      const { products } = await myProducts();
      if (!products.some((item) => item.productId === PRODUCT.id))
        await activateProduct(PRODUCT.id);
      const created = await enviarEscopo(scope);
      setReceipt(created);
      setReview(false);
      window.requestAnimationFrame(() => receiptHeading.current?.focus());
    } catch (err) {
      if (!(err instanceof Error && err.name === "AbortError"))
        setError(message(err));
    } finally {
      setSending(false);
    }
  }
  return (
    <AdvisoryProductFrame product={PRODUCT}>
      {!user ? (
        <AdvisoryAccess
          productId={PRODUCT.id}
          action="Entrar para enviar escopo"
        />
      ) : (
        <>
          <section
            className="g23-product__intake"
            id="envio"
            aria-label="Escopo da análise"
          >
            <AdvisoryPreparationNotice productId={PRODUCT.id} />
            <div className="g23-product__section-heading">
              <span className="g2-mono">
                01 / {receipt ? "ESCOPO RECEBIDO" : "O CONTEXTO DA OPERAÇÃO"}
              </span>
              <span className="g2-mono">
                {receipt
                  ? "REGISTRO CONFIRMADO"
                  : "QUATRO PERGUNTAS / SEM ARQUIVO NESTA ETAPA"}
              </span>
            </div>
            {receipt ? (
              <div className="g23-receipt">
                <div>
                  <span className="g23-receipt__mark" aria-hidden="true">
                    ↳
                  </span>
                  <h2 ref={receiptHeading} tabIndex={-1}>
                    O escopo está registrado.
                  </h2>
                  <p>
                    A conversa abaixo acompanha este atendimento. O registro
                    confirma o recebimento do contexto; ele ainda não é um
                    diagnóstico ou um parecer.
                  </p>
                </div>
                <div>
                  <dl>
                    {[
                      ["Protocolo", receipt.id],
                      ["Setor", receipt.sector],
                      ["Consumo", receipt.monthlyConsumptionBand],
                      ["Modalidade", receipt.tariffModality ?? "Não informada"],
                      ["Em jogo", receipt.concern],
                      ["Recebido em", formatarDataHora(receipt.createdAt)],
                    ].map(([label, value]) => (
                      <div key={label}>
                        <dt>{label}</dt>
                        <dd>{value}</dd>
                      </div>
                    ))}
                  </dl>
                  <div className="g23-client-actions">
                    <a className="g2-primary" href="#acompanhamento">
                      Ir para o atendimento <ArrowRight size={17} />
                    </a>
                    <button
                      type="button"
                      className="g23-client-link"
                      onClick={() => {
                        setReceipt(null);
                        setReview(false);
                        setError(null);
                      }}
                    >
                      Abrir outro diagnóstico
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="g23-product__form-layout">
                <div className="g23-product__form-intro">
                  <h2>
                    O que está
                    <br />
                    <em>em jogo agora?</em>
                  </h2>
                  <p>
                    Uma faixa de consumo é suficiente. Se você não conhece a
                    modalidade tarifária, pode dizer isso. O contexto orienta a
                    análise; não antecipa a conclusão.
                  </p>
                  <dl>
                    <div>
                      <dt>Primeiro</dt>
                      <dd>Descreva a operação e a pergunta.</dd>
                    </div>
                    <div>
                      <dt>Depois</dt>
                      <dd>Revise o escopo antes de enviá-lo.</dd>
                    </div>
                    <div>
                      <dt>Continuidade</dt>
                      <dd>Converse pelo registro do atendimento.</dd>
                    </div>
                  </dl>
                </div>
                <form className="g23-scope-form" noValidate onSubmit={submit}>
                  {review ? (
                    <div className="g23-scope-review">
                      <h3 ref={reviewHeading} tabIndex={-1}>
                        Revise seu escopo.
                      </h3>
                      <dl>
                        {[
                          ["Setor", sectorLabel],
                          ["Consumo mensal", bandLabel],
                          [
                            "Modalidade",
                            tariff === "nao-sei"
                              ? "Não informada"
                              : tariffLabel,
                          ],
                          ["Em jogo", concern],
                        ].map(([label, value]) => (
                          <div key={label}>
                            <dt>{label}</dt>
                            <dd>{value}</dd>
                          </div>
                        ))}
                      </dl>
                      <button
                        type="button"
                        disabled={sending}
                        className="g23-client-link"
                        onClick={() => setReview(false)}
                      >
                        Editar o contexto
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="g23-scope-field">
                        <label htmlFor={`${id}-sector`}>
                          Setor da operação · obrigatório
                        </label>
                        <select
                          id={`${id}-sector`}
                          value={sector}
                          onChange={(e) => setSector(e.target.value)}
                          aria-invalid={!!errors.sector}
                          aria-describedby={
                            errors.sector ? `${id}-sector-error` : undefined
                          }
                        >
                          <option value="">Escolha o setor</option>
                          {SECTORS.map((item) => (
                            <option key={item.value} value={item.value}>
                              {item.label}
                            </option>
                          ))}
                        </select>
                        {errors.sector && (
                          <span
                            className="g23-scope-error"
                            id={`${id}-sector-error`}
                          >
                            {errors.sector}
                          </span>
                        )}
                      </div>
                      <div className="g23-scope-field">
                        <label htmlFor={`${id}-band`}>
                          Consumo mensal · obrigatório
                        </label>
                        <select
                          id={`${id}-band`}
                          value={band}
                          onChange={(e) => setBand(e.target.value)}
                          aria-invalid={!!errors.band}
                          aria-describedby={`${id}-band-hint${errors.band ? ` ${id}-band-error` : ""}`}
                        >
                          <option value="">Escolha a faixa</option>
                          {BANDS.map((item) => (
                            <option key={item.value} value={item.value}>
                              {item.label}
                            </option>
                          ))}
                        </select>
                        <small id={`${id}-band-hint`}>
                          Uma faixa basta. A fatura fecha o número depois.
                        </small>
                        {errors.band && (
                          <span
                            className="g23-scope-error"
                            id={`${id}-band-error`}
                          >
                            {errors.band}
                          </span>
                        )}
                      </div>
                      <div className="g23-scope-field">
                        <label htmlFor={`${id}-tariff`}>
                          Modalidade tarifária
                        </label>
                        <select
                          id={`${id}-tariff`}
                          value={tariff}
                          onChange={(e) => setTariff(e.target.value)}
                          aria-describedby={`${id}-tariff-hint`}
                        >
                          {TARIFFS.map((item) => (
                            <option key={item.value} value={item.value}>
                              {item.label}
                            </option>
                          ))}
                        </select>
                        <small id={`${id}-tariff-hint`}>
                          Não saber é uma resposta válida. Esse também pode ser
                          um ponto da análise.
                        </small>
                      </div>
                      <fieldset>
                        <legend>O que está em jogo</legend>
                        <div className="g23-scope-choices">
                          {CONCERNS.map((item) => (
                            <label key={item.id}>
                              <input
                                type="checkbox"
                                checked={marked.has(item.id)}
                                onChange={(e) =>
                                  setMarked((previous) => {
                                    const next = new Set(previous);
                                    if (e.target.checked) next.add(item.id);
                                    else next.delete(item.id);
                                    return next;
                                  })
                                }
                              />
                              {item.label}
                            </label>
                          ))}
                        </div>
                      </fieldset>
                      <div className="g23-scope-field">
                        <label htmlFor={`${id}-concern`}>
                          Contexto da decisão
                        </label>
                        <textarea
                          id={`${id}-concern`}
                          rows={4}
                          value={context}
                          onChange={(e) => setContext(e.target.value)}
                          maxLength={4000}
                          placeholder="O que motivou a busca por uma leitura independente?"
                          aria-invalid={!!errors.concern}
                          aria-describedby={`${id}-concern-hint${errors.concern ? ` ${id}-concern-error` : ""}`}
                        />
                        <small id={`${id}-concern-hint`}>
                          Selecione uma prioridade acima ou descreva a situação.{" "}
                          {concern.length.toLocaleString("pt-BR")} / 4.000
                          caracteres no escopo completo.
                        </small>
                        {errors.concern && (
                          <span
                            className="g23-scope-error"
                            id={`${id}-concern-error`}
                          >
                            {errors.concern}
                          </span>
                        )}
                      </div>
                    </>
                  )}
                  {error && (
                    <ClientError>
                      {error}
                      {error.startsWith("A sessão") && (
                        <Link
                          className="g23-client-link"
                          to="/entrar"
                          state={{ de: location.pathname }}
                        >
                          Entrar novamente
                        </Link>
                      )}
                    </ClientError>
                  )}
                  <div className="g23-client-actions">
                    <button
                      type="submit"
                      className="g2-primary"
                      disabled={sending || loading}
                      aria-busy={sending || undefined}
                    >
                      {sending
                        ? "Registrando escopo…"
                        : review
                          ? "Confirmar e enviar escopo"
                          : "Revisar escopo"}
                      <ArrowRight size={17} />
                    </button>
                    <span role="status">
                      {sending
                        ? "Aguarde a confirmação do registro."
                        : review
                          ? "O envio cria um registro na sua conta."
                          : "Você revisa antes de enviar."}
                    </span>
                  </div>
                </form>
              </div>
            )}
          </section>
          <HistoricoDiagnostico casoNovo={receipt} />
        </>
      )}
      <section
        className="g23-product__journey"
        aria-label="Como o diagnóstico começa"
      >
        <div className="g2-eyebrow">DO CONTEXTO AO EXAME</div>
        <ol>
          {[
            [
              "Descrever",
              "Setor, consumo e preocupações orientam o ponto de partida. Não é preciso saber a resposta para formular a pergunta.",
            ],
            [
              "Conversar",
              "O escopo recebido e as mensagens ficam vinculados ao mesmo atendimento, dentro da sua conta.",
            ],
            [
              "Examinar",
              "Fatura, contrato e referências fundamentam a análise. O parecer não é gerado automaticamente ao preencher o formulário.",
            ],
          ].map(([title, body], i) => (
            <li key={title}>
              <span className="g2-mono">0{i + 1}</span>
              <h3>{title}</h3>
              <p>{body}</p>
            </li>
          ))}
        </ol>
        <Link className="g2-text-link" to="/conta">
          Consultar meus registros <ArrowUpRight size={16} />
        </Link>
      </section>
    </AdvisoryProductFrame>
  );
}
export default DiagnosticoEnergeticoPage;
