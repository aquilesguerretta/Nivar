// videos.ts — o vídeo de cada aula da Alexandria.
//
// ESQUELETO. Criado vazio pela sessão do modelo de aula v3 para que a aula
// possa ler o contrato antes de o vídeo existir; a sessão de vídeo é dona
// deste arquivo e o preenche. Lista vazia = nenhuma aula tem vídeo, e a aula
// não mostra bloco de vídeo nenhum (S4: nunca "vídeo em produção", nunca
// placeholder).
//
// Contrato: `videoDaAula(moduloId, aula)` devolve o vídeo daquela aula ou
// `null`. `aula` é o número da aula no módulo (1, 2, …).

export interface LegendaDoVideo {
  /** Caminho do arquivo .vtt, servido de `public/`. */
  src: string;
  /** BCP 47: 'pt-BR'. */
  idioma: string;
  rotulo: string;
}

export interface VideoDaAula {
  mp4: string;
  webm?: string;
  /** Quadro de capa, servido de `public/`. */
  poster: string;
  legendas: LegendaDoVideo[];
  duracaoSeg: number;
  titulo: string;
}

interface EntradaDeVideo extends VideoDaAula {
  moduloId: string;
  aula: number;
}

// M01: em 15/11/2026 o Founder assistiu às 9 vídeo-aulas geradas (motion
// graphic + locução ElevenLabs, voz Henrique; procedência em
// docs/alexandria-v3/video-aulas/) e aprovou colocá-las nas aulas. Se ele
// gravar uma versão própria, ela entra no lugar com o mesmo nome de arquivo.
// Aula sem vídeo fica "ainda não disponível":
// `duracaoSeg: null` → `videoDaAula` devolve null → a aula não mostra bloco de
// vídeo. Roteiro de apoio para gravar: `docs/alexandria-v3/video-aulas/m01/`.
//
// QUANDO O ARQUIVO CHEGAR, sem mudar código, só dado:
//   1. coloque em `public/alexandria/v3/aulas/m01/video/`:
//        aula-0N.mp4            (H.264 + AAC, 1920×1080)
//        aula-0N.pt-BR.vtt      (legenda)
//        aula-0N-poster.webp    (quadro de capa)
//        aula-0N.webm           (opcional; marque `webm: true`)
//   2. troque `duracaoSeg: null` pela duração em segundos daquela aula.
const M01 = '/alexandria/v3/aulas/m01/video';

interface GravacaoM01 {
  aula: number;
  titulo: string;
  /** null = ainda não disponível. */
  duracaoSeg: number | null;
  webm?: boolean;
}

const GRAVACOES_M01: GravacaoM01[] = [
  { aula: 1, titulo: 'Aula 01 · Energia é volume. Potência é velocidade.', duracaoSeg: 98, webm: true },
  { aula: 2, titulo: 'Aula 02 · Sete símbolos. Toda a linguagem.', duracaoSeg: 104, webm: true },
  { aula: 3, titulo: 'Aula 03 · A rede tem um batimento cardíaco. Ele se chama 60 Hz.', duracaoSeg: 89, webm: true },
  { aula: 4, titulo: 'Aula 04 · Por que perdas crescem ao quadrado. E por que isso desenhou toda a rede.', duracaoSeg: 95, webm: true },
  { aula: 5, titulo: 'Aula 05 · Por que uma fábrica paga por capacidade reservada.', duracaoSeg: 94, webm: true },
  { aula: 6, titulo: 'Aula 06 · A tensão de fornecimento define a tarifa que você paga.', duracaoSeg: 71, webm: true },
  { aula: 7, titulo: 'Aula 07 · Existe energia que ocupa a rede e não vira produção.', duracaoSeg: 106, webm: true },
  { aula: 8, titulo: 'Aula 08 · 100 MW solar ≠ 100 MW térmica.', duracaoSeg: 83, webm: true },
  { aula: 9, titulo: 'Aula 09 · Energia ruim pode custar mais do que energia cara.', duracaoSeg: 82, webm: true },
];

function entradaM01(g: GravacaoM01 & { duracaoSeg: number }): EntradaDeVideo {
  const n = String(g.aula).padStart(2, '0');
  return {
    moduloId: 'modulo-01',
    aula: g.aula,
    mp4: `${M01}/aula-${n}.mp4`,
    webm: g.webm ? `${M01}/aula-${n}.webm` : undefined,
    poster: `${M01}/aula-${n}-poster.webp`,
    legendas: [{ src: `${M01}/aula-${n}.pt-BR.vtt`, idioma: 'pt-BR', rotulo: 'Português' }],
    duracaoSeg: g.duracaoSeg,
    titulo: g.titulo,
  };
}

const VIDEOS: EntradaDeVideo[] = GRAVACOES_M01
  .filter((g): g is GravacaoM01 & { duracaoSeg: number } => g.duracaoSeg !== null)
  .map(entradaM01);

export function videoDaAula(moduloId: string, aula: number): VideoDaAula | null {
  const v = VIDEOS.find((x) => x.moduloId === moduloId && x.aula === aula);
  if (!v) return null;
  return { mp4: v.mp4, webm: v.webm, poster: v.poster, legendas: v.legendas, duracaoSeg: v.duracaoSeg, titulo: v.titulo };
}
