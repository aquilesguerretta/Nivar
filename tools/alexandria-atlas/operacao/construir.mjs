// Operação horária do SIN, um dia real: monta public/alexandria/atlas/dados/operacao-dias.json.
//
//   node tools/alexandria-atlas/operacao/baixar.mjs          (grava o bruto; ver o README)
//   node tools/alexandria-atlas/operacao/construir.mjs [--hoje AAAA-MM-DD] [--dias AAAA-MM-DD,…] [--sem-manifesto]
//
// Lê só tools/alexandria-atlas/bruto/operacao/ e, do repositório, usinas-principais.json e
// usinas-menores.json (o ponto que o Atlas desenha). Para se algum arquivo do bruto não bater com o
// SHA-256 de consultas.json. Regra dos dias: comum.mjs. `--dias` troca a lista (só para ensaio; o
// arquivo registra a regra que valeu).
//
// O que este construtor NÃO faz, de propósito:
//  - não reparte a geração de um conjunto entre os membros (o conjunto é uma entidade, no centro dos
//    membros que o Atlas posiciona, com a lista deles);
//  - não soma Itaipu 50 Hz (setor paraguaio) à geração do Brasil: as duas linhas do ONS são duas
//    entidades, e a conferência diz como o balanço do ONS trata a de 50 Hz;
//  - não dá ponto às "Pequenas Usinas (MMGD)" e "(Tipo III)" por estado: são previsões (o portal diz)
//    e vão somadas por hora num bloco à parte.

import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import {
  BRUTO, RAIZ, ORDINAL, arqBalanco, arqEolica, arqGeracao, arqSolar, diasDeMaiorCarga, linhasCsv,
  urlBalanco, urlEolica, urlGeracao, urlSolar,
} from './comum.mjs';

const ARGS = process.argv.slice(2);
const arg = (n) => (ARGS.includes(n) ? ARGS[ARGS.indexOf(n) + 1] : null);
const DADOS = join(RAIZ, 'public', 'alexandria', 'atlas', 'dados');
const SAIDA = join(DADOS, 'operacao-dias.json');
const MANIFESTO = join(RAIZ, 'tools', 'alexandria-atlas', 'manifesto-fontes.json');
const sha = (b) => createHash('sha256').update(b).digest('hex');

// ───────────────────────── bruto conferido ─────────────────────────
const CONSULTAS = JSON.parse(readFileSync(join(BRUTO, 'consultas.json'), 'utf8'));
for (const [nome, r] of Object.entries(CONSULTAS)) {
  const p = join(BRUTO, nome);
  if (!existsSync(p)) throw new Error(`${nome}: está em consultas.json mas não no bruto`);
  if (sha(readFileSync(p)) !== r.sha256) throw new Error(`${nome}: SHA-256 não confere com consultas.json; rode baixar.mjs de novo`);
}
const HOJE = arg('--hoje') || CONSULTAS[Object.keys(CONSULTAS).find((k) => k.startsWith('ons-balanco-'))].acesso.slice(0, 10);

// ───────────────────────── o Atlas: usinas com ponto ─────────────────────────
const CATEGORIAS = ['hidro', 'eolica', 'solar', 'nuclear', 'biomassa', 'gas', 'carvao', 'oleo', 'outros'];
const SUBS = ['N', 'NE', 'S', 'SE'];
const nucleo = (ceg) => ((ceg || '').split('.')[3] || '').split('-')[0] || null;
const porNucleo = new Map(); // núcleo → usina do Atlas
const colisoes = [];
for (const arq of ['usinas-principais.json', 'usinas-menores.json']) {
  const u = JSON.parse(readFileSync(join(DADOS, arq), 'utf8'));
  if (JSON.stringify(u.categorias) !== JSON.stringify(CATEGORIAS)) throw new Error(`${arq}: a lista de categorias mudou; ajuste CATEGORIAS`);
  for (let i = 0; i < u.n; i++) {
    const k = nucleo(u.ceg[i]);
    if (!k) continue;
    if (porNucleo.has(k)) colisoes.push([porNucleo.get(k).ceg, u.ceg[i]]);
    else porNucleo.set(k, { ceg: u.ceg[i], lon: u.lon[i], lat: u.lat[i], kw: u.kw[i], fase: u.fase[i], cat: u.cat[i], arq });
  }
}
if (colisoes.length) throw new Error(`núcleo de CEG repetido no Atlas: ${JSON.stringify(colisoes.slice(0, 5))}`);
const DATA_BASE_USINAS = JSON.parse(readFileSync(join(DADOS, 'usinas-principais.json'), 'utf8')).dataBase;

// ───────────────────────── relação usina–conjunto (ONS) ─────────────────────────
const relacao = [];
for await (const r of linhasCsv(join(BRUTO, 'ons-relacionamento-usina-conjunto.csv'))) {
  if (!r.id_ons_conjunto) continue;
  relacao.push({ conj: r.id_ons_conjunto, usina: r.id_ons_usina, nome: r.nom_usina, ceg: r.ceg, de: r.dat_iniciorelacionamento, ate: r.dat_fimrelacionamento || null });
}
// a relação repete o mesmo CEG com dois id_ons_usina em alguns conjuntos (ex.: Conj. Caju, RNST6 e
// RNST06): o membro conta uma vez
const membrosEm = (conj, dia) => {
  const vistos = new Set();
  return relacao.filter((m) => {
    if (m.conj !== conj || (m.de && m.de > dia) || (m.ate && m.ate < dia) || vistos.has(m.ceg)) return false;
    vistos.add(m.ceg);
    return true;
  });
};

// ───────────────────────── categoria do ONS → categoria do Atlas ─────────────────────────
function categoriaOns(tipoUsina, comb) {
  const c = (comb || '').toLowerCase();
  if (/hidr/.test(c)) return 0;
  if (/e[óo]lic/.test(c)) return 1;
  if (/fotovolt|solar/.test(c)) return 2;
  if (/nuclear/.test(c)) return 3;
  if (/biomassa/.test(c)) return 4;
  if (/^g[áa]s/.test(c)) return 5;
  if (/carv/.test(c)) return 6;
  if (/[óo]leo|diesel/.test(c)) return 7;
  return 8; // resíduos industriais, multicombustível, outros
}

// ───────────────────────── dias ─────────────────────────
async function instantesPorDia(arquivo, campo, filtro = () => true) {
  const m = new Map();
  for await (const r of linhasCsv(join(BRUTO, arquivo))) {
    if (!filtro(r)) continue;
    const t = r[campo];
    const d = t.slice(0, 10);
    if (!m.has(d)) m.set(d, new Set());
    m.get(d).add(t.slice(11, 16));
  }
  return m;
}
// os dias completos de uma base (todas as n marcas de hora do dia presentes)
const diasCompletos = (m, n) => new Set([...m].filter(([, s]) => s.size === n).map(([d]) => d));

async function escolherDias() {
  if (arg('--dias')) return arg('--dias').split(',').map((dia) => ({ dia, razao: 'ensaio (lista dada na linha de comando)', rotulo: 'ensaio' }));
  const trims = await diasDeMaiorCarga(HOJE);
  const mes = HOJE.slice(0, 7);
  const meses = Object.keys(CONSULTAS).filter((k) => k.startsWith('ons-geracao-usina-')).map((k) => k.slice(18, 25)).sort();
  // último dia completo nas quatro bases, procurado do mês mais novo baixado para trás: o dia mais
  // novo que está completo em CADA uma delas (não o menor dos últimos de cada base, que podia cair
  // num buraco de outra)
  let ultimo = null;
  const ultimos = {};
  for (const m of meses.reverse()) {
    if (m > mes) continue;
    const G = diasCompletos(await instantesPorDia(arqGeracao(m), 'din_instante'), 24);
    const E = diasCompletos(await instantesPorDia(arqEolica(m), 'din_instante'), 48);
    const S = diasCompletos(await instantesPorDia(arqSolar(m), 'din_instante'), 48);
    const B = diasCompletos(await instantesPorDia(arqBalanco(Number(m.slice(0, 4))), 'din_instante', (r) => r.id_subsistema === 'SIN' && r.val_carga !== '' && Number(r.val_carga) > 0 && r.din_instante.startsWith(m)), 24);
    const maisNovo = (X) => [...X].sort().at(-1) ?? null;
    Object.assign(ultimos, { geracao: maisNovo(G), corteEolico: maisNovo(E), corteFotovoltaico: maisNovo(S), balanco: maisNovo(B) });
    ultimo = [...G].filter((x) => E.has(x) && S.has(x) && B.has(x)).sort().at(-1) ?? null;
    if (ultimo) break;
  }
  if (!ultimo) throw new Error('não achei dia completo nas quatro bases nos meses baixados');
  const dias = trims.map((t) => ({
    dia: t.dia,
    razao: `maior carga do SIN no ${ORDINAL[t.t - 1]} trimestre de ${t.ano}`,
    rotulo: 'maior carga do trimestre',
    trimestre: `${t.ano}-T${t.t}`,
    cargaSinMWh: t.cargaSinMWh,
  }));
  if (!dias.some((d) => d.dia === ultimo)) dias.push({ dia: ultimo, razao: 'último dia completo publicado nas quatro bases', rotulo: 'último dia publicado', ultimoDiaPorBase: ultimos });
  return dias;
}

// ───────────────────────── um dia ─────────────────────────
const r0 = (x) => Math.round(x);
const soma = (a) => a.reduce((s, x) => s + x, 0);
const MOTIVOS = ['REL', 'CNF', 'ENE', 'PAR'];
const LETRA = { REL: 'R', CNF: 'C', ENE: 'E', PAR: 'P' };

async function lerGeracao(dia) {
  const linhas = new Map(); // id_ons → { meta, mw[24] }
  for await (const r of linhasCsv(join(BRUTO, arqGeracao(dia.slice(0, 7))))) {
    if (!r.din_instante.startsWith(dia)) continue;
    const h = Number(r.din_instante.slice(11, 13));
    // os agregados por estado ("Pequenas Usinas") vêm sem id_ons: a chave é o nome
    const chave = r.id_ons || `nome:${r.nom_usina}`;
    let e = linhas.get(chave);
    if (!e) {
      e = { id: r.id_ons || null, nome: r.nom_usina, mod: r.cod_modalidadeoperacao, tipoOns: r.nom_tipousina, comb: r.nom_tipocombustivel, sub: r.id_subsistema, uf: r.id_estado, ceg: r.ceg, mw: new Array(24).fill(0), horas: new Set(), vazias: 0 };
      linhas.set(chave, e);
    }
    if (e.sub !== r.id_subsistema || e.mod !== r.cod_modalidadeoperacao || e.ceg !== r.ceg) throw new Error(`${dia} ${r.id_ons}: subsistema, modalidade ou CEG muda dentro do dia`);
    if (e.horas.has(h)) throw new Error(`${dia} ${chave}: hora ${h} repetida`);
    e.horas.add(h);
    const v = Number(r.val_geracao);
    if (r.val_geracao !== '' && !Number.isFinite(v)) throw new Error(`${dia} ${r.id_ons}: val_geracao ilegível (${r.val_geracao})`);
    // val_geracao vazio: a fonte não deu valor naquela hora (não é zero medido); conta-se à parte
    if (r.val_geracao === '') e.vazias++;
    e.mw[h] = r.val_geracao === '' ? 0 : v;
  }
  if (!linhas.size) throw new Error(`${dia}: nenhuma linha no arquivo de geração`);
  return linhas;
}

async function lerCorte(dia) {
  const porId = new Map();
  for (const [fonte, arq] of [['eolica', arqEolica], ['fotovoltaica', arqSolar]]) {
    for await (const r of linhasCsv(join(BRUTO, arq(dia.slice(0, 7))))) {
      if (!r.din_instante.startsWith(dia)) continue;
      const h = Number(r.din_instante.slice(11, 13));
      let e = porId.get(r.id_ons);
      if (!e) {
        e = { id: r.id_ons, nome: r.nom_usina, fonte, gnr: new Array(48).fill(0), cod: new Array(48).fill(null), origem: [], textos: [] };
        porId.set(r.id_ons, e);
      }
      const meia = h * 2 + (r.din_instante.slice(14, 16) === '30' ? 1 : 0);
      const g = r.val_geracaonaorealizadaapurada === '' ? 0 : Number(r.val_geracaonaorealizadaapurada);
      if (!Number.isFinite(g)) throw new Error(`${dia} ${r.id_ons}: GNRa ilegível`);
      e.gnr[meia] = Math.max(0, g);
      const cod = r.cod_razaorestricao || null;
      if (cod && !MOTIVOS.includes(cod)) throw new Error(`${dia} ${r.id_ons}: motivo desconhecido ${cod}`);
      e.cod[meia] = cod;
      if (cod) {
        if (r.cod_origemrestricao) e.origem.push(r.cod_origemrestricao);
        if (r.dsc_restricao) e.textos.push(r.dsc_restricao);
      }
    }
  }
  return porId;
}

async function lerBalanco(dia) {
  const b = Object.fromEntries([...SUBS, 'SIN'].map((s) => [s, { ger: new Array(24).fill(null), carga: new Array(24).fill(null), hid: new Array(24).fill(0), ter: new Array(24).fill(0), eol: new Array(24).fill(0), sol: new Array(24).fill(0) }]));
  for await (const r of linhasCsv(join(BRUTO, arqBalanco(Number(dia.slice(0, 4)))))) {
    if (!r.din_instante.startsWith(dia)) continue;
    const s = b[r.id_subsistema];
    if (!s) continue;
    const h = Number(r.din_instante.slice(11, 13));
    const v = (k) => (r[k] === '' ? 0 : Number(r[k]));
    s.hid[h] = v('val_gerhidraulica');
    s.ter[h] = v('val_gertermica');
    s.eol[h] = v('val_gereolica');
    s.sol[h] = v('val_gersolar');
    s.ger[h] = s.hid[h] + s.ter[h] + s.eol[h] + s.sol[h];
    s.carga[h] = r.val_carga === '' ? null : Number(r.val_carga);
  }
  for (const k of [...SUBS, 'SIN']) if (b[k].ger.some((x) => x == null)) throw new Error(`${dia}: balanço do ${k} sem as 24 horas`);
  return b;
}

const TEXTOS = [];
const indiceDoTexto = (t) => {
  if (t == null) return -1;
  let k = TEXTOS.indexOf(t);
  if (k < 0) k = TEXTOS.push(t) - 1;
  return k;
};
const MODALIDADES = [];
const indiceDaModalidade = (m) => {
  let k = MODALIDADES.indexOf(m);
  if (k < 0) k = MODALIDADES.push(m) - 1;
  return k;
};

const maisFrequente = (xs) => {
  const c = new Map();
  for (const x of xs) c.set(x, (c.get(x) || 0) + 1);
  return [...c].sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;
};

// ───────────────────────── montagem ─────────────────────────
const dias = await escolherDias();
console.log(dias.map((d) => `${d.dia}  ${d.razao}`).join('\n'));

// entidades: uma tabela só, montada com o dia mais novo em que cada uma aparece
const brutoPorDia = [];
for (const d of dias) brutoPorDia.push({ d, ger: await lerGeracao(d.dia), corte: await lerCorte(d.dia), bal: await lerBalanco(d.dia) });

const ent = []; // { id, nome, tipo, cat, sub, uf, mod, ceg, lon, lat, membros, membrosSemPonto, kw, obs, grupoSemPonto }
const idx = new Map();
const AGREGADO = /^Pequenas Usinas/;
const mudancasDeMembros = [];
const ordemNova = [...brutoPorDia].sort((a, b) => (a.d.dia < b.d.dia ? 1 : -1));
for (const { d, ger } of ordemNova) {
  for (const g of ger.values()) {
    if (AGREGADO.test(g.mod) || idx.has(g.id)) continue;
    const e = { id: g.id, nome: g.nome, tipo: g.mod === 'Conjunto de Usinas' ? 'conjunto' : 'usina', cat: categoriaOns(g.tipoOns, g.comb), sub: SUBS.indexOf(g.sub), uf: g.uf, mod: g.mod, ceg: null, lon: null, lat: null, membros: null, membrosSemPonto: null, kw: null, obs: null };
    if (e.sub < 0) throw new Error(`${g.id}: subsistema ${g.sub} fora de N/NE/S/SE`);
    if (e.tipo === 'usina') {
      const a = porNucleo.get(nucleo(g.ceg));
      if (a) Object.assign(e, { ceg: a.ceg, lon: a.lon, lat: a.lat, kw: a.kw });
      if (g.id === 'PRIT60') e.obs = 'setor brasileiro de Itaipu, 60 Hz';
      if (g.id === 'PYIT50') e.obs = 'setor paraguaio de Itaipu, 50 Hz: não somar à geração do Brasil';
    } else {
      const ms = membrosEm(g.id, d.dia);
      const comPonto = ms.map((m) => porNucleo.get(nucleo(m.ceg))).filter(Boolean);
      e.membros = comPonto.map((a) => a.ceg);
      e.membrosSemPonto = ms.length - comPonto.length;
      e.membrosNaRelacao = ms.length;
      if (comPonto.length) {
        e.lon = Math.round((soma(comPonto.map((a) => a.lon)) / comPonto.length) * 1e4) / 1e4;
        e.lat = Math.round((soma(comPonto.map((a) => a.lat)) / comPonto.length) * 1e4) / 1e4;
        e.kw = soma(comPonto.map((a) => a.kw));
      }
      // a composição muda entre os dias publicados?
      for (const o of brutoPorDia) {
        if (o.d.dia === d.dia || !o.ger.has(g.id)) continue;
        const outra = membrosEm(g.id, o.d.dia).map((m) => m.ceg).sort().join();
        if (outra !== ms.map((m) => m.ceg).sort().join()) mudancasDeMembros.push({ id: g.id, dia: o.d.dia, relativoA: d.dia });
      }
    }
    idx.set(g.id, ent.length);
    ent.push(e);
  }
}
// o ONS publica algumas usinas da ANEEL em mais de uma linha (Itaipu 60/50 Hz, Belo Monte e Pimental…)
{
  const porCeg = new Map();
  for (const e of ent) if (e.tipo === 'usina' && e.ceg) (porCeg.get(e.ceg) || porCeg.set(e.ceg, []).get(e.ceg)).push(e);
  for (const es of porCeg.values()) {
    if (es.length < 2) continue;
    for (const e of es) {
      const outros = es.filter((o) => o !== e).map((o) => `${o.nome} (${o.id})`).join(', ');
      const frase = `o ONS publica esta usina da ANEEL em mais de uma linha; a outra é ${outros}`;
      e.obs = e.obs ? `${e.obs}; ${frase}` : frase;
      // a potência da ANEEL (kw) é a do CEG inteiro, não a desta linha: a interface tem de dizer
      e.cegEmLinhas = es.filter((o) => o !== e).map((o) => o.id);
    }
  }
}
// ordem estável: por subsistema, depois id
const ordem = ent.map((e, i) => i).sort((a, b) => ent[a].sub - ent[b].sub || (ent[a].id < ent[b].id ? -1 : 1));
const entOrd = ordem.map((i) => ent[i]);
idx.clear();
entOrd.forEach((e, i) => idx.set(e.id, i));
const temPonto = (e) => e.lon != null;

const saidaDias = [];
for (const { d, ger, corte, bal } of brutoPorDia) {
  const mw = new Array(entOrd.length).fill(null);
  const grupos = new Map(); // grupo|sub|cat → mw[24]
  const somaGrupo = (grupo, previsao, sub, cat, serie) => {
    const k = `${grupo}|${sub}|${cat}`;
    if (!grupos.has(k)) grupos.set(k, { grupo, previsao, sub, cat, mw: new Array(24).fill(0) });
    const g = grupos.get(k);
    for (let h = 0; h < 24; h++) g.mw[h] += serie[h];
  };
  const horasFaltando = [];
  const semValor = [];
  const horasVazias = [];
  const semPar = [];
  const semParMw = new Array(24).fill(0);
  // o arquivo de geração de cada mês traz o subsistema como estava naquele mês: o ONS passou alguns
  // conjuntos de subsistema (CJU_BASDA1 é NE nos arquivos até abr/2026 e SE a partir de set/2026;
  // CJU_MTCFAZ é N em fev/2026 e SE em nov/2026). O balanço por subsistema do ONS, o mesmo dos cinco
  // dias, já os conta no subsistema novo em TODOS os dias (medido: tirar CJU_BASDA1 do SE em
  // 02/12/2025 deixa a eólica do SE do balanço 91% sem par), e a relação usina–conjunto também o
  // dá no novo. O Atlas usa o novo (`entidades.sub`) e publica, por dia, o que o arquivo do mês diz
  // quando difere (índice da entidade → índice do subsistema), para a ficha dizer.
  const subNoDia = {};
  const subDe = (i) => entOrd[i].sub;
  for (const g of ger.values()) {
    if (g.horas.size !== 24) horasFaltando.push({ id: g.id, horas: g.horas.size });
    const serie = g.mw.map(r0);
    if (AGREGADO.test(g.mod)) {
      somaGrupo(/MMGD/.test(g.mod) ? 'mmgd' : 'tipo3', true, SUBS.indexOf(g.sub), categoriaOns(g.tipoOns, g.comb), serie);
      continue;
    }
    const i = idx.get(g.id);
    if (SUBS.indexOf(g.sub) !== entOrd[i].sub) subNoDia[i] = SUBS.indexOf(g.sub);
    if (g.vazias === 24) {
      semValor.push(g.id);
      continue;
    }
    if (g.vazias) horasVazias.push({ id: g.id, horas: g.vazias });
    mw[i] = serie;
    const e = entOrd[i];
    // sem ponto no mapa: a série já está em mw[i] (e a interface a conta como sem ponto pela falta de
    // lon/lat); aqui fica só o inventário, para não somar duas vezes
    if (!temPonto(e)) {
      semPar.push({ id: e.id, nome: e.nome, mwh: soma(serie) });
      for (let h = 0; h < 24; h++) semParMw[h] += serie[h];
    }
  }
  const gruposArr = [...grupos.values()].sort((a, b) => a.grupo.localeCompare(b.grupo) || a.sub - b.sub || a.cat - b.cat);
  const semPontoMw = new Array(24).fill(0);
  for (const g of gruposArr) for (let h = 0; h < 24; h++) semPontoMw[h] += g.mw[h];

  // os membros dos conjuntos NESTE dia (a relação do ONS tem data de início e de fim): `entidades`
  // traz os do dia mais novo; aqui vai só o conjunto cuja composição difere neste dia
  const membrosNoDia = {};
  for (const g of ger.values()) {
    if (AGREGADO.test(g.mod)) continue;
    const i = idx.get(g.id);
    const e = entOrd[i];
    if (e.tipo !== 'conjunto') continue;
    const ms = membrosEm(g.id, d.dia);
    const comPonto = ms.map((x) => porNucleo.get(nucleo(x.ceg))).filter(Boolean);
    const cegs = comPonto.map((a) => a.ceg);
    if (cegs.slice().sort().join() === (e.membros ?? []).slice().sort().join() && ms.length - comPonto.length === e.membrosSemPonto) continue;
    membrosNoDia[i] = { membros: cegs, membrosSemPonto: ms.length - comPonto.length, kw: comPonto.length ? soma(comPonto.map((a) => a.kw)) : null };
  }

  // corte
  const corteEnt = [];
  const porHora = { naoRealizadaEstimada: new Array(24).fill(0), ...Object.fromEntries(MOTIVOS.map((m) => [m, new Array(24).fill(0)])) };
  const semEntidade = [];
  const textosDoDia = [];
  let soLimitadas = 0;
  for (const c of corte.values()) {
    const horaria = [];
    const motivo = [];
    const porMotivo = Object.fromEntries(MOTIVOS.map((m) => [m, 0]));
    for (let h = 0; h < 24; h++) {
      const a = c.gnr[2 * h];
      const b = c.gnr[2 * h + 1];
      horaria.push((a + b) / 2); // MW médios na hora = média das duas meias-horas
      const ca = c.cod[2 * h];
      const cb = c.cod[2 * h + 1];
      motivo.push(ca && cb ? (b > a ? cb : ca) : ca || cb || null);
      if (ca) porMotivo[ca] += a / 2;
      if (cb) porMotivo[cb] += b / 2;
      // GNRa sem motivo na mesma meia-hora não aparece na fonte; se aparecer, para
      if ((a > 0 && !ca) || (b > 0 && !cb)) throw new Error(`${d.dia} ${c.id}: geração não realizada sem motivo`);
    }
    const total = soma(horaria);
    const temRestricao = c.cod.some(Boolean);
    if (!temRestricao) continue;
    if (total < 0.5) {
      soLimitadas++;
      continue;
    }
    const i = idx.get(c.id);
    if (i === undefined) {
      semEntidade.push({ id: c.id, nome: c.nome, mwh: r0(total) });
      continue;
    }
    for (let h = 0; h < 24; h++) {
      porHora.naoRealizadaEstimada[h] += horaria[h];
      if (motivo[h]) porHora[motivo[h]][h] += horaria[h];
    }
    textosDoDia.push(...c.textos);
    const pm = Object.fromEntries(Object.entries(porMotivo).filter(([, v]) => v >= 0.5).map(([k, v]) => [k, r0(v)]));
    corteEnt.push({
      i,
      naoRealizadaEstimada: horaria.map(r0),
      motivo: motivo.map((m) => (m ? LETRA[m] : '-')).join(''),
      porMotivo: pm,
      dominante: Object.entries(porMotivo).sort((x, y) => y[1] - x[1])[0][0],
      origem: maisFrequente(c.origem),
      texto: maisFrequente(c.textos),
    });
  }
  corteEnt.sort((a, b) => soma(b.naoRealizadaEstimada) - soma(a.naoRealizadaEstimada));
  // colunar, como as entidades (o arquivo tem teto de tamanho); o texto vai pelo índice em `textos`
  const corteCol = {
    n: corteEnt.length,
    ...Object.fromEntries(['i', 'naoRealizadaEstimada', 'motivo', 'porMotivo', 'dominante', 'origem'].map((k) => [k, corteEnt.map((c) => c[k])])),
    texto: corteEnt.map((c) => indiceDoTexto(c.texto)),
  };
  for (const k of Object.keys(porHora)) porHora[k] = porHora[k].map(r0);

  // a mesma usina da ANEEL em duas entidades do MESMO dia (avulsa e membro de conjunto, ou em dois
  // conjuntos)? Com a relação vigente no dia. As linhas do ONS que dividem um CEG por desenho
  // (Itaipu 60/50 Hz, Belo Monte e Pimental…) contam à parte, em cegDividido.
  const vistos = new Map();
  for (const g of ger.values()) {
    if (AGREGADO.test(g.mod) || !mw[idx.get(g.id)]) continue;
    const e = entOrd[idx.get(g.id)];
    const cegs = e.tipo === 'usina' ? (e.ceg ? [e.ceg] : []) : membrosEm(g.id, d.dia).map((m) => porNucleo.get(nucleo(m.ceg))?.ceg).filter(Boolean);
    for (const c of cegs) (vistos.get(c) || vistos.set(c, []).get(c)).push({ id: g.id, tipo: e.tipo });
  }
  const sobreposicao = { avulsaEMembro: [], emDoisConjuntos: [], cegDividido: [] };
  for (const [c, v] of vistos) {
    if (v.length < 2) continue;
    const t = v.map((x) => x.tipo);
    const reg = { ceg: c, ids: v.map((x) => x.id) };
    if (t.every((x) => x === 'usina')) sobreposicao.cegDividido.push(reg);
    else if (t.every((x) => x === 'conjunto')) sobreposicao.emDoisConjuntos.push(reg);
    else sobreposicao.avulsaEMembro.push(reg);
  }

  // conferência contra o balanço do ONS do mesmo dia
  const it50 = idx.has('PYIT50') && mw[idx.get('PYIT50')] ? mw[idx.get('PYIT50')] : new Array(24).fill(0);
  const porSub = {};
  const pub = Object.fromEntries(SUBS.map((s) => [s, new Array(24).fill(0)]));
  mw.forEach((serie, i) => {
    if (!serie || entOrd[i].id === 'PYIT50') return;
    for (let h = 0; h < 24; h++) pub[SUBS[subDe(i)]][h] += serie[h];
  });
  for (const g of gruposArr) for (let h = 0; h < 24; h++) pub[SUBS[g.sub]][h] += g.mw[h];
  const conf = (p, bl) => {
    const P = soma(p);
    const B = soma(bl);
    let maxH = 0;
    for (let h = 0; h < 24; h++) maxH = Math.max(maxH, Math.abs(p[h] - bl[h]) / bl[h]);
    return { publicadoMWh: r0(P), balancoMWh: r0(B), difPct: Math.round(((P - B) / B) * 1e4) / 100, maxDifHoraPct: Math.round(maxH * 1e4) / 100 };
  };
  for (const s of SUBS) porSub[s] = conf(pub[s], bal[s].ger);
  // a mesma conferência com o subsistema do arquivo do mês, para mostrar por que não é o usado
  const outraAtribuicao = Object.keys(subNoDia).length
    ? (() => {
        const alt = Object.fromEntries(SUBS.map((s) => [s, pub[s].slice()]));
        for (const [k, novo] of Object.entries(subNoDia)) {
          const i = Number(k);
          if (!mw[i]) continue;
          for (let h = 0; h < 24; h++) {
            alt[SUBS[entOrd[i].sub]][h] -= mw[i][h];
            alt[SUBS[novo]][h] += mw[i][h];
          }
        }
        const altPct = Object.fromEntries(SUBS.map((s) => [s, conf(alt[s], bal[s].ger).difPct]));
        const envolvidos = new Set(Object.entries(subNoDia).flatMap(([k, s]) => [SUBS[s], SUBS[entOrd[k].sub]]));
        const piora = [...envolvidos].every((s) => Math.abs(altPct[s]) > Math.abs(porSub[s].difPct));
        return {
          entidades: Object.entries(subNoDia).map(([k, s]) => ({ id: entOrd[k].id, noArquivoDoMes: SUBS[s], usado: SUBS[entOrd[k].sub], mwh: mw[k] ? soma(mw[k]) : null })),
          porSubsistemaSeFosseOArquivoDoMes: altPct,
          leitura: piora
            ? 'O arquivo de geração deste mês dá a estas entidades outro subsistema; o balanço por subsistema do ONS as conta no subsistema usado pelo Atlas: com o do arquivo do mês, a diferença contra o balanço cresce em todos os subsistemas envolvidos.'
            : 'O arquivo de geração deste mês dá a estas entidades outro subsistema; com ele, a diferença contra o balanço NÃO cresce em todos os subsistemas envolvidos: rever a escolha.',
        };
      })()
    : null;
  const pubSin = new Array(24).fill(0).map((_, h) => soma(SUBS.map((s) => pub[s][h])));
  const sin = conf(pubSin, bal.SIN.ger);
  const seCom50 = conf(pub.SE.map((x, h) => x + it50[h]), bal.SE.ger);
  const sinCom50 = conf(pubSin.map((x, h) => x + it50[h]), bal.SIN.ger);
  let nComPonto = 0;
  let mwhComPonto = 0;
  mw.forEach((serie, i) => {
    if (!serie || entOrd[i].id === 'PYIT50' || !temPonto(entOrd[i])) return;
    nComPonto++;
    mwhComPonto += soma(serie);
  });
  const totalBr = soma(pubSin);
  const mwhPrevisao = soma(gruposArr.filter((g) => g.previsao).map((g) => soma(g.mw)));
  const conferencia = {
    nota: 'publicado = soma das entidades (sem Itaipu 50 Hz) mais o bloco semPonto, em MWh do dia, contra a soma hidráulica + térmica + eólica + solar do balanço de energia por subsistema do ONS no mesmo dia; maxDifHoraPct é a maior diferença de uma hora, em % do balanço daquela hora',
    porSubsistema: porSub,
    ...(outraAtribuicao ? { subsistemaDoArquivoDoMes: outraAtribuicao } : {}),
    sin,
    itaipu50: {
      mwh: soma(it50),
      seSomando50Hz: seCom50,
      sinSomando50Hz: sinCom50,
      leitura: Math.abs(seCom50.difPct) < Math.abs(porSub.SE.difPct)
        ? 'O balanço do ONS do Sudeste só fecha com a Itaipu 50 Hz somada: a geração do subsistema no balanço inclui as duas linhas de Itaipu. O Atlas mostra a 50 Hz como entidade própria e não a soma à geração do Brasil.'
        : 'O balanço do ONS do Sudeste fecha melhor SEM a Itaipu 50 Hz.',
    },
    comPonto: { entidades: nComPonto, mwh: mwhComPonto, pct: Math.round((mwhComPonto / totalBr) * 1000) / 10 },
    semPonto: {
      mwh: soma(semPontoMw) + soma(semParMw),
      pct: Math.round(((soma(semPontoMw) + soma(semParMw)) / totalBr) * 1000) / 10,
      previsaoMWh: mwhPrevisao,
      semParMWh: soma(semParMw),
      semPar: semPar.sort((a, b) => b.mwh - a.mwh),
      nota: 'mwh = o bloco semPonto (previsão por estado) mais as entidades sem ponto no mapa (semPar), que estão em `mw` como as demais e não se repetem nos grupos',
    },
    entidadesNoDia: mw.filter(Boolean).length,
    usinaEmDuasEntidades: sobreposicao,
    entidadesSemAs24Horas: horasFaltando,
    entidadesSemValorNoDia: semValor,
    entidadesComHorasSemValor: horasVazias,
    notaSemValor: 'entidadesSemValorNoDia: a fonte lista a entidade no dia com val_geracao VAZIO nas 24 horas (sem valor publicado, o que não é zero medido); no arquivo ela fica null naquele dia. Em geral são usinas Tipo II-B, II-C e III; em 2026-09-30, três PCHs do Mato Grosso do Sul vêm vazias enquanto o conjunto do qual a relação as diz membros traz a energia.',
  };

  saidaDias.push({
    dia: d.dia,
    razao: d.razao,
    rotulo: d.rotulo,
    ...(d.trimestre ? { trimestre: d.trimestre, cargaSinMWh: d.cargaSinMWh } : {}),
    mw,
    ...(Object.keys(subNoDia).length ? { subNoDia } : {}),
    ...(Object.keys(membrosNoDia).length ? { membrosNoDia } : {}),
    carga: Object.fromEntries(SUBS.map((s) => [s, bal[s].carga.map((x) => (x == null ? null : r0(x)))])),
    semPonto: { grupos: gruposArr, mw: semPontoMw },
    corte: {
      entidades: corteCol,
      porHora,
      textoMaisFrequente: maisFrequente(textosDoDia),
      soLimitadasSemPerda: soLimitadas,
      semEntidade,
    },
    conferencia,
  });
}
saidaDias.sort((a, b) => (a.dia < b.dia ? -1 : 1));

// ───────────────────────── arquivo ─────────────────────────
const ac = (n) => CONSULTAS[n].acesso.slice(0, 10);
const brutoUsado = Object.keys(CONSULTAS).filter((n) => {
  const m = n.match(/(\d{4}-\d{2})\.csv$/);
  if (m) return saidaDias.some((d) => d.dia.startsWith(m[1]));
  const a = n.match(/ons-balanco-(\d{4})\.csv$/);
  if (a) return saidaDias.some((d) => d.dia.startsWith(a[1])) || n === arqBalanco(Number(HOJE.slice(0, 4))) || n === arqBalanco(Number(HOJE.slice(0, 4)) - 1);
  return true;
});
const LIC = 'Creative Commons Atribuição (CC-BY), declarada no portal (sem número de versão)';
const fontes = [
  { orgao: 'ONS', conjunto: 'Geração por usina em base horária (geracao-usina-2)', pagina: 'https://dados.ons.org.br/dataset/geracao-usina-2', endereco: urlGeracao('AAAA-MM'), licenca: LIC, acesso: ac(arqGeracao(saidaDias.at(-1).dia.slice(0, 7))) },
  { orgao: 'ONS', conjunto: 'Restrição de operação por constrained-off de usinas eólicas (restricao_coff_eolica_usi)', pagina: 'https://dados.ons.org.br/dataset/restricao_coff_eolica_usi', endereco: urlEolica('AAAA-MM'), licenca: LIC, acesso: ac(arqEolica(saidaDias.at(-1).dia.slice(0, 7))) },
  { orgao: 'ONS', conjunto: 'Restrição de operação por constrained-off de usinas fotovoltaicas (restricao_coff_fotovoltaica)', pagina: 'https://dados.ons.org.br/dataset/restricao_coff_fotovoltaica', endereco: urlSolar('AAAA-MM'), licenca: LIC, acesso: ac(arqSolar(saidaDias.at(-1).dia.slice(0, 7))) },
  { orgao: 'ONS', conjunto: 'Balanço de energia nos subsistemas (carga e conferência)', pagina: 'https://dados.ons.org.br/dataset/balanco-energia-subsistema', endereco: urlBalanco('AAAA'), licenca: LIC, acesso: ac(arqBalanco(Number(HOJE.slice(0, 4)))) },
  { orgao: 'ONS', conjunto: 'Relacionamento entre conjuntos e usinas (membros de cada conjunto)', pagina: 'https://dados.ons.org.br/dataset/usina_conjunto', endereco: 'https://ons-aws-prod-opendata.s3.amazonaws.com/dataset/usina_conjunto/RELACIONAMENTO_USINA_CONJUNTO.csv', licenca: LIC, acesso: ac('ons-relacionamento-usina-conjunto.csv') },
  { orgao: 'ANEEL', conjunto: `SIGA, pelo ponto já publicado no Atlas (usinas-principais.json e usinas-menores.json, data-base ${DATA_BASE_USINAS})`, pagina: 'https://dadosabertos.aneel.gov.br/dataset/siga-sistema-de-informacoes-de-geracao-da-aneel', endereco: 'public/alexandria/atlas/dados/usinas-*.json', licenca: 'ver a seção das usinas na procedência', acesso: DATA_BASE_USINAS },
];
const dic = JSON.parse(readFileSync(join(BRUTO, 'ons-dicionario-corte-eolica.json'), 'utf8')).dicionario_simplificado;
const descr = (c) => dic.find((x) => x.codigo === c).descricao;
// a frase do portal sobre os grupos de pequenas usinas (metadados CKAN do conjunto, campo notes)
const notasDoPacote = JSON.parse(readFileSync(join(BRUTO, 'ons-pacote-geracao-usina-2.json'), 'utf8')).result.notes;
const notaDoPortal = (notasDoPacote.match(/Os grupos de pequenas usinas[^.]*./) || [])[0];
if (!notaDoPortal) throw new Error('o pacote geracao-usina-2 não traz mais a frase sobre os grupos de pequenas usinas; reler o portal');
const ultimoDia = saidaDias.find((d) => d.rotulo === 'último dia publicado');

const saida = {
  versao: 1,
  geradoEm: new Date().toISOString().slice(0, 10),
  unidade: 'MW médios na hora, inteiros (o mesmo número é a energia da hora em MWh)',
  horario: 'hora 0 é a linha 00:00 do ONS (din_instante); o dicionário do ONS não declara o fuso. O corte vem em meias-horas: a hora publicada é a média das duas.',
  regraDosDias: 'Para cada um dos quatro últimos trimestres fechados antes do acesso, o dia de maior carga do SIN: a maior soma das 24 horas de val_carga da linha SIN no balanço de energia por subsistema do ONS, contando só dia com as 24 horas de carga maior que zero. Mais o último dia completo publicado: o mais recente que está inteiro nas quatro bases (geração por usina, 24 horas; corte eólico e corte fotovoltaico, 48 meias-horas; balanço, 24 horas).',
  categorias: CATEGORIAS,
  subsistemas: SUBS,
  motivos: {
    REL: 'indisponibilidade externa (elétrica)',
    CNF: 'atendimento a requisitos de confiabilidade',
    ENE: 'razão energética',
    PAR: 'restrição indicada no parecer de acesso',
  },
  letrasDoMotivo: { R: 'REL', C: 'CNF', E: 'ENE', P: 'PAR', '-': null },
  origens: { LOC: 'local', SIS: 'sistêmica' },
  definicoes: {
    naoRealizadaEstimada: `Geração não realizada apurada (GNRa), em MW médios na hora. Texto do ONS: "${descr('val_geracaonaorealizadaapurada')}" É estimativa do ONS, não medição.`,
    motivo: `Uma letra por hora (R, C, E, P; "-" sem restrição): o motivo da meia-hora de maior GNRa naquela hora. Texto do ONS: "${descr('cod_razaorestricao')}"`,
    texto: `O detalhamento mais frequente entre as meias-horas com restrição (dsc_restricao). Texto do ONS: "${descr('dsc_restricao')}"`,
    conjunto: 'Conjunto de usinas do ONS: a geração vem somada, sem CEG. O ponto é a média das posições dos membros que o Atlas desenha; a geração NÃO é repartida entre os membros.',
    semPonto: `mmgd: "Pequenas Usinas (MMGD)" por estado; tipo3: "Pequenas Usinas (Tipo III)" por estado; os dois são PREVISÃO do ONS, não geração verificada. Texto do portal: "${notaDoPortal}"` + ' A usina ou o conjunto do ONS sem usina correspondente no Atlas (geração verificada, sem ponto) fica em `mw` como as demais entidades, com lon/lat nulos, e só é listado em conferencia.semPonto.semPar (não entra nos grupos, para não somar duas vezes).',
  },
  modalidades: MODALIDADES,
  textos: TEXTOS,
  entidades: {
    n: entOrd.length,
    mod: entOrd.map((e) => indiceDaModalidade(e.mod)),
    ...Object.fromEntries(['id', 'nome', 'tipo', 'cat', 'sub', 'uf', 'ceg', 'lon', 'lat', 'membros', 'membrosSemPonto', 'kw', 'obs'].map((k) => [k, entOrd.map((e) => e[k])])),
    cegEmLinhas: entOrd.map((e) => e.cegEmLinhas ?? null),
  },
  dias: saidaDias,
  fontes,
  leia: [
    'Geração verificada por usina, hora a hora, do ONS. A usina que o ONS despacha em conjunto aparece como o conjunto, no centro das usinas dele; a geração não é repartida entre elas.',
    'Itaipu aparece duas vezes: o setor brasileiro (60 Hz) e o paraguaio (50 Hz). A de 50 Hz não entra na geração do Brasil.',
    `Pequenas usinas e geração distribuída entram somadas por estado, sem ponto no mapa, e são previsão do ONS, não medição.`,
    'O corte (constrained-off) só existe para eólicas e solares Tipo I, II-B e II-C. A geração não realizada é estimativa do ONS.',
    'O ONS revisa os dados depois de publicados; vale o arquivo da data do acesso.',
    ...(ultimoDia ? [`O último dia é ${ultimoDia.dia}: o mais recente inteiro nas quatro bases no dia do acesso.`] : []),
  ],
  notas: {
    mudancasDeMembrosEntreDias: mudancasDeMembros,
    membrosDaEntidade: 'Em `entidades`, os membros de um conjunto (e a potência somada deles, kw) são os da relação do ONS vigentes no dia mais novo publicado em que o conjunto aparece. Num dia em que a composição era outra, `dias[].membrosNoDia` traz os membros, os sem ponto e o kw daquele dia (pela data de início e de fim da relação). O ponto do conjunto é sempre a média dos membros do dia mais novo.',
    subsistema: 'Em `entidades`, sub é o subsistema que o ONS dá no dia mais novo em que a entidade aparece; é também o da relação usina–conjunto e o que o balanço por subsistema do ONS usa em todos os dias publicados. Num dia em que o arquivo de geração do mês dá outro, `dias[].subNoDia` traz o do arquivo do mês (índice da entidade → índice em `subsistemas`), só para dizer; a conferência usa `entidades.sub` e grava em conferencia.subsistemaDoArquivoDoMes como ficaria com o outro.',
    cegEmLinhas: 'Usina da ANEEL que o ONS publica em mais de uma linha (Belo Monte e Pimental, Itaipu 60 e 50 Hz…): cegEmLinhas lista as outras linhas, e kw é a potência do CEG inteiro, não a da linha.',
  },
  bruto: Object.fromEntries(brutoUsado.map((n) => [n, { url: CONSULTAS[n].url, acesso: CONSULTAS[n].acesso, bytes: CONSULTAS[n].bytes, sha256: CONSULTAS[n].sha256 }])),
};

const texto = JSON.stringify(saida);
writeFileSync(SAIDA, texto);
console.log(`\n${SAIDA}\n${texto.length} B (${entOrd.length} entidades, ${saidaDias.length} dias)`);
for (const d of saidaDias) {
  const c = d.conferencia;
  console.log(`${d.dia}  SIN ${c.sin.difPct}% (máx. hora ${c.sin.maxDifHoraPct}%) | ${SUBS.map((s) => `${s} ${c.porSubsistema[s].difPct}%`).join(' ')} | com ponto ${c.comPonto.entidades} ent. ${c.comPonto.pct}% | sem ponto ${c.semPonto.pct}% | corte ${d.corte.entidades.n} ent. | Itaipu50 ${c.itaipu50.mwh} MWh, SE com 50 Hz ${c.itaipu50.seSomando50Hz.difPct}%`);
}

// ───────────────────────── manifesto (só as entradas operacao-*) ─────────────────────────
if (!ARGS.includes('--sem-manifesto')) {
  const man = JSON.parse(readFileSync(MANIFESTO, 'utf8'));
  for (const k of Object.keys(man)) if (k.startsWith('operacao-')) delete man[k];
  const rot = (n) => {
    if (n.startsWith('ons-balanco-')) return 'Balanço de energia nos subsistemas, horário, ano ' + n.slice(12, 16);
    if (n.startsWith('ons-geracao-usina-')) return 'Geração por usina em base horária, mês ' + n.slice(18, 25);
    if (n.startsWith('ons-corte-eolica-')) return 'Constrained-off de usinas eólicas, semi-horário, mês ' + n.slice(17, 24);
    if (n.startsWith('ons-corte-fotovoltaica-')) return 'Constrained-off de usinas fotovoltaicas, semi-horário, mês ' + n.slice(23, 30);
    if (n.startsWith('ons-dicionario-')) return 'Dicionário de dados (' + n.slice(15, -5) + ')';
    if (n.startsWith('ons-pacote-')) return 'Metadados CKAN (package_show) de ' + n.slice(11, -5);
    if (n === 'ons-relacionamento-usina-conjunto.csv') return 'Relacionamento entre conjuntos e usinas';
    return n;
  };
  for (const n of brutoUsado) {
    man[`operacao-${n.replace(/\.(csv|json)$/, '')}`] = {
      orgao: 'ONS',
      conjunto: rot(n),
      url: CONSULTAS[n].url,
      pagina: 'https://dados.ons.org.br/',
      licenca: LIC,
      arquivo: `tools/alexandria-atlas/bruto/operacao/${n}`,
      bytes: CONSULTAS[n].bytes,
      sha256: CONSULTAS[n].sha256,
      acesso: CONSULTAS[n].acesso,
      ...(CONSULTAS[n].ultimaModificacaoNaFonte ? { nota: `Last-Modified da fonte: ${CONSULTAS[n].ultimaModificacaoNaFonte}` } : {}),
    };
  }
  writeFileSync(MANIFESTO, JSON.stringify(man, null, 2) + '\n');
  console.log(`manifesto: ${brutoUsado.length} entradas operacao-*`);
}
