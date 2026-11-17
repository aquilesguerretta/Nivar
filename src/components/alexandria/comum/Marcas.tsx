// Marcas.tsx — o jogo de marcas do chrome da Alexandria (peça A · r07).
//
// Fonte: docs/alexandria-v2/media-lab/marcas-do-chrome/final/marcas.json
// e marcas.svg (um caminho por marca; nenhuma segunda versão aqui).
// A especificação de traço é docs/alexandria-v2/media-lab/marcas-do-chrome/
// medida/vocabulario.md §3.
//
// REGRA DE ESCALA — o fio NÃO escala por transform. Cada marca recebe o
// tamanho em px e converte a espessura pela tabela medida:
//
//   escala | principal | secundário | travessias máx.
//     12   |    1,0    |    1,0     |  4
//     16   |    1,1    |    0,8     |  5
//     20   |    1,2    |    0,9     |  6
//     24   |    1,4    |    1,0     |  7
//     28   |    1,5    |    1,05    |  8
//     32   |    1,6    |    1,1     |  9
//
//   strokeWidth(unidades de usuário) = fio_px × lado_do_viewBox ÷ lado_px
//
// Piso de tinta para o ≥3:1 de glifo do S7 (medido na chapa):
//   tinta 0,51 px · navy 0,49 px · ouro sobre navy 0,54 px.
// Terracota satura em 4,87:1 e NÃO é cor de fio.

import { A, A2, AF, AT2 } from '@/design/alexandria-tokens';

// ── Tabela de fio ────────────────────────────────────────────

const ESCALAS = [12, 16, 20, 24, 28, 32] as const;
const PRINCIPAL = [1.0, 1.1, 1.2, 1.4, 1.5, 1.6] as const;
const SECUNDARIO = [1.0, 0.8, 0.9, 1.0, 1.05, 1.1] as const;

/** Fio em px para um calibre qualquer, interpolado dentro da tabela e
 *  travado nos extremos (nada abaixo de 12 px, nada acima de 32 px). */
export function fioDaEscala(tamanhoPx: number, papel: 'principal' | 'secundario' = 'principal'): number {
  const tabela = papel === 'principal' ? PRINCIPAL : SECUNDARIO;
  const ultimo = ESCALAS.length - 1;
  if (tamanhoPx <= ESCALAS[0]) return tabela[0];
  if (tamanhoPx >= ESCALAS[ultimo]) return tabela[ultimo];
  for (let i = 1; i <= ultimo; i++) {
    if (tamanhoPx <= ESCALAS[i]) {
      const t = (tamanhoPx - ESCALAS[i - 1]) / (ESCALAS[i] - ESCALAS[i - 1]);
      return Number((tabela[i - 1] + t * (tabela[i] - tabela[i - 1])).toFixed(3));
    }
  }
  return tabela[ultimo];
}

/** Conversão da medida: px de tela → unidades de usuário do viewBox. */
const emUsuario = (fioPx: number, ladoViewBox: number, ladoPx: number) =>
  Number(((fioPx * ladoViewBox) / ladoPx).toFixed(3));

export type TomMarca = 'tinta' | 'navy' | 'ouro' | 'corrente';

const COR: Record<Exclude<TomMarca, 'corrente'>, string> = {
  tinta: A.tintaSobreCreme,
  navy: A.navy,
  ouro: A2.ouroSobreNavy,
};

const cor = (t: TomMarca) => (t === 'corrente' ? 'currentColor' : COR[t]);

// ── 1 · POSIÇÃO ──────────────────────────────────────────────
// Flâmula de ponta entalhada em V sobre mastro. Enxerto da banderole
// "VOCÊ ESTÁ AQUI" (letreiroCarta.ts::desenharSelo) em escala de chrome.
// Substitui o sublinhado navy de 2 px da nav ativa (T28), a barra sobre
// o glifo da barra móvel (T29) e a faixa de acento do item selecionado
// da busca (T11).
//
// Calibre: a marca mede 1,3–1,6× a altura de maiúscula da palavra ao
// lado (vocabulario §3.3). A caixa de tinta ocupa 18/24 do lado.

export function MarcaPosicao({
  tamanho = 16,
  tom = 'navy',
  titulo,
}: {
  tamanho?: number;
  tom?: TomMarca;
  /** Quando presente, a marca deixa de ser decorativa e vira rótulo. */
  titulo?: string;
}) {
  const fio = emUsuario(fioDaEscala(tamanho), 24, tamanho);
  const c = cor(tom);
  return (
    <svg
      width={tamanho}
      height={tamanho}
      viewBox="0 0 24 24"
      role={titulo ? 'img' : undefined}
      aria-label={titulo}
      aria-hidden={titulo ? undefined : true}
      focusable="false"
      style={{ display: 'block', flex: 'none' }}
    >
      {titulo ? <title>{titulo}</title> : null}
      <path d="M5 4 L21 4 L16 9 L21 14 L5 14 Z" fill={c} />
      <line x1="5" y1="3" x2="5" y2="21" stroke={c} strokeWidth={fio} />
    </svg>
  );
}

// ── 2 · REGISTRO ─────────────────────────────────────────────
// Cartela de carta com as duas pontas entalhadas: fio externo, fio duplo
// da dobra e têmpera interna. O papel é o campo — sem preenchimento e
// SEM SOMBRA. Substitui o disco Ø30 navy com a inicial (T3) e o botão
// retangular com fio de ENTRAR (T14).
//
// A têmpera (0,45 × fio) mede 2,73:1 e está declarada como têmpera, igual
// ao fio pálido da banderole: não é borda de controle.

/** Iniciais do caderno: uma ou duas letras, como se inscreve um ex-líbris. */
export function iniciaisDe(nome: string): string {
  const partes = nome.trim().split(/\s+/).filter(Boolean);
  if (partes.length === 0) return '';
  if (partes.length === 1) return partes[0][0].toLocaleUpperCase('pt-BR');
  return (partes[0][0] + partes[partes.length - 1][0]).toLocaleUpperCase('pt-BR');
}

const CARTELA = {
  uma: { w: 34, dobraDir: 25, temperaDir: 22, texto: 17 },
  duas: { w: 50, dobraDir: 41, temperaDir: 38, texto: 25 },
} as const;

export function SeloRegistro({
  altura = 32,
  iniciais,
  tom = 'navy',
  titulo,
}: {
  /** Altura em px. 32 a 1440, 34 a 390 (alvo ≥44×44 com a folga). */
  altura?: number;
  /** Uma ou duas letras. Vazio = cartela sem inscrição (sem sessão). */
  iniciais?: string;
  tom?: TomMarca;
  titulo?: string;
}) {
  const letras = (iniciais ?? '').slice(0, 2).toLocaleUpperCase('pt-BR');
  const g = letras.length > 1 ? CARTELA.duas : CARTELA.uma;
  const fio = emUsuario(fioDaEscala(altura), 26, altura);
  const largura = Number(((altura * g.w) / 26).toFixed(2));
  const c = cor(tom);
  return (
    <svg
      width={largura}
      height={altura}
      viewBox={`0 0 ${g.w} 26`}
      role={titulo ? 'img' : undefined}
      aria-label={titulo}
      aria-hidden={titulo ? undefined : true}
      focusable="false"
      style={{ display: 'block', flex: 'none' }}
    >
      {titulo ? <title>{titulo}</title> : null}
      <path
        d={`M2 2 L${g.w - 2} 2 L${g.w - 6} 13 L${g.w - 2} 24 L2 24 L6 13 Z`}
        fill="none"
        stroke={c}
        strokeWidth={fio}
        strokeLinejoin="miter"
      />
      <line x1="9" y1="2" x2="9" y2="24" stroke={c} strokeWidth={fio * 0.8} />
      <line x1={g.dobraDir} y1="2" x2={g.dobraDir} y2="24" stroke={c} strokeWidth={fio * 0.8} />
      <line x1="12" y1="5" x2={g.temperaDir} y2="5" stroke={c} strokeWidth={fio * 0.45} />
      <line x1="12" y1="21" x2={g.temperaDir} y2="21" stroke={c} strokeWidth={fio * 0.45} />
      {letras ? (
        <text
          x={g.texto}
          y={17.4}
          textAnchor="middle"
          fill={c}
          style={{ fontFamily: AF.display, fontWeight: 600, fontSize: '13.19px', letterSpacing: '1.1px' }}
        >
          {letras}
        </text>
      ) : null}
    </svg>
  );
}

// ── 3 · DESTINOS — RETIRADO NA r08 ───────────────────────────
// Aqui viviam cinco marcas de destino para a barra inferior a 390: marco
// de triangulação (Trilhas), coroa graduada (Atlas), asterisco de remissão
// (Glossário), duplo óbelo (Biblioteca) e pé-de-mosca (Mais). Elas caíram
// inteiras, e não uma a uma.
//
// Dois dos três juízes preferiram a r06 a 390, e a causa nomeada foi que os
// sinais tipográficos "são afirmação de identidade que não funciona como
// orientação" na navegação mais usada da tela. Medido contra o resto da
// casa, o problema era maior que dois glifos: a nav do cabeçalho a 1440 já
// era palavra pura, então os MESMOS quatro destinos tinham duas gramáticas
// a um viewport de distância. Tirar só ‡ e ¶ teria sido corrigir por
// superfície — o erro de método da r07. A barra virou palavra em versalete
// com a flâmula de posição sobre o item corrente (`MarcaPosicao`), que é a
// segunda direção que a varredura já dava para o T5, e a classe some do
// vocabulário em vez de ficar meia viva.

export type DestinoId = 'trilhas' | 'atlas' | 'glossario' | 'biblioteca' | 'mais';

// ── 4 · SEPARADOR ────────────────────────────────────────────
// Losango vazado. Cheio seria posição — e a posição aqui é a flâmula,
// então o vazado não colide com nada. Substitui o chevron "›" (T6).

export function SeparadorRota({ tamanho = 12, tom = 'tinta' }: { tamanho?: number; tom?: TomMarca }) {
  const fio = emUsuario(fioDaEscala(tamanho), 12, tamanho);
  return (
    <svg
      width={tamanho}
      height={tamanho}
      viewBox="0 0 12 12"
      aria-hidden="true"
      focusable="false"
      style={{ display: 'block', flex: 'none' }}
    >
      <path
        d="M6 1.6 L10.4 6 L6 10.4 L1.6 6 Z"
        fill="none"
        stroke={cor(tom)}
        strokeWidth={fio}
        strokeLinejoin="miter"
      />
    </svg>
  );
}

// ── 5a · LIGAÇÃO — remissão de aparato ───────────────────────
// O MESMO asterisco do destino Glossário, posto DEPOIS do termo, sem fio
// nenhum: é o oposto do sublinhado de link. Primeiro dos dois tratamentos
// de ligação do T7.

export function MarcaRemissao({ tamanho = 9, tom = 'corrente' }: { tamanho?: number; tom?: TomMarca }) {
  const fio = emUsuario(1.0, 24, tamanho);
  const c = cor(tom);
  const traco = { fill: 'none', stroke: c, strokeWidth: fio, strokeLinecap: 'butt' as const };
  return (
    <svg
      width={tamanho}
      height={tamanho}
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
      style={{
        display: 'inline-block',
        marginLeft: '2px',
        position: 'relative',
        top: `${-0.55 * tamanho}px`,
      }}
    >
      <line x1="2.5" y1="12" x2="21.5" y2="12" {...traco} />
      <line x1="7.25" y1="3.77" x2="16.75" y2="20.23" {...traco} />
      <line x1="7.25" y1="20.23" x2="16.75" y2="3.77" {...traco} />
    </svg>
  );
}

// ── 5b · LIGAÇÃO — travessia entre superfícies ───────────────
// Fio de rumo recuado 5 px da linha de base, com batente de 90° nas DUAS
// pontas. Simétrico: é um trecho medido, não uma seta. Segundo tratamento
// do T7 — e o que tira o sublinhado de 1 px do chrome inteiro.
//
// Em CSS (não SVG) porque precisa acompanhar a largura do texto e o
// `currentColor` do estado. Classe: `alx-travessia`.

const FIO_TRAVESSIA = 1.2;
const OFFSET_TRAVESSIA = 5;
const BATENTE_TRAVESSIA = 3.5;

// ── 6 · FOCO — colchetes de registro ─────────────────────────
// Oito braços de fio sobre oito braços de halo, numa caixa só. O halo de
// creme é o que faz o MESMO desenho valer sobre papel (a tinta responde,
// 12,8:1) e sobre navy (o creme responde, 13,4:1). Folga de 4 px fora do
// alvo. Substitui o retângulo de 2 px do reset (T27).

function colchetes(corFio: string, braco: number, fio: number, recuo: number) {
  const camada = `linear-gradient(${corFio} 0 0)`;
  const size: string[] = [];
  const pos: string[] = [];
  for (const x of ['left', 'right']) {
    for (const y of ['top', 'bottom']) {
      size.push(`${braco}px ${fio}px`, `${fio}px ${braco}px`);
      pos.push(`${x} ${recuo}px ${y} ${recuo}px`, `${x} ${recuo}px ${y} ${recuo}px`);
    }
  }
  return { img: new Array(8).fill(camada).join(','), size: size.join(','), pos: pos.join(',') };
}

const FOCO_FIO = colchetes(A.tintaSobreCreme, 8, 1.6, 1.3);
const FOCO_HALO = colchetes(A2.cremeSuperficie, 10.6, 4.2, 0);

/** Folha de estilo do chrome: foco, travessia e o fio latente de hover.
 *  Injetada pelo shell e pelo índice de busca (que monta fora do shell). */
export const CSS_CHROME = `
[data-alx-shell] :focus-visible { outline: none; }
/* Os colchetes ancoram no próprio alvo. O :not() é medida, não gosto: o
   link "Pular para o conteúdo" já é position:absolute, e forçá-lo a
   relative o punha em fluxo — 1440×41 px empurrando o cabeçalho para
   baixo no primeiro Tab (medido no render). */
[data-alx-shell] :focus-visible:not(.alx-pular) { position: relative; }
[data-alx-shell] :focus-visible::after {
  content: ''; position: absolute; inset: -5.3px; pointer-events: none; z-index: 4;
  background-repeat: no-repeat;
  background-image: ${FOCO_FIO.img},${FOCO_HALO.img};
  background-size: ${FOCO_FIO.size},${FOCO_HALO.size};
  background-position: ${FOCO_FIO.pos},${FOCO_HALO.pos};
}
/* ELEMENTO SUBSTITUIDO NAO TEM ::after. input, select e textarea sao
   replaced elements: a regra acima casa com eles, mas o navegador não
   renderiza pseudo-elemento nenhum dentro deles. Resultado medido na r12
   (achado 7): o campo de previsão da aula — o PRIMEIRO ato e a porta do
   loop inteiro — recebia foco de teclado sem marca nenhuma, a 1440 e a 390,
   enquanto todo o resto da casa ganhava os colchetes. A marca passa para o
   hospedeiro, que e o pai direto do controle; o :has e o unico jeito de
   um irmao substituido devolver estilo ao pai. Vale para qualquer campo da
   casa, sem o autor da tela precisar saber disso. */
[data-alx-shell] :has(> input:focus-visible),
[data-alx-shell] :has(> select:focus-visible),
[data-alx-shell] :has(> textarea:focus-visible) { position: relative; }
[data-alx-shell] :has(> input:focus-visible)::after,
[data-alx-shell] :has(> select:focus-visible)::after,
[data-alx-shell] :has(> textarea:focus-visible)::after {
  content: ''; position: absolute; inset: -5.3px; pointer-events: none; z-index: 4;
  background-repeat: no-repeat;
  background-image: ${FOCO_FIO.img},${FOCO_HALO.img};
  background-size: ${FOCO_FIO.size},${FOCO_HALO.size};
  background-position: ${FOCO_FIO.pos},${FOCO_HALO.pos};
}
.alx-travessia { position: relative; display: inline-block; text-decoration: none; }
.alx-travessia::before {
  content: ''; position: absolute; left: 0; right: 0; bottom: -${OFFSET_TRAVESSIA}px;
  height: ${BATENTE_TRAVESSIA}px; pointer-events: none;
  background-image: linear-gradient(currentColor 0 0), linear-gradient(currentColor 0 0), linear-gradient(currentColor 0 0);
  background-size: 100% ${FIO_TRAVESSIA}px, ${FIO_TRAVESSIA}px ${BATENTE_TRAVESSIA}px, ${FIO_TRAVESSIA}px ${BATENTE_TRAVESSIA}px;
  background-position: left bottom, left top, right top;
  background-repeat: no-repeat;
}
.alx-travessia-latente::before { opacity: 0; transition: opacity 150ms cubic-bezier(0.65, 0, 0.35, 1); }
.alx-travessia-latente:hover::before { opacity: 1; }
.alx-travessia-latente:focus-visible::before { opacity: 1; }
@media (prefers-reduced-motion: reduce) { .alx-travessia-latente::before { transition: none; } }
`;

// ── 7 · ENTRADA DE ÍNDICE ────────────────────────────────────
// O fio É o campo: palavra de chamada em versalete assentada sobre fio de
// tinta, sem caixa, sem fundo, sem placeholder, sem keycap (T1, T8).
// Substitui a caixa de 298×39 px com fio #CFC1A4 a 1,45:1 — reprovada no
// ≥3:1 de borda de controle do S7.

export const CHAMADA_INDICE = {
  fontFamily: AF.display,
  fontSize: '12px',
  fontWeight: 600,
  letterSpacing: '0.16em',
  textTransform: 'uppercase' as const,
  lineHeight: 1,
} as const;

export const FIO_INDICE = { repouso: 1.1, foco: 1.6, offset: 6 } as const;

/** O fio do campo, em altura exata — `border: 1.1px` arredonda no Chrome. */
export function FioDeIndice({ ativo = false, tom = A.tintaSobreCreme }: { ativo?: boolean; tom?: string }) {
  return (
    <span
      aria-hidden="true"
      style={{
        display: 'block',
        height: `${ativo ? FIO_INDICE.foco : FIO_INDICE.repouso}px`,
        background: tom,
        marginTop: `${FIO_INDICE.offset}px`,
      }}
    />
  );
}

// ── 8 · VOZ DE APARATO ───────────────────────────────────────
// A voz em que a casa imprime convenção, rótulo de seção e nome de rota.
// Sem caixa e sem fio — é tipografia.

export const APARATO = { ...AT2.eyebrow, color: A2.tintaMetadado } as const;
export const APARATO_FORTE = { ...AT2.eyebrow, color: A.tintaSobreCreme } as const;

// ── 9 · ESTAÇÕES: o vocabulário único de estado do levantamento ───
//
// T18. O que havia era a série radio button: círculo cheio / meio / vazio,
// três silhuetas para seis estados, repetida no globo, na legenda da Home,
// na faixa navy e no bloco de retomada. Aqui ela sai inteira e entra o
// vocabulário de levantamento da casa — o MESMO desenho no objeto, na
// legenda e na lista, porque a legenda de uma figura só vale se o glifo
// que ela nomeia for o glifo que a figura desenhou:
//
//   percorrido ..... losango cheio — o marco cravado
//   atual .......... FLÂMULA de posição (marca 1 deste arquivo, em escala
//                    de carta): "você está aqui"
//   partida ........ a mesma flâmula, com o campo em terracota — E0/E1.
//                    Nunca aparece junto de `atual`: ou há registro, ou há
//                    ponto de partida
//   em curso ....... losango vazado com o ponto no centro — estação aberta
//   a seguir ....... cruzeta de mira a 45° — mirada, ainda não ocupada
//   a percorrer .... cruz de referência a 0/90°, fio secundário
//
// Ângulos 0/90/45 (vocabulario §3.4). Terracota é campo, nunca fio.

export type EstadoEstacaoMarca = 'percorrido' | 'atual' | 'em-curso' | 'partida' | 'a-seguir' | 'por-percorrer';

export interface TracoEstacao {
  d: string;
  /** `cheio` = campo de tinta · `fio` = contorno · `campo` = terracota */
  papel: 'cheio' | 'fio' | 'campo';
  /** multiplicador do fio principal da escala */
  peso?: number;
}

const n2 = (v: number) => Number(v.toFixed(2));
const losangoEm = (r: number) => `M0 ${n2(-r)}L${n2(r)} 0L0 ${n2(r)}L${n2(-r)} 0Z`;
const cruzeta45 = (r: number) => `M${n2(-r)} ${n2(-r)}L${n2(r)} ${n2(r)}M${n2(-r)} ${n2(r)}L${n2(r)} ${n2(-r)}`;
const cruz90 = (r: number) => `M0 ${n2(-r)}V${n2(r)}M${n2(-r)} 0H${n2(r)}`;

/** A flâmula em escala de carta: o pé assenta NO ponto da estação (é ele
 *  que marca o lugar exato), o mastro sobe e o campo pende à direita com o
 *  mesmo entalhe em V da marca de posição do chrome. */
export function flamulaEm(d: number) {
  const h = 3.15 * d;
  const fw = 2.15 * d;
  const fh = 1.35 * d;
  const entalhe = 0.62 * d;
  return {
    mastro: `M0 ${n2(d * 0.9)}V${n2(-h)}`,
    campo: `M0 ${n2(-h)}L${n2(fw)} ${n2(-h)}L${n2(fw - entalhe)} ${n2(-h + fh / 2)}L${n2(fw)} ${n2(-h + fh)}L0 ${n2(-h + fh)}Z`,
    pe: losangoEm(d * 0.7),
    /** caixa do desenho, para viewBox e para teste de colisão */
    caixa: { x: -d, y: -h - d * 0.5, w: fw + 2 * d, h: h + d * 1.6 },
  };
}

/** Os traços de uma estação, centrados em (0,0), com raio nominal `d`.
 *  Mesma fonte para o letreiro do globo e para os glifos de legenda. */
export function tracosDeEstacao(estado: EstadoEstacaoMarca, d: number): TracoEstacao[] {
  if (estado === 'percorrido') return [{ d: losangoEm(d * 1.22), papel: 'cheio' }];
  if (estado === 'em-curso')
    return [
      { d: losangoEm(d * 1.42), papel: 'fio', peso: 1 },
      { d: losangoEm(d * 0.46), papel: 'cheio' },
    ];
  if (estado === 'a-seguir') return [{ d: cruzeta45(d * 1.02), papel: 'fio', peso: 1 }];
  if (estado === 'por-percorrer') return [{ d: cruz90(d * 1.18), papel: 'fio', peso: 0.75 }];
  const f = flamulaEm(d);
  return [
    { d: f.mastro, papel: 'fio', peso: 1 },
    { d: f.campo, papel: estado === 'partida' ? 'campo' : 'cheio' },
    { d: f.pe, papel: 'cheio' },
  ];
}

/** Nome de cada estado, em palavra (S3: silhueta E palavra, sempre). */
export const NOME_ESTACAO: Record<EstadoEstacaoMarca, string> = {
  percorrido: 'percorrido',
  'em-curso': 'em curso',
  atual: 'você está aqui',
  partida: 'ponto de partida',
  'a-seguir': 'a seguir',
  'por-percorrer': 'a percorrer',
};

const CAIXA_ESTACAO: Record<EstadoEstacaoMarca, string> = (() => {
  const f = flamulaEm(3.1);
  const bandeira = `${n2(f.caixa.x)} ${n2(f.caixa.y)} ${n2(f.caixa.w)} ${n2(f.caixa.h)}`;
  const redondo = '-7 -7 14 14';
  return {
    percorrido: redondo,
    'em-curso': redondo,
    'a-seguir': redondo,
    'por-percorrer': redondo,
    atual: bandeira,
    partida: bandeira,
  };
})();

/** O glifo de estado fora do objeto: legenda da figura, faixa navy, lista
 *  de módulos e registro de retomada. Mesmo desenho, outra escala. */
export function MarcaEstacao({
  estado,
  tamanho = 14,
  cor,
  campo,
  titulo,
}: {
  estado: EstadoEstacaoMarca;
  tamanho?: number;
  /** tinta do traço; o padrão é a tinta sobre creme */
  cor?: string;
  /** campo da flâmula de partida; o padrão é terracota */
  campo?: string;
  titulo?: string;
}) {
  const c = cor ?? A.tintaSobreCreme;
  const d = estado === 'atual' || estado === 'partida' ? 3.1 : 4.1;
  const fio = fioDaEscala(tamanho, 'principal') * (14 / tamanho);
  return (
    <svg
      width={tamanho}
      height={tamanho}
      viewBox={CAIXA_ESTACAO[estado]}
      role={titulo ? 'img' : undefined}
      aria-label={titulo}
      aria-hidden={titulo ? undefined : true}
      focusable="false"
      style={{ flex: 'none', display: 'block', overflow: 'visible' }}
    >
      {titulo ? <title>{titulo}</title> : null}
      {tracosDeEstacao(estado, d).map((t, i) => (
        <path
          key={i}
          d={t.d}
          fill={t.papel === 'fio' ? 'none' : t.papel === 'campo' ? (campo ?? A.terracota) : c}
          stroke={t.papel === 'cheio' ? 'none' : c}
          strokeWidth={t.papel === 'cheio' ? undefined : fio * (t.peso ?? 1)}
          strokeLinejoin="miter"
        />
      ))}
    </svg>
  );
}
