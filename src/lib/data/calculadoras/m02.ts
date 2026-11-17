// Calculadoras do M02, porte VERBATIM do <script> da fonte
// (docs/alexandria-v2/extraction/m02/instrumentos.json, `script.codigo_completo`).
// Posse: a sessão de porte do M02. Uma chave aqui SUBSTITUI a de mesmo id em
// INSTRUMENT_CALCULATORS — é assim que o conserto entra sem editar o arquivo grande.
//
// Por que substituir as nove do arquivo grande (Q06, decisão de 15/11/2026: "porte
// verbatim do veredito"): lá o veredito estava abreviado, sem os números que a fonte
// escreve nele ("3,9% de perdas para 1.000 MW em 800 km"), e as saídas de texto
// (camadas do INST·01, usina marginal, vocação, status) não saíam.
//
// O QUE CADA UMA DEVOLVE, além do contrato `ResultadoInstrumento`:
//   · `valores` — os números do cálculo (servem à previsão e à comparação);
//   · `textos`  — cada saída exatamente como a fonte a escreve na tela
//                 ("1.215 A", "56 GW às 12h", "R$ 47,0 mi"), pela mesma `fb()`;
//   · `veredito` — o innerHTML do `.verdict` da fonte, com o <b> e os números;
//   · `vereditoPtBr: true` — o veredito já está em pt-BR e em HTML: não passar
//                 por conversão de ponto decimal.
// `textos` e `vereditoPtBr` são campos a mais, pedidos ao componente compartilhado
// (docs/alexandria-v3/porte/m02.md, "Pedido à coordenação"); enquanto o InstrumentoV3
// não os lê, o resto do contrato segue válido.
//
// Q03: "Summit" (vocabulário interno) sai do veredito do INST·09 — registro em
// docs/alexandria-v3/porte/m02.md. Nenhuma outra mudança de texto ou de conta.
// Os visuais desenhados pelo script (curva do INST·04, pilha do INST·05, SVG do
// INST·07) não são calculadora: ficam registrados como não portados.

import type { CalculateFn, EntradaInstrumento, ResultadoInstrumento } from '../alexandria-instrument-calculators';

/** `parseFloat(x)` do original, sobre a entrada do painel. */
const pf = (v: EntradaInstrumento | undefined): number => parseFloat(String(v ?? ''));
/** `fb()` da fonte (L3112): número com `d` casas, à brasileira. */
const fb = (v: number, d: number) => Number(v).toLocaleString('pt-BR', { minimumFractionDigits: d, maximumFractionDigits: d });
/** `g()` dos INST·05 e INST·09: uma casa, vírgula. */
const g = (x: number) => x.toFixed(1).replace('.', ',');

type Resultado = ResultadoInstrumento & { textos: Record<string, string>; vereditoPtBr: true };
const r = (x: Omit<Resultado, 'vereditoPtBr'>): ResultadoInstrumento => {
  const out: Resultado = { ...x, vereditoPtBr: true };
  return out;
};

// ── INST · 01 · Explorador · Camadas da rede (L3123) ───────────────────────
const CAMADAS: Record<string, { volt: string; dono: string; oper: string; reg: string; rem: string; fat: string; note: string }> = {
  ger: { volt: '13,8 – 18 kV no terminal; elevação na SE da usina', dono: 'Agentes de geração — estatais, privados, autoprodutores', oper: 'O próprio agente, sob comando de despacho do ONS', reg: 'ANEEL (outorga e fiscalização)', rem: 'Venda de energia: contratos ACR/ACL, liquidação na CCEE', fat: 'No preço da energia (TE no cativo; contrato no livre)', note: 'A geração é o elo competitivo da cadeia: o preço se forma em leilão ou negociação — não em tarifa. É o território do Módulo 03 (tecnologias) e do Bloco 5 (mercado livre).' },
  tra: { volt: '230 – 765 kV em AC; ±600 / ±800 kV em DC', dono: 'Transmissoras concessionárias (Eletrobras, ISA, Taesa, State Grid…)', oper: 'ONS — operação centralizada da Rede Básica', reg: 'ANEEL (leilões, RAP, fiscalização)', rem: 'RAP por disponibilidade, definida em leilão de menor receita', fat: 'Dentro do fio: TUST repassada via TUSD (Fio A)', note: 'Monopólio natural com receita por disponibilidade: a linha ganha por existir e estar disponível, não por MWh transportado. Por isso transmissão virou o ativo de infraestrutura mais disputado do setor.' },
  dis: { volt: '69 – 138 kV (AT) · 13,8 – 34,5 kV (MT) · 127 – 440 V (BT)', dono: 'Distribuidoras concessionárias, com área de concessão exclusiva', oper: 'A própria distribuidora, do seu centro de operação', reg: 'ANEEL — REN 1.000/2021, PRODIST', rem: 'TUSD (Fio B + repasses), homologada em revisão tarifária', fat: 'TUSD: demanda (R$/kW) e energia (R$/MWh) no Grupo A', note: 'Monopólio regulado por território: você não escolhe a distribuidora — escolhe, no máximo, quem vende a energia que passa pelo fio dela.' },
  con: { volt: 'Grupo A (2,3 a 230 kV) · Grupo B (baixa tensão)', dono: 'Unidades consumidoras — a fábrica, o comércio, a casa', oper: 'O consumidor, da fronteira para dentro', reg: 'ANEEL (direitos e deveres — REN 1.000/2021)', rem: '—', fat: 'É quem paga a soma: energia + fio + encargos + tributos', note: 'Do ponto de conexão para dentro, ativos, perdas e riscos são do consumidor — por isso a subestação particular é item de auditoria do PQA.' },
};

// ── INST · 03 · Cadeia de transformação por perfil (L3195) ─────────────────
const BASE_CADEIA = [
  { v: '13,8 → 500 kV', n: 'SE elevadora da usina', l: 0.5 },
  { v: '500 kV', n: 'Tronco de transmissão · Rede Básica', l: 1.8 },
  { v: '500 → 138 kV', n: 'SE abaixadora regional', l: 0.4 },
];
const PERFIS: Record<string, { v: string; n: string; l: number }[]> = {
  a2: BASE_CADEIA.concat([{ v: '138 kV', n: 'Linha dedicada até a planta', l: 0.4 }]),
  a4: BASE_CADEIA.concat([
    { v: '138 kV', n: 'Rede de subtransmissão', l: 0.8 },
    { v: '138 → 13,8 kV', n: 'SE da distribuidora', l: 0.5 },
    { v: '13,8 kV', n: 'Rede de média tensão até a planta', l: 1.6 },
  ]),
  bt: BASE_CADEIA.concat([
    { v: '138 kV', n: 'Rede de subtransmissão', l: 0.8 },
    { v: '138 → 13,8 kV', n: 'SE da distribuidora', l: 0.5 },
    { v: '13,8 kV', n: 'Rede de média tensão', l: 1.6 },
    { v: '13,8 kV → 220 V', n: 'Transformador de poste', l: 1.5 },
    { v: '220 V', n: 'Rede de baixa tensão até o medidor', l: 2.9 },
  ]),
};

// ── INST · 04 · Curva líquida (ids i08-*) ──────────────────────────────────
export const PERFIL_CARGA = [0.72, 0.70, 0.68, 0.67, 0.67, 0.68, 0.72, 0.78, 0.84, 0.88, 0.90, 0.91, 0.90, 0.89, 0.88, 0.88, 0.90, 0.95, 1.00, 0.99, 0.95, 0.90, 0.83, 0.77, 0.72];

// ── INST · 05 · Ordem de mérito (ids i04-*) ────────────────────────────────
const PISO = 61;
interface Usina { id: string; name: string; cap: number; cost: number; must: boolean }
function plantList(v: number, s: number, rr: number): Usina[] {
  const va = Math.max(PISO, Math.min(650, Math.round(650 - 6.2 * rr)));
  return [
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
  ];
}

// ── INST · 09 · Dois submercados (ids i07-*) ───────────────────────────────
function dispatchIsland(stack: { cap: number; cost: number }[], dem: number) {
  let rem = dem;
  let marg: { cap: number; cost: number } | null = null;
  const disp: number[] = [];
  for (let i = 0; i < stack.length; i++) {
    const d = Math.min(stack[i].cap, Math.max(0, rem));
    disp.push(d);
    if (d > 1e-9) marg = stack[i];
    rem -= d;
  }
  return { disp, marg, rem };
}

export const CALCULADORAS: Record<string, CalculateFn> = {
  'm02-inst-01': (i) => {
    const d = CAMADAS[String(i['i01-pills'] ?? 'ger')] ?? CAMADAS.ger;
    return r({
      valores: {},
      textos: { 'i01-volt': d.volt, 'i01-dono': d.dono, 'i01-oper': d.oper, 'i01-reg': d.reg, 'i01-rem': d.rem, 'i01-fat': d.fat },
      // `#i01-note` é reescrita pelo script a cada camada: é a leitura da camada.
      veredito: d.note,
    });
  },

  'm02-inst-02': (i) => {
    const rk: Record<number, number> = { 138: 0.16, 230: 0.09, 345: 0.045, 500: 0.022, 765: 0.011 };
    const P = pf(i['i02-p']) || 0;
    const D = pf(i['i02-d']) || 0;
    const V = pf(i['i02-v']);
    const N = parseInt(String(i['i02-n'] ?? ''), 10);
    const I = (P * 1e6) / (Math.sqrt(3) * V * 1000 * 0.95);
    const R = rk[V] * D;
    const loss = (3 * R * I * I) / N / 1e6;
    const pct = P > 0 ? (loss / P) * 100 : 0;
    const lossShown = Math.min(loss, P);
    const yr = lossShown * 8760 * 0.55 * 250;
    let veredito: string;
    if (pct > 30)
      veredito = '<b>Inviável.</b> Nessa configuração as perdas consomem ' + (pct > 100 ? 'mais de 100' : fb(pct, 0)) + '% do bloco — é por isso que essa linha não existe no mundo real. Suba o nível de tensão ou adicione circuitos e veja o quadrado da corrente trabalhar a seu favor.';
    else if (pct > 8)
      veredito = '<b>Caro.</b> Perdas de ' + fb(pct, 1) + '% estão acima do razoável para um tronco. Em projeto real, subir a tensão ou adicionar um circuito tende a se pagar só com a energia que deixa de virar calor.';
    else
      veredito = '<b>Dentro da faixa de engenharia.</b> ' + fb(pct, 1) + '% de perdas para ' + fb(P, 0) + ' MW em ' + fb(D, 0) + ' km — este é o tipo de compromisso capital × perdas que desenhou os troncos reais do SIN.';
    return r({
      valores: { 'i02-i': I, 'i02-loss': lossShown, 'i02-pct': pct, 'i02-yr': yr / 1e6 },
      textos: {
        'i02-i': fb(I, 0) + ' A',
        'i02-loss': fb(lossShown, 1) + ' MW',
        'i02-pct': (pct > 100 ? '> 100' : fb(pct, 1)) + ' %',
        'i02-yr': 'R$ ' + fb(yr / 1e6, 1) + ' mi',
      },
      veredito,
    });
  },

  'm02-inst-03': (i) => {
    const steps = PERFIS[String(i['i03-pills'] ?? 'a2')] ?? PERFIS.a2;
    let total = 0;
    const linhas: string[] = [];
    steps.forEach((s) => {
      total += s.l;
      linhas.push('<b>' + s.v + '</b> · ' + s.n + ' · ~' + String(s.l).replace('.', ',') + '% típ.');
    });
    return r({
      valores: { 'i03-total': Number(total.toFixed(1)) },
      textos: { 'i03-total': '~' + total.toFixed(1).replace('.', ',') + '%' },
      // A cadeia que o script desenha em `#i03-chain`: um trecho por linha.
      veredito: linhas.join('<br>'),
    });
  },

  'm02-inst-04': (i) => {
    const pico = pf(i['i08-pico']) || 95;
    const S = pf(i['i08-solar']) || 0;
    const cond = pf(i['i08-ceu']);
    const net: number[] = [];
    for (let h = 0; h <= 24; h++) {
      const L = pico * PERFIL_CARGA[h];
      const s = h >= 6 && h <= 18 ? S * cond * Math.pow(Math.max(0, Math.sin((Math.PI * (h - 6)) / 12)), 1.5) : 0;
      net.push(L - s);
    }
    let minNet = Infinity, minH = 0, rampa = -Infinity, rH = 0;
    for (let h = 0; h <= 24; h++) if (net[h] < minNet) { minNet = net[h]; minH = h; }
    for (let h = 0; h < 24; h++) { const d = net[h + 1] - net[h]; if (d > rampa) { rampa = d; rH = h; } }
    const solPico = S * cond;
    let msg: string;
    if (rampa > 10)
      msg = '<b>Rampa crítica: +' + fb(rampa, 1) + ' GW em uma hora.</b> É substituir uma Itaipu de geração em sessenta minutos — hidro flexível, térmicas, baterias e intercâmbios subindo juntos, com o operador contando reserva. A hora mais tensa do dia, todos os dias.';
    else if (minNet < 35)
      msg = '<b>Carga líquida mínima muito baixa (' + fb(minNet, 0) + ' GW às ' + minH + 'h).</b> Com inflexibilidades e renovável compulsória, sobra geração no meio do dia: CMO no piso, risco de excesso e de corte de renovável — a barriga solar que antecipa a discussão de curtailment da Aula 10.';
    else if (rampa > 6)
      msg = '<b>Rampa exigente: +' + fb(rampa, 1) + ' GW/h no pôr do sol.</b> Dentro da capacidade do parque flexível, mas é exatamente esta janela que valoriza bateria, resposta da demanda e a hidro com reservatório — os recursos da Aula 07.';
    else
      msg = '<b>Dia tranquilo: rampa máxima de +' + fb(rampa, 1) + ' GW/h.</b> Com pouca solar, a curva líquida quase coincide com a total e a transição do fim da tarde é suave. Suba a solar instalada e veja a barriga do meio-dia se formar — e a rampa ficar íngreme.';
    return r({
      valores: { 'i08-min': minNet, 'i08-rampa': rampa, 'i08-solpico': solPico },
      textos: {
        'i08-min': fb(minNet, 0) + ' GW às ' + minH + 'h',
        'i08-rampa': '+' + fb(rampa, 1) + ' GW/h (' + rH + '→' + (rH + 1) + 'h)',
        'i08-solpico': fb(solPico, 0) + ' GW',
      },
      veredito: msg,
    });
  },

  'm02-inst-05': (i) => {
    const D = pf(i['i04-dem']) || 0;
    const v = pf(i['i04-vento']) || 0;
    const s = pf(i['i04-sol']) || 0;
    const rr = pf(i['i04-res']) || 0;
    const ps = plantList(v, s, rr).sort((a, b) => a.cost - b.cost);
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
      const ch = Math.min(excess, byId.hfio.cap); disp.hfio -= ch; excess -= ch;
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
    const term = (disp.gn1 || 0) + (disp.car || 0) + (disp.gn2 || 0) + (disp.ole || 0) + (disp.gnl || 0);
    let veredito: string;
    if (deficit > 0)
      veredito = '<b>Déficit de ' + g(deficit) + ' GW — a pilha esgotou.</b> No mundo real isso é corte de carga: ERAC, racionamento, manchete. Note o caminho até aqui: cada GW extra de demanda subiu degraus cada vez mais caros antes de faltar.';
    else if (cut > 0)
      veredito = '<b>Excedente renovável: ' + g(cut) + ' GW cortados.</b> Geração compulsória maior que a demanda — CMO no piso e curtailment. É a fotografia do Nordeste em madrugada ventosa de baixa carga, e a ponte direta para a Aula 09.';
    else if (m && m.id === 'hres')
      veredito = '<b>Hidro na margem — CMO = valor da água (R$ ' + m.cost + ').</b> O estado normal do Brasil: o preço não é o custo de queimar combustível hoje, é o custo de não ter água amanhã. Mexa nos reservatórios e veja o preço inteiro se deslocar.';
    else if (m && (m.id === 'gn1' || m.id === 'car' || m.id === 'gn2'))
      veredito = '<b>Térmica na margem (R$ ' + m.cost + ').</b> Estiagem e/ou noite sem vento e sol: cada GW adicional sobe um degrau da pilha. É o regime em que bandeira tarifária e PLD sobem juntos.';
    else if (m && (m.id === 'ole' || m.id === 'gnl'))
      veredito = '<b>Topo da pilha (R$ ' + m.cost + ').</b> Óleo e GNL na margem — padrão de crise hídrica, como 2021. O sistema atende, mas a que preço: é aqui que teto de PLD e encargos viram assunto de jornal.';
    else
      veredito = '<b>Renovável e nuclear cobrem a carga.</b> CMO no piso — condição de demanda muito baixa com oferta compulsória abundante.';
    return r({
      valores: { 'i04-cmo': cmo, 'i04-term': term, 'i04-cut': cut },
      textos: {
        'i04-cmo': 'R$ ' + cmo,
        'i04-marg': deficit > 0 ? 'Pilha esgotada' : m ? m.name : '— · piso (excedente renovável)',
        'i04-term': g(term) + ' GW',
        'i04-cut': g(cut) + ' GW',
      },
      veredito,
    });
  },

  'm02-inst-06': (i) => {
    const P = pf(i['i09-mw']) || 1;
    const E = pf(i['i09-mwh']) || 0;
    const h = E / P;
    let voc: string;
    if (h < 1) voc = 'Regulação rápida · serviços ancilares';
    else if (h <= 3) voc = 'Corte de pico · arbitragem curta';
    else voc = 'Rampa do fim da tarde · deslocamento de energia';
    let veredito: string;
    if (h < 1)
      veredito = '<b>Tanque curto (' + fb(h, 1) + ' h): potência sem fôlego.</b> Vocação para resposta rápida — frequência, suavização — não para atravessar o pico. E o princípio de sempre: <b>bateria não gera, desloca</b> — ela só vale o spread entre a energia que a carrega e a que ela substitui.';
    else if (h <= 3)
      veredito = '<b>' + fb(h, 1) + ' horas na potência máxima.</b> O formato clássico para cortar pico de demanda e arbitrar as horas caras. Lembre: bateria não gera — desloca energia do horário em que sobra para o horário em que falta.';
    else
      veredito = '<b>' + fb(h, 1) + ' horas de fôlego: perfil de rampa.</b> Carrega na barriga solar do meio-dia e descarrega das 17h às 21h — exatamente a janela do INST·04. É a logística temporal que a curva líquida pede; geração, que é bom, continua vindo de quem converte fonte primária.';
    return r({ valores: { 'i09-h': h }, textos: { 'i09-h': fb(h, 1) + ' h', 'i09-voc': voc }, veredito });
  },

  'm02-inst-07': (i) => {
    const DP = pf(i['i05-dp']) || 0;
    const P = pf(i['i05-carga']) || 1;
    const H = pf(i['i05-h']);
    const rocof = ((DP / P) * 60) / (2 * H);
    const dfn = ((DP / P) * 60 * 1.8) / (2 * H);
    const nadir = 60 - dfn;
    let st: string, veredito: string;
    if (nadir < 57.5) {
      st = 'Colapso parcial';
      veredito = '<b>Nadir abaixo de 57,5 Hz.</b> Múltiplos estágios de ERAC e risco de colapso parcial — milhões de consumidores desligados automaticamente para salvar o restante. Compare com a noite de Itaipu, 2009.';
    } else if (nadir < 58.5) {
      st = 'ERAC dispara';
      veredito = '<b>ERAC dispara.</b> O afundamento cruza o primeiro estágio (~58,5 Hz): blocos de carga são cortados sem nenhum humano no circuito. O sistema sobrevive sacrificando consumo — é o desenho funcionando, não falhando.';
    } else if (nadir < 59.5) {
      st = 'Severo, contido';
      veredito = '<b>Afundamento severo, contido.</b> Inércia + regulação primária seguram o nadir acima do ERAC; a reserva foi consumida e o CAG recompõe nos minutos seguintes. Margem curta: o mesmo evento com menos inércia cruzaria a linha — troque o mix e confira.';
    } else {
      st = 'Estabilizado';
      veredito = '<b>Excursão absorvida.</b> A inércia limita o RoCoF, a regulação primária estanca a queda e o CAG devolve o sistema a 60,00 Hz. Rotina de operador — invisível para o consumidor.';
    }
    return r({
      valores: { 'i05-rocof': rocof, 'i05-nadir': nadir },
      textos: { 'i05-rocof': '−' + fb(rocof, 2) + ' Hz/s', 'i05-nadir': fb(nadir, 2) + ' Hz', 'i05-status': st },
      veredito,
    });
  },

  'm02-inst-08': (i) => {
    const C = pf(i['i06-c']) || 0;
    const P = (pf(i['i06-p']) || 0) / 100;
    const T = pf(i['i06-t']) || 0;
    const inj = P < 1 ? C / (1 - P) : C;
    const perd = inj - C;
    const custo = perd * T;
    return r({
      valores: { 'i06-inj': inj, 'i06-perd': perd, 'i06-rs': custo },
      textos: {
        'i06-inj': fb(inj, 0) + ' MWh',
        'i06-perd': fb(perd, 1) + ' MWh',
        'i06-rs': custo >= 1e6 ? 'R$ ' + fb(custo / 1e6, 2) + ' mi' : 'R$ ' + fb(custo / 1000, 1) + ' mil',
      },
    });
  },

  'm02-inst-09': (i) => {
    const DNE = 12;
    const W = pf(i['i07-vento']) || 0;
    const DSE = pf(i['i07-dse']) || 0;
    const L = pf(i['i07-lim']) || 0;
    const joint = [{ cap: W, cost: 0 }, { cap: 38, cost: 160 }, { cap: 14, cost: 360 }, { cap: 8, cost: 480 }, { cap: 99, cost: 980 }];
    const rj = dispatchIsland(joint, DNE + DSE);
    const genNE = rj.disp[0] + rj.disp[3];
    const flow = genNE - DNE;
    let pne: number, pse: number, cut: number, sat: boolean, f: number;
    if (Math.abs(flow) <= L + 1e-9) {
      f = flow; sat = false;
      pne = pse = Math.max(PISO, rj.marg!.cost);
      cut = W - rj.disp[0];
    } else {
      sat = true;
      f = flow > 0 ? L : -L;
      const demNE = Math.max(0, DNE + f);
      if (demNE <= W + 1e-9) { cut = W - demNE; pne = PISO; }
      else { cut = 0; const tneed = demNE - W; pne = tneed <= 8 + 1e-9 ? 480 : 980; }
      const rse = dispatchIsland([{ cap: 38, cost: 160 }, { cap: 14, cost: 360 }, { cap: 99, cost: 980 }], DSE - f);
      pse = Math.max(PISO, rse.marg!.cost);
    }
    let veredito: string;
    if (!sat)
      veredito = '<b>Intercâmbio com folga: preço único.</b> A usina marginal de um lado precifica os dois — os submercados se comportam como um sistema só. É o regime em que o spread NE–SE do Brazil Pulse marca zero.';
    else if (cut > 1e-9)
      // Q03: a fonte termina com "…qualquer conversa de Summit." — sai a referência ao evento interno.
      veredito = '<b>Fio cheio + vento sobrando: ' + g(cut) + ' GW cortados no NE</b> enquanto o SE despacha térmica a R$ ' + pse + '. Os preços se separam (spread de R$ ' + (pse - pne) + '), o gerador eólico perde receita e a disputa do constrained-off entra em cena. Este é o paradoxo que abre qualquer conversa.';
    else if (f > 0)
      veredito = '<b>Intercâmbio saturado: submercados separados.</b> O NE exporta no limite físico; o SE completa com geração própria mais cara. O spread de PLD (R$ ' + (pse - pne) + ') é o preço visível do congestionamento — a restrição física virando número que qualquer agente enxerga na tela.';
    else
      veredito = '<b>Vento fraco: o NE importa até o limite.</b> Com o fio saturado no sentido contrário, é o NE que fica caro (térmica local a R$ ' + pne + ') enquanto o SE segue mais barato. Congestionamento não tem lado fixo — tem a direção do dia.';
    return r({
      valores: { 'i07-ne': pne, 'i07-se': pse, 'i07-flow': f, 'i07-cut': cut },
      textos: {
        'i07-ne': 'R$ ' + pne,
        'i07-se': 'R$ ' + pse,
        'i07-flow': g(f) + ' / ' + g(L) + ' GW · ' + (sat ? 'SATURADO' : 'com folga'),
        'i07-cut': g(cut) + ' GW',
      },
      veredito,
    });
  },
};
