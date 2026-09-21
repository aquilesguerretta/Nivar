/**
 * Legenda de gráfico. Amostra mais rótulo em mono versalete, para `TimeSeriesChart` e `BarChart`.
 *
 * **A amostra imita o desenho da marca que representa**, não um bloco genérico: série é um traço
 * curto de 14×2px, a mesma espessura da linha do gráfico; barra é um bloco de 9×9px com raio
 * zero, a mesma forma da barra. Trocar um pelo outro obriga o leitor a traduzir entre a legenda
 * e o gráfico.
 *
 * Fica **abaixo** do gráfico, atrás de um fio de 1px — nunca flutuando sobre a área de plotagem,
 * onde cobriria dado.
 */
export interface LegendaItem {
  rotulo: string;
  /** nome de família, nome de direção (alta/baixa/atencao/neutro) ou cor CSS literal */
  cor?: string;
  /** sobrescreve o `tipo` do conjunto para este item */
  tipo?: 'linha' | 'barra';
  /** valor corrente em mono, à direita do rótulo */
  valor?: string | number;
}
export interface ChartLegendProps {
  itens?: LegendaItem[];
  /** forma da amostra para todos os itens */
  tipo?: 'linha' | 'barra';
  /** fio de 1px acima da legenda */
  fio?: boolean;
  className?: string;
}
export declare function ChartLegend(props: ChartLegendProps): JSX.Element;
