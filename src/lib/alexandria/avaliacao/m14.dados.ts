// GERADO por tools/alexandria-dados/avaliacao/gerar-avaliacao-m14-m15.mjs 14 — não editar à mão.
// Fonte: docs/alexandria-v2/extraction/m14/aparato.json (§Ex, §Quiz, §Final, fichas declaradas nas aulas) e o texto das aulas
// (MODULO_14_CORPO, conferido contra o HTML). Conferência: verificar-avaliacao-m14-m15.mjs 14.
// 35 itens por aula (20 da fonte, 15 derivados) · 10 questões na prova · 26 itens no checklist.
// Relatório: docs/alexandria-v3/porte/m14.md.

import type { ChecklistDoModulo, ExercicioDaAula, ExercicioDoModulo, ProvaDoModulo } from '../avaliacao';

export const EXERCICIOS_DAS_AULAS: ExercicioDaAula[] = [
  {
    "id": "m14-ex-01",
    "moduloId": "modulo-14",
    "aula": 1,
    "origem": "fonte",
    "tipo": "aberto",
    "enunciado": "Uma apresentação afirma: \"o Brasil produziu 40,7 bilhões de litros de etanol\". Esse dado é comparável a uma estatística elétrica de 2025?",
    "gabarito": null,
    "referencia": "Não, e a resposta correta identifica a ambiguidade <b>antes</b> de tentar a comparação. O valor de 40,69 bilhões de litros é a projeção do primeiro levantamento da Conab para o <b>ano-safra 2026/27</b> — ciclo iniciado em abril de 2026 e encerrado em março de 2027. Uma estatística elétrica de 2025 é de <b>ano-calendário</b>. As duas janelas não coincidem, e a diferença pode chegar a doze meses. Além disso, o número é <b>projeção de primeiro levantamento</b>, sujeito a três revisões ao longo do ciclo, enquanto a estatística elétrica é realizada. Duas incompatibilidades, não uma. A pergunta correta ao interlocutor é: \"de qual base temporal é esse número, e é levantamento ou fechamento?\"",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "docs/alexandria-v2/extraction/m14/aparato.json",
      "campo": "exercicios.exercicios[0].enunciado",
      "linha": 2669
    },
    "evidencias": [
      {
        "arquivo": "docs/alexandria-v2/extraction/m14/aparato.json",
        "campo": "exercicios.exercicios[0].enunciado",
        "linha": 2669,
        "trecho": "Uma apresentação afirma: \"o Brasil produziu 40,7 bilhões de litros de etanol\". Esse dado é comparável a uma estatística elétrica de 2025?"
      },
      {
        "arquivo": "docs/alexandria-v2/extraction/m14/aparato.json",
        "campo": "exercicios.exercicios[0].resposta_referencia",
        "linha": 2669,
        "trecho": "Não, e a resposta correta identifica a ambiguidade antes de tentar a comparação. O valor de 40,69 bilhões de litros é a projeção do primeiro levantamento da Conab para o ano-safra 2026/27 — ciclo iniciado em abril de 2026 e encerrado em março de 2027. Uma estatística elétrica de 2025 é de ano-calendário. As duas janelas não coincidem, e a diferença pode chegar a doze meses. Além disso, o número é projeção de primeiro levantamento, sujeito a três revisões ao longo do ciclo, enquanto a estatística elétrica é realizada. Duas incompatibilidades, não uma. A pergunta correta ao interlocutor é: \"de qual base temporal é esse número, e é levantamento ou fechamento?\""
      }
    ],
    "alertas": [
      "Tag da fonte: \"Ex 01 · Base temporal\". A fonte não liga este exercício a aula (P9); o vínculo com a Aula 01 é por afinidade de tema (docs/alexandria-v2/estudos/aulas/m14.md)."
    ]
  },
  {
    "id": "m14-ex-05",
    "moduloId": "modulo-14",
    "aula": 1,
    "origem": "fonte",
    "tipo": "aberto",
    "enunciado": "Uma base prepara 10 milhões de litros de gasolina C sob o teor em vigor em agosto de 2026. Quanto de anidro e de gasolina A, ignorando variação volumétrica?",
    "gabarito": null,
    "referencia": "Sob <b>E32</b>, vigente desde 1º de agosto de 2026 por Resolução CNPE nº 9/2026: <b>3,2 milhões de litros de anidro</b> e <b>6,8 milhões de litros de gasolina A</b>. Sob o teor anterior, E30, seriam 3,0 e 7,0 milhões. A diferença de dois pontos percentuais move <b>200 mil litros</b> nesta única base — e é a mesma aritmética que, na escala nacional, o governo apresentou como razão para deixar de importar volume relevante de gasolina. Note também: o exercício exige declarar o teor <b>e a data</b>, porque a medida tem vigência de 180 dias prorrogável uma vez, e a gasolina premium permanece em E25.",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "docs/alexandria-v2/extraction/m14/aparato.json",
      "campo": "exercicios.exercicios[4].enunciado",
      "linha": 2716
    },
    "evidencias": [
      {
        "arquivo": "docs/alexandria-v2/extraction/m14/aparato.json",
        "campo": "exercicios.exercicios[4].enunciado",
        "linha": 2716,
        "trecho": "Uma base prepara 10 milhões de litros de gasolina C sob o teor em vigor em agosto de 2026. Quanto de anidro e de gasolina A, ignorando variação volumétrica?"
      },
      {
        "arquivo": "docs/alexandria-v2/extraction/m14/aparato.json",
        "campo": "exercicios.exercicios[4].resposta_referencia",
        "linha": 2716,
        "trecho": "Sob E32, vigente desde 1º de agosto de 2026 por Resolução CNPE nº 9/2026: 3,2 milhões de litros de anidro e 6,8 milhões de litros de gasolina A. Sob o teor anterior, E30, seriam 3,0 e 7,0 milhões. A diferença de dois pontos percentuais move 200 mil litros nesta única base — e é a mesma aritmética que, na escala nacional, o governo apresentou como razão para deixar de importar volume relevante de gasolina. Note também: o exercício exige declarar o teor e a data, porque a medida tem vigência de 180 dias prorrogável uma vez, e a gasolina premium permanece em E25."
      }
    ],
    "alertas": [
      "Tag da fonte: \"Ex 05 · Cálculo\". A fonte não liga este exercício a aula (P9); o vínculo com a Aula 01 é por afinidade de tema (docs/alexandria-v2/estudos/aulas/m14.md)."
    ]
  },
  {
    "id": "m14-ex-07",
    "moduloId": "modulo-14",
    "aula": 1,
    "origem": "fonte",
    "tipo": "aberto",
    "enunciado": "A agência reporta 35,9 bilhões de litros de etanol e a companhia de abastecimento reporta 37,5 bilhões para períodos próximos. Uma das duas está errada?",
    "gabarito": null,
    "referencia": "Nenhuma. As duas medem coisas diferentes, e a coexistência é normal. A agência consolida <b>produção por ano-calendário</b>, por produto autorizado. A companhia de abastecimento reporta <b>safra</b>, em janela agrícola, e pode agregar etanol de cana e de milho conforme a metodologia do levantamento. Cobertura, origem e janela diferem. Antes de comparar qualquer par de números deste setor, alinhe quatro coisas: <b>período, unidade, produto e cobertura</b>. Se qualquer uma das quatro divergir, a comparação precisa de conversão declarada ou não deve ser feita.",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "docs/alexandria-v2/extraction/m14/aparato.json",
      "campo": "exercicios.exercicios[6].enunciado",
      "linha": 2736
    },
    "evidencias": [
      {
        "arquivo": "docs/alexandria-v2/extraction/m14/aparato.json",
        "campo": "exercicios.exercicios[6].enunciado",
        "linha": 2736,
        "trecho": "A agência reporta 35,9 bilhões de litros de etanol e a companhia de abastecimento reporta 37,5 bilhões para períodos próximos. Uma das duas está errada?"
      },
      {
        "arquivo": "docs/alexandria-v2/extraction/m14/aparato.json",
        "campo": "exercicios.exercicios[6].resposta_referencia",
        "linha": 2736,
        "trecho": "Nenhuma. As duas medem coisas diferentes, e a coexistência é normal. A agência consolida produção por ano-calendário, por produto autorizado. A companhia de abastecimento reporta safra, em janela agrícola, e pode agregar etanol de cana e de milho conforme a metodologia do levantamento. Cobertura, origem e janela diferem. Antes de comparar qualquer par de números deste setor, alinhe quatro coisas: período, unidade, produto e cobertura. Se qualquer uma das quatro divergir, a comparação precisa de conversão declarada ou não deve ser feita."
      }
    ],
    "alertas": [
      "Tag da fonte: \"Ex 07 · Base temporal\". A fonte não liga este exercício a aula (P9); o vínculo com a Aula 01 é por afinidade de tema (docs/alexandria-v2/estudos/aulas/m14.md)."
    ]
  },
  {
    "id": "m14-a01-d01",
    "moduloId": "modulo-14",
    "aula": 1,
    "origem": "derivado-da-aula",
    "tipo": "escolha",
    "enunciado": "Segundo a aula, a demanda de etanol anidro é igual a quê?",
    "alternativas": [
      "Ao preço relativo do hidratado contra a gasolina C, que cada motorista decide na bomba",
      "Ao volume de gasolina C vendido multiplicado pelo percentual de mistura obrigatória",
      "À capacidade de destilação instalada nas usinas do Centro-Sul"
    ],
    "gabarito": 1,
    "referencia": "O anidro não compete com nada: a demanda dele é derivada, e igual ao volume de gasolina C vendido multiplicado pelo percentual de mistura obrigatória.",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "alternativa-correta",
    "fonte": {
      "arquivo": "Alexandria modulos/alexandria_modulo14.html",
      "campo": "section#a01 · bloco 2 (paragrafo)",
      "linha": null
    },
    "evidencias": [
      {
        "arquivo": "Alexandria modulos/alexandria_modulo14.html",
        "campo": "section#a01 · bloco 2 (paragrafo)",
        "linha": null,
        "trecho": "O anidro não compete com nada: a demanda dele é derivada, e igual ao volume de gasolina C vendido multiplicado pelo percentual de mistura obrigatória."
      }
    ],
    "alertas": [
      "Pergunta e distratores: voz da Alexandria (decisões 7 e 8). A resposta é o trecho literal da aula em `evidencias`."
    ]
  },
  {
    "id": "m14-a01-d02",
    "moduloId": "modulo-14",
    "aula": 1,
    "origem": "derivado-da-aula",
    "tipo": "aberto",
    "enunciado": "Em 2025 a produção total de etanol caiu 2,8%. O que a aula diz que esse total, citado sozinho, esconde?",
    "gabarito": null,
    "referencia": "uma das metades subiu por decisão regulatória e a outra desceu por preço relativo, e a soma das duas coisas produziu um número agregado que não descreve nenhuma das duas.",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "Alexandria modulos/alexandria_modulo14.html",
      "campo": "section#a01 · bloco 5 (paragrafo)",
      "linha": null
    },
    "evidencias": [
      {
        "arquivo": "Alexandria modulos/alexandria_modulo14.html",
        "campo": "section#a01 · bloco 5 (paragrafo)",
        "linha": null,
        "trecho": "uma das metades subiu por decisão regulatória e a outra desceu por preço relativo, e a soma das duas coisas produziu um número agregado que não descreve nenhuma das duas."
      }
    ],
    "alertas": [
      "Pergunta e distratores: voz da Alexandria (decisões 7 e 8). A resposta é o trecho literal da aula em `evidencias`."
    ]
  },
  {
    "id": "m14-ex-09",
    "moduloId": "modulo-14",
    "aula": 2,
    "origem": "fonte",
    "tipo": "aberto",
    "enunciado": "Uma unidade mói 2,5 milhões de toneladas de cana a 140 kg de ATR por tonelada. Qual o ATR total, e por que ele importa mais que a tonelagem?",
    "gabarito": null,
    "referencia": "<b>350 milhões de quilos de ATR</b> antes de perdas industriais. Importa mais que a tonelagem porque é sobre o ATR, e não sobre a cana, que incide a decisão de mix: cada quilo de ATR pode virar açúcar ou etanol, e a remuneração relativa dos dois destinos é o sinal de arbitragem. Duas unidades com a mesma moagem e ATR diferente têm bases de produto recuperável diferentes, e portanto receitas potenciais diferentes com o mesmo mix.",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "docs/alexandria-v2/extraction/m14/aparato.json",
      "campo": "exercicios.exercicios[8].enunciado",
      "linha": 2757
    },
    "evidencias": [
      {
        "arquivo": "docs/alexandria-v2/extraction/m14/aparato.json",
        "campo": "exercicios.exercicios[8].enunciado",
        "linha": 2757,
        "trecho": "Uma unidade mói 2,5 milhões de toneladas de cana a 140 kg de ATR por tonelada. Qual o ATR total, e por que ele importa mais que a tonelagem?"
      },
      {
        "arquivo": "docs/alexandria-v2/extraction/m14/aparato.json",
        "campo": "exercicios.exercicios[8].resposta_referencia",
        "linha": 2757,
        "trecho": "350 milhões de quilos de ATR antes de perdas industriais. Importa mais que a tonelagem porque é sobre o ATR, e não sobre a cana, que incide a decisão de mix: cada quilo de ATR pode virar açúcar ou etanol, e a remuneração relativa dos dois destinos é o sinal de arbitragem. Duas unidades com a mesma moagem e ATR diferente têm bases de produto recuperável diferentes, e portanto receitas potenciais diferentes com o mesmo mix."
      }
    ],
    "alertas": [
      "Tag da fonte: \"Ex 09 · Cálculo\". A fonte não liga este exercício a aula (P9); o vínculo com a Aula 02 é por afinidade de tema (docs/alexandria-v2/estudos/aulas/m14.md)."
    ]
  },
  {
    "id": "m14-a02-d01",
    "moduloId": "modulo-14",
    "aula": 2,
    "origem": "derivado-da-aula",
    "tipo": "escolha",
    "enunciado": "Qual é o indicador central da cadeia da cana, segundo a aula?",
    "alternativas": [
      "A tonelada de cana moída",
      "O ATR, em quilos de açúcares totais recuperáveis por tonelada de cana",
      "O TCH, em toneladas de cana por hectare"
    ],
    "gabarito": 1,
    "referencia": "O indicador central da cadeia da cana não é a tonelada — é o ATR, sigla de Açúcares Totais Recuperáveis, expresso em quilos de ATR por tonelada de cana.",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "alternativa-correta",
    "fonte": {
      "arquivo": "Alexandria modulos/alexandria_modulo14.html",
      "campo": "section#a02 · bloco 1 (paragrafo)",
      "linha": null
    },
    "evidencias": [
      {
        "arquivo": "Alexandria modulos/alexandria_modulo14.html",
        "campo": "section#a02 · bloco 1 (paragrafo)",
        "linha": null,
        "trecho": "O indicador central da cadeia da cana não é a tonelada — é o ATR, sigla de Açúcares Totais Recuperáveis, expresso em quilos de ATR por tonelada de cana."
      }
    ],
    "alertas": [
      "Pergunta e distratores: voz da Alexandria (decisões 7 e 8). A resposta é o trecho literal da aula em `evidencias`."
    ]
  },
  {
    "id": "m14-a02-d02",
    "moduloId": "modulo-14",
    "aula": 2,
    "origem": "derivado-da-aula",
    "tipo": "aberto",
    "enunciado": "Por que um preço relativo favorável ao etanol pode não mover nenhum quilo de ATR?",
    "gabarito": null,
    "referencia": "um sinal de preço favorável ao etanol não move nenhum ATR se a planta já está no teto de etanol da sua faixa.",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "Alexandria modulos/alexandria_modulo14.html",
      "campo": "section#a02 · bloco 13 (paragrafo)",
      "linha": null
    },
    "evidencias": [
      {
        "arquivo": "Alexandria modulos/alexandria_modulo14.html",
        "campo": "section#a02 · bloco 13 (paragrafo)",
        "linha": null,
        "trecho": "um sinal de preço favorável ao etanol não move nenhum ATR se a planta já está no teto de etanol da sua faixa."
      }
    ],
    "alertas": [
      "Pergunta e distratores: voz da Alexandria (decisões 7 e 8). A resposta é o trecho literal da aula em `evidencias`."
    ]
  },
  {
    "id": "m14-ex-04",
    "moduloId": "modulo-14",
    "aula": 3,
    "origem": "fonte",
    "tipo": "aberto",
    "enunciado": "Dado o insumo \"bagaço de cana\", qual rota, qual produto, qual órgão competente, e o que deixou de ser feito?",
    "gabarito": null,
    "referencia": "Há <b>quatro destinos concorrentes</b> para o mesmo bagaço, e a resposta correta os nomeia. <b>Um:</b> vapor de processo — uso interno, prioridade absoluta, sem ele não há moagem. <b>Dois:</b> queima em caldeira e turbina gerando eletricidade exportada — órgão competente ANEEL para outorga e capacidade, ONS para operação, CCEE para comercialização. <b>Três:</b> hidrólise para etanol de segunda geração — órgão competente ANP, produto etanol. <b>Quatro:</b> venda como biomassa a terceiros. Cada tonelada que vai para um dos destinos <b>não</b> vai para os outros três, e é essa a informação que quase nunca acompanha um número de 2G ou de bioeletricidade.",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "docs/alexandria-v2/extraction/m14/aparato.json",
      "campo": "exercicios.exercicios[3].enunciado",
      "linha": 2704
    },
    "evidencias": [
      {
        "arquivo": "docs/alexandria-v2/extraction/m14/aparato.json",
        "campo": "exercicios.exercicios[3].enunciado",
        "linha": 2704,
        "trecho": "Dado o insumo \"bagaço de cana\", qual rota, qual produto, qual órgão competente, e o que deixou de ser feito?"
      },
      {
        "arquivo": "docs/alexandria-v2/extraction/m14/aparato.json",
        "campo": "exercicios.exercicios[3].resposta_referencia",
        "linha": 2704,
        "trecho": "Há quatro destinos concorrentes para o mesmo bagaço, e a resposta correta os nomeia. Um: vapor de processo — uso interno, prioridade absoluta, sem ele não há moagem. Dois: queima em caldeira e turbina gerando eletricidade exportada — órgão competente ANEEL para outorga e capacidade, ONS para operação, CCEE para comercialização. Três: hidrólise para etanol de segunda geração — órgão competente ANP, produto etanol. Quatro: venda como biomassa a terceiros. Cada tonelada que vai para um dos destinos não vai para os outros três, e é essa a informação que quase nunca acompanha um número de 2G ou de bioeletricidade."
      }
    ],
    "alertas": [
      "Tag da fonte: \"Ex 04 · Rota\". A fonte não liga este exercício a aula (P9); o vínculo com a Aula 03 é por afinidade de tema (docs/alexandria-v2/estudos/aulas/m14.md)."
    ]
  },
  {
    "id": "m14-ex-11",
    "moduloId": "modulo-14",
    "aula": 3,
    "origem": "fonte",
    "tipo": "aberto",
    "enunciado": "Uma planta produz etanol usando gás natural como fonte térmica. Isso é possível, e o que muda?",
    "gabarito": null,
    "referencia": "É possível e é característico da <b>rota de milho</b>, que não tem resíduo combustível equivalente ao bagaço e precisa contratar fonte térmica externa — biomassa comprada, cavaco ou gás. O que muda: um custo operacional que a rota de cana não tem; uma exposição a preço de combustível que a rota de cana não tem; e, decisivamente, uma <b>intensidade de carbono diferente</b>, porque a energia consumida na conversão entra no cálculo de ciclo de vida. Duas plantas produzindo a mesma molécula podem ter notas de eficiência distintas exatamente por isso — e é por isso que \"etanol\" não é uma rota, e a nota de eficiência é por unidade produtora, não por combustível.",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "docs/alexandria-v2/extraction/m14/aparato.json",
      "campo": "exercicios.exercicios[10].enunciado",
      "linha": 2777
    },
    "evidencias": [
      {
        "arquivo": "docs/alexandria-v2/extraction/m14/aparato.json",
        "campo": "exercicios.exercicios[10].enunciado",
        "linha": 2777,
        "trecho": "Uma planta produz etanol usando gás natural como fonte térmica. Isso é possível, e o que muda?"
      },
      {
        "arquivo": "docs/alexandria-v2/extraction/m14/aparato.json",
        "campo": "exercicios.exercicios[10].resposta_referencia",
        "linha": 2777,
        "trecho": "É possível e é característico da rota de milho, que não tem resíduo combustível equivalente ao bagaço e precisa contratar fonte térmica externa — biomassa comprada, cavaco ou gás. O que muda: um custo operacional que a rota de cana não tem; uma exposição a preço de combustível que a rota de cana não tem; e, decisivamente, uma intensidade de carbono diferente, porque a energia consumida na conversão entra no cálculo de ciclo de vida. Duas plantas produzindo a mesma molécula podem ter notas de eficiência distintas exatamente por isso — e é por isso que \"etanol\" não é uma rota, e a nota de eficiência é por unidade produtora, não por combustível."
      }
    ],
    "alertas": [
      "Tag da fonte: \"Ex 11 · Rota\". A fonte não liga este exercício a aula (P9); o vínculo com a Aula 03 é por afinidade de tema (docs/alexandria-v2/estudos/aulas/m14.md)."
    ]
  },
  {
    "id": "m14-a03-d01",
    "moduloId": "modulo-14",
    "aula": 3,
    "origem": "derivado-da-aula",
    "tipo": "escolha",
    "enunciado": "De onde vem o vapor de processo de uma unidade de etanol de milho?",
    "alternativas": [
      "Do bagaço que a própria unidade gera",
      "De fonte térmica externa contratada",
      "Da palha recolhida no campo"
    ],
    "gabarito": 1,
    "referencia": "A unidade de milho não tem resíduo combustível equivalente e precisa contratar fonte térmica externa — biomassa comprada, cavaco, ou gás.",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "alternativa-correta",
    "fonte": {
      "arquivo": "Alexandria modulos/alexandria_modulo14.html",
      "campo": "section#a03 · bloco 4 (nota)",
      "linha": null
    },
    "evidencias": [
      {
        "arquivo": "Alexandria modulos/alexandria_modulo14.html",
        "campo": "section#a03 · bloco 4 (nota)",
        "linha": null,
        "trecho": "A unidade de milho não tem resíduo combustível equivalente e precisa contratar fonte térmica externa — biomassa comprada, cavaco, ou gás."
      }
    ],
    "alertas": [
      "Pergunta e distratores: voz da Alexandria (decisões 7 e 8). A resposta é o trecho literal da aula em `evidencias`."
    ]
  },
  {
    "id": "m14-a03-d02",
    "moduloId": "modulo-14",
    "aula": 3,
    "origem": "derivado-da-aula",
    "tipo": "aberto",
    "enunciado": "O que significa, para a mesma planta, retirar fibra do circuito térmico para a hidrólise de segunda geração?",
    "gabarito": null,
    "referencia": "Retirar fibra do circuito para a hidrólise significa faltar vapor ou faltar exportação elétrica, e o valor do 2G precisa superar o valor do que deixou de ser produzido, não apenas cobrir o próprio custo.",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "Alexandria modulos/alexandria_modulo14.html",
      "campo": "section#a03 · bloco 9 (paragrafo)",
      "linha": null
    },
    "evidencias": [
      {
        "arquivo": "Alexandria modulos/alexandria_modulo14.html",
        "campo": "section#a03 · bloco 9 (paragrafo)",
        "linha": null,
        "trecho": "Retirar fibra do circuito para a hidrólise significa faltar vapor ou faltar exportação elétrica, e o valor do 2G precisa superar o valor do que deixou de ser produzido, não apenas cobrir o próprio custo."
      }
    ],
    "alertas": [
      "Pergunta e distratores: voz da Alexandria (decisões 7 e 8). A resposta é o trecho literal da aula em `evidencias`."
    ]
  },
  {
    "id": "m14-ex-03",
    "moduloId": "modulo-14",
    "aula": 4,
    "origem": "fonte",
    "tipo": "aberto",
    "enunciado": "Um interlocutor afirma que a mistura de biodiesel no diesel é de 16%. Está em vigor?",
    "gabarito": null,
    "referencia": "Não. Em 2 de agosto de 2026, o teor em vigor é <b>B15</b>, vigente desde 1º de agosto de 2025. O B16 estava previsto na Lei nº 14.993/2024 para <b>março de 2026</b>, condicionado a viabilidade técnica comprovada — a data passou e o percentual não subiu; os testes foram iniciados em 2026 e o conselho não deliberou a elevação. A resposta completa distingue os quatro estados: <b>teto legal autorizado</b> de 25% mediante viabilidade técnica; <b>em vigor</b> B15; <b>trajetória legal</b> apontando para 20% até março de 2030; e <b>prazo legal vencido e não implementado</b>, que é o caso do B16. Onde verificar: resolução do CNPE e página da ANP, na data de uso.",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "docs/alexandria-v2/extraction/m14/aparato.json",
      "campo": "exercicios.exercicios[2].enunciado",
      "linha": 2692
    },
    "evidencias": [
      {
        "arquivo": "docs/alexandria-v2/extraction/m14/aparato.json",
        "campo": "exercicios.exercicios[2].enunciado",
        "linha": 2692,
        "trecho": "Um interlocutor afirma que a mistura de biodiesel no diesel é de 16%. Está em vigor?"
      },
      {
        "arquivo": "docs/alexandria-v2/extraction/m14/aparato.json",
        "campo": "exercicios.exercicios[2].resposta_referencia",
        "linha": 2692,
        "trecho": "Não. Em 2 de agosto de 2026, o teor em vigor é B15, vigente desde 1º de agosto de 2025. O B16 estava previsto na Lei nº 14.993/2024 para março de 2026, condicionado a viabilidade técnica comprovada — a data passou e o percentual não subiu; os testes foram iniciados em 2026 e o conselho não deliberou a elevação. A resposta completa distingue os quatro estados: teto legal autorizado de 25% mediante viabilidade técnica; em vigor B15; trajetória legal apontando para 20% até março de 2030; e prazo legal vencido e não implementado, que é o caso do B16. Onde verificar: resolução do CNPE e página da ANP, na data de uso."
      }
    ],
    "alertas": [
      "Tag da fonte: \"Ex 03 · Estado de política\". A fonte não liga este exercício a aula (P9); o vínculo com a Aula 04 é por afinidade de tema (docs/alexandria-v2/estudos/aulas/m14.md)."
    ]
  },
  {
    "id": "m14-ex-06",
    "moduloId": "modulo-14",
    "aula": 4,
    "origem": "fonte",
    "tipo": "aberto",
    "enunciado": "Uma distribuidora comercializa 200 milhões de litros de diesel B. Quanto de B100 está incorporado?",
    "gabarito": null,
    "referencia": "Sob B15: <b>30 milhões de litros</b>. Se o teor subisse para B16, seriam 32 milhões — <b>2 milhões de litros de demanda adicional criados por um único ponto percentual</b>, nesta distribuidora. Multiplique pela escala nacional do diesel B e você tem a razão pela qual um ponto de mistura é objeto de disputa política contínua, e por que uma entidade que representa produtores tem interesse declarado nessa variável.",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "docs/alexandria-v2/extraction/m14/aparato.json",
      "campo": "exercicios.exercicios[5].enunciado",
      "linha": 2727
    },
    "evidencias": [
      {
        "arquivo": "docs/alexandria-v2/extraction/m14/aparato.json",
        "campo": "exercicios.exercicios[5].enunciado",
        "linha": 2727,
        "trecho": "Uma distribuidora comercializa 200 milhões de litros de diesel B. Quanto de B100 está incorporado?"
      },
      {
        "arquivo": "docs/alexandria-v2/extraction/m14/aparato.json",
        "campo": "exercicios.exercicios[5].resposta_referencia",
        "linha": 2727,
        "trecho": "Sob B15: 30 milhões de litros. Se o teor subisse para B16, seriam 32 milhões — 2 milhões de litros de demanda adicional criados por um único ponto percentual, nesta distribuidora. Multiplique pela escala nacional do diesel B e você tem a razão pela qual um ponto de mistura é objeto de disputa política contínua, e por que uma entidade que representa produtores tem interesse declarado nessa variável."
      }
    ],
    "alertas": [
      "Tag da fonte: \"Ex 06 · Cálculo\". A fonte não liga este exercício a aula (P9); o vínculo com a Aula 04 é por afinidade de tema (docs/alexandria-v2/estudos/aulas/m14.md)."
    ]
  },
  {
    "id": "m14-ex-10",
    "moduloId": "modulo-14",
    "aula": 4,
    "origem": "fonte",
    "tipo": "aberto",
    "enunciado": "Uma notícia informa que o conselho \"aprovou mudanças na mistura de biodiesel\" em julho de 2026. O teor mudou?",
    "gabarito": null,
    "referencia": "Não. Na reunião de 14 de julho de 2026, o colegiado alterou as regras de <b>fornecimento</b> — determinando que o biodiesel destinado ao cumprimento do percentual obrigatório venha exclusivamente de unidades autorizadas pela agência — <b>sem</b> alterar o teor, que permanece em B15. Na mesma reunião foi aprovada a elevação do etanol anidro na gasolina para 32%. Duas decisões, dois combustíveis, naturezas distintas, uma manchete só. A pergunta de verificação diante de qualquer notícia de reunião de conselho é sempre a mesma: <b>mudou o número, mudou a regra de quem fornece, ou mudou o prazo?</b>",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "docs/alexandria-v2/extraction/m14/aparato.json",
      "campo": "exercicios.exercicios[9].enunciado",
      "linha": 2766
    },
    "evidencias": [
      {
        "arquivo": "docs/alexandria-v2/extraction/m14/aparato.json",
        "campo": "exercicios.exercicios[9].enunciado",
        "linha": 2766,
        "trecho": "Uma notícia informa que o conselho \"aprovou mudanças na mistura de biodiesel\" em julho de 2026. O teor mudou?"
      },
      {
        "arquivo": "docs/alexandria-v2/extraction/m14/aparato.json",
        "campo": "exercicios.exercicios[9].resposta_referencia",
        "linha": 2766,
        "trecho": "Não. Na reunião de 14 de julho de 2026, o colegiado alterou as regras de fornecimento — determinando que o biodiesel destinado ao cumprimento do percentual obrigatório venha exclusivamente de unidades autorizadas pela agência — sem alterar o teor, que permanece em B15. Na mesma reunião foi aprovada a elevação do etanol anidro na gasolina para 32%. Duas decisões, dois combustíveis, naturezas distintas, uma manchete só. A pergunta de verificação diante de qualquer notícia de reunião de conselho é sempre a mesma: mudou o número, mudou a regra de quem fornece, ou mudou o prazo?"
      }
    ],
    "alertas": [
      "Tag da fonte: \"Ex 10 · Estado de política\". A fonte não liga este exercício a aula (P9); o vínculo com a Aula 04 é por afinidade de tema (docs/alexandria-v2/estudos/aulas/m14.md)."
    ]
  },
  {
    "id": "m14-a04-d01",
    "moduloId": "modulo-14",
    "aula": 4,
    "origem": "derivado-da-aula",
    "tipo": "escolha",
    "enunciado": "Segundo a aula, qual matéria-prima responde pela maior parte do biodiesel brasileiro?",
    "alternativas": [
      "Sebo bovino",
      "Óleo de soja",
      "Óleo de cozinha usado"
    ],
    "gabarito": 1,
    "referencia": "A cadeia brasileira de biodiesel é fortemente concentrada em óleo de soja, que responde pela maior parte das matérias-primas segundo o Balanço Energético Nacional 2026",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "alternativa-correta",
    "fonte": {
      "arquivo": "Alexandria modulos/alexandria_modulo14.html",
      "campo": "section#a04 · bloco 11 (paragrafo)",
      "linha": null
    },
    "evidencias": [
      {
        "arquivo": "Alexandria modulos/alexandria_modulo14.html",
        "campo": "section#a04 · bloco 11 (paragrafo)",
        "linha": null,
        "trecho": "A cadeia brasileira de biodiesel é fortemente concentrada em óleo de soja, que responde pela maior parte das matérias-primas segundo o Balanço Energético Nacional 2026"
      }
    ],
    "alertas": [
      "Pergunta e distratores: voz da Alexandria (decisões 7 e 8). A resposta é o trecho literal da aula em `evidencias`."
    ]
  },
  {
    "id": "m14-a04-d02",
    "moduloId": "modulo-14",
    "aula": 4,
    "origem": "derivado-da-aula",
    "tipo": "aberto",
    "enunciado": "Como a aula define a demanda teórica de B100?",
    "gabarito": null,
    "referencia": "A demanda teórica de B100 é o produto entre o volume de diesel B comercializado e o teor obrigatório.",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "Alexandria modulos/alexandria_modulo14.html",
      "campo": "section#a04 · bloco 9 (paragrafo)",
      "linha": null
    },
    "evidencias": [
      {
        "arquivo": "Alexandria modulos/alexandria_modulo14.html",
        "campo": "section#a04 · bloco 9 (paragrafo)",
        "linha": null,
        "trecho": "A demanda teórica de B100 é o produto entre o volume de diesel B comercializado e o teor obrigatório."
      }
    ],
    "alertas": [
      "Pergunta e distratores: voz da Alexandria (decisões 7 e 8). A resposta é o trecho literal da aula em `evidencias`."
    ]
  },
  {
    "id": "m14-ex-02",
    "moduloId": "modulo-14",
    "aula": 5,
    "origem": "fonte",
    "tipo": "aberto",
    "enunciado": "Uma cogeração tem 80 MW de potência instalada. Quanta energia ela entrega à rede no ano?",
    "gabarito": null,
    "referencia": "A resposta correta <b>recusa responder</b> com a informação dada, e nomeia as três grandezas separadamente. Faltam: <b>dias efetivos de safra</b>, <b>disponibilidade da planta dentro da safra</b> e <b>autoconsumo de vapor e eletricidade de processo</b>. Com 210 dias de safra, 88% de disponibilidade e 55% de autoconsumo, os 80 MW produzem cerca de 355 GWh brutos e entregam cerca de 160 GWh à rede — um fator de capacidade anual em torno de 23%, contra os 100% que a multiplicação ingênua por 8.760 horas sugeriria. Potência instalada, energia gerada e energia exportada são <b>três números</b>, e só o terceiro gera receita de venda de energia.",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "docs/alexandria-v2/extraction/m14/aparato.json",
      "campo": "exercicios.exercicios[1].enunciado",
      "linha": 2681
    },
    "evidencias": [
      {
        "arquivo": "docs/alexandria-v2/extraction/m14/aparato.json",
        "campo": "exercicios.exercicios[1].enunciado",
        "linha": 2681,
        "trecho": "Uma cogeração tem 80 MW de potência instalada. Quanta energia ela entrega à rede no ano?"
      },
      {
        "arquivo": "docs/alexandria-v2/extraction/m14/aparato.json",
        "campo": "exercicios.exercicios[1].resposta_referencia",
        "linha": 2681,
        "trecho": "A resposta correta recusa responder com a informação dada, e nomeia as três grandezas separadamente. Faltam: dias efetivos de safra, disponibilidade da planta dentro da safra e autoconsumo de vapor e eletricidade de processo. Com 210 dias de safra, 88% de disponibilidade e 55% de autoconsumo, os 80 MW produzem cerca de 355 GWh brutos e entregam cerca de 160 GWh à rede — um fator de capacidade anual em torno de 23%, contra os 100% que a multiplicação ingênua por 8.760 horas sugeriria. Potência instalada, energia gerada e energia exportada são três números, e só o terceiro gera receita de venda de energia."
      }
    ],
    "alertas": [
      "Tag da fonte: \"Ex 02 · Grandeza\". A fonte não liga este exercício a aula (P9); o vínculo com a Aula 05 é por afinidade de tema (docs/alexandria-v2/estudos/aulas/m14.md).",
      "O padrão do INST·06 (80 MW, 210 dias, 55% de autoconsumo, 88% de disponibilidade) é o cenário deste gabarito: a previsão do instrumento só abre o cálculo depois da tentativa deste exercício."
    ]
  },
  {
    "id": "m14-a05-d01",
    "moduloId": "modulo-14",
    "aula": 5,
    "origem": "derivado-da-aula",
    "tipo": "escolha",
    "enunciado": "Com que período o período de safra do Centro-Sul coincide, segundo a aula?",
    "alternativas": [
      "Com o período chuvoso das principais bacias hidrográficas",
      "Com o período seco das principais bacias hidrográficas",
      "Com o ano-calendário inteiro"
    ],
    "gabarito": 1,
    "referencia": "O período de safra do Centro-Sul coincide, aproximadamente, com o período seco das principais bacias hidrográficas que sustentam a geração hidrelétrica brasileira.",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "alternativa-correta",
    "fonte": {
      "arquivo": "Alexandria modulos/alexandria_modulo14.html",
      "campo": "section#a05 · bloco 6 (paragrafo)",
      "linha": null
    },
    "evidencias": [
      {
        "arquivo": "Alexandria modulos/alexandria_modulo14.html",
        "campo": "section#a05 · bloco 6 (paragrafo)",
        "linha": null,
        "trecho": "O período de safra do Centro-Sul coincide, aproximadamente, com o período seco das principais bacias hidrográficas que sustentam a geração hidrelétrica brasileira."
      }
    ],
    "alertas": [
      "Pergunta e distratores: voz da Alexandria (decisões 7 e 8). A resposta é o trecho literal da aula em `evidencias`."
    ]
  },
  {
    "id": "m14-a05-d02",
    "moduloId": "modulo-14",
    "aula": 5,
    "origem": "derivado-da-aula",
    "tipo": "aberto",
    "enunciado": "Em que sentido a energia de bagaço é \"firme\", segundo a aula, e de que essa firmeza depende?",
    "gabarito": null,
    "referencia": "a energia é firme enquanto a planta está moendo, e a firmeza depende de combustível disponível, disponibilidade da planta, capacidade de conexão e do próprio contrato",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "Alexandria modulos/alexandria_modulo14.html",
      "campo": "section#a05 · bloco 11 (paragrafo)",
      "linha": null
    },
    "evidencias": [
      {
        "arquivo": "Alexandria modulos/alexandria_modulo14.html",
        "campo": "section#a05 · bloco 11 (paragrafo)",
        "linha": null,
        "trecho": "a energia é firme enquanto a planta está moendo, e a firmeza depende de combustível disponível, disponibilidade da planta, capacidade de conexão e do próprio contrato"
      }
    ],
    "alertas": [
      "Pergunta e distratores: voz da Alexandria (decisões 7 e 8). A resposta é o trecho literal da aula em `evidencias`."
    ]
  },
  {
    "id": "m14-ex-08",
    "moduloId": "modulo-14",
    "aula": 6,
    "origem": "fonte",
    "tipo": "aberto",
    "enunciado": "Um projeto de biometano informa volume anual de 8 milhões de Nm³ com poder calorífico inferior de 36 MJ/Nm³. Qual a energia anual, e o que esse número não diz?",
    "gabarito": null,
    "referencia": "<b>288 milhões de MJ</b>, ou 288 mil GJ, ou 288 TJ. O que esse número <b>não</b> diz: se o volume é capacidade autorizada, produção efetiva ou volume vendável após autoconsumo, perdas e indisponibilidade; se o poder calorífico é o do contrato ou um valor de manual; qual a distância até o cliente e por qual rota de entrega; e qual a eficiência do equipamento que vai queimar o gás — porque equivalência energética não é equivalência de consumo. Quatro perguntas antes de o número virar dado.",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "docs/alexandria-v2/extraction/m14/aparato.json",
      "campo": "exercicios.exercicios[7].enunciado",
      "linha": 2747
    },
    "evidencias": [
      {
        "arquivo": "docs/alexandria-v2/extraction/m14/aparato.json",
        "campo": "exercicios.exercicios[7].enunciado",
        "linha": 2747,
        "trecho": "Um projeto de biometano informa volume anual de 8 milhões de Nm³ com poder calorífico inferior de 36 MJ/Nm³. Qual a energia anual, e o que esse número não diz?"
      },
      {
        "arquivo": "docs/alexandria-v2/extraction/m14/aparato.json",
        "campo": "exercicios.exercicios[7].resposta_referencia",
        "linha": 2747,
        "trecho": "288 milhões de MJ, ou 288 mil GJ, ou 288 TJ. O que esse número não diz: se o volume é capacidade autorizada, produção efetiva ou volume vendável após autoconsumo, perdas e indisponibilidade; se o poder calorífico é o do contrato ou um valor de manual; qual a distância até o cliente e por qual rota de entrega; e qual a eficiência do equipamento que vai queimar o gás — porque equivalência energética não é equivalência de consumo. Quatro perguntas antes de o número virar dado."
      }
    ],
    "alertas": [
      "Tag da fonte: \"Ex 08 · Grandeza\". A fonte não liga este exercício a aula (P9); o vínculo com a Aula 06 é por afinidade de tema (docs/alexandria-v2/estudos/aulas/m14.md)."
    ]
  },
  {
    "id": "m14-ex-12",
    "moduloId": "modulo-14",
    "aula": 6,
    "origem": "fonte",
    "tipo": "aberto",
    "enunciado": "Uma apresentação soma \"potencial de biometano de resíduos\" com \"capacidade autorizada\" e com \"produção\" numa única tabela de mercado. Qual o defeito?",
    "gabarito": null,
    "referencia": "São <b>três estágios diferentes</b> somados como se fossem a mesma grandeza, e o defeito é o mesmo que a régua de maturidade do Módulo 12 catalogou. <b>Potencial</b> é mapeamento técnico-econômico: responde \"onde seria possível\", não \"onde existe\". <b>Capacidade autorizada</b> é ato administrativo: existe planta habilitada, não necessariamente operando. <b>Produção</b> é medição. E falta ainda a quarta: <b>volume contratado</b>, que é o único que gera receita. Somar estágios diferentes na mesma tabela é o modo característico de inflar um mercado, e a correção é separar as colunas e declarar a data-base de cada uma.",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "docs/alexandria-v2/extraction/m14/aparato.json",
      "campo": "exercicios.exercicios[11].enunciado",
      "linha": 2789
    },
    "evidencias": [
      {
        "arquivo": "docs/alexandria-v2/extraction/m14/aparato.json",
        "campo": "exercicios.exercicios[11].enunciado",
        "linha": 2789,
        "trecho": "Uma apresentação soma \"potencial de biometano de resíduos\" com \"capacidade autorizada\" e com \"produção\" numa única tabela de mercado. Qual o defeito?"
      },
      {
        "arquivo": "docs/alexandria-v2/extraction/m14/aparato.json",
        "campo": "exercicios.exercicios[11].resposta_referencia",
        "linha": 2789,
        "trecho": "São três estágios diferentes somados como se fossem a mesma grandeza, e o defeito é o mesmo que a régua de maturidade do Módulo 12 catalogou. Potencial é mapeamento técnico-econômico: responde \"onde seria possível\", não \"onde existe\". Capacidade autorizada é ato administrativo: existe planta habilitada, não necessariamente operando. Produção é medição. E falta ainda a quarta: volume contratado, que é o único que gera receita. Somar estágios diferentes na mesma tabela é o modo característico de inflar um mercado, e a correção é separar as colunas e declarar a data-base de cada uma."
      }
    ],
    "alertas": [
      "Tag da fonte: \"Ex 12 · Grandeza\". A fonte não liga este exercício a aula (P9); o vínculo com a Aula 06 é por afinidade de tema (docs/alexandria-v2/estudos/aulas/m14.md)."
    ]
  },
  {
    "id": "m14-a06-d01",
    "moduloId": "modulo-14",
    "aula": 6,
    "origem": "derivado-da-aula",
    "tipo": "escolha",
    "enunciado": "Segundo a aula, o que é o biometano?",
    "alternativas": [
      "A mistura gasosa produzida por digestão anaeróbia, com metano, dióxido de carbono, umidade e contaminantes",
      "O biogás purificado até atender à especificação da agência",
      "O gás natural fóssil injetado na mesma rede que o biogás"
    ],
    "gabarito": 1,
    "referencia": "Biometano é o biogás purificado até atender à especificação da agência",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "alternativa-correta",
    "fonte": {
      "arquivo": "Alexandria modulos/alexandria_modulo14.html",
      "campo": "section#a06 · bloco 1 (paragrafo)",
      "linha": null
    },
    "evidencias": [
      {
        "arquivo": "Alexandria modulos/alexandria_modulo14.html",
        "campo": "section#a06 · bloco 1 (paragrafo)",
        "linha": null,
        "trecho": "Biometano é o biogás purificado até atender à especificação da agência"
      }
    ],
    "alertas": [
      "Pergunta e distratores: voz da Alexandria (decisões 7 e 8). A resposta é o trecho literal da aula em `evidencias`."
    ]
  },
  {
    "id": "m14-a06-d02",
    "moduloId": "modulo-14",
    "aula": 6,
    "origem": "derivado-da-aula",
    "tipo": "aberto",
    "enunciado": "A meta inicial de 0,5% do programa do gás natural é uma obrigação de comprar 0,5% de todo o gás como biometano?",
    "gabarito": null,
    "referencia": "a meta de 0,5% é expressa em redução de emissões, e não é uma obrigação volumétrica de 0,5% de todo o gás — as duas coisas produzem números diferentes.",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "Alexandria modulos/alexandria_modulo14.html",
      "campo": "section#a06 · bloco 11 (paragrafo)",
      "linha": null
    },
    "evidencias": [
      {
        "arquivo": "Alexandria modulos/alexandria_modulo14.html",
        "campo": "section#a06 · bloco 11 (paragrafo)",
        "linha": null,
        "trecho": "a meta de 0,5% é expressa em redução de emissões, e não é uma obrigação volumétrica de 0,5% de todo o gás — as duas coisas produzem números diferentes."
      }
    ],
    "alertas": [
      "Pergunta e distratores: voz da Alexandria (decisões 7 e 8). A resposta é o trecho literal da aula em `evidencias`."
    ]
  },
  {
    "id": "m14-ex-13",
    "moduloId": "modulo-14",
    "aula": 7,
    "origem": "fonte",
    "tipo": "aberto",
    "enunciado": "Uma rota vende 100 milhões de litros elegíveis, com 21,1 MJ/L e diferencial de intensidade de carbono de 55 gCO₂e/MJ. Qual a ordem de grandeza de créditos, e por que é apenas teto?",
    "gabarito": null,
    "referencia": "100.000.000 × 21,1 × 55 = 116,05 bilhões de gramas, ou cerca de <b>116.050 toneladas de CO₂ equivalente</b> — ordem de grandeza de 116 mil créditos. É <b>teto conceitual</b> por três razões: a fórmula exata, os fatores de elegibilidade e os arredondamentos seguem a regra da agência; o volume precisa ser efetivamente comercializado e documentado, não produzido; e a nota de eficiência precisa estar vigente na data. Além disso, o valor econômico depende do preço formado em bolsa, que variou de mais de cem reais por crédito em 2024 para poucas dezenas em 2026 — e por isso <b>nunca se crava</b> receita de atributo ambiental em caso base de projeto.",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "docs/alexandria-v2/extraction/m14/aparato.json",
      "campo": "exercicios.exercicios[12].enunciado",
      "linha": 2800
    },
    "evidencias": [
      {
        "arquivo": "docs/alexandria-v2/extraction/m14/aparato.json",
        "campo": "exercicios.exercicios[12].enunciado",
        "linha": 2800,
        "trecho": "Uma rota vende 100 milhões de litros elegíveis, com 21,1 MJ/L e diferencial de intensidade de carbono de 55 gCO₂e/MJ. Qual a ordem de grandeza de créditos, e por que é apenas teto?"
      },
      {
        "arquivo": "docs/alexandria-v2/extraction/m14/aparato.json",
        "campo": "exercicios.exercicios[12].resposta_referencia",
        "linha": 2800,
        "trecho": "100.000.000 × 21,1 × 55 = 116,05 bilhões de gramas, ou cerca de 116.050 toneladas de CO₂ equivalente — ordem de grandeza de 116 mil créditos. É teto conceitual por três razões: a fórmula exata, os fatores de elegibilidade e os arredondamentos seguem a regra da agência; o volume precisa ser efetivamente comercializado e documentado, não produzido; e a nota de eficiência precisa estar vigente na data. Além disso, o valor econômico depende do preço formado em bolsa, que variou de mais de cem reais por crédito em 2024 para poucas dezenas em 2026 — e por isso nunca se crava receita de atributo ambiental em caso base de projeto."
      }
    ],
    "alertas": [
      "Tag da fonte: \"Ex 13 · Cálculo\". A fonte não liga este exercício a aula (P9); o vínculo com a Aula 07 é por afinidade de tema (docs/alexandria-v2/estudos/aulas/m14.md).",
      "O padrão do INST·08 (etanol de cana, 100 milhões de litros, 55 gCO₂e/MJ, 21,1 MJ/L) é este enunciado: a previsão do instrumento só abre o cálculo depois da tentativa deste exercício.",
      "QA-M14-02b: o gabarito usa 21,1 MJ/L e o script do INST·08 usava 21,3 MJ/L; o instrumento foi alinhado ao gabarito (21,1)."
    ]
  },
  {
    "id": "m14-a07-d01",
    "moduloId": "modulo-14",
    "aula": 7,
    "origem": "derivado-da-aula",
    "tipo": "escolha",
    "enunciado": "O que um crédito de descarbonização representa, segundo a aula?",
    "alternativas": [
      "Um litro de biocombustível comercializado",
      "Uma tonelada de dióxido de carbono equivalente evitada segundo a metodologia do programa",
      "Um megawatt-hora de energia renovável"
    ],
    "gabarito": 1,
    "referencia": "Um crédito de descarbonização representa uma tonelada de dióxido de carbono equivalente evitada segundo a metodologia do programa.",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "alternativa-correta",
    "fonte": {
      "arquivo": "Alexandria modulos/alexandria_modulo14.html",
      "campo": "section#a07 · bloco 10 (paragrafo)",
      "linha": null
    },
    "evidencias": [
      {
        "arquivo": "Alexandria modulos/alexandria_modulo14.html",
        "campo": "section#a07 · bloco 10 (paragrafo)",
        "linha": null,
        "trecho": "Um crédito de descarbonização representa uma tonelada de dióxido de carbono equivalente evitada segundo a metodologia do programa."
      }
    ],
    "alertas": [
      "Pergunta e distratores: voz da Alexandria (decisões 7 e 8). A resposta é o trecho literal da aula em `evidencias`."
    ]
  },
  {
    "id": "m14-a07-d02",
    "moduloId": "modulo-14",
    "aula": 7,
    "origem": "derivado-da-aula",
    "tipo": "aberto",
    "enunciado": "Uma usina recebe crédito de descarbonização por ter capacidade instalada?",
    "gabarito": null,
    "referencia": "o produtor não recebe crédito por ter capacidade instalada. Ele precisa estar certificado, vender volume elegível e comprovar a documentação — capacidade autorizada não gera nenhum crédito.",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "Alexandria modulos/alexandria_modulo14.html",
      "campo": "section#a07 · bloco 3 (paragrafo)",
      "linha": null
    },
    "evidencias": [
      {
        "arquivo": "Alexandria modulos/alexandria_modulo14.html",
        "campo": "section#a07 · bloco 3 (paragrafo)",
        "linha": null,
        "trecho": "o produtor não recebe crédito por ter capacidade instalada. Ele precisa estar certificado, vender volume elegível e comprovar a documentação — capacidade autorizada não gera nenhum crédito."
      }
    ],
    "alertas": [
      "Pergunta e distratores: voz da Alexandria (decisões 7 e 8). A resposta é o trecho literal da aula em `evidencias`."
    ]
  },
  {
    "id": "m14-ex-14",
    "moduloId": "modulo-14",
    "aula": 8,
    "origem": "fonte",
    "tipo": "aberto",
    "enunciado": "Um interlocutor entusiasmado afirma: \"o Brasil já resolveu o transporte com etanol\". Responda.",
    "gabarito": null,
    "referencia": "A resposta correta <b>nem confirma nem desmente</b> — devolve grandeza, base temporal e trade-off. Quatro movimentos. <b>Um:</b> qual fração do consumo energético do setor de transportes é renovável, em qual ano-calendário, segundo qual fonte? <b>Dois:</b> por qual rota — etanol de cana, de milho, biodiesel, biometano? A composição muda a conclusão. <b>Três:</b> qual parcela dessa fração existe por <b>decisão regulatória</b> — mistura obrigatória — e qual existe por escolha de consumidor no ponto de abastecimento? São mecanismos diferentes com durabilidades diferentes. <b>Quatro:</b> à custa de qual uso alternativo do insumo, e com qual intensidade de carbono certificada por rota? Quem responde assim não parece cético nem entusiasmado — parece quem leu. É a mesma disciplina que o Módulo 12 exigiu para \"o Brasil é uma boa aposta?\" e o Módulo 13 para \"essa ação é uma boa compra?\".",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "docs/alexandria-v2/extraction/m14/aparato.json",
      "campo": "exercicios.exercicios[13].enunciado",
      "linha": 2811
    },
    "evidencias": [
      {
        "arquivo": "docs/alexandria-v2/extraction/m14/aparato.json",
        "campo": "exercicios.exercicios[13].enunciado",
        "linha": 2811,
        "trecho": "Um interlocutor entusiasmado afirma: \"o Brasil já resolveu o transporte com etanol\". Responda."
      },
      {
        "arquivo": "docs/alexandria-v2/extraction/m14/aparato.json",
        "campo": "exercicios.exercicios[13].resposta_referencia",
        "linha": 2811,
        "trecho": "A resposta correta nem confirma nem desmente — devolve grandeza, base temporal e trade-off. Quatro movimentos. Um: qual fração do consumo energético do setor de transportes é renovável, em qual ano-calendário, segundo qual fonte? Dois: por qual rota — etanol de cana, de milho, biodiesel, biometano? A composição muda a conclusão. Três: qual parcela dessa fração existe por decisão regulatória — mistura obrigatória — e qual existe por escolha de consumidor no ponto de abastecimento? São mecanismos diferentes com durabilidades diferentes. Quatro: à custa de qual uso alternativo do insumo, e com qual intensidade de carbono certificada por rota? Quem responde assim não parece cético nem entusiasmado — parece quem leu. É a mesma disciplina que o Módulo 12 exigiu para \"o Brasil é uma boa aposta?\" e o Módulo 13 para \"essa ação é uma boa compra?\"."
      }
    ],
    "alertas": [
      "Tag da fonte: \"Ex 14 · Síntese\". A fonte não liga este exercício a aula (P9); o vínculo com a Aula 08 é por afinidade de tema (docs/alexandria-v2/estudos/aulas/m14.md)."
    ]
  },
  {
    "id": "m14-a08-ficha-exercicio-01",
    "moduloId": "modulo-14",
    "aula": 8,
    "origem": "fonte",
    "tipo": "aberto",
    "enunciado": "<b>ROTA 01 · Etanol de cana · primeira geração</b> — O que este número não diz: <b>Exercício.</b> Um volume de etanol de cana em ano-safra não diz o mix praticado, não diz quanto veio de área nova contra produtividade, e não diz… <br>Complete com pelo menos mais dois itens antes de seguir.",
    "gabarito": null,
    "referencia": "O último campo de cada ficha — \"o que este número não diz\" — está propositalmente incompleto. Ele é exercício: preencha-o antes de olhar o instrumento seguinte, e depois confira contra o que o verificador devolve.",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "docs/alexandria-v2/extraction/m14/aparato.json",
      "campo": "exercicios.exercicios_embutidos_em_aula.itens[0]",
      "linha": 2357
    },
    "evidencias": [
      {
        "arquivo": "docs/alexandria-v2/extraction/m14/aparato.json",
        "campo": "exercicios.exercicios_embutidos_em_aula.itens[0]",
        "linha": 2357,
        "trecho": "Exercício. Um volume de etanol de cana em ano-safra não diz o mix praticado, não diz quanto veio de área nova contra produtividade, e não diz… Complete com pelo menos mais dois itens antes de seguir."
      },
      {
        "arquivo": "docs/alexandria-v2/extraction/m14/aparato.json",
        "campo": "exercicios.exercicios_embutidos_em_aula.instrucao_da_fonte.texto",
        "linha": 2344,
        "trecho": "O último campo de cada ficha — \"o que este número não diz\" — está propositalmente incompleto. Ele é exercício: preencha-o antes de olhar o instrumento seguinte, e depois confira contra o que o verificador devolve."
      }
    ],
    "alertas": [
      "Exercício declarado pela própria aula (campo \"o que este número não diz\" da ficha), sem gabarito na fonte: a referência é a instrução da fonte, que manda conferir contra o verificador."
    ]
  },
  {
    "id": "m14-a08-ficha-exercicio-02",
    "moduloId": "modulo-14",
    "aula": 8,
    "origem": "fonte",
    "tipo": "aberto",
    "enunciado": "<b>ROTA 02 · Etanol de milho</b> — O que este número não diz: <b>Exercício.</b> Uma participação percentual do milho no etanol nacional não diz de qual base temporal veio, não diz qual fonte térmica a planta usou, e não diz… <br>Complete com pelo menos mais dois itens.",
    "gabarito": null,
    "referencia": "O último campo de cada ficha — \"o que este número não diz\" — está propositalmente incompleto. Ele é exercício: preencha-o antes de olhar o instrumento seguinte, e depois confira contra o que o verificador devolve.",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "docs/alexandria-v2/extraction/m14/aparato.json",
      "campo": "exercicios.exercicios_embutidos_em_aula.itens[1]",
      "linha": 2369
    },
    "evidencias": [
      {
        "arquivo": "docs/alexandria-v2/extraction/m14/aparato.json",
        "campo": "exercicios.exercicios_embutidos_em_aula.itens[1]",
        "linha": 2369,
        "trecho": "Exercício. Uma participação percentual do milho no etanol nacional não diz de qual base temporal veio, não diz qual fonte térmica a planta usou, e não diz… Complete com pelo menos mais dois itens."
      },
      {
        "arquivo": "docs/alexandria-v2/extraction/m14/aparato.json",
        "campo": "exercicios.exercicios_embutidos_em_aula.instrucao_da_fonte.texto",
        "linha": 2344,
        "trecho": "O último campo de cada ficha — \"o que este número não diz\" — está propositalmente incompleto. Ele é exercício: preencha-o antes de olhar o instrumento seguinte, e depois confira contra o que o verificador devolve."
      }
    ],
    "alertas": [
      "Exercício declarado pela própria aula (campo \"o que este número não diz\" da ficha), sem gabarito na fonte: a referência é a instrução da fonte, que manda conferir contra o verificador."
    ]
  },
  {
    "id": "m14-a08-ficha-exercicio-03",
    "moduloId": "modulo-14",
    "aula": 8,
    "origem": "fonte",
    "tipo": "aberto",
    "enunciado": "<b>ROTA 03 · Etanol de segunda geração</b> — O que este número não diz: <b>Exercício.</b> Um volume de etanol de segunda geração não diz quanto de exportação elétrica deixou de existir na mesma planta, não diz o consumo de enzimas por litro, e não diz… <br>Complete com pelo menos mais dois itens.",
    "gabarito": null,
    "referencia": "O último campo de cada ficha — \"o que este número não diz\" — está propositalmente incompleto. Ele é exercício: preencha-o antes de olhar o instrumento seguinte, e depois confira contra o que o verificador devolve.",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "docs/alexandria-v2/extraction/m14/aparato.json",
      "campo": "exercicios.exercicios_embutidos_em_aula.itens[2]",
      "linha": 2381
    },
    "evidencias": [
      {
        "arquivo": "docs/alexandria-v2/extraction/m14/aparato.json",
        "campo": "exercicios.exercicios_embutidos_em_aula.itens[2]",
        "linha": 2381,
        "trecho": "Exercício. Um volume de etanol de segunda geração não diz quanto de exportação elétrica deixou de existir na mesma planta, não diz o consumo de enzimas por litro, e não diz… Complete com pelo menos mais dois itens."
      },
      {
        "arquivo": "docs/alexandria-v2/extraction/m14/aparato.json",
        "campo": "exercicios.exercicios_embutidos_em_aula.instrucao_da_fonte.texto",
        "linha": 2344,
        "trecho": "O último campo de cada ficha — \"o que este número não diz\" — está propositalmente incompleto. Ele é exercício: preencha-o antes de olhar o instrumento seguinte, e depois confira contra o que o verificador devolve."
      }
    ],
    "alertas": [
      "Exercício declarado pela própria aula (campo \"o que este número não diz\" da ficha), sem gabarito na fonte: a referência é a instrução da fonte, que manda conferir contra o verificador."
    ]
  },
  {
    "id": "m14-a08-ficha-exercicio-04",
    "moduloId": "modulo-14",
    "aula": 8,
    "origem": "fonte",
    "tipo": "aberto",
    "enunciado": "<b>ROTA 04 · Biodiesel</b> — O que este número não diz: <b>Exercício.</b> Um volume de B100 produzido não diz qual matéria-prima o originou, não diz se o teor que o demandou é teto, vigente ou anunciado, e não diz… <br>Complete com pelo menos mais dois itens.",
    "gabarito": null,
    "referencia": "O último campo de cada ficha — \"o que este número não diz\" — está propositalmente incompleto. Ele é exercício: preencha-o antes de olhar o instrumento seguinte, e depois confira contra o que o verificador devolve.",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "docs/alexandria-v2/extraction/m14/aparato.json",
      "campo": "exercicios.exercicios_embutidos_em_aula.itens[3]",
      "linha": 2393
    },
    "evidencias": [
      {
        "arquivo": "docs/alexandria-v2/extraction/m14/aparato.json",
        "campo": "exercicios.exercicios_embutidos_em_aula.itens[3]",
        "linha": 2393,
        "trecho": "Exercício. Um volume de B100 produzido não diz qual matéria-prima o originou, não diz se o teor que o demandou é teto, vigente ou anunciado, e não diz… Complete com pelo menos mais dois itens."
      },
      {
        "arquivo": "docs/alexandria-v2/extraction/m14/aparato.json",
        "campo": "exercicios.exercicios_embutidos_em_aula.instrucao_da_fonte.texto",
        "linha": 2344,
        "trecho": "O último campo de cada ficha — \"o que este número não diz\" — está propositalmente incompleto. Ele é exercício: preencha-o antes de olhar o instrumento seguinte, e depois confira contra o que o verificador devolve."
      }
    ],
    "alertas": [
      "Exercício declarado pela própria aula (campo \"o que este número não diz\" da ficha), sem gabarito na fonte: a referência é a instrução da fonte, que manda conferir contra o verificador."
    ]
  },
  {
    "id": "m14-a08-ficha-exercicio-05",
    "moduloId": "modulo-14",
    "aula": 8,
    "origem": "fonte",
    "tipo": "aberto",
    "enunciado": "<b>ROTA 05 · Biogás e biometano</b> — O que este número não diz: <b>Exercício.</b> Um potencial de biometano em metros cúbicos não diz o raio econômico de coleta, não diz se existe cliente na distância assumida, e não diz… <br>Complete com pelo menos mais dois itens.",
    "gabarito": null,
    "referencia": "O último campo de cada ficha — \"o que este número não diz\" — está propositalmente incompleto. Ele é exercício: preencha-o antes de olhar o instrumento seguinte, e depois confira contra o que o verificador devolve.",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "docs/alexandria-v2/extraction/m14/aparato.json",
      "campo": "exercicios.exercicios_embutidos_em_aula.itens[4]",
      "linha": 2405
    },
    "evidencias": [
      {
        "arquivo": "docs/alexandria-v2/extraction/m14/aparato.json",
        "campo": "exercicios.exercicios_embutidos_em_aula.itens[4]",
        "linha": 2405,
        "trecho": "Exercício. Um potencial de biometano em metros cúbicos não diz o raio econômico de coleta, não diz se existe cliente na distância assumida, e não diz… Complete com pelo menos mais dois itens."
      },
      {
        "arquivo": "docs/alexandria-v2/extraction/m14/aparato.json",
        "campo": "exercicios.exercicios_embutidos_em_aula.instrucao_da_fonte.texto",
        "linha": 2344,
        "trecho": "O último campo de cada ficha — \"o que este número não diz\" — está propositalmente incompleto. Ele é exercício: preencha-o antes de olhar o instrumento seguinte, e depois confira contra o que o verificador devolve."
      }
    ],
    "alertas": [
      "Exercício declarado pela própria aula (campo \"o que este número não diz\" da ficha), sem gabarito na fonte: a referência é a instrução da fonte, que manda conferir contra o verificador."
    ]
  },
  {
    "id": "m14-a08-ficha-exercicio-06",
    "moduloId": "modulo-14",
    "aula": 8,
    "origem": "fonte",
    "tipo": "aberto",
    "enunciado": "<b>ROTA 06 · Cogeração a bagaço</b> — O que este número não diz: <b>Exercício.</b> Uma potência instalada de cogeração não diz quantos dias por ano a planta mói, não diz o autoconsumo de processo, e não diz… <br>Complete com pelo menos mais dois itens.",
    "gabarito": null,
    "referencia": "O último campo de cada ficha — \"o que este número não diz\" — está propositalmente incompleto. Ele é exercício: preencha-o antes de olhar o instrumento seguinte, e depois confira contra o que o verificador devolve.",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "docs/alexandria-v2/extraction/m14/aparato.json",
      "campo": "exercicios.exercicios_embutidos_em_aula.itens[5]",
      "linha": 2417
    },
    "evidencias": [
      {
        "arquivo": "docs/alexandria-v2/extraction/m14/aparato.json",
        "campo": "exercicios.exercicios_embutidos_em_aula.itens[5]",
        "linha": 2417,
        "trecho": "Exercício. Uma potência instalada de cogeração não diz quantos dias por ano a planta mói, não diz o autoconsumo de processo, e não diz… Complete com pelo menos mais dois itens."
      },
      {
        "arquivo": "docs/alexandria-v2/extraction/m14/aparato.json",
        "campo": "exercicios.exercicios_embutidos_em_aula.instrucao_da_fonte.texto",
        "linha": 2344,
        "trecho": "O último campo de cada ficha — \"o que este número não diz\" — está propositalmente incompleto. Ele é exercício: preencha-o antes de olhar o instrumento seguinte, e depois confira contra o que o verificador devolve."
      }
    ],
    "alertas": [
      "Exercício declarado pela própria aula (campo \"o que este número não diz\" da ficha), sem gabarito na fonte: a referência é a instrução da fonte, que manda conferir contra o verificador."
    ]
  },
  {
    "id": "m14-a08-d01",
    "moduloId": "modulo-14",
    "aula": 8,
    "origem": "derivado-da-aula",
    "tipo": "aberto",
    "enunciado": "Diante de qualquer número de bioenergia, quais são as três perguntas que a aula manda fazer, e em que ordem?",
    "gabarito": null,
    "referencia": "Um — base temporal: isto é ano-safra ou ano-calendário, e qual ciclo? Se for safra, é levantamento preliminar ou fechamento? Dois — rota: de qual insumo, por qual conversão? \"Etanol\" não é uma rota; etanol de cana de primeira geração é. Três — concorrente: o que deixou de ser feito com o mesmo insumo para que este número existisse?",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "Alexandria modulos/alexandria_modulo14.html",
      "campo": "section#a08 · bloco 22 (nota)",
      "linha": null
    },
    "evidencias": [
      {
        "arquivo": "Alexandria modulos/alexandria_modulo14.html",
        "campo": "section#a08 · bloco 22 (nota)",
        "linha": null,
        "trecho": "Um — base temporal: isto é ano-safra ou ano-calendário, e qual ciclo? Se for safra, é levantamento preliminar ou fechamento?"
      },
      {
        "arquivo": "Alexandria modulos/alexandria_modulo14.html",
        "campo": "section#a08 · bloco 22 (nota)",
        "linha": null,
        "trecho": "Dois — rota: de qual insumo, por qual conversão? \"Etanol\" não é uma rota; etanol de cana de primeira geração é."
      },
      {
        "arquivo": "Alexandria modulos/alexandria_modulo14.html",
        "campo": "section#a08 · bloco 22 (nota)",
        "linha": null,
        "trecho": "Três — concorrente: o que deixou de ser feito com o mesmo insumo para que este número existisse?"
      }
    ],
    "alertas": [
      "Pergunta e distratores: voz da Alexandria (decisões 7 e 8). A resposta é o trecho literal da aula em `evidencias`."
    ]
  }
];

export const EXERCICIOS_DO_MODULO: ExercicioDoModulo[] = [];

export const PROVAS: ProvaDoModulo[] = [
  {
    "moduloId": "modulo-14",
    "criterio": "O critério é oito de dez.",
    "acertosMinimos": 8,
    "total": 10,
    "questoes": [
      {
        "id": "m14-quiz-q01",
        "enunciado": "Em 2 de agosto de 2026, qual é o teor de etanol anidro na gasolina C comum, e sob que regime?",
        "alternativas": [
          "30%, fixado pela Resolução CNPE nº 9/2025, em vigor por prazo indeterminado.",
          "35%, teto legal da Lei nº 14.993/2024, já implementado após a conclusão dos testes de durabilidade.",
          "32%, fixado pela Resolução CNPE nº 9/2026 com vigência a partir de 1º de agosto de 2026, em caráter excepcional e temporário por 180 dias, prorrogável uma vez.",
          "27%, teor histórico mantido desde 2015 para a gasolina comum."
        ],
        "correta": 2,
        "explicacao": "São dois erros distintos numa só pergunta. O primeiro é de base temporal: 30% foi o teor vigente até 31 de julho de 2026, e há duas resoluções de número 9, uma de 2025 e outra de 2026. O segundo é de estado de política: 35% é teto legal autorizado, não percentual em vigor. A resposta correta traz norma, data e o regime — porque a medida é temporária, e um material escrito hoje pode estar errado em cento e oitenta dias.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m14/aparato.json",
          "campo": "avaliacao.perguntas[0]",
          "linha": 4235
        }
      },
      {
        "id": "m14-quiz-q02",
        "enunciado": "Uma apresentação afirma: “o Brasil produz 40,7 bilhões de litros de etanol por ano”. Qual é o problema?",
        "alternativas": [
          "O número mistura bases: 40,69 bilhões é a estimativa de safra 2026/27; a produção apurada de ano-calendário 2025 foi de 35,94 bilhões de litros.",
          "O número está simplesmente errado; nenhuma fonte oficial registra esse volume.",
          "O número está desatualizado e a produção correta é superior a 45 bilhões de litros.",
          "Não há problema: safra e ano-calendário são equivalentes no setor sucroenergético."
        ],
        "correta": 0,
        "explicacao": "Os dois números estão certos e medem coisas diferentes. A safra do Centro-Sul atravessa o virar do ano-calendário, e por isso todo volume de etanol precisa declarar a base. Quase cinco bilhões de litros separam as duas respostas — e nenhuma delas é falsa.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m14/aparato.json",
          "campo": "avaliacao.perguntas[1]",
          "linha": 4242
        }
      },
      {
        "id": "m14-quiz-q03",
        "enunciado": "Sobre o percentual de biodiesel no diesel B, em 2 de agosto de 2026:",
        "alternativas": [
          "Está em B16 desde março de 2026, conforme calendário da Lei nº 14.993/2024.",
          "Está em B20, antecipado por decisão do conselho em julho de 2026.",
          "Está em B25, teto legal já implementado.",
          "Está em B15, em vigor desde 1º de agosto de 2025; o B16 tinha prazo legal em março de 2026 e não foi implementado."
        ],
        "correta": 3,
        "explicacao": "É o quarto estado de política, e o menos citado: prazo legal vencido e não implementado. A lei calendarizou o B16 para março de 2026, a data passou, e o conselho não deliberou o aumento. Quem lê só a lei conclui que o B16 está em vigor; quem lê só a resolução não sabe que havia um prazo. A verificação exige as duas.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m14/aparato.json",
          "campo": "avaliacao.perguntas[2]",
          "linha": 4249
        }
      },
      {
        "id": "m14-quiz-q04",
        "enunciado": "Uma unidade de cogeração tem 80 MW instalados e opera 210 dias de safra. Um analista projeta 700 GWh anuais. Qual é a correção?",
        "alternativas": [
          "A projeção está correta, porque a potência instalada define a geração anual.",
          "A projeção multiplicou a potência por 8.760 horas; com 210 dias, disponibilidade real e autoconsumo de vapor de processo, o gerado fica próximo de 350 GWh e o exportado, de cerca de 160 GWh.",
          "A projeção está errada apenas na disponibilidade; o autoconsumo não afeta a geração.",
          "A projeção subestima: uma planta de 80 MW gera mais de 700 GWh por ano."
        ],
        "correta": 1,
        "explicacao": "Três grandezas distintas — potência instalada, energia gerada e energia exportada — para a mesma planta. A confusão entre elas é o erro que a Lente de Sazonalidade existe para impedir, e é ele que faz alguém somar potência instalada de cogeração à matriz elétrica como se ela operasse o ano inteiro.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m14/aparato.json",
          "campo": "avaliacao.perguntas[3]",
          "linha": 4256
        }
      },
      {
        "id": "m14-quiz-q05",
        "enunciado": "“A usina de etanol é autossuficiente em energia porque queima o próprio bagaço.” Qual é o defeito?",
        "alternativas": [
          "Nenhum: vale para toda usina de etanol brasileira.",
          "O defeito é factual: bagaço não tem poder calorífico suficiente para sustentar o processo.",
          "O defeito é apenas de precisão numérica sobre o percentual de autossuficiência.",
          "O defeito é de rota não declarada: vale para a rota de cana, e não para a de milho, que depende de fonte térmica externa contratada, com custo e exposição a preço próprios."
        ],
        "correta": 3,
        "explicacao": "É a assimetria estrutural entre as duas rotas de etanol. Em cana o combustível vem do próprio insumo; em milho, a energia térmica é comprada. Isso muda o custo por litro, muda a intensidade de carbono, e muda o que a planta contribui — ou não contribui — para a matriz elétrica.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m14/aparato.json",
          "campo": "avaliacao.perguntas[4]",
          "linha": 4263
        }
      },
      {
        "id": "m14-quiz-q06",
        "enunciado": "Um projeto afirma que a segunda geração “aproveita resíduo que hoje é descartado”. Qual é a leitura correta?",
        "alternativas": [
          "O bagaço não é descartado: é o combustível que gera vapor de processo e bioeletricidade, de modo que cada tonelada hidrolisada é energia que deixa de existir.",
          "A afirmação está correta: o bagaço excedente não tem uso econômico atual.",
          "A afirmação está correta apenas para a palha, e incorreta para o bagaço.",
          "A afirmação é irrelevante, porque a segunda geração não usa bagaço."
        ],
        "correta": 0,
        "explicacao": "É o concorrente omitido mais frequente do bloco. A fibra tem destino consolidado dentro da própria unidade — três destinos, na verdade: vapor, eletricidade exportada e venda de biomassa. A segunda geração não elimina custo de disposição; ela disputa um insumo com uso econômico atual.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m14/aparato.json",
          "campo": "avaliacao.perguntas[5]",
          "linha": 4270
        }
      },
      {
        "id": "m14-quiz-q07",
        "enunciado": "Sobre as metas do programa de descarbonização em 2026:",
        "alternativas": [
          "A meta nacional e a soma das metas individuais são sempre idênticas por construção da norma.",
          "A meta nacional de 48,09 milhões foi revogada e substituída pelas metas individuais.",
          "A meta nacional é de 48,09 milhões de créditos, e a soma das metas individuais definitivas publicadas em março de 2026 é de 49,01 milhões — cerca de 1,9% acima.",
          "A soma das metas individuais é sempre inferior à nacional, por conta das dispensas concedidas."
        ],
        "correta": 2,
        "explicacao": "É a diferença que explica por que o ciclo anterior apareceu simultaneamente como 99% e 88% de cumprimento: a mesma aposentadoria de créditos, medida contra a meta nacional ou contra a soma das individuais ajustadas, produz duas taxas distintas. Quem cita só uma delas não está errado — está incompleto, e a distinção decide se houve ou não descumprimento sujeito a penalidade.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m14/aparato.json",
          "campo": "avaliacao.perguntas[6]",
          "linha": 4277
        }
      },
      {
        "id": "m14-quiz-q08",
        "enunciado": "Um projeto de biometano apresenta margem de R$ 1,20 por metro cúbico e conclui pela viabilidade. O que falta?",
        "alternativas": [
          "Nada: margem unitária positiva é condição suficiente de viabilidade.",
          "Faltam escala e continuidade do substrato: compressão, medição e infraestrutura de entrega têm componente fixo que a margem unitária não dilui, e resíduo de usina tem sazonalidade enquanto resíduo de aterro tem curva de decaimento.",
          "Falta apenas o preço de venda do gás, que não foi informado.",
          "Falta incluir a receita de crédito de descarbonização no caso base, o que tornaria o projeto viável."
        ],
        "correta": 1,
        "explicacao": "Margem por metro cúbico e viabilidade de projeto são grandezas diferentes. A alternativa que sugere colocar o crédito no caso base contém o segundo erro do bloco: atributo ambiental é ganho adicional e entra como sensibilidade declarada, nunca como salvamento de projeto.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m14/aparato.json",
          "campo": "avaliacao.perguntas[7]",
          "linha": 4284
        }
      },
      {
        "id": "m14-quiz-q09",
        "enunciado": "Uma unidade sem certificação no programa de descarbonização comercializa biocombustível e evita emissões fisicamente reais. Quantos créditos ela pode emitir?",
        "alternativas": [
          "Proporcionalmente ao volume, com deságio por ausência de certificação.",
          "Todos os créditos correspondentes, com emissão retroativa após a certificação.",
          "Metade dos créditos, conforme regra de transição.",
          "Nenhum: o crédito nasce da certificação da unidade produtora e da comercialização com nota fiscal, não do fato físico da emissão evitada."
        ],
        "correta": 3,
        "explicacao": "É a distinção entre o fato físico e o ativo regulatório. As emissões evitadas existem; o crédito, não. Projeções que somam receita de crédito antes da certificação emitida estão somando um número sem lastro — e essa é a linha que mais frequentemente aparece inflada em plano de negócios de projeto de bioenergia.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m14/aparato.json",
          "campo": "avaliacao.perguntas[8]",
          "linha": 4291
        }
      },
      {
        "id": "m14-quiz-q10",
        "enunciado": "Um interlocutor pergunta: “então qual biocombustível é o melhor investimento agora?”. Qual é a resposta correta?",
        "alternativas": [
          "Etanol de milho, pela expansão acelerada e pela operação contínua ao longo do ano.",
          "Biometano, pelo marco regulatório recém-consolidado e pelo duplo instrumento de certificação.",
          "Devolver a estrutura: qual rota, com que insumo contratado, a que distância do cliente, sob qual estado de política e contra qual produto concorrente — e a pergunta de volta sobre horizonte e tolerância a risco.",
          "Biodiesel, pelo teor obrigatório de mistura garantido em lei até 2030."
        ],
        "correta": 2,
        "explicacao": "As três alternativas específicas são verdadeiras e insuficientes — exatamente o padrão que o INST·10 treina. Nenhuma rota é melhor em abstrato: a resposta depende de logística, escala e política locais. Nenhum ativo da NIVAR entrega recomendação de investimento nem de troca de combustível, em nenhuma hipótese; entrega a estrutura da decisão e as condições de cada tese.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m14/aparato.json",
          "campo": "avaliacao.perguntas[9]",
          "linha": 4298
        }
      }
    ],
    "faixas": [
      {
        "min": 8,
        "max": 10,
        "mensagem": "Critério atingido. A matéria sustenta uma conversa de uma hora com um produtor, um trader de combustíveis ou um analista de originação — inclusive a parte mais difícil: recusar a pergunta sobre qual biocombustível é o melhor investimento, devolvendo rota, insumo, distância, estado de política e produto concorrente."
      },
      {
        "min": 0,
        "max": 7,
        "mensagem": "Abaixo do critério de oito acertos. Antes de refazer, verifique o padrão do erro: quase todas estas questões testam base temporal — safra contra ano-calendário, teor vigente contra teor vencido —, rota não declarada — cana contra milho, fibra contra grão —, grandeza confundida — potência contra energia, venda contra produção, margem unitária contra viabilidade — ou estado de política — teto legal, vigente, anunciado, prazo vencido não implementado. São esses quatro que derrubam a credibilidade de tudo que veio antes."
      }
    ],
    "faixasFonte": {
      "arquivo": "docs/alexandria-v2/extraction/m14/aparato.json",
      "campo": "avaliacao.faixas_de_placar_script",
      "linha": 4234
    },
    "criterioFonte": {
      "arquivo": "docs/alexandria-v2/extraction/m14/aparato.json",
      "campo": "avaliacao.criterio_literal_prosa",
      "linha": 2833
    }
  }
];

export const CHECKLISTS: ChecklistDoModulo[] = [
  {
    "moduloId": "modulo-14",
    "introducao": "O primeiro item é o critério de domínio deste bloco. O último é a disciplina que o Módulo 12 ensinou para \"o Brasil é uma boa aposta?\" e o Módulo 13 para \"essa ação é uma boa compra?\", aplicada agora ao tema em que o material disponível é mais enviesado que em qualquer outro do currículo.",
    "itens": [
      {
        "id": "m14-check-01",
        "texto": "Diante de qualquer número de bioenergia, nomeio <b>em menos de um minuto</b> a base temporal, a rota de conversão e o produto concorrente pelo mesmo insumo.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m14/aparato.json",
          "campo": "checklist_final.itens[0].html",
          "linha": 2892
        }
      },
      {
        "id": "m14-check-02",
        "texto": "Sei dizer, sem consultar nota, por que uma usina sucroenergética entrega energia firme durante metade do ano — e por que isso é complementaridade sazonal, não defeito.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m14/aparato.json",
          "campo": "checklist_final.itens[1].html",
          "linha": 2893
        }
      },
      {
        "id": "m14-check-03",
        "texto": "Distingo ano-safra de ano-calendário sem hesitar, e sei que o ciclo do Centro-Sul atravessa dois anos-calendário.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m14/aparato.json",
          "campo": "checklist_final.itens[2].html",
          "linha": 2894
        }
      },
      {
        "id": "m14-check-04",
        "texto": "Não comparo dado de safra com estatística de ano-calendário sem conversão explícita e declarada.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m14/aparato.json",
          "campo": "checklist_final.itens[3].html",
          "linha": 2895
        }
      },
      {
        "id": "m14-check-05",
        "texto": "Sei se um dado de safra é levantamento preliminar ou fechamento, e quantas revisões ainda virão.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m14/aparato.json",
          "campo": "checklist_final.itens[4].html",
          "linha": 2896
        }
      },
      {
        "id": "m14-check-06",
        "texto": "Distingo etanol hidratado de anidro, e sei que os dois têm motores de demanda independentes.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m14/aparato.json",
          "campo": "checklist_final.itens[5].html",
          "linha": 2897
        }
      },
      {
        "id": "m14-check-07",
        "texto": "Sei que a demanda de anidro é derivada: volume de gasolina C vezes percentual obrigatório de mistura.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m14/aparato.json",
          "campo": "checklist_final.itens[6].html",
          "linha": 2898
        }
      },
      {
        "id": "m14-check-08",
        "texto": "Não uso a regra dos 70% como limiar: comparo custo por quilômetro com o rendimento medido do veículo específico.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m14/aparato.json",
          "campo": "checklist_final.itens[7].html",
          "linha": 2899
        }
      },
      {
        "id": "m14-check-09",
        "texto": "Trato percentual de mistura como <b>quatro estados</b> — teto legal, em vigor, anunciado com data futura, e prazo vencido não implementado — e nunca como um número só.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m14/aparato.json",
          "campo": "checklist_final.itens[8].html",
          "linha": 2900
        }
      },
      {
        "id": "m14-check-10",
        "texto": "Cito percentual de mistura sempre com norma, número, ano e data de vigência, e verifico se a medida tem prazo de validade declarado.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m14/aparato.json",
          "campo": "checklist_final.itens[9].html",
          "linha": 2901
        }
      },
      {
        "id": "m14-check-11",
        "texto": "Diante de notícia de reunião de conselho, pergunto: mudou o número, mudou a regra de fornecimento, ou mudou o prazo?",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m14/aparato.json",
          "campo": "checklist_final.itens[10].html",
          "linha": 2902
        }
      },
      {
        "id": "m14-check-12",
        "texto": "Sei que o mix açúcar-etanol é uma arbitragem contínua sobre o ATR, e não uma decisão anual.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m14/aparato.json",
          "campo": "checklist_final.itens[11].html",
          "linha": 2903
        }
      },
      {
        "id": "m14-check-13",
        "texto": "Não concluo sobre uma arbitragem a partir de preço relativo isolado: exijo a capacidade industrial de alternância da unidade.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m14/aparato.json",
          "campo": "checklist_final.itens[12].html",
          "linha": 2904
        }
      },
      {
        "id": "m14-check-14",
        "texto": "Separo, para qualquer planta de bioenergia, <b>potência instalada</b>, <b>energia gerada</b> e <b>energia exportada</b>, e sei que só a terceira gera receita de venda de energia.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m14/aparato.json",
          "campo": "checklist_final.itens[13].html",
          "linha": 2905
        }
      },
      {
        "id": "m14-check-15",
        "texto": "Não multiplico potência por 8.760 horas: exijo dias de safra, disponibilidade e autoconsumo de processo.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m14/aparato.json",
          "campo": "checklist_final.itens[14].html",
          "linha": 2906
        }
      },
      {
        "id": "m14-check-16",
        "texto": "Não somo potencial técnico, capacidade autorizada, produção e volume contratado na mesma tabela.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m14/aparato.json",
          "campo": "checklist_final.itens[15].html",
          "linha": 2907
        }
      },
      {
        "id": "m14-check-17",
        "texto": "Sei que bagaço tem no mínimo quatro destinos concorrentes, e que cada tonelada em um deles não vai para os outros três.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m14/aparato.json",
          "campo": "checklist_final.itens[16].html",
          "linha": 2908
        }
      },
      {
        "id": "m14-check-18",
        "texto": "Sei que o etanol de milho não tem a sazonalidade de safra da cana, e que ele paga por isso com fonte térmica externa contratada.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m14/aparato.json",
          "campo": "checklist_final.itens[17].html",
          "linha": 2909
        }
      },
      {
        "id": "m14-check-19",
        "texto": "Sei que biogás não é biometano, e que entre os dois há uma planta de purificação com custo de capital e de operação próprios.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m14/aparato.json",
          "campo": "checklist_final.itens[18].html",
          "linha": 2910
        }
      },
      {
        "id": "m14-check-20",
        "texto": "Avalio biometano por logística e escala mínima antes de avaliar por preço por metro cúbico normal.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m14/aparato.json",
          "campo": "checklist_final.itens[19].html",
          "linha": 2911
        }
      },
      {
        "id": "m14-check-21",
        "texto": "Sei que um crédito de descarbonização depende de certificação vigente, volume elegível <b>comercializado</b> e diferencial de intensidade de carbono — nunca de capacidade instalada.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m14/aparato.json",
          "campo": "checklist_final.itens[20].html",
          "linha": 2912
        }
      },
      {
        "id": "m14-check-22",
        "texto": "Nunca cravo preço de crédito de descarbonização em prosa: ele entra como entrada editável, com fonte e data.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m14/aparato.json",
          "campo": "checklist_final.itens[21].html",
          "linha": 2913
        }
      },
      {
        "id": "m14-check-23",
        "texto": "Pergunto qual denominador está sendo usado antes de citar percentual de cumprimento de meta — nacional ou soma das individuais.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m14/aparato.json",
          "campo": "checklist_final.itens[22].html",
          "linha": 2914
        }
      },
      {
        "id": "m14-check-24",
        "texto": "Verifico titularidade de atributo ambiental em contrato antes de atribuir receita ambiental a qualquer projeto.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m14/aparato.json",
          "campo": "checklist_final.itens[23].html",
          "linha": 2915
        }
      },
      {
        "id": "m14-check-25",
        "texto": "Trato material de associação setorial, entidade de classe ou produtor como <b>posição de parte interessada</b>, citável com nome e data, nunca como origem de número nem como avaliação imparcial de política pública.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m14/aparato.json",
          "campo": "checklist_final.itens[24].html",
          "linha": 2916
        }
      },
      {
        "id": "m14-check-26",
        "texto": "<b>Recuso tanto a versão entusiasmada quanto a versão cínica do setor</b>, e devolvo mecanismo e trade-off: quem paga, quem recebe, o que a política cria e o que ela custa — sem tratar bioenergia como solução nem como problema.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m14/aparato.json",
          "campo": "checklist_final.itens[25].html",
          "linha": 2917
        }
      }
    ]
  }
];
