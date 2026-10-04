/**
 * Link de pular para o conteúdo. Oculto por padrão; ao receber foco de teclado aparece como
 * bloco de texto com fio de 1px, ancorado no topo à esquerda.
 *
 * **Precisa ser o primeiro elemento navegável da página inteira** — antes do wordmark, antes da
 * navegação, antes do seletor de modo. Se vier depois de qualquer coisa focável, deixa de
 * cumprir a função: quem navega por teclado já teria passado por aquilo.
 *
 * Não usa `.nv-sr` (que esconde permanentemente): fica fora da viewport por posição e volta com
 * `:focus`, para continuar na ordem de tabulação. Aparece por posição, não por opacidade — é o
 * único lugar do sistema onde um elemento entra em cena mudando de posição, e é por exigência de
 * navegação por teclado, não por decoração.
 */
export interface SkipLinkProps {
  /** id do início do conteúdo, que precisa existir no documento */
  href?: string;
  children?: React.ReactNode;
  /** força o estado visível — só para especimen e documentação */
  visivel?: boolean;
  className?: string;
}
export declare function SkipLink(props: SkipLinkProps): JSX.Element;
