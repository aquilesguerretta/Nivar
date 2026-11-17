// Publica as vistas do Atlas a partir da curadoria (tools/alexandria-atlas/vistas/mNN.json):
//
//   public/alexandria/atlas/vistas.json          vistas completas, buscadas pela página do Atlas
//   src/lib/alexandria/atlas/vistas.indice.ts     índice leve (id, módulo, aula, título), importado pelas aulas
//
//   node tools/alexandria-atlas/gerar-vistas.mjs
//
// Recusa-se a publicar se o verificador acusar erro: vista com ativo inexistente
// ou citação que não confere não chega ao produto.

import { spawnSync } from 'node:child_process';
import { readFile, readdir, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const AQUI = dirname(fileURLToPath(import.meta.url));
const RAIZ = join(AQUI, '..', '..');
const PASTA = join(AQUI, 'vistas');

const ver = spawnSync(process.execPath, [join(AQUI, 'verificar-vistas.mjs')], { encoding: 'utf8' });
if (ver.status !== 0) {
  console.log(ver.stdout.split('\n').filter((l) => l.startsWith('ERRO') || / vistas · /.test(l)).join('\n'));
  console.log('\nVistas NÃO publicadas: o verificador acusou erro.');
  process.exit(1);
}

const arquivos = (await readdir(PASTA)).filter((f) => /^m\d\d\.json$/.test(f)).sort();
const vistas = [];
const semVista = [];
for (const arq of arquivos) {
  const d = JSON.parse(await readFile(join(PASTA, arq), 'utf8'));
  // dentro da aula, na ordem em que a frase aparece no texto
  const ordenadas = d.vistas.slice().sort((a, b) => a.aula - b.aula || a.trecho.arquivo.localeCompare(b.trecho.arquivo) || a.trecho.linha - b.trecho.linha);
  for (const v of ordenadas) {
    const destaque = {};
    for (const [k, lista] of Object.entries(v.destaque ?? {})) if (Array.isArray(lista) && lista.length) destaque[k] = lista;
    vistas.push({
      id: v.id,
      modulo: v.modulo,
      aula: v.aula,
      titulo: v.titulo,
      capitulo: v.capitulo,
      camera: v.camera,
      camadas: v.camadas,
      destaque,
      satelite: v.satelite,
      momento: v.momento ?? null,
      trecho: { texto: v.trecho.texto, arquivo: v.trecho.arquivo, linha: v.trecho.linha },
      nota: v.nota_de_dado ?? null,
    });
  }
  for (const s of d.sem_vista ?? []) semVista.push({ modulo: d.modulo, ...s });
}

await writeFile(join(RAIZ, 'public', 'alexandria', 'atlas', 'vistas.json'), JSON.stringify({ gerado: new Date().toISOString().slice(0, 10), vistas }));

const linhas = vistas.map((v) => `  { id: ${JSON.stringify(v.id)}, m: ${JSON.stringify(v.modulo)}, a: ${v.aula}, t: ${JSON.stringify(v.titulo)}, c: ${JSON.stringify(v.capitulo)} },`);
const ts = `// GERADO por tools/alexandria-atlas/gerar-vistas.mjs — não edite à mão.
// Índice leve das vistas do Atlas: é o que as aulas importam.
// Fonte: tools/alexandria-atlas/vistas/mNN.json (curadoria verificada).

export interface VistaNoIndice {
  id: string;
  /** 'modulo-08' */
  m: string;
  /** número da aula */
  a: number;
  /** título da vista */
  t: string;
  /** capítulo do Atlas em que a vista abre */
  c: 'rede' | 'agua' | 'combustivel' | 'trocas' | 'dia' | 'mundo';
}

export const INDICE_DE_VISTAS: VistaNoIndice[] = [
${linhas.join('\n')}
];
`;
await writeFile(join(RAIZ, 'src', 'lib', 'alexandria', 'atlas', 'vistas.indice.ts'), ts);

// registro do que NÃO virou vista, para o relatório e para a próxima rodada de dados
await writeFile(join(RAIZ, 'docs', 'alexandria-v3', 'atlas', 'sem-vista.json'), JSON.stringify(semVista, null, 2) + '\n');

const aulas = new Set(vistas.map((v) => `${v.modulo}#${v.aula}`));
const porCap = {};
for (const v of vistas) porCap[v.capitulo] = (porCap[v.capitulo] || 0) + 1;
console.log(`${vistas.length} vistas publicadas · ${aulas.size} aulas · ${new Set(vistas.map((v) => v.modulo)).size} módulos · ${Object.entries(porCap).map(([k, n]) => `${k} ${n}`).join(' · ')} · ${semVista.length} registros sem vista`);
