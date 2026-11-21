import { useEffect, useRef } from "react";
import { ArrowRight, ChevronRight, Search } from "lucide-react";
import { Link, Navigate, useLocation, useParams, useSearchParams } from "react-router-dom";
import { NivarShell } from "../../components/g2/NivarShell";
import { isExploreObject } from "../../lib/argos/globalExplore";
import GlobalExplore from "../../pages/argos/GlobalExplore";
import "../../pages/argos/global-explore.css";
import {
  ancestry, companiesKey, currentKey, entryFor, searchCatalog, sharedRefs, tandemKey,
} from "./catalog";
import { CurrentReading } from "./CurrentReading";
import { FrontierReading } from "./FrontierReading";
import { ExploreLink, ReturnToOrigin } from "./navigation";
import { explorePath, objectPath } from "./paths";
import "./global-experience.css";

type Entry = NonNullable<ReturnType<typeof entryFor>>;
const journeyLinks = [
  { label: "Tecnologias", key: sharedRefs.solarPv },
  { label: "Atualidades", key: currentKey },
  { label: "Fronteira de pesquisa", key: tandemKey },
] as const;
const companies = "Empresas e ativos";

function SearchIndex({ query, update }: { query: string; update: (query: string) => void }) {
  const results = searchCatalog(query);
  const groups = new Map<Entry["kind"], Entry[]>();
  for (const entry of results) {
    const group = groups.get(entry.kind);
    if (group) group.push(entry);
    else groups.set(entry.kind, [entry]);
  }
  const labels: Record<Entry["kind"], string> = {
    Technology: "Tecnologias",
    TechnologyVariant: "Variantes",
    TechnologyElement: "Elementos",
    Country: "Países",
    Event: "Eventos",
    Document: "Documentos",
    ResearchMilestone: "Marcos de pesquisa",
  };

  return (
    <div className="ax-layout">
      <section className="ax-search" aria-label="Busca de objetos ARGOS">
        <label htmlFor="ax-query">Buscar objetos</label>
        <div className="ax-input">
          <Search size={20} aria-hidden="true" />
          <input id="ax-query" type="search" placeholder="Tecnologia, país, evento ou marco" value={query}
            onChange={(event) => update(event.target.value)} />
        </div>
        <p className="g2-mono ax-results-label" role="status">
          {query.trim() ? `${results.length} ${results.length === 1 ? "resultado" : "resultados"}` : "Objetos disponíveis"}
        </p>
        {[...groups].map(([kind, items]) => (
          <section className="ax-result-group" key={kind}>
            <h2>{labels[kind]}</h2>
            <ul className="ax-results">
              {items.map((entry) => (
                <li key={entry.id}><ExploreLink to={objectPath(query, entry.id)} data-object-ref={entry.id}>
                  <div><strong>{entry.name}</strong><small>{entry.summary}</small></div>
                  <ArrowRight size={18} aria-hidden="true" />
                </ExploreLink></li>
              ))}
            </ul>
          </section>
        ))}
        {!results.length && <p className="ax-notice">UNRESOLVED · Nenhum objeto neste recorte corresponde à busca.</p>}
      </section>
      <aside className="ax-rail ax-explore-rail" aria-labelledby="ax-journeys">
        <img src="/g2/g21/emblems/argos-hero-600.webp" alt="" width={600} height={400} />
        <h2 id="ax-journeys">Percursos de investigação</h2>
        <ul className="ax-rail-list">
          {journeyLinks.map(({ key, label }) => (
            <li key={key}><ExploreLink to={objectPath(query, key)}>{label}<ArrowRight size={15} aria-hidden="true" /></ExploreLink></li>
          ))}
          <li><ExploreLink to={explorePath(query, companiesKey)}>{companies}<small>Indisponível</small></ExploreLink></li>
        </ul>
      </aside>
    </div>
  );
}

function Breadcrumb({ entry, query, label }: { entry?: Entry; query: string; label: string }) {
  const trail = entry ? ancestry(entry) : [];
  return (
    <nav aria-label="Trilha da investigação" className="ax-breadcrumb">
      <ol>
        <li><ExploreLink to={explorePath(query)}>Explore</ExploreLink></li>
        {trail.slice(0, -1).map((parent) => (
          <li key={parent.id}><ChevronRight size={13} aria-hidden="true" />
            <ExploreLink to={objectPath(query, parent.id)}>{parent.name}</ExploreLink></li>
        ))}
        <li><ChevronRight size={13} aria-hidden="true" /><span aria-current="page">{label}</span></li>
      </ol>
    </nav>
  );
}

export default function GlobalExperience() {
  const { object } = useParams();
  const { pathname, search, state } = useLocation();
  const [params, setParams] = useSearchParams();
  const query = params.get("q") ?? "";
  const entry = entryFor(object);
  const workspace = useRef<HTMLDivElement>(null);
  const companiesView = object === companiesKey;
  const label = entry?.name ?? (companiesView ? companies : object ? "Objeto indisponível" : "Explorar tecnologias");
  const evidenceOutput = params.getAll("output");
  const restricted = evidenceOutput.length > 0 && (evidenceOutput.length !== 1 || evidenceOutput[0] !== "summary-and-metadata");
  const unexpectedPin = !entry && ["evidence", "observation_ref", "observation_version", "document_ref", "document_version"]
    .some((field) => params.has(field));

  useEffect(() => {
    if (workspace.current?.querySelector(".ax-inspector")) return;
    workspace.current?.querySelector<HTMLHeadingElement>("h1")?.focus({ preventScroll: true });
  }, [pathname]);

  if (entry && object !== entry.key) {
    return <Navigate to={explorePath("", entry.key) + search} replace state={state} />;
  }

  let content;
  if (restricted || unexpectedPin) {
    content = <p className="ax-notice" role="status">Evidência indisponível para esta referência ou formato.</p>;
  } else if (!object) {
    content = <SearchIndex query={query} update={(value) => setParams(value ? { q: value } : {}, { replace: true })} />;
  } else if (companiesView) {
    content = <p className="ax-notice" role="status">A jornada Petrobras → Mero aguarda a integração da revisão de evidência.</p>;
  } else if (entry?.journey === "current") {
    content = <CurrentReading key={entry.id} entry={entry} />;
  } else if (entry?.journey === "frontier") {
    content = <FrontierReading key={entry.id} entry={entry} />;
  } else if (!entry) {
    content = <p className="ax-notice" role="status">UNRESOLVED · Referência fora do recorte local. <Link to={explorePath(query)}>Voltar à busca</Link></p>;
  }

  return (
    <NivarShell family="intelligence" title={entry ? `${label} · ARGOS Explore` : "ARGOS Explore"} compactFooter>
      <div className="g2-container ax-workspace" ref={workspace}>
        <div className="ax-bar">
          <ExploreLink to={explorePath(query)} className="ax-signature"><span>ARGOS</span> Explore</ExploreLink>
          <span className="g2-mono">Ambiente local</span>
        </div>
        <nav className="ax-global-nav" aria-label="Áreas do ARGOS Explore">
          {journeyLinks.map(({ key, label }) => (
            <ExploreLink key={key} to={objectPath(query, key)} aria-current={entry?.id === entryFor(key)?.id ? "page" : undefined}>{label}</ExploreLink>
          ))}
          <ExploreLink to={explorePath(query, companiesKey)} aria-current={companiesView ? "page" : undefined}>{companies} <small>Indisponível</small></ExploreLink>
        </nav>
        {object && <Breadcrumb entry={entry} query={query} label={label} />}
        {object && <ReturnToOrigin />}
        {entry?.journey === "technology" && isExploreObject(entry.key) && !restricted
          ? <GlobalExplore object={entry.key} />
          : <header className="ax-heading" data-object-ref={entry?.id} data-object-kind={entry?.kind}>
            {entry && <p className="g2-mono ax-kicker">{entry.kind}</p>}
            <h1 tabIndex={-1}>{label}</h1>
            {!object && <p className="ax-lead">Investigue tecnologias, eventos e marcos de pesquisa no índice de inteligência energética global.</p>}
            {entry && entry.kind !== "Event" && <p className="ax-lead">{entry.summary}</p>}
          </header>}
        {content}
      </div>
    </NivarShell>
  );
}
