import type { ReactNode } from "react";
import { Link, NavLink } from "react-router-dom";
import { ArrowUpRight, ExternalLink, FileText, Moon, Sun } from "lucide-react";
import { Wordmark } from "../../components/g2/Brand";
import { FamilyInsignia } from "../../components/g2/FamilyInsignia";
import { families, familyPath, operatorFamiliesPath } from "./OperatorFamilies";
import "./ariadne-workspace.css";

export function AriadneWorkspaceHeader({
  dark,
  toggleTheme,
  onAriadne,
}: {
  dark: boolean;
  toggleTheme: () => void;
  onAriadne: boolean;
}) {
  return (
    <header className="aw-header">
      <div className="aw-header__brand">
        <Link className="aw-header__operator" to={operatorFamiliesPath}>
          <Wordmark height={21} />
          <span>Operador</span>
        </Link>
        {onAriadne && (
          <Link className="aw-header__instrument" to="/operador/ariadne">
            Ariadne
          </Link>
        )}
      </div>
      <nav aria-label="Famílias NIVAR" className="aw-header__families">
        <NavLink to={operatorFamiliesPath} end>
          Famílias
        </NavLink>
        {families.map(({ id, name }) => (
          <NavLink key={id} to={familyPath(id)} data-active={onAriadne && id === "software"}>
            <FamilyInsignia family={id} size={20} decorative />
            {name}
            {onAriadne && id === "software" && (
              <span className="aw-sr-only"> · família atual</span>
            )}
          </NavLink>
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
