// Extrator do grupo "modulo" do M07 -> modulo.json: identidade, horas, tese, resultado esperado (ausente),
// § MAP, roteiro (17 secoes), criterios literais (P14), laboratorios (ausentes), voz (§Voz), principios,
// erros comuns (§Erros), tradutor (ausente), blocos de produto (P7) e comparacao com codigo/catalogo.
import fs from 'node:fs';
import {
  html, lineOf, texto, inner, ini, origem, pad, sec, all, one, blocks,
  tsLiteral, readData, writeJSON, CATALOGO, SCRIPT_START,
} from './m07_lib.mjs';

const body = html.slice(0, SCRIPT_START);
const IDS = ['tese', 'map', 'a01', 'a02', 'a03', 'a04', 'a05', 'a06', 'a07', 'caso', 'erros', 'ex', 'quiz', 'voz', 'final', 'lex', 'ref'];
const secIdsNoArquivo = [...body.matchAll(/<section id="([^"]+)">/g)].map((m) => m[1]);
if (JSON.stringify(secIdsNoArquivo) !== JSON.stringify(IDS)) throw new Error('secoes inesperadas: ' + secIdsNoArquivo);

const head = (s) => {
  const b = blocks(s);
  const sid = b.find((x) => x.cls === 'sec-id');
  const m = /<b>([\s\S]*?)<\/b> · ([\s\S]*)/.exec(sid.inner);
  const h2 = b.find((x) => x.tag === 'h2');
  const lede = b.find((x) => x.cls === 'lede');
  return {
    marcador: texto(m[1]), rotulo: texto(m[2]), h2: texto(h2.inner),
    lede: lede ? { html: inner(lede.inner), texto: texto(lede.inner), origem: origem(`section#${s.id} p.lede`, ini(lede.inner), lede.idx) } : null,
    origem: origem(`section#${s.id} .sec-id`, texto(sid.inner), sid.idx),
    h2_origem: origem(`section#${s.id} h2`, texto(h2.inner), h2.idx),
    blocos: b,
  };
};
const tagOf = (b) => { const t = /<span class="tag">([\s\S]*?)<\/span>/.exec(b.inner); return t ? texto(t[1]) : null; };
const pars = (b, sel) => all(/<p>([\s\S]*?)<\/p>/g, b.outer, b.idx).map(({ m, idx }) => ({ html: inner(m[1]), texto: texto(m[1]), origem: origem(sel, ini(m[1]), idx) }));

// generico: bloco -> item literal
function blocoLiteral(b, secId, id) {
  const sel = `section#${secId} ${b.tag}${b.cls ? '.' + b.cls.replace(/ /g, '.') : ''}`;
  if (b.tag === 'p') return { id, tipo: b.cls === 'lede' ? 'lede' : 'paragrafo', html: inner(b.inner), texto: texto(b.inner), origem: origem(sel, ini(b.inner), b.idx) };
  if (b.tag === 'h3') { const m = /<span class="num">([^<]*)<\/span>([\s\S]*)/.exec(b.inner); return { id, tipo: 'titulo', numero: m[1], texto: texto(m[2]), origem: origem(sel, texto(m[2]), b.idx) }; }
  if (b.cls === 'form') {
    const note = /<span class="note">([\s\S]*?)<\/span>/.exec(b.inner);
    const main = b.inner.replace(/<span class="note">[\s\S]*?<\/span>/, '');
    return { id, tipo: 'formula-destaque', html: inner(main), linhas: main.split('<br>').map((x) => texto(x)).filter(Boolean), nota: note ? { html: inner(note[1]), texto: texto(note[1]) } : null, origem: origem(sel, ini(main), b.idx) };
  }
  if (/^box/.test(b.cls)) return { id, tipo: 'callout', classe: b.cls, rotulo: tagOf(b), paragrafos: pars(b, sel + ' p'), origem: origem(sel, tagOf(b), b.idx) };
  if (b.tag === 'ol' || b.tag === 'ul') return { id, tipo: 'lista', classe: b.cls, itens: all(/<li>([\s\S]*?)<\/li>/g, b.outer, b.idx).map(({ m, idx }) => ({ html: inner(m[1]), texto: texto(m[1]), origem: origem(sel + ' li', ini(m[1]), idx) })), origem: origem(sel, ini(b.inner), b.idx) };
  if (b.cls === 'scroll') {
    const rows = all(/<tr>([\s\S]*?)<\/tr>/g, b.outer, b.idx).map(({ m, idx }) => ({ celulas: [...m[1].matchAll(/<t[hd]>([\s\S]*?)<\/t[hd]>/g)].map((c) => inner(c[1])), cabecalho: /<th>/.test(m[1]), linha_aprox: lineOf(idx) }));
    return { id, tipo: 'tabela', linhas: rows, origem: origem(sel + ' table.tbl', texto(rows[0].celulas.join(' | ')).slice(0, 60), b.idx) };
  }
  return { id, tipo: `outro:${b.tag}.${b.cls}`, origem: origem(sel, ini(b.inner), b.idx) };
}

// =================== IDENTIDADE ===================
const title = one(/<title>([^<]*)<\/title>/, html);
const kicker = one(/<div class="kicker">([^<]*)<\/div>/, body);
const h1 = one(/<h1>([^<]*)<\/h1>/, body);
const sub = one(/<p class="sub">([\s\S]*?)<\/p>/, body);
const pills = all(/<span class="pill">([\s\S]*?)<\/span>/g, body).map(({ m, idx }) => ({ html: inner(m[1]), texto: texto(m[1]), origem: origem('.hero .pill-row .pill', texto(m[1]), idx) }));
const horasPill = pills.find((p) => /h de estudo/.test(p.texto));
const footer = one(/<footer>([\s\S]*?)<\/footer>/, html);
const footerLines = footer.m[1].slice(footer.m[1].indexOf('</div>') + 6).split('<br>').map((x) => texto(x)).filter(Boolean);
const catalogo = fs.readFileSync(CATALOGO, 'utf8');
const catHead = one(/^## Módulo 07 — (.*)$/m, catalogo);
const catRepo = one(/\*\(catálogo do repositório: "([^"]*)"\)\*/, catalogo.slice(catHead.idx), catHead.idx);
const catEscala = one(/\*\*Escala\*\* · ([^\n]*\n[^\n]*\n[^\n]*)/, catalogo.slice(catHead.idx), catHead.idx);
const catTrilha = one(/\*\*Trilha\*\* · ([^\n]*\n[^\n]*)/, catalogo.slice(catHead.idx), catHead.idx);
const blocksTs = readData('alexandria-blocks.ts');
const bloco07 = one(/\{ id: 'bloco-07'[^\n]*\}/, blocksTs);
const b07 = new Function('return (' + bloco07.m[0] + ')')();

const identidade = {
  titulo_documento: { texto: title.m[1], origem: origem('head > title', title.m[1], title.idx) },
  kicker: { texto: kicker.m[1], origem: origem('.hero .kicker', kicker.m[1], kicker.idx) },
  titulo: { texto: h1.m[1], origem: origem('.hero h1', h1.m[1], h1.idx) },
  subtitulo: { html: inner(sub.m[1]), texto: texto(sub.m[1]), origem: origem('.hero p.sub', ini(sub.m[1]), sub.idx) },
  pills_do_hero: pills,
  horas: { texto: horasPill.texto, min: null, max: null, nota: 'A fonte só traz a string "6–8h de estudo" (pill do hero). min/max numéricos não são declarados; o catálogo do repositório (alexandria-blocks.ts) tem estimatedHoursMin 6 / estimatedHoursMax 8.', origem: horasPill.origem },
  roteiro_oral_pill: pills.find((p) => /Roteiro oral/.test(p.texto)),
  eixos: null,
  eixos_nota: 'A fonte não declara eixos do módulo. O § 00 declara "sete funções" (frase para decorar) e "a régua das quatro perguntas"; o § MAP declara "dois mapas" (autoridade × dado). Nenhum é rotulado como eixo.',
  trilha_nivel: null,
  trilha_nivel_nota: `A fonte não declara trilha nem nível (kicker: "${kicker.m[1]}"). O catálogo canônico marca a trilha como atribuída; o código usa level ${b07.level}, track '${b07.track}'.`,
  rodape: { frase_linhas: one(/<div class="bd">([\s\S]*?)<\/div>/, footer.m[1]).m[1].split('<br>').map((x) => texto(x)), linhas: footerLines, html: inner(footer.m[1]), origem: origem('footer', 'Política escolhe. Planejamento testa.', footer.idx) },
  catalogo_canonico: {
    arquivo: 'C:/dev/GridAlpha v2/docs/catalogo-modulos-alexandria.md',
    titulo_secao: catHead.m[1], linha: lineOf(catHead.idx, catalogo),
    titulo_catalogo_repo_citado: catRepo.m[1],
    trilha: catTrilha.m[1].replace(/\s+/g, ' '),
    escala: catEscala.m[1].replace(/\s+/g, ' '),
  },
  catalogo_repo: { arquivo: 'src/lib/data/alexandria-blocks.ts', linha: lineOf(bloco07.idx, blocksTs), ...b07 },
  marca_P24: {
    ocorrencias_gridalpha: [...html.matchAll(/GridAlpha/g)].map((m) => {
      const ls = html.lastIndexOf('\n', m.index) + 1; const le = html.indexOf('\n', m.index);
      const ln = html.slice(ls, le);
      return { linha: lineOf(m.index), contexto: texto(ln).slice(Math.max(0, texto(ln).indexOf('GridAlpha') - 60), texto(ln).indexOf('GridAlpha') + 70) };
    }),
    nota: 'P24: "GridAlpha" é marca morta voltada ao learner; texto mantido literal na camada fonte.',
  },
};

// =================== TESE ===================
const tese = sec('tese');
const th = head(tese);
const teseBlocos = th.blocos.filter((b) => b.cls !== 'sec-id' && b.tag !== 'h2').map((b, i) => blocoLiteral(b, 'tese', `m07-tese-b${pad(i + 1)}`));
const teseObj = { marcador: th.marcador, rotulo: th.rotulo, titulo: { texto: th.h2, origem: th.h2_origem }, origem: th.origem, blocos: teseBlocos };

// =================== MAP ===================
const map = sec('map');
const mh = head(map);
const cards = all(/<a class="map-card" href="#([^"]+)"><div class="n">([^<]*)<\/div><div class="t">([^<]*)<\/div><div class="d">([\s\S]*?)<\/div><\/a>/g, map.body, map.start)
  .map(({ m, idx }, i) => ({ id: `m07-map-card-${pad(i + 1)}`, destino: `#${m[1]}`, aula_codigo: /^a0\d$/.test(m[1]) ? `aula-07-${m[1].slice(1)}` : null, n: m[2], t: m[3], d: inner(m[4]), origem: origem('section#map a.map-card', m[2], idx) }));
const mapP = mh.blocos.filter((b) => b.tag === 'p' && b.cls !== 'lede').map((b, i) => blocoLiteral(b, 'map', `m07-map-p${pad(i + 1)}`));
const mapa = {
  marcador: mh.marcador, rotulo: mh.rotulo, titulo: { texto: mh.h2, origem: mh.h2_origem }, lede: mh.lede, paragrafos: mapP,
  instrumento: { id: 'm07-inst-01', nota: 'Inst · 01 (Mapa institucional) vive aqui; detalhe em instrumentos.json.' },
  cartoes: cards,
  perguntas: null,
  perguntas_nota: 'O § MAP do M07 não tem tabela aula × pergunta (diferente do M01). Os cartões trazem n (rótulo), t (tema) e d (descrição em prosa, sem pergunta). Os 8 cartões cobrem as 7 aulas e o § Caso.',
  origem: mh.origem,
};

// =================== ROTEIRO ===================
const AULAS_COD = tsLiteral('alexandria-modulo-07-content.ts', 'export const MODULO_07_AULAS', { INSTRUMENTOS_MODULO_07: new Array(9).fill(0).map((_, i) => ({ id: `x${i}` })) }).value;
const LEAD_COD = tsLiteral('alexandria-modulo-07-content.ts', 'export const MODULO_07_LEAD').value;
const CORPO_COD = tsLiteral('alexandria-modulo-07-content.ts', 'export const MODULO_07_CORPO').value;
const inventario = (b) => {
  const c = {};
  for (const x of b) {
    if (x.cls === 'sec-id' || x.tag === 'h2') continue;
    const k = x.cls ? `${x.tag}.${x.cls.replace(/ /g, '.')}` : x.tag;
    c[k] = (c[k] || 0) + 1;
  }
  return c;
};
const roteiro = IDS.map((id, i) => {
  const s = sec(id);
  const h = head(s);
  const ehAula = /^Aula \d{2}$/.test(h.marcador);
  const item = {
    ordem: i + 1, id_fonte: `section#${id}`, tipo: ehAula ? 'aula' : 'aparato', marcador: h.marcador, rotulo: h.rotulo, titulo: h.h2,
    origem: h.origem, linha_inicio: lineOf(s.start), linha_fim: lineOf(s.end),
    inventario_de_blocos: inventario(h.blocos),
  };
  if (ehAula) {
    const n = +h.marcador.slice(5);
    const cod = AULAS_COD.find((a) => a.number === n);
    item.id_codigo = `aula-07-${pad(n)}`;
    item.lede = h.lede;
    item.subsecoes = h.blocos.filter((b) => b.tag === 'h3').map((b) => { const m = /<span class="num">([^<]*)<\/span>([\s\S]*)/.exec(b.inner); return { numero: m[1], titulo: texto(m[2]), linha_aprox: b.linha }; });
    item.fichas_institucionais = h.blocos.filter((b) => b.cls === 'fi').map((b) => ({ sigla_titulo: texto(/<span class="sg">([\s\S]*?)<\/span>/.exec(b.inner)[1]), tipo: texto(/<span class="tp">([\s\S]*?)<\/span>/.exec(b.inner)[1]), linhas: (b.inner.match(/class="fi-row"/g) || []).length, linha_aprox: b.linha }));
    item.tres_niveis = h.blocos.filter((b) => b.cls === 'lv').map((b) => ({ titulo: texto(/<div class="lv-hd">([\s\S]*?)<\/div>/.exec(b.inner)[1]), abas: [...b.inner.matchAll(/<button class="lv-tab[^"]*"[^>]*>([^<]*)<\/button>/g)].map((m) => m[1]), linha_aprox: b.linha }));
    item.instrumentos = h.blocos.filter((b) => b.cls === 'inst').map((b) => texto(/<span class="id">([^<]*)<\/span>/.exec(b.inner)[1]));
    item.callouts = h.blocos.filter((b) => /^box/.test(b.cls)).map((b) => ({ classe: b.cls, rotulo: tagOf(b), linha_aprox: b.linha }));
    const codDiv = [];
    if (!cod) codDiv.push('aula ausente no código');
    else {
      if (cod.title !== h.h2) codDiv.push(`title "${cod.title}" × h2 "${h.h2}"`);
      if (cod.subtitle !== h.rotulo) codDiv.push(`subtitle "${cod.subtitle}" × rótulo "${h.rotulo}"`);
      if (cod.totalInModule !== 7) codDiv.push(`totalInModule ${cod.totalInModule}`);
      if (LEAD_COD[item.id_codigo] !== h.lede.texto) codDiv.push('lead do código ≠ texto do lede');
      if (cod.instruments.length !== item.instrumentos.length) codDiv.push(`instrumentos: código ${cod.instruments.length} × fonte ${item.instrumentos.length}`);
      const corpo = CORPO_COD[item.id_codigo] || [];
      const tit = corpo.filter((x) => x.kind === 'titulo').map((x) => x.numero);
      const faltam = item.subsecoes.filter((x) => !tit.includes(x.numero)).map((x) => x.numero);
      if (faltam.length) codDiv.push(`subseções ausentes do corpo: ${faltam.join(', ')}`);
      const fichasCod = corpo.filter((x) => x.kind === 'nota' && /Ficha|MME|CNPE|EPE|ANEEL|ONS|CCEE|CMSE|CADE/.test(x.label || '')).length;
      item.codigo_blocos = { total: corpo.length, por_tipo: corpo.reduce((a, x) => { a[x.kind] = (a[x.kind] || 0) + 1; return a; }, {}) };
      if (item.fichas_institucionais.length) {
        const fiTxt = item.fichas_institucionais.map((f) => f.sigla_titulo);
        const presentes = fiTxt.filter((t) => JSON.stringify(corpo).includes(t));
        if (presentes.length < fiTxt.length) codDiv.push(`fichas institucionais (div.fi) ausentes do corpo portado: ${fiTxt.filter((t) => !presentes.includes(t)).join('; ')} — o código só tem o h3 "Ficha institucional · …"`);
      }
      // cobertura por token (protocolo §5), sem o markup dos instrumentos no denominador
      const tok = (t) => (t.toLowerCase().match(/[\p{L}\p{N}]+/gu) || []);
      const srcTxt = texto(s.body.replace(/<div class="inst">[\s\S]*?<p class="disc">[\s\S]*?<\/p>\s*<\/div>\s*<\/div>/g, ' ').replace(/<br>/g, ' ').replace(/<\/(p|div|td|th|li|h\d|span)>/g, ' $&'));
      const codTxt = [cod.title, cod.subtitle, LEAD_COD[item.id_codigo] || '', ...corpo.map((x) => [x.texto, x.numero, x.html, x.label, ...(x.itens || []), ...((x.linhas || []).flat())].filter(Boolean).join(' '))].join(' ');
      const bag = new Map(); for (const w of tok(texto(codTxt.replace(/<\/(p|div|td|th|li|b|strong|em)>/g, ' $&')))) bag.set(w, (bag.get(w) || 0) + 1);
      const st = tok(srcTxt); let hit = 0; const perdidos = [];
      for (const w of st) { const n = bag.get(w) || 0; if (n > 0) { hit++; bag.set(w, n - 1); } else perdidos.push(w); }
      item.cobertura_codigo_por_token = { tokens_fonte: st.length, encontrados: hit, percentual: +(100 * hit / st.length).toFixed(1), amostra_de_perdidos: perdidos.slice(0, 25) };
      const codSet = new Set(tok(texto(codTxt.replace(/<\/(p|div|td|th|li|b|strong|em)>/g, ' $&'))));
      const codNorm = texto(codTxt.replace(/<\/(p|div|td|th|li|b|strong|em)>/g, ' $&')).toLowerCase();
      item.blocos_da_fonte_ausentes_no_codigo = h.blocos.filter((b) => !['sec-id', 'inst'].includes(b.cls) && !['h2', 'h3'].includes(b.tag)).map((b) => {
        const t = texto(b.inner.replace(/<br>/g, ' ').replace(/<\/(p|div|td|th|li|span)>/g, ' $&'));
        // trecho de 8 palavras do meio do bloco procurado no codigo (normalizado)
        const ws = t.split(' ');
        const probes = [0.2, 0.5, 0.8].map((f) => { const c = Math.floor(ws.length * f); return ws.slice(Math.max(0, c - 3), c + 3).join(' ').toLowerCase(); });
        return { elemento: b.cls ? `${b.tag}.${b.cls.replace(/ /g, '.')}` : b.tag, trecho_inicial: t.slice(0, 70), linha_aprox: b.linha, presente: probes.some((pr) => codNorm.includes(pr)) };
      }).filter((x) => !x.presente).map(({ presente, ...x }) => x);
      if (item.blocos_da_fonte_ausentes_no_codigo.length) codDiv.push(`blocos da fonte sem correspondente no corpo portado: ${item.blocos_da_fonte_ausentes_no_codigo.map((x) => `${x.elemento} (L${x.linha_aprox})`).join(', ')}`);
      void codSet;
      if (hit / st.length < 0.85) codDiv.push(`cobertura por token do corpo portado: ${(100 * hit / st.length).toFixed(1)}% (abaixo de 85%)`);
      item.codigo = { title: cod.title, subtitle: cod.subtitle, illustrations: cod.illustrations, instruments: cod.instruments.length, divergencias: codDiv };
    }
  } else {
    item.lede = h.lede;
  }
  return item;
});
const aulas = roteiro.filter((r) => r.tipo === 'aula');
const contagemAulas = {
  sec_id_aula_NN: aulas.length,
  pill_do_hero: texto(pills[0].html),
  cartoes_do_map_para_aulas: cards.filter((c) => c.aula_codigo).length,
  codigo_MODULO_07_AULAS: AULAS_COD.length,
  codigo_totalInModule: [...new Set(AULAS_COD.map((a) => a.totalInModule))],
  codigo_AULAS_POR_BLOCO: +one(/'bloco-07': (\d+)/, readData('alexandria-trilhas.ts')).m[1],
  catalogo_canonico: (catalogo.slice(catHead.idx).match(/\*\*Escala\*\* · (\d+) aulas/) || [])[1] ? +catalogo.slice(catHead.idx).match(/\*\*Escala\*\* · (\d+) aulas/)[1] : null,
  numeracao_subsecoes: aulas.map((a) => `${a.marcador}: ${a.subsecoes.map((s) => s.numero).join(' ')}`),
  veredito: 'Todos os sinais concordam em 7.',
};

// =================== CRITERIOS ===================
const crit = [];
const addCrit = (id, texto_, onde, idx, p14, nota) => crit.push({ id, texto: texto_, onde, origem: origem(onde, texto_.slice(0, 60), idx), marcacao_p14: p14, nota: nota || null });
const at = (s, from = 0) => { const i = html.indexOf(s, from); if (i < 0) throw new Error('ausente: ' + s); return i; };
addCrit('m07-crit-hero', '10 questões · critério 8/10', '.hero .pill', at('critério 8/10'), ['automatizavel_quiz']);
addCrit('m07-crit-quiz-h2', 'Dez questões · critério 8/10', 'section#quiz h2', at('Dez questões · critério 8/10'), ['automatizavel_quiz']);
addCrit('m07-crit-quiz-lede', 'Erro de roteamento é a falha mais grave possível neste bloco. Responda sem consultar as aulas. Abaixo de oito, não avance para o §Voz — volte às aulas indicadas nos retornos e refaça.', 'section#quiz p.lede', at('Erro de roteamento é a falha mais grave possível neste bloco. Responda'), ['automatizavel_quiz', 'trava_de_avanco']);
const vozLede = head(sec('voz')).lede;
addCrit('m07-crit-duplo-voz', 'O critério deste bloco é duplo', 'section#voz h2', at('O critério deste bloco é duplo'), ['producao_oral_ou_livre', 'operacional_navegacao']);
addCrit('m07-crit-duplo-voz-lede', vozLede.texto, 'section#voz p.lede', at('O componente <strong>oral</strong>'), ['producao_oral_ou_livre', 'cronometrado', 'operacional_navegacao'], '"em quinze segundos" = cronometrado.');
const c73 = one(/<p>O critério de domínio deste bloco é duplo([\s\S]*?)<\/p>/, body);
addCrit('m07-crit-duplo-7-3', texto('O critério de domínio deste bloco é duplo' + c73.m[1]), 'section#a07 h3 7.3 + p', c73.idx, ['operacional_navegacao'], 'Cita literalmente o critério do currículo: "você consegue navegar todos os sites oficiais sem precisar de tutorial."');
const c72 = one(/<strong>Quatro fatos, quatro endereços\. É isso que o critério de domínio deste bloco pede em quinze segundos\.<\/strong>/, body);
addCrit('m07-crit-15s-7-2', texto(c72.m[0]), 'section#a07 div.box.cy (Teste de roteamento)', c72.idx, ['producao_oral_ou_livre', 'cronometrado']);
addCrit('m07-crit-v1', 'Em voz alta, sem consultar, cronometrando. Cada uma deve ser respondida em até quinze segundos.', 'section#voz h3 V.1 + p', at('Em voz alta, sem consultar, cronometrando.'), ['producao_oral_ou_livre', 'cronometrado']);
addCrit('m07-crit-v2', 'Responda em voz alta, cronometrando: cada uma deve caber em noventa segundos.', 'section#voz h3 V.2 + p', at('Responda em voz alta, cronometrando'), ['producao_oral_ou_livre', 'cronometrado']);
addCrit('m07-crit-v3', 'Grave em áudio, sem consultar. Ouça depois. Onde você gaguejar, ainda não dominou — volte à aula correspondente.', 'section#voz h3 V.3 + p', at('Grave em áudio, sem consultar.'), ['producao_oral_ou_livre', 'cronometrado', 'gravacao'], 'Roteiro de dez minutos, oito movimentos com duração (~1 min … ~2 min).');
const finH = head(sec('final'));
addCrit('m07-crit-final-h2', 'Vinte e seis afirmações que você precisa sustentar', 'section#final h2', at('Vinte e seis afirmações'), ['producao_oral_ou_livre']);
addCrit('m07-crit-final-lede', finH.lede.texto, 'section#final p.lede', at('Cada item corresponde a uma afirmação'), ['producao_oral_ou_livre'], 'Autodeclarado: "Marque apenas o que você consegue sustentar em voz alta".');
const seq = one(/<span class="tag">Sequência recomendada de fechamento<\/span>\s*<p>([\s\S]*?)<\/p>/, body);
addCrit('m07-crit-final-sequencia', texto(seq.m[1]), 'section#final div.box.gd', seq.idx, ['automatizavel_quiz', 'producao_oral_ou_livre', 'cronometrado', 'gravacao', 'operacional_navegacao']);
const qp = one(/if\(sc>=8\)\{[\s\S]*?textContent='([^']*)'/, html);
const qf = one(/\}else\{[\s\S]*?\$id\('q-msg'\)\.textContent='([^']*)'/, html);
addCrit('m07-crit-quiz-msg-pass', qp.m[1], 'script › QUIZ (sc>=8)', qp.idx, ['automatizavel_quiz'], 'Declara "Critério de domínio atingido." — conflita com P18.');
addCrit('m07-crit-quiz-msg-fail', qf.m[1], 'script › QUIZ (else)', qf.idx, ['automatizavel_quiz', 'trava_de_avanco']);

// =================== VOZ ===================
const voz = sec('voz');
const vh = head(voz);
const lists = vh.blocos.filter((b) => b.tag === 'ol');
const v1 = all(/<li>([\s\S]*?)<\/li>/g, lists[0].outer, lists[0].idx).map(({ m, idx }, i) => ({ id: `m07-voz-v1-${pad(i + 1)}`, html: inner(m[1]), texto: texto(m[1]), marcacao_p14: ['producao_oral_ou_livre', 'cronometrado'], origem: origem('section#voz ol.num-list (V.1) li', ini(m[1]), idx) }));
const v2 = all(/<li><b>([^<]*)<\/b>\s*([\s\S]*?)<br><em>([^<]*)<\/em>\s*([\s\S]*?)<\/li>/g, lists[1].outer, lists[1].idx).map(({ m, idx }, i) => ({
  id: `m07-voz-v2-${pad(i + 1)}`, persona: m[1], pergunta: texto(m[2]), rotulo_resposta: m[3], resposta_esperada_html: inner(m[4]), resposta_esperada_texto: texto(m[4]),
  marcacao_p14: ['producao_oral_ou_livre', 'cronometrado'], origem: origem('section#voz ol.num-list (V.2) li', m[1], idx),
}));
const movs = vh.blocos.filter((b) => /^box/.test(b.cls)).map((b, i) => {
  const t = tagOf(b);
  const mm = /^Movimento (\d) · (.*) · (~[\d,]+ min)$/.exec(t);
  const p = /<p>([\s\S]*?)<\/p>/.exec(b.inner)[1];
  const fun = /<strong>(Função(?: do movimento)?:)<\/strong>([\s\S]*)$/.exec(p);
  return { id: `m07-voz-v3-${pad(i + 1)}`, rotulo: t, numero: mm ? +mm[1] : null, tema: mm ? mm[2] : null, duracao: mm ? mm[3] : null, classe: b.cls, html: inner(p), texto: texto(p), funcao_declarada: fun ? { rotulo: fun[1], html: inner(fun[2]), texto: texto(fun[2]) } : null, origem: origem('section#voz div.box (V.3)', t, b.idx) };
});
const vIntro = vh.blocos.filter((b) => b.tag === 'h3').map((b) => { const m = /<span class="num">([^<]*)<\/span>([\s\S]*)/.exec(b.inner); const nxt = vh.blocos[vh.blocos.indexOf(b) + 1]; return { numero: m[1], titulo: texto(m[2]), intro: { html: inner(nxt.inner), texto: texto(nxt.inner), origem: origem('section#voz p', ini(nxt.inner), nxt.idx) }, origem: origem('section#voz h3', texto(m[2]), b.idx) }; });
const vozObj = {
  marcador: vh.marcador, rotulo: vh.rotulo, titulo: { texto: vh.h2, origem: vh.h2_origem }, lede: vh.lede, subsecoes: vIntro,
  perguntas_relampago: v1, ataques_de_decisor: v2, roteiro_oral: movs,
  contagens: { perguntas_relampago: v1.length, ataques: v2.length, movimentos: movs.length },
  origem: vh.origem,
  codigo_atual: 'Não extraído: nenhum item do § Voz em src/lib/data.',
};

// =================== PRINCIPIOS ===================
const allBoxes = [...body.matchAll(/<div class="box ([a-z]{2})">\s*<span class="tag">([\s\S]*?)<\/span>/g)].map((m) => ({ classe: `box ${m[1]}`, rotulo: texto(m[2]), secao: IDS.find((id) => { const s = sec(id); return m.index > s.start && m.index < s.end; }), linha_aprox: lineOf(m.index) }));
const formas = teseBlocos.filter((b) => b.tipo === 'formula-destaque');
const principios = {
  frase_para_decorar: formas[0],
  regua_das_quatro_perguntas: formas[1],
  callouts_da_tese: teseBlocos.filter((b) => b.tipo === 'callout'),
  aviso_do_rodape: identidade.rodape.linhas.slice(2),
  aviso_do_ref: 'ver aparato.json › referencias.aviso_final ("Números vivos · leia antes de citar qualquer coisa deste módulo")',
  linguagem_do_caso: 'ver aparato.json › caso › C.3 callout "Linguagem — trava 4"',
  indice_de_callouts: allBoxes,
};

// =================== ERROS COMUNS ===================
const erros = sec('erros');
const erh = head(erros);
const tbl = erh.blocos.find((b) => b.cls === 'scroll');
const rows = all(/<tr>([\s\S]*?)<\/tr>/g, tbl.outer, tbl.idx);
const cab = [...rows[0].m[1].matchAll(/<th>([\s\S]*?)<\/th>/g)].map((c) => texto(c[1]));
const errosItens = rows.slice(1).map(({ m, idx }, i) => {
  const c = [...m[1].matchAll(/<td>([\s\S]*?)<\/td>/g)].map((x) => x[1]);
  return { id: `m07-erro-${pad(i + 1)}`, erro_html: inner(c[0]), erro_texto: texto(c[0]), correcao_html: inner(c[1]), correcao_texto: texto(c[1]), origem: origem('section#erros table.tbl tr', ini(c[0]), idx) };
});
const errosObj = {
  secao_de_modulo: `section#erros (${erh.marcador} · ${erh.rotulo})`,
  titulo: { texto: erh.h2, origem: erh.h2_origem }, lede: erh.lede, cabecalho: cab, itens: errosItens,
  contagem_prosa: 'Dezoito frases', contagem_markup: errosItens.length,
  callouts_de_erro_nas_aulas: allBoxes.filter((b) => b.classe === 'box rd' && /^a0/.test(b.secao || '')),
  origem: erh.origem,
  codigo_atual: 'Não extraído: a tabela do § Erros não está em src/lib/data.',
};

// =================== blocos de produto (P7) ===================
const produto = allBoxes.filter((b) => /Onde isso entra no produto/.test(b.rotulo));

// =================== DIVERGENCIAS ===================
const divergencias = [];
const D = (id, tipo, tema, a, b, nota) => divergencias.push({ id, tipo, tema, leitura_a: a, leitura_b: b, nota: nota || null, resolvida: false });
D('div-m07-titulo-catalogo', 'fonte × catálogo', 'Título do módulo',
  { texto: `h1/title/rodapé: "${h1.m[1]}"; catálogo canônico (seção): "${catHead.m[1]}"`, linha: lineOf(h1.idx) },
  { texto: `alexandria-blocks.ts: "${b07.title}" (citado no catálogo canônico como "catálogo do repositório")`, linha: lineOf(bloco07.idx, blocksTs) },
  'P24: o catálogo canônico governa o nome; aqui o próprio catálogo canônico registra os dois títulos (tabela "Quatro divergências medidas", item 1). Não resolvido.');
D('div-m07-kicker-marca', 'fonte × decisão P24', 'Marca no kicker', { texto: kicker.m[1] }, { texto: 'P24: Alexandria/NIVAR; GridAlpha só em proveniência' }, `${identidade.marca_P24.ocorrencias_gridalpha.length} ocorrências de "GridAlpha" na fonte (linhas ${identidade.marca_P24.ocorrencias_gridalpha.map((o) => o.linha).join(', ')}).`);
D('div-m07-bloco-vs-modulo', 'fonte × fonte', 'Nome da unidade', { texto: '"Módulo 07" (kicker, title, rodapé)' }, { texto: '"Bloco 7" (frase para decorar: "currículo definitivo, Bloco 7"; § Lex "118 termos do Bloco 7"; régua "do Bloco 7"; referências a Blocos 8, 9 e 13)' }, 'Vocabulário do Currículo Definitivo (blocos) convive com o do produto (módulos).');
D('div-m07-seis-cinco', 'fonte × fonte', 'Contagem de módulos anteriores no § 00',
  { texto: '"Os seis módulos anteriores construíram camadas distintas." — e enumera 02, 03, 04, 05, 06 (cinco)', linha: lineOf(at('Os seis módulos anteriores')) },
  { texto: '"…que nenhuma das cinco entrega"', linha: lineOf(at('nenhuma das cinco entrega')) }, 'O Módulo 01 não é citado na enumeração.');
D('div-m07-quiz-p18', 'fonte × decisão P18', 'Critério 8/10', { texto: 'hero, h2 do § Quiz e script: ≥8 → "Critério de domínio atingido."; <8 → "Não avance para o §Voz"' }, { texto: 'P18: nenhum limiar legado declara domínio nem trava a próxima etapa' });
D('div-m07-criterio-duplo', 'fonte × fonte', 'O que é o critério do bloco',
  { texto: '§ Voz / 7.3: critério "duplo" (oral em 15 s + navegar portais sem tutorial)' },
  { texto: '§ Quiz: "critério 8/10"; § Final: 26 afirmações; caixa "Sequência recomendada": quiz → 40 perguntas → 7 ataques → roteiro gravado → 6 exercícios de navegação' },
  'Coerentes entre si como sequência, mas nenhuma formulação única; o critério oral e operacional não é automatizável (P14).');
D('div-m07-inst01-protocolo', 'documento × código', 'Inst · 01 "nunca materializado"',
  { texto: 'docs/alexandria/instrument-taxonomy.md: "Mapa institucional … nunca materializado como Instrument — 0 campos, chips clicáveis"' },
  { texto: 'código atual: m07-inst-01 existe (MODULO_07_INSTRUMENTOS, Wave 38), kind explorador, em RecursosDoModulo' }, 'Taxonomia desatualizada (pendência FOUNDRY).');
D('div-m07-inst02-kind', 'forma × semântica', 'Inst · 02 "Comparador"', { texto: 'título "Comparador de instrumentos jurídicos"; kind comparador no código' }, { texto: 'mecânica idêntica aos exploradores (seleção única revela ficha)' }, 'Já registrado na taxonomia; mantido.');
D('div-m07-caso-parte-7', 'fonte × decisão P17', 'Caso numerado "Parte 7"', { texto: 'card do § MAP "Operação A · Parte 7"; sec-id do § Caso "· Parte 7"' }, { texto: 'P17: sem "Partes" como estrutura de produto' }, 'Detalhe em aparato.json.');
D('div-m07-lex-ordem', 'prosa × markup', 'Contagens do § Lex', { texto: 'h2 "118 termos do Bloco 7"; soma dos summaries 16+17+15+14+18+22+16' }, { texto: '118 span.term no § Lex' }, 'Conferem (sem divergência numérica); registrado como verificação cruzada.');
D('div-m07-horas', 'fonte × catálogo', 'Horas', { texto: horasPill.texto }, { texto: `alexandria-blocks.ts min ${b07.estimatedHoursMin} / max ${b07.estimatedHoursMax}; catálogo canônico "6–8 h declaradas"` }, 'Conferem.');
D('div-m07-imagens', 'fonte × código', 'Gravuras', { texto: `zero <img>, <video>, <iframe> na fonte (medido: ${(html.match(/<img\b|<video\b|<iframe\b/gi) || []).length})` }, { texto: `código: illustrations ${JSON.stringify(AULAS_COD.map((a) => a.illustrations.length))} por aula (prefixo ins- do catálogo do repositório)` }, 'As gravuras vêm do acervo da Alexandria (camada produto), não do HTML.');
const codDivs = aulas.flatMap((a) => (a.codigo ? a.codigo.divergencias : []).map((d) => `${a.id_codigo}: ${d}`));
if (codDivs.length) D('div-m07-aulas-codigo', 'fonte × código', 'Corpo das aulas', { texto: 'fonte (ver roteiro[].subsecoes/fichas_institucionais)' }, { texto: codDivs.join(' | ') });

const comparacaoCodigo = {
  aulas: aulas.map((a) => ({ id: a.id_codigo, fonte_h2: a.titulo, fonte_rotulo: a.rotulo, codigo: a.codigo })),
  o_que_o_codigo_nao_tem: ['tese (§ 00)', 'cartões do § MAP', 'critérios literais', '§ Voz (40 perguntas, 7 ataques, roteiro de 8 movimentos)', '§ Erros (18 linhas)', '§ Caso', '§ Quiz', '§ Final (26 itens)', '§ Ref (27 itens)'],
  o_que_o_codigo_tem: ['7 aulas (MODULO_07_AULAS) com lead e corpo', '9 instrumentos de aula + m07-inst-01 de módulo', '12 exercícios soltos', '118 verbetes (alexandria-glossario.ts)'],
  badges: 'alexandria-badges.ts não tem entrada do M07.',
};

writeJSON('modulo.json', {
  modulo: 'M07',
  camada: 'fonte',
  fonte: 'C:/dev/GridAlpha v2/Alexandria modulos/alexandria_modulo07.html',
  gerado_por: 'extratores/m07_modulo.mjs',
  metodo: 'Seções por <section id>; blocos de nível de seção por walker de elemento (filhos diretos de .wrap); comparação com alexandria-modulo-07-content.ts, alexandria-trilhas.ts, alexandria-blocks.ts e com o catálogo canônico por leitura/avaliação dos literais.',
  contagens: {
    secoes: roteiro.length, aulas: aulas.length, aparatos: roteiro.length - aulas.length,
    subsecoes_por_aula: Object.fromEntries(aulas.map((a) => [a.id_codigo, a.subsecoes.length])),
    fichas_institucionais: aulas.reduce((s, a) => s + a.fichas_institucionais.length, 0),
    tres_niveis: aulas.reduce((s, a) => s + a.tres_niveis.length, 0),
    instrumentos_em_aulas: aulas.reduce((s, a) => s + a.instrumentos.length, 0),
    pills_do_hero: pills.length, cartoes_map: cards.length, criterios_literais: crit.length,
    perguntas_relampago: v1.length, ataques: v2.length, movimentos_roteiro_oral: movs.length,
    erros_comuns: errosItens.length, blocos_de_produto_P7: produto.length, callouts_total: allBoxes.length,
    ocorrencias_gridalpha: identidade.marca_P24.ocorrencias_gridalpha.length,
    divergencias: divergencias.length,
  },
  identidade,
  tese: teseObj,
  resultado_esperado: null,
  resultado_esperado_nota: 'O M07 não tem bloco "Resultado esperado"/capacidades (diferente do M01). O que a fonte declara como alvo está em: pills do hero, critério duplo (§ Voz / 7.3), as 26 afirmações do § Final (aparato.json) e a sequência recomendada. Nada foi convertido em capacidade.',
  mapa,
  roteiro,
  contagem_de_aulas: contagemAulas,
  criterios: crit,
  criterios_nota: 'marcacao_p14 é anotação desta extração (etiquetas: automatizavel_quiz, trava_de_avanco, producao_oral_ou_livre, cronometrado, gravacao, operacional_navegacao), inferida do texto; precisa de revisão humana.',
  laboratorios: null,
  laboratorios_nota: 'Não há § Lab no M07 (nenhuma seção ou marcador "Lab"). O instrumento de módulo é o Inst · 01, no § MAP (instrumentos.json).',
  voz: vozObj,
  principios,
  erros_comuns: errosObj,
  tradutor: null,
  tradutor_nota: 'Não há § Map "Tradutor" no M07. O § MAP é "Percurso e mapa institucional" (cartões + Inst · 01).',
  blocos_de_produto_P7: { itens: produto, nota: 'Caixas "Onde isso entra no produto" (uma por aula) — P7: fora da interface do learner. Texto literal fica no corpo das aulas.' },
  divergencias,
  comparacao_codigo: comparacaoCodigo,
});
console.log(JSON.stringify({ contagens: { secoes: roteiro.length, aulas: aulas.length }, cont: contagemAulas, aulasDiv: aulas.map((a) => [a.id_codigo, a.codigo.divergencias, a.codigo_blocos]), crit: crit.length, voz: vozObj.contagens, movs: movs.map((m) => [m.numero, m.tema, m.duracao, !!m.funcao_declarada]), v2: v2.map((x) => x.persona), erros: errosItens.length, produto: produto.length, boxes: allBoxes.length, gA: identidade.marca_P24.ocorrencias_gridalpha, cat: identidade.catalogo_canonico, tese: teseBlocos.map((b) => b.tipo).join(',') }, null, 1));
