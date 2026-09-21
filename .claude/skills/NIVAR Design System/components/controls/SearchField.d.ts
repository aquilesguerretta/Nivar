/**
 * Campo de busca. Sem container: texto com cursor e fio inferior de 1px que engrossa para 2px
 * em foco. Nunca caixa arredondada, nunca ícone de lupa colado ao campo.
 *
 * **Desvio declarado de foco.** O sistema define foco como anel advisory de 2px com offset 2px.
 * Um campo sem caixa não tem o que anelar, então o fio inferior engrossa e assume `--accent-focus`
 * — advisory continua sendo a cor do foco e continua sendo usado só como fio sobre papel, que é
 * o que a regra permite.
 *
 * O resultado aparece como lista ancorada abaixo, com o mesmo fio compartilhado dos outros
 * componentes de lista do sistema. O trecho casado é marcado por peso 500, não por fundo
 * colorido: o sistema não anima nem troca cor de fundo.
 */
export interface SearchResultado {
  id?: string;
  titulo: string;
  /** tipo e data em mono: 'NOTA TÉCNICA · 2026-07-22' */
  meta?: string;
}
export interface SearchFieldProps {
  /** rótulo em versalete; omitido, o campo fica só com placeholder */
  rotulo?: string;
  valor?: string;
  onChange?: (valor: string) => void;
  placeholder?: string;
  resultados?: SearchResultado[];
  /** total real de resultados quando a lista está truncada */
  total?: number;
  /** controla a lista; por padrão abre quando há termo digitado */
  aberto?: boolean;
  /** `true` sobrepõe a lista ao conteúdo; `false` a mantém no fluxo (busca de página inteira) */
  ancorado?: boolean;
  vazio?: string;
  onEscolher?: (r: SearchResultado) => void;
  id?: string;
  className?: string;
}
export declare function SearchField(props: SearchFieldProps): JSX.Element;
