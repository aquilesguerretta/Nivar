# M08 · grupo "aparato"

Fonte (só leitura): `C:/dev/GridAlpha v2/Alexandria modulos/alexandria_modulo08.html`. Saída: [`aparato.json`](aparato.json). Extrator: [`extratores/m08_aparato.mjs`](extratores/m08_aparato.mjs).

O quiz sai do literal `QZ` do `<script>` original (executado em DOM simulado); o resto, do markup. Nada foi digitado.

| Grupo | Contagem | Observação |
|---|---|---|
| Caso | 4 subseções, 2 tabelas | perguntas `null`, decisão `null` (P17) |
| Quiz | 10 questões × 4 = 40 alternativas; 2 faixas de placar | gabarito e explicação por questão |
| Checklist final | 26 itens | nenhum vínculo de aula declarado |
| Exercícios | 12 | 0 com aula (todos soltos, P9); 1 com critério próprio |
| § Voz | 40 perguntas-relâmpago, 7 ataques, roteiro de 8 blocos | — |
| Referências | 28 | 0 com URL; 8 com data ou ano no texto |
| Glossário | 124 termos em 7 grupos | 0 faltam no código; 0 definições diferentes |

## Caso

- **Marcador:** "§Caso · Operação A — mineração em Minas Gerais · Parte 8". **h2:** "A planta pela lente da matriz".
- **Parte:** a fonte declara "Parte 8". Diferente do M01, o M08 declara a parte no próprio marcador ("· Parte 8") e no cartão do §MAP ("Operação A · Parte 8"); o lead cita "as sete partes anteriores". O título de produto segue P17 na camada Alexandria.
- **Lead:** "Nas sete partes anteriores a operação foi lida pela física, pela tecnologia, pelo preço, pela regulação, pela história e pelo mapa institucional. Agora ela é lida pela quantidade: de qual submercado ela puxa, o que esse submercado produz hora a hora e mês a mês, e onde está o gargalo mais próximo."
- **Vínculos:** anterior — Módulo 07 (C.4: "fecha o ciclo aberto no Módulo 07"); seguinte — Bloco 9 (C.3: "matéria do Bloco 9").

| Seção | Título | Blocos |
|---|---|---|
| C.1 | Qual submercado, e o que isso implica | paragrafo, paragrafo |
| C.2 | A curva da operação contra a curva da região | paragrafo, paragrafo, tabela, paragrafo |
| C.3 | O gargalo mais próximo | paragrafo, paragrafo |
| C.4 | Quais séries descrevem isso, e com que defasagem | paragrafo, tabela, paragrafo, destaque |

**Dados literais.** O caso não tem células de dado numérico (case-data-cell) como o M01. Os dados literais são: estado (Minas Gerais), submercado (Sudeste/Centro-Oeste), perfil de carga (plano, em turnos) e a projeção de "aproximadamente 25%" no limite de recebimento (C.3). Nenhum valor de consumo, demanda ou custo da planta.

| Confronto | O que a curva mostra | Diagnóstico — o que investigar |
|---|---|---|
| Carga plana contra solar | A solar entrega tudo entre nove e dezesseis horas e nada no resto do dia; a operação consome igual nas 24 horas | Casamento parcial. Contratar exclusivamente solar deixa dois terços do dia descobertos e cria exposição horária que precisaria ser coberta de outra forma. Quanto dessa exposição é aceitável é decisão da operação, não deste diagnóstico. |
| Carga plana contra eólica | Perfil menos concentrado e frequentemente mais forte à noite, mas com variabilidade alta e sazonalidade marcada no segundo semestre | Casamento melhor na forma média, pior na previsibilidade. A investigação relevante é a volatilidade mensal do recurso na região de origem, não a média anual. |
| Carga plana contra hidráulica | Perfil despachável, com sazonalidade que se transfere entre estações via reservatório | É o casamento estrutural mais próximo, e é o que a matriz do submercado já entrega por padrão. A pergunta que sobra não é de perfil, é de custo e de exposição. |

| O que a operação precisa saber | Série pública que responde | Granularidade e defasagem |
|---|---|---|
| Geração por fonte no submercado, hora a hora | Portal de dados abertos do operador nacional | Horária, com dado operativo praticamente do dia anterior |
| Carga do submercado e sua sazonalidade | Portal de dados abertos do operador nacional | Horária, mesma cadência |
| Condição hidrológica — afluência e armazenamento | Informe diário da operação e programa mensal de operação | Diária para o informe, semanal para revisão do programa |
| Corte de geração por causa e por região | Séries de restrição de geração do operador | Diária a mensal, com atenção à quebra metodológica de 2024 |
| Consumo por classe e por setor industrial | Resenha mensal e anuário estatístico do planejador | Mensal preliminar; anual consolidado no primeiro semestre seguinte |
| Evolução do limite de intercâmbio relevante | Sumário executivo do plano da operação de médio prazo | Anual, publicado tipicamente no fim do ano |

**Perguntas e decisão:** `null`. Nenhuma pergunta dirigida ao learner e nenhuma decisão pedida. A coluna "Diagnóstico — o que investigar" (C.2) e a frase "O que ele diz é qual pergunta fazer antes de olhar preço" (L1500) são diagnóstico, e o próprio texto diz que não recomenda ("Ele não diz qual fonte contratar…"). Desafio de decisão, se houver, é camada Alexandria (P17).

**Bloco de produto (P7):** "A tabela acima é, sem alteração, o backlog de fontes de dados do Diagnóstico Energético na dimensão de matriz. E é a demonstração operacional da tese: uma camada analítica independente entrega esse diagnóstico com dado aberto, sem nenhum incentivo para empurrar uma fonte ou um contrato específico — porque não vende nenhum dos dois."

## Quiz

Marcador "§Quiz · Verificação interativa de domínio". h2 "Dez perguntas. Resposta imediata.". Lead: "Quiz de fluência quantitativa. Cada resposta tem retorno explicativo com a aula de origem. O critério de domínio do módulo é acertar pelo menos 8 de 10 sem consultar."

Botões: "Corrigir" (`q-go`), "Refazer" (`q-rst`). Feedback: correta → `<b>Correto.</b>`; incorreta → `<b>Resposta correta: opção N.</b>` + explicação. A ordem das alternativas é fixa (sem embaralhamento). A alternativa correta está na posição 1, 2, 3 ou 4 conforme gabarito_indice. O lead diz "Cada resposta tem retorno explicativo com a aula de origem": o vínculo com aula vem só do parêntese no fim da explicação.

| # | Enunciado | Alternativa correta | Aulas citadas na explicação |
|---|---|---|---|
| 1 | Uma fonte tem 25% da pizza de capacidade e 11% da pizza de geração, no mesmo ano e no mesmo universo. O que isso significa? | 1. Que o fator de capacidade dela está abaixo da média ponderada do parque | aula-08-01 |
| 2 | Alguém afirma que o Brasil é 49,5% renovável. Qual é a leitura correta dessa frase? | 2. Refere-se à matriz energética, não à elétrica, e nessa base é plausível | aula-08-01 |
| 3 | O Nordeste apresenta afluência em 59% da média de longo termo e armazenamento em 89% do volume útil. Qual o diagnóstico? | 3. Situação confortável no presente e em deterioração, porque estoque e fluxo apontam para lados opostos | aula-08-04 |
| 4 | Em qual patamar horário o corte de geração se concentra no sistema brasileiro, e por quê? | 4. Entre nove e dezesseis horas, porque a oferta solar é máxima enquanto a carga líquida está no fundo | aula-08-03, aula-08-05 |
| 5 | Qual é a diferença prática entre corte por confiabilidade elétrica e corte por razão energética? | 2. O primeiro se resolve com reforço de rede; o segundo ocorreria mesmo com transmissão infinita | aula-08-05 |
| 6 | O operador simulou o ano de 2024 com geração distribuída igual a zero. O que aconteceu com a restrição por razão energética? | 4. Caiu para praticamente zero — de milhares de gigawatt-hora para algumas unidades | aula-08-05 |
| 7 | Por que a complementaridade entre a eólica do Nordeste e a hidrologia do Sudeste é considerada eficiente sistemicamente? | 1. Porque a safra dos ventos coincide com o período seco, permitindo poupar água quando ela é mais escassa | aula-08-05, aula-08-03 |
| 8 | Uma empresa informa deter 37% das linhas de transmissão do país. Qual é a leitura correta? | 2. O percentual refere-se ao segmento acima de 230 quilovolts e inclui participações societárias — o qualificador muda o significado | aula-08-05 |
| 9 | O pedido de recuperação judicial no caso da Light, no Rio de Janeiro, foi apresentado por quem, e por quê? | 3. Pela Light S.A., a holding, porque a legislação impede concessionária de serviço público de recorrer ao instrumento enquanto a concessão está ativa | aula-08-06 |
| 10 | O consumo do mercado regulado caiu 3,5% num ano em que o consumo total na rede cresceu. O que aconteceu? | 4. Consumidores migraram para o ambiente livre, redistribuindo consumo entre ambientes contábeis | aula-08-06 |

Alternativas completas e explicações literais no JSON (`questoes[].alternativas`, `questoes[].explicacao`).

**Placar** (`n + '/10'`):
- `n >= 8` (ramo verdadeiro, classe `score show pass`): "Critério de domínio atingido. Passe para o §Voz na ordem: as quarenta perguntas-relâmpago, depois os sete ataques de decisor e por fim o roteiro de dez minutos gravado. E volte ao reconstrutor da Aula 02 uma última vez, sem consultar nada."
- `n >= 8` (ramo falso, classe `score show fail`): "Abaixo do critério de 8 em 10. Releia as aulas indicadas nas correções acima — inteiras, não em diagonal — e refaça. Se os erros se concentraram nas questões de recorte, o problema é a Aula 01 e ela precisa ser refeita antes de qualquer outra."

P18: "Critério de domínio atingido" e "Abaixo do critério de 8 em 10" são registro legado; não viram aprovação.

## Checklist final (26)

"§Final · Critério de conclusão". h2 "Você domina o Bloco 8 quando". Lead: "Vinte e seis verificações. Responda sem travar e sem consultar. Cada uma que falhar aponta uma aula específica — e a aula é para ser refeita inteira, não consultada em diagonal. O primeiro item é o critério oficial e vale por sozinho."

1. Reconstrói de memória as duas pizzas — capacidade e geração — com a ordem correta e tolerância de três pontos por fonte, e explica cada troca de posição pelo fator de capacidade — *reconstrução de memória*
2. Enuncia a fórmula do fator de capacidade e explica por que o denominador precisa ser capacidade média e não a de fim de período — *produção oral/livre*
3. Distingue capacidade instalada de geração efetiva em uma frase, sem usar a palavra "produção" para as duas — *produção oral/livre*
4. Diferencia matriz elétrica de matriz energética e cita a ordem de grandeza da diferença de renovabilidade entre elas — *produção oral/livre*
5. Cita ao menos três universos distintos de capacidade instalada nacional e o que cada um inclui e exclui — *produção oral/livre*
6. Aplica os três eixos — grandeza, escopo e recorte — a qualquer número de matriz antes de aceitá-lo — *produção oral/livre*
7. Trata divergência numérica entre fontes primeiro como hipótese de recorte e só depois como erro — *produção oral/livre*
8. Descreve o perfil sazonal, o perfil intradiário e o fator de capacidade típico de cada uma das seis fontes — *produção oral/livre*
9. Explica por que a solar não tem papel sazonal relevante e por que o vento não tem papel intradiário confiável — *produção oral/livre*
10. Nomeia as três safras — chuva, vento e cana — e a defasagem entre elas — *produção oral/livre*
11. Explica a complementaridade hidro-eólica-solar nas três escalas sem consultar gráfico — *produção oral/livre, sem consulta*
12. Define carga líquida e explica por que ela difere do consumo da sociedade — *produção oral/livre*
13. Descreve a depressão do meio-dia e a rampa vespertina pelas próprias propriedades, sem usar apelido importado — *produção oral/livre*
14. Nomeia os quatro patamares horários e diz o que caracteriza cada um — *produção oral/livre*
15. Explica a assimetria entre sobrar energia no meio do dia e faltar potência no início da noite — *produção oral/livre*
16. Distingue afluência de energia armazenada e diagnostica um caso em que as duas apontam para lados opostos — *produção oral/livre*
17. Explica o que é a média de longo termo e por que ela é mensal e regionalizada — *produção oral/livre*
18. Justifica a existência de um piso de geração hidráulica e relaciona esse piso ao corte de geração — *produção oral/livre*
19. Enumera as três causas regulatórias de corte e diz qual delas reforço de rede resolve — *produção oral/livre*
20. Explica por que o corte recai sobre a geração centralizada e não sobre a distribuída, e cita o contrafactual do operador — *produção oral/livre*
21. Nomeia os três corredores estruturantes, o que cada um resolveu e o risco que cada um criou — *produção oral/livre*
22. Explica por que contrato de energia não determina o caminho físico e o que isso implica para exposição de submercado — *produção oral/livre*
23. Cita as cinco datas da interligação do último estado e diz a qual pergunta cada uma responde — *produção oral/livre*
24. Distingue risco da holding de risco da concessão e explica por que a distribuidora não entra em recuperação judicial — *produção oral/livre*
25. Descreve processo administrativo em curso como processo em curso, jamais como desfecho consumado — *produção oral/livre*
26. Nomeia as três forças que estão mudando a matriz e, para cada uma, a série pública em que ela deixa rastro — *produção oral/livre*

O lead diz que cada verificação "aponta uma aula específica", mas nenhum item declara a aula. Vínculo item → aula, se necessário, é derivado. Marcação P14 por item em modulo.json › criterio[m08-crit-final].

## Exercícios (12)

h2 "Doze exercícios — quatro de estimativa, quatro de recorte, quatro de leitura de série". Nenhum exercício tem tag de aula (as tags são só 01–12). Todos são soltos (P9), como o protocolo §4 já registrava para o M08. Referências em prosa não são posse.

| Tag | Bloco | Enunciado (resumo literal do `summary`) | Critério | Aula | Código |
|---|---|---|---|---|---|
| 01 | Bloco A · estimativa e reconstrução | 01 · Sem consultar nada: qual fonte tem fatia maior em geração do que em capacidade, e por quê? | `null` | solto | `m08-ex-01`, gabarito igual; `prompt: ""`, `points: 1` |
| 02 | Bloco A · estimativa e reconstrução | 02 · Estime, em ordem e com fatia aproximada, as cinco maiores fontes em capacidade instalada no conceito amplo. Depois as cinco maiores em geração. Quantas trocaram de posição? | Critério de acerto: a ordem e a ordem de grandeza. Errar o decimal não é erro; errar a ordem ou não explicar a troca é. | solto | `m08-ex-02`, gabarito igual; `prompt: ""`, `points: 1` |
| 03 | Bloco A · estimativa e reconstrução | 03 · Uma usina de 300 MW gerou 1.200 GWh em um ano. Qual o fator de capacidade, e o que ele sugere sobre a fonte? | `null` | solto | `m08-ex-03`, gabarito igual salvo espaços; `prompt: ""`, `points: 1` |
| 04 | Bloco A · estimativa e reconstrução | 04 · Desenhe de cabeça o perfil de um domingo ensolarado de outubro no sistema. O que acontece em cada um dos quatro patamares? | `null` | solto | `m08-ex-04`, gabarito igual; `prompt: ""`, `points: 1` |
| 05 | Bloco B · recorte e qualificação | 05 · Alguém afirma que a matriz brasileira é 88% renovável. O que você pergunta antes de aceitar? | `null` | solto | `m08-ex-05`, gabarito igual; `prompt: ""`, `points: 1` |
| 06 | Bloco B · recorte e qualificação | 06 · Dois relatórios mostram a solar com 25% num e 11% noutro, no mesmo ano. Qual está errado? | `null` | solto | `m08-ex-06`, gabarito igual; `prompt: ""`, `points: 1` |
| 07 | Bloco B · recorte e qualificação | 07 · A AXIA Energia informa deter 37% das linhas de transmissão do país. Como você lê esse número? | `null` | solto | `m08-ex-07`, gabarito igual; `prompt: ""`, `points: 1` |
| 08 | Bloco B · recorte e qualificação | 08 · Uma reportagem diz que a interligação de Roraima ocorreu em 10 de setembro de 2025. Está certo? | `null` | solto | `m08-ex-08`, gabarito igual; `prompt: ""`, `points: 1` |
| 09 | Bloco C · leitura de série | 09 · A geração hidrelétrica caiu cerca de 5% num ano e a renovabilidade da matriz elétrica caiu 1,4 ponto. O que aconteceu? | `null` | solto | `m08-ex-09`, gabarito igual; `prompt: ""`, `points: 1` |
| 10 | Bloco C · leitura de série | 10 · Uma série mostra o corte de geração indo de 0,1% em 2021 para cerca de 20% em 2025. O que explica a inclinação? | `null` | solto | `m08-ex-10`, gabarito igual; `prompt: ""`, `points: 1` |
| 11 | Bloco C · leitura de série | 11 · O Nordeste aparece com afluência em 59% da média de longo termo e armazenamento em 89% do volume útil. Como você lê isso? | `null` | solto | `m08-ex-11`, gabarito igual; `prompt: ""`, `points: 1` |
| 12 | Bloco C · leitura de série | 12 · O consumo do mercado regulado caiu 3,5% e o do livre subiu. O consumo brasileiro caiu? | `null` | solto | `m08-ex-12`, gabarito igual; `prompt: ""`, `points: 1` |

Resposta de referência: parágrafos literais em `itens[].resposta_de_referencia`. No código, o gabarito virou texto corrido, `prompt` está vazio e `points: 1` não tem origem na fonte (apa-div-07).

## § Voz

h2 "Explicar sem gráfico, reconstruir sem consultar". Lead: "O critério deste bloco não tem frase para decorar — tem forma para carregar. Por isso a §Voz aqui testa duas coisas separadas: a fluência verbal, nas quarenta perguntas e nos sete ataques, e a capacidade de reconstruir a matriz falando, no roteiro de dez minutos. Grave, ouça e refaça."

- **V.1 Quarenta perguntas sem travar** (40). Instrução: "Responda em voz alta, uma atrás da outra, sem consultar. Onde hesitar mais de três segundos, marque: é ali a lacuna real." — *produção oral/livre, cronometrado, sem consulta*.
- **V.2 Sete ataques de decisor cético** (7). Interlocutores: Investidor, Investidor, Analista de crédito, Executivo de data center, Jornalista, Especialista setorial, Diretor industrial. Cada um traz pergunta e partes rotuladas ("O que não fazer:" etc.).
- **V.3 Roteiro oral de dez minutos.** Instrução: "Grave-se explicando a matriz elétrica brasileira em dez minutos, sem consultar nada, para alguém inteligente que não é do setor. A estrutura abaixo é o esqueleto; as palavras têm que ser suas. Ouça a gravação e marque onde você hesitou." — *produção oral/livre, cronometrado, sem consulta*.

| Tempo | Bloco | O que precisa estar dito |
|---|---|---|
| 0:00 – 1:00 | A armadilha de abertura | Não existe a matriz elétrica brasileira; existem várias respostas corretas conforme o eixo escolhido. Dê o exemplo dos quatro números de capacidade instalada e diga que a diferença entre o maior e o menor é maior que todo o parque eólico do país. |
| 1:00 – 2:30 | Os três eixos | Capacidade contra geração, com a fórmula do fator de capacidade dita em voz alta. Elétrica contra energética, com a diferença de quarenta pontos. E o recorte, com um exemplo de universo. |
| 2:30 – 4:00 | As duas pizzas | Reconstrua as duas de memória, em ordem, e explique cada troca de posição pelo fator de capacidade da fonte. Diga qual fonte mais sobe e qual mais desce, e por quê. |
| 4:00 – 5:30 | Sazonalidade | As três safras — chuva, vento, cana — e a defasagem entre elas. Diga por que a expansão eólica no Nordeste foi eficiente sistemicamente, e não apenas barata. |
| 5:30 – 7:00 | O dia | Carga líquida, a depressão do meio-dia e a rampa do fim de tarde, descritas pelas propriedades. Os quatro patamares. A assimetria entre sobrar energia às treze horas e faltar potência às dezenove. |
| 7:00 – 8:15 | Água | Estoque contra fluxo, com um exemplo em que os dois apontam para lados opostos. O piso de geração hidráulica e por que ele produz corte. |
| 8:15 – 9:15 | Rede | O recurso está longe da carga. As três causas de corte e qual delas linha resolve. O descompasso estrutural entre prazo de usina e prazo de linha. |
| 9:15 – 10:00 | Fechamento | A matriz é fluxo, não foto. Nomeie as três forças em movimento e diga, para cada uma, em qual série pública ela deixa rastro. Termine dizendo que tudo isso é dado aberto. |

Fecho: "Quando os dez minutos saírem limpos, faça o corte final: conte a mesma coisa em três minutos, preservando os três eixos, as duas pizzas e a assimetria entre o meio-dia e a noite. Se sobreviver ao corte, é seu."

## Referências (28)

h2 "Vinte e oito fontes primárias". Lead: "Todas as grandezas deste módulo foram verificadas em fonte primária em 1º de agosto de 2026. As fontes estão agrupadas por função, na ordem em que você as abriria para responder a uma pergunta de matriz. Cadência e endereço mudam a cada ciclo — confirme no portal antes de citar."

Nenhuma referência tem URL nem domínio (zero &lt;a>/&lt;em> com endereço no §Ref). As instituições aparecem por perífrase ("operador nacional", "agência", "câmara de comercialização", "planejador"), não por sigla.

| # | Grupo | Título | Instituição | Datas/anos no texto | URL |
|---|---|---|---|---|---|
| 1 | Contabilidade anual da matriz | Balanço Energético Nacional, relatório síntese, ano-base 2025. | Empresa de Pesquisa Energética | ano-base 2025; junho de 2026 | `null` |
| 2 | Contabilidade anual da matriz | Balanço Energético Nacional, relatório completo. | — | — | `null` |
| 3 | Contabilidade anual da matriz | Balanço Energético Interativo e Relatório Dinâmico. | — | 2026 | `null` |
| 4 | Contabilidade anual da matriz | Anuário Estatístico de Energia Elétrica, ano-base 2025. | — | ano-base 2025; 2026 | `null` |
| 5 | Contabilidade anual da matriz | Fact sheet e destaques do Anuário Estatístico. | — | — | `null` |
| 6 | Operação e séries de alta frequência | Portal de dados abertos do Operador Nacional do Sistema Elétrico. | — | — | `null` |
| 7 | Operação e séries de alta frequência | Informe Diário da Operação. | — | — | `null` |
| 8 | Operação e séries de alta frequência | Programa Mensal de Operação e suas revisões semanais. | — | — | `null` |
| 9 | Operação e séries de alta frequência | Procedimentos de Rede. | — | novembro de 2023 | `null` |
| 10 | Operação e séries de alta frequência | Portal institucional do operador, seção de energia em tempo real. | — | — | `null` |
| 11 | Restrição de geração | Relatório do grupo de trabalho de cortes de geração — diagnóstico e perspectiva da evolução dos cortes de geração no Brasil. | Operador nacional | 2025 | `null` |
| 12 | Restrição de geração | Página de esclarecimentos sobre corte de geração do operador. | — | — | `null` |
| 13 | Restrição de geração | Resolução normativa que estabelece os critérios de redução ou limitação de geração | — | — | `null` |
| 14 | Planejamento de médio e longo prazo | Plano Decenal de Expansão de Energia 2035, relatório final. | — | 2035; 2026; 2035; fevereiro e março de 2026; 2 de julho de 2026 | `null` |
| 15 | Planejamento de médio e longo prazo | Caderno de Demanda de Eletricidade do plano decenal. | — | — | `null` |
| 16 | Planejamento de médio e longo prazo | Caderno de Micro e Minigeração Distribuída e Baterias Atrás do Medidor. | — | — | `null` |
| 17 | Planejamento de médio e longo prazo | Caderno de Transmissão do plano decenal. | — | — | `null` |
| 18 | Planejamento de médio e longo prazo | Sumário Executivo do Plano da Operação Elétrica de Médio Prazo, ciclo 2026–2030. | — | ciclo 2026–2030 | `null` |
| 19 | Planejamento de médio e longo prazo | Sumário Executivo do ciclo anterior, 2025–2029. | — | 2025; 2029 | `null` |
| 20 | Planejamento de médio e longo prazo | Programa de Expansão da Transmissão e Plano de Expansão de Longo Prazo. | — | — | `null` |
| 21 | Planejamento de médio e longo prazo | Plano de Outorgas de Transmissão de Energia Elétrica. | — | — | `null` |
| 22 | Outorga, fiscalização e distribuição | Sistema de informações de geração da agência reguladora. | — | — | `null` |
| 23 | Outorga, fiscalização e distribuição | Relatório de acompanhamento da expansão da oferta de geração. | — | — | `null` |
| 24 | Outorga, fiscalização e distribuição | Relatórios e indicadores de distribuição da agência. | — | — | `null` |
| 25 | Outorga, fiscalização e distribuição | Mapa de áreas de atuação das distribuidoras e sistema de informações geográficas do setor. | — | — | `null` |
| 26 | Outorga, fiscalização e distribuição | Comunicações oficiais da agência sobre os dois casos de concessão tratados na Aula 06. | — | — | `null` |
| 27 | Comercialização e monitoramento | Portal de dados abertos da câmara de comercialização. | — | — | `null` |
| 28 | Comercialização e monitoramento | Atas e comunicados do comitê de monitoramento do setor elétrico. | — | — | `null` |

**Data de corte deste módulo** (box rd, L2029): "Todas as verificações em fonte primária foram feitas em 1º de agosto de 2026. Para estatística operativa, outorga, cronograma de obra, indicador de distribuição e qualquer processo administrativo em curso, a base oficial mais recente prevalece sobre a fotografia deste documento — sempre."

## Glossário (124)

h2 "124 termos do Bloco 8". Contagens: h2 124, hero 124, soma dos grupos 124, medida 124 — **todas iguais** (diferente do M01, P22).

| Grupo | Declarados | Medidos |
|---|---|---|
| Grandezas, unidades e universos | 18 | 18 |
| Métricas de utilização e desempenho | 16 | 16 |
| Fontes de geração no agregado | 18 | 18 |
| Hidrologia e armazenamento | 16 | 16 |
| Sistema, submercados e transmissão | 20 | 20 |
| Restrição de geração e operação horária | 16 | 16 |
| Distribuição, consumo e bases de dados | 20 | 20 |

**Código (`alexandria-glossario.ts`):** 124 verbetes `gl-m08-*`; faltam 0; definições diferentes 0; verbetes no código sem termo na fonte 0; `aulaIds` preenchidos em 4 (Recorte → aula-08-01; Rampa → aula-08-03; Carga → aula-08-06; Carga líquida → aula-08-03). A fonte não vincula termo a aula.

**Homônimos em outros módulos** (25, para o produto decidir duplicata; P22): Fator de capacidade (gl-m03-fator-de-capacidade); Despachabilidade (gl-m03-despachabilidade); Inflexibilidade (gl-m02-inflexibilidade, gl-m03-inflexibilidade); Flexibilidade (gl-m04-flexibilidade); Rampa (gl-m02-rampa); Garantia física (gl-m03-garantia-fisica, gl-m06-garantia-fisica, gl-m07-garantia-fisica); Serviços ancilares (gl-m02-servicos-ancilares); Geração distribuída (gl-m06-geracao-distribuida); Autoprodução (gl-m03-autoproducao); Cogeração (gl-m03-cogeracao); Bagaço de cana (gl-m03-bagaco-de-cana); Ciclo combinado (gl-m03-ciclo-combinado); Ciclo simples (gl-m03-ciclo-simples); Repotenciação (gl-m03-repotenciacao); Vertimento (gl-m03-vertimento); Submercado (gl-m02-submercado, gl-m04-submercado, gl-m05-submercado); Rede Básica (gl-m02-rede-basica); Intercâmbio (gl-m02-intercambio, gl-m07-intercambio); Bipolo (gl-m02-bipolo); Resposta da demanda (gl-m02-resposta-da-demanda); Área de concessão (gl-m05-area-de-concessao); Perdas técnicas (gl-perdas-tecnicas, gl-m02-perdas-tecnicas); Perdas não técnicas (gl-perdas-nao-tecnicas, gl-m02-perdas-nao-tecnicas); Ambiente de contratação regulada (gl-m05-ambiente-de-contratacao-regulada); Ambiente de contratação livre (gl-m05-ambiente-de-contratacao-livre).

**Termos** (texto do `span.term` sem o ponto final; definição literal em `termos[].definicao`):

- *Grandezas, unidades e universos:* Capacidade instalada · Capacidade fiscalizada · Capacidade outorgada · Geração efetiva · Geração bruta · Geração líquida · MW · MWh · MWmed · TWh · GW · tep · Matriz elétrica · Matriz energética · Oferta interna de energia elétrica · Oferta interna de energia · Consumo final · Recorte
- *Métricas de utilização e desempenho:* Fator de capacidade · Fator de capacidade potencial · Fator de carga · Disponibilidade · Indisponibilidade programada · Indisponibilidade forçada · Despachabilidade · Inflexibilidade · Flexibilidade · Rampa · Potência firme · Garantia física · Reserva · Serviços ancilares · Intensidade de carbono · Data de entrada em operação comercial
- *Fontes de geração no agregado:* Geração centralizada · Geração distribuída · Micro e minigeração distribuída · Autoprodução · Autoprodução não injetada · Cogeração · Bioeletricidade · Bagaço de cana · Licor preto · Ciclo combinado · Ciclo simples · Usina a fio d'água · Usina com reservatório · Pequena central hidrelétrica · Central geradora hidrelétrica · Repotenciação · Sistema de armazenamento em baterias · Bombeamento reversível
- *Hidrologia e armazenamento:* Energia natural afluente · Média de longo termo · Energia armazenada · Volume útil · Reservatório equivalente de energia · Período úmido · Período seco · Deplecionamento · Vazão mínima · Defluência · Vertimento · Uso múltiplo da água · Diversidade hidrológica · Piso de geração hidráulica · Mecanismo de realocação de energia · Fator de ajuste do mecanismo
- *Sistema, submercados e transmissão:* Sistema Interligado Nacional · Sistema isolado · Submercado · Subsistema · Rede Básica · Rede Básica de Fronteira · Demais instalações de transmissão · Intercâmbio · Limite de intercâmbio · Limite de exportação · Corrente contínua em alta tensão · Bipolo · Estação conversora · Compensador síncrono · Estabilidade de tensão · Recurso conectado por inversor · Contingência · Contrato de uso do sistema de transmissão · Margem de conexão · Leilão de transmissão
- *Restrição de geração e operação horária:* Corte de geração · Restrição por confiabilidade · Restrição por razão energética · Indisponibilidade externa · Geração frustrada · Carga · Carga líquida · Carga supervisionada · Demanda máxima · Patamar horário · Inversão de fluxo · Observabilidade · Controlabilidade · Rateio dos cortes · Recurso energético distribuído · Resposta da demanda
- *Distribuição, consumo e bases de dados:* Concessionária de distribuição · Permissionária · Cooperativa de eletrificação rural · Área de concessão · Caducidade · Duração equivalente de interrupção · Frequência equivalente de interrupção · Indicadores individuais de continuidade · Perdas técnicas · Perdas não técnicas · Perda regulatória · Unidade consumidora · Classe de consumo · Ambiente de contratação regulada · Ambiente de contratação livre · Consumo na rede · Setor eletrointensivo · Balanço energético nacional · Anuário estatístico de energia elétrica · Plano decenal de expansão

## Divergências

| Id | Tipo | Tema |
|---|---|---|
| `apa-div-01` | fonte (P18) | Quiz: lead diz que o critério de domínio é 8 de 10; §00 e §Final dão outras formas do critério |
| `apa-div-02` | fonte×fonte | Quiz Q02: "49,5% renovável" é descrito como matriz energética "plausível"; o texto das aulas diz "próxima de cinquenta por cento" e o §Erros diz "Cinquenta por cento é a matriz energética" |
| `apa-div-03` | fonte×fonte | Quiz Q09: "renovação da concessão por trinta anos" só aparece no feedback do quiz |
| `apa-div-04` | fonte×fonte | Checklist: o lead diz "Cada uma que falhar aponta uma aula específica", mas nenhum item nomeia a aula |
| `apa-div-05` | fonte×fonte | §Lex: h2 "124 termos", hero "124 termos" e soma dos grupos concordam com a contagem medida |
| `apa-div-06` | fonte×fonte | Glossário "Fator de carga" (média/máxima) × fórmula do INST 10 |
| `apa-div-07` | fonte×código | Exercícios no código: prompt vazio e points: 1 sem origem; gabarito achatado em texto |
| `apa-div-08` | fonte×código | Caso, quiz, checklist final, §Voz e §Ref não existem em src/lib/data (medido: os primeiros 40 caracteres de um item de cada grupo, procurados em todos os .ts da pasta) |
| `apa-div-09` | fonte×fonte (leitura) | Siglas: o lead do §Lex promete "Toda sigla é expandida na primeira aparição de cada grupo", mas os verbetes não usam siglas (MW, MWh, GW, TWh, tep, MWmed são termos, não siglas expandidas) |

`apa-div-05` é uma verificação que confere (contagem do glossário), não uma divergência.

## Verificação

- **Segundo verificador adversarial (2026-09-17), sem mudança:** quiz 100% contra o `QZ` avaliado (enunciado, 4 alternativas, `correta`, gabarito e explicação idênticos byte a byte); checklist 100% (26 `li`, texto e origem); glossário 100% (124 termos: termo, definição, grupo e origem por linha); 12 exercícios (resumo e corpo do `det-bd` inteiros; o critério do Ex 02 aparece também em `resposta_de_referencia`, de propósito); 28 referências idênticas ao `li`; cobertura por bloco de texto do caso, § Erros, § Ex, § Quiz, § Voz, § Final, § Lex e § Ref completa; 337 origens a ±3. Nenhuma correção.
- **Verificador adversarial (2026-09-17), sem mudança:** quiz 100% conferido contra o array `QZ` avaliado do script (10 enunciados, 40 alternativas, gabaritos 0123130123, 10 explicações, aulas citadas, origens ±3); checklist 100% (26 `li` idênticos, origens ±3); recontagem independente: 124 `span.term` em 7 grupos (18+16+18+16+20+16+20), 12 `details` no § Ex (1 "Critério"), 40 perguntas, 7 ataques, 8 linhas de roteiro, 28 referências (0 `<a>`/URL, 8 com data ou ano, 2 com instituição logo após o título), caso com 4 `h3`, 2 tabelas e nenhum "?". Nenhuma correção.
- `m08_verify.mjs`: 1.075 strings de conteúdo e 337 origens, 0 falhas; passada estrita: 1.021 folhas, 41 não achadas literalmente (todas inspecionadas, ver abaixo).
- Não achadas na passada estrita: 40 `rotulo_exibido` ("opção N", composto pelo script a partir do índice) e o identificador de módulo.
- Cobertura por token do markup (sem instrumentos): final 100%, caso 100%, ex 100%, quiz_markup 100%, quiz_script 100%, voz 100%, lex 100%, ref 100%.
