import { useEffect, useRef, type ReactNode } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight, FileText } from "lucide-react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { claims, dossierCutoff, resolveEvidence, type ClaimKey } from "./evidence.ts";
import {
  areaSplit, contractors, denominators, field, formatShare, isDate,
  profile, replay, roles, union, vessel, type Denominator,
} from "./model.ts";
import "./fixture.css";

const pages = {
  "/": { title: profile.name, type: "Perfil de companhia", description: "Identidade jurídica e atuação no campo de Mero." },
  "/entidade": { title: contractors.petrobras.name, type: "Entidade jurídica", description: "A pessoa jurídica contratada e operadora do campo de Mero." },
  "/mero": { title: field.name, type: "Campo petrolífero", description: field.location },
  "/mero/historico": { title: "Histórico de Mero", type: "Participações contratuais", description: "Acompanhe da aprovação da individualização à transferência prevista da parcela da União." },
  "/mero/fpso": { title: vessel.name, type: "FPSO", description: "Unidade flutuante de produção, armazenamento e transferência associada ao campo de Mero." },
  "/mero/brasil": { title: "Mapa Corporativo do Brasil", type: "Referência de navegação", description: field.location },
} as const;

type Page = keyof typeof pages;
const scopeKeys = Object.keys(denominators) as Denominator[];
const snapshotLabels = {
  "auction-2025": "Alocação no leilão de 2025",
  "documented-2026": "Composição documentada em 2026",
  "documented-fy2025": "Composição em 31/12/2025",
  "conditional-transfer": "Projeção condicionada",
};

function linkTo(page: Page, params: URLSearchParams, update: Record<string, string> = {}) {
  const next = new URLSearchParams();
  for (const key of ["data", "base"]) {
    const value = params.get(key);
    if (value) next.set(key, value);
  }
  for (const [key, value] of Object.entries(update)) next.set(key, value);
  return next.size ? page + "?" + next : page;
}

function dateLabel(value: string) {
  return value.split("-").reverse().join("/");
}

function DateText({ value }: { value: string }) {
  return <time dateTime={value}>{dateLabel(value)}</time>;
}

function NavRow({ to, children, detail }: { to: string; children: ReactNode; detail: string }) {
  return (
    <Link to={to} className="j2-row">
      <span><strong>{children}</strong><small>{detail}</small></span>
      <ArrowRight size={18} aria-hidden="true" />
    </Link>
  );
}

function Evidence({ claimKey, close }: { claimKey: ClaimKey; close: string }) {
  const { claim, document, source, rights } = resolveEvidence(claimKey);
  const navigate = useNavigate();
  const { state } = useLocation();
  const title = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    title.current?.focus();
  }, [claimKey]);

  return (
    <aside className="j2-side j2-evidence" aria-labelledby="j2-evidence-title">
      <Link to={close} replace className="j2-return" onClick={(event) => {
        if (state?.evidenceFrom !== close || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
        event.preventDefault();
        navigate(-1);
      }}><ArrowLeft size={16} aria-hidden="true" /> Voltar à consulta</Link>
      <span className="j2-kicker">Evidência · {source.publisher}</span>
      <h2 id="j2-evidence-title" ref={title} tabIndex={-1}>{document.title}</h2>
      <p>{claim.summary}</p>
      <dl className="j2-fields">
        <div><dt>Autoridade</dt><dd>{source.authority}</dd></div>
        <div><dt>Data ou período da afirmação</dt><dd>{claim.referencePeriod}</dd></div>
        <div><dt>Publicação</dt><dd>{document.publishedOn ? <DateText value={document.publishedOn} /> : "Data não identificada"}</dd></div>
        <div><dt>Consulta na pesquisa</dt><dd><DateText value={document.retrievedOn} /></dd></div>
        <div><dt>Conhecida no dossiê desde</dt><dd><DateText value={claim.knownAt} /></dd></div>
        <div><dt>Versão e localizador</dt><dd>{document.version} · {claim.locator}</dd></div>
        <div><dt>Limite da evidência</dt><dd>{claim.limit}</dd></div>
        <div><dt>Direitos por canal</dt><dd>{rights.allowed} {rights.condition} {rights.gated}
          {rights.termsUrl && <> <a href={rights.termsUrl} target="_blank" rel="noreferrer">Termos da fonte ↗</a></>}
        </dd></div>
      </dl>
      <a className="j2-return" href={document.url} target="_blank" rel="noreferrer">
        Abrir fonte original <ArrowUpRight size={16} aria-hidden="true" />
      </a>
      <details className="j2-refs">
        <summary>Referências da evidência</summary>
        {[source.id, document.id, claim.id, rights.id].map((ref) => <code key={ref}>{ref}</code>)}
      </details>
    </aside>
  );
}

type EvidenceLink = (key: ClaimKey, label?: string) => ReactNode;
type Replay = ReturnType<typeof replay>;

function allowedEvidence(page: Page, asOf: Replay, scope: Denominator): readonly ClaimKey[] {
  switch (page) {
    case "/entidade": return ["legal-identity", "issuer-identity", roles.governance.evidence];
    case "/mero": return [roles.fieldOperation.evidence, ...new Set(asOf.rows[scope].flatMap((row) => row.evidence))];
    case "/mero/historico": return [
      ...asOf.events.map((event) => event.evidence),
      ...(asOf.pending ? [asOf.pending.plannedEvidence] : []),
      ...(asOf.projected.length ? ["petrobras-projection" as const] : []),
    ];
    case "/mero/fpso": return [vessel.associationEvidence];
    case "/mero/brasil": return [field.geographyEvidence];
    case "/": return [];
  }
}

function Participations({ asOf, scope, params, cite }: {
  asOf: Replay; scope: Denominator; params: URLSearchParams; cite: EvidenceLink;
}) {
  const rows = asOf.rows[scope];
  const petrobras = rows.find((row) => row.party === "petrobras");
  const contracted = asOf.rows.contracted.find((row) => row.party === "petrobras");

  return (
    <section className="j2-section" aria-labelledby="j2-participations">
      <h2 id="j2-participations">Participações contratuais</h2>
      <nav className="j2-options" aria-label="Denominador">
        {scopeKeys.map((key) => (
          <Link key={key} to={linkTo("/mero", params, { base: key })} aria-current={key === scope ? "page" : undefined}>
            {denominators[key].label}
          </Link>
        ))}
      </nav>
      {petrobras && (
        <div className="j2-metric">
          <span className="j2-kicker">Petrobras · {snapshotLabels[petrobras.snapshot]}</span>
          <div><strong>{formatShare(petrobras.bps)}</strong><span>{denominators[scope].label}</span></div>
          {scope === "reservoir" && contracted && (
            <p>{formatShare(contracted.bps)} da área contratada × {formatShare(areaSplit.contractedBps)} da jazida = {formatShare(petrobras.bps)} da jazida.</p>
          )}
          {scope === "acquired" && <p>O bloco arrematado equivale a {formatShare(areaSplit.unionBps)} da jazida compartilhada.</p>}
        </div>
      )}
      {rows.length > 0 ? (
        <>
          <table className="j2-table">
            <caption>{denominators[scope].instrument}</caption>
            <thead><tr><th scope="col">Parte</th><th scope="col">Participação</th></tr></thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id}>
                  <th scope="row">{row.party === "union" ? "União · área não contratada" : contractors[row.party].shortName}</th>
                  <td>{formatShare(row.bps)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="j2-links">
            {scope === "acquired" && cite("auction-allocation", "Resultado do leilão · Petrobras")}
            {contracted && cite("contract-split", "Composição contratual · ANP")}
            {scope === "reservoir" && cite("reservoir-split", "Jazida compartilhada · Form 20-F")}
          </div>
          {scope === "reservoir" && asOf.baselineOn && (
            <p className="j2-muted">{roles.unionRepresentation.subjectName} comercializa a produção da parcela da União, conforme o MME. {cite("transfer-signing", "Ver comunicado")}</p>
          )}
        </>
      ) : <p className="j2-note">O dossiê não estabelece a composição para esta data e este denominador.</p>}
    </section>
  );
}

function History({ asOf, params, cite }: { asOf: Replay; params: URLSearchParams; cite: EvidenceLink }) {
  return (
    <>
      <section className="j2-section">
        <h2>Mudanças documentadas</h2>
        <p className="j2-muted">Reconstrução histórica com o dossiê de 18/11/2026. A data selecionada filtra os acontecimentos.</p>
        {asOf.events.length ? (
          <ol className="j2-timeline">
            {asOf.events.map((event) => (
              <li key={event.evidence}>
                <DateText value={event.on} />
                <div><strong>{event.label}</strong>{cite(event.evidence, "Ver evidência")}</div>
              </li>
            ))}
          </ol>
        ) : <p className="j2-note">Sem acontecimentos documentados até a data selecionada.</p>}
      </section>
      {asOf.pending && (
        <section className="j2-section">
          <h2>Transferência prevista</h2>
          <div className="j2-projection">
            <div className="j2-status-line">
              <strong>Pendente de confirmação</strong>
              <span>Data anunciada · <DateText value={asOf.pending.plannedOn} /></span>
            </div>
            {asOf.pending.announcedDateReached && <p>O marco anunciado já foi alcançado na data selecionada. A efetivação segue sem comprovação.</p>}
            {asOf.projected.length ? (
              <dl className="j2-forecast">
                {asOf.projected.map((row) => (
                  <div key={row.id}>
                    <dt>{contractors[row.party].shortName} · se efetivada</dt>
                    <dd><strong>{formatShare(row.bps)}</strong> da jazida compartilhada</dd>
                    <dd className="j2-muted">{formatShare(row.baseBps)} + {formatShare(row.incrementBps).replace("%", "")} p.p. ({formatShare(row.blockBps)} do bloco)</dd>
                  </div>
                ))}
              </dl>
            ) : <p>O cálculo usa a composição documentada no recorte de 2026.</p>}
            <p className="j2-muted">A íntegra executada e a prova de efetivação seguem indisponíveis no dossiê.</p>
            <div className="j2-links">
              {cite("transfer-schedule", "Cronograma · MME")}
              {asOf.projected.length > 0 && cite("petrobras-projection", "Projeção Petrobras · Form 20-F")}
            </div>
          </div>
        </section>
      )}
      <NavRow to={linkTo("/mero", params)} detail="Retomar a base e a data selecionadas">Voltar às participações</NavRow>
    </>
  );
}

function Entity({ cite, params }: { cite: EvidenceLink; params: URLSearchParams }) {
  const petrobras = contractors.petrobras;
  return (
    <>
      <section className="j2-section">
        <h2>Identificadores</h2>
        <dl className="j2-fields">
          {petrobras.identifiers.map((item) => (
            <div key={item.namespace}>
              <dt>{item.namespace === "br.cnpj" ? "CNPJ" : "CIK · SEC"}</dt>
              <dd><code>{item.value}</code> {cite(item.evidence, "Ver fonte")}</dd>
            </div>
          ))}
        </dl>
      </section>
      <section className="j2-section">
        <h2>Governança societária</h2>
        <p>{union.name} · Controle baseado no capital votante, conforme o estatuto.</p>
        {cite(roles.governance.evidence, "Estatuto Social")}
      </section>
      <NavRow to={linkTo("/mero", params)} detail="Operação do campo e participação no acordo">Mero</NavRow>
    </>
  );
}

function Vessel({ cite, params }: { cite: EvidenceLink; params: URLSearchParams }) {
  return (
    <section className="j2-section">
      <h2>Papéis no campo e na unidade</h2>
      <dl className="j2-fields">
        <div><dt>Operadora do campo de Mero</dt><dd>{contractors.petrobras.name}</dd></div>
        <div><dt>Titular do navio segundo a MISC</dt><dd>{roles.vesselOwner.subjectName}</dd></div>
        <div><dt>Operação e manutenção do navio</dt><dd>{roles.vesselMaintenance.subjectName}</dd></div>
      </dl>
      <p className="j2-muted">A ficha da MISC é sem data identificada. Título registral e vigência seguem sem verificação.</p>
      {cite(vessel.associationEvidence, "Ficha técnica · MISC")}
      <NavRow to={linkTo("/mero", params)} detail="Campo petrolífero associado">Voltar a Mero</NavRow>
    </section>
  );
}

export function CompaniesAssetsFixture() {
  const location = useLocation();
  const [params, setParams] = useSearchParams();
  const isKnownPage = Object.hasOwn(pages, location.pathname);
  const page = isKnownPage ? location.pathname as Page : "/";
  const descriptor = pages[page];
  const rawDate = params.get("data") ?? dossierCutoff;
  const asOf = replay(isDate(rawDate) ? rawDate : dossierCutoff);
  const scope = scopeKeys.find((key) => key === params.get("base")) ?? "reservoir";
  const key = params.get("evidencia");
  const claimKey = key && Object.hasOwn(claims, key) && allowedEvidence(page, asOf, scope).includes(key as ClaimKey)
    ? key as ClaimKey : null;
  const heading = useRef<HTMLHeadingElement>(null);
  const returnFocus = useRef<string | null>(null);

  useEffect(() => {
    if (!claimKey) heading.current?.focus();
  }, [page, claimKey]);

  useEffect(() => {
    if (claimKey) {
      returnFocus.current = "j2-evidence-" + claimKey;
    } else if (returnFocus.current) {
      document.getElementById(returnFocus.current)?.focus();
      returnFocus.current = null;
    }
  }, [claimKey]);

  const cite: EvidenceLink = (key, label = "Ver evidência") => {
    const id = "j2-evidence-" + key;
    return (
      <Link id={id} className="j2-cite" to={linkTo(page, params, { evidencia: key })}
        state={{ evidenceFrom: linkTo(page, params) }}>
        <FileText size={15} aria-hidden="true" />{label}
      </Link>
    );
  };

  const fieldPage = page.startsWith("/mero");
  const historyPage = page === "/mero/historico";
  const showDate = page === "/mero" || historyPage;
  const reference = page === "/" ? profile.id : page === "/entidade" ? contractors.petrobras.id :
    page === "/mero/fpso" ? vessel.id : field.id;

  return (
    <div className="j2-workspace">
      <header className="j2-top">
        <div><strong>ARGOS</strong><span>Empresas e ativos</span></div>
        <span className="j2-kicker">Ambiente local privado</span>
      </header>
      <nav className="j2-breadcrumb" aria-label="Localização">
        <Link to={linkTo("/", params)} aria-current={page === "/" ? "page" : undefined}>Petrobras</Link>
        {page !== "/" && <Link to={linkTo("/entidade", params)} aria-current={page === "/entidade" ? "page" : undefined}>Entidade jurídica</Link>}
        {fieldPage && <Link to={linkTo("/mero", params)} aria-current={page === "/mero" ? "page" : undefined}>Mero</Link>}
        {fieldPage && page !== "/mero" && <span aria-current="page">{descriptor.type}</span>}
      </nav>
      <main>
        <header className="j2-heading" data-object-ref={reference}>
          <div>
            <p className="j2-kicker">{descriptor.type}</p>
            <h1 ref={heading} tabIndex={-1}>{isKnownPage ? descriptor.title : "Página indisponível"}</h1>
            <p>{isKnownPage ? descriptor.description : "Use o link Petrobras para retomar a investigação."}</p>
          </div>
          {showDate && (
            <form className="j2-date" onSubmit={(event) => {
              event.preventDefault();
              const value = new FormData(event.currentTarget).get("date");
              if (typeof value !== "string" || !isDate(value)) return;
              const next = new URLSearchParams(params);
              next.set("data", value);
              next.delete("evidencia");
              setParams(next, { preventScrollReset: true });
            }}>
              <label htmlFor="j2-as-of">Data de consulta histórica</label>
              <div>
                <input id="j2-as-of" name="date" type="date" key={asOf.asOf} defaultValue={asOf.asOf}
                  min="1000-01-01" max="9999-12-31" required />
                <button type="submit">Aplicar</button>
              </div>
            </form>
          )}
        </header>
        {!isDate(rawDate) && <p role="status" className="j2-note">Data inválida. Exibindo o recorte de 18/11/2026.</p>}
        {key && !claimKey && <p role="status" className="j2-note">Evidência indisponível. Abra uma fonte vinculada à consulta.</p>}
        {isKnownPage && (
          <div className="j2-layout">
            <div className="j2-reading">
              {page === "/" && (
                <section className="j2-section">
                  <h2>Identidade corporativa</h2>
                  <NavRow to={linkTo("/entidade", params)} detail="Pessoa jurídica · CNPJ e CIK">{contractors.petrobras.name}</NavRow>
                </section>
              )}
              {page === "/entidade" && <Entity cite={cite} params={params} />}
              {page === "/mero" && (
                <>
                  {asOf.asOf > dossierCutoff && <p className="j2-note">Última composição documentada em 18/11/2026. A situação posterior requer nova evidência.</p>}
                  <Participations asOf={asOf} scope={scope} params={params} cite={cite} />
                  <NavRow to={linkTo("/mero/historico", params)} detail="Aditivo, leilão, assinatura e transferência prevista">Histórico e projeção</NavRow>
                  <section className="j2-section">
                    <h2>Operação do campo</h2>
                    <p>{contractors.petrobras.name}</p>
                    {cite(roles.fieldOperation.evidence, "Operadora do campo · ANP")}
                  </section>
                </>
              )}
              {historyPage && <History asOf={asOf} params={params} cite={cite} />}
              {page === "/mero/fpso" && <Vessel cite={cite} params={params} />}
              {page === "/mero/brasil" && (
                <section className="j2-section">
                  <h2>Localização regional</h2>
                  <p className="j2-note">A referência aponta para o mesmo campo de Mero. A geometria do campo e a posição do FPSO seguem sem validação.</p>
                  {cite(field.geographyEvidence, "Localização regional · ANP")}
                  <NavRow to={linkTo("/mero", params)} detail="Retomar a investigação do campo">Voltar a Mero</NavRow>
                </section>
              )}
            </div>
            {claimKey ? <Evidence claimKey={claimKey} close={linkTo(page, params)} /> : (
              <aside className="j2-side" aria-label="Nesta investigação">
                <h2>Nesta investigação</h2>
                {fieldPage ? (
                  <>
                    <NavRow to={linkTo("/mero/fpso", params)} detail="FPSO · titularidade e operação">{vessel.name}</NavRow>
                    <NavRow to={linkTo("/mero/brasil", params)} detail="Referência regional">{pages["/mero/brasil"].title}</NavRow>
                  </>
                ) : <NavRow to={linkTo("/mero", params)} detail={field.location}>Mero</NavRow>}
              </aside>
            )}
          </div>
        )}
      </main>
      <footer className="j2-footer">Curadoria manual · Dossiê NIV-71 · Corte de <DateText value={dossierCutoff} /></footer>
    </div>
  );
}
