/**
 * Seção recolhível de uso geral — nota longa, bloco opcional, pergunta e resposta.
 *
 * O marcador é `+` / `−` em mono, à esquerda do título. **Não é um chevron girando**: rotação de
 * glifo é animação de transform que o sistema não usa em elemento de interface, e `›` girado
 * 90° em 200ms lê como enfeite. `+` e `−` dizem a mesma coisa sem mover nada.
 *
 * A revelação é a mesma técnica do resto do sistema: um fio de 1px se desenhando em 700ms
 * (`stroke-dashoffset`) e o corpo entrando em opacidade. **Altura não anima** — layout não se
 * move animado em lugar nenhum deste sistema.
 *
 * Não substitui `MethodDisclosure`, que é específico de procedência e tem ordem de linhas fixa
 * por razão de tese. Aqui o conteúdo é livre.
 */
export interface CollapsibleProps {
  titulo: string;
  /** metadado em mono à direita do título: contagem, data, recorte */
  nota?: string;
  /** controlado: informe `aberta` + `onToggle`. Omitido, guarda o próprio estado. */
  aberta?: boolean;
  onToggle?: (aberta: boolean) => void;
  /** estado inicial quando não controlado */
  padrao?: boolean;
  id?: string;
  /** fio de 1px acima do cabeçalho — desligue quando várias seções compartilham fio em lista */
  fio?: boolean;
  children?: React.ReactNode;
  className?: string;
}
export declare function Collapsible(props: CollapsibleProps): JSX.Element;
