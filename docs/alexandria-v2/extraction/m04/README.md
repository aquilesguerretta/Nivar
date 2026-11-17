# Extração M04 — Economia de Mercados de Energia

Esta é a camada fonte do Módulo 04: literal, com origem e sem resolver contradições. A fonte é
`C:/dev/GridAlpha v2/Alexandria modulos/alexandria_modulo04.html` (1.856 linhas), lida só para leitura. As aulas
(corpo de apostila) **não** entram neste pacote; ficam para um grupo próprio, como a `aula-08` do M01.

## Arquivos

| Grupo | Arquivos | Conteúdo |
|---|---|---|
| modulo | `modulo.json`, [`modulo.md`](modulo.md) | identidade e pills, tese §00, §MAP, roteiro (17 seções), critérios, §Voz, princípios, §Erros, índice dos explicadores `lv`, comparação com código e catálogo |
| aparato | `aparato.json`, [`aparato.md`](aparato.md) | §Caso (Operação A), §Quiz, §Final, §Ex, §Ref, §Lex |
| instrumentos | `instrumentos.json`, [`instrumentos.md`](instrumentos.md) | Inst · 01–07: markup, script literal, cenário-padrão executado, ramos e comparação com a porta |

## Extratores (`extratores/`)

| Arquivo | Papel |
|---|---|
| `m04_extrator.py` | Python 3 + BeautifulSoup (`html.parser`, `sourceline`). Gera os 3 JSON e roda a verificação automática. Uso: `python m04_extrator.py <harness.json> <pasta-saida>` |
| `m04_harness_script.mjs` | Executa o `<script>` original num DOM simulado e compara o veredito com `INSTRUMENT_CALCULATORS`, empacotado com esbuild. Uso no cabeçalho do arquivo |
| `m04_harness_saida.json` | Saída do harness usada nesta extração (cenário-padrão e resultado da comparação) |
| `m04_inst01_limite.mjs` | Percorre o espaço inteiro do INST 01 (1.145.277 combinações) para provar o ramo inalcançável |

Os extratores do M01 (`m01_*.mjs`) **não serviram**: são ancorados em número de linha e no vocabulário
`aula-marker`/`glossary-item`, que o M04 não usa (§6 do protocolo). Foi reaproveitada a **estrutura** dos JSON e dos
`.md`.

**Notas.** O bundle do esbuild vai para o scratchpad e não é versionado. O parser `html.parser` escreve `<br/>`, e o
extrator normaliza para `<br>`, como na fonte.

## Contagens

| Item | Fonte | Prosa/hero | Código | Catálogo canônico |
|---|---|---|---|---|
| Seções `sec-id` | 17 (7 aulas + 10 aparatos) | | 17 (comentário) | |
| Aulas | **7** | "Sete aulas" · pill "7 aulas" | 7 (`MODULO_04_AULAS`, `totalInModule`, `AULAS_POR_BLOCO`) | 7 |
| Subseções x.y | 28 (3+4+4+4+5+4+4) | | | |
| Instrumentos | **7** (1 por aula; 0 de módulo) | pill "7 instrumentos" | 7 (portados, com divergências) | 7 |
| Entradas / saídas / ramos | 24 / 28 (6 textuais) / 30 | | 24 / 22 / 30 | |
| Termos (§Lex) | **58** (15 + 14 + 16 + 13) | "Cinquenta e oito" · pill "58 termos" | 58 idênticos | 58 (lista 57 nomes, omite "PPA") |
| Exercícios | **9** (9 soltos, 0 com aula) | "Nove exercícios" · pill "9" | 9 (`MODULO_04_EXERCICIOS_SOLTOS`) | 9 |
| Itens de checklist (§Final) | **20** | "Vinte verificações" | 0 | 20 |
| Questões do quiz | **10** × 4 alternativas, 2 faixas de placar | "Dez perguntas" · pill "10 questões · critério 8/10" | 0 | |
| Perguntas-relâmpago (§Voz V.1) | **32** | "trinta e duas" · pill "32" | 0 | 32 |
| Ataques de decisor (V.2) / minutos do roteiro (V.3) | 6 / 5 | "seis" / "cinco minutos" | 0 | |
| Erros comuns (§Erros) | 10 | "Dez erros" | 0 | |
| Perguntas de diagnóstico (§Caso) | 8 | "oito perguntas" | 0 | |
| Referências (§Ref) | 11 (5 com URL) | | 0 | |
| Callouts de aparato e princípio | 12 (7 "Onde isso entra no produto": 6 em aulas, 1 no §Caso) | | os 6 de aula estão no corpo (`nota`) | |
| Explicadores de três níveis | 6 | | 6 (como `nota`) | |
| Critérios literais | 4 (§00, hero, §Quiz, §Final) | | 0 | 1 (§00) + §Final |

Pela primeira vez na série, **todas as contagens declaradas pela prosa e pelo hero conferem com o markup.**

## Verificação (automática, 2026-09-17)

- **Substring.** 1.307 strings de conteúdo foram conferidas contra a fonte. Nenhuma falhou.
- **Origem.** Todas as `origem.trecho_inicial` estão a até ±3 linhas de `linha_aprox`. Nenhuma está fora.
- **Cobertura por token (§5).**
  - 100%: §00, §MAP, §Caso, §Erros, §Quiz, §Voz, §Final e hero.
  - 99,9% em §Ex, 99,8% em §Lex e 99,6% em §Ref. O resíduo são os marcadores `sec-id`, que estão no `roteiro`.
  - 98,1% a 98,7% nos instrumentos. O resíduo é o id "Inst · NN", que fica em `id_literal_fonte`.
- **Fidelidade da porta (§10).** Execução do script original contra `INSTRUMENT_CALCULATORS`: **38.200 combinações,
  0 vereditos divergentes.**
- **Não verificado na tela.** A posição do instrumento na aula e a formatação dos readouts no painel foram deduzidas
  do código.

## Divergências

**Fonte × fonte**
1. O título da Aula 04 difere entre o cartão do §MAP ("Leilões: descoberta de preço") e o h2 ("Leilões: como o
   regulador descobre o preço"). O código e o catálogo usam o h2.
2. A fonte alterna "Bloco 4" e "Módulo 04", e o §Ref cita o "Bloco 9".
3. O critério aparece em três formas: oral (§00), quiz 8/10 (hero, §Quiz e script, coerentes entre si) e 20
   verificações (§Final).
4. O caso é rotulado "Operação A — Parte 4" e o lede cita as Partes 1 a 3.
5. O §Final diz "Cada uma que falhar aponta uma aula específica", mas nenhum item declara aula.
6. **INST 01, ramo inalcançável.** `lim='teto horário'` nunca aparece: em déficit, o readout mostra "acima do teto
   estrutural". Com óleo na margem, o preço é R$ 900, acima do teto estrutural.
7. Q10 do quiz cita a Aula 03; a 4.3 retoma o tema, mas ela mesma remete ao "LRCAP da Aula 03" (sem contradição; ver Verificação). As 10 respostas certas são a
   alternativa B.
8. A mensagem do placar trava o §Voz ("Não avance para o §Voz antes de fechar 8."), o que contraria o P18.
9. A marca GridAlpha aparece no kicker, no rodapé e nos callouts de produto (P24/P7).

**Fonte × código**
1. **Instrumentos (7).** Portados com fidelidade no cálculo e no veredito. Ficam de fora:
   - 6 saídas textuais;
   - as unidades de 9 readouts (`unit: null`);
   - `note: null`, embora `p.disc` e `inst-intro` existam;
   - a formatação e os textos-sentinela ("zero", "não precisa", "—");
   - barras e SVG;
   - o comportamento de campo vazio (0 contra o valor do deslizador com limite de faixa).

   A posição fora do fluxo da aula não foi verificada na tela.
2. **Exercícios (9).** Enunciado e tag idênticos. No gabarito, o código concatena os parágrafos, remove o inline e
   deixa espaço espúrio antes do ponto (Ex·06 ×1, Ex·08 ×4). `points: 1` não tem origem.
3. **Glossário.** 58/58 idênticos. Os `aulaIds` são derivados, não declarados pela fonte.
4. **Fora do código.** Tese §00, cartões do §MAP, critérios, §Caso, §Quiz, §Final, §Voz, §Erros, §Ref e badges do
   M04.
5. **Corpo, visto de passagem (grupo aulas).** 7 `</b>` órfãos em `MODULO_04_CORPO`, um por `span.hl`, e
   "diferença ." em `MODULO_04_LEAD['aula-04-02']`.

**Fonte × catálogo canônico**
1. O título, o subtítulo ("recorte"), as horas (3–4 h), os títulos das aulas e as contagens concordam.
2. A família "Contratos, cláusulas e ambientes (16)" lista 15 nomes no catálogo: falta "PPA".
3. O catálogo marca a trilha como "atribuída", e a fonte não a declara. Registro coerente.
4. `alexandria-blocks.ts` usa `priority: 'media'`, sem informação na fonte.

## Lacunas (a fonte não tem)

- **Módulo.**
  - Sem "Resultado esperado"/capacidades, eixos e trilha.
  - Sem § Lab e sem Tradutor.
  - O §MAP não tem pergunta por aula.
  - As horas são só texto.
- **Caso.**
  - Não há decisão pedida; a fonte diz explicitamente que não decide.
  - Não há tabela de dados, e as perguntas são de diagnóstico, não de avaliação.
- **Quiz.** Não tem vínculo formal com aula; só o prefixo "Aula NN." na explicação.
- **Exercícios.** Não têm critério por exercício nem aula vinculada.
- **Checklist.** Não tem aula por item nem cronometragem.
- **Referências.** Não têm data de verificação, tipo de fonte ou campos D5, e o rodapé não traz colofão de versão.
- **Instrumentos.** Não têm pergunta, previsão, gabarito ou tolerância, e os parâmetros didáticos não têm fonte.
- **Vínculos.** Nenhum termo do glossário e nenhum erro comum declara vínculo com aula.

## Resoluções do Founder aplicáveis (camada de produto, não aplicadas aqui)

| Achado | Decisão |
|---|---|
| Caso "Parte 4", sem decisão | P17: "Caso — Operação A" + Desafio de decisão só com os fatos do caso |
| Critério em 3 formas; placar que trava o §Voz | P18: separar conclusão, desempenho e evidência; nenhum limiar declara domínio nem trava etapa |
| Instrumentos sem fonte e sem pergunta | P19: "cenário didático; fonte externa não declarada"; previsão na camada Alexandria |
| Limites PLD 2026 e números "vivos" | P20: content QA antes de apresentar como dado real ("Números vivos · verificar na fonte" já está na fonte) |
| GridAlpha no kicker, no rodapé e nos blocos de produto | P24 (e P7: não exibir "Onde isso entra no produto") |
| Glossário 58 | P22: contar a coleção |

## Verificação (verificador adversarial independente, 2026-09-17)

Método próprio, sem reusar o extrator: normalização de espaços/entidades e comparação de substring contra o HTML
cru e contra o texto sem tags; pareamento estrutural por regex direto na fonte; `var Q` e o `<script>` avaliados em
node com DOM mínimo próprio.

- **Verbatim.** 2.500 strings dos três JSON percorridas; todas as de conteúdo são substring da fonte. As que não são
  são anotações da extração (`*_nota`, `divergencias`, `codigo`, valores renderizados), como esperado.
- **Pareamento 100%.** Quiz 10/10 (enunciado, 4 alternativas na ordem, gabarito, explicação, aula citada, 2 faixas);
  checklist 20/20 na ordem; 58 termos com a definição e a família certas; 10 erros; 8 perguntas do caso; 32 + 6 + 5
  do §Voz; 11 referências (5 URLs, texto do link); 9 exercícios (enunciado e parágrafos do gabarito); 7 cartões do §MAP.
- **Instrumentos 100%.** 376 linhas `{linha, codigo}` idênticas à linha da fonte; 30 ramos (condição e texto na linha
  declarada); 28 saídas (expressão na linha declarada; 6 textuais: i1-m, i1-lim, i2-mes, i5-lo, i5-w, i7-w); 24 entradas
  (rótulo, padrão, min, max, passo conferidos no `<input type="number">`). Cenário-padrão dos 7 reexecutado: 0 diferenças.
  Harness: 8.100 + 1.000 + 10.000 + 100 + 10.000 + 900 + 8.100 = 38.200. Ramo inalcançável do INST 01 confirmado
  (gás máx. 600 < óleo 900; no déficit `price` = PLD_MAX_H, não maior).
- **Origens.** 0 `trecho_inicial` fora de ±3 linhas.
- **Contagens recontadas no HTML.** 17 `sec-id`; 7 aulas; 28 subseções (3+4+4+4+5+4+4); 7 `div.inst`; 24 entradas; 28
  readouts; 30 ramos; 58 termos (15+14+16+13); 9 `details` em §Ex; 20 `ul.ck li`; 10 questões × 4; 32 / 6 / 5 no §Voz;
  10 erros; 8 perguntas; 11 referências (5 com URL); 6 `div.lv`; 20 `div.box` (12 de aparato/princípio + 2 capturados
  em `criterio` e `voz.como_treinar` + 6 de corpo de aula, estes deixados ao grupo aulas; ver 2ª verificação); 7 "Onde isso entra no produto". Todas conferem com o declarado.
- **Código.** Saídas no código 22; `unit: null` em 21 saídas, das quais 9 renderizam unidade na fonte; 7 `note: null`;
  13 `</b>` × 6 `<b>` no conteúdo do M04 (7 órfãos); 5 " ." nos gabaritos (Ex·06 ×1, Ex·08 ×4). Catálogo: família 3
  lista 15 nomes (sem "PPA"). Conferem.

**Correção aplicada.** Divergência da Q10 (`aparato.json` → `divergencias[2]`, e item 7 do README): não é
contradição. A própria 4.3 (L660) remete o tema à Aula 03 ("o LRCAP da Aula 03"). Foi acrescentado
`nota_verificacao`; as duas leituras foram mantidas. Nenhuma outra correção foi necessária.

## Verificação (2º verificador adversarial, 2026-09-17)

Método próprio, sem reusar extrator nem o harness: substring normalizada (espaços/entidades) de todas as 2.757
strings dos três JSON contra o HTML cru e sem tags; pareamento exato por regex direto na fonte; `var Q` avaliado em
node; `<script>` original executado num DOM mínimo próprio.

- **Verbatim.** Todas as strings de conteúdo são substring da fonte. As 526 que não são: ids, `tipo`, `marcacao_p14`,
  `tipo_saida`, `classe_veredito` e valores renderizados pelo script (estes reproduzidos pela execução, abaixo).
- **Pareamento 100% (igualdade exata após normalização).** Quiz 10/10 (enunciado, 4 alternativas na ordem, índice,
  letra, gabarito, explicação, aula citada; 2 faixas); checklist 20/20 (html, texto, ordem); §Caso 8 (tema + pergunta);
  §Erros 10 (título + corpo); §Voz 32 + 6 (persona + pergunta) + 5 minutos; §Ex 9 (summary, enunciado, todos os
  parágrafos do gabarito); §Lex 58 (termo, definição, família; 15+14+16+13); §Ref 11 (rótulo, descrição, 5 URLs e texto
  do link); tabela do §00 (7 linhas × 3 células).
- **Instrumentos 100%.** 376 linhas `{linha, codigo}` iguais à linha da fonte (349 idênticas byte a byte, 27 só com
  diferença de indentação); 24 entradas (rótulo, unidade, padrão, min, max, passo, igualdade number/range); 28 saídas
  (rótulo, id, expressão na linha declarada); 30 ramos (4+4+3+5+4+5+5, condição e texto na linha declarada);
  6 textuais. Cenário-padrão dos 7 reexecutado: saídas renderizadas, `valor_padrao_bruto`, veredito e classe sem
  diferença. Ramo inalcançável do INST 01 reconferido no script (L1420–1425). Soma do harness: 38.200.
- **Origens.** 349 `trecho_inicial` checados; nenhum fora de ±3 linhas.
- **Contagens recontadas.** Todas as declaradas conferem (17 · 7 · 28 · 7 · 0 · 0 · 24 · 28 · 6 · 30 · 58 · 9 · 9 ·
  20 · 10 · 4 · 2 · 32 · 6 · 10 · 8 · 11 · 5 · 4 · 12 · 6).
- **Escopo.** Sem Tradutor, §Lab, "Resultado esperado" ou trilha na fonte (ausências corretas). As 5 `table.tbl`:
  a do §00 está extraída; as 4 restantes são de corpo de aula (L420, L649, L693, L878).
- **Divergências.** Todas reconferidas na fonte (título da Aula 04 L311 × L610; "Bloco 4" L296/L1181 × "Bloco 9"
  L1302; "Parte 4"; ramo do INST 01). Nenhuma inventada.

**Correção aplicada.** O texto da 1ª verificação dizia "20 `div.box` (12 de aparato/princípio + 8 de corpo de aula)".
A recontagem por seção dá 12 em `principios_editoriais` + 2 capturados em outro campo ("Critério de domínio deste
módulo" em `criterio.itens[0]` e "Como treinar" em `voz.como_treinar`) + **6** de corpo de aula ("A fila real",
"Leia esses dois números juntos", "A frase que resolve a pergunta do Módulo 03", "Conecte com o Módulo 03", "O que ler
num resultado de leilão", "Teste de sanidade"). A frase foi corrigida nos quatro `.md`. Os JSON não mudaram.
