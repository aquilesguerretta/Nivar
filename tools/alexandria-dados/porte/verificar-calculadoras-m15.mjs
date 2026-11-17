// Confere src/lib/data/calculadoras/m15.ts (gerado por gerar-calculadoras-m15.mjs) em duas frentes:
//
//   · a lógica é a da função de origem por construção: o gerador copia o bloco byte a byte, troca
//     só o `return` e confere as contagens (o arquivo grande não carrega no Node: importa módulos
//     sem extensão). O acordo dessa lógica com o script a extração já mediu (`fidelidade`).
//   · TEXTOS × FONTE: nos instrumentos com readout (03–07, 09), cada `textos[id]` sem marcas é
//     IDÊNTICO ao texto que o <script> ORIGINAL escreve no readout, executado no mini-DOM, no
//     padrão, em varredura de cada campo e em cenários sorteados, para cada opção de seleção.
//   · VEREDITO × FONTE: o texto do veredito da fonte (`#xx-vd`) está no veredito da calculadora.
//
// Uso: node tools/alexandria-dados/porte/verificar-calculadoras-m15.mjs

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const imp = (p) => import(pathToFileURL(path.join(RAIZ, p)).href);
const { CALCULADORAS: NOVAS } = await imp('src/lib/data/calculadoras/m15.ts');
const { MODULO_15_INSTRUMENTOS, MODULO_15_AULAS } = await imp('src/lib/data/alexandria-modulo-15-content.ts');
const { carregarModulo } = await imp('tools/alexandria-dados/mini-dom.mjs');
const EXT = JSON.parse(fs.readFileSync(path.join(RAIZ, 'docs/alexandria-v2/extraction/m15/instrumentos.json'), 'utf8'));

const insts = [...new Map([...MODULO_15_INSTRUMENTOS, ...MODULO_15_AULAS.flatMap((a) => a.instruments)].map((i) => [i.id, i])).values()];
let semente = 15;
const aleat = () => ((semente = (semente * 1103515245 + 12345) % 2147483648) / 2147483648);
const sorteio = (f) => {
  if (f.kind === 'select') return f.options[Math.floor(aleat() * f.options.length)].value;
  const r = aleat();
  if (r < 0.05) return '';
  const lo = (f.min ?? 0) - 1, hi = (f.max ?? 100) + 1;
  return +(lo + aleat() * (hi - lo)).toFixed(3);
};
const falhas = [];
const norm = (s) => String(s ?? '').replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/[\s ]+/g, ' ').trim();

// 2 · textos × script da fonte
let tx = 0;
const mod = carregarModulo(15, { instrumentar: false });
for (const ext of EXT.instrumentos.filter((x) => x.saidas?.length)) {
  const inst = insts.find((x) => x.id === ext.id);
  const sels = ext.entradas.seletores ?? [];
  const nums = ext.entradas.numericas ?? [];
  const cenarios = [];
  const padrao = Object.fromEntries([...sels.map((s) => [s.id, s.padrao]), ...nums.map((n) => [n.id, n.padrao])]);
  let combos = [{}];
  for (const s of sels) combos = combos.flatMap((c) => s.opcoes.map((o) => ({ ...c, [s.id]: o.valor })));
  for (const c of combos) {
    cenarios.push({ ...padrao, ...c });
    for (const n of nums) for (let k = 0; k <= 40; k++) cenarios.push({ ...padrao, ...c, [n.id]: +(n.min + (k / 40) * (n.max - n.min)).toFixed(4) });
  }
  for (let k = 0; k < 300; k++) cenarios.push(Object.fromEntries([...sels.map((s) => [s.id, s.opcoes[Math.floor(aleat() * s.opcoes.length)].valor]), ...nums.map((n) => [n.id, +(n.min + aleat() * (n.max - n.min)).toFixed(3)])]));
  let erros = 0;
  for (const cen of cenarios) {
    for (const s of sels) {
      const b = mod.el(s.id)?.querySelectorAll('button').find((x) => x.attrs[s.atributo] === String(cen[s.id]));
      if (b) mod.disparar(b, 'click');
    }
    for (const n of nums) { const el = mod.el(n.id); el.value = String(cen[n.id]); mod.disparar(el, 'input'); }
    const r = NOVAS[ext.id](cen);
    const pre = ext.saidas[0].id.split('-')[0];
    const vd = norm(mod.texto(`${pre}-vd`) ?? '');
    tx++;
    if (!vd || !norm(r.veredito).includes(vd)) { if (erros++ < 4) falhas.push(`${ext.id} veredito: fonte «${vd.slice(0, 80)}» ausente em «${norm(r.veredito).slice(0, 80)}»`); }
    for (const o of ext.saidas) {
      tx++;
      const fonte = norm(mod.texto(o.id));
      const nosso = norm(r.textos?.[o.id]);
      if (fonte !== nosso) { if (erros++ < 4) falhas.push(`${ext.id} ${o.id}: fonte «${fonte}» × textos «${nosso}» em ${JSON.stringify(cen).slice(0, 140)}`); }
    }
  }
  if (inst && ext.saidas.some((o) => !inst.outputs.some((x) => x.id === o.id))) falhas.push(`${ext.id}: saída da fonte sem saída no instrumento`);
  console.log(`${ext.id}: ${cenarios.length} cenários × ${ext.saidas.length} readouts, ${erros} divergência(s)`);
}
if (mod.erros.length) falhas.push(`erro no script da fonte: ${mod.erros.map((e) => e.msg).join('; ')}`);
for (const f of falhas) console.log(`   ✗ ${f}`);
console.log(`textos × fonte: ${tx} comparações`);
console.log(falhas.length ? `RESULTADO: ${falhas.length} falha(s)` : 'RESULTADO: 0 falhas');
process.exit(falhas.length ? 1 : 0);
