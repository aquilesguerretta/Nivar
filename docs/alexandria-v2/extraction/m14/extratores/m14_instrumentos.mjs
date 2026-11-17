// Extrator deterministico dos 10 instrumentos do M14 -> instrumentos.json
// Markup: arvore da fonte. Formulas, ramos e dados: fatias verbatim do
// <script>. Cenario-padrao e textos de leitura: execucao do script ORIGINAL
// num DOM simulado (m14_dom.mjs), sem reescrever a logica.
import {
  FONTE, ROOT, html, find, findAll, kids, sel, inner, texto, inline, ht, origem, line, lineOf, hasCls,
  blocos, readRepo, write, pad, HOJE, lineText, cobertura,
} from './m14_lib.mjs';
import { executa, estado, clica, digita, SCRIPT } from './m14_dom.mjs';

const S0 = html.indexOf('<script>') + '<script>'.length;

// ----------------------------------------------------------- script
const marcas = [...html.matchAll(/\/\* =+ (INST·\d\d) — ([^=]*?) =+ \*\//g)].map((m) => ({ id: m[1], nome: m[2].trim(), idx: m.index }));
const fimScript = html.indexOf('/* ===================== QUIZ');
function blocoScript(id) {
  const i = marcas.findIndex((m) => m.id === id);
  const a = marcas[i].idx;
  const b = i + 1 < marcas.length ? marcas[i + 1].idx : fimScript;
  const code = html.slice(a, b).replace(/\s+$/, '');
  return { comentario: marcas[i].nome, code, linha_ini: lineOf(a), linha_fim: lineOf(a + code.length) };
}
// casa chave/colchete ignorando strings
function fechaEm(src, abre) {
  const par = { '{': '}', '[': ']', '(': ')' };
  const stack = [];
  for (let i = abre; i < src.length; i++) {
    const c = src[i];
    if (c === "'" || c === '"') { const q = c; i++; while (i < src.length && src[i] !== q) { if (src[i] === '\\') i++; i++; } continue; }
    if (c === '/' && src[i + 1] === '*') { i = src.indexOf('*/', i) + 1; continue; }
    if (par[c]) stack.push(par[c]);
    else if (c === '}' || c === ']' || c === ')') { stack.pop(); if (!stack.length) return i; }
  }
  return -1;
}
// constantes de dados declaradas no IIFE (var X={...} / var X=[...])
function constantes(code, baseIdx) {
  const out = {};
  for (const m of code.matchAll(/var ([A-Z][A-Z0-9]*)=([\[{])/g)) {
    const ab = m.index + m[0].length - 1;
    const fe = fechaEm(code, ab);
    const lit = code.slice(ab, fe + 1);
    // eslint-disable-next-line no-new-func
    out[m[1]] = { valor: new Function(`return ${lit};`)(), linha_ini: lineOf(baseIdx + ab), linha_fim: lineOf(baseIdx + fe) };
  }
  return out;
}
// cadeia de ramos do veredito
function ramos(code, baseIdx) {
  const out = [];
  const re = /(else if|if)\s*\(/g;
  const inicio = code.search(/var v=\$id\('[a-z]+-vd'\)/);
  if (inicio < 0) return out;
  const limite = code.indexOf('v.className=', inicio);
  if (!/\bif\s*\(/.test(code.slice(inicio, limite))) return out;
  re.lastIndex = inicio;
  let m;
  let pos = inicio;
  while ((m = re.exec(code))) {
    const pa = m.index + m[0].length - 1;
    const pf = fechaEm(code, pa);
    const cond = code.slice(pa + 1, pf);
    const ab = code.indexOf('{', pf);
    const fe = fechaEm(code, ab);
    out.push({ tipo: m[1], condicao_literal: `${m[1]}(${cond})`, corpo: code.slice(ab + 1, fe), linha_aprox: lineOf(baseIdx + m.index), linha_fim: lineOf(baseIdx + fe) });
    pos = fe;
    re.lastIndex = fe;
    const resto = code.slice(fe + 1);
    const els = resto.match(/^\s*else\s*\{/);
    if (els) {
      const ab2 = fe + 1 + els[0].length - 1;
      const fe2 = fechaEm(code, ab2);
      out.push({ tipo: 'else', condicao_literal: 'else', corpo: code.slice(ab2 + 1, fe2), linha_aprox: lineOf(baseIdx + fe + 1 + els.index), linha_fim: lineOf(baseIdx + fe2) });
      break;
    }
    if (!/^\s*else if/.test(resto)) break;
  }
  return out.map((r) => {
    const cls = r.corpo.match(/cls='([a-z]*)'/);
    const t = r.corpo.match(/t=([\s\S]*?);\s*$/);
    const frags = [...(t ? t[1] : '').matchAll(/'((?:[^'\\]|\\.)*)'/g)].map((x) => x[1]);
    return { condicao_literal: r.condicao_literal, classe_veredito: cls ? cls[1] : null, expressao_texto_verbatim: t ? t[1].replace(/\n\s+/g, ' ') : null, fragmentos_literais: frags, rotulo: texto(frags[0] || ''), linha_aprox: r.linha_aprox, linha_fim: r.linha_fim };
  });
}
const linhasCom = (code, baseIdx, re) => code.split('\n').map((l, i) => ({ l, i })).filter(({ l }) => re.test(l))
  .map(({ l }) => ({ codigo: l.trim(), linha_aprox: lineOf(baseIdx + code.indexOf(l)) }));

// ----------------------------------------------------------- markup
const insts = findAll(ROOT, sel('div', 'inst'));
const secoes = findAll(ROOT, (n) => n.tag === 'section');
const secDe = (n) => { let p = n.parent; while (p && p.tag !== 'section') p = p.parent; return p; };

function markup(n) {
  const bd = find(n, sel('div', 'inst-bd'));
  const grupos = [];
  let rotuloPend = null;
  walkOrdem(bd, (c) => {
    if (c.tag === 'div' && hasCls(c, 'seg-lb')) rotuloPend = { texto: texto(inner(c)), linha: line(c) };
    if (c.tag === 'div' && hasCls(c, 'seg')) {
      grupos.push({ id: c.attrs.id, rotulo: rotuloPend ? rotuloPend.texto : null, rotulo_nota: rotuloPend ? null : 'sem div.seg-lb própria (segunda linha do grupo anterior)', opcoes: findAll(c, sel('button')).map((b) => {
        const dk = Object.keys(b.attrs).find((k) => k.startsWith('data-'));
        return { atributo: dk, valor: b.attrs[dk], rotulo: texto(inner(b)), ativo_no_markup: hasCls(b, 'on') };
      }), linha_aprox: line(c) });
      rotuloPend = null;
    }
  });
  const campos = findAll(bd, sel('div', 'field')).map((f) => {
    const lb = find(f, sel('div', 'field-label'));
    const spans = kids(lb, sel('span'));
    const num = find(f, (c) => c.tag === 'input' && c.attrs.type === 'number');
    const rng = find(f, (c) => c.tag === 'input' && c.attrs.type === 'range');
    const a = (x, k) => (x && x.attrs[k] !== undefined ? Number(x.attrs[k]) : null);
    const faixaIgual = num && rng && ['min', 'max', 'step', 'value'].every((k) => num.attrs[k] === rng.attrs[k]);
    return {
      id: num?.attrs.id ?? null, id_range: rng?.attrs.id ?? null,
      rotulo: texto(inner(spans[0])), unidade: spans[1] ? texto(inner(spans[1])) : null,
      tipo_input: rng ? 'number + range gêmeo' : 'number',
      padrao: a(num, 'value'), min: a(num, 'min'), max: a(num, 'max'), step: a(num, 'step'),
      padrao_literal: num?.attrs.value ?? null,
      range_igual_ao_number: faixaIgual,
      origem: origem(`input#${num?.attrs.id}`, f, `${texto(inner(spans[0]))} ${spans[1] ? texto(inner(spans[1])) : ''}`),
    };
  });
  const saidas = findAll(bd, sel('div', 'ro')).map((r) => {
    const k = find(r, sel('div', 'k'));
    const v = find(r, (c) => c.tag === 'div' && hasCls(c, 'n'));
    return { id: v.attrs.id ?? null, rotulo: texto(inner(k)), classe: v.attrs.class, valor_markup: texto(inner(v)), linha_aprox: line(r) };
  });
  const conteineres = findAll(bd, (c) => c.attrs.id && !grupos.some((g) => g.id === c.attrs.id) && !campos.some((f) => f.id === c.attrs.id || f.id_range === c.attrs.id) && !saidas.some((s) => s.id === c.attrs.id))
    .map((c) => ({ id: c.attrs.id, classe: c.attrs.class ?? null, papel: hasCls(c, 'verdict') ? 'veredito' : 'painel/desenho gerado pelo script', valor_markup: texto(inner(c)) || null, linha_aprox: line(c) }));
  const intro = find(bd, sel('p', 'inst-intro'));
  const disc = find(bd, sel('p', 'disc'));
  return { grupos, campos, saidas, conteineres, intro: { ...ht(intro), origem: origem('p.inst-intro', intro) }, disc: disc ? { ...ht(disc), origem: origem('p.disc', disc) } : null };
}
function walkOrdem(n, fn) { for (const c of n.children || []) { fn(c); walkOrdem(c, fn); } }

// posicao no texto
function posicao(n) {
  const s = secDe(n);
  const wrap = find(s, sel('div', 'wrap'));
  const bl = blocos(wrap, 'x', `section#${s.attrs.id}`);
  const idf = texto(inner(find(n, sel('span', 'id'))));
  const k = bl.findIndex((b) => b.tipo === 'instrumento_ref' && b.id_fonte === idf);
  let h3 = null;
  for (let j = k; j >= 0; j--) if (bl[j].tipo === 'titulo' && bl[j].nivel === 'h3') { h3 = bl[j]; break; }
  const resumo = (b) => b ? { tipo: b.tipo, rotulo: b.rotulo ?? null, trecho_inicial: (b.texto ?? (b.eq ? `${b.nome} ${b.eq}` : null) ?? b.paragrafos?.[0]?.texto ?? b.itens?.[0]?.texto ?? (b.cabecalho ? texto(b.cabecalho.join(' ')) : '') ?? '').slice(0, 90), linha_aprox: b.origem?.linha_aprox ?? b.linha_aprox } : null;
  const mencoesSec = bl.filter((b, j) => j !== k && /instrumento/i.test(JSON.stringify([b.texto, b.paragrafos, b.itens])))
    .map((b) => {
      const t = [b.texto, ...(b.paragrafos || []).map((p) => p.texto)].filter(Boolean).join(' ');
      const frase = (t.match(/[^.]*instrumento[^.]*\./i) || [t.slice(0, 120)])[0].trim();
      return { tipo: b.tipo, rotulo: b.rotulo ?? null, frase, linha_aprox: b.origem?.linha_aprox ?? b.linha_aprox };
    });
  const ocorrenciasId = html.split('\n').map((l, i) => ({ l, n: i + 1 })).filter(({ l, n: ln }) => l.includes(idf) && ln !== line(n) + 2)
    .map(({ l, n: ln }) => ({ linha: ln, onde: ln >= lineOf(S0) ? 'script' : 'markup', trecho: texto(l).slice(0, 140) }));
  const eAula = /^a\d\d$/.test(s.attrs.id);
  return {
    secao_id: s.attrs.id,
    aula_fonte: eAula ? `Aula ${s.attrs.id.slice(1)}` : null,
    aula_codigo: eAula ? `aula-14-${s.attrs.id.slice(1)}` : null,
    fora_de_aula: !eAula,
    subsecao: h3 ? { numero: h3.numero, titulo: h3.titulo_sem_numero, linha_aprox: h3.origem.linha_aprox } : null,
    bloco_anterior: resumo(bl[k - 1]),
    bloco_seguinte: resumo(bl[k + 1]),
    mencoes_a_instrumento_na_mesma_secao: mencoesSec,
    outras_ocorrencias_do_id_na_fonte: ocorrenciasId,
    linha_do_instrumento: line(n),
    formulas_exibidas_na_secao: bl.filter((b) => b.tipo === 'formula').map((b) => ({ nome: b.nome, eq: b.eq, desc: b.desc, antes_do_instrumento: b.origem.linha_aprox < line(n), linha_aprox: b.origem.linha_aprox })),
  };
}

// ------------------------------------------------------- execucao
const ENV0 = executa();
const idsDe = (mk) => [...mk.saidas.map((s) => s.id), ...mk.conteineres.map((c) => c.id)];
function simples(e) { const o = {}; for (const [k, v] of Object.entries(e)) o[k] = v ? v.valor : null; return o; }
function cenarioPadrao(mk) {
  const env = executa();
  const e = estado(env, idsDe(mk));
  return { entradas: Object.fromEntries(mk.campos.map((f) => [f.id, f.padrao])), selecoes: Object.fromEntries(mk.grupos.map((g) => [g.id, (g.opcoes.find((o) => o.ativo_no_markup) || {}).valor ?? null])), saidas: simples(e), classe_veredito: Object.values(e).find((x) => x && /verdict/.test(x.classe || ''))?.classe ?? null, via_veredito: Object.values(e).find((x) => x && /verdict/.test(x.classe || ''))?.via ?? null };
}
function varreSelecoes(mk, grupos) {
  // produto cartesiano das selecoes (numeros no padrao)
  const combos = grupos.reduce((acc, g) => acc.flatMap((c) => g.opcoes.map((o) => [...c, [g, o]])), [[]]);
  return combos.map((c) => {
    const env = executa();
    for (const [g, o] of c) clica(env, g.id, o.atributo, o.valor);
    const e = estado(env, idsDe(mk));
    const vd = Object.values(e).find((x) => x && /verdict/.test(x.classe || ''));
    return { selecao: Object.fromEntries(c.map(([g, o]) => [g.id, o.valor])), saidas: simples(e), classe_veredito: vd?.classe ?? null };
  });
}
function exemploPorRamo(mk, ramosLista) {
  // grade grossa: cada campo em min, padrao, max e pontos intermediarios; cada selecao
  const achados = {};
  const valores = mk.campos.map((f) => [...new Set([f.min, f.padrao, f.max, f.min + (f.max - f.min) * 0.25, f.min + (f.max - f.min) * 0.5, f.min + (f.max - f.min) * 0.75, f.padrao * 0.5, f.padrao * 0.8, f.padrao * 1.5].filter((v) => v >= f.min && v <= f.max).map((v) => Math.round(v / f.step) * f.step).map((v) => +v.toFixed(4)))]);
  const selCombos = mk.grupos.reduce((acc, g) => acc.flatMap((c) => g.opcoes.map((o) => [...c, [g, o]])), [[]]);
  const numCombos = valores.reduce((acc, vs) => acc.flatMap((c) => vs.map((v) => [...c, v])), [[]]);
  const vdId = mk.conteineres.find((c) => c.papel === 'veredito')?.id;
  const env = executa();
  outer: for (const sc of selCombos) {
    for (const [g, o] of sc) clica(env, g.id, o.atributo, o.valor);
    for (const nc of numCombos) {
      mk.campos.forEach((f, i) => digita(env, f.id, nc[i]));
      const v = estado(env, [vdId])[vdId].valor;
      const r = ramosLista.find((x) => x.rotulo && texto(v).startsWith(x.rotulo));
      const key = r ? r.condicao_literal : '??';
      if (!achados[key]) achados[key] = { selecao: Object.fromEntries(sc.map(([g, o]) => [g.id, o.valor])), entradas: Object.fromEntries(mk.campos.map((f, i) => [f.id, nc[i]])), veredito: v };
      if (Object.keys(achados).length >= ramosLista.length) break outer;
    }
  }
  const faltam = ramosLista.map((x) => x.condicao_literal).filter((c) => !achados[c]);
  if (faltam.length) achados.__ramos_sem_exemplo_na_grade = faltam;
  return achados;
}

// ------------------------------------------------------ comparacao codigo
const calc = readRepo('src/lib/data/alexandria-instrument-calculators.ts');
const cont14 = readRepo('src/lib/data/alexandria-modulo-14-content.ts');
function comparaCodigo(mk, titulo) {
  const ids = [...mk.campos.map((f) => f.id), ...mk.saidas.map((s) => s.id)].filter(Boolean);
  const achouCalc = ids.filter((i) => calc.includes(i));
  const achouTitulo = calc.includes(titulo) || cont14.includes(titulo);
  return {
    estado: achouCalc.length || achouTitulo ? 'divergente' : 'não portado',
    evidencia: {
      MODULO_14_INSTRUMENTOS: /MODULO_14_INSTRUMENTOS: Instrument\[\] = \[\];/.test(cont14) ? '[] (vazio)' : 'não vazio',
      instruments_nas_aulas: (cont14.match(/instruments: \[\],/g) || []).length + ' de 8 aulas com instruments: []',
      ids_da_fonte_em_calculators: achouCalc,
      titulo_em_codigo: achouTitulo,
    },
  };
}

// ------------------------------------------------------- kind (anotacao)
const KIND = {
  'INST·01': ['explorador', 'seleção de dimensão reordena 6 chips; seleção de rota revela texto (fluxo de 5 camadas + 3 cartões). Zero campo numérico. Mesmo prefixo "Mapa" do M05/M06 (taxonomia): aqui é consulta discreta, como o M06.'],
  'INST·02': ['calculadora', '4 campos numéricos (range gêmeo) → 5 saídas + veredito textual por faixa.'],
  'INST·03': ['simulador', '1 seleção de perfil + 3 campos (range) → 4 saídas (3 textuais) + barras + veredito. Nome "Régua" fora do enum; mecânica campo→readout→veredito.'],
  'INST·04': ['comparador', '2 grupos de seleção (7 dimensões) → tabela das 3 rotas lado a lado + ressalva. Zero campo numérico.'],
  'INST·05': ['calculadora', '2 seleções (base, estado) + 3 campos (range) → 4 saídas + veredito. Mecanicamente igual aos simulador; o nome "Calculadora" decide por convenção (taxonomia, regra 4).'],
  'INST·06': ['simulador', '4 campos (range) → 5 saídas + barras + veredito.'],
  'INST·07': ['simulador', '1 seleção + 4 campos (range) → 4 saídas + veredito. Nome "Régua" fora do enum.'],
  'INST·08': ['simulador', '2 seleções + 3 campos (range) → 5 saídas + veredito. Nome "Régua" fora do enum.'],
  'INST·09': ['explorador', '2 seleções (5 insumos × 7 destinos) → 4 readouts textuais + veredito textual. Zero campo numérico. Nome "Classificador" fora do enum.'],
  'INST·10': ['explorador', 'filtro por tipo + seleção de 1 de 12 enunciados → painel textual. A prosa pede "decida antes de clicar", mas não há campo para o learner produzir a resposta: não é `reconstrutor` (que exige produção antes da correção). Nome "Verificador" fora do enum; decisão de kind fica para a FOUNDRY.'],
};

// ------------------------------------------------------- fonte/tolerancia
const FONTE_NUM = {
  'INST·01': { fonte: null, nota: 'Nenhuma fonte declarada para a tabela ROTAS (texto descritivo, sem número).' },
  'INST·02': { fonte: null, nota: 'Padrões (6,20; 4,15; 11,5; 8,0) sem fonte declarada. O p.disc manda usar "a pesquisa de preços da própria agência para a sua praça, ou nota fiscal, com data" e medir o rendimento no mesmo veículo.' },
  'INST·03': { fonte: null, nota: 'O p.disc declara que "as faixas usadas aqui são ilustrativas de perfil, não de qualquer planta específica" e que as remunerações por kg de ATR são entradas editáveis a reconstruir "com data e fonte".' },
  'INST·04': { fonte: null, nota: 'Tabela qualitativa, sem número nem fonte.' },
  'INST·05': { fonte: 'Script: "Referência verificada em 2 de agosto de 2026 para este estado" + textos BASES[].not (citam a Lei nº 14.993/2024 e "resolução do conselho").', nota: 'O volume padrão (60 bilhões de litros) não tem fonte; o p.disc diz que o volume "está nas séries da agência" e o percentual "na resolução do conselho", a declarar pelo usuário.' },
  'INST·06': { fonte: null, nota: 'O p.disc declara: "Nenhum número aqui descreve nenhuma unidade específica". Os padrões (80 MW, 210 dias, 55%, 88%) são os mesmos do Ex 02, da Q04 do quiz e do enunciado e7 do INST·10.' },
  'INST·07': { fonte: null, nota: 'O p.disc declara que os parâmetros logísticos por rota "são ilustrativos de ordem de grandeza ... não são benchmark de mercado nem devem ser citados como tal". PCI fixo de 36 MJ/Nm³ no script (comentário "a 36 MJ/Nm3"), sem fonte.' },
  'INST·08': { fonte: 'p.disc: "Fonte e data do preço: ordem de grandeza observada no primeiro semestre de 2026, a partir de análise de mercado sobre dados da bolsa registradora; consulta em 2 de agosto de 2026." § Ref item 29 (B3) diz que é a referência que deve substituir o valor padrão.', nota: 'Só o preço tem fonte declarada. Densidades (mj) e intensidades fósseis de referência (ref) são "valores de referência" sem documento citado.' },
  'INST·09': { fonte: null, nota: 'Tabela qualitativa sem fonte. Uma entrada cita "primeiro agente certificador de origem credenciado em abril de 2026".' },
  'INST·10': { fonte: 'p.disc: "Os doze enunciados são construídos a partir de dados reais verificados em 2 de agosto de 2026"', nota: 'Nenhum enunciado cita documento; os números (40,69; 35,94; 5,9%; 3,1%; 8,5%; 5,3%) coincidem com a prosa das aulas e com o § Ref (Conab, ANP), sem vínculo declarado.' },
};

// ------------------------------------------------------------- monta
const instrumentos = insts.map((n) => {
  const idf = texto(inner(find(n, sel('span', 'id'))));
  const titulo = texto(inner(find(n, sel('span', 'nm'))));
  const num = idf.replace(/\D/g, '');
  const sc = blocoScript(idf);
  const base = html.indexOf(sc.code);
  const mk = markup(n);
  const consts = constantes(sc.code, base);
  const rm = ramos(sc.code, base);
  const leituras = linhasCom(sc.code, base, /numOf\(|segVal\(/);
  const formulas = linhasCom(sc.code, base, /^\s*var [a-zA-Z0-9_]+\s*=.*[-+*/].*;|^\s*var (log|mg|en|energiaMJ|evit|qt|rec|unit|ger|exp|fca|fcs|hs|teto|premio|alvo|atual|desloc|ix|ef|kg|dif|q1|pp|ref|bate)\b/)
    .filter((x) => !/numOf\(|segVal\(|\$id\(/.test(x.codigo));
  const formatacao = mk.saidas.map((s) => ({ saida: s.id, rotulo: s.rotulo, codigo: linhasCom(sc.code, base, new RegExp(`\\$id\\('${s.id}'\\)\\.(textContent|innerHTML)`)) }));
  const pad0 = cenarioPadrao(mk);
  const r = {
    id: `m14-inst-${num}`,
    id_fonte: idf,
    tipo: 'instrumento',
    titulo,
    comentario_no_script: sc.comentario,
    kind_sugerido: KIND[idf][0],
    kind_nota: `Anotação desta extração (taxonomia): ${KIND[idf][1]}`,
    pergunta: null,
    pergunta_nota: 'O instrumento não traz pergunta própria no markup. A tarefa declarada é o p.inst-intro (abaixo). Pergunta de previsão seria da camada Alexandria (P19).',
    tarefa_declarada: mk.intro,
    posicao: posicao(n),
    entradas: { selecoes: mk.grupos, campos: mk.campos },
    leitura_das_entradas_script: leituras,
    saidas: mk.saidas.map((s) => ({ ...s, formatacao_script: formatacao.find((f) => f.saida === s.id)?.codigo ?? [] })),
    conteineres: mk.conteineres,
    formulas_script: formulas,
    dados_do_script: Object.fromEntries(Object.entries(consts).map(([k, v]) => [k, v])),
    ramos_do_veredito: rm,
    nota_ramos: rm.length ? 'Cadeia if/else if/else do veredito, na ordem do script (a primeira condição verdadeira vence). `expressao_texto_verbatim` é o código que monta o texto (com interpolação); `fragmentos_literais` são as strings literais dele; `rotulo` é o primeiro fragmento sem tags.' : 'Sem cadeia de ramos: o texto de leitura vem das tabelas de dados (dados_do_script) conforme a seleção.',
    cenario_padrao: pad0,
    fonte_dos_numeros: FONTE_NUM[idf].fonte,
    fonte_dos_numeros_nota: FONTE_NUM[idf].nota,
    tolerancias: null,
    tolerancias_nota: 'A fonte não declara tolerância de resposta. Limiares de faixa do script estão em ramos_do_veredito.',
    nota_rodape: mk.disc,
    script: { linha_ini: sc.linha_ini, linha_fim: sc.linha_fim, codigo_verbatim: sc.code.split('\n') },
    comparacao_codigo: comparaCodigo(mk, titulo),
    origem: origem('div.inst > div.inst-hd', n, `${idf} ${titulo}`),
  };
  // trechos de texto montados fora das tabelas e dos ramos (prefixos do veredito, rotulos de painel)
  {
    const l0 = sc.linha_ini;
    const dentro = (ln) => Object.values(consts).some((c) => ln >= c.linha_ini && ln <= c.linha_fim);
    const ramoLinhas = new Set();
    for (const x of rm) for (let q = x.linha_aprox; q <= x.linha_fim; q++) ramoLinhas.add(q);
    const grupos = [];
    sc.code.split('\n').forEach((l, j) => {
      const ln = l0 + j;
      if (dentro(ln) || ramoLinhas.has(ln)) return;
      if (!/'[^']*\p{L}{3,}[^']*'/u.test(l) || /segVal\(|segBind\(|pair\(|\$id\('[^']*'\)\)return|^\s*\/\*/.test(l)) return;
      const g = grupos[grupos.length - 1];
      if (g && g.linha_fim === ln - 1) { g.codigo.push(l); g.linha_fim = ln; } else grupos.push({ linha_ini: ln, linha_fim: ln, codigo: [l] });
    });
    r.templates_de_texto_script = grupos;
    r.templates_nota = 'Linhas do bloco que montam texto fora das tabelas de dados e da cadeia de ramos (prefixos compartilhados do veredito como `var b=`/`var s=`, rótulos de painel gerados por pinta(), formatos de readout). Verbatim, com linha.';
  }
  // cobertura por token: markup do instrumento e strings literais do script
  const litScript = [...sc.code.matchAll(/'((?:[^'\\]|\\.)*)'/g)].map((x) => x[1]).filter((x) => /\p{L}{3,}/u.test(x) && !/^(data-|verdict|bar-|tr-chip|button|input|div|span|<)/.test(x)).join(' ');
  r.cobertura_por_token = {
    markup: cobertura(inner(n), [idf, titulo, mk.intro.texto, mk.grupos.map((g) => [g.rotulo, g.opcoes.map((o) => o.rotulo)]), mk.campos.map((f) => [f.rotulo, f.unidade]), mk.saidas.map((s) => [s.rotulo, s.valor_markup]), mk.conteineres.map((c) => c.valor_markup), mk.disc?.texto ?? '']),
    strings_do_script: cobertura(litScript, [Object.values(consts).map((c) => JSON.stringify(c.valor).replace(/[{}\[\]":,]/g, ' ')), rm.map((x) => x.fragmentos_literais), (r.templates_de_texto_script || []).map((g) => [...g.codigo.join(' ').matchAll(/'((?:[^'\\]|\\.)*)'/g)].map((x) => x[1]))]),
    nota: 'strings_do_script mede as strings literais com letras do bloco do instrumento contra os dados avaliados + fragmentos dos ramos; o resíduo esperado são rótulos de readout escritos no próprio pinta()/calc() (ex.: "Onde entra na matriz"), que aparecem em cenario_padrao/varredura.',
  };
  // varreduras
  if (mk.grupos.length && mk.campos.length) r.varredura_de_selecoes_no_padrao = varreSelecoes(mk, mk.grupos);
  if (rm.length && mk.campos.length) r.exemplo_por_ramo = exemploPorRamo(mk, rm);
  return r;
});

// ---------------------------------------------- varreduras especificas
const I = (k) => instrumentos.find((x) => x.id_fonte === k);
{ // INST·01: dimensao -> ordem dos chips; rota -> painel
  const i1 = I('INST·01');
  const env = executa();
  i1.varredura = {
    ordem_por_dimensao: i1.entradas.selecoes[0].opcoes.map((o) => {
      clica(env, 'mp-dim', 'data-d', o.valor);
      return { dimensao: o.valor, rotulo: o.rotulo, chips: env.byId.get('mp-chips').kids.map((b) => ({ rota: b.getAttribute('data-r'), rotulo_renderizado: b.textContent })) };
    }),
    painel_por_rota: Object.keys(i1.dados_do_script.ROTAS.valor).map((k) => {
      const e2 = executa();
      const chip = e2.byId.get('mp-chips').kids.find((b) => b.getAttribute('data-r') === k);
      chip.fire('click');
      return { rota: k, ...simples(estado(e2, ['mp-flux', 'mp-panel'])) };
    }),
  };
}
{ // INST·04: 7 dimensoes
  const i4 = I('INST·04');
  i4.varredura = i4.entradas.selecoes.flatMap((g) => g.opcoes.map((o) => {
    const env = executa();
    clica(env, g.id, o.atributo, o.valor);
    return { grupo: g.id, dimensao: o.valor, ...simples(estado(env, ['rt-out', 'rt-vd'])), classe: env.byId.get('rt-vd').className };
  }));
}
{ // INST·09: 5 insumos x 7 destinos
  const i9 = I('INST·09');
  const DEST = i9.dados_do_script.DEST.valor;
  i9.varredura = i9.entradas.selecoes[0].opcoes.flatMap((o) => DEST.map((d) => {
    const env = executa();
    clica(env, 'cl-ins', 'data-i', o.valor);
    const chip = env.byId.get('cl-dest').kids.find((b) => b.getAttribute('data-d') === d.k);
    chip.fire('click');
    return { insumo: o.valor, destino: d.k, rotulo_chip: chip.textContent, ...simples(estado(env, ['cl-out', 'cl-vd'])), classe: env.byId.get('cl-vd').className };
  }));
  const M = i9.dados_do_script.M.valor;
  i9.cobertura_produto_cartesiano = { insumos: Object.keys(M).length, destinos: DEST.length, combinacoes_definidas: Object.values(M).reduce((a, x) => a + DEST.filter((d) => x[d.k]).length, 0) };
}
{ // INST·10: filtros e 12 paineis
  const i10 = I('INST·10');
  i10.varredura = {
    chips_por_filtro: i10.entradas.selecoes[0].opcoes.map((o) => {
      const env = executa();
      clica(env, 'vf-tipo', 'data-t', o.valor);
      return { filtro: o.valor, chips: env.byId.get('vf-chips').kids.map((b) => ({ k: b.getAttribute('data-k'), rotulo_renderizado: b.textContent })) };
    }),
    painel_por_enunciado: i10.dados_do_script.E.valor.map((e) => {
      const env = executa();
      env.byId.get('vf-chips').kids.find((b) => b.getAttribute('data-k') === e.k).fire('click');
      return { k: e.k, painel_html: estado(env, ['vf-panel'])['vf-panel'].valor };
    }),
  };
  i10.enunciados = i10.dados_do_script.E.valor.map((e) => ({ k: e.k, categoria: e.t, categoria_rotulo: i10.dados_do_script.LB.valor[e.t], rotulo_chip_y: e.y, enunciado: e.n, defeito_dominante: e.df, o_que_falta_html: e.fa, pergunta_a_fazer: e.pg, forma_corrigida: e.co, categoria_e_rotulo_coincidem: i10.dados_do_script.LB.valor[e.t].toLowerCase() === e.y.toLowerCase() }));
}

// ------------------------------------------------------ divergencias
const i5 = I('INST·05').dados_do_script;
const i7pad = I('INST·07').cenario_padrao.saidas;
const i8 = I('INST·08');
const divergencias = [
  { id: 'div-m14-inst07-energia', instrumento: 'INST·07', severidade: 'alta', tema: 'Saída "Energia entregue" 1.000 vezes menor', leitura_a: { onde: 'script INST·07', texto: 'var en=vol*36/1000;  /* TJ, a 36 MJ/Nm3 */ → com 15 milhões de Nm³: ' + i7pad['bm-en'] }, leitura_b: { onde: 'Ex 08', texto: '8 milhões de Nm³ × 36 MJ/Nm³ = 288 milhões de MJ = 288 TJ (logo 15 milhões → 540 TJ)' }, classe: 'fonte × fonte (defeito do script)', nota: 'vol está em milhões de Nm³; vol×36 já dá TJ. A divisão extra por 1000 faz o painel mostrar "1 TJ/ano" no padrão. Sinalizado, não corrigido (§10).', decisao: null },
  { id: 'div-m14-inst08-unidade', instrumento: 'INST·08', severidade: 'alta', tema: 'Diferencial de intensidade: gCO₂e/MJ no rótulo, % no cálculo', leitura_a: { onde: 'markup (rótulo do campo)', texto: 'Diferencial de intensidade de carbono · gCO₂e/MJ' }, leitura_b: { onde: 'script', texto: 'var evit=energiaMJ*R1.ref*(dic/100)/1e6; ... diferencial de intensidade de \'+fmt(dic,0)+\'%' }, leitura_c: { onde: 'Ex 13', texto: '100.000.000 × 21,1 × 55 = 116,05 bilhões de gramas (55 usado como gCO₂e/MJ, 21,1 MJ/L)' }, classe: 'fonte × fonte', nota: `No padrão (100 mi L, 55, etanol de cana 1G com mj ${i8.dados_do_script.R.valor.e1g.mj} e ref ${i8.dados_do_script.R.valor.e1g.ref}) o painel mostra ${i8.cenario_padrao.saidas['cb-ev']}; o Ex 13 dá cerca de 116.050 t para os mesmos 100 mi L e 55. Duas divergências somadas: unidade do diferencial e densidade (21,3 × 21,1 MJ/L).`, decisao: null },
  { id: 'div-m14-inst08-estoque', instrumento: 'INST·08', severidade: 'baixa', tema: 'Tamanho do estoque de créditos', leitura_a: { onde: 'script INST·08 (ramo prc>=90)', texto: 'estoque acumulado da ordem de dezenas de milhões de unidades no início do ano' }, leitura_b: { onde: 'Aula 07 §07.4', texto: 'cerca de 19,5 milhões de créditos em estoque' }, leitura_c: { onde: '§Voz 6:00–7:00', texto: 'estoque estrutural de quase vinte milhões de créditos' }, classe: 'fonte × fonte', nota: '"Dezenas de milhões" não descreve 19,5 milhões. Registrado, não resolvido.', decisao: null },
  { id: 'div-m14-inst08-renovacao', instrumento: 'INST·08', severidade: 'baixa', tema: '"Em renovação" calcula igual a "vigente"', leitura_a: { onde: 'script', texto: "renov:{n:'em renovação',f:1}" }, leitura_b: { onde: 'veredito do ramo renov', texto: 'Os números do painel descrevem o que existiria com a certificação vigente.' }, classe: 'comportamento declarado', nota: 'Coerente com o texto do ramo; registrado para quem portar (f=1 não é erro).', decisao: null },
  { id: 'div-m14-inst05-vencido-gasolina', instrumento: 'INST·05', severidade: 'média', tema: 'Referência do estado "prazo vencido" para a gasolina', leitura_a: { onde: 'script BASES.gasolina', texto: `venc:${i5.BASES.valor.gasolina.venc}` }, leitura_b: { onde: 'script BASES.gasolina.not', texto: 'E30 foi o teor vigente até 31 de julho de 2026.' }, leitura_c: { onde: 'script EST.vencido.d', texto: i5.EST.valor.vencido.d }, classe: 'fonte × fonte', nota: 'Para o diesel, 16 é de fato prazo legal vencido não implementado (B16). Para a gasolina, 30 é teor que vigorou e foi substituído, não prazo vencido. O veredito do estado "vencido" mostra 30% como referência.', decisao: null },
  { id: 'div-m14-inst05-troca-base', instrumento: 'INST·05', severidade: 'baixa', tema: 'Trocar a base não troca o percentual', leitura_a: { onde: 'script', texto: 'segBind(\'dm-base\',calc) — os campos dm-pct/dm-cmp mantêm 15 e 16' }, leitura_b: { onde: 'resultado', texto: 'gasolina + "Em vigor" no padrão cai no ramo "ESTADO INCOERENTE" (15 ≠ 32)' }, classe: 'comportamento do script', nota: 'Ver varredura_de_selecoes_no_padrao.', decisao: null },
  { id: 'div-m14-inst09-campos-prometidos', instrumento: 'INST·09', severidade: 'média', tema: 'Intro promete órgão competente e matriz; o painel não mostra', leitura_a: { onde: 'p.inst-intro', texto: 'o painel devolve rota, produto, órgão competente, onde entra na matriz e — a informação que quase nunca acompanha o número — o que deixou de ser feito' }, leitura_b: { onde: 'script (tabela M e pinta())', texto: 'cada combinação só tem s, c, d, q; o painel mostra Insumo, Destino, Estado da combinação e O que deixa de ser feito' }, classe: 'fonte × fonte', nota: 'Órgão e matriz existem no INST·01 (ROTAS.org / ROTAS.matriz), não no INST·09. Título do markup ("Classificador de insumo — rota, produto, órgão e concorrente") × comentário do script ("CLASSIFICADOR DE DESTINO DE INSUMO").', decisao: null },
  { id: 'div-m14-inst10-e3', instrumento: 'INST·10', severidade: 'média', tema: 'Enunciado e3: rótulo "estado de política", categoria "base"', leitura_a: { onde: 'script E[2].y', texto: 'estado de política' }, leitura_b: { onde: 'script E[2].t → LB', texto: 'Base temporal' }, classe: 'fonte × fonte', nota: 'O chip mostra "estado de política", o painel mostra "Categoria: Base temporal", e o filtro "Base temporal" o lista. "Estado de política" não é um dos quatro tipos do filtro.', decisao: null },
  { id: 'div-m14-inst04-dois-on', instrumento: 'INST·04', severidade: 'baixa', tema: 'Markup com duas dimensões ativas', leitura_a: { onde: 'markup', texto: 'rt-dim: "Insumo" .on e rt-dim2: "Intensidade de carbono" .on' }, leitura_b: { onde: 'script', texto: "limpa('rt-dim2'); pinta(); — só Insumo fica ativo" }, classe: 'markup × script', nota: 'Na tela vale o script.', decisao: null },
];
{
  const fx8 = i8.posicao.formulas_exibidas_na_secao[0];
  const dv = divergencias.find((d) => d.id === 'div-m14-inst08-unidade');
  dv.leitura_d = { onde: `Aula 07, div.fx (L${fx8.linha_aprox})`, texto: `${fx8.nome}: ${fx8.eq}` };
  dv.nota += ' A fórmula exibida na própria Aula 07 usa a diferença de intensidades (IC fóssil − IC da rota), que é grandeza em gCO₂e/MJ, como o Ex 13; o script usa ref × dic%.';
  const i6x = I('INST·06');
  const fx6 = i6x.posicao.formulas_exibidas_na_secao[0];
  divergencias.push({ id: 'div-m14-inst06-perdas', instrumento: 'INST·06', severidade: 'baixa', tema: 'Perdas na fórmula da aula, ausentes no script', leitura_a: { onde: `Aula 05, div.fx (L${fx6.linha_aprox})`, texto: `${fx6.nome}: ${fx6.eq}` }, leitura_b: { onde: 'script INST·06', texto: i6x.formulas_script.find((f) => f.codigo.startsWith('var exp')).codigo }, classe: 'fonte × fonte', nota: 'O simulador desconta só o autoconsumo; a fórmula da aula também desconta perdas. A disponibilidade entra na geração bruta.', decisao: null });
}
for (const i of instrumentos) {
  for (const f of i.entradas.campos) if (f.range_igual_ao_number === false) divergencias.push({ id: `div-m14-${i.id}-${f.id}-faixa`, instrumento: i.id_fonte, severidade: 'baixa', tema: 'number × range com atributos diferentes', leitura_a: { onde: f.id, texto: JSON.stringify(f) }, classe: 'markup', decisao: null });
  const intro = i.tarefa_declarada.texto;
  const nm = { Quatro: 4, Doze: 12 };
  for (const [w, v] of Object.entries(nm)) if (intro.startsWith(w + ' entradas') && i.entradas.campos.length !== v) divergencias.push({ id: `div-m14-${i.id}-contagem`, instrumento: i.id_fonte, tema: `intro diz ${w}`, leitura_a: { onde: 'intro', texto: intro.slice(0, 40) }, leitura_b: { onde: 'markup', texto: String(i.entradas.campos.length) }, decisao: null });
}

// checagens de consistencia (sem divergencia)
const i6 = I('INST·06').cenario_padrao.saidas;
const consistencia = [
  { tema: 'INST·06 × Ex 02 × Q04 × INST·10 e7', fonte_texto: 'Ex 02: "cerca de 355 GWh brutos e entregam cerca de 160 GWh ... fator de capacidade anual em torno de 23%"', painel_padrao: `${i6['cg-p2']} / ${i6['cg-p3']} / ${i6['cg-fc']}`, resultado: 'coerente (arredondamento)' },
  { tema: 'INST·06 × §Voz 4:00–5:00', fonte_texto: '"Uma cogeração de 80 MW pode ter fator de capacidade anual em torno de 20%"', painel_padrao: i6['cg-fc'], resultado: 'aproximação da prosa ("em torno de"); não tratado como divergência' },
  { tema: 'INST·06 teto × §Erros 14', fonte_texto: '"Esta usina tem 80 MW, então gera 700 GWh por ano."', painel_padrao: 'teto teórico de 701 GWh no desenho de barras', resultado: 'coerente' },
  { tema: 'INST·02 × §01.3', fonte_texto: 'regra dos 70% não entra na conta', painel_padrao: I('INST·02').cenario_padrao.saidas['pd-vd'].slice(0, 80), resultado: 'coerente' },
];

const out = {
  schema: 'alexandria-v2/extracao-fonte/instrumentos@1',
  modulo: 14, grupo: 'instrumentos', camada: 'fonte',
  fonte: FONTE, gerado_em: HOJE,
  metodo: 'Markup lido da árvore de elementos (div.inst). Blocos de script separados pelos comentários /* === INST·NN — ... === */; constantes avaliadas a partir do literal; ramos pela cadeia if/else do veredito. Cenário-padrão, varreduras e exemplos por ramo obtidos EXECUTANDO o <script> original inteiro num DOM simulado (extratores/m14_dom.mjs) — nenhuma linha de lógica reescrita. Números formatados com toLocaleString pt-BR do Node (ICU completo).',
  convencoes: {
    linha_aprox: 'linha 1-based na fonte',
    'saidas[].valor_markup': 'valor estático do HTML antes do script ("—"); o que a tela mostra é cenario_padrao',
    'cenario_padrao.saidas': 'valor que o script escreve no carregamento; vereditos via innerHTML ficam com HTML',
    kind_sugerido: 'anotação desta extração, não normativa',
  },
  resumo: instrumentos.map((i) => ({ id: i.id, id_fonte: i.id_fonte, titulo: i.titulo, aula: i.posicao.aula_fonte ?? i.posicao.secao_id, subsecao: i.posicao.subsecao?.numero ?? null, kind_sugerido: i.kind_sugerido, campos: i.entradas.campos.length, selecoes: i.entradas.selecoes.length, saidas: i.saidas.length, ramos: i.ramos_do_veredito.length, estado_no_codigo: i.comparacao_codigo.estado })),
  instrumentos,
  divergencias,
  consistencia,
  contagens: {
    instrumentos: instrumentos.length,
    de_aula: instrumentos.filter((i) => !i.posicao.fora_de_aula).length,
    fora_de_aula: instrumentos.filter((i) => i.posicao.fora_de_aula).length,
    campos_numericos: instrumentos.reduce((a, i) => a + i.entradas.campos.length, 0),
    grupos_de_selecao: instrumentos.reduce((a, i) => a + i.entradas.selecoes.length, 0),
    saidas: instrumentos.reduce((a, i) => a + i.saidas.length, 0),
    ramos_de_veredito: instrumentos.reduce((a, i) => a + i.ramos_do_veredito.length, 0),
    portados: instrumentos.filter((i) => i.comparacao_codigo.estado === 'portado').length,
    nao_portados: instrumentos.filter((i) => i.comparacao_codigo.estado === 'não portado').length,
    divergentes: instrumentos.filter((i) => i.comparacao_codigo.estado === 'divergente').length,
    enunciados_inst10: I('INST·10').enunciados.length,
    combinacoes_inst09: I('INST·09').varredura.length,
    divergencias: divergencias.length,
  },
};
write('instrumentos.json', out);
console.log(JSON.stringify(out.contagens));
console.log(JSON.stringify(out.resumo, null, 0));
