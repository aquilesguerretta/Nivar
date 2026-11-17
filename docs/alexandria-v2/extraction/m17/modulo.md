# M17 · grupo "modulo"

Fonte (só leitura): `C:/dev/GridAlpha v2/Alexandria modulos/alexandria_modulo17.html` (5308 linhas). Saída: [`modulo.json`](modulo.json). Extrator: `extratores/m17_modulo.mjs`.

**Como foi extraído.** Parser de DOM próprio (sem dependência) sobre o HTML; literais do `<script>` avaliados com `vm`. Nenhum texto de conteúdo foi digitado. `extratores/verify.mjs` confere cada campo `html`/`texto` como substring normalizada da fonte e cada `origem` contra a linha declarada (resultado em `extratores/verify-resultado.json`).

## Identidade

| Campo | Valor literal | Linha |
|---|---|---|
| `<title>` | Alexandria · Módulo 17 — Cenário Internacional Comparativo | 6 |
| kicker | Alexandria · GridAlpha · Módulo 17 | 896 |
| h1 (título) | Cenário Internacional Comparativo | 897 |
| subtítulo | Nenhum número de um mercado é comparável ao de outro sem que se declare o que está dentro dele. E toda diferença que sobrevive à declaração se decompõe em três… | 898 |
| horas | **null** — A fonte não declara carga horária: zero ocorrência de "hora"/"horas" no arquivo inteiro e nenhum pill de tempo além de "roteiro oral 10 min". O catálogo do código (alexandria-blocks.ts, bloco-17) traz estimatedHoursMin 2 / estimatedHoursMax 3 sem origem nesta fonte (ver divergências). | — |
| trilha | **null** — A fonte não declara trilha nem nível: o kicker diz só "Alexandria · GridAlpha · Módulo 17". O catálogo canônico registra "Especialização Estratégica — atribuída"; o código tem level 3, track "brasil". | — |

**Catálogo canônico (P24).** Título "Cenário Internacional Comparativo": igual ao h1 = **true**. Títulos dos 12 instrumentos iguais: 12 de 12. Rótulos e títulos das 11 aulas iguais na fonte, no código e no catálogo: 11/11.

### Pills do hero

| Pill (markup) | Valor que o script escreve | Regra do script |
|---|---|---|
| — aulas | 11 | set('hp-aulas', document.querySelectorAll('section[id^="a0"], section[id^="a1"]').length); |
| — instrumentos | 12 | set('hp-inst', document.querySelectorAll('.inst-hd').length); |
| 6 fichas de jurisdição | (estático) |  |
| — mercados na grade | 17 | set('hp-jur', J.length); |
| — termos | 192 | set('hp-termos',document.querySelectorAll('.term').length); |
| — exercícios | 18 | set('hp-ex', document.querySelectorAll('#ex details').length); |
| — erros comuns | 20 | var errTbl=document.querySelector('#erros .tbl'); set('hp-err', errTbl ? errTbl.querySele… |
| quiz 8/10 | (estático) |  |
| roteiro oral 10 min | (estático) |  |
| — itens de checklist | 30 | set('hp-ck', document.querySelectorAll('#final .ck li').length); |
| — referências | 14 | set('hp-ref', document.querySelectorAll('#ref .ref-list p').length + document.querySelect… |
| verificado em 04·08·2026 | (estático) |  |

Marca: 23 ocorrências de "GridAlpha" no corpo (P24/P7).

## §00 Tese

36 blocos, literais, em `tese.blocos` (tipos: marcador, titulo_secao, lede, paragrafo, destaque, subtitulo, grade_tres, grade_parcelas, escada, declaracao_conflito, glosa, tabela). Seis glosas de desambiguação com 25 sentidos no total.

## Resultado esperado / capacidades

**`secao_de_modulo: null`.** O M17 não tem seção "Resultado esperado" nem lista de capacidades. As únicas declarações de capacidade estão DENTRO dos blocos "Onde isso entra no produto" (P7), na forma "Capacidade entregue: <b>…</b>". Estão abaixo, literais, como candidatas; todas vivem em bloco de produto e por isso não podem ser exibidas no formato da fonte (P7). `marcacao_p14` é inferência pelo verbo/ tempo ("em menos de um minuto").

| Id | Seção | Capacidade (literal, dentro de bloco P7) | P14 |
|---|---|---|---|
| m17-cap-01 | tese | declarar o perímetro de qualquer número comparado, decompor qualquer diferença observada em dotação, desenho e política, identificar de que instituição um mecanismo estrangeiro depende, e distinguir os quatro números de penetração renovável. | producao_oral_ou_livre |
| m17-cap-02 | map | (bloco de produto sem frase "Capacidade entregue") |  |
| m17-cap-03 | a01 | ouvir uma comparação de preço e enumerar, em menos de um minuto, o que precisa ser declarado antes de a frase significar alguma coisa | cronometrado, producao_oral_ou_livre |
| m17-cap-04 | a02 | diante de qualquer diferença observada, dizer qual parcela vincula, quais concorrem e qual não explica nada | producao_oral_ou_livre |
| m17-cap-05 | a03 | ler um preço de curto prazo sabendo qual desenho o formou, e separar componente locacional de componente sistêmico | producao_oral_ou_livre |
| m17-cap-06 | a04 | distinguir mercado de energia de mercado de capacidade, explicar o que o segundo compra, e reconhecer o instrumento brasileiro de função equivalente sob outro nome | producao_oral_ou_livre |
| m17-cap-07 | a05 | ler preço nodal, separar o componente de congestionamento, distinguir mercado de energia de mercado de capacidade e converter preço de disponibilidade em equivalente por energia | producao_oral_ou_livre |
| m17-cap-08 | a06 | classificar qualquer instrumento estrangeiro entre anunciado, proposto, aprovado, regulamentado e em operação, e dizer o que cada posição autoriza concluir | producao_oral_ou_livre |
| m17-cap-09 | a07 | diante de qualquer mecanismo estrangeiro admirado, identificar de que instituição ele depende e verificar se existe equivalente brasileiro, em vez de responder se funcionaria aqui | producao_oral_ou_livre |
| m17-cap-10 | a08 | separar os três mecanismos de precificação de carbono, classificar o estágio de cada um e dizer o que decide se o custo já corre ou apenas foi anunciado | producao_oral_ou_livre |
| m17-cap-11 | a10 | montar uma pilha de custo comparável entre jurisdições e declarar explicitamente o que ficou de fora | producao_oral_ou_livre |
| m17-cap-12 | final | (bloco de produto sem frase "Capacidade entregue") |  |

## §MAP — perguntas do mapa

Diferente do M01, o §MAP do M17 não traz tabela aula × pergunta. Ele mapeia as 17 jurisdições nas 4 dimensões do critério do currículo. As "perguntas" que a fonte associa ao mapa são as quatro perguntas das dimensões (tabela e objeto DIMS do script), abaixo.

| Dimensão | Pergunta (script DIMS) | O que agrupa | O que não agrupa |
|---|---|---|---|
| Preço | como o preço de curto prazo se forma | Como o preço de curto prazo se forma: nodal por ponto da rede, zonal por área ampla, uniforme por s… | Quanto custa. Nível de preço sem as sete declarações de perímetro não é compará… |
| Descarbonização | o que domina a explicação da intensidade de emissão | O que domina a explicação da intensidade de emissão: dotação renovável, escolha nuclear estruturant… | Quem está mais avançado. A pergunta “mais avançado” embute uma meta que cada pa… |
| Regulação | quem decide adequação de recursos | Quem decide adequação de recursos: mercado central de capacidade, obrigação contratada por agente s… | Qualidade da regulação. Cada arquitetura entrega uma coisa e custa outra — Aula… |
| Investimento | o que estabiliza a receita de um projeto novo | O que estabiliza a receita de um projeto novo: leilão regulado de longo prazo, contrato por diferen… | Atratividade. Ela depende de custo de capital, que depende de moeda, risco sobe… |

Grade: 17 jurisdições (6 com ficha), em `mapa.grade_17`.

## Roteiro

| # | Tipo | Marcador | Título (h2) | Instrumentos | Código |
|---|---|---|---|---|---|
| 1 | aparato | §00 · Tese | “Lá a energia é mais barata” quase nunca é uma afirmação verificável | — | — |
| 2 | aparato | §MAP · Mapa das jurisdições | Dezessete mercados, quatro ordenações, nenhum ranking | I01 | — |
| 3 | aula | Aula 01 · Perímetro | As sete declarações que precedem qualquer comparação de preço | I02 | título/subtítulo iguais · instruments 0 |
| 4 | aula | Aula 02 · Atribuição | Dotação, desenho e política: a diferença que sobreviveu ao perímetro | I03 | título/subtítulo iguais · instruments 0 |
| 5 | aula | Aula 03 · Desenho de despacho | Por custo declarado ou por oferta; nodal, zonal ou uniforme | I04 | título/subtítulo iguais · instruments 0 |
| 6 | aula | Aula 04 · Disponibilidade | Mercado de capacidade é um produto, não uma quantidade | I05 | título/subtítulo iguais · instruments 0 |
| 7 | aula | Aula 05 · Mercados organizados | Sete operadores, um país, e o experimento mais limpo do mundo | I06 | título/subtítulo iguais · instruments 0 |
| 8 | aula | Aula 06 · Ciclo político | A parcela de política, isolada no ambiente mais limpo possível | I07 | título/subtítulo iguais · instruments 0 |
| 9 | aula | Aula 07 · Escala e direcionamento | O maior sistema do mundo em capacidade instalada, e o que isso não significa | I08 | título/subtítulo iguais · instruments 0 |
| 10 | aula | Aula 08 · Carbono comparado | Teto e comércio, tributo e fronteira são três mecanismos distintos | I09 | título/subtítulo iguais · instruments 0 |
| 11 | aula | Aula 09 · Penetração | Quatro números diferentes recebem o mesmo nome | I10 | título/subtítulo iguais · instruments 0 |
| 12 | aula | Aula 10 · Os outros mercados | Cinco casos que ensinam o que os grandes não ensinam | I11 | título/subtítulo iguais · instruments 0 |
| 13 | aula | Aula 11 · Síntese | O verificador aplicado, e o fechamento sem ranking | I12 | título/subtítulo iguais · instruments 0 |
| 14 | aparato | §Fichas · Seis jurisdições | Campos idênticos, sem exceção | — | — |
| 15 | aparato | §Caso · Operação A — Parte 17 | A operação sai do país pela primeira vez | — | — |
| 16 | aparato | §Erros · Vinte erros comuns | O que quebra uma comparação internacional, e a correção imediata | — | — |
| 17 | aparato | §Ex · Exercícios | Dezoito, nas quatro categorias do critério | — | — |
| 18 | aparato | §Quiz · Dez questões | Critério: 8 de 10 | — | — |
| 19 | aparato | §Voz · Roteiro oral | Dez minutos, para um interlocutor internacional | — | — |
| 20 | aparato | §Final · Checklist | Trinta itens, do perímetro ao fechamento | — | — |
| 21 | aparato | §Lex · Glossário | Termos de comparação entre jurisdições, em oito famílias | — | — |
| 22 | aparato | §Ref · Referências | Fontes, hierarquia e data de consulta | — | — |

**Contagem de aulas (P8):** seções "Aula NN" 11 · regra do hero 11 · código 11 (totalInModule 11) · AULAS_POR_BLOCO 11 · catálogo 11. Concordam: **true**.

## Critérios (P14/P18)

P18: nenhuma forma abaixo é "o" critério. Diferente do M01, aqui a prosa do §Quiz (8 de 10) e o limiar do script (acertos>=8) CONCORDAM. O critério do currículo (comparar em 4 dimensões e explicar a diferença) é qualitativo e não tem limiar. §Ex e §Final não declaram limiar nem regra de aprovação.

| Id | Seção | Literal | P14 |
|---|---|---|---|
| m17-crit-curriculo | §MAP | O critério do currículo pede comparar o Brasil com cinco outros mercados em quatro dimensões — preço, descarbonização, regulação e investim… | producao_oral_ou_livre |
| m17-crit-metodo | §00 | Declaro isto como construção própria, do mesmo modo que o Módulo 15 declarou o critério de regime e camada e o Módulo 16 declarou a régua d… |  |
| m17-crit-quiz | §Quiz | Critério: 8 de 10 | automatizavel_quiz |
| m17-crit-exercicios | §Ex | Cinco de declaração de perímetro, cinco de atribuição, quatro de pressuposto institucional e quatro de unidade. Escreva a resposta antes de… | autoavaliado_sem_registro, producao_oral_ou_livre |
| m17-crit-checklist | §Final | Percorra antes de aceitar, produzir ou repetir qualquer comparação internacional. O primeiro item é o mais usado; o último é o mais difícil… | autoavaliado_sem_registro |
| m17-crit-voz | §Voz | Dez minutos, para um interlocutor internacional | producao_oral_ou_livre, cronometrado |

Mensagens do placar (script): ≥8 → "Critério atingido. Você declara perímetro, decompõe em dotação, desenho e política, e identifica o pressuposto institucional de um mecanismo estrangeiro." · <8 → "Critério é 8 de 10. Revise a Aula 01 para perímetro, a Aula 02 para atribuição e o Instrumento 08 para pressuposto institucional antes de refazer.".

## Laboratórios

Não há "§ Lab" no M17 (varredura: zero "§Lab"/"Lab ·"/"Laboratório"). O único instrumento fora de aula é o Instrumento 01 (Mapa das jurisdições), no §MAP — está em instrumentos.json com `fora_de_aula: true`. O §Fichas (6 fichas × 7 campos) é recurso de módulo e está em aparato.json.

## Voz e princípios

Roteiro oral (§Voz), 7 faixas, P14 = oral + cronometrado:

| Faixa | Título |
|---|---|
| 0–1 min | A abertura, que recusa a pergunta antes de respondê-la |
| 1–3 min | As sete declarações |
| 3–5 min | A decomposição em três parcelas |
| 5–6 min | O exemplo que fecha o argumento |
| 6–7:30 min | A terceira lente, que é a que muda a conversa |
| 7:30–9 min | Onde o Brasil entra |
| 9–10 min | O fechamento |

Princípios (ponteiros para `tese.blocos`): A afirmação que organiza o módulo (m17-tese-b05, L936); Simetria obrigatória (m17-tese-b13, L1002); Régua de nomeação (4 faixas) (m17-tese-b17, L1023); O que isso custa em precisão (m17-tese-b18, L1044); Declaração de conflito de interesse (m17-tese-b20, L1056); O que este módulo não faz (m17-tese-b31, L1211); Números vivos (m17-tese-b32, L1229).

## Erros comuns

20 itens literais (§Erros), mais 3 ponteiros para destaques de erro dentro das aulas (aula-17-04 "As duas frases erradas"; aula-17-05 "A leitura fácil e por que ela é errada"; aula-17-07 "Erro comum, na versão comparativa").

| # | Erro | Correção imediata |
|---|---|---|
| 01 | “Lá a energia é mais barata” sem dizer o que está dentro dos dois números | Enumere as sete declarações. Se qualquer uma faltar, a comparação é inválida, não imprecisa |
| 02 | Tratar o câmbio como o problema principal de uma comparação de preço | É o menor dos sete na maioria dos casos, e frequentemente o único que o interlocutor já resolveu |
| 03 | Comparar tarifa ao consumidor final de um país com preço de atacado de outro | Compare atacado com atacado, ou decomponha a tarifa em energia, transporte, encargos e tributos nos dois lados |
| 04 | Usar participação em capacidade instalada para afirmar que uma fonte domina a geração | Mostre capacidade instalada, geração e fator de utilização separadamente, sempre os três |
| 05 | Citar penetração renovável sem dizer qual dos quatro números é | Rotule: capacidade instalada, geração no ano, pico instantâneo, ou energia consumida líquida de corte e intercâmbio |
| 06 | Atribuir a mérito de política uma diferença dominada por dotação | Decomponha antes de concluir, e diga explicitamente qual das três parcelas não explica nada |
| 07 | Ler mudança de governo como mudança de desenho de mercado | Governo altera a parcela de política; raramente altera desenho no mesmo mandato; nunca altera dotação |
| 08 | Descrever um mecanismo estrangeiro sem a instituição que o sustenta | Nomeie quem opera, contabiliza, liquida, fiscaliza e julga — e verifique quem ocupa cada função aqui |
| 09 | “Eles não têm mercado de capacidade, então não planejam” | Há planejamento de rede, requisitos de serviços ancilares e regras administrativas. Ausência de leilão central não é ausência de obrigação de adequação |
| 10 | “Eles têm mercado de capacidade, então a confiabilidade está garantida” | Verifique requisito, déficit, acreditação, penalidade e fila de conexão. O último leilão fechar no teto e ainda assim exigir procedimento extraordinário é o contraexemplo |
| 11 | Tratar preço de curto prazo negativo como prova de excesso permanente | Pode refletir hora, localização, restrição de rede e inflexibilidade de despacho. É informação sobre uma combinação de tempo e lugar, não sobre um sistema |
| 12 | Comparar meta futura de uma jurisdição com resultado realizado de outra | Separe meta, política adotada e resultado verificado. São três estágios da mesma régua |
| 13 | Usar paridade de poder de compra para comparar competitividade exportadora | Paridade serve para acessibilidade doméstica. Competitividade, dívida e equipamento importado correm em câmbio nominal |
| 14 | Comparar indicador de qualidade de serviço entre países como se fosse o mesmo indicador | Regras de exclusão de eventos, cobertura rural e tratamento de interrupções de transmissão variam. Leia a norma antes do ranking |
| 15 | Tratar um mecanismo de ajuste de fronteira como tarifa fixa por tonelada de produto | Depende de código de oito dígitos, de emissão direta e indireta conforme o setor, de preço de certificado, de fator de entrada gradual e de abatimento por preço pago na origem |
| 16 | Supor que emissão indireta de eletricidade entra em todos os setores cobertos | Entra para cimento e fertilizantes; não entra para ferro, aço e alumínio no regime definitivo |
| 17 | Somar exposição bruta de fronteira sem cronograma de caixa | Obrigação acumulada não é desembolso corrente. Venda de certificados e primeira declaração têm datas próprias e o fator de entrada é gradual |
| 18 | Assumir que contrato renovável ou certificado reduz automaticamente a emissão reportada | Depende inteiramente da metodologia de atribuição aceita, não do texto do certificado. Módulo 16, escopo 2 |
| 19 | Tratar material de plataforma comercial, consultoria ou associação setorial como origem de número | É posição de parte interessada: citável com nome e data, jamais como fonte de número. Vale também para material que favorece o próprio GridAlpha |
| 20 | Concluir por uma dimensão só — “é barato, logo o modelo funciona” | Um mercado barato pode ser barato por subsídio, por dotação ou por subinvestimento em confiabilidade, e as três levam a lugares diferentes. Cruze pelo menos duas das quatro dimensões |

## Tradutor / § Map

O M17 não tem "Tradutor" nem "§ Map" (caixa baixa). A função mais próxima são os 6 blocos "três níveis" (Criança de 12 anos / Executivo / Especialista) dentro das aulas 01, 02, 03 (2), 04 e 08 — listados em `roteiro[].tres_niveis`; o texto deles é conteúdo de aula (grupo de aulas), não do módulo.

## Comparação com o código (P8)

- Leads do código iguais ao lede da fonte (texto): 11/11.
- Cobertura por palavra (código × fonte, sem instrumento): 01 99.35% · 02 99.67% · 03 99.1% · 04 99.28% · 05 100% · 06 100% · 07 100% · 08 99.41% · 09 100% · 10 100% · 11 100%. Os únicos tokens não casados são os rótulos dos blocos "três níveis" (COD-M17-01).
- Instrumentos no código: 0. Exercícios: 18 (importados em alexandria-curriculo.ts: false).
- Catálogo do código (bloco-17): level 3, track brasil, horas 2–3 (sem origem na fonte).

| Id | Sev. | Tema | Evidência |
|---|---|---|---|
| COD-M17-01 | media | Rótulos dos 6 blocos "três níveis" (lv-hd) ausentes no código | O código grava label "Três níveis" e perde o rótulo da fonte: aula-17-01: "Câmbio nominal contra paridade de poder de compra"; aula-17-02: "Capacidade instalada contra geração"; aula-17-03: "Despacho por custo declarado… |
| COD-M17-02 | media | Protocolo §15: 6 tabelas do código vêm de estruturas sem <th> (p7, tri, cn5, grg) e têm a 1ª linha de dado promovida a cabeçalho | ver comparacao_codigo.tabelas_do_codigo_sem_cabecalho_na_fonte |
| COD-M17-03 | media | Aula 02: o exemplo estático #par3-demo (3 exemplos, 3 barras) virou uma nota "Proporção" única | Os três exemplos foram fundidos numa nota; as proporções (flex) das barras se perderam (só os rótulos dos segmentos sobraram); o html termina com um "<" solto. |
| COD-M17-04 | baixa | Aula 05: a declaração de conflito (div.conf) virou `titulo` + dois parágrafos | O rótulo "Conflito de interesse · repetido aqui por obrigação" é renderizado como título de seção. |
| COD-M17-05 | media | Aula 05: grade #jg-us (7 operadores, gerada pelo script) ausente | Os 7 "traços" do script (ex.: "Maior em carga da família…") não estão no código. |
| COD-M17-06 | alta | Instrumentos: 0 de 12 portados | Todas as 11 aulas têm instruments: []; não há calculadora M17 em alexandria-instrument-calculators.ts. Detalhe em instrumentos.json. |
| COD-M17-07 | media | Exercícios sem categoria, com points: 1 sem origem, e não consumidos | MODULO_17_EXERCICIOS_SOLTOS (18) não é importado por alexandria-curriculo.ts nem por outro arquivo de src; categoria estrutural (div.dvs) descartada. |
| COD-M17-08 | alta | Aparato do módulo ausente do código | §00, §MAP (grade 17×4), §Fichas, §Caso, §Erros, §Quiz, §Voz, §Final, §Lex (192 termos) e §Ref não existem em src/lib/data. Glossário: zero verbete gl-m17. |
| COD-M17-09 | baixa | Horas 2–3 no catálogo do código sem origem na fonte | ver div-m17-07-horas |

## Divergências (fonte × fonte, × catálogo, × código)

Nenhuma resolvida (camada fonte).

| Id | Tipo | Tema | Leitura A | Leitura B |
|---|---|---|---|---|
| div-m17-01-aula-dos-quatro-numeros | fonte×fonte | Qual aula separa os quatro números de penetração | A distinção se ramifica em quatro números, não dois, e a Aula 08 os separa: (section#a02 #lv2 (Especialista) L1715) | Participação em capacidade instalada não é participação em geração, e a Aula 09 separa os… (section#a07 p L2322) |
| div-m17-02-glosa-carbono-aula | fonte×fonte | Glosa "carbono" aponta a Aula 07 como objeto | Quatro sentidos, e o Módulo 16 já separou os dois primeiros. Aqui entram os dois últimos,… (section#tese .glo (6 de 6) L1184) | Aula 08 · Carbono comparado (section#a08 .sec-id) |
| div-m17-03-onde-mora-a-glosa-capacidade | fonte×fonte | Onde "mora" a glosa quíntupla de capacidade | Aula 04, onde mora esta glosa. (section#tese .glo (1 de 6), sentido E, L1082) | ver a glosa quíntupla do §00. (section#lex Família 4 L3800) |
| div-m17-04-assinaturas-unicas | fonte×script | "Quinze das dezessete jurisdições têm assinatura de quatro dimensões única" | Quinze das dezessete jurisdições têm assinatura de quatro dimensões única. Duas colisões … (section#map p L1375) | Medido nos dados do script: 15 assinaturas distintas; 13 jurisdições com assinatura exclu… (<script> var J L4185) |
| div-m17-06-duas-versoes-da-tese | fonte×fonte (forma) | Tese em duas redações | Nenhum número de um mercado é comparável ao de outro sem que se declare o que está dentro… (div.hero p.sub L898) | Nenhum número de um mercado é comparável ao de outro sem que se declare o que está dentro… (section#tese .box (A afirmação que organiza o módulo) L936) |
| div-m17-07-horas | fonte×código | Carga horária | nenhuma declaração de horas (fonte inteira) | estimatedHoursMin: 2, estimatedHoursMax: 3 (src/lib/data/alexandria-blocks.ts bloco-17) |
| div-m17-08-catalogo-travessoes | fonte×catálogo | Pills com travessão no hero | 8 pills com "—": aulas, instrumentos, mercados na grade, termos, exercícios, erros comuns… (div.hero .pill b[id]) | "sete campos — aulas, instrumentos, mercados na grade, termos, exercícios, erros comuns, … (catalogo-modulos-alexandria.md, Módulo 17) |
| div-m17-09-referencias-contagem-script | fonte (script)×prosa | O que conta como "referência" | set('hp-ref', document.querySelectorAll('#ref .ref-list p').length + document.querySelect… (<script> hp-ref L4367) | A tabela é de categorias ("Categoria / Serve como fonte de / Não serve como fonte de"), n… (section#ref) |
| div-m17-10-codigo-comentario-categorias-ex | fonte×código | Categoria dos exercícios | Declaração de perímetro \| Atribuição \| Pressuposto institucional \| Unidade (section#ex div.dvs (4 divisores)) | o markup NÃO marca cada exercício com a sua. Atribuir por posição seria inferência, não e… (alexandria-modulo-17-content.ts (comentário "EXERCÍCIO")) |
| div-m17-11-caso-parte-17 | fonte×decisão | Numeração de parte do caso Operação A | §Caso · Operação A — Parte 17 (section#caso .sec-id) | Não existe "Parte 1". O título é Caso — Operação A. (decisoes/2026-09-16 P17) |
| div-m17-12-duas-coisas-quatro-linhas | fonte×fonte (prosa×markup) | Aula 06: "Duas coisas mudaram" antes de uma tabela de quatro linhas | Duas coisas mudaram desde então e nenhuma delas está no material comparativo que circula: (section#a06 p L2223) | 4 linhas: O prazo de início de construção \| O critério de gasto mínimo \| Restrições de ca… (section#a06 table L2225) |
| div-m17-13-barra-par3-empate | fonte×fonte (barra×prosa) | Aula 02, exemplo estático 1: desenho "é a que menos explica" com a mesma largura de dotação | dotação flex:2 · desenho flex:2 · política flex:6 (section#a02 #par3-demo barra 1 L1640) | A parcela de desenho é a que menos explica (section#a02 #par3-demo nota 1 L1645) |
| div-m17-14-teto-maior-que-o-teto | fonte×fonte (prosa×números) | "a diferença entre o teto e a estimativa sem teto é maior que o próprio teto" | a diferença entre o teto e a estimativa sem teto é maior que o próprio teto (section#a05 .box.rd L2113 (repetido no feedback da Q7 do quiz)) | Entrega 2028/2029: Anunciado em 14 de julho de 2026: US$ 325/MW-dia, queda de 2,5%, 138.3… (section#a05 .cn5 item 3 L2104) |

## Verificações da fonte que conferem

- **Tabela de concordância entre dimensões (§MAP).** REPRODUZIDA: Jaccard sobre os 136 pares (pares no mesmo grupo nas duas dimensões ÷ pares no mesmo grupo em pelo menos uma) dá preço×investimento 0,500, regulação×investimento 0,395, preço×regulação 0,190 e as outras três 0,094/0,125/0,125 (≤0,125). A fórmula não está escrita na fonte; é a que reproduz os valores.
- **As duas colisões declaradas.** Conferem nos dados do script: China = Jurisdição vizinha do cone sul; Operador do nordeste atlântico = Operador do extremo nordeste.
- **"dois dos sete mercados nodais norte-americanos não têm nenhum" (mercado de capacidade).** Confere: entre os 7 da família (pjm, erc, cai, nyi, mis, ine, spp), regul = so_energia em erc e spp; cai tem obrigacao_supridor.
- **"leilão de longo prazo é o arranjo dominante em quatro das dezessete" (Aula 11).** Confere: regul = leilao_longo_prazo em br, cl, mx, in.
- **Contagens anunciadas × markup.** §Ex "Dezoito" = 18; §Erros "Vinte" = 20; §Final "Trinta" = 30; §Lex "oito famílias" = 8; §Fichas "Seis"/"Sete campos" = 6 × 7; Aula 05 "Sete operadores" = 7 no #jg-us; Aula 10 "Cinco casos" = 5 h3; Aula 11 "doze enunciados" = 12 no script do Instrumento 12.

## Ausências declaradas

| Campo | Valor | Motivo |
|---|---|---|
| `identidade.horas` | null | a fonte não declara horas |
| `identidade.trilha` | null | só "Alexandria · GridAlpha · Módulo 17" |
| `identidade.eixos` | null | não há eixos rotulados |
| `resultado_esperado.secao_de_modulo` | null | capacidades só existem em blocos P7 |
| `mapa.perguntas_por_aula` | null | o §MAP é jurisdição × dimensão |
| `laboratorios.secao_lab` | null | não há § Lab |
| `tradutor.secao` | null | não há Tradutor |

## Verificação

Verificador adversarial, 2026-09-17, com método próprio (independente de `verify.mjs`): recontagem por regex direto no HTML, `var Q`/`var J`/`var M` avaliados com `vm` e comparação campo a campo.

- **Contagens recalculadas e confirmadas:** 22 seções, 11 aulas, 12 instrumentos (1 no §MAP), 192 termos em 8 famílias (25/19/26/27/20/23/23/29), 18 exercícios (5/5/4/4, `div.dvs`), 30 itens de checklist, 20 erros, 10 questões × 4, 6 fichas × 7, caso 2/5/7 (6 ausentes), 7 faixas de voz, 6 glosas, 8 blocos de referência + 6 categorias (script: 14), 17 jurisdições (15 assinaturas distintas, 13 exclusivas), 11 homônimos no glossário do código, 0 instrumentos/termos do M17 no código.
- **Verbatim, 100%:** 10 questões (enunciado, 4 alternativas, gabarito, explicação), 30 itens de checklist, 192 termos + definições (e linhas), 20 erros, 18 exercícios (categoria, enunciado, resposta), 42 campos de ficha, 5 etapas e 7 declarações do caso, 7 faixas de voz, 22 entradas do roteiro, fórmulas dos 12 instrumentos contra o `<script>` (e cenário-padrão recalculado nos 06, 09, 10 e 11).
- **Amostra:** 298 campos de conteúdo com origem espalhados por todos os grupos: 0 falha verbatim (fora os estados de instrumento, que são composição do script e foram conferidos por fragmento). Origem fora de ±3 linhas: só `m17-cap-08` (L2292 = abertura do `div.box.gd`, trecho em L2296), coerente com a convenção "linha da abertura"; mantido.
- **Divergências conferidas na fonte:** todas as de fonte×fonte citadas (Aula 08/09, glosa carbono, glosa capacidade, 15/13 assinaturas, "Duas coisas" × 4 linhas, flex 2/2/6, 554,72 − 325, I03 13/24 com peso 1, I09 +15,6/+100/+20%, I04 3 chips/4 linhas, I05 6 jurisdições). Nenhuma inventada.
- **Correção 1 (inequívoca):** `criterio.criterios[m17-crit-quiz].script.mensagens` trazia `"pass"`/`"fail"` (a regex pegava o 1º ternário, que é a classe CSS). Agora traz as duas mensagens exibidas pelo script (L5288–5289). Corrigido no extrator.
- **Correção 2 (inequívoca):** `div-m17-09` leitura B dizia "o .ref-list tem 7 blocos de fonte"; a fonte tem 8 `p` no `.ref-list` (L3987–4046), e 8 + (7 `tr` − 1) = 14, o número do script. Corrigido no extrator.

## Contagens

```json
{
 "secoes": 22,
 "aulas": 11,
 "aparatos": 11,
 "pills": 12,
 "pills_com_valor_de_script": 8,
 "tese_blocos": 36,
 "glosas": 6,
 "sentidos_de_glosa": 25,
 "capacidades_em_blocos_de_produto": 10,
 "blocos_de_produto_P7_total": 12,
 "dimensoes_mapa": 4,
 "jurisdicoes_grade": 17,
 "jurisdicoes_com_ficha": 6,
 "criterios_literais": 6,
 "faixas_roteiro_oral": 7,
 "erros_comuns": 20,
 "ponteiros_erro_em_aula": 3,
 "tres_niveis": 6,
 "instrumentos_em_aula": 11,
 "instrumentos_fora_de_aula": 1,
 "divergencias_fonte_catalogo_codigo": 13,
 "codigo_divergencias": 9,
 "verificacoes_da_fonte": 5
}
```
