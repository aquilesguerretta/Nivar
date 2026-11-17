// Calculadoras do M03, porte VERBATIM do <script> da fonte
// (docs/alexandria-v2/extraction/m03/instrumentos.json, `script.codigo_verbatim`).
// Posse: a sessão de porte do M03. Uma chave aqui SUBSTITUI a de mesmo id em
// INSTRUMENT_CALCULATORS (Q06: o veredito vem com o <b> e os números da fonte).
//
// O que cada uma devolve (contrato `ResultadoInstrumento`):
//   · `valores` — números do cálculo (previsão e comparação);
//   · `textos`  — cada saída como a fonte escreve na tela, pela mesma `fb()`;
//   · `veredito` — o innerHTML do `.verdict` da fonte; `vereditoPtBr: true`.
// INST·01: a pilha de barras que o script desenha (fonte · %) vem antes do veredito,
// uma linha por fonte. Os desenhos SVG (INST·03, 05, 09) e a pilha de despacho do
// INST·06 não são calculadora: ficam registrados como não portados
// (docs/alexandria-v3/porte/m03.md). Nenhuma mudança de texto ou de conta.

import type { CalculateFn, EntradaInstrumento, ResultadoInstrumento } from '../alexandria-instrument-calculators';

const pf = (v: EntradaInstrumento | undefined): number => parseFloat(String(v ?? ''));
/** `fb()` da fonte. */
const fb = (v: number, d: number) => Number(v).toLocaleString('pt-BR', { minimumFractionDigits: d, maximumFractionDigits: d });
const g = (x: number) => x.toFixed(1).replace('.', ',');

type Resultado = ResultadoInstrumento & { textos: Record<string, string>; vereditoPtBr: true };
const r = (x: Omit<Resultado, 'vereditoPtBr'>): ResultadoInstrumento => {
  const out: Resultado = { ...x, vereditoPtBr: true };
  return out;
};

/** Globais do script (L2814–2815). */
const MESES = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
export const SHAPE = [1.55, 1.55, 1.45, 1.25, 0.85, 0.65, 0.55, 0.5, 0.55, 0.7, 1.0, 1.4];

// ── INST·01 ──
const DATA: Record<string, { n: string; v: number }[]> = {
  cap: [
    { n: 'Hidráulica (UHE + PCH/CGH)', v: 43.5 }, { n: 'Solar (UFV + MMGD)', v: 25.0 }, { n: 'Eólica', v: 13.5 },
    { n: 'Térmicas fósseis', v: 10.0 }, { n: 'Biomassa', v: 6.5 }, { n: 'Nuclear', v: 1.0 },
  ],
  ene: [
    { n: 'Hidráulica (UHE + PCH/CGH)', v: 56.0 }, { n: 'Eólica', v: 13.5 }, { n: 'Solar (UFV + MMGD)', v: 10.0 },
    { n: 'Térmicas fósseis', v: 10.0 }, { n: 'Biomassa', v: 8.0 }, { n: 'Nuclear', v: 2.5 },
  ],
};
const V01: Record<string, string> = {
  cap: '<b>Lente da capacidade: o tamanho dos motores.</b> A solar já é a segunda fonte — um quarto do parque — e a hidráulica caiu para menos da metade. É a foto que sai na manchete. Agora troque a lente e veja a foto que paga as contas.',
  ene: '<b>Lente da energia: quanto cada motor andou.</b> A hidráulica volta a dominar (~55–60%), a solar encolhe para ~1/10 e a nuclear mais que dobra de peso. A diferença entre as duas fotos tem um único nome: fator de capacidade. Quem cita capacidade sem citar FC está contando meia história.',
};

// ── INST·05 ──
export const LOAD = [70, 69, 68, 68, 68, 69, 71, 74, 77, 80, 82, 83, 84, 84, 84, 85, 87, 92, 98, 100, 97, 90, 82, 75, 70];
export const WFAC = [1.15, 1.15, 1.15, 1.15, 1.12, 1.08, 1.0, 0.92, 0.85, 0.8, 0.78, 0.78, 0.8, 0.82, 0.85, 0.9, 0.98, 1.05, 1.1, 1.12, 1.15, 1.15, 1.15, 1.15, 1.15];

// ── INST·06 ──
const PISO = 61;
interface Usina { id: string; name: string; cap: number; cost: number; must: boolean }
function plantList(agua: number, gm: number): Usina[] {
  return [
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
  ];
}

// ── INST·08 ──
const PRESETS: Record<string, { capex: number; fc: number; om: number; vr: number; n: number; label: string }> = {
  solar: { capex: 3500, fc: 27, om: 50, vr: 0, n: 25, label: 'CAPEX R$ 3.500/kW · O&M R$ 50/kW·a · 25 anos' },
  eolica: { capex: 5500, fc: 45, om: 80, vr: 0, n: 25, label: 'CAPEX R$ 5.500/kW · O&M R$ 80/kW·a · 25 anos' },
  gas: { capex: 4500, fc: 45, om: 120, vr: 250, n: 25, label: 'CAPEX R$ 4.500/kW · combustível R$ 250/MWh · 25 anos' },
  hidro: { capex: 8000, fc: 50, om: 90, vr: 5, n: 50, label: 'CAPEX R$ 8.000/kW · O&M R$ 90/kW·a · 50 anos' },
  nuclear: { capex: 30000, fc: 88, om: 400, vr: 40, n: 60, label: 'CAPEX R$ 30.000/kW · O&M R$ 400/kW·a · 60 anos' },
};

// ── INST·09 ──
const PROF: Record<string, { w: number; m: number[] }> = {
  hidro: { w: 50, m: [155, 155, 145, 125, 85, 65, 55, 50, 55, 70, 100, 140] },
  eolica: { w: 15, m: [68, 63, 68, 78, 93, 108, 128, 138, 143, 133, 113, 83] },
  solar: { w: 12, m: [105, 100, 100, 95, 90, 90, 95, 105, 110, 110, 105, 95] },
  bio: { w: 6, m: [20, 15, 25, 80, 130, 160, 170, 170, 160, 140, 110, 50] },
};
const ORDEM09 = ['hidro', 'eolica', 'solar', 'bio'];

export const CALCULADORAS: Record<string, CalculateFn> = {
  'm03-inst-01': (i) => {
    const lens = String(i['i01-pills'] ?? 'cap') in DATA ? String(i['i01-pills'] ?? 'cap') : 'cap';
    const linhas = DATA[lens].map((x) => x.n + ' · ' + fb(x.v, 1) + ' %');
    return r({ valores: {}, textos: {}, veredito: linhas.join('<br>') + '<br><br>' + V01[lens] });
  },

  'm03-inst-02': (i) => {
    const MW = pf(i['i02-mw']) || 0;
    const FC = pf(i['i02-fc']) || 0;
    const gwh = (MW * 8760 * FC) / 100 / 1000;
    const heq = (8760 * FC) / 100;
    const pct = (gwh / 550000) * 100;
    let v: string;
    if (FC < 35)
      v = '<b>Perfil de fonte variável (FC ' + fb(FC, 0) + '%).</b> ' + fb(MW, 0) + ' MW entregam ' + fb(gwh, 0) + ' GWh/ano — o mesmo que ~' + fb((MW * FC) / 88, 0) + ' MW nucleares. Nenhum dos dois é melhor: são produtos diferentes. A pergunta certa nunca é quantos MW — é quantos MWh, quando, e com que firmeza.';
    else if (FC < 70)
      v = '<b>Faixa de hidro, eólica premium ou térmica bem despachada (FC ' + fb(FC, 0) + '%).</b> Equivale a rodar pleno ' + fb(heq, 0) + ' horas no ano. Repare: para térmica, esse número não é atributo da máquina — é o diário de quantas vezes o sistema precisou dela.';
    else
      v = '<b>Território de base (FC ' + fb(FC, 0) + '%).</b> Só nuclear e térmicas rodando quase sempre vivem aqui. Cada MW vira ~' + fb((8.76 * FC) / 100, 1) + ' GWh/ano — é por isso que 2 GW nucleares pesam o dobro do tamanho deles na coluna de energia.';
    return r({
      valores: { 'i02-gwh': gwh, 'i02-heq': heq, 'i02-pct': pct },
      textos: { 'i02-gwh': fb(gwh, 0) + ' GWh/ano', 'i02-heq': fb(heq, 0) + ' h/ano', 'i02-pct': fb(pct, 3) + ' %' },
      veredito: v,
    });
  },

  'm03-inst-03': (i) => {
    const CAPAC = 5;
    const ena = (pf(i['i03-ena']) || 100) / 100;
    let ear = ((pf(i['i03-ear']) || 60) / 100) * CAPAC;
    let minP = 999, minM = 0, termM = 0, deficit = 0;
    for (let m = 0; m < 12; m++) {
      const inflow = SHAPE[m] * ena;
      const gen = Math.min(1, ear + inflow);
      if (gen < 0.999) deficit += 1 - gen;
      ear = Math.min(CAPAC, Math.max(0, ear + inflow - gen));
      const pct = (ear / CAPAC) * 100;
      if (pct < minP) { minP = pct; minM = m; }
      if (pct < 30) termM++;
    }
    let v: string;
    if (deficit > 0.05)
      v = '<b>Estoque zerado: território de racionamento.</b> A bateria do Brasil esvaziou antes da chuva voltar — a hidráulica não cumpre o alvo e o sistema vive de térmica cara e corte. É o desenho de 2001. EAR mínima de ' + fb(minP, 0) + '% em ' + MESES[minM] + '.';
    else if (minP < 12)
      v = '<b>EAR mínima de ' + fb(minP, 0) + '% (' + MESES[minM] + '): o desenho de 2021.</b> O estoque não zera, mas o valor da água dispara, térmicas a CVU altíssimo rodam meses (' + termM + ' meses abaixo de 30%) e a conta chega via bandeira. A bateria salvou o suprimento — cobrando caro.';
    else if (minP < 30)
      v = '<b>Ano apertado: mínimo de ' + fb(minP, 0) + '% em ' + MESES[minM] + '.</b> ' + termM + ' meses na zona de atenção — térmica pesada para poupar água, preço de curto prazo nervoso. É o regime em que o mercado vigia o boletim de ENA toda semana.';
    else
      v = '<b>Ano confortável: a bateria faz o trabalho dela.</b> Carrega na estação úmida, descarrega na seca, mínimo de ' + fb(minP, 0) + '% em ' + MESES[minM] + '. Energia barata o ano inteiro — e ninguém fora do setor percebe o ciclo gigante acontecendo.';
    return r({
      valores: { 'i03-min': minP, 'i03-term': termM },
      textos: { 'i03-min': fb(minP, 0) + ' %', 'i03-mes': MESES[minM], 'i03-term': termM + (termM === 1 ? ' mês' : ' meses') },
      veredito: v,
    });
  },

  'm03-inst-04': (i) => {
    const FIO_CAP = 1.6, RES_CAP = 4, RES_START = 2.5;
    const ena = (pf(i['i04-ena']) || 100) / 100;
    let fioSum = 0, fioMin = 999, stor = RES_START, firmeMin = 999;
    for (let m = 0; m < 12; m++) {
      const inflow = SHAPE[m] * ena;
      const gFio = Math.min(FIO_CAP, inflow);
      fioSum += gFio;
      if (gFio < fioMin) fioMin = gFio;
      const gRes = Math.min(1, stor + inflow);
      stor = Math.min(RES_CAP, Math.max(0, stor + inflow - gRes));
      if (gRes < firmeMin) firmeMin = gRes;
    }
    const fcFio = (fioSum / 12 / FIO_CAP) * 100;
    let v: string;
    if (firmeMin < 0.7)
      v = "<b>A seca venceu as duas — de jeitos diferentes.</b> A fio d'água caiu a " + fb((fioMin / FIO_CAP) * 100, 0) + '% da capacidade no pior mês, como sempre faria. Mas o alarme é o reservatório: o estoque acabou e a entrega firme desabou para ' + fb(firmeMin * 100, 0) + '% do alvo. Quando até a usina-bateria falha, o que sobra é térmica, corte e crise — a firmeza tem limite, e o limite é o estoque.';
    else if (fioMin / FIO_CAP < 0.25)
      v = "<b>Dois produtos, escancarados.</b> Mesma chuva: a fio d'água oscila do teto a " + fb((fioMin / FIO_CAP) * 100, 0) + '% da capacidade (FC anual ' + fb(fcFio, 0) + '%); a de reservatório atravessa o ano entregando ' + fb(firmeMin * 100, 0) + '% do alvo, terminando com ' + fb((stor / RES_CAP) * 100, 0) + '% de estoque. A primeira vende energia média; a segunda vende a certeza — e a certeza é o que falta no sistema pós-2000.';
    else
      v = "<b>Ano bom esconde a diferença.</b> Com água sobrando, até a fio d'água parece firme (pior mês em " + fb((fioMin / FIO_CAP) * 100, 0) + '% da capacidade) e o reservatório nem sua (estoque final ' + fb((stor / RES_CAP) * 100, 0) + '%). É por isso que matriz se julga no ano ruim — arraste a ENA para baixo e veja os produtos se separarem.';
    return r({
      valores: { 'i04-fcfio': fcFio, 'i04-minfio': (fioMin / FIO_CAP) * 100, 'i04-firme': firmeMin * 100, 'i04-stk': (stor / RES_CAP) * 100 },
      textos: {
        'i04-fcfio': fb(fcFio, 0) + ' %',
        'i04-minfio': fb((fioMin / FIO_CAP) * 100, 0) + ' %',
        'i04-firme': fb(firmeMin * 100, 0) + ' % do alvo',
        'i04-stk': fb((stor / RES_CAP) * 100, 0) + ' %',
      },
      veredito: v,
    });
  },

  'm03-inst-05': (i) => {
    const S = pf(i['i05-sol']) || 0;
    const W = pf(i['i05-eol']) || 0;
    const res: number[] = [];
    let exc = 0, minR = 999, minH = 0;
    for (let h = 0; h <= 24; h++) {
      const gs = h >= 6 && h <= 18 ? S * 0.78 * Math.sin((Math.PI * (h - 6)) / 12) : 0;
      const gw = W * WFAC[h];
      let rr = LOAD[h] - gs - gw;
      if (rr < 0) { if (h < 24) exc += -rr; rr = 0; }
      res.push(rr);
      if (rr < minR) { minR = rr; minH = h; }
    }
    let rampa = 0;
    for (let h = 16; h < 21; h++) { const d = res[h + 1] - res[h]; if (d > rampa) rampa = d; }
    let v: string;
    if (exc > 1)
      v = '<b>Sobra estrutural: ' + fb(exc, 0) + ' GWh sem destino no meio-dia.</b> O resíduo bate em zero — preço no piso, vertimento, curtailment. E o mesmo dia ainda cobra +' + fb(rampa, 1) + ' GW/h ao pôr do sol. É o retrato do limite 3 do LCOE: energia barata demais na hora errada — e o argumento físico do leilão de baterias.';
    else if (rampa > 9)
      v = '<b>Rampa pesada: +' + fb(rampa, 1) + ' GW/h entre 17h e 20h.</b> O sol sai, o consumo sobe, e alguém despachável precisa escalar o equivalente a uma Itaipu em poucas horas — hidro com estoque, gás flexível e, daqui em diante, bateria. O resíduo do meio-dia caiu a ' + fb(minR, 0) + ' GW: a barriga e a rampa são o mesmo fenômeno, visto de horas diferentes.';
    else
      v = '<b>Dia administrável.</b> Resíduo mínimo de ' + fb(minR, 0) + ' GW às ' + minH + 'h e rampa de +' + fb(rampa, 1) + ' GW/h — dentro do que o parque flexível resolve sem drama. Suba a solar e veja a barriga afundar e a rampa empinar: é a curva líquida do Módulo 02, agora com as tecnologias nomeadas.';
    return r({
      valores: { 'i05-min': minR, 'i05-rampa': rampa, 'i05-exc': exc },
      textos: { 'i05-min': fb(minR, 0) + ' GW', 'i05-rampa': '+' + fb(rampa, 1) + ' GW/h', 'i05-exc': fb(exc, 0) + ' GWh/dia' },
      veredito: v,
    });
  },

  'm03-inst-06': (i) => {
    const D = pf(i['i06-dem']) || 0;
    const agua = Math.round(pf(i['i06-agua']) || 150);
    const gm = pf(i['i06-gas']) || 1;
    const ps = plantList(agua, gm).sort((a, b) => a.cost - b.cost);
    const byId: Record<string, Usina> = {};
    ps.forEach((p) => { byId[p.id] = p; });
    let mustCap = 0;
    ps.forEach((p) => { if (p.must) mustCap += p.cap; });
    const disp: Record<string, number> = {};
    let marg: Usina | null = null, cut = 0, deficit = 0, cmo: number;
    if (D <= mustCap) {
      let excess = mustCap - D;
      ps.forEach((p) => { disp[p.id] = p.must ? p.cap : 0; });
      const cs = Math.min(excess, byId.sol.cap); disp.sol -= cs; excess -= cs;
      const ce = Math.min(excess, byId.eol.cap); disp.eol -= ce; excess -= ce;
      const ch = Math.min(excess, byId.fio.cap); disp.fio -= ch; excess -= ch;
      cut = cs + ce + ch;
      cmo = PISO;
    } else {
      let rem = D;
      ps.forEach((p) => {
        const dd = Math.min(p.cap, rem);
        disp[p.id] = dd;
        if (dd > 1e-9) marg = p;
        rem -= dd;
      });
      deficit = rem > 1e-6 ? rem : 0;
      cmo = marg ? Math.max(PISO, (marg as Usina).cost) : PISO;
    }
    const m = marg as Usina | null;
    const termGW = (disp.bio || 0) + (disp.gcc || 0) + (disp.car || 0) + (disp.gcs || 0) + (disp.ole || 0) + (disp.gnl || 0);
    let v: string;
    if (deficit > 0)
      v = '<b>Déficit de ' + g(deficit) + ' GW: a pilha acabou.</b> Toda a oferta despachada — incluindo GNL a R$ ' + fb(byId.gnl.cost, 0) + ' — e ainda falta. No mundo real, este é o território de corte de carga e medidas emergenciais. Repare que chegar aqui exigiu demanda extrema E pilha encurtada.';
    else if (D <= mustCap)
      v = '<b>Sobra renovável: ' + g(cut) + ' GW cortados.</b> A demanda é menor que o bloco must-run — meio-dia de sol e vento fortes. Preço encosta no piso (R$ ' + PISO + ') e o sistema corta geração de custo zero: o curtailment didático. A pergunta de 2026 em diante: quanto disso uma bateria captura?';
    else if (cmo > 900)
      v = '<b>CMO de R$ ' + fb(cmo, 0) + '/MWh: território de crise.</b> Marginal = ' + m!.name + '. É o desenho de 2021 — valor da água nas alturas, GNL spot dentro do despacho, e ' + fb(termGW, 1) + ' GW térmicos rodando. Cada hora assim vira bandeira e encargo três meses depois.';
    else if (cmo > 350)
      v = '<b>Ponta térmica cara na margem: ' + m!.name + ' a R$ ' + fb(cmo, 0) + '/MWh.</b> ' + fb(termGW, 1) + ' GW térmicos despachados. Note o efeito do seletor de gás: a mesma pilha física muda de preço porque a térmica é um conversor de preço de combustível — o sistema importa o humor do mercado global.';
    else
      v = '<b>Margem comportada: ' + (m ? m.name : 'renováveis') + ' define CMO de R$ ' + fb(cmo, 0) + '/MWh.</b> O valor da água (R$ ' + agua + ') está posicionando a hidro na pilha exatamente como a Aula 05 do Módulo 02 descreveu — suba a seca (valor da água) ou o preço do gás e veja a fila se reorganizar.';
    return r({
      valores: { 'i06-cmo': cmo, 'i06-term': termGW },
      textos: {
        'i06-marg': D <= mustCap ? 'Renovável (sobra)' : m ? m.name : '—',
        'i06-cmo': 'R$ ' + fb(cmo, 0) + '/MWh',
        'i06-term': fb(termGW, 1) + ' GW',
      },
      veredito: v,
    });
  },

  'm03-inst-07': (i) => {
    const P = pf(i['i07-mw']) || 0;
    const H = pf(i['i07-h']) || 0;
    const eff = (pf(i['i07-eff']) || 88) / 100;
    const E = P * H;
    const carga = E / eff;
    const perda = carga - E;
    let voc: string;
    if (H < 1) voc = 'Serviços rápidos · regulação';
    else if (H <= 3) voc = 'Ponta · arbitragem curta';
    else voc = 'Rampa do pôr do sol';
    let v: string;
    if (H < 1)
      v = '<b>Tanque curto (' + fb(H, 1) + ' h): potência sem fôlego.</b> ' + fb(P, 0) + ' MW prontos em milissegundos — vocação para frequência e suavização, o serviço que a perda de inércia valorizou. Mas não atravessa a rampa: para o LRCAP, que compra potência sustentada sob comando do ONS, a duração mínima exigida no edital é parte do produto.';
    else if (H <= 3)
      v = '<b>' + fb(H, 1) + ' h na potência máxima: o formato de ponta.</b> Desloca ' + fb(E, 0) + ' MWh/dia da barriga solar para as horas caras, pagando pedágio de ' + fb(perda, 0) + ' MWh em calor (' + fb((1 / eff - 1) * 100, 0) + '% a mais na carga). Bateria não gera — cobra frete temporal.';
    else
      v = '<b>' + fb(H, 1) + ' h de fôlego: perfil de rampa.</b> Carrega ao meio-dia, descarrega das 17h às ' + (17 + Math.round(H)) + 'h — exatamente a janela do INST·05. Desloca ' + fb(E, 0) + ' MWh/dia perdendo ' + fb(perda, 0) + ' no caminho. Acima disso, o deslocamento longo é território da reversível e do reservatório — fusos diferentes de estoque.';
    return r({
      valores: { 'i07-mwh': E, 'i07-desl': E, 'i07-perda': perda },
      textos: { 'i07-mwh': fb(E, 0) + ' MWh', 'i07-desl': fb(E, 0) + ' MWh/dia', 'i07-perda': fb(perda, 0) + ' MWh/dia', 'i07-voc': voc },
      veredito: v,
    });
  },

  'm03-inst-08': (i) => {
    const tech = String(i['i08-pills'] ?? 'solar') in PRESETS ? String(i['i08-pills'] ?? 'solar') : 'solar';
    const p = PRESETS[tech];
    const fc = pf(i['i08-fc']) || p.fc;
    const rr = (pf(i['i08-wacc']) || 10) / 100;
    const crf = (rr * Math.pow(1 + rr, p.n)) / (Math.pow(1 + rr, p.n) - 1);
    const energiaMWh = (8.76 * fc) / 100;
    const lcoeCap = (p.capex * crf) / energiaMWh;
    const lcoeOM = p.om / energiaMWh + p.vr;
    const lcoe = lcoeCap + lcoeOM;
    let v: string;
    if (tech === 'gas') {
      if (fc < 25)
        v = '<b>O limite 2 em carne viva: R$ ' + fb(lcoe, 0) + '/MWh a FC ' + fb(fc, 0) + '%.</b> A mesma usina que custava ~R$ 400 rodando metade do tempo agora parece um desastre — sem mudar um parafuso. O LCOE de térmica flexível é um termômetro do despacho, não do projeto: ela existe para rodar pouco, e o valor dela está exatamente nas horas que a planilha pune.';
      else
        v = '<b>Gás CC a FC ' + fb(fc, 0) + '%: R$ ' + fb(lcoe, 0) + '/MWh — ' + fb(p.vr, 0) + ' dos quais são combustível.</b> Agora arraste o FC para 15% e assista ao LCOE quase dobrar. É a circularidade: o custo unitário do gás depende de quantas horas o resto do sistema o deixa rodar. Comparar este número com o da solar é comparar um seguro com uma commodity.';
    } else if (tech === 'nuclear')
      v = '<b>R$ ' + fb(lcoe, 0) + '/MWh — e ' + fb((lcoeCap / lcoe) * 100, 0) + '% disso é capital.</b> Suba o WACC um ponto e veja dezenas de reais aparecerem do nada: em ativo de CAPEX dominante, juro pesa mais que engenharia. Agora imagine esse CAPEX parado 39 anos compondo — está explicada a tarifa de referência de Angra 3 na casa de R$ 800/MWh, sem falar uma palavra de física nuclear.';
    else if (tech === 'solar' || tech === 'eolica')
      v = '<b>R$ ' + fb(lcoe, 0) + '/MWh: o número que venceu os leilões.</b> Custo quase todo de capital (' + fb((lcoeCap / lcoe) * 100, 0) + '%), combustível zero, FC ditado pelo recurso — não pelo despacho. Mas lembre os limites 1 e 3: este MWh chega no horário que o recurso quiser e captura preço cada vez menor conforme a fonte cresce. Barato não é sinônimo de suficiente.';
    else
      v = '<b>Hidro grande didática: R$ ' + fb(lcoe, 0) + '/MWh em 50 anos de vida.</b> O segredo está no n do CRF — vida longa dilui capital como nenhuma outra fonte. O problema é que este preset é quase teórico: os sítios viáveis com reservatório acabaram (ou custam um licenciamento que nenhum WACC paga). A hidro barata do Brasil já foi construída — por isso ela é legado, não opção de expansão.';
    return r({
      valores: { 'i08-lcoe': lcoe, 'i08-cap': lcoeCap, 'i08-om': lcoeOM },
      textos: {
        'i08-lcoe': 'R$ ' + fb(lcoe, 0) + '/MWh',
        'i08-cap': 'R$ ' + fb(lcoeCap, 0) + ' (' + fb((lcoeCap / lcoe) * 100, 0) + '%)',
        'i08-om': 'R$ ' + fb(lcoeOM, 0) + '/MWh',
        'i08-pre': p.label,
      },
      veredito: v,
    });
  },

  'm03-inst-09': (i) => {
    const active = ORDEM09.filter((k) => String(i[`i09-checks-${k}`] ?? (k === 'hidro' ? 'on' : 'off')) === 'on');
    let minV = 1e9, maxV = 0, minM = 0;
    for (let m = 0; m < 12; m++) {
      let s = 0;
      active.forEach((k) => { s += (PROF[k].w * PROF[k].m[m]) / 100; });
      if (s < minV) { minV = s; minM = m; }
      if (s > maxV) maxV = s;
    }
    const ratio = active.length && maxV > 0 ? (minV / maxV) * 100 : 0;
    let v: string;
    if (!active.length)
      v = '<b>Ligue ao menos uma fonte.</b> Comece pela hidro sozinha — o Brasil dos anos 1990 — e adicione as outras na ordem em que o país as adicionou.';
    else if (ratio < 40)
      v = '<b>Time de um jogador: o mês fraco entrega só ' + fb(ratio, 0) + '% do mês forte.</b> Era a matriz quase-só-hidro: setembro a ' + fb(minV, 0) + ' contra um verão a ' + fb(maxV, 0) + ' — a diferença atravessada com reservatório e reza. Adicione a eólica e veja o vale de ' + MESES[minM] + ' começar a se erguer.';
    else if (ratio < 55)
      v = '<b>O encaixe começou: razão fraco/forte em ' + fb(ratio, 0) + '%.</b> O vento do 2º semestre está preenchendo exatamente os meses em que a ENA some. Falta a peça da seca profunda — ligue a biomassa e repare onde a safra cai no calendário.';
    else
      v = '<b>Portfólio trabalhando: ' + fb(ratio, 0) + '% — o vale de ' + MESES[minM] + ' subiu sem ninguém construir uma usina a mais.</b> Hidro no verão, vento e cana na seca, sol o ano todo: é a complementaridade convertendo perfis em firmeza estatística. O que o gráfico não mostra — e a Aula 05 do Módulo 02 lembrou — é que esse encaixe só existe se houver fio entre as regiões.';
    return r({
      valores: active.length ? { 'i09-ratio': ratio } : {},
      textos: { 'i09-ratio': active.length ? fb(ratio, 0) + ' %' : '—', 'i09-vale': active.length ? MESES[minM] : '—' },
      veredito: v,
    });
  },
};
