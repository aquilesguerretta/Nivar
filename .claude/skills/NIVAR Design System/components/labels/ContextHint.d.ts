/**
 * Dica de contexto: revela a definição de um termo técnico não traduzido no hover, no toque
 * ou no foco de teclado. Retângulo plano com fio, sem seta de balão, sem raio e sem sombra —
 * a separação do fundo vem de fio mais forte (--rule-heavy), nunca de elevação.
 * Sem `definicao`, o texto vem de components/glossary/termos.js pelo próprio termo.
 */
export interface ContextHintProps {
  /** termo exato; casa com termos.js sem diferenciar caixa */
  termo: string;
  /** sobrescreve a definição do glossário */
  definicao?: string;
  /** procedência exibida no rodapé do painel; passe '' para suprimir */
  fonte?: string;
  /** força o painel aberto — só para especimen */
  aberta?: boolean;
  /** texto do gatilho, se diferente do termo */
  children?: React.ReactNode;
  className?: string;
}
export declare function ContextHint(props: ContextHintProps): JSX.Element;
