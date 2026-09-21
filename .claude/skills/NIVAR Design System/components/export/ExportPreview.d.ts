/**
 * Prévia de exportação — como o PDF sai antes de gerar.
 *
 * **A folha é sempre papel, nos dois modos.** O painel ao redor segue o tema da tela; a folha
 * redeclara localmente os aliases claros, porque papel impresso não tem modo noturno. Ver
 * `nv-export__folha` em `components/export/export.css`.
 *
 * **Tratamento da marca.** O gradiente de incandescência não sobrevive a impressora
 * preto-e-branco de escritório: a ponta `brasa` (#7A1F0D) fecha para quase preto e a ponta
 * `intelligence` (#F5C63C) abre para cinza claro, então o traço perde uniformidade ao longo da
 * palavra — o N sai pesado e o R sai lavado. A variante de impressão troca o gradiente por
 * tinta sólida `#14120F` na mesma geometria (`assets/nivar-wordmark-mono.svg`), e a marca
 * continua sendo a marca de produção: nenhum contorno foi redesenhado.
 *
 * `par` mostra os dois tratamentos lado a lado — é assim que a decisão fica verificável.
 * `Folha` é exportada à parte para reuso em outras prévias de documento.
 */
export interface ExportPreviewProps {
  tratamento?: 'cor' | 'mono';
  onTratamento?: (t: 'cor' | 'mono') => void;
  /** mostra cor e monocromático lado a lado em vez de só o tratamento escolhido */
  par?: boolean;
  titulo?: string;
  subtitulo?: string;
  fontes?: string[];
  recorte?: string;
  timestamp?: string;
  colunas?: string[];
  /** cada linha: [rótulo, ...valores já formatados] */
  linhas?: (string | number)[][];
  paginas?: number;
  /** substitui a nota que explica a troca de tratamento */
  nota?: string;
  onGerar?: (t: 'cor' | 'mono') => void;
  className?: string;
}
export declare function ExportPreview(props: ExportPreviewProps): JSX.Element;

export interface FolhaProps extends Omit<ExportPreviewProps, 'par' | 'onTratamento' | 'onGerar' | 'nota'> {
  pagina?: number;
  rodape?: string;
}
export declare function Folha(props: FolhaProps): JSX.Element;
