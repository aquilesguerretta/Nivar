// GERADO por tools/alexandria-dados/avaliacao/gerar-avaliacao-m16.mjs — não editar à mão.
// Fonte: docs/alexandria-v2/extraction/m16/aparato.json (fonte, prova, checklist) e o texto das aulas
// em src/lib/data/alexandria-modulo-16-content.ts (derivados). Posse: a sessão de porte do M16.
// 33 itens por aula (16 da fonte, 17 derivados) · 10 questões na prova · 30 itens no checklist.

import type { ChecklistDoModulo, ExercicioDaAula, ExercicioDoModulo, ProvaDoModulo } from '../avaliacao';

export const EXERCICIOS_DAS_AULAS: ExercicioDaAula[] = [
  {
    "id": "m16-a01-d01",
    "moduloId": "modulo-16",
    "aula": 1,
    "origem": "derivado-da-aula",
    "tipo": "escolha",
    "enunciado": "Segundo a aula, qual destes estados produz o único número que descreve carga?",
    "alternativas": [
      "O anúncio",
      "O pedido de acesso",
      "A outorga",
      "A operação"
    ],
    "gabarito": 3,
    "referencia": "E a operação produz o único número que descreve carga: o medido.",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "alternativa-correta",
    "fonte": {
      "arquivo": "src/lib/data/alexandria-modulo-16-content.ts",
      "campo": "MODULO_16_CORPO['aula-16-01'][1]",
      "linha": null
    },
    "evidencias": [
      {
        "arquivo": "src/lib/data/alexandria-modulo-16-content.ts",
        "campo": "MODULO_16_CORPO['aula-16-01'][1]",
        "linha": null,
        "trecho": "E a operação produz o único número que descreve carga: o medido."
      }
    ]
  },
  {
    "id": "m16-a01-d02",
    "moduloId": "modulo-16",
    "aula": 1,
    "origem": "derivado-da-aula",
    "tipo": "aberto",
    "enunciado": "De onde vem, segundo a aula, a distância entre a soma dos pedidos de acesso e a carga que de fato se materializa?",
    "gabarito": null,
    "referencia": "A distorção não vem de má-fé. Vem de assimetria de custo: protocolar um pedido custa quase nada e energizar custa quase tudo.",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "src/lib/data/alexandria-modulo-16-content.ts",
      "campo": "MODULO_16_CORPO['aula-16-01'][2]",
      "linha": null
    },
    "evidencias": [
      {
        "arquivo": "src/lib/data/alexandria-modulo-16-content.ts",
        "campo": "MODULO_16_CORPO['aula-16-01'][2]",
        "linha": null,
        "trecho": "A distorção não vem de má-fé. Vem de assimetria de custo: protocolar um pedido custa quase nada e energizar custa quase tudo."
      }
    ]
  },
  {
    "id": "m16-a01-d03",
    "moduloId": "modulo-16",
    "aula": 1,
    "origem": "derivado-da-aula",
    "tipo": "aberto",
    "enunciado": "Segundo a aula, o que uma queda na fila de pedidos de acesso pode significar, e por quê?",
    "gabarito": null,
    "referencia": "A resposta regulatória típica é exigir garantia vinculada ao pedido, o que converte opção gratuita em opção precificada e reduz o denominador da razão solicitado/energizado sem que a demanda real tenha mudado. Consequência analítica: uma queda na fila de pedidos pode significar aperto de garantia, e não arrefecimento de demanda.",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "src/lib/data/alexandria-modulo-16-content.ts",
      "campo": "MODULO_16_CORPO['aula-16-01'][7]",
      "linha": null
    },
    "evidencias": [
      {
        "arquivo": "src/lib/data/alexandria-modulo-16-content.ts",
        "campo": "MODULO_16_CORPO['aula-16-01'][7]",
        "linha": null,
        "trecho": "A resposta regulatória típica é exigir garantia vinculada ao pedido, o que converte opção gratuita em opção precificada e reduz o denominador da razão solicitado/energizado sem que a demanda real tenha mudado. Consequência analítica: uma queda na fila de pedidos pode significar aperto de garantia, e não arrefecimento de demanda."
      }
    ]
  },
  {
    "id": "m16-ex-08",
    "moduloId": "modulo-16",
    "aula": 2,
    "origem": "fonte",
    "tipo": "aberto",
    "enunciado": "Um relatório lista cinco “desafios” para uma tendência, sem hierarquia. O que está faltando?",
    "gabarito": null,
    "referencia": "<b>A análise.</b> Listar restrições sem dizer qual vincula é recusar-se a fazer o trabalho, porque relaxar uma restrição folgada não altera trajetória nenhuma. A leitura completa exige três coisas: qual candidato vincula hoje, <b>quais explicitamente não vinculam e por quê</b>, e o que precisaria mudar para desvincular. Some-se a isso a data: gargalo se desloca, e resolver a regra costuma transferir a pressão para a conexão.",
    "criterio": "O objetivo não é acertar o número — é produzir a pergunta correta em menos de um minuto.",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "docs/alexandria-v2/extraction/m16/aparato.json",
      "campo": "exercicios.itens[7].enunciado.texto",
      "linha": 3959
    },
    "evidencias": [
      {
        "arquivo": "docs/alexandria-v2/extraction/m16/aparato.json",
        "campo": "exercicios.itens[7].enunciado.texto",
        "linha": 3959,
        "trecho": "Um relatório lista cinco “desafios” para uma tendência, sem hierarquia. O que está faltando?"
      },
      {
        "arquivo": "docs/alexandria-v2/extraction/m16/aparato.json",
        "campo": "exercicios.itens[7].resposta_de_referencia.texto",
        "linha": 3959,
        "trecho": "A análise. Listar restrições sem dizer qual vincula é recusar-se a fazer o trabalho, porque relaxar uma restrição folgada não altera trajetória nenhuma. A leitura completa exige três coisas: qual candidato vincula hoje, quais explicitamente não vinculam e por quê, e o que precisaria mudar para desvincular. Some-se a isso a data: gargalo se desloca, e resolver a regra costuma transferir a pressão para a conexão."
      }
    ],
    "alertas": [
      "Vínculo mecânico: a fonte não prende este exercício a aula; \"desafios\" aparece só na Aula 2."
    ]
  },
  {
    "id": "m16-a02-d01",
    "moduloId": "modulo-16",
    "aula": 2,
    "origem": "derivado-da-aula",
    "tipo": "aberto",
    "enunciado": "Segundo a aula, quando um candidato a gargalo vincula?",
    "gabarito": null,
    "referencia": "Um candidato vincula quando relaxá-lo, sozinho, altera a trajetória.",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "src/lib/data/alexandria-modulo-16-content.ts",
      "campo": "MODULO_16_CORPO['aula-16-02'][1]",
      "linha": null
    },
    "evidencias": [
      {
        "arquivo": "src/lib/data/alexandria-modulo-16-content.ts",
        "campo": "MODULO_16_CORPO['aula-16-02'][1]",
        "linha": null,
        "trecho": "Um candidato vincula quando relaxá-lo, sozinho, altera a trajetória."
      }
    ]
  },
  {
    "id": "m16-ex-05",
    "moduloId": "modulo-16",
    "aula": 3,
    "origem": "fonte",
    "tipo": "aberto",
    "enunciado": "As vendas de veículos com tomada cresceram 125% no semestre. A curva continua?",
    "gabarito": null,
    "referencia": "<b>A pergunta correta é qual restrição vincula.</b> Não é maturidade tecnológica — os veículos existem. Não é conexão à rede no agregado — a carga adicionada é pequena nacionalmente. Não é regra habilitante — a exploração comercial da recarga é livre. <b>Vincula cadeia de suprimento</b>, e há uma data: alíquota de importação de 35% em vigor desde 1º/07/2026. Consequência: a série do segundo semestre não é comparável à do primeiro sem declarar a mudança de regime.",
    "criterio": "O objetivo não é acertar o número — é produzir a pergunta correta em menos de um minuto.",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "docs/alexandria-v2/extraction/m16/aparato.json",
      "campo": "exercicios.itens[4].enunciado.texto",
      "linha": 3929
    },
    "evidencias": [
      {
        "arquivo": "docs/alexandria-v2/extraction/m16/aparato.json",
        "campo": "exercicios.itens[4].enunciado.texto",
        "linha": 3929,
        "trecho": "As vendas de veículos com tomada cresceram 125% no semestre. A curva continua?"
      },
      {
        "arquivo": "docs/alexandria-v2/extraction/m16/aparato.json",
        "campo": "exercicios.itens[4].resposta_de_referencia.texto",
        "linha": 3929,
        "trecho": "A pergunta correta é qual restrição vincula. Não é maturidade tecnológica — os veículos existem. Não é conexão à rede no agregado — a carga adicionada é pequena nacionalmente. Não é regra habilitante — a exploração comercial da recarga é livre. Vincula cadeia de suprimento, e há uma data: alíquota de importação de 35% em vigor desde 1º/07/2026. Consequência: a série do segundo semestre não é comparável à do primeiro sem declarar a mudança de regime."
      }
    ],
    "alertas": [
      "Vínculo mecânico: a fonte não prende este exercício a aula; \"veículos com tomada\" aparece só na Aula 3."
    ]
  },
  {
    "id": "m16-ex-09",
    "moduloId": "modulo-16",
    "aula": 3,
    "origem": "fonte",
    "tipo": "aberto",
    "enunciado": "Cinquenta vans rodam 30.000 km/ano a 0,24 kWh/km, com 10% de perdas de recarga. Quanta energia da rede?",
    "gabarito": null,
    "referencia": "50 × 30.000 × 0,24 = 360.000 kWh nas rodas; dividido por 0,90 de eficiência, <b>400.000 kWh — ou 400 MWh por ano</b>. Duas observações que a conta não mostra e que decidem a leitura: isso é <em>energia</em>, e não diz nada sobre potência; e a perda de recarga entra dividindo, não multiplicando — é energia que sai da rede e não chega à roda.",
    "criterio": "O objetivo não é acertar o número — é produzir a pergunta correta em menos de um minuto.",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "docs/alexandria-v2/extraction/m16/aparato.json",
      "campo": "exercicios.itens[8].enunciado.texto",
      "linha": 3970
    },
    "evidencias": [
      {
        "arquivo": "docs/alexandria-v2/extraction/m16/aparato.json",
        "campo": "exercicios.itens[8].enunciado.texto",
        "linha": 3970,
        "trecho": "Cinquenta vans rodam 30.000 km/ano a 0,24 kWh/km, com 10% de perdas de recarga. Quanta energia da rede?"
      },
      {
        "arquivo": "docs/alexandria-v2/extraction/m16/aparato.json",
        "campo": "exercicios.itens[8].resposta_de_referencia.texto",
        "linha": 3970,
        "trecho": "50 × 30.000 × 0,24 = 360.000 kWh nas rodas; dividido por 0,90 de eficiência, 400.000 kWh — ou 400 MWh por ano. Duas observações que a conta não mostra e que decidem a leitura: isso é energia, e não diz nada sobre potência; e a perda de recarga entra dividindo, não multiplicando — é energia que sai da rede e não chega à roda."
      }
    ],
    "alertas": [
      "Vínculo mecânico: a fonte não prende este exercício a aula; \"recarga\" e \"perdas\" aparece só na Aula 3."
    ]
  },
  {
    "id": "m16-ex-10",
    "moduloId": "modulo-16",
    "aula": 3,
    "origem": "fonte",
    "tipo": "aberto",
    "enunciado": "Quarenta carregadores de 11 kW com coincidência de 35%. Qual a demanda?",
    "gabarito": null,
    "referencia": "40 × 11 × 0,35 = <b>154 kW</b>. A potência nominal somada seria 440 kW, e usá-la como demanda superdimensiona a instalação em quase três vezes. <b>Mas o fator de coincidência não é uma constante</b>: numa garagem de frota com horário único de retorno ele se aproxima de 1, e num condomínio residencial ele é muito menor. Antes de calcular, pergunte o perfil de chegada.",
    "criterio": "O objetivo não é acertar o número — é produzir a pergunta correta em menos de um minuto.",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "docs/alexandria-v2/extraction/m16/aparato.json",
      "campo": "exercicios.itens[9].enunciado.texto",
      "linha": 3978
    },
    "evidencias": [
      {
        "arquivo": "docs/alexandria-v2/extraction/m16/aparato.json",
        "campo": "exercicios.itens[9].enunciado.texto",
        "linha": 3978,
        "trecho": "Quarenta carregadores de 11 kW com coincidência de 35%. Qual a demanda?"
      },
      {
        "arquivo": "docs/alexandria-v2/extraction/m16/aparato.json",
        "campo": "exercicios.itens[9].resposta_de_referencia.texto",
        "linha": 3978,
        "trecho": "40 × 11 × 0,35 = 154 kW. A potência nominal somada seria 440 kW, e usá-la como demanda superdimensiona a instalação em quase três vezes. Mas o fator de coincidência não é uma constante: numa garagem de frota com horário único de retorno ele se aproxima de 1, e num condomínio residencial ele é muito menor. Antes de calcular, pergunte o perfil de chegada."
      }
    ],
    "alertas": [
      "Vínculo mecânico: a fonte não prende este exercício a aula; \"carregadores\" e \"coincidência\" aparece só na Aula 3."
    ]
  },
  {
    "id": "m16-ex-13",
    "moduloId": "modulo-16",
    "aula": 3,
    "origem": "fonte",
    "tipo": "aberto",
    "enunciado": "A frota elétrica vai dobrar a demanda elétrica do país?",
    "gabarito": null,
    "referencia": "<b>Não, e o mesmo número que desmente isso desmente também o oposto.</b> A projeção oficial vai de 627 GWh em 2025 para 7,8 TWh em 2035 — crescimento de mais de doze vezes que, contra 939 TWh de consumo projetado no cenário de referência, representa <b>0,83% do total</b>. Mas “não tem impacto” também está errado: <b>o problema é de potência local</b> — um transformador de bairro, uma garagem de logística —, e nenhum número agregado o revela.",
    "criterio": "O objetivo não é acertar o número — é produzir a pergunta correta em menos de um minuto.",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "docs/alexandria-v2/extraction/m16/aparato.json",
      "campo": "exercicios.itens[12].enunciado.texto",
      "linha": 4004
    },
    "evidencias": [
      {
        "arquivo": "docs/alexandria-v2/extraction/m16/aparato.json",
        "campo": "exercicios.itens[12].enunciado.texto",
        "linha": 4004,
        "trecho": "A frota elétrica vai dobrar a demanda elétrica do país?"
      },
      {
        "arquivo": "docs/alexandria-v2/extraction/m16/aparato.json",
        "campo": "exercicios.itens[12].resposta_de_referencia.texto",
        "linha": 4004,
        "trecho": "Não, e o mesmo número que desmente isso desmente também o oposto. A projeção oficial vai de 627 GWh em 2025 para 7,8 TWh em 2035 — crescimento de mais de doze vezes que, contra 939 TWh de consumo projetado no cenário de referência, representa 0,83% do total. Mas “não tem impacto” também está errado: o problema é de potência local — um transformador de bairro, uma garagem de logística —, e nenhum número agregado o revela."
      }
    ],
    "alertas": [
      "Vínculo mecânico: a fonte não prende este exercício a aula; \"frota elétrica\" aparece só na Aula 3."
    ]
  },
  {
    "id": "m16-a03-d01",
    "moduloId": "modulo-16",
    "aula": 3,
    "origem": "derivado-da-aula",
    "tipo": "escolha",
    "enunciado": "Segundo a aula, a eletrificação de transporte é um problema de quê?",
    "alternativas": [
      "Energia nacional",
      "Potência local",
      "Maturidade tecnológica",
      "Regra habilitante"
    ],
    "gabarito": 1,
    "referencia": "A eletrificação de transporte é um problema de potência local, e não de energia nacional.",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "alternativa-correta",
    "fonte": {
      "arquivo": "src/lib/data/alexandria-modulo-16-content.ts",
      "campo": "MODULO_16_CORPO['aula-16-03'][14]",
      "linha": null
    },
    "evidencias": [
      {
        "arquivo": "src/lib/data/alexandria-modulo-16-content.ts",
        "campo": "MODULO_16_CORPO['aula-16-03'][14]",
        "linha": null,
        "trecho": "A eletrificação de transporte é um problema de potência local, e não de energia nacional."
      }
    ]
  },
  {
    "id": "m16-ex-02",
    "moduloId": "modulo-16",
    "aula": 4,
    "origem": "fonte",
    "tipo": "aberto",
    "enunciado": "“O primeiro leilão de baterias do Brasil aconteceu em 2026.” Verdadeiro em 4 de agosto de 2026?",
    "gabarito": null,
    "referencia": "<b>Não.</b> Em 4 de agosto de 2026 existem diretrizes publicadas — portaria normativa de 1º/06/2026 — e dois certames <em>marcados</em> para 2 e 4 de dezembro de 2026. A afirmação está no futuro. O que <b>já aconteceu</b> é mais importante e menos citado: duas resoluções normativas publicadas em 24/06/2026 criaram outorga, regras de acesso, cobrança pelo uso da rede e regime de penalidades para o armazenamento — e valem independentemente do resultado do certame.",
    "criterio": "O objetivo não é acertar o número — é produzir a pergunta correta em menos de um minuto.",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "docs/alexandria-v2/extraction/m16/aparato.json",
      "campo": "exercicios.itens[1].enunciado.texto",
      "linha": 3897
    },
    "evidencias": [
      {
        "arquivo": "docs/alexandria-v2/extraction/m16/aparato.json",
        "campo": "exercicios.itens[1].enunciado.texto",
        "linha": 3897,
        "trecho": "“O primeiro leilão de baterias do Brasil aconteceu em 2026.” Verdadeiro em 4 de agosto de 2026?"
      },
      {
        "arquivo": "docs/alexandria-v2/extraction/m16/aparato.json",
        "campo": "exercicios.itens[1].resposta_de_referencia.texto",
        "linha": 3897,
        "trecho": "Não. Em 4 de agosto de 2026 existem diretrizes publicadas — portaria normativa de 1º/06/2026 — e dois certames marcados para 2 e 4 de dezembro de 2026. A afirmação está no futuro. O que já aconteceu é mais importante e menos citado: duas resoluções normativas publicadas em 24/06/2026 criaram outorga, regras de acesso, cobrança pelo uso da rede e regime de penalidades para o armazenamento — e valem independentemente do resultado do certame."
      }
    ],
    "alertas": [
      "Vínculo mecânico: a fonte não prende este exercício a aula; \"primeiro leilão\" aparece só na Aula 4."
    ]
  },
  {
    "id": "m16-ex-06",
    "moduloId": "modulo-16",
    "aula": 4,
    "origem": "fonte",
    "tipo": "aberto",
    "enunciado": "O armazenamento no Brasil é limitado pelo custo da bateria?",
    "gabarito": null,
    "referencia": "<b>Não é o candidato que vincula.</b> Vincula o <b>sinal econômico</b>: existe uma fonte de receita contratada — a reserva de capacidade — e nenhum mercado organizado para as demais, enquanto a cobrança pelo uso da rede passou a incidir cumulativamente sobre consumo e injeção. Diagnóstico errado produz recomendação errada com aparência de rigor: se o problema fosse custo de equipamento, a recomendação seria subsidiar compra; sendo remuneração, a recomendação é desenhar produto.",
    "criterio": "O objetivo não é acertar o número — é produzir a pergunta correta em menos de um minuto.",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "docs/alexandria-v2/extraction/m16/aparato.json",
      "campo": "exercicios.itens[5].enunciado.texto",
      "linha": 3940
    },
    "evidencias": [
      {
        "arquivo": "docs/alexandria-v2/extraction/m16/aparato.json",
        "campo": "exercicios.itens[5].enunciado.texto",
        "linha": 3940,
        "trecho": "O armazenamento no Brasil é limitado pelo custo da bateria?"
      },
      {
        "arquivo": "docs/alexandria-v2/extraction/m16/aparato.json",
        "campo": "exercicios.itens[5].resposta_de_referencia.texto",
        "linha": 3940,
        "trecho": "Não é o candidato que vincula. Vincula o sinal econômico: existe uma fonte de receita contratada — a reserva de capacidade — e nenhum mercado organizado para as demais, enquanto a cobrança pelo uso da rede passou a incidir cumulativamente sobre consumo e injeção. Diagnóstico errado produz recomendação errada com aparência de rigor: se o problema fosse custo de equipamento, a recomendação seria subsidiar compra; sendo remuneração, a recomendação é desenhar produto."
      }
    ],
    "alertas": [
      "Vínculo mecânico: a fonte não prende este exercício a aula; \"armazenamento\" e \"limitado\" aparece só na Aula 4."
    ]
  },
  {
    "id": "m16-ex-11",
    "moduloId": "modulo-16",
    "aula": 4,
    "origem": "fonte",
    "tipo": "aberto",
    "enunciado": "Um sistema de 2 MW e 4 MWh, com 90% de profundidade de descarga e eficiência de ciclo de 86%. Quanto ele compra para entregar um ciclo?",
    "gabarito": null,
    "referencia": "Energia útil por ciclo = 4 × 0,90 = <b>3,6 MWh</b> entregues. Energia comprada = 3,6 ÷ 0,86 = <b>4,186 MWh</b>. A duração é 4 ÷ 2 = <b>2 horas</b> — o que já o desqualifica para o produto do certame de dezembro, que exige quatro horas consecutivas na potência máxima. <b>Três grandezas, três conclusões diferentes</b>, e nenhuma delas dedutível das outras duas.",
    "criterio": "O objetivo não é acertar o número — é produzir a pergunta correta em menos de um minuto.",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "docs/alexandria-v2/extraction/m16/aparato.json",
      "campo": "exercicios.itens[10].enunciado.texto",
      "linha": 3987
    },
    "evidencias": [
      {
        "arquivo": "docs/alexandria-v2/extraction/m16/aparato.json",
        "campo": "exercicios.itens[10].enunciado.texto",
        "linha": 3987,
        "trecho": "Um sistema de 2 MW e 4 MWh, com 90% de profundidade de descarga e eficiência de ciclo de 86%. Quanto ele compra para entregar um ciclo?"
      },
      {
        "arquivo": "docs/alexandria-v2/extraction/m16/aparato.json",
        "campo": "exercicios.itens[10].resposta_de_referencia.texto",
        "linha": 3987,
        "trecho": "Energia útil por ciclo = 4 × 0,90 = 3,6 MWh entregues. Energia comprada = 3,6 ÷ 0,86 = 4,186 MWh. A duração é 4 ÷ 2 = 2 horas — o que já o desqualifica para o produto do certame de dezembro, que exige quatro horas consecutivas na potência máxima. Três grandezas, três conclusões diferentes, e nenhuma delas dedutível das outras duas."
      }
    ],
    "alertas": [
      "Vínculo mecânico: a fonte não prende este exercício a aula; \"profundidade de descarga\" e \"eficiência de ciclo\" aparece só na Aula 4."
    ]
  },
  {
    "id": "m16-a04-d01",
    "moduloId": "modulo-16",
    "aula": 4,
    "origem": "derivado-da-aula",
    "tipo": "escolha",
    "enunciado": "Das três grandezas do armazenamento, qual a aula diz que identifica que tipo de ativo é?",
    "alternativas": [
      "Potência",
      "Energia",
      "Duração"
    ],
    "gabarito": 2,
    "referencia": "Duração · h — A razão entre as duas. É a grandeza que identifica que tipo de ativo é",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "alternativa-correta",
    "fonte": {
      "arquivo": "src/lib/data/alexandria-modulo-16-content.ts",
      "campo": "MODULO_16_CORPO['aula-16-04'][2]",
      "linha": null
    },
    "evidencias": [
      {
        "arquivo": "src/lib/data/alexandria-modulo-16-content.ts",
        "campo": "MODULO_16_CORPO['aula-16-04'][2]",
        "linha": null,
        "trecho": "Duração · h — A razão entre as duas. É a grandeza que identifica que tipo de ativo é"
      }
    ]
  },
  {
    "id": "m16-a05-d01",
    "moduloId": "modulo-16",
    "aula": 5,
    "origem": "derivado-da-aula",
    "tipo": "escolha",
    "enunciado": "Quantos componentes integrados formam o sistema de medição inteligente, na proposta em discussão na agência reguladora?",
    "alternativas": [
      "Dois",
      "Três",
      "Quatro",
      "Cinco"
    ],
    "gabarito": 2,
    "referencia": "define o sistema de medição inteligente como uma solução formada por quatro componentes integrados: o medidor, a interface de comunicação com o consumidor, o sistema de comunicação de dados e o sistema de gestão de dados.",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "alternativa-correta",
    "fonte": {
      "arquivo": "src/lib/data/alexandria-modulo-16-content.ts",
      "campo": "MODULO_16_CORPO['aula-16-05'][1]",
      "linha": null
    },
    "evidencias": [
      {
        "arquivo": "src/lib/data/alexandria-modulo-16-content.ts",
        "campo": "MODULO_16_CORPO['aula-16-05'][1]",
        "linha": null,
        "trecho": "define o sistema de medição inteligente como uma solução formada por quatro componentes integrados: o medidor, a interface de comunicação com o consumidor, o sistema de comunicação de dados e o sistema de gestão de dados."
      }
    ]
  },
  {
    "id": "m16-a05-d02",
    "moduloId": "modulo-16",
    "aula": 5,
    "origem": "derivado-da-aula",
    "tipo": "escolha",
    "enunciado": "Segundo a correção de estágio da aula, qual é a posição correta da medição avançada na régua?",
    "alternativas": [
      "Em discussão",
      "Regulada e em implantação inicial",
      "Arquitetura regulatória em formação"
    ],
    "gabarito": 1,
    "referencia": "A posição correta na régua é regulada e em implantação inicial",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "alternativa-correta",
    "fonte": {
      "arquivo": "src/lib/data/alexandria-modulo-16-content.ts",
      "campo": "MODULO_16_CORPO['aula-16-05'][7]",
      "linha": null
    },
    "evidencias": [
      {
        "arquivo": "src/lib/data/alexandria-modulo-16-content.ts",
        "campo": "MODULO_16_CORPO['aula-16-05'][7]",
        "linha": null,
        "trecho": "A posição correta na régua é regulada e em implantação inicial"
      }
    ]
  },
  {
    "id": "m16-a05-d03",
    "moduloId": "modulo-16",
    "aula": 5,
    "origem": "derivado-da-aula",
    "tipo": "aberto",
    "enunciado": "Que contrapartida do lado da demanda a aula diz que precisa acompanhar a medição avançada, e por quê?",
    "gabarito": null,
    "referencia": "A agenda regulatória do biênio prevê tarifa horária obrigatória para consumidores de baixa tensão acima de 1.000 kWh por mês, o que alcança cerca de dois milhóes e meio de unidades consumidoras. Medição sem sinal de preço que varie no tempo não produz flexibilidade — produz um relatório.",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "src/lib/data/alexandria-modulo-16-content.ts",
      "campo": "MODULO_16_CORPO['aula-16-05'][11]",
      "linha": null
    },
    "evidencias": [
      {
        "arquivo": "src/lib/data/alexandria-modulo-16-content.ts",
        "campo": "MODULO_16_CORPO['aula-16-05'][11]",
        "linha": null,
        "trecho": "A agenda regulatória do biênio prevê tarifa horária obrigatória para consumidores de baixa tensão acima de 1.000 kWh por mês, o que alcança cerca de dois milhóes e meio de unidades consumidoras. Medição sem sinal de preço que varie no tempo não produz flexibilidade — produz um relatório."
      }
    ]
  },
  {
    "id": "m16-ex-07",
    "moduloId": "modulo-16",
    "aula": 6,
    "origem": "fonte",
    "tipo": "aberto",
    "enunciado": "Por que a agregação de recursos distribuídos não deslancha, se há 47 GW instalados?",
    "gabarito": null,
    "referencia": "Vincula <b>regra habilitante</b>, e faltam três definições específicas sem as quais não há contrato possível: <b>quem comanda</b> o recurso, <b>quem responde</b> se ele não entregar, e <b>contra qual linha de base</b> se mede o que foi entregue. Repare que medição avançada é pré-requisito e não gargalo independente — resolvê-la sozinha não cria agregador; e que os 47 GW são potência instalada, não recurso comandável.",
    "criterio": "O objetivo não é acertar o número — é produzir a pergunta correta em menos de um minuto.",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "docs/alexandria-v2/extraction/m16/aparato.json",
      "campo": "exercicios.itens[6].enunciado.texto",
      "linha": 3949
    },
    "evidencias": [
      {
        "arquivo": "docs/alexandria-v2/extraction/m16/aparato.json",
        "campo": "exercicios.itens[6].enunciado.texto",
        "linha": 3949,
        "trecho": "Por que a agregação de recursos distribuídos não deslancha, se há 47 GW instalados?"
      },
      {
        "arquivo": "docs/alexandria-v2/extraction/m16/aparato.json",
        "campo": "exercicios.itens[6].resposta_de_referencia.texto",
        "linha": 3949,
        "trecho": "Vincula regra habilitante, e faltam três definições específicas sem as quais não há contrato possível: quem comanda o recurso, quem responde se ele não entregar, e contra qual linha de base se mede o que foi entregue. Repare que medição avançada é pré-requisito e não gargalo independente — resolvê-la sozinha não cria agregador; e que os 47 GW são potência instalada, não recurso comandável."
      }
    ],
    "alertas": [
      "Vínculo mecânico: a fonte não prende este exercício a aula; \"agregação de recursos distribuídos\" e \"47 GW\" aparece só na Aula 6."
    ]
  },
  {
    "id": "m16-a06-d01",
    "moduloId": "modulo-16",
    "aula": 6,
    "origem": "derivado-da-aula",
    "tipo": "aberto",
    "enunciado": "Segundo a aula, onde uma microrrede fecha?",
    "gabarito": null,
    "referencia": "Microrrede não é uma tecnologia procurando aplicação — é uma arquitetura que fecha exatamente onde o custo da energia alternativa é muito alto ou o custo da interrupção é muito alto.",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "src/lib/data/alexandria-modulo-16-content.ts",
      "campo": "MODULO_16_CORPO['aula-16-06'][8]",
      "linha": null
    },
    "evidencias": [
      {
        "arquivo": "src/lib/data/alexandria-modulo-16-content.ts",
        "campo": "MODULO_16_CORPO['aula-16-06'][8]",
        "linha": null,
        "trecho": "Microrrede não é uma tecnologia procurando aplicação — é uma arquitetura que fecha exatamente onde o custo da energia alternativa é muito alto ou o custo da interrupção é muito alto."
      }
    ]
  },
  {
    "id": "m16-a06-d02",
    "moduloId": "modulo-16",
    "aula": 6,
    "origem": "derivado-da-aula",
    "tipo": "aberto",
    "enunciado": "Qual é, segundo a aula, a pergunta que separa material de marketing de desenho de mercado num arranjo que copia um rótulo estrangeiro?",
    "gabarito": null,
    "referencia": "se este arranjo usa a rede e paga menos por ela, quem paga a diferença?",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "src/lib/data/alexandria-modulo-16-content.ts",
      "campo": "MODULO_16_CORPO['aula-16-06'][6]",
      "linha": null
    },
    "evidencias": [
      {
        "arquivo": "src/lib/data/alexandria-modulo-16-content.ts",
        "campo": "MODULO_16_CORPO['aula-16-06'][6]",
        "linha": null,
        "trecho": "se este arranjo usa a rede e paga menos por ela, quem paga a diferença?"
      }
    ]
  },
  {
    "id": "m16-ex-03",
    "moduloId": "modulo-16",
    "aula": 7,
    "origem": "fonte",
    "tipo": "aberto",
    "enunciado": "“O mercado de carbono brasileiro está em formação.” Classifique.",
    "gabarito": null,
    "referencia": "<b>“Em formação” não é um estado</b> — é a ausência de um. Classificando dispositivo por dispositivo: a lei está <em>em vigor</em> desde 12/12/2024; o prazo original de doze meses da fase I está <em>vencido</em> desde 12/12/2025; a prórroga <em>corre</em> até 12/12/2026; o órgão gestor permanente <em>não existe</em>, e a proposta de sua criação é meta até dezembro de 2026; e há uma obrigação setorial específica já correndo desde a entrada em vigor da lei, no setor segurador. Quatro estados diferentes na mesma norma.",
    "criterio": "O objetivo não é acertar o número — é produzir a pergunta correta em menos de um minuto.",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "docs/alexandria-v2/extraction/m16/aparato.json",
      "campo": "exercicios.itens[2].enunciado.texto",
      "linha": 3906
    },
    "evidencias": [
      {
        "arquivo": "docs/alexandria-v2/extraction/m16/aparato.json",
        "campo": "exercicios.itens[2].enunciado.texto",
        "linha": 3906,
        "trecho": "“O mercado de carbono brasileiro está em formação.” Classifique."
      },
      {
        "arquivo": "docs/alexandria-v2/extraction/m16/aparato.json",
        "campo": "exercicios.itens[2].resposta_de_referencia.texto",
        "linha": 3906,
        "trecho": "“Em formação” não é um estado — é a ausência de um. Classificando dispositivo por dispositivo: a lei está em vigor desde 12/12/2024; o prazo original de doze meses da fase I está vencido desde 12/12/2025; a prórroga corre até 12/12/2026; o órgão gestor permanente não existe, e a proposta de sua criação é meta até dezembro de 2026; e há uma obrigação setorial específica já correndo desde a entrada em vigor da lei, no setor segurador. Quatro estados diferentes na mesma norma."
      }
    ],
    "alertas": [
      "Vínculo mecânico: a fonte não prende este exercício a aula; \"em formação\" aparece nas Aulas 1, 2, 5, 7; vai para a última, a 7."
    ]
  },
  {
    "id": "m16-ex-04",
    "moduloId": "modulo-16",
    "aula": 7,
    "origem": "fonte",
    "tipo": "aberto",
    "enunciado": "Um material de 2025 descreve o Brasil como jurisdição de relato de sustentabilidade obrigatório. Está certo?",
    "gabarito": null,
    "referencia": "<b>Estava certo quando foi escrito e está errado agora.</b> A obrigatoriedade valeria a partir dos exercícios iniciados em 1º/01/2026 e foi <b>revogada em maio de 2026</b>, antes de produzir efeito, sendo substituída por regime voluntário de “pratique ou explique”. É o exemplo mais limpo do currículo de uma norma que percorreu três estados em três anos — e a revogação foi muito menos noticiada que a obrigatoriedade, o que torna esse erro frequente e difícil de detectar.",
    "criterio": "O objetivo não é acertar o número — é produzir a pergunta correta em menos de um minuto.",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "docs/alexandria-v2/extraction/m16/aparato.json",
      "campo": "exercicios.itens[3].enunciado.texto",
      "linha": 3917
    },
    "evidencias": [
      {
        "arquivo": "docs/alexandria-v2/extraction/m16/aparato.json",
        "campo": "exercicios.itens[3].enunciado.texto",
        "linha": 3917,
        "trecho": "Um material de 2025 descreve o Brasil como jurisdição de relato de sustentabilidade obrigatório. Está certo?"
      },
      {
        "arquivo": "docs/alexandria-v2/extraction/m16/aparato.json",
        "campo": "exercicios.itens[3].resposta_de_referencia.texto",
        "linha": 3917,
        "trecho": "Estava certo quando foi escrito e está errado agora. A obrigatoriedade valeria a partir dos exercícios iniciados em 1º/01/2026 e foi revogada em maio de 2026, antes de produzir efeito, sendo substituída por regime voluntário de “pratique ou explique”. É o exemplo mais limpo do currículo de uma norma que percorreu três estados em três anos — e a revogação foi muito menos noticiada que a obrigatoriedade, o que torna esse erro frequente e difícil de detectar."
      }
    ],
    "alertas": [
      "Vínculo mecânico: a fonte não prende este exercício a aula; \"jurisdição de relato\" aparece só na Aula 7."
    ]
  },
  {
    "id": "m16-ex-14",
    "moduloId": "modulo-16",
    "aula": 7,
    "origem": "fonte",
    "tipo": "aberto",
    "enunciado": "Uma empresa consome 120 GWh com fator médio de 0,08 tCO2e/MWh e contrata atributo para 60% do consumo. Qual o escopo 2?",
    "gabarito": null,
    "referencia": "<b>Dois números, e os dois estão certos.</b> Pelo método de localização: 120.000 MWh × 0,08 = <b>9.600 tCO2e</b>. Pelo método de mercado, com fator zero para o atributo contratado e fator residual de, digamos, 0,12 para o restante: 48.000 × 0,12 = <b>5.760 tCO2e</b>. A diferença de 3.840 toneladas <b>não é redução física de emissão</b> — a rede emitiu exatamente o mesmo. E repare que aplicar o fator médio em vez do residual ao consumo não coberto subestimaria o resultado.",
    "criterio": "O objetivo não é acertar o número — é produzir a pergunta correta em menos de um minuto.",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "docs/alexandria-v2/extraction/m16/aparato.json",
      "campo": "exercicios.itens[13].enunciado.texto",
      "linha": 4014
    },
    "evidencias": [
      {
        "arquivo": "docs/alexandria-v2/extraction/m16/aparato.json",
        "campo": "exercicios.itens[13].enunciado.texto",
        "linha": 4014,
        "trecho": "Uma empresa consome 120 GWh com fator médio de 0,08 tCO2e/MWh e contrata atributo para 60% do consumo. Qual o escopo 2?"
      },
      {
        "arquivo": "docs/alexandria-v2/extraction/m16/aparato.json",
        "campo": "exercicios.itens[13].resposta_de_referencia.texto",
        "linha": 4014,
        "trecho": "Dois números, e os dois estão certos. Pelo método de localização: 120.000 MWh × 0,08 = 9.600 tCO2e. Pelo método de mercado, com fator zero para o atributo contratado e fator residual de, digamos, 0,12 para o restante: 48.000 × 0,12 = 5.760 tCO2e. A diferença de 3.840 toneladas não é redução física de emissão — a rede emitiu exatamente o mesmo. E repare que aplicar o fator médio em vez do residual ao consumo não coberto subestimaria o resultado."
      }
    ],
    "alertas": [
      "Vínculo mecânico: a fonte não prende este exercício a aula; \"escopo 2\" e \"fator médio\" aparece só na Aula 7.",
      "O padrão do INST·08 (120 GWh, fator médio 0,080) escreve no readout \"Método de localização\" os 9.600 tCO2e da resposta deste exercício. O INST·08 não abre antes da tentativa deste exercício."
    ]
  },
  {
    "id": "m16-a07-d01",
    "moduloId": "modulo-16",
    "aula": 7,
    "origem": "derivado-da-aula",
    "tipo": "aberto",
    "enunciado": "Segundo a aula, comprar atributo ambiental contratado reduz a emissão física? O que a compra muda?",
    "gabarito": null,
    "referencia": "Atributo ambiental contratado não é redução física de emissão. Comprar atributo muda o número reportado pelo método de mercado e não muda um grama do que a rede emitiu naquele ano.",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "src/lib/data/alexandria-modulo-16-content.ts",
      "campo": "MODULO_16_CORPO['aula-16-07'][21]",
      "linha": null
    },
    "evidencias": [
      {
        "arquivo": "src/lib/data/alexandria-modulo-16-content.ts",
        "campo": "MODULO_16_CORPO['aula-16-07'][21]",
        "linha": null,
        "trecho": "Atributo ambiental contratado não é redução física de emissão. Comprar atributo muda o número reportado pelo método de mercado e não muda um grama do que a rede emitiu naquele ano."
      }
    ]
  },
  {
    "id": "m16-ex-01",
    "moduloId": "modulo-16",
    "aula": 8,
    "origem": "fonte",
    "tipo": "aberto",
    "enunciado": "“O Brasil tem 38 GW de data centers a caminho.” Em que estágio está essa afirmação?",
    "gabarito": null,
    "referencia": "<b>Posição 4, e mesmo isso é generoso.</b> O número descreve <em>pedidos de parecer de acesso protocolados</em> — degrau 1 da escada de cinco números. A evidência que a posição 4 exigiria seria compromisso público datado por empreendimento; a que existe é a soma de solicitações administrativas cujo custo de protocolar é próximo de zero. A leitura correta não é sobre carga: é que <b>o gargalo se deslocou para conexão à rede</b>, o que a criação de política específica de gestão da fila confirma.",
    "criterio": "O objetivo não é acertar o número — é produzir a pergunta correta em menos de um minuto.",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "docs/alexandria-v2/extraction/m16/aparato.json",
      "campo": "exercicios.itens[0].enunciado.texto",
      "linha": 3886
    },
    "evidencias": [
      {
        "arquivo": "docs/alexandria-v2/extraction/m16/aparato.json",
        "campo": "exercicios.itens[0].enunciado.texto",
        "linha": 3886,
        "trecho": "“O Brasil tem 38 GW de data centers a caminho.” Em que estágio está essa afirmação?"
      },
      {
        "arquivo": "docs/alexandria-v2/extraction/m16/aparato.json",
        "campo": "exercicios.itens[0].resposta_de_referencia.texto",
        "linha": 3886,
        "trecho": "Posição 4, e mesmo isso é generoso. O número descreve pedidos de parecer de acesso protocolados — degrau 1 da escada de cinco números. A evidência que a posição 4 exigiria seria compromisso público datado por empreendimento; a que existe é a soma de solicitações administrativas cujo custo de protocolar é próximo de zero. A leitura correta não é sobre carga: é que o gargalo se deslocou para conexão à rede, o que a criação de política específica de gestão da fila confirma."
      }
    ],
    "alertas": [
      "Vínculo mecânico: a fonte não prende este exercício a aula; \"38 GW\" aparece só na Aula 8."
    ]
  },
  {
    "id": "m16-ex-12",
    "moduloId": "modulo-16",
    "aula": 8,
    "origem": "fonte",
    "tipo": "aberto",
    "enunciado": "Um centro de dados anuncia 100 MW. Quanta carga isso significa?",
    "gabarito": null,
    "referencia": "<b>Depende de qual 100 MW.</b> Se forem 100 MW de tecnologia da informação, com eficiência de 1,30 e utilização média de 90%: carga média de <b>117 MW</b> e energia anual de <b>1,025 TWh</b>. Se forem 100 MW de potência solicitada no pedido de acesso, a carga média pode ser metade disso ou menos, porque o pedido incorpora redundância e expansão futura. E em nenhum dos dois casos a carga do primeiro ano é essa — a ocupação sobe ao longo de anos.",
    "criterio": "O objetivo não é acertar o número — é produzir a pergunta correta em menos de um minuto.",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "docs/alexandria-v2/extraction/m16/aparato.json",
      "campo": "exercicios.itens[11].enunciado.texto",
      "linha": 3996
    },
    "evidencias": [
      {
        "arquivo": "docs/alexandria-v2/extraction/m16/aparato.json",
        "campo": "exercicios.itens[11].enunciado.texto",
        "linha": 3996,
        "trecho": "Um centro de dados anuncia 100 MW. Quanta carga isso significa?"
      },
      {
        "arquivo": "docs/alexandria-v2/extraction/m16/aparato.json",
        "campo": "exercicios.itens[11].resposta_de_referencia.texto",
        "linha": 3996,
        "trecho": "Depende de qual 100 MW. Se forem 100 MW de tecnologia da informação, com eficiência de 1,30 e utilização média de 90%: carga média de 117 MW e energia anual de 1,025 TWh. Se forem 100 MW de potência solicitada no pedido de acesso, a carga média pode ser metade disso ou menos, porque o pedido incorpora redundância e expansão futura. E em nenhum dos dois casos a carga do primeiro ano é essa — a ocupação sobe ao longo de anos."
      }
    ],
    "alertas": [
      "Vínculo mecânico: a fonte não prende este exercício a aula; \"centro de dados\" e \"anuncia\" aparece só na Aula 8.",
      "Cenário igual ao padrão do INST·09 (100 MW de tecnologia da informação, PUE 1,30, fator de carga 90%): a carga média de 117 MW é o calculado do instrumento. O INST·09 não abre nesse cenário antes da tentativa deste exercício."
    ]
  },
  {
    "id": "m16-a08-d01",
    "moduloId": "modulo-16",
    "aula": 8,
    "origem": "derivado-da-aula",
    "tipo": "aberto",
    "enunciado": "Segundo a aula, por que a maior parte da carga de um centro de dados é rígida?",
    "gabarito": null,
    "referencia": "a maior parte da carga de um centro de dados é rígida por contrato, e não por física. O acordo de nível de serviço com o cliente, o desenho de redundância e a exigência de latência são o que a torna rígida.",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "src/lib/data/alexandria-modulo-16-content.ts",
      "campo": "MODULO_16_CORPO['aula-16-08'][18]",
      "linha": null
    },
    "evidencias": [
      {
        "arquivo": "src/lib/data/alexandria-modulo-16-content.ts",
        "campo": "MODULO_16_CORPO['aula-16-08'][18]",
        "linha": null,
        "trecho": "a maior parte da carga de um centro de dados é rígida por contrato, e não por física. O acordo de nível de serviço com o cliente, o desenho de redundância e a exigência de latência são o que a torna rígida."
      }
    ]
  },
  {
    "id": "m16-a09-d01",
    "moduloId": "modulo-16",
    "aula": 9,
    "origem": "derivado-da-aula",
    "tipo": "escolha",
    "enunciado": "Segundo a aula, em qual das duas coisas o aprendizado estatístico é muito melhor?",
    "alternativas": [
      "Previsão",
      "Decisão"
    ],
    "gabarito": 0,
    "referencia": "Previsão é estimar o que vai acontecer — carga, vento, irradiação, vazão, preço. Decisão é escolher o que fazer dadas as restrições. São problemas de natureza diferente, e o aprendizado estatístico é muito melhor no primeiro do que no segundo.",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "alternativa-correta",
    "fonte": {
      "arquivo": "src/lib/data/alexandria-modulo-16-content.ts",
      "campo": "MODULO_16_CORPO['aula-16-09'][1]",
      "linha": null
    },
    "evidencias": [
      {
        "arquivo": "src/lib/data/alexandria-modulo-16-content.ts",
        "campo": "MODULO_16_CORPO['aula-16-09'][1]",
        "linha": null,
        "trecho": "Previsão é estimar o que vai acontecer — carga, vento, irradiação, vazão, preço. Decisão é escolher o que fazer dadas as restrições. São problemas de natureza diferente, e o aprendizado estatístico é muito melhor no primeiro do que no segundo."
      }
    ]
  },
  {
    "id": "m16-a09-d02",
    "moduloId": "modulo-16",
    "aula": 9,
    "origem": "derivado-da-aula",
    "tipo": "aberto",
    "enunciado": "Qual é, segundo a aula, a ordem correta antes de treinar um modelo sobre dados de medição?",
    "gabarito": null,
    "referencia": "A ordem correta é sempre a mesma: cadastro de ativo, relógio sincronizado, unidade de medida explícita, sinalizadores de qualidade e de estimativa, proprietário declarado do dado — e só então modelo.",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "src/lib/data/alexandria-modulo-16-content.ts",
      "campo": "MODULO_16_CORPO['aula-16-09'][8]",
      "linha": null
    },
    "evidencias": [
      {
        "arquivo": "src/lib/data/alexandria-modulo-16-content.ts",
        "campo": "MODULO_16_CORPO['aula-16-09'][8]",
        "linha": null,
        "trecho": "A ordem correta é sempre a mesma: cadastro de ativo, relógio sincronizado, unidade de medida explícita, sinalizadores de qualidade e de estimativa, proprietário declarado do dado — e só então modelo."
      }
    ]
  },
  {
    "id": "m16-a09-d03",
    "moduloId": "modulo-16",
    "aula": 9,
    "origem": "derivado-da-aula",
    "tipo": "aberto",
    "enunciado": "Segundo a aula, por que a cibersegurança entra na conta econômica da digitalização, e não numa nota técnica?",
    "gabarito": null,
    "referencia": "Um sistema que economiza energia mas permite parada de processo, fraude de medição ou comando indevido pode ter valor esperado negativo, e a conta que ignora isso está incompleta por construção.",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "src/lib/data/alexandria-modulo-16-content.ts",
      "campo": "MODULO_16_CORPO['aula-16-09'][14]",
      "linha": null
    },
    "evidencias": [
      {
        "arquivo": "src/lib/data/alexandria-modulo-16-content.ts",
        "campo": "MODULO_16_CORPO['aula-16-09'][14]",
        "linha": null,
        "trecho": "Um sistema que economiza energia mas permite parada de processo, fraude de medição ou comando indevido pode ter valor esperado negativo, e a conta que ignora isso está incompleta por construção."
      }
    ]
  },
  {
    "id": "m16-ex-15",
    "moduloId": "modulo-16",
    "aula": 10,
    "origem": "fonte",
    "tipo": "aberto",
    "enunciado": "Quais são os elos de captura de valor da eletrificação de transporte, e que três perguntas verificam o elo de operação?",
    "gabarito": null,
    "referencia": "Cinco elos: <b>fabricação e fornecimento</b> de veículo e de equipamento de recarga; <b>instalação e integração</b>, que inclui obra elétrica e conexão; <b>operação e serviço</b>, que é a rede de recarga em si; <b>financiamento</b>, do veículo e do ativo de recarga; e <b>domínio do dado</b>, de sessões, de disponibilidade e de comportamento de recarga. Três perguntas de verificação para o elo de operação, todas com resposta em número: qual a energia entregue por ponto nos últimos doze meses; qual o tempo de indisponibilidade acumulado; e qual a margem por MWh depois de energia, encargos e meios de pagamento.",
    "criterio": "O objetivo não é acertar o número — é produzir a pergunta correta em menos de um minuto.",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "docs/alexandria-v2/extraction/m16/aparato.json",
      "campo": "exercicios.itens[14].enunciado.texto",
      "linha": 4026
    },
    "evidencias": [
      {
        "arquivo": "docs/alexandria-v2/extraction/m16/aparato.json",
        "campo": "exercicios.itens[14].enunciado.texto",
        "linha": 4026,
        "trecho": "Quais são os elos de captura de valor da eletrificação de transporte, e que três perguntas verificam o elo de operação?"
      },
      {
        "arquivo": "docs/alexandria-v2/extraction/m16/aparato.json",
        "campo": "exercicios.itens[14].resposta_de_referencia.texto",
        "linha": 4026,
        "trecho": "Cinco elos: fabricação e fornecimento de veículo e de equipamento de recarga; instalação e integração, que inclui obra elétrica e conexão; operação e serviço, que é a rede de recarga em si; financiamento, do veículo e do ativo de recarga; e domínio do dado, de sessões, de disponibilidade e de comportamento de recarga. Três perguntas de verificação para o elo de operação, todas com resposta em número: qual a energia entregue por ponto nos últimos doze meses; qual o tempo de indisponibilidade acumulado; e qual a margem por MWh depois de energia, encargos e meios de pagamento."
      }
    ],
    "alertas": [
      "Vínculo mecânico: a fonte não prende este exercício a aula; \"elos de captura de valor\" aparece só na Aula 10."
    ]
  },
  {
    "id": "m16-ex-16",
    "moduloId": "modulo-16",
    "aula": 10,
    "origem": "fonte",
    "tipo": "aberto",
    "enunciado": "Um investidor pergunta quais empresas brasileiras estão posicionadas no armazenamento. O que você devolve?",
    "gabarito": null,
    "referencia": "<b>A grade, e depois os nomes — nessa ordem.</b> A grade primeiro porque “posicionada” significa ocupar um elo específico, e uma empresa pode dominar um e ser irrelevante nos outros quatro. Para o armazenamento: quem fabrica célula e quem monta sistema são elos diferentes com barreiras diferentes; quem integra depende de engenharia elétrica e de acesso a ponto de conexão; quem opera depende de sistema de gestão e de competência em mercado de curto prazo; quem financia depende de custo de capital e de leitura de risco regulatório; quem detém o dado de operação e de degradação constrói a única barreira que se acumula. <b>Este ativo não preenche a grade com nomes</b> — e essa recusa é declarada, não omissão: o preenchimento é conversa, e uma lista de nomes envelhece em meses enquanto o método não envelhece.",
    "criterio": "O objetivo não é acertar o número — é produzir a pergunta correta em menos de um minuto.",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "docs/alexandria-v2/extraction/m16/aparato.json",
      "campo": "exercicios.itens[15].enunciado.texto",
      "linha": 4038
    },
    "evidencias": [
      {
        "arquivo": "docs/alexandria-v2/extraction/m16/aparato.json",
        "campo": "exercicios.itens[15].enunciado.texto",
        "linha": 4038,
        "trecho": "Um investidor pergunta quais empresas brasileiras estão posicionadas no armazenamento. O que você devolve?"
      },
      {
        "arquivo": "docs/alexandria-v2/extraction/m16/aparato.json",
        "campo": "exercicios.itens[15].resposta_de_referencia.texto",
        "linha": 4038,
        "trecho": "A grade, e depois os nomes — nessa ordem. A grade primeiro porque “posicionada” significa ocupar um elo específico, e uma empresa pode dominar um e ser irrelevante nos outros quatro. Para o armazenamento: quem fabrica célula e quem monta sistema são elos diferentes com barreiras diferentes; quem integra depende de engenharia elétrica e de acesso a ponto de conexão; quem opera depende de sistema de gestão e de competência em mercado de curto prazo; quem financia depende de custo de capital e de leitura de risco regulatório; quem detém o dado de operação e de degradação constrói a única barreira que se acumula. Este ativo não preenche a grade com nomes — e essa recusa é declarada, não omissão: o preenchimento é conversa, e uma lista de nomes envelhece em meses enquanto o método não envelhece."
      }
    ],
    "alertas": [
      "Vínculo mecânico: a fonte não prende este exercício a aula; \"posicionadas\" e \"armazenamento\" aparece só na Aula 10."
    ]
  },
  {
    "id": "m16-a10-d01",
    "moduloId": "modulo-16",
    "aula": 10,
    "origem": "derivado-da-aula",
    "tipo": "aberto",
    "enunciado": "O que significa, segundo a aula, uma empresa estar “posicionada”?",
    "gabarito": null,
    "referencia": "“Posicionada” significa uma coisa específica: possuir ativo, capacidade, dado, cliente, licença, contrato ou competência que reduza o custo de capturar valor naquele elo específico da cadeia — e não significa que a empresa vencerá.",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "src/lib/data/alexandria-modulo-16-content.ts",
      "campo": "MODULO_16_CORPO['aula-16-10'][1]",
      "linha": null
    },
    "evidencias": [
      {
        "arquivo": "src/lib/data/alexandria-modulo-16-content.ts",
        "campo": "MODULO_16_CORPO['aula-16-10'][1]",
        "linha": null,
        "trecho": "“Posicionada” significa uma coisa específica: possuir ativo, capacidade, dado, cliente, licença, contrato ou competência que reduza o custo de capturar valor naquele elo específico da cadeia — e não significa que a empresa vencerá."
      }
    ]
  }
];

/** Exercícios da fonte sem vínculo mecânico com aula (a aula v3 os mostra na última aula). */
export const EXERCICIOS_DO_MODULO: ExercicioDoModulo[] = [];

export const PROVAS: ProvaDoModulo[] = [
  {
    "moduloId": "modulo-16",
    "criterio": "O critério é oito de dez.",
    "acertosMinimos": 8,
    "total": 10,
    "questoes": [
      {
        "id": "m16-quiz-q01",
        "enunciado": "Em 4 de agosto de 2026, qual é o estado do primeiro certame brasileiro de armazenamento em baterias?",
        "alternativas": [
          "Foi realizado no primeiro semestre de 2026 e contratou potência com suprimento imediato.",
          "Foi cancelado depois da publicação das resoluções normativas de junho.",
          "Não foi realizado: há portaria de diretrizes de 1º/06/2026 e dois certames marcados para 2 e 4 de dezembro de 2026, com suprimento a partir de 1º/08/2028.",
          "Não existe previsão de certame; há apenas discussão em agenda regulatória."
        ],
        "correta": 2,
        "explicacao": "E o mais importante é o que já aconteceu e é menos citado: duas resoluções normativas publicadas em 24/06/2026 criaram outorga, regras de acesso, cobrança pelo uso da rede e regime de penalidades para sistemas de armazenamento — e valem independentemente do resultado do certame. Projeto cadastrado não é vencedor; vencedor não é ativo construído; ativo construído não é automaticamente elegível a todas as receitas.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m16/aparato.json",
          "campo": "avaliacao.perguntas[0]",
          "linha": 5694
        }
      },
      {
        "id": "m16-quiz-q02",
        "enunciado": "Dos 215.023 veículos leves \"eletrificados\" comercializados no primeiro semestre de 2026, quantos acrescentam carga à rede, e por quê?",
        "alternativas": [
          "167.026 — os elétricos a bateria somados aos híbridos plug-in, porque são os que têm tomada externa.",
          "Todos os 215.023, porque toda tração elétrica consome eletricidade.",
          "90.626 — apenas os elétricos a bateria, porque os híbridos plug-in usam predominantemente combustível.",
          "244.961 — os 215.023 somados aos micro-híbridos do período."
        ],
        "correta": 0,
        "explicacao": "O único corte que importa para carga é a tomada externa. Híbridos sem tomada e híbridos flex sem tomada — 47.997 unidades, 22,3% do rótulo — recarregam pelo próprio motor e pela frenagem, e não retiram nada da rede. Micro-híbridos sequer entram no rótulo, mas entram nele em vários materiais. A alternativa três erra por outro lado: venda de híbrido plug-in não garante uso elétrico, mas a categoria consome da rede sempre que é recarregada.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m16/aparato.json",
          "campo": "avaliacao.perguntas[1]",
          "linha": 5701
        }
      },
      {
        "id": "m16-quiz-q03",
        "enunciado": "A projeção oficial leva o consumo da eletromobilidade de 627 GWh em 2025 para 7,8 TWh em 2035. O que se conclui?",
        "alternativas": [
          "Que a frota elétrica dobrará a demanda do país no período.",
          "Que a eletrificação de transporte é irrelevante e não exige nenhuma providência.",
          "Que o crescimento é de mais de doze vezes, o que é suficiente para concluir por impacto sistêmico relevante.",
          "Que, contra 939 TWh de consumo projetado no cenário de referência, isso é 0,83% do total — e que o problema é de potência local, não de energia nacional."
        ],
        "correta": 3,
        "explicacao": "O mesmo número desarma os dois extremos, e é por isso que ele é o mais importante da aula de eletrificação. Um crescimento de mais de doze vezes em dez anos que, no agregado, não move um ponto percentual. Mas o agregado nacional não é onde o problema aparece: ele aparece num transformador de bairro em que trinta veículos chegam entre dezoito e vinte horas, ou numa garagem em que cem veículos conectam ao fim do turno.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m16/aparato.json",
          "campo": "avaliacao.perguntas[2]",
          "linha": 5708
        }
      },
      {
        "id": "m16-quiz-q04",
        "enunciado": "Um sistema de armazenamento de 30 MW e duas horas de duração pode participar do produto contratado nos certames de dezembro de 2026?",
        "alternativas": [
          "Sim: o critério do produto é potência mínima de 30 MW, que ele atende.",
          "Não: o produto exige fornecimento de potência máxima por quatro horas consecutivas, e a duração é parte da definição do ativo.",
          "Sim, desde que opere dois ciclos diários, o que compensa a duração menor.",
          "A pergunta não pode ser respondida sem conhecer a eficiência de ciclo."
        ],
        "correta": 1,
        "explicacao": "É a demonstração mais limpa de que potência, energia e duração são três grandezas. O mesmo MW, com duração diferente, é outro ativo — com função, custo e receita diferentes. O certame exige no mínimo 30 MW capazes de fornecer potência máxima por quatro horas consecutivas, em até dois ciclos diários, limitados a 366 ciclos anuais, com recarga completa em até seis horas. A alternativa quatro testa outra coisa: eficiência de ciclo afeta a economia, não a elegibilidade.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m16/aparato.json",
          "campo": "avaliacao.perguntas[3]",
          "linha": 5715
        }
      },
      {
        "id": "m16-quiz-q05",
        "enunciado": "Sobre a medição avançada no Brasil, em 4 de agosto de 2026:",
        "alternativas": [
          "Não há obrigação regulatória; o tema está inteiramente em discussão em consulta pública.",
          "Há obrigação em vigor e a norma de requisitos técnicos já foi publicada, encerrando o processo.",
          "A obrigação vale apenas para consumidores de alta tensão.",
          "Há obrigação quantificada em vigor desde 1º/03/2026 — 2% das unidades consumidoras por ano, por 24 meses — e a norma de requisitos técnicos mínimos está em consulta até 14/08/2026."
        ],
        "correta": 3,
        "explicacao": "É um caso raro e instrutivo: a obrigação de instalar veio antes da definição do que exatamente instalar, o que explica por que a própria agência antecipou a regulamentação das funcionalidades mínimas e adiou a discussão de custo-benefício para outro processo, com prazo de entrega pelas distribuidoras em 29 de fevereiro de 2028. Classificar o tema como \"em discussão\" é subclassificá-lo — e subclassificar faz perder prazo.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m16/aparato.json",
          "campo": "avaliacao.perguntas[4]",
          "linha": 5722
        }
      },
      {
        "id": "m16-quiz-q06",
        "enunciado": "Qual o estado do prazo da fase I da lei do sistema brasileiro de comércio de emissões?",
        "alternativas": [
          "Vencido: doze meses contados da entrada em vigor em 12/12/2024 esgotaram-se em 12/12/2025, e corre a prórroga prevista na própria lei, até 12/12/2026.",
          "Em curso: os doze meses contam a partir da criação da secretaria em outubro de 2025.",
          "Cumprido: a regulamentação foi concluída com as resoluções do comitê consultivo de maio de 2026.",
          "Inexistente: a lei não fixa prazo para a edição da regulamentação."
        ],
        "correta": 0,
        "explicacao": "A lei entrou em vigor na data da publicação, e é essa informação — que parece formalidade — que permite contar todos os prazos. O quarto estado de política, prazo legal vencido, está expressamente presente aqui. A leitura correta não é \"o sistema está atrasado\", que é juízo: é que o instrumento previu a própria prórroga, ela foi acionada, e resta prazo determinado. Some-se a isso que o órgão gestor permanente não está constituído — sua proposta de criação é meta até dezembro de 2026.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m16/aparato.json",
          "campo": "avaliacao.perguntas[5]",
          "linha": 5729
        }
      },
      {
        "id": "m16-quiz-q07",
        "enunciado": "Uma empresa consome a mesma energia em dois anos consecutivos e reporta emissão de escopo 2 menor no segundo. O que isso permite concluir?",
        "alternativas": [
          "Que houve redução física de emissão na cadeia elétrica.",
          "Nada, isoladamente: o resultado pode vir de contratação de atributo, de variação do fator médio da rede por hidrologia, ou de mudança de método — e nenhuma dessas hipóteses implica alteração do que a rede emitiu.",
          "Que a empresa mudou de método e portanto o relatório está incorreto.",
          "Que a empresa migrou para autoprodução renovável."
        ],
        "correta": 1,
        "explicacao": "Escopo 2 tem dois métodos simultaneamente válidos, e nenhum deles está errado. O baseado em localização usa o fator médio da rede — que no Brasil é baixo e volátil por hidrologia, de modo que a queda pode significar apenas que choveu mais. O baseado em mercado usa os atributos contratados: comprar atributo muda o número reportado e não muda um grama do que a rede emitiu. Os dois fatos são verdadeiros e medem coisas diferentes.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m16/aparato.json",
          "campo": "avaliacao.perguntas[6]",
          "linha": 5736
        }
      },
      {
        "id": "m16-quiz-q08",
        "enunciado": "O ministério setorial informou 38 GW em pedidos de parecer de acesso para centros de dados. Qual a leitura correta?",
        "alternativas": [
          "Que a demanda de centros de dados vai acrescentar 38 GW à carga do país.",
          "Que o número está errado, porque a empresa de planejamento contabiliza 26,3 GW.",
          "Que se trata do primeiro degrau de uma escada de cinco, e que a informação real é o deslocamento do gargalo para conexão à rede.",
          "Que 38 GW devem ser somados aos 26,3 GW para obter o total de interesse."
        ],
        "correta": 2,
        "explicacao": "Solicitado, com parecer emitido, contratado, energizado e consumido são cinco números do mesmo empreendimento, e só o último descreve demanda. A alternativa dois erra por outro caminho: os dois números têm datas, perímetros e horizontes diferentes — um deles inclui hidrogênio e amônia — e nem se contradizem nem se somam. A criação de política específica de gestão da fila de acesso é a evidência direta de que o gargalo é conexão.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m16/aparato.json",
          "campo": "avaliacao.perguntas[7]",
          "linha": 5743
        }
      },
      {
        "id": "m16-quiz-q09",
        "enunciado": "Um interlocutor afirma que \"a inteligência artificial vai resolver o despacho\". Qual a resposta correta?",
        "alternativas": [
          "Separar previsão de decisão: previsão melhora a entrada do problema, e o despacho é um problema de otimização sujeito a restrição física e regulatória antes de ser problema de dado — e devolver a pergunta sobre qual gargalo a ferramenta desvincula.",
          "Concordar: com dados suficientes, modelos estatísticos superam a formulação atual.",
          "Discordar: modelos estatísticos não têm aplicação em operação de sistemas elétricos.",
          "Responder que depende exclusivamente da qualidade da telemetria disponível."
        ],
        "correta": 0,
        "explicacao": "A resposta correta nem confirma nem desmente. Melhorar a previsão de carga ou de geração variável ataca incerteza, e é mensurável contra uma linha de base simples — mas o ganho só se converte em benefício se a regra permitir reduzir reserva por melhoria de previsão. Substituir a decisão esbarra em garantia de viabilidade sob restrição de segurança, auditabilidade e imputação de responsabilidade, que não são subprodutos de acurácia. E vale a declaração de conflito: este é o espaço competitivo do próprio produto que publica o material.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m16/aparato.json",
          "campo": "avaliacao.perguntas[8]",
          "linha": 5750
        }
      },
      {
        "id": "m16-quiz-q10",
        "enunciado": "Um investidor pergunta quais empresas brasileiras estão posicionadas para capturar cada tendência. O que um ativo publicado entrega?",
        "alternativas": [
          "A lista de empresas por tendência, com avaliação de posicionamento de cada uma.",
          "Uma recusa: a pergunta não tem resposta analítica.",
          "A grade de mapeamento por elo de captura de valor, com a capacidade exigida e três perguntas de verificação por elo — e os ocupantes descritos por estrutura.",
          "Apenas a lista dos elos, sem perguntas, porque as perguntas dependem do caso."
        ],
        "correta": 2,
        "explicacao": "\"Posicionada\" significa possuir ativo, capacidade, dado, cliente, licença, contrato ou competência que reduza o custo de capturar valor num elo específico — e não significa que a empresa vencerá. O critério de domínio do bloco pede o mapeamento, e ele se cumpre integralmente na camada de tutoria, onde nomear é livre. O ativo publicado entrega a grade, e a recusa é declarada e não omissão: uma lista de nomes envelhece em meses, o método não.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m16/aparato.json",
          "campo": "avaliacao.perguntas[9]",
          "linha": 5757
        }
      }
    ],
    "faixas": [
      {
        "min": 8,
        "max": 10,
        "mensagem": "Critério atingido. A matéria sustenta uma conversa de uma hora com um desenvolvedor de armazenamento, um diretor industrial avaliando bateria atrás do medidor, um comprador de cadeia global exigindo relato de escopo 2 ou um investidor perguntando quem está posicionado — inclusive a parte mais difícil: recusar as duas conclusões fáceis e devolver estágio, gargalo, conversão em carga e as condições que fariam cada leitura mudar."
      },
      {
        "min": 0,
        "max": 7,
        "mensagem": "Abaixo do critério de oito acertos. Antes de refazer, verifique o padrão do erro: todas estas questões testam estágio — o número descreve o que existe, o que foi autorizado ou o que foi anunciado —, gargalo — qual das cinco restrições vincula, e quais explicitamente não vinculam —, conversão em carga — quantos MW e MWh, e rígida ou flexível — ou base de comparação — o que precisaria ser igual para os dois números serem comparáveis. São esses quatro que um interlocutor do setor identifica na primeira frase."
      }
    ],
    "faixasFonte": {
      "arquivo": "docs/alexandria-v2/extraction/m16/aparato.json",
      "campo": "avaliacao.faixas_de_placar_script",
      "linha": 5797
    },
    "criterioFonte": {
      "arquivo": "docs/alexandria-v2/extraction/m16/aparato.json",
      "campo": "avaliacao.criterio_literal.prosa",
      "linha": 4058
    }
  }
];

export const CHECKLISTS: ChecklistDoModulo[] = [
  {
    "moduloId": "modulo-16",
    "introducao": "Trinta itens — o primeiro em menos de um minuto, o último é uma recusa",
    "itens": [
      {
        "id": "m16-check-01",
        "texto": "Classifico qualquer afirmação sobre o futuro do setor nas cinco posições da régua de estágio em menos de um minuto, e nomeio a evidência que aquela posição exigiria.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m16/aparato.json",
          "campo": "checklist_final.itens[0].texto",
          "linha": 4149
        }
      },
      {
        "id": "m16-check-02",
        "texto": "Declaro que a régua de estágio é construção própria e não norma, sempre que a uso com terceiros.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m16/aparato.json",
          "campo": "checklist_final.itens[1].texto",
          "linha": 4152
        }
      },
      {
        "id": "m16-check-03",
        "texto": "Recuso somar capacidades de estágios diferentes, e explico por que a soma não descreve nada.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m16/aparato.json",
          "campo": "checklist_final.itens[2].texto",
          "linha": 4154
        }
      },
      {
        "id": "m16-check-04",
        "texto": "Diante de um número de capacidade futura, pergunto se ele foi anunciado, solicitado, autorizado, contratado, energizado ou medido — antes de qualquer conta.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m16/aparato.json",
          "campo": "checklist_final.itens[3].texto",
          "linha": 4156
        }
      },
      {
        "id": "m16-check-05",
        "texto": "Reconheço que a mesma tendência pode ocupar duas posições ao mesmo tempo, conforme o objeto classificado, e declaro qual objeto estou classificando.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m16/aparato.json",
          "campo": "checklist_final.itens[4].texto",
          "linha": 4158
        }
      },
      {
        "id": "m16-check-06",
        "texto": "Identifico qual dos cinco candidatos a gargalo vincula, e digo explicitamente quais não vinculam e por quê.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m16/aparato.json",
          "campo": "checklist_final.itens[5].texto",
          "linha": 4160
        }
      },
      {
        "id": "m16-check-07",
        "texto": "Registro a data da classificação de gargalo, porque gargalo se desloca.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m16/aparato.json",
          "campo": "checklist_final.itens[6].texto",
          "linha": 4162
        }
      },
      {
        "id": "m16-check-08",
        "texto": "Reconheço conexão à rede como o candidato mais subestimado, e sei nomear as três razões estruturais disso.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m16/aparato.json",
          "campo": "checklist_final.itens[7].texto",
          "linha": 4163
        }
      },
      {
        "id": "m16-check-09",
        "texto": "Converto qualquer tendência em potência, energia e atributo de flexibilidade antes de concluir qualquer coisa sobre ela.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m16/aparato.json",
          "campo": "checklist_final.itens[8].texto",
          "linha": 4165
        }
      },
      {
        "id": "m16-check-10",
        "texto": "Distingo carga rígida de carga flexível, e sei que flexibilidade tem três parâmetros: janela, penalidade e frequência admissível.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m16/aparato.json",
          "campo": "checklist_final.itens[9].texto",
          "linha": 4167
        }
      },
      {
        "id": "m16-check-11",
        "texto": "Separo veículo com tomada de veículo sem tomada antes de calcular qualquer carga de frota.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m16/aparato.json",
          "campo": "checklist_final.itens[10].texto",
          "linha": 4169
        }
      },
      {
        "id": "m16-check-12",
        "texto": "Faço as duas contas da eletrificação — energia anual e potência coincidente — e pergunto o perfil de recarga antes de responder.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m16/aparato.json",
          "campo": "checklist_final.itens[11].texto",
          "linha": 4171
        }
      },
      {
        "id": "m16-check-13",
        "texto": "Sei que a eletrificação de transporte é problema de potência local e não de energia nacional, e uso o mesmo número para desarmar os dois extremos.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m16/aparato.json",
          "campo": "checklist_final.itens[12].texto",
          "linha": 4173
        }
      },
      {
        "id": "m16-check-14",
        "texto": "Separo número de pontos de recarga, potência instalada de recarga e energia entregue — três grandezas, três conclusões.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m16/aparato.json",
          "campo": "checklist_final.itens[13].texto",
          "linha": 4175
        }
      },
      {
        "id": "m16-check-15",
        "texto": "Nunca cito capacidade de armazenamento sem duração, e explico por que MW sem duração não é número incompleto e sim sem significado.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m16/aparato.json",
          "campo": "checklist_final.itens[14].texto",
          "linha": 4177
        }
      },
      {
        "id": "m16-check-16",
        "texto": "Aplico a eficiência de ciclo no denominador da energia comprada, e calculo o spread mínimo de equilíbrio antes de falar em arbitragem.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m16/aparato.json",
          "campo": "checklist_final.itens[15].texto",
          "linha": 4179
        }
      },
      {
        "id": "m16-check-17",
        "texto": "Recuso concluir sobre um ativo de armazenamento por uma única fonte de receita, e verifico compatibilidade antes de empilhar.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m16/aparato.json",
          "campo": "checklist_final.itens[16].texto",
          "linha": 4181
        }
      },
      {
        "id": "m16-check-18",
        "texto": "Distingo armazenamento atrás e à frente do medidor como dois negócios com clientes, regimes e riscos diferentes.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m16/aparato.json",
          "campo": "checklist_final.itens[17].texto",
          "linha": 4183
        }
      },
      {
        "id": "m16-check-19",
        "texto": "Sei que medição avançada são quatro componentes integrados, e não um medidor.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m16/aparato.json",
          "campo": "checklist_final.itens[18].texto",
          "linha": 4185
        }
      },
      {
        "id": "m16-check-20",
        "texto": "Sei que existe obrigação quantificada de instalação em vigor, e não classifico o tema como “em discussão”.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m16/aparato.json",
          "campo": "checklist_final.itens[19].texto",
          "linha": 4187
        }
      },
      {
        "id": "m16-check-21",
        "texto": "Nomeio as duas disputas reais da medição — quem paga e de quem é o dado — e sei que a primeira é escolha regulatória e não questão técnica.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m16/aparato.json",
          "campo": "checklist_final.itens[20].texto",
          "linha": 4189
        }
      },
      {
        "id": "m16-check-22",
        "texto": "Distingo geração compartilhada, microrrede e comunidade de energia por regime, e não por vocabulário.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m16/aparato.json",
          "campo": "checklist_final.itens[21].texto",
          "linha": 4192
        }
      },
      {
        "id": "m16-check-23",
        "texto": "Aplico os quatro estados de política à lei de 2024 dispositivo por dispositivo, e sei apontar o prazo vencido, a prórroga corrente e o órgão que ainda não existe.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m16/aparato.json",
          "campo": "checklist_final.itens[22].texto",
          "linha": 4194
        }
      },
      {
        "id": "m16-check-24",
        "texto": "Separo crédito regulado de crédito voluntário, e sei que a conversão exige metodologia credenciada, verificação e teto de plano de alocação.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m16/aparato.json",
          "campo": "checklist_final.itens[23].texto",
          "linha": 4197
        }
      },
      {
        "id": "m16-check-25",
        "texto": "Explico por que o mesmo consumo produz dois números de escopo 2, e por que nenhum dos dois está errado.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m16/aparato.json",
          "campo": "checklist_final.itens[24].texto",
          "linha": 4199
        }
      },
      {
        "id": "m16-check-26",
        "texto": "Recuso tratar atributo ambiental contratado como redução física de emissão, e digo as duas verdades separadas.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m16/aparato.json",
          "campo": "checklist_final.itens[25].texto",
          "linha": 4201
        }
      },
      {
        "id": "m16-check-27",
        "texto": "Separo os cinco números de um centro de dados e digo qual deles o interlocutor está usando, antes de qualquer leitura.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m16/aparato.json",
          "campo": "checklist_final.itens[26].texto",
          "linha": 4203
        }
      },
      {
        "id": "m16-check-28",
        "texto": "Cito faixa de cenário como faixa, e nunca o extremo favorável sozinho.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m16/aparato.json",
          "campo": "checklist_final.itens[27].texto",
          "linha": 4205
        }
      },
      {
        "id": "m16-check-29",
        "texto": "Diante de uma comparação — entre jurisdições, entre anos ou entre metodologias —, enumero o que precisaria ser igual, inclusive quando a comparação é favorável.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m16/aparato.json",
          "campo": "checklist_final.itens[28].texto",
          "linha": 4206
        }
      },
      {
        "id": "m16-check-30",
        "texto": "Recuso tanto “isso vai transformar o setor” quanto “isso é só discurso” como conclusões — e devolvo estágio, gargalo vinculante, conversão em carga e as condições que fariam cada leitura mudar.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m16/aparato.json",
          "campo": "checklist_final.itens[29].texto",
          "linha": 4209
        }
      }
    ]
  }
];
