// Confere a ligação do M02/M03 ao modelo de aula v3 (src/lib/alexandria/modulos-v3/m0N.ts):
//   · cada figura: âncora com trecho; o trecho cai no bloco que o nome da âncora diz (bNN);
//     foto com todos os derivados em disco e linha `aprovado` em procedencia/m0N.md;
//     diagrama registrado;
//   · cada instrumento em aula: tem previsão (exceto os declarados sem) e a previsão é sã —
//     bloco existe, cenário só com campos do instrumento, a calculadora devolve número
//     finito para a grandeza, cada trecho de `velar` existe na aula, e o calculado
//     formatado NÃO aparece em bloco não velado da mesma aula (o véu é real).
// Uso: node tools/alexandria-dados/porte/verificar-v3-m02-m03.mjs 2

import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { build } from 'esbuild';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const n = Number(process.argv[2]);
const NN = String(n).padStart(2, '0');
const imp = (p) => import(pathToFileURL(path.join(RAIZ, p)).href);
// m0N.ts importa componentes (alias @/, TSX, CSS): empacotado com esbuild antes de importar.
async function impEmpacotado(rel) {
  const r = await build({ entryPoints: [path.join(RAIZ, rel)], bundle: true, format: 'esm', platform: 'node', write: false,
    alias: { '@': path.join(RAIZ, 'src') }, loader: { '.css': 'empty', '.webp': 'empty' }, jsx: 'automatic', logLevel: 'silent' });
  const tmp = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'v3-')), 'm.mjs');
  fs.writeFileSync(tmp, r.outputFiles[0].text);
  return import(pathToFileURL(tmp).href);
}
const { MODULO_V3 } = await impEmpacotado(`src/lib/alexandria/modulos-v3/m${NN}.ts`);
const cont = await imp(`src/lib/data/alexandria-modulo-${NN}-content.ts`);
const { CALCULADORAS } = await imp(`src/lib/data/calculadoras/m${NN}.ts`);
const CORPO = cont[`MODULO_${NN}_CORPO`];
const AULAS = cont[`MODULO_${NN}_AULAS`];
const INST = cont[`INSTRUMENTOS_MODULO_${NN}`];
const SEM_PREVISAO = { 2: ['m02-inst-01'], 3: ['m03-inst-01'] }[n];

const plano = (s) => String(s ?? '').replace(/<br\s*\/?>/g, ' ').replace(/<[^>]+>/g, '').replace(/&gt;/g, '>').replace(/&lt;/g, '<').replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim();
const planoDoBloco = (b) =>
  b.kind === 'titulo' ? `${b.numero ?? ''} ${b.texto}` : b.kind === 'formula' ? `${b.eq} ${b.desc ?? ''}` : b.kind === 'paragrafo' ? plano(b.html)
  : b.kind === 'nota' ? plano(b.html) : b.kind === 'lista' ? b.itens.map(plano).join(' ') : b.linhas.flat().map(plano).join(' ');
const blocos = (a) => (CORPO[`aula-${NN}-${String(a).padStart(2, '0')}`] ?? []).map(planoDoBloco);
const proc = fs.readFileSync(path.join(RAIZ, `docs/alexandria-v3/procedencia/m${NN}.md`), 'utf8');

const falhas = [];
const F = (m) => falhas.push(m);

for (const f of MODULO_V3.figuras) {
  const trecho = MODULO_V3.trechos[f.ancora];
  if (!trecho) { F(`${f.id}: âncora ${f.ancora} sem trecho`); continue; }
  const bs = blocos(f.aula);
  const i = bs.findIndex((p) => p.toLowerCase().includes(trecho.toLowerCase()));
  const esperado = Number((f.ancora.match(/-b(\d+)-/) || [])[1]);
  if (i !== esperado) F(`${f.id}: trecho «${trecho}» cai no bloco ${i}, a âncora diz ${esperado}`);
  if (f.classe === 'diagrama') {
    if (!MODULO_V3.diagramas[f.diagrama]) F(`${f.id}: diagrama ${f.diagrama} não registrado`);
  } else {
    for (const w of f.larguras ?? []) if (!fs.existsSync(path.join(RAIZ, 'public', `${f.arquivo}-${w}.webp`))) F(`${f.id}: falta ${f.arquivo}-${w}.webp`);
    const linha = proc.split('\n').find((l) => l.includes(`\`${f.id}\``));
    if (!linha || !/aprovado/.test(linha)) F(`${f.id}: sem linha "aprovado" em procedencia/m${NN}.md`);
  }
}

const nf = (v, c) => v.toLocaleString('pt-BR', { minimumFractionDigits: c, maximumFractionDigits: c });
for (const a of AULAS) {
  const num = Number(a.id.slice(-2));
  for (const inst of a.instruments) {
    const p = MODULO_V3.previsoes.find((x) => x.instrumentoId === inst.id);
    if (!p) { if (!SEM_PREVISAO.includes(inst.id)) F(`${inst.id}: sem previsão`); continue; }
    const bs = blocos(num);
    if (p.depoisDoBloco < 0 || p.depoisDoBloco >= bs.length) F(`${inst.id}: depoisDoBloco ${p.depoisDoBloco} fora da aula (${bs.length} blocos)`);
    for (const k of Object.keys(p.cenario)) if (!inst.fields.some((fl) => fl.id === k)) F(`${inst.id}: cenário com campo ${k} que o instrumento não tem`);
    const calc = CALCULADORAS[inst.id];
    for (const t of p.velar) if (!bs.some((b) => b.includes(t))) F(`${inst.id}: trecho a velar não existe: «${t}»`);
    if (p.grandeza.tipo === 'escolha') {
      // O calculado é texto da saída casado com uma opção; o nome das opções está na tela por desenho.
      const res = calc ? calc(p.cenario) : null;
      const calcTxt = String(res?.textos?.[p.grandeza.saida] ?? res?.valores?.[p.grandeza.saida] ?? '');
      if (!p.grandeza.opcoes.some((o) => o.valor === calcTxt || o.rotulo === calcTxt)) F(`${inst.id}: o calculado «${calcTxt}» não casa com nenhuma opção`);
      console.log(`  ${inst.id} · A${String(num).padStart(2, '0')} depois do bloco ${p.depoisDoBloco} · escolha · calculado ${calcTxt}`);
      continue;
    }
    const v = calc ? calc(p.cenario).valores[p.grandeza.saida] : undefined;
    if (!Number.isFinite(v)) { F(`${inst.id}: calculadora não devolve número para ${p.grandeza.saida}`); continue; }
    const resposta = nf(v, p.grandeza.casas);
    const velado = (b) => p.velar.some((t) => b.includes(t));
    const vaza = bs.map((b, i) => ({ b, i })).filter(({ b }) => !velado(b) && new RegExp(`(^|[^\\d,.])${resposta.replace(/[.,]/g, (c) => `\\${c}`)}([^\\d]|$)`).test(b));
    for (const { i } of vaza) F(`${inst.id}: o calculado (${resposta}) aparece no bloco ${i}, não velado`);
    // Cenário da nota/padrão: os campos do cenário batem com o padrão do instrumento?
    for (const [k, val] of Object.entries(p.cenario)) {
      const campo = inst.fields.find((fl) => fl.id === k);
      if (campo && String(campo.defaultValue) !== String(val) && !/nota/.test(p.origemDoCenario)) F(`${inst.id}: ${k}=${val} não é o padrão (${campo.defaultValue}) e a origem não é a nota`);
    }
    console.log(`  ${inst.id} · A${String(num).padStart(2, '0')} depois do bloco ${p.depoisDoBloco} · calculado ${resposta} ${p.grandeza.unidade ?? ''}${p.velar.length ? ` · velado: ${p.velar.join(' | ')}` : ''}`);
  }
}
console.log(`  figuras: ${MODULO_V3.figuras.length} (${MODULO_V3.figuras.filter((f) => f.classe === 'foto').length} fotos, ${MODULO_V3.figuras.filter((f) => f.classe === 'diagrama').length} diagramas) · previsões: ${MODULO_V3.previsoes.length} · pronto: ${MODULO_V3.pronto}`);
for (const f of falhas) console.log('  ✗ ' + f);
console.log(falhas.length ? `RESULTADO: ${falhas.length} falha(s)` : 'RESULTADO: 0 falhas');
process.exit(falhas.length ? 1 : 0);
