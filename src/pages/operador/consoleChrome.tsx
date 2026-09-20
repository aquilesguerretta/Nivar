import { useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import {
  ArrowUpRight,
  FileSearch,
  GitBranch,
  Inbox,
  Menu,
  Moon,
  Sun,
  X,
} from "lucide-react";
import { Wordmark } from "../../components/g2/Brand";
import { nomeDoProduto, PRODUTOS_COM_FILA } from "../../lib/operador/catalogo";
import { FILA_MOCK, pendentes } from "../../lib/operador/mock";
import "../../components/g2/g2.css";
import "./g2-operations.css";

export function EstilosConsole() {
  return null;
}

export function ConsoleLayout() {
  const { pathname } = useLocation();
  const [dark, setDark] = useState(false);
  const [menu, setMenu] = useState(false);
  const selected = pathname.replace(/^\/operador\/?/, "").split("/")[0];
  const isAriadne = selected === "ariadne";
  return (
    <div
      className="g2 g2-ops"
      data-ops-theme={dark ? "dark" : "light"}
      lang="pt-BR"
    >
      <header className="g2-ops__header">
        <Link
          to="/br"
          className="g2-ops__brand"
          aria-label="NIVAR — Portal Brasil"
        >
          <Wordmark height={23} />
        </Link>
        <span className="g2-ops__product">
          {isAriadne ? "Ariadne" : "Advisory"} <span>/</span> Bancada de análise
        </span>
        <div className="g2-ops__header-right">
          <span className="g2-ops__sample-label">
            {isAriadne ? "SYNTHETIC WORKSPACE" : "AMOSTRA ILUSTRATIVA"}
          </span>
          <Link to="/conta">
            Conta <ArrowUpRight size={13} />
          </Link>
          <button
            className="g2-ops__menu-toggle"
            type="button"
            onClick={() => setMenu(!menu)}
            aria-label={menu ? "Fechar navegação" : "Abrir navegação"}
            aria-expanded={menu}
          >
            {menu ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </header>
      <div className="g2-ops__body">
        <aside className="g2-ops__sidebar" data-open={menu}>
          <div className="g2-ops__sidebar-top">
            <span>ESPAÇO DE TRABALHO</span>
            <strong>{isAriadne ? "Ariadne organiza." : "Sócrates questiona."}</strong>
          </div>
          <nav aria-label="Fila de análise">
            <Link
              to="/operador"
              className="g2-ops__nav-item"
              aria-current={!selected ? "page" : undefined}
              onClick={() => setMenu(false)}
            >
              <Inbox size={16} />
              <span>Todos os pedidos</span>
              <b>{FILA_MOCK.length}</b>
            </Link>
            <div className="g2-ops__nav-label">INSTRUMENTOS</div>
            <Link
              to="/operador/ariadne"
              className="g2-ops__nav-item"
              aria-current={isAriadne ? "page" : undefined}
              onClick={() => setMenu(false)}
            >
              <GitBranch size={16} />
              <span>Ariadne</span>
              <b>CORE</b>
            </Link>
            <div className="g2-ops__nav-label">POR PRODUTO</div>
            {PRODUTOS_COM_FILA.map((p) => (
              <Link
                className="g2-ops__nav-item g2-ops__nav-item--product"
                key={p.produtoId}
                to={`/operador/${p.produtoId}`}
                aria-current={selected === p.produtoId ? "page" : undefined}
                onClick={() => setMenu(false)}
              >
                <span>{nomeDoProduto(p.produtoId)}</span>
                <b>{pendentes(p.produtoId)}</b>
              </Link>
            ))}
          </nav>
          <div className="g2-ops__sidebar-method">
            {isAriadne ? <GitBranch size={20} /> : <FileSearch size={20} />}
            <p>{isAriadne ? "A memória vem antes." : "A conclusão vem depois."}</p>
            <span>{isAriadne
              ? "Estado, evidência, premissas e execução preservam sua linhagem exata."
              : "Evidência, premissas e contrapontos permanecem visíveis durante toda a análise."}
            </span>
          </div>
          <div className="g2-ops__sidebar-bottom">
            <Link to={isAriadne ? "/br/software" : "/br/advisory"}>
              {isAriadne ? "Conhecer Software" : "Conhecer Advisory"} <ArrowUpRight size={13} />
            </Link>
            <button type="button" onClick={() => setDark(!dark)}>
              {dark ? <Sun size={15} /> : <Moon size={15} />}{" "}
              {dark ? "Modo claro" : "Modo escuro"}
            </button>
          </div>
        </aside>
        <main className="g2-ops__main">
          <div className="g2-ops__truth">
            <span>{isAriadne ? "CASE-INDEPENDENT CORE TEST" : "G2 EXPERIMENTAL"}</span>
            <p>{isAriadne
              ? "Workspace sintético · dados ilustrativos · estado persistido no Ariadne Core real."
              : "Pedidos e nomes ilustrativos · sem acesso à fila real · rascunhos locais, sem envio."}
            </p>
          </div>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
