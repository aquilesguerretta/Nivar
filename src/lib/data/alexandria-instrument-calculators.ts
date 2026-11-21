// alexandria-instrument-calculators.ts
// A lógica de cálculo dos instrumentos: sete do Módulo 01, nove do Módulo 02.
//
// PORTADA do `<script>` de cada HTML em `Alexandria modulos/`, não
// rederivada. Onde o original faz algo estranho, o comportamento foi
// PRESERVADO e sinalizado em comentário — corrigir matemática que já está
// em produção é decisão de conteúdo, não de código.
//
// O `formula` do tipo `Instrument` é rótulo de exibição ("kWh = kW × h"),
// não expressão executável. O cálculo é este código; nada aqui avalia
// string.
//
// CHAVES: o Módulo 01 ocupa `inst-01`..`inst-06` + `lab-01`; o Módulo 02
// entra namespaçado como `m02-inst-01`..`m02-inst-09`. Sem o prefixo os
// nove sobrescreveriam seis — a fonte numera os instrumentos por módulo,
// reiniciando do 01.

/** Entradas por id de campo → saídas por id de saída.
 *  Saída qualitativa (o `-interp` / `-status` do original) sai em
 *  `veredito`, fora do mapa numérico. */
export type ResultadoInstrumento = {
  valores: Record<string, number>;
  veredito?: string;
};

/** Uma entrada de campo. String é legítima: `InstrumentField.defaultValue`
 *  é `number | string` no contrato da FOUNDRY, e todo campo `kind:'select'`
 *  entrega string — tanto numérica ('500' kV) quanto categórica ('ger').
 *
 *  Era `number` puro até a Wave 18. O Módulo 01 não tem nenhum select, por
 *  isso o buraco nunca apareceu; o Módulo 02 tem seis, e com eles o painel
 *  entregava `undefined` e as saídas nasciam `NaN`/`∞` até o aluno mexer
 *  no controle. */
export type EntradaInstrumento = number | string;

export type CalculateFn = (
  inputs: Record<string, EntradaInstrumento>,
) => ResultadoInstrumento;

/** Coerção numérica. Campo ausente, vazio ou não-numérico vira 0 — o
 *  mesmo que `parseFloat(x) || 0` fazia nos originais. */
const n = (v: EntradaInstrumento | undefined): number => {
  const x = typeof v === 'string' ? Number(v) : v;
  return Number.isFinite(x) ? (x as number) : 0;
};

/** Reproduz o `parseFloat(x) || <fallback>` dos originais, onde ZERO
 *  também cai no fallback. Preservado por fidelidade, não por acordo:
 *  é o que faz campo vazio virar 1 em vez de estado de espera. */
const nOu = (v: EntradaInstrumento | undefined, fallback: number): number => {
  const x = typeof v === 'string' ? Number(v) : v;
  return Number.isFinite(x) && x !== 0 ? (x as number) : fallback;
};

/** Sazonalidade de afluência hidrológica, índice mensal jan→dez.
 *  Literal do `<script>` do Módulo 03 (`var SHAPE`), compartilhada pelos
 *  INST 03 (bateria do Brasil) e INST 04 (reservatório × fio d'água) —
 *  é a mesma chuva caindo nas duas simulações, que é justamente o ponto
 *  pedagógico do comparador. */
const SHAPE_AFLUENCIA = [1.55, 1.55, 1.45, 1.25, 0.85, 0.65, 0.55, 0.5, 0.55, 0.7, 1.0, 1.4];


/** ── Constantes do Módulo 04, literais do <script> da fonte ──
 *
 *  Limites do PLD com citação regulatória no próprio original:
 *  "limites regulatórios vigentes 2026 — ANEEL Despacho 3.850/2025". */
const PLD_MIN = 57.31;
const PLD_MAX_HORARIO = 1611.04;
const PLD_MAX_ESTRUTURAL = 785.27;

/** Consumo de referência das simulações de portfólio (MWh/mês). */
const CONS_M04 = 10000;

/** Sazonalidade de pressão hidrológica do INST 02 (jan→dez). */
const SEAS_M04_PLD = [0.55, 0.5, 0.55, 0.65, 0.85, 1.0, 1.15, 1.25, 1.3, 1.2, 0.95, 0.7];

/** Onda mensal de PLD do INST 05 — desvio em torno da média, em ±R$. */
const WAVE_M04 = [-0.85, -1.0, -0.75, -0.4, 0.1, 0.5, 0.8, 1.0, 0.9, 0.55, 0.05, -0.5];

/** Sazonalidade e rampa de choque do INST 07. */
const SEAS_M04_PORT = [0.75, 0.72, 0.78, 0.85, 1.0, 1.12, 1.22, 1.3, 1.32, 1.2, 1.0, 0.82];
const RAMP_M04 = [0, 0, 0, 0, 0, 0, 0.3, 0.55, 0.8, 1.0, 0.7, 0.35];

/** Preço das três camadas do portfólio (R$/MWh). */
const PL_A_M04 = 330;
const PL_B_M04 = 348;
const PL_C_M04 = 366;

/** Fila de lances do leilão do INST 04 — FIXA na fonte. */
const BIDS_M04 = [
  { nome: 'Solar A', mw: 500, p: 170 },
  { nome: 'Eólica B', mw: 400, p: 195 },
  { nome: 'Hidro C', mw: 150, p: 230 },
  { nome: 'Gás D', mw: 600, p: 265 },
  { nome: 'Biomassa E', mw: 120, p: 280 },
  { nome: 'Térmica F', mw: 300, p: 340 },
];

const MES = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

const clamp04 = (v: number, a: number, b: number) => Math.min(Math.max(v, a), b);

/** Formatadores do original, portados para o veredito sair idêntico. */
const num = (v: number, d = 0) =>
  v.toLocaleString('pt-BR', { minimumFractionDigits: d, maximumFractionDigits: d });
const brl = (v: number) => 'R$ ' + Math.round(v).toLocaleString('pt-BR');
const brl2 = (v: number) =>
  'R$ ' + v.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const mi = (v: number) => {
  const a = Math.abs(v);
  if (a >= 1e9) return 'R$ ' + (v / 1e9).toLocaleString('pt-BR', { maximumFractionDigits: 2 }) + ' bi';
  if (a >= 1e6) return 'R$ ' + (v / 1e6).toLocaleString('pt-BR', { maximumFractionDigits: 2 }) + ' mi';
  if (a >= 1e3) return 'R$ ' + (v / 1e3).toLocaleString('pt-BR', { maximumFractionDigits: 0 }) + ' mil';
  return 'R$ ' + Math.round(v).toLocaleString('pt-BR');
};


import { MODULO_06_TRAUMA_CICATRIZ } from './alexandria-modulo-06-content';

/** ── Constantes e helpers do Módulo 06 ──────────────────────
 *
 *  Literais do <script> da fonte. O Módulo 06 é de HISTÓRIA: boa parte
 *  das saídas dele é qualitativa, e por isso vários instrumentos têm
 *  menos entradas em `valores` do que readouts na tela. O veredito —
 *  que é string — carrega o resto, exatamente como o original faz. */
const M06_BASE = 11;      // consumo mensal de referência do INST 04
const M06_FLOOR = 15;     // nível abaixo do qual o sistema é inoperável
const M06_RES = 5;        // reserva sobre o piso
const M06_R = 0.10;       // remuneração real do INST 02

/** As três arquiteturas do INST 05. A fonte inicia em `cur=0`, e o
 *  seletor de regime é um segmentado que não foi extraído como campo —
 *  o único campo do instrumento é o horizonte. */
const M06_REG = [
  { n: '1962–1993 · estatal integrado', F0: 45, S0: 28 },
  { n: '1995–2003 · reforma em transição', F0: 88, S0: 12 },
  { n: '2004– · híbrido', F0: 58, S0: 58 },
];

const m06Falta = (F0: number, h: number) => F0 * Math.pow(Math.max(0, 1 - h / 7), 1.6);
const m06Sobra = (S0: number, h: number) => S0 * Math.pow(clamp06(h / 6, 0, 1), 1.4);
const clamp06 = (v: number, a: number, b: number) => (v < a ? a : v > b ? b : v);

/** Escada de limiares do ACL, literal do `thr()` da fonte, no ramo
 *  padrão (Grupo A, fonte convencional): quem podia migrar, e a partir
 *  de que carga, em cada ano. */
function m06Limiar(ano: number): number {
  if (ano >= 2024) return 0;
  if (ano >= 2023) return 500;
  if (ano >= 2022) return 1000;
  if (ano >= 2021) return 1500;
  if (ano >= 2020) return 2000;
  if (ano >= 2019) return 2500;
  if (ano >= 1996) return 3000;
  return -1;
}
function m06Norma(ano: number): string {
  if (ano >= 2024) return 'Port. Norm. 50/2022';
  if (ano >= 2021) return 'Portaria MME 465/2019';
  if (ano >= 2019) return 'Portaria MME 514/2018';
  if (ano >= 1996) return 'Lei 9.074/1995';
  return 'sem previsão à época';
}
const m06Elegivel = (ano: number, kW: number) => {
  const t = m06Limiar(ano);
  return t >= 0 && kW >= t;
};

const pct = (v: number, d = 1) =>
  v.toLocaleString('pt-BR', { minimumFractionDigits: d, maximumFractionDigits: d }) + '%';
const mmi = (v: number) =>
  Math.abs(v) >= 1000
    ? 'R$ ' + (v / 1000).toLocaleString('pt-BR', { maximumFractionDigits: 2 }) + ' bi'
    : 'R$ ' + v.toLocaleString('pt-BR', { maximumFractionDigits: 0 }) + ' mi';


import { MODULO_07_EXPLORADORES } from './alexandria-modulo-07-content';

/** ── Helpers do Módulo 07 ────────────────────────────────────
 *  Literais do <script> da fonte. O módulo é institucional: dos nove
 *  instrumentos de aula, SETE são exploradores sem cálculo — seleção
 *  única que revela texto — e só dois fazem aritmética de prazo. */
const dias = (v: number) => num(v, 0) + (v === 1 ? ' dia' : ' dias');

/** Monta o veredito de um explorador: rótulo do item + corpo, ambos
 *  literais da fonte. Nada é reescrito nem resumido. */
function explorar07(chave: string, sel: unknown): string {
  const lista = MODULO_07_EXPLORADORES[chave] ?? [];
  if (!lista.length) return '';
  const bruto = typeof sel === 'string' ? Number(sel) : (sel as number);
  const i = Number.isFinite(bruto) ? Math.min(Math.max(Math.trunc(bruto), 0), lista.length - 1) : 0;
  const it = lista[i];
  return `${it.rotulo}\n\n${it.corpo}`;
}

// ── Módulo 08 · INST 04 — Reconstrutor de matriz (LYCEUM Wave 34) ──
//
// PORTADO do `i4check()` da fonte, não rederivado; confrontado contra
// transliteração independente do script original (DOM shimado) antes de
// entrar. Referência e tolerância vêm do arquivo de conteúdo
// (`M08_INST04_REF` / `M08_INST04_TOL`) — fonte de verdade única, mesma
// direção de import que MODULO_06_TRAUMA_CICATRIZ.
//
// O veredito carrega <b> e <br> da fonte, verbatim — o painel renderiza
// HTML SÓ no modo de correção sob demanda. A leitura "Ordem das fontes ·
// Correta/Incorreta" é texto e não cabe em `valores`; o veredito a narra
// (mesma limitação das Waves 19/24/25/29). Caso "faltando": a fonte
// limpa o readout e mostra só o aviso — aqui `valores: {}` produz o
// mesmo efeito (o painel esconde saídas vazias).
import { M06_INST01_MARCOS } from './alexandria-modulo-06-content';
import {
  M07_INST01_ORGAOS,
  M07_INST01_LEGENDAS,
} from './alexandria-modulo-07-content';
import {
  M08_INST04_REF,
  M08_INST04_TOL,
  M08_INST04_FONTES,
  M08_INST02_SRC,
  M08_INST03_FAIXAS,
  M08_INST05_CAMPOS,
  M08_INST05_DADOS,
  M08_INST05_LEITURA,
  M08_INST06_FONTES,
  M08_INST06_DADOS,
  M08_INST06_TXT,
  M08_INST07_MESES,
  M08_INST11_DB,
  M08_INST01_NOS,
} from './alexandria-modulo-08-content';

/** `f1` da fonte: uma casa decimal fixa, vírgula. Usado só no veredito —
 *  os números de `valores` saem crus e o painel formata. */
const f1m08 = (x: number) => (Math.round(x * 10) / 10).toFixed(1).replace('.', ',');

/** `clamp` da fonte: não-finito cai no MÍNIMO (comportamento literal). */
const clampM08 = (v: EntradaInstrumento, a: number, b: number) => {
  const x = Number(v);
  if (!Number.isFinite(x)) return a;
  return Math.min(b, Math.max(a, x));
};

function i4checkM08(
  rodada: 'cap' | 'ger',
  i: Record<string, EntradaInstrumento>,
): ResultadoInstrumento {
  const ref = M08_INST04_REF[rodada];
  const pal: Record<string, number> = {};
  let faltando = 0;
  for (const f of M08_INST04_FONTES) {
    const bruto = i[f.id];
    // Campo vazio não vira 0: a fonte distingue ausente de zero
    // (`pal[f.k] === undefined` → faltando).
    if (bruto === undefined || bruto === '') { faltando++; continue; }
    pal[f.id] = clampM08(bruto, 0, 100);
  }
  if (faltando > 0) {
    return {
      valores: {},
      veredito: `<b>Faltam ${faltando} estimativa${faltando > 1 ? 's' : ''}.</b> Preencha todas as seis antes de corrigir. Chutar é parte do exercício: o objetivo não é acertar, é descobrir em que direção você erra — e para isso o instrumento precisa de todas as fatias.`,
    };
  }
  const soma = M08_INST04_FONTES.reduce((a, f) => a + pal[f.id], 0);
  let errTotal = 0;
  let acertos = 0;
  const superest: string[] = [];
  const subest: string[] = [];
  for (const f of M08_INST04_FONTES) {
    const d = pal[f.id] - ref[f.id];
    errTotal += Math.abs(d);
    if (Math.abs(d) <= M08_INST04_TOL) acertos++;
    else if (d > 0) superest.push(f.nome);
    else subest.push(f.nome);
  }
  const ordPal = [...M08_INST04_FONTES].sort((a, b) => pal[b.id] - pal[a.id]).map((f) => f.id).join(',');
  const ordRef = [...M08_INST04_FONTES].sort((a, b) => ref[b.id] - ref[a.id]).map((f) => f.id).join(',');
  const ordemOk = ordPal === ordRef;
  let msg: string;
  if (Math.abs(soma - 100) > 8) {
    msg = `<b>A soma das suas fatias é ${f1m08(soma)}%, não 100%.</b> Antes de qualquer diagnóstico de conteúdo, corrija isso — uma pizza que não fecha em cem por cento não é uma estimativa da matriz, é uma lista de palpites independentes. Use o botão de normalizar e observe como as fatias se reorganizam: essa reorganização já ensina metade do exercício, porque mostra quais fontes você estava inflando sem perceber.`;
  } else if (ordemOk && acertos === 6) {
    msg = `<b>Reconstrução correta.</b> Ordem certa e todas as seis fatias dentro da tolerância de ${M08_INST04_TOL} pontos. Isso é o critério oficial de domínio deste bloco cumprido para a pizza de ${rodada === 'cap' ? 'capacidade' : 'geração'}. Faça a outra rodada e, ao terminar, explique em voz alta cada troca de posição entre as duas — é a explicação, não o acerto, que consolida.`;
  } else if (ordemOk) {
    msg = `<b>Ordem correta, com ${6 - acertos} fatia${6 - acertos > 1 ? 's' : ''} fora da tolerância.</b> Isso é aprovação no critério que importa. A ordem e a ordem de grandeza são conhecimento durável; o decimal tem prazo de validade de um ano e você deve consultá-lo, não decorá-lo. Se quiser fechar o exercício por completo, revise apenas as fontes marcadas em vermelho — mas não gaste tempo memorizando os valores exatos.`;
  } else {
    msg = `<b>A ordem das fontes está incorreta.</b> Esse é o erro que importa neste bloco, e é bem mais grave que errar decimal. A ordem é o que você usa numa conversa sem consultar nada, e é o que impede a frase indefensável do tipo "a segunda maior fonte do Brasil". Refaça esta rodada olhando as fichas da Aula 02, com atenção especial ao fator de capacidade de cada fonte — é ele que determina a posição em cada uma das duas pizzas.`;
  }
  if (superest.length || subest.length) {
    msg += '<br><br><b>Diagnóstico do seu viés.</b> ';
    if (superest.length) msg += 'Você superestimou: ' + superest.join(', ') + '. ';
    if (subest.length) msg += 'Você subestimou: ' + subest.join(', ') + '. ';
    if (rodada === 'cap' && subest.indexOf('Térmica fóssil') >= 0) {
      msg += 'Subestimar a térmica em capacidade é o viés mais comum e tem causa identificável: como ela gera pouco em ano bom, a intuição a encolhe. Ela é maior do que parece justamente porque existe para os anos ruins — capacidade que raramente é usada continua sendo capacidade.';
    }
    if (rodada === 'ger' && superest.indexOf('Solar') >= 0) {
      msg += 'Superestimar a solar em geração é o segundo viés mais comum. Ela é a fonte mais visível, a que mais aparece em notícia e a que mais cresce em potência, e essa saliência empurra a estimativa de energia para cima. O corretivo é lembrar que o recurso só existe durante parte do dia.';
    }
    if (rodada === 'ger' && subest.indexOf('Hidrelétrica') >= 0) {
      msg += 'Subestimar a hidrelétrica em geração costuma vir de exposição excessiva à narrativa de expansão renovável variável. A hidro perdeu participação por diluição, não por encolhimento: a fatia caiu porque a pizza cresceu.';
    }
  }
  return {
    valores: { 'i4-acertos': acertos, 'i4-err': errTotal, 'i4-soma': soma },
    veredito: msg,
  };
}

// ── Módulo 08 · INST 02 — Conversor de três eixos (LYCEUM Wave 38) ──
//
// PORTADO do `i2calc()` da fonte. As duas pizzas SVG e as duas legendas
// não têm slot no painel; o conteúdo NUMÉRICO delas (a fatia de cada
// fonte em cada pizza) vira saída, em vez de ser descartado em silêncio.
// Descartar seria a perda que a Wave 37 flagrou nos `src-card`.
//
// O `clamp` de entrada é o da fonte, aplicado no handler de `input`
// (cap 0-400 GW, fc 0-100%): campo fora da faixa é grampeado antes de
// entrar na conta, não rejeitado.

function i2calcM08(i: Record<string, EntradaInstrumento>): ResultadoInstrumento {
  // `8.76` da fonte: GW × (FC/100) × 8760 h ÷ 1000 = TWh/ano.
  const src = M08_INST02_SRC.map((s) => ({
    ...s,
    cap: clampM08(i[`i2c-${s.k}`] ?? s.cap, 0, 400),
    fc: clampM08(i[`i2f-${s.k}`] ?? s.fc, 0, 100),
  }));
  const A = src.map((s) => ({ k: s.k, nm: s.nome, v: s.cap }));
  const B = src.map((s) => ({ k: s.k, nm: s.nome, v: s.cap * (s.fc / 100) * 8.76 }));
  const tA = A.reduce((a, b) => a + b.v, 0);
  const tB = B.reduce((a, b) => a + b.v, 0);
  const posA: Record<string, number> = {};
  const posB: Record<string, number> = {};
  [...A].sort((a, b) => b.v - a.v).forEach((x, k) => { posA[x.k] = k + 1; });
  [...B].sort((a, b) => b.v - a.v).forEach((x, k) => { posB[x.k] = k + 1; });
  const trocas = src.filter((s) => posA[s.k] !== posB[s.k]);

  let maiorSubida: { nm: string; d: number } | null = null;
  let maiorQueda: { nm: string; d: number } | null = null;
  src.forEach((s) => {
    const pa = tA > 0 ? (s.cap / tA) * 100 : 0;
    const pb = tB > 0 ? ((s.cap * (s.fc / 100) * 8.76) / tB) * 100 : 0;
    const d = pb - pa;
    if (!maiorSubida || d > maiorSubida.d) maiorSubida = { nm: s.nome, d };
    if (!maiorQueda || d < maiorQueda.d) maiorQueda = { nm: s.nome, d };
  });
  // Os dois só são null com `src` vazio, que não acontece — o cast evita
  // que o TS exija guarda para um caso que a estrutura de dado impede.
  const sub = maiorSubida as unknown as { nm: string; d: number };
  const que = maiorQueda as unknown as { nm: string; d: number };

  const valores: Record<string, number> = {
    'i2-cap-tot': tA,
    'i2-ger-tot': tB,
    'i2-fc-med': tA > 0 ? (tB / (tA * 8.76)) * 100 : 0,
    'i2-trocas': trocas.length,
  };
  src.forEach((s) => {
    valores[`i2-a-${s.k}`] = tA > 0 ? (s.cap / tA) * 100 : 0;
    valores[`i2-b-${s.k}`] = tB > 0 ? ((s.cap * (s.fc / 100) * 8.76) / tB) * 100 : 0;
  });

  let msg: string;
  if (trocas.length === 0) {
    msg = '<b>Nenhuma troca de posição.</b> Isso só acontece quando os fatores de capacidade digitados são muito próximos entre si. É um cenário útil como teste: se todas as fontes tivessem o mesmo fator, as duas pizzas seriam idênticas e este bloco inteiro seria desnecessário. Volte um fator para um valor realista e observe o ranking se reorganizar.';
  } else if (trocas.length <= 2) {
    msg = `<b>${trocas.length} troca${trocas.length > 1 ? 's' : ''} de posição.</b> A fonte que mais ganha participação ao passar de capacidade para geração é <b>${sub.nm}</b>, com ${f1m08(sub.d)} pontos percentuais de ganho; a que mais perde é <b>${que.nm}</b>, com ${f1m08(Math.abs(que.d))} pontos de perda. A direção do movimento é inteiramente previsível pelo fator de capacidade de cada fonte em relação à média do parque — quem está acima da média sobe, quem está abaixo desce.`;
  } else {
    msg = `<b>${trocas.length} trocas de posição.</b> Este é o cenário que torna qualquer afirmação sobre "a segunda maior fonte do Brasil" indefensável sem qualificação. Com essa dispersão de fatores de capacidade, o ranking da pizza de capacidade e o da pizza de geração são objetos diferentes, e citar um como se fosse o outro produz um erro que não é de arredondamento — é de ordem. A fonte que mais sobe é <b>${sub.nm}</b> e a que mais desce é <b>${que.nm}</b>.`;
  }
  return { valores, veredito: msg };
}

// ── Módulo 08 · INST 03 — Fator de capacidade (LYCEUM Wave 38) ──
//
// PORTADO do `i3calc()`. Os três campos passam pelo `pairSlider` da
// fonte, cujo getter é `clamp(value, min, max)` — o grampo é do
// deslizador, não do cálculo, e é reproduzido aqui.
//
// `f0` da fonte arredonda; as saídas saem cruas e o painel formata.
function i3calcM08(i: Record<string, EntradaInstrumento>): ResultadoInstrumento {
  const p = clampM08(i['i3-p'] ?? 300, 1, 15000);
  const e = clampM08(i['i3-e'] ?? 1200, 1, 80000);
  const h = clampM08(i['i3-h'] ?? 8760, 24, 8784);
  const chave = String(i['i3-s'] ?? 'hid');
  const fx = M08_INST03_FAIXAS[chave] ?? M08_INST03_FAIXAS.hid;

  const teor = (p * h) / 1000;
  const fc = teor > 0 ? (e / teor) * 100 : 0;
  const horasEq = p > 0 ? (e * 1000) / p : 0;

  let msg: string;
  if (fc > 100) {
    msg = '<b>Fator acima de 100% — impossível fisicamente.</b> A energia informada excede a que a potência declarada consegue produzir no período. Três causas cobrem quase todos os casos: unidade trocada entre MWh e GWh, período menor que o efetivo de geração, ou potência informada abaixo da real. Antes de investigar qualquer coisa no ativo, confira as unidades.';
  } else if (fc < fx.lo) {
    msg = `<b>Abaixo da faixa típica de ${fx.nome}.</b> ${fx.baixo} Lembre que o fator de capacidade é sintoma, não diagnóstico: ele mistura recurso, disponibilidade, despacho e restrição numa razão só, e separar essas causas exige a série horária, não o total do período.`;
  } else if (fc > fx.hi) {
    msg = `<b>Acima da faixa típica de ${fx.nome}.</b> ${fx.alto} Um valor fora da faixa é sinal para investigar, nunca prova de erro — as faixas são ordens de grandeza para leitura rápida, não parâmetros de projeto.`;
  } else {
    msg = `<b>Dentro da faixa típica de ${fx.nome}.</b> As ${String(Math.round(horasEq))} horas equivalentes a plena carga são a tradução mais intuitiva do resultado: é como se a usina tivesse operado no máximo durante esse número de horas e ficado parada no resto do período. Guarde essa leitura — ela torna a comparação entre fontes imediata sem precisar de percentual.`;
  }
  return {
    valores: {
      'i3-teor': teor,
      'i3-fc': fc,
      'i3-heq': horasEq,
      'i3-fx-lo': fx.lo,
      'i3-fx-hi': fx.hi,
    },
    veredito: msg,
  };
}

// ── Módulo 08 · INST 05 — Leitura lateral (LYCEUM Wave 38) ──
//
// PORTADO do `i5render()`. Explorador puro: zero saída numérica, porque
// a fonte não imprime nenhum número aqui — o instrumento inteiro é a
// tabela mais o parágrafo de leitura.
//
// A tabela das seis fontes é `<div class="src-row">` na fonte; aqui vai
// no veredito, que o painel renderiza como HTML desde a Wave 34. Sem
// esse canal a tabela se perderia inteira.
function i5renderM08(i: Record<string, EntradaInstrumento>): ResultadoInstrumento {
  const bruto = String(i['i5-sel'] ?? 'saz');
  const sel = M08_INST05_CAMPOS.some((c) => c.k === bruto) ? bruto : 'saz';
  const linhas = Object.keys(M08_INST05_DADOS)
    .map((f) => `<b>${f}</b> — ${M08_INST05_DADOS[f][sel]}`)
    .join('<br><br>');
  return {
    valores: {},
    veredito: `${linhas}<br><br><b>O que a leitura lateral revela.</b> ${M08_INST05_LEITURA[sel]}`,
  };
}

// ── Módulo 08 · INST 06 — Curvas de complementaridade (Wave 38) ──
//
// PORTADO do `i6render()`. O SVG de seis linhas fica de fora (não há
// slot); as quatro leituras e o veredito são o que a fonte imprime em
// texto e vêm inteiros. O parágrafo de escala (`I6.txt`) precede o
// diagnóstico, na mesma ordem do original.
function i6renderM08(i: Record<string, EntradaInstrumento>): ResultadoInstrumento {
  const eBruto = String(i['i6-e'] ?? 'mes');
  const e = M08_INST06_DADOS[eBruto] ? eBruto : 'mes';
  const d = M08_INST06_DADOS[e];
  const n = 12;
  const ligadas = M08_INST06_FONTES.filter((f) => String(i[`i6-on-${f.k}`] ?? 'sim') !== 'nao');

  const soma: number[] = [];
  for (let k = 0; k < n; k++) soma.push(ligadas.reduce((a, f) => a + d[f.k][k], 0));
  const exc: number[] = [];
  for (let k = 0; k < n; k++) exc.push(Math.max(0, soma[k] - d.liq[k]));
  const deficit: number[] = [];
  for (let k = 0; k < n; k++) deficit.push(Math.max(0, d.carga[k] - soma[k]));

  const horasExc = exc.filter((v) => v > 0).length;
  const maxExc = Math.max(...exc);
  const maxDef = Math.max(...deficit);

  let msg = `${M08_INST06_TXT[e]}<br><br>`;
  if (ligadas.length === 0) {
    msg += '<b>Nenhuma fonte ligada.</b> A distância inteira entre a linha de carga e o eixo é o que precisa ser atendido. Ligue as fontes uma a uma, na ordem em que quiser, e observe qual parte da curva cada uma cobre — e qual parte nenhuma delas cobre.';
  } else if (horasExc === 0) {
    msg += '<b>Sem excedente nesta configuração.</b> Toda a geração das fontes ligadas cabe abaixo da carga líquida em todos os pontos. Esse é o estado em que o sistema opera sem precisar cortar ninguém — e note que ele deixa de existir assim que você liga a solar na escala diária de domingo.';
  } else if (horasExc <= 3) {
    msg += `<b>Excedente em ${horasExc} ponto${horasExc > 1 ? 's' : ''}.</b> A área vermelha é energia disponível que não tem para onde ir. Nesta magnitude, ela ainda é administrável com redução das fontes despacháveis e ajuste de intercâmbio. O que muda o caráter do problema não é o tamanho do excedente — é a frequência com que ele aparece.`;
  } else {
    msg += `<b>Excedente em ${horasExc} dos 12 pontos.</b> Nesta frequência, o excedente deixa de ser evento e vira regime. A área vermelha representa energia que precisa ser cortada por razão energética, e reforço de transmissão não a elimina — ela existiria mesmo com rede infinita, porque não há carga em lugar nenhum do país naquela hora. As soluções que atacam esse regime são armazenamento, flexibilidade de demanda e moderação da expansão correlacionada.`;
  }
  return {
    valores: {
      'i6-ligadas': ligadas.length,
      'i6-exc': horasExc,
      'i6-maxexc': maxExc,
      'i6-maxdef': maxDef,
    },
    veredito: msg,
  };
}

// ── Módulo 08 · INST 07 — Calendário sazonal (LYCEUM Wave 38) ──
//
// PORTADO do `i7render()`. Explorador: o painel da fonte é título,
// parágrafo e cinco linhas rotuladas (chuva / vento / safra / carga /
// risco de corte). Tudo vai no veredito, que renderiza HTML.
function i7renderM08(i: Record<string, EntradaInstrumento>): ResultadoInstrumento {
  const bruto = Number(i['i7-sel'] ?? 7);
  // A fonte indexa `I7.meses[I7.sel-1]` e só chega aqui por clique num
  // mês existente; o grampo cobre valor fora da faixa sem inventar mês.
  const sel = Number.isFinite(bruto) ? Math.min(Math.max(Math.trunc(bruto), 1), 12) : 7;
  const m = M08_INST07_MESES[sel - 1];
  const linha = (r: string, v: string) => `<b>${r}</b> — ${v}`;
  return {
    valores: { 'i7-mes': m.n },
    veredito: [
      `<b>${m.nome}</b>`,
      m.txt,
      [
        linha('Chuva', m.chuva),
        linha('Vento', m.vento),
        linha('Safra', m.safra),
        linha('Carga', m.carga),
        linha('Risco de corte', m.risco),
      ].join('<br>'),
    ].join('<br><br>'),
  };
}

// ── Módulo 08 · INST 08 — Termômetro hidrológico (Wave 38) ──
//
// PORTADO do `i8calc()`. O quadrante SVG e as duas células do termômetro
// são desenho; as leituras e o veredito vêm inteiros.
//
// Três das quatro leituras são TEXTO — o veredito as abre, na mesma
// ordem da fonte. A nota cinza de rodapé do original vem junto, sem o
// `style="color:#6E7686"`: aquele hexadecimal é da paleta do HTML de
// origem e não existe na folha da Alexandria.
function i8calcM08(i: Record<string, EntradaInstrumento>): ResultadoInstrumento {
  const ena = clampM08(i['i8-ena'] ?? 93, 10, 200);
  const ear = clampM08(i['i8-ear'] ?? 66, 0, 100);
  const mes = clampM08(i['i8-mes'] ?? 6, 1, 12);
  const umido = mes >= 11 || mes <= 4;

  const tend = ena >= 100 ? 'recompondo' : ena >= 80 ? 'estável' : 'deteriorando';
  const meses = ena > 0 ? Math.max(0, Math.round(ear / Math.max(4, (100 - ena) / 6))) : 0;
  const quadrante = `${ear >= 50 ? 'Estoque alto' : 'Estoque baixo'} · ${ena >= 100 ? 'fluxo forte' : 'fluxo fraco'}`;
  const ciclo = umido ? 'Período úmido' : 'Período seco';

  let msg: string;
  if (ear >= 50 && ena >= 100) {
    msg = '<b>Estoque alto com fluxo forte.</b> É o quadrante confortável e o mais fácil de ler: está entrando mais água que o normal e ainda há muita guardada. A atenção operacional aqui não é escassez — é o oposto: com reservatórios cheios e afluência acima da média, aumenta a chance de vertimento turbinável, que é energia desperdiçada de forma silenciosa. E como a hidráulica opera em nível elevado, o piso de geração sobe, o que amplia o excedente nas horas de carga líquida baixa.';
  } else if (ear >= 50 && ena < 100) {
    msg =
      `<b>Estoque alto com fluxo ${ena < 70 ? 'fraco' : 'próximo do normal'}.</b> ` +
      (ena < 70
        ? 'Este é o quadrante que engana. Quem lê só armazenamento conclui que a situação é confortável, e no presente ela é. Mas a afluência abaixo da média significa que o estoque está sendo consumido mais rápido do que reposto, e a folga aparente tem prazo. ' +
          (umido
            ? 'Agravante: estamos no período úmido, que é justamente quando o estoque deveria estar sendo recomposto. Fluxo fraco no período úmido é o sinal antecedente mais forte que existe para um período seco difícil.'
            : 'A leitura no período seco é menos alarmante, porque afluência baixa é o comportamento esperado da estação — a comparação relevante é contra a média daquele mês, e não contra a média anual.')
        : 'Situação que se sustenta. Está entrando aproximadamente o normal para o mês e o estoque está acima da metade. É o estado em que a operação tem liberdade para modular e usar a hidráulica como recurso de flexibilidade sem consumir margem de segurança.');
  } else if (ear < 50 && ena >= 100) {
    msg =
      '<b>Estoque baixo com fluxo forte.</b> Situação em recuperação. O estoque está apertado por causa do que aconteceu antes, mas a água está chegando acima da média e a tendência é de recomposição. A pergunta relevante deixa de ser "quanto tem" e passa a ser "quanto tempo falta" — e a resposta depende da duração do período úmido restante. ' +
      (umido
        ? 'Estar no período úmido é o cenário favorável: há tempo de calendário pela frente.'
        : 'Estar no período seco com afluência acima da média é atípico e não deve ser extrapolado — a média de longo termo daquele mês já é baixa, então superá-la não significa volume grande em termos absolutos.');
  } else {
    msg =
      '<b>Estoque baixo com fluxo fraco.</b> É o único quadrante em que as duas dimensões apontam no mesmo sentido desfavorável, e por isso o único em que a leitura é inequívoca. Há pouca energia guardada e está entrando menos que o normal. ' +
      (umido
        ? 'No período úmido, este quadrante é o mais preocupante de todos, porque é a estação em que a recomposição deveria estar acontecendo e não está — e uma única estação chuvosa pode não bastar para recompor o que se perdeu.'
        : 'No período seco, é a configuração esperada em ano difícil, e o que importa é a distância até o início das chuvas e a taxa de deplecionamento observada nas últimas semanas.') +
      ' Em qualquer dos dois casos, é o quadrante em que despacho térmico e preservação de reservatório passam a governar a operação.';
  }
  msg += '<br><br>A folga em meses é uma aproximação didática grosseira, calculada a partir do estoque e da distância da afluência em relação à média. Ela serve para dar noção de ordem de grandeza da margem, nunca para planejamento — o cálculo real é feito pelos modelos de otimização do operador, que consideram previsão, restrição de uso múltiplo, intercâmbio e cenários de afluência futura.';

  const cabeca = `<b>Quadrante</b> — ${quadrante}<br><b>Tendência do estoque</b> — ${tend}<br><b>Posição no ciclo</b> — ${ciclo}`;
  return { valores: { 'i8-folga': meses }, veredito: `${cabeca}<br><br>${msg}` };
}

// ── Módulo 08 · INST 09 — Anatomia do corte (LYCEUM Wave 38) ──
//
// PORTADO do `i9calc()`, com a cadeia de condições NA ORDEM da fonte —
// `ind` primeiro, depois razão energética, depois `lim` em região
// exportadora, depois `lim` fora dela, e o caso normal por último. A
// ordem é o conteúdo: é ela que expressa "quando há simultaneidade de
// causas, prevalece a razão energética".
//
// As quatro leituras são todas TEXTO; `valores` fica vazio e o veredito
// as abre antes da explicação, como a fonte imprime.
function i9calcM08(i: Record<string, EntradaInstrumento>): ResultadoInstrumento {
  const p = String(i['i9-pat'] ?? 'P3');
  const d = String(i['i9-dia'] ?? 'util');
  const r = String(i['i9-reg'] ?? 'ne');
  const n = String(i['i9-rede'] ?? 'ok');
  const diurno = p === 'P3';
  const transic = p === 'P2';
  const noturno = p === 'P1' || p === 'P4';
  const cargaBaixa = diurno || p === 'P1' || d === 'fds';

  let causa: string, fonte: string, resolve: string, expl: string;
  if (n === 'ind') {
    causa = 'Indisponibilidade externa';
    fonte = r === 'ne' || r === 'no'
      ? 'Usinas conectadas à instalação indisponível, eólicas e solares'
      : 'Usinas conectadas à instalação indisponível';
    resolve = 'Reparo, redundância de equipamento e disciplina de manutenção';
    expl = 'Equipamento fora de serviço é a única das três causas com mecanismo de ressarcimento definido em regulação, desde que a restrição esteja associada a contingência previamente identificada e ultrapasse o limite de tempo estabelecido. Do ponto de vista de diagnóstico, é também a mais simples: a causa é localizável, tem responsável e tem prazo. As outras duas são sistêmicas e não têm nenhuma das três coisas.';
  } else if (diurno || (transic && d === 'fds')) {
    causa = 'Razão energética';
    fonte = 'Predominantemente fotovoltaica centralizada, com parcela eólica no rateio';
    resolve = 'Armazenamento, flexibilidade de demanda, resposta da carga e moderação da expansão correlacionada';
    expl =
      'No patamar de maior irradiância, a soma da geração distribuída, da solar centralizada, da eólica, da térmica inflexível e da hidráulica no piso pode exceder a carga líquida. Quando isso acontece, o corte ocorreria mesmo com transmissão infinita — e é por isso que a classificação adotada pelo operador prioriza a razão energética quando há simultaneidade de causas. ' +
      (d === 'fds'
        ? 'Sendo domingo ou feriado, a carga está no mínimo semanal enquanto a oferta solar não muda, o que torna este o pior caso do sistema. Nos cenários prospectivos, este patamar chega a ter a maior parte de suas horas com restrição.'
        : 'Em dia útil a carga é maior e o excedente é menor, mas as projeções do operador indicam que o corte por razão energética passa a ocorrer com magnitude elevada inclusive em dias úteis à medida que a capacidade variável cresce.') +
      (r === 'seco' || r === 'sul'
        ? ' Note que a região da usina importa pouco aqui: o desequilíbrio é nacional, e o rateio distribui o corte entre as fontes despachadas pelo operador em todo o sistema.'
        : ' A concentração de renovável variável na região amplifica o efeito local, mas a origem do corte permanece sistêmica.');
  } else if (n === 'lim' && (r === 'ne' || r === 'no')) {
    causa = 'Confiabilidade elétrica';
    fonte = 'Usinas eólicas e solares da região exportadora, conforme critério de rateio';
    resolve = 'Reforço de rede, compensação reativa, controles e modelos dinâmicos aderentes ao desempenho real';
    expl =
      'Com o limite de exportação atingido, a geração local excede o que a carga da região consome mais o que a rede consegue levar para fora. Esta é a causa que reforço de transmissão efetivamente resolve. Vale registrar o que a fez crescer: a revisão dos modelos matemáticos das usinas renováveis após uma perturbação relevante de 2023 reduziu a capacidade de escoamento calculada — o limite não encolheu por conservadorismo do operador, encolheu porque passou a refletir o desempenho real das usinas em contingência.' +
      (noturno
        ? ' Nos patamares noturnos, com vento forte e carga do sistema em transição, o limite de exportação é a restrição dominante e a solar não participa por ausência de recurso.'
        : '');
  } else if (n === 'lim') {
    causa = 'Confiabilidade elétrica, de menor magnitude';
    fonte = 'Usinas da região sob restrição local';
    resolve = 'Reforço localizado e recomposição de margem de conexão';
    expl = 'Fora das regiões exportadoras estruturais, o limite atingido tende a ser interno e localizado, e não uma fronteira de intercâmbio regional. O efeito é menor em volume e mais concentrado em poucas usinas. O diagnóstico correto exige identificar qual inequação ou qual limite interno foi violado, porque a solução é específica do ponto.';
  } else {
    causa = 'Sem corte esperado nesta configuração';
    fonte = '—';
    resolve = 'Nada a resolver: é o estado normal de operação';
    expl = p === 'P4'
      ? 'No patamar de ponta, a carga está no máximo e a geração solar já cessou. O problema deste patamar é o oposto do corte: é a rampa de subida que exige hidráulica, térmica, armazenamento e intercâmbio respondendo em poucas horas. Nas análises prospectivas do operador, este intervalo aparece com praticamente nenhuma hora sob restrição, o que sugere que as interligações regionais estão bem dimensionadas para a ponta.'
      : 'Na madrugada, a carga é baixa mas a solar não gera e a hidráulica já opera próximo do piso. O vento pode estar alto, especialmente no Nordeste, mas o balanço fecha sem necessidade de corte na maior parte dos casos. É o patamar mais tranquilo do dia — e é útil lembrar disso quando alguém descreve o corte de geração como um problema permanente: ele é um problema de janela horária.';
  }

  const cabeca = [
    `<b>Causa predominante</b> — ${causa}`,
    `<b>Sobre quem recai</b> — ${fonte}`,
    `<b>O que efetivamente resolve</b> — ${resolve}`,
    `<b>Carga líquida no patamar</b> — ${cargaBaixa ? 'Baixa' : 'Elevada'}`,
  ].join('<br>');
  return {
    valores: {},
    veredito: `${cabeca}<br><br>${expl}<br><br><b>Quem nunca é cortado.</b> Em todas as configurações acima, a micro e minigeração distribuída permanece inalterada, porque ela não está sob comando do operador. O ônus da restrição recai integralmente sobre a geração centralizada — que não é quem causa o desequilíbrio, é quem pode ser chamada a corrigi-lo. Essa assimetria é problema de desenho de regra, não de tecnologia.`,
  };
}

// ── Módulo 08 · INST 10 — Perfil de carga (LYCEUM Wave 38) ──
//
// PORTADO do `i10calc()`. As quatro leituras são numéricas e cabem
// inteiras. O veredito da fonte é montado em TRÊS camadas somadas: o
// bloco de fator de carga (4 faixas), o bloco de casamento com solar
// (3 faixas) e uma frase condicional de operação ininterrupta — as três
// preservadas com a mesma condição e na mesma ordem.
//
// `52` semanas e `8760` horas são literais da fonte, não normalizados.
function i10calcM08(i: Record<string, EntradaInstrumento>): ResultadoInstrumento {
  const c = clampM08(i['i10-c'] ?? 120, 1, 600);
  const h = clampM08(i['i10-h'] ?? 24, 4, 24);
  const d = clampM08(i['i10-d'] ?? 7, 1, 7);
  const t = clampM08(i['i10-t'] ?? 40, 0, 100);

  const horasAno = h * d * 52;
  const demMed = horasAno > 0 ? (c * 1000) / horasAno : 0;
  const demMedAnual = (c * 1000) / 8760;
  const fatorCarga = demMed > 0 ? (demMedAnual / demMed) * 100 : 0;
  const horasDiurnas = Math.min(h, 7);
  const energiaDiurna = c * (t / 100);
  const potDiurna = horasDiurnas * d * 52 > 0 ? (energiaDiurna * 1000) / (horasDiurnas * d * 52) : 0;
  const coberturaSolar = demMed > 0
    ? Math.min(100, (potDiurna / demMed) * 100 * (horasDiurnas / Math.max(h, 1)))
    : 0;

  const fcTxt = f1m08(fatorCarga);
  let msg: string;
  if (fatorCarga >= 85) {
    msg = `<b>Perfil praticamente contínuo, fator de carga de ${fcTxt}%.</b> É o perfil típico de mineração, metalurgia, química de base e papel e celulose. A boa notícia: demanda contratada bem aproveitada e previsibilidade alta. A notícia relevante: praticamente nenhuma flexibilidade natural, o que significa que participação em resposta da demanda exige alteração de processo, não apenas de agenda. `;
  } else if (fatorCarga >= 55) {
    msg = `<b>Perfil de operação estendida, fator de carga de ${fcTxt}%.</b> Turnos longos com paradas definidas. Há espaço real para deslocar processos não críticos — refrigeração, bombeamento, carregamento de baterias, moagem — para janelas específicas, e esse espaço tem valor econômico mensurável. `;
  } else if (fatorCarga >= 30) {
    msg = `<b>Perfil concentrado, fator de carga de ${fcTxt}%.</b> A planta consome muito em poucas horas. A consequência direta é que a demanda contratada precisa cobrir um pico que existe numa fração pequena do tempo, e o custo dessa capacidade ociosa é frequentemente a maior oportunidade de otimização de uma conta industrial. `;
  } else {
    msg = `<b>Perfil altamente concentrado, fator de carga de ${fcTxt}%.</b> Este é o perfil que mais penaliza economicamente, porque exige capacidade instalada e contratada dimensionada para um pico que ocorre raramente. Antes de qualquer discussão sobre fonte ou contrato, a pergunta é se o pico pode ser achatado — deslocar carga costuma valer mais que negociar preço. `;
  }
  const tTxt = String(Math.round(t));
  if (t >= 70 && horasDiurnas >= 6) {
    msg += `<br><br><b>Casamento com solar.</b> Com ${tTxt}% do consumo concentrado no turno diurno, o perfil tem afinidade estrutural com geração fotovoltaica: a produção e o consumo ocorrem na mesma janela. É o caso menos comum na indústria pesada e o mais comum em comércio, serviços e agroindústria de beneficiamento.`;
  } else if (t <= 35) {
    msg += `<br><br><b>Descasamento com solar.</b> Com apenas ${tTxt}% do consumo no turno diurno, contratar exclusivamente solar deixa a maior parte da operação descoberta nas horas em que ela realmente consome. Isso não invalida a fonte — invalida a leitura de que basta comparar volume anual. A pergunta correta é qual fração do consumo cai dentro da janela de produção, e a resposta aqui é pequena.`;
  } else {
    msg += `<br><br><b>Casamento parcial com solar.</b> Com ${tTxt}% do consumo no turno diurno, a fonte cobre uma parte relevante e deixa o resto exposto. É a configuração mais comum e a mais mal analisada, porque o volume anual sugere um casamento melhor do que o perfil horário confirma.`;
  }
  if (h >= 20 && d >= 6) {
    msg += ' Operação praticamente ininterrupta também significa que o custo de uma interrupção não programada é alto: a confiabilidade local da distribuidora deixa de ser detalhe e vira variável de decisão independente do preço da energia.';
  }
  msg += '<br><br>Este instrumento não trata de estrutura tarifária, modalidade nem posto horário, que são matéria do Bloco 10. Ele responde apenas à pergunta de formato: qual é a forma da curva e com qual fonte ela conversa.';

  return {
    valores: {
      'i10-demmed': demMed,
      'i10-fc': fatorCarga,
      'i10-horas': horasAno,
      'i10-solar': coberturaSolar,
    },
    veredito: msg,
  };
}

// ── Módulo 08 · INST 11 — Roteador de recorte (LYCEUM Wave 38) ──
//
// PORTADO do `i11render()`. A ficha de cinco campos e o veredito de uso
// vêm inteiros; `valores` fica vazio porque a fonte não imprime número
// nenhum. O eixo `uso` NÃO altera a ficha — só troca o veredito, e essa
// independência é do original.
function i11renderM08(i: Record<string, EntradaInstrumento>): ResultadoInstrumento {
  const tBruto = String(i['i11-tema'] ?? 'cap');
  const tema = M08_INST11_DB[tBruto] ? tBruto : 'cap';
  const gBruto = String(i['i11-gran'] ?? 'tr');
  const gran = M08_INST11_DB[tema][gBruto] ? gBruto : 'tr';
  const d = M08_INST11_DB[tema][gran];
  const pub = String(i['i11-uso'] ?? 'int') === 'pub';

  const ficha = [
    `<b>Base indicada</b> — ${d.base}`,
    `<b>Universo que ela cobre</b> — ${d.uni}`,
    `<b>Cadência e defasagem</b> — ${d.def}`,
    `<b>Armadilha específica</b> — ${d.arm}`,
    `<b>Forma de citação</b> — ${d.cit}`,
  ].join('<br>');
  const uso = pub
    ? '<b>Uso em material publicado — três exigências adicionais.</b> Primeira: registre universo, data-base e data de consulta junto ao número, no próprio material, e não em documento separado. Segunda: se a série for preliminar ou operativa, diga isso explicitamente — publicar dado conjuntural como fechamento é o erro mais fácil de cometer e o mais difícil de desfazer. Terceira: se o assunto envolver processo administrativo em curso, descreva o estágio do processo e nunca o desfecho. A trava de dados verificados existe para o material publicado, e não para a análise interna, justamente porque só o publicado é oponível a você.'
    : '<b>Uso em análise interna.</b> Aqui a exigência é menor em forma e igual em substância: você pode trabalhar com dado preliminar e com estimativa, desde que o recorte esteja anotado. A regra prática que evita retrabalho é anotar o recorte no momento da coleta, e não no momento da publicação — recorte reconstruído de memória semanas depois é a origem mais comum de erro em relatório.';

  return { valores: {}, veredito: `${ficha}<br><br>${uso}` };
}

// ── Módulo 08 · INST 01 — Mapa físico (LYCEUM Wave 38) ──
//
// PORTADO do `i1render()`. Instrumento de MÓDULO (§ MAP), não de aula.
// O SVG e as setas de corredor são desenho; o painel de cada nó é o
// conteúdo. No fluxo 'amb' a fonte concatena os dois textos com os
// rótulos "Geração." e "Escoamento." — preservado literal.
function i1renderM08(i: Record<string, EntradaInstrumento>): ResultadoInstrumento {
  const cur = String(i['i1-cur'] ?? 'ger');
  const idBruto = String(i['i1-sel'] ?? 'exp');
  const no = M08_INST01_NOS.find((x) => x.id === idBruto) ?? M08_INST01_NOS.find((x) => x.id === 'exp') ?? M08_INST01_NOS[0];
  const txt = cur === 'ger'
    ? no.ger
    : cur === 'esc'
      ? no.esc
      : `<b>Geração.</b> ${no.ger}<br><br><b>Escoamento.</b> ${no.esc}`;
  const fluxo = cur === 'ger'
    ? 'Geração — onde o recurso está'
    : cur === 'esc'
      ? 'Escoamento — por onde a energia sai'
      : 'Os dois sobrepostos';
  return {
    valores: {},
    veredito: `<b>${no.nome}</b> · ${no.sub}<br><br>${txt}<br><br><b>Fluxo em exibição</b> — ${fluxo}`,
  };
}

// ── Módulo 06 · INST 01 — Linha do tempo (LYCEUM Wave 38) ──
//
// PORTADO do bloco `INST 01 — LINHA DO TEMPO`. Instrumento de MÓDULO
// (§ MAP). O `sel()` da fonte é `clamp(i, 0, N-1)` — grampo reproduzido.
// O painel da fonte escreve com `textContent`, então o conteúdo é texto
// puro; os únicos `<b>` aqui são os rótulos que a porta acrescenta,
// mesmo idioma dos outros exploradores desta wave.
function m06i1M08(i: Record<string, EntradaInstrumento>): ResultadoInstrumento {
  const bruto = Number(i['m06-i1-sel'] ?? 0);
  const n = M06_INST01_MARCOS.length;
  const k = Number.isFinite(bruto) ? Math.min(Math.max(Math.trunc(bruto), 0), n - 1) : 0;
  const m = M06_INST01_MARCOS[k];
  return {
    valores: {},
    veredito: `<b>${m.ano}</b> · ${m.titulo}<br><br>${m.corpo}<br><br><b>O que ficou</b> — ${m.legado}`,
  };
}

// ── Módulo 07 · INST 01 — Mapa institucional (LYCEUM Wave 38) ──
//
// PORTADO do bloco `INST 01 — MAPA INSTITUCIONAL`. Instrumento de
// MÓDULO (§ MAP). A ficha do órgão vem do `panel(k,t,b,r,l)` da fonte:
// kicker, título, corpo, linhas chave/valor e leitura.
//
// O fluxo NÃO altera a ficha — na fonte ele só redesenha o SVG e troca
// a legenda. A legenda porta; o SVG não. Confirmado por leitura do
// `show()`, que ignora `flow`.
function m07i1M08(i: Record<string, EntradaInstrumento>): ResultadoInstrumento {
  const idBruto = String(i['m07-i1-sel'] ?? 'cnpe');
  const o = M07_INST01_ORGAOS.find((x) => x.id === idBruto) ?? M07_INST01_ORGAOS[0];
  const flowBruto = String(i['m07-i1-flow'] ?? 'aut');
  const flow = M07_INST01_LEGENDAS[flowBruto] ? flowBruto : 'aut';

  const ficha = o.linhas.map(([k, v]) => `<b>${k}</b> — ${v}`).join('<br>');
  const partes = [`<b>${o.kicker}</b>`, `<b>${o.titulo}</b>`];
  if (o.corpo) partes.push(o.corpo);
  if (ficha) partes.push(ficha);
  if (o.leitura) partes.push(`<b>Leitura</b> — ${o.leitura}`);
  partes.push(`<b>Fluxo em exibição</b> — ${M07_INST01_LEGENDAS[flow]}`);
  return { valores: {}, veredito: partes.join('<br><br>') };
}


import {
  MODULO_10_LENTES,
  MODULO_10_LINHAS_FATURA,
  MODULO_10_PERFIS_CARGA,
  MODULO_10_ELEGIBILIDADE,
  MODULO_10_SUBGRUPOS,
  MODULO_10_CELULAS_MODALIDADE,
  MODULO_10_ENCARGOS,
  MODULO_10_ETAPAS_CICLO,
  MODULO_10_BLOCOS_FATURA,
  MODULO_10_VIESES_COMPOSICAO,
  MODULO_10_PASSOS_LEITURA,
  MODULO_10_ACHADOS,
  MODULO_10_FAIXAS_DEMANDA,
  MODULO_10_FAIXAS_ULTRAPASSAGEM,
  MODULO_10_FAIXAS_DESLOCAMENTO,
  MODULO_10_FAIXAS_REATIVO,
} from './alexandria-modulo-10-content';


// ══════════════════════════════════════════════════════════════════
// MÓDULO 10 — Tarifas e a Conta de Luz Industrial (LYCEUM Wave 41)
//
// Portados do `<script>` de `alexandria_modulo10.html`, nunca
// rederivados do enunciado. Os onze são namespaçados `m10-inst-NN`
// pela mesma razão das waves anteriores: a fonte numera instrumento
// por módulo, reiniciando do 01.
//
// Os helpers do original, replicados aqui com o mesmo comportamento:
//   numOf(el, def, a, b) → `nOu10` — valor vazio ou NaN vira o DEFAULT
//                          (não zero), e depois é preso em [a,b].
//   fmt(n, d)            → `fm10`  — pt-BR, `—` para NaN/Infinity.
//
// SINALIZADO, não corrigido: o original de vários instrumentos ESCREVE
// de volta no campo do usuário quando o valor sai da faixa
// (`$id('dl-pta').value=pta`). Função pura não faz isso; o clamp é
// aplicado ao valor calculado e o campo do aluno fica como ele
// digitou. O resultado numérico é idêntico.
// ══════════════════════════════════════════════════════════════════

/** `numOf` do original: NaN vira o default declarado, depois clamp. */
const nOu10 = (v: EntradaInstrumento | undefined, def: number, a: number, b: number): number => {
  if (v === undefined || v === '') return def;
  const x = typeof v === 'number' ? v : parseFloat(String(v).replace(',', '.'));
  if (Number.isNaN(x)) return def;
  return x < a ? a : x > b ? b : x;
};

/** `fmt` do original — pt-BR com casas fixas. */
const fm10 = (x: number, d = 0): string =>
  !Number.isFinite(x) ? '—' : x.toLocaleString('pt-BR', { minimumFractionDigits: d, maximumFractionDigits: d });

const s10 = (v: EntradaInstrumento | undefined, def: string): string =>
  v === undefined || v === '' ? def : String(v);

/** Os quatro campos fixos que o original imprime em `.ocard` abaixo do
 *  veredito. Aqui entram no próprio veredito, porque
 *  `ResultadoInstrumento` não tem slot para painel lateral. */
type Faixa10 = { readonly t: string; readonly sig: string; readonly causa: string; readonly ctrl: string; readonly falta: string };
const detalhe10 = (F: Faixa10): string =>
  `<br><br><b>O que este resultado significa.</b> ${F.sig}` +
  `<br><br><b>O que costuma causá-lo.</b> ${F.causa}` +
  `<br><br><b>O que a empresa controla.</b> ${F.ctrl}` +
  `<br><br><b>O que ainda falta saber.</b> ${F.falta}`;

// ── m10 INST 01 · Mapa da fatura — três lentes ────────────
// Consulta pura: lente × linha → texto. Sem número a devolver.
const i1m10: CalculateFn = (i) => {
  const lente = s10(i['mf-seg'], 'unit') as 'unit' | 'qtd' | 'ciclo';
  const linhaId = s10(i['mf-linha'], MODULO_10_LINHAS_FATURA[0].id);
  const L = MODULO_10_LINHAS_FATURA.find((x) => x.id === linhaId) ?? MODULO_10_LINHAS_FATURA[0];
  const LE = MODULO_10_LENTES[lente];
  const outras = (['unit', 'qtd', 'ciclo'] as const)
    .filter((k) => k !== lente)
    .map((k) => `<b>${MODULO_10_LENTES[k].t}:</b> ${L[k].replace(/<[^>]+>/g, '')}`)
    .join('<br>');
  return {
    valores: {},
    veredito:
      `<b>${LE.t}.</b> ${LE.d}` +
      `<br><br><b>${L.c} · ${L.n}.</b> ${L[lente]}` +
      `<br><br><b>As outras duas lentes.</b><br>${outras}`,
  };
};

// ── m10 INST 02 · Comparador de modalidades ───────────────
// Três seleções → elegibilidade + célula por linha. Zero número.
const i2m10: CalculateFn = (i) => {
  const perf = s10(i['cm-perf'], 'plana') as keyof typeof MODULO_10_PERFIS_CARGA;
  const mod = s10(i['cm-mod'], 'azul') as 'azul' | 'verde' | 'conv';
  const sg = s10(i['cm-sg'], 'a4') as keyof typeof MODULO_10_ELEGIBILIDADE;

  const cel = MODULO_10_CELULAS_MODALIDADE[`${mod}|${perf}` as keyof typeof MODULO_10_CELULAS_MODALIDADE];
  const elegivel = (MODULO_10_ELEGIBILIDADE[sg] as readonly string[]).includes(mod);
  const nomeSg = MODULO_10_SUBGRUPOS[sg];

  // Três cabeças distintas no original, nesta ordem de precedência.
  const cabeca = mod === 'conv'
    ? '<b>Não é opção ordinária de enquadramento.</b> A modalidade convencional binômia não figura na relação vigente de modalidades disponíveis ao grupo A. Subsiste como estrutura no arcabouço metodológico tarifário e em situações contratuais específicas, e por isso não entra na comparação entre alternativas contratáveis.'
    : !elegivel
      ? `<b>Modalidade indisponível ao subgrupo ${nomeSg}.</b> A modalidade de demanda única é disponível apenas aos subgrupos A3a, A4 e AS. Simular esta modalidade para o subgrupo ${nomeSg} é erro de elegibilidade, não de premissa — e é verificável no cadastro da própria fatura antes de qualquer cálculo.`
      : `<b>Modalidade elegível ao subgrupo ${nomeSg}.</b> Perfil considerado: ${MODULO_10_PERFIS_CARGA[perf]}. As direções abaixo são estruturais e derivam da forma de cobrança; a magnitude depende das tarifas homologadas da concessionária e do perfil medido real.`;

  return {
    valores: {},
    veredito:
      cabeca +
      `<br><br><b>Direção estrutural.</b> ${cel.dir}` +
      `<br><br><b>Linhas que mudariam.</b> ${cel.linhas}` +
      `<br><br><b>Risco dominante.</b> ${cel.risco}` +
      `<br><br><b>O que falta para concluir.</b> ${cel.falta}` +
      '<br><br><b>O que este instrumento não devolve.</b> Valor de economia, percentual de redução ou qualquer conclusão financeira. Sem doze meses de medição e sem as tarifas homologadas da concessionária específica, qualquer número seria estimativa apresentada como resultado.',
  };
};

// ── m10 INST 03 · Dimensionador de demanda ────────────────
// Original: util = max/ctr·100 · fc = med/max·100 · lim = ctr·(1+tol/100)
//           folga = lim − max. Faixa escolhida por `util`.
const i3m10: CalculateFn = (i) => {
  const ctr = nOu10(i['dd-ctr'], 1200, 10, 20000);
  const max = nOu10(i['dd-max'], 1010, 10, 20000);
  const med = nOu10(i['dd-med'], 720, 1, 20000);
  const mes = nOu10(i['dd-mes'], 12, 1, 36);
  const tol = nOu10(i['dd-tol'], 5, 0, 20);

  const util = ctr > 0 ? (max / ctr) * 100 : 0;
  const fc = max > 0 ? (med / max) * 100 : 0;
  const lim = ctr * (1 + tol / 100);
  const folga = lim - max;

  const F = MODULO_10_FAIXAS_DEMANDA.find((f) => util <= f.max)
    ?? MODULO_10_FAIXAS_DEMANDA[MODULO_10_FAIXAS_DEMANDA.length - 1];

  let hist = '';
  if (mes < 6) {
    hist = ` <b>Atenção ao histórico:</b> com ${fm10(mes)} mes${mes === 1 ? '' : 'es'} de série, nenhum diagnóstico de dimensionamento é concluível. A faixa acima descreve o que se vê, não o que se pode afirmar.`;
  } else if (mes < 12) {
    hist = ` <b>Histórico parcial:</b> ${fm10(mes)} meses não cobrem um ciclo anual completo. Sazonalidade, parada programada e retomada após interrupção podem estar fora da janela observada.`;
  }

  let zona = '';
  if (util > 80 && util <= 95 && mes >= 12) {
    zona = '<br><br><b>Zona de decisão de risco.</b> Esta é a faixa em que a resposta correta frequentemente é <b>depende do plano de produção</b>. A série histórica sozinha não distingue um contrato bem calibrado de um contrato que ficará apertado com a expansão do ano seguinte. Sem o plano, o instrumento descreve; ele não recomenda.';
  }
  if (mes < 12) {
    zona = '<br><br><b>Não é possível concluir.</b> Com menos de doze meses, a distinção entre folga estrutural e mês atípico não é possível. Em muitas operações industriais, o mês atípico é justamente o que define o contrato — retomada após interrupção, teste de carga, coincidência de partidas. A saída correta aqui é a lista do que falta, não um número recomendado.';
  }

  return {
    valores: { 'dd-util': util, 'dd-fc': fc, 'dd-lim': lim, 'dd-folga': folga },
    veredito:
      `<b>${F.t}.</b> Utilização do contrato em ${fm10(util, 1)}%, com fator de carga aparente de ${fm10(fc, 1)}%.${hist}` +
      detalhe10(F) + zona,
  };
};

// ── m10 INST 04 · Simulador de ultrapassagem ──────────────
// A base da parcela é (medida − CONTRATADA), não o excedente acima da
// tolerância — é a não linearidade que a aula existe para corrigir.
const i4m10: CalculateFn = (i) => {
  const ctr = nOu10(i['ul-ctr'], 1000, 10, 20000);
  const med = nOu10(i['ul-med'], 1060, 10, 20000);
  const tol = nOu10(i['ul-tol'], 5, 0, 20);
  const mul = nOu10(i['ul-mul'], 2, 1, 4);
  const tar = nOu10(i['ul-tar'], 40, 1, 300);

  const lim = ctr * (1 + tol / 100);
  const disparou = med > lim;
  const base = disparou ? med - ctr : 0;
  const normal = ctr * tar;
  const pen = base * mul * tar;
  const total = normal + pen;
  const peso = total > 0 ? (pen / total) * 100 : 0;
  const exc = ctr > 0 ? (med / ctr - 1) * 100 : 0;

  // Original: sem disparo, margem>2 → faixa 0, senão faixa 1;
  //           com disparo, exc<=15 → faixa 2, senão faixa 3.
  const margem = ((lim - med) / ctr) * 100;
  const F = !disparou
    ? (margem > 2 ? MODULO_10_FAIXAS_ULTRAPASSAGEM[0] : MODULO_10_FAIXAS_ULTRAPASSAGEM[1])
    : (exc <= 15 ? MODULO_10_FAIXAS_ULTRAPASSAGEM[2] : MODULO_10_FAIXAS_ULTRAPASSAGEM[3]);

  const cabeca = disparou
    ? `<b>${F.t}.</b> A medição de ${fm10(med)} kW superou o limite de disparo de ${fm10(lim)} kW. A base da parcela é <b>${fm10(base)} kW</b> — a diferença entre medida e contratada, e não os ${fm10(med - lim)} kW acima da tolerância. Essa é a distinção que material comercial mais frequentemente inverte.`
    : `<b>${F.t}.</b> A medição de ${fm10(med)} kW ficou abaixo do limite de disparo de ${fm10(lim)} kW. Nenhuma parcela de ultrapassagem é gerada neste ciclo. Margem disponível: ${fm10(lim - med)} kW.`;

  return {
    valores: { 'ul-lim': lim, 'ul-base': base, 'ul-norm': normal, 'ul-pen': pen, 'ul-peso': peso },
    veredito:
      cabeca + detalhe10(F) +
      '<br><br><b>Parâmetros que você precisa confirmar.</b> Tolerância e multiplicador são parâmetros normativos e vêm aqui como entrada editável por decisão de projeto. A tolerância difere conforme a natureza da demanda contratada, e há material em circulação reproduzindo multiplicador de redação anterior à consolidação de 2021. Confirme no texto compilado vigente e no contrato de uso da unidade antes de qualquer uso externo.',
  };
};

// ── m10 INST 05 · Deslocador de carga entre postos ────────
// O original PRENDE `pta` em `tot` reescrevendo o campo; aqui o clamp
// é aplicado ao valor calculado (ver nota do cabeçalho).
const i5m10: CalculateFn = (i) => {
  const tot = nOu10(i['dl-tot'], 420, 1, 20000);
  const ptaBruto = nOu10(i['dl-pta'], 42, 0, 20000);
  const des = nOu10(i['dl-des'], 30, 0, 100);
  const hrs = nOu10(i['dl-hrs'], 63, 1, 200);

  const pta = ptaBruto > tot ? tot : ptaBruto;
  const p0 = tot > 0 ? (pta / tot) * 100 : 0;
  const vol = (pta * des) / 100;
  const pta1 = pta - vol;
  const p1 = tot > 0 ? (pta1 / tot) * 100 : 0;
  const pot = hrs > 0 ? (pta * 1000) / hrs : 0;

  const F = MODULO_10_FAIXAS_DESLOCAMENTO.find((f) => p0 <= f.max)
    ?? MODULO_10_FAIXAS_DESLOCAMENTO[MODULO_10_FAIXAS_DESLOCAMENTO.length - 1];

  return {
    valores: { 'dl-p0': p0, 'dl-p1': p1, 'dl-vol': vol, 'dl-pot': pot },
    veredito:
      `<b>${F.t}.</b> A ponta representa ${fm10(p0, 1)}% do consumo do ciclo. Deslocando ${fm10(des)}% desse volume, a participação cairia para ${fm10(p1, 1)}%, com <b>${fm10(vol, 1)} MWh</b> transferidos para fora da janela. A potência média demandada dentro da janela é de aproximadamente ${fm10(pot)} kW — número que não deve ser confundido com a demanda máxima registrada no posto.` +
      detalhe10(F) +
      '<br><br><b>Por que não há valor em dinheiro aqui.</b> Converter volume deslocado em valor exigiria a diferença entre as tarifas de energia dos dois postos na concessionária específica, e, na modalidade que separa demanda por posto, também o efeito sobre a demanda de ponta. Nenhuma dessas informações está na fatura sozinha. O volume é o que o instrumento pode afirmar; o valor é o que o processo tarifário determina.',
  };
};

// ── m10 INST 06 · Apurador de excedente reativo ───────────
// Duas janelas com sentidos opostos: indutiva de dia, capacitiva de
// noite. A chave do diagnóstico é combinatória, não numérica.
const i6m10: CalculateFn = (i) => {
  const ref = nOu10(i['fp-ref'], 0.92, 0.5, 1);
  const ind = nOu10(i['fp-ind'], 0.87, 0.3, 1);
  const cap = nOu10(i['fp-cap'], 0.95, 0.3, 1);
  const hrs = nOu10(i['fp-hrs'], 6, 1, 10);

  const totNoite = hrs * 30;
  const totDia = (24 - hrs) * 30;
  const vdi = Math.min(nOu10(i['fp-vd1'], 180, 0, 600), Math.round(totDia));
  const vno = Math.min(nOu10(i['fp-vn1'], 0, 0, 200), Math.round(totNoite));

  const pd = totDia > 0 ? (vdi / totDia) * 100 : 0;
  const pn = totNoite > 0 ? (vno / totNoite) * 100 : 0;
  const dd = ref - ind;
  const dn = ref - cap;

  const temInd = vdi > 0 && ind < ref;
  const temCap = vno > 0 && cap < ref;
  const chave = temInd && temCap ? 'ambas' : temCap ? 'cap' : temInd ? (pd > 25 ? 'ind-estr' : 'ind-pont') : 'limpo';
  const F = MODULO_10_FAIXAS_REATIVO.find((f) => f.k === chave) ?? MODULO_10_FAIXAS_REATIVO[0];

  let nota = '';
  if (vdi > 0 && ind >= ref) {
    nota = ' <b>Inconsistência de entrada:</b> foram informados intervalos em violação na janela indutiva, mas o fator típico informado está dentro da referência. Verifique se a violação ocorre em intervalos específicos que a média não representa — o que é comum e é justamente por isso que a apuração é por intervalo.';
  }
  if (vno > 0 && cap >= ref) {
    nota += ' <b>Inconsistência de entrada:</b> foram informados intervalos em violação na janela capacitiva com fator típico dentro da referência. O mesmo raciocínio se aplica: a média mensal esconde violação por intervalo.';
  }

  return {
    valores: { 'fp-pd': pd, 'fp-pn': pn, 'fp-dd': dd, 'fp-dn': dn },
    veredito:
      `<b>${F.t}.</b> ${fm10(pd, 1)}% dos intervalos da janela indutiva e ${fm10(pn, 1)}% dos intervalos da janela capacitiva foram informados como em violação, considerando janela noturna de ${fm10(hrs)} horas e referência de ${fm10(ref, 2)}.${nota}` +
      detalhe10(F) +
      '<br><br><b>Onde a fatura para de servir.</b> A fatura prova que houve cobrança; ela não prova qual banco instalar, em que ponto, com quantos estágios nem com que proteção. Entre o achado e a solução existe um estudo elétrico com medição de qualidade de energia, inventário de cargas e verificação de risco de ressonância, conduzido por profissional habilitado. Este instrumento caracteriza o problema — ele não dimensiona a solução.',
  };
};

// ── m10 INST 07 · Anatomia dos encargos ───────────────────
// Consulta pura sobre os onze itens, com os quatro campos fixos.
const i7m10: CalculateFn = (i) => {
  const sel = s10(i['en-sel'], MODULO_10_ENCARGOS[0].id);
  const E = MODULO_10_ENCARGOS.find((x) => x.id === sel) ?? MODULO_10_ENCARGOS[0];
  return {
    valores: {},
    veredito:
      `<b>${E.tag} · ${E.n}.</b>` +
      `<br><br><b>O que financia.</b> ${E.fin}` +
      `<br><br><b>Quem paga.</b> ${E.paga}` +
      `<br><br><b>Como aparece na fatura.</b> ${E.fat}` +
      `<br><br><b>O que mudou ou pode mudar.</b> ${E.mud}`,
  };
};

// ── m10 INST 08 · Régua do ciclo tarifário ────────────────
// Na fonte o mesmo chip seleciona E marca (segundo clique alterna
// "verificada"). Aqui são dois controles: um select de foco e oito
// chaves independentes — o primitivo que o painel renderiza. Mesmo
// tratamento que a Wave 38 deu ao grid de seleção do Módulo 08.
const i8m10: CalculateFn = (i) => {
  const sel = s10(i['rc-sel'], MODULO_10_ETAPAS_CICLO[0].id);
  const E = MODULO_10_ETAPAS_CICLO.find((x) => x.id === sel) ?? MODULO_10_ETAPAS_CICLO[0];
  const nVer = MODULO_10_ETAPAS_CICLO.filter((x) => s10(i[`rc-v-${x.id}`], 'nao') === 'sim').length;
  const total = MODULO_10_ETAPAS_CICLO.length;

  const estado = nVer === 0 ? 'Dossiê não iniciado'
    : nVer < 4 ? 'Dossiê parcial'
    : nVer < 8 ? 'Dossiê em construção'
    : 'Dossiê completo';

  const veredito = nVer === 0
    ? '<b>Nenhuma etapa verificada.</b> Sem o dossiê do ciclo tarifário da concessionária, qualquer comparação entre dois períodos atribui a decisões da empresa efeitos que podem ter sido do calendário.'
    : nVer < 4
      ? `<b>Dossiê parcial — ${fm10(nVer)} de ${total}.</b> Ainda não é possível decompor variação entre efeito preço e efeito quantidade com segurança. As etapas de estrutura, homologação e aplicação são as que mais frequentemente explicam variação inesperada.`
      : nVer < 8
        ? `<b>Dossiê em construção — ${fm10(nVer)} de ${total}.</b> Já há base para explicar parte da variação. Verifique especialmente se a etapa de definição de estrutura foi coberta: é nela que o intervalo de ponta pode ter mudado, e essa mudança invalida silenciosamente qualquer simulação de deslocamento.`
        : '<b>Dossiê completo.</b> Com as oito etapas verificadas, uma comparação de doze meses pode declarar o que mudou no meio, componente a componente. Este é o estado mínimo para que um relatório atribua corretamente cada parcela de variação a preço, a quantidade ou a calendário.';

  return {
    valores: { 'rc-cnt': nVer },
    veredito:
      `${veredito}<br><br><b>Situação do dossiê:</b> ${estado}.` +
      `<br><br><b>${E.et} · ${E.n}.</b>` +
      `<br><br><b>O que acontece.</b> ${E.oq}` +
      `<br><br><b>Quem decide.</b> ${E.quem}` +
      `<br><br><b>O que pode surpreender.</b> ${E.surp}` +
      `<br><br><b>O que arquivar.</b> ${E.arq}`,
  };
};

// ── m10 INST 09 · Reconstrutor de fatura ──────────────────
// NÃO é o Reconstrutor de matriz do Módulo 08: aqui os DOIS vetores
// vêm do usuário, não há referência no código nem tolerância, e o
// original calcula a cada input desde o load. Por isso não leva
// `correcaoSobDemanda` e o kind é `comparador`.
const i9m10: CalculateFn = (i) => {
  const est: number[] = [];
  const real: number[] = [];
  for (let k = 1; k <= 6; k += 1) {
    est.push(nOu10(i[`rb-e${k}`], 0, 0, 100));
    real.push(nOu10(i[`rb-r${k}`], 0, 0, 100));
  }
  const se = est.reduce((a, b) => a + b, 0);
  const sr = real.reduce((a, b) => a + b, 0);

  let errTot = 0;
  let maiorV = 0;
  let maiorI = 0;
  const linhas: string[] = [];
  for (let k = 0; k < 6; k += 1) {
    const d = est[k] - real[k];
    errTot += Math.abs(d);
    if (Math.abs(d) > Math.abs(maiorV)) { maiorV = d; maiorI = k; }
    linhas.push(`${MODULO_10_BLOCOS_FATURA[k]}: ${d > 0 ? '+' : ''}${fm10(d)} p.p.`);
  }

  // Chave de diagnóstico, ramo por ramo como no original.
  let chave: keyof typeof MODULO_10_VIESES_COMPOSICAO = 'equilibrado';
  if (Math.abs(maiorV) >= 6) {
    if (maiorI === 0 && maiorV > 0) chave = 'energia';
    else if (maiorI === 2 && maiorV < 0) chave = 'demanda';
    else if (maiorI === 1) chave = 'rede';
    else if (maiorI === 4) chave = 'tributos';
    else if (maiorI === 0 && maiorV < 0) chave = 'rede';
    else if (maiorI === 2 && maiorV > 0) chave = 'demanda';
    else chave = 'equilibrado';
  }
  const D = MODULO_10_VIESES_COMPOSICAO[chave];

  let somaAviso = '';
  if (Math.abs(se - 100) > 2 || Math.abs(sr - 100) > 2) {
    somaAviso = ` <b>Atenção às somas:</b> a estimativa soma ${fm10(se)}% e o real soma ${fm10(sr)}%. Enquanto as duas não fecharem próximo de cem, o erro por bloco mistura distorção de composição com distorção de escala, e o diagnóstico de viés fica contaminado.`;
  }

  return {
    valores: { 'rb-se': se, 'rb-sr': sr, 'rb-err': errTot },
    veredito:
      `<b>${D.t}.</b> Erro absoluto total de ${fm10(errTot)} pontos percentuais, com o maior desvio em <b>${MODULO_10_BLOCOS_FATURA[maiorI]}</b> (${maiorV > 0 ? '+' : ''}${fm10(maiorV)} p.p.).${somaAviso}` +
      `<br><br><b>Erro por bloco.</b> ${linhas.join(' · ')}` +
      `<br><br><b>O que este padrão significa.</b> ${D.sig}` +
      `<br><br><b>O efeito prático do viés.</b> ${D.efeito}` +
      `<br><br><b>Como se corrige.</b> ${D.ctrl}` +
      `<br><br><b>O que ainda falta.</b> ${D.falta}`,
  };
};

// ── m10 INST 10 · Ordem de leitura cronometrada ───────────
// Nove passos, cada um com tempo declarado. Mesmo desdobramento em
// foco + chaves do INST 08.
const i10m10: CalculateFn = (i) => {
  const sel = s10(i['ol-sel'], MODULO_10_PASSOS_LEITURA[0].id);
  const P = MODULO_10_PASSOS_LEITURA.find((x) => x.id === sel) ?? MODULO_10_PASSOS_LEITURA[0];
  const feitos = MODULO_10_PASSOS_LEITURA.filter((x) => s10(i[`ol-f-${x.id}`], 'nao') === 'sim');
  const nFeitos = feitos.length;
  const tempo = feitos.reduce((a, x) => a + x.t, 0);

  const estado = nFeitos === 0 ? 'Não iniciada'
    : nFeitos < 3 ? 'Triagem incompleta'
    : nFeitos < 7 ? 'Leitura parcial'
    : nFeitos < 9 ? 'Quase completa'
    : 'Leitura completa';

  const veredito = nFeitos === 0
    ? '<b>Leitura não iniciada.</b> A ordem importa mais do que a completude: o erro que custa caro não é a linha esquecida, é a ordem errada, porque ela faz perder o achado que tornaria os demais irrelevantes.'
    : nFeitos < 3
      ? `<b>Triagem incompleta — ${fm10(nFeitos)} de 9.</b> Os três primeiros passos consomem menos de um minuto e meio somados e respondem à maior parte das perguntas de triagem. Cadastro antes de valores, período antes de comparação: essa é a regra que organiza a sequência inteira.`
      : nFeitos < 7
        ? `<b>Leitura parcial — ${fm10(nFeitos)} de 9, com ${fm10(Math.floor(tempo / 60))} min ${fm10(tempo % 60)} s acumulados.</b> As hipóteses já estão levantadas. Falta a camada de verificação: reconciliação de uma linha e composição tributária são o que distingue hipótese de achado.`
        : nFeitos < 9
          ? `<b>Quase completa — ${fm10(nFeitos)} de 9.</b> Falta o passo que nunca pode ser pulado: o inventário do que não está na fatura.`
          : `<b>Leitura completa — nove de nove, em ${fm10(Math.floor(tempo / 60))} min ${fm10(tempo % 60)} s.</b> A sequência inteira foi percorrida na ordem.`;

  return {
    valores: { 'ol-cnt': nFeitos, 'ol-tempo': tempo },
    veredito:
      `${veredito}<br><br><b>Estado da leitura:</b> ${estado}.` +
      `<br><br><b>${P.n} — ${P.t} s.</b>` +
      `<br><br><b>O que olhar.</b> ${P.olh}` +
      `<br><br><b>Critério de parada.</b> ${P.par}` +
      `<br><br><b>Achado que muda tudo.</b> ${P.irr}` +
      `<br><br><b>O que registrar.</b> ${P.reg}`,
  };
};

// ── m10 INST 11 · Roteador de diagnóstico ─────────────────
// Três seleções pontuam o material disponível (score 0-8) e a quarta
// nomeia o achado. O veredito cruza os dois.
const i11m10: CalculateFn = (i) => {
  const h = s10(i['rt-hist'], 'uma');
  const m = s10(i['rt-mm'], 'nao');
  const p = s10(i['rt-plano'], 'nao');
  const a = s10(i['rt-ach'], 'enq') as keyof typeof MODULO_10_ACHADOS;
  const A = MODULO_10_ACHADOS[a];

  let s = 0;
  if (h === 'doze') s += 3; else if (h === 'seis') s += 1;
  if (m === 'sim') s += 3; else if (m === 'parcial') s += 1;
  if (p === 'estavel') s += 2; else if (p === 'mudanca') s += 1;

  const falta: string[] = [];
  if (h === 'uma') falta.push('doze meses de faturas consecutivas, com refaturamentos e ajustes preservados e vinculados ao período de origem');
  else if (h === 'seis') falta.push('os meses restantes para completar um ciclo anual, sem o qual sazonalidade e paradas programadas ficam fora da janela observada');
  if (m === 'nao') falta.push('a memória de massa por intervalo, que é o único registro capaz de mostrar quando e por quanto tempo cada pico ocorreu');
  else if (m === 'parcial') falta.push('a complementação da memória de massa nos períodos ausentes, com verificação de quebra de série por troca de medidor');
  if (p === 'nao') falta.push('o plano de produção com expansões, paradas programadas e mudanças de turno previstas');
  else if (p === 'mudanca') falta.push('o cronograma detalhado da mudança prevista, com potência e simultaneidade das cargas novas');
  falta.push('as tarifas homologadas da concessionária nos períodos analisados, com número e data da resolução de referência');
  if (a === 'fp') falta.push('medição de qualidade de energia, se houver carga não linear relevante na instalação');
  if (a === 'amb') falta.push('o custo entregue consolidado dos dois lados, no mesmo período e na mesma unidade de medida');

  let titulo: string;
  let corpo: string;
  if (a === 'nada' && s >= 6) {
    titulo = 'Não vale investigar nas condições informadas';
    corpo = 'Com histórico e medição disponíveis e nenhum achado observado na leitura, o material sustenta um <b>parecer de adequação</b>. Essa é a saída mais difícil de emitir e a mais valiosa comercialmente: quem só sabe encontrar problema não tem como ser acreditado quando encontra um. Registre a base sobre a qual a adequação foi afirmada e a data — adequação é afirmação sobre um momento, não sobre o futuro.';
  } else if (s >= 6) {
    titulo = 'Vale investigar';
    corpo = `O material disponível sustenta o avanço para análise completa sobre o achado <b>${A.n}</b>. Há histórico e medição suficientes para distinguir padrão estrutural de evento isolado, que é a condição mínima para qualquer conclusão dimensional.`;
  } else if (s >= 3) {
    titulo = 'Vale investigar, com ressalva de material';
    corpo = `O achado <b>${A.n}</b> justifica avançar, mas o material disponível ainda não sustenta conclusão dimensional. A saída honesta nesta condição é hipótese com lista do que falta, nunca número recomendado.`;
  } else {
    titulo = 'Material insuficiente para diagnóstico';
    corpo = `Não há base para afirmar nada sobre <b>${A.n}</b>. Com uma fatura isolada e sem memória de massa, qualquer número produzido seria extrapolação apresentada como medição.`;
  }

  return {
    valores: { 'rt-score': s },
    veredito:
      `<b>${titulo}.</b> ${corpo}` +
      `<br><br><b>Achado observado.</b> ${A.n}` +
      `<br><br><b>O que exige.</b> ${A.exige}` +
      `<br><br><b>O mínimo que já responde.</b> ${A.minimo}` +
      `<br><br><b>Sem os dados.</b> ${A.semDados}` +
      `<br><br><b>O que ainda falta.</b> ${falta.map((x) => `— ${x}`).join('<br>')}`,
  };
};

// ── Módulo 11 · instrumentos de lookup (LYCEUM Wave 43) ──
// O dado vive no arquivo de conteúdo — fonte de verdade única, mesma
// direção de import que MODULO_06_TRAUMA_CICATRIZ e M08_INST04_REF.
import {
  M11_MAPA_LENTES,
  M11_MAPA_ITENS,
  M11_SEPARADOR_EIXOS,
  M11_MARCOS,
  M11_SINAIS,
  M11_PASSOS,
  M11_E1,
  M11_E2,
  M11_E3,
  M11_E4,
  M11_MOD_ARRANJO,
  M11_ESCADA_FIOB,
} from './alexandria-modulo-11-content';

// ── Módulo 12 · dado do módulo (LYCEUM Wave 44) ──
// As tabelas vivem no arquivo de conteúdo — fonte única, importada dos
// dois lados. Mesma direção de MODULO_06_TRAUMA_CICATRIZ e MODULO_10_*.
import {
  MODULO_12_VETORES,
  MODULO_12_FRENTES,
  MODULO_12_NUMEROS,
  MODULO_12_MARCOS,
  MODULO_12_PARCEIROS,
  MODULO_12_INSTRUMENTOS_COMERCIAIS,
  MODULO_12_CLASSES_PRODUTO,
  MODULO_12_FRONTEIRA_INVENTARIO,
  MODULO_12_VERIFICACAO_INVENTARIO,
  MODULO_12_DADO_PRECURSOR,
  MODULO_12_CARBONO_DOMESTICO,
  MODULO_12_ITENS_MATURIDADE,
  MODULO_12_ENTIDADES,
  MODULO_12_CATEGORIAS_NOME,
  MODULO_12_MOVIMENTOS,
} from './alexandria-modulo-12-content';


// ══════════════════════════════════════════════════════════════════
// MÓDULO 12 — Geopolítica Energética do Brasil (LYCEUM Wave 44)
//
// Portados do `<script>` de `alexandria_modulo12.html`. Namespaçados
// `m12-inst-NN` pela mesma razão de sempre: a fonte numera instrumento
// por módulo, reiniciando do 01.
//
// Helpers replicados com o comportamento do original:
//   numOf(el, def, a, b) → `nOu12` — vazio ou NaN vira o DEFAULT, e só
//                          então é preso em [a,b].
//   fmt(n, d)            → `fm12`  — pt-BR, `—` para NaN/Infinity.
//   pc(v)                → `pc12`  — precisão VARIÁVEL por magnitude, um
//                          detalhe do INST 09 que existe para que
//                          participação de 0,005% não vire "0,0%".
// ══════════════════════════════════════════════════════════════════

const nOu12 = (v: EntradaInstrumento | undefined, def: number, a: number, b: number): number => {
  if (v === undefined || v === '') return def;
  const x = typeof v === 'number' ? v : parseFloat(String(v).replace(',', '.'));
  if (Number.isNaN(x)) return def;
  return x < a ? a : x > b ? b : x;
};

const fm12 = (x: number, d = 0): string =>
  !Number.isFinite(x) ? '—' : x.toLocaleString('pt-BR', { minimumFractionDigits: d, maximumFractionDigits: d });

const s12 = (v: EntradaInstrumento | undefined, def: string): string =>
  v === undefined || v === '' ? def : String(v);

/** `pc` do INST 09 — casas decimais conforme a magnitude. */
const pc12 = (v: number): string => {
  if (!Number.isFinite(v)) return '—';
  if (v === 0) return '0%';
  if (v < 0.01) return v.toFixed(4).replace('.', ',') + '%';
  if (v < 1) return v.toFixed(3).replace('.', ',') + '%';
  return v.toFixed(1).replace('.', ',') + '%';
};

const VETOR_NOME12: Record<string, string> = {
  cap: 'Capital', reg: 'Regulação e diplomacia', cad: 'Cadeia de valor',
};

// ── m12 INST 01 · Tabuleiro geopolítico ───────────────────────
// Vetor × frente → texto. Consulta pura.
const i1m12: CalculateFn = (i) => {
  const vet = s12(i['tb-seg'], 'cap') as 'cap' | 'reg' | 'cad';
  const fk = s12(i['tb-frente'], MODULO_12_FRENTES[0].k);
  const f = MODULO_12_FRENTES.find((x) => x.k === fk) ?? MODULO_12_FRENTES[0];
  const vl = VETOR_NOME12[vet];
  const pergunta = vet === 'cap'
    ? 'Qual é a moeda, a condicionalidade, o horizonte e a governança que acompanham esse capital?'
    : vet === 'reg'
      ? 'Isso é lei em vigor, lei sem regulamento, projeto em tramitação, ou compromisso sem força vinculante? E com que data?'
      : 'O Brasil está na etapa de recurso ou na etapa de transformação? E onde exatamente está o gargalo que impede o salto?';
  return {
    valores: {},
    veredito:
      `<b>Vetor ${vl.toLowerCase()}.</b> ${MODULO_12_VETORES[vet]}` +
      `<br><br><b>${f.n} pelo vetor ${vl.toLowerCase()}.</b> ${f[vet]}` +
      `<br><br><b>Pergunta de verificação.</b> ${pergunta}`,
  };
};

// ── m12 INST 02 · Separador de grandeza ───────────────────────
// Original: w = pe/100 · ag = w·el + (1−w)·ne · di = el − ag
//           de = ag − of · co = w·el.
const i2m12: CalculateFn = (i) => {
  const el = nOu12(i['sg-el'], 86.8, 0, 100);
  const pe = nOu12(i['sg-pe'], 19, 1, 100);
  const ne = nOu12(i['sg-ne'], 41, 0, 100);
  const of = nOu12(i['sg-of'], 50, 0, 100);

  const w = pe / 100;
  const ag = w * el + (1 - w) * ne;
  const di = el - ag;
  const de = ag - of;
  const co = w * el;
  const ad = Math.abs(de);

  const txt = ad <= 2
    ? `<b>Consistente.</b> A renovabilidade agregada implícita fica dentro de dois pontos percentuais do valor oficial que você informou. Isso significa que os três parâmetros de entrada descrevem a mesma economia que a estatística oficial descreve — e que a diferença de ${fm12(Math.abs(di), 1)} pontos entre matriz elétrica e matriz energética é real, não artefato de conta. É essa distância que precisa ser dita sempre que um percentual de renovabilidade for citado.`
    : ad <= 6
      ? `<b>Divergência moderada.</b> A agregada implícita está a ${fm12(ad, 1)} pontos do valor oficial informado. Antes de concluir qualquer coisa, verifique a fronteira contábil do peso da eletricidade: consumo final de eletricidade contra oferta interna de energia dá um número; oferta interna de energia elétrica contra oferta interna de energia total dá outro, porque a segunda inclui as perdas de transformação. Divergência dessa ordem quase sempre é escolha de fronteira, não erro de dado.`
      : `<b>Divergência alta.</b> A agregada implícita está a ${fm12(ad, 1)} pontos do valor oficial. Nessa faixa não se trata mais de fronteira contábil: pelo menos um dos três parâmetros não pertence à mesma base estatística dos outros — ano-base diferente, país diferente, ou grandeza trocada. A conduta correta não é ajustar o parâmetro até fechar: é <b>voltar à fonte de cada um dos três</b> e conferir ano-base e denominador antes de usar qualquer resultado.`;

  return {
    valores: { 'sg-ag': ag, 'sg-di': di, 'sg-de': de, 'sg-co': co },
    veredito: txt,
  };
};

// ── m12 INST 03 · Verificador de fonte de número ──────────────
const i3m12: CalculateFn = (i) => {
  const k = s12(i['vn-sel'], MODULO_12_NUMEROS[0].k);
  const o = MODULO_12_NUMEROS.find((x) => x.k === k) ?? MODULO_12_NUMEROS[0];
  return {
    valores: {},
    veredito:
      `<b>${o.n}.</b>` +
      `<br><br><b>Fonte provável.</b> ${o.f}` +
      `<br><br><b>O que a grandeza mede.</b> ${o.m}` +
      `<br><br><b>Erro típico de citação.</b> ${o.e}` +
      `<br><br><b>O que verificar antes de repetir.</b> ${o.v}`,
  };
};

// ── m12 INST 04 · Régua diplomático-regulatória ───────────────
const i4m12: CalculateFn = (i) => {
  const k = s12(i['rd-sel'], MODULO_12_MARCOS[0].k);
  const idx = Math.max(0, MODULO_12_MARCOS.findIndex((x) => x.k === k));
  const m = MODULO_12_MARCOS[idx];
  return {
    valores: {},
    veredito:
      `<b>${m.y} · marco ${idx + 1} de ${MODULO_12_MARCOS.length} — ${m.n}.</b>` +
      `<br><br><b>O que é.</b> ${m.o}` +
      `<br><br><b>Estado em 2 de agosto de 2026.</b> ${m.e}` +
      `<br><br><b>O que ainda falta.</b> ${m.f}`,
  };
};

// ── m12 INST 05 · Comparador de parceiros bilaterais ──────────
const i5m12: CalculateFn = (i) => {
  const p = s12(i['cb-par'], 'china') as keyof typeof MODULO_12_PARCEIROS;
  const v = s12(i['cb-vet'], 'cap') as 'cap' | 'reg' | 'cad';
  const C = MODULO_12_PARCEIROS[p];
  const d = C[v];
  const vl = VETOR_NOME12[v];
  return {
    valores: {},
    veredito:
      `<b>${C.n} pelo vetor ${vl.toLowerCase()}.</b> Troque o vetor mantendo o parceiro e observe que a leitura muda inteiramente. Nenhum parceiro é melhor em abstrato: a avaliação depende do vetor pelo qual se pergunta e do interesse de quem faz a pergunta — e dizer isso, numa conversa, é mais informativo do que qualquer ranking.` +
      `<br><br><b>Estrutura principal.</b> ${d.a}` +
      `<br><br><b>Segundo elemento.</b> ${d.b}` +
      `<br><br><b>Fricção ou ressalva.</b> ${d.c}` +
      `<br><br><b>Leitura operacional.</b> ${d.d}`,
  };
};

// ── m12 INST 06 · Roteador de instrumento comercial ───────────
// As quatro saídas do original são TEXTO (autoridade, prazo, controle
// judicial, reversibilidade) — vão no veredito, não em `valores`.
const i6m12: CalculateFn = (i) => {
  const ik = s12(i['rt-inst'], 'emerg') as keyof typeof MODULO_12_INSTRUMENTOS_COMERCIAIS;
  const pk = s12(i['rt-prod'], 'energia') as keyof typeof MODULO_12_CLASSES_PRODUTO;
  const d = MODULO_12_INSTRUMENTOS_COMERCIAIS[ik];
  const q = MODULO_12_CLASSES_PRODUTO[pk] as Record<string, string>;
  return {
    valores: {},
    veredito:
      `<b>${q.n} sob ${d.n.toLowerCase()}.</b> ${q[ik]}` +
      '<br><br>Antes de repetir qualquer alíquota: a incidência é definida por <b>código tarifário</b>, produto a produto, e a sobretaxa se <b>soma</b> à tarifa regular já aplicável. Um produto com 5% de tarifa regular sob uma sobretaxa de 25% passa a pagar 30%, não 25%.' +
      `<br><br><b>Autoridade.</b> ${d.aut}` +
      `<br><br><b>Prazo típico.</b> ${d.pra}` +
      `<br><br><b>Controle judicial.</b> ${d.jud}` +
      `<br><br><b>Reversibilidade.</b> ${d.rev}` +
      `<br><br><b>${d.n}.</b> ${d.nota}`,
  };
};

// ── m12 INST 07 · Prontidão de dado de carbono ────────────────
// Quatro eixos pontuados; a posição sai da soma dos TRÊS primeiros
// (o preço de carbono doméstico não entra na base, só no desconto).
const i7m12: CalculateFn = (i) => {
  const f = s12(i['pc-fr'], 'corp') as keyof typeof MODULO_12_FRONTEIRA_INVENTARIO;
  const v = s12(i['pc-vr'], 'nao') as keyof typeof MODULO_12_VERIFICACAO_INVENTARIO;
  const p = s12(i['pc-pr'], 'nao') as keyof typeof MODULO_12_DADO_PRECURSOR;
  const c = s12(i['pc-cd'], 'nao') as keyof typeof MODULO_12_CARBONO_DOMESTICO;
  const sf = MODULO_12_FRONTEIRA_INVENTARIO[f].s;
  const sv = MODULO_12_VERIFICACAO_INVENTARIO[v].s;
  const sp = MODULO_12_DADO_PRECURSOR[p].s;
  const sc = MODULO_12_CARBONO_DOMESTICO[c].s;
  const base = sf + sv + sp;

  const pos = sf === 0 ? 'Não atribuível a produto'
    : base >= 5 ? 'Defensável' : base >= 3 ? 'Parcial' : 'Frágil';
  const blq = sf === 0 ? 'Fronteira do inventário'
    : sv === 0 ? 'Ausência de verificação'
    : sp === 0 ? 'Ausência de dado de precursor'
    : sv === 1 ? 'Verificação apenas interna'
    : sp === 1 ? 'Cobertura parcial de precursor'
    : sf === 1 ? 'Fronteira pode ser insuficiente para o produto'
    : 'Nenhum eixo bloqueia o dado';
  const vpd = (sf === 0 || sp === 0) ? 'Alto — valor padrão provável'
    : sv === 0 ? 'Alto — dado sem verificação'
    : base >= 5 ? 'Baixo' : 'Moderado';
  const des = sc === 0 ? 'Indisponível — sem regime no país'
    : sc === 1 ? 'Indisponível hoje, previsível no futuro'
    : 'Potencialmente aplicável, sujeito a reconhecimento';

  const cabeca = sf === 0
    ? `<b>Bloqueio na fronteira, e nenhum outro eixo compensa.</b> ${MODULO_12_FRONTEIRA_INVENTARIO[f].d}`
    : base >= 5
      ? '<b>Dado defensável.</b> Os três eixos que compõem a base estão em posição que sustenta atribuição por produto diante de um comprador ou de uma autoridade de fronteira.'
      : base >= 3
        ? '<b>Posição parcial.</b> Há base, mas com lacuna identificável — e é ela que decide se o importador aceita o dado declarado ou aplica valor padrão.'
        : '<b>Posição frágil.</b> A combinação informada não sustenta atribuição por produto; o resultado provável é a aplicação de valor padrão, que costuma ser punitivo por construção.';

  return {
    valores: { 'pc-base': base },
    veredito:
      cabeca +
      `<br><br><b>Posição do dado.</b> ${pos}` +
      `<br><br><b>Eixo que bloqueia.</b> ${blq}` +
      `<br><br><b>Risco de valor padrão.</b> ${vpd}` +
      `<br><br><b>Desconto de carbono doméstico.</b> ${des}`,
  };
};

// ── m12 INST 08 · Régua de maturidade de projeto ──────────────
// Nove itens numa escala de TRÊS estados (0/1/2), máximo 18. Três
// deles são críticos (`crit`) e zerá-los bloqueia.
const i8m12: CalculateFn = (i) => {
  let pts = 0;
  let vin = 0;
  const blq: string[] = [];
  for (const o of MODULO_12_ITENS_MATURIDADE) {
    const v = Number(s12(i[`mp-e-${o.k}`], '0')) || 0;
    pts += v;
    if (v === 2) vin += 1;
    if ((o as { crit?: boolean }).crit && v === 0) blq.push(o.n);
  }
  const est = pts <= 3 ? 'Anúncio'
    : pts <= 7 ? 'Estudo'
    : pts <= 11 ? 'Desenvolvimento'
    : pts <= 15 ? 'Estruturação avançada'
    : 'Pronto para implantação';

  const foco = s12(i['mp-sel'], MODULO_12_ITENS_MATURIDADE[0].k);
  const F = MODULO_12_ITENS_MATURIDADE.find((x) => x.k === foco) ?? MODULO_12_ITENS_MATURIDADE[0];

  const cabeca = blq.length === 3
    ? '<b>Anúncio, não projeto.</b> Os três itens críticos — energia contratada, comprador contratado e decisão final de investimento — estão ausentes. Nessa configuração o que existe é intenção pública, e tratá-la como capacidade instalada futura é o erro que produz as somas de gigawatt anunciado que nunca se materializam.'
    : blq.length > 0
      ? `<b>${est}, com ${blq.length} bloqueio${blq.length > 1 ? 's' : ''} crítico${blq.length > 1 ? 's' : ''}.</b> Ausentes: ${blq.join(', ')}. Um item crítico em zero domina a leitura — o restante da pontuação descreve preparo, não compromisso.`
      : `<b>${est}.</b> Nenhum item crítico em zero. A pontuação de ${pts} em 18 descreve o quanto do projeto já está contratado em vez de planejado.`;

  return {
    valores: { 'mp-pts': pts, 'mp-vin': vin },
    veredito:
      cabeca +
      `<br><br><b>Itens vinculantes:</b> ${vin} de 9. <b>Bloqueios críticos:</b> ${blq.length === 0 ? 'nenhum' : `${blq.length} de 3`}.` +
      `<br><br><b>${F.n}.</b> ${(F as { nota?: string }).nota ?? 'Item sem nota na fonte.'}`,
  };
};

// ── m12 INST 09 · Razão reserva-produção ──────────────────────
// Ramo por ramo como no original, inclusive os dois casos-limite
// (entrada incoerente e produção nula) que vêm ANTES das faixas.
const i9m12: CalculateFn = (i) => {
  const rn = nOu12(i['rp-rn'], 21, 0.1, 200);
  const rm = nOu12(i['rp-rm'], 85, 1, 500);
  const pn = nOu12(i['rp-pn'], 0.02, 0, 500);
  const pm = nOu12(i['rp-pm'], 390, 1, 5000);

  const sr = (rn / rm) * 100;
  const sp = (pn / pm) * 100;
  const incons = rn > rm || pn > pm;
  const ra = sp > 0 ? sr / sp : Infinity;
  const anos = pn > 0 ? (rn * 1000) / pn : Infinity;

  let txt: string;
  if (incons) {
    txt = '<b>Entrada inconsistente.</b> ' +
      (rn > rm ? 'A reserva nacional informada é maior que a reserva mundial. ' : '') +
      (pn > pm ? 'A produção nacional informada é maior que a produção mundial. ' : '') +
      'O instrumento não corrige a entrada porque o objetivo é justamente esse: quando duas fontes diferentes são combinadas sem checagem de coerência, a aritmética continua funcionando e o resultado continua parecendo um número. Confira se os dois valores vêm da mesma metodologia e do mesmo ano-base antes de dividir um pelo outro.';
  } else if (pn === 0) {
    txt = '<b>Produção nacional nula: a assimetria é máxima e a razão é indefinida.</b> Este é o caso-limite que o módulo existe para nomear. Um país pode deter parcela relevante da reserva mundial de um mineral e produzir zero, e nessa situação a reserva não confere nenhuma posição de barganha — confere apenas a <b>possibilidade</b> de construir uma, ao custo e no prazo de uma cadeia industrial que ainda não existe. Reserva no subsolo não é oferta no mercado.';
  } else if (ra >= 100) {
    txt = `<b>Assimetria extrema: participação na reserva ${ra >= 1000 ? fm12(Math.round(ra)) : ra.toFixed(0)} vezes maior que na produção.</b> Este é aproximadamente o caso brasileiro em terras-raras nos valores de referência: parcela expressiva da reserva mundial e produção de ordem de grandeza desprezível. A leitura correta não é "o Brasil é uma potência mineral" nem "o Brasil não tem nada" — é que o país tem <b>dotação sem cadeia</b>. E o gargalo, na maioria dos minerais críticos, não está na mina: está na separação, no refino e na manufatura do componente final, etapas que exigem capital, escala, tecnologia e demanda contratada.`;
  } else if (ra >= 5) {
    txt = `<b>Assimetria alta.</b> A participação na reserva excede a participação na produção por fator de ${ra.toFixed(1).replace('.', ',')}. Há produção real, mas muito abaixo do que a dotação permitiria. Neste intervalo, a pergunta de política pública deixa de ser "como começar" e passa a ser "o que limita a expansão" — e as respostas típicas são licenciamento, infraestrutura de escoamento, capital e ausência de comprador de longo prazo, não ausência de recurso.`;
  } else if (ra >= 1.5) {
    txt = `<b>Assimetria moderada.</b> Fator de ${ra.toFixed(1).replace('.', ',')} entre reserva e produção. O país produz aquém da sua dotação, mas está no jogo. Neste intervalo, participação de mercado passa a ser objeto de negociação comercial e não apenas de política industrial, e a posição de barganha começa a existir de fato.`;
  } else if (ra >= 0.8) {
    txt = '<b>Participações proporcionais.</b> A parcela na produção corresponde aproximadamente à parcela na reserva. É a situação do Brasil em minério de ferro e, em outra ordem de grandeza, em nióbio — dotação convertida em cadeia. Vale notar que mesmo aqui a pergunta de valor agregado permanece aberta: produzir na proporção da reserva não significa capturar a etapa de maior margem.';
  } else {
    txt = `<b>Produção acima da parcela na reserva.</b> Fator de ${ra.toFixed(2).replace('.', ',')}. O país extrai proporcionalmente mais do que detém, o que pode indicar cadeia madura, custo competitivo ou depleção mais rápida do estoque conhecido. As três hipóteses exigem verificação separada, e nenhuma delas se resolve por esta razão isoladamente.`;
  }
  if (pn > 0) {
    txt += ` <br><br><b>Sobre "anos de reserva ao ritmo atual":</b> ${fm12(Math.round(anos))} anos é uma razão entre estoque e fluxo, não uma previsão. Números na casa das centenas de milhares não descrevem abundância eterna — descrevem produção quase nula em relação ao estoque, que é exatamente o mesmo fato que a razão de assimetria já mostrou, expresso em outra unidade.`;
  }

  return {
    // `rp-ra` e `rp-an` ficam fora quando indefinidos: Infinity não é
    // número exibível, e o veredito já diz "indefinida".
    valores: {
      'rp-pr': sr, 'rp-pp': sp,
      ...(Number.isFinite(ra) ? { 'rp-ra': ra } : {}),
      ...(Number.isFinite(anos) ? { 'rp-an': Math.round(anos) } : {}),
    },
    veredito: `${txt}<br><br><b>Participação na reserva:</b> ${pc12(sr)} · <b>na produção:</b> ${pc12(sp)}.`,
  };
};

// ── m12 INST 10 · Classificador de nome ───────────────────────
const i10m12: CalculateFn = (i) => {
  const k = s12(i['cn-sel'], MODULO_12_ENTIDADES[0].k);
  const e = MODULO_12_ENTIDADES.find((x) => x.k === k) ?? MODULO_12_ENTIDADES[0];
  const cat = MODULO_12_CATEGORIAS_NOME[String(e.cat) as keyof typeof MODULO_12_CATEGORIAS_NOME];
  return {
    valores: {},
    veredito:
      `<b>${e.n} — ${cat.n}.</b> <b>${cat.st}.</b>` +
      `<br><br><b>Onde aparece.</b> ${e.ond}` +
      `<br><br><b>Substituição recomendada.</b> ${e.sub}` +
      `<br><br><b>Por quê.</b> ${e.por}`,
  };
};

// ── m12 INST 11 · Andaime de conversa ─────────────────────────
// Oito movimentos de trinta minutos. Consulta pura; o `t` do item é o
// rótulo de tempo, não um número somável.
const i11m12: CalculateFn = (i) => {
  const t = s12(i['an-sel'], MODULO_12_MOVIMENTOS[0].t);
  const idx = Math.max(0, MODULO_12_MOVIMENTOS.findIndex((x) => x.t === t));
  const m = MODULO_12_MOVIMENTOS[idx];
  return {
    valores: {},
    veredito:
      `<b>${m.lb} — movimento ${idx + 1} de ${MODULO_12_MOVIMENTOS.length}.</b>` +
      `<br><br><b>A pergunta que o governa.</b> ${m.q}` +
      `<br><br><b>Âncoras.</b> ${m.anc}` +
      `<br><br><b>A ponte para o próximo.</b> ${m.br}` +
      `<br><br><b>O que NÃO dizer aqui.</b> ${m.no}`,
  };
};


/** Helpers do Módulo 11 — espelham `numOf`/`segVal`/`fmt` do <script>
 *  da fonte, que os instrumentos transliterados chamam. `nm` reproduz o
 *  `parseFloat` com vírgula, o fallback em NaN e o clamp, nessa ordem. */
const nm = (v: EntradaInstrumento | undefined, def: number, a: number, b: number): number => {
  const x = v === undefined || v === '' ? NaN : parseFloat(String(v).replace(',', '.'));
  const y = Number.isNaN(x) ? def : x;
  return Number.isNaN(y) ? a : Math.min(b, Math.max(a, y));
};
const sv = (v: EntradaInstrumento | undefined, def: string): string =>
  v === undefined || v === '' ? def : String(v);
/** `fmt` da fonte: casas fixas, pt-BR, e '—' para não-finito. */
const fmt11 = (n: number, d?: number): string =>
  !Number.isFinite(n) ? '—' : n.toLocaleString('pt-BR', { minimumFractionDigits: d || 0, maximumFractionDigits: d || 0 });

/** Helpers do script do Módulo 15, homônimos dos do M11 (`nm`/`sv`/`fmt11`),
 *  para a transliteração mecânica não precisar reescrever chamada nenhuma
 *  além das de DOM. */
const esc15 = (t: unknown): string =>
  String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** Reescreve a moldura de bloco da fonte no idioma da Alexandria.
 *
 *  A fonte compõe cartões (`ocard`, `ro`, `vf-bk`, `fz`) com classes de
 *  CSS que não existem aqui. A regra é UMA e vale para os quatro
 *  instrumentos de consulta: rótulo de bloco vira negrito, fim de bloco
 *  vira quebra, e toda a marcação estrutural restante sai — sobra
 *  ênfase (`b`/`i`/`em`) e quebra. Nenhum texto é acrescentado,
 *  removido ou reordenado, e é isso que a prova de fidelidade confere,
 *  comparando o conteúdo textual contra o do script original. */
const alx15 = (h: string): string =>
  h
    .replace(/<span class="(?:ok2|vf-lb|fzk)">([\s\S]*?)<\/span>/g, '<b>$1</b> · ')
    .replace(/<div class="k">([\s\S]*?)<\/div>/g, '<b>$1</b> · ')
    .replace(/<div class="(?:yr|ti|vf-en)">([\s\S]*?)<\/div>/g, '<b>$1</b><br>')
    .replace(/<\/(?:div|p)>/g, '<br>')
    .replace(/<(?!\/?(?:b|i|em|strong|br)\b)[^>]*>/g, '')
    .replace(/(?:<br>\s*){3,}/g, '<br><br>')
    .replace(/^(?:<br>\s*)+/, '')
    .trim();

export const INSTRUMENT_CALCULATORS: Record<string, CalculateFn> = {
  // ── INST 01 · kWh = kW × h ────────────────────────────────
  // Original: `(parseFloat(kw.value) || 0) * (parseFloat(h.value) || 0)`
  'inst-01': (i) => ({
    valores: { 'i01-out': n(i['i01-kw']) * n(i['i01-h']) },
  }),

  // ── INST 02 · Lei de Ohm ──────────────────────────────────
  // O original resolve a incógnita conforme quais 2 dos 3 campos estão
  // preenchidos, e quando os três estão preenchidos faz checagem de
  // coerência com tolerância de 1%.
  //
  // SINALIZADO, não corrigido: no original os handlers de V e de I
  // limpam `R.value` quando o próprio campo é esvaziado — o handler de R
  // não limpa nada. A assimetria não tem justificativa aparente e some
  // nesta porta, porque aqui a função é pura e não mexe em campo do
  // usuário. O resultado do cálculo é idêntico; só o efeito colateral de
  // limpar campo alheio não foi portado. Decisão de conteúdo se deve
  // voltar.
  'inst-02': (i): ResultadoInstrumento => {
    const V = n(i['i02-v']);
    const I = n(i['i02-i']);
    const R = n(i['i02-r']);
    const temV = V > 0;
    const temI = I > 0;
    const temR = R > 0;
    const preenchidos = [temV, temI, temR].filter(Boolean).length;

    if (preenchidos < 2) return { valores: {}, veredito: 'Aguardando 2 valores...' };

    if (temI && temR && !temV) {
      const v = I * R;
      return { valores: { 'i02-v': v }, veredito: `V = I × R = ${v.toFixed(2)} V` };
    }
    if (temV && temR && !temI) {
      const a = V / R;
      return { valores: { 'i02-i': a }, veredito: `I = V ÷ R = ${a.toFixed(2)} A` };
    }
    if (temV && temI && !temR) {
      const r = V / I;
      return { valores: { 'i02-r': r }, veredito: `R = V ÷ I = ${r.toFixed(3)} Ω` };
    }
    const esperado = I * R;
    const dif = Math.abs(esperado - V) / V;
    return {
      valores: {},
      veredito: dif < 0.01 ? `Coerente: ${V.toFixed(0)} V` : 'Inconsistente — limpe um campo',
    };
  },

  // ── INST 03 · Perdas resistivas ───────────────────────────
  // Original: `P = I * I * R`
  'inst-03': (i) => ({
    valores: { 'i03-out': n(i['i03-i']) ** 2 * n(i['i03-r']) },
  }),

  // ── INST 04 · Demanda média e fator de carga ──────────────
  // Original: Pmed = E/T · FC = Pmed/Pmax, com faixas de interpretação.
  //
  // SINALIZADO, não corrigido: o original usa `parseFloat(h.value) || 1`
  // e `parseFloat(pmax.value) || 1`. Campo vazio vira 1, não zero — então
  // apagar "Horas do período" produz um FC enorme em vez de um estado de
  // espera. Comportamento preservado por fidelidade.
  'inst-04': (i) => {
    const E = n(i['i04-kwh']);
    const T = nOu(i['i04-h'], 1);
    const Pmax = nOu(i['i04-pmax'], 1);
    const Pmed = E / T;
    const FC = Pmax > 0 ? Pmed / Pmax : 0;

    let veredito: string;
    if (FC >= 0.7)
      veredito =
        'Bom aproveitamento da capacidade contratada. Operação contínua, carga estável. Pouca oportunidade em ajuste de demanda — focar em outras frentes (energia, FP, modalidade tarifária).';
    else if (FC >= 0.4)
      veredito =
        'Operação em turnos ou com sazonalidade moderada. Possível oportunidade em gestão de carga e deslocamento operacional, a validar com 12 meses de histórico.';
    else if (FC >= 0.15)
      veredito =
        'Fator de carga baixo: muitos picos altos em relação ao uso médio. Pode indicar partidas simultâneas, operação concentrada em poucas horas ou demanda mal dimensionada — investigar antes de recomendar mudança contratual.';
    else
      veredito =
        'FC muito baixo: padrão raro. Pode indicar erro de medição, contratação superdimensionada, ou operação muito atípica. Recomenda-se auditoria completa antes de qualquer decisão.';

    return { valores: { 'i04-pmed': Pmed, 'i04-fc': FC, 'i04-fcp': FC * 100 }, veredito };
  },

  // ── INST 05 · Triângulo de potência ───────────────────────
  // Original: kva = √(kW² + kVAr²) · fp = kW/kVA · φ = atan2(kvar, kw).
  // A faixa de cor do FP no original: ≥0.92 verde · ≥0.85 ouro · resto
  // vermelho — é o mesmo limiar regulatório de 0,92 da Aula 07.
  'inst-05': (i) => {
    const kw = n(i['i05-kw']);
    const kvar = n(i['i05-kvar']);
    const kva = Math.sqrt(kw * kw + kvar * kvar);
    const fp = kva > 0 ? kw / kva : 1;
    const grausTotais = (Math.atan2(kvar, kw) * 180) / Math.PI;
    return {
      valores: { 'tri-kw': kw, 'tri-kvar': kvar, 'tri-kva': kva, 'tri-fp': fp, 'tri-angulo': grausTotais },
      veredito:
        fp >= 0.92
          ? 'FP dentro do mínimo regulatório de 0,92.'
          : fp >= 0.85
            ? 'FP abaixo de 0,92 — sujeito a cobrança de reativo excedente.'
            : 'FP crítico — cobrança de reativo relevante e kVA exigido bem acima do útil.',
    };
  },

  // ── INST 06 · Fator de capacidade ─────────────────────────
  // Original: FC = geração ÷ (capacidade × horas), com seis faixas.
  //
  // SINALIZADO, não corrigido: mesmo `|| 1` do INST 04 em "horas".
  'inst-06': (i) => {
    const C = n(i['i06-cap']);
    const G = n(i['i06-gen']);
    const T = nOu(i['i06-h'], 1);
    const max = C * T;
    const FC = max > 0 ? G / max : 0;

    let veredito: string;
    if (FC >= 0.85)
      veredito =
        'Faixa típica de nuclear ou térmica a carvão operando como base load. Geração praticamente contínua o ano inteiro.';
    else if (FC >= 0.55)
      veredito =
        'Faixa de térmica de base (carvão, gás natural CCGT) ou hidrelétrica em ano hidrológico favorável.';
    else if (FC >= 0.4)
      veredito =
        'Faixa típica de hidrelétrica brasileira (média anual) ou eólica em região de bom regime de ventos (Nordeste).';
    else if (FC >= 0.25)
      veredito =
        'Faixa típica de eólica em regiões de vento moderado ou solar fotovoltaica com tracker em Nordeste BR.';
    else if (FC >= 0.15)
      veredito =
        'Faixa típica de solar fotovoltaica em latitudes brasileiras. Compare com FCs típicos abaixo.';
    else
      veredito =
        'Fator de capacidade muito baixo — característico de térmica peaker (acionada apenas em horas críticas).';

    return { valores: { 'i06-fc': FC * 100 }, veredito };
  },

  // ── LAB 01 · Comparador de perfil elétrico ────────────────
  // Original, verbatim nos coeficientes:
  //   energia   = (kwh / 1000) * tarifa
  //   demanda   = D * 25
  //   reativo   = FP < 0.92 ? (0.92 - FP) * kwh * 0.4 : 0
  //   adicPonta = energia * (ponta% / 100) * 0.5
  //   total     = soma
  //
  // O próprio original comenta: "Coeficientes didáticos (NÃO usar para
  // cálculos reais de fatura)". Preservado como está e repetido na nota
  // do instrumento, que é o que o aluno lê na tela.
  'lab-01': (i) => {
    const kwh = n(i['lab-kwh']);
    const tarifa = n(i['lab-tarifa']);

    const lado = (p: 'a' | 'b') => {
      const D = n(i[`lab-${p}-dem`]);
      const FP = nOu(i[`lab-${p}-fp`], 1);
      const PCT = n(i[`lab-${p}-ponta`]) / 100;

      const energia = (kwh / 1000) * tarifa;
      const demanda = D * 25;
      const reativo = FP < 0.92 ? (0.92 - FP) * kwh * 0.4 : 0;
      const adicPonta = energia * PCT * 0.5;
      return {
        [`lab-${p}-energia`]: energia,
        [`lab-${p}-demanda`]: demanda,
        [`lab-${p}-reativo`]: reativo,
        [`lab-${p}-adicponta`]: adicPonta,
        [`lab-${p}-total`]: energia + demanda + reativo + adicPonta,
      };
    };

    const a = lado('a');
    const b = lado('b');
    const dif = b['lab-b-total'] - a['lab-a-total'];
    return {
      valores: { ...a, ...b },
      veredito:
        dif === 0
          ? 'Mesmo kWh, mesma fatura — os perfis coincidem.'
          : `Mesmo kWh, diferença de R$ ${Math.abs(Math.round(dif)).toLocaleString('pt-BR')} por mês. O perfil elétrico é a diferença.`,
    };
  },

  // ══════════════════════════════════════════════════════════════════
  // MÓDULO 02 — Como Funciona uma Rede Elétrica (LYCEUM Wave 18)
  //
  // Portados do `<script>` de `alexandria_modulo02.html`. Os nove são
  // vinculados a aula — não há `LAB` solto como no Módulo 01.
  //
  // QUIRK DA FONTE, sinalizado e não corrigido: a numeração `INST · NN`
  // do cabeçalho não bate com o prefixo dos ids internos. INST · 04 usa
  // `i08-*`, INST · 05 usa `i04-*`, INST · 06 usa `i09-*`, INST · 07 usa
  // `i05-*`, INST · 08 usa `i06-*`, INST · 09 usa `i07-*`. É resíduo de
  // reordenação das aulas; os ids internos são o que o script referencia,
  // então são eles que valem aqui.
  // ══════════════════════════════════════════════════════════════════

  // ── M02 · INST 01 · Explorador · Camadas da rede ──────────
  // Consulta pura, sem cálculo: o original só troca texto de seis células
  // conforme a pill ativa. Sem número a devolver, `valores` vai vazio e a
  // camada escolhida sai no veredito. Os seis textos por camada são
  // conteúdo, não cálculo — vivem no HTML e não foram duplicados aqui.
  'm02-inst-01': (i) => ({
    valores: {},
    veredito: String(i['i01-pills'] ?? 'ger'),
  }),

  // ── M02 · INST 02 · Simulador · Perdas na transmissão ─────
  // Original, verbatim:
  //   I    = P·1e6 / (√3 · V·1000 · 0,95)
  //   R    = rk[V] · D          (rk = Ω/km por nível de tensão)
  //   loss = 3 · R · I² / N / 1e6      [MW]
  //   pct  = loss / P · 100
  //   yr   = min(loss,P) · 8760 · 0,55 · 250   [R$/ano]
  'm02-inst-02': (i) => {
    // Ω/km típicos por nível de tensão — tabela literal do original.
    const rk: Record<number, number> = { 138: 0.16, 230: 0.09, 345: 0.045, 500: 0.022, 765: 0.011 };
    const P = n(i['i02-p']);
    const D = n(i['i02-d']);
    const V = n(i['i02-v']);
    const N = n(i['i02-n']) || 1;
    const I = (P * 1e6) / (Math.sqrt(3) * V * 1000 * 0.95);
    const R = (rk[V] ?? 0) * D;
    const loss = (3 * R * I * I) / N / 1e6;
    const pct = P > 0 ? (loss / P) * 100 : 0;
    // O original EXIBE a perda limitada ao bloco transmitido (`lossShown`),
    // mas calcula `pct` com a perda crua — por isso o rótulo "> 100 %"
    // existe. Preservado: o teto é de exibição, não do modelo.
    const lossShown = Math.min(loss, P);
    const yr = lossShown * 8760 * 0.55 * 250;

    let veredito: string;
    if (pct > 30)
      veredito =
        'Inviável. Nessa configuração as perdas consomem a maior parte do bloco — é por isso que essa linha não existe no mundo real. Suba o nível de tensão ou adicione circuitos e veja o quadrado da corrente trabalhar a seu favor.';
    else if (pct > 8)
      veredito =
        'Caro. Perdas acima do razoável para um tronco. Em projeto real, subir a tensão ou adicionar um circuito tende a se pagar só com a energia que deixa de virar calor.';
    else
      veredito =
        'Dentro da faixa de engenharia. Este é o tipo de compromisso capital × perdas que desenhou os troncos reais do SIN.';

    return {
      valores: { 'i02-i': I, 'i02-loss': lossShown, 'i02-pct': pct, 'i02-yr': yr },
      veredito,
    };
  },

  // ── M02 · INST 03 · Cadeia de transformação · por perfil ──
  // O original soma as perdas típicas de cada trecho da cadeia conforme o
  // perfil de consumidor. Os trechos são dado, não cálculo — a soma é a
  // única aritmética. Percentuais literais do original.
  //
  // A própria nota do instrumento avisa: "Percentuais ilustrativos de
  // ordem de grandeza por trecho". Preservados como estão.
  'm02-inst-03': (i) => {
    const base = [0.5, 1.8, 0.4]; // SE elevadora · tronco · SE abaixadora
    const extra: Record<string, number[]> = {
      a2: [0.4],
      a4: [0.8, 0.5, 1.6],
      bt: [0.8, 0.5, 1.6, 1.5, 2.9],
    };
    const perfil = String(i['i03-pills'] ?? 'a2');
    const total = [...base, ...(extra[perfil] ?? extra.a2)].reduce((s, x) => s + x, 0);
    return { valores: { 'i03-total': total }, veredito: perfil };
  },

  // ── M02 · INST 04 · Curva líquida e a rampa do fim da tarde
  // (ids internos `i08-*` — ver quirk no cabeçalho da seção)
  //
  // Original: perfil horário `f[25]` fixo · solar senoidal elevada a 1.5
  // entre 6h e 18h · net = carga − solar. Devolve mínimo da líquida, a
  // maior rampa horária e a solar no pico.
  'm02-inst-04': (i) => {
    const f = [
      0.72, 0.7, 0.68, 0.67, 0.67, 0.68, 0.72, 0.78, 0.84, 0.88, 0.9, 0.91, 0.9,
      0.89, 0.88, 0.88, 0.9, 0.95, 1.0, 0.99, 0.95, 0.9, 0.83, 0.77, 0.72,
    ];
    const pico = nOu(i['i08-pico'], 95);
    const S = n(i['i08-solar']);
    const cond = n(i['i08-ceu']);
    const net: number[] = [];
    for (let h = 0; h <= 24; h++) {
      const L = pico * f[h];
      const s =
        h >= 6 && h <= 18
          ? S * cond * Math.pow(Math.max(0, Math.sin((Math.PI * (h - 6)) / 12)), 1.5)
          : 0;
      net.push(L - s);
    }
    let minNet = Infinity;
    let minH = 0;
    for (let h = 0; h <= 24; h++) if (net[h] < minNet) { minNet = net[h]; minH = h; }
    let rampa = -Infinity;
    let rH = 0;
    for (let h = 0; h < 24; h++) {
      const d = net[h + 1] - net[h];
      if (d > rampa) { rampa = d; rH = h; }
    }
    const solPico = S * cond;

    let veredito: string;
    if (rampa > 10)
      veredito =
        'Rampa crítica. É substituir uma Itaipu de geração em sessenta minutos — hidro flexível, térmicas, baterias e intercâmbios subindo juntos, com o operador contando reserva.';
    else if (minNet < 35)
      veredito =
        'Carga líquida mínima muito baixa. Com inflexibilidades e renovável compulsória, sobra geração no meio do dia: CMO no piso, risco de excesso e de corte de renovável.';
    else if (rampa > 6)
      veredito =
        'Rampa exigente no pôr do sol. Dentro da capacidade do parque flexível, mas é esta janela que valoriza bateria, resposta da demanda e a hidro com reservatório.';
    else
      veredito =
        'Dia tranquilo. Com pouca solar, a curva líquida quase coincide com a total e a transição do fim da tarde é suave.';

    return {
      valores: { 'i08-min': minNet, 'i08-minh': minH, 'i08-rampa': rampa, 'i08-rampah': rH, 'i08-solpico': solPico },
      veredito,
    };
  },

  // ── M02 · INST 05 · Despacho por ordem de mérito ──────────
  // (ids internos `i04-*`)
  //
  // Original: pilha de 10 usinas ordenada por custo; must-run (hidro fio
  // d'água, eólica, solar, nuclear) sempre despachado. Se a demanda for
  // menor que o must-run, corta na ordem solar → eólica → fio d'água e o
  // CMO vai ao piso; senão, empilha até cobrir e a marginal define o CMO.
  //
  // `va` (valor da água) = clamp(650 − 6,2·reservatório, PISO, 650).
  'm02-inst-05': (i) => {
    const PISO = 61;
    const D = n(i['i04-dem']);
    const v = n(i['i04-vento']);
    const s = n(i['i04-sol']);
    const r = n(i['i04-res']);
    const va = Math.max(PISO, Math.min(650, Math.round(650 - 6.2 * r)));

    const stack = [
      { id: 'hfio', name: "Hidro fio d'água", cap: 13, cost: 1, must: true },
      { id: 'eol', name: 'Eólica', cap: (22 * v) / 100, cost: 0, must: true },
      { id: 'sol', name: 'Solar (UFV + MMGD)', cap: (25 * s) / 100, cost: 0, must: true },
      { id: 'nuc', name: 'Nuclear', cap: 2, cost: 30, must: true },
      { id: 'hres', name: 'Hidro reservatório', cap: 42, cost: va, must: false },
      { id: 'gn1', name: 'GN eficiente', cap: 9, cost: 190, must: false },
      { id: 'car', name: 'Carvão', cap: 2.5, cost: 280, must: false },
      { id: 'gn2', name: 'GN flexível', cap: 9, cost: 340, must: false },
      { id: 'ole', name: 'Óleo / diesel', cap: 4.5, cost: 950, must: false },
      { id: 'gnl', name: 'GNL spot / importação', cap: 3, cost: 1200, must: false },
    ].sort((a, b) => a.cost - b.cost);

    const disp: Record<string, number> = {};
    const mustCap = stack.filter((p) => p.must).reduce((t, p) => t + p.cap, 0);
    let marg: (typeof stack)[number] | null = null;
    let cut = 0;
    let deficit = 0;
    let cmo: number;

    if (D <= mustCap) {
      let excess = mustCap - D;
      stack.forEach((p) => { disp[p.id] = p.must ? p.cap : 0; });
      for (const id of ['sol', 'eol', 'hfio']) {
        const c = Math.min(excess, disp[id] ?? 0);
        disp[id] -= c;
        excess -= c;
        cut += c;
      }
      cmo = PISO;
    } else {
      let rem = D;
      stack.forEach((p) => {
        const dd = Math.min(p.cap, rem);
        disp[p.id] = dd;
        if (dd > 1e-9) marg = p;
        rem -= dd;
      });
      deficit = rem > 1e-6 ? rem : 0;
      cmo = marg ? Math.max(PISO, (marg as { cost: number }).cost) : PISO;
    }

    const term = ['gn1', 'car', 'gn2', 'ole', 'gnl'].reduce((t, id) => t + (disp[id] ?? 0), 0);
    const margId = marg ? (marg as { id: string }).id : null;

    let veredito: string;
    if (deficit > 0)
      veredito =
        'Déficit — a pilha esgotou. No mundo real isso é corte de carga: ERAC, racionamento, manchete.';
    else if (cut > 0)
      veredito =
        'Excedente renovável cortado. Geração compulsória maior que a demanda — CMO no piso e curtailment. É a fotografia do Nordeste em madrugada ventosa de baixa carga.';
    else if (margId === 'hres')
      veredito =
        'Hidro na margem — CMO = valor da água. O estado normal do Brasil: o preço não é o custo de queimar combustível hoje, é o custo de não ter água amanhã.';
    else if (margId === 'gn1' || margId === 'car' || margId === 'gn2')
      veredito =
        'Térmica na margem. Estiagem e/ou noite sem vento e sol: cada GW adicional sobe um degrau da pilha. É o regime em que bandeira tarifária e PLD sobem juntos.';
    else if (margId === 'ole' || margId === 'gnl')
      veredito =
        'Topo da pilha — óleo e GNL na margem, padrão de crise hídrica como 2021. O sistema atende, mas a que preço.';
    else veredito = 'Renovável e nuclear cobrem a carga. CMO no piso.';

    return { valores: { 'i04-cmo': cmo, 'i04-term': term, 'i04-cut': cut, 'i04-deficit': deficit }, veredito };
  },

  // ── M02 · INST 06 · Bateria: potência × energia ───────────
  // (ids internos `i09-*`)
  // Original: h = E / P, com `parseFloat(mwEl.value) || 1`.
  //
  // SINALIZADO, não corrigido: o mesmo `|| 1` dos INST 04 e 06 do Módulo
  // 01 — potência vazia vira 1 MW em vez de estado de espera.
  'm02-inst-06': (i) => {
    const P = nOu(i['i09-mw'], 1);
    const E = n(i['i09-mwh']);
    const h = E / P;
    const voc =
      h < 1
        ? 'Regulação rápida · serviços ancilares'
        : h <= 3
          ? 'Corte de pico · arbitragem curta'
          : 'Rampa do fim da tarde · deslocamento de energia';
    const veredito =
      h < 1
        ? 'Tanque curto: potência sem fôlego. Vocação para resposta rápida, não para atravessar o pico. E o princípio de sempre: bateria não gera, desloca.'
        : h <= 3
          ? 'O formato clássico para cortar pico de demanda e arbitrar as horas caras. Bateria não gera — desloca energia do horário em que sobra para o horário em que falta.'
          : 'Perfil de rampa: carrega na barriga solar do meio-dia e descarrega das 17h às 21h. É a logística temporal que a curva líquida pede.';
    return { valores: { 'i09-h': h }, veredito: `${voc} — ${veredito}` };
  },

  // ── M02 · INST 07 · Excursão de frequência ────────────────
  // (ids internos `i05-*`)
  // Original:
  //   rocof = (ΔP/P)·60 / (2H)
  //   nadir = 60 − (ΔP/P)·60·1,8 / (2H)
  //
  // SINALIZADO, não corrigido: a fonte tem DUAS saídas de veredito neste
  // instrumento — um `.readout` rotulado "Veredito" (`i05-status`, texto
  // curto) e um `.verdict` separado (`i05-verdict`, texto longo). Não são
  // duplicata acidental: carregam conteúdo diferente. Ambas preservadas —
  // o texto curto vai em `valores` não é possível (é string), então sai
  // concatenado no veredito, com o rótulo curto na frente.
  'm02-inst-07': (i) => {
    const DP = n(i['i05-dp']);
    const P = nOu(i['i05-carga'], 1);
    const H = n(i['i05-h']);
    const rocof = ((DP / P) * 60) / (2 * H);
    const nadir = 60 - ((DP / P) * 60 * 1.8) / (2 * H);

    let curto: string;
    let longo: string;
    if (nadir < 57.5) {
      curto = 'Colapso parcial';
      longo =
        'Nadir abaixo de 57,5 Hz. Múltiplos estágios de ERAC e risco de colapso parcial — milhões de consumidores desligados automaticamente para salvar o restante.';
    } else if (nadir < 58.5) {
      curto = 'ERAC dispara';
      longo =
        'O afundamento cruza o primeiro estágio (~58,5 Hz): blocos de carga são cortados sem nenhum humano no circuito. O sistema sobrevive sacrificando consumo — é o desenho funcionando, não falhando.';
    } else if (nadir < 59.5) {
      curto = 'Severo, contido';
      longo =
        'Inércia + regulação primária seguram o nadir acima do ERAC; a reserva foi consumida e o CAG recompõe nos minutos seguintes. Margem curta.';
    } else {
      curto = 'Estabilizado';
      longo =
        'Excursão absorvida. A inércia limita o RoCoF, a regulação primária estanca a queda e o CAG devolve o sistema a 60,00 Hz. Rotina de operador.';
    }
    return { valores: { 'i05-rocof': rocof, 'i05-nadir': nadir }, veredito: `${curto} — ${longo}` };
  },

  // ── M02 · INST 08 · Perda embutida na conta ───────────────
  // (ids internos `i06-*`)
  // Original: inj = C / (1 − P) · perd = inj − C · custo = perd · T.
  // O guarda `P < 1` evita divisão por zero quando o percentual chega a
  // 100 %; acima disso o original devolve a própria medição.
  'm02-inst-08': (i) => {
    const C = n(i['i06-c']);
    const P = n(i['i06-p']) / 100;
    const T = n(i['i06-t']);
    const inj = P < 1 ? C / (1 - P) : C;
    const perd = inj - C;
    return { valores: { 'i06-inj': inj, 'i06-perd': perd, 'i06-rs': perd * T } };
  },

  // ── M02 · INST 09 · Dois submercados, um fio ──────────────
  // (ids internos `i07-*`)
  //
  // Original: despacha NE+SE como sistema único; se o fluxo resultante
  // couber no limite do intercâmbio, preço único. Se saturar, resolve o SE
  // isolado e precifica cada lado — é o mecanismo do spread de PLD.
  // Demanda do NE é constante (DNE = 12 GW) no modelo.
  'm02-inst-09': (i) => {
    const PISO = 61;
    const DNE = 12;
    const W = n(i['i07-vento']);
    const DSE = n(i['i07-dse']);
    const L = n(i['i07-lim']);

    const despacha = (stack: { cap: number; cost: number }[], dem: number) => {
      let rem = dem;
      let marg: { cap: number; cost: number } | null = null;
      const disp: number[] = [];
      for (const p of stack) {
        const d = Math.min(p.cap, Math.max(0, rem));
        disp.push(d);
        if (d > 1e-9) marg = p;
        rem -= d;
      }
      return { disp, marg, rem };
    };

    const joint = [
      { cap: W, cost: 0 },
      { cap: 38, cost: 160 },
      { cap: 14, cost: 360 },
      { cap: 8, cost: 480 },
      { cap: 99, cost: 980 },
    ];
    const rj = despacha(joint, DNE + DSE);
    const genNE = rj.disp[0] + rj.disp[3];
    const flow = genNE - DNE;

    let pne: number;
    let pse: number;
    let cut: number;
    let f: number;
    let sat: boolean;

    if (Math.abs(flow) <= L + 1e-9) {
      f = flow;
      sat = false;
      pne = pse = Math.max(PISO, rj.marg ? rj.marg.cost : PISO);
      cut = W - rj.disp[0];
    } else {
      sat = true;
      f = flow > 0 ? L : -L;
      const demNE = Math.max(0, DNE + f);
      if (demNE <= W + 1e-9) {
        cut = W - demNE;
        pne = PISO;
      } else {
        cut = 0;
        const tneed = demNE - W;
        pne = tneed <= 8 + 1e-9 ? 480 : 980;
      }
      const rse = despacha(
        [{ cap: 38, cost: 160 }, { cap: 14, cost: 360 }, { cap: 99, cost: 980 }],
        DSE - f,
      );
      pse = Math.max(PISO, rse.marg ? rse.marg.cost : PISO);
    }

    let veredito: string;
    if (!sat)
      veredito =
        'Intercâmbio com folga: preço único. A usina marginal de um lado precifica os dois — os submercados se comportam como um sistema só.';
    else if (cut > 1e-9)
      veredito =
        'Fio cheio + vento sobrando: corte no NE enquanto o SE despacha térmica. Os preços se separam, o gerador eólico perde receita e a disputa do constrained-off entra em cena.';
    else if (f > 0)
      veredito =
        'Intercâmbio saturado: submercados separados. O NE exporta no limite físico; o SE completa com geração própria mais cara. O spread de PLD é o preço visível do congestionamento.';
    else
      veredito =
        'Vento fraco: o NE importa até o limite. Com o fio saturado no sentido contrário, é o NE que fica caro enquanto o SE segue mais barato. Congestionamento não tem lado fixo.';

    return { valores: { 'i07-ne': pne, 'i07-se': pse, 'i07-flow': f, 'i07-cut': cut }, veredito };
  },

  // ══════════════════════════════════════════════════════════════════
  // MÓDULO 03 — Tecnologias de Geração (LYCEUM Wave 19)
  //
  // Portados do `<script>` de `alexandria_modulo03.html`. Os nove são
  // vinculados a aula. Namespace `m03-` pelo mesmo motivo do `m02-`: a
  // fonte reinicia a numeração `INST · NN` a cada módulo.
  //
  // Aqui a numeração interna BATE com o cabeçalho (INST · 04 usa `i04-*`),
  // ao contrário do Módulo 02, onde estava embaralhada.
  //
  // `SHAPE` — sazonalidade de afluência (índice mensal, jan→dez) usada
  // pelos INST 03 e 04. Literal do original.
  // ══════════════════════════════════════════════════════════════════

  // ── M03 · INST 01 · Matriz nas duas lentes ────────────────
  // Consulta pura: o original só troca a pilha desenhada e o veredito
  // conforme a lente. As participações são conteúdo (vivem no HTML), não
  // cálculo — não duplicadas aqui.
  'm03-inst-01': (i) => ({
    valores: {},
    veredito: String(i['i01-pills'] ?? 'cap'),
  }),

  // ── M03 · INST 02 · FC × energia anual ────────────────────
  // Original: gwh = MW·8760·FC/100/1000 · heq = 8760·FC/100
  //           pct = gwh / 550000 · 100   (550 TWh = consumo anual BR)
  'm03-inst-02': (i) => {
    const MW = n(i['i02-mw']);
    const FC = n(i['i02-fc']);
    const gwh = (MW * 8760 * FC) / 100 / 1000;
    const heq = (8760 * FC) / 100;
    const pct = (gwh / 550000) * 100;
    const veredito =
      FC < 35
        ? 'Perfil de fonte variável. Nenhum é melhor: são produtos diferentes. A pergunta certa nunca é quantos MW — é quantos MWh, quando, e com que firmeza.'
        : FC < 70
          ? 'Faixa de hidro, eólica premium ou térmica bem despachada. Para térmica esse número não é atributo da máquina — é o diário de quantas vezes o sistema precisou dela.'
          : 'Território de base. Só nuclear e térmicas rodando quase sempre vivem aqui.';
    return { valores: { 'i02-gwh': gwh, 'i02-heq': heq, 'i02-pct': pct }, veredito };
  },

  // ── M03 · INST 03 · A bateria do Brasil (EAR) ─────────────
  // Simula 12 meses: geração alvo 1 p.u./mês, estoque limitado a CAPAC=5.
  // Devolve a EAR mínima do ano, o mês em que ocorre e quantos meses
  // ficaram abaixo de 30%.
  'm03-inst-03': (i) => {
    const CAPAC = 5;
    const ena = nOu(i['i03-ena'], 100) / 100;
    let ear = (nOu(i['i03-ear'], 60) / 100) * CAPAC;
    let minP = 999;
    let minM = 0;
    let termM = 0;
    let deficit = 0;
    for (let m = 0; m < 12; m++) {
      const inflow = SHAPE_AFLUENCIA[m] * ena;
      const gen = Math.min(1, ear + inflow);
      if (gen < 0.999) deficit += 1 - gen;
      ear = Math.min(CAPAC, Math.max(0, ear + inflow - gen));
      const pct = (ear / CAPAC) * 100;
      if (pct < minP) { minP = pct; minM = m; }
      if (pct < 30) termM++;
    }
    const veredito =
      deficit > 0.05
        ? 'Estoque zerado: território de racionamento. A bateria do Brasil esvaziou antes da chuva voltar — é o desenho de 2001.'
        : minP < 12
          ? 'O desenho de 2021. O estoque não zera, mas o valor da água dispara e térmicas a CVU altíssimo rodam meses. A bateria salvou o suprimento — cobrando caro.'
          : minP < 30
            ? 'Ano apertado. Térmica pesada para poupar água, preço de curto prazo nervoso — o regime em que o mercado vigia o boletim de ENA toda semana.'
            : 'Ano confortável: a bateria faz o trabalho dela. Carrega na estação úmida, descarrega na seca.';
    return {
      valores: { 'i03-min': minP, 'i03-mes': minM, 'i03-term': termM },
      veredito,
    };
  },

  // ── M03 · INST 04 · Reservatório × fio d'água ─────────────
  // COMPARADOR — estreia do tipo. Um campo, cinco saídas: cabe no modelo.
  // Duas usinas didáticas sob a MESMA afluência: a fio d'água gera o que
  // o rio manda (teto na turbina); a de reservatório tenta sustentar
  // entrega constante usando o estoque.
  'm03-inst-04': (i) => {
    const FIO_CAP = 1.6;
    const RES_CAP = 4;
    const ena = nOu(i['i04-ena'], 100) / 100;
    let fioSum = 0;
    let fioMin = 999;
    let stor = 2.5;
    let firmeMin = 999;
    for (let m = 0; m < 12; m++) {
      const inflow = SHAPE_AFLUENCIA[m] * ena;
      const gFio = Math.min(FIO_CAP, inflow);
      fioSum += gFio;
      if (gFio < fioMin) fioMin = gFio;
      const gRes = Math.min(1, stor + inflow);
      stor = Math.min(RES_CAP, Math.max(0, stor + inflow - gRes));
      if (gRes < firmeMin) firmeMin = gRes;
    }
    const fcFio = (fioSum / 12 / FIO_CAP) * 100;
    const veredito =
      firmeMin < 0.7
        ? 'A seca venceu as duas — de jeitos diferentes. Quando até a usina-bateria falha, o que sobra é térmica, corte e crise: a firmeza tem limite, e o limite é o estoque.'
        : fioMin / FIO_CAP < 0.25
          ? 'Dois produtos, escancarados. A fio d’água vende energia média; a de reservatório vende a certeza — e a certeza é o que falta no sistema pós-2000.'
          : 'Ano bom esconde a diferença. É por isso que matriz se julga no ano ruim — arraste a ENA para baixo e veja os produtos se separarem.';
    return {
      valores: {
        'i04-fcfio': fcFio,
        'i04-minfio': (fioMin / FIO_CAP) * 100,
        'i04-firme': firmeMin * 100,
        'i04-stk': (stor / RES_CAP) * 100,
      },
      veredito,
    };
  },

  // ── M03 · INST 05 · O dia do sistema ──────────────────────
  // Curva de carga horária fixa menos solar (senoidal 6h-18h, fator 0,78)
  // e eólica (perfil horário WFAC). Resíduo negativo vira excedente.
  // A rampa é medida SÓ entre 16h e 21h — janela do pôr do sol.
  'm03-inst-05': (i) => {
    const LOAD = [70,69,68,68,68,69,71,74,77,80,82,83,84,84,84,85,87,92,98,100,97,90,82,75,70];
    const WFAC = [1.15,1.15,1.15,1.15,1.12,1.08,1.0,0.92,0.85,0.8,0.78,0.78,0.8,0.82,0.85,0.9,0.98,1.05,1.1,1.12,1.15,1.15,1.15,1.15,1.15];
    const S = n(i['i05-sol']);
    const W = n(i['i05-eol']);
    const res: number[] = [];
    let exc = 0;
    let minR = 999;
    let minH = 0;
    for (let h = 0; h <= 24; h++) {
      const gs = h >= 6 && h <= 18 ? S * 0.78 * Math.sin((Math.PI * (h - 6)) / 12) : 0;
      const gw = W * WFAC[h];
      let r = LOAD[h] - gs - gw;
      if (r < 0) { if (h < 24) exc += -r; r = 0; }
      res.push(r);
      if (r < minR) { minR = r; minH = h; }
    }
    let rampa = 0;
    for (let h = 16; h < 21; h++) {
      const d = res[h + 1] - res[h];
      if (d > rampa) rampa = d;
    }
    const veredito =
      exc > 1
        ? 'Sobra estrutural: energia sem destino no meio-dia. Preço no piso, vertimento, curtailment — e o mesmo dia ainda cobra a rampa do pôr do sol.'
        : rampa > 9
          ? 'Rampa pesada entre 17h e 20h. A barriga e a rampa são o mesmo fenômeno, visto de horas diferentes.'
          : 'Dia administrável, dentro do que o parque flexível resolve sem drama. Suba a solar e veja a barriga afundar e a rampa empinar.';
    return {
      valores: { 'i05-min': minR, 'i05-minh': minH, 'i05-rampa': rampa, 'i05-exc': exc },
      veredito,
    };
  },

  // ── M03 · INST 06 · Pilha de CVU / ordem de mérito ────────
  // Irmã do INST 05 do Módulo 02, com onze usinas em vez de dez e dois
  // multiplicadores: valor da água (campo) e preço do gás (select, que
  // escala GN-CC, GN-CS e GNL de uma vez).
  'm03-inst-06': (i) => {
    const PISO = 61;
    const D = n(i['i06-dem']);
    const agua = Math.round(nOu(i['i06-agua'], 150));
    const gm = nOu(i['i06-gas'], 1);

    const stack = [
      { id: 'fio', name: "Hidro fio d'água", cap: 13, cost: 1, must: true },
      { id: 'eol', name: 'Eólica', cap: 18, cost: 0, must: true },
      { id: 'sol', name: 'Solar (UFV + MMGD)', cap: 16, cost: 0, must: true },
      { id: 'nuc', name: 'Nuclear', cap: 2, cost: 30, must: true },
      { id: 'hre', name: 'Hidro reservatório', cap: 42, cost: agua, must: false },
      { id: 'bio', name: 'Biomassa (safra)', cap: 8, cost: 160, must: false },
      { id: 'gcc', name: 'GN ciclo combinado', cap: 12, cost: Math.round(180 * gm), must: false },
      { id: 'car', name: 'Carvão', cap: 2.5, cost: 280, must: false },
      { id: 'gcs', name: 'GN ciclo simples', cap: 8, cost: Math.round(380 * gm), must: false },
      { id: 'ole', name: 'Óleo / diesel', cap: 5, cost: 950, must: false },
      { id: 'gnl', name: 'GNL spot', cap: 3, cost: Math.round(1300 * gm), must: false },
    ].sort((a, b) => a.cost - b.cost);

    const disp: Record<string, number> = {};
    const mustCap = stack.filter((p) => p.must).reduce((t, p) => t + p.cap, 0);
    let marg: { id: string; name: string; cost: number } | null = null;
    let cut = 0;
    let deficit = 0;
    let cmo: number;

    if (D <= mustCap) {
      let excess = mustCap - D;
      stack.forEach((p) => { disp[p.id] = p.must ? p.cap : 0; });
      for (const id of ['sol', 'eol', 'fio']) {
        const c = Math.min(excess, disp[id] ?? 0);
        disp[id] -= c;
        excess -= c;
        cut += c;
      }
      cmo = PISO;
    } else {
      let rem = D;
      stack.forEach((p) => {
        const dd = Math.min(p.cap, rem);
        disp[p.id] = dd;
        if (dd > 1e-9) marg = p;
        rem -= dd;
      });
      deficit = rem > 1e-6 ? rem : 0;
      cmo = marg ? Math.max(PISO, (marg as { cost: number }).cost) : PISO;
    }

    const term = ['bio', 'gcc', 'car', 'gcs', 'ole', 'gnl']
      .reduce((t, id) => t + (disp[id] ?? 0), 0);
    const nomeMarg = D <= mustCap
      ? 'Renovável (sobra)'
      : marg ? (marg as { name: string }).name : '—';

    return {
      valores: { 'i06-cmo': cmo, 'i06-term': term, 'i06-cut': cut, 'i06-deficit': deficit },
      veredito: nomeMarg,
    };
  },

  // ── M03 · INST 07 · Bateria MW × MWh ──────────────────────
  // DIMENSIONADOR — estreia do tipo. Três campos numéricos, quatro
  // saídas: cabe no modelo sem nenhuma extensão.
  // Original: E = P·H · carga = E/eff · perda = carga − E.
  'm03-inst-07': (i) => {
    const P = n(i['i07-mw']);
    const H = n(i['i07-h']);
    const eff = nOu(i['i07-eff'], 88) / 100;
    const E = P * H;
    const perda = E / eff - E;
    const voc =
      H < 1
        ? 'Serviços rápidos · regulação'
        : H <= 3
          ? 'Ponta · arbitragem curta'
          : 'Rampa do pôr do sol';
    const veredito =
      H < 1
        ? `${voc} — tanque curto: potência sem fôlego. Vocação para frequência e suavização, o serviço que a perda de inércia valorizou. Mas não atravessa a rampa.`
        : H <= 3
          ? `${voc} — o formato de ponta. Desloca da barriga solar para as horas caras, pagando pedágio em calor. Bateria não gera: cobra frete temporal.`
          : `${voc} — carrega ao meio-dia, descarrega das 17h em diante. Acima disso, o deslocamento longo é território da reversível e do reservatório.`;
    return {
      valores: { 'i07-mwh': E, 'i07-desl': E, 'i07-perda': perda },
      veredito,
    };
  },

  // ── M03 · INST 08 · Comparador de LCOE ────────────────────
  // COMPARADOR com preset. LCOE = CAPEX·CRF/energia + O&M/energia + var,
  // com CRF = r(1+r)^n / ((1+r)^n − 1) e energia = 8,76·FC/100 MWh/kW·ano.
  //
  // SINALIZADO, não corrigido: no original, clicar numa pill TAMBÉM
  // reescreve o campo de FC com o `fc` do preset (`fcEl.value = pr.fc`).
  // Efeito colateral que uma função pura não reproduz — aqui o FC do
  // usuário permanece, e o preset só entra como fallback quando o campo
  // está vazio, que é o que `parseFloat(fcEl.value) || p.fc` faz. Trocar
  // de tecnologia sem mexer no FC portanto compara as duas no MESMO fator
  // de capacidade, que é justamente o "teste-chave" que a nota do
  // instrumento pede. Decisão de conteúdo se o reset deve voltar.
  'm03-inst-08': (i) => {
    const PRESETS: Record<string, { capex: number; fc: number; om: number; vr: number; n: number; label: string }> = {
      solar:   { capex: 3500,  fc: 27, om: 50,  vr: 0,   n: 25, label: 'CAPEX R$ 3.500/kW · O&M R$ 50/kW·a · 25 anos' },
      eolica:  { capex: 5500,  fc: 45, om: 80,  vr: 0,   n: 25, label: 'CAPEX R$ 5.500/kW · O&M R$ 80/kW·a · 25 anos' },
      gas:     { capex: 4500,  fc: 45, om: 120, vr: 250, n: 25, label: 'CAPEX R$ 4.500/kW · combustível R$ 250/MWh · 25 anos' },
      hidro:   { capex: 8000,  fc: 50, om: 90,  vr: 5,   n: 50, label: 'CAPEX R$ 8.000/kW · O&M R$ 90/kW·a · 50 anos' },
      nuclear: { capex: 30000, fc: 88, om: 400, vr: 40,  n: 60, label: 'CAPEX R$ 30.000/kW · O&M R$ 400/kW·a · 60 anos' },
    };
    const tech = String(i['i08-pills'] ?? 'solar');
    const p = PRESETS[tech] ?? PRESETS.solar;
    const fc = nOu(i['i08-fc'], p.fc);
    const r = nOu(i['i08-wacc'], 10) / 100;
    const crf = (r * Math.pow(1 + r, p.n)) / (Math.pow(1 + r, p.n) - 1);
    const energiaMWh = (8.76 * fc) / 100;
    const lcoeCap = (p.capex * crf) / energiaMWh;
    const lcoeOM = p.om / energiaMWh + p.vr;
    const lcoe = lcoeCap + lcoeOM;

    let veredito: string;
    if (tech === 'gas')
      veredito = fc < 25
        ? 'O limite 2 em carne viva: a mesma usina que parecia razoável rodando metade do tempo agora parece um desastre — sem mudar um parafuso. O LCOE de térmica flexível é termômetro do despacho, não do projeto.'
        : 'Arraste o FC para 15% e assista ao LCOE quase dobrar. O custo unitário do gás depende de quantas horas o resto do sistema o deixa rodar. Comparar este número com o da solar é comparar um seguro com uma commodity.';
    else if (tech === 'nuclear')
      veredito = 'Quase tudo é capital. Suba o WACC um ponto e veja dezenas de reais aparecerem do nada: em ativo de CAPEX dominante, juro pesa mais que engenharia.';
    else if (tech === 'solar' || tech === 'eolica')
      veredito = 'O número que venceu os leilões: custo quase todo de capital, combustível zero, FC ditado pelo recurso — não pelo despacho. Mas barato não é sinônimo de suficiente.';
    else
      veredito = 'Hidro grande didática, em 50 anos de vida: o segredo está no n do CRF. A hidro barata do Brasil já foi construída — por isso é legado, não opção de expansão.';

    return {
      valores: {
        'i08-lcoe': lcoe,
        'i08-cap': lcoeCap,
        'i08-cappct': (lcoeCap / lcoe) * 100,
        'i08-om': lcoeOM,
      },
      veredito,
    };
  },

  // ── M03 · INST 09 · Quebra-cabeça sazonal ─────────────────
  // QUEBRA-CABEÇA — estreia do tipo, e o único que exigiu decisão.
  //
  // A fonte usa `src-toggle-row`: QUATRO chaves booleanas independentes
  // (`data-src`), ligadas/desligadas por clique. Não é arrastar, ordenar
  // nem parear — é seleção múltipla. Cada chave entra como um `select` de
  // duas opções ('on'/'off'), que o InstrumentPanel já renderiza. Nenhuma
  // mecânica nova, nenhum componente tocado.
  //
  // O cálculo soma os perfis mensais ponderados das fontes LIGADAS e
  // devolve a razão mês-fraco / mês-forte — o "encaixe" que a aula ensina.
  'm03-inst-09': (i): ResultadoInstrumento => {
    const PROF: Record<string, { w: number; m: number[] }> = {
      hidro:  { w: 50, m: [155,155,145,125,85,65,55,50,55,70,100,140] },
      eolica: { w: 15, m: [68,63,68,78,93,108,128,138,143,133,113,83] },
      solar:  { w: 12, m: [105,100,100,95,90,90,95,105,110,110,105,95] },
      bio:    { w: 6,  m: [20,15,25,80,130,160,170,170,160,140,110,50] },
    };
    const ativas = ['hidro', 'eolica', 'solar', 'bio']
      .filter((k) => String(i[`i09-checks-${k}`] ?? 'off') === 'on');

    if (ativas.length === 0) {
      return {
        valores: {},
        veredito:
          'Ligue ao menos uma fonte. Comece pela hidro sozinha — o Brasil dos anos 1990 — e adicione as outras na ordem em que o país as adicionou.',
      };
    }

    let minV = 1e9;
    let maxV = 0;
    let minM = 0;
    for (let m = 0; m < 12; m++) {
      const s = ativas.reduce((t, k) => t + (PROF[k].w * PROF[k].m[m]) / 100, 0);
      if (s < minV) { minV = s; minM = m; }
      if (s > maxV) maxV = s;
    }
    const ratio = maxV > 0 ? (minV / maxV) * 100 : 0;
    const veredito =
      ratio < 40
        ? 'Time de um jogador: era a matriz quase-só-hidro, com a diferença atravessada com reservatório e reza. Adicione a eólica e veja o vale começar a se erguer.'
        : ratio < 55
          ? 'O encaixe começou. O vento do 2º semestre preenche exatamente os meses em que a ENA some. Falta a peça da seca profunda — ligue a biomassa.'
          : 'Portfólio trabalhando: o vale subiu sem ninguém construir uma usina a mais. É a complementaridade convertendo perfis em firmeza estatística.';
    return { valores: { 'i09-ratio': ratio, 'i09-vale': minM }, veredito };
  },

  // ══════════════════════════════════════════════════════════
  // MÓDULO 04 — Economia de Mercados de Energia
  //
  // PORTADOS do <script> de `alexandria_modulo04.html`, não
  // rederivados. Namespaçados `m04-` pelo mesmo motivo dos Módulos
  // 02-03: a fonte numera instrumentos por módulo, reiniciando do 01.
  //
  // Os IDS DE CAMPO carregam sufixo `-n`: a fonte pareia cada controle
  // com um <input type="range"> gêmeo, e o `InstrumentField` extraído
  // guarda o id do <input type="number">, que é quem tem
  // value/min/max/step. O script original lê o range (`i1-d`); aqui os
  // dois são o mesmo campo lógico, então lemos `i1-d-n`.
  //
  // AS SEIS SAÍDAS TEXTUAIS da fonte (usina marginal, mês crítico,
  // limite aplicado, mês mais barato/caro, pior mês) não entram em
  // `valores` — `Record<string, number>` não as comporta. Elas
  // sobrevivem no veredito, que é onde o original já as narrava.
  // ══════════════════════════════════════════════════════════

  // ── m04 INST 01 · Formador de preço ───────────────────────
  // Despacho por ordem de mérito: ordena a frota por CVU, atende a
  // demanda em fila, e o preço é o CVU da ÚLTIMA usina chamada.
  // O valor da água é função inversa do reservatório — é o que faz o
  // mesmo parque produzir preços diferentes com a mesma demanda.
  'm04-inst-01': (i) => {
    const D = n(i['i1-d-n']);
    const R = n(i['i1-r-n']) / 100;
    const Hh = n(i['i1-h-n']);
    const G = n(i['i1-g-n']);
    const agua = 30 + ((100 - Hh) / 100) * 320;
    const frota = [
      { nome: 'Solar', cap: 200 * R, cvu: 0 },
      { nome: 'Eólica', cap: 300 * R, cvu: 12 },
      { nome: 'Hidráulica', cap: 350, cvu: agua },
      { nome: 'Gás', cap: 400, cvu: G },
      { nome: 'Óleo', cap: 250, cvu: 900 },
    ].sort((a, b) => a.cvu - b.cvu);
    let resto = D;
    let price = 0;
    for (const f of frota) {
      const usa = Math.min(f.cap, resto);
      resto -= usa;
      if (usa > 0.001) price = f.cvu;
    }
    const def = Math.max(0, resto);
    if (def > 0.001) price = PLD_MAX_HORARIO;
    // Piso e teto do original, nesta ordem — o piso vence o teto quando
    // ambos poderiam se aplicar, porque é o primeiro ramo do if/else.
    if (price < PLD_MIN) price = PLD_MIN;
    else if (price > PLD_MAX_HORARIO) price = PLD_MAX_HORARIO;
    return {
      valores: { 'i1-p': price, 'i1-def': def },
      veredito: ((): string => {
    if (def>0.001) return `Déficit de ${num(def)} MW: a capacidade disponível não atende a carga. O preço vai ao teto horário e o problema deixa de ser econômico — passa a ser de segurança de suprimento.`;
    if (price<=120) return `Sistema folgado. A margem entre a usina marginal e as usinas baratas é pequena, e quem está no fim da fila captura pouca margem inframarginal. Bom para o consumidor exposto; ruim para quem precisa recuperar custo fixo vendendo energia.`;
    if (price<=400) return `Sistema em atenção. A térmica ou a hidráulica cara já está na margem. Neste patamar, a diferença entre estar contratado e estar exposto começa a aparecer no orçamento mensal.`;
    return `Sistema pressionado. Recurso caro na margem. Toda energia descoberta é liquidada perto deste valor — e é exatamente aqui que a decisão de contratação tomada meses atrás mostra se foi boa.`;
      })(),
    };
  },

  // ── m04 INST 02 · PLD ao longo do ano ─────────────────────
  // Pressão hidrológica ponderada (ENA 50%, EAR 35%, carga 15%),
  // modulada pela sazonalidade e elevada a 2,2 — a não-linearidade é
  // o que faz o PLD disparar no fim do período seco.
  'm04-inst-02': (i) => {
    const E = n(i['i2-e-n']);
    const A = n(i['i2-a-n']);
    const C = n(i['i2-c-n']);
    const pE = clamp04((110 - E) / 70, 0, 1);
    const pA = clamp04((80 - A) / 70, 0, 1);
    const pC = clamp04((C + 5) / 15, 0, 1);
    const pres = 0.5 * pE + 0.35 * pA + 0.15 * pC;
    let soma = 0;
    let mx = -1;
    let mxi = 0;
    for (let m = 0; m < 12; m++) {
      const p = clamp04(pres * SEAS_M04_PLD[m], 0, 1);
      const pld = clamp04(
        PLD_MIN + (PLD_MAX_HORARIO - PLD_MIN) * Math.pow(p, 2.2),
        PLD_MIN,
        PLD_MAX_HORARIO,
      );
      soma += pld;
      if (pld > mx) { mx = pld; mxi = m; }
    }
    const med = soma / 12;
    return {
      // 730 h = média de horas por mês. O original rotula esta saída
      // '1 MW médio descoberto': é o custo mensal de deixar 1 MW médio
      // exposto ao pico do ano.
      valores: { 'i2-p': med, 'i2-max': mx, 'i2-x': mx * 730 },
      veredito: ((): string => {
    if (mx<=120) return `Ano confortável do começo ao fim. O preço fica baixo mesmo no seco, e a tentação de reduzir contratação aumenta. Registre a tentação: é exatamente aqui que se assinam as subcontratações que doem dois anos depois.`;
    if (mx<=350) return `Pico em ${MES[mxi]} a ${brl(mx)}/MWh. O modelo já está preservando água e chamando térmica no seco. Um megawatt médio descoberto custa ${mi(mx*730)} no mês crítico — a conta cresce mais rápido que a percepção.`;
    if (mx<=PLD_MAX_ESTRUTURAL) return `Escassez precificada, com pico em ${MES[mxi]}. Quem está descoberto sente no caixa. Repare que o preço ainda está abaixo do teto estrutural: o limite regulatório ainda não é o que está segurando o número.`;
    return `Estresse severo: o pico de ${MES[mxi]} passa do teto estrutural de R$ 785,27, e o ajuste regulatório sobre a média do período entra em cena. Este é o território onde o mercado só-de-energia deveria pagar a capacidade — e onde o teto impede que ele pague.`;
      })(),
    };
  },

  // ── m04 INST 03 · O dinheiro que falta ────────────────────
  // Missing money: receita de energia contra custo fixo anual. O gap é
  // exatamente o que um mercado de capacidade precisaria pagar.
  'm04-inst-03': (i) => {
    const P = n(i['i3-p-n']);
    const Hh = n(i['i3-h-n']);
    const M = n(i['i3-m-n']);
    const F = n(i['i3-f-n']);
    const rec = P * Hh * M;
    const cst = P * 1000 * F;
    const gap = cst - rec;
    const need = gap > 0 ? gap / (P * 1000) : 0;
    const fc = (Hh / 8760) * 100;
    return {
      valores: { 'i3-r': rec, 'i3-c': cst, 'i3-g': gap > 0 ? gap : 0, 'i3-k': need },
      veredito: ((): string => {
    if (gap<=0) return `A receita de energia cobre o custo fixo. Repare no que foi preciso: ${num(Hh)} horas de despacho, um fator de capacidade de ${fc.toFixed(1)}%, com margem de R$ ${num(M)}/MWh. Um ativo com esse perfil não é uma usina de ponta — é uma usina de base disfarçada.`;
    if (need<80) return `Falta ${mi(gap)}. O gap é pequeno diante do custo fixo, e um prêmio de capacidade de R$ ${num(need)}/kW-ano fecharia a conta. É a faixa em que o debate de desenho de mercado costuma acontecer — nem óbvio, nem impossível.`;
    return `Falta ${mi(gap)}. Vendendo só energia, este ativo não existe: nenhum banco financia e nenhum acionista aporta. Seriam necessários R$ ${num(need)}/kW-ano de receita de disponibilidade para viabilizá-lo. Este número tem nome — é o missing money, e é a razão de existir dos leilões de reserva de capacidade.`;
      })(),
    };
  },

  // ── m04 INST 04 · Sala do leilão reverso ──────────────────
  // Fila de lances FIXA na fonte — o aluno move só demanda e preço-teto.
  // O ponto pedagógico é a distância entre preço de corte (o que todos
  // recebem) e preço médio por lance.
  'm04-inst-04': (i) => {
    const D = n(i['i4-d-n']);
    const T = n(i['i4-t-n']);
    let resto = D;
    let corte = 0;
    let somaRS = 0;
    let somaMW = 0;
    let barrado = 0;
    for (const b of BIDS_M04) {
      if (b.p > T) { barrado += b.mw; continue; }
      if (resto > 0) {
        const take = Math.min(b.mw, resto);
        resto -= take;
        corte = b.p;
        somaRS += take * b.p;
        somaMW += take;
      }
    }
    const med = somaMW > 0 ? somaRS / somaMW : 0;
    const falta = Math.max(0, resto);
    return {
      valores: { 'i4-q': somaMW, 'i4-c': corte, 'i4-m': med, 'i4-f': falta },
      veredito: ((): string => {
    if (somaMW===0 && D>0) return `Nada contratado. O teto do edital ficou abaixo de todas as propostas e o leilão saiu deserto. Acontece de verdade: teto mal calibrado não reduz preço — devolve o problema inteiro para o planejador, um ano depois e mais caro.`;
    if (somaMW===0) return `Demanda zero, nada a contratar. Suba a quantidade demandada para ver a fila de propostas se formar.`;
    if (falta>0 && barrado>=falta) return `Demanda não atendida em ${num(falta)} MW, com ${num(barrado)} MW de oferta barrados pelo teto. Do ponto de vista tarifário, o teto protegeu o consumidor; do ponto de vista de suprimento, deixou um buraco que reaparece no certame seguinte — em geral mais caro, porque a urgência aumentou.`;
    if (falta>0) return `Demanda não atendida em ${num(falta)} MW por insuficiência de oferta: mesmo contratando tudo que apareceu, não deu. Isso não é problema de preço-teto — é sinal de que o produto demandado não atraiu projetos suficientes, e a resposta está no desenho do edital.`;
    return `Contratado integralmente. Preço de corte ${brl(corte)}/MWh, preço médio por lance ${brl2(med)}/MWh — uma diferença de ${brl2(corte-med)} por MWh. Se o edital liquidar por preço uniforme, todos recebem o corte e essa diferença migra do bolso do consumidor para o do gerador. É a regra do edital, não a teoria, que decide isso.`;
      })(),
    };
  },

  // ── m04 INST 05 · Contrato × spot em 12 meses ─────────────
  // Parcela contratada a preço fixo + parcela exposta ao PLD ondulado.
  // A média mal se move quando a amplitude cresce — é esse o ponto.
  'm04-inst-05': (i) => {
    const C = n(i['i5-c-n']) / 100;
    const P = n(i['i5-p-n']);
    const L = n(i['i5-l-n']);
    const S = n(i['i5-s-n']);
    const fix = C * P * CONS_M04;
    let soma = 0;
    let mx = -1;
    let mn = 1e18;
    let mxi = 0;
    for (let m = 0; m < 12; m++) {
      const pld = clamp04(L + S * WAVE_M04[m], PLD_MIN, PLD_MAX_HORARIO);
      const t = fix + (1 - C) * pld * CONS_M04;
      soma += t;
      if (t > mx) { mx = t; mxi = m; }
      if (t < mn) mn = t;
    }
    const med = soma / 12;
    const amp = mx - mn;
    return {
      valores: { 'i5-a': med, 'i5-r': amp },
      veredito: ((): string => {
    if (C>=0.999) return `Cem por cento contratado. A volatilidade some — e no lugar dela entra o risco de sobrecontratação: se a produção cair, a sobra é liquidada a preço que a empresa não escolhe. Proteção total contra um risco costuma ser exposição total a outro.`;
    if (amp<=400000) return `Amplitude anual de ${mi(amp)} entre o melhor e o pior mês. Absorvível pelo caixa da maioria das operações industriais — é a faixa em que a flexibilidade da exposição residual compra mais valor do que custa.`;
    if (amp<=1500000) return `Amplitude anual de ${mi(amp)}. Esse número precisa caber na política de risco por escrito, e não apenas na expectativa de quem assinou o contrato. Repare que a média mal se moveu: o que mudou foi a dispersão.`;
    return `Amplitude anual de ${mi(amp)}, com pior mês em ${MES[mxi]}. Nada garante que os meses ruins não se agrupem. Se essa variação não cabe no orçamento, a discussão não é de preço — é de política de contratação.`;
      })(),
    };
  },

  // ── m04 INST 06 · Mesa de hedge · swap simples ────────────
  // O swap paga a diferença entre PLD realizado e preço fixo. Volume
  // travado ACIMA do consumo deixa de ser hedge e vira posição
  // direcional — é o que o veredito do original denuncia.
  'm04-inst-06': (i) => {
    const F = n(i['i6-f-n']);
    const P = n(i['i6-p-n']);
    const V_ = n(i['i6-v-n']);
    const pay = (P - F) * V_;
    const semH = CONS_M04 * P;
    const comH = semH - pay;
    const efe = comH / CONS_M04;
    return {
      valores: { 'i6-r': pay, 'i6-a': semH, 'i6-b': comH, 'i6-u': efe },
      veredito: ((): string => {
        const V = V_;
        const CONS = CONS_M04;
    if (V>CONS+0.5) return `Volume travado acima do consumo. Os ${num(V-CONS)} MWh excedentes não protegem nada — são posição direcional pura. Se o PLD cair, essa parcela gera prejuízo sem nenhuma perda física do outro lado para compensar. Isso deixou de ser hedge.`;
    if (V===0) return `Sem proteção. O custo efetivo é o PLD realizado, seja ele qual for. Perfeitamente legítimo — desde que seja uma decisão registrada na política de risco, e não o resultado de ninguém ter decidido nada.`;
    if (P>F) return `O PLD subiu acima do preço travado. O swap devolveu ${mi(pay)}, reduzindo o custo efetivo para ${brl2(efe)}/MWh contra ${brl2(P)}/MWh sem proteção. Foi para este cenário que o hedge foi contratado.`;
    if (P<F) return `O PLD ficou abaixo do preço travado. O swap custou ${mi(Math.abs(pay))} e o custo efetivo subiu para ${brl2(efe)}/MWh. Isso não é um erro: é o preço do seguro num ano em que não houve sinistro. A pergunta correta é se a previsibilidade valeu esse valor, não se o mercado caiu.`;
    return `PLD igual ao preço travado. Resultado nulo no swap — o cenário exato em que o hedge não muda nada, e o único em que ele não tem opinião.`;
      })(),
    };
  },

  // ── m04 INST 07 · Portfólio em camadas ────────────────────
  // Três camadas de preço crescente + exposição residual. Somar mais de
  // 100% gera sobrecontratação, que a fonte trata como CRÉDITO ao PLD —
  // comprar caro para revender barato, todo mês.
  'm04-inst-07': (i) => {
    const A = n(i['i7-a-n']);
    const B = n(i['i7-b-n']);
    const Cc = n(i['i7-c-n']);
    const S = n(i['i7-s-n']);
    const soma = A + B + Cc;
    const over = Math.max(0, soma - 100);
    const resid = Math.max(0, 100 - soma);
    const custoFixo = ((A * PL_A_M04 + B * PL_B_M04 + Cc * PL_C_M04) / 100) * CONS_M04;
    let acc = 0;
    let mx = -1;
    let mn = 1e18;
    let mxi = 0;
    for (let m = 0; m < 12; m++) {
      const pld = clamp04(
        200 * SEAS_M04_PORT[m] * (1 + (S / 100) * RAMP_M04[m]),
        PLD_MIN,
        PLD_MAX_HORARIO,
      );
      const t = custoFixo + (resid / 100) * pld * CONS_M04 - (over / 100) * pld * CONS_M04;
      acc += t;
      if (t > mx) { mx = t; mxi = m; }
      if (t < mn) mn = t;
    }
    const med = acc / 12;
    const unit = med / CONS_M04;
    return {
      // O original imprime −over quando há sobrecontratação, e resid
      // quando não há. Mesmo sinal preservado.
      valores: { 'i7-e': over > 0 ? -over : resid, 'i7-m': med, 'i7-r': mx - mn },
      veredito: ((): string => {
    if (over>0) return `As camadas somam ${num(soma)}% do consumo: há ${num(over)}% de sobrecontratação estrutural. Todo mês a empresa compra energia a preço de contrato e revende a sobra ao PLD — em geral mais baixo. O custo efetivo sobe para ${brl2(unit)}/MWh mesmo tendo "travado" preço. Contratar demais não é prudência: é comprar caro para revender barato, todo mês, por contrato.`;
    if (resid===0) return `Cem por cento contratado, exposição zero. O custo é perfeitamente previsível em ${brl2(unit)}/MWh — e perfeitamente rígido. Qualquer queda de produção vira sobrecontratação imediata. Previsibilidade total é uma escolha, não um ótimo.`;
    if (resid<=15) return `Exposição residual de ${num(resid)}%, com amplitude anual de ${mi(mx-mn)}. Custo médio de ${brl2(unit)}/MWh. É a faixa em que a folga absorve variação operacional sem transformar o orçamento em aposta — o desenho que a maioria das políticas de risco industriais persegue.`;
    if (resid<=35) return `Exposição de ${num(resid)}% e amplitude anual de ${mi(mx-mn)}. Ainda gerenciável, mas o pior mês (${MES[mxi]}) já custa ${mi(mx)}. Verifique se esse valor cabe no limite financeiro da política, e não apenas no limite percentual — são critérios diferentes e um não garante o outro.`;
    return `Exposição de ${num(resid)}%: a maior parte do custo de energia desta empresa é decidida pelo mercado, não por ela. Amplitude anual de ${mi(mx-mn)}, pior mês em ${MES[mxi]} a ${mi(mx)}. Isso é uma posição direcional em preço de energia assumida por quem não vive de negociar energia.`;
      })(),
    };
  },


  // ══════════════════════════════════════════════════════════════════
  // MÓDULO 05 — Regulação e Desenho de Mercados (LYCEUM Wave 25)
  //
  // Portados do `<script>` de `alexandria_modulo05.html`. Seis, um por
  // aula. Namespace `m05-` pelo mesmo motivo dos anteriores.
  //
  // QUATRO SAÍDAS TEXTUAIS ficam de fora de `valores` — `Record<string,
  // number>` não as comporta e emitir índice cru sob o rótulo seria pior
  // que omitir. Todas aparecem no veredito literal, que é o que o aluno
  // lê: `i2-b` (grau ótimo), `i4-r` (reprodutibilidade), `i6-q`
  // (quadrante) e `i6-r` (risco dominante). Terceira wave seguida com
  // este padrão — ver Wave 19 (mês) e Wave 24 (usina marginal).
  // ══════════════════════════════════════════════════════════════════

  // ── M05 · INST 01 · Quando duplicar a rede fica caro ──────
  // Original: cm(n,q,f,c) = (n·f·CRF + c·q) / q, com CRF = 0,10 fixo.
  // `q` em consumidores (campo em mil) e `f` em R$ (campo em R$ mi).
  'm05-inst-01': (i) => {
    const CRF = 0.1;
    const q = n(i['i1-q']) * 1000;
    const f = n(i['i1-f']) * 1e6;
    const c = n(i['i1-c']);
    const N = n(i['i1-n']);
    const cm = (redes: number) => (q > 0 ? (redes * f * CRF + c * q) / q : 0);
    const cur = cm(N);
    const one = cm(1);
    const waste = cur - one;
    const pct = one > 0 ? (waste / one) * 100 : 0;

    let veredito: string;
    if (N === 1)
      veredito =
        'Rede única. Repare quanto do custo é custo de existir a rede, e não de entregar energia: é essa proporção que define quão forte é o monopólio natural aqui.';
    else if (pct <= 10)
      veredito =
        'Duplicar custa pouco a mais por consumidor. Mercado grande e custo fixo baixo — o argumento de monopólio natural é fraco aqui. Nem toda infraestrutura de rede é monopólio natural na mesma intensidade.';
    else if (pct <= 50)
      veredito =
        'A duplicação já é claramente ineficiente, e nenhuma competição entre as redes recupera isso: a concorrência aqui aumenta o custo do sistema em vez de reduzi-lo. É competição pelo mercado, não no mercado.';
    else
      veredito =
        'Monopólio natural forte: o custo fixo domina a estrutura, e replicar a rede desperdiça — além de espaço público, servidão e licença ambiental, que nenhuma rede replicaria mesmo querendo pagar.';

    return {
      valores: { 'i1-cm': cur, 'i1-c1': one, 'i1-w': Math.max(0, waste), 'i1-tf': N * f, 'i1-pct': pct },
      veredito,
    };
  },

  // ── M05 · INST 02 · Grau de separação ─────────────────────
  // Original: conf = BC[g-1]·(1 − 0,35·f/100) · coor = BK[g-1]·(0,35 +
  // 0,65·c/100). O grau ótimo é o de menor soma.
  //
  // SAÍDA TEXTUAL OMITIDA: `i2-b` é o NOME do grau ótimo
  // ('Contábil'/'Funcional'/'Jurídica'/'Societária'), não número. Sai no
  // veredito.
  'm05-inst-02': (i) => {
    const BC = [100, 68, 40, 12];
    const BK = [6, 22, 45, 85];
    const NOME = ['Contábil', 'Funcional', 'Jurídica', 'Societária'];
    const G = n(i['i2-g']);
    const C = n(i['i2-c']);
    const F = n(i['i2-f']);
    const calc = (g: number) => {
      const conf = BC[g - 1] * (1 - (0.35 * F) / 100);
      const coor = BK[g - 1] * (0.35 + (0.65 * C) / 100);
      return { c: conf, k: coor, t: conf + coor };
    };
    let best = 1;
    let bt = Infinity;
    for (let g = 1; g <= 4; g++) {
      const t = calc(g).t;
      if (t < bt) { bt = t; best = g; }
    }
    const cur = calc(G);

    let veredito: string;
    if (G === best)
      veredito = `Separação ${NOME[G - 1].toLowerCase()} é o ponto de menor atrito para esta combinação. O ótimo se desloca com a fiscalização — melhorar a fiscalização de acesso costuma ser mais barato que aprofundar a separação.`;
    else if (Math.abs(G - best) === 1)
      veredito = `Diferença pequena para a separação ${NOME[best - 1].toLowerCase()}, dentro da margem em que outros fatores decidem. ${G > best ? 'Você paga coordenação a mais para comprar uma redução de conflito que a fiscalização já entregava.' : 'Você aceita conflito residual a mais, apostando numa fiscalização que pode não se sustentar.'}`;
    else
      veredito = `${G > best ? 'Separação profunda demais para este contexto' : 'Separação rasa demais para este contexto'} — o menor atrito está no grau ${NOME[best - 1].toLowerCase()}. ${G > best ? 'Cortar fundo destrói coordenação sem comprar redução proporcional de conflito.' : 'A regra de acesso existe no papel e não é verificável na prática.'}`;

    return { valores: { 'i2-r': cur.c, 'i2-k': cur.k, 'i2-t': cur.t }, veredito };
  },

  // ── M05 · INST 03 · Composição de contratação ─────────────
  // Original, com SP = 200 (preço spot de referência):
  //   soma = L + C · over = max(0, soma−100) · D = max(0, 100−soma)
  //   com sobrecontratação: custo = (L(SP+P) + C(SP+0,35P) − over·SP·0,90)/100
  //   sem:                  custo = (L(SP+P) + C(SP+0,35P) + D·SP)/100
  //   sig = SP·(V/100)·((D + 0,45C)/100)·1,6 · ruim = custo + 2·sig · amp = 4·sig
  'm05-inst-03': (i) => {
    const SP = 200;
    const L = n(i['i3-l']);
    const C = n(i['i3-c']);
    const P = n(i['i3-p']);
    const V = n(i['i3-v']);
    const soma = L + C;
    const over = Math.max(0, soma - 100);
    const D = Math.max(0, 100 - soma);
    const custo =
      over > 0
        ? (L * (SP + P) + C * (SP + P * 0.35) - over * SP * 0.9) / 100
        : (L * (SP + P) + C * (SP + P * 0.35) + D * SP) / 100;
    const sig = SP * (V / 100) * ((D + 0.45 * C) / 100) * 1.6;

    let veredito: string;
    if (over > 0)
      veredito =
        'Há sobrecontratação. A sobra é revendida ao curto prazo em condição que o comprador não escolhe. Sobrecontratar não é prudência — é comprar caro para revender barato, por contrato, todo mês.';
    else if (D === 0)
      veredito =
        'Cem por cento contratado: custo perfeitamente previsível e perfeitamente rígido, com amplitude zero. Qualquer queda de produção vira sobrecontratação no mês seguinte. Previsibilidade total é escolha de política de risco, não ótimo automático.';
    else if (D <= 15)
      veredito =
        'Faixa em que a folga absorve variação operacional sem transformar o orçamento numa aposta direcional. O prêmio pago no contrato longo comprou redução de dispersão, não de custo.';
    else if (D <= 35)
      veredito =
        'Ainda gerenciável, mas verifique se o cenário ruim cabe no limite FINANCEIRO da política de risco — e não só no limite percentual de exposição. São critérios diferentes, e atender um não garante o outro.';
    else
      veredito =
        'A maior parte do custo de energia desta empresa é decidida pelo mercado de curto prazo, não por ela. Isso é posição direcional em preço de energia, assumida por quem não vive de negociar energia.';

    return {
      valores: {
        'i3-e': custo,
        'i3-w': custo + 2 * sig,
        'i3-a': 4 * sig,
        'i3-d': over > 0 ? -over : D,
      },
      veredito,
    };
  },

  // ── M05 · INST 04 · Termômetro de risco de captura ────────
  // A fonte chama de `Termômetro`, que NÃO é membro de InstrumentKind.
  // Mapeado para `quebra-cabeca` pela mecânica: oito chaves booleanas
  // independentes com peso, mais um campo numérico.
  //
  // Original: op = soma dos pesos marcados · expo = M·op/100 ·
  // repro = 'não' se o sinal 0 estiver marcado; 'parcial' se 1 ou 2;
  // senão 'sim'.
  //
  // SAÍDA TEXTUAL OMITIDA: `i4-r` (reprodutibilidade) é palavra, não
  // número — sai no veredito.
  'm05-inst-04': (i) => {
    const PESOS = [22, 20, 20, 12, 12, 6, 5, 3];
    const M = n(i['i4-m']);
    const marcados: number[] = [];
    let op = 0;
    for (let k = 0; k < PESOS.length; k++) {
      if (String(i[`i4-s${k}`] ?? 'off') === 'on') { op += PESOS[k]; marcados.push(k); }
    }
    const expo = (M * op) / 100;
    const repro = marcados.includes(0)
      ? 'não'
      : marcados.includes(1) || marcados.includes(2)
        ? 'parcial'
        : 'sim';

    let veredito: string;
    if (op === 0)
      veredito =
        'Nenhum sinal marcado. O processo é verificável: metodologia anterior, dados disponíveis, contribuições respondidas e resultado reproduzível. Isso não significa que o resultado agrade — significa que ele pode ser contestado no mérito técnico, que é a única forma produtiva de contestar.';
    else if (op <= 25)
      veredito = `Reprodutibilidade: ${repro}. Os sinais presentes dificultam a verificação sem impedi-la. Encaminhamento adequado: pedido formal dos itens faltantes e registro público do pedido — não conclusão.`;
    else if (op <= 55)
      veredito = `Reprodutibilidade: ${repro}. O que se pode afirmar publicamente é exatamente isso — a lacuna e a materialidade. Captura é padrão institucional inferido ao longo do tempo, não diagnóstico de um ato isolado.`;
    else
      veredito = `Reprodutibilidade: ${repro}. Nesta faixa um terceiro competente não refaz a conta, e a decisão só pode ser aceita por confiança — que é precisamente o que a transparência regulatória existe para tornar desnecessária. A afirmação publicável continua sendo a lacuna verificada e a materialidade, nunca a imputação a instituição ou pessoa.`;

    return { valores: { 'i4-n': marcados.length, 'i4-o': op, 'i4-e': expo }, veredito };
  },

  // ── M05 · INST 05 · Ciclo de revisão tarifária ────────────
  // Original: rem = B·Wc/100 (remuneração da base) · pb0 = O + rem + Dp
  // (Parcela B) · comp = pb0/E·1000 (R$ mi ÷ GWh → R$/MWh) ·
  // sens = B·0,01 (efeito de +1 p.p. de WACC) · projeção de 5 anos com
  // crescimento g = 1 + X/100.
  'm05-inst-05': (i) => {
    const B = n(i['i5-b']);
    const Wc = n(i['i5-w']);
    const O = n(i['i5-o']);
    const Dp = n(i['i5-d']);
    const E = n(i['i5-e']);
    const X = n(i['i5-x']);
    const rem = (B * Wc) / 100;
    const pb0 = O + rem + Dp;
    const comp = E > 0 ? (pb0 / E) * 1000 : 0;
    const sens = B * 0.01;
    const g = 1 + X / 100;
    const final = pb0 * Math.pow(g, 4);
    return {
      valores: { 'i5-p': pb0, 'i5-c': comp, 'i5-s': sens, 'i5-f': final },
      veredito:
        'A Parcela B é a parte que a revisão decide. Repare no peso da remuneração da base: é ali que um ponto percentual de WACC vira dezenas de milhões por ano, sem nenhuma mudança física na rede.',
    };
  },

  // ── M05 · INST 06 · Posição no desenho de mercado ─────────
  // A fonte chama de `Mapa`, que NÃO é membro de InstrumentKind.
  // Mapeado para `simulador` pela mecânica: três campos numéricos →
  // posição e veredito, idêntico aos quatro `Simulador` do módulo.
  //
  // Original: xId = 15 + 0,75·H · yId = 70 − 0,35·H (posição ideal dado
  // o peso do recurso armazenável) · coer = clamp(100 − 0,55|X−xId| −
  // 0,45|Y−yId|, 0, 100) · dist = distância euclidiana até o Brasil
  // (85, 45).
  //
  // DUAS SAÍDAS TEXTUAIS OMITIDAS: `i6-q` (quadrante) e `i6-r` (risco
  // dominante) são rótulos, não números — saem no veredito.
  'm05-inst-06': (i) => {
    const X = n(i['i6-x']);
    const Y = n(i['i6-y']);
    const H = n(i['i6-h']);
    const xId = 15 + 0.75 * H;
    const yId = 70 - 0.35 * H;
    const coer = Math.max(0, Math.min(100, 100 - 0.55 * Math.abs(X - xId) - 0.45 * Math.abs(Y - yId)));
    const dist = Math.sqrt(Math.pow(X - 85, 2) + Math.pow(Y - 45, 2));

    const quad =
      X < 50
        ? Y < 50 ? 'Oferta · só energia' : 'Oferta · capacidade formal'
        : Y < 50 ? 'Custo · só energia' : 'Custo · capacidade formal';
    const risco =
      Y < 32 ? 'Missing money'
      : Y > 72 ? 'Erro de projeção'
      : X < 35 && H > 55 ? 'Coordenação intertemporal'
      : X > 72 ? 'Opacidade metodológica'
      : 'Custo administrativo';

    let veredito: string;
    if (coer >= 80)
      veredito = `Quadrante: ${quad.toLowerCase()}. Configuração coerente com o peso do recurso armazenável plurianual. O risco que sobra é ${risco.toLowerCase()} — nenhum desenho elimina risco, apenas escolhe qual carregar. Saber nomear qual você escolheu é o que distingue desenho de improviso.`;
    else if (coer >= 55)
      veredito = `Quadrante: ${quad.toLowerCase()}. Sustentável, mas há tensão entre o desenho e o parque. Risco dominante: ${risco.toLowerCase()}.`;
    else
      veredito = `Quadrante: ${quad.toLowerCase()}. O desenho e o parque estão desalinhados. Risco dominante: ${risco.toLowerCase()}.`;

    return { valores: { 'i6-co': coer, 'i6-d': dist }, veredito };
  },

  // ══════════════════════════════════════════════════════════
  // MÓDULO 06 — História do Setor Elétrico Brasileiro
  //
  // PORTADOS do <script> de `alexandria_modulo06.html`. Sete de aula:
  // o `Inst · 01` (Linha do tempo) vive no § MAP, fora de aula, e não
  // tem cálculo — só navegação entre 14 marcos.
  // ══════════════════════════════════════════════════════════

  // ── m06 INST 02 · a erosão do custo histórico ─────────────
  // Custo histórico corrigido por inflação composta, com uma parcela
  // indexada a moeda estrangeira (câmbio somado à inflação). A cobertura
  // é o inverso do fator — é o que mostra a tarifa perdendo aderência ao
  // custo de reposição sem ninguém decidir nada.
  'm06-inst-02': (i) => {
    const Hh = n(i['i2-h-n']);
    const I = n(i['i2-i-n']);
    const N = n(i['i2-n-n']);
    const Mm = n(i['i2-m-n']);
    const C = n(i['i2-c-n']);
    const fator = (nn: number) =>
      (1 - Mm / 100) * Math.pow(1 + I / 100, nn) + (Mm / 100) * Math.pow(1 + (I + C) / 100, nn);
    const f = fator(N);
    const cb = 1 / f;
    const rep = Hh * f;
    const pc = (M06_R * Hh) / Math.pow(1 + I / 100, N);
    // 'Anos até cair a 50%' é TEXTO na fonte ('12 anos' / '> 60 anos'),
    // então fica fora de `valores` e só aparece no veredito.
    let a5 = '> 60 anos';
    for (let k = 1; k <= 60; k++) {
      if (1 / fator(k) < 0.5) { a5 = k + ' anos'; break; }
    }
    return {
      valores: { 'i2-cb': cb * 100, 'i2-rp': rep, 'i2-pc': pc },
      veredito: ((): string => {
    if (cb>=0.90) return `Cobertura de ${pct(cb*100)}. Nesta combinação, remunerar pelo custo histórico ainda sustenta a reposição do ativo: a diferença entre valor nominal reconhecido e custo de repor é pequena o bastante para não travar decisão de investimento. É por isso que o regime é impecável em moeda estável — e por isso ele não pareceu problemático quando foi desenhado.`;
    if (cb>=0.65) return `Cobertura de ${pct(cb*100)} após ${N} anos. A erosão já é perceptível e começa a aparecer como adiamento de expansão, não como recusa explícita. Repare que a queda é composta: cada ano adicional custa mais que o anterior, e ela cruza os 50% em ${a5}.`;
    if (cb>=0.35) return `Cobertura de ${pct(cb*100)}. A receita reconhecida remunera menos de dois terços do que seria necessário para repor o mesmo ativo. Neste território, expandir deixa de fazer sentido econômico para quem já está na concessão, e o capital novo simplesmente não aparece — sem que nenhuma regra tenha proibido nada. É exatamente o mecanismo que secou o investimento privado entre 1934 e os anos 1940.`;
    return `Cobertura de ${pct(cb*100)}: o regime deixou de ser regulação de preço e virou expropriação econômica de fato, ainda que não de direito. Com ${Mm}% do equipamento importado e câmbio ${C} pontos acima da inflação, o custo de reposição multiplicou por ${num(f,1)} enquanto a receita ficou nominalmente parada. Nenhum operador expande nessas condições, e a escassez resultante aparece com o atraso típico de uma obra — cinco a dez anos depois da decisão que a causou.`;
      })(),
    };
  },

  // ── m06 INST 03 · como se forma uma dívida intrassetorial ──
  // Autofinanciamento limitado pela tarifa, captação limitada por teto,
  // e o que sobra vira dívida com outra empresa do próprio setor — que
  // não aparece como dívida financeira de ninguém.
  'm06-inst-03': (i) => {
    const I = n(i['i3-i-n']);
    const T = n(i['i3-t-n']);
    const S = n(i['i3-s-n']);
    const C = n(i['i3-c-n']);
    const Y = n(i['i3-y-n']);
    const autofin = Math.min(I, I * 0.55 * (T / 100));
    const need = Math.max(0, I - autofin);
    const captado = Math.min(need, I * 0.5);
    const naopago = Math.max(0, need - captado);
    const s = S / 100;
    const g = C / 100;
    let df = 0;
    let di = 0;
    for (let t = 1; t <= Y; t++) {
      df += captado * (s * Math.pow(1 + g, Y - t) + (1 - s));
      di += naopago;
    }
    return {
      valores: {
        'i3-af': I > 0 ? (autofin / I) * 100 : 0,
        'i3-df': df,
        'i3-di': di,
        'i3-rt': I > 0 ? (df + di) / I : 0,
      },
      veredito: ((): string => {
    if (naopago<=0.001 && T>=100) return `A tarifa cobre integralmente o custo do serviço e a empresa autofinancia ${pct(autofin/I*100,0)} do investimento exigido; o restante é captado dentro do teto de endividamento e nada vira conta não paga. É a única configuração do modelo estatal que se sustenta no tempo — e é exatamente a configuração que a política macroeconômica dos anos 1980 tornou impossível.`;
    if (naopago<=0.001) return `Sem inadimplência dentro do setor, mas com passivo financeiro acumulado de ${num(df,0)} — ${num(df/I,1)} vezes o investimento anual. Com câmbio ${C} pontos acima da inflação e ${S}% do funding em moeda estrangeira, o serviço dessa dívida cresce mais rápido que a receita, ainda que hoje o caixa feche. É a antessala do problema, não a ausência dele.`;
    if (di/I<=2) return `A tarifa em ${T}% do custo do serviço deixa ${num(naopago,0)} por ano sem funding, e em ${Y} anos isso vira ${num(di,0)} de obrigações não honradas dentro do próprio setor — além de ${num(df,0)} de dívida financeira. Como todas as empresas pertencem ao mesmo dono, isso não produz falência: produz saldo contábil. O sintoma não aparece no balanço, aparece na obra que não começa.`;
    return `Passivo total de ${num(df+di,0)}, ou ${num((df+di)/I,1)} vezes o investimento anual, dos quais ${num(di,0)} são conta simplesmente não paga entre empresas. Nesta faixa o fluxo financeiro do setor deixa de ser legível: ninguém consegue dizer com precisão quem deve quanto a quem, e nenhuma empresa pode ser avaliada — nem para venda, nem para recapitalização pública. É o estado em que o setor chegou a 1993, e é por isso que a reforma começou por um encontro de contas.`;
      })(),
    };
  },

  // ── m06 INST 04 · termômetro do racionamento ──────────────
  // Balanço de energia num período seco: quanto do consumo precisa ser
  // cortado para o armazenamento não furar o piso operativo.
  //
  // 'Termômetro' NÃO é membro de InstrumentKind, e o tipo é
  // somente-leitura. Mapeado para 'simulador' pela mecânica (campos
  // numéricos → readouts), com o título literal preservado na tela.
  'm06-inst-04': (i) => {
    const E = n(i['i4-e-n']);
    const A = n(i['i4-a-n']);
    const Mg = n(i['i4-m-n']);
    const T = n(i['i4-t-n']);
    const extra = Math.max(0, 8 - Mg) * 0.25;
    const bruto = M06_BASE + extra;
    const aporte = M06_BASE * (A / 100);
    const d = bruto - aporte;
    const usable = Math.max(0, E - (M06_FLOOR + M06_RES));
    const permitido = T > 0 ? usable / T : 0;
    const r = clamp06(1 - (permitido + aporte) / bruto, 0, 1);
    // 'Meses até o limite' e 'Nível final sem corte' são TEXTO na fonte
    // ('não atinge', 'já abaixo', 'esgotado'): não há onde guardá-los em
    // , e o veredito literal do original já os narra.
    return {
      valores: { 'i4-ct': r * 100, 'i4-qm': d },
      veredito: ((): string => {
    if (r<=0.0005) return `Nenhum corte necessário. Com afluência em ${A}% da média e ${Mg}% de margem firme, o sistema atravessa os ${T} meses e ainda encerra o período seco com folga sobre o limite operacional. Repare que a margem firme faz parte do resultado: ela é o que permite poupar reservatório sem tocar na demanda.`;
    if (r<=0.08) return `Corte de ${pct(r*100,1)}. É a faixa em que resposta voluntária, campanha de eficiência e ajuste de contrato ainda dão conta — sem programa compulsório. Mas note quanto disso depende da margem firme: com ${Mg}% de capacidade não hidráulica, quase todo o esforço de poupar reservatório está sendo pedido ao consumidor em vez de ser feito pelo parque gerador.`;
    if (r<=0.20) return `Corte de ${pct(r*100,1)} — território de programa compulsório com meta, bônus e sobretarifa. Foi aproximadamente aqui que 2001 pousou. O que essa configuração revela não é seca: é margem. Com armazenamento em ${E}% e apenas ${Mg}% de capacidade firme não hidráulica, uma afluência de ${A}% da média já basta para exigir corte, e uma afluência assim está dentro do universo que qualquer planejamento deveria comportar.`;
    if (r<=0.40) return `Corte de ${pct(r*100,1)}. Nesta profundidade o programa deixa de ser gestão de demanda e passa a redesenhar a produção industrial do país: turnos, contratos de fornecimento, cadeia produtiva inteira. O impacto macroeconômico é da ordem de pontos de PIB, e a distribuição é desigual — quem tem flexibilidade se ajusta, quem não tem, para.`;
    return `Corte de ${pct(r*100,1)}: acima de quarenta por cento, redução voluntária ou tarifada não entrega, e o sistema passa a depender de interrupção programada — que é outra coisa, com outro custo e outra consequência jurídica. Neste ponto o diagnóstico já não é sobre o período seco em curso, e sim sobre uma decisão de expansão que deixou de ser tomada anos antes.`;
      })(),
    };
  },

  // ── m06 INST 05 · comparador de arquiteturas ──────────────
  // Risco de faltar cai com o horizonte de contratação; risco de sobrar
  // sobe. O ponto de menor atrito se DESLOCA conforme a arquitetura —
  // é esse o argumento da aula.
  'm06-inst-05': (i) => {
    const Hh = n(i['i5-h-n']);
    const R = M06_REG[0];   // a fonte inicia em cur=0
    const f = m06Falta(R.F0, Hh);
    const s = m06Sobra(R.S0, Hh);
    const t = f + s;
    let best = 0;
    let bt = 1e9;
    for (let k = 0; k <= 6; k++) {
      const tt = m06Falta(R.F0, k) + m06Sobra(R.S0, k);
      if (tt < bt - 1e-9) { bt = tt; best = k; }
    }
    const pre = 'Regime ' + R.n + '. ';
    return {
      valores: { 'i5-rf': f, 'i5-rs': s, 'i5-rt': t },
      veredito: ((): string => {
    if (Hh===best) return `${pre}Horizonte de ${Hh} ano(s) é o ponto de menor atrito para esta arquitetura: risco de faltar em ${num(f,0)} e de sobrar em ${num(s,0)}. Repare que o ótimo se desloca com o regime — o mesmo horizonte que é prudente numa arquitetura é caro demais em outra, porque o que muda é quanto o resto do desenho já protege contra subinvestimento.`;
    if (Hh<best) return `${pre}Horizonte de ${Hh} ano(s) contra ${best} de menor atrito. Você está aceitando risco de faltar em ${num(f,0)} para economizar risco de sobrar. Numa arquitetura em que o financiamento da expansão depende de contrato longo, encurtar o horizonte não reduz custo — apenas transfere a incerteza para o investidor, que a devolve no preço do leilão ou simplesmente não aparece.`;
    return `${pre}Horizonte de ${Hh} ano(s), acima dos ${best} de menor atrito. O risco de faltar já está em ${num(f,0)}, baixo, e o de sobrar em ${num(s,0)} — e sobra também é custo, pago pelo mesmo consumidor que a antecedência deveria proteger. É o trade-off que a arquitetura de 2004 assumiu conscientemente ao trocar risco de racionamento por risco de sobrecontratação.`;
      })(),
    };
  },

  // ── m06 INST 06 · o efeito de uma liminar num rateio ──────
  // Rateio é sistema fechado: o que um agente deixa de pagar por decisão
  // judicial não some — é redistribuído entre os demais, o que aumenta a
  // inadimplência do ciclo seguinte. Três ciclos, com teto de 85%.
  'm06-inst-06': (i) => {
    const D = n(i['i6-d-n']);
    const P = n(i['i6-p-n']);
    const G = n(i['i6-g-n']);
    const N = n(i['i6-n-n']);
    const gar = (D * G) / 100;
    const p1 = P;
    const f1 = Math.max(0, (D * p1) / 100 - gar);
    const p2 = Math.min(85, p1 + 30 * (D > 0 ? f1 / D : 0));
    const f2 = Math.max(0, (D * p2) / 100 - gar);
    const p3 = Math.min(85, p2 + 30 * (D > 0 ? f2 / D : 0));
    const f3 = Math.max(0, (D * p3) / 100 - gar);
    const acum = f1 + f2 + f3;
    const tx = D > 0 ? (D - f1) / D : 0;
    const perda = N > 0 ? f1 / N : 0;
    return {
      valores: { 'i6-tx': tx * 100, 'i6-fa': f1, 'i6-pm': perda, 'i6-ac': acum },
      veredito: ((): string => {
    if (f1<=0.001) return `Nenhuma falta no ciclo: as garantias disponíveis, em ${pct(G,0)} do devido, cobrem integralmente a parcela protegida por decisão judicial. Os credores recebem cem por cento. É esta a configuração em que o rateio funciona como projetado — e note quanto ela depende de a proteção judicial ser pequena em relação às garantias, e não do mérito da disputa.`;
    if (tx>=0.95) return `Recebimento de ${pct(tx*100,1)}. O corte é pequeno, mas o mecanismo já está operando: ${mmi(f1)} que alguém devia entram no caixa como zero e saem do bolso de quem não tinha nada a ver com a disputa. Em três ciclos, mantido o padrão de contágio, o acumulado chega a ${mmi(acum)}.`;
    if (tx>=0.80) return `Recebimento de ${pct(tx*100,1)}, com ${mmi(perda)} de perda média por credor no ciclo. A partir daqui a decisão racional de cada agente prejudicado é buscar a própria proteção judicial — e é exatamente por isso que a parcela protegida sobe para ${pct(p2,0)} no ciclo seguinte e ${pct(p3,0)} no terceiro. A liquidação deixa de ser contabilidade e vira disputa.`;
    return `Recebimento de ${pct(tx*100,1)}: o sistema de rateio está quebrado como mecanismo de liquidação. Com ${mmi(acum)} retidos em três ciclos, o preço de curto prazo deixa de ser um sinal econômico e passa a ser uma pretensão contábil. Nenhuma decisão judicial individual criou isso — cada uma delas foi razoável no seu próprio processo. O resultado agregado é que a arquitetura de liquidação não tem fundo garantidor dimensionado para absorver proteção judicial em escala, e a solução, historicamente, teve de ser legislativa.`;
      })(),
    };
  },

  // ── m06 INST 07 · linha da abertura do ACL ────────────────
  // ZERO saída numérica, e isso é fiel: as quatro saídas da fonte são
  // texto (situação, limiar, norma habilitante, ano de elegibilidade).
  // É um instrumento de consulta regulatória — o veredito literal
  // carrega a leitura inteira.
  'm06-inst-07': (i) => {
    const Yr = n(i['i7-y-n']);
    const K = n(i['i7-k-n']);
    const t = m06Limiar(Yr);
    let first = '—';
    for (let k = 1995; k <= 2028; k++) {
      if (m06Elegivel(k, K)) { first = String(k); break; }
    }
    // A fonte tem dois toggles (grupo A/baixa tensão e convencional/
    // incentivada) que NÃO são <input> no markup — são botões cujo
    // estado vive só no script, e por isso não viraram InstrumentField.
    // Portados no ramo PADRÃO, que é onde a fonte inicia: grupo=0,
    // fonte=0. Os ramos de baixa tensão e de fonte incentivada existem
    // no original e ficam registrados aqui como não alcançáveis por
    // esta porta.
    const grupo: number = 0;
    const fonte: number = 0;
    // Assinatura preservada do original — os vereditos a chamam com os
    // três argumentos, e o ramo padrão ignora grupo/fonte.
    const norma = (ano: number, _g: number, _f: number) => m06Norma(ano);
    const gtxt = grupo === 1 ? 'baixa tensão' : 'Grupo A';
    const ftxt = fonte === 1 ? 'fonte incentivada' : 'energia convencional';
    const ok = m06Elegivel(Yr, K);
    const folga = t === 0 ? 0 : K / t;
    return {
      valores: {},
      // Só o ramo GRUPO A entra. O original aninha os vereditos em
      // `if(grupo===1){…} else {…}`, e os três do ramo de baixa tensão
      // são inalcançáveis por esta porta — o toggle de grupo não é campo.
      veredito: ((): string => {
    if (t < 0) return `Em ${Yr} não existia figura de consumidor livre para ${ftxt}. A elegibilidade nasce com a Lei nº 9.074/1995 e passa a valer, na prática, a partir de 1996 — e mesmo então com requisitos combinados de carga e tensão. Antes disso, todo consumidor era cativo da concessionária da sua área, sem exceção.`;
    if (t === 0) return `Elegível em ${Yr}, e sem depender da carga: desde 1º de janeiro de 2024 todo consumidor do ${gtxt} pode contratar ${ftxt} de qualquer fornecedor autorizado, sem exigência de carga mínima. Estimativas de associação setorial apontam cerca de 165 mil empresas que se tornaram aptas nesse momento — é este o marco que cria o mercado endereçável de um produto independente de inteligência energética no Brasil.`;
    if (ok) return `Elegível em ${Yr}: com ${num(K,0)} kW, a unidade está ${num(folga,1)} vez(es) acima do limiar de ${num(t,0)} kW vigente pela ${norma(Yr,grupo,fonte)}. Vale a pergunta que o §Caso faz: se ela é elegível há anos e não migrou, isso foi decisão consciente ou omissão herdada? A resposta muda completamente o diagnóstico.`;
    return `Não elegível em ${Yr}: o limiar vigente é de ${num(t,0)} kW pela ${norma(Yr,grupo,fonte)}, e a unidade tem ${num(K,0)} kW. Faltam ${num(t-K,0)} kW. Deslize o ano para a direita e observe em que degrau a escada desce abaixo da carga — essa data é o momento exato em que esta unidade entrou no mercado endereçável, e ${(first==='—'?'ela não é alcançada dentro do horizonte legal conhecido para este perfil.':('ela é '+first+'.'))}`;
      })(),
    };
  },

  // ── m06 INST 08 · mapa trauma → cicatriz ──────────────────
  // Onze pressões históricas. Mecânica da fonte é seleção única num
  // grid gerado por script; aqui vira um `select`, que é o primitivo
  // equivalente que o painel já renderiza. As quatro saídas são texto
  // puro, então a cadeia inteira vai no veredito.
  'm06-inst-08': (i) => {
    const T = MODULO_06_TRAUMA_CICATRIZ;
    const cur = clamp06(Math.trunc(n(i['i8-sel'])), 0, T.length - 1);
    const it = T[cur];
    const cadeia =
      `${it.periodo} · ${it.titulo}\n` +
      `Problema revelado: ${it.problema}\n` +
      `Resposta institucional: ${it.resposta}\n` +
      `Cicatriz que opera hoje: ${it.cicatriz}\n` +
      `Risco novo em troca: ${it.riscoNovo}`;
    const fecho = ((): string => {
    if (cur===T.length-1) return `Marco ${(cur+1)} de ${T.length}. Este é o único da lista cuja cicatriz ainda não terminou de se formar — e é exatamente por isso que ele é o mais valioso comercialmente. Todos os outros dez você usa para explicar por que o setor é como é; este você usa para explicar por que existe uma janela agora.`;
    return `Marco ${(cur+1)} de ${T.length}. Percorra os quatro quadros na ordem e repare que o quarto nunca é vazio: nenhuma resposta institucional deste bloco eliminou um risco — todas trocaram um risco por outro, mais administrável. Saber nomear o risco novo é o que separa quem entende o setor de quem decorou a linha do tempo.`;
    })();
    return { valores: {}, veredito: cadeia + '\n\n' + fecho };
  },


  // ══════════════════════════════════════════════════════════
  // MÓDULO 07 — Estrutura Institucional Detalhada
  //
  // Nove instrumentos de aula. O `Inst · 01` (Mapa institucional) vive
  // no § MAP, fora de aula, e não entra — mesmo tratamento do LAB · 01
  // (Módulo 01) e do Inst · 01 (Módulo 06).
  // ══════════════════════════════════════════════════════════

  // ── m07 INST 02 · comparador de instrumentos jurídicos ────
  // Onze instrumentos, de lei ordinária a despacho. Seleção revela
  // quem emite, o que vincula e como se lê.
  'm07-inst-02': (i) => ({ valores: {}, veredito: explorar07('02', i['i2-sel']) }),

  // ── m07 INST 04 · anatomia de um ato regulatório ──────────
  // Soma dos seis prazos do rito. A JANELA DE INFLUÊNCIA é só tomada de
  // subsídios + consulta pública (a+c) — as outras quatro etapas correm
  // sem porta de entrada, e é essa razão que o instrumento ensina.
  'm07-inst-04': (i) => {
    const a = n(i['i4-a-n']);
    const b = n(i['i4-b-n']);
    const c = n(i['i4-c-n']);
    const d = n(i['i4-d-n']);
    const e = n(i['i4-e-n']);
    const f = n(i['i4-f-n']);
    const tot = a + b + c + d + e + f;
    const jan = a + c;
    const r = tot > 0 ? jan / tot : 0;
    // 'Regime' é TEXTO na fonte e não cabe em `valores` — vai no
    // veredito, que já o narra.
    const av =
      f === 0 ? 'sem vacância — a regra vale na publicação'
      : f < 30 ? 'vacância curta'
      : f < 90 ? 'vacância apertada'
      : f < 180 ? 'vacância razoável'
      : 'vacância confortável';
    // 'Regime' é TEXTO na fonte — fica fora de `valores` e entra no
    // veredito, que é onde o original o narra.
    const reg =
      jan === 0 ? 'Fechado à contribuição'
      : r >= 0.28 ? 'Aberto e previsível'
      : r >= 0.15 ? 'Aberto com janela estreita'
      : 'Formalmente aberto, praticamente fechado';
    void av;
    return {
      valores: { 'i4-tot': tot, 'i4-jan': jan, 'i4-avi': f },
      veredito: ((): string => {
    if (jan===0) return `<b>Sem porta de entrada.</b> Não há tomada de subsídios nem consulta pública: o agente descobre a regra quando ela já é obrigação. Isso acontece em hipóteses de urgência declarada e é legítimo nelas — mas transforma o processo regulatório em risco não gerenciável para quem é regulado. Nesse desenho, a única defesa possível é posterior: recurso administrativo e via judicial. Ciclo total de ${dias(tot)}, com ${av}.`;
    if (r>=0.28 && f>=90) return `<b>Rito aberto e com aviso.</b> A janela de influência é de ${dias(jan)} em um ciclo de ${dias(tot)} — cerca de ${num(r*100,0)}% do processo aceita contribuição externa documentada — e ainda restam ${dias(f)} entre a deliberação e a vigência para adaptar contrato, sistema e operação. É o desenho em que participar tem retorno real e em que a surpresa regulatória é evitável. Regime: ${reg.toLowerCase()}, ${av}.`;
    if (r>=0.15) return `<b>Aberto, mas exige monitoramento ativo.</b> A janela de influência é de ${dias(jan)} num ciclo de ${dias(tot)} — cerca de ${num(r*100,0)}%. Quem monitora apenas a publicação final chega depois de fechada. Quem monitora o despacho de abertura de consulta chega a tempo. Depois da deliberação restam ${dias(f)} de adaptação: ${av}. A assimetria entre grandes e pequenos agentes nasce exatamente aqui — não na regra, mas na capacidade de acompanhar o processo.`;
    return `<b>Formalmente aberto, praticamente fechado.</b> Apenas ${num(r*100,0)}% do ciclo de ${dias(tot)} aceita contribuição — ${dias(jan)} de janela contra ${dias(b+d+e)} de processo interno. O rito cumpre a exigência de participação sem entregar participação efetiva: quando a minuta chega ao público, as escolhas estruturais já foram feitas na fase de elaboração. Aviso prévio: ${dias(f)}, ${av}.`;
      })(),
    };
  },

  // ── m07 INST 06 · régua do ciclo mensal ───────────────────
  // Consumo → desembolso é a soma das cinco etapas; a folga até o
  // aporte é contestação + garantia (c+d).
  'm07-inst-06': (i) => {
    const a = n(i['i6-a-n']);
    const b = n(i['i6-b-n']);
    const c = n(i['i6-c-n']);
    const d = n(i['i6-d-n']);
    const e = n(i['i6-e-n']);
    const tot = a + b + c + d + e;
    const fol = c + d;
    const prev = a + b;
    let reg =
      tot <= 25 ? 'Ciclo curto'
      : tot <= 40 ? 'Ciclo padrão'
      : tot <= 55 ? 'Ciclo longo'
      : 'Ciclo muito longo';
    if (c === 0) reg += ' · sem contestação';
    else if (c <= 3) reg += ' · janela mínima';
    void prev;
    const cap = `O intervalo de ${dias(tot)} entre o fim do mês de consumo e a liquidação é capital de giro parado: a energia foi consumida, o valor ainda não circulou, e o agente carrega a posição no balanço enquanto isso.`;
    return {
      valores: { 'i6-tot': tot, 'i6-jan': c, 'i6-fol': fol },
      veredito: ((): string => {
    if (c===0) return `<b>Sem janela de contestação.</b> A prévia sai no dia ${num(prev,0)} e vira obrigação sem intervalo para questionamento. Todo erro de medição, de registro de contrato ou de aplicação de regra vira desembolso primeiro e discussão depois — e discussão depois de liquidado é processo, não é ajuste. ${cap}`;
    if (c<=3) return `<b>Janela mínima.</b> São ${dias(c)} entre conhecer a prévia e perder o direito de contestar — tempo insuficiente para conferir medição por ponto, conciliar contratos e montar argumento técnico em qualquer operação de porte. Na prática, quem não tem conciliação automatizada não contesta. ${cap} A folga até o aporte é de ${dias(fol)}.`;
    if (fol<5) return `<b>Contestação existe, folga de caixa não.</b> A janela de ${dias(c)} é utilizável, mas entre saber o valor e ter que aportar garantia há apenas ${dias(fol)}. Para um agente com tesouraria enxuta, isso significa manter caixa ocioso permanentemente — porque não dá tempo de mobilizar recurso depois que o número aparece. ${cap}`;
    if (tot<=40) return `<b>Ciclo equilibrado.</b> Janela de contestação de ${dias(c)}, folga de ${dias(fol)} entre a prévia e o aporte, e ${dias(tot)} do fim do consumo à liquidação. É o desenho em que o agente consegue conferir antes de pagar e mobilizar caixa antes de aportar — as duas condições que separam gestão de tesouraria de reação a boleto. ${cap}`;
    return `<b>Ciclo longo, com controle preservado.</b> A janela de ${dias(c)} e a folga de ${dias(fol)} funcionam, mas o ciclo de ${dias(tot)} amplia a exposição: quanto mais tempo entre consumo e liquidação, maior o valor em aberto e maior o efeito de uma inadimplência de terceiro sobre o rateio da liquidação. ${cap}`;
      })(),
    };
  },

  // ── m07 INST 03 · estante da EPE · qual documento responde qual pergunta ──
  'm07-inst-03': (i) => ({ valores: {}, veredito: explorar07('03', i['i3-sel']) }),
  // ── m07 INST 05 · cadeia temporal da operação ──
  'm07-inst-05': (i) => ({ valores: {}, veredito: explorar07('05', i['i5-sel']) }),
  // ── m07 INST 07 · escada do travamento · o que parou o projeto ──
  'm07-inst-07': (i) => ({ valores: {}, veredito: explorar07('07', i['i7-sel']) }),
  // ── m07 INST 08 · roteador de decisão ──
  'm07-inst-08': (i) => ({ valores: {}, veredito: explorar07('08', i['i8-sel']) }),
  // ── m07 INST 09 · localizador de dado ──
  'm07-inst-09': (i) => ({ valores: {}, veredito: explorar07('09', i['i9-sel']) }),
  // ── m07 INST 10 · calendário institucional ──
  'm07-inst-10': (i) => ({ valores: {}, veredito: explorar07('10', i['i10-sel']) }),

  // ── m08 INST 02 · conversor de três eixos · as duas pizzas ──
  // ── m08 INST 01 · mapa fisico · geracao x escoamento (modulo) ──
  // ── m06 INST 01 · linha do tempo · quatorze marcos (modulo) ──
  'm06-inst-01': m06i1M08,

  // ── m07 INST 01 · mapa institucional · autoridade x dado (modulo) ──
  'm07-inst-01': m07i1M08,

  'm08-inst-01': i1renderM08,

  'm08-inst-02': i2calcM08,

  // ── m08 INST 03 · fator de capacidade com faixa típica por fonte ──
  'm08-inst-03': i3calcM08,

  // ── m08 INST 05 · leitura lateral · o mesmo campo nas seis fontes ──
  'm08-inst-05': i5renderM08,

  // ── m08 INST 06 · curvas de complementaridade · tres escalas ──
  'm08-inst-06': i6renderM08,

  // ── m08 INST 07 · calendario sazonal · doze meses do sistema ──
  'm08-inst-07': i7renderM08,

  // ── m08 INST 08 · termometro hidrologico · estoque x fluxo ──
  'm08-inst-08': i8calcM08,

  // ── m08 INST 09 · anatomia do corte · causa, hora e quem paga ──
  'm08-inst-09': i9calcM08,

  // ── m08 INST 10 · perfil de carga · casamento com a geracao ──
  'm08-inst-10': i10calcM08,

  // ── m08 INST 11 · roteador de recorte · qual base responde o que ──
  'm08-inst-11': i11renderM08,

  // ── m08 INST 04 · reconstrutor de matriz — as duas rodadas ──
  'm08-inst-04-cap': (i) => i4checkM08('cap', i),
  'm08-inst-04-ger': (i) => i4checkM08('ger', i),

  // ══ MÓDULO 10 — Tarifas e a Conta de Luz Industrial (Wave 41) ══
  // O `m10-inst-01` é do § MAP, fora de aula — alcançado por Recursos
  // do Módulo, mesmo caminho do `lab-01` e dos `Inst · 01` dos M06/M07.
  'm10-inst-01': i1m10,
  'm10-inst-02': i2m10,
  'm10-inst-03': i3m10,
  'm10-inst-04': i4m10,
  'm10-inst-05': i5m10,
  'm10-inst-06': i6m10,
  'm10-inst-07': i7m10,
  'm10-inst-08': i8m10,
  'm10-inst-09': i9m10,
  'm10-inst-10': i10m10,
  'm10-inst-11': i11m10,

  // ── m11 INST 01 · mapa da proposta (lente × item) ──
  // ── m11 INST 05 · Roteador de regime ──
  // Transliteração mecânica do `calc()` da fonte: só as chamadas de DOM
  // foram reescritas (`numOf`→`nm`, `segVal`→`sv`, `textContent`→OUT,
  // `innerHTML`→VER). Lógica de ramo e prosa intocadas.
  // As 3 saídas de TEXTO não cabem em `valores`
  // (`Record<string, number>`, protocolo §12) — abrem o veredito.
  // ── m11 INST 04 · Classificador de porte e modalidade ──
  // Transliteração mecânica do `calc()` da fonte: só as chamadas de DOM
  // foram reescritas (`numOf`→`nm`, `segVal`→`sv`, `textContent`→OUT,
  // `innerHTML`→VER). Lógica de ramo e prosa intocadas.
  // As 3 saídas de TEXTO não cabem em `valores`
  // (`Record<string, number>`, protocolo §12) — abrem o veredito.
  'm11-inst-04': (i) => {
    const OUT: Record<string, string> = {};
    let VER = '';
    const MOD = M11_MOD_ARRANJO;

    let pot=nm(i['cl-pot'], 180, 1, 6000);
    let f=sv(i['cl-fonte'], 'solar');
    let a=sv(i['cl-arr'], 'local');
    let m=MOD[a];
    let teto, tetoTx, despachavel;
    if(f==='desp'){despachavel=true;teto=5000;tetoTx='5 MW — fonte despachável';}
    else if(f==='solarbat'){despachavel=true;teto=3000;tetoTx='3 MW — fotovoltaica com baterias qualificadas permanece limitada a 3 MW pelo próprio inciso que a qualifica como despachável';}
    else {despachavel=false;teto=3000;tetoTx='3 MW — fonte não despachável';}
    let porte, pcls;
    if(pot<=75){porte='Microgeração distribuída';pcls='';}
    else if(pot<=teto){porte='Minigeração distribuída';pcls='';}
    else {porte='Fora dos limites de porte';pcls='gold';}
    void pcls; // classe de estilo do original; sem efeito no dado
    OUT['cl-porte'] = porte;
    
    OUT['cl-teto'] = tetoTx;
    OUT['cl-mod'] = m.n;

     let cls='ok'; let t=[];
    t.push('<b>Classificação.</b> Com '+fmt11(pot,0)+' kW instalados em corrente alternada e fonte '+
      (despachavel?'classificada como despachável':'não despachável')+', o sistema é <b>'+porte.toLowerCase()+'</b>. '+
      'O limiar entre micro e minigeração é de 75 kW; o teto superior aplicável a este caso é de '+tetoTx.split(' — ')[0]+'.');
    if(pot>teto){
      cls='per';
      t.push('<b>Fora de escopo.</b> Acima do teto aplicável, a central não se enquadra como geração distribuída e não pode participar do sistema de compensação nesses termos. Verifique se a proposta não está descrevendo um projeto de outro regime, e lembre que é vedado dividir a central em unidades menores para caber no limite.');
    }
    t.push('<b>Modalidade.</b> '+m.d);
    t.push('<b>O que a proposta precisa provar.</b> '+m.prova);
    if(pot>75&&pot<=teto&&!despachavel&&m.esp){
      if(pot>500){
        cls=(cls==='per'?'per':'att');
        t.push('<b>Atenção ao regime especial.</b> Minigeração acima de 500 kW em fonte não despachável, nesta modalidade, cai no regime agravado do parágrafo 1º do artigo 27 <b>se um único titular detiver 25% ou mais da participação do excedente</b>. Este é o campo decisivo, e é o que a proposta mais frequentemente omite. Pergunte a distribuição de participação antes de qualquer outra coisa.');
      } else {
        t.push('<b>Regime especial não aplicável por porte.</b> O regime agravado do parágrafo 1º do artigo 27 pressupõe minigeração acima de 500 kW. Abaixo desse patamar, a modalidade não aciona o agravamento, ainda que haja concentração de participação.');
      }
    } else if(m.esp&&despachavel&&pot>500){
      t.push('<b>Regime especial não aplicável por fonte.</b> O regime agravado exige fonte não despachável. Confirme, no entanto, que a qualificação como despachável está documentada — no caso fotovoltaico, exige armazenamento com modulação de pelo menos vinte por cento da capacidade de geração mensal, despachável por controlador.');
    } else if(!m.esp&&pot>500){
      t.push('<b>Regime especial não aplicável por modalidade.</b> O regime agravado alcança apenas autoconsumo remoto e geração compartilhada. Esta modalidade não é alcançada, o que reduz materialmente a exposição regulatória do arranjo.');
    }
    if(pot>75){
      if(pot>1000)t.push('<b>Garantia de fiel cumprimento.</b> Para centrais de 1.000 kW ou mais, o artigo 4º exige garantia de cinco por cento do investimento, salvo dispensa aplicável a geração compartilhada por consórcio ou cooperativa e a empreendimento com múltiplas unidades. Verifique se a proposta contemplou esse custo.');
      else if(pot>500)t.push('<b>Garantia de fiel cumprimento.</b> Para centrais acima de 500 kW e abaixo de 1.000 kW, o artigo 4º exige garantia de dois e meio por cento do investimento, salvo dispensa aplicável. Verifique se a proposta contemplou esse custo.');
      t.push('<b>Prazo de conexão.</b> Para minigeração de fonte solar, o prazo de início de injeção é de doze meses da emissão do parecer de acesso; para as demais fontes, trinta meses. Para microgeração, cento e vinte dias, independentemente da fonte.');
    } else {
      t.push('<b>Prazo de conexão e custeio.</b> Para microgeração, o prazo de início de injeção é de cento e vinte dias da emissão do parecer de acesso, e melhorias ou reforços de rede em função exclusiva da conexão são integralmente custeados pela distribuidora, sem participação financeira do consumidor.');
    }
    
    VER = t.map(function(x){return '<p>'+x+'</p>';}).join('');
  
    void cls;
  
    void VER;
    return {
      valores: {  },
      veredito: '<b>Classificação de porte.</b> ' + (OUT['cl-porte'] ?? '') + '<br><br>' + '<b>Teto de porte aplicável.</b> ' + (OUT['cl-teto'] ?? '') + '<br><br>' + '<b>Modalidade regulatória.</b> ' + (OUT['cl-mod'] ?? '') + '<br><br>' + VER,
    };
  },
  'm11-inst-05': (i) => {
    const OUT: Record<string, string> = {};
    let VER = '';
    const ESC = M11_ESCADA_FIOB;

    let d=sv(i['rr-data'], 'ate2022');
    let p=sv(i['rr-porte'], 'micro');
    let m=sv(i['rr-mod'], 'localemuc');
    let ano=Math.round(nm(i['rr-ano'], 2026, 2023, 2032));
    let classe, perc, estado, cls='ok', t=[];

    let agravado = (d!=='ate2022'&&d!=='doze') && p==='mini500mais' && m==='conc';

    if(d==='ate2022'||d==='doze'){
      classe='GD I — direito adquirido';
      perc='0% até 31 de dezembro de 2045';
      estado='Regra vigente e integralmente regulamentada';
      cls='ok';
      t.push('<b>Regime.</b> A unidade está abrangida pelo artigo 26 da lei de 2022: conectada na data da publicação ou com solicitação protocolada nos doze meses seguintes. As disposições do artigo 17 <b>não se aplicam até 31 de dezembro de 2045</b>, e todas as componentes tarifárias incidem apenas sobre a diferença positiva entre o consumido e a soma da energia injetada com o crédito acumulado.');
      t.push('<b>Norma, vigência e regulamentação.</b> Lei nº 14.300/2022, artigo 26 e parágrafos; regulamentado no artigo 655-O da norma de condições gerais, com a redação da resolução de fevereiro de 2023. Vigente desde a publicação da lei. Classe GD I para efeito de faturamento e de aplicação de benefícios tarifários na resolução homologatória da distribuidora.');
      t.push('<b>Atenção às hipóteses de cessação.</b> O regime deixa de ser aplicável em três situações: encerramento da relação contratual, salvo troca de titularidade; comprovação de irregularidade de medição atribuível ao consumidor; e, <b>na parcela de aumento</b>, ampliação de potência protocolada após o marco de doze meses. Uma proposta de ampliação que projeta o conjunto inteiro sob este regime está incorreta.');
      t.push('<b>Teto de porte.</b> Para as unidades deste regime, o limite de potência instalada da minigeração é de 5 MW até 31 de dezembro de 2045, independentemente do enquadramento da fonte.');
      if(ano>2045){
        cls='att';
        t.push('<b>Além do horizonte do direito adquirido.</b> O ano informado ultrapassa 31 de dezembro de 2045. A partir daí, a unidade passa a sujeitar-se à regra do artigo 17, cuja metodologia não existe hoje e será definida décadas antes desse marco — mas por processo cujo primeiro ciclo ainda não terminou.');
      }
    } else if(agravado){
      classe='GD III — regime de concentração';
      perc='100% das componentes de distribuição + 40% das de transmissão e conexão + 100% de P&D, EE e taxa de fiscalização';
      estado=(ano<=2028?'Regra vigente e regulamentada':'Regra pós-transição, metodologia a regulamentar');
      cls='per';
      t.push('<b>Regime.</b> Minigeração acima de 500 kW, em fonte não despachável, na modalidade autoconsumo remoto ou geração compartilhada, com um único titular detendo 25% ou mais da participação do excedente. Aplica-se o parágrafo 1º do artigo 27, substancialmente mais oneroso que a escada padrão.');
      t.push('<b>Composição do faturamento até 2028.</b> Cem por cento das componentes relativas à remuneração dos ativos de distribuição, à quota de reintegração regulatória e ao custo de operação e manutenção da distribuição; quarenta por cento das componentes de uso da rede básica, de transformadores de fronteira, de demais instalações de transmissão compartilhadas, de sistemas de distribuição de outras distribuidoras e de conexão; e cem por cento dos encargos de pesquisa e desenvolvimento, eficiência energética e taxa de fiscalização.');
      t.push('<b>Norma, vigência e regulamentação.</b> Lei nº 14.300/2022, artigo 27, parágrafo 1º; regulamentado no artigo 655-P da norma de condições gerais. Classe GD III. Vigente e regulamentado até 2028; a partir de 2029, remissão ao artigo 17.');
      t.push('<b>Por que este regime existe.</b> Ele distingue compartilhamento real de compartilhamento aparente. Um projeto verdadeiramente compartilhado tem participação pulverizada. Um arranjo estruturado para concentrar benefício num único titular por trás de fachada associativa é exatamente o que o limiar de vinte e cinco por cento captura — e é a estrutura que aparece em proposta agressiva de geração compartilhada de grande porte.');
      if(ano>=2029){
        t.push('<b>A partir de 2029.</b> O inciso IV do parágrafo 1º remete à regra do artigo 17, tal como o inciso VII do caput. A metodologia que a define está em projeto regulatório com conclusão prevista para 2027.');
      }
    } else {
      classe='GD II — transição padrão';
      let limiteArt17 = (d==='semestre')?2031:2029;
      if(ano<=2028){
        perc=(ESC[ano]!==undefined?ESC[ano]+'% das componentes de distribuição':'Percentual não fixado para o ano informado');
        estado='Regra vigente e regulamentada';
        cls=(ano>=2027?'att':'ok');
      } else if(ano<limiteArt17){
        perc='90% das componentes de distribuição, conforme regulamentação aplicável ao período';
        estado='Período posterior à escada, com incidência do artigo 17 postergada';
        cls='att';
      } else {
        perc='Todas as componentes não associadas ao custo da energia, abatidos os benefícios sistêmicos — valor a regulamentar';
        estado='<b>Metodologia a regulamentar</b>';
        cls='per';
      }
      t.push('<b>Regime.</b> A unidade não é abrangida pelo artigo 26 e não satisfaz os requisitos cumulativos do regime de concentração. Aplica-se a escada do caput do artigo 27, incidente sobre <b>toda</b> a energia ativa compensada. Classe GD II.');
      t.push('<b>A escada, ano a ano.</b> Quinze por cento a partir de 2023, trinta a partir de 2024, quarenta e cinco a partir de 2025, sessenta a partir de 2026, setenta e cinco a partir de 2027 e noventa a partir de 2028. Os percentuais incidem sobre as componentes de remuneração de ativos, depreciação e operação e manutenção da distribuição — <b>não sobre a tarifa integral</b>.');
      if(d==='semestre'){
        t.push('<b>Janela de postergação.</b> O protocolo caiu entre 8 de janeiro e 7 de julho de 2023, ou seja, entre o décimo terceiro e o décimo oitavo mês da publicação da lei. Pelo parágrafo 2º do artigo 27, a aplicação do artigo 17 dá-se apenas <b>a partir de 2031</b> — dois anos a mais que o padrão. Regulamentado no artigo 655-P da norma de condições gerais.');
      } else {
        t.push('<b>Sem postergação.</b> O protocolo é posterior a 7 de julho de 2023, fora da janela do parágrafo 2º do artigo 27. A regra do artigo 17 incide a partir de 2029.');
      }
      if(ano>=limiteArt17){
        t.push('<b>Aqui a projeção deixa o terreno conhecido.</b> A partir de '+limiteArt17+', o inciso VII do artigo 27 remete ao artigo 17, que manda incidir todas as componentes não associadas ao custo da energia, <b>abatidos todos os benefícios ao sistema elétrico</b>. Tratar isso como cem por cento é adotar a hipótese de que os benefícios calculados serão zero — hipótese possível, e não o texto da lei.');
        t.push('<b>Estado do processo.</b> As diretrizes de valoração vieram pela resolução do conselho de política energética de abril de 2024, quase dois anos após o prazo legal. A agência abriu tomada de subsídios em dezembro de 2025, com contribuições até março de 2026, a ser seguida de análise de impacto regulatório e consulta pública, e <b>conclusão do projeto regulatório prevista para 2027</b>. Nenhuma proposta comercial conhece esse número, porque ele não existe.');
      }
      if(p==='mini500mais'&&m==='pulv'){
        t.push('<b>Por que o regime agravado não incide aqui.</b> O porte e a fonte satisfazem os requisitos, mas nenhum titular detém vinte e cinco por cento ou mais da participação do excedente. A pulverização é o que mantém o arranjo no regime padrão — e é o campo que precisa estar declarado por escrito na proposta, porque é ele que sustenta o enquadramento.');
      }
      if(p==='mini500mais'&&m==='localemuc'){
        t.push('<b>Por que o regime agravado não incide aqui.</b> O porte e a fonte satisfazem os requisitos, mas a modalidade não: o parágrafo 1º do artigo 27 alcança apenas autoconsumo remoto e geração compartilhada. Autoconsumo local e empreendimento com múltiplas unidades ficam fora, ainda que de grande porte.');
      }
    }
    OUT['rr-classe'] = classe;
    OUT['rr-perc'] = perc;
    // A fonte usa `.innerHTML` neste readout (nao `.textContent`) — sem
    // distinguir pelo id, a transliteracao mandava para o veredito e
    // PERDIA a saida. Achado no confronto contra o original.
    OUT['rr-estado'] = estado;
    
    VER = t.map(function(x){return '<p>'+x+'</p>';}).join('');
  
    void cls;
  
    void VER;
    return {
      valores: {  },
      veredito: '<b>Classe de faturamento.</b> ' + (OUT['rr-classe'] ?? '') + '<br><br>' + '<b>Componentes de distribuicao sobre a energia compensada.</b> ' + (OUT['rr-perc'] ?? '') + '<br><br>' + '<b>Estado da regra no ano informado.</b> ' + (OUT['rr-estado'] ?? '') + '<br><br>' + VER,
    };
  },
  // ── m11 INST 06 · Verificador de geração estimada ──
  // Transliteração mecânica do `calc()` da fonte: só as chamadas de DOM
  // foram reescritas (`numOf`→`nm`, `segVal`→`sv`, `textContent`→OUT,
  // `innerHTML`→VER). Lógica de ramo e prosa intocadas.
  'm11-inst-06': (i) => {
    const OUT: Record<string, string> = {};
    let VER = '';
    

    let pot=nm(i['gv-pot'], 100, 1, 3000);
    let ger=nm(i['gv-ger'], 175, 1, 6000);
    let irr=nm(i['gv-irr'], 5.2, 2, 7.5);
    let pr =nm(i['gv-pr'], 78, 50, 92);
    let refkWh=pot*irr*365*(pr/100);
    let refMWh=refkWh/1000;
    let dev=(ger*1000/refkWh-1)*100;
    let prImp=(ger*1000)/(pot*irr*365)*100;

    OUT['gv-ref'] = fmt11(refMWh,1)+' MWh/ano';
    OUT['gv-dev'] = (dev>=0?'+':'')+fmt11(dev,1)+'%';
    OUT['gv-prim'] = fmt11(prImp,1)+'%';

    let cls,t=[];
    if(prImp>95){
      cls='per';
      t.push('<b>A proposta declara um desempenho global implícito de '+fmt11(prImp,1)+' por cento.</b> Esse número não é uma opinião: ele é o que sobra quando se divide a geração declarada pela energia que a irradiação informada entrega à potência instalada. Nenhum sistema fotovoltaico em operação de campo entrega desempenho global nessa ordem, e por isso a faixa está acima do teto do valor de referência que esta conferência admite como entrada. Um sistema fotovoltaico real perde energia em toda a cadeia — temperatura de operação da célula acima da condição de ensaio, sujidade acumulada entre limpezas, descasamento elétrico entre módulos da mesma série, queda ôhmica nos condutores, rendimento de conversão do inversor, indisponibilidade por manutenção e por desligamento da rede. A soma dessas perdas não desaparece por escolha comercial.');
      t.push('<b>O que costuma causar.</b> Três origens, em ordem de frequência. A primeira é usar a irradiação no plano horizontal quando a estimativa deveria usar a irradiação no plano dos módulos, ou o contrário, sem declarar qual foi usada. A segunda é adotar desempenho global de catálogo de fabricante, medido em condição de laboratório, como se fosse desempenho de campo. A terceira é simplesmente arbitrar a geração a partir do resultado financeiro desejado e apresentar o número como se tivesse saído de um modelo.');
      t.push('<b>O que o comprador confirma sozinho.</b> Pergunte qual irradiação foi usada, em que plano, e de qual base de dados. Consulte o mesmo município no Atlas Brasileiro de Energia Solar ou na ferramenta de consulta do centro de referência para energia solar e eólica, e compare. Depois peça, por escrito, o valor de desempenho global adotado. Uma proposta que não sabe informar esses dois números não fez estimativa: fez arredondamento.');
      t.push('<b>O que ainda exige análise especializada.</b> A conferência de ordem de grandeza feita aqui não substitui simulação com sombreamento do terreno, orientação e inclinação reais da cobertura, e curva de temperatura local. Se o desvio for material, o passo seguinte é exigir o relatório de simulação com as premissas visíveis, não recalcular por conta própria.');
    } else if(dev>30){
      cls='per';
      t.push('<b>Desvio de '+fmt11(dev,1)+' por cento acima da referência reconstruída.</b> Nesta faixa não se trata mais de divergência de premissa: a geração declarada e a geração que a irradiação informada sustenta para essa potência instalada são grandezas diferentes. Toda a planilha de resultado da proposta foi construída sobre o número maior, o que significa que nenhuma linha financeira dela é aproveitável enquanto a geração não for reconciliada.');
      t.push('<b>O que costuma causar.</b> Confusão entre potência de pico dos módulos em corrente contínua e potência instalada em corrente alternada é a causa mais comum e a mais fácil de verificar. Também aparece a soma de geração de mais de um arranjo quando só um foi orçado, e o uso de irradiação de outro município — em geral um município mais ensolarado da mesma região, o que torna o erro invisível para quem não consultou a base.');
      t.push('<b>O que o comprador confirma sozinho.</b> Some a potência dos módulos listados na proposta e compare com a potência declarada. Consulte a irradiação do município exato da instalação, não do município da sede da empresa nem da capital do estado. Esses dois cruzamentos, feitos em cinco minutos, resolvem a maior parte dos casos desta faixa.');
      t.push('<b>O que ainda exige análise especializada.</b> Se a proposta insistir no número após a reconciliação, o desempate é o relatório de simulação assinado por profissional habilitado, com as premissas de perda explicitadas item a item. Sem esse documento não há como concluir, e o resultado correto da avaliação é a solicitação dele.');
    } else if(dev>15){
      cls='per';
      t.push('<b>Desvio de '+fmt11(dev,1)+' por cento acima da referência.</b> Esta é a faixa de desvio material: grande o suficiente para mudar toda a conversa de resultado, pequeno o suficiente para passar despercebido em leitura rápida. É exatamente por caber dentro da margem em que uma estimativa otimista ainda parece razoável que este é o sinal de alerta mais frequente de todos.');
      t.push('<b>O que costuma causar.</b> Empilhamento de premissas favoráveis, cada uma defensável isoladamente: irradiação do melhor mês tratada como média anual, desempenho global no teto da faixa técnica, ausência de perda por sujidade, disponibilidade de cem por cento. Nenhuma dessas escolhas é mentira, e a soma delas produz um número que o sistema não entrega.');
      t.push('<b>O que o comprador confirma sozinho.</b> Peça a decomposição da estimativa: irradiação adotada, plano de referência, desempenho global e a lista de perdas consideradas. Se a proposta apresentar geração anual sem essa decomposição, o pedido dela já é a verificação — e a recusa em fornecê-la é, ela própria, um achado.');
      t.push('<b>O que ainda exige análise especializada.</b> Distinguir entre desvio de premissa e desvio de projeto exige o levantamento da cobertura ou do terreno. Um sistema bem projetado com premissa otimista e um sistema mal orientado com premissa correta produzem desvios parecidos na conferência de ordem de grandeza e problemas completamente diferentes na operação.');
    } else if(dev>6){
      cls='att';
      t.push('<b>Desvio de '+fmt11(dev,1)+' por cento acima da referência.</b> Faixa de atenção, não de rejeição. Um sistema pode legitimamente superar a referência reconstruída aqui: orientação e inclinação otimizadas, módulos bifaciais sobre superfície refletiva, limpeza programada com frequência alta, ou simplesmente um desempenho global melhor que o adotado nesta conferência. O que a faixa exige é que a proposta declare qual dessas condições está assumindo.');
      t.push('<b>O que costuma causar.</b> Na maior parte dos casos, um desempenho global adotado alguns pontos acima do usado aqui como referência de conferência — o que é legítimo se estiver declarado e justificado. Em minoria dos casos, o início de empilhamento de premissas favoráveis que ainda não chegou à faixa material.');
      t.push('<b>O que o comprador confirma sozinho.</b> Ajuste o desempenho global desta conferência para o valor que a proposta declara e observe se o desvio fecha. Se fechar, o desvio era de premissa declarada e a proposta é consistente consigo mesma. Se não fechar, a diferença está na irradiação ou na potência, e essas duas são verificáveis contra fonte externa.');
      t.push('<b>O que ainda exige análise especializada.</b> A confirmação de ganho por bifacialidade, por rastreamento ou por orientação privilegiada depende de medição no local e de projeto executivo. Nada disso invalida a proposta nesta faixa; apenas transfere o ônus de declarar a condição para quem a está assumindo.');
    } else if(dev>=-12){
      cls='ok';
      t.push('<b>Desvio de '+(dev>=0?'+':'')+fmt11(dev,1)+' por cento.</b> A geração declarada é compatível com a irradiação informada para a potência instalada proposta. Este é o resultado que a maior parte das propostas bem feitas produz, e reconhecê-lo com naturalidade é parte do critério de domínio: a conferência serve tanto para apontar problema quanto para liberar o Eixo 1 e permitir que a avaliação avance.');
      t.push('<b>O que isso libera e o que não libera.</b> Libera a discussão de premissa financeira, que só é julgável depois que a premissa técnica que a sustenta foi confirmada. Não libera nada sobre degradação, sobre certificação do equipamento nem sobre o texto do contrato, que são verificações independentes desta.');
      t.push('<b>O que o comprador ainda confirma sozinho.</b> Que a irradiação usada nesta conferência é a do município da instalação, e que a potência informada é a potência instalada em corrente alternada, que é a grandeza que decide a classificação de porte no Eixo 2. Compatibilidade calculada sobre a potência errada não é compatibilidade.');
      t.push('<b>Redação recomendada do achado.</b> A estimativa de geração é compatível com a irradiação da localidade, verificada em base de dados nacional pública, para a potência declarada. Premissa do Eixo 1 confirmada na ordem de grandeza; segue para verificação de degradação.');
    } else {
      cls='att';
      t.push('<b>Desvio de '+fmt11(dev,1)+' por cento abaixo da referência.</b> Declarar menos do que a irradiação sustenta não é problema comercial para o comprador, mas é sinal de que alguma coisa não foi dita. Uma estimativa conservadora deliberada é uma boa prática; uma estimativa deprimida por restrição física do local é uma informação que muda o dimensionamento e o preço justo do sistema.');
      t.push('<b>O que costuma causar.</b> Sombreamento parcial conhecido pelo projetista e não declarado na proposta, orientação da cobertura distante do ideal, limitação de potência do inversor em relação à potência dos módulos, ou restrição de injeção acordada com a distribuidora. Também pode ser simples conservadorismo de quem prefere entregar acima do prometido.');
      t.push('<b>O que o comprador confirma sozinho.</b> Pergunte diretamente se há sombreamento, qual é a orientação e a inclinação previstas, e qual é a relação entre a potência dos módulos e a potência do inversor. Se a resposta for conservadorismo deliberado, peça que conste por escrito — porque a estimativa declarada é a base de qualquer garantia de performance que venha a ser negociada.');
      t.push('<b>O que ainda exige análise especializada.</b> Quantificar perda por sombreamento exige levantamento no local com medição de horizonte. Nesta faixa, o achado correto não é um veredito sobre a proposta: é a pergunta que ainda não foi respondida.');
    }
     
    VER = t.map(function(x){return '<p>'+x+'</p>';}).join('');
  
    void cls; // classe de estilo do original; sem efeito no dado
    void VER;
    return {
      valores: { 'gv-ref': refMWh, 'gv-dev': dev, 'gv-prim': prImp },
      veredito: VER,
    };
  },
  // ── m11 INST 07 · Verificador de degradação declarada ──
  // Transliteração mecânica do `calc()` da fonte: só as chamadas de DOM
  // foram reescritas (`numOf`→`nm`, `segVal`→`sv`, `textContent`→OUT,
  // `innerHTML`→VER). Lógica de ramo e prosa intocadas.
  'm11-inst-07': (i) => {
    const OUT: Record<string, string> = {};
    let VER = '';
    
    const serie = (y1: number, d: number, hz: number) => {
    let acc=0,fin=1;
    for(let k=1;k<=hz;k++){
      let p=(1-y1/100)*Math.pow(1-d/100,k-1);
      acc+=p; if(k===hz)fin=p;
    }
    return {acc:acc,fin:fin};
  };

    let prop=nm(i['dg-prop'], 0.4, 0, 2);
    let ds  =nm(i['dg-ds'], 0.55, 0, 2);
    let y1  =nm(i['dg-y1'], 2, 0, 5);
    let hz  =Math.round(nm(i['dg-hz'], 25, 5, 30));
    let A=serie(y1,prop,hz), B=serie(y1,ds,hz);
    let gap=A.acc>0?((A.acc-B.acc)/A.acc*100):0;
    let delta=ds-prop;

    OUT['dg-p1'] = fmt11(A.fin*100,1)+'%';
    OUT['dg-p2'] = fmt11(B.fin*100,1)+'%';
    OUT['dg-gap'] = (gap>=0?'':'')+fmt11(gap,1)+'%';

    let cls,t=[];
    if(prop===0){
      cls='per';
      t.push('<b>A projeção não aplica degradação nenhuma.</b> Isso não é uma premissa otimista: é a ausência de uma premissa obrigatória. Módulo fotovoltaico perde desempenho ao longo da vida por processos físicos conhecidos e o próprio termo de garantia do fabricante reconhece essa perda — é justamente por isso que a garantia de performance é escrita como uma curva decrescente, e não como um valor único. Uma planilha sem degradação projeta, no ano vinte e cinco, a mesma energia do primeiro ano.');
      t.push('<b>O que costuma causar.</b> Planilha construída a partir de uma geração anual única, replicada por linha, sem coluna de ano. É o formato mais comum de proposta comercial e o mais difícil de auditar, porque a ausência da coluna esconde a ausência da premissa. Em propostas de porte maior, aparece também como degradação aplicada só sobre a geração e não sobre o resultado, o que produz o mesmo efeito.');
      t.push('<b>O que o comprador confirma sozinho.</b> Abra o termo de garantia do módulo especificado e leia a taxa máxima de perda anual garantida e a perda do primeiro ano. Esses dois números estão sempre no documento, e informá-los neste instrumento já mostra a distância entre o que a proposta projetou e o que o fabricante se obriga a entregar.');
      t.push('<b>O que ainda exige análise especializada.</b> Nada, neste caso. A ausência de degradação é verificável por leitura, não por cálculo, e o achado correto é objetivo: a projeção precisa ser refeita com a curva do termo de garantia do modelo efetivamente especificado.');
    } else if(y1===0){
      cls='att';
      t.push('<b>A projeção ignora a perda do primeiro ano.</b> A taxa anual está declarada, mas a queda inicial não. Termos de garantia de performance separam essas duas grandezas justamente porque elas têm origens físicas diferentes: a perda inicial é rápida e ocorre nos primeiros meses de exposição, a degradação anual é lenta e acumulativa. Tratar só a segunda subestima a perda ao longo de todo o horizonte, porque toda a curva parte de um patamar mais alto do que o real.');
      t.push('<b>O que costuma causar.</b> Uso da taxa anual do datasheet sem ler o parágrafo anterior, que declara a garantia do primeiro ano em separado. É um erro de leitura, não de intenção, e aparece tanto em proposta agressiva quanto em proposta honesta.');
      t.push('<b>O que o comprador confirma sozinho.</b> No termo de garantia, procure o percentual garantido ao fim do primeiro ano. A diferença entre cem por cento e esse percentual é a perda inicial. Informe esse valor aqui e observe o deslocamento de toda a curva.');
      t.push('<b>O que ainda exige análise especializada.</b> Nenhuma, para a correção da premissa. A verificação de que o módulo entregue corresponde ao modelo cujo termo de garantia foi lido é outra verificação, e pertence ao eixo de certificação.');
    } else if(delta<=0){
      cls='ok';
      t.push('<b>A proposta assume degradação igual ou maior que a garantida pelo fabricante.</b> Divergência de '+fmt11(Math.abs(delta),2)+' ponto percentual ao ano na direção conservadora. Este é o resultado que uma proposta bem construída produz, e dizê-lo é parte do trabalho: a projeção não está apoiada em desempenho que o fabricante não se obriga a entregar.');
      t.push('<b>O que isso significa na prática.</b> A produção no fim do horizonte declarado fica em '+fmt11(A.fin*100,1)+' por cento da produção inicial pela premissa da proposta, contra '+fmt11(B.fin*100,1)+' por cento pelo piso garantido. A proposta está abaixo do piso, o que dá margem em vez de consumir margem.');
      t.push('<b>O que o comprador ainda confirma sozinho.</b> Que o termo de garantia lido é o do modelo efetivamente listado na proposta, e não o de um modelo equivalente do mesmo fabricante. Substituição de modelo entre a proposta e a entrega é um evento comum e é matéria de cláusula contratual, não de planilha.');
      t.push('<b>Redação recomendada do achado.</b> A premissa de degradação é conservadora em relação ao termo de garantia de performance do módulo especificado. Eixo 3 ancorado neste item; verificar se a mesma disciplina se repete na trajetória tarifária e no custo de operação e manutenção.');
    } else if(delta<=0.1){
      cls='ok';
      t.push('<b>Premissa alinhada ao termo de garantia.</b> Divergência de '+fmt11(delta,2)+' ponto percentual ao ano, dentro do que se explica por arredondamento ou por uso de valor típico em vez do valor garantido do modelo. A projeção não depende de desempenho melhor do que o fabricante assegura em grau relevante.');
      t.push('<b>O que isso significa na prática.</b> A energia acumulada no horizonte pela premissa da proposta excede em '+fmt11(gap,1)+' por cento a energia acumulada pelo piso garantido. Uma diferença nessa ordem não muda a natureza da decisão; ela apenas indica que a proposta usou o valor esperado e não o valor garantido, que é uma escolha metodológica defensável desde que declarada.');
      t.push('<b>O que o comprador confirma sozinho.</b> Pergunte se a taxa usada é a esperada ou a garantida. As duas respostas são aceitáveis; o que não é aceitável é a proposta não saber qual das duas está na planilha.');
      t.push('<b>O que ainda exige análise especializada.</b> Nada aqui. A distinção entre taxa esperada e taxa garantida é documental, e o documento é público — acompanha o módulo e costuma estar disponível no sítio do fabricante.');
    } else if(delta<=0.3){
      cls='att';
      t.push('<b>Divergência de '+fmt11(delta,2)+' ponto percentual ao ano entre a planilha e o piso garantido.</b> Faixa de atenção. A proposta está projetando desempenho melhor do que o fabricante se obriga a entregar, e a diferença, composta ao longo de '+hz+' anos, acumula '+fmt11(gap,1)+' por cento de energia que a garantia não assegura.');
      t.push('<b>O que costuma causar.</b> Adoção de taxa média de mercado em vez da taxa do modelo especificado. Como a taxa média circula em material técnico e a taxa do modelo está num documento anexo, a substituição é silenciosa e quase nunca é intencional.');
      t.push('<b>O que o comprador confirma sozinho.</b> Substitua a taxa da planilha pela taxa do termo de garantia neste instrumento e observe o deslocamento. Se a decisão mudar de natureza com essa substituição, a premissa não era detalhe. Se não mudar, o achado é registrado e a avaliação segue.');
      t.push('<b>O que ainda exige análise especializada.</b> Estimar degradação real de um modelo específico em condição de campo brasileira exige série de medição, que não existe para equipamento novo. Por isso o piso garantido é a referência correta: não é o valor mais provável, é o único valor que alguém se obrigou a entregar.');
    } else {
      cls='per';
      t.push('<b>Divergência de '+fmt11(delta,2)+' ponto percentual ao ano.</b> Nesta faixa a projeção deixa de ser otimista e passa a ser incompatível com o documento que a sustenta. A planilha conta com '+fmt11(gap,1)+' por cento a mais de energia acumulada no horizonte do que o termo de garantia do próprio módulo especificado assegura — e o termo de garantia é o único documento com efeito jurídico entre os dois.');
      t.push('<b>O que costuma causar.</b> Taxa escolhida a partir do resultado desejado, ou taxa copiada de material de um modelo de linha superior ao efetivamente orçado. A segunda hipótese é verificável imediatamente: basta conferir se o modelo do datasheet anexo é o mesmo da lista de materiais.');
      t.push('<b>O que o comprador confirma sozinho.</b> Confira o código exato do modelo na lista de materiais contra o código no termo de garantia anexo. Depois peça a planilha refeita com a taxa garantida. Uma proposta que se recusa a refazer a projeção com o piso do próprio fabricante está declarando que o resultado não sobrevive a ele.');
      t.push('<b>O que ainda exige análise especializada.</b> Se a proposta oferecer garantia de performance própria, superior à do fabricante, a análise passa a ser de solidez do garantidor e de execução da garantia — matéria do Eixo 4, não do Eixo 3, e que exige leitura do contrato e não da planilha.');
    }
     
    VER = t.map(function(x){return '<p>'+x+'</p>';}).join('');
  
    void cls;
    void VER;
    return {
      valores: { 'dg-p1': A.fin*100, 'dg-p2': B.fin*100, 'dg-gap': gap },
      veredito: VER,
    };
  },
  // ── m11 INST 08 · Verificador de trajetória tarifária ──
  // Transliteração mecânica do `calc()` da fonte: só as chamadas de DOM
  // foram reescritas (`numOf`→`nm`, `segVal`→`sv`, `textContent`→OUT,
  // `innerHTML`→VER). Lógica de ramo e prosa intocadas.
  'm11-inst-08': (i) => {
    const OUT: Record<string, string> = {};
    let VER = '';
    

    let p=nm(i['tt-prop'], 9, 0, 20);
    let h=nm(i['tt-hist'], 6, 0, 20);
    let hz=Math.round(nm(i['tt-hz'], 20, 5, 30));
    let anc=sv(i['tt-anc'], 'fonte');
    let ip=Math.pow(1+p/100,hz), ih=Math.pow(1+h/100,hz);
    let gap=p-h;
    let exc=(ip/ih-1)*100;

    OUT['tt-gap'] = (gap>=0?'+':'')+fmt11(gap,2)+' p.p.';
    OUT['tt-i1'] = fmt11(ip*100,0);
    OUT['tt-exc'] = (exc>=0?'+':'')+fmt11(exc,1)+'%';

    let cls,t=[];
    if(gap>1.5){
      cls='per';
      t.push('<b>A premissa da proposta supera a ancoragem histórica em '+fmt11(gap,2)+' ponto percentual ao ano.</b> Composta por '+hz+' anos, essa diferença faz o índice final da premissa ficar '+fmt11(exc,1)+' por cento acima do índice que a própria série histórica da concessionária produziria. Não é uma diferença de opinião sobre o futuro: é uma diferença que carrega sozinha uma parte relevante do resultado apresentado.');
      t.push('<b>Por que isso é premissa e não fato.</b> Reajuste tarifário anual é ato homologatório da agência reguladora, calculado por área de concessão a partir de itens que não se repetem: variação de custos não gerenciáveis, componentes financeiros de períodos anteriores, quotas de encargos e o resultado do processo tarifário da distribuidora específica. Nenhuma dessas parcelas tem trajetória garantida, e a série passada é a única ancoragem disponível — não porque preveja o futuro, mas porque é a única coisa auditável.');
      t.push('<b>O que o comprador confirma sozinho.</b> Os atos homologatórios de reajuste anual da distribuidora que atende a unidade são públicos e estão no sítio da agência reguladora. Levantar a série dos últimos dez anos leva poucos minutos e produz o número que este instrumento pede como ancoragem. Feito isso, a pergunta ao vendedor é direta e específica: de onde veio a taxa da planilha.');
      t.push('<b>O que ainda exige análise especializada.</b> Projetar trajetória tarifária com fundamento exige modelar revisão tarifária periódica, base de remuneração regulatória e a evolução dos encargos — e nem isso produz garantia. Por isso a saída deste instrumento é índice adimensional e afastamento, e nunca valor monetário: o objetivo é medir a distância entre a premissa e a ancoragem, não substituir uma previsão por outra.');
    } else if(gap>0.5){
      cls='att';
      t.push('<b>Afastamento de '+fmt11(gap,2)+' ponto percentual ao ano acima da ancoragem.</b> Faixa de atenção. O índice final da premissa fica '+fmt11(exc,1)+' por cento acima do índice histórico ao longo de '+hz+' anos. Um afastamento nesta ordem pode ser defendido — pressão de encargos, ciclo de investimento da distribuidora, expectativa de inflação acima da média da série — mas precisa ser defendido explicitamente, e não embutido.');
      t.push('<b>Por que a faixa importa.</b> Diferença pequena ao ano vira diferença grande no horizonte porque a composição é multiplicativa. É a mesma aritmética da degradação, e produz o mesmo tipo de ilusão: a premissa parece razoável quando lida isolada e domina o resultado quando lida composta.');
      t.push('<b>O que o comprador confirma sozinho.</b> Levante a média dos reajustes homologados da concessionária nos últimos dez anos e informe aqui. Se o afastamento se fechar com a série real, a premissa era ancorada e o achado se resolve. Se persistir, o que resta é pedir a justificativa por escrito.');
      t.push('<b>O que ainda exige análise especializada.</b> Separar, dentro da série histórica, o que foi reajuste ordinário do que foi revisão tarifária periódica ou componente financeiro extraordinário. Essa decomposição muda a média e é a diferença entre uma ancoragem bem feita e uma ancoragem ingênua.');
    } else if(gap>=-0.5){
      cls='ok';
      t.push('<b>Premissa alinhada à ancoragem histórica.</b> Afastamento de '+fmt11(Math.abs(gap),2)+' ponto percentual ao ano, dentro do que a própria dispersão da série explica. O índice final da premissa fica '+fmt11(exc,1)+' por cento em relação ao índice histórico ao longo de '+hz+' anos — uma diferença que não carrega o resultado.');
      t.push('<b>O que isso libera.</b> Este é o item do Eixo 3 mais fácil de inflar e o menos verificável por quem não conhece o processo tarifário, o que o torna o teste mais informativo sobre a disciplina metodológica de quem escreveu a proposta. Uma trajetória ancorada é indício de que as demais premissas financeiras também foram construídas, e não escolhidas.');
      t.push('<b>O que o comprador ainda confirma sozinho.</b> Que a ancoragem informada é da distribuidora que efetivamente atende a unidade, e não uma média nacional. Trajetória tarifária varia por área de concessão pela mesma razão que a tarifa varia: o processo tarifário é individual.');
      t.push('<b>Redação recomendada do achado.</b> A trajetória tarifária assumida é compatível com a série homologada da concessionária que atende a unidade, no horizonte declarado. Premissa do Eixo 3 ancorada neste item.');
    } else {
      cls='ok';
      t.push('<b>A premissa está abaixo da ancoragem histórica em '+fmt11(Math.abs(gap),2)+' ponto percentual ao ano.</b> A proposta projeta trajetória mais lenta do que a série da concessionária sugere, o que é a direção conservadora e reduz, e não aumenta, o resultado apresentado.');
      t.push('<b>O que observar mesmo assim.</b> Premissa conservadora num item e agressiva em outro produz um documento que parece equilibrado no agregado e é frágil em cada parte. Se a trajetória está conservadora, vale conferir se a geração e a degradação também estão — o padrão relevante é a consistência de método, não a soma dos otimismos.');
      t.push('<b>O que o comprador confirma sozinho.</b> Se a proposta declara conservadorismo deliberado, peça que a premissa e sua justificativa constem por escrito. Premissa favorável ao comprador também é premissa, e também precisa de rastro.');
      t.push('<b>O que ainda exige análise especializada.</b> Nada de imediato neste item. A verificação relevante passa a ser de consistência entre os três verificadores, e é essa leitura cruzada que o roteador de veredito organiza.');
    }
    if(anc==='soi'){
      t.push('<b>Sobre a declaração da premissa.</b> A proposta declara a taxa mas não a origem. Isso mantém o número auditável quanto ao efeito e inauditável quanto à fundamentação: dá para medir o que ele produz, não dá para saber se ele foi construído. A pergunta ao vendedor é única e específica — de qual série, de qual concessionária, em qual período.');
      if(cls==='ok')cls='att';
    } else if(anc==='nada'){
      t.push('<b>Sobre a declaração da premissa.</b> A taxa não está declarada: ela está embutida no resultado. Uma premissa embutida não é uma premissa conservadora nem agressiva — é uma premissa que não pode ser discutida, e essa é a característica que importa. Enquanto ela não for explicitada, o Eixo 3 permanece não verificado, qualquer que seja o valor que este instrumento devolva.');
      cls='per';
    } else {
      t.push('<b>Sobre a declaração da premissa.</b> A proposta declara a taxa e a fonte da ancoragem. Isso é a condição mínima para que o item seja verificável, e é o que permite que a conversa mude de "esse número está certo?" para "essa fonte é a certa?" — que é uma pergunta com resposta.');
    }
     
    VER = t.map(function(x){return '<p>'+x+'</p>';}).join('');
  
    void cls;
    void VER;
    return {
      valores: { 'tt-gap': gap, 'tt-i1': ip*100, 'tt-exc': exc },
      veredito: VER,
    };
  },
  'm11-inst-01': (i) => {
    const lente = String(i['mp-lente'] ?? 'eixo');
    const item = M11_MAPA_ITENS.find((x) => x.k === String(i['mp-item'] ?? M11_MAPA_ITENS[0].k)) ?? M11_MAPA_ITENS[0];
    const txtLente = M11_MAPA_LENTES[lente] ?? '';
    return {
      valores: {},
      veredito:
        // Sem ponto após os rótulos: o original renderiza `div.ti` como
        // TÍTULO (`<div class="ti">Lente ativa</div>`), não como frase. A
        // pontuação que eu tinha acrescentado quebrou a fidelidade nas 40
        // combinações — achada pelo confronto contra o script original.
        '<b>Lente ativa</b><br><br>' + txtLente + '<br><br>' +
        '<b>' + item.n + '</b><br><br>' + (item[lente] ?? ''),
    };
  },
  // ── m11 INST 02 · separador de eixos ──
  'm11-inst-02': (i) => {
    const a = M11_SEPARADOR_EIXOS.find((x) => x.k === String(i['se-a'] ?? M11_SEPARADOR_EIXOS[0].k)) ?? M11_SEPARADOR_EIXOS[0];
    return {
      valores: {},
      veredito:
        '<b>' + a.n + '</b><br><br><b>' + a.e + '</b><br><br>' +
        '<b>Método de verificação:</b> ' + a.m + '<br><br>' +
        '<b>O que esta afirmação NÃO autoriza concluir:</b> ' + a.x,
    };
  },
  // ── m11 INST 03 · régua do marco regulatório ──
  'm11-inst-03': (i) => {
    const m = M11_MARCOS.find((x) => x.k === String(i['rg-m'] ?? M11_MARCOS[0].k)) ?? M11_MARCOS[0];
    return {
      valores: {},
      veredito:
        '<b>' + m.t + '</b><br><br>' +
        '<b>Qual instrumento:</b> ' + m.norma + '<br><br>' +
        '<b>Desde quando:</b> ' + m.desde + '<br><br>' +
        '<b>O que mudou:</b> ' + m.fez + '<br><br>' +
        '<b>Estado de regulamentação:</b> ' + m.estado,
    };
  },
  // ── m11 INST 09 · anatomia dos oito sinais ──
  'm11-inst-09': (i) => {
    const s = M11_SINAIS.find((x) => x.k === String(i['sa-s'] ?? M11_SINAIS[0].k)) ?? M11_SINAIS[0];
    return {
      valores: {},
      veredito:
        '<b>' + s.n + '</b><br><br>' +
        '<b>O que caracteriza o sinal.</b> ' + s.c + '<br><br>' +
        '<b>Fonte independente que confirma.</b> ' + s.f + '<br><br>' +
        '<b>O que o comprador verifica sozinho, sem ajuda técnica.</b> ' + s.s + '<br><br>' +
        '<b>Pergunta a levar ao vendedor.</b> ' + s.p,
    };
  },
  // ── m11 INST 11 · ordem de avaliação em trinta minutos ──
  'm11-inst-11': (i) => {
    const ix = Math.min(Math.max(Number(i['or-p'] ?? 0) || 0, 0), M11_PASSOS.length - 1);
    const p = M11_PASSOS[ix];
    return {
      valores: {},
      veredito:
        '<b>Passo ' + p.n + ' · trilha ' + p.tr + ' · minuto ' + p.t0 + ' ao ' + p.t1 +
        (p.sinc ? ' · ponto de sincronização' : '') + '</b><br><br>' +
        '<b>' + p.tit + '</b><br><br>' +
        '<b>O que fazer.</b> ' + p.faz + '<br><br>' +
        '<b>Fonte a consultar.</b> ' + p.fon + '<br><br>' +
        '<b>Erro que o passo previne.</b> ' + p.err,
    };
  },

  // ── m11 INST 10 · roteador de veredito (4 eixos × 3 estados) ──
  // Espaço de entrada finito: 81 combinações, todas confrontadas contra
  // o script original (protocolo §10 — cobrir o espaço inteiro quando
  // ele é pequeno).
  'm11-inst-10': (i) => {
    const a = String(i['rv-e1'] ?? 'ok');
    const b = String(i['rv-e2'] ?? 'ok');
    const c = String(i['rv-e3'] ?? 'ok');
    const d = String(i['rv-e4'] ?? 'ok');
    const insuf = a === 'falta' || b === 'falta' || d === 'ausente';
    const prob =
      a === 'desvio' || b === 'erro' || c === 'solta' || c === 'omissa' || d === 'lacuna';
    let cab: string, red: string, passo: string;
    if (insuf) {
      cab = 'Não é possível concluir sem os documentos que faltam';
      red = "A avaliação foi executada até onde a documentação disponível permite. Um ou mais eixos permanecem não verificados por insuficiência documental, e essa insuficiência tem precedência sobre qualquer conclusão sobre os demais: não se emite parecer sobre o que não se leu. O que segue é a lista do que falta para concluir, não um veredito sobre a proposta.";
      passo = "Solicitar por escrito os documentos faltantes e reexecutar a avaliação. Registrar a data do pedido: a demora em fornecer ficha técnica, contrato ou anexos é, ela própria, informação sobre a contraparte — e não é informação sobre a qualidade técnica da proposta, que continua indeterminada.";
    } else if (prob) {
      cab = 'Problema identificado, com documentação suficiente para caracterizá-lo';
      red = "A documentação foi suficiente para executar as duas trilhas, e a avaliação identificou ao menos um achado material. O achado está caracterizado contra fonte independente e é comunicável ao fornecedor em termos específicos, não como impressão geral.";
      passo = "Levar cada achado ao fornecedor na forma de pergunta específica, com a fonte que o sustenta, e pedir a proposta revista. Um achado caracterizado contra fonte é negociável; uma desconfiança genérica não é. Aqui há oportunidades potenciais de economia a serem validadas com dados completos, e nenhuma delas se converte em valor antes da revisão.";
    } else {
      cab = 'Proposta sólida nas duas trilhas';
      red = "As duas trilhas foram executadas com a documentação completa e nenhum achado material foi identificado. As premissas técnicas conferem com fonte independente, o enquadramento regulatório corresponde ao arranjo descrito, as premissas financeiras estão declaradas e ancoradas, e o contrato responde às perguntas de responsabilidade. Este parecer tem exatamente o mesmo peso do parecer contrário e deve ser emitido com a mesma naturalidade.";
      passo = "Comunicar que a proposta é sólida e registrar o que foi verificado e contra qual fonte. Um parecer favorável sem rastro de verificação vale tão pouco quanto um parecer desfavorável sem ele. Permanecem em aberto os itens que nenhuma avaliação documental resolve: levantamento do local e projeto executivo.";
    }
    return {
      valores: {},
      veredito:
        '<b>' + cab + '</b><br><br>' +
        (M11_E1[a] ?? '') + '<br><br>' + (M11_E2[b] ?? '') + '<br><br>' +
        (M11_E3[c] ?? '') + '<br><br>' + (M11_E4[d] ?? '') + '<br><br>' +
        '<b>Redação recomendada.</b> ' + red + '<br><br>' +
        '<b>Próximo passo.</b> ' + passo,
    };
  },


  // ══ MÓDULO 12 — Geopolítica Energética do Brasil (Wave 44) ══
  // O `m12-inst-01` é do § MAP, fora de aula — alcançado por Recursos
  // do Módulo, mesmo caminho do `lab-01` e dos `Inst · 01` anteriores.
  'm12-inst-01': i1m12,
  'm12-inst-02': i2m12,
  'm12-inst-03': i3m12,
  'm12-inst-04': i4m12,
  'm12-inst-05': i5m12,
  'm12-inst-06': i6m12,
  'm12-inst-07': i7m12,
  'm12-inst-08': i8m12,
  'm12-inst-09': i9m12,
  'm12-inst-10': i10m12,
  'm12-inst-11': i11m12,

  // ── m15 INST 10 · Verificador de regime e de camada · instrumento assinatura ──
  'm15-inst-10': (i) => {
    const OUT: Record<string, string> = {};
    let VER = '';
    const P: string[] = [];
    const E: any = [
    {k:'e01',f:'rg',y:'Regime',n:'Receita por participação',
    en:'"O campo produziu 180 mil barris por dia e a operadora tem 30% de participação; logo a receita dela foi de 54 mil barris por dia vezes o preço realizado."',
    d:'Regime não declarado.',
    falta:'A conta está aritmeticamente correta e só vale sob concessão. Se o campo estiver em partilha, a molécula é da União: a operadora recebe custo em óleo mais uma fatia do excedente, e a receita pode ser fração muito menor do volume que sua participação sugere.',
    p:'Sob qual regime este campo produz — e, se for partilha, qual o percentual de excedente ofertado e em que estágio está a recuperação de custo?',
    c:'"Sob concessão, a receita bruta atribuída à operadora corresponde à sua participação econômica no volume produzido, ao preço realizado. Sob partilha, a mesma participação não se traduz em receita pelo mesmo caminho."'},
    {k:'e02',f:'rg',y:'Regime',n:'Soma de áreas produtoras',
    en:'"Em junho de 2026 o Brasil produziu em 272 áreas produtoras; somando a produção de todas, chega-se à receita bruta do setor."',
    d:'Regime não declarado.',
    falta:'Volume físico soma; receita não. Das 272 áreas, 254 estavam em concessão, 7 em cessão onerosa e 11 em partilha. Nas de partilha, parte relevante da produção é da União, não de quem operou.',
    p:'Quanto do volume total veio de cada um dos três regimes, e qual o excedente da União no período?',
    c:'"A produção nacional somou 5,842 milhões de boe/d em junho de 2026, distribuída em 272 áreas sob três regimes distintos. A receita privada correspondente exige a separação por regime antes de qualquer soma."'},
    {k:'e03',f:'rg',y:'Regime',n:'Localização não define regime',
    en:'"O campo fica dentro do polígono do pré-sal, portanto está sob regime de partilha."',
    d:'Regime não declarado — e inferido a partir da geografia.',
    falta:'O polígono define o regime das <em>novas contratações</em>. Dentro dele coexistem contratos de concessão anteriores, contratos de cessão onerosa e contratos de partilha — e há campos com dois regimes simultâneos, quando o volume excedeu o teto da cessão e o excedente foi licitado sob partilha.',
    p:'Qual é o contrato aplicável a este campo, e há mais de um contrato incidindo sobre volumes distintos do mesmo campo?',
    c:'"O campo está no polígono do pré-sal. O regime aplicável depende do contrato, e a verificação precisa considerar a possibilidade de sobreposição entre cessão onerosa e partilha."'},
    {k:'e04',f:'cm',y:'Camada',n:'Dois preços de gás',
    en:'"O gás natural é negociado a cerca de US$ 6 por MMBtu, mas a indústria brasileira paga mais de US$ 11; a diferença é margem."',
    d:'Camada de preço confundida.',
    falta:'Os dois números pertencem a camadas diferentes da mesma cadeia. Entre a molécula e o consumidor industrial há processamento, transporte contratado, distribuição estadual e tributos. Chamar a diferença de "margem" atribui a um agente o que é a soma de quatro camadas com naturezas de preço distintas — mercado, contrato, tarifa e tributo.',
    p:'Cada um destes dois preços se formou em qual ponto da cadeia, e o que cada um já inclui?',
    c:'"O preço da molécula e o preço final ao consumidor industrial diferem por transporte, distribuição e tributos. Decompor a diferença por camada é o passo anterior a qualquer conclusão sobre competitividade."'},
    {k:'e05',f:'cm',y:'Camada',n:'Reajuste e bomba',
    en:'"A companhia reajustou a gasolina em R$ 0,48 por litro; logo o consumidor pagará R$ 0,48 a mais."',
    d:'Camada de preço confundida.',
    falta:'O reajuste é da camada do produtor. Entre ela e a bomba há mistura obrigatória, tributos federais, tributo estadual, subvenção econômica quando vigente, distribuição e margem de revenda. No caso de 28 de maio de 2026, o mesmo comunicado trazia desconto de R$ 0,44 por litro pela subvenção — efeito líquido de quatro centavos.',
    p:'Quais outras camadas se moveram na mesma janela, e havia subvenção vigente na data?',
    c:'"O preço de venda do produtor às distribuidoras subiu R$ 0,48 por litro. O efeito na bomba depende das cinco camadas seguintes, que se movem por regras e em datas próprias."'},
    {k:'e06',f:'cm',y:'Camada',n:'Referência e receita',
    en:'"A referência internacional de petróleo caiu 10% no trimestre, então a receita do produtor caiu 10%."',
    d:'Camada de preço confundida.',
    falta:'Entre a referência e o preço realizado há diferencial de qualidade do óleo específico, frete e — decisivo — a janela de apreçamento definida em cada contrato de venda. Cada cliente e cada negociação podem ter índice e período próprios, o que faz a variação chegar ao resultado com defasagem e amortecida. Some-se o efeito cambial, que pode compensar ou amplificar.',
    p:'O preço realizado da companhia caiu quanto, e qual foi o efeito cambial no mesmo período?',
    c:'"A referência internacional recuou 10% no trimestre. O efeito sobre a receita depende do preço realizado, das janelas de apreçamento contratuais e do câmbio."'},
    {k:'e07',f:'gr',y:'Grandeza',n:'Reserva vira anos',
    en:'"O Brasil tem 28,877 bilhões de barris de reserva e produz 1,38 bilhão por ano; portanto tem 21 anos de produção garantida."',
    d:'Grandeza de subsolo confundida — e critério não declarado.',
    falta:'Duas coisas. O número citado é 3P, a agregação mais ampla; sob critério provado são 17,488 bilhões, e a relação cai para cerca de 12,7 anos. E a relação reserva/produção <b>não é prazo garantido</b>: congela o denominador no ritmo atual e ignora adições, revisões e declínio.',
    p:'Sob qual critério de certeza, em qual data de referência, e você está lendo isso como indicador estático ou como previsão?',
    c:'"As reservas provadas eram de 17,488 bilhões de barris em 31/12/2025, o que corresponde a uma relação reserva/produção de cerca de 12,7 anos — indicador estático, não prazo de esgotamento."'},
    {k:'e08',f:'gr',y:'Grandeza',n:'Produção vira oferta',
    en:'"A produção de gás foi de 217 milhões de m³/d; logo há 217 milhões disponíveis para a indústria e para as térmicas."',
    d:'Grandeza confundida — bruta contra disponibilizada.',
    falta:'O balanço físico subtrai reinjeção, consumo nas unidades e queima. Em junho de 2026, dos 217,35 milhões de m³/d produzidos, chegaram ao mercado 64,36 milhões — menos de 30%. O aproveitamento reportado foi de 97%, porque reinjeção e consumo contam como uso e não como perda.',
    p:'Este número é produção bruta ou gás disponibilizado ao mercado — e, se for bruta, qual foi a destinação do restante?',
    c:'"A produção bruta foi de 217,35 milhões de m³/d e o gás disponibilizado ao mercado, de 64,36 milhões. A diferença foi reinjeção, consumo nas unidades e queima."'},
    {k:'e09',f:'gr',y:'Grandeza',n:'Reposição vira descoberta',
    en:'"O índice de reposição foi de 147%, então o país descobriu 47% mais petróleo do que produziu."',
    d:'Grandeza confundida — adição líquida contra descoberta.',
    falta:'O índice mede <em>adições líquidas de reserva</em>, e adição tem seis origens possíveis: nova descoberta, extensão de campo conhecido, revisão técnica, revisão por mudança de premissa de preço, aquisição de participação e reclassificação entre critérios de certeza. Reposição por revisão de preço se desfaz quando o preço cai; reposição por descoberta, não.',
    p:'Qual a decomposição das adições por origem, e quanto veio efetivamente de descoberta nova?',
    c:'"O índice de reposição de reservas provadas foi de 147,03% em 2025, correspondente a cerca de 2,023 bilhões de barris de adições líquidas, cuja composição por origem precisa ser verificada antes de qualquer leitura de tendência exploratória."'},
    {k:'e10',f:'ac',y:'Acoplamento',n:'Despacho vira preço de gás',
    en:'"As térmicas a gás estão despachando, logo o gás está barato."',
    d:'Acoplamento elétrico omitido.',
    falta:'Cinco motivos levam uma térmica a gerar: ordem de mérito, inflexibilidade declarada, restrição elétrica, requisitos de acionamento e decisão de garantia de suprimento. Só o primeiro carrega informação econômica sobre o combustível. Inflexibilidade nasce tipicamente da retirada mínima do contrato de gás — se o combustível será pago de todo modo, gerar é melhor que não gerar.',
    p:'A geração está acima ou abaixo do patamar de inflexibilidade declarada, e houve despacho por restrição elétrica ou por decisão de garantia de suprimento no período?',
    c:'"Há geração térmica a gás no período. Determinar se ela responde a mérito econômico exige separar a parcela inflexível e verificar se houve despacho fora da ordem de mérito."'},
    {k:'e11',f:'ac',y:'Acoplamento',n:'Queda internacional vira alívio',
    en:'"O gás caiu no mercado internacional, então o custo variável das térmicas vai cair e o preço de curto prazo também."',
    d:'Acoplamento elétrico omitido — e camada contratual ignorada.',
    falta:'O custo do gás que entra no custo variável não é o preço do dia: é o preço de um contrato com índice, fator de aplicação e defasagem próprios, acrescido do transporte contratado à parte, que se reajusta por regra e em data diferentes. O alívio internacional chega com atraso e amortecido, e pode ser anulado por movimento cambial de sinal contrário.',
    p:'Qual o índice e a defasagem dos contratos de gás das térmicas relevantes, e qual foi o movimento cambial no mesmo período?',
    c:'"Houve recuo da referência internacional de gás. O efeito sobre o custo variável das térmicas depende da fórmula de indexação de cada contrato, da defasagem, do custo de transporte contratado e do câmbio."'},
    {k:'e12',f:'ac',y:'Acoplamento',n:'Eficiência vira competitividade',
    en:'"A usina tem 600 MW de ciclo combinado eficiente, logo tem custo variável competitivo."',
    d:'Acoplamento elétrico omitido — e potência confundida com custo.',
    falta:'Consumo específico é um dos três fatores do custo de combustível; os outros dois são o preço do gás <em>entregue</em>, que inclui transporte contratado, e o câmbio. Uma usina eficiente com contrato caro tem custo variável alto, e uma usina menos eficiente com contrato barato pode despachar antes dela. Potência instalada não entra na conta de custo variável em nenhum ponto.',
    p:'Qual o preço do gás entregue na usina, incluindo transporte, e qual o câmbio usado na declaração do custo variável?',
    c:'"A usina é de ciclo combinado, com consumo específico da ordem de 7 MMBtu por MWh. Seu custo variável depende ainda do preço do gás entregue e do câmbio, e não da potência instalada."'}
    ];
    const f = sv(i['vf-flt'], 'all');
    const lista = E.filter((x: any) => f === 'all' || x.f === f);
    let k = String(i['vf-en'] ?? 'e01');
    if (!lista.some((x: any) => x.k === k)) k = lista.length ? lista[0].k : 'e01';

    let e=null;
    for(let i=0;i<E.length;i++){if(E[i].k===k){e=E[i];break;}}
    if(!e)return { valores: {}, veredito: alx15(P.join('') + VER) };
    P.push('<div class="vf-card">'+
    '<div class="vf-en">'+esc15(e.en)+'</div>'+
    '<div class="ro"><div class="k">Defeito dominante</div><div class="n sm">'+esc15(e.d)+'</div></div>'+
    '<div class="vf-bk"><span class="vf-lb">O que exatamente falta</span><p>'+e.falta+'</p></div>'+
    '<div class="vf-bk"><span class="vf-lb">A pergunta que você faz</span><p>'+esc15(e.p)+'</p></div>'+
    '<div class="vf-bk ok"><span class="vf-lb">Forma corrigida</span><p>'+esc15(e.c)+'</p></div>'+
    '<p class="vf-nt">O enunciado original não contém erro factual. Ele é verdadeiro e insuficiente — que é exatamente a categoria mais difícil de detectar numa conversa.</p>'+
    '</div>');

    void OUT;
    const valores: Record<string, number> = {};
    return { valores, veredito: alx15(P.join('') + VER) };
  },
  // ── m15 INST 01 · Mapa da cadeia · quatro reagrupamentos ──
  'm15-inst-01': (i) => {
    const OUT: Record<string, string> = {};
    let VER = '';
    const P: string[] = [];
    const ELOS: any = {
    campo:{n:'Campo produtor',
    seg:'Upstream', reg:'Os três regimes de E&P', ac:'Indireto', pr:'Misto — mercado e contrato',
    faz:'Eleva, separa e trata o fluido do reservatório, e mede a produção em ponto de medição fiscal.',
    tit:'Concessionário, na concessão; União, na partilha; cessionária, no volume cedido.',
    gra:'Produção em bbl/d e m³/d; soma em boe/d por fator declarado.',
    pre:'Óleo a preço de mercado, com diferencial e frete; gás por contrato bilateral.',
    org:'ANP · Lei nº 9.478/1997, Lei nº 12.351/2010, Lei nº 12.276/2010',
    dev:'Óleo para navio aliviador; gás para gasoduto de escoamento.',
    nao:'Não diz a participação econômica no consórcio, não diz o preço realizado, e não diz sob qual dos três regimes o volume foi produzido.'},
    medicao:{n:'Ponto de medição fiscal',
    seg:'Upstream', reg:'Os três regimes de E&P', ac:'Nenhum', pr:'Valor fixado por norma',
    faz:'Mede o volume produzido para efeitos contratuais e fiscais. É onde o número nasce.',
    tit:'É o ponto em que, na concessão, a titularidade da molécula passa ao concessionário.',
    gra:'Volume medido, em m³ e bbl, com incerteza metrológica declarada.',
    pre:'Não há preço aqui — há preço de referência apurado por metodologia da agência para calcular participações.',
    org:'ANP · regulamento técnico de medição e contratos de E&P',
    dev:'O número que alimenta royalty, participação especial e a contabilidade de todos os elos seguintes.',
    nao:'Não diz o preço de venda: o preço de referência fiscal e o preço realizado são camadas distintas e não precisam coincidir.'},
    escoamento:{n:'Gasoduto de escoamento',
    seg:'Midstream', reg:'Acessório ao contrato de E&P', ac:'Indireto', pr:'Acesso negociado entre partes',
    faz:'Leva o gás do campo até a costa ou até a unidade de processamento.',
    tit:'Do proprietário da instalação, que costuma ser o próprio consórcio produtor.',
    gra:'Capacidade e volume movimentado, em m³/d.',
    pre:'Acesso negociado; a regulamentação do acesso de terceiros estava em consulta pública em 04/08/2026.',
    org:'ANP · art. 28 da Lei nº 14.134/2021, sem norma vigente para este tipo de infraestrutura',
    dev:'Gás bruto à unidade de processamento.',
    nao:'Não diz quanto da capacidade está disponível a terceiros — porque a regra que definiria isso ainda não existia na data de consulta.'},
    upgn:{n:'Unidade de processamento',
    seg:'Midstream', reg:'Acessório ao contrato de E&P', ac:'Indireto', pr:'Serviço contratado',
    faz:'Retira contaminantes e frações pesadas, entregando molécula dentro de especificação comercial.',
    tit:'Do proprietário da unidade; a molécula continua sendo de quem a produziu.',
    gra:'Capacidade de processamento em m³/d; rendimento em líquidos de gás natural.',
    pre:'Tarifa ou preço de serviço de processamento, negociado. Sem norma vigente de acesso de terceiros em 04/08/2026.',
    org:'ANP · art. 28 da Lei nº 14.134/2021, regulamentação em consulta pública desde 10/07/2026',
    dev:'Gás especificado — só a partir daqui existe produto comercial.',
    nao:'Não diz se há capacidade disponível para molécula de terceiros, que é exatamente o gargalo que a reforma do gás pretende destravar.'},
    transporte:{n:'Gasoduto de transporte',
    seg:'Midstream', reg:'Fora do E&P · autorização federal', ac:'Direto', pr:'Tarifa de entrada e saída',
    faz:'Movimenta gás especificado em alta pressão entre pontos de entrada e de saída, para carregadores.',
    tit:'Do transportador, que por exigência legal não pode ser dono da molécula que transporta.',
    gra:'Capacidade contratada, capacidade disponível e volume movimentado — três números distintos no mesmo duto.',
    pre:'Tarifa regulada, por modalidade firme ou interruptível.',
    org:'ANP · Lei nº 14.134/2021 e Decreto nº 10.712/2021, alterado pelo Decreto nº 12.153/2024',
    dev:'Molécula no ponto de saída — city gate, térmica ou consumidor livre.',
    nao:'Não diz quanto está efetivamente contratado nem quanto sobra: capacidade instalada e capacidade disponível são grandezas diferentes.'},
    gnl:{n:'Terminal de regaseificação',
    seg:'Midstream', reg:'Fora do E&P · autorização federal', ac:'Direto', pr:'Capacidade contratada e serviço',
    faz:'Recebe gás liquefeito por navio, armazena e devolve a molécula ao estado gasoso.',
    tit:'Do operador do terminal; a molécula é de quem a importou. Quando são o mesmo agente, há exigência de separação contábil.',
    gra:'Capacidade de regaseificação em m³/d; armazenamento em m³ de líquido.',
    pre:'Capacidade mais serviço, sob acesso negociado e não discriminatório, com código de acesso aprovado previamente pela agência.',
    org:'ANP · Resolução nº 1.003/2026, publicada em 02/07/2026, com prazo de 90 dias para os códigos de acesso',
    dev:'Molécula disponível em prazo de semanas — a única oferta nova com esse tempo de resposta no sistema.',
    nao:'Não diz qual parcela do volume está reservada ao uso preferencial do proprietário — campo que a norma de 2026 passou a exigir revisar periodicamente.'},
    refino:{n:'Refinaria',
    seg:'Downstream', reg:'Fora do E&P · autorização federal', ac:'Nenhum', pr:'Misto — estratégia comercial e mercado',
    faz:'Separa e converte a mistura de hidrocarbonetos em produtos especificados.',
    tit:'Do refinador, que compra o cru e é dono dos derivados que produz.',
    gra:'Capacidade instalada e carga processada em bpd; rendimento em % da carga; margem em US$/bbl.',
    pre:'Na saída, estratégia comercial do produtor por polo, sem periodicidade definida. Na entrada, mercado com diferencial de qualidade.',
    org:'ANP para autorização e especificação; órgãos ambientais para licenciamento; defesa da concorrência para conduta',
    dev:'Derivados especificados à distribuição, e o déficit que vira importação.',
    nao:'Não diz o rendimento por produto nem a disponibilidade real — capacidade instalada e produção de um derivado específico são coisas diferentes.'},
    distribuicao:{n:'Distribuidora estadual de gás',
    seg:'Downstream', reg:'Fora do E&P · concessão estadual', ac:'Indireto', pr:'Tarifa regulada estadual',
    faz:'Entrega gás canalizado ao consumidor final por rede de distribuição.',
    tit:'Da concessionária estadual, dentro da sua área de concessão.',
    gra:'Volume distribuído em m³/d, por classe de consumo.',
    pre:'Tarifa regulada por agência estadual, escalonada por faixa de consumo, mais tributos.',
    org:'Agência reguladora estadual · competência do art. 25, §2º da Constituição',
    dev:'Molécula ao consumidor industrial, comercial, residencial ou veicular.',
    nao:'Não diz se o consumidor pode escolher outro fornecedor: essa regra é estadual, varia por unidade da federação, e é objeto de contencioso em pelo menos um estado.'},
    ute:{n:'Termelétrica a gás',
    seg:'Downstream', reg:'Fora do E&P · outorga do setor elétrico', ac:'Fronteira — é onde a cadeia vira eletricidade', pr:'Custo variável declarado',
    faz:'Converte a energia química do gás em energia elétrica e entrega ao sistema interligado.',
    tit:'Do gerador, que é comprador da molécula e titular da energia gerada.',
    gra:'Potência em MW; energia em MWh; consumo específico em MMBtu/MWh; custo variável em R$/MWh.',
    pre:'Do lado do combustível, contrato com indexação e retirada mínima. Do lado da energia, receita fixa pela disponibilidade e variável pelo despacho.',
    org:'ANEEL, ONS, CCEE, MME — e ANP para o parecer de viabilidade de fornecimento de gás',
    dev:'Energia elétrica e um componente de custo que entra no preço pago por todo agente exposto.',
    nao:'Não diz o preço do gás nem se o despacho foi por mérito ou por inflexibilidade: cinco motivos possíveis, e o dado bruto não distingue nenhum.'}
    };
    const DIMS: any = {
    seg:{lb:'Segmento',ordem:['campo','medicao','escoamento','upgn','transporte','gnl','refino','distribuicao','ute']},
    reg:{lb:'Regime jurídico',ordem:['campo','medicao','escoamento','upgn','transporte','gnl','refino','ute','distribuicao']},
    ac:{lb:'Acoplamento elétrico',ordem:['ute','transporte','gnl','campo','escoamento','upgn','distribuicao','medicao','refino']},
    pr:{lb:'Natureza do preço',ordem:['campo','refino','medicao','ute','escoamento','upgn','gnl','transporte','distribuicao']}
    };
    const d = sv(i['mp-dim'], 'seg');
    let k = String(i['mp-elo'] ?? 'campo');
    if (!ELOS[k]) k = 'campo';
    P.push('<div class="ro"><div class="k">' + DIMS[d].lb + '</div><div class="n">' + esc15(ELOS[k][d]) + '</div></div>');

    let e=ELOS[k];
    P.push('<div class="fz i"><span class="fzk">Recebe</span><span class="fzv">'+esc15(e.seg)+
    '</span><span class="fzn">'+esc15(e.faz)+'</span></div>'+
    '<div class="fz c"><span class="fzk">Titularidade</span><span class="fzv">Quem é dono</span>'+
    '<span class="fzn">'+esc15(e.tit)+'</span></div>'+
    '<div class="fz p"><span class="fzk">Grandeza</span><span class="fzv">O que se mede</span>'+
    '<span class="fzn">'+esc15(e.gra)+'</span></div>'+
    '<div class="fz m"><span class="fzk">Preço</span><span class="fzv">'+esc15(e.pr)+
    '</span><span class="fzn">'+esc15(e.pre)+'</span></div>'+
    '<div class="fz o"><span class="fzk">Órgão e norma</span><span class="fzv">Competência</span>'+
    '<span class="fzn">'+esc15(e.org)+'</span></div>');
    P.push('<div class="tl-panel"><div class="yr">'+esc15(e.seg)+' · '+esc15(e.reg)+'</div>'+
    '<div class="ti">'+esc15(e.n)+'</div>'+
    '<div class="bd2">Devolve à camada seguinte: '+esc15(e.dev)+'</div>'+
    '<div class="lg"><b>O que este número não diz</b>'+esc15(e.nao)+'</div></div>');

    void OUT;
    const valores: Record<string, number> = {};
    return { valores, veredito: alx15(P.join('') + VER) };
  },
  // ── m15 INST 02 · Comparador de regimes ──
  'm15-inst-02': (i) => {
    const OUT: Record<string, string> = {};
    let VER = '';
    const P: string[] = [];
    const R: any = {
    conc:{n:'Concessão',lei:'Lei nº 9.478/1997',
    tit:{t:'O concessionário é titular do petróleo e do gás a partir do ponto de medição. A União é titular da jazida no subsolo, nunca da molécula extraída.',
    res:'Comparabilidade: a produção de um campo de concessão é integralmente receita bruta do consórcio, na proporção da participação econômica de cada sócio. Um volume de partilha não se soma a este para efeito de receita.'},
    est:{t:'Em dinheiro: bônus de assinatura ofertado, royalty mensal sobre o valor da produção, participação especial trimestral quando o campo se qualifica, retenção de área e tributos.',
    res:'Comparabilidade: a parcela pública depende de alíquota e de rentabilidade apurada depois. Ela não é conhecida no momento da licitação, ao contrário do que ocorre na partilha.'},
    lic:{t:'Disputa-se bônus de assinatura e programa exploratório mínimo. O sexto ciclo da Oferta Permanente de Concessão tinha sessão marcada para 07/10/2026, com 495 blocos e cinco áreas de acumulação marginal em oferta potencial.',
    res:'Comparabilidade: o resultado do leilão informa quanto o Estado recebeu adiantado, e nada sobre a repartição da produção futura.'},
    ris:{t:'Integralmente do concessionário. Poço seco é custo irrecuperável, sem ressarcimento e sem compensação em produção futura.',
    res:'Comparabilidade: por carregar todo o risco, o concessionário fica com toda a produção. Comparar o "quanto o Estado leva" entre regimes sem considerar quem carrega o risco exploratório produz conclusão errada.'}},
    part:{n:'Partilha da produção',lei:'Lei nº 12.351/2010',
    tit:{t:'A União é titular do petróleo e do gás produzidos. O contratado tem direito ao custo em óleo e a uma fatia do excedente em óleo, conforme percentual ofertado.',
    res:'Comparabilidade: o mesmo volume físico gera receita privada substancialmente menor que sob concessão. Somar produção de partilha com produção de concessão para estimar receita do setor é o erro estrutural deste tema.'},
    est:{t:'Royalty mensal, tributos, e — o que distingue o regime — hidrocarboneto em espécie: a parcela da União no excedente em óleo, gerida e comercializada pela PPSA, que integra o consórcio e o comitê operacional.',
    res:'Comparabilidade: parte da receita pública não é dinheiro, é molécula. Ela só vira caixa depois de vendida, o que expõe o Estado a preço e a câmbio como qualquer produtor.'},
    lic:{t:'Bônus de assinatura fixo no edital. Disputa-se o percentual de excedente em óleo ofertado à União, a partir de um mínimo. O quarto ciclo da Oferta Permanente de Partilha tinha sessão marcada para 07/10/2026.',
    res:'Comparabilidade: aqui o leilão informa diretamente quanto da produção futura ficará com o Estado — informação que a licitação de concessão não produz.'},
    ris:{t:'O risco exploratório é do contratado, mas o custo reconhecido é recuperável em óleo, dentro de limites contratuais. A União participa sem investir e sem correr o risco de perfuração.',
    res:'Comparabilidade: o perfil de risco-retorno é diferente do da concessão em ambas as pontas. Comparar taxa de retorno entre os dois regimes sem ajustar por recuperação de custo é comparação inválida.'}},
    cess:{n:'Cessão onerosa',lei:'Lei nº 12.276/2010',
    tit:{t:'Contrato único que cedeu à companhia estatal, mediante pagamento e sem licitação, o direito de pesquisa e lavra em áreas do pré-sal, até o teto de cinco bilhões de barris de óleo equivalente.',
    res:'Comparabilidade: quando o volume recuperável excede o teto cedido, o excedente foi licitado sob partilha. O mesmo campo físico passa a ter dois contratos sobre volumes distintos — e duas apurações.'},
    est:{t:'Pagamento pela cessão, royalties e ajustes contratuais previstos no instrumento. Não há disputa competitiva na origem, porque não houve licitação.',
    res:'Comparabilidade: a parcela pública deste regime não é comparável com a de um contrato leiloado, porque o preço da cessão foi negociado e depois revisado, não formado em pregão.'},
    lic:{t:'Não há. É regime de contrato único, perímetro fixo e teto volumétrico, fechado à entrada de novos contratados. Em junho de 2026 respondia por sete das 272 áreas produtoras do país.',
    res:'Comparabilidade: sete áreas parecem pouco até se observar que estão entre as mais produtivas. Número de áreas não é volume, e volume não é receita.'},
    ris:{t:'A cessionária assumiu risco de pesquisa e lavra nas áreas cedidas, com contrapartida financeira definida no ato da cessão e revisões contratuais posteriores.',
    res:'Comparabilidade: por ser contrato único e negociado, este regime é o menos comparável dos três. Toda leitura precisa dizer explicitamente qual parcela do volume do campo está sob cessão e qual está sob partilha.'}}
    };
    const DIMN: any = {tit:'Titularidade da molécula',est:'O que o Estado recebe',lic:'Como se disputa a área',ris:'Quem corre o risco'};

    let r=sv(i['rg-reg'], 'conc');
    let d=sv(i['rg-dim'], 'tit');
    let o=R[r], c=o[d];
    P.push('<div class="ocard"><span class="ok2">Regime</span><b>'+esc15(o.n)+'</b> · '+esc15(o.lei)+'</div>'+
    '<div class="ocard gd2"><span class="ok2">'+esc15(DIMN[d])+'</span>'+esc15(c.t)+'</div>');


    VER = '<b>Ressalva de comparabilidade.</b> '+esc15(c.res);

    void OUT;
    const valores: Record<string, number> = {};
    return { valores, veredito: alx15(P.join('') + VER) };
  },
  // ── m15 INST 03 · Régua de grandeza de subsolo ──
  'm15-inst-03': (i) => {
    const OUT: Record<string, string> = {};
    let VER = '';

    let p1=nm(i['gs-1p-n'], 17.488, 0.1, 120);
    let k2=nm(i['gs-2p-n'], 1.387, 1, 3);
    let k3=nm(i['gs-3p-n'], 1.651, 1, 4);
    let pd=nm(i['gs-pd-n'], 1.380, 0.01, 6);
    let ad=nm(i['gs-ad-n'], 2.023, 0, 8);
    if(k3<k2){k3=k2;}
    let v1=p1, v2=p1*k2, v3=p1*k3;
    let cr=sv(i['gs-cr'], 'p1');
    let dt=sv(i['gs-dt'], 'sim');
    let vc = cr==='p2'?v2:(cr==='p3'?v3:v1);
    let amp = v1>0 ? (v3/v1-1)*100 : 0;
    let rp = pd>0 ? vc/pd : NaN;
    let irr = pd>0 ? ad/pd*100 : NaN;
    OUT['gs-v1'] = fmt11(v1,3)+'<span class="u"> bi</span>';
    OUT['gs-v2'] = fmt11(v2,3)+'<span class="u"> bi</span>';
    OUT['gs-v3'] = fmt11(v3,3)+'<span class="u"> bi</span>';
    OUT['gs-am'] = '+'+fmt11(amp,1)+'<span class="u">%</span>';
    OUT['gs-rp'] = (cr==='nd'?'—':fmt11(rp,1)+'<span class="u"> anos</span>');
    OUT['gs-ir'] = fmt11(irr,1)+'<span class="u">%</span>';



    if(dt==='nao'){

    VER = '<b>Recusa de leitura — falta a data de referência.</b> Uma reserva sem data de certificação não é um número, é uma afirmação: o mesmo campo pode ter volumes distintos em anos consecutivos por revisão técnica ou por mudança de premissa de preço, sem que nada tenha mudado no subsolo. Antes de comparar com qualquer outro número de reserva, obtenha a data de referência.';
    } else if(cr==='nd'){

    VER = '<b>Recusa de leitura — falta o critério de certeza.</b> Entre o critério mais restrito e o mais amplo desta carteira há '+fmt11(amp,1)+'% de diferença, e ambos os números estariam corretos. Sem saber se a fonte citou provada, provada mais provável, ou as três, o volume não é comparável com nada — inclusive com o do próprio ano anterior.';
    } else if(irr<100 && rp<10){

    VER = '<b>Dois sinais adversos simultâneos.</b> Reposição de '+fmt11(irr,1)+'% — abaixo do produzido no período — combinada com relação reserva/produção de '+fmt11(rp,1)+' anos sob o critério '+(cr==='p1'?'provado':(cr==='p2'?'2P':'3P'))+'. Nenhum dos dois isolado autorizaria conclusão; juntos, indicam carteira que encolhe. Ainda assim, verifique a origem das adições antes de concluir: um único ano é volátil.';
    } else if(irr>=100 && rp>=10){

    VER = '<b>Dois sinais favoráveis, e nenhuma conclusão sobre o futuro.</b> Reposição de '+fmt11(irr,1)+'% e relação reserva/produção de '+fmt11(rp,1)+' anos sob o critério citado. Relação reserva/produção <b>não é prazo de esgotamento</b>: ela congela o denominador no ritmo atual. E a reposição precisa ser decomposta — descoberta, extensão, revisão técnica, revisão de preço, aquisição ou reclassificação produzem o mesmo indicador com significados diferentes.';
    } else {

    VER = '<b>Sinais divergentes — não conclua por um só.</b> Reposição de '+fmt11(irr,1)+'% e relação reserva/produção de '+fmt11(rp,1)+' anos sob o critério citado. Quando reposição e vida de reservas apontam em sentidos opostos, a explicação costuma estar na composição das adições ou numa mudança recente de ritmo de produção. Peça a decomposição antes de qualquer leitura de tendência.';
    }

    void OUT;
    const valores: Record<string, number> = {};
    const put = (k: string, v: number) => { if (Number.isFinite(v)) valores[k] = v; };
    put("gs-v1", v1);
    put("gs-v2", v2);
    put("gs-v3", v3);
    put("gs-am", amp);
    put("gs-rp", cr === 'nd' ? NaN : rp);
    put("gs-ir", irr);
    return { valores, veredito: alx15(VER) };
  },
  // ── m15 INST 04 · Calculadora de parcela do Estado ──
  'm15-inst-04': (i) => {
    const OUT: Record<string, string> = {};
    let VER = '';
    const REP: any = {
    ter:{n:'Campo terrestre',u:50,e:40,m:10,
    nt:'Art. 50 da Lei nº 9.478/1997: 50% à União, 40% aos estados produtores e 10% aos municípios produtores.'},
    mar:{n:'Marítimo · comercialidade após 12/2012',u:50,e:40,m:10,
    nt:'Mesmos percentuais, com beneficiários confrontantes, nos termos da Lei nº 12.858/2013, que também vinculou parcela a educação e saúde.'},
    pre:{n:'Marítimo no polígono · comercialidade anterior',u:50,e:40,m:10,
    nt:'Campos com comercialidade anterior a 03/12/2012 e produção no polígono seguem desenho próprio previsto na legislação; os percentuais aqui são simplificação didática.'}
    };

    let vol=nm(i['pe-vol-n'], 180, 1, 1200);
    let pr=nm(i['pe-pr-n'], 80.61, 20, 160);
    let cx=nm(i['pe-cx-n'], 5.26, 2.5, 9);
    let al=nm(i['pe-al-n'], 10, 5, 15);
    let de=nm(i['pe-de-n'], 45, 10, 90);
    let pa=nm(i['pe-pa-n'], 25, 0, 40);
    let rep=sv(i['pe-rep'], 'ter');
    let R=REP[rep];
    let rb=vol*1000*365*pr*cx/1e9;
    let ry=rb*al/100;
    let base=rb*(1-de/100)-ry;
    if(base<0)base=0;
    let ps=base*pa/100;
    let tot=ry+ps;
    let tk=rb>0?tot/rb*100:0;
    let es=tot*R.e/100, mu=tot*R.m/100;
    OUT['pe-rb'] = 'R$ '+fmt11(rb,1)+'<span class="u"> bi</span>';
    OUT['pe-ry'] = 'R$ '+fmt11(ry,2)+'<span class="u"> bi</span>';
    OUT['pe-ps'] = 'R$ '+fmt11(ps,2)+'<span class="u"> bi</span>';
    OUT['pe-tk'] = fmt11(tk,1)+'<span class="u">%</span>';
    OUT['pe-es'] = 'R$ '+fmt11(es,2)+'<span class="u"> bi</span>';
    OUT['pe-mu'] = 'R$ '+fmt11(mu,2)+'<span class="u"> bi</span>';



    if(ps<=0.0001 && ry>0){

    VER = '<b>Participação especial nula, royalty positivo — e isso é normal.</b> Com deduções de '+fmt11(de,1)+'% da receita bruta, a base de participação especial ficou em zero. Royalty é compensação sobre o valor da produção e é devida haja ou não lucro; participação especial só existe onde há rentabilidade apurada. <b>São dois fluxos, não um.</b> '+esc15(R.nt);
    } else if(tk>35){

    VER = '<b>Parcela pública de '+fmt11(tk,1)+'% da receita bruta — e um único sinal não sustenta isso.</b> O número depende simultaneamente de volume, de preço de referência e de câmbio, que não se movem juntos. Antes de concluir sobre carga fiscal, teste as três variáveis separadamente: uma queda de preço com câmbio estável, e uma queda de câmbio com preço estável, produzem efeitos diferentes sobre o mesmo campo. '+esc15(R.nt);
    } else {

    VER = '<b>Royalty e participação especial calculados separadamente.</b> Parcela pública de '+fmt11(tk,1)+'% da receita bruta, dos quais R$ '+fmt11(es,2)+' bi aos estados e R$ '+fmt11(mu,2)+' bi aos municípios sob o desenho selecionado. Lembre-se de que os dois fluxos alcançam <b>conjuntos de beneficiários muito diferentes</b>: royalty chega a centenas de municípios, participação especial a poucas dezenas. '+esc15(R.nt);
    }

    void OUT;
    const valores: Record<string, number> = {};
    const put = (k: string, v: number) => { if (Number.isFinite(v)) valores[k] = v; };
    put("pe-rb", rb);
    put("pe-ry", ry);
    put("pe-ps", ps);
    put("pe-tk", tk);
    put("pe-es", es);
    put("pe-mu", mu);
    return { valores, veredito: alx15(VER) };
  },
  // ── m15 INST 05 · Decompositor de preço de combustível ──
  'm15-inst-05': (i) => {
    const OUT: Record<string, string> = {};
    let VER = '';

    let p4=nm(i['cb-p4-n'], 3.10, 0.5, 6);
    let bi=nm(i['cb-bi-n'], 0.62, 0, 2);
    let tf=nm(i['cb-tf-n'], 0.42, 0, 2);
    let te=nm(i['cb-te-n'], 1.47, 0, 3);
    let dr=nm(i['cb-dr-n'], 0.98, 0, 3);
    let sb=nm(i['cb-sb-n'], 0, 0, 1.2);
    let sub=Math.min(sb,tf);
    let tot=p4+bi+tf+te+dr-sub;
    if(tot<0.01)tot=0.01;
    let ct=tf+te-sub;
    OUT['cb-tot'] = 'R$ '+fmt11(tot,2)+'<span class="u">/L</span>';
    OUT['cb-pp'] = fmt11(p4/tot*100,1)+'<span class="u">%</span>';
    OUT['cb-ct'] = fmt11(ct/tot*100,1)+'<span class="u">%</span>';
    OUT['cb-pb'] = fmt11(bi/tot*100,1)+'<span class="u">%</span>';
    OUT['cb-pd'] = fmt11(dr/tot*100,1)+'<span class="u">%</span>';





    if(sub>0){

    VER = '<b>Há subvenção ativa nesta composição — e ela muda a leitura de qualquer reajuste.</b> Um aumento na camada do produtor pode ser total ou parcialmente neutralizado por ela, como ocorreu em 28 de maio de 2026, quando um ajuste de R$ 0,48 por litro veio acompanhado de desconto de R$ 0,44 no âmbito da subvenção federal. A subvenção é temporária por construção, editada por medida provisória e revogável por decisão do Executivo: <b>verifique o estado dela na data antes de usar esta composição</b>.';
    } else if(ct/tot>0.40){

    VER = '<b>Tributo responde por '+fmt11(ct/tot*100,1)+'% do preço final — e isso não atribui causa a ninguém.</b> A composição mostra participação, não responsabilidade por variação. Para atribuir uma variação de preço a uma camada, é preciso que <em>apenas ela</em> tenha se movido na janela observada. Mudança simultânea de alíquota estadual, teor de mistura e preço do produtor produz efeito líquido que nenhuma das três explica sozinha.';
    } else {

    VER = '<b>Composição decomposta em cinco camadas.</b> A parcela do produtor é '+fmt11(p4/tot*100,1)+'% do preço final — o que significa que '+fmt11(100-p4/tot*100,1)+'% se formam fora da refinaria. Antes de atribuir uma variação de preço a qualquer camada, verifique se as outras quatro permaneceram constantes na mesma janela. Na maioria dos casos observados, não permaneceram.';
    }

    void OUT;
    const valores: Record<string, number> = {};
    const put = (k: string, v: number) => { if (Number.isFinite(v)) valores[k] = v; };
    put("cb-tot", tot);
    put("cb-pp", p4 / tot * 100);
    put("cb-ct", ct / tot * 100);
    put("cb-pb", bi / tot * 100);
    put("cb-pd", dr / tot * 100);
    return { valores, veredito: alx15(VER) };
  },
  // ── m15 INST 06 · Régua de refino · capacidade contra produto ──
  'm15-inst-06': (i) => {
    const OUT: Record<string, string> = {};
    let VER = '';

    let cap=nm(i['rf-cap-n'], 1800, 200, 4000);
    let uti=nm(i['rf-uti-n'], 86.4, 40, 100);
    let ren=nm(i['rf-ren-n'], 40, 10, 60);
    let dem=nm(i['rf-dem-n'], 900, 100, 2000);
    let cg=cap*uti/100;
    let di=cg*ren/100;
    let def=di-dem;
    let oc=cap-cg;
    let c1=cap*ren/100;
    let rn=cap>0?dem/cap*100:0;
    OUT['rf-cg'] = fmt11(cg,0)+'<span class="u"> mil bpd</span>';
    OUT['rf-di'] = fmt11(di,0)+'<span class="u"> mil bpd</span>';
    OUT['rf-de'] = (def>=0?'+':'')+fmt11(def,0)+'<span class="u"> mil bpd</span>';
    OUT['rf-oc'] = fmt11(oc,0)+'<span class="u"> mil bpd</span>';
    OUT['rf-c1'] = fmt11(c1,0)+'<span class="u"> mil bpd</span>';
    OUT['rf-rn'] = fmt11(rn,1)+'<span class="u">% da carga</span>';

    if(def>=0){

    VER = '<b>Superávit de '+fmt11(def,0)+' mil bpd no produto avaliado.</b> Isso não significa autossuficiência em derivados: o excedente de um produto convive com déficit de outro, porque a configuração das unidades reparte a carga numa proporção que não é livre. Verifique a cesta inteira antes de concluir, e lembre que rendimento e demanda são editáveis justamente porque nenhum dos dois é constante.';
    } else if(c1>=dem){

    VER = '<b>Déficit de '+fmt11(-def,0)+' mil bpd — e a causa dominante é <em>utilização</em>, não capacidade.</b> Rodando a 100% com o mesmo rendimento, a produção chegaria a '+fmt11(c1,0)+' mil bpd e cobriria a demanda. Mas capacidade ociosa não é produto disponível: só se converte se o cru disponível e a configuração das unidades permitirem. Antes de concluir "falta refinaria", teste as outras três causas — qualidade do cru, configuração e perfil da demanda.';
    } else if(rn<=60){

    VER = '<b>Déficit de '+fmt11(-def,0)+' mil bpd — a causa dominante é <em>rendimento</em>.</b> Seria preciso extrair '+fmt11(rn,1)+'% de diesel da carga total instalada para zerar o descompasso, contra os '+fmt11(ren,1)+'% atuais. Isso é uma questão de configuração de unidades e de qualidade do cru, resolvida por investimento em conversão e por anos de obra — não por elevar a utilização.';
    } else {

    VER = '<b>Déficit de '+fmt11(-def,0)+' mil bpd, e nenhuma causa isolada o explica.</b> Zerar exigiria rendimento de '+fmt11(rn,1)+'% sobre a capacidade instalada total, que está acima do que a configuração de um parque típico entrega. Quando utilização e rendimento juntos não fecham, a conta só se resolve com capacidade adicional, com mudança de cesta de cru, com importação — ou com alguma combinação das três. <b>Este instrumento não recomenda nenhuma delas</b>: devolve a estrutura do descompasso.';
    }

    void OUT;
    const valores: Record<string, number> = {};
    const put = (k: string, v: number) => { if (Number.isFinite(v)) valores[k] = v; };
    put("rf-cg", cg);
    put("rf-di", di);
    put("rf-de", def);
    put("rf-oc", oc);
    put("rf-c1", c1);
    put("rf-rn", rn);
    return { valores, veredito: alx15(VER) };
  },
  // ── m15 INST 07 · Régua de contrato de gás ──
  'm15-inst-07': (i) => {
    const OUT: Record<string, string> = {};
    let VER = '';
    const CAM: any = {
    mol:{n:'Molécula na saída do processamento',inc:'apenas a molécula especificada'},
    cty:{n:'Entregue no city gate',inc:'molécula mais transporte contratado'},
    ind:{n:'Final ao consumidor industrial',inc:'molécula, transporte, distribuição e tributos'}
    };

    let mol=nm(i['gc-mol-n'], 8.50, 2, 30);
    let tra=nm(i['gc-tra-n'], 1.60, 0, 12);
    let dis=nm(i['gc-dis-n'], 3.20, 0, 15);
    let top=nm(i['gc-top-n'], 80, 0, 100);
    let ret=nm(i['gc-ret-n'], 65, 0, 120);
    let spo=nm(i['gc-spo-n'], 6.00, 1, 40);
    let cam=sv(i['gc-cam'], 'mol');
    let nom = cam==='mol'?mol:(cam==='cty'?mol+tra:mol+tra+dis);
    let fat = Math.max(ret,top);
    let ef = ret>0 ? nom*fat/ret : NaN;
    let sc = isFinite(ef) ? ef-nom : NaN;
    let dt = nom-spo;
    OUT['gc-nom'] = 'US$ '+fmt11(nom,2)+'<span class="u">/MMBtu</span>';
    OUT['gc-vf'] = fmt11(fat,0)+'<span class="u">% do contratado</span>';
    OUT['gc-ef'] = (isFinite(ef)?'US$ '+fmt11(ef,2):'—')+'<span class="u">/MMBtu</span>';
    OUT['gc-sc'] = (isFinite(sc)?'+US$ '+fmt11(sc,2):'—')+'<span class="u">/MMBtu</span>';
    OUT['gc-dt'] = (dt>=0?'+':'')+fmt11(dt/spo*100,1)+'<span class="u">% vs. referência</span>';



    if(ret<=0){

    VER = '<b>Sem retirada, o custo por unidade consumida é indefinido — e o custo total não é zero.</b> Com retirada mínima de '+fmt11(top,0)+'%, o comprador paga por esse volume ainda que não retire nada. É o caso extremo do que a cláusula faz: transferir risco de volume do vendedor para o comprador. Verifique se o contrato tem mecanismo de recuperação posterior antes de tratar o pagamento como perda.';
    } else if(ret<top){

    VER = '<b>Retirada abaixo do mínimo contratado — o custo efetivo é '+fmt11(sc/nom*100,1)+'% acima do preço nominal.</b> Na camada "'+esc15(CAM[cam].n)+'", que inclui '+esc15(CAM[cam].inc)+', o preço citado é US$ '+fmt11(nom,2)+', mas cada unidade efetivamente consumida custa US$ '+fmt11(ef,2)+'. <b>Nenhum dos dois números é errado</b> — eles medem coisas diferentes, e material de divulgação cita o primeiro. Note ainda que a distância para a referência do dia é de '+fmt11(dt/spo*100,1)+'%: o contrato responde ao seu índice, não à cotação corrente.';
    } else {

    VER = '<b>Retirada acima do mínimo — custo efetivo igual ao nominal na camada "'+esc15(CAM[cam].n)+'".</b> Este preço inclui '+esc15(CAM[cam].inc)+', e por isso não se compara com um preço de outra camada nem com a referência do dia sem ajuste. A distância observada para a referência é de '+fmt11(dt/spo*100,1)+'%, e ela não indica erro de precificação: indica que o contrato tem índice, fator e defasagem próprios.';
    }

    void OUT;
    const valores: Record<string, number> = {};
    const put = (k: string, v: number) => { if (Number.isFinite(v)) valores[k] = v; };
    put("gc-nom", nom);
    put("gc-vf", fat);
    put("gc-ef", ef);
    put("gc-sc", sc);
    put("gc-dt", dt / spo * 100);
    return { valores, veredito: alx15(VER) };
  },
  // ── m15 INST 08 · Classificador de elo ──
  'm15-inst-08': (i) => {
    const OUT: Record<string, string> = {};
    let VER = '';
    const P: string[] = [];
    const no = (pq: any, onde: any): any => {return {ok:false,pq:pq,onde:onde};};
    const si = (reg: any, org: any, nao: any): any => {return {ok:true,reg:reg,org:org,nao:nao};};
    const GN: any = {po:'Produção de petróleo',pg:'Produção de gás',rs:'Reserva',cp:'Capacidade',pr:'Preço',cv:'Custo variável'};
    const EN: any = {ca:'Campo',ep:'Escoamento e processamento',tr:'Transporte',di:'Distribuição',ut:'Termelétrica'};
    const M: any = {
    po:{
    ca:si('Os três regimes de E&P — concessão, partilha ou cessão onerosa','ANP · Lei nº 9.478/1997, Lei nº 12.351/2010 e Lei nº 12.276/2010','Não diz sob qual regime o volume foi produzido, sem o que a receita não se apura; não diz a participação econômica de cada sócio no consórcio; e não diz o preço realizado, que difere da referência internacional por qualidade, frete e janela de apreçamento.'),
    ep:no('Escoamento e processamento movimentam e tratam fluido; não produzem. Um número em barris por dia atribuído a este elo é volume movimentado, não produção medida.','A produção nasce no campo, no ponto de medição fiscal. É o único ponto da cadeia em que essa grandeza existe.'),
    tr:no('Gasoduto de transporte movimenta gás especificado, não petróleo. O óleo deixa a unidade de produção por navio aliviador, e segue por infraestrutura logística distinta.','No campo, para a produção; em terminais e oleodutos, para a movimentação de óleo — que é outro número.'),
    di:no('Distribuição entrega produto ao consumidor final: derivado, no caso dos líquidos, ou gás canalizado. Nenhum dos dois é petróleo cru.','No campo, para produção; na refinaria, para produção de derivados. Confundir os dois é o erro que faz alguém somar cru e derivado.'),
    ut:no('Termelétrica consome combustível e produz eletricidade. Não há produção de petróleo neste elo em nenhuma hipótese.','No campo. A térmica pertence ao fim da cadeia do gás, não à do óleo.')},
    pg:{
    ca:si('Os três regimes de E&P','ANP · Boletim Mensal da Produção','Não diz se o número é produção bruta ou gás disponibilizado ao mercado. Em junho de 2026 a diferença nacional foi de 217,35 para 64,36 milhões de m³/d — menos de 30% do bruto chegou ao mercado.'),
    ep:si('Acessório ao contrato de E&P; acesso de terceiros sem norma vigente em 04/08/2026','ANP · art. 28 da Lei nº 14.134/2021, em consulta pública desde 10/07/2026','<b>Aplica com ressalva:</b> aqui o número é volume movimentado ou processado, nunca produzido. E não diz quanto da capacidade está disponível a terceiros, porque a regra que definiria isso ainda não existia na data de consulta.'),
    tr:no('Transporte movimenta gás já especificado; o volume que passa pelo duto é movimentação, e pode incluir molécula importada e regaseificada que nunca foi produzida no país.','No campo, para produção. No duto, o número correto é volume movimentado, e a distinção importa porque as duas séries divergem.'),
    di:no('A distribuidora estadual entrega gás ao consumidor final; o volume dela é distribuído, não produzido, e reflete demanda local e não oferta nacional.','No campo, para produção. Na distribuidora, volume distribuído por classe de consumo.'),
    ut:no('A térmica consome gás. Um número em m³/d atribuído a ela é consumo de combustível, e depende de quanto ela despachou — não de quanto o país produziu.','No campo, para produção. Na usina, consumo, que se relaciona com a produção nacional apenas de forma indireta.')},
    rs:{
    ca:si('Os três regimes de E&P; a reserva é atributo do contrato e do campo, não do subsolo em abstrato','ANP · Resolução nº 47/2014, declaração anual das operadoras','Não diz o critério de certeza — provada, provada mais provável, ou as três — nem a data de referência. Sem os dois, o número não é comparável com nenhum outro, inclusive com o do próprio campo no ano anterior.'),
    ep:no('Reserva é volume comercialmente recuperável no subsolo. Um duto de escoamento não contém reserva; contém, no máximo, volume em trânsito.','No campo, com critério de certeza e data de referência declarados.'),
    tr:no('Transporte não contém reserva. O gás em linha é estoque operacional, grandeza de outra ordem e de duração de horas, não de anos.','No campo. E cuidado com a colisão de sentido: "reserva" aqui não é reserva de capacidade nem nível de reservatório do setor elétrico.'),
    di:no('A distribuidora não tem reserva de hidrocarboneto. Pode ter estoque contratado ou capacidade de armazenamento, que são coisas distintas.','No campo. Estoque e reserva não são sinônimos e diferem em ordem de grandeza e em regime jurídico.'),
    ut:no('Uma usina não tem reserva. Pode ter combustível estocado ou contrato firme de suprimento — nenhum dos dois é reserva no sentido deste módulo.','No campo. A confusão aqui é frequente porque o setor elétrico usa "reserva" com outros dois sentidos.')},
    cp:{
    ca:si('Os três regimes de E&P','ANP · plano de desenvolvimento aprovado','Aqui capacidade é a da unidade de produção, em bbl/d de processamento de líquido e em m³/d de gás. Não diz a produção efetiva, que depende de poços conectados, disponibilidade e parada programada.'),
    ep:si('Acessório ao contrato de E&P; acesso de terceiros em regulamentação','ANP · art. 28 da Lei nº 14.134/2021','Capacidade de escoamento e de processamento em m³/d. Não diz quanto está comprometido com a produção do próprio proprietário nem quanto sobra para terceiros — que é exatamente o gargalo que a reforma do gás pretende destravar.'),
    tr:si('Fora do E&P · autorização federal','ANP · Lei nº 14.134/2021 e Decreto nº 10.712/2021','Capacidade contratada, capacidade disponível e volume movimentado são <b>três números distintos no mesmo duto</b>. Um número de capacidade sozinho não diz qual dos três é.'),
    di:si('Fora do E&P · concessão estadual','Agência reguladora estadual · art. 25, §2º da Constituição','Capacidade da rede de distribuição. Não diz se há regra estadual que permita ao consumidor escolher outro fornecedor, que é a variável decisiva para quem quer comprar molécula de terceiro.'),
    ut:si('Fora do E&P · outorga do setor elétrico','ANEEL para outorga; ONS para despacho','Potência instalada em MW. <b>Não é energia gerada e não é energia contratada</b> — a mesma separação de grandeza dos Módulos 08 e 14, terceira aparição. E não diz o consumo específico, sem o qual não se converte potência em demanda de gás.')},
    pr:{
    ca:si('Os três regimes de E&P','ANP para o preço de referência fiscal; contratos privados para o preço realizado','Óleo a preço de mercado com diferencial e frete; gás por contrato bilateral. Não diz qual das duas lógicas está em uso, e não diz se o número é preço realizado ou preço de referência apurado para fins fiscais — que não precisam coincidir.'),
    ep:si('Acessório ao contrato de E&P','ANP · regulamentação de acesso em consulta pública','Preço ou tarifa de serviço de escoamento e de processamento, sob acesso negociado. Não diz se houve efetiva possibilidade de negociação por terceiro, porque a norma que a disciplinaria ainda não estava vigente em 04/08/2026.'),
    tr:si('Fora do E&P · autorização federal','ANP · tarifas de transporte','Tarifa de entrada e de saída, por modalidade firme ou interruptível. Não diz o custo total do gás entregue: molécula e transporte são contratos separados, e somar um sem o outro subestima o custo em ponto.'),
    di:si('Fora do E&P · concessão estadual','Agência reguladora estadual','Tarifa regulada, escalonada por faixa de consumo, mais tributos estaduais. Não é comparável com preço de molécula na origem sem somar transporte e distribuição — e é essa comparação indevida que produz a maior parte das afirmações sobre competitividade do gás brasileiro.'),
    ut:no('A termelétrica não vende gás; ela o compra. Um preço atribuído a este elo é preço de compra do combustível, que pertence à camada anterior, ou preço da energia vendida, que é outra grandeza inteiramente.','No campo, no processamento, no transporte ou na distribuição, conforme a camada. Na usina, o que existe é custo variável e receita de energia.')},
    cv:{
    ca:no('Custo variável unitário é conceito do despacho centralizado do setor elétrico. Um campo produtor tem custo de elevação, custo operacional e investimento — nenhum deles entra em ordem de mérito.','Na termelétrica. No campo, a grandeza análoga é o custo de elevação por barril de óleo equivalente, que não inclui investimento, participações nem tributos.'),
    ep:no('Escoamento e processamento têm custo de serviço, não custo variável de despacho.','Na termelétrica. Aqui a grandeza é tarifa ou preço de serviço.'),
    tr:no('Transporte tem tarifa regulada, não custo variável unitário. A confusão decorre de ambos serem componentes do custo final da energia térmica.','Na termelétrica — onde o custo do transporte contratado entra <em>dentro</em> do custo variável, somado ao da molécula.'),
    di:no('Distribuição tem tarifa, não custo variável de despacho. Uma distribuidora estadual de gás não participa da ordem de mérito do setor elétrico.','Na termelétrica. E note que uma térmica conectada à malha de distribuição paga tarifa de distribuição dentro do seu custo variável.'),
    ut:si('Fora do E&P · outorga do setor elétrico','ONS para o despacho; CCEE para a contabilização; MME para as diretrizes de leilão','<b>Aqui a grandeza mora.</b> Mas o número não diz se a usina despachou por mérito ou por inflexibilidade contratual, não diz o consumo específico usado, e não diz qual parcela do custo é molécula e qual é transporte contratado. Cinco motivos levam uma térmica a gerar, e o custo variável explica apenas um.')}
    };
    const gAtual = sv(i['cl-gr'], 'po');

    let e=sv(i['cl-el'], 'ca');
    let c=M[gAtual][e];
    if(c.ok){
    P.push('<div class="ocard gr2"><span class="ok2">Combinação</span><b>Aplica.</b> '+esc15(GN[gAtual])+' é grandeza legítima do elo <b>'+esc15(EN[e])+'</b>.</div>'+
    '<div class="ocard"><span class="ok2">Regime aplicável</span>'+esc15(c.reg)+'</div>'+
    '<div class="ocard gd2"><span class="ok2">Órgão competente</span>'+esc15(c.org)+'</div>');


    VER = '<b>O que este número não diz.</b> '+c.nao;
    } else {
    P.push('<div class="ocard rd2"><span class="ok2">Combinação</span><b>Não se aplica.</b> '+esc15(GN[gAtual])+' não é grandeza do elo <b>'+esc15(EN[e])+'</b>.</div>'+
    '<div class="ocard"><span class="ok2">Por que não</span>'+esc15(c.pq)+'</div>'+
    '<div class="ocard gd2"><span class="ok2">Onde essa grandeza mora</span>'+esc15(c.onde)+'</div>');


    VER = '<b>Atribuição de grandeza ao elo errado.</b> Este é um erro tão frequente quanto errar o valor, e mais difícil de perceber, porque o número citado costuma ser correto — apenas pertence a outro ponto da cadeia. Antes de aceitar qualquer dado, confirme que a grandeza e o elo se correspondem.';
    }

    void OUT;
    const valores: Record<string, number> = {};
    return { valores, veredito: alx15(P.join('') + VER) };
  },
  // ── m15 INST 09 · Simulador de acoplamento gás → despacho ──
  'm15-inst-09': (i) => {
    const OUT: Record<string, string> = {};
    let VER = '';
    const T: Record<string, string> = {};

    let gas=nm(i['ac-gas-n'], 9.00, 2, 30);
    let cx=nm(i['ac-cx-n'], 5.40, 2.5, 9);
    let hr=nm(i['ac-hr-n'], 7.10, 5.5, 14);
    let om=nm(i['ac-om-n'], 58, 0, 200);
    let cmo=nm(i['ac-cmo-n'], 330, 20, 1200);
    let inf=nm(i['ac-inf-n'], 40, 0, 100);
    let cc=gas*cx*hr;
    let cvu=cc+om;
    let ef=100/(hr*293.07/1000);
    let gb=(cmo-om)/(cx*hr);
    OUT['ac-cc'] = 'R$ '+fmt11(cc,0)+'<span class="u">/MWh</span>';
    OUT['ac-cvu'] = 'R$ '+fmt11(cvu,0)+'<span class="u">/MWh</span>';
    OUT['ac-ef'] = fmt11(ef,1)+'<span class="u">%</span>';
    T['ac-po'] = (cvu<=cmo?'Dentro do mérito':'Fora do mérito')+
    '<span class="u"> · '+(cvu>=cmo?'+':'')+fmt11(cvu-cmo,0)+' R$/MWh</span>';
    OUT['ac-gs'] = fmt11(inf,0)+'<span class="u">% da capacidade</span>';
    OUT['ac-gb'] = (gb>0?'US$ '+fmt11(gb,2):'—')+'<span class="u">/MMBtu</span>';




    if(cvu<=cmo && inf>0){

    VER = '<b>Dois sinais, e eles não dizem a mesma coisa.</b> A usina está dentro da ordem de mérito, com custo variável de R$ '+fmt11(cvu,0)+' contra custo marginal de R$ '+fmt11(cmo,0)+'. <b>Mas '+fmt11(inf,0)+'% da capacidade geraria de qualquer modo</b>, por inflexibilidade declarada — e essa parcela não carrega informação econômica sobre o combustível. Observar a usina gerando não permite inferir o preço do gás: só a geração <em>acima</em> do patamar de inflexibilidade responde ao mérito.';
    } else if(cvu<=cmo && inf<=0){

    VER = '<b>Único caso em que o despacho carrega sinal econômico limpo.</b> Custo variável de R$ '+fmt11(cvu,0)+' abaixo do custo marginal de R$ '+fmt11(cmo,0)+', sem inflexibilidade declarada. Aqui, e apenas aqui, a geração da usina informa algo sobre o custo do combustível. Ainda assim, restrição elétrica, requisitos de acionamento e decisão de garantia de suprimento continuam podendo alterar o despacho efetivo.';
    } else if(cvu>cmo && inf>0){

    VER = '<b>A usina vai gerar sem sinal econômico algum.</b> Custo variável de R$ '+fmt11(cvu,0)+' acima do custo marginal de R$ '+fmt11(cmo,0)+' — o mérito a dispensaria —, mas '+fmt11(inf,0)+'% da capacidade está declarada como inflexível e o despacho ocorre assim mesmo. Esta é a situação que a frase "a térmica ligou, logo o gás está caro" descreve exatamente ao contrário: o gás pode estar caro <em>e</em> a usina gerar, porque quem manda é o contrato. Para entrar no mérito, o gás entregue precisaria cair para cerca de US$ '+fmt11(gb,2)+' por MMBtu.';
    } else {

    VER = '<b>Fora do mérito e sem inflexibilidade — a usina não é convocada por custo.</b> Custo variável de R$ '+fmt11(cvu,0)+' contra custo marginal de R$ '+fmt11(cmo,0)+'. Para entrar na ordem de mérito, o gás entregue precisaria cair para cerca de US$ '+fmt11(gb,2)+' por MMBtu, mantidos câmbio e consumo específico. Note que uma variação cambial de R$ 0,50 move o custo de combustível em cerca de R$ '+fmt11(0.5*gas*hr,0)+' por MWh <em>sem que o preço do gás tenha mudado</em>.';
    }

    void OUT;
    const valores: Record<string, number> = {};
    const put = (k: string, v: number) => { if (Number.isFinite(v)) valores[k] = v; };
    put("ac-cc", cc);
    put("ac-cvu", cvu);
    put("ac-ef", ef);
    put("ac-gs", inf);
    put("ac-gb", gb);
    return { valores, veredito: alx15('<b>Posição vs. custo marginal</b><br>' + (T['ac-po'] ?? '') + '<br><br>' + VER) };
  },

};

export const temCalculadora = (id: string) => id in INSTRUMENT_CALCULATORS;
