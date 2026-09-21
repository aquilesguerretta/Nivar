// src/pages/conta/EntrarView.tsx
// ARCHITECT — Identidade de Plataforma, Wave 1. Rota /entrar.
//
// ANTI-ENUMERAÇÃO: o backend devolve 401 com a MESMA mensagem para
// endereço desconhecido, senha errada e conta só-Google — de propósito,
// senão o endpoint vira oráculo de quais emails estão cadastrados.
// Esta tela NÃO tenta ser mais específica que isso. Nenhum ramo de
// código aqui distingue as causas; inventar essa diferenciação
// desfaria a proteção que a Wave 9 construiu.
//
// Sem "entrar com Google": /api/auth/google/* estão ausentes no
// backend (contrato §"Google OAuth — not shipped"). Botão que não
// funciona é pior que botão ausente.

import { useState, type FormEvent } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

import { useAuth } from "../../lib/auth/AuthContext";
import { AuthError } from "../../lib/auth/authApi";
import { AvisoErro, Campo, ContaShell, NT } from "./ContaShell";

/** Mensagem única para TODA falha de credencial. Tradução fiel do
 *  `invalid email or password` do backend — traduzir preserva a
 *  ambiguidade; o que não se pode é ramificar por causa. */
const ERRO_CREDENCIAL = "Email ou senha inválidos.";

export function EntrarView() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  // Quem chegou aqui por rota protegida volta para onde queria ir.
  const destino = (location.state as { de?: string } | null)?.de ?? "/conta";

  async function aoEnviar(e: FormEvent) {
    e.preventDefault();
    if (enviando) return;

    setErro(null);
    setEnviando(true);
    try {
      await login(email.trim(), senha);
      navigate(destino, { replace: true });
    } catch (err) {
      if (err instanceof AuthError) {
        // 401 é o caso genérico e é a esmagadora maioria. Qualquer
        // outro status (503 sem JWT_SECRET, 500, rede) merece texto
        // próprio, porque aí o problema não é a credencial de ninguém.
        setErro(
          err.status === 401
            ? ERRO_CREDENCIAL
            : err.status === 0
              ? "Não foi possível falar com o servidor. Verifique a conexão."
              : "Algo falhou do nosso lado. Tente de novo em instantes.",
        );
      } else {
        setErro("Algo falhou do nosso lado. Tente de novo em instantes.");
      }
      setEnviando(false);
    }
  }

  const podeEnviar = email.trim().length > 0 && senha.length > 0 && !enviando;

  return (
    <ContaShell
      eyebrow="Conta NIVAR"
      titulo="Entrar"
      subtitulo="Retome suas análises, seus produtos e seu percurso de aprendizado."
      rodape={
        <>
          Ainda não tem conta?{" "}
          <Link className="conta-link" to="/criar-conta" state={location.state}>
            Criar conta
          </Link>
        </>
      }
    >
      {/* noValidate — mesma razão da tela de criar conta: a validação
          nativa de `type="email"` bloquearia o submit com bolha em
          inglês. Aqui ela também atrapalharia o caso legítimo de quem
          digita o email torto: o servidor responde a mensagem genérica
          única, que é o comportamento correto. */}
      <form
        onSubmit={aoEnviar}
        noValidate
        style={{ display: "flex", flexDirection: "column", gap: "18px" }}
      >
        <Campo
          id="entrar-email"
          rotulo="Email"
          tipo="email"
          valor={email}
          onChange={setEmail}
          autoComplete="email"
          autoFocus
        />
        <Campo
          id="entrar-senha"
          rotulo="Senha"
          tipo="password"
          valor={senha}
          onChange={setSenha}
          autoComplete="current-password"
        />

        {erro && <AvisoErro>{erro}</AvisoErro>}

        <button type="submit" className="conta-botao" disabled={!podeEnviar}>
          {enviando ? "Entrando…" : "Entrar"}
        </button>
      </form>

      {/* Estado honesto: recuperação de senha não existe no backend
          (a Wave 9 shipou signup/login/logout/me/produtos, mais nada).
          Dizer o que falta é melhor que um link que não leva a nada. */}
      <p
        style={{
          ...NT.nota,
          marginTop: "18px",
          marginBottom: 0,
          color: "var(--text-muted)",
        }}
      >
        Recuperação de senha ainda indisponível. Guarde suas credenciais em um
        gerenciador de senhas.
      </p>
    </ContaShell>
  );
}

export default EntrarView;
