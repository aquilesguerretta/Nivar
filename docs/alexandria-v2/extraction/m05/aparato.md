# M05 · Grupo "aparato": como ler a extração

**Fonte (só leitura):** `C:/dev/GridAlpha v2/Alexandria modulos/alexandria_modulo05.html`, com 1.896 linhas.
**Arquivo gerado:** [`aparato.json`](aparato.json), produzido por [`extratores/m05_aparato.mjs`](extratores/m05_aparato.mjs).
**Data:** 2026-09-17.

## Método

- **Seções.** Foram lidas pelo percorredor `m05_lib.walk`.
- **Quiz.** O literal `var Q=[…]` do `<script>` (L1784–1845) foi avaliado com `new Function`, sem digitação.
- **Glossário e exercícios.** Foram comparados campo a campo com `alexandria-glossario.ts` e
  `MODULO_05_EXERCICIOS_SOLTOS`.
- **Cobertura por token (protocolo §5).** Deu 100% em §Caso, §Ex, §Quiz, §Final, §Lex e §Ref (ver
  `extratores/verify-result.json`).

## Estrutura e contagens

| Chave | Seção | Contagem | Estado no código |
|---|---|---|---|
| `caso` | §Caso (L1002) | 8 perguntas de diagnóstico, 0 dados numéricos, decisão `null` | Não extraído |
| `avaliacao` | §Quiz (L1129) e script (Q em L1784, placar em L1870) | 10 questões × 4 alternativas, 2 faixas | Não extraído |
| `checklist_final` | §Final (L1219) | 21 itens, todos orais/livres | Não extraído |
| `exercicios` | §Ex (L1063) | 10, todos soltos (P9) | Os 10 são idênticos em `MODULO_05_EXERCICIOS_SOLTOS` |
| `referencias` | §Ref (L1347) | 16 (4 com URL, 0 com data) | Não extraído |
| `glossario` | §Lex (L1251) | 72 termos em 5 famílias | Os 72 são idênticos em `alexandria-glossario.ts` |
| `divergencias` | — | 8 | — |

### caso: "A planta pela lente da regulação"

- **Parte.** O sec-id diz "Operação A — Parte 5" (L1004), e o lede diz "As Partes 1 a 4 olharam consumo, rede,
  tecnologia e exposição de mercado". Aqui "Parte 5" é **texto da fonte**. P17 fixa o título de produto
  "Caso — Operação A" (ver `div-m05-apa-01`).
- **Identificação.** O único dado de identificação é "Operação A — mineração em Minas Gerais". `dados` é `null`: não
  há tabela, fatura nem valores.
- **Perguntas.** `perguntas` traz as 8 perguntas de diagnóstico do §C.1:
  1. Quem é a concessionária.
  2. Fase do ciclo.
  3. Decomposição histórica.
  4. Estrutura versus receita.
  5. Encargos e componentes.
  6. Alavancas de gestão.
  7. Participação institucional.
  8. Qualidade contratada.

  Cada uma tem rótulo e pergunta. A fonte não dá resposta de referência para nenhuma.
- **Decisão.** `decisao_pedida` é `null`. O §C.2 diz que a parte "não recomenda ação regulatória", e o box
  "Disciplina do caso" diz "Nada aqui é recomendação". P17 autoriza um Desafio de decisão da camada Alexandria.
- **Vínculos.** A prosa cita a Aula 04 (L1008) e a Parte 4 (L1010). O quiz Q10 cita "Aula 05 e §Caso".
- **Produto.** O box "Onde isso entra no produto" (P7) fica separado, em `bloco_de_produto_P7`.

### avaliacao (quiz)

| Questão | Aula citada na explicação | Gabarito | Linha |
|---|---|---|---|
| Q01, Q02 | Aula 01 | B | 1785, 1791 |
| Q03, Q04 | Aula 02 | B | 1797, 1803 |
| Q05, Q06 | Aula 03 | B | 1809, 1815 |
| Q07, Q08 | Aula 04 | B | 1821, 1827 |
| Q09 | Aula 05 | B | 1833 |
| Q10 | Aula 05 e §Caso | B | 1839 |

- **Mecânica.** "Corrigir" corrige tudo de uma vez e mostra o feedback de todas as questões. Questão sem resposta
  conta como erro.
- **Faixas do placar.**
  - 8–10: "Critério de domínio atingido. Passe para o §Voz…"
  - 0–7: "Abaixo do critério de 8/10. … Não avance para o §Voz antes de fechar 8."
- **Aula.** A única fonte de vínculo com aula é o prefixo literal "Aula NN." da explicação.
- **Gabarito.** O gabarito é **sempre a alternativa B** (`div-m05-apa-02`).

### checklist_final

- **Itens.** São 21, em `<ul class="ck">` estático (sem checkbox nem script). A prosa diz "Vinte e uma", o que confere.
- **P14.** Todos são orais/livres e sem consulta, pela instrução do lede. Também há marcações complementares:
  - `calculo`: item 20;
  - `escrita_de_memoria`: item 20;
  - `aplicacao`: itens 17 e 21.

  O §Final não tem cronômetro.
- **Aula.** Nenhum item declara aula, embora o lede diga "Cada uma que falhar aponta uma aula específica".

### exercicios

- **Estrutura.** Cada um tem tag `NN · Título`, enunciado, `resposta_de_referencia` (1 a 2 parágrafos) e
  `criterio: null`. O critério geral fica no lede do §Ex.
- **Vínculo com aula.** Os 10 são `aula_vinculada: null` (P9). As menções em prosa não são tag de posse:
  - Ex·03 cita o Módulo 04;
  - Ex·09 cita o "termômetro" (INST·04);
  - Ex·10 cita o "mapa de dois eixos" e a Aula 06.
- **Contas.** Só o Ex·04 mostra cálculo (6.000 × 0,008 = R$ 48 mi), embora o lede diga "Em cinco deles há conta"
  (`div-m05-apa-03`).
- **Comparação com o código.** Tag, enunciado e gabarito (concatenação dos `<p>`) são idênticos nos 10. `points: 1`
  não tem origem na fonte.

### referencias (16)

| id | Rótulo (`span.src`) | URL |
|---|---|---|
| 01 | Constituição Federal · competência e serviço público | — |
| 02 | Lei nº 8.987/1995 · regime de concessões | — |
| 03 | Lei nº 9.427/1996 · criação da ANEEL | — |
| 04 | Lei nº 9.074/1995 · outorgas e produtor independente | — |
| 05 | Decreto nº 2.655/1998 · livre acesso | — |
| 06 | Lei nº 10.848/2004 e Decreto nº 5.163/2004 · dois ambientes | — |
| 07 | Lei nº 13.848/2019 · lei das agências reguladoras | — |
| 08 | Lei nº 12.813/2013 · conflito de interesses e quarentena | — |
| 09 | Lei nº 9.784/1999 · processo administrativo federal | — |
| 10 | Lei nº 12.527/2011 · acesso à informação | — |
| 11 | Decreto nº 10.411/2020 · análise de impacto regulatório | — |
| 12 | ANEEL · PRORET, Módulo 2 | https://www.gov.br/aneel/pt-br/centrais-de-conteudos/procedimentos-regulatorios/proret |
| 13 | ANEEL · estrutura da tarifa | https://www.gov.br/aneel/pt-br/assuntos/tarifas |
| 14 | ONS · atribuições e programação da operação | https://www.ons.org.br/ |
| 15 | CCEE · contabilização e liquidação | https://www.ccee.org.br/ |
| 16 | Literatura econômica de regulação | — |

- **Instituição.** `instituicao` só é preenchida quando o rótulo começa por ANEEL, ONS ou CCEE. As normas ficam
  `null`, porque a fonte não nomeia o órgão emissor.
- **Tipo e data.** `tipo_fonte` e `data` são `null` em todas. `ano_no_rotulo` guarda o ano literal do número da norma.

### glossario (72)

| Família (resumo literal) | Declarado | Markup | Linha |
|---|---|---|---|
| Fundamento econômico da regulação · 12 termos | 12 | 12 | 1257 |
| Unbundling e cadeia de valor · 12 termos | 12 | 12 | 1272 |
| Desenho do atacado · 11 termos | 11 | 11 | 1287 |
| Captura e governança regulatória · 17 termos | 17 | 17 | 1301 |
| Regulação econômica e tarifa · 20 termos | 20 | 20 | 1321 |

- **Contagem.** O h2 ("Setenta e dois termos"), a pílula (72), a soma das famílias (72) e o markup (72) coincidem.
  O arquivo tem 92 `span.term`: os 20 que sobram são os "Enunciado./Gabarito." do §Ex.
- **Comparação com o código.** Os 72 termos são **idênticos** no código (`gl-m05-*`) em termo, família (`unit`) e
  definição. Nenhum termo falta no código, e nenhum existe só no código.
- **Vínculo com aula.** A fonte não liga termo a aula.

## Divergências do grupo

| id | Tipo | Resumo |
|---|---|---|
| `div-m05-apa-01` | fonte × decisão | O caso aparece como "Operação A — Parte 5", com Partes 1–4 pressupostas nos módulos anteriores (P17; o M01 não tem "Parte"). |
| `div-m05-apa-02` | qualidade da fonte | Gabarito sempre B: chutar "B" dá 10/10 e "Critério de domínio atingido". |
| `div-m05-apa-03` | fonte × fonte | "Em cinco deles há conta", mas só o Ex·04 mostra cálculo. |
| `div-m05-apa-04` | fonte × fonte | O §Ex e o §Final "apontam a aula" sem declarar qual. |
| `div-m05-apa-05` | concordância | Todas as contagens declaradas batem com o markup. |
| `div-m05-apa-06` | fonte × código | Exercícios idênticos; `points: 1` inventado. |
| `div-m05-apa-07` | fonte × código | Glossário 72/72 idêntico. |
| `div-m05-apa-08` | fonte × decisão | O placar <8 trava o §Voz (P18: nenhum limiar legado trava progressão). |

## Verificação

Verificação adversarial independente em 2026-09-17, com parser e normalização próprios (sem `m05_lib`).

- **Textos e origens.** 694 checagens sobre todos os itens de `aparato.json` com texto e origem (janela de ±3 linhas): 0 falhas.
- **Quiz (100%).** O literal `var Q` (L1784) foi avaliado de novo. As 10 questões conferem campo a campo: enunciado, 4 alternativas, gabarito (sempre índice 1) e explicação. Rótulo "Questão N de 10" e linhas ±3 também conferem, assim como as 2 faixas do placar (L1872, L1875).
- **Checklist (100%).** Os 21 `<li>` da única `ul.ck` (L1224) têm html idêntico e linha exata. Todos são orais e sem consulta, e nenhum é cronometrado no § Final (o "cronometrando" da fonte está no § Voz V.2, L1190).
- **Exercícios.** Nos 10, a tag, o enunciado e cada parágrafo do gabarito conferem (html e linha). A apa-03 se sustenta: só o Ex·04 traz conta.
- **Referências.** As 16 conferem (o texto só difere em `<br>` → espaço), e as 4 URLs são idênticas aos `href`.
- **Glossário.** Os 72 termos conferem em termo, definição e linha. As 5 famílias (12/12/11/17/20) conferem com os `<summary>` literais em L1257, L1272, L1287, L1301 e L1321. O arquivo tem 92 `span.term`: 72 do glossário e 20 do § Ex.
- **Caso.** As 8 perguntas (C.1, L1012) e os 2 parágrafos de contexto (L1008, L1010) conferem, assim como os boxes "Disciplina do caso" e "Onde isso entra no produto" (L1033).
- **Divergências.** As apa-01 a apa-08 foram conferidas, e nenhuma é inventada.

**Correções neste grupo:** nenhuma.

**Observação sem correção.** Na `marcacao_p14`, o item 01 ("Aplica a régua…") não recebe `aplicacao`, e o item 17 recebe. Isso segue a regra declarada em `m05_aparato.mjs` (só "a uma decisão concreta" ou "Plota"), então não é erro. A anotação continua a revisar.

**Segunda verificação adversarial (2026-09-17).** Parser próprio, sem `m05_lib`.
- **Quiz e checklist.** O quiz (`var Q` avaliado) e os 21 itens do checklist foram conferidos por igualdade exata de string. Os 10 gabaritos são todos o índice 1.
- **Textos e origens.** 697 textos e origens do aparato conferem com janela de ±3 linhas. As 10 acusações restantes são o rótulo "Questão N de 10", gerado pelo template (L1848), e não erros.
- **Contagens.** Todas foram recontadas no HTML e conferem: 10/4/2, 21, 10, 16 (4 `href`), 72 (12/12/11/17/20), 8 perguntas no caso.

**Correções:** nenhuma.
