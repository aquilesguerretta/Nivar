import { useEffect, useRef, useState, type ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { ArrowRight, ArrowUpRight, Menu, Moon, Search, Sun, X } from "lucide-react";
import { useAuth } from "../../lib/auth/AuthContext";
import { FamilyEmblem, Wordmark } from "./Brand";
import { useNivarFavicon } from "./use-nivar-favicon";
import { familyPath } from "./family-path";
import { NivarThemeContext } from "./nivar-theme";
import "./g2.css";
import "./g23-house.css";

const FAMILIES = [
  "intelligence",
  "advisory",
  "academy",
  "software",
  "hardware",
] as const;
const FAMILY_NAMES = {
  intelligence: "Intelligence",
  advisory: "Advisory",
  academy: "Academy",
  software: "Software",
  hardware: "Hardware",
};
const SEARCH_ENTRIES = [
  ...FAMILIES.map((f) => ({
    name: `NIVAR ${FAMILY_NAMES[f]}`,
    detail: "Família da casa",
    path: familyPath(f),
  })),
  {
    name: "Terminal Brasil",
    detail: "Explorar mercados · demonstração",
    path: "/br/terminal",
  },
  {
    name: "Energy Brief",
    detail: "Caderno editorial · edição de método",
    path: "/br/brief",
  },
  {
    name: "Conta de Luz Express",
    detail: "Análise independente de fatura",
    path: "/conta-de-luz-express",
  },
  {
    name: "Alexandria",
    detail: "Biblioteca de energia",
    path: "/alexandria",
  },
  { name: "Solar Proposal Validator", detail: "Exame independente de proposta · em preparação", path: "/solar-proposal-validator" },
  { name: "Diagnóstico Energético", detail: "Exame do custo energético · em preparação", path: "/diagnostico-energetico" },
  {
    name: "Fonte, método e incerteza",
    detail: "Como a NIVAR examina uma afirmação",
    path: "/br/metodo",
  },
  { name: "Minha conta", detail: "Acesso ao ecossistema", path: "/conta" },
];

export function NivarShell({
  children,
  title = "Casa independente de inteligência energética",
  family,
  compactFooter = false,
}: {
  children: ReactNode;
  title?: string;
  family?: string;
  compactFooter?: boolean;
}) {
  useNivarFavicon();
  const [dark, setDark] = useState(() => {
    try {
      return localStorage.getItem("nivar-g2-mode") === "dark";
    } catch {
      return false;
    }
  });
  const [menu, setMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [query, setQuery] = useState("");
  const dialog = useRef<HTMLDialogElement>(null);
  const scroll = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const { user, loading } = useAuth();
  const normalizedQuery = query
    .toLocaleLowerCase("pt-BR")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
  const searchResults = SEARCH_ENTRIES.filter((item) =>
    (item.name + " " + item.detail)
      .toLocaleLowerCase("pt-BR")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .includes(normalizedQuery),
  );
  useEffect(() => {
    const old = document.title;
    document.title = `NIVAR — ${title}`;
    return () => {
      document.title = old;
    };
  }, [title]);
  useEffect(() => {
    let anchor = "";
    try { anchor = decodeURIComponent(location.hash.slice(1)); } catch { /* Invalid fragments return to the page opening. */ }
    const target = anchor ? document.getElementById(anchor) : null;
    if (target && scroll.current?.contains(target)) target.scrollIntoView({ block: "start", behavior: "instant" });
    else scroll.current?.scrollTo({ top: 0, behavior: "instant" });
  }, [location.pathname, location.hash]);
  useEffect(() => {
    const root = scroll.current;
    if (!root) return;
    const update = () => setScrolled(root.scrollTop > 64);
    root.addEventListener("scroll", update, { passive: true });
    update();
    return () => root.removeEventListener("scroll", update);
  }, []);
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenu(false);
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        dialog.current?.showModal();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);
  const toggleMode = () => {
    setDark(!dark);
    try {
      localStorage.setItem("nivar-g2-mode", dark ? "light" : "dark");
    } catch {
      /* Session theme remains usable. */
    }
  };
  return (
    <NivarThemeContext.Provider value={dark}>
    <div
      ref={scroll}
      className="g2 g2-shell"
      data-g2-theme={dark ? "dark" : "light"}
      data-scrolled={scrolled}
    >
      <a className="g2-skip" href="#g2-main">
        Pular para o conteúdo
      </a>
      <div className="g23-masthead">
      <header className="g2-header">
        <Link to="/br" className="g2-brand" aria-label="NIVAR · Portal Brasil">
          <Wordmark height={34} />
          <span>
            INTELIGÊNCIA
            <br />
            INDEPENDENTE
          </span>
        </Link>
        <nav className="g2-desktop-nav" aria-label="Famílias NIVAR">
          {FAMILIES.map((f) => (
            <Link
              key={f}
              to={familyPath(f)}
              aria-current={family === f ? "page" : undefined}
            >
              <FamilyEmblem family={f} size={16} decorative />{FAMILY_NAMES[f]}
            </Link>
          ))}
        </nav>
        <div className="g2-header-actions">
          <button
            className="g2-icon-button"
            onClick={() => dialog.current?.showModal()}
            aria-label="Buscar na NIVAR"
          >
            <Search size={19} />
          </button>
          <button
            className="g2-icon-button g2-mode"
            onClick={toggleMode}
            aria-label={dark ? "Usar modo claro" : "Usar modo escuro"}
          >
            {dark ? <Sun size={17} /> : <Moon size={17} />}
          </button>
          <Link className="g2-account-link" to={user ? "/conta" : "/entrar"}>
            {loading ? "Conta" : user ? "Minha conta" : "Entrar"}
            <ArrowRight size={15} />
          </Link>
          <button
            className="g2-icon-button g2-mobile-menu"
            aria-label={menu ? "Fechar navegação" : "Abrir navegação"}
            aria-expanded={menu}
            aria-controls="g23-mobile-navigation"
            onClick={() => setMenu(!menu)}
          >
            {menu ? <X /> : <Menu />}
          </button>
        </div>
      </header>
      <nav className="g23-context-rail" aria-label="Contexto e instrumentos da casa">
        <span><b>BR</b><i />{family && family in FAMILY_NAMES ? FAMILY_NAMES[family as keyof typeof FAMILY_NAMES] : "Casa independente"}</span>
        <span className="g23-rail-principle">Método antes do resultado.</span>
        <div><Link to="/br/metodo">Fonte e método</Link><Link to="/br/terminal">Terminal Brasil <ArrowUpRight size={12} /></Link></div>
      </nav>
      {menu && (
        <nav className="g2-mobile-nav" id="g23-mobile-navigation" aria-label="Navegação móvel">
          {FAMILIES.map((f, i) => (
            <Link key={f} to={familyPath(f)} onClick={() => setMenu(false)}>
              <span className="g2-mono">0{i + 1}</span>
              <FamilyEmblem family={f} size={24} decorative />{FAMILY_NAMES[f]}
              <ArrowRight size={18} />
            </Link>
          ))}
          <Link to="/br/terminal" onClick={() => setMenu(false)}>
            Terminal Brasil
            <ArrowRight size={18} />
          </Link>
          <Link to="/br/metodo" onClick={() => setMenu(false)}>
            Nosso método
            <ArrowRight size={18} />
          </Link>
          <Link to={user ? "/conta" : "/entrar"} onClick={() => setMenu(false)}>
            {user ? "Minha conta" : "Entrar na NIVAR"}<ArrowRight size={18} />
          </Link>
          <button onClick={toggleMode}>
            {dark ? "Usar modo claro" : "Usar modo escuro"}
            {dark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </nav>
      )}
      </div>
      <main id="g2-main" tabIndex={-1}>
        {children}
      </main>
      <footer className="g23-footer" data-after-finale={compactFooter}>
        <div className="g2-container">
          <div className="g23-footer-heading"><Wordmark height={46} /><p>A receita da casa não depende<br />da conclusão que ela entrega.</p></div>
          <nav className="g23-footer-index" aria-label="Índice completo da NIVAR">
            <div><span>01 / A CASA</span>{FAMILIES.map(f => <Link to={familyPath(f)} key={f}>{FAMILY_NAMES[f]}<ArrowUpRight size={13} /></Link>)}</div>
            <div><span>02 / PARA EXPLORAR</span><Link to="/br/terminal">Terminal Brasil<ArrowUpRight size={13} /></Link><Link to="/br/brief">Energy Brief<ArrowUpRight size={13} /></Link><Link to="/alexandria">Alexandria<ArrowUpRight size={13} /></Link><Link to="/br/metodo">Fonte, método e incerteza<ArrowUpRight size={13} /></Link></div>
            <div><span>03 / PARA EXAMINAR</span><Link to="/conta-de-luz-express">Conta de Luz Express<ArrowUpRight size={13} /></Link><Link to="/solar-proposal-validator">Solar Proposal Validator<ArrowUpRight size={13} /></Link><Link to="/diagnostico-energetico">Diagnóstico Energético<ArrowUpRight size={13} /></Link><small>Solar e Diagnóstico: abertura pública em preparação.</small></div>
            <div><span>04 / SEU ACESSO</span><Link to="/conta">Minha conta<ArrowUpRight size={13} /></Link><Link to="/entrar">Entrar<ArrowUpRight size={13} /></Link><Link to="/criar-conta">Criar conta<ArrowUpRight size={13} /></Link><p>Não vende energia.<br />Não intermedia contratos.<br />Não recebe comissão.</p></div>
          </nav>
          <div className="g23-footer-bottom"><span>© {new Date().getFullYear()} NIVAR</span><span>Brasil · Inteligência independente</span><em>Nullius in verba.</em></div>
        </div>
      </footer>
      <dialog
        className="g2-search-dialog"
        ref={dialog}
        onClick={(e) => {
          if (e.target === e.currentTarget) dialog.current?.close();
        }}
      >
        <div className="g2-search-head">
          <Search size={22} />
          <input
            autoFocus
            aria-label="Buscar páginas e produtos"
            placeholder="O que você quer compreender?"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button
            className="g2-icon-button"
            aria-label="Fechar busca"
            onClick={() => dialog.current?.close()}
          >
            <X size={20} />
          </button>
        </div>
        <p className="g2-mono g2-search-label">PÁGINAS, MÉTODO E PRODUTOS</p>
        <div className="g2-search-results">
          {searchResults.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => {
                dialog.current?.close();
                setQuery("");
              }}
            >
              <span>
                {item.name}
                <small>{item.detail}</small>
              </span>
              <ArrowRight size={18} />
            </Link>
          ))}
          {searchResults.length === 0 && (
            <p className="g2-search-empty" role="status">
              Nenhuma página encontrada. Experimente “energia”, “método” ou o
              nome de uma família.
            </p>
          )}
        </div>
        <p className="g2-search-foot">
          Busca no índice da casa. <kbd>Esc</kbd> para fechar.
        </p>
      </dialog>
    </div>
    </NivarThemeContext.Provider>
  );
}

export function SectionLabel({
  number,
  children,
}: {
  number?: string;
  children: ReactNode;
}) {
  return (
    <div className="g2-section-label">
      <span>{number ?? "—"}</span>
      {children}
    </div>
  );
}
export function TextLink({
  to,
  children,
}: {
  to: string;
  children: ReactNode;
}) {
  return (
    <Link className="g2-text-link" to={to}>
      {children}
      <ArrowRight size={17} />
    </Link>
  );
}
export function Provenance({ children }: { children: ReactNode }) {
  return (
    <div className="g2-provenance">
      <span className="g2-source-square" />
      {children}
    </div>
  );
}
