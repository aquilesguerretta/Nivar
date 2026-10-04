/**
 * Item de lista de publicação — nota técnica, carta, relatório, parecer: o formato de conteúdo
 * que Intelligence e Advisory publicam.
 *
 * **Não é card isolado.** Não tem borda própria: o fio de 1px é compartilhado com o vizinho na
 * lista, como o resto da grade do sistema. Um retângulo por publicação transformaria uma lista
 * de doze itens em doze caixas — densidade sem estrutura.
 *
 * A família de origem aparece como etiqueta em versalete com o círculo pleno de 7px da família.
 * O nome da família não é cor de texto: advisory e intelligence não alcançam contraste de texto
 * sobre papel, então o ponto carrega a cor e o texto fica em `--text-muted`.
 *
 * `PublicationList` é o `<ol>` que hospeda os itens e emite o fio superior da lista.
 */
export interface PublicationCardProps {
  familia?: 'intelligence' | 'advisory' | 'software' | 'academy' | 'hardware';
  /** formato: 'Nota técnica', 'Carta', 'Relatório', 'Parecer' */
  tipo?: string;
  titulo: string;
  /** resumo de UMA linha — duas linhas viram descrição e a lista perde a varredura */
  resumo?: string;
  /** data ISO */
  data?: string;
  /** tempo de leitura: '6 min' */
  leitura?: string;
  href?: string;
  className?: string;
}
export declare function PublicationCard(props: PublicationCardProps): JSX.Element;

export interface PublicationListProps {
  children?: React.ReactNode;
  className?: string;
}
export declare function PublicationList(props: PublicationListProps): JSX.Element;
