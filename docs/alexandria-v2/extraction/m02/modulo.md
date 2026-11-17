# M02 · grupo "modulo"

Fonte (só leitura): `C:/dev/GridAlpha v2/Alexandria modulos/alexandria_modulo02.html` (3843 linhas). Saída: [`modulo.json`](modulo.json).
Camada: **fonte**. Todo texto entre aspas ou em tabela saiu do JSON, que saiu do HTML por script
(`extratores/`); nada foi digitado. `L` = linha aproximada no HTML-fonte. Divergências ficam com as duas
leituras e nenhuma é resolvida aqui (P17–P24 valem só na camada de produto).

## Contagens

| Item | Valor |
|---|---|
| secoes | 20 |
| aulas | 10 |
| aparatos | 10 |
| capacidades | 8 |
| criterio_passagem_itens | 2 |
| perguntas_map | 10 |
| hero_meta | 4 |
| criterios_literais | 5 |
| mensagens_placar | 4 |
| laboratorios | 0 |
| erros_comuns | 8 |
| perguntas_relampago | 30 |
| roteiro_oral_paragrafos | 7 |
| callouts | 21 |
| callouts_numeros_vivos | 4 |
| tres_niveis_blocos | 6 |
| subsecoes_por_aula | 5, 5, 5, 4, 4, 4, 3, 6, 4, 6 |
| ocorrencias_GridAlpha_no_arquivo | 16 |
| tres_niveis_paineis | 18 |
| tres_niveis_paineis_no_codigo | 0 |
| divergencias | 15 |
| lacunas | 11 |

## Identidade

| Campo | Literal | Origem |
|---|---|---|
| <title> | Alexandria · Módulo 02 — Como Funciona uma Rede Elétrica | L6 |
| eyebrow | Nível 1 · Fundamentos Universais · Módulo 02 | L1323 |
| h1 (título) | A rede elétrica: uma máquina continental de equilíbrio em tempo real — e por que ela define o que sua empresa paga. | L1324 |
| subtítulo | No Módulo 01 você aprendeu as grandezas: kW, kWh, kVA, fator de carga, fator de potência. Este módulo sobe uma camada: o sistema físico que carrega essas grandezas — como ele é organizado, operado, protegido e cobrado. Ao final, você entende por que existe ONS, por que existem reservas e serviços ancilares, por que apagões se propagam em segundos, e por que o limite de uma linha de transmissão a mil quilômetros vira custo na fatura de uma mineradora em Minas Gerais. | L1325 |
| hero-meta · Tempo estimado | 4 – 5 horas | L1329 |
| hero-meta · Nível do currículo | Fundamentos · Nível 1 | L1333 |
| hero-meta · Produtos GridAlpha | Brazil Pulse · CLE · PQA | L1337 |
| hero-meta · Próximo módulo | 03 · Tecnologias de Geração | L1341 |
| cabeçalho | GridAlpha · Alexandria Library · Módulo 02 · Cobaia Zero v2.0 | L1241 |
| rodapé | ALEXANDRIA · GridAlpha Energy Intelligence · Módulo 02 · Como Funciona uma Rede Elétrica · Nível 1 — Fundamentos Universais · v2.0 / Produção própria sobre fontes primárias (ONS, ANEEL, CCEE, EPE, IPEA) e canônicas. Instrumentos interativos são didáticos — não substituem modelos oficiais nem dados vigentes. Linguagem responsável em todo o material: ordens de grandeza com atribuição, números vivos sinalizados para verificação, nenhuma economia prometida — apenas oportunidades potenciais a validar. / Próximo: Módulo 03 · Tecnologias de Geração — o cardápio completo, de Itaipu ao telhado. | L3100 |

**Horas.** "4 – 5 horas" (L1329); `min`/`max` = null. A fonte declara só a string do hero-meta "Tempo estimado". Os números não foram convertidos aqui (ausência declarada). O catálogo canônico escreve "4–5 h declaradas"; alexandria-blocks.ts traz estimatedHoursMin/Max = null para bloco-02.

**Eixos.** null. A fonte não declara "eixos" do módulo. O mais próximo é a tabela de "cinco consequências estruturais" do § 00 (ver tese.consequencias), que a própria fonte chama de "esqueleto de todo o resto do currículo" — não é rotulada como eixo e não foi promovida.

**Catálogo canônico (P24).** Título "Como Funciona uma Rede Elétrica"; trilha "Fundamentos Universais — declarada, hero e rodapé."; escala
"10 aulas · 9 instrumentos · 65 termos · 8 exercícios · 30 perguntas-relâmpago · 4–5 h declaradas.". O título curto da fonte (`<title>` e rodapé) coincide com o catálogo; o h1 é
descritor editorial. Código (`src/lib/data/alexandria-blocks.ts` L8): title
"Como Funciona uma Rede Elétrica", level 1, track universal, illustrationPrefix
"red-", priority "confirmar", horas null/null.

## Tese (§ 00)

- **h2:** "Uma única restrição física explica todo o setor elétrico." (L1354)
- **lead:** "Eletricidade, em escala de rede, não se armazena de forma economicamente significativa. Tudo o que parece burocracia no setor — o ONS decidindo quem gera, o preço que muda de hora em hora, usinas paradas "de reserva", encargos com siglas — existe por causa dessa única frase. Quem entende a restrição entende o desenho. Quem decora o desenho sem entender a restrição vira papagaio de sigla." (L1356)
- **m02-tese-p1:** "Uma rede elétrica não transporta energia como um caminhão transporta minério. Não existe estoque no meio do caminho. A cada segundo, a soma de tudo que está sendo gerado precisa igualar a soma de tudo que está sendo consumido, mais as perdas:" (L1358)
- **m02-tese-p2:** "Vale também separar duas coisas que o noticiário mistura: rede elétrica é a infraestrutura físico-operacional — usinas, linhas, subestações, proteção, centros de operação. Mercado elétrico é o conjunto de regras comerciais — quem compra, quem vende, como se liquida. A rede obedece às leis da física; o mercado obedece a regras econômicas e regulatórias. Quando as regras ignoram a física, aparecem os sintomas: congestionamento, despacho fora da ordem econômica, cortes de geração e custos que ninguém sabe explicar na fatura. Este módulo é sobre a física e a operação; os blocos seguintes entram no mercado." (L1365)
- **m02-tese-p3:** "Da restrição central derivam cinco consequências estruturais. Memorize as cinco: elas são o esqueleto de todo o resto do currículo." (L1367)
- **fórmula:** "Geração = Carga + Perdas · a cada instante" · "Quando essa igualdade se rompe, a frequência sai dos 60 Hz — e o sistema reage sozinho" (L1360)
- **citação:** "Uma rede elétrica não é um fio entre uma usina e uma tomada. É uma máquina continental de equilíbrio em tempo real, onde geração, consumo, tensão, frequência, reservas e proteção precisam funcionar juntos a cada segundo." — Alexandria Library · GridAlpha (L1384)

| # | Consequência física | Instituição ou cobrança que ela cria | Origem |
|---|---|---|---|
| 1 | O equilíbrio geração–consumo é instantâneo e obrigatório | Existe um operador central — o ONS — com autoridade para despachar usinas em tempo real | L1375 |
| 2 | A rede é dimensionada para o pico, não para a média | Existe cobrança de capacidade — a demanda contratada do Módulo 01 é a versão de varejo dessa lógica; reservas e serviços ancilares são a versão de sistema | L1376 |
| 3 | Localização importa: fios têm limite e perdas | Existem submercados, sinal locacional na tarifa de transmissão, congestionamento e redespacho | L1377 |
| 4 | Falha se propaga na velocidade da física, não da burocracia | Existem critério N-1, proteção automática e ERAC — o sistema se defende em milissegundos, sem humano no circuito | L1378 |
| 5 | Energia e infraestrutura são produtos diferentes | Existem cobranças separadas: energia (mercadoria) vs fio (TUSD/TUST) vs encargos (políticas) | L1379 |

## Resultado esperado e critério de passagem

A fonte do M02 não tem um h4 "Resultado esperado". O bloco equivalente no § 00 é o h4 "O critério de domínio deste módulo" + parágrafo com dois itens numerados (critério de passagem) + "Além disso, ao final você consegue:" + lista de 8 itens. Os dois grupos estão abaixo, separados como a fonte os separa.

**h4:** "O critério de domínio deste módulo" (L1389)

**Critério de passagem** (L1389, P14: sem_consulta, producao_oral_ou_livre, desenho):
"Você passa no Bloco 2 quando consegue, sem consultar nada: (1) explicar por que um apagão em uma região pode atingir outra região em segundos; e (2) desenhar num guardanapo a cadeia geração → transmissão → distribuição → consumo, com as tensões típicas e quem é dono de cada trecho. O guardanapo é o teste honesto: se não cabe nele, você ainda não destilou."

**Capacidades** — preâmbulo "Além disso, ao final você consegue:":

| Id | Capacidade (literal) | P14 (inferido) | Origem |
|---|---|---|---|
| m02-cap-01 | Explicar por que transmissão usa alta tensão com a matemática de perdas, não com frase decorada. | producao_oral_ou_livre | L1394 |
| m02-cap-02 | Descrever o que o ONS faz, o que ele não faz, e como o plano mensal vira ordem em tempo real (PMO → PDO → tempo real). | producao_oral_ou_livre | L1395 |
| m02-cap-03 | Explicar o despacho por ordem de mérito, o valor da água, e por que a usina mais barata nem sempre é a despachada. | producao_oral_ou_livre | L1396 |
| m02-cap-04 | Diferenciar reserva girante, operativa e fria — e dizer por que reserva custa dinheiro mesmo parada. | producao_oral_ou_livre | L1397 |
| m02-cap-05 | Listar os principais serviços ancilares e conectar suporte de tensão ao triângulo de potência do Módulo 01. | producao_oral_ou_livre | L1398 |
| m02-cap-06 | Narrar os dez segundos após a perda de uma grande usina: inércia, regulação primária, CAG, ERAC. | producao_oral_ou_livre | L1399 |
| m02-cap-07 | Explicar TUSD e TUST para um diretor financeiro — e por que migrar ao mercado livre não elimina a conta da distribuidora. | producao_oral_ou_livre | L1400 |
| m02-cap-08 | Sustentar cinco minutos de conversa sobre os apagões de 2001, 2009 e 2023 — e sobre os cortes de geração renovável no Nordeste — sem repetir mito de notícia. | producao_oral_ou_livre, cronometrado | L1401 |

## § MAP — perguntas das aulas

h2 "Dez aulas, da física ao custo." · intro: "O módulo percorre um arco deliberado: começa na anatomia física da rede, atravessa a operação em tempo real — despacho, reservas, estabilidade — e termina onde a infraestrutura encosta no dinheiro. Cada aula responde a uma pergunta que aparece em conversa real: com diretor de energia, com gestor de utilidades, com investidor de infraestrutura."

| Aula | Tema | Pergunta | Origem |
|---|---|---|---|
| 01 | Anatomia da rede e o SIN | Por que a energia atravessa quatro camadas — e quem é dono de cada uma? | L1430 |
| 02 | Alta tensão, HVDC e os limites do fio | Por que 500 kV? E por que nenhuma linha transporta energia infinita? | L1431 |
| 03 | Subestações e proteção | O que acontece nas articulações da rede — e como uma proteção mal coordenada vira apagão? | L1432 |
| 04 | Carga, curva de carga e curva líquida | Como a demanda respira ao longo do dia — e por que o pôr do sol virou a hora mais tensa do operador? | L1433 |
| 05 | Despacho e ordem de mérito | Quem decide qual usina liga agora — e por que a mais barata nem sempre é a escolhida? | L1434 |
| 06 | ONS, centros de operação e horizontes | Como o plano do mês vira ordem no segundo — e o que uma sala em Brasília enxerga? | L1435 |
| 07 | Reservas e serviços ancilares | Por que o sistema paga usinas para ficarem prontas — e o que mantém os bastidores funcionando? | L1436 |
| 08 | Estabilidade, inércia e a anatomia de um apagão | O que acontece nos dez segundos após a perda de uma grande usina — e como uma falha local vira cascata? | L1437 |
| 09 | Perdas técnicas e não técnicas | Por que você paga pela energia que a rede perde antes de chegar em você? | L1438 |
| 10 | Da física ao custo: fio, congestionamento e curtailment | Como o limite de uma linha vira tarifa, encargo e corte de geração? | L1439 |

## Roteiro (20 seções, ordem da fonte)

| # | Marcador | Rótulo | h2 | Subseções | Instrumentos | Exercícios com tag | Origem |
|---|---|---|---|---|---|---|---|
| 1 | § 00 | Filosofia do módulo | Uma única restrição física explica todo o setor elétrico. |  |  |  | L1353 |
| 2 | § MAP | Mapa das aulas | Dez aulas, da física ao custo. |  |  |  | L1416 |
| 3 | Aula 01 | Anatomia da rede e o SIN | Quatro camadas, um organismo. | 5 | INST · 01 |  | L1451 |
| 4 | Aula 02 | Alta tensão, HVDC e os limites do fio | A matemática que desenha o sistema. | 5 | INST · 02 | Ex · 01 · Aula 02, Ex · 02 · Aula 02 | L1576 |
| 5 | Aula 03 | Subestações e proteção | As articulações do sistema. | 5 | INST · 03 |  | L1697 |
| 6 | Aula 04 | Carga, curva de carga e curva líquida | A demanda respira — e o operador respira junto. | 4 | INST · 04 |  | L1771 |
| 7 | Aula 05 | Despacho e ordem de mérito | Quem liga agora — e por quê. | 4 | INST · 05 | Ex · 03 · Aula 05 | L1849 |
| 8 | Aula 06 | ONS, centros de operação e horizontes | A sala que enxerga um continente. | 4 |  | Ex · 04 · Aula 06 | L1966 |
| 9 | Aula 07 | Reservas e serviços ancilares | Os bastidores que ninguém vê — e todo mundo paga. | 3 | INST · 06 |  | L2041 |
| 10 | Aula 08 | Estabilidade, inércia e a anatomia de um apagão | Os dez segundos que decidem tudo. | 6 | INST · 07 | Ex · 05 · Aula 08, Ex · 06 · Aula 08 | L2151 |
| 11 | Aula 09 | Perdas técnicas e não técnicas | A energia que some — e quem paga por ela. | 4 | INST · 08 |  | L2273 |
| 12 | Aula 10 | Da física ao custo: fio, congestionamento e curtailment | Onde a infraestrutura encosta no dinheiro. | 6 | INST · 09 | Ex · 07 · 3 níveis · Aula 10, Ex · 08 · Síntese · Aula 10 | L2355 |
| 13 | § Caso | Aplicação prática | Operação A — a mesma fatura, agora com a lente da rede. |  |  |  | L2468 |
| 14 | § Erros | Vacina contra mitos | Oito erros que desqualificam em uma frase. |  |  |  | L2544 |
| 15 | § Ex | Exercícios com gabarito | Oito exercícios. Gabarito escondido. |  |  |  | L2570 |
| 16 | § Quiz | Verificação interativa de domínio | Dez perguntas. Resposta imediata. |  |  |  | L2674 |
| 17 | § Voz | Domínio oral | Se você não consegue falar, ainda não sabe. |  |  |  | L2693 |
| 18 | § Final | Checklist de domínio | O critério de conclusão. |  |  |  | L2759 |
| 19 | § Lex | Glossário expansível | Glossário Alexandria. |  |  |  | L2792 |
| 20 | § Ref | Fontes primárias e canônicas | Onde verificar cada afirmação. |  |  |  | L3066 |

### Aulas × código (P8)

Contagem: fonte 10 · h2 do § MAP "Dez aulas, da física ao custo." ·
MODULO_02_AULAS 10 · AULAS_POR_BLOCO
10 · catálogo 10 ·
totalInModule 10. **Todos concordam em 10.**

| Aula | Id código | Título = | Subtítulo = | Subseções (fonte/código, =) | Lead = | Instr. (fonte → código) | Três níveis na fonte |
|---|---|---|---|---|---|---|---|
| Aula 01 | aula-02-01 | sim | sim | 5/5 sim | sim | INST · 01 → m02-inst-01 | sim (não portado) |
| Aula 02 | aula-02-02 | sim | sim | 5/5 sim | sim | INST · 02 → m02-inst-02 | — |
| Aula 03 | aula-02-03 | sim | sim | 5/5 sim | sim | INST · 03 → m02-inst-03 | — |
| Aula 04 | aula-02-04 | sim | sim | 4/4 sim | sim | INST · 04 → m02-inst-04 | — |
| Aula 05 | aula-02-05 | sim | sim | 4/4 sim | sim | INST · 05 → m02-inst-05 | sim (não portado) |
| Aula 06 | aula-02-06 | sim | sim | 4/4 sim | sim | — → — | sim (não portado) |
| Aula 07 | aula-02-07 | sim | sim | 3/3 sim | sim | INST · 06 → m02-inst-06 | sim (não portado) |
| Aula 08 | aula-02-08 | sim | sim | 6/6 sim | sim | INST · 07 → m02-inst-07 | sim (não portado) |
| Aula 09 | aula-02-09 | sim | sim | 4/4 sim | sim | INST · 08 → m02-inst-08 | — |
| Aula 10 | aula-02-10 | sim | sim | 6/6 sim | sim | INST · 09 → m02-inst-09 | sim (não portado) |

Catálogo × fonte (tabela de aulas): as 10 linhas batem com rótulo e h2 da fonte.

## Critérios literais (P14 / P18)

Várias formas literais de critério coexistem (§ 00, § Quiz, § Final, § Voz, placar do script — este dentro de m02-crit-quiz.mensagens_do_script). A 5ª entrada da lista (m02-crit-ex) não é critério: registra que o § Ex não declara limiar. Registradas lado a lado, nenhuma escolhida (P18: nenhum limiar legado declara domínio nem trava trilha).

| Id | Seção | Tipo | Texto literal | P14 | Origem |
|---|---|---|---|---|---|
| m02-crit-00 | § 00 | criterio_de_passagem_oral_e_desenho | Você passa no Bloco 2 quando consegue, sem consultar nada: (1) explicar por que um apagão em uma região pode atingir outra região em segundos; e (2) desenhar num guardanapo a cadeia geração → transmissão → distribuição → consumo, com as tensões típicas e quem é dono de cada trecho. O guardanapo é o teste honesto: se não cabe nele, você ainda não destilou. | sem_consulta, producao_oral_ou_livre, desenho | L1389 |
| m02-crit-quiz | § Quiz | criterio_quiz | Quiz de fluência. Cada resposta tem feedback explicativo. O critério de domínio do módulo é acertar pelo menos 8 de 10 sem consultar. | automatizavel, sem_consulta, P18_limiar_nao_e_evidencia | L2676 |
| m02-crit-final | § Final | criterio_conclusao | Você só passa neste módulo se conseguir, sem consultar nenhum material, fazer todas as ações abaixo. Marque ao longo do estudo. Quando todas estiverem marcadas — e o quiz fechar em 8/10 ou mais — você está pronto para o Módulo 03 — Tecnologias de Geração. | sem_consulta, autodeclarado_sem_registro | L2762 |
| m02-crit-voz | § Voz | criterio_oral | A regra Alexandria: todo conceito sobrevive em voz alta ou volta para a fila de estudo. Duas ferramentas: trinta perguntas-relâmpago — responda sem travar, sem consultar — e um roteiro de cinco minutos para gravar, ouvir e refazer de cabeça. | oral, sem_consulta, cronometrado | L2695 |
| m02-crit-ex | § Ex | sem_criterio_numerico | Resolva antes de revelar. Os exercícios cobrem o arco completo do módulo — da física das perdas à conversa de Summit sobre curtailment. |  | L2572 |

**Mensagens do placar (script):**

| Condição | Mensagem | Origem |
|---|---|---|
| correct >= 9 | Domínio sólido. Pronto para o Módulo 03 — Tecnologias de Geração. | L3829 |
| correct >= 7 | Bom. Revise os pontos errados, depois avance para o próximo módulo. | L3830 |
| correct >= 5 | Domínio parcial. Volte às aulas onde errou antes de avançar. | L3831 |
| else (correct < 5) | Refaça o estudo. O critério de domínio é 8/10 — sem atalho. | L3832 |

## Laboratórios

Nenhum. A fonte do M02 não tem seção § Lab (zero marcadores com "Lab"; zero ocorrência de "LAB"). Os 9 instrumentos estão todos dentro de aulas (ver instrumentos.json). Ausência declarada, não preenchida.

## Voz e princípios

**§ Voz** — h2 "Se você não consegue falar, ainda não sabe."; lead "A regra Alexandria: todo conceito sobrevive em voz alta ou volta para a fila de estudo. Duas ferramentas: trinta perguntas-relâmpago — responda sem travar, sem consultar — e um roteiro de cinco minutos para gravar, ouvir e refazer de cabeça." (L2695).

**V.1 Trinta perguntas sem travar** (oral, sem consulta):

1. O que é uma rede elétrica? (L2699)
2. Qual a diferença entre rede elétrica e mercado elétrico? (L2700)
3. Qual a diferença entre transmissão e distribuição? (L2701)
4. Por que a transmissão usa alta tensão? (L2702)
5. O que é a Rede Básica? (L2703)
6. O que é o SIN e quais são os quatro subsistemas? (L2704)
7. O que são sistemas isolados? (L2705)
8. O que faz um transformador? E um disjuntor? (L2706)
9. Qual a diferença entre disjuntor e seccionadora? (L2707)
10. O que é um relé de proteção? (L2708)
11. O que é seletividade da proteção? (L2709)
12. O que é curva de carga? E curva líquida? (L2710)
13. O que é a rampa do fim da tarde e quem a vence? (L2711)
14. Por que geração precisa igualar consumo a cada instante? (L2712)
15. O que acontece com a frequência se falta geração? (L2713)
16. O que é despacho? E ordem de mérito? (L2714)
17. O que é o valor da água? (L2715)
18. Por que a usina mais barata nem sempre é despachada? (L2716)
19. O que o ONS faz — e cite três coisas que ele não faz. (L2717)
20. O que é PMO → PDO → tempo real? (L2718)
21. O que é reserva girante — e por que reserva custa dinheiro? (L2719)
22. O que são serviços ancilares? Dê três exemplos. (L2720)
23. O que é black start? (L2721)
24. O que é inércia e por que ela está diminuindo? (L2722)
25. O que é o critério N-1 — e por que ele não resolve tudo? (L2723)
26. Narre uma falha em cascata em cinco passos. (L2724)
27. O que é o ERAC? (L2725)
28. Qual a diferença entre perdas técnicas e não técnicas — e quem paga? (L2726)
29. O que são TUSD e TUST — e por que o livre continua pagando a distribuidora? (L2727)
30. O que é curtailment e por que ele cresceu no Nordeste? (L2728)

**V.2 Roteiro de cinco minutos** (oral, cronometrado) — "Leia em voz alta uma vez. Depois feche o material e refaça de cabeça — não decorado: reconstruído. Se travar num trecho, a aula correspondente ainda não está dominada."
Cartão: "Roteiro · "Como funciona a rede elétrica" em 5 minutos" · "Voz Alexandria — para gravar, ouvir e refazer"

> "Uma rede elétrica é o sistema que liga quem gera energia a quem consome — usinas, linhas de transmissão, subestações, redes de distribuição, proteção e centros de operação. A cadeia tem quatro camadas: geração, transmissão em alta tensão, distribuição e consumo. A transmissão usa tensões altíssimas por uma razão de física: para a mesma potência, dobrar a tensão corta a corrente pela metade — e as perdas, que crescem com o quadrado da corrente, caem a um quarto. (L2742)
>
> O ponto que organiza tudo é este: eletricidade, em escala de rede, não se armazena. A geração precisa igualar o consumo mais as perdas a cada instante. O medidor desse equilíbrio é a frequência: estável em 60 hertz, está tudo certo; caindo, falta geração; subindo, sobra. Dessa única restrição nascem o operador central, as reservas, os serviços ancilares e até os apagões. (L2743)
>
> Despacho é a decisão de quais usinas geram, quanto e quando. O critério de partida é a ordem de mérito — o mais barato entra primeiro. No Brasil tem uma camada a mais: a hidrelétrica não tem custo de combustível, mas tem custo de oportunidade — turbinar hoje é não ter água na estiagem. Esse valor da água é calculado por modelos, e é ele que posiciona a hidro na pilha. E a usina mais barata nem sempre é a despachada: restrição de transmissão e segurança elétrica furam a fila — às vezes uma térmica cara liga não porque é boa, mas porque é necessária onde está. (L2744)
>
> Quem rege isso é o ONS, que opera o Sistema Interligado Nacional — quatro subsistemas que também são os quatro submercados de preço. O ONS não vende energia, não define tarifa, não constrói linha: ele planeja e opera. O plano mensal vira programa diário, que vira ordem em tempo real, e depois análise do que ocorreu. (L2745)
>
> Como não há estoque, o sistema vive de margens: reserva girante já sincronizada, pronta em segundos; operativa em minutos; fria em horas. E de serviços de bastidor — controle de frequência, suporte de tensão com potência reativa, black start para renascer depois de um colapso. Reserva custa dinheiro mesmo parada, e deve custar: é o seguro do sistema. (L2746)
>
> Apagão quase nunca é só falta de usina. Uma linha sai, o fluxo migra para as vizinhas, que sobrecarregam e desarmam; frequência e tensão se deterioram; esquemas automáticos cortam carga para salvar o resto — e, no limite, o sistema se parte em ilhas. A mesma interligação que faz uma região socorrer a outra é o caminho por onde o problema viaja. Por isso a rede se defende em camadas: inércia, regulação, reservas, ERAC. (L2747)
>
> E tudo isso vira dinheiro: a fatura separa a energia, o fio — TUSD e TUST — e os encargos. O limite físico de uma linha vira diferença de preço entre regiões, vira encargo rateado, vira vento cortado no Nordeste. Entender a rede é entender que eletricidade não é só gerar: é entregar potência no lugar certo, na hora certa, com tensão, frequência e segurança — a cada segundo." (L2748)

**Princípios editoriais:**

| Id | Rótulo | Texto literal | Seção | Origem |
|---|---|---|---|---|
| m02-voz-linguagem-responsavel | Disciplina editorial Alexandria · linguagem responsável | Este módulo usa números do sistema — quilômetros de linha, gigawatts, percentuais de perda — como ordens de grandeza pedagógicas, sempre com a fonte primária indicada (ONS, ANEEL, EPE, CCEE). Antes de qualquer uso externo, cada número é reverificado na fonte vigente. E a regra de ouro do GridAlpha vale aqui como em qualquer entrega: fala-se em "oportunidades potenciais a validar" — nunca em economia prometida. | § 00 | L1404 |
| m02-voz-ref-lead | — | Regra editorial Alexandria: regra ou número oficial pede fonte primária. Esta é a estante mínima do módulo — instituições primeiro, livros canônicos depois. | § Ref | L3068 |
| m02-voz-rodape | — | Produção própria sobre fontes primárias (ONS, ANEEL, CCEE, EPE, IPEA) e canônicas. Instrumentos interativos são didáticos — não substituem modelos oficiais nem dados vigentes. Linguagem responsável em todo o material: ordens de grandeza com atribuição, números vivos sinalizados para verificação, nenhuma economia prometida — apenas oportunidades potenciais a validar. | footer | L3102 |

**Callouts "Números vivos"** (4):

| Rótulo | Seção | Texto | Origem |
|---|---|---|---|
| Números vivos · verificar na fonte antes de uso externo | Aula 01 | Todos os valores da tabela acima mudam com o tempo. Em conversa, a forma segura é falar em ordem de grandeza com atribuição: "a Rede Básica tem algo na casa de 180–190 mil quilômetros de linhas, pelo dado do ONS". Precisão falsa destrói credibilidade mais rápido que arredondamento honesto. | L1513 |
| Números vivos · disciplina sobre o 15/08 | Aula 08 | Os números finos do evento (MW interrompidos por subsistema, sequência exata, atribuições de causa) têm fonte primária única: o Relatório de Análise de Perturbação do ONS. Em conversa externa, cite mecanismo e ordem de grandeza com atribuição explícita ao relatório — nunca repita versões de imprensa. É o tipo de assunto em que o interlocutor pode ter participado da própria apuração. | L2249 |
| Números vivos · verificar na fonte antes de uso externo | Aula 09 | Perda é dado por distribuidora e por ciclo tarifário. Antes de citar qualquer número em conversa externa, consultar o painel de perdas da ANEEL e o processo tarifário (PCAT) da concessionária em questão. A frase segura: "pelos dados regulatórios da ANEEL, essa concessão opera com perdas na faixa de X% — confirmo o valor vigente do ciclo atual". | L2296 |
| Números vivos · verificar na fonte antes de uso externo | Aula 10 | Volumes de curtailment, percentuais por fonte e o estado da regulamentação de compensação (ANEEL/MME) mudam mês a mês. Antes de citar em conversa externa: dados de restrição do ONS e atos vigentes da ANEEL. A forma segura: "os cortes no NE vêm crescendo desde 2023 — o número exato do mês está no dado do ONS". | L2401 |

**Todos os callouts da fonte** (21; ponteiros por rótulo):

| Seção | Tom | Rótulo | Linha |
|---|---|---|---|
| § 00 | gold | Disciplina editorial Alexandria · linguagem responsável | 1404 |
| Aula 01 | neutro | Onde a analogia quebra | 1485 |
| Aula 01 | red | Números vivos · verificar na fonte antes de uso externo | 1513 |
| Aula 01 | gold | Onde isso entra no produto | 1564 |
| Aula 02 | neutro | Por que o Brasil é caso de escola mundial | 1611 |
| Aula 03 | neutro | O princípio da seletividade | 1725 |
| Aula 03 | gold | Pergunta de diagnóstico GridAlpha | 1759 |
| Aula 04 | neutro | Recursos que vencem a rampa | 1837 |
| Aula 05 | neutro | Fora da ordem de mérito | 1941 |
| Aula 06 | neutro | O risco novo: a rede também é digital | 1996 |
| Aula 06 | gold | Onde isso entra no produto | 2029 |
| Aula 07 | neutro | Reserva custa dinheiro — e deve custar | 2062 |
| Aula 07 | gold | Ponte com o Módulo 01 · a mesma física, duas escalas | 2082 |
| Aula 07 | gold | Onde isso entra no produto | 2139 |
| Aula 08 | red | Números vivos · disciplina sobre o 15/08 | 2249 |
| Aula 09 | red | Números vivos · verificar na fonte antes de uso externo | 2296 |
| Aula 09 | gold | Onde isso entra no produto | 2341 |
| Aula 10 | neutro | A frase que resume o desenho brasileiro | 2393 |
| Aula 10 | red | Números vivos · verificar na fonte antes de uso externo | 2401 |
| Aula 10 | gold | A tese de produto · Brazil Pulse | 2457 |
| § Caso | gold | Linguagem GridAlpha para esse caso | 2521 |

## Erros comuns (§ Erros)

h2 "Oito erros que desqualificam em uma frase." · lead "Todo setor tem suas frases de quem leu manchete e parou ali. Estas são as oito mais comuns sobre rede elétrica — e a correção de cada uma, no tamanho de uma resposta de corredor. Domine as oito: metade do valor de um analista está no que ele não repete."

| # | O mito | Por que está errado | Origem |
|---|---|---|---|
| 1 | "Rede elétrica é só fio." | Fio é a parte visível. A rede inclui transformação, proteção, controle, operação em tempo real, planejamento, comunicação e regulação — metade dela é instituição, não ferro. | L2552 |
| 2 | "Se tem usina suficiente, não tem risco de apagão." | Apagão pode nascer de transmissão, proteção, tensão, frequência, subestação ou estabilidade — com geração sobrando. 2009 e 2023 começaram na rede, não na falta de usina. | L2553 |
| 3 | "Renovável elimina a necessidade de rede." | É o contrário: renovável de qualidade fica longe da carga e é variável — exige mais transmissão, mais flexibilidade, mais previsão e mais serviços de bastidor, não menos. | L2554 |
| 4 | "Bateria gera energia." | Bateria desloca energia gerada antes — do horário em que sobra para o horário em que falta. É logística temporal, não fonte. Quem dimensiona bateria como usina erra o projeto inteiro. | L2555 |
| 5 | "Apagão é sempre falta de geração." | É a versão de manchete. A maioria das grandes perturbações envolve falha de rede, proteção ou estabilidade — a Aula 08 inteira existe para enterrar este mito. | L2556 |
| 6 | "A usina mais barata sempre gera primeiro." | A ordem de mérito é o ponto de partida, não a lei final: restrições de transmissão, segurança, tensão e reserva furam a fila — e o sobrecusto vira ESS. | L2557 |
| 7 | "Mais interligação sempre reduz risco." | Interligação reduz custo e dá suporte regional no dia a dia — e é o caminho da propagação no dia extremo. Robustez e risco sistêmico vêm no mesmo pacote; por isso existem proteção, N-1 e ERAC. | L2558 |
| 8 | "Consumidor é passivo." | Cada vez menos: MMGD, bateria atrás do medidor, resposta da demanda, microrrede. A demanda virou recurso do sistema — e oportunidade de negócio de quem a gerencia. | L2559 |

Vínculo com aula: null. Nenhum item declara aula por tag. Referências em prosa: erro 5 cita "a Aula 08"; o gabarito do Ex · 09 cita "Erro 4 da tabela de mitos".

## Tradutor / § Map

`secao_map_tradutor` = null. O M02 não tem a seção "§ Map · Tradutor" que o M01 tem (zero marcador "§ Map"; só "§ MAP" = mapa das aulas). A estrutura mais próxima é o componente "three-levels" (Criança de 12 anos / Executivo não-técnico / Especialista de setor), que vive dentro de 6 aulas — listado abaixo como ponteiro literal.

| Aula | Nível | Texto literal | Origem |
|---|---|---|---|
| Aula 01 | Criança de 12 anos | A rede elétrica é como o sistema de água de uma cidade gigante — só que a água não pode parar nunca, nem por um segundo, e não existe caixa d'água. Tudo que entra de um lado tem que sair do outro, na mesma hora, sempre. Por isso existe uma sala de controle com gente olhando o sistema 24 horas por dia. | L1558 |
| Aula 01 | Executivo não-técnico | A rede é uma infraestrutura de quatro camadas — geração, transmissão, distribuição, consumo — operada em equilíbrio instantâneo porque eletricidade não se estoca em escala. Para o seu negócio, duas implicações: o ponto onde você se conecta define sua estrutura tarifária, e a conta separa o produto energia do serviço de infraestrutura — são negociáveis em graus diferentes. | L1559 |
| Aula 01 | Especialista de setor | O SIN integra quatro subsistemas eletroenergéticos coincidentes com os submercados de preço, operado centralizadamente pelo ONS sob os Procedimentos de Rede. A malha de transmissão se divide entre Rede Básica (≥230 kV, acesso via CUST/TUST) e DIT; a jusante, concessões de distribuição sob a REN 1.000/2021, com acesso via CUSD/TUSD. A topologia hidro-dominada com grandes troncos de intercâmbio inter-regionais é o que viabiliza a otimização energética interanual — e o que cria a exposição estrutural a congestionamento de escoamento. | L1560 |
| Aula 05 | Criança de 12 anos | É como escolher o que comer começando pelo que já está pronto e de graça — água, vento, sol — e só depois pedir o que custa caro, a térmica. Mas tem um detalhe: a água de graça de hoje pode fazer falta amanhã. Então alguém precisa decidir se gasta agora ou guarda. | L1953 |
| Aula 05 | Executivo não-técnico | Quando há água e vento, o custo marginal do sistema cai; quando falta, aciona-se térmica cara e o preço de curto prazo sobe. Por isso hidrologia e clima movem o custo da energia no Brasil — e qualquer empresa exposta a preço de curto prazo está, na prática, exposta ao regime de chuvas e ventos. | L1954 |
| Aula 05 | Especialista de setor | A ordem de mérito por custo é restringida por limites de intercâmbio, requisitos de segurança e o custo futuro esperado da água (função de custo futuro do NEWAVE, detalhada por DECOMP e DESSEM, com CVU auditado para térmicas). O resultado define o CMO horário por submercado — base do PLD, com piso e teto homologados anualmente pela ANEEL. | L1955 |
| Aula 06 | Criança de 12 anos | O ONS é o controlador de tráfego aéreo da eletricidade do Brasil. Ele não é dono dos aviões (usinas) nem das pistas (linhas), e não vende passagem. Mas ninguém decola nem pousa sem a autorização dele — porque se dois aviões usarem a mesma pista ao mesmo tempo, todo mundo perde. | L2023 |
| Aula 06 | Executivo não-técnico | O ONS decide, minuto a minuto, quais usinas geram e quanto flui entre as regiões — com mandato de segurança e custo mínimo, sem interesse comercial próprio. Para sua empresa, a consequência prática: as decisões do ONS (despacho térmico, restrições, custo do sistema que alimenta bandeiras e encargos) chegam na sua fatura por canais que um bom analista sabe rastrear — e um fornecedor de energia raramente explica. | L2024 |
| Aula 06 | Especialista de setor | Pessoa jurídica de direito privado sob fiscalização da ANEEL, o ONS executa a operação eletroenergética do SIN conforme os Procedimentos de Rede: cadeia PMO→PDO→tempo real com modelos NEWAVE/DECOMP/DESSEM, CVU auditado e função de custo futuro para a hidro; administração dos contratos de uso da Rede Básica; coordenação de recomposição. Não exerce comercialização (CCEE), regulação (ANEEL) nem planejamento da expansão (EPE/MME) — mapa institucional completo no Bloco 7. | L2025 |
| Aula 07 | Criança de 12 anos | Reserva é ter jogadores no banco: uns já aquecidos, prontos para entrar agora; outros que precisam aquecer primeiro. E os serviços ancilares são a equipe de bastidores do show — ninguém paga ingresso para vê-los, mas sem eles o palco apaga. | L2133 |
| Aula 07 | Executivo não-técnico | Reserva e serviços ancilares custam — você paga por capacidade de prontidão. É um seguro contra interrupção embutido no custo do sistema. E quanto mais renovável variável na matriz, mais flexibilidade e reserva o sistema precisa: o valor desses "bastidores" tende a crescer, não a sumir. | L2134 |
| Aula 07 | Especialista de setor | Reservas se classificam por tempo de sincronização e rampa (girante, operativa, fria), coordenadas pelo ONS conforme os Procedimentos de Rede. Ancilares incluem regulação primária e secundária de frequência (CAG), suporte de reativos e controle de tensão, e autorrestabelecimento (black start), com remuneração conforme regras setoriais. A penetração de geração por inversor eleva o requisito de flexibilidade e reserva rápida do sistema. | L2135 |
| Aula 08 | Criança de 12 anos | É como dominó: uma peça cai e empurra a próxima. Como tudo está ligado, a queda viaja rápido — por isso um problema longe pode apagar a luz aqui. E existem fusíveis automáticos que desligam alguns bairros de propósito, para salvar o resto do país. | L2261 |
| Aula 08 | Executivo não-técnico | A interligação reduz custo e melhora a confiabilidade no dia a dia, mas cria risco sistêmico em eventos extremos. Por isso existem esquemas automáticos de corte de carga: sacrificar uma parte para não perder o todo. Para a empresa, a tradução é direta: interrupção tem custo de produção — e dimensionar proteção própria, geração de emergência ou contratos é decisão de risco, não de luxo. | L2262 |
| Aula 08 | Especialista de setor | Trip de proteção → redistribuição de fluxos → sobrecarga em cascata → excursão de frequência com RoCoF elevado pela menor inércia → atuação do ERAC por subfrequência → ilhamento ou blecaute → recomposição coordenada com unidades de autorrestabelecimento. A penetração de inversores desloca o problema de "ter reserva" para "ter resposta rápida o suficiente" — daí grid-forming, compensadores síncronos e requisitos de suportabilidade. | L2263 |
| Aula 10 | Criança de 12 anos | Imagine uma cidade onde o pão é quase de graça, e outra cidade onde o pão é caro — ligadas por uma estrada estreita. Enquanto cabem caminhões na estrada, o preço fica parecido nas duas. Quando a estrada lota, cada cidade vira um mundo: numa sobra pão (e joga-se fora), na outra paga-se caro. O problema nunca foi o pão — foi a estrada. | L2451 |
| Aula 10 | Executivo não-técnico | Congestionamento de transmissão cria diferenças regionais de custo e cortes de geração. Para uma empresa, três consequências práticas: o submercado onde sua carga está define seu PLD de referência; parte do custo de restrições internas chega como encargo (ESS) que ninguém detalha na fatura; e projetos de geração no Nordeste carregam risco de curtailment que precisa entrar em qualquer análise de investimento ou contrato. | L2452 |
| Aula 10 | Especialista de setor | Restrições de intercâmbio separam os PLDs por submercado; restrições internas são tratadas por redespacho com sobrecusto liquidado como ESS — sem sinal locacional no preço de curto prazo, que permanece zonal. O sinal locacional estrutural existe na TUST nodal (anual, ex-ante). Constrained-off de renováveis e o desenho de compensação (razão elétrica × energética) são a fronteira regulatória corrente; o dado primário de restrição é do ONS e a liquidação, da CCEE. | L2453 |

## Divergências (15)

| Id | Tipo | Sev. | Tema | Leitura A | Leitura B | Nota |
|---|---|---|---|---|---|---|
| div-m02-01 | fonte×fonte | alta | Critério do módulo em cinco formas literais | Você passa no Bloco 2 quando consegue, sem consultar nada: (1) … e (2) … [2 itens: explicação + desenho] (L1389) | § Quiz "8 de 10" · § Final "todas as ações abaixo" (18 itens) "e o quiz fechar em 8/10 ou mais" · § Voz "todo conceito sobrevive em voz alta" · placar do script (ver div-m02-02) (L2676; L2762; L2695) | Nenhuma forma prevalece. P18: nenhum limiar legado declara domínio, emite competência ou trava trilha. |
| div-m02-02 | fonte×fonte | alta | Placar do script × limiar 8/10 | O critério de domínio do módulo é acertar pelo menos 8 de 10 sem consultar. (L2676) | correct >= 7 → "Bom. Revise os pontos errados, depois avance para o próximo módulo." (7 acertos já manda avançar; 8 recebe "Revise"; "Pronto para o Módulo 03" só com ≥ 9) (L3830) | Mesma contradição do M01 (L3199–3202 lá). Registro legado (P18). |
| div-m02-03 | fonte×fonte | média | § Ex: prosa "Oito exercícios" × markup com 10 div.exercise | Oito exercícios. Gabarito escondido. (L2571) | 10 div.exercise no markup (Ex · 09 e Ex · 10 usam div.exercise-label e não apontam aula) (L2649) | Precedente citado no protocolo §5 ("Módulo 02 ('Oito exercícios', há 10)") — confirmado por medição. O markup vence a contagem; a prosa fica literal. |
| div-m02-04 | fonte×catálogo | média | Escala do catálogo: "8 exercícios" × 10 no markup | 10 div.exercise (L2649) | 8 exercícios (catalogo-modulos-alexandria.md L192) | O catálogo repete a prosa da fonte. Pendência FOUNDRY (arquivo fora de posse). |
| div-m02-05 | fonte×catálogo | média | Catálogo diz que o critério é "declarado duas vezes, com a mesma substância" | 5 formas literais (§ 00, § Quiz, § Final, § Voz, placar) — ver div-m02-01 (L1389; L2676; L2762; L2695; L2572) | Declarado duas vezes, com a mesma substância. (catalogo-modulos-alexandria.md L257) | O catálogo omite o 8/10 do § Quiz, o § Voz e as mensagens do placar. Pendência FOUNDRY. |
| div-m02-06 | fonte×fonte (P24) | baixa | Título: h1 longo × título curto do <title>/rodapé/catálogo | A rede elétrica: uma máquina continental de equilíbrio em tempo real — e por que ela define o que sua empresa paga. (L1324) | Alexandria · Módulo 02 — Como Funciona uma Rede Elétrica (L6) | O título curto da fonte coincide com o catálogo ("Como Funciona uma Rede Elétrica"). P24: o catálogo governa o nome; o h1 é descritor editorial. |
| div-m02-07 | fonte M01 × fonte M02/catálogo | baixa | Nome do M02 na fonte do M01 | 02 · A Rede Elétrica (alexandria_modulo01.html L1276) | Como Funciona uma Rede Elétrica (L6) | Já registrado na extração do M01 (div-06). P24: catálogo governa. |
| div-m02-08 | fonte×produto (P24/P7) | média | Marca GridAlpha e blocos de produto visíveis ao learner | "GridAlpha" em 16 ocorrências (linhas 1243, 1337, 1386, 1406, 1457, 1757, 1760, 2084, 2141, 2343, 2358, 2459, 2519, 2522, 2641, 3100); hero-meta "Produtos GridAlpha: Brazil Pulse · CLE · PQA"; 7 callouts de produto: "Onde isso entra no produto" (Aula 01); "Pergunta de diagnóstico GridAlpha" (Aula 03); "Onde isso entra no produto" (Aula 06); "Onde isso entra no produto" (Aula 07); "Onde isso entra no produto" (Aula 09); "A tese de produto · Brazil Pulse" (Aula 10); "Linguagem GridAlpha para esse caso" (§ Caso) (L1337) | Código atual: "GridAlpha" 9× em alexandria-modulo-02-content.ts; callouts de produto portados: "Onde isso entra no produto", "Pergunta de diagnóstico GridAlpha", "Onde isso entra no produto", "Onde isso entra no produto", "Onde isso entra no produto", "A tese de produto · Brazil Pulse" (src/lib/data/alexandria-modulo-02-content.ts) | Fonte mantida literal. P24: GridAlpha só como proveniência; P7: bloco "onde isso entra no produto" fora da interface. O código atual ainda carrega os dois (pendência já listada nas decisões de 2026-09-16). |
| div-m02-09 | fonte (vocabulário interno) | baixa | Vocabulário interno visível ao learner | "Módulo 02 · Cobaia Zero v2.0" no cabeçalho; "Summit" nas linhas 2572, 2641, 3510 (§ Ex e veredito do INST · 09); "Bloco 2" no critério de passagem (L1246) | O produto chama o módulo de "Módulo 02"; "Cobaia Zero" e "Summit" não são definidos para o learner. (—) | Mesma classe do "War Room" do M01. Registrado; tratamento é da camada editorial. |
| div-m02-10 | fonte×catálogo | baixa | Referências cruzadas "Bloco N" × numeração do catálogo | L1390: Bloco 2; L1498: Bloco 10; L1877: Bloco 9; L1972: Bloco 6; L2025: Bloco 7; L2064: Bloco 9; L2243: Bloco 6; L2374: Bloco 5; L2947: Bloco 9; L3084: Bloco 6; L3142: Bloco 5 (L1390; L1498; L1877; L1972; L2025; L2064; L2243; L2374; L2947; L3084; L3142) | Catálogo: Módulo 05 = "Regulação e Desenho de Mercados"; Módulo 09 = "Os Mercados ACR e ACL em Profundidade"; Módulo 04 = "Economia de Mercados de Energia" (catalogo-modulos-alexandria.md L441) | Leitura A: "Bloco 5" (L2374, L3142: "mercado livre") e "Bloco 9" (L1877, L2947: PLD) apontam os módulos do currículo antigo e podem não bater com o catálogo atual (mercado livre = M09; PLD também no M04). Leitura B: "Bloco N" = "Módulo N" e o conteúdo será coberto lá. Bloco 6 (história), 7 (institucional) e 10 (CCC/tarifa) batem com o catálogo. Não resolvido. |
| div-m02-11 | fonte×código | baixa | Horas declaradas × blocks.ts | 4 – 5 horas (L1329) | estimatedHoursMin: null, estimatedHoursMax: null (alexandria-blocks.ts L8) | O catálogo registra "4–5 h declaradas". A fonte só tem a string; converter é decisão do produto. |
| div-m02-12 | fonte×código | baixa | illustrationPrefix "red-" × zero <img> na fonte | 0 <img> no HTML-fonte (—) | illustrationPrefix: 'red-' (alexandria-blocks.ts L8) | As gravuras não vêm da fonte (protocolo §7). Registro informativo. |
| div-m02-13 | código (comentário)×fonte | baixa | Comentário do código atribui "Dez aulas" ao hero | Dez aulas, da física ao custo. (L1417) | o hero declara "Dez aulas". (alexandria-modulo-02-content.ts L11) | A frase está no h2 do § MAP; o hero não declara contagem de aulas. A contagem (10) está certa. |
| div-m02-14 | fonte×código | alta | Conteúdo de módulo ausente do código | Na fonte: tese (§ 00), 8 capacidades + critério de passagem, 10 perguntas do § MAP, 5 formas de critério, § Voz (30 perguntas + roteiro de 7 parágrafos), § Erros (8), 6 blocos "três níveis" (18 painéis) (L1353) | No código: tese ausente, erros ausentes, voz ausente; painéis "três níveis" encontrados: 0/18 (src/lib/data/alexandria-modulo-02-content.ts) | Os painéis "três níveis" estão DENTRO de seis aulas (01, 05, 06, 07, 08, 10) e não foram portados para MODULO_02_CORPO — perda de conteúdo de aula, não só de módulo. Verificado por busca literal dos 40 primeiros caracteres de cada painel. |
| div-m02-15 | fonte×fonte | baixa | Rótulo de nível em três grafias | Nível do currículo: Fundamentos · Nível 1 (L1333) | Nível 1 · Fundamentos Universais · Módulo 02 · rodapé: Módulo 02 · Como Funciona uma Rede Elétrica · Nível 1 — Fundamentos Universais · v2.0 (L1323) | Mesma substância (Nível 1 · Fundamentos), grafias diferentes. Catálogo: "Fundamentos Universais". |

## Lacunas (11)

| Id | Campo | Valor | Nota |
|---|---|---|---|
| lac-m02-01 | identidade.eixos | null | A fonte não declara "eixos" do módulo. O mais próximo é a tabela de "cinco consequências estruturais" do § 00 (ver tese.consequencias), que a própria fonte chama de "esqueleto de todo o resto do currículo" — não é rotulada como eixo e não foi promovida. |
| lac-m02-02 | identidade.horas.min/max | null | A fonte só tem a string "4 – 5 horas". |
| lac-m02-03 | resultado_esperado (h4 "Resultado esperado") | null | A fonte do M02 não tem um h4 "Resultado esperado". O bloco equivalente no § 00 é o h4 "O critério de domínio deste módulo" + parágrafo com dois itens numerados (critério de passagem) + "Além disso, ao final você consegue:" + lista de 8 itens. Os dois grupos estão abaixo, separados como a fonte os separa. |
| lac-m02-04 | laboratorios | [] | A fonte do M02 não tem seção § Lab (zero marcadores com "Lab"; zero ocorrência de "LAB"). Os 9 instrumentos estão todos dentro de aulas (ver instrumentos.json). Ausência declarada, não preenchida. |
| lac-m02-05 | tradutor (§ Map) | null | O M02 não tem a seção "§ Map · Tradutor" que o M01 tem (zero marcador "§ Map"; só "§ MAP" = mapa das aulas). A estrutura mais próxima é o componente "three-levels" (Criança de 12 anos / Executivo não-técnico / Especialista de setor), que vive dentro de 6 aulas — listado abaixo como ponteiro literal. |
| lac-m02-06 | criterio § Ex | null | O § Ex não declara limiar nem critério por exercício. |
| lac-m02-07 | erros_comuns.vinculos.aula | null | Nenhum item declara aula por tag. Referências em prosa: erro 5 cita "a Aula 08"; o gabarito do Ex · 09 cita "Erro 4 da tabela de mitos". |
| lac-m02-08 | aulas: duração, dificuldade, vídeo, imagens | null | Zero <video>/<iframe>/youtube/vimeo e 0 <img> no arquivo; nenhuma duração ou dificuldade por aula. |
| lac-m02-09 | registro/avaliação do § Voz e do § Final | null | Perguntas-relâmpago e roteiro oral sem gabarito nem registro; checklist é toggle visual sem persistência. |
| lac-m02-10 | vínculo aula ↔ capacidade | null | A fonte não liga as 8 capacidades nem os 18 itens do checklist a aulas. |
| lac-m02-11 | marcacao_p14 | "inferida" | Anotação desta extração (verbo/frase), não texto da fonte; exige revisão humana. |


## Verificação

Verificador independente (scripts próprios, fora desta pasta), contra o HTML-fonte:

- **Literalidade.** ~2.000 strings varridas no corpus normalizado; 1.766 conferidas também na janela da própria origem
  (linha_aprox −6/+80). As únicas "falhas" são campos de metadado (ids, classes, seções, faixas derivadas), não conteúdo.
- **Quiz (100%).** O literal `const questions` foi avaliado à parte: 10/10 enunciados, 40/40 alternativas (ordem e
  `correta`), 10/10 explicações e o gabarito BBBCBBBBCB são idênticos; as origens estão a ±3.
- **Checklist (100%).** 18/18 itens idênticos em html e texto, com origens a ±3. Três viram badge (itens 1, 11 e 15),
  conferido em `alexandria-badges.ts`.
- **Instrumentos (100% das fórmulas).** 172 linhas de script (leitura de entradas, cálculo, formatação, condições e
  atribuições dos ramos) conferidas verbatim a ±3 linhas; os 9 `codigo_completo` batem com as linhas declaradas
  (a menos de espaços). O ramo `minNet < 35` do INST · 04 foi re-simulado: nas 3.588 combinações ele só ocorre com
  `rampa > 10` (44 casos), portanto é de fato inalcançável.
- **Origens.** Todo `trecho_inicial` com `linha_aprox` fica a ±3 linhas.
- **Contagens recontadas no HTML.** Todas conferem:
  - 20 seções e 10 aulas, com subseções 5,5,5,4,4,4,3,6,4,6.
  - 9 instrumentos: 24 entradas (22 `.field` + 2 grupos de pílulas), 37 saídas e 689.556 combinações, recalculadas
    a partir das faixas.
  - 65 termos, 10 `div.exercise` (8 com aula) e 18 itens de checklist.
  - 16 referências (13 + 3), 11 delas com `span.mono`.
  - 8 erros, 30 perguntas-relâmpago e 7 parágrafos no roteiro.
  - 18 painéis "três níveis", em 6 blocos.
  - 21 callouts: 4 de "Números vivos" e 7 de produto/marca.
  - 16 ocorrências de "GridAlpha"; 0 LAB; 0 `<img>`, `<video>` ou `<iframe>`.
- **Esclarecimento (sem mudar número).** `ramos_de_leitura_alcancados` (25) conta *chaves de texto mascaradas*
  distintas, e não ramos `if/else` do script. O script tem 27 ramos literais, e 26 são alcançados:
  - o INST · 02 dá 4 chaves para 3 ramos, porque o "> 100" muda o texto;
  - o INST · 06 dá 3 chaves para 6 ramos, porque vocação e veredito andam juntos;
  - o INST · 08 conta "(sem veredito)" como 1.

**Correções feitas por esta verificação**

1. `div-m02-04`, leitura B. A origem apontava para `catalogo-modulos-alexandria.md` L111, que é a Escala do
   **Módulo 01**; o "8 exercícios" do M02 está na L192. O extrator agora busca o trecho completo da Escala do M02.
2. `div-m02-09`, leitura A. A origem apontava para `.alex-brand` ("GridAlpha · Alexandria Library"), e não para o
   elemento citado. Agora aponta para `header.alex-header .header-meta` ("Módulo 02 · Cobaia Zero v2.0", L1246).

Nenhuma divergência inventada: as 32 (15 + 9 + 8) foram conferidas contra a fonte, o catálogo e o código.

### Segunda verificação adversarial (2026-09-17)

Outro verificador, com método próprio (scripts fora desta pasta, sem reaproveitar `m02_verificar.mjs`):

- **Literalidade.** Todo valor string dos três JSONs, fora os ramos de metadado, foi procurado no HTML-fonte
  (tags removidas, e também com o markup cru). Resultado: 0 falhas de conteúdo. As únicas "falhas" são ids,
  faixas derivadas do placar, `tom` dos callouts, dados do catálogo e textos *renderizados* pelos scripts. Estes
  últimos foram conferidos de outro jeito, rodando o `<script>` original num DOM mínimo próprio.
- **Quiz (100%).** O array `questions` foi avaliado direto da fonte e comparado campo a campo (10 enunciados,
  40 alternativas, `correta`, 10 explicações, gabarito BBBCBBBBCB, origens a ±3). Tudo idêntico.
- **Checklist (100%).** Os 18 `.checklist-text` foram comparados em html e texto, e as origens estão a ±3. As
  marcações P14 (16 oral/livre, 2 desenho, 2 limite de extensão, 1 cálculo) e os 3 badges (itens 1, 11 e 15
  em `alexandria-badges.ts`) conferem.
- **Fórmulas dos instrumentos (100%).** 185 trechos de script (leitura, cálculo, formatação, condições e
  atribuições de ramo) foram conferidos verbatim a ±3 linhas. Os 9 `codigo_completo` são idênticos às linhas
  declaradas, a menos da quebra final. O cenário-padrão dos 9 foi refeito rodando o script original: os
  valores batem, e o INST · 02 também foi conferido à mão (1.215 A; 39,0 MW; 3,9 %; R$ 47,0 mi).
- **Contagens.** Todas foram recontadas no HTML e batem:
  - seções, aulas e subseções por aula (também em `MODULO_02_CORPO`);
  - instrumentos, entradas, saídas e combinações (recalculadas a partir das faixas do markup);
  - termos (65 `details`, em ordem alfabética), exercícios (10, dos quais 8 com tag de aula) e checklist;
  - referências (16; 11 com `span.mono`; 0 URL, já que os 5 `http` do arquivo são fontes/SVG);
  - callouts (21 = 8 neutros + 9 gold + 4 red), painéis "três níveis" (18, e 0 no código), "GridAlpha" (16, nas
    linhas listadas), "Summit", "Bloco N" e `<img>`.
- **Divergências.** As 32 foram reconferidas, e nenhuma foi inventada.

**Correções feitas pela segunda verificação**

1. **Origem com a base errada.** Ao buscar dentro de um grupo capturado (`header`, `section.hero` e `footer`),
   `m02_modulo.mjs` somava o índice ao início do *match*, e não ao do *grupo*. Isso atrasava 1 linha as origens
   do hero (eyebrow, h1, subtítulo, 4 hero-meta, horas), do cabeçalho e dos 3 parágrafos do rodapé, inclusive
   nas cópias em `criterio`/`voz`/`divergencias`. Todas ficavam dentro de ±3, mas eram erradas. Agora usam a
   base do grupo, por exemplo o h1 em L1324 e o subtítulo em L1325.
2. **Origem do rodapé.** `identidade.rodape.origem` apontava para `<footer>` (L3098) com o `trecho_inicial` da
   `.footer-brand`. Agora aponta para `footer.alex-footer .footer-brand` (L3100).
3. **Composição dos critérios.** `criterio.nota_p18` listava 5 formas com o placar, e o README listava 5 com o
   "§ Ex sem limiar". A nota agora diz que o placar mora em `m02-crit-quiz.mensagens_do_script` e que a 5ª
   entrada (`m02-crit-ex`) só registra a ausência de limiar. Nenhuma contagem mudou.
