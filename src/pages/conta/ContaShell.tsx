import { useState, type CSSProperties, type ReactNode } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ArrowUpRight,
  Eye,
  EyeOff,
  LockKeyhole,
  Moon,
  Sun,
} from "lucide-react";
import { Wordmark } from "../../components/g2/Brand";
import "../../components/g2/g2.css";
import "./g2-account.css";

export const NT = {
  etiqueta: {
    fontFamily: "var(--g2-sans)",
    fontWeight: 500,
    fontSize: "11px",
    lineHeight: 1.4,
    letterSpacing: ".08em",
    textTransform: "uppercase",
  } satisfies CSSProperties,
  eyebrow: {
    fontFamily: "var(--g2-mono)",
    fontSize: "11px",
    lineHeight: 1.5,
    letterSpacing: ".08em",
    textTransform: "uppercase",
  } satisfies CSSProperties,
  titulo: {
    fontFamily: "var(--g2-serif)",
    fontWeight: 400,
    fontSize: "48px",
    lineHeight: 1.05,
    letterSpacing: "-.035em",
  } satisfies CSSProperties,
  titulo2: {
    fontFamily: "var(--g2-serif)",
    fontWeight: 400,
    fontSize: "25px",
    lineHeight: 1.15,
    letterSpacing: "-.02em",
  } satisfies CSSProperties,
  corpo: {
    fontFamily: "var(--g2-sans)",
    fontWeight: 400,
    fontSize: "15px",
    lineHeight: 1.6,
  } satisfies CSSProperties,
  lede: {
    fontFamily: "var(--g2-sans)",
    fontWeight: 400,
    fontSize: "16px",
    lineHeight: 1.6,
  } satisfies CSSProperties,
  nota: {
    fontFamily: "var(--g2-sans)",
    fontWeight: 400,
    fontSize: "12px",
    lineHeight: 1.6,
  } satisfies CSSProperties,
} as const;
export function EstilosConta() {
  return null;
}
export interface ContaShellProps {
  eyebrow: string;
  titulo: string;
  subtitulo?: string;
  children: ReactNode;
  rodape?: ReactNode;
  largura?: "formulario" | "prancha";
}

export function ContaShell({
  eyebrow,
  titulo,
  subtitulo,
  children,
  rodape,
  largura = "formulario",
}: ContaShellProps) {
  const [dark, setDark] = useState(false);
  const profile = largura === "prancha";
  return (
    <div
      className={`g2 g2-account${profile ? " g2-account--profile" : ""}`}
      data-account-theme={dark ? "dark" : "light"}
      lang="pt-BR"
    >
      <header className="g2-account__header">
        <Link
          className="g2-account__brand"
          to="/br"
          aria-label="NIVAR — Portal Brasil"
        >
          <Wordmark height={26} />
          <span>Conta</span>
        </Link>
        <nav aria-label="Navegação da conta">
          <Link to="/br">
            <ArrowLeft size={14} /> Voltar à casa
          </Link>
          <button
            type="button"
            onClick={() => setDark(!dark)}
            aria-label={dark ? "Usar modo claro" : "Usar modo escuro"}
          >
            {dark ? <Sun size={17} /> : <Moon size={17} />}
          </button>
        </nav>
      </header>
      {profile ? (
        <main className="g2-account__profile">
          <div className="g2-account__profile-heading">
            <span className="g2-account__eyebrow">{eyebrow}</span>
            <h1>{titulo}</h1>
            {subtitulo && <p>{subtitulo}</p>}
          </div>
          {children}
        </main>
      ) : (
        <main className="g2-account__entry">
          <aside
            className="g2-account__editorial"
            aria-label="Uma conta, uma casa"
          >
            <div className="g2-account__edition">
              <span>NIVAR / BRASIL</span>
              <span>ACESSO À CASA</span>
            </div>
            <h2>
              O conhecimento <br />
              abre caminhos.
              <br />
              <em>A conta, as portas.</em>
            </h2>
            <p>
              Seu lugar para acompanhar uma análise, explorar o mercado e
              continuar aprendendo. Com a mesma identidade em toda a NIVAR.
            </p>
            <div className="g2-account__index">
              <Link to="/br/intelligence">
                <span>01</span>
                <span>
                  Entender o que muda<small>Intelligence</small>
                </span>
                <ArrowUpRight size={18} />
              </Link>
              <Link to="/br/advisory">
                <span>02</span>
                <span>
                  Examinar uma decisão<small>Advisory</small>
                </span>
                <ArrowUpRight size={18} />
              </Link>
              <Link to="/br/academy">
                <span>03</span>
                <span>
                  Ampliar seu repertório<small>Academy</small>
                </span>
                <ArrowUpRight size={18} />
              </Link>
            </div>
            <footer>
              NULLIUS IN VERBA.
              <span>Uma casa independente de inteligência em energia.</span>
            </footer>
          </aside>
          <section
            className="g2-account__form-panel"
            aria-labelledby="account-title"
          >
            <div className="g2-account__form-top">
              <LockKeyhole size={18} />
              <span>Uma identidade. Toda a NIVAR.</span>
            </div>
            <div className="g2-account__form-content">
              <span className="g2-account__eyebrow">{eyebrow}</span>
              <h1 id="account-title">{titulo}</h1>
              {subtitulo && <p className="g2-account__subtitle">{subtitulo}</p>}
              {children}
              {rodape && <div className="g2-account__sibling">{rodape}</div>}
            </div>
            <p className="g2-account__security">
              <LockKeyhole size={13} /> Sessão protegida. Sua senha não fica
              salva nesta página.
            </p>
          </section>
        </main>
      )}
    </div>
  );
}
export interface CampoProps {
  id: string;
  rotulo: string;
  tipo: "email" | "password" | "text";
  valor: string;
  onChange: (v: string) => void;
  autoComplete?: string;
  erro?: string;
  dica?: string;
  autoFocus?: boolean;
}
export function Campo({
  id,
  rotulo,
  tipo,
  valor,
  onChange,
  autoComplete,
  erro,
  dica,
  autoFocus,
}: CampoProps) {
  const [visible, setVisible] = useState(false);
  const ajuda = erro ? `${id}-erro` : dica ? `${id}-dica` : undefined;
  return (
    <div className="g2-account__field">
      <label htmlFor={id}>{rotulo}</label>
      <div className="g2-account__input-wrap">
        <input
          id={id}
          className="conta-campo"
          type={tipo === "password" && visible ? "text" : tipo}
          value={valor}
          autoComplete={autoComplete}
          autoFocus={autoFocus}
          aria-invalid={erro ? "true" : undefined}
          aria-describedby={ajuda}
          onChange={(e) => onChange(e.target.value)}
        />
        {tipo === "password" && (
          <button
            className="g2-account__password"
            type="button"
            aria-label={
              visible
                ? `Ocultar ${rotulo.toLowerCase()}`
                : `Mostrar ${rotulo.toLowerCase()}`
            }
            aria-pressed={visible}
            onClick={() => setVisible(!visible)}
          >
            {visible ? <EyeOff size={17} /> : <Eye size={17} />}
          </button>
        )}
      </div>
      {erro ? (
        <span id={`${id}-erro`} className="g2-account__field-error">
          {erro}
        </span>
      ) : dica ? (
        <span id={`${id}-dica`} className="g2-account__hint">
          {dica}
        </span>
      ) : null}
    </div>
  );
}
export function AvisoErro({ children }: { children: ReactNode }) {
  return (
    <div role="alert" className="g2-account__error">
      {children}
    </div>
  );
}
