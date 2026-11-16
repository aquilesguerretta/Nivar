import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, ExternalLink, FileText, Moon, Sun } from "lucide-react";
import { Wordmark } from "../../components/g2/Brand";
import {
  FamilyInsignia,
  type FamilyInsigniaName,
} from "../../components/g2/FamilyInsignia";
import "./ariadne-workspace.css";

const families: ReadonlyArray<[FamilyInsigniaName, string]> = [
  ["intelligence", "Intelligence"],
  ["advisory", "Advisory"],
  ["academy", "Academy"],
  ["software", "Software"],
  ["hardware", "Hardware"],
];

export function AriadneWorkspaceHeader({
  dark,
  toggleTheme,
}: {
  dark: boolean;
  toggleTheme: () => void;
}) {
  return (
    <header className="aw-header">
      <div className="aw-header__brand">
        <Link to="/br" aria-label="NIVAR — Portal Brasil">
          <Wordmark height={21} />
        </Link>
        <Link className="aw-header__instrument" to="/operador/ariadne">
          Ariadne
        </Link>
      </div>
      <nav aria-label="Famílias NIVAR" className="aw-header__families">
        {families.map(([id, label]) => (
          <Link key={id} to={`/br/${id}`} data-active={id === "software"}>
            <FamilyInsignia family={id} size={20} decorative />
            {label}
            {id === "software" && (
              <span className="aw-sr-only"> · família atual</span>
            )}
          </Link>
        ))}
      </nav>
      <div className="aw-header__tools">
        <button
          type="button"
          onClick={toggleTheme}
          aria-label={dark ? "Modo claro" : "Modo escuro"}
          title={dark ? "Modo claro" : "Modo escuro"}
        >
          {dark ? (
            <Sun size={17} aria-hidden />
          ) : (
            <Moon size={17} aria-hidden />
          )}
        </button>
        <Link to="/conta">
          Conta <ArrowUpRight size={14} aria-hidden />
        </Link>
      </div>
    </header>
  );
}

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
