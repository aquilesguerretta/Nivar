// src/design/alexandria-tokens.ts
// Alexandria — sistema de design próprio, separado do terminal.
//
// NUNCA importar de src/design/tokens.ts, nem o contrário.
// São dois produtos com identidades deliberadamente opostas:
// o terminal é Bloomberg/Palantir; a Alexandria é atlas
// científico de 1880-1900.
//
// ─────────────────────────────────────────────────────────────
// PROCEDÊNCIA DOS VALORES
//
// Extraídos de:
//   docs/alexandria/design-handoff/Currículo GridAlpha dimensioname/
//   curr-culo-gridalpha-dimensionamento/project/Alexandria Sistema.dc.html
//   (2.215 linhas, 316.637 bytes)
//
// O handoff NÃO tem arquivo de tokens: zero custom properties CSS,
// zero :root, zero var(). Toda cor é hex literal inline. A fonte
// canônica é a folha de tokens nas linhas 936-987 mais a folha de
// Cor Semântica nas linhas 1145-1152. Tudo fora dessas duas regiões
// é uso, não declaração.
//
// Cada valor abaixo tem citação de linha. Nenhum foi estimado.
// ─────────────────────────────────────────────────────────────

export const A = {
  // ── CAMPOS ────────────────────────────────────────────────
  navy: '#0D2340',           // L945 'navy (nav/sidebar)' · L1149 'Campo estrutural · autoridade'
  cremePapel: '#F2E9D6',     // L942 'paper' — campo do canvas e do rail esquerdo

  // ── COR SEMÂNTICA — nunca decorativa ──────────────────────
  oliva: '#55663F',          // L1147 'Concluído · argumento favorável · positivo' · L968 accent-olive 5.6:1
  terracota: '#A8462A',      // L1148 'Em andamento · argumento crítico · cabeçalho de seção'

  // ── TINTA ─────────────────────────────────────────────────
  tintaSobreCreme: '#2A2620', // L954 'ink' — contraste declarado 12.8:1
  tintaSobreNavy: '#F2E9D6',  // L956 'on-navy' — contraste declarado 13.4:1
  tintaSuave: '#5C5346',      // L955 'ink-muted' — contraste declarado 6.1:1

  // ── FIO — profundidade vem daqui, nunca de sombra ─────────
  fioSobreCreme: '#CFC1A4',   // L1029 + L959 'rule (fio de tabela)'
  fioSobreNavy: '#22405F',    // L1029 + L947 'navy-line'
} as const;

// ─────────────────────────────────────────────────────────────
// SEGUNDO NÍVEL — valores que o handoff USA muito mas NÃO nomeia.
//
// Não entram em `A` porque `A` é contrato fechado com nomes travados
// pelo brief. Ficam aqui porque sem eles o shell perde hierarquia que
// as maquetes realmente desenham — o handoff opera com três níveis de
// fio no creme, não um.
//
// Todos verificados por contagem exata de ocorrências. Nenhum tem
// rótulo de token no arquivo: o papel é leitura de uso, não declaração.
// ─────────────────────────────────────────────────────────────
export const A2 = {
  navyProfundo: '#071628',    // L946 'navy-deep (rodapé)' — este É declarado
  navyAfundado: '#0A1D36',    //  19x — card dentro do campo navy (L257)
  cremeSuperficie: '#FBF6EA', // L943 'paper-raised' — este É declarado
  cremeAfundado: '#E7DAC0',   // L944 'paper-sunken' — este É declarado
  tintaMetadado: '#6B6255',   // 204x — eyebrow Cinzel 11px e caption (papel inferido)
  tintaSobreNavySuave: '#A9B6C8', // L957 'on-navy-muted' 6.9:1 — declarado
  tintaMetadadoNavy: '#8CA0B8',   // 116x — eyebrow/metadado sobre navy (inferido)
  ouroSobreNavy: '#CBAA6E',   // L958 'on-navy-gold' 7.6:1 — declarado
  olivaSobreNavy: '#8E9E6B',  //  47x — oliva legível em campo navy (inferido)
  terracotaClara: '#C2683C',  // L967 'accent-bright (faixa/hover)' — declarado
  fioClaroSobreCreme: '#E4D8BE',  // 74x — linha de lista / célula de grade densa
  fioColunaSobreCreme: '#DCCEB2', // 39x — divisória de coluna
  fioCampoSobreNavy: '#35506E',   // 27x — borda de campo de formulário em navy
} as const;

export const AF = {
  // Cinzel: display, H1, H2, nav, rótulo. SEMPRE caixa alta ou versalete.
  display: "'Cinzel', serif",
  // Lora: H3, corpo, apostila, dado tabular.
  corpo: "'Lora', serif",
} as const;

// Famílias carregadas pelo shell. O handoff carrega TRÊS (L13) — a
// terceira é Playfair Display, com 36 declarações. Playfair é o
// defeito conhecido que o brief manda corrigir, então NÃO entra aqui.
export const AFONT_HREF =
  'https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600&family=Lora:ital,wght@0,400;0,500;0,600;1,400&display=swap';

/** Tracking inversamente proporcional ao corpo:
 *  quanto menor a fonte, maior o espaçamento entre letras.
 *
 *  DIVERGÊNCIA REGISTRADA — os valores abaixo são os do brief, mantidos
 *  como escritos. A escala canônica do handoff (L993-1002) diverge em
 *  cinco dos oito papéis:
 *
 *    papel    brief          handoff (L993-1002)
 *    h1       32px           33px
 *    h2       22px           24px
 *    rotulo   .18em          .20em
 *    h3       15px           18px
 *    dado     14px           13px
 *
 *  display / nav / corpo batem exatamente. Não troquei por conta
 *  própria: o brief escreve números explícitos e diz 'nomes travados',
 *  mas também diz 'valores do handoff'. Decisão de Aquiles — trocar é
 *  uma linha por papel. */
export const AT = {
  display: { fontFamily: AF.display, fontSize: '46px', letterSpacing: '0.10em', textTransform: 'uppercase' as const },
  h1:      { fontFamily: AF.display, fontSize: '32px', letterSpacing: '0.12em', textTransform: 'uppercase' as const },
  h2:      { fontFamily: AF.display, fontSize: '22px', letterSpacing: '0.14em', textTransform: 'uppercase' as const },
  nav:     { fontFamily: AF.display, fontSize: '13px', letterSpacing: '0.18em', textTransform: 'uppercase' as const },
  rotulo:  { fontFamily: AF.display, fontSize: '11px', letterSpacing: '0.18em', textTransform: 'uppercase' as const },
  h3:      { fontFamily: AF.corpo, fontSize: '15px', fontWeight: '600', letterSpacing: '0.10em', textTransform: 'uppercase' as const },
  corpo:   { fontFamily: AF.corpo, fontSize: '16px', fontWeight: '400', lineHeight: '1.65', maxWidth: '68ch' },
  dado:    { fontFamily: AF.corpo, fontSize: '14px', fontWeight: '400', fontVariantNumeric: 'tabular-nums' as const },
} as const;

/** Densidade alvo: 40-60 elementos de informação por tela.
 *  Espaçamento vertical entre blocos: máximo 32px.
 *  Whitespace generoso de landing page é o modo de falha
 *  mais comum deste sistema. */
export const AS = {
  xs: '4px', sm: '8px', md: '12px', lg: '16px', xl: '24px', xxl: '32px',
} as const;

/** Raio zero em tudo. Única exceção: círculo pleno
 *  (anel de progresso, avatar, nó numerado).
 *
 *  O handoff viola a própria regra 85 vezes (border-radius:3px em
 *  botões e campos, 8px em toggles de camada). Aqui não. */
export const AR = { none: '0', circulo: '50%' } as const;

/** Um atlas de 1890 não quica. Sem bounce, sem overshoot.
 *  Confere com o único bloco de CSS real do handoff (L22-27). */
export const AE = {
  easing: 'cubic-bezier(0.65, 0, 0.35, 1)',
  estado: '150ms',
  hover: '200ms',
  desenhoCurto: '700ms',
  desenhoLongo: '1200ms',
} as const;

/** Larguras fixas do shell. */
export const ALAYOUT = {
  railRight: '300px',   // L1072 'Rail direito — sempre em campo navy, 300px fixos'
  railLeft: '232px',    // L1076 'rail esquerdo 232px creme, opcional'

  // TODO: confirmar com Aquiles — o handoff NÃO elege uma altura.
  // Três valores literais concorrentes: 70px (L281, L497, L748, L1647),
  // 74px (L54), 78px (L1165, L1481). 70px é o único com repetição real
  // (4 de 7 headers) e é o valor das telas de produto interno, então é
  // o que está aqui. Registro como decisão, não como extração.
  headerHeight: '70px',

  // TODO: confirmar com Aquiles — footerHeight NÃO EXISTE no handoff.
  // Busca exaustiva: nenhum height / min-height / max-height em nenhum
  // dos rodapés. Os dois rodapés reais são dimensionados por conteúdo
  // (L1312 padding 34px 36px · L1835 padding 26px), ambos com
  // border-top 1px #22405F. AlexandriaFooter segue esse padrão — altura
  // por padding, não fixa. String vazia é deliberada: preencher com
  // número seria inventar.
  footerHeight: '',

  // Padding do rodapé. Reduzido de 26/26 — o rodapé virou peça de fluxo
  // (Wave 16), não mais faixa permanente, mas ainda pesava demais por
  // linha de conteúdo. Vertical cortado mais fundo que horizontal porque
  // é o eixo que definia a altura da banda.
  footerPaddingY: '16px',
  footerPaddingX: '20px',
} as const;

/** Textura de papel — fibra irregular, nunca grade de pontos.
 *
 *  Cópia byte-a-byte do feTurbulence de paper-fiber.svg do handoff
 *  (fractalNoise, baseFrequency 0.82, 4 oitavas, stitchTiles) embutida
 *  como data URI porque public/alexandria/** é somente-leitura nesta wave.
 *
 *  Uso literal no handoff (L1098): opacity .04, background-size 240px.
 *  O ruído fractal não tem período visível no tile de 240px — é o
 *  oposto de padrão de pontos. */
const FIBRA_SVG =
  '<svg xmlns="http://www.w3.org/2000/svg" width="240" height="240" viewBox="0 0 240 240">' +
  '<filter id="n" x="0" y="0" width="100%" height="100%">' +
  '<feTurbulence type="fractalNoise" baseFrequency="0.82" numOctaves="4" stitchTiles="stitch"/>' +
  '</filter><rect width="240" height="240" filter="url(#n)"/></svg>';

export const ATEXTURA = {
  fibraUrl: `url("data:image/svg+xml;utf8,${encodeURIComponent(FIBRA_SVG)}")`,
  fibraOpacidade: 0.04,   // L1098 — teto de 4%, não ultrapassar
  fibraTile: '240px 240px',
} as const;
