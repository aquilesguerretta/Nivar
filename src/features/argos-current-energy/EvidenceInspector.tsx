import { resolveDocument } from "./documents.ts";
import { reviewCutoff } from "./model.ts";
import type { Claim, Document, EffectivePeriod } from "./model.ts";

const claimKinds: Record<Claim["kind"], string> = {
  observed_fact: "Fato observado",
  actor_statement: "Declaração do emissor",
  nivar_analysis: "Análise técnica da NIVAR",
};

const authorities: Record<Document["authority"], string> = {
  original: "Instrumento oficial no idioma autêntico",
  "gazette-reprint": "Republicação oficial em gazeta",
  "reference-translation": "Tradução oficial para referência. O original em chinês é autêntico.",
  register: "Registro oficial informativo",
  "issuer-guidance": "Orientação do emissor",
  "issuer-statement": "Declaração do emissor",
  technical: "Fonte técnica",
};

export function Day({ value }: { value: string }) {
  const label = new Intl.DateTimeFormat("pt-BR", { dateStyle: "medium", timeZone: "UTC" }).format(new Date(value));
  return <time dateTime={value}>{label}</time>;
}

export function EffectiveDates({ effective }: { effective: EffectivePeriod | null }) {
  if (!effective) return <>UNKNOWN</>;
  return <><Day value={effective.from} />{effective.through && <> a <Day value={effective.through} /></>}</>;
}

export function ClaimText({ claim }: { claim: Claim }) {
  return (
    <div data-claim={claim.id} data-version={claim.version}>
      <small>{claimKinds[claim.kind]} · Nota de trabalho da NIVAR</small>
      <p>{claim.text}</p>
      <p>{claim.qualification}</p>
    </div>
  );
}

export function DocumentMetadata({ record }: { record: Document }) {
  const { publication, source } = record;
  const related = record.relatesTo && resolveDocument(record.relatesTo.document);
  return (
    <dl data-document={record.id} data-version={record.version} data-source={source.id}>
      <dt>Fonte</dt><dd>{source.publisher}</dd>
      <dt>Identidade na fonte</dt><dd>{record.nativeId}</dd>
      <dt>Idioma e autoridade</dt><dd>{record.language} · {authorities[record.authority]}</dd>
      <dt>Emissão</dt><dd>{record.issuedOn ? <Day value={record.issuedOn} /> : "UNKNOWN"}</dd>
      <dt>{publication?.kind === "gazette-repost" ? "Republicação consultada" : "Publicação da página"}</dt>
      <dd>{publication ? <><Day value={publication.date} />{publication.time && <> · {publication.time} (horário da fonte)</>}</> : "UNKNOWN"}</dd>
      {record.instrument && <><dt>Vigência documentada</dt><dd><EffectiveDates effective={record.effective} /></dd></>}
      <dt>Captura / conhecida pelo ARGOS em</dt><dd>{record.retrievedAt ?? "UNKNOWN"} / {record.knownAt ?? "UNKNOWN"}</dd>
      <dt>Versão da referência</dt><dd>Local v{record.version} · NIV-70 {record.dossierRef}</dd>
      {related && (
        <>
          <dt>{record.relatesTo?.type === "repeals" ? "Revoga" : "Tradução de"}</dt>
          <dd>{related.title} · v{related.version}</dd>
        </>
      )}
      <dt>Endereço bibliográfico</dt><dd><code>{record.url}</code></dd>
      {record.urlAliases?.map((url) => <dd key={url}><code>{url}</code></dd>)}
      <dt>Direitos · NIV-74 · <Day value={source.rights.reviewedOn} /></dt>
      <dd>
        Metadados e notas autorais para curadoria privada. Referência bibliográfica sem abertura automática.
        Reprodução, tradução, exibição externa, download e API pendentes de autorização.
        {source.rights.collection === "prohibited" ? " Coleta automatizada proibida pelo portal." : " Coleta automatizada fora do escopo aprovado."}
        <br /><code>{source.rights.termsUrl}</code>
      </dd>
    </dl>
  );
}

export function EvidenceInspector({ claims, relatedDocuments }: {
  claims: readonly Claim[];
  relatedDocuments: readonly Document[];
}) {
  return (
    <section aria-label="Inspetor de evidências">
      <p>Corte da revisão <time dateTime={reviewCutoff}>{reviewCutoff}</time>. As versões abaixo identificam as referências usadas neste percurso.</p>
      {claims.map((claim) => (
        <article key={claim.id}>
          <ClaimText claim={claim} />
          {claim.evidence.map((ref) => {
            const record = resolveDocument(ref.document);
            if (!record) return <p key={ref.document.id}>Referência indisponível para esta versão.</p>;
            return (
              <details key={record.id}>
                <summary>{record.title} · {ref.locator}</summary>
                <DocumentMetadata record={record} />
              </details>
            );
          })}
        </article>
      ))}
      {relatedDocuments.length > 0 && <h2>Documentos relacionados</h2>}
      {relatedDocuments.map((record) => (
        <details key={record.id}>
          <summary>{record.title}</summary>
          <DocumentMetadata record={record} />
        </details>
      ))}
      <p>O registro de políticas e o portal China Export Control Information proíbem coleta automatizada.</p>
    </section>
  );
}