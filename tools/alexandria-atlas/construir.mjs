// Transforma o bruto das fontes oficiais (tools/alexandria-atlas/bruto/, ver
// baixar.mjs) nos arquivos que o Atlas carrega, em public/alexandria/atlas/dados/.
//
//   node tools/alexandria-atlas/construir.mjs
//
// Regras deste script:
//   · nada é inventado, interpolado ou "completado": campo ausente na fonte
//     vira null e o mapa declara a ausência;
//   · toda contagem que a interface mostra sai de indice.json, gerado aqui;
//   · a geometria é a da fonte: só se arredonda coordenada (4 casas ≈ 11 m) e,
//     nas bacias, se simplifica o contorno (tolerância declarada no índice).

import { createHash } from 'node:crypto';
import { inflateRawSync } from 'node:zlib';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const AQUI = dirname(fileURLToPath(import.meta.url));
const BRUTO = join(AQUI, 'bruto');
const SAIDA = join(AQUI, '..', '..', 'public', 'alexandria', 'atlas', 'dados');
const manifesto = JSON.parse(await readFile(join(AQUI, 'manifesto-fontes.json'), 'utf8'));

// ── utilitários ──────────────────────────────────────────────────────

const lerTexto = async (rel) => {
  let t = await readFile(join(BRUTO, rel), 'utf8');
  if (t.charCodeAt(0) === 0xfeff) t = t.slice(1);
  return t;
};

/** CSV com aspas opcionais. */
function linhaCsv(l, sep) {
  if (!l.includes('"')) return l.split(sep);
  const o = [];
  let c = '';
  let q = false;
  for (let i = 0; i < l.length; i++) {
    const ch = l[i];
    if (q) {
      if (ch === '"') {
        if (l[i + 1] === '"') {
          c += '"';
          i++;
        } else q = false;
      } else c += ch;
    } else if (ch === '"') q = true;
    else if (ch === sep) {
      o.push(c);
      c = '';
    } else c += ch;
  }
  o.push(c);
  return o;
}

async function csv(rel, sep = ';') {
  const linhas = (await lerTexto(rel)).split(/\r?\n/).filter(Boolean);
  const cab = linhaCsv(linhas[0], sep).map((s) => s.trim());
  return linhas.slice(1).map((l) => {
    const c = linhaCsv(l, sep);
    const o = {};
    for (let i = 0; i < cab.length; i++) o[cab[i]] = (c[i] ?? '').trim();
    return o;
  });
}

const geojson = async (rel) => JSON.parse(await lerTexto(rel)).features;
const r4 = (n) => Math.round(n * 1e4) / 1e4;
const limpo = (s) => (s == null ? null : String(s).replace(/\s+/g, ' ').trim() || null);
const ano = (ms) => (ms == null ? null : new Date(ms).getUTCFullYear());
const num = (s) => {
  if (s == null || s === '') return null;
  const n = parseFloat(String(s).replace(',', '.'));
  return Number.isFinite(n) ? n : null;
};
const dia = (iso) => iso.slice(0, 10);
/** Casas decimais SIGNIFICATIVAS de uma coordenada como a fonte bruta a traz (texto do
 *  CSV ou número do GeoJSON), antes do arredondamento a 4 casas: o zero final não conta
 *  (a fonte escreve com casas fixas) e o resíduo de ponto flutuante abaixo da 10ª casa
 *  some. 0 a 4; 4 quer dizer "4 ou mais". O erro da posição é meia unidade da última casa. */
const casasSignificativas = (v) => {
  const n = typeof v === 'number' ? v : num(v);
  if (n == null) return 0;
  const t = Math.abs(n).toFixed(10).replace(/0+$/, '');
  const i = t.indexOf('.');
  return Math.min(4, i < 0 ? 0 : t.length - i - 1);
};
/** precisão do par: a pior das duas coordenadas */
const precisao = (lon, lat) => Math.min(casasSignificativas(lon), casasSignificativas(lat));
const fonteDe = (id) => {
  const m = manifesto[id];
  if (!m) throw new Error(`fonte ${id} fora do manifesto: rode baixar.mjs`);
  return { orgao: m.orgao, conjunto: m.conjunto, pagina: m.pagina, licenca: m.licenca, acesso: dia(m.acesso), sha256: m.sha256, ...(m.nota ? { nota: m.nota } : {}) };
};

const gravados = {};
async function gravar(nome, objeto) {
  const corpo = JSON.stringify(objeto);
  await mkdir(SAIDA, { recursive: true });
  await writeFile(join(SAIDA, nome), corpo);
  gravados[nome] = { bytes: Buffer.byteLength(corpo), sha256: createHash('sha256').update(corpo).digest('hex').slice(0, 16) };
  console.log(`${nome.padEnd(34)} ${(Buffer.byteLength(corpo) / 1024).toFixed(0).padStart(6)} KB`);
}

/** Nome de instalação do SINDAT: "SUB CABECO PRETO II      RN" → nome e UF. */
function nomeInstalacao(bruto, prefixo) {
  const s = limpo(bruto);
  if (!s) return { nome: null, uf: null };
  const m = s.match(/^(.*?)\s+([A-Z]{2}(?:\/[A-Z]{2})?)$/);
  let nome = m ? m[1] : s;
  if (prefixo && nome.startsWith(prefixo + ' ')) nome = nome.slice(prefixo.length + 1);
  return { nome: limpo(nome), uf: m ? m[2] : null };
}

// ── datas-sentinela do SINDAT ────────────────────────────────────────
// Nos ativos antigos, o SINDAT traz no campo de entrada em operação a data em que
// o cadastro foi carregado: centenas de instalações com exatamente o mesmo dia
// (medido em 15/11/2026: 31/12/1990 em 435 e 02/06/2000 em 295; o terceiro dia
// mais repetido aparece 11 vezes). Dia repetido em 50 ou mais instalações das
// camadas de linhas e subestações é lido como data de carga: o ativo está em
// operação (a fonte registra entrada), mas o ano não é o de entrada. Publica-se
// op = null e opAntesDe = ano da carga. Previsão em 2090 ou depois (2099, 9999)
// é marcador de "sem previsão" e vira null.
const LIMIAR_DATA_DE_CARGA = 50;
const ANO_SENTINELA_PREVISAO = 2090;
const diaUtc = (ms) => new Date(ms).toISOString().slice(0, 10);
const DATAS_DE_CARGA = await (async () => {
  const cont = new Map();
  for (const rel of ['sindat/linhas.geojson', 'sindat/linhas-cc.geojson', 'sindat/subestacoes.geojson'])
    for (const f of await geojson(rel)) {
      const d = f.properties.DTENTRADA;
      if (d != null) cont.set(diaUtc(d), (cont.get(diaUtc(d)) || 0) + 1);
    }
  return new Set([...cont].filter(([, n]) => n >= LIMIAR_DATA_DE_CARGA).map(([k]) => k));
})();
/** Entrada em operação: ano real (op) ou ano da carga do cadastro (opAntesDe). */
const entrada = (ms) => {
  if (ms == null) return { op: null, opAntesDe: null };
  return DATAS_DE_CARGA.has(diaUtc(ms)) ? { op: null, opAntesDe: ano(ms) } : { op: ano(ms), opAntesDe: null };
};
const previsaoSentinela = (ms) => ms != null && ano(ms) >= ANO_SENTINELA_PREVISAO;
const previsao = (ms) => (previsaoSentinela(ms) ? null : ano(ms));

// ── 1. linhas de transmissão (ONS · SINDAT) ──────────────────────────

const SUB_ONS = { N: 'N', NE: 'NE', S: 'S', SE: 'SE' };

async function construirLinhas() {
  const ca = await geojson('sindat/linhas.geojson');
  const cc = await geojson('sindat/linhas-cc.geojson');
  const feicoes = [];
  const comPrevisaoSentinela = new Set();
  const empurra = (f, continua) => {
    const p = f.properties;
    const { nome, uf } = nomeInstalacao(p.NOMELONGO, null);
    const kv = p.VN ?? null;
    const ext = continua ? p.VAL_EXTENSAO : p.EXT;
    const emOperacao = p.DTENTRADA != null;
    if (!emOperacao && previsaoSentinela(p.DTPREVISTA)) comPrevisaoSentinela.add(limpo(p.EQP_ID));
    const coords =
      f.geometry.type === 'LineString'
        ? f.geometry.coordinates.map(([x, y]) => [r4(x), r4(y)])
        : f.geometry.coordinates.map((l) => l.map(([x, y]) => [r4(x), r4(y)]));
    feicoes.push({
      type: 'Feature',
      id: feicoes.length + 1,
      geometry: { type: f.geometry.type, coordinates: coords },
      properties: {
        id: limpo(p.EQP_ID),
        n: nome,
        uf,
        kv,
        cc: continua ? 1 : 0,
        km: ext ?? null,
        ag: limpo(p.AGE_NOME),
        rede: limpo(p.NOMEREDE),
        // em operação = op != null OU opAntesDe != null (ver datas-sentinela)
        ...entrada(p.DTENTRADA),
        prev: emOperacao ? null : previsao(p.DTPREVISTA),
        // capacidade operativa de longa duração: A nas linhas CA, MW declarado nas CC
        cap: continua ? (p.VAL_CPST ?? null) : (p.VAL_CAPACOPERLD ?? null),
      },
    });
  };
  for (const f of ca) if (f.geometry) empurra(f, false);
  for (const f of cc) if (f.geometry) empurra(f, true);
  await gravar('rede-linhas.geojson', { type: 'FeatureCollection', features: feicoes });
  // o ONS entrega algumas linhas em mais de um trecho, com o mesmo identificador:
  // a contagem de LINHAS é por identificador; a de trechos, por feição
  const ids = (cont) => new Set(feicoes.filter((x) => x.properties.cc === cont).map((x) => x.properties.id));
  const emOp = (x) => x.properties.op != null || x.properties.opAntesDe != null;
  const idsPrevistas = new Set(feicoes.filter((x) => !emOp(x)).map((x) => x.properties.id));
  // comprimento por linha: o campo da fonte é da linha inteira e se repete em cada trecho
  const kmPorId = new Map();
  for (const x of feicoes) if (emOp(x)) kmPorId.set(x.properties.id, x.properties.km || 0);
  const km = [...kmPorId.values()].reduce((a, v) => a + v, 0);
  // classe de tensão por linha (identificador), não por trecho
  const tensaoPorId = new Map();
  for (const x of feicoes) tensaoPorId.set(x.properties.id, { chave: x.properties.cc ? `CC ${x.properties.kv}` : String(x.properties.kv), op: emOp(x) });
  const porTensao = {};
  const porTensaoEmOperacao = {};
  for (const { chave, op } of tensaoPorId.values()) {
    porTensao[chave] = (porTensao[chave] || 0) + 1;
    if (op) porTensaoEmOperacao[chave] = (porTensaoEmOperacao[chave] || 0) + 1;
  }
  const anoCorrente = new Date().getUTCFullYear();
  const previsaoVencida = new Set(feicoes.filter((x) => !emOp(x) && x.properties.prev != null && x.properties.prev < anoCorrente).map((x) => x.properties.id)).size;
  const comDataDeCarga = new Set(feicoes.filter((x) => x.properties.opAntesDe != null).map((x) => x.properties.id)).size;
  return {
    total: ids(0).size + ids(1).size,
    trechos: feicoes.length,
    alternada: ids(0).size,
    continua: ids(1).size,
    previstas: idsPrevistas.size,
    previstasComPrevisaoVencida: previsaoVencida,
    previstasComPrevisaoSentinela: comPrevisaoSentinela.size,
    emOperacaoComDataDeCarga: comDataDeCarga,
    datasDeCargaDoCadastro: [...DATAS_DE_CARGA].sort(),
    kmEmOperacao: Math.round(km),
    porTensao,
    porTensaoEmOperacao,
    fontes: [fonteDe('sindat-linhas'), fonteDe('sindat-linhas-cc')],
    nota: 'Traçado do próprio ONS (SINDAT), generalizado na origem: média de 14 vértices por linha. Linha sem data de entrada em operação no cadastro é desenhada como prevista, mesmo quando a previsão registrada já passou. Linha cuja data de entrada é a data de carga do cadastro (dia repetido em centenas de instalações) está em operação, mas o ano de entrada não é conhecido: publica-se op = null e opAntesDe = ano da carga.',
  };
}

// ── 2. subestações (ONS · SINDAT + Dados Abertos) ────────────────────

async function construirSubestacoes() {
  const mapa = await geojson('sindat/subestacoes.geojson');
  const cad = await csv('ons/SUBESTACAO.csv');
  // cadastro: uma linha por nível de tensão; fica o maior nível e a posição
  const porId = new Map();
  for (const r of cad) {
    const kv = num(r.val_niveltensao);
    const a = porId.get(r.id_subestacao);
    const lat = num(r.val_latitude);
    const lon = num(r.val_longitude);
    if (!a) porId.set(r.id_subestacao, { ...r, kv, lat, lon, niveis: new Set(kv ? [kv] : []) });
    else {
      if (kv) a.niveis.add(kv);
      if (kv && (!a.kv || kv > a.kv)) a.kv = kv;
    }
  }
  const SUB = { Norte: 'N', Nordeste: 'NE', Sul: 'S', 'Sudeste/Centro-Oeste': 'SE' };
  const feicoes = [];
  const vistos = new Set();
  let semNome = 0;
  let previstas = 0;
  let emOperacao = 0;
  let comDataDeCarga = 0;
  let comPrevisaoSentinela = 0;
  let divergentes = 0;
  // o SINDAT devolve algumas instalações em mais de um ponto, com o mesmo INS_ID:
  // fica o primeiro (medido: mesma coordenada, ou a ~140 m) e a repetição é contada
  const repetidas = [];
  const incoerentes = [];
  const conferir = (id, nome, ufTexto, lon, lat) => {
    const caiEm = submercadoIncoerente(lon, lat, (ufTexto || '').split('/'));
    if (caiEm) incoerentes.push({ id, nome, uf: ufTexto, lon: r4(lon), lat: r4(lat), caiEm });
    return caiEm ? 1 : 0;
  };
  for (const f of mapa) {
    const p = f.properties;
    const id = limpo(p.INS_ID);
    if (!id || !p.NOMELONGO) {
      semNome++;
      continue; // ponto sem nome nem identificador na fonte: não entra
    }
    if (vistos.has(id)) {
      repetidas.push(id);
      continue;
    }
    const { nome, uf } = nomeInstalacao(p.NOMELONGO, 'SUB');
    const c = porId.get(id);
    vistos.add(id);
    if (c && c.lat && c.lon && Math.hypot(f.geometry.coordinates[0] - c.lon, f.geometry.coordinates[1] - c.lat) > 0.05) divergentes++;
    if (p.DTENTRADA == null) previstas++;
    else emOperacao++;
    const ent = entrada(p.DTENTRADA);
    if (ent.opAntesDe != null) comDataDeCarga++;
    if (p.DTENTRADA == null && previsaoSentinela(p.DTPREVISTA)) comPrevisaoSentinela++;
    feicoes.push({
      type: 'Feature',
      id: feicoes.length + 1,
      geometry: { type: 'Point', coordinates: [r4(f.geometry.coordinates[0]), r4(f.geometry.coordinates[1])] },
      properties: {
        id,
        n: nome,
        uf,
        kv: c?.kv ?? null,
        niveis: c ? [...c.niveis].sort((a, b) => b - a).join('/') : null,
        sub: c ? (SUB[c.nom_subsistema] ?? null) : null,
        ag: limpo(p.AGE_PRIN_NOM),
        // em operação = op != null OU opAntesDe != null (ver datas-sentinela)
        ...ent,
        prev: p.DTENTRADA == null ? previsao(p.DTPREVISTA) : null,
        base: 'SINDAT',
        susp: conferir(id, nome, uf, f.geometry.coordinates[0], f.geometry.coordinates[1]),
        // casas decimais significativas da posição na fonte (0 a 4; 4 = 4 ou mais)
        prec: precisao(f.geometry.coordinates[0], f.geometry.coordinates[1]),
      },
    });
  }
  let soCadastro = 0;
  let semCoordenada = 0;
  for (const [id, c] of porId) {
    if (vistos.has(id)) continue;
    if (!c.lat || !c.lon) {
      semCoordenada++;
      continue;
    }
    soCadastro++;
    feicoes.push({
      type: 'Feature',
      id: feicoes.length + 1,
      geometry: { type: 'Point', coordinates: [r4(c.lon), r4(c.lat)] },
      properties: {
        id,
        n: limpo(c.nom_subestacao),
        uf: c.id_estado || null,
        kv: c.kv ?? null,
        niveis: [...c.niveis].sort((a, b) => b - a).join('/') || null,
        sub: SUB[c.nom_subsistema] ?? null,
        ag: limpo(c.nom_agente_principal),
        op: null,
        opAntesDe: null,
        prev: null,
        base: 'Dados Abertos',
        susp: conferir(id, limpo(c.nom_subestacao), c.id_estado || null, c.lon, c.lat),
        prec: precisao(c.val_longitude, c.val_latitude),
      },
    });
  }
  await gravar('rede-subestacoes.geojson', { type: 'FeatureCollection', features: feicoes });
  return {
    total: feicoes.length,
    doMapaSindat: feicoes.length - soCadastro,
    soNoCadastro: soCadastro,
    comTensao: feicoes.filter((f) => f.properties.kv != null).length,
    previstas,
    emOperacao,
    emOperacaoComDataDeCarga: comDataDeCarga,
    previstasComPrevisaoSentinela: comPrevisaoSentinela,
    repetidasNaFonte: repetidas.length,
    idsRepetidosNaFonte: [...new Set(repetidas)],
    foraPorFaltaDeNome: semNome,
    foraPorFaltaDeCoordenada: semCoordenada,
    posicaoDivergenteEntreAsDuasBases: divergentes,
    posicaoIncoerenteComOEstado: incoerentes.length,
    exemplosDePosicaoIncoerente: incoerentes,
    precisaoPorCasas: [0, 1, 2, 3, 4].reduce((o, k) => ((o[k] = feicoes.filter((f) => f.properties.prec === k).length), o), {}),
    fontes: [fonteDe('sindat-subestacoes'), fonteDe('ons-subestacao')],
    nota: 'Posição do SINDAT; tensão e subsistema vêm do cadastro de Dados Abertos quando o identificador casa. Subestação sem tensão no cadastro aparece com "tensão não informada". Subestação que só existe no cadastro de Dados Abertos não tem situação (operação ou previsão) na fonte.',
  };
}

// ── 3. usinas (ANEEL · SIGA, com vínculo ao ONS pelo CEG) ────────────

const CATEGORIAS = ['hidro', 'eolica', 'solar', 'nuclear', 'biomassa', 'gas', 'carvao', 'oleo', 'outros'];

function categoria(r) {
  const o = r.DscOrigemCombustivel;
  if (o === 'Hídrica') return 'hidro';
  if (o === 'Eólica') return 'eolica';
  if (o === 'Solar') return 'solar';
  if (o === 'Nuclear') return 'nuclear';
  if (o === 'Biomassa') return 'biomassa';
  if (o === 'Fóssil') {
    if (r.DscFonteCombustivel === 'Gás natural') return 'gas';
    if (r.DscFonteCombustivel === 'Carvão mineral') return 'carvao';
    if (r.DscFonteCombustivel === 'Petróleo') return 'oleo';
    return 'outros';
  }
  return 'outros';
}

const FASES = ['Operação', 'Construção', 'Construção não iniciada'];

/** Código do IBGE de cada UF: é como o arquivo de submercados lista os estados. */
const IBGE_DA_UF = { RO: '11', AC: '12', AM: '13', RR: '14', PA: '15', AP: '16', TO: '17', MA: '21', PI: '22', CE: '23', RN: '24', PB: '25', PE: '26', AL: '27', SE: '28', BA: '29', MG: '31', ES: '32', RJ: '33', SP: '35', PR: '41', SC: '42', RS: '43', MS: '50', MT: '51', GO: '52', DF: '53' };

function dentroDoAnel(x, y, anel) {
  let dentro = false;
  for (let i = 0, j = anel.length - 1; i < anel.length; j = i++) {
    const [xi, yi] = anel[i];
    const [xj, yj] = anel[j];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) dentro = !dentro;
  }
  return dentro;
}

/** Menor distância (em graus) do ponto à borda do polígono. */
function distanciaAteABorda(x, y, g) {
  const poligonos = g.type === 'Polygon' ? [g.coordinates] : g.coordinates;
  let menor = Infinity;
  for (const p of poligonos)
    for (const anel of p)
      for (let i = 1; i < anel.length; i++) {
        const [ax, ay] = anel[i - 1];
        const [bx, by] = anel[i];
        const dx = bx - ax;
        const dy = by - ay;
        const k = Math.max(0, Math.min(1, ((x - ax) * dx + (y - ay) * dy) / (dx * dx + dy * dy || 1e-12)));
        const d = Math.hypot(x - (ax + k * dx), y - (ay + k * dy));
        if (d < menor) menor = d;
      }
  return menor;
}

function dentroDaGeometria(x, y, g) {
  const poligonos = g.type === 'Polygon' ? [g.coordinates] : g.coordinates;
  for (const p of poligonos) {
    if (!dentroDoAnel(x, y, p[0])) continue;
    if (p.slice(1).some((furo) => dentroDoAnel(x, y, furo))) continue;
    return true;
  }
  return false;
}

// ── 0. submercados do Atlas: os do Portal BR, com Roraima no Norte ───
// O Portal BR (public/br/, só leitura) publica os quatro submercados dissolvidos da malha
// por UF do IBGE, com Roraima fora de todos. No cadastro do ONS as instalações de Roraima
// estão no subsistema N desde a interligação (LT 500 kV Boa Vista – Equador – Lechuga). O
// Atlas monta o PRÓPRIO arquivo: no anel principal do Norte, a divisa de RR com PA e AM
// (entre os dois tríplices que os dois arquivos do IBGE compartilham) é trocada pelo trecho
// do contorno do país entre os mesmos dois pontos (a fronteira internacional de RR). Nenhum
// vértice novo; os dois arquivos de public/br/ não são alterados.
const PUBLIC_BR = join(AQUI, '..', '..', 'public', 'br');
/** tríplices pelo texto da coordenada (4 casas), iguais nos dois arquivos */
const TRIPLICE_PA_RR_GUIANA = '-58.8955,1.2277';
const TRIPLICE_AM_RR_VENEZUELA = '-63.3721,2.2119';
/** ganho de área aceito: a menos de 1% da área oficial de RR (IBGE, AREA_KM2 da malha 2024) */
const TOLERANCIA_AREA_RR = 0.01;

/** Área de um anel lon/lat na esfera (km²), a mesma conta do batedor (soma trapezoidal). */
function areaDoAnelKm2(r) {
  const R = 6371.0088;
  const g = Math.PI / 180;
  let s = 0;
  for (let i = 0; i < r.length - 1; i++) {
    const [x1, y1] = r[i];
    const [x2, y2] = r[i + 1];
    s += (x2 - x1) * g * (2 + Math.sin(y1 * g) + Math.sin(y2 * g));
  }
  return Math.abs((s * R * R) / 2);
}

/** Segmentos que se cruzam no anel (contagem ingênua O(n²); só cruzamento próprio). */
function autointersecoes(anel) {
  const o = (p, q, r) => Math.sign((q[0] - p[0]) * (r[1] - p[1]) - (q[1] - p[1]) * (r[0] - p[0]));
  const cruza = (a, b, c, d) => o(a, b, c) * o(a, b, d) < 0 && o(c, d, a) * o(c, d, b) < 0;
  let n = 0;
  for (let i = 0; i < anel.length - 1; i++)
    for (let j = i + 2; j < anel.length - 1; j++) {
      if (i === 0 && j === anel.length - 2) continue;
      if (cruza(anel[i], anel[i + 1], anel[j], anel[j + 1])) n++;
    }
  return n;
}

/** Lê os registros de um DBF (só texto; o suficiente para AREA_KM2). */
function lerDbf(dbf, decodificador = 'latin1') {
  const nReg = dbf.readUInt32LE(4);
  const tamCab = dbf.readUInt16LE(8);
  const tamReg = dbf.readUInt16LE(10);
  const campos = [];
  for (let p = 32; dbf[p] !== 0x0d; p += 32) campos.push({ nome: dbf.toString('ascii', p, p + 11).replace(/\0.*$/, ''), tam: dbf[p + 16] });
  const dec = new TextDecoder(decodificador);
  const regs = [];
  for (let i = 0; i < nReg; i++) {
    let p = tamCab + i * tamReg + 1;
    const o = {};
    for (const c of campos) {
      o[c.nome] = dec.decode(dbf.subarray(p, p + c.tam)).trim();
      p += c.tam;
    }
    regs.push(o);
  }
  return regs;
}

async function montarSubmercados() {
  const textoSub = await readFile(join(PUBLIC_BR, 'submercados.geojson'), 'utf8');
  const textoContorno = await readFile(join(PUBLIC_BR, 'brasil-outline.geojson'), 'utf8');
  const sub = JSON.parse(textoSub);
  const contorno = JSON.parse(textoContorno);
  const k = (p) => `${p[0].toFixed(4)},${p[1].toFixed(4)}`;
  const norte = sub.features.find((f) => f.properties.id === 'norte');
  if (!norte || norte.geometry.type !== 'MultiPolygon') throw new Error('submercados.geojson: Norte ausente ou não é MultiPolygon; decidir antes de publicar');
  if (norte.properties.ufsIbge.includes('14')) throw new Error('submercados.geojson do Portal BR já traz Roraima (14) no Norte: a troca deste script ficou obsoleta; decidir antes de publicar');
  // o anel principal do Norte e o maior anel do contorno do país
  const iPol = norte.geometry.coordinates.reduce((m, p, i, a) => (p[0].length > a[m][0].length ? i : m), 0);
  const anel = norte.geometry.coordinates[iPol][0];
  const anelPais = contorno.features[0].geometry.coordinates.map((p) => p[0]).reduce((a, b) => (b.length > a.length ? b : a));
  const achar = (r, t) => {
    const idx = r.map((p, i) => (k(p) === t ? i : -1)).filter((i) => i >= 0);
    if (idx.length !== 1) throw new Error(`tríplice ${t}: ${idx.length} ocorrências no anel (esperada 1); decidir antes de publicar`);
    return idx[0];
  };
  const ia = achar(anel, TRIPLICE_PA_RR_GUIANA);
  const ib = achar(anel, TRIPLICE_AM_RR_VENEZUELA);
  const oa = achar(anelPais, TRIPLICE_PA_RR_GUIANA);
  const ob = achar(anelPais, TRIPLICE_AM_RR_VENEZUELA);
  if (!(ia < ib && oa < ob)) throw new Error(`tríplices fora de ordem (Norte ${ia}/${ib}, contorno ${oa}/${ob}): os anéis mudaram de sentido; decidir antes de publicar`);
  const fronteira = anelPais.slice(oa, ob + 1); // tríplice PA/RR/Guiana → tríplice AM/RR/Venezuela, pela fronteira internacional
  const divisa = anel.slice(ia, ib + 1); // os mesmos dois pontos, pela divisa de RR com PA e AM
  const anelRR = fronteira.concat(divisa.slice().reverse().slice(1));
  const novo = anel.slice(0, ia).concat(fronteira, anel.slice(ib + 1));
  // conferências
  const areaAntes = areaDoAnelKm2(anel);
  const areaDepois = areaDoAnelKm2(novo);
  const ganho = areaDepois - areaAntes;
  const dbf = lerDbf(lerZip(await readFile(join(BRUTO, 'ibge', 'RR_UF_2024.zip')))['RR_UF_2024.dbf']);
  const areaOficial = num(dbf[0]?.AREA_KM2);
  if (!areaOficial) throw new Error('RR_UF_2024.dbf sem AREA_KM2; rode baixar.mjs ibge');
  const desvio = Math.abs(ganho - areaOficial) / areaOficial;
  if (desvio >= TOLERANCIA_AREA_RR) throw new Error(`Roraima no Norte: o anel cresce ${Math.round(ganho)} km², contra ${areaOficial} km² oficiais (${(desvio * 100).toFixed(2)}%); decidir antes de publicar`);
  const cruzamentos = autointersecoes(novo);
  if (cruzamentos) throw new Error(`Roraima no Norte: o anel novo tem ${cruzamentos} autointerseções; decidir antes de publicar`);
  // as subestações de RR no cadastro do ONS: dentro do anel novo, fora do antigo
  const seRR = (await csv('ons/SUBESTACAO.csv')).filter((r) => r.id_estado === 'RR');
  const pontosRR = [...new Map(seRR.map((r) => [r.id_subestacao, { id: r.id_subestacao, nome: limpo(r.nom_subestacao), sub: r.id_subsistema, lon: num(r.val_longitude), lat: num(r.val_latitude) }])).values()];
  for (const p of pontosRR) {
    p.noNorteNovo = dentroDoAnel(p.lon, p.lat, novo);
    p.noNorteAntigo = dentroDoAnel(p.lon, p.lat, anel);
    if (!p.noNorteNovo) throw new Error(`Roraima no Norte: a subestação ${p.nome} (${p.lon}, ${p.lat}) fica fora do anel novo; decidir antes de publicar`);
    if (p.sub !== 'N') throw new Error(`cadastro do ONS: a subestação ${p.nome} de RR está no subsistema ${p.sub}, não no N; decidir antes de publicar`);
  }
  const uhRR = (await csv('ons/CAPACIDADE_GERACAO.csv')).filter((r) => r.id_estado === 'RR');
  const subsUsinasRR = [...new Set(uhRR.map((r) => r.id_subsistema))];
  if (subsUsinasRR.some((s) => s !== 'N')) throw new Error(`cadastro do ONS: usinas de RR fora do subsistema N (${subsUsinasRR.join(', ')}); decidir antes de publicar`);
  // a data da interligação: entrada em operação das LT 500 kV de RR no cadastro do ONS
  const ltRR = (await csv('ons/LINHA_TRANSMISSAO.csv')).filter((r) => (r.id_estado_terminalde === 'RR' || r.id_estado_terminalpara === 'RR') && num(r.val_niveltensao_kv) === 500);
  const datasLt = [...new Set(ltRR.map((r) => r.dat_entradaoperacao).filter(Boolean))].sort();
  if (datasLt.length !== 1) throw new Error(`LT 500 kV de RR com ${datasLt.length} datas de entrada em operação (${datasLt.join(', ')}); decidir o texto antes de publicar`);
  const sha = (t) => createHash('sha256').update(t).digest('hex');
  const geometria = JSON.parse(JSON.stringify(norte.geometry));
  geometria.coordinates[iPol][0] = novo;
  const features = sub.features.map((f) =>
    f.properties.id === 'norte' ? { ...f, properties: { ...f.properties, ufsIbge: [...f.properties.ufsIbge, '14'].sort() }, geometry: geometria } : f,
  );
  const ibge = manifesto['ibge-rr-uf-2024'];
  if (!ibge) throw new Error('fonte ibge-rr-uf-2024 fora do manifesto: rode baixar.mjs ibge');
  const conferencias = {
    tripliceParaRoraimaGuiana: { coordenada: TRIPLICE_PA_RR_GUIANA, indiceNoNorte: ia, indiceNoContorno: oa },
    tripliceAmazonasRoraimaVenezuela: { coordenada: TRIPLICE_AM_RR_VENEZUELA, indiceNoNorte: ib, indiceNoContorno: ob },
    verticesDoAnelDoNorte: { antes: anel.length, depois: novo.length },
    verticesTrocados: { divisaRetirada: divisa.length - 2, fronteiraIncluida: fronteira.length - 2 },
    verticesNovos: 0,
    autointersecoes: cruzamentos,
    areaKm2: { anelAntes: Math.round(areaAntes), anelDepois: Math.round(areaDepois), ganho: Math.round(ganho), roraimaPelosDoisArquivos: Math.round(areaDoAnelKm2(anelRR)), roraimaOficialIbge: areaOficial, desvioDoGanho: Math.round(desvio * 1e5) / 1e5 },
    metodoDaArea: 'esfera de raio 6.371,0088 km, soma trapezoidal sobre o anel (o mesmo método nas duas medidas)',
    subestacoesDeRoraimaNoCadastroDoOns: pontosRR.map(({ id, nome, sub: s, noNorteNovo, noNorteAntigo }) => ({ id, nome, subsistema: s, noNorteNovo, noNorteAntigo })),
    unidadesGeradorasDeRoraimaNoCadastroDoOns: { unidades: uhRR.length, usinas: new Set(uhRR.map((r) => r.ceg)).size, subsistemas: subsUsinasRR },
    linhasDe500kVDeRoraima: { linhas: ltRR.map((r) => limpo(r.nom_linhadetransmissao)), entradaEmOperacao: datasLt[0] },
  };
  const provenance = {
    geometria: 'IBGE — API de malhas territoriais v3, qualidade mínima, pelos dois arquivos do Portal BR, lidos sem alteração',
    arquivosDeOrigem: [
      { arquivo: 'public/br/submercados.geojson', url: sub.provenance?.url ?? null, acessoDeclarado: sub.provenance?.fetched ?? null, sha256: sha(textoSub) },
      { arquivo: 'public/br/brasil-outline.geojson', url: contorno.provenance?.url ?? null, acessoDeclarado: contorno.provenance?.fetched ?? null, sha256: sha(textoContorno) },
    ],
    provenanceDoArquivoDeOrigem: sub.provenance ?? null,
    operacao: `No anel principal do Norte, o trecho entre os tríplices (${TRIPLICE_PA_RR_GUIANA}) [PA, RR, Guiana] e (${TRIPLICE_AM_RR_VENEZUELA}) [AM, RR, Venezuela] — a divisa de Roraima com o Pará e o Amazonas — foi substituído pelo trecho do contorno do país entre os mesmos dois pontos (a fronteira internacional de Roraima). Nenhum vértice novo; os outros submercados não mudam. ufsIbge do Norte ganha "14" (RR).`,
    classificacao: `ONS — cadastro de Dados Abertos: as subestações (SUBESTACAO.csv) e as unidades geradoras (CAPACIDADE_GERACAO.csv) de RR estão no subsistema N; as linhas de 500 kV de RR (LINHA_TRANSMISSAO.csv) entraram em operação em ${datasLt[0]}. MME, notícia de 10/09/2025: início da energização do Linhão Manaus–Boa Vista, que "marca a conexão de Roraima ao SIN".`,
    fontesDaClassificacao: [
      { orgao: 'ONS', conjunto: 'Dados Abertos · cadastro (Subestação, Capacidade Instalada de Geração, Linhas de Transmissão)', acesso: dia(manifesto['ons-subestacao'].acesso) },
      { orgao: 'ONS', pagina: 'https://www.ons.org.br/Paginas/energia-no-futuro/suprimento-eletrico/parpel2025/sumario-executivo/index.aspx', diz: 'interligação de Roraima ao SIN em setembro de 2025, pela LT 500 kV Lechuga – Equador – Boa Vista C1 e C2', acesso: '2026-11-16' },
      { orgao: 'MME', pagina: 'https://www.gov.br/mme/pt-br/com-investimento-de-r-3-3-bilhoes-lula-e-silveira-dao-inicio-a-energizacao-do-linhao-manaus2013boa-vista', diz: 'início da energização em 10/09/2025', acesso: '2026-11-16' },
    ],
    areaOficial: { orgao: 'IBGE', conjunto: ibge.conjunto, url: ibge.url, campo: 'AREA_KM2', sha256: ibge.sha256, acesso: dia(ibge.acesso) },
    conferencias,
    construido: new Date().toISOString().slice(0, 10),
  };
  // Roraima à parte, para o mapa desenhar o Norte como era ANTES da interligação (meses e anos
  // anteriores): o anel de RR e a geometria do Norte do Portal BR, os dois só com vértices do IBGE.
  // Membro estrangeiro da FeatureCollection (RFC 7946 §6.1): quem lê `features` não muda.
  const roraimaAParte = {
    noNorteDesde: datasLt[0],
    primeiroMesNoNorte: datasLt[0].slice(0, 7),
    primeiroAnoNoNorte: Number(datasLt[0].slice(0, 4)),
    roraima: { type: 'Polygon', coordinates: [anelRR] },
    norteSemRoraima: norte.geometry,
    nota: `Antes de ${datasLt[0].slice(0, 7).split('-').reverse().join('/')} Roraima não estava ligada ao Sistema Interligado Nacional (o MME diz que a energização do Linhão Manaus–Boa Vista "marca a conexão de Roraima ao SIN"). A geometria do Norte sem Roraima é a do Portal BR, sem alteração; o anel de Roraima é a fronteira internacional do contorno do país mais a divisa com o Pará e o Amazonas, só vértices dos dois arquivos do IBGE. Data: entrada em operação das LT 500 kV de RR no cadastro do ONS.`,
  };
  return { fc: { type: 'FeatureCollection', provenance, roraimaAParte, features }, conferencias, entradaEmOperacao: datasLt[0], ibge };
}

// submercados do Atlas (com Roraima no Norte): servem para conferir a coordenada contra o estado declarado
const SUBMERCADOS_DO_ATLAS = await montarSubmercados();
const SUBMERCADOS = SUBMERCADOS_DO_ATLAS.fc.features;
const SUBMERCADO_DA_UF = {};
for (const sm of SUBMERCADOS) for (const cod of sm.properties.ufsIbge) SUBMERCADO_DA_UF[cod] = sm.properties.id;

/** Nome do submercado onde a coordenada cai, quando ele não é o de nenhuma das UFs
 *  declaradas e o ponto está a mais de 0,25° (≈ 28 km) da borda do submercado
 *  declarado (o polígono é simplificado). Senão, null. Só o caso positivo conta:
 *  ponto no mar ou em ilha fora do polígono não é acusado. */
function submercadoIncoerente(lon, lat, ufs) {
  if (!Number.isFinite(lon) || !Number.isFinite(lat)) return null;
  const meus = new Set([...ufs].map((uf) => SUBMERCADO_DA_UF[IBGE_DA_UF[uf]]).filter(Boolean));
  if (!meus.size) return null;
  const onde = SUBMERCADOS.find((sm) => dentroDaGeometria(lon, lat, sm.geometry));
  if (!onde || meus.has(onde.properties.id)) return null;
  const longe = SUBMERCADOS.filter((sm) => meus.has(sm.properties.id)).every((sm) => distanciaAteABorda(lon, lat, sm.geometry) > 0.25);
  return longe ? onde.properties.nome : null;
}

// ── rumo das barragens (ANA · SNIRH, massas d'água) ──────────────────
// O cadastro não diz para onde a barragem está virada. Onde a ANA mapeou o reservatório
// com o nome da usina, a borda do polígono junto ao ponto do cadastro dá o eixo da crista,
// e o lado com água dá o montante. Só vale quando passa no TESTE DA ÁGUA (o do batedor de
// 16/11/2026, conferido contra a foto de satélite em 13 usinas): mesmo nome, borda a até
// 300 m do ponto, trecho de ±1.200 m da borda quase reto (retidão ≥ 0,95), água de um lado
// (≥ min(1.000 m, meio vão)) e não do outro (≤ 100 m), usina sem posição a confirmar. Fora
// disso, rumoB = null e o desenho segue a convenção leste–oeste do modelo. Nada a olho.
//
// rumoB é o rumo DO MONTANTE (graus do norte, horário, 0 a 360): a direção que sai da crista
// para o lado da água, a normal da borda apontando para o reservatório. A crista corre a
// rumoB ± 90°. O modelo tem o muro ao longo do seu eixo y e o montante em −x, então a camada
// 3D o gira por rumoB + 90 (contrato com maquetes.ts, recado de 16/11/2026). A convenção
// (giro 90) equivale a montante ao norte (rumoB 0), crista leste–oeste.
const RUMO_DIST_MAX_M = 300;
const RUMO_TRECHO_M = 1200;
const RUMO_RETIDAO_MIN = 0.95;
const RUMO_AGUA_MIN_M = 1000;
const RUMO_SECO_MAX_M = 100;
const RUMO_PREC_MIN = 3;

async function lerMassasDaAna() {
  if (!manifesto['ana-massas-dagua-hidro']) throw new Error('fonte ana-massas-dagua-hidro fora do manifesto: rode baixar.mjs ana');
  const fc = JSON.parse(await lerTexto('ana/massas-dagua-hidro.geojson'));
  const norm = (s) => (s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toUpperCase().replace(/^(UHE|PCH|CGH)\s+/, '').replace(/\(.*?\)/g, '').replace(/[^A-Z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim();
  const massas = [];
  for (const f of fc.features) {
    if (!f.geometry) continue;
    const aneis = f.geometry.type === 'Polygon' ? f.geometry.coordinates : f.geometry.coordinates.flat();
    const bb = [Infinity, Infinity, -Infinity, -Infinity];
    for (const r of aneis)
      for (const [x, y] of r) {
        if (x < bb[0]) bb[0] = x;
        if (y < bb[1]) bb[1] = y;
        if (x > bb[2]) bb[2] = x;
        if (y > bb[3]) bb[3] = y;
      }
    massas.push({ id: f.id ?? null, nome: f.properties.nmoriginal, chave: norm(f.properties.nmoriginal), aneis, bb });
  }
  return { massas, norm, total: fc.features.length, semGeometria: fc.features.filter((f) => !f.geometry).length };
}

/** Eixo da borda do polígono junto ao ponto, retidão e água de cada lado (método do batedor). */
function eixoDaBorda(lon, lat, massa) {
  const kx = 111320 * Math.cos((lat * Math.PI) / 180);
  const ky = 110540;
  const m = (p) => [(p[0] - lon) * kx, (p[1] - lat) * ky];
  let melhor = { d: Infinity };
  massa.aneis.forEach((r, ri) => {
    for (let i = 0; i < r.length - 1; i++) {
      const a = m(r[i]);
      const b = m(r[i + 1]);
      const dx = b[0] - a[0];
      const dy = b[1] - a[1];
      const t = Math.max(0, Math.min(1, (-a[0] * dx - a[1] * dy) / (dx * dx + dy * dy || 1e-9)));
      const px = a[0] + t * dx;
      const py = a[1] + t * dy;
      const d = Math.hypot(px, py);
      if (d < melhor.d) melhor = { d, ri, i, p: [px, py] };
    }
  });
  // a borda a ±1.200 m (ao longo do anel) do ponto mais próximo
  const Rg = massa.aneis[melhor.ri].map(m);
  const pts = [melhor.p];
  for (const dir of [1, -1]) {
    let acc = 0;
    let i = dir > 0 ? melhor.i + 1 : melhor.i;
    let ant = melhor.p;
    for (let k = 0; k < Rg.length; k++) {
      const idx = (((i % (Rg.length - 1)) + (Rg.length - 1)) % (Rg.length - 1));
      const q = Rg[idx];
      acc += Math.hypot(q[0] - ant[0], q[1] - ant[1]);
      if (acc > RUMO_TRECHO_M) break;
      pts.push(q);
      ant = q;
      i += dir;
    }
  }
  // eixo principal (PCA) do trecho
  const cx = pts.reduce((s, p) => s + p[0], 0) / pts.length;
  const cy = pts.reduce((s, p) => s + p[1], 0) / pts.length;
  let sxx = 0;
  let syy = 0;
  let sxy = 0;
  for (const p of pts) {
    sxx += (p[0] - cx) ** 2;
    syy += (p[1] - cy) ** 2;
    sxy += (p[0] - cx) * (p[1] - cy);
  }
  const ang = 0.5 * Math.atan2(2 * sxy, sxx - syy); // radianos, do leste, anti-horário
  const h = Math.sqrt(((sxx - syy) / 2) ** 2 + sxy ** 2);
  const l1 = (sxx + syy) / 2 + h;
  const l2 = (sxx + syy) / 2 - h;
  const vao = Math.max(...pts.map((p) => Math.abs((p[0] - cx) * Math.cos(ang) + (p[1] - cy) * Math.sin(ang)))) * 2;
  // água de cada lado: raio pela normal, de 25 em 25 m
  const dentro = (x, y) => {
    let c = false;
    for (const r of massa.aneis)
      for (let i = 0, j = r.length - 1; i < r.length; j = i++) {
        const a = m(r[i]);
        const b = m(r[j]);
        if (a[1] > y !== b[1] > y && x < ((b[0] - a[0]) * (y - a[1])) / (b[1] - a[1]) + a[0]) c = !c;
      }
    return c;
  };
  const nx = -Math.sin(ang);
  const ny = Math.cos(ang);
  const corrida = (s) => {
    let run = 0;
    for (let k = 1; k <= 80; k++) {
      const t = 15 + k * 25;
      if (dentro(melhor.p[0] + s * nx * t, melhor.p[1] + s * ny * t)) run = t;
      else if (t - run > 100) break;
    }
    return run;
  };
  const aguaMais = corrida(1);
  const aguaMenos = corrida(-1);
  // montante: o lado com água (o modelo será girado por este rumo + 90°)
  const [ux, uy] = aguaMais >= aguaMenos ? [nx, ny] : [-nx, -ny];
  const rumoMontante = ((Math.atan2(ux, uy) * 180) / Math.PI + 360) % 360;
  return {
    d: melhor.d,
    retidao: 1 - l2 / (l1 || 1),
    vao,
    aguaMax: Math.max(aguaMais, aguaMenos),
    aguaMin: Math.min(aguaMais, aguaMenos),
    rumoMontante,
    rumoB: Math.round(rumoMontante) % 360,
    rumoDaCrista: Math.round(rumoMontante + 90) % 180,
  };
}

/** Grava rumoB nas UHE e PCH em operação que passam no teste da água; devolve o resumo para o índice. */
function rumoDasBarragens(linhas, tipos, { massas, norm, total, semGeometria }) {
  const cont = {};
  const inc = (t, k) => ((cont[t] ||= { total: 0, comRumo: 0, posicaoAConfirmar: 0, semPoligonoA1km: 0, poligonoDeOutroNome: 0, reprovadasNoTeste: 0 }), cont[t][k]++);
  const comRumo = [];
  for (const l of linhas) {
    const t = tipos[l.tipo];
    if ((t !== 'UHE' && t !== 'PCH') || l.fase !== 0) continue;
    inc(t, 'total');
    if (l.susp) {
      inc(t, 'posicaoAConfirmar');
      continue;
    }
    const { lon, lat } = l;
    const candidatos = massas.filter((f) => lon > f.bb[0] - 0.02 && lon < f.bb[2] + 0.02 && lat > f.bb[1] - 0.02 && lat < f.bb[3] + 0.02);
    const chave = norm(l.nome);
    let melhor = null;
    for (const f of candidatos) {
      const a = eixoDaBorda(lon, lat, f);
      const nomeOk = !!f.chave && !!chave && (f.chave === chave || f.chave.includes(chave) || chave.includes(f.chave));
      const sc = a.d - (nomeOk ? 1e6 : 0);
      if (!melhor || sc < melhor.sc) melhor = { sc, f, a, nomeOk };
    }
    if (!melhor || melhor.a.d > 1000) {
      inc(t, 'semPoligonoA1km');
      continue;
    }
    if (!melhor.nomeOk) {
      inc(t, 'poligonoDeOutroNome');
      continue;
    }
    const a = melhor.a;
    const passa = a.d <= RUMO_DIST_MAX_M && a.retidao >= RUMO_RETIDAO_MIN && a.aguaMax >= Math.min(RUMO_AGUA_MIN_M, 0.5 * a.vao) && a.aguaMin <= RUMO_SECO_MAX_M;
    if (!passa) {
      inc(t, 'reprovadasNoTeste');
      continue;
    }
    // coordenada com menos de 3 casas na fonte (erro de ~555 m ou mais): a borda achada perto
    // do ponto pode ser a margem do lago e não a barragem. Fica na convenção, contada à parte
    if (l.prec < RUMO_PREC_MIN) {
      (cont[t].coordenadaImprecisa ||= []).push(l.nome);
      continue;
    }
    inc(t, 'comRumo');
    l.rumoB = a.rumoB;
    comRumo.push({ nome: l.nome, ceg: l.ceg, tipo: t, kw: l.kw, rumoB: a.rumoB, rumoDaCrista: a.rumoDaCrista, poligono: melhor.f.nome, idDoPoligono: melhor.f.id, distanciaM: Math.round(a.d), retidao: Math.round(a.retidao * 1000) / 1000, aguaM: a.aguaMax, secoM: a.aguaMin });
  }
  return {
    campo: 'rumoB',
    poligonosNaFonte: total,
    poligonosSemGeometria: semGeometria,
    porTipo: cont,
    criterio: `mesmo nome da usina; borda do polígono a até ${RUMO_DIST_MAX_M} m do ponto do cadastro; trecho de ±${RUMO_TRECHO_M.toLocaleString("pt-BR")} m da borda com retidão ≥ ${String(RUMO_RETIDAO_MIN).replace(".", ",")} (1 − λ2/λ1 do eixo principal); água de um lado ≥ min(${RUMO_AGUA_MIN_M.toLocaleString("pt-BR")} m, meio vão) e do outro ≤ ${RUMO_SECO_MAX_M} m; usina sem posição a confirmar; coordenada com ${RUMO_PREC_MIN} casas significativas ou mais na fonte (prec)`,
    significado: 'rumoB é o rumo do montante (graus a partir do norte, sentido horário, 0 a 360): a direção que sai da crista para o lado do reservatório. A crista corre a rumoB ± 90° (rumoDaCrista, de 0 a 180). Ausente (null): vale a convenção do modelo (crista leste–oeste, montante ao norte).',
    comRumo: comRumo.sort((x, y) => y.kw - x.kw),
    nota: 'Rumo derivado do reservatório mapeado pela ANA (polígonos de 2015 a 2019, satélite variável por polígono). Falha por construção em barragem em arco e onde a casa de força fica longe do barramento (Belo Monte, Furnas): essas ficam na convenção, declarada.',
  };
}

/** Etapas da potência de uma usina em operação casada com o ONS: array plano
 *  [ano1, kwAcum1, ano2, kwAcum2, …], anos crescentes de dat_entradaoperacao das unidades
 *  ATIVAS do ONS (só os quatro subsistemas). O total é o da ANEEL (`kw`): onde a soma das
 *  unidades do ONS difere, a forma vem do ONS e a escala da ANEEL, pela proporção:
 *  kwAcum(ano) = round(kw × MW_ONS_até_ano / MW_ONS_total). O último valor é `kw`.
 *  Unidade sem data de operação fica fora (a escala absorve); nenhuma unidade datada → null. */
function etapasDaUsina(o, kw) {
  const anos = [...o.porAno.keys()].sort((a, b) => a - b);
  const mwDatado = anos.reduce((s, a) => s + o.porAno.get(a), 0);
  if (!anos.length || !(mwDatado > 0) || !(kw > 0)) return null;
  const e = [];
  let acum = 0;
  for (const a of anos) {
    acum += o.porAno.get(a);
    e.push(a, a === anos[anos.length - 1] ? kw : Math.round((kw * acum) / mwDatado));
  }
  return e;
}

async function construirUsinas() {
  // o SIGA traz alguns empreendimentos em duas linhas, uma por tipo de outorga:
  // conta-se uma vez; qualquer outra diferença entre as linhas derruba o script
  const sigaBruto = await csv('aneel/siga-empreendimentos-geracao-diario.csv');
  const porCeg = new Map();
  const repetidasNaFonte = [];
  for (const r of sigaBruto) {
    const a = porCeg.get(r.CodCEG);
    if (!a) {
      porCeg.set(r.CodCEG, r);
      continue;
    }
    const difere = Object.keys(r).filter((k) => k !== 'DscTipoOutorga' && r[k] !== a[k]);
    if (difere.length) throw new Error(`SIGA: o CEG ${r.CodCEG} aparece mais de uma vez com ${difere.join(', ')} diferente(s); decidir antes de publicar`);
    repetidasNaFonte.push({ ceg: r.CodCEG, nome: limpo(r.NomEmpreendimento), outorgas: [a.DscTipoOutorga, r.DscTipoOutorga] });
  }
  const siga = [...porCeg.values()];
  const ons = await csv('ons/CAPACIDADE_GERACAO.csv');
  // ONS: agrega unidades geradoras ativas por núcleo do CEG. Unidade fora dos quatro
  // subsistemas (o setor de 50 Hz de Itaipu, que o ONS marca como PY) não entra na
  // soma da usina brasileira: é contada à parte
  const onsPorNucleo = new Map();
  const onsForaDoSin = new Map();
  for (const r of ons) {
    if (r.dat_desativacao) continue;
    const nucleo = (r.ceg.split('.')[3] || '').split('-')[0];
    if (!nucleo) continue;
    if (!SUB_ONS[r.id_subsistema]) {
      const k = `${limpo(r.nom_usina)} (${r.id_subsistema})`;
      onsForaDoSin.set(k, (onsForaDoSin.get(k) || 0) + 1);
      continue;
    }
    const a = onsPorNucleo.get(nucleo) || { mod: r.nom_modalidadeoperacao, sub: SUB_ONS[r.id_subsistema] ?? null, mw: 0, ug: 0, porAno: new Map(), semData: 0 };
    a.mw += num(r.val_potenciaefetiva) || 0;
    a.ug++;
    // etapas: MW das unidades ativas por ano de entrada em operação (dat_entradaoperacao do ONS)
    const anoUg = /^\d{4}-/.test(r.dat_entradaoperacao || '') ? Number(r.dat_entradaoperacao.slice(0, 4)) : null;
    if (anoUg == null) a.semData++;
    else a.porAno.set(anoUg, (a.porAno.get(anoUg) || 0) + (num(r.val_potenciaefetiva) || 0));
    onsPorNucleo.set(nucleo, a);
  }
  const dataBase = siga[0].DatGeracaoConjuntoDados;
  const combustiveis = [];
  const idxComb = (s) => {
    let i = combustiveis.indexOf(s);
    if (i < 0) i = combustiveis.push(s) - 1;
    return i;
  };
  const modalidades = [];
  const idxMod = (s) => {
    let i = modalidades.indexOf(s);
    if (i < 0) i = modalidades.push(s) - 1;
    return i;
  };
  const tipos = ['UHE', 'PCH', 'CGH', 'UTE', 'UTN', 'EOL', 'UFV'];
  const subs = ['N', 'NE', 'S', 'SE'];

  const donos = [];
  const idxDono = new Map();
  const dono = (s) => {
    if (!s) return -1;
    let i = idxDono.get(s);
    if (i === undefined) {
      i = donos.push(s) - 1;
      idxDono.set(s, i);
    }
    return i;
  };
  const linhas = [];
  let semCoordenada = 0;
  let semData = 0;
  const posicaoIncoerente = [];
  const resumo = {};
  for (const c of CATEGORIAS) resumo[c] = { usinas: 0, kwOperacao: 0, noMapa: 0, emOperacao: 0, noMapaEmOperacao: 0, kwOperacaoNoMapa: 0 };
  let casadasOns = 0;
  for (const r of siga) {
    const cat = categoria(r);
    const fase = FASES.indexOf(r.DscFaseUsina);
    const kwFisc = num(r.MdaPotenciaFiscalizadaKw) || 0;
    const kwOut = num(r.MdaPotenciaOutorgadaKw) || 0;
    resumo[cat].usinas++;
    if (fase === 0) {
      resumo[cat].kwOperacao += kwFisc;
      resumo[cat].emOperacao++;
    }
    const lat = num(r.NumCoordNEmpreendimento);
    const lon = num(r.NumCoordEEmpreendimento);
    if (!lat || !lon || lat < -34.5 || lat > 6 || lon < -75 || lon > -28) {
      semCoordenada++;
      continue;
    }
    resumo[cat].noMapa++;
    if (fase === 0) {
      resumo[cat].noMapaEmOperacao++;
      resumo[cat].kwOperacaoNoMapa += kwFisc;
    }
    const o = onsPorNucleo.get(r.IdeNucleoCEG);
    if (o) casadasOns++;
    const etapas = fase === 0 && o ? etapasDaUsina(o, Math.round(kwFisc)) : null;
    // 1900 é o marcador de "sem data" do cadastro (usina que não opera e 156 que operam)
    const anoBruto = r.DatEntradaOperacao ? Number(r.DatEntradaOperacao.slice(0, 4)) : null;
    const anoOperacao = fase === 0 && anoBruto && anoBruto > 1900 ? anoBruto : null;
    if (fase === 0 && anoOperacao == null) semData++;
    // a coordenada cai DENTRO de outro submercado que não o do estado declarado?
    // usina em rio de divisa tem municípios de dois estados: vale o submercado de qualquer um deles
    const ufs = new Set([r.SigUFPrincipal, ...[...(r.DscMuninicpios || '').matchAll(/ - ([A-Z]{2})(?:,|$)/g)].map((m) => m[1])]);
    const caiEm = submercadoIncoerente(lon, lat, ufs);
    const suspeita = caiEm ? 1 : 0;
    if (caiEm) posicaoIncoerente.push({ ceg: r.CodCEG, nome: limpo(r.NomEmpreendimento), uf: r.SigUFPrincipal, mun: limpo(r.DscMuninicpios), kw: Math.round(fase === 0 ? kwFisc : kwOut), lon: r4(lon), lat: r4(lat), caiEm });
    linhas.push({
      nome: limpo(r.NomEmpreendimento),
      ceg: r.CodCEG,
      uf: r.SigUFPrincipal,
      // como a fonte escreve: cada município com a própria UF ("Selvíria - MS, Ilha Solteira - SP")
      mun: limpo(r.DscMuninicpios),
      tipo: tipos.indexOf(r.SigTipoGeracao),
      cat: CATEGORIAS.indexOf(cat),
      comb: idxComb(r.NomFonteCombustivel),
      // potência do mapa: fiscalizada se em operação; outorgada se ainda não opera
      kw: Math.round(fase === 0 ? kwFisc : kwOut),
      fase,
      ano: anoOperacao,
      dono: dono(limpo(r.DscPropriRegimePariticipacao)),
      susp: suspeita,
      lon: r4(lon),
      lat: r4(lat),
      mod: o ? idxMod(o.mod) : -1,
      sub: o ? subs.indexOf(o.sub) : -1,
      mwOns: o ? Math.round(o.mw) : null,
      ug: o ? o.ug : null,
      // casas decimais significativas da coordenada no CSV do SIGA (0 a 4; 4 = 4 ou mais)
      prec: precisao(r.NumCoordEEmpreendimento, r.NumCoordNEmpreendimento),
      // rumo da barragem pelo reservatório mapeado pela ANA (null: vale a convenção); ver rumoDasBarragens
      rumoB: null,
      // potência ao longo dos anos pelas unidades do ONS: [ano1, kwAcum1, ano2, kwAcum2, …]; ver etapasDaUsina
      etapas,
    });
  }
  const rumos = rumoDasBarragens(linhas, tipos, await lerMassasDaAna());
  linhas.sort((a, b) => b.kw - a.kw);
  const LIMIAR_KW = 5000;
  const colunar = (ls) => {
    const o = { n: ls.length };
    for (const k of Object.keys(ls[0])) o[k] = ls.map((l) => l[k]);
    // reindexa os proprietários para o dicionário deste arquivo
    const locais = [];
    const mapa = new Map();
    o.dono = o.dono.map((i) => {
      if (i < 0) return -1;
      let j = mapa.get(i);
      if (j === undefined) {
        j = locais.push(donos[i]) - 1;
        mapa.set(i, j);
      }
      return j;
    });
    o.donos = locais;
    return o;
  };
  const grandes = linhas.filter((l) => l.kw >= LIMIAR_KW);
  const pequenas = linhas.filter((l) => l.kw < LIMIAR_KW);
  const comum = { dataBase, tipos, categorias: CATEGORIAS, fases: FASES, subsistemas: subs };
  await gravar('usinas-principais.json', { ...comum, combustiveis, modalidades, limiarKw: LIMIAR_KW, ...colunar(grandes) });
  await gravar('usinas-menores.json', { ...comum, combustiveis, modalidades, limiarKw: LIMIAR_KW, ...colunar(pequenas) });
  const emOperacao = siga.filter((r) => r.DscFaseUsina === 'Operação').length;
  const noMapaEmOperacao = linhas.filter((l) => l.fase === 0).length;
  // resumo das etapas por unidade (conferência e procedência)
  const comEtapas = linhas.filter((l) => l.etapas);
  const kwComEtapas = comEtapas.reduce((s, l) => s + l.kw, 0);
  const divergentes = comEtapas
    .map((l) => ({ nome: l.nome, ceg: l.ceg, kwAneel: l.kw, kwOns: Math.round(onsPorNucleo.get(l.ceg.split('.')[3].split('-')[0]).mw * 1000) }))
    .filter((d) => Math.abs(d.kwOns - d.kwAneel) > 0.05 * d.kwAneel)
    .sort((a, b) => b.kwAneel - a.kwAneel);
  const conferir = ['UHE.PH.PA.002889-4', 'UHE.PH.PR.001161-4', 'UHE.PH.PA.030354-2', 'UHE.PH.SE.027053-9'];
  const etapasPorUnidade = {
    campo: 'etapas',
    formato: '[ano1, kwAcum1, ano2, kwAcum2, …] (array plano; anos crescentes; kW inteiros acumulados até o fim do ano; o último é o `kw` da usina); null quando a usina não opera ou não casa com o ONS',
    usinas: comEtapas.length,
    gw: Math.round(kwComEtapas / 1e5) / 10,
    comMaisDeUmAno: comEtapas.filter((l) => l.etapas.length > 2).length,
    gwComMaisDeUmAno: Math.round(comEtapas.filter((l) => l.etapas.length > 2).reduce((s, l) => s + l.kw, 0) / 1e5) / 10,
    primeiroAnoDiferenteDoSiga: comEtapas.filter((l) => l.ano != null && l.etapas[0] !== l.ano).length,
    emOperacaoSemEtapas: linhas.filter((l) => l.fase === 0 && !l.etapas).length,
    regra: 'Usina em operação cujo núcleo do CEG casa com o cadastro de unidades geradoras do ONS (CAPACIDADE_GERACAO.csv): o ano de cada etapa é o de dat_entradaoperacao das unidades ativas (sem dat_desativacao) dos quatro subsistemas; o setor de 50 Hz de Itaipu (subsistema PY) fica fora. O total é a potência fiscalizada da ANEEL; onde a soma das unidades do ONS difere, a forma vem do ONS e a escala da ANEEL: kwAcum(ano) = round(kw × MW do ONS até o ano / MW do ONS no total). Unidades já desativadas não entram (o Atlas conta a frota que opera hoje). As demais usinas não têm data por unidade: entram inteiras no ano de entrada em operação do SIGA.',
    divergenciaAcimaDe5PorCento: { usinas: divergentes.length, exemplos: divergentes.slice(0, 10) },
    conferencia: conferir.map((p) => {
      const l = comEtapas.find((x) => x.ceg.startsWith(p));
      return l ? { nome: l.nome, ceg: l.ceg, kw: l.kw, anoSiga: l.ano, etapas: l.etapas } : { ceg: p, ausente: true };
    }),
  };
  return {
    total: siga.length,
    linhasNaFonte: sigaBruto.length,
    repetidasNaFonte,
    noMapa: linhas.length,
    semCoordenadaNaFonte: semCoordenada,
    principais: grandes.length,
    menores: pequenas.length,
    limiarKw: LIMIAR_KW,
    dataBase,
    emOperacao,
    naoOperam: siga.length - emOperacao,
    naoOperamNoMapa: linhas.length - noMapaEmOperacao,
    gwEmOperacao: Math.round(Object.values(resumo).reduce((a, c) => a + c.kwOperacao, 0) / 1e5) / 10,
    porCategoria: Object.fromEntries(
      Object.entries(resumo).map(([k, v]) => [
        k,
        {
          usinas: v.usinas,
          noMapa: v.noMapa,
          gwOperacao: Math.round(v.kwOperacao / 1e4) / 100,
          emOperacao: v.emOperacao,
          noMapaEmOperacao: v.noMapaEmOperacao,
          gwOperacaoNoMapa: Math.round(v.kwOperacaoNoMapa / 1e4) / 100,
        },
      ]),
    ),
    vinculadasAoOns: casadasOns,
    unidadesOnsForaDoSin: [...onsForaDoSin].map(([usina, unidades]) => ({ usina, unidades })),
    emOperacaoSemDataNaFonte: semData,
    posicaoIncoerenteComOEstado: posicaoIncoerente.length,
    exemplosDePosicaoIncoerente: posicaoIncoerente.sort((a, b) => b.kw - a.kw).slice(0, 12),
    precisaoDaCoordenada: {
      campo: 'prec',
      porCasas: [0, 1, 2, 3, 4].reduce((o, c) => ((o[c] = linhas.filter((l) => l.prec === c).length), o), {}),
      emOperacaoPorCasas: [0, 1, 2, 3, 4].reduce((o, c) => ((o[c] = linhas.filter((l) => l.fase === 0 && l.prec === c).length), o), {}),
      nota: 'Casas decimais significativas da coordenada no CSV do SIGA, antes do arredondamento a 4 casas (o SIGA escreve 8 casas fixas: o zero final não conta), a pior das duas (latitude e longitude); 4 quer dizer 4 ou mais. O erro da posição é meia unidade da última casa (4 casas ≈ 5,6 m; 3 ≈ 56 m; 2 ≈ 555 m).',
    },
    // a fonte do rumo fica dentro do bloco (a ficha lista `fontes` em toda usina; a ANA só vale onde há rumoB)
    rumoDasBarragens: { ...rumos, fonte: fonteDe('ana-massas-dagua-hidro') },
    etapasPorUnidade,
    fontes: [fonteDe('aneel-siga'), fonteDe('ons-capacidade-geracao')],
    nota: 'Posição, fonte e potência da ANEEL (SIGA). Potência fiscalizada para usina em operação; outorgada para a que ainda não opera. Modalidade de operação e subsistema vêm do ONS quando o núcleo do CEG casa; também as etapas (a potência ao longo dos anos pela data de entrada em operação de cada unidade geradora), ver etapasPorUnidade.',
  };
}

// ── 4. água: reservatórios e bacias (ONS) ────────────────────────────

/** cods de reservatório do cadastro e dos que estão no mapa (para cruzar com as séries) */
const CODS_RESERVATORIO = { cadastro: new Set(), noMapa: new Set() };

async function construirReservatorios() {
  const res = await csv('ons/RESERVATORIOS.csv');
  // o cadastro traz uma linha por USINA: reservatório que atende mais de uma usina
  // (Itaipu 50/60 Hz, Henry Borden, Paulo Afonso I-II-III) vem repetido com o mesmo
  // cod. Publica-se um ponto por reservatório, com as usinas juntas; se as linhas do
  // mesmo cod divergirem em identificador, posição ou volume, o script para
  const grupos = new Map();
  for (const r of res) {
    const k = r.cod_resplanejamento || r.res_id;
    if (!grupos.has(k)) grupos.set(k, []);
    grupos.get(k).push(r);
  }
  const feicoes = [];
  const repetidos = [];
  let semCoordenada = 0;
  const juntar = (vs) => [...new Set(vs.filter(Boolean))].join(' · ') || null;
  for (const rs of grupos.values()) {
    const r = rs[0];
    for (const o of rs.slice(1))
      for (const k of ['res_id', 'val_latitude', 'val_longitude', 'val_volutiltot', 'val_volmax'])
        if (o[k] !== r[k]) throw new Error(`RESERVATORIOS.csv: o cod ${r.cod_resplanejamento} aparece com ${k} diferente (${r[k]} / ${o[k]}); decidir antes de publicar`);
    if (rs.length > 1) repetidos.push({ cod: r.cod_resplanejamento, linhas: rs.length, usinas: rs.map((x) => limpo(x.nom_usina)) });
    if (r.cod_resplanejamento) CODS_RESERVATORIO.cadastro.add(r.cod_resplanejamento);
    const lat = num(r.val_latitude);
    const lon = num(r.val_longitude);
    if (!lat || !lon) {
      semCoordenada++;
      continue;
    }
    if (r.cod_resplanejamento) CODS_RESERVATORIO.noMapa.add(r.cod_resplanejamento);
    // ano de entrada: o cadastro data cada usina; fica o mais antigo do grupo
    const anos = rs.map((x) => (x.dat_entrada ? Number(x.dat_entrada.slice(0, 4)) : null)).filter((a) => a != null);
    feicoes.push({
      type: 'Feature',
      id: feicoes.length + 1,
      geometry: { type: 'Point', coordinates: [r4(lon), r4(lat)] },
      properties: {
        id: r.res_id || null,
        cod: r.cod_resplanejamento || null,
        n: limpo(r.nom_reservatorio),
        // uma usina, ou várias separadas por " · "
        usina: juntar(rs.map((x) => limpo(x.nom_usina))),
        ceg: juntar(rs.map((x) => x.ceg)),
        tipo: limpo(r.tip_reservatorio),
        sub: SUB_ONS[r.id_subsistema] ?? null,
        bacia: limpo(r.nom_bacia),
        rio: limpo(r.nom_rio),
        ree: limpo(r.nom_ree),
        vutil: num(r.val_volutiltot), // hm³
        vmax: num(r.val_volmax),
        op: anos.length ? Math.min(...anos) : null,
      },
    });
  }
  await gravar('agua-reservatorios.geojson', { type: 'FeatureCollection', features: feicoes });
  return {
    // linhas do cadastro (uma por usina)
    total: res.length,
    distintos: grupos.size,
    noMapa: feicoes.length,
    semCoordenadaNaFonte: semCoordenada,
    comRegularizacao: feicoes.filter((f) => (f.properties.vutil || 0) > 0).length,
    repetidosPorUsina: repetidos,
    fontes: [fonteDe('ons-reservatorio')],
  };
}

function lerZip(buf) {
  // leitor mínimo de ZIP: diretório central → entradas (deflate ou stored)
  const arquivos = {};
  let fim = buf.length - 22;
  while (fim >= 0 && buf.readUInt32LE(fim) !== 0x06054b50) fim--;
  let p = buf.readUInt32LE(fim + 16);
  const n = buf.readUInt16LE(fim + 10);
  for (let i = 0; i < n; i++) {
    const metodo = buf.readUInt16LE(p + 10);
    const tamComp = buf.readUInt32LE(p + 20);
    const lenNome = buf.readUInt16LE(p + 28);
    const lenExtra = buf.readUInt16LE(p + 30);
    const lenCom = buf.readUInt16LE(p + 32);
    const local = buf.readUInt32LE(p + 42);
    const nome = buf.toString('utf8', p + 46, p + 46 + lenNome);
    const ini = local + 30 + buf.readUInt16LE(local + 26) + buf.readUInt16LE(local + 28);
    const dado = buf.subarray(ini, ini + tamComp);
    arquivos[nome] = metodo === 0 ? dado : inflateRawSync(dado);
    p += 46 + lenNome + lenExtra + lenCom;
  }
  return arquivos;
}

/** Douglas-Peucker sobre um anel/linha em graus. */
function simplificar(pts, tol) {
  if (pts.length < 5) return pts;
  const manter = new Uint8Array(pts.length);
  manter[0] = manter[pts.length - 1] = 1;
  const pilha = [[0, pts.length - 1]];
  while (pilha.length) {
    const [a, b] = pilha.pop();
    let maior = 0;
    let idx = -1;
    const [ax, ay] = pts[a];
    const [bx, by] = pts[b];
    const dx = bx - ax;
    const dy = by - ay;
    const den = dx * dx + dy * dy || 1e-12;
    for (let i = a + 1; i < b; i++) {
      const t = Math.max(0, Math.min(1, ((pts[i][0] - ax) * dx + (pts[i][1] - ay) * dy) / den));
      const d = Math.hypot(pts[i][0] - (ax + t * dx), pts[i][1] - (ay + t * dy));
      if (d > maior) {
        maior = d;
        idx = i;
      }
    }
    if (maior > tol && idx > 0) {
      manter[idx] = 1;
      pilha.push([a, idx], [idx, b]);
    }
  }
  return pts.filter((_, i) => manter[i]);
}

async function construirBacias() {
  const TOL = 0.02; // graus (≈ 2 km): contorno de bacia em escala de país
  const zip = lerZip(await readFile(join(BRUTO, 'ons/Bacias_Hidrograficas_SIN.zip')));
  const shp = zip['Bacias_Hidrograficas_SIN.shp'];
  const dbf = zip['Bacias_Hidrograficas_SIN.dbf'];
  const cpg = (zip['Bacias_Hidrograficas_SIN.cpg'] || Buffer.from('UTF-8')).toString().trim();
  // DBF
  const nReg = dbf.readUInt32LE(4);
  const tamCab = dbf.readUInt16LE(8);
  const tamReg = dbf.readUInt16LE(10);
  const campos = [];
  for (let p = 32; dbf[p] !== 0x0d; p += 32) campos.push({ nome: dbf.toString('ascii', p, p + 11).replace(/\0.*$/, ''), tam: dbf[p + 16] });
  const dec = new TextDecoder(/utf/i.test(cpg) ? 'utf-8' : 'latin1');
  const registros = [];
  for (let i = 0; i < nReg; i++) {
    let p = tamCab + i * tamReg + 1;
    const o = {};
    for (const c of campos) {
      o[c.nome] = dec.decode(dbf.subarray(p, p + c.tam)).trim();
      p += c.tam;
    }
    registros.push(o);
  }
  // SHP (polígonos, tipo 5)
  const feicoes = [];
  let p = 100;
  let i = 0;
  let vertBruto = 0;
  let vertSaida = 0;
  while (p < shp.length) {
    const tam = shp.readUInt32BE(p + 4) * 2;
    const tipo = shp.readUInt32LE(p + 8);
    if (tipo === 5) {
      const nPartes = shp.readUInt32LE(p + 8 + 36);
      const nPts = shp.readUInt32LE(p + 8 + 40);
      const partes = [];
      for (let k = 0; k < nPartes; k++) partes.push(shp.readUInt32LE(p + 8 + 44 + k * 4));
      const base = p + 8 + 44 + nPartes * 4;
      const aneis = [];
      for (let k = 0; k < nPartes; k++) {
        const ini = partes[k];
        const fim = k + 1 < nPartes ? partes[k + 1] : nPts;
        const anel = [];
        for (let j = ini; j < fim; j++) anel.push([shp.readDoubleLE(base + j * 16), shp.readDoubleLE(base + j * 16 + 8)]);
        vertBruto += anel.length;
        const s = simplificar(anel, TOL).map(([x, y]) => [r4(x), r4(y)]);
        if (s.length >= 4) {
          aneis.push(s);
          vertSaida += s.length;
        }
      }
      // shapefile: anel horário = exterior; cada exterior abre um polígono
      const area = (a) => a.reduce((s, [x, y], j) => s + (a[(j + 1) % a.length][0] - x) * (a[(j + 1) % a.length][1] + y), 0);
      const poligonos = [];
      for (const a of aneis) {
        if (area(a) > 0 || poligonos.length === 0) poligonos.push([a]);
        else poligonos[poligonos.length - 1].push(a);
      }
      feicoes.push({ type: 'Feature', id: i + 1, geometry: { type: 'MultiPolygon', coordinates: poligonos }, properties: registros[i] });
    }
    p += 8 + tam;
    i++;
  }
  await gravar('agua-bacias.geojson', { type: 'FeatureCollection', features: feicoes });
  return {
    total: feicoes.length,
    campos: campos.map((c) => c.nome),
    verticesNaFonte: vertBruto,
    verticesNoMapa: vertSaida,
    toleranciaGraus: TOL,
    fontes: [fonteDe('ons-bacia_contorno')],
    nota: 'Contorno simplificado por Douglas-Peucker; a forma é a do shapefile do ONS (data do arquivo: 31/01/2023).',
  };
}

// ── 5. séries do ONS: água, intercâmbio, balanço ─────────────────────

/** Anos de uma série: os que o manifesto registra (o que foi baixado), sem buraco. */
function anosDe(prefixo) {
  const as = Object.keys(manifesto)
    .map((k) => k.match(new RegExp(`^${prefixo}-(\\d{4})$`))?.[1])
    .filter(Boolean)
    .map(Number)
    .sort((a, b) => a - b);
  if (!as.length) throw new Error(`${prefixo}: nenhum arquivo anual no manifesto; rode baixar.mjs`);
  for (let i = 1; i < as.length; i++) if (as[i] !== as[i - 1] + 1) throw new Error(`${prefixo}: falta o ano ${as[i - 1] + 1} no manifesto`);
  return as;
}
/** Arquivo de um ano já fechado tem de chegar a 31/12; senão a série teria buraco. */
function exigirAnoFechado(prefixo, a, anos, ultimo) {
  if (a < anos[anos.length - 1] && ultimo && ultimo.slice(0, 10) < `${a}-12-31`)
    throw new Error(`${prefixo}-${a}: o arquivo termina em ${ultimo}, antes do fim do ano; rode baixar.mjs ${prefixo} --tudo`);
}
const ultimoDiaDoMes = (aaaaMm) => {
  const [a, m] = aaaaMm.split('-').map(Number);
  return `${aaaaMm}-${String(new Date(Date.UTC(a, m, 0)).getUTCDate()).padStart(2, '0')}`;
};
/** Último mês incompleto na fonte: {mes, ultimoDia}; null se o último mês estiver completo.
 *  Série diária: completo se chega ao último dia do mês. Horária: se chega às 23h dele. */
function mesCorrenteParcial(ultimo, horaria) {
  if (!ultimo) return null;
  const mes = ultimo.slice(0, 7);
  const fim = ultimoDiaDoMes(mes);
  const completo = horaria ? ultimo >= `${fim} 23:00:00` : ultimo.slice(0, 10) >= fim;
  return completo ? null : { mes, ultimoDia: ultimo.slice(0, 10) };
}
const SUBS = ['SE', 'S', 'NE', 'N'];

async function csvSeExiste(rel) {
  try {
    return await csv(rel);
  } catch {
    return null;
  }
}

async function construirSeries() {
  // EAR por subsistema: nível no último dia de cada mês (variável de estoque)
  const earMes = new Map(); // 'AAAA-MM' → {dia, SE:{pct,mwmes,max}, ...}
  let ultimoDiaEar = null;
  const anosEar = anosDe('ons-ear-subsistema');
  for (const a of anosEar) {
    const rs = await csvSeExiste(`ons/ear/EAR_DIARIO_SUBSISTEMA_${a}.csv`);
    if (!rs) throw new Error(`EAR_DIARIO_SUBSISTEMA_${a}.csv está no manifesto e não no bruto; rode baixar.mjs`);
    exigirAnoFechado('ons-ear-subsistema', a, anosEar, rs.reduce((m, r) => (r.ear_data > m ? r.ear_data : m), ''));
    for (const r of rs) {
      const mes = r.ear_data.slice(0, 7);
      const s = r.id_subsistema.trim();
      let m = earMes.get(mes);
      if (!m) earMes.set(mes, (m = { dia: {} }));
      if (!m.dia[s] || r.ear_data >= m.dia[s]) {
        m.dia[s] = r.ear_data;
        m[s] = { pct: num(r.ear_verif_subsistema_percentual), mwmes: num(r.ear_verif_subsistema_mwmes), max: num(r.ear_max_subsistema) };
      }
      if (!ultimoDiaEar || r.ear_data > ultimoDiaEar) ultimoDiaEar = r.ear_data;
    }
  }
  const meses = [...earMes.keys()].sort();
  const parcialEar = mesCorrenteParcial(ultimoDiaEar, false);
  const ear = { meses, ultimoDia: ultimoDiaEar, mesCorrenteParcial: parcialEar, unidade: '% da energia armazenável máxima, no último dia do mês' };
  for (const s of SUBS) {
    ear[s] = meses.map((m) => earMes.get(m)[s]?.pct ?? null);
    ear[`${s}_mwmes`] = meses.map((m) => (earMes.get(m)[s] ? Math.round(earMes.get(m)[s].mwmes) : null));
    ear[`${s}_max`] = meses.map((m) => (earMes.get(m)[s] ? Math.round(earMes.get(m)[s].max) : null));
  }
  await gravar('serie-ear-subsistema.json', ear);

  // EAR por reservatório: % no último dia de cada mês
  const resMes = new Map(); // cod → {nome, bacia, sub, m: Map(mes → {dia,pct})}
  for (const a of anosDe('ons-ear-reservatorio')) {
    const rs = await csvSeExiste(`ons/ear-res/EAR_DIARIO_RESERVATORIOS_${a}.csv`);
    if (!rs) throw new Error(`EAR_DIARIO_RESERVATORIOS_${a}.csv está no manifesto e não no bruto; rode baixar.mjs`);
    for (const r of rs) {
      const cod = r.cod_resplanejamento;
      let o = resMes.get(cod);
      if (!o) resMes.set(cod, (o = { nome: limpo(r.nom_reservatorio), bacia: limpo(r.nom_bacia), sub: r.id_subsistema.trim(), m: new Map() }));
      const mes = r.ear_data.slice(0, 7);
      const at = o.m.get(mes);
      if (!at || r.ear_data >= at.dia) o.m.set(mes, { dia: r.ear_data, pct: num(r.ear_reservatorio_percentual), max: num(r.earmax_reservatorio_subsistema_proprio_mwmes) });
    }
  }
  const earRes = { meses, unidade: '% da energia armazenável do reservatório, no último dia do mês', reservatorios: {} };
  for (const [cod, o] of resMes) {
    const serie = meses.map((m) => {
      const v = o.m.get(m);
      return v && v.pct != null ? Math.round(v.pct * 10) / 10 : null;
    });
    if (serie.every((v) => v == null || v === 0)) continue; // fio d'água: sem estoque a mostrar
    earRes.reservatorios[cod] = { n: o.nome, bacia: o.bacia, sub: o.sub, pct: serie };
  }
  await gravar('serie-ear-reservatorios.json', earRes);

  // intercâmbio entre subsistemas: saldo líquido mensal (MW médios) por elo.
  // A fonte tem dois formatos. Até 2025: cada elo num sentido fixo, com sinal
  // (positivo = da origem para o destino). Em 2026: cada hora vem uma vez por
  // elo, rotulada pelo sentido em que a energia foi, sempre positiva (e há uma
  // coluna nova, de intercâmbio programado, que o Atlas não usa). Nos dois casos
  // o valor entra com sinal no sentido de referência do elo e divide-se pelo
  // número de horas do mês com registro — nunca pelas horas de um só sentido.
  // Conferido em 10/08/2026 14h: NE→N + NE→SE = 11.824,9 MW, igual ao intercâmbio
  // do Nordeste no balanço da mesma hora.
  const ELOS = [
    ['N', 'NE'],
    ['N', 'SE'],
    ['NE', 'SE'],
    ['SE', 'S'],
  ];
  const eloDe = (a, b) => {
    for (const [x, y] of ELOS) {
      if (a === x && b === y) return [`${x}>${y}`, 1];
      if (a === y && b === x) return [`${x}>${y}`, -1];
    }
    return null;
  };
  const inter = new Map(); // mes → Map(elo → [soma com sinal, horas])
  const foraDosElos = new Map();
  const anosInter = anosDe('ons-intercambio');
  let ultimoInter = null;
  for (const a of anosInter) {
    const rs = await csvSeExiste(`ons/intercambio/INTERCAMBIO_NACIONAL_${a}.csv`);
    if (!rs) throw new Error(`INTERCAMBIO_NACIONAL_${a}.csv está no manifesto e não no bruto; rode baixar.mjs`);
    exigirAnoFechado('ons-intercambio', a, anosInter, rs.reduce((m, r) => (r.din_instante > m ? r.din_instante : m), ''));
    // a média divide pelas horas: o mesmo elo duas vezes na mesma hora quebraria a premissa
    const vistos = new Set();
    for (const r of rs) {
      if (!ultimoInter || r.din_instante > ultimoInter) ultimoInter = r.din_instante;
      const v = num(r.val_intercambiomwmed);
      if (v == null) continue;
      const origem = r.id_subsistema_origem.trim();
      const destino = r.id_subsistema_destino.trim();
      const elo = eloDe(origem, destino);
      if (!elo) {
        foraDosElos.set(`${origem}>${destino}`, (foraDosElos.get(`${origem}>${destino}`) || 0) + 1);
        continue;
      }
      const chaveHora = `${elo[0]}|${r.din_instante}`;
      if (vistos.has(chaveHora)) throw new Error(`intercâmbio ${a}: o elo ${elo[0]} aparece duas vezes em ${r.din_instante}`);
      vistos.add(chaveHora);
      const mes = r.din_instante.slice(0, 7);
      let m = inter.get(mes);
      if (!m) inter.set(mes, (m = new Map()));
      const s = m.get(elo[0]) || [0, 0];
      s[0] += v * elo[1];
      s[1]++;
      m.set(elo[0], s);
    }
  }
  // par que não é nenhum dos quatro elos: a fonte mudou de formato de novo; não se cala
  if (foraDosElos.size) throw new Error(`intercâmbio: pares fora dos quatro elos conhecidos: ${[...foraDosElos].map(([k, n]) => `${k} (${n})`).join(', ')}`);
  const mesesInter = [...inter.keys()].sort();
  const pares = ELOS.map(([x, y]) => `${x}>${y}`);
  const parcialInter = mesCorrenteParcial(ultimoInter, true);
  const intercambio = { meses: mesesInter, ultimoInstante: ultimoInter, mesCorrenteParcial: parcialInter, unidade: 'MW médios no mês, saldo líquido; positivo = no sentido escrito na chave (origem>destino)', pares: {} };
  for (const par of pares)
    intercambio.pares[par] = mesesInter.map((m) => {
      const s = inter.get(m).get(par);
      return s ? Math.round(s[0] / s[1]) : null;
    });
  await gravar('serie-intercambio.json', intercambio);

  // balanço: média mensal por fonte e subsistema + perfil horário médio dos últimos 12 meses
  const CAMPOS = ['val_gerhidraulica', 'val_gertermica', 'val_gereolica', 'val_gersolar', 'val_carga', 'val_intercambio'];
  const CHAVES = ['hidro', 'termica', 'eolica', 'solar', 'carga', 'intercambio'];
  const bal = new Map(); // mes → sub → [somas..., n]
  const hora = new Map(); // mes → sub → hora → [somas..., n]
  const anosBal = anosDe('ons-balanco');
  let ultimoBal = null;
  // linha de preenchimento da fonte (carga vazia ou zero, geração "0E-8"): não é
  // hora medida; sai da média e é contada por mês e subsistema
  const descartadas = new Map();
  const iCarga = CAMPOS.indexOf('val_carga');
  for (const a of anosBal) {
    const rs = await csvSeExiste(`ons/balanco/BALANCO_ENERGIA_SUBSISTEMA_${a}.csv`);
    if (!rs) throw new Error(`BALANCO_ENERGIA_SUBSISTEMA_${a}.csv está no manifesto e não no bruto; rode baixar.mjs`);
    exigirAnoFechado('ons-balanco', a, anosBal, rs.reduce((m, r) => (r.din_instante > m ? r.din_instante : m), ''));
    for (const r of rs) {
      const s = r.id_subsistema.trim();
      if (!SUBS.includes(s)) continue;
      if (!ultimoBal || r.din_instante > ultimoBal) ultimoBal = r.din_instante;
      const mes = r.din_instante.slice(0, 7);
      const h = Number(r.din_instante.slice(11, 13));
      const vs = CAMPOS.map((c) => num(r[c]));
      if (vs[iCarga] == null || vs[iCarga] <= 0) {
        const k = `${mes} ${s}`;
        descartadas.set(k, (descartadas.get(k) || 0) + 1);
        continue;
      }
      let m = bal.get(mes);
      if (!m) bal.set(mes, (m = {}));
      const ac = (m[s] ||= new Float64Array(CAMPOS.length + 1));
      vs.forEach((v, i) => (ac[i] += v || 0));
      ac[CAMPOS.length]++;
      if (a >= anosBal[anosBal.length - 1] - 1) {
        let hm = hora.get(mes);
        if (!hm) hora.set(mes, (hm = {}));
        const hs = (hm[s] ||= Array.from({ length: 24 }, () => new Float64Array(CAMPOS.length + 1)));
        vs.forEach((v, i) => (hs[h][i] += v || 0));
        hs[h][CAMPOS.length]++;
      }
    }
  }
  const mesesBal = [...bal.keys()].sort();
  const parcialBal = mesCorrenteParcial(ultimoBal, true);
  const balanco = { meses: mesesBal, ultimoInstante: ultimoBal, mesCorrenteParcial: parcialBal, unidade: 'MW médios no mês', chaves: CHAVES, sub: {} };
  for (const s of SUBS) {
    balanco.sub[s] = {};
    CHAVES.forEach((k, i) => {
      balanco.sub[s][k] = mesesBal.map((m) => {
        const ac = bal.get(m)[s];
        return ac && ac[CAMPOS.length] ? Math.round(ac[i] / ac[CAMPOS.length]) : null;
      });
    });
  }
  await gravar('serie-balanco-mensal.json', balanco);

  // perfil horário: os 12 últimos meses COMPLETOS, decidido pelo último instante
  // do dado (não pela posição): mês que a fonte ainda não fechou fica fora
  const mesesHora = [...hora.keys()].sort();
  const completos = (parcialBal && mesesHora.at(-1) === parcialBal.mes ? mesesHora.slice(0, -1) : mesesHora).slice(-12);
  const perfil = { meses: completos, unidade: 'MW médios em cada hora do dia, média do mês', chaves: CHAVES, sub: {} };
  for (const s of SUBS) {
    perfil.sub[s] = {};
    CHAVES.forEach((k, i) => {
      perfil.sub[s][k] = completos.map((m) => hora.get(m)[s].map((ac) => (ac[CAMPOS.length] ? Math.round(ac[i] / ac[CAMPOS.length]) : null)));
    });
  }
  await gravar('serie-perfil-horario.json', perfil);

  const fonteSerie = (prefixo, rotulo, pacote) => {
    const ids = Object.keys(manifesto).filter((k) => k.startsWith(prefixo));
    const acessos = ids.map((k) => manifesto[k].acesso).sort();
    return { orgao: 'ONS', conjunto: `Dados Abertos · ${rotulo}`, pagina: `https://dados.ons.org.br/dataset/${pacote}`, licenca: 'Creative Commons Atribuição (CC-BY), declarada no portal', acesso: dia(acessos[0]), arquivos: ids.length };
  };
  // séries de reservatório × cadastro: a fonte traz séries de reservatórios que o
  // cadastro não tem (e que por isso não têm ponto no mapa); ficam no arquivo e são declaradas
  const codsSerie = Object.keys(earRes.reservatorios);
  const semCadastro = codsSerie.filter((k) => !CODS_RESERVATORIO.cadastro.has(k)).map((cod) => ({ cod, n: earRes.reservatorios[cod].n }));
  return {
    ear: { de: meses[0], ate: meses[meses.length - 1], ultimoDia: ultimoDiaEar, mesCorrenteParcial: parcialEar, fontes: [fonteSerie('ons-ear-subsistema', 'EAR Diário por Subsistema', 'ear-diario-por-subsistema')] },
    earReservatorios: {
      reservatorios: codsSerie.length,
      noMapa: codsSerie.filter((k) => CODS_RESERVATORIO.noMapa.has(k)).length,
      semCadastro,
      fontes: [fonteSerie('ons-ear-reservatorio', 'EAR Diário por Reservatório', 'ear-diario-por-reservatorio')],
    },
    intercambio: { de: mesesInter[0], ate: mesesInter[mesesInter.length - 1], ultimoInstante: ultimoInter, mesCorrenteParcial: parcialInter, pares, fontes: [fonteSerie('ons-intercambio', 'Intercâmbios entre Subsistemas', 'intercambio-nacional')] },
    balanco: {
      de: mesesBal[0],
      ate: mesesBal[mesesBal.length - 1],
      ultimoInstante: ultimoBal,
      mesCorrenteParcial: parcialBal,
      perfilHorario: completos,
      horasSemDadoNaFonte: [...descartadas].map(([k, horas]) => ({ mes: k.slice(0, 7), sub: k.slice(8), horas })),
      fontes: [fonteSerie('ons-balanco', 'Balanço de Energia nos Subsistemas', 'balanco-energia-subsistema')],
    },
  };
}

// ── 6. gás e petróleo (ANP · GeoServer) ──────────────────────────────
// Arquivos com prefixo "combustivel-". Regras: campo vazio, "--" ou "Nao Publ."
// vira null; nada é completado; coordenada fora do Brasil e da ZEE é marcada
// (fora: true), não corrigida; o índice lista incoerências e repetições.

const TOL_GASODUTO = 0.0001; // graus (≈ 11 m, o mesmo do arredondamento): bem abaixo de 1 pixel no zoom 11 (≈ 38 m/px)
const TOL_CAMPO = 0.001; // ≈ 110 m
const TOL_BLOCO = 0.002; // ≈ 220 m
const TOL_BACIA_SED = 0.01; // ≈ 1,1 km: contorno de bacia em escala de país
// caixa do território e da ZEE (inclui Trindade e Martim Vaz e o arquipélago de
// São Pedro e São Paulo); serve só para marcar coordenada absurda
const CAIXA_BR = [-75, -36, -26, 7];

const vazioAnp = (s) => {
  // a fonte traz hífen invisível (U+00AD) em alguns nomes ("Parnaí­ba")
  const v = limpo(s == null ? s : String(s).replace(/­/g, ''));
  return v == null || v === '--' || /^n[aã]o publ\.?$/i.test(v) ? null : v;
};
const slug = (s) => String(s ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
/** 'D-M-AAAA' ou 'D/M/AAAA' (dia e mês com 1 ou 2 dígitos) → 'AAAA-MM-DD'. O resto
 *  vira null e é listado: ano com 2 dígitos ('20-SEP-24') ou truncado ('21-02-202')
 *  não é completado. */
function dataAnp(s, cont) {
  const v = limpo(s);
  if (v == null) return null;
  const m = v.match(/^(\d{1,2})[-/](\d{1,2})[-/](\d{4})$/);
  if (!m || Number(m[2]) > 12 || Number(m[1]) > 31) {
    cont.push(v);
    return null;
  }
  return `${m[3]}-${m[2].padStart(2, '0')}-${m[1].padStart(2, '0')}`;
}
const haversineKm = (a, b) => {
  const r = Math.PI / 180;
  const h = Math.sin(((b[1] - a[1]) * r) / 2) ** 2 + Math.cos(a[1] * r) * Math.cos(b[1] * r) * Math.sin(((b[0] - a[0]) * r) / 2) ** 2;
  return 2 * 6371.0088 * Math.asin(Math.sqrt(h));
};
const pontosDe = (g) => (g.type === 'Point' ? [g.coordinates] : g.type === 'LineString' || g.type === 'MultiPoint' ? g.coordinates : g.type === 'MultiLineString' || g.type === 'Polygon' ? g.coordinates.flat() : g.coordinates.flat(2));
const foraDoBrasil = (g) => pontosDe(g).some(([x, y]) => x < CAIXA_BR[0] || y < CAIXA_BR[1] || x > CAIXA_BR[2] || y > CAIXA_BR[3]);
/** arredonda a 4 casas e tira vértice repetido em sequência (o arredondamento cria) */
const r4linha = (l) => l.map(([x, y]) => [r4(x), r4(y)]).filter((p, i, a) => i === 0 || p[0] !== a[i - 1][0] || p[1] !== a[i - 1][1]);

/** Simplifica linha ou polígono; nunca deixa um anel com menos de 4 vértices
 *  (se a simplificação colapsar o anel, fica o anel original arredondado). */
function simplificarGeometria(g, tol, conta) {
  const linha = (l) => {
    conta.antes += l.length;
    let s = r4linha(simplificar(l, tol));
    if (s.length < 2) s = r4linha(l);
    conta.depois += s.length;
    return s;
  };
  const anel = (a) => {
    conta.antes += a.length;
    let s = r4linha(simplificar(a, tol));
    if (s.length < 4) {
      s = r4linha(a);
      conta.aneisPreservados++;
    }
    conta.depois += s.length;
    return s;
  };
  switch (g.type) {
    case 'LineString':
      return { type: g.type, coordinates: linha(g.coordinates) };
    case 'MultiLineString':
      return { type: g.type, coordinates: g.coordinates.map(linha) };
    case 'Polygon':
      return { type: g.type, coordinates: g.coordinates.map(anel) };
    case 'MultiPolygon':
      return { type: g.type, coordinates: g.coordinates.map((p) => p.map(anel)) };
    default:
      throw new Error(`geometria inesperada: ${g.type}`);
  }
}
const novaConta = () => ({ antes: 0, depois: 0, aneisPreservados: 0 });

/** ids estáveis: o mesmo nome dá o mesmo id em toda reconstrução; colisão vira -2, -3 */
function idsUnicos() {
  const vistos = new Map();
  return (base) => {
    const n = (vistos.get(base) || 0) + 1;
    vistos.set(base, n);
    return n === 1 ? base : `${base}-${n}`;
  };
}

async function construirCombustivel() {
  const ler = async (nome) => {
    const j = JSON.parse(await lerTexto(`anp/${nome}.geojson`));
    return j.features;
  };
  const incoerencias = [];
  const repetidas = [];
  const fora = [];
  const datasIlegiveis = [];
  const marcarFora = (props, g, rotulo) => {
    if (!foraDoBrasil(g)) return props;
    fora.push(rotulo);
    return { ...props, fora: true };
  };

  // ── gasodutos de transporte ──
  const gd = await ler('gasodutos-transporte');
  const contaGd = novaConta();
  const idGd = idsUnicos();
  const feicoesGd = [];
  let kmDeclarado = 0;
  let kmTraco = 0;
  const semExtensao = [];
  const assinaturas = new Map();
  for (const f of gd) {
    const p = f.properties;
    if (!f.geometry) {
      incoerencias.push({ camada: 'gasodutos', item: `${p.DUTO} / ${p.TRECHO}`, problema: 'sem geometria na fonte (fora do mapa)' });
      continue;
    }
    const linhas = f.geometry.type === 'LineString' ? [f.geometry.coordinates] : f.geometry.coordinates;
    let km = 0;
    for (const l of linhas) for (let i = 1; i < l.length; i++) km += haversineKm(l[i - 1], l[i]);
    const decl = num(vazioAnp(p.EXTENS_KM));
    if (decl == null) semExtensao.push(`${limpo(p.DUTO)} / ${limpo(p.TRECHO)}`);
    else kmDeclarado += decl;
    kmTraco += km;
    if (decl != null && Math.abs(km - decl) / decl > 0.25)
      incoerencias.push({ camada: 'gasodutos', item: `${limpo(p.DUTO)} / ${limpo(p.TRECHO)}`, problema: `extensão declarada ${decl} km, traçado mede ${km.toFixed(1)} km` });
    const assin = JSON.stringify([p.DUTO, p.TRECHO, p.INST_ORIGEM, p.INST_DEST]);
    if (assinaturas.has(assin))
      repetidas.push({
        camada: 'gasodutos',
        item: `${limpo(p.DUTO)} / ${limpo(p.TRECHO)}`,
        problema: `duas feições com o mesmo duto, trecho, origem e destino, mas extensão declarada (${assinaturas.get(assin)} e ${decl} km) e traçado diferentes; a fonte não diz se são dutos paralelos ou registro repetido. As duas são publicadas e somadas.`,
      });
    assinaturas.set(assin, decl);
    const props = {
      id: idGd(`gd-${slug(p.DUTO)}--${slug(p.TRECHO)}`),
      duto: limpo(p.DUTO),
      trecho: vazioAnp(p.TRECHO),
      diam: num(vazioAnp(p.DIAM_POL)),
      km: decl,
      kmTraco: Math.round(km * 10) / 10,
      orig: vazioAnp(p.INST_ORIGEM),
      dest: vazioAnp(p.INST_DEST),
      munOrig: vazioAnp(p.MUN_ORIG),
      munDest: vazioAnp(p.MUN_DEST),
      prop: vazioAnp(p.PROPRIET),
      oper: vazioAnp(p.OPERADOR),
      fluido: vazioAnp(p.FLUIDO),
    };
    feicoesGd.push({ type: 'Feature', id: feicoesGd.length + 1, geometry: simplificarGeometria(f.geometry, TOL_GASODUTO, contaGd), properties: marcarFora(props, f.geometry, `gasoduto ${props.id}`) });
  }
  await gravar('combustivel-gasodutos.geojson', { type: 'FeatureCollection', features: feicoesGd });
  const contar = (xs, k) => xs.reduce((o, x) => ((o[x.properties[k] ?? 'sem dado na fonte'] = (o[x.properties[k] ?? 'sem dado na fonte'] || 0) + 1), o), {});

  // ── instalações (pontos) ──
  const inst = [];
  const idInst = idsUnicos();
  const empurraPonto = (f, tipo, props, ufs) => {
    const [lon, lat] = f.geometry.coordinates;
    const id = idInst(props.id);
    // casas decimais significativas da posição na fonte (0 a 4; 4 = 4 ou mais)
    props = { ...props, prec: precisao(lon, lat) };
    const sm = submercadoIncoerente(lon, lat, ufs.filter(Boolean));
    if (sm) incoerencias.push({ camada: tipo, item: `${props.nome} (${ufs.join('/')})`, problema: `coordenada cai no submercado ${sm}, longe do estado declarado` });
    const dup = inst.find((x) => x.properties.tipo === tipo && x.geometry.coordinates[0] === r4(lon) && x.geometry.coordinates[1] === r4(lat));
    if (dup) repetidas.push({ camada: tipo, item: props.nome, problema: `mesmo ponto que ${dup.properties.nome}` });
    inst.push({ type: 'Feature', id: inst.length + 1, geometry: { type: 'Point', coordinates: [r4(lon), r4(lat)] }, properties: marcarFora({ ...props, id, tipo }, f.geometry, `${tipo} ${id}`) });
  };
  const semGeom = (f, camada, nome) => {
    if (f.geometry && f.geometry.type === 'Point') return false;
    incoerencias.push({ camada, item: nome, problema: 'sem ponto na fonte (fora do mapa)' });
    return true;
  };

  // refinarias: a fonte traz, além da geometria, LAT e LONG em grau:min:seg; confere as duas
  const dms = (s) => {
    const m = String(s ?? '').match(/^(-?)(\d+):(\d+):([\d,.]+)$/);
    if (!m) return null;
    const v = Number(m[2]) + Number(m[3]) / 60 + Number(m[4].replace(',', '.')) / 3600;
    return m[1] ? -v : v;
  };
  const refinarias = await ler('refinarias');
  const razoes = [];
  for (const f of refinarias) {
    const p = f.properties;
    const nome = limpo(p.NOME);
    if (semGeom(f, 'refinaria', nome)) continue;
    const [lon, lat] = f.geometry.coordinates;
    const dLat = dms(p.LAT);
    const dLon = dms(p.LONG);
    if (dLat != null && dLon != null && Math.hypot(dLat - lat, dLon - lon) > 0.001)
      incoerencias.push({ camada: 'refinaria', item: nome, problema: `geometria (${lon}, ${lat}) difere do LAT/LONG declarado (${dLon.toFixed(4)}, ${dLat.toFixed(4)})` });
    const bpd = typeof p.CAPAC_BPD === 'number' ? p.CAPAC_BPD : num(vazioAnp(p.CAPAC_BPD));
    const m3d = typeof p.CAPAC_M3 === 'number' ? p.CAPAC_M3 : num(vazioAnp(p.CAPAC_M3));
    if (bpd != null && m3d) razoes.push(bpd / m3d);
    empurraPonto(f, 'refinaria', {
      id: `refinaria-${slug(p.SIGLA || p.NOME)}`,
      nome,
      sigla: vazioAnp(p.SIGLA),
      mun: vazioAnp(p.MUNICIPIO),
      uf: vazioAnp(p.UF),
      emp: vazioAnp(p.EMPRESA),
      aut: vazioAnp(p.AUT_OP),
      autFonte: vazioAnp(p.FONTE),
      bpd,
      m3d,
    }, [vazioAnp(p.UF)]);
  }

  const gnl = await ler('terminais-gnl');
  for (const f of gnl) {
    const p = f.properties;
    const nome = limpo(p.NOME);
    if (semGeom(f, 'gnl', nome)) continue;
    empurraPonto(f, 'gnl', {
      id: `gnl-${slug(nome)}`,
      nome,
      mun: vazioAnp(p.MUNICIPIO),
      uf: vazioAnp(p.UF),
      emp: vazioAnp(p.RAZAO_SOCI),
      aut: vazioAnp(p.AUTORIZACA),
      sit: vazioAnp(p.SITUACAO_A),
      // unidade NÃO declarada na fonte: publica-se o número com unidade nula
      cap: typeof p.CAPACIDADE === 'number' ? p.CAPACIDADE : num(vazioAnp(p.CAPACIDADE)),
    }, [vazioAnp(p.UF)]);
  }

  const upgn = await ler('upgn');
  for (const f of upgn) {
    const p = f.properties;
    const nome = limpo(p.NOME);
    if (semGeom(f, 'upgn', nome)) continue;
    empurraPonto(f, 'upgn', {
      id: `upgn-${slug(nome)}`,
      nome,
      sub: vazioAnp(p.TIPO),
      mun: vazioAnp(p.MUNICIPIO),
      uf: vazioAnp(p.ESTADO),
      aut: vazioAnp(p.TITULARIDA),
      autFonte: vazioAnp(p.FONTE),
    }, [vazioAnp(p.ESTADO)]);
  }

  const liq = await ler('terminais-liquidos');
  const sitNormal = (s) => (s == null ? null : /^autorizada opera[cç][aã]o$/i.test(s) ? 'Autorizada operação' : s);
  for (const f of liq) {
    const p = f.properties;
    const nome = limpo(p.NOME);
    if (semGeom(f, 'terminal', nome)) continue;
    empurraPonto(f, 'terminal', {
      id: p.SIMP != null ? `terminal-${p.SIMP}` : `terminal-${slug(nome)}`,
      nome,
      simp: p.SIMP ?? null,
      mun: vazioAnp(p.MUNICIPIO),
      uf: vazioAnp(p.UF),
      emp: vazioAnp(p.RAZAO_SOCI),
      aut: vazioAnp(p.AUTORIZACA),
      sit: sitNormal(vazioAnp(p.SITUACAO_A)),
    }, [vazioAnp(p.UF)]);
  }
  await gravar('combustivel-instalacoes.geojson', { type: 'FeatureCollection', features: inst });
  const doTipo = (t) => inst.filter((x) => x.properties.tipo === t);
  const somaDe = (xs, k) => xs.reduce((a, x) => a + (x.properties[k] ?? 0), 0);

  // ── campos de produção ──
  const campos = await ler('campos-producao');
  const contaCampo = novaConta();
  const idCampo = idsUnicos();
  const fluidoCampo = (s) => {
    const v = vazioAnp(s);
    if (v == null) return null;
    const k = slug(v);
    return k === 'oleo' ? 'oleo' : k === 'gas' ? 'gas' : k === 'outros' ? 'outros' : null;
  };
  const fluidosIlegiveis = new Set();
  const feicoesCampo = [];
  for (const f of campos) {
    const p = f.properties;
    const nome = limpo(p.NOM_CAMPO);
    if (!f.geometry) {
      incoerencias.push({ camada: 'campos', item: nome, problema: 'sem polígono na fonte (fora do mapa)' });
      continue;
    }
    const fl = fluidoCampo(p.FLUIDO_PRI);
    if (fl == null && vazioAnp(p.FLUIDO_PRI) != null) fluidosIlegiveis.add(vazioAnp(p.FLUIDO_PRI));
    const props = {
      id: idCampo(p.COD_CAMPO != null ? `campo-${p.COD_CAMPO}` : `campo-${slug(nome)}`),
      cod: p.COD_CAMPO ?? null,
      nome,
      sigla: vazioAnp(p.SIG_CAMPO),
      bacia: vazioAnp(p.NOM_BACIA),
      oper: vazioAnp(p.OPERADOR_C),
      etapa: vazioAnp(p.ETAPA),
      fluido: fl,
      amb: vazioAnp(p.AMBIENTE),
      rodada: vazioAnp(p.NUM_RODADA),
      contrato: vazioAnp(p.NUM_CONTRA),
      assinatura: dataAnp(p.DAT_ASSINA, datasIlegiveis),
      descoberta: dataAnp(p.DAT_DESCOB, datasIlegiveis),
      inicio: dataAnp(p.DAT_INICIO, datasIlegiveis),
      termino: dataAnp(p.DAT_TERMIN, datasIlegiveis),
      area: typeof p.AREA === 'number' ? p.AREA : null,
      lamina: typeof p.MED_LAMINA === 'number' ? p.MED_LAMINA : null,
    };
    feicoesCampo.push({ type: 'Feature', id: feicoesCampo.length + 1, geometry: simplificarGeometria(f.geometry, TOL_CAMPO, contaCampo), properties: marcarFora(props, f.geometry, `campo ${props.id}`) });
  }
  await gravar('combustivel-campos.geojson', { type: 'FeatureCollection', features: feicoesCampo });

  // ── blocos exploratórios sob contrato ──
  const blocos = await ler('blocos-exploratorios');
  const contaBloco = novaConta();
  const idBloco = idsUnicos();
  const feicoesBloco = [];
  for (const f of blocos) {
    const p = f.properties;
    const nome = limpo(p.NOM_BLOCO);
    if (!f.geometry) {
      incoerencias.push({ camada: 'blocos', item: nome, problema: 'sem polígono na fonte (fora do mapa)' });
      continue;
    }
    const props = {
      id: idBloco(`bloco-${slug(p.COD_BLOCO || nome)}`),
      cod: vazioAnp(p.COD_BLOCO),
      nome,
      fantasia: vazioAnp(p.NOM_FANTAS),
      nomeAlt: vazioAnp(p.BLOCOS),
      bacia: vazioAnp(p.NOM_BACIA),
      oper: vazioAnp(p.OPERADOR_C),
      rodada: vazioAnp(p.RODADA),
      fase: vazioAnp(p.COD_FASE_C),
      amb: vazioAnp(p.AMBIENTE),
      contrato: vazioAnp(p.NUM_CONTRA),
      assinatura: dataAnp(p.DAT_ASSINA, datasIlegiveis),
      termino: dataAnp(p.DAT_TERMIN, datasIlegiveis),
      descobertas: typeof p.NUM_DESCOB === 'number' ? p.NUM_DESCOB : null,
      area: typeof p.AREA_TOTAL === 'number' ? p.AREA_TOTAL : null,
    };
    feicoesBloco.push({ type: 'Feature', id: feicoesBloco.length + 1, geometry: simplificarGeometria(f.geometry, TOL_BLOCO, contaBloco), properties: marcarFora(props, f.geometry, `bloco ${props.id}`) });
  }
  await gravar('combustivel-blocos.geojson', { type: 'FeatureCollection', features: feicoesBloco });

  // ── bacias sedimentares ──
  const bacias = await ler('bacias-sedimentares');
  const contaBacia = novaConta();
  const idBacia = idsUnicos();
  const feicoesBacia = [];
  for (const f of bacias) {
    const p = f.properties;
    const nome = limpo(p.NOME_BACIA);
    if (!f.geometry) {
      incoerencias.push({ camada: 'bacias-sedimentares', item: nome, problema: 'sem polígono na fonte (fora do mapa)' });
      continue;
    }
    const sit = vazioAnp(p.SITUACAO);
    const props = {
      id: idBacia(`bacia-sed-${slug(nome)}`),
      nome,
      sit: sit == null ? null : slug(sit) === 'terrestre' ? 'terrestre' : slug(sit) === 'maritima' ? 'maritima' : null,
      km2: typeof p.AREA_KM2 === 'number' ? Math.round(p.AREA_KM2 * 10) / 10 : null,
    };
    feicoesBacia.push({ type: 'Feature', id: feicoesBacia.length + 1, geometry: simplificarGeometria(f.geometry, TOL_BACIA_SED, contaBacia), properties: marcarFora(props, f.geometry, `bacia ${props.id}`) });
  }
  await gravar('combustivel-bacias.geojson', { type: 'FeatureCollection', features: feicoesBacia });

  // ── polígono do pré-sal (a área definida em lei, como a ANP desenha) ──
  const presal = await ler('presal');
  const contaPresal = novaConta();
  const feicoesPresal = presal.filter((f) => f.geometry).map((f, i) => ({ type: 'Feature', id: i + 1, geometry: simplificarGeometria(f.geometry, 0, contaPresal), properties: marcarFora({ id: 'presal' }, f.geometry, 'presal') }));
  await gravar('combustivel-presal.geojson', { type: 'FeatureCollection', features: feicoesPresal });

  // ── índice ──
  const refs = doTipo('refinaria');
  const gnls = doTipo('gnl');
  const fontes = (...ids) => ids.map((id) => ({ ...fonteDe(id), camada: manifesto[id].camada ?? null }));
  const razaoMin = Math.min(...razoes);
  const razaoMax = Math.max(...razoes);
  return {
    acesso: dia(manifesto['anp-gasodutos-transporte'].acesso),
    licenca: manifesto['anp-gasodutos-transporte'].licenca,
    capacidadesDoServico: fonteDe('anp-wfs-capacidades'),
    gasodutos: {
      trechos: feicoesGd.length,
      dutos: new Set(feicoesGd.map((x) => x.properties.duto)).size,
      kmDeclarado: Math.round(kmDeclarado * 10) / 10,
      kmTraco: Math.round(kmTraco * 10) / 10,
      trechosSemExtensaoDeclarada: semExtensao,
      verticesNaFonte: contaGd.antes,
      verticesNoMapa: contaGd.depois,
      toleranciaGraus: TOL_GASODUTO,
      porOperador: contar(feicoesGd, 'oper'),
      porFluido: contar(feicoesGd, 'fluido'),
      fontes: fontes('anp-gasodutos-transporte'),
      nota: 'Gasodutos de TRANSPORTE (a malha que liga produção, UPGN, terminais e city gates). A camada não traz gasodutos de escoamento da produção nem de distribuição. km é a extensão declarada pela ANP por trecho; kmTraco é medida no traçado da fonte (geodésica, antes da simplificação). Traçado simplificado por Douglas-Peucker.',
    },
    instalacoes: {
      total: inst.length,
      porTipo: contar(inst, 'tipo'),
      precisaoPorCasas: [0, 1, 2, 3, 4].reduce((o, k) => ((o[k] = inst.filter((f) => f.properties.prec === k).length), o), {}),
      refino: {
        refinarias: refs.length,
        semCapacidadeNaFonte: refs.filter((x) => x.properties.bpd == null).map((x) => x.properties.nome),
        bpdTotal: somaDe(refs, 'bpd'),
        m3dTotal: somaDe(refs, 'm3d'),
        unidades: { bpd: 'bbl/d', m3d: 'm³/d' },
        razaoBpdPorM3: [Math.round(razaoMin * 1e4) / 1e4, Math.round(razaoMax * 1e4) / 1e4],
        nota: 'A fonte não publica dicionário de dados. CAPAC_BPD declara a unidade no próprio nome do campo (barris por dia). CAPAC_M3 não declara período; em todas as refinarias com os dois campos, CAPAC_BPD / CAPAC_M3 fica entre os valores de razaoBpdPorM3 (1 m³ = 6,2898 barris), ou seja, é a mesma capacidade diária em m³/d.',
      },
      gnl: {
        terminais: gnls.length,
        comCapacidade: gnls.filter((x) => x.properties.cap != null).length,
        capacidadeUnidade: null,
        nota: 'O campo CAPACIDADE dos terminais de GNL não declara unidade, e a ANP não publica dicionário da camada. O número é publicado como está (cap), com unidade nula: a interface deve mostrá-lo com a ressalva "unidade não declarada na fonte" ou omiti-lo.',
      },
      fontes: fontes('anp-refinarias', 'anp-terminais-gnl', 'anp-upgn', 'anp-terminais-liquidos'),
    },
    campos: {
      total: feicoesCampo.length,
      porEtapa: contar(feicoesCampo, 'etapa'),
      porFluido: contar(feicoesCampo, 'fluido'),
      porAmbiente: contar(feicoesCampo, 'amb'),
      fluidosIlegiveis: [...fluidosIlegiveis],
      verticesNaFonte: contaCampo.antes,
      verticesNoMapa: contaCampo.depois,
      aneisPreservadosSemSimplificar: contaCampo.aneisPreservados,
      toleranciaGraus: TOL_CAMPO,
      fontes: fontes('anp-campos-producao'),
    },
    blocos: {
      total: feicoesBloco.length,
      porAmbiente: contar(feicoesBloco, 'amb'),
      porBacia: contar(feicoesBloco, 'bacia'),
      verticesNaFonte: contaBloco.antes,
      verticesNoMapa: contaBloco.depois,
      toleranciaGraus: TOL_BLOCO,
      fontes: fontes('anp-blocos-exploratorios'),
    },
    baciasSedimentares: {
      total: feicoesBacia.length,
      porSituacao: contar(feicoesBacia, 'sit'),
      verticesNaFonte: contaBacia.antes,
      verticesNoMapa: contaBacia.depois,
      toleranciaGraus: TOL_BACIA_SED,
      fontes: fontes('anp-bacias-sedimentares'),
    },
    presal: { total: feicoesPresal.length, vertices: contaPresal.depois, fontes: fontes('anp-presal') },
    ausencias: [
      'Oleodutos, gasodutos de escoamento da produção e redes de distribuição de gás: o GeoServer da ANP não publica essas camadas (medido no GetCapabilities em 15/11/2026).',
      'Pontos de entrega (city gates) e estações de compressão: não há camada própria; aparecem só como texto nos campos de origem e destino dos gasodutos.',
      'Capacidade dos gasodutos (vazão) e pressão: a camada não traz.',
      'Unidade da capacidade dos terminais de GNL: não declarada na fonte (cap publicado com unidade nula).',
      'Capacidade das UPGN e dos terminais de líquidos: a camada não traz.',
      'Data de referência das camadas: nenhuma traz campo de data do dado; vale a data da consulta (acesso).',
      'Unidade dos campos AREA e MED_LAMINA (campos de produção) e AREA_TOTAL (blocos): não declarada na fonte.',
      'Significado dos campos PAC_DIESEL, PAC_CONV, PAC_GASOLINA e PAC_HBIO das refinarias: não declarado na fonte; não publicados.',
      'Produção de cada campo: está em outra base da ANP (painel de produção), não nesta camada.',
      'Áreas de concessão de distribuição de energia elétrica: não são da ANP (são da ANEEL/SIGEL), e o GeoServer da ANP não tem camada desse tipo.',
    ],
    incoerencias,
    repetidas,
    foraDoBrasilOuZee: fora,
    datasIlegiveis: [...new Set(datasIlegiveis)],
  };
}

// ── 7. áreas de atuação das distribuidoras (ANEEL · BDGD · ARAT) ─────
// O GeoJSON NÃO é construído aqui: vem de tools/alexandria-atlas/concessoes/
// (Python + GDAL, ver o README de lá) e já está publicado. Esta etapa só o lê,
// confere e registra no índice. Se o arquivo não existir, o índice declara a
// ausência e o resto do build segue.

const ARQ_DISTRIBUICAO = 'distribuicao-areas.geojson';
// do relatório de construir_areas.py (bruto/concessoes/relatorio.json, ignorado pelo git)
const TOL_DISTRIBUICAO = 0.003; // graus (≈ 300 m)
// Códigos da BDGD que ficaram de fora, como o relatório de construir_areas.py os
// registra (fração = parte da área antiga coberta pela sucessora de mesma outorga).
const DISTRIBUIDORAS_SUCEDIDAS = [
  { codigo: 70, nome: 'CPFL Mococa', dataBase: '2017-12-31', por: 69, fracao: 0.9544 },
  { codigo: 71, nome: 'CPFL Leste Paulista', dataBase: '2017-12-31', por: 69, fracao: 0.9762 },
  { codigo: 72, nome: 'CPFL Santa Cruz (BDGD antiga)', dataBase: '2017-12-31', por: 69, fracao: 0.9888 },
  { codigo: 73, nome: 'CPFL Sul Paulista', dataBase: '2017-12-31', por: 69, fracao: 0.9878 },
  { codigo: 397, nome: 'RGE Sul', dataBase: '2018-12-31', por: 396, fracao: 0.9859 },
  { codigo: 6611, nome: 'Energisa Borborema', dataBase: '2022-12-31', por: 6600, fracao: 1 },
  { codigo: 6612, nome: 'Energisa Nova Friburgo', dataBase: '2022-12-31', por: 6585, fracao: 0.8738 },
  { codigo: 6896, nome: 'Cejama (BDGD antiga)', dataBase: '2017-12-31', por: 5372, fracao: 1 },
];
// BDGD de 2016 (Módulo 6) sem camada ARAT; nenhuma tem BDGD posterior. A sucessão
// não tem prova geométrica e nada delas é publicado.
const DISTRIBUIDORAS_SEM_ARAT = [
  { codigo: 84, nome: 'CFLO' },
  { codigo: 75, nome: 'CNEE' },
  { codigo: 5217, nome: 'EDEVP' },
  { codigo: 386, nome: 'EEB' },
];

async function construirDistribuicao() {
  let texto;
  try {
    texto = await readFile(join(SAIDA, ARQ_DISTRIBUICAO), 'utf8');
  } catch {
    console.log(`${ARQ_DISTRIBUICAO.padEnd(34)} AUSENTE (gere com tools/alexandria-atlas/concessoes/)`);
    return { ausente: true, arquivo: ARQ_DISTRIBUICAO, motivo: 'arquivo não publicado nesta árvore; gerado por tools/alexandria-atlas/concessoes/construir_areas.py' };
  }
  const j = JSON.parse(texto);
  const feicoes = j.features ?? [];
  const CAMPOS = ['codigo', 'nome', 'tipo', 'contrato', 'codArat', 'dataBase', 'item'];
  const problemas = [];
  if (feicoes.length !== 102) problemas.push(`${feicoes.length} feições (esperadas 102)`);
  const codigos = new Set();
  let vertices = 0;
  for (const f of feicoes) {
    const p = f.properties ?? {};
    for (const k of CAMPOS) if (!(k in p) || p[k] == null || p[k] === '') problemas.push(`feição ${p.codigo ?? '?'} sem ${k}`);
    if (!f.geometry || !['Polygon', 'MultiPolygon'].includes(f.geometry.type)) problemas.push(`feição ${p.codigo} com geometria ${f.geometry?.type ?? 'nula'}`);
    else vertices += pontosDe(f.geometry).length;
    if (!['concessionária', 'permissionária'].includes(p.tipo)) problemas.push(`feição ${p.codigo} com tipo "${p.tipo}"`);
    if (codigos.has(p.codigo)) problemas.push(`código ${p.codigo} repetido`);
    codigos.add(p.codigo);
  }
  if (problemas.length) throw new Error(`${ARQ_DISTRIBUICAO} não confere: ${problemas.slice(0, 10).join('; ')}`);
  for (const x of [...DISTRIBUIDORAS_SUCEDIDAS, ...DISTRIBUIDORAS_SEM_ARAT])
    if (codigos.has(x.codigo)) throw new Error(`${ARQ_DISTRIBUICAO}: código ${x.codigo} (${x.nome}) consta como fora, mas está no arquivo`);
  for (const x of DISTRIBUIDORAS_SUCEDIDAS)
    if (!codigos.has(x.por)) throw new Error(`${ARQ_DISTRIBUICAO}: sucessora ${x.por} de ${x.nome} não está no arquivo`);

  const bytes = Buffer.byteLength(texto);
  const sha256 = createHash('sha256').update(texto).digest('hex');
  // conferência com o relatório do bruto, quando ele existe nesta máquina
  try {
    const rel = JSON.parse(await lerTexto('concessoes/relatorio.json'));
    if (rel.sha256Saida !== sha256 || rel.bytes !== bytes || rel.ativos !== feicoes.length || rel.tolerancia !== TOL_DISTRIBUICAO)
      console.log(`aviso: ${ARQ_DISTRIBUICAO} difere de bruto/concessoes/relatorio.json (sha256, bytes, feições ou tolerância)`);
    const suc = Object.keys(rel.sucedidos ?? {}).map(Number).sort((a, b) => a - b);
    const nossos = DISTRIBUIDORAS_SUCEDIDAS.map((x) => x.codigo).sort((a, b) => a - b);
    if (JSON.stringify(suc) !== JSON.stringify(nossos)) console.log('aviso: a lista de sucedidas difere de bruto/concessoes/relatorio.json');
  } catch {
    // bruto ausente: vale o arquivo publicado
  }

  const nomeDe = new Map(feicoes.map((f) => [f.properties.codigo, f.properties.nome]));
  const porDataBase = {};
  for (const f of feicoes) porDataBase[f.properties.dataBase] = (porDataBase[f.properties.dataBase] || 0) + 1;
  gravados[ARQ_DISTRIBUICAO] = { bytes, sha256: sha256.slice(0, 16) };
  console.log(`${ARQ_DISTRIBUICAO.padEnd(34)} ${(bytes / 1024).toFixed(0).padStart(6)} KB (lido, não reconstruído)`);
  const m = manifesto['aneel-bdgd-arat'];
  return {
    arquivo: ARQ_DISTRIBUICAO,
    total: feicoes.length,
    concessionarias: feicoes.filter((f) => f.properties.tipo === 'concessionária').length,
    permissionarias: feicoes.filter((f) => f.properties.tipo === 'permissionária').length,
    porDataBase,
    vertices,
    toleranciaGraus: TOL_DISTRIBUICAO,
    bytes,
    sha256,
    fonte: { ...fonteDe('aneel-bdgd-arat'), urls: m.url, camada: m.camada },
    nota: 'Área de atuação declarada pela própria distribuidora na BDGD (camada ARAT), não o ato de outorga. Permissionárias (cooperativas) se sobrepõem às concessionárias: é o dado, não erro; o arquivo vem da maior área para a menor, para a permissionária ser desenhada por cima. Geometria simplificada com tolerância de 0,003° (≈ 300 m), coordenadas com 4 casas. Tipo e número do contrato vêm do COD_ID da própria ARAT; a UF do COD_ID não é publicada porque contradiz o polígono em ao menos dois casos (Cernhe 6609 e Cerci 5279). Cada distribuidora vem da BDGD de data-base mais recente.',
    fora: {
      sucedidas: DISTRIBUIDORAS_SUCEDIDAS.map((x) => ({ ...x, sucessora: nomeDe.get(x.por) })),
      semCamadaArat: DISTRIBUIDORAS_SEM_ARAT.map((x) => ({ ...x, dataBase: '2016' })),
      nota: `${DISTRIBUIDORAS_SUCEDIDAS.length + DISTRIBUIDORAS_SEM_ARAT.length} códigos da BDGD fora: ${DISTRIBUIDORAS_SUCEDIDAS.length} sucedidos por fusão (BDGD antiga coberta em 85% ou mais por distribuidora de mesma outorga com BDGD mais nova) e ${DISTRIBUIDORAS_SEM_ARAT.length} com BDGD de 2016 sem camada ARAT (sucessão presumida, sem prova geométrica; nada publicado).`,
    },
    ausencias: [
      `Área de atuação de ${DISTRIBUIDORAS_SEM_ARAT.map((x) => `${x.nome} (${x.codigo})`).join(', ')}: a BDGD delas é de 2016 e não tem camada ARAT.`,
      'UF e sigla da distribuidora: a UF do COD_ID contradiz o polígono em ao menos dois casos, e a sigla não existe na fonte (campo DESCR vazio na maioria).',
      'Área em km²: não publicada.',
      'Ato de outorga (o polígono do contrato): não é este dado; a ARAT é a área declarada pela distribuidora.',
    ],
  };
}

// ── principal ────────────────────────────────────────────────────────

async function construirSubmercados() {
  const { fc, conferencias, entradaEmOperacao, ibge } = SUBMERCADOS_DO_ATLAS;
  await gravar('submercados.geojson', fc);
  return {
    arquivo: 'submercados.geojson',
    total: fc.features.length,
    ufsIbge: Object.fromEntries(fc.features.map((f) => [f.properties.id, f.properties.ufsIbge])),
    roraimaNoNorteDesde: entradaEmOperacao,
    roraimaAParte: (({ roraima, norteSemRoraima, ...resto }) => ({
      ...resto,
      membro: 'roraimaAParte (fora de features)',
      verticesDoAnelDeRoraima: roraima.coordinates[0].length,
      poligonosDoNorteSemRoraima: norteSemRoraima.coordinates.length,
    }))(fc.roraimaAParte),
    conferencias,
    fontes: [{ orgao: 'IBGE', conjunto: 'API de malhas territoriais v3 (qualidade mínima), pelos arquivos public/br/submercados.geojson e public/br/brasil-outline.geojson do Portal BR', pagina: fc.provenance.arquivosDeOrigem[0].url }, fonteDe('ibge-rr-uf-2024'), fonteDe('ons-subestacao'), fonteDe('ons-capacidade-geracao'), fonteDe('ons-linha-transmissao')],
    declaracoes: fc.provenance.fontesDaClassificacao.filter((x) => x.pagina),
    nota: `Arquivo próprio do Atlas: os submercados do Portal BR com Roraima no Norte. Roraima entrou no Norte em setembro de 2025, pela linha de 500 kV Manaus – Boa Vista (entrada em operação em ${entradaEmOperacao.split('-').reverse().join('/')} no cadastro do ONS; o MME dá 10/09/2025 como início da energização). As séries do ONS mostram o Norte inteiro: os números do Norte incluem Roraima desde a interligação, sem separar o estado. Área oficial de RR para a conferência: ${ibge.conjunto}.`,
  };
}

const indice = { gerado: new Date().toISOString().slice(0, 10), camadas: {} };
indice.camadas.submercados = await construirSubmercados();
indice.camadas.linhas = await construirLinhas();
indice.camadas.subestacoes = await construirSubestacoes();
indice.camadas.usinas = await construirUsinas();
indice.camadas.reservatorios = await construirReservatorios();
indice.camadas.bacias = await construirBacias();
indice.series = await construirSeries();
{
  const series = (await JSON.parse(await readFile(join(SAIDA, 'serie-ear-reservatorios.json'), 'utf8'))).reservatorios;
  indice.camadas.reservatorios.comSerie = Object.keys(series).filter((k) => CODS_RESERVATORIO.cadastro.has(k)).length;
  indice.camadas.reservatorios.comSerieNoMapa = Object.keys(series).filter((k) => CODS_RESERVATORIO.noMapa.has(k)).length;
}
indice.combustivel = await construirCombustivel();
indice.distribuicao = await construirDistribuicao();
indice.arquivos = gravados;
await gravar('indice.json', indice);
console.log('\nresumo:', JSON.stringify({ linhas: indice.camadas.linhas.total, subestacoes: indice.camadas.subestacoes.total, usinas: indice.camadas.usinas.noMapa, reservatorios: indice.camadas.reservatorios.noMapa, bacias: indice.camadas.bacias.total }));
