import { useEffect, useRef, useSyncExternalStore } from "react";
import {
  applications, china, claims, controlledItem, journeyRelations, legalStatusLimit, material, relationshipLabels,
  suspensionAt, suspensionTargetLabel, suspensionTargets, timeline,
} from "./case.ts";
import type { TimelineKey } from "./case.ts";
import { documents, resolveDocument } from "./documents.ts";
import { ClaimText, Day, DocumentMetadata, EffectiveDates, EvidenceInspector } from "./EvidenceInspector.tsx";
import { reviewCutoff } from "./model.ts";
import { actionContext, readView, steps } from "./navigation.ts";
import type { Context } from "./navigation.ts";
import "./current-energy.css";

const stepKeys = Object.keys(steps) as (keyof typeof steps)[];
const evidenceByStep = {
  evento: [timeline.april.claim, claims.registry, timeline.continuation.claim, claims.rationale],
  documento: [timeline.april.claim, claims.item],
  material: [claims.item, claims.application, claims.faq5],
  aplicacao: [claims.application, claims.faq5, claims.jurisdiction],
  china: [claims.jurisdiction, claims.registry, timeline.continuation.claim],
};

function subscribe(onChange: () => void) {
  window.addEventListener("hashchange", onChange);
  return () => window.removeEventListener("hashchange", onChange);
}

function getHash() {
  return window.location.hash;
}

function EventTimeline() {
  return (
    <section aria-labelledby="timeline-title">
      <h2 id="timeline-title">Cronologia jurídica</h2>
      <ol className="j3-timeline">
        {(Object.keys(timeline) as TimelineKey[]).map((key) => {
          const event = timeline[key];
          const record = resolveDocument(event.document);
          if (!record) return null;
          return (
            <li key={event.id} data-event={event.id}>
              <Day value={event.occurredOn} /> · <a href={"#" + actionContext(key)}>{record.title}</a>
              {record.effective && <p>Vigência documentada · <EffectiveDates effective={record.effective} /></p>}
            </li>
          );
        })}
      </ol>
    </section>
  );
}

function SuspensionScope({ period }: { period: (typeof documents.continuation)["effective"] }) {
  return (
    <p>
      Atos abrangidos · {suspensionTargetLabel}. Os quatro primeiros foram emitidos pelo MOFCOM e pela GACC.
      Os números 61 e 62 foram emitidos pelo MOFCOM. Intervalo publicado · <EffectiveDates effective={period} />.
    </p>
  );
}

function EventOverview() {
  const continuationAtReview = suspensionAt(suspensionTargets[0], reviewCutoff.slice(0, 10));
  return (
    <>
      <p>Evento histórico · <Day value={timeline.april.occurredOn} /> · China · Política comercial e minerais críticos</p>
      <ClaimText claim={timeline.april.claim} />
      <section aria-labelledby="status-title">
        <h2 id="status-title">Situação no corte da revisão</h2>
        <ClaimText claim={claims.registry} />
        {continuationAtReview && (
          <>
            <ClaimText claim={timeline.continuation.claim} />
            <SuspensionScope period={continuationAtReview.effective} />
          </>
        )}
      </section>
      <EventTimeline />
      <p>Efeito empresarial não estabelecido. Nenhum Signal validado está vinculado a este evento.</p>
    </>
  );
}

function LegalDocument({ action }: { action: TimelineKey }) {
  const event = timeline[action];
  const record = resolveDocument(event.document);
  if (!record) return <p>Documento indisponível para esta versão.</p>;
  return (
    <>
      <ClaimText claim={event.claim} />
      {(action === "suspension" || action === "continuation") && <SuspensionScope period={record.effective} />}
      {action !== "april" && <p>{legalStatusLimit}</p>}
      {action === "procedure" && <p>Procedimento revogado · <a href="#cronologia/questioning">{documents.questioning.title}</a></p>}
      {action === "questioning" && <p>Ato posterior · <a href="#cronologia/procedure">{documents.procedure.title}</a></p>}
      {action === "april" && <ClaimText claim={claims.item} />}
      <h2>Identificação do documento</h2>
      <DocumentMetadata record={record} />
    </>
  );
}

function JourneyLinks({ context }: { context: keyof typeof steps }) {
  const index = stepKeys.indexOf(context);
  const previous = stepKeys[index - 1];
  const next = stepKeys[index + 1];
  return (
    <nav aria-label="Percurso do evento" className="j3-actions">
      {previous && <a href={"#" + previous}>Voltar: {steps[previous]}</a>}
      {next && (
        <a href={"#" + next} data-relationship={journeyRelations[index].type}>
          {relationshipLabels[journeyRelations[index].type]} · {steps[next]}
        </a>
      )}
      <a href={"#evidencias/" + context}>Verificar evidências</a>
    </nav>
  );
}

function StepContent({ context }: { context: keyof typeof steps }) {
  switch (context) {
    case "evento": return <EventOverview />;
    case "documento": return <LegalDocument action="april" />;
    case "material": return (
      <section aria-label="Material controlado" data-element={material.id}>
        <ClaimText claim={claims.item} />
        <dl>
          <dt>Localizador no original</dt><dd>{controlledItem.itemCode} · Anúncio 18/2025</dd>
          <dt>Formas abrangidas</dt><dd>Ímã e pó magnético</dd>
        </dl>
      </section>
    );
    case "aplicacao": return (
      <>
        <ul><li>{applications.motor.name}</li><li>{applications.generator.name}</li></ul>
        <ClaimText claim={claims.application} />
        <ClaimText claim={claims.faq5} />
      </>
    );
    case "china": return <section aria-label="Jurisdição" data-country={china.id}><ClaimText claim={claims.jurisdiction} /></section>;
  }
}

function evidenceContext(origin: Context) {
  const target = readView("#" + origin);
  const relatedDocuments = target.kind === "step" && (target.context === "evento" || target.context === "documento")
    ? [documents.english]
    : [];
  if (target.kind === "action") {
    return { title: documents[target.action].title, claims: [timeline[target.action].claim], relatedDocuments };
  }
  return target.kind === "step"
    ? { title: steps[target.context], claims: evidenceByStep[target.context], relatedDocuments }
    : undefined;
}

export default function CurrentEnergy() {
  const hash = useSyncExternalStore(subscribe, getHash);
  const heading = useRef<HTMLHeadingElement>(null);
  const previousHash = useRef(hash);
  useEffect(() => {
    if (hash !== previousHash.current) {
      previousHash.current = hash;
      heading.current?.focus({ preventScroll: true });
      window.scrollTo(0, 0);
    }
  }, [hash]);

  const view = readView(hash);
  const title = view.kind === "step" ? steps[view.context]
    : view.kind === "action" ? documents[view.action].title
    : view.kind === "evidence" ? "Evidências" : "Referência indisponível";
  const evidence = view.kind === "evidence" ? evidenceContext(view.origin) : undefined;

  return (
    <main className="j3-current-energy">
      <header>
        <p><a href="#evento">ARGOS Current Energy</a> · Protótipo local</p>
        <h1 ref={heading} tabIndex={-1}>{title}</h1>
        <p>Corte da revisão · <time dateTime={reviewCutoff}>{reviewCutoff}</time></p>
      </header>
      {view.kind === "step" && (
        <>
          <JourneyLinks context={view.context} />
          <StepContent context={view.context} />
        </>
      )}
      {view.kind === "action" && (
        <>
          <nav aria-label="Cronologia do evento" className="j3-actions">
            <a href="#evento">Voltar ao evento</a>
            <a href={"#evidencias/" + view.context}>Verificar evidências</a>
          </nav>
          <LegalDocument action={view.action} />
        </>
      )}
      {view.kind === "evidence" && evidence && (
        <>
          <nav aria-label="Retorno da evidência" className="j3-actions">
            <a href={"#" + view.origin}>Voltar: {evidence.title}</a>
          </nav>
          <EvidenceInspector claims={evidence.claims} relatedDocuments={evidence.relatedDocuments} />
        </>
      )}
      {view.kind === "unavailable" && <p><a href="#evento">Voltar ao evento</a></p>}
    </main>
  );
}