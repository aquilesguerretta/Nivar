# M10 · grupo "aparato": como ler a extração

**Fonte (só leitura):** `C:/dev/GridAlpha v2/Alexandria modulos/alexandria_modulo10.html` (4.813 linhas).
**Arquivo gerado:** [`aparato.json`](aparato.json), em UTF-8 com indentação de 2 espaços. **Data:** 2026-09-17.

## Método

`extratores/m10_aparato.mjs` lê a árvore de elementos (`extratores/lib.mjs`). O quiz sai do literal `var Q=[...]` do
`<script>`, avaliado sem reescrita. Nenhum texto foi digitado.

Campos de texto:
- `html` preserva o inline, com os espaços colapsados;
- `texto` remove as tags e decodifica as entidades.

Cada item traz:
- `id` estável (`m10-…`);
- `origem {seletor, trecho_inicial, linha_aprox}`;
- `null` com nota quando a fonte não tem o dado.

**Verificação.** 1.245 strings conferidas contra a fonte e 284 origens na linha declarada, sem falha (282 na geração; +2 na verificação, ver "Verificação" abaixo).

**Cobertura por token (§5):**

| Seção | Cobertura |
|---|---|
| § Caso, § Ex, § Final, § Lex, § Ref | 100% |
| § Quiz (markup + literal `Q`) | 99,9% |

## Estrutura e contagens

| Chave | Seção da fonte | Contagem | Estado no código |
|---|---|---|---|
| `caso` | § Caso (L2697) | 6 subseções C.1–C.6 · 2 tabelas (6 e 9 linhas) · 1 parecer · 0 perguntas ao learner · 0 decisão | **Não extraído** |
| `avaliacao` | § Quiz (L3006) + script `var Q` (L4683–4754), placar (L4791–4796) | 10 questões × 4 alternativas · 2 faixas · gabarito `CADBCDABDC` | **Não extraído** |
| `checklist_final` | § Final (L3084) | 28 itens (o h2 diz "Vinte e oito"; confere) | **Não extraído** |
| `exercicios` | § Ex (L2887) | 14 (o h2 diz "Catorze"; confere) · 14 sem aula (P9) · 0 com critério | Os 14 em `MODULO_10_EXERCICIOS_SOLTOS`, com texto idêntico |
| `referencias` | § Ref (L3328) | 35 · 31 com URL · 3 "Pendente de resolução" · 1 "Fonte de campo" · 14 com data citada | **Não extraído** |
| `glossario` | § Lex (L3125) | 161 termos em 8 famílias (o pill diz 161; confere) | **0 de 161** em `alexandria-glossario.ts` |
| `divergencias` | — | 7 | — |

### caso (P17)

- **Rótulo.** O `sec-id` diz **"§Caso · Parte 10"**, e o h2 diz "Operação A — mineração em Minas Gerais: a fatura".
  - O lede cita "As nove partes anteriores" e "A Parte 9", e a C.6 compara com "os dados que faltavam na Parte 9".
  - A numeração é literal da fonte e pressupõe uma série de partes que o M10 não contém.
  - Pelo P17, "Partes" da fonte não viram estrutura da interface.
- **Sem grade de dados** (`dados` = null). O perfil vem em prosa no lede: carga plana, turnos, SE/CO, fator de carga
  elevado e pouca flexibilidade.
- **As seis subseções têm títulos interrogativos, já respondidos no texto.** Só a C.3 termina em "?".
  `perguntas_da_fonte` lista as seis, e `perguntas_ao_learner` é null.
  - C.1: Qual é o enquadramento provável, e como se confirma.
  - C.2: Que linhas o perfil torna previsíveis e quais torna suspeitas (tabela de 6 linhas).
  - C.3: A demanda contratada é compatível com o fator de carga declarado?
  - C.4: Que evidência de excedente reativo uma planta de mineração apresenta.
  - C.5: Quanto do consumo está em ponta, e o que é deslocável.
  - C.6: O que a fatura resolve dos dados que faltavam na Parte 9 (tabela de 9 linhas: 4 "Sim" e 5 "Não").
- **Parecer.** A caixa `box cy` "O parecer da Parte 10" entrega a conclusão pronta, e `decisao_pedida` é null. O
  Desafio de decisão, se houver, é da camada Alexandria.
- **Menções sem vínculo de marcação.** A prosa cita "a classificação de flexibilidade da Aula 04" (C.5) e "o
  instrumento de reativo desta aula" (C.4).

### avaliacao (P18)

- **Critério literal.**
  - h2: "Dez questões · critério de aprovação 8 de 10";
  - lede: "Sem consulta ao módulo. O critério é oito acertos…".
- **Placar.** Só dois ramos:
  - `acertos >= 8` (classe `pass`): "Critério atingido. A matéria está no ponto de sustentar uma leitura cronometrada…";
  - senão (`fail`): "Abaixo do critério de oito acertos. Reveja as questões erradas…".
- **Por questão.** Enunciado, 4 alternativas com letra, gabarito (índice, letra e texto) e explicação. O feedback é o
  mesmo para acerto e erro, e `vinculo_aula` é null.
- **Mecânica (registro).**
  - As 10 questões ficam numa página, e "Corrigir" avalia todas de uma vez.
  - A correção marca a correta (`right`) e a escolhida errada (`wrong`) e mostra todos os feedbacks.
  - Questão sem resposta conta como erro. "Refazer" reconstrói. Não há persistência.
  - O código de `build()` e `corrigir()` vai literal em `mecanica`.
- **Vínculo com aula.** A fonte não declara nenhum. A divergência div-ap-04 registra a leitura por conteúdo, feita
  por esta extração.

### checklist_final (P14)

28 itens literais. `marcacao_p14` é inferido do verbo:

| Marcação | Itens |
|---|---|
| Cronometrado | 1 (item 01: "…cronometrada, em cinco minutos") |
| Oral ou livre | 1 (item 28: "Sei dizer, sem constrangimento…") |
| Cálculo | 2 (itens 08 e 13) |
| Produção escrita | 5 (itens 20, 21, 23, 24 e 25) |
| Autodeclarado | todos (lista estática `ul.ck`, sem caixa de marcação nem script) |

### exercicios (P9)

**Campos por item:**
- `tag` (01–14);
- `categoria_no_enunciado` (o prefixo, quando existe);
- `enunciado` (com e sem número e prefixo);
- `resposta_referencia` (html/texto);
- `criterio` e `aula_vinculada`, ambos `null`, com `sem_aula: true`.

**Vínculo com aula.** A varredura por `/Aula\s*\d+/` no enunciado e no gabarito dá **zero**, então os 14 são soltos.

**Mecânica.** `details`/`summary` nativo: o gabarito abre com um clique, sem tentativa registrada (C7). O lede pede
"Responda antes de abrir o gabarito".

**Prefixos medidos × prosa:**

| Prefixo | Tags |
|---|---|
| (sem prefixo) | 01, 02, 03, 04, 07 |
| Diagnóstico negativo | 05, 09, 13 |
| Dado faltante | 06, 10, 12 |
| Leitura de fatura | 08, 11, 14 |

A prosa diz "Quatro de leitura de fatura, quatro de diagnóstico negativo, quatro de dado faltante e dois de armadilha
de comparação" (div-ap-01).

**Código.** Os 14 estão em `MODULO_10_EXERCICIOS_SOLTOS`, com `prompt` igual ao summary e `gabarito` igual ao html da
fonte nos 14. Só o código tem `points: 10` e `kind: 'discursiva'`, sem origem na fonte.

### referencias

**Campos por item:**
- `rotulo` literal (`span.src`) e `tipo` (o prefixo antes de " · ");
- `titulo` (o texto antes do primeiro " — ") e `descricao`;
- `instituicao_citada` (quando o texto começa com ANEEL, STF, STJ, CCEE ou Proret);
- `url`, com `url_igual_texto_do_link`, e `dominio`;
- `datas_citadas`, as datas literais no texto.

**Tipos:**

| Tipo | Itens |
|---|---|
| Norma | 13 |
| Lei | 5 |
| Jurisprudência | 5 |
| Dados | 3 |
| Pendente de resolução | 3 |
| Metodologia | 2 |
| Portal | 2 |
| Processo | 1 |
| Fonte de campo | 1 |

**Domínios:** `www.gov.br`, `www2.aneel.gov.br`, `www.planalto.gov.br`, `www2.camara.leg.br`, `portal.stf.jus.br`,
`www.stj.jus.br` e `dadosabertos.ccee.org.br`. Nenhuma URL se repete.

**Data de consulta.** Vale para todas: "1º de agosto de 2026" (lede).

**Sem URL (4).**
- A ref. 32, "Fonte de campo", que cita "os ativos da GridAlpha" (P24).
- As refs. 33–35, "Pendente de resolução".

**Campos ausentes.** Nenhuma referência declara o que responde e o que não responde, tema ou verificação individual.

### glossario (P22)

161 termos, cada um com termo, definição (html/texto), família e origem:

| Família | Termos |
|---|---|
| Estrutura e componentes da fatura | 25 |
| Grupos, subgrupos e modalidades | 20 |
| Demanda e potência | 22 |
| Postos horários | 14 |
| Reativo e fator de potência | 14 |
| Encargos e tributos | 26 |
| Ciclo tarifário e processo | 18 |
| Medição, auditoria e diagnóstico | 22 |

- **Duplicados.** Nenhum dentro do módulo.
- **Contagem.** O § Lex não declara número; o pill do hero diz 161 e confere.
- **Faltam no código: 161 de 161.** `alexandria-glossario.ts` tem M01–M08 e nenhum `gl-m10-*`. A lista é o próprio
  `termos[]`, com `no_codigo_m10: false` em cada item.
- **Homônimos já definidos em outro módulo do código (16).** Pela convenção do código, são verbetes distintos por
  módulo. O lede do § Lex diz que só se repetem quando o M10 dá "sentido operacional distinto".
  - Parcela A, Parcela B (m05);
  - Grupo A, Grupo B (M01 e m06);
  - Classe de consumo, Fator de carga, Recorte (m08);
  - Modalidade tarifária, Demanda, Demanda contratada (M01);
  - Modicidade tarifária, Reajuste tarifário anual, Revisão tarifária periódica (m05);
  - Revisão extraordinária (m05 e m07);
  - Seletividade (m02);
  - Contestação (m07).

## Divergências

1. **div-ap-01.** Distribuição declarada dos exercícios (4/4/4/2) × prefixos (3/3/3 + 5 sem prefixo). Nenhum é
   rotulado "armadilha de comparação".
2. **div-ap-02.** Exercícios no código: textos idênticos, mas `points` e `kind` não têm origem na fonte.
3. **div-ap-03.** O caso é rotulado "Parte 10" (P17).
4. **div-ap-04.** O quiz não tem vínculo de aula. O mapeamento por conteúdo é leitura desta extração, não da fonte.
5. **div-ap-05.** § Lex: 161 = 161 (confere).
6. **div-ap-06.** § Ref: 35 = 35, mas 3 são pendências declaradas e 4 não têm URL.
7. **div-ap-07.** § Final: 28 = 28 (confere).

## Lacunas

- **Caso.** Sem grade de dados, sem perguntas ao learner, sem decisão pedida e sem vínculo de aula por marcação.
- **Quiz, checklist, referências e termos.** Nenhum declara vínculo com aula.
- **Exercícios.** Nenhum tem critério próprio, e o gabarito abre sem tentativa.
- **Referências.** Faltam os campos D5 (o que responde e o que não responde, tema, recorte, verificação individual).
- **Fora do código.** O caso, o quiz, o checklist, o § Ref e os 161 termos existem só no HTML.

## Verificação (verificador adversarial, 2026-09-17)

**Conferido com scripts próprios.** Tudo o que segue foi recalculado sem os extratores:
- **Quiz, 100%.** `var Q` avaliado e comparado a enunciado, 4 alternativas, letra, gabarito e explicação. O gabarito
  `CADBCDABDC` foi recalculado. As origens das 10 questões estão em ±3 linhas.
- **Checklist, 100%.** Os 28 `li` batem em `texto` e `html`, e as linhas em ±3.
- **Glossário, 100%.** Nos 161 termos batem termo, definição, família e linha ±3. As famílias têm
  25/20/22/14/14/26/18/22 termos, e os 16 homônimos foram recontados no código.
- **Exercícios, 100%.** Nos 14, batem summary e resposta, com linha ±3. Prefixos: 3/3/3 + 5.
- **Referências, 100%.** Nos 35, batem os tokens do `li` e as 31 URLs, com linha ±3.
- **Caso, 100%.** Batem os `p`, `li`, `td`, `th` e `h3`, com os seis títulos C.1–C.6 separados de `numero`. As menções
  a "Parte 9" / "nove partes" estão em L2702, 2704, 2793, 2800 e 2823.
- **Origens.** 284 origens verificadas em ±3.

**Correção.** `avaliacao.faixas_do_placar[0..1]` não tinha `origem`, embora `mensagem` seja conteúdo.
- Acrescentada no extrator `m10_aparato.mjs` e regenerada:
  - `acertos >= 8` → L4794;
  - `acertos < 8` → L4795.
- Nenhum outro campo mudou.
