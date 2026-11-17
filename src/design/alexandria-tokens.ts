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
  cremePapel: 'var(--alx-creme, #F2E9D6)',     // L942 'paper' — campo do canvas e do rail esquerdo

  // ── COR SEMÂNTICA — nunca decorativa ──────────────────────
  oliva: '#55663F',          // L1147 'Concluído · argumento favorável · positivo' · L968 accent-olive 5.6:1
  terracota: 'var(--alx-terracota, #A8462A)',      // L1148 'Em andamento · argumento crítico · cabeçalho de seção'

  // ── TINTA ─────────────────────────────────────────────────
  tintaSobreCreme: 'var(--alx-tinta, #2A2620)', // L954 'ink' — contraste declarado 12.8:1
  tintaSobreNavy: 'var(--alx-sobre-navy, #F2E9D6)',  // L956 'on-navy' — contraste declarado 13.4:1
  tintaSuave: 'var(--alx-tinta-suave, #5C5346)',      // L955 'ink-muted' — contraste declarado 6.1:1

  // ── FIO — profundidade vem daqui, nunca de sombra ─────────
  fioSobreCreme: 'var(--alx-fio, #CFC1A4)',   // L1029 + L959 'rule (fio de tabela)'
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
  cremeSuperficie: 'var(--alx-creme-superficie, #FBF6EA)', // L943 'paper-raised' — este É declarado
  cremeAfundado: 'var(--alx-creme-afundado, #E7DAC0)',   // L944 'paper-sunken' — este É declarado
  tintaMetadado: 'var(--alx-metadado, #6B6255)',   // 204x — eyebrow Cinzel 11px e caption (papel inferido)
  tintaSobreNavySuave: '#A9B6C8', // L957 'on-navy-muted' 6.9:1 — declarado
  tintaMetadadoNavy: '#8CA0B8',   // 116x — eyebrow/metadado sobre navy (inferido)
  ouroSobreNavy: '#CBAA6E',   // L958 'on-navy-gold' 7.6:1 — declarado
  olivaSobreNavy: '#8E9E6B',  //  47x — oliva legível em campo navy (inferido)
  terracotaClara: '#C2683C',  // L967 'accent-bright (faixa/hover)' — declarado
  fioClaroSobreCreme: 'var(--alx-fio-claro, #E4D8BE)',  // 74x — linha de lista / célula de grade densa
  fioColunaSobreCreme: 'var(--alx-fio-coluna, #DCCEB2)', // 39x — divisória de coluna
  fioCampoSobreNavy: '#35506E',   // 27x — borda de campo de formulário em navy
} as const;

export const AF = {
  // Cinzel: display, H1, H2, nav, rótulo. SEMPRE caixa alta ou versalete.
  // "* Fallback" = serifada do sistema com métrica ajustada (bar A5; faces
  // declaradas em AFONT_FALLBACK_CSS e injetadas pelo shell).
  // var(): dentro da casca v3 (.alx3) a fonte muda; fora dela (Atlas,
  // telas antigas) o valor original segue valendo como padrão.
  display: "var(--alx-f-display, 'Cinzel', 'Cinzel Fallback', serif)",
  // Lora: H3, corpo, apostila, dado tabular.
  corpo: "var(--alx-f-corpo, 'Lora', 'Lora Fallback', serif)",
} as const;

// Famílias carregadas pelo shell. O handoff carrega TRÊS (L13) — a
// terceira é Playfair Display, com 36 declarações. Playfair é o
// defeito conhecido que o brief manda corrigir, então NÃO entra aqui.
export const AFONT_HREF =
  'https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700&family=Lora:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600&display=swap';

/** Fallback com métrica ajustada (bar A5: carregamento sem salto). Georgia
 *  (regular até 549; Bold a partir de 550, que é o que o sistema usa para
 *  600/700) redimensionada para a largura média de Lora/Cinzel, com ascendente
 *  e descendente das faces finais. Medido no Chrome em 2026-09-17 por
 *  docs/alexandria-v2/media-lab/A-r04/integracao/medir_fontes.mjs:
 *    Lora 400/500 × Georgia = 105,4/106,3% · Lora 600 × Georgia Bold = 91,8%
 *    Cinzel 500 × Georgia = 101,6% · Cinzel 600 × Georgia Bold = 92,9%
 *    ascendente/descendente: Lora 1,01/0,27 · Cinzel 0,98/0,37 (em). */
export const AFONT_FALLBACK_CSS = `
@font-face { font-family: 'Lora Fallback'; font-style: normal; font-weight: 100 549; src: local('Georgia'); size-adjust: 105.8%; ascent-override: 95.5%; descent-override: 25.5%; line-gap-override: 0%; }
@font-face { font-family: 'Lora Fallback'; font-style: italic; font-weight: 100 549; src: local('Georgia Italic'), local('Georgia'); size-adjust: 103%; ascent-override: 98%; descent-override: 26.2%; line-gap-override: 0%; }
@font-face { font-family: 'Lora Fallback'; font-style: normal; font-weight: 550 900; src: local('Georgia Bold'), local('Georgia'); size-adjust: 91.8%; ascent-override: 110%; descent-override: 29.4%; line-gap-override: 0%; }
@font-face { font-family: 'Cinzel Fallback'; font-style: normal; font-weight: 100 549; src: local('Georgia'); size-adjust: 101.6%; ascent-override: 96.5%; descent-override: 36.4%; line-gap-override: 0%; }
@font-face { font-family: 'Cinzel Fallback'; font-style: normal; font-weight: 550 900; src: local('Georgia Bold'), local('Georgia'); size-adjust: 92.9%; ascent-override: 105.5%; descent-override: 39.8%; line-gap-override: 0%; }
`;

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
  // As variáveis --alx-* só existem dentro de .alx3 (casca v3): lá o título é
  // caixa alta e baixa com tracking negativo e o rótulo vai para a mono. Fora
  // dela, valem os valores originais (Atlas e telas antigas não mudam).
  display: { fontFamily: AF.display, fontSize: '46px', letterSpacing: 'var(--alx-ls-display, 0.10em)', textTransform: 'var(--alx-tt-titulo, uppercase)' as 'uppercase' },
  h1:      { fontFamily: AF.display, fontSize: '32px', letterSpacing: 'var(--alx-ls-h1, 0.12em)', textTransform: 'var(--alx-tt-titulo, uppercase)' as 'uppercase' },
  h2:      { fontFamily: AF.display, fontSize: '22px', letterSpacing: 'var(--alx-ls-h2, 0.14em)', textTransform: 'var(--alx-tt-titulo, uppercase)' as 'uppercase' },
  nav:     { fontFamily: "var(--alx-f-rotulo, 'Cinzel', 'Cinzel Fallback', serif)", fontSize: '13px', letterSpacing: 'var(--alx-ls-nav, 0.18em)', textTransform: 'uppercase' as const },
  rotulo:  { fontFamily: "var(--alx-f-rotulo, 'Cinzel', 'Cinzel Fallback', serif)", fontSize: '11px', letterSpacing: 'var(--alx-ls-rotulo, 0.18em)', textTransform: 'uppercase' as const },
  h3:      { fontFamily: AF.corpo, fontSize: '15px', fontWeight: '600', letterSpacing: 'var(--alx-ls-h3, 0.10em)', textTransform: 'var(--alx-tt-titulo, uppercase)' as 'uppercase' },
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

// ─────────────────────────────────────────────────────────────
// ALEXANDRIA v2 — Peça A (entrada + shell). SÓ ADITIVO.
//
// Nenhum valor da paleta-base muda aqui. Estes tokens nomeiam medidas
// e vozes que a v2 usa em mais de um arquivo (shell, busca, home), para
// que header, rodapé e barra móvel não divirjam em silêncio.
// ─────────────────────────────────────────────────────────────

/** Pontos de quebra do shell v2. `movel` < 768 ≤ `medio` < 1100 ≤ `largo`. */
export const ABP = {
  medio: 768,
  /** Abaixo disto a nav global mora na barra inferior (não cabe no header). */
  navTopo: 960,
  largo: 1100,
} as const;

/** Medidas do shell v2. Sem rail em nenhuma largura (bar S5). */
export const ALAYOUT2 = {
  headerAltura: '64px',
  headerAlturaMovel: '56px',
  localizadorAltura: '36px',
  barraMovelAltura: '60px',
  /** Medida da prancha de leitura (páginas B, C, D) — a mesma de antes. */
  medidaPrancha: '1120px',
  /** Medida da entrada: composição de duas colunas com a carta. */
  medidaAmpla: '1312px',
  gutterLargo: '32px',
  gutterMovel: '16px',
} as const;

/** Vozes da v2 (bar S2). Identidade = Cinzel caixa alta espaçada;
 *  conteúdo = Lora caixa alta e baixa; aparato = algarismo tabular. */
export const AT2 = {
  /** Tese da entrada — título de conteúdo, nunca caixa alta total. */
  tese: { fontFamily: AF.corpo, fontSize: '50px', fontWeight: '500', lineHeight: '1.08', letterSpacing: '-0.01em' },
  teseMovel: { fontFamily: AF.corpo, fontSize: '31px', fontWeight: '500', lineHeight: '1.14', letterSpacing: '-0.005em' },
  lede: { fontFamily: AF.corpo, fontSize: '17px', fontWeight: '400', lineHeight: '1.6' },
  /** Título de objeto de estudo (aula, trilha) em bloco de entrada. */
  tituloObjeto: { fontFamily: AF.corpo, fontSize: '24px', fontWeight: '500', lineHeight: '1.25' },
  /** Rótulo de identidade/nav — caixa alta espaçada, nunca < 11px. */
  marca: { fontFamily: AF.display, fontSize: '19px', fontWeight: '500', letterSpacing: '0.22em', textTransform: 'uppercase' as const },
  navV2: { fontFamily: AF.display, fontSize: '12px', fontWeight: '600', letterSpacing: '0.16em', textTransform: 'uppercase' as const },
  eyebrow: { fontFamily: "var(--alx-f-rotulo, 'Cinzel', 'Cinzel Fallback', serif)", fontSize: '11px', fontWeight: '600', letterSpacing: 'var(--alx-ls-rotulo, 0.2em)', textTransform: 'uppercase' as const },
  /** Aparato: código de aula, contagem com escopo. */
  codigo: { fontFamily: AF.corpo, fontSize: '13px', fontWeight: '600', letterSpacing: '0.06em', fontVariantNumeric: 'tabular-nums lining-nums' as const },
  /** Linha de metadado em prosa. Sem `tabular-nums`: no Lora ele alarga o
   *  espaço entre palavras no peso 600 (medido no render). */
  metadado: { fontFamily: AF.corpo, fontSize: '14px', fontWeight: '400', lineHeight: '1.5' },
} as const;
