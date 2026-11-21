/**
 * Linha de tabela expansível. Ao abrir, um painel aparece **abaixo da própria linha e empurra as
 * seguintes para baixo** — nunca sobrepõe, nunca abre em modal, nunca desloca o dado para um
 * painel lateral. A linha continua no lugar e o contexto ao redor continua legível: é isso que
 * separa detalhe de tabela de detalhe de aplicativo.
 *
 * Vive dentro do `<tbody>` de `.nv-tab` e usa o mesmo fio da tabela. O painel ocupa a largura
 * toda por padrão (`colSpan`), ou recebe indentação da primeira coluna com `indentado`.
 *
 * O marcador é `+` / `−` em mono na primeira célula, como em `Collapsible`. A revelação é o fio
 * de 1px se desenhando em 700ms; altura não anima.
 */
export interface ExpCelula {
  valor: React.ReactNode;
  /** alinha à direita em mono tabular, como toda célula de número */
  num?: boolean;
}
export interface ExpandableRowProps {
  celulas?: ExpCelula[];
  /** vão do painel; por padrão o número de células */
  colunas?: number;
  aberta?: boolean;
  onToggle?: (aberta: boolean) => void;
  padrao?: boolean;
  /** recua o painel na largura da primeira coluna em vez de ocupar a largura toda */
  indentado?: boolean;
  /** força o estado de hover da linha — só para especimen */
  hover?: boolean;
  id?: string;
  /** o conteúdo do painel */
  children?: React.ReactNode;
  className?: string;
}
export declare function ExpandableRow(props: ExpandableRowProps): JSX.Element;
