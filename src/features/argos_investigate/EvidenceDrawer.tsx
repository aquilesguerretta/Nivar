import { useLayoutEffect, useRef, useState } from "react";
import { Link, useHref, useLocation } from "react-router-dom";
import { investigationParams, sourceHref } from "./reading";
import type { EvidencePin, ReadableRevision } from "./reading";

type Props = {
  reading: ReadableRevision;
  historical: boolean;
  versions: readonly { revision: ReadableRevision; historical: boolean }[];
  query: string;
  objectId: string;
  onClose: () => void;
};

export function EvidenceDrawer({ reading, historical, versions, query, objectId, onClose }: Props) {
  const dialog = useRef<HTMLDialogElement>(null);
  const close = useRef<HTMLButtonElement>(null);
  const [copyStatus, setCopyStatus] = useState("");
  const { state: origin } = useLocation();
  const linkTo = (pin: EvidencePin) => ({ search: investigationParams(query, objectId, pin).toString() });
  const path = useHref(linkTo(reading));
  const historicalUrl = new URL(path, window.location.href).href;
  const document = reading.document;
  const sourceLink = sourceHref(document.citation);

  useLayoutEffect(() => {
    dialog.current?.showModal();
    close.current?.focus();
  }, []);

  async function copyVersion() {
    try {
      await navigator.clipboard.writeText(historicalUrl);
      setCopyStatus("Link local copiado.");
    } catch {
      setCopyStatus("Use o campo para copiar o link local.");
    }
  }

  return (
    <dialog
      ref={dialog}
      className="ai-drawer"
      aria-labelledby="ai-evidence-title"
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
    >
      <header className="ai-drawer-head">
        <h2 id="ai-evidence-title">Evidência</h2>
        <button ref={close} type="button" onClick={onClose}>Fechar <span aria-hidden="true">×</span></button>
      </header>
      <div className="ai-drawer-content">
        <p className="ai-kicker">{historical ? "Versão histórica" : "Versão atual do acervo"} · {reading.version}</p>
        <h3>{document.title}</h3>
        <dl>
          <dt>Fonte</dt><dd>{document.source.name}</dd>
          <dt>Referência da fonte</dt><dd>{document.source.id}</dd>
          <dt>Documento</dt><dd>{reading.documentRef}</dd>
          <dt>Versão do documento</dt><dd>{reading.documentVersion}</dd>
          <dt>Publicação</dt><dd>{document.publication ?? "Não informada"}</dd>
          {document.language && <><dt>Idioma</dt><dd>{document.language}</dd></>}
          {document.locator && <><dt>Localização</dt><dd>{document.locator}</dd></>}
          <dt>Coleta</dt><dd>{document.retrievedAt ?? "Não informada"}</dd>
          <dt>Conhecido pela NIVAR em</dt><dd>{document.knownAt ?? "Não informado"}</dd>
          {document.reviewCutoff && <><dt>Corte da revisão</dt><dd>{document.reviewCutoff}</dd></>}
        </dl>
        <section className="ai-drawer-section">
          <h4>Direitos de uso</h4>
          <p>{document.rights}</p>
          {sourceLink
            ? <a href={sourceLink} target="_blank" rel="noreferrer">Abrir documento original <span aria-hidden="true">↗</span></a>
            : <p className="ai-meta">Consulta por referência bibliográfica.</p>}
        </section>
        {versions.length > 1 && (
          <section className="ai-drawer-section">
            <h4>Versões disponíveis</h4>
            <ul className="ai-versions">
              {versions.map(({ revision, historical: old }) => (
                <li key={revision.version}>
                  {revision.version === reading.version
                    ? <span aria-current="true">{revision.version} · Em leitura</span>
                    : <Link to={linkTo(revision)} state={origin}>{revision.version} · {old ? "Histórica" : "Atual do acervo"}</Link>}
                </li>
              ))}
            </ul>
          </section>
        )}
        <section className="ai-drawer-section ai-version-link">
          <label htmlFor="ai-version-url">Link local desta versão</label>
          <input id="ai-version-url" readOnly value={historicalUrl} onFocus={(event) => event.currentTarget.select()} />
          <button type="button" onClick={copyVersion}>Copiar link</button>
          <p role="status">{copyStatus}</p>
        </section>
      </div>
    </dialog>
  );
}
