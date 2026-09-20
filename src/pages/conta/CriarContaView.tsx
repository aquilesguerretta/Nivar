// src/pages/conta/CriarContaView.tsx
// ARCHITECT — Identidade de Plataforma, Wave 1. Rota /criar-conta.
//
// A validação de cliente aqui é conveniência (erra rápido, sem
// round-trip); a validação DE VERDADE é a do backend, e é ela que
// decide. Os limiares espelham o contrato: senha ≥ 8 caracteres, nome
// não-vazio, email com formato aceito pelo validador.
//
// 409 (email já existe) É específico de propósito e não conflita com
// a regra anti-enumeração: o backend escolheu responder 409 aqui, e a
// razão é assimétrica — no login, distinguir causas entregaria quais
// endereços existem; no cadastro, a pessoa PRECISA saber que já tem
// conta, senão fica presa sem entender por quê. Seguimos o backend
// nos dois casos em vez de inventar política própria.
//
// Criar conta não ativa produto nenhum (contrato: "Creating an account
// activates nothing"). A ativação acontece ao entrar no produto —
// Fase 5 desta wave.

import { useState, type FormEvent } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

import { useAuth } from "../../lib/auth/AuthContext";
import { AuthError } from "../../lib/auth/authApi";
import { AvisoErro, Campo, ContaShell, NT } from "./ContaShell";

const SENHA_MINIMA = 8;

/** Formato de email — deliberadamente permissivo. Rejeitar aqui o que
 *  o backend aceitaria seria pior que deixar passar: o validador dele
 *  é a autoridade (e recusa TLD reservado, que este regex não conhece). */
const RX_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

interface ErrosCampo {
  nome?: string;
  email?: string;
  senha?: string;
  confirmacao?: string;
}

export function CriarContaView() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmacao, setConfirmacao] = useState("");
  const [erros, setErros] = useState<ErrosCampo>({});
  const [erroServidor, setErroServidor] = useState<string | null>(null);
  const [emailEmUso, setEmailEmUso] = useState(false);
  const [enviando, setEnviando] = useState(false);

  const destino = (location.state as { de?: string } | null)?.de ?? "/conta";

  function validar(): ErrosCampo {
    const e: ErrosCampo = {};
    if (!nome.trim()) e.nome = "Diga como quer ser chamado.";
    if (!RX_EMAIL.test(email.trim())) e.email = "Endereço de email inválido.";
    if (senha.length < SENHA_MINIMA)
      e.senha = `Mínimo de ${SENHA_MINIMA} caracteres.`;
    if (confirmacao !== senha) e.confirmacao = "As senhas não coincidem.";
    return e;
  }

  async function aoEnviar(ev: FormEvent) {
    ev.preventDefault();
    if (enviando) return;

    setErroServidor(null);
    setEmailEmUso(false);

    const encontrados = validar();
    setErros(encontrados);
    if (Object.keys(encontrados).length > 0) return;

    setEnviando(true);
    try {
      await signup(nome.trim(), email.trim(), senha);
      navigate(destino, { replace: true });
    } catch (err) {
      if (err instanceof AuthError) {
        if (err.status === 409) {
          setEmailEmUso(true);
        } else if (err.status === 422) {
          // O backend recusou algo que o cliente deixou passar — o
          // texto dele é mais preciso que qualquer chute daqui.
          setErroServidor(err.message);
        } else if (err.status === 0) {
          setErroServidor(
            "Não foi possível falar com o servidor. Verifique a conexão.",
          );
        } else {
          setErroServidor(
            "Algo falhou do nosso lado. Tente de novo em instantes.",
          );
        }
      } else {
        setErroServidor(
          "Algo falhou do nosso lado. Tente de novo em instantes.",
        );
      }
      setEnviando(false);
    }
  }

  const podeEnviar =
    nome.trim().length > 0 &&
    email.trim().length > 0 &&
    senha.length > 0 &&
    confirmacao.length > 0 &&
    !enviando;

  return (
    <ContaShell
      eyebrow="Conta NIVAR"
      titulo="Criar conta"
      subtitulo="Comece pela sua identidade. Explore os produtos no seu tempo; cada acesso é ativado quando você o utiliza."
      rodape={
        <>
          Já tem conta?{" "}
          <Link className="conta-link" to="/entrar" state={location.state}>
            Entrar
          </Link>
        </>
      }
    >
      {/* noValidate: sem ele, `type="email"` aciona a validação nativa
          do browser, que BLOQUEIA o submit e mostra uma bolha em
          inglês ("Please include an '@'…") numa página inteiramente em
          português — medido, não presumido. Nossa validação em
          português, ancorada no campo por aria-describedby, é melhor
          que uma bolha transitória em outro idioma. */}
      <form
        onSubmit={aoEnviar}
        noValidate
        style={{ display: "flex", flexDirection: "column", gap: "18px" }}
      >
        <Campo
          id="criar-nome"
          rotulo="Nome"
          tipo="text"
          valor={nome}
          onChange={setNome}
          autoComplete="name"
          erro={erros.nome}
          autoFocus
        />
        <Campo
          id="criar-email"
          rotulo="Email"
          tipo="email"
          valor={email}
          onChange={(v) => {
            setEmail(v);
            if (emailEmUso) setEmailEmUso(false);
          }}
          autoComplete="email"
          erro={erros.email}
        />
        <Campo
          id="criar-senha"
          rotulo="Senha"
          tipo="password"
          valor={senha}
          onChange={setSenha}
          autoComplete="new-password"
          erro={erros.senha}
          dica={`Mínimo de ${SENHA_MINIMA} caracteres.`}
        />
        <Campo
          id="criar-confirmacao"
          rotulo="Confirmar senha"
          tipo="password"
          valor={confirmacao}
          onChange={setConfirmacao}
          autoComplete="new-password"
          erro={erros.confirmacao}
        />

        {emailEmUso && (
          <AvisoErro>
            Este email já tem conta.{" "}
            <Link className="conta-link" to="/entrar" state={location.state}>
              Entrar
            </Link>{" "}
            em vez de criar.
          </AvisoErro>
        )}
        {erroServidor && <AvisoErro>{erroServidor}</AvisoErro>}

        <button type="submit" className="conta-botao" disabled={!podeEnviar}>
          {enviando ? "Criando…" : "Criar conta"}
        </button>
      </form>

      <p
        style={{
          ...NT.nota,
          marginTop: "18px",
          marginBottom: 0,
          color: "var(--text-muted)",
        }}
      >
        Criar sua conta é gratuito. Nenhum produto é ativado nesta etapa.
      </p>
    </ContaShell>
  );
}

export default CriarContaView;
