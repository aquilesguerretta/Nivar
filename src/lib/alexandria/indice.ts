// Índice de trilhas, módulos e aulas da Alexandria v3.
//
// Os dados vêm de `indice.dados.ts`, GERADO a partir da extração verificada
// (tools/alexandria-dados/gerar-indice.mjs). Este arquivo só declara os tipos e
// oferece leituras. Campos `null` são ausência declarada da fonte.

import { INDICE } from './indice.dados';

export interface AulaDoIndice {
  numero: number;
  titulo: string | null;
  /** Rótulo temático da aula na fonte ("Energia × Potência"). */
  tema: string | null;
  /** Texto da fonte: pergunta do mapa (M01) ou lede da aula. `null` quando não há. */
  sinopse: string | null;
}

export interface ModuloDoIndice {
  id: string; // 'modulo-01'
  codigo: string; // 'M01'
  numero: number;
  trilhaId: string | null;
  titulo: string | null;
  /** Frase-tese do módulo, literal da fonte. */
  tese: string | null;
  totalInstrumentos: number | null;
  totalTermos: number | null;
  aulas: AulaDoIndice[];
}

export interface TrilhaDoIndice {
  id: string;
  romano: 'I' | 'II' | 'III' | string;
  nome: string | null;
  modulos: string[];
}

export interface IndiceAlexandria {
  trilhas: TrilhaDoIndice[];
  modulos: ModuloDoIndice[];
}

export const indice: IndiceAlexandria = INDICE;

export function modulosDaTrilha(trilhaId: string): ModuloDoIndice[] {
  return indice.modulos.filter((m) => m.trilhaId === trilhaId);
}

export function moduloPorId(id: string): ModuloDoIndice | null {
  return indice.modulos.find((m) => m.id === id) ?? null;
}

export const TOTAL_AULAS = indice.modulos.reduce((s, m) => s + m.aulas.length, 0);

/** Id da aula no registro de progresso do backend: 'aula-01-08'. */
export function idDaAula(modulo: ModuloDoIndice, numero: number): string {
  return `aula-${String(modulo.numero).padStart(2, '0')}-${String(numero).padStart(2, '0')}`;
}
