import { useEffect, useRef } from "react";
import { ArrowUpRight, X } from "lucide-react";
import {
  evidenceOutputs,
  evidenceSources,
  formatWaferShare,
  type EvidenceKey,
  type WaferObservation,
} from "../../lib/argos/globalExplore";

const dateFormat = new Intl.DateTimeFormat("pt-BR", { dateStyle: "long", timeZone: "UTC" });

export function EvidenceInspector({
  sourceKey,
  observation,
  onClose,
}: {
  sourceKey: EvidenceKey;
  observation: WaferObservation | undefined;
  onClose: () => void;
}) {
  const title = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      title.current?.focus();
      title.current?.scrollIntoView({ block: "nearest" });
    });
    return () => cancelAnimationFrame(frame);
  }, [sourceKey]);

  const source = evidenceSources[sourceKey];
  const metricEvidence = sourceKey === "iea" && observation;

  return (
    <aside className="ax-inspector" aria-labelledby="ax-evidence-title">
      <div className="ax-inspector-head">
        <span className="g2-mono">Evidência</span>
        <button type="button" onClick={onClose} className="ax-close" aria-label="Fechar evidência">
          <X size={18} aria-hidden="true" />
        </button>
      </div>
      <h2 id="ax-evidence-title" ref={title} tabIndex={-1}>{source.title}</h2>
      <p className="ax-muted">{source.publisher}</p>
      <div className="ax-source-actions">
        <a className="ax-text-link" href={source.url} target="_blank" rel="noreferrer">
          Abrir fonte original <ArrowUpRight size={15} aria-hidden="true" />
        </a>
        {"chartUrl" in source && (
          <a className="ax-text-link" href={source.chartUrl} target="_blank" rel="noreferrer">
            Abrir gráfico no IEA <ArrowUpRight size={15} aria-hidden="true" />
          </a>
        )}
      </div>
      <dl className="ax-fields">
        <div><dt>Afirmação e escopo</dt><dd>
          {metricEvidence
            ? `A IEA estima que ${formatWaferShare(metricEvidence)} da capacidade mundial de fabricação de wafers fotovoltaicos estava localizada na China.`
            : "claim" in source ? source.claim : "UNRESOLVED · Observação indisponível."}
        </dd></div>
        <div><dt>Período de referência</dt><dd>
          {metricEvidence ? metricEvidence.referenceYear : "period" in source ? source.period : "UNRESOLVED"}
        </dd></div>
        <div><dt>Publicação ou revisão da fonte</dt><dd>
          {metricEvidence
            ? <time dateTime={metricEvidence.publishedOn}>{dateFormat.format(new Date(metricEvidence.publishedOn))}</time>
            : "date" in source ? source.date : "UNRESOLVED"}
        </dd></div>
        <div><dt>Captura / primeira ciência pelo ARGOS</dt><dd>
          Captura: {metricEvidence && metricEvidence.retrievedAt || "UNKNOWN"}. Primeira ciência:{" "}
          {metricEvidence && metricEvidence.knownAt || "UNKNOWN"}. Curadoria manual com link oficial.
        </dd></div>
        <div><dt>Método</dt><dd>{source.method}</dd></div>
        <div><dt>Limites</dt><dd>{source.limits}</dd></div>
        <div><dt>Direitos e reúso</dt><dd>
          {source.rights}
          {"rightsUrl" in source && <>{" "}<a href={source.rightsUrl} target="_blank" rel="noreferrer">Termos da fonte</a></>}
        </dd></div>
        {sourceKey === "iea" && (
          <div><dt>Atribuição</dt><dd>
            IEA (2026), <cite>Energy Technology Perspectives 2026</cite>, IEA, Paris, CC BY 4.0.
            A leitura da NIVAR é de sua responsabilidade e não tem endosso da IEA ou de seus países membros.
          </dd></div>
        )}
        <div><dt>Versão e correções</dt><dd>
          {metricEvidence ? <>Observação v{metricEvidence.version}.{" "}
            {metricEvidence.supersedes === null
              ? "Versão inicial local. Sem correção registrada."
              : `Substitui a versão ${metricEvidence.supersedes}.`}
            <code className="ax-ref">{metricEvidence.id}</code>
          </> : "Nota de referência v1. Histórico da fonte não capturado."}
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
