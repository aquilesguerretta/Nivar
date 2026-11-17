// unidades.mjs — o que é uma unidade, e como lê-la de um texto da fonte.
//
// A lista abaixo é vocabulário de medida (símbolos de energia, potência, moeda,
// tempo, massa, área), não conhecimento do projeto: ela só decide se um trecho
// que a FONTE escreveu parece uma unidade ou outra coisa ("de 6", "custo novo").
// Nenhuma unidade é inferida do que o instrumento calcula — só lida do que a
// fonte escreve (extração, rótulo, markup, saída formatada pelo script).

const ATOMO = [
  String.raw`meses`, String.raw`mês`, String.raw`dias`, String.raw`dia`, String.raw`anos`, String.raw`ano`, String.raw`min`,
  String.raw`MMBtu`, String.raw`BTU`, String.raw`tep`, String.raw`bep`,
  String.raw`[kMGTP]?W(?:h|p|e)?`, String.raw`[kMG]?VA[rR]?`, String.raw`[kmM]?V`, String.raw`[kmMµ]?A`, String.raw`k?Ω`, String.raw`Hz`,
  String.raw`[kMGTP]?J`, String.raw`Mt`, String.raw`kt`, String.raw`Gt`, String.raw`kg`, String.raw`mg`,
  String.raw`km²`, String.raw`m²`, String.raw`m³`, String.raw`Nm³`, String.raw`ha`, String.raw`km`, String.raw`cm`, String.raw`mm`,
  String.raw`°C`, String.raw`°`, String.raw`%`, String.raw`pp`, String.raw`p\.p\.`,
  String.raw`US\$`, String.raw`R\$`, String.raw`€`, String.raw`USD`, String.raw`BRL`,
  String.raw`unid\.?`, String.raw`un\.`, String.raw`p\.u\.`, String.raw`pu`,
  String.raw`×`, String.raw`índice`, String.raw`a\.a\.`, String.raw`pontos`, String.raw`pts`, String.raw`mil(?=\/)`,
  String.raw`CO₂e?`, String.raw`CO2e?`,
  String.raw`[gt]`, String.raw`m`, String.raw`L`, String.raw`l`, String.raw`h`, String.raw`s`,
].join('|');
const ATOMO_POT = String.raw`(?:${ATOMO})(?:²|³)?`;
// unidade composta: ATOMO [(/|·|×|*) ATOMO]…  (com "t CO₂e" e "R$/MWh" em mente)
export const UNIDADE_RE_FONTE = String.raw`(?:${ATOMO_POT}(?:\s?(?:CO₂e?|CO2e?))?(?:\s?[\/·×*]\s?${ATOMO_POT}(?:\s?(?:CO₂e?|CO2e?))?)*)`;
const FIM = String.raw`(?![\p{L}\d])`;
const UNIDADE_EXATA = new RegExp(`^${UNIDADE_RE_FONTE}$`, 'u');
const UNIDADE_PREFIXO = new RegExp(`^\\s*(${UNIDADE_RE_FONTE})${FIM}`, 'u');

/** O texto inteiro é uma unidade (e não um sufixo textual)? Aceita "/MWh" e "R$/mês". */
export function ehUnidade(txt) {
  if (txt == null) return false;
  const t = String(txt).trim().replace(/^\/(?=\p{L})/u, '1/'); // "/MWh" → "1/MWh"
  if (!t) return false;
  if (/^1\//.test(t)) return UNIDADE_EXATA.test(t.slice(2));
  return UNIDADE_EXATA.test(t);
}

const NUM_RE = String.raw`(?:\d{1,3}(?:\.\d{3})+|\d+)(?:,\d+)?|\d+\.\d+`;
const QTD_RE = new RegExp(
  `(?<sinal>[+\\-−–]\\s?)?(?<pre>R\\$|US\\$|€)?\\s*(?<num>${NUM_RE})(?![\\d])(?<esc>\\s(?:mil|mi|bi|milhões|milhão|bilhões|bilhão)(?![\\p{L}\\d]))?(?<resto>(?:\\s?%)|(?:\\s?(?:${UNIDADE_RE_FONTE}))${FIM})?`, 'gu');

export function lerNumero(s) {
  let t = String(s);
  if (/^\d{1,3}(\.\d{3})+(,\d+)?$/.test(t)) t = t.replace(/\./g, '').replace(',', '.');
  else if (/,/.test(t)) t = t.replace(/\./g, '').replace(',', '.');
  return parseFloat(t);
}

/**
 * Quantidades de um texto: [{valor, unidade, bruto, indice}].
 * "56 GW às 12h" → [{56,'GW'}, {12,'h'}];  "R$ 1.800" → [{1800,'R$'}];  "+11,4 GW/h" → [{11.4,'GW/h'}].
 * unidade é null quando o número vem sem nada que pareça unidade logo atrás/à frente.
 */
export function quantidades(texto) {
  const out = [];
  if (texto == null) return out;
  const t = String(texto);
  QTD_RE.lastIndex = 0;
  let m;
  while ((m = QTD_RE.exec(t))) {
    const g = m.groups;
    let un = g.pre || null;
    if (g.resto) {
      const r = g.resto.trim();
      if (!g.pre) un = r;
      else if (/^[\/·×*]/.test(r)) un = g.pre + r; // "R$ 1.800/mês"
    }
    // "/mês" colado depois de "R$ 1.800": "R$ 1.800/mês" → R$/mês
    if (g.pre && !g.resto) {
      const apos = t.slice(m.index + m[0].length);
      const mm = /^\s?\/\s?([\p{L}²³³]+)/u.exec(apos);
      if (mm && ehUnidade(g.pre + '/' + mm[1])) { un = g.pre + '/' + mm[1]; QTD_RE.lastIndex += mm[0].length; }
    }
    let escala = null, base = un;
    const FATOR = { mil: 1e3, mi: 1e6, 'milhão': 1e6, 'milhões': 1e6, bi: 1e9, 'bilhão': 1e9, 'bilhões': 1e9 };
    if (g.esc) {
      escala = g.esc.trim();
      if (g.pre && !g.resto) { un = g.pre + ' ' + escala; base = g.pre; }
      else if (!g.pre && g.resto) { un = escala + ' ' + g.resto.trim(); base = g.resto.trim(); }
    } else if (g.resto && un) {
      // "166,5R$ mi": a escala vem depois da unidade
      const apos = /^\s(mil|mi|bi)(?![\p{L}\d])/u.exec(t.slice(m.index + m[0].length));
      if (apos) { escala = apos[1]; base = un; un = un + ' ' + escala; QTD_RE.lastIndex += apos[0].length; }
    }
    const sinal = g.sinal ? (/[-−–]/.test(g.sinal) ? -1 : 1) : 1;
    out.push({ valor: sinal * lerNumero(g.num), unidade: un, bruto: m[0].trim(), indice: m.index, escala, fator: escala ? FATOR[escala] : 1, unidadeBase: escala ? base : un });
  }
  for (let k = out.length - 2; k >= 0; k--) {
    if (out[k].unidade == null && out[k + 1].unidade != null) {
      const entre = t.slice(out[k].indice + out[k].bruto.length, out[k + 1].indice);
      if (/^\s*[\/→]\s*$/.test(entre)) out[k].unidade = out[k + 1].unidade;
    }
  }
  return out;
}

/** Sufixo lido da fonte → unidade, escala ou texto solto. */
const ESCALA = /^(mil|mi|bi|milhão|milhões|bilhão|bilhões)$/;
const COM_QUALIF = new RegExp(String.raw`^(${UNIDADE_RE_FONTE})\s+(\p{L}[\p{L} ]{0,30})$`, 'u');
export function classificarSufixo(txt) {
  if (txt == null) return null;
  const t = String(txt).trim();
  if (!t) return null;
  if (ehUnidade(t)) return { tipo: 'unidade', unidade: t, qualificador: null };
  if (ESCALA.test(t)) return { tipo: 'escala', unidade: null, qualificador: t };
  const m = COM_QUALIF.exec(t);
  if (m && ehUnidade(m[1])) return { tipo: 'unidade', unidade: m[1], qualificador: m[2] };
  return { tipo: 'sufixo', unidade: null, qualificador: t };
}

/** Unidade em rótulo: "Potência (kW)", "Preço [R$/MWh]", "Tarifa, R$/kWh", "Energia em MWh". */
export function unidadeNoRotulo(rotulo) {
  if (!rotulo) return null;
  const r = String(rotulo);
  const cands = [];
  for (const m of r.matchAll(/[(\[]\s*([^)\]]+?)\s*[)\]]/g)) cands.push({ txt: m[1], trecho: m[0] });
  const v = /[,—–-]\s*([^,—–-]+)$/.exec(r.trim());
  if (v) cands.push({ txt: v[1], trecho: v[0] });
  const e = /\b(?:em|[eé] medid[oa] em)\s+(\S+)\s*$/u.exec(r.trim());
  if (e) cands.push({ txt: e[1], trecho: e[0] });
  for (const c of cands.reverse()) {
    const t = c.txt.trim();
    if (ehUnidade(t)) return { unidade: t, evidencia: c.trecho.trim() };
  }
  return null;
}

/** "56 GW às 12h" etc: a unidade da PRIMEIRA quantidade, e as demais. */
export function unidadesDoTexto(texto) {
  const q = quantidades(texto);
  return { quantidades: q, primeira: q.length ? q[0].unidade : null };
}
