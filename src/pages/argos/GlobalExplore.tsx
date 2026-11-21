import { useEffect, useRef } from "react";
import { ArrowLeft, ArrowRight, ChevronRight, FileText } from "lucide-react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { currentKey, milestoneEntries, tandemKey } from "../../features/argos-global-integration/catalog";
import { ExploreLink as Link } from "../../features/argos-global-integration/navigation";
import { objectPath } from "../../features/argos-global-integration/paths";
import { hasTopconRelationship } from "../../features/argos-research-frontier/readModel";
import {
  assessWaferComparison,
  exploreObjects,
  formatWaferShare,
  investigation,
  primaryAncestors,
  pvStages,
  resolveExploreObject,
  waferMetric,
  type ExploreObjectKey,
} from "../../lib/argos/globalExplore";
import {
  documentRefs,
  evidenceLinks,
  pinsForObject,
  resolveExploreSelection,
  type EvidenceKey,
  type EvidencePins,
  type WaferMeasurement,
} from "../../lib/argos/globalExploreEvidence";
import { globalExplorePath } from "../../lib/argos/globalExploreLocal";
import { EvidenceInspector } from "./EvidenceInspector";

type EvidenceLink = (source: EvidenceKey) => {
  to: string;
  state: { evidenceOpened: string };
  "data-source-link": EvidenceKey;
};

function exploreHref(query: string, object?: ExploreObjectKey, evidence?: EvidenceKey, pins: EvidencePins = {}) {
  const params = new URLSearchParams();
  if (query) params.set("q", query);
  if (evidence) params.set("evidence", evidence);
  for (const kind of ["observation", "document"] as const) {
    const pin = pins[kind];
    if (pin) {
      params.set(`${kind}_ref`, pin.ref);
      params.set(`${kind}_version`, String(pin.version));
    }
  }
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

function WaferMetric({ measurement, pinned, evidenceLink }: {
  measurement: WaferMeasurement;
  pinned: boolean;
  evidenceLink: EvidenceLink;
}) {
  const { observation, document } = measurement;
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
          <span>Relatório IEA <b>{document.publishedOn?.slice(0, 4) ?? "UNKNOWN"}</b></span>
          <span>Etapa <b>Wafer fotovoltaico</b></span>
          <span>Observation <b>v{observation.version} · {pinned ? "Fixada" : "Atual"}</b></span>
        </div>
        {observation.synthetic && <p>Fixture sintético de teste · sem correção da IEA.</p>}
        <p>A estimativa mede capacidade instalada de fabricação. Produção efetiva e capacidade de células TOPCon são medidas distintas.</p>
        <p>{observation.absoluteDenominatorGW === null
          ? <><strong className="ax-state">UNKNOWN</strong> · {waferMetric.denominator}. O total absoluto em GW não consta no gráfico público.</>
          : `${waferMetric.denominator}: ${observation.absoluteDenominatorGW} GW.`}</p>
        <Link className="ax-text-link" {...evidenceLink("iea")}>Ver evidência da IEA <ArrowRight size={15} aria-hidden="true" /></Link>
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

export default function GlobalExplore({ object }: { object: ExploreObjectKey }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const query = params.get("q") ?? "";
  const key = object;
  const current = exploreObjects[key];
  const sources = evidenceLinks[key];
  const selection = resolveExploreSelection(key, params);
  const ready = selection.state === "READY" ? selection : undefined;
  const activeEvidence = ready?.evidence;
  const activeSource = activeEvidence?.key;
  const measurement = ready?.measurement;
  const pins = ready?.pins ?? {};
  const heading = useRef<HTMLHeadingElement>(null);
  const workspace = useRef<HTMLDivElement>(null);
  const openedEvidence = useRef<{ object: string | undefined; source: EvidenceKey } | null>(null);

  useEffect(() => {
    if (activeSource) {
      openedEvidence.current = { object, source: activeSource };
      return;
    }
    const previous = openedEvidence.current;
    openedEvidence.current = null;
    const sourceLink = previous?.object === object && workspace.current?.querySelector<HTMLElement>(
      `[data-source-link="${previous.source}"]`,
    );
    if (sourceLink) sourceLink.focus();
    else heading.current?.focus({ preventScroll: true });
  }, [activeSource, object]);

  const href = (next?: ExploreObjectKey) => exploreHref(query, next, undefined, pinsForObject(next, pins));
  const evidenceLink: EvidenceLink = (source) => {
    const compatiblePins = { ...pins, document: pins.document?.ref === documentRefs[source] ? pins.document : undefined };
    const to = exploreHref(query, key, source, compatiblePins);
    return { to, state: { evidenceOpened: to }, "data-source-link": source };
  };
  const closeEvidence = () => {
    if (location.state?.evidenceOpened === location.pathname + location.search) navigate(-1);
    else navigate(href(key), { replace: true, state: location.state });
  };
  const isMetricEvidence = activeEvidence?.key === "iea";
  const pinnedEvidenceHref = activeEvidence && exploreHref(query, key, activeEvidence.key, {
    observation: isMetricEvidence && measurement
      ? { ref: measurement.observation.id, version: measurement.observation.version }
      : pins.observation,
    document: { ref: activeEvidence.document.id, version: activeEvidence.document.version },
  });
  const stepIndex = investigation.indexOf(key);
  const previous = stepIndex > 0 ? investigation[stepIndex - 1] : undefined;
  const next = investigation[stepIndex + 1];
  const wafer = resolveExploreObject(exploreObjects.topcon.relatedElementRef);

  return (
    <div ref={workspace}>
      <header className="ax-heading" data-object-ref={current.id} data-object-kind={current.kind}>
        <p className="g2-mono ax-kicker">
          {current.kind}
          {key === "china" && ` / ${exploreObjects.china.lens}`}
        </p>
        <h1 tabIndex={-1} ref={heading}>{current.name}</h1>
        {current.kind === "TechnologyVariant" && <p className="ax-taxonomy">
          {primaryAncestors(current).map((ancestor) => (
            <span key={ancestor.id} className="ax-taxonomy">
              <Link className="ax-text-link" to={href(ancestor.key)}>{ancestor.name}</Link>
              <ChevronRight size={14} aria-hidden="true" />
            </span>
          ))}
          {current.name}
        </p>}
        {key === "pv-wafer" && <p className="ax-taxonomy">Solar PV <ChevronRight size={14} aria-hidden="true" /> {exploreObjects["pv-wafer"].role}</p>}
        <p className="ax-lead">{current.summary}</p>
      </header>

      {selection.state !== "READY" ? (
        <div className="ax-notice">
          <p role="status"><strong>{selection.state}</strong> · {selection.reason}</p>
          <Link className="ax-text-link" to={exploreHref(query, key)} replace>
            Abrir contexto atual <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>
      ) : (
        <div className="ax-layout">
          <div className="ax-reading">
            {(key === "solar-pv" || key === "c-si") && (
              <section className="ax-section">
                <h2>{key === "solar-pv" ? "Como a conversão funciona" : "Do silício à célula"}</h2>
                <p>{key === "solar-pv"
                  ? "A luz absorvida pelo semicondutor gera portadores de carga. A célula separa e coleta essas cargas para produzir corrente elétrica."
                  : "O wafer cristalino serve de substrato para a célula. O processamento forma as regiões que separam as cargas e os contatos que coletam a corrente."}</p>
                <Link className="ax-text-link" {...evidenceLink("doe")}>
                  Ver referência técnica do DOE <ArrowRight size={15} aria-hidden="true" />
                </Link>
              </section>
            )}
            {key === "topcon" && wafer && <TechnologyProfile waferHref={href(wafer.key)} evidenceLink={evidenceLink} />}
            {key === "solar-pv" && <section className="ax-section">
              <h2>Fronteira de pesquisa</h2>
              <Link className="ax-text-link" to={objectPath(query, tandemKey)}>Explorar tandem perovskita–silício</Link>
            </section>}
            {key === "topcon" && <section className="ax-section">
              <h2>Marcos com célula inferior TOPCon</h2>
              <ul className="ax-rail-list">
                {milestoneEntries.filter((entry) => hasTopconRelationship(entry.id)).map((entry) => (
                  <li key={entry.id}><Link to={objectPath(query, entry.id)}>{entry.name}</Link></li>
                ))}
              </ul>
            </section>}
            {measurement && <>
              {key === "pv-wafer" && <section className="ax-section">
                <h2>Do lingote à célula</h2>
                <p>O lingote é cortado em lâminas. O wafer fornece o silício cristalino que absorve luz.
                  O contato TOPCon é acrescentado durante o processamento da célula, depois da fabricação do wafer.</p>
              </section>}
              <WaferMetric measurement={measurement} pinned={!!pins.observation} evidenceLink={evidenceLink} />
              {key === "pv-wafer" && <ValueChain waferHref={href("pv-wafer")} selected />}
            </>}
            {key === "china" && <section className="ax-section">
              <h2>Política comercial</h2>
              <Link className="ax-text-link" to={objectPath(query, currentKey)}>Evento na jurisdição · Anúncio 18/2025</Link>
            </section>}
            <nav className="ax-next" aria-label="Objetos relacionados">
              <Link className="ax-text-link" to={href(previous)}><ArrowLeft size={16} aria-hidden="true" />
                {previous ? `Voltar a ${exploreObjects[previous].name}` : "Voltar à busca"}
              </Link>
              {next && (
                <Link className="ax-text-link" to={href(next)}>
                  {key === "pv-wafer" ? "Ver manufatura na China" : `Explorar ${exploreObjects[next].name}`}
                  <ArrowRight size={16} aria-hidden="true" />
                </Link>
              )}
            </nav>
          </div>
          {activeEvidence && pinnedEvidenceHref ? <EvidenceInspector
            document={activeEvidence.document} source={activeEvidence.source}
            observation={isMetricEvidence ? measurement?.observation : undefined}
            pinned={!!pins.document} pinnedHref={pinnedEvidenceHref} onClose={closeEvidence}
          /> :
            <aside className="ax-rail" aria-labelledby="ax-sources">
              <h2 id="ax-sources"><FileText size={19} aria-hidden="true" /> Fontes e evidência</h2>
              <ul className="ax-rail-list">
                {sources.map((entry) => <li key={entry.key}><Link {...evidenceLink(entry.key)}>{entry.label}<ArrowRight size={15} aria-hidden="true" /></Link></li>)}
              </ul>
              <p className="ax-muted">Curadoria manual · Atribuição e direitos em cada fonte.</p>
            </aside>}
        </div>
      )}
    </div>
  );
}
