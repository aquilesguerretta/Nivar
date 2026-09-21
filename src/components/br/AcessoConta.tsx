// src/components/br/AcessoConta.tsx
// ARCHITECT — Identidade de Plataforma, Wave 1 (adendo).
// Wave 5: registro NIVAR — três estados e comportamento intocados.
//
// A porta de entrada da conta no header do Portal Brasil. A Wave 1
// construiu /entrar, /criar-conta e /conta, mas nenhuma superfície
// linkava para elas — dava para chegar lá clicando um destino ou
// digitando a URL, e mais nada.
//
// Três estados, todos honestos sobre o que se sabe no momento:
//   · carregando — enquanto /api/auth/me não respondeu, NÃO diz
//     "Entrar". Dizer isso a quem tem sessão válida é mentira de
//     ~200ms que pisca em toda carga de página. Reserva o espaço e
//     não afirma nada.
//   · sem sessão — "Entrar", levando o destino atual junto para a
//     pessoa voltar para onde estava.
//   · com sessão — primeiro nome + link para /conta.

import { useState, type CSSProperties } from 'react';
import { Link, useLocation } from 'react-router-dom';

import { useAuth } from '../../lib/auth/AuthContext';

// Etiqueta versalete NIVAR — valores nos tokens CSS (ver PortalBR).
const ETIQUETA: CSSProperties = {
  fontFamily: 'var(--font-body)',
  fontWeight: 500,
  fontSize: 'var(--ts-etiqueta)',
  lineHeight: 'var(--lh-etiqueta)' as CSSProperties['lineHeight'],
  letterSpacing: 'var(--tr-etiqueta)',
  textTransform: 'uppercase',
};

/** Primeiro nome — o header é estreito e o nome completo empurraria o
 *  seletor de mercado. O nome inteiro está em /conta. */
function primeiroNome(nome: string): string {
  const limpo = nome.trim();
  if (!limpo) return 'Conta';
  return limpo.split(/\s+/)[0];
}

export function AcessoConta() {
  const { user, loading } = useAuth();
  const location = useLocation();
  const [sobre, setSobre] = useState(false);

  // Espaço reservado com a mesma altura de linha do que vem depois,
  // para o header não pular quando a sessão resolve.
  if (loading) {
    return (
      <span
        aria-hidden="true"
        style={{ ...ETIQUETA, padding: '5px 12px', color: 'transparent', userSelect: 'none' }}
      >
        Entrar
      </span>
    );
  }

  if (!user) {
    return (
      // Caixa de fio, NÃO fio-embaixo: o sublinhado de 2px no acento é
      // o vocabulário de item ATIVO no SeletorMercado, ao lado. Usar o
      // mesmo tratamento aqui faria "Entrar" parecer um estado em vez
      // de uma ação. Retângulo de fio é o idioma de ação — raio zero.
      // Hover do sistema: cor de texto e de fio sobem um passo, 200ms.
      <Link
        to="/entrar"
        state={{ de: location.pathname + location.search }}
        onMouseEnter={() => setSobre(true)}
        onMouseLeave={() => setSobre(false)}
        style={{
          ...ETIQUETA,
          color: sobre ? 'var(--fg-hover)' : 'var(--text-strong)',
          textDecoration: 'none',
          border: `var(--fio) solid ${sobre ? 'var(--fio-hover)' : 'var(--rule-strong)'}`,
          borderRadius: 0,
          padding: '5px 12px',
          transition: 'color var(--dur-hover) var(--ease), border-color var(--dur-hover) var(--ease)',
        }}
      >
        Entrar
      </Link>
    );
  }

  return (
    <Link
      to="/conta"
      title={user.name}
      onMouseEnter={() => setSobre(true)}
      onMouseLeave={() => setSobre(false)}
      style={{
        ...ETIQUETA,
        display: 'inline-flex',
        alignItems: 'baseline',
        gap: '8px',
        color: sobre ? 'var(--fg-hover)' : 'var(--text-strong)',
        textDecoration: 'none',
        transition: 'color var(--dur-hover) var(--ease)',
      }}
    >
      <span style={{ color: 'var(--text-faint)' }}>Conta</span>
      <span>{primeiroNome(user.name)}</span>
    </Link>
  );
}

export default AcessoConta;
