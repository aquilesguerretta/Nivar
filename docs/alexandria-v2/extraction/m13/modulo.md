# M13 · grupo "modulo"

Fonte (só leitura): `C:/dev/GridAlpha v2/Alexandria modulos/alexandria_modulo13.html` (4.267 linhas). Saída: [`modulo.json`](modulo.json). Extrator: [`extratores/m13_modulo.mjs`](extratores/m13_modulo.mjs).
Camada **fonte**: todo texto entre aspas ou em tabela saiu do JSON, e o JSON saiu do HTML por programa; nada foi
digitado nem parafraseado. `L` é a linha aproximada no HTML-fonte. As divergências ficam com as duas leituras, e
nenhuma é resolvida aqui (P17–P24 valem só na camada de produto).

**Verificação** (`m13_verify.mjs`, os três JSONs juntos): 3.489 strings de conteúdo são substring
da fonte normalizada e 614 origens estão na linha declarada (±3), com 0 e 0 falhas. Cobertura por token:
§00 100% (2.300/2.300), §MAP 100% (723/723), §Voz 100% (1.331/1.331), §Erros 100% (1.022/1.022).

## Identidade

| Campo | Valor literal | Origem |
|---|---|---|
| `<title>` | "Alexandria · Módulo 13 — Análise Financeira de Empresas e Projetos" | L6 |
| Eyebrow (kicker) | "Alexandria · GridAlpha · Módulo 13" | L599 |
| Título (h1) | "Análise Financeira de Empresas e Projetos" | L600 |
| Subtítulo (p.sub) | "Nenhum múltiplo se lê sozinho. EV/EBITDA, dívida líquida sobre EBITDA e dividend yield só significam alguma coisa quando se sabe quem controla a empresa, como a dívida foi desenhada, e o que o release ainda não disse." | L601 |
| Pills | "8 aulas" · "11 instrumentos" · "6 fichas de empresa" · "180 termos" · "14 exercícios" · "20 erros comuns" · "quiz 8/10" · "roteiro oral 10 min" · "28 itens de checklist" · "36 referências" · "verificado em 02·08·2026" | L605–L615 |
| Rodapé | "Alexandria · Módulo 13 — Análise Financeira de Empresas e Projetos"; "GridAlpha · uma nova camada independente de inteligência energética" / "Nenhuma receita de venda de energia · nenhuma comissão · nenhuma recomendação de investimento" / "Verificado em 2 de agosto de 2026 · números e status societários exigem reverificação na fonte primária antes de uso externo" | L3305 |
| Horas | texto/min/max = `null`: A fonte do M13 não declara tempo estimado (varredura por "hora"/"horas"/"tempo estimado": só aparecem "uma hora" do critério e "meia hora"; nenhum hero-meta de duração). As pills declaram apenas "roteiro oral 10 min". O código (alexandria-blocks.ts, bloco-13) traz estimatedHoursMin 4 / estimatedHoursMax 5 sem origem nesta fonte; o catálogo canônico também não declara horas para o M13. | — |
| Eixos | `null`: A fonte não rotula "eixos". Ela declara "três lentes" (§00.2, L697-714) e diz explicitamente que "Elas não são categorias de conceito — são a ordem em que um analista […] efetivamente lê". As lentes estão abaixo, literais, sem promoção a eixo. | — |

**As três lentes (§00.2), literais:**

1. **Lente 1 · Controle**: "Quem manda, de fato, na empresa. Não quem tem mais ações — quem tem mais voto, o que raramente é a mesma coisa. Cada arquétipo de controle implica um comportamento diferente diante de crise, de decisão de investimento e de disputa societária, e é isso, não o múltiplo, que determina o que a empresa vai fazer quando algo der errado." (L698)
2. **Lente 2 · Capital**: "Como a dívida e o capital próprio estão desenhados: moeda de indexação, prazo médio, garantias, covenants, e se o financiamento é de projeto — sociedade de propósito específico isolada, sem recurso à controladora — ou corporativo, num balanço único. Duas empresas com a mesma razão dívida sobre EBITDA podem ter riscos incomparáveis se o desenho for diferente." (L703)
3. **Lente 3 · Lacuna**: "O que o documento não diz, e que exige pergunta adicional antes de qualquer conclusão. Garantia não detalhada, contingência sem valor provisionado, transação com parte relacionada sem preço de referência, covenant não divulgado, plano de refinanciamento ausente para vencimento próximo. É a lente nova deste bloco: nenhum instrumento de nenhum módulo anterior treinou a habilidade de notar ausência de informação." (L708)

**Catálogo canônico (P24).** O catálogo (`C:/dev/GridAlpha v2/docs/catalogo-modulos-alexandria.md`, L1250) dá "Análise Financeira de Empresas e Projetos".
Esse título é igual ao h1 (true) e ao `<title>` (true).
- Trilha no catálogo: "**Trilha** · Especialização Estratégica — **atribuída**; a fonte traz apenas `Alexandria · GridAlpha · Módulo 13`.". Código: track: 'brasil', level: 3 (alexandria-blocks.ts); alexandria-trilhas.ts comenta 'bloco-13' como módulo da Trilha 3.
- Escala no catálogo (L1254): "**Escala** · 8 aulas · 11 instrumentos · 180 termos · 6 fichas de empresa · 14 exercícios · 20 erros comuns · 28 itens de checklist · 36 referências · roteiro oral de 10 min. Verificação em 2 de agosto de 2026.". Confere com as pills da fonte.
- Tabela-resumo: `\| 13 \| Análise Financeira \| 18 \| 8 \| 11 \| 180 \|`.
- `alexandria-blocks.ts`: `{ id: 'bloco-13', number: 13, level: 3, title: 'Análise Financeira de Empresas e Projetos',track: 'brasil', illustrationPrefix: null, priority: 'media-alta', estimatedHoursMin: 4, estimatedHoursMax: 5 },`.
- P24: o catálogo canônico governa o nome principal. Aqui o h1, o <title>, o rodapé e o catálogo coincidem ("Análise Financeira de Empresas e Projetos"); a tabela-resumo do catálogo abrevia para "Análise Financeira". O p.sub do hero é candidato a subtítulo/descritor editorial, nunca a segundo título.

**Marca (P24).** "GridAlpha" aparece em 21 linhas voltadas ao learner:
L599 (markup), L744 (markup), L748 (markup), L1342 (markup), L1346 (markup), L1488 (markup), L1491 (markup), L1691 (markup), L1695 (markup), L1927 (markup), L1930 (markup), L2089 (markup), L2092 (markup), L2270 (markup), L2272 (markup), L2402 (markup), L2407 (markup), L3279 (markup), L3297 (markup), L3307 (markup), L4218 (script (texto renderizado)). O texto foi mantido literal.

## Resultado esperado / capacidades

`null`. O M13 não tem bloco "Resultado esperado"/capacidades (zero ocorrência de "Resultado esperado", "capacidade" como lista, h4 de capacidades). O equivalente mais próximo é o critério de domínio literal do §00.2 (m13-crit-00-dominio) e o item 1 do §Final. Nada foi derivado.

## Roteiro (18 seções: 8 aulas e 10 aparatos)

| # | Seção | Marcador | Título (h2) | Subseções | Instrumentos | Linhas | Código (`aula-13-NN`) |
|---|---|---|---|---|---|---|---|
| 1 | tese | §00 · Tese | "Extração não é análise, e a diferença cabe em três lentes" | §00.1, §00.2, §00.3, §00.4 | — | L620–783 | — |
| 2 | map | §MAP · Painel setorial | "Dez empresas vivas, seis arquétipos de controle, quatro estados societários" | §MAP.1 | INST·01 | L785–886 | — |
| 3 | a01 | Aula 01 · Múltiplos | "Por que EV/EBITDA e não P/E — e por que alavancagem infla os dois por razões opostas" | 01.1, 01.2, 01.3, 01.4 | INST·02 | L888–1089 | aula-13-01: title=h2 sim; subtitle=rótulo sim; lead=lede sim; instrumentos 0 |
| 4 | a02 | Aula 02 · DCF de concessão | "O que acontece com um fluxo de caixa descontado quando o direito econômico tem data para acabar" | 02.1, 02.2, 02.3, 02.4 | INST·03 | L1091–1351 | aula-13-02: title=h2 sim; subtitle=rótulo sim; lead=lede sim; instrumentos 0 |
| 5 | a03 | Aula 03 · Leitura de documento | "Trinta minutos no release, sessenta no Formulário de Referência, e a pergunta que só a segunda leitura permite" | 03.1, 03.2, 03.3, 03.4 | INST·04, INST·05 | L1353–1497 | aula-13-03: title=h2 sim; subtitle=rótulo sim; lead=lede sim; instrumentos 0 |
| 6 | a04 | Aula 04 · Lente de controle | "Participação econômica não é poder de voto — e no Brasil elas divergem com frequência" | 04.1, 04.2, 04.3, 04.4 | INST·06, INST·07 | L1499–1700 | aula-13-04: title=h2 sim; subtitle=rótulo sim; lead=lede sim; instrumentos 0 |
| 7 | a05 | Aula 05 · Project finance | "A dívida que o projeto paga sozinho — e a métrica que decide quanto dela cabe" | 05.1, 05.2, 05.3, 05.4, 05.5 | INST·08 | L1702–1936 | aula-13-05: title=h2 sim; subtitle=rótulo sim; lead=lede NÃO; instrumentos 0 |
| 8 | a06 | Aula 06 · Riscos | "Seis categorias de risco, e a sexta é a que o currículo não nomeia" | 06.1, 06.2, 06.3, 06.4 | INST·09 | L1938–2099 | aula-13-06: title=h2 sim; subtitle=rótulo sim; lead=lede NÃO; instrumentos 0 |
| 9 | a07 | Aula 07 · Fichas de empresa | "Seis fichas, um arquétipo cada, e um campo deixado deliberadamente em branco" | 07.1, 07.2 | INST·10 | L2101–2279 | aula-13-07: title=h2 sim; subtitle=rótulo sim; lead=lede sim; instrumentos 0 |
| 10 | a08 | Aula 08 · Síntese | "O andaime: três teses, três riscos, três lacunas — em uma hora, com âncora e contraponto" | 08.1, 08.2, 08.3, 08.4 | INST·11 | L2281–2416 | aula-13-08: title=h2 sim; subtitle=rótulo sim; lead=lede NÃO; instrumentos 0 |
| 11 | caso | §Caso · Operação A — Parte 13 | "Quando a geradora deixa de ser fornecedora e passa a ser contraparte de crédito" | C.1, C.2, C.3 | — | L2418–2519 | — |
| 12 | erros | §Erros · Vinte correções | "Vinte afirmações que circulam, e o que cada uma esconde" | — | — | L2521–2612 | — |
| 13 | ex | §Ex · Exercícios | "Catorze exercícios, gabarito oculto" | Ex.1, Ex.2, Ex.3, Ex.4, Ex.5 | — | L2614–2809 | — |
| 14 | quiz | §Quiz · Verificação | "Dez questões, critério de oito acertos" | — | — | L2811–2829 | — |
| 15 | voz | §Voz · Roteiro oral | "Dez minutos, para gravar e ouvir de volta" | — | — | L2831–2938 | — |
| 16 | final | §Final · Checklist | "Vinte e oito itens, do primeiro ao último" | — | — | L2940–2981 | — |
| 17 | lex | §Lex · Glossário | "Cento e oitenta termos, agrupados por família" | — | — | L2983–3219 | — |
| 18 | ref | §Ref · Referências | "Trinta e seis fontes, separadas por natureza" | R.1, R.2, R.3, R.4 | — | L3221–3302 | — |

**Contagem de aulas (P8).** A fonte tem 8 seções `Aula NN`, a pill diz "8 aulas", o catálogo diz 8 e
`alexandria-trilhas.ts` tem `'bloco-13': 8`. O código tem 8 aulas (`aula-13-01`…`aula-13-08`). Todos concordam.
Nas 8 aulas, `title` = h2 e `subtitle` = rótulo do `sec-id`. O `lead` difere do lede em 3 aulas
(Aula 05, Aula 06, Aula 08): é espaço antes da pontuação, ver `div-m13-codigo-lead-espacos`.

**Subseções por aula, literais:**

- **Aula 01**: 01.1 "O que cada múltiplo mede, mecanicamente"; 01.2 "A razão específica do setor de utilities"; 01.3 "Por que alavancagem infla os dois múltiplos por razões opostas"; 01.4 "Quando P/E volta a ser o instrumento certo"
- **Aula 02**: 02.1 "A pergunta decisiva"; 02.2 "A estrutura correta do modelo"; 02.3 "A taxa de desconto: onde a Selic corrente entra, e onde não entra"; 02.4 "WACC corporativo não é WACC regulatório"
- **Aula 03**: 03.1 "O que cada documento é, juridicamente"; 03.2 "Release em trinta minutos, na ordem certa"; 03.3 "A ponte que separa quem lê de quem entende"; 03.4 "A terceira lente: como se lê o que não está escrito"
- **Aula 04**: 04.1 "Por que as duas grandezas divergem"; 04.2 "O caso que torna a distinção inesquecível"; 04.3 "O segundo caso: privatização com voto limitado por desenho"; 04.4 "Quando a listagem acaba: a Neoenergia como caso didático"
- **Aula 05**: 05.1 "Por que a sociedade de propósito específico existe"; 05.2 "Setenta por trinta é heurística, não regra"; 05.3 "Fontes e usos: o teste de sanidade"; 05.4 "DSCR e as duas coberturas que ele não substitui"; 05.5 "As fontes de financiamento e o que cada uma cobra em troca"
- **Aula 06**: 06.1 "A matriz, com o mesmo risco visto de dois lugares"; 06.2 "A sexta categoria: o caso da reestruturação de dívida"; 06.3 "Estudo de caso: uma recuperação judicial de distribuidora a um passo do fim"; 06.4 "Risco de contraparte: o que importa para quem compra energia"
- **Aula 07**: 07.1 "As quatro restantes, por indicador"; 07.2 "A ficha que não existe: o predecessor"
- **Aula 08**: 08.1 "O que torna uma tese defensável"; 08.2 "A simetria dos riscos e das lacunas"; 08.3 "A hora, distribuída"; 08.4 "A pergunta que encerra o bloco, e a resposta que o define"

## §MAP — Painel setorial

O §MAP do M13 não é um mapa de aulas com pergunta por aula (como o § MAP do M01). É o "Painel setorial": 10 cartões de estado societário, o INST·01 (instrumento de módulo, fora de aula) e a tabela dos seis arquétipos. Não há pergunta atribuída a cada aula em nenhum lugar da fonte. `perguntas_por_aula` = `null`.

As únicas perguntas literais do §MAP (2):

- "quando esta empresa precisar decidir algo difícil, quem decide?" (L857)
- "quem controla esta empresa, e participação econômica é a mesma coisa que poder de voto neste caso específico?" (L879)

Instrumento de módulo: **INST·01** "Painel de controle setorial". Único instrumento fora de aula (§MAP). Vai para Recursos do Módulo (protocolo §3).
Detalhe em `instrumentos.md`. O §MAP tem 10 blocos (L785–886).

## Critérios literais (P14 e P18)

Todos os trechos em que a fonte declara ou mede critério, verbatim. Nenhum é escolhido como "o" critério (P18). marcacao_p14 é anotação desta extração, inferida por palavra-chave do próprio item (cronometrado: "uma hora", "minutos", "cronometr…", "em menos de"; oral: "voz alta", "gravar", item iniciado por "Digo"/"Explico", "Recuso a pergunta"; producao_livre: "Produz…", "Escrev…", "nove itens", "três teses"; calculo: item iniciado por "Reconstruo"/"Converto"/"Calculo"/"Modelo"). Não é texto da fonte e precisa de revisão humana. "automatizavel" marca só o quiz.

| Id | Onde | Texto literal | P14 (inferido) | Origem |
|---|---|---|---|---|
| m13-crit-00-dominio | §00.2 — critério de domínio do bloco | "As três lentes existem porque o critério de domínio deste bloco é específico de um jeito que nenhum critério anterior foi. Não é "sustente uma conversa" nem "avalie uma proposta". É literalmente três teses de investimento, três riscos críticos e três lacunas de informação, a partir de um documento, em uma hora. Cada lente produz um dos três terços — e é por isso que o instrumento assinatura deste módulo, o Andaime de Tese de Investimento da Aula 08, tem a forma que tem." | cronometrado, producao_livre | L716 |
| m13-crit-a03-lede | Aula 03 — lede | "O critério de domínio deste bloco é cronometrado por uma razão: em situação real, ninguém tem uma semana. A diferença entre quem produz três teses defensáveis em uma hora e quem produz uma opinião em três dias não é velocidade de leitura — é ordem de leitura, e saber de antemão qual pergunta cada seção do documento responde." | cronometrado, producao_livre | L1358 |
| m13-crit-a03-uma-hora | Aula 03 — 03.1 | "O ponto operacional: o release e o Formulário de Referência respondem perguntas diferentes e não se substituem. O release diz o que aconteceu no trimestre. O Formulário diz quem é a empresa, quem manda nela, o que ela deve, a quem, com que garantia, e o que pode dar errado. Um analista que só lê release produz teses operacionais; um que só lê o Formulário produz teses estruturais sem calibração de momento. O critério de uma hora exige os dois." | cronometrado, producao_livre | L1377 |
| m13-crit-a07-ficha | Aula 07 — campo aberto da ficha AXIA | "Campo reservado ao exercício. Produza as nove a partir desta ficha, com âncora e contraponto, usando o Andaime da Aula 08. Cronometre uma hora." | cronometrado, producao_livre | L2131 |
| m13-crit-a08-lede | Aula 08 — lede | "Tudo antes desta aula foi preparação. O critério de domínio deste bloco não é saber o que é EV/EBITDA nem reconhecer um arquétipo de controle: é produzir nove itens estruturados a partir de um documento real, cronometrado. Esta aula é o instrumento que constrói exatamente essa saída, e o resto do módulo existe para alimentá-la." | cronometrado, producao_livre | L2286 |
| m13-crit-inst11-intro | Aula 08 — INST·11 (intro) | "Escolha uma das seis empresas com ficha e um dos três blocos. O andaime devolve três itens estruturados — cada um com âncora e contraponto declarados — não como resposta a ser copiada, mas como modelo de forma. O conteúdo dos itens deriva da estrutura verificável de cada companhia; a peça analítica final continua sendo sua, e o objetivo do treino é produzir os nove sem consultar este painel, em menos de uma hora." | cronometrado, producao_livre | L2340 |
| m13-crit-ex-lede | §Ex — lede | "Quatro tipos, na proporção que o critério de domínio exige: produção de tese, detecção de lacuna, atualização de status societário e classificação de controle — mais os cálculos que sustentam os quatro. Faça cada um antes de abrir o gabarito; a resposta que se lê sem tentar não treina nada." | — | L2619 |
| m13-crit-quiz-h2 | §Quiz — h2 | "Dez questões, critério de oito acertos" | automatizavel | L2814 |
| m13-crit-quiz-lede | §Quiz — lede | "O critério é oito de dez. Abaixo disso, a matéria ainda não sustenta uma hora com um Formulário de Referência aberto — não por falta de informação, mas porque o erro em qualquer uma destas questões é de definição, de status ou de sinal cruzado, e esses são os três que um interlocutor que lê balanço há mais tempo identifica primeiro." | automatizavel | L2816 |
| m13-crit-voz-h2 | §Voz — h2 | "Dez minutos, para gravar e ouvir de volta" | oral, cronometrado | L2834 |
| m13-crit-voz-lede | §Voz — lede | "Leia em voz alta, cronometrado. O objetivo não é decorar: é ouvir onde a própria fala hesita, porque hesitação em conversa real é onde o interlocutor entra. Se em algum ponto você precisar de um número que não sabe de cabeça, esse ponto é onde o battlecard falha." | cronometrado, oral | L2836 |
| m13-crit-final-h2 | §Final — h2 | "Vinte e oito itens, do primeiro ao último" | — | L2943 |
| m13-crit-final-lede | §Final — lede | "O primeiro item é o critério de domínio inteiro. O último é a disciplina que torna todos os outros publicáveis. Marque mentalmente cada um; os que ficarem em branco são a agenda de estudo." | — | L2945 |
| m13-crit-pill-quiz | hero — pill do quiz | "quiz 8/10" | automatizavel | L611 |
| m13-crit-pill-voz | hero — pill do roteiro oral | "roteiro oral 10 min" | oral, cronometrado | L612 |

**Menções a critério do currículo (não são critério deste módulo):**
- §00.4 — "critério de prontidão separado": "A seção estruturada é autoritativa. A Light entra como estudo de caso dentro da aula de riscos, porque o próprio currículo a cobra em critério de prontidão separado. Empresas cuja atividade é análise de mercado não entram como objeto de análise neste ativo" (L772)
- Aula 06 — 06.3: "O currículo cobra, em critério de prontidão separado, o domínio do caso de recuperação judicial de distribuidora de energia — causas, lições e implicações regulatórias. É um dos poucos casos brasileiros em que uma concessionária de serviço público entrou em recuperação judicial e chegou perto de sair dela com a concessão renovada. Vale como quadro de estudo, não como ficha de battlecard." (L2021)

**Orçamento de tempo.** Trechos que dividem o tempo do critério; ver divergência div-m13-tempo-30-60-vs-uma-hora.
- Aula 03 — título: "Trinta minutos no release, sessenta no Formulário de Referência, e a pergunta que só a segunda leitura permite" (L1356)
- §Voz — penúltimos parágrafos: "Para dominar isto, pegue uma empresa. Leia o release em trinta minutos e o Formulário de Referência em sessenta. Escreva três teses, três riscos e três lacunas. Cada tese diz como o valor será criado, em que horizonte, e o que a derrubaria. Cada risco diz o evento, o caminho até o caixa, e o sinal que aparece antes. Cada lacuna diz o dado que falta, onde procurar, e como a resposta mudaria a conclusão." (L2923)
- Aula 03 — INST·04 (aviso): "Os tempos são referência de treino, não regra. O que não é negociável é a ordem: perímetro antes de operação, operação antes de resultado, resultado antes de caixa, caixa antes de dívida, e síntese apenas no fim. Ler o destaque da capa primeiro é a forma mais eficiente de ancorar a leitura na narrativa da administração." (L1403)
- Aula 08 — 08.3 "A hora, distribuída": ver blocos da Aula 08 (cronologia L2369-2377); orçamento 0-60 min com release em 12-25 e Formulário em 25-40 (L2369)

## Laboratórios e Tradutor

- Laboratórios: 0. Não há § Lab no M13 (zero section de laboratório, zero "LAB·"). O único instrumento fora de aula é o INST·01, no §MAP (instrumentos.json).
- Tradutor: `null`. Não há "§ Map"/Tradutor no M13 (o marcador §MAP é o Painel setorial, extraído em `mapa`).

## Voz e princípios

**§Voz — "Dez minutos, para gravar e ouvir de volta"** (L2833). Lede: "Leia em voz alta, cronometrado. O objetivo não é decorar: é ouvir onde a própria fala hesita, porque hesitação em conversa real é onde o interlocutor entra. Se em algum ponto você precisar de um número que não sabe de cabeça, esse ponto é onde o battlecard falha.". O roteiro tem 13 parágrafos
(P14: oral, cronometrado), todos no JSON (`voz.roteiro_oral.paragrafos`).

**Princípios de voz (6), literais:**

- **§00.3 — o que o módulo recusa fazer** (L725): Existe uma pergunta que este módulo não responde, em nenhuma hipótese, mesmo quando formulada de forma direta: _essa ação é uma boa compra?_ A recusa não é timidez jurídica. É a mesma disciplina que o Módulo 12 construiu para "o Brasil é uma boa aposta?", e tem a mesma razão: a resposta correta depende do horizonte e da tolerância a risco de quem pergunta, e quem responde sim ou não sem saber essas duas coisas não está analisando — está vendendo.
- **§00.3 — segunda razão (conflito sell-side)** (L732): Há, porém, uma segunda razão, específica deste bloco e mais concreta. O próprio currículo lista "relatórios setoriais de corretora" entre os recursos primários deste tema. Esses relatórios são úteis e devem ser lidos — mas vêm de instituições que também assessoram as mesmas empresas em ofertas de ação e de dívida. Isso não é acusação: é uma característica estrutural do modelo de negócio da pesquisa sell-side, divulgada nos próprios relatórios em seção de conflitos de interesse. Um exemplo real e recente torna o ponto concreto: em julho de 2026, a Engie Brasil Energia concluiu uma oferta primária de ações de R$ 8,36 bilhões — e a lista de coordenadores da oferta inclui casas cujas áreas de pesquisa publicam recomendações sobre a própria companhia. A separação entre as duas áreas é regulada e real; o conflito estrutural também.
- **Aula 03 — box "Lacuna vira pergunta, não vira acusação"** (L1478): Lacuna vira pergunta, não vira acusação A saída correta da lente de lacuna é sempre uma pergunta formulável — a alguém de relações com investidores, a um comitê de crédito, a uma sala de diligência. "Não informa a composição das garantias da terceira emissão" é uma lacuna. "A empresa esconde as garantias" é uma acusação sem base, e destrói a credibilidade do resto da análise. A diferença entre as duas formulações é o que separa análise publicável de opinião.
- **Aula 08 — "O que nunca devolver"** (L2402): **O que nunca devolver**Recomendação de compra, venda ou manutenção. Preço-alvo. Projeção de retorno. Comparação do tipo "melhor investimento do setor". Nenhuma dessas saídas é permitida em nenhum ativo da GridAlpha, em nenhuma hipótese, mesmo quando solicitada diretamente — porque o produto é a capacidade analítica do cliente, não a substituição do julgamento dele pelo nosso.
- **§Ref — nota de atualização, último parágrafo** (L3295): Este material é **educacional e analítico**. Não é recomendação de compra, venda ou manutenção de valores mobiliários, não define preço-alvo, não projeta retorno e não substitui auditoria, engenharia, parecer jurídico ou consultoria de investimento regulada. Nem a GridAlpha nem este material constituem consultoria de investimentos.
- **rodapé** (L3305): "GridAlpha · uma nova camada independente de inteligência energética" / "Nenhuma receita de venda de energia · nenhuma comissão · nenhuma recomendação de investimento" / "Verificado em 2 de agosto de 2026 · números e status societários exigem reverificação na fonte primária antes de uso externo"

**Caixas "Onde isso entra no produto" (P7, 9).** Caixas "Onde isso entra no produto · …" (box gd). P7: não exibir ao learner. Oito citam GridAlpha Research (marca morta, P24); a da a01 (L1078) cita só Energy Brief, sem "GridAlpha", e P24 não menciona Energy Brief.
tese L743 "Onde isso entra no produto · GridAlpha Research"; a01 L1078 "Onde isso entra no produto · Energy Brief"; a02 L1341 "Onde isso entra no produto · GridAlpha Research"; a03 L1487 "Onde isso entra no produto · GridAlpha Research"; a04 L1690 "Onde isso entra no produto · GridAlpha Research"; a05 L1926 "Onde isso entra no produto · GridAlpha Research"; a06 L2088 "Onde isso entra no produto · GridAlpha Research"; a07 L2269 "Onde isso entra no produto · GridAlpha Research"; a08 L2406 "Onde isso entra no produto · GridAlpha Research".

**Caixas "Números vivos" (5).** Caixas box rd cuja tag começa por "Números vivos" (instabilidade declarada). Dado com data de validade; o módulo manda reverificar na fonte primária antes de uso externo. As outras caixas box rd (tag diferente) estão em outras_caixas_box_rd.
tese L674; a02 L1172; a04 L1552; a06 L2035; a07 L2199.

**Outras caixas box rd (3).** Caixas box rd com tag diferente de "Números vivos" (mesma classe visual, outro papel). Listadas para a contagem de box rd fechar (8 = 5 + 3).
a05 L1795 "O erro clássico, e ele é frequente"; caso L2508 "Anonimização e escopo"; ref L3282 "Nota de atualização · 2 de agosto de 2026".

**Datas de verificação.** "02·08·2026" × 10; "2 de agosto de 2026" × 11. Contagem de ocorrências literais no arquivo inteiro (markup + script).

## Erros comuns (§Erros, 20)

"Vinte afirmações que circulam, e o que cada uma esconde". Nenhum erro declara aula.

| # | Afirmação | Correção | Por que importa | Origem |
|---|---|---|---|---|
| 1 | "EBITDA é caixa." | "Não é. O EBITDA ignora variação de capital de giro, impostos pagos, juros e investimento. Num setor em que investimento é condição da concessão, ignorar investimento não simplifica — omite o custo principal." | "superestima capacidade de pagar dívida e distribuir dividendo, exatamente nos dois momentos em que o erro é caro." | L2531 |
| 2 | "EV/EBITDA baixo significa ação barata." | "Significa que o valor da firma é baixo em relação a um resultado operacional — o que pode ocorrer porque o ativo está em declínio e o denominador ainda não caiu." | "ativos em fim de concessão são sistematicamente "baratos" por múltiplo até deixarem de existir." | L2535 |
| 3 | "P/E não serve para utilities." | "Serve, quando o lucro é normalizado e a estrutura de capital é comparável. Descartá-lo elimina a única informação sobre quanto do resultado chega ao acionista depois de juros e impostos." | "em transmissora madura com receita contratada, o P/E é mais informativo que o EV/EBITDA." | L2539 |
| 4 | "O ajuste é não recorrente porque a empresa diz que é." | "Recorrência se testa: o item apareceu em mais de dois dos últimos oito trimestres? Houve saída de caixa? A administração poderia tê-lo evitado? Os ajustes são simétricos entre ganhos e perdas?" | "ajustes assimétricos alteram covenants e a métrica de remuneração da administração." | L2543 |
| 5 | "O WACC do setor é 10% real." | "Não existe WACC do setor. O que existe é uma taxa regulatória, definida anualmente pelo regulador, que em 2026 é de 8,10% real depois de impostos e 12,28% antes, para distribuição — o mesmo capital, medido de duas formas." | "a faixa "8-12%" que circula não é intervalo de incerteza, é diferença tributária." | L2547 |
| 6 | "WACC regulatório é o retorno garantido do acionista." | "É um parâmetro administrativo aplicado a uma base de ativos reconhecida e a regras específicas. Eficiência operacional, investimento não reconhecido, qualidade e estrutura de capital real fazem o retorno efetivo divergir." | "confundir os dois transforma um parâmetro de tarifa numa promessa de rentabilidade." | L2551 |
| 7 | "Concessão pode receber perpetuidade porque sempre é renovada." | "Renovação é cenário até virar direito comprovável em contrato aditado, norma ou decisão do regulador." | "em modelo com valor terminal dominante, essa suposição sozinha pode responder por metade do valor calculado." | L2556 |
| 8 | "Setenta por trinta é a estrutura correta de todo financiamento de projeto." | "É uma referência de universo. A capacidade de dívida é uma saída do cálculo de cobertura, não uma entrada." | "projeto exposto a preço de mercado ou a corte de geração suporta muito menos, e o excesso aparece como inadimplemento no primeiro ano ruim." | L2560 |
| 9 | "O índice de cobertura se calcula com EBITDA." | "Calcula-se com o caixa disponível definido em contrato, que deduz impostos pagos, capital de giro e investimento de manutenção antes de chegar ao credor." | "o erro superestima a cobertura exatamente no cenário adverso, que é o único em que a métrica existe para servir." | L2564 |
| 10 | "Dívida em moeda estrangeira é mais barata." | "A taxa nominal é menor; o custo total inclui proteção cambial, volatilidade e risco de refinanciamento." | "em companhia com receita doméstica, o descasamento pode consumir o capital próprio antes de a dívida vencer." | L2568 |
| 11 | "Distribuição alta de dividendos prova qualidade." | "Pode refletir ativo maduro com caixa excedente — ou ausência de oportunidade de investimento, ou distribuição financiada por captação." | "compare com o retorno sobre o capital investido e com o cronograma de investimento obrigatório antes de concluir." | L2572 |
| 12 | "Prejuízo contábil significa caixa negativo." | "Redução ao valor recuperável de ativo, baixa de intangível e efeitos de marcação a mercado geram prejuízo sem saída de caixa no período." | "a decisão exige a demonstração de fluxo de caixa e as notas explicativas, não a última linha do resultado." | L2576 |
| 13 | "O caixa consolidado paga qualquer dívida do grupo." | "Caixa em sociedade de projeto frequentemente está bloqueado por contrato de financiamento enquanto testes de cobertura não forem cumpridos." | "a liquidez da holding pode ser uma fração do caixa consolidado divulgado." | L2580 |
| 14 | "Investimento sempre cria crescimento." | "Cria escala. Cria valor apenas se o retorno incremental superar o custo de capital." | "investimento com retorno abaixo do custo de capital aumenta o EBITDA e destrói valor econômico ao mesmo tempo — e o primeiro efeito é visível, o segundo não." | L2584 |
| 15 | "Empresa integrada deve receber um múltiplo único." | "Segmentos com risco, intensidade de capital e regulador diferentes exigem soma das partes com alocação explícita de dívida e de custos corporativos." | "o múltiplo consolidado mascara subsídio cruzado entre segmentos e o desconto típico de conglomerado." | L2588 |
| 16 | "Formulário de Referência é burocracia." | "É o mapa de controle, contratos, garantias, contingências e governança — os quatro lugares onde moram os riscos que não aparecem no resultado." | "ignorá-lo deixa toda a cauda de risco fora do modelo." | L2592 |
| 17 | "Projeção divulgada pela administração é compromisso." | "É estimativa condicionada, e pode ser revista." | "tratá-la como contrato elimina da análise precisamente a incerteza que a análise existe para medir." | L2595 |
| 18 | "Avaliação de crédito externa dispensa análise de crédito própria." | "É opinião de terceiro, com metodologia própria e prazo de revisão." | "o credor — inclusive o comprador industrial que assina contrato de longo prazo — ainda precisa modelar liquidez, cronograma e cobertura por conta própria." | L2598 |
| 19 | "Comprar a maioria do capital é comprar o controle." | "Só quando participação econômica e poder de voto coincidem. Com ação preferencial, acordo de acionistas, limitação estatutária ou exigência setorial, não coincidem." | "é o erro que faz alguém concluir que um setor foi privatizado quando não foi." | L2602 |
| 20 | "Planilha detalhada é planilha precisa." | "Detalhe sem evidência multiplica premissas e transmite uma confiança que os dados não sustentam." | "a forma esconde a incerteza, e o leitor confunde granularidade com rastreabilidade." | L2606 |

## Divergências registradas neste grupo (12)

| Id | Eixo | Sev. | Leitura A | Leitura B |
|---|---|---|---|---|
| div-m13-horas | fonte × código | media | Fonte: nenhuma declaração de horas (só "roteiro oral 10 min" e o critério "em uma hora"). | Código: { id: 'bloco-13', number: 13, level: 3, title: 'Análise Financeira de Empresas e Projetos',track: 'brasil', illustrationPrefix: null, priority: 'media-alta', estimatedHoursMin: 4, estimatedHoursMax: 5 }, |
| div-m13-caso-parte-13 | fonte × decisão P17 | media | Fonte (§Caso, L2420): "Operação A — Parte 13"; o lede fala em "doze partes anteriores", "Parte 11" e "Parte 12" — numeração da série Operação A ao longo dos módulos. | P17 (decidido sobre o M01) diz que "Não existe Parte 1" e que etapas de interface nunca são "Partes" da fonte. No M13 a própria fonte usa "Parte 13" como rótulo de série. |
| div-m13-tempo-30-60-vs-uma-hora | fonte × fonte | alta | Aula 03 (título) e §Voz: release em 30 min e Formulário de Referência em 60 min (= 90 min); INST·04 reparte 0-30 e 0-60. | Critério (§00.2, Aula 08, §Final item 1): tudo "em uma hora"; 08.3 "A hora, distribuída" dá ao release 12-25 min e ao Formulário 25-40 min. O aviso do INST·04 diz "Os tempos são referência de treino, não regra". |
| div-m13-arquetipo-jv-nome | fonte × fonte | baixa | §MAP.1 (tabela) e Ex 14: "Joint venture coordenada". | INST·01, INST·06, ficha Raízen e §Voz: "Associação com dois controladores coordenados". |
| div-m13-vibra-arquetipo | fonte × fonte | media | §MAP.1 (tabela dos seis arquétipos) lista só "Equatorial Energia" como corporação sem controlador definido; o §Voz enumera os seis arquétipos com nove empresas e omite a Vibra. | INST·01 e INST·06 classificam a Vibra Energia como "Corporação sem controlador definido"; o checklist (item 2) pede o arquétipo de "cada uma das dez empresas vivas". |
| div-m13-codigo-formula-tags | fonte × código | media | Fonte: as 8 fórmulas (div.fx) têm <b>/<em> dentro de div.fd (leitura). | Código: 8 de 8 blocos 'formula' guardam o HTML em `desc` (linhas 103, 105, 136, 138, 140, 153, 196, 198); ApostilaPanel.tsx renderiza `{b.desc}` como texto puro, então as tags apareceriam literais (protocolo §14). Deduzido da leitura do componente, não medido na tela. |
| div-m13-codigo-par-chave-valor | fonte × código | media | Fonte: div.dual (Aulas 01 e 04), div.clk (Aulas 06 e 08) e as 6 fichas div.emp (Aula 07) são pares rótulo/valor sem cabeçalho. | Código: viraram kind 'tabela' (dual L112 e L168; clk L216 e L263; fichas a partir de L229). O componente Tabela promove a 1ª linha a <thead> (protocolo §15); no clk o título <b> foi colado ao corpo sem separador ("Perímetro Empresa, código…"). |
| div-m13-codigo-lead-espacos | fonte × código | baixa | Fonte: ledes das Aulas 05, 06 e 08 com <em>/<b> encostado na pontuação. | Código (MODULO_13_LEAD): espaço antes da pontuação ("sem quebrar .", "capital .", "cronometrado ."); ver roteiro[].comparacao_codigo.lead_diferenca. |
| div-m13-catalogo-siglas | fonte × catálogo | baixa | Fonte (§Lex): verbetes por extenso ("Demonstração do resultado", "Fluxo de caixa livre para a firma", "Retorno sobre o capital investido", "Índice de cobertura do serviço da dívida" etc.). | Catálogo canônico (L1250-1356): resume os termos com siglas que não ocorrem na fonte: DRE, DFC, FCFF, FCFE, ROIC, ROE, VPA, VPL, TIR, ICSD. Também parafraseia verbetes ("Project finance × financiamento corporativo", "Custo de capital próprio e de terceiros"). Título, escala e contagens do catálogo conferem com a fonte. |
| div-m13-marca | fonte × P24 | media | A fonte usa "GridAlpha" em 21 linhas (eyebrow, caixas de produto, rodapé, §Ref, INST·11/quiz). | P24: GridAlpha está morta como marca voltada ao learner. Texto mantido literal aqui (camada fonte). |
| div-m13-catalogo-inst11-nome | fonte × catálogo | baixa | Fonte (span.nm, L2337): "Andaime de tese de investimento · instrumento assinatura". | Catálogo canônico: Andaime de tese de investimento (instrumento assinatura). Os outros 10 nomes de instrumento e os 8 títulos de aula do catálogo são iguais à fonte. |
| div-m13-trilha | fonte × catálogo × código | baixa | Fonte: nenhuma trilha declarada; o kicker traz só "Alexandria · GridAlpha · Módulo 13". | Catálogo: **Trilha** · Especialização Estratégica — **atribuída**; a fonte traz apenas `Alexandria · GridAlpha · Módulo 13`. Código: `track: 'brasil'`, `level: 3` (alexandria-blocks.ts), e alexandria-trilhas.ts trata o bloco-13 como módulo da Trilha 3. |

## Contagens

| Item | Contagem |
|---|---|
| secoes | 18 |
| aulas | 8 |
| aparato | 10 |
| pills | 11 |
| lentes | 3 |
| perguntas_literais_no_map | 2 |
| criterios_literais | 15 |
| voz_paragrafos | 13 |
| principios_de_voz | 6 |
| blocos_produto_P7 | 9 |
| caixas_numeros_vivos | 5 |
| caixas_box_rd | 8 |
| erros_comuns | 20 |
| laboratorios | 0 |
| instrumentos_citados_no_roteiro | 11 |


## Verificação

Verificação adversarial de 2026-09-17, feita com scripts próprios contra o HTML-fonte.

- As strings de conteúdo dos três JSONs (4.741 com 12 ou mais caracteres) foram conferidas contra a fonte normalizada.
  Só não batem campos de anotação: seletor, nota, id, rótulo de extração e saída renderizada.
- As 614 origens foram conferidas: todas estão a ±3 linhas. 1.066 textos com origem foram localizados a partir da
  própria linha de origem.
- As contagens foram recalculadas direto no HTML. Batem:
  - 18 seções, 8 aulas, 11 instrumentos, 20 erros e 9 caixas P7;
  - 180 termos (26/22/26/24/20/26/20/16) e 14 exercícios (4/3/3/2/2);
  - 28 itens de checklist e 36 referências (15/12/4/5, 0 URL, 2 "Consulta em");
  - 21 linhas "GridAlpha", 13 parágrafos do §Voz, 8 "?" no §Caso e as datas (10 e 11).
- **Correção (caixas "Números vivos").** `voz.numeros_vivos` listava as 8 caixas `box rd`, mas só 5 têm a tag
  "Números vivos" (tese L674, a02 L1172, a04 L1552, a06 L2035, a07 L2199). Estas são as outras 3, agora em
  `voz.outras_caixas_box_rd`:
  - "O erro clássico, e ele é frequente" (a05 L1795);
  - "Anonimização e escopo" (caso L2508);
  - "Nota de atualização · 2 de agosto de 2026" (ref L3282).

  Com isso, `contagens.caixas_numeros_vivos` passou de 8 para 5, e entrou `caixas_box_rd` = 8. O extrator
  `m13_modulo.mjs` foi corrigido.
- 12 das 26 divergências foram conferidas na fonte. Nenhuma delas é inventada.

### Segunda verificação adversarial (2026-09-17)

Scripts independentes, fora de `extratores/`, conferiram de novo:

- 3.424 strings de conteúdo contra a fonte normalizada. Só falham campos de anotação e saídas renderizadas.
- As 614 origens, a ±3 linhas, sem falhas.
- As 10 questões do quiz, 100%, contra o array `Q` avaliado em vm: enunciado, 40 alternativas, gabarito
  D B A B C B A D C B, explicação e linha.
- Os 28 itens do checklist: html, texto e linha.
- As fórmulas dos 3 instrumentos numéricos: linhas de cálculo, `codigo_saida`, condições e textos dos 16 ramos,
  atributos min/max/step/value dos 22 pares de campo e `numOf`.
- As contagens declaradas: todas batem. A reexecução dos extratores deu saída idêntica (md5).

- **Correção (nota das caixas P7).** `voz.blocos_produto_P7.nota` dizia que as 9 caixas citam "GridAlpha Research
  ou Energy Brief (marca morta, P24)". Só que P24 só declara morta a marca GridAlpha, e a caixa da a01 (L1078) cita
  apenas "Energy Brief", sem "GridAlpha". A nota foi corrigida no extrator `m13_modulo.mjs`.
- **Correção (README).** O README falava em "9 caixas de produto" entre as linhas com "GridAlpha". As 21 linhas são:
  - o kicker (L599);
  - 15 linhas em 8 caixas P7;
  - a linha "O que nunca devolver" do INST·11 (L2402);
  - 2 linhas do §Ref (L3279 e L3297);
  - o rodapé (L3307);
  - o quiz Q10 (L4218).
