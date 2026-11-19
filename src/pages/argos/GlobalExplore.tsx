import { useEffect, useRef } from "react";
import { ArrowLeft, ArrowRight, ChevronRight, FileText, Search } from "lucide-react";
import { Link, useLocation, useNavigate, useParams, useSearchParams, type LinkProps } from "react-router-dom";
import { NivarShell } from "../../components/g2/NivarShell";
import {
  assessWaferComparison,
  exploreObjects,
  formatWaferShare,
  isExploreObject,
  pvStages,
  resolveWaferObservation,
  searchExplore,
  waferMetric,
  type EvidenceKey,
  type ExploreObjectKey,
  type WaferObservation,
} from "../../lib/argos/globalExplore";
import { globalExplorePath } from "../../lib/argos/globalExploreLocal";
import { EvidenceInspector } from "./EvidenceInspector";
import "./global-explore.css";

const investigation = ["topcon", "pv-wafer", "china"] as const;
const evidenceLinks = {
  topcon: [{ key: "doe", label: "Arquiteturas e fabricação · DOE" }, { key: "feldmann", label: "Experimento de contato · Feldmann et al." }],
  "pv-wafer": [{ key: "iea", label: "Estimativa de capacidade · IEA" }, { key: "doe", label: "Processo de fabricação · DOE" }],
  china: [{ key: "iea", label: "Estimativa de capacidade · IEA" }],
} satisfies Record<ExploreObjectKey, { key: EvidenceKey; label: string }[]>;

type EvidenceLink = (source: EvidenceKey) => Pick<LinkProps, "to" | "state"> & { "data-source-link": EvidenceKey };

function exploreHref(query: string, object?: ExploreObjectKey, evidence?: EvidenceKey) {
  const params = new URLSearchParams();
  if (query) params.set("q", query);
  if (evidence) params.set("evidence", evidence);
  return `${globalExplorePath}${object ? `/${object}` : ""}${params.size ? `?${params}` : ""}`;
}

function ValueChain({ waferHref, selected }: { waferHref: string; selected: boolean }) {
  return (
    <section className="ax-section" aria-labelledby="ax-chain">
      <h2 id="ax-chain">Cadeia fotovoltaica</h2>
      <ol className="ax-chain">
        {pvStages.map((stage) => (
          <li key={stage.name}>
            {stage.name === "Wafer" ? (
              <Link to={waferHref} aria-current={selected ? "page" : undefined}>
                <strong>{stage.name}</strong>
                <small>{stage.description}</small>
                <ArrowRight size={15} aria-hidden="true" />
              </Link>
            ) : <span><strong>{stage.name}</strong><small>{stage.description}</small></span>}
          </li>
        ))}
      </ol>
    </section>
  );
}

function TechnologyProfile({ waferHref, evidenceLink }: {
  waferHref: string;
  evidenceLink: EvidenceLink;
}) {
  return (
    <>
      <section className="ax-section">
        <h2>Como o contato funciona</h2>
        <p>Uma camada ultrafina de óxido de silício separa o wafer cristalino de uma camada de polissilício dopado.
          Essa interface reduz a recombinação de cargas e permite que os portadores selecionados atravessem o óxido por tunelamento.</p>
        <Link className="ax-text-link" {...evidenceLink("feldmann")}>Ver estudo original <ArrowRight size={15} aria-hidden="true" /></Link>
      </section>
      <ValueChain waferHref={waferHref} selected={false} />
      <section className="ax-section">
        <h2>Arquiteturas de célula</h2>
        <dl className="ax-architectures">
          <div><dt>TOPCon</dt><dd>Contato passivado por óxido de tunelamento e polissilício dopado.</dd></div>
          <div><dt>PERC</dt><dd>Passivação dielétrica traseira com aberturas localizadas para contato metálico.</dd></div>
          <div><dt>SHJ / HJT</dt><dd>Heterojunção de silício cristalino com camadas finas de silício amorfo e óxido condutor transparente.</dd></div>
        </dl>
        <p className="ax-muted">A comparação descreve mecanismos técnicos. Alegações de desempenho de fabricantes exigem medições e fontes próprias.</p>
        <Link className="ax-text-link" {...evidenceLink("doe")}>Ver referência técnica do DOE <ArrowRight size={15} aria-hidden="true" /></Link>
      </section>
    </>
  );
}

function WaferMetric({ observation, evidenceLink }: { observation: WaferObservation | undefined; evidenceLink: EvidenceLink }) {
  if (!observation) return <p className="ax-notice" role="status"><strong>UNRESOLVED</strong> · Observação indisponível.</p>;

  const comparisonScope = { referenceYear: observation.referenceYear };
  const productionState = assessWaferComparison({ ...comparisonScope, measure: "actual-production" }, observation);
  const countryState = assessWaferComparison({ ...comparisonScope, measure: "manufacturing-capacity" }, observation);
  return (
    <>
      <section className="ax-metric" aria-labelledby="ax-metric-title" data-observation={observation.id}
        data-metric={observation.metricRef} data-version={observation.version}>
        <span className="g2-mono ax-kicker">China · Participação estimada</span>
        <div className="ax-metric-value">
          <strong>{formatWaferShare(observation)}</strong>
          <h2 id="ax-metric-title">{waferMetric.label}</h2>
        </div>
        <div className="ax-metric-meta">
          <span>Referência <b>{observation.referenceYear}</b></span>
          <span>Relatório IEA <b>{observation.publishedOn.slice(0, 4)}</b></span>
          <span>Etapa <b>Wafer fotovoltaico</b></span>
        </div>
        <p>A estimativa mede capacidade instalada de fabricação. Produção efetiva e capacidade de células TOPCon são medidas distintas.</p>
        <p>{observation.absoluteDenominatorGW === null
          ? <><strong className="ax-state">UNKNOWN</strong> · {waferMetric.denominator}. O total absoluto em GW não consta no gráfico público.</>
          : `${waferMetric.denominator}: ${observation.absoluteDenominatorGW} GW.`}</p>
        <Link className="ax-text-link" {...evidenceLink(observation.sourceRef)}>Ver evidência da IEA <ArrowRight size={15} aria-hidden="true" /></Link>
      </section>
      <section className="ax-section">
        <h2>Comparabilidade</h2>
        <dl className="ax-comparisons">
          <div><dt>Participação na produção efetiva</dt><dd><strong className="ax-state">{productionState}</strong> · Outra medida.</dd></div>
          <div><dt>Comparação com outros países</dt><dd><strong className="ax-state">{countryState}</strong> · Falta uma observação de mesmo escopo neste recorte.</dd></div>
        </dl>
      </section>
    </>
  );
}

export default function GlobalExplore() {
  const { object } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const query = params.get("q") ?? "";
  const requestedEvidence = params.get("evidence");
  const key = object && isExploreObject(object) ? object : undefined;
  const current = key ? exploreObjects[key] : undefined;
  const sources = key ? evidenceLinks[key] : [];
  const activeSource = sources.find((entry) => entry.key === requestedEvidence);
  const observation = key === "pv-wafer" || key === "china" ? resolveWaferObservation(key) : undefined;
  const heading = useRef<HTMLHeadingElement>(null);
  const workspace = useRef<HTMLDivElement>(null);
  const openedEvidence = useRef<{ object: string | undefined; source: EvidenceKey } | null>(null);

  useEffect(() => {
    if (activeSource) {
      openedEvidence.current = { object, source: activeSource.key };
      return;
    }
    const previous = openedEvidence.current;
    openedEvidence.current = null;
    if (!object) return;
    const sourceLink = previous?.object === object && workspace.current?.querySelector<HTMLElement>(
      `[data-source-link="${previous.source}"]`,
    );
    if (sourceLink) sourceLink.focus();
    else heading.current?.focus({ preventScroll: true });
  }, [activeSource, object]);

  const href = (next?: ExploreObjectKey) => exploreHref(query, next);
  const evidenceLink: EvidenceLink = (source) => ({
    to: exploreHref(query, key, source),
    state: { evidenceReturn: href(key) },
    "data-source-link": source,
  });
  const closeEvidence = () => {
    const destination = href(key);
    if (location.state?.evidenceReturn === destination) navigate(-1);
    else navigate(destination, { replace: true });
  };
  const stepIndex = key ? investigation.indexOf(key) : -1;
  const previous = stepIndex > 0 ? investigation[stepIndex - 1] : undefined;
  const results = object ? [] : searchExplore(query);

  return (
    <NivarShell family="intelligence" title={current ? `${current.name} · ARGOS Explore` : "ARGOS Explore"} compactFooter>
      <div className="g2-container ax-workspace" ref={workspace}>
        <div className="ax-bar">
          <Link to={href()} className="ax-signature"><span>ARGOS</span> Explore</Link>
          <span className="g2-mono">Ambiente local</span>
        </div>
        {current && (
          <nav aria-label="Trilha da investigação" className="ax-breadcrumb">
            <ol>
              <li><Link to={href()}>Explore</Link></li>
              {investigation.slice(0, stepIndex + 1).map((step) => (
                <li key={step}>
                  <ChevronRight size={13} aria-hidden="true" />
                  {step === key ? <span aria-current="page">{exploreObjects[step].name}</span>
                    : <Link to={href(step)}>{exploreObjects[step].name}</Link>}
                </li>
              ))}
            </ol>
          </nav>
        )}
        <header className="ax-heading">
          <p className="g2-mono ax-kicker">
            {current?.kind ?? "ARGOS · Inteligência energética global"}
            {key === "china" && ` / ${exploreObjects.china.lens}`}
          </p>
          <h1 tabIndex={-1} ref={heading}>{current?.name ?? (object ? "Objeto indisponível" : "Explorar tecnologias")}</h1>
          {current?.kind === "TechnologyVariant" && <p className="ax-taxonomy">
            {current.parent.technology} <ChevronRight size={14} aria-hidden="true" />
            {current.parent.name} <ChevronRight size={14} aria-hidden="true" /> {current.name}
          </p>}
          {key === "pv-wafer" && <p className="ax-taxonomy">Solar PV <ChevronRight size={14} aria-hidden="true" /> {exploreObjects["pv-wafer"].role}</p>}
          <p className="ax-lead">{current?.summary ?? (object
            ? "UNRESOLVED · A referência não pertence a este recorte local."
            : "Investigue uma tecnologia, siga a cadeia de fabricação e examine a fonte.")}</p>
        </header>

        {!object ? (
          <div className="ax-layout">
            <section className="ax-search" aria-label="Busca de objetos ARGOS">
              <label htmlFor="ax-query">Buscar objetos</label>
              <div className="ax-input">
                <Search size={20} aria-hidden="true" />
                <input id="ax-query" type="search" placeholder="Ex. TOPCon" value={query}
                  onChange={(event) => setParams(event.target.value ? { q: event.target.value } : {}, { replace: true })} />
              </div>
              <p className="g2-mono ax-results-label" role="status">
                {query.trim() ? `${results.length} ${results.length === 1 ? "resultado" : "resultados"}` : "Objetos disponíveis"}
              </p>
              {results.length > 0 ? <ul className="ax-results">
                {results.map((item) => (
                  <li key={item.id}><Link to={href(item.key)}>
                    <div><span className="g2-mono ax-kicker">{item.kind}</span><strong>{item.name}</strong>
                      <small>{item.kind === "TechnologyVariant" ? `${item.parent.technology} / ${item.parent.name}` : item.summary}</small></div>
                    <ArrowRight size={18} aria-hidden="true" />
                  </Link></li>
                ))}
              </ul> : <p className="ax-notice">UNRESOLVED · Nenhum objeto neste recorte corresponde à busca.</p>}
            </section>
            <aside className="ax-rail" aria-label="Caminho de investigação">
              <h2>Da célula à manufatura</h2>
              <ol className="ax-rail-list">
                {investigation.map((step) => <li key={step}><Link to={href(step)}>{exploreObjects[step].name}<ArrowRight size={15} aria-hidden="true" /></Link></li>)}
              </ol>
            </aside>
          </div>
        ) : key ? (
          <div className="ax-layout">
            <div className="ax-reading">
              {key === "topcon" ? <TechnologyProfile waferHref={href(exploreObjects.topcon.relatedElement)} evidenceLink={evidenceLink} /> : <>
                {key === "pv-wafer" && <section className="ax-section">
                  <h2>Do lingote à célula</h2>
                  <p>O lingote é cortado em lâminas. O wafer fornece o silício cristalino que absorve luz.
                    O contato TOPCon é acrescentado durante o processamento da célula, depois da fabricação do wafer.</p>
                </section>}
                <WaferMetric observation={observation} evidenceLink={evidenceLink} />
                {key === "pv-wafer" && <ValueChain waferHref={href("pv-wafer")} selected />}
              </>}
              <nav className="ax-next" aria-label="Objetos relacionados">
                <Link className="ax-text-link" to={href(previous)}><ArrowLeft size={16} aria-hidden="true" />
                  {previous ? `Voltar a ${exploreObjects[previous].name}` : "Voltar à busca"}
                </Link>
                {stepIndex < investigation.length - 1 && (
                  <Link className="ax-text-link" to={href(investigation[stepIndex + 1])}>
                    {key === "pv-wafer" ? "Ver manufatura na China" : "Explorar wafer fotovoltaico"}
                    <ArrowRight size={16} aria-hidden="true" />
                  </Link>
                )}
              </nav>
            </div>
            {activeSource ? <EvidenceInspector sourceKey={activeSource.key} observation={observation} onClose={closeEvidence} /> :
              <aside className="ax-rail" aria-labelledby="ax-sources">
                <h2 id="ax-sources"><FileText size={19} aria-hidden="true" /> Fontes e evidência</h2>
                <ul className="ax-rail-list">
                  {sources.map((entry) => <li key={entry.key}><Link {...evidenceLink(entry.key)}>{entry.label}<ArrowRight size={15} aria-hidden="true" /></Link></li>)}
                </ul>
                {requestedEvidence && <p className="ax-notice" role="status">UNRESOLVED · Evidência fora do escopo deste objeto.</p>}
                <p className="ax-muted">Curadoria manual · Atribuição e direitos em cada fonte.</p>
              </aside>}
          </div>
        ) : <Link className="ax-text-link" to={href()}><ArrowLeft size={16} aria-hidden="true" /> Voltar à busca</Link>}
      </div>
    </NivarShell>
  );
}
