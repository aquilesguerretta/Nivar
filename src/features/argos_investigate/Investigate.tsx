import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import { EvidenceDrawer } from "./EvidenceDrawer";
import { evidenceHistory, investigationParams, objectKinds, readEvidence, readPin, searchObjects, supportedRelations } from "./reading";
import type { EvidencePin, InvestigateCatalog, InvestigateObject, ReadingResult } from "./reading";
import "./investigate.css";

const suggestedQueries = ["TOPCon", "China wafers 2024", "Evento MOFCOM", "Pesquisa tandem"];
const failures = {
  unresolved: "A referência ou a versão solicitada não está disponível neste recorte.",
  restricted: "A evidência solicitada tem acesso restrito neste recorte.",
};

function SearchField({ query, onSearch }: { query: string; onSearch: (query: string) => void }) {
  const [draft, setDraft] = useState(query);
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSearch(draft.trim());
  }
  return (
    <form className="ai-search" role="search" onSubmit={submit}>
      <label className="nv-sr" htmlFor="ai-query">Buscar no acervo</label>
      <input id="ai-query" type="search" value={draft} onChange={(event) => setDraft(event.target.value)}
        placeholder="Busque uma tecnologia, um país, um evento…" maxLength={180} />
      <button type="submit" className="ai-primary">Buscar <span aria-hidden="true">↗</span></button>
    </form>
  );
}

function ResultList({ catalog, query }: { catalog: InvestigateCatalog; query: string }) {
  const groups = searchObjects(catalog, query);
  const count = groups.reduce((total, group) => total + group.objects.length, 0);
  if (!count) return <p className="ai-empty" role="status">Nenhum objeto no acervo para esta busca. O recorte disponível não estabelece uma resposta.</p>;
  return (
    <div className="ai-index">
      <p className="ai-kicker" role="status">{count} {count === 1 ? "resultado" : "resultados"}</p>
      {groups.map(({ kind, label, objects }) => (
        <section className="ai-index-group" key={kind} aria-label={label}>
          <h2>{label}</h2>
          <ul>
            {objects.map((object) => (
              <li key={object.id}>
                <Link to={{ search: investigationParams(query, object.id).toString() }}>
                  {object.title}<span aria-hidden="true">↗</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}

function ObjectReading({ catalog, object, query, pin }: {
  catalog: InvestigateCatalog;
  object: InvestigateObject;
  query: string;
  pin?: EvidencePin;
}) {
  const [active, setActive] = useState<string>();
  const opener = useRef<HTMLButtonElement>(null);
  const read = (ref: string): ReadingResult => readEvidence(catalog, object, ref, pin?.ref === ref ? pin : undefined);
  const selected = active ? read(active) : undefined;
  const relations = supportedRelations(catalog, object, pin).map(({ predicate, linked }) => {
    const linkedPin = pin && linked.evidence.includes(pin.ref) ? pin : undefined;
    return { predicate, linked, search: investigationParams(query, linked.id, linkedPin).toString() };
  });

  function closeDrawer() {
    setActive(undefined);
    // The native modal must leave the top layer before the original control can take focus.
    requestAnimationFrame(() => opener.current?.focus());
  }

  return (
    <div className="ai-reading-layout">
      <article aria-label="Leitura editorial">
        {object.evidence.length === 0 && <p className="ai-empty">A evidência disponível ainda não estabelece uma resposta.</p>}
        {object.evidence.map((ref) => {
          const item = read(ref);
          if (item.state !== "ready") return <p key={ref} className="ai-empty">{failures[item.state]}</p>;
          return (
            <section className="ai-entry" key={ref}>
              {pin?.ref === ref && (
                <p className="ai-kicker">{item.historical ? "Versão histórica" : "Versão fixada"} · {item.revision.version}</p>
              )}
              <h2>{item.revision.heading}</h2>
              {item.revision.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              <p className="ai-limit"><strong>Limite da evidência</strong> {item.revision.limit}</p>
              <button type="button" aria-haspopup="dialog" className="ai-evidence-button" onClick={(event) => {
                opener.current = event.currentTarget;
                setActive(ref);
              }}>Ver evidência <span aria-hidden="true">↗</span><span className="nv-sr"> · {item.revision.heading}</span></button>
            </section>
          );
        })}
      </article>
      <aside className="ai-context" aria-label="Contexto do objeto">
        {object.imagePlaceholder && (
          <figure className="ai-image-slot">
            <div aria-hidden="true" className="ai-image-frame">Imagem reservada</div>
            <figcaption>{object.imagePlaceholder}</figcaption>
          </figure>
        )}
        {relations.length > 0 && (
          <nav aria-label="Relações do objeto">
            <h2>Relações</h2>
            <ul>
              {relations.map(({ predicate, linked, search }) => (
                <li key={predicate + linked.id}>
                  <span className="ai-kicker">{predicate} · {objectKinds[linked.kind]}</span>
                  <Link to={{ search }} state={{ from: investigationParams(query, object.id, pin).toString() }}>
                    {linked.title} <span aria-hidden="true">↗</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </aside>
      {selected?.state === "ready" && active && (
        <EvidenceDrawer reading={selected.revision} historical={selected.historical}
          versions={evidenceHistory(catalog, object, active)} query={query} objectId={object.id} onClose={closeDrawer} />
      )}
    </div>
  );
}

export function Investigate({ catalog }: { catalog: InvestigateCatalog }) {
  const [params, setParams] = useSearchParams();
  const location = useLocation();
  const title = useRef<HTMLHeadingElement>(null);
  const lastLocation = useRef(location.key);
  const query = params.get("q") ?? "";
  const objectRefs = params.getAll("object");
  const parsedPin = readPin(params);
  const pin = parsedPin === "invalid" ? undefined : parsedPin ?? undefined;
  const object = objectRefs.length === 1 ? catalog.objects.find(({ id }) => id === objectRefs[0]) : undefined;
  const pinnedReading = object && pin ? readEvidence(catalog, object, pin.ref, pin) : undefined;
  const failure = parsedPin === "invalid" || (objectRefs.length > 0 && !object) || (pin && !object)
    ? "unresolved"
    : pinnedReading && pinnedReading.state !== "ready" ? pinnedReading.state : undefined;
  const origin = typeof location.state?.from === "string" ? location.state.from : undefined;
  const home = !query && !object && !failure;

  useEffect(() => {
    if (lastLocation.current === location.key) return;
    lastLocation.current = location.key;
    title.current?.focus({ preventScroll: true });
    window.scrollTo(0, 0);
  }, [location.key]);

  return (
    <main className="ai-workspace">
      <div className="ai-masthead">
        <Link to={{ search: "" }} aria-label="ARGOS · início do Investigate">ARGOS</Link>
        <span>Investigate</span>
      </div>
      <header className="ai-search-region">
        {home && <><h1 ref={title} tabIndex={-1}>Investigue o setor energético</h1>
          <p>Encontre um objeto no acervo e siga suas relações até os documentos que sustentam a leitura.</p></>}
        <SearchField key={query} query={query} onSearch={(value) => setParams(investigationParams(value))} />
        {home && (
          <nav className="ai-suggestions" aria-label="Buscas sugeridas">
            {suggestedQueries.map((suggestion) => (
              <Link key={suggestion} to={{ search: investigationParams(suggestion).toString() }}>{suggestion}</Link>
            ))}
          </nav>
        )}
      </header>
      {failure && (
        <section className="ai-heading">
          <h1 ref={title} tabIndex={-1}>{failure === "restricted" ? "Acesso restrito" : "Referência não resolvida"}</h1>
          <p>{failures[failure]}</p>
          <Link to={{ search: investigationParams(query).toString() }}>Voltar à busca</Link>
        </section>
      )}
      {!failure && object && (
        <>
          <header className="ai-heading">
            <nav aria-label="Voltar na investigação">
              <Link to={{ search: origin ?? investigationParams(query).toString() }}>
                <span aria-hidden="true">← </span>{origin ? "Voltar ao objeto anterior" : query ? "Voltar aos resultados" : "Voltar à busca"}
              </Link>
            </nav>
            <p className="ai-kicker">{objectKinds[object.kind]}</p>
            <h1 ref={title} tabIndex={-1}>{object.title}</h1>
          </header>
          <ObjectReading key={location.key} catalog={catalog} object={object} query={query} pin={pin} />
        </>
      )}
      {!failure && !object && query && (
        <>
          <header className="ai-heading">
            <h1 ref={title} tabIndex={-1}>{query}</h1>
          </header>
          <ResultList catalog={catalog} query={query} />
        </>
      )}
    </main>
  );
}
