// Verbetes do Glossário v3 — leitura derivada do glossário do produto.
//
// Fonte única: `ALEXANDRIA_GLOSSARIO` (src/lib/data/alexandria-glossario.ts), os
// glossários dos 17 módulos, 2.124 definições. Nada aqui escreve definição: este
// módulo só reagrupa, indexa para busca e cruza com o índice do currículo.
//
// Agrupamento (decisão de 15/11/2026, seção Glossário). Um VERBETE é o termo;
// cada DEFINIÇÃO é a de um módulo. O mesmo termo definido em mais de um módulo
// vira UMA entrada com as definições empilhadas, cada uma com o rótulo do seu
// módulo, na ordem da trilha (M01 → M17), nunca fundidas. A chave ignora caixa,
// acento e o parêntese final ("Fator de capacidade (FC)" e "Fator de
// capacidade" são o mesmo termo), e o termo literal de cada definição continua
// visível quando difere do título da entrada.
//
// "Onde aparece": o vínculo mecânico de `aulaIds` (decisão 5) — o termo aparece
// literalmente no texto da aula do mesmo módulo. É lido sob demanda: a lista e a
// busca não precisam dele, e calcular os 17 módulos custa uma varredura do texto
// de todas as aulas.

import type { GlossaryTerm } from '@/lib/types/alexandria';
import { ALEXANDRIA_GLOSSARIO, MODULO_DO_VERBETE } from '@/lib/data/alexandria-glossario';
import { RELEITURAS, type Releitura } from '@/lib/data/alexandria-glossario-releitura';
import { getCorpoAula } from '@/lib/data/alexandria-curriculo';
import { aulasOndeAparece, decodificar } from './glossario-ocorrencia';
import { indice, moduloPorId } from './indice';

export interface AulaAncorada {
  id: string; // 'aula-01-02'
  numero: number;
  titulo: string | null;
  rota: string | null;
}

export interface Definicao {
  id: string;
  moduloId: string; // 'modulo-04'
  codigo: string; // 'M04'
  moduloTitulo: string | null;
  moduloRota: string | null;
  /** Termo literal da fonte, como o § Lex deste módulo escreve. */
  termo: string;
  /** Etiqueta ou família literal da fonte (`unit`). */
  familia: string;
  /** HTML inline da fonte (só <b>, <strong>, <em> e entidades). */
  definicaoHtml: string;
  definicaoTexto: string;
  /** Aulas do mesmo módulo em que o termo aparece (vínculo mecânico, lido sob demanda). */
  readonly aulas: AulaAncorada[];
  /** Normalizados para a busca. */
  readonly nTermo: string;
  readonly nChave: string;
  readonly nFamilia: string;
  readonly nTexto: string;
}

export interface Verbete {
  slug: string;
  /** Chave de agrupamento: sem caixa, acento e parêntese. */
  chave: string;
  termo: string;
  definicoes: Definicao[];
  codigos: string[];
  readonly comAula: boolean;
  /** Releitura dos números entre os módulos, quando houve (decisão, item 4). */
  releitura: Releitura | null;
}

export interface ModuloDoGlossario {
  id: string;
  codigo: string;
  numero: number;
  titulo: string | null;
  totalDefinicoes: number;
  readonly comAula: number;
  familias: string[];
}

/** Sem acento, sem caixa, sem HTML. */
export function normalizar(s: string): string {
  return decodificarEntidades(s.replace(/<[^>]+>/g, ' '))
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();
}

export function decodificarEntidades(s: string): string {
  return decodificar(s);
}

export function chaveDoTermo(termo: string): string {
  return normalizar(termo.replace(/\s*\([^)]*\)\s*/g, ' ')).replace(/\.$/, '');
}

function slugDe(chave: string): string {
  return chave.replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'termo';
}

function moduloDoTermo(t: GlossaryTerm): string {
  const m = MODULO_DO_VERBETE.get(t.id);
  if (!m) throw new Error(`verbete sem módulo de origem: ${t.id}`);
  return m;
}

/** Posição do módulo na trilha (a ordem do índice do currículo). */
const ORDEM_DO_MODULO = new Map(indice.modulos.map((m, i) => [m.id, i] as const));
const ordemDoModulo = (id: string) => ORDEM_DO_MODULO.get(id) ?? Number(id.slice(-2)) + 1000;

function aulaAncorada(aulaId: string): AulaAncorada {
  const mm = aulaId.match(/^aula-(\d\d)-(\d\d)$/);
  const numero = mm ? Number(mm[2]) : NaN;
  const modulo = mm ? moduloPorId(`modulo-${mm[1]}`) : null;
  const aula = modulo?.aulas.find((a) => a.numero === numero) ?? null;
  return {
    id: aulaId,
    numero,
    titulo: aula?.titulo ?? null,
    rota: modulo && aula && modulo.trilhaId ? `/alexandria/trilha/${modulo.trilhaId}/modulo/${modulo.id}/aula/${numero}` : null,
  };
}

function montar(): { verbetes: Verbete[]; modulos: ModuloDoGlossario[] } {
  const grupos = new Map<string, Definicao[]>();
  for (const t of ALEXANDRIA_GLOSSARIO) {
    const moduloId = moduloDoTermo(t);
    const modulo = moduloPorId(moduloId);
    const termo = decodificarEntidades(t.term);
    const familia = decodificarEntidades(t.unit);
    const definicaoTexto = decodificarEntidades(t.definition.replace(/<[^>]+>/g, ''));
    let aulas: AulaAncorada[] | null = null;
    const def: Definicao = {
      id: t.id,
      moduloId,
      codigo: `M${moduloId.slice(-2)}`,
      moduloTitulo: modulo?.titulo ?? null,
      moduloRota: modulo?.trilhaId ? `/alexandria/trilha/${modulo.trilhaId}/modulo/${modulo.id}` : null,
      termo,
      familia,
      definicaoHtml: t.definition,
      definicaoTexto,
      get aulas() {
        return (aulas ??= t.aulaIds.map(aulaAncorada));
      },
      nTermo: normalizar(termo),
      nChave: chaveDoTermo(termo),
      nFamilia: normalizar(familia),
      nTexto: normalizar(definicaoTexto),
    };
    const lista = grupos.get(def.nChave);
    if (lista) lista.push(def);
    else grupos.set(def.nChave, [def]);
  }

  const releituras = new Map(RELEITURAS.map((r) => [r.chave, r] as const));
  const usados = new Set<string>();
  const verbetes: Verbete[] = [];
  for (const [chave, defs] of grupos) {
    // Ordem da trilha: M01 → M17.
    defs.sort((a, b) => ordemDoModulo(a.moduloId) - ordemDoModulo(b.moduloId));
    let slug = slugDe(chave);
    for (let i = 2; usados.has(slug); i++) slug = `${slugDe(chave)}-${i}`;
    usados.add(slug);
    // Título: o literal mais curto entre os módulos — o que dispensa o parêntese.
    // Empate: o do primeiro módulo da trilha.
    const termo = [...defs].sort((a, b) => a.termo.length - b.termo.length)[0].termo;
    verbetes.push({
      slug,
      chave,
      termo,
      definicoes: defs,
      codigos: [...new Set(defs.map((d) => d.codigo))],
      get comAula() {
        return defs.some((d) => d.aulas.length > 0);
      },
      releitura: releituras.get(chave) ?? null,
    });
  }
  verbetes.sort((a, b) => a.termo.localeCompare(b.termo, 'pt-BR', { sensitivity: 'base' }));

  const porModulo = new Map<string, Definicao[]>();
  for (const v of verbetes) for (const d of v.definicoes) {
    const l = porModulo.get(d.moduloId);
    if (l) l.push(d);
    else porModulo.set(d.moduloId, [d]);
  }
  const modulos: ModuloDoGlossario[] = [...porModulo.entries()]
    .sort(([a], [b]) => ordemDoModulo(a) - ordemDoModulo(b))
    .map(([id, defs]) => {
      const m = moduloPorId(id);
      return {
        id,
        codigo: `M${id.slice(-2)}`,
        numero: Number(id.slice(-2)),
        titulo: m?.titulo ?? null,
        totalDefinicoes: defs.length,
        get comAula() {
          return defs.filter((d) => d.aulas.length > 0).length;
        },
        familias: [...new Set(defs.map((d) => d.familia))],
      };
    });

  return { verbetes, modulos };
}

const { verbetes: VERBETES, modulos: MODULOS } = montar();

export const VERBETES_V3: readonly Verbete[] = VERBETES;
export const MODULOS_DO_GLOSSARIO: readonly ModuloDoGlossario[] = MODULOS;
export const TOTAL_DEFINICOES = ALEXANDRIA_GLOSSARIO.length;
export const TOTAL_MODULOS_CURRICULO = indice.modulos.length;
/** Verbetes definidos em mais de um módulo. */
export const VERBETES_EM_VARIOS_MODULOS = VERBETES.filter((v) => v.codigos.length > 1);

export function verbetePorSlug(slug: string): Verbete | null {
  return VERBETES.find((v) => v.slug === slug) ?? null;
}

// ── termo emprestado de módulo anterior ──────────────────────
//
// Decisão da coordenação (15/11/2026): quando o módulo da aula NÃO define um
// termo, a aula liga a definição do módulo ANTERIOR mais próximo na ordem da
// trilha, rotulada "definido no MNN". Se o módulo da aula define o termo, a
// definição dele vale e nada é emprestado. Módulo posterior nunca empresta: o
// aluno ainda não chegou lá.

export interface Emprestimo {
  verbete: Verbete;
  def: Definicao;
}

const cacheEmprestimos = new Map<string, Emprestimo[]>();

/** Termos que o módulo não define e algum módulo anterior define, cada um com a
 *  definição do anterior mais próximo. */
export function emprestimosDoModulo(moduloId: string): Emprestimo[] {
  const pronto = cacheEmprestimos.get(moduloId);
  if (pronto) return pronto;
  const ordem = ordemDoModulo(moduloId);
  const saida: Emprestimo[] = [];
  for (const v of VERBETES) {
    if (v.definicoes.some((d) => d.moduloId === moduloId)) continue;
    let melhor: Definicao | null = null;
    for (const d of v.definicoes) {
      const o = ordemDoModulo(d.moduloId);
      if (o < ordem && (!melhor || o > ordemDoModulo(melhor.moduloId))) melhor = d;
    }
    if (melhor) saida.push({ verbete: v, def: melhor });
  }
  cacheEmprestimos.set(moduloId, saida);
  return saida;
}

const cacheEmprestadosNaAula = new Map<string, Emprestimo[]>();

/** Dos empréstimos do módulo, os que aparecem no texto DESTA aula (a mesma regra
 *  mecânica da decisão 5). Calculado só sobre o texto da aula, uma vez por aula. */
export function emprestadosNaAula(aulaId: string, moduloId: string): Emprestimo[] {
  const pronto = cacheEmprestadosNaAula.get(aulaId);
  if (pronto) return pronto;
  const emprestimos = emprestimosDoModulo(moduloId);
  const mapa = aulasOndeAparece(
    [{ id: aulaId, blocos: getCorpoAula(aulaId) }],
    emprestimos.map((e) => ({ id: e.def.id, termo: e.def.termo })),
  );
  const saida = emprestimos.filter((e) => (mapa.get(e.def.id) ?? []).length > 0);
  cacheEmprestadosNaAula.set(aulaId, saida);
  return saida;
}

// ── busca ────────────────────────────────────────────────────

export interface Achado {
  verbete: Verbete;
  /** 0 = termo exato … 5 = só na definição. Ordena a lista. */
  peso: number;
  /** Trecho da definição em volta do que foi buscado, quando o termo não casa. */
  trecho: string | null;
}

export function buscar(
  q: string,
  filtro: { modulo: string | null; ancora: 'todas' | 'com' | 'sem' },
): Achado[] {
  const n = normalizar(q);
  const saida: Achado[] = [];
  for (const v of VERBETES) {
    const defs = filtro.modulo ? v.definicoes.filter((d) => d.moduloId === filtro.modulo) : v.definicoes;
    if (!defs.length) continue;
    if (filtro.ancora !== 'todas') {
      const temAula = defs.some((d) => d.aulas.length > 0);
      if (filtro.ancora === 'com' && !temAula) continue;
      if (filtro.ancora === 'sem' && temAula) continue;
    }
    if (!n) {
      saida.push({ verbete: v, peso: 0, trecho: null });
      continue;
    }
    const termos = defs.map((d) => d.nTermo);
    let peso = -1;
    if (defs.some((d) => d.nTermo === n || d.nChave === n)) peso = 0;
    else if (termos.some((t) => t.startsWith(n))) peso = 1;
    else if (termos.some((t) => t.split(/[\s/(·-]+/).some((p) => p.startsWith(n)))) peso = 2;
    else if (termos.some((t) => t.includes(n))) peso = 3;
    else if (defs.some((d) => d.nFamilia.includes(n))) peso = 4;
    let trecho: string | null = null;
    if (peso < 0) {
      for (const d of defs) {
        const alvo = d.nTexto;
        const i = alvo.indexOf(n);
        if (i >= 0) {
          peso = 5;
          // Tirar o acento não muda o comprimento do texto já sem HTML, então a posição
          // achada no texto normalizado corta o texto original no mesmo lugar.
          const ini = Math.max(0, i - 48);
          const fim = Math.min(d.definicaoTexto.length, i + n.length + 64);
          trecho = `${ini > 0 ? '…' : ''}${d.definicaoTexto.slice(ini, fim).trim()}${fim < d.definicaoTexto.length ? '…' : ''}`;
          break;
        }
      }
    }
    if (peso >= 0) saida.push({ verbete: v, peso, trecho });
  }
  if (n) saida.sort((a, b) => a.peso - b.peso || a.verbete.termo.localeCompare(b.verbete.termo, 'pt-BR', { sensitivity: 'base' }));
  return saida;
}

// ── vizinhos ─────────────────────────────────────────────────

export interface Vizinhanca {
  codigo: string;
  /** Família compartilhada, quando os vizinhos vêm dela; null quando vêm da ordem do § Lex. */
  familia: string | null;
  verbetes: Verbete[];
}

/** Vizinhos de uma definição: os termos da mesma família no § Lex do mesmo módulo;
 *  quando a família é só dele, os termos ao lado na ordem do módulo. */
export function vizinhosDe(def: Definicao, limite = 6): Vizinhanca {
  const doModulo = VERBETES.filter((v) => v.definicoes.some((d) => d.moduloId === def.moduloId));
  const mesmaFamilia = doModulo.filter(
    (v) => v.definicoes.some((d) => d.moduloId === def.moduloId && d.familia === def.familia && d.id !== def.id),
  );
  if (mesmaFamilia.length >= 2) {
    return { codigo: def.codigo, familia: def.familia, verbetes: mesmaFamilia.slice(0, limite) };
  }
  const i = doModulo.findIndex((v) => v.definicoes.some((d) => d.id === def.id));
  const meio = Math.floor(limite / 2);
  const ini = Math.max(0, Math.min(i - meio, doModulo.length - limite - 1));
  const janela = doModulo.slice(ini, ini + limite + 1).filter((_, k) => ini + k !== i);
  return { codigo: def.codigo, familia: null, verbetes: janela.slice(0, limite) };
}

/** Converte o HTML inline da fonte (<b>, <strong>, <em>) em trechos marcados, sem innerHTML. */
export function trechosDaDefinicao(html: string): { texto: string; forte: boolean; enfase: boolean }[] {
  const saida: { texto: string; forte: boolean; enfase: boolean }[] = [];
  let forte = 0;
  let enfase = 0;
  for (const parte of html.split(/(<\/?(?:b|strong|em|i)>)/)) {
    if (!parte) continue;
    const tag = parte.match(/^<(\/?)(b|strong|em|i)>$/);
    if (tag) {
      const delta = tag[1] ? -1 : 1;
      if (tag[2] === 'b' || tag[2] === 'strong') forte = Math.max(0, forte + delta);
      else enfase = Math.max(0, enfase + delta);
      continue;
    }
    saida.push({ texto: decodificarEntidades(parte.replace(/<[^>]+>/g, '')), forte: forte > 0, enfase: enfase > 0 });
  }
  return saida;
}
