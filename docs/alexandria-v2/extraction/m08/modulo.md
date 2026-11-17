# M08 · grupo "modulo"

Fonte (só leitura): `C:/dev/GridAlpha v2/Alexandria modulos/alexandria_modulo08.html` (3.132 linhas, LF, 326.382 bytes; `<script>` em L2042–3130).
Saída: [`modulo.json`](modulo.json). Extrator: [`extratores/m08_modulo.mjs`](extratores/m08_modulo.mjs).

**Como foi extraído.** Um walker por profundidade de tag percorre os filhos diretos de `.wrap` em cada `<section id>`; nenhum texto de conteúdo foi digitado. Onde há HTML inline, o item traz `html` (literal, espaços colapsados) e `texto` (sem tags). Todo item traz `origem {seletor, trecho_inicial, linha_aprox}`. O critério do quiz sai do `<script>` original executado em DOM simulado.

**Vocabulário medido.** `sec-id`, `lede`, `inst`, `box rd|gd|cy`, `lv`, `form`, `src-card`, `map-card`, `ck`: o vocabulário dos M04–M17. Zero `aula-marker`.

## Estrutura do JSON

| Chave | O que contém |
|---|---|
| `identidade` | `<title>`, eyebrow, h1, subtítulo, 12 pílulas do hero, horas (string), 3 eixos (tabela de T.3), rodapé, ocorrências de "GridAlpha" (P24) |
| `tese` | § 00: 25 blocos (T.1–T.3, 2 tabelas, 4 destaques) |
| `resultado_esperado` | `secao_resultado_esperado: null` (a fonte não tem); o destaque "Critério de domínio deste módulo" e a lista 7.5 "O que sobra quando os números vencerem" ficam aqui sem conversão |
| `mapa` | § MAP: 6 blocos (inclui o INST · 01) e 8 cartões (7 aulas e o § Caso). `perguntas: null` |
| `roteiro` | 17 seções na ordem da fonte (7 aulas e 10 aparatos), com subseções, instrumentos e comparação com o código |
| `criterio` | 8 formas literais de critério, com `marcacao_p14` |
| `laboratorios` | `secao_lab: null`; aponta o instrumento de módulo (INST · 01) |
| `voz_principios` | a regra do módulo, 7 destaques "Números vivos"/data de corte, 4 destaques de método, rodapé de escopo |
| `erros_comuns` | § Erros: 18 linhas erro × correção |
| `tradutor` | `null` (não há Tradutor nem segundo § Map) |
| `blocos_de_produto_P7` | 9 caixas "Onde isso entra no produto" (tese, 7 aulas, caso) |
| `comparacao_codigo` | aulas (P8), títulos, cobertura por token do corpo portado, fatos canônicos, catálogo do repo e catálogo canônico |
| `divergencias` | 15 itens; nenhum resolvido |

## Identidade e catálogo (P24)

- **Título (h1, `<title>`, rodapé):** "Matriz Elétrica Brasileira em Profundidade".
- **Catálogo canônico:** `## Módulo 08 — Matriz Elétrica Brasileira em Profundidade` (L728) — igual à fonte. A tabela-resumo abrevia para "Matriz Elétrica Brasileira" (L1839).
- **Catálogo do repositório** (`alexandria-blocks.ts`): `title: 'Matriz Elétrica'`, `priority: 'confirmar'`. Divergência registrada (mod-div-01); pelo P24, o canônico governa o nome.
- **Subtítulo** (`p.sub`): "Quanto de cada fonte existe, onde está, quanto produz, em que mês e em que hora — e por que toda resposta a essas perguntas precisa declarar o recorte antes de dizer o número."
- **Eyebrow:** "Alexandria · Módulo 08 · Trilha 2 — Setor Elétrico Brasileiro". A trilha é **declarada** ("Trilha 2 — Setor Elétrico Brasileiro"); o código usa `level: 2`, `track: 'brasil'`.
- **Horas:** só a pílula "4-5 h de estudo" (L441); `min`/`max` ficam `null`. O catálogo do repo tem `estimatedHoursMin/Max: null` (mod-div-03).
- **Pílulas do hero (12):** 7 aulas · 11 instrumentos · 6 fichas de fonte · 124 termos · 12 exercícios · 18 erros comuns · 10 perguntas de quiz · 40 perguntas-relâmpago · 7 ataques de decisor · 26 itens de checklist · 28 referências · 4-5 h de estudo.
- **Marca:** "GridAlpha" aparece 2 vezes (L516, L2038), uma delas no rodapé ("Trilha 2 do currículo GridAlpha"). Texto literal mantido (camada fonte).

### Os três eixos (declarados na tabela de T.3)

| Eixo | As duas pontas | O que muda entre elas |
|---|---|---|
| Grandeza | Capacidade instalada, em GW, contra geração efetiva, em TWh no período | Fontes com fator de capacidade alto ocupam fatia maior na segunda que na primeira. Fontes com fator baixo, o contrário. É onde a solar despenca e a hidro sobe. |
| Escopo | Matriz elétrica contra matriz energética | A primeira mede só eletricidade. A segunda mede toda a energia consumida no país, inclusive combustível veicular e calor industrial. O percentual renovável cai cerca de quarenta pontos de uma para a outra. |
| Recorte | Universo, data-base e método | Ano civil ou móvel; capacidade fiscalizada ou outorgada; com ou sem geração distribuída; com ou sem autoprodução não injetada na rede; medida no centro de gravidade ou na barra. É o eixo invisível, e é o que mais produz briga desnecessária. |

## Resultado esperado e capacidades

A fonte **não tem** "Resultado esperado" nem lista de capacidades (`secao_resultado_esperado: null`). O que existe, sem conversão:

1. **§ 00, destaque "Critério de domínio deste módulo"** (L519): "Você domina o Bloco 8 quando desenha de memória as duas pizzas — capacidade e geração — com a ordem correta das fontes e a troca de posições explicada pelo fator de capacidade; quando qualifica pelos três eixos qualquer número de matriz que alguém lhe apresente, antes de aceitá-lo; e quando explica a complementaridade hidro-eólica-solar nas três escalas em que ela opera — mês a mês, dia a dia e hora a hora — sem consultar gráfico nenhum."
2. **Aula 07, 7.5 · O que sobra quando os números vencerem** — 11 itens em `ul.ck`:
   - Capacidade é estoque de potência, geração é fluxo de energia, e o fator de capacidade é a única ponte entre os dois
   - Matriz elétrica e matriz energética diferem em cerca de quarenta pontos de renovabilidade, e trocá-las é o erro mais audível da matéria
   - Todo número de matriz depende de universo, data-base e método, e divergência entre fontes é primeiro hipótese de recorte, só depois hipótese de erro
   - A ordem das fontes muda entre as duas pizzas, e a direção da mudança é previsível pelo fator de capacidade de cada uma
   - A complementaridade opera em três escalas independentes, e cada recurso resolve o problema de uma delas e é inútil nas outras
   - Sobra energia no meio do dia e falta potência no início da noite, e são dois problemas distintos com seis horas de distância
   - Estoque e fluxo hidrológico são grandezas independentes que podem apontar em direções opostas no mesmo mês
   - Corte por confiabilidade se resolve com rede; corte por razão energética não se resolve com rede em lugar nenhum
   - Complementaridade sem capacidade de intercâmbio não se converte em benefício físico
   - Concessão é ativo com prazo, e processo administrativo em curso nunca se descreve como desfecho
   - Geração se constrói em anos e transmissão em décadas, e o descompasso é estrutural, não conjuntural
3. **§ Final** — 26 verificações (em `aparato.json › checklist_final`).

## § MAP

h2: "O Brasil elétrico não cabe num gráfico de pizza". Lead: "A pizza diz quanto. Ela não diz onde a energia nasce, por qual linha ela sai, onde ela trava, nem quem está do outro lado esperando por ela. O melhor recurso eólico do país está a dois mil quilômetros do maior centro de carga, e essa distância é metade da história deste bloco."

`perguntas: null`: o § MAP não tem tabela aula × pergunta; os cartões trazem número, tema e descrição.

| Cartão | Tema | Descrição (literal) |
|---|---|---|
| Aula 01 | Os três eixos | Capacidade contra geração, elétrica contra energética, e o recorte. O fator de capacidade como a razão que liga as duas primeiras. A aula que impede todos os erros posteriores. |
| Aula 02 | A matriz por fonte | Quanto de cada uma, onde está, com que fator de capacidade típico, e por que a ordem das fatias muda entre as duas pizzas. Seis fichas de campo fixo e o reconstrutor. |
| Aula 03 | Sazonalidade e complementaridade | As três escalas de tempo: mês a mês, dia a dia, hora a hora. Carga líquida, rampa vespertina e o calendário anual do sistema. |
| Aula 04 | Hidro-dependência | Reservatório como bateria plurianual. Afluência contra média de longo termo, energia armazenada, e por que a mesma característica é vantagem e vulnerabilidade. |
| Aula 05 | Transmissão e gargalos | Topologia do sistema interligado, sistemas isolados, corredores estruturantes, concentração da malha e a anatomia do corte de geração por causa, hora e fonte. |
| Aula 06 | Distribuição e consumo | A concessão como ativo com prazo, dois casos com desfechos opostos sob o mesmo decreto, e o perfil de consumo por classe com indústria e data centers nas pontas. |
| Aula 07 | Síntese | A matriz é fluxo, não foto. As três forças que a estão mudando agora, o que cada uma já mudou de forma mensurável, e o roteador que devolve qual base abrir. |
| §Caso | Operação A · Parte 8 | A planta pela lente da matriz: de qual submercado ela puxa, como a curva dela conversa com a curva de geração da região, e quais séries públicas descrevem isso com que defasagem. |

O § MAP carrega o **INST · 01** (instrumento de módulo; ver `instrumentos.md`).

## Roteiro e contagem de aulas (P8)

Todos os sinais dão **7 aulas**: sec-id "Aula NN" (7), pílula do hero (7), cartões de aula no § MAP (7), `MODULO_08_AULAS` (7, `totalInModule` 7), `AULAS_POR_BLOCO['bloco-08']` (7) e o catálogo canônico ("7 aulas").

| # | Seção | Marcador | Rótulo (sec-id) | Título (h2) | Subseções | Instrumentos |
|---|---|---|---|---|---|---|
| 1 | `tese` | §00 | Tese | Não existe a matriz elétrica brasileira | T.1–T.3 (3) | — |
| 2 | `map` | §MAP | Percurso e mapa físico | O Brasil elétrico não cabe num gráfico de pizza | — | 01 |
| 3 | `a01` | Aula 01 | Os três eixos · a aula que vem antes de qualquer número | Seis pizzas para a mesma pergunta | 1.1–1.3 (3) | 02, 03 |
| 4 | `a02` | Aula 02 | A matriz por fonte · quanto, onde, e por que a ordem muda | Seis fontes, dois rankings, uma troca que explica tudo | — | 04, 05 |
| 5 | `a03` | Aula 03 | Sazonalidade e complementaridade · três escalas de tempo | A matriz muda de forma três vezes: no ano, no dia e na hora | 3.1–3.3 (3) | 06, 07 |
| 6 | `a04` | Aula 04 | Hidro-dependência · a mesma característica é vantagem e vulnerabilidade | O maior sistema de armazenamento de energia do mundo não tem uma bateria | 4.1–4.3 (3) | 08 |
| 7 | `a05` | Aula 05 | Transmissão e gargalos · onde a energia trava | O recurso está a dois mil quilômetros da carga | 5.1–5.5 (5) | 09 |
| 8 | `a06` | Aula 06 | Distribuição e consumo · a concessão como ativo com prazo | Dois casos, um decreto, desfechos opostos | 6.1–6.5 (5) | 10 |
| 9 | `a07` | Aula 07 | Síntese · a matriz é fluxo, não foto | Três forças, e o que cada uma já mudou de forma mensurável | 7.1–7.5 (5) | 11 |
| 10 | `caso` | §Caso | Operação A — mineração em Minas Gerais · Parte 8 | A planta pela lente da matriz | C.1–C.4 (4) | — |
| 11 | `erros` | §Erros | Correção imediata | Dezoito erros que quem estuda este bloco comete | — | — |
| 12 | `ex` | §Ex | Exercícios com gabarito | Doze exercícios — quatro de estimativa, quatro de recorte, quatro de leitura de série | — | — |
| 13 | `quiz` | §Quiz | Verificação interativa de domínio | Dez perguntas. Resposta imediata. | — | — |
| 14 | `voz` | §Voz | Domínio oral e de reconstrução | Explicar sem gráfico, reconstruir sem consultar | V.1–V.3 (3) | — |
| 15 | `final` | §Final | Critério de conclusão | Você domina o Bloco 8 quando | — | — |
| 16 | `lex` | §Lex | Glossário Alexandria | 124 termos do Bloco 8 | — | — |
| 17 | `ref` | §Ref | Fontes | Vinte e oito fontes primárias | — | — |

A Aula 02 não tem `h3` numerado: ela se organiza pelas 6 fichas `src-card` (o hero declara "6 fichas de fonte"; a Aula 06 tem mais 2 `src-card`, 8 no total).

### Aulas: fonte × código

| Aula | `title` = h2 | `subtitle` = rótulo | lead = lede | Instrumentos no código | Blocos no código | Cobertura por token do corpo | Elementos perdidos |
|---|---|---|---|---|---|---|---|
| 01 | sim | sim | sim | m08-inst-02, m08-inst-03 | 20 | 95,4% | `div.form` L584 |
| 02 | sim | sim | só espaço antes do ponto | m08-inst-04-cap, m08-inst-04-ger, m08-inst-05 | 16 | 100% | nenhum |
| 03 | sim | sim | sim | m08-inst-06, m08-inst-07 | 17 | 100% | nenhum |
| 04 | sim | sim | sim | m08-inst-08 | 17 | 100% | nenhum |
| 05 | sim | sim | sim | m08-inst-09 | 30 | 100% | nenhum |
| 06 | sim | sim | sim | m08-inst-10 | 26 | 100% | nenhum |
| 07 | sim | sim | sim | m08-inst-11 | 20 | 100% | nenhum |

Tokens do corpo da aula na fonte (filhos do .wrap, sem sec-id, h2, lede e div.inst) consumidos uma vez contra os tokens de MODULO_08_CORPO[aula]. Mede presença de palavra, não ordem; por isso um bloco inteiro ausente pode ficar mascarado por palavras iguais em outros blocos. Segundo sinal: os primeiros 40 caracteres de cada p/div/ol/ul (exceto box, lv e src-card, que o código reetiqueta; src-card virou titulo + tabela, protocolo §15) precisam existir no texto do código.

- **Aula 01 perdeu o único `div.form` do módulo** (L584–587: "Fator de capacidade = geração do período ÷ (capacidade nominal × horas do período)" e a nota sobre o denominador). O token-bag deu 95,4% porque as palavras da fórmula existem em outros blocos; o início do bloco não existe no código.
- As 6 fichas `src-card` da Aula 02 estão no código com 100% dos tokens, mas como `titulo` + `tabela` (protocolo §15: o primeiro par chave-valor virou cabeçalho).
- **`</b>` órfão:** 10 parágrafos do código têm `</b>` sem abertura, exatamente onde a fonte tem `<span class="hl">` (10 nas aulas). Mesmo defeito do M01 (COD-03).
- `durationMinutes`, `difficulty` e `video` são `null` no código; a fonte não tem `<video>`, `<iframe>` nem `<img>` (medido).
- **Comentário de cabeçalho desatualizado** em `alexandria-modulo-08-content.ts` ("SÓ O INST · 04 PORTADO"): o código real tem os 11 instrumentos (mod-div-11).

### Fatos canônicos do código (`alexandria-modulo-08-fatos.ts`)

Os 10 textos de `M08_FATOS` existem literalmente na fonte ("86,8%", "64,8 GW", "88,1 TWh", "4.330 gigawatt-hora", "7,6 gigawatt-hora", "0,1% em 2021", "20% em 2025", "37%", "230 quilovolts", "725 quilômetros"), e os 4 universos de `M08_UNIVERSOS_CAPACIDADE` (261,0 GW, 215,9 GW, ~255 GW, 269 GW) têm rótulo, data-base, universo e publicação literais na tabela do § 00. `M08_CAPACIDADE_POR_FONTE` é o vetor `I2.src` do INST · 02.

### Existe só na fonte

- tese (§00) — só a tabela de 4 universos em alexandria-modulo-08-fatos.ts (M08_UNIVERSOS_CAPACIDADE)
- critério de domínio e critérios literais
- cartões do §MAP
- eixos (tabela T.3) como dado de módulo
- §Erros (18)
- síntese 7.5 como dado de módulo (está só dentro do corpo da aula 07, se portada)
- badge de M08 (alexandria-badges.ts não tem item do M08)
- § Caso, § Quiz, § Final, § Voz e § Ref (medido em `aparato.json › apa-div-08`)

## Critérios literais (P14)

Marcação: *reconstrução de memória*, *produção oral/livre*, *sem consulta*, *cronometrado*. Nenhum critério é resolvido aqui (P18).

| Id | Onde | Marcação P14 | Texto literal (início) |
|---|---|---|---|
| `m08-crit-00-dominio` | §00 · destaque "Critério de domínio deste módulo" | reconstrução de memória, produção oral/livre, sem consulta | Você domina o Bloco 8 quando desenha de memória as duas pizzas — capacidade e geração — com a ordem correta das fontes e a troca de posições explicada pelo fato… |
| `m08-crit-00-t2` | §00 · T.2 | reconstrução de memória | O critério de domínio deste bloco manda, literalmente, desenhar de memória o gráfico de pizza da matriz elétrica brasileira. Isso parece colidir com tudo que es… |
| `m08-crit-00-regra` | §00 · destaque "A regra que organiza este módulo" | — | O ativo ensina a relação, a ordem e o método de leitura. O número pontual é sempre entrada editável de instrumento ou fotografia datada em destaque vermelho — n… |
| `m08-crit-quiz` | §Quiz · lead + script | sem consulta | Quiz de fluência quantitativa. Cada resposta tem retorno explicativo com a aula de origem. O critério de domínio do módulo é acertar pelo menos 8 de 10 sem cons… |
| `m08-crit-final` | §Final | produção oral/livre, sem consulta | Vinte e seis verificações. Responda sem travar e sem consultar. Cada uma que falhar aponta uma aula específica — e a aula é para ser refeita inteira, não consul… |
| `m08-crit-inst04` | INST 04 · veredito do script | reconstrução de memória | script: msg = '&lt;b>Reconstrução correta.&lt;/b> Ordem certa e todas as seis fatias dentro da tolerância de '+I4.tol+' pontos. Isso é o critério oficial de domínio d… |
| `m08-crit-voz` | §Voz · lead | produção oral/livre, cronometrado | O critério deste bloco não tem frase para decorar — tem forma para carregar. Por isso a §Voz aqui testa duas coisas separadas: a fluência verbal, nas quarenta p… |
| `m08-crit-ex` | §Ex · lead | produção oral/livre | Os quatro primeiros testam reconstrução: você produz a resposta antes de conferir. Os quatro seguintes testam qualificação: dado um número solto, o que falta pe… |

No § Final, cada um dos 26 itens tem marcação própria: reconstrução de memória 1, produção oral/livre 25, sem consulta 1. **Cronometrado** aparece no § Voz ("Grave-se … em dez minutos"; corte final "em três minutos") e na instrução das perguntas-relâmpago (hesitar "mais de três segundos").

Mensagens do quiz (script, L3116): `n >= 8` → "Critério de domínio atingido. Passe para o §Voz na ordem: as quarenta perguntas-relâmpago, depois os sete ataques de decisor e por fim o roteiro de dez minutos gravado. E volte ao reconstrutor da Aula 02 uma última vez, sem consultar nada." / senão → "Abaixo do critério de 8 em 10. Releia as aulas indicadas nas correções acima — inteiras, não em diagonal — e refaça. Se os erros se concentraram nas questões de recorte, o problema é a Aula 01 e ela precisa ser refeita antes de qualquer outra." (P18: registro legado).

## Laboratórios, Tradutor

- Não há "§ Lab" no M08 (zero ocorrências de "§Lab"/"§ Lab"/"LAB"). O instrumento fora de aula é o INST 01, no §MAP (ver instrumentos.json, m08-inst-01).
- Não há "Tradutor" nem segundo "§ Map" no M08 (só §MAP · Percurso e mapa físico).

## Voz e princípios

- **A regra que organiza este módulo** (§ 00): "O ativo ensina a relação, a ordem e o método de leitura. O número pontual é sempre entrada editável de instrumento ou fotografia datada em destaque vermelho — nunca afirmação no corpo do texto."
- **Destaques de método:** "A regra que organiza este módulo" (tese); "A pergunta que resolve noventa por cento das divergências" (a01); "Por que este módulo não usa o apelido consagrado" (a03); "Regra de leitura" (a05).
- **Números vivos / data de corte:** tese, a01, a02, a04, a05, a06, ref.
- **Rodapé de escopo:** "Alexandria · Módulo 08 — Matriz Elétrica Brasileira em Profundidade. Trilha 2 do currículo GridAlpha. Material de estudo interativo. Todas as grandezas verificadas em fonte primária em 1º de agosto de 2026; números pontuais são fotografias datadas e devem ser reconfirmados antes de uso externo. Este módulo descreve fatos e consequências estruturais; não avalia gestão de empresa, decisão de órgão nem política energética."
- O § Voz (40 perguntas-relâmpago, 7 ataques, roteiro oral) está em `aparato.json › voz_oral`.

## § Erros (18)

h2: "Dezoito erros que quem estuda este bloco comete".

| # | Erro | Correção |
|---|---|---|
| 1 | "A matriz elétrica brasileira é cerca de 50% renovável." | Cinquenta por cento é a matriz energética. A elétrica passa de 85%. A confusão entre as duas muda a conclusão sobre o país inteiro. |
| 2 | "A solar já é a segunda maior fonte do Brasil." | Em capacidade instalada, no conceito amplo, sim. Em geração, não — ela cai para menos da metade da fatia. Declare qual pizza antes da frase. |
| 3 | "Capacidade instalada é quanto o país produz." | Capacidade é potência, medida em GW numa data. Geração é energia, medida em TWh num período. Nenhuma converte na outra sem fator de capacidade. |
| 4 | "O fator de capacidade da solar é baixo, logo a solar é ineficiente." | O fator baixo decorre de o recurso só existir de dia e de a potência ser medida no pico. É métrica errada para a pergunta, não defeito da tecnologia. |
| 5 | "As fontes divergem sobre o percentual da hidro, logo uma está errada." | Na maioria dos casos, estão usando universos ou datas-base diferentes. Verifique o recorte antes de escolher um lado. |
| 6 | "O Brasil tem 261 GW de capacidade instalada." | Tem, no conceito amplo do balanço. Tem outros três valores em outras três bases oficiais. Cite o número com o universo colado nele. |
| 7 | "Hidrelétrica só serve para energia barata." | Reservatório fornece também flexibilidade, reserva, rampa, controle de frequência e potência reativa — e é o maior armazenamento de energia do sistema. |
| 8 | "Nível de reservatório alto significa situação confortável." | Estoque alto com afluência muito abaixo da média é situação que se deteriora. Estoque e fluxo precisam ser lidos juntos. |
| 9 | "A eólica do Nordeste tem fator de capacidade acima de 50%." | Há sítios excelentes, mas o valor varia por local, ano, altura, disponibilidade e corte. Um fator regional não se aplica a um município específico. |
| 10 | "Toda a geração solar é visível e comandável pelo operador." | A maior parte da capacidade solar brasileira é distribuída, dispersa e não despachada centralmente. O operador estima, não comanda. |
| 11 | "Corte de geração prova que faltou linha de transmissão." | Pode ser confiabilidade elétrica, razão energética ou indisponibilidade externa. No caso brasileiro recente, a maior parcela é razão energética — que mais linha não resolve. |
| 12 | "Trazer grandes cargas resolve o corte de geração." | Ajuda quando coincidem em hora e em lugar. A simulação do operador com cerca de 4 GW de carga adicional produziu redução inferior a 800 MW médios no corte total. |
| 13 | "Com Roraima interligado, acabaram os sistemas isolados." | Todos os estados passaram a ter conexão ao sistema interligado. Centenas de localidades amazônicas seguem isoladas, com geração majoritariamente a diesel. |
| 14 | "O consumidor livre não depende mais da distribuidora." | Escolhe de quem compra energia e continua conectado, atendido e faturado pela rede local, com o mesmo risco de interrupção. |
| 15 | "A Light distribuidora entrou em recuperação judicial." | O pedido foi da Light S.A., a holding. A concessionária não ingressou no regime, porque a legislação impede enquanto a concessão está ativa. Riscos separados, análises separadas. |
| 16 | "A Enel SP já perdeu a concessão." | Há processo administrativo de caducidade instaurado, com contraditório, defesa e recurso em curso. Processo não é desfecho, e descrevê-lo como tal é o erro mais caro desta matéria. |
| 17 | "O mercado regulado caiu, logo o consumo caiu." | A migração move consumo entre ambientes contábeis sem reduzir consumo físico. Queda do regulado com alta do livre é redistribuição, não retração. |
| 18 | "O gráfico de corte de geração de 2021 a 2025 mostra a evolução do fenômeno." | Mostra também uma mudança de metodologia: até março de 2024 a série considerava só eólicas. Emendar edições sem marcar a quebra transforma mudança de método em fenômeno físico. |

## Blocos "Onde isso entra no produto" (P7): 9

Em tese, a01, a02, a03, a04, a05, a06, a07, caso. Ficam registrados e fora da interface. Citam "Brazil Pulse", "Brasil Terminal" e "Diagnóstico Energético" (vocabulário interno de produto).

## Divergências

| Id | Tipo | Tema |
|---|---|---|
| `mod-div-01` | fonte×catálogo(repo) | Título |
| `mod-div-02` | fonte×catálogo(canônico) | Título abreviado na tabela-resumo do catálogo |
| `mod-div-03` | fonte×catálogo(repo) | Horas |
| `mod-div-04` | fonte×catálogo(canônico) | Critério de domínio citado entre aspas está truncado no catálogo |
| `mod-div-05` | fonte×catálogo(canônico) | Frase entre aspas atribuída ao módulo não existe na fonte |
| `mod-div-06` | fonte×fonte | Nome da unidade: "Módulo 08" × "Bloco 8" |
| `mod-div-07` | fonte×fonte (P18) | Critério de domínio em várias formas |
| `mod-div-08` | fonte×fonte | O §00 T.2 chama o reconstrutor de "o único instrumento de todo o sistema Alexandria que exige que você produza a resposta antes de ver a correção" |
| `mod-div-09` | fonte (vocabulário interno) | "Trava" como vocabulário interno visível ao learner |
| `mod-div-10` | fonte (marca) | GridAlpha no conteúdo |
| `mod-div-11` | fonte×código | Comentário de cabeçalho do código desatualizado |
| `mod-div-12` | fonte (P17) | O caso declara "Parte 8" |
| `mod-div-cod-hl` | fonte×código | Parágrafos com &lt;span class="hl"> perderam a abertura do destaque e ficaram com um &lt;/b> órfão no código (mesmo defeito do M01 COD-03) |
| `mod-div-lead-02` | fonte×código | Lead da Aula 02 não é verbatim no código (só um espaço antes do ponto final: resíduo de &lt;span class="hl"> removido) |
| `mod-div-cob-01` | fonte×código | Corpo da Aula 01 no código: cobertura por token 95.4%, 1 elemento(s) da fonte ausente(s) no código ou abaixo de 60% de cobertura |

Detalhes (leituras A e B, medições, linhas) no JSON.

## Verificação

- **Segundo verificador adversarial (2026-09-17), sem mudança:** script próprio (HTML sem tags e sem espaço, entidades decodificadas) achou todas as folhas de conteúdo do `modulo.json` na fonte (as não achadas são metadados, marcações P14 e rótulos de local desta extração) e as 168 origens a ±3; recontagem: 12 pílulas, 7 `box rd`, 4 `box cy`, 10 `box gd` (9 com "Onde isso entra no produto"), 8 `map-card`, 8 `src-card` estáticos (6 na Aula 02, 2 na Aula 06), 11 `li` na 7.5, 18 linhas de erro, 1 `div.form`, 0 mídia; cobertura por bloco de texto de hero, § 00 e § MAP completa; os 10 `</b>` órfãos e a ausência do `div.form` no código conferem.
- **Verificador adversarial (2026-09-17), corrigido:** `comparacao_codigo.catalogo_canonico.criterio_citado` e `mod-div-04.leitura_b` cortavam a citação do catálogo canônico na L812 (`slice(i, i + 4)`), justamente antes da L813 ("complementaridade hidro-eólica."), que é a evidência da divergência. Agora L809–813.
- **Verificador adversarial (2026-09-17), corrigido:** `catalogo_canonico.frase_entre_aspas` e `mod-div-05.leitura_b` só tinham a L816, que termina em "não existe a". Agora L816–817, com "pizza" — o fecho da frase que a divergência diz não existir na fonte (conferido: zero ocorrências no HTML).
- **Verificador adversarial (2026-09-17), sem mudança:** recontagem independente no HTML (17 seções, 7 aulas, 11 `div.inst`, 12 pílulas, 8 `map-card`, 9 "Onde isso entra no produto", 7 `box rd` "Números vivos", 1 `div.form`, 11 itens em 7.5, 18 erros) confere; todas as strings de conteúdo e as 594 origens (±3 linhas) conferidas por script próprio; as divergências mod-div-01…12 foram rechecadas na fonte, no catálogo e no código.
- `m08_verify.mjs`: 493 strings de conteúdo e 167 origens, 0 falhas; passada estrita: 469 folhas, 2 não achadas literalmente (todas inspecionadas, ver abaixo).
- Não achadas na passada estrita: `modulo.modulo` = "m08"; `modulo.mapa.blocos[4].ref` = "m08-inst-01" — id desta extração e identificador de módulo.
- Contagens cruzadas por três sinais (aulas, instrumentos, termos, exercícios, erros, quiz, checklist, referências, § Voz): todas conferem, ver `extratores/verificacao.json › sinais`.
