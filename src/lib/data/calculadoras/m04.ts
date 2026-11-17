// Calculadoras do M04 no modelo v3 (porte verbatim do script da fonte).
// Posse: a sessão de porte do M04. Uma chave aqui SUBSTITUI a de mesmo id em
// INSTRUMENT_CALCULATORS — é assim que um conserto entra sem editar o arquivo grande.
//
// O QUE MUDA em relação ao arquivo grande: só a ESCALA das saídas em reais. O script
// da fonte formata dinheiro com `mi()` ("R$ 16 mi", "R$ 720 mil"), e a aula v3 escreve
// "número + unidade" com `unit` fixa por saída. As saídas monetárias saem, por isso, em
// R$ mi ou R$ mil (a escala que a fonte mostra no cenário padrão), e a unidade do campo
// diz qual. O cálculo, os ramos e o texto do veredito são os do arquivo grande, que a
// extração conferiu contra o script original (38.200 combinações, 0 divergência), e que
// tools/alexandria-dados/porte/verificar-instrumentos-m04.mjs volta a conferir contra o
// script da fonte executado (mini-dom).
//
// Os blocos abaixo (constantes e as sete funções) são CÓPIA LITERAL de
// src/lib/data/alexandria-instrument-calculators.ts (linhas 63–115 e 2605–2848); importar
// de lá criaria ciclo, porque o arquivo grande espalha estas chaves por cima das dele.
import type { CalculateFn, EntradaInstrumento } from "../alexandria-instrument-calculators";

const n = (v: EntradaInstrumento | undefined): number => {
  const x = typeof v === "string" ? Number(v) : v;
  return Number.isFinite(x) ? (x as number) : 0;
};

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

const BASE: Record<string, CalculateFn> = {
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
    let marg: string | null = null;
    for (const f of frota) {
      const usa = Math.min(f.cap, resto);
      resto -= usa;
      if (usa > 0.001) { price = f.cvu; marg = f.nome; }
    }
    const def = Math.max(0, resto);
    if (def > 0.001) { price = PLD_MAX_HORARIO; marg = 'déficit'; }
    // Piso e teto do original, nesta ordem — o piso vence o teto quando
    // ambos poderiam se aplicar, porque é o primeiro ramo do if/else.
    let lim = 'nenhum';
    if (price < PLD_MIN) { price = PLD_MIN; lim = 'piso R$ 57,31'; }
    else if (price > PLD_MAX_HORARIO) { price = PLD_MAX_HORARIO; lim = 'teto horário'; }
    else if (price > PLD_MAX_ESTRUTURAL) lim = 'acima do teto estrutural';
    return {
      valores: { 'i1-p': price, 'i1-def': def },
      textos: { 'i1-p': brl(price) + '/MWh', 'i1-m': marg ?? '—', 'i1-def': num(def) + ' MW', 'i1-lim': lim },
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
      textos: { 'i2-p': brl(med) + '/MWh', 'i2-mes': MES[mxi], 'i2-max': brl(mx) + '/MWh', 'i2-x': mi(mx * 730) },
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
      textos: { 'i3-r': mi(rec), 'i3-c': mi(cst), 'i3-g': gap > 0 ? mi(gap) : 'zero', 'i3-k': gap > 0 ? 'R$ ' + num(need) + '/kW-ano' : 'não precisa' },
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
      textos: { 'i4-q': num(somaMW) + ' MW', 'i4-c': somaMW > 0 ? brl(corte) + '/MWh' : '—', 'i4-m': somaMW > 0 ? brl2(med) + '/MWh' : '—', 'i4-f': num(falta) + ' MW' },
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
    let mni = 0;
    for (let m = 0; m < 12; m++) {
      const pld = clamp04(L + S * WAVE_M04[m], PLD_MIN, PLD_MAX_HORARIO);
      const t = fix + (1 - C) * pld * CONS_M04;
      soma += t;
      if (t > mx) { mx = t; mxi = m; }
      if (t < mn) { mn = t; mni = m; }
    }
    const med = soma / 12;
    const amp = mx - mn;
    return {
      valores: { 'i5-a': med, 'i5-r': amp },
      textos: { 'i5-a': mi(med), 'i5-lo': MES[mni] + ' · ' + mi(mn), 'i5-w': MES[mxi] + ' · ' + mi(mx), 'i5-r': mi(amp) },
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
      textos: { 'i6-r': (pay >= 0 ? '+ ' : '− ') + mi(Math.abs(pay)), 'i6-a': mi(semH), 'i6-b': mi(comH), 'i6-u': brl2(efe) + '/MWh' },
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
      textos: { 'i7-e': (over > 0 ? '−' + num(over) : num(resid)) + '%', 'i7-m': mi(med), 'i7-w': MES[mxi] + ' · ' + mi(mx), 'i7-r': mi(mx - mn) },
      veredito: ((): string => {
    if (over>0) return `As camadas somam ${num(soma)}% do consumo: há ${num(over)}% de sobrecontratação estrutural. Todo mês a empresa compra energia a preço de contrato e revende a sobra ao PLD — em geral mais baixo. O custo efetivo sobe para ${brl2(unit)}/MWh mesmo tendo "travado" preço. Contratar demais não é prudência: é comprar caro para revender barato, todo mês, por contrato.`;
    if (resid===0) return `Cem por cento contratado, exposição zero. O custo é perfeitamente previsível em ${brl2(unit)}/MWh — e perfeitamente rígido. Qualquer queda de produção vira sobrecontratação imediata. Previsibilidade total é uma escolha, não um ótimo.`;
    if (resid<=15) return `Exposição residual de ${num(resid)}%, com amplitude anual de ${mi(mx-mn)}. Custo médio de ${brl2(unit)}/MWh. É a faixa em que a folga absorve variação operacional sem transformar o orçamento em aposta — o desenho que a maioria das políticas de risco industriais persegue.`;
    if (resid<=35) return `Exposição de ${num(resid)}% e amplitude anual de ${mi(mx-mn)}. Ainda gerenciável, mas o pior mês (${MES[mxi]}) já custa ${mi(mx)}. Verifique se esse valor cabe no limite financeiro da política, e não apenas no limite percentual — são critérios diferentes e um não garante o outro.`;
    return `Exposição de ${num(resid)}%: a maior parte do custo de energia desta empresa é decidida pelo mercado, não por ela. Amplitude anual de ${mi(mx-mn)}, pior mês em ${MES[mxi]} a ${mi(mx)}. Isso é uma posição direcional em preço de energia assumida por quem não vive de negociar energia.`;
      })(),
    };
  },
};

/** Divisor de cada saída monetária: o valor sai na unidade que `unit` declara. */
export const ESCALA_M04: Record<string, number> = {
  "i2-x": 1e3,
  "i3-r": 1e6, "i3-c": 1e6, "i3-g": 1e6,
  "i5-a": 1e6, "i5-r": 1e3,
  "i6-r": 1e3, "i6-a": 1e6, "i6-b": 1e6,
  "i7-m": 1e6, "i7-r": 1e3,
};

/** Q07: dois vereditos da fonte formatam um percentual com `toFixed(1)` (ponto decimal:
 *  "fator de capacidade de 2.3%"). Só esse caso — dígito, ponto, um dígito, "%" — vira
 *  vírgula; o separador de milhar ("1.250") não é tocado. */
export const decimalUnico = (s: string) => s.replace(/(\d)\.(\d)%/g, '$1,$2%');

export const CALCULADORAS: Record<string, CalculateFn> = Object.fromEntries(
  Object.entries(BASE).map(([id, f]) => [
    id,
    (i: Record<string, EntradaInstrumento>) => {
      const r = f(i);
      const valores: Record<string, number> = {};
      for (const [k, v] of Object.entries(r.valores)) valores[k] = ESCALA_M04[k] ? v / ESCALA_M04[k] : v;
      // INST·04: com nada contratado a fonte escreve "—" no preço de corte e no preço
      // médio (Q07: o arquivo grande devolvia 0, que a tela leria como "R$ 0/MWh").
      // Saída ausente é o "—" do produto: a aula v3 não desenha saída sem valor.
      if (id === "m04-inst-04" && !(valores["i4-q"] > 0)) {
        delete valores["i4-c"];
        delete valores["i4-m"];
      }
      return { ...r, valores, vereditoPtBr: true, veredito: r.veredito ? decimalUnico(r.veredito) : r.veredito };
    },
  ]),
);
