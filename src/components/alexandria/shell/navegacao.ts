// navegacao.ts — fonte única da navegação global da Alexandria v2.
//
// Header, rodapé, barra móvel e sumário leem DAQUI. Antes da v2 o rodapé
// duplicava a lista do header e divergia (Biblioteca apontava para o hub
// no rodapé e para /biblioteca no header). Bar S5: o mesmo rótulo leva à
// mesma URL em todo lugar.

import { useEffect, useState } from 'react';
import { ABP } from '@/design/alexandria-tokens';
import { ALEXANDRIA_TRILHAS, getModuleById, getTrilhaById } from '@/lib/data/alexandria-trilhas';
import { getAulaDoModulo } from '@/lib/data/alexandria-curriculo';

export type SecaoId = 'trilhas' | 'atlas' | 'glossario' | 'biblioteca';

export interface ItemNav {
  id: SecaoId;
  rotulo: string;
  destino: string;
}

/** Ordem do brief (S5): Trilhas, Atlas, Glossário, Biblioteca. */
export const NAV_GLOBAL: readonly ItemNav[] = [
  { id: 'trilhas', rotulo: 'Trilhas', destino: '/alexandria/trilhas' },
  { id: 'atlas', rotulo: 'Atlas', destino: '/alexandria/atlas' },
  { id: 'glossario', rotulo: 'Glossário', destino: '/alexandria/glossario' },
  { id: 'biblioteca', rotulo: 'Biblioteca', destino: '/alexandria/biblioteca' },
];

export const ROTA_INICIO = '/alexandria';
export const ROTA_REGISTRO = '/alexandria/perfil';

/** T3/S3: o rótulo diz o que ABRE, não o eixo. "Progresso" era status de
 *  cabeçalho — e progresso não é status de cabeçalho. Um rótulo só, em
 *  header, rodapé, sumário e localizador (S5: mesmo rótulo, mesma URL). */
export const ROTULO_REGISTRO = 'Seu registro';

/** Seção ativa derivada do endereço. A Home não é item de nav: a marca
 *  é o caminho de volta a ela. Progresso não é seção de nav. */
export function secaoPorRota(pathname: string): SecaoId | null {
  const p = pathname.replace(/\/+$/, '');
  if (p.startsWith('/alexandria/trilha')) return 'trilhas';
  if (p.startsWith('/alexandria/atlas')) return 'atlas';
  if (p.startsWith('/alexandria/glossario')) return 'glossario';
  if (p.startsWith('/alexandria/biblioteca')) return 'biblioteca';
  return null;
}

export const ehInicio = (pathname: string) => pathname.replace(/\/+$/, '') === ROTA_INICIO;

// ── Códigos de currículo ─────────────────────────────────────
// `modulo-01` → `M01`; aula 8 → `A08`. O número do módulo é o global
// (o mesmo do id), porque é ele que a aula carrega (`aula-01-08`).

export const codigoModulo = (moduloId: string) => `M${moduloId.slice(-2)}`;
export const codigoAula = (moduloId: string, numero: number) =>
  `${codigoModulo(moduloId)}·A${String(numero).padStart(2, '0')}`;

const ROMANO: Record<number, string> = { 1: 'I', 2: 'II', 3: 'III' };
export const romanoTrilha = (level: number) => ROMANO[level] ?? String(level);

export const rotaTrilha = (trilhaId: string) => `/alexandria/trilha/${trilhaId}`;
export const rotaModulo = (trilhaId: string, moduloId: string) =>
  `/alexandria/trilha/${trilhaId}/modulo/${moduloId}`;
export const rotaAula = (trilhaId: string, moduloId: string, numero: number) =>
  `/alexandria/trilha/${trilhaId}/modulo/${moduloId}/aula/${numero}`;

/** `aula-01-08` → `{ moduloId: 'modulo-01', numero: 8 }`. */
export function partesDaAula(aulaId: string): { moduloId: string; numero: number } | null {
  const m = /^aula-(\d{2})-(\d{2})$/.exec(aulaId);
  if (!m) return null;
  return { moduloId: `modulo-${m[1]}`, numero: Number(m[2]) };
}

// ── Localizador ──────────────────────────────────────────────

export interface Migalha {
  rotulo: string;
  /** Código de aparato antes do nome (ex.: `M01`), opcional. */
  codigo?: string;
  /** null = item atual (não é link). */
  destino: string | null;
}

/** Trilha de localização para qualquer rota fora da Home. Nomes vêm do
 *  catálogo, nunca digitados (bar S5 / P8). Endereço que não casa com
 *  nenhum registro devolve só a seção. */
export function migalhasDaRota(pathname: string): Migalha[] {
  const p = pathname.replace(/\/+$/, '');
  if (ehInicio(p)) return [];

  const inicio: Migalha = { rotulo: 'Início', destino: ROTA_INICIO };
  const trilhas: Migalha = { rotulo: 'Trilhas', destino: '/alexandria/trilhas' };
  const atual = (m: Migalha): Migalha => ({ ...m, destino: null });

  if (p === '/alexandria/trilhas') return [inicio, atual(trilhas)];
  if (p.startsWith('/alexandria/atlas')) return [inicio, { rotulo: 'Atlas', destino: null }];
  if (p.startsWith('/alexandria/glossario')) return [inicio, { rotulo: 'Glossário', destino: null }];
  if (p.startsWith('/alexandria/biblioteca')) return [inicio, { rotulo: 'Biblioteca', destino: null }];
  if (p.startsWith('/alexandria/perfil')) return [inicio, { rotulo: ROTULO_REGISTRO, destino: null }];

  const m = /^\/alexandria\/trilha\/([^/]+)(?:\/modulo\/([^/]+)(?:\/(jogo|aula\/([^/]+)))?)?$/.exec(p);
  if (!m) return [inicio, { rotulo: 'Endereço sem registro', destino: null }];

  const trilha = getTrilhaById(m[1]);
  if (!trilha) return [inicio, trilhas, { rotulo: 'Trilha sem registro', destino: null }];

  const out: Migalha[] = [inicio, trilhas];
  const mTrilha: Migalha = {
    rotulo: trilha.title,
    codigo: `Trilha ${romanoTrilha(trilha.level)}`,
    destino: rotaTrilha(trilha.id),
  };
  if (!m[2]) return [...out, atual(mTrilha)];
  out.push(mTrilha);

  const modulo = getModuleById(m[2]);
  if (!modulo || modulo.trilhaId !== trilha.id) {
    return [...out, { rotulo: 'Módulo sem registro', destino: null }];
  }
  const mModulo: Migalha = {
    rotulo: modulo.title,
    codigo: codigoModulo(modulo.id),
    destino: rotaModulo(trilha.id, modulo.id),
  };
  if (!m[3]) return [...out, atual(mModulo)];
  out.push(mModulo);

  if (m[3] === 'jogo') return [...out, { rotulo: 'Exercício de decisão', destino: null }];

  const numero = Number(m[4]);
  if (!Number.isInteger(numero)) return [...out, { rotulo: 'Aula sem registro', destino: null }];
  const aula = getAulaDoModulo(modulo.id, numero);
  return [
    ...out,
    {
      rotulo: aula ? aula.title : `Aula ${numero}`,
      codigo: `A${String(numero).padStart(2, '0')}`,
      destino: null,
    },
  ];
}

// ── Largura ──────────────────────────────────────────────────

export type Largura = 'movel' | 'medio' | 'largo';

function larguraAgora(): Largura {
  if (typeof window === 'undefined') return 'largo';
  const w = window.innerWidth;
  if (w < ABP.medio) return 'movel';
  if (w < ABP.largo) return 'medio';
  return 'largo';
}

/** Largura do viewport em três faixas. Estilo inline não tem media
 *  query; este hook é o ponto único de quebra do shell e da entrada. */
export function useLargura(): Largura {
  const [l, setL] = useState<Largura>(larguraAgora);
  useEffect(() => {
    const aoMudar = () => setL(larguraAgora());
    window.addEventListener('resize', aoMudar);
    return () => window.removeEventListener('resize', aoMudar);
  }, []);
  return l;
}

/** Onde moram os quatro territórios (T31).
 *
 *    `topo`  ≥960 .. na mesma linha do cabeçalho
 *    `linha` 768–959 .. em linha de rota própria, logo abaixo — a 768 a
 *            nav global NÃO vira barra de telefone: o tablet tem largura
 *            de sobra e a folha comporta os quatro nomes
 *    `barra` <768 .. barra inferior, com os cinco glifos gravados
 */
export type ModoNav = 'topo' | 'linha' | 'barra';

function modoAgora(): ModoNav {
  if (typeof window === 'undefined') return 'topo';
  const w = window.innerWidth;
  if (w >= ABP.navTopo) return 'topo';
  if (w >= ABP.medio) return 'linha';
  return 'barra';
}

export function useModoNav(): ModoNav {
  const [v, setV] = useState<ModoNav>(modoAgora);
  useEffect(() => {
    const f = () => setV(modoAgora());
    window.addEventListener('resize', f);
    return () => window.removeEventListener('resize', f);
  }, []);
  return v;
}

/** Movimento reduzido — chega ao mesmo estado final, sem transição. */
export function useMovimentoReduzido(): boolean {
  const [r, setR] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  );
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const f = () => setR(mq.matches);
    mq.addEventListener('change', f);
    return () => mq.removeEventListener('change', f);
  }, []);
  return r;
}

export const TRILHAS_ORDENADAS = [...ALEXANDRIA_TRILHAS].sort((a, b) => a.level - b.level);

/** Faixa de fólios de um território, lida do catálogo: `M01–M05`. Nunca
 *  digitada — o sumário do atlas (folha MAIS) imprime daqui. */
export function faixaDeFolios(moduleIds: readonly string[]): string {
  if (moduleIds.length === 0) return 'sem fólio declarado';
  const codigos = moduleIds.map(codigoModulo).sort();
  const primeiro = codigos[0];
  const ultimo = codigos[codigos.length - 1];
  return primeiro === ultimo ? primeiro : `${primeiro}–${ultimo}`;
}

/** Módulos de um território, na ordem do catálogo, com o fólio ao lado. */
export function foliosDoTerritorio(moduleIds: readonly string[]) {
  return moduleIds
    .map((id) => {
      const m = getModuleById(id);
      return m ? { id, codigo: codigoModulo(id), titulo: m.title, trilhaId: m.trilhaId } : null;
    })
    .filter((x): x is { id: string; codigo: string; titulo: string; trilhaId: string } => x !== null);
}
