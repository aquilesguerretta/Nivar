// Baixa as fontes oficiais do Atlas para tools/alexandria-atlas/bruto/ e grava
// o manifesto (URL, data de acesso, bytes, SHA-256) em
// tools/alexandria-atlas/manifesto-fontes.json.
//
// O bruto NÃO vai para o git (ver bruto/.gitignore): o que prova a procedência
// é o manifesto, com o hash de cada arquivo guardado. Para os arquivos do ONS
// (Dados Abertos) e da ANEEL é o hash dos bytes como vieram do servidor; para as
// camadas do SINDAT é o hash do GeoJSON montado aqui a partir das páginas da
// consulta (ver baixarArcgis), porque o serviço não entrega um arquivo único.
//
//   node tools/alexandria-atlas/baixar.mjs            baixa o que falta e
//                                                     re-baixa o ano ainda aberto
//   node tools/alexandria-atlas/baixar.mjs --tudo     baixa tudo de novo
//   node tools/alexandria-atlas/baixar.mjs ons-ear    só os grupos citados
//
// Fontes (todas primárias e oficiais):
//   ONS · SINDAT, serviço geográfico público (ArcGIS REST, sig.ons.org.br)
//   ONS · Portal de Dados Abertos (dados.ons.org.br), licença CC-BY
//   ANEEL · SIGA, Dados Abertos (dadosabertos.aneel.gov.br), via Internet
//     Archive: o servidor da ANEEL não responde a conexões de fora do Brasil
//     (medido em 15/11/2026: timeout de TCP), então o arquivo é a última
//     captura íntegra do CSV oficial guardada em web.archive.org.
//   ANP · GeoServer público (WFS 2.0, gishub.anp.gov.br): gasodutos de
//     transporte, terminais de GNL e de líquidos, refinarias, UPGN, campos de
//     produção, blocos exploratórios, bacias sedimentares e polígono do pré-sal
//   IBGE · geoftp (malha municipal 2024 de Roraima): só a área oficial do estado,
//     que confere a união de Roraima ao Norte em construir.mjs
//   ANA · SNIRH, serviço ArcGIS "SNIRH2016/Massa_dagua": polígonos dos
//     reservatórios de UHE, PCH e CGH, de onde sai o rumo das barragens

import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile, stat } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const AQUI = dirname(fileURLToPath(import.meta.url));
const BRUTO = join(AQUI, 'bruto');
const MANIFESTO = join(AQUI, 'manifesto-fontes.json');
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36';

const SINDAT = 'https://sig.ons.org.br/server/rest/services/SINDAT/MAP_FT/MapServer';
const ONS_S3 = 'https://ons-aws-prod-opendata.s3.amazonaws.com/dataset';
const ANP_OWS = 'https://gishub.anp.gov.br/geoserver/ows';
const ANP_PAGINA = 'https://www.gov.br/anp/pt-br/centrais-de-conteudo/dados-abertos';
// Medido em 15/11/2026: o GetCapabilities do GeoServer traz <ows:Fees/> e
// <ows:AccessConstraints/> vazios, e nenhuma página de dados abertos da ANP
// consultada declara licença para estas camadas. O rodapé do portal gov.br da
// ANP declara CC BY-ND 3.0 para "o conteúdo deste site" — não para os dados do
// geoserviço, e por isso não é presumido aqui.
const LICENCA_ANP = 'Licença não declarada na fonte (GetCapabilities com AccessConstraints e Fees vazios; nenhuma página de dados abertos da ANP consultada declara licença para estas camadas). Dado público da ANP, uso com atribuição à ANP.';

const ANA_MASSAS = 'https://www.snirh.gov.br/arcgis/rest/services/SNIRH2016/Massa_dagua/MapServer/0';
// Medido em 16/11/2026: o serviço declara copyrightText "ANA" (no MapServer; vazio na camada)
// e nenhuma licença nominal. A ficha de metadados do conjunto no catálogo do SNIRH (uuid
// 7d054e5a-8cc9-403c-9f1a-085fd933610c) declara em restrições legais: "O acesso ao dado é livre."
const LICENCA_ANA = 'Licença nominal não declarada. O serviço declara copyrightText "ANA"; a ficha de metadados do conjunto no catálogo do SNIRH declara, em restrições legais: "O acesso ao dado é livre." Uso com atribuição à ANA.';

const anos = (de, ate) => Array.from({ length: ate - de + 1 }, (_, i) => de + i);
// séries anuais: até o ano corrente (o arquivo do ano corrente pode ainda não
// existir no começo de janeiro: 404 nele é aviso, não falha)
const ANO_FINAL = new Date().getUTCFullYear();
// arquivo anual capturado antes de o ano fechar (mais a defasagem de publicação)
// está truncado: é baixado de novo mesmo sem --tudo
const anoAindaAberto = (ano, acesso) => !acesso || acesso < `${ano + 1}-01-10`;

/** @type {{grupo:string, id:string, arquivo:string, url:string, tipo?:'arcgis'|'wfs', camada?:string, ano?:number, orgao:string, conjunto:string, licenca:string, pagina:string, nota?:string}[]} */
const FONTES = [
  // ── ONS · SINDAT (geometria real da Rede de Operação) ──────────────
  ...[
    [0, 'usinas', 'Usina'],
    [1, 'subestacoes', 'Subestação'],
    [2, 'linhas', 'Linha de Transmissão'],
    [3, 'linhas-cc', 'Linha de Corrente Contínua'],
  ].map(([camada, nome, titulo]) => ({
    grupo: 'sindat',
    id: `sindat-${nome}`,
    arquivo: `sindat/${nome}.geojson`,
    url: `${SINDAT}/${camada}`,
    tipo: /** @type {const} */ ('arcgis'),
    orgao: 'ONS',
    conjunto: `SINDAT · Mapa do SIN · camada "${titulo}"`,
    licenca: 'Dado público do ONS; o serviço não declara licença (campo copyrightText vazio). Uso com atribuição ao ONS.',
    pagina: 'https://sindat.ons.org.br/',
  })),

  // ── ONS · Dados Abertos (cadastro) ─────────────────────────────────
  ...[
    ['subestacao/SUBESTACAO.csv', 'Subestação da Rede de Operação', 'subestacao'],
    ['linha_transmissao/LINHA_TRANSMISSAO.csv', 'Linhas de Transmissão da Rede de Operação', 'linha-transmissao'],
    ['capacidade-geracao/CAPACIDADE_GERACAO.csv', 'Capacidade Instalada de Geração', 'capacidade-geracao'],
    ['reservatorio/RESERVATORIOS.csv', 'Reservatórios', 'reservatorio'],
    ['usina_conjunto/RELACIONAMENTO_USINA_CONJUNTO.csv', 'Relacionamento entre Conjuntos e Usinas', 'usina_conjunto'],
    ['bacia_contorno/Bacias_Hidrograficas_SIN.zip', 'Contornos das Bacias Hidrográficas', 'bacia_contorno'],
  ].map(([caminho, titulo, pacote]) => ({
    grupo: 'ons-cadastro',
    id: `ons-${pacote}`,
    arquivo: `ons/${caminho.split('/').pop()}`,
    url: `${ONS_S3}/${caminho}`,
    orgao: 'ONS',
    conjunto: `Dados Abertos · ${titulo}`,
    licenca: 'Creative Commons Atribuição (CC-BY), declarada no portal',
    pagina: `https://dados.ons.org.br/dataset/${pacote}`,
  })),

  // ── ONS · Dados Abertos (séries: água e intercâmbio) ───────────────
  ...anos(2000, ANO_FINAL).map((ano) => ({
    ano,
    grupo: 'ons-ear',
    id: `ons-ear-subsistema-${ano}`,
    arquivo: `ons/ear/EAR_DIARIO_SUBSISTEMA_${ano}.csv`,
    url: `${ONS_S3}/ear_subsistema_di/EAR_DIARIO_SUBSISTEMA_${ano}.csv`,
    orgao: 'ONS',
    conjunto: `Dados Abertos · EAR Diário por Subsistema · ${ano}`,
    licenca: 'Creative Commons Atribuição (CC-BY), declarada no portal',
    pagina: 'https://dados.ons.org.br/dataset/ear-diario-por-subsistema',
  })),
  ...anos(2000, ANO_FINAL).map((ano) => ({
    ano,
    grupo: 'ons-ear-res',
    id: `ons-ear-reservatorio-${ano}`,
    arquivo: `ons/ear-res/EAR_DIARIO_RESERVATORIOS_${ano}.csv`,
    url: `${ONS_S3}/ear_reservatorio_di/EAR_DIARIO_RESERVATORIOS_${ano}.csv`,
    orgao: 'ONS',
    conjunto: `Dados Abertos · EAR Diário por Reservatório · ${ano}`,
    licenca: 'Creative Commons Atribuição (CC-BY), declarada no portal',
    pagina: 'https://dados.ons.org.br/dataset/ear-diario-por-reservatorio',
  })),
  ...anos(2000, ANO_FINAL).map((ano) => ({
    ano,
    grupo: 'ons-intercambio',
    id: `ons-intercambio-${ano}`,
    arquivo: `ons/intercambio/INTERCAMBIO_NACIONAL_${ano}.csv`,
    url: `${ONS_S3}/intercambio_nacional_ho/INTERCAMBIO_NACIONAL_${ano}.csv`,
    orgao: 'ONS',
    conjunto: `Dados Abertos · Intercâmbios entre Subsistemas · ${ano}`,
    licenca: 'Creative Commons Atribuição (CC-BY), declarada no portal',
    pagina: 'https://dados.ons.org.br/dataset/intercambio-nacional',
  })),
  ...anos(2000, ANO_FINAL).map((ano) => ({
    ano,
    grupo: 'ons-balanco',
    id: `ons-balanco-${ano}`,
    arquivo: `ons/balanco/BALANCO_ENERGIA_SUBSISTEMA_${ano}.csv`,
    url: `${ONS_S3}/balanco_energia_subsistema_ho/BALANCO_ENERGIA_SUBSISTEMA_${ano}.csv`,
    orgao: 'ONS',
    conjunto: `Dados Abertos · Balanço de Energia nos Subsistemas · ${ano}`,
    licenca: 'Creative Commons Atribuição (CC-BY), declarada no portal',
    pagina: 'https://dados.ons.org.br/dataset/balanco-energia-subsistema',
  })),

  // ── ANEEL · SIGA ───────────────────────────────────────────────────
  {
    grupo: 'aneel',
    id: 'aneel-siga',
    arquivo: 'aneel/siga-empreendimentos-geracao-diario.csv',
    url: 'https://web.archive.org/web/20261019114216id_/https://dadosabertos.aneel.gov.br/dataset/6d90b77c-c5f5-4d81-bdec-7bc619494bb9/resource/2f65a1b0-19b8-4360-8238-b34ab4693d55/download/siga-empreendimentos-geracao-diario.csv',
    orgao: 'ANEEL',
    conjunto: 'SIGA · Sistema de Informações de Geração da ANEEL · empreendimentos de geração (arquivo diário)',
    licenca: 'Dados Abertos da ANEEL — Open Database License (ODbL), declarada no portal',
    pagina: 'https://dadosabertos.aneel.gov.br/dataset/siga-sistema-de-informacoes-de-geracao-da-aneel',
    nota: 'Baixado da captura de 19/10/2026 11:42 UTC no Internet Archive (cópia íntegra do CSV oficial; a coluna DatGeracaoConjuntoDados traz 2026-10-19). O servidor da ANEEL não aceita conexão de fora do Brasil.',
  },

  // ── ANP · GeoServer (WFS 2.0, gishub.anp.gov.br) ───────────────────
  // Uma requisição GetFeature por camada, em GeoJSON e EPSG:4326 (eixo lon,lat).
  // O hash é dos bytes como vieram do servidor (a resposta traz um timeStamp,
  // então baixar de novo sempre dá outro hash). O GetCapabilities entra junto:
  // é onde estão o título de cada camada e a declaração (vazia) de restrição
  // de acesso e licença.
  {
    grupo: 'anp',
    id: 'anp-wfs-capacidades',
    arquivo: 'anp/wfs-capabilities.xml',
    url: `${ANP_OWS}?service=WFS&version=2.0.0&request=GetCapabilities`,
    orgao: 'ANP',
    conjunto: 'GeoServer da ANP · WFS 2.0 · GetCapabilities (lista e título das camadas)',
    licenca: LICENCA_ANP,
    pagina: ANP_PAGINA,
  },
  ...[
    ['GASODUTOS_TRANSPORTE', 'gasodutos-transporte', 'GASODUTOS_TRANSPORTE'],
    ['Terminais_GNL', 'terminais-gnl', 'Infraestrutura: Terminais de Gás Natural Liquefeito'],
    ['REFINARIAS_SIRGAS', 'refinarias', 'REFINARIAS'],
    ['UPGN', 'upgn', 'Infraestrutura: Unidade de Processamento de Gás Natural'],
    ['TERMINAIS_LIQ', 'terminais-liquidos', 'Infraestrutura: Terminais Combustíveis Líquidos'],
    ['CAMPOS_PRODUCAO_SIRGAS', 'campos-producao', 'Campos_de_Produção'],
    ['BLOCOS_EXPLORATORIOS_SIRGAS', 'blocos-exploratorios', 'Blocos Exploratórios'],
    ['BACIAS_SEDIMENTARES_SIRGAS', 'bacias-sedimentares', 'Bacias Sedimentares'],
    ['POLIGONO_PRESAL_PLSIRGAS', 'presal', 'Pré-Sal'],
  ].map(([camada, nome, titulo]) => ({
    grupo: 'anp',
    id: `anp-${nome}`,
    arquivo: `anp/${nome}.geojson`,
    url: `${ANP_OWS}?service=WFS&version=2.0.0&request=GetFeature&typeNames=BD_ANP:${camada}&outputFormat=application/json&srsName=EPSG:4326`,
    tipo: /** @type {const} */ ('wfs'),
    camada: `BD_ANP:${camada}`,
    orgao: 'ANP',
    conjunto: `GeoServer da ANP · camada BD_ANP:${camada} ("${titulo}")`,
    licenca: LICENCA_ANP,
    pagina: ANP_PAGINA,
  })),

  // ── IBGE · geoftp (malha municipal 2024, Roraima) ──────────────────
  // A API de malhas do IBGE (servicodados.ibge.gov.br) não conecta daqui (medido em
  // 16/11/2026); o geoftp responde. Do arquivo, construir.mjs só lê o campo AREA_KM2
  // do DBF: a geometria publicada é a dos arquivos do Portal BR (ver construirSubmercados).
  {
    grupo: 'ibge',
    id: 'ibge-rr-uf-2024',
    arquivo: 'ibge/RR_UF_2024.zip',
    url: 'https://geoftp.ibge.gov.br/organizacao_do_territorio/malhas_territoriais/malhas_municipais/municipio_2024/UFs/RR/RR_UF_2024.zip',
    orgao: 'IBGE',
    conjunto: 'Malha Municipal Digital 2024 · limite da Unidade da Federação · Roraima (shapefile, SIRGAS 2000)',
    licenca: 'Não lida nesta sessão no próprio arquivo (o zip não traz texto de licença). Segundo o levantamento de 16/11/2026, as notas metodológicas da Malha Municipal Digital 2023/2024 declaram compatibilidade com CC BY 4.0; a confirmar. Uso com atribuição ao IBGE.',
    pagina: 'https://www.ibge.gov.br/geociencias/organizacao-do-territorio/malhas-territoriais/15774-malhas.html',
    nota: 'Só o campo AREA_KM2 (área oficial do estado) é usado, para conferir a união de Roraima ao submercado Norte. A fronteira internacional da malha é a fornecida pelo Ministério das Relações Exteriores, segundo o IBGE.',
  },

  // ── ANA · SNIRH (massas d'água: reservatórios de hidrelétricas) ────
  {
    grupo: 'ana',
    id: 'ana-massas-dagua-hidro',
    arquivo: 'ana/massas-dagua-hidro.geojson',
    url: ANA_MASSAS,
    tipo: /** @type {const} */ ('ana-massas'),
    orgao: 'ANA',
    conjunto: 'SNIRH · Massas d\'Água (serviço SNIRH2016/Massa_dagua, camada 0 "massa_dagua") · só os polígonos com nome iniciado por "UHE", "PCH" ou "CGH"',
    licenca: LICENCA_ANA,
    pagina: 'https://metadados.snirh.gov.br/geonetwork/srv/por/catalog.search#/metadata/7d054e5a-8cc9-403c-9f1a-085fd933610c',
    nota: 'O serviço não aceita paginação (supportsPagination: false; limite de 1.000 por consulta): os identificadores vêm de uma consulta returnIdsOnly por prefixo e as feições, em lotes de 25 identificadores, em GeoJSON (outSR=4326) com maxAllowableOffset=0,0001° (≈ 11 m: o serviço generaliza o contorno na origem). Sistema de referência de origem declarado pelo serviço: SIRGAS 2000 (EPSG:4674). A ficha de metadados descreve a versão 2019 do mapeamento; o serviço consultado é o da pasta SNIRH2016, e cada polígono traz a própria versão (deversao) e o satélite de origem (desatelite).',
  },
];

async function baixarArcgis(url) {
  // pagina de 1.000 em 1.000 (o serviço limita a 2.000) e devolve um único GeoJSON
  const feicoes = [];
  const meta = await (await fetch(`${url}?f=json`, { headers: { 'User-Agent': UA } })).json();
  const total = (await (await fetch(`${url}/query?where=1%3D1&returnCountOnly=true&f=json`, { headers: { 'User-Agent': UA } })).json()).count;
  for (let de = 0; de < total; de += 1000) {
    const q = `${url}/query?where=1%3D1&outFields=*&orderByFields=OBJECTID&resultOffset=${de}&resultRecordCount=1000&outSR=4326&f=geojson`;
    const r = await fetch(q, { headers: { 'User-Agent': UA } });
    if (!r.ok) throw new Error(`${q} respondeu ${r.status}`);
    const pag = await r.json();
    feicoes.push(...pag.features);
  }
  if (feicoes.length !== total) throw new Error(`${url}: esperava ${total} feições, vieram ${feicoes.length}`);
  // sistema de referência de origem: o que o serviço declara (não fixado aqui)
  const sr = meta.sourceSpatialReference ?? meta.extent?.spatialReference ?? null;
  // ATENÇÃO: este corpo é montado aqui (páginas concatenadas + bloco _servico); o
  // SHA-256 do manifesto é dele, não de uma resposta do servidor
  const corpo = JSON.stringify({
    type: 'FeatureCollection',
    name: meta.name,
    _servico: { url, total, sr_origem: sr ? (sr.latestWkid ?? sr.wkid ?? null) : null, sr_pedido: 4326, campos: meta.fields.map((f) => ({ nome: f.name, rotulo: f.alias, tipo: f.type })) },
    features: feicoes,
  });
  return Buffer.from(corpo, 'utf8');
}

/** ANA · Massa_dagua: a camada não pagina. Identificadores por prefixo do nome
 *  (returnIdsOnly), em ordem crescente, e as feições em lotes de 25 por POST. O corpo
 *  é montado aqui (como no SINDAT): o SHA-256 do manifesto é dele. */
async function baixarAnaMassas(url) {
  const PREFIXOS = ['UHE', 'PCH', 'CGH'];
  const CAMPOS = 'gid,nmoriginal,nmemp,detipomass,nuareakm2,deversao,desatelite,cobarprin,cotrecho,dtreserv';
  const pedir = async (params) => {
    const r = await fetch(`${url}/query`, { method: 'POST', headers: { 'User-Agent': UA, 'Content-Type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams(params) });
    if (!r.ok) throw new Error(`${url}/query respondeu ${r.status}`);
    const j = await r.json();
    if (j.error) throw new Error(`${url}/query: ${JSON.stringify(j.error)}`);
    return j;
  };
  const meta = await (await fetch(`${url}?f=json`, { headers: { 'User-Agent': UA } })).json();
  const servico = await (await fetch(`${url.replace(/\/\d+$/, '')}?f=json`, { headers: { 'User-Agent': UA } })).json();
  const feicoes = [];
  const porPrefixo = {};
  for (const pre of PREFIXOS) {
    const ids = ((await pedir({ where: `nmoriginal LIKE '${pre}%'`, returnIdsOnly: 'true', f: 'json' })).objectIds || []).sort((a, b) => a - b);
    porPrefixo[pre] = ids.length;
    for (let i = 0; i < ids.length; i += 25) {
      const lote = ids.slice(i, i + 25);
      const g = await pedir({ f: 'geojson', objectIds: lote.join(','), outFields: CAMPOS, returnGeometry: 'true', outSR: '4326', maxAllowableOffset: '0.0001' });
      const vindas = g.features || [];
      if (vindas.length !== lote.length) throw new Error(`ANA: lote de ${lote.length} identificadores devolveu ${vindas.length} feições`);
      feicoes.push(...vindas.sort((a, b) => a.id - b.id));
    }
  }
  const sr = meta.sourceSpatialReference ?? null;
  const corpo = JSON.stringify({
    type: 'FeatureCollection',
    name: meta.name,
    _servico: {
      url,
      porPrefixo,
      total: feicoes.length,
      copyrightTextDoServico: servico.copyrightText ?? null,
      descricaoDoServico: servico.serviceDescription ?? null,
      sr_origem: sr ? (sr.latestWkid ?? sr.wkid ?? null) : null,
      sr_pedido: 4326,
      maxAllowableOffset: 0.0001,
      campos: CAMPOS.split(','),
    },
    features: feicoes,
  });
  return Buffer.from(corpo, 'utf8');
}

/** WFS do GeoServer: uma resposta só; confere que veio tudo o que a camada tem. */
async function baixarWfs(url) {
  const buf = await baixarArquivo(url);
  const j = JSON.parse(buf.toString('utf8'));
  if (j.type !== 'FeatureCollection') throw new Error(`${url}: resposta não é FeatureCollection`);
  const total = j.numberMatched ?? j.totalFeatures;
  if (typeof total === 'number' && total !== j.features.length) throw new Error(`${url}: a camada tem ${total} feições, vieram ${j.features.length} (limite do servidor?)`);
  return buf;
}

async function baixarArquivo(url) {
  const r = await fetch(url, { headers: { 'User-Agent': UA }, redirect: 'follow' });
  if (!r.ok) throw new Error(`${url} respondeu ${r.status}`);
  return Buffer.from(await r.arrayBuffer());
}

const existe = (p) => stat(p).then(() => true, () => false);

async function main() {
  const args = process.argv.slice(2);
  const tudo = args.includes('--tudo');
  const grupos = args.filter((a) => !a.startsWith('--'));
  let manifesto = {};
  if (await existe(MANIFESTO)) manifesto = JSON.parse(await readFile(MANIFESTO, 'utf8'));

  const alvo = FONTES.filter((f) => grupos.length === 0 || grupos.includes(f.grupo));
  let baixados = 0;
  let falhas = 0;
  for (const f of alvo) {
    const destino = join(BRUTO, f.arquivo);
    // série anual capturada antes de o ano fechar: baixa de novo
    const reabrir = f.ano != null && manifesto[f.id] && anoAindaAberto(f.ano, manifesto[f.id].acesso);
    if (!tudo && !reabrir && manifesto[f.id] && (await existe(destino))) continue;
    try {
      // arquivo já em disco e ainda fora do manifesto (baixado numa rodada que
      // caiu antes de registrar): registra o que está lá, com a data do arquivo
      const jaEmDisco = !tudo && !reabrir && (await existe(destino));
      const buf = jaEmDisco
        ? await readFile(destino)
        : f.tipo === 'arcgis'
          ? await baixarArcgis(f.url)
          : f.tipo === 'wfs'
            ? await baixarWfs(f.url)
            : f.tipo === 'ana-massas'
              ? await baixarAnaMassas(f.url)
              : await baixarArquivo(f.url);
      const acesso = jaEmDisco ? (await stat(destino)).mtime.toISOString() : new Date().toISOString();
      await mkdir(dirname(destino), { recursive: true });
      if (!jaEmDisco) await writeFile(destino, buf);
      manifesto[f.id] = {
        orgao: f.orgao,
        conjunto: f.conjunto,
        url: f.url,
        pagina: f.pagina,
        licenca: f.licenca,
        ...(f.nota ? { nota: f.nota } : {}),
        ...(f.tipo === 'wfs' ? { camada: f.camada, forma: 'uma requisição WFS 2.0 GetFeature (outputFormat=application/json, srsName=EPSG:4326, eixo lon,lat); o sha256 é dos bytes como vieram do servidor, que incluem um timeStamp da resposta' } : {}),
        ...(f.tipo === 'ana-massas' ? { forma: 'identificadores por prefixo do nome (returnIdsOnly, where nmoriginal LIKE \'UHE%\', \'PCH%\', \'CGH%\'), feições em lotes de 25 por POST (f=geojson, outSR=4326, maxAllowableOffset=0,0001), concatenadas em ordem de identificador num GeoJSON montado localmente, com um bloco _servico; o sha256 é desse arquivo montado, não de uma resposta do servidor' } : {}),
        ...(f.tipo === 'arcgis' ? { forma: 'consulta paginada ao serviço (where=1=1, outFields=*, outSR=4326, f=geojson), feições concatenadas na ordem de OBJECTID num GeoJSON montado localmente, com um bloco _servico; o sha256 é desse arquivo montado, não de uma resposta do servidor' } : {}),
        arquivo: `tools/alexandria-atlas/bruto/${f.arquivo}`,
        bytes: buf.length,
        sha256: createHash('sha256').update(buf).digest('hex'),
        acesso,
      };
      baixados++;
      console.log(`ok   ${f.id}  ${buf.length} bytes`);
    } catch (e) {
      // arquivo do ano corrente que o ONS ainda não publicou: aviso, fora do manifesto
      if (f.ano === ANO_FINAL && !manifesto[f.id] && /respondeu 404$/.test(e.message)) {
        console.log(`aviso ${f.id}: ainda não publicado (404)`);
        continue;
      }
      falhas++;
      console.log(`FALHA ${f.id}: ${e.message}`);
    }
    await writeFile(MANIFESTO, JSON.stringify(manifesto, null, 2) + '\n');
  }
  console.log(`\n${baixados} baixado(s), ${falhas} falha(s), ${Object.keys(manifesto).length} no manifesto.`);
  if (falhas) process.exitCode = 1;
}

main();
