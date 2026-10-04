/**
 * Barra comparativa entre submercados ou fontes de geração. Barras retas, topo reto —
 * nunca arredondado. Cor de família ou cor de direção conforme o contexto do dado.
 */
export interface BarraDado {
  label: string;
  value: number;
  /** nome de família, nome de direção (alta/baixa/atencao/neutro) ou cor CSS literal */
  cor?: string;
  legenda?: string;
}
export interface BarChartProps {
  data: BarraDado[];
  width?: number;
  height?: number;
  casas?: number;
  titulo?: string;
  unidade?: string;
  legenda?: boolean;
  className?: string;
}
export declare function BarChart(props: BarChartProps): JSX.Element;
