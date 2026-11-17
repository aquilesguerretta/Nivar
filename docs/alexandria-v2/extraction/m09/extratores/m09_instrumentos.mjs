// Grupo "instrumentos" do M09 → instrumentos.json. Markup por linha; dados por literal do script (vm);
// saídas pelo script ORIGINAL executado em DOM simulado (protocolo §10).
import fs from 'node:fs';
import * as X from './lib.mjs';

const { ln, at, txt, strip, origem, pad, fail } = X;
const S = X.secoes();
const corpo = (s) => X.blocos(s.lede ? s.lede_linha + 1 : s.lede_linha, s.fim - 1, `section#${s.id_html}`);

// ── localizar os 11 instrumentos e o contexto de cada um ─────
const locais = [];
for (const s of S) {
  const bl = corpo(s);
  bl.forEach((b, i) => {
    if (b.tipo !== 'instrumento_ref') return;
    const antes = bl.slice(0, i).reverse();
    const prevTit = antes.find((x) => x.tipo === 'titulo');
    const prev = bl[i - 1], next = bl[i + 1];
    const resumo = (x) => x ? { tipo: x.tipo, rotulo: x.rotulo ?? x.numero ?? x.inst_id ?? null, trecho_inicial: x.origem.trecho_inicial, linha_aprox: x.origem.linha_aprox } : null;
    locais.push({ secao: s, b, subsecao: prevTit ? { numero: prevTit.numero, texto: prevTit.texto, linha_aprox: prevTit.origem.linha_aprox } : null, antes: resumo(prev), depois: resumo(next) });
  });
}
if (locais.length !== 11) fail('esperava 11 instrumentos, achei ' + locais.length);

// ── markup de um instrumento ─────────────────────────────────
function markup(k, f) {
  const r = { intro: null, disclaimer: null, seletores: [], campos: [], grades_dinamicas: [], readouts: [], vereditos: [], saidas_texto: [], legenda: null, desenho: null, conteineres_dinamicos: [] };
  let rotulo = null;
  for (let n = k; n <= f; n++) {
    const s = ln(n).trim();
    let m;
    if ((m = s.match(/^<p class="inst-intro">(.*)<\/p>$/))) r.intro = { ...txt(m[1]), origem: origem(n, '.inst-bd p.inst-intro') };
    else if ((m = s.match(/^<p class="disc">(.*)<\/p>$/))) r.disclaimer = { ...txt(m[1]), origem: origem(n, '.inst-bd p.disc') };
    else if ((m = s.match(/^<div class="seg-lb"[^>]*>(.*)<\/div>$/))) rotulo = { texto: m[1], linha_aprox: n };
    else if ((m = s.match(/^<div class="seg" id="([^"]+)"/))) {
      const bs = X.botoesSeg(m[1]);
      const dataAttr = Object.keys(bs[0].attrs).find((a) => a.startsWith('data-'));
      r.seletores.push({ id_html: m[1], rotulo: rotulo?.texto ?? null, rotulo_linha: rotulo?.linha_aprox ?? null, atributo: dataAttr, opcoes: bs.map((b) => ({ valor: b.attrs[dataAttr], rotulo: b.rotulo, padrao: /\bon\b/.test(b.attrs.class || ''), linha_aprox: b.linha })), origem: origem(n, `.seg#${m[1]}`) });
    } else if (/^<div class="field">$/.test(s)) {
      const lab = ln(n + 1).match(/<div class="field-label"><span>(.*?)<\/span><span class="unit">(.*?)<\/span><\/div>/) || fail('field-label ' + n);
      const ins = [];
      let j = n + 2;
      for (; /<input/.test(ln(j)); j++) ins.push(X.attrs(ln(j)));
      const num = ins.find((a) => a.type === 'number' || a.type === 'text');
      const rng = ins.find((a) => a.type === 'range');
      r.campos.push({ id_html: num.id, rotulo: lab[1], unidade: lab[2], tipo_input: num.type, padrao: num.value, min: num.min ?? null, max: num.max ?? null, passo: num.step ?? null, deslizador_gemeo: rng ? { id_html: rng.id, padrao: rng.value, min: rng.min, max: rng.max, passo: rng.step } : null, origem: origem(n + 1, '.field .field-label') });
      n = j;
    } else if ((m = s.match(/^<div class="tr-grid" id="([^"]+)"><\/div>$/))) r.grades_dinamicas.push({ id_html: m[1], rotulo: rotulo?.texto ?? null, linha_aprox: n });
    else if ((m = s.match(/^<div class="ro"><div class="k">(.*?)<\/div><div class="([^"]*)" id="([^"]+)">(.*?)<\/div>(?:<div class="u">(.*?)<\/div>)?<\/div>$/))) r.readouts.push({ id_html: m[3], rotulo: m[1], unidade: m[5] ?? null, classe: m[2], valor_estatico_no_markup: m[4], linha_aprox: n });
    else if ((m = s.match(/^<div class="(verdict[^"]*)" id="([^"]+)"[^>]*>(.*)<\/div>$/))) r.vereditos.push({ id_html: m[2], classe_estatica: m[1], texto_estatico_no_markup: m[3] || null, linha_aprox: n });
    else if ((m = s.match(/^<div class="out" id="([^"]+)"><\/div>$/))) r.saidas_texto.push({ id_html: m[1], linha_aprox: n });
    else if ((m = s.match(/^<div id="([^"]+)"><\/div>$/))) r.conteineres_dinamicos.push({ id_html: m[1], linha_aprox: n });
    else if (/^<div class="leg">$/.test(s)) {
      const it = [];
      for (let j = n + 1; !/^\s*<\/div>/.test(ln(j)); j++) it.push(strip(ln(j)));
      r.legenda = { itens: it, linha_aprox: n };
    } else if (/^<svg /.test(s)) {
      const fim = X.achaLinha('</svg>', n);
      const grupos = [];
      let g = null;
      for (let j = n; j <= fim; j++) {
        const gm = ln(j).match(/<g (?:id="([^"]+)"|class="mp-node" data-n="([^"]+)")/);
        if (gm) { g = { grupo: gm[1] ?? `mp-node:${gm[2]}`, textos: [], linha_aprox: j }; grupos.push(g); }
        const tm = ln(j).match(/<text [^>]*>(.*)<\/text>/);
        if (tm && g) g.textos.push(tm[1]);
      }
      r.desenho = { aria_label: at(n, /aria-label="([^"]+)"/), grupos, linhas: [n, fim], nota: 'SVG estático (desenho não porta — protocolo §12); os rótulos entram aqui como texto.' };
      n = fim;
    }
  }
  return r;
}

// ── execução do script original ──────────────────────────────
const run = (setup) => { const d = X.executar(); if (setup) setup(d); return d; };
const leitura = (d, ids) => Object.fromEntries(ids.map((id) => [id, X.le(d, id)]));
const ROT = (n) => `INST·${pad(n)}`;

// ── especificações por instrumento (ids de elementos e literais do script) ──
const specs = {
  1: {
    literais: ['FLUXO', 'NODE'],
    saidas: ['mp-flow', 'mp-node'],
    kind: ['explorador', 'Dois seletores (fluxo; agente clicável no SVG) → texto; zero saída numérica. Mesma forma dos explorador do M07.'],
    enumerar() {
      const d = run();
      const res = [];
      for (const f of ['fisico', 'contrato', 'dinheiro']) {
        X.clicaSeg(d, 'mp-seg', 'data-f', f);
        for (const g of d.nodes) { g.fire('click'); res.push({ fluxo: f, agente: g.getAttribute('data-n'), classe: X.le(d, 'mp-node').classe }); }
      }
      return { combinacoes: res.length, nota: '3 fluxos × 8 agentes = 24 leituras (NODE[agente][fluxo]), mais 3 textos de fluxo (FLUXO). Todas as 24 renderizam com classe "verdict att".', classes: [...new Set(res.map((r) => r.classe))] };
    },
  },
  2: {
    literais: ['CLS', 'COMP', 'txt'],
    saidas: ['cmp-c1', 'cmp-c2', 'cmp-c3', 'cmp-c4', 'cmp-note', 'cmp-out'],
    kind: ['explorador', 'Chip de componente → quatro cartões de texto + nota por classe. Os quatro contadores do readout são estáticos (o script nunca os escreve).'],
    enumerar(lit) {
      const comp = lit.COMP.valor;
      const cont = { f: 0, m: 0, p: 0, n: 0 };
      comp.forEach((c) => { cont[c.cl]++; });
      const d = run();
      const est = ['cmp-c1', 'cmp-c2', 'cmp-c3', 'cmp-c4'].map((id) => ({ id, valor_markup: X.le(d, id).texto, escritas_pelo_script: X.le(d, id).escritas, linha_aprox: X.estatico(id).linha }));
      return { componentes: comp.length, contagem_por_classe_nos_dados: { troca_de_fornecedor_f: cont.f, muda_de_mecanismo_m: cont.m, permanece_devido_p: cont.p, passa_a_existir_n: cont.n }, readout_estatico: est, nota: 'Markup: 1 / 3 / 4 / 2 (fornecedor / mecanismo / permanece / novo). Dados do script: 1 / 4 / 3 / 2. Os dois do meio estão trocados, e como o script nunca escreve cmp-c1..c4, a tela mostra a contagem errada.' };
    },
  },
  3: {
    literais: ['LEI', 'MOD'],
    saidas: ['lei-out', 'lei-mod'],
    kind: ['explorador', 'Família (dois grupos de botões que se excluem) + modalidade → 5 cartões + veredito de modalidade. Zero saída numérica.'],
    enumerar(lit) {
      return { familias: Object.keys(lit.LEI.valor).length, campos_por_familia: Object.keys(lit.LEI.valor.nova).filter((k) => k !== 'n').length, modalidades: Object.keys(lit.MOD.valor).length, nota: 'A intro diz "quatro perguntas idênticas para cada uma"; o render mostra cinco cartões por família (obj, risco, prazo, cuidado, ler).' };
    },
  },
  4: {
    literais: ['REQ'],
    funcoes: ['addMonths'],
    saidas: ['el-n', 'el-p', 'el-e', 'el-v', 'el-out'],
    kind: ['simulador', 'Segmento + 5 chaves booleanas SEM peso (só a contagem importa) + 3 campos → 3 readouts textuais + veredito. Candidato alternativo: quebra-cabeca (chaves → estado agregado). Decisão de tipo fica para a wave de porte.'],
    enumerar() {
      const res = [];
      for (const seg of ['ga', 'bt1', 'bt2']) for (let n = 0; n <= 5; n++) {
        const d = run((dd) => { X.clicaSeg(dd, 'el-seg', 'data-s', seg); for (let i = 0; i < n; i++) X.clicaDinamico(dd, 'el-req', 'button', (b) => b.getAttribute('data-i') === String(i)); });
        const o = leitura(d, ['el-n', 'el-p', 'el-e', 'el-v']);
        res.push({ segmento: seg, requisitos_marcados: n, cumpridos: o['el-n'].texto, prazo: o['el-p'].texto, estado: o['el-e'].texto, classe_veredito: o['el-v'].classe, veredito_texto: o['el-v'].texto });
      }
      const dedup = [];
      for (const r of res) if (!dedup.some((x) => x.segmento === r.segmento && x.estado === r.estado && x.prazo === r.prazo)) dedup.push(r);
      return { espaco: '3 segmentos × 6 contagens (a ordem das chaves não muda a saída)', ramos_renderizados: dedup, nota: 'Para "ga" os requisitos não mudam nada. Para bt1/bt2 o estado só muda com os 5 marcados.' };
    },
  },
  5: {
    literais: ['HZ', 'VOL', 'FLEX', 'IDX', 'SUB'],
    saidas: ['mc-r1', 'mc-r2', 'mc-r3', 'mc-r4', 'mc-v', 'mc-out'],
    kind: ['quebra-cabeca', 'Cinco seletores; cada opção tem peso "cam" (0, 1 ou 2) e a soma é o índice de camadas descobertas → veredito por faixa. Mesmo padrão do "Termômetro · Risco de captura" (M05). Alternativa: simulador.'],
    enumerar(lit) {
      const V = (o) => Object.keys(lit[o].valor);
      const dist = {}; const classe = {}; let exMax = null, exMin = null;
      for (const hz of V('HZ')) for (const vol of V('VOL')) for (const fx of V('FLEX')) for (const ix of V('IDX')) for (const sb of V('SUB')) {
        const d = run((dd) => { X.clicaSeg(dd, 'mc-hz', 'data-v', hz); X.clicaSeg(dd, 'mc-vol', 'data-v', vol); X.clicaSeg(dd, 'mc-flex', 'data-v', fx); X.clicaSeg(dd, 'mc-idx', 'data-v', ix); X.clicaSeg(dd, 'mc-sub', 'data-v', sb); });
        const cam = X.le(d, 'mc-r4').texto;
        dist[cam] = (dist[cam] || 0) + 1;
        classe[cam] = X.le(d, 'mc-v').classe;
        const soma = lit.HZ.valor[hz].cam + lit.VOL.valor[vol].cam + lit.FLEX.valor[fx].cam + lit.IDX.valor[ix].cam + lit.SUB.valor[sb].cam;
        if (String(soma) !== cam) fail('INST05 soma divergente');
        if (cam === '6' && !exMax) exMax = { escolhas: { hz, vol, fx, ix, sb }, veredito_texto: X.le(d, 'mc-v').texto };
        if (cam === '0' && !exMin) exMin = { escolhas: { hz, vol, fx, ix, sb }, veredito_texto: X.le(d, 'mc-v').texto };
      }
      return { combinacoes: Object.values(dist).reduce((a, b) => a + b, 0), distribuicao_camadas: dist, classe_por_camadas: classe, maximo_alcancavel: 6, exemplo_maximo: exMax, exemplo_minimo: exMin, nota: 'O readout diz "de 5" e o veredito "de cinco possíveis", mas a soma máxima dos pesos é 1+2+1+1+1 = 6 (horizonte longo + volume plano + rígido + câmbio ou curto prazo + submercado diferente). Texto "6 camadas descobertas de cinco possíveis" é alcançável.' };
    },
  },
  6: {
    literais: ['RISCOS', 'CONTRATOS', 'M'],
    saidas: ['mx-out', 'mx-res'],
    kind: ['explorador', 'Estrutura (dois grupos que se excluem) × classe de risco → 4 cartões de texto. Zero saída numérica.'],
    enumerar(lit) {
      const Mv = lit.M.valor;
      const celulas = Object.keys(Mv).flatMap((c) => Object.keys(Mv[c]).map((r) => ({ c, r, campos: Mv[c][r].length })));
      return { estruturas: Object.keys(Mv).length, classes: lit.RISCOS.valor.length, celulas: celulas.length, campos_por_celula: [...new Set(celulas.map((x) => x.campos))], ramo_celula_incompleta_alcancavel: celulas.some((x) => x.campos < 4) || celulas.length < 42, nota: 'As 42 células têm 4 campos (quem carrega, o que dispara, o que mitiga, o que sobra descoberto). A intro diz "três perguntas idênticas". O ramo "Célula incompleta" do script é inalcançável com os dados atuais.' };
    },
  },
  7: {
    literais: [],
    saidas: ['ex-p', 'ex-m', 'ex-os', 'ex-oh', 'ex-vd'],
    kind: ['simulador', 'Cinco campos + forma de entrega → 4 readouts (2 numéricos, 2 percentuais com "%") + veredito por faixa.'],
    enumerar() {
      const casos = [];
      const cenario = (nome, vals, forma) => {
        const d = run((dd) => { Object.entries(vals).forEach(([k, v]) => X.digita(dd, k, v)); if (forma) X.clicaSeg(dd, 'ex-seg', 'data-e', forma); });
        const o = leitura(d, ['ex-p', 'ex-m', 'ex-os', 'ex-oh', 'ex-vd']);
        casos.push({ nome, entradas: { ...vals, forma: forma ?? 'flat' }, exposicao: o['ex-p'].texto, volume: o['ex-m'].texto, origem_sazonal: o['ex-os'].texto, origem_horaria: o['ex-oh'].texto, classe: o['ex-vd'].classe });
      };
      cenario('padrão', {}, null);
      cenario('padrão, sazonalizado', {}, 'sazo');
      cenario('padrão, modulado', {}, 'mod');
      cenario('sazonalizado, banda 15', { 'ex-f': 15 }, 'sazo');
      cenario('plano, tudo zero', { 'ex-s': 0, 'ex-h': 0, 'ex-f': 0 }, null);
      cenario('fora da faixa (sazonal 999 → 60)', { 'ex-s': 999 }, null);
      return { cenarios: casos, nota: 'Cenários de conferência, rodados no script original. Os três ramos de veredito (exp<3, <8, ≥8) são alcançáveis.' };
    },
  },
  8: {
    literais: [],
    saidas: ['gs-a', 'gs-c', 'gs-d', 'gs-s', 'gs-vd'],
    kind: ['simulador', 'Três campos → 3 readouts numéricos + situação textual + veredito composto (faixa do fator × sinal da diferença).'],
    enumerar() {
      const casos = [];
      for (const f of ['0.80', '0.92', '1.05']) for (const v of ['80', '92', '95']) {
        const d = run((dd) => { X.digita(dd, 'gs-f', f); X.digita(dd, 'gs-v', v); });
        const o = leitura(d, ['gs-a', 'gs-c', 'gs-d', 'gs-s', 'gs-vd']);
        casos.push({ fator: f, garantia: '100', posicao_pct: v, alocada: o['gs-a'].texto, contratada: o['gs-c'].texto, diferenca: o['gs-d'].texto, situacao: o['gs-s'].texto, classe: o['gs-vd'].classe });
      }
      return { cenarios: casos, nota: '3 faixas de fator × 3 sinais de diferença: os 9 ramos compostos são alcançáveis. Rótulo: diferença > 0,05 (vendeu mais do que recebeu de alocação) = "posição comprada"; o glossário do módulo define posição comprada pela ótica do consumidor ("a medição excede o montante contratado").' };
    },
  },
  9: {
    literais: ['Q'],
    saidas: ['rt-n', 'rt-l', 'rt-i', 'rt-v', 'rt-out'],
    kind: [null, 'Seis perguntas ternárias (Sim/Não/Não sei), duas classes de pergunta (dado × impedimento) → 3 contadores + veredito em 4 ramos com prioridade. Não é o "Roteador de decisão" do M07 (explorador, select → texto): nome igual, mecânica diferente (taxonomia §3). Decisão de tipo pendente.'],
    enumerar(lit) {
      const Qv = lit.Q.valor;
      const vals = ['sim', 'nao', 'ns'];
      const dist = {}; const impVisto = new Set();
      let total = 0;
      const idx = Array(6).fill(0);
      for (;;) {
        const d = run((dd) => { Qv.forEach((q, i) => X.clicaDinamico(dd, 'rt-qs', 'label', (l) => l.getAttribute('data-k') === q.k && l.getAttribute('data-v') === vals[idx[i]])); });
        const v = X.le(d, 'rt-v');
        const chave = `${v.classe} | ${v.texto.slice(0, 45)}`;
        dist[chave] = (dist[chave] || 0) + 1;
        const out = X.le(d, 'rt-out').texto;
        Qv.forEach((q) => { if (q.imp && out.includes(q.imp)) impVisto.add(q.k); });
        total++;
        let p = 0;
        while (p < 6 && ++idx[p] === 3) { idx[p] = 0; p++; }
        if (p === 6) break;
      }
      const impMortos = Qv.filter((q) => q.imp && !impVisto.has(q.k)).map((q) => ({ k: q.k, tipo: q.tipo, imp: q.imp }));
      return { combinacoes: total, distribuicao_veredito: dist, textos_imp_nunca_exibidos: impMortos, nota: 'Espaço inteiro (3^6 = 729) rodado no script original. "Não sei" em qualquer pergunta vence um impedimento determinado: o veredito vira "Não é possível concluir", mas os cartões de impedimento continuam aparecendo. Os textos imp das perguntas tipo "dado" (estabilidade, proposta) nunca aparecem.' };
    },
  },
  10: {
    literais: ['ET'],
    saidas: ['cc-out', 'cc-v'],
    kind: ['explorador', 'Chip de etapa → 4 cartões + veredito com número da etapa. Mesmo prefixo "Régua" do M07 ("Régua do ciclo mensal", simulador com campos em dias) e mecânica diferente.'],
    enumerar(lit) { return { etapas: lit.ET.valor.length, campos_por_etapa: Object.keys(lit.ET.valor[0]).length - 1 }; },
  },
  11: {
    literais: ['LD'],
    saidas: ['ld-out'],
    kind: ['explorador', 'Chip de pergunta → 4 cartões. Sem veredito. Mesma mecânica do "Localizador de dado" do M07 (m07-inst-09, explorador), conferida no calculators.'],
    enumerar(lit) { return { perguntas: lit.LD.valor.length, campos_por_pergunta: Object.keys(lit.LD.valor[0]).length - 1 }; },
  },
};

// ── linhas de fórmula / ramos, por instrumento ───────────────
const trechosCodigo = {
  2: [['var sel=0;', 1], ["note.textContent=txt[c.cl];", 2]],
  3: [["var l=segVal('lei-seg','data-l')", 2], ["var m=segVal('mod-seg','data-m')||'qtd';", 3]],
  4: [['function addMonths(str,m){', 9], ['var n=marc.filter(Boolean).length;', 30]],
  5: [['var cam=hz.cam+vol.cam+fx.cam+ix.cam+sb.cam;', 17]],
  7: [['var C=numOf($id(\'ex-c\')', 26]],
  8: [["var f=numOf($id('gs-f')", 34]],
  9: [['function calc(){', 47]],
  1: [['function render(){', 13]],
  6: [["var c=segVal('mx-c1','data-c')", 23]],
  10: [["var e=ET[sel];", 10]],
  11: [["var l=LD[sel];", 7]],
};

// ── menções no texto (frases verificadas na fonte) ───────────
const mencoes = {
  1: ['O teste do guardanapo, versão mínima'],
  2: ['O Eixo 1 é a especificação funcional'],
  4: ['a régua de elegibilidade são o núcleo'],
  5: ['As onze perguntas de leitura e as seis fichas'],
  6: ['vai reaparecer, aberta em detalhe, na Aula 05', 'a Aula 05 a abre em matriz completa', 'A matriz contrato × risco é o motor', 'A matriz de contrato por risco diz'],
  7: ['O simulador de exposição é a ponte'],
  9: ['O roteador é a especificação funcional', 'Um roteador de decisão sobre migração'],
  10: ['O Módulo 07 ensinou <b>quem</b> faz', 'O Módulo 07 ensinou quem executa cada etapa'],
};

const catalogo = fs.readFileSync(X.CATALOGO, 'utf8').split('\n');
const catInst = {};
catalogo.forEach((x, i) => { const m = x.match(/^\| (INST·\d\d) \| (.*?) \| (.*?) \|$/); if (m && i > catalogo.findIndex((y) => y.startsWith('## Módulo 09')) && i < catalogo.findIndex((y) => y.startsWith('## Módulo 10'))) catInst[m[1]] = { nome: m[2], descricao: m[3], linha: i + 1 }; });
const calc = X.lerCodigo('calculadoras');
const recursos = X.lerCodigo('recursos');

// ── montar ───────────────────────────────────────────────────
const d0 = run();
const instrumentos = locais.map((L0, idx) => {
  const n = idx + 1;
  const b = L0.b;
  if (b.inst_id !== ROT(n)) fail(`ordem: ${b.inst_id} ≠ ${ROT(n)}`);
  const sp = specs[n];
  const mk = markup(b.linhas[0], b.linhas[1]);
  const bloco = X.blocoScript(ROT(n));
  const lit = Object.fromEntries(sp.literais.map((nome) => [nome, X.literal(ROT(n), nome)]));
  // bloco inteiro do instrumento no script, menos as linhas já cobertas por dados_literais e linhas vazias
  const cobertas = new Set();
  Object.values(lit).forEach((v) => { for (let k = v.linhas[0]; k <= v.linhas[1]; k++) cobertas.add(k); });
  const trechos = X.codigo(bloco.ini + 1, bloco.fim - 1).filter((c) => c.codigo && !cobertas.has(c.linha_aprox));
  const pontosChave = (trechosCodigo[n] || []).map(([needle]) => ({ trecho: needle, linha_aprox: X.achaLinha(needle, bloco.ini, bloco.fim) }));
  const cat = catInst[ROT(n)];
  const noCalc = new RegExp(`'m09-inst-${pad(n)}'`).test(calc);
  const isAula = /^a\d\d$/.test(L0.secao.id_html);
  return {
    id: `m09-inst-${pad(n)}`,
    tipo: 'instrumento',
    inst_id_fonte: b.inst_id,
    titulo: b.nome,
    pergunta: null,
    pergunta_nota: 'Nenhum instrumento do M09 declara pergunta própria. A intro (inst-intro) descreve o que fazer; a pergunta de previsão, se houver, é da camada Alexandria (P19 como precedente).',
    intro: mk.intro,
    disclaimer: mk.disclaimer,
    local: {
      secao: L0.secao.id_html,
      marcador: L0.secao.marcador,
      aula: isAula ? `aula-09-${L0.secao.id_html.slice(1)}` : null,
      aula_nota: isAula ? null : 'Fora de aula: §MAP (vai para Recursos do Módulo, protocolo §3).',
      subsecao_anterior: L0.subsecao,
      bloco_antes: L0.antes,
      bloco_depois: L0.depois,
      linhas_markup: b.linhas,
    },
    mencoes_no_texto: (mencoes[n] || []).map((f) => ({ frase: f, linha_aprox: X.achaLinha(f) })),
    entradas: { seletores: mk.seletores, campos: mk.campos, grades_dinamicas: mk.grades_dinamicas, conteineres_dinamicos: mk.conteineres_dinamicos },
    saidas: { readouts: mk.readouts, vereditos: mk.vereditos, cartoes: mk.saidas_texto },
    legenda: mk.legenda,
    desenho: mk.desenho,
    script: {
      bloco_linhas: [bloco.ini, bloco.fim],
      comentario_cabecalho: ln(bloco.ini).trim(),
      dados_literais: Object.fromEntries(Object.entries(lit).map(([k, v]) => [k, { linhas: v.linhas, valor: v.valor }])),
      pontos_de_entrada: pontosChave,
      codigo_de_calculo_e_ramos: trechos,
      nota: 'codigo_de_calculo_e_ramos é cópia verbatim de todas as linhas do bloco do instrumento no script (trim), exceto as de dados_literais e as vazias. Fórmulas, limiares e textos de ramo com interpolação estão aí; pontos_de_entrada aponta onde começam o cálculo e o render.',
    },
    cenario_padrao: {
      entradas: { seletores: Object.fromEntries(mk.seletores.map((s) => [s.id_html, s.opcoes.find((o) => o.padrao)?.valor ?? null])), campos: Object.fromEntries(mk.campos.map((c) => [c.id_html, c.padrao])) },
      saidas_renderizadas: leitura(d0, sp.saidas),
      metodo: 'script original executado em DOM simulado (extratores/lib.mjs → executar), sem interação; texto = textContent sem tags.',
    },
    enumeracao: sp.enumerar(lit),
    fonte_dos_numeros: null,
    fonte_dos_numeros_nota: [4, 5, 7, 8].includes(n)
      ? 'A fonte não declara origem para coeficientes, pesos, limiares e padrões (ex.: 0,15 e 0,20 no INST·07; pesos cam no INST·05; 0,85/1,0/±0,05 no INST·08; 24/36 meses e "11/2025" no INST·04 vêm da Lei 15.269/2025 citada na Aula 03, mas o instrumento não cita). Tratar como cenário didático (P19).'
      : 'Instrumento sem número calculado; o texto é qualitativo.',
    tolerancias: null,
    tolerancias_nota: 'Nenhuma tolerância declarada. Não há resposta de referência (ref/tol) em nenhum dos 11.',
    kind_candidato: { valor: sp.kind[0], justificativa: sp.kind[1], nota: 'Anotação desta extração (taxonomia §"Como decidir"), não texto da fonte.' },
    codigo: {
      estado: noCalc ? 'portado' : 'não portado',
      calculators: noCalc ? 'm09-inst presente' : 'nenhuma chave m09-inst-* em alexandria-instrument-calculators.ts',
      aula_instruments: isAula ? `aula-09-${L0.secao.id_html.slice(1)}.instruments = []` : null,
      recursos_do_modulo: /'modulo-09': \{ exercicios: MODULO_09_EXERCICIOS_SOLTOS, instrumentos: \[\] \}/.test(recursos) ? "RecursosDoModulo.tsx: 'modulo-09' → instrumentos: []" : 'revisar',
    },
    catalogo_canonico: cat ? { nome: cat.nome, nome_igual: cat.nome === b.nome, descricao_resumo: cat.descricao, linha: cat.linha } : null,
    origem: origem(b.linhas[0] + 2, `section#${L0.secao.id_html} .inst .inst-hd`),
  };
});

// ── divergências dos instrumentos ────────────────────────────
const I = (n) => instrumentos[n - 1];
const D = (id, sev, tema, leituras, nota, grupo) => ({ id, severidade: sev, grupo, tema, leituras, nota, decisao: 'não escolhida — registrar' });
const divergencias = [
  D('div-m09-inst02-contadores', 'alta', 'INST·02: readout estático contradiz a classificação dos dados', [
    { onde: 'markup L717-720', literal: I(2).saidas.readouts.map((r) => `${r.rotulo} ${r.valor_estatico_no_markup}`).join(' | ') },
    { onde: 'script COMP (cl)', literal: JSON.stringify(I(2).enumeracao.contagem_por_classe_nos_dados) },
  ], '"Muda de mecanismo" e "Permanece devido" estão trocados no markup (3/4 × 4/3). O script nunca reescreve cmp-c1..c4, então o erro aparece na tela.', 'fonte×fonte'),
  D('div-m09-inst02-nota-inicial', 'baixa', 'INST·02: nota estática × nota do script', [
    { onde: 'markup L723', literal: I(2).saidas.vereditos[0].texto_estatico_no_markup },
    { onde: 'script txt.f (renderizado no carregamento)', literal: I(2).script.dados_literais.CLS ? I(2).cenario_padrao.saidas_renderizadas['cmp-note'].texto : null },
  ], 'O script sobrescreve no carregamento; a versão do markup nunca aparece. A classe também muda (att → ok).', 'fonte×fonte'),
  D('div-m09-inst03-quatro-perguntas', 'baixa', 'INST·03: "quatro perguntas idênticas" × cinco cartões', [
    { onde: 'inst-intro L839', literal: 'Seis famílias de produto, quatro perguntas idênticas para cada uma.' },
    { onde: 'script render()', literal: 'Objeto econômico | Risco que resolve | Prazo e uso típico | Cuidado analítico | O que ler no edital' },
  ], '', 'fonte×fonte'),
  D('div-m09-inst05-seis-de-cinco', 'alta', 'INST·05: soma máxima 6 × "de cinco possíveis"', [
    { onde: 'readout L1290 e veredito', literal: 'Camadas descobertas … de 5 / camadas descobertas de cinco possíveis' },
    { onde: 'pesos cam (HZ/VOL/FLEX/IDX/SUB)', literal: `máximo 6; distribuição ${JSON.stringify(I(5).enumeracao.distribuicao_camadas)}` },
  ], 'VOL.flat pesa 2, então cinco dimensões chegam a 6. O texto "6 camadas descobertas de cinco possíveis" é renderizável (ver enumeracao.exemplo_maximo).', 'fonte×fonte'),
  D('div-m09-inst06-tres-perguntas', 'baixa', 'INST·06: "três perguntas idênticas" × quatro campos por célula', [
    { onde: 'inst-intro L1366', literal: 'Cada célula responde três perguntas idênticas: quem carrega, o que dispara e o que mitiga.' },
    { onde: 'script M[c][r] (42 células × 4)', literal: 'quem carrega | o que dispara | o que mitiga | o que sobra descoberto' },
  ], 'O h2 da Aula 05 e o veredito do instrumento ("o quarto campo") usam os quatro. Só a intro diz três. O catálogo canônico repete "três".', 'fonte×fonte×catalogo'),
  D('div-m09-inst09-estatico', 'baixa', 'INST·09: veredito estático × inicial do script', [
    { onde: 'markup L1687', literal: I(9).saidas.vereditos[0].texto_estatico_no_markup },
    { onde: 'script calc() com n<6', literal: I(9).cenario_padrao.saidas_renderizadas['rt-v'].texto },
  ], '', 'fonte×fonte'),
  D('div-m09-inst09-imp-morto', 'média', 'INST·09: textos de impedimento que nunca aparecem; "não sei" vence impedimento', [
    { onde: 'script Q (tipo "dado" com imp)', literal: I(9).enumeracao.textos_imp_nunca_exibidos.map((q) => q.k).join(', ') },
    { onde: 'script calc()', literal: "if(ns>0){…'Não é possível concluir…'} else if(imped.length>0){…'Não vale…'}" },
  ], 'Texto morto na fonte (a própria Q10 do quiz chama veredito inalcançável de "código morto"). A prioridade "não sei" > impedimento é comportamento literal; registrar, não corrigir.', 'fonte×fonte'),
  D('div-m09-inst01-estatico', 'baixa', 'INST·01: "Selecione um fluxo acima." nunca aparece', [
    { onde: 'markup L647', literal: 'Selecione um fluxo acima.' },
    { onde: 'script render() no carregamento', literal: 'FLUXO.fisico (fluxo padrão "fisico")' },
  ], '', 'fonte×fonte'),
  D('div-m09-inst08-rotulo', 'baixa', 'INST·08: "posição comprada" para quem vendeu além da alocação', [
    { onde: 'script L3088', literal: "(diff>0.05?'posição comprada':(diff<-0.05?'posição vendida':'equilibrada'))" },
    { onde: '§Lex Grupo 5 L2266', literal: 'Posição comprada — situação em que a medição excede o montante contratado alocado, exigindo compra da diferença.' },
  ], 'Coerente no sentido "precisa comprar a diferença", mas o verbete é escrito pela ótica do consumidor e o instrumento é de gerador. Ambiguidade de leitura, não erro de cálculo.', 'fonte×fonte'),
  D('div-m09-inst-nomes-mesmos-prefixos', 'baixa', 'Prefixos repetidos de outros módulos com mecânica diferente', [
    { onde: 'M09 INST·09 "Roteador — …"', literal: '6 perguntas ternárias → 4 ramos' },
    { onde: 'M07 "Roteador de decisão"', literal: 'explorador (select → texto), taxonomia' },
    { onde: 'M09 INST·10 "Régua do ciclo comercial"', literal: 'explorador (chip → texto)' },
    { onde: 'M07 "Régua do ciclo mensal"', literal: 'simulador (5 campos em dias → 3 saídas), taxonomia' },
  ], 'Taxonomia §3: nome não decide. O INST·11 (Localizador) é o único homônimo com a mesma mecânica do M07.', 'taxonomia'),
  D('div-m09-inst-codigo', 'alta', 'Nenhum dos 11 instrumentos está portado', [
    { onde: 'fonte', literal: '11 (INST·01 no §MAP, 10 em aula; Aula 08 com três)' },
    { onde: 'código', literal: 'instruments: [] nas 8 aulas; zero m09-inst-* em calculators; RecursosDoModulo modulo-09 instrumentos: []' },
  ], 'Bate com o comentário do próprio arquivo e com o catálogo canônico ("11 | 0").', 'fonte×codigo'),
];
const nomesCat = instrumentos.filter((i) => i.catalogo_canonico && !i.catalogo_canonico.nome_igual);
if (nomesCat.length) divergencias.push(D('div-m09-inst-nomes-catalogo', 'baixa', 'Nome de instrumento difere no catálogo canônico', nomesCat.map((i) => ({ onde: i.inst_id_fonte, literal: `${i.titulo} × ${i.catalogo_canonico.nome}` })), '', 'fonte×catalogo'));

const out = {
  schema: 'alexandria-v2/extraction/instrumentos@1',
  modulo: 'm09',
  grupo: 'instrumentos',
  fonte: { arquivo: X.SRC, linhas_total: X.L.length, bytes: Buffer.byteLength(X.RAW), script_linhas: [X.SCRIPT_INI, X.SCRIPT_FIM] },
  gerado_em: '2026-09-17',
  metodo: 'extratores/m09_instrumentos.mjs. Markup por linha. Dados: literais var X={…}/[…] do <script> avaliados com vm (só dados). Saídas: o <script> inteiro executado sem alteração num DOM simulado (lib.mjs), com cliques e digitação simulados; espaços finitos rodados por inteiro (INST·05: 288; INST·09: 729; INST·04: 18).',
  convencoes: {
    valor_estatico_no_markup: 'o que o HTML traz antes do script rodar; pode nunca aparecer na tela',
    saidas_renderizadas: 'resultado do script original; texto sem tags e html com tags',
    kind_candidato: 'anotação desta extração',
  },
  contagem: {
    na_fonte: instrumentos.length,
    pill_hero: '11 instrumentos',
    em_aula: instrumentos.filter((i) => i.local.aula).length,
    fora_de_aula: instrumentos.filter((i) => !i.local.aula).length,
    por_secao: Object.fromEntries([...new Set(instrumentos.map((i) => i.local.secao))].map((s) => [s, instrumentos.filter((i) => i.local.secao === s).length])),
    portados: instrumentos.filter((i) => i.codigo.estado === 'portado').length,
    nao_portados: instrumentos.filter((i) => i.codigo.estado === 'não portado').length,
    divergentes: 0,
    com_calculo_numerico: [4, 5, 7, 8, 9].map((n) => `m09-inst-${pad(n)}`),
  },
  instrumentos,
  divergencias,
};
X.escreve('instrumentos.json', out);
console.log('instrumentos ok', JSON.stringify(out.contagem));
for (const i of instrumentos) console.log(i.inst_id_fonte, i.local.secao, '| sel', i.entradas.seletores.length, 'campos', i.entradas.campos.length, 'ro', i.saidas.readouts.length, 'vd', i.saidas.vereditos.length, '| cat', i.catalogo_canonico?.nome_igual, '| kind', i.kind_candidato.valor, '| trechos', i.script.codigo_de_calculo_e_ramos.length);
console.log(JSON.stringify(I(5).enumeracao.distribuicao_camadas), JSON.stringify(I(5).enumeracao.classe_por_camadas));
console.log(JSON.stringify(I(9).enumeracao.distribuicao_veredito), JSON.stringify(I(9).enumeracao.textos_imp_nunca_exibidos.map((x) => x.k)));
console.log(JSON.stringify(I(7).enumeracao.cenarios));
console.log(JSON.stringify(I(8).enumeracao.cenarios.map((c) => [c.fator, c.posicao_pct, c.diferenca, c.situacao, c.classe])));
console.log(JSON.stringify(I(4).enumeracao.ramos_renderizados.map((r) => [r.segmento, r.requisitos_marcados, r.prazo, r.estado, r.classe_veredito])));
console.log(JSON.stringify(I(2).enumeracao));
