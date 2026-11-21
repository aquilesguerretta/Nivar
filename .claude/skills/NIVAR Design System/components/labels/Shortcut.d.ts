/**
 * Marcador de atalho de teclado. Token mono pequeno dentro de retângulo de fio fino, ao lado da
 * ação correspondente. Só aparência — a função do atalho é decisão de implementação.
 *
 * Combinação de teclas vira uma sequência de `<kbd>` com `+` em mono entre eles, cada tecla no
 * próprio retângulo. Um retângulo só para `⌘K` inteiro esconde que são duas teclas.
 */
export interface ShortcutProps {
  /** uma tecla por item: ['⌘', 'K'] ou ['Ctrl', 'K'] */
  teclas?: string[];
  /** alternativa: 'Ctrl+K' — separado por `+` */
  children?: React.ReactNode;
  className?: string;
}
export declare function Shortcut(props: ShortcutProps): JSX.Element;

/**
 * Marcador de recente. `NOVO` ou `ATUALIZADO` em etiqueta versalete pequena na cor de acento,
 * ao lado do título.
 *
 * **É texto, nunca bolinha colorida nem badge com fundo preenchido.** Um ponto vermelho não diz
 * o que mudou; `ATUALIZADO` diz. E o sistema não tem cor de status: a cor aqui é a de acento da
 * casa, e a distinção entre novo e atualizado está na palavra.
 */
export interface RecentMarkerProps {
  variant?: 'novo' | 'atualizado';
  /** sobrescreve o texto: 'republicado', 'revisado' */
  rotulo?: string;
  className?: string;
}
export declare function RecentMarker(props: RecentMarkerProps): JSX.Element;
