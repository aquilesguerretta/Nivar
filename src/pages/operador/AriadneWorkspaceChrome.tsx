import { useState, type ReactNode } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { ArrowUpRight, ExternalLink, FileText, Moon, Sun } from "lucide-react";
import { Wordmark } from "../../components/g2/Brand";
import { FamilyInsignia } from "../../components/g2/FamilyInsignia";
import {
  ariadneWorkspaceLinks,
  planningPath,
} from "../../lib/ariadne/workspaceNavigation";
import "@fontsource-variable/instrument-sans";
import "@fontsource-variable/newsreader";
import "@fontsource/ibm-plex-mono/400.css";
import "../../components/g2/g2.css";
import "./g2-operations.css";
import "./ariadne-workspace.css";

/** Mounted only on the two development-gated Ariadne routes, not the House console. */
export function AriadneWorkspaceLayout() {
  const [dark, setDark] = useState(false);
  const location = useLocation();
  const links = ariadneWorkspaceLinks(location.pathname, location.search);
  const planning = location.pathname.replace(/\/$/, "") === planningPath;
  return (
    <div
      className="g2 g2-ops aw-shell"
      data-ops-theme={dark ? "dark" : "light"}
      data-g2-theme={dark ? "dark" : "light"}
      lang="pt-BR"
    >
      <header className="aw-header">
        <div className="aw-header__brand">
          <Link to="/br" aria-label="NIVAR — Portal Brasil">
            <Wordmark height={21} />
          </Link>
          <span className="aw-header__operator">Operador</span>
          <span className="aw-header__instrument">
            <FamilyInsignia family="software" size={19} decorative /> Ariadne
          </span>
        </div>
        <nav className="aw-header__navigation" aria-label="Navegação Ariadne">
          <Link to={links.review} aria-current={!planning ? "page" : undefined}>
            Mesa de revisão
          </Link>
          {import.meta.env.DEV &&
            import.meta.env.VITE_ARIADNE_PLAN_DEV === "1" && (
              <Link
                to={links.planning}
                aria-current={planning ? "page" : undefined}
              >
                Planejamento
              </Link>
            )}
          <Link to="/operador/ariadne">Core Alpha</Link>
        </nav>
        <div className="aw-header__tools">
          <button
            type="button"
            onClick={() => setDark(!dark)}
            aria-label={dark ? "Modo claro" : "Modo escuro"}
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
      <main className="aw-shell__main">
        <Outlet />
      </main>
    </div>
  );
}

export function AriadneContext({
  navigation,
  title,
  context,
  status,
  announcement,
  actions,
}: {
  navigation?: ReactNode;
  title: string;
  context?: ReactNode;
  status?: ReactNode;
  announcement?: ReactNode;
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
          {status && (
            <span className="aw-context__status" aria-hidden="true">
              {status}
            </span>
          )}
          {actions}
        </div>
      )}
      <span
        className="aw-sr-only"
        role="status"
        aria-live="polite"
        aria-atomic="true"
        data-ariadne-state
      >
        {announcement === undefined ? status : announcement}
      </span>
    </header>
  );
}

export function AriadneOriginalRetry({ retry }: { retry: () => void }) {
  return (
    <button type="button" onClick={retry}>
      Tentar carregar original novamente
    </button>
  );
}

/** Keeps the exact authenticated URL supplied by the existing proof flow. */
export function AriadneSourceAction({
  href,
  page,
}: {
  href?: string;
  page?: number | null;
}) {
  return (
    <a
      className="aw-source-action"
      href={href}
      role={href ? undefined : "link"}
      aria-disabled={href ? undefined : true}
      tabIndex={href ? undefined : -1}
      target="_blank"
      rel="noreferrer"
    >
      <FileText size={19} aria-hidden />
      <span>
        <strong>Abrir fonte original</strong>
        <small>
          {page ? `PDF · página ${page}` : "Documento original"}
          {href ? " · nova aba" : " · preparando documento"}
        </small>
      </span>
      <ExternalLink size={17} aria-hidden />
    </a>
  );
}
