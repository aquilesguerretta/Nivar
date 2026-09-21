/**
 * Entrada de múltipla seleção. Os itens escolhidos ficam **dentro do campo**, como chip de fio
 * de 1px com raio zero — nunca pílula, nunca preenchimento sólido colorido. Cada chip carrega um
 * `×` em mono para remoção, e o espaço restante do campo continua digitável para buscar mais
 * opções: o campo não vira uma caixa de leitura depois da primeira escolha.
 *
 * O chip aqui é o mesmo desenho de `Tag`, em corpo menor e com o botão de remover. A lista de
 * sugestões usa o fio compartilhado dos outros componentes de lista do sistema, como em
 * `SearchField`.
 *
 * Para as quatro opções fixas de submercado, use `SubmarketSelector`: aquilo é eixo de recorte
 * permanente e não deve caber num campo que aceita busca.
 */
export interface MultiOpcao {
  id: string;
  rotulo: string;
  /** tipo e recorte em mono, à direita: 'SÉRIE · CCEE' */
  meta?: string;
}
export interface MultiSelectProps {
  label?: string;
  hint?: string;
  error?: string;
  /** itens já escolhidos; string simples ou `{id, rotulo}` */
  selecionados?: (string | MultiOpcao)[];
  onRemover?: (id: string) => void;
  /** o texto digitado no espaço restante */
  valor?: string;
  onChange?: (valor: string) => void;
  placeholder?: string;
  sugestoes?: (string | MultiOpcao)[];
  /** controla a lista; por padrão abre quando há termo digitado */
  aberto?: boolean;
  onEscolher?: (o: string | MultiOpcao) => void;
  obrigatorio?: boolean;
  disabled?: boolean;
  state?: 'repouso' | 'foco';
  id?: string;
  className?: string;
}
export declare function MultiSelect(props: MultiSelectProps): JSX.Element;
