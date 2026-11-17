// GERADO por tools/alexandria-dados/avaliacao/gerar-avaliacao-m17.mjs — não editar à mão.
// Fonte: docs/alexandria-v2/extraction/m17/aparato.json (fonte, prova, checklist) e o texto das aulas
// em src/lib/data/alexandria-modulo-17-content.ts (derivados). Posse: a sessão de porte do M17.
// 29 itens por aula (18 da fonte, 11 derivados) · 0 exercício(s) do módulo · 10 questões na prova · 30 itens no checklist.

import type { ChecklistDoModulo, ExercicioDaAula, ExercicioDoModulo, ProvaDoModulo } from '../avaliacao';

export const EXERCICIOS_DAS_AULAS: ExercicioDaAula[] = [
  {
    "id": "m17-ex-01",
    "moduloId": "modulo-17",
    "aula": 1,
    "origem": "fonte",
    "tipo": "aberto",
    "enunciado": "Um relatório apresenta a tarifa industrial média de dois países e conclui que a indústria de um deles é mais competitiva em energia. O que falta declarar?",
    "gabarito": null,
    "referencia": "<p>Pelo menos cinco das sete. <b>Camada</b> — a tarifa &ldquo;média industrial&rdquo; de cada país pode incluir conjuntos diferentes de transporte, encargos e tributos. <b>Consumidor</b> — nível de tensão e fator de carga do agregado; &ldquo;a indústria&rdquo; é uma média sobre composições setoriais diferentes. <b>Mercado de formação</b> — regulado, contratado ou atacado. <b>Tributo recuperável</b> — se é recuperável, não é custo, e precisa ser tratado igual nos dois lados. <b>Base cambial</b> — nominal para competitividade exportadora, nunca paridade. Só depois disso a diferença que sobrar é objeto de decomposição.</p>",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "docs/alexandria-v2/extraction/m17/aparato.json",
      "campo": "exercicios.itens[0].enunciado_texto",
      "linha": 3346
    },
    "evidencias": [
      {
        "arquivo": "docs/alexandria-v2/extraction/m17/aparato.json",
        "campo": "exercicios.itens[0].enunciado_texto",
        "linha": 3346,
        "trecho": "Um relatório apresenta a tarifa industrial média de dois países e conclui que a indústria de um deles é mais competitiva em energia. O que falta declarar?"
      },
      {
        "arquivo": "docs/alexandria-v2/extraction/m17/aparato.json",
        "campo": "exercicios.itens[0].resposta_referencia_texto",
        "linha": 3346,
        "trecho": "Pelo menos cinco das sete. Camada — a tarifa “média industrial” de cada país pode incluir conjuntos diferentes de transporte, encargos e tributos. Consumidor — nível de tensão e fator de carga do agregado; “a indústria” é uma média sobre composições setoriais diferentes. Mercado de formação — regulado, contratado ou atacado. Tributo recuperável — se é recuperável, não é custo, e precisa ser tratado igual nos dois lados. Base cambial — nominal para competitividade exportadora, nunca paridade. Só depois disso a diferença que sobrar é objeto de decomposição."
      }
    ],
    "alertas": [
      "Vínculo mecânico: a fonte não prende este exercício a aula; \"tarifa industrial\" aparece só na Aula 1."
    ]
  },
  {
    "id": "m17-ex-02",
    "moduloId": "modulo-17",
    "aula": 1,
    "origem": "fonte",
    "tipo": "aberto",
    "enunciado": "Um preço médio de curto prazo de €89/MWh e um valor de liquidação de diferenças brasileiro do mesmo ano são apresentados lado a lado. Quantas declarações faltam?",
    "gabarito": null,
    "referencia": "<p>Seis. Falta camada — o primeiro é atacado puro, o segundo também, mas <b>nenhum dos dois é o que uma fábrica paga</b>. Falta consumidor. Falta mercado de formação — um é resultado de ofertas, o outro é valor modelado que a carga contratada não desembolsa. Falta granularidade — média aritmética horária contra qual estatística. Falta período — ano civil contra ano hidrológico. E falta desenho — preço zonal formado por oferta contra preço uniforme por submercado formado por otimização. A única declarada é a cambial. <b>É o exemplo canônico deste módulo.</b></p>",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "docs/alexandria-v2/extraction/m17/aparato.json",
      "campo": "exercicios.itens[1].enunciado_texto",
      "linha": 3356
    },
    "evidencias": [
      {
        "arquivo": "docs/alexandria-v2/extraction/m17/aparato.json",
        "campo": "exercicios.itens[1].enunciado_texto",
        "linha": 3356,
        "trecho": "Um preço médio de curto prazo de €89/MWh e um valor de liquidação de diferenças brasileiro do mesmo ano são apresentados lado a lado. Quantas declarações faltam?"
      },
      {
        "arquivo": "docs/alexandria-v2/extraction/m17/aparato.json",
        "campo": "exercicios.itens[1].resposta_referencia_texto",
        "linha": 3356,
        "trecho": "Seis. Falta camada — o primeiro é atacado puro, o segundo também, mas nenhum dos dois é o que uma fábrica paga. Falta consumidor. Falta mercado de formação — um é resultado de ofertas, o outro é valor modelado que a carga contratada não desembolsa. Falta granularidade — média aritmética horária contra qual estatística. Falta período — ano civil contra ano hidrológico. E falta desenho — preço zonal formado por oferta contra preço uniforme por submercado formado por otimização. A única declarada é a cambial. É o exemplo canônico deste módulo."
      }
    ],
    "alertas": [
      "Vínculo mecânico: a fonte não prende este exercício a aula; \"€89/MWh\" e \"liquidação de diferenças\" aparece só na Aula 1."
    ]
  },
  {
    "id": "m17-ex-05",
    "moduloId": "modulo-17",
    "aula": 1,
    "origem": "fonte",
    "tipo": "aberto",
    "enunciado": "Um estudo compara o custo de energia de dois centros de dados usando a média aritmética horária de preço de atacado de cada mercado. Onde está o defeito?",
    "gabarito": null,
    "referencia": "<p>Na quarta declaração. Um centro de dados tem perfil de consumo aproximadamente plano; a média aritmética horária atribui o mesmo peso a madrugada e a ponta e, num sistema com alta penetração solar, <b>subestima sistematicamente</b> o custo de quem consome à noite e superestima o de quem consome ao meio-dia. A estatística correta é a média ponderada pelo perfil do próprio consumidor. Se essa não estiver disponível, a média ponderada pela carga do sistema é a segunda melhor — e a diferença entre as três deve ser reportada, não escolhida.</p>",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "docs/alexandria-v2/extraction/m17/aparato.json",
      "campo": "exercicios.itens[4].enunciado_texto",
      "linha": 3382
    },
    "evidencias": [
      {
        "arquivo": "docs/alexandria-v2/extraction/m17/aparato.json",
        "campo": "exercicios.itens[4].enunciado_texto",
        "linha": 3382,
        "trecho": "Um estudo compara o custo de energia de dois centros de dados usando a média aritmética horária de preço de atacado de cada mercado. Onde está o defeito?"
      },
      {
        "arquivo": "docs/alexandria-v2/extraction/m17/aparato.json",
        "campo": "exercicios.itens[4].resposta_referencia_texto",
        "linha": 3382,
        "trecho": "Na quarta declaração. Um centro de dados tem perfil de consumo aproximadamente plano; a média aritmética horária atribui o mesmo peso a madrugada e a ponta e, num sistema com alta penetração solar, subestima sistematicamente o custo de quem consome à noite e superestima o de quem consome ao meio-dia. A estatística correta é a média ponderada pelo perfil do próprio consumidor. Se essa não estiver disponível, a média ponderada pela carga do sistema é a segunda melhor — e a diferença entre as três deve ser reportada, não escolhida."
      }
    ],
    "alertas": [
      "Vínculo mecânico: a fonte não prende este exercício a aula; \"média aritmética\" e \"atacado\" aparece só na Aula 1."
    ]
  },
  {
    "id": "m17-a01-d01",
    "moduloId": "modulo-17",
    "aula": 1,
    "origem": "derivado-da-aula",
    "tipo": "escolha",
    "enunciado": "Segundo a aula, se qualquer uma das sete declarações faltar, como fica a comparação de preço?",
    "alternativas": [
      "Imprecisa",
      "Inválida"
    ],
    "gabarito": 1,
    "referencia": "Se qualquer uma faltar, a comparação não é imprecisa — ela é inválida",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "alternativa-correta",
    "fonte": {
      "arquivo": "src/lib/data/alexandria-modulo-17-content.ts",
      "campo": "MODULO_17_CORPO['aula-17-01'][0]",
      "linha": null
    },
    "evidencias": [
      {
        "arquivo": "src/lib/data/alexandria-modulo-17-content.ts",
        "campo": "MODULO_17_CORPO['aula-17-01'][0]",
        "linha": null,
        "trecho": "Se qualquer uma faltar, a comparação não é imprecisa — ela é inválida"
      }
    ]
  },
  {
    "id": "m17-ex-07",
    "moduloId": "modulo-17",
    "aula": 2,
    "origem": "fonte",
    "tipo": "aberto",
    "enunciado": "Dois mercados organizados do mesmo país têm distribuições de preço de curto prazo radicalmente diferentes. Qual parcela vincula e por que este par é especial?",
    "gabarito": null,
    "referencia": "<p><b>Desenho</b>, com folga, e o par é especial porque as outras duas parcelas estão quase constantes: mesmo país, mesma moeda, mesmo regime tributário federal, base de combustível predominante semelhante, cadeia de equipamento idêntica. Um remunera adequação por leilão central de capacidade e pode manter a cauda de preço de energia contida; o outro não tem esse produto e <b>precisa</b> da cauda para que a adequação seja remunerada. É o experimento mais limpo disponível para isolar a parcela de desenho, e é por isso que os dois ocupam duas das seis fichas.</p>",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "docs/alexandria-v2/extraction/m17/aparato.json",
      "campo": "exercicios.itens[6].enunciado_texto",
      "linha": 3404
    },
    "evidencias": [
      {
        "arquivo": "docs/alexandria-v2/extraction/m17/aparato.json",
        "campo": "exercicios.itens[6].enunciado_texto",
        "linha": 3404,
        "trecho": "Dois mercados organizados do mesmo país têm distribuições de preço de curto prazo radicalmente diferentes. Qual parcela vincula e por que este par é especial?"
      },
      {
        "arquivo": "docs/alexandria-v2/extraction/m17/aparato.json",
        "campo": "exercicios.itens[6].resposta_referencia_texto",
        "linha": 3404,
        "trecho": "Desenho, com folga, e o par é especial porque as outras duas parcelas estão quase constantes: mesmo país, mesma moeda, mesmo regime tributário federal, base de combustível predominante semelhante, cadeia de equipamento idêntica. Um remunera adequação por leilão central de capacidade e pode manter a cauda de preço de energia contida; o outro não tem esse produto e precisa da cauda para que a adequação seja remunerada. É o experimento mais limpo disponível para isolar a parcela de desenho, e é por isso que os dois ocupam duas das seis fichas."
      }
    ],
    "alertas": [
      "Vínculo mecânico: a fonte não prende este exercício a aula; \"parcela vincula\" aparece só na Aula 2."
    ]
  },
  {
    "id": "m17-a02-d01",
    "moduloId": "modulo-17",
    "aula": 2,
    "origem": "derivado-da-aula",
    "tipo": "aberto",
    "enunciado": "Qual é, segundo a aula, a regra operacional sobre o que uma mudança de governo altera nas três parcelas?",
    "gabarito": null,
    "referencia": "A regra operacional: mudança de governo altera a parcela de política; raramente altera desenho no mesmo mandato; nunca altera dotação.",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "src/lib/data/alexandria-modulo-17-content.ts",
      "campo": "MODULO_17_CORPO['aula-17-02'][5]",
      "linha": null
    },
    "evidencias": [
      {
        "arquivo": "src/lib/data/alexandria-modulo-17-content.ts",
        "campo": "MODULO_17_CORPO['aula-17-02'][5]",
        "linha": null,
        "trecho": "A regra operacional: mudança de governo altera a parcela de política; raramente altera desenho no mesmo mandato; nunca altera dotação."
      }
    ]
  },
  {
    "id": "m17-ex-03",
    "moduloId": "modulo-17",
    "aula": 3,
    "origem": "fonte",
    "tipo": "aberto",
    "enunciado": "Um interlocutor cita o preço de um nó específico de um mercado nodal como &ldquo;o preço da energia naquele país&rdquo;. Qual declaração ele violou e qual é a consequência?",
    "gabarito": null,
    "referencia": "<p>A sétima — <b>qual desenho formou o número</b>. Preço nodal é o custo de atender mais um megawatt <b>naquele ponto</b>, com congestionamento e perdas dentro. Não é o preço do país; é o preço de um lugar. A consequência prática é grande: dentro do mesmo mercado, dois nós podem divergir por múltiplos numa hora congestionada. Apresentar dado de um ponto como dado de uma região é erro distinto de apresentar dado de uma jurisdição como dado de outra, e os dois aparecem juntos com frequência.</p>",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "docs/alexandria-v2/extraction/m17/aparato.json",
      "campo": "exercicios.itens[2].enunciado_texto",
      "linha": 3365
    },
    "evidencias": [
      {
        "arquivo": "docs/alexandria-v2/extraction/m17/aparato.json",
        "campo": "exercicios.itens[2].enunciado_texto",
        "linha": 3365,
        "trecho": "Um interlocutor cita o preço de um nó específico de um mercado nodal como “o preço da energia naquele país”. Qual declaração ele violou e qual é a consequência?"
      },
      {
        "arquivo": "docs/alexandria-v2/extraction/m17/aparato.json",
        "campo": "exercicios.itens[2].resposta_referencia_texto",
        "linha": 3365,
        "trecho": "A sétima — qual desenho formou o número. Preço nodal é o custo de atender mais um megawatt naquele ponto, com congestionamento e perdas dentro. Não é o preço do país; é o preço de um lugar. A consequência prática é grande: dentro do mesmo mercado, dois nós podem divergir por múltiplos numa hora congestionada. Apresentar dado de um ponto como dado de uma região é erro distinto de apresentar dado de uma jurisdição como dado de outra, e os dois aparecem juntos com frequência."
      }
    ],
    "alertas": [
      "Vínculo mecânico: a fonte não prende este exercício a aula; \"preço da energia\" e \"nodal\" aparece só na Aula 3."
    ]
  },
  {
    "id": "m17-ex-14",
    "moduloId": "modulo-17",
    "aula": 3,
    "origem": "fonte",
    "tipo": "aberto",
    "enunciado": "Uma jurisdição resolve congestionamento interno por redespacho com custo socializado, outra por preço nodal. Qual instituição cada arranjo exige que a outra não exige?",
    "gabarito": null,
    "referencia": "<p>O arranjo nodal exige um <b>mercado de direitos financeiros sobre a diferença de congestionamento entre pontos</b>, com alocação, negociação, liquidação e regra de suficiência de receita — quatro funções que só existem porque o preço é nodal. O arranjo zonal exige uma <b>regra de recuperação e alocação do custo de redespacho</b>, que é objeto de disputa regulatória permanente e exige autoridade para arbitrá-la. Nenhum dos dois é mais simples: eles deslocam a complexidade de um lugar para outro.</p>",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "docs/alexandria-v2/extraction/m17/aparato.json",
      "campo": "exercicios.itens[13].enunciado_texto",
      "linha": 3472
    },
    "evidencias": [
      {
        "arquivo": "docs/alexandria-v2/extraction/m17/aparato.json",
        "campo": "exercicios.itens[13].enunciado_texto",
        "linha": 3472,
        "trecho": "Uma jurisdição resolve congestionamento interno por redespacho com custo socializado, outra por preço nodal. Qual instituição cada arranjo exige que a outra não exige?"
      },
      {
        "arquivo": "docs/alexandria-v2/extraction/m17/aparato.json",
        "campo": "exercicios.itens[13].resposta_referencia_texto",
        "linha": 3472,
        "trecho": "O arranjo nodal exige um mercado de direitos financeiros sobre a diferença de congestionamento entre pontos, com alocação, negociação, liquidação e regra de suficiência de receita — quatro funções que só existem porque o preço é nodal. O arranjo zonal exige uma regra de recuperação e alocação do custo de redespacho, que é objeto de disputa regulatória permanente e exige autoridade para arbitrá-la. Nenhum dos dois é mais simples: eles deslocam a complexidade de um lugar para outro."
      }
    ],
    "alertas": [
      "Vínculo mecânico: a fonte não prende este exercício a aula; \"redespacho\" aparece só na Aula 3."
    ]
  },
  {
    "id": "m17-a03-d01",
    "moduloId": "modulo-17",
    "aula": 3,
    "origem": "derivado-da-aula",
    "tipo": "aberto",
    "enunciado": "Segundo a aula, o que decide qual das três granularidades de preço é a adequada?",
    "gabarito": null,
    "referencia": "O que decide não é sofisticação — é a relação entre onde está o recurso, onde está a carga e quanto custa a linha entre os dois.",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "src/lib/data/alexandria-modulo-17-content.ts",
      "campo": "MODULO_17_CORPO['aula-17-03'][10]",
      "linha": null
    },
    "evidencias": [
      {
        "arquivo": "src/lib/data/alexandria-modulo-17-content.ts",
        "campo": "MODULO_17_CORPO['aula-17-03'][10]",
        "linha": null,
        "trecho": "O que decide não é sofisticação — é a relação entre onde está o recurso, onde está a carga e quanto custa a linha entre os dois."
      }
    ]
  },
  {
    "id": "m17-ex-12",
    "moduloId": "modulo-17",
    "aula": 4,
    "origem": "fonte",
    "tipo": "aberto",
    "enunciado": "Um mercado só de energia depende de um pressuposto que não é uma instituição formal. Qual é, e por que ele é o mais frágil da lista?",
    "gabarito": null,
    "referencia": "<p>O <b>compromisso crível de não intervir no preço em evento de escassez</b>. Não é um órgão nem uma norma: é uma expectativa sobre o comportamento futuro de reguladores e legisladores. Se o preço extremo é revertido administrativamente no primeiro evento, a receita que justificava o investimento em capacidade de ponta desaparece e o desenho para de funcionar sem que nenhuma regra tenha sido formalmente alterada. É o pressuposto mais frágil porque é o único que não tem titular identificável a quem cobrar.</p>",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "docs/alexandria-v2/extraction/m17/aparato.json",
      "campo": "exercicios.itens[11].enunciado_texto",
      "linha": 3454
    },
    "evidencias": [
      {
        "arquivo": "docs/alexandria-v2/extraction/m17/aparato.json",
        "campo": "exercicios.itens[11].enunciado_texto",
        "linha": 3454,
        "trecho": "Um mercado só de energia depende de um pressuposto que não é uma instituição formal. Qual é, e por que ele é o mais frágil da lista?"
      },
      {
        "arquivo": "docs/alexandria-v2/extraction/m17/aparato.json",
        "campo": "exercicios.itens[11].resposta_referencia_texto",
        "linha": 3454,
        "trecho": "O compromisso crível de não intervir no preço em evento de escassez. Não é um órgão nem uma norma: é uma expectativa sobre o comportamento futuro de reguladores e legisladores. Se o preço extremo é revertido administrativamente no primeiro evento, a receita que justificava o investimento em capacidade de ponta desaparece e o desenho para de funcionar sem que nenhuma regra tenha sido formalmente alterada. É o pressuposto mais frágil porque é o único que não tem titular identificável a quem cobrar."
      }
    ],
    "alertas": [
      "Vínculo mecânico: a fonte não prende este exercício a aula; \"só de energia\" aparece só na Aula 4."
    ]
  },
  {
    "id": "m17-a04-d01",
    "moduloId": "modulo-17",
    "aula": 4,
    "origem": "derivado-da-aula",
    "tipo": "aberto",
    "enunciado": "O que um mercado central de capacidade compra, segundo a aula — e o que ele não compra?",
    "gabarito": null,
    "referencia": "Compra disponibilidade futura acreditada. Não compra energia, não compra a placa da usina, e não compra a promessa do proprietário.",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "src/lib/data/alexandria-modulo-17-content.ts",
      "campo": "MODULO_17_CORPO['aula-17-04'][2]",
      "linha": null
    },
    "evidencias": [
      {
        "arquivo": "src/lib/data/alexandria-modulo-17-content.ts",
        "campo": "MODULO_17_CORPO['aula-17-04'][2]",
        "linha": null,
        "trecho": "Compra disponibilidade futura acreditada. Não compra energia, não compra a placa da usina, e não compra a promessa do proprietário."
      }
    ]
  },
  {
    "id": "m17-ex-11",
    "moduloId": "modulo-17",
    "aula": 5,
    "origem": "fonte",
    "tipo": "aberto",
    "enunciado": "Um parceiro sugere adotar um leilão central de capacidade no Brasil. De quais funções institucionais o mecanismo depende, e quais existem aqui?",
    "gabarito": null,
    "referencia": "<p>Cinco funções. <b>Cálculo de requisito</b> com modelo probabilístico auditável — existe, distribuída entre planejador e operador. <b>Acreditação por contribuição marginal à confiabilidade</b> com metodologia publicada — parcialmente existe, com metodologia distinta. <b>Curva de demanda administrada</b> — não existe como instituição, porque o instrumento brasileiro não forma preço separado para o atributo. <b>Leilão e obrigação</b> — existe, com desenho diferente. <b>Penalidade crível por não-desempenho</b> — existe sob outra forma, vinculada a contrato e a lastro. A resposta correta não é sim nem não: é que <b>duas das cinco funções mudariam de natureza</b>, e essa é a pergunta a devolver.</p>",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "docs/alexandria-v2/extraction/m17/aparato.json",
      "campo": "exercicios.itens[10].enunciado_texto",
      "linha": 3443
    },
    "evidencias": [
      {
        "arquivo": "docs/alexandria-v2/extraction/m17/aparato.json",
        "campo": "exercicios.itens[10].enunciado_texto",
        "linha": 3443,
        "trecho": "Um parceiro sugere adotar um leilão central de capacidade no Brasil. De quais funções institucionais o mecanismo depende, e quais existem aqui?"
      },
      {
        "arquivo": "docs/alexandria-v2/extraction/m17/aparato.json",
        "campo": "exercicios.itens[10].resposta_referencia_texto",
        "linha": 3443,
        "trecho": "Cinco funções. Cálculo de requisito com modelo probabilístico auditável — existe, distribuída entre planejador e operador. Acreditação por contribuição marginal à confiabilidade com metodologia publicada — parcialmente existe, com metodologia distinta. Curva de demanda administrada — não existe como instituição, porque o instrumento brasileiro não forma preço separado para o atributo. Leilão e obrigação — existe, com desenho diferente. Penalidade crível por não-desempenho — existe sob outra forma, vinculada a contrato e a lastro. A resposta correta não é sim nem não: é que duas das cinco funções mudariam de natureza, e essa é a pergunta a devolver."
      }
    ],
    "alertas": [
      "Vínculo mecânico: a fonte não prende este exercício a aula; \"leilão central de capacidade\" aparece só na Aula 5."
    ]
  },
  {
    "id": "m17-a05-d01",
    "moduloId": "modulo-17",
    "aula": 5,
    "origem": "derivado-da-aula",
    "tipo": "aberto",
    "enunciado": "Segundo a aula, o que preço negativo e corte de geração num sistema com alta penetração solar significam?",
    "gabarito": null,
    "referencia": "Preço negativo e corte de geração num sistema com alta penetração solar não significam que renovável não funciona. Significam que localização, rede, flexibilidade e demanda não acompanharam a produção.",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "src/lib/data/alexandria-modulo-17-content.ts",
      "campo": "MODULO_17_CORPO['aula-17-05'][16]",
      "linha": null
    },
    "evidencias": [
      {
        "arquivo": "src/lib/data/alexandria-modulo-17-content.ts",
        "campo": "MODULO_17_CORPO['aula-17-05'][16]",
        "linha": null,
        "trecho": "Preço negativo e corte de geração num sistema com alta penetração solar não significam que renovável não funciona. Significam que localização, rede, flexibilidade e demanda não acompanharam a produção."
      }
    ]
  },
  {
    "id": "m17-ex-08",
    "moduloId": "modulo-17",
    "aula": 6,
    "origem": "fonte",
    "tipo": "aberto",
    "enunciado": "Uma jurisdição viu o custo de capital de projetos eólicos e solares subir em pouco mais de um ano sem que o desenho de mercado mudasse. Decomponha.",
    "gabarito": null,
    "referencia": "<p><b>Política</b> vincula integralmente, e é a demonstração mais limpa da volatilidade dessa parcela: uma lei orçamentária antecipou o término de créditos tributários, uma ordem executiva determinou aplicação estrita, uma orientação administrativa restringiu o critério de início de construção, e uma decisão judicial restaurou parte do critério restringido. <b>Quatro instrumentos, quatro instituições, um ciclo.</b> Dotação não se moveu; desenho não se moveu. Quem projetou continuidade errou e quem projetou reversão total também errou.</p>",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "docs/alexandria-v2/extraction/m17/aparato.json",
      "campo": "exercicios.itens[7].enunciado_texto",
      "linha": 3413
    },
    "evidencias": [
      {
        "arquivo": "docs/alexandria-v2/extraction/m17/aparato.json",
        "campo": "exercicios.itens[7].enunciado_texto",
        "linha": 3413,
        "trecho": "Uma jurisdição viu o custo de capital de projetos eólicos e solares subir em pouco mais de um ano sem que o desenho de mercado mudasse. Decomponha."
      },
      {
        "arquivo": "docs/alexandria-v2/extraction/m17/aparato.json",
        "campo": "exercicios.itens[7].resposta_referencia_texto",
        "linha": 3413,
        "trecho": "Política vincula integralmente, e é a demonstração mais limpa da volatilidade dessa parcela: uma lei orçamentária antecipou o término de créditos tributários, uma ordem executiva determinou aplicação estrita, uma orientação administrativa restringiu o critério de início de construção, e uma decisão judicial restaurou parte do critério restringido. Quatro instrumentos, quatro instituições, um ciclo. Dotação não se moveu; desenho não se moveu. Quem projetou continuidade errou e quem projetou reversão total também errou."
      }
    ],
    "alertas": [
      "Vínculo mecânico: a fonte não prende este exercício a aula; \"custo de capital\" aparece só na Aula 6."
    ]
  },
  {
    "id": "m17-a06-d01",
    "moduloId": "modulo-17",
    "aula": 6,
    "origem": "derivado-da-aula",
    "tipo": "aberto",
    "enunciado": "Segundo a aula, quando a coordenação entre estados e governo federal funciona?",
    "gabarito": null,
    "referencia": "Federalismo não é sinônimo de descentralização eficiente — a coordenação funciona quando competências, dados, alocação de custo e autoridade de execução estão claros, e não quando estão simplesmente distribuídos.",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "src/lib/data/alexandria-modulo-17-content.ts",
      "campo": "MODULO_17_CORPO['aula-17-06'][7]",
      "linha": null
    },
    "evidencias": [
      {
        "arquivo": "src/lib/data/alexandria-modulo-17-content.ts",
        "campo": "MODULO_17_CORPO['aula-17-06'][7]",
        "linha": null,
        "trecho": "Federalismo não é sinônimo de descentralização eficiente — a coordenação funciona quando competências, dados, alocação de custo e autoridade de execução estão claros, e não quando estão simplesmente distribuídos."
      }
    ]
  },
  {
    "id": "m17-ex-15",
    "moduloId": "modulo-17",
    "aula": 7,
    "origem": "fonte",
    "tipo": "aberto",
    "enunciado": "&ldquo;Quase metade da capacidade daquele sistema já é eólica e solar.&rdquo; Qual dos quatro números é, e o que ele não permite concluir?",
    "gabarito": null,
    "referencia": "<p>É o <b>número 1 — capacidade instalada</b>, em potência. Não permite concluir nada sobre geração, porque o fator de utilização das duas fontes é uma fração do de uma térmica de base. É compatível com térmica ainda majoritária em energia no mesmo ano. E não permite concluir nada sobre substituição real, que exigiria o número 4 — energia consumida líquida de corte e de saldo de intercâmbio.</p>",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "docs/alexandria-v2/extraction/m17/aparato.json",
      "campo": "exercicios.itens[14].enunciado_texto",
      "linha": 3483
    },
    "evidencias": [
      {
        "arquivo": "docs/alexandria-v2/extraction/m17/aparato.json",
        "campo": "exercicios.itens[14].enunciado_texto",
        "linha": 3483,
        "trecho": "“Quase metade da capacidade daquele sistema já é eólica e solar.” Qual dos quatro números é, e o que ele não permite concluir?"
      },
      {
        "arquivo": "docs/alexandria-v2/extraction/m17/aparato.json",
        "campo": "exercicios.itens[14].resposta_referencia_texto",
        "linha": 3483,
        "trecho": "É o número 1 — capacidade instalada, em potência. Não permite concluir nada sobre geração, porque o fator de utilização das duas fontes é uma fração do de uma térmica de base. É compatível com térmica ainda majoritária em energia no mesmo ano. E não permite concluir nada sobre substituição real, que exigiria o número 4 — energia consumida líquida de corte e de saldo de intercâmbio."
      }
    ],
    "alertas": [
      "Vínculo mecânico: a fonte não prende este exercício a aula; \"quatro números\" aparece nas Aulas 2, 7; vai para a última, a 7."
    ]
  },
  {
    "id": "m17-ex-17",
    "moduloId": "modulo-17",
    "aula": 7,
    "origem": "fonte",
    "tipo": "aberto",
    "enunciado": "Um relatório compara a meta de participação renovável de 2030 de uma jurisdição com o resultado de 2025 de outra. Qual erro de unidade é esse, e como corrigir?",
    "gabarito": null,
    "referencia": "<p>É comparação de <b>futuro normativo contra histórico realizado</b> — a versão de unidade do defeito de estágio que o Módulo 16 catalogou. A correção tem três passos: separe explicitamente meta, política adotada e resultado verificado; compare resultado com resultado e meta com meta; e, se quiser avaliar a meta, aplique a régua de estágio ao instrumento que a sustenta, para saber se ela é anúncio, norma aprovada ou norma regulamentada.</p>",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "docs/alexandria-v2/extraction/m17/aparato.json",
      "campo": "exercicios.itens[16].enunciado_texto",
      "linha": 3499
    },
    "evidencias": [
      {
        "arquivo": "docs/alexandria-v2/extraction/m17/aparato.json",
        "campo": "exercicios.itens[16].enunciado_texto",
        "linha": 3499,
        "trecho": "Um relatório compara a meta de participação renovável de 2030 de uma jurisdição com o resultado de 2025 de outra. Qual erro de unidade é esse, e como corrigir?"
      },
      {
        "arquivo": "docs/alexandria-v2/extraction/m17/aparato.json",
        "campo": "exercicios.itens[16].resposta_referencia_texto",
        "linha": 3499,
        "trecho": "É comparação de futuro normativo contra histórico realizado — a versão de unidade do defeito de estágio que o Módulo 16 catalogou. A correção tem três passos: separe explicitamente meta, política adotada e resultado verificado; compare resultado com resultado e meta com meta; e, se quiser avaliar a meta, aplique a régua de estágio ao instrumento que a sustenta, para saber se ela é anúncio, norma aprovada ou norma regulamentada."
      }
    ],
    "alertas": [
      "Vínculo mecânico: a fonte não prende este exercício a aula; \"meta\" e \"2030\" aparece só na Aula 7."
    ]
  },
  {
    "id": "m17-a07-d01",
    "moduloId": "modulo-17",
    "aula": 7,
    "origem": "derivado-da-aula",
    "tipo": "escolha",
    "enunciado": "A distância entre o recurso, no oeste e no norte, e a carga, no litoral leste, é qual das três parcelas, segundo a aula?",
    "alternativas": [
      "Dotação",
      "Desenho",
      "Política"
    ],
    "gabarito": 0,
    "referencia": "A distância entre os dois é a variável estruturante, e é dotação — ninguém a escolheu.",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "alternativa-correta",
    "fonte": {
      "arquivo": "src/lib/data/alexandria-modulo-17-content.ts",
      "campo": "MODULO_17_CORPO['aula-17-07'][7]",
      "linha": null
    },
    "evidencias": [
      {
        "arquivo": "src/lib/data/alexandria-modulo-17-content.ts",
        "campo": "MODULO_17_CORPO['aula-17-07'][7]",
        "linha": null,
        "trecho": "A distância entre os dois é a variável estruturante, e é dotação — ninguém a escolheu."
      }
    ]
  },
  {
    "id": "m17-ex-13",
    "moduloId": "modulo-17",
    "aula": 8,
    "origem": "fonte",
    "tipo": "aberto",
    "enunciado": "Um mecanismo de ajuste de fronteira transfere carga institucional para o exportador. Quais funções ele exige do lado de origem, e quais existem no Brasil hoje?",
    "gabarito": null,
    "referencia": "<p>Três do lado de origem. <b>Medição, relato e verificação por instalação e por produto</b> — existe em regime voluntário e fragmentado; o regime obrigatório tem relato previsto a partir de 2027. <b>Verificação acreditada por terceiro reconhecido pela autoridade de destino</b> — existe como serviço privado, não como sistema. <b>Preço de carbono efetivamente pago, comprovável e certificável</b> — <span class=\"nao2\">não existe</span>, e não existirá antes de 2030 no calendário vigente. A ausência da terceira é o que torna a via de preço de referência padrão a única disponível.</p>",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "docs/alexandria-v2/extraction/m17/aparato.json",
      "campo": "exercicios.itens[12].enunciado_texto",
      "linha": 3463
    },
    "evidencias": [
      {
        "arquivo": "docs/alexandria-v2/extraction/m17/aparato.json",
        "campo": "exercicios.itens[12].enunciado_texto",
        "linha": 3463,
        "trecho": "Um mecanismo de ajuste de fronteira transfere carga institucional para o exportador. Quais funções ele exige do lado de origem, e quais existem no Brasil hoje?"
      },
      {
        "arquivo": "docs/alexandria-v2/extraction/m17/aparato.json",
        "campo": "exercicios.itens[12].resposta_referencia_texto",
        "linha": 3463,
        "trecho": "Três do lado de origem. Medição, relato e verificação por instalação e por produto — existe em regime voluntário e fragmentado; o regime obrigatório tem relato previsto a partir de 2027. Verificação acreditada por terceiro reconhecido pela autoridade de destino — existe como serviço privado, não como sistema. Preço de carbono efetivamente pago, comprovável e certificável — não existe, e não existirá antes de 2030 no calendário vigente. A ausência da terceira é o que torna a via de preço de referência padrão a única disponível."
      }
    ],
    "alertas": [
      "Vínculo mecânico: a fonte não prende este exercício a aula; \"ajuste de fronteira\" aparece só na Aula 8."
    ]
  },
  {
    "id": "m17-ex-18",
    "moduloId": "modulo-17",
    "aula": 8,
    "origem": "fonte",
    "tipo": "aberto",
    "enunciado": "Um exportador estima exposição a um mecanismo de fronteira multiplicando volume por intensidade por preço de certificado. Liste três razões pelas quais o número resultante é de outra grandeza.",
    "gabarito": null,
    "referencia": "<p><b>Primeira:</b> o fator de entrada gradual — a obrigação do primeiro ano é uma fração pequena da exposição bruta e cresce até meados da década de 2030. <b>Segunda:</b> a emissão indireta associada à eletricidade não é contabilizada para ferro, aço e alumínio no regime definitivo, o que retira da conta justamente a parcela elétrica. <b>Terceira:</b> o abatimento por preço de carbono pago na origem, quando existir, reduz o número — e o preço de certificado a usar é o valor oficial publicado para o período, não uma cotação de mercado qualquer. Uma quarta, anterior a todas: o enquadramento em oito dígitos do produto pode colocá-lo fora da lista.</p>",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "docs/alexandria-v2/extraction/m17/aparato.json",
      "campo": "exercicios.itens[17].enunciado_texto",
      "linha": 3507
    },
    "evidencias": [
      {
        "arquivo": "docs/alexandria-v2/extraction/m17/aparato.json",
        "campo": "exercicios.itens[17].enunciado_texto",
        "linha": 3507,
        "trecho": "Um exportador estima exposição a um mecanismo de fronteira multiplicando volume por intensidade por preço de certificado. Liste três razões pelas quais o número resultante é de outra grandeza."
      },
      {
        "arquivo": "docs/alexandria-v2/extraction/m17/aparato.json",
        "campo": "exercicios.itens[17].resposta_referencia_texto",
        "linha": 3507,
        "trecho": "Primeira: o fator de entrada gradual — a obrigação do primeiro ano é uma fração pequena da exposição bruta e cresce até meados da década de 2030. Segunda: a emissão indireta associada à eletricidade não é contabilizada para ferro, aço e alumínio no regime definitivo, o que retira da conta justamente a parcela elétrica. Terceira: o abatimento por preço de carbono pago na origem, quando existir, reduz o número — e o preço de certificado a usar é o valor oficial publicado para o período, não uma cotação de mercado qualquer. Uma quarta, anterior a todas: o enquadramento em oito dígitos do produto pode colocá-lo fora da lista."
      }
    ],
    "alertas": [
      "Vínculo mecânico: a fonte não prende este exercício a aula; \"certificado\" e \"exportador\" aparece só na Aula 8.",
      "O veredito do INST·09, no padrão, escreve as razões da resposta deste exercício (fator de entrada gradual, emissão indireta fora da conta para ferro e aço, enquadramento em oito dígitos). O INST·09 não abre antes da tentativa deste exercício."
    ]
  },
  {
    "id": "m17-a08-d01",
    "moduloId": "modulo-17",
    "aula": 8,
    "origem": "derivado-da-aula",
    "tipo": "aberto",
    "enunciado": "Segundo a aula, existe hoje preço de carbono pago no Brasil que possa ser abatido no mecanismo de fronteira?",
    "gabarito": null,
    "referencia": "não existe preço de carbono pago no Brasil para abater hoje, e não existirá antes de 2030 no calendário vigente.",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "src/lib/data/alexandria-modulo-17-content.ts",
      "campo": "MODULO_17_CORPO['aula-17-08'][10]",
      "linha": null
    },
    "evidencias": [
      {
        "arquivo": "src/lib/data/alexandria-modulo-17-content.ts",
        "campo": "MODULO_17_CORPO['aula-17-08'][10]",
        "linha": null,
        "trecho": "não existe preço de carbono pago no Brasil para abater hoje, e não existirá antes de 2030 no calendário vigente."
      }
    ]
  },
  {
    "id": "m17-ex-06",
    "moduloId": "modulo-17",
    "aula": 9,
    "origem": "fonte",
    "tipo": "aberto",
    "enunciado": "Um sistema tem intensidade média de emissão perto de 20 gCO₂e/kWh e o brasileiro tem intensidade baixa por outro caminho. Quanto de cada diferença é dotação, desenho e política?",
    "gabarito": null,
    "referencia": "<p>No primeiro, <b>política</b> vincula — uma frota nuclear padronizada construída ao longo de décadas, com cadeia industrial e operador únicos, sustentada por decisão de Estado. <b>Dotação</b> concorre — urânio acessível, água de resfriamento, densidade de carga que justifica unidades grandes. <b>Desenho</b> <span class=\"nao2\">quase não explica</span>: a mesma frota existiria sob outra arquitetura de mercado. No brasileiro, <b>dotação</b> vincula — bacia continental —, política concorre via leilões renováveis, e desenho novamente quase não explica. <b>Nenhuma das duas trajetórias é lição de desenho de mercado</b>, e é isso que a decomposição revela.</p>",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "docs/alexandria-v2/extraction/m17/aparato.json",
      "campo": "exercicios.itens[5].enunciado_texto",
      "linha": 3393
    },
    "evidencias": [
      {
        "arquivo": "docs/alexandria-v2/extraction/m17/aparato.json",
        "campo": "exercicios.itens[5].enunciado_texto",
        "linha": 3393,
        "trecho": "Um sistema tem intensidade média de emissão perto de 20 gCO₂e/kWh e o brasileiro tem intensidade baixa por outro caminho. Quanto de cada diferença é dotação, desenho e política?"
      },
      {
        "arquivo": "docs/alexandria-v2/extraction/m17/aparato.json",
        "campo": "exercicios.itens[5].resposta_referencia_texto",
        "linha": 3393,
        "trecho": "No primeiro, política vincula — uma frota nuclear padronizada construída ao longo de décadas, com cadeia industrial e operador únicos, sustentada por decisão de Estado. Dotação concorre — urânio acessível, água de resfriamento, densidade de carga que justifica unidades grandes. Desenho quase não explica: a mesma frota existiria sob outra arquitetura de mercado. No brasileiro, dotação vincula — bacia continental —, política concorre via leilões renováveis, e desenho novamente quase não explica. Nenhuma das duas trajetórias é lição de desenho de mercado, e é isso que a decomposição revela."
      }
    ],
    "alertas": [
      "Vínculo mecânico: a fonte não prende este exercício a aula; \"intensidade\" e \"dotação\" aparece só na Aula 9."
    ]
  },
  {
    "id": "m17-ex-16",
    "moduloId": "modulo-17",
    "aula": 9,
    "origem": "fonte",
    "tipo": "aberto",
    "enunciado": "Uma usina de 1 GW gera 2,19 TWh num ano. Qual o fator de utilização, e por que ele não basta para comparar duas jurisdições?",
    "gabarito": null,
    "referencia": "<p>2.190.000 MWh ÷ (1.000 MW × 8.760 h) = <b>25%</b>. Não basta porque o fator de utilização observado mistura três coisas: qualidade do recurso, disponibilidade da unidade e <b>corte de geração imposto pela rede</b>. Duas jurisdições com o mesmo recurso e o mesmo equipamento podem apresentar fatores diferentes por causa apenas da terceira. Comparar fator de utilização sem separar corte de geração atribui à tecnologia um efeito que é da rede.</p>",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "docs/alexandria-v2/extraction/m17/aparato.json",
      "campo": "exercicios.itens[15].enunciado_texto",
      "linha": 3491
    },
    "evidencias": [
      {
        "arquivo": "docs/alexandria-v2/extraction/m17/aparato.json",
        "campo": "exercicios.itens[15].enunciado_texto",
        "linha": 3491,
        "trecho": "Uma usina de 1 GW gera 2,19 TWh num ano. Qual o fator de utilização, e por que ele não basta para comparar duas jurisdições?"
      },
      {
        "arquivo": "docs/alexandria-v2/extraction/m17/aparato.json",
        "campo": "exercicios.itens[15].resposta_referencia_texto",
        "linha": 3491,
        "trecho": "2.190.000 MWh ÷ (1.000 MW × 8.760 h) = 25%. Não basta porque o fator de utilização observado mistura três coisas: qualidade do recurso, disponibilidade da unidade e corte de geração imposto pela rede. Duas jurisdições com o mesmo recurso e o mesmo equipamento podem apresentar fatores diferentes por causa apenas da terceira. Comparar fator de utilização sem separar corte de geração atribui à tecnologia um efeito que é da rede."
      }
    ],
    "alertas": [
      "Vínculo mecânico: a fonte não prende este exercício a aula; \"fator de utilização\" aparece nas Aulas 2, 7, 9; vai para a última, a 9."
    ]
  },
  {
    "id": "m17-a09-d01",
    "moduloId": "modulo-17",
    "aula": 9,
    "origem": "derivado-da-aula",
    "tipo": "aberto",
    "enunciado": "Por que, segundo a aula, um sistema com alta penetração renovável e interconexão forte não demonstrou a mesma coisa que um com interconexão fraca?",
    "gabarito": null,
    "referencia": "O primeiro resolveu parte do problema exportando-o; o segundo teve de resolvê-lo internamente, com corte de geração, armazenamento ou flexibilidade de demanda.",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "src/lib/data/alexandria-modulo-17-content.ts",
      "campo": "MODULO_17_CORPO['aula-17-09'][4]",
      "linha": null
    },
    "evidencias": [
      {
        "arquivo": "src/lib/data/alexandria-modulo-17-content.ts",
        "campo": "MODULO_17_CORPO['aula-17-09'][4]",
        "linha": null,
        "trecho": "O primeiro resolveu parte do problema exportando-o; o segundo teve de resolvê-lo internamente, com corte de geração, armazenamento ou flexibilidade de demanda."
      }
    ]
  },
  {
    "id": "m17-ex-04",
    "moduloId": "modulo-17",
    "aula": 10,
    "origem": "fonte",
    "tipo": "aberto",
    "enunciado": "Dois países publicam preço médio industrial. Um exclui tributos, o outro inclui. O tributo do segundo é integralmente recuperável pela indústria. Como corrigir?",
    "gabarito": null,
    "referencia": "<p>Zere o tributo recuperável nos <b>dois</b> lados, ou mantenha-o nos dois com a mesma regra. A correção assimétrica — retirar de um só — é o erro mais comum na tentativa de corrigir. E declare o que sobrou de fora: se o segundo país tem tributo não recuperável embutido no mesmo número, ele é custo real e permanece. A regra geral: <b>a normalização se aplica simetricamente ou não se aplica.</b></p>",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "docs/alexandria-v2/extraction/m17/aparato.json",
      "campo": "exercicios.itens[3].enunciado_texto",
      "linha": 3374
    },
    "evidencias": [
      {
        "arquivo": "docs/alexandria-v2/extraction/m17/aparato.json",
        "campo": "exercicios.itens[3].enunciado_texto",
        "linha": 3374,
        "trecho": "Dois países publicam preço médio industrial. Um exclui tributos, o outro inclui. O tributo do segundo é integralmente recuperável pela indústria. Como corrigir?"
      },
      {
        "arquivo": "docs/alexandria-v2/extraction/m17/aparato.json",
        "campo": "exercicios.itens[3].resposta_referencia_texto",
        "linha": 3374,
        "trecho": "Zere o tributo recuperável nos dois lados, ou mantenha-o nos dois com a mesma regra. A correção assimétrica — retirar de um só — é o erro mais comum na tentativa de corrigir. E declare o que sobrou de fora: se o segundo país tem tributo não recuperável embutido no mesmo número, ele é custo real e permanece. A regra geral: a normalização se aplica simetricamente ou não se aplica."
      }
    ],
    "alertas": [
      "Vínculo mecânico: a fonte não prende este exercício a aula; \"tributo\" aparece nas Aulas 1, 4, 8, 10; vai para a última, a 10."
    ]
  },
  {
    "id": "m17-ex-10",
    "moduloId": "modulo-17",
    "aula": 10,
    "origem": "fonte",
    "tipo": "aberto",
    "enunciado": "Um mercado com recurso solar excelente registra preços horários baixos e corte de geração crescente. Um desenvolvedor conclui que é o melhor lugar para investir em solar. Onde está o erro de atribuição?",
    "gabarito": null,
    "referencia": "<p>Ele leu <b>dotação</b> como se fosse retorno. Recurso excelente é competitividade em <b>custo</b>; receita depende de preço capturado, e preço capturado cai exatamente onde a penetração daquela fonte é alta — canibalização — e onde a rede não escoa — corte de geração. A variável que rompe a ligação entre custo e receita é <b>desenho e rede</b>, não recurso. &ldquo;Recurso solar excelente não garante receita excelente&rdquo; é a formulação curta.</p>",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "docs/alexandria-v2/extraction/m17/aparato.json",
      "campo": "exercicios.itens[9].enunciado_texto",
      "linha": 3432
    },
    "evidencias": [
      {
        "arquivo": "docs/alexandria-v2/extraction/m17/aparato.json",
        "campo": "exercicios.itens[9].enunciado_texto",
        "linha": 3432,
        "trecho": "Um mercado com recurso solar excelente registra preços horários baixos e corte de geração crescente. Um desenvolvedor conclui que é o melhor lugar para investir em solar. Onde está o erro de atribuição?"
      },
      {
        "arquivo": "docs/alexandria-v2/extraction/m17/aparato.json",
        "campo": "exercicios.itens[9].resposta_referencia_texto",
        "linha": 3432,
        "trecho": "Ele leu dotação como se fosse retorno. Recurso excelente é competitividade em custo; receita depende de preço capturado, e preço capturado cai exatamente onde a penetração daquela fonte é alta — canibalização — e onde a rede não escoa — corte de geração. A variável que rompe a ligação entre custo e receita é desenho e rede, não recurso. “Recurso solar excelente não garante receita excelente” é a formulação curta."
      }
    ],
    "alertas": [
      "Vínculo mecânico: a fonte não prende este exercício a aula; \"recurso solar\" e \"corte de geração\" aparece nas Aulas 9, 10; vai para a última, a 10."
    ]
  },
  {
    "id": "m17-a10-d01",
    "moduloId": "modulo-17",
    "aula": 10,
    "origem": "derivado-da-aula",
    "tipo": "aberto",
    "enunciado": "Segundo a aula, qual é o risco dominante no país vizinho de operação centralizada?",
    "gabarito": null,
    "referencia": "O risco dominante não é ausência de engenharia nem de desenho — é a moeda.",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "src/lib/data/alexandria-modulo-17-content.ts",
      "campo": "MODULO_17_CORPO['aula-17-10'][7]",
      "linha": null
    },
    "evidencias": [
      {
        "arquivo": "src/lib/data/alexandria-modulo-17-content.ts",
        "campo": "MODULO_17_CORPO['aula-17-10'][7]",
        "linha": null,
        "trecho": "O risco dominante não é ausência de engenharia nem de desenho — é a moeda."
      }
    ]
  },
  {
    "id": "m17-ex-09",
    "moduloId": "modulo-17",
    "aula": 11,
    "origem": "fonte",
    "tipo": "aberto",
    "enunciado": "&ldquo;Eles constroem em um ano o que levamos cinco.&rdquo; Qual das três parcelas explica, e o que a decomposição de três precisa nomear explicitamente aqui?",
    "gabarito": null,
    "referencia": "<p>Política concorre via meta e crédito dirigido; desenho concorre pouco, porque o mercado ainda não é o mecanismo dominante de alocação naquele sistema. O que <b>vincula</b> é capacidade institucional de execução — financiamento estatal em escala, cadeia industrial doméstica, autoridade territorial e coordenação de longo prazo. Ela <b>se comporta como dotação</b> para efeito de decisão, porque não é importável no horizonte de um investimento, mesmo não sendo geografia. É o caso em que a decomposição de três precisa declarar a fronteira entre as suas categorias em vez de forçar o caso numa delas.</p>",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "docs/alexandria-v2/extraction/m17/aparato.json",
      "campo": "exercicios.itens[8].enunciado_texto",
      "linha": 3422
    },
    "evidencias": [
      {
        "arquivo": "docs/alexandria-v2/extraction/m17/aparato.json",
        "campo": "exercicios.itens[8].enunciado_texto",
        "linha": 3422,
        "trecho": "“Eles constroem em um ano o que levamos cinco.” Qual das três parcelas explica, e o que a decomposição de três precisa nomear explicitamente aqui?"
      },
      {
        "arquivo": "docs/alexandria-v2/extraction/m17/aparato.json",
        "campo": "exercicios.itens[8].resposta_referencia_texto",
        "linha": 3422,
        "trecho": "Política concorre via meta e crédito dirigido; desenho concorre pouco, porque o mercado ainda não é o mecanismo dominante de alocação naquele sistema. O que vincula é capacidade institucional de execução — financiamento estatal em escala, cadeia industrial doméstica, autoridade territorial e coordenação de longo prazo. Ela se comporta como dotação para efeito de decisão, porque não é importável no horizonte de um investimento, mesmo não sendo geografia. É o caso em que a decomposição de três precisa declarar a fronteira entre as suas categorias em vez de forçar o caso numa delas."
      }
    ],
    "alertas": [
      "Vínculo mecânico: a fonte não prende este exercício a aula; \"três parcelas\" aparece nas Aulas 5, 11; vai para a última, a 11."
    ]
  },
  {
    "id": "m17-a11-d01",
    "moduloId": "modulo-17",
    "aula": 11,
    "origem": "derivado-da-aula",
    "tipo": "aberto",
    "enunciado": "Que quatro coisas, segundo a aula, a resposta correta às duas conclusões recusadas devolve?",
    "gabarito": null,
    "referencia": "A resposta correta a ambas devolve quatro coisas: perímetro, decomposição em três parcelas, pressuposto institucional e as condições que fariam cada leitura mudar.",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "src/lib/data/alexandria-modulo-17-content.ts",
      "campo": "MODULO_17_CORPO['aula-17-11'][6]",
      "linha": null
    },
    "evidencias": [
      {
        "arquivo": "src/lib/data/alexandria-modulo-17-content.ts",
        "campo": "MODULO_17_CORPO['aula-17-11'][6]",
        "linha": null,
        "trecho": "A resposta correta a ambas devolve quatro coisas: perímetro, decomposição em três parcelas, pressuposto institucional e as condições que fariam cada leitura mudar."
      }
    ]
  }
];

/** Exercícios da fonte sem vínculo mecânico com aula (a aula v3 os mostra na última aula). */
export const EXERCICIOS_DO_MODULO: ExercicioDoModulo[] = [];

export const PROVAS: ProvaDoModulo[] = [
  {
    "moduloId": "modulo-17",
    "criterio": "Critério: 8 de 10",
    "acertosMinimos": 8,
    "total": 10,
    "questoes": [
      {
        "id": "m17-quiz-q01",
        "enunciado": "Um interlocutor compara o preço médio de atacado de um mercado europeu com o valor de liquidação de diferenças de um submercado brasileiro, converte pelo câmbio médio e conclui qual energia é mais cara. Quantas das sete declarações de perímetro faltam?",
        "alternativas": [
          "Nenhuma — a conversão cambial resolve a comparação",
          "Duas: apenas granularidade e período",
          "Seis: só a base cambial foi declarada",
          "Sete: nem a base cambial foi declarada"
        ],
        "correta": 2,
        "explicacao": "Faltam camada, consumidor, mercado de formação, granularidade e período, tratamento tributário e desenho. A única declarada é a cambial — e é justamente a que menos importava. É o exemplo canônico da Aula 01.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m17/aparato.json",
          "campo": "avaliacao.perguntas[0]",
          "linha": 5182
        }
      },
      {
        "id": "m17-quiz-q02",
        "enunciado": "Um sistema tem intensidade de emissão muito baixa porque opera uma frota nuclear grande e padronizada, construída ao longo de décadas. Qual parcela vincula essa diferença?",
        "alternativas": [
          "Política, com dotação concorrendo e desenho explicando quase nada",
          "Desenho de mercado, porque a arquitetura viabilizou o investimento",
          "Dotação, porque o país tem urânio acessível",
          "As três em proporções equivalentes"
        ],
        "correta": 0,
        "explicacao": "A mesma frota existiria sob outra arquitetura de mercado, então desenho quase não explica. Dotação contribui — urânio, água de resfriamento, densidade de carga — mas o que vincula é uma decisão de Estado sustentada por décadas, com custo fiscal e industrial assumido explicitamente.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m17/aparato.json",
          "campo": "avaliacao.perguntas[1]",
          "linha": 5189
        }
      },
      {
        "id": "m17-quiz-q03",
        "enunciado": "Por que dois mercados organizados do mesmo país constituem o experimento mais limpo para isolar a parcela de desenho?",
        "alternativas": [
          "Porque ambos usam preço nodal e portanto são idênticos",
          "Porque um deles é regulado e o outro é livre",
          "Porque a diferença entre eles é puramente climática",
          "Porque dotação, moeda, regime tributário federal e cadeia de equipamento ficam quase constantes"
        ],
        "correta": 3,
        "explicacao": "Com as outras duas parcelas quase paradas, o que sobra da divergência é desenho: um remunera adequação por leilão central de capacidade e pode conter a cauda de preço; o outro não tem esse produto e precisa da cauda para que a adequação seja remunerada.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m17/aparato.json",
          "campo": "avaliacao.perguntas[2]",
          "linha": 5196
        }
      },
      {
        "id": "m17-quiz-q04",
        "enunciado": "No regime definitivo do mecanismo de ajuste de fronteira, a emissão indireta associada ao consumo de eletricidade é contabilizada para quais setores?",
        "alternativas": [
          "Para todos os seis setores cobertos",
          "Para cimento e fertilizantes, e não para ferro, aço e alumínio",
          "Apenas para eletricidade e hidrogênio",
          "Para nenhum setor — só a emissão direta entra"
        ],
        "correta": 1,
        "explicacao": "É a assimetria mais relevante para uma análise de energia e a menos conhecida: justamente na família de ferro, aço e alumínio — onde a parcela elétrica é grande — ela fica fora da obrigação de certificados.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m17/aparato.json",
          "campo": "avaliacao.perguntas[3]",
          "linha": 5203
        }
      },
      {
        "id": "m17-quiz-q05",
        "enunciado": "&ldquo;Quase metade da capacidade daquele sistema já é eólica e solar.&rdquo; Qual dos quatro números de penetração é esse, e o que ele permite concluir?",
        "alternativas": [
          "Geração no ano; permite concluir substituição real de combustível",
          "Energia consumida líquida; permite concluir a participação efetiva",
          "Pico instantâneo; permite concluir que o sistema opera nesse regime",
          "Capacidade instalada; não permite concluir nada sobre geração"
        ],
        "correta": 3,
        "explicacao": "É o número 1 — potência, não energia. O fator de utilização de fontes variáveis é uma fração do de uma térmica de base, então a afirmação é compatível com térmica ainda majoritária em geração no mesmo ano.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m17/aparato.json",
          "campo": "avaliacao.perguntas[4]",
          "linha": 5210
        }
      },
      {
        "id": "m17-quiz-q06",
        "enunciado": "Qual é o pressuposto institucional de um mercado só de energia com preço de escassez, e por que ele é o mais frágil?",
        "alternativas": [
          "Um monitor de mercado com poder de mitigação, porque depende de fiscalização contínua",
          "Uma curva de demanda administrada, porque a forma dela é decisão regulatória",
          "O compromisso crível de não intervir no preço, porque não é instituição formal e não tem titular a quem cobrar",
          "Um mercado de direitos financeiros de transmissão, porque protege contra risco de base"
        ],
        "correta": 2,
        "explicacao": "Se o preço extremo é revertido administrativamente no primeiro evento, a receita que justificava o investimento em capacidade de ponta desaparece sem que nenhuma regra tenha sido formalmente alterada.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m17/aparato.json",
          "campo": "avaliacao.perguntas[5]",
          "linha": 5217
        }
      },
      {
        "id": "m17-quiz-q07",
        "enunciado": "O leilão de capacidade do mercado do meio-atlântico para a entrega 2028/2029 fechou 2,5% abaixo da rodada anterior. Qual leitura é correta?",
        "alternativas": [
          "O crescimento de demanda por centros de dados foi absorvido e a pressão passou",
          "O preço continua no teto negociado, e o operador estima fechamento muito superior sem ele",
          "A margem de reserva caiu, o que explica a queda de preço",
          "O mercado de capacidade deixou de ser vinculante para a adequação"
        ],
        "correta": 1,
        "explicacao": "A queda não sinaliza folga. O preço permanece no teto, a estimativa sem teto fica cerca de 70% acima dele, e um leilão extraordinário de retaguarda foi marcado para setembro de 2026.",
        "alertas": [
          "Q15 (porte M17): trocado «a diferença entre o teto e a estimativa sem teto é maior que o próprio teto» por «a estimativa sem teto fica cerca de 70% acima dele». Os números da fonte (teto US$ 325/MW-dia, estimativa sem teto US$ 554,72/MW-dia, Aula 05) dão diferença de 229,72, menor que o teto; \"cerca de 70% acima\" é a forma da própria fonte (INST·07). Ver div-m17-ap-03-q7-teto."
        ],
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m17/aparato.json",
          "campo": "avaliacao.perguntas[6]",
          "linha": 5224
        }
      },
      {
        "id": "m17-quiz-q08",
        "enunciado": "Um exportador estima exposição a um mecanismo de fronteira como volume × intensidade × preço do certificado. Por que o número resultante é de outra grandeza?",
        "alternativas": [
          "Porque ignora o fator de entrada gradual, a exclusão da emissão indireta no setor e o abatimento por preço pago na origem",
          "Porque o preço do certificado é fixado anualmente e não trimestralmente",
          "Porque o limiar de dispensa isenta a maior parte dos importadores",
          "Porque o regime ainda está no período transitório, apenas de relato"
        ],
        "correta": 0,
        "explicacao": "A aritmética está correta; o erro é de perímetro e de cronograma. Há ainda uma quarta razão, anterior a todas: o enquadramento em oito dígitos pode colocar o produto fora da lista.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m17/aparato.json",
          "campo": "avaliacao.perguntas[7]",
          "linha": 5231
        }
      },
      {
        "id": "m17-quiz-q09",
        "enunciado": "Qual afirmação descreve corretamente o instrumento brasileiro de remuneração de disponibilidade?",
        "alternativas": [
          "Não existe: o Brasil não remunera disponibilidade de nenhuma forma",
          "É idêntico a um mercado de capacidade, apenas com outro nome",
          "A função existe, por obrigação de lastro e leilões de potência, sem formar preço separado para o atributo",
          "É um mercado de capacidade com curva de demanda administrada e acreditação probabilística"
        ],
        "correta": 2,
        "explicacao": "As duas frases erradas são simétricas: negar a existência da função e afirmar equivalência plena. A diferença real é que o atributo não recebe preço próprio — ele é embutido no preço da energia contratada.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m17/aparato.json",
          "campo": "avaliacao.perguntas[8]",
          "linha": 5238
        }
      },
      {
        "id": "m17-quiz-q10",
        "enunciado": "Duas jurisdições caem no mesmo grupo nas quatro dimensões do critério — preço, descarbonização, regulação e investimento — e ainda assim são radicalmente diferentes. Qual é a conclusão metodológica correta?",
        "alternativas": [
          "A grade está errada e as dimensões precisam ser refeitas",
          "As duas jurisdições devem ser tratadas como equivalentes para fins de análise",
          "Uma das duas foi classificada incorretamente em ao menos uma dimensão",
          "A pergunta é qual variável está fora da grade — aqui, escala e capacidade fiscal"
        ],
        "correta": 3,
        "explicacao": "Quatro dimensões não bastam. É a versão comparativa da armadilha de concluir por um eixo só: quando duas jurisdições colidem numa grade, o que falta não é corrigir a classificação, é nomear a variável que a grade não captura.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m17/aparato.json",
          "campo": "avaliacao.perguntas[9]",
          "linha": 5245
        }
      }
    ],
    "faixas": [
      {
        "min": 8,
        "max": 10,
        "mensagem": "Critério atingido. Você declara perímetro, decompõe em dotação, desenho e política, e identifica o pressuposto institucional de um mecanismo estrangeiro."
      },
      {
        "min": 0,
        "max": 7,
        "mensagem": "Critério é 8 de 10. Revise a Aula 01 para perímetro, a Aula 02 para atribuição e o Instrumento 08 para pressuposto institucional antes de refazer."
      }
    ],
    "faixasFonte": {
      "arquivo": "docs/alexandria-v2/extraction/m17/aparato.json",
      "campo": "avaliacao.faixas_de_placar_script",
      "linha": 5285
    },
    "criterioFonte": {
      "arquivo": "docs/alexandria-v2/extraction/m17/aparato.json",
      "campo": "avaliacao.criterio_literal.titulo",
      "linha": 3524
    }
  }
];

export const CHECKLISTS: ChecklistDoModulo[] = [
  {
    "moduloId": "modulo-17",
    "introducao": "Percorra antes de aceitar, produzir ou repetir qualquer comparação internacional. O primeiro item é o mais usado; o último é o mais difícil de cumprir.",
    "itens": [
      {
        "id": "m17-check-01",
        "texto": "Enumerei as sete declarações de perímetro antes de aceitar qualquer comparação de preço, e verifiquei quantas foram efetivamente feitas.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m17/aparato.json",
          "campo": "checklist_final.itens[0].texto",
          "linha": null
        }
      },
      {
        "id": "m17-check-02",
        "texto": "Identifiquei qual dos seis sentidos de “preço” cada número usa.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m17/aparato.json",
          "campo": "checklist_final.itens[1].texto",
          "linha": null
        }
      },
      {
        "id": "m17-check-03",
        "texto": "Verifiquei se os dois números estão na mesma camada — energia, transporte, encargos, tributos.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m17/aparato.json",
          "campo": "checklist_final.itens[2].texto",
          "linha": null
        }
      },
      {
        "id": "m17-check-04",
        "texto": "Declarei nível de tensão e fator de carga do consumidor dos dois lados.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m17/aparato.json",
          "campo": "checklist_final.itens[3].texto",
          "linha": null
        }
      },
      {
        "id": "m17-check-05",
        "texto": "Identifiquei qual mercado formou cada número: atacado, contrato, leilão ou tarifa.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m17/aparato.json",
          "campo": "checklist_final.itens[4].texto",
          "linha": null
        }
      },
      {
        "id": "m17-check-06",
        "texto": "Declarei a estatística usada: média aritmética, ponderada pela carga, ponderada pelo perfil, ou ponta.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m17/aparato.json",
          "campo": "checklist_final.itens[5].texto",
          "linha": null
        }
      },
      {
        "id": "m17-check-07",
        "texto": "Declarei o período e verifiquei se ano civil e ano hidrológico foram confundidos.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m17/aparato.json",
          "campo": "checklist_final.itens[6].texto",
          "linha": null
        }
      },
      {
        "id": "m17-check-08",
        "texto": "Tratei tributo recuperável simetricamente nos dois lados, ou mantive nos dois.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m17/aparato.json",
          "campo": "checklist_final.itens[7].texto",
          "linha": null
        }
      },
      {
        "id": "m17-check-09",
        "texto": "Declarei a base cambial e usei a mesma nos dois lados: nominal para competitividade, paridade para acessibilidade.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m17/aparato.json",
          "campo": "checklist_final.itens[8].texto",
          "linha": null
        }
      },
      {
        "id": "m17-check-10",
        "texto": "Declarei qual desenho de mercado formou cada número — nodal, zonal ou uniforme por submercado.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m17/aparato.json",
          "campo": "checklist_final.itens[9].texto",
          "linha": null
        }
      },
      {
        "id": "m17-check-11",
        "texto": "Decompus a diferença remanescente em dotação, desenho e política.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m17/aparato.json",
          "campo": "checklist_final.itens[10].texto",
          "linha": null
        }
      },
      {
        "id": "m17-check-12",
        "texto": "Disse explicitamente qual das três parcelas não explica nada.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m17/aparato.json",
          "campo": "checklist_final.itens[11].texto",
          "linha": null
        }
      },
      {
        "id": "m17-check-13",
        "texto": "Verifiquei se atribuí a mérito de política algo que é geografia.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m17/aparato.json",
          "campo": "checklist_final.itens[12].texto",
          "linha": null
        }
      },
      {
        "id": "m17-check-14",
        "texto": "Verifiquei se atribuí a desenho algo que é ciclo eleitoral, e vice-versa.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m17/aparato.json",
          "campo": "checklist_final.itens[13].texto",
          "linha": null
        }
      },
      {
        "id": "m17-check-15",
        "texto": "Apliquei a decomposição também ao Brasil, e não só à outra jurisdição.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m17/aparato.json",
          "campo": "checklist_final.itens[14].texto",
          "linha": null
        }
      },
      {
        "id": "m17-check-16",
        "texto": "Nomeei de que instituição cada mecanismo estrangeiro depende — operar, contabilizar, liquidar, fiscalizar, julgar, financiar.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m17/aparato.json",
          "campo": "checklist_final.itens[15].texto",
          "linha": null
        }
      },
      {
        "id": "m17-check-17",
        "texto": "Verifiquei qual instituição brasileira ocupa cada função, ou declarei a ausência.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m17/aparato.json",
          "campo": "checklist_final.itens[16].texto",
          "linha": null
        }
      },
      {
        "id": "m17-check-18",
        "texto": "Identifiquei qual dos quatro números de penetração renovável está sendo citado.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m17/aparato.json",
          "campo": "checklist_final.itens[17].texto",
          "linha": null
        }
      },
      {
        "id": "m17-check-19",
        "texto": "Não comparei capacidade instalada com geração, nem meta futura com resultado realizado.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m17/aparato.json",
          "campo": "checklist_final.itens[18].texto",
          "linha": null
        }
      },
      {
        "id": "m17-check-20",
        "texto": "Verifiquei se o fator de utilização citado separa recurso, disponibilidade e corte de geração.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m17/aparato.json",
          "campo": "checklist_final.itens[19].texto",
          "linha": null
        }
      },
      {
        "id": "m17-check-21",
        "texto": "Declarei o saldo de intercâmbio antes de comparar penetração entre sistemas com interconexões diferentes.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m17/aparato.json",
          "campo": "checklist_final.itens[20].texto",
          "linha": null
        }
      },
      {
        "id": "m17-check-22",
        "texto": "Classifiquei cada instrumento de política estrangeira na régua de estágio do Módulo 16, e não tratei anúncio como regra vigente.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m17/aparato.json",
          "campo": "checklist_final.itens[21].texto",
          "linha": null
        }
      },
      {
        "id": "m17-check-23",
        "texto": "Verifiquei o cronograma de caixa de qualquer mecanismo de fronteira antes de somar exposição bruta.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m17/aparato.json",
          "campo": "checklist_final.itens[22].texto",
          "linha": null
        }
      },
      {
        "id": "m17-check-24",
        "texto": "Verifiquei se emissão indireta de eletricidade entra no setor em questão — entra para cimento e fertilizantes, não para ferro, aço e alumínio.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m17/aparato.json",
          "campo": "checklist_final.itens[23].texto",
          "linha": null
        }
      },
      {
        "id": "m17-check-25",
        "texto": "Verifiquei o enquadramento em oito dígitos antes de assumir que um produto está no escopo.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m17/aparato.json",
          "campo": "checklist_final.itens[24].texto",
          "linha": null
        }
      },
      {
        "id": "m17-check-26",
        "texto": "Verifiquei se existe preço de carbono pago na origem para abater, e em que estágio ele está.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m17/aparato.json",
          "campo": "checklist_final.itens[25].texto",
          "linha": null
        }
      },
      {
        "id": "m17-check-27",
        "texto": "Tratei material de plataforma comercial, consultoria e associação setorial como posição de parte interessada, nunca como origem de número — inclusive material favorável ao NIVAR.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m17/aparato.json",
          "campo": "checklist_final.itens[26].texto",
          "linha": null
        }
      },
      {
        "id": "m17-check-28",
        "texto": "Cruzei pelo menos duas das quatro dimensões do critério antes de qualquer veredito comparativo.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m17/aparato.json",
          "campo": "checklist_final.itens[27].texto",
          "linha": null
        }
      },
      {
        "id": "m17-check-29",
        "texto": "Verifiquei se alguma jurisdição foi tratada como padrão contra o qual as outras são desvios — inclusive se o Brasil foi tratado como a anomalia a explicar.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m17/aparato.json",
          "campo": "checklist_final.itens[28].texto",
          "linha": null
        }
      },
      {
        "id": "m17-check-30",
        "texto": "Recusei tanto “o Brasil está atrasado” quanto “o modelo brasileiro é único e incomparável” como conclusões, devolvendo em lugar delas perímetro, decomposição em três parcelas, pressuposto institucional e as condições que fariam cada leitura mudar.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m17/aparato.json",
          "campo": "checklist_final.itens[29].texto",
          "linha": null
        }
      }
    ]
  }
];
