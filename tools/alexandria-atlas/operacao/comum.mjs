// Operação horária do SIN, um dia real: o que baixar.mjs e construir.mjs dividem.
//
// A regra dos dias mora aqui, uma vez só:
//   - para cada um dos QUATRO últimos trimestres fechados antes da data do acesso, o dia de MAIOR
//     CARGA do SIN: a maior soma das 24 horas de `val_carga` da linha SIN do balanço de energia por
//     subsistema do ONS (balanco_energia_subsistema_ho). Só conta dia com as 24 horas de carga > 0
//     (o balanço tem linhas de preenchimento vazias ou zeradas; essas horas não são medidas).
//   - mais o último dia completo publicado: o mais recente que está inteiro nas quatro bases
//     (geração por usina, 24 horas; corte eólico e corte fotovoltaico, 48 meias-horas; balanço,
//     24 horas da linha SIN). O construtor decide esse dia lendo os arquivos baixados.

import { createReadStream, existsSync } from 'node:fs';
import { createInterface } from 'node:readline';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const AQUI = dirname(fileURLToPath(import.meta.url));
export const RAIZ = join(AQUI, '..', '..', '..');
export const BRUTO = join(AQUI, '..', 'bruto', 'operacao');
export const UA = 'Mozilla/5.0 (compatible; data-client/1.0)';
export const ONS_S3 = 'https://ons-aws-prod-opendata.s3.amazonaws.com/dataset';

export const arqBalanco = (ano) => `ons-balanco-${ano}.csv`;
export const arqGeracao = (mes) => `ons-geracao-usina-${mes}.csv`;
export const arqEolica = (mes) => `ons-corte-eolica-${mes}.csv`;
export const arqSolar = (mes) => `ons-corte-fotovoltaica-${mes}.csv`;

export const urlBalanco = (ano) => `${ONS_S3}/balanco_energia_subsistema_ho/BALANCO_ENERGIA_SUBSISTEMA_${ano}.csv`;
export const urlGeracao = (mes) => `${ONS_S3}/geracao_usina_2_ho/GERACAO_USINA-2_${mes.replace('-', '_')}.csv`;
export const urlEolica = (mes) => `${ONS_S3}/restricao_coff_eolica_tm/RESTRICAO_COFF_EOLICA_${mes.replace('-', '_')}.csv`;
export const urlSolar = (mes) => `${ONS_S3}/restricao_coff_fotovoltaica_tm/RESTRICAO_COFF_FOTOVOLTAICA_${mes.replace('-', '_')}.csv`;

/** Lê um CSV do ONS (separador `;`, cabeçalho na 1ª linha) linha a linha, sem carregar o arquivo. */
export async function* linhasCsv(caminho) {
  const rl = createInterface({ input: createReadStream(caminho, { encoding: 'utf8' }), crlfDelay: Infinity });
  let cab = null;
  for await (const bruta of rl) {
    const l = bruta.replace(/^﻿/, '');
    if (!l) continue;
    const c = l.split(';');
    if (!cab) {
      cab = c.map((x) => x.trim());
      continue;
    }
    const o = {};
    for (let i = 0; i < cab.length; i++) o[cab[i]] = c[i] === undefined ? '' : c[i].trim();
    yield o;
  }
}

/** Os quatro últimos trimestres fechados antes de `hoje` (AAAA-MM-DD), do mais antigo ao mais novo. */
export function trimestresFechados(hoje) {
  let ano = Number(hoje.slice(0, 4));
  let t = Math.floor((Number(hoje.slice(5, 7)) - 1) / 3) + 1; // trimestre corrente (aberto)
  const r = [];
  for (let k = 0; k < 4; k++) {
    t--;
    if (t === 0) {
      t = 4;
      ano--;
    }
    const m0 = (t - 1) * 3 + 1;
    r.unshift({ ano, t, meses: [0, 1, 2].map((d) => `${ano}-${String(m0 + d).padStart(2, '0')}`) });
  }
  return r;
}

/** Carga do SIN por dia (MWh), só dias com as 24 horas de carga > 0, dos balanços de `anos`. */
export async function cargaDiariaDoSin(anos) {
  const porDia = new Map(); // dia → { mwh, horas }
  for (const ano of anos) {
    const p = join(BRUTO, arqBalanco(ano));
    if (!existsSync(p)) throw new Error(`falta o balanço de ${ano} no bruto (${p}); rode baixar.mjs`);
    for await (const r of linhasCsv(p)) {
      if (r.id_subsistema !== 'SIN') continue;
      const dia = r.din_instante.slice(0, 10);
      const v = Number(r.val_carga);
      const d = porDia.get(dia) || { mwh: 0, horas: 0 };
      if (r.val_carga !== '' && Number.isFinite(v) && v > 0) {
        d.mwh += v;
        d.horas++;
      }
      porDia.set(dia, d);
    }
  }
  return porDia;
}

/** Dia de maior carga em cada trimestre fechado. */
export async function diasDeMaiorCarga(hoje) {
  const trims = trimestresFechados(hoje);
  const anos = [...new Set(trims.map((t) => t.ano))];
  const porDia = await cargaDiariaDoSin(anos);
  return trims.map((tr) => {
    let melhor = null;
    let diasValidos = 0;
    for (const [dia, d] of porDia) {
      if (!tr.meses.includes(dia.slice(0, 7)) || d.horas !== 24) continue;
      diasValidos++;
      if (!melhor || d.mwh > melhor.mwh) melhor = { dia, mwh: d.mwh };
    }
    if (!melhor) throw new Error(`trimestre ${tr.t}/${tr.ano}: nenhum dia com 24 horas de carga no balanço`);
    return { ...tr, dia: melhor.dia, cargaSinMWh: Math.round(melhor.mwh), diasValidos };
  });
}

export const ORDINAL = ['1º', '2º', '3º', '4º'];
