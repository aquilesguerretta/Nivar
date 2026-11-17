// Gera instrumentos.md a partir de instrumentos.json. Rótulos, faixas, código e textos
// saem do JSON (que saiu da fonte); a prosa de moldura é anotação desta extração.
import fs from 'node:fs';

const OUT = 'C:/dev/gridalpha-v2-alexandria-v2-restructure/docs/alexandria-v2/extraction/m03';
const J = JSON.parse(fs.readFileSync(`${OUT}/instrumentos.json`, 'utf8'));
const V = JSON.parse(fs.readFileSync(`${OUT}/verificacao.json`, 'utf8'));
const esc = (s) => String(s ?? '—').replace(/\|/g, '\\|').replace(/\n/g, ' ');
const code = (s) => '`' + String(s).replace(/`/g, "'").replace(/\|/g, '\\|') + '`';
const br = (n) => n.toLocaleString('pt-BR');

const out = [];
const p = (...l) => out.push(...l);

p('# M03 · Grupo "instrumentos"', '');
p(`**Fonte (só leitura):** \`${J.fonte.arquivo}\` (${br(J.fonte.linhas_total)} linhas; \`<script>\` L${J.fonte.script.inicio}–L${J.fonte.script.fim}).`);
p('**Arquivo gerado:** [`instrumentos.json`](instrumentos.json). **Data:** ' + J.gerado_em + '.');
p('**Gerado por:** `extratores/m03_instrumentos.mjs` (dados) e `extratores/m03_md_instrumentos.mjs` (este arquivo).', '');
p('## Método', '');
p('- **Markup:** entradas, saídas, nota e posição na aula lidas linha a linha do `div.instrument`.');
p('- **Script:** o IIFE de cada instrumento está verbatim em `script.codigo_verbatim`. Os ramos de leitura (condição → texto) estão em `ramos_de_leitura`, com as condições envolventes e os irmãos anteriores.');
p('- **Execução (protocolo §10):** o script original rodou em `node:vm` com DOM simulado. O cenário-padrão usa os `value` do markup. A varredura cobre **todo** o espaço finito (min/max/step de cada campo, todas as pílulas, seleções e chaves).');
p('- **Código:** a definição em `alexandria-modulo-03-content.ts` e a calculadora em `alexandria-instrument-calculators.ts` (avaliada com `module.stripTypeScriptTypes`) foram comparadas com o original sobre o **mesmo** espaço de entrada.');
p('- **Nada foi digitado.** As instruções de teste citadas em `testes_da_nota` são conferidas como substring literal da fonte, e o extrator falha se não forem.', '');

p('## Resumo', '');
p('| Id | Título (literal) | Aula | Kind (taxonomia) | Entradas | Saídas | Ramos | Combinações varridas | Ramos atingidos | Código |');
p('|---|---|---|---|---|---|---|---|---|---|');
for (const x of J.instrumentos) {
  const c = x.comparacao_codigo.calculadora;
  p(`| ${x.id_fonte} | ${esc(x.titulo)} | ${x.aula.marcador} | ${x.kind_taxonomia} | ${x.entradas.length} | ${x.saidas.length} | ${x.ramos_de_leitura.length} | ${br(x.varredura.combinacoes)} | ${x.varredura.ramos_atingidos}/${x.varredura.ramos_total} | ${x.comparacao_codigo.status} |`);
}
p('');
p('**Contagens.** 9 instrumentos `INST · NN`, todos dentro de aulas. Não há instrumento de módulo: o M03 não tem § Lab nem `LAB · NN` (0 ocorrências). Aulas sem instrumento: 04, 07 e 08. A Aula 01 e a Aula 10 têm dois instrumentos cada.', '');
p('**Status no código.** Os 9 estão **portados**: definição presente, título e nota iguais e vínculo com a aula correto. Nos 8 que calculam (02–09), o cálculo numérico do código é idêntico ao original em 100% das comparações. O INST · 01 não calcula: o código porta só a troca de lente, e as participações do script (\`DATA\`) e a pilha desenhada ficaram de fora. Os 9 são **divergentes** pelo mesmo motivo principal: o texto do veredito no código é paráfrase ou resumo, e perde as interpolações numéricas. As divergências adicionais estão por instrumento, abaixo.', '');

p('| Id | Comparações numéricas iguais | Ramo do veredito 1:1 com o original | Divergências de definição | Divergências de cálculo/saída |');
p('|---|---|---|---|---|');
for (const x of J.instrumentos) {
  const cc = x.comparacao_codigo; const c = cc.calculadora;
  p(`| ${x.id_fonte} | ${c && c.comparacoes_numericas ? `${br(c.iguais)}/${br(c.comparacoes_numericas)}` : 'n/a (sem cálculo)'} | ${c?.ramo_do_veredito_bijetor === null || c?.ramo_do_veredito_bijetor === undefined ? 'n/a' : c.ramo_do_veredito_bijetor ? 'sim' : '**não**'} | ${esc(cc.divergencias_definicao.join('; ') || '—')} | ${esc(cc.divergencias_calculo.join('; ') || '—')} |`);
}
p('');

for (const x of J.instrumentos) {
  p(`## ${x.id_fonte} · ${x.titulo}`, '');
  p(`- **Aula:** ${x.aula.marcador} (\`${x.aula.aula_id_codigo}\`). Markup L${x.origem.linha_aprox}–L${x.linha_fim_aprox}; script L${x.script.linhas.inicio}–L${x.script.linhas.fim} (comentário \`${x.comentario_script}\`).`);
  p(`- **Kind:** \`${x.kind_taxonomia}\` (instrument-taxonomy.md; mecânica conferida no script).`);
  p(`- **Pergunta própria:** \`null\`. ${x.pergunta_nota}`);
  p(`- **Pergunta do § MAP da aula (contexto, L${x.aula.pergunta_do_map.linha_aprox}):** "${x.aula.pergunta_do_map.texto}"`);
  const inv = x.invocacao;
  p(`- **Onde é invocado:** logo depois de L${inv.frase_anterior.linha} (${code(inv.frase_anterior.trecho.slice(0, 70))}…) e antes de L${inv.bloco_seguinte.linha} (${code(inv.bloco_seguinte.trecho.slice(0, 60))}).` + (inv.mencoes_por_id_no_modulo.length ? ` Citado pelo id em ${inv.mencoes_por_id_no_modulo.map((m) => `L${m.linha} (${m.secao})`).join(', ')}.` : ' Nenhuma outra menção pelo id.'));
  p(`- **Fonte dos números:** \`null\`. ${x.fonte_dos_numeros_nota}`);
  p(`- **Tolerâncias:** \`null\`. ${x.tolerancias_nota}`, '');

  p('**Entradas**', '');
  p('| Id | Tipo | Rótulo | Unidade | Faixa (min–max, passo) | Padrão | Opções |');
  p('|---|---|---|---|---|---|---|');
  for (const f of x.entradas) {
    const faixa = f.tipo === 'numero' ? `${f.min}–${f.max}, ${f.passo}` + (f.deslizador_gemeo && !f.deslizador_gemeo.mesma_faixa ? ' (**deslizador difere**)' : '') : '—';
    const ops = f.opcoes ? f.opcoes.map((o) => `${o.valor} = ${o.rotulo}`).join('; ') : f.chaves ? f.chaves.map((k) => `${k.id} = ${k.rotulo}${k.ligada_por_padrao ? ' (ligada)' : ''}`).join('; ') : '—';
    p(`| \`${f.id}\` | ${f.tipo} | ${esc(f.rotulo ?? 'null (sem rótulo na fonte)')} | ${esc(f.unidade)} | ${faixa} | ${esc(f.padrao ?? '—')} | ${esc(ops)} |`);
  }
  p('');
  p('**Saídas (atribuição exata no script)**', '');
  if (!x.saidas.length) p('Nenhum readout. A saída é o veredito e o desenho.', '');
  else {
    p('| Id | Rótulo | Atribuição |');
    p('|---|---|---|');
    for (const s of x.saidas) p(`| \`${s.id}\` | ${esc(s.rotulo)} | ${(s.atribuicao_script || []).map((a) => `L${a.linha}: ${code(a.codigo)}`).join('<br>') || '—'} |`);
    p('');
  }
  const calc = x.script.codigo_verbatim.map((l, i) => ({ n: x.script.linhas.inicio + i, l }))
    .filter(({ l }) => /^\s*(var\s+)?[\w.\[\]]+\s*[+\-*/]?=\s*[^=]/.test(l) && /[*/+\-]|Math\./.test(l) && !/\$id\(|textContent|innerHTML|className|addEventListener|querySelector|["']/.test(l));
  if (calc.length) {
    p('**Cálculo (linhas verbatim do script)**', '', '```js');
    for (const { n, l } of calc.slice(0, 30)) p(`L${n}: ${l.trim()}`);
    if (calc.length > 30) p(`… (${calc.length - 30} linhas a mais em script.codigo_verbatim)`);
    p('```', '');
  }
  if (x.desenho) p(`**Desenho:** \`${x.desenho.tipo}\` \`#${x.desenho.id}\` (${br(x.desenho.html_gerado_caracteres)} caracteres gerados no cenário-padrão). Não portável como valor (§12).`, '');
  p('**Cenário-padrão (execução do script original)**', '');
  p(`- Entradas: ${code(JSON.stringify(x.cenario_padrao.entradas))}`);
  p(`- Saídas: ${code(JSON.stringify(x.cenario_padrao.saidas))}`);
  p(`- Veredito (classe \`${x.cenario_padrao.veredito_classe}\`, ramo L${x.cenario_padrao.ramo_linha}): "${x.cenario_padrao.veredito_texto}"`, '');
  p('**Ramos de leitura**', '');
  if (x.textos_por_chave) {
    p('| Chave | Pílula | Texto (renderizado) |'); p('|---|---|---|');
    for (const t of x.textos_por_chave) p(`| ${t.chave} | ${esc(t.pilula)} | ${esc(t.veredito_texto)} |`);
    p('');
  }
  p('| Linha | Condição (literal) | Classe | Vezes na varredura | Exemplo renderizado |');
  p('|---|---|---|---|---|');
  for (const r of x.ramos_de_leitura) {
    const cond = [...r.condicoes_envolventes.map((c) => c.codigo), r.condicao_propria?.codigo ?? '(sem condição)'].join(' › ');
    p(`| L${r.linha} | ${code(cond)} | ${r.classe_css ? '`' + r.classe_css + '`' : 'dinâmica (expressão no script; ex.: `' + (r.cobertura.exemplo?.veredito_classe ?? '—') + '`)'} | ${br(r.cobertura.vezes)}${r.cobertura.vezes === 0 ? ' (**inalcançável**)' : ''} | ${esc(r.cobertura.exemplo?.veredito_texto ?? '— (nunca renderizado; expressão em ramos_de_leitura[].expressao_js)')} |`);
  }
  p('');
  p(`**Nota do instrumento (literal, L${x.nota_instrumento.origem.linha_aprox}):** ${x.nota_instrumento.texto}`, '');
  if (x.testes_da_nota?.length) {
    for (const t of x.testes_da_nota) {
      p(`**Teste declarado pela fonte** ("${t.instrucao_literal}", ${t.instrucao_onde}):`, '');
      for (const r of t.resultados) p(`- ${code(JSON.stringify(r.entradas))} → ${code(JSON.stringify(r.saidas))}, ramo L${r.ramo_linha}`);
      p('');
    }
  }
  const cc = x.comparacao_codigo;
  const campDiv = (cc.campos_codigo || []).filter((f) => Object.entries(f).some(([k, v]) => /_igual$|^presente$/.test(k) && v === false));
  if (campDiv.length) {
    p('**Campos divergentes no código:**', '');
    for (const f of campDiv) p(`- \`${f.id}\`: ${Object.entries(f).filter(([k, v]) => /_igual$|^presente$/.test(k) && v === false).map(([k]) => k).join(', ')}${f.rotulo_codigo ? ` (código: "${f.rotulo_codigo}")` : ''}${f.nota ? ` — ${f.nota}` : ''}`);
    p('');
  }
  if (cc.saidas_extras_no_codigo?.length) p(`**Saídas que só existem no código:** ${cc.saidas_extras_no_codigo.map((s) => `\`${s}\``).join(', ')}.`, '');
}

p('## Divergências da fonte ligadas a instrumentos', '');
for (const d of J.divergencias) {
  p(`### \`${d.id}\` — ${d.tema}`, '');
  for (const l of d.leituras) p(`- **${l.onde}:** ${l.literal !== undefined ? `"${l.literal}"` : `saída ${code(l.saida_executada)}; ${code(l.codigo_fonte)}`}`);
  p('', d.leitura_de_contexto, '', `Decisão: ${d.decisao}.`, '');
}

p('## Lacunas (a fonte não tem)', '');
p('- **Pergunta própria:** nenhum dos 9 instrumentos tem. A pergunta do § MAP é da aula. Uma pergunta de previsão seria da camada Alexandria (P3/P11, P19).');
p('- **Fonte dos números:** nenhuma constante do script traz fonte por valor. As notas declaram o estatuto em prosa ("Didático", "número vivo", "ilustrativos em ordem de grandeza", "inspirados em EPE / Lazard LCOE+"). Na interface vale a formulação do P19: cenário didático, fonte externa dos valores não declarada.');
p('- **Tolerâncias, previsão e gabarito:** não declarados para nenhum instrumento (P6).');
p('- **Rótulo das fileiras de pílulas e chaves (INST · 01, 08, 09):** a fonte não rotula. O código inventou "Seleção" e "Ligada/Desligada".');
p('- **Desenhos (INST · 01, 03, 05, 06, 09):** SVG ou pilha HTML gerados pelo script, não portáveis como valor (§12).', '');

p('## Verificação', '');
p(`- **Literalidade:** ${V.literalidade.strings_verificadas} strings de conteúdo dos três JSONs conferidas contra a fonte, com ${V.literalidade.falhas} falhas. Leituras de divergência: ${V.leituras_de_divergencia.verificadas} conferidas, ${V.leituras_de_divergencia.nao_literais.length} não literais.`);
p(`- **Origens:** ${V.origens.verificadas} \`origem\` localizadas a até 3 linhas, com ${V.origens.falhas} falhas.`);
p(`- **Recontagem independente:** ${V.recontagem.instrumentos.fonte} \`instrument-id\` na fonte, ${V.recontagem.instrumentos.extraido} extraídos.`);
p('- **Espaço de entrada:** coberto por inteiro. Todos os campos numéricos têm deslizador gêmeo com a mesma faixa, então o espaço é o do `input number`.', '');
p('### Verificação adversarial (2026-09-17)', '');
p('Verificador externo, com parse e varredura próprios (sem reusar `lib.mjs` nem `m03_verificar.mjs`):');
p('- **Script verbatim, 100%:** as 10 linhas de helpers e as linhas de todos os 9 IIFEs conferem byte a byte com a fonte; cada intervalo começa logo após o comentário `INSTRUMENT NN` e termina em `})();`.');
p('- **Ramos:** as 31 linhas com atribuição ao veredito, achadas por grep próprio, coincidem com `ramos_de_leitura` (9 instrumentos).');
p('- **Entradas:** `value`, `min`, `max` e `step` de todos os `input number` conferem com o markup.');
p('- **Inalcançáveis, re-executados:** INST · 04 (16 valores de ENA: 11 "Ano bom", 5 "A seca venceu", 0 "Dois produtos"); INST · 05 (493 combinações: 370 "Rampa pesada", 123 "Dia administrável", 0 "Sobra estrutural"); INST · 06 (66 × 60 × 3 opções de gás = 11.880: 1.800 "Sobra renovável", 2.820 "Ponta térmica", 7.260 "Margem", 0 "Déficit", 0 "território de crise"). Batem com a `cobertura` declarada.');
p('- **FCap do fio d\'água no cenário-padrão do INST · 04:** 63 %, confirmado (`i04-fcfio`).');
p('- **Código:** confirmados os rótulos inventados "Seleção" (i01-pills, i08-pills) e "Ligada/Desligada" (i09-checks-*) e a saída extra `i08-cappct`.');
p('- **Correção nesta rodada (reflete aqui):** a contagem de leituras de divergência passou de 44 para 47 porque a leitura não literal "INST·07 (script) e Ex·08" de `div-m03-ap-04-perda-bateria` virou três leituras literais, e o `m03_verificar.mjs` perdeu a exceção que a tirava da checagem. Detalhes em `aparato.md`.');

fs.writeFileSync(`${OUT}/instrumentos.md`, out.join('\n') + '\n', 'utf8');
console.log('instrumentos.md', out.length, 'linhas');
