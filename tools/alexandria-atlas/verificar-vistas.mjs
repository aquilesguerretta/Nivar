// Verifica as vistas do Atlas (tools/alexandria-atlas/vistas/mNN.json).
//
//   node tools/alexandria-atlas/verificar-vistas.mjs            todos os módulos
//   node tools/alexandria-atlas/verificar-vistas.mjs m08 m12    só os citados
//
// Cada vista tem de: apontar para ativos que EXISTEM nos dados do Atlas, citar a
// aula com um trecho que é substring exata da linha declarada, e enquadrar o que
// destaca. Sai com código 1 se houver erro (avisos não derrubam).

import { readFile, readdir } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const AQUI = dirname(fileURLToPath(import.meta.url));
const RAIZ = join(AQUI, '..', '..');
const DADOS = join(RAIZ, 'public', 'alexandria', 'atlas', 'dados');
const PASTA = join(AQUI, 'vistas');
const J = async (p) => JSON.parse(await readFile(p, 'utf8'));

// "comercio" (sétimo, leva 2) é capítulo válido para uma vista futura; hoje nenhuma aula aponta para ele
export const CAPITULOS = ['rede', 'agua', 'combustivel', 'trocas', 'dia', 'mundo', 'comercio'];
// camadas do capítulo do combustível (as mesmas de CAMADAS_DO_COMBUSTIVEL em tipos.ts)
export const CAMADAS_DO_COMBUSTIVEL = ['gasodutos', 'gnl', 'upgn', 'refinarias', 'terminais', 'campos', 'presal', 'blocos', 'bacias-sedimentares'];
export const CAMADAS = ['hidro', 'eolica', 'solar', 'nuclear', 'biomassa', 'gas', 'carvao', 'oleo', 'outros', 'linhas', 'linhas-previstas', 'subestacoes', 'submercados', 'reservatorios', 'bacias', 'usinas-futuras', 'satelite', 'relevo', 'maquetes', 'distribuicao', ...CAMADAS_DO_COMBUSTIVEL];
const TAGS_ACEITAS = /<\/?(b|strong|em|i|sub|sup)>/g;

// ── universo de ativos ───────────────────────────────────────────────
const caixaDe = (geom, acc = [180, 90, -180, -90]) => {
  const v = (c) => {
    if (typeof c[0] === 'number') {
      acc[0] = Math.min(acc[0], c[0]);
      acc[1] = Math.min(acc[1], c[1]);
      acc[2] = Math.max(acc[2], c[0]);
      acc[3] = Math.max(acc[3], c[1]);
    } else c.forEach(v);
  };
  v(geom.coordinates);
  return acc;
};

const universo = { usinas: new Map(), linhas: new Map(), subestacoes: new Map(), reservatorios: new Map(), submercados: new Map(), bacias: new Map(), paises: new Map(), combustivel: new Map() };
for (const arq of ['usinas-principais.json', 'usinas-menores.json']) {
  const c = await J(join(DADOS, arq));
  for (let i = 0; i < c.n; i++) universo.usinas.set(c.ceg[i], [c.lon[i], c.lat[i], c.lon[i], c.lat[i]]);
}
for (const f of (await J(join(DADOS, 'rede-linhas.geojson'))).features) universo.linhas.set(f.properties.id, caixaDe(f.geometry));
for (const f of (await J(join(DADOS, 'rede-subestacoes.geojson'))).features) universo.subestacoes.set(f.properties.id, caixaDe(f.geometry));
for (const f of (await J(join(DADOS, 'agua-reservatorios.geojson'))).features) universo.reservatorios.set(f.properties.cod, caixaDe(f.geometry));
for (const f of (await J(join(DADOS, 'agua-bacias.geojson'))).features) universo.bacias.set(f.properties.Nome_Bacia, caixaDe(f.geometry));
// camada que a vista do combustível precisa ligar para cada prefixo de id (o destaque precisa dela)
const CAMADA_DO_PREFIXO = [
  [/^gd-/, 'gasodutos'],
  [/^refinaria-/, 'refinarias'],
  [/^gnl-/, 'gnl'],
  [/^upgn-/, 'upgn'],
  [/^terminal-/, 'terminais'],
  [/^campo-/, 'campos'],
  [/^bloco-/, 'blocos'],
  [/^bacia-sed-/, 'bacias-sedimentares'],
  [/^presal$/, 'presal'],
];
// gás e petróleo (ANP): os seis arquivos compartilham o espaço de ids (prefixos gd-, refinaria-,
// gnl-, upgn-, terminal-, campo-, bloco-, bacia-sed- e 'presal'); arquivo que falta não derruba o
// verificador, só deixa os ids dele sem universo (a vista que os cita acusa erro)
for (const arq of ['combustivel-gasodutos.geojson', 'combustivel-instalacoes.geojson', 'combustivel-campos.geojson', 'combustivel-blocos.geojson', 'combustivel-bacias.geojson', 'combustivel-presal.geojson']) {
  const fc = await J(join(DADOS, arq)).catch(() => null);
  for (const f of fc?.features ?? []) universo.combustivel.set(f.properties.id, caixaDe(f.geometry));
}
const SIGLA = { sudesteCentroOeste: 'SE', sul: 'S', nordeste: 'NE', norte: 'N' };
for (const f of (await J(join(DADOS, 'submercados.geojson'))).features) universo.submercados.set(SIGLA[f.properties.id], caixaDe(f.geometry));
{
  const fonte = await readFile(join(RAIZ, 'src', 'lib', 'atlas', 'worldApi.ts'), 'utf8');
  for (const m of fonte.matchAll(/'(\d{3})':\s*\['([A-Z]{3})',\s*'([A-Z]{2})'\]/g)) universo.paises.set(m[2], null);
}
const ear = await J(join(DADOS, 'serie-ear-subsistema.json'));
const mesesValidos = new Set(ear.meses);
const perfil = await J(join(DADOS, 'serie-perfil-horario.json'));
const mesesDoPerfil = new Set(perfil.meses);

const linhasDe = new Map();
async function linhas(rel) {
  if (!linhasDe.has(rel)) linhasDe.set(rel, await readFile(join(RAIZ, rel), 'utf8').then((t) => t.split(/\r?\n/), () => null));
  return linhasDe.get(rel);
}

// ── verificação ──────────────────────────────────────────────────────
const pedidos = process.argv.slice(2).filter((a) => /^m\d\d$/.test(a));
const arquivos = (await readdir(PASTA).catch(() => [])).filter((f) => /^m\d\d\.json$/.test(f) && (!pedidos.length || pedidos.includes(f.slice(0, 3)))).sort();
if (!arquivos.length) {
  console.log('nenhum arquivo de vistas encontrado em tools/alexandria-atlas/vistas/');
  process.exit(1);
}

const erros = [];
const avisos = [];
const ids = new Map();
let total = 0;
const porCapitulo = {};
const tabela = [];

for (const arq of arquivos) {
  const nn = arq.slice(1, 3);
  let d;
  try {
    d = await J(join(PASTA, arq));
  } catch (e) {
    erros.push(`${arq}: JSON inválido (${e.message})`);
    continue;
  }
  const leitura = await J(join(RAIZ, 'docs', 'alexandria-v3', 'atlas', 'leitura', arq)).catch(() => null);
  const aulasValidas = new Set((leitura?.aulas ?? []).map((a) => a.numero));
  if (d.modulo !== `modulo-${nn}`) erros.push(`${arq}: "modulo" devia ser modulo-${nn}`);
  const porAula = {};
  for (const v of d.vistas ?? []) {
    total++;
    const onde = `${arq} › ${v.id ?? '(sem id)'}`;
    const erro = (m) => erros.push(`${onde}: ${m}`);
    const aviso = (m) => avisos.push(`${onde}: ${m}`);
    if (!new RegExp(`^m${nn}-a\\d\\d-[a-z0-9]+(-[a-z0-9]+)*$`).test(v.id ?? '')) erro('id fora do padrão mNN-aNN-slug');
    if (ids.has(v.id)) erro(`id repetido (também em ${ids.get(v.id)})`);
    ids.set(v.id, arq);
    if (v.modulo !== `modulo-${nn}`) erro('"modulo" não bate com o arquivo');
    if (!Number.isInteger(v.aula) || !aulasValidas.has(v.aula)) erro(`aula ${v.aula} não existe na leitura do módulo`);
    else if (!String(v.id).startsWith(`m${nn}-a${String(v.aula).padStart(2, '0')}-`)) erro('o aNN do id não bate com "aula"');
    porAula[v.aula] = (porAula[v.aula] || 0) + 1;
    if (typeof v.titulo !== 'string' || v.titulo.length < 6 || v.titulo.length > 56) erro('titulo deve ter de 6 a 56 caracteres');
    else if (/[.!]$/.test(v.titulo)) erro('titulo não termina com ponto');
    if (!CAPITULOS.includes(v.capitulo)) erro(`capitulo inválido: ${v.capitulo}`);
    porCapitulo[v.capitulo] = (porCapitulo[v.capitulo] || 0) + 1;

    // câmera
    const cam = v.camera ?? {};
    let caixaCam = null;
    if (Array.isArray(cam.limites)) {
      const [w, s, e, n] = cam.limites;
      if (![w, s, e, n].every(Number.isFinite) || w >= e || s >= n || w < -180 || e > 180 || s < -85 || n > 85) erro('camera.limites inválidos ([oeste, sul, leste, norte])');
      else caixaCam = cam.limites;
    } else if (Array.isArray(cam.centro) && Number.isFinite(cam.zoom)) {
      if (cam.zoom < 0.9 || cam.zoom > 16) erro('camera.zoom fora de 0,9–16');
    } else erro('camera precisa de "limites" ou de "centro" + "zoom"');
    if (cam.inclinacao != null && (cam.inclinacao < 0 || cam.inclinacao > 70)) erro('camera.inclinacao fora de 0–70');

    // camadas
    if (!Array.isArray(v.camadas)) erro('"camadas" deve ser lista');
    else for (const c of v.camadas) if (!CAMADAS.includes(c)) erro(`camada desconhecida: ${c}`);

    // destaque
    let nDestaque = 0;
    const caixaDest = [180, 90, -180, -90];
    for (const [k, lista] of Object.entries(v.destaque ?? {})) {
      if (!universo[k]) {
        erro(`destaque.${k} não existe`);
        continue;
      }
      if (!Array.isArray(lista)) {
        erro(`destaque.${k} deve ser lista`);
        continue;
      }
      for (const chave of lista) {
        if (!universo[k].has(chave)) erro(`destaque.${k}: "${chave}" não existe nos dados do Atlas`);
        else {
          nDestaque++;
          const cx = universo[k].get(chave);
          if (cx) {
            caixaDest[0] = Math.min(caixaDest[0], cx[0]);
            caixaDest[1] = Math.min(caixaDest[1], cx[1]);
            caixaDest[2] = Math.max(caixaDest[2], cx[2]);
            caixaDest[3] = Math.max(caixaDest[3], cx[3]);
          }
        }
      }
    }
    if (v.capitulo === 'mundo' && !(v.destaque?.paises?.length > 0)) erro('vista do capítulo mundo precisa de destaque.paises');
    if ((v.capitulo === 'rede' || v.capitulo === 'agua' || v.capitulo === 'combustivel') && nDestaque === 0) erro('vista de rede, água ou combustível precisa de ao menos um destaque que exista nos dados');
    if (v.destaque?.combustivel?.length && v.capitulo !== 'combustivel') erro('destaque.combustivel só é desenhado no capítulo combustivel');
    if (v.capitulo === 'combustivel' && Array.isArray(v.camadas)) {
      // o ativo destacado precisa da camada dele ligada; a usina destacada, da fonte dela
      for (const id of v.destaque?.combustivel ?? []) {
        const camada = CAMADA_DO_PREFIXO.find(([re]) => re.test(id))?.[1];
        if (camada && !v.camadas.includes(camada)) erro(`destaque.combustivel "${id}" pede a camada "${camada}" em "camadas"`);
      }
      if (v.destaque?.usinas?.length && !v.camadas.some((c) => ['gas', 'oleo', 'carvao'].includes(c))) erro('vista do combustível com usina destacada precisa ligar a fonte dela (gas, oleo ou carvao)');
    }
    if (caixaCam && caixaDest[0] <= caixaDest[2] && v.capitulo !== 'mundo') {
      const fora = caixaDest[0] < caixaCam[0] - 0.01 || caixaDest[1] < caixaCam[1] - 0.01 || caixaDest[2] > caixaCam[2] + 0.01 || caixaDest[3] > caixaCam[3] + 0.01;
      // submercado e bacia podem extrapolar de propósito (zoom num detalhe); ponto e linha, não
      const temPontoOuLinha = ['usinas', 'linhas', 'subestacoes', 'reservatorios', 'combustivel'].some((k) => v.destaque?.[k]?.length);
      if (fora && temPontoOuLinha && !(v.destaque?.submercados?.length || v.destaque?.bacias?.length)) aviso(`câmera não contém todo o destaque (destaque ${caixaDest.map((x) => x.toFixed(1))} · câmera ${caixaCam})`);
    }

    // tempo
    if (v.momento != null) {
      if (v.capitulo === 'dia') {
        if (!mesesDoPerfil.has(v.momento)) erro(`momento ${v.momento} fora da janela do perfil horário (${perfil.meses[0]} a ${perfil.meses.at(-1)}): atualize a vista`);
      } else if (!['agua', 'trocas'].includes(v.capitulo)) erro('"momento" só vale nos capítulos agua, trocas e dia');
      else if (!mesesValidos.has(v.momento)) erro(`momento ${v.momento} fora da série (2000-01 a ${ear.meses.at(-1)})`);
    }
    if (typeof v.satelite !== 'boolean') erro('"satelite" deve ser true ou false');

    // trecho literal
    const t = v.trecho ?? {};
    const ls = typeof t.arquivo === 'string' ? await linhas(t.arquivo) : null;
    if (!ls) erro(`trecho.arquivo não existe: ${t.arquivo}`);
    else {
      const linha = ls[t.linha - 1];
      if (typeof t.texto !== 'string' || t.texto.length < 12 || t.texto.length > 420) erro('trecho.texto deve ter de 12 a 420 caracteres');
      else if (typeof linha !== 'string' || !linha.includes(t.texto)) erro(`trecho.texto não é substring exata de ${t.arquivo}:${t.linha}`);
      else {
        if (/", ?"|\\"|\\n/.test(t.texto)) erro('trecho.texto carrega separador de tabela ou escape (\\", ", "): escolha uma frase limpa');
        if (/<[^>]+>/.test(t.texto.replace(TAGS_ACEITAS, ''))) erro('trecho.texto tem tag HTML fora de b/strong/em/i/sub/sup');
        if (/^[a-zà-ú,;:)]/.test(t.texto.replace(TAGS_ACEITAS, ''))) aviso('trecho.texto começa no meio da frase');
      }
    }
  }
  for (const [a, n] of Object.entries(porAula)) if (n > 4) erros.push(`${arq}: aula ${a} tem ${n} vistas (máximo 4)`);
  tabela.push(`modulo-${nn}  ${String((d.vistas ?? []).length).padStart(3)} vistas em ${Object.keys(porAula).length} de ${aulasValidas.size} aulas  ·  sem vista: ${(d.sem_vista ?? []).length} registro(s)`);
}

console.log(tabela.join('\n'));
console.log(`\n${total} vistas · ${erros.length} erro(s) · ${avisos.length} aviso(s) · por capítulo: ${Object.entries(porCapitulo).map(([k, v]) => `${k} ${v}`).join(' · ')}`);
for (const e of erros) console.log('ERRO  ' + e);
for (const a of avisos) console.log('aviso ' + a);
if (erros.length) process.exitCode = 1;
