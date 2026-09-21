// src/pages/auth/SignupGate.tsx
// ARCHITECT — Identidade de Plataforma, Wave 1 (fase extra).
//
// "Access Terminal" continua indo para /signup, mas /signup deixa de
// ser um formulário e passa a ser uma CHECAGEM DE CONTA. Identidade
// primeiro, "que tipo de trader você é" depois.
//
//   sem sessão → /criar-conta, com retorno para cá
//   com sessão → segue direto para a escolha de arquétipo
//
// A LÓGICA DE ARQUÉTIPO NÃO FOI TOCADA. `/signup/profile`,
// `/signup/details` e `/signup/success` estão byte-idênticos: escolha
// dos sete perfis, formulários por variante, o que for. Só a etapa
// anterior a eles mudou de dono.
//
// ─────────────────────────────────────────────────────────────
// POR QUE ESTE GATE POPULA O `authStore`
//
// As três telas seguintes usam `email !== ''` como GUARDA DE
// SEQUÊNCIA — `if (email === '') return <Navigate to="/signup" />` em
// SignupProfilePage L43, SignupDetailsPage L812 e SignupSuccessPage
// L16. O email nunca é renderizado; ele só prova "esta pessoa passou
// pela etapa 1".
//
// Se o gate apenas navegasse sem gravar nada, o store ficaria vazio,
// as três telas devolveriam para /signup, e /signup mandaria de volta
// para elas: laço infinito. Semear o store a partir do usuário REAL
// mantém os guards funcionando exatamente como hoje, sem editar
// nenhuma das três.
//
// O que a tela substituída fazia: pedia nome, email e senha, validava
// a senha com no mínimo 8 caracteres e a DESCARTAVA — `setCredentials`
// só gravava nome e email. Agora a senha é de verdade, a conta existe
// no banco, e o nome e o email vêm de lá.
// ─────────────────────────────────────────────────────────────

import { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

import { C, F } from '@/design/tokens';
import { useAuthStore } from '@/stores/authStore';
import { useAuth } from '@/lib/auth/AuthContext';

/** Primeira etapa real do fluxo de arquétipo — para onde o gate manda
 *  quem já tem conta, e para onde /criar-conta devolve. */
const PRIMEIRA_ETAPA_ARQUETIPO = '/signup/profile';

export function SignupGate() {
  const { user, loading } = useAuth();
  const location = useLocation();
  const setCredentials = useAuthStore((s) => s.setCredentials);

  // Semeia o store legado com a identidade REAL. Roda antes do
  // redirecionamento pintar, então a tela de destino já encontra o
  // guard satisfeito.
  useEffect(() => {
    if (user) setCredentials({ name: user.name, email: user.email });
  }, [user, setCredentials]);

  // Enquanto /api/auth/me não respondeu não dá para decidir: mandar
  // para /criar-conta aqui faria quem já tem conta criar outra.
  if (loading) {
    return (
      <div style={{ width: '100%', maxWidth: 440 }}>
        <p style={{ fontFamily: F.sans, fontSize: 15, color: C.textSecondary }}>
          Checking your account…
        </p>
      </div>
    );
  }

  if (!user) {
    // `de` volta para /signup, não direto para /signup/profile: ao
    // voltar, este gate roda de novo, semeia o store e só então
    // encaminha. Pular para /signup/profile deixaria o store vazio e
    // o guard de lá devolveria para cá.
    return (
      <Navigate
        to="/criar-conta"
        replace
        state={{ de: location.pathname + location.search }}
      />
    );
  }

  return <Navigate to={PRIMEIRA_ETAPA_ARQUETIPO} replace />;
}

export default SignupGate;
