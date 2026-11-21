import { useSearchParams } from "react-router-dom";
import {
  claims, controlledItem, journeyRelations, legalStatusLimit, relationshipLabels, suspensionAt,
  suspensionTargetLabel, suspensionTargets, timeline, type TimelineKey,
} from "../argos-current-energy/case";
import { ClaimText, Day, DocumentMetadata, EffectiveDates } from "../argos-current-energy/EvidenceInspector";
import { documents, resolveDocument } from "../argos-current-energy/documents";
import { reviewCutoff, type Claim, type Document } from "../argos-current-energy/model";
import { applicationsForMaterial, aprilDocumentKey, currentKey, entryFor, materialKey } from "./catalog";
import { Evidence } from "./Evidence";
import { ExploreLink } from "./navigation";
import { explorePath, objectPath, readDisclosure, readPair } from "./paths";

function supportingDocuments(relevant: readonly Claim[], extra: readonly Document[]) {
  const references = new Map<string, Document>();
  for (const record of extra) references.set(`${record.id}/${record.version}`, record);
  for (const claim of relevant) {
    for (const { document } of claim.evidence) {
      const record = resolveDocument(document);
      if (record) references.set(`${record.id}/${record.version}`, record);
    }
  }
  return [...references.values()];
}

function Scope() {
  const continuation = suspensionAt(suspensionTargets[0], reviewCutoff.slice(0, 10));
  return (
    <section className="ax-section">
      <h2>Situação no corte da revisão</h2>
      <ClaimText claim={claims.registry} />
      {continuation && <>
        <ClaimText claim={timeline.continuation.claim} />
        <p>Atos abrangidos · {suspensionTargetLabel}. Período publicado · <EffectiveDates effective={continuation.effective} />.</p>
      </>}
      <p>Efeito empresarial não estabelecido. Nenhum Signal validado está vinculado a este evento.</p>
    </section>
  );
}

export function CurrentReading({ entry }: { entry: NonNullable<ReturnType<typeof entryFor>> }) {
  const [params] = useSearchParams();
  const query = params.get("q") ?? "";
  const eventKey = (Object.keys(timeline) as TimelineKey[]).find((key) => timeline[key].id === entry.id);
  const event = eventKey && timeline[eventKey];
  const record = eventKey && resolveDocument(timeline[eventKey].document);
  const original = entry.key === aprilDocumentKey;
  const pin = readPair(params, "document");
  const disclosure = readDisclosure(params);
  let relevant: readonly Claim[];
  if (eventKey === "april") relevant = [timeline.april.claim, claims.registry, timeline.continuation.claim, claims.rationale];
  else if (event) relevant = [event.claim];
  else if (original) relevant = [timeline.april.claim, claims.item];
  else if (entry.key === materialKey) relevant = [claims.item, claims.application, claims.faq5];
  else relevant = [claims.application, claims.faq5, claims.jurisdiction];
  const sources = supportingDocuments(relevant, original || eventKey === "april" ? [documents.english] : []);
  const selected = pin && sources.find((source) => source.id === pin.ref && String(source.version) === pin.version);
  const invalid = readPair(params, "observation") !== null || pin === false ||
    disclosure === "invalid" || (pin !== null && !selected) ||
    (disclosure === "open" && !selected) ||
    (disclosure === "closed" && pin !== null && (!original || selected !== documents.april));

  if (invalid) return <p className="ax-notice" role="status">Evidência indisponível para esta referência ou versão.</p>;

  return (
    <div className="ax-layout">
      <div className="ax-reading">
        <section className="ax-section">
          <p className="g2-mono ax-kicker">Corte da revisão · <time dateTime={reviewCutoff}>{reviewCutoff}</time></p>
          {event && <p>Evento histórico · <Day value={event.occurredOn} /> · China</p>}
          {record?.effective && <p>Vigência documentada · <EffectiveDates effective={record.effective} /></p>}
          <ClaimText claim={relevant[0]} />
          {eventKey && eventKey !== "april" && <p>{legalStatusLimit}</p>}
          {(eventKey === "suspension" || eventKey === "continuation") && <p>Atos abrangidos · {suspensionTargetLabel}.</p>}
          {original && <ClaimText claim={claims.item} />}
          {entry.key === materialKey && <p>Localizador no original · {controlledItem.itemCode}</p>}
          {entry.kind === "TechnologyVariant" && <ClaimText claim={claims.faq5} />}
          {eventKey === "april" && <ExploreLink className="ax-text-link" to={objectPath(query, aprilDocumentKey)}>
            {relationshipLabels[journeyRelations[0].type]} · {documents.april.title}
          </ExploreLink>}
          {original && <ExploreLink className="ax-text-link" to={objectPath(query, materialKey)}>
            {relationshipLabels[journeyRelations[1].type]} · NdFeB com disprósio
          </ExploreLink>}
          {entry.key === materialKey && applicationsForMaterial.map((application) => (
            <ExploreLink key={application.id} className="ax-text-link" to={objectPath(query, application.id)}>
              {relationshipLabels[journeyRelations[2].type]} · {application.name}
            </ExploreLink>
          ))}
          {entry.kind === "TechnologyVariant" && <ClaimText claim={claims.jurisdiction} />}
          {(eventKey === "april" || entry.kind === "TechnologyVariant") && (
            <ExploreLink className="ax-text-link" to={objectPath(query, timeline.april.jurisdiction)}>
              {relationshipLabels[journeyRelations[3].type]} · China
            </ExploreLink>
          )}
          {eventKey === "procedure" && <ExploreLink className="ax-text-link" to={objectPath(query, timeline.questioning.id)}>
            Procedimento revogado · {documents.questioning.title}
          </ExploreLink>}
          {eventKey === "questioning" && <ExploreLink className="ax-text-link" to={objectPath(query, timeline.procedure.id)}>
            Ato posterior · {documents.procedure.title}
          </ExploreLink>}
        </section>
        {entry.key === currentKey && <>
          <Scope />
          <section className="ax-section">
            <h2>Cronologia jurídica</h2>
            <ol className="ax-rail-list ax-current-timeline">
              {Object.entries(timeline).map(([key, item]) => (
                <li key={item.id}><Day value={item.occurredOn} />{key === "april"
                  ? <span> · {documents.april.title}</span>
                  : <ExploreLink to={objectPath(query, item.id)}>{documents[key as TimelineKey].title}</ExploreLink>}
                </li>
              ))}
            </ol>
          </section>
        </>}
      </div>
      <Evidence
        links={sources.map((source) => ({
          title: source.title,
          to: explorePath(query, entry.key, {
            evidence: "document", document_ref: source.id, document_version: String(source.version),
          }),
        }))}
        closeTo={objectPath(query, entry.id)}
      >
        {disclosure === "open" && selected && <>
          <h3>{selected.title}</h3>
          <DocumentMetadata record={selected} />
          {relevant.map((claim) => {
            const ref = claim.evidence.find(({ document }) => document.id === selected.id && document.version === selected.version);
            return ref && <div key={claim.id}>
              <p className="ax-muted">Localizador na fonte · {ref.locator}</p>
              <ClaimText claim={claim} />
            </div>;
          })}
        </>}
      </Evidence>
    </div>
  );
}
