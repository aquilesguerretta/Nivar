// Bancada de colocação das maquetes do Atlas: roda as cenas de bancada-colocacao.json no
// Chrome do sistema (Playwright, o mesmo maquinário de capturar.mjs), e em cada cena, depois
// de a câmera assentar, lê window.__atlas.maquetes() e window.__atlas.rotulos() (só existem
// com o servidor de desenvolvimento), grava o PNG e mede os critérios de aceite A1 a A15
// (função avaliar; A15 "de perto" entrou na onda 2). Critério sem dado para medir no render sai
// "n/d", não FALHA.
//
//   node tools/alexandria-atlas/medir-colocacao.mjs --out <pasta> [--so <regex>] [--gpu]
//        [--plano tools/alexandria-atlas/bancada-colocacao.json] [--base http://localhost:5173]
//        [--ab]            custo das maquetes (informativo): FPS em movimento com e sem a camada 3D
//        [--sobrepor]      grava também <cena>-caixas.png com caixas, pés e rótulos desenhados
//        [--estabilidade]  mede A10 (arrasto, varredura de zoom e ida e volta) no fim da cena
//        [--variantes]     cada cena nos dois modos e a 1440×900 e 390×844 (nome "~<modo>-<largura>")
//        [--sem-fps]       pula o desempenho (A11) nas variantes
//        [--janela]        janela visível
//
// Saída: <out>/<cena>.png, <out>/medidas.json e uma tabela por cena no console.
// Código de saída 0 se nenhum critério FALHA; 1 se algum falha (ou a cena não ficou pronta).
//
// Leva 4 da onda 2 (17/11/2026): A12 passa a medir "em repouso a maquete está inteira ou não
// está" (escala vertical 1, rótulo opaco, nenhum selo nem símbolo 2D sob ela, em qualquer zoom);
// A15 classifica o nível 4 pelo zEf do candidato e FALHA na cena do A15 sem candidato; A3 dá à
// torre lembrada a folga da memória e mede também depois do afastar; A16 (novo) mede a coerência
// com o painel: a maior usina da área útil tem maquete ou motivo declarado.
//
// Decisões do orquestrador registradas aqui (16/11/2026, rodada 3):
//  · A6 (cobertura de MW) deixa de ser meta e vira ALARME. Menos maquetes é escolha de desenho,
//    pedida pelo Founder. Reprova só abaixo de 0,50 nos níveis 2 em diante e abaixo de 0,30 no
//    nível 1, a 1440 (largura ≥ 700). No celular (390) e no satélite perto (≥ 12,5, sem maquete
//    por decisão) é informativa. A cena que traz "coberturaInformativa" (o motivo, por extenso)
//    também é: são as cenas em que a cobertura baixa é o que a regra manda e o motivo foi
//    conferido na captura (fecho, 16/11/2026).
//  · A11 reprova por quadros por segundo com as maquetes LIGADAS: ≥ 50 em movimento e no zoom,
//    a 1440 e a 390. O custo percentual das maquetes (--ab) vira informação: aquecimento
//    descartado, depois liga/desliga alternado A-B-B-A duas vezes, mediana de cada lado; com
//    zero maquetes não há custo (null). Antes ele reprovava cena sem maquete nenhuma pelo ruído.
//  · A10 compara só o comparável: arrasto, itens com âncora dentro das DUAS telas, a 120 px das
//    bordas e fora da casca, Jaccard ≥ 0,9; zoom, varredura z0−0,6…z0+0,6 de 0,1 em 0,1
//    contando piscadas (some e volta, ■·■; ou aparece, some e aparece, ·■·■) entre os itens
//    que ficam na área livre de todos os passos, meta 0; "aparece e some" (·■·) é troca de
//    hierarquia entre níveis e sai à parte (aparecemESomem), como informação, sem reprovar
//    (arremate, 16/11/2026: alinhado à letra da decisão); ida e volta z0 → z0+0,3 → z0 sem
//    perder item do início.
//    Fecho (16/11/2026): no arrasto o comparável é o item que cabe INTEIRO nas duas telas (a caixa
//    da maquete somada à do rótulo, não só a âncora) e reprova só o que SAI; o que entra é a vaga
//    de quem saiu pela borda. Na ida e volta, perda é só de quem continuava desenhado em z0+0,3;
//    quem saiu na ida vai em saiuNaIda. O Jaccard do arrasto segue impresso, como informação.
//  · Cenas a 390 (variantes ou não): quando a cena traz "assunto" [lon, lat], a câmera das
//    ações de ir() é recentrada nele; a câmera de 1440 foi desenhada com o painel de 372 px
//    à esquerda e a 390 o assunto caía fora da tela. As cenas de 1440 não mudam.

import { createRequire } from 'node:module';
import fs from 'node:fs/promises';
import path from 'node:path';

const req = createRequire('C:/Users/aquil/AppData/Roaming/npm/node_modules/@playwright/cli/package.json');
const { chromium } = req('playwright');

const args = process.argv.slice(2);
const opc = (n, padrao) => {
  const i = args.indexOf(`--${n}`);
  return i >= 0 ? args[i + 1] : padrao;
};
const BASE = opc('base', 'http://localhost:5173');
const OUT = path.resolve(opc('out', path.join(process.env.TEMP ?? '.', 'atlas-colocacao-medidas', 'ultima')));
const SO = opc('so', null) ? new RegExp(opc('so')) : null;
const PLANO = path.resolve(opc('plano', 'tools/alexandria-atlas/bancada-colocacao.json'));
const GPU = args.includes('--gpu');
const JANELA = args.includes('--janela');
const AB = args.includes('--ab');
const SOBREPOR = args.includes('--sobrepor');
const ESTABILIDADE = args.includes('--estabilidade');

// ── limites (de criterios.json e da especificação §2–§4; decisões do orquestrador) ──
const LIM = {
  /** A1: fração da menor caixa coberta pela outra */
  sobreposicaoMax: 0.02,
  sobreposicaoGrave: 0.1,
  /** A2: D mínimo entre pés por nível (N1..N4) e o piso de 72 px; tolerância de 2 px */
  D: { 1: 180, 2: 140, 3: 110, 4: 90 },
  pisoDist: 72,
  folgaDist: 16,
  tolDist: 2,
  /** A3: tetos de não torres por nível, [desktop ≥ 700 px, celular < 700 px] */
  teto: { 1: [10, 4], 2: [20, 6], 3: [24, 8], 4: [24, 8] },
  fatorSatelite: 0.75,
  larguraCelular: 700,
  torres: { zEfMin: 13, inclinacaoMin: 25, tetoDesktop: 12, tetoCelular: 4, distMin: 158, folgaZEf: 0.15, distMinLembrada: 118 },
  /** A4: caixa encolhida 2 px; topo do rótulo do vencedor 2–12 px abaixo da caixa */
  encolher: 2,
  vaoRotulo: [2, 12],
  /** A5: pé contra map.project do cadastro */
  pePx: 1,
  pePxRelevo: 3,
  /** A11: quadros por segundo com as maquetes ligadas (o custo percentual é só informação) */
  fpsMin: 50,
  msEscolhaMax: 3,
  /** A10 */
  jaccardArrasto: 0.9,
  folgaA10: 120,
  /** A6 (alarme): cobertura mínima por nível, a 1440 */
  coberturaN1: 0.3,
  coberturaN2: 0.5,
  /** A12: limiar do zoom efetivo */
  zEfMinimo: 9.4,
  /** A14: satélite sem maquete a partir de */
  zoomSateliteSem: 12.5,
};

const nivelDe = (z) => (z < 9.4 ? 0 : z < 10.5 ? 1 : z < 12 ? 2 : z < 14 ? 3 : 4);

const area = (c) => Math.max(0, c[2] - c[0]) * Math.max(0, c[3] - c[1]);
const inter = (a, b) => Math.max(0, Math.min(a[2], b[2]) - Math.max(a[0], b[0])) * Math.max(0, Math.min(a[3], b[3]) - Math.max(a[1], b[1]));
const encolhe = (c, d) => [c[0] + d, c[1] + d, c[2] - d, c[3] - d];
const dist = (p, q) => Math.hypot(p[0] - q[0], p[1] - q[1]);
const r1 = (x) => (x == null || !Number.isFinite(x) ? x : Math.round(x * 10) / 10);

/** A1 sobre uma das caixas (caixaMedida ou caixaJusta). */
function sobreposicao(itens, chave) {
  const com = itens.filter((i) => i[chave]);
  const pares = [];
  for (let a = 0; a < com.length; a++) {
    for (let b = a + 1; b < com.length; b++) {
      const x = com[a][chave];
      const y = com[b][chave];
      const menor = Math.min(area(x), area(y));
      if (menor <= 0) continue;
      const f = inter(x, y) / menor;
      if (f > 0) pares.push({ a: com[a].id, b: com[b].id, fracao: Math.round(f * 1000) / 1000, forcado: !!(com[a].forcado || com[b].forcado) });
    }
  }
  pares.sort((p, q) => q.fracao - p.fracao);
  const livres = pares.filter((p) => !p.forcado);
  return {
    pares: com.length,
    acima2: livres.filter((p) => p.fracao > LIM.sobreposicaoMax).length,
    acima10: livres.filter((p) => p.fracao > LIM.sobreposicaoGrave).length,
    pior: livres[0]?.fracao ?? 0,
    piores: livres.slice(0, 5),
    forcados: pares.filter((p) => p.forcado),
  };
}

/** A lei de tamanho (§3), para conferir o A7 sem ler o código da app. Os números são os de
 *  LEI em maquetes.ts; se mudarem lá, mudam aqui (o A7 acusa a divergência). */
const LEI = { coeficiente: 44, expoente: 0.22, mwRef: 30, minimo: 30, minimoAerogerador: 36, maximo: 170, maximoCelular: 140, fatorCelular: 0.85 };
/** Teto do aerogerador por nível (TETO_DO_AEROGERADOR em maquetes.ts, achado 11). */
const TETO_DO_AEROGERADOR = [0, 76, 96, 112, 124];
const lei = (tipo, mw, celular, nivel = 0) => {
  const min = tipo === 'aerogerador' ? LEI.minimoAerogerador : LEI.minimo;
  const v = Math.min(LEI.maximo, Math.max(min, LEI.coeficiente * (Math.max(mw, 0.001) / LEI.mwRef) ** LEI.expoente));
  const t = celular ? Math.min(LEI.maximoCelular, v * LEI.fatorCelular) : v;
  return tipo === 'aerogerador' && nivel ? Math.min(t, TETO_DO_AEROGERADOR[nivel]) : t;
};
/** Mínimo legível por tipo (MINIMO_LEGIVEL em maquetes.ts): piso do tamanho de perto. */
const MINIMO_LEGIVEL = { 'subestacao-pequena': 84, subestacao: 84, 'subestacao-grande': 84, 'subestacao-no': 84, conversora: 72, pch: 56, 'biomassa-cana': 56, upgn: 76, 'terminal-gnl': 110, refinaria: 96, 'terminal-liquidos': 64 };
/** Potência do cadastro (MW) das três maiores, para a ordem do topo do A7. */
const MW_DO_TOPO = { 'Belo Monte': 11233.1, Tucuruí: 8535, Itaipu: 7000 };

/** Os critérios A1–A14 medidos no render. */
function avaliar(cena, med, rot, extra) {
  const { itens, resumo } = med;
  const celular = resumo.largura < LIM.larguraCelular;
  const crit = {};
  const st = (ok) => (ok ? 'PASSA' : 'FALHA');
  const R = resumo.escolha ?? {};
  const desenhados = itens.filter((i) => i.desenhado3d !== false && i.caixaMedida);

  // A1 — sobreposição entre caixas medidas (torres incluídas)
  const s = sobreposicao(desenhados, 'caixaMedida');
  const sj = sobreposicao(desenhados, 'caixaJusta');
  crit.A1 = { status: desenhados.length < 2 ? 'PASSA' : st(s.acima2 === 0), acima2: s.acima2, acima10: s.acima10, pior: s.pior, piores: s.piores, justa: { acima2: sj.acima2, acima10: sj.acima10, pior: sj.pior }, forcados: s.forcados };

  // A2 — menor distância entre pés (não torres) contra max(D_nível, (La+Lb)/2+16, 72)
  const nt = itens.filter((i) => i.familia !== 'torre');
  let menor = null;
  const violacoes = [];
  for (let a = 0; a < nt.length; a++) {
    for (let b = a + 1; b < nt.length; b++) {
      const x = nt[a];
      const y = nt[b];
      const d = dist(x.pe, y.pe);
      const nx = x.nivel ?? nivelDe(x.zEfMedido);
      const ny = y.nivel ?? nivelDe(y.zEfMedido);
      const D = Math.min(LIM.D[nx] ?? LIM.D[1], LIM.D[ny] ?? LIM.D[1]);
      const lim = Math.max(D, (x.L + y.L) / 2 + LIM.folgaDist, LIM.pisoDist) * (x.histerese || y.histerese ? 0.85 : 1);
      if (menor == null || d < menor.d) menor = { d, a: x.id, b: y.id, lim };
      if (d < lim - LIM.tolDist && !(x.forcado || y.forcado)) violacoes.push({ a: x.id, b: y.id, d: r1(d), lim: r1(lim) });
    }
  }
  violacoes.sort((p, q) => p.d / p.lim - q.d / q.lim);
  crit.A2 = { status: nt.length < 2 ? 'PASSA' : st(violacoes.length === 0), menorDist: r1(menor?.d ?? null), entre: menor ? [menor.a, menor.b] : null, limiteDoPar: r1(menor?.lim ?? null), violacoes: violacoes.length, piores: violacoes.slice(0, 5) };

  // A3 — tetos por nível e família; torres por linha
  const porNivel = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0 };
  for (const i of nt) if (!i.forcado) porNivel[i.nivel ?? nivelDe(i.zEfMedido)]++;
  const fator = resumo.satelite ? LIM.fatorSatelite : 1;
  const estouros = [];
  for (const n of [1, 2, 3, 4]) {
    const t = Math.floor(LIM.teto[n][celular ? 1 : 0] * fator);
    if (porNivel[n] > t) estouros.push(`N${n} ${porNivel[n]}>${t}`);
  }
  const torres = itens.filter((i) => i.familia === 'torre');
  const tetoT = celular ? LIM.torres.tetoCelular : LIM.torres.tetoDesktop;
  // leva 4 (codigo.md 10): a torre LEMBRADA (histerese: estava desenhada no enquadramento
  // anterior) tem a folga da memória, declarada em maquetes.ts: zEf até 13 − 0,15 e vizinha a
  // 0,75 × 160 px. A recém-chegada continua com os limites cheios. O mesmo teste roda também
  // no estado DEPOIS DO AFASTAR (extra.torresDepoisDoAfastar), que é onde a memória age.
  const torresEstouros = (lista, rotulo) => {
    const e = [];
    const proibidas = lista.filter((t) => (t.zEf ?? t.zEfMedido) < LIM.torres.zEfMin - (t.histerese ? LIM.torres.folgaZEf : 0) || resumo.inclinacao < LIM.torres.inclinacaoMin || resumo.satelite).length;
    let menor = null;
    for (let a = 0; a < lista.length; a++)
      for (let b = a + 1; b < lista.length; b++) {
        const d = dist(lista[a].pe, lista[b].pe);
        const lim = lista[a].histerese || lista[b].histerese ? LIM.torres.distMinLembrada : LIM.torres.distMin;
        if (menor == null || d - lim < menor.d - menor.lim) menor = { d, lim };
      }
    if (lista.length > tetoT) e.push(`${rotulo}torres ${lista.length}>${tetoT}`);
    if (proibidas) e.push(`${rotulo}${proibidas} torres com zEf abaixo do limite, inclinação<25° ou satélite`);
    if (menor && menor.d < menor.lim) e.push(`${rotulo}torres a ${r1(menor.d)} px (limite ${menor.lim})`);
    return { e, menor };
  };
  const tz = torresEstouros(torres, '');
  estouros.push(...tz.e);
  const menorEntreTorres = tz.menor?.d ?? null;
  const porLinha = {};
  for (const t of torres) porLinha[t.linha ?? '?'] = (porLinha[t.linha ?? '?'] ?? 0) + 1;
  const maxPorLinha = Math.max(0, ...Object.values(porLinha));
  if (maxPorLinha > 3) estouros.push(`${maxPorLinha} torres numa linha`);
  const afastar = extra.torresDepoisDoAfastar ?? null;
  if (afastar?.torres) estouros.push(...torresEstouros(afastar.torres, 'depois do afastar: ').e);
  // dupla contagem: nenhuma usina é ao mesmo tempo item (maquete própria) e membro de outro item
  const idsDeItem = new Set(itens.map((i) => i.id));
  const vistos = new Map();
  for (const i of itens) for (const mb of i.membros ?? []) {
    if (idsDeItem.has(mb)) estouros.push(`${mb} é maquete e membro de ${i.id}`);
    else if (vistos.has(mb)) estouros.push(`${mb} é membro de ${vistos.get(mb)} e de ${i.id}`);
    else vistos.set(mb, i.id);
  }
  crit.A3 = { status: st(estouros.length === 0), porNivel, porFamilia: resumo.porFamilia, torres: torres.length, lembradas: torres.filter((t) => t.histerese).length, menorEntreTorres: r1(menorEntreTorres), maxPorLinha, depoisDoAfastar: afastar ? { zoom: afastar.zoom, torres: afastar.torres?.length ?? null, lembradas: afastar.torres?.filter((t) => t.histerese).length ?? null, erro: afastar.erro ?? null } : null, estouros };

  // A16 — coerência com o painel (leva 4, item 4): se a tela desenha alguma maquete de usina, a
  // MAIOR usina em operação da área útil (a primeira de "As maiores desta tela") tem maquete
  // (própria ou como membro do conjunto), salvo motivo declarado em __atlas.motivos():
  // coordenada imprecisa, posição a confirmar, aquém do zoom das maquetes, sob a casca ou na
  // borda. A maior é recontada aqui, sobre o arquivo carregado, sem ler a escolha. Só a 1440.
  const mx = extra.maiorDaTela;
  const usinasDesenhadas = itens.filter((i) => i.familia === 'usina').length;
  if (celular) crit.A16 = { status: 'n/d', motivo: 'só nas cenas de 1440' };
  else if (!mx) crit.A16 = { status: 'n/d', motivo: 'sem usina na área útil' };
  else if (!usinasDesenhadas) crit.A16 = { status: 'n/d', motivo: 'nenhuma maquete de usina na tela', maior: mx.texto };
  else {
    const dono = itens.find((i) => i.id === mx.id || (i.membros ?? []).includes(mx.id));
    const mo = extra.motivos ?? {};
    const declarado = [mo.maior, mo[mx.id]].filter(Boolean).find((t) => /coordenada imprecisa|posição a confirmar|aquém do zoom|sob a casca ou na borda/.test(t)) ?? null;
    crit.A16 = { status: st(!!dono || !!declarado), maior: mx.texto, comMaquete: dono ? (dono.id === mx.id ? 'própria' : `membro de ${dono.nome}`) : null, declarado, motivoNaEscolha: mo[mx.id] ?? null, maiorNaEscolha: mo.maior ?? null };
  }

  // A4 — rótulo sobre maquete (excluindo o da própria) e vão do rótulo do vencedor
  const proprio = (it, r) => r.camada === 'maquetes-rotulo' && r.id === it.id;
  const cruzados = [];
  const vaos = [];
  for (const it of itens) {
    const fundo = it.caixaMedida ?? it.caixa;
    for (const r of rot) {
      if (proprio(it, r)) {
        // a primeira caixa do rótulo (linha de cima) dá o topo
        if (!vaos.some((v) => v.id === it.id)) vaos.push({ id: it.id, vao: r1(r.caixa[1] - fundo[3]) });
        continue;
      }
      if (!it.caixaMedida) continue;
      if (inter(encolhe(it.caixaMedida, LIM.encolher), r.caixa) > 0) cruzados.push({ maquete: it.id, camada: r.camada, rotulo: r.texto });
    }
  }
  const foraDoVao = vaos.filter((v) => v.vao < LIM.vaoRotulo[0] || v.vao > LIM.vaoRotulo[1]);
  const semRotulo = itens.filter((it) => it.rotulo?.mostrar && !vaos.some((v) => v.id === it.id)).map((it) => it.id);
  const porCamada = {};
  for (const c of cruzados) porCamada[c.camada] = (porCamada[c.camada] ?? 0) + 1;
  // o obstáculo (ícone transparente) contra a caixa medida: fração coberta e sobra de área
  const ob = extra.obst ?? [];
  const cobObst = [];
  for (const it of itens) {
    if (!it.caixaMedida) continue;
    const o = ob.find((r) => r.id === it.id);
    const a = area(it.caixaMedida) || 1;
    cobObst.push(o ? { id: it.id, cobre: inter(o.caixa, it.caixaMedida) / a, sobra: area(o.caixa) / a } : { id: it.id, cobre: 0, sobra: 0 });
  }
  const obstaculo = cobObst.length
    ? { n: cobObst.length, menorCobertura: Math.round(Math.min(...cobObst.map((c) => c.cobre)) * 1000) / 1000, maiorSobra: Math.round(Math.max(...cobObst.map((c) => c.sobra)) * 100) / 100, descobertos: cobObst.filter((c) => c.cobre < 0.97).map((c) => c.id).slice(0, 6) }
    : null;
  crit.A4 = {
    status: st(cruzados.length === 0 && foraDoVao.length === 0),
    cruzados: cruzados.length,
    porCamada,
    exemplos: cruzados.slice(0, 6),
    rotulosProprios: vaos.length,
    foraDoVao: foraDoVao.length,
    vaos: vaos.slice(0, 16),
    vencedoresSemRotulo: semRotulo.length,
    semRotulo: semRotulo.slice(0, 8),
    fonteDaCaixa: rot[0]?.fonte ?? null,
    obstaculo,
  };

  // A5 — pé desenhado contra map.project do cadastro; membros no disco proporcional
  const tol = resumo.relevo ? LIM.pePxRelevo : LIM.pePx;
  const desvios = itens.filter((i) => i.peDesenhado).map((i) => ({ id: i.id, d: dist(i.pe, i.peDesenhado) }));
  desvios.sort((a, b) => b.d - a.d);
  const pior = desvios[0]?.d ?? 0;
  const pp = extra.papeis;
  // membro sob a própria maquete (a unidade do mesmo sítio) sai por desenho: listado à parte
  const sob = pp?.membrosSobAMaquete?.length ?? 0;
  const membrosOk = !pp || pp.membros === pp.membrosVisiveis + sob;
  crit.A5 = { status: st(pior <= tol && membrosOk), piorPx: r1(pior), tolerancia: tol, acimaDaTolerancia: desvios.filter((d) => d.d > tol).length, piores: desvios.slice(0, 3).map((d) => ({ id: d.id, d: r1(d.d) })), membros: pp ? `${pp.membrosVisiveis}/${pp.membros} no disco${sob ? `, ${sob} sob a maquete` : ''}` : 'n/d', membrosFaltando: pp?.membrosFaltando ?? [] };

  // A6 — cobertura de MW: alarme (decisão de 16/11/2026, no cabeçalho). Reprova só abaixo de
  // 0,30 no nível 1 e de 0,50 do nível 2 em diante, a 1440; no celular e no satélite perto
  // (sem maquete por decisão) é informativa
  const cob = resumo.mwNaTela ? resumo.mwRepresentado / resumo.mwNaTela : null;
  const nivelDaTela = resumo.nivel ?? nivelDe(resumo.zoom);
  const informativa = cena.coberturaInformativa ? String(cena.coberturaInformativa) : celular ? 'celular' : R.satelitePerto ? 'satélite perto' : nivelDaTela < 1 ? 'nível 0' : null;
  const minCob = informativa ? null : nivelDaTela === 1 ? LIM.coberturaN1 : LIM.coberturaN2;
  crit.A6 = cob == null ? { status: 'n/d', motivo: 'sem MW na tela' } : { status: minCob == null ? 'medido' : st(cob >= minCob), cobertura: Math.round(cob * 1000) / 1000, minimo: minCob, nivel: nivelDaTela, informativa, mwRepresentado: Math.round(resumo.mwRepresentado), mwNaTela: Math.round(resumo.mwNaTela) };

  // A7 — hierarquia: L igual à lei (ou à escala real); MW ×3,3 → L ×1,28 fora do piso; topo
  const usinas = itens.filter((i) => i.familia === 'usina');
  const foraDaLei = [];
  // onda 2 (decisão 1): do nível 3 em diante o mínimo legível é PISO do tamanho (usinas e ANP;
  // rede do nível 4): L acima da lei por esse piso é aceito, como a escala real; Llei continua a lei
  let noPisoDeLeitura = 0;
  for (const u of usinas) {
    const esperado = lei(u.tipo, u.mwConjunto ?? u.mw, celular, u.nivel);
    const piso = (u.nivel ?? 0) >= 3 ? (MINIMO_LEGIVEL[u.tipo] ?? 0) : 0;
    if (piso > esperado + 1 && Math.abs(u.L - piso) <= 1) noPisoDeLeitura++;
    const real = u.L > esperado + 1; // a escala real (ou o piso de leitura) venceu
    if (Math.abs((u.Llei ?? u.L) - esperado) > 1 || (!real && Math.abs(u.L - esperado) > 1)) foraDaLei.push({ id: u.id, L: r1(u.L), lei: r1(esperado) });
  }
  const ordem = [];
  for (const a of usinas)
    for (const b of usinas) {
      const ma = a.mwConjunto ?? a.mw;
      const mb = b.mwConjunto ?? b.mw;
      // o aerogerador no teto do nível (achado 11) está fora da ordem por decisão
      const noTeto = a.tipo === 'aerogerador' && a.nivel && (a.Llei ?? a.L) >= TETO_DO_AEROGERADOR[a.nivel] - 0.5;
      if (!noTeto && ma >= 3.3 * mb && (b.Llei ?? b.L) > (b.tipo === 'aerogerador' ? LEI.minimoAerogerador : LEI.minimo) * (celular ? LEI.fatorCelular : 1) + 0.5 && (a.Llei ?? a.L) < 1.28 * (b.Llei ?? b.L) - 0.5 && (a.Llei ?? a.L) < (celular ? LEI.maximoCelular : LEI.maximo)) ordem.push({ a: a.id, b: b.id });
    }
  const L30 = lei('hidreletrica', 30, false);
  const topo = Object.fromEntries(Object.entries(MW_DO_TOPO).map(([n, mw]) => [n, r1(lei('hidreletrica', mw, false))]));
  const topoOk = topo['Belo Monte'] > topo['Tucuruí'] && topo['Tucuruí'] > topo.Itaipu && topo.Itaipu >= 3 * L30;
  crit.A7 = { status: st(foraDaLei.length === 0 && ordem.length === 0 && topoOk), foraDaLei: foraDaLei.slice(0, 5), ordemQuebrada: ordem.slice(0, 5), topo, itaipuSobre30MW: r1(topo.Itaipu / L30), noPisoDeLeitura };

  // A8 — papéis 2D: nenhum símbolo 2D visível de vencedor, âncora para cada maquete, nenhum
  //      rótulo de usina em repouso acima de 9,8
  if (pp && resumo.zoom >= 9.8) {
    crit.A8 = { status: st(pp.vencedores2D.length === 0 && pp.orfas.length === 0 && pp.semAncora.length === 0 && pp.rotulosDeUsina === 0), vencedores2D: pp.vencedores2D.slice(0, 5), ancoras: pp.ancoras, orfas: pp.orfas.slice(0, 5), semAncora: pp.semAncora.slice(0, 5), rotulosDeUsina: pp.rotulosDeUsina };
  } else crit.A8 = { status: 'n/d', motivo: pp ? 'zoom < 9,8' : 'sem papeis()' };

  // A9 — o aviso contra o resumo
  const txt = extra.resumoNaTela;
  if (resumo.zoom < 9.4) crit.A9 = { status: st(txt == null), ausente: txt == null };
  else {
    // o aviso é UMA linha (decisão do orquestrador): "N maquetes nesta tela · k ficaram só no
    // símbolo". O total conta tudo o que tem maquete (usinas, subestações, ANP; sem torres) e
    // tem de bater com __atlas.maquetes().itens; zero vira "Aproxime…"; um só item forçado
    // sem cortes não tem aviso (a ficha e o anel dizem).
    // recado da regra (rodada 3, HON-7/COL-5): o N do aviso conta só quem tem o pé na área
    // visível (0 ≤ x ≤ largura, 0 ≤ y ≤ altura útil); um forçado com o pé fora não conta
    const hUtil = extra.alturaUtil ?? resumo.altura;
    const total = itens.filter((i) => i.familia !== 'torre' && i.pe[0] >= 0 && i.pe[0] <= resumo.largura && i.pe[1] >= 0 && i.pe[1] <= hUtil).length;
    // onda 2: o recém-chegado adiado (entrada adiada) também "ficou só no símbolo"
    const cortados = (R.cortadosPeloTeto ?? 0) + (R.cortadosPorEspaco ?? 0) + (R.adiados ?? 0);
    const soForcado = total === 1 && (R.forcados?.length ?? 0) === 1 && cortados === 0;
    if (txt == null) crit.A9 = { status: !resumo.ligadas ? 'n/d' : st(soForcado), motivo: soForcado ? 'só o item pedido: sem aviso' : 'nó [data-atlas="resumo-maquetes"] ausente' };
    else if (R.satelitePerto) crit.A9 = { status: st(/Satélite/.test(txt)), texto: txt };
    else {
      const umaLinha = txt.length <= 90 && !/\.\s+\S/.test(txt);
      const numero = total === 0 ? /^(Aproxime|Nenhuma maquete)/.test(txt) : txt.startsWith(`${total} ${total === 1 ? 'maquete' : 'maquetes'} nesta tela`);
      const corte = cortados === 0 || txt.includes(`${cortados} ${cortados === 1 ? 'ficou' : 'ficaram'} só no símbolo`);
      const ok = umaLinha && numero && corte && !/ 0 de 0|conjunto|km/i.test(txt);
      crit.A9 = { status: st(ok), texto: txt, total, cortados, umaLinha, numero, corte, altura: extra.alturaDoResumo ?? null };
    }
  }

  // A10 — estabilidade (só com --estabilidade)
  // (arrasto: só itens nas duas telas, com folga e fora da casca; zoom: piscadas na varredura;
  // ida e volta: nada do início se perde)
  if (extra.estabilidade?.erro) crit.A10 = { status: 'n/d', motivo: extra.estabilidade.erro };
  else if (extra.estabilidade) {
    const { arrasto, varredura, idaEVolta } = extra.estabilidade;
    crit.A10 = {
      // fecho (16/11/2026): reprova o item que cabe inteiro nas duas telas e SAI no arrasto, a piscada
      // na varredura e a perda de quem continuava desenhado no meio da ida e volta. O que entra no
      // arrasto e quem sai na ida (caixa na borda) são consequência da regra: informação
      status: st(arrasto.saiu.length === 0 && varredura.piscadas.length === 0 && idaEVolta.perdidos.length === 0),
      arrasto: { jaccard: Math.round(arrasto.jaccard * 1000) / 1000, comparaveis: arrasto.comparaveis, dx: arrasto.dx, saiu: arrasto.saiu, entrou: arrasto.entrou },
      varredura: { de: varredura.de, ate: varredura.ate, passos: varredura.passos, olhados: varredura.olhados, piscadas: varredura.piscadas, aparecemESomem: varredura.aparecemESomem ?? [] },
      idaEVolta: { antes: idaEVolta.antes, perdidos: idaEVolta.perdidos, saiuNaIda: idaEVolta.saiuNaIda ?? [], ganhos: idaEVolta.ganhos },
    };
  } else crit.A10 = { status: 'n/d', motivo: 'rode com --estabilidade' };

  // A11 — quadros por segundo com as maquetes ligadas: ≥ 50 em movimento e no zoom (1440 e
  // 390). O custo das maquetes (--ab, mediana de liga/desliga alternado) é só informação.
  const fpsOk = (v) => v == null || v >= LIM.fpsMin;
  const cenaDoMs = /rmsp-10\.5/.test(cena.nome) && cena.viewport[0] >= 1440;
  const a11 = [fpsOk(extra.fpsMov), fpsOk(extra.fpsZoom), extra.msEscolha == null || !cenaDoMs || extra.msEscolha <= LIM.msEscolhaMax];
  const ab = extra.ab ?? null;
  crit.A11 = {
    status: st(a11.every(Boolean)),
    fpsParado: extra.fpsParado,
    fpsMov: extra.fpsMov,
    fpsZoom: extra.fpsZoom,
    msEscolha: extra.msEscolha == null ? null : Math.round(extra.msEscolha * 100) / 100,
    msEscolhaE: 'escolha pura, média de 10 com o último pedido',
    custoInformativo: ab ? { custo: ab.custo == null ? null : Math.round(ab.custo * 1000) / 1000, medianaCom: ab.medianaCom, medianaSem: ab.medianaSem, com: ab.com, sem: ab.sem, motivo: ab.motivo ?? null } : null,
  };

  // A12 — troca (leva 4, item 1: "em repouso a maquete está inteira ou não está"): nenhuma
  // maquete com zEf < 9,4; em repouso, em QUALQUER zoom, toda maquete desenhada com escala
  // vertical 1, o rótulo dela com opacidade 1, e nenhum símbolo 2D visível sob ela (o selo da
  // troca a 0, salvo o aerogerador visto de cima, que não é desenhado; o símbolo da fonte apagado
  // pelo feature-state, papeis().vencedores2D). Antes ele pedia 0,4–0,6 em 9,6: o estado
  // intermediário era o desenho, e foi o que o crítico reprovou.
  const abaixo = itens.filter((i) => (i.zEf ?? i.zEfMedido) < LIM.zEfMinimo).length;
  const esc = desenhados.map((i) => i.escalaVertical ?? 1);
  const op = extra.opacidades ?? {};
  const meias = [];
  for (const i of desenhados) {
    const o = op[i.id];
    if ((i.escalaVertical ?? 1) < 0.999) meias.push(`${i.id} vertical ${r1((i.escalaVertical ?? 0) * 100) / 100}`);
    if (o && i.rotulo?.mostrar && o.rotulo != null && o.rotulo < 0.999) meias.push(`${i.id} rótulo ${r1(o.rotulo * 100) / 100}`);
    if (o && o.selo != null && o.selo > 0.001) meias.push(`${i.id} selo ${r1(o.selo * 100) / 100}`);
  }
  const v2d = pp?.vencedores2D ?? [];
  for (const v of v2d) meias.push(`${v.id} símbolo 2D em ${v.camada}`);
  crit.A12 = { status: st(abaixo === 0 && meias.length === 0), abaixoDe94: abaixo, escalaVertical: esc.length ? [r1(Math.min(...esc) * 100) / 100, r1(Math.max(...esc) * 100) / 100] : null, meias: meias.slice(0, 8), opacidadesLidas: Object.keys(op).length };

  // A13 — de cima: nenhum aerogerador ou torre em 3D com inclinação < 25°; selo no pé; aviso
  if (resumo.inclinacao < LIM.torres.inclinacaoMin) {
    const em3d = itens.filter((i) => (i.tipo === 'aerogerador' || i.familia === 'torre') && i.desenhado3d).length;
    const eolicos = itens.filter((i) => i.tipo === 'aerogerador').length;
    const aviso = txt == null ? null : /incline o mapa/i.test(txt);
    crit.A13 = { status: st(em3d === 0 && (eolicos === 0 || (pp?.selosDeCima ?? 0) >= eolicos) && (eolicos === 0 || aviso === true)), aerogeradoresETorres3D: em3d, eolicos, selosNoPe: pp?.selosDeCima ?? null, aviso };
  } else crit.A13 = { status: 'n/d', motivo: 'inclinação ≥ 25°' };

  // A14 — satélite sem maquete a partir de 12,5; repaints parado com movimento reduzido
  const a14 = {};
  let a14ok = true;
  if (resumo.satelite) {
    a14.maquetes3D = desenhados.length;
    a14.zoom = r1(resumo.zoom);
    if (resumo.zoom >= LIM.zoomSateliteSem && desenhados.length > 0) a14ok = false;
  }
  if (extra.repaints != null) {
    a14.repaintsParado = extra.repaints;
    if (extra.repaints > 0) a14ok = false;
  }
  if (extra.contraste) {
    const cs = extra.contraste.itens.filter((c) => c.pixels >= 20);
    if (cs.length) {
      a14.contrasteMin = Math.min(...cs.map((c) => c.contraste));
      a14.abaixoDe3 = cs.filter((c) => c.contraste < 3).map((c) => `${c.id} ${c.contraste}`);
      if (a14.abaixoDe3.length) a14ok = false;
    }
    a14.oxido = extra.contraste.oxido;
    // o óxido é o anel da seleção: com item forçado pela seleção ou pela busca (a ficha abre)
    // ele é legítimo; fora disso, nenhum pixel
    const comSelecao = (R.forcados ?? []).some((f) => f.motivo === 'selecao' || f.motivo === 'busca');
    // na foto de satélite o solo vermelho do Nordeste cai na mesma cor: lá não se conta
    if (extra.contraste.oxido > 0 && !comSelecao && !resumo.satelite) a14ok = false;
  }
  crit.A14 = Object.keys(a14).length ? { status: st(a14ok), ...a14 } : { status: 'n/d', motivo: 'sem satélite nem movimento reduzido' };

  // A15 — de perto (decisão 1 da onda 2): com zoom efetivo ≥ 14 (nível 4), todo candidato com
  // nome, coordenada confirmada e espaço livre tem maquete. Lê __atlas.motivos() (o porquê de cada
  // candidato da última escolha). Recusa legítima: espaço (outra maquete, casca, borda), pé fora
  // da área útil, sem nome, já contada num conjunto, teto, rótulos do celular, satélite perto e a
  // precisão da FONTE (prec). Falha: abaixo do mínimo legível (o piso agora é de tamanho),
  // coordenada recusada pelo texto do número (arquivo sem prec) e modelo que não carregou.
  const mot = extra.motivos;
  if (!mot) crit.A15 = { status: 'n/d', motivo: 'sem __atlas.motivos()' };
  else if (R.satelitePerto) crit.A15 = { status: 'n/d', motivo: 'satélite perto: sem maquete por decisão' };
  else {
    // leva 4 (codigo.md 9): o nível 4 é o do zoom efetivo do candidato (zEf ≥ 14, o texto do
    // motivo traz o zEf desde a leva 4), não o nível pós-histerese; e a cena feita para o A15
    // (coberturaInformativa cita o A15) sem nenhum candidato no nível 4 FALHA: ela não exercita
    // o critério. Motivo no formato antigo (sem zEf) cai no nível textual, como antes.
    const n4 = [];
    for (const [id, t] of Object.entries(mot)) {
      const m = / n(\d)(?: zEf (-?[\d.]+))? prio -?\d+: (.*)$/.exec(t);
      if (!m) continue;
      const quatro = m[2] != null ? Number(m[2]) + 1e-3 >= 14 : Number(m[1]) === 4;
      if (!quatro) continue;
      n4.push({ id, nome: t.slice(0, m.index), motivo: m[3] });
    }
    const aceito = (x) => /^aceito/.test(x.motivo);
    // "adiado" (entrada adiada) é a regra de estabilidade da decisão 5 da onda 2: o item fica no
    // símbolo e conta em "ficaram só no símbolo"; legítima, listada à parte em semMaquete
    const legitima = (x) => /^(espaço com|sob a casca|pé fora da área útil|sem nome|já contada|teto|rótulos do celular|adiado)/.test(x.motivo) || /prec \d na fonte/.test(x.motivo);
    const falhas = n4.filter((x) => !aceito(x) && !legitima(x));
    const porMotivo = {};
    for (const x of n4) if (!aceito(x)) {
      const k = x.motivo.replace(/ com .*$/, ' com …').replace(/\(\d+ < \d+ px\)/, '').replace(/ \(entrada adiada.*$/, '');
      porMotivo[k] = (porMotivo[k] ?? 0) + 1;
    }
    const exercita = /A15/.test(String(cena.coberturaInformativa ?? ''));
    crit.A15 =
      n4.length === 0
        ? { status: exercita ? 'FALHA' : 'n/d', motivo: exercita ? 'cena do A15 sem candidato com zEf ≥ 14' : 'nenhum candidato no nível 4' }
        : { status: st(falhas.length === 0), candidatosN4: n4.length, comMaquete: n4.filter(aceito).length, semMaquete: porMotivo, falhas: falhas.slice(0, 8).map((x) => `${x.nome.trim() || x.id}: ${x.motivo}`), semMaqueteLista: n4.filter((x) => !aceito(x)).slice(0, 12).map((x) => `${x.nome.trim() || x.id}: ${x.motivo}`) };
  }
  return crit;
}

/** Roda na página: contraste (WCAG, luminância relativa) entre a borda de cada maquete e o
 *  fundo num anel de 8 px em volta dela, e pixels de óxido (#9a3b22) no mapa. Máscara =
 *  pixels que mudam quando a camada 3D é desligada. Borda = a faixa de 1 px de fora da
 *  máscara (o fio de contorno) e a de 2–3 px para dentro (o corpo junto do fio): conta o
 *  maior dos dois contrastes, que é o que separa a maquete do chão (no noturno o fio é navy e
 *  quem separa é o corpo creme). */
async function medirContraste({ com, sem, caixas, casca = [] }) {
  const carregar = (b64) =>
    new Promise((ok, falha) => {
      const im = new Image();
      im.onload = () => ok(im);
      im.onerror = falha;
      im.src = `data:image/png;base64,${b64}`;
    });
  const [ia, ib] = await Promise.all([carregar(com), carregar(sem)]);
  const w = ia.width;
  const h = ia.height;
  const dados = (im) => {
    const c = document.createElement('canvas');
    c.width = w;
    c.height = h;
    const g = c.getContext('2d');
    g.drawImage(im, 0, 0);
    return g.getImageData(0, 0, w, h).data;
  };
  const A = dados(ia);
  const B = dados(ib);
  const lin = (v) => {
    const s = v / 255;
    return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  const lum = (d, i) => 0.2126 * lin(d[i]) + 0.7152 * lin(d[i + 1]) + 0.0722 * lin(d[i + 2]);
  const razao = (a, b) => (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
  // óxido dentro das caixas das maquetes (folga de 12 px): os controles da interface sobre o
  // mapa (o sublinhado de "Inclinar") não contam. A caixa de uma torre que cai junto da coluna
  // de controles alcançava o sublinhado: o pixel sob a casca (retângulos dela, 2 px de folga)
  // também não conta. O rosa do gás (#e14e8a claro, #c15e93 noturno) não entra na tolerância
  // de ±6 do óxido em canal nenhum (leva 2, item 2)
  let oxido = 0;
  const contado = new Uint8Array(w * h);
  for (const r of casca)
    for (let y = Math.max(0, Math.floor(r[1]) - 2); y <= Math.min(h - 1, Math.ceil(r[3]) + 2); y++)
      for (let x = Math.max(0, Math.floor(r[0]) - 2); x <= Math.min(w - 1, Math.ceil(r[2]) + 2); x++) contado[y * w + x] = 1;
  for (const { c } of caixas)
    for (let y = Math.max(0, Math.floor(c[1]) - 12); y <= Math.min(h - 1, Math.ceil(c[3]) + 12); y++)
      for (let x = Math.max(0, Math.floor(c[0]) - 12); x <= Math.min(w - 1, Math.ceil(c[2]) + 12); x++) {
        const k = y * w + x;
        if (contado[k]) continue;
        contado[k] = 1;
        const i = k * 4;
        if (Math.abs(A[i] - 0x9a) <= 6 && Math.abs(A[i + 1] - 0x3b) <= 6 && Math.abs(A[i + 2] - 0x22) <= 6) oxido++;
      }
  const saida = [];
  for (const { id, c } of caixas) {
    const x0 = Math.max(0, Math.floor(c[0]) - 12);
    const y0 = Math.max(0, Math.floor(c[1]) - 12);
    const x1 = Math.min(w - 1, Math.ceil(c[2]) + 12);
    const y1 = Math.min(h - 1, Math.ceil(c[3]) + 12);
    const bw = x1 - x0 + 1;
    const bh = y1 - y0 + 1;
    if (bw < 3 || bh < 3) continue;
    const m = new Uint8Array(bw * bh);
    const fraco = new Uint8Array(bw * bh);
    for (let y = 0; y < bh; y++)
      for (let x = 0; x < bw; x++) {
        const i = ((y + y0) * w + (x + x0)) * 4;
        const d = Math.abs(A[i] - B[i]) + Math.abs(A[i + 1] - B[i + 1]) + Math.abs(A[i + 2] - B[i + 2]);
        // só dentro da caixa medida (com 1 px de folga) conta como maquete
        const dentro = x + x0 >= c[0] - 1 && x + x0 <= c[2] + 1 && y + y0 >= c[1] - 1 && y + y0 <= c[3] + 1;
        m[y * bw + x] = dentro && d > 30 ? 1 : 0;
        fraco[y * bw + x] = dentro && d > 4 ? 1 : 0;
      }
    // Buraco fechado pelo contorno: corpo creme sobre papel bege muda menos de 30 por pixel e
    // ficava FORA da máscara; a borda da máscara passava a ser o corpo junto do buraco, e a
    // maquete de contorno de tinta medida 1,97 (rmsp-10.5, usina:85). Pixel não alcançável de
    // fora da caixa sem cruzar a máscara, e que a camada 3D mudou (d > 4), é corpo. O vão de
    // uma treliça (d = 0, o chão aparece) continua fora.
    {
      const fora = new Uint8Array(bw * bh);
      const fila = [];
      for (let x = 0; x < bw; x++) fila.push(x, (bh - 1) * bw + x);
      for (let y = 0; y < bh; y++) fila.push(y * bw, y * bw + bw - 1);
      while (fila.length) {
        const k = fila.pop();
        if (fora[k] || m[k]) continue;
        fora[k] = 1;
        const x = k % bw;
        const y = (k - x) / bw;
        if (x > 0) fila.push(k - 1);
        if (x < bw - 1) fila.push(k + 1);
        if (y > 0) fila.push(k - bw);
        if (y < bh - 1) fila.push(k + bw);
      }
      for (let k = 0; k < bw * bh; k++) if (!m[k] && !fora[k] && fraco[k]) m[k] = 1;
    }
    // distância (Chebyshev) até o lado de fora da máscara, por erosões sucessivas, até 3
    const dist = new Uint8Array(bw * bh);
    for (let k = 0; k < bw * bh; k++) dist[k] = m[k] ? 9 : 0;
    for (let passo = 1; passo <= 3; passo++)
      for (let y = 0; y < bh; y++)
        for (let x = 0; x < bw; x++) {
          const k = y * bw + x;
          if (dist[k] !== 9) continue;
          let borda = x === 0 || y === 0 || x === bw - 1 || y === bh - 1;
          for (let dy = -1; dy <= 1 && !borda; dy++) for (let dx = -1; dx <= 1 && !borda; dx++) if (dist[k + dy * bw + dx] < passo) borda = true;
          if (borda) dist[k] = passo;
        }
    // anel: fora da máscara, a até 8 px dela, medido na foto SEM maquete
    let sFio = 0, nFio = 0, sCorpo = 0, nCorpo = 0, sAnel = 0, nAnel = 0;
    const lumBorda = [];
    // contraste LOCAL por anel da borda (1, 2 e 3 px para dentro): o pixel da maquete contra o
    // chão logo debaixo dele (a foto sem a camada, no mesmo pixel). A média do anel de fora
    // engana em fundo heterogêneo (foto de satélite com nuvem e mata), e o anel 2–3 mistura
    // fio e corpo em peça fina (pá de aerogerador)
    const local = [[], [], []];
    for (let y = 0; y < bh; y++)
      for (let x = 0; x < bw; x++) {
        const k = y * bw + x;
        const i = ((y + y0) * w + (x + x0)) * 4;
        if (dist[k] >= 1 && dist[k] <= 3) local[dist[k] - 1].push(razao(lum(A, i), lum(B, i)));
        if (dist[k] === 1 || dist[k] === 2) lumBorda.push(lum(A, i));
        if (dist[k] === 1) {
          sFio += lum(A, i);
          nFio++;
        } else if (dist[k] === 2 || dist[k] === 3) {
          sCorpo += lum(A, i);
          nCorpo++;
        } else if (!m[k]) {
          let perto = false;
          for (let dy = -8; dy <= 8 && !perto; dy += 2) for (let dx = -8; dx <= 8 && !perto; dx += 2) {
            const yy = y + dy;
            const xx = x + dx;
            if (yy >= 0 && xx >= 0 && yy < bh && xx < bw && m[yy * bw + xx]) perto = true;
          }
          if (perto) {
            sAnel += lum(B, i);
            nAnel++;
          }
        }
      }
    if (!nFio || !nAnel) continue;
    const anel = sAnel / nAnel;
    const cFio = razao(sFio / nFio, anel);
    const cCorpo = nCorpo ? razao(sCorpo / nCorpo, anel) : 0;
    // por pixel da borda (2 px de fora), o contraste contra o anel; o percentil 75 diz se a
    // maior parte do contorno se separa do chão (a laje, sem fio por desenho, e o serrilhado
    // das peças de 1 px puxam a média para baixo)
    const porPixel = lumBorda.map((l) => razao(l, anel)).sort((a, b) => a - b);
    const p75 = porPixel[Math.floor(porPixel.length * 0.75)] ?? 0;
    // mediana de cada anel (anel com menos de 8 pixels não conta): informação
    const medianas = local.map((v) => (v.length >= 8 ? v.sort((a, b) => a - b)[Math.floor(v.length / 2)] : 0));
    // separação: em cada ponto do contorno (anel 1), o melhor contraste entre o que a maquete
    // desenha ali perto (anéis 1–3, raio de 2 px) e o chão debaixo daquele ponto; percentil 25
    // sobre o contorno (três quartos do contorno precisam se separar: a mediana do melhor
    // vizinho deixava passar peça que só se separa por um fio de 1 px pontilhado, como as pernas
    // da treliça das torres). Em fundo misto (nuvem e mata) o fio de tinta separa num trecho e o
    // corpo claro no outro; a média de cada um sozinho não via isso
    const sep = [];
    for (let y = 0; y < bh; y++)
      for (let x = 0; x < bw; x++) {
        const k = y * bw + x;
        if (dist[k] !== 1) continue;
        const chao = lum(B, ((y + y0) * w + (x + x0)) * 4);
        let melhor = 1;
        for (let dy = -2; dy <= 2; dy++)
          for (let dx = -2; dx <= 2; dx++) {
            const yy = y + dy;
            const xx = x + dx;
            if (yy < 0 || xx < 0 || yy >= bh || xx >= bw) continue;
            const j = yy * bw + xx;
            if (dist[j] < 1 || dist[j] > 3) continue;
            melhor = Math.max(melhor, razao(lum(A, ((yy + y0) * w + (xx + x0)) * 4), chao));
          }
        sep.push(melhor);
      }
    sep.sort((a, b) => a - b);
    const separacao = sep.length >= 8 ? sep[Math.floor(sep.length / 4)] : 0;
    const r2 = (v) => Math.round(v * 100) / 100;
    saida.push({ id, fio: r2(cFio), corpo: r2(cCorpo), p75: r2(p75), local: medianas.map(r2), separacao: r2(separacao), contraste: r2(Math.max(cFio, cCorpo, p75, separacao)), pixels: nFio + nCorpo });
  }
  return { oxido, itens: saida };
}

/** Caixas, pés e rótulos desenhados por cima do mapa (canvas temporário; não é produção). */
async function sobrepor(page, med, rot) {
  await page.evaluate(
    ({ med, rot }) => {
      const alvo = document.querySelector('.atl-mapa canvas');
      const r = alvo.getBoundingClientRect();
      const c = document.createElement('canvas');
      c.id = '__medida-sobreposta';
      c.width = r.width;
      c.height = r.height;
      Object.assign(c.style, { position: 'fixed', left: `${r.left}px`, top: `${r.top}px`, width: `${r.width}px`, height: `${r.height}px`, pointerEvents: 'none', zIndex: 99999 });
      const g = c.getContext('2d');
      g.lineWidth = 1;
      for (const l of rot) {
        g.strokeStyle = 'rgba(0,140,255,0.9)';
        g.strokeRect(l.caixa[0], l.caixa[1], l.caixa[2] - l.caixa[0], l.caixa[3] - l.caixa[1]);
      }
      for (const it of med.itens) {
        if (it.caixaMedida) {
          const b = it.caixaMedida;
          g.strokeStyle = 'rgba(255,0,200,0.95)';
          g.setLineDash([]);
          g.strokeRect(b[0], b[1], b[2] - b[0], b[3] - b[1]);
        }
        if (it.caixaJusta) {
          const b = it.caixaJusta;
          g.strokeStyle = 'rgba(0,200,120,0.95)';
          g.setLineDash([3, 2]);
          g.strokeRect(b[0], b[1], b[2] - b[0], b[3] - b[1]);
          g.setLineDash([]);
        }
        if (it.caixa) {
          const b = it.caixa;
          g.strokeStyle = 'rgba(255,140,0,0.9)';
          g.setLineDash([1, 2]);
          g.strokeRect(b[0], b[1], b[2] - b[0], b[3] - b[1]);
          g.setLineDash([]);
        }
        g.fillStyle = 'rgba(255,0,200,1)';
        g.fillRect(it.pe[0] - 2, it.pe[1] - 2, 4, 4);
        if (it.peDesenhado) {
          g.strokeStyle = 'rgba(0,0,0,1)';
          g.beginPath();
          g.arc(it.peDesenhado[0], it.peDesenhado[1], 4, 0, Math.PI * 2);
          g.stroke();
        }
      }
      document.body.appendChild(c);
    },
    { med, rot },
  );
}

// --variantes: cada cena roda nos dois modos e nos dois viewports (A14: "toda a bancada em
// claro e noturno"); o nome ganha "~<modo>-<largura>". --sem-fps pula o desempenho (A11) nas
// cenas variantes, para a bateria inteira caber num tempo razoável.
const VARIANTES = args.includes('--variantes');
const SEM_FPS = args.includes('--sem-fps');
const planoBase = JSON.parse(await fs.readFile(PLANO, 'utf8'));
const planoVariado = VARIANTES
  ? planoBase.flatMap((c) =>
      ['claro', 'noturno'].flatMap((modo) =>
        [
          [1440, 900],
          [390, 844],
        ].map((vp) => ({ ...c, nome: `${c.nome}~${modo}-${vp[0]}`, modo, viewport: vp, variante: true })),
      ),
    )
  : planoBase;
// A câmera das cenas foi desenhada a 1440, com o painel de 372 px à esquerda; a 390 o assunto
// caía fora da tela (pirapora a 390: cobertura 0,06, a semente na borda direita). Com
// "assunto": [lon, lat] na cena, a 390 o centro de cada ir() das ações passa a ser o assunto
// (zoom, inclinação e rumo ficam). As cenas a 1440 não mudam.
const recentrar = (c) => {
  if (!c.assunto || c.viewport[0] >= LIM.larguraCelular) return c;
  const centro = `centro:[${c.assunto[0]},${c.assunto[1]}]`;
  const acoes = (c.acoes ?? []).map((a) => (a.eval && /__atlas\.ir\(/.test(a.eval) ? { eval: a.eval.replace(/centro\s*:\s*\[[^\]]*\]/, centro) } : a));
  return { ...c, acoes, recentrada: c.assunto };
};
const plano = planoVariado.map(recentrar);

/** Clique numa ação. O botão do satélite, no celular, mora no menu "Mapa" (a folha dos
 *  controles): abre o menu, clica e fecha, para a folha não cobrir o mapa na foto. */
async function clicar(page, seletor) {
  if (/atl-controle-satelite/.test(seletor) && !(await page.locator(seletor).first().isVisible().catch(() => false))) {
    const menu = page.locator('.atl-controles-pe .atl-controle-vista');
    await menu.click({ timeout: 10_000 });
    await page.locator('.atl-folha-vista .atl-controle-satelite').click({ timeout: 10_000 });
    if ((await menu.getAttribute('aria-expanded')) === 'true') await menu.click({ timeout: 10_000 });
    return;
  }
  await page.click(seletor, { timeout: 10_000 });
}
await fs.mkdir(OUT, { recursive: true });
const browser = await chromium.launch({
  headless: !JANELA,
  channel: 'chrome',
  args: GPU || JANELA ? ['--ignore-gpu-blocklist', '--enable-gpu', '--use-angle=d3d11'] : ['--enable-unsafe-swiftshader', '--use-angle=swiftshader', '--ignore-gpu-blocklist'],
});

const linhas = [];
let falhou = false;
let ctxAtual = null;
async function rodarCena(cena) {
  const ctx = await browser.newContext({
    viewport: { width: cena.viewport[0], height: cena.viewport[1] },
    deviceScaleFactor: 1,
    reducedMotion: cena.reduzido ? 'reduce' : 'no-preference',
    hasTouch: cena.viewport[0] < 768,
    isMobile: cena.viewport[0] < 768,
  });
  ctxAtual = ctx;
  await ctx.addInitScript((modo) => {
    try {
      window.localStorage.setItem('alx3-modo', modo);
    } catch {
      /* sem armazenamento */
    }
  }, cena.modo);
  const page = await ctx.newPage();
  const erros = [];
  page.on('console', (m) => {
    if (m.type() !== 'error') return;
    const t = m.text();
    if (/401 \(Unauthorized\)/.test(t)) return; // visitante sem sessão
    erros.push(t.slice(0, 300));
  });
  page.on('pageerror', (e) => erros.push(`pageerror: ${String(e.message).slice(0, 300)}`));

  let pronto = true;
  try {
    await page.goto(BASE + cena.rota, { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('.atl[data-pronto="sim"]', { timeout: 90_000 });
  } catch (e) {
    pronto = false;
    erros.push(`não ficou pronto: ${String(e.message).split('\n')[0]}`);
  }
  await page.waitForTimeout(cena.espera ?? 3600);
  for (const a of cena.acoes ?? []) {
    try {
      if (a.click) await clicar(page, a.click);
      else if (a.fill) await page.fill(a.fill[0], a.fill[1]);
      else if (a.press) await page.keyboard.press(a.press);
      else if (a.wait) await page.waitForTimeout(a.wait);
      else if (a.mapClick) await page.mouse.click(a.mapClick[0], a.mapClick[1]);
      else if (a.eval) await page.evaluate(a.eval);
    } catch (e) {
      erros.push(`ação ${JSON.stringify(a).slice(0, 80)}: ${String(e.message).split('\n')[0]}`);
    }
  }
  await page.evaluate(() => document.fonts.ready);

  // assentar: a câmera parou (moveend) e o conjunto desenhado não muda entre duas leituras
  const temMedida = await page.evaluate(() => typeof window.__atlas?.maquetes === 'function');
  if (!temMedida) erros.push('window.__atlas.maquetes ausente (servidor de produção? a medição só existe em desenvolvimento)');
  let med = null;
  let rot = [];
  let papeis = null;
  let obst = [];
  let alturaUtil = null;
  let motivos = null;
  let opacidades = null;
  let maiorDaTela = null;
  if (temMedida) {
    let anterior = '';
    for (let i = 0; i < 12; i++) {
      const assin = await page.evaluate(() => {
        const m = window.__atlas.maquetes();
        return `${m.resumo.zoom.toFixed(3)}|${m.itens.map((x) => x.id).join(',')}`;
      });
      if (assin === anterior) break;
      anterior = assin;
      await page.waitForTimeout(400);
    }
    // 300 ms depois do último moveend, como pede o A4
    await page.waitForTimeout(300);
    // leva 4: a entrada da maquete é no tempo (~300 ms a partir do primeiro quadro desenhado,
    // que espera o GLB): repouso é quando toda maquete desenhada chegou à altura final (até 2 s)
    await page.waitForFunction(() => window.__atlas.maquetes().itens.every((i) => !i.desenhado3d || (i.escalaVertical ?? 1) >= 0.999), null, { timeout: 2000 }).catch(() => {});
    ({ med, rot, papeis, obst, alturaUtil, motivos, opacidades, maiorDaTela } = await page.evaluate(() => {
      // altura útil do mapa (A9): no celular, acima da folha ou do cartão. Réplica da conta do
      // controle (atualizarMaquetes: max(40% da altura, altura − margem de baixo)) e das margens
      // de AtlasV3 (cartão da vista sozinho 50%, ficha 40%, sem cartão 64 px). Se lá mudar, muda aqui.
      const cv = document.querySelector('.atl-mapa canvas');
      const w = cv?.clientWidth ?? 0;
      const h = cv?.clientHeight ?? 0;
      const ficha = !!document.querySelector('.atl-ficha');
      const vista = !!document.querySelector('.atl-vista');
      const base = ficha || vista ? Math.round(window.innerHeight * (vista && !ficha ? 0.5 : 0.4)) : 64;
      const hUtil = w < 700 ? Math.max(h * 0.4, h - base) : h;
      const med = window.__atlas.maquetes();
      // A12 (leva 4): a opacidade do rótulo e do selo da troca de cada vencedor, avaliada sobre a
      // expressão de pintura da camada no zoom de agora (número, interpolate/step no zoom, case
      // por propriedade: as formas que o controle usa nessas duas camadas)
      const ctl = globalThis.__controleDoAtlas;
      const mapa = ctl?.mapa;
      const opacidades = {};
      if (mapa) {
        const z = mapa.getZoom();
        const ev = (e, pr) => {
          if (typeof e === 'number') return e;
          if (!Array.isArray(e)) return null;
          if (e[0] === 'interpolate') {
            const st = e.slice(3);
            for (let i = 0; i < st.length - 2; i += 2) {
              if (z <= st[i]) return ev(st[i + 1], pr);
              if (z < st[i + 2]) {
                const t = (z - st[i]) / (st[i + 2] - st[i]);
                return ev(st[i + 1], pr) * (1 - t) + ev(st[i + 3], pr) * t;
              }
            }
            return ev(st[st.length - 1], pr);
          }
          if (e[0] === 'step') {
            let v = ev(e[2], pr);
            for (let i = 3; i < e.length; i += 2) if (z >= e[i]) v = ev(e[i + 1], pr);
            return v;
          }
          if (e[0] === 'case') {
            for (let i = 1; i < e.length - 1; i += 2) {
              const c = e[i];
              if (c[0] === '==' && Array.isArray(c[1]) && c[1][0] === 'get' && pr[c[1][1]] == c[2]) return ev(e[i + 1], pr);
            }
            return ev(e[e.length - 1], pr);
          }
          return null;
        };
        const tinta = (camada, prop) => (mapa.getLayer(camada) ? (mapa.getPaintProperty(camada, prop) ?? 1) : null);
        const eRot = tinta('maquetes-rotulo', 'text-opacity');
        const eSelo = tinta('maquetes-selo-troca', 'icon-opacity');
        for (const f of ctl.feicoesDasMaquetes ?? []) {
          const pr = f.properties ?? {};
          opacidades[pr.id] = { rotulo: eRot == null ? null : ev(eRot, pr), selo: eSelo == null || !pr.selo || pr.deCima === 1 ? null : ev(eSelo, pr) };
        }
      }
      // A16 (leva 4): a maior usina em operação (1 MW ou mais, fontes do pedido) com o ponto na
      // área útil, recontada sobre o arquivo carregado
      let maiorDaTela = null;
      const ped = ctl?.ultimoPedido;
      if (mapa && ped && ['rede', 'agua', 'combustivel'].includes(ped.capitulo)) {
        let melhor = null;
        for (const u of ped.usinas) {
          const p = u.properties;
          if (p.fase !== 0 || p.kw < 1000 || !ped.camadas.has(p.cat) || (ped.capitulo === 'agua' && p.cat !== 'hidro')) continue;
          if (melhor && p.kw <= melhor.properties.kw) continue;
          const q = mapa.project(u.geometry.coordinates);
          if (q.x >= 0 && q.x <= w && q.y >= 0 && q.y <= hUtil) melhor = u;
        }
        if (melhor) maiorDaTela = { id: `usina:${melhor.id}`, texto: `${melhor.properties.nome} ${(melhor.properties.kw / 1000).toFixed(1)} MW (${melhor.properties.cat})` };
      }
      return { motivos: window.__atlas.motivos?.() ?? null, med, rot: window.__atlas.rotulos(), papeis: window.__atlas.papeis?.() ?? null, obst: window.__atlas.rotulos(['maquetes-obstaculo']), alturaUtil: hUtil, opacidades, maiorDaTela };
    }));
  }
  const arquivo = path.join(OUT, `${cena.nome}.png`);
  await page.screenshot({ path: arquivo });
  if (SOBREPOR && med) {
    await sobrepor(page, med, rot);
    await page.screenshot({ path: path.join(OUT, `${cena.nome}-caixas.png`) });
    await page.evaluate(() => document.getElementById('__medida-sobreposta')?.remove());
  }
  // A14: contraste da borda de cada maquete contra o fundo vizinho e pixels de óxido fora da
  // seleção. Máscara da maquete = diferença entre a foto com e sem a camada 3D.
  let contraste = null;
  if (med && med.itens.some((i) => i.caixaMedida)) {
    try {
      const { casca, ...clip } = await page.evaluate(() => {
        const b = document.querySelector('.atl-mapa canvas').getBoundingClientRect();
        // a casca sobre o mapa (os mesmos seletores de zonasDaCasca do controle), em px do recorte:
        // o óxido dela (o sublinhado de "Inclinar" pressionado) não é o mapa (leva 2, item 2:
        // col-perto-rmsp-14 acusava 25 px de óxido porque uma torre caía sob "Inclinar")
        const casca = [...document.querySelectorAll('.atl-busca, .atl-controles, .mapboxgl-ctrl-attrib, .mapboxgl-ctrl-logo, .atl-ficha, .atl-vista')]
          .map((el) => el.getBoundingClientRect())
          .filter((r) => r.width > 0 && r.height > 0)
          .map((r) => [r.left - b.left, r.top - b.top, r.right - b.left, r.bottom - b.top]);
        return { x: b.left, y: b.top, width: b.width, height: b.height, casca };
      });
      const com = (await page.screenshot({ clip })).toString('base64');
      await page.evaluate(() => window.__atlas.maquetesLigadas(false));
      await page.waitForTimeout(400);
      const sem = (await page.screenshot({ clip })).toString('base64');
      await page.evaluate(() => window.__atlas.maquetesLigadas(true));
      await page.waitForTimeout(300);
      contraste = await page.evaluate(medirContraste, { com, sem, casca, caixas: med.itens.filter((i) => i.caixaMedida).map((i) => ({ id: i.id, c: i.caixaMedida })) });
    } catch (e) {
      erros.push(`contraste: ${String(e.message).split('\n')[0]}`);
    }
  }

  // desempenho (mexe na câmera: depois da foto e das medidas)
  const extra = SEM_FPS ? { resumoNaTela: await page.evaluate(() => document.querySelector('[data-atlas="resumo-maquetes"]')?.textContent ?? null) } : await page.evaluate(
    async ({ ab, temMedida, reduzido }) => {
      const a = window.__atlas;
      const r = { resumoNaTela: document.querySelector('[data-atlas="resumo-maquetes"]')?.textContent ?? null };
      if (!a) return r;
      if (reduzido && a.contarRepaints) r.repaints = await a.contarRepaints(2000);
      const m0 = temMedida ? a.maquetes().resumo : null;
      const voltar = async (ms = 2500) => {
        if (!m0) return;
        a.ir({ centro: m0.centro, zoom: m0.zoom, inclinacao: m0.inclinacao, rumo: m0.rumo });
        await new Promise((s) => setTimeout(s, ms));
      };
      r.msEscolha = temMedida ? a.msDaEscolha(10) : null;
      r.fpsParado = await a.fps();
      // o critério (A11): o primeiro giro da página, com as maquetes ligadas, como o leitor vê
      r.fpsMov = await a.fpsEmMovimento();
      await voltar();
      r.fpsZoom = temMedida ? await a.fpsEmZoom() : null;
      // custo das maquetes (informativo): sem maquete nenhuma os dois lados rodam o mesmo
      // código, e a diferença é só ruído e ordem; com maquetes, um giro de aquecimento
      // descartado e depois A-B-B-A duas vezes, mediana de cada lado
      if (ab && temMedida) {
        if (!m0.total) r.ab = { custo: null, motivo: 'nenhuma maquete na tela' };
        else {
          const com = [];
          const sem = [];
          const giro = async (ligadas) => {
            await voltar(1200);
            a.maquetesLigadas(ligadas);
            const v = await a.fpsEmMovimento();
            a.maquetesLigadas(true);
            return v;
          };
          await giro(true);
          for (let rep = 0; rep < 2; rep++)
            for (const ligadas of [true, false, false, true]) (ligadas ? com : sem).push(await giro(ligadas));
          const mediana = (v) => {
            const s = [...v].sort((x, y) => x - y);
            return s.length % 2 ? s[(s.length - 1) / 2] : (s[s.length / 2 - 1] + s[s.length / 2]) / 2;
          };
          const mc = mediana(com);
          const ms = mediana(sem);
          r.ab = { com, sem, medianaCom: mc, medianaSem: ms, custo: ms ? 1 - mc / ms : null };
        }
        await voltar();
      }
      return r;
    },
    { ab: AB, temMedida, reduzido: !!cena.reduzido },
  );
  if (ESTABILIDADE && med) {
    // A10 (decisão de 16/11/2026): arrasto na interseção das duas telas, varredura de zoom
    // contando piscadas, ida e volta. Uma recarga a quente no meio ("mapa não montado") faz a
    // medida sair n/d com o motivo, não FALHA.
    extra.estabilidade = await page
      .evaluate(
        async ({ m0, folga }) => {
          const a = window.__atlas;
          if (typeof a?.varrerZoom !== 'function') return { erro: 'window.__atlas.varrerZoom ausente' };
          const ir = async () => {
            a.ir({ centro: m0.centro, zoom: m0.zoom, inclinacao: m0.inclinacao, rumo: m0.rumo });
            await new Promise((s) => setTimeout(s, 2500));
          };
          await ir();
          const arrasto = await a.arrasto(undefined, folga);
          await ir();
          const varredura = await a.varrerZoom(0.6, 0.1, folga);
          await ir();
          const idaEVolta = await a.idaEVolta(0.3);
          return { arrasto, varredura, idaEVolta };
        },
        { m0: med.resumo, folga: LIM.folgaA10 },
      )
      .catch((e) => {
        // recarga a quente: a cena inteira é repetida
        if (/mapa não montado|context was destroyed/i.test(String(e.message))) throw e;
        return { erro: `estabilidade: ${String(e.message).split('\n')[0]}` };
      });
  }

  // A3 (leva 4, codigo.md 10): as torres DEPOIS DO AFASTAR (z0 − 0,3), o estado em que a
  // memória das torres age (a torre lembrada fica com a folga); volta a z0 no fim
  if (med && med.itens.some((i) => i.familia === 'torre')) {
    extra.torresDepoisDoAfastar = await page
      .evaluate(async (m0) => {
        const a = window.__atlas;
        a.ir({ centro: m0.centro, zoom: m0.zoom, inclinacao: m0.inclinacao, rumo: m0.rumo });
        await new Promise((s) => setTimeout(s, 2500));
        a.ir({ centro: m0.centro, zoom: m0.zoom - 0.3, inclinacao: m0.inclinacao, rumo: m0.rumo });
        await new Promise((s) => setTimeout(s, 2500));
        const r = a.maquetes();
        const torres = r.itens.filter((i) => i.familia === 'torre').map((i) => ({ id: i.id, pe: i.pe, zEf: i.zEf, zEfMedido: i.zEfMedido, histerese: i.histerese }));
        a.ir({ centro: m0.centro, zoom: m0.zoom, inclinacao: m0.inclinacao, rumo: m0.rumo });
        await new Promise((s) => setTimeout(s, 1500));
        return { zoom: Math.round(r.resumo.zoom * 100) / 100, torres };
      }, med.resumo)
      .catch((e) => ({ erro: String(e.message).split('\n')[0] }));
  }
  extra.opacidades = opacidades;
  extra.maiorDaTela = maiorDaTela;
  extra.papeis = papeis;
  extra.contraste = contraste;
  extra.obst = obst;
  extra.alturaUtil = alturaUtil;
  extra.motivos = motivos;
  const crit = med ? avaliar(cena, med, rot, extra) : {};
  if (!pronto || erros.length) falhou = true;
  if (Object.values(crit).some((c) => c.status === 'FALHA')) falhou = true;
  linhas.push({ nome: cena.nome, rota: cena.rota, modo: cena.modo, viewport: cena.viewport, recentrada: cena.recentrada ?? null, pronto, erros, resumo: med?.resumo ?? null, criterios: crit, extra, itens: med?.itens ?? [], rotulos: rot });

  // tabela da cena
  const R = med?.resumo;
  console.log(`\n${cena.nome}  ${R ? `${R.largura}×${R.altura} z${R.zoom.toFixed(2)} incl ${R.inclinacao.toFixed(0)}° · ${R.total} maquetes (usina ${R.porFamilia.usina} · rede ${R.porFamilia.rede} · anp ${R.porFamilia.anp} · torre ${R.porFamilia.torre})${R.satelite ? ' · satélite' : ''}${R.relevo ? ' · relevo' : ''}` : 'sem medida'}${erros.length ? ` · ERROS ${erros.length}` : ''}`);
  for (const e of erros) console.log(`    erro: ${e}`);
  const resumoDe = {
    A1: (c) => `>2%: ${c.acima2} · >10%: ${c.acima10} · pior ${c.pior} (justa: ${c.justa?.acima2}/${c.justa?.acima10}, pior ${c.justa?.pior})`,
    A2: (c) => `menor pé–pé ${c.menorDist} px (limite do par ${c.limiteDoPar}) · ${c.violacoes} pares abaixo`,
    A3: (c) => `N0..N4 ${Object.values(c.porNivel ?? {}).join('/')} · torres ${c.torres} (${c.lembradas} lembradas)${c.depoisDoAfastar ? ` · depois do afastar z${c.depoisDoAfastar.zoom}: ${c.depoisDoAfastar.torres} torres, ${c.depoisDoAfastar.lembradas} lembradas${c.depoisDoAfastar.erro ? ` (${c.depoisDoAfastar.erro})` : ''}` : ''}${c.estouros?.length ? ` · ${c.estouros.join('; ')}` : ''}`,
    A4: (c) => `${c.cruzados} rótulos sobre maquete ${JSON.stringify(c.porCamada)} · vão fora de 2–12: ${c.foraDoVao}/${c.rotulosProprios} · sem rótulo: ${c.vencedoresSemRotulo}${c.obstaculo ? ` · obstáculo cobre ≥ ${c.obstaculo.menorCobertura}, sobra ≤ ${c.obstaculo.maiorSobra}×${c.obstaculo.descobertos.length ? ` (descobertos ${c.obstaculo.descobertos.join(',')})` : ''}` : ''}`,
    A5: (c) => `pior ${c.piorPx} px (tol ${c.tolerancia}) · membros ${c.membros}`,
    A11: (c) => `fps ${c.fpsParado} parado · ${c.fpsMov} mov · ${c.fpsZoom} zoom (meta ≥ ${LIM.fpsMin})${c.custoInformativo ? ` · custo (info) ${c.custoInformativo.custo ?? `— ${c.custoInformativo.motivo}`}${c.custoInformativo.medianaCom != null ? `, mediana ${c.custoInformativo.medianaCom} com / ${c.custoInformativo.medianaSem} sem` : ''}` : ''} · escolha ${c.msEscolha} ms`,
    A12: (c) => `${c.abaixoDe94} com zEf < 9,4 · escala vertical ${c.escalaVertical ? c.escalaVertical.join('–') : '—'} · estado intermediário: ${c.meias.length ? c.meias.join('; ') : 'nenhum'} (opacidades lidas ${c.opacidadesLidas})`,
    A16: (c) => (c.status === 'n/d' ? `${c.motivo}${c.maior ? ` (${c.maior})` : ''}` : `maior: ${c.maior} → ${c.comMaquete ?? c.declarado ?? `SEM MAQUETE (${c.motivoNaEscolha ?? 'sem motivo'})`}`),
    A13: (c) => (c.status === 'n/d' ? c.motivo : `${c.aerogeradoresETorres3D} aerogeradores/torres em 3D · ${c.eolicos} eólicos, ${c.selosNoPe} selos no pé · aviso ${c.aviso}`),
    A14: (c) => (c.status === 'n/d' ? c.motivo : `${c.contrasteMin != null ? `contraste mín ${c.contrasteMin}${c.abaixoDe3?.length ? ` (abaixo de 3: ${c.abaixoDe3.slice(0, 4).join(', ')})` : ''}` : ''}${c.oxido != null ? ` · óxido ${c.oxido} px` : ''}${c.maquetes3D != null ? ` · satélite z${c.zoom}: ${c.maquetes3D} em 3D` : ''}${c.repaintsParado != null ? ` · repaints parado ${c.repaintsParado}` : ''}`),
    A6: (c) => (c.status === 'n/d' ? c.motivo : `cobertura ${c.cobertura} (${c.informativa ? `informativa: ${c.informativa}` : `alarme abaixo de ${c.minimo}, nível ${c.nivel}`}) · ${c.mwRepresentado}/${c.mwNaTela} MW`),
    A7: (c) => `fora da lei ${c.foraDaLei.length} · ordem quebrada ${c.ordemQuebrada.length} · Itaipu/30 MW ${c.itaipuSobre30MW}× · no piso de leitura ${c.noPisoDeLeitura}`,
    A8: (c) => (c.status === 'n/d' ? c.motivo : `vencedor 2D ${c.vencedores2D.length} · âncoras ${c.ancoras} · órfãs ${c.orfas.length} · sem âncora ${c.semAncora.length} · rótulos de usina ${c.rotulosDeUsina}`),
    A9: (c) => c.motivo ?? c.texto ?? (c.ausente ? 'ausente (z<9,4)' : ''),
    A15: (c) => (c.status === 'n/d' || !c.falhas ? c.motivo : `nível 4: ${c.comMaquete}/${c.candidatosN4} com maquete · sem: ${JSON.stringify(c.semMaquete)}${c.falhas.length ? ` · FALHAS ${c.falhas.join('; ')}` : ''}`),
    A10: (c) =>
      c.status === 'n/d'
        ? c.motivo
        : `arrasto ${c.arrasto.dx} px: Jaccard ${c.arrasto.jaccard} sobre ${c.arrasto.comparaveis}${c.arrasto.saiu.length || c.arrasto.entrou.length ? ` (−${c.arrasto.saiu.join(',')} +${c.arrasto.entrou.join(',')})` : ''} · varredura z${c.varredura.de}–${c.varredura.ate}: ${c.varredura.piscadas.length} piscadas em ${c.varredura.olhados}${c.varredura.piscadas.length ? ` [${c.varredura.piscadas.map((p) => `${p.id} ${p.presenca} ${p.mudancas.join(' ')}`).join('; ')}]` : ''} · ida e volta: ${c.idaEVolta.perdidos.length} perdidos de ${c.idaEVolta.antes}${c.idaEVolta.perdidos.length ? ` (${c.idaEVolta.perdidos.join('; ')})` : ''}${c.idaEVolta.saiuNaIda?.length ? ` · saíram na ida, pela borda: ${c.idaEVolta.saiuNaIda.join('; ')}` : ''}`,
  };
  for (const [k, f] of Object.entries(resumoDe)) if (crit[k]) console.log(`  ${k.padEnd(4)} ${crit[k].status.padEnd(6)} ${f(crit[k])}`);
  await ctx.close();
}
// Outros agentes editam o produto ao mesmo tempo: uma recarga a quente desmonta o mapa no meio
// da medição ("mapa não montado"). A cena é repetida (até 3 vezes) em vez de derrubar a rodada.
for (const cena of plano) {
  if (SO && !SO.test(cena.nome)) continue;
  for (let tentativa = 1; ; tentativa++) {
    try {
      await rodarCena(cena);
      break;
    } catch (e) {
      const msg = String(e?.message ?? e).split('\n')[0];
      await ctxAtual?.close().catch(() => {});
      if (tentativa < 3) {
        console.log(`\n${cena.nome}: ${msg} · repetindo (tentativa ${tentativa + 1})`);
        continue;
      }
      falhou = true;
      linhas.push({ nome: cena.nome, rota: cena.rota, modo: cena.modo, viewport: cena.viewport, pronto: false, erros: [`exceção: ${msg}`], resumo: null, criterios: {}, extra: {}, itens: [], rotulos: [] });
      console.log(`\n${cena.nome}: ${msg} · desisti depois de 3 tentativas`);
      break;
    }
  }
}
await browser.close();

const anteriores = SO ? JSON.parse(await fs.readFile(path.join(OUT, 'medidas.json'), 'utf8').catch(() => '[]')).filter((x) => !linhas.some((y) => y.nome === x.nome)) : [];
await fs.writeFile(path.join(OUT, 'medidas.json'), JSON.stringify([...anteriores, ...linhas], null, 1) + '\n');
console.log(`\n${linhas.length} cena(s) em ${OUT}${falhou ? ' · há FALHA' : ' · nada falha'}`);
process.exitCode = falhou ? 1 : 0;
