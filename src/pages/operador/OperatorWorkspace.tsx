import { useEffect, useRef, useState } from "react";
import { ArrowRight, ArrowUpRight, ChevronRight, LayoutGrid, Moon, PanelLeft, Search, Sun, X } from "lucide-react";
import { Link, NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { Wordmark } from "../../components/g2/Brand";
import { FamilyInsignia } from "../../components/g2/FamilyInsignia";
import { families, familyPath } from "./OperatorFamilies";
import { closeDeskPath, operatorFamiliesPath, planningPath } from "./operatorWorkspaceRoutes";
import "./operator-workspace.css";

const destinations = import.meta.env.DEV ? [
  { to: operatorFamiliesPath, label: "Visão geral", group: "Operador" },
  ...families.flatMap((family) => [
    { to: familyPath(family.id), label: family.name, group: "Família NIVAR" },
    ...family.destinations.map(({ to, label }) => ({ to, label, group: family.name })),
  ]),
] : [];

const normalize = (text: string) => text.normalize("NFD").replace(/\p{M}/gu, "").toLocaleLowerCase("pt-BR");

export function OperatorWorkspace() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const path = pathname.replace(/\/$/, "");
  const focus = path === planningPath || path === closeDeskPath;
  const closeTools = path.startsWith(`${closeDeskPath}/`);
  const family = families.find((entry) =>
    familyPath(entry.id) === path || entry.destinations.some(({ to }) =>
      path === to || (to !== "/operador" && path.startsWith(`${to}/`)),
    ),
  );
  const workspace = family?.destinations
    .filter(({ to }) => path === to || (to !== "/operador" && path.startsWith(`${to}/`)))
    .sort((left, right) => right.to.length - left.to.length)[0];

  const [dark, setDark] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [query, setQuery] = useState("");
  const dialog = useRef<HTMLDialogElement>(null);
  const main = useRef<HTMLElement>(null);
  const queryField = useRef<HTMLInputElement>(null);
  const searchText = normalize(query.trim());
  const results = destinations.filter(({ label, group }) => normalize(`${label} ${group}`).includes(searchText));

  useEffect(() => {
    main.current?.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    function onShortcut(event: KeyboardEvent) {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        if (!dialog.current?.open) {
          setQuery("");
          dialog.current?.showModal();
          queryField.current?.focus();
        }
      }
    }
    window.addEventListener("keydown", onShortcut);
    return () => window.removeEventListener("keydown", onShortcut);
  }, []);

  return (
    <div className="g2 g2-ops aw-shell ow-shell" data-focus={focus} data-menu={showMenu}
      data-ops-theme={dark ? "dark" : "light"} data-g2-theme={dark ? "dark" : "light"} lang="pt-BR">
      <header className="ow-top">
        <div className="ow-top__brand">
          <button type="button" className="ow-icon-button ow-menu-toggle" onClick={() => setShowMenu(!showMenu)}
            aria-label={showMenu ? "Fechar navegação" : "Abrir navegação"} aria-expanded={showMenu} aria-controls="ow-navigation">
            {showMenu ? <X size={18} aria-hidden /> : <PanelLeft size={18} aria-hidden />}
          </button>
          <Link className="ow-brand" to={operatorFamiliesPath} onClick={() => setShowMenu(false)}>
            <Wordmark height={18} /> <span>Operador</span>
          </Link>
        </div>
        <div className="ow-top__bar">
          <nav className="ow-breadcrumb" aria-label="Localização">
            {family ? (
              <>
                {workspace ? <Link to={familyPath(family.id)}>{family.name}</Link> : <strong>{family.name}</strong>}
                {workspace && <><ChevronRight size={13} aria-hidden /><strong>{closeTools ? "Importação e revisão" : workspace.label}</strong></>}
              </>
            ) : <strong>Visão geral</strong>}
          </nav>
          <div className="ow-top__actions">
            <button type="button" className="ow-open-search" aria-label="Buscar família ou produto"
              onClick={() => { setQuery(""); dialog.current?.showModal(); queryField.current?.focus(); }}>
              <Search size={16} aria-hidden /><span>Ir para…</span><kbd>Ctrl K</kbd>
            </button>
            <button type="button" className="ow-icon-button" onClick={() => setDark(!dark)}
              aria-label={dark ? "Modo claro" : "Modo escuro"} title={dark ? "Modo claro" : "Modo escuro"}>
              {dark ? <Sun size={17} aria-hidden /> : <Moon size={17} aria-hidden />}
            </button>
            <Link className="ow-account" to="/conta">Conta <ArrowUpRight size={13} aria-hidden /></Link>
          </div>
        </div>
      </header>
      <aside className="ow-sidebar" id="ow-navigation">
        <nav aria-label="Navegação do Operador">
          <NavLink end to={operatorFamiliesPath} className="ow-nav-link" onClick={() => setShowMenu(false)}>
            <LayoutGrid size={16} aria-hidden /> Visão geral
          </NavLink>
          <div className="ow-sidebar__group">Famílias</div>
          {families.map((entry) => (
            <div key={entry.id}>
              <NavLink end to={familyPath(entry.id)} className="ow-nav-link" data-family-active={family?.id === entry.id}
                onClick={() => setShowMenu(false)}>
                <FamilyInsignia family={entry.id} size={17} decorative /> {entry.name}
              </NavLink>
              {family?.id === entry.id && entry.destinations.length > 0 && (
                <div className="ow-subnav">
                  {entry.destinations.map(({ to, label, outside }) => (
                    <NavLink end key={to} to={to} className="ow-nav-link" data-product-active={workspace?.to === to}
                      onClick={() => setShowMenu(false)}>
                      {label}{outside && <ArrowUpRight size={12} aria-hidden />}
                    </NavLink>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
        <div className="ow-sidebar__foot">Ambiente de avaliação</div>
      </aside>
      <main ref={main} className="ow-main" data-surface={family?.id}>
        {workspace && !focus && !closeTools && (
          <div className="ow-context-note">
            {family?.id === "advisory" ? "Amostra ilustrativa · rascunhos locais" : family?.id === "intelligence"
              ? "Snapshots sintéticos · inspeção em leitura" : "Alpha interno · contexto privado"}
          </div>
        )}
        <Outlet />
      </main>
      <dialog className="ow-command" aria-labelledby="ow-command-title" ref={dialog}>
        <form className="ow-command__header" onSubmit={(event) => {
          event.preventDefault();
          if (query.trim() && results[0]) {
            dialog.current?.close();
            setShowMenu(false);
            navigate(results[0].to);
          }
        }}>
          <label id="ow-command-title" htmlFor="ow-command-query"><Search size={18} aria-hidden /><span className="aw-sr-only">Ir para uma tela do Operador</span></label>
          <input id="ow-command-query" ref={queryField} type="search" value={query}
            onChange={(event) => setQuery(event.target.value)} placeholder="Buscar família ou produto…" />
          <button type="button" className="ow-icon-button" aria-label="Fechar busca" onClick={() => dialog.current?.close()}>
            <X size={17} aria-hidden />
          </button>
        </form>
        <ul className="ow-command__results ow-list" aria-label="Destinos">
          {results.map(({ to, label, group }) => (
            <li key={to}>
              <Link to={to} onClick={() => { dialog.current?.close(); setShowMenu(false); }}>
                <span>{label}<small>{group}</small></span><ArrowRight size={15} aria-hidden />
              </Link>
            </li>
          ))}
        </ul>
        {results.length === 0 && <p className="ow-command__empty" role="status">Nenhum destino encontrado.</p>}
      </dialog>
    </div>
  );
}
