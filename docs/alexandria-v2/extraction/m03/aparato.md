# M03 · Grupo "aparato"

**Fonte (só leitura):** `C:/dev/GridAlpha v2/Alexandria modulos/alexandria_modulo03.html` (3.585 linhas).
**Arquivo gerado:** [`aparato.json`](aparato.json), em UTF-8 com indentação de 2 espaços. **Data:** 2026-09-17.
**Gerado por:** `extratores/m03_aparato.mjs`, com a biblioteca comum `extratores/lib.mjs`.

## Método

As seções foram localizadas pelo `.aula-marker`, e o texto saiu por busca ancorada por linha, sem digitação. O quiz foi
lido **avaliando em `node:vm` o literal `const questions = [...]`** do `<script>` (L3412–3523), e não por regex.

Cada item traz `id` estável (`m03-…`), `tipo`, `camada: "fonte"`, `origem {seletor, trecho_inicial, linha_aprox}` e
`vinculos`, quando há algo a dizer sobre vínculo. Todo `null` vem com nota.

**Cobertura por token (protocolo §5), medida por `extratores/m03_verificar.mjs`:**

| Seção | Tokens na fonte | Cobertura |
|---|---|---|
| § Caso | 658 | 100% |
| § Ex | 1.410 | 100% |
| § Quiz (markup) | 36 | 100% |
| § Quiz (strings do array `questions`) | 1.205 | 100% |
| § Final | 398 | 100% |
| § Lex | 2.510 | 100% |
| § Ref | 426 | 100% |

## Estrutura e contagens

| Chave | Seção da fonte | Contagem | Estado no código |
|---|---|---|---|
| `caso` | § Caso (L2174) | 6 dados · 4 leituras · 1 callout de linguagem · 5 pedidos | **Não extraído** |
| `avaliacao` | § Quiz (L2377) + `<script>` (questões L3412–3523, placar L3571–3574) | **10 questões** × 4 alternativas · 4 faixas de placar | **Não extraído** |
| `checklist_final` | § Final (L2461) | **18 itens** | Parcial: 3 itens viraram critério de badge |
| `exercicios` | § Ex (L2276) | **10 exercícios**: 9 com aula e 1 solto | Os 10 estão em `alexandria-modulo-03-content.ts`, com texto idêntico |
| `referencias` | § Ref (L2760) | **17 itens** em 2 grupos (11 + 6) | **Não extraído** como lista |
| `glossario` | § Lex (L2494) | **63 termos** (a prosa diz "Sessenta e três") | Os 63 estão idênticos em `alexandria-glossario.ts` |
| `divergencias` | — | 8 | — |

### caso

- **Título literal (h2, L2175):** "Operação A — a mesma planta, agora com a lente das tecnologias."
- **Etiqueta (L2181):** "Operação A · Caso de referência · Parte 3".
- **Subtítulo (h3, L2182):** "Mineração de médio porte · Minas Gerais · Grupo A4 (13,8 kV)".
- **A fonte do M03 declara a parte.** Diferente do M01, aqui "Parte 3" está no comentário HTML, na etiqueta, no lead
  ("Parte 1 leu a fatura…; Parte 2, com a lente da rede. Agora a terceira leitura…") e no item 18 do checklist.
  `parte = "Parte 3"` é texto da fonte. Pelo P17, a camada de produto usa **"Caso — Operação A"** e não transforma
  "Partes" em estrutura de interface (`div-m03-ap-05`).
- **Aviso de ficção (L2185):** "Cliente fictício consolidado de traços comuns. Não representa cliente real…".
- **Dados (6 pares):**
  - Demanda contratada;
  - Perfil de carga;
  - Área disponível;
  - Geração existente;
  - Ambiente;
  - Exposição sistêmica, a única marcada como alerta na fonte.
- **Leitura estruturada (4 parágrafos com título em negrito):**
  - Solar no telhado e no pátio (Aula 05);
  - Contrato por fonte no mercado livre (Aulas 03–05);
  - Diesel existente × bateria (Aulas 07 e 09);
  - O que a planta não é.
- **Linguagem recomendada:** o callout gold "Linguagem GridAlpha para esse caso" (marca: P24).
- **O que pedir ao cliente nesta etapa:** 5 itens.
- **`perguntas: null` e `decisao_pedida: null`.** A fonte entrega a leitura já resolvida e não pergunta nada ao
  learner. O P17 autoriza um **Desafio de decisão** da camada Alexandria, só com fatos do caso. Ele não foi escrito
  aqui.
- **Vínculos.** As aulas são citadas **em prosa** (Aulas 02 e 06, 05, 03–05, 07 e 09), não por tag.

### avaliacao (quiz)

Para cada questão, o JSON guarda:
- enunciado;
- as 4 alternativas, com letra e índice;
- o gabarito (índice, letra e texto);
- a explicação;
- `rotulo_fonte`.

O `rotulo_fonte` ("Pergunta 01 / 10") é **texto renderizado** pelo template
`Pergunta ${String(idx + 1).padStart(2, "0")} / 10` (L3536), não um literal do arquivo.

| Questão | Gabarito | Tema do enunciado (início literal) |
|---|---|---|
| Q01 | B | "A solar responde por ~25% da capacidade instalada brasileira, mas ~10% da energia gerada…" |
| Q02 | B | "Mesma seca, duas usinas de 1.000 MW: uma a fio d'água, outra com grande reservatório…" |
| Q03 | B | "Por que os reservatórios do SIN são chamados de 'a bateria do Brasil'?" |
| Q04 | C | "Um sítio eólico tem vento médio 25% mais rápido que outro…" |
| Q05 | C | "Por que um sistema de MMGD pode 'fechar conta' onde uma UFV centralizada jamais competiria…" |
| Q06 | A | "A frase 'a térmica é um conversor de preço de combustível em preço de energia' descreve…" |
| Q07 | C | "Um contrato take-or-pay de gás obriga uma térmica de CVU alto a gerar mesmo sem mérito…" |
| Q08 | B | "Qual é o debate tecnicamente correto sobre Angra 3?" |
| Q09 | B | "O LRCAP 2026 – Armazenamento (Portaria MME 136/2026) contrata baterias para entregar qual…" |
| Q10 | C | "Qual das afirmações abaixo é um uso CORRETO do LCOE?" |

**Distribuição do gabarito.** B = 5, C = 4, A = 1 e D = 0. É registro, sem juízo: a posição D nunca é a correta.

**Mecânica da fonte** (registro, sem decisão):
- uma resposta por questão, travada depois do clique;
- mesmo feedback para acerto e erro;
- sem nova tentativa e sem persistência;
- placar ao fim das 10.

Rótulos de interface: "Pontuação final" e "/10".

**Faixas do placar (script L3571–3574).** Só `mensagem` é verbatim. `intervalo`, `minimo` e `condicao` são derivados
do if/else.

| Condição | Intervalo | Mensagem literal |
|---|---|---|
| `correct >= 9` | 9–10 | "Domínio sólido. Pronto para o Módulo 04 — Economia de Mercados." |
| `correct >= 7` | 7–8 | "Bom. Revise os pontos errados, depois avance para o próximo módulo." |
| `correct >= 5` | 5–6 | "Domínio parcial. Volte às aulas onde errou antes de avançar." |
| `else` | 0–4 | "Refaça o estudo. O critério de domínio é 8/10 — sem atalho." |

**Vínculo com aula.** Nenhuma questão declara aula. A explicação da Q07 cita "a Aula 06" em prosa.

### checklist_final

A introdução é literal (L2464) e há 18 itens literais (L2467–2484). A marcação na fonte é um toggle visual (script
CHECKLIST), sem persistência nem verificação.

A marcação P14 é inferida (ver [`modulo.md`](modulo.md)):
- 1 item cronometrado ou de fluência (item 17);
- 16 orais ou livres;
- 1 de desenho (item 01);
- 1 de cálculo (item 16);
- 1 de escrita (item 10).

**Itens que dependem de outros objetos.** O item 18 cita "a leitura da Operação A Parte 3" (caso, P17), e o item 13
pede "três números vivos e a ressalva de verificação" (P19/P20).

**No código.** Os itens 01, 02 e 16 são o `criterion` literal de `badge-matriz-em-duas-lentes`,
`badge-fator-de-capacidade` e `badge-vacina-do-lcoe`, com a linha citada conferida (`div-m03-ap-08`).

### exercicios (índice, P9)

| Id | Tag (literal) | Aula vinculada | Resposta de referência | Critério | P14 (inferido) |
|---|---|---|---|---|---|
| m03-ex-01 | Ex · 01 · Aula 01 | aula-03-01 | L2285 | `null` | cálculo |
| m03-ex-02 | Ex · 02 · Aula 01 | aula-03-01 | L2294 | `null` | oral/livre |
| m03-ex-03 | Ex · 03 · Aulas 02–03 | aula-03-02 **e** aula-03-03 | L2303 | `null` | — |
| m03-ex-04 | Ex · 04 · Aula 04 | aula-03-04 | L2312 | `null` | cálculo |
| m03-ex-05 | Ex · 05 · Aula 05 | aula-03-05 | L2321 | `null` | oral/livre |
| m03-ex-06 | Ex · 06 · Aula 06 | aula-03-06 | L2330 | `null` | — |
| m03-ex-07 | Ex · 07 · Aula 08 | aula-03-08 | L2339 | `null` | oral/livre |
| m03-ex-08 | Ex · 08 · Aula 09 | aula-03-09 | L2348 | `null` | cálculo |
| m03-ex-09 | Ex · 09 · Aula 10 | aula-03-10 | L2357 | `null` | cálculo |
| m03-ex-10 | Ex · 10 · Síntese | **sem aula (solto)** | L2366 | `null` | oral/livre |

- **Enunciado e resposta** estão completos no JSON (`enunciado`, `resposta_referencia`), com `html` e `texto`.
- **Critério.** Nenhum exercício tem critério próprio (`criterio: null`). A regra de módulo é "escreva ou fale antes
  de revelar" (`m03-regra-ex`).
- **Prosa × markup.** A prosa diz "Dez exercícios" (h2), e o markup tem 10.
- **Cobertura por tag.** As tags cobrem as aulas 01–06 e 08–10. **Só a Aula 07 fica sem exercício.**
- **Solto (P9).** O Ex·10 ("Síntese") vai para os recursos do módulo.
- **Botão da fonte.** "Revelar gabarito", 10 botões (L2283–2364), mais o texto restaurado pelo script de `toggleAns`
  (L3390). Revela direto, sem registrar tentativa (conflita com C7).
- **No código.**
  - Os 10 têm prompt, gabarito e tag idênticos.
  - A tag plural do Ex·03 foi alocada só na `aula-03-02`, e a `aula-03-03` fica sem exercício no código.
  - `points: 1` não tem origem na fonte.

### referencias

Cada item traz:
- o `<li>` verbatim (`html` e `texto`);
- `instituicao_ou_autor` (primeiro `<strong>`);
- `titulos_em_negrito`;
- `obras_em_italico`;
- `descricao_verbatim`;
- `dominio_citado` (do `span.mono`).

| Grupo (h4 literal) | Itens | Com domínio | Sem domínio |
|---|---|---|---|
| Fontes primárias · instituições | 11 | 9 (ANEEL ×3, ONS, EPE, CCEE, MME, Lei 14.300/2022, Itaipu) | 2 (Eletronuclear; ABEEólica · ABSOLAR · UNICA) |
| Canônicos e referências internacionais · estante de tecnologia e custo | 6 | 0 | 6 (MacKay, Smil, Masters, Kirschen & Strbac, Lazard/IRENA, IEA) |

- **`url`:** `null` nos 17. A fonte escreve só o domínio ou caminho como texto ("gov.br/aneel › SIGA"), sem `href`.
- **`tipo_fonte`:** não declarado.
- **`data`:** só o item 07 tem data ("DOU 03/06/2026", junto ao domínio). É a data de publicação da Portaria
  Normativa nº 136/2026, não de acesso.
- **Datas embutidas no título:** "Lei nº 14.300/2022", "Lei nº 15.097/2025" e "PDE 2034" são parte do nome, não
  metadado.
- **Livros:** não trazem ano nem editora.
- **Campos D5** (o que responde e o que não responde, recorte, última verificação): não existem na fonte.
- **Remissões.** Vários itens remetem a aulas e instrumentos em prosa: "a fonte dos 215,9 GW da Aula 01",
  "a matéria-prima dos INST·03, 05 e 09", "a fonte primária da Aula 09", "base das Aulas 04–05", "base da Aula 10".

### glossario

- **Contagem:** 63 termos no markup e "Sessenta e três termos" na prosa. **Conferem** (contraste com o M01, P22).
- **Etiquetas:** 26 distintas, entre elas uma única "Hidro · preview", no termo GSF.
- **Ordem:** a fonte não segue a ordenação `localeCompare` em duas trocas locais:
  - "Lei 14.300/2022" e "Lei 15.097/2025" vêm antes de "LCOE";
  - "MLT" e "MMGD" vêm antes de "Micrositing".

  É efeito de caixa (siglas). Fica registrado, não é erro de conteúdo.
- **Comparação com `alexandria-glossario.ts`** (bloco `gl-m03-*`, campo a campo: termo, etiqueta e definição):

  | Resultado | Termos |
  |---|---|
  | Idênticos | **63** |
  | Divergentes | 0 |
  | **Faltam no código** | **nenhum** |
  | Só no código | 0 |

- **Vínculos.** A fonte não liga termo a aula. No código, 11 termos têm `aulaIds`:
  - Ciclo combinado, Ciclo simples, Inflexibilidade → 06;
  - Energia firme / firmeza, Fio d'água → 03;
  - Itaipu, Tucuruí, Valor da água → 02;
  - LCOE → 10;
  - MMGD, UFV → 05.

  São âncora estrutural do código (Wave 34), não declaração da fonte. Os outros 52 têm `aulaIds` vazio.

## Divergências (registradas, nenhuma resolvida)

1. **`div-m03-ap-01-criterio-P18`.** O quiz pede "8 de 10", o placar manda avançar com 7, e o § Final exige 18 itens
   mais 8/10 (ver `modulo.md`, div-04).
2. **`div-m03-ap-02-erro-n5`.** O gabarito do Ex·08 (L2348) e o feedback da Q09 (L3510) remetem ao "erro nº 5 da
   tabela de mitos". Confere: o 5º mito (L2261) é o de MW × MWh. A remissão **depende da ordem** da tabela, e
   reordenar os mitos no produto a quebraria.
3. **`div-m03-ap-03-angra-1-4-gw`.** "1,4 GW" (Angra 3) só aparece no distrator errado da Q08 (L3496). A Aula 08
   (L1960) dá a potência de Angra 1 e Angra 2, mas não a de Angra 3. É número sem âncora, não contradição.
4. **`div-m03-ap-04-perda-bateria` (P20).** A perda do ciclo aparece com bases diferentes:
   - "~10–15%" no § Erros;
   - "uns dez por cento" no roteiro de voz;
   - "85–90%" de eficiência na Aula 09 e no Lex;
   - no INST · 07, `var carga = E / eff;` e `var perda = carga - E;` (L3200–L3201);
   - no Ex·08, "consome 400 ÷ 0,88 ≈ 455 MWh; perde ≈ 55 MWh/dia em calor." (L2348).

   A fonte não diz a base. As duas últimas medem a perda sobre a energia entregue (55/400 ≈ 13,6%, conta desta
   extração, que não aparece na fonte). As primeiras falam em perda de 10–15% ou em eficiência de 85–90%.
5. **`div-m03-ap-05-caso-parte-3` (P17).** O caso é numerado "Parte 3" na etiqueta, no lead e no item 18 do
   checklist.
6. **`div-m03-ap-06-lex-codigo`.** Medição: 63 = 63 idênticos, sem falta.
7. **`div-m03-ap-07-ex-codigo`.** O Ex·03 aparece só na `aula-03-02`, `points: 1` não tem origem, e "Revelar
   gabarito" revela sem tentativa.
8. **`div-m03-ap-08-badges-linhas`.** Os 3 badges citam linha e texto corretos do checklist. É informativo.

As leituras de `ap-06`, `ap-07` e `ap-08` são **medições** e ficam na chave `medido`, não em `literal`.

## Lacunas (a fonte não tem)

- **Caso:** perguntas ao learner e decisão pedida (P17 autoriza o Desafio de decisão na camada Alexandria).
- **Quiz:** vínculo questão → aula, feedback distinto para erro e nova tentativa.
- **Checklist:** verificação e registro. Todos os itens são autodeclarados.
- **Exercícios:** critério por exercício. A Aula 07 não tem exercício.
- **Referências:** URL, tipo, data de acesso, ano e editora dos livros e campos D5.
- **Glossário:** vínculo termo → aula.
- **Fora do código:** caso, quiz, checklist (salvo os 3 badges) e referências existem só no HTML.

## Verificação

Feita por `extratores/m03_verificar.mjs` (independente de `lib.mjs`), com resultado em
[`verificacao.json`](verificacao.json):
- **Quiz, campo a campo** contra o array `questions` avaliado: enunciados 10/10, alternativas (com a ordem) 10/10,
  gabarito (índice e texto) 10/10 e explicações 10/10.
- **Recontagem por regex nova:**
  - 10 `exercise-tag`;
  - 63 `glossary-item`, com 63 `<summary><span class="term">`;
  - 18 `checklist-item`;
  - 17 `<li>` no § Ref.
- **Literalidade e origens:** 0 falhas nos três JSONs.

**Correções feitas nesta rodada** (extração anterior da mesma pasta, sem .md):
1. **`div-m03-ap-02` e `ap-03`.** As linhas citavam o início da questão (L3491, L3502), e não o trecho. Corrigidas
   para L3496 (Q08, alternativa D) e L3510 (feedback da Q09), agora calculadas por busca literal.
2. **`div-m03-ap-02` e `ap-03` (literais).** Duas leituras não eram literais: uma paráfrase da Aula 08 e um trecho
   com reticências. Agora são o trecho real (L1960 e L2261), e a paráfrase ficou como `nota`.
3. **`ap-06`, `ap-07` e `ap-08`.** Medições que estavam em `literal` passaram para `medido`.
4. **`referencias.codigo_atual`.** Dizia "presente" por falso positivo (a palavra "RALIE" num callout da Aula 01).
   Agora o teste exige o texto do item, e o resultado é "Não extraído".

### Verificação adversarial (2026-09-17)

Um verificador externo usou parse próprio (regex e `vm` sobre a fonte), sem reusar `lib.mjs` nem `m03_verificar.mjs`.

**O que conferiu:**
- **Quiz, 100%.** Os 10 enunciados, as 40 alternativas (texto, letra e ordem), os 10 gabaritos (índice, letra e
  texto) e as 10 explicações batem com o array `questions`. As linhas também conferem, com tolerância de ±3.
- **Placar.** As 4 mensagens batem com os 4 `scoreMsg`. A distribuição de gabaritos também confere: B 5, C 4, A 1.
- **Checklist, 100%.** Os 18 itens batem em `html`, `texto` e linha.
- **Glossário.** Os 63 termos batem em termo, etiqueta, `definicao_html`, `definicao_texto` e linha. As duas
  inversões de ordem (Lei 15.097/2025 > LCOE e MMGD > Micrositing) e a etiqueta única "Hidro · preview" se confirmam.
- **Exercícios.** Os 10 batem em tag, enunciado, gabarito e linha. São 9 com aula e 1 solto (Síntese); a Aula 07 fica
  sem exercício.
- **Referências.** As 17 batem em `html` e `texto`, com 11 no primeiro grupo e 6 no segundo.
- **Caso.** Batem os 6 dados, as 4 leituras e os 5 pedidos. A fonte não tem perguntas nem decisão pedida.
- **Literalidade geral e origens.** Conferem 0 falhas em todas as 378 `origem`, pela regra de ±3 linhas.

**Correção feita** (inequívoca; os extratores foram regenerados):
1. **`div-m03-ap-04-perda-bateria`.** A leitura com `onde` "INST·07 (script) e Ex·08" não era literal. Ela trazia
   "perda = E/eff − E (≈13,6% da energia entregue a 88%); Ex 08: 400 → 455 MWh, perde ≈ 55", mas nem a fórmula
   nesse formato nem o "≈13,6%" existem na fonte. Além disso, `m03_verificar.mjs` tinha uma exceção sob medida,
   `INST·07 \(script\)`, que tirava essa leitura da checagem.
   - **Agora:** são três leituras literais. As duas primeiras vêm do script, "var carga = E / eff;" (L3200) e
     "var perda = carga - E;" (L3201). A terceira vem do Ex·08, "consome 400 ÷ 0,88 ≈ 455 MWh; perde ≈ 55 MWh/dia
     em calor." (L2348). A conta de 13,6% continua só em `leitura_de_contexto`.
   - **Verificador:** a exceção saiu, e as leituras conferidas passaram de 44 para 47, com 0 não literais.
   - **Arquivos alterados:** `extratores/m03_aparato.mjs`, `extratores/m03_verificar.mjs`, `aparato.json` e
     `verificacao.json`.

**Observação (sem correção):** a leitura "Parte 1 leu a fatura…" de `ap-05` é um trecho literal cortado com "…".

### Segunda verificação adversarial (2026-09-17)

Segundo verificador externo, com parse, harness DOM e varredura próprios (sem reusar `lib.mjs`, `m03_verificar.mjs` nem o primeiro verificador).

**Conferido sem diferença:**
- **Literalidade:** todos os 256 `html` e 321 `texto` dos três JSONs (100%, não amostra), e todas as demais folhas de string de conteúdo. As únicas ausências na fonte são valores executados, anotações e `convencoes`, como esperado.
- **Origens:** as 378 `origem` estão a até 3 linhas.
- **Quiz, checklist e fórmulas:** 100% do quiz (10 × 4, gabaritos, explicações e linhas), dos 18 itens do checklist e dos 9 scripts de instrumento mais os helpers, linha a linha.
- **Contagens recalculadas no HTML:** todas iguais às declaradas (20 · 10 · 22 · 8 · 10 · 3+2 · 0 · 9 · 31 · 4 · 63 · 10 (9+1) · 18 · 10×4 · 4 · 17 · 30 · 8 · 5 · caso 6/4/5/0/0).
- **Instrumentos re-executados:** os cenários-padrão dos 9 conferem. A varredura exaustiva confirma as mesmas combinações por instrumento e os 4 ramos inalcançáveis (L3017, L3056, L3166 e L3172).
- **Divergências:** as 54 leituras `literal`/`trecho` foram conferidas contra a fonte, o código e o catálogo. Nenhuma divergência é inventada.

**Correção feita** (inequívoca; `m03_modulo.mjs` e `m03_aparato.mjs` foram regenerados, e `m03_instrumentos.mjs` e `m03_verificar.mjs` saíram byte a byte iguais):
1. **`div-m03-mod-04-criterio` e `div-m03-ap-01-criterio-P18`.** A leitura do placar trazia prefixos entre colchetes (`[correct >= 9]` e `[9–10]`), que não são texto da fonte. Eles apareciam dentro de `literal` sem nota. Agora cada uma tem `nota_literal`, que declara o separador " / " e o prefixo como anotação desta extração. O texto das mensagens não mudou.
