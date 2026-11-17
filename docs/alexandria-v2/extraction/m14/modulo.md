# M14 · grupo "modulo"

Fonte (só leitura): `C:/dev/GridAlpha v2/Alexandria modulos/alexandria_modulo14.html` (4.352 linhas, LF). Saída: [`modulo.json`](modulo.json). Extrator: [`extratores/m14_modulo.mjs`](extratores/m14_modulo.mjs); este arquivo é gerado por [`extratores/m14_md.mjs`](extratores/m14_md.mjs).
Camada **fonte**: todo texto entre aspas ou em tabela saiu do JSON, e o JSON saiu do HTML por programa; nada foi
digitado nem parafraseado (as tags inline foram removidas na versão .md; o `html` fica no JSON). `L` é a linha
aproximada no HTML-fonte. As divergências ficam com todas as leituras, e nenhuma é resolvida aqui (P17–P24 valem só
na camada de produto).

**Verificação** (`extratores/m14_verify.mjs`, os três JSONs juntos): 1.937 strings de conteúdo são substring
da fonte normalizada e 424 origens estão na janela da linha declarada, com 0 e 0 falhas; 25 checagens exatas
(contagens contra o markup, quiz campo a campo, scripts verbatim, cenário-padrão reexecutado), 0 falhas.
Cobertura por token: tese 100% (2.526/2.526), map 100% (753/753), erros 100% (846/846), voz 100% (890/890), hero_e_rodape 100% (121/121).

## Identidade

| Campo | Valor literal | Origem |
|---|---|---|
| `<title>` | "Alexandria · Módulo 14 — Biocombustíveis e Bioenergia" | L6 |
| Eyebrow | "Alexandria · GridAlpha · Módulo 14" | L664 |
| Título (h1) | "Biocombustíveis e Bioenergia" | L665 |
| Subtítulo (p.sub) | "A mesma tonelada vira quatro produtos, e quem escolhe qual é a usina — todo dia, por preço relativo. Nenhum número de bioenergia se lê sem três coisas: o ano-safra, a rota, e o produto concorrente que deixou de ser feito." | L666 |
| Pills (hero-meta) | "8 aulas" · "10 instrumentos" · "6 fichas de rota" · "158 termos" · "14 exercícios" · "18 erros comuns" · "quiz 8/10" · "roteiro oral 8 min" · "26 itens de checklist" · "34 referências" · "verificado em 02·08·2026" | L670–L680 |
| Rodapé | "Alexandria · Módulo 14 — Biocombustíveis e Bioenergia" / "GridAlpha · uma nova camada independente de inteligência energética" / "Trilha 2 · Bloco 14 do Currículo Definitivo · verificado em 2 de agosto de 2026" / "Sem venda de energia, de combustível ou de crédito. Receita exclusivamente analítica." | L3232 |
| Verificação declarada | "verificado em 02·08·2026" | Mesma data aparece por extenso no rodapé e nos callouts "Números vivos" e "Data de verificação e limites deste ativo" (2 de agosto de 2026). |
| Horas | `null` | A fonte não declara carga horária em lugar nenhum (busca por "hora" só devolve prosa de conteúdo). O único dado de duração é o pill "roteiro oral 8 min" (§Voz). alexandria-blocks.ts traz estimatedHoursMin: 2 / estimatedHoursMax: 2 para bloco-14, sem origem neste HTML (ver div-m14-horas). |
| Eixos | `null` | A fonte não rotula eixos. Ela declara "três lentes" (§00.2, ver tese, bloco do tipo "cadeia") e a regra de leitura "o ano-safra, a rota, e o produto concorrente" (hero e §00). Nenhuma das duas é chamada de eixo; "muda de eixo" (§00 lede) é figura de linguagem. |

**Trilha declarada pela fonte (duas leituras):**

- footer (rodapé): "Trilha 2 · Bloco 14 do Currículo Definitivo · verificado em 2 de agosto de 2026" (L3236)
- §00.3 (tese), parágrafo: "A hipótese mais provável é que os blocos finais do Nível 3" (L805)

**Catálogo canônico e código (P24).**

- Catálogo (`C:/dev/GridAlpha v2/docs/catalogo-modulos-alexandria.md`): `## Módulo 14 — Biocombustíveis e Bioenergia`. Título igual ao h1: true.
- Escala no catálogo: Escala · 8 aulas · 10 instrumentos · 158 termos · 6 fichas de rota · 14 exercícios · 18 erros comuns · 26 itens de checklist · 34 referências · roteiro oral de 8 min. Verificação em 2 de agosto de 2026. Confere, item a item, com as 11 pills da fonte.
- `alexandria-blocks.ts`: `{ id: 'bloco-14', number: 14, level: 3, title: 'Biocombustíveis e Bioenergia', track: 'brasil', illustrationPrefix: null, priority: 'media', estimatedHoursMin: 2, estimatedHoursMax: 2 },`. Título igual ao h1: true.
- Trilha no catálogo: registra a contradição da própria fonte (rodapé "Trilha 2" × §00.3 "blocos finais do Nível 3") e o nível 3 do repositório. Ver `div-m14-trilha`.
- O título do h1, do `<title>` e dos dois catálogos coincide ("Biocombustíveis e Bioenergia"). O subtítulo (p.sub) é candidato a descritor editorial (P24), nunca a segundo título. Eyebrow e rodapé trazem a marca GridAlpha (div-m14-marca).

## Tese (§00)

Seção § 00 completa, bloco a bloco, na ordem da fonte. Contém a espinha dorsal, as três lentes (§00.2), a declaração de que o critério é construído (§00.3), a regra de nomeação em três estados (§00.4) e as fronteiras (§00.5). Os callouts "Onde isso entra no produto" ficam registrados, mas pelo P7 não vão para a interface.

**Subseções:** §00.1 "A prova de que a espinha dorsal não é retórica" (L719); §00.2 "As três lentes" (L770); §00.3 "O critério de domínio deste bloco é construído, não citado" (L803); §00.4 "A regra de nomeação deste bloco, em três estados" (L834); §00.5 "O que este módulo não faz" (L866).

**As três lentes (§00.2), literais:**

1. **Lente 1 · Arbitragem**: "A decisão contínua entre produtos que competem pelo mesmo insumo. Açúcar contra etanol no mix da moagem; hidratado contra anidro conforme a demanda de bomba e de mistura; bagaço para vapor de processo contra bagaço para eletricidade exportada contra bagaço para hidrólise. Cada arbitragem tem um limiar econômico, e cada limiar depende de uma restrição industrial que o preço sozinho não mostra — a capacidade de alternância da planta." (L778)
2. **Lente 2 · Sazonalidade e firmeza**: "Bioenergia elétrica é sazonal por construção, e a sazonalidade não é defeito. É o que torna a cogeração complementar à hidrologia em vez de concorrente dela. A lente exige separar sempre três grandezas para a mesma planta — potência instalada, energia gerada e energia exportada — e conectar a terceira ao fator de capacidade anual." (L784)
3. **Lente 3 · Política e certificação**: "A camada em que o valor não vem do litro nem do megawatt-hora, mas do documento: percentual de mistura obrigatória, nota de eficiência, crédito de descarbonização, certificado de origem, rastreabilidade. É a lente que determina se um mercado existe — e é a mais volátil de todas, porque muda por resolução de conselho, sem processo legislativo novo." (L789)

<details><summary>Os 29 blocos da §00, na ordem da fonte</summary>

**Marcador:** "§00 · Tese" (L687)

**h2:** "A mesma tonelada vira quatro produtos, e quem escolhe qual não é o operador nacional" (L688)

**Lede:** "Os treze módulos anteriores construíram camadas sobre um mesmo objeto: a física da grandeza, a rede, a tecnologia, a formação de preço, a regra, a história, o mapa institucional, a matriz, a decisão de ambiente de contratação, a anatomia da fatura, o consumidor virado produtor, o país visto de fora, a empresa vista por dentro. Este módulo muda de eixo de um jeito que nenhum anterior mudou: ele sai da eletricidade. É o primeiro cujo objeto principal não é o elétron — é a molécula. E a consequência pedagógica é direta e precisa ser dita antes de qualquer conceito." (L690)

"Quase tudo que os treze módulos anteriores ensinaram sobre despacho centralizado, garantia física e formação de preço em mercado organizado não se aplica aqui. Não existe operador nacional decidindo qual usina sucroenergética produz açúcar e qual produz etanol amanhã. Não existe modelo computacional otimizando o uso do bagaço entre caldeira e hidrólise. Não existe preço de curto prazo publicado semanalmente para a decisão de mix. A decisão de despacho, neste setor, é comercial, descentralizada e diária — tomada dentro de cada planta, por preço relativo, dentro de uma restrição industrial que o preço não mostra. Ler bioenergia com o vocabulário elétrico dos módulos anteriores é o erro de leitura mais frequente de quem vem do setor elétrico, e é o erro que este módulo existe para impedir." (L698)

**Destaque (fórmula):** "A MESMA TONELADA VIRA QUATRO PRODUTOS. Açúcar, etanol, eletricidade e crédito de descarbonização saem do mesmo insumo e disputam o mesmo insumo. É o único setor deste currículo em que a decisão de despacho não é do operador nacional — é comercial, descentralizada e diária. Por isso nenhum número de bioenergia se lê sem três coisas: o ano-safra, a rota, e o produto concorrente que deixou de ser feito." (L708)

**h3:** "§00.1 A prova de que a espinha dorsal não é retórica" (L719)

"Antes de qualquer conceito, dois fatos verificáveis da semana em que este módulo foi escrito. Nenhum dos dois é ilustração inventada: os dois são a razão pela qual o critério de leitura deste bloco tem a forma que tem." (L721)

"Primeiro fato — a regra mudou ontem. Até 31 de julho de 2026, a mistura obrigatória de etanol anidro na gasolina C comum era de 30% (E30), em vigor desde 1º de agosto de 2025. Em 30 de julho de 2026, em edição extra do Diário Oficial da União, foi publicada a Resolução CNPE nº 9/2026, aprovada na reunião do colegiado de 14 de julho, elevando o percentual para 32% (E32) a partir de 1º de agosto de 2026 — em caráter excepcional e temporário, por 180 dias, prorrogáveis uma única vez por igual período. A gasolina premium permanece em 25%. Qualquer material publicado com data de corte em 1º de agosto de 2026 que registre "E30" estava correto na véspera e está errado hoje, e a diferença entre as duas coisas não é distração do autor — é a natureza do objeto." (L725)

"Segundo fato — o mesmo indicador tem dois valores corretos e diferentes. Qual é a participação do etanol de milho na produção nacional de etanol? Há duas respostas, ambas de fonte primária, ambas de 2026, e elas não são comparáveis entre si:" (L735)

**Tabela** (L739):

| Resposta | Valor | Base temporal | O que exatamente foi medido |
|---|---|---|---|
| Balanço Energético Nacional 2026 (EPE) | 25% | Ano-calendário 2025 | Participação do etanol de milho no total de etanol produzido no país entre 1º de janeiro e 31 de dezembro de 2025 |
| 1º Levantamento da safra 2026/27 (Conab) | ≈ 28,1% | Ano-safra 2026/27, projetado | 11,43 bilhões de litros de milho sobre 40,69 bilhões de litros totais, projetados para um ciclo agrícola que começou em abril de 2026 e termina em março de 2027 |

"Os dois números estão certos. Nenhum dos dois é "mais atual" que o outro em qualquer sentido útil, porque eles medem janelas que nem sequer se sobrepõem inteiramente. O primeiro é realizado; o segundo é projeção de primeiro levantamento, sujeito a três revisões ao longo do ciclo. Quem escreve "o etanol de milho já é 28% da produção brasileira" e compara essa fração com uma estatística elétrica de ano-calendário produziu uma comparação que parece válida e não é. E essa é, literalmente, a metade dos erros de citação que circulam sobre este tema." (L747)

**Callout `box rd` — "Números vivos · verificar na fonte antes de uso externo"** (L754):
> "Este módulo tem duas categorias de instabilidade que nenhum anterior teve. A primeira é a base temporal: se um dado é de ano-safra ou de ano-calendário, e de qual ano-safra. A segunda é o estado de política: se um percentual de mistura é teto legal autorizado, percentual em vigor, percentual anunciado com data futura, ou prazo legal já vencido e não implementado. Os quatro estados existem simultaneamente no ordenamento brasileiro hoje, e confundi-los é o defeito dominante do material de imprensa sobre bioenergia."
> "Todos os percentuais, volumes, metas e preços citados neste módulo foram verificados em fonte primária em 2 de agosto de 2026. O corpo do ativo ensina rota, mecanismo e trade-off, que não envelhecem. O que envelhece está isolado em callouts como este e em entradas editáveis dos instrumentos — nenhum preço e nenhum percentual de mistura está cravado em prosa como constante. Antes de qualquer uso externo, reconstrua cada valor em ANP, CNPE/MME, Conab, EPE, ANEEL/ONS, CCEE e B3, com norma, número, ano e data de consulta."

**h3:** "§00.2 As três lentes" (L770)

"Se nenhum número de bioenergia se lê sozinho, a pergunta prática é: sozinho em relação a quê? A resposta são três lentes. Elas não são categorias de conceito — são a ordem em que alguém que precisa entender este setor sem virar especialista dele efetivamente lê. A ordem importa: arbitragem antes de sazonalidade, sazonalidade antes de política." (L772)

**Cadeia (3 caixas)** (L777):
- **Lente 1 · Arbitragem**: "A decisão contínua entre produtos que competem pelo mesmo insumo. Açúcar contra etanol no mix da moagem; hidratado contra anidro conforme a demanda de bomba e de mistura; bagaço para vapor de processo contra bagaço para eletricidade exportada contra bagaço para hidrólise. Cada arbitragem tem um limiar econômico, e cada limiar depende de uma restrição industrial que o preço sozinho não mostra — a capacidade de alternância da planta."
- **Lente 2 · Sazonalidade e firmeza**: "Bioenergia elétrica é sazonal por construção, e a sazonalidade não é defeito. É o que torna a cogeração complementar à hidrologia em vez de concorrente dela. A lente exige separar sempre três grandezas para a mesma planta — potência instalada, energia gerada e energia exportada — e conectar a terceira ao fator de capacidade anual."
- **Lente 3 · Política e certificação**: "A camada em que o valor não vem do litro nem do megawatt-hora, mas do documento: percentual de mistura obrigatória, nota de eficiência, crédito de descarbonização, certificado de origem, rastreabilidade. É a lente que determina se um mercado existe — e é a mais volátil de todas, porque muda por resolução de conselho, sem processo legislativo novo."

"A terceira lente é a nova deste bloco, e é a que treina uma habilidade que nenhum módulo anterior treinou: ler uma política de conteúdo obrigatório como criadora de mercado. O Módulo 09 ensinou a ler um ambiente de contratação; o Módulo 10, uma fatura; o Módulo 12, uma posição geopolítica; o Módulo 13, um demonstrativo. Nenhum deles ensinou a ler um percentual fixado por resolução e perguntar quantos bilhões de litros de demanda aquele percentual criou, quem é obrigado a comprá-los, e quem paga a conta. É o que a Aula 04 faz." (L796)

**h3:** "§00.3 O critério de domínio deste bloco é construído, não citado" (L803)

"Uma declaração de método antes de qualquer conteúdo, e ela precisa ser explícita porque contraria o padrão de treze módulos. O Currículo Definitivo não fornece critério de domínio para o Bloco 14. Todos os blocos numerados de 1 a 13 têm a seção "Critério de domínio" e a seção "Recursos primários"; o Bloco 14 não tem nenhuma das duas — é uma tabela de oito tópicos com uma frase de justificativa, e nada mais. Os Blocos 15 e 16 também não têm. A hipótese mais provável é que os blocos finais do Nível 3 foram escritos como tópicos de cobertura, não como blocos de domínio verificável, o que é coerente com a própria justificativa do currículo: ela fala em "não ignorar esse vetor", e não em conseguir fazer X em Y minutos." (L805)

"O critério abaixo é, portanto, uma construção, derivada da lógica do currículo e declarada como tal. Ele não é citação. Ele foi desenhado para ser coerente com a justificativa declarada do bloco — conversar bem com interlocutor de agro, de indústria e de clima —, verificável como todos os anteriores, e proporcional a um bloco de cobertura e não de decisão." (L814)

**Callout `box cy` — "Critério de domínio construído · Bloco 14"** (L819):
> "Diante de qualquer número de bioenergia apresentado em conversa ou em material — volume, percentual de mistura, potência, preço de crédito —, consegue nomear em menos de um minuto a base temporal, a rota de conversão e o produto concorrente; e consegue explicar, sem consultar nota, por que uma usina sucroenergética entrega energia firme durante metade do ano e por que isso é complementaridade e não defeito."

"Desse critério decorre o instrumento assinatura do módulo, o INST·10 — Verificador de base temporal e rota. Ele funciona como o Verificador de Lacuna do Módulo 13: recebe enunciados construídos para serem verdadeiros e insuficientes, e devolve o que falta para o número ser utilizável. Nenhum dos enunciados dele é falso. Todos são citáveis. E nenhum é usável como está." (L828)

**h3:** "§00.4 A regra de nomeação deste bloco, em três estados" (L834)

"O Módulo 13 inverteu a regra dos Módulos 09 a 12 e tornou a nomeação de companhia e de controlador o padrão esperado, porque o objeto de estudo era literalmente o battlecard financeiro de dez companhias. Este módulo não herda essa inversão. O objeto aqui é uma cadeia produtiva, não uma companhia, e o currículo nomeia exatamente uma empresa no Bloco 14. A régua deste bloco é intermediária, e tem três estados — não dois:" (L836)

**Taxonomia (3 linhas)** (L842):
- ✓ **Permitido** · Zona nomeável: "Nomear a Raízen, porque o currículo a nomeia como tópico, e nomear os seus dois acionistas de referência — Cosan e Shell — quando a estrutura de associação for estruturalmente relevante à explicação. Nomear companhias já nomeadas no Módulo 13 quando houver ponte factual necessária, sempre apontando de volta."
- ~ **Padrão é descrever por estrutura** · Zona anônima: "Qualquer outro grupo sucroenergético, usina, cooperativa, comercializadora de crédito de descarbonização, produtora de biometano, trading de açúcar, agente certificador ou fabricante de equipamento. A forma correta é "um grupo sucroenergético com moagem no Centro-Sul", "um produtor de etanol de milho no Centro-Oeste", "o primeiro agente certificador de origem credenciado pela agência". A tentação de nomear é alta neste setor porque ele tem grupos reconhecíveis — e ceder a ela transforma um módulo de cadeia num ranking de empresas que o currículo não pediu."
- ✕ **Proibido em qualquer zona, sem exceção** · Nunca: "Nome de executivo, presidente, conselheiro ou controlador pessoa física de qualquer companhia, em qualquer hipótese. E nome de concorrente direto do GridAlpha, mesmo quando a estrutura societária de uma empresa legítima tecnicamente os conecte. As duas proibições são idênticas às do Módulo 13 e não se movem."

**h3:** "§00.5 O que este módulo não faz" (L866)

"Oito fronteiras, e vale declará-las porque este bloco encosta em mais territórios vizinhos que qualquer outro do currículo. O Módulo 06 já contou a história do setor, incluindo o Proálcool como política dos anos 1970 — aqui isso é pressuposto de uma frase. O Módulo 08 já tratou a matriz elétrica, incluindo a participação da biomassa na geração; este módulo não reensina a matriz, e desenvolve a rota e a sazonalidade, que aquele não desenvolveu. O Módulo 09 já tratou ACR e ACL: aqui a conexão é ativa e obrigatória, porque a energia de bagaço é vendida nos dois ambientes e a sazonalidade da entrega é exatamente o que torna a estrutura contratual dela diferente. O Módulo 10 dissecou a fatura de energia elétrica; aqui a conexão é outra e é nova — a linha de combustível de uma operação industrial, que aquele módulo não tratou porque não é conta de luz." (L868)

"O Módulo 12 já tratou a geopolítica energética, incluindo a posição do Brasil como segundo produtor mundial de etanol e as misturas obrigatórias como dado da coluna renovável; este módulo não reconta o argumento geopolítico, e desenvolve a cadeia por dentro, que era a fronteira declarada daquele. O Módulo 13 já tratou a Raízen como estudo de caso financeiro e de estrutura de capital: aqui se desenvolve o lado agroindustrial, que lá era fronteira explícita, e não se reabre a estrutura de capital, a recuperação extrajudicial nem a leitura de risco de crédito. O Bloco 15 tratará petróleo, gás, refino e política de preços de combustível fóssil; aqui o diesel e a gasolina aparecem apenas como denominador de um percentual, nunca como objeto. E o Bloco 16 tratará eletrificação de frota; aqui há uma frase de ponte ao fim da aula de etanol, e nada além disso." (L879)

**Callout `box gd` — "Onde isso entra no produto"** (L890):
> "Este é o único bloco do currículo até aqui cujo conteúdo alimenta um segmento de produto citado textualmente no Plano de Negócios. O GridAlpha Research descreve, entre seus outputs, "análises setor-específicas (mineração, agro, data centers, manufatura industrial)" — e a camada de leitura de cadeia que este módulo constrói é exatamente o que distingue uma análise setorial de agro escrita por quem entende o mecanismo de uma escrita por quem repetiu o material de divulgação disponível."
> "Há uma razão específica pela qual a independência importa neste bloco mais que em qualquer outro: a maior parte do material disponível sobre bioenergia é produzida por quem tem interesse econômico direto na expansão das políticas descritas. Uma entidade que representa produtores tem interesse declarado na elevação da mistura obrigatória. Isso não a torna desonesta — torna-a parte interessada, citável com nome e data como posição, nunca como origem de número nem como avaliação imparcial de política pública. É o mesmo tratamento que o Módulo 13 deu a pesquisa de casa de análise vendedora, com o conflito mais direto e mais fácil de explicar. Uma nova camada independente serve para exatamente isto: devolver mecanismo e trade-off onde o material disponível devolve entusiasmo."

**Callout `box rd` — "O que este módulo não conclui"** (L909):
> "Este ativo não recomenda rota de bioenergia, troca de combustível, nem decisão de investimento em ativo do setor, em nenhuma hipótese. Ele descreve rota, mecanismo, escala e trade-off, incluindo os desconfortáveis — competição por uso do solo, intensidade hídrica, dependência de política de conteúdo obrigatório para que exista mercado, e o fato de que a mistura obrigatória é, do ponto de vista de quem abastece, um custo antes de ser um benefício ambiental. Apresentar os dois lados é o conteúdo, não uma concessão. E, herdadas do Módulo 13 e igualmente válidas aqui: nenhuma recomendação de compra, venda ou manutenção de ação, título ou participação, e nenhum preço-alvo, inclusive sobre companhias do setor sucroenergético."

</details>

## Resultado esperado / capacidades

`null`. A fonte não tem seção "Resultado esperado" nem lista de capacidades (busca por "resultado esperado" e "capacidade" como rótulo: zero). O conteúdo mais próximo é o critério construído (m14-crit-01) e os 26 itens do checklist (aparato.json). Nenhuma capacidade foi derivada aqui (P3/P11).

## § MAP — Mapa de rotas

**Pergunta em cinco partes (lede, L929):** "Toda leitura de bioenergia começa na mesma pergunta em cinco partes: de qual insumo isso vem, por qual conversão, virando qual produto, vendido em qual mercado, regulado por qual órgão." Partes em negrito: "insumo", "conversão", "produto", "mercado", "órgão".

**Perguntas por camada (tabela §MAP.1, L977; 6 linhas — o h3 diz "cinco", ver `div-m14-cinco-camadas`):**

| Camada | Pergunta central | Evidência mínima | Falha característica |
|---|---|---|---|
| Insumo | Qual origem, qual volume, qual sazonalidade, qual custo de oportunidade? | Contrato de fornecimento, histórico agrícola da região, raio de coleta, rastreabilidade de origem | Tratar resíduo como gratuito e ilimitado |
| Conversão | Qual rendimento, qual disponibilidade da planta, quanta energia a própria conversão consome? | Balanço de massa, garantia de desempenho do fornecedor, dados operacionais de campanha, licença | Usar rendimento de laboratório ou de campanha piloto como desempenho comercial |
| Produto | Atende à especificação da agência e existe mercado para ele? | Certificado de qualidade, resolução de especificação aplicável, contrato de venda | Precificar biogás bruto como se fosse biometano injetável |
| Logística | Como sai da planta e como chega ao cliente? | Tancagem, duto, carreta, terminal, perdas em trânsito, frete por quilômetro | Ignorar o custo imposto pela baixa densidade energética do produto |
| Carbono | Qual a intensidade no ciclo de vida e quem é dono do atributo? | Nota de eficiência certificada, cadeia de custódia, cláusula contratual de titularidade do atributo | Somar crédito de descarbonização, certificado de origem e crédito voluntário sem testar dupla contagem |
| Economia | O projeto resiste a preço, safra, juros e atraso? | Fluxo de caixa, sensibilidade, cobertura de serviço da dívida, cláusulas restritivas | Apresentar resultado operacional sem capital de giro nem manutenção |

**Cartões das aulas (§MAP.2, 8).** Diferente do M01, o § MAP do M14 não tem coluna de pergunta por aula: cada cartão (a.map-card) traz número, título curto e uma descrição declarativa. `pergunta: null` em todas as 8. As perguntas literais do § MAP são a pergunta em cinco partes (lede) e a "Pergunta central" de cada camada (tabela §MAP.1).

| Aula | Título do cartão | Descrição do cartão | Pergunta | Código | Linha |
|---|---|---|---|---|---|
| Aula 01 | "Hidratado e anidro" | "Dois produtos da mesma destilaria, dois mercados completamente diferentes — e a paridade como a variável que governa apenas um dos dois." | `null` | aula-14-01 | L1002 |
| Aula 02 | "O mix açúcar-etanol" | "A arbitragem contínua entre dois produtos do mesmo caldo, e por que a capacidade industrial de alternância é a restrição que o preço relativo não mostra." | `null` | aula-14-02 | L1003 |
| Aula 03 | "Milho e segunda geração" | "Uma rota sem sazonalidade de safra da mesma forma; outra competindo pelo insumo da própria cogeração da planta." | `null` | aula-14-03 | L1004 |
| Aula 04 | "Biodiesel e conteúdo obrigatório" | "Como um percentual fixado por resolução cria e dimensiona um mercado inteiro — e quem paga por ele." | `null` | aula-14-04 | L1005 |
| Aula 05 | "Bagaço e cogeração" | "Potência, geração e exportação como três números distintos; a sazonalidade como complementaridade; e como essa energia aparece em contrato." | `null` | aula-14-05 | L1006 |
| Aula 06 | "Biogás e biometano" | "O resíduo como insumo, e por que a economia dessa rota é de logística e de escala mínima, não de tecnologia." | `null` | aula-14-06 | L1007 |
| Aula 07 | "Crédito de descarbonização" | "O produto que não é físico: quem tem obrigação, como o preço se forma, e por que ele não pode ser cravado." | `null` | aula-14-07 | L1008 |
| Aula 08 | "Ler uma cadeia" | "Síntese: o verificador de base temporal e rota aplicado de ponta a ponta, sobre enunciados verdadeiros e insuficientes." | `null` | aula-14-08 | L1009 |

**Instrumento de módulo:** INST·01 — Único instrumento fora de aula: vive dentro do § MAP, antes de §MAP.1. Ver `instrumentos.json (m14-inst-01)`.

<details><summary>Os 11 blocos do § MAP, na ordem da fonte</summary>

**Marcador:** "§MAP · Mapa de rotas" (L926)

**h2:** "Seis rotas, um insumo cada, e sempre um produto concorrente pelo mesmo insumo" (L927)

**Lede:** "Toda leitura de bioenergia começa na mesma pergunta em cinco partes: de qual insumo isso vem, por qual conversão, virando qual produto, vendido em qual mercado, regulado por qual órgão. Quem responde às cinco em sequência não erra a rota. Quem pula direto para o produto — "etanol", "biogás", "bioeletricidade" — perde a informação mais importante, que é o que deixou de ser feito com aquele mesmo insumo." (L929)

"O módulo cobre seis rotas. Duas delas usam o mesmo insumo — o bagaço alimenta a caldeira da cogeração e alimenta a hidrólise do etanol de segunda geração —, e essa é a ilustração mais limpa da Lente de Arbitragem em todo o bloco: não é um caso de borda, é o desenho do setor." (L935)

**[instrumento INST·01]** "Mapa de rotas — insumo, conversão, produto, mercado, órgão" (L939) — ver `instrumentos.json`

**h3:** "§MAP.1 A cadeia em cinco camadas, e onde cada uma falha" (L968)

"Cada camada da cadeia tem uma pergunta central, uma evidência mínima que a responde, e um modo característico de falhar. A tabela abaixo é o andaime de qualquer leitura de projeto ou de apresentação de bioenergia — e a ordem dela é a ordem física, não a ordem comercial. Primeiro se prova o insumo e o rendimento; depois se prova que o produto atende à especificação e tem saída logística; só então se atribui preço, incentivo ambiental e financiamento. Um mercado regulado cria demanda; ele não elimina risco de execução, de qualidade nem de capital." (L970)

**Tabela** (L977):

| Camada | Pergunta central | Evidência mínima | Falha característica |
|---|---|---|---|
| Insumo | Qual origem, qual volume, qual sazonalidade, qual custo de oportunidade? | Contrato de fornecimento, histórico agrícola da região, raio de coleta, rastreabilidade de origem | Tratar resíduo como gratuito e ilimitado |
| Conversão | Qual rendimento, qual disponibilidade da planta, quanta energia a própria conversão consome? | Balanço de massa, garantia de desempenho do fornecedor, dados operacionais de campanha, licença | Usar rendimento de laboratório ou de campanha piloto como desempenho comercial |
| Produto | Atende à especificação da agência e existe mercado para ele? | Certificado de qualidade, resolução de especificação aplicável, contrato de venda | Precificar biogás bruto como se fosse biometano injetável |
| Logística | Como sai da planta e como chega ao cliente? | Tancagem, duto, carreta, terminal, perdas em trânsito, frete por quilômetro | Ignorar o custo imposto pela baixa densidade energética do produto |
| Carbono | Qual a intensidade no ciclo de vida e quem é dono do atributo? | Nota de eficiência certificada, cadeia de custódia, cláusula contratual de titularidade do atributo | Somar crédito de descarbonização, certificado de origem e crédito voluntário sem testar dupla contagem |
| Economia | O projeto resiste a preço, safra, juros e atraso? | Fluxo de caixa, sensibilidade, cobertura de serviço da dívida, cláusulas restritivas | Apresentar resultado operacional sem capital de giro nem manutenção |

**Callout `box cy` — "A ordem importa, e ela é física antes de ser financeira"** (L989):
> "A tabela acima é lida de cima para baixo. A tentação, em qualquer apresentação de bioenergia, é começar pela última linha — o retorno — e depois preencher as anteriores como justificativa. Isso produz um documento em que o número financeiro é a premissa e o balanço de massa é a conclusão, o que é o inverso da realidade. Se você só tiver tempo para duas perguntas, faça as duas primeiras: de onde vem o insumo e quanto sobra depois da conversão. As outras quatro dependem das duas."

**h3:** "§MAP.2 As oito aulas" (L999)

**Grade de aulas (8 cartões)** (L1001):
- Aula 01 · "Hidratado e anidro" — "Dois produtos da mesma destilaria, dois mercados completamente diferentes — e a paridade como a variável que governa apenas um dos dois."
- Aula 02 · "O mix açúcar-etanol" — "A arbitragem contínua entre dois produtos do mesmo caldo, e por que a capacidade industrial de alternância é a restrição que o preço relativo não mostra."
- Aula 03 · "Milho e segunda geração" — "Uma rota sem sazonalidade de safra da mesma forma; outra competindo pelo insumo da própria cogeração da planta."
- Aula 04 · "Biodiesel e conteúdo obrigatório" — "Como um percentual fixado por resolução cria e dimensiona um mercado inteiro — e quem paga por ele."
- Aula 05 · "Bagaço e cogeração" — "Potência, geração e exportação como três números distintos; a sazonalidade como complementaridade; e como essa energia aparece em contrato."
- Aula 06 · "Biogás e biometano" — "O resíduo como insumo, e por que a economia dessa rota é de logística e de escala mínima, não de tecnologia."
- Aula 07 · "Crédito de descarbonização" — "O produto que não é físico: quem tem obrigação, como o preço se forma, e por que ele não pode ser cravado."
- Aula 08 · "Ler uma cadeia" — "Síntese: o verificador de base temporal e rota aplicado de ponta a ponta, sobre enunciados verdadeiros e insuficientes."

</details>

## Roteiro (18 seções: 8 aulas e 10 aparatos)

| # | Seção | Marcador | Título (h2) | Subseções | Instrumentos | Linha | Código (`aula-14-NN`) |
|---|---|---|---|---|---|---|---|
| 1 | tese | §00 · Tese | "A mesma tonelada vira quatro produtos, e quem escolhe qual não é o operador nacional" | — | — | L687 | — |
| 2 | map | §MAP · Mapa de rotas | "Seis rotas, um insumo cada, e sempre um produto concorrente pelo mesmo insumo" | — | INST·01 | L926 | — |
| 3 | a01 | Aula 01 · Etanol hidratado e etanol anidro | "Dois produtos da mesma destilaria, dois mercados que não se parecem em nada" | §01.1, §01.2, §01.3 | INST·02 | L1015–1236 | aula-14-01: title=marcador sim; subtitle=h2 sim; instrumentos 0 |
| 4 | a02 | Aula 02 · O mix açúcar-etanol | "A arbitragem que a planta faz todo dia, e a restrição que o preço relativo não mostra" | §02.1, §02.2, §02.3 | INST·03 | L1238–1398 | aula-14-02: title=marcador sim; subtitle=h2 sim; instrumentos 0 |
| 5 | a03 | Aula 03 · Rotas alternativas de etanol | "Uma rota que não tem safra do mesmo jeito, e outra que come o insumo da própria caldeira" | §03.1, §03.2 | INST·04 | L1400–1559 | aula-14-03: title=marcador sim; subtitle=h2 sim; instrumentos 0 |
| 6 | a04 | Aula 04 · Biodiesel e a política de conteúdo obrigatório | "Como um percentual fixado por resolução cria um mercado inteiro — e quem paga por ele" | §04.1, §04.2, §04.3, §04.4 | INST·05 | L1561–1747 | aula-14-04: title=marcador sim; subtitle=h2 sim; instrumentos 0 |
| 7 | a05 | Aula 05 · Bagaço, cogeração e a sazonalidade | "Três números para a mesma planta, e por que meio ano de entrega é complementaridade" | §05.1, §05.2, §05.3, §05.4 | INST·06 | L1749–1913 | aula-14-05: title=marcador sim; subtitle=h2 sim; instrumentos 0 |
| 8 | a06 | Aula 06 · Biogás e biometano | "O resíduo como insumo, e uma economia que é de logística e de escala mínima" | §06.1, §06.2, §06.3 | INST·07 | L1915–2105 | aula-14-06: title=marcador sim; subtitle=h2 sim; instrumentos 0 |
| 9 | a07 | Aula 07 · RenovaBio e o crédito de descarbonização | "O produto que não é físico: quem tem obrigação, como o preço se forma, e por que ele não pode ser cravado" | §07.1, §07.2, §07.3, §07.4 | INST·08 | L2107–2329 | aula-14-07: title=marcador sim; subtitle=h2 sim; instrumentos 0 |
| 10 | a08 | Aula 08 · Síntese — ler uma cadeia | "Seis fichas de campo fixo, e um campo deixado deliberadamente em branco" | §08.1, §08.2 | INST·09, INST·10 | L2331–2512 | aula-14-08: title=marcador sim; subtitle=h2 sim; instrumentos 0 |
| 11 | caso | §Caso · Operação A — Parte 14 | "A linha de custo que nenhuma das treze partes anteriores tocou" | — | — | L2516 | — |
| 12 | erros | §Erros · Dezoito afirmações | "Dezoito frases que circulam, e o que cada uma esconde" | — | — | L2627 | — |
| 13 | ex | §Ex · Catorze exercícios | "Catorze exercícios, gabarito oculto" | — | — | L2661 | — |
| 14 | quiz | §Quiz · Verificação | "Dez questões, critério de oito acertos" | — | — | L2830 | — |
| 15 | voz | §Voz · Roteiro oral | "Oito minutos, para gravar e ouvir de volta" | — | — | L2851 | — |
| 16 | final | §Final · Checklist | "Vinte e seis itens, do primeiro ao último" | — | — | L2883 | — |
| 17 | lex | §Lex · Glossário | "Cento e cinquenta e oito termos, agrupados por família" | — | — | L2935 | — |
| 18 | ref | §Ref · Referências | "Trinta e quatro fontes, separadas por natureza" | — | — | L3155 | — |

**Contagem de aulas (P8).** Fonte: 8 seções `Aula NN`, 8 cartões no §MAP.2, pill "8 aulas". Código: `MODULO_14_AULAS` com 8 aulas, `totalInModule` 8, `alexandria-trilhas.ts` `'bloco-14': 8,   // Biocombustíveis e Bioenergia`; catálogo "8 aulas". Todos concordam. Nas 8 aulas, `title` = rótulo do marcador e `subtitle` = h2; 6 dos 8 cartões do § MAP usam título curto diferente (`div-m14-titulos-curtos-map`).

**Subseções, callouts e fichas por aula, literais:**

- **Aula 01 · Etanol hidratado e etanol anidro**: §01.1 "A diferença física, e por que ela é comercial" (L1027); §01.2 "O teor mudou ontem, e isso é a aula" (L1101); §01.3 "A paridade, e por que a regra dos 70% é uma aproximação histórica e não uma lei" (L1138).
  - Callouts: `box rd` "Números vivos · verificar na fonte antes de uso externo" (L1127); `box gd` "Onde isso entra no produto" (L1222).
- **Aula 02 · O mix açúcar-etanol**: §02.1 "A tonelada de cana não é uma unidade de valor" (L1249); §02.2 "O mix visível nos dados" (L1283); §02.3 "A restrição que o preço não mostra" (L1306).
  - Callouts: `box cy` "A pergunta que fecha a Lente de Arbitragem" (L1376); `box gd` "Onde isso entra no produto" (L1388).
- **Aula 03 · Rotas alternativas de etanol**: §03.1 "Milho: o grão que espera" (L1412); §03.2 "Segunda geração: a rota que disputa o bagaço com a caldeira" (L1468).
  - Callouts: `box cy` "A diferença térmica, que é o custo escondido da rota de milho" (L1456); `box gd` "A régua de maturidade, reaproveitada do Módulo 12 sem alteração" (L1515).
- **Aula 04 · Biodiesel e a política de conteúdo obrigatório**: §04.1 "A rota, em um parágrafo" (L1573); §04.2 "Os quatro estados de um percentual" (L1587); §04.3 "A demanda que a regra cria" (L1628); §04.4 "Matéria-prima, concentração e o trade-off que precisa ser dito" (L1698).
  - Callouts: `box rd` "Números vivos · verificar na fonte antes de uso externo" (L1617); `box cy` "Os dois lados, ditos por inteiro" (L1717); `box gd` "Onde isso entra no produto" (L1735).
- **Aula 05 · Bagaço, cogeração e a sazonalidade**: §05.1 "Potência instalada, energia gerada, energia exportada" (L1761); §05.2 "A sazonalidade como complementaridade, não como defeito" (L1785); §05.3 "Como essa energia aparece em contrato" (L1868); §05.4 "Palha, licor preto e as outras biomassas" (L1885).
  - Callouts: `box cy` "Uma leitura fina que a maioria não faz" (L1801); `box gd` "Onde isso entra no produto" (L1903).
- **Aula 06 · Biogás e biometano**: §06.1 "Biogás não é biometano, e a diferença tem norma" (L1927); §06.2 "A rota de entrega decide a economia" (L1955); §06.3 "O programa que criou a demanda, e o estado dele hoje" (L2031).
  - Callouts: `box cy` "A resposta regulatória à dupla contagem, que quase ninguém cita" (L2061); `box rd` "Números vivos · verificar na fonte antes de uso externo" (L2074); `box gd` "Onde isso entra no produto" (L2094).
- **Aula 07 · RenovaBio e o crédito de descarbonização**: §07.1 "A arquitetura, do conselho à aposentadoria" (L2119); §07.2 "Meta nacional não é a soma das metas individuais" (L2146); §07.3 "Como o crédito nasce: intensidade de carbono e nota de eficiência" (L2182); §07.4 "O preço, e por que ele é a grandeza mais volátil do módulo" (L2228).
  - Callouts: `box cy` "Seis lugares onde uma alegação de carbono se desfaz" (L2216); `box rd` "Números vivos · verificar na fonte antes de uso externo" (L2242); `box gd` "Onde isso entra no produto" (L2316).
- **Aula 08 · Síntese — ler uma cadeia**: §08.1 "O classificador: dado um insumo, o que sai e o que deixa de sair" (L2420); §08.2 "O verificador: enunciados verdadeiros e insuficientes" (L2454).
  - Callouts: `box cy` "O critério, em uma sequência de um minuto" (L2490); `box gd` "Onde isso entra no produto" (L2501).
  - Fichas de rota (`div.emp`, conteúdo de aula, fora deste grupo): 6.

## Critérios literais (6)

Registro literal de todas as formas de critério que a fonte declara. Nenhuma é escolhida (P5/P18). A fonte declara que o critério do bloco é CONSTRUÍDO, não citado do Currículo Definitivo (§00.3). `marcacao_p14` é anotação desta extração, inferida do texto, e precisa de revisão humana.

Declaração de construção (§00.3, L805): "Uma declaração de método antes de qualquer conteúdo, e ela precisa ser explícita porque contraria o padrão de treze módulos. O Currículo Definitivo não fornece critério de domínio para o Bloco 14. Todos os blocos numerados de 1 a 13 têm a seção "Critério de domínio" e a seção "Recursos primários"; o Bloco 14 não tem nenhuma das duas — é uma tabela de oito tópicos com uma frase de justificativa, e nada mais. Os Blocos 15 e 16 também não têm. A hipótese mais provável é que os blocos finais do Nível 3 foram escritos como tópicos de cobertura, não como blocos de domínio verificável, o que é coerente com a própria justificativa do currículo: ela fala em "não ignorar esse vetor", e não em conseguir fazer X em Y minutos."

"O critério abaixo é, portanto, uma construção, derivada da lógica do currículo e declarada como tal. Ele não é citação. Ele foi desenhado para ser coerente com a justificativa declarada do bloco — conversar bem com interlocutor de agro, de indústria e de clima —, verificável como todos os anteriores, e proporcional a um bloco de cobertura e não de decisão." (L814)

| Id | Onde | Texto literal | Marcação P14 (inferida) | Linha |
|---|---|---|---|---|
| m14-crit-01 | §00.3 — "Critério de domínio construído · Bloco 14" | "Diante de qualquer número de bioenergia apresentado em conversa ou em material — volume, percentual de mistura, potência, preço de crédito —, consegue nomear em menos de um minuto a base temporal, a rota de conversão e o produto concorrente; e consegue explicar, sem consultar nota, por que uma usina sucroenergética entrega energia firme durante metade do ano e por que isso é complementaridade e não defeito." | cronometrado, producao_oral_ou_livre — "em menos de um minuto" (cronometrado); "explicar, sem consultar nota" (produção oral/livre) | L819 |
| m14-crit-02 | §Quiz | "O critério é oito de dez. Abaixo disso, a matéria ainda não sustenta uma conversa com interlocutor de agro, de combustíveis ou de clima — não por falta de informação, mas porque o erro em qualquer uma destas questões é de base temporal, de rota, de grandeza ou de estado de política, e esses são exatamente os quatro que alguém que vive o setor identifica na primeira frase." | automatizavel_quiz | L2833 |
| m14-crit-03 | §Voz | "O teste real deste bloco não é escrito — é falado, porque a situação que ele antecipa é uma conversa. Grave os oito minutos abaixo sem ler, ouça de volta, e marque cada momento em que você citou um número sem dizer a base temporal. É a métrica que importa." | producao_oral_ou_livre, cronometrado — gravar oito minutos sem ler; métrica: número citado sem base temporal | L2854 |
| m14-crit-04 | §Final | "O primeiro item é o critério de domínio deste bloco. O último é a disciplina que o Módulo 12 ensinou para "o Brasil é uma boa aposta?" e o Módulo 13 para "essa ação é uma boa compra?", aplicada agora ao tema em que o material disponível é mais enviesado que em qualquer outro do currículo." | autodeclarado | L2886 |
| m14-crit-05 | Aula 08 (§08.2) — "O critério, em uma sequência de um minuto" | "Diante de qualquer número de bioenergia, três perguntas em ordem. Um — base temporal: isto é ano-safra ou ano-calendário, e qual ciclo? Se for safra, é levantamento preliminar ou fechamento? Dois — rota: de qual insumo, por qual conversão? "Etanol" não é uma rota; etanol de cana de primeira geração é. Três — concorrente: o que deixou de ser feito com o mesmo insumo para que este número existisse? Se as três tiverem resposta, o número é utilizável. Se qualquer uma faltar, a resposta correta ao interlocutor não é discordar — é perguntar, e a pergunta certa quase sempre encerra a discussão sem que ninguém precise ter razão." | cronometrado, producao_oral_ou_livre — rótulo "em uma sequência de um minuto"; três perguntas feitas ao interlocutor | L2490 |
| m14-crit-06 | §Ex | "Os catorze refletem a construção do critério deste bloco, e por isso se distribuem em quatro famílias: identificação de base temporal, classificação de rota, separação de grandeza e estado de política. Faça o cálculo ou formule a resposta antes de abrir o gabarito — o valor do exercício está na hesitação, não na conferência." | producao_oral_ou_livre | L2664 |

Limiar no script do quiz: `acertos>=8?'pass':'fail'` (L4337); pill "quiz 8/10". Mensagens do placar em aparato.json (avaliacao.faixas_de_placar_script). P18: o limiar não declara domínio.

P14: `cronometrado` e `producao_oral_ou_livre` são anotação desta extração a partir do verbo de cada critério ("em menos de um minuto", "sem consultar nota", "é falado"), não rótulo da fonte. Precisa de revisão humana.

## Laboratórios (§ Lab)

`null`. Não existe § Lab no M14 (18 seções; nenhuma com marcador Lab; busca por "laborat": zero). O único instrumento de módulo é o INST·01, dentro do § MAP (instrumentos.json).

## Voz — "§Voz · Roteiro oral" (L2849)

**Título:** "Oito minutos, para gravar e ouvir de volta". **Lede:** "O teste real deste bloco não é escrito — é falado, porque a situação que ele antecipa é uma conversa. Grave os oito minutos abaixo sem ler, ouça de volta, e marque cada momento em que você citou um número sem dizer a base temporal. É a métrica que importa."

| Tempo | Título | Texto literal |
|---|---|---|
| 0:00–1:00 | "A espinha dorsal, sem números" | "Bioenergia é o único setor do sistema energético brasileiro em que a decisão de despacho não é do operador nacional. A mesma tonelada de cana vira açúcar, etanol, eletricidade ou crédito de descarbonização, e quem escolhe qual é a própria unidade, todo dia, por preço relativo. Isso significa que nenhum número deste setor se lê sem três coisas: o ano-safra, a rota de conversão, e o produto concorrente que deixou de ser feito com o mesmo insumo." |
| 1:00–2:00 | "Base temporal, e por que ela é a primeira pergunta" | "O ciclo produtivo do Centro-Sul atravessa dois anos-calendário. Por isso um dado de safra e um dado de ano-calendário não se comparam sem conversão declarada — e essa confusão é a origem de metade dos erros de citação neste tema. Exemplo concreto: a participação do etanol de milho no etanol nacional é 25% em ano-calendário 2025 pelo balanço energético e cerca de 28% na projeção de primeiro levantamento do ano-safra 2026/27. Os dois estão certos. Nenhum é mais atual que o outro." |
| 2:00–3:00 | "Hidratado e anidro: dois mercados" | "O hidratado vai direto no tanque do veículo flexível e compete na bomba com a gasolina. O anidro é misturado à gasolina antes do posto, e a demanda dele é derivada: volume de gasolina vezes percentual obrigatório. Um responde a preço em semanas; o outro responde a resolução de conselho. Em 2025 a produção total de etanol caiu 2,8% enquanto o anidro subia 3,1% por decisão regulatória e a venda de hidratado caía 5,9% por preço relativo — um agregado escondendo dois movimentos opostos." |
| 3:00–4:00 | "Mistura obrigatória tem quatro estados" | "Nunca é um número só. Teto legal autorizado, percentual em vigor, percentual anunciado com data futura, e prazo legal vencido não implementado. Hoje, no etanol: teto de 35% na Lei do Combustível do Futuro, 32% em vigor desde 1º de agosto de 2026 por resolução do conselho em caráter excepcional e temporário, com 180 dias de vigência. No biodiesel: teto de 25% mediante viabilidade técnica, 15% em vigor desde agosto de 2025, e um B16 com prazo legal de março de 2026 que simplesmente não foi implementado." |
| 4:00–5:00 | "Três números para a mesma planta" | "Bioeletricidade é onde a confusão de grandeza mais dói. Potência instalada, energia gerada e energia exportada são três coisas diferentes, e a distância entre elas é maior aqui que em qualquer outra fonte — por dois motivos: sazonalidade, que faz a planta entregar meio ano; e autoconsumo, porque boa parte da energia vira vapor de processo e nunca chega à rede. Uma cogeração de 80 MW pode ter fator de capacidade anual em torno de 20% e ser uma excelente planta." |
| 5:00–6:00 | "Por que meio ano é complementaridade" | "A safra do Centro-Sul coincide aproximadamente com o período seco das principais bacias. A cogeração a bagaço entrega justamente quando o reservatório não entrega — é complemento sazonal à hidrologia, não substituto anual. Em 2025 a geração hidráulica recuou quase 5% e a bioeletricidade bateu recorde, com 66,1 TWh e 8,5% da matriz. Dito isso: firmeza depende de combustível, disponibilidade, conexão e contrato, não só de coincidência sazonal. E a estrutura contratual de uma fonte sazonal precisa dizer quem cobre a entressafra." |
| 6:00–7:00 | "A camada em que o valor é documento" | "Crédito de descarbonização, certificado de origem, nota de eficiência: o valor não vem do litro nem do megawatt-hora, vem do papel. O crédito é um ativo negociado em bolsa, com preço formado por oferta e demanda — mais de cem reais em 2024, poucas dezenas em 2026, com estoque estrutural de quase vinte milhões de créditos na abertura do ano. Por isso preço de crédito nunca se crava: entra como entrada editável, com fonte e data." |
| 7:00–8:00 | "O fechamento, que recusa os dois extremos" | "A versão entusiasmada diz que o Brasil resolveu o transporte com etanol. A versão cínica diz que mistura obrigatória é política industrial disfarçada de política climática. As duas erram pelo mesmo motivo: nenhuma traz base temporal, rota nem trade-off. A resposta correta devolve grandeza — qual fração, de qual ano, por qual rota — e diz os dois lados: a política cria demanda previsível, escala industrial e renda agrícola; e é, para quem abastece, um custo antes de ser um benefício ambiental. Dizer os dois é o conteúdo, não uma concessão." |

**Callout "O que ouvir na gravação"** (L2869): "Três marcadores. Um: você disse "ano-calendário" ou "ano-safra" toda vez que citou um volume? Dois: você disse "de cana", "de milho", "de segunda geração" — ou disse apenas "etanol"? Três: em algum momento você usou um superlativo — "líder mundial", "potência verde", "maior do mundo" — sem número, base temporal e fonte atrás dele? O terceiro é o que mais escapa, e é o que a Trava 1 do War Room existe para impedir."

### Princípios (voz editorial declarada pela fonte)

- **§00.4 — regra de nomeação em três estados**:
  - ✓ **Permitido** · Zona nomeável: "Nomear a Raízen, porque o currículo a nomeia como tópico, e nomear os seus dois acionistas de referência — Cosan e Shell — quando a estrutura de associação for estruturalmente relevante à explicação. Nomear companhias já nomeadas no Módulo 13 quando houver ponte factual necessária, sempre apontando de volta." (L843)
  - ~ **Padrão é descrever por estrutura** · Zona anônima: "Qualquer outro grupo sucroenergético, usina, cooperativa, comercializadora de crédito de descarbonização, produtora de biometano, trading de açúcar, agente certificador ou fabricante de equipamento. A forma correta é "um grupo sucroenergético com moagem no Centro-Sul", "um produtor de etanol de milho no Centro-Oeste", "o primeiro agente certificador de origem credenciado pela agência". A tentação de nomear é alta neste setor porque ele tem grupos reconhecíveis — e ceder a ela transforma um módulo de cadeia num ranking de empresas que o currículo não pediu." (L849)
  - ✕ **Proibido em qualquer zona, sem exceção** · Nunca: "Nome de executivo, presidente, conselheiro ou controlador pessoa física de qualquer companhia, em qualquer hipótese. E nome de concorrente direto do GridAlpha, mesmo quando a estrutura societária de uma empresa legítima tecnicamente os conecte. As duas proibições são idênticas às do Módulo 13 e não se movem." (L858)
- **§00.5** — "O que este módulo não conclui" (`box rd`):
  - "Este ativo não recomenda rota de bioenergia, troca de combustível, nem decisão de investimento em ativo do setor, em nenhuma hipótese. Ele descreve rota, mecanismo, escala e trade-off, incluindo os desconfortáveis — competição por uso do solo, intensidade hídrica, dependência de política de conteúdo obrigatório para que exista mercado, e o fato de que a mistura obrigatória é, do ponto de vista de quem abastece, um custo antes de ser um benefício ambiental. Apresentar os dois lados é o conteúdo, não uma concessão. E, herdadas do Módulo 13 e igualmente válidas aqui: nenhuma recomendação de compra, venda ou manutenção de ação, título ou participação, e nenhum preço-alvo, inclusive sobre companhias do setor sucroenergético." (L911)
- **§00.1** — "Números vivos · verificar na fonte antes de uso externo" (`box rd`):
  - "Este módulo tem duas categorias de instabilidade que nenhum anterior teve. A primeira é a base temporal: se um dado é de ano-safra ou de ano-calendário, e de qual ano-safra. A segunda é o estado de política: se um percentual de mistura é teto legal autorizado, percentual em vigor, percentual anunciado com data futura, ou prazo legal já vencido e não implementado. Os quatro estados existem simultaneamente no ordenamento brasileiro hoje, e confundi-los é o defeito dominante do material de imprensa sobre bioenergia." (L756)
  - "Todos os percentuais, volumes, metas e preços citados neste módulo foram verificados em fonte primária em 2 de agosto de 2026. O corpo do ativo ensina rota, mecanismo e trade-off, que não envelhecem. O que envelhece está isolado em callouts como este e em entradas editáveis dos instrumentos — nenhum preço e nenhum percentual de mistura está cravado em prosa como constante. Antes de qualquer uso externo, reconstrua cada valor em ANP, CNPE/MME, Conab, EPE, ANEEL/ONS, CCEE e B3, com norma, número, ano e data de consulta." (L762)

Princípios que vivem em outros grupos: "Linguagem obrigatória — Travas do War Room" (§Caso, ver aparato.json caso); "lede do § Ref (separação por natureza da fonte)" (§Ref, ver aparato.json referencias.introducao); "Data de verificação e limites deste ativo" (§Ref, ver aparato.json referencias.limites); "A frase que fecha o bloco" (§Final, ver aparato.json checklist_final.fecho).

Callouts "Números vivos · verificar na fonte antes de uso externo": tese L754, a01 L1127, a04 L1617, a06 L2074, a07 L2242.

## Erros comuns — "§Erros · Dezoito afirmações" (L2625)

**Título:** "Dezoito frases que circulam, e o que cada uma esconde". **Lede:** "Nenhuma das dezoito é invenção. Todas circulam em apresentação, em imprensa especializada ou em conversa de corredor, e várias delas são ditas por gente que conhece o setor. O que as une é o padrão: são frases que quase descrevem um mecanismo real, e o pedaço que falta é sempre um dos três — base temporal, rota, ou produto concorrente."

| # | Afirmação | Correção literal | Linha |
|---|---|---|---|
| 1 | "Bioenergia é carbono zero." | "Nenhuma rota é. A intensidade de carbono é calculada em ciclo de vida, com fronteira declarada, e inclui produção agrícola, insumos, transporte, energia de conversão, metano fugitivo e uso da terra. O que existe é intensidade menor que a do fóssil de referência — e ela varia entre plantas que produzem a mesma molécula." | L2636 |
| 2 | "Etanol vale a pena abaixo de 70% do preço da gasolina." | "Aproximação histórica, não lei. O limiar é a razão de rendimento medida daquele veículo, naquele trajeto. Ver INST·02." | L2637 |
| 3 | "E32 significa 32% de etanol hidratado na bomba." | "O teor obrigatório é de etanol anidro na gasolina C. Hidratado é produto de uso direto e não entra na mistura." | L2638 |
| 4 | "B15 é biodiesel puro." | "B15 é diesel B com 15% de B100 e 85% de diesel A, em volume. A nomenclatura indica o teor da mistura, não a pureza do produto." | L2639 |
| 5 | "A mistura obrigatória é X%." | "Sem norma, sem data e sem estado, a frase não é verificável. Teto legal autorizado, percentual em vigor, percentual anunciado com data futura e prazo legal vencido não implementado são quatro estados diferentes, e todos existem simultaneamente hoje." | L2640 |
| 6 | "O CNPE aprovou o aumento da mistura, então o teor subiu." | "Nem sempre. Em 14 de julho de 2026 o mesmo colegiado aprovou o E32 e alterou as regras de fornecimento do biodiesel sem alterar o teor de biodiesel. Mudou o número, mudou a regra de quem fornece, ou mudou o prazo? São três notícias diferentes com a mesma manchete." | L2641 |
| 7 | "A produção de etanol caiu no ano passado." | "Verdadeiro em ano-calendário 2025 e incompleto: o total caiu 2,8% enquanto o anidro subiu 3,1% por decisão regulatória e a venda de hidratado caiu 5,9% por preço relativo. Um agregado que esconde dois movimentos opostos." | L2642 |
| 8 | "O dado da agência e o dado da companhia de abastecimento se contradizem." | "Não se contradizem: medem janelas diferentes. Ano-calendário e ano-safra não se comparam sem conversão declarada, e o ciclo do Centro-Sul atravessa dois anos-calendário." | L2643 |
| 9 | "O etanol de milho já é 28% da produção nacional." | "Depende da base. 25% em ano-calendário 2025 pelo balanço energético; cerca de 28% na projeção de primeiro levantamento do ano-safra 2026/27. Números diferentes de janelas diferentes, e o segundo ainda vai ser revisado três vezes." | L2644 |
| 10 | "Capacidade autorizada é produção." | "Não é. Autorização não é produção, produção não é venda, e nenhuma das três é energia entregue. Vale para etanol, para biodiesel e para biometano." | L2645 |
| 11 | "Resíduo é insumo gratuito." | "Resíduo tem coleta, preparo, transporte, e quase sempre um uso alternativo — fertirrigação, compostagem, ração, cobertura de solo. Custo de oportunidade zero é hipótese, não fato." | L2646 |
| 12 | "Biogás pode entrar direto na rede." | "Só biometano entra, depois de purificação até a especificação da agência, com remoção de dióxido de carbono, umidade e contaminantes. Precificar biogás bruto como gás natural ignora a planta inteira que separa um do outro." | L2647 |
| 13 | "Todo megawatt-hora de biomassa é firme." | "Firmeza depende de combustível disponível, disponibilidade da planta, conexão e do próprio contrato. A cogeração a bagaço entrega na safra — e a leitura correta dessa entrega é complementaridade sazonal, não firmeza anual." | L2648 |
| 14 | "Esta usina tem 80 MW, então gera 700 GWh por ano." | "Multiplicar potência por 8.760 horas descreve uma planta que não existe. Faltam dias de safra, disponibilidade e autoconsumo de processo — e o que sobra depois dos três é a única grandeza que gera receita de venda." | L2649 |
| 15 | "O crédito de descarbonização é um subsídio fixo por litro." | "Não é. A quantidade depende de volume elegível, energia e diferencial de intensidade de carbono certificado; o valor depende de preço formado em bolsa, que variou de mais de cem reais em 2024 para poucas dezenas em 2026." | L2650 |
| 16 | "O cumprimento da meta foi de 99%" ou "foi de 88%." | "Os dois, no mesmo ano de 2025, com denominadores diferentes: meta nacional contra soma das metas individuais ajustadas. Citar um sem o outro produz narrativa, não informação." | L2651 |
| 17 | "Crédito de descarbonização e certificado de origem de biometano podem ser somados." | "Podem coexistir sobre a mesma nota fiscal, e a norma exige que o registro do certificado declare a emissão concomitante. A pergunta de auditoria não é se houve dupla emissão — é se o registro declara e se o contrato define quem é dono de cada atributo." | L2652 |
| 18 | "O Brasil já resolveu o transporte com etanol." | "Devolva grandeza e trade-off, não confirmação nem desmentido. Qual fração do consumo energético do transporte é renovável, em qual ano-calendário, por qual rota, e à custa de qual uso alternativo do insumo? A frase entusiasmada e a frase cínica erram pelo mesmo motivo: nenhuma das duas traz base temporal." | L2653 |

Menções em prosa nos erros (não são tag de posse): m14-erro-02 → INST·02. Nenhum erro declara vínculo de aula.

## Tradutor / § Map

`null`. Não há Tradutor nem § Map (minúsculo) no M14. O único marcador de mapa é §MAP (mapa de rotas).

## "Onde isso entra no produto" (P7, 8 callouts)

Blocos que falam do produto GridAlpha ao learner; P7 manda não exibi-los. Registrados só por posição:

- tese L890: "Este é o único bloco do currículo até aqui cujo conteúdo ali"…
- a01 L1222: "A separação entre demanda de bomba e demanda derivada é exat"…
- a02 L1388: "Análise de mix é o núcleo de uma análise setorial de agro, e"…
- a04 L1735: "Mistura obrigatória é o caso de uso canônico do Regulatory R"…
- a05 L1903: "A separação entre as três grandezas é o tipo de rigor que su"…
- a06 L2094: "Marco regulatório de biometano é o segundo caso de uso canôn"…
- a07 L2316: "Meta anual, individualização, regime de penalidade, metodolo"…
- a08 L2501: "A ficha de campo fixo é a estrutura de dado que sustenta qua"…

## Divergências (11)

### div-m14-trilha — Trilha/nível do módulo

Classe: fonte × fonte × código · linhas L3236, L805.

- **Leitura A** (rodapé (footer)): "Trilha 2 · Bloco 14 do Currículo Definitivo · verificado em 2 de agosto de 2026"
- **Leitura B** (§00.3): "A hipótese mais provável é que os blocos finais do Nível 3"
- **Leitura C** (alexandria-blocks.ts): "{ id: 'bloco-14', number: 14, level: 3, title: 'Biocombustíveis e Bioenergia', track: 'brasil', illustrationPrefix: null, priority: 'media', estimatedHoursMin: 2, estimatedHoursMax: 2 },"

Nota: Registrado também no catálogo canônico (divergência 2). Não resolvido.
Decisão: `null` (não resolvido).

### div-m14-horas — Carga horária

Classe: fonte × código.

- **Leitura A** (fonte): `null`
- **Leitura B** (alexandria-blocks.ts): "estimatedHoursMin: 2, estimatedHoursMax: 2"

Nota: A fonte não declara horas; o valor do código não tem origem neste HTML. O catálogo canônico também não traz horas para o M14.
Decisão: `null` (não resolvido).

### div-m14-cinco-camadas — "cinco" × seis linhas na cadeia do § MAP

Classe: fonte × fonte · linhas L968, L977, L929.

- **Leitura A** (h3 §MAP.1): "§MAP.1 A cadeia em cinco camadas, e onde cada uma falha"
- **Leitura B** (tabela §MAP.1): "6 linhas: Insumo, Conversão, Produto, Logística, Carbono, Economia"
- **Leitura C** (lede do § MAP): "pergunta em cinco partes: insumo, conversão, produto, mercado, órgão"
- **Leitura D** (callout do § MAP): "faça as duas primeiras ... As outras quatro dependem das duas."

Nota: O título diz cinco camadas, a tabela tem seis (e o callout soma seis: duas + quatro). As "cinco partes" do lede são outra lista (mercado e órgão não são linhas da tabela; logística, carbono e economia não são partes da pergunta). Markup vence a prosa na contagem (protocolo §5), mas as duas listas ficam registradas.
Decisão: `null` (não resolvido).

### div-m14-titulos-curtos-map — Título curto do cartão do § MAP × rótulo do marcador da aula

Classe: fonte × fonte.

- Aula 01: marcador "Etanol hidratado e etanol anidro" × cartão do § MAP "Hidratado e anidro"
- Aula 03: marcador "Rotas alternativas de etanol" × cartão do § MAP "Milho e segunda geração"
- Aula 04: marcador "Biodiesel e a política de conteúdo obrigatório" × cartão do § MAP "Biodiesel e conteúdo obrigatório"
- Aula 05: marcador "Bagaço, cogeração e a sazonalidade" × cartão do § MAP "Bagaço e cogeração"
- Aula 07: marcador "RenovaBio e o crédito de descarbonização" × cartão do § MAP "Crédito de descarbonização"
- Aula 08: marcador "Síntese — ler uma cadeia" × cartão do § MAP "Ler uma cadeia"

Nota: Variantes de nome da mesma aula. O código usa o rótulo do marcador (title) e o h2 (subtitle); a descrição dos cartões não está no código.
Decisão: `null` (não resolvido).

### div-m14-criterio — Critério do bloco em várias formas

Classe: fonte × fonte.

- (§00.3): "Diante de qualquer número de bioenergia apresentado em conversa ou em material — volume, percentual de mistura, potência, preço de crédito —, consegue nomear em menos de um minuto a base temporal, a rota de conversão e o produto concorrente; e consegue explicar, sem consultar nota, por que uma usina sucroenergética entrega energia firme durante metade do ano e por que isso é complementaridade e não defeito."
- (§Quiz): "O critério é oito de dez."
- (§Voz): "O teste real deste bloco não é escrito — é falado"
- (§Final): "O primeiro item é o critério de domínio deste bloco."
- (Aula 08 (§08.2)): "Diante de qualquer número de bioenergia, três perguntas em ordem. Um — base temporal: isto é ano-safra ou ano-calendário, e qual ciclo? Se for safra, é levantamento preliminar ou fechamento? Dois — rota: de qual insumo, por qual conversão? "Etanol" não é uma rota; etanol de cana de primeira geração é. Três — concorrente: o que deixou de ser feito com o mesmo insumo para que este número existisse? Se as três tiverem resposta, o número é utilizável. Se qualquer uma faltar, a resposta correta ao interlocutor não é discordar — é perguntar, e a pergunta certa quase sempre encerra a discussão sem que ninguém precise ter razão."
- (§Ex): "Os catorze refletem a construção do critério deste bloco, e por isso se distribuem em quatro famílias: identificação de base temporal, classificação de rota, separação de grandeza e estado de política. Faça o cálculo ou formule a resposta antes de abrir o gabarito — o valor do exercício está na hesitação, não na conferência."

Nota: Critério construído (§00.3) × quiz 8/10 (h2, lede, pill e script `acertos>=8`) × checklist de 26 cujo 1º item "é o critério" × "o teste real ... é falado" (§Voz) × sequência de um minuto (§08). Nenhuma forma prevalece (P18).
Decisão: `null` (não resolvido).

### div-m14-quatro-defeitos — As "quatro" categorias de erro mudam de uma seção para outra

Classe: fonte × fonte.

- (§Ex lede): "identificação de base temporal, classificação de rota, separação de grandeza e estado de política"
- (§Quiz lede): "base temporal, rota, grandeza, estado de política"
- (script do quiz, mensagem < 8): "base temporal, rota não declarada, grandeza confundida, estado de política"
- (INST·10 (filtro e categorias)): "Base temporal, Rota não declarada, Grandeza confundida, Concorrente omitido"
- (§00, §Erros lede, §08 callout): "três: base temporal, rota, produto concorrente"

Nota: "Estado de política" é família do §Ex e do quiz, mas não categoria do INST·10 (lá o enunciado e3 tem rótulo "estado de política" e categoria "base"). "Concorrente omitido" é categoria do INST·10, mas não família do §Ex nem do quiz. Detalhe em instrumentos.json (m14-inst-10).
Decisão: `null` (não resolvido).

### div-m14-marca — Marca GridAlpha visível ao learner (P24)

Classe: fonte × produto · linhas L664, L861, L893, L1225, L1391, L1906, L2321, L2505, L3212, L3214, L3215, L3216, L3235, L4304.

- **Leitura A** (fonte): ""GridAlpha" aparece 14 vezes no texto do corpo e 1 vez(es) em strings do script (quiz Q10)"

Nota: Eyebrow, rodapé, §00.4 ("concorrente direto do GridAlpha"), callouts "Onde isso entra no produto" (GridAlpha Research / Energy Brief / Regulatory Radar), § Ref "Documentos internos do GridAlpha" e o feedback da Q10. Texto mantido literal; a troca é da camada Alexandria.
Decisão: `null` (não resolvido).

### div-m14-war-room — Vocabulário interno "War Room"/"Travas" visível ao learner

Classe: fonte × produto.

- (§Caso callout): "Linguagem obrigatória — Travas do War Room"
- (§Voz callout): "é o que a Trava 1 do War Room existe para impedir"
- (§Ref (Documentos internos)): "GridAlpha — War Room, Quatro Travas de Segurança"

Nota: Não há conflito de numeração neste módulo (a Trava 1 do §Voz é compatível com a primeira trava listada no §Ref, "Linguagem pública defensável"), mas a lista do §Ref só enumera as travas em prosa, sem números. Ver P23.
Decisão: `null` (não resolvido).

### div-m14-catalogo-criterio — Citação do critério construído truncada no catálogo canônico

Classe: fonte × catálogo.

- **Leitura A** (fonte §00.3): "Diante de qualquer número de bioenergia apresentado em conversa ou em material — volume, percentual de mistura, potência, preço de crédito —, consegue nomear em menos de um minuto a base temporal, a rota de conversão e o produto concorrente; e consegue explicar, sem consultar nota, por que uma usina sucroenergética entrega energia firme durante metade do ano e por que isso é complementaridade e não defeito."
- **Leitura B** (catalogo-modulos-alexandria.md): "termina em "...por que uma usina sucroenergética entrega energia firme durante metade do ano." (sem "e por que isso é complementaridade e não defeito")"

Nota: A citação do catálogo corta a última oração do critério sem marcar o corte.
Decisão: `null` (não resolvido).

### div-m14-codigo-nao-renderizado — Dados do M14 no código que nenhuma tela lê

Classe: código.

- (alexandria-modulo-14-content.ts): "MODULO_14_EXERCICIOS_SOLTOS (14) e MODULO_14_INSTRUMENTOS ([]) são exportados"
- (RecursosDoModulo.tsx): "registro RECURSOS vai só até 'modulo-09'; 'modulo-14' ausente"
- (alexandria-curriculo.ts): "importa só MODULO_14_AULAS, _CORPO e _LEAD"

Nota: Os 14 exercícios existem no código mas não aparecem na interface; os 10 instrumentos não existem no código.
Decisão: `null` (não resolvido).

### div-m14-aulas-por-bloco — Contagem de aulas

Classe: fonte × código (sem divergência).

- **Leitura A** (fonte): "8 seções "Aula NN"; 8 cartões no §MAP.2; pill "8 aulas""
- **Leitura B** (código): "MODULO_14_AULAS: 8; totalInModule: 8; 'bloco-14': 8, // Biocombustíveis e Bioenergia"

Nota: Os sinais concordam em 8. Registro de conferência, não de conflito.
Decisão: `null` (não resolvido).

## Comparação com o código (só leitura)

Arquivos lidos: `src/lib/data/alexandria-modulo-14-content.ts`, `src/lib/data/alexandria-curriculo.ts`, `src/lib/data/alexandria-trilhas.ts`, `src/lib/data/alexandria-blocks.ts`, `src/components/alexandria/navigation/RecursosDoModulo.tsx`, `C:/dev/GridAlpha v2/docs/catalogo-modulos-alexandria.md`.

| Aula | Marcador (fonte) | h2 (fonte) | Cartão § MAP | `title` (código) | `subtitle` (código) |
|---|---|---|---|---|---|
| Aula 01 | "Etanol hidratado e etanol anidro" | "Dois produtos da mesma destilaria, dois mercados que não se parecem em nada" | "Hidratado e anidro" | = marcador | = h2 |
| Aula 02 | "O mix açúcar-etanol" | "A arbitragem que a planta faz todo dia, e a restrição que o preço relativo não mostra" | "O mix açúcar-etanol" | = marcador | = h2 |
| Aula 03 | "Rotas alternativas de etanol" | "Uma rota que não tem safra do mesmo jeito, e outra que come o insumo da própria caldeira" | "Milho e segunda geração" | = marcador | = h2 |
| Aula 04 | "Biodiesel e a política de conteúdo obrigatório" | "Como um percentual fixado por resolução cria um mercado inteiro — e quem paga por ele" | "Biodiesel e conteúdo obrigatório" | = marcador | = h2 |
| Aula 05 | "Bagaço, cogeração e a sazonalidade" | "Três números para a mesma planta, e por que meio ano de entrega é complementaridade" | "Bagaço e cogeração" | = marcador | = h2 |
| Aula 06 | "Biogás e biometano" | "O resíduo como insumo, e uma economia que é de logística e de escala mínima" | "Biogás e biometano" | = marcador | = h2 |
| Aula 07 | "RenovaBio e o crédito de descarbonização" | "O produto que não é físico: quem tem obrigação, como o preço se forma, e por que ele não pode ser cravado" | "Crédito de descarbonização" | = marcador | = h2 |
| Aula 08 | "Síntese — ler uma cadeia" | "Seis fichas de campo fixo, e um campo deixado deliberadamente em branco" | "Ler uma cadeia" | = marcador | = h2 |

**O que o código não tem (existe só no HTML):**

- tese (§00) e as três lentes
- critérios (construído, quiz, voz, checklist)
- perguntas do § MAP e tabela das camadas
- descrições dos cartões do § MAP
- roteiro oral (§Voz)
- erros comuns (§Erros, 18)
- princípios (§00.4, §00.5)
- os 10 instrumentos (MODULO_14_INSTRUMENTOS = [] e instruments: [] nas 8 aulas)

Badges: alexandria-badges.ts não referencia o M14 (busca por "14"/"bloco-14": nada relativo ao módulo).

## Contagens

| Item | Contagem |
|---|---|
| Seções | 18 |
| Aulas | 8 |
| Aparatos | 10 |
| Pills do hero | 11 |
| Subseções da §00 | 5 |
| Lentes | 3 |
| Perguntas por camada (§MAP.1) | 6 |
| Cartões de aula (§MAP.2) | 8 |
| Critérios literais | 6 |
| Blocos de tempo (§Voz) | 8 |
| Erros comuns | 18 |
| Callouts "Onde isso entra no produto" | 8 |
| Instrumentos por aula | Aula 01: INST·02; Aula 02: INST·03; Aula 03: INST·04; Aula 04: INST·05; Aula 05: INST·06; Aula 06: INST·07; Aula 07: INST·08; Aula 08: INST·09+INST·10; §MAP: INST·01 |
| Divergências | 11 |

## Verificação

Verificação adversarial independente (2026-09-17), com parser próprio:
- **Verbatim.** Tese (29 blocos, conferidos contra os filhos de `section#tese`), § MAP (lede, 6 linhas da tabela, 8
  cartões), roteiro (18 `section`), 11 pills, 18 erros, 8 blocos de voz e critérios: todos são substring da fonte
  normalizada. Só falham campos de metadado (`convencoes`, rótulo de ponteiro), que não são conteúdo.
- **Origens.** Todas a ±3 linhas.
- **Contagens recalculadas.** 18 seções, 8 aulas (a01–a08), 8 `a.map-card` (6 com título curto diferente do marcador:
  só as Aulas 02 e 06 coincidem), 1 cabeçalho "Pergunta central" sobre 6 linhas, 11 pills, 8 callouts "Onde isso
  entra no produto", "GridAlpha" 15 vezes (14 em 13 linhas do markup e 1 no script, L4304): conferem.
- **Divergências.** As 11 foram conferidas na fonte, no código e no catálogo (rodapé L3236 × §00 L810; h3 L968 × 7 `tr`;
  corte do critério L822–825 × catálogo; "caso da família" L3215). Nenhuma inventada.
- **Correções.** Nenhuma neste arquivo.
