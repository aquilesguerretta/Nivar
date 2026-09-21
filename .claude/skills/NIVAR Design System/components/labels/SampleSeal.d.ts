/**
 * Selo de rascunho ou amostra — o reforço visual da procedência que o sistema já exige em copy
 * (`amostra ilustrativa`). Envolve a região e marca o canto.
 *
 * **Não é carimbo.** Sem vermelho de "cancelado", sem rotação de 45° por cima do conteúdo, sem
 * opacidade reduzida no conteúdo inteiro: o dado de demonstração continua legível, porque a
 * questão é declarar a origem, não desqualificar a leitura.
 *
 * `canto` (padrão) é uma aba de versalete no canto, com fio de 1px nos dois lados internos e
 * preenchimento do substrato — o mesmo desenho de qualquer região delimitada do sistema.
 *
 * `diagonal` acrescenta uma trama de fios de 1px a 45° com passo de 12px sobre a região. É o
 * único uso de padrão diagonal declarado no sistema, e é fio, não gradiente decorativo: as
 * linhas usam `--rule` e o conteúdo passa por cima sem perder contraste.
 */
export interface SampleSealProps {
  /** texto do selo, em versalete: 'amostra ilustrativa', 'rascunho', 'não publicado' */
  rotulo?: string;
  variant?: 'canto' | 'diagonal';
  posicao?: 'topo-direita' | 'topo-esquerda' | 'base-direita';
  /** a região marcada — tabela, card, gráfico, folha de exportação */
  children?: React.ReactNode;
  className?: string;
}
export declare function SampleSeal(props: SampleSealProps): JSX.Element;
