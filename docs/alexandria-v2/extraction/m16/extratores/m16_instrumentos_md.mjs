// Gera instrumentos.md a partir de instrumentos.json (nenhum texto de conteúdo digitado aqui:
// títulos, intros, rótulos, unidades, faixas, fórmulas e vereditos vêm do JSON, que vem da fonte).
// A coluna `kind candidato` é ANOTAÇÃO desta extração (instrument-taxonomy.md), para revisão humana.
import fs from 'node:fs';
import { OUTDIR } from './lib.mjs';

const I = JSON.parse(fs.readFileSync(`${OUTDIR}/instrumentos.json`, 'utf8'));
const esc = (s) => String(s ?? '').replace(/\|/g, '\\|').replace(/\n/g, ' ');
const fmtNum = (s) => String(s).replace('.', ',');

// anotação (não é fonte): kind candidato pela mecânica medida, segundo docs/alexandria/instrument-taxonomy.md
const KIND = {
  'INST·01': 'explorador (seleção × seleção → texto; reordena a fila)',
  'INST·02': 'explorador (seleção × seleção → texto + veredito por comparação)',
  'INST·03': 'comparador (5 candidatos lado a lado para a tendência escolhida)',
  'INST·04': 'simulador (campo → readout → veredito)',
  'INST·05': 'simulador (ou dimensionador, cf. M03; revisar)',
  'INST·06': 'simulador (campo → readout → veredito)',
  'INST·07': 'explorador (chip → texto)',
  'INST·08': 'comparador (dois métodos sempre lado a lado, com campos numéricos)',
  'INST·09': 'simulador (campo → readout → veredito)',
  'INST·10': 'explorador (seleção × seleção → texto)',
  'INST·11': 'explorador com filtro (chip → cartão); nenhuma resposta do learner é conferida',
};

const L = [];
const p = (s = '') => L.push(s);
p('# M16 · grupo "instrumentos"');
p();
p('- **Fonte (só leitura):** `C:/dev/GridAlpha v2/Alexandria modulos/alexandria_modulo16.html`.');
p('- **Saída:** [`instrumentos.json`](instrumentos.json).');
p('- **Extratores:** [`extratores/m16_instrumentos.mjs`](extratores/m16_instrumentos.mjs) (dados) e');
p('  [`extratores/m16_instrumentos_md.mjs`](extratores/m16_instrumentos_md.mjs) (este arquivo).');
p();
p('## Método');
p();
p('- **Marcação.** Cada `div.inst` é lido do HTML: título (`span.nm`), intro (`p.inst-intro`), campos, readouts e nota de');
p('  rodapé (`p.disc`). O lugar de invocação é a seção e a última subseção `h3` antes do instrumento.');
p('- **Script.** As linhas de leitura, cálculo, formatação e veredito estão em `logica`, copiadas do `<script>` com o');
p('  número de linha. Os dados literais (`var X={…}`) foram avaliados sem alteração e estão em `dados`.');
p('- **Execução.** O `<script>` original foi executado num DOM simulado (`lib.mjs/runScript`, protocolo §10). Isso gerou o');
p('  `cenario_padrao` (todos os readouts e o veredito com os valores iniciais) e as `renderizacoes` dos instrumentos de');
p('  texto (todas as combinações).');
p('- **Ramos.** Nos 5 numéricos, `ramos_alcancados` vem de 2^n cantos (mín./máx.) mais 4.000 combinações');
p('  pseudoaleatórias na grade de `step` de cada campo. A assinatura de cada ramo é a classe do veredito mais as frases em');
p('  `<b>`.');
p('- **Pergunta e tolerância.** Nenhum dos 11 instrumentos formula pergunta ao learner nem declara tolerância. Por isso');
p('  `pergunta` e `tolerancias` são `null`, com nota. Nenhuma pergunta foi derivada aqui (P17 e P19 valem na camada');
p('  Alexandria).');
p();
p('## Visão geral');
p();
p('| Id | Título (literal) | Onde é invocado | Mecânica (anotação) | `kind` candidato (anotação) | Código |');
p('|---|---|---|---|---|---|');
for (const i of I.instrumentos) {
  const inv = i.invocacao || {};
  const onde = i.escopo === 'modulo'
    ? `§MAP (módulo, fora de aula) · L${i.titulo.origem.linha_aprox}`
    : `${inv.aula} · depois de "${esc(inv.subsecao_anterior?.texto)}" · L${i.titulo.origem.linha_aprox}`;
  p(`| ${i.codigo_fonte} | ${esc(i.titulo.texto)} | ${onde} | ${esc(String(i.mecanica).replace(/^anotação: /, ''))} | ${esc(KIND[i.codigo_fonte])} | ${i.codigo_atual.status} |`);
}
p();
const c = I.contagens;
p(`**Contagens.** São ${c.instrumentos} instrumentos: ${c.de_modulo} de módulo e ${c.de_aula} de aula; ${c.numericos} numéricos e ${c.selecao_texto} de seleção e texto.`);
p(`As aulas sem instrumento são ${c.aulas_sem_instrumento.join(' e ')}, e a aula-16-07 e a aula-16-10 têm dois cada.`);
p(`No código: ${c.portados_no_codigo} portados, ${c.nao_portados} não portados e ${c.divergentes} divergentes. \`MODULO_16_INSTRUMENTOS\` é \`[]\`,`);
p('as 10 aulas têm `instruments: []` e `alexandria-instrument-calculators.ts` não tem calculadora do M16.');
p();

for (const i of I.instrumentos) {
  p(`## ${i.codigo_fonte} · ${i.titulo.texto}`);
  p();
  const inv = i.invocacao || {};
  p(`- **Invocação.** Seção \`${inv.secao_id}\` ("${esc(inv.sec_id?.texto)}"), h2 "${esc(inv.h2?.texto)}".`);
  if (inv.subsecao_anterior) p(`  Vem depois da subseção "${esc(inv.subsecao_anterior.texto)}". Título na L${i.titulo.origem.linha_aprox}.`);
  else p(`  Fica fora de aula, em Recursos do Módulo. Título na L${i.titulo.origem.linha_aprox}.`);
  p(`- **Pergunta.** \`null\`. ${i.nota_pergunta}`);
  if (i.intro) p(`- **Intro (literal).** "${esc(i.intro.texto)}"`);
  if (i.nota_de_rodape) p(`- **Nota de rodapé (literal).** "${esc(i.nota_de_rodape.texto)}"`);
  p(`- **Tolerância.** \`null\`. ${i.nota_tolerancias}`);
  p(`- **Código.** ${i.codigo_atual.status}.${i.codigo_atual.nota ? ' ' + i.codigo_atual.nota : ''}`);
  p();
  // entradas
  const nums = (i.entradas || []).filter((e) => e.numero);
  const segs = (i.entradas || []).filter((e) => !e.numero);
  if (nums.length) {
    p('**Entradas numéricas** (número com deslizador gêmeo; faixa e passo do campo número):');
    p();
    p('| Rótulo | Unidade | Id | Mín. | Máx. | Passo | Padrão |');
    p('|---|---|---|---|---|---|---|');
    for (const e of nums) {
      const n = e.numero;
      const passo = e.passos_iguais ? fmtNum(n.step) : `${fmtNum(n.step)} (deslizador: ${fmtNum(e.deslizador.step)})`;
      p(`| ${esc(e.rotulo)} | ${esc(e.unidade)} | \`${n.id_fonte}\` | ${fmtNum(n.min)} | ${fmtNum(n.max)} | ${passo} | ${fmtNum(n.value)} |`);
    }
    p();
  }
  for (const e of segs) {
    const rot = e.rotulo?.texto ?? '(sem rótulo)';
    if (Array.isArray(e.opcoes)) {
      const ops = e.opcoes.map((o) => `${o.rotulo}${o.rotulo_secundario ? ` (${o.rotulo_secundario})` : ''}${o.padrao ? ' [padrão]' : ''}`).join(' · ');
      p(`- **${e.tipo}** \`${e.id_fonte}\`, "${esc(rot)}", com ${e.opcoes.length} opções: ${esc(ops)}.`);
    } else {
      p(`- **${e.tipo}** \`${e.id_fonte}\`: ${esc(e.opcoes)}.`);
    }
  }
  if (segs.length) p();
  // saídas e fórmulas
  const s = i.saidas;
  if (s && s.readouts) {
    p('**Saídas (readouts)**, com o valor no cenário-padrão, obtido pela execução do script original:');
    p();
    p('| Id | Rótulo | Cenário-padrão |');
    p('|---|---|---|');
    const cp = new Map((i.cenario_padrao?.saidas || []).map((x) => [x.id_fonte, x.texto]));
    for (const r of s.readouts) p(`| \`${r.id_fonte}\` | ${esc(r.rotulo.texto)} | ${esc(cp.get(r.id_fonte))} |`);
    const extra = (i.cenario_padrao?.saidas || []).filter((x) => !s.readouts.some((r) => r.id_fonte === x.id_fonte));
    for (const x of extra) p(`| \`${x.id_fonte}\` | ${esc(x.rotulo ?? '(coluna/barra)')} | ${esc(x.texto)} |`);
    p();
  } else if (Array.isArray(s)) {
    for (const o of s) p(`- Saída \`${o.id_fonte}\`${o.tipo ? ` (${o.tipo})` : ''}${o.rotulos_fixos ? `: rótulos fixos ${o.rotulos_fixos.map((x) => `"${x}"`).join(', ')}` : ''}${o.descricao ? ` · ${o.descricao}` : ''}.`);
    p();
  }
  if (i.logica) {
    p('**Fórmulas exatas do script** (`logica.calculo`, verbatim, com o número da linha):');
    p();
    p('```js');
    for (const ln of i.logica.calculo || []) p(`/* L${ln.linha} */ ${ln.codigo.trim()}`);
    p('```');
    p();
    p('A leitura das entradas, a formatação e o veredito completo estão em `logica` no JSON.');
    p();
  }
  if (i.cenario_padrao) {
    const cp = i.cenario_padrao;
    p(`**Cenário-padrão.** Entradas: ${Object.entries(cp.entradas).map(([k, v]) => `\`${k}\`=${v}`).join(', ')}.`);
    if (cp.veredito) p(`Veredito (\`${cp.veredito.classe}\`): "${esc(cp.veredito.texto)}"`);
    if (cp.painel_texto) p(`Painel (texto renderizado, início): "${esc(cp.painel_texto.slice(0, 220))}…"`);
    if (cp.cartao_texto) p(`Cartão (texto renderizado, início): "${esc(cp.cartao_texto.slice(0, 220))}…"`);
    p();
  }
  if (i.ramos_alcancados) {
    const ach = i.ramos_alcancados.achados;
    p(`**Ramos do veredito alcançados (${ach.length}):**`);
    p();
    for (const a of ach) p(`- \`${a.classe}\`: ${esc(a.assinatura.replace(/^[^:]+:: /, ''))}`);
    p();
  }
  if (i.renderizacoes) p(`**Renderizações.** ${i.renderizacoes.length} combinações renderizadas e guardadas no JSON (\`renderizacoes\`).${i.contagens ? ' Contagens: ' + esc(JSON.stringify(i.contagens)) + '.' : ''}`), p();
  const f = i.fonte_dos_numeros;
  p(`**Fonte dos números.** ${f.texto ? `"${esc(f.texto)}"` : '`null`.'} Nota: ${esc(f.nota)}`);
  p();
  if (i.divergencias_locais && i.divergencias_locais.length) {
    p('**Divergência local (fonte × fonte, registrada e não corrigida):**');
    for (const d of i.divergencias_locais) {
      if (d.campo) p(`- No campo "${d.campo}", o passo do número é ${fmtNum(d.numero.step)} e o do deslizador é ${fmtNum(d.deslizador.step)}. Arrastar o deslizador pula de ${fmtNum(d.deslizador.step)} em ${fmtNum(d.deslizador.step)}, e digitar aceita qualquer inteiro.`);
      else p(`- ${esc(JSON.stringify(d))}`);
    }
    p();
  }
}

p('## Comparação com o catálogo canônico');
p();
p('- **Títulos.** Os 11 títulos da tabela "Instrumentos" do catálogo (`catalogo-modulos-alexandria.md`, Módulo 16) são iguais');
p('  aos `span.nm` da fonte. A comparação foi feita por programa: 11 de 11.');
p('- **Descrições.** As do catálogo são paráfrases que concordam com a mecânica medida: 4 dimensões; 30 células; 30');
p('  combinações; padrões 167.026 e 939 TWh; 30 MW, 4 h e 366 ciclos; dispositivos nos 4 estados de política (a fonte');
p('  tem 15, e o catálogo não dá número); 12 enunciados, 3 por categoria.');
p('- **Resultado.** Não há divergência de conteúdo. O catálogo também registra que os 11 "não estão extraídos", o que');
p('  confere com o código.');
p();
p('## Lacunas');
p();
p('- **Pergunta ao learner e tolerância.** Nenhum dos 11 declara. Pelo P19, uma pergunta de previsão ou uma regra de');
p('  pontuação é da camada Alexandria.');
p('- **Fonte dos padrões numéricos.** Só é declarada em parte:');
p('  - o INST·04 declara 167.026 e 939 TWh;');
p('  - o INST·05 declara 30 MW, 4 h e 366 ciclos;');
p('  - os demais padrões não têm fonte ligada (ver a nota de cada um).');
p('  Pelo P19, esses números são "cenário didático presente no módulo".');
p('- **Desenho.** Barras e colunas não portam como desenho (protocolo §12). O conteúdo textual e numérico delas está');
p('  em `cenario_padrao` e em `logica`.');
p('- **Saída textual.** INST·01, 02, 03, 07, 10 e 11 não têm saída numérica. A saída deles é texto e não cabe em');
p('  `valores` (protocolo §12).');
p();
fs.writeFileSync(`${OUTDIR}/instrumentos.md`, L.join('\n'), 'utf8');
console.log('instrumentos.md', L.length, 'linhas');
