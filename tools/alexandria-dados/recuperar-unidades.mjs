// recuperar-unidades.mjs — unidade de cada saída, lida da fonte, com a origem dita.
//
// Ordem de busca (primeira que acha, vence; nenhuma é inferência do cálculo):
//   1. extração   — campo `unidade` da extração, se for mesmo unidade (e não um
//                   sufixo textual como "de 6" ou "custo novo");
//   2. rótulo     — "(kW)", "[R$/MWh]", ", R$/kWh", "em MWh" no rótulo da saída;
//   3. markup     — unidade escrita ao lado do elemento no HTML (`<span class=u>`,
//                   texto logo depois, "R$" logo antes) ou no valor estático;
//   4. script     — a unidade que a saída FORMATADA pelo script carrega
//                   ("56 GW às 12h", "R$ 0,539/km"), observada no cenário-padrão e
//                   nas varreduras; só vale para leitura curta (não para veredito).
//
// Não usado, de propósito: texto de aula. Associar uma unidade que aparece em
// prosa a uma saída específica é interpretação, e a regra do Founder é não
// preencher o que a fonte não declara. As saídas que só teriam unidade pela
// prosa saem `null`, com o motivo dito.

import { quantidades, unidadeNoRotulo, classificarSufixo } from './unidades.mjs';
import { executarInstrumento } from './executar.mjs';

const BLOCO = new Set(['div', 'p', 'li', 'tr', 'td', 'th', 'section', 'article', 'h1', 'h2', 'h3', 'h4', 'ul', 'ol', 'table', 'br', 'button', 'label']);
const INLINE_UNIDADE = /(^|\s)(u|un|unit|unid|unidade|suf|suffix|sufixo|uni)(\s|$)/;
const lim = (s) => String(s ?? '').replace(/\s+/g, ' ').trim();

function unidadeNoMarkup(el) {
  const pai = el.pai;
  if (!pai || !pai.filhos) return null;
  const k = pai.filhos.indexOf(el);
  // 1. depois do elemento
  let depois = '';
  const evid = [];
  for (let j = k + 1; j < pai.filhos.length && j <= k + 3; j++) {
    const f = pai.filhos[j];
    if (f.tag) {
      if (f.attrs.id || BLOCO.has(f.tag)) break;
      const t = lim(f.textContent);
      if (INLINE_UNIDADE.test(f.attrs.class || '')) {
        const c = classificarSufixo(t);
        if (c && c.tipo === 'unidade') return { unidade: c.unidade, qualificador: c.qualificador, evidencia: `<${f.tag} class="${f.attrs.class}">${t}</${f.tag}> logo depois de #${el.attrs.id}` };
      }
      depois += ' ' + t; evid.push(`<${f.tag}>${t}`);
    } else { depois += f.data; evid.push(lim(f.data)); }
  }
  depois = lim(depois);
  if (depois) {
    const q = quantidades('0 ' + depois)[0];
    if (q && q.unidade) return { unidade: q.unidade, qualificador: null, evidencia: `"${depois}" logo depois de #${el.attrs.id} no markup` };
  }
  // 2. antes do elemento: moeda
  let antes = '';
  for (let j = k - 1; j >= 0 && j >= k - 2; j--) {
    const f = pai.filhos[j];
    if (f.tag && (BLOCO.has(f.tag) || f.attrs.id)) break;
    antes = (f.tag ? lim(f.textContent) : f.data) + antes;
  }
  const mm = /(R\$|US\$|€)\s*$/.exec(antes);
  if (mm) return { unidade: mm[1], qualificador: null, evidencia: `"${lim(antes)}" logo antes de #${el.attrs.id} no markup` };
  return null;
}

const CURTA = 60;
const semAcento = (s) => String(s ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/s+/g, ' ').trim();

/**
 * Preenche `unidade`, `unidade_origem`, `unidade_evidencia`… em cada saída de `reg`.
 * `exec` opcional (resultado de executarInstrumento) para reaproveitar a execução.
 */
export function recuperarUnidadesDoRegistro(reg, exec) {
  const ex = exec ?? executarInstrumento(reg, { pontos: 5 });
  const m = ex.m;
  const resultado = [];
  for (const s of reg.saidas) {
    const r = { unidade: null, unidade_origem: null, unidade_evidencia: null, unidade_qualificador: null, unidades_observadas: null, sufixo_textual: null, unidade_motivo: null };
    // 1. extração
    if (s.unidade != null && String(s.unidade).trim()) {
      const c = classificarSufixo(s.unidade);
      if (c.tipo === 'unidade') Object.assign(r, { unidade: c.unidade, unidade_origem: 'extração', unidade_evidencia: `campo unidade da extração: "${s.unidade}"`, unidade_qualificador: c.qualificador });
      else r.sufixo_textual = String(s.unidade).trim();
    }
    // 2. rótulo
    if (!r.unidade) {
      const u = unidadeNoRotulo(s.rotulo);
      if (u) Object.assign(r, { unidade: u.unidade, unidade_origem: 'rótulo', unidade_evidencia: `rótulo "${s.rotulo}" → ${u.evidencia}` });
    }
    // 3. markup
    const el = s.id ? m.el(s.id) : null;
    if (!r.unidade && el) {
      const u = unidadeNoMarkup(el);
      if (u) Object.assign(r, { unidade: u.unidade, unidade_origem: 'markup', unidade_evidencia: u.evidencia, unidade_qualificador: u.qualificador });
    }
    if (!r.unidade) {
      const st = (s.id && m.estatico.get(s.id)?.texto) || s.estatico || null;
      if (st && String(st).length <= CURTA) {
        const q = quantidades(st);
        if (q.length && q[0].unidade) Object.assign(r, { unidade: q[0].unidade, unidade_origem: 'markup', unidade_evidencia: `valor estático do markup: "${st}"` });
      }
    }
    // 4. script (saída formatada)
    let observados = [], textosVistos = 0, numericas = 0;
    if (s.id) {
      const pontos = [{ rotulo: 'cenário-padrão', o: ex.padrao.saidas[s.id] }];
      for (const v of ex.varreduras) for (const p of v.pontos) pontos.push({ rotulo: `${v.id}=${p.rotulo_x ?? p.x}`, o: p.saidas[s.id] });
      for (const p of pontos) {
        if (!p.o) continue;
        textosVistos++;
        if (p.o.texto.length > CURTA) continue;
        const q = p.o.q;
        if (q.length && q[0][2] <= 2) { numericas++; observados.push({ u: q[0][1], t: p.o.texto, de: p.rotulo }); }
      }
    }
    const comUn = observados.filter((o) => o.u);
    if (comUn.length) {
      const contagem = new Map();
      for (const o of comUn) contagem.set(o.u, (contagem.get(o.u) || 0) + 1);
      const padrao = observados[0].u && observados[0].de === 'cenário-padrão' ? observados[0] : comUn[0];
      r.unidades_observadas = [...contagem.keys()];
      if (!r.unidade) Object.assign(r, { unidade: padrao.u, unidade_origem: 'script', unidade_evidencia: `saída formatada pelo script: "${padrao.t}" (${padrao.de})` });
    }
    // 4b. leitura de painel: saída sem id cujo rótulo é o rótulo de um par rótulo/valor que o script escreve
    if (!r.unidade && s.rotulo) {
      const alvo = semAcento(s.rotulo);
      const achados = [];
      const coleta = (saidas, de) => { for (const l of Object.values(saidas)) for (const x of l?.sub ?? []) if (semAcento(x.rotulo) === alvo) achados.push({ x, de }); };
      coleta(ex.padrao_todas, 'cenário-padrão');
      for (const v of ex.varreduras) for (const p of v.pontos) coleta(p.saidas, `${v.id}=${p.rotulo_x ?? p.x}`);
      const comUn = achados.filter((a) => a.x.q.length && a.x.q[0][1] && a.x.texto.length <= CURTA);
      if (comUn.length) {
        const pd = comUn.find((a) => a.de === 'cenário-padrão') ?? comUn[0];
        Object.assign(r, { unidade: pd.x.q[0][1], unidade_origem: 'script', unidade_evidencia: `leitura de painel que o script escreve: "${pd.x.rotulo}" → "${pd.x.texto}" (${pd.de})` });
        numericas += 1;
      } else if (achados.length) numericas += 1;
    }
    // sem unidade: dizer por quê
    if (!r.unidade) {
      if (s.id && !el) r.unidade_motivo = 'id da saída não existe no DOM depois do carregamento do módulo';
      else if (!s.id) r.unidade_motivo = 'saída sem id na extração; rótulo e valor estático não trazem unidade';
      else if (numericas === 0) r.unidade_motivo = 'saída não numérica (veredito, painel, figura ou texto): unidade não se aplica';
      else r.unidade_motivo = 'saída numérica sem unidade escrita no rótulo, no markup, na extração nem na saída formatada pelo script; só a prosa da aula poderia dá-la, e isso é inferência';
    }
    resultado.push(r);
  }
  return resultado;
}

/** Aplica em todos os registros (mutação) e devolve as contagens. */
export function recuperarUnidades(registros, { log } = {}) {
  const cont = { saidas: 0, com_unidade_na_extracao_bruta: 0, com_unidade: 0, por_origem: { 'extração': 0, 'rótulo': 0, 'markup': 0, 'script': 0 }, sufixo_textual: 0, nao_numericas: 0, numericas_sem_unidade: 0, sem_id: 0 };
  for (const reg of registros) {
    const id = reg.identidade?.id ?? reg.id;
    if (!reg.saidas?.length) continue;
    const t0 = Date.now();
    const res = recuperarUnidadesDoRegistro(reg);
    reg.saidas.forEach((s, k) => {
      if (s.unidade != null && String(s.unidade).trim()) cont.com_unidade_na_extracao_bruta++;
      Object.assign(s, res[k], { unidade_na_extracao: s.unidade ?? null });
      s.unidade = res[k].unidade;
      cont.saidas++;
      if (s.unidade) { cont.com_unidade++; cont.por_origem[s.unidade_origem]++; }
      else if (!s.id) cont.sem_id++;
      else if (/não numérica/.test(s.unidade_motivo)) cont.nao_numericas++;
      else cont.numericas_sem_unidade++;
      if (s.sufixo_textual) cont.sufixo_textual++;
    });
    if (log) log(`${id}: ${Date.now() - t0} ms`);
  }
  return cont;
}
