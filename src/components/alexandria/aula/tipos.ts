// tipos.ts — o contrato de uma aula construída sobre o tronco comum.
//
// Os quatro arquétipos desta wave (PRANCHA, SERIE, MESA, LUPA) recebem
// EXATAMENTE estes insumos. Nada de conteúdo vem por prop: o texto de cada
// aula é da fonte e mora no componente da aula. O que a rota entrega é
// posição (onde esta aula fica na rota do módulo), registro real (o que já
// foi percorrido) e navegação.

export interface PropsDaAula {
  trilhaId: string;
  moduloId: string;
  numero: number;
  totalAulas: number;
  /** Números das aulas do módulo já percorridas, do registro real. */
  percorridas: number[];
  /** Sem sessão (E0): o ato funciona; guardar o registro é que exige conta. */
  visitante: boolean;
  /** Navegação de SPA. */
  navegar: (destino: string) => void;
  /** Rota de uma aula do MESMO módulo, para a mini-rota. */
  rotaDaAula: (numero: number) => string;
  /** Rota da folha do módulo. */
  rotaDoModulo: string;
}
