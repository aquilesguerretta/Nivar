// Comércio exterior de energia do Brasil, 2025 fechado: baixa o BRUTO.
//
//   node tools/alexandria-atlas/comercio/baixar.mjs [--so <regex>]
//
// Grava em tools/alexandria-atlas/bruto/comercio/ (ignorado pelo git) e escreve
// consultas.json: por arquivo, endereço, método, corpo da consulta, data de acesso,
// bytes e SHA-256. Nenhum formulário, nenhuma conta, User-Agent genérico.
// O construtor (construir.mjs) só lê o que estiver nessa pasta.

import { createHash } from 'node:crypto';
import { mkdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const AQUI = dirname(fileURLToPath(import.meta.url));
export const BRUTO = join(AQUI, '..', 'bruto', 'comercio');
const UA = 'Mozilla/5.0 (compatible; data-client/1.0)';
const COMEX = 'https://api-comexstat.mdic.gov.br';

// Capítulos e posições do SH de energia. A seleção fina (NCM por produto) é do construtor.
const POSICOES = ['2701', '2702', '2704', '2709', '2710', '2711', '2713', '2207', '2612', '2844', '8401', '2716'];
const PERIODO = { from: '2025-01', to: '2025-12' };

const corpoGeral = (flow) => ({
  flow,
  monthDetail: false,
  period: PERIODO,
  filters: [{ filter: 'heading', values: POSICOES }],
  details: ['ncm', 'country', 'urf', 'via'],
  metrics: ['metricFOB', 'metricKG', 'metricStatistic'],
});
const corpoMensal = (flow, ncms) => ({
  flow,
  monthDetail: true,
  period: PERIODO,
  filters: [{ filter: 'ncm', values: ncms }],
  details: ['ncm', 'country'],
  metrics: ['metricFOB', 'metricKG', 'metricStatistic'],
});

const ONS_S3 = 'https://ons-aws-prod-opendata.s3.amazonaws.com/dataset/intercambio_internacional_ho';
const ANP_IE = 'https://www.gov.br/anp/pt-br/centrais-de-conteudo/dados-abertos/arquivos/ie';
const SEAROUTE_RAW = 'https://raw.githubusercontent.com/eurostat/searoute/master';

/** Lista de downloads. `id` vira o nome do arquivo. */
const ALVOS = [
  { id: 'comex-atualizacao.json', url: `${COMEX}/general/dates/updated` },
  { id: 'comex-2025-exportacao-ncm-pais-urf-via.json', url: `${COMEX}/general?language=pt`, corpo: corpoGeral('export') },
  { id: 'comex-2025-importacao-ncm-pais-urf-via.json', url: `${COMEX}/general?language=pt`, corpo: corpoGeral('import') },
  { id: 'comex-2025-exportacao-eletricidade-mensal.json', url: `${COMEX}/general?language=pt`, corpo: corpoMensal('export', ['27160000']) },
  { id: 'comex-2025-importacao-eletricidade-mensal.json', url: `${COMEX}/general?language=pt`, corpo: corpoMensal('import', ['27160000']) },
  { id: 'comex-paises.json', url: `${COMEX}/tables/countries?language=pt` },
  // Unidade da "quantidade estatística" das duas NCM usadas na conferência cruzada.
  { id: 'comex-unidade-27160000.json', url: `${COMEX}/tables/ncm?search=27160000&language=pt` },
  { id: 'comex-unidade-27090010.json', url: `${COMEX}/tables/ncm?search=27090010&language=pt` },
  { id: 'ons-intercambio-internacional-2025.csv', url: `${ONS_S3}/INTERCAMBIO_INTERNACIONAL_2025.csv` },
  { id: 'ons-dicionario-intercambio-internacional.json', url: `${ONS_S3}/DicionarioDados_Intercambio_Internacional.json` },
  { id: 'ons-pacote-intercambio-internacional.json', url: 'https://dados.ons.org.br/api/3/action/package_show?id=intercambio-internacional' },
  { id: 'anp-importacoes-exportacoes-petroleo-2000-2025.csv', url: `${ANP_IE}/petroleo/importacoes-exportacoes-petroleo-2000-2025.csv` },
  { id: 'anac-aerodromos-publicos.csv', url: 'https://sistemas.anac.gov.br/dadosabertos/Aerodromos/Aer%C3%B3dromos%20P%C3%BAblicos/Lista%20de%20aer%C3%B3dromos%20p%C3%BAblicos/AerodromosPublicos.csv' },
  { id: 'ibge-localidades-2022-gpkg.zip', url: 'https://geoftp.ibge.gov.br/organizacao_do_territorio/estrutura_territorial/localidades/Localidades_do_Brasil/2022/Localidades_Brasil_gpkg.zip' },
  // Mesma distribuição do world-110m.json do capítulo "O mundo", na escala 50m: só para o ponto
  // dos países que o 110m não desenha (Singapura, Malta...).
  { id: 'natural-earth-countries-50m.json', url: 'https://unpkg.com/world-atlas@2.0.2/countries-50m.json' },
  // Roteador próprio das rotas marítimas (leva 2): a mesma distribuição na escala 10m, para a costa
  // e os estreitos, e a camada de portos do Natural Earth 10m (repositório oficial do Natural Earth),
  // de onde saem os dois extremos de cada portão de canal (Suez, Panamá).
  { id: 'natural-earth-countries-10m.json', url: 'https://unpkg.com/world-atlas@2.0.2/countries-10m.json' },
  { id: 'natural-earth-ports-10m.geojson', url: 'https://raw.githubusercontent.com/nvkelso/natural-earth-vector/v5.1.2/geojson/ne_10m_ports.geojson' },
  // Leva 3: as ilhas pequenas que os países do 10m não trazem (Sangiang, no meio do estreito de Sunda,
  // apareceu sob a rota na base do Mapbox). Mesma origem e versão; entram só como terra no roteador.
  { id: 'natural-earth-minor-islands-10m.geojson', url: 'https://raw.githubusercontent.com/nvkelso/natural-earth-vector/v5.1.2/geojson/ne_10m_minor_islands.geojson' },
  { id: 'eurostat-marnet_plus_20km.gpkg', url: `${SEAROUTE_RAW}/modules/core/src/main/resources/marnet/marnet_plus_20km.gpkg` },
  { id: 'eurostat-searoute-LICENSE.txt', url: `${SEAROUTE_RAW}/LICENSE` },
  { id: 'eurostat-searoute-README.md', url: `${SEAROUTE_RAW}/README.md` },
];

const sha = (b) => createHash('sha256').update(b).digest('hex');
const espera = (ms) => new Promise((r) => setTimeout(r, ms));

async function baixar(alvo) {
  for (let tentativa = 1; tentativa <= 5; tentativa++) {
    const acesso = new Date().toISOString();
    try {
      const r = await fetch(alvo.url, {
        method: alvo.corpo ? 'POST' : 'GET',
        headers: { 'User-Agent': UA, ...(alvo.corpo ? { 'Content-Type': 'application/json' } : {}) },
        body: alvo.corpo ? JSON.stringify(alvo.corpo) : undefined,
        signal: AbortSignal.timeout(180_000),
      });
      const buf = Buffer.from(await r.arrayBuffer());
      if (r.status === 200) return { buf, acesso };
      console.warn(`  ${alvo.id}: HTTP ${r.status} (tentativa ${tentativa})`);
    } catch (e) {
      console.warn(`  ${alvo.id}: ${e.message} (tentativa ${tentativa})`);
    }
    await espera(15_000); // a API do Comex Stat limita o ritmo
  }
  throw new Error(`falhou: ${alvo.id}`);
}

/** O Comex devolve o país por NOME; o código ISO vem por país em /tables/countries/{id}. */
async function paisesIso(registro) {
  const nomes = new Set();
  for (const f of ['comex-2025-exportacao-ncm-pais-urf-via.json', 'comex-2025-importacao-ncm-pais-urf-via.json']) {
    for (const l of JSON.parse(readFileSync(join(BRUTO, f), 'utf8')).data.list) nomes.add(l.country);
  }
  const tabela = JSON.parse(readFileSync(join(BRUTO, 'comex-paises.json'), 'utf8')).data.list;
  const porNome = new Map(tabela.map((p) => [p.text, p.id]));
  const saida = { acesso: new Date().toISOString(), paises: {} };
  for (const nome of [...nomes].sort()) {
    const id = porNome.get(nome);
    if (!id) { saida.paises[nome] = null; continue; }
    const { buf } = await baixar({ id: `pais ${id}`, url: `${COMEX}/tables/countries/${id}?language=pt` });
    saida.paises[nome] = JSON.parse(buf.toString('utf8')).data;
    await espera(400);
  }
  const buf = Buffer.from(JSON.stringify(saida, null, 1));
  writeFileSync(join(BRUTO, 'comex-paises-iso.json'), buf);
  registro['comex-paises-iso.json'] = {
    url: `${COMEX}/tables/countries/{id}?language=pt (uma consulta por país presente nas duas respostas gerais)`,
    metodo: 'GET', acesso: saida.acesso, bytes: buf.length, sha256: sha(buf),
  };
}

async function main() {
  mkdirSync(BRUTO, { recursive: true });
  const so = process.argv.includes('--so') ? new RegExp(process.argv[process.argv.indexOf('--so') + 1]) : null;
  const caminhoRegistro = join(BRUTO, 'consultas.json');
  const registro = existsSync(caminhoRegistro) ? JSON.parse(readFileSync(caminhoRegistro, 'utf8')) : {};
  for (const alvo of ALVOS) {
    if (so && !so.test(alvo.id)) continue;
    const { buf, acesso } = await baixar(alvo);
    writeFileSync(join(BRUTO, alvo.id), buf);
    registro[alvo.id] = { url: alvo.url, metodo: alvo.corpo ? 'POST' : 'GET', ...(alvo.corpo ? { corpo: alvo.corpo } : {}), acesso, bytes: buf.length, sha256: sha(buf) };
    console.log(`${alvo.id}  ${buf.length} B  ${registro[alvo.id].sha256.slice(0, 12)}`);
    writeFileSync(caminhoRegistro, JSON.stringify(registro, null, 1));
    if (alvo.url.startsWith(COMEX)) await espera(3000);
  }
  if (!so || so.test('comex-paises-iso')) await paisesIso(registro);
  writeFileSync(caminhoRegistro, JSON.stringify(registro, null, 1));
  console.log(`registro: ${caminhoRegistro}`);
}

main().catch((e) => { console.error(e); process.exit(1); });
