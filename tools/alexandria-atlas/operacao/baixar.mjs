// Operação horária do SIN, um dia real: baixa o BRUTO.
//
//   node tools/alexandria-atlas/operacao/baixar.mjs [--hoje AAAA-MM-DD] [--meses AAAA-MM,AAAA-MM] [--so <regex>]
//
// Grava em tools/alexandria-atlas/bruto/operacao/ (ignorado pelo git) e escreve consultas.json: por
// arquivo, endereço, data de acesso, Last-Modified da fonte, bytes e SHA-256. Os mensais do ONS são
// grandes (geração ~30–70 MB, corte eólico ~20–50 MB, corte fotovoltaico ~10–22 MB): vão em fluxo
// direto para o disco, com o hash calculado no caminho. Nenhum formulário, nenhuma conta, User-Agent
// genérico. O construtor (construir.mjs) só lê o que estiver nessa pasta.
//
// Ordem: 1) balanços anuais, dicionários, pacotes CKAN e a relação usina–conjunto; 2) com o balanço
// no disco, a regra de comum.mjs escolhe os dias de maior carga; 3) os mensais dos meses desses dias
// e do mês corrente (mais o anterior nos três primeiros dias do mês). `--meses` troca a lista do passo 3.

import { createHash } from 'node:crypto';
import { createWriteStream, existsSync, mkdirSync, readFileSync, renameSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { Readable, Transform } from 'node:stream';
import { pipeline } from 'node:stream/promises';
import {
  BRUTO, ONS_S3, UA, arqBalanco, arqEolica, arqGeracao, arqSolar, diasDeMaiorCarga, trimestresFechados,
  urlBalanco, urlEolica, urlGeracao, urlSolar,
} from './comum.mjs';

const ARGS = process.argv.slice(2);
const arg = (n) => (ARGS.includes(n) ? ARGS[ARGS.indexOf(n) + 1] : null);
const HOJE = arg('--hoje') || new Date().toISOString().slice(0, 10);
const SO = arg('--so') ? new RegExp(arg('--so')) : null;
const MESES = arg('--meses') ? arg('--meses').split(',') : null;
const CKAN = 'https://dados.ons.org.br/api/3/action/package_show?id=';

const espera = (ms) => new Promise((r) => setTimeout(r, ms));
const caminhoRegistro = join(BRUTO, 'consultas.json');

async function baixar(id, url, registro) {
  for (let tentativa = 1; tentativa <= 4; tentativa++) {
    const acesso = new Date().toISOString();
    try {
      const r = await fetch(url, { headers: { 'User-Agent': UA }, signal: AbortSignal.timeout(900_000) });
      if (r.status !== 200) {
        console.warn(`  ${id}: HTTP ${r.status} (tentativa ${tentativa})`);
        await r.body?.cancel();
        await espera(5000);
        continue;
      }
      const h = createHash('sha256');
      let bytes = 0;
      const conta = new Transform({
        transform(pedaco, _e, cb) {
          h.update(pedaco);
          bytes += pedaco.length;
          cb(null, pedaco);
        },
      });
      const tmp = join(BRUTO, `${id}.parcial`);
      await pipeline(Readable.fromWeb(r.body), conta, createWriteStream(tmp));
      const esperado = Number(r.headers.get('content-length'));
      if (esperado && esperado !== bytes) throw new Error(`recebi ${bytes} B, o servidor anunciou ${esperado} B`);
      renameSync(tmp, join(BRUTO, id));
      registro[id] = { url, metodo: 'GET', acesso, ultimaModificacaoNaFonte: r.headers.get('last-modified'), bytes, sha256: h.digest('hex') };
      writeFileSync(caminhoRegistro, JSON.stringify(registro, null, 1));
      console.log(`${id}  ${bytes} B  ${registro[id].sha256.slice(0, 12)}`);
      return;
    } catch (e) {
      console.warn(`  ${id}: ${e.message} (tentativa ${tentativa})`);
      await espera(5000);
    }
  }
  throw new Error(`falhou: ${id}`);
}

async function main() {
  mkdirSync(BRUTO, { recursive: true });
  const registro = existsSync(caminhoRegistro) ? JSON.parse(readFileSync(caminhoRegistro, 'utf8')) : {};
  const quer = (id) => !SO || SO.test(id);

  // 1) fixos
  const trims = trimestresFechados(HOJE);
  const anos = [...new Set([...trims.map((t) => t.ano), Number(HOJE.slice(0, 4))])];
  const fixos = [
    ...anos.map((a) => [arqBalanco(a), urlBalanco(a)]),
    ['ons-relacionamento-usina-conjunto.csv', `${ONS_S3}/usina_conjunto/RELACIONAMENTO_USINA_CONJUNTO.csv`],
    ['ons-dicionario-geracao-usina.json', `${ONS_S3}/geracao_usina_2_ho/DicionarioDados_GeracaoPorUsina.json`],
    ['ons-dicionario-corte-eolica.json', `${ONS_S3}/restricao_coff_eolica_tm/DicionarioDados_RestricaoContrainedoff_UsiEolicas.json`],
    ['ons-dicionario-corte-fotovoltaica.json', `${ONS_S3}/restricao_coff_fotovoltaica_tm/DicionarioDados_RestricaoContrainedoff_UsiFotovoltaica.json`],
    ['ons-pacote-geracao-usina-2.json', `${CKAN}geracao-usina-2`],
    ['ons-pacote-restricao-coff-eolica-usi.json', `${CKAN}restricao_coff_eolica_usi`],
    ['ons-pacote-restricao-coff-fotovoltaica.json', `${CKAN}restricao_coff_fotovoltaica`],
    ['ons-pacote-balanco-energia-subsistema.json', `${CKAN}balanco-energia-subsistema`],
    ['ons-pacote-usina-conjunto.json', `${CKAN}usina_conjunto`],
  ];
  for (const [id, url] of fixos) if (quer(id)) await baixar(id, url, registro);

  // 2) dias e meses
  let meses = MESES;
  if (!meses) {
    const dias = await diasDeMaiorCarga(HOJE);
    for (const d of dias) console.log(`  ${d.t}º tri ${d.ano}: ${d.dia} (${d.cargaSinMWh} MWh, ${d.diasValidos} dias válidos)`);
    const corrente = HOJE.slice(0, 7);
    const s = new Set(dias.map((d) => d.dia.slice(0, 7)));
    s.add(corrente);
    if (Number(HOJE.slice(8, 10)) <= 3) {
      const [a, m] = corrente.split('-').map(Number);
      s.add(m === 1 ? `${a - 1}-12` : `${a}-${String(m - 1).padStart(2, '0')}`);
    }
    meses = [...s].sort();
  }
  console.log(`meses: ${meses.join(', ')}`);

  // 3) mensais
  for (const mes of meses) {
    for (const [id, url] of [[arqGeracao(mes), urlGeracao(mes)], [arqEolica(mes), urlEolica(mes)], [arqSolar(mes), urlSolar(mes)]]) {
      if (quer(id)) await baixar(id, url, registro);
    }
  }
  console.log(`registro: ${caminhoRegistro}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
