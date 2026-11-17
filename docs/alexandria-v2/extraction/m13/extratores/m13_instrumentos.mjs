// Grupo "instrumentos" do M13 → instrumentos.json.
// Dados e textos: literais do <script> avaliados em vm (nunca digitados).
// Cenário-padrão e cobertura: o script ORIGINAL executado em DOM simulado.
import vm from 'node:vm';
import {
  S, LINES, SRC, DOC, JS, all, first, kids, inner, byTag, byClass, hasClass, txt, texto, htmlN, origem, origemOff,
  byId, writeJSON, readRepo, pad, fail, lineOf, jsLiteral, jsBlock, jsLine, runScript, innerSkipping, collapse,
  modeloLegivel, makeDocument, literalSpan,
} from './m13_lib.mjs';
import { bloco } from './m13_blocos.mjs';

const secs = all(DOC, byTag('section'));
const secOf = (n) => secs.find((s) => s.start <= n.start && s.end >= n.end);
const insts = all(DOC, (n) => n.tag === 'div' && (n.attrs.class || '') === 'inst');
if (insts.length !== 11) fail('11 instrumentos');

const tb = (h) => collapse(texto(h.replace(/<\/(div|li|p|td|th|tr|span|i)>/gi, ' $& · ')).replace(/(\s·\s)+/g, ' · ')).replace(/^· | ·$/g, '');
const blocos = (h) => h.replace(/<\/(div|li|p|tr)>/gi, '\n').replace(/<br\s*\/?>/gi, '\n').replace(/<[^>]+>/g, '').split('\n').map((l) => collapse(l.replace(/&amp;/g, '&'))).filter(Boolean);

// busca de menções em prosa (fora do próprio inst)
function mencoes(subs, inst) {
  return subs.map((sub) => {
    const re = new RegExp(sub.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/\s+/g, '\\s+'), 'g');
    const hits = [...S.matchAll(re)].filter((m) => m.index < inst.start || m.index > inst.end);
    if (!hits.length) fail(`menção não achada: ${sub}`);
    return hits.map((h) => ({ trecho: sub, linha: lineOf(h.index), secao: secs.find((s) => s.start <= h.index && s.end >= h.index)?.attrs.id ?? null }));
  }).flat();
}

// bloco do script de cada INST
function scriptBlock(nn) {
  const marker = JS.indexOf(`/* ===================== INST·${nn}`);
  if (marker < 0) fail(`script INST·${nn}`);
  const end = JS.indexOf('/* =====', marker + 10);
  const code = JS.slice(marker, end);
  return { start: marker, end, code, linha_inicio: jsLine(marker), linha_fim: jsLine(end) - 1, cabecalho: collapse(JS.slice(marker, JS.indexOf('*/', marker) + 2)) };
}
// código com os literais de dados substituídos por marcador
function semLiterais(sb, nomes) {
  let code = sb.code;
  for (const nome of nomes) {
    const at = code.indexOf(`var ${nome}=`);
    if (at < 0) continue;
    const [a, b] = literalSpan(code, at);
    code = code.slice(0, a) + `/* literal ${nome}: ver dados.${nome} */` + code.slice(b);
  }
  return code;
}
const dados = (sb, nomes) => Object.fromEntries(nomes.map((n) => {
  const L = jsLiteral(n, sb.start);
  if (L.start > sb.end) fail(`literal ${n} fora do bloco`);
  return [n, { linha_aprox: L.linha, valor: L.value }];
}));

// controles estáticos (seg) do markup
function controles(inst) {
  const out = [];
  for (const seg of all(inst, (n) => hasClass(n, 'seg') || hasClass(n, 'and-nav'))) {
    const prevLb = (node) => { const sib = kids(node.parent); const i = sib.indexOf(node); for (let j = i - 1; j >= 0; j--) if (hasClass(sib[j], 'seg-lb')) return sib[j]; return null; };
    const prev = prevLb(seg) || prevLb(seg.parent);
    out.push({
      id: seg.attrs.id,
      rotulo: prev ? texto(inner(prev)) : null,
      tipo: 'segmentado (um botão ativo)',
      opcoes: kids(seg).map((b) => ({
        valor: Object.entries(b.attrs).find(([k]) => k.startsWith('data-'))?.[1] ?? null,
        atributo: Object.keys(b.attrs).find((k) => k.startsWith('data-')) ?? null,
        rotulo: texto(innerSkipping(b, (x) => x.tag === 'i')),
        sub: first(b, byTag('i')) ? texto(inner(first(b, byTag('i')))) : null,
        inicial: hasClass(b, 'on'),
      })),
      origem: origem(seg, `div.inst div#${seg.attrs.id}`),
    });
  }
  // grades de chips geradas por script
  for (const g of all(inst, (n) => hasClass(n, 'tr-grid'))) {
    const prev = (() => { const sib = kids(g.parent); const i = sib.indexOf(g); for (let j = i - 1; j >= 0; j--) if (hasClass(sib[j], 'seg-lb')) return sib[j]; return null; })();
    const imediato = kids(g.parent)[kids(g.parent).indexOf(g) - 1];
    out.push({ id: g.attrs.id, rotulo: prev && imediato === prev ? texto(inner(prev)) : null, rotulo_nota: prev && imediato !== prev ? `Sem rótulo próprio; o seg-lb anterior ("${texto(inner(prev))}") pertence ao controle ${kids(g.parent).find((x, i) => i > kids(g.parent).indexOf(prev) && x.attrs?.id)?.attrs.id}.` : null, tipo: 'chips gerados por script (um ativo; o primeiro nasce ativo)', opcoes: null, opcoes_nota: 'ver cenario_padrao / dados', origem: origem(g, `div.inst div#${g.attrs.id}`) });
  }
  return out;
}
function saidasEstaticas(inst) {
  return all(inst, (n) => n.attrs?.id && !hasClass(n, 'seg') && !hasClass(n, 'tr-grid') && n.tag === 'div' && !hasClass(n, 'and-nav'))
    .filter((n) => !n.attrs.id.match(/-(n|r)$/))
    .map((n) => ({ id: n.attrs.id, classe: n.attrs.class || null, vazio_no_markup: !kids(n).length && !texto(inner(n)) }));
}

// campos numéricos (pares number + range)
function campos(inst, sb) {
  return all(inst, byClass('field')).map((f) => {
    const lab = first(f, byClass('field-label'));
    const spans = kids(lab);
    const [num, rng] = all(f, byTag('input'));
    const id = num.attrs.id;
    const m = sb.code.match(new RegExp(`var (\\w+)=(Math\\.round\\()?numOf\\(\\$id\\('${id}'\\),([^,]+),([^,]+),([^)]+)\\)\\)?;`));
    if (!m) fail(`numOf ${id}`);
    const a = num.attrs, r = rng.attrs;
    return {
      id, id_range: rng.attrs.id, variavel_script: m[1],
      rotulo: texto(inner(spans[0])), unidade: texto(inner(spans[1])),
      number: { min: a.min, max: a.max, step: a.step, value: a.value },
      range: { min: r.min, max: r.max, step: r.step, value: r.value },
      script_numOf: { padrao: m[3], min: m[4], max: m[5], arredonda: !!m[2], codigo: m[0] },
      coerencia: {
        faixa_igual_range: a.min === r.min && a.max === r.max && a.step === r.step && a.value === r.value,
        faixa_igual_script: Number(a.min) === Number(m[4]) && Number(a.max) === Number(m[5]) && Number(a.value) === Number(m[3]),
      },
      origem: origem(f, 'div.inst div.field'),
    };
  });
}
function readouts(inst, sb) {
  return all(inst, byClass('ro')).map((ro) => {
    const k = first(ro, byClass('k'));
    const n = first(ro, (x) => x.attrs?.id);
    const id = n.attrs.id;
    const line = sb.code.split('\n').find((l) => l.includes(`$id('${id}')`));
    return { id, rotulo: texto(inner(k)), classe: n.attrs.class, codigo_saida: line ? line.trim() : null, origem: origem(ro, 'div.inst div.readout div.ro') };
  });
}
function calculo(sb) {
  const iu = sb.code.indexOf('function upd(){');
  const antes = sb.code.slice(0, iu);
  const aux = [...antes.matchAll(/function (\w+)\(/g)].map((m) => {
    const a = m.index; const [, b] = literalSpan(antes, antes.indexOf('{', a));
    return { nome: m[1], codigo: antes.slice(a, b) };
  });
  const lines = sb.code.slice(iu).split('\n').slice(1).map((l) => l.trim());
  const linhas = lines.filter((l) => (/^var /.test(l) || /^if\(taxa/.test(l)) && !/numOf\(/.test(l) && !/^var vd=/.test(l));
  return { funcoes_auxiliares: aux, linhas, nota: 'Linhas de cálculo do upd() na ordem do script (sem as leituras numOf, que estão em entradas[].script_numOf, e sem o veredito, em ramos_veredito). Algumas linhas vêm depois das primeiras saídas no script original (ex.: c1–c4 no INST·03).' };
}
function ramos(sb) {
  const up = sb.code.slice(sb.code.indexOf('var vd=$id('));
  const lines = up.split('\n');
  const out = [];
  let cond = null;
  for (let i = 0; i < lines.length; i++) {
    const l = lines[i].trim();
    let m;
    if ((m = l.match(/^(?:\} else )?if\((.*)\)\{$/))) cond = m[1];
    else if (/^\} else \{$/.test(l)) cond = 'else';
    else if ((m = l.match(/^cls='(\w+)';$/))) {
      const t = lines[i + 1].trim().match(/^txt=(.*);$/);
      if (!t) fail('txt após cls');
      out.push({ ordem: out.length + 1, condicao: cond, classe: m[1], codigo_texto: t[1], modelo_legivel: modeloLegivel(t[1]) });
    }
  }
  return out;
}

// execução instrumentada: descobre qual ramo produziu o veredito
function runInstrumented(nn) {
  const sb = scriptBlock(nn);
  let k = 0;
  const code = sb.code.replace(/cls='(\w+)';/g, (m) => `${m}__ramo(${++k});`);
  const helpers = JS.slice(0, JS.indexOf('/* ===================== BARRA'));
  const document = makeDocument();
  const st = { ramo: null };
  const ctx = vm.createContext({ document, window: { addEventListener() {} }, Math, parseFloat, parseInt, isNaN, isFinite, String, Array, Number, __ramo: (r) => { st.ramo = r; } });
  vm.runInContext(helpers + code, ctx);
  const $ = (id) => document.getElementById(id);
  return { $, st, document };
}
function varredura(nn, flds, pontos) {
  const r = runInstrumented(nn);
  const hits = {};
  const vals = flds.map((f) => pontos(f));
  const total = vals.reduce((a, v) => a * v.length, 1);
  const idx = flds.map(() => 0);
  let nanFirst = 0;
  for (let c = 0; c < total; c++) {
    let x = c;
    flds.forEach((f, i) => { idx[i] = x % vals[i].length; x = Math.floor(x / vals[i].length); });
    flds.forEach((f, i) => { r.$(f.id).value = String(vals[i][idx[i]]); });
    r.$(flds[0].id).fire('input');
    hits[r.st.ramo] = (hits[r.st.ramo] || 0) + 1;
  }
  void nanFirst;
  return { combinacoes: total, pontos_por_campo: Object.fromEntries(flds.map((f, i) => [f.id, vals[i]])), ramo_hits: hits };
}
const grid3 = (f) => [...new Set([Number(f.number.min), Number(f.number.value), Number(f.number.max)])];
const grid5 = (f) => {
  const a = Number(f.number.min), b = Number(f.number.max), v = Number(f.number.value);
  return [...new Set([a, v, a + (b - a) * 0.25, a + (b - a) * 0.5, b].map((x) => Math.round(x * 100) / 100))];
};

// ── registro por instrumento ─────────────────────────────────
const KIND = {
  '01': ['explorador', 'Dois seletores segmentados (lente; ordenação) + grade de 10 empresas → texto revelado; nenhuma saída numérica.'],
  '02': ['calculadora', '6 campos numéricos (par number+range) → 6 saídas + veredito de 6 ramos.'],
  '03': ['simulador', '8 campos numéricos → 6 saídas + 4 barras de sensibilidade + veredito de 4 ramos.'],
  '04': ['explorador', '1 seletor (documento) + grade de etapas → texto revelado.'],
  '05': ['explorador', 'Grade de 6 trechos + seletor de vista (3) → texto revelado. Nome "Verificador" fora do enum; mecânica de consulta.'],
  '06': ['explorador', 'Grade de 12 casos → arquétipo e textos revelados. Nome "Classificador" fora do enum; a classificação é tabela fixa, não cálculo.'],
  '07': ['comparador', 'Grade de 5 situações → duas colunas lado a lado (participação × voto) + nota.'],
  '08': ['simulador', '8 campos numéricos → 6 saídas + veredito de 6 ramos (base × choque).'],
  '09': ['explorador', 'Seletor de lente (2) + grade de 8 riscos → texto revelado (16 combinações).'],
  '10': ['comparador', 'Seletor de indicador (5) → tabela das 10 empresas lado a lado + ressalva.'],
  '11': ['explorador', 'Grade de 6 empresas + navegação de 3 blocos → 3 itens revelados. Mesmo verbo do M12 INST 11 ("Andaime de conversa", mapeado como explorador); mecânica confirmada por leitura: consulta, sem cálculo.'],
};
const LITERAIS = {
  '01': ['LENTES', 'EMP', 'ORD'], '04': ['ETAPAS'], '05': ['CASOS'], '06': ['ARQ', 'CASOS'], '07': ['CASOS'],
  '09': ['R'], '10': ['E', 'NOTA', 'TIT'], '11': ['A', 'ORDEM', 'ROT'], '02': [], '03': [], '08': [],
};
const MENCOES = {
  '01': [],
  '02': ['É por isso que o instrumento a seguir se recusa a classificar qualquer coisa sem cruzar pelo menos dois sinais'],
  '03': ['todos são entradas editáveis nos instrumentos deste módulo'],
  '04': [],
  '05': ['As cinco categorias que o instrumento percorre'],
  '06': [],
  '07': [],
  '08': [],
  '09': ['O instrumento abaixo percorre as oito categorias nas duas lentes'],
  '10': ['mais um instrumento comparativo que cobre as quatro restantes por indicador', 'entram pelo instrumento comparativo'],
  '11': ['o Andaime de Tese de Investimento da Aula 08', 'o Andaime da Aula 08 é o instrumento que a constrói', 'usando o Andaime da Aula 08', 'O que o Andaime pergunta antes de assinar', 'o andaime de três teses'],
};
const FONTE = {
  '01': { valor: null, nota: 'Valores e estados societários em texto; o §MAP declara "Estado societário verificado em 2 de agosto de 2026" (p.srcnote L809) e manda confirmar na página de RI e na CVM. Nenhuma fonte por item.' },
  '02': { valor: null, nota: 'Cenário-padrão sem fonte: a própria intro diz "Todos os valores são editáveis: nenhum deles é constante do setor." e o aviso chama o lucro implícito de "aproximação didática".' },
  '03': { valor: 'parcial', declarados: ['Selic 14,25% a.a. (Copom de 17/06/2026, Banco Central do Brasil) e inflação 5,16% (boletim de expectativas de julho de 2026), no box "Âncora das taxas" L1264-1271'], sem_fonte: ['prêmio 0,5 p.p.', 'horizonte 20 anos', 'fluxo ano 1 R$ 900 mi', 'crescimento 1%', 'indenização R$ 1.200 mi', 'probabilidade 70%'], nota: 'O aviso declara "Não é modelo de nenhuma companhia específica e não produz preço-alvo."' },
  '04': { valor: null, nota: 'Tempos por etapa sem fonte; o aviso diz "Os tempos são referência de treino, não regra."' },
  '05': { valor: null, nota: 'O aviso declara: "Todos os trechos são hipotéticos e construídos para o exercício."' },
  '06': { valor: null, nota: 'Classificação das 10 empresas sem fonte por item; nota de AXIA "Verificado em 02·08·2026". Dois casos declarados hipotéticos (h1, h2).' },
  '07': { valor: null, nota: 'O aviso diz "Percentuais aproximados, com data de verificação declarada em cada caso", mas só p1 traz datas no texto (out 2025 – mar 2026); p2-p4 não têm data e p5 é "Caso hipotético".' },
  '08': { valor: null, nota: 'Padrões sem fonte declarada. Observação (não é fonte): 2.100 e 70% reproduzem a tabela hipotética de fontes e usos da Aula 05 (L1756-1763: dívida 1.470, capital 630 — o que o instrumento devolve no padrão) e a heurística 70/30 (05.2); 1,25× coincide com o Ex 04 e o quiz Q07. CFADS 235, custo 7,5%, prazo 15, gatilho 1,35× e choque 10% não aparecem em outro ponto da fonte.' },
  '09': { valor: null, nota: 'Classificação qualitativa; o aviso diz que não estima probabilidade nem severidade.' },
  '10': { valor: null, nota: 'Valores com trimestre declarado por linha (1T26, 2T26, exercício 2025, ano-safra 2025/26); o aviso manda reconstruir na fonte primária antes de uso externo. Sem fonte por célula.' },
  '11': { valor: null, nota: 'Itens derivados "da estrutura verificável de cada companhia" (intro); números repetem as fichas da Aula 07 (1T26 etc.). Sem fonte por item.' },
};

const out = [];
for (const inst of insts) {
  const hd = first(inst, byClass('inst-hd'));
  const id = texto(inner(first(hd, byClass('id'))));
  const nn = id.slice(-2);
  const nome = texto(inner(first(hd, byClass('nm'))));
  const sec = secOf(inst);
  const secMk = texto(inner(first(first(sec, byClass('sec-id')), byTag('b'))));
  const secCode = texto(innerSkipping(first(sec, byClass('sec-id')), (k) => k.tag === 'b')).replace(/\s*·\s*$/, '');
  const intro = first(inst, byClass('inst-intro'));
  const disc = first(inst, byClass('disc'));
  const sib = kids(inst.parent);
  const pos = sib.indexOf(inst);
  const prevH3 = sib.slice(0, pos).reverse().find((x) => x.tag === 'h3');
  const prevP = sib.slice(0, pos).reverse().find((x) => x.tag === 'p' || hasClass(x, 'box') || x.tag === 'ol' || hasClass(x, 'lv') || hasClass(x, 'fx') || hasClass(x, 'dual') || hasClass(x, 'scroll') || hasClass(x, 't333') || hasClass(x, 'soc'));
  const nextH = sib.slice(pos + 1).find((x) => x.tag === 'h3' || x.tag === 'p' || hasClass(x, 'box'));
  const sb = scriptBlock(nn);
  const lit = LITERAIS[nn];
  const numerico = ['02', '03', '08'].includes(nn);
  const item = {
    id: `m13-inst-${nn}`,
    id_fonte: id,
    titulo: nome,
    secao: { section_id: sec.attrs.id, codigo: secCode, rotulo: secMk },
    aula: /^Aula \d\d$/.test(secCode) ? secCode : null,
    fora_de_aula: !/^Aula \d\d$/.test(secCode),
    kind_sugerido: KIND[nn][0],
    mecanica: KIND[nn][1],
    kind_nota: 'Anotação desta extração pela taxonomia (docs/alexandria/instrument-taxonomy.md): mecânica lida no markup e no script, não inferida pelo nome.',
    pergunta: null,
    pergunta_nota: 'A fonte não dá pergunta própria ao instrumento. O que existe é a intro (abaixo) e, em alguns, a "Pergunta de verificação" como saída.',
    intro: { ...txt(inner(intro)), origem: origem(intro, 'div.inst p.inst-intro') },
    aviso: disc ? { ...txt(inner(disc)), origem: origem(disc, 'div.inst p.disc') } : null,
    invocacao: {
      subsecao_anterior: prevH3 ? { numero: texto(inner(first(prevH3, byClass('num')))), titulo: texto(innerSkipping(prevH3, (k) => hasClass(k, 'num'))), linha: prevH3.line } : null,
      bloco_anterior: prevP ? { elemento: `${prevP.tag}${prevP.attrs.class ? '.' + prevP.attrs.class.replace(/ /g, '.') : ''}`, trecho_final: texto(inner(prevP)).slice(-120), linha: prevP.line } : null,
      bloco_seguinte: nextH ? { elemento: `${nextH.tag}${nextH.attrs.class ? '.' + nextH.attrs.class.replace(/ /g, '.') : ''}`, trecho_inicial: texto(inner(nextH)).slice(0, 100), linha: nextH.line } : null,
      mencoes_em_prosa: mencoes(MENCOES[nn], inst),
      linha_inst: inst.line,
      linha_fim_inst: lineOf(inst.end),
    },
    caixas_internas: all(inst, (x) => hasClass(x, 'box')).map((b) => bloco(sec.attrs.id, b)),
    controles: controles(inst),
    containers_de_saida: saidasEstaticas(inst),
    entradas: numerico ? campos(inst, sb) : null,
    saidas: null,
    calculo: numerico ? calculo(sb) : null,
    ramos_veredito: numerico ? ramos(sb) : null,
    barras: null,
    dados: lit.length ? dados(sb, lit) : null,
    script: { linha_inicio: sb.linha_inicio, linha_fim: sb.linha_fim, cabecalho: sb.cabecalho, codigo: numerico ? sb.code.trim() : semLiterais(sb, lit).trim(), codigo_verbatim: numerico, ...(numerico ? {} : { codigo_nota: `NÃO é verbatim inteiro: os literais de dados (${lit.join(', ')}) foram trocados pelo marcador /* literal NOME: ver dados.NOME */; o valor avaliado está em dados. O resto do código é verbatim. O texto-fonte integral do bloco está em L${sb.linha_inicio}–L${sb.linha_fim} do HTML.` }) },
    cenario_padrao: null,
    verificacao: null,
    fonte_dos_numeros: FONTE[nn],
    tolerancias: null,
    tolerancias_nota: 'Nenhuma tolerância declarada na fonte.',
    origem: origem(hd, `section#${sec.attrs.id} div.inst > div.inst-hd`),
    estado_no_codigo: { status: 'não portado', evidencia: 'alexandria-modulo-13-content.ts: `instruments: []` nas 8 aulas (comentário "INSTRUMENTOS: NÃO PORTADOS NESTA WAVE"); nenhuma entrada m13 em alexandria-instrument-calculators.ts; RecursosDoModulo.tsx sem modulo-13; catálogo canônico: "13 | 11 | 0".' },
  };
  if (numerico) item.saidas = readouts(inst, sb);

  // cenário-padrão (script original)
  const r = runScript();
  const cont = item.containers_de_saida.map((c) => c.id);
  item.cenario_padrao = {
    nota: 'Estado após o carregamento, com o script original executado em DOM simulado (m13_lib.runScript).',
    saidas: Object.fromEntries(cont.map((c) => {
      const el = r.$(c);
      return [c, { classe: el.className || null, html: htmlN(el.innerHTML), texto_em_blocos: blocos(el.innerHTML) }];
    })),
  };
  if (numerico) {
    const ri = runInstrumented(nn);
    item.cenario_padrao.ramo_ativo = ri.st.ramo;
  }
  out.push(item);
}

// ── específicos ──────────────────────────────────────────────
const get = (nn) => out.find((x) => x.id === `m13-inst-${nn}`);

// INST·01: rótulos do render e cobertura 3 lentes × 10 empresas
{
  const it = get('01'); const sb = scriptBlock('01');
  const perg = [...sb.code.matchAll(/lente==='(\w+)'\?'([^']+)'|:\s*\n?\s*'(Qual pergunta[^']+)'/g)];
  it.rotulos_render = {
    painel_lente: { yr: 'Lente ativa', titulos: vm.runInNewContext(`(${sb.code.match(/var t=(\{[^}]+\})\[lente\]/)[1]})`) },
    painel_item: { yr_prefixo: vm.runInNewContext(`(${sb.code.match(/var vl=(\{[^}]+\})\[lente\]/)[1]})`), lg: 'Pergunta de verificação' },
    perguntas_de_verificacao: {
      ctrl: sb.code.match(/lente==='ctrl'\?'([^']+)'/)[1],
      cap: sb.code.match(/lente==='cap'\?'([^']+)'/)[1],
      lac: sb.code.match(/\n\s*'(Qual pergunta específica[^']+)'\)/)[1],
    },
  };
  void perg;
  const r = runScript();
  let ok = 0, tot = 0; const vistos = new Set();
  for (const lb of r.$('pn-seg').querySelectorAll('button')) {
    lb.click();
    for (const ob of r.$('pn-ord').querySelectorAll('button')) {
      ob.click();
      for (const b of r.$('pn-grid').querySelectorAll('button')) { b.click(); tot++; const t = texto(r.$('pn-item').innerHTML); if (t.length > 50) ok++; vistos.add(lb.getAttribute('data-v') + b.getAttribute('data-e')); }
    }
  }
  it.verificacao = { combinacoes_clicadas: tot, paineis_nao_vazios: ok, pares_lente_empresa_distintos: vistos.size, esperado: '3 lentes × 10 empresas = 30 pares' };
}
// INST·04
{
  const it = get('04'); const r = runScript(); let ok = 0, tot = 0;
  for (const d of r.$('rt-seg').querySelectorAll('button')) { d.click(); for (const b of r.$('rt-grid').querySelectorAll('button')) { b.click(); tot++; if (texto(r.$('rt-item').innerHTML).length > 50) ok++; } }
  it.rotulos_render = { yr_documento: { rel: 'Release trimestral', fre: 'Formulário de Referência' }, lg: 'Esta etapa precisa deixar respondido' };
  it.verificacao = { combinacoes_clicadas: tot, paineis_nao_vazios: ok, esperado: '7 etapas (release) + 8 (Formulário) = 15' };
}
// INST·05
{
  const it = get('05'); const sb = scriptBlock('05'); const r = runScript(); let ok = 0, tot = 0;
  for (const v of r.$('lc-seg').querySelectorAll('button')) { v.click(); for (const b of r.$('lc-grid').querySelectorAll('button')) { b.click(); tot++; if (texto(r.$('lc-item').innerHTML).length > 50) ok++; } }
  it.rotulos_render = { titulos_vista: vm.runInNewContext(`(${sb.code.match(/var titulo=(\{[^}]+\})\[l\]/)[1]})`), lg: 'Trecho hipotético' };
  it.verificacao = { combinacoes_clicadas: tot, paineis_nao_vazios: ok, esperado: '6 trechos × 3 vistas = 18', nota: 'A prosa após o instrumento (L1469) fala em "cinco categorias que o instrumento percorre" e numa "sexta" (caixa restrito); o instrumento tem os seis trechos, g6 incluído.' };
}
// INST·06
{
  const it = get('06'); const sb = scriptBlock('06'); const r = runScript(); let ok = 0, tot = 0; const arqs = new Set();
  for (const b of r.$('ct-grid').querySelectorAll('button')) { b.click(); tot++; if (texto(r.$('ct-out').innerHTML).length > 50) ok++; arqs.add(texto(r.$('ct-item').querySelector('.ti').innerHTML)); }
  const fixo = sb.code.match(/<span class="ok2">O que não concluir<\/span>([^']+)<\/div>'/);
  it.rotulos_render = { yr: 'Arquétipo identificado', dec_prefixo: 'Quem decide de fato.', lg: 'Nota da companhia', cartoes: ['Comportamento sob estresse', 'Pergunta de verificação', 'O que não concluir'], texto_fixo_o_que_nao_concluir: fixo[1] };
  it.verificacao = { casos_clicados: tot, saidas_nao_vazias: ok, arquetipos_alcancados: [...arqs], esperado: '"os seis arquétipos são todos alcançáveis" (intro)' };
}
// INST·07
{
  const it = get('07'); const r = runScript(); let ok = 0, tot = 0;
  for (const b of r.$('pv-grid').querySelectorAll('button')) { b.click(); tot++; if (texto(r.$('pv-note').innerHTML).length > 50 && r.$('pv-dual').querySelectorAll('div').length) ok++; }
  it.rotulos_render = { yr: 'Mecanismo e consequência' };
  it.verificacao = { casos_clicados: tot, saidas_nao_vazias: ok, esperado: '"Cinco situações" (intro)' };
}
// INST·09
{
  const it = get('09'); const r = runScript(); let ok = 0, tot = 0;
  for (const l of r.$('rk-seg').querySelectorAll('button')) { l.click(); for (const b of r.$('rk-grid').querySelectorAll('button')) { b.click(); tot++; if (texto(r.$('rk-item').innerHTML).length > 50) ok++; } }
  it.rotulos_render = { yr_lente: { emp: 'Empresa aberta', prj: 'Sociedade de projeto' }, ti_prefixo: "'Risco '+esc(e.n.toLowerCase())", cartoes: ['Mitigação', 'Indicador de alerta'] };
  it.verificacao = { combinacoes_clicadas: tot, paineis_nao_vazios: ok, esperado: '"oito riscos por duas lentes, dezesseis combinações, nenhuma vazia" (intro)' };
}
// INST·10
{
  const it = get('10'); const r = runScript(); let tot = 0, ok = 0;
  for (const b of r.$('cp-seg').querySelectorAll('button')) { b.click(); const rows = blocos(r.$('cp-tab').innerHTML); tot++; if (rows.length === 11) ok++; }
  const E = it.dados.E.valor; let cel = 0, celOk = 0;
  for (const e of E) for (const k of ['ctrl', 'seg', 'alav', 'ind', 'ev']) { cel++; if (e[k][0] && e[k][1]) celOk++; }
  it.rotulos_render = { cabecalho_empresa: 'Empresa', yr_nota: 'Ressalva de comparabilidade' };
  it.verificacao = { indicadores_clicados: tot, tabelas_com_10_linhas: ok, celulas: cel, celulas_com_valor_e_ressalva: celOk, esperado: '"dez empresas por cinco indicadores" (intro)' };
}
// INST·11
{
  const it = get('11'); const r = runScript(); let tot = 0, itens = 0;
  for (const e of r.$('an-grid').querySelectorAll('button')) { e.click(); for (const b of r.$('an-nav').querySelectorAll('button')) { b.click(); tot++; itens += r.$('an-bd').querySelectorAll('li').length; } }
  it.rotulos_render = { br: 'Como ler este bloco', no: 'O que este bloco não é', nota: 'Rótulos por bloco em dados.ROT (cl, a, c, br, no).' };
  it.verificacao = { combinacoes_clicadas: tot, itens_renderizados: itens, esperado: '6 empresas × 3 blocos × 3 itens = 54' };
}
// INST·02 / 03 / 08: varredura de ramos
{
  const it = get('02');
  it.verificacao = { ...varredura('02', it.entradas, grid5), nota: 'Varredura por grade (5 pontos por campo: mín, padrão, 25%, 50%, máx) com o script original instrumentado só para registrar o ramo (`__ramo(k)` após cada `cls=`). Indica ramos alcançáveis; não é prova de cobertura total.' };
  const i3 = get('03');
  const bars = all(insts[2], byClass('bar-row'));
  i3.barras = bars.map((b) => {
    const fill = first(b, byClass('bar-fill')); const vl = first(b, byClass('vl'));
    const sb = scriptBlock('03');
    return { rotulo: texto(inner(first(b, byClass('lb')))), id_barra: fill.attrs.id, id_valor: vl.attrs.id, codigo: sb.code.split('\n').find((l) => l.includes(`$id('${fill.attrs.id}')`)).trim(), origem: origem(b, 'div.inst div.bars div.bar-row') };
  });
  i3.verificacao = { ...varredura('03', i3.entradas, grid3), nota: 'Varredura por grade (3 pontos por campo: mín, padrão, máx), script original instrumentado só para registrar o ramo.' };
  const i8 = get('08');
  i8.verificacao = { ...varredura('08', i8.entradas, grid3), nota: 'Varredura por grade (3 pontos por campo: mín, padrão, máx), script original instrumentado só para registrar o ramo.' };
}

// ── divergências ─────────────────────────────────────────────
const divergencias = [
  {
    id: 'div-m13-taxa-real-8-6-vs-8-7', eixo: 'fonte × fonte', severidade: 'alta',
    leitura_a: 'Aula 02, fórmula "Conversão entre taxa nominal e taxa real" (L1214-1218): "a taxa real implícita é de aproximadamente 8,7% ao ano — não 9,09%" e "a diferença […] passa de meio ponto percentual".',
    leitura_b: 'INST·03 box "Âncora das taxas" (L1269): "≈ 8,6%"; Ex 03: "≈ 8,64%" e "um erro de cerca de 0,45 ponto percentual"; o script calcula (1,1425/1,0516)−1 = 8,64%. 9,09 − 8,64 = 0,45 < 0,5.',
    decisao: null,
  },
  {
    id: 'div-m13-riscos-seis-vs-oito', eixo: 'fonte × fonte', severidade: 'media',
    leitura_a: 'Aula 06, h2: "Seis categorias de risco, e a sexta é a que o currículo não nomeia"; lede: cinco riscos + dimensão socioambiental, omitindo crédito; INST·09 (cred): "A sexta categoria".',
    leitura_b: 'Aula 06 (L1954) e INST·09: "oito categorias"/"oito riscos" — hidrológico, regulatório, cambial, descasamento, operacional, construção, mercado e recontratação, crédito (sem socioambiental). O §Lex (Família 8) tem sete termos de risco (inclui socioambiental; não tem construção nem mercado).',
    decisao: null,
  },
  {
    id: 'div-m13-inst06-h2-mecanismo', eixo: 'fonte × fonte', severidade: 'media',
    leitura_a: 'INST·06 caso h2 "Hipotética · 68% do total, 35% do voto" → arquétipo "Estatal com voto limitado", "construído sobre o padrão real da operadora nuclear".',
    leitura_b: 'INST·07 p1 e Aula 04: na operadora nuclear o mecanismo é "classes de ações com direitos distintos, somadas a exigência setorial de controle"; "limitação estatutária de voto" é o mecanismo da AXIA (INST·07 p2). A classificação do h2 usa o arquétipo do outro mecanismo.',
    decisao: null,
  },
  {
    id: 'div-m13-axia-estatal', eixo: 'fonte × fonte', severidade: 'baixa',
    leitura_a: 'Arquétipo da AXIA: "Estatal com voto limitado" (§MAP.1, ficha, INST·01, INST·06).',
    leitura_b: '§MAP.1 (L851-853): a AXIA "não é estatal nem é uma privada comum"; ficha: "Companhia sem controlador único".',
    decisao: null,
  },
  {
    id: 'div-m13-inst07-datas', eixo: 'fonte × fonte', severidade: 'baixa',
    leitura_a: 'INST·07 aviso: "Percentuais aproximados, com data de verificação declarada em cada caso."',
    leitura_b: 'Só o caso p1 tem datas; p2, p3 e p4 não declaram data; p5 é hipotético.',
    decisao: null,
  },
  {
    id: 'div-m13-inst05-cinco-seis', eixo: 'fonte × fonte', severidade: 'baixa',
    leitura_a: 'Aula 03 (L1469): "As cinco categorias que o instrumento percorre […] Há uma sexta […] caixa restrito".',
    leitura_b: 'INST·05 percorre seis trechos (g6 = caixa restrito por sociedade de projeto).',
    decisao: null,
  },
  {
    id: 'div-m13-auren-alavancagem', eixo: 'fonte × fonte', severidade: 'baixa',
    leitura_a: 'INST·10 (Auren): "≈ 5,2× · a mais alta entre as abertas do rol".',
    leitura_b: 'INST·10/ficha (Raízen, RAIZ4): "≈ 5,2×" também; no §MAP a Raízen está no estado "Reestruturação", não "Aberta" — a frase só se sustenta com essa leitura de "abertas".',
    decisao: null,
  },
  {
    id: 'div-m13-numof-vazio', eixo: 'comportamento do script', severidade: 'baixa',
    leitura_a: 'Durante a digitação (evento input), campo vazio ou inválido vale o PADRÃO do campo (`numOf(el, def, …)`).',
    leitura_b: 'No evento change, campo vazio vira o MÍNIMO (`pair`: `if(isNaN(v))v=mn`). O mesmo campo vazio produz dois valores conforme o evento. Resíduo do original; não corrigido.',
    decisao: null,
  },
  {
    id: 'div-m13-instrumentos-codigo', eixo: 'fonte × código × catálogo', severidade: 'alta',
    leitura_a: 'Fonte: 11 instrumentos (INST·01 no §MAP; Aulas 03 e 04 com dois cada).',
    leitura_b: 'Código: 0 portados (`instruments: []`, sem calculadora, sem Recursos do Módulo). Catálogo canônico: "13 | 11 | 0". Concordam entre si; divergem da fonte.',
    decisao: null,
  },
];

writeJSON('instrumentos.json', {
  schema: 'alexandria-v2/extraction/instrumentos@1',
  modulo: 'M13',
  grupo: 'instrumentos',
  fonte: { arquivo: SRC, linhas_total: LINES.length - (S.endsWith('\n') ? 1 : 0), bytes: Buffer.byteLength(S, 'utf8'), script: { linha_inicio: first(DOC, byTag('script')).line, linha_fim: lineOf(first(DOC, byTag('script')).end) } },
  gerado_em: '2026-09-17',
  metodo: 'Markup por parser próprio; dados por avaliação em vm dos literais `var NOME=[…]` de cada bloco /* INST·NN */; fórmulas, ramos e rótulos copiados do código por programa (`codigo`, `codigo_texto`); `modelo_legivel` é conversão mecânica da concatenação JS ("…{expr}…"). Cenário-padrão, cobertura cartesiana e alcance de ramos medidos executando o script original em DOM simulado (a única alteração é o marcador `__ramo(k)` inserido após cada `cls=`, só na varredura).',
  convencoes: { linha_aprox: 'linha 1-based no HTML-fonte', null: 'ausência na fonte; cada null tem nota ao lado', portado: '"portado" / "não portado" / "divergente" contra src/lib/data' },
  instrumentos: out,
  divergencias,
  contagens: {
    instrumentos: out.length,
    fora_de_aula: out.filter((x) => x.fora_de_aula).length,
    de_aula: out.filter((x) => !x.fora_de_aula).length,
    por_aula: out.reduce((a, x) => ((a[x.aula ?? x.secao.codigo] = (a[x.aula ?? x.secao.codigo] || 0) + 1), a), {}),
    por_kind_sugerido: out.reduce((a, x) => ((a[x.kind_sugerido] = (a[x.kind_sugerido] || 0) + 1), a), {}),
    numericos: 3,
    campos_numericos: out.reduce((a, x) => a + (x.entradas?.length || 0), 0),
    saidas_numericas: out.reduce((a, x) => a + (x.saidas?.length || 0), 0),
    ramos_de_veredito: out.reduce((a, x) => a + (x.ramos_veredito?.length || 0), 0),
    portados: 0, nao_portados: out.length, divergentes: 0,
  },
});
console.log('instrumentos.json ok');
