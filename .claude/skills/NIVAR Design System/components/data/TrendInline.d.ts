/**
 * Indicador de tendência compacto — a versão inline do que `DataCard` mostra em corpo grande.
 * Uma linha de texto: glifo de direção + número, em mono tabular. Para tabela densa, item de
 * lista e frase, onde não cabe card inteiro.
 *
 * Cor é direção de mercado, não semântica de UI: `hardware` para alta, `software` para baixa,
 * `advisory` para fora de faixa, cinza quente para sem variação. A mesma lógica do resto do
 * sistema, sem verde e sem vermelho.
 *
 * O glifo é unicode em mono (`↑ ↓ → ±`), não ícone — nenhuma biblioteca de ícone entrou no
 * sistema ainda.
 */
export interface TrendInlineProps {
  /** variação percentual; o sinal e a direção saem daqui */
  delta?: number;
  /** valor absoluto, quando o que importa é a diferença e não o percentual */
  valor?: number;
  unidade?: string;
  casas?: number;
  /** recorte da comparação em versalete: 'vs. jul', 'mês anterior' */
  base?: string;
  /** força a direção — use só para `atencao` (fora de faixa), que não sai do sinal */
  direcao?: 'alta' | 'baixa' | 'neutro' | 'atencao';
  glifo?: string;
  tamanho?: 'padrao' | 'compacto';
  className?: string;
}
export declare function TrendInline(props: TrendInlineProps): JSX.Element;
