// Gera INSTRUMENTOS_MODULO_05 em src/lib/data/alexandria-modulo-05-content.ts a partir do
// markup dos seis instrumentos no HTML original (fonte-html-m04-m05.mjs) e do script
// (sinais do INST·04, em src/lib/data/calculadoras/m05.ts, porte verbatim).
//
// Campo: id = o do <input type="range"> que o script lê (D03: `i1-n`, não `i1`); rótulo,
// unidade, padrão, mínimo, máximo e passo do markup. Saída: os 24 readouts da fonte, na
// ordem dela; a calculadora devolve todos em `textos` (formatação verbatim da fonte, é o que
// a tela mostra) e os numéricos também em `valores` (previsão), na escala que `unit` declara.
// Os 4 textuais (i2-b, i4-r, i6-q, i6-r) têm `unit: null`. Nota = intro + disclaimer da fonte; no
// INST·04, mais a descrição literal dos oito sinais (a fonte a mostra ao lado de cada caixa).
//
// INST·04: os oito sinais são caixas de marcar na fonte; aqui, campos de escolha (`select`,
// que a aula v3 desenha como grupo de opções) com "não marcado" ('0') e "marcado" ('1') —
// a palavra "marcado" é a do próprio veredito da fonte ("Nenhum sinal marcado").
//
// Uso: node tools/alexandria-dados/porte/gerar-instrumentos-m05.mjs [--seco]
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { instrumentosDaFonte, editorial, RAIZ } from './fonte-html-m04-m05.mjs';
import { carregarModulo } from '../mini-dom.mjs';

const { SINAIS_M05_INST04 } = await import(pathToFileURL(path.join(RAIZ, 'src/lib/data/calculadoras/m05.ts')).href);

// Unidade de cada saída numérica, na escala da calculadora (calculadoras/m05.ts).
// null = a fonte escreve o número sem unidade (índice adimensional; ver a nota do instrumento).
const UNIDADE = {
  'i1-cm': 'R$/ano', 'i1-c1': 'R$/ano', 'i1-w': 'R$/ano', 'i1-tf': 'R$ mi',
  'i2-r': null, 'i2-k': null, 'i2-t': null, 'i2-b': null,
  'i3-e': 'R$/MWh', 'i3-w': 'R$/MWh', 'i3-a': 'R$/MWh', 'i3-d': '%',
  'i4-n': '/8', 'i4-o': '/100', 'i4-e': 'R$ mi/ano', 'i4-r': null,
  'i5-p': 'R$ mi', 'i5-c': 'R$/MWh', 'i5-s': 'R$ mi/ano', 'i5-f': 'R$ mi',
  'i6-q': null, 'i6-co': '/100', 'i6-d': null, 'i6-r': null,
};
const KIND = { Simulador: 'simulador', 'Termômetro': 'quebra-cabeca', Mapa: 'simulador' };

const m = carregarModulo(5, { instrumentar: false });
const js = (s) => JSON.stringify(s);
const linhas = instrumentosDaFonte(5).map((f) => {
  const id = `m05-inst-0${f.ordem}`;
  const campos = f.campos.map((c) => {
    const r = m.el(c.id.replace(/-n$/, ''));
    return `      { id: ${js(r.id)}, label: ${js(editorial(c.rotulo))}, unit: ${js(c.unidade)}, kind: "range", defaultValue: ${Number(r.value)}, min: ${Number(r.min)}, max: ${Number(r.max)}, step: ${Number(r.step)} },`;
  });
  if (f.ordem === 4) {
    SINAIS_M05_INST04.forEach((s, k) => campos.push(`      { id: "i4-s${k}", label: ${js(s.t)}, unit: null, kind: "select", defaultValue: "0", options: [{ value: "0", label: "não marcado" }, { value: "1", label: "marcado" }] },`));
  }
  const saidas = f.saidas.filter((s) => s.id in UNIDADE).map((s) => `      { id: ${js(s.id)}, label: ${js(editorial(s.rotulo))}, unit: ${js(UNIDADE[s.id])} },`);
  let nota = `${f.intro}<br><br>${f.disc}`;
  if (f.ordem === 4) nota = `${f.intro}<br><br>${SINAIS_M05_INST04.map((s) => `<b>${s.t}.</b> ${s.d}`).join('<br>')}<br><br>${f.disc}`;
  const genero = f.titulo.split(' · ')[0];
  return `  {
    id: ${js(id)},
    kind: ${js(KIND[genero] ?? 'simulador')},
    title: ${js(editorial(f.titulo))},
    formula: null,
    fields: [
${campos.join('\n')}
    ],
    outputs: [
${saidas.join('\n')}
    ],
    note: ${js(editorial(nota))},
  },`;
});

const bloco = `// ── INÍCIO DO TRECHO GERADO (gerar-instrumentos-m05.mjs) ──
// Os seis instrumentos, do markup da fonte. Não editar à mão: ver o gerador.
export const INSTRUMENTOS_MODULO_05: Instrument[] = [
${linhas.join('\n')}
];
// ── FIM DO TRECHO GERADO (gerar-instrumentos-m05.mjs) ──`;

const arq = path.join(RAIZ, 'src/lib/data/alexandria-modulo-05-content.ts');
let src = fs.readFileSync(arq, 'utf8');
const MI = '// ── INÍCIO DO TRECHO GERADO (gerar-instrumentos-m05.mjs) ──';
const MF = '// ── FIM DO TRECHO GERADO (gerar-instrumentos-m05.mjs) ──';
let ini = src.indexOf(MI);
let fim = src.indexOf(MF);
if (ini >= 0 && fim > ini) fim += MF.length;
else {
  ini = src.indexOf('export const INSTRUMENTOS_MODULO_05');
  fim = src.indexOf('\n];', ini) + 3;
  if (ini < 0 || fim < 3) throw new Error('INSTRUMENTOS_MODULO_05 não encontrado');
}
src = src.slice(0, ini) + bloco + src.slice(fim);
if (!process.argv.includes('--seco')) fs.writeFileSync(arq, src);
console.log(`INSTRUMENTOS_MODULO_05: ${linhas.length} instrumentos`);
