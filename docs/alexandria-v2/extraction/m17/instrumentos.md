# M17 · instrumentos

Fonte (só leitura): `C:/dev/GridAlpha v2/Alexandria modulos/alexandria_modulo17.html`. Saída: [`instrumentos.json`](instrumentos.json). Extrator: `extratores/m17_instrumentos.mjs`.

Markup (título, instrução, alvos, nota de fonte, ponto de invocação) pelo DOM próprio; dados pelo literal do <script> avaliado com vm; saídas e textos de leitura capturados executando os dois <script> originais num DOM simulado (lib.runOriginal), estado a estado (protocolo §10). Nenhum veredito digitado. `formula` é o trecho de cálculo do script, recortado/condensado; `script_verbatim` traz o bloco inteiro literal.

## Resumo

| Id | Título | Onde | Invocado entre | Kind (anotação) | Entradas | Fonte dos números | Tolerância | Código |
|---|---|---|---|---|---|---|---|---|
| m17-inst-01 | Mapa das jurisdições · reagrupamento por dimensão | §MAP (fora de aula) L1321 | Por que dois mercados do mesmo país ent… ⟶ As quatro dimensões, explicadas antes d… | explorador | 1 | null | null | não portado |
| m17-inst-02 | Verificador de perímetro de preço | aula-17-01 L1525 | O caso concreto que ilustra as sete de … ⟶ Câmbio nominal contra paridade de poder… | quebra-cabeca | 7 | null | null | não portado |
| m17-inst-03 | Decompositor de diferença | aula-17-02 L1681 | Exemplo estático · três diferenças reai… ⟶ Capacidade instalada contra geração Cri… | comparador | 2 | null | null | não portado |
| m17-inst-04 | Comparador de desenho de despacho | aula-17-03 L1851 | As três coexistem no mundo e nenhuma do… ⟶ Preço nodal, zonal e uniforme Criança d… | explorador | 2 | null | null | não portado |
| m17-inst-05 | Grade de remuneração de disponibilidade | aula-17-04 L1985 | Mercado central de capacidade Só energi… ⟶ Mercado de capacidade contra mercado só… | explorador | 1 | null | null | não portado |
| m17-inst-06 | Conversor de preço de disponibilidade | aula-17-05 L2129 | A leitura fácil e por que ela é errada … ⟶ Primeiro caso extremo: só energia, com … | calculadora | 4 | srcnote | null | não portado |
| m17-inst-07 | Régua de estágio aplicada a política estrangeira | aula-17-06 L2275 | Isso tem duas leituras e as duas são ve… ⟶ Onde isso entra no produto O Regulatory… | explorador | 1 | srcnote | null | não portado |
| m17-inst-08 | Verificador de pressuposto institucional | aula-17-07 L2394 | No caso desta jurisdição, a omissão é a… ⟶ Onde isso entra no produto Capacidade e… | explorador | 1 | null | null | não portado |
| m17-inst-09 | Calculadora de ajuste de fronteira | aula-17-08 L2539 | A leitura operacional é direta e descon… ⟶ Onde isso entra no produto Capacidade e… | calculadora | 7 | srcnote | null | não portado |
| m17-inst-10 | Decompositor de penetração renovável | aula-17-09 L2669 | Há um terceiro caso na mesma região que… ⟶ (fim da aula) | calculadora | 7 | srcnote | null | não portado |
| m17-inst-11 | Normalizador de preço ao consumidor | aula-17-10 L2777 | A lição de desenho, e ela não é sobre t… ⟶ Onde isso entra no produto Capacidade e… | comparador | 6 | srcnote | null | não portado |
| m17-inst-12 | Verificador de comparação · instrumento assinatura | aula-17-11 L2842 | Categoria O que exatamente falha A perg… ⟶ O fechamento, e ele recusa as duas conc… | explorador | 2 | null | null | não portado |

**Estado no código:** 0 de 12 portados; nenhum divergente (não há o que comparar). (instruments nas aulas: 0).

## Por instrumento

### Instrumento 01 · Mapa das jurisdições · reagrupamento por dimensão

- **Onde:** fora de aula (§MAP), L1321, 8º de 22 blocos de .wrap.
- **Instrução (literal):** Escolha uma das quatro dimensões do critério. As dezessete jurisdições se reagrupam. Observe que a composição dos grupos muda por completo entre uma dimensão e outra — e que nenhuma das quatro é uma ordenação de qualidade.
- **Pergunta:** null. O instrumento não tem pergunta própria: o markup traz só a instrução (`p.inst-intro`). Pergunta de previsão, se houver, é da camada Alexandria (P19).
- **Fonte dos números:** null (a fonte não declara)
- **Tolerâncias:** null (não declaradas).

| Entrada | Tipo | Unidade | Faixa | Padrão |
|---|---|---|---|---|
| i01-dim | chips |  | Preço / Descarbonização / Regulação / Investimento | Preço |

| Saída | Fórmula (script) |
|---|---|
| i01-out  | J.filter(function(j){ return j[it.k]===b; })  // membros; contagem = membros.length |
| i01-v  | veredito, classe att |

**Leitura no cenário-padrão (capturada):** O que este reagrupamento não é. Isto não ordena por nível de preço. Nível sem as sete declarações de perímetro não é comparável. Troque a dimensão e observe que a composição dos grupos muda por completo — é isso que prova que não existe uma ordenação única, e portanto não existe ranking.

Estados capturados: 4.

### Instrumento 02 · Verificador de perímetro de preço

- **Onde:** aula-17-01, L1525, 7º de 9 blocos de .wrap.
- **Instrução (literal):** Marque o que foi declarado sobre cada um dos dois números que alguém colocou lado a lado. O instrumento devolve o que falta e diz se a comparação sobrevive. Ele recusa concluir enquanto qualquer declaração estiver ausente — e essa recusa é o comportamento correto, não uma limitação.
- **Pergunta:** null. O instrumento não tem pergunta própria: o markup traz só a instrução (`p.inst-intro`). Pergunta de previsão, se houver, é da camada Alexandria (P19).
- **Fonte dos números:** null (a fonte não declara)
- **Tolerâncias:** null (não declaradas).

| Entrada | Tipo | Unidade | Faixa | Padrão |
|---|---|---|---|---|
| O que está dentro | alternar (clique na linha) |  |  | Ausente. |
| Quem é o consumidor | alternar (clique na linha) |  |  | Ausente. |
| Qual mercado formou | alternar (clique na linha) |  |  | Ausente. |
| Granularidade e período | alternar (clique na linha) |  |  | Ausente. |
| Tributo e subsídio | alternar (clique na linha) |  |  | Ausente. |
| Base cambial | alternar (clique na linha) |  |  | Ausente. |
| Qual desenho formou | alternar (clique na linha) |  |  | Ausente. |

| Saída | Fórmula (script) |
|---|---|
| i02-rows  | 7 linhas p7-r com "Declarada."/"Ausente." + texto de apoio |
| i02-v  | falta = DECL.filter(d => !state[d.k]); classe = falta.length===0 ? 'ok' : (falta.length>=4 ? 'per' : 'att') |

**Leitura no cenário-padrão (capturada):** 7 de 7 ausentes. A comparação é inválida, não imprecisa. Falta declarar: o que está dentro; quem é o consumidor; qual mercado formou; granularidade e período; tributo e subsídio; base cambial; qual desenho formou. A resposta correta não é estimar a diferença: é devolver a pergunta e pedir a declaração que falta. Se você concluir alguma coisa a partir daqui, a conclusão herda o defeito — e ela vai…

**Ramos:** `falta.length===0` · `falta.length 1–3` · `falta.length>=4`

### Instrumento 03 · Decompositor de diferença

- **Onde:** aula-17-02, L1681, 14º de 16 blocos de .wrap.
- **Instrução (literal):** Escolha um par de jurisdições e uma dimensão. O instrumento identifica qual das três parcelas vincula a diferença, quais concorrem e qual explicitamente não explica nada — que é a informação que quase nunca aparece e que decide se a diferença é lição, geografia ou governo.
- **Pergunta:** null. O instrumento não tem pergunta própria: o markup traz só a instrução (`p.inst-intro`). Pergunta de previsão, se houver, é da camada Alexandria (P19).
- **Fonte dos números:** null (a fonte não declara)
- **Tolerâncias:** null (não declaradas).

| Entrada | Tipo | Unidade | Faixa | Padrão |
|---|---|---|---|---|
| i03-par | chips |  | Brasil × meio-atlântico / Meio-atlântico × sul central / Brasil × Alemanha / Brasil × China / Brasil × Chile / Alemanha… | Brasil × meio-atlântico |
| i03-dim | chips |  | Preço / Descarbonização / Regulação / Investimento | Preço |

| Saída | Fórmula (script) |
|---|---|
| i03-out  | tot = m.dot+m.des+m.pol; legenda '<parcela> '+peso+'/'+tot; segmento zero → 'par3-seg zero' com flex 0.6 e rótulo '<parcela>: 0' |
| i03-v  | vinc = (m.dot>=m.des && m.dot>=m.pol) ? 'dotação' : (m.des>=m.pol ? 'desenho' : 'política'); classe fixa 'ok' |

**Leitura no cenário-padrão (capturada):** Parcela vinculante: desenho. Só a parcela de desenho é discutível como escolha. Antes de propor importação, aplique o Instrumento 08: de que instituição o mecanismo depende, e quem ocupa aquela função aqui. Os pesos acima são ordinais e ilustrativos, não medida — servem para mostrar a forma da decomposição e para forçar a declaração da parcela que não explica.

Estados capturados: 24.

Anomalias dos dados: 13 (ver JSON).

### Instrumento 04 · Comparador de desenho de despacho

- **Onde:** aula-17-03, L1851, 13º de 15 blocos de .wrap.
- **Instrução (literal):** Escolha uma jurisdição e uma dimensão de desenho. O instrumento devolve quem despacha, por qual critério, com que granularidade de preço se forma e quem assume o risco de volume — quatro perguntas que, respondidas juntas, descrevem uma arquitetura inteira.
- **Pergunta:** null. O instrumento não tem pergunta própria: o markup traz só a instrução (`p.inst-intro`). Pergunta de previsão, se houver, é da camada Alexandria (P19).
- **Fonte dos números:** null (a fonte não declara)
- **Tolerâncias:** null (não declaradas).

| Entrada | Tipo | Unidade | Faixa | Padrão |
|---|---|---|---|---|
| i04-jur | chips |  | Brasil / Mercado organizado do … / Mercado organizado do … / Alemanha / China / Chile | Brasil |
| i04-dim | chips |  | Quem despacha e por qual critério / Granularidade do preço / Quem assume risco de volume | Quem despacha e por qual critério |

| Saída | Fórmula (script) |
|---|---|
| i04-out  | j.desp · j.gran · j.risco · j.dot (base J) |
| i04-v  | desp: custo declarado se j.desp começa com 'Custo declarado' ou contém 'custo auditado' (índice>0); gran: j.preco==='nodal' \| 'zonal' \| outro; risco: texto fixo; + sufixo fixo |

**Leitura no cenário-padrão (capturada):** Regime de custo declarado. O preço não resulta de ofertas; resulta de otimização com parâmetros regulatórios. Pressuposto institucional: operador com mandato de otimização, modelo auditável e regulador com competência para fixar parâmetros. Nenhuma das três granularidades domina as outras em abstrato. O que decide é a relação entre onde está o recurso, onde está a carga e quanto custa a linha ent…

Estados capturados: 18.

### Instrumento 05 · Grade de remuneração de disponibilidade

- **Onde:** aula-17-04, L1985, 11º de 13 blocos de .wrap.
- **Instrução (literal):** Para cada jurisdição: quem remunera disponibilidade, com que produto, formado por que preço, com que penalidade e sob que instituição. Inclui o instrumento brasileiro, que existe e tem nome diferente.
- **Pergunta:** null. O instrumento não tem pergunta própria: o markup traz só a instrução (`p.inst-intro`). Pergunta de previsão, se houver, é da camada Alexandria (P19).
- **Fonte dos números:** null (a fonte não declara)
- **Tolerâncias:** null (não declaradas).

| Entrada | Tipo | Unidade | Faixa | Padrão |
|---|---|---|---|---|
| i05-jur | chips |  | Brasil / Mercado organizado do … / Mercado organizado do … / Alemanha / China / Chile | Brasil |

| Saída | Fórmula (script) |
|---|---|
| i05-out  | j.disp · j.dispPreco · j.dispPen · j.dispInst |
| i05-v  | ramo por j.regul: capacidade_central \| so_energia \| leilao_longo_prazo \| else (planejamento); classe fixa 'ok' |

**Leitura no cenário-padrão (capturada):** Leilão de contrato de longo prazo com obrigação de lastro. A função de remunerar disponibilidade existe e tem nome diferente. A diferença real é que o atributo não recebe preço separado: ele é embutido no preço da energia contratada. Dizer “não tem mercado de capacidade” e “é a mesma coisa com outro nome” são as duas frases erradas, em direções opostas.

Estados capturados: 6.

### Instrumento 06 · Conversor de preço de disponibilidade

- **Onde:** aula-17-05, L2129, 12º de 20 blocos de .wrap.
- **Instrução (literal):** Converte um preço de capacidade em custo anual e em equivalente por MWh, para uma carga com fator de carga declarado. Todos os valores de referência são entradas editáveis, com fonte e data no painel. O veredito recusa tratar o resultado como custo real de uma carga específica, e explica por quê.
- **Pergunta:** null. O instrumento não tem pergunta própria: o markup traz só a instrução (`p.inst-intro`). Pergunta de previsão, se houver, é da camada Alexandria (P19).
- **Fonte dos números:** Fonte dos valores de partida: relatórios de leilão de capacidade do operador, entregas 2026/2027 a 2028/2029; consulta em 4 de agosto de 2026. Números vivos. Grandeza: US$/MW-dia sobre capacidade acreditada, não sobre placa. Base cambial: nominal, sem conversão.
- **Tolerâncias:** null (não declaradas).

| Entrada | Tipo | Unidade | Faixa | Padrão |
|---|---|---|---|---|
| Preço de capacidade | number + range espelhado | US$/MW-dia | 0–900 (passo 1) | 325 |
| Capacidade acreditada | number + range espelhado | MW | 1–5000 (passo 1) | 100 |
| Fator de carga da carga | number + range espelhado | % | 5–100 (passo 1) | 85 |
| Dias da janela de entrega | number + range espelhado | dias | 1–400 (passo 1) | 365 |

| Saída | Fórmula (script) |
|---|---|
| Custo da janela (mi) | anual = p*mw*d; exibido 'US$ '+nfmt(anual/1e6,2) |
| Energia no período (GWh) | mwh = mw*fc*24*d; exibido nfmt(mwh/1000,1) |
| Equivalente (/MWh) | perMwh = mwh>0 ? anual/mwh : NaN; exibido 'US$ '+nfmt(perMwh,2) |
| Sobre a placa?  | texto fixo 'não' |
| i06-v  | veredito, classe att |

**Cenário-padrão:** Custo da janela = US$ 11,86 mi · Energia no período = 744,6 GWh · Equivalente = US$ 15,93 /MWh · Sobre a placa? = não

**Leitura no cenário-padrão (capturada):** Este número não é o custo de capacidade de uma carga específica. Três razões, e todas as três importam antes de qualquer citação: a obrigação recai sobre capacidade acreditada, que não é a placa e não é a demanda contratada; a alocação ao consumidor final se dá por meio do agente supridor, segundo regra de rateio própria; e o preço vigente está no teto negociado, o que significa que ele não é o p…

**Ramos:** `sempre` · `fc<0.35` · `p===0 (substitui o alerta de fc)`

- Se p===0 e fc<0.35, só o alerta de preço zero aparece (a atribuição sobrescreve `alerta`).
- O texto-base afirma que "o preço vigente está no teto negociado" para qualquer valor digitado.

### Instrumento 07 · Régua de estágio aplicada a política estrangeira

- **Onde:** aula-17-06, L2275, 12º de 13 blocos de .wrap.
- **Instrução (literal):** A régua de cinco posições construída no Módulo 16 é citada, não reconstruída. Aqui ela é aplicada a instrumentos de política e de regulação estrangeiros. Escolha um instrumento: o painel devolve a posição na régua, a evidência que aquela posição exige, o que ela não autoriza concluir e o gatilho que faria a posição mudar.
- **Pergunta:** null. O instrumento não tem pergunta própria: o markup traz só a instrução (`p.inst-intro`). Pergunta de previsão, se houver, é da camada Alexandria (P19).
- **Fonte dos números:** Estados verificados em fonte primária — texto normativo, orientação administrativa e comunicado de operador — em 4 de agosto de 2026. Números vivos · ciclo político: esta é a categoria mais volátil das três parcelas, e a posição de qualquer item desta lista pode mudar sem que o desenho de mercado da jurisdição se altere.
- **Tolerâncias:** null (não declaradas).

| Entrada | Tipo | Unidade | Faixa | Padrão |
|---|---|---|---|---|
| i07-obj | chips |  | Ajuste de fronteira — regime definitivo / Venda de certificados de fronteira / Abatimento por preço de carbono pago na … | Ajuste de fronteira — regime definitivo |

| Saída | Fórmula (script) |
|---|---|
| i07-out  |  |
| i07-v  | classe = POS[o.p].cls; texto = "O que esta posição não autoriza concluir." + o.nao + sufixo fixo |

**Leitura no cenário-padrão (capturada):** O que esta posição não autoriza concluir. Não autoriza concluir que há desembolso corrente. A obrigação de 2026 se acumula, mas a venda de certificados só começa em 2027 e há fator de entrada gradual até 2034. A régua de cinco posições é construção do Módulo 16 e aqui é citada, não reconstruída. A diferença entre este módulo e o anterior é a categoria de perecibilidade: lá era o estágio de uma te…

Estados capturados: 10.

### Instrumento 08 · Verificador de pressuposto institucional

- **Onde:** aula-17-07, L2394, 15º de 16 blocos de .wrap.
- **Instrução (literal):** Escolha um mecanismo estrangeiro. O instrumento decompõe de quais funções institucionais ele depende para existir — operar, contabilizar, liquidar, fiscalizar, julgar, financiar — e devolve, para cada função, qual instituição brasileira a ocupa, ou se ela está ausente. Usa o mapa do Módulo 07 como gabarito e não o reensina.
- **Pergunta:** null. O instrumento não tem pergunta própria: o markup traz só a instrução (`p.inst-intro`). Pergunta de previsão, se houver, é da camada Alexandria (P19).
- **Menções no texto:** a10 L2774.
- **Fonte dos números:** null (a fonte não declara)
- **Tolerâncias:** null (não declaradas).

| Entrada | Tipo | Unidade | Faixa | Padrão |
|---|---|---|---|---|
| i08-mec | chips |  | Mercado central de capacidade / Preço nodal com direitos financeiros de transmissão / Despacho por oferta / Mercado só … | Mercado central de capacidade |

| Saída | Fórmula (script) |
|---|---|
| i08-out  | chave = função+' — '+requisito; valor = selo(E[estado]) + '<br>' + situação brasileira |
| i08-v  | aus = nº de 'aus'; classe = aus>=3 ? 'per' : (aus>=1 ? 'att' : 'ok'); texto = m.s + ' Funções ausentes: '+aus+' de '+m.f.length+'.' + sufixo |

**Leitura no cenário-padrão (capturada):** Duas das cinco funções mudariam de natureza. A resposta a “o Brasil deveria adotar?” não é sim nem não: é que a adoção criaria um preço separado para um atributo que hoje é embutido, e trocaria a apuração de garantia física por acreditação probabilística. Ambas são escolhas de desenho com custo e benefício próprios. Funções ausentes: 1 de 5. O mapa institucional brasileiro usado como gabarito é o…

Estados capturados: 8.

### Instrumento 09 · Calculadora de ajuste de fronteira

- **Onde:** aula-17-08, L2539, 13º de 14 blocos de .wrap.
- **Instrução (literal):** Todos os parâmetros são entradas editáveis, com fonte e data no painel. O instrumento devolve o custo incremental e recusa tratá-lo como imposto sobre o produto, explicando o que ele é. Observe o efeito de mudar o setor: a inclusão ou não da parcela elétrica altera o resultado mais do que qualquer outro parâmetro.
- **Pergunta:** null. O instrumento não tem pergunta própria: o markup traz só a instrução (`p.inst-intro`). Pergunta de previsão, se houver, é da camada Alexandria (P19).
- **Fonte dos números:** Fonte dos valores de partida: regulamento do mecanismo e atos de execução publicados até a data; preço de certificado conforme publicação oficial trimestral de 2026. Consulta em 4 de agosto de 2026. Números vivos · perímetro: intensidade por instalação e produto, não média nacional. Base cambial: euro nominal, sem conversão. Este instrumento não substitui cálculo jurídico nem verificação acreditada.
- **Tolerâncias:** null (não declaradas).

| Entrada | Tipo | Unidade | Faixa | Padrão |
|---|---|---|---|---|
| setor | chips |  | Ferro e aço / Alumínio / Cimento / Fertilizantes | Ferro e aço |
| Volume exportado | number + range espelhado | kt/ano | 0–2000 (passo 1) | 100 |
| Intensidade direta | number + range espelhado | tCO₂e/t | 0–12 (passo 0.01) | 1.6 |
| Intensidade indireta (eletricidade) | number + range espelhado | tCO₂e/t | 0–12 (passo 0.01) | 0.25 |
| Preço do certificado | number + range espelhado | €/t | 0–250 (passo 0.01) | 75 |
| Fator de entrada gradual | number + range espelhado | % | 0–100 (passo 0.5) | 5 |
| Preço de carbono pago na origem | number + range espelhado | €/t | 0–250 (passo 0.01) | 0 |

| Saída | Fórmula (script) |
|---|---|
| Base contabilizada (kt CO₂e) | vol=kt*1000; intens = dir + (setor.ind ? ind : 0); tco2 = vol*intens; nfmt(tco2/1000,1) |
| Exposição bruta (mi) | bruto = tco2*pc; '€ '+nfmt(bruto/1e6,2) |
| Com fator de entrada (mi) | comFe = bruto*fe (fe = %/100); '€ '+nfmt(comFe/1e6,2) |
| Após abatimento (mi) | liq = tco2*Math.max(0, pc-or)*fe; '€ '+nfmt(liq/1e6,2) |
| Por tonelada (/t) | porT = vol>0 ? liq/vol : 0; '€ '+nfmt(porT,2) |
| Indireta contabilizada  | setor.ind ? 'sim' : 'não' |
| i09-v  | veredito, classe att |

**Cenário-padrão:** Base contabilizada = 160,0 kt CO₂e · Exposição bruta = € 12,00 mi · Com fator de entrada = € 0,60 mi · Após abatimento = € 0,60 mi · Por tonelada = € 6,00 /t · Indireta contabilizada = não

**Leitura no cenário-padrão (capturada):** Isto não é um imposto sobre o produto. É a obrigação de adquirir certificados correspondentes ao carbono incorporado, com preço vinculado ao sistema doméstico de teto e comércio do país de destino, devida pelo importador — a incidência econômica sobre o exportador depende do poder de barganha na cadeia, que este instrumento não modela. Neste setor a emissão indireta de eletricidade NÃO é contabil…

**Ramos:** `setor.ind true (Cimento, Fertilizantes)` · `setor.ind false (Ferro e aço, Alumínio)` · `razao = bruto/comFe > 1.5 → acrescenta "Exposição bruta é N× a obrigação do período…"` · `razao <= 1.5 → sem a frase` · `or>0 → acrescenta "Atenção ao abatimento…"`

Estados capturados: 6.

### Instrumento 10 · Decompositor de penetração renovável

- **Onde:** aula-17-09, L2669, 13º de 13 blocos de .wrap.
- **Instrução (literal):** Entradas editáveis para os quatro números. O veredito recusa reportar qualquer um deles isolado e mostra a razão entre o maior e o menor — que é, na prática, o tamanho do erro que uma citação sem rótulo comete.
- **Pergunta:** null. O instrumento não tem pergunta própria: o markup traz só a instrução (`p.inst-intro`). Pergunta de previsão, se houver, é da camada Alexandria (P19).
- **Fonte dos números:** Valores de partida ilustrativos, editáveis. Para uso externo, substituir por série de organismo oficial de estatística com metodologia publicada, declarando qual dos quatro números está sendo usado e qual o período. Números vivos · perímetro.
- **Tolerâncias:** null (não declaradas).

| Entrada | Tipo | Unidade | Faixa | Padrão |
|---|---|---|---|---|
| Capacidade renovável | number + range espelhado | GW | 0–4000 (passo 0.1) | 140 |
| Capacidade total | number + range espelhado | GW | 1–5000 (passo 0.1) | 250 |
| Geração renovável | number + range espelhado | TWh | 0–8000 (passo 1) | 190 |
| Geração total | number + range espelhado | TWh | 1–12000 (passo 1) | 520 |
| Pico instantâneo de participação | number + range espelhado | % | 0–100 (passo 0.1) | 78 |
| Corte de geração renovável | number + range espelhado | TWh | 0–2000 (passo 0.1) | 12 |
| Saldo importador líquido | number + range espelhado | TWh | -2000–2000 (passo 0.1) | 45 |

| Saída | Fórmula (script) |
|---|---|
| 1 · Capacidade instalada (%) | n1 = ct>0 ? cr/ct*100 : 0; nfmt(n1,1) |
| 2 · Geração no ano (%) | n2 = gt>0 ? gr/gt*100 : 0 |
| 3 · Pico instantâneo (%) | n3 = pk |
| 4 · Consumida líquida (%) | sx>=0: consumo = gt+sx, renCons = gr; sx<0: consumo = max(1e-9, gt+sx), renCons = max(0, gr+sx); n4 = renCons/consumo*100 |
| Corte sobre disponível (%) | perda = (gr+cu)>0 ? cu/(gr+cu)*100 : 0 |
| Maior ÷ menor  | razao = mn>0 ? mx/mn : Infinity; isFinite ? nfmt(razao,2)+'×' : '—' |
| i10-v  | veredito, classe att |

**Cenário-padrão:** 1 · Capacidade instalada = 56,0 % · 2 · Geração no ano = 36,5 % · 3 · Pico instantâneo = 78,0 % · 4 · Consumida líquida = 33,6 % · Corte sobre disponível = 5,9 % · Maior ÷ menor = 2,32×

**Leitura no cenário-padrão (capturada):** Este instrumento recusa reportar um número isolado. Os quatro medem coisas diferentes e nenhum deles é “a penetração renovável”. Com os valores lançados, o maior é 2,32× o menor — e essa razão é, na prática, o tamanho do erro que uma citação sem rótulo comete. Regra de atribuição usada no número 4, declarada: importação tratada como não renovável; exportação abatida da parcela renovável. É uma co…

**Ramos:** `isFinite(razao) && razao>=1.4` · `senão` · `perda>=8 → acrescenta "Corte de geração elevado…"` · `sx>0 → acrescenta "Sistema importador líquido…"` · `sempre → "Regra de atribuição usada no número 4, declarada…"`

Estados capturados: 3.

### Instrumento 11 · Normalizador de preço ao consumidor

- **Onde:** aula-17-10, L2777, 20º de 21 blocos de .wrap.
- **Instrução (literal):** Monte a pilha de custo de dois consumidores industriais em jurisdições diferentes, camada por camada. Todas as camadas são entradas editáveis. O veredito recusa concluir enquanto o perímetro não estiver declarado nos dois lados — e mostra quanto da diferença aparente vinha de camadas que não estavam no mesmo número.
- **Pergunta:** null. O instrumento não tem pergunta própria: o markup traz só a instrução (`p.inst-intro`). Pergunta de previsão, se houver, é da camada Alexandria (P19).
- **Fonte dos números:** Valores de partida ilustrativos e editáveis, não referência de mercado. Números vivos · base cambial: declare nominal ou paridade e use a mesma nos dois lados. Tributo recuperável pela indústria não é custo e deve ser zerado nos dois lados ou mantido nos dois.
- **Tolerâncias:** null (não declaradas).

| Entrada | Tipo | Unidade | Faixa | Padrão |
|---|---|---|---|---|
| A · energia | number + range espelhado | un/MWh | 0–400 (passo 0.5) | 40 |
| A · transporte e encargos | number + range espelhado | un/MWh | 0–400 (passo 0.5) | 45 |
| A · tributos não recuperáveis | number + range espelhado | un/MWh | 0–400 (passo 0.5) | 12 |
| B · energia | number + range espelhado | un/MWh | 0–400 (passo 0.5) | 65 |
| B · transporte e encargos | number + range espelhado | un/MWh | 0–400 (passo 0.5) | 20 |
| B · tributos não recuperáveis | number + range espelhado | un/MWh | 0–400 (passo 0.5) | 8 |

| Saída | Fórmula (script) |
|---|---|
| Só energia  | nfmt(ae,1)+' vs '+nfmt(be,1) |
| + transporte e encargos  | nfmt(ae+ar,1)+' vs '+nfmt(be+br,1) |
| Fatura cheia  | nfmt(ae+ar+at,1)+' vs '+nfmt(be+br+bt,1) |
| Δ só energia (%) | d(a,b) = b!==0 ? (a-b)/b*100 : 0 sobre a camada 1 |
| Δ fatura cheia (%) | d(c3a,c3b) |
| Mais barato na cheia  | cheaper(a,b) = a<b ? 'A' : (a>b ? 'B' : 'empate') |
| i11-v  | inv = cheaper(c1)!==cheaper(c3) && nenhum 'empate' |

**Cenário-padrão:** Só energia = 40,0 vs 65,0 · + transporte e encargos = 85,0 vs 85,0 · Fatura cheia = 97,0 vs 93,0 · Δ só energia = -38,5 % · Δ fatura cheia = 4,3 % · Mais barato na cheia = B

**Leitura no cenário-padrão (capturada):** A ordenação inverte entre camadas. Na camada de energia, A é mais barato; na fatura cheia, B é. As duas afirmações são verdadeiras e descrevem a mesma dupla de consumidores. É a primeira declaração de perímetro em forma de número, e é a razão de a pergunta “o que exatamente está dentro?” vir antes de qualquer conclusão. Este instrumento ainda não conclui nada. Faltam as outras cinco declarações: …

**Ramos:** `inv (ordenação inverte entre camadas)` · `senão`

Estados capturados: 2.

- A camada intermediária (+ transporte e encargos) é exibida mas não entra no teste de inversão, que compara só a camada 1 com a fatura cheia.

### Instrumento 12 · Verificador de comparação · instrumento assinatura

- **Onde:** aula-17-11, L2842, 6º de 12 blocos de .wrap.
- **Instrução (literal):** Doze enunciados comparativos, três por categoria de defeito. Cada um é construído para ser verdadeiro e insuficiente. Filtre por tipo de defeito ou percorra todos. O painel devolve o defeito dominante, o que exatamente falta, a pergunta que você faz e a forma corrigida do enunciado.
- **Pergunta:** null. O instrumento não tem pergunta própria: o markup traz só a instrução (`p.inst-intro`). Pergunta de previsão, se houver, é da camada Alexandria (P19).
- **Fonte dos números:** null (a fonte não declara)
- **Tolerâncias:** null (não declaradas).

| Entrada | Tipo | Unidade | Faixa | Padrão |
|---|---|---|---|---|
| i12-fil | chips |  | Todos / Perímetro / Atribuição / Pressuposto / Unidade | Todos |
| i12-nav | botões |  | ← anterior / próximo → | — |

| Saída | Fórmula (script) |
|---|---|
| i12-out  |  |

Estados capturados: 12.

## Grades geradas por script

- `#jg-main` (§MAP): 17 linhas.
- `#jg-us` (Aula 05): 7 linhas — ausente do código (COD-M17-05).

## Divergências

| Id | Tipo | Tema | Leitura A | Leitura B |
|---|---|---|---|---|
| div-m17-inst-01-i09-sensibilidade | instrução×script | Instrumento 09: "a inclusão ou não da parcela elétrica altera o resultado mais do que qualquer outro parâmetro" | Todos os parâmetros são entradas editáveis, com fonte e data no painel. O instrumento dev… (#i09 p.inst-intro L2542) | Incluir a indireta (Ferro e aço → Cimento, mesmos números) muda o resultado em +15.6%; le… (execução do script no cenário padrão (medição desta extração)) |
| div-m17-inst-02-i03-zero-com-peso | dados do script (rótulo×peso) | Instrumento 03: "A parcela que não explica nada aqui: X" com X de peso 1 | Brasil × meio-atlântico / Preço: zero='política', peso=1; Brasil × meio-atlântico / Desca… (<script> var M L4498) | a legenda exibe "<parcela> 1/10" para a parcela declarada como a que não explica nada (mesma tela (legenda)) |
| div-m17-inst-03-i05-texto-brasileiro-no-chile | script (ramo) | Instrumento 05: ramo leilao_longo_prazo fala de "obrigação de lastro" e das "duas frases erradas" também para o Chile | Leilão de contrato de longo prazo com obrigação de lastro. A função de remunerar disponib… (estado Chile) | Quem remunera e com que produto: Pagamento por potência de suficiência mais leilões de co… (estado Chile (dados J)) |
| div-m17-inst-04-i08-contagem-na-sintese | dados do script (síntese×tabela) | Instrumento 08, "Mercado central de capacidade": "Duas das cinco funções mudariam de natureza" | Duas das cinco funções mudariam de natureza. A resposta a “o Brasil deveria adotar?” não … (MEC[0].s) | natureza distinta: 2; ausente: 1; ocupada: 2 (MEC[0].f (estados)) |
| div-m17-inst-05-i08-teto-classe-ok | script (classe×texto) | Instrumento 08, "Sistema de teto e comércio": classe ok com "nenhuma em operação" | classe verdict ok; Cinco funções previstas e nenhuma em operação. É a definição de regula… (estado "Sistema de teto e comércio") | aus>=3 ? 'per' : (aus>=1 ? 'att' : 'ok') — todas as 5 são 'dif', aus=0 (regra de classe) |
| div-m17-inst-06-i04-quatro-perguntas | instrução×script | Instrumento 04: "quatro perguntas" | Escolha uma jurisdição e uma dimensão de desenho. O instrumento devolve quem despacha, po… (#i04 p.inst-intro) | 3 chips (Quem despacha e por qual critério / Granularidade do preço / Quem assume risco d… (script) |
| div-m17-inst-07-i05-cada-jurisdicao | instrução×script | Instrumento 05: "Para cada jurisdição" | Para cada jurisdição: quem remunera disponibilidade, com que produto, formado por que pre… (#i05 p.inst-intro) | chips só das 6 jurisdições com ficha (J.filter(core)); a grade tem 17 (script) |
| div-m17-inst-08-i07-regua | fonte×fonte | Rótulos da "régua de cinco posições do Módulo 16" | Anunciado · Proposto · Aprovado · Regulamentado · Em operação (Instrumento 07 POS) | regulado e não construído (ficha Brasil / §Lex / caso) |
| div-m17-inst-09-catalogo-descricoes | catálogo×fonte | Descrições do catálogo canônico | descrições dos 12 instrumentos parafraseiam a instrução (p.inst-intro) (catalogo-modulos-alexandria.md) | títulos conferem 12/12 (o 12 com "(instrumento assinatura)" em vez de "· instrumento assi… (fonte) |
| div-m17-inst-10-i12-entidade-escapada | script (escape duplo) | Instrumento 12, enunciado 2: "Forma corrigida do enunciado" exibe entidades HTML como texto | corr:'Dois agregados chamados &ldquo;tarifa industrial média&rdquo; diferem em 30%. …' (<script> i12 E[1].corr L5100) | ['Forma corrigida do enunciado', esc(x.corr)] (<script> i12 render() L5156) |

## Verificação

Verificador adversarial, 2026-09-17, com método próprio (independente de `verify.mjs`): recontagem por regex direto no HTML, `var Q`/`var J`/`var M` avaliados com `vm` e comparação campo a campo.

- **Contagens recalculadas e confirmadas:** 22 seções, 11 aulas, 12 instrumentos (1 no §MAP), 192 termos em 8 famílias (25/19/26/27/20/23/23/29), 18 exercícios (5/5/4/4, `div.dvs`), 30 itens de checklist, 20 erros, 10 questões × 4, 6 fichas × 7, caso 2/5/7 (6 ausentes), 7 faixas de voz, 6 glosas, 8 blocos de referência + 6 categorias (script: 14), 17 jurisdições (15 assinaturas distintas, 13 exclusivas), 11 homônimos no glossário do código, 0 instrumentos/termos do M17 no código.
- **Verbatim, 100%:** 10 questões (enunciado, 4 alternativas, gabarito, explicação), 30 itens de checklist, 192 termos + definições (e linhas), 20 erros, 18 exercícios (categoria, enunciado, resposta), 42 campos de ficha, 5 etapas e 7 declarações do caso, 7 faixas de voz, 22 entradas do roteiro, fórmulas dos 12 instrumentos contra o `<script>` (e cenário-padrão recalculado nos 06, 09, 10 e 11).
- **Amostra:** 298 campos de conteúdo com origem espalhados por todos os grupos: 0 falha verbatim (fora os estados de instrumento, que são composição do script e foram conferidos por fragmento). Origem fora de ±3 linhas: só `m17-cap-08` (L2292 = abertura do `div.box.gd`, trecho em L2296), coerente com a convenção "linha da abertura"; mantido.
- **Divergências conferidas na fonte:** todas as de fonte×fonte citadas (Aula 08/09, glosa carbono, glosa capacidade, 15/13 assinaturas, "Duas coisas" × 4 linhas, flex 2/2/6, 554,72 − 325, I03 13/24 com peso 1, I09 +15,6/+100/+20%, I04 3 chips/4 linhas, I05 6 jurisdições). Nenhuma inventada.
- **Acréscimo (inequívoco):** `div-m17-inst-10-i12-entidade-escapada`. O `corr` do enunciado 2 do Instrumento 12 (L5100) contém `&ldquo;`/`&rdquo;` e o render passa por `esc()` (L5156, L4101), então o learner vê as entidades como texto. O estado capturado já mostrava `&amp;ldquo;`, mas a divergência não estava registrada. Acrescentada no extrator.
- **Fórmulas:** as 12 conferidas contra o script. São condensadas (declarado em `metodo`); a trava `if(cr>ct) cr=ct; if(gr>gt) gr=gt;` do 10 está em `regra_de_consistencia`. Nenhuma diverge.

## Contagens

```json
{
 "instrumentos": 12,
 "em_aula": 11,
 "fora_de_aula": 1,
 "numericos": 4,
 "categoricos": 8,
 "entradas_numericas": 23,
 "estados_capturados": 96,
 "com_fonte_dos_numeros": 5,
 "com_tolerancia_declarada": 0,
 "portados": 0,
 "nao_portados": 12,
 "divergentes": 0,
 "mencoes_no_texto": 1,
 "divergencias": 10
}
```
