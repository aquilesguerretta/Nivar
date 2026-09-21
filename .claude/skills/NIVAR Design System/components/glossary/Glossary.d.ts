/**
 * Lista de glossário: termo em Zilla Slab, definição em Work Sans, ordem alfabética pt-BR.
 * O conjunto padrão cobre os termos que o sistema declara como não traduzíveis —
 * apuração, carga, contraditório, mercado livre, migração, MWh, PLD, submercado.
 */
export interface Verbete { termo: string; definicao: string; sigla?: string; fonte?: string }
export interface GlossaryProps {
  /** substitui o conjunto padrão de termos.js */
  termos?: Verbete[];
  /** definição abaixo do termo em vez de ao lado — para coluna estreita */
  compacto?: boolean;
  className?: string;
}
export declare function Glossary(props: GlossaryProps): JSX.Element;
