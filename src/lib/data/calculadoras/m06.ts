// Calculadoras novas ou corrigidas do M06 (porte verbatim do script da fonte).
// Posse: a sessão de porte do M06. Uma chave aqui SUBSTITUI a de mesmo id em
// INSTRUMENT_CALCULATORS — é assim que um conserto (Q05/Q07) entra sem editar o arquivo grande.
//
// Fonte: `<script>` de `Alexandria modulos/alexandria_modulo06.html`, blocos INST 02–08
// (L1694–2232). Vereditos verbatim (Q06), com os formatadores literais da fonte (`num`, `pct`,
// `mmi`). O que muda em relação às calculadoras antigas do arquivo grande:
//
//   INST 02 · volta a leitura "Anos até cair a 50%" (número, quando a cobertura cruza 50% em até
//             60 anos; acima disso, o texto literal "> 60 anos").
//   INST 04 · voltam "Meses até o limite" e "Nível final sem corte". Q07: a fonte escreve o nível
//             final sem limite (passa de 100% com afluência acima da média — content QA do M06);
//             o gráfico da própria fonte limita a curva a 0–100 (`clamp(E-d*t,0,100)`), e é essa
//             a correção aplicada à leitura.
//   INST 05 · volta o seletor de regime (`i5-seg`, três regimes) e o quadro das seis perguntas da
//             régua por regime (`grid()`); volta "Horizonte de menor atrito".
//   INST 07 · voltam os dois seletores (grupo tarifário e origem da energia) e todos os ramos do
//             veredito, inclusive os de baixa tensão, antes inalcançáveis; volta "Limiar no ano".
//   INST 08 · a cadeia do marco escolhido sai com os rótulos literais dos quatro quadros.
//
//   INST 01 · (§MAP, entra na Aula 01) o painel do marco escolhido, com o rótulo literal da fonte
//             "Cicatriz que ainda opera hoje" (a calculadora antiga escrevia "O que ficou").
//
// Cada leitura sai em `textos` na formatação literal do readout da fonte ("12,9%", "775 índice",
// "esgotado", "sem limite", "Port. Norm. 50/2022"); `valores` guarda o número para a previsão.
// Os vereditos já saem em pt-BR (`vereditoPtBr: true`: "Lei nº 9.074/1995" não pode virar vírgula).

import type { CalculateFn, EntradaInstrumento } from '../alexandria-instrument-calculators';
import { MODULO_06_TRAUMA_CICATRIZ, M06_INST05_REGIMES, M06_INST01_MARCOS } from '../alexandria-modulo-06-content';

const n = (v: EntradaInstrumento | undefined): number => {
  const x = typeof v === 'number' ? v : parseFloat(String(v ?? ''));
  return Number.isFinite(x) ? x : 0;
};
const clamp = (v: number, a: number, b: number) => (v < a ? a : v > b ? b : v);
/** Formatadores literais do script da fonte. */
const num = (v: number, d = 0) => v.toLocaleString('pt-BR', { minimumFractionDigits: d, maximumFractionDigits: d });
const pct = (v: number, d = 1) => num(v, d) + '%';
const mmi = (v: number) =>
  Math.abs(v) >= 1000
    ? 'R$ ' + (v / 1000).toLocaleString('pt-BR', { maximumFractionDigits: 2 }) + ' bi'
    : 'R$ ' + v.toLocaleString('pt-BR', { maximumFractionDigits: 0 }) + ' mi';
const R = (valores: Record<string, number>, textos: Record<string, string>, veredito: string) => ({ valores, textos, veredito, vereditoPtBr: true });

// ── INST 02 · a erosão do custo histórico (L1694–1748) ────────
const R02 = 0.1;
const inst02: CalculateFn = (i) => {
  const Hh = n(i['i2-h-n']);
  const I = n(i['i2-i-n']);
  const N = n(i['i2-n-n']);
  const Mm = n(i['i2-m-n']);
  const C = n(i['i2-c-n']);
  const fator = (k: number) => (1 - Mm / 100) * Math.pow(1 + I / 100, k) + (Mm / 100) * Math.pow(1 + (I + C) / 100, k);
  const f = fator(N);
  const cb = 1 / f;
  const rep = Hh * f;
  const pc = (R02 * Hh) / Math.pow(1 + I / 100, N);
  let anos: number | null = null;
  for (let k = 1; k <= 60; k++) if (1 / fator(k) < 0.5) { anos = k; break; }
  const a5 = anos === null ? '> 60 anos' : `${anos} anos`;
  const valores: Record<string, number> = { 'i2-cb': cb * 100, 'i2-rp': rep, 'i2-pc': pc };
  if (anos !== null) valores['i2-a5'] = anos;
  let v: string;
  if (cb >= 0.9) v = `Cobertura de ${pct(cb * 100)}. Nesta combinação, remunerar pelo custo histórico ainda sustenta a reposição do ativo: a diferença entre valor nominal reconhecido e custo de repor é pequena o bastante para não travar decisão de investimento. É por isso que o regime é impecável em moeda estável — e por isso ele não pareceu problemático quando foi desenhado.`;
  else if (cb >= 0.65) v = `Cobertura de ${pct(cb * 100)} após ${N} anos. A erosão já é perceptível e começa a aparecer como adiamento de expansão, não como recusa explícita. Repare que a queda é composta: cada ano adicional custa mais que o anterior, e ela cruza os 50% em ${a5}.`;
  else if (cb >= 0.35) v = `Cobertura de ${pct(cb * 100)}. A receita reconhecida remunera menos de dois terços do que seria necessário para repor o mesmo ativo. Neste território, expandir deixa de fazer sentido econômico para quem já está na concessão, e o capital novo simplesmente não aparece — sem que nenhuma regra tenha proibido nada. É exatamente o mecanismo que secou o investimento privado entre 1934 e os anos 1940.`;
  else v = `Cobertura de ${pct(cb * 100)}: o regime deixou de ser regulação de preço e virou expropriação econômica de fato, ainda que não de direito. Com ${Mm}% do equipamento importado e câmbio ${C} pontos acima da inflação, o custo de reposição multiplicou por ${num(f, 1)} enquanto a receita ficou nominalmente parada. Nenhum operador expande nessas condições, e a escassez resultante aparece com o atraso típico de uma obra — cinco a dez anos depois da decisão que a causou.`;
  return R(valores, { 'i2-cb': pct(cb * 100), 'i2-rp': `${num(rep, 0)} índice`, 'i2-pc': `${num(pc, 1)} a.a. real`, 'i2-a5': a5 }, v);
};

// ── INST 03 · como se forma uma dívida intrassetorial (L1752–1812) ──
const inst03: CalculateFn = (i) => {
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
  let v: string;
  if (naopago <= 0.001 && T >= 100) v = `A tarifa cobre integralmente o custo do serviço e a empresa autofinancia ${pct((autofin / I) * 100, 0)} do investimento exigido; o restante é captado dentro do teto de endividamento e nada vira conta não paga. É a única configuração do modelo estatal que se sustenta no tempo — e é exatamente a configuração que a política macroeconômica dos anos 1980 tornou impossível.`;
  else if (naopago <= 0.001) v = `Sem inadimplência dentro do setor, mas com passivo financeiro acumulado de ${num(df, 0)} — ${num(df / I, 1)} vezes o investimento anual. Com câmbio ${C} pontos acima da inflação e ${S}% do funding em moeda estrangeira, o serviço dessa dívida cresce mais rápido que a receita, ainda que hoje o caixa feche. É a antessala do problema, não a ausência dele.`;
  else if (di / I <= 2) v = `A tarifa em ${T}% do custo do serviço deixa ${num(naopago, 0)} por ano sem funding, e em ${Y} anos isso vira ${num(di, 0)} de obrigações não honradas dentro do próprio setor — além de ${num(df, 0)} de dívida financeira. Como todas as empresas pertencem ao mesmo dono, isso não produz falência: produz saldo contábil. O sintoma não aparece no balanço, aparece na obra que não começa.`;
  else v = `Passivo total de ${num(df + di, 0)}, ou ${num((df + di) / I, 1)} vezes o investimento anual, dos quais ${num(di, 0)} são conta simplesmente não paga entre empresas. Nesta faixa o fluxo financeiro do setor deixa de ser legível: ninguém consegue dizer com precisão quem deve quanto a quem, e nenhuma empresa pode ser avaliada — nem para venda, nem para recapitalização pública. É o estado em que o setor chegou a 1993, e é por isso que a reforma começou por um encontro de contas.`;
  return R(
    { 'i3-af': I > 0 ? (autofin / I) * 100 : 0, 'i3-df': df, 'i3-di': di, 'i3-rt': I > 0 ? (df + di) / I : 0 },
    { 'i3-af': pct((autofin / I) * 100, 0), 'i3-df': `${num(df, 0)} índice`, 'i3-di': `${num(di, 0)} índice`, 'i3-rt': `${num((df + di) / I, 1)} × o ano` },
    v,
  );
};

// ── INST 04 · termômetro do racionamento (L1816–1872) ─────────
const BASE = 11, FLOOR = 15, RES = 5;
const inst04: CalculateFn = (i) => {
  const E = n(i['i4-e-n']);
  const A = n(i['i4-a-n']);
  const Mg = n(i['i4-m-n']);
  const T = n(i['i4-t-n']);
  const extra = Math.max(0, 8 - Mg) * 0.25;
  const bruto = BASE + extra;
  const aporte = BASE * (A / 100);
  const d = bruto - aporte;
  const usable = Math.max(0, E - (FLOOR + RES));
  const permitido = T > 0 ? usable / T : 0;
  const r = clamp(1 - (permitido + aporte) / bruto, 0, 1);
  const valores: Record<string, number> = { 'i4-ct': r * 100, 'i4-qm': d };
  let ms: string;
  if (d <= 0.0001) ms = 'não atinge';
  else if (E <= FLOOR) ms = 'já abaixo';
  else { valores['i4-ms'] = (E - FLOOR) / d; ms = `${num((E - FLOOR) / d, 1)} meses`; }
  const fim = Math.min(E - d * T, 100); // Q07: o gráfico da fonte limita a 0–100
  if (fim >= 0) valores['i4-nf'] = fim;
  const textos = {
    'i4-ct': pct(r * 100, 1),
    'i4-ms': ms,
    'i4-nf': fim < 0 ? 'esgotado' : pct(fim, 0),
    'i4-qm': d <= 0 ? `+${num(-d, 2)} p.p./mês · recompõe` : `${num(d, 2)} p.p./mês`,
  };
  let v: string;
  if (r <= 0.0005) v = `Nenhum corte necessário. Com afluência em ${A}% da média e ${Mg}% de margem firme, o sistema atravessa os ${T} meses e ainda encerra o período seco com folga sobre o limite operacional. Repare que a margem firme faz parte do resultado: ela é o que permite poupar reservatório sem tocar na demanda.`;
  else if (r <= 0.08) v = `Corte de ${pct(r * 100, 1)}. É a faixa em que resposta voluntária, campanha de eficiência e ajuste de contrato ainda dão conta — sem programa compulsório. Mas note quanto disso depende da margem firme: com ${Mg}% de capacidade não hidráulica, quase todo o esforço de poupar reservatório está sendo pedido ao consumidor em vez de ser feito pelo parque gerador.`;
  else if (r <= 0.2) v = `Corte de ${pct(r * 100, 1)} — território de programa compulsório com meta, bônus e sobretarifa. Foi aproximadamente aqui que 2001 pousou. O que essa configuração revela não é seca: é margem. Com armazenamento em ${E}% e apenas ${Mg}% de capacidade firme não hidráulica, uma afluência de ${A}% da média já basta para exigir corte, e uma afluência assim está dentro do universo que qualquer planejamento deveria comportar.`;
  else if (r <= 0.4) v = `Corte de ${pct(r * 100, 1)}. Nesta profundidade o programa deixa de ser gestão de demanda e passa a redesenhar a produção industrial do país: turnos, contratos de fornecimento, cadeia produtiva inteira. O impacto macroeconômico é da ordem de pontos de PIB, e a distribuição é desigual — quem tem flexibilidade se ajusta, quem não tem, para.`;
  else v = `Corte de ${pct(r * 100, 1)}: acima de quarenta por cento, redução voluntária ou tarifada não entrega, e o sistema passa a depender de interrupção programada — que é outra coisa, com outro custo e outra consequência jurídica. Neste ponto o diagnóstico já não é sobre o período seco em curso, e sim sobre uma decisão de expansão que deixou de ser tomada anos antes.`;
  return R(valores, textos, v);
};

// ── INST 05 · comparador de arquiteturas (L1876–1962) ─────────
const KEYS = ['Quem é dono', 'Quem financia a expansão', 'Quem planeja', 'Quem opera', 'Como o preço é definido', 'Quem carrega o risco de expansão', 'Modo de falha característico'];
const falta = (F0: number, h: number) => F0 * Math.pow(Math.max(0, 1 - h / 7), 1.6);
const sobra = (S0: number, h: number) => S0 * Math.pow(clamp(h / 6, 0, 1), 1.4);
const inst05: CalculateFn = (i) => {
  const G = M06_INST05_REGIMES[clamp(Math.trunc(n(i['i5-seg'])), 0, M06_INST05_REGIMES.length - 1)];
  const Hh = n(i['i5-h-n']);
  const f = falta(G.F0, Hh);
  const s = sobra(G.S0, Hh);
  const t = f + s;
  let best = 0;
  let bt = 1e9;
  for (let k = 0; k <= 6; k++) {
    const tt = falta(G.F0, k) + sobra(G.S0, k);
    if (tt < bt - 1e-9) { bt = tt; best = k; }
  }
  const grade = KEYS.map((k, j) => `<b>${k}</b> — ${G.r[j]}`).join('<br>') + `<br><b>Horizonte efetivo no período</b> — <b>${G.h}</b><br><br>`;
  const pre = 'Regime ' + G.n + '. ';
  let v: string;
  if (Hh === best) v = `${pre}Horizonte de ${Hh} ano(s) é o ponto de menor atrito para esta arquitetura: risco de faltar em ${num(f, 0)} e de sobrar em ${num(s, 0)}. Repare que o ótimo se desloca com o regime — o mesmo horizonte que é prudente numa arquitetura é caro demais em outra, porque o que muda é quanto o resto do desenho já protege contra subinvestimento.`;
  else if (Hh < best) v = `${pre}Horizonte de ${Hh} ano(s) contra ${best} de menor atrito. Você está aceitando risco de faltar em ${num(f, 0)} para economizar risco de sobrar. Numa arquitetura em que o financiamento da expansão depende de contrato longo, encurtar o horizonte não reduz custo — apenas transfere a incerteza para o investidor, que a devolve no preço do leilão ou simplesmente não aparece.`;
  else v = `${pre}Horizonte de ${Hh} ano(s), acima dos ${best} de menor atrito. O risco de faltar já está em ${num(f, 0)}, baixo, e o de sobrar em ${num(s, 0)} — e sobra também é custo, pago pelo mesmo consumidor que a antecedência deveria proteger. É o trade-off que a arquitetura de 2004 assumiu conscientemente ao trocar risco de racionamento por risco de sobrecontratação.`;
  return R(
    { 'i5-rf': f, 'i5-rs': s, 'i5-rt': t, 'i5-rb': best },
    { 'i5-rf': num(f, 0), 'i5-rs': num(s, 0), 'i5-rt': num(t, 0), 'i5-rb': best + ' ano' + (best === 1 ? '' : 's') },
    grade + v,
  );
};

// ── INST 06 · o efeito de uma liminar num rateio (L1966–2000) ─
const inst06: CalculateFn = (i) => {
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
  let v: string;
  if (f1 <= 0.001) v = `Nenhuma falta no ciclo: as garantias disponíveis, em ${pct(G, 0)} do devido, cobrem integralmente a parcela protegida por decisão judicial. Os credores recebem cem por cento. É esta a configuração em que o rateio funciona como projetado — e note quanto ela depende de a proteção judicial ser pequena em relação às garantias, e não do mérito da disputa.`;
  else if (tx >= 0.95) v = `Recebimento de ${pct(tx * 100, 1)}. O corte é pequeno, mas o mecanismo já está operando: ${mmi(f1)} que alguém devia entram no caixa como zero e saem do bolso de quem não tinha nada a ver com a disputa. Em três ciclos, mantido o padrão de contágio, o acumulado chega a ${mmi(acum)}.`;
  else if (tx >= 0.8) v = `Recebimento de ${pct(tx * 100, 1)}, com ${mmi(perda)} de perda média por credor no ciclo. A partir daqui a decisão racional de cada agente prejudicado é buscar a própria proteção judicial — e é exatamente por isso que a parcela protegida sobe para ${pct(p2, 0)} no ciclo seguinte e ${pct(p3, 0)} no terceiro. A liquidação deixa de ser contabilidade e vira disputa.`;
  else v = `Recebimento de ${pct(tx * 100, 1)}: o sistema de rateio está quebrado como mecanismo de liquidação. Com ${mmi(acum)} retidos em três ciclos, o preço de curto prazo deixa de ser um sinal econômico e passa a ser uma pretensão contábil. Nenhuma decisão judicial individual criou isso — cada uma delas foi razoável no seu próprio processo. O resultado agregado é que a arquitetura de liquidação não tem fundo garantidor dimensionado para absorver proteção judicial em escala, e a solução, historicamente, teve de ser legislativa.`;
  return R(
    { 'i6-tx': tx * 100, 'i6-fa': f1, 'i6-pm': perda, 'i6-ac': acum },
    { 'i6-tx': pct(tx * 100, 1), 'i6-fa': mmi(f1), 'i6-pm': mmi(perda), 'i6-ac': mmi(acum) },
    v,
  );
};

// ── INST 07 · linha da abertura do ACL (L1990–2134) ───────────
function thr(year: number, g: number, inc: number): number {
  if (g === 1) {
    if (year >= 2028) return 0;
    if (year >= 2027) return 0;
    return -1;
  }
  if (inc === 1) {
    if (year >= 2024) return 0;
    if (year >= 1998) return 500;
    return -1;
  }
  if (year >= 2024) return 0;
  if (year >= 2023) return 500;
  if (year >= 2022) return 1000;
  if (year >= 2021) return 1500;
  if (year >= 2020) return 2000;
  if (year >= 2019) return 2500;
  if (year >= 1996) return 3000;
  return -1;
}
function norma(year: number, g: number, inc: number): string {
  if (g === 1) {
    if (year >= 2028) return 'Lei 15.269/2025 · prazo';
    if (year >= 2027) return 'Lei 15.269/2025 · prazo';
    if (year >= 2025) return 'Lei 15.269/2025 · aguarda prazo';
    return 'sem previsão à época';
  }
  if (year >= 2024) return 'Port. Norm. 50/2022';
  if (inc === 1) return year >= 1998 ? 'regime de incentivadas' : 'sem previsão à época';
  if (year >= 2021) return 'Portaria MME 465/2019';
  if (year >= 2019) return 'Portaria MME 514/2018';
  if (year >= 1996) return 'Lei 9.074/1995';
  return 'sem previsão à época';
}
function elig(year: number, kW: number, g: number, inc: number): boolean {
  if (g === 1) return year >= 2027;
  const t = thr(year, g, inc);
  if (t < 0) return false;
  return kW >= t;
}
const Y0 = 1995, Y1 = 2028;
const inst07: CalculateFn = (i) => {
  const grupo = clamp(Math.trunc(n(i['i7-seg-g'])), 0, 1);
  const fonte = clamp(Math.trunc(n(i['i7-seg-f'])), 0, 1);
  // Campo ausente vale o padrão do markup (`value="2024"`, `value="800"`), como na fonte ao carregar.
  const Yr = i['i7-y-n'] === undefined || i['i7-y-n'] === '' ? 2024 : n(i['i7-y-n']);
  const K = i['i7-k-n'] === undefined || i['i7-k-n'] === '' ? 800 : n(i['i7-k-n']);
  const t = thr(Yr, grupo, fonte);
  const ok = elig(Yr, K, grupo, fonte);
  let first = '—';
  for (let k = Y0; k <= Y1; k++) if (elig(k, K, grupo, fonte)) { first = k >= 2027 && grupo === 1 ? `${k} · prazo legal` : String(k); break; }
  const gtxt = grupo === 1 ? 'baixa tensão' : 'Grupo A';
  const ftxt = fonte === 1 ? 'fonte incentivada' : 'energia convencional';
  let v: string;
  if (grupo === 1) {
    if (Yr >= 2028) v = `Em ${Yr}, pelo cronograma da Lei nº 15.269/2025, todos os consumidores de baixa tensão — incluindo residenciais e rurais — têm direito de escolher fornecedor. É o ponto final de uma escada que começou em 1995 e levou mais de trinta anos. Lembre da ressalva: prazo legal condicionado a regulamentação e a pré-requisitos operacionais, não elegibilidade automática.`;
    else if (Yr >= 2027) v = `Em ${Yr}, o cronograma da Lei nº 15.269/2025 alcança consumidores industriais e comerciais de baixa tensão. Estimativas de associação setorial falam em milhões de pequenos comércios e centenas de milhares de pequenas indústrias entrando na faixa elegível — uma ordem de grandeza dezenas de vezes maior que a abertura de 2024. Prazo legal, condicionado a regulamentação.`;
    else v = `Em ${Yr}, unidade de baixa tensão não tem elegibilidade ao mercado livre, independentemente da carga: a abertura da baixa tensão só ganhou cronograma legal com a Lei nº 15.269/2025, com prazos em novembro de 2027 e novembro de 2028. Antes disso, a única via para esse consumidor era a geração distribuída — que é outra coisa, e vive de outro conjunto de regras.`;
  } else if (t < 0) {
    v = `Em ${Yr} não existia figura de consumidor livre para ${ftxt}. A elegibilidade nasce com a Lei nº 9.074/1995 e passa a valer, na prática, a partir de 1996 — e mesmo então com requisitos combinados de carga e tensão. Antes disso, todo consumidor era cativo da concessionária da sua área, sem exceção.`;
  } else if (ok) {
    if (t === 0) v = `Elegível em ${Yr}, e sem depender da carga: desde 1º de janeiro de 2024 todo consumidor do ${gtxt} pode contratar ${ftxt} de qualquer fornecedor autorizado, sem exigência de carga mínima. Estimativas de associação setorial apontam cerca de 165 mil empresas que se tornaram aptas nesse momento — é este o marco que cria o mercado endereçável de um produto independente de inteligência energética no Brasil.`;
    else v = `Elegível em ${Yr}: com ${num(K, 0)} kW, a unidade está ${num(K / t, 1)} vez(es) acima do limiar de ${num(t, 0)} kW vigente pela ${norma(Yr, grupo, fonte)}. Vale a pergunta que o §Caso faz: se ela é elegível há anos e não migrou, isso foi decisão consciente ou omissão herdada? A resposta muda completamente o diagnóstico.`;
  } else {
    v = `Não elegível em ${Yr}: o limiar vigente é de ${num(t, 0)} kW pela ${norma(Yr, grupo, fonte)}, e a unidade tem ${num(K, 0)} kW. Faltam ${num(t - K, 0)} kW. Deslize o ano para a direita e observe em que degrau a escada desce abaixo da carga — essa data é o momento exato em que esta unidade entrou no mercado endereçável, e ${first === '—' ? 'ela não é alcançada dentro do horizonte legal conhecido para este perfil.' : 'ela é ' + first + '.'}`;
  }
  const lm = t < 0 ? '—' : t === 0 ? 'sem limite' : `${num(t, 0)} kW`;
  // "Limiar no ano" em número para a previsão: 0 quando a fonte escreve "sem limite"; ausente
  // quando ainda não havia consumidor livre ("—").
  const valores: Record<string, number> = {};
  if (t >= 0) valores['i7-lm'] = t;
  const textos = { 'i7-st': ok ? 'Elegível' : 'Não elegível', 'i7-lm': lm, 'i7-nm': norma(Yr, grupo, fonte), 'i7-el': first };
  return R(valores, textos, v);
};

// ── INST 08 · mapa trauma → cicatriz (L2138–2232) ─────────────
const inst08: CalculateFn = (i) => {
  const T = MODULO_06_TRAUMA_CICATRIZ;
  const cur = clamp(Math.trunc(n(i['i8-sel'])), 0, T.length - 1);
  const it = T[cur];
  const cadeia =
    `<b>${it.periodo} · ${it.titulo}</b><br>` +
    `<b>Problema revelado</b> — ${it.problema}<br>` +
    `<b>Resposta institucional</b> — ${it.resposta}<br>` +
    `<b>Cicatriz que opera hoje</b> — ${it.cicatriz}<br>` +
    `<b>Risco novo em troca</b> — ${it.riscoNovo}<br><br>`;
  const v =
    cur === T.length - 1
      ? `Marco ${cur + 1} de ${T.length}. Este é o único da lista cuja cicatriz ainda não terminou de se formar — e é exatamente por isso que ele é o mais valioso comercialmente. Todos os outros dez você usa para explicar por que o setor é como é; este você usa para explicar por que existe uma janela agora.`
      : `Marco ${cur + 1} de ${T.length}. Percorra os quatro quadros na ordem e repare que o quarto nunca é vazio: nenhuma resposta institucional deste bloco eliminou um risco — todas trocaram um risco por outro, mais administrável. Saber nomear o risco novo é o que separa quem entende o setor de quem decorou a linha do tempo.`;
  return R({}, {}, cadeia + v);
};

// ── INST 01 · linha do tempo, §MAP (L1626–1690) ───────────────
// Painel do marco: ano, título, corpo e "Cicatriz que ainda opera hoje" (rótulo literal do markup,
// `div.lg > b`), do `var M` da fonte (M06_INST01_MARCOS).
const inst01: CalculateFn = (i) => {
  const M = M06_INST01_MARCOS;
  const k = clamp(Math.trunc(n(i['m06-i1-sel'])), 0, M.length - 1);
  const m = M[k];
  return R({}, {}, `<b>${m.ano}</b> · <b>${m.titulo}</b><br><br>${m.corpo}<br><br><b>Cicatriz que ainda opera hoje</b> — ${m.legado}`);
};

export const CALCULADORAS: Record<string, CalculateFn> = {
  'm06-inst-01': inst01,
  'm06-inst-02': inst02,
  'm06-inst-03': inst03,
  'm06-inst-04': inst04,
  'm06-inst-05': inst05,
  'm06-inst-06': inst06,
  'm06-inst-07': inst07,
  'm06-inst-08': inst08,
};
