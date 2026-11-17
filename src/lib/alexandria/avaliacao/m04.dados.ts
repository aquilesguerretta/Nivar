// GERADO por tools/alexandria-dados/avaliacao/gerar-avaliacao-m04.mjs — não editar à mão.
// Fonte: docs/alexandria-v2/extraction/m04/aparato.json (exercícios, quiz, checklist) e a apostila
// do módulo (MODULO_04_CORPO, conferida contra o HTML original). Conferência:
// node tools/alexandria-dados/avaliacao/verificar-avaliacao-m04.mjs
// 23 itens por aula (9 da fonte, 14 derivados) · 0 sem aula · 10 questões na prova · 20 itens no checklist.
// Os 9 da fonte não têm aula declarada na fonte: o vínculo é do porte (ver `alertas` de cada um).
import type { ChecklistDoModulo, ExercicioDaAula, ExercicioDoModulo, ProvaDoModulo } from '../avaliacao';

export const EXERCICIOS_DAS_AULAS: ExercicioDaAula[] = [
  {
    "id": "m04-ex-02",
    "moduloId": "modulo-04",
    "aula": 1,
    "origem": "fonte",
    "tipo": "aberto",
    "enunciado": "Mesmo sistema do exercício 01, mas o reservatório caiu e o valor da água subiu para R$ 340/MWh. O que acontece com a ordem e com o preço?",
    "gabarito": null,
    "referencia": "A hidráulica sai da terceira posição e vai para a quarta, atrás do gás. A fila vira: solar 200, eólica 200, gás 300 = 700 MW; faltam 200 MW, atendidos pela hidráulica. A marginal agora é a <em>hidráulica</em> e o preço é R$ 340/MWh.<br><br>Repare no que aconteceu: nenhuma usina mudou, nenhum combustível ficou mais caro, a demanda é a mesma — e o preço subiu 13%. O que mudou foi uma expectativa sobre o futuro, traduzida em custo de oportunidade pelo modelo. É esse mecanismo que torna o preço brasileiro tão sensível a notícia de chuva.",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "docs/alexandria-v2/extraction/m04/aparato.json",
      "campo": "exercicios.itens[1].enunciado.html",
      "linha": 1037
    },
    "evidencias": [
      {
        "arquivo": "docs/alexandria-v2/extraction/m04/aparato.json",
        "campo": "exercicios.itens[1].enunciado.texto",
        "linha": 1037,
        "trecho": "Mesmo sistema do exercício 01, mas o reservatório caiu e o valor da água subiu para R$ 340/MWh. O que acontece com a ordem e com o preço?"
      },
      {
        "arquivo": "docs/alexandria-v2/extraction/m04/aparato.json",
        "campo": "exercicios.itens[1].resposta_referencia[0].texto",
        "linha": 1037,
        "trecho": "A hidráulica sai da terceira posição e vai para a quarta, atrás do gás. A fila vira: solar 200, eólica 200, gás 300 = 700 MW; faltam 200 MW, atendidos pela hidráulica. A marginal agora é a hidráulica e o preço é R$ 340/MWh."
      },
      {
        "arquivo": "docs/alexandria-v2/extraction/m04/aparato.json",
        "campo": "exercicios.itens[1].resposta_referencia[1].texto",
        "linha": 1037,
        "trecho": "Repare no que aconteceu: nenhuma usina mudou, nenhum combustível ficou mais caro, a demanda é a mesma — e o preço subiu 13%. O que mudou foi uma expectativa sobre o futuro, traduzida em custo de oportunidade pelo modelo. É esse mecanismo que torna o preço brasileiro tão sensível a notícia de chuva."
      }
    ],
    "alertas": [
      "Vínculo mecânico: a fonte não prende este exercício a aula; \"Reservatório cheio empurra a hidráulica para baixo na ordem de mérito\" aparece só na Aula 1.",
      "A fonte não declara critério por exercício; o § Ex só instrui: resolva antes de abrir."
    ]
  },
  {
    "id": "m04-a01-d01",
    "moduloId": "modulo-04",
    "aula": 1,
    "origem": "derivado-da-aula",
    "tipo": "escolha",
    "enunciado": "Com a solar despachando, o preço daquela hora cai. Pela aula, cai porque…",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "fonte": {
      "arquivo": "src/lib/data/alexandria-modulo-04-content.ts",
      "campo": "MODULO_04_CORPO['aula-04-01']",
      "linha": null
    },
    "evidencias": [
      {
        "arquivo": "src/lib/data/alexandria-modulo-04-content.ts",
        "campo": "MODULO_04_CORPO['aula-04-01']",
        "linha": null,
        "trecho": "O preço cai porque quem ficou na margem é mais barato"
      }
    ],
    "alternativas": [
      "a solar é barata",
      "quem ficou na margem é mais barato",
      "o custo marginal operacional é próximo de zero"
    ],
    "gabarito": 1,
    "referencia": "O preço cai porque quem ficou na margem é mais barato",
    "verificacao": "alternativa-correta"
  },
  {
    "id": "m04-a01-d02",
    "moduloId": "modulo-04",
    "aula": 1,
    "origem": "derivado-da-aula",
    "tipo": "aberto",
    "enunciado": "Por que, segundo a aula, o preço brasileiro de curto prazo pode se mover sem que nada tenha se movido fisicamente naquele instante?",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "fonte": {
      "arquivo": "src/lib/data/alexandria-modulo-04-content.ts",
      "campo": "MODULO_04_CORPO['aula-04-01']",
      "linha": null
    },
    "evidencias": [
      {
        "arquivo": "src/lib/data/alexandria-modulo-04-content.ts",
        "campo": "MODULO_04_CORPO['aula-04-01']",
        "linha": null,
        "trecho": "Primeira: o preço brasileiro de curto prazo é um resultado de modelo, não de pregão. Ele responde a premissas de afluência, a funções de custo futuro e a decisões de política operativa — e por isso pode se mover sem que nada tenha se movido fisicamente naquele instante."
      }
    ],
    "gabarito": null,
    "referencia": "Primeira: o preço brasileiro de curto prazo é um resultado de modelo, não de pregão. Ele responde a premissas de afluência, a funções de custo futuro e a decisões de política operativa — e por isso pode se mover sem que nada tenha se movido fisicamente naquele instante.",
    "verificacao": "autoavaliacao"
  },
  {
    "id": "m04-ex-03",
    "moduloId": "modulo-04",
    "aula": 2,
    "origem": "fonte",
    "tipo": "aberto",
    "enunciado": "Uma indústria contratou 1.000 MWh no mês e mediu 1.150 MWh. O PLD médio do período foi R$ 480/MWh. Qual o custo bruto da exposição? E se o PLD tivesse sido R$ 156/MWh?",
    "gabarito": null,
    "referencia": "Exposição = 150 MWh. A R$ 480/MWh: R$ 72.000. A R$ 156/MWh: R$ 23.400.<br><br>Mesma decisão de contratação, mesmo desvio operacional, custo três vezes maior — e a empresa não controlou nenhuma das duas variáveis. É por isso que a banda de flexibilidade é uma cláusula econômica, não jurídica: ela define o tamanho da aposta que a empresa faz involuntariamente todo mês.",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "docs/alexandria-v2/extraction/m04/aparato.json",
      "campo": "exercicios.itens[2].enunciado.html",
      "linha": 1043
    },
    "evidencias": [
      {
        "arquivo": "docs/alexandria-v2/extraction/m04/aparato.json",
        "campo": "exercicios.itens[2].enunciado.texto",
        "linha": 1043,
        "trecho": "Uma indústria contratou 1.000 MWh no mês e mediu 1.150 MWh. O PLD médio do período foi R$ 480/MWh. Qual o custo bruto da exposição? E se o PLD tivesse sido R$ 156/MWh?"
      },
      {
        "arquivo": "docs/alexandria-v2/extraction/m04/aparato.json",
        "campo": "exercicios.itens[2].resposta_referencia[0].texto",
        "linha": 1043,
        "trecho": "Exposição = 150 MWh. A R$ 480/MWh: R$ 72.000. A R$ 156/MWh: R$ 23.400."
      },
      {
        "arquivo": "docs/alexandria-v2/extraction/m04/aparato.json",
        "campo": "exercicios.itens[2].resposta_referencia[1].texto",
        "linha": 1043,
        "trecho": "Mesma decisão de contratação, mesmo desvio operacional, custo três vezes maior — e a empresa não controlou nenhuma das duas variáveis. É por isso que a banda de flexibilidade é uma cláusula econômica, não jurídica: ela define o tamanho da aposta que a empresa faz involuntariamente todo mês."
      }
    ],
    "alertas": [
      "Vínculo mecânico: a fonte não prende este exercício a aula; \"qual é a minha exposição, em MWh\" aparece só na Aula 2.",
      "A fonte não declara critério por exercício; o § Ex só instrui: resolva antes de abrir."
    ]
  },
  {
    "id": "m04-ex-04",
    "moduloId": "modulo-04",
    "aula": 2,
    "origem": "fonte",
    "tipo": "aberto",
    "enunciado": "A mesma indústria contratou 1.000 MWh a R$ 355/MWh e mediu apenas 850 MWh, com PLD de R$ 140/MWh. Qual o problema econômico?",
    "gabarito": null,
    "referencia": "Ela pagou 1.000 MWh a R$ 355 = R$ 355.000, e a sobra de 150 MWh é liquidada a R$ 140/MWh = R$ 21.000. O custo efetivo dos 850 MWh que ela de fato usou é (355.000 − 21.000) / 850 ≈ <strong>R$ 393/MWh</strong> — acima do preço que ela julgava ter travado.<br><br>Sobrecontratar não é neutro: é comprar caro para revender barato. E a assimetria é cruel — a sobra costuma aparecer justamente quando o PLD está baixo, porque as duas coisas têm a mesma causa: atividade econômica fraca.",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "docs/alexandria-v2/extraction/m04/aparato.json",
      "campo": "exercicios.itens[3].enunciado.html",
      "linha": 1049
    },
    "evidencias": [
      {
        "arquivo": "docs/alexandria-v2/extraction/m04/aparato.json",
        "campo": "exercicios.itens[3].enunciado.texto",
        "linha": 1049,
        "trecho": "A mesma indústria contratou 1.000 MWh a R$ 355/MWh e mediu apenas 850 MWh, com PLD de R$ 140/MWh. Qual o problema econômico?"
      },
      {
        "arquivo": "docs/alexandria-v2/extraction/m04/aparato.json",
        "campo": "exercicios.itens[3].resposta_referencia[0].texto",
        "linha": 1049,
        "trecho": "Ela pagou 1.000 MWh a R$ 355 = R$ 355.000, e a sobra de 150 MWh é liquidada a R$ 140/MWh = R$ 21.000. O custo efetivo dos 850 MWh que ela de fato usou é (355.000 − 21.000) / 850 ≈ R$ 393/MWh — acima do preço que ela julgava ter travado."
      },
      {
        "arquivo": "docs/alexandria-v2/extraction/m04/aparato.json",
        "campo": "exercicios.itens[3].resposta_referencia[1].texto",
        "linha": 1049,
        "trecho": "Sobrecontratar não é neutro: é comprar caro para revender barato. E a assimetria é cruel — a sobra costuma aparecer justamente quando o PLD está baixo, porque as duas coisas têm a mesma causa: atividade econômica fraca."
      }
    ],
    "alertas": [
      "Vínculo mecânico: a fonte não prende este exercício a aula; \"O PLD valora apenas a diferença contratual\" aparece só na Aula 2.",
      "A fonte não declara critério por exercício; o § Ex só instrui: resolva antes de abrir."
    ]
  },
  {
    "id": "m04-a02-d01",
    "moduloId": "modulo-04",
    "aula": 2,
    "origem": "derivado-da-aula",
    "tipo": "escolha",
    "enunciado": "Desde 2021, em que base o PLD é calculado?",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "fonte": {
      "arquivo": "src/lib/data/alexandria-modulo-04-content.ts",
      "campo": "MODULO_04_CORPO['aula-04-02']",
      "linha": null
    },
    "evidencias": [
      {
        "arquivo": "src/lib/data/alexandria-modulo-04-content.ts",
        "campo": "MODULO_04_CORPO['aula-04-02']",
        "linha": null,
        "trecho": "Desde 2021 a base é horária"
      }
    ],
    "alternativas": [
      "semanal, em três patamares de carga",
      "horária",
      "mensal"
    ],
    "gabarito": 1,
    "referencia": "Desde 2021 a base é horária",
    "verificacao": "alternativa-correta"
  },
  {
    "id": "m04-a02-d02",
    "moduloId": "modulo-04",
    "aula": 2,
    "origem": "derivado-da-aula",
    "tipo": "aberto",
    "enunciado": "O que acontece com os preços dos submercados quando um limite de transmissão satura, e que nome comercial tem a diferença que aparece?",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "fonte": {
      "arquivo": "src/lib/data/alexandria-modulo-04-content.ts",
      "campo": "MODULO_04_CORPO['aula-04-02']",
      "linha": null
    },
    "evidencias": [
      {
        "arquivo": "src/lib/data/alexandria-modulo-04-content.ts",
        "campo": "MODULO_04_CORPO['aula-04-02']",
        "linha": null,
        "trecho": "Quando um limite de transmissão satura, os preços descolam, e essa diferença tem nome comercial: risco de submercado, ou risco de base."
      }
    ],
    "gabarito": null,
    "referencia": "Quando um limite de transmissão satura, os preços descolam, e essa diferença tem nome comercial: risco de submercado, ou risco de base.",
    "verificacao": "autoavaliacao"
  },
  {
    "id": "m04-ex-01",
    "moduloId": "modulo-04",
    "aula": 3,
    "origem": "fonte",
    "tipo": "aberto",
    "enunciado": "Demanda de 900 MW. Disponível: solar 200 MW a R$ 0/MWh, eólica 200 MW a R$ 20/MWh, hidráulica 300 MW com valor da água estimado em R$ 90/MWh, gás 300 MW com CVU de R$ 300/MWh. Qual usina é marginal e qual preço se forma?",
    "gabarito": null,
    "referencia": "Solar + eólica + hidráulica somam 700 MW. Faltam 200 MW, atendidos por gás. A usina marginal é o gás e o preço formado é R$ 300/MWh.<br><br>O detalhe que importa: 700 dos 900 MW foram gerados a custo bem abaixo de R$ 300. A solar embolsou R$ 300/MWh tendo custo zero; a eólica, R$ 280 de margem; a hidráulica, R$ 210. Essa é a margem inframarginal, e é dela que essas usinas recuperam custo fixo. Quem só olha o preço formado não vê que a mesma hora produziu quatro resultados econômicos completamente diferentes.",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "docs/alexandria-v2/extraction/m04/aparato.json",
      "campo": "exercicios.itens[0].enunciado.html",
      "linha": 1031
    },
    "evidencias": [
      {
        "arquivo": "docs/alexandria-v2/extraction/m04/aparato.json",
        "campo": "exercicios.itens[0].enunciado.texto",
        "linha": 1031,
        "trecho": "Demanda de 900 MW. Disponível: solar 200 MW a R$ 0/MWh, eólica 200 MW a R$ 20/MWh, hidráulica 300 MW com valor da água estimado em R$ 90/MWh, gás 300 MW com CVU de R$ 300/MWh. Qual usina é marginal e qual preço se forma?"
      },
      {
        "arquivo": "docs/alexandria-v2/extraction/m04/aparato.json",
        "campo": "exercicios.itens[0].resposta_referencia[0].texto",
        "linha": 1031,
        "trecho": "Solar + eólica + hidráulica somam 700 MW. Faltam 200 MW, atendidos por gás. A usina marginal é o gás e o preço formado é R$ 300/MWh."
      },
      {
        "arquivo": "docs/alexandria-v2/extraction/m04/aparato.json",
        "campo": "exercicios.itens[0].resposta_referencia[1].texto",
        "linha": 1031,
        "trecho": "O detalhe que importa: 700 dos 900 MW foram gerados a custo bem abaixo de R$ 300. A solar embolsou R$ 300/MWh tendo custo zero; a eólica, R$ 280 de margem; a hidráulica, R$ 210. Essa é a margem inframarginal, e é dela que essas usinas recuperam custo fixo. Quem só olha o preço formado não vê que a mesma hora produziu quatro resultados econômicos completamente diferentes."
      }
    ],
    "alertas": [
      "Vínculo mecânico: a fonte não prende este exercício a aula; \"margem inframarginal\" aparece nas Aulas 1, 3; vai para a última, a 3.",
      "A fonte não declara critério por exercício; o § Ex só instrui: resolva antes de abrir."
    ]
  },
  {
    "id": "m04-ex-05",
    "moduloId": "modulo-04",
    "aula": 3,
    "origem": "fonte",
    "tipo": "aberto",
    "enunciado": "Uma térmica de ponta de 150 MW custa R$ 320/kW-ano para ficar disponível. Ela roda 180 horas por ano com margem líquida de R$ 450/MWh. A receita de energia cobre o custo fixo? Quanto falta, por kW-ano?",
    "gabarito": null,
    "referencia": "Energia gerada = 150 MW × 180 h = 27.000 MWh. Receita = 27.000 × 450 = R$ 12,15 milhões. Custo fixo = 150.000 kW × 320 = R$ 48 milhões. Falta <strong>R$ 35,85 milhões</strong> — ou R$ 239/kW-ano.<br><br>Esse número é exatamente o que um mecanismo de capacidade precisaria pagar para o ativo existir. É o missing money, medido. E note quanto teria que subir a margem para fechar sem capacidade: seriam necessários R$ 1.778/MWh nas 180 horas — acima do teto horário do PLD. O teto não é um detalhe do problema; é o problema.",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "docs/alexandria-v2/extraction/m04/aparato.json",
      "campo": "exercicios.itens[4].enunciado.html",
      "linha": 1055
    },
    "evidencias": [
      {
        "arquivo": "docs/alexandria-v2/extraction/m04/aparato.json",
        "campo": "exercicios.itens[4].enunciado.texto",
        "linha": 1055,
        "trecho": "Uma térmica de ponta de 150 MW custa R$ 320/kW-ano para ficar disponível. Ela roda 180 horas por ano com margem líquida de R$ 450/MWh. A receita de energia cobre o custo fixo? Quanto falta, por kW-ano?"
      },
      {
        "arquivo": "docs/alexandria-v2/extraction/m04/aparato.json",
        "campo": "exercicios.itens[4].resposta_referencia[0].texto",
        "linha": 1055,
        "trecho": "Energia gerada = 150 MW × 180 h = 27.000 MWh. Receita = 27.000 × 450 = R$ 12,15 milhões. Custo fixo = 150.000 kW × 320 = R$ 48 milhões. Falta R$ 35,85 milhões — ou R$ 239/kW-ano."
      },
      {
        "arquivo": "docs/alexandria-v2/extraction/m04/aparato.json",
        "campo": "exercicios.itens[4].resposta_referencia[1].texto",
        "linha": 1055,
        "trecho": "Esse número é exatamente o que um mecanismo de capacidade precisaria pagar para o ativo existir. É o missing money, medido. E note quanto teria que subir a margem para fechar sem capacidade: seriam necessários R$ 1.778/MWh nas 180 horas — acima do teto horário do PLD. O teto não é um detalhe do problema; é o problema."
      }
    ],
    "alertas": [
      "Vínculo mecânico: a fonte não prende este exercício a aula; \"missing money\" aparece só na Aula 3.",
      "A fonte não declara critério por exercício; o § Ex só instrui: resolva antes de abrir."
    ]
  },
  {
    "id": "m04-a03-d01",
    "moduloId": "modulo-04",
    "aula": 3,
    "origem": "derivado-da-aula",
    "tipo": "escolha",
    "enunciado": "Na Aula 03, energia e capacidade são produtos distintos. Em que unidade a aula mede a capacidade?",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "fonte": {
      "arquivo": "src/lib/data/alexandria-modulo-04-content.ts",
      "campo": "MODULO_04_CORPO['aula-04-03']",
      "linha": null
    },
    "evidencias": [
      {
        "arquivo": "src/lib/data/alexandria-modulo-04-content.ts",
        "campo": "MODULO_04_CORPO['aula-04-03']",
        "linha": null,
        "trecho": "Capacidade é MW: quanta potência estará disponível no instante em que o sistema precisar."
      }
    ],
    "alternativas": [
      "MWh",
      "MW",
      "R$/MWh"
    ],
    "gabarito": 1,
    "referencia": "Capacidade é MW: quanta potência estará disponível no instante em que o sistema precisar.",
    "verificacao": "alternativa-correta"
  },
  {
    "id": "m04-a03-d02",
    "moduloId": "modulo-04",
    "aula": 3,
    "origem": "derivado-da-aula",
    "tipo": "aberto",
    "enunciado": "Segundo a aula, que três coisas quebram, na prática, o mecanismo do preço de escassez?",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "fonte": {
      "arquivo": "src/lib/data/alexandria-modulo-04-content.ts",
      "campo": "MODULO_04_CORPO['aula-04-03']",
      "linha": null
    },
    "evidencias": [
      {
        "arquivo": "src/lib/data/alexandria-modulo-04-content.ts",
        "campo": "MODULO_04_CORPO['aula-04-03']",
        "linha": null,
        "trecho": "Na prática, três coisas quebram o mecanismo. Tetos regulatórios impedem que o preço de escassez chegue ao valor que a teoria exige — no Brasil, o PLDmax horário e o estrutural da Aula 02. Eventos críticos são raros, o que torna a receita altamente incerta e cara de financiar: um fluxo de caixa que depende de 50 horas por ano tem variância que nenhum banco precifica com conforto. E preços muito altos são politicamente insustentáveis: nenhum regulador aceita repassar ao consumidor final o preço que faria a matemática fechar sozinha."
      }
    ],
    "gabarito": null,
    "referencia": "Na prática, três coisas quebram o mecanismo. Tetos regulatórios impedem que o preço de escassez chegue ao valor que a teoria exige — no Brasil, o PLDmax horário e o estrutural da Aula 02. Eventos críticos são raros, o que torna a receita altamente incerta e cara de financiar: um fluxo de caixa que depende de 50 horas por ano tem variância que nenhum banco precifica com conforto. E preços muito altos são politicamente insustentáveis: nenhum regulador aceita repassar ao consumidor final o preço que faria a matemática fechar sozinha.",
    "verificacao": "autoavaliacao"
  },
  {
    "id": "m04-ex-06",
    "moduloId": "modulo-04",
    "aula": 4,
    "origem": "fonte",
    "tipo": "aberto",
    "enunciado": "Um leilão reverso demanda 800 MW. Propostas: A 300 MW a R$ 180; B 250 MW a R$ 210; C 400 MW a R$ 245; D 200 MW a R$ 290. Teto do edital: R$ 260/MWh. Qual o preço de corte, qual o preço médio por lance, e qual o custo anual da diferença entre os dois arranjos de liquidação, considerando 800 MW médios?",
    "gabarito": null,
    "referencia": "D está acima do teto e é excluída. Contratam-se A (300), B (250) e 250 MW de C — total 800 MW. Preço de corte = R$ 245/MWh. Preço médio por lance = (300×180 + 250×210 + 250×245) / 800 = (54.000 + 52.500 + 61.250) / 800 = <strong>R$ 209,69/MWh</strong>.<br><br>A diferença é R$ 35,31/MWh. Sobre 800 MW médios ao longo de um ano — 800 × 8.760 = 7.008.000 MWh — isso equivale a cerca de <strong>R$ 247 milhões por ano</strong> transferidos do consumidor para os geradores, dependendo apenas da regra de liquidação do edital. Nenhuma tecnologia mudou; só a regra.",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "docs/alexandria-v2/extraction/m04/aparato.json",
      "campo": "exercicios.itens[5].enunciado.html",
      "linha": 1061
    },
    "evidencias": [
      {
        "arquivo": "docs/alexandria-v2/extraction/m04/aparato.json",
        "campo": "exercicios.itens[5].enunciado.texto",
        "linha": 1061,
        "trecho": "Um leilão reverso demanda 800 MW. Propostas: A 300 MW a R$ 180; B 250 MW a R$ 210; C 400 MW a R$ 245; D 200 MW a R$ 290. Teto do edital: R$ 260/MWh. Qual o preço de corte, qual o preço médio por lance, e qual o custo anual da diferença entre os dois arranjos de liquidação, considerando 800 MW médios?"
      },
      {
        "arquivo": "docs/alexandria-v2/extraction/m04/aparato.json",
        "campo": "exercicios.itens[5].resposta_referencia[0].texto",
        "linha": 1061,
        "trecho": "D está acima do teto e é excluída. Contratam-se A (300), B (250) e 250 MW de C — total 800 MW. Preço de corte = R$ 245/MWh. Preço médio por lance = (300×180 + 250×210 + 250×245) / 800 = (54.000 + 52.500 + 61.250) / 800 = R$ 209,69/MWh."
      },
      {
        "arquivo": "docs/alexandria-v2/extraction/m04/aparato.json",
        "campo": "exercicios.itens[5].resposta_referencia[1].texto",
        "linha": 1061,
        "trecho": "A diferença é R$ 35,31/MWh. Sobre 800 MW médios ao longo de um ano — 800 × 8.760 = 7.008.000 MWh — isso equivale a cerca de R$ 247 milhões por ano transferidos do consumidor para os geradores, dependendo apenas da regra de liquidação do edital. Nenhuma tecnologia mudou; só a regra."
      }
    ],
    "alertas": [
      "Vínculo mecânico: a fonte não prende este exercício a aula; \"preço de corte não é preço médio contratado\" aparece só na Aula 4.",
      "A fonte não declara critério por exercício; o § Ex só instrui: resolva antes de abrir."
    ]
  },
  {
    "id": "m04-a04-d01",
    "moduloId": "modulo-04",
    "aula": 4,
    "origem": "derivado-da-aula",
    "tipo": "escolha",
    "enunciado": "Se o certame liquida por preço uniforme, o que acontece com o preço médio e o preço de corte?",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "fonte": {
      "arquivo": "src/lib/data/alexandria-modulo-04-content.ts",
      "campo": "MODULO_04_CORPO['aula-04-04']",
      "linha": null
    },
    "evidencias": [
      {
        "arquivo": "src/lib/data/alexandria-modulo-04-content.ts",
        "campo": "MODULO_04_CORPO['aula-04-04']",
        "linha": null,
        "trecho": "Se liquida por preço uniforme, todos recebem o corte, e média e corte coincidem."
      }
    ],
    "alternativas": [
      "a média fica abaixo do corte",
      "média e corte coincidem",
      "cada vencedor recebe o preço que ofertou"
    ],
    "gabarito": 1,
    "referencia": "Se liquida por preço uniforme, todos recebem o corte, e média e corte coincidem.",
    "verificacao": "alternativa-correta"
  },
  {
    "id": "m04-a04-d02",
    "moduloId": "modulo-04",
    "aula": 4,
    "origem": "derivado-da-aula",
    "tipo": "aberto",
    "enunciado": "Por que comparar o preço de um leilão de energia nova com o de um leilão de energia existente, e concluir que \"a energia ficou mais cara\", é um erro?",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "fonte": {
      "arquivo": "src/lib/data/alexandria-modulo-04-content.ts",
      "campo": "MODULO_04_CORPO['aula-04-04']",
      "linha": null
    },
    "evidencias": [
      {
        "arquivo": "src/lib/data/alexandria-modulo-04-content.ts",
        "campo": "MODULO_04_CORPO['aula-04-04']",
        "linha": null,
        "trecho": "Energia nova viabiliza empreendimento que ainda não existe: o contrato é a garantia de receita que destrava o financiamento, e o preço precisa cobrir capital novo. Energia existente vem de usina já operando e já amortizada, ou parcialmente: a lógica é de recontratação, não de expansão, e o preço tende a ser mais baixo porque o capital afundado já foi pago."
      }
    ],
    "gabarito": null,
    "referencia": "Energia nova viabiliza empreendimento que ainda não existe: o contrato é a garantia de receita que destrava o financiamento, e o preço precisa cobrir capital novo. Energia existente vem de usina já operando e já amortizada, ou parcialmente: a lógica é de recontratação, não de expansão, e o preço tende a ser mais baixo porque o capital afundado já foi pago.",
    "verificacao": "autoavaliacao"
  },
  {
    "id": "m04-ex-07",
    "moduloId": "modulo-04",
    "aula": 5,
    "origem": "fonte",
    "tipo": "aberto",
    "enunciado": "Uma empresa com 900 MWh/mês de consumo, concentrado no período noturno, recebe proposta de PPA solar de 600 MWh/mês em contrato flat, a preço abaixo da curva de mercado. Liste os riscos a analisar antes de qualquer conclusão.",
    "gabarito": null,
    "referencia": "Descasamento de perfil — geração diurna contra consumo noturno, gerando sobra de dia e falta de noite, ambas liquidadas contra o comprador; ausência de modulação; sazonalização da geração solar contra a sazonalidade do consumo; submercado do contrato contra submercado da carga; quem absorve corte de geração; natureza do contrato — físico, financeiro ou virtual; titularidade dos atributos ambientais; garantias exigidas e seu custo de capital de giro; multa de rescisão; e efeito da regra vigente de desconto na tarifa de uso da rede sobre a economia comparada.<br><br>O preço médio abaixo do mercado é a <em>última</em> coisa a olhar, não a primeira — e frequentemente é baixo justamente porque o vendedor sabe que o perfil vale menos.",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "docs/alexandria-v2/extraction/m04/aparato.json",
      "campo": "exercicios.itens[6].enunciado.html",
      "linha": 1067
    },
    "evidencias": [
      {
        "arquivo": "docs/alexandria-v2/extraction/m04/aparato.json",
        "campo": "exercicios.itens[6].enunciado.texto",
        "linha": 1067,
        "trecho": "Uma empresa com 900 MWh/mês de consumo, concentrado no período noturno, recebe proposta de PPA solar de 600 MWh/mês em contrato flat, a preço abaixo da curva de mercado. Liste os riscos a analisar antes de qualquer conclusão."
      },
      {
        "arquivo": "docs/alexandria-v2/extraction/m04/aparato.json",
        "campo": "exercicios.itens[6].resposta_referencia[0].texto",
        "linha": 1067,
        "trecho": "Descasamento de perfil — geração diurna contra consumo noturno, gerando sobra de dia e falta de noite, ambas liquidadas contra o comprador; ausência de modulação; sazonalização da geração solar contra a sazonalidade do consumo; submercado do contrato contra submercado da carga; quem absorve corte de geração; natureza do contrato — físico, financeiro ou virtual; titularidade dos atributos ambientais; garantias exigidas e seu custo de capital de giro; multa de rescisão; e efeito da regra vigente de desconto na tarifa de uso da rede sobre a economia comparada."
      },
      {
        "arquivo": "docs/alexandria-v2/extraction/m04/aparato.json",
        "campo": "exercicios.itens[6].resposta_referencia[1].texto",
        "linha": 1067,
        "trecho": "O preço médio abaixo do mercado é a última coisa a olhar, não a primeira — e frequentemente é baixo justamente porque o vendedor sabe que o perfil vale menos."
      }
    ],
    "alertas": [
      "Vínculo mecânico: a fonte não prende este exercício a aula; \"Perfil é mais importante que preço médio\" aparece só na Aula 5.",
      "A fonte não declara critério por exercício; o § Ex só instrui: resolva antes de abrir."
    ]
  },
  {
    "id": "m04-a05-d01",
    "moduloId": "modulo-04",
    "aula": 5,
    "origem": "derivado-da-aula",
    "tipo": "escolha",
    "enunciado": "Que nome a aula dá ao fenômeno em que muita geração da mesma fonte nas mesmas horas derruba o valor capturado por todos os projetos dessa fonte?",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "fonte": {
      "arquivo": "src/lib/data/alexandria-modulo-04-content.ts",
      "campo": "MODULO_04_CORPO['aula-04-05']",
      "linha": null
    },
    "evidencias": [
      {
        "arquivo": "src/lib/data/alexandria-modulo-04-content.ts",
        "campo": "MODULO_04_CORPO['aula-04-05']",
        "linha": null,
        "trecho": "Quando muita geração da mesma fonte se concentra nas mesmas horas, o preço daquelas horas cai e o valor capturado por todos os projetos daquela fonte cai junto — fenômeno que se chama canibalização."
      }
    ],
    "alternativas": [
      "curtailment",
      "canibalização",
      "risco de base"
    ],
    "gabarito": 1,
    "referencia": "Quando muita geração da mesma fonte se concentra nas mesmas horas, o preço daquelas horas cai e o valor capturado por todos os projetos daquela fonte cai junto — fenômeno que se chama canibalização.",
    "verificacao": "alternativa-correta"
  },
  {
    "id": "m04-a05-d02",
    "moduloId": "modulo-04",
    "aula": 5,
    "origem": "derivado-da-aula",
    "tipo": "aberto",
    "enunciado": "Um PPA financeiro coloca energia na fábrica? O que ele faz, segundo a aula?",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "fonte": {
      "arquivo": "src/lib/data/alexandria-modulo-04-content.ts",
      "campo": "MODULO_04_CORPO['aula-04-05']",
      "linha": null
    },
    "evidencias": [
      {
        "arquivo": "src/lib/data/alexandria-modulo-04-content.ts",
        "campo": "MODULO_04_CORPO['aula-04-05']",
        "linha": null,
        "trecho": "Num PPA financeiro, as partes liquidam apenas a diferença entre o preço contratado e um preço de referência — o contrato funciona como proteção de preço, não como suprimento. A distinção é decisiva e frequentemente obscurecida em apresentação comercial: um PPA financeiro não coloca um elétron a mais na fábrica, e a empresa continua precisando comprar energia física de alguém."
      }
    ],
    "gabarito": null,
    "referencia": "Num PPA financeiro, as partes liquidam apenas a diferença entre o preço contratado e um preço de referência — o contrato funciona como proteção de preço, não como suprimento. A distinção é decisiva e frequentemente obscurecida em apresentação comercial: um PPA financeiro não coloca um elétron a mais na fábrica, e a empresa continua precisando comprar energia física de alguém.",
    "verificacao": "autoavaliacao"
  },
  {
    "id": "m04-ex-08",
    "moduloId": "modulo-04",
    "aula": 6,
    "origem": "fonte",
    "tipo": "aberto",
    "enunciado": "Uma empresa consome 10.000 MWh/mês e trava 7.000 MWh num swap a R$ 320/MWh. O PLD do mês fecha em R$ 470/MWh. Qual o resultado do swap, o custo total do mês e o custo efetivo por MWh? E se o PLD tivesse fechado em R$ 180?",
    "gabarito": null,
    "referencia": "Cenário alto: resultado do swap = (470 − 320) × 7.000 = <strong>+R$ 1,05 milhão</strong>. Custo sem hedge = 10.000 × 470 = R$ 4,7 milhões. Custo com hedge = R$ 3,65 milhões. Custo efetivo = <strong>R$ 365/MWh</strong>.<br><br>Cenário baixo: resultado = (180 − 320) × 7.000 = <strong>−R$ 980 mil</strong>. Custo sem hedge = R$ 1,8 milhão. Custo com hedge = R$ 2,78 milhões. Custo efetivo = <strong>R$ 278/MWh</strong>.<br><br>A amplitude sem hedge seria de R$ 180 a R$ 470 — 290 reais. Com hedge, de R$ 278 a R$ 365 — 87 reais. O hedge não escolheu um lado; ele comprimiu o intervalo em 70%. Essa é a única coisa que ele faz, e é a única coisa que se deve prometer ao conselho.",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "docs/alexandria-v2/extraction/m04/aparato.json",
      "campo": "exercicios.itens[7].enunciado.html",
      "linha": 1073
    },
    "evidencias": [
      {
        "arquivo": "docs/alexandria-v2/extraction/m04/aparato.json",
        "campo": "exercicios.itens[7].enunciado.texto",
        "linha": 1073,
        "trecho": "Uma empresa consome 10.000 MWh/mês e trava 7.000 MWh num swap a R$ 320/MWh. O PLD do mês fecha em R$ 470/MWh. Qual o resultado do swap, o custo total do mês e o custo efetivo por MWh? E se o PLD tivesse fechado em R$ 180?"
      },
      {
        "arquivo": "docs/alexandria-v2/extraction/m04/aparato.json",
        "campo": "exercicios.itens[7].resposta_referencia[0].texto",
        "linha": 1073,
        "trecho": "Cenário alto: resultado do swap = (470 − 320) × 7.000 = +R$ 1,05 milhão. Custo sem hedge = 10.000 × 470 = R$ 4,7 milhões. Custo com hedge = R$ 3,65 milhões. Custo efetivo = R$ 365/MWh."
      },
      {
        "arquivo": "docs/alexandria-v2/extraction/m04/aparato.json",
        "campo": "exercicios.itens[7].resposta_referencia[1].texto",
        "linha": 1073,
        "trecho": "Cenário baixo: resultado = (180 − 320) × 7.000 = −R$ 980 mil. Custo sem hedge = R$ 1,8 milhão. Custo com hedge = R$ 2,78 milhões. Custo efetivo = R$ 278/MWh."
      },
      {
        "arquivo": "docs/alexandria-v2/extraction/m04/aparato.json",
        "campo": "exercicios.itens[7].resposta_referencia[2].texto",
        "linha": 1073,
        "trecho": "A amplitude sem hedge seria de R$ 180 a R$ 470 — 290 reais. Com hedge, de R$ 278 a R$ 365 — 87 reais. O hedge não escolheu um lado; ele comprimiu o intervalo em 70%. Essa é a única coisa que ele faz, e é a única coisa que se deve prometer ao conselho."
      }
    ],
    "alertas": [
      "Vínculo mecânico: a fonte não prende este exercício a aula; \"No swap, uma parte troca preço variável por preço fixo\" aparece só na Aula 6.",
      "A fonte não declara critério por exercício; o § Ex só instrui: resolva antes de abrir."
    ]
  },
  {
    "id": "m04-a06-d01",
    "moduloId": "modulo-04",
    "aula": 6,
    "origem": "derivado-da-aula",
    "tipo": "escolha",
    "enunciado": "Na Aula 06, o que sobra como \"risco de base\" depois de um hedge?",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "fonte": {
      "arquivo": "src/lib/data/alexandria-modulo-04-content.ts",
      "campo": "MODULO_04_CORPO['aula-04-06']",
      "linha": null
    },
    "evidencias": [
      {
        "arquivo": "src/lib/data/alexandria-modulo-04-content.ts",
        "campo": "MODULO_04_CORPO['aula-04-06']",
        "linha": null,
        "trecho": "Sobra risco de base — a diferença entre o preço da referência do hedge e o preço da exposição real."
      }
    ],
    "alternativas": [
      "quando a proteção é mensal e a exposição é horária",
      "a diferença entre o preço da referência do hedge e o preço da exposição real",
      "quando o hedge cobre uma quantidade e o consumo entrega outra"
    ],
    "gabarito": 1,
    "referencia": "Sobra risco de base — a diferença entre o preço da referência do hedge e o preço da exposição real.",
    "verificacao": "alternativa-correta"
  },
  {
    "id": "m04-a06-d02",
    "moduloId": "modulo-04",
    "aula": 6,
    "origem": "derivado-da-aula",
    "tipo": "aberto",
    "enunciado": "O mercado caiu depois que a empresa fez hedge. O hedge foi um erro? Responda como a aula responde.",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "fonte": {
      "arquivo": "src/lib/data/alexandria-modulo-04-content.ts",
      "campo": "MODULO_04_CORPO['aula-04-06']",
      "linha": null
    },
    "evidencias": [
      {
        "arquivo": "src/lib/data/alexandria-modulo-04-content.ts",
        "campo": "MODULO_04_CORPO['aula-04-06']",
        "linha": null,
        "trecho": "Se o mercado cair depois, o hedge vai parecer um erro. Não foi. Foi um seguro que não precisou ser acionado, e ninguém chama o seguro do carro de erro porque não houve batida."
      }
    ],
    "gabarito": null,
    "referencia": "Se o mercado cair depois, o hedge vai parecer um erro. Não foi. Foi um seguro que não precisou ser acionado, e ninguém chama o seguro do carro de erro porque não houve batida.",
    "verificacao": "autoavaliacao"
  },
  {
    "id": "m04-ex-09",
    "moduloId": "modulo-04",
    "aula": 7,
    "origem": "fonte",
    "tipo": "aberto",
    "enunciado": "Uma empresa consome 10.000 MWh/mês e tem política de risco que exige no mínimo 80% contratado e limita a exposição ao curto prazo a R$ 500 mil por mês no cenário de estresse. O cenário de estresse adotado é PLD de R$ 700/MWh. A empresa está contratada em 85%. A posição atende à política?",
    "gabarito": null,
    "referencia": "Exposição = 15% × 10.000 = 1.500 MWh/mês. No cenário de estresse: 1.500 × 700 = <strong>R$ 1,05 milhão</strong> — mais que o dobro do limite de R$ 500 mil.<br><br>Ou seja: a empresa cumpre o critério de percentual e <em>viola</em> o critério de valor. Os dois critérios não são redundantes, e é comum uma política ter só o primeiro. Para respeitar o limite de R$ 500 mil a R$ 700/MWh, a exposição máxima seria de 714 MWh/mês — cerca de 7,1% do consumo. A política precisaria exigir 93% contratado, não 80%.<br><br>A lição é sobre desenho de política, não sobre contratação: <strong>limite percentual e limite financeiro precisam ser calibrados um contra o outro, no cenário de estresse que a empresa realmente teme.</strong> Uma política com os dois números desalinhados dá conforto falso — e o falso conforto é pior que a ausência de política, porque ninguém revisa o que parece resolvido.",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "docs/alexandria-v2/extraction/m04/aparato.json",
      "campo": "exercicios.itens[8].enunciado.html",
      "linha": 1080
    },
    "evidencias": [
      {
        "arquivo": "docs/alexandria-v2/extraction/m04/aparato.json",
        "campo": "exercicios.itens[8].enunciado.texto",
        "linha": 1080,
        "trecho": "Uma empresa consome 10.000 MWh/mês e tem política de risco que exige no mínimo 80% contratado e limita a exposição ao curto prazo a R$ 500 mil por mês no cenário de estresse. O cenário de estresse adotado é PLD de R$ 700/MWh. A empresa está contratada em 85%. A posição atende à política?"
      },
      {
        "arquivo": "docs/alexandria-v2/extraction/m04/aparato.json",
        "campo": "exercicios.itens[8].resposta_referencia[0].texto",
        "linha": 1080,
        "trecho": "Exposição = 15% × 10.000 = 1.500 MWh/mês. No cenário de estresse: 1.500 × 700 = R$ 1,05 milhão — mais que o dobro do limite de R$ 500 mil."
      },
      {
        "arquivo": "docs/alexandria-v2/extraction/m04/aparato.json",
        "campo": "exercicios.itens[8].resposta_referencia[1].texto",
        "linha": 1080,
        "trecho": "Ou seja: a empresa cumpre o critério de percentual e viola o critério de valor. Os dois critérios não são redundantes, e é comum uma política ter só o primeiro. Para respeitar o limite de R$ 500 mil a R$ 700/MWh, a exposição máxima seria de 714 MWh/mês — cerca de 7,1% do consumo. A política precisaria exigir 93% contratado, não 80%."
      },
      {
        "arquivo": "docs/alexandria-v2/extraction/m04/aparato.json",
        "campo": "exercicios.itens[8].resposta_referencia[2].texto",
        "linha": 1080,
        "trecho": "A lição é sobre desenho de política, não sobre contratação: limite percentual e limite financeiro precisam ser calibrados um contra o outro, no cenário de estresse que a empresa realmente teme. Uma política com os dois números desalinhados dá conforto falso — e o falso conforto é pior que a ausência de política, porque ninguém revisa o que parece resolvido."
      }
    ],
    "alertas": [
      "Vínculo mecânico: a fonte não prende este exercício a aula; \"A política de risco, por escrito\" aparece só na Aula 7.",
      "A fonte não declara critério por exercício; o § Ex só instrui: resolva antes de abrir."
    ]
  },
  {
    "id": "m04-a07-d01",
    "moduloId": "modulo-04",
    "aula": 7,
    "origem": "derivado-da-aula",
    "tipo": "escolha",
    "enunciado": "Na contratação em camadas, para que serve a exposição residual deliberada?",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "fonte": {
      "arquivo": "src/lib/data/alexandria-modulo-04-content.ts",
      "campo": "MODULO_04_CORPO['aula-04-07']",
      "linha": null
    },
    "evidencias": [
      {
        "arquivo": "src/lib/data/alexandria-modulo-04-content.ts",
        "campo": "MODULO_04_CORPO['aula-04-07']",
        "linha": null,
        "trecho": "A exposição residual não é descuido — é a folga que permite absorver variação de produção sem cair em sobrecontratação."
      }
    ],
    "alternativas": [
      "uma base longa que cobre o consumo estrutural",
      "é a folga que permite absorver variação de produção sem cair em sobrecontratação",
      "uma camada curta ajustada ao ano corrente"
    ],
    "gabarito": 1,
    "referencia": "A exposição residual não é descuido — é a folga que permite absorver variação de produção sem cair em sobrecontratação.",
    "verificacao": "alternativa-correta"
  },
  {
    "id": "m04-a07-d02",
    "moduloId": "modulo-04",
    "aula": 7,
    "origem": "derivado-da-aula",
    "tipo": "aberto",
    "enunciado": "Qual é a diferença entre análise de sensibilidade e simulação estocástica, e quando a segunda é útil?",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "fonte": {
      "arquivo": "src/lib/data/alexandria-modulo-04-content.ts",
      "campo": "MODULO_04_CORPO['aula-04-07']",
      "linha": null
    },
    "evidencias": [
      {
        "arquivo": "src/lib/data/alexandria-modulo-04-content.ts",
        "campo": "MODULO_04_CORPO['aula-04-07']",
        "linha": null,
        "trecho": "Testar um cenário por vez é análise de sensibilidade — muda-se uma premissa e observa-se o efeito. Testar milhares de combinações simultâneas é simulação estocástica, útil quando o risco não é linear, que é justamente o caso quando existem cláusulas de take-or-pay, bandas de flexibilidade e multas: essas cláusulas criam degraus na função de custo, e degraus não aparecem numa análise de sensibilidade simples."
      }
    ],
    "gabarito": null,
    "referencia": "Testar um cenário por vez é análise de sensibilidade — muda-se uma premissa e observa-se o efeito. Testar milhares de combinações simultâneas é simulação estocástica, útil quando o risco não é linear, que é justamente o caso quando existem cláusulas de take-or-pay, bandas de flexibilidade e multas: essas cláusulas criam degraus na função de custo, e degraus não aparecem numa análise de sensibilidade simples.",
    "verificacao": "autoavaliacao"
  }
];

export const EXERCICIOS_DO_MODULO: ExercicioDoModulo[] = [];

export const PROVAS: ProvaDoModulo[] = [{
  "moduloId": "modulo-04",
  "criterio": "O critério de domínio do módulo é acertar pelo menos 8 de 10 sem consultar.",
  "acertosMinimos": 8,
  "total": 10,
  "questoes": [
    {
      "id": "m04-quiz-q01",
      "enunciado": "Num sistema com muita solar despachando ao meio-dia, por que o preço de curto prazo daquele horário tende a cair?",
      "alternativas": [
        "Porque o custo marginal da solar é próximo de zero e ela passa a definir o preço",
        "Porque a solar desloca a curva de oferta e a usina que fica na margem passa a ser mais barata",
        "Porque o regulador reduz o teto de preço nos horários de alta geração renovável",
        "Porque a demanda cai ao meio-dia na maioria dos sistemas"
      ],
      "correta": 1,
      "explicacao": "Aula 01. A solar quase nunca é a usina marginal — ela empurra a fila. O preço cai porque quem ficou na margem é mais barato, não porque a solar é barata. Confundir os dois é o erro conceitual mais comum sobre efeito ordem de mérito.",
      "fonte": {
        "arquivo": "docs/alexandria-v2/extraction/m04/aparato.json",
        "campo": "avaliacao.questoes[0]",
        "linha": 1745
      }
    },
    {
      "id": "m04-quiz-q02",
      "enunciado": "O que exatamente o PLD valora?",
      "alternativas": [
        "O preço médio da energia consumida no país",
        "A diferença entre a energia contratada e a energia efetivamente medida",
        "O custo total da conta de luz de um consumidor livre",
        "O preço fixado nos leilões regulados de energia nova"
      ],
      "correta": 1,
      "explicacao": "Aula 02. PLD é preço de liquidação de diferenças. Um agente perfeitamente contratado tem exposição próxima de zero e é quase indiferente ao PLD. Quem trata o PLD como \"o preço da energia\" superestima o impacto dele na fatura.",
      "fonte": {
        "arquivo": "docs/alexandria-v2/extraction/m04/aparato.json",
        "campo": "avaliacao.questoes[1]",
        "linha": 1751
      }
    },
    {
      "id": "m04-quiz-q03",
      "enunciado": "Qual a função do PLDmax estrutural, distinta do PLDmax horário?",
      "alternativas": [
        "Limitar o preço de cada hora individualmente",
        "Limitar a média do período, com ajuste dos valores horários preservando o perfil da curva",
        "Definir o piso abaixo do qual o preço não pode cair",
        "Estabelecer o preço-teto dos leilões regulados"
      ],
      "correta": 1,
      "explicacao": "Aula 02. O teto horário limita cada hora; o estrutural limita a média, ajustando o conjunto de valores horários sem destruir o formato da curva. Em 2026: horário R$ 1.611,04/MWh, estrutural R$ 785,27/MWh, piso R$ 57,31/MWh.",
      "fonte": {
        "arquivo": "docs/alexandria-v2/extraction/m04/aparato.json",
        "campo": "avaliacao.questoes[2]",
        "linha": 1757
      }
    },
    {
      "id": "m04-quiz-q04",
      "enunciado": "Uma hidrelétrica com reservatório baixo pode ficar acima do gás na ordem de mérito. Por quê?",
      "alternativas": [
        "Porque o custo de manutenção da hidrelétrica sobe quando o reservatório está baixo",
        "Porque o valor da água é um custo de oportunidade que cresce quando a água fica escassa",
        "Porque o regulador determina que térmicas sejam despachadas antes em período seco",
        "Porque a eficiência da turbina cai com o nível do reservatório"
      ],
      "correta": 1,
      "explicacao": "Aula 01. Usar água hoje significa não tê-la amanhã. Quando a escassez futura fica provável, esse custo de oportunidade sobe e pode ultrapassar o CVU de uma térmica. É o mecanismo central do despacho hidrotérmico e a raiz da volatilidade do preço brasileiro.",
      "fonte": {
        "arquivo": "docs/alexandria-v2/extraction/m04/aparato.json",
        "campo": "avaliacao.questoes[3]",
        "linha": 1763
      }
    },
    {
      "id": "m04-quiz-q05",
      "enunciado": "Por que uma térmica de ponta pode não se pagar num mercado só de energia, mesmo sendo necessária ao sistema?",
      "alternativas": [
        "Porque o custo variável dela é alto demais para ser competitivo em qualquer hora",
        "Porque ela roda poucas horas e os tetos de preço impedem que essas horas paguem o custo fixo do ano",
        "Porque contratos de longo prazo são proibidos para térmicas de ponta",
        "Porque o operador prefere despachar renováveis mesmo quando é mais caro"
      ],
      "correta": 1,
      "explicacao": "Aula 03. É o missing money problem. Teto de preço, raridade dos eventos críticos e inaceitabilidade política de preços extremos quebram o mecanismo de escassez que a teoria assume. Daí a necessidade de mecanismos que paguem disponibilidade.",
      "fonte": {
        "arquivo": "docs/alexandria-v2/extraction/m04/aparato.json",
        "campo": "avaliacao.questoes[4]",
        "linha": 1769
      }
    },
    {
      "id": "m04-quiz-q06",
      "enunciado": "Num leilão A-5, o que significa o número 5?",
      "alternativas": [
        "Cinco anos de duração do contrato assinado",
        "Cinco anos entre a contratação e o início do suprimento",
        "Cinco rodadas de lances previstas no edital",
        "Cinco por cento de deságio mínimo exigido"
      ],
      "correta": 1,
      "explicacao": "Aula 04. A letra marca o ano de início da entrega; o número diz a antecedência da contratação. Quanto mais longa a maturação do projeto, maior a antecedência necessária para viabilizar financiamento.",
      "fonte": {
        "arquivo": "docs/alexandria-v2/extraction/m04/aparato.json",
        "campo": "avaliacao.questoes[5]",
        "linha": 1775
      }
    },
    {
      "id": "m04-quiz-q07",
      "enunciado": "Num leilão reverso liquidado por lance individual, qual a relação entre preço de corte e preço médio contratado?",
      "alternativas": [
        "São sempre iguais, porque o corte define o preço de todos",
        "O preço médio fica abaixo do corte, porque cada vencedor recebe o próprio lance",
        "O preço médio fica acima do corte, porque os melhores projetos cobram mais",
        "Não há relação definida — depende do número de participantes"
      ],
      "correta": 1,
      "explicacao": "Aula 04. Com liquidação por lance, cada vencedor recebe o que ofertou e a média fica abaixo do corte. Com preço uniforme, todos recebem o corte e a diferença migra para os geradores. A regra está no edital, e sobre contratos longos ela vale bilhões.",
      "fonte": {
        "arquivo": "docs/alexandria-v2/extraction/m04/aparato.json",
        "campo": "avaliacao.questoes[6]",
        "linha": 1781
      }
    },
    {
      "id": "m04-quiz-q08",
      "enunciado": "Uma empresa com consumo concentrado à noite assina um PPA solar flat com preço médio abaixo do mercado. Qual o problema estrutural?",
      "alternativas": [
        "O preço vai subir com a indexação e anular a vantagem",
        "A energia contratada aparece em horas diferentes das horas de consumo, gerando sobra e falta que penalizam o comprador nas duas pontas",
        "Contratos solares não podem ser assinados por consumidores industriais",
        "O submercado de uma usina solar é sempre diferente do submercado da carga"
      ],
      "correta": 1,
      "explicacao": "Aula 05. Descasamento de perfil. Sobra de dia liquidada barato e falta de noite liquidada caro — as duas contra o comprador. Volume anual correto e perfil errado é uma das formas mais eficientes de transformar contrato barato em custo alto.",
      "fonte": {
        "arquivo": "docs/alexandria-v2/extraction/m04/aparato.json",
        "campo": "avaliacao.questoes[7]",
        "linha": 1787
      }
    },
    {
      "id": "m04-quiz-q09",
      "enunciado": "O que o hedge faz com o custo de energia de uma empresa?",
      "alternativas": [
        "Reduz o custo esperado, por isso vale sempre a pena",
        "Reduz a dispersão em torno do custo esperado, sem reduzir o custo esperado",
        "Elimina completamente o risco de preço e de volume",
        "Transfere o risco regulatório para a contraparte"
      ],
      "correta": 1,
      "explicacao": "Aula 06. Hedge compra previsibilidade, não desconto. Se o mercado cair depois, o hedge vai parecer erro — não foi. Explicar isso ao conselho antes de contratar é parte do trabalho, não depois.",
      "fonte": {
        "arquivo": "docs/alexandria-v2/extraction/m04/aparato.json",
        "campo": "avaliacao.questoes[8]",
        "linha": 1793
      }
    },
    {
      "id": "m04-quiz-q10",
      "enunciado": "Qual a diferença essencial entre um leilão de reserva de capacidade e um leilão de energia?",
      "alternativas": [
        "O de capacidade tem prazo contratual mais curto",
        "O objeto contratado é disponibilidade de potência, não entrega de energia",
        "O de capacidade é restrito a fontes renováveis",
        "O de capacidade é organizado pelo operador do sistema, não pelo regulador"
      ],
      "correta": 1,
      "explicacao": "Aula 03. O vencedor se compromete a estar disponível, não a gerar um volume. É a tentativa brasileira de endereçar o missing money sem criar um mercado de capacidade permanente — e é a mesma lógica do leilão de armazenamento previsto para dezembro de 2026.",
      "fonte": {
        "arquivo": "docs/alexandria-v2/extraction/m04/aparato.json",
        "campo": "avaliacao.questoes[9]",
        "linha": 1799
      }
    }
  ],
  "faixas": [
    {
      "min": 8,
      "max": 10,
      "mensagem": "Critério de domínio atingido. Passe para o §Voz: as trinta e duas perguntas-relâmpago primeiro, o roteiro de cinco minutos depois — em voz alta, sem consultar."
    },
    {
      "min": 0,
      "max": 7,
      "mensagem": "Abaixo do critério de 8/10. Leia os retornos acima, refaça as aulas indicadas por inteiro e volte. Não avance para o §Voz antes de fechar 8."
    }
  ],
  "faixasFonte": {
    "arquivo": "docs/alexandria-v2/extraction/m04/aparato.json",
    "campo": "avaliacao.faixas_de_placar_script",
    "linha": 1832
  },
  "criterioFonte": {
    "arquivo": "docs/alexandria-v2/extraction/m04/aparato.json",
    "campo": "avaliacao.lede.html",
    "linha": 1092
  }
}];

export const CHECKLISTS: ChecklistDoModulo[] = [{
  "moduloId": "modulo-04",
  "introducao": "Vinte verificações. Responda sem travar e sem consultar. Cada uma que falhar aponta uma aula específica — e a aula é para ser refeita inteira, não consultada em diagonal.",
  "itens": [
    {
      "id": "m04-check-01",
      "texto": "Explica em três frases por que eletricidade é uma commodity diferente de petróleo ou minério",
      "fonte": {
        "arquivo": "docs/alexandria-v2/extraction/m04/aparato.json",
        "campo": "checklist_final.itens[0].html",
        "linha": 1184
      }
    },
    {
      "id": "m04-check-02",
      "texto": "Distingue custo fixo, custo variável, custo médio e custo marginal sem confundi-los",
      "fonte": {
        "arquivo": "docs/alexandria-v2/extraction/m04/aparato.json",
        "campo": "checklist_final.itens[1].html",
        "linha": 1185
      }
    },
    {
      "id": "m04-check-03",
      "texto": "Explica por que uma usina de custo marginal zero não faz o preço cair a zero",
      "fonte": {
        "arquivo": "docs/alexandria-v2/extraction/m04/aparato.json",
        "campo": "checklist_final.itens[2].html",
        "linha": 1186
      }
    },
    {
      "id": "m04-check-04",
      "texto": "Explica o que é margem inframarginal e por que ela é a receita de custo fixo num mercado só-de-energia",
      "fonte": {
        "arquivo": "docs/alexandria-v2/extraction/m04/aparato.json",
        "campo": "checklist_final.itens[3].html",
        "linha": 1187
      }
    },
    {
      "id": "m04-check-05",
      "texto": "Explica por que o preço de curto prazo brasileiro é calculado por modelo e não ofertado em pregão",
      "fonte": {
        "arquivo": "docs/alexandria-v2/extraction/m04/aparato.json",
        "campo": "checklist_final.itens[4].html",
        "linha": 1188
      }
    },
    {
      "id": "m04-check-06",
      "texto": "Mostra como o valor da água pode empurrar a hidráulica para cima do gás na ordem de mérito",
      "fonte": {
        "arquivo": "docs/alexandria-v2/extraction/m04/aparato.json",
        "campo": "checklist_final.itens[5].html",
        "linha": 1189
      }
    },
    {
      "id": "m04-check-07",
      "texto": "Descreve como o custo marginal se forma de maneira diferente em térmica, hidráulica, renovável, bateria e demanda flexível",
      "fonte": {
        "arquivo": "docs/alexandria-v2/extraction/m04/aparato.json",
        "campo": "checklist_final.itens[6].html",
        "linha": 1190
      }
    },
    {
      "id": "m04-check-08",
      "texto": "Define PLD corretamente — preço de liquidação de diferenças, não preço da energia",
      "fonte": {
        "arquivo": "docs/alexandria-v2/extraction/m04/aparato.json",
        "campo": "checklist_final.itens[7].html",
        "linha": 1191
      }
    },
    {
      "id": "m04-check-09",
      "texto": "Explica a relação entre CMO e PLD e o papel dos três limites regulatórios",
      "fonte": {
        "arquivo": "docs/alexandria-v2/extraction/m04/aparato.json",
        "campo": "checklist_final.itens[8].html",
        "linha": 1192
      }
    },
    {
      "id": "m04-check-10",
      "texto": "Nomeia os quatro submercados e explica o que significa o sistema estar acoplado",
      "fonte": {
        "arquivo": "docs/alexandria-v2/extraction/m04/aparato.json",
        "campo": "checklist_final.itens[9].html",
        "linha": 1193
      }
    },
    {
      "id": "m04-check-11",
      "texto": "Explica por que o PLD não é o preço que a fábrica paga na conta",
      "fonte": {
        "arquivo": "docs/alexandria-v2/extraction/m04/aparato.json",
        "campo": "checklist_final.itens[10].html",
        "linha": 1194
      }
    },
    {
      "id": "m04-check-12",
      "texto": "Explica por que o preço de contrato para o ano seguinte pode estar muito acima do PLD do dia",
      "fonte": {
        "arquivo": "docs/alexandria-v2/extraction/m04/aparato.json",
        "campo": "checklist_final.itens[11].html",
        "linha": 1195
      }
    },
    {
      "id": "m04-check-13",
      "texto": "Diferencia vender energia de vender disponibilidade, com a unidade de cada um",
      "fonte": {
        "arquivo": "docs/alexandria-v2/extraction/m04/aparato.json",
        "campo": "checklist_final.itens[12].html",
        "linha": 1196
      }
    },
    {
      "id": "m04-check-14",
      "texto": "Descreve o missing money problem e as três razões pelas quais o mecanismo de escassez falha",
      "fonte": {
        "arquivo": "docs/alexandria-v2/extraction/m04/aparato.json",
        "campo": "checklist_final.itens[13].html",
        "linha": 1197
      }
    },
    {
      "id": "m04-check-15",
      "texto": "Explica por que teto de preço e mecanismo de capacidade são duas metades da mesma decisão",
      "fonte": {
        "arquivo": "docs/alexandria-v2/extraction/m04/aparato.json",
        "campo": "checklist_final.itens[14].html",
        "linha": 1198
      }
    },
    {
      "id": "m04-check-16",
      "texto": "Explica o que é um leilão de reserva de capacidade e por que ele não é um leilão de energia",
      "fonte": {
        "arquivo": "docs/alexandria-v2/extraction/m04/aparato.json",
        "campo": "checklist_final.itens[15].html",
        "linha": 1199
      }
    },
    {
      "id": "m04-check-17",
      "texto": "Lê a nomenclatura A-1 a A-6 e explica a diferença entre energia nova e existente",
      "fonte": {
        "arquivo": "docs/alexandria-v2/extraction/m04/aparato.json",
        "campo": "checklist_final.itens[16].html",
        "linha": 1200
      }
    },
    {
      "id": "m04-check-18",
      "texto": "Diferencia preço de corte de preço médio contratado e sabe dizer por que a distinção é material",
      "fonte": {
        "arquivo": "docs/alexandria-v2/extraction/m04/aparato.json",
        "campo": "checklist_final.itens[17].html",
        "linha": 1201
      }
    },
    {
      "id": "m04-check-19",
      "texto": "Lista de memória pelo menos oito cláusulas de PPA e o risco que cada uma aloca",
      "fonte": {
        "arquivo": "docs/alexandria-v2/extraction/m04/aparato.json",
        "campo": "checklist_final.itens[18].html",
        "linha": 1202
      }
    },
    {
      "id": "m04-check-20",
      "texto": "Defende em voz alta, para um comprador industrial, quando um PPA de longo prazo vale mais que ficar exposto ao spot",
      "fonte": {
        "arquivo": "docs/alexandria-v2/extraction/m04/aparato.json",
        "campo": "checklist_final.itens[19].html",
        "linha": 1203
      }
    }
  ]
}];
