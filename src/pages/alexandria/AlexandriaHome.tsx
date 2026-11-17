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

import { useLocation, useSearchParams } from 'react-router-dom';
import type { CurriculumTrack } from '@/lib/types/alexandria';
import { AlexandriaRouter } from './AlexandriaRouter';
import { HomeV3 } from '@/components/alexandria/v3/HomeV3';

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

  // v3: a entrada é a Home nova (apresentação para quem chega, mesa de
  // estudo para quem tem conta). A antiga usava progresso de mock (S3).
  return <HomeV3 />;
}

export default AlexandriaHome;
