// arquetipos.ts — quais aulas já estão compostas sobre o tronco comum.
//
// O sistema de `docs/alexandria-v2/estudos/aulas/SISTEMA.md` tem dez
// arquétipos e 141 aulas. Esta wave compõe QUATRO deles, nas aulas que o bar
// §4 manda capturar e nas que o próprio sistema elege como protótipo:
//
//   PRANCHA · M01·A08 — 100 MW solar ≠ 100 MW térmica (INST·06)
//   SERIE   · M02·A04 — a curva líquida, que precisa ser desenhada
//   MESA    · M13·A06 — a aula de M13, sem instrumento nem exercício portado
//   LUPA    · M12·A01 — oitenta e sete por cento de quê, exatamente
//
// Aula fora desta lista continua caindo no estado honesto do roteador
// ("ainda não extraída" ou o corpo do viewer legado). Nada aqui inventa
// aula: a chave é o par módulo + número, e o componente é o porte do
// protótipo daquela aula.

import type { ComponentType } from 'react';
import type { PropsDaAula } from './tipos';
import { AulaM01A08 } from './AulaM01A08';
import { AulaM02A04 } from './AulaM02A04';
import { AulaM12A01 } from './AulaM12A01';
import { AulaM13A06 } from './AulaM13A06';

export interface AulaComArquetipo {
  arquetipo: 'PRANCHA' | 'SERIE' | 'MESA' | 'LUPA';
  Componente: ComponentType<PropsDaAula>;
}

const REGISTRO: Record<string, AulaComArquetipo> = {
  'modulo-01:8': { arquetipo: 'PRANCHA', Componente: AulaM01A08 },
  'modulo-02:4': { arquetipo: 'SERIE', Componente: AulaM02A04 },
  'modulo-12:1': { arquetipo: 'LUPA', Componente: AulaM12A01 },
  'modulo-13:6': { arquetipo: 'MESA', Componente: AulaM13A06 },
};

export function aulaComArquetipo(moduloId: string, numero: number): AulaComArquetipo | null {
  return REGISTRO[`${moduloId}:${numero}`] ?? null;
}

/** Códigos das aulas já compostas, para quem precisar listar. */
export const AULAS_COMPOSTAS = Object.keys(REGISTRO);
