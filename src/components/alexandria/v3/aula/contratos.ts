// contratos.ts — o lado da AULA dos três contratos que outras sessões enchem.
//
//   videos.ts    → `videoDaAula(moduloId, aula)`     (vídeo no topo)
//   figuras.ts   → `figurasDaAula(moduloId, aula)`   (figuras na âncora)
//   avaliacao.ts → `exerciciosDaAula(moduloId, aula)` e `provaDoModulo(moduloId)`
//
// `figuras.ts` é de outra posse e pode mudar ou ainda não estar na árvore
// quando esta casca é montada: é lido por `import.meta.glob` (arquivo ausente
// vira objeto vazio, nunca erro de build) e cada figura passa por uma
// normalização defensiva — campo que não bate faz a figura cair fora, não a
// aula. `avaliacao.ts` já é tipado e é lido direto.
//
// Ausência é estado: sem figura, a leitura segue sem figura; sem vídeo, nada
// de vídeo; sem prova, a última aula não mostra prova nenhuma. Nunca
// placeholder (S4).

import type { ComponentType } from 'react';
import type { CurriculumAula } from '@/lib/types/alexandria';
import { videoDaAula, type VideoDaAula } from '@/lib/alexandria/videos';
import {
  exerciciosDaAula as exerciciosDoContrato,
  exerciciosDoModulo as exerciciosSoltosDoContrato,
  checklistDoModulo,
  provaDoModulo as provaDoContrato,
  resultadoDaProva,
  type ExercicioDaAula as ExercicioDaAulaFonte,
} from '@/lib/alexandria/avaliacao';

export type { VideoDaAula };
export { videoDaAula };

type Modulo = Record<string, unknown>;

const MODULOS_FIGURAS = import.meta.glob('../../../../lib/alexandria/figuras.ts', { eager: true }) as Record<string, Modulo>;

function funcao(mods: Record<string, Modulo>, nome: string): ((...a: unknown[]) => unknown) | null {
  for (const m of Object.values(mods)) {
    const f = m[nome];
    if (typeof f === 'function') return f as (...a: unknown[]) => unknown;
  }
  return null;
}

const texto = (v: unknown): string | null => (typeof v === 'string' && v.trim() ? v : null);

/** Chama o contrato com o número da aula; se a sessão dona tiver optado pelo
 *  id (`aula-01-03`), tenta o id. */
function chamar<T>(f: ((...a: unknown[]) => unknown) | null, moduloId: string, numero: number): T[] {
  if (!f) return [];
  const id = `aula-${moduloId.slice(-2)}-${String(numero).padStart(2, '0')}`;
  for (const arg of [numero, id]) {
    try {
      const r = f(moduloId, arg);
      if (Array.isArray(r) && r.length) return r as T[];
    } catch (err) {
      if (import.meta.env.DEV) console.warn('[alexandria] contrato lançou', err);
    }
  }
  return [];
}

// ── Figuras ──────────────────────────────────────────────────

/** Onde a figura entra na leitura. Formas aceitas, na ordem em que são
 *  tentadas: índice de bloco (entra depois dele), número de seção ("1.3",
 *  entra no fim da seção), trecho literal do texto (entra depois do bloco
 *  que o contém). Âncora que não casa entra no fim da leitura. */
export type AncoraDeFigura =
  | { tipo: 'bloco'; indice: number }
  | { tipo: 'secao'; numero: string }
  | { tipo: 'trecho'; texto: string }
  | { tipo: 'fim' };

export interface ImagemDeFigura {
  src: string;
  srcSet?: string;
  largura?: number;
  altura?: number;
}

export interface FiguraDaAula {
  id: string;
  classe: string;
  ancora: AncoraDeFigura;
  imagem: ImagemDeFigura | null;
  Diagrama: ComponentType | null;
  alt: string;
  legenda: string | null;
  credito: string | null;
  fonte: string | null;
}

const RAIZ_FOTOS_M01 = '/alexandria/v3/aulas/m01';

function lerAncora(v: unknown): AncoraDeFigura {
  if (typeof v === 'number' && Number.isInteger(v)) return { tipo: 'bloco', indice: v };
  if (typeof v === 'string') {
    if (/^\d+\.\d+$/.test(v.trim())) return { tipo: 'secao', numero: v.trim() };
    if (v === 'fim') return { tipo: 'fim' };
    return { tipo: 'trecho', texto: v };
  }
  if (v && typeof v === 'object') {
    const o = v as Record<string, unknown>;
    if (typeof o.bloco === 'number') return { tipo: 'bloco', indice: o.bloco };
    if (typeof o.indice === 'number') return { tipo: 'bloco', indice: o.indice };
    const sec = texto(o.secao);
    if (sec) return { tipo: 'secao', numero: sec };
    const tr = texto(o.trecho) ?? texto(o.apos) ?? texto(o.texto);
    if (tr) return { tipo: 'trecho', texto: tr };
  }
  return { tipo: 'fim' };
}

function lerImagem(v: unknown, moduloId: string): ImagemDeFigura | null {
  if (typeof v === 'string' && v.trim()) {
    const s = v.trim();
    if (s.includes('/') || /\.(webp|png|jpe?g|svg|avif)$/i.test(s)) return { src: s };
    // nome-base de foto publicada: o arquivo de 1000 px existe para toda foto
    // do M01 ≥ 1000 px; abaixo disso a sessão de figuras precisa dar o caminho.
    if (moduloId === 'modulo-01') return { src: `${RAIZ_FOTOS_M01}/${s}-1000.webp` };
    return null;
  }
  if (v && typeof v === 'object') {
    const o = v as Record<string, unknown>;
    const src = texto(o.src) ?? texto(o.caminho) ?? texto(o.arquivo);
    if (!src) return null;
    return {
      src,
      srcSet: texto(o.srcSet) ?? texto(o.srcset) ?? undefined,
      largura: typeof o.largura === 'number' ? o.largura : undefined,
      altura: typeof o.altura === 'number' ? o.altura : undefined,
    };
  }
  return null;
}

export function figurasDaAula(moduloId: string, numero: number): FiguraDaAula[] {
  const brutas = chamar<Record<string, unknown>>(funcao(MODULOS_FIGURAS, 'figurasDaAula'), moduloId, numero);
  const saida: FiguraDaAula[] = [];
  brutas.forEach((b, i) => {
    if (!b || typeof b !== 'object') return;
    const alt = texto(b.alt);
    const imagem = lerImagem(b.arquivo, moduloId);
    const Diagrama = typeof b.diagrama === 'function' || (b.diagrama && typeof b.diagrama === 'object' && '$$typeof' in (b.diagrama as object))
      ? (b.diagrama as ComponentType)
      : null;
    // Sem imagem e sem diagrama desenhável não há figura; sem alt, a figura
    // não é legível por leitor de tela — as duas ficam fora.
    if ((!imagem && !Diagrama) || (imagem && !alt)) return;
    saida.push({
      id: texto(b.id) ?? `fig-${numero}-${i + 1}`,
      classe: texto(b.classe) ?? 'não declarada',
      ancora: lerAncora(b.ancora),
      imagem,
      Diagrama,
      alt: alt ?? '',
      legenda: texto(b.legenda),
      credito: texto(b.credito),
      fonte: texto(b.fonte),
    });
  });
  return saida;
}

// ── Exercícios e prova ───────────────────────────────────────
//
// `avaliacao.ts` (outra posse) já existe e é tipado: lido direto. Duas
// traduções de apresentação, e só elas:
//   · o critério da fonte diz "critério de domínio"; "domínio" só aparece
//     junto de Demonstrado (S3), então a palavra sai e o resto fica literal;
//   · a faixa de placar da fonte ("Domínio sólido…") não é mostrada, pelo
//     mesmo motivo — o rótulo do resultado é o do contrato (`resultadoDaProva`).

export interface OpcaoDeItem {
  id: string;
  texto: string;
}

export interface ItemDeAvaliacao {
  id: string;
  origem: 'fonte' | 'derivado-da-aula';
  tipo: string;
  enunciadoHtml: string;
  opcoes: OpcaoDeItem[];
  /** Id da opção certa (escolha). Aberto: `null` — fecha por autoavaliação. */
  gabarito: string | null;
  /** Resposta-modelo ou trecho da aula que responde. Só depois da tentativa. */
  referencia: string | null;
  criterio: string | null;
  rotulo: string | null;
  /** Feedback literal da fonte, mostrado depois da correção (prova). */
  explicacao: string | null;
}

/** "O critério de domínio é resolver…" → "O critério da fonte é resolver…". */
export function semPalavraDeDominio(s: string): string {
  return s
    .replace(/crit[ée]rio de dom[íi]nio( do m[óo]dulo)?/gi, 'critério da fonte')
    .replace(/\s+/g, ' ')
    .trim();
}

const opcoesDe = (alts: readonly string[] | undefined): OpcaoDeItem[] =>
  (alts ?? []).map((t, i) => ({ id: String(i), texto: t }));

function rotuloDoExercicio(e: ExercicioDaAulaFonte): string {
  const m = e.id.match(/-ex-(\d+)$/);
  return m ? `Ex · ${m[1]}` : 'Recuperação';
}

function itemDoExercicio(e: ExercicioDaAulaFonte): ItemDeAvaliacao {
  const opcoes = opcoesDe(e.alternativas);
  return {
    id: e.id,
    origem: e.origem,
    tipo: e.tipo,
    enunciadoHtml: e.enunciado,
    opcoes,
    gabarito: e.tipo === 'escolha' && typeof e.gabarito === 'number' ? String(e.gabarito) : null,
    referencia: e.referencia ?? null,
    criterio: e.criterio ? semPalavraDeDominio(e.criterio) : null,
    rotulo: rotuloDoExercicio(e),
    explicacao: null,
  };
}

/** Itens de `avaliacao.ts`; o que o contrato não cobre (outro módulo) cai
 *  nos exercícios da fonte já registrados na aula (`activities`). */
/** Exercícios que a fonte não prende a uma aula (Ex de síntese, soltos do módulo). */
export function exerciciosDoModulo(moduloId: string): ItemDeAvaliacao[] {
  return exerciciosSoltosDoContrato(moduloId).map((e) => itemDoExercicio({ ...e, aula: 0 } as ExercicioDaAulaFonte));
}

export { checklistDoModulo };

export function exerciciosDaAula(moduloId: string, numero: number, aula: CurriculumAula | null): ItemDeAvaliacao[] {
  const doContrato = exerciciosDoContrato(moduloId, numero);
  if (doContrato.length || moduloId === 'modulo-01') return doContrato.map(itemDoExercicio);
  return (aula?.activities ?? []).flatMap((a): ItemDeAvaliacao[] => {
    const cfg = (a.config ?? {}) as Record<string, unknown>;
    const gab = typeof cfg.gabarito === 'string' ? cfg.gabarito : null;
    if (!gab) return [];
    return [
      {
        id: a.id,
        origem: 'fonte',
        tipo: 'aberto',
        enunciadoHtml: a.prompt,
        opcoes: [],
        gabarito: null,
        referencia: gab,
        criterio: null,
        rotulo: typeof cfg.tag === 'string' ? cfg.tag : null,
        explicacao: null,
      },
    ];
  });
}

export interface ProvaDoModulo {
  /** Critério da fonte, mostrado ANTES das questões (C10). */
  criterio: string;
  minimo: number;
  total: number;
  questoes: ItemDeAvaliacao[];
  /** Rótulo do resultado, do contrato: "Avaliação do módulo: … · X/10 · critério da fonte". */
  rotulo: (acertos: number) => string;
}

export function provaDoModulo(moduloId: string): ProvaDoModulo | null {
  const p = provaDoContrato(moduloId);
  if (!p || !p.questoes.length) return null;
  return {
    criterio: semPalavraDeDominio(p.criterio),
    minimo: p.acertosMinimos,
    total: p.total,
    questoes: p.questoes.map((q) => ({
      id: q.id,
      origem: 'fonte',
      tipo: 'escolha',
      enunciadoHtml: q.enunciado,
      opcoes: opcoesDe(q.alternativas),
      gabarito: String(q.correta),
      referencia: null,
      criterio: null,
      rotulo: null,
      explicacao: q.explicacao ?? null,
    })),
    rotulo: (acertos: number) => resultadoDaProva(p, acertos).rotulo,
  };
}
