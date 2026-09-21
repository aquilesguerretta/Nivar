/**
 * Alternador de densidade de tabela. Mesmo padrão de toggle textual do `ModeToggle`: mono
 * versalete, sem caixa, sem ícone, ativa marcada por fio inferior em `--accent-house`.
 *
 * **Muda só o padding da célula e a altura da linha.** Fonte, cor, fio e alinhamento ficam
 * exatamente iguais nas duas densidades — o que muda é quantas linhas cabem na tela, e nada
 * mais. `compacto` é o padrão do sistema (7px de padding vertical, alvo de 40–60 elementos por
 * tela); `confortável` sobe para 12px e é para leitura longa de série.
 *
 * Escreve `data-densidade` no elemento apontado por `target`; o CSS de `.nv-tab` responde a
 * esse escopo. Sem `target`, o componente só reporta a escolha por `onChange`.
 */
export interface DensityToggleProps {
  value?: 'compacto' | 'confortavel';
  onChange?: (d: 'compacto' | 'confortavel') => void;
  /** seletor CSS ou elemento que recebe `data-densidade` */
  target?: string | HTMLElement;
  className?: string;
}
export declare function DensityToggle(props: DensityToggleProps): JSX.Element;
