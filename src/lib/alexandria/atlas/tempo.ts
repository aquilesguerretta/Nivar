// Atlas da Alexandria v3 — a linha do tempo da matriz (capítulo "A rede").
// Puro, sem mapa: o que entrou em operação em cada período, por fonte, e a regra
// única de "já existia no ano X" que o mapa, o "Nesta tela" e o painel usam.
//
// O que o campo É na fonte (construir.mjs e procedencia.md, seção 1 e 2):
//   · usina: `ano` é o ano de `DatEntradaOperacao` do SIGA (ANEEL), a data de entrada
//     em operação que o cadastro registra para o EMPREENDIMENTO. Só usina em operação
//     tem ano; o SIGA grava 1900 quando não tem a data e o Atlas lê isso como ausência.
//     A potência é a fiscalizada de HOJE.
//   · etapas (leva 4, 6.1): para as usinas casadas com o cadastro do ONS
//     (CAPACIDADE_GERACAO.csv, que data cada UNIDADE geradora), o construtor publica
//     `etapas` = [ano1, kw1, ano2, kw2, …]: a potência acumulada até o fim de cada ano em
//     que entraram unidades, com o último kw igual ao `kw` da ANEEL. Com etapas, a usina
//     conta no ano o que já tinha naquele ano (`kwNoAno`); sem etapas, entra inteira no
//     ano do SIGA. Tucuruí em 1990 conta a 1ª etapa, não os 8,5 GW de hoje.
//   · linha e subestação (ONS · SINDAT): `op` é o ano de entrada em operação; `opAntesDe`
//     é o ano da data de CARGA da base (31/12/1990, 02/06/2000), gravada no lugar da
//     entrada nos ativos antigos: o ativo já operava naquele ano, mas não se sabe desde
//     quando. Sem `op` nem `opAntesDe`: sem entrada em operação (prevista).
//   · usina desativada não está no cadastro: a linha do tempo é a idade da frota de hoje,
//     não a história completa da matriz.

import type { FeicaoUsina } from './dados';
import type { Categoria, UsinasColunar } from './tipos';
import { CATEGORIAS } from './tipos';

export interface FaixaDoTempo {
  de: number;
  ate: number;
  /** kW que entraram no período, por fonte (só as fontes com potência) */
  porFonte: Record<string, number>;
  /** quantas usinas entraram no período */
  n: number;
}

export interface LinhaDoTempoDaFrota {
  faixas: FaixaDoTempo[];
  /** em operação, sem ano no cadastro (o SIGA grava 1900) */
  semAno: { n: number; kw: number };
  primeiroAno: number;
  ultimoAno: number;
  /** total em operação considerado (com e sem ano) */
  total: { n: number; kw: number };
  /** acumulado ano a ano: índice = ano − primeiroAno */
  acumulado: { n: number; kw: number }[];
  /** acumulado por fonte, ano a ano (kW) */
  acumuladoPorFonte: Record<Categoria, number[]>;
  /** data-base do cadastro, quando a fonte é o arquivo colunar */
  dataBase: string | null;
  /** largura do período, em anos */
  passo: number;
  /** em operação com etapas por unidade (cadastro do ONS); as demais entram inteiras no ano do SIGA */
  comEtapas: { n: number; kw: number };
  /** kW que entraram em cada ano (índice = ano − primeiroAno): o histograma da régua compacta */
  entradaPorAno: number[];
  /** a maior usina em operação sem ano (kW), para dizer de que zoom em diante elas aparecem */
  maiorSemAno: number;
}

/** O mínimo que as contas precisam de uma usina. `etapas` é opcional (arquivo antigo ou usina sem casamento). */
export interface UsinaNoTempo {
  kw: number;
  ano: number | null;
  etapas?: readonly number[] | null;
}

const temEtapas = (e: readonly number[] | null | undefined): e is readonly number[] => Array.isArray(e) && e.length >= 2;

/**
 * Potência (kW) que a usina tinha em operação no fim de `limite`. `limite` null = hoje (`kw`).
 * Com etapas: o acumulado da última etapa ≤ limite (0 antes da primeira). Sem etapas: a usina
 * inteira a partir do ano do SIGA; sem ano, 0 com um ano escolhido (fica à parte).
 */
export function kwNoAno(u: UsinaNoTempo, limite: number | null): number {
  if (limite == null) return u.kw;
  const e = u.etapas;
  if (temEtapas(e)) {
    let v = 0;
    for (let i = 0; i + 1 < e.length; i += 2) {
      if (e[i] > limite) break;
      v = e[i + 1];
    }
    return v;
  }
  return u.ano != null && u.ano <= limite ? u.kw : 0;
}

/** Ano em que a usina passa a existir: a primeira etapa (a primeira unidade do ONS), ou o ano do SIGA. */
export function anoDeEntrada(u: UsinaNoTempo): number | null {
  return temEtapas(u.etapas) ? u.etapas[0] : u.ano;
}

/** O que o leitor passa: o arquivo colunar (principais e menores) ou as feições já expandidas. */
export type FonteDeUsinas = UsinasColunar | readonly FeicaoUsina[];

interface UsinaMinima extends UsinaNoTempo {
  cat: Categoria;
}

const ehColunar = (f: FonteDeUsinas): f is UsinasColunar => !Array.isArray(f) && typeof (f as UsinasColunar).n === 'number';

/** Percorre só as usinas EM OPERAÇÃO de cada fonte (fase 0). */
export function* usinasEmOperacao(fontes: readonly FonteDeUsinas[]): Generator<UsinaMinima> {
  for (const f of fontes) {
    if (ehColunar(f)) {
      // `etapas` é coluna nova (leva 4): lida sem depender do tipo, para o arquivo antigo seguir valendo
      const et = (f as { etapas?: (readonly number[] | null)[] }).etapas;
      for (let i = 0; i < f.n; i++) if (f.fase[i] === 0) yield { kw: f.kw[i], ano: f.ano[i], cat: f.categorias[f.cat[i]], etapas: et?.[i] ?? null };
    } else {
      for (const u of f) {
        const p = u.properties as typeof u.properties & { etapas?: readonly number[] | null };
        if (p.fase === 0) yield { kw: p.kw, ano: p.ano, cat: p.cat, etapas: p.etapas ?? null };
      }
    }
  }
}

/** Primeiro ano do período de largura `passo` que contém `ano` (períodos alinhados: 1900, 1905…). */
export const inicioDoPeriodo = (ano: number, passo: number) => Math.floor(ano / passo) * passo;

const memo = new WeakMap<readonly FonteDeUsinas[], Map<number, LinhaDoTempoDaFrota>>();

/**
 * O que entrou em operação em cada período, por fonte, das usinas em operação hoje.
 * `passo` é a largura do período em anos (5 por omissão). Usina sem ano fica em `semAno`,
 * nunca no ano zero. Memorizado pela identidade do array de fontes.
 */
export function faixasDoTempo(usinas: readonly FonteDeUsinas[], passo = 5): LinhaDoTempoDaFrota {
  const porPasso = memo.get(usinas);
  const pronto = porPasso?.get(passo);
  if (pronto) return pronto;
  let primeiro = Infinity;
  let ultimo = -Infinity;
  const semAno = { n: 0, kw: 0 };
  const total = { n: 0, kw: 0 };
  const comEtapas = { n: 0, kw: 0 };
  let maiorSemAno = 0;
  const lista: UsinaMinima[] = [];
  for (const u of usinasEmOperacao(usinas)) {
    total.n++;
    total.kw += u.kw;
    const e = u.etapas;
    if (temEtapas(e)) {
      comEtapas.n++;
      comEtapas.kw += u.kw;
      lista.push(u);
      if (e[0] < primeiro) primeiro = e[0];
      if (e[e.length - 2] > ultimo) ultimo = e[e.length - 2];
      continue;
    }
    if (u.ano == null) {
      semAno.n++;
      semAno.kw += u.kw;
      if (u.kw > maiorSemAno) maiorSemAno = u.kw;
      continue;
    }
    lista.push(u);
    if (u.ano < primeiro) primeiro = u.ano;
    if (u.ano > ultimo) ultimo = u.ano;
  }
  if (!lista.length) {
    primeiro = ultimo = new Date().getFullYear();
  }
  const faixas: FaixaDoTempo[] = [];
  for (let de = inicioDoPeriodo(primeiro, passo); de <= ultimo; de += passo) faixas.push({ de, ate: Math.min(de + passo - 1, ultimo), porFonte: {}, n: 0 });
  const nAnos = ultimo - primeiro + 1;
  // por ano: `n` = usinas que ENTRAM no ano (a primeira etapa); `kw` = potência que entra no ano
  // (cada etapa soma a diferença para a anterior: a usina cresce ao longo dos anos)
  const porAno = Array.from({ length: nAnos }, () => ({ n: 0, kw: 0 }));
  const porAnoFonte = Object.fromEntries(CATEGORIAS.map((c) => [c, new Array(nAnos).fill(0)])) as Record<Categoria, number[]>;
  const base = faixas.length ? faixas[0].de : primeiro;
  const entrar = (u: UsinaMinima, a: number, kw: number, nova: boolean) => {
    const f = faixas[Math.floor((a - base) / passo)];
    f.porFonte[u.cat] = (f.porFonte[u.cat] ?? 0) + kw;
    if (nova) {
      f.n++;
      porAno[a - primeiro].n++;
    }
    porAno[a - primeiro].kw += kw;
    porAnoFonte[u.cat][a - primeiro] += kw;
  };
  for (const u of lista) {
    const e = u.etapas;
    if (temEtapas(e)) {
      let antes = 0;
      for (let i = 0; i + 1 < e.length; i += 2) {
        entrar(u, e[i], e[i + 1] - antes, i === 0);
        antes = e[i + 1];
      }
    } else entrar(u, u.ano as number, u.kw, true);
  }
  const entradaPorAno = porAno.map((p) => p.kw);
  for (let i = 1; i < nAnos; i++) {
    porAno[i].n += porAno[i - 1].n;
    porAno[i].kw += porAno[i - 1].kw;
    for (const c of CATEGORIAS) porAnoFonte[c][i] += porAnoFonte[c][i - 1];
  }
  const dataBase = usinas.find(ehColunar)?.dataBase ?? null;
  const r: LinhaDoTempoDaFrota = { faixas, semAno, primeiroAno: primeiro, ultimoAno: ultimo, total, acumulado: porAno, acumuladoPorFonte: porAnoFonte, dataBase, passo, comEtapas, entradaPorAno, maiorSemAno };
  const m = porPasso ?? new Map<number, LinhaDoTempoDaFrota>();
  m.set(passo, r);
  if (!porPasso) memo.set(usinas, m);
  return r;
}

/** Em operação até `ano` (inclusive), das usinas com ano: `n` = as que já existiam, `kw` = a potência
 *  que elas tinham naquele ano (com etapas, só as unidades já em operação). Fora do intervalo, satura. */
export function acumuladoAte(t: LinhaDoTempoDaFrota, ano: number): { n: number; kw: number } {
  if (ano < t.primeiroAno) return { n: 0, kw: 0 };
  return t.acumulado[Math.min(ano, t.ultimoAno) - t.primeiroAno] ?? { n: 0, kw: 0 };
}

// ── a regra única de "já existia" ──────────────────────────────────────

/** Situação de um ativo diante do ano escolhido. */
export type SituacaoNoAno = 'existia' | 'ainda-nao' | 'sem-ano';

/**
 * Usina: `ano` do cadastro (só em operação tem), ou o de `anoDeEntrada(u)` quando a usina tem
 * etapas. Com `limite` null (hoje), toda usina em operação existe. Sem ano, com um ano
 * escolhido: 'sem-ano' (estado próprio, nunca o ano zero).
 */
export function situacaoDaUsina(ano: number | null | undefined, limite: number | null): SituacaoNoAno {
  if (limite == null) return 'existia';
  if (ano == null) return 'sem-ano';
  return ano <= limite ? 'existia' : 'ainda-nao';
}

/**
 * Linha ou subestação do SINDAT. `op`: ano de entrada. `opAntesDe`: ano da data de carga
 * da base (já operava nesse ano; antes dele, não se sabe). Sem os dois: prevista, nunca
 * "existia" num ano escolhido (com `limite` null vale o que o mapa já faz com previstas).
 */
export function situacaoDaRede(op: number | null | undefined, opAntesDe: number | null | undefined, limite: number | null): SituacaoNoAno {
  if (op != null) return limite == null || op <= limite ? 'existia' : 'ainda-nao';
  if (opAntesDe != null) return limite == null || opAntesDe <= limite ? 'existia' : 'sem-ano';
  return limite == null ? 'existia' : 'ainda-nao';
}

/** Frase curta do que o ano escolhido mostra, para "Nesta tela" e o painel. */
export const textoDoAno = (limite: number | null): string => (limite == null ? 'hoje' : `até ${limite}`);
