// alexandria-modulo-08-fatos.ts
// LYCEUM Wave 40 — camada canônica de fatos do Módulo 08.
//
// PROBLEMA QUE ESTE ARQUIVO FECHA: os mesmos números do Bloco 8 eram
// digitados em DOIS lugares independentes — o conteúdo de aula
// (`alexandria-modulo-08-content.ts`, extraído na Wave 32) e o jogo
// "O Número Impossível" (`modulo-08-game-data.ts`, escrito pelo Codex).
// A auditoria da Wave 40 conferiu os 18 valores do jogo contra a FONTE
// HTML original, não só contra o conteúdo já extraído, e achou 17
// concordando nas três — nenhuma divergência ativa. Mas concordar hoje
// não é o mesmo que estar ligado: duas cópias digitadas à mão divergem
// no primeiro dia em que alguém corrigir uma só.
//
// Aqui o valor mora uma vez. `alexandria-modulo-08-content.ts` e
// `modulo-08-game-data.ts` importam daqui, e o teste de invariante em
// `tests/alexandria-games/modulo-08-fatos.test.ts` falha se a prosa de
// qualquer um dos dois deixar de conter o valor canônico.
//
// ── O QUE NÃO ESTÁ AQUI, E POR QUÊ ────────────────────────────
// Prosa. Os números aparecem nos dois arquivos DENTRO de frase corrida
// ("a renovabilidade da matriz elétrica ficou em 86,8%"). Deduplicar
// isso exigiria templatizar cada sentença, o que trocaria legibilidade
// por acoplamento e pioraria os dois lados. A frase continua sendo
// escrita à mão nos dois; o que este módulo garante é que o VALOR
// dentro dela é o mesmo, e o teste é quem cobra.

/** Uma linha da tabela do § 00 Tese — o artefato central do módulo.
 *  Quatro respostas corretas para "quanto o Brasil tem de capacidade
 *  instalada", todas publicadas por órgão oficial, todas diferentes. */
export interface UniversoDeCapacidade {
  /** Rótulo do valor como a fonte imprime ('261,0 GW', '~255 GW'). */
  rotulo: string;
  /** O número em GW, para comparação e aritmética. */
  gw: number;
  /** Data-base literal da fonte. */
  dataBase: string;
  /** O que este universo mede, literal da fonte. */
  universo: string;
  /** Onde está publicado, literal da fonte. */
  publicacao: string;
}

/** A tabela do § 00 Tese, verbatim.
 *
 *  NÃO estava em nenhum dos dois arquivos antes desta wave: vive no
 *  § 00, que é aparato, e a extração da Wave 32 cobriu só corpo de
 *  aula — ficou de fora por escopo, não por descuido. É o dado que dá
 *  sentido aos quatro `ClaimUniverse` que o jogo já usava como rótulo.
 *
 *  Proveniência declarada pela própria fonte: "Todos os valores desta
 *  tabela foram verificados em fonte primária em 1º de agosto de 2026 e
 *  se referem a publicações do ciclo 2026 com ano-base 2025." */
export const M08_UNIVERSOS_CAPACIDADE: readonly UniversoDeCapacidade[] = [
  {
    rotulo: '261,0 GW',
    gw: 261.0,
    dataBase: '31/12/2025',
    universo: 'Conceito amplo: geração centralizada mais autoprodução mais micro e minigeração distribuída',
    publicacao: 'Balanço energético e anuário estatístico da empresa de pesquisa',
  },
  {
    rotulo: '215,9 GW',
    gw: 215.9,
    dataBase: '01/01/2026',
    universo: 'Somente usinas centralizadas outorgadas e em operação',
    publicacao: 'Sistema de informações de geração da agência reguladora',
  },
  {
    rotulo: '~255 GW',
    gw: 255,
    dataBase: 'base do plano',
    universo: 'Ponto de partida declarado do plano decenal vigente',
    publicacao: 'Plano decenal de expansão de energia',
  },
  {
    rotulo: '269 GW',
    gw: 269,
    dataBase: 'previsto 2030',
    universo: 'Capacidade do sistema interligado no fim do horizonte de médio prazo',
    publicacao: 'Plano da operação elétrica de médio prazo do operador',
  },
];

/** As seis fontes com capacidade (GW) e fator de capacidade (%), na
 *  ordem declarada da fonte. Literal do `I2.src` do <script> do INST 02.
 *
 *  MORAVA em `alexandria-modulo-08-content.ts` (LYCEUM Wave 38) e mudou
 *  para cá na Wave 40: o jogo cita `64,8 GW` da solar, que é a MESMA
 *  grandeza desta tabela. Aquele arquivo reexporta como `M08_INST02_SRC`
 *  para não quebrar a calculadora, que importa por aquele nome. */
export const M08_CAPACIDADE_POR_FONTE: readonly {
  k: string;
  nome: string;
  cap: number;
  fc: number;
}[] = [
  { k: 'hid', nome: 'Hidrelétrica', cap: 110.2, fc: 41.6 },
  { k: 'sol', nome: 'Solar', cap: 64.8, fc: 15.5 },
  { k: 'eol', nome: 'Eólica', cap: 34.7, fc: 38.3 },
  { k: 'bio', nome: 'Biomassa', cap: 17.5, fc: 41.1 },
  { k: 'fos', nome: 'Térmica fóssil', cap: 31.8, fc: 27.5 },
  { k: 'nuc', nome: 'Nuclear', cap: 2.0, fc: 90.4 },
];

/** Soma das seis — 261,0 GW, DERIVADA, não digitada. Confere com a
 *  primeira linha de `M08_UNIVERSOS_CAPACIDADE` e com o § Erros da
 *  fonte ("O Brasil tem 261 GW de capacidade instalada"). O teste de
 *  invariante cobra essa concordância. */
export const M08_CAPACIDADE_TOTAL_GW = M08_CAPACIDADE_POR_FONTE.reduce(
  (a, s) => a + s.cap,
  0,
);

/** Fatia de cada fonte na pizza de capacidade, DERIVADA da tabela em GW.
 *
 *  É a prova de que `64,8 GW` (jogo) e `24,8 %` (gabarito do
 *  Reconstrutor) nunca foram números concorrentes: 64,8 / 261,0 =
 *  24,83 %, que arredonda para os dois. A Wave 40 foi aberta sob a
 *  suspeita de que divergiam; a aritmética mostrou que são o mesmo fato
 *  em duas unidades. */
export const M08_FATIA_CAPACIDADE_PCT: Record<string, number> =
  Object.fromEntries(
    M08_CAPACIDADE_POR_FONTE.map((s) => [s.k, (s.cap / M08_CAPACIDADE_TOTAL_GW) * 100]),
  );

/** Um fato escalar do módulo, com a procedência colada nele — que é o
 *  que o Bloco 8 inteiro ensina a nunca soltar do número. */
export interface FatoM08 {
  /** O número, cru. */
  valor: number;
  /** Como ele aparece escrito na prosa dos dois arquivos. É esta string
   *  que o teste de invariante procura. */
  texto: string;
  unidade: string;
  /** Grandeza, universo e período — o recorte sem o qual o número mente. */
  grandeza: string;
  universo: string;
  periodo: string;
}

/** Os fatos que o conteúdo de aula E o jogo citam. Todos conferidos
 *  contra `alexandria_modulo08.html` na Fase 1 da Wave 40. */
export const M08_FATOS = {
  renovabilidadeEletrica: {
    valor: 86.8, texto: '86,8%', unidade: '%',
    grandeza: 'Renovabilidade', universo: 'Oferta interna de energia elétrica', periodo: 'Ano-base 2025',
  },
  solarCapacidade: {
    valor: 64.8, texto: '64,8 GW', unidade: 'GW',
    grandeza: 'Capacidade instalada', universo: 'Conceito amplo', periodo: 'Ano-base 2025',
  },
  solarGeracao: {
    valor: 88.1, texto: '88,1 TWh', unidade: 'TWh',
    grandeza: 'Geração', universo: 'Conceito amplo', periodo: 'Ano-base 2025',
  },
  curtailmentEnergetico2024: {
    valor: 4330, texto: '4.330 gigawatt-hora', unidade: 'GWh',
    grandeza: 'Restrição por razão energética', universo: 'SIN operativo', periodo: 'Ano 2024',
  },
  curtailmentContrafactual: {
    valor: 7.6, texto: '7,6 gigawatt-hora', unidade: 'GWh',
    grandeza: 'Restrição em cenário sem geração distribuída', universo: 'SIN operativo', periodo: 'Contrafactual sobre 2024',
  },
  corte2021: {
    valor: 0.1, texto: '0,1% em 2021', unidade: '%',
    grandeza: 'Corte de geração eólica e solar', universo: 'SIN operativo', periodo: '2021',
  },
  corte2025: {
    valor: 20, texto: '20% em 2025', unidade: '%',
    grandeza: 'Corte de geração eólica e solar', universo: 'SIN operativo (série com quebra em 2024)', periodo: '2025',
  },
  axiaParticipacao: {
    valor: 37, texto: '37%', unidade: '%',
    grandeza: 'Participação em linhas de transmissão', universo: 'Segmento acima de 230 kV, incluindo participações societárias', periodo: 'Fim de 2025',
  },
  axiaLimiarTensao: {
    valor: 230, texto: '230 quilovolts', unidade: 'kV',
    grandeza: 'Limiar de tensão do denominador', universo: 'Segmento de transmissão', periodo: 'Fim de 2025',
  },
  roraimaLinha: {
    valor: 725, texto: '725 quilômetros', unidade: 'km',
    grandeza: 'Extensão da linha Manaus–Boa Vista', universo: 'Circuito duplo de 500 kV', periodo: 'Energizada em 2025',
  },
} as const satisfies Record<string, FatoM08>;

/** O valor de planejamento que o jogo usa no documento do slide sem
 *  fonte. Apontado para a quarta linha da tabela do § 00 — DERIVADO,
 *  não digitado.
 *
 *  Antes da Wave 40 o jogo dizia "78 GW", número que NÃO existe em
 *  lugar nenhum de `alexandria_modulo08.html` (o único casamento de
 *  "78" no arquivo é o hexadecimal `A78BFA` de uma cor). A sigla "PDE"
 *  também não aparece na fonte — o módulo escreve "plano decenal". Um
 *  jogo cujo tema é proveniência não pode inventar o próprio número, e
 *  a mecânica do exercício não depende de qual número é: o slide segue
 *  sem universo, sem ano e sem cenário, e a resposta esperada segue
 *  sendo "insuficiente". */
export const M08_PLANEJAMENTO_MEDIO_PRAZO = M08_UNIVERSOS_CAPACIDADE[3];
export const M08_PLANO_DECENAL_BASE = M08_UNIVERSOS_CAPACIDADE[2];
