// Avaliação do M10 (exercícios por aula, prova, checklist). Posse: a sessão de porte do M10.
// GERADO por tools/alexandria-dados/avaliacao/gerar-avaliacao-m10.mjs — não editar à mão.
// Conferido por tools/alexandria-dados/avaliacao/verificar-avaliacao-m10.mjs.
import type { ChecklistDoModulo, ExercicioDaAula, ExercicioDoModulo, ProvaDoModulo } from '../avaliacao';

export const EXERCICIOS_DAS_AULAS: ExercicioDaAula[] = [
  {
    "id": "m10-a01-d01",
    "moduloId": "modulo-10",
    "aula": 1,
    "origem": "derivado-da-aula",
    "tipo": "escolha",
    "enunciado": "Segundo a aula, qual é o único componente da fatura que a empresa negocia — e apenas se estiver no ambiente livre?",
    "alternativas": [
      "a demanda contratada",
      "o preço da energia",
      "o fator de potência"
    ],
    "gabarito": 1,
    "referencia": "Um único componente: o preço da energia. E apenas se a unidade estiver no ambiente livre de contratação.",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "alternativa-correta",
    "fonte": {
      "arquivo": "src/lib/data/alexandria-modulo-10-content.ts",
      "campo": "MODULO_10_CORPO['aula-10-01'][5]",
      "linha": null
    },
    "evidencias": [
      {
        "arquivo": "src/lib/data/alexandria-modulo-10-content.ts",
        "campo": "MODULO_10_CORPO['aula-10-01'][5]",
        "linha": null,
        "trecho": "Um único componente: o preço da energia. E apenas se a unidade estiver no ambiente livre de contratação."
      }
    ]
  },
  {
    "id": "m10-a01-d02",
    "moduloId": "modulo-10",
    "aula": 1,
    "origem": "derivado-da-aula",
    "tipo": "aberto",
    "enunciado": "A aula fala de quatro relógios que movem a conta sem que nada mude dentro da planta. Quais são eles?",
    "gabarito": null,
    "referencia": "O primeiro é o ciclo anual de reajuste tarifário da concessionária, com data própria — o aniversário tarifário. Duas plantas do mesmo grupo empresarial, em estados diferentes, atravessam reajustes em meses diferentes; comparar as duas sem declarar isso é comparar bases distintas. O segundo é o ciclo de revisão tarifária periódica, mais espaçado, que pode alterar não só valores mas a própria estrutura — inclusive a definição do posto de ponta da área de concessão. O terceiro é o acionamento mensal de bandeira, que muda o custo marginal do quilowatt-hora consumido sem qualquer alteração de tarifa homologada. O quarto é o calendário legal de mudança de regra: leis com vigência diferida, regulamentação pendente e prazos previstos que alteram encargos, tributos e elegibilidade.",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "src/lib/data/alexandria-modulo-10-content.ts",
      "campo": "MODULO_10_CORPO['aula-10-01'][16]",
      "linha": null
    },
    "evidencias": [
      {
        "arquivo": "src/lib/data/alexandria-modulo-10-content.ts",
        "campo": "MODULO_10_CORPO['aula-10-01'][16]",
        "linha": null,
        "trecho": "O primeiro é o ciclo anual de reajuste tarifário da concessionária, com data própria — o aniversário tarifário. Duas plantas do mesmo grupo empresarial, em estados diferentes, atravessam reajustes em meses diferentes; comparar as duas sem declarar isso é comparar bases distintas. O segundo é o ciclo de revisão tarifária periódica, mais espaçado, que pode alterar não só valores mas a própria estrutura — inclusive a definição do posto de ponta da área de concessão. O terceiro é o acionamento mensal de bandeira, que muda o custo marginal do quilowatt-hora consumido sem qualquer alteração de tarifa homologada. O quarto é o calendário legal de mudança de regra: leis com vigência diferida, regulamentação pendente e prazos previstos que alteram encargos, tributos e elegibilidade."
      }
    ]
  },
  {
    "id": "m10-ex-01",
    "moduloId": "modulo-10",
    "aula": 2,
    "origem": "fonte",
    "tipo": "aberto",
    "enunciado": "Uma unidade conectada em 13,8 kV pergunta quais modalidades pode avaliar. Responda e diga o que precisa confirmar.",
    "gabarito": null,
    "referencia": "Provavelmente o subgrupo de média tensão que abrange de 2,3 kV a 25 kV, com duas modalidades elegíveis — a horária de demanda separada por posto e a horária de demanda única. O que confirmar: o subgrupo declarado no cadastro da fatura, porque a faixa de tensão é indício e o cadastro é fato, e o contrato de uso, para saber a modalidade vigente e a data em que foi contratada.",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "docs/alexandria-v2/extraction/m10/aparato.json",
      "campo": "exercicios.itens[0].enunciado",
      "linha": 2896
    },
    "evidencias": [
      {
        "arquivo": "docs/alexandria-v2/extraction/m10/aparato.json",
        "campo": "exercicios.itens[0].enunciado.sem_prefixo",
        "linha": 2896,
        "trecho": "Uma unidade conectada em 13,8 kV pergunta quais modalidades pode avaliar. Responda e diga o que precisa confirmar."
      },
      {
        "arquivo": "src/lib/data/alexandria-modulo-10-content.ts",
        "campo": "MODULO_10_CORPO['aula-10-02'][30]",
        "linha": null,
        "trecho": "demanda única"
      }
    ],
    "alertas": [
      "Vínculo mecânico: a fonte não liga o Ex 01 a nenhuma aula (§Ex). O termo «demanda única», que está no exercício, aparece literalmente só na Aula 02, e o exercício vai para ela (regra de colocação de 15/11)."
    ]
  },
  {
    "id": "m10-ex-09",
    "moduloId": "modulo-10",
    "aula": 2,
    "origem": "fonte",
    "tipo": "aberto",
    "enunciado": "Uma proposta comercial afirma que a unidade economizaria migrando de modalidade porque a tarifa de demanda da outra modalidade é menor. Avalie o argumento.",
    "gabarito": null,
    "referencia": "O argumento é incompleto por construção. Comparar uma tarifa unitária entre modalidades ignora que as modalidades cobram sobre bases diferentes: uma separa demanda por posto e a outra não, e a diferenciação de energia por posto também muda. A comparação válida aplica o mesmo perfil medido às duas estruturas completas, mês a mês, incluindo ultrapassagem e reativo, e depois agrega. Uma tarifa isolada menor não prova custo total menor.",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "docs/alexandria-v2/extraction/m10/aparato.json",
      "campo": "exercicios.itens[8].enunciado",
      "linha": 2955
    },
    "evidencias": [
      {
        "arquivo": "docs/alexandria-v2/extraction/m10/aparato.json",
        "campo": "exercicios.itens[8].enunciado.sem_prefixo",
        "linha": 2955,
        "trecho": "Uma proposta comercial afirma que a unidade economizaria migrando de modalidade porque a tarifa de demanda da outra modalidade é menor. Avalie o argumento."
      },
      {
        "arquivo": "src/lib/data/alexandria-modulo-10-content.ts",
        "campo": "MODULO_10_CORPO['aula-10-02'][4]",
        "linha": null,
        "trecho": "Modalidades"
      }
    ],
    "alertas": [
      "Vínculo mecânico: a fonte não liga o Ex 09 a nenhuma aula (§Ex). O termo «modalidades», que está no exercício, aparece literalmente só na Aula 02, e o exercício vai para ela (regra de colocação de 15/11)."
    ]
  },
  {
    "id": "m10-ex-03",
    "moduloId": "modulo-10",
    "aula": 3,
    "origem": "fonte",
    "tipo": "aberto",
    "enunciado": "Contrato de 800 kW, demanda medida de 838 kW, tolerância de cinco por cento. Dispara a parcela de ultrapassagem?",
    "gabarito": null,
    "referencia": "Não. O limite de disparo é 800 × 1,05 = 840 kW, e a medição ficou abaixo. Nenhuma parcela de ultrapassagem é gerada neste ciclo. Observação de análise: 838 contra um limite de 840 é folga de dois quilowatts — a unidade está operando na borda, e um único evento adicional dispara a cobrança. Isso é achado, ainda que não haja cobrança.",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "docs/alexandria-v2/extraction/m10/aparato.json",
      "campo": "exercicios.itens[2].enunciado",
      "linha": 2910
    },
    "evidencias": [
      {
        "arquivo": "docs/alexandria-v2/extraction/m10/aparato.json",
        "campo": "exercicios.itens[2].enunciado.sem_prefixo",
        "linha": 2910,
        "trecho": "Contrato de 800 kW, demanda medida de 838 kW, tolerância de cinco por cento. Dispara a parcela de ultrapassagem?"
      },
      {
        "arquivo": "src/lib/data/alexandria-modulo-10-content.ts",
        "campo": "MODULO_10_CORPO['aula-10-03'][11]",
        "linha": null,
        "trecho": "tolerância"
      }
    ],
    "alertas": [
      "Vínculo mecânico: a fonte não liga o Ex 03 a nenhuma aula (§Ex). O termo «tolerância», que está no exercício, aparece literalmente nas Aulas 02, 03, e o exercício vai para a última (regra de colocação de 15/11)."
    ]
  },
  {
    "id": "m10-ex-04",
    "moduloId": "modulo-10",
    "aula": 3,
    "origem": "fonte",
    "tipo": "aberto",
    "enunciado": "Mesmo contrato de 800 kW, agora com medição de 850 kW e multiplicador de duas vezes. Calcule a base e explique a armadilha.",
    "gabarito": null,
    "referencia": "O limite é 840 kW e a medição o superou, então o gatilho disparou. A base não é 850 − 840 = 10 kW; é 850 − 800 = <b>50 kW</b>, multiplicada pelo fator aplicável e pela tarifa de demanda. A armadilha é tratar a tolerância como franquia. Confirme o multiplicador vigente na norma e no contrato: há material em circulação reproduzindo redação anterior à consolidação de 2021.",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "docs/alexandria-v2/extraction/m10/aparato.json",
      "campo": "exercicios.itens[3].enunciado",
      "linha": 2916
    },
    "evidencias": [
      {
        "arquivo": "docs/alexandria-v2/extraction/m10/aparato.json",
        "campo": "exercicios.itens[3].enunciado.sem_prefixo",
        "linha": 2916,
        "trecho": "Mesmo contrato de 800 kW, agora com medição de 850 kW e multiplicador de duas vezes. Calcule a base e explique a armadilha."
      },
      {
        "arquivo": "src/lib/data/alexandria-modulo-10-content.ts",
        "campo": "MODULO_10_CORPO['aula-10-03'][11]",
        "linha": null,
        "trecho": "franquia"
      }
    ],
    "alertas": [
      "Vínculo mecânico: a fonte não liga o Ex 04 a nenhuma aula (§Ex). O termo «franquia», que está no exercício, aparece literalmente só na Aula 03, e o exercício vai para ela (regra de colocação de 15/11)."
    ]
  },
  {
    "id": "m10-ex-14",
    "moduloId": "modulo-10",
    "aula": 3,
    "origem": "fonte",
    "tipo": "aberto",
    "enunciado": "A unidade tem geração própria conectada e a fatura mostra duas linhas de demanda contratada. Explique.",
    "gabarito": null,
    "referencia": "Uma unidade com central geradora conectada pode ter simultaneamente contrato de demanda de <b>consumo</b> e contrato de demanda de <b>injeção</b>, com naturezas e tolerâncias de ultrapassagem distintas. Confundir as duas é fonte recorrente de cobrança mal compreendida e de contestação mal fundamentada. A leitura correta separa potência consumida internamente, potência importada da rede e potência injetada — e um gráfico de energia líquida mensal não mostra nenhum desses três fluxos.",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "docs/alexandria-v2/extraction/m10/aparato.json",
      "campo": "exercicios.itens[13].enunciado",
      "linha": 2995
    },
    "evidencias": [
      {
        "arquivo": "docs/alexandria-v2/extraction/m10/aparato.json",
        "campo": "exercicios.itens[13].enunciado.sem_prefixo",
        "linha": 2995,
        "trecho": "A unidade tem geração própria conectada e a fatura mostra duas linhas de demanda contratada. Explique."
      },
      {
        "arquivo": "src/lib/data/alexandria-modulo-10-content.ts",
        "campo": "MODULO_10_CORPO['aula-10-03'][20]",
        "linha": null,
        "trecho": "demanda de injeção"
      }
    ],
    "alertas": [
      "Vínculo mecânico: a fonte não liga o Ex 14 a nenhuma aula (§Ex). O termo «demanda de injeção», que está no exercício, aparece literalmente nas Aulas 02, 03, e o exercício vai para a última (regra de colocação de 15/11)."
    ]
  },
  {
    "id": "m10-ex-02",
    "moduloId": "modulo-10",
    "aula": 4,
    "origem": "fonte",
    "tipo": "aberto",
    "enunciado": "A equipe adota das dezoito às vinte e uma como horário de ponta porque a filial em outro estado usa esse intervalo. Avalie.",
    "gabarito": null,
    "referencia": "Incorreto como premissa. O posto de ponta é definido por área de concessão e aprovado no processo de revisão tarifária da distribuidora local. Duas unidades do mesmo grupo em concessões diferentes podem ter janelas diferentes, e a janela pode ter mudado no último ciclo de revisão. A fonte é o ato homologatório da distribuidora que atende a unidade — e o erro produz simulação de deslocamento calculada sobre horas erradas.",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "docs/alexandria-v2/extraction/m10/aparato.json",
      "campo": "exercicios.itens[1].enunciado",
      "linha": 2903
    },
    "evidencias": [
      {
        "arquivo": "docs/alexandria-v2/extraction/m10/aparato.json",
        "campo": "exercicios.itens[1].enunciado.sem_prefixo",
        "linha": 2903,
        "trecho": "A equipe adota das dezoito às vinte e uma como horário de ponta porque a filial em outro estado usa esse intervalo. Avalie."
      },
      {
        "arquivo": "src/lib/data/alexandria-modulo-10-content.ts",
        "campo": "MODULO_10_CORPO['aula-10-04'][1]",
        "linha": null,
        "trecho": "posto de ponta"
      }
    ],
    "alertas": [
      "Vínculo mecânico: a fonte não liga o Ex 02 a nenhuma aula (§Ex). O termo «posto de ponta», que está no exercício, aparece literalmente nas Aulas 01, 02, 04, e o exercício vai para a última (regra de colocação de 15/11)."
    ]
  },
  {
    "id": "m10-ex-07",
    "moduloId": "modulo-10",
    "aula": 5,
    "origem": "fonte",
    "tipo": "aberto",
    "enunciado": "A fatura mostra excedente reativo apenas na madrugada, numa unidade que opera em turno diurno. Qual a hipótese principal?",
    "gabarito": null,
    "referencia": "Sobrecompensação capacitiva: banco de capacitores fixo permanecendo energizado quando a carga indutiva que ele compensava já foi desligada. A janela noturna de apuração verifica exatamente o excedente capacitivo. A recomendação errada e frequente é adicionar capacitores, o que agrava. O próximo passo é o perfil por intervalo e a verificação do regime de acionamento do banco existente — antes de qualquer compra.",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "docs/alexandria-v2/extraction/m10/aparato.json",
      "campo": "exercicios.itens[6].enunciado",
      "linha": 2941
    },
    "evidencias": [
      {
        "arquivo": "docs/alexandria-v2/extraction/m10/aparato.json",
        "campo": "exercicios.itens[6].enunciado.sem_prefixo",
        "linha": 2941,
        "trecho": "A fatura mostra excedente reativo apenas na madrugada, numa unidade que opera em turno diurno. Qual a hipótese principal?"
      },
      {
        "arquivo": "src/lib/data/alexandria-modulo-10-content.ts",
        "campo": "MODULO_10_CORPO['aula-10-05'][6]",
        "linha": null,
        "trecho": "sobrecompensação"
      }
    ],
    "alertas": [
      "Vínculo mecânico: a fonte não liga o Ex 07 a nenhuma aula (§Ex). O termo «sobrecompensação», que está no exercício, aparece literalmente só na Aula 05, e o exercício vai para ela (regra de colocação de 15/11)."
    ]
  },
  {
    "id": "m10-a06-d01",
    "moduloId": "modulo-10",
    "aula": 6,
    "origem": "derivado-da-aula",
    "tipo": "aberto",
    "enunciado": "Uma fatura não mostra nenhuma linha explícita de encargos. Segundo a aula, isso quer dizer que o custo é zero?",
    "gabarito": null,
    "referencia": "A ausência de uma linha explícita não significa custo zero: significa que o item está alocado dentro do valor unitário da tarifa aplicada.",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "src/lib/data/alexandria-modulo-10-content.ts",
      "campo": "MODULO_10_CORPO['aula-10-06'][1]",
      "linha": null
    },
    "evidencias": [
      {
        "arquivo": "src/lib/data/alexandria-modulo-10-content.ts",
        "campo": "MODULO_10_CORPO['aula-10-06'][1]",
        "linha": null,
        "trecho": "A ausência de uma linha explícita não significa custo zero: significa que o item está alocado dentro do valor unitário da tarifa aplicada."
      }
    ]
  },
  {
    "id": "m10-a06-d02",
    "moduloId": "modulo-10",
    "aula": 6,
    "origem": "derivado-da-aula",
    "tipo": "aberto",
    "enunciado": "Quais são as quatro perguntas que, segundo a aula, todo valor de encargo citado em proposta comercial precisa passar?",
    "gabarito": null,
    "referencia": "Todo valor de encargo citado em proposta comercial precisa passar por quatro perguntas. Qual é a unidade? — reais por megawatt-hora, reais por quilowatt, ou percentual de alguma base. Qual é a data-base? — quotas são fixadas por ciclo e envelhecem em doze meses. Qual é o recorte? — o valor é da concessionária específica, da região, ou média nacional. Está embutido ou explícito? — somar um encargo explícito a uma tarifa que já o contém é dupla contagem",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "src/lib/data/alexandria-modulo-10-content.ts",
      "campo": "MODULO_10_CORPO['aula-10-06'][16]",
      "linha": null
    },
    "evidencias": [
      {
        "arquivo": "src/lib/data/alexandria-modulo-10-content.ts",
        "campo": "MODULO_10_CORPO['aula-10-06'][16]",
        "linha": null,
        "trecho": "Todo valor de encargo citado em proposta comercial precisa passar por quatro perguntas. Qual é a unidade? — reais por megawatt-hora, reais por quilowatt, ou percentual de alguma base. Qual é a data-base? — quotas são fixadas por ciclo e envelhecem em doze meses. Qual é o recorte? — o valor é da concessionária específica, da região, ou média nacional. Está embutido ou explícito? — somar um encargo explícito a uma tarifa que já o contém é dupla contagem"
      }
    ]
  },
  {
    "id": "m10-a07-d01",
    "moduloId": "modulo-10",
    "aula": 7,
    "origem": "derivado-da-aula",
    "tipo": "escolha",
    "enunciado": "Pelo entendimento consolidado que a aula descreve, sobre qual demanda incide o imposto estadual?",
    "alternativas": [
      "demanda contratada mas não utilizada",
      "demanda de potência efetivamente utilizada",
      "demanda de injeção"
    ],
    "gabarito": 1,
    "referencia": "O imposto estadual incide sobre o valor da tarifa correspondente à demanda de potência efetivamente utilizada",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "alternativa-correta",
    "fonte": {
      "arquivo": "src/lib/data/alexandria-modulo-10-content.ts",
      "campo": "MODULO_10_CORPO['aula-10-07'][4]",
      "linha": null
    },
    "evidencias": [
      {
        "arquivo": "src/lib/data/alexandria-modulo-10-content.ts",
        "campo": "MODULO_10_CORPO['aula-10-07'][4]",
        "linha": null,
        "trecho": "O imposto estadual incide sobre o valor da tarifa correspondente à demanda de potência efetivamente utilizada"
      }
    ]
  },
  {
    "id": "m10-a07-d02",
    "moduloId": "modulo-10",
    "aula": 7,
    "origem": "derivado-da-aula",
    "tipo": "aberto",
    "enunciado": "Segundo a aula, o que muda nos tributos sobre o consumo em 2026, e por que o desembolso total não se altera nesta fase?",
    "gabarito": null,
    "referencia": "Desde 1º de janeiro de 2026 vigora uma alíquota de calibração de 0,9% para a contribuição federal nova e 0,1% para o imposto compartilhado novo, com previsão de compensação contra os débitos das contribuições federais vigentes, de modo que o desembolso total não se altera nesta fase.",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "src/lib/data/alexandria-modulo-10-content.ts",
      "campo": "MODULO_10_CORPO['aula-10-07'][13]",
      "linha": null
    },
    "evidencias": [
      {
        "arquivo": "src/lib/data/alexandria-modulo-10-content.ts",
        "campo": "MODULO_10_CORPO['aula-10-07'][13]",
        "linha": null,
        "trecho": "Desde 1º de janeiro de 2026 vigora uma alíquota de calibração de 0,9% para a contribuição federal nova e 0,1% para o imposto compartilhado novo, com previsão de compensação contra os débitos das contribuições federais vigentes, de modo que o desembolso total não se altera nesta fase."
      }
    ]
  },
  {
    "id": "m10-ex-13",
    "moduloId": "modulo-10",
    "aula": 8,
    "origem": "fonte",
    "tipo": "aberto",
    "enunciado": "Duas plantas do mesmo grupo, mesmo consumo mensal, pagam valores diferentes por unidade de energia. O controller suspeita de erro. Avalie.",
    "gabarito": null,
    "referencia": "Há pelo menos cinco explicações estruturais antes de qualquer suspeita de erro: concessionárias diferentes com tarifas homologadas próprias; datas de aniversário tarifário diferentes, de modo que uma já reajustou e a outra não; níveis de tensão de conexão diferentes, com efeito sobre componentes de rede e, desde 2026, sobre o rateio da quota do encargo de desenvolvimento energético; legislação tributária estadual e municipal distinta; e perfis de demanda e fator de carga diferentes. A pergunta correta não é qual está errada, é qual das cinco explica a diferença.",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "docs/alexandria-v2/extraction/m10/aparato.json",
      "campo": "exercicios.itens[12].enunciado",
      "linha": 2986
    },
    "evidencias": [
      {
        "arquivo": "docs/alexandria-v2/extraction/m10/aparato.json",
        "campo": "exercicios.itens[12].enunciado.sem_prefixo",
        "linha": 2986,
        "trecho": "Duas plantas do mesmo grupo, mesmo consumo mensal, pagam valores diferentes por unidade de energia. O controller suspeita de erro. Avalie."
      },
      {
        "arquivo": "src/lib/data/alexandria-modulo-10-content.ts",
        "campo": "MODULO_10_CORPO['aula-10-08'][1]",
        "linha": null,
        "trecho": "aniversário tarifário"
      }
    ],
    "alertas": [
      "Vínculo mecânico: a fonte não liga o Ex 13 a nenhuma aula (§Ex). O termo «aniversário tarifário», que está no exercício, aparece literalmente nas Aulas 01, 08, e o exercício vai para a última (regra de colocação de 15/11)."
    ]
  },
  {
    "id": "m10-ex-05",
    "moduloId": "modulo-10",
    "aula": 9,
    "origem": "fonte",
    "tipo": "aberto",
    "enunciado": "Unidade em média tensão, modalidade de demanda única, demanda contratada 1.000 kW, maior medida em doze meses 960 kW, sem ultrapassagem, sem excedente reativo, participação de ponta de doze por cento com processo contínuo. Emita o parecer.",
    "gabarito": null,
    "referencia": "O enquadramento está adequado ao perfil e a modalidade é elegível ao subgrupo. A utilização do contrato é de noventa e seis por cento, sem ultrapassagem em doze meses — o dimensionamento está ajustado, com folga compatível com um processo que tem partidas. Não há indício tarifário de problema de fator de potência. A participação de ponta é estruturalmente baixa e o processo é contínuo, o que torna deslocamento de carga irrelevante como alavanca. <b>Parecer: não há achado material com os dados disponíveis.</b> Recomendação: manter monitoramento de demanda com alarme, e reavaliar antes de qualquer expansão. Dizer isso sem procurar um problema que não existe é a resposta correta.",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "docs/alexandria-v2/extraction/m10/aparato.json",
      "campo": "exercicios.itens[4].enunciado",
      "linha": 2923
    },
    "evidencias": [
      {
        "arquivo": "docs/alexandria-v2/extraction/m10/aparato.json",
        "campo": "exercicios.itens[4].enunciado.sem_prefixo",
        "linha": 2923,
        "trecho": "Unidade em média tensão, modalidade de demanda única, demanda contratada 1.000 kW, maior medida em doze meses 960 kW, sem ultrapassagem, sem excedente reativo, participação de ponta de doze por cento com processo contínuo. Emita o parecer."
      },
      {
        "arquivo": "src/lib/data/alexandria-modulo-10-content.ts",
        "campo": "MODULO_10_CORPO['aula-10-09'][16]",
        "linha": null,
        "trecho": "participação de ponta"
      }
    ],
    "alertas": [
      "Vínculo mecânico: a fonte não liga o Ex 05 a nenhuma aula (§Ex). O termo «participação de ponta», que está no exercício, aparece literalmente só na Aula 09, e o exercício vai para ela (regra de colocação de 15/11)."
    ]
  },
  {
    "id": "m10-ex-06",
    "moduloId": "modulo-10",
    "aula": 9,
    "origem": "fonte",
    "tipo": "aberto",
    "enunciado": "Você recebe uma única fatura e o cliente pergunta se deve reduzir a demanda contratada. O que responde?",
    "gabarito": null,
    "referencia": "Que não é possível concluir, e a lista do que falta: doze meses de faturas consecutivas com refaturamentos preservados; memória de massa por intervalo; data, hora, duração e causa operacional de cada pico da série; plano de produção com expansões previstas; e o contrato de uso vigente com prazos de alteração. A fatura única mostra a folga do ciclo, que é indício de direção — não distingue folga estrutural de mês atípico, e em muitas operações o mês atípico é justamente o que define o contrato.",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "docs/alexandria-v2/extraction/m10/aparato.json",
      "campo": "exercicios.itens[5].enunciado",
      "linha": 2933
    },
    "evidencias": [
      {
        "arquivo": "docs/alexandria-v2/extraction/m10/aparato.json",
        "campo": "exercicios.itens[5].enunciado.sem_prefixo",
        "linha": 2933,
        "trecho": "Você recebe uma única fatura e o cliente pergunta se deve reduzir a demanda contratada. O que responde?"
      },
      {
        "arquivo": "src/lib/data/alexandria-modulo-10-content.ts",
        "campo": "MODULO_10_CORPO['aula-10-09'][8]",
        "linha": null,
        "trecho": "memória de massa"
      }
    ],
    "alertas": [
      "Vínculo mecânico: a fonte não liga o Ex 06 a nenhuma aula (§Ex). O termo «memória de massa», que está no exercício, aparece literalmente nas Aulas 01, 03, 09, e o exercício vai para a última (regra de colocação de 15/11)."
    ]
  },
  {
    "id": "m10-ex-08",
    "moduloId": "modulo-10",
    "aula": 9,
    "origem": "fonte",
    "tipo": "aberto",
    "enunciado": "O custo total caiu cinco por cento, o consumo caiu quinze por cento e o custo por unidade de energia subiu. Houve piora de gestão?",
    "gabarito": null,
    "referencia": "Não é possível concluir. Custos de capacidade — demanda contratada e componentes aplicados à demanda — não caem com o consumo, e diluídos em menos energia elevam o indicador unitário. O indicador subiu por composição, não necessariamente por piora. A análise correta separa a variação em efeito preço e efeito quantidade, componente a componente, e verifica se houve reajuste ou mudança de bandeira no período.",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "docs/alexandria-v2/extraction/m10/aparato.json",
      "campo": "exercicios.itens[7].enunciado",
      "linha": 2948
    },
    "evidencias": [
      {
        "arquivo": "docs/alexandria-v2/extraction/m10/aparato.json",
        "campo": "exercicios.itens[7].enunciado.sem_prefixo",
        "linha": 2948,
        "trecho": "O custo total caiu cinco por cento, o consumo caiu quinze por cento e o custo por unidade de energia subiu. Houve piora de gestão?"
      },
      {
        "arquivo": "src/lib/data/alexandria-modulo-10-content.ts",
        "campo": "MODULO_10_CORPO['aula-10-09'][2]",
        "linha": null,
        "trecho": "efeito preço"
      }
    ],
    "alertas": [
      "Vínculo mecânico: a fonte não liga o Ex 08 a nenhuma aula (§Ex). O termo «efeito preço», que está no exercício, aparece literalmente nas Aulas 08, 09, e o exercício vai para a última (regra de colocação de 15/11)."
    ]
  },
  {
    "id": "m10-ex-10",
    "moduloId": "modulo-10",
    "aula": 9,
    "origem": "fonte",
    "tipo": "aberto",
    "enunciado": "Um contrato de energia no ambiente livre é oferecido por um preço por megawatt-hora bem abaixo do custo unitário da fatura cativa atual. O que falta para comparar?",
    "gabarito": null,
    "referencia": "Falta reconstruir o custo entregue dos dois lados. No lado livre: preço do contrato, perdas, tratamento do perfil, diferença entre contratado e medido liquidada, tarifa de uso e demanda que permanecem devidas, encargos aplicáveis, tributos, custo de representação e garantias. No lado cativo: tarifa aplicável, bandeira e tributos, sobre o mesmo consumo e a mesma demanda. Comparar preço de contrato com total cativo compara uma parte com o todo.",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "docs/alexandria-v2/extraction/m10/aparato.json",
      "campo": "exercicios.itens[9].enunciado",
      "linha": 2963
    },
    "evidencias": [
      {
        "arquivo": "docs/alexandria-v2/extraction/m10/aparato.json",
        "campo": "exercicios.itens[9].enunciado.sem_prefixo",
        "linha": 2963,
        "trecho": "Um contrato de energia no ambiente livre é oferecido por um preço por megawatt-hora bem abaixo do custo unitário da fatura cativa atual. O que falta para comparar?"
      },
      {
        "arquivo": "src/lib/data/alexandria-modulo-10-content.ts",
        "campo": "MODULO_10_CORPO['aula-10-09'][8]",
        "linha": null,
        "trecho": "custo entregue"
      }
    ],
    "alertas": [
      "Vínculo mecânico: a fonte não liga o Ex 10 a nenhuma aula (§Ex). O termo «custo entregue», que está no exercício, aparece literalmente só na Aula 09, e o exercício vai para ela (regra de colocação de 15/11)."
    ]
  },
  {
    "id": "m10-ex-11",
    "moduloId": "modulo-10",
    "aula": 9,
    "origem": "fonte",
    "tipo": "aberto",
    "enunciado": "A tarifa unitária exibida na fatura é maior que a da planilha tarifária da concessionária. É erro de cobrança?",
    "gabarito": null,
    "referencia": "Não necessariamente, e essa é a ordem de verificação: tributos compondo o valor exibido, quando a planilha é publicada sem eles; adicional de bandeira; período que atravessa data de reajuste, com rateio; casas decimais da tarifa, geralmente mais numerosas que as exibidas; e compensação de perdas de transformação quando a medição está do lado de baixa tensão de transformador do consumidor. Só depois de reconciliar esses fatores faz sentido classificar como possível erro.",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "docs/alexandria-v2/extraction/m10/aparato.json",
      "campo": "exercicios.itens[10].enunciado",
      "linha": 2971
    },
    "evidencias": [
      {
        "arquivo": "docs/alexandria-v2/extraction/m10/aparato.json",
        "campo": "exercicios.itens[10].enunciado.sem_prefixo",
        "linha": 2971,
        "trecho": "A tarifa unitária exibida na fatura é maior que a da planilha tarifária da concessionária. É erro de cobrança?"
      },
      {
        "arquivo": "src/lib/data/alexandria-modulo-10-content.ts",
        "campo": "MODULO_10_CORPO['aula-10-09'][16]",
        "linha": null,
        "trecho": "casas decimais"
      }
    ],
    "alertas": [
      "Vínculo mecânico: a fonte não liga o Ex 11 a nenhuma aula (§Ex). O termo «casas decimais», que está no exercício, aparece literalmente nas Aulas 08, 09, e o exercício vai para a última (regra de colocação de 15/11)."
    ]
  },
  {
    "id": "m10-ex-12",
    "moduloId": "modulo-10",
    "aula": 9,
    "origem": "fonte",
    "tipo": "aberto",
    "enunciado": "Um mês da série apresenta valor negativo em uma linha. Deve ser excluído?",
    "gabarito": null,
    "referencia": "Não. Valores negativos costumam ser compensações, devoluções ou componentes de refaturamento, e excluí-los apaga justamente o ajuste que explica a série. O correto é preservar a linha, vincular o ajuste ao período de origem e declarar a diferença entre competência e caixa na apresentação. Uma série \"limpa\" de ajustes é uma série que não reconcilia com o que o cliente efetivamente pagou.",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "docs/alexandria-v2/extraction/m10/aparato.json",
      "campo": "exercicios.itens[11].enunciado",
      "linha": 2979
    },
    "evidencias": [
      {
        "arquivo": "docs/alexandria-v2/extraction/m10/aparato.json",
        "campo": "exercicios.itens[11].enunciado.sem_prefixo",
        "linha": 2979,
        "trecho": "Um mês da série apresenta valor negativo em uma linha. Deve ser excluído?"
      },
      {
        "arquivo": "src/lib/data/alexandria-modulo-10-content.ts",
        "campo": "MODULO_10_CORPO['aula-10-09'][12]",
        "linha": null,
        "trecho": "refaturamento"
      }
    ],
    "alertas": [
      "Vínculo mecânico: a fonte não liga o Ex 12 a nenhuma aula (§Ex). O termo «refaturamento», que está no exercício, aparece literalmente nas Aulas 08, 09, e o exercício vai para a última (regra de colocação de 15/11)."
    ]
  }
];

/** Exercícios da fonte cujo termo não casa com nenhuma aula (regra de colocação de 15/11). */
export const EXERCICIOS_DO_MODULO: ExercicioDoModulo[] = [];

export const PROVAS: ProvaDoModulo[] = [
  {
    "moduloId": "modulo-10",
    "criterio": "O critério é oito acertos: abaixo disso, a matéria não está no ponto de sustentar uma leitura cronometrada diante de um cliente.",
    "acertosMinimos": 8,
    "total": 10,
    "questoes": [
      {
        "id": "m10-quiz-01",
        "enunciado": "Uma unidade está cadastrada no subgrupo A2 e uma proposta comercial simula a modalidade horária de demanda única para ela. Qual é o problema?",
        "alternativas": [
          "Nenhum: qualquer unidade do grupo A pode optar por qualquer modalidade horária.",
          "O problema é de premissa: a simulação precisaria usar doze meses em vez de um.",
          "A modalidade de demanda única é disponível apenas aos subgrupos A3a, A4 e AS — é erro de elegibilidade, verificável no cadastro antes de qualquer cálculo.",
          "O problema é que a modalidade de demanda única nunca compensa em alta tensão."
        ],
        "correta": 2,
        "explicacao": "Erro de elegibilidade, não de premissa. A relação vigente de modalidades disponíveis restringe a modalidade de demanda única a A3a, A4 e AS; A1, A2 e A3 têm apenas a modalidade que separa demanda por posto.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m10/aparato.json",
          "campo": "avaliacao.questoes[0]",
          "linha": 4684
        }
      },
      {
        "id": "m10-quiz-02",
        "enunciado": "Contrato de 1.000 kW, tolerância de cinco por cento, demanda medida de 1.060 kW. Qual é a base da parcela de ultrapassagem?",
        "alternativas": [
          "60 kW — a diferença entre a demanda medida e a demanda contratada.",
          "10 kW — apenas o que excede o limite de 1.050 kW.",
          "Zero — a medição está dentro da tolerância.",
          "1.060 kW — a demanda medida integral."
        ],
        "correta": 0,
        "explicacao": "A tolerância é gatilho, não franquia. Disparado o gatilho, a base é a diferença entre demanda medida e demanda contratada, e não o excedente acima do limite de tolerância.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m10/aparato.json",
          "campo": "avaliacao.questoes[1]",
          "linha": 4691
        }
      },
      {
        "id": "m10-quiz-03",
        "enunciado": "O posto tarifário de ponta do grupo A é definido como:",
        "alternativas": [
          "Cinco horas diárias, das dezessete às vinte e duas, em âmbito nacional.",
          "Três horas diárias, iguais em todo o território nacional, definidas pelo operador do sistema.",
          "Duas horas imediatamente anteriores e posteriores ao pico de carga do sistema.",
          "Três horas diárias consecutivas, definidas pela distribuidora conforme a curva de carga de seu sistema e aprovadas pela agência para toda a área de concessão, aplicadas em dias úteis com exceções de feriados."
        ],
        "correta": 3,
        "explicacao": "Três horas, por área de concessão, aprovadas no processo de revisão tarifária. O intervalo varia entre concessionárias e pode mudar de um ciclo de revisão para outro.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m10/aparato.json",
          "campo": "avaliacao.questoes[2]",
          "linha": 4698
        }
      },
      {
        "id": "m10-quiz-04",
        "enunciado": "Uma fatura mostra excedente reativo concentrado exclusivamente na madrugada, numa planta que opera em turno diurno. Qual é a hipótese principal?",
        "alternativas": [
          "Falta de compensação: a instalação precisa de mais capacitores.",
          "Sobrecompensação capacitiva, tipicamente banco fixo energizado após o desligamento da carga indutiva.",
          "Erro de medição, porque a apuração noturna não existe na norma vigente.",
          "Distorção harmônica, que só se manifesta em regime de baixa carga."
        ],
        "correta": 1,
        "explicacao": "A janela noturna de apuração verifica exatamente o excedente capacitivo. O achado indica compensação em excesso, e a recomendação de adicionar capacitores agravaria o problema.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m10/aparato.json",
          "campo": "avaliacao.questoes[3]",
          "linha": 4705
        }
      },
      {
        "id": "m10-quiz-05",
        "enunciado": "O consumo caiu quinze por cento, a fatura caiu cinco por cento e o custo por unidade de energia subiu. O que se pode concluir?",
        "alternativas": [
          "Houve piora de gestão energética.",
          "Houve erro de faturamento na distribuidora.",
          "Não é possível concluir: custos de capacidade não caem com o consumo e, diluídos em menos energia, elevam o indicador unitário.",
          "A tarifa foi reajustada no período, necessariamente."
        ],
        "correta": 2,
        "explicacao": "O indicador subiu por composição. A análise correta separa efeito preço de efeito quantidade, componente a componente, e verifica se houve reajuste ou mudança de bandeira no período.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m10/aparato.json",
          "campo": "avaliacao.questoes[4]",
          "linha": 4712
        }
      },
      {
        "id": "m10-quiz-06",
        "enunciado": "Desde 1º de janeiro de 2026, o custo por megawatt-hora da quota anual do encargo de desenvolvimento energético pago por consumidor atendido em tensão igual ou superior a 69 kV corresponde a:",
        "alternativas": [
          "Cem por cento do pago por quem é atendido abaixo de 2,3 kV — não há diferenciação.",
          "Oitenta por cento do pago por quem é atendido abaixo de 2,3 kV.",
          "Vinte por cento do pago por quem é atendido abaixo de 2,3 kV.",
          "Cinquenta por cento do pago por quem é atendido abaixo de 2,3 kV, conforme a Lei nº 15.269/2025."
        ],
        "correta": 3,
        "explicacao": "Cinquenta por cento para tensão igual ou superior a 69 kV, e oitenta por cento para a faixa entre 2,3 kV e 69 kV. Os dispositivos são os §§ 3º-D e 3º-E do art. 13 da Lei nº 10.438/2002, na redação da Lei nº 15.269/2025.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m10/aparato.json",
          "campo": "avaliacao.questoes[5]",
          "linha": 4719
        }
      },
      {
        "id": "m10-quiz-07",
        "enunciado": "Segundo a tese firmada em recursos repetitivos sobre a inclusão das tarifas de uso da rede na base de cálculo do imposto estadual, ela se aplica a:",
        "alternativas": [
          "Consumidor final, seja ele livre ou cativo, quando as tarifas são lançadas na fatura como encargo por ele suportado diretamente.",
          "Apenas ao consumidor cativo, porque o livre contrata energia separadamente.",
          "Apenas ao consumidor livre, porque o cativo já tem a rede embutida na tarifa.",
          "A nenhum dos dois, porque a matéria foi definitivamente resolvida em lei complementar."
        ],
        "correta": 0,
        "explicacao": "A tese alcança livre e cativo. Uma proposta que sugere que migrar de ambiente resolve exposição tributária sobre tarifa de uso descreve algo que a tese firmada não sustenta.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m10/aparato.json",
          "campo": "avaliacao.questoes[6]",
          "linha": 4726
        }
      },
      {
        "id": "m10-quiz-08",
        "enunciado": "Qual é a fronteira correta entre o que a empresa controla e o que ela apenas suporta na fatura?",
        "alternativas": [
          "A empresa controla a energia e suporta tudo o mais.",
          "A empresa não altera o valor unitário de tarifa de rede, encargos e tributos, mas altera a quantidade sobre a qual eles incidem.",
          "A empresa controla tudo, desde que negocie com a distribuidora.",
          "A empresa não controla nada além do volume total consumido."
        ],
        "correta": 1,
        "explicacao": "Essa é a distinção mais valiosa do módulo. Toda melhoria no eixo do que a empresa controla se propaga pelo eixo do que ela apenas suporta, porque reduz a base sobre a qual preços não controláveis incidem.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m10/aparato.json",
          "campo": "avaliacao.questoes[7]",
          "linha": 4733
        }
      },
      {
        "id": "m10-quiz-09",
        "enunciado": "Você recebe uma única fatura e o cliente pergunta se deve reduzir a demanda contratada. Qual é a resposta correta?",
        "alternativas": [
          "Reduzir para o valor da demanda medida do ciclo, com margem de cinco por cento.",
          "Manter o contrato, porque uma fatura nunca indica nada sobre demanda.",
          "Reduzir apenas se a utilização estiver abaixo de setenta por cento.",
          "Que não é possível concluir, entregando a lista do que falta: doze meses, memória de massa, causa de cada pico, plano de produção e contrato de uso vigente."
        ],
        "correta": 3,
        "explicacao": "Uma fatura mostra a folga do ciclo, que é indício de direção. Não distingue folga estrutural de mês atípico — e em muitas operações industriais o mês atípico é justamente o que define o contrato.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m10/aparato.json",
          "campo": "avaliacao.questoes[8]",
          "linha": 4740
        }
      },
      {
        "id": "m10-quiz-10",
        "enunciado": "Qual afirmação sobre a bandeira tarifária é correta para uma indústria?",
        "alternativas": [
          "É um tributo federal incidente sobre o consumo de energia.",
          "É uma penalidade aplicada a consumidores acima de determinado patamar de consumo.",
          "É um componente tarifário de sinalização de custo de geração, com acionamento mensal, aplicável ao consumidor do ambiente regulado.",
          "Aplica-se igualmente a consumidores cativos e livres, nos mesmos termos."
        ],
        "correta": 2,
        "explicacao": "Não é tributo nem penalidade. O consumidor do ambiente livre não paga bandeira nos mesmos termos do cativo: sua exposição a custo de geração aparece por contrato, liquidação de diferenças e encargos aplicáveis.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m10/aparato.json",
          "campo": "avaliacao.questoes[9]",
          "linha": 4747
        }
      }
    ],
    "faixas": [
      {
        "min": 8,
        "max": 10,
        "mensagem": "Critério atingido. A matéria está no ponto de sustentar uma leitura cronometrada diante de um cliente — inclusive a saída de que o enquadramento está adequado."
      },
      {
        "min": 0,
        "max": 7,
        "mensagem": "Abaixo do critério de oito acertos. Reveja as questões erradas antes de aplicar a ordem de leitura a uma fatura real: o erro que custa caro numa leitura não é a linha esquecida, é a ordem errada."
      }
    ],
    "faixasFonte": {
      "arquivo": "docs/alexandria-v2/extraction/m10/aparato.json",
      "campo": "avaliacao.faixas_do_placar",
      "linha": 4794
    },
    "criterioFonte": {
      "arquivo": "docs/alexandria-v2/extraction/m10/aparato.json",
      "campo": "avaliacao.lede",
      "linha": 3010
    }
  }
];

export const CHECKLISTS: ChecklistDoModulo[] = [
  {
    "moduloId": "modulo-10",
    "introducao": "O primeiro item é a execução completa da ordem de leitura em cinco minutos. O último é o mais difícil de todos.",
    "itens": [
      {
        "id": "m10-check-01",
        "texto": "Executei a ordem de leitura completa dos nove passos, cronometrada, em cinco minutos.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m10/aparato.json",
          "campo": "checklist_final.itens[0]",
          "linha": 3093
        }
      },
      {
        "id": "m10-check-02",
        "texto": "Li o cadastro antes de qualquer valor: unidade, grupo, subgrupo, classe, modalidade e tensão.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m10/aparato.json",
          "campo": "checklist_final.itens[1]",
          "linha": 3094
        }
      },
      {
        "id": "m10-check-03",
        "texto": "Confirmei que a modalidade cadastrada é elegível ao subgrupo da unidade.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m10/aparato.json",
          "campo": "checklist_final.itens[2]",
          "linha": 3095
        }
      },
      {
        "id": "m10-check-04",
        "texto": "Verifiquei as datas de leitura anterior e atual e o número de dias do ciclo.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m10/aparato.json",
          "campo": "checklist_final.itens[3]",
          "linha": 3096
        }
      },
      {
        "id": "m10-check-05",
        "texto": "Verifiquei se o ciclo atravessa data de reajuste tarifário da concessionária.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m10/aparato.json",
          "campo": "checklist_final.itens[4]",
          "linha": 3097
        }
      },
      {
        "id": "m10-check-06",
        "texto": "Verifiquei se o ciclo atravessa meses com bandeiras de cores diferentes e se houve rateio.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m10/aparato.json",
          "campo": "checklist_final.itens[5]",
          "linha": 3098
        }
      },
      {
        "id": "m10-check-07",
        "texto": "Localizei demanda contratada, demanda medida e demanda faturada, por posto quando aplicável.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m10/aparato.json",
          "campo": "checklist_final.itens[6]",
          "linha": 3099
        }
      },
      {
        "id": "m10-check-08",
        "texto": "Verifiquei a presença de linha de ultrapassagem e, se houver, calculei a base corretamente sobre a diferença entre medida e contratada.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m10/aparato.json",
          "campo": "checklist_final.itens[7]",
          "linha": 3100
        }
      },
      {
        "id": "m10-check-09",
        "texto": "Confirmei a tolerância aplicável à natureza da demanda contratada da unidade, e não presumi cinco por cento.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m10/aparato.json",
          "campo": "checklist_final.itens[8]",
          "linha": 3101
        }
      },
      {
        "id": "m10-check-10",
        "texto": "Confirmei o multiplicador da parcela de ultrapassagem no texto normativo vigente e no contrato de uso.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m10/aparato.json",
          "campo": "checklist_final.itens[9]",
          "linha": 3102
        }
      },
      {
        "id": "m10-check-11",
        "texto": "Verifiquei a presença de linhas de excedente reativo e mapeei o rótulo da distribuidora ao conceito normativo vigente.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m10/aparato.json",
          "campo": "checklist_final.itens[10]",
          "linha": 3103
        }
      },
      {
        "id": "m10-check-12",
        "texto": "Classifiquei o excedente reativo entre estrutural e pontual, e verifiquei se o padrão é diurno ou noturno.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m10/aparato.json",
          "campo": "checklist_final.itens[11]",
          "linha": 3104
        }
      },
      {
        "id": "m10-check-13",
        "texto": "Calculei a participação do consumo de ponta no total do ciclo.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m10/aparato.json",
          "campo": "checklist_final.itens[12]",
          "linha": 3105
        }
      },
      {
        "id": "m10-check-14",
        "texto": "Confirmei o intervalo de ponta homologado da área de concessão, sem presumir horário nacional.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m10/aparato.json",
          "campo": "checklist_final.itens[13]",
          "linha": 3106
        }
      },
      {
        "id": "m10-check-15",
        "texto": "Confirmei que o número de horas de ponta faturadas corresponde aos dias úteis do ciclo, excluídos os feriados aplicáveis.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m10/aparato.json",
          "campo": "checklist_final.itens[14]",
          "linha": 3107
        }
      },
      {
        "id": "m10-check-16",
        "texto": "Reconciliei ao menos uma linha completa: quantidade vezes tarifa contra o valor exibido.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m10/aparato.json",
          "campo": "checklist_final.itens[15]",
          "linha": 3108
        }
      },
      {
        "id": "m10-check-17",
        "texto": "Antes de suspeitar de erro, verifiquei tributo por dentro, casas decimais, rateio de ciclo e compensação de perdas.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m10/aparato.json",
          "campo": "checklist_final.itens[16]",
          "linha": 3109
        }
      },
      {
        "id": "m10-check-18",
        "texto": "Conferi a tarifa aplicada contra o ato homologatório vigente no período, da concessionária correta.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m10/aparato.json",
          "campo": "checklist_final.itens[17]",
          "linha": 3110
        }
      },
      {
        "id": "m10-check-19",
        "texto": "Separei a base tributável da não tributável e verifiquei o tratamento da demanda não utilizada.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m10/aparato.json",
          "campo": "checklist_final.itens[18]",
          "linha": 3111
        }
      },
      {
        "id": "m10-check-20",
        "texto": "Registrei o estado atual da controvérsia sobre inclusão das tarifas de uso na base do imposto estadual, com data de consulta.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m10/aparato.json",
          "campo": "checklist_final.itens[19]",
          "linha": 3112
        }
      },
      {
        "id": "m10-check-21",
        "texto": "Declarei que 2026 é ano de transição do regime de tributos indiretos e não projetei o regime anterior como permanente.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m10/aparato.json",
          "campo": "checklist_final.itens[20]",
          "linha": 3113
        }
      },
      {
        "id": "m10-check-22",
        "texto": "Verifiquei se a unidade tem geração conectada e, se tiver, separei demanda de consumo de demanda de injeção.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m10/aparato.json",
          "campo": "checklist_final.itens[21]",
          "linha": 3114
        }
      },
      {
        "id": "m10-check-23",
        "texto": "Etiquetei cada achado com o eixo de controle a que pertence: controla, negocia, suporta ou tempo.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m10/aparato.json",
          "campo": "checklist_final.itens[22]",
          "linha": 3115
        }
      },
      {
        "id": "m10-check-24",
        "texto": "Ordenei as intervenções: correção contratual antes de operacional, operacional antes de investimento.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m10/aparato.json",
          "campo": "checklist_final.itens[23]",
          "linha": 3116
        }
      },
      {
        "id": "m10-check-25",
        "texto": "Listei explicitamente o que não está no documento e seria necessário para concluir.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m10/aparato.json",
          "campo": "checklist_final.itens[24]",
          "linha": 3117
        }
      },
      {
        "id": "m10-check-26",
        "texto": "Verifiquei se cada afirmação de regra do meu parecer carrega norma, vigência e estado de regulamentação.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m10/aparato.json",
          "campo": "checklist_final.itens[25]",
          "linha": 3118
        }
      },
      {
        "id": "m10-check-27",
        "texto": "Verifiquei se cada grandeza do meu parecer carrega valor, unidade, data-base e recorte — e, se tarifária, a concessionária e o processo de referência.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m10/aparato.json",
          "campo": "checklist_final.itens[26]",
          "linha": 3119
        }
      },
      {
        "id": "m10-check-28",
        "texto": "Sei dizer, sem constrangimento e sem procurar um problema que não existe, que o enquadramento atual está adequado quando ele estiver.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m10/aparato.json",
          "campo": "checklist_final.itens[27]",
          "linha": 3120
        }
      }
    ]
  }
];
