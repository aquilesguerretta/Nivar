// src/lib/atlas/atlasDerivacoes.ts
// Alexandria — Atlas Mundial (Wave 35). Camada de derivação: funções
// PURAS sobre os 12 campos que a CURSOR Wave 10 já ingeriu. Nenhuma
// ingestão nova, nenhum campo inventado.
//
// ── A DISTINÇÃO QUE RENDE A WAVE INTEIRA ─────────────────────────────
// `carbonIntensityElecGco2PerKwh` é INTENSIDADE — gramas de CO₂ por
// kWh gerado. NÃO é emissão total. Um país pequeno com matriz suja tem
// intensidade altíssima e emissão absoluta irrelevante; um país grande
// com matriz limpa tem intensidade baixa e emissão absoluta enorme.
//
// Emissão total aproximada exige multiplicar intensidade × geração —
// número DERIVADO, não medido. Toda função que o produz devolve
// `derivado: true` e a fórmula junto, e a interface é obrigada a
// exibir isso: se a distinção não aparecer na tela, a feature está
// errada mesmo com o cálculo certo.
//
// ── AUSÊNCIA NUNCA VIRA ZERO ─────────────────────────────────────────
// Medido no endpoint real: 4 países (LSO, FSM, TUV, UKR) não têm
// NENHUM campo de matriz; 26 não têm `otherRenewablesExcBiofuel`; 3–4
// não têm geração/renovável/intensidade. Toda derivação devolve `null`
// nesses casos, e quem colore trata `null` como estado próprio — nunca
// como o extremo frio da escala.

import {
  CAMPOS_MATRIZ,
  type MatrizGeracao,
  type PaisResumo,
} from './worldApi';

// ─────────────────────────────────────────────────────────────────────
// Matriz dominante — com a CHAVE, não só o rótulo
// ─────────────────────────────────────────────────────────────────────

export type ChaveFonte = keyof MatrizGeracao;

export interface FonteDominante {
  chave: ChaveFonte;
  rotulo: string;
  pct: number;
}

/** Maior participação entre os sete campos de fonte. Devolve `null`
 *  quando TODOS são null — o país não declara matriz, e isso é um
 *  estado, não um empate em zero. (`combustivelDominante` em
 *  worldApi.ts devolve só o rótulo; aqui precisamos da chave para
 *  mapear cor e filtro.) */
export function fonteDominante(mix: MatrizGeracao): FonteDominante | null {
  let melhor: FonteDominante | null = null;
  for (const campo of CAMPOS_MATRIZ) {
    const v = mix[campo.chave];
    if (v !== null && (melhor === null || v > melhor.pct)) {
      melhor = { chave: campo.chave, rotulo: campo.rotulo, pct: v };
    }
  }
  return melhor;
}

// ─────────────────────────────────────────────────────────────────────
// Emissão total APROXIMADA — derivada, nunca medida
// ─────────────────────────────────────────────────────────────────────

export interface EmissaoDerivada {
  /** Milhões de toneladas de CO₂/ano (Mt). */
  mtCO2: number;
  /** SEMPRE true. O campo existe para a interface não ter como exibir
   *  este número sem saber que ele é derivado. */
  derivado: true;
  formula: string;
}

/** intensidade (gCO₂/kWh) × geração (TWh) → Mt CO₂/ano.
 *
 *  Conversão: 1 TWh = 1e9 kWh; g → Mt divide por 1e12.
 *  Logo Mt = gCO₂/kWh × TWh × 1e9 / 1e12 = gCO₂/kWh × TWh / 1000.
 *
 *  Devolve `null` se qualquer um dos dois fatores faltar — metade de
 *  uma multiplicação não é uma estimativa, é um chute. */
export function emissaoTotalAproximada(p: PaisResumo): EmissaoDerivada | null {
  const intensidade = p.carbonIntensityElecGco2PerKwh;
  const geracao = p.electricityGenerationTwh;
  if (intensidade === null || geracao === null) return null;
  return {
    mtCO2: (intensidade * geracao) / 1000,
    derivado: true,
    formula: 'intensidade de carbono (gCO₂/kWh) × geração elétrica (TWh) ÷ 1.000',
  };
}

// ─────────────────────────────────────────────────────────────────────
// Métricas rankeáveis — o catálogo do que a wave sabe ordenar
// ─────────────────────────────────────────────────────────────────────

export type ChaveMetrica =
  | 'geracao'
  | 'intensidade'
  | 'renovavel'
  | 'emissaoDerivada'
  | 'perCapita';

export interface DefMetrica {
  chave: ChaveMetrica;
  rotulo: string;
  unidade: string;
  /** Valor do país, ou null quando a fonte não declara. */
  valor: (p: PaisResumo) => number | null;
  casas: number;
  /** true = este número NÃO vem da fonte, é calculado aqui. A
   *  interface é obrigada a rotular. */
  derivada: boolean;
  formula?: string;
  /** Chave snake_case do OWID, para citar a fonte como o PaisPerfil
   *  faz. Ausente nas derivadas — elas citam as fontes dos fatores. */
  fonteCampo?: string;
  /** Fatores de uma métrica derivada, para a citação composta. */
  fonteFatores?: string[];
}

export const METRICAS: ReadonlyArray<DefMetrica> = [
  {
    chave: 'geracao',
    rotulo: 'Geração elétrica',
    unidade: 'TWh',
    valor: (p) => p.electricityGenerationTwh,
    casas: 1,
    derivada: false,
    fonteCampo: 'electricity_generation',
  },
  {
    chave: 'intensidade',
    rotulo: 'Intensidade de carbono',
    unidade: 'gCO₂/kWh',
    valor: (p) => p.carbonIntensityElecGco2PerKwh,
    casas: 0,
    derivada: false,
    fonteCampo: 'carbon_intensity_elec',
  },
  {
    chave: 'renovavel',
    rotulo: 'Participação renovável',
    unidade: '%',
    valor: (p) => p.renewablesShareElecPct,
    casas: 1,
    derivada: false,
    fonteCampo: 'renewables_share_elec',
  },
  {
    chave: 'perCapita',
    rotulo: 'Energia per capita',
    unidade: 'kWh/pessoa',
    valor: (p) => p.energyPerCapitaKwh,
    casas: 0,
    derivada: false,
    fonteCampo: 'energy_per_capita',
  },
  {
    chave: 'emissaoDerivada',
    rotulo: 'Emissão total aproximada',
    unidade: 'Mt CO₂/ano',
    valor: (p) => emissaoTotalAproximada(p)?.mtCO2 ?? null,
    casas: 1,
    derivada: true,
    formula: 'intensidade de carbono (gCO₂/kWh) × geração elétrica (TWh) ÷ 1.000',
    fonteFatores: ['carbon_intensity_elec', 'electricity_generation'],
  },
];

export function metricaPorChave(chave: ChaveMetrica): DefMetrica {
  const m = METRICAS.find((x) => x.chave === chave);
  if (!m) throw new Error(`métrica desconhecida: ${chave}`);
  return m;
}

// ─────────────────────────────────────────────────────────────────────
// Ranking
// ─────────────────────────────────────────────────────────────────────

export interface LinhaRanking {
  pais: PaisResumo;
  valor: number;
  posicao: number;
}

export interface Ranking {
  metrica: DefMetrica;
  linhas: LinhaRanking[];
  /** Países excluídos por não declararem o campo — reportado, não
   *  escondido: um top-10 silencioso sobre 184 de 188 países mente
   *  por omissão. */
  semDado: number;
}

/** Top N por qualquer métrica. País sem o campo NÃO entra como zero —
 *  fica de fora e é contado em `semDado`. */
export function rankearPor(
  paises: Iterable<PaisResumo>,
  chave: ChaveMetrica,
  n = 10,
  ordem: 'desc' | 'asc' = 'desc',
): Ranking {
  const metrica = metricaPorChave(chave);
  const comValor: Array<{ pais: PaisResumo; valor: number }> = [];
  let semDado = 0;
  for (const pais of paises) {
    const v = metrica.valor(pais);
    if (v === null) semDado += 1;
    else comValor.push({ pais, valor: v });
  }
  comValor.sort((a, b) => (ordem === 'desc' ? b.valor - a.valor : a.valor - b.valor));
  return {
    metrica,
    linhas: comValor.slice(0, n).map((l, i) => ({ ...l, posicao: i + 1 })),
    semDado,
  };
}

// ─────────────────────────────────────────────────────────────────────
// Escalas de cor — paleta Alexandria, nunca arco-íris
// ─────────────────────────────────────────────────────────────────────

/** Como o globo deve ser colorido. 'nenhum' = o estado da Wave 27,
 *  lavagem uniforme de creme. */
export type ModoCor = 'nenhum' | 'matriz' | 'intensidade' | 'renovavel';

/** Cor de cada fonte de energia. Deriva da paleta do sistema: oliva
 *  para o que é biológico, ouro para o solar, terracota para o nuclear
 *  (cor de estado forte, usada aqui porque nuclear é a categoria mais
 *  distintiva do conjunto). Sem verde-vermelho de dashboard.
 *
 *  FÓSSIL e HIDRÁULICA foram trocadas depois do render: as duas
 *  primeiras versões vinham direto da paleta de TINTA (#2A2620) e do
 *  NAVY (#0D2340) — e a esfera do globo É navy, então país hidráulico
 *  ficava literalmente invisível e fóssil quase preto sobre fundo
 *  escuro. As duas precisam ler sobre navy E como quadrado de legenda
 *  sobre creme; por isso subiram de luminância e ganharam matiz
 *  própria (carvão quente e água), em vez de repetir cor de fundo. */
export const COR_FONTE: Record<ChaveFonte, string> = {
  fossilPct: '#736A5C',                   // carvão quente, lê sobre navy
  nuclearPct: '#A8462A',                  // A.terracota
  hydroPct: '#357B73',                    // água — distinto do navy da esfera
  windPct: '#5C7A99',                     // azul-aço, entre navy e céu
  solarPct: '#CBAA6E',                    // A2.ouroSobreNavy
  biofuelPct: '#55663F',                  // A.oliva
  otherRenewablesExcBiofuelPct: '#8E9E6B', // A2.olivaSobreNavy
};

/** Tratamento de AUSÊNCIA — visualmente distinto de qualquer ponto da
 *  escala. Um país sem dado não é "frio", não é "zero": é hachura de
 *  papel vazio. */
export const COR_SEM_DADO = 'rgba(242, 233, 214, 0.04)';

/** Faixas MEDIDAS no endpoint real (188 países), não estimadas:
 *  intensidade 0–1306 gCO₂/kWh (mediana 451) · renovável 0–100%
 *  (mediana 29,1). Os tetos são arredondados um pouco acima do máximo
 *  observado para a escala não saturar com um único país. */
const FAIXA: Record<'intensidade' | 'renovavel', { min: number; max: number }> = {
  intensidade: { min: 0, max: 1000 },
  renovavel: { min: 0, max: 100 },
};

function misturar(de: [number, number, number], para: [number, number, number], t: number): string {
  const k = Math.max(0, Math.min(1, t));
  const c = de.map((v, i) => Math.round(v + (para[i] - v) * k));
  return `rgb(${c[0]}, ${c[1]}, ${c[2]})`;
}

// Rampa da intensidade: creme claro (limpo) → terracota (sujo). Duas
// cores do sistema, uma dimensão só — quanto mais escuro e quente,
// mais carbono por kWh.
const RAMPA_INTENSIDADE: [[number, number, number], [number, number, number]] = [
  [225, 214, 190], // creme sombreado
  [138, 46, 22],   // terracota profunda
];

// Rampa do renovável: creme (nenhum) → oliva (tudo). Oliva é a cor de
// "argumento favorável" no sistema, e é o que 100% renovável é.
const RAMPA_RENOVAVEL: [[number, number, number], [number, number, number]] = [
  [225, 214, 190],
  [61, 77, 41],
];

export interface CorDePais {
  cor: string;
  /** true quando o país não declara a métrica ativa — a interface usa
   *  para explicar a hachura em vez de deixar o usuário achar que o
   *  país tem valor baixo. */
  semDado: boolean;
}

/** Cor de um país sob o modo ativo. Regra dura: `null` em qualquer
 *  ponto devolve COR_SEM_DADO com `semDado: true` — nunca o extremo
 *  frio da rampa. */
export function corDoPais(pais: PaisResumo | null, modo: ModoCor): CorDePais {
  if (pais === null) return { cor: COR_SEM_DADO, semDado: true };

  if (modo === 'nenhum') {
    return { cor: 'rgba(242, 233, 214, 0.10)', semDado: false };
  }

  if (modo === 'matriz') {
    const dom = fonteDominante(pais.fuelMix);
    if (dom === null) return { cor: COR_SEM_DADO, semDado: true };
    return { cor: COR_FONTE[dom.chave], semDado: false };
  }

  const valor =
    modo === 'intensidade' ? pais.carbonIntensityElecGco2PerKwh : pais.renewablesShareElecPct;
  if (valor === null) return { cor: COR_SEM_DADO, semDado: true };

  const faixa = FAIXA[modo];
  const t = (valor - faixa.min) / (faixa.max - faixa.min);
  const rampa = modo === 'intensidade' ? RAMPA_INTENSIDADE : RAMPA_RENOVAVEL;
  return { cor: misturar(rampa[0], rampa[1], t), semDado: false };
}

/** Amostras para a legenda da escala — derivadas da mesma função que
 *  colore o globo, então legenda e mapa nunca divergem. */
export function amostrasDaEscala(modo: 'intensidade' | 'renovavel'): Array<{ rotulo: string; cor: string }> {
  const faixa = FAIXA[modo];
  const rampa = modo === 'intensidade' ? RAMPA_INTENSIDADE : RAMPA_RENOVAVEL;
  const passos = [0, 0.25, 0.5, 0.75, 1];
  return passos.map((t) => ({
    rotulo:
      modo === 'intensidade'
        ? `${Math.round(faixa.min + t * (faixa.max - faixa.min))}`
        : `${Math.round(faixa.min + t * (faixa.max - faixa.min))}%`,
    cor: misturar(rampa[0], rampa[1], t),
  }));
}

// ─────────────────────────────────────────────────────────────────────
// Filtro por matriz dominante
// ─────────────────────────────────────────────────────────────────────

/** null = sem filtro (todos visíveis). */
export type FiltroFonte = ChaveFonte | null;

/** O país passa no filtro? País sem matriz declarada NÃO passa em
 *  nenhum filtro específico — mas quem desenha o esmaece, não o some
 *  (confundir geografia com dado seria erro de mapa). */
export function passaNoFiltro(pais: PaisResumo | null, filtro: FiltroFonte): boolean {
  if (filtro === null) return true;
  if (pais === null) return false;
  return fonteDominante(pais.fuelMix)?.chave === filtro;
}

/** Quantos países cada fonte domina — alimenta os contadores do painel
 *  de filtro, para o usuário saber o tamanho de cada categoria antes
 *  de clicar. */
export function contarPorDominante(
  paises: Iterable<PaisResumo>,
): { porFonte: Record<ChaveFonte, number>; semMatriz: number } {
  const porFonte = {
    fossilPct: 0, nuclearPct: 0, hydroPct: 0, windPct: 0,
    solarPct: 0, biofuelPct: 0, otherRenewablesExcBiofuelPct: 0,
  } as Record<ChaveFonte, number>;
  let semMatriz = 0;
  for (const p of paises) {
    const dom = fonteDominante(p.fuelMix);
    if (dom === null) semMatriz += 1;
    else porFonte[dom.chave] += 1;
  }
  return { porFonte, semMatriz };
}
