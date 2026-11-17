// GERADO por tools/alexandria-dados/avaliacao/gerar-avaliacao-m08.mjs — não editar à mão.
// Fonte: docs/alexandria-v2/extraction/m08/aparato.json e o texto das aulas (Alexandria modulos/alexandria_modulo08.html).
// Itens 'fonte' são literais da extração; 'derivado-da-aula' citam o trecho da aula que os responde.
// Vínculo Ex·NN → aula: regra de 15/11 (última aula que casar por trecho literal); sem casamento → EXERCICIOS_DO_MODULO.
// 15 itens por aula (1 da fonte, 14 derivados) · 11 do módulo · 10 questões na prova · 26 itens no checklist.
// Trocas editoriais: {}.
import type { ChecklistDoModulo, ExercicioDaAula, ExercicioDoModulo, ProvaDoModulo } from '../avaliacao';

export const EXERCICIOS_DAS_AULAS: ExercicioDaAula[] = [
  {
    "id": "m08-a01-d01",
    "moduloId": "modulo-08",
    "aula": 1,
    "origem": "derivado-da-aula",
    "tipo": "escolha",
    "enunciado": "Segundo a aula, a capacidade instalada é um estoque ou um fluxo?",
    "alternativas": [
      "um estoque",
      "um fluxo"
    ],
    "gabarito": 0,
    "referencia": "É um estoque, fotografado numa data.",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "alternativa-correta",
    "fonte": {
      "arquivo": "Alexandria modulos/alexandria_modulo08.html",
      "campo": "aula-08-01 · corpo[1]",
      "linha": 578
    },
    "evidencias": [
      {
        "arquivo": "Alexandria modulos/alexandria_modulo08.html",
        "campo": "aula-08-01 · corpo[1]",
        "linha": 578,
        "trecho": "É um estoque, fotografado numa data."
      }
    ]
  },
  {
    "id": "m08-a01-d02",
    "moduloId": "modulo-08",
    "aula": 1,
    "origem": "derivado-da-aula",
    "tipo": "aberto",
    "enunciado": "Segundo a aula, por que o fator de capacidade baixo da solar não quer dizer que ela seja ineficiente?",
    "gabarito": null,
    "referencia": "A tecnologia converte um recurso que só existe de dia, e a potência nominal de um módulo é medida no pico. Chamar isso de ineficiência é usar a métrica errada para a pergunta.",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "Alexandria modulos/alexandria_modulo08.html",
      "campo": "aula-08-01 · corpo[6]",
      "linha": 591
    },
    "evidencias": [
      {
        "arquivo": "Alexandria modulos/alexandria_modulo08.html",
        "campo": "aula-08-01 · corpo[6]",
        "linha": 591,
        "trecho": "A tecnologia converte um recurso que só existe de dia, e a potência nominal de um módulo é medida no pico. Chamar isso de ineficiência é usar a métrica errada para a pergunta."
      }
    ]
  },
  {
    "id": "m08-a02-d01",
    "moduloId": "modulo-08",
    "aula": 2,
    "origem": "derivado-da-aula",
    "tipo": "aberto",
    "enunciado": "Segundo a aula, por que as seis fichas têm campos idênticos e na mesma ordem?",
    "gabarito": null,
    "referencia": "Isso não é formatação: é o que permite leitura lateral, que é metade do valor desta aula.",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "Alexandria modulos/alexandria_modulo08.html",
      "campo": "aula-08-02 · corpo[0]",
      "linha": 729
    },
    "evidencias": [
      {
        "arquivo": "Alexandria modulos/alexandria_modulo08.html",
        "campo": "aula-08-02 · corpo[0]",
        "linha": 729,
        "trecho": "Isso não é formatação: é o que permite leitura lateral, que é metade do valor desta aula."
      }
    ]
  },
  {
    "id": "m08-a02-d02",
    "moduloId": "modulo-08",
    "aula": 2,
    "origem": "derivado-da-aula",
    "tipo": "escolha",
    "enunciado": "Qual é, segundo a aula, o primeiro dos dois vieses que aparecem quase sempre na primeira rodada?",
    "alternativas": [
      "superestimar a solar em geração",
      "subestimar a térmica em capacidade"
    ],
    "gabarito": 1,
    "referencia": "O primeiro é subestimar a térmica em capacidade",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "alternativa-correta",
    "fonte": {
      "arquivo": "Alexandria modulos/alexandria_modulo08.html",
      "campo": "aula-08-02 · corpo[8]",
      "linha": 829
    },
    "evidencias": [
      {
        "arquivo": "Alexandria modulos/alexandria_modulo08.html",
        "campo": "aula-08-02 · corpo[8]",
        "linha": 829,
        "trecho": "O primeiro é subestimar a térmica em capacidade"
      }
    ]
  },
  {
    "id": "m08-a03-d01",
    "moduloId": "modulo-08",
    "aula": 3,
    "origem": "derivado-da-aula",
    "tipo": "escolha",
    "enunciado": "Segundo a aula, qual recurso não tem papel sazonal?",
    "alternativas": [
      "o vento",
      "a solar"
    ],
    "gabarito": 1,
    "referencia": "a solar não tem papel sazonal e o vento não tem papel intradiário confiável.",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "alternativa-correta",
    "fonte": {
      "arquivo": "Alexandria modulos/alexandria_modulo08.html",
      "campo": "aula-08-03 · corpo[3]",
      "linha": 871
    },
    "evidencias": [
      {
        "arquivo": "Alexandria modulos/alexandria_modulo08.html",
        "campo": "aula-08-03 · corpo[3]",
        "linha": 871,
        "trecho": "a solar não tem papel sazonal e o vento não tem papel intradiário confiável."
      }
    ]
  },
  {
    "id": "m08-a03-d02",
    "moduloId": "modulo-08",
    "aula": 3,
    "origem": "derivado-da-aula",
    "tipo": "aberto",
    "enunciado": "Segundo a aula, o que é a carga que o operador nacional enxerga?",
    "gabarito": null,
    "referencia": "A carga que o operador nacional enxerga não é o consumo da sociedade. É o consumo menos a geração que ele não comanda",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "Alexandria modulos/alexandria_modulo08.html",
      "campo": "aula-08-03 · corpo[6]",
      "linha": 877
    },
    "evidencias": [
      {
        "arquivo": "Alexandria modulos/alexandria_modulo08.html",
        "campo": "aula-08-03 · corpo[6]",
        "linha": 877,
        "trecho": "A carga que o operador nacional enxerga não é o consumo da sociedade. É o consumo menos a geração que ele não comanda"
      }
    ]
  },
  {
    "id": "m08-a04-d01",
    "moduloId": "modulo-08",
    "aula": 4,
    "origem": "derivado-da-aula",
    "tipo": "aberto",
    "enunciado": "Segundo a aula, por que a geração hidrelétrica não pode ser reduzida indefinidamente?",
    "gabarito": null,
    "referencia": "Existem vazões mínimas obrigatórias por licença ambiental, requisitos de navegação e abastecimento, limites de estabilidade e exigências operativas das máquinas.",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "Alexandria modulos/alexandria_modulo08.html",
      "campo": "aula-08-04 · corpo[9]",
      "linha": 1043
    },
    "evidencias": [
      {
        "arquivo": "Alexandria modulos/alexandria_modulo08.html",
        "campo": "aula-08-04 · corpo[9]",
        "linha": 1043,
        "trecho": "Existem vazões mínimas obrigatórias por licença ambiental, requisitos de navegação e abastecimento, limites de estabilidade e exigências operativas das máquinas."
      }
    ]
  },
  {
    "id": "m08-a04-d02",
    "moduloId": "modulo-08",
    "aula": 4,
    "origem": "derivado-da-aula",
    "tipo": "escolha",
    "enunciado": "Segundo a aula, contra que régua a afluência de um mês deve ser lida?",
    "alternativas": [
      "a média anual do Brasil",
      "o valor histórico esperado da afluência para aquele mês e aquele subsistema"
    ],
    "gabarito": 1,
    "referencia": "A média de longo termo é o valor histórico esperado da afluência para aquele mês e aquele subsistema.",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "alternativa-correta",
    "fonte": {
      "arquivo": "Alexandria modulos/alexandria_modulo08.html",
      "campo": "aula-08-04 · corpo[3]",
      "linha": 979
    },
    "evidencias": [
      {
        "arquivo": "Alexandria modulos/alexandria_modulo08.html",
        "campo": "aula-08-04 · corpo[3]",
        "linha": 979,
        "trecho": "A média de longo termo é o valor histórico esperado da afluência para aquele mês e aquele subsistema."
      }
    ]
  },
  {
    "id": "m08-ex-10",
    "moduloId": "modulo-08",
    "aula": 5,
    "origem": "fonte",
    "tipo": "aberto",
    "enunciado": "Uma série mostra o corte de geração indo de 0,1% em 2021 para cerca de 20% em 2025. O que explica a inclinação?",
    "gabarito": null,
    "referencia": "Três causas somadas, e uma armadilha. Primeira causa: crescimento da capacidade variável em ritmo superior ao da carga e ao da rede, concentrado no Nordeste. Segunda: revisão dos modelos dinâmicos das usinas após uma perturbação relevante de 2023, que reduziu a capacidade de escoamento calculada. Terceira: crescimento acelerado da geração distribuída, que rebaixa a carga líquida sem estar sob comando. A armadilha: até março de 2024 a série considerava apenas usinas eólicas; as fotovoltaicas entraram depois. Parte da inclinação é mudança de universo, não fenômeno. Um gráfico honesto marca a quebra.",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "docs/alexandria-v2/extraction/m08/aparato.json",
      "campo": "exercicios.itens[9].enunciado",
      "linha": 1631
    },
    "evidencias": [
      {
        "arquivo": "docs/alexandria-v2/extraction/m08/aparato.json",
        "campo": "exercicios.itens[9].enunciado.texto",
        "linha": 1631,
        "trecho": "Uma série mostra o corte de geração indo de 0,1% em 2021 para cerca de 20% em 2025. O que explica a inclinação?"
      },
      {
        "arquivo": "docs/alexandria-v2/extraction/m08/aparato.json",
        "campo": "exercicios.itens[9].resposta_de_referencia[0].html",
        "linha": 1631,
        "trecho": "Três causas somadas, e uma armadilha. Primeira causa: crescimento da capacidade variável em ritmo superior ao da carga e ao da rede, concentrado no Nordeste. Segunda: revisão dos modelos dinâmicos das usinas após uma perturbação relevante de 2023, que reduziu a capacidade de escoamento calculada. Terceira: crescimento acelerado da geração distribuída, que rebaixa a carga líquida sem estar sob comando."
      },
      {
        "arquivo": "docs/alexandria-v2/extraction/m08/aparato.json",
        "campo": "exercicios.itens[9].resposta_de_referencia[1].html",
        "linha": 1631,
        "trecho": "A armadilha: até março de 2024 a série considerava apenas usinas eólicas; as fotovoltaicas entraram depois. Parte da inclinação é mudança de universo, não fenômeno. Um gráfico honesto marca a quebra."
      }
    ],
    "alertas": [
      "Vínculo mecânico à Aula 05 (regra de 15/11): a fonte não liga o Ex·10 a aula; trecho que casa: «de 0,1% em 2021 para cerca de 20% em 2025».",
      "Grupo da fonte: \"Bloco C · leitura de série\"."
    ]
  },
  {
    "id": "m08-a05-d01",
    "moduloId": "modulo-08",
    "aula": 5,
    "origem": "derivado-da-aula",
    "tipo": "escolha",
    "enunciado": "Segundo a aula, o que é um submercado?",
    "alternativas": [
      "fronteira administrativa",
      "zona de contabilização e de preço"
    ],
    "gabarito": 1,
    "referencia": "Submercado é zona de contabilização e de preço, não fronteira administrativa",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "alternativa-correta",
    "fonte": {
      "arquivo": "Alexandria modulos/alexandria_modulo08.html",
      "campo": "aula-08-05 · corpo[4]",
      "linha": 1107
    },
    "evidencias": [
      {
        "arquivo": "Alexandria modulos/alexandria_modulo08.html",
        "campo": "aula-08-05 · corpo[4]",
        "linha": 1107,
        "trecho": "Submercado é zona de contabilização e de preço, não fronteira administrativa"
      }
    ]
  },
  {
    "id": "m08-a05-d02",
    "moduloId": "modulo-08",
    "aula": 5,
    "origem": "derivado-da-aula",
    "tipo": "aberto",
    "enunciado": "Segundo a aula, qual é a diferença entre corte por confiabilidade e corte por razão energética?",
    "gabarito": null,
    "referencia": "Corte por confiabilidade é problema de rede: mais linha resolve. Corte por razão energética é problema de balanço: mais linha não resolve nada, porque a energia não tem para onde ir em lugar nenhum do país naquela hora.",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "Alexandria modulos/alexandria_modulo08.html",
      "campo": "aula-08-05 · corpo[24]",
      "linha": 1173
    },
    "evidencias": [
      {
        "arquivo": "Alexandria modulos/alexandria_modulo08.html",
        "campo": "aula-08-05 · corpo[24]",
        "linha": 1173,
        "trecho": "Corte por confiabilidade é problema de rede: mais linha resolve. Corte por razão energética é problema de balanço: mais linha não resolve nada, porque a energia não tem para onde ir em lugar nenhum do país naquela hora."
      }
    ]
  },
  {
    "id": "m08-a06-d01",
    "moduloId": "modulo-08",
    "aula": 6,
    "origem": "derivado-da-aula",
    "tipo": "aberto",
    "enunciado": "Segundo a aula, o que o consumidor livre escolhe, e o que continua igual?",
    "gabarito": null,
    "referencia": "o consumidor livre escolhe de quem compra a energia, e continua usando e pagando a rede local.",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "Alexandria modulos/alexandria_modulo08.html",
      "campo": "aula-08-06 · corpo[2]",
      "linha": 1240
    },
    "evidencias": [
      {
        "arquivo": "Alexandria modulos/alexandria_modulo08.html",
        "campo": "aula-08-06 · corpo[2]",
        "linha": 1240,
        "trecho": "o consumidor livre escolhe de quem compra a energia, e continua usando e pagando a rede local."
      }
    ]
  },
  {
    "id": "m08-a06-d02",
    "moduloId": "modulo-08",
    "aula": 6,
    "origem": "derivado-da-aula",
    "tipo": "escolha",
    "enunciado": "Segundo a aula, o que a migração para o ambiente livre faz com o consumo?",
    "alternativas": [
      "reduz consumo físico",
      "move consumo entre ambientes contábeis"
    ],
    "gabarito": 1,
    "referencia": "A migração não reduz consumo físico — move consumo entre ambientes contábeis.",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "alternativa-correta",
    "fonte": {
      "arquivo": "Alexandria modulos/alexandria_modulo08.html",
      "campo": "aula-08-06 · corpo[20]",
      "linha": 1322
    },
    "evidencias": [
      {
        "arquivo": "Alexandria modulos/alexandria_modulo08.html",
        "campo": "aula-08-06 · corpo[20]",
        "linha": 1322,
        "trecho": "A migração não reduz consumo físico — move consumo entre ambientes contábeis."
      }
    ]
  },
  {
    "id": "m08-a07-d01",
    "moduloId": "modulo-08",
    "aula": 7,
    "origem": "derivado-da-aula",
    "tipo": "aberto",
    "enunciado": "Segundo a aula, por que a participação hidrelétrica na geração caiu?",
    "gabarito": null,
    "referencia": "A leitura correta é aritmética: a capacidade hidrelétrica cresceu pouco enquanto a das outras fontes explodiu",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "Alexandria modulos/alexandria_modulo08.html",
      "campo": "aula-08-07 · corpo[1]",
      "linha": 1381
    },
    "evidencias": [
      {
        "arquivo": "Alexandria modulos/alexandria_modulo08.html",
        "campo": "aula-08-07 · corpo[1]",
        "linha": 1381,
        "trecho": "A leitura correta é aritmética: a capacidade hidrelétrica cresceu pouco enquanto a das outras fontes explodiu"
      }
    ]
  },
  {
    "id": "m08-a07-d02",
    "moduloId": "modulo-08",
    "aula": 7,
    "origem": "derivado-da-aula",
    "tipo": "escolha",
    "enunciado": "Segundo a aula, quanto tempo leva uma linha de transmissão?",
    "alternativas": [
      "de cinco a quinze",
      "um a dois anos"
    ],
    "gabarito": 0,
    "referencia": "Uma usina eólica ou solar se constrói em um a dois anos. Uma linha de transmissão leva de cinco a quinze",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "alternativa-correta",
    "fonte": {
      "arquivo": "Alexandria modulos/alexandria_modulo08.html",
      "campo": "aula-08-07 · corpo[9]",
      "linha": 1397
    },
    "evidencias": [
      {
        "arquivo": "Alexandria modulos/alexandria_modulo08.html",
        "campo": "aula-08-07 · corpo[9]",
        "linha": 1397,
        "trecho": "Uma usina eólica ou solar se constrói em um a dois anos. Uma linha de transmissão leva de cinco a quinze"
      }
    ]
  }
];

export const EXERCICIOS_DO_MODULO: ExercicioDoModulo[] = [
  {
    "id": "m08-ex-01",
    "moduloId": "modulo-08",
    "aula": null,
    "origem": "fonte",
    "tipo": "aberto",
    "enunciado": "Sem consultar nada: qual fonte tem fatia maior em geração do que em capacidade, e por quê?",
    "gabarito": null,
    "referencia": "Resposta: hidrelétrica, com folga — sobe cerca de dez pontos entre uma pizza e outra. Nuclear também sobe, proporcionalmente ainda mais, mas de uma base pequena. Eólica sobe ligeiramente. Por quê: todas têm fator de capacidade acima da média ponderada do parque. A hidráulica soma recurso abundante e despachabilidade; a nuclear opera como base com o maior fator do parque brasileiro; a eólica tem recurso brasileiro excepcional em comparação internacional. O que a resposta completa acrescenta: a térmica fóssil é a única cuja direção não se prevê sem contexto, porque a fatia dela em geração depende da hidrologia e do custo de combustível daquele ano específico.",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "docs/alexandria-v2/extraction/m08/aparato.json",
      "campo": "exercicios.itens[0].enunciado",
      "linha": 1575
    },
    "evidencias": [
      {
        "arquivo": "docs/alexandria-v2/extraction/m08/aparato.json",
        "campo": "exercicios.itens[0].enunciado.texto",
        "linha": 1575,
        "trecho": "Sem consultar nada: qual fonte tem fatia maior em geração do que em capacidade, e por quê?"
      },
      {
        "arquivo": "docs/alexandria-v2/extraction/m08/aparato.json",
        "campo": "exercicios.itens[0].resposta_de_referencia[0].html",
        "linha": 1575,
        "trecho": "Resposta: hidrelétrica, com folga — sobe cerca de dez pontos entre uma pizza e outra. Nuclear também sobe, proporcionalmente ainda mais, mas de uma base pequena. Eólica sobe ligeiramente."
      },
      {
        "arquivo": "docs/alexandria-v2/extraction/m08/aparato.json",
        "campo": "exercicios.itens[0].resposta_de_referencia[1].html",
        "linha": 1575,
        "trecho": "Por quê: todas têm fator de capacidade acima da média ponderada do parque. A hidráulica soma recurso abundante e despachabilidade; a nuclear opera como base com o maior fator do parque brasileiro; a eólica tem recurso brasileiro excepcional em comparação internacional."
      },
      {
        "arquivo": "docs/alexandria-v2/extraction/m08/aparato.json",
        "campo": "exercicios.itens[0].resposta_de_referencia[2].html",
        "linha": 1575,
        "trecho": "O que a resposta completa acrescenta: a térmica fóssil é a única cuja direção não se prevê sem contexto, porque a fatia dela em geração depende da hidrologia e do custo de combustível daquele ano específico."
      }
    ],
    "alertas": [
      "Exercício do módulo: a fonte não liga o Ex·01 a aula (P9) e nenhum trecho de 4 ou mais palavras do rótulo e do enunciado aparece no texto de uma aula (regra de 15/11).",
      "Grupo da fonte: \"Bloco A · estimativa e reconstrução\"."
    ]
  },
  {
    "id": "m08-ex-02",
    "moduloId": "modulo-08",
    "aula": null,
    "origem": "fonte",
    "tipo": "aberto",
    "enunciado": "Estime, em ordem e com fatia aproximada, as cinco maiores fontes em capacidade instalada no conceito amplo. Depois as cinco maiores em geração. Quantas trocaram de posição?",
    "gabarito": null,
    "referencia": "Ordem em capacidade: hidrelétrica primeiro, com pouco mais de quarenta por cento; solar em segundo, com cerca de um quarto; térmica agregada em terceiro, perto de vinte por cento; eólica em quarto, na casa dos treze; nuclear em quinto, abaixo de um por cento. Ordem em geração: hidrelétrica primeiro, com cerca de metade; eólica em segundo, na casa dos quinze; solar em terceiro, na casa dos onze; biomassa em torno de oito e gás em torno de oito, disputando o quarto lugar; nuclear em torno de dois. Trocas: a mais importante é solar e eólica invertendo entre segundo e terceiro. A térmica se desagrega em geração — biomassa e fósseis aparecem separadas — o que por si só reordena o meio da tabela. Critério de acerto: a ordem e a ordem de grandeza. Errar o decimal não é erro; errar a ordem ou não explicar a troca é.",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "docs/alexandria-v2/extraction/m08/aparato.json",
      "campo": "exercicios.itens[1].enunciado",
      "linha": 1581
    },
    "evidencias": [
      {
        "arquivo": "docs/alexandria-v2/extraction/m08/aparato.json",
        "campo": "exercicios.itens[1].enunciado.texto",
        "linha": 1581,
        "trecho": "Estime, em ordem e com fatia aproximada, as cinco maiores fontes em capacidade instalada no conceito amplo. Depois as cinco maiores em geração. Quantas trocaram de posição?"
      },
      {
        "arquivo": "docs/alexandria-v2/extraction/m08/aparato.json",
        "campo": "exercicios.itens[1].resposta_de_referencia[0].html",
        "linha": 1581,
        "trecho": "Ordem em capacidade: hidrelétrica primeiro, com pouco mais de quarenta por cento; solar em segundo, com cerca de um quarto; térmica agregada em terceiro, perto de vinte por cento; eólica em quarto, na casa dos treze; nuclear em quinto, abaixo de um por cento."
      },
      {
        "arquivo": "docs/alexandria-v2/extraction/m08/aparato.json",
        "campo": "exercicios.itens[1].resposta_de_referencia[1].html",
        "linha": 1581,
        "trecho": "Ordem em geração: hidrelétrica primeiro, com cerca de metade; eólica em segundo, na casa dos quinze; solar em terceiro, na casa dos onze; biomassa em torno de oito e gás em torno de oito, disputando o quarto lugar; nuclear em torno de dois."
      },
      {
        "arquivo": "docs/alexandria-v2/extraction/m08/aparato.json",
        "campo": "exercicios.itens[1].resposta_de_referencia[2].html",
        "linha": 1581,
        "trecho": "Trocas: a mais importante é solar e eólica invertendo entre segundo e terceiro. A térmica se desagrega em geração — biomassa e fósseis aparecem separadas — o que por si só reordena o meio da tabela."
      },
      {
        "arquivo": "docs/alexandria-v2/extraction/m08/aparato.json",
        "campo": "exercicios.itens[1].resposta_de_referencia[3].html",
        "linha": 1581,
        "trecho": "Critério de acerto: a ordem e a ordem de grandeza. Errar o decimal não é erro; errar a ordem ou não explicar a troca é."
      }
    ],
    "alertas": [
      "Exercício do módulo: a fonte não liga o Ex·02 a aula (P9) e nenhum trecho de 4 ou mais palavras do rótulo e do enunciado aparece no texto de uma aula (regra de 15/11).",
      "Grupo da fonte: \"Bloco A · estimativa e reconstrução\"."
    ]
  },
  {
    "id": "m08-ex-03",
    "moduloId": "modulo-08",
    "aula": null,
    "origem": "fonte",
    "tipo": "aberto",
    "enunciado": "Uma usina de 300 MW gerou 1.200 GWh em um ano. Qual o fator de capacidade, e o que ele sugere sobre a fonte?",
    "gabarito": null,
    "referencia": "Conta: 300 MW × 8.760 h = 2.628 GWh de energia teórica máxima. 1.200 ÷ 2.628 ≈ 45,7%. O que sugere: está na faixa alta de eólica de bom sítio, na faixa típica de hidrelétrica e na faixa alta de biomassa. Está muito acima de solar e muito abaixo de nuclear. O que a resposta completa acrescenta: a conta acima assume que os 300 MW estiveram disponíveis o ano inteiro. Se a usina entrou em operação em julho, o denominador correto é aproximadamente metade, e o fator real dobra. Antes de interpretar qualquer fator de capacidade, pergunte a data de entrada em operação comercial.",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "docs/alexandria-v2/extraction/m08/aparato.json",
      "campo": "exercicios.itens[2].enunciado",
      "linha": 1588
    },
    "evidencias": [
      {
        "arquivo": "docs/alexandria-v2/extraction/m08/aparato.json",
        "campo": "exercicios.itens[2].enunciado.texto",
        "linha": 1588,
        "trecho": "Uma usina de 300 MW gerou 1.200 GWh em um ano. Qual o fator de capacidade, e o que ele sugere sobre a fonte?"
      },
      {
        "arquivo": "docs/alexandria-v2/extraction/m08/aparato.json",
        "campo": "exercicios.itens[2].resposta_de_referencia[0].html",
        "linha": 1588,
        "trecho": "Conta: 300 MW × 8.760 h = 2.628 GWh de energia teórica máxima. 1.200 ÷ 2.628 ≈ 45,7%."
      },
      {
        "arquivo": "docs/alexandria-v2/extraction/m08/aparato.json",
        "campo": "exercicios.itens[2].resposta_de_referencia[1].html",
        "linha": 1588,
        "trecho": "O que sugere: está na faixa alta de eólica de bom sítio, na faixa típica de hidrelétrica e na faixa alta de biomassa. Está muito acima de solar e muito abaixo de nuclear."
      },
      {
        "arquivo": "docs/alexandria-v2/extraction/m08/aparato.json",
        "campo": "exercicios.itens[2].resposta_de_referencia[2].html",
        "linha": 1588,
        "trecho": "O que a resposta completa acrescenta: a conta acima assume que os 300 MW estiveram disponíveis o ano inteiro. Se a usina entrou em operação em julho, o denominador correto é aproximadamente metade, e o fator real dobra. Antes de interpretar qualquer fator de capacidade, pergunte a data de entrada em operação comercial."
      }
    ],
    "alertas": [
      "Exercício do módulo: a fonte não liga o Ex·03 a aula (P9) e nenhum trecho de 4 ou mais palavras do rótulo e do enunciado aparece no texto de uma aula (regra de 15/11).",
      "Grupo da fonte: \"Bloco A · estimativa e reconstrução\"."
    ]
  },
  {
    "id": "m08-ex-04",
    "moduloId": "modulo-08",
    "aula": null,
    "origem": "fonte",
    "tipo": "aberto",
    "enunciado": "Desenhe de cabeça o perfil de um domingo ensolarado de outubro no sistema. O que acontece em cada um dos quatro patamares?",
    "gabarito": null,
    "referencia": "P1, madrugada: carga baixa, sem sol, eólica possivelmente alta, hidráulica no piso. Praticamente sem corte. P2 da manhã: sol começa a subir, carga ainda baixa porque é domingo. Corte começa a aparecer. P3, meio do dia: a janela crítica. Solar centralizada e distribuída no máximo, carga no mínimo semanal, hidráulica já no piso, térmica inflexível gerando. Corte de geração no pico do ano. P4, início da noite: sol some rápido, carga sobe. Rampa acentuada exigindo hidráulica, térmica, armazenamento e intercâmbio em poucas horas. Corte desaparece. O que a resposta completa acrescenta: o pior dia do sistema não é o mais quente nem o mais frio — é o domingo ensolarado de feriado prolongado, quando oferta máxima e demanda mínima coincidem.",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "docs/alexandria-v2/extraction/m08/aparato.json",
      "campo": "exercicios.itens[3].enunciado",
      "linha": 1594
    },
    "evidencias": [
      {
        "arquivo": "docs/alexandria-v2/extraction/m08/aparato.json",
        "campo": "exercicios.itens[3].enunciado.texto",
        "linha": 1594,
        "trecho": "Desenhe de cabeça o perfil de um domingo ensolarado de outubro no sistema. O que acontece em cada um dos quatro patamares?"
      },
      {
        "arquivo": "docs/alexandria-v2/extraction/m08/aparato.json",
        "campo": "exercicios.itens[3].resposta_de_referencia[0].html",
        "linha": 1594,
        "trecho": "P1, madrugada: carga baixa, sem sol, eólica possivelmente alta, hidráulica no piso. Praticamente sem corte."
      },
      {
        "arquivo": "docs/alexandria-v2/extraction/m08/aparato.json",
        "campo": "exercicios.itens[3].resposta_de_referencia[1].html",
        "linha": 1594,
        "trecho": "P2 da manhã: sol começa a subir, carga ainda baixa porque é domingo. Corte começa a aparecer."
      },
      {
        "arquivo": "docs/alexandria-v2/extraction/m08/aparato.json",
        "campo": "exercicios.itens[3].resposta_de_referencia[2].html",
        "linha": 1594,
        "trecho": "P3, meio do dia: a janela crítica. Solar centralizada e distribuída no máximo, carga no mínimo semanal, hidráulica já no piso, térmica inflexível gerando. Corte de geração no pico do ano."
      },
      {
        "arquivo": "docs/alexandria-v2/extraction/m08/aparato.json",
        "campo": "exercicios.itens[3].resposta_de_referencia[3].html",
        "linha": 1594,
        "trecho": "P4, início da noite: sol some rápido, carga sobe. Rampa acentuada exigindo hidráulica, térmica, armazenamento e intercâmbio em poucas horas. Corte desaparece."
      },
      {
        "arquivo": "docs/alexandria-v2/extraction/m08/aparato.json",
        "campo": "exercicios.itens[3].resposta_de_referencia[4].html",
        "linha": 1594,
        "trecho": "O que a resposta completa acrescenta: o pior dia do sistema não é o mais quente nem o mais frio — é o domingo ensolarado de feriado prolongado, quando oferta máxima e demanda mínima coincidem."
      }
    ],
    "alertas": [
      "Exercício do módulo: a fonte não liga o Ex·04 a aula (P9) e nenhum trecho de 4 ou mais palavras do rótulo e do enunciado aparece no texto de uma aula (regra de 15/11).",
      "Grupo da fonte: \"Bloco A · estimativa e reconstrução\"."
    ]
  },
  {
    "id": "m08-ex-05",
    "moduloId": "modulo-08",
    "aula": null,
    "origem": "fonte",
    "tipo": "aberto",
    "enunciado": "Alguém afirma que a matriz brasileira é 88% renovável. O que você pergunta antes de aceitar?",
    "gabarito": null,
    "referencia": "As três perguntas, nesta ordem: primeiro, elétrica ou energética — se for energética, o número está errado por quase quarenta pontos. Segundo, capacidade ou geração — os dois percentuais existem e não coincidem. Terceiro, qual ano e qual universo — conceito amplo com distribuída e autoprodução, ou somente centralizada em operação. O que a resposta completa acrescenta: a série anual é declinante nos últimos anos, então um número correto de dois anos atrás está errado hoje. Errar este exercício é a falha mais grave possível neste bloco, porque ele é o bloco inteiro em uma pergunta.",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "docs/alexandria-v2/extraction/m08/aparato.json",
      "campo": "exercicios.itens[4].enunciado",
      "linha": 1604
    },
    "evidencias": [
      {
        "arquivo": "docs/alexandria-v2/extraction/m08/aparato.json",
        "campo": "exercicios.itens[4].enunciado.texto",
        "linha": 1604,
        "trecho": "Alguém afirma que a matriz brasileira é 88% renovável. O que você pergunta antes de aceitar?"
      },
      {
        "arquivo": "docs/alexandria-v2/extraction/m08/aparato.json",
        "campo": "exercicios.itens[4].resposta_de_referencia[0].html",
        "linha": 1604,
        "trecho": "As três perguntas, nesta ordem: primeiro, elétrica ou energética — se for energética, o número está errado por quase quarenta pontos. Segundo, capacidade ou geração — os dois percentuais existem e não coincidem. Terceiro, qual ano e qual universo — conceito amplo com distribuída e autoprodução, ou somente centralizada em operação."
      },
      {
        "arquivo": "docs/alexandria-v2/extraction/m08/aparato.json",
        "campo": "exercicios.itens[4].resposta_de_referencia[1].html",
        "linha": 1604,
        "trecho": "O que a resposta completa acrescenta: a série anual é declinante nos últimos anos, então um número correto de dois anos atrás está errado hoje. Errar este exercício é a falha mais grave possível neste bloco, porque ele é o bloco inteiro em uma pergunta."
      }
    ],
    "alertas": [
      "Exercício do módulo: a fonte não liga o Ex·05 a aula (P9) e nenhum trecho de 4 ou mais palavras do rótulo e do enunciado aparece no texto de uma aula (regra de 15/11).",
      "Grupo da fonte: \"Bloco B · recorte e qualificação\"."
    ]
  },
  {
    "id": "m08-ex-06",
    "moduloId": "modulo-08",
    "aula": null,
    "origem": "fonte",
    "tipo": "aberto",
    "enunciado": "Dois relatórios mostram a solar com 25% num e 11% noutro, no mesmo ano. Qual está errado?",
    "gabarito": null,
    "referencia": "Provavelmente nenhum. O primeiro é capacidade instalada no conceito amplo; o segundo é geração efetiva. A diferença é exatamente o fator de capacidade da fonte. Como confirmar: verificar unidade — GW contra TWh —, ano-base e universo. Só quando os três coincidirem é que divergência vira erro de uma das fontes.",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "docs/alexandria-v2/extraction/m08/aparato.json",
      "campo": "exercicios.itens[5].enunciado",
      "linha": 1609
    },
    "evidencias": [
      {
        "arquivo": "docs/alexandria-v2/extraction/m08/aparato.json",
        "campo": "exercicios.itens[5].enunciado.texto",
        "linha": 1609,
        "trecho": "Dois relatórios mostram a solar com 25% num e 11% noutro, no mesmo ano. Qual está errado?"
      },
      {
        "arquivo": "docs/alexandria-v2/extraction/m08/aparato.json",
        "campo": "exercicios.itens[5].resposta_de_referencia[0].html",
        "linha": 1609,
        "trecho": "Provavelmente nenhum. O primeiro é capacidade instalada no conceito amplo; o segundo é geração efetiva. A diferença é exatamente o fator de capacidade da fonte."
      },
      {
        "arquivo": "docs/alexandria-v2/extraction/m08/aparato.json",
        "campo": "exercicios.itens[5].resposta_de_referencia[1].html",
        "linha": 1609,
        "trecho": "Como confirmar: verificar unidade — GW contra TWh —, ano-base e universo. Só quando os três coincidirem é que divergência vira erro de uma das fontes."
      }
    ],
    "alertas": [
      "Exercício do módulo: a fonte não liga o Ex·06 a aula (P9) e nenhum trecho de 4 ou mais palavras do rótulo e do enunciado aparece no texto de uma aula (regra de 15/11).",
      "Grupo da fonte: \"Bloco B · recorte e qualificação\"."
    ]
  },
  {
    "id": "m08-ex-07",
    "moduloId": "modulo-08",
    "aula": null,
    "origem": "fonte",
    "tipo": "aberto",
    "enunciado": "A AXIA Energia informa deter 37% das linhas de transmissão do país. Como você lê esse número?",
    "gabarito": null,
    "referencia": "Procure a nota de rodapé antes de reproduzir. No caso concreto, o percentual refere-se ao segmento acima de 230 quilovolts e inclui participações em sociedades de propósito específico — dois qualificadores que mudam o significado da frase. Por que importa: o denominador de participação de mercado divulgada por empresa é quase sempre escolhido, e a escolha é legítima e declarada. O problema nasce quando o qualificador cai na reprodução. A pergunta não é se o número é verdade — é sobre o que ele é verdade.",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "docs/alexandria-v2/extraction/m08/aparato.json",
      "campo": "exercicios.itens[6].enunciado",
      "linha": 1614
    },
    "evidencias": [
      {
        "arquivo": "docs/alexandria-v2/extraction/m08/aparato.json",
        "campo": "exercicios.itens[6].enunciado.texto",
        "linha": 1614,
        "trecho": "A AXIA Energia informa deter 37% das linhas de transmissão do país. Como você lê esse número?"
      },
      {
        "arquivo": "docs/alexandria-v2/extraction/m08/aparato.json",
        "campo": "exercicios.itens[6].resposta_de_referencia[0].html",
        "linha": 1614,
        "trecho": "Procure a nota de rodapé antes de reproduzir. No caso concreto, o percentual refere-se ao segmento acima de 230 quilovolts e inclui participações em sociedades de propósito específico — dois qualificadores que mudam o significado da frase."
      },
      {
        "arquivo": "docs/alexandria-v2/extraction/m08/aparato.json",
        "campo": "exercicios.itens[6].resposta_de_referencia[1].html",
        "linha": 1614,
        "trecho": "Por que importa: o denominador de participação de mercado divulgada por empresa é quase sempre escolhido, e a escolha é legítima e declarada. O problema nasce quando o qualificador cai na reprodução. A pergunta não é se o número é verdade — é sobre o que ele é verdade."
      }
    ],
    "alertas": [
      "Exercício do módulo: a fonte não liga o Ex·07 a aula (P9) e nenhum trecho de 4 ou mais palavras do rótulo e do enunciado aparece no texto de uma aula (regra de 15/11).",
      "Grupo da fonte: \"Bloco B · recorte e qualificação\"."
    ]
  },
  {
    "id": "m08-ex-08",
    "moduloId": "modulo-08",
    "aula": null,
    "origem": "fonte",
    "tipo": "aberto",
    "enunciado": "Uma reportagem diz que a interligação de Roraima ocorreu em 10 de setembro de 2025. Está certo?",
    "gabarito": null,
    "referencia": "Está certo para uma das cinco perguntas possíveis — é a data da cerimônia de início dos testes de energização. A interligação física efetiva foi em 16 de setembro; a operação comercial começou em outubro; a licença de operação é de 3 de setembro; e para fins de comercialização o sistema passou a ser considerado interligado a partir de 1º de janeiro de 2026, por despacho da agência. O que a resposta completa acrescenta: é o recorte da Aula 01 aplicado ao tempo. Citar a data errada para a pergunta certa não é erro factual — é imprecisão que só quem conhece o assunto percebe, e é exatamente por isso que ela vale a pena evitar.",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "docs/alexandria-v2/extraction/m08/aparato.json",
      "campo": "exercicios.itens[7].enunciado",
      "linha": 1619
    },
    "evidencias": [
      {
        "arquivo": "docs/alexandria-v2/extraction/m08/aparato.json",
        "campo": "exercicios.itens[7].enunciado.texto",
        "linha": 1619,
        "trecho": "Uma reportagem diz que a interligação de Roraima ocorreu em 10 de setembro de 2025. Está certo?"
      },
      {
        "arquivo": "docs/alexandria-v2/extraction/m08/aparato.json",
        "campo": "exercicios.itens[7].resposta_de_referencia[0].html",
        "linha": 1619,
        "trecho": "Está certo para uma das cinco perguntas possíveis — é a data da cerimônia de início dos testes de energização. A interligação física efetiva foi em 16 de setembro; a operação comercial começou em outubro; a licença de operação é de 3 de setembro; e para fins de comercialização o sistema passou a ser considerado interligado a partir de 1º de janeiro de 2026, por despacho da agência."
      },
      {
        "arquivo": "docs/alexandria-v2/extraction/m08/aparato.json",
        "campo": "exercicios.itens[7].resposta_de_referencia[1].html",
        "linha": 1619,
        "trecho": "O que a resposta completa acrescenta: é o recorte da Aula 01 aplicado ao tempo. Citar a data errada para a pergunta certa não é erro factual — é imprecisão que só quem conhece o assunto percebe, e é exatamente por isso que ela vale a pena evitar."
      }
    ],
    "alertas": [
      "Exercício do módulo: a fonte não liga o Ex·08 a aula (P9) e nenhum trecho de 4 ou mais palavras do rótulo e do enunciado aparece no texto de uma aula (regra de 15/11).",
      "Grupo da fonte: \"Bloco B · recorte e qualificação\"."
    ]
  },
  {
    "id": "m08-ex-09",
    "moduloId": "modulo-08",
    "aula": null,
    "origem": "fonte",
    "tipo": "aberto",
    "enunciado": "A geração hidrelétrica caiu cerca de 5% num ano e a renovabilidade da matriz elétrica caiu 1,4 ponto. O que aconteceu?",
    "gabarito": null,
    "referencia": "Leitura causal: a energia que a água deixou de produzir foi substituída em parte por renováveis variáveis — solar e eólica cresceram no mesmo ano — e em parte por térmica despachável, com destaque para o gás natural, que cresceu mais de vinte por cento. A parcela térmica fóssil da substituição é o que derruba a renovabilidade. O que a resposta completa acrescenta: a renovabilidade não caiu por decisão de política nem por desmonte de renovável. Caiu por hidrologia. É indicador que oscila com a chuva, e ler queda de renovabilidade como retrocesso de transição energética é erro de atribuição de causa.",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "docs/alexandria-v2/extraction/m08/aparato.json",
      "campo": "exercicios.itens[8].enunciado",
      "linha": 1626
    },
    "evidencias": [
      {
        "arquivo": "docs/alexandria-v2/extraction/m08/aparato.json",
        "campo": "exercicios.itens[8].enunciado.texto",
        "linha": 1626,
        "trecho": "A geração hidrelétrica caiu cerca de 5% num ano e a renovabilidade da matriz elétrica caiu 1,4 ponto. O que aconteceu?"
      },
      {
        "arquivo": "docs/alexandria-v2/extraction/m08/aparato.json",
        "campo": "exercicios.itens[8].resposta_de_referencia[0].html",
        "linha": 1626,
        "trecho": "Leitura causal: a energia que a água deixou de produzir foi substituída em parte por renováveis variáveis — solar e eólica cresceram no mesmo ano — e em parte por térmica despachável, com destaque para o gás natural, que cresceu mais de vinte por cento. A parcela térmica fóssil da substituição é o que derruba a renovabilidade."
      },
      {
        "arquivo": "docs/alexandria-v2/extraction/m08/aparato.json",
        "campo": "exercicios.itens[8].resposta_de_referencia[1].html",
        "linha": 1626,
        "trecho": "O que a resposta completa acrescenta: a renovabilidade não caiu por decisão de política nem por desmonte de renovável. Caiu por hidrologia. É indicador que oscila com a chuva, e ler queda de renovabilidade como retrocesso de transição energética é erro de atribuição de causa."
      }
    ],
    "alertas": [
      "Exercício do módulo: a fonte não liga o Ex·09 a aula (P9) e nenhum trecho de 4 ou mais palavras do rótulo e do enunciado aparece no texto de uma aula (regra de 15/11).",
      "Grupo da fonte: \"Bloco C · leitura de série\"."
    ]
  },
  {
    "id": "m08-ex-11",
    "moduloId": "modulo-08",
    "aula": null,
    "origem": "fonte",
    "tipo": "aberto",
    "enunciado": "O Nordeste aparece com afluência em 59% da média de longo termo e armazenamento em 89% do volume útil. Como você lê isso?",
    "gabarito": null,
    "referencia": "Estoque alto, fluxo fraco. Está entrando bem menos água que o normal para aquele mês, e ainda há muita energia guardada. É situação confortável no presente e em deterioração se o fluxo não se recuperar. O que a resposta completa acrescenta: nenhuma das duas grandezas isolada permite o diagnóstico. Armazenamento sozinho sugere conforto; afluência sozinha sugere alarme. E há uma terceira dimensão — a posição no ciclo anual: estoque alto entrando no período seco tem significado oposto a estoque alto entrando no período úmido.",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "docs/alexandria-v2/extraction/m08/aparato.json",
      "campo": "exercicios.itens[10].enunciado",
      "linha": 1636
    },
    "evidencias": [
      {
        "arquivo": "docs/alexandria-v2/extraction/m08/aparato.json",
        "campo": "exercicios.itens[10].enunciado.texto",
        "linha": 1636,
        "trecho": "O Nordeste aparece com afluência em 59% da média de longo termo e armazenamento em 89% do volume útil. Como você lê isso?"
      },
      {
        "arquivo": "docs/alexandria-v2/extraction/m08/aparato.json",
        "campo": "exercicios.itens[10].resposta_de_referencia[0].html",
        "linha": 1636,
        "trecho": "Estoque alto, fluxo fraco. Está entrando bem menos água que o normal para aquele mês, e ainda há muita energia guardada. É situação confortável no presente e em deterioração se o fluxo não se recuperar."
      },
      {
        "arquivo": "docs/alexandria-v2/extraction/m08/aparato.json",
        "campo": "exercicios.itens[10].resposta_de_referencia[1].html",
        "linha": 1636,
        "trecho": "O que a resposta completa acrescenta: nenhuma das duas grandezas isolada permite o diagnóstico. Armazenamento sozinho sugere conforto; afluência sozinha sugere alarme. E há uma terceira dimensão — a posição no ciclo anual: estoque alto entrando no período seco tem significado oposto a estoque alto entrando no período úmido."
      }
    ],
    "alertas": [
      "Exercício do módulo: a fonte não liga o Ex·11 a aula (P9) e nenhum trecho de 4 ou mais palavras do rótulo e do enunciado aparece no texto de uma aula (regra de 15/11).",
      "Grupo da fonte: \"Bloco C · leitura de série\"."
    ]
  },
  {
    "id": "m08-ex-12",
    "moduloId": "modulo-08",
    "aula": null,
    "origem": "fonte",
    "tipo": "aberto",
    "enunciado": "O consumo do mercado regulado caiu 3,5% e o do livre subiu. O consumo brasileiro caiu?",
    "gabarito": null,
    "referencia": "Não. O consumo total na rede cresceu cerca de 0,9% no ano. A queda do regulado é efeito da migração de consumidores para o ambiente livre, que redistribui consumo entre ambientes contábeis sem alterar o consumo físico. O que a resposta completa acrescenta: para medir consumo real, use o total na rede ou o consumo final do balanço, e declare qual dos dois. Para medir dinâmica de mercado, use a repartição por ambiente. Misturar os dois produz a conclusão errada com dado correto — que é o modo mais difícil de errar de detectar.",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "docs/alexandria-v2/extraction/m08/aparato.json",
      "campo": "exercicios.itens[11].enunciado",
      "linha": 1641
    },
    "evidencias": [
      {
        "arquivo": "docs/alexandria-v2/extraction/m08/aparato.json",
        "campo": "exercicios.itens[11].enunciado.texto",
        "linha": 1641,
        "trecho": "O consumo do mercado regulado caiu 3,5% e o do livre subiu. O consumo brasileiro caiu?"
      },
      {
        "arquivo": "docs/alexandria-v2/extraction/m08/aparato.json",
        "campo": "exercicios.itens[11].resposta_de_referencia[0].html",
        "linha": 1641,
        "trecho": "Não. O consumo total na rede cresceu cerca de 0,9% no ano. A queda do regulado é efeito da migração de consumidores para o ambiente livre, que redistribui consumo entre ambientes contábeis sem alterar o consumo físico."
      },
      {
        "arquivo": "docs/alexandria-v2/extraction/m08/aparato.json",
        "campo": "exercicios.itens[11].resposta_de_referencia[1].html",
        "linha": 1641,
        "trecho": "O que a resposta completa acrescenta: para medir consumo real, use o total na rede ou o consumo final do balanço, e declare qual dos dois. Para medir dinâmica de mercado, use a repartição por ambiente. Misturar os dois produz a conclusão errada com dado correto — que é o modo mais difícil de errar de detectar."
      }
    ],
    "alertas": [
      "Exercício do módulo: a fonte não liga o Ex·12 a aula (P9) e nenhum trecho de 4 ou mais palavras do rótulo e do enunciado aparece no texto de uma aula (regra de 15/11).",
      "Grupo da fonte: \"Bloco C · leitura de série\"."
    ]
  }
];

export const PROVAS: ProvaDoModulo[] = [
  {
    "moduloId": "modulo-08",
    "criterio": "O critério de domínio do módulo é acertar pelo menos 8 de 10 sem consultar.",
    "acertosMinimos": 8,
    "total": 10,
    "questoes": [
      {
        "id": "m08-quiz-q01",
        "enunciado": "Uma fonte tem 25% da pizza de capacidade e 11% da pizza de geração, no mesmo ano e no mesmo universo. O que isso significa?",
        "alternativas": [
          "Que o fator de capacidade dela está abaixo da média ponderada do parque",
          "Que uma das duas estatísticas está errada",
          "Que a fonte teve indisponibilidade excepcional naquele ano",
          "Que a fonte foi cortada por restrição de rede na maior parte do tempo"
        ],
        "correta": 0,
        "explicacao": "A razão entre as duas fatias é o fator de capacidade relativo. Quem está abaixo da média do parque encolhe ao passar de capacidade para geração; quem está acima, cresce. Indisponibilidade e corte também reduzem geração, mas são causas possíveis dentro do fator, não explicações alternativas a ele. (Aula 01)",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m08/aparato.json",
          "campo": "quiz.questoes[0]",
          "linha": 3012
        }
      },
      {
        "id": "m08-quiz-q02",
        "enunciado": "Alguém afirma que o Brasil é 49,5% renovável. Qual é a leitura correta dessa frase?",
        "alternativas": [
          "Está errada: o número correto é próximo de 87%",
          "Refere-se à matriz energética, não à elétrica, e nessa base é plausível",
          "Refere-se apenas à geração centralizada, excluindo distribuída",
          "Refere-se à capacidade instalada, não à geração"
        ],
        "correta": 1,
        "explicacao": "Cerca de metade é a renovabilidade da matriz energética, que inclui combustível de transporte e calor industrial. A matriz elétrica passa de 85%. Trocar uma pela outra é o erro mais audível desta matéria porque muda a conclusão sobre o país inteiro. (Aula 01)",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m08/aparato.json",
          "campo": "quiz.questoes[1]",
          "linha": 3019
        }
      },
      {
        "id": "m08-quiz-q03",
        "enunciado": "O Nordeste apresenta afluência em 59% da média de longo termo e armazenamento em 89% do volume útil. Qual o diagnóstico?",
        "alternativas": [
          "Situação crítica, porque a afluência está muito abaixo da média",
          "Situação normal, porque as duas grandezas se compensam",
          "Situação confortável no presente e em deterioração, porque estoque e fluxo apontam para lados opostos",
          "Impossível: armazenamento alto implica afluência alta"
        ],
        "correta": 2,
        "explicacao": "Afluência é fluxo e armazenamento é estoque, e são grandezas independentes. Estoque alto com fluxo fraco significa que há folga agora e que ela está sendo consumida mais rápido do que reposta. Ler apenas uma das duas produz o diagnóstico errado com confiança. (Aula 04)",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m08/aparato.json",
          "campo": "quiz.questoes[2]",
          "linha": 3026
        }
      },
      {
        "id": "m08-quiz-q04",
        "enunciado": "Em qual patamar horário o corte de geração se concentra no sistema brasileiro, e por quê?",
        "alternativas": [
          "Na ponta noturna, porque a carga é máxima e a rede satura",
          "Na madrugada, porque a carga é mínima e o vento é forte",
          "Nas transições da manhã e da tarde, porque a rampa é acentuada",
          "Entre nove e dezesseis horas, porque a oferta solar é máxima enquanto a carga líquida está no fundo"
        ],
        "correta": 3,
        "explicacao": "É o patamar de maior irradiância. A geração distribuída rebaixa a carga líquida exatamente quando a solar centralizada produz mais, e a hidráulica já está no piso. Na ponta noturna o problema é o oposto: falta potência, não sobra energia. (Aula 03 e Aula 05)",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m08/aparato.json",
          "campo": "quiz.questoes[3]",
          "linha": 3033
        }
      },
      {
        "id": "m08-quiz-q05",
        "enunciado": "Qual é a diferença prática entre corte por confiabilidade elétrica e corte por razão energética?",
        "alternativas": [
          "Nenhuma: são nomes diferentes para a mesma restrição de transmissão",
          "O primeiro se resolve com reforço de rede; o segundo ocorreria mesmo com transmissão infinita",
          "O primeiro atinge eólicas e o segundo atinge fotovoltaicas",
          "O primeiro é remunerado e o segundo não é, em qualquer circunstância"
        ],
        "correta": 1,
        "explicacao": "Confiabilidade é problema de rede: mais linha resolve. Razão energética é problema de balanço carga-geração: a energia não tem para onde ir em lugar nenhum do país naquela hora. Construir transmissão para resolver corte energético é responder à pergunta errada com dinheiro. (Aula 05)",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m08/aparato.json",
          "campo": "quiz.questoes[4]",
          "linha": 3040
        }
      },
      {
        "id": "m08-quiz-q06",
        "enunciado": "O operador simulou o ano de 2024 com geração distribuída igual a zero. O que aconteceu com a restrição por razão energética?",
        "alternativas": [
          "Aumentou, porque a geração centralizada teria de suprir mais carga",
          "Permaneceu praticamente a mesma, porque a causa é a expansão eólica",
          "Caiu pela metade, aproximadamente",
          "Caiu para praticamente zero — de milhares de gigawatt-hora para algumas unidades"
        ],
        "correta": 3,
        "explicacao": "A queda foi quase total. É o resultado que fecha o debate sobre a causa: o corte por razão energética existe porque a geração distribuída rebaixa a carga líquida sem estar sob comando, e o ônus recai integralmente sobre quem está. É problema de desenho de regra, não de tecnologia. (Aula 05)",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m08/aparato.json",
          "campo": "quiz.questoes[5]",
          "linha": 3047
        }
      },
      {
        "id": "m08-quiz-q07",
        "enunciado": "Por que a complementaridade entre a eólica do Nordeste e a hidrologia do Sudeste é considerada eficiente sistemicamente?",
        "alternativas": [
          "Porque a safra dos ventos coincide com o período seco, permitindo poupar água quando ela é mais escassa",
          "Porque o vento e a chuva ocorrem simultaneamente, somando geração",
          "Porque a eólica substitui integralmente a hidráulica em qualquer época",
          "Porque as duas fontes têm o mesmo fator de capacidade"
        ],
        "correta": 0,
        "explicacao": "A defasagem é o valor. Os ventos se fortalecem no segundo semestre, quando os reservatórios do Sudeste/Centro-Oeste estão em depleção. Mas a complementaridade não se converte em benefício físico sem capacidade de intercâmbio — e é aí que ela encontra o limite da Aula 05. (Aula 03)",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m08/aparato.json",
          "campo": "quiz.questoes[6]",
          "linha": 3054
        }
      },
      {
        "id": "m08-quiz-q08",
        "enunciado": "Uma empresa informa deter 37% das linhas de transmissão do país. Qual é a leitura correta?",
        "alternativas": [
          "O número está inflado e deve ser desconsiderado",
          "O percentual refere-se ao segmento acima de 230 quilovolts e inclui participações societárias — o qualificador muda o significado",
          "O percentual refere-se apenas a linhas próprias, sem participações",
          "O percentual refere-se à receita anual permitida, não à extensão"
        ],
        "correta": 1,
        "explicacao": "O denominador de participação de mercado divulgada por empresa é quase sempre escolhido, e a escolha costuma estar declarada em nota de rodapé. O problema nasce quando o qualificador cai na reprodução. A pergunta não é se o número é verdade, é sobre o que ele é verdade. (Aula 05)",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m08/aparato.json",
          "campo": "quiz.questoes[7]",
          "linha": 3061
        }
      },
      {
        "id": "m08-quiz-q09",
        "enunciado": "O pedido de recuperação judicial no caso da Light, no Rio de Janeiro, foi apresentado por quem, e por quê?",
        "alternativas": [
          "Pela distribuidora, com autorização excepcional do regulador",
          "Pelo poder concedente, para preservar a continuidade do serviço",
          "Pela Light S.A., a holding, porque a legislação impede concessionária de serviço público de recorrer ao instrumento enquanto a concessão está ativa",
          "Por credores, em pedido de falência convertido em recuperação"
        ],
        "correta": 2,
        "explicacao": "A distinção não é formalismo: é a razão de o serviço não ter parado. Risco societário e risco de continuidade do serviço são separados por desenho, e essa separação funcionou — o desfecho foi renovação da concessão por trinta anos, com tratamento contratual específico para áreas com furto de energia. (Aula 06)",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m08/aparato.json",
          "campo": "quiz.questoes[8]",
          "linha": 3068
        }
      },
      {
        "id": "m08-quiz-q10",
        "enunciado": "O consumo do mercado regulado caiu 3,5% num ano em que o consumo total na rede cresceu. O que aconteceu?",
        "alternativas": [
          "O consumo físico caiu e o crescimento total é erro de medição",
          "A geração distribuída substituiu consumo da rede regulada",
          "Houve queda de atividade industrial compensada pelo residencial",
          "Consumidores migraram para o ambiente livre, redistribuindo consumo entre ambientes contábeis"
        ],
        "correta": 3,
        "explicacao": "Migração move consumo entre ambientes sem alterar consumo físico. Ler queda do regulado como queda de consumo é erro de leitura, não achado. Para medir consumo real use o total na rede; para medir dinâmica de mercado use a repartição por ambiente — e declare qual dos dois. (Aula 06)",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m08/aparato.json",
          "campo": "quiz.questoes[9]",
          "linha": 3075
        }
      }
    ],
    "faixas": [
      {
        "min": 8,
        "max": 10,
        "mensagem": "Critério de domínio atingido. Passe para o §Voz na ordem: as quarenta perguntas-relâmpago, depois os sete ataques de decisor e por fim o roteiro de dez minutos gravado. E volte ao reconstrutor da Aula 02 uma última vez, sem consultar nada."
      },
      {
        "min": 0,
        "max": 7,
        "mensagem": "Abaixo do critério de 8 em 10. Releia as aulas indicadas nas correções acima — inteiras, não em diagonal — e refaça. Se os erros se concentraram nas questões de recorte, o problema é a Aula 01 e ela precisa ser refeita antes de qualquer outra."
      }
    ],
    "faixasFonte": {
      "arquivo": "docs/alexandria-v2/extraction/m08/aparato.json",
      "campo": "quiz.placar",
      "linha": 3116
    },
    "criterioFonte": {
      "arquivo": "docs/alexandria-v2/extraction/m08/aparato.json",
      "campo": "quiz.lead",
      "linha": 1653
    }
  }
];

export const CHECKLISTS: ChecklistDoModulo[] = [
  {
    "moduloId": "modulo-08",
    "introducao": "Vinte e seis verificações. Responda sem travar e sem consultar. Cada uma que falhar aponta uma aula específica — e a aula é para ser refeita inteira, não consultada em diagonal. O primeiro item é o critério oficial e vale por sozinho.",
    "itens": [
      {
        "id": "m08-checklist-01",
        "texto": "Reconstrói de memória as duas pizzas — capacidade e geração — com a ordem correta e tolerância de três pontos por fonte, e explica cada troca de posição pelo fator de capacidade",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m08/aparato.json",
          "campo": "checklist_final.itens[0].texto",
          "linha": 1786
        }
      },
      {
        "id": "m08-checklist-02",
        "texto": "Enuncia a fórmula do fator de capacidade e explica por que o denominador precisa ser capacidade média e não a de fim de período",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m08/aparato.json",
          "campo": "checklist_final.itens[1].texto",
          "linha": 1787
        }
      },
      {
        "id": "m08-checklist-03",
        "texto": "Distingue capacidade instalada de geração efetiva em uma frase, sem usar a palavra \"produção\" para as duas",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m08/aparato.json",
          "campo": "checklist_final.itens[2].texto",
          "linha": 1788
        }
      },
      {
        "id": "m08-checklist-04",
        "texto": "Diferencia matriz elétrica de matriz energética e cita a ordem de grandeza da diferença de renovabilidade entre elas",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m08/aparato.json",
          "campo": "checklist_final.itens[3].texto",
          "linha": 1789
        }
      },
      {
        "id": "m08-checklist-05",
        "texto": "Cita ao menos três universos distintos de capacidade instalada nacional e o que cada um inclui e exclui",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m08/aparato.json",
          "campo": "checklist_final.itens[4].texto",
          "linha": 1790
        }
      },
      {
        "id": "m08-checklist-06",
        "texto": "Aplica os três eixos — grandeza, escopo e recorte — a qualquer número de matriz antes de aceitá-lo",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m08/aparato.json",
          "campo": "checklist_final.itens[5].texto",
          "linha": 1791
        }
      },
      {
        "id": "m08-checklist-07",
        "texto": "Trata divergência numérica entre fontes primeiro como hipótese de recorte e só depois como erro",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m08/aparato.json",
          "campo": "checklist_final.itens[6].texto",
          "linha": 1792
        }
      },
      {
        "id": "m08-checklist-08",
        "texto": "Descreve o perfil sazonal, o perfil intradiário e o fator de capacidade típico de cada uma das seis fontes",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m08/aparato.json",
          "campo": "checklist_final.itens[7].texto",
          "linha": 1793
        }
      },
      {
        "id": "m08-checklist-09",
        "texto": "Explica por que a solar não tem papel sazonal relevante e por que o vento não tem papel intradiário confiável",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m08/aparato.json",
          "campo": "checklist_final.itens[8].texto",
          "linha": 1794
        }
      },
      {
        "id": "m08-checklist-10",
        "texto": "Nomeia as três safras — chuva, vento e cana — e a defasagem entre elas",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m08/aparato.json",
          "campo": "checklist_final.itens[9].texto",
          "linha": 1795
        }
      },
      {
        "id": "m08-checklist-11",
        "texto": "Explica a complementaridade hidro-eólica-solar nas três escalas sem consultar gráfico",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m08/aparato.json",
          "campo": "checklist_final.itens[10].texto",
          "linha": 1796
        }
      },
      {
        "id": "m08-checklist-12",
        "texto": "Define carga líquida e explica por que ela difere do consumo da sociedade",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m08/aparato.json",
          "campo": "checklist_final.itens[11].texto",
          "linha": 1797
        }
      },
      {
        "id": "m08-checklist-13",
        "texto": "Descreve a depressão do meio-dia e a rampa vespertina pelas próprias propriedades, sem usar apelido importado",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m08/aparato.json",
          "campo": "checklist_final.itens[12].texto",
          "linha": 1798
        }
      },
      {
        "id": "m08-checklist-14",
        "texto": "Nomeia os quatro patamares horários e diz o que caracteriza cada um",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m08/aparato.json",
          "campo": "checklist_final.itens[13].texto",
          "linha": 1799
        }
      },
      {
        "id": "m08-checklist-15",
        "texto": "Explica a assimetria entre sobrar energia no meio do dia e faltar potência no início da noite",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m08/aparato.json",
          "campo": "checklist_final.itens[14].texto",
          "linha": 1800
        }
      },
      {
        "id": "m08-checklist-16",
        "texto": "Distingue afluência de energia armazenada e diagnostica um caso em que as duas apontam para lados opostos",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m08/aparato.json",
          "campo": "checklist_final.itens[15].texto",
          "linha": 1801
        }
      },
      {
        "id": "m08-checklist-17",
        "texto": "Explica o que é a média de longo termo e por que ela é mensal e regionalizada",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m08/aparato.json",
          "campo": "checklist_final.itens[16].texto",
          "linha": 1802
        }
      },
      {
        "id": "m08-checklist-18",
        "texto": "Justifica a existência de um piso de geração hidráulica e relaciona esse piso ao corte de geração",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m08/aparato.json",
          "campo": "checklist_final.itens[17].texto",
          "linha": 1803
        }
      },
      {
        "id": "m08-checklist-19",
        "texto": "Enumera as três causas regulatórias de corte e diz qual delas reforço de rede resolve",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m08/aparato.json",
          "campo": "checklist_final.itens[18].texto",
          "linha": 1804
        }
      },
      {
        "id": "m08-checklist-20",
        "texto": "Explica por que o corte recai sobre a geração centralizada e não sobre a distribuída, e cita o contrafactual do operador",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m08/aparato.json",
          "campo": "checklist_final.itens[19].texto",
          "linha": 1805
        }
      },
      {
        "id": "m08-checklist-21",
        "texto": "Nomeia os três corredores estruturantes, o que cada um resolveu e o risco que cada um criou",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m08/aparato.json",
          "campo": "checklist_final.itens[20].texto",
          "linha": 1806
        }
      },
      {
        "id": "m08-checklist-22",
        "texto": "Explica por que contrato de energia não determina o caminho físico e o que isso implica para exposição de submercado",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m08/aparato.json",
          "campo": "checklist_final.itens[21].texto",
          "linha": 1807
        }
      },
      {
        "id": "m08-checklist-23",
        "texto": "Cita as cinco datas da interligação do último estado e diz a qual pergunta cada uma responde",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m08/aparato.json",
          "campo": "checklist_final.itens[22].texto",
          "linha": 1808
        }
      },
      {
        "id": "m08-checklist-24",
        "texto": "Distingue risco da holding de risco da concessão e explica por que a distribuidora não entra em recuperação judicial",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m08/aparato.json",
          "campo": "checklist_final.itens[23].texto",
          "linha": 1809
        }
      },
      {
        "id": "m08-checklist-25",
        "texto": "Descreve processo administrativo em curso como processo em curso, jamais como desfecho consumado",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m08/aparato.json",
          "campo": "checklist_final.itens[24].texto",
          "linha": 1810
        }
      },
      {
        "id": "m08-checklist-26",
        "texto": "Nomeia as três forças que estão mudando a matriz e, para cada uma, a série pública em que ela deixa rastro",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m08/aparato.json",
          "campo": "checklist_final.itens[25].texto",
          "linha": 1811
        }
      }
    ]
  }
];
