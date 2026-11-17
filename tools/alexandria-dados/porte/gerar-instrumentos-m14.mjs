// Gera, a partir de docs/alexandria-v2/extraction/m14/instrumentos.json (extração
// verificada), as duas partes DE DADO dos 10 instrumentos do M14:
//
//   1. MODULO_14_INSTRUMENTOS em src/lib/data/alexandria-modulo-14-content.ts —
//      campos (rótulo, unidade, padrão, faixa, passo, opções), saídas e nota, todos
//      literais da extração. Número vira `range` (a fonte tem number + range gêmeos);
//      seleção vira `select`.
//   2. As tabelas literais do script (ROTAS, PERFIS, D, BASES, EST, R, C, DEST, M, S,
//      E, LB) no bloco <dados-gerados> de src/lib/data/calculadoras/m14.ts.
//
// A LÓGICA das calculadoras é escrita à mão em calculadoras/m14.ts (transliteração do
// script) e conferida pelo script executado (verificar-instrumentos-m14.mjs).
//
// Uso: node tools/alexandria-dados/porte/gerar-instrumentos-m14.mjs [--escrever]

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const EXT = JSON.parse(fs.readFileSync(path.join(RAIZ, 'docs/alexandria-v2/extraction/m14/instrumentos.json'), 'utf8'));
const ESCREVER = process.argv.includes('--escrever');
const inst = (n) => EXT.instrumentos.find((i) => i.id === `m14-inst-${String(n).padStart(2, '0')}`);
const limpar = (h) => String(h ?? '').replace(/GridAlpha/g, 'NIVAR').replace(/<(\/?)(span|small|a|div)\b[^>]*>/gi, ' ').replace(/<(\w+)\s+(?:class|style|id)="[^"]*"\s*>/g, '<$1>').replace(/\s+/g, ' ').replace(/ ([,.;:)])/g, '$1').trim();
const dado = (n, nome) => {
  const d = inst(n).dados_do_script?.[nome];
  if (!d) throw new Error(`INST·${n}: dado ${nome} ausente na extração`);
  return d.valor;
};

// Unidade de cada saída numérica: lida do formato do script (o sufixo/prefixo que ele
// cola no número). Saída sem número (texto puro) fica fora de `outputs` e entra no
// veredito com o rótulo da fonte (ver calculadoras/m14.ts).
const UNIDADE = {
  'pd-ix': '%', 'pd-ef': '%', 'pd-cg': 'R$/km', 'pd-ce': 'R$/km', 'pd-df': '%',
  'mx-pr': '%', 'mx-de': 'p.p.',
  'dm-q1': 'bi L', 'dm-q2': 'bi L', 'dm-pp': 'bi L / p.p.', 'dm-fo': 'bi L',
  'cg-p1': 'MW', 'cg-p2': 'GWh', 'cg-p3': 'GWh', 'cg-fc': '%', 'cg-fs': '%',
  'bm-en': 'TJ/ano', 'bm-lg': 'R$/Nm³', 'bm-mg': 'R$/Nm³', 'bm-es': 'mi Nm³/ano',
  'cb-en': 'TJ', 'cb-ev': 't CO₂e', 'cb-qt': 'CBIO / unid.', 'cb-rc': 'R$ mi', 'cb-mg': 'R$/L ou Nm³',
};
// Saídas de texto (o script escreve palavra, não número): entram no veredito.
// Saídas que o script escreve como palavra, não número: entram com unidade null (a tela
// mostra o texto de `textos`, com a formatação do script).
const SAIDA_TEXTO = new Set(['mx-fa', 'mx-di']);
// Painéis dos exploradores: o script os monta (innerHTML), sem saída no markup. Cada campo
// do painel vira uma saída textual com o rótulo que o script escreve (linha citada).
const PAINEL = {
  1: [ // pinta(), L3386–L3397; o agrupamento vem do rótulo do seletor mp-dim (L951)
    ['mp-grupo', 'Ordenar as rotas por'], ['mp-insumo', 'Insumo'], ['mp-conv', 'Conversão'], ['mp-prod', 'Produto'],
    ['mp-merc', 'Mercado'], ['mp-org', 'Órgão'], ['mp-matriz', 'Onde entra na matriz'],
    ['mp-conc', 'Produto concorrente pelo mesmo insumo'], ['mp-nota', 'O que a rota exige que se pergunte'],
  ],
  4: [['rt-a', 'Etanol de cana · 1G'], ['rt-b', 'Etanol de milho'], ['rt-c', 'Etanol de 2ª geração']], // L3596–L3600
  9: [['cl-insumo', 'Insumo'], ['cl-destino', 'Destino'], ['cl-estado', 'Estado da combinação'], ['cl-deixa', 'O que deixa de ser feito']], // L4099–L4103
  // L4203–L4210. O cartão do enunciado não tem rótulo na fonte: "Enunciado" é voz da Alexandria.
  10: [['vf-en', 'Enunciado'], ['vf-df', 'Defeito dominante'], ['vf-cat', 'Categoria'], ['vf-fa', 'O que exatamente falta'], ['vf-pg', 'A pergunta que você faz'], ['vf-co', 'Forma corrigida']],
};

// Seleções que o script MONTA (chips) em vez de vir no markup: id do contêiner,
// rótulo lido do markup que o antecede, opções lidas da tabela do script.
const CHIPS = {
  1: { id: 'mp-chips', rotulo: 'Rota', opcoes: () => Object.entries(dado(1, 'ROTAS')).map(([k, r]) => ({ value: k, label: r.n })), padrao: 'cana1g' },
  9: { id: 'cl-dest', rotulo: 'Destino:', opcoes: () => dado(9, 'DEST').map((d) => ({ value: d.k, label: d.n })), padrao: 'acucar' },
  // Rótulo do chip do INST·10 = o do script (enunciado sem aspas, cortado em 58).
  // A etiqueta `y` (categoria do defeito) NÃO entra: ela entrega a resposta antes do
  // compromisso (QA-M14-03; decisão de porte registrada em docs/alexandria-v3/porte/m14.md).
  10: { id: 'vf-chips', rotulo: 'Enunciado', opcoes: () => dado(10, 'E').map((e) => ({ value: e.k, label: e.n.replace(/^“|”$/g, '').slice(0, 58) + (e.n.length > 60 ? '…' : '') })), padrao: 'e1' },
};

function campos(n) {
  const i = inst(n);
  const out = [];
  const sels = i.entradas.selecoes;
  if (n === 4) {
    // rt-dim e rt-dim2 são um só controle na fonte (clicar num limpa o outro): uma
    // dimensão entre sete. O markup acende duas (div-m14-inst04-dois-on); o script
    // apaga rt-dim2 ao carregar — vale o script: "insumo".
    out.push({ id: 'rt-dim', label: sels[0].rotulo.replace(/:$/, ''), unit: null, kind: 'select', defaultValue: 'insumo', options: [...sels[0].opcoes, ...sels[1].opcoes].map((o) => ({ value: o.valor, label: o.rotulo })) });
  } else {
    for (const s of sels) {
      const ativo = s.opcoes.find((o) => o.ativo_no_markup) ?? s.opcoes[0];
      out.push({ id: s.id, label: s.rotulo.replace(/:$/, ''), unit: null, kind: 'select', defaultValue: ativo.valor, options: s.opcoes.map((o) => ({ value: o.valor, label: o.rotulo })) });
    }
  }
  if (CHIPS[n]) {
    const c = CHIPS[n];
    out.push({ id: c.id, label: c.rotulo.replace(/:$/, ''), unit: null, kind: 'select', defaultValue: c.padrao, options: c.opcoes() });
  }
  for (const c of i.entradas.campos) out.push({ id: c.id, label: c.rotulo, unit: c.unidade ?? null, kind: 'range', defaultValue: c.padrao, min: c.min, max: c.max, step: c.step });
  return out;
}

const KIND = { explorador: 'explorador', calculadora: 'calculadora', simulador: 'simulador', comparador: 'comparador' };

function registro(n) {
  const i = inst(n);
  const intro = i.tarefa_declarada?.html ?? null;
  const rodape = i.nota_rodape?.html ?? null;
  return {
    id: i.id,
    kind: KIND[i.kind_sugerido] ?? 'explorador',
    // Instrumento do §MAP: entra na Aula 01 com o rótulo "§MAP" (regra de colocação, PORTE-POR-MODULO.md)
    title: n === 1 ? `§MAP · ${limpar(i.titulo)}` : limpar(i.titulo),
    formula: null,
    fields: campos(n),
    outputs: [
      ...i.saidas.map((o) => {
        if (SAIDA_TEXTO.has(o.id)) return { id: o.id, label: limpar(o.rotulo), unit: null };
        if (!(o.id in UNIDADE)) throw new Error(`INST·${n}: saída ${o.id} sem unidade declarada`);
        return { id: o.id, label: limpar(o.rotulo), unit: UNIDADE[o.id] };
      }),
      ...(PAINEL[n] ?? []).map(([id, label]) => ({ id, label, unit: null })),
    ],
    note: [intro, rodape].filter(Boolean).map(limpar).join('<br><br>') || null,
  };
}

const registros = Array.from({ length: 10 }, (_, k) => registro(k + 1));
for (const r of registros) {
  for (const f of r.fields) if (f.kind === 'select' && !f.options.some((o) => o.value === f.defaultValue)) throw new Error(`${r.id}/${f.id}: padrão fora das opções`);
  console.log(`${r.id}: ${r.fields.length} campos (${r.fields.filter((f) => f.kind === 'select').length} seleção) · ${r.outputs.length} saídas · nota ${r.note ? r.note.length : 0} car.`);
}

const TABELAS = [
  [1, 'ROTAS'], [1, 'ORD'], [1, 'GK'], [3, 'PERFIS'], [4, 'D'], [5, 'BASES'], [5, 'EST'],
  [7, 'R'], [8, 'R'], [8, 'C'], [9, 'DEST'], [9, 'M'], [9, 'S'], [10, 'E'], [10, 'LB'],
];
const blocoDados = [
  '// <dados-gerados>',
  '// GERADO por tools/alexandria-dados/porte/gerar-instrumentos-m14.mjs a partir de',
  '// docs/alexandria-v2/extraction/m14/instrumentos.json (`dados_do_script`, literais avaliados do',
  '// script da fonte). Não editar à mão: rode o gerador.',
  ...TABELAS.map(([n, nome]) => {
    const i = inst(n).dados_do_script[nome];
    return `/** INST·${String(n).padStart(2, '0')} · \`${nome}\` (L${i.linha_ini}–L${i.linha_fim}). */\nconst I${String(n).padStart(2, '0')}_${nome} = ${JSON.stringify(i.valor, null, 2)} as const;`;
  }),
  '// </dados-gerados>',
].join('\n');

// O rótulo "§MAP" é pedido pela regra de colocação (PORTE-POR-MODULO.md, 15/11) e o auditor o
// lê como vocabulário interno (S4): supressão com a razão, e o conflito vai ao relatório.
const tsInst = `export const MODULO_14_INSTRUMENTOS: Instrument[] = ${JSON.stringify(registros, null, 2)};\n`.replace(
  /\n( *)"title": "§MAP/,
  '\n$1// gridalpha-detect-disable-next-line alexandria-no-internal-vocabulary — rótulo "§MAP" do instrumento do mapa do módulo, pedido pela regra de colocação (PORTE-POR-MODULO.md, 15/11)\n$1"title": "§MAP',
);

if (ESCREVER) {
  const arq = path.join(RAIZ, 'src/lib/data/alexandria-modulo-14-content.ts');
  const cru = fs.readFileSync(arq, 'utf8');
  const crlf = cru.includes('\r\n');
  let ts = cru.replace(/\r\n/g, '\n');
  // sai de onde estiver e entra ANTES de MODULO_14_AULAS, que o referencia (const: sem hoisting)
  const ini = ts.indexOf('export const MODULO_14_INSTRUMENTOS');
  if (ini < 0) throw new Error('MODULO_14_INSTRUMENTOS não encontrado');
  const fimVazio = ts.indexOf('= [];', ini);
  const fimCheio = ts.indexOf('\n];\n', ini);
  const fim = fimVazio >= 0 && (fimCheio < 0 || fimVazio < fimCheio) ? fimVazio + '= [];'.length + 1 : fimCheio + 4;
  ts = ts.slice(0, ini) + ts.slice(fim);
  const aulas = ts.indexOf('export const MODULO_14_AULAS');
  if (aulas < 0) throw new Error('MODULO_14_AULAS não encontrado');
  ts = ts.slice(0, aulas) + tsInst + '\n' + ts.slice(aulas);
  // aula → instrumentos, na ordem em que a aula os monta (o primeiro é o da prosa da aula)
  const POR_AULA = { 1: [2, 1], 2: [3], 3: [4], 4: [5], 5: [6], 6: [7], 7: [8], 8: [9, 10] };
  for (const [aula, ns] of Object.entries(POR_AULA)) {
    const id = `id: "aula-14-0${aula}"`;
    const p = ts.indexOf(id);
    const q = ts.indexOf('instruments:', p);
    const r = ts.indexOf('\n', q);
    const refs = ns.map((n) => `MODULO_14_INSTRUMENTOS.find((x) => x.id === 'm14-inst-${String(n).padStart(2, '0')}')!`).join(', ');
    ts = ts.slice(0, q) + `instruments: [${refs}],` + ts.slice(r);
  }
  fs.writeFileSync(arq, crlf ? ts.replace(/\n/g, '\r\n') : ts);

  const calc = path.join(RAIZ, 'src/lib/data/calculadoras/m14.ts');
  let c = fs.readFileSync(calc, 'utf8').replace(/\r\n/g, '\n');
  // marcadores em linha própria (o cabeçalho do arquivo pode citar o nome do bloco)
  const a = c.indexOf('\n// <dados-gerados>\n');
  const b = c.indexOf('\n// </dados-gerados>\n');
  if (a < 0 || b < 0 || b < a) throw new Error('marcadores <dados-gerados> ausentes em calculadoras/m14.ts');
  c = c.slice(0, a + 1) + blocoDados + c.slice(b + '\n// </dados-gerados>'.length);
  fs.writeFileSync(calc, c);
  console.log('escrito:', arq, calc);
}
