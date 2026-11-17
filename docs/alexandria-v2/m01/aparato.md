# M01 · O aparato e a página do módulo — inventário de unidades de trabalho

**Rodada.** Fechamento do Módulo 01 em qualidade final (decisão do Founder, 2026-09-21). O que for aprovado no M01
vira a régua dos outros dezesseis.

**Escopo deste documento.** Os **10 aparatos** das 19 seções do roteiro do M01 (as 9 aulas são de outro inventário) e
a **página do módulo**. Nada é construído aqui: isto é inventário.

**Fonte única.** `docs/alexandria-v2/extraction/m01/modulo.json` (identidade, tese, resultado esperado, mapa,
roteiro, critério, lab_01, voz, erros comuns, tradutor) e `docs/alexandria-v2/extraction/m01/aparato.json` (caso,
avaliação, checklist final, exercícios, referências, glossário, contexto de critérios). Nenhum fato deste documento
vem de fora dela. Onde a fonte não tem o objeto, está escrito que não tem.

**Regra de leitura da tabela.** Cada linha é **uma unidade de trabalho verificável no render**. O que não pode ser
verificado numa captura ou num filmstrip não é unidade: está na §7, *Pesquisa e decisões pendentes*.

**Tamanho.** P ≈ ajuste de composição ou de texto num arquivo já existente · M ≈ dado novo no dossiê + render
novo · G ≈ mecânica nova (estado, registro, rota) que atravessa mais de um arquivo.

**Contagem.** 52 unidades — 10 no caso, 7 na avaliação, 6 no checklist, 6 na revisão, 11 nas referências e no
léxico, 12 na página do módulo. Mais 9 itens de pesquisa na §7.

---

## 0. As 19 seções do roteiro, e onde cada uma está hoje

`modulo.json → roteiro` declara 19 seções na ordem da jornada: **9 aulas + 10 aparatos**. O produto já as põe todas
na rota, com o nome da casa na margem (`src/components/alexandria/modulo/RoteiroDoModulo.tsx`,
`src/components/alexandria/modulo/aparatos.ts:65-81`) — o C2 de *tipos distinguíveis* e de *nada vira "recursos"
anexado no fim* está cumprido na estrutura. O que falta é **o corpo** de quase todos eles.

| # | Âncora da fonte | Nome na casa | Linha da fonte | Corpo no produto hoje |
|---|---|---|---|---|
| 01 | § 00 · Filosofia do módulo | Abertura | 1287 | completo — `FolhaDoModulo.tsx:950-1005` |
| 02 | § MAP · Mapa das aulas | Mapa do módulo | 1325 | intro + pergunta por aula na rota |
| 12 | § Caso · Aplicação prática | Caso | 2181 | **lead e nada mais** — `FolhaDoModulo.tsx:1148-1163` |
| 13 | § Lab · Comparador interativo | Laboratório | 2258 | instrumento portado — `RecursosDoModulo.tsx:66` |
| 14 | § Map · Tradutor | Síntese | 2358 | tabela 8 × 3 completa — `dossieModulos.ts:425-476` |
| 15 | § Drill · Exercícios com gabarito | Revisão | 2386 | 1 de 8 exercícios — `FolhaDoModulo.tsx:1166-1197` |
| 16 | § Quiz · Verificação de domínio | Avaliação | 2472 | **critério e contagem; zero questões** |
| 17 | § Final · Checklist de domínio | Fechamento | 2491 | **8 de 16 itens, sem marcação** |
| 18 | § Lex · Glossário expansível | Léxico | 2522 | **uma linha de contagem, sem destino** |
| 19 | § Ref · Referências e fontes | Fontes | 2688 | **6 de 8 fontes, sem data de verificação** |

As âncoras (`§ Lab`, `§ Quiz`) nunca são impressas — são chave de classificação, e o S4 proíbe o vocabulário do
pipeline na tela. Isso já está resolvido e não é unidade de trabalho.

---

## 1. O caso — "Operação A"

**O que a fonte tem, medido.** `aparato.json → caso`, linha 2179 da fonte. Título ("Operação A — leitura de uma
fatura industrial."), lead, etiqueta ("Operação A · Caso de referência"), subtítulo ("Mineração de médio porte ·
Minas Gerais · Grupo A4 (13,8 kV)"), aviso de ficção, **6 dados** (Consumo 72.000 kWh · Demanda contratada 500 kW ·
Demanda máxima 400 kW · **Fator de potência 0,88, o único marcado como alerta na fonte** · Tensão 13,8 kV (A4) ·
Cargas), 2 cabeçalhos internos, **4 leituras estruturadas** (Consumo · Demanda · Fator de potência 0,88 · Perfil
operacional), o callout "Linguagem recomendada" e **8 itens** de "O que pedir ao cliente antes de prosseguir".

**Três ausências declaradas pela própria fonte, e elas governam o trabalho:**

1. **Não existe "Parte 1".** `caso.nota_parte`: varredura por `/parte ?[0-9I]/i` no markup e na prosa do M01 =
   **zero ocorrências**. O caso inteiro está numa única `section`. O rótulo "Parte 1" é do brief, não da fonte. (O
   M02 tem o seu próprio "Operação A — a mesma fatura, agora com a lente da rede", `dossieModulos.ts:858` — a
   série existe entre módulos, a numeração de partes não.)
2. **A fonte não formula pergunta ao learner** (`caso.nota_perguntas`): os dois cabeçalhos h4 já vêm resolvidos
   pela própria fonte — a leitura está feita, a lista está dada.
3. **A fonte não pede decisão** (`caso.nota_decisao`): o caso termina na lista de dados a pedir. A decisão
   implícita — *não prometer economia antes de 12 faturas* — é dita como conclusão no callout, não como escolha a
   registrar.

**O que o C8 exige, e o que isso significa aqui.** Decisão com informação incompleta; **nada aparece abaixo da
decisão antes do registro**; consequências em ≥ 2 dimensões, **sem escore único**; o balanço liga de volta a aulas
e termos. O material para os três primeiros existe inteiro: a informação é incompleta **por construção** (um mês de
dados, e a própria fonte diz que doze são necessários), e as 4 leituras estruturadas **são** as dimensões — Consumo,
Demanda, Fator de potência, Perfil operacional — cada uma com o que se sabe e o que falta verificar. Nenhuma delas
tem número de nota. O que falta é a **inversão da ordem**: hoje a fonte entrega a leitura pronta; o C8 exige que ela
só abra depois do registro do learner.

**O caso do M01 não é o M08.** O M08 é *Exercício de decisão* (P4, e o game pass está fora desta wave por P25):
tem cenário, escolha encadeada e consequência implementados (`src/lib/games/modulo-08-game-data.ts`,
`src/pages/alexandria/Modulo08GamePage.tsx`). O caso do M01 é outra classe: é um **caso de leitura diagnóstica** —
a decisão não é *o que fazer com o cliente*, é **se já dá para dizer alguma coisa**, e a resposta da fonte é *não,
e aqui está exatamente o que pedir antes*. A dimensão do trade-off não é econômica, é epistêmica. É o caso que
ensina o gesto de recusar a recomendação, e é por isso que ele fecha em lista de dados a pedir e não em número.

| ID | O que a fonte tem | O que o produto tem hoje | O que falta | Gate | Tam |
|---|---|---|---|---|---|
| A01 | Etiqueta, subtítulo (`Mineração de médio porte · Minas Gerais · Grupo A4 (13,8 kV)`) e aviso de ficção literal, L2183-2193 | `dossieModulos.ts:477-481` tem só `titulo`, `lead`, `decisao: null` | A ficha do caso no dossiê e no render: quem é a operação e que ela é ficção consolidada, **antes** dos dados | C2 · S4 | P |
| A02 | 6 dados com rótulo e valor, L2195-2215; FP 0,88 é o único `marcado_como_alerta_na_fonte: true` | nada — nenhum arquivo de `src/lib/data` contém "Operação A" (`caso.codigo_atual`) | Os 6 dados como quadro de leitura, com o alerta dito por **silhueta e palavra**, nunca por cor | C8 · S2 | M |
| A03 | A informação é incompleta por construção: um mês contra os doze que a própria leitura exige | não há quadro de decisão | O quadro de decisão: uma pergunta ao learner sobre **um** mês de dados, com campo de registro | C8 | G |
| A04 | — (a fonte não pede decisão; `nota_decisao`) | — | **Nada abaixo da decisão antes do registro**: as leituras, o callout e a lista ficam fechados até a tentativa | C8 · C7 | G |
| A05 | 4 leituras estruturadas com dimensão nomeada, L2221-2235, cada uma com o que se sabe e o que falta verificar | nenhuma renderizada | As 4 como **consequências em 4 dimensões**, abertas depois do registro, lado a lado com a resposta do learner | C8 · C7 | M |
| A06 | Nenhuma das 4 leituras tem nota, nem placar, nem soma | — | A comparação sem escore único: autoavaliação em três níveis (atende · atende em parte · não atende), a mesma escala do C7 | C8 · C7 | M |
| A07 | Callout "Linguagem recomendada", 439 caracteres, L2245 | nada | O callout como **balanço** do caso, depois das consequências; marca morta trocada por P24 | C8 | P |
| A08 | 8 itens de "O que pedir ao cliente antes de prosseguir", L2236-2244 | nada | A lista como o próximo passo do caso — é o que o caso ensina a fazer | C8 · C2 | P |
| A09 | `caso.vinculos.aulas_declaradas: []` — a fonte não aponta aula por tag; os conceitos são de A05, A06 e A07 por conteúdo | nada | O balanço liga de volta a aula e a termo (ida e volta sem perder a posição). O vínculo em si é derivação → §7 | C8 · D6 | M |
| A10 | O caso é de leitura diagnóstica, não exercício de decisão de negócio | a linha do roteiro diz "Caso · uma decisão real, com os dados que existiam" (`aparatos.ts:73`) | A frase da classe descreve o M08, não o M01. O M01 precisa da sua: **decidir se já dá para dizer alguma coisa** | C2 | P |

---

## 2. A avaliação

**O que a fonte tem.** `aparato.json → avaliacao`, L2472. **10 questões** de múltipla escolha, cada uma com 4
alternativas, gabarito e explicação. Rótulo de placar "Pontuação final", total "/10", template "Pergunta NN / 10".

**A mecânica da fonte, e o que ela viola.** Uma tentativa por questão (trava no primeiro clique); a alternativa
correta é destacada e o feedback aparece na hora; o placar só aparece com as 10 respondidas; sem reinício, sem
persistência. **Cor verde/vermelha marca acerto e erro** — o S2 e o C7 proíbem cor como portadora de certo/errado.

**O critério é contraditório, e o P5 manda preservar o literal.** Três critérios literais coexistem no mesmo módulo:

| Seção | Frase literal | Limiar |
|---|---|---|
| § Drill | "O critério de domínio é resolver pelo menos **seis dos oito** sem consulta." | 6/8 |
| § Quiz | "O critério de domínio do módulo é acertar pelo menos **8 de 10** sem consultar." | 8/10 |
| § Final | "Você só passa neste módulo se conseguir, **sem consultar nenhum material**, fazer todas as ações abaixo." | 16/16 |

E o script do próprio quiz contradiz o seu limiar: com **7** acertos a mensagem é *"Bom. Revise os pontos errados,
depois avance para o próximo módulo"* — manda avançar abaixo do corte de 8; com **8** cai na mesma faixa de
`correct >= 7`, isto é, manda revisar quem atingiu o critério. As quatro mensagens (≥9, ≥7, ≥5, <5) estão em
`avaliacao.faixas_de_placar_script`.

**Por que ela nunca vira Demonstrado.** O S3 define Demonstrado como *tarefa explicitamente portadora de evidência,
com regra de avaliação compatível com a capacidade afirmada*. Um quiz de múltipla escolha com uma tentativa por
questão não é portador de evidência de nenhuma das 7 capacidades do M01 — que pedem **explicar**, **calcular**,
**desenhar** e **justificar**. E o P5 é explícito: *o limiar do quiz não é evidência de competência*. A linha do
S3 é "Avaliação do módulo: aprovada · X/10 · critério da fonte", na camada de resultado de avaliação, com
"Demonstrado: ainda não avaliado" intacto ao lado.

**O que a tela precisa mostrar antes da avaliação.** O critério **literal da seção**, rotulado pela seção de origem,
e a existência da contradição — não uma escolha silenciosa entre as três formas. Hoje `FolhaDoModulo.tsx:1200-1229`
mostra no máximo **2** critérios (`slice(0, 2)`), escolhidos por heurística de código, e o 1º viewport escolhe um só
por regex de rótulo (`criterioDeDominio`, `FolhaDoModulo.tsx:508-512`).

| ID | O que a fonte tem | O que o produto tem hoje | O que falta | Gate | Tam |
|---|---|---|---|---|---|
| B01 | 10 questões completas: enunciado, 4 alternativas, gabarito, explicação (L2472+) | **nada.** `avaliacao.codigo_atual`: nenhum arquivo de `src/lib/data` contém o quiz do M01 | As 10 questões como dado do produto, verbatim, com gabarito e explicação | §9 · C7 | G |
| B02 | Os 3 critérios literais, com a seção de origem de cada um | `dossieModulos.ts:202-232` tem os 3; a tela mostra 2 (`FolhaDoModulo.tsx:1219`) e o 1º viewport, 1 | Os **3** visíveis antes da avaliação, cada um rotulado pela sua seção, nenhum apresentado como "o" critério | C10 · P5 | P |
| B03 | As 4 mensagens do script, que contradizem o limiar de 8/10 | não renderizadas | A contradição dita na tela: o módulo declara dois limiares e o placar contradiz o seu — em revisão editorial | S4 · P5 | P |
| B04 | Uma tentativa por questão, feedback imediato, **cor** marcando acerto e erro | — | A checagem sem cor: estado por silhueta e palavra, tentativa registrada antes da referência, nova tentativa disponível | C7 · S2 | G |
| B05 | "Pontuação final" · "/10" · "Pergunta NN / 10" (rótulos literais) | `FolhaDoModulo.tsx:1219-1224` diz "10 questões. O resultado é desempenho em avaliação" | A linha de resultado do S3: "Avaliação do módulo: aprovada · X/10 · critério da fonte", ao lado de "Demonstrado: ainda não avaliado" | S3 · C10 | M |
| B06 | Sem persistência (nada em localStorage na fonte) | o backend já registra `exercicio_respondido` (`app/db/models/progress.py:71-79`) | A tentativa da avaliação como evento — é o que alimenta a conquista `pratica.avaliacao-realizada.modulo-01` e a linha Praticado | S3 · §9 | G |
| B07 | As 10 questões cobrem as 9 aulas | — | Questão já usada sai da avaliação, e o erro devolve "Rever [aula]" com a origem visível | C10 | M |

---

## 3. O checklist final

**O que a fonte tem.** `aparato.json → checklist_final`, L2491. **16 itens**, introdução ("Você só passa neste
módulo se conseguir, sem consultar nenhum material, fazer todas as ações abaixo"), e a mecânica: clique alterna
`.checked`, **sem persistência, sem contagem, sem gatilho ao completar**.

**Por que nenhum vira evidência automatizada.** A `nota_P14` da extração é literal: *todos os 16 itens são
desempenho verbal/manual declarado pelo learner; nenhum é verificável automaticamente*. Os verbos são **explicar**
(7 itens), **calcular** (3), **listar** (2), **desenhar**, **justificar**, **diferenciar**, **identificar** e
**saber**. Só o item 01 traz tempo explícito ("em 30 segundos") — a extração marca **1** item como cronometrado e
deixa a classificação oral/não oral dos outros 15 para revisão. Pelo P14, **os 16 entram como "atividade
recomendada"**, e nenhum deles é o critério cumprido por ter passado no quiz.

**Como isso aparece sem virar lista morta.** Uma lista de 16 frases que só alterna uma classe é exatamente a lista
morta. O que a torna viva sem mentir sobre evidência:

- **a marcação é autoavaliação registrada** — `exercicio_respondido` com `tipo='autoavaliacao'` é o evento que o
  catálogo de conquistas já prevê (`sistema-de-conquistas.md`, `pratica.autoavaliacao-modulo.{m}`), e ele cai em
  **Praticado**, não em Demonstrado. "Marquei" é uma tentativa declarada, e a palavra na tela diz isso;
- **cada item aponta para o lugar que o treina** — o item 06 ("Lei de Ohm, perdas com I²") é a Aula 04, o item 10
  (triângulo kW/kVAr/kVA) é a Aula 07; o checklist vira índice de recuperação em vez de lista de afirmações;
- **os 7 itens que repetem as capacidades** de "Resultado esperado" são ditos como repetição, não como uma segunda
  lista (o `contexto_criterios` do `aparato.json` existe justamente para pôr as quatro formulações lado a lado).

| ID | O que a fonte tem | O que o produto tem hoje | O que falta | Gate | Tam |
|---|---|---|---|---|---|
| C01 | 16 itens literais, L2493-2521 | **8** renderizados (`FolhaDoModulo.tsx:1251`, `slice(0, 8)`) | Os 16, ou uma divulgação que abre os 16 no lugar | C2 · S4 | P |
| C02 | — | `FolhaDoModulo.tsx:1271` imprime "Os outros 8 itens estão na folha do checklist" — **e essa folha não existe** | Destino falso: ou a folha existe, ou a frase sai. O S4 proíbe ausência que vira destino | §6 (FAIL) · S4 | P |
| C03 | Clique alterna `.checked`, sem persistência | nada é marcável no produto | A marcação por item, com a palavra "atividade recomendada" ao lado e **nenhuma** contagem apresentada como progresso | P14 · S3 | M |
| C04 | 15 dos 16 sem tempo declarado; só o item 01 é cronometrado | `dossieModulos.ts:505` guarda `orais: 1` e a nota da apuração, não renderizada (correto: é a voz do processo) | A marcação registrada como `exercicio_respondido · tipo='autoavaliacao'` → linha **Praticado** do módulo | S3 · §9 | G |
| C05 | Os itens nomeiam os mecanismos das aulas (kW×kWh, fator de carga, Ohm, triângulo, FCap, A4) | nenhum item liga a nada | Cada item com o seu lugar de recuperação — "Rever [aula]" com a origem visível | C10 · D6 | M |
| C06 | 7 dos 16 repetem, com outra redação, as 7 capacidades de "Resultado esperado" (`contexto_criterios`) | as capacidades aparecem no 1º viewport; o checklist, 3.000 px abaixo, repete sem dizer | A repetição dita: o fechamento confere o que a abertura prometeu | C1 · C2 | P |

---

## 4. A revisão

**O que a fonte tem.** `aparato.json → exercicios`, L2386. **8 exercícios** com gabarito, botão literal "Revelar
gabarito" nos oito. Critério literal: *"O critério de domínio é resolver pelo menos seis dos oito sem consulta."*

**Quantos ficam aqui pelo P9: um.** Dos 8, **7 trazem tag de aula** (aulas 01, 02, 04, 05 ×2, 07, 08) e por isso
pertencem às aulas — já estão em `src/lib/data/alexandria-modulo-01-content.ts`, nas `activities`. **1 é solto**:
o `Ex · 08 · Síntese · Diagnóstico inicial`, sem aula declarada, extraído como `MODULO_01_SINTESE`
(`alexandria-modulo-01-content.ts:333-335`). Pelo P9, **esse um** é o exercício da Revisão do módulo.

**Ele está visível sem trocar de aba: sim.** `FolhaDoModulo.tsx:1166-1197` abre o `ExercicioBlock` no lugar da
linha da Revisão, dentro da rota, sem aba e sem rodapé. E o C7 está cumprido no componente: campo de resposta,
"Registrar resposta", referência só depois do registro, autoavaliação em três níveis e nova tentativa
(`src/components/alexandria/viewer/ExercicioBlock.tsx`). O "Revelar gabarito" direto da fonte não sobreviveu — e
não deve voltar.

**O que ainda falta.** Os 7 vinculados não têm índice nenhum na Revisão (o C2 pede que os exercícios do módulo
estejam acessíveis, e a contagem "seis dos oito" só faz sentido se os oito forem localizáveis); o critério 6/8 não
aparece na Revisão; e a linha de "erros comuns" (`FolhaDoModulo.tsx:1177-1180`) **nunca renderiza no M01**, porque
o roteiro do M01 não tem seção `§ Erros` — os 5 erros comuns do módulo vivem dentro das aulas 01, 05 e 07.

| ID | O que a fonte tem | O que o produto tem hoje | O que falta | Gate | Tam |
|---|---|---|---|---|---|
| D01 | 8 exercícios; 1 sem vínculo de aula (Ex·08) | o Ex·08 abre na Revisão, com campo e comparação (`FolhaDoModulo.tsx:1182-1194`) | **Nada — cumprido.** Registrado como linha de verificação, não de trabalho | C2 · P9 | — |
| D02 | Os 7 com tag pertencem às aulas 01, 02, 04, 05 ×2, 07, 08 | `FolhaDoModulo.tsx:1185-1191` diz "8 exercícios com resposta de referência; 1 sem vínculo com aula abre abaixo" | O índice dos 7, com destino à aula de cada um — senão "oito" é um número sem lugar | C2 · D6 | M |
| D03 | Critério literal do § Drill: "seis dos oito sem consulta" | está em `dossieModulos.ts:202-232`, mas só aparece na classe `avaliacao` ou no 1º viewport por heurística | O critério do Drill aparece **na Revisão**, rotulado pela sua seção, e não como "o" critério do módulo | C10 · P5 | P |
| D04 | 5 erros comuns, nas aulas 01, 05 e 07 (`errosComuns: 5`) | `FolhaDoModulo.tsx:1177-1180` só renderiza numa linha `§ Erros`, que o M01 não tem | Ou os 5 erros entram na Revisão do M01, ou a linha some do caminho do M01 — hoje o dado existe e a tela nunca o alcança | C2 · C10 | P |
| D05 | O Ex·08 é síntese do módulo inteiro ("por que você não começa falando de mercado livre") | renderizado como exercício comum | O Ex·08 dito como o que é: o mesmo gesto do caso, em prosa livre — e é o par natural do § Caso na rota | C2 · C8 | P |
| D06 | — | a tentativa não é registrada entre sessões (`ExercicioBlock.tsx:100`: "Guardar a tentativa entre sessões ainda não está disponível") | O registro persistido — é o que fecha a linha Praticado do módulo e a conquista `pratica.exercicios-do-modulo.modulo-01` | S3 · §9 | G |

---

## 5. As referências e o léxico

### 5.1 As fontes do módulo

**O que a fonte tem.** `aparato.json → referencias`, L2688. **8 itens**: ANEEL/REN 1.000/2021 · ANEEL/PRODIST
Módulo 8 · ANEEL/Qualidade do Fornecimento · ONS · CCEE · EPE · **MME** · **Practical Engineering** (canal
técnico, material complementar). Mais a introdução ("Toda afirmação regulatória deste módulo pode ser rastreada às
fontes primárias abaixo… a regulação se atualiza, e a Alexandria não promete eternidade"), o padrão editorial e o
colofão.

**O que está no produto.** Duas cópias divergentes, nenhuma completa:

- `dossieModulos.ts:522-558` — **6 dos 8** (faltam MME e Practical Engineering), `dataConsulta: null` em todas.
  `FolhaDoModulo.tsx:1304-1306` imprime honestamente "6 de 8 fontes. A estante completa do módulo está na
  Biblioteca";
- `BibliotecaView.tsx:99-166` — as **8**, hardcoded, com `titulo` e `descricao` separados por julgamento do
  extrator anterior; e **4 delas repetidas** em `FONTES` (`BibliotecaView.tsx:58-97`), com o texto da ANEEL
  parafraseado. Nenhuma das duas listas está em `src/lib/data`.

**O que a Biblioteca precisa mostrar para o módulo fechar.** O D5 pede, por fonte: o que responde · o que **não**
responde · instituição · tipo · tema · recorte · **última verificação** · onde é usada, com link para a aula ·
citação. Hoje há órgão, título, descrição e domínio. Faltam cinco dos nove campos, e o mais caro é **onde é usada**:
sem ele não existe o caminho ficha → aula do D6.

### 5.2 O léxico

**O que a fonte tem.** `aparato.json → glossario`, L2522. **38 termos** no markup — e a prosa da própria fonte diz
"Vinte e oito termos". A extração registra a divergência (D06 em `reconciliacao/DECIDIR.md`) e o código já adotou
38 (`src/lib/data/alexandria-glossario.ts:4`, bloco "MÓDULO 01 (Wave 8) — 38 verbetes"). A ordem da fonte **não é
alfabética**; cada termo tem `termo`, `etiqueta` (categoria: "Corrente", "Solução · FP", "Instituição", "Forma de
onda"…) e definição.

**O que o Glossário precisa mostrar.** O D3 é explícito: **a entrada padrão não é uma lista alfabética**, e os
termos da aula e do módulo atuais são acessíveis. `GlossarioView.tsx` é uma lista A–Z com busca; não há segmento
"Módulo atual", não há filtro por categoria (a `etiqueta` existe no dado e não filtra nada), e nenhum verbete tem
rota própria nem fonte (D4). O caminho termo → aula existe (`GlossarioView.tsx:82-85`); o caminho **aula → termo**
não existe em lugar nenhum.

| ID | O que a fonte tem | O que o produto tem hoje | O que falta | Gate | Tam |
|---|---|---|---|---|---|
| E01 | 8 referências (MME e Practical Engineering inclusive) | 6 no dossiê (`dossieModulos.ts:522-558`); 8 na Biblioteca (`BibliotecaView.tsx:99-166`) | As 8 no dossiê. Enquanto forem 6, a folha diz "6 de 8" e manda para outra tela — que é exatamente o que o D5 chama de estante partida | D5 · S4 | P |
| E02 | Nenhum item declara data de consulta | `dataConsulta: null` nas 6; `FolhaDoModulo.tsx:744-748` só imprime a data quando ela existe | A **última verificação** por fonte. A fonte não a declara → §7, mas o campo e o render são unidade | D5 · S4 | M |
| E03 | Cada referência diz o que o documento é | Biblioteca: órgão, título, descrição, domínio | Os campos que faltam do D5: o que responde · o que **não** responde · tipo · tema · recorte | D5 | G |
| E04 | O § Ref é do MÓDULO, não da aula (`references: []` nas 9 aulas) | `BibliotecaView.tsx:10-19` registra a auditoria e não inventa documento por aula — correto | "Onde é usada", ligando a ficha às aulas que citam ANEEL, PRODIST e ONS. O vínculo é derivação → §7; a rota é unidade | D5 · D6 | M |
| E05 | 4 instituições aparecem duas vezes na fonte (§ Ref e rodapé) | `FONTES` (4) e `BIBLIOGRAFIA_MODULO_01` (8) coexistem na mesma página, com a ANEEL parafraseada em uma delas | Uma estante só. Duas listas da mesma coisa na mesma tela é parede de cards com outro nome | D5 | M |
| E06 | — | `FolhaDoModulo.tsx:1277-1308` lista as fontes na rota, sem destino | Da linha Fontes do módulo para a ficha na Biblioteca, e de volta à mesma posição (fonte → ficha ≤ 2 ações) | D6 | M |
| E07 | 38 termos com categoria, ordem não alfabética | `GlossarioView.tsx` abre em lista A–Z | Entrada que não é A–Z: segmentos Módulo atual \| Categoria \| A–Z, com a `etiqueta` fazendo o trabalho que ela já sabe fazer | D3 | G |
| E08 | Cada termo tem definição e categoria; nenhum declara fonte | `alexandria-glossario.ts` tem `term`, `unit`, `definition`, `aulaIds` | Rota própria por verbete, âncoras com módulo e título, termos relacionados e fonte (ou "não declarado") | D4 | G |
| E09 | 38 termos deste módulo | `FolhaDoModulo.tsx:914-917` imprime "38 termos definidos neste módulo" — **sem destino** | O destino: do módulo para o léxico do M01 já filtrado | C2 · D6 | P |
| E10 | — | `GlossarioView.tsx:164` diz "A busca cobre… os **38 verbetes**" enquanto o arquivo tem **637** | Texto obsoleto na tela vazia: o número mente desde que o léxico passou de M01 para M01–M08 | S4 | P |
| E11 | Os termos são citados no corpo das 9 aulas | a aula não liga a termo nenhum (evidência do D6: "a aula não liga a termo nem a fonte") | Aula → termo → aula, sem perder a posição, e sem depender de hover a 390 (termo → definição = 1 ação) | D6 | G |

---

## 6. A página do módulo

**O que já responde.** O 1º viewport do M01 responde às quatro perguntas do C1 nas duas medidas: por que importa
(a tese literal, `FolhaDoModulo.tsx:433-494`), do que será capaz (as 7 capacidades de "Resultado esperado",
`:547-620`), onde está (o trecho da carta com as 9 estações, `TrechoDaCarta.tsx`) e o que vem (a ação única com
motivo, `:621-698`). O roteiro põe as 19 seções na ordem da jornada com o nome da casa na margem, e a linha da
experiência jogável existe como metadado sem controle inerte (`RoteiroDoModulo.tsx:404-440`, P16/P25). Isso não é
o trabalho — é o chão de onde o resto sobe.

**O cartucho.** `TrechoDaCarta.tsx:163-166` só imprime *"você está aqui"* quando `posicaoNesteModulo &&
progresso.comRegistro`; fora disso o rótulo é *"as estações deste módulo"*. No M01 em E2, com o learner na
M01·A08, o cartucho aparece — é o caso que passa, e é por isso que os critics o viram só aqui. Nos outros estados
do **próprio M01** (E0 sem sessão, E3 com a posição em outro módulo) a figura perde a palavra de posição e o
marcador 1 do §0 fica só na geometria. A unidade F01 é essa: o M01 precisa de um letreiro de posição honesto em
**todos** os seus estados, não só naquele em que o learner está dentro dele.

**O progresso em um eixo só.** `contagemDoModulo` (`estadoDoModulo.ts:118-128`) devolve uma string e só uma:
`"7 de 9 percorridas"`. É **Percorrido**, e nada mais aparece na página inteira. O S3 exige as três camadas, e a
Home já as imprime (`EntradaBlocos.tsx:207-218`) — com "Praticado: **ainda não medido**", que era verdade e deixou
de ser: o backend responde.

**O que o backend já entrega, e que a página ignora.**

| Endpoint | O que devolve | Cliente no front |
|---|---|---|
| `GET /pratica` (`app/routers/progress.py:213-225`) | `totalTentativas`, `aulasComPratica[]`, `totalAulasComPratica`, `eventosSemAulaVinculada`, `instrumentos{tentativas,distintos}`, `exercicios{…}`, primeira e última tentativa | **nenhum** |
| `GET /aulas/{id}/pratica` (`:263-285`) | o mesmo por aula, com `semRegistro: true` em 200 — o estado "nada praticado aqui" existe e não é erro | **nenhum** |

`src/lib/progress/progressApi.ts` expõe `recordEvent` (:120), `getMyProgress` (:134) e `getAulaStatus` (:143). O
tipo `MyProgress` (:55-60) tem `aulasConcluidas`, `aulasEmAndamento`, `badges` e `streak` — **nenhum campo de
prática**. O eixo Praticado do M01 é, hoje, um dado que existe no Postgres, tem rota HTTP, e nenhuma linha de
interface.

| ID | O que a fonte / o sistema tem | O que o produto tem hoje | O que falta | Gate | Tam |
|---|---|---|---|---|---|
| F01 | A posição do learner na carta da Trilha I | `TrechoDaCarta.tsx:161-173`: "você está aqui" só com a posição dentro do M01; senão "as estações deste módulo" | O letreiro de posição honesto nos três estados do M01 (E0, E2, E3) — a figura diz onde o módulo está mesmo quando o learner está fora dele | C1 · S3 · B3 | M |
| F02 | `GET /pratica` e `GET /aulas/{id}/pratica` respondem | `progressApi.ts:55-60` não tem campo de prática; nenhuma chamada existe | O cliente das duas rotas, tipado — é o pré-requisito de F03, F04, C04, D06 e B06 | S3 · §9 | M |
| F03 | `aulasComPratica[]` e `totalTentativas` por conta | `estadoDoModulo.ts:118-128` devolve só "N de 9 percorridas" | A linha **Praticado** do módulo, com escopo explícito: "N de 9 aulas com prática registrada · M tentativas". Nenhum percentual que misture eixos | S3 · C1 | M |
| F04 | `eventosSemAulaVinculada` — o backend diz, de propósito, o tamanho do que ele não vê | nada | A honestidade do vão: "K tentativas não ligadas a aula" ao lado, nunca escondida dentro do número de cima | S3 · S4 | P |
| F05 | Nenhuma tarefa do M01 é portadora de evidência (§2) | a página não menciona Demonstrado em lugar nenhum | "**Demonstrado: ainda não avaliado**" na página do módulo, ao lado dos outros dois eixos — o silêncio hoje é pior que a linha | S3 · C1 | P |
| F06 | 10 questões, critério literal de 8/10 | nada | "**Avaliação do módulo: ainda não registrada**" na camada de resultado, separada dos três eixos | S3 · C10 | P |
| F07 | Momento 7 do sistema de movimento: limbo fecha, trecho do território se traça, "M01 · CONCLUÍDO" | nenhum momento de módulo implementado | A chegada do módulo com as palavras obrigatórias ("Concluído") e as proibidas ausentes ("Aprovado", "Dominado", "%") | S6 · P18 | G |
| F08 | `conclusao.modulo.modulo-01` no catálogo de conquistas; medalhas r04 produzidas | não renderizada | A medalha na camada de motivação, **abaixo do fio**, verificável por `getBoundingClientRect().top` contra as linhas de evidência | D2 · S3 | M |
| F09 | `modulo.json` registra 14 divergências; o total real do M01 é **30** (D15, `DECIDIR.md`) | `RoteiroDoModulo.tsx:165-177` imprime "14 pontos deste roteiro têm mais de uma leitura" | O número certo: a contagem precisa somar `aparato.json`, `instrumentos.json` e `aula-08.json`, não só `modulo.json` | S4 · P8 | P |
| F10 | A folha do checklist não existe | `FolhaDoModulo.tsx:1271` manda o learner para ela | Ver C02 — repetido aqui porque é a **única** frase da página do M01 que aponta para um destino inexistente | §6 (FAIL) | P |
| F11 | Léxico (38) e Fontes (8) são objetos do módulo | `FolhaDoModulo.tsx:914-917` e `:1277-1308` os listam sem destino nenhum | Ver E06 e E09: as duas linhas do fim da rota são as únicas sem saída, e é onde o C2 costuma virar "recursos" | C2 · D6 | P |
| F12 | O M01 tem 7 instrumentos no código e **nenhum `instrumentos.json`** na extração (D18) | `RecursosDoModulo.tsx:66` resolve só o `lab-01` como instrumento de módulo | O laboratório com a sua procedência de fonte — é o único aparato do M01 cujo número na tela não tem camada-fonte para citar | S4 · C5 | M |

---

## 7. Pesquisa e decisões pendentes — não são unidades de trabalho

Nada abaixo pode ser verificado numa captura, porque nada abaixo pode ser escrito sem uma decisão editorial ou uma
verificação externa. São **9**.

1. **A decisão do caso (A03/A04).** A fonte não pede decisão (`caso.nota_decisao`). A pergunta que o learner
   responde é texto novo: P3/P11, e o Founder assina a redação. A mecânica é unidade; a frase não é.
2. **O vínculo do caso com aulas e termos (A09).** `caso.vinculos.aulas_declaradas: []`. Demanda, fator de carga,
   fator de potência 0,92 e Grupo A4 são das Aulas 05, 06 e 07 **por conteúdo**; a fonte não declara. Inferir é
   derivação.
3. **Q01 de `DECIDIR.md` — qual forma do critério a tela mostra.** 46 divergências dependem disto. A leitura A
   (mostrar as três, rotuladas pela origem) é o que este inventário assume, porque é o que o P5 manda até a
   reconciliação. Se o Founder escolher B, B02 e D03 mudam de forma.
4. **Q10 / P17 — "Parte N".** A fonte do M01 não numera partes; a do M13 numera. Se o P17 valer para os 17, o lede
   do M02 ("Operação A — a mesma fatura, agora com a lente da rede") fica órfão e precisa de texto conectivo
   derivado.
5. **Q04 / D06 — 28 na prosa × 38 no markup.** O código já adotou 38. Se a prosa vencer, **10 verbetes saem da
   tela**.
6. **A classificação oral/não oral dos 15 itens restantes do checklist.** A extração marca 1 e declara que a
   classificação dos outros "fica para revisão — não decidida aqui".
7. **A última verificação das 8 fontes (E02).** Nenhuma data existe na fonte. Datar exige consultar os documentos
   — e a REN 1.000/2021, o PRODIST Módulo 8 e as páginas institucionais mudam.
8. **QA-M01-A07 e QA-M01-A04** (`DECIDIR.md` §2): "FP 0,85 → os outros 15% são reativos" (o triângulo da própria
   aula dá ≈ 53%) e "perdas exponenciais" onde a fórmula exibida é quadrática. Os dois são conserto editorial
   refutado pela própria fonte, e os dois são texto novo (P11). O content QA vem antes do render.
9. **QA-FCap-01 e QA-M01-A06.** Faixas de fator de capacidade conflitantes entre o INST·06, a figura e o § Lex; e
   "Grupo A ≥ 2,3 kV" na 6.1 contra o subgrupo AS "< 2,3 kV" na 6.2. Nos dois a extração recusa propor número: é
   conhecimento normativo externo (P20). Até lá, cenário didático rotulado (P19).

---

## 8. Procedência deste documento

| Camada | Arquivos lidos |
|---|---|
| Contrato | `docs/alexandria-v2/bar.md` §S3, §S4, §4 (C1, C2, C7, C8, C10), §5 (D3–D6), §6, §9, §11 |
| Fonte | `extraction/m01/modulo.json`, `extraction/m01/aparato.json` |
| Divergências | `extraction/reconciliacao/DECIDIR.md` (Q01, Q04, Q10, D05, D06, D15, D18; QA-M01-A04/A06/A07, QA-FCap-01) |
| Sistemas | `estudos/movimento-e-conquistas/sistema-de-movimento.md` (momento 7), `sistema-de-conquistas.md` (catálogo M01) |
| Mídia | `media-lab/aulas/_publicar/manifesto.json` — 11 assets do M01, **todos de aula**; nenhum aparato do M01 tem mídia publicável nesta rodada |
| Produto (leitura, sem edição) | `src/components/alexandria/modulo/{FolhaDoModulo,RoteiroDoModulo,TrechoDaCarta,aparatos,estadoDoModulo,dossieModulos}.ts(x)`, `src/components/alexandria/viewer/ExercicioBlock.tsx`, `src/components/alexandria/navigation/RecursosDoModulo.tsx`, `src/components/alexandria/glossario/GlossarioView.tsx`, `src/components/alexandria/home/EntradaBlocos.tsx`, `src/pages/alexandria/BibliotecaView.tsx`, `src/lib/progress/progressApi.ts`, `src/lib/data/{alexandria-glossario,alexandria-modulo-01-content}.ts`, `app/routers/progress.py`, `app/db/models/progress.py`, `app/services/progress_service.py` |

Nenhum arquivo de `src/`, `public/`, `tools/`, `app/` ou do git foi tocado nesta rodada.
