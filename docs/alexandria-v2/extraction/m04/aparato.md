# M04 · Grupo "aparato"

**Fonte (só leitura):** `C:/dev/GridAlpha v2/Alexandria modulos/alexandria_modulo04.html` (1.856 linhas).
**Arquivo gerado:** [`aparato.json`](aparato.json), em UTF-8 com indentação de 2 espaços. **Data:** 2026-09-17.

## Método

O texto foi extraído por programa ([`extratores/m04_extrator.py`](extratores/m04_extrator.py)):
- as seções foram localizadas por `section#id` e `.sec-id`;
- o quiz foi lido avaliando em Node o literal `var Q=[…]` do `<script>` (L1744–1805).

Campos de texto:
- `html` preserva o inline da fonte, com espaços colapsados e `<br>` como na fonte;
- `texto` remove as tags e decodifica as entidades.

Cada item traz `id` estável (`m04-…`), `origem {seletor, trecho_inicial, linha_aprox}` e, quando cabe, `vinculos`.
Todo `null` vem com uma nota.

**Cobertura por token (§5):**

| Seção | Cobertura | Resíduo |
|---|---|---|
| §Caso | 100% | |
| §Quiz | 100% | O texto das questões vive no `<script>` e está todo em `questoes` |
| §Final | 100% | |
| §Ex | 99,9% | O marcador `§Ex · Exercícios` está no `roteiro` |
| §Lex | 99,8% | O marcador `§Lex · Glossário Alexandria` está no `roteiro` |
| §Ref | 99,6% | O marcador `§Ref · Fontes` está no `roteiro` |

## Estrutura e contagens

| Chave | Seção da fonte | Contagem | Estado no código |
|---|---|---|---|
| `caso` | §Caso (L968) | 2 parágrafos de contexto, **8 perguntas de diagnóstico**, 1 "o que não faz" e 2 callouts | **Não extraído** |
| `avaliacao` | §Quiz (L1092) + `<script>` (L1744–1851) | **10 questões × 4 alternativas**, 2 faixas de placar | **Não extraído** |
| `checklist_final` | §Final (L1180) | **20 itens** (a prosa diz "Vinte verificações") | **Não extraído** |
| `exercicios` | §Ex (L1027) | **9** exercícios, **9 soltos** (P9) | Os 9 estão em `MODULO_04_EXERCICIOS_SOLTOS`, com a estrutura achatada |
| `referencias` | §Ref (L1292) | **11** itens: 5 com URL, 0 com data de verificação | **Não extraído** |
| `glossario` | §Lex (L1211) | **58 termos** em 4 famílias (15 + 14 + 16 + 13) | **58/58 idênticos** em `alexandria-glossario.ts` |
| `divergencias` | | 10 | |

### caso

- **Título e parte.** O rótulo literal é "Operação A — Parte 4", e o lede cita "As Partes 1 a 3 olharam consumo, rede e
  tecnologia". Diferente do M01, aqui a fonte declara uma parte (`parte_declarada_na_fonte: "Parte 4"`). Pelo P17, o
  produto usa "Caso — Operação A" e não adota "Partes".
- **Dados do caso.** São só "Operação A" e "mineração em Minas Gerais", como substrings do lede. Não há tabela
  numérica. Os dois parágrafos de contexto descrevem o perfil de carga (L972) e o descasamento entre o ciclo do negócio
  e o do contrato (L974).
- **Perguntas.** Existem 8, mas são **perguntas de diagnóstico** que o analista faz à operação, não perguntas de
  avaliação do learner. Os temas: Ambiente atual · Exposição descoberta · Aderência de perfil · Submercado · Indexação ·
  Fonte e descasamento · Saída · Contraparte.
- **`decisao_pedida: null`.** A própria fonte diz que o caso não decide (C.2): "Não escolhe ambiente, não recomenda
  fornecedor, não estima economia. As oito perguntas produzem um mapa de exposição, não uma decisão." Um Desafio de
  decisão (P17) é camada Alexandria e só pode usar esses fatos.
- **Callouts.** "Disciplina do caso" (rd) e "Onde isso entra no produto" (gd). O segundo tem
  `exibir_ao_learner: false`.

### avaliacao

Para cada questão, o JSON guarda: enunciado, 4 alternativas (letra e índice), gabarito (índice, letra e texto),
explicação e `aula_citada_na_explicacao` (o prefixo literal "Aula NN.").

| Q | Linha | Gabarito | Aula citada | Tema |
|---|---|---|---|---|
| 01 | 1745 | B | 01 | Solar ao meio-dia e efeito ordem de mérito |
| 02 | 1751 | B | 02 | O que o PLD valora |
| 03 | 1757 | B | 02 | PLDmax estrutural × horário |
| 04 | 1763 | B | 01 | Valor da água acima do gás |
| 05 | 1769 | B | 03 | Térmica de ponta e missing money |
| 06 | 1775 | B | 04 | O "5" do A-5 |
| 07 | 1781 | B | 04 | Corte × médio com liquidação por lance |
| 08 | 1787 | B | 05 | PPA solar flat e consumo noturno |
| 09 | 1793 | B | 06 | O que o hedge faz |
| 10 | 1799 | B | 03 | Leilão de capacidade × leilão de energia |

A coluna "Tema" é rótulo desta extração; o enunciado literal está no JSON.

- **Placar (L1830–1836).** Com `sc>=8`, a mensagem é "Critério de domínio atingido. Passe para o §Voz: …". Nos demais
  casos é "Abaixo do critério de 8/10. … Não avance para o §Voz antes de fechar 8."
- **Rótulos de interface.** Os botões são "Corrigir" e "Refazer". O placar usa o template `sc+' / 10'`, e o
  cabeçalho, `'Questão '+(i+1)+' de 10'`.
- **Mecânica (registro, sem decisão).** Uma única correção avalia as 10 questões, e o feedback é igual para acerto e
  erro. As alternativas são marcadas em verde e vermelho (conflito com o design, que proíbe semáforo). Não há
  persistência.
- **As 10 respostas certas são a alternativa B** (`a:1`).
- **Não aparecem aulas 07 no quiz.** As citadas são 01 (×2), 02 (×2), 03 (×2), 04 (×2), 05 e 06.

### checklist_final

Os 20 itens são literais. O lede diz: "Vinte verificações. Responda sem travar e sem consultar. Cada uma que falhar
aponta uma aula específica". **Nenhum item declara a aula.** Nenhum é cronometrado; o item 19 diz "de memória" e o
20, "em voz alta". Os mesmos ids (`m04-check-NN`) aparecem em `modulo.json`.

### exercicios

| Tag | Linha | Parágrafos de gabarito | Código |
|---|---|---|---|
| 01 · Quem é a usina marginal | 1031 | 2 | prompt e tag iguais; gabarito igual se concatenado |
| 02 · O reservatório muda a fila | 1037 | 2 | idem. Cita "exercício 01" (dependência) |
| 03 · Custo da exposição | 1043 | 2 | idem |
| 04 · Sobrecontratação | 1049 | 2 | idem |
| 05 · Missing money na mão | 1055 | 2 | idem |
| 06 · Preço de corte e preço médio | 1061 | 2 | **1 espaço espúrio** ("R$ 209,69/MWh .") |
| 07 · PPA com perfil errado | 1067 | 2 | igual se concatenado |
| 08 · Swap e custo efetivo | 1073 | 3 | **4 espaços espúrios** antes de "." |
| 09 · Portfólio e política de risco | 1080 | 3 | igual se concatenado |

- **Todos soltos (P9).** O `<summary>` traz só "NN · Título", e a busca por "Aula NN" nos três campos dá zero.
  `aula_vinculada: null` e `criterio: null` nos 9.
- **O código achata a estrutura.** Os parágrafos do gabarito foram concatenados e o `<strong>`/`<em>` removido.
  `points: 1` não tem origem na fonte. As diferenças exatas estão em `codigo.gabarito_diferencas`.
- **Rótulos da fonte.** Cada corpo começa com "Enunciado." e "Gabarito." (`span.term`). Não há botão "Revelar": o
  gabarito fica dentro do mesmo `<details>`, e o lede pede "Resolva antes de abrir.".

### referencias

| Id | Linha | Rótulo (`span.src`) | URL |
|---|---|---|---|
| ref-01 | 1296 | ANEEL · limites de PLD 2026 | gov.br/aneel (notícia do Despacho 3.850) |
| ref-02 | 1297 | ANEEL · metodologia dos limites | — |
| ref-03 | 1298 | CCEE · dados e metodologia do PLD | ccee.org.br/dados-e-analises/dados-pld |
| ref-04 | 1299 | ANEEL · homologação dos LRCAP 2026 | gov.br/aneel (homologação) |
| ref-05 | 1300 | EPE · LRCAP 2026 | epe.gov.br |
| ref-06 | 1301 | MME · 1º LRCAP de armazenamento | — |
| ref-07 | 1302 | Lei nº 15.269, de novembro de 2025 | — |
| ref-08 | 1303 | ONS · dados abertos | dados.ons.org.br |
| ref-09 | 1304 | ONS · serviços ancilares | — |
| ref-10 | 1305 | Referências de preço de contrato | — |
| ref-11 | 1306 | Leitura de aprofundamento (Stoft; Kirschen e Strbac; Hunt) | — |

- **URLs.** Estão no `href` e no texto do link, completas no JSON.
- **Datas.** `datas_citadas` guarda as datas de atos citadas no texto, como "23 de dezembro de 2025" e
  "23 de outubro de 2025". Nenhuma é data de verificação: `data_verificacao` e `tipo_fonte` são `null`.
- **Versão do módulo.** O rodapé não traz colofão com versão ou data.
- **No código.** Nenhuma das 11 referências está em `src/`, e `references: []` nas 7 aulas. A nota "Fonte: ANEEL,
  Despacho nº 3.850…" da Aula 02 está no corpo da aula.

### glossario

Os 58 termos foram comparados campo a campo com os `gl-m04-*` de `alexandria-glossario.ts`:
- **58 idênticos** em termo (sem o ponto final do `span.term`), família (`unit`) e definição;
- **0 divergentes, 0 faltando no código, 0 só no código.**

Os `aulaIds` do código foram derivados pela Wave 34; a fonte não declara vínculo entre termo e aula.
`termos_nao_reintroduzidos` guarda a nota final do §Lex (kW, kWh, … WACC → "Consulte o glossário do módulo de
origem.").

## Divergências (registradas, nenhuma resolvida)

1. **`div-m04-caso-parte4`.** A fonte rotula o caso como "Parte 4" (P17).
2. **`div-m04-quiz-gabarito-b`.** Todas as respostas certas são a alternativa B.
3. **`div-m04-quiz-aula-q10`.** A Q10 (leilão de capacidade) cita a Aula 03; a 4.3 retoma o tema, mas remete ela mesma ao "LRCAP da Aula 03" (sem contradição).
4. **`div-m04-ex-codigo-gabarito`.** O código achata os parágrafos, remove o inline e acrescenta `points: 1` sem
   origem.
5. **`div-m04-ex-codigo-espaco`.** O código tem um espaço espúrio antes da pontuação (Ex·06 ×1 e Ex·08 ×4).
6. **`div-m04-corpo-codigo-residuos`.** Visto de passagem, fora deste grupo:
   - `MODULO_04_CORPO` tem 7 `</b>` órfãos, um por `span.hl` das aulas;
   - `MODULO_04_LEAD['aula-04-02']` termina em "diferença .".
7. **`div-m04-lex-contagem`.** A prosa diz 58, o markup tem 58 e o código tem 58. Concordam; registrado por
   completude.
8. **`div-m04-catalogo-familia-contratos`.** O catálogo canônico lista 15 nomes na família de 16 e omite "PPA".
9. **`div-m04-ref-sem-versao`.** Nenhuma referência tem data de verificação (D5).
10. **`div-m04-final-vinculo-aula`.** O §Final promete que cada item "aponta uma aula específica", mas nenhum item
    declara qual.

## Observação sobre o protocolo

A §4 do protocolo lista o M04 entre os módulos com zero exercício vinculado. **Confirmado: 9 de 9 soltos.**

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
