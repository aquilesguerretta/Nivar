// src/lib/operador/catalogo.ts
// ARCHITECT — Portal do Operador Wave 2, Fase 3.
//
// O que a lateral do console mostra, DERIVADO de dado — nunca uma lista
// de famílias escrita à mão.
//
// ─── O CRITÉRIO É "TEM FILA?", NÃO "TEM PRODUTO?" ────────────────────
// O brief da Wave 1 supunha que Hardware e Software não tinham produto
// nomeado. A medição contradisse (`docs/operador-recon-frontend.md`
// §6.5): Hardware é a ÚNICA família de prateleira vazia; Academy,
// Software e Intelligence têm produto. O que nenhuma delas tem é FILA —
// Alexandria, Terminal Brasil e Energy Brief não recebem submissão de
// cliente, então não há nada a operar.
//
// Daí o critério desta lista. Ele produz hoje `advisory` com três
// produtos e mais nada — sem aba vazia, sem estado "em construção", e
// sem nenhum `if (familia === 'hardware')` no código. No dia em que o
// Terminal Brasil ganhar fila, ele aparece por dado.
//
// ─── POR QUE UMA LISTA NOVA, E NÃO `FLUXOS_SUBMISSAO` ────────────────
// `FLUXOS_SUBMISSAO` (`src/lib/submissoes/api.ts:151`) tem CLE e Solar,
// mas NÃO tem Diagnóstico Energético — que usa cliente próprio
// (`src/lib/diagnostico/api.ts`) por não ter `source` nem `status`.
// Usá-la sozinha esconderia um terço da fila.
//
// Esta lista é IRMÃ, não substituição: aquela governa o que o Perfil de
// plataforma CONSULTA; esta governa o que o console EXIBE. A divergência
// está registrada como pendência desde a Wave 1 e se resolve na wave de
// ligação, quando o endpoint de fila existir.
//
// NADA aqui é fetch. O console desta wave não faz requisição de rede.

import { FAMILIAS_BR, type FamiliaBR, type FamiliaId } from '../data/br-familias';
import { DESTINOS_BR, type DestinoBR } from '../data/br-destinos';

/** A natureza do que o cliente manda. É o que faz as três telas de
 *  detalhe terem formas diferentes, e sai de fato medido nas recons de
 *  Wave 1, não de preferência:
 *
 *  · `documento-padronizado` — fatura de concessionária. Os mesmos
 *    campos toda vez; o operador extrai, não interpreta a estrutura.
 *  · `documento-aberto` — proposta comercial. Cada vendedor afirma o
 *    que quer, num número variável de alegações.
 *  · `ficha` — nenhum arquivo. O caso É o texto que o cliente digitou. */
export type NaturezaDoPedido = 'documento-padronizado' | 'documento-aberto' | 'ficha';

export interface ProdutoComFila {
  /** Id do catálogo (`DESTINOS_BR`) — o nome resolve por ele, nunca por
   *  string solta digitada aqui. */
  produtoId: string;
  familiaId: FamiliaId;
  natureza: NaturezaDoPedido;
  /** Prefixo da API deste produto, LIDO do cliente real que já existe em
   *  `src/lib/`. Não é chamado nesta wave; viaja junto para a wave de
   *  ligação não ter que redescobrir. */
  prefixo: string;
  /** Este produto tem caminho de entrega (`POST …/deliverable`)?
   *  Medido pela CURSOR (recon de backend, H4): CLE e Solar têm;
   *  Diagnóstico NÃO tem endpoint nem coluna. A tela de detalhe declara
   *  a ausência em vez de mostrar um slot que não leva a lugar nenhum. */
  temEntregavel: boolean;
  /** Este produto tem vocabulário de estado? CLE e Solar têm
   *  `'submitted' | 'ready'`; Diagnóstico não tem o campo
   *  (`src/lib/diagnostico/api.ts:27` declara a ausência). */
  temStatus: boolean;
}

export const PRODUTOS_COM_FILA: ProdutoComFila[] = [
  {
    produtoId: 'conta-de-luz-express',
    familiaId: 'advisory',
    natureza: 'documento-padronizado',
    prefixo: '/api/conta-luz-express',
    temEntregavel: true,
    temStatus: true,
  },
  {
    produtoId: 'solar-proposal-validator',
    familiaId: 'advisory',
    natureza: 'documento-aberto',
    prefixo: '/api/solar-proposal-validator',
    temEntregavel: true,
    temStatus: true,
  },
  {
    produtoId: 'diagnostico-energetico',
    familiaId: 'advisory',
    natureza: 'ficha',
    prefixo: '/api/diagnostico-energetico',
    temEntregavel: false,
    temStatus: false,
  },
];

export interface FamiliaComFila {
  familia: FamiliaBR;
  produtos: { fila: ProdutoComFila; destino: DestinoBR }[];
}

/** A lateral, derivada. Percorre as cinco famílias na ordem da escala de
 *  incandescência (que `FAMILIAS_BR` já fixa) e devolve só as que têm ao
 *  menos um produto com fila. Família sem fila não vira aba vazia: ela
 *  não existe nesta lista. */
export function familiasComFila(): FamiliaComFila[] {
  return FAMILIAS_BR.map((familia) => ({
    familia,
    produtos: PRODUTOS_COM_FILA.filter((f) => f.familiaId === familia.id)
      .map((fila) => {
        const destino = DESTINOS_BR.find((d) => d.id === fila.produtoId);
        return destino ? { fila, destino } : null;
      })
      .filter((p): p is { fila: ProdutoComFila; destino: DestinoBR } => p !== null),
  })).filter((f) => f.produtos.length > 0);
}

// ─── AS CINCO FAMÍLIAS NA LATERAL — pedido direto do Aquiles ─────────
// A Wave 2 mostrava só família com fila (Advisory). O Aquiles pediu as
// cinco. O critério de HONESTIDADE não muda: família sem fila aparece,
// mas cada produto dela DECLARA que não recebe pedido, e Hardware declara
// a prateleira vazia — nada finge ter fila. É o mesmo que a página de
// família do Portal já faz.

export type EstadoNaLateral = 'com-fila' | 'sem-fila' | 'prateleira-vazia';

export interface ProdutoNaLateral {
  destino: DestinoBR;
  /** Presente só quando o produto recebe pedido. */
  fila: ProdutoComFila | null;
}

export interface FamiliaNaLateral {
  familia: FamiliaBR;
  estado: EstadoNaLateral;
  produtos: ProdutoNaLateral[];
}

/** As cinco famílias, na ordem da escala de incandescência que
 *  `FAMILIAS_BR` já fixa, cada uma com os produtos do catálogo do Portal
 *  e a marca de quais recebem pedido. */
export function familiasParaLateral(): FamiliaNaLateral[] {
  return FAMILIAS_BR.map((familia) => {
    const produtos = familia.produtoIds
      .map((id) => DESTINOS_BR.find((d) => d.id === id))
      .filter((d): d is DestinoBR => Boolean(d))
      .map((destino) => ({ destino, fila: produtoComFilaPorId(destino.id) ?? null }));
    const estado: EstadoNaLateral =
      produtos.length === 0 ? 'prateleira-vazia' : produtos.some((p) => p.fila) ? 'com-fila' : 'sem-fila';
    return { familia, estado, produtos };
  });
}

/** Um produto da fila pelo id de rota. `undefined` para id desconhecido
 *  — quem chama decide (a rota manda para o 404). */
export function produtoComFilaPorId(id: string): ProdutoComFila | undefined {
  return PRODUTOS_COM_FILA.find((p) => p.produtoId === id);
}

/** Nome de exibição de um produto, resolvido pelo catálogo do Portal.
 *  Devolve o id cru se o catálogo não conhecer — que é sinal de
 *  desalinhamento entre as duas listas, e aparecer na tela é melhor que
 *  sumir em silêncio. */
export function nomeDoProduto(produtoId: string): string {
  return DESTINOS_BR.find((d) => d.id === produtoId)?.titulo ?? produtoId;
}

// Espelho da conferência que `br-familias.ts` faz sobre os próprios
// dados: um produto listado aqui e ausente do catálogo do Portal é
// desalinhamento entre as duas fontes, e some da lateral sem avisar.
if (import.meta.env.DEV) {
  const orfaos = PRODUTOS_COM_FILA.filter(
    (p) => !DESTINOS_BR.some((d) => d.id === p.produtoId),
  ).map((p) => p.produtoId);
  if (orfaos.length > 0) {
    console.warn(`[operador/catalogo] produto com fila fora de DESTINOS_BR: ${orfaos.join(', ')}`);
  }

  const foraDaFamilia = PRODUTOS_COM_FILA.filter(
    (p) => !FAMILIAS_BR.some((f) => f.id === p.familiaId && f.produtoIds.includes(p.produtoId)),
  ).map((p) => p.produtoId);
  if (foraDaFamilia.length > 0) {
    console.warn(
      `[operador/catalogo] produto atribuído a família que não o lista: ${foraDaFamilia.join(', ')}`,
    );
  }
}
