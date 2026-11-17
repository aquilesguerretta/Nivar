// GERADO por tools/alexandria-dados/gerar-avaliacao.mjs — não editar à mão.
// Fonte: docs/alexandria-v2/extraction/m01 (aula-0N.json, aparato.json).
// Itens 'fonte' são literais da extração; itens 'derivado-da-aula' citam o trecho da
// própria aula que os responde (campo `evidencias`). Revisão do Founder pendente para
// os derivados: docs/alexandria-v3/avaliacao-m01.md.
// 28 itens por aula (7 da fonte, 21 derivados) · 10 questões na prova.

import type { ChecklistDoModulo, ExercicioDaAula, ExercicioDoModulo, ProvaDoModulo } from './avaliacao';

export const EXERCICIOS_DAS_AULAS: ExercicioDaAula[] = [
  {
    "id": "m01-ex-01",
    "moduloId": "modulo-01",
    "aula": 1,
    "origem": "fonte",
    "tipo": "aberto",
    "enunciado": "Um motor de 15 kW opera por 8 horas. Qual o consumo em kWh? E se o motor operar 12 horas, o que muda: kW, kWh ou ambos?",
    "gabarito": null,
    "referencia": "Consumo: 15 × 8 = 120 kWh. Operando por 12 horas: 15 × 12 = 180 kWh. O kW (potência) não muda — a máquina continua sendo 15 kW. O que muda é apenas o kWh acumulado, porque o tempo de operação aumentou. Para um gestor industrial: \"a potência da máquina é a mesma; ela só ficou ligada por mais horas\".",
    "criterio": "O critério de domínio é resolver pelo menos seis dos oito sem consulta.",
    "contaParaCriterioDoDrill": true,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "docs/alexandria-v2/extraction/m01/aula-01.json",
      "campo": "exercicios[0].enunciado_texto",
      "linha": 2391
    },
    "evidencias": [
      {
        "arquivo": "docs/alexandria-v2/extraction/m01/aula-01.json",
        "campo": "exercicios[0].enunciado_texto",
        "linha": 2391,
        "trecho": "Um motor de 15 kW opera por 8 horas. Qual o consumo em kWh? E se o motor operar 12 horas, o que muda: kW, kWh ou ambos?"
      },
      {
        "arquivo": "docs/alexandria-v2/extraction/m01/aula-01.json",
        "campo": "exercicios[0].resposta_referencia_texto",
        "linha": 2391,
        "trecho": "Consumo: 15 × 8 = 120 kWh. Operando por 12 horas: 15 × 12 = 180 kWh. O kW (potência) não muda — a máquina continua sendo 15 kW. O que muda é apenas o kWh acumulado, porque o tempo de operação aumentou. Para um gestor industrial: \"a potência da máquina é a mesma; ela só ficou ligada por mais horas\"."
      }
    ]
  },
  {
    "id": "m01-a01-d01",
    "moduloId": "modulo-01",
    "aula": 1,
    "origem": "derivado-da-aula",
    "tipo": "escolha",
    "enunciado": "Segundo a aula, qual é a pergunta que a potência responde?",
    "alternativas": [
      "Quanto foi usado no total?",
      "Com que ritmo está sendo usado agora?",
      "Subiu por kWh, por kW, por horário, por bandeira, por reativo, por imposto, ou por reajuste?"
    ],
    "gabarito": 1,
    "referencia": "Potência responde \"com que ritmo está sendo usado agora?\".",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "alternativa-correta",
    "fonte": {
      "arquivo": "docs/alexandria-v2/extraction/m01/aula-01.json",
      "campo": "blocos[6].texto",
      "linha": 1376
    },
    "evidencias": [
      {
        "arquivo": "docs/alexandria-v2/extraction/m01/aula-01.json",
        "campo": "blocos[6].texto",
        "linha": 1376,
        "trecho": "Potência responde \"com que ritmo está sendo usado agora?\"."
      }
    ]
  },
  {
    "id": "m01-a01-d02",
    "moduloId": "modulo-01",
    "aula": 1,
    "origem": "derivado-da-aula",
    "tipo": "aberto",
    "enunciado": "A aula traz, como erro de fluência, a frase \"A empresa consumiu 500 kW no mês.\" Por que ela está errada, e o que a aula diz que seria o correto?",
    "gabarito": null,
    "referencia": "\"A empresa consumiu 500 kW no mês.\" Errado. Ela demandou 500 kW em algum momento e consumiu X kWh ao longo do mês.",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "docs/alexandria-v2/extraction/m01/aula-01.json",
      "campo": "blocos[17].paragrafos[1].texto",
      "linha": 1455
    },
    "evidencias": [
      {
        "arquivo": "docs/alexandria-v2/extraction/m01/aula-01.json",
        "campo": "blocos[17].paragrafos[1].texto",
        "linha": 1455,
        "trecho": "\"A empresa consumiu 500 kW no mês.\" Errado. Ela demandou 500 kW em algum momento e consumiu X kWh ao longo do mês."
      }
    ]
  },
  {
    "id": "m01-ex-02",
    "moduloId": "modulo-01",
    "aula": 2,
    "origem": "fonte",
    "tipo": "aberto",
    "enunciado": "Um equipamento opera em 220 V e puxa 20 A. Qual a potência aproximada em kW? Se ficar ligado 6 horas, qual o consumo?",
    "gabarito": null,
    "referencia": "Potência: 220 × 20 = 4.400 W = 4,4 kW. Consumo em 6 horas: 4,4 × 6 = 26,4 kWh. Observe a cadeia completa: V × A → W → kW → kWh.",
    "criterio": "O critério de domínio é resolver pelo menos seis dos oito sem consulta.",
    "contaParaCriterioDoDrill": true,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "docs/alexandria-v2/extraction/m01/aula-02.json",
      "campo": "exercicios[0].enunciado_texto",
      "linha": 2400
    },
    "evidencias": [
      {
        "arquivo": "docs/alexandria-v2/extraction/m01/aula-02.json",
        "campo": "exercicios[0].enunciado_texto",
        "linha": 2400,
        "trecho": "Um equipamento opera em 220 V e puxa 20 A. Qual a potência aproximada em kW? Se ficar ligado 6 horas, qual o consumo?"
      },
      {
        "arquivo": "docs/alexandria-v2/extraction/m01/aula-02.json",
        "campo": "exercicios[0].resposta_referencia_texto",
        "linha": 2400,
        "trecho": "Potência: 220 × 20 = 4.400 W = 4,4 kW. Consumo em 6 horas: 4,4 × 6 = 26,4 kWh. Observe a cadeia completa: V × A → W → kW → kWh."
      }
    ]
  },
  {
    "id": "m01-a02-d01",
    "moduloId": "modulo-01",
    "aula": 2,
    "origem": "derivado-da-aula",
    "tipo": "escolha",
    "enunciado": "Na analogia da torneira que a aula usa, a corrente elétrica corresponde a quê?",
    "alternativas": [
      "Pressão da água",
      "Volume",
      "Vazão"
    ],
    "gabarito": 2,
    "referencia": "Se tensão é pressão, corrente é vazão.",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "alternativa-correta",
    "fonte": {
      "arquivo": "docs/alexandria-v2/extraction/m01/aula-02.json",
      "campo": "blocos[6].texto",
      "linha": 1512
    },
    "evidencias": [
      {
        "arquivo": "docs/alexandria-v2/extraction/m01/aula-02.json",
        "campo": "blocos[6].texto",
        "linha": 1512,
        "trecho": "Se tensão é pressão, corrente é vazão."
      }
    ]
  },
  {
    "id": "m01-a02-d02",
    "moduloId": "modulo-01",
    "aula": 2,
    "origem": "derivado-da-aula",
    "tipo": "escolha",
    "enunciado": "Em corrente alternada, qual das três potências \"ocupa a rede sem virar produção\"?",
    "alternativas": [
      "kW",
      "kVA",
      "kVAr"
    ],
    "gabarito": 2,
    "referencia": "kW é o que vira produção; kVAr ocupa a rede sem virar produção; kVA é o que a rede precisa dimensionar.",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "alternativa-correta",
    "fonte": {
      "arquivo": "docs/alexandria-v2/extraction/m01/aula-02.json",
      "campo": "blocos[18].texto",
      "linha": 1578
    },
    "evidencias": [
      {
        "arquivo": "docs/alexandria-v2/extraction/m01/aula-02.json",
        "campo": "blocos[18].texto",
        "linha": 1578,
        "trecho": "kW é o que vira produção; kVAr ocupa a rede sem virar produção; kVA é o que a rede precisa dimensionar."
      }
    ]
  },
  {
    "id": "m01-a03-d01",
    "moduloId": "modulo-01",
    "aula": 3,
    "origem": "derivado-da-aula",
    "tipo": "escolha",
    "enunciado": "Se o consumo aumenta e a geração não acompanha, o que acontece com a frequência da rede?",
    "alternativas": [
      "Oscila sessenta vezes por segundo",
      "A frequência sobe",
      "A frequência da rede cai"
    ],
    "gabarito": 2,
    "referencia": "Se o consumo aumenta e a geração não acompanha, a frequência da rede cai.",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "alternativa-correta",
    "fonte": {
      "arquivo": "docs/alexandria-v2/extraction/m01/aula-03.json",
      "campo": "blocos[13].texto",
      "linha": 1636
    },
    "evidencias": [
      {
        "arquivo": "docs/alexandria-v2/extraction/m01/aula-03.json",
        "campo": "blocos[13].texto",
        "linha": 1636,
        "trecho": "Se o consumo aumenta e a geração não acompanha, a frequência da rede cai."
      }
    ]
  },
  {
    "id": "m01-a03-d02",
    "moduloId": "modulo-01",
    "aula": 3,
    "origem": "derivado-da-aula",
    "tipo": "aberto",
    "enunciado": "Por que a corrente alternada venceu a Guerra das Correntes, segundo a aula?",
    "gabarito": null,
    "referencia": "a corrente alternada venceu por uma razão técnica decisiva: com AC é simples elevar e reduzir tensão usando transformadores. Em DC, o equivalente é tecnologicamente muito mais caro e complexo.",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "docs/alexandria-v2/extraction/m01/aula-03.json",
      "campo": "blocos[7].texto",
      "linha": 1622
    },
    "evidencias": [
      {
        "arquivo": "docs/alexandria-v2/extraction/m01/aula-03.json",
        "campo": "blocos[7].texto",
        "linha": 1622,
        "trecho": "a corrente alternada venceu por uma razão técnica decisiva: com AC é simples elevar e reduzir tensão usando transformadores. Em DC, o equivalente é tecnologicamente muito mais caro e complexo."
      }
    ]
  },
  {
    "id": "m01-a03-d03",
    "moduloId": "modulo-01",
    "aula": 3,
    "origem": "derivado-da-aula",
    "tipo": "escolha",
    "enunciado": "Quantas vezes por dia, segundo a aula, o ONS precisa equilibrar oferta e demanda?",
    "alternativas": [
      "60",
      "86.400",
      "8.760",
      "24"
    ],
    "gabarito": 1,
    "referencia": "Coordena um sistema físico que precisa equilibrar oferta e demanda 86.400 vezes por dia — uma vez por segundo, todos os segundos.",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "alternativa-correta",
    "fonte": {
      "arquivo": "docs/alexandria-v2/extraction/m01/aula-03.json",
      "campo": "blocos[14].texto",
      "linha": 1638
    },
    "evidencias": [
      {
        "arquivo": "docs/alexandria-v2/extraction/m01/aula-03.json",
        "campo": "blocos[14].texto",
        "linha": 1638,
        "trecho": "Coordena um sistema físico que precisa equilibrar oferta e demanda 86.400 vezes por dia — uma vez por segundo, todos os segundos."
      }
    ]
  },
  {
    "id": "m01-a03-d04",
    "moduloId": "modulo-01",
    "aula": 3,
    "origem": "derivado-da-aula",
    "tipo": "aberto",
    "enunciado": "Segundo a aula, que equipamentos sensíveis são afetados por quedas ou desvios relevantes de frequência, e como?",
    "gabarito": null,
    "referencia": "motores síncronos perdem sincronismo, drives de velocidade variável desarmam por proteção, sistemas de controle de processo travam.",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "docs/alexandria-v2/extraction/m01/aula-03.json",
      "campo": "blocos[16].texto",
      "linha": 1644
    },
    "evidencias": [
      {
        "arquivo": "docs/alexandria-v2/extraction/m01/aula-03.json",
        "campo": "blocos[16].texto",
        "linha": 1644,
        "trecho": "motores síncronos perdem sincronismo, drives de velocidade variável desarmam por proteção, sistemas de controle de processo travam."
      }
    ]
  },
  {
    "id": "m01-ex-03",
    "moduloId": "modulo-01",
    "aula": 4,
    "origem": "fonte",
    "tipo": "aberto",
    "enunciado": "Se a corrente em um condutor dobra, o que acontece com as perdas resistivas? Por quê?",
    "gabarito": null,
    "referencia": "As perdas quadruplicam. Como Pperdas = I² × R, se a corrente dobra (×2), o quadrado dela é multiplicado por 4. Mantendo R constante, a perda aumenta 4 vezes. Essa é a justificativa física para transmitir energia em alta tensão: alta tensão permite baixa corrente para a mesma potência, e baixa corrente reduz drasticamente as perdas.",
    "criterio": "O critério de domínio é resolver pelo menos seis dos oito sem consulta.",
    "contaParaCriterioDoDrill": true,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "docs/alexandria-v2/extraction/m01/aula-04.json",
      "campo": "exercicios[0].enunciado_texto",
      "linha": 2409
    },
    "evidencias": [
      {
        "arquivo": "docs/alexandria-v2/extraction/m01/aula-04.json",
        "campo": "exercicios[0].enunciado_texto",
        "linha": 2409,
        "trecho": "Se a corrente em um condutor dobra, o que acontece com as perdas resistivas? Por quê?"
      },
      {
        "arquivo": "docs/alexandria-v2/extraction/m01/aula-04.json",
        "campo": "exercicios[0].resposta_referencia_texto",
        "linha": 2409,
        "trecho": "As perdas quadruplicam. Como Pperdas = I² × R, se a corrente dobra (×2), o quadrado dela é multiplicado por 4. Mantendo R constante, a perda aumenta 4 vezes. Essa é a justificativa física para transmitir energia em alta tensão: alta tensão permite baixa corrente para a mesma potência, e baixa corrente reduz drasticamente as perdas."
      }
    ]
  },
  {
    "id": "m01-a04-d01",
    "moduloId": "modulo-01",
    "aula": 4,
    "origem": "derivado-da-aula",
    "tipo": "escolha",
    "enunciado": "Como a aula chama o fenômeno em que parte da energia elétrica se transforma em calor ao passar por um condutor com resistência?",
    "alternativas": [
      "Lei de Ohm",
      "Efeito Joule",
      "TUSD-fio",
      "UFER"
    ],
    "gabarito": 1,
    "referencia": "parte da energia elétrica se transforma em calor. Isso é dissipação resistiva — o famoso \"efeito Joule\".",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "alternativa-correta",
    "fonte": {
      "arquivo": "docs/alexandria-v2/extraction/m01/aula-04.json",
      "campo": "blocos[2].texto",
      "linha": 1659
    },
    "evidencias": [
      {
        "arquivo": "docs/alexandria-v2/extraction/m01/aula-04.json",
        "campo": "blocos[2].texto",
        "linha": 1659,
        "trecho": "parte da energia elétrica se transforma em calor. Isso é dissipação resistiva — o famoso \"efeito Joule\"."
      }
    ]
  },
  {
    "id": "m01-a04-d02",
    "moduloId": "modulo-01",
    "aula": 4,
    "origem": "derivado-da-aula",
    "tipo": "escolha",
    "enunciado": "Segundo a tabela da aula, qual destes é exemplo de perda não técnica?",
    "alternativas": [
      "Aquecimento de cabos",
      "Perdas em transformadores",
      "Furto de energia",
      "Perdas magnéticas"
    ],
    "gabarito": 2,
    "referencia": "Não técnicas — Comerciais — furto de energia, fraude no medidor, inadimplência, erro de medição",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "alternativa-correta",
    "fonte": {
      "arquivo": "docs/alexandria-v2/extraction/m01/aula-04.json",
      "campo": "blocos[11].linhas[1].celulas[0].texto",
      "linha": 1717
    },
    "evidencias": [
      {
        "arquivo": "docs/alexandria-v2/extraction/m01/aula-04.json",
        "campo": "blocos[11].linhas[1].celulas[0].texto",
        "linha": 1717,
        "trecho": "Não técnicas"
      },
      {
        "arquivo": "docs/alexandria-v2/extraction/m01/aula-04.json",
        "campo": "blocos[11].linhas[1].celulas[1].texto",
        "linha": 1717,
        "trecho": "Comerciais — furto de energia, fraude no medidor, inadimplência, erro de medição"
      }
    ]
  },
  {
    "id": "m01-ex-04",
    "moduloId": "modulo-01",
    "aula": 5,
    "origem": "fonte",
    "tipo": "aberto",
    "enunciado": "Uma empresa consome 144.000 kWh em um mês de 720 horas. Demanda máxima medida foi 800 kW. Calcule demanda média e fator de carga. Como interpretar?",
    "gabarito": null,
    "referencia": "Demanda média: 144.000 ÷ 720 = 200 kW. Fator de carga: 200 ÷ 800 = 0,25 = 25%. Interpretação: fator de carga baixo indica picos elevados em relação ao consumo médio. Pode haver oportunidade de gestão de demanda (sequenciamento, automação, deslocamento), mas não recomende mudança contratual sem ver 12 meses de histórico e entender a operação. O perfil pode ser legitimamente concentrado por razões de processo produtivo.",
    "criterio": "O critério de domínio é resolver pelo menos seis dos oito sem consulta.",
    "contaParaCriterioDoDrill": true,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "docs/alexandria-v2/extraction/m01/aula-05.json",
      "campo": "exercicios[0].enunciado_texto",
      "linha": 2418
    },
    "evidencias": [
      {
        "arquivo": "docs/alexandria-v2/extraction/m01/aula-05.json",
        "campo": "exercicios[0].enunciado_texto",
        "linha": 2418,
        "trecho": "Uma empresa consome 144.000 kWh em um mês de 720 horas. Demanda máxima medida foi 800 kW. Calcule demanda média e fator de carga. Como interpretar?"
      },
      {
        "arquivo": "docs/alexandria-v2/extraction/m01/aula-05.json",
        "campo": "exercicios[0].resposta_referencia_texto",
        "linha": 2418,
        "trecho": "Demanda média: 144.000 ÷ 720 = 200 kW. Fator de carga: 200 ÷ 800 = 0,25 = 25%. Interpretação: fator de carga baixo indica picos elevados em relação ao consumo médio. Pode haver oportunidade de gestão de demanda (sequenciamento, automação, deslocamento), mas não recomende mudança contratual sem ver 12 meses de histórico e entender a operação. O perfil pode ser legitimamente concentrado por razões de processo produtivo."
      }
    ],
    "alertas": [
      "O enunciado é o cenário-padrão do INST·04 (144.000 kWh · 720 h · 800 kW) e o instrumento mostra a resposta no padrão (aula-05.json, instrumentos[0].coincidencia_com_exercicio). O INST·04 não pode abrir nesse cenário antes da tentativa deste exercício."
    ]
  },
  {
    "id": "m01-ex-07",
    "moduloId": "modulo-01",
    "aula": 5,
    "origem": "fonte",
    "tipo": "aberto",
    "enunciado": "Explique \"demanda contratada\" em três versões: para uma criança de 12 anos, para um CFO industrial, e para um especialista de setor.",
    "gabarito": null,
    "referencia": "12 anos: \"É como reservar uma estrada grande o suficiente para o maior trânsito que a fábrica pode causar. Mesmo que a estrada fique vazia a maior parte do tempo, ela precisa estar pronta para o pior momento.\" CFO: \"É a capacidade em kW que a empresa contrata da distribuidora. Se contratar demais, paga capacidade ociosa todo mês. Se contratar de menos, pode pagar ultrapassagem em valor superior. O ajuste exige histórico de 12 meses e entendimento de planos de expansão e sazonalidade.\" Especialista: \"É o montante de demanda, em kW, contratado para faturamento de unidade do Grupo A junto à distribuidora, comparado à demanda medida em intervalos de integração definidos, sujeito às regras da modalidade tarifária aplicável e ao Contrato de Uso do Sistema de Distribuição (CUSD), no contexto regulatório atualmente regido pela REN ANEEL 1.000/2021.\"",
    "criterio": "O critério de domínio é resolver pelo menos seis dos oito sem consulta.",
    "contaParaCriterioDoDrill": true,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "docs/alexandria-v2/extraction/m01/aula-05.json",
      "campo": "exercicios[1].enunciado_texto",
      "linha": 2445
    },
    "evidencias": [
      {
        "arquivo": "docs/alexandria-v2/extraction/m01/aula-05.json",
        "campo": "exercicios[1].enunciado_texto",
        "linha": 2445,
        "trecho": "Explique \"demanda contratada\" em três versões: para uma criança de 12 anos, para um CFO industrial, e para um especialista de setor."
      },
      {
        "arquivo": "docs/alexandria-v2/extraction/m01/aula-05.json",
        "campo": "exercicios[1].resposta_referencia_texto",
        "linha": 2445,
        "trecho": "12 anos: \"É como reservar uma estrada grande o suficiente para o maior trânsito que a fábrica pode causar. Mesmo que a estrada fique vazia a maior parte do tempo, ela precisa estar pronta para o pior momento.\" CFO: \"É a capacidade em kW que a empresa contrata da distribuidora. Se contratar demais, paga capacidade ociosa todo mês. Se contratar de menos, pode pagar ultrapassagem em valor superior. O ajuste exige histórico de 12 meses e entendimento de planos de expansão e sazonalidade.\" Especialista: \"É o montante de demanda, em kW, contratado para faturamento de unidade do Grupo A junto à distribuidora, comparado à demanda medida em intervalos de integração definidos, sujeito às regras da modalidade tarifária aplicável e ao Contrato de Uso do Sistema de Distribuição (CUSD), no contexto regulatório atualmente regido pela REN ANEEL 1.000/2021.\""
      }
    ]
  },
  {
    "id": "m01-a06-d01",
    "moduloId": "modulo-01",
    "aula": 6,
    "origem": "derivado-da-aula",
    "tipo": "aberto",
    "enunciado": "Segundo a aula, qual é a diferença entre a estrutura tarifária do Grupo B e a do Grupo A?",
    "gabarito": null,
    "referencia": "Grupo B paga uma tarifa simples (essencialmente: kWh × tarifa). Grupo A paga uma estrutura tarifária binômia: uma componente para consumo (kWh) e outra para demanda (kW).",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "docs/alexandria-v2/extraction/m01/aula-06.json",
      "campo": "blocos[4].texto",
      "linha": 1851
    },
    "evidencias": [
      {
        "arquivo": "docs/alexandria-v2/extraction/m01/aula-06.json",
        "campo": "blocos[4].texto",
        "linha": 1851,
        "trecho": "Grupo B paga uma tarifa simples (essencialmente: kWh × tarifa). Grupo A paga uma estrutura tarifária binômia: uma componente para consumo (kWh) e outra para demanda (kW)."
      }
    ]
  },
  {
    "id": "m01-a06-d02",
    "moduloId": "modulo-01",
    "aula": 6,
    "origem": "derivado-da-aula",
    "tipo": "aberto",
    "enunciado": "Por que, em geral, quanto mais alta a tensão de fornecimento, menor a tarifa? Cite o que a aula lista.",
    "gabarito": null,
    "referencia": "Quanto mais alta a tensão de fornecimento, mais próximo o consumidor está fisicamente da geração e da transmissão troncal, e menos camadas de rede ele atravessa. Menos perdas técnicas embutidas na sua tarifa; Menos uso de ativos de distribuição de baixa tensão; Menor componente de TUSD comparada à TE.",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "docs/alexandria-v2/extraction/m01/aula-06.json",
      "campo": "blocos[9].texto",
      "linha": 1871
    },
    "evidencias": [
      {
        "arquivo": "docs/alexandria-v2/extraction/m01/aula-06.json",
        "campo": "blocos[9].texto",
        "linha": 1871,
        "trecho": "Quanto mais alta a tensão de fornecimento, mais próximo o consumidor está fisicamente da geração e da transmissão troncal, e menos camadas de rede ele atravessa."
      },
      {
        "arquivo": "docs/alexandria-v2/extraction/m01/aula-06.json",
        "campo": "blocos[10].texto",
        "linha": 1872,
        "trecho": "Menos perdas técnicas embutidas na sua tarifa; Menos uso de ativos de distribuição de baixa tensão; Menor componente de TUSD comparada à TE."
      }
    ]
  },
  {
    "id": "m01-a06-d03",
    "moduloId": "modulo-01",
    "aula": 6,
    "origem": "derivado-da-aula",
    "tipo": "escolha",
    "enunciado": "Qual sistema de fornecimento a aula descreve como \"padrão industrial\"?",
    "alternativas": [
      "Monofásico",
      "Bifásico",
      "Trifásico"
    ],
    "gabarito": 2,
    "referencia": "Trifásico — Padrão industrial; comércios médios e grandes; motores trifásicos",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "alternativa-correta",
    "fonte": {
      "arquivo": "docs/alexandria-v2/extraction/m01/aula-06.json",
      "campo": "blocos[14].linhas[2].celulas[0].texto",
      "linha": 1888
    },
    "evidencias": [
      {
        "arquivo": "docs/alexandria-v2/extraction/m01/aula-06.json",
        "campo": "blocos[14].linhas[2].celulas[0].texto",
        "linha": 1888,
        "trecho": "Trifásico"
      },
      {
        "arquivo": "docs/alexandria-v2/extraction/m01/aula-06.json",
        "campo": "blocos[14].linhas[2].celulas[1].texto",
        "linha": 1888,
        "trecho": "Padrão industrial; comércios médios e grandes; motores trifásicos"
      }
    ]
  },
  {
    "id": "m01-ex-05",
    "moduloId": "modulo-01",
    "aula": 7,
    "origem": "fonte",
    "tipo": "aberto",
    "enunciado": "Uma instalação industrial usa 900 kW de potência ativa e exige 1.000 kVA de potência aparente. Qual o fator de potência? Está dentro do esperado para Grupo A? Qual cuidado antes de recomendar solução?",
    "gabarito": null,
    "referencia": "FP: 900 ÷ 1.000 = 0,90. Está abaixo da referência prática de 0,92 para Grupo A — alerta. Pode haver cobrança por excedente reativo. Cuidado essencial: não recomendar banco de capacitores automaticamente. Antes: verificar causa exata (cargas indutivas? harmônicos?), recorrência, perfil ao longo do dia, presença de cargas não lineares. Compensação excessiva pode criar FP capacitivo, que também é problemático. Solução correta exige diagnóstico técnico estruturado.",
    "criterio": "O critério de domínio é resolver pelo menos seis dos oito sem consulta.",
    "contaParaCriterioDoDrill": true,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "docs/alexandria-v2/extraction/m01/aula-07.json",
      "campo": "exercicios[0].enunciado_texto",
      "linha": 2427
    },
    "evidencias": [
      {
        "arquivo": "docs/alexandria-v2/extraction/m01/aula-07.json",
        "campo": "exercicios[0].enunciado_texto",
        "linha": 2427,
        "trecho": "Uma instalação industrial usa 900 kW de potência ativa e exige 1.000 kVA de potência aparente. Qual o fator de potência? Está dentro do esperado para Grupo A? Qual cuidado antes de recomendar solução?"
      },
      {
        "arquivo": "docs/alexandria-v2/extraction/m01/aula-07.json",
        "campo": "exercicios[0].resposta_referencia_texto",
        "linha": 2427,
        "trecho": "FP: 900 ÷ 1.000 = 0,90. Está abaixo da referência prática de 0,92 para Grupo A — alerta. Pode haver cobrança por excedente reativo. Cuidado essencial: não recomendar banco de capacitores automaticamente. Antes: verificar causa exata (cargas indutivas? harmônicos?), recorrência, perfil ao longo do dia, presença de cargas não lineares. Compensação excessiva pode criar FP capacitivo, que também é problemático. Solução correta exige diagnóstico técnico estruturado."
      }
    ]
  },
  {
    "id": "m01-a07-d01",
    "moduloId": "modulo-01",
    "aula": 7,
    "origem": "derivado-da-aula",
    "tipo": "escolha",
    "enunciado": "Qual destes equipamentos a aula cita como puramente resistivo, com a corrente em fase com a tensão?",
    "alternativas": [
      "Motores",
      "Uma resistência de chuveiro",
      "Transformadores",
      "Compressores"
    ],
    "gabarito": 1,
    "referencia": "Em equipamentos puramente resistivos — uma resistência de chuveiro, uma lâmpada incandescente — a corrente está perfeitamente em fase com a tensão.",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "alternativa-correta",
    "fonte": {
      "arquivo": "docs/alexandria-v2/extraction/m01/aula-07.json",
      "campo": "blocos[2].texto",
      "linha": 1908
    },
    "evidencias": [
      {
        "arquivo": "docs/alexandria-v2/extraction/m01/aula-07.json",
        "campo": "blocos[2].texto",
        "linha": 1908,
        "trecho": "Em equipamentos puramente resistivos — uma resistência de chuveiro, uma lâmpada incandescente — a corrente está perfeitamente em fase com a tensão."
      }
    ]
  },
  {
    "id": "m01-a07-d02",
    "moduloId": "modulo-01",
    "aula": 7,
    "origem": "derivado-da-aula",
    "tipo": "aberto",
    "enunciado": "Segundo a aula, por que o fator de potência baixo de uma instalação afeta outros clientes da mesma rede?",
    "gabarito": null,
    "referencia": "ela força a distribuidora a entregar mais kVA para produzir o mesmo kW útil. Isso ocupa capacidade de transformadores, cabos e proteção, além de aumentar perdas — externalidades que afetam todos os outros clientes daquela rede.",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "docs/alexandria-v2/extraction/m01/aula-07.json",
      "campo": "blocos[13].texto",
      "linha": 1984
    },
    "evidencias": [
      {
        "arquivo": "docs/alexandria-v2/extraction/m01/aula-07.json",
        "campo": "blocos[13].texto",
        "linha": 1984,
        "trecho": "ela força a distribuidora a entregar mais kVA para produzir o mesmo kW útil. Isso ocupa capacidade de transformadores, cabos e proteção, além de aumentar perdas — externalidades que afetam todos os outros clientes daquela rede."
      }
    ]
  },
  {
    "id": "m01-ex-06",
    "moduloId": "modulo-01",
    "aula": 8,
    "origem": "fonte",
    "tipo": "aberto",
    "enunciado": "Uma usina solar de 50 MW gerou 131.400 MWh em um ano (8.760 horas). Calcule o fator de capacidade. É um número razoável para solar no Brasil?",
    "gabarito": null,
    "referencia": "Geração máxima teórica: 50 × 8.760 = 438.000 MWh. FC: 131.400 ÷ 438.000 = 0,30 = 30%. Interpretação: 30% é um pouco acima da média típica brasileira (~20–28%) — sugere usina bem localizada (Nordeste ou regiões de alta irradiação) e/ou tecnologia mais moderna com tracker solar. Para comparação: hidrelétrica brasileira média opera em torno de 50% de FC; nuclear opera 85–95%; térmica peaker pode ficar abaixo de 15%.",
    "criterio": "O critério de domínio é resolver pelo menos seis dos oito sem consulta.",
    "contaParaCriterioDoDrill": true,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "docs/alexandria-v2/extraction/m01/aula-08.json",
      "campo": "exercicios[0].enunciado_texto",
      "linha": 2436
    },
    "evidencias": [
      {
        "arquivo": "docs/alexandria-v2/extraction/m01/aula-08.json",
        "campo": "exercicios[0].enunciado_texto",
        "linha": 2436,
        "trecho": "Uma usina solar de 50 MW gerou 131.400 MWh em um ano (8.760 horas). Calcule o fator de capacidade. É um número razoável para solar no Brasil?"
      },
      {
        "arquivo": "docs/alexandria-v2/extraction/m01/aula-08.json",
        "campo": "exercicios[0].resposta_referencia_texto",
        "linha": 2436,
        "trecho": "Geração máxima teórica: 50 × 8.760 = 438.000 MWh. FC: 131.400 ÷ 438.000 = 0,30 = 30%. Interpretação: 30% é um pouco acima da média típica brasileira (~20–28%) — sugere usina bem localizada (Nordeste ou regiões de alta irradiação) e/ou tecnologia mais moderna com tracker solar. Para comparação: hidrelétrica brasileira média opera em torno de 50% de FC; nuclear opera 85–95%; térmica peaker pode ficar abaixo de 15%."
      }
    ],
    "alertas": [
      "A referência cita faixas de fator de capacidade que a pendência QA-FCap-01 (P20) ainda não verificou. Literal da fonte; não vira verdade transversal."
    ]
  },
  {
    "id": "m01-a08-d01",
    "moduloId": "modulo-01",
    "aula": 8,
    "origem": "derivado-da-aula",
    "tipo": "escolha",
    "enunciado": "Em que unidade a aula diz que a geração efetiva é medida?",
    "alternativas": [
      "MW",
      "kVA",
      "MWh",
      "%"
    ],
    "gabarito": 2,
    "referencia": "Geração efetiva é o que a usina realmente produziu em um período, medido em MWh.",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "alternativa-correta",
    "fonte": {
      "arquivo": "docs/alexandria-v2/extraction/m01/aula-08.json",
      "campo": "blocos[3].texto",
      "linha": 2016
    },
    "evidencias": [
      {
        "arquivo": "docs/alexandria-v2/extraction/m01/aula-08.json",
        "campo": "blocos[3].texto",
        "linha": 2016,
        "trecho": "Geração efetiva é o que a usina realmente produziu em um período, medido em MWh."
      }
    ]
  },
  {
    "id": "m01-a08-d02",
    "moduloId": "modulo-01",
    "aula": 8,
    "origem": "derivado-da-aula",
    "tipo": "aberto",
    "enunciado": "Segundo a aula, por que uma usina não gera sua capacidade instalada o tempo todo? Dê os exemplos que a aula traz.",
    "gabarito": null,
    "referencia": "A solar não gera à noite. A eólica depende do vento. A hidrelétrica depende de chuva e reservatório. A térmica depende de combustível disponível e despacho do sistema.",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "docs/alexandria-v2/extraction/m01/aula-08.json",
      "campo": "blocos[3].texto",
      "linha": 2016
    },
    "evidencias": [
      {
        "arquivo": "docs/alexandria-v2/extraction/m01/aula-08.json",
        "campo": "blocos[3].texto",
        "linha": 2016,
        "trecho": "A solar não gera à noite. A eólica depende do vento. A hidrelétrica depende de chuva e reservatório. A térmica depende de combustível disponível e despacho do sistema."
      }
    ]
  },
  {
    "id": "m01-a09-d01",
    "moduloId": "modulo-01",
    "aula": 9,
    "origem": "derivado-da-aula",
    "tipo": "escolha",
    "enunciado": "Segundo a tabela das três dimensões da qualidade, a qual delas pertencem os indicadores DEC e FEC?",
    "alternativas": [
      "Qualidade do produto (tensão)",
      "Qualidade comercial",
      "Qualidade do serviço (continuidade)"
    ],
    "gabarito": 2,
    "referencia": "Qualidade do serviço (continuidade) — DEC, FEC (coletivos) · DIC, FIC, DMIC, DICRI (individuais)",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "alternativa-correta",
    "fonte": {
      "arquivo": "docs/alexandria-v2/extraction/m01/aula-09.json",
      "campo": "blocos[3].linhas[0].celulas[0].texto",
      "linha": 2114
    },
    "evidencias": [
      {
        "arquivo": "docs/alexandria-v2/extraction/m01/aula-09.json",
        "campo": "blocos[3].linhas[0].celulas[0].texto",
        "linha": 2114,
        "trecho": "Qualidade do serviço (continuidade)"
      },
      {
        "arquivo": "docs/alexandria-v2/extraction/m01/aula-09.json",
        "campo": "blocos[3].linhas[0].celulas[2].texto",
        "linha": 2114,
        "trecho": "DEC, FEC (coletivos) · DIC, FIC, DMIC, DICRI (individuais)"
      }
    ]
  },
  {
    "id": "m01-a09-d02",
    "moduloId": "modulo-01",
    "aula": 9,
    "origem": "derivado-da-aula",
    "tipo": "escolha",
    "enunciado": "Na tabela de indicadores de continuidade, o que mede o FEC?",
    "alternativas": [
      "Tempo total médio de interrupção por consumidor no ano (em horas)",
      "Maior interrupção individual no período",
      "Número médio de interrupções por consumidor no ano",
      "Número de interrupções naquela unidade no período"
    ],
    "gabarito": 2,
    "referencia": "FEC — Frequência Equivalente de interrupção por unidade Consumidora — Número médio de interrupções por consumidor no ano",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "alternativa-correta",
    "fonte": {
      "arquivo": "docs/alexandria-v2/extraction/m01/aula-09.json",
      "campo": "blocos[5].linhas[1].celulas[0].texto",
      "linha": 2127
    },
    "evidencias": [
      {
        "arquivo": "docs/alexandria-v2/extraction/m01/aula-09.json",
        "campo": "blocos[5].linhas[1].celulas[0].texto",
        "linha": 2127,
        "trecho": "FEC"
      },
      {
        "arquivo": "docs/alexandria-v2/extraction/m01/aula-09.json",
        "campo": "blocos[5].linhas[1].celulas[1].texto",
        "linha": 2127,
        "trecho": "Frequência Equivalente de interrupção por unidade Consumidora"
      },
      {
        "arquivo": "docs/alexandria-v2/extraction/m01/aula-09.json",
        "campo": "blocos[5].linhas[1].celulas[2].texto",
        "linha": 2127,
        "trecho": "Número médio de interrupções por consumidor no ano"
      }
    ]
  },
  {
    "id": "m01-a09-d03",
    "moduloId": "modulo-01",
    "aula": 9,
    "origem": "derivado-da-aula",
    "tipo": "escolha",
    "enunciado": "Qual fenômeno a aula descreve como \"queda rápida e temporária da tensão\"?",
    "alternativas": [
      "Sobretensão",
      "Harmônicos",
      "Flicker (flutuação de tensão)",
      "Afundamento de tensão (voltage sag)"
    ],
    "gabarito": 3,
    "referencia": "Afundamento de tensão (voltage sag) — Queda rápida e temporária da tensão",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "alternativa-correta",
    "fonte": {
      "arquivo": "docs/alexandria-v2/extraction/m01/aula-09.json",
      "campo": "blocos[8].linhas[1].celulas[0].texto",
      "linha": 2144
    },
    "evidencias": [
      {
        "arquivo": "docs/alexandria-v2/extraction/m01/aula-09.json",
        "campo": "blocos[8].linhas[1].celulas[0].texto",
        "linha": 2144,
        "trecho": "Afundamento de tensão (voltage sag)"
      },
      {
        "arquivo": "docs/alexandria-v2/extraction/m01/aula-09.json",
        "campo": "blocos[8].linhas[1].celulas[1].texto",
        "linha": 2144,
        "trecho": "Queda rápida e temporária da tensão"
      }
    ]
  },
  {
    "id": "m01-a09-d04",
    "moduloId": "modulo-01",
    "aula": 9,
    "origem": "derivado-da-aula",
    "tipo": "escolha",
    "enunciado": "Na medição de conformidade de tensão (intervalos de 10 minutos por pelo menos sete dias consecutivos), quantas leituras a aula diz que isso totaliza?",
    "alternativas": [
      "86.400",
      "8.760",
      "1.008",
      "24"
    ],
    "gabarito": 2,
    "referencia": "com medição integralizada em intervalos de 10 minutos por pelo menos sete dias consecutivos, totalizando 1.008 leituras.",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "alternativa-correta",
    "fonte": {
      "arquivo": "docs/alexandria-v2/extraction/m01/aula-09.json",
      "campo": "blocos[9].texto",
      "linha": 2152
    },
    "evidencias": [
      {
        "arquivo": "docs/alexandria-v2/extraction/m01/aula-09.json",
        "campo": "blocos[9].texto",
        "linha": 2152,
        "trecho": "com medição integralizada em intervalos de 10 minutos por pelo menos sete dias consecutivos, totalizando 1.008 leituras."
      }
    ]
  }
];

export const EXERCICIOS_DO_MODULO: ExercicioDoModulo[] = [
  {
    "id": "m01-ex-08",
    "moduloId": "modulo-01",
    "aula": null,
    "origem": "fonte",
    "tipo": "aberto",
    "enunciado": "Um cliente em Minas Gerais te diz: \"Minha conta de luz está cara, quero migrar para o mercado livre.\" Responda em até oito linhas: por que você não começa imediatamente falando de mercado livre? Quais fundamentos do módulo você checa primeiro? Que dados pede?",
    "gabarito": null,
    "referencia": "\"Mercado livre pode ser relevante, mas primeiro precisamos entender a estrutura atual de custo da sua fatura. Antes de qualquer migração, eu checaria: consumo em kWh, demanda contratada e medida em kW, fator de carga, fator de potência, modalidade tarifária, distribuição ponta/fora-ponta e existência de cobranças de reativo. Pediria 12 faturas completas, contrato de demanda, tensão de fornecimento, horários de operação e lista das maiores cargas. Sem isso, estaríamos propondo uma solução antes de diagnosticar o problema — e mercado livre só faz sentido depois de eliminadas as oportunidades estruturais no contrato atual.\"",
    "criterio": "O critério de domínio é resolver pelo menos seis dos oito sem consulta.",
    "contaParaCriterioDoDrill": true,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "docs/alexandria-v2/extraction/m01/aparato.json",
      "campo": "exercicios.soltos_P9[0].enunciado.texto",
      "linha": 2456
    },
    "evidencias": [
      {
        "arquivo": "docs/alexandria-v2/extraction/m01/aparato.json",
        "campo": "exercicios.soltos_P9[0].enunciado.texto",
        "linha": 2456,
        "trecho": "Um cliente em Minas Gerais te diz: \"Minha conta de luz está cara, quero migrar para o mercado livre.\" Responda em até oito linhas: por que você não começa imediatamente falando de mercado livre? Quais fundamentos do módulo você checa primeiro? Que dados pede?"
      },
      {
        "arquivo": "docs/alexandria-v2/extraction/m01/aparato.json",
        "campo": "exercicios.soltos_P9[0].gabarito.texto",
        "linha": 2456,
        "trecho": "\"Mercado livre pode ser relevante, mas primeiro precisamos entender a estrutura atual de custo da sua fatura. Antes de qualquer migração, eu checaria: consumo em kWh, demanda contratada e medida em kW, fator de carga, fator de potência, modalidade tarifária, distribuição ponta/fora-ponta e existência de cobranças de reativo. Pediria 12 faturas completas, contrato de demanda, tensão de fornecimento, horários de operação e lista das maiores cargas. Sem isso, estaríamos propondo uma solução antes de diagnosticar o problema — e mercado livre só faz sentido depois de eliminadas as oportunidades estruturais no contrato atual.\""
      }
    ]
  }
];

export const PROVAS: ProvaDoModulo[] = [
  {
    "moduloId": "modulo-01",
    "criterio": "O critério de domínio do módulo é acertar pelo menos 8 de 10 sem consultar.",
    "acertosMinimos": 8,
    "total": 10,
    "questoes": [
      {
        "id": "m01-quiz-q01",
        "enunciado": "Um motor de 20 kW opera por 4 horas. Qual o consumo?",
        "alternativas": [
          "20 kW",
          "80 kW",
          "80 kWh",
          "5 kWh"
        ],
        "correta": 2,
        "explicacao": "Consumo = potência × tempo = 20 kW × 4 h = 80 kWh. kW mede potência (taxa); kWh mede energia (acumulado). Esse é o teste mais básico de fluência kW vs kWh.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m01/aparato.json",
          "campo": "avaliacao.perguntas[0]",
          "linha": 3078
        }
      },
      {
        "id": "m01-quiz-q02",
        "enunciado": "Em corrente contínua aproximada, qual a relação entre tensão, corrente e potência?",
        "alternativas": [
          "P = V + I",
          "P = V × I",
          "P = V ÷ I",
          "P = V²"
        ],
        "correta": 1,
        "explicacao": "P = V × I. Tensão (V) × Corrente (I) = Potência (W). É a equação fundamental que liga as três grandezas básicas da eletricidade. Em AC com cargas indutivas, há o fator de potência multiplicando — mas a estrutura base é essa.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m01/aparato.json",
          "campo": "avaliacao.perguntas[1]",
          "linha": 3084
        }
      },
      {
        "id": "m01-quiz-q03",
        "enunciado": "Se a corrente em um cabo triplica, o que acontece com as perdas resistivas?",
        "alternativas": [
          "Triplicam",
          "Quadruplicam",
          "Aumentam 6 vezes",
          "Aumentam 9 vezes"
        ],
        "correta": 3,
        "explicacao": "P_perdas = I² × R. Se I triplica (×3), I² = 9, então as perdas aumentam 9 vezes. Esse crescimento quadrático é a razão por que transmissão de energia usa alta tensão — assim a corrente fica baixa para a mesma potência, e as perdas caem drasticamente.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m01/aparato.json",
          "campo": "avaliacao.perguntas[2]",
          "linha": 3090
        }
      },
      {
        "id": "m01-quiz-q04",
        "enunciado": "Por que uma fábrica paga demanda além de consumo?",
        "alternativas": [
          "É um truque tarifário para aumentar receita da distribuidora",
          "Porque a rede precisa ser dimensionada para o pico de potência, não para o consumo médio",
          "Porque é exigência legal sem justificativa técnica",
          "Para compensar perdas técnicas da rede"
        ],
        "correta": 1,
        "explicacao": "A distribuidora dimensiona transformadores, cabos e proteção para o pior momento simultâneo de demanda. Essa infraestrutura tem custo fixo: existe e custa mesmo se a fábrica usa pouco. Demanda é a cobrança por essa capacidade reservada — é tradução econômica de uma realidade física, não cobrança esotérica.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m01/aparato.json",
          "campo": "avaliacao.perguntas[3]",
          "linha": 3096
        }
      },
      {
        "id": "m01-quiz-q05",
        "enunciado": "Uma instalação tem demanda média de 200 kW e demanda máxima de 500 kW. Qual o fator de carga?",
        "alternativas": [
          "0,40",
          "0,60",
          "2,50",
          "0,25"
        ],
        "correta": 0,
        "explicacao": "FC = Demanda média ÷ Demanda máxima = 200 ÷ 500 = 0,40 (40%). Esse FC indica operação com sazonalidade moderada — possível oportunidade de gestão de carga, mas exige 12 meses de histórico para decisão.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m01/aparato.json",
          "campo": "avaliacao.perguntas[4]",
          "linha": 3107
        }
      },
      {
        "id": "m01-quiz-q06",
        "enunciado": "No Brasil, fator de potência mínimo de referência regulatória para Grupo A é:",
        "alternativas": [
          "0,85",
          "0,90",
          "0,92",
          "0,95"
        ],
        "correta": 2,
        "explicacao": "0,92, indutivo ou capacitivo. Abaixo desse valor, pode haver cobrança regulatória sobre o excedente reativo. Mas atenção: detalhes operacionais dependem da modalidade tarifária e regras vigentes (atualmente REN ANEEL 1.000/2021).",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m01/aparato.json",
          "campo": "avaliacao.perguntas[5]",
          "linha": 3113
        }
      },
      {
        "id": "m01-quiz-q07",
        "enunciado": "Qual a relação correta entre as três potências em um triângulo de potência?",
        "alternativas": [
          "kVA = kW + kVAr",
          "kVA² = kW² + kVAr²",
          "kW = kVA × kVAr",
          "kVAr = kVA × kW"
        ],
        "correta": 1,
        "explicacao": "kVA² = kW² + kVAr² (Pitágoras — triângulo retângulo). Equivalente: kVA = √(kW² + kVAr²). E o fator de potência é cos φ = kW ÷ kVA. Memorize esse triângulo — é o coração técnico do módulo.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m01/aparato.json",
          "campo": "avaliacao.perguntas[6]",
          "linha": 3119
        }
      },
      {
        "id": "m01-quiz-q08",
        "enunciado": "Uma usina solar de 50 MW gerou 100.000 MWh em um ano (8.760 h). Qual o fator de capacidade?",
        "alternativas": [
          "12,3%",
          "22,8%",
          "50,0%",
          "11,4%"
        ],
        "correta": 1,
        "explicacao": "FC = 100.000 ÷ (50 × 8.760) = 100.000 ÷ 438.000 = 22,8%. Está dentro da faixa típica de solar fotovoltaica em latitudes brasileiras (~20–28%). Para comparação: hidro BR ~50%, nuclear 85–95%.",
        "alertas": [
          "A explicação cita faixas de fator de capacidade que a pendência QA-FCap-01 (P20) ainda não verificou. Literal da fonte."
        ],
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m01/aparato.json",
          "campo": "avaliacao.perguntas[7]",
          "linha": 3130
        }
      },
      {
        "id": "m01-quiz-q09",
        "enunciado": "Qual subgrupo tarifário concentra a maioria do mercado livre potencial industrial no Brasil?",
        "alternativas": [
          "A1",
          "A2",
          "A4",
          "Grupo B"
        ],
        "correta": 2,
        "explicacao": "Grupo A4 (2,3 a 25 kV). Grande volume de consumidores industriais médios, complexidade tarifária suficiente para gerar diagnóstico relevante, e ainda não atendidos por consultorias premium que se concentram em A1/A2. É o terreno mais fértil para a NIVAR no Brasil.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m01/aparato.json",
          "campo": "avaliacao.perguntas[8]",
          "linha": 3136
        }
      },
      {
        "id": "m01-quiz-q10",
        "enunciado": "Um cliente diz: 'Minha conta de luz está cara, quero mercado livre.' Qual a primeira atitude correta?",
        "alternativas": [
          "Calcular imediatamente a economia potencial em ACL",
          "Apresentar comercializadoras parceiras",
          "Pedir 12 faturas e diagnosticar a estrutura atual de custo antes de propor migração",
          "Recomendar banco de capacitores"
        ],
        "correta": 2,
        "explicacao": "Mercado livre pode ser relevante, mas só após diagnóstico estruturado da fatura atual. Pedir 12 faturas, contrato de demanda, tensão de fornecimento, perfil operacional. Eliminar oportunidades estruturais (demanda mal dimensionada, FP baixo, modalidade tarifária inadequada) antes de propor migração. Promessa de economia sem diagnóstico fere uma trava operacional da NIVAR.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m01/aparato.json",
          "campo": "avaliacao.perguntas[9]",
          "linha": 3142
        }
      }
    ],
    "faixas": [
      {
        "min": 0,
        "max": 4,
        "mensagem": "Refaça o estudo. O critério de domínio é 8/10 — sem atalho."
      },
      {
        "min": 5,
        "max": 6,
        "mensagem": "Domínio parcial. Volte às aulas onde errou antes de avançar."
      },
      {
        "min": 7,
        "max": 8,
        "mensagem": "Bom. Revise os pontos errados, depois avance para o próximo módulo."
      },
      {
        "min": 9,
        "max": 10,
        "mensagem": "Domínio sólido. Pronto para o Módulo 02."
      }
    ],
    "faixasFonte": {
      "arquivo": "docs/alexandria-v2/extraction/m01/aparato.json",
      "campo": "avaliacao.faixas_de_placar_script.faixas",
      "linha": 3199
    },
    "criterioFonte": {
      "arquivo": "docs/alexandria-v2/extraction/m01/aparato.json",
      "campo": "avaliacao.criterio_literal_prosa.texto",
      "linha": 2473
    }
  }
];

export const CHECKLISTS: ChecklistDoModulo[] = [
  {
    "moduloId": "modulo-01",
    "introducao": "Você só passa neste módulo se conseguir, sem consultar nenhum material, fazer todas as ações abaixo. Marque ao longo do estudo. Quando todas estiverem marcadas, você está pronto para o Módulo 02 — Como Funciona uma Rede Elétrica.",
    "itens": [
      {
        "id": "m01-checklist-01",
        "texto": "Explicar kW vs kWh em 30 segundos, com exemplo numérico.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m01/aparato.json",
          "campo": "checklist_final.itens[0].texto",
          "linha": 2497
        }
      },
      {
        "id": "m01-checklist-02",
        "texto": "Dar um exemplo de Energia = Potência × Tempo, com unidades corretas.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m01/aparato.json",
          "campo": "checklist_final.itens[1].texto",
          "linha": 2498
        }
      },
      {
        "id": "m01-checklist-03",
        "texto": "Explicar por que demanda existe na conta industrial.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m01/aparato.json",
          "campo": "checklist_final.itens[2].texto",
          "linha": 2499
        }
      },
      {
        "id": "m01-checklist-04",
        "texto": "Calcular demanda média a partir de kWh mensal e horas do período.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m01/aparato.json",
          "campo": "checklist_final.itens[3].texto",
          "linha": 2500
        }
      },
      {
        "id": "m01-checklist-05",
        "texto": "Calcular fator de carga e interpretar o que ele significa operacionalmente.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m01/aparato.json",
          "campo": "checklist_final.itens[4].texto",
          "linha": 2501
        }
      },
      {
        "id": "m01-checklist-06",
        "texto": "Explicar a Lei de Ohm e por que perdas crescem com I².",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m01/aparato.json",
          "campo": "checklist_final.itens[5].texto",
          "linha": 2502
        }
      },
      {
        "id": "m01-checklist-07",
        "texto": "Justificar fisicamente por que transmissão usa alta tensão.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m01/aparato.json",
          "campo": "checklist_final.itens[6].texto",
          "linha": 2503
        }
      },
      {
        "id": "m01-checklist-08",
        "texto": "Explicar AC vs DC sem virar história longa de Tesla vs Edison.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m01/aparato.json",
          "campo": "checklist_final.itens[7].texto",
          "linha": 2504
        }
      },
      {
        "id": "m01-checklist-09",
        "texto": "Explicar frequência como evidência física do equilíbrio geração-consumo.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m01/aparato.json",
          "campo": "checklist_final.itens[8].texto",
          "linha": 2505
        }
      },
      {
        "id": "m01-checklist-10",
        "texto": "Desenhar o triângulo kW, kVAr, kVA e identificar cada lado.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m01/aparato.json",
          "campo": "checklist_final.itens[9].texto",
          "linha": 2506
        }
      },
      {
        "id": "m01-checklist-11",
        "texto": "Calcular fator de potência e explicar por que abaixo de 0,92 pode virar cobrança.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m01/aparato.json",
          "campo": "checklist_final.itens[10].texto",
          "linha": 2507
        }
      },
      {
        "id": "m01-checklist-12",
        "texto": "Listar três fenômenos de qualidade de energia e sua consequência industrial.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m01/aparato.json",
          "campo": "checklist_final.itens[11].texto",
          "linha": 2508
        }
      },
      {
        "id": "m01-checklist-13",
        "texto": "Diferenciar capacidade instalada e fator de capacidade por fonte.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m01/aparato.json",
          "campo": "checklist_final.itens[12].texto",
          "linha": 2509
        }
      },
      {
        "id": "m01-checklist-14",
        "texto": "Identificar Grupo A4 e por que ele é o terreno prioritário da NIVAR no Brasil.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m01/aparato.json",
          "campo": "checklist_final.itens[13].texto",
          "linha": 2510
        }
      },
      {
        "id": "m01-checklist-15",
        "texto": "Listar exatamente quais dados pedir antes de recomendar economia.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m01/aparato.json",
          "campo": "checklist_final.itens[14].texto",
          "linha": 2511
        }
      },
      {
        "id": "m01-checklist-16",
        "texto": "Saber em que situação não recomendar redução de demanda contratada.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m01/aparato.json",
          "campo": "checklist_final.itens[15].texto",
          "linha": 2512
        }
      }
    ]
  }
];
