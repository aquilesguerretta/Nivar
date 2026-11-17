# M13 · grupo "aparato"

Fonte (só leitura): `C:/dev/GridAlpha v2/Alexandria modulos/alexandria_modulo13.html` (4.267 linhas). Saída: [`aparato.json`](aparato.json). Extrator: [`extratores/m13_aparato.mjs`](extratores/m13_aparato.mjs).
Camada **fonte**: todo texto entre aspas ou em tabela saiu do JSON, e o JSON saiu do HTML por programa; nada foi
digitado nem parafraseado. `L` é a linha aproximada no HTML-fonte. As divergências ficam com as duas leituras, e
nenhuma é resolvida aqui (P17–P24 valem só na camada de produto).

**Cobertura por token:** §Caso 100% (1.176/1.176), §Ex 100% (1.857/1.857), §Quiz markup 100% (70/70),
§Quiz script 100% (1.495/1.495), §Final 100% (646/646), §Lex 100% (3.486/3.486), §Ref 100% (1.297/1.297).

## Caso — "Operação A — Parte 13" (§Caso, L2420)

- **Título (h2):** "Quando a geradora deixa de ser fornecedora e passa a ser contraparte de crédito".
- **Parte:** "Parte 13". Ao contrário do M01, a fonte do M13 numera o caso como parte de série: "Operação A — Parte 13" no sec-id, e o lede cita "As doze partes anteriores", "Parte 11", "Parte 12" e "A Parte 13 inverte o lado da mesa". Registrado literal; ver div-m13-caso-parte-13 (P17).
- **Blocos (13):** titulo_secao, lede, subsecao, paragrafo, caixa, subsecao, paragrafo, tres_colunas, paragrafo, subsecao, paragrafo, lista, caixa.
- **Subseções:** "A oferta"; "O que o Andaime pergunta antes de assinar"; "A outra ponta: se a Operação A estruturasse geração própria".
- **Dados numéricos próprios:** nenhum bloco de dados; o caso é prosa (JSON: `caso.blocos`).
- **Decisão pedida:** `null`. A fonte não pede decisão: o box final (L2508-2516) declara que as perguntas "são diagnósticas" e "não constituem recomendação de contratar, de não contratar, nem de estruturar qualquer operação financeira". P17 autoriza um Desafio de decisão na camada Alexandria, só com fatos do caso.
- **Menções em prosa:** aulas "Aula 05"; módulos "Módulos 09 e 10", "Módulo 13"; instrumentos "Andaime". Menções em prosa, não tags de vínculo (protocolo §4).
- **No código:** ausente (o §Caso não existe em src/lib/data).

**Perguntas literais (8).** Frases terminadas em "?" dentro do §Caso, recortadas por programa. As três "perguntas de estrutura" (C.2) já vêm com a leitura da própria fonte (corpo + âncora); as lacunas (C.2) trazem "Pergunta:" e "Impacto:". A fonte não pede resposta do learner a nenhuma delas.

1. "Quem controla, e as duas grandezas coincidem?" (L2455)
2. "O contrato é da holding ou de uma sociedade de projeto?" (L2456)
3. "Que parcela da energia da contraparte já está contratada, e por quanto tempo?" (L2457)
4. "Existe garantia de performance, seguro, ou penalidade que efetivamente cubra o dano de uma interrupção?" (L2467)
5. "qual é o limite de responsabilidade e ele cobre o dano provável?" (L2467)
6. "Existe gatilho contratual ligado a rebaixamento de avaliação de crédito, quebra de covenant ou pedido de reestruturação da contraparte?" (L2468)
7. "Como um contrato de fornecimento de longo prazo é tratado num plano de recuperação — mantido, renegociado, ou sujeito ao plano?" (L2469)
8. "O que muda na forma como um banco ou um fundo leria a própria Operação A?" (L2482)

## Quiz (§Quiz + script)

- **Título:** "Dez questões, critério de oito acertos". **Critério em prosa:** "O critério é oito de dez. Abaixo disso, a matéria ainda não sustenta uma hora com um Formulário de Referência aberto — não por falta de informação, mas porque o erro em qualquer uma destas questões é de definição, de status ou de sinal cruzado, e esses são os três que um interlocutor que lê balanço há mais tempo identifica primeiro." (L2816).
- **Estrutura:** 10 questões × 4 alternativas, lidas do literal `var Q=[…]` avaliado em vm. Gabarito na ordem: **D B A B C B A D C B**.
- **Feedback:** O mesmo texto `f` é mostrado para acerto e para erro, em todas as questões, depois de "Corrigir".
- **Interface da fonte:** botões "Corrigir" e "Refazer"; rótulo `'Questão '+(i+1)+' de '+Q.length`; placar `acertos+' / '+Q.length`.
- **Mecânica** (Descrição desta extração a partir do código L4220-4261, não texto da fonte.): Uma tentativa por clique em "Corrigir": todas as 10 questões são corrigidas juntas, e o feedback `f` aparece em todas, respondidas ou não. Questão sem resposta conta como erro (não soma acerto). A alternativa correta recebe a classe `right`; a marcada errada, `wrong` (cor), o que conflita com S2/C7. "Refazer" reconstrói o quiz e limpa o placar; não há persistência.
- **No código:** ausente (o quiz não existe em src/lib/data).

### Faixas do placar (script)

`condicao` e `classe` vêm do código (L4251-4255); só `mensagem_*` é texto verbatim. A fonte tem duas faixas, coerentes com "critério de oito acertos" (ao contrário do M01). P18: o limiar é registro legado; não declara domínio nem aprovação.

| Condição | Classe | Mensagem literal |
|---|---|---|
| `acertos>=8` | `score show pass` | "Critério atingido. A matéria sustenta uma hora com um Formulário de Referência aberto, inclusive a parte mais difícil: recusar a pergunta binária sobre se a ação é uma boa compra, devolvendo estrutura, condição e a pergunta sobre horizonte e tolerância a risco." |
| `acertos<8` | `score show fail` | "Abaixo do critério de oito acertos. Antes de refazer, verifique o padrão do erro: quase todas estas questões testam definição — qual rótulo de resultado operacional, qual denominador de alavancagem, qual caixa entra na cobertura —, status societário — aberta contra fechada, concluída contra anunciada — ou sinal cruzado — múltiplo sozinho contra múltiplo com alavancagem. São esses três que derrubam a credibilidade de tudo que veio antes." |

Execução do script original: com 0 acertos, classe `score show fail` e mensagem igual à faixa fail = true; com 10 acertos, classe `score show pass` e mensagem igual à faixa pass = true.

### Questões

**Q01** (L4149). "Uma companhia divulga, no mesmo trimestre, resultado operacional reportado de R$ 6,8 bi, ajustado de R$ 8,5 bi e regulatório ajustado de R$ 8,6 bi. Qual é a leitura correta?"

- A) "Os três são o mesmo número com arredondamentos diferentes; use o maior, que é o mais recente."
- B) "Dois deles estão errados: só o auditado é utilizável, e os ajustados devem ser descartados."
- C) "A divergência indica manipulação da divulgação e desqualifica o release inteiro."
- D) "Os três podem estar corretos e medem coisas diferentes; qualquer indicador derivado precisa declarar qual denominador usou, sob pena de não ser comparável com nenhuma outra companhia." **← gabarito**

Explicação: "Rótulo diferente, base diferente. O reportado parte das linhas auditadas; o ajustado exclui itens definidos pela administração; o regulatório parte de outra contabilidade. Nenhum é falso, e nenhum é comparável com o de outra empresa sem que a definição esteja declarada. A alavancagem da mesma companhia no mesmo trimestre aparece como 1,8× ou 1,9× dependendo apenas dessa escolha."

**Q02** (L4156). "Uma empresa adquire 68% do capital total de outra e cerca de 35,3% do capital votante. Quem passa a controlar a companhia adquirida?"

- A) "A adquirente, porque detém a maioria do capital total."
- B) "Não a adquirente: controle é poder de voto, e a maioria do capital votante permaneceu com o sócio anterior, que segue controlando." **← gabarito**
- C) "O controle passa a ser compartilhado automaticamente, por força da participação econômica majoritária."
- D) "Depende exclusivamente da aprovação do órgão de defesa da concorrência."

Explicação: "Participação econômica e poder de voto são grandezas distintas sempre que houver classes de ações com direitos diferentes, acordo de acionistas, limitação estatutária de voto ou exigência setorial de controle. No caso real que sustenta esta questão, o sócio estatal permaneceu com cerca de 64,7% do votante e cerca de 32% do total — economicamente minoritário e controlador."

**Q03** (L4163). "Em 2 de agosto de 2026, qual é o estado da Neoenergia como emissora?"

- A) "Companhia de capital fechado: o resgate compulsório das ações remanescentes a R$ 34,02 foi aprovado em 4 de maio de 2026 e pago em 15 de maio, com saída do segmento especial de listagem." **← gabarito**
- B) "Em processo de oferta pública de aquisição, com resultado ainda indefinido."
- C) "Companhia aberta com capital em circulação reduzido após oferta pública de aquisição."
- D) "Companhia aberta, tendo a oferta pública de aquisição sido cancelada por insuficiência de adesão."

Explicação: "O fechamento foi consumado. Efeito prático no battlecard: valor de mercado, retorno em dividendos e múltiplos a mercado deixam de existir; alavancagem, cobertura de juros, cronograma de vencimentos e covenants continuam sendo divulgados enquanto houver registro de emissor voltado a dívida. A análise migra integralmente para a lente de credor."

**Q04** (L4170). "O currículo afirma que o custo de capital do setor brasileiro é "tipicamente 8% a 12% real". Qual é a correção mais precisa?"

- A) "O intervalo está desatualizado: hoje seria de 5% a 8% real, por conta da queda dos juros."
- B) "Não é uma faixa de custos de empresas diferentes: é o mesmo parâmetro regulatório expresso duas vezes — 8,10% real depois de impostos e 12,28% antes, para distribuição, pelo despacho vigente desde março de 2026." **← gabarito**
- C) "O intervalo está correto e é uma constante setorial estável ao longo do tempo."
- D) "O intervalo não faz sentido porque não existe custo de capital regulatório no Brasil."

Explicação: "Os dois extremos da faixa citada são, com precisão quase exata, o mesmo número antes e depois de impostos. Quando alguém disser "o custo de capital do setor é 10%", a resposta correta não é concordar nem discordar: é perguntar antes ou depois de impostos, e de que segmento — transmissão e geração têm 8,00% e 12,11% no mesmo ato."

**Q05** (L4177). "Qual é a diferença central entre o custo de capital regulatório e o custo de capital que o analista usa para avaliar a companhia?"

- A) "Não há diferença: o regulador calcula exatamente o custo de capital de cada empresa."
- B) "O regulatório é sempre mais alto, por incluir prêmio de risco de política pública."
- C) "O regulatório é um parâmetro administrativo aplicado à base de ativos reconhecida para calcular a receita; o do analista é uma estimativa do custo do capital daquela companhia, usada para calcular valor." **← gabarito**
- D) "O regulatório se aplica apenas a geração, e o do analista apenas a distribuição."

Explicação: "Um entra no cálculo da receita, o outro no cálculo do valor. Confundi-los transforma um parâmetro de tarifa numa promessa de rentabilidade que ninguém fez: eficiência operacional, investimento não reconhecido como prudente, qualidade e estrutura de capital real fazem o retorno efetivo divergir do parâmetro."

**Q06** (L4184). "Um analista aplica crescimento perpétuo ao fluxo de uma concessão com doze anos remanescentes, argumentando que concessões historicamente são renovadas. Qual é a correção?"

- A) "Nenhuma: o histórico de renovações justifica a perpetuidade."
- B) "Remover a perpetuidade, ou modelar a renovação como cenário com probabilidade declarada e condicionantes precificadas, sustentado por norma, contrato ou decisão do regulador." **← gabarito**
- C) "Reduzir a taxa de crescimento perpétuo pela metade, mantendo a estrutura."
- D) "Substituir o fluxo de caixa descontado por múltiplo de mercado, que não tem esse problema."

Explicação: "Renovação é cenário até virar direito comprovável. O caso da distribuidora do Rio de Janeiro é a demonstração: o horizonte contratual do ativo era de meses até a recomendação de prorrogação por trinta anos, em dezembro de 2025. O ativo físico não mudou; o direito econômico mudou. Substituir por múltiplo não resolve — só esconde a mesma premissa dentro do comparável."

**Q07** (L4191). "Uma sociedade de projeto tem caixa disponível para o serviço da dívida de R$ 180 milhões e serviço de R$ 150 milhões, com covenant mínimo de 1,25×. Como interpretar?"

- A) "Cobertura de 1,20×, abaixo do mínimo: caracteriza inadimplemento técnico, que pode exigir dispensa formal do credor, aporte de capital ou renegociação." **← gabarito**
- B) "Cobertura de 1,20×, acima do mínimo, porque o covenant só é testado ao fim do prazo."
- C) "A informação é insuficiente: sem o resultado operacional, o índice não pode ser calculado."
- D) "Cobertura de 0,83×, já que o índice se calcula dividindo o serviço pelo caixa disponível."

Explicação: "O índice é o caixa disponível dividido pelo serviço, e 180 sobre 150 dá 1,20×. A alternativa que pede o resultado operacional contém o erro que a Aula 05 combate: o índice se calcula com o caixa disponível definido em contrato, que deduz impostos pagos, capital de giro e investimento de manutenção antes de chegar ao credor — nunca com resultado operacional, que ignora as três saídas."

**Q08** (L4198). "Qual é o efeito de alavancagem alta sobre o preço sobre lucro e sobre o valor da firma sobre resultado operacional?"

- A) "Reduz os dois, porque a dívida é mais barata que o capital próprio."
- B) "Eleva o preço sobre lucro e reduz o valor da firma sobre resultado operacional."
- C) "Não tem efeito sistemático sobre nenhum dos dois, porque ambos neutralizam a estrutura de capital."
- D) "Eleva os dois, mas por mecanismos opostos: no primeiro a dívida reduz o denominador, via juros; no segundo a dívida entra no numerador, via valor da firma." **← gabarito**

Explicação: "O mesmo fato produz duas leituras que parecem confirmar uma à outra e apontam para coisas diferentes. É por isso que nenhum instrumento sério classifica uma companhia como cara ou barata a partir de um múltiplo isolado: é preciso cruzar pelo menos dois sinais — múltiplo com alavancagem, ou retorno em dividendos com política de distribuição."

**Q09** (L4205). "Um grupo divulga posição consolidada de caixa suficiente para os compromissos de curto prazo. Qual é a lacuna, e qual a pergunta correta?"

- A) "Não há lacuna: caixa consolidado é caixa disponível para o grupo."
- B) "A lacuna é o prazo de aplicação do caixa; a pergunta é qual a rentabilidade obtida."
- C) "A lacuna é caixa restrito por sociedade de projeto; a pergunta é quanto do consolidado está na holding e em subsidiárias sem restrição, e sob que condições o caixa das sociedades de projeto pode ser distribuído." **← gabarito**
- D) "A lacuna é a moeda em que o caixa está denominado; a pergunta é qual a exposição cambial."

Explicação: "É a lacuna mais específica do setor de infraestrutura e a que mais passa despercebida. Caixa em sociedade de projeto frequentemente está bloqueado por contrato enquanto testes de cobertura não forem cumpridos, e não transita até a holding — que é onde o vencimento costuma estar. O número consolidado está correto e a conclusão tirada dele, não."

**Q10** (L4212). "Um investidor pergunta, ao fim de uma análise bem construída: "então essa ação é uma boa compra?". Qual é a resposta correta?"

- A) "Sim ou não, conforme o resultado da análise: recusar responder desqualifica o trabalho."
- B) "Devolver a estrutura em três fatos — quem controla, qual a alavancagem e com que desenho, qual evento está pendente —, a condição de cada tese, e a pergunta de volta sobre horizonte e tolerância a risco." **← gabarito**
- C) "Não posso responder por restrições regulatórias, encerrando o assunto."
- D) "Apresentar um preço-alvo com faixa de confiança, deixando a decisão com o investidor."

Explicação: "A resposta correta nunca é sim, não, nem uma evasiva. Um veredito binário é derrubável por qualquer contra-exemplo e não sobrevive a mudança de premissa; uma estrutura com condições declaradas sobrevive e, quando a premissa muda, diz exatamente o que muda junto. Preço-alvo com faixa continua sendo preço-alvo — e não é entregue em nenhum ativo da GridAlpha, em nenhuma hipótese."

## Checklist final (§Final, 28 itens)

"Vinte e oito itens, do primeiro ao último". Lede: "O primeiro item é o critério de domínio inteiro. O último é a disciplina que torna todos os outros publicáveis. Marque mentalmente cada um; os que ficarem em branco são a agenda de estudo.". marcacao_p14 é anotação desta extração, inferida por palavra-chave do próprio item (cronometrado: "uma hora", "minutos", "cronometr…", "em menos de"; oral: "voz alta", "gravar", item iniciado por "Digo"/"Explico", "Recuso a pergunta"; producao_livre: "Produz…", "Escrev…", "nove itens", "três teses"; calculo: item iniciado por "Reconstruo"/"Converto"/"Calculo"/"Modelo"). Não é texto da fonte e precisa de revisão humana. "automatizavel" marca só o quiz. No código: ausente (nenhum badge ou item do M13 em alexandria-badges.ts).

| # | Item literal | P14 (inferido) | Origem |
|---|---|---|---|
| 1 | "Produzo três teses, três riscos e três lacunas a partir de uma ficha de empresa em menos de uma hora, sem consultar o gabarito — cada tese com âncora e contraponto, cada risco com evento e caminho até o caixa, cada lacuna com pergunta formulável e impacto na conclusão." | cronometrado, producao_livre | L2950 |
| 2 | "Digo, sem hesitar, qual dos seis arquétipos de controle cada uma das dez empresas vivas representa." | oral | L2951 |
| 3 | "Verifico se participação econômica é igual a poder de voto antes de escrever "controlada por" em qualquer ficha." | — | L2952 |
| 4 | "Sei que a AES Brasil deixou de existir como emissora independente em 31 de outubro de 2024, e trato o nome como campo histórico dentro da ficha da adquirente." | — | L2953 |
| 5 | "Sei que a Neoenergia consumou o fechamento de capital em maio de 2026, e que isso elimina metade dos indicadores padrão e mantém a outra metade." | — | L2954 |
| 6 | "Sei que a alienação da participação na operadora nuclear pela AXIA foi concluída em março de 2026, e que a União segue controlando a operadora por poder de voto." | — | L2955 |
| 7 | "Sei que a recuperação extrajudicial da Raízen foi homologada em 30 de julho de 2026, e que a sentença ainda comportava recurso na data de verificação." | — | L2956 |
| 8 | "Recuso classificar uma empresa como cara ou barata a partir de um múltiplo isolado, e digo qual é o segundo sinal que preciso cruzar." | — | L2957 |
| 9 | "Explico por que alavancagem alta infla o preço sobre lucro e o valor da firma sobre EBITDA por mecanismos opostos." | oral | L2958 |
| 10 | "Declaro sempre qual rótulo de EBITDA estou usando — reportado, societário, ajustado pela administração, ou regulatório ajustado." | — | L2959 |
| 11 | "Reconstruo a ponte do EBITDA ao caixa livre à mão, deduzindo capital de giro, impostos pagos e investimento." | calculo | L2960 |
| 12 | "Testo recorrência, efeito de caixa, controle da administração e simetria antes de aceitar qualquer ajuste gerencial." | — | L2961 |
| 13 | "Mantenho três colunas em qualquer normalização: reportado, ajuste da administração, ajuste do analista." | — | L2962 |
| 14 | "Distingo WACC corporativo de taxa regulatória de remuneração do capital, e sei que a segunda é fixada anualmente pelo regulador." | — | L2963 |
| 15 | "Sei que a faixa de 8% a 12% real não é intervalo de incerteza: é o mesmo número regulatório antes e depois de impostos." | — | L2964 |
| 16 | "Converto taxa real em nominal pela relação multiplicativa, nunca por subtração." | calculo | L2965 |
| 17 | "Não aplico perpetuidade a concessão com prazo definido sem direito documentado, e sei qual documento sustentaria esse direito." | — | L2966 |
| 18 | "Modelo indenização como fluxo probabilístico descontado até a data provável de recebimento efetivo, não de apuração." | calculo | L2967 |
| 19 | "Verifico a coerência nominal contra real, pré contra pós-impostos, e alavancado contra desalavancado em cada linha do modelo." | — | L2968 |
| 20 | "Calculo cobertura do serviço da dívida com o caixa disponível definido em contrato, nunca com EBITDA." | calculo | L2969 |
| 21 | "Trato a proporção de setenta por trinta como referência de universo, e a capacidade de dívida como saída do cálculo de cobertura." | — | L2970 |
| 22 | "Pergunto quanto do caixa consolidado é livre para transitar até a holding, e sob que condições." | — | L2971 |
| 23 | "Uso soma das partes em grupo com segmentos de risco distinto, com alocação explícita de dívida e de custos corporativos." | — | L2972 |
| 24 | "Trato relatório de corretora como pesquisa de terceiro, citável com casa e data, e nunca como origem de um número financeiro." | — | L2973 |
| 25 | "Registro, em toda ficha, o trimestre do dado e a data em que verifiquei o status societário." | — | L2974 |
| 26 | "Avalio a geradora que me oferece contrato de longo prazo também como contraparte de risco de crédito, não apenas como fornecedora." | — | L2975 |
| 27 | "Nunca nomeio executivo, presidente ou conselheiro de nenhuma companhia em ativo publicado, porque mandato muda e um nome errado destrói a credibilidade do resto." | — | L2976 |
| 28 | "Recuso a pergunta "essa ação é uma boa compra?" devolvendo estrutura, condição e a pergunta de volta sobre horizonte e tolerância a risco — e nunca emito recomendação de compra, venda ou manutenção, nem preço-alvo, em nenhuma hipótese." | oral | L2977 |

## Exercícios (§Ex, 14)

"Catorze exercícios, gabarito oculto". Lede: "Quatro tipos, na proporção que o critério de domínio exige: produção de tese, detecção de lacuna, atualização de status societário e classificação de controle — mais os cálculos que sustentam os quatro. Faça cada um antes de abrir o gabarito; a resposta que se lê sem tentar não treina nada.".
Grupos: Ex.1 "Cálculo e leitura de indicador" (4); Ex.2 "Produção de tese com âncora e contraponto" (3); Ex.3 "Detecção de lacuna" (3); Ex.4 "Atualização de status societário" (2); Ex.5 "Classificação de controle" (2).

**Vínculo com aula (P9).** Nenhuma tag, enunciado ou resposta aponta aula: os 14 são **soltos** (`aula_vinculada: null`).
A coluna "Relação temática" é anotação desta extração (trecho da fonte que trata do mesmo conteúdo), não vínculo.
Nenhum exercício tem critério próprio (`criterio: null`). Nenhum critério próprio por exercício. A instrução geral está no lede do §Ex ("Faça cada um antes de abrir o gabarito").

| # | Tag | Enunciado | Rótulo e resposta de referência | Relação temática (inferida) | Origem |
|---|---|---|---|---|---|
| 1 | "01 · Do EBITDA ao caixa" | "Uma companhia reporta EBITDA de R$ 1,0 bilhão, aumento de capital de giro de R$ 250 milhões, impostos pagos de R$ 80 milhões e investimento de R$ 500 milhões, sem outros ajustes. Estime o caixa livre antes de juros e diga o que a diferença revela." | Resposta. "R$ 170 milhões: 1.000 − 250 − 80 − 500. A conversão foi de dezessete por cento do EBITDA divulgado. Isso não indica problema em si — é o perfil esperado de uma distribuidora em ciclo pesado de investimento. O que a conta revela é que o EBITDA, isolado, não descreve capacidade de pagar dívida nem de distribuir dividendo, e que qualquer afirmação sobre essas duas coisas precisa passar pela demonstração de fluxo de caixa." | a03 (L1419) | L2626 |
| 2 | "02 · Valor da firma e múltiplo" | "Uma empresa tem capital próprio avaliado em R$ 10 bilhões, dívida líquida de R$ 5 bilhões e EBITDA de R$ 2 bilhões. Calcule o EV/EBITDA e diga o que ainda falta antes de qualquer conclusão." | Resposta. "Valor da firma de R$ 15 bilhões; múltiplo de 7,5×. Faltam, no mínimo: prazo remanescente de concessão ou de contratos, investimento obrigatório à frente, qualidade e definição do EBITDA usado, os ajustes de valor da firma — participação de não controladores, arrendamentos, passivos atuariais, caixa não operacional — e um conjunto de comparáveis do mesmo arquétipo e do mesmo estágio de ciclo. Sem isso, 7,5× não é caro nem barato: é apenas 7,5×." | a01 (L905) | L2637 |
| 3 | "03 · Conversão entre taxa real e nominal" | "Com Selic nominal de 14,25% ao ano e inflação projetada de 5,16%, calcule a taxa real implícita corretamente e mostre o erro da subtração simples." | Resposta. "(1,1425 ÷ 1,0516) − 1 ≈ 8,64% ao ano. A subtração simples daria 9,09%, um erro de cerca de 0,45 ponto percentual. Parece pequeno; propagado por vinte anos de fluxo descontado, produz um erro de valor presente de dois dígitos percentuais. Em patamares altos de juros e inflação, a relação multiplicativa não é preciosismo." | a02 (L1215) | L2648 |
| 4 | "04 · Cobertura do serviço da dívida" | "Um projeto tem caixa disponível para o serviço da dívida de R$ 180 milhões e serviço de R$ 150 milhões no período. O covenant exige mínimo de 1,25×. Calcule e interprete." | Resposta. "1,20×. Está abaixo do mínimo contratual, o que caracteriza inadimplemento técnico e pode exigir dispensa formal do credor, aporte de capital ou renegociação. Nota importante: se o cálculo tivesse sido feito com EBITDA em vez do caixa disponível definido em contrato, o índice apareceria mais alto e o problema passaria despercebido até o teste formal." | a05 (L1777) | L2657 |
| 5 | "05 · Tese sobre companhia com ciclo pesado de investimento" | "A partir de uma ficha de distribuidora com investimento trimestral próximo do EBITDA trimestral, produza uma tese de investimento com âncora e contraponto." | Resposta de referência. "Tese: o investimento executado hoje entra na base de remuneração regulatória e passa a gerar receita reconhecida a partir do próximo ciclo de revisão tarifária, convertendo um período de caixa livre negativo em um degrau de receita permanente. Âncora: valor do investimento no trimestre, abertura entre manutenção e expansão quando divulgada, e a data do próximo ciclo de revisão da concessão. Contraponto: a tese deixa de valer se o investimento não for integralmente reconhecido como prudente na revisão, ou se o ciclo de revisão for adiado — em ambos os casos, a companhia terá consumido caixa sem o degrau de receita correspondente." | a08 (L2397) | L2669 |
| 6 | "06 · Tese sobre companhia após combinação de negócios" | "Produza uma tese sobre uma companhia que incorporou outra e reporta alavancagem elevada, com âncora e contraponto." | Resposta de referência. "Tese: as sinergias declaradas na combinação se convertem em caixa ao longo do período de integração, e a desalavancagem resultante reduz a despesa financeira, que hoje consome a maior parte do resultado operacional. Âncora: alavancagem reportada e sua trajetória trimestral, valor das sinergias declaradas contra o valor efetivamente realizado quando divulgado, e o cronograma de vencimentos. Contraponto: a tese cai se as sinergias forem majoritariamente contábeis em vez de caixa, ou se a integração exigir investimento não previsto — em ambos os casos, a alavancagem não cede e a despesa financeira permanece." | map (L3403) | L2682 |
| 7 | "07 · Tese sobre companhia sem controlador" | "Produza uma tese cujo mecanismo dependa do arquétipo de controle, não da operação." | Resposta de referência. "Tese: a ausência de acionista controlador dá à administração liberdade para alocar capital pelo melhor retorno disponível, sem a restrição de prioridade de política pública ou de necessidade fiscal de um controlador estatal — o que, num setor em consolidação, permite capturar oportunidades que companhias controladas não podem perseguir. Âncora: composição acionária sem bloco de controle no Formulário de Referência; histórico de decisões de alocação. Contraponto: a mesma ausência de controlador remove o principal freio sobre a administração, e a tese se inverte se a companhia demonstrar retorno incremental abaixo do custo de capital em aquisições sucessivas — momento em que a liberdade vira risco de execução sem contrapeso." | a07 (L2182) | L2695 |
| 8 | "08 · O que este trecho não diz" | "Trecho hipotético: "A Companhia mantém garantias reais e fidejussórias constituídas em favor de credores no âmbito de contratos de financiamento de suas controladas." Identifique a lacuna e formule a pergunta." | Resposta. "Garantia não detalhada. O trecho confirma a existência de garantias e não informa: quais ativos foram dados, em que valor, a favor de qual credor, com que gatilho de execução, e se há garantia prestada pela controladora que reintroduza risco corporativo numa estrutura que parecia isolada. Pergunta: qual o valor contábil dos ativos onerados, e quais garantias corporativas existem em favor de dívidas de controladas? Impacto: altera diretamente o ativo efetivamente livre para novos financiamentos e a exposição real da holding." | a03 (L3668) | L2711 |
| 9 | "09 · Contingência sem valor" | "Trecho hipotético: "A Companhia figura como parte em processos de natureza tributária cuja perda é classificada como possível, sem provisão constituída." O que perguntar?" | Resposta. "Contingência sem valor provisionado. A classificação como perda possível dispensa provisão pela norma contábil e exige divulgação do valor envolvido em nota explicativa. Se o valor não estiver na nota, é lacuna; se estiver, o exercício é comparar a magnitude com o patrimônio líquido e com a geração anual de caixa. Pergunta: qual o montante total das contingências classificadas como possíveis, por natureza, e qual a expectativa de prazo de julgamento? Impacto: uma contingência tributária relevante pode consumir anos de caixa livre e não aparece em nenhum múltiplo." | a03 (L3673) | L2724 |
| 10 | "10 · Transação com parte relacionada" | "Uma companhia adquire de seu próprio controlador uma participação em ativo operacional, com valor atribuído declarado. Dois acionistas relevantes votam contra na assembleia. Qual a lacuna?" | Resposta. "Transação com parte relacionada sem preço de referência de mercado demonstrado. O valor atribuído está divulgado; o que a lacuna pede é o referencial: houve laudo de avaliação independente, qual metodologia, qual a faixa de valor produzida, e como o preço acordado se situa dentro dela. Os votos contrários não provam nada sobre o preço — mas sinalizam que a lacuna foi percebida por outros acionistas, o que a torna prioritária. Pergunta: qual laudo suportou o valor atribuído, e qual comitê independente se manifestou? Impacto: define se a transação transferiu valor entre controlador e minoritários, e em que direção." | a07 (L2156) | L2736 |
| 11 | "11 · "A AES Brasil está entre as maiores geradoras independentes do país"" | "O que mudou, desde quando, e como reverificar?" | Resposta. "A companhia deixou de existir como emissora independente. A americana AES Corporation vendeu a totalidade de sua participação à Auren Energia; operação anunciada em maio de 2024, aprovada pelo Cade em julho e concluída em 31 de outubro de 2024, com as ações deixando de ser negociadas a partir de 1º de novembro de 2024. A incorporação elevou a capacidade combinada da adquirente de cerca de 3,6 GW para cerca de 8,8 GW. Como reverificar: consulta ao cadastro de emissores da CVM e à lista de companhias listadas da bolsa; fatos relevantes da adquirente; e a seção de combinação de negócios nas demonstrações financeiras. Formulação correta hoje: os ativos e riscos daquela companhia estão no balanço da adquirente, e é ali que precisam ser rastreados." | a07 (L2251) | L2752 |
| 12 | "12 · "A Neoenergia é negociada com free float de 16%"" | "O que mudou, desde quando, e o que isso faz com o battlecard?" | Resposta. "O fechamento de capital foi consumado. A controladora espanhola elevou sua posição em setembro de 2025 comprando a fatia de um fundo de pensão; a oferta pública de aquisição teve leilão em 9 de abril de 2026 e liquidação em 24 de abril; assembleia de 4 de maio de 2026 aprovou o resgate compulsório das 24.255.394 ações remanescentes a R$ 34,02, pagas em 15 de maio de 2026, com saída do segmento especial de listagem e migração de categoria de emissor. Efeito no battlecard: valor de mercado, dividend yield e EV/EBITDA a mercado deixam de existir; alavancagem, cobertura de juros, cronograma de vencimentos e covenants continuam — e a análise migra integralmente para a lente de credor. Como reverificar: cadastro de emissores da CVM, categoria de registro, e a página de relações com investidores para divulgações de dívida." | a04 (L1619) | L2765 |
| 13 | "13 · Participação de 68% sem controle" | "Uma companhia adquire 68% do capital total de outra e cerca de 35,3% do capital votante. Quem controla, e por quê?" | Resposta. "Não é a adquirente. Controle é poder de voto, e a União — por meio da estatal federal que a representa — permaneceu com cerca de 64,7% do capital votante e cerca de 32% do capital total, seguindo controladora. A divergência decorre de classes de ações com direitos distintos, e o resultado é uma companhia com sócio privado economicamente majoritário e sem controle. Como verificar em qualquer caso: composição por classe de ação no Formulário de Referência, acordo de acionistas arquivado, cláusulas estatutárias de limitação de voto, e exigência setorial de controle obrigatório quando aplicável." | a04 (L1530) | L2781 |
| 14 | "14 · Caso hipotético — classifique o arquétipo" | "Uma geradora tem 45% do capital votante com um fundo de infraestrutura estrangeiro, 30% com um fundo de pensão nacional, e os dois assinaram acordo de acionistas que vincula o voto de ambos em matérias relevantes. Os 25% restantes estão pulverizados. Qual o arquétipo, e participação é igual a voto?" | Resposta. "O arquétipo é joint venture coordenada — não "patrocinador financeiro" nem "sem controlador". O acordo de acionistas cria um bloco de 75% do votante que exerce controle de fato, ainda que nenhum dos dois sócios individualmente detenha maioria. A pergunta de verificação decisiva é a vigência e o escopo do acordo: quais matérias vincula, por quanto tempo, e o que acontece se um dos dois quiser sair. Sobre participação contra voto: se o capital for composto apenas por ações ordinárias, as duas grandezas coincidem para cada sócio isolado — mas a soma vinculada pelo acordo é uma terceira grandeza, e é ela que define o controle. Nenhuma tabela de participação, sozinha, mostraria isso." | a04 (L3755) | L2793 |

**No código** (`src/lib/data/alexandria-modulo-13-content.ts › MODULO_13_EXERCICIOS_SOLTOS`): 14 presentes; registrado em `RecursosDoModulo.tsx` = false.
Com `prompt` vazio: 14. Pergunta fundida no gabarito: 14.
Gabarito igual à fonte após normalizar espaços: 14; igual exato: 11.
`points` sem origem: 14.

**Trechos dos Ex 08–10 × INST·05:**
- m13-ex-08: "A Companhia mantém garantias reais e fidejussórias constituídas em favor de credores no âmbito de contratos de financiamento de suas controladas." × INST·05 g1: "A Companhia mantém garantias reais e fidejussórias constituídas em favor de credores no âmbito de contratos de financiamento de suas controladas, conforme detalhado nas notas explicativas."
- m13-ex-09: "A Companhia figura como parte em processos de natureza tributária cuja perda é classificada como possível, sem provisão constituída." × INST·05 g2: "A Companhia figura como parte em processos de natureza tributária e cível cuja expectativa de perda é classificada como possível, para os quais não foram constituídas provisões."
- m13-ex-10: "Uma companhia adquire de seu próprio controlador uma participação em ativo operacional, com valor atribuído declarado. Dois acionistas relevantes votam contra na assembleia. Qual a lacuna?" × INST·05 g3: "A Companhia adquiriu de sua controladora participação societária em ativo operacional, tendo sido atribuído à operação o valor de mercado apurado pela administração."

## Referências (§Ref, 36)

"Trinta e seis fontes, separadas por natureza". **url:** Nenhuma referência tem URL nem domínio (zero "www"/"http" na seção). **tipo_fonte:** A fonte classifica por grupo (R.1 norma e regulação — fonte primária; R.2 divulgação de companhia — fonte primária de número; R.3 pesquisa de terceiro e notícia de evento — citável, nunca origem de número; R.4 referência metodológica e complemento acadêmico). `grupo` guarda isso; não há tipo por item. **D5:** A fonte não informa, por referência, o que responde/não responde, tema, recorte nem última verificação; só 2 itens trazem "Consulta em" (m13-ref-09, m13-ref-12). No código: ausente (nenhuma referência do M13 em src; BibliotecaView não cita o M13).

Caixa "Nota de atualização · 2 de agosto de 2026": "Data de corte da compilação de resultados: 1º de agosto de 2026. Data de verificação de status societário, taxas e decisões: 2 de agosto de 2026. Companhias em janelas de divulgação diferentes — algumas com o segundo trimestre de 2026 já publicado, outras ainda no primeiro. Não compare trimestres diferentes sem normalizar." "Itens com maior probabilidade de mudança até a próxima leitura: decisão do Comitê de Política Monetária de 4 e 5 de agosto de 2026; atualização anual da taxa regulatória de remuneração do capital, prevista para março de 2027; decisão judicial sobre o encerramento da recuperação judicial da distribuidora; execução dos passos declarados após a homologação da recuperação extrajudicial, incluindo aumento de capital e conversão de créditos, que pode alterar a estrutura de controle da companhia; e o perímetro contábil pós-oferta da geradora que concluiu emissão primária em julho de 2026." "Este material é educacional e analítico. Não é recomendação de compra, venda ou manutenção de valores mobiliários, não define preço-alvo, não projeta retorno e não substitui auditoria, engenharia, parecer jurídico ou consultoria de investimento regulada. Nem a GridAlpha nem este material constituem consultoria de investimentos."

| # | Grupo | Natureza/instituição (span.src) | Descrição literal (inclui o título) | URL | Datas citadas | Consulta em | Origem |
|---|---|---|---|---|---|---|---|
| 1 | R.1 | "Legislação federal" | "Lei nº 6.404/1976 — Lei das Sociedades por Ações. Texto compilado. Estrutura das demonstrações, classes de ações, acordo de acionistas, dividendos e governança societária." | null | — | — | L3232 |
| 2 | R.1 | "Legislação federal" | "Lei nº 8.987/1995 — Lei de Concessões. Texto compilado. Prazo, serviço adequado, reversão de bens e economia do contrato de concessão." | null | — | — | L3233 |
| 3 | R.1 | "Legislação federal" | "Lei nº 11.101/2005 — Lei de Recuperação Judicial, Extrajudicial e Falência. Regime dos dois institutos e efeito da homologação sobre credores não aderentes." | null | — | — | L3234 |
| 4 | R.1 | "Legislação federal" | "Lei nº 12.431/2011. Debêntures incentivadas e projetos de infraestrutura prioritários; benefício tributário ao investidor." | null | — | — | L3235 |
| 5 | R.1 | "Legislação federal" | "Lei nº 14.801/2024. Debêntures de infraestrutura com benefício concentrado no emissor e alterações ao regime anterior." | null | — | — | L3236 |
| 6 | R.1 | "Regulação da CVM" | "Resolução CVM nº 80/2022, consolidada. Registro e informações periódicas de emissores; é a base normativa do Formulário de Referência, das informações trimestrais e das demonstrações padronizadas." | null | — | — | L3237 |
| 7 | R.1 | "Regulação da CVM" | "Resolução CVM nº 160/2022, consolidada. Regime das ofertas públicas de valores mobiliários, incluindo o rito de registro automático." | null | — | — | L3238 |
| 8 | R.1 | "ANEEL" | "Despacho nº 1.567/2026, publicado no Diário Oficial da União em 4 de março de 2026. Parâmetros da Taxa Regulatória de Remuneração do Capital vigentes a partir de 1º de março de 2026: 8,10% e 12,28% reais para distribuição, 8,00% e 12,11% para transmissão e geração, depois e antes de impostos respectivamente. Fonte primária do único número de custo de capital citado neste módulo." | null | "4 de março de 2026", "1º de março de 2026" | — | L3239 |
| 9 | R.1 | "ANEEL" | "Procedimentos de Regulação Tarifária — Submódulo 2.4, Custo de Capital. Metodologia de composição da taxa regulatória. Consulta em 2 de agosto de 2026." | null | "2 de agosto de 2026" | "2 de agosto de 2026" | L3240 |
| 10 | R.1 | "ANEEL" | "Procedimentos de Regulação Tarifária — Submódulo 2.3, Base de Remuneração Regulatória. Critérios de reconhecimento de investimento prudente." | null | — | — | L3241 |
| 11 | R.1 | "ANEEL" | "Processos tarifários e memórias de cálculo. Calendário de revisões e reajustes por concessionária." | null | — | — | L3242 |
| 12 | R.1 | "Banco Central do Brasil" | "Decisões do Comitê de Política Monetária. Selic meta em 14,25% ao ano a partir da reunião de 17 de junho de 2026; reunião seguinte em 4 e 5 de agosto de 2026. Consulta em 2 de agosto de 2026." | null | "17 de junho de 2026", "4 e 5 de agosto de 2026", "2 de agosto de 2026" | "2 de agosto de 2026" | L3243 |
| 13 | R.1 | "Banco Central do Brasil" | "Boletim de expectativas de mercado. Projeções de Selic e de inflação para o encerramento de 2026, edição de julho de 2026." | null | "julho de 2026" | — | L3244 |
| 14 | R.1 | "Pronunciamentos contábeis" | "CPC 26 — Apresentação das Demonstrações Contábeis; CPC 03 — Demonstração dos Fluxos de Caixa; CPC 01 — Redução ao Valor Recuperável de Ativos; CPC 47 — Receita de Contrato com Cliente; CPC 06 (R2) — Arrendamentos. Base normativa das definições contábeis usadas neste módulo." | null | — | — | L3245 |
| 15 | R.1 | "Cade" | "Decisões de aprovação de atos de concentração no setor elétrico, 2024 a 2026. Fonte primária do estado de aprovação concorrencial de cada operação citada." | null | "2024 a 2026" | — | L3246 |
| 16 | R.2 | "CVM" | "Portal de consulta a documentos de companhias abertas. Acesso a Formulário de Referência, informações trimestrais, demonstrações padronizadas e fatos relevantes de todas as companhias citadas. É aqui que todo número deste módulo deve ser reconstruído antes de uso externo." | null | — | — | L3251 |
| 17 | R.2 | "B3" | "Página de companhias listadas. Categoria de listagem, códigos de negociação, capital em circulação e documentos societários." | null | — | — | L3252 |
| 18 | R.2 | "AXIA Energia" | "Central de resultados e relações com investidores. Release do 1T26, com os quatro rótulos distintos de EBITDA discutidos no §00, e comunicados sobre a alteração de denominação social e sobre a alienação de participação societária." | null | — | — | L3253 |
| 19 | R.2 | "Cemig" | "Relações com investidores. Release do 1T26, relatório anual do exercício 2025 e abertura de resultado por subsidiária." | null | — | — | L3254 |
| 20 | R.2 | "ENGIE Brasil Energia" | "Relações com investidores. Release do 1T26; documentos da assembleia de 2 de julho de 2026; anúncio de início e de encerramento da oferta pública primária de julho de 2026." | null | "2 de julho de 2026", "julho de 2026" | — | L3255 |
| 21 | R.2 | "Auren Energia" | "Relações com investidores. Release do 1T26; perfil de endividamento; documentos da combinação de negócios concluída em 31 de outubro de 2024." | null | "31 de outubro de 2024" | — | L3256 |
| 22 | R.2 | "Equatorial Energia" | "Relações com investidores. Release do 1T26, com abertura por segmento e definição de alavancagem de covenant." | null | — | — | L3257 |
| 23 | R.2 | "Neoenergia" | "Relações com investidores. Release do 2T26; documentos da oferta pública de aquisição e da assembleia de 4 de maio de 2026 que aprovou o resgate compulsório." | null | "4 de maio de 2026" | — | L3258 |
| 24 | R.2 | "Eneva" | "Relações com investidores. Release do 1T26 e resultados do exercício 2025." | null | — | — | L3259 |
| 25 | R.2 | "CPFL Energia" | "Relações com investidores. Release do 1T26, resultados do exercício 2025 e plano de investimentos plurianual." | null | — | — | L3260 |
| 26 | R.2 | "Vibra Energia" | "Relações com investidores. Release do 1T26 e central de resultados." | null | — | — | L3261 |
| 27 | R.2 | "Raízen" | "Central de resultados e documentos do processo de recuperação extrajudicial, incluindo o plano protocolado em 6 de junho de 2026 e os comunicados posteriores à homologação de 30 de julho de 2026." | null | "6 de junho de 2026", "30 de julho de 2026" | — | L3262 |
| 28 | R.3 | "Pesquisa sell-side" | "Relatórios setoriais de casas de análise brasileiras sobre companhias de energia elétrica, 2025-2026. Úteis para entender como o mercado precifica um evento; nunca como origem de um número. Cite sempre com o nome da casa e a data do relatório, e verifique a seção de conflitos de interesse." | null | "2025-2026" | — | L3267 |
| 29 | R.3 | "Imprensa financeira especializada" | "Cobertura de fatos societários do setor elétrico brasileiro, outubro de 2025 a agosto de 2026. Fonte aceitável de evento — quando algo aconteceu, quem anunciou o quê — e não de número financeiro." | null | "outubro de 2025", "agosto de 2026" | — | L3268 |
| 30 | R.3 | "Decisão judicial" | "Sentença de homologação do plano de recuperação extrajudicial, 3ª Vara de Falências e Recuperações Judiciais do Foro Central de São Paulo, 30 de julho de 2026. Adesão de 81,6% dos créditos quirografários sujeitos; ausência de impugnações." | null | "30 de julho de 2026" | — | L3269 |
| 31 | R.3 | "Decisão judicial" | "Homologação de plano de recuperação judicial de distribuidora, Justiça do Rio de Janeiro, 18 de junho de 2024; e pedido de encerramento protocolado na 3ª Vara Empresarial da comarca da capital em julho de 2026, com decisão pendente na data de verificação." | null | "18 de junho de 2024", "julho de 2026" | — | L3270 |
| 32 | R.4 | "Referência metodológica" | "Literatura consolidada de financiamento de projeto — estrutura contratual, alocação de risco, métricas de cobertura e desenho de amortização. Complemento conceitual, não fonte de número brasileiro." | null | — | — | L3275 |
| 33 | R.4 | "Referência metodológica" | "Bases públicas de parâmetros de avaliação — prêmio de risco de mercado, beta setorial e prêmio-país. Exigem adaptação explícita ao contexto brasileiro e à data-base do trabalho." | null | — | — | L3276 |
| 34 | R.4 | "Referência metodológica" | "Guias multilaterais de alocação de risco em contratos de infraestrutura e princípios de gestão socioambiental em financiamento de projeto." | null | — | — | L3277 |
| 35 | R.4 | "Complemento acadêmico" | "Curso de finanças aplicadas ao setor elétrico oferecido por instituição brasileira de ensino superior, citado pelo próprio currículo como referência externa de estudo. Referência de formação, não fonte a citar em ativo publicado." | null | — | — | L3278 |
| 36 | R.4 | "Alexandria · GridAlpha" | "Módulos 06, 07, 08, 09, 10, 11 e 12. História do setor, mapa institucional, matriz elétrica, ambientes de contratação, anatomia da tarifa industrial, geração distribuída e geopolítica energética. Este módulo usa os sete como pressuposto e não os reensina." | null | — | — | L3279 |

Grupos: R.1 "Norma e regulação — fonte primária" (15); R.2 "Divulgação de companhia — fonte primária de número" (12); R.3 "Pesquisa de terceiro e notícia de evento — citável, nunca origem de número" (4); R.4 "Referência metodológica e complemento acadêmico" (5).

## Glossário (§Lex, 180 termos em 8 famílias)

"Cento e oitenta termos, agrupados por família". Contagem: prosa "Cento e oitenta termos, agrupados por família", pill "180 termos", soma das famílias 180, markup 180. Todos concordam.
Duplicatas na fonte: 0. A fonte não declara vínculo termo → aula; aula_ids = null. alexandria-glossario.ts só tem os blocos M01-M08 (Waves 8 e 34). Nenhum dos 180 verbetes do M13 está no código; todos faltam. Homônimos em outros módulos são verbetes distintos (ids namespaçados), não cobertura. A fonte agrupa por família, sem ordem alfabética declarada.

**Comparação com `alexandria-glossario.ts`.** Há 0 verbetes do M13 no código, e **faltam os 180**.
6 termos têm homônimo em outro módulo, que não é cobertura:
"Custo médio" → `gl-m04-custo-medio`; "Recuperação judicial" → `gl-m06-recuperacao-judicial`; "Base de remuneração regulatória" → `gl-m05-base-de-remuneracao-regulatoria`; "Parcela variável" → `gl-m02-parcela-variavel`; "Parcela B" → `gl-m05-parcela-b`; "Risco hidrológico" → `gl-m06-risco-hidrologico`.

| Família | Resumo literal | Declarado | Medido |
|---|---|---|---|
| 1 | "Família 1 · Demonstrações financeiras e contabilidade — 26 termos" | 26 | 26 |
| 2 | "Família 2 · Resultado, rentabilidade e distribuição — 22 termos" | 22 | 22 |
| 3 | "Família 3 · Dívida, crédito e cobertura — 26 termos" | 26 | 26 |
| 4 | "Família 4 · Múltiplos e avaliação — 24 termos" | 24 | 24 |
| 5 | "Família 5 · Custo de capital e regulação econômica — 20 termos" | 20 | 20 |
| 6 | "Família 6 · Financiamento de projeto e garantias — 26 termos" | 26 | 26 |
| 7 | "Família 7 · Estrutura societária e controle — 20 termos" | 20 | 20 |
| 8 | "Família 8 · Documentos, processos e risco setorial — 16 termos" | 16 | 16 |

### Família 1 · Demonstrações financeiras e contabilidade

| # | Termo | Definição literal | Origem |
|---|---|---|---|
| 1 | "Balanço patrimonial" | "registro do estoque de ativos, passivos e patrimônio líquido em uma data; mede posição, não desempenho." | L2993 |
| 2 | "Demonstração do resultado" | "registro de receitas e despesas reconhecidas em um período pelo regime de competência, não necessariamente por caixa." | L2994 |
| 3 | "Demonstração dos fluxos de caixa" | "registro do dinheiro que efetivamente entrou e saiu, separado em atividades operacionais, de investimento e de financiamento." | L2995 |
| 4 | "Regime de competência" | "reconhecimento de receita e despesa no período em que ocorrem economicamente, independentemente do movimento de caixa." | L2996 |
| 5 | "Notas explicativas" | "seção das demonstrações em que moram as definições, as aberturas por segmento, as contingências e os detalhes de dívida; é onde a análise real acontece." | L2997 |
| 6 | "Informações trimestrais" | "demonstrações intermediárias obrigatórias, revisadas por auditor independente; fonte primária de número trimestral." | L2998 |
| 7 | "Demonstrações financeiras padronizadas" | "demonstrações anuais obrigatórias, auditadas; fonte primária de número anual." | L2999 |
| 8 | "Perímetro de consolidação" | "conjunto de entidades cujos resultados são somados na demonstração consolidada; mudança de perímetro invalida comparação entre períodos." | L3000 |
| 9 | "Ativo contratual" | "direito reconhecido a contraprestação futura condicionado ao cumprimento de obrigações; comum em concessão e em construção." | L3001 |
| 10 | "Ativo regulatório" | "direito a recuperar, em tarifa futura, custo já incorrido e ainda não repassado; descola competência de caixa." | L3002 |
| 11 | "Passivo regulatório" | "obrigação de devolver, em tarifa futura, valor já arrecadado a maior." | L3003 |
| 12 | "Receita de construção" | "receita reconhecida por norma de concessão pela execução de obra de infraestrutura; infla receita e resultado sem margem econômica proporcional." | L3004 |
| 13 | "Imobilizado" | "ativo físico de longa duração usado na operação; em concessão, parcela relevante pode ser reversível ao poder concedente." | L3005 |
| 14 | "Intangível de concessão" | "direito de explorar o serviço concedido, reconhecido como ativo intangível e amortizado ao longo do prazo do contrato." | L3006 |
| 15 | "Ágio por expectativa de rentabilidade futura" | "diferença entre o valor pago em aquisição e o valor justo dos ativos líquidos adquiridos; sujeito a teste de recuperabilidade." | L3007 |
| 16 | "Redução ao valor recuperável" | "reconhecimento contábil de que um ativo vale menos que seu registro; reduz resultado sem consumir caixa no período." | L3008 |
| 17 | "Equivalência patrimonial" | "reconhecimento do resultado proporcional de coligadas e de controladas em conjunto; contribui para o lucro sem transitar por resultado operacional consolidado." | L3009 |
| 18 | "Participação de não controladores" | "parcela do patrimônio e do resultado de subsidiárias que pertence a sócios minoritários dessas subsidiárias, e não à controladora." | L3010 |
| 19 | "Arrendamento reconhecido em balanço" | "obrigação de pagamento por uso de ativo, registrada como passivo e como direito de uso; eleva simultaneamente resultado operacional e dívida." | L3011 |
| 20 | "Provisão" | "obrigação de valor ou prazo incerto, reconhecida no balanço quando a perda é provável e mensurável." | L3012 |
| 21 | "Contingência passiva" | "obrigação possível, divulgada em nota e não provisionada quando a perda não é classificada como provável." | L3013 |
| 22 | "Capital de giro" | "diferença entre ativos e passivos operacionais de curto prazo; sua variação consome ou libera caixa sem passar pelo resultado." | L3014 |
| 23 | "Contabilidade regulatória" | "conjunto paralelo de registros exigido pelo regulador setorial, com critérios distintos da contabilidade societária." | L3015 |
| 24 | "Reconciliação" | "tabela que liga um número ajustado ao número auditado correspondente; um ajuste sem reconciliação não é verificável." | L3016 |
| 25 | "Auditor independente" | "profissional ou firma que examina as demonstrações e emite opinião; opinião modificada é sinal de primeira ordem." | L3017 |
| 26 | "Segmento operacional" | "unidade de negócio cujos resultados são reportados separadamente; sua abertura é o que torna a soma das partes possível." | L3018 |

### Família 2 · Resultado, rentabilidade e distribuição

| # | Termo | Definição literal | Origem |
|---|---|---|---|
| 27 | "EBITDA" | "resultado antes de juros, impostos, depreciação e amortização; aproximação de desempenho operacional e não medida de caixa." | L3025 |
| 28 | "EBITDA reportado" | "o número calculado sem ajustes gerenciais, a partir das linhas auditadas." | L3026 |
| 29 | "EBITDA ajustado" | "o reportado, com exclusão de itens definidos pela administração como não recorrentes; exige reconciliação e teste de simetria." | L3027 |
| 30 | "EBITDA regulatório" | "EBITDA calculado sobre a contabilidade regulatória em vez da societária; é frequentemente o denominador dos covenants divulgados." | L3028 |
| 31 | "EBIT" | "resultado antes de juros e impostos, já deduzidas a depreciação e a amortização." | L3029 |
| 32 | "Lucro operacional após impostos" | "resultado operacional tributado a alíquota normalizada, isolado da estrutura de capital." | L3030 |
| 33 | "Lucro líquido" | "resultado final atribuível aos acionistas, após juros, impostos e itens não operacionais." | L3031 |
| 34 | "Lucro por ação" | "lucro atribuível aos acionistas dividido pelo número médio ponderado de ações; muda com emissão, mesmo sem mudança de resultado." | L3032 |
| 35 | "Fluxo de caixa livre para a firma" | "caixa gerado após impostos e investimento, antes do serviço da dívida; pertence a credores e acionistas." | L3033 |
| 36 | "Fluxo de caixa livre ao acionista" | "caixa que sobra ao acionista após investimento e movimentação líquida de dívida." | L3034 |
| 37 | "Retorno sobre o capital investido" | "lucro operacional após impostos dividido pelo capital investido médio; comparado ao custo de capital, mede criação ou destruição de valor." | L3035 |
| 38 | "Retorno sobre o patrimônio líquido" | "lucro dividido pelo patrimônio; sobe com alavancagem sem que a operação tenha melhorado." | L3036 |
| 39 | "Retorno incremental" | "retorno gerado especificamente pelo capital adicional investido, distinto do retorno médio da base existente." | L3037 |
| 40 | "Investimento de manutenção" | "aporte necessário para preservar a capacidade operacional existente; não é discricionário." | L3038 |
| 41 | "Investimento de expansão" | "aporte destinado a ampliar capacidade ou entrar em novo ativo; é o único componente cujo retorno se avalia isoladamente." | L3039 |
| 42 | "Índice de distribuição" | "proventos atribuídos ao exercício divididos pelo lucro distribuível." | L3040 |
| 43 | "Retorno em dividendos" | "proventos por ação divididos pelo preço da ação; exige período e natureza declarados, e não existe em companhia de capital fechado." | L3041 |
| 44 | "Juros sobre capital próprio" | "forma de remuneração ao acionista dedutível para a companhia, sujeita a retenção na fonte para quem recebe." | L3042 |
| 45 | "Lucro distribuível" | "base sobre a qual a distribuição é calculada, após reservas legais e estatutárias." | L3043 |
| 46 | "Recorrência" | "propriedade de um item que se repete ao longo de períodos; testável contra os últimos oito trimestres." | L3044 |
| 47 | "Item não recorrente" | "evento que, por natureza, não se espera repetir; a classificação é da administração e deve ser verificada, não aceita." | L3045 |
| 48 | "Assimetria de ajustes" | "prática de excluir perdas sem excluir ganhos comparáveis; sinal de primeira ordem sobre a qualidade da divulgação." | L3046 |

### Família 3 · Dívida, crédito e cobertura

| # | Termo | Definição literal | Origem |
|---|---|---|---|
| 49 | "Dívida bruta" | "soma de todas as obrigações financeiras onerosas, antes de qualquer dedução de caixa." | L3053 |
| 50 | "Dívida líquida" | "dívida bruta menos caixa e equivalentes elegíveis; a definição varia entre companhias e precisa ser lida antes do número." | L3054 |
| 51 | "Caixa restrito" | "recurso que existe no balanço e não está disponível para uso livre, por vinculação contratual ou judicial." | L3055 |
| 52 | "Alavancagem" | "razão entre dívida líquida e resultado operacional de doze meses; só é comparável quando o denominador tem a mesma definição." | L3056 |
| 53 | "Cobertura de juros" | "razão entre resultado operacional e juros pagos ou despesa financeira; mede capacidade de sustentar o custo da dívida." | L3057 |
| 54 | "Prazo médio" | "duração média ponderada da dívida até o vencimento; prazo curto concentra risco de refinanciamento." | L3058 |
| 55 | "Custo médio" | "taxa média ponderada paga sobre a dívida existente, expressa em referência a um indexador." | L3059 |
| 56 | "Indexador" | "índice ao qual a dívida ou a receita está atrelada; o descasamento entre os dois é uma categoria própria de risco." | L3060 |
| 57 | "Cronograma de amortização" | "distribuição dos vencimentos ao longo do tempo; concentração em um ano é o dado que mais importa e o menos citado." | L3061 |
| 58 | "Risco de refinanciamento" | "risco de não conseguir substituir dívida vincenda em condições viáveis; mercado aberto hoje não é mercado aberto no vencimento." | L3062 |
| 59 | "Covenant" | "obrigação financeira ou operacional cujo descumprimento restringe distribuição ou caracteriza inadimplemento." | L3063 |
| 60 | "Covenant financeiro" | "obrigação expressa em indicador — tipicamente alavancagem ou cobertura — testada periodicamente." | L3064 |
| 61 | "Inadimplemento técnico" | "descumprimento de obrigação contratual sem falta de pagamento; abre direito de vencimento antecipado ao credor." | L3065 |
| 62 | "Dispensa formal" | "autorização do credor para descumprimento pontual de obrigação contratual, tipicamente onerosa." | L3066 |
| 63 | "Inadimplemento cruzado" | "cláusula pela qual o descumprimento em um contrato aciona o vencimento em outro; conecta riscos que pareciam isolados." | L3067 |
| 64 | "Crédito quirografário" | "crédito sem garantia real sobre bens do devedor; classe típica em reestruturação de dívida corporativa." | L3068 |
| 65 | "Crédito com garantia real" | "crédito assegurado por bem específico dado em garantia; tem prioridade sobre o quirografário." | L3069 |
| 66 | "Crédito entre empresas do grupo" | "obrigação de uma companhia do grupo com outra; pode ser subordinada aos credores externos em plano de reestruturação." | L3070 |
| 67 | "Subordinação" | "posição contratual ou legal de um crédito atrás de outro na ordem de pagamento." | L3071 |
| 68 | "Recuperação judicial" | "processo em juízo de reestruturação de dívida, com suspensão de execuções e assembleia geral de credores." | L3072 |
| 69 | "Recuperação extrajudicial" | "processo em que o plano é negociado antes do protocolo e homologado com adesão mínima legal, sem assembleia; estende-se aos não aderentes." | L3073 |
| 70 | "Homologação" | "decisão judicial que torna o plano vinculante para a totalidade dos credores sujeitos." | L3074 |
| 71 | "Reperfilamento" | "alteração negociada de prazo, taxa e forma de pagamento da dívida existente." | L3075 |
| 72 | "Conversão de dívida em capital" | "troca de crédito por participação societária; altera a estrutura de controle sem transação de controle." | L3076 |
| 73 | "Avaliação de crédito externa" | "opinião de terceiro sobre capacidade de pagamento, com metodologia própria e prazo de revisão; não dispensa análise própria." | L3077 |
| 74 | "Risco de contraparte" | "risco de que a outra parte de um contrato não consiga honrá-lo ao longo da vigência; aplica-se a fornecedor de energia tanto quanto a devedor." | L3078 |

### Família 4 · Múltiplos e avaliação

| # | Termo | Definição literal | Origem |
|---|---|---|---|
| 75 | "Valor da firma" | "valor de mercado do capital próprio somado à dívida líquida e a ajustes; representa o valor atribuível a credores e acionistas." | L3085 |
| 76 | "Ajustes de valor da firma" | "participação de não controladores, arrendamentos, passivos atuariais, ações resgatáveis, opções e caixa não operacional; sua definição precisa ser declarada." | L3086 |
| 77 | "Valor do capital próprio" | "valor atribuível aos acionistas após dívida e demais reivindicações." | L3087 |
| 78 | "Valor da firma sobre EBITDA" | "razão entre valor da firma e resultado operacional; compara empresas com estruturas de capital diferentes na mesma régua." | L3088 |
| 79 | "Preço sobre lucro" | "razão entre preço por ação e lucro por ação; sensível a dívida, impostos e itens não recorrentes." | L3089 |
| 80 | "Preço sobre valor patrimonial" | "razão entre preço e patrimônio contábil; útil em rede regulada, distorcida por ágio e por defasagem entre base regulatória e contábil." | L3090 |
| 81 | "Valor da firma sobre base de ativos" | "razão de triagem em segmentos regulados; não substitui margem, investimento, prazo e qualidade regulatória." | L3091 |
| 82 | "Soma das partes" | "avaliação por segmento, somada e ajustada por dívida e custos corporativos; obrigatória quando os segmentos têm riscos distintos." | L3092 |
| 83 | "Desconto de conglomerado" | "diferença entre o valor da soma das partes e o valor atribuído ao grupo consolidado." | L3093 |
| 84 | "Comparáveis" | "conjunto de empresas ou transações usado como referência; a escolha do conjunto determina o resultado tanto quanto o cálculo." | L3094 |
| 85 | "Fluxo de caixa descontado" | "avaliação pelo valor presente dos fluxos projetados a uma taxa que reflete o risco." | L3095 |
| 86 | "Valor presente líquido" | "soma dos fluxos descontados menos o investimento; mede valor criado em moeda." | L3096 |
| 87 | "Taxa interna de retorno" | "taxa que zera o valor presente líquido; pode ter múltiplas soluções e ignora escala." | L3097 |
| 88 | "Valor terminal" | "valor dos fluxos além do horizonte explícito; em concessão, exige direito econômico documentado." | L3098 |
| 89 | "Crescimento perpétuo" | "premissa de continuidade indefinida do fluxo; inaplicável a direito econômico com prazo definido." | L3099 |
| 90 | "Horizonte explícito" | "período em que os fluxos são projetados individualmente, antes do valor terminal." | L3100 |
| 91 | "Indenização por investimento não amortizado" | "valor devido ao concessionário ao fim do contrato pelos investimentos ainda não recuperados." | L3101 |
| 92 | "Ativo reversível" | "bem que retorna ao poder concedente ao término da concessão." | L3102 |
| 93 | "Análise de sensibilidade" | "variação de uma premissa por vez para medir a exposição do resultado a ela." | L3103 |
| 94 | "Cenário" | "conjunto coerente de premissas que mudam juntas por uma causa comum, distinto de sensibilidade isolada." | L3104 |
| 95 | "Ponto de equilíbrio" | "valor de uma variável que leva o resultado a um limite crítico — valor presente nulo, cobertura no covenant, alavancagem no teto." | L3105 |
| 96 | "Fluxo de caixa descontado reverso" | "exercício de inferir, a partir do valor de mercado, quais premissas estariam implícitas nele." | L3106 |
| 97 | "Faixa de valor" | "apresentação do resultado como intervalo com cenários declarados, em vez de número único." | L3107 |
| 98 | "Falsa precisão" | "efeito de um modelo detalhado transmitir confiança que as premissas não sustentam." | L3108 |

### Família 5 · Custo de capital e regulação econômica

| # | Termo | Definição literal | Origem |
|---|---|---|---|
| 99 | "Custo médio ponderado de capital" | "média ponderada entre custo do capital próprio e custo da dívida após benefício fiscal, pelos pesos da estrutura de capital." | L3115 |
| 100 | "Custo do capital próprio" | "retorno exigido pelo acionista, estimado a partir de taxa livre de risco, prêmio de mercado, beta e prêmio-país." | L3116 |
| 101 | "Custo da dívida" | "taxa efetiva paga sobre a dívida, refletindo moeda, prazo e risco de crédito da companhia." | L3117 |
| 102 | "Taxa livre de risco" | "referência de rendimento sem risco de crédito, em moeda e prazo compatíveis com o fluxo projetado." | L3118 |
| 103 | "Prêmio de risco de mercado" | "retorno adicional exigido por investir em ações em vez de em ativo livre de risco." | L3119 |
| 104 | "Prêmio-país" | "retorno adicional exigido por investir em uma jurisdição específica; sobrepõe-se parcialmente ao beta e ao prêmio de mercado." | L3120 |
| 105 | "Beta" | "medida de sensibilidade do retorno de um ativo ao retorno do mercado; em utilities, historicamente baixo." | L3121 |
| 106 | "Prêmios sobrepostos" | "erro de somar componentes de risco que já se capturam mutuamente, elevando a taxa por conforto e não por método." | L3122 |
| 107 | "Taxa nominal" | "taxa que inclui a inflação esperada." | L3123 |
| 108 | "Taxa real" | "taxa líquida de inflação; converte-se pela relação multiplicativa, nunca por subtração." | L3124 |
| 109 | "Coerência de premissas" | "exigência de que fluxo e taxa compartilhem moeda, tratamento de inflação, tratamento de impostos e nível de alavancagem." | L3125 |
| 110 | "Taxa regulatória de remuneração do capital" | "parâmetro definido anualmente pelo regulador para remunerar o investimento reconhecido na tarifa; não é o custo de capital estimado pelo analista." | L3126 |
| 111 | "Base de remuneração regulatória" | "conjunto de ativos prudentes e em serviço reconhecidos pelo regulador para fins de remuneração." | L3127 |
| 112 | "Investimento prudente" | "aporte reconhecido pelo regulador como necessário e eficiente; investimento não reconhecido não entra na base." | L3128 |
| 113 | "Receita anual permitida" | "receita reconhecida à transmissora pela disponibilidade da instalação, ajustada por parcela variável." | L3129 |
| 114 | "Parcela variável" | "desconto aplicado à receita de transmissão por indisponibilidade ou restrição operativa." | L3130 |
| 115 | "Parcela B" | "componente da receita da distribuidora relativo a custos gerenciáveis e à remuneração do capital." | L3131 |
| 116 | "Revisão tarifária" | "recalibração periódica dos parâmetros econômicos da concessão, distinta do reajuste anual." | L3132 |
| 117 | "Reajuste anual" | "atualização dos componentes tarifários entre revisões, sem recalibração de parâmetros." | L3133 |
| 118 | "Fator de eficiência" | "redutor aplicado à receita para transferir ganhos de produtividade ao consumidor ao longo do ciclo." | L3134 |

### Família 6 · Financiamento de projeto e garantias

| # | Termo | Definição literal | Origem |
|---|---|---|---|
| 119 | "Financiamento de projeto" | "estrutura em que a capacidade de pagamento está principalmente no próprio ativo, com recurso limitado aos patrocinadores." | L3141 |
| 120 | "Financiamento corporativo" | "estrutura em que a dívida é assumida no balanço da companhia e paga por sua geração de caixa consolidada." | L3142 |
| 121 | "Sociedade de propósito específico" | "entidade criada para concentrar ativos, contratos, contas e dívida de um único projeto." | L3143 |
| 122 | "Patrocinador" | "acionista da sociedade de projeto, que aporta capital próprio e eventualmente presta garantias." | L3144 |
| 123 | "Recurso limitado" | "previsão de que o credor só pode acionar os patrocinadores em hipóteses e limites definidos em contrato." | L3145 |
| 124 | "Caixa disponível para o serviço da dívida" | "caixa do projeto após custos, impostos e investimento necessário, conforme definição contratual; base do cálculo de cobertura." | L3146 |
| 125 | "Índice de cobertura do serviço da dívida" | "razão entre o caixa disponível e o serviço da dívida no período." | L3147 |
| 126 | "Cobertura pela vida da dívida" | "valor presente do caixa disponível até o vencimento dividido pelo saldo devedor." | L3148 |
| 127 | "Cobertura pela vida do projeto" | "valor presente do caixa disponível até o fim do projeto dividido pelo saldo devedor; captura a cauda após a dívida." | L3149 |
| 128 | "Amortização esculpida" | "desenho do perfil de principal para manter uma cobertura-alvo, em vez de parcela constante." | L3150 |
| 129 | "Fontes e usos" | "quadro que iguala a origem dos recursos ao seu destino; o modelo só fecha quando os dois lados coincidem." | L3151 |
| 130 | "Juros durante a construção" | "despesa financeira do período pré-operacional, que precisa estar financiada porque o projeto ainda não gera caixa." | L3152 |
| 131 | "Contingência orçamentária" | "reserva para custo não previsto; se for o item que faz a conta fechar, não é contingência." | L3153 |
| 132 | "Ordem de uso do caixa" | "sequência contratual de destinação das receitas do projeto, do custo operacional à distribuição ao acionista." | L3154 |
| 133 | "Conta-reserva do serviço da dívida" | "depósito vinculado que cobre um número definido de parcelas futuras." | L3155 |
| 134 | "Reserva de manutenção" | "depósito vinculado destinado a grandes manutenções programadas." | L3156 |
| 135 | "Bloqueio de distribuição" | "restrição contratual à distribuição de dividendos quando a cobertura cai abaixo de um gatilho." | L3157 |
| 136 | "Amortização acelerada por excesso de caixa" | "uso obrigatório de caixa excedente para reduzir a dívida; protege o credor e reduz o retorno do capital próprio." | L3158 |
| 137 | "Contrato de construção integral" | "modalidade em que um único contratado assume prazo, custo e desempenho, com penalidades definidas." | L3159 |
| 138 | "Multa por atraso ou desempenho" | "valor devido pelo contratado ao descumprir prazo ou parâmetro de performance; verifique se o limite cobre o dano provável." | L3160 |
| 139 | "Garantia de conclusão" | "obrigação do patrocinador de sustentar o projeto até a entrada em operação comercial." | L3161 |
| 140 | "Direito de intervenção do credor" | "prerrogativa de assumir ou substituir operadores para preservar o valor do projeto antes do inadimplemento definitivo." | L3162 |
| 141 | "Debênture incentivada" | "título de dívida de projeto prioritário com tratamento tributário favorecido ao investidor, na forma da Lei nº 12.431/2011." | L3163 |
| 142 | "Debênture de infraestrutura" | "título com benefício tributário concentrado no emissor, instituído pela Lei nº 14.801/2024." | L3164 |
| 143 | "Título de dívida de projeto no exterior" | "emissão externa vinculada a um projeto, com pacote de garantias e obrigações de divulgação em padrão internacional." | L3165 |
| 144 | "Cessão fiduciária de recebíveis" | "transferência da titularidade de créditos futuros ao credor como garantia." | L3166 |

### Família 7 · Estrutura societária e controle

| # | Termo | Definição literal | Origem |
|---|---|---|---|
| 145 | "Capital total" | "soma de todas as ações emitidas, independentemente de classe." | L3173 |
| 146 | "Capital votante" | "parcela do capital composta por ações com direito a voto; é a grandeza que define controle." | L3174 |
| 147 | "Participação econômica" | "fatia do resultado e do patrimônio que pertence a um sócio; frequentemente diferente de sua fatia de voto." | L3175 |
| 148 | "Ação ordinária" | "ação com direito a voto em assembleia." | L3176 |
| 149 | "Ação preferencial" | "ação com prioridade em dividendo ou reembolso, tipicamente com voto restrito ou ausente." | L3177 |
| 150 | "Acordo de acionistas" | "contrato entre sócios que vincula voto e transferência de ações; cria bloco de controle que não aparece na tabela de participação." | L3178 |
| 151 | "Limitação estatutária de voto" | "cláusula que fixa teto ao poder de voto de qualquer acionista, independentemente de sua participação." | L3179 |
| 152 | "Controlador" | "quem detém, de forma permanente, a maioria dos votos e o poder de eleger a maioria dos administradores." | L3180 |
| 153 | "Bloco de controle" | "conjunto de sócios que, por acordo, exerce controle conjunto sem que nenhum o detenha isoladamente." | L3181 |
| 154 | "Capital pulverizado" | "estrutura sem acionista ou bloco controlador, em que o poder efetivo migra para a administração e o conselho." | L3182 |
| 155 | "Capital em circulação" | "parcela das ações efetivamente disponível para negociação, excluída a posição dos controladores." | L3183 |
| 156 | "Oferta pública de aquisição" | "oferta dirigida aos acionistas para compra de ações, tipicamente com finalidade de fechamento de capital ou de mudança de segmento." | L3184 |
| 157 | "Resgate compulsório" | "operação societária que retira de circulação as ações remanescentes após oferta, mediante pagamento aprovado em assembleia." | L3185 |
| 158 | "Fechamento de capital" | "processo pelo qual a companhia deixa de ter ações negociadas em bolsa; pode preservar registro de emissor para dívida." | L3186 |
| 159 | "Categoria de registro de emissor" | "classificação que define o escopo de informação periódica exigida; registro voltado a dívida exige menos que registro voltado a ações." | L3187 |
| 160 | "Incorporação de ações" | "operação em que a totalidade das ações de uma companhia é transferida a outra, que passa a detê-la integralmente." | L3188 |
| 161 | "Combinação de negócios" | "operação que reúne empresas sob controle comum de um adquirente, com efeitos contábeis próprios." | L3189 |
| 162 | "Erro de perímetro" | "comparação entre períodos anteriores e posteriores a uma combinação sem ajustar escopo, ações e dívida assumida." | L3190 |
| 163 | "Transação com parte relacionada" | "negócio entre a companhia e seu controlador, administradores ou entidades ligadas; exige preço de referência demonstrado." | L3191 |
| 164 | "Direito de preferência" | "prerrogativa contratual de igualar oferta de terceiro e adquirir participação em condições equivalentes." | L3192 |

### Família 8 · Documentos, processos e risco setorial

| # | Termo | Definição literal | Origem |
|---|---|---|---|
| 165 | "Formulário de Referência" | "documento periódico obrigatório que descreve emissor, atividades, riscos, capital, governança, contratos e transações." | L3199 |
| 166 | "Fato relevante" | "comunicação obrigatória de evento capaz de influenciar a decisão de investir; é a fonte primária de evento societário." | L3200 |
| 167 | "Release de resultados" | "comunicação voluntária da administração sobre o desempenho do período, em formato livre e com incentivos declarados." | L3201 |
| 168 | "Projeção divulgada" | "estimativa condicionada apresentada pela administração; não é compromisso e pode ser revista." | L3202 |
| 169 | "Pesquisa sell-side" | "análise produzida por instituição que também presta serviços de banco de investimento às companhias cobertas; citável com casa e data, nunca como origem de número." | L3203 |
| 170 | "Conflito de interesse estrutural" | "situação em que a mesma instituição assessora e analisa a mesma companhia; é característica do modelo, não acusação." | L3204 |
| 171 | "Coordenador de oferta" | "instituição que estrutura e distribui uma emissão de ações ou de dívida." | L3205 |
| 172 | "Fonte primária" | "documento produzido pela própria entidade responsável, sob obrigação legal de exatidão." | L3206 |
| 173 | "Data de verificação" | "data em que o dado foi conferido na fonte; sem ela, nenhum status societário é auditável." | L3207 |
| 174 | "Risco hidrológico" | "exposição do resultado à variação da afluência e ao mecanismo de repartição entre geradores." | L3208 |
| 175 | "Risco regulatório" | "exposição a mudança de parâmetro, de encargo, de metodologia tarifária ou de condição de outorga." | L3209 |
| 176 | "Risco cambial" | "exposição do custo de equipamento, de dívida ou de insumo à variação da moeda estrangeira." | L3210 |
| 177 | "Risco de descasamento de indexador" | "exposição decorrente de receita e dívida atreladas a índices diferentes." | L3211 |
| 178 | "Risco operacional" | "exposição a indisponibilidade, acidente, perda de energia e falha de equipamento." | L3212 |
| 179 | "Risco socioambiental e de governança" | "exposição a licenciamento, conflito com comunidades, condicionantes e falha de controle interno." | L3213 |
| 180 | "Risco de crédito e de estrutura de capital" | "exposição à incapacidade de honrar obrigações no vencimento por desenho de dívida incompatível com a geração de caixa." | L3214 |

## Divergências registradas neste grupo (5)

| Id | Eixo | Sev. | Leitura A | Leitura B |
|---|---|---|---|---|
| div-m13-ex-vs-inst05-trechos | fonte × fonte | baixa | Ex 08, 09 e 10 citam trechos hipotéticos (ver exercicios.variacoes_vs_INST05). | INST·05 g1, g2 e g3 tratam das mesmas categorias com redação diferente (g1 acrescenta ", conforme detalhado nas notas explicativas."; g2 diz "tributária e cível"; g3 é outra frase). |
| div-m13-quiz-q01-rotulos | fonte × fonte | baixa | §00.1 (tabela L658-662): quatro rótulos de EBITDA — ≈ R$ 6,78 bi, ≈ R$ 7,45 bi, ≈ R$ 8,54 bi, ≈ R$ 8,6 bi. | Quiz Q01: três valores ("resultado operacional reportado de R$ 6,8 bi, ajustado de R$ 8,5 bi e regulatório ajustado de R$ 8,6 bi"), chamando EBITDA de "resultado operacional" — termo que o §Lex não usa para EBITDA (o §Lex distingue EBITDA, EBIT e "Lucro operacional após impostos"). |
| div-m13-ex14-arquetipo | fonte × fonte | baixa | Ex 14 (resposta): "O arquétipo é joint venture coordenada". | INST·06 (caso h1, o mesmo cenário 45%+30% com acordo): arquétipo "Associação com dois controladores coordenados". |
| div-m13-exercicios-codigo | fonte × código | media | Fonte: cada exercício tem "Pergunta." e "Resposta."/"Resposta de referência." em parágrafos separados, com <b>/<em>. | Código: `prompt: ""` nos 14; pergunta e resposta fundidas em `config.gabarito` (com o rótulo "Pergunta." dentro do gabarito); `points: 1` sem origem; espaços antes de pontuação onde havia <b>/<em>; MODULO_13_EXERCICIOS_SOLTOS não está registrado em RecursosDoModulo.tsx (não aparece na interface). |
| div-m13-marca-quiz | fonte × P24 | baixa | Quiz Q10 (explicação): "não é entregue em nenhum ativo da GridAlpha". | P24: marca morta voltada ao learner. Mantido literal. |

## Contagens

| Item | Contagem |
|---|---|
| caso_blocos | 13 |
| caso_perguntas_literais | 8 |
| quiz_questoes | 10 |
| quiz_alternativas | 40 |
| quiz_faixas | 2 |
| checklist_itens | 28 |
| checklist_cronometrados | 1 |
| checklist_orais | 3 |
| exercicios | 14 |
| exercicios_com_aula | 0 |
| exercicios_soltos | 14 |
| referencias | 36 |
| referencias_com_url | 0 |
| glossario_familias | 8 |
| glossario_termos | 180 |
| glossario_ausentes_no_codigo | 180 |


## Verificação

Verificação adversarial de 2026-09-17, feita com scripts próprios contra o HTML-fonte.

- **Quiz, 100%.** O `var Q` foi avaliado em vm próprio e comparado com o JSON, sem nenhuma diferença. Batem:
  - as 10 questões, as 40 alternativas e as 10 explicações;
  - o gabarito (D B A B C B A D C B) e as origens (±3).

  As duas mensagens de faixa são substrings exatas do script.
- **Checklist, 100%.** Os 28 `li` de `section#final` foram comparados com `html` (espaços normalizados), com
  `texto` (sem tags) e com a origem (±3), sem nenhuma diferença.
- **Contagens.** Batem:
  - 13 blocos e 8 perguntas no caso;
  - 14 exercícios em 5 grupos, nenhum com tag de aula;
  - 36 referências (15/12/4/5), 180 termos em 8 famílias e 28 itens de checklist.
- Nenhuma correção neste grupo.
