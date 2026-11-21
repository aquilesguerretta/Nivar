/**
 * Etiqueta de procedência: carrega fonte e recorte temporal de todo dado exibido.
 * Não é rodapé legal — é a tese da empresa expressa em copy.
 */
export interface ProvenanceProps {
  /** ex. ['ONS','CCEE','ANEEL','EPE'] */
  fontes?: string[];
  /** ex. 'apuração mensal' */
  recorte?: string;
  /** ISO + fuso, ex. '2026-08-04 · 14:30 BRT' */
  timestamp?: string;
  /** marca o dado como amostra ilustrativa, em advisory */
  ilustrativa?: boolean;
  rotulo?: string;
  /** fio de 1px acima */
  fio?: boolean;
  className?: string;
}
export declare function Provenance(props: ProvenanceProps): JSX.Element;
