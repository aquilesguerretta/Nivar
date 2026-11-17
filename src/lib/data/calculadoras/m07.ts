// Calculadoras novas ou corrigidas do M07 (porte verbatim do script da fonte).
// Posse: a sessão de porte do M07. Uma chave aqui SUBSTITUI a de mesmo id em
// INSTRUMENT_CALCULATORS — é assim que um conserto (Q05/Q07) entra sem editar o arquivo grande.
//
// Fonte: `<script>` de `Alexandria modulos/alexandria_modulo07.html`, blocos INST 01–10.
//   · Exploradores (01, 02, 03, 05, 07, 08, 09, 10): o painel inteiro da fonte, a partir dos
//     literais do script (M07_DADOS_DOS_INSTRUMENTOS, gerados). `panel()`, `gcmp()` e `cards()`
//     da fonte viram HTML curto que a tela lê (<b>, <br>): cabeçalho, título, corpo, cada linha
//     "chave — valor" e a leitura com o rótulo literal ("Leitura", "Camada fixa"). O código antigo
//     guardava só a primeira linha de cada ficha (README da extração do M07).
//   · Inst 08 e 09: os seis cartões com os rótulos literais (perdidos no porte antigo).
//   · Inst 10: as três camadas — ciclo anual, "O que fazer no mês" e a camada fixa.
//   · Inst 01 (§MAP): ficha do nó e, no lugar do grafo SVG, as arestas do fluxo escolhido que tocam
//     o nó, com os rótulos literais de `AUT`/`DAD`; a legenda do fluxo é a de `LEGS`.
//   · Inst 04 e 06: cálculo e vereditos do arquivo grande (já idênticos ao script); voltam as
//     leituras textuais "Regime" e "Regime de caixa" e as unidades ("dias").
// `vereditoPtBr: true`: os números já saem em pt-BR ("Lei nº 9.478/1997" não pode virar vírgula).

import type { CalculateFn, EntradaInstrumento } from '../alexandria-instrument-calculators';
import { M07_DADOS_DOS_INSTRUMENTOS as D, M07_ROTULOS_DOS_CARTOES as CARTOES } from '../alexandria-modulo-07-content';

const n = (v: EntradaInstrumento | undefined): number => {
  const x = typeof v === 'number' ? v : parseFloat(String(v ?? ''));
  return Number.isFinite(x) ? x : 0;
};
const idx = (v: EntradaInstrumento | undefined, total: number) => Math.min(Math.max(Math.trunc(n(v)), 0), total - 1);
/** Formatadores literais do script da fonte (L1922–1926). */
const num = (v: number, d = 0) => v.toLocaleString('pt-BR', { minimumFractionDigits: d, maximumFractionDigits: d });
const dias = (v: number) => num(v, 0) + (v === 1 ? ' dia' : ' dias');
const R = (veredito: string, textos: Record<string, string> = {}, valores: Record<string, number> = {}) => ({ valores, textos, veredito, vereditoPtBr: true });

type Linha = readonly [string, string];
/** `panel(kick, tit, body, rows, leg, legLb)` da fonte (L1965), em HTML curto. */
function painel(kick: string, tit: string, body: string | null, rows: readonly Linha[] | null, leg: string | null, legLb?: string): string {
  const p = [`<b>${kick}</b><br><b>${tit}</b>`];
  if (body) p.push(body);
  if (rows && rows.length) p.push(rows.map(([k, v]) => `<b>${k.replace(/<br>/g, ' ')}</b> — ${v}`).join('<br>'));
  if (leg) p.push(`<b>${legLb || 'Leitura'}</b> — ${leg}`);
  return p.join('<br><br>');
}
const cartoes = (rotulos: readonly string[], x: readonly string[]) => rotulos.map((r, i) => `<b>${r}</b> — ${x[i]}`).join('<br>');

// ── Exploradores de ficha (02, 03, 07) ─────────────────────────────────────
const ficha = (lista: readonly { k: string; n: string; b: string; r: readonly Linha[]; l: string }[], campo: string): CalculateFn => (i) => {
  const d = lista[idx(i[campo], lista.length)];
  return R(painel(d.k, d.n, d.b, d.r, d.l));
};

// ── Inst 05 · cadeia temporal: panel(d.k+' · '+d.n, d.t, d.b, d.r, d.l) ────
const inst05: CalculateFn = (i) => {
  const d = D.i05[idx(i['i5-sel'], D.i05.length)];
  return R(painel(`${d.k} · ${d.n}`, d.t, d.b, d.r, d.l));
};

// ── Inst 08 e 09 · painel sem linhas + seis cartões ────────────────────────
const comCartoes = (lista: readonly { k: string; n: string; b: string; c: readonly string[]; l: string }[], campo: string, rotulos: readonly string[], saida: string): CalculateFn => (i) => {
  const d = lista[idx(i[campo], lista.length)];
  // O primeiro cartão (órgão emissor / órgão que publica) também sai em `textos`, para a previsão.
  return R(`${painel(d.k, d.n, d.b, null, d.l)}<br><br>${cartoes(rotulos, d.c)}`, { [saida]: d.c[0] });
};

// ── Inst 10 · calendário (sel(k), L2881) ───────────────────────────────────
const inst10: CalculateFn = (i) => {
  const k = idx(i['i10-sel'], D.i10.M.length);
  const d = D.i10.M[k];
  const rows: Linha[] = d.a.map((x, j) => [`Ciclo anual · ${j + 1}`, x] as const);
  rows.push(['O que fazer no mês', `<b>${d.f}</b>`]);
  return R(
    painel(
      `Mês ${k + 1} de 12`,
      d.n,
      'O painel separa duas camadas. A de baixo é a cadência fixa, que não depende do mês. A de cima são os eventos de ciclo anual que <em>tipicamente</em> caem neste período — padrões observados, não compromisso de calendário.',
      rows,
      D.i10.FIXO,
      'Camada fixa',
    ),
  );
};

// ── Inst 01 (§MAP) · mapa institucional ────────────────────────────────────
const inst01: CalculateFn = (i) => {
  const G = D.i01;
  const k = String(i['m07-i1-sel'] ?? 'cnpe') in G.INFO ? (String(i['m07-i1-sel'] ?? 'cnpe') as keyof typeof G.INFO) : 'cnpe';
  const flow = ['aut', 'dad', 'amb'].includes(String(i['m07-i1-flow'])) ? String(i['m07-i1-flow']) : 'aut';
  const d = G.INFO[k];
  const nome = (x: string) => G.N[x as keyof typeof G.N].l;
  const arestas = (lista: readonly (readonly [string, string, string, number])[], titulo: string, comRotulo: boolean) => {
    const sel = lista.filter(([a, b]) => a === k || b === k);
    return sel.length ? `<b>${titulo}</b><br>` + sel.map(([a, b, rot]) => `${nome(a)} → ${nome(b)}${comRotulo ? ` · ${rot}` : ''}`).join('<br>') : '';
  };
  // LEGS da fonte (texto das legendas, sem as amostras de cor).
  const legenda = String(G.LEGS[flow as keyof typeof G.LEGS]).replace(/<i[^>]*><\/i>/g, '').replace(/<\/span><span[^>]*>/g, ' · ').replace(/<[^>]+>/g, '');
  const partes = [painel(d.k, d.t, d.b, d.r, d.l)];
  const um = flow !== 'amb'; // a fonte esconde os rótulos das setas no modo combinado
  if (flow === 'aut' || flow === 'amb') partes.push(arestas(G.AUT, 'Autoridade', um));
  if (flow === 'dad' || flow === 'amb') partes.push(arestas(G.DAD, 'Dado', um));
  partes.push(legenda);
  return R(partes.filter(Boolean).join('<br><br>'));
};

// ── Inst 04 · anatomia de um ato regulatório (L2400–2455) ──────────────────
const inst04: CalculateFn = (i) => {
  const a = n(i['i4-a-n']);
  const b = n(i['i4-b-n']);
  const c = n(i['i4-c-n']);
  const d = n(i['i4-d-n']);
  const e = n(i['i4-e-n']);
  const f = n(i['i4-f-n']);
  const tot = a + b + c + d + e + f;
  const jan = a + c;
  const r = tot > 0 ? jan / tot : 0;
  const reg = jan === 0 ? 'Fechado à contribuição' : r >= 0.28 ? 'Aberto e previsível' : r >= 0.15 ? 'Aberto com janela estreita' : 'Formalmente aberto, praticamente fechado';
  const av = f === 0 ? 'sem vacância — a regra vale na publicação' : f < 30 ? 'vacância curta' : f < 90 ? 'vacância apertada' : f < 180 ? 'vacância razoável' : 'vacância confortável';
  const veredito = ((): string => {
    if (jan===0) return `<b>Sem porta de entrada.</b> Não há tomada de subsídios nem consulta pública: o agente descobre a regra quando ela já é obrigação. Isso acontece em hipóteses de urgência declarada e é legítimo nelas — mas transforma o processo regulatório em risco não gerenciável para quem é regulado. Nesse desenho, a única defesa possível é posterior: recurso administrativo e via judicial. Ciclo total de ${dias(tot)}, com ${av}.`;
    if (r>=0.28 && f>=90) return `<b>Rito aberto e com aviso.</b> A janela de influência é de ${dias(jan)} em um ciclo de ${dias(tot)} — cerca de ${num(r*100,0)}% do processo aceita contribuição externa documentada — e ainda restam ${dias(f)} entre a deliberação e a vigência para adaptar contrato, sistema e operação. É o desenho em que participar tem retorno real e em que a surpresa regulatória é evitável. Regime: ${reg.toLowerCase()}, ${av}.`;
    if (r>=0.15) return `<b>Aberto, mas exige monitoramento ativo.</b> A janela de influência é de ${dias(jan)} num ciclo de ${dias(tot)} — cerca de ${num(r*100,0)}%. Quem monitora apenas a publicação final chega depois de fechada. Quem monitora o despacho de abertura de consulta chega a tempo. Depois da deliberação restam ${dias(f)} de adaptação: ${av}. A assimetria entre grandes e pequenos agentes nasce exatamente aqui — não na regra, mas na capacidade de acompanhar o processo.`;
    return `<b>Formalmente aberto, praticamente fechado.</b> Apenas ${num(r*100,0)}% do ciclo de ${dias(tot)} aceita contribuição — ${dias(jan)} de janela contra ${dias(b+d+e)} de processo interno. O rito cumpre a exigência de participação sem entregar participação efetiva: quando a minuta chega ao público, as escolhas estruturais já foram feitas na fase de elaboração. Aviso prévio: ${dias(f)}, ${av}.`;
  })();
  return R(veredito, { 'i4-tot': `${num(tot, 0)} dias`, 'i4-jan': `${num(jan, 0)} dias`, 'i4-avi': `${num(f, 0)} dias`, 'i4-reg': reg }, { 'i4-tot': tot, 'i4-jan': jan, 'i4-avi': f });
};

// ── Inst 06 · régua do ciclo mensal (L2524–2585) ───────────────────────────
const inst06: CalculateFn = (i) => {
  const a = n(i['i6-a-n']);
  const b = n(i['i6-b-n']);
  const c = n(i['i6-c-n']);
  const d = n(i['i6-d-n']);
  const e = n(i['i6-e-n']);
  const tot = a + b + c + d + e;
  const fol = c + d;
  const prev = a + b;
  let reg = tot <= 25 ? 'Ciclo curto' : tot <= 40 ? 'Ciclo padrão' : tot <= 55 ? 'Ciclo longo' : 'Ciclo muito longo';
  if (c === 0) reg += ' · sem contestação';
  else if (c <= 3) reg += ' · janela mínima';
    const cap = `O intervalo de ${dias(tot)} entre o fim do mês de consumo e a liquidação é capital de giro parado: a energia foi consumida, o valor ainda não circulou, e o agente carrega a posição no balanço enquanto isso.`;
  const veredito = ((): string => {
    if (c===0) return `<b>Sem janela de contestação.</b> A prévia sai no dia ${num(prev,0)} e vira obrigação sem intervalo para questionamento. Todo erro de medição, de registro de contrato ou de aplicação de regra vira desembolso primeiro e discussão depois — e discussão depois de liquidado é processo, não é ajuste. ${cap}`;
    if (c<=3) return `<b>Janela mínima.</b> São ${dias(c)} entre conhecer a prévia e perder o direito de contestar — tempo insuficiente para conferir medição por ponto, conciliar contratos e montar argumento técnico em qualquer operação de porte. Na prática, quem não tem conciliação automatizada não contesta. ${cap} A folga até o aporte é de ${dias(fol)}.`;
    if (fol<5) return `<b>Contestação existe, folga de caixa não.</b> A janela de ${dias(c)} é utilizável, mas entre saber o valor e ter que aportar garantia há apenas ${dias(fol)}. Para um agente com tesouraria enxuta, isso significa manter caixa ocioso permanentemente — porque não dá tempo de mobilizar recurso depois que o número aparece. ${cap}`;
    if (tot<=40) return `<b>Ciclo equilibrado.</b> Janela de contestação de ${dias(c)}, folga de ${dias(fol)} entre a prévia e o aporte, e ${dias(tot)} do fim do consumo à liquidação. É o desenho em que o agente consegue conferir antes de pagar e mobilizar caixa antes de aportar — as duas condições que separam gestão de tesouraria de reação a boleto. ${cap}`;
    return `<b>Ciclo longo, com controle preservado.</b> A janela de ${dias(c)} e a folga de ${dias(fol)} funcionam, mas o ciclo de ${dias(tot)} amplia a exposição: quanto mais tempo entre consumo e liquidação, maior o valor em aberto e maior o efeito de uma inadimplência de terceiro sobre o rateio da liquidação. ${cap}`;
  })();
  return R(veredito, { 'i6-tot': `${num(tot, 0)} dias`, 'i6-jan': `${num(c, 0)} dias`, 'i6-fol': `${num(fol, 0)} dias`, 'i6-reg': reg }, { 'i6-tot': tot, 'i6-jan': c, 'i6-fol': fol });
};

export const CALCULADORAS: Record<string, CalculateFn> = {
  'm07-inst-01': inst01,
  'm07-inst-02': ficha(D.i02, 'i2-sel'),
  'm07-inst-03': ficha(D.i03, 'i3-sel'),
  'm07-inst-04': inst04,
  'm07-inst-05': inst05,
  'm07-inst-06': inst06,
  'm07-inst-07': ficha(D.i07, 'i7-sel'),
  'm07-inst-08': comCartoes(D.i08, 'i8-sel', CARTOES['08'], 'i8-orgao'),
  'm07-inst-09': comCartoes(D.i09, 'i9-sel', CARTOES['09'], 'i9-orgao'),
  'm07-inst-10': inst10,
};
