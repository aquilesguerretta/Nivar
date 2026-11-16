import type { ReactNode } from "react";
import { ExternalLink, FileText } from "lucide-react";
import "./ariadne-workspace.css";

export function AriadneContext({
  navigation,
  title,
  context,
  status,
  actions,
}: {
  navigation?: ReactNode;
  title: string;
  context?: ReactNode;
  status?: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <header className="aw-context">
      <div className="aw-context__identity">
        {navigation}
        <h1>{title}</h1>
        {context && <p>{context}</p>}
      </div>
      {(status || actions) && (
        <div className="aw-context__controls">
          {status && <span className="aw-context__status">{status}</span>}
          {actions}
        </div>
      )}
    </header>
  );
}

/** Keeps the exact authenticated URL supplied by the existing proof flow. */
export function AriadneSourceAction({
  href,
  page,
}: {
  href: string;
  page?: number | null;
}) {
  return (
    <a
      className="aw-source-action"
      href={href}
      target="_blank"
      rel="noreferrer"
    >
      <FileText size={19} aria-hidden />
      <span>
        <strong>Abrir fonte original</strong>
        <small>
          {page ? `PDF · página ${page}` : "Documento original"} · nova aba
        </small>
      </span>
      <ExternalLink size={17} aria-hidden />
    </a>
  );
}
