# M14 · grupo "aparato"

Fonte (só leitura): `C:/dev/GridAlpha v2/Alexandria modulos/alexandria_modulo14.html` (4.352 linhas, LF). Saída: [`aparato.json`](aparato.json). Extrator: [`extratores/m14_aparato.mjs`](extratores/m14_aparato.mjs); este arquivo é gerado por [`extratores/m14_md.mjs`](extratores/m14_md.mjs).
Camada **fonte**: todo texto entre aspas ou em tabela saiu do JSON, e o JSON saiu do HTML por programa; nada foi
digitado nem parafraseado (as tags inline foram removidas na versão .md; o `html` fica no JSON). `L` é a linha
aproximada no HTML-fonte. As divergências ficam com todas as leituras, e nenhuma é resolvida aqui (P17–P24 valem só
na camada de produto).

**Cobertura por token:** caso 100% (1.150/1.150), quiz_markup 100% (77/77), quiz_script 96,4% (1.393/1.445), final 100% (709/709), ex 100% (1.812/1.812), ref 100% (1.328/1.328), lex 100% (2.993/2.993). O resíduo do script do quiz são nomes de variável e índices (`var`, `q`, `q`, `f`, `q`, `0`…), não texto.

## Caso — "Operação A — Parte 14" (§Caso, L2514)

- **Título (h2):** "A linha de custo que nenhuma das treze partes anteriores tocou".
- **Parte:** "Parte 14". A fonte numera o caso literalmente como "Operação A — Parte 14" e se refere a "treze partes anteriores" (Partes 11, 12 e 13 citadas). É uma série transversal aos módulos, não uma divisão interna deste caso: dentro do M14 não há Parte 1/2. Pelo P17, "Parte" não vira estrutura de interface; o texto fica literal aqui.
- **Lede:** "As treze partes anteriores construíram o perfil da Operação A — mineração em Minas Gerais: submercado Sudeste/Centro-Oeste, fator de carga elevado, enquadramento tarifário provavelmente adequado, bombeamento como carga flexível, a avaliação de uma proposta solar na Parte 11, as perguntas geopolíticas diante de capital estrangeiro na Parte 12, e a avaliação de uma geradora como contraparte de risco de crédito antes de assinar contrato de longo prazo na Parte 13. Todas elas trataram de eletricidade. Esta parte abre uma linha que nenhuma delas tocou, e é essa a razão de ela existir." (L2519)
- **Subseções:** §Caso.1 "O diagnóstico da linha de diesel" (L2533); §Caso.2 "Biometano para frota: o que decidiria, e o que não decidiria" (L2562); §Caso.3 "A outra ponta: contratar energia de uma cogeração a bagaço" (L2590).
- **Dados:** `null`. O caso não tem grade de dados. Os fatos da Operação A aparecem só em prosa, no lead ("mineração em Minas Gerais", "submercado Sudeste/Centro-Oeste", "fator de carga elevado", "bombeamento como carga flexível") e no §Caso.1 ("15% de cada litro de diesel B comprado é B100"). Nenhum volume, preço ou consumo da operação é dado — e a própria fonte diz que sem doze meses de dados nenhum número de economia é defensável.
- **Decisão pedida:** `null`. A fonte não pede decisão: o callout final declara "Tudo acima é diagnóstico, não recomendação" e que o ativo "não emite esse tipo de conclusão em nenhuma hipótese". Um Desafio de decisão (P17) seria da camada Alexandria.
- **Menções em prosa:** aulas Aula 01, Aula 06, Aula 05; módulos Módulo 10, Módulo 09. Vínculos por menção em prosa, não declarados como posse.
- **No código:** Não extraído: nenhum arquivo de src/lib/data traz o caso do M14.

**Perguntas literais (5, §Caso.1).** As cinco perguntas do §Caso.1 são literais, mas a fonte as apresenta como perguntas "que a operação deveria conseguir responder sobre a própria linha de combustível", não como perguntas feitas ao learner, e não traz resposta de referência para elas. O §Caso.3 faz uma pergunta e responde em seguida (ver pergunta_respondida).

1. "Qual é o volume anual de diesel B consumido, por categoria de uso?" — desdobramento: "Frota de transporte de minério, equipamento de lavra, geradores de emergência e veículos leves têm perfis de consumo, de sensibilidade a preço e de alternativa técnica completamente diferentes. Uma linha única de "combustível" no orçamento esconde três decisões distintas." (L2539)
2. "Que fração desse volume é biodiesel, e por decisão de quem?" — desdobramento: "Hoje, 15% de cada litro de diesel B comprado é B100, por força de resolução do conselho — não por escolha da operação. Se o teor for elevado, o custo, a especificação e o requisito de manuseio mudam sem que a operação tenha participado da decisão. Essa é uma exposição regulatória que a operação carrega e provavelmente não monitora." (L2543)
3. "Como o combustível é armazenado, e por quanto tempo?" — desdobramento: "Esta é a pergunta que separa uma operação que já teve problema de uma que ainda vai ter. Biodiesel tem estabilidade à oxidação finita, absorve água com mais facilidade que o diesel fóssil e favorece crescimento microbiano em tanque. Um tanque de operação remota com giro lento é um ambiente diferente de uma base de distribuição, e o teor obrigatório crescente torna a gestão de qualidade em tanque uma variável operacional, não administrativa." (L2548)
4. "Qual o custo entregue por unidade de energia útil, e não por litro?" — desdobramento: "A mesma disciplina do custo por quilômetro da Aula 01, aplicada a equipamento pesado: preço na bomba mais frete até o sítio, mais perdas, mais custo de armazenagem, dividido pela energia efetivamente utilizável. Comparações entre combustíveis feitas por litro não significam nada." (L2554)
5. "Existe rota alternativa fisicamente disponível no raio da operação?" — desdobramento: "E aqui a pergunta é de logística, não de preço." (L2558)

**Pergunta respondida pela própria fonte (§Caso.3, L2592):** "Separadamente, e de forma mais breve: se a Operação A avaliasse contratar energia elétrica de uma cogeração a bagaço, o que a sazonalidade dessa entrega mudaria na estrutura do contrato?"

> "A resposta liga diretamente ao Módulo 09 e à Aula 05. Uma contraparte que gera em metade do ano não entrega o mesmo produto que uma contraparte que gera o ano inteiro, ainda que o montante anual contratado seja idêntico. As três consequências contratuais são diretas. Primeira: a sazonalização do montante precisa estar declarada e casada com o perfil de carga da operação — uma mineradora com fator de carga elevado e demanda estável tem perfil plano, e uma geradora sazonal tem entrega concentrada; a diferença entre os dois perfis é o que alguém precisa cobrir. Segunda: o mecanismo de cobertura da entressafra precisa estar no contrato, seja por compra de terceiro, por flexibilidade declarada ou por desconto de preço — e não existe contrato sem essa cláusula que seja neutro; a ausência dela apenas transfere o risco em silêncio. Terceira: a coincidência entre a janela de moagem e o período de bandeira mais cara, verificável nos dados de 2025, significa que a entrega dessa contraparte se concentra exatamente quando a energia de reposição é mais cara — o que é uma vantagem para quem compra e um argumento de preço para quem vende. Os dois lados sabem disso."

**Diagnóstico do biometano (§Caso.2, três colunas, L2569):**

- **O que precisa ser verdade**
  - Existe substrato no raio econômico: "Resíduo agroindustrial, dejeto ou aterro a distância que o frete não inviabilize. Sem isso, a conversa acaba antes de começar." (L2572)
  - A frota é adaptável: "Motor, autonomia, estação de abastecimento e perfil de rota compatíveis. Equipamento de lavra e caminhão de estrada respondem de forma diferente." (L2573)
  - Há contrato de prazo compatível: "Rota de biometano dedicada exige compromisso de prazo longo dos dois lados; o investimento não se paga em contrato anual." (L2574)
- **O que pode falhar**
  - Escala mínima não atingida: "Volume abaixo do ponto em que compressão, medição e logística se diluem. É a falha mais comum e a menos discutida." (L2578)
  - Continuidade do substrato: "Resíduo de usina tem sazonalidade; resíduo de aterro tem curva de decaimento. Nenhum dos dois é uma linha reta." (L2579)
  - Disponibilidade e redundância: "Uma operação que para por falta de combustível perde muito mais que a diferença de preço entre rotas." (L2580)
- **O que ainda não se sabe**
  - Volume real por categoria de uso: "Sem a abertura da linha de combustível, nenhuma das contas acima tem entrada." (L2584)
  - Titularidade do atributo ambiental: "Se a operação quiser declarar redução de emissões, precisa saber se o atributo vem junto com a molécula ou foi vendido separadamente." (L2585)
  - Estado da regulamentação na data da decisão: "O programa de biometano foi operacionalizado em 2026 e continua em fase inicial. O estado dele na data da decisão não é o de hoje." (L2586)

**"Linguagem obrigatória — Travas do War Room"** (`box rd`, L2609):

> "Tudo acima é diagnóstico, não recomendação. Não há aqui nenhuma conclusão sobre qual combustível a Operação A deve usar, nem sobre se ela deve contratar energia de cogeração, nem sobre investir em qualquer ativo de bioenergia — e este ativo não emite esse tipo de conclusão em nenhuma hipótese. Qualquer ganho identificável nas cinco perguntas da §Caso.1 é oportunidade potencial de economia a ser validada com dados completos, e nada além disso. Sem doze meses de dados de consumo por categoria de uso, sem preço entregue verificado e sem o estado regulatório confirmado na data da decisão, nenhum número de economia é defensável. Caso sempre anonimizado: Operação A — mineração em Minas Gerais, sem nome, sem município exato e sem valor de operação."

<details><summary>Os 14 blocos do §Caso, na ordem da fonte</summary>

**Marcador:** "§Caso · Operação A — Parte 14" (L2516)

**h2:** "A linha de custo que nenhuma das treze partes anteriores tocou" (L2517)

**Lede:** "As treze partes anteriores construíram o perfil da Operação A — mineração em Minas Gerais: submercado Sudeste/Centro-Oeste, fator de carga elevado, enquadramento tarifário provavelmente adequado, bombeamento como carga flexível, a avaliação de uma proposta solar na Parte 11, as perguntas geopolíticas diante de capital estrangeiro na Parte 12, e a avaliação de uma geradora como contraparte de risco de crédito antes de assinar contrato de longo prazo na Parte 13. Todas elas trataram de eletricidade. Esta parte abre uma linha que nenhuma delas tocou, e é essa a razão de ela existir." (L2519)

"Numa operação de mineração, a maior linha de custo energético frequentemente não é a eletricidade — é o diesel da frota de transporte. O Módulo 10 dissecou a fatura de energia elétrica com rigor: demanda contratada, ultrapassagem, reativo, bandeira, tributo, encargo. A fatura de combustível nunca foi lida. A Parte 14 pergunta o que muda quando a Operação A olha essa linha com a mesma disciplina." (L2527)

**h3:** "§Caso.1 O diagnóstico da linha de diesel" (L2533)

"Cinco perguntas que a operação deveria conseguir responder sobre a própria linha de combustível, e que ela quase certamente ainda não formulou nesses termos." (L2535)

**Lista (ordenada, 5 itens)** (L2538):
1. "Qual é o volume anual de diesel B consumido, por categoria de uso? Frota de transporte de minério, equipamento de lavra, geradores de emergência e veículos leves têm perfis de consumo, de sensibilidade a preço e de alternativa técnica completamente diferentes. Uma linha única de "combustível" no orçamento esconde três decisões distintas."
2. "Que fração desse volume é biodiesel, e por decisão de quem? Hoje, 15% de cada litro de diesel B comprado é B100, por força de resolução do conselho — não por escolha da operação. Se o teor for elevado, o custo, a especificação e o requisito de manuseio mudam sem que a operação tenha participado da decisão. Essa é uma exposição regulatória que a operação carrega e provavelmente não monitora."
3. "Como o combustível é armazenado, e por quanto tempo? Esta é a pergunta que separa uma operação que já teve problema de uma que ainda vai ter. Biodiesel tem estabilidade à oxidação finita, absorve água com mais facilidade que o diesel fóssil e favorece crescimento microbiano em tanque. Um tanque de operação remota com giro lento é um ambiente diferente de uma base de distribuição, e o teor obrigatório crescente torna a gestão de qualidade em tanque uma variável operacional, não administrativa."
4. "Qual o custo entregue por unidade de energia útil, e não por litro? A mesma disciplina do custo por quilômetro da Aula 01, aplicada a equipamento pesado: preço na bomba mais frete até o sítio, mais perdas, mais custo de armazenagem, dividido pela energia efetivamente utilizável. Comparações entre combustíveis feitas por litro não significam nada."
5. "Existe rota alternativa fisicamente disponível no raio da operação? E aqui a pergunta é de logística, não de preço."

**h3:** "§Caso.2 Biometano para frota: o que decidiria, e o que não decidiria" (L2562)

"Biometano é a rota alternativa mais discutida para frota pesada em operação remota, e a Aula 06 já disse por que a avaliação dela não começa pelo preço por metro cúbico normal. Para a Operação A, o diagnóstico teria esta forma — e note que nenhuma das perguntas é sobre qual combustível é melhor:" (L2564)

**Três colunas** (L2569):
- **O que precisa ser verdade**
  - Existe substrato no raio econômico: "Resíduo agroindustrial, dejeto ou aterro a distância que o frete não inviabilize. Sem isso, a conversa acaba antes de começar." (L2572)
  - A frota é adaptável: "Motor, autonomia, estação de abastecimento e perfil de rota compatíveis. Equipamento de lavra e caminhão de estrada respondem de forma diferente." (L2573)
  - Há contrato de prazo compatível: "Rota de biometano dedicada exige compromisso de prazo longo dos dois lados; o investimento não se paga em contrato anual." (L2574)
- **O que pode falhar**
  - Escala mínima não atingida: "Volume abaixo do ponto em que compressão, medição e logística se diluem. É a falha mais comum e a menos discutida." (L2578)
  - Continuidade do substrato: "Resíduo de usina tem sazonalidade; resíduo de aterro tem curva de decaimento. Nenhum dos dois é uma linha reta." (L2579)
  - Disponibilidade e redundância: "Uma operação que para por falta de combustível perde muito mais que a diferença de preço entre rotas." (L2580)
- **O que ainda não se sabe**
  - Volume real por categoria de uso: "Sem a abertura da linha de combustível, nenhuma das contas acima tem entrada." (L2584)
  - Titularidade do atributo ambiental: "Se a operação quiser declarar redução de emissões, precisa saber se o atributo vem junto com a molécula ou foi vendido separadamente." (L2585)
  - Estado da regulamentação na data da decisão: "O programa de biometano foi operacionalizado em 2026 e continua em fase inicial. O estado dele na data da decisão não é o de hoje." (L2586)

**h3:** "§Caso.3 A outra ponta: contratar energia de uma cogeração a bagaço" (L2590)

"Separadamente, e de forma mais breve: se a Operação A avaliasse contratar energia elétrica de uma cogeração a bagaço, o que a sazonalidade dessa entrega mudaria na estrutura do contrato?" (L2592)

"A resposta liga diretamente ao Módulo 09 e à Aula 05. Uma contraparte que gera em metade do ano não entrega o mesmo produto que uma contraparte que gera o ano inteiro, ainda que o montante anual contratado seja idêntico. As três consequências contratuais são diretas. Primeira: a sazonalização do montante precisa estar declarada e casada com o perfil de carga da operação — uma mineradora com fator de carga elevado e demanda estável tem perfil plano, e uma geradora sazonal tem entrega concentrada; a diferença entre os dois perfis é o que alguém precisa cobrir. Segunda: o mecanismo de cobertura da entressafra precisa estar no contrato, seja por compra de terceiro, por flexibilidade declarada ou por desconto de preço — e não existe contrato sem essa cláusula que seja neutro; a ausência dela apenas transfere o risco em silêncio. Terceira: a coincidência entre a janela de moagem e o período de bandeira mais cara, verificável nos dados de 2025, significa que a entrega dessa contraparte se concentra exatamente quando a energia de reposição é mais cara — o que é uma vantagem para quem compra e um argumento de preço para quem vende. Os dois lados sabem disso." (L2595)

**Callout `box rd` — "Linguagem obrigatória — Travas do War Room"** (L2609):
> "Tudo acima é diagnóstico, não recomendação. Não há aqui nenhuma conclusão sobre qual combustível a Operação A deve usar, nem sobre se ela deve contratar energia de cogeração, nem sobre investir em qualquer ativo de bioenergia — e este ativo não emite esse tipo de conclusão em nenhuma hipótese. Qualquer ganho identificável nas cinco perguntas da §Caso.1 é oportunidade potencial de economia a ser validada com dados completos, e nada além disso. Sem doze meses de dados de consumo por categoria de uso, sem preço entregue verificado e sem o estado regulatório confirmado na data da decisão, nenhum número de economia é defensável. Caso sempre anonimizado: Operação A — mineração em Minas Gerais, sem nome, sem município exato e sem valor de operação."

</details>

## Quiz — "§Quiz · Verificação"

- **Título:** "Dez questões, critério de oito acertos".
- **Introdução (L2833):** "O critério é oito de dez. Abaixo disso, a matéria ainda não sustenta uma conversa com interlocutor de agro, de combustíveis ou de clima — não por falta de informação, mas porque o erro em qualquer uma destas questões é de base temporal, de rota, de grandeza ou de estado de política, e esses são exatamente os quatro que alguém que vive o setor identifica na primeira frase."
- **Critério em prosa:** "O critério é oito de dez."
- **Estrutura:** 10 questões × 4 alternativas, lidas do literal `var Q=[…]` (script L4234–L4304). Gabarito na ordem: **C A D B D A C B D C**.
- **Interface da fonte:** botões "Corrigir" (L2841) e "Refazer" (L2842); rótulo `'Questão '+(i+1)+' de '+Q.length`; placar `acertos+' / '+Q.length`. `perguntas[].rotulo_fonte` é o texto já renderizado pelo template, não um literal do arquivo.
- **Mecânica** (descrição desta extração a partir do código): as 10 questões são renderizadas juntas (build), com rádio por alternativa; o botão "Corrigir" corrige todas de uma vez: marca a correta (classe right) e a escolhida errada (classe wrong), mostra o feedback `f` de todas e o placar; questão sem resposta conta como erro e também recebe o feedback; o botão "Refazer" reconstrói o quiz e limpa o placar; não há persistência.
- **No código:** Não extraído: nenhum arquivo de src/lib/data traz o quiz do M14.

### Faixas do placar (script, L4337)

`condicao`, `minimo` e `maximo` são derivados do ternário; só as mensagens são verbatim. A mensagem de reprovação usa innerHTML e contém `<b>`.

| Condição (derivada) | Classe | Mensagem literal |
|---|---|---|
| `acertos >= 8` | `pass` | "Critério atingido. A matéria sustenta uma conversa de uma hora com um produtor, um trader de combustíveis ou um analista de originação — inclusive a parte mais difícil: recusar a pergunta sobre qual biocombustível é o melhor investimento, devolvendo rota, insumo, distância, estado de política e produto concorrente." |
| `acertos < 8` | `fail` | "Abaixo do critério de oito acertos. Antes de refazer, verifique o padrão do erro: quase todas estas questões testam base temporal — safra contra ano-calendário, teor vigente contra teor vencido —, rota não declarada — cana contra milho, fibra contra grão —, grandeza confundida — potência contra energia, venda contra produção, margem unitária contra viabilidade — ou estado de política — teto legal, vigente, anunciado, prazo vencido não implementado. São esses quatro que derrubam a credibilidade de tudo que veio antes." |

P18: o limiar é registro legado; não declara domínio, não libera trilha e não vira "Aprovado". A mensagem de acerto afirma competência ("A matéria sustenta uma conversa de uma hora…"), ver `div-m14-quiz-placar`.

### Questões

**Questão 1 de 10** (L4235). "Em 2 de agosto de 2026, qual é o teor de etanol anidro na gasolina C comum, e sob que regime?"

- A) "30%, fixado pela Resolução CNPE nº 9/2025, em vigor por prazo indeterminado."
- B) "35%, teto legal da Lei nº 14.993/2024, já implementado após a conclusão dos testes de durabilidade."
- C) "32%, fixado pela Resolução CNPE nº 9/2026 com vigência a partir de 1º de agosto de 2026, em caráter excepcional e temporário por 180 dias, prorrogável uma vez." **← gabarito**
- D) "27%, teor histórico mantido desde 2015 para a gasolina comum."

Explicação (mesmo texto para acerto e erro): "São dois erros distintos numa só pergunta. O primeiro é de base temporal: 30% foi o teor vigente até 31 de julho de 2026, e há duas resoluções de número 9, uma de 2025 e outra de 2026. O segundo é de estado de política: 35% é teto legal autorizado, não percentual em vigor. A resposta correta traz norma, data e o regime — porque a medida é temporária, e um material escrito hoje pode estar errado em cento e oitenta dias."

**Questão 2 de 10** (L4242). "Uma apresentação afirma: “o Brasil produz 40,7 bilhões de litros de etanol por ano”. Qual é o problema?"

- A) "O número mistura bases: 40,69 bilhões é a estimativa de safra 2026/27; a produção apurada de ano-calendário 2025 foi de 35,94 bilhões de litros." **← gabarito**
- B) "O número está simplesmente errado; nenhuma fonte oficial registra esse volume."
- C) "O número está desatualizado e a produção correta é superior a 45 bilhões de litros."
- D) "Não há problema: safra e ano-calendário são equivalentes no setor sucroenergético."

Explicação (mesmo texto para acerto e erro): "Os dois números estão certos e medem coisas diferentes. A safra do Centro-Sul atravessa o virar do ano-calendário, e por isso todo volume de etanol precisa declarar a base. Quase cinco bilhões de litros separam as duas respostas — e nenhuma delas é falsa."

**Questão 3 de 10** (L4249). "Sobre o percentual de biodiesel no diesel B, em 2 de agosto de 2026:"

- A) "Está em B16 desde março de 2026, conforme calendário da Lei nº 14.993/2024."
- B) "Está em B20, antecipado por decisão do conselho em julho de 2026."
- C) "Está em B25, teto legal já implementado."
- D) "Está em B15, em vigor desde 1º de agosto de 2025; o B16 tinha prazo legal em março de 2026 e não foi implementado." **← gabarito**

Explicação (mesmo texto para acerto e erro): "É o quarto estado de política, e o menos citado: prazo legal vencido e não implementado. A lei calendarizou o B16 para março de 2026, a data passou, e o conselho não deliberou o aumento. Quem lê só a lei conclui que o B16 está em vigor; quem lê só a resolução não sabe que havia um prazo. A verificação exige as duas."

**Questão 4 de 10** (L4256). "Uma unidade de cogeração tem 80 MW instalados e opera 210 dias de safra. Um analista projeta 700 GWh anuais. Qual é a correção?"

- A) "A projeção está correta, porque a potência instalada define a geração anual."
- B) "A projeção multiplicou a potência por 8.760 horas; com 210 dias, disponibilidade real e autoconsumo de vapor de processo, o gerado fica próximo de 350 GWh e o exportado, de cerca de 160 GWh." **← gabarito**
- C) "A projeção está errada apenas na disponibilidade; o autoconsumo não afeta a geração."
- D) "A projeção subestima: uma planta de 80 MW gera mais de 700 GWh por ano."

Explicação (mesmo texto para acerto e erro): "Três grandezas distintas — potência instalada, energia gerada e energia exportada — para a mesma planta. A confusão entre elas é o erro que a Lente de Sazonalidade existe para impedir, e é ele que faz alguém somar potência instalada de cogeração à matriz elétrica como se ela operasse o ano inteiro."

**Questão 5 de 10** (L4263). "“A usina de etanol é autossuficiente em energia porque queima o próprio bagaço.” Qual é o defeito?"

- A) "Nenhum: vale para toda usina de etanol brasileira."
- B) "O defeito é factual: bagaço não tem poder calorífico suficiente para sustentar o processo."
- C) "O defeito é apenas de precisão numérica sobre o percentual de autossuficiência."
- D) "O defeito é de rota não declarada: vale para a rota de cana, e não para a de milho, que depende de fonte térmica externa contratada, com custo e exposição a preço próprios." **← gabarito**

Explicação (mesmo texto para acerto e erro): "É a assimetria estrutural entre as duas rotas de etanol. Em cana o combustível vem do próprio insumo; em milho, a energia térmica é comprada. Isso muda o custo por litro, muda a intensidade de carbono, e muda o que a planta contribui — ou não contribui — para a matriz elétrica."

**Questão 6 de 10** (L4270). "Um projeto afirma que a segunda geração “aproveita resíduo que hoje é descartado”. Qual é a leitura correta?"

- A) "O bagaço não é descartado: é o combustível que gera vapor de processo e bioeletricidade, de modo que cada tonelada hidrolisada é energia que deixa de existir." **← gabarito**
- B) "A afirmação está correta: o bagaço excedente não tem uso econômico atual."
- C) "A afirmação está correta apenas para a palha, e incorreta para o bagaço."
- D) "A afirmação é irrelevante, porque a segunda geração não usa bagaço."

Explicação (mesmo texto para acerto e erro): "É o concorrente omitido mais frequente do bloco. A fibra tem destino consolidado dentro da própria unidade — três destinos, na verdade: vapor, eletricidade exportada e venda de biomassa. A segunda geração não elimina custo de disposição; ela disputa um insumo com uso econômico atual."

**Questão 7 de 10** (L4277). "Sobre as metas do programa de descarbonização em 2026:"

- A) "A meta nacional e a soma das metas individuais são sempre idênticas por construção da norma."
- B) "A meta nacional de 48,09 milhões foi revogada e substituída pelas metas individuais."
- C) "A meta nacional é de 48,09 milhões de créditos, e a soma das metas individuais definitivas publicadas em março de 2026 é de 49,01 milhões — cerca de 1,9% acima." **← gabarito**
- D) "A soma das metas individuais é sempre inferior à nacional, por conta das dispensas concedidas."

Explicação (mesmo texto para acerto e erro): "É a diferença que explica por que o ciclo anterior apareceu simultaneamente como 99% e 88% de cumprimento: a mesma aposentadoria de créditos, medida contra a meta nacional ou contra a soma das individuais ajustadas, produz duas taxas distintas. Quem cita só uma delas não está errado — está incompleto, e a distinção decide se houve ou não descumprimento sujeito a penalidade."

**Questão 8 de 10** (L4284). "Um projeto de biometano apresenta margem de R$ 1,20 por metro cúbico e conclui pela viabilidade. O que falta?"

- A) "Nada: margem unitária positiva é condição suficiente de viabilidade."
- B) "Faltam escala e continuidade do substrato: compressão, medição e infraestrutura de entrega têm componente fixo que a margem unitária não dilui, e resíduo de usina tem sazonalidade enquanto resíduo de aterro tem curva de decaimento." **← gabarito**
- C) "Falta apenas o preço de venda do gás, que não foi informado."
- D) "Falta incluir a receita de crédito de descarbonização no caso base, o que tornaria o projeto viável."

Explicação (mesmo texto para acerto e erro): "Margem por metro cúbico e viabilidade de projeto são grandezas diferentes. A alternativa que sugere colocar o crédito no caso base contém o segundo erro do bloco: atributo ambiental é ganho adicional e entra como sensibilidade declarada, nunca como salvamento de projeto."

**Questão 9 de 10** (L4291). "Uma unidade sem certificação no programa de descarbonização comercializa biocombustível e evita emissões fisicamente reais. Quantos créditos ela pode emitir?"

- A) "Proporcionalmente ao volume, com deságio por ausência de certificação."
- B) "Todos os créditos correspondentes, com emissão retroativa após a certificação."
- C) "Metade dos créditos, conforme regra de transição."
- D) "Nenhum: o crédito nasce da certificação da unidade produtora e da comercialização com nota fiscal, não do fato físico da emissão evitada." **← gabarito**

Explicação (mesmo texto para acerto e erro): "É a distinção entre o fato físico e o ativo regulatório. As emissões evitadas existem; o crédito, não. Projeções que somam receita de crédito antes da certificação emitida estão somando um número sem lastro — e essa é a linha que mais frequentemente aparece inflada em plano de negócios de projeto de bioenergia."

**Questão 10 de 10** (L4298). "Um interlocutor pergunta: “então qual biocombustível é o melhor investimento agora?”. Qual é a resposta correta?"

- A) "Etanol de milho, pela expansão acelerada e pela operação contínua ao longo do ano."
- B) "Biometano, pelo marco regulatório recém-consolidado e pelo duplo instrumento de certificação."
- C) "Devolver a estrutura: qual rota, com que insumo contratado, a que distância do cliente, sob qual estado de política e contra qual produto concorrente — e a pergunta de volta sobre horizonte e tolerância a risco." **← gabarito**
- D) "Biodiesel, pelo teor obrigatório de mistura garantido em lei até 2030."

Explicação (mesmo texto para acerto e erro): "As três alternativas específicas são verdadeiras e insuficientes — exatamente o padrão que o INST·10 treina. Nenhuma rota é melhor em abstrato: a resposta depende de logística, escala e política locais. Nenhum ativo da GridAlpha entrega recomendação de investimento nem de troca de combustível, em nenhuma hipótese; entrega a estrutura da decisão e as condições de cada tese."

## Checklist final — "§Final · Checklist"

- **Título:** "Vinte e seis itens, do primeiro ao último".
- **Introdução (L2886):** "O primeiro item é o critério de domínio deste bloco. O último é a disciplina que o Módulo 12 ensinou para "o Brasil é uma boa aposta?" e o Módulo 13 para "essa ação é uma boa compra?", aplicada agora ao tema em que o material disponível é mais enviesado que em qualquer outro do currículo."
- **Mecânica:** Lista ul.ck estática: nenhum script lê ou marca os itens; não há caixa de seleção nem persistência.
- **No código:** Não extraído: nenhum arquivo de src/lib/data traz o checklist do M14. alexandria-badges.ts não o usa.

| # | Item literal | P14 (inferida) | Linha |
|---|---|---|---|
| 1 | "Diante de qualquer número de bioenergia, nomeio em menos de um minuto a base temporal, a rota de conversão e o produto concorrente pelo mesmo insumo." | cronometrado | L2892 |
| 2 | "Sei dizer, sem consultar nota, por que uma usina sucroenergética entrega energia firme durante metade do ano — e por que isso é complementaridade sazonal, não defeito." | producao_oral_ou_livre | L2893 |
| 3 | "Distingo ano-safra de ano-calendário sem hesitar, e sei que o ciclo do Centro-Sul atravessa dois anos-calendário." | autodeclarado | L2894 |
| 4 | "Não comparo dado de safra com estatística de ano-calendário sem conversão explícita e declarada." | autodeclarado | L2895 |
| 5 | "Sei se um dado de safra é levantamento preliminar ou fechamento, e quantas revisões ainda virão." | autodeclarado | L2896 |
| 6 | "Distingo etanol hidratado de anidro, e sei que os dois têm motores de demanda independentes." | autodeclarado | L2897 |
| 7 | "Sei que a demanda de anidro é derivada: volume de gasolina C vezes percentual obrigatório de mistura." | autodeclarado | L2898 |
| 8 | "Não uso a regra dos 70% como limiar: comparo custo por quilômetro com o rendimento medido do veículo específico." | autodeclarado | L2899 |
| 9 | "Trato percentual de mistura como quatro estados — teto legal, em vigor, anunciado com data futura, e prazo vencido não implementado — e nunca como um número só." | autodeclarado | L2900 |
| 10 | "Cito percentual de mistura sempre com norma, número, ano e data de vigência, e verifico se a medida tem prazo de validade declarado." | autodeclarado | L2901 |
| 11 | "Diante de notícia de reunião de conselho, pergunto: mudou o número, mudou a regra de fornecimento, ou mudou o prazo?" | producao_oral_ou_livre | L2902 |
| 12 | "Sei que o mix açúcar-etanol é uma arbitragem contínua sobre o ATR, e não uma decisão anual." | autodeclarado | L2903 |
| 13 | "Não concluo sobre uma arbitragem a partir de preço relativo isolado: exijo a capacidade industrial de alternância da unidade." | autodeclarado | L2904 |
| 14 | "Separo, para qualquer planta de bioenergia, potência instalada, energia gerada e energia exportada, e sei que só a terceira gera receita de venda de energia." | autodeclarado | L2905 |
| 15 | "Não multiplico potência por 8.760 horas: exijo dias de safra, disponibilidade e autoconsumo de processo." | autodeclarado | L2906 |
| 16 | "Não somo potencial técnico, capacidade autorizada, produção e volume contratado na mesma tabela." | autodeclarado | L2907 |
| 17 | "Sei que bagaço tem no mínimo quatro destinos concorrentes, e que cada tonelada em um deles não vai para os outros três." | autodeclarado | L2908 |
| 18 | "Sei que o etanol de milho não tem a sazonalidade de safra da cana, e que ele paga por isso com fonte térmica externa contratada." | autodeclarado | L2909 |
| 19 | "Sei que biogás não é biometano, e que entre os dois há uma planta de purificação com custo de capital e de operação próprios." | autodeclarado | L2910 |
| 20 | "Avalio biometano por logística e escala mínima antes de avaliar por preço por metro cúbico normal." | autodeclarado | L2911 |
| 21 | "Sei que um crédito de descarbonização depende de certificação vigente, volume elegível comercializado e diferencial de intensidade de carbono — nunca de capacidade instalada." | autodeclarado | L2912 |
| 22 | "Nunca cravo preço de crédito de descarbonização em prosa: ele entra como entrada editável, com fonte e data." | autodeclarado | L2913 |
| 23 | "Pergunto qual denominador está sendo usado antes de citar percentual de cumprimento de meta — nacional ou soma das individuais." | autodeclarado | L2914 |
| 24 | "Verifico titularidade de atributo ambiental em contrato antes de atribuir receita ambiental a qualquer projeto." | autodeclarado | L2915 |
| 25 | "Trato material de associação setorial, entidade de classe ou produtor como posição de parte interessada, citável com nome e data, nunca como origem de número nem como avaliação imparcial de política pública." | autodeclarado | L2916 |
| 26 | "Recuso tanto a versão entusiasmada quanto a versão cínica do setor, e devolvo mecanismo e trade-off: quem paga, quem recebe, o que a política cria e o que ela custa — sem tratar bioenergia como solução nem como problema." | producao_oral_ou_livre | L2917 |

`marcacao_p14` é inferida do texto por regra desta extração ("minuto" → cronometrado; "sem consultar nota", "Sei dizer", "pergunto:", "Recuso ... e devolvo" → produção oral/livre; demais → autodeclarado). Precisa de revisão humana. O item 01 é o critério construído (m14-crit-01).

**Fecho — "A frase que fecha o bloco"** (`box gd`, L2920):

> "Bioenergia conecta energia, agro, indústria e clima, e é por isso que ela aparece em toda conversa relevante sobre o Brasil. O que este módulo entrega não é a capacidade de defender o setor nem de atacá-lo — é a capacidade de não perder metade da conversa quando o interlocutor for do agro, do lado de combustíveis ou de clima, e de reconhecer, quando um número de bioenergia aparece numa apresentação, se ele foi construído com rigor ou copiado sem base temporal. Uma nova camada independente serve exatamente para isso."

## Índice de exercícios — "§Ex · Catorze exercícios"

- **Título:** "Catorze exercícios, gabarito oculto".
- **Introdução (L2664):** "Os catorze refletem a construção do critério deste bloco, e por isso se distribuem em quatro famílias: identificação de base temporal, classificação de rota, separação de grandeza e estado de política. Faça o cálculo ou formule a resposta antes de abrir o gabarito — o valor do exercício está na hesitação, não na conferência."
- **Famílias:** o lede declara 4 ("identificação de base temporal", "classificação de rota", "separação de grandeza", "estado de política"); as tags usam 6 ("Base temporal", "Grandeza", "Estado de política", "Rota", "Cálculo", "Síntese"). Ver `div-m14-ex-familias`.
- **Mecânica:** `<details>`/`<summary>` nativo: o gabarito abre ao clicar no enunciado; não há rótulo de botão nem registro de tentativa.
- **Vínculo com aula (P9):** 0 de 14; **14 soltos** (vão para Recursos do Módulo). Varredura por "Aula NN" em tag, enunciado e gabarito dos 14: zero ocorrência. Todos são soltos (P9), como no código. Menções a Módulo 12/13 são referência em prosa, não posse.
- **Critério por exercício:** `null` nos 14. A fonte não dá critério por exercício; só a instrução geral do lede ("Faça o cálculo ou formule a resposta antes de abrir o gabarito").
- **No código:** src/lib/data/alexandria-modulo-14-content.ts (MODULO_14_EXERCICIOS_SOLTOS): 14 itens, 14 idênticos (enunciado, tag e gabarito); renderizado: false. O array existe, mas RecursosDoModulo.tsx não registra 'modulo-14': os 14 exercícios não aparecem na interface. `kind: discursiva` e `points: 10` não têm origem na fonte.

| Tag | Aula | Enunciado | Resposta de referência (literal) | Critério | Código | Linha |
|---|---|---|---|---|---|---|
| "Ex 01 · Base temporal" | solto (P9) | "Uma apresentação afirma: "o Brasil produziu 40,7 bilhões de litros de etanol". Esse dado é comparável a uma estatística elétrica de 2025?" | "Não, e a resposta correta identifica a ambiguidade antes de tentar a comparação. O valor de 40,69 bilhões de litros é a projeção do primeiro levantamento da Conab para o ano-safra 2026/27 — ciclo iniciado em abril de 2026 e encerrado em março de 2027. Uma estatística elétrica de 2025 é de ano-calendário. As duas janelas não coincidem, e a diferença pode chegar a doze meses. Além disso, o número é projeção de primeiro levantamento, sujeito a três revisões ao longo do ciclo, enquanto a estatística elétrica é realizada. Duas incompatibilidades, não uma. A pergunta correta ao interlocutor é: "de qual base temporal é esse número, e é levantamento ou fechamento?"" | `null` | m14-ex-01: idêntico | L2669 |
| "Ex 02 · Grandeza" | solto (P9) | "Uma cogeração tem 80 MW de potência instalada. Quanta energia ela entrega à rede no ano?" | "A resposta correta recusa responder com a informação dada, e nomeia as três grandezas separadamente. Faltam: dias efetivos de safra, disponibilidade da planta dentro da safra e autoconsumo de vapor e eletricidade de processo. Com 210 dias de safra, 88% de disponibilidade e 55% de autoconsumo, os 80 MW produzem cerca de 355 GWh brutos e entregam cerca de 160 GWh à rede — um fator de capacidade anual em torno de 23%, contra os 100% que a multiplicação ingênua por 8.760 horas sugeriria. Potência instalada, energia gerada e energia exportada são três números, e só o terceiro gera receita de venda de energia." | `null` | m14-ex-02: idêntico | L2681 |
| "Ex 03 · Estado de política" | solto (P9) | "Um interlocutor afirma que a mistura de biodiesel no diesel é de 16%. Está em vigor?" | "Não. Em 2 de agosto de 2026, o teor em vigor é B15, vigente desde 1º de agosto de 2025. O B16 estava previsto na Lei nº 14.993/2024 para março de 2026, condicionado a viabilidade técnica comprovada — a data passou e o percentual não subiu; os testes foram iniciados em 2026 e o conselho não deliberou a elevação. A resposta completa distingue os quatro estados: teto legal autorizado de 25% mediante viabilidade técnica; em vigor B15; trajetória legal apontando para 20% até março de 2030; e prazo legal vencido e não implementado, que é o caso do B16. Onde verificar: resolução do CNPE e página da ANP, na data de uso." | `null` | m14-ex-03: idêntico | L2692 |
| "Ex 04 · Rota" | solto (P9) | "Dado o insumo "bagaço de cana", qual rota, qual produto, qual órgão competente, e o que deixou de ser feito?" | "Há quatro destinos concorrentes para o mesmo bagaço, e a resposta correta os nomeia. Um: vapor de processo — uso interno, prioridade absoluta, sem ele não há moagem. Dois: queima em caldeira e turbina gerando eletricidade exportada — órgão competente ANEEL para outorga e capacidade, ONS para operação, CCEE para comercialização. Três: hidrólise para etanol de segunda geração — órgão competente ANP, produto etanol. Quatro: venda como biomassa a terceiros. Cada tonelada que vai para um dos destinos não vai para os outros três, e é essa a informação que quase nunca acompanha um número de 2G ou de bioeletricidade." | `null` | m14-ex-04: idêntico | L2704 |
| "Ex 05 · Cálculo" | solto (P9) | "Uma base prepara 10 milhões de litros de gasolina C sob o teor em vigor em agosto de 2026. Quanto de anidro e de gasolina A, ignorando variação volumétrica?" | "Sob E32, vigente desde 1º de agosto de 2026 por Resolução CNPE nº 9/2026: 3,2 milhões de litros de anidro e 6,8 milhões de litros de gasolina A. Sob o teor anterior, E30, seriam 3,0 e 7,0 milhões. A diferença de dois pontos percentuais move 200 mil litros nesta única base — e é a mesma aritmética que, na escala nacional, o governo apresentou como razão para deixar de importar volume relevante de gasolina. Note também: o exercício exige declarar o teor e a data, porque a medida tem vigência de 180 dias prorrogável uma vez, e a gasolina premium permanece em E25." | `null` | m14-ex-05: idêntico | L2716 |
| "Ex 06 · Cálculo" | solto (P9) | "Uma distribuidora comercializa 200 milhões de litros de diesel B. Quanto de B100 está incorporado?" | "Sob B15: 30 milhões de litros. Se o teor subisse para B16, seriam 32 milhões — 2 milhões de litros de demanda adicional criados por um único ponto percentual, nesta distribuidora. Multiplique pela escala nacional do diesel B e você tem a razão pela qual um ponto de mistura é objeto de disputa política contínua, e por que uma entidade que representa produtores tem interesse declarado nessa variável." | `null` | m14-ex-06: idêntico | L2727 |
| "Ex 07 · Base temporal" | solto (P9) | "A agência reporta 35,9 bilhões de litros de etanol e a companhia de abastecimento reporta 37,5 bilhões para períodos próximos. Uma das duas está errada?" | "Nenhuma. As duas medem coisas diferentes, e a coexistência é normal. A agência consolida produção por ano-calendário, por produto autorizado. A companhia de abastecimento reporta safra, em janela agrícola, e pode agregar etanol de cana e de milho conforme a metodologia do levantamento. Cobertura, origem e janela diferem. Antes de comparar qualquer par de números deste setor, alinhe quatro coisas: período, unidade, produto e cobertura. Se qualquer uma das quatro divergir, a comparação precisa de conversão declarada ou não deve ser feita." | `null` | m14-ex-07: idêntico | L2736 |
| "Ex 08 · Grandeza" | solto (P9) | "Um projeto de biometano informa volume anual de 8 milhões de Nm³ com poder calorífico inferior de 36 MJ/Nm³. Qual a energia anual, e o que esse número não diz?" | "288 milhões de MJ, ou 288 mil GJ, ou 288 TJ. O que esse número não diz: se o volume é capacidade autorizada, produção efetiva ou volume vendável após autoconsumo, perdas e indisponibilidade; se o poder calorífico é o do contrato ou um valor de manual; qual a distância até o cliente e por qual rota de entrega; e qual a eficiência do equipamento que vai queimar o gás — porque equivalência energética não é equivalência de consumo. Quatro perguntas antes de o número virar dado." | `null` | m14-ex-08: idêntico | L2747 |
| "Ex 09 · Cálculo" | solto (P9) | "Uma unidade mói 2,5 milhões de toneladas de cana a 140 kg de ATR por tonelada. Qual o ATR total, e por que ele importa mais que a tonelagem?" | "350 milhões de quilos de ATR antes de perdas industriais. Importa mais que a tonelagem porque é sobre o ATR, e não sobre a cana, que incide a decisão de mix: cada quilo de ATR pode virar açúcar ou etanol, e a remuneração relativa dos dois destinos é o sinal de arbitragem. Duas unidades com a mesma moagem e ATR diferente têm bases de produto recuperável diferentes, e portanto receitas potenciais diferentes com o mesmo mix." | `null` | m14-ex-09: idêntico | L2757 |
| "Ex 10 · Estado de política" | solto (P9) | "Uma notícia informa que o conselho "aprovou mudanças na mistura de biodiesel" em julho de 2026. O teor mudou?" | "Não. Na reunião de 14 de julho de 2026, o colegiado alterou as regras de fornecimento — determinando que o biodiesel destinado ao cumprimento do percentual obrigatório venha exclusivamente de unidades autorizadas pela agência — sem alterar o teor, que permanece em B15. Na mesma reunião foi aprovada a elevação do etanol anidro na gasolina para 32%. Duas decisões, dois combustíveis, naturezas distintas, uma manchete só. A pergunta de verificação diante de qualquer notícia de reunião de conselho é sempre a mesma: mudou o número, mudou a regra de quem fornece, ou mudou o prazo?" | `null` | m14-ex-10: idêntico | L2766 |
| "Ex 11 · Rota" | solto (P9) | "Uma planta produz etanol usando gás natural como fonte térmica. Isso é possível, e o que muda?" | "É possível e é característico da rota de milho, que não tem resíduo combustível equivalente ao bagaço e precisa contratar fonte térmica externa — biomassa comprada, cavaco ou gás. O que muda: um custo operacional que a rota de cana não tem; uma exposição a preço de combustível que a rota de cana não tem; e, decisivamente, uma intensidade de carbono diferente, porque a energia consumida na conversão entra no cálculo de ciclo de vida. Duas plantas produzindo a mesma molécula podem ter notas de eficiência distintas exatamente por isso — e é por isso que "etanol" não é uma rota, e a nota de eficiência é por unidade produtora, não por combustível." | `null` | m14-ex-11: idêntico | L2777 |
| "Ex 12 · Grandeza" | solto (P9) | "Uma apresentação soma "potencial de biometano de resíduos" com "capacidade autorizada" e com "produção" numa única tabela de mercado. Qual o defeito?" | "São três estágios diferentes somados como se fossem a mesma grandeza, e o defeito é o mesmo que a régua de maturidade do Módulo 12 catalogou. Potencial é mapeamento técnico-econômico: responde "onde seria possível", não "onde existe". Capacidade autorizada é ato administrativo: existe planta habilitada, não necessariamente operando. Produção é medição. E falta ainda a quarta: volume contratado, que é o único que gera receita. Somar estágios diferentes na mesma tabela é o modo característico de inflar um mercado, e a correção é separar as colunas e declarar a data-base de cada uma." | `null` | m14-ex-12: idêntico | L2789 |
| "Ex 13 · Cálculo" | solto (P9) | "Uma rota vende 100 milhões de litros elegíveis, com 21,1 MJ/L e diferencial de intensidade de carbono de 55 gCO₂e/MJ. Qual a ordem de grandeza de créditos, e por que é apenas teto?" | "100.000.000 × 21,1 × 55 = 116,05 bilhões de gramas, ou cerca de 116.050 toneladas de CO₂ equivalente — ordem de grandeza de 116 mil créditos. É teto conceitual por três razões: a fórmula exata, os fatores de elegibilidade e os arredondamentos seguem a regra da agência; o volume precisa ser efetivamente comercializado e documentado, não produzido; e a nota de eficiência precisa estar vigente na data. Além disso, o valor econômico depende do preço formado em bolsa, que variou de mais de cem reais por crédito em 2024 para poucas dezenas em 2026 — e por isso nunca se crava receita de atributo ambiental em caso base de projeto." | `null` | m14-ex-13: idêntico | L2800 |
| "Ex 14 · Síntese" | solto (P9) | "Um interlocutor entusiasmado afirma: "o Brasil já resolveu o transporte com etanol". Responda." | "A resposta correta nem confirma nem desmente — devolve grandeza, base temporal e trade-off. Quatro movimentos. Um: qual fração do consumo energético do setor de transportes é renovável, em qual ano-calendário, segundo qual fonte? Dois: por qual rota — etanol de cana, de milho, biodiesel, biometano? A composição muda a conclusão. Três: qual parcela dessa fração existe por decisão regulatória — mistura obrigatória — e qual existe por escolha de consumidor no ponto de abastecimento? São mecanismos diferentes com durabilidades diferentes. Quatro: à custa de qual uso alternativo do insumo, e com qual intensidade de carbono certificada por rota? Quem responde assim não parece cético nem entusiasmado — parece quem leu. É a mesma disciplina que o Módulo 12 exigiu para "o Brasil é uma boa aposta?" e o Módulo 13 para "essa ação é uma boa compra?"." | `null` | m14-ex-14: idêntico | L2811 |

Menções em prosa (não são tag de posse): Ex 12 · Grandeza → Módulo 12; Ex 14 · Síntese → Módulo 12, Módulo 13.

### Exercícios embutidos na Aula 08 (fora do §Ex; acrescentado na verificação)

Não entram nos 14 do §Ex nem nas contagens `exercicios`/`exercicios_soltos`. A própria aula declara o último campo de cada ficha de rota como exercício (L2344): "O último campo de cada ficha — "o que este número não diz" — está propositalmente incompleto. Ele é exercício: preencha-o antes de olhar o instrumento seguinte, e depois confira contra o que o verificador devolve." Nenhum tem gabarito na ficha; a fonte manda conferir contra o verificador (INST·10). Vínculo: Aula 08 (não é solto). JSON: `exercicios.exercicios_embutidos_em_aula`.

| # | Ficha | Campo | Texto literal | Linha |
|---|---|---|---|---|
| 1 | "Etanol de cana · primeira geração" (ROTA 01) | "O que este número não diz" | "Exercício. Um volume de etanol de cana em ano-safra não diz o mix praticado, não diz quanto veio de área nova contra produtividade, e não diz… Complete com pelo menos mais dois itens antes de seguir." | L2357 |
| 2 | "Etanol de milho" (ROTA 02) | "O que este número não diz" | "Exercício. Uma participação percentual do milho no etanol nacional não diz de qual base temporal veio, não diz qual fonte térmica a planta usou, e não diz… Complete com pelo menos mais dois itens." | L2369 |
| 3 | "Etanol de segunda geração" (ROTA 03) | "O que este número não diz" | "Exercício. Um volume de etanol de segunda geração não diz quanto de exportação elétrica deixou de existir na mesma planta, não diz o consumo de enzimas por litro, e não diz… Complete com pelo menos mais dois itens." | L2381 |
| 4 | "Biodiesel" (ROTA 04) | "O que este número não diz" | "Exercício. Um volume de B100 produzido não diz qual matéria-prima o originou, não diz se o teor que o demandou é teto, vigente ou anunciado, e não diz… Complete com pelo menos mais dois itens." | L2393 |
| 5 | "Biogás e biometano" (ROTA 05) | "O que este número não diz" | "Exercício. Um potencial de biometano em metros cúbicos não diz o raio econômico de coleta, não diz se existe cliente na distância assumida, e não diz… Complete com pelo menos mais dois itens." | L2405 |
| 6 | "Cogeração a bagaço" (ROTA 06) | "O que este número não diz" | "Exercício. Uma potência instalada de cogeração não diz quantos dias por ano a planta mói, não diz o autoconsumo de processo, e não diz… Complete com pelo menos mais dois itens." | L2417 |

## Referências — "§Ref · Referências"

**Título:** "Trinta e quatro fontes, separadas por natureza". **Introdução (L3158):** "A separação por natureza é deliberada e é conteúdo. Norma e resolução são fonte de regra. Estatística oficial é fonte de número. Bolsa é fonte de preço. Informação corporativa é fonte da própria companhia. E material de associação setorial ou de entidade de classe é posição de parte interessada — citável com nome e data, nunca como origem de número nem como avaliação imparcial de política pública. Neste bloco, essa última distinção importa mais que em qualquer outro do currículo."

**Grupos (5):** "Legislação e resoluções de conselho — fonte de regra" (10, L3165); "Resoluções da agência reguladora — fonte de especificação e de procedimento" (10, L3179); "Estatística oficial e painéis — fonte de número" (8, L3193); "Preço, mercado e informação corporativa" (3, L3205); "Documentos internos do GridAlpha" (3, L3212).

`natureza_ou_emissor` é o span.src literal (ora natureza — "Lei federal", "Decreto", "Interno" —, ora emissor — "ANP", "EPE", "B3"). `instituicao: null` porque a fonte não separa instituição em campo próprio; o emissor, quando existe, está no span.src ou no título. Nenhuma referência tem URL nem domínio (zero `<a>` e zero `<em>` no § Ref). `datas_literais` são as datas por extenso achadas por regex; `ano_no_titulo` é o primeiro ano do título.

| # | Grupo | Natureza/emissor (span.src) | Título (b) | Descrição | Datas literais | URL/domínio | Linha |
|---|---|---|---|---|---|---|---|
| 1 | 1 | "Lei federal" | "Lei nº 13.576, de 26 de dezembro de 2017" | "institui a Política Nacional de Biocombustíveis, cria as metas nacionais de descarbonização e o crédito de descarbonização." | 26 de dezembro de 2017 | `null` | L3167 |
| 2 | 1 | "Decreto" | "Decreto nº 9.888, de 27 de junho de 2019" | "regulamenta a Política Nacional de Biocombustíveis e define competências de conselho e agência." | 27 de junho de 2019 | `null` | L3168 |
| 3 | 1 | "Lei federal" | "Lei nº 14.993, de 8 de outubro de 2024" | "Lei do Combustível do Futuro. Fixa tetos de mistura de anidro e de biodiesel, cria o programa de aviação sustentável, o programa de diesel verde, o programa de incentivo ao biometano e o marco de captura de carbono." | 8 de outubro de 2024 | `null` | L3169 |
| 4 | 1 | "Lei federal" | "Lei nº 15.269, de 2025" | "base legal invocada para a fixação, em caráter excepcional, da meta inicial de descarbonização do mercado de gás natural." | — | `null` | L3170 |
| 5 | 1 | "Decreto" | "Decreto nº 12.614, de 5 de setembro de 2025" | "regulamenta o Programa Nacional de Descarbonização do Produtor e Importador de Gás Natural e de Incentivo ao Biometano." | 5 de setembro de 2025 | `null` | L3171 |
| 6 | 1 | "Decreto" | "Decreto nº 11.499, de 25 de abril de 2023" | "define o prazo de comprovação do cumprimento das metas individuais anuais." | 25 de abril de 2023 | `null` | L3172 |
| 7 | 1 | "Resolução CNPE" | "Resolução CNPE nº 9, de 25 de junho de 2025" | "eleva o teor de anidro na gasolina de 27% para 30% e o de biodiesel no diesel de 14% para 15%, ambos a partir de 1º de agosto de 2025." | 25 de junho de 2025; 1º de agosto de 2025 | `null` | L3173 |
| 8 | 1 | "Resolução CNPE" | "Resolução CNPE nº 21, de 30 de dezembro de 2025" | "fixa a meta compulsória anual de redução de emissões para 2026 em 48,09 milhões de créditos de descarbonização." | 30 de dezembro de 2025 | `null` | L3174 |
| 9 | 1 | "Resolução CNPE" | "Resolução CNPE nº 4, de 2026" | "fixa em 0,5%, em caráter excepcional, a meta inicial de redução de emissões do mercado de gás natural por meio de biometano para 2026." | — | `null` | L3175 |
| 10 | 1 | "Resolução CNPE" | "Resolução CNPE nº 9, de 2026" | "publicada em edição extra do Diário Oficial da União em 30 de julho de 2026; eleva o teor obrigatório de anidro na gasolina C comum e comum aditivada de 30% para 32%, em caráter excepcional e temporário, por 180 dias prorrogáveis uma vez, a partir de 1º de agosto de 2026. Note a colisão de numeração com a resolução de 2025: sempre cite número e ano." | 30 de julho de 2026; 1º de agosto de 2026 | `null` | L3176 |
| 11 | 2 | "Resolução ANP" | "Resolução ANP nº 791, de 12 de junho de 2019" | "metodologia de individualização das metas anuais entre distribuidores de combustíveis, incluindo o abatimento por contrato de longo prazo com produtor certificado." | 12 de junho de 2019 | `null` | L3181 |
| 12 | 2 | "Resolução ANP" | "Resolução ANP nº 807, de 2020" | "especificação da gasolina, mantida sem alteração de demais parâmetros na adoção do E32, incluindo o número de octano pesquisa." | — | `null` | L3182 |
| 13 | 2 | "Resolução ANP" | "Resolução ANP nº 886, de 2022" | "especificação e regras do biometano oriundo de aterros sanitários e de estações de tratamento de esgoto." | — | `null` | L3183 |
| 14 | 2 | "Resolução ANP" | "Resolução ANP nº 906, de 2022" | "biometano oriundo de produtos e resíduos orgânicos agrossilvopastoris e comerciais." | — | `null` | L3184 |
| 15 | 2 | "Resolução ANP" | "Resolução ANP nº 907, de 2022" | "especificação e controle de qualidade do etanol combustível, anidro e hidratado, incluindo corante e limite de metanol." | — | `null` | L3185 |
| 16 | 2 | "Resolução ANP" | "Resolução ANP nº 920, de 2023" | "especificação e controle de qualidade do biodiesel." | — | `null` | L3186 |
| 17 | 2 | "Resolução ANP" | "Resolução ANP nº 984, de 2025" | "consolida as regras de certificação da produção eficiente de biocombustíveis e de credenciamento de firmas inspetoras." | — | `null` | L3187 |
| 18 | 2 | "Resolução ANP" | "Resolução ANP nº 989, de 2025" | "atualiza o método de ensaio de contaminação total do biodiesel sem alterar os limites." | — | `null` | L3188 |
| 19 | 2 | "Resolução ANP" | "Resolução ANP nº 995, de 2026" | "individualização das metas compulsórias anuais aplicáveis a produtores e importadores de gás natural, com limiar de volume médio anual para caracterização de agente obrigado." | — | `null` | L3189 |
| 20 | 2 | "Resolução ANP" | "Resolução ANP nº 996, de 2026" | "certificação do produtor e importador de biometano, geração de lastro, emissão do certificado de garantia de origem e credenciamento de agentes certificadores de origem." | — | `null` | L3190 |
| 21 | 3 | "ANP" | "Anuário Estatístico Brasileiro do Petróleo, Gás Natural e Biocombustíveis 2026" | ", publicado em 26 de junho de 2026, ano-base 2025. Produção de etanol anidro e hidratado, produção de biodiesel, vendas e matérias-primas. Base temporal: ano-calendário." | 26 de junho de 2026 | `null` | L3195 |
| 22 | 3 | "ANP" | "Produção de biocombustíveis — dados abertos" | "Séries mensais de etanol e biodiesel, por unidade produtora e por região; base para qualquer cálculo derivado de distribuição regional, que deve ser recomputado na data de uso." | — | `null` | L3196 |
| 23 | 3 | "ANP" | "Painel Dinâmico de Produtores de Biometano" | "Produtores autorizados, capacidade de processamento, produção e matérias-primas, com data-base declarada — use a data-base, não o ano." | — | `null` | L3197 |
| 24 | 3 | "ANP" | "RenovaBio — metas individuais compulsórias definitivas para 2026" | ", publicadas em 31 de março de 2026 por despacho da agência, com soma de 49,01 milhões de créditos contra meta nacional de 48,09 milhões." | 31 de março de 2026 | `null` | L3198 |
| 25 | 3 | "EPE" | "Balanço Energético Nacional 2026 — Relatório Síntese" | ", ano-base 2025. Participação do etanol de milho na produção nacional de etanol, matérias-primas do biodiesel, renovabilidade da matriz energética industrial e do setor de transportes. Base temporal: ano-calendário." | — | `null` | L3199 |
| 26 | 3 | "EPE" | "Anuário Estatístico de Energia Elétrica 2026" | ", ano-base 2025. Bioeletricidade de 66,1 TWh e 8,5% da matriz elétrica, composição por bagaço e licor preto, expansão de capacidade instalada e comportamento da geração hidráulica no ano." | — | `null` | L3200 |
| 27 | 3 | "Conab" | "1º Levantamento da safra de cana-de-açúcar 2026/27" | ", divulgado em 28 de abril de 2026. Produção de cana, área colhida, produtividade, etanol de cana e de milho por tipo, e açúcar. Base temporal: ano-safra; primeiro de quatro levantamentos." | 28 de abril de 2026 | `null` | L3201 |
| 28 | 3 | "ANEEL · ONS · CCEE" | "Bases de capacidade instalada, geração efetiva e comercialização" | "Fonte primária para potência instalada e energia gerada de usinas a biomassa, e para a estrutura contratual da energia exportada." | — | `null` | L3202 |
| 29 | 4 | "B3" | "Crédito de descarbonização — registro, negociação e índice de preço médio" | "Fonte primária de preço do crédito; é a referência que deve substituir o valor padrão carregado no INST·08 antes de qualquer uso externo." | — | `null` | L3207 |
| 30 | 4 | "MME · CNPE" | "Comunicações do conselho e balanço do programa de biocombustíveis" | "Fonte de evento — quando uma resolução foi aprovada e o que foi anunciado — e de série histórica de valor médio e cumprimento por ciclo." | — | `null` | L3208 |
| 31 | 4 | "Informação corporativa" | "Relatórios e materiais de relações com investidores de operador integrado do setor sucroenergético" | "Volume de etanol de segunda geração, ganho declarado de produção por área e certificações voluntárias. Tratar como informação da companhia, a ser confrontada com volume efetivo, ramp-up, custo e impacto sobre a bioeletricidade da mesma unidade. A estrutura de capital dessa companhia foi tratada no Módulo 13 e não é reaberta aqui." | — | `null` | L3209 |
| 32 | 5 | "Interno" | "GridAlpha — Currículo Definitivo, Bloco 14: Biocombustíveis e Bioenergia" | "Oito tópicos essenciais e frase de justificativa. Não contém seção de critério de domínio nem de recursos primários — o critério deste módulo é construção declarada, ver §00.3." | — | `null` | L3214 |
| 33 | 5 | "Interno" | "GridAlpha — War Room, Quatro Travas de Segurança" | "Linguagem pública defensável; dados regulatórios verificados em fonte primária; anonimização rigorosa do caso da família; linguagem de oportunidade em vez de promessa." | — | `null` | L3215 |
| 34 | 5 | "Interno" | "GridAlpha — Plano de Negócios" | "Arquitetura de produto: GridAlpha Research, com análises setor-específicas incluindo agro; Regulatory Radar, com rastreamento e análise de desenvolvimentos regulatórios; e Energy Brief, newsletter analítica semanal." | — | `null` | L3216 |

**"Data de verificação e limites deste ativo"** (`box rd`, L3219):

> "Todas as normas, percentuais, metas, volumes e estados de regulamentação citados foram verificados em 2 de agosto de 2026. Este é material educacional e analítico: não substitui engenharia, certificação, laudo ambiental, parecer jurídico, especificação de combustível nem responsabilidade técnica. Não constitui recomendação de rota de bioenergia, de troca de combustível, de decisão de investimento em ativo do setor, nem de compra, venda ou manutenção de qualquer valor mobiliário."

**No código:** Não extraído: nenhum arquivo de src/lib/data traz as referências do M14.

## Glossário — "§Lex · Glossário"

**Título:** "Cento e cinquenta e oito termos, agrupados por família". **Introdução (L2938):** "O vocabulário deste bloco colide com o português comum mais que o de qualquer outro do currículo: safra é palavra do setor e nome de instituição financeira; usina significava hidrelétrica nos treze módulos anteriores e passa a significar unidade sucroenergética aqui; nota é nota de eficiência e é substantivo comum. Por isso o glossário está agrupado por família — quem procura um termo procura junto do que ele contrasta."

**Contagem (P22).** h2 "Cento e cinquenta e oito termos, agrupados por família"; pill "158 termos"; soma das 8 famílias declaradas = 158; `span.term` no markup = 158. Todos concordam (0 famílias divergentes).

**Código.** alexandria-glossario.ts cobre só os Módulos 01-08 (blocos "Modulo 02..08" e o do M01). Nenhum dos 158 termos do M14 está no código. `homonimos_em_outros_modulos_do_codigo` lista verbetes de outros módulos com o mesmo termo (ids gl-mNN-… são namespaçados; mesma palavra não é duplicata). Ausentes no código: **158 de 158** (lista em `glossario.termos_ausentes_no_codigo`). Com homônimo em outro módulo do código: 13:

- "Bioeletricidade" → `gl-m08-bioeletricidade`
- "Licor preto" → `gl-m08-licor-preto`
- "Cogeração" → `gl-m03-cogeracao`, `gl-m08-cogeracao`
- "Fator de capacidade" → `gl-m03-fator-de-capacidade`, `gl-m08-fator-de-capacidade`
- "Disponibilidade" → `gl-m08-disponibilidade`
- "Sazonalização" → `gl-m04-sazonalizacao`
- "Modulação" → `gl-m04-modulacao`
- "Curtailment" → `gl-m02-curtailment`, `gl-m03-curtailment`
- "Intensidade de carbono" → `gl-m08-intensidade-de-carbono`
- "Lastro" → `gl-m04-lastro`, `gl-m05-lastro`, `gl-m06-lastro`
- "CNPE" → `gl-m07-cnpe`
- "Risco de base" → `gl-m04-risco-de-base`
- "Take-or-pay" → `gl-m03-take-or-pay`, `gl-m04-take-or-pay`

Nenhum termo declara vínculo com aula (`vinculos.aulas: null` nos 158).

### Família 01 · Base temporal e estatística — declarado "12 termos", medido 12 (L2944)

| Termo | Definição literal | Linha |
|---|---|---|
| **Ano-safra** | "janela do ciclo agrícola, que no Centro-Sul atravessa dois anos-calendário; escreve-se 2026/27." | L2947 |
| **Ano-calendário** | "janela de 1º de janeiro a 31 de dezembro. Base das estatísticas da agência reguladora e dos balanços energéticos." | L2948 |
| **Levantamento** | "estimativa parcial de safra publicada ao longo do ciclo; o primeiro é o menos preciso e é seguido por três revisões." | L2949 |
| **Fechamento de safra** | "apuração final do ciclo, publicada após o encerramento; é o único número de safra comparável a um realizado." | L2950 |
| **Data-base** | "data de referência de um painel ou base de dados, distinta da data de publicação e da data de consulta." | L2951 |
| **Série histórica** | "conjunto de observações comparáveis de uma mesma fonte; comparações entre séries de fontes distintas exigem conversão declarada." | L2952 |
| **Ciclo agrícola** | "sequência de plantio, tratos, colheita e renovação; define a janela operacional da unidade industrial que depende dele." | L2953 |
| **Entressafra** | "período em que a unidade não mói; nas rotas de cana, o período em que não há geração nem produção." | L2954 |
| **Safra Centro-Sul** | "ciclo principal do país, com moagem concentrada entre abril e novembro." | L2955 |
| **Safra Norte-Nordeste** | "ciclo com janela distinta da do Centro-Sul; somar as duas sem separar é fonte frequente de erro de base temporal." | L2956 |
| **Base de comparação** | "conjunto formado por período, unidade, produto e cobertura; comparar sem igualar os quatro produz um resultado sem significado." | L2957 |
| **Cobertura estatística** | "o universo efetivamente medido por uma fonte; duas fontes podem divergir apenas por medirem universos diferentes." | L2958 |

### Família 02 · Cana, milho e camada agrícola — declarado "20 termos", medido 20 (L2962)

| Termo | Definição literal | Linha |
|---|---|---|
| **Cana-de-açúcar** | "gramínea de ciclo semiperene, insumo perecível que exige moagem em horas após a colheita." | L2965 |
| **ATR** | "Açúcares Totais Recuperáveis, em quilos por tonelada; medida econômica de qualidade da cana e base da decisão de mix." | L2966 |
| **TCH** | "toneladas de cana por hectare; medida de produtividade agrícola, que só se lê junto com ATR e idade do canavial." | L2967 |
| **Moagem** | "volume de cana processado; unidade operacional central da usina sucroenergética." | L2968 |
| **Canavial** | "área plantada com cana; produtividade cai gradualmente com a idade do corte." | L2969 |
| **Renovação de canavial** | "replantio de área envelhecida; consome investimento agrícola e reduz área colhida no ciclo em que ocorre." | L2970 |
| **Idade média do canavial** | "indicador de saúde do ativo agrícola; idade alta antecipa queda de produtividade futura." | L2971 |
| **Pol** | "teor de sacarose aparente da cana, componente do cálculo do ATR." | L2972 |
| **Fibra** | "fração não solúvel da cana; determina o volume de bagaço gerado por tonelada moída." | L2973 |
| **Impureza mineral** | "terra e areia que entram com a cana colhida; elevam desgaste e reduzem eficiência de extração." | L2974 |
| **Impureza vegetal** | "palha e ponteiro que chegam com a cana; aumentam fibra disponível e alteram o balanço da caldeira." | L2975 |
| **CCT** | "corte, carregamento e transporte; conjunto de operações entre o talhão e a moenda, e um dos maiores custos da lavoura." | L2976 |
| **Raio médio** | "distância média entre a área colhida e a unidade industrial; determina custo logístico e perda de qualidade em trânsito." | L2977 |
| **Colheita mecanizada** | "colheita por máquina, que deixa palha no campo e altera a disponibilidade de fibra para energia." | L2978 |
| **Segunda safra** | "cultivo sucessivo no mesmo ano agrícola, característico do milho no Centro-Oeste e origem de boa parte do grão da rota de etanol de milho." | L2979 |
| **Milho** | "grão armazenável, o que permite operação industrial contínua e diferencia estruturalmente a rota 02 da rota 01." | L2980 |
| **Oleaginosa** | "cultura produtora de óleo vegetal; a soja é a principal matéria-prima do biodiesel brasileiro." | L2981 |
| **Sebo** | "gordura de origem animal usada como matéria-prima de biodiesel, com perfil de custo e de carbono distinto do óleo vegetal." | L2982 |
| **Produtividade agrícola** | "produção por unidade de área; lê-se sempre com a qualidade da matéria-prima, nunca isolada." | L2983 |
| **Área colhida** | "extensão efetivamente colhida no ciclo, distinta da área plantada e da área total do ativo agrícola." | L2984 |

### Família 03 · Etanol e destilaria — declarado "22 termos", medido 22 (L2988)

| Termo | Definição literal | Linha |
|---|---|---|
| **Etanol** | "álcool etílico combustível; a mesma molécula sai de cana, de milho e de fibra celulósica, por rotas diferentes." | L2991 |
| **Etanol hidratado** | "etanol combustível com água dentro da especificação, vendido diretamente ao consumidor." | L2992 |
| **Etanol anidro** | "etanol desidratado, destinado exclusivamente à mistura na gasolina A; recebe corante como instrumento antifraude." | L2993 |
| **Etanol neutro** | "etanol de alta pureza destinado a química, bebidas e cosméticos, fora do circuito de combustível." | L2994 |
| **E1G** | "etanol de primeira geração, produzido a partir de açúcares ou amidos diretamente fermentáveis." | L2995 |
| **E2G** | "etanol de segunda geração, produzido a partir de frações celulósicas de bagaço e palha." | L2996 |
| **Fermentação** | "conversão biológica de açúcares em etanol; etapa comum às rotas de cana, milho e segunda geração." | L2997 |
| **Destilação** | "separação do etanol do mosto fermentado; define o teor alcoólico do produto hidratado." | L2998 |
| **Desidratação** | "etapa adicional que retira a água residual e produz o anidro; a capacidade instalada de desidratação é a restrição física da oferta de anidro." | L2999 |
| **Gasolina A** | "gasolina de refinaria, sem etanol; nunca é vendida ao consumidor final." | L3000 |
| **Gasolina C** | "a gasolina da bomba, resultado da mistura da gasolina A com etanol anidro no teor obrigatório vigente." | L3001 |
| **Gasolina premium** | "gasolina de especificação distinta, com teor próprio de anidro, não alterado pelas mudanças aplicáveis à comum." | L3002 |
| **E30** | "gasolina C com 30% de etanol anidro em volume; teor vigente entre 1º de agosto de 2025 e 31 de julho de 2026." | L3003 |
| **E32** | "gasolina C comum com 32% de etanol anidro, em vigor desde 1º de agosto de 2026 em caráter excepcional e temporário." | L3004 |
| **E35** | "teto legal autorizado para a mistura de anidro na gasolina, previsto na Lei nº 14.993/2024 e condicionado a testes." | L3005 |
| **Veículo flex** | "veículo capaz de operar com gasolina C, com hidratado ou com qualquer proporção entre os dois; é a unidade de arbitragem descentralizada do mercado." | L3006 |
| **Paridade** | "relação econômica entre dois combustíveis; só decide quando calculada por energia útil ou por quilômetro, nunca por litro." | L3007 |
| **Índice de paridade** | "razão entre o preço do hidratado e o da gasolina C; serve como triagem, não como decisão." | L3008 |
| **Custo por quilômetro** | "preço por litro dividido pelo rendimento medido; a única comparação que decide entre combustíveis num veículo específico." | L3009 |
| **Destilaria autônoma** | "unidade que produz apenas etanol, sem capacidade de cristalização; teto de açúcar igual a zero." | L3010 |
| **Unidade mista** | "unidade capaz de produzir açúcar e etanol, dentro de uma faixa de alternância definida por engenharia." | L3011 |
| **Mix** | "repartição do ATR entre açúcar e etanol numa safra; resultado da arbitragem, e não o sinal que a motiva." | L3012 |

### Família 04 · Biodiesel e combustíveis de rota fóssil substituída — declarado "20 termos", medido 20 (L3016)

| Termo | Definição literal | Linha |
|---|---|---|
| **Biodiesel** | "éster produzido a partir de óleos e gorduras, misturado ao diesel fóssil em teor obrigatório." | L3019 |
| **B100** | "biodiesel puro, antes da mistura; é o produto que a unidade produtora vende." | L3020 |
| **Diesel A** | "diesel de refinaria, sem biodiesel." | L3021 |
| **Diesel B** | "o diesel da bomba, resultado da mistura de diesel A com B100 no teor obrigatório vigente." | L3022 |
| **B15** | "diesel B com 15% de B100 em volume; teor em vigor desde 1º de agosto de 2025." | L3023 |
| **B16** | "teor de 16% previsto em lei para março de 2026, com prazo vencido e não implementado até a data de verificação deste módulo." | L3024 |
| **B20** | "teor de 20% apontado pela trajetória legal para março de 2030." | L3025 |
| **B25** | "teto legal autorizado para a mistura de biodiesel, condicionado a viabilidade técnica comprovada." | L3026 |
| **Transesterificação** | "reação entre óleo ou gordura e um álcool que produz ésteres e glicerina; rota química dominante do biodiesel brasileiro." | L3027 |
| **FAME** | "ésteres metílicos de ácidos graxos; designação química do biodiesel convencional." | L3028 |
| **Glicerina** | "coproduto da transesterificação; tem mercado próprio, que pode saturar localmente." | L3029 |
| **Diesel verde** | "hidrocarboneto renovável obtido por hidrotratamento; quimicamente distinto do biodiesel e não intercambiável com ele na nomenclatura." | L3030 |
| **HVO** | "óleo vegetal hidrotratado; designação técnica corrente do diesel verde." | L3031 |
| **SAF** | "combustível sustentável de aviação; categoria funcional certificada por rota, não um produto único." | L3032 |
| **Estabilidade à oxidação** | "resistência do combustível à degradação ao longo do armazenamento e da distribuição; crítica em teores crescentes de biodiesel." | L3033 |
| **Ponto de entupimento a frio** | "temperatura em que o combustível compromete o fluxo pelo filtro; parâmetro de adequação climática." | L3034 |
| **Contaminação total** | "teor de material insolúvel; parâmetro de especificação com método de ensaio atualizado em 2025 sem alteração de limite." | L3035 |
| **Glicerídeos** | "resíduos de conversão incompleta; indicam qualidade de purificação e causam depósitos." | L3036 |
| **Metanol residual** | "álcool remanescente do processo; parâmetro de segurança e de especificação." | L3037 |
| **Selo social** | "instrumento de inclusão produtiva vinculado à aquisição de matéria-prima de agricultura familiar na cadeia do biodiesel." | L3038 |

### Família 05 · Biogás, biometano e resíduos — declarado "20 termos", medido 20 (L3042)

| Termo | Definição literal | Linha |
|---|---|---|
| **Biogás** | "mistura gasosa da digestão anaeróbia, com metano, dióxido de carbono, umidade e contaminantes; não é injetável em rede." | L3045 |
| **Biometano** | "biogás purificado até a especificação da agência, apto a substituir gás natural." | L3046 |
| **Digestão anaeróbia** | "decomposição biológica de matéria orgânica na ausência de oxigênio, produzindo biogás e digestato." | L3047 |
| **Digestato** | "resíduo estabilizado da digestão; tem valor agronômico e exige destino definido." | L3048 |
| **Substrato** | "matéria orgânica alimentada ao biodigestor; sua composição e continuidade determinam a produção." | L3049 |
| **Vinhaça** | "efluente da destilação de etanol, rico em matéria orgânica e nutrientes; usada em fertirrigação ou como substrato." | L3050 |
| **Torta de filtro** | "resíduo da clarificação do caldo; usada como fertilizante ou como substrato de biodigestão." | L3051 |
| **Dejeto animal** | "resíduo de criação confinada; substrato de alta disponibilidade em regiões de proteína animal." | L3052 |
| **Aterro sanitário** | "fonte de biogás com curva de geração decrescente ao longo do tempo, e não linear." | L3053 |
| **Estação de tratamento de esgoto** | "fonte de biogás de saneamento, com regime distinto do agropecuário e resolução própria." | L3054 |
| **Purificação** | "conjunto de operações que remove dióxido de carbono, umidade e contaminantes do biogás até a especificação de biometano." | L3055 |
| **Sulfeto de hidrogênio** | "contaminante corrosivo do biogás, cuja remoção é etapa obrigatória da purificação." | L3056 |
| **Siloxano** | "contaminante que danifica equipamento de queima; crítico em biogás de aterro e de esgoto." | L3057 |
| **Nm³** | "metro cúbico normal, volume de gás em condições de referência definidas; unidade padrão do setor." | L3058 |
| **PCI** | "poder calorífico inferior, energia liberada na queima sem recuperar o calor latente da água formada." | L3059 |
| **PCS** | "poder calorífico superior, que inclui esse calor latente; usar um no lugar do outro distorce a conta de energia." | L3060 |
| **Bio-GNC** | "biometano comprimido, transportado em carreta para cliente sem acesso a gasoduto." | L3061 |
| **Bio-GNL** | "biometano liquefeito, com densidade energética maior e processo intensivo em energia." | L3062 |
| **Injeção em rede** | "entrega do biometano na malha de gás natural, exigindo qualidade, ponto de conexão e capacidade disponíveis." | L3063 |
| **Raio econômico de coleta** | "distância máxima em que o transporte do substrato ainda é compatível com a economia do projeto." | L3064 |

### Família 06 · Bioeletricidade e cogeração — declarado "20 termos", medido 20 (L3068)

| Termo | Definição literal | Linha |
|---|---|---|
| **Bioeletricidade** | "eletricidade gerada a partir de biomassa; em 2025 respondeu por 8,5% da matriz elétrica brasileira, em ano-calendário." | L3071 |
| **Bagaço** | "fibra remanescente da moagem da cana; combustível interno da usina e insumo disputado por múltiplos destinos." | L3072 |
| **Palha** | "folhas e ponteiros deixados no campo pela colheita mecanizada; recurso energético com custo agronômico de retirada." | L3073 |
| **Licor preto** | "subproduto do cozimento da madeira na produção de celulose, recuperado em caldeira; segunda maior fonte da bioeletricidade e sem sazonalidade de safra." | L3074 |
| **Cogeração** | "produção combinada de eletricidade e calor útil a partir do mesmo combustível." | L3075 |
| **Caldeira de alta pressão** | "equipamento que eleva a eficiência de conversão e aumenta o excedente exportável por tonelada de bagaço." | L3076 |
| **Turbina de contrapressão** | "turbina que descarrega vapor em pressão útil ao processo, priorizando o calor sobre a eletricidade." | L3077 |
| **Turbina de condensação** | "turbina que maximiza a geração elétrica, usada quando há excedente de fibra além da demanda de processo." | L3078 |
| **Vapor de processo** | "vapor consumido pela própria fábrica; primeiro chamado sobre o bagaço e não negociável." | L3079 |
| **Autoconsumo** | "parcela da energia gerada consumida internamente; a diferença entre energia gerada e energia exportada." | L3080 |
| **Excedente exportável** | "energia que sobra após autoconsumo e perdas e efetivamente entra na rede; a única que gera receita de venda de energia." | L3081 |
| **Potência instalada** | "capacidade nominal do conjunto de geração, em MW; não descreve nenhuma entrega." | L3082 |
| **Energia gerada** | "produção bruta ao longo dos dias efetivos de operação, em MWh." | L3083 |
| **Energia exportada** | "energia efetivamente entregue à rede; terceira e última das três grandezas." | L3084 |
| **Fator de capacidade** | "energia entregue dividida pelo produto entre potência instalada e as horas do período; em cogeração sazonal, o anual e o de safra divergem muito." | L3085 |
| **Disponibilidade** | "fração das horas em que a planta esteve apta a gerar, descontadas manutenção e falhas." | L3086 |
| **Sazonalização** | "repartição declarada do montante contratado ao longo dos meses do ano; cláusula essencial em contrato de fonte sazonal." | L3087 |
| **Modulação** | "repartição do montante dentro de períodos menores que o mês, conforme o perfil acordado." | L3088 |
| **Complementaridade sazonal** | "coincidência entre a entrega de uma fonte e o período de menor entrega de outra; é o que torna a cogeração a bagaço complemento da hidrologia." | L3089 |
| **Curtailment** | "restrição de geração imposta por limitação da rede; reduz energia entregue sem reduzir a potência instalada." | L3090 |

### Família 07 · Política, certificação e carbono — declarado "24 termos", medido 24 (L3094)

| Termo | Definição literal | Linha |
|---|---|---|
| **RenovaBio** | "Política Nacional de Biocombustíveis, instituída pela Lei nº 13.576/2017." | L3097 |
| **CBIO** | "crédito de descarbonização, ativo negociado que representa uma tonelada de dióxido de carbono equivalente evitada segundo a metodologia do programa." | L3098 |
| **Meta nacional** | "meta anual compulsória de redução de emissões fixada por resolução do conselho para o conjunto do mercado de combustíveis." | L3099 |
| **Meta individual** | "desdobramento da meta nacional por distribuidor, calculado pela agência conforme participação no mercado fóssil; sua soma pode divergir da meta nacional." | L3100 |
| **Parte obrigada** | "distribuidor de combustível sujeito a meta individual e à obrigação de aposentar créditos." | L3101 |
| **Parte não obrigada** | "agente que detém créditos sem obrigação de aposentá-los, tipicamente o próprio produtor certificado." | L3102 |
| **Emissor primário** | "produtor ou importador certificado apto a solicitar a emissão de créditos sobre volume elegível comercializado." | L3103 |
| **Escriturador** | "instituição responsável pelo registro e pela escrituração dos créditos emitidos." | L3104 |
| **Aposentadoria** | "retirada definitiva do crédito de circulação, que é o ato que comprova o cumprimento da meta." | L3105 |
| **Nota de eficiência** | "nota de eficiência energético-ambiental atribuída à unidade produtora certificada, derivada da intensidade de carbono da rota." | L3106 |
| **RenovaCalc** | "ferramenta oficial de cálculo de intensidade de carbono de ciclo de vida usada na certificação." | L3107 |
| **Intensidade de carbono** | "emissões por unidade de energia, em gramas de CO₂ equivalente por MJ; depende da rota e da fronteira, não do nome do combustível." | L3108 |
| **Firma inspetora** | "entidade credenciada que audita os dados da unidade produtora para fins de certificação." | L3109 |
| **Certificado da produção eficiente** | "documento que habilita a unidade produtora a emitir créditos, com validade e monitoramento definidos em norma." | L3110 |
| **CGOB** | "certificado de garantia de origem de biometano, instrumento de rastreabilidade do programa de descarbonização do mercado de gás natural." | L3111 |
| **ACO** | "agente certificador de origem, entidade credenciada pela agência para certificar produtores de biometano." | L3112 |
| **Lastro** | "base física e documental que sustenta a emissão de um certificado; sem lastro não há emissão." | L3113 |
| **Dupla contagem** | "atribuição da mesma redução de emissões a mais de um comprador ou programa; combatida por declaração de emissão concomitante e por definição contratual de titularidade." | L3114 |
| **Adicionalidade** | "condição de que a redução não teria ocorrido na ausência do incentivo; questão central em atributos de metano capturado." | L3115 |
| **Atributo ambiental** | "direito econômico associado à característica ambiental de um produto, separável da molécula e negociável de forma independente." | L3116 |
| **Combustível do Futuro** | "Lei nº 14.993/2024, que reúne os programas de aviação sustentável, diesel verde, biometano, combustíveis sintéticos e captura de carbono, e fixa tetos de mistura." | L3117 |
| **ProBioQAV** | "Programa Nacional de Combustível Sustentável de Aviação, criado pela mesma lei." | L3118 |
| **CNPE** | "Conselho Nacional de Política Energética; fixa por resolução os percentuais de mistura obrigatória e as metas anuais de descarbonização." | L3119 |
| **Conteúdo obrigatório** | "política que determina a presença mínima de um produto dentro de outro; cria e dimensiona mercado por ato administrativo." | L3120 |

### Família 08 · Economia e leitura de projeto — declarado "20 termos", medido 20 (L3124)

| Termo | Definição literal | Linha |
|---|---|---|
| **Demanda derivada** | "demanda que não decorre de escolha do consumidor, mas do produto entre volume de um bem e um percentual fixado por regra." | L3127 |
| **Arbitragem** | "decisão contínua entre destinos concorrentes do mesmo insumo, movida por preço relativo e limitada por restrição física." | L3128 |
| **Capacidade de alternância** | "faixa dentro da qual a unidade consegue deslocar produção entre produtos; é a restrição que o preço relativo não mostra." | L3129 |
| **Custo de oportunidade** | "valor do destino alternativo abandonado; num insumo com múltiplos destinos, é o que torna "resíduo gratuito" uma hipótese e não um fato." | L3130 |
| **Coproduto** | "produto secundário com valor econômico próprio, que exige mercado, especificação e logística para se realizar como receita." | L3131 |
| **DDGS** | "grãos secos de destilaria com solúveis, coproduto proteico da rota de milho destinado a ração animal." | L3132 |
| **Balanço de massa** | "conta que fecha entrada, rendimento, autoconsumo, perdas, estoque e venda; primeiro documento de qualquer análise séria de bioenergia." | L3133 |
| **Rendimento** | "produto obtido por unidade de insumo; rendimento de laboratório e rendimento comercial não são a mesma grandeza." | L3134 |
| **Ramp-up** | "período entre a partida e o regime de operação estável; rota nova costuma ter ramp-up longo e utilização baixa nesse intervalo." | L3135 |
| **Utilização** | "fração da capacidade efetivamente usada num período; distingue planta habilitada de planta operando." | L3136 |
| **Capacidade autorizada** | "capacidade habilitada por ato administrativo; não é produção nem venda." | L3137 |
| **Volume contratado** | "volume com contrato de compra firmado; único dos estágios que gera receita previsível." | L3138 |
| **Potencial técnico-econômico** | "resultado de exercício de mapeamento que responde onde e sob quais condições algo seria possível; não é previsão nem capacidade." | L3139 |
| **Régua de maturidade** | "sequência memorando, estudo conceitual, planta anunciada e planta com contrato e financiamento; estágios que não se somam na mesma tabela." | L3140 |
| **Risco de base** | "descolamento entre o preço de referência usado em proteção e o preço físico efetivamente realizado." | L3141 |
| **Take-or-pay** | "cláusula que obriga o comprador a pagar um mínimo independentemente do volume retirado." | L3142 |
| **Margem unitária** | "preço líquido menos matéria-prima, conversão, logística e custos variáveis, por unidade física do produto." | L3143 |
| **Preço entregue** | "preço no ponto de entrega ao cliente, incluindo frete, compressão ou tancagem, perdas e tributos; única base válida para comparar produtos." | L3144 |
| **Parte interessada** | "agente com interesse econômico declarado na variável descrita; citável com nome e data como posição, nunca como origem de número." | L3145 |
| **Ressalva de comparabilidade** | "advertência do que precisa ser igualado antes de uma comparação significar alguma coisa; acompanha toda comparação entre rotas." | L3146 |

## Divergências (6)

### div-m14-caso-parte — Caso numerado como "Parte 14"

Classe: fonte × decisão de produto.

- **Leitura A** (§Caso marcador): "§Caso · Operação A — Parte 14"
- **Leitura B** (P17 (decisões do Founder)): "Não existe "Parte 1"; título "Caso — Operação A""

Nota: A fonte trata a Operação A como série de 14 partes espalhadas pelos módulos. O texto fica literal; a camada de produto aplica o P17.
Decisão: `null` (não resolvido).

### div-m14-caso-familia — Trava de anonimização fala em "caso da família"

Classe: fonte × fonte.

- **Leitura A** (§Ref (Documentos internos)): "GridAlpha — War Room, Quatro Travas de Segurança. Linguagem pública defensável; dados regulatórios verificados em fonte primária; anonimização rigorosa do caso da família; linguagem de oportunidade em vez de promessa."
- **Leitura B** (§Caso): "Caso sempre anonimizado: Operação A — mineração em Minas Gerais"

Nota: A descrição das travas cita "o caso da família", mas o caso do módulo é uma operação de mineração. Pode ser herança de outro material; não resolvido.
Decisão: `null` (não resolvido).

### div-m14-ex13-inst08 — Ex 13 × INST·08: densidade energética e unidade do diferencial

Classe: fonte × fonte.

- **Leitura A** (Ex 13): "Uma rota vende 100 milhões de litros elegíveis, com 21,1 MJ/L e diferencial de intensidade de carbono de 55 gCO₂e/MJ. Qual a ordem de grandeza de créditos, e por que é apenas teto? → 100.000.000 × 21,1 × 55 = 116,05 bilhões de gramas, ou cerca de 116.050 toneladas de CO₂ equivalente — ordem de grandeza"
- **Leitura B** (script INST·08): "rota e1g: mj 21.3, ref 87.4; evit = energiaMJ*ref*(dic/100)/1e6 — o diferencial entra como % da referência fóssil, não como gCO₂e/MJ (o rótulo do campo diz gCO₂e/MJ)"

Nota: Com os padrões do INST·08 (100 mi L, 55, rota e1g) o painel dá ~102.389 t, o Ex 13 dá 116.050 t para os "mesmos" 100 mi L e 55. Ver instrumentos.json (m14-inst-08).
Decisão: `null` (não resolvido).

### div-m14-quiz-placar — Placar do quiz tem só duas faixas

Classe: fonte × fonte (sem conflito).

- **Leitura A** (§Quiz lede): "O critério é oito de dez."
- **Leitura B** (script): "acertos>=8 → "Critério atingido..."; senão → "Abaixo do critério de oito acertos...""

Nota: Prosa e script concordam em 8/10 neste módulo. Registrado porque P18 impede que o limiar declare domínio ou libere trilha; a mensagem "Critério atingido. A matéria sustenta uma conversa de uma hora…" afirma competência.
Decisão: `null` (não resolvido).

### div-m14-lex-familia-04 — Nome da Família 04 do glossário

Classe: fonte × catálogo.

- **Leitura A** (fonte): "Família 04 · Biodiesel e combustíveis de rota fóssil substituída"
- **Leitura B** (catálogo canônico): "Biodiesel (20 — …)"

Nota: O catálogo encurta o nome da família.
Decisão: `null` (não resolvido).

### div-m14-ex-familias — Famílias do §Ex: lede × tags

Classe: fonte × fonte.

- **Leitura A** (§Ex lede): "identificação de base temporal; classificação de rota; separação de grandeza; estado de política"
- **Leitura B** (tags dos 14): "Base temporal; Grandeza; Estado de política; Rota; Cálculo; Síntese"

Nota: O lede declara quatro famílias; as tags usam seis rótulos (há "Cálculo" e "Síntese", que não são famílias do lede). Ver também div-m14-quatro-defeitos em modulo.json.
Decisão: `null` (não resolvido).

## Contagens

| Item | Contagem |
|---|---|
| caso_perguntas_diagnosticas | 5 |
| caso_colunas_diagnostico | 3 |
| caso_itens_diagnostico | 9 |
| quiz_questoes | 10 |
| quiz_alternativas | 40 |
| quiz_faixas_placar | 2 |
| checklist_itens | 26 |
| checklist_cronometrados | 1 |
| checklist_orais_ou_livres | 3 |
| exercicios | 14 |
| exercicios_soltos | 14 |
| exercicios_identicos_ao_codigo | 14 |
| referencias | 34 |
| referencias_por_grupo | 10 + 10 + 8 + 3 + 3 |
| referencias_com_url | 0 |
| referencias_com_data_por_extenso | 12 |
| glossario_termos | 158 |
| glossario_familias | 8 |
| glossario_ausentes_no_codigo | 158 |
| divergencias | 6 |

## Verificação

Verificação adversarial independente (2026-09-17), com parser próprio, sem reaproveitar os extratores:
- **Verbatim.** Todas as strings de conteúdo dos três JSONs foram testadas contra a fonte normalizada (com e sem tags,
  entidades decodificadas, escapes JS desfeitos). Só sobraram saídas calculadas em tempo de execução (esperado) e
  anotações. Quiz: 10/10 questões, 40/40 alternativas, gabarito (C A D B D A C B D C) e 10/10 explicações idênticos ao
  literal `var Q` avaliado. Checklist: 26/26 itens idênticos (html e texto). §Ex: 14/14 idênticos ao código.
  Glossário: 158/158 termos na ordem da fonte; 13 homônimos recalculados contra `alexandria-glossario.ts`.
- **Origens.** Todas as origens com `trecho_inicial` caem a ±3 linhas de uma ocorrência na fonte.
- **Contagens recalculadas no HTML.** 14 `details` no §Ex, 26 `li` em `ul.ck`, 34 `li` no §Ref (10+10+8+3+3; 12 com
  data por extenso; 0 URL), 18 erros, 8 blocos de voz, 5 perguntas do caso, 2 faixas de placar: todas conferem.
- **Correção 1 (lacuna).** Faltava registrar os 6 exercícios embutidos nas fichas de rota da Aula 08
  (`div.emp-row.aberto`, L2357–L2417) e a instrução da fonte (L2344). Acrescentados em
  `exercicios.exercicios_embutidos_em_aula` (JSON) e na subseção acima, com origem. As contagens do §Ex (14) não
  mudam.
- **Atenção.** Esta seção e a subseção acima foram escritas à mão. Se `m14_md.mjs` rodar de novo, reponha as duas.
