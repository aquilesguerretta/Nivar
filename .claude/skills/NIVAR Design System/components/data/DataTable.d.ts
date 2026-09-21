/**
 * Tabela de dado. Bordas colapsadas, sem gap, sem raio. Célula numérica em JetBrains Mono
 * com tabular-nums, vírgula decimal e espaço fino no milhar. Hover muda cor de texto e de
 * fio — a linha reserva 2px de fio esquerdo transparente, então não há deslocamento.
 *
 */
export interface DataColumn {
  key: string;
  label: string;
  /** numero e delta forçam mono tabular + alinhamento à direita; delta ainda colore por direção */
  tipo?: 'texto' | 'numero' | 'delta';
  casas?: number;
  /** sufixo do delta, padrão ' %' */
  sufixo?: string;
}
/**
 * @startingPoint section="Dado" subtitle="Tabela densa com célula numérica tabular" viewport="700x400"
 */
export interface DataTableProps {
  columns: DataColumn[];
  rows: Array<Record<string, unknown>>;
  caption?: string;
  /** linha alternada em --zebra */
  zebra?: boolean;
  hover?: boolean;
  /** linha de total, mesma forma das colunas */
  footer?: Record<string, unknown>;
  /** índice de linha com hover forçado — só para especimen */
  linhaHover?: number;
  className?: string;
}
export declare function DataTable(props: DataTableProps): JSX.Element;
