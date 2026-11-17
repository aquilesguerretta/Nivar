// catalogo.ts — o que pode voltar numa revisão, e de onde vem o texto.
//
// Só volta o que tem enunciado e referência na fonte: os exercícios por aula
// de `avaliacao.ts` (somente leitura aqui; outra posse). Previsão, prova do
// módulo e checklist não são itens de revisão — não há enunciado a devolver
// nem resposta-modelo a comparar.
//
// O catálogo é montado uma vez, pelo índice: para cada módulo e cada aula, os
// exercícios que o contrato tem. Módulo que ainda não está no contrato (porte
// paralelo) simplesmente não entra; quando entrar, o item passa a ser
// reconhecido sem nada mudar aqui.

import { exerciciosDaAula, type ExercicioDaAula } from '../avaliacao';
import { idDaAula, indice, type ModuloDoIndice } from '../indice';
import type { ItemRevisavel } from './agenda';

export interface ItemDeRevisao extends ItemRevisavel {
  exercicio: ExercicioDaAula;
  modulo: ModuloDoIndice;
  aulaNumero: number;
  aulaTitulo: string | null;
  /** Id da aula no registro de progresso (`aula-01-03`). */
  aulaId: string;
  rotaDaAula: string | null;
}

function textoDoGabarito(e: ExercicioDaAula): string | null {
  if (e.tipo !== 'escolha' || typeof e.gabarito !== 'number') return null;
  return e.alternativas?.[e.gabarito] ?? null;
}

let cache: Map<string, ItemDeRevisao> | null = null;

export function catalogoDeRevisao(): Map<string, ItemDeRevisao> {
  if (cache) return cache;
  const mapa = new Map<string, ItemDeRevisao>();
  for (const modulo of indice.modulos) {
    for (const aula of modulo.aulas) {
      for (const e of exerciciosDaAula(modulo.id, aula.numero)) {
        if (mapa.has(e.id)) continue; // id repetido: o primeiro vale, e nada se funde
        mapa.set(e.id, {
          id: e.id,
          textoDoGabarito: textoDoGabarito(e),
          exercicio: e,
          modulo,
          aulaNumero: aula.numero,
          aulaTitulo: aula.titulo,
          aulaId: idDaAula(modulo, aula.numero),
          rotaDaAula: modulo.trilhaId
            ? `/alexandria/trilha/${modulo.trilhaId}/modulo/${modulo.id}/aula/${aula.numero}`
            : null,
        });
      }
    }
  }
  cache = mapa;
  return mapa;
}
