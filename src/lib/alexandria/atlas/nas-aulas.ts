// Atlas da Alexandria v3 — o contrato com as aulas.
//
// Uma "vista" é um enquadramento do Atlas que ilustra uma frase de uma aula:
// câmera, camadas, destaque e a citação literal. Este arquivo é a ÚNICA coisa
// que uma aula precisa importar para oferecer "ver no Atlas"; ele é leve (só o
// índice: id, módulo, aula, título) e não puxa o mapa para o bundle da aula.
//
//   import { vistasDaAula, rotaDaVista } from '@/lib/alexandria/atlas/nas-aulas';
//
//   const vistas = vistasDaAula('modulo-08', 5);
//   vistas.map((v) => <Link to={rotaDaVista(v.id)}>{v.titulo}</Link>)
//
// A rota profunda é `/alexandria/atlas?vista=<id>`. O Atlas abre já enquadrado,
// com a citação da aula e o caminho de volta para ela.

import type { CapituloId } from './tipos';
import { INDICE_DE_VISTAS } from './vistas.indice';

export interface VistaDaAula {
  /** identificador estável, ex.: 'm08-a05-corredores' */
  id: string;
  /** 'modulo-08' */
  moduloId: string;
  /** número da aula dentro do módulo (1…) */
  aula: number;
  /** título curto da vista, pronto para virar texto de link */
  titulo: string;
  /** capítulo do Atlas em que a vista abre */
  capitulo: CapituloId;
  /** rota profunda da vista */
  rota: string;
}

/** Rota profunda de uma vista do Atlas. */
export function rotaDaVista(id: string): string {
  return `/alexandria/atlas?vista=${encodeURIComponent(id)}`;
}

const paraAula = (v: (typeof INDICE_DE_VISTAS)[number]): VistaDaAula => ({ id: v.id, moduloId: v.m, aula: v.a, titulo: v.t, capitulo: v.c, rota: rotaDaVista(v.id) });

/** As vistas do Atlas de uma aula, na ordem em que aparecem no texto.
 *  Lista vazia quando a aula não tem geografia: é resultado, não erro. */
export function vistasDaAula(moduloId: string, aula: number): VistaDaAula[] {
  return INDICE_DE_VISTAS.filter((v) => v.m === moduloId && v.a === aula).map(paraAula);
}

/** Todas as vistas de um módulo, agrupáveis por aula. */
export function vistasDoModulo(moduloId: string): VistaDaAula[] {
  return INDICE_DE_VISTAS.filter((v) => v.m === moduloId).map(paraAula);
}

/** Uma vista pelo id, ou null. */
export function vistaPorId(id: string): VistaDaAula | null {
  const v = INDICE_DE_VISTAS.find((x) => x.id === id);
  return v ? paraAula(v) : null;
}

/** Quantas vistas o Atlas tem hoje, e em quantas aulas. */
export function coberturaDasVistas(): { vistas: number; aulas: number; modulos: number } {
  const aulas = new Set(INDICE_DE_VISTAS.map((v) => `${v.m}#${v.a}`));
  const modulos = new Set(INDICE_DE_VISTAS.map((v) => v.m));
  return { vistas: INDICE_DE_VISTAS.length, aulas: aulas.size, modulos: modulos.size };
}
