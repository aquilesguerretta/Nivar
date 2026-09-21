// AlexandriaHome — ponto de entrada do produto.
//
// Duas responsabilidades:
//
// 1. Ler o `?trilha=` que o portal BR manda e traduzir para track. Esse
//    contrato foi criado pelo ARCHITECT na Portal BR Wave 1, ficou inerte,
//    e a Wave 3 fechou aqui.
//
// 2. Montar a ENTRADA — hero mais hub, na mesma página, um scroll só.
//    Qualquer outro endereço cai no `AlexandriaRouter`, que continua dono
//    de trilha, módulo, aula, perfil, atlas e glossário.
//
// ─────────────────────────────────────────────────────────────
// POR QUE A ENTRADA MORA AQUI E NÃO NO ROUTER
//
// O brief da Wave 7 pede "AlexandriaHome renderiza Hero + TrilhasHub".
// Ele parte de que este arquivo era a página do hub. Não era: desde a
// Wave 3, `AlexandriaHome` é delegador puro de TODAS as rotas de
// `/alexandria/*`. Renderizar o hero aqui sem mais nada o faria aparecer
// também em `/atlas`, `/perfil` e dentro de cada aula.
//
// O lugar estrutural do hero seria o `HubRoute`, dentro de
// `AlexandriaRouter.tsx` — que esta wave não pode tocar. Então a entrada
// passa a ser servida aqui, e só ela: o índice é interceptado antes de
// chegar no router, e todo o resto segue igual.
//
// Consequência registrada: o `index` e o catch-all do `AlexandriaRouter`
// continuam apontando para o `HubRoute`, que agora só é alcançável como
// fallback de endereço desconhecido — e esse fallback mostra o hub SEM
// hero. Unificar isso é uma linha no router, quando ele estiver liberado.
//
// Não uso um segundo `<Routes>` aninhado de propósito: com o pai casando
// `/alexandria/*`, a resolução relativa dentro de splat é justamente o
// caso que o React Router avisa que muda na v7.
// ─────────────────────────────────────────────────────────────

import { useRef } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import type { CurriculumTrack } from '@/lib/types/alexandria';
import { AlexandriaShell } from '@/components/alexandria/shell/AlexandriaShell';
import { TrilhasHub } from '@/components/alexandria/navigation/TrilhasHub';
import { AlexandriaLandingHero } from '@/components/alexandria/landing/AlexandriaLandingHero';
import { AS } from '@/design/alexandria-tokens';
import { AlexandriaRouter, trilhaSugerida } from './AlexandriaRouter';

const TRACKS_VALIDOS: CurriculumTrack[] = ['universal', 'brasil', 'usa'];

/** Aceita só os três valores do tipo. Qualquer outra coisa — parâmetro
 *  ausente, vazio, com typo, ou injetado — vira null, e o hub não
 *  destaca nada. Nunca lança, nunca esconde trilha. */
function lerTrack(bruto: string | null): CurriculumTrack | null {
  if (!bruto) return null;
  const normalizado = bruto.trim().toLowerCase();
  return TRACKS_VALIDOS.find((t) => t === normalizado) ?? null;
}

export function AlexandriaHome() {
  const [searchParams] = useSearchParams();
  const { pathname } = useLocation();
  const trackDeEntrada = lerTrack(searchParams.get('trilha'));

  const naEntrada = pathname.replace(/\/+$/, '') === '/alexandria';
  if (!naEntrada) return <AlexandriaRouter trackDeEntrada={trackDeEntrada} />;

  return <Entrada trilhaSugeridaId={trilhaSugerida(trackDeEntrada)} />;
}

function Entrada({ trilhaSugeridaId }: { trilhaSugeridaId: string | null }) {
  const alvoDoHub = useRef<HTMLDivElement>(null);

  /** Rola o container, não o elemento.
   *
   *  `elemento.scrollIntoView({ behavior: 'smooth' })` NÃO funciona quando o
   *  scroller é um container aninhado — e o scroller aqui é o `<main>` do
   *  shell, não o documento. Medido nas três variantes: `scrollIntoView`
   *  com `auto` rola 477px, com `smooth` rola 0, e `scrollTo` no container
   *  com `smooth` rola os mesmos 477px. Só a primeira forma quebra, então
   *  a correção é chamar `scrollTo` no `<main>`, não trocar o easing. */
  const irParaOHub = () => {
    const alvo = alvoDoHub.current;
    const scroller = alvo?.closest('main');
    if (!alvo || !scroller) return;
    const reduzido = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    scroller.scrollTo({
      top: Math.max(0, alvo.offsetTop - 16),
      behavior: reduzido ? 'auto' : 'smooth',
    });
  };

  return (
    // 'trilhas', não 'biblioteca' (LYCEUM Wave 15 — correção de uma string).
    // Esta declaração vence `ativoPorRota` no header, então enquanto dizia
    // 'biblioteca' a entrada acendia Biblioteca — e como o item Trilhas
    // navega para cá, clicar em Trilhas acendia Biblioteca. Desde que a
    // Biblioteca ganhou superfície própria em `/alexandria/biblioteca`,
    // esta página representa Trilhas: ela lista as três.
    <AlexandriaShell navAtivo="trilhas">
      <div style={{ display: 'flex', flexDirection: 'column', gap: AS.xxl }}>
        <AlexandriaLandingHero onComecar={irParaOHub} />

        {/* O hub é o mesmo componente da Wave 3, intocado — inclusive o
            destaque por `?trilha=`, que continua sendo dele. O hero não
            bloqueia: quem chega pelo portal já vê a trilha destacada
            rolando a página, sem clique nenhum. */}
        <div ref={alvoDoHub} style={{ scrollMarginTop: AS.lg }}>
          <TrilhasHub trilhaSugeridaId={trilhaSugeridaId} />
        </div>
      </div>
    </AlexandriaShell>
  );
}

export default AlexandriaHome;
