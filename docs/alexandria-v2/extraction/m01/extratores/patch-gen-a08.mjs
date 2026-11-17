import fs from 'fs';
const P = 'C:/Users/aquil/AppData/Local/Temp/claude/C--dev/9c5a79fb-f118-4054-8d26-9cede07ac0c2/scratchpad/gen-aula08.mjs';
let s = fs.readFileSync(P, 'utf8');
const rep = (a, b) => { if (!s.includes(a)) throw new Error('nao casou: ' + a.slice(0, 60)); s = s.replace(a, b); };
// 1. contagem de linhas (split('\n') conta a linha vazia final)
rep('fonte_total_linhas: L.length,', "fonte_total_linhas: L[L.length - 1] === '' ? L.length - 1 : L.length,");
// 2. DIV-05 leitura_b verbatim
rep("leitura_b: { texto: 'Tags reais: Ex·01 Aula 01, Ex·02 Aula 02, Ex·03 Aula 04, Ex·04 Aula 05, Ex·05 Aula 07, Ex·06 Aula 08, Ex·07 Aula 05, Ex·08 Síntese — Aulas 03, 06 e 09 sem exercício com tag.', origem: { seletor: 'span.exercise-tag', linha_aprox: 2392 } },",
  "leitura_b: { texto: [...L.join('\\n').matchAll(/<span class=\"exercise-tag\">([^<]+)<\\/span>/g)].map((m) => m[1]).join(' | '), origem: { seletor: 'span.exercise-tag (8 ocorrências)', linha_aprox: 2392, linha_fim_aprox: 2457 }, argumento: 'As tags cobrem as Aulas 01, 02, 04, 05, 07 e 08 (mais uma síntese); Aulas 03, 06 e 09 ficam sem exercício com tag.' },");
// 3. DIV-01 nota_texto
rep("decisao: 'não escolhida — registrar para reconciliação curricular (P8).',",
  "nota_texto: 'Nenhuma das duas leituras coincide com o texto de marcação E com um ramo ao mesmo tempo: a marcação (linha 2051) diz \"Faixa típica de usina solar fotovoltaica em latitudes brasileiras. Compare com FCs típicos abaixo.\"; o ramo else if (FC >= 0.15) (linha 2956) diz \"Faixa típica de solar fotovoltaica em latitudes brasileiras. Compare com FCs típicos abaixo.\" (sem \"usina\"). A marcação não é texto de nenhum ramo do script. [Acrescentado na verificação.]',\n    decisao: 'não escolhida — registrar para reconciliação curricular (P8).',");
// 4. COD-06
rep('e o texto do ramo ≥0,15 ("Faixa típica de solar fotovoltaica…")',
  'e o texto da marcação ("Faixa típica de usina solar fotovoltaica…" — que não é o texto de nenhum ramo; o ramo ≥0,15 não tem "usina")');
fs.writeFileSync(P, s, 'utf8');
console.log('patched');
