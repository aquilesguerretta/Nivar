#!/usr/bin/env node
// Lista as BDGD (File Geodatabase) publicadas pela ANEEL no ArcGIS Online
// (organização J5unWNi0P2dwjI3y, Hub dadosabertos-aneel.opendata.arcgis.com)
// e escolhe, por distribuidora, a de data-base mais recente.
//
// Uso: node tools/alexandria-atlas/concessoes/listar-bdgd.mjs [saida.json]
// Saída padrão: tools/alexandria-atlas/bruto/concessoes/bdgd-itens.json

import fs from 'node:fs';
import path from 'node:path';

const ORG = 'J5unWNi0P2dwjI3y';
const UA = 'Mozilla/5.0 (atlas-data-fetch)';
const saida = process.argv[2] ?? path.join('tools', 'alexandria-atlas', 'bruto', 'concessoes', 'bdgd-itens.json');

async function pagina(start) {
  const q = encodeURIComponent(`orgid:${ORG} AND type:"File Geodatabase"`);
  const url = `https://www.arcgis.com/sharing/rest/search?f=json&num=100&start=${start}&q=${q}`;
  const r = await fetch(url, { headers: { 'User-Agent': UA } });
  if (!r.ok) throw new Error(`${url} -> HTTP ${r.status}`);
  return r.json();
}

const todos = [];
let start = 1;
for (;;) {
  const j = await pagina(start);
  todos.push(...j.results);
  if (j.nextStart === -1 || !j.nextStart) break;
  start = j.nextStart;
}

// Título no padrão  <Nome>_<código>_<AAAA-MM-DD>_<versão>_<carimbo>
const RE = /^(.+)_(\d+)_(\d{4}-\d{2}-\d{2})_([VM]\d+)?_?(\d{8}-\d{4})?$/;
const itens = [];
const fora = [];
for (const it of todos) {
  const m = RE.exec(it.title);
  if (!m) { fora.push({ id: it.id, title: it.title }); continue; }
  itens.push({
    id: it.id, titulo: it.title, nome: m[1], codigo: Number(m[2]), dataBase: m[3], versao: m[4] ?? null,
    carimbo: m[5] ?? null, tamanho: it.size, modificado: new Date(it.modified).toISOString(),
    licenca: it.licenseInfo ?? null, acesso: it.access,
  });
}

// Mais recente por código de distribuidora (data-base, depois carimbo de publicação)
const porCodigo = new Map();
for (const it of itens) {
  const a = porCodigo.get(it.codigo);
  const chave = (x) => `${x.dataBase}|${x.carimbo ?? ''}`;
  if (!a || chave(it) > chave(a)) porCodigo.set(it.codigo, it);
}
const escolhidos = [...porCodigo.values()].sort((a, b) => a.nome.localeCompare(b.nome));

fs.mkdirSync(path.dirname(saida), { recursive: true });
fs.writeFileSync(saida, JSON.stringify({ acessadoEm: new Date().toISOString(), totalItens: todos.length, foraDoPadrao: fora, escolhidos, todos: itens }, null, 1));
console.log(`itens FGDB: ${todos.length}; no padrão: ${itens.length}; distribuidoras: ${escolhidos.length}; fora do padrão: ${fora.length}`);
const anos = {};
for (const e of escolhidos) anos[e.dataBase] = (anos[e.dataBase] ?? 0) + 1;
console.log('data-base mais recente por distribuidora:', anos);
for (const f of fora) console.log('fora:', f.id, f.title);
