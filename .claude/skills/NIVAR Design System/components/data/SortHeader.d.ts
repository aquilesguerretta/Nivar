/**
 * Cabeçalho de coluna ordenável. Substitui o `<th>` dentro de `DataTable`, então herda o fio,
 * o versalete e o alinhamento à direita das colunas numéricas.
 *
 * O marcador é **glifo unicode em mono** — `↕` neutro, `↑` ascendente, `↓` descendente. Nenhum
 * ícone de biblioteca externa: nenhuma biblioteca entrou no sistema, e a decisão continua aberta.
 *
 * Neutro não é ausência: o `↕` fica presente em `--rule-strong`, para que a coluna se anuncie
 * ordenável sem exigir hover. Ativa muda a **cor** do rótulo e do marcador para `--text-strong`
 * — não muda o tamanho e não anima nada além de cor, como o resto do sistema.
 *
 * `aria-sort` acompanha o estado, e o clique devolve o próximo estado (`neutro → asc → desc → asc`):
 * não existe voltar a neutro por clique, porque uma tabela sem ordenação declarada não é um
 * estado que o produto queira oferecer.
 */
export interface SortHeaderProps {
  children?: React.ReactNode;
  ordem?: 'neutro' | 'asc' | 'desc';
  /** recebe (campo, próximaOrdem) */
  onSort?: (campo: string | undefined, proxima: 'asc' | 'desc') => void;
  /** alinha à direita, como toda coluna de número */
  numerico?: boolean;
  /** identificador devolvido no onSort */
  campo?: string;
  /** força visualmente hover — só para especimen */
  state?: 'repouso' | 'hover';
  className?: string;
}
export declare function SortHeader(props: SortHeaderProps): JSX.Element;
