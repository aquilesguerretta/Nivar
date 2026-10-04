/**
 * Divisor com rótulo — fio de 1px interrompido por uma palavra curta: `ou`, `e`, ou o nome de
 * uma seção menor. Etiqueta em versalete de 11px, sem caixa ao redor do texto.
 *
 * **O fio é interrompido, não coberto.** São dois fios com o rótulo entre eles, num grid de
 * três faixas — não um fio contínuo escondido atrás de um retângulo pintado com a cor do
 * substrato. O truque de fundo quebra em cima de zebra de tabela, dentro de card com superfície
 * própria e na folha de exportação; dois fios funcionam em qualquer substrato.
 *
 * Não substitui `SectionHeader`. Aquele numera e abre uma seção do documento; este separa duas
 * alternativas dentro de um mesmo bloco — o `ou` entre entrar e cadastrar, o `e` entre duas
 * condições de filtro.
 */
export interface LabeledDividerProps {
  /** a palavra do divisor; alternativamente passe como children */
  rotulo?: string;
  children?: React.ReactNode;
  /** `centro` parte o fio ao meio; `inicio` deixa o rótulo à esquerda com um fio longo à direita */
  alinhamento?: 'centro' | 'inicio';
  /** fio em `--rule-strong` em vez de `--rule` */
  forte?: boolean;
  className?: string;
}
export declare function LabeledDivider(props: LabeledDividerProps): JSX.Element;
