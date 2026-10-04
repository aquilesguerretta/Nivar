/**
 * Estado vazio. Três casos com tratamento próprio, nunca ilustração e nunca emoji.
 * O vazio declara a razão; não pede desculpa.
 *
 * - sem-dado: a série existe mas não foi apurada. Recebe o motivo do eixo em fio.
 * - sem-resultado: o filtro não retornou nada. Devolve o filtro ativo, sem container.
 * - sem-permissao: o dado existe, o acesso não. O conjunto recebe fio porque tem fronteira real.
 */
export interface EmptyStateProps {
  variant?: 'sem-dado' | 'sem-resultado' | 'sem-permissao';
  /** sobrescreve o texto padrão do caso */
  titulo?: string;
  corpo?: string;
  eti?: string;
  /** linha mono de recorte temporal */
  meta?: string;
  /** só em sem-resultado: termos do filtro ativo, devolvidos ao leitor */
  filtros?: string[];
  /** só em sem-permissao: identificador do conjunto de dado */
  conjunto?: string;
  /** só em sem-permissao: quem concede o acesso */
  concessor?: string;
  /** normalmente um Button terciário */
  acoes?: React.ReactNode;
  className?: string;
}
export declare function EmptyState(props: EmptyStateProps): JSX.Element;
