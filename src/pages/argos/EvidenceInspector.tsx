import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, X } from "lucide-react";
import { Link } from "react-router-dom";
import {
  evidenceOutputs,
  formatWaferShare,
  type WaferObservation,
} from "../../lib/argos/globalExplore";
import type { ExploreDocument } from "../../lib/argos/globalExploreEvidence";

const dateFormat = new Intl.DateTimeFormat("pt-BR", { dateStyle: "long", timeZone: "UTC" });

export function EvidenceInspector({
  document,
  source,
  observation,
  pinned,
  pinnedHref,
  onClose,
}: {
  document: ExploreDocument;
  source: { publisher: string; rightsUrl?: string };
  observation: WaferObservation | undefined;
  pinned: boolean;
  pinnedHref: string;
  onClose: () => void;
}) {
  const title = useRef<HTMLHeadingElement>(null);
  const [copyState, setCopyState] = useState<"copied" | "manual">();
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      title.current?.focus();
      title.current?.scrollIntoView({ block: "nearest" });
    });
    return () => cancelAnimationFrame(frame);
  }, [document.id, document.version]);

  const pinnedUrl = new URL(pinnedHref, window.location.origin).href;
  async function copyLink() {
    try {
      await navigator.clipboard.writeText(pinnedUrl);
      setCopyState("copied");
    } catch {
      setCopyState("manual");
    }
  }

  return (
    <aside className="ax-inspector" aria-labelledby="ax-evidence-title"
      data-source-ref={document.sourceRef} data-document-ref={document.id} data-document-version={document.version}>
      <div className="ax-inspector-head">
        <span className="g2-mono">Evidência</span>
        <button type="button" onClick={onClose} className="ax-close" aria-label="Fechar evidência">
          <X size={18} aria-hidden="true" />
        </button>
      </div>
      <h2 id="ax-evidence-title" ref={title} tabIndex={-1}>{document.title}</h2>
      <p className="ax-muted">{source.publisher}{document.authors && ` · ${document.authors}`}</p>
      {document.synthetic && <p>Fixture sintético de teste · sem correção da IEA.</p>}
      <div className="ax-source-actions">
        <a className="ax-text-link" href={document.url} target="_blank" rel="noreferrer">
          Abrir fonte original <ArrowUpRight size={15} aria-hidden="true" />
        </a>
        {document.chartUrl && (
          <a className="ax-text-link" href={document.chartUrl} target="_blank" rel="noreferrer">
            Abrir gráfico no IEA <ArrowUpRight size={15} aria-hidden="true" />
          </a>
        )}
        {!pinned && <Link className="ax-text-link" to={pinnedHref}>Abrir versão fixada</Link>}
        <button className="ax-text-link ax-copy-link" type="button" onClick={() => void copyLink()}>
          Copiar link fixado
        </button>
        {copyState === "copied" && <p role="status">Link fixado copiado.</p>}
        {copyState === "manual" && (
          <label>Selecione e copie o link fixado
            <input className="ax-pin-url" readOnly value={pinnedUrl} onFocus={(event) => event.target.select()} />
          </label>
        )}
      </div>
      <dl className="ax-fields">
        <div><dt>Afirmação e escopo</dt><dd>
          {observation
            ? `${observation.synthetic ? "Neste teste, a estimativa sintética é de" : "A IEA estima que"} ${formatWaferShare(observation)} da capacidade mundial de fabricação de wafers fotovoltaicos estava localizada na China.`
            : document.claim ?? "UNRESOLVED · Observação indisponível."}
        </dd></div>
        <div><dt>Período de referência</dt><dd>
          {observation?.referenceYear ?? document.period ?? "UNRESOLVED"}
        </dd></div>
        <div><dt>Publicação ou revisão da fonte</dt><dd>
          {document.publishedOn
            ? <time dateTime={document.publishedOn}>{dateFormat.format(new Date(document.publishedOn))}</time>
            : document.dateLabel ?? "UNKNOWN"}
        </dd></div>
        <div><dt>Captura / primeira ciência pelo ARGOS</dt><dd>
          Captura: {document.retrievedAt ?? "UNKNOWN"}. Primeira ciência:{" "}
          {document.knownAt ?? "UNKNOWN"}. Curadoria manual com link oficial.
        </dd></div>
        <div><dt>Método</dt><dd>{document.method}</dd></div>
        <div><dt>Limites</dt><dd>{document.limits}</dd></div>
        <div><dt>Direitos e reúso</dt><dd>
          {document.rights}
          {source.rightsUrl && <>{" "}<a href={source.rightsUrl} target="_blank" rel="noreferrer">Termos da fonte</a></>}
        </dd></div>
        {document.sourceRef === "source:iea" && (
          <div><dt>Atribuição</dt><dd>
            IEA (2026), <cite>Energy Technology Perspectives 2026</cite>, IEA, Paris, CC BY 4.0.
            A leitura da NIVAR é de sua responsabilidade e não tem endosso da IEA ou de seus países membros.
          </dd></div>
        )}
        <div><dt>Versão e correções</dt><dd>
          Document v{document.version} · {pinned ? "Fixada" : observation ? "Citada pela observação" : "Atual"}.
          {document.supersedes !== null && ` Substitui a v${document.supersedes}.`}
          <code className="ax-ref">{document.id}</code>
          <code className="ax-ref">{document.sourceRef}</code>
          {observation && <>
            Observation v{observation.version}.
            {observation.supersedes !== null && ` Substitui a v${observation.supersedes}.`}
            <code className="ax-ref">{observation.id}</code>
          </>}
        </dd></div>
      </dl>
      <dl className="ax-outputs">
        {Object.entries(evidenceOutputs).map(([output, state]) => (
          <div key={output}><dt>{output}</dt><dd className="ax-state">{state}</dd></div>
        ))}
      </dl>
    </aside>
  );
}
