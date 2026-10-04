/**
 * Comparação lado a lado — dois submercados, ou dois períodos, em colunas espelhadas.
 * A mesma estrutura de linha nas duas colunas e um divisor central de fio de 1px.
 *
 * **O espelhamento é funcional, não estético.** O rótulo hospeda a borda externa de cada
 * coluna e o valor encosta no divisor, então as duas séries de números formam um eixo único
 * no centro — é isso que torna a comparação lida de relance. O preço é que a coluna da
 * direita alinha o número pela esquerda; em mono tabular, com a mesma contagem de casas, o
 * eixo se mantém.
 *
 * A diferença entre as colunas usa a lógica hardware-alta / software-baixa já estabelecida,
 * via `TrendInline`, e vive na coluna B — B é o comparado, A é a base.
 */
export interface ComparisonColuna {
  nome: string;
  /** recorte em versalete: 'apuração mensal', 'jul 2026' */
  sub?: string;
}
export interface ComparisonLinha {
  rotulo: string;
  a?: number | string;
  b?: number | string;
  unidade?: string;
  casas?: number;
  /** sobrescreve o delta calculado de a→b */
  delta?: number;
  /** força a direção da cor; use para 'atencao' (fora de faixa) */
  direcao?: 'alta' | 'baixa' | 'neutro' | 'atencao';
  /** texto literal quando o valor não é número (ex. '—', 'sem apuração') */
  textoA?: string;
  textoB?: string;
}
export interface ComparisonProps {
  a: ComparisonColuna;
  b: ComparisonColuna;
  linhas?: ComparisonLinha[];
  /** desliga o indicador de diferença na coluna B */
  delta?: boolean;
  nota?: string;
  className?: string;
}
export declare function Comparison(props: ComparisonProps): JSX.Element;
