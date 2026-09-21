/**
 * Série temporal. A linha mantém UMA cor por gráfico inteiro (--serie-linha) e não muda
 * conforme sobe ou desce — numa série longa isso seria ruído. A lógica de direção
 * (hardware alta / software baixa) fica nos indicadores discretos: marcador do ponto final e
 * rótulo de variação no cabeçalho. Eixo em JetBrains Mono. Sem grade decorativa: só os fios
 * de referência que ajudam a ler magnitude.
 *
 * @startingPoint section="Dado" subtitle="Série temporal com eixo em mono e marcador de direção" viewport="700x260"
 */
export interface SeriePonto { x: string; y: number }
export interface TimeSeriesChartProps {
  serie: SeriePonto[];
  width?: number;
  height?: number;
  titulo?: string;
  /** exibida ao lado do título, ex. 'R$/MWh' */
  unidade?: string;
  ticksX?: number;
  ticksY?: number;
  className?: string;
}
export declare function TimeSeriesChart(props: TimeSeriesChartProps): JSX.Element;
