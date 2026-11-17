// Calculadoras do M05 no modelo v3 — porte VERBATIM do <script> de
// `Alexandria modulos/alexandria_modulo05.html` (L1381 em diante). Posse: a sessão de
// porte do M05. Uma chave aqui SUBSTITUI a de mesmo id em INSTRUMENT_CALCULATORS.
//
// Por que um porte novo, e não um conserto pontual: a extração mediu os seis portados
// do arquivo grande como divergentes (docs/alexandria-v2/extraction/m05/README.md):
//   · D03 / inst-01: o campo "Operadores concorrentes" tinha id `i1` e a calculadora lia
//     `i['i1-n']` — N valia 0 em todos os casos. Aqui os campos usam os ids da fonte
//     (`i1-q`, `i1-f`, `i1-c`, `i1-n`, os mesmos que o script lê).
//   · inst-02: os seis vereditos eram paráfrases sem os números. Q06: verbatim.
//   · inst-03: o INST·05 devolvia um texto único que a fonte não tem; a fonte tem 4 ramos.
//   · inst-06: o INST·04 usava select "Presente/Ausente" com o peso no rótulo; a fonte
//     tem 8 caixas de marcar (aqui: campos de escolha `i4-s0`…`i4-s7`, ver o arquivo de conteúdo).
//
// Cada função abaixo repete a função `run()` do instrumento na fonte, linha por linha,
// com os mesmos formatadores (`num`, `brl`, `brl2`, `mi`, `mmi`). O que muda é só o
// destino: em vez de escrever no DOM, devolve `valores` (números, na unidade que o campo
// `unit` do instrumento declara) e `veredito` (o texto do `vd()` da fonte).
// Conferido contra o script executado: tools/alexandria-dados/porte/verificar-instrumentos-m05.mjs.
import type { CalculateFn, EntradaInstrumento } from '../alexandria-instrument-calculators';

const v = (x: EntradaInstrumento | undefined): number => {
  const n = typeof x === 'string' ? Number(x) : x;
  return Number.isFinite(n) ? (n as number) : 0;
};

// Formatadores da fonte (L1384–1397).
const num = (x: number, d?: number) => x.toLocaleString('pt-BR', { minimumFractionDigits: d || 0, maximumFractionDigits: d || 0 });
const brl = (x: number) => 'R$ ' + Math.round(x).toLocaleString('pt-BR');
const brl2 = (x: number) => 'R$ ' + x.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const mi = (x: number) => {
  const a = Math.abs(x);
  if (a >= 1e9) return 'R$ ' + (x / 1e9).toLocaleString('pt-BR', { maximumFractionDigits: 2 }) + ' bi';
  if (a >= 1e6) return 'R$ ' + (x / 1e6).toLocaleString('pt-BR', { maximumFractionDigits: 2 }) + ' mi';
  if (a >= 1e3) return 'R$ ' + (x / 1e3).toLocaleString('pt-BR', { maximumFractionDigits: 0 }) + ' mil';
  return 'R$ ' + Math.round(x).toLocaleString('pt-BR');
};
/** v já em R$ milhões (L1393). */
const mmi = (x: number) => {
  if (Math.abs(x) >= 1000) return 'R$ ' + (x / 1000).toLocaleString('pt-BR', { maximumFractionDigits: 2 }) + ' bi';
  return 'R$ ' + x.toLocaleString('pt-BR', { maximumFractionDigits: 0 }) + ' mi';
};
const clamp = (x: number, a: number, b: number) => (x < a ? a : x > b ? b : x);

// ── INST 01 — custo médio × número de redes ─────────────────────────────
const inst01: CalculateFn = (i) => {
  const CRF = 0.1;
  const cm = (n: number, q: number, f: number, c: number) => (n * f * CRF + c * q) / q;
  const Q = v(i['i1-q']), F = v(i['i1-f']), C = v(i['i1-c']), N = v(i['i1-n']);
  const q = Q * 1000, f = F * 1e6;
  const cur = cm(N, q, f, C), one = cm(1, q, f, C), waste = cur - one;
  const pct = one > 0 ? (waste / one) * 100 : 0;
  let veredito: string;
  if (N === 1) veredito = 'Rede única. O custo fixo de ' + mi(f) + ' é diluído entre ' + num(q) + ' consumidores, o que dá ' + brl((f * CRF) / q) + ' por consumidor por ano só de infraestrutura. Repare quanto disso é custo de existir a rede, e não custo de entregar energia: é essa proporção que define quão forte é o monopólio natural aqui.';
  else if (pct <= 10) veredito = 'Duplicar custa apenas ' + pct.toFixed(1) + '% a mais por consumidor. Numa configuração assim — mercado grande e custo fixo relativamente baixo — o argumento de monopólio natural é fraco, e vale perguntar se a atividade não comportaria competição de fato. Nem toda infraestrutura de rede é monopólio natural na mesma intensidade.';
  else if (pct <= 50) veredito = 'Sobrecusto de ' + pct.toFixed(1) + '% por consumidor, ou ' + brl(waste) + ' por ano cada. A duplicação já é claramente ineficiente, e nenhuma competição entre as ' + N + ' redes recupera isso: a concorrência aqui aumenta o custo do sistema em vez de reduzi-lo. É o território clássico de competição pelo mercado, não no mercado.';
  else veredito = 'Sobrecusto de ' + pct.toFixed(1) + '% por consumidor. Monopólio natural forte: o custo fixo domina completamente a estrutura, e replicar a rede desperdiça ' + mi(waste * q) + ' por ano no agregado — além de espaço público, servidão e licença ambiental, que nenhuma das ' + N + ' redes conseguiria replicar mesmo querendo pagar.';
  // 'i1-w': a fonte escreve "zero" quando waste<=0,001; 0 é o mesmo número.
  return {
    valores: { 'i1-cm': cur, 'i1-c1': one, 'i1-w': waste <= 0.001 ? 0 : waste, 'i1-tf': (N * f) / 1e6 },
    textos: { 'i1-cm': brl(cur) + '/ano', 'i1-c1': brl(one) + '/ano', 'i1-w': waste <= 0.001 ? 'zero' : brl(waste) + '/ano', 'i1-tf': mi(N * f) },
    veredito,
  };
};

// ── INST 02 — grau de separação ──────────────────────────────────────────
const inst02: CalculateFn = (i) => {
  const BC = [100, 68, 40, 12];
  const BK = [6, 22, 45, 85];
  const NOME = ['Contábil', 'Funcional', 'Jurídica', 'Societária'];
  const calc = (g: number, c: number, f: number) => {
    const conf = BC[g - 1] * (1 - (0.35 * f) / 100);
    const coor = BK[g - 1] * (0.35 + (0.65 * c) / 100);
    return { c: conf, k: coor, t: conf + coor };
  };
  const G = v(i['i2-g']), C = v(i['i2-c']), F = v(i['i2-f']);
  const all: { c: number; k: number; t: number }[] = [];
  let best = 1, bt = 1e9;
  for (let k = 1; k <= 4; k++) { const r = calc(k, C, F); all.push(r); if (r.t < bt) { bt = r.t; best = k; } }
  const cur = all[G - 1] ?? { c: NaN, k: NaN, t: NaN };
  let veredito: string;
  if (G === best) veredito = 'Separação ' + NOME[G - 1].toLowerCase() + ' é o ponto de menor atrito para esta combinação. Conflito residual em ' + cur.c.toFixed(0) + ' e custo de coordenação em ' + cur.k.toFixed(0) + ': nenhum dos dois domina. Note que o ótimo se desloca com a fiscalização — melhorar a fiscalização de acesso é frequentemente mais barato que aprofundar a separação.';
  else if (Math.abs(G - best) === 1) veredito = 'Atrito total de ' + cur.t.toFixed(0) + ', contra ' + bt.toFixed(0) + ' na separação ' + NOME[best - 1].toLowerCase() + '. A diferença é pequena — dentro da margem em que outros fatores decidem. Mas repare na direção: ' + (G > best ? 'você está pagando coordenação a mais para comprar uma redução de conflito que a fiscalização já estava entregando.' : 'você está aceitando conflito residual a mais do que precisaria, apostando numa fiscalização que pode não se sustentar.');
  else veredito = (G > best ? 'Separação profunda demais para este contexto: ' : 'Separação rasa demais para este contexto: ') + 'atrito total de ' + cur.t.toFixed(0) + ' contra ' + bt.toFixed(0) + ' no grau ' + NOME[best - 1].toLowerCase() + '. ' + (G > best ? 'Com dependência de coordenação alta, cortar fundo destrói coordenação sem comprar redução proporcional de conflito.' : 'Com fiscalização fraca e conflito residual em ' + cur.c.toFixed(0) + ', a regra de acesso existe no papel e não é verificável na prática.');
  // A fonte escreve as três com toFixed(0): o número exibido é o arredondado.
  return {
    valores: { 'i2-r': Math.round(cur.c), 'i2-k': Math.round(cur.k), 'i2-t': Math.round(cur.t) },
    textos: { 'i2-r': cur.c.toFixed(0), 'i2-k': cur.k.toFixed(0), 'i2-t': cur.t.toFixed(0), 'i2-b': NOME[best - 1] },
    veredito,
  };
};

// ── INST 03 — composição de contratação ──────────────────────────────────
const inst03: CalculateFn = (i) => {
  const SP = 200;
  const L = v(i['i3-l']), C = v(i['i3-c']), P = v(i['i3-p']), V = v(i['i3-v']);
  const soma = L + C, over = Math.max(0, soma - 100), D = Math.max(0, 100 - soma);
  let custo: number;
  if (over > 0) custo = (L * (SP + P) + C * (SP + P * 0.35) - over * SP * 0.9) / 100;
  else custo = (L * (SP + P) + C * (SP + P * 0.35) + D * SP) / 100;
  const sig = SP * (V / 100) * ((D + 0.45 * C) / 100) * 1.6;
  const ruim = custo + 2 * sig, amp = 4 * sig;
  let veredito: string;
  if (over > 0) veredito = 'As camadas somam ' + num(soma) + '%: há ' + num(over) + '% de sobrecontratação. A sobra é revendida ao curto prazo em condição que o comprador não escolhe, e o custo efetivo fica em ' + brl2(custo) + '/MWh mesmo com preço travado. Sobrecontratar não é prudência — é comprar caro para revender barato, por contrato, todo mês.';
  else if (D === 0) veredito = 'Cem por cento contratado. Custo perfeitamente previsível em ' + brl2(custo) + '/MWh e perfeitamente rígido: amplitude zero. Qualquer queda de produção vira sobrecontratação no mês seguinte. Previsibilidade total é uma escolha de política de risco, não um ótimo automático.';
  else if (D <= 15) veredito = 'Exposição residual de ' + num(D) + '%, custo esperado de ' + brl2(custo) + '/MWh e amplitude de ' + brl2(amp) + '/MWh. É a faixa em que a folga absorve variação operacional sem transformar o orçamento numa aposta direcional. Repare que o prêmio pago no contrato longo comprou redução de dispersão, não redução de custo.';
  else if (D <= 35) veredito = 'Exposição de ' + num(D) + '%, com cenário ruim em ' + brl2(ruim) + '/MWh contra ' + brl2(custo) + '/MWh esperado. Ainda gerenciável, mas verifique se o cenário ruim cabe no limite financeiro da política de risco — e não apenas no limite percentual de exposição. São critérios diferentes, e atender um não garante o outro.';
  else veredito = 'Exposição de ' + num(D) + '%: a maior parte do custo de energia desta empresa é decidida pelo mercado de curto prazo, não por ela. Amplitude de ' + brl2(amp) + '/MWh e cenário ruim em ' + brl2(ruim) + '/MWh. Isso é uma posição direcional em preço de energia, assumida por quem não vive de negociar energia.';
  // 'i3-d': a fonte escreve "−over" com sobrecontratação e "D" sem ela.
  return {
    valores: { 'i3-e': custo, 'i3-w': ruim, 'i3-a': amp, 'i3-d': over > 0 ? -over : D },
    textos: { 'i3-e': brl2(custo) + '/MWh', 'i3-w': brl2(ruim) + '/MWh', 'i3-a': brl2(amp) + '/MWh', 'i3-d': (over > 0 ? '−' + num(over) : num(D)) + '%' },
    veredito,
  };
};

// ── INST 04 — termômetro de risco de captura ─────────────────────────────
// Os 8 sinais são caixas de marcar na fonte; aqui, campos de escolha `i4-s0`…`i4-s7`
// ("marcado" = '1', "não marcado" = '0').
export const SINAIS_M05_INST04 = [
  { p: 22, t: 'Resultado não reproduzível por terceiro', d: 'Um analista competente, com a metodologia e os dados publicados, não chega ao mesmo número.' },
  { p: 20, t: 'Metodologia divulgada depois da decisão', d: 'O critério apareceu junto com o resultado, ou foi ajustado durante o processo sem justificativa.' },
  { p: 20, t: 'Dados de entrada não disponíveis', d: 'A memória de cálculo não é pública, ou está em formato que impede reprocessamento.' },
  { p: 12, t: 'Contribuições sem resposta motivada', d: 'As manifestações contrárias foram registradas, mas não respondidas com argumento técnico.' },
  { p: 12, t: 'Tratamento assimétrico entre pares', d: 'Concessionárias comparáveis receberam critérios diferentes no mesmo ciclo, sem razão declarada.' },
  { p: 6, t: 'Decisão contraria metodologia publicada', d: 'O ato se afasta do critério vigente sem justificativa técnica explícita no processo.' },
  { p: 5, t: 'Trânsito de quadros sem quarentena efetiva', d: 'Circulação recente entre a empresa afetada e a instância decisória, sem impedimento observado.' },
  { p: 3, t: 'Participação concentrada no próprio setor', d: 'A quase totalidade das contribuições veio de agentes economicamente interessados no resultado.' },
];
const inst04: CalculateFn = (i) => {
  const SIG = SINAIS_M05_INST04;
  const M = v(i['i4-m']);
  let op = 0, n = 0;
  const marked: number[] = [];
  for (let k = 0; k < SIG.length; k++) {
    if (v(i[`i4-s${k}`]) >= 1) { op += SIG[k].p; n++; marked.push(k); }
  }
  const expo = (M * op) / 100;
  const repro = marked.indexOf(0) >= 0 ? 'não' : marked.indexOf(1) >= 0 || marked.indexOf(2) >= 0 ? 'parcial' : 'sim';
  let veredito: string;
  if (op === 0) veredito = 'Nenhum sinal marcado. O processo é verificável: metodologia anterior, dados disponíveis, contribuições respondidas e resultado reproduzível. Isso não significa que o resultado agrade — significa que ele pode ser contestado no mérito técnico, que é a única forma produtiva de contestar.';
  else if (op <= 25) veredito = 'Opacidade de ' + op + '/100 e ' + mmi(expo) + ' por ano de decisão não plenamente verificável. Os sinais presentes dificultam a verificação sem impedi-la. Encaminhamento adequado: pedido formal dos itens faltantes e registro público do pedido — não conclusão.';
  else if (op <= 55) veredito = 'Opacidade de ' + op + '/100 sobre uma decisão de ' + mmi(M) + ' por ano, o que deixa ' + mmi(expo) + ' anuais fora de verificação independente. Reprodutibilidade: ' + repro + '. O que se pode afirmar publicamente é exatamente isso — a lacuna e a materialidade. Captura é padrão institucional inferido ao longo do tempo, e não diagnóstico de um ato isolado.';
  else veredito = 'Opacidade de ' + op + '/100 com reprodutibilidade "' + repro + '". Nesta faixa, um terceiro competente não consegue refazer a conta, e a decisão só pode ser aceita por confiança — que é precisamente o que a transparência regulatória existe para tornar desnecessária. Ainda assim, a afirmação publicável continua sendo a lacuna verificada e a materialidade, nunca a imputação a instituição ou pessoa.';
  return {
    valores: { 'i4-n': n, 'i4-o': op, 'i4-e': expo },
    textos: { 'i4-n': n + '/8', 'i4-o': op + '/100', 'i4-e': mmi(expo) + '/ano', 'i4-r': repro },
    veredito,
  };
};

// ── INST 05 — ciclo de revisão tarifária ─────────────────────────────────
const inst05: CalculateFn = (i) => {
  const B = v(i['i5-b']), Wc = v(i['i5-w']), O = v(i['i5-o']), Dp = v(i['i5-d']), E = v(i['i5-e']), X = v(i['i5-x']);
  const rem = (B * Wc) / 100;
  const pb0 = O + rem + Dp;
  const comp = (pb0 / E) * 1000;
  const sens = B * 0.01;
  const g = 1 + X / 100;
  const anos: { t: number }[] = [];
  for (let k = 0; k < 5; k++) anos.push({ t: pb0 * Math.pow(g, k) });
  const share = (rem / pb0) * 100;
  const shs = share >= 10 ? share.toFixed(0) : share.toFixed(1).replace('.', ',');
  let veredito: string;
  if (X < 0) veredito = 'Parcela B comprimida em termos reais ao longo do ciclo: de ' + mmi(pb0) + ' para ' + mmi(anos[4].t) + '. Um índice líquido negativo significa Fator X acima da inflação — a empresa precisa entregar ganho de produtividade real só para manter a receita. Se o ganho não vier, o ajuste sai da qualidade ou do investimento, e a conta aparece na revisão seguinte.';
  else if (share >= 48) veredito = 'Remuneração do capital responde por ' + shs + '% da Parcela B — concessão intensiva em capital. Nessa configuração, o custo de capital regulatório é o parâmetro dominante: cada ponto percentual vale ' + mmi(sens) + ' por ano, ou ' + brl2((sens / E) * 1000) + '/MWh sobre o mercado faturado. É aqui que se concentra a disputa técnica da revisão, e é aqui que a análise independente tem mais a acrescentar.';
  else if (share >= 25) veredito = 'Composição equilibrada: ' + shs + '% de remuneração de capital, o restante em operação e reintegração. O componente médio de ' + brl2(comp) + '/MWh é a parcela da tarifa que responde à eficiência da distribuidora — e é apenas uma parte do que a fatura cobra. Um ponto percentual no custo de capital move ' + mmi(sens) + ' por ano.';
  else veredito = 'Remuneração do capital em apenas ' + shs + '% da Parcela B: concessão intensiva em operação, não em ativos. Aqui o parâmetro que decide a revisão não é o custo de capital, e sim a metodologia de custo operacional eficiente — a empresa de referência. Discutir só a taxa de retorno numa concessão com este perfil é discutir a variável errada.';
  return {
    valores: { 'i5-p': pb0, 'i5-c': comp, 'i5-s': sens, 'i5-f': anos[4].t },
    textos: { 'i5-p': mmi(pb0), 'i5-c': brl2(comp) + '/MWh', 'i5-s': mmi(sens) + '/ano', 'i5-f': mmi(anos[4].t) },
    veredito,
  };
};

// ── INST 06 — mapa de desenho de mercado ─────────────────────────────────
const inst06: CalculateFn = (i) => {
  const BR = { x: 85, y: 45 };
  const X = v(i['i6-x']), Y = v(i['i6-y']), Hh = v(i['i6-h']);
  const xId = 15 + 0.75 * Hh, yId = 70 - 0.35 * Hh;
  const coer = clamp(100 - 0.55 * Math.abs(X - xId) - 0.45 * Math.abs(Y - yId), 0, 100);
  const dist = Math.sqrt(Math.pow(X - BR.x, 2) + Math.pow(Y - BR.y, 2));
  const quad = X < 50 ? (Y < 50 ? 'Oferta · só energia' : 'Oferta · capacidade formal') : Y < 50 ? 'Custo · só energia' : 'Custo · capacidade formal';
  let risco: string;
  if (Y < 32) risco = 'Missing money';
  else if (Y > 72) risco = 'Erro de projeção';
  else if (X < 35 && Hh > 55) risco = 'Coordenação intertemporal';
  else if (X > 72) risco = 'Opacidade metodológica';
  else risco = 'Custo administrativo';
  let veredito: string;
  if (coer >= 80) veredito = 'Configuração coerente com um parque em que o recurso armazenável plurianual pesa ' + Hh + '%. Quadrante: ' + quad.toLowerCase() + '. O risco que sobra é ' + risco.toLowerCase() + ' — nenhum desenho elimina risco, apenas escolhe qual carregar. Saber nomear qual você escolheu é o que distingue desenho de improviso.';
  else if (coer >= 55) veredito = 'Coerência de ' + coer.toFixed(0) + '/100. A configuração é sustentável, mas há tensão entre o desenho e o parque: com ' + Hh + '% de recurso armazenável plurianual, o eixo de revelação de custo tenderia a ficar mais próximo de ' + xId.toFixed(0) + ' e o de capacidade, de ' + yId.toFixed(0) + '. Risco dominante: ' + risco.toLowerCase() + '.';
  else veredito = 'Coerência de ' + coer.toFixed(0) + '/100: o desenho e o parque estão desalinhados. ' + (X < xId - 15 ? 'Revelar custo por oferta voluntária num parque com forte armazenamento plurianual deixa o valor intertemporal da água fora da otimização — nenhum gerador individual o internaliza. ' : '') + (Y < yId - 15 ? 'E remunerar capacidade apenas pela margem de energia, com demanda inelástica e teto de preço, é a receita conhecida do missing money. ' : '') + 'Risco dominante: ' + risco.toLowerCase() + '.';
  // A fonte escreve coerência e distância com toFixed(0).
  return {
    valores: { 'i6-co': Math.round(coer), 'i6-d': Math.round(dist) },
    textos: { 'i6-q': quad, 'i6-co': coer.toFixed(0) + '/100', 'i6-d': dist.toFixed(0), 'i6-r': risco },
    veredito,
  };
};

/** Q07: o veredito do INST·01 formata o percentual com `toFixed(1)` (ponto decimal:
 *  "custa apenas 8.3% a mais"). Só esse caso — dígito, ponto, um dígito, "%" — vira
 *  vírgula; o separador de milhar ("200.000") não é tocado. */
export const decimalUnico = (s: string) => s.replace(/(\d)\.(\d)%/g, '$1,$2%');

// `vereditoPtBr`: os vereditos da fonte já saem em pt-BR (toLocaleString); a troca de ponto
// por vírgula da tela quebraria o separador de milhar ("200.000 consumidores").
const ptBr = (fn: CalculateFn): CalculateFn => (i) => {
  const r = fn(i);
  return { ...r, veredito: r.veredito ? decimalUnico(r.veredito) : r.veredito, vereditoPtBr: true };
};

export const CALCULADORAS: Record<string, CalculateFn> = {
  'm05-inst-01': ptBr(inst01),
  'm05-inst-02': ptBr(inst02),
  'm05-inst-03': ptBr(inst03),
  'm05-inst-04': ptBr(inst04),
  'm05-inst-05': ptBr(inst05),
  'm05-inst-06': ptBr(inst06),
};
