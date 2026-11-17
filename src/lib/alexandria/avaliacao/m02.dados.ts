// GERADO por tools/alexandria-dados/avaliacao/gerar-avaliacao-m02.mjs — não editar à mão.
// Avaliação do M02: exercícios por aula, exercícios sem aula, prova e checklist.
// Fonte: docs/alexandria-v2/extraction/m02/aparato.json (itens 'fonte') e o texto da própria
// aula (itens 'derivado-da-aula', com o trecho literal em `evidencias`).
// Relatório: docs/alexandria-v3/porte/m02.md. Posse: a sessão de porte do M02.
// 36 itens por aula (10 da fonte, 26 derivados) · 0 sem aula · 10 questões na prova · checklist de 18.
import type { ChecklistDoModulo, ExercicioDaAula, ExercicioDoModulo, ProvaDoModulo } from '../avaliacao';

export const EXERCICIOS_DAS_AULAS: ExercicioDaAula[] = [
  {
    "id": "m02-a01-d01",
    "moduloId": "modulo-02",
    "aula": 1,
    "origem": "derivado-da-aula",
    "tipo": "escolha",
    "enunciado": "Segundo a aula, a partir de que tensão uma instalação de transmissão faz parte da Rede Básica?",
    "alternativas": [
      "69 a 138 kV",
      "igual ou superior a 230 kV",
      "13,8 – 34,5 kV",
      "127 – 440 V"
    ],
    "gabarito": 1,
    "referencia": "a Rede Básica é o conjunto de instalações de transmissão em tensão igual ou superior a 230 kV",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "alternativa-correta",
    "fonte": {
      "arquivo": "Alexandria modulos/alexandria_modulo02.html",
      "campo": "aula-02-01 · bloco [15] (paragrafo)",
      "linha": 1519
    },
    "evidencias": [
      {
        "arquivo": "Alexandria modulos/alexandria_modulo02.html",
        "campo": "aula-02-01 · bloco [15] (paragrafo)",
        "linha": 1519,
        "trecho": "a Rede Básica é o conjunto de instalações de transmissão em tensão igual ou superior a 230 kV"
      }
    ]
  },
  {
    "id": "m02-a01-d02",
    "moduloId": "modulo-02",
    "aula": 1,
    "origem": "derivado-da-aula",
    "tipo": "escolha",
    "enunciado": "Quem se conecta abaixo da fronteira dos 230 kV paga qual tarifa, segundo a aula?",
    "alternativas": [
      "TUST",
      "TUSD",
      "CCC",
      "ESS"
    ],
    "gabarito": 1,
    "referencia": "Quem se conecta abaixo assina com a distribuidora (CUSD) e paga TUSD.",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "alternativa-correta",
    "fonte": {
      "arquivo": "Alexandria modulos/alexandria_modulo02.html",
      "campo": "aula-02-01 · bloco [16] (paragrafo)",
      "linha": 1521
    },
    "evidencias": [
      {
        "arquivo": "Alexandria modulos/alexandria_modulo02.html",
        "campo": "aula-02-01 · bloco [16] (paragrafo)",
        "linha": 1521,
        "trecho": "Quem se conecta abaixo assina com a distribuidora (CUSD) e paga TUSD."
      }
    ]
  },
  {
    "id": "m02-a01-d03",
    "moduloId": "modulo-02",
    "aula": 1,
    "origem": "derivado-da-aula",
    "tipo": "aberto",
    "enunciado": "A aula compara a rede a um sistema de transporte, mas avisa onde a analogia quebra. Onde ela quebra, e para que a aula diz que ela serve?",
    "gabarito": null,
    "referencia": "Carga espera no acostamento; eletricidade não espera em lugar nenhum. Não há pátio, não há estoque, não há \"chega amanhã\". Use a analogia para explicar a estrutura; nunca para explicar a operação.",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "Alexandria modulos/alexandria_modulo02.html",
      "campo": "aula-02-01 · bloco [5] (nota: Onde a analogia quebra)",
      "linha": 1485
    },
    "evidencias": [
      {
        "arquivo": "Alexandria modulos/alexandria_modulo02.html",
        "campo": "aula-02-01 · bloco [5] (nota: Onde a analogia quebra)",
        "linha": 1485,
        "trecho": "Carga espera no acostamento; eletricidade não espera em lugar nenhum. Não há pátio, não há estoque, não há \"chega amanhã\"."
      },
      {
        "arquivo": "Alexandria modulos/alexandria_modulo02.html",
        "campo": "aula-02-01 · bloco [5] (nota: Onde a analogia quebra)",
        "linha": 1485,
        "trecho": "Use a analogia para explicar a estrutura; nunca para explicar a operação."
      }
    ]
  },
  {
    "id": "m02-ex-01",
    "moduloId": "modulo-02",
    "aula": 2,
    "origem": "fonte",
    "tipo": "aberto",
    "enunciado": "Uma linha transmite potência fixa P. A tensão de operação é <b>dobrada</b> (mesmo condutor, mesma distância). O que acontece com a corrente e com as perdas resistivas? Justifique com as fórmulas.",
    "gabarito": null,
    "referencia": "Como P ≈ √3 × V × I × cos φ, dobrar V com P fixa faz a corrente <b>cair pela metade</b>. Como P<sub>perdas</sub> = 3 × R × I², corrente pela metade dá <span class=\"calc\">(½)² = ¼</span> — as perdas <b>caem a um quarto</b>. Generalizando: perdas ∝ (P/V)². É a equação inteira por trás da escada de tensões: 230, 345, 500, 765 kV são respostas econômicas a esse quadrado.",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "docs/alexandria-v2/extraction/m02/aparato.json",
      "campo": "exercicios.itens[0].enunciado.html",
      "linha": 2574
    },
    "evidencias": [
      {
        "arquivo": "docs/alexandria-v2/extraction/m02/aparato.json",
        "campo": "exercicios.itens[0].enunciado.texto",
        "linha": 2574,
        "trecho": "Uma linha transmite potência fixa P. A tensão de operação é dobrada (mesmo condutor, mesma distância). O que acontece com a corrente e com as perdas resistivas? Justifique com as fórmulas."
      },
      {
        "arquivo": "docs/alexandria-v2/extraction/m02/aparato.json",
        "campo": "exercicios.itens[0].resposta_de_referencia.paragrafos",
        "linha": 2574,
        "trecho": "Como P ≈ √3 × V × I × cos φ, dobrar V com P fixa faz a corrente cair pela metade. Como Pperdas = 3 × R × I², corrente pela metade dá (½)² = ¼ — as perdas caem a um quarto. Generalizando: perdas ∝ (P/V)². É a equação inteira por trás da escada de tensões: 230, 345, 500, 765 kV são respostas econômicas a esse quadrado."
      }
    ]
  },
  {
    "id": "m02-ex-02",
    "moduloId": "modulo-02",
    "aula": 2,
    "origem": "fonte",
    "tipo": "aberto",
    "enunciado": "Um bloco de <b>600 MW</b> é transmitido em <b>500 kV</b> trifásico com cos φ = 0,95. Estime a corrente total de linha. (Use √3 ≈ 1,73.)",
    "gabarito": null,
    "referencia": "I = P ÷ (√3 × V × cos φ) = <span class=\"calc\">600.000.000 ÷ (1,73 × 500.000 × 0,95) ≈ 730 A</span>. Repare na mágica da alta tensão: 600 MW — a carga de uma cidade grande — atravessando o país com menos de mil ampères. O mesmo bloco em 13,8 kV exigiria dezenas de milhares de ampères, fisicamente inviável.",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "docs/alexandria-v2/extraction/m02/aparato.json",
      "campo": "exercicios.itens[1].enunciado.html",
      "linha": 2583
    },
    "evidencias": [
      {
        "arquivo": "docs/alexandria-v2/extraction/m02/aparato.json",
        "campo": "exercicios.itens[1].enunciado.texto",
        "linha": 2583,
        "trecho": "Um bloco de 600 MW é transmitido em 500 kV trifásico com cos φ = 0,95. Estime a corrente total de linha. (Use √3 ≈ 1,73.)"
      },
      {
        "arquivo": "docs/alexandria-v2/extraction/m02/aparato.json",
        "campo": "exercicios.itens[1].resposta_de_referencia.paragrafos",
        "linha": 2583,
        "trecho": "I = P ÷ (√3 × V × cos φ) = 600.000.000 ÷ (1,73 × 500.000 × 0,95) ≈ 730 A. Repare na mágica da alta tensão: 600 MW — a carga de uma cidade grande — atravessando o país com menos de mil ampères. O mesmo bloco em 13,8 kV exigiria dezenas de milhares de ampères, fisicamente inviável."
      }
    ]
  },
  {
    "id": "m02-a02-d01",
    "moduloId": "modulo-02",
    "aula": 2,
    "origem": "derivado-da-aula",
    "tipo": "escolha",
    "enunciado": "Por que a metade 50 Hz de Itaipu chega ao Brasil por bipolos de corrente contínua?",
    "alternativas": [
      "distância muito longa",
      "interligação assíncrona",
      "travessias submarinas"
    ],
    "gabarito": 1,
    "referencia": "Segunda: interligação assíncrona. DC conecta sistemas que não batem na mesma frequência — é exatamente por isso que a metade 50 Hz de Itaipu (lado paraguaio) chega ao Brasil por bipolos DC de ±600 kV até Ibiúna/SP: não há como sincronizar 50 Hz com 60 Hz em AC.",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "alternativa-correta",
    "fonte": {
      "arquivo": "Alexandria modulos/alexandria_modulo02.html",
      "campo": "aula-02-02 · bloco [8] (paragrafo)",
      "linha": 1609
    },
    "evidencias": [
      {
        "arquivo": "Alexandria modulos/alexandria_modulo02.html",
        "campo": "aula-02-02 · bloco [8] (paragrafo)",
        "linha": 1609,
        "trecho": "Segunda: interligação assíncrona. DC conecta sistemas que não batem na mesma frequência — é exatamente por isso que a metade 50 Hz de Itaipu (lado paraguaio) chega ao Brasil por bipolos DC de ±600 kV até Ibiúna/SP: não há como sincronizar 50 Hz com 60 Hz em AC."
      }
    ]
  },
  {
    "id": "m02-a02-d02",
    "moduloId": "modulo-02",
    "aula": 2,
    "origem": "derivado-da-aula",
    "tipo": "escolha",
    "enunciado": "Dos cinco limites de uma linha, qual a aula chama de \"o teto absoluto\"?",
    "alternativas": [
      "Térmico",
      "De tensão",
      "De estabilidade",
      "De proteção"
    ],
    "gabarito": 0,
    "referencia": "Térmico — Corrente alta aquece o condutor; cabo quente dilata, cede em direção ao solo e perde resistência mecânica. É o teto absoluto.",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "alternativa-correta",
    "fonte": {
      "arquivo": "Alexandria modulos/alexandria_modulo02.html",
      "campo": "aula-02-02 · bloco [12] (tabela)",
      "linha": 1619
    },
    "evidencias": [
      {
        "arquivo": "Alexandria modulos/alexandria_modulo02.html",
        "campo": "aula-02-02 · bloco [12] (tabela)",
        "linha": 1619,
        "trecho": "Térmico — Corrente alta aquece o condutor; cabo quente dilata, cede em direção ao solo e perde resistência mecânica. É o teto absoluto."
      }
    ]
  },
  {
    "id": "m02-a03-d01",
    "moduloId": "modulo-02",
    "aula": 3,
    "origem": "derivado-da-aula",
    "tipo": "escolha",
    "enunciado": "Qual equipamento da subestação a aula descreve como o único capaz de interromper corrente de curto-circuito com segurança?",
    "alternativas": [
      "Seccionadora",
      "Disjuntor",
      "Religador",
      "Para-raios"
    ],
    "gabarito": 1,
    "referencia": "Disjuntor — Abre e fecha o circuito sob carga ou sob falha — É o único equipamento capaz de interromper corrente de curto-circuito com segurança.",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "alternativa-correta",
    "fonte": {
      "arquivo": "Alexandria modulos/alexandria_modulo02.html",
      "campo": "aula-02-03 · bloco [3] (tabela)",
      "linha": 1706
    },
    "evidencias": [
      {
        "arquivo": "Alexandria modulos/alexandria_modulo02.html",
        "campo": "aula-02-03 · bloco [3] (tabela)",
        "linha": 1706,
        "trecho": "Disjuntor — Abre e fecha o circuito sob carga ou sob falha — É o único equipamento capaz de interromper corrente de curto-circuito com segurança."
      }
    ]
  },
  {
    "id": "m02-a03-d02",
    "moduloId": "modulo-02",
    "aula": 3,
    "origem": "derivado-da-aula",
    "tipo": "aberto",
    "enunciado": "Que cinco qualidades a proteção precisa ter ao mesmo tempo, segundo a aula?",
    "gabarito": null,
    "referencia": "rápida (atua antes do dano se propagar), seletiva (desliga só o trecho necessário), sensível (detecta falhas reais), confiável (atua quando deve — e não atua quando não deve) e coordenada (os dispositivos trabalham na sequência correta).",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "Alexandria modulos/alexandria_modulo02.html",
      "campo": "aula-02-03 · bloco [5] (paragrafo)",
      "linha": 1723
    },
    "evidencias": [
      {
        "arquivo": "Alexandria modulos/alexandria_modulo02.html",
        "campo": "aula-02-03 · bloco [5] (paragrafo)",
        "linha": 1723,
        "trecho": "rápida (atua antes do dano se propagar), seletiva (desliga só o trecho necessário), sensível (detecta falhas reais), confiável (atua quando deve — e não atua quando não deve) e coordenada (os dispositivos trabalham na sequência correta)."
      }
    ]
  },
  {
    "id": "m02-a03-d03",
    "moduloId": "modulo-02",
    "aula": 3,
    "origem": "derivado-da-aula",
    "tipo": "aberto",
    "enunciado": "O que fica definido no ponto de conexão, segundo a aula?",
    "gabarito": null,
    "referencia": "Nele estão definidos: a tensão de fornecimento (logo, o grupo tarifário), a medição de faturamento — que para agentes do mercado livre segue os requisitos do Sistema de Medição para Faturamento (SMF) da CCEE —, os limites de responsabilidade por qualidade (os indicadores do PRODIST Módulo 8 que você estudou no Módulo 01 valem no ponto de conexão), e a titularidade dos ativos: da fronteira para dentro, transformador, cabine e proteção são do cliente — manutenção, perdas e riscos inclusos.",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "Alexandria modulos/alexandria_modulo02.html",
      "campo": "aula-02-03 · bloco [11] (paragrafo)",
      "linha": 1757
    },
    "evidencias": [
      {
        "arquivo": "Alexandria modulos/alexandria_modulo02.html",
        "campo": "aula-02-03 · bloco [11] (paragrafo)",
        "linha": 1757,
        "trecho": "Nele estão definidos: a tensão de fornecimento (logo, o grupo tarifário), a medição de faturamento — que para agentes do mercado livre segue os requisitos do Sistema de Medição para Faturamento (SMF) da CCEE —, os limites de responsabilidade por qualidade (os indicadores do PRODIST Módulo 8 que você estudou no Módulo 01 valem no ponto de conexão), e a titularidade dos ativos: da fronteira para dentro, transformador, cabine e proteção são do cliente — manutenção, perdas e riscos inclusos."
      }
    ]
  },
  {
    "id": "m02-a04-d01",
    "moduloId": "modulo-02",
    "aula": 4,
    "origem": "derivado-da-aula",
    "tipo": "aberto",
    "enunciado": "Como a aula define a carga líquida, e por que é ela, e não a carga total, que importa ao operador?",
    "gabarito": null,
    "referencia": "Carga líquida = Carga total − Geração solar − Geração eólica — É a curva líquida que define quanta geração despachável precisa estar pronta",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "Alexandria modulos/alexandria_modulo02.html",
      "campo": "aula-02-04 · bloco [5] (formula)",
      "linha": 1784
    },
    "evidencias": [
      {
        "arquivo": "Alexandria modulos/alexandria_modulo02.html",
        "campo": "aula-02-04 · bloco [5] (formula)",
        "linha": 1784,
        "trecho": "Carga líquida = Carga total − Geração solar − Geração eólica — É a curva líquida que define quanta geração despachável precisa estar pronta"
      }
    ]
  },
  {
    "id": "m02-a04-d02",
    "moduloId": "modulo-02",
    "aula": 4,
    "origem": "derivado-da-aula",
    "tipo": "escolha",
    "enunciado": "Na leitura da frequência que a aula propõe, o que indica que falta potência?",
    "alternativas": [
      "Frequência estável",
      "frequência caindo",
      "frequência subindo"
    ],
    "gabarito": 1,
    "referencia": "Frequência estável = equilíbrio; frequência caindo = falta potência; frequência subindo = sobra potência.",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "alternativa-correta",
    "fonte": {
      "arquivo": "Alexandria modulos/alexandria_modulo02.html",
      "campo": "aula-02-04 · bloco [10] (paragrafo)",
      "linha": 1835
    },
    "evidencias": [
      {
        "arquivo": "Alexandria modulos/alexandria_modulo02.html",
        "campo": "aula-02-04 · bloco [10] (paragrafo)",
        "linha": 1835,
        "trecho": "Frequência estável = equilíbrio; frequência caindo = falta potência; frequência subindo = sobra potência."
      }
    ]
  },
  {
    "id": "m02-a04-d03",
    "moduloId": "modulo-02",
    "aula": 4,
    "origem": "derivado-da-aula",
    "tipo": "aberto",
    "enunciado": "Quais recursos a aula lista para vencer a rampa do fim da tarde?",
    "gabarito": null,
    "referencia": "Hidrelétricas flexíveis (a vantagem estrutural brasileira), térmicas flexíveis, baterias (descarregam exatamente nessa janela), resposta da demanda (indústrias que deslocam consumo) e importação entre subsistemas.",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "Alexandria modulos/alexandria_modulo02.html",
      "campo": "aula-02-04 · bloco [11] (nota: Recursos que vencem a rampa)",
      "linha": 1837
    },
    "evidencias": [
      {
        "arquivo": "Alexandria modulos/alexandria_modulo02.html",
        "campo": "aula-02-04 · bloco [11] (nota: Recursos que vencem a rampa)",
        "linha": 1837,
        "trecho": "Hidrelétricas flexíveis (a vantagem estrutural brasileira), térmicas flexíveis, baterias (descarregam exatamente nessa janela), resposta da demanda (indústrias que deslocam consumo) e importação entre subsistemas."
      }
    ]
  },
  {
    "id": "m02-ex-03",
    "moduloId": "modulo-02",
    "aula": 5,
    "origem": "fonte",
    "tipo": "aberto",
    "enunciado": "Pilha simplificada: hidro fio d'água <b>10 GW</b> (custo ~0), eólica <b>8 GW</b> (~0), hidro reservatório <b>30 GW</b> (valor da água R$ 120), GN <b>12 GW</b> (CVU R$ 300), óleo <b>5 GW</b> (CVU R$ 900). Demanda = <b>52 GW</b>. Qual a usina marginal e o CMO? E se a demanda subir para 62 GW?",
    "gabarito": null,
    "referencia": "Empilhando do mais barato: 10 + 8 = 18 GW; + 30 de hidro = 48 GW — ainda faltam 4. Entra o GN: marginal = <b>GN</b>, despachando 4 dos 12 GW, e <span class=\"calc\">CMO = R$ 300/MWh</span>. Com 62 GW: 48 + 12 (GN cheio) = 60; faltam 2 → óleo na margem, <span class=\"calc\">CMO = R$ 900/MWh</span>. Repare que 10 GW a mais de demanda triplicaram o custo marginal — a pilha é convexa, e é por isso que pico custa desproporcionalmente caro.",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "docs/alexandria-v2/extraction/m02/aparato.json",
      "campo": "exercicios.itens[2].enunciado.html",
      "linha": 2592
    },
    "evidencias": [
      {
        "arquivo": "docs/alexandria-v2/extraction/m02/aparato.json",
        "campo": "exercicios.itens[2].enunciado.texto",
        "linha": 2592,
        "trecho": "Pilha simplificada: hidro fio d'água 10 GW (custo ~0), eólica 8 GW (~0), hidro reservatório 30 GW (valor da água R$ 120), GN 12 GW (CVU R$ 300), óleo 5 GW (CVU R$ 900). Demanda = 52 GW. Qual a usina marginal e o CMO? E se a demanda subir para 62 GW?"
      },
      {
        "arquivo": "docs/alexandria-v2/extraction/m02/aparato.json",
        "campo": "exercicios.itens[2].resposta_de_referencia.paragrafos",
        "linha": 2592,
        "trecho": "Empilhando do mais barato: 10 + 8 = 18 GW; + 30 de hidro = 48 GW — ainda faltam 4. Entra o GN: marginal = GN, despachando 4 dos 12 GW, e CMO = R$ 300/MWh. Com 62 GW: 48 + 12 (GN cheio) = 60; faltam 2 → óleo na margem, CMO = R$ 900/MWh. Repare que 10 GW a mais de demanda triplicaram o custo marginal — a pilha é convexa, e é por isso que pico custa desproporcionalmente caro."
      }
    ]
  },
  {
    "id": "m02-a05-d01",
    "moduloId": "modulo-02",
    "aula": 5,
    "origem": "derivado-da-aula",
    "tipo": "escolha",
    "enunciado": "Como a aula chama o custo de atender 1 MWh a mais de carga, hora a hora?",
    "alternativas": [
      "CVU",
      "CMO",
      "PLD",
      "ESS"
    ],
    "gabarito": 1,
    "referencia": "O resultado da otimização é o CMO — Custo Marginal de Operação: o custo de atender 1 MWh a mais de carga, hora a hora.",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "alternativa-correta",
    "fonte": {
      "arquivo": "Alexandria modulos/alexandria_modulo02.html",
      "campo": "aula-02-05 · bloco [6] (paragrafo)",
      "linha": 1875
    },
    "evidencias": [
      {
        "arquivo": "Alexandria modulos/alexandria_modulo02.html",
        "campo": "aula-02-05 · bloco [6] (paragrafo)",
        "linha": 1875,
        "trecho": "O resultado da otimização é o CMO — Custo Marginal de Operação: o custo de atender 1 MWh a mais de carga, hora a hora."
      }
    ]
  },
  {
    "id": "m02-a05-d02",
    "moduloId": "modulo-02",
    "aula": 5,
    "origem": "derivado-da-aula",
    "tipo": "escolha",
    "enunciado": "Na cadeia de modelos de otimização, qual faz a programação diária, com resolução horária?",
    "alternativas": [
      "NEWAVE",
      "DECOMP",
      "DESSEM"
    ],
    "gabarito": 2,
    "referencia": "DESSEM (programação diária, resolução horária)",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "alternativa-correta",
    "fonte": {
      "arquivo": "Alexandria modulos/alexandria_modulo02.html",
      "campo": "aula-02-05 · bloco [6] (paragrafo)",
      "linha": 1875
    },
    "evidencias": [
      {
        "arquivo": "Alexandria modulos/alexandria_modulo02.html",
        "campo": "aula-02-05 · bloco [6] (paragrafo)",
        "linha": 1875,
        "trecho": "DESSEM (programação diária, resolução horária)"
      }
    ]
  },
  {
    "id": "m02-a05-d03",
    "moduloId": "modulo-02",
    "aula": 5,
    "origem": "derivado-da-aula",
    "tipo": "aberto",
    "enunciado": "Quando uma usina é despachada fora da ordem de mérito, para onde vai o custo desse desvio, segundo a aula?",
    "gabarito": null,
    "referencia": "Esses desvios custam dinheiro, e esse dinheiro não entra no preço da energia: vira encargo (ESS), rateado entre consumidores.",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "Alexandria modulos/alexandria_modulo02.html",
      "campo": "aula-02-05 · bloco [13] (nota: Fora da ordem de mérito)",
      "linha": 1941
    },
    "evidencias": [
      {
        "arquivo": "Alexandria modulos/alexandria_modulo02.html",
        "campo": "aula-02-05 · bloco [13] (nota: Fora da ordem de mérito)",
        "linha": 1941,
        "trecho": "Esses desvios custam dinheiro, e esse dinheiro não entra no preço da energia: vira encargo (ESS), rateado entre consumidores."
      }
    ]
  },
  {
    "id": "m02-ex-04",
    "moduloId": "modulo-02",
    "aula": 6,
    "origem": "fonte",
    "tipo": "aberto",
    "enunciado": "Cite <b>três coisas que o ONS não faz</b> — e diga, para cada uma, qual instituição faz.",
    "gabarito": null,
    "referencia": "<b>Não define tarifas nem regula</b> — ANEEL. <b>Não contabiliza nem liquida energia</b> (e não publica o PLD) — CCEE. <b>Não planeja a expansão de longo prazo</b> — EPE/MME (o ONS planeja a <i>operação</i> e propõe ampliações via PAR/PEL, mas a expansão é política de planejamento). Bônus: não constrói nem é dono de linha — transmissoras concessionárias. Confundir esse mapa em conversa de setor desqualifica na primeira frase.",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "docs/alexandria-v2/extraction/m02/aparato.json",
      "campo": "exercicios.itens[3].enunciado.html",
      "linha": 2601
    },
    "evidencias": [
      {
        "arquivo": "docs/alexandria-v2/extraction/m02/aparato.json",
        "campo": "exercicios.itens[3].enunciado.texto",
        "linha": 2601,
        "trecho": "Cite três coisas que o ONS não faz — e diga, para cada uma, qual instituição faz."
      },
      {
        "arquivo": "docs/alexandria-v2/extraction/m02/aparato.json",
        "campo": "exercicios.itens[3].resposta_de_referencia.paragrafos",
        "linha": 2601,
        "trecho": "Não define tarifas nem regula — ANEEL. Não contabiliza nem liquida energia (e não publica o PLD) — CCEE. Não planeja a expansão de longo prazo — EPE/MME (o ONS planeja a operação e propõe ampliações via PAR/PEL, mas a expansão é política de planejamento). Bônus: não constrói nem é dono de linha — transmissoras concessionárias. Confundir esse mapa em conversa de setor desqualifica na primeira frase."
      }
    ]
  },
  {
    "id": "m02-a06-d01",
    "moduloId": "modulo-02",
    "aula": 6,
    "origem": "derivado-da-aula",
    "tipo": "escolha",
    "enunciado": "Qual etapa da cascata de horizontes transforma a diretriz mensal em programação horária?",
    "alternativas": [
      "PMO · Programa Mensal da Operação",
      "PDO · Programa Diário da Operação",
      "Tempo real",
      "Pós-operação"
    ],
    "gabarito": 1,
    "referencia": "PDO · Programa Diário da Operação — dia seguinte, por hora — Transforma a diretriz mensal em programação horária",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "alternativa-correta",
    "fonte": {
      "arquivo": "Alexandria modulos/alexandria_modulo02.html",
      "campo": "aula-02-06 · bloco [5] (tabela)",
      "linha": 1979
    },
    "evidencias": [
      {
        "arquivo": "Alexandria modulos/alexandria_modulo02.html",
        "campo": "aula-02-06 · bloco [5] (tabela)",
        "linha": 1979,
        "trecho": "PDO · Programa Diário da Operação — dia seguinte, por hora — Transforma a diretriz mensal em programação horária"
      }
    ]
  },
  {
    "id": "m02-a06-d02",
    "moduloId": "modulo-02",
    "aula": 6,
    "origem": "derivado-da-aula",
    "tipo": "aberto",
    "enunciado": "Segundo a aula, como se dividem os papéis entre o SCADA, o EMS e o operador?",
    "gabarito": null,
    "referencia": "Em resumo: o SCADA enxerga; o EMS pensa; o operador decide.",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "Alexandria modulos/alexandria_modulo02.html",
      "campo": "aula-02-06 · bloco [8] (paragrafo)",
      "linha": 1994
    },
    "evidencias": [
      {
        "arquivo": "Alexandria modulos/alexandria_modulo02.html",
        "campo": "aula-02-06 · bloco [8] (paragrafo)",
        "linha": 1994,
        "trecho": "Em resumo: o SCADA enxerga; o EMS pensa; o operador decide."
      }
    ]
  },
  {
    "id": "m02-ex-09",
    "moduloId": "modulo-02",
    "aula": 7,
    "origem": "fonte",
    "tipo": "aberto",
    "enunciado": "Uma bateria de <b>20 MW / 80 MWh</b> é instalada para ajudar na rampa do fim da tarde. (a) Por quanto tempo ela entrega a potência máxima? (b) Por que é tecnicamente errado dizer que ela \"gera\" energia?",
    "gabarito": null,
    "referencia": "(a) Duração = energia ÷ potência = 80 MWh ÷ 20 MW = <b>4 horas</b> na potência máxima (desconsiderando perdas e profundidade de descarga). Vocação perfeita para a rampa: descarrega das 17h às 21h.<br><br>(b) Porque a bateria <b>não converte nenhuma fonte primária</b> em eletricidade — ela armazena energia gerada antes (de sobra solar do meio-dia, por exemplo) e a devolve depois. É deslocamento temporal, não geração. Na prática isso importa: a bateria só vale o spread entre o custo da energia que a carrega e o valor da energia que ela substitui — Erro 4 da tabela de mitos.",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "docs/alexandria-v2/extraction/m02/aparato.json",
      "campo": "exercicios.itens[8].enunciado.html",
      "linha": 2648
    },
    "evidencias": [
      {
        "arquivo": "docs/alexandria-v2/extraction/m02/aparato.json",
        "campo": "exercicios.itens[8].enunciado.texto",
        "linha": 2648,
        "trecho": "Uma bateria de 20 MW / 80 MWh é instalada para ajudar na rampa do fim da tarde. (a) Por quanto tempo ela entrega a potência máxima? (b) Por que é tecnicamente errado dizer que ela \"gera\" energia?"
      },
      {
        "arquivo": "docs/alexandria-v2/extraction/m02/aparato.json",
        "campo": "exercicios.itens[8].resposta_de_referencia.paragrafos",
        "linha": 2648,
        "trecho": "(a) Duração = energia ÷ potência = 80 MWh ÷ 20 MW = 4 horas na potência máxima (desconsiderando perdas e profundidade de descarga). Vocação perfeita para a rampa: descarrega das 17h às 21h. (b) Porque a bateria não converte nenhuma fonte primária em eletricidade — ela armazena energia gerada antes (de sobra solar do meio-dia, por exemplo) e a devolve depois. É deslocamento temporal, não geração. Na prática isso importa: a bateria só vale o spread entre o custo da energia que a carrega e o valor da energia que ela substitui — Erro 4 da tabela de mitos."
      }
    ],
    "alertas": [
      "Vínculo mecânico: a fonte não prende este exercício a aula; \"potência máxima\" aparece só na Aula 7.",
      "O enunciado (20 MW / 80 MWh) é o cenário-padrão do INST·06 (Aula 07): a resposta (a) é o calculado do instrumento. O cálculo do INST·06 só abre depois da tentativa deste exercício (abreDepoisDoExercicio)."
    ]
  },
  {
    "id": "m02-a07-d01",
    "moduloId": "modulo-02",
    "aula": 7,
    "origem": "derivado-da-aula",
    "tipo": "escolha",
    "enunciado": "Qual reserva a aula compara ao \"jogador aquecido no banco, pronto para entrar agora\"?",
    "alternativas": [
      "Girante (spinning)",
      "Operativa",
      "Fria"
    ],
    "gabarito": 0,
    "referencia": "Girante (spinning) — Usinas já sincronizadas, girando abaixo da capacidade — segundos — Jogador aquecido no banco, pronto para entrar agora",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "alternativa-correta",
    "fonte": {
      "arquivo": "Alexandria modulos/alexandria_modulo02.html",
      "campo": "aula-02-07 · bloco [2] (tabela)",
      "linha": 2049
    },
    "evidencias": [
      {
        "arquivo": "Alexandria modulos/alexandria_modulo02.html",
        "campo": "aula-02-07 · bloco [2] (tabela)",
        "linha": 2049,
        "trecho": "Girante (spinning) — Usinas já sincronizadas, girando abaixo da capacidade — segundos — Jogador aquecido no banco, pronto para entrar agora"
      }
    ]
  },
  {
    "id": "m02-a07-d02",
    "moduloId": "modulo-02",
    "aula": 7,
    "origem": "derivado-da-aula",
    "tipo": "escolha",
    "enunciado": "Qual serviço ancilar é a capacidade de algumas usinas de partir sem energia externa e energizar a rede do zero após um colapso total?",
    "alternativas": [
      "Controle de frequência",
      "Suporte de tensão / reativo",
      "Reserva de potência",
      "Black start"
    ],
    "gabarito": 3,
    "referencia": "Black start — A capacidade de algumas usinas de partir sem energia externa e energizar a rede do zero após um colapso total.",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "alternativa-correta",
    "fonte": {
      "arquivo": "Alexandria modulos/alexandria_modulo02.html",
      "campo": "aula-02-07 · bloco [7] (tabela)",
      "linha": 2070
    },
    "evidencias": [
      {
        "arquivo": "Alexandria modulos/alexandria_modulo02.html",
        "campo": "aula-02-07 · bloco [7] (tabela)",
        "linha": 2070,
        "trecho": "Black start — A capacidade de algumas usinas de partir sem energia externa e energizar a rede do zero após um colapso total."
      }
    ]
  },
  {
    "id": "m02-a07-d03",
    "moduloId": "modulo-02",
    "aula": 7,
    "origem": "derivado-da-aula",
    "tipo": "aberto",
    "enunciado": "Por que, segundo a aula, solar e eólica aumentam o valor dos serviços ancilares — e por que isso não é argumento contra elas?",
    "gabarito": null,
    "referencia": "Solar e eólica conectadas por inversores trazem variabilidade, menor inércia síncrona e maior dependência de previsão. Isso não é argumento contra renováveis — é argumento a favor de operação moderna",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "Alexandria modulos/alexandria_modulo02.html",
      "campo": "aula-02-07 · bloco [9] (paragrafo)",
      "linha": 2087
    },
    "evidencias": [
      {
        "arquivo": "Alexandria modulos/alexandria_modulo02.html",
        "campo": "aula-02-07 · bloco [9] (paragrafo)",
        "linha": 2087,
        "trecho": "Solar e eólica conectadas por inversores trazem variabilidade, menor inércia síncrona e maior dependência de previsão. Isso não é argumento contra renováveis — é argumento a favor de operação moderna"
      }
    ]
  },
  {
    "id": "m02-ex-05",
    "moduloId": "modulo-02",
    "aula": 8,
    "origem": "fonte",
    "tipo": "aberto",
    "enunciado": "Por que é tecnicamente correto dizer que <b>2001 foi uma crise de energia, não de potência</b>? Responda em até quatro frases usando o vocabulário do Módulo 01.",
    "gabarito": null,
    "referencia": "Potência (MW) é capacidade instantânea; energia (MWh) é estoque ao longo do tempo. Em 2001, o parque tinha MW suficientes para atender o pico — o que faltou foi <b>estoque</b>: anos de hidrologia ruim e subinvestimento esvaziaram os reservatórios, e um sistema hidro-dominado sem água não tem MWh para sustentar os meses seguintes. Por isso a solução foi racionar <b>consumo acumulado</b> (meta de ~20% de redução de kWh), não cortar picos. É a distinção kW × kWh decidindo política nacional — e a origem institucional da reforma de 2004.",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "docs/alexandria-v2/extraction/m02/aparato.json",
      "campo": "exercicios.itens[4].enunciado.html",
      "linha": 2610
    },
    "evidencias": [
      {
        "arquivo": "docs/alexandria-v2/extraction/m02/aparato.json",
        "campo": "exercicios.itens[4].enunciado.texto",
        "linha": 2610,
        "trecho": "Por que é tecnicamente correto dizer que 2001 foi uma crise de energia, não de potência? Responda em até quatro frases usando o vocabulário do Módulo 01."
      },
      {
        "arquivo": "docs/alexandria-v2/extraction/m02/aparato.json",
        "campo": "exercicios.itens[4].resposta_de_referencia.paragrafos",
        "linha": 2610,
        "trecho": "Potência (MW) é capacidade instantânea; energia (MWh) é estoque ao longo do tempo. Em 2001, o parque tinha MW suficientes para atender o pico — o que faltou foi estoque: anos de hidrologia ruim e subinvestimento esvaziaram os reservatórios, e um sistema hidro-dominado sem água não tem MWh para sustentar os meses seguintes. Por isso a solução foi racionar consumo acumulado (meta de ~20% de redução de kWh), não cortar picos. É a distinção kW × kWh decidindo política nacional — e a origem institucional da reforma de 2004."
      }
    ]
  },
  {
    "id": "m02-ex-06",
    "moduloId": "modulo-02",
    "aula": 8,
    "origem": "fonte",
    "tipo": "aberto",
    "enunciado": "Dois sistemas perdem a <b>mesma usina de 6 GW</b> com a mesma carga. O sistema A é hidro-dominado clássico; o sistema B tem alta penetração de geração por inversor. Compare RoCoF, nadir e risco de ERAC — e explique a causa física.",
    "gabarito": null,
    "referencia": "No sistema B a frequência cai <b>mais rápido</b> (RoCoF maior) e <b>mais fundo</b> (nadir menor), com risco maior de cruzar o limiar do ERAC. Causa: inércia é energia cinética de massa girante sincronizada; inversores não contribuem massa, então o mesmo desbalanço ΔP encontra menos \"amortecedor\" — RoCoF ∝ ΔP/(2H). A inércia não corrige nada: ela <b>compra tempo</b> para a regulação primária agir. Menos inércia = menos tempo = controles precisam ser mais rápidos (grid-forming, resposta rápida de frequência) — a conversa de engenharia da década.",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "docs/alexandria-v2/extraction/m02/aparato.json",
      "campo": "exercicios.itens[5].enunciado.html",
      "linha": 2619
    },
    "evidencias": [
      {
        "arquivo": "docs/alexandria-v2/extraction/m02/aparato.json",
        "campo": "exercicios.itens[5].enunciado.texto",
        "linha": 2619,
        "trecho": "Dois sistemas perdem a mesma usina de 6 GW com a mesma carga. O sistema A é hidro-dominado clássico; o sistema B tem alta penetração de geração por inversor. Compare RoCoF, nadir e risco de ERAC — e explique a causa física."
      },
      {
        "arquivo": "docs/alexandria-v2/extraction/m02/aparato.json",
        "campo": "exercicios.itens[5].resposta_de_referencia.paragrafos",
        "linha": 2619,
        "trecho": "No sistema B a frequência cai mais rápido (RoCoF maior) e mais fundo (nadir menor), com risco maior de cruzar o limiar do ERAC. Causa: inércia é energia cinética de massa girante sincronizada; inversores não contribuem massa, então o mesmo desbalanço ΔP encontra menos \"amortecedor\" — RoCoF ∝ ΔP/(2H). A inércia não corrige nada: ela compra tempo para a regulação primária agir. Menos inércia = menos tempo = controles precisam ser mais rápidos (grid-forming, resposta rápida de frequência) — a conversa de engenharia da década."
      }
    ]
  },
  {
    "id": "m02-a08-d01",
    "moduloId": "modulo-02",
    "aula": 8,
    "origem": "derivado-da-aula",
    "tipo": "escolha",
    "enunciado": "Qual critério de segurança exige que o sistema suporte a perda de qualquer elemento único relevante sem corte de carga?",
    "alternativas": [
      "N-1",
      "ERAC",
      "CAG",
      "RoCoF"
    ],
    "gabarito": 0,
    "referencia": "O critério de segurança que governa planejamento e operação é o N-1: o sistema deve suportar a perda de qualquer elemento único relevante — linha, transformador, usina — sem corte de carga nem violação de limites.",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "alternativa-correta",
    "fonte": {
      "arquivo": "Alexandria modulos/alexandria_modulo02.html",
      "campo": "aula-02-08 · bloco [6] (paragrafo)",
      "linha": 2176
    },
    "evidencias": [
      {
        "arquivo": "Alexandria modulos/alexandria_modulo02.html",
        "campo": "aula-02-08 · bloco [6] (paragrafo)",
        "linha": 2176,
        "trecho": "O critério de segurança que governa planejamento e operação é o N-1: o sistema deve suportar a perda de qualquer elemento único relevante — linha, transformador, usina — sem corte de carga nem violação de limites."
      }
    ]
  },
  {
    "id": "m02-a08-d02",
    "moduloId": "modulo-02",
    "aula": 8,
    "origem": "derivado-da-aula",
    "tipo": "aberto",
    "enunciado": "Qual é a lição que a aula tira da noite de Itaipu, em 2009?",
    "gabarito": null,
    "referencia": "Lição: o critério N-1 protege contra falhas simples, não contra modos de falha comuns que derrubam três circuitos do mesmo corredor de uma vez.",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "Alexandria modulos/alexandria_modulo02.html",
      "campo": "aula-02-08 · bloco [15] (paragrafo)",
      "linha": 2245
    },
    "evidencias": [
      {
        "arquivo": "Alexandria modulos/alexandria_modulo02.html",
        "campo": "aula-02-08 · bloco [15] (paragrafo)",
        "linha": 2245,
        "trecho": "Lição: o critério N-1 protege contra falhas simples, não contra modos de falha comuns que derrubam três circuitos do mesmo corredor de uma vez."
      }
    ]
  },
  {
    "id": "m02-a09-d01",
    "moduloId": "modulo-02",
    "aula": 9,
    "origem": "derivado-da-aula",
    "tipo": "escolha",
    "enunciado": "Onde, segundo a aula, acontece a maior parte das perdas técnicas?",
    "alternativas": [
      "Rede Básica (transmissão)",
      "nos níveis baixos de tensão",
      "em altíssima tensão"
    ],
    "gabarito": 1,
    "referencia": "a maior parte acontece nos níveis baixos de tensão, onde a corrente é alta",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "alternativa-correta",
    "fonte": {
      "arquivo": "Alexandria modulos/alexandria_modulo02.html",
      "campo": "aula-02-09 · bloco [1] (paragrafo)",
      "linha": 2279
    },
    "evidencias": [
      {
        "arquivo": "Alexandria modulos/alexandria_modulo02.html",
        "campo": "aula-02-09 · bloco [1] (paragrafo)",
        "linha": 2279,
        "trecho": "a maior parte acontece nos níveis baixos de tensão, onde a corrente é alta"
      }
    ]
  },
  {
    "id": "m02-a09-d02",
    "moduloId": "modulo-02",
    "aula": 9,
    "origem": "derivado-da-aula",
    "tipo": "aberto",
    "enunciado": "Quem paga pela energia perdida dentro do nível regulatório, e o que acontece com o que excede esse nível?",
    "gabarito": null,
    "referencia": "Esse volume de energia perdida é comprado pela distribuidora e repassado à tarifa de todos os consumidores: você paga, todo mês, por energia que nunca chegou a ninguém. O que exceder o nível regulatório sai da margem do acionista — é o incentivo econômico para combater o furto.",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "Alexandria modulos/alexandria_modulo02.html",
      "campo": "aula-02-09 · bloco [7] (paragrafo)",
      "linha": 2302
    },
    "evidencias": [
      {
        "arquivo": "Alexandria modulos/alexandria_modulo02.html",
        "campo": "aula-02-09 · bloco [7] (paragrafo)",
        "linha": 2302,
        "trecho": "Esse volume de energia perdida é comprado pela distribuidora e repassado à tarifa de todos os consumidores: você paga, todo mês, por energia que nunca chegou a ninguém. O que exceder o nível regulatório sai da margem do acionista — é o incentivo econômico para combater o furto."
      }
    ]
  },
  {
    "id": "m02-a09-d03",
    "moduloId": "modulo-02",
    "aula": 9,
    "origem": "derivado-da-aula",
    "tipo": "aberto",
    "enunciado": "Por que, no mercado livre, o consumidor compra mais energia do que mede no seu ponto?",
    "gabarito": null,
    "referencia": "a contabilização da CCEE aplica fatores de perda da Rede Básica — na prática, o consumidor livre compra cerca de 3% a mais do que mede no seu ponto para cobrir o transporte até ele.",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "Alexandria modulos/alexandria_modulo02.html",
      "campo": "aula-02-09 · bloco [8] (paragrafo)",
      "linha": 2304
    },
    "evidencias": [
      {
        "arquivo": "Alexandria modulos/alexandria_modulo02.html",
        "campo": "aula-02-09 · bloco [8] (paragrafo)",
        "linha": 2304,
        "trecho": "a contabilização da CCEE aplica fatores de perda da Rede Básica — na prática, o consumidor livre compra cerca de 3% a mais do que mede no seu ponto para cobrir o transporte até ele."
      }
    ]
  },
  {
    "id": "m02-ex-07",
    "moduloId": "modulo-02",
    "aula": 10,
    "origem": "fonte",
    "tipo": "aberto",
    "enunciado": "Explique <b>\"por que uma empresa no mercado livre continua pagando a distribuidora\"</b> em três versões: criança de 12 anos, CFO industrial, especialista de setor.",
    "gabarito": null,
    "referencia": "<b>12 anos:</b> \"Você pode escolher de quem compra a água, mas o cano que traz a água até sua casa é um só, é da empresa da sua rua, e o aluguel do cano todo mundo paga sempre.\"<br><br><b>CFO:</b> \"A migração ao ACL troca o fornecedor da <i>energia</i> — a mercadoria. O <i>fio</i> é monopólio regulado da distribuidora local: continuamos pagando TUSD sobre demanda e energia, mais encargos. O ganho do ACL vem da parcela energia; a parcela fio só se otimiza por enquadramento contratual. Qualquer proposta que some os dois sem separar está inflando a economia.\"<br><br><b>Especialista:</b> \"O acesso permanece regido pelo CUSD com a concessionária de distribuição, com faturamento de TUSD (demanda e energia) homologado pela ANEEL — incluindo Fio B, repasses de Fio A/TUST, perdas regulatórias e encargos —, independentemente do ambiente de contratação da energia (ACR/ACL). A desverticalização separou commodity de rede; a rede permanece monopólio natural remunerado por tarifa de uso, nos termos da REN 1.000/2021.\"",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "docs/alexandria-v2/extraction/m02/aparato.json",
      "campo": "exercicios.itens[6].enunciado.html",
      "linha": 2628
    },
    "evidencias": [
      {
        "arquivo": "docs/alexandria-v2/extraction/m02/aparato.json",
        "campo": "exercicios.itens[6].enunciado.texto",
        "linha": 2628,
        "trecho": "Explique \"por que uma empresa no mercado livre continua pagando a distribuidora\" em três versões: criança de 12 anos, CFO industrial, especialista de setor."
      },
      {
        "arquivo": "docs/alexandria-v2/extraction/m02/aparato.json",
        "campo": "exercicios.itens[6].resposta_de_referencia.paragrafos",
        "linha": 2628,
        "trecho": "12 anos: \"Você pode escolher de quem compra a água, mas o cano que traz a água até sua casa é um só, é da empresa da sua rua, e o aluguel do cano todo mundo paga sempre.\" CFO: \"A migração ao ACL troca o fornecedor da energia — a mercadoria. O fio é monopólio regulado da distribuidora local: continuamos pagando TUSD sobre demanda e energia, mais encargos. O ganho do ACL vem da parcela energia; a parcela fio só se otimiza por enquadramento contratual. Qualquer proposta que some os dois sem separar está inflando a economia.\" Especialista: \"O acesso permanece regido pelo CUSD com a concessionária de distribuição, com faturamento de TUSD (demanda e energia) homologado pela ANEEL — incluindo Fio B, repasses de Fio A/TUST, perdas regulatórias e encargos —, independentemente do ambiente de contratação da energia (ACR/ACL). A desverticalização separou commodity de rede; a rede permanece monopólio natural remunerado por tarifa de uso, nos termos da REN 1.000/2021.\""
      }
    ]
  },
  {
    "id": "m02-ex-08",
    "moduloId": "modulo-02",
    "aula": 10,
    "origem": "fonte",
    "tipo": "aberto",
    "enunciado": "Um executivo com parque eólico no NE desabafa: <i>\"Minha usina foi cortada na terça — e no mesmo dia o PLD do Sudeste estava alto. Como isso faz sentido?\"</i> Responda em até oito linhas, com mecanismo e linguagem segura NIVAR.",
    "gabarito": null,
    "referencia": "\"Faz sentido físico, ainda que doa no caixa: a energia barata do seu parque só chega ao Sudeste se couber no intercâmbio. Com a interface saturada — e com as restrições operativas endurecidas desde 2023 —, o ONS corta geração no NE por segurança ou excesso local, enquanto o SE atende a ponta com térmica cara: os submercados se separam, e o seu corte e o PLD alto deles são duas faces da mesma restrição. Dentro do desenho atual, esse custo não aparece no preço do submercado — vira encargo e receita perdida, e a compensação do constrained-off ainda é disputa regulatória em andamento na ANEEL/MME. O que dá para fazer hoje é <b>medir a exposição</b>: histórico de cortes por razão, horas de saturação da interface, spread NE–SE — é exatamente a camada que o Brazil Pulse monitora. Quantificado o risco, as decisões de contrato e de tese de investimento ficam suas — com número, não com narrativa.\"",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "docs/alexandria-v2/extraction/m02/aparato.json",
      "campo": "exercicios.itens[7].enunciado.html",
      "linha": 2639
    },
    "evidencias": [
      {
        "arquivo": "docs/alexandria-v2/extraction/m02/aparato.json",
        "campo": "exercicios.itens[7].enunciado.texto",
        "linha": 2639,
        "trecho": "Um executivo com parque eólico no NE desabafa: \"Minha usina foi cortada na terça — e no mesmo dia o PLD do Sudeste estava alto. Como isso faz sentido?\" Responda em até oito linhas, com mecanismo e linguagem segura NIVAR."
      },
      {
        "arquivo": "docs/alexandria-v2/extraction/m02/aparato.json",
        "campo": "exercicios.itens[7].resposta_de_referencia.paragrafos",
        "linha": 2639,
        "trecho": "\"Faz sentido físico, ainda que doa no caixa: a energia barata do seu parque só chega ao Sudeste se couber no intercâmbio. Com a interface saturada — e com as restrições operativas endurecidas desde 2023 —, o ONS corta geração no NE por segurança ou excesso local, enquanto o SE atende a ponta com térmica cara: os submercados se separam, e o seu corte e o PLD alto deles são duas faces da mesma restrição. Dentro do desenho atual, esse custo não aparece no preço do submercado — vira encargo e receita perdida, e a compensação do constrained-off ainda é disputa regulatória em andamento na ANEEL/MME. O que dá para fazer hoje é medir a exposição: histórico de cortes por razão, horas de saturação da interface, spread NE–SE — é exatamente a camada que o Brazil Pulse monitora. Quantificado o risco, as decisões de contrato e de tese de investimento ficam suas — com número, não com narrativa.\""
      }
    ]
  },
  {
    "id": "m02-ex-10",
    "moduloId": "modulo-02",
    "aula": 10,
    "origem": "fonte",
    "tipo": "aberto",
    "enunciado": "Numa tarde de muito vento no Nordeste, uma térmica cara é despachada no Sudeste. Dê <b>duas razões distintas</b> que tornam isso tecnicamente correto — uma de rede, uma de segurança elétrica.",
    "gabarito": null,
    "referencia": "<b>Razão de rede (escoamento):</b> o intercâmbio NE→SE está no limite — a energia barata existe, mas não cabe no fio. O SE precisa ser atendido por geração local, mesmo cara (constrained-on), enquanto o vento pode estar sendo cortado do outro lado (constrained-off).<br><br><b>Razão de segurança elétrica:</b> a térmica é necessária <i>onde está</i> — suporte de tensão na região, reserva local, estabilidade, critério N-1. O sistema não busca custo mínimo absoluto; busca custo mínimo <b>sujeito a restrições de segurança e física da rede</b>. O sobrecusto das duas razões não aparece no PLD: vira ESS (Aula 10).",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "docs/alexandria-v2/extraction/m02/aparato.json",
      "campo": "exercicios.itens[9].enunciado.html",
      "linha": 2658
    },
    "evidencias": [
      {
        "arquivo": "docs/alexandria-v2/extraction/m02/aparato.json",
        "campo": "exercicios.itens[9].enunciado.texto",
        "linha": 2658,
        "trecho": "Numa tarde de muito vento no Nordeste, uma térmica cara é despachada no Sudeste. Dê duas razões distintas que tornam isso tecnicamente correto — uma de rede, uma de segurança elétrica."
      },
      {
        "arquivo": "docs/alexandria-v2/extraction/m02/aparato.json",
        "campo": "exercicios.itens[9].resposta_de_referencia.paragrafos",
        "linha": 2658,
        "trecho": "Razão de rede (escoamento): o intercâmbio NE→SE está no limite — a energia barata existe, mas não cabe no fio. O SE precisa ser atendido por geração local, mesmo cara (constrained-on), enquanto o vento pode estar sendo cortado do outro lado (constrained-off). Razão de segurança elétrica: a térmica é necessária onde está — suporte de tensão na região, reserva local, estabilidade, critério N-1. O sistema não busca custo mínimo absoluto; busca custo mínimo sujeito a restrições de segurança e física da rede. O sobrecusto das duas razões não aparece no PLD: vira ESS (Aula 10)."
      }
    ],
    "alertas": [
      "Vínculo mecânico: a fonte não prende este exercício a aula; \"térmica cara\" aparece nas Aulas 5, 10; vai para a última, a 10."
    ]
  },
  {
    "id": "m02-a10-d01",
    "moduloId": "modulo-02",
    "aula": 10,
    "origem": "derivado-da-aula",
    "tipo": "escolha",
    "enunciado": "Quando a restrição está dentro de um submercado, onde vai parar o sobrecusto do redespacho, segundo a aula?",
    "alternativas": [
      "PLD",
      "ESS",
      "TUST",
      "RAP"
    ],
    "gabarito": 1,
    "referencia": "O sobrecusto do redespacho não aparece em preço nenhum: vira ESS — Encargos de Serviços do Sistema — rateado entre os consumidores na liquidação da CCEE.",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "alternativa-correta",
    "fonte": {
      "arquivo": "Alexandria modulos/alexandria_modulo02.html",
      "campo": "aula-02-10 · bloco [13] (paragrafo)",
      "linha": 2391
    },
    "evidencias": [
      {
        "arquivo": "Alexandria modulos/alexandria_modulo02.html",
        "campo": "aula-02-10 · bloco [13] (paragrafo)",
        "linha": 2391,
        "trecho": "O sobrecusto do redespacho não aparece em preço nenhum: vira ESS — Encargos de Serviços do Sistema — rateado entre os consumidores na liquidação da CCEE."
      }
    ]
  },
  {
    "id": "m02-a10-d02",
    "moduloId": "modulo-02",
    "aula": 10,
    "origem": "derivado-da-aula",
    "tipo": "escolha",
    "enunciado": "Como as transmissoras recebem a RAP, segundo a aula?",
    "alternativas": [
      "por MWh transportado",
      "por disponibilidade",
      "por submercado"
    ],
    "gabarito": 1,
    "referencia": "recebida por disponibilidade: a linha ganha por existir e estar disponível, com desconto (Parcela Variável) quando fica indisponível. A linha não ganha por MWh transportado.",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "alternativa-correta",
    "fonte": {
      "arquivo": "Alexandria modulos/alexandria_modulo02.html",
      "campo": "aula-02-10 · bloco [6] (paragrafo)",
      "linha": 2379
    },
    "evidencias": [
      {
        "arquivo": "Alexandria modulos/alexandria_modulo02.html",
        "campo": "aula-02-10 · bloco [6] (paragrafo)",
        "linha": 2379,
        "trecho": "recebida por disponibilidade: a linha ganha por existir e estar disponível, com desconto (Parcela Variável) quando fica indisponível. A linha não ganha por MWh transportado."
      }
    ]
  }
];

export const EXERCICIOS_DO_MODULO: ExercicioDoModulo[] = [];

export const PROVAS: ProvaDoModulo[] = [
  {
    "moduloId": "modulo-02",
    "criterio": "Quiz de fluência. Cada resposta tem feedback explicativo. O critério de domínio do módulo é acertar pelo menos 8 de 10 sem consultar.",
    "acertosMinimos": 8,
    "total": 10,
    "questoes": [
      {
        "id": "m02-quiz-q01",
        "enunciado": "Por que o sistema elétrico precisa equilibrar geração e consumo a cada segundo?",
        "alternativas": [
          "Porque a regulação da ANEEL exige relatórios em tempo real",
          "Porque eletricidade, em escala de rede, não se armazena — todo desbalanço vira desvio de frequência imediatamente",
          "Porque as térmicas não podem ser desligadas depois de acionadas",
          "Para reduzir as perdas técnicas da transmissão"
        ],
        "correta": 1,
        "explicacao": "É a tese central do módulo. Sem estoque no meio do caminho, geração ≠ consumo vira desvio de frequência na hora — e dessa única restrição derivam operador central, reservas, serviços ancilares, proteção automática e a separação energia × fio.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m02/aparato.json",
          "campo": "avaliacao.questoes[0]",
          "linha": 3676
        }
      },
      {
        "id": "m02-quiz-q02",
        "enunciado": "O que define a Rede Básica no Brasil?",
        "alternativas": [
          "Todas as linhas operadas por empresas estatais",
          "As instalações de transmissão em tensão igual ou superior a 230 kV",
          "Apenas as linhas de 500 kV e os elos HVDC",
          "As linhas construídas após a Lei 9.648/1998"
        ],
        "correta": 1,
        "explicacao": "Rede Básica = transmissão ≥ 230 kV, operada centralizadamente pelo ONS, acessada via CUST e remunerada via TUST. Abaixo dela ficam as DIT e as redes de distribuição — é fronteira de regime jurídico, de operador e de cobrança.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m02/aparato.json",
          "campo": "avaliacao.questoes[1]",
          "linha": 3687
        }
      },
      {
        "id": "m02-quiz-q03",
        "enunciado": "Para transmitir a mesma potência, dobrar a tensão da linha faz as perdas resistivas...",
        "alternativas": [
          "Caírem pela metade",
          "Caírem a um quarto",
          "Dobrarem",
          "Permanecerem iguais"
        ],
        "correta": 1,
        "explicacao": "P ≈ √3·V·I·cosφ: dobrar V corta I pela metade. Como perdas = 3·R·I², metade da corrente dá um quarto das perdas. Esse quadrado é a razão de existir de toda a escada de tensões — de 230 a 765 kV — e dos bipolos HVDC.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m02/aparato.json",
          "campo": "avaliacao.questoes[2]",
          "linha": 3698
        }
      },
      {
        "id": "m02-quiz-q04",
        "enunciado": "Qual destas funções NÃO é do ONS?",
        "alternativas": [
          "Despachar as usinas do SIN em tempo real",
          "Coordenar a recomposição do sistema após perturbações",
          "Definir as tarifas de uso da distribuição",
          "Administrar os contratos de uso da transmissão (CUST)"
        ],
        "correta": 2,
        "explicacao": "Tarifa é ANEEL. O ONS opera, planeja a operação, administra a transmissão e coordena recomposição — não tarifa, não vende energia (CCEE liquida o mercado), não planeja a expansão (EPE/MME). Confundir esse mapa desqualifica em uma frase.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m02/aparato.json",
          "campo": "avaliacao.questoes[3]",
          "linha": 3704
        }
      },
      {
        "id": "m02-quiz-q05",
        "enunciado": "No despacho brasileiro, o 'custo' que posiciona a hidroeletricidade na ordem de mérito é...",
        "alternativas": [
          "Zero, porque água não tem custo de combustível",
          "O valor da água — custo de oportunidade calculado pela cadeia NEWAVE/DECOMP/DESSEM",
          "O CVU declarado pelo gerador hidrelétrico",
          "O PLD do dia anterior"
        ],
        "correta": 1,
        "explicacao": "Água não custa, mas turbinar hoje custa não tê-la na estiagem. Esse custo de oportunidade — o valor da água — é calculado pelos modelos, não declarado, e na maior parte das horas é ele que precifica o Brasil.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m02/aparato.json",
          "campo": "avaliacao.questoes[4]",
          "linha": 3715
        }
      },
      {
        "id": "m02-quiz-q06",
        "enunciado": "A frequência do SIN caiu para 59,7 Hz. O que isso indica?",
        "alternativas": [
          "Sobra de geração no sistema",
          "O consumo está excedendo a geração naquele instante",
          "Queda de tensão na Rede Básica",
          "Falha no SCADA do ONS"
        ],
        "correta": 1,
        "explicacao": "Frequência é o medidor do balanço: falta geração → as máquinas síncronas desaceleram → f cai. A inércia freia a queda, a regulação primária estanca e o CAG devolve a 60,00 Hz. Frequência subindo seria o sintoma oposto.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m02/aparato.json",
          "campo": "avaliacao.questoes[5]",
          "linha": 3726
        }
      },
      {
        "id": "m02-quiz-q07",
        "enunciado": "O que caracteriza a reserva girante?",
        "alternativas": [
          "Usinas desligadas que podem ser acionadas em algumas horas",
          "Capacidade já sincronizada ao sistema, capaz de elevar geração em segundos",
          "A soma das baterias dos consumidores",
          "A margem disponível nos intercâmbios entre subsistemas"
        ],
        "correta": 1,
        "explicacao": "É o jogador aquecido no banco: usinas girando abaixo do máximo (80 MW podendo gerar 100 = 20 MW de reserva girante), prontas em segundos. É a primeira reserva a agir depois da inércia e da regulação primária — e custa dinheiro mesmo sem gerar, como todo seguro.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m02/aparato.json",
          "campo": "avaliacao.questoes[6]",
          "linha": 3737
        }
      },
      {
        "id": "m02-quiz-q08",
        "enunciado": "Black start é...",
        "alternativas": [
          "Um leilão de reserva de capacidade",
          "A capacidade de uma usina partir sem energia externa e ajudar a recompor o sistema",
          "O corte automático e escalonado de carga por subfrequência",
          "Um modo de operação de inversores grid-forming"
        ],
        "correta": 1,
        "explicacao": "Depois de um colapso amplo, alguém precisa acender a primeira luz: unidades black start partem sozinhas, energizam trechos, permitem sincronizar outras usinas e reconectar cargas em blocos. O corte por subfrequência é outra coisa — é o ERAC.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m02/aparato.json",
          "campo": "avaliacao.questoes[7]",
          "linha": 3748
        }
      },
      {
        "id": "m02-quiz-q09",
        "enunciado": "Dentro de um submercado brasileiro, o sobrecusto do redespacho por congestionamento aparece...",
        "alternativas": [
          "No PLD daquele submercado",
          "Na TUST dos geradores envolvidos",
          "Como encargo (ESS), rateado entre os consumidores",
          "Não existe congestionamento dentro de submercado"
        ],
        "correta": 2,
        "explicacao": "O desenho zonal trata a malha interna como placa de cobre: o PLD não enxerga a restrição. O constrained-on/off vira ESS na liquidação da CCEE — pago por todos, visível em preço nenhum. Entre submercados, o mesmo fenômeno aparece de outra forma: como spread de PLD.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m02/aparato.json",
          "campo": "avaliacao.questoes[8]",
          "linha": 3759
        }
      },
      {
        "id": "m02-quiz-q10",
        "enunciado": "Uma indústria migra para o mercado livre (ACL). O que acontece com a conta da distribuidora?",
        "alternativas": [
          "Deixa de existir — o fornecedor assume tudo",
          "Continua: ela segue pagando TUSD pelo uso do fio, além de encargos",
          "É substituída por um pagamento direto ao ONS",
          "Vira opcional, negociada caso a caso"
        ],
        "correta": 1,
        "explicacao": "Migrar muda quem vende a energia; o fio é monopólio regulado da distribuidora local e continua sendo pago via TUSD (demanda + energia no Grupo A), com encargos e obrigações de agente na CCEE. Quem promete 'sair da distribuidora' vende uma impossibilidade física.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m02/aparato.json",
          "campo": "avaliacao.questoes[9]",
          "linha": 3770
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
        "mensagem": "Domínio sólido. Pronto para o Módulo 03 — Tecnologias de Geração."
      }
    ],
    "faixasFonte": {
      "arquivo": "docs/alexandria-v2/extraction/m02/aparato.json",
      "campo": "avaliacao.placar.faixas",
      "linha": 3829
    },
    "criterioFonte": {
      "arquivo": "docs/alexandria-v2/extraction/m02/aparato.json",
      "campo": "avaliacao.introducao.texto",
      "linha": 2676
    }
  }
];

export const CHECKLISTS: ChecklistDoModulo[] = [
  {
    "moduloId": "modulo-02",
    "introducao": "Você só passa neste módulo se conseguir, sem consultar nenhum material, fazer todas as ações abaixo. Marque ao longo do estudo. Quando todas estiverem marcadas — e o quiz fechar em 8/10 ou mais — você está pronto para o Módulo 03 — Tecnologias de Geração.",
    "itens": [
      {
        "id": "m02-check-01",
        "texto": "Desenhar num guardanapo a cadeia geração → transmissão → distribuição → consumo, com tensões típicas e dono de cada trecho",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m02/aparato.json",
          "campo": "checklist_final.itens[0].texto",
          "linha": 2765
        }
      },
      {
        "id": "m02-check-02",
        "texto": "Explicar por que um apagão numa região atinge outra em segundos — os cinco passos da cascata",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m02/aparato.json",
          "campo": "checklist_final.itens[1].texto",
          "linha": 2766
        }
      },
      {
        "id": "m02-check-03",
        "texto": "Separar rede elétrica de mercado elétrico em duas frases",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m02/aparato.json",
          "campo": "checklist_final.itens[2].texto",
          "linha": 2767
        }
      },
      {
        "id": "m02-check-04",
        "texto": "Provar com I²R por que dobrar a tensão divide as perdas por quatro",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m02/aparato.json",
          "campo": "checklist_final.itens[3].texto",
          "linha": 2768
        }
      },
      {
        "id": "m02-check-05",
        "texto": "Dizer o que é a Rede Básica (≥ 230 kV) e por que essa fronteira muda contrato e cobrança",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m02/aparato.json",
          "campo": "checklist_final.itens[4].texto",
          "linha": 2769
        }
      },
      {
        "id": "m02-check-06",
        "texto": "Explicar quando HVDC vence o AC — e citar os bipolos de Belo Monte como exemplo",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m02/aparato.json",
          "campo": "checklist_final.itens[5].texto",
          "linha": 2770
        }
      },
      {
        "id": "m02-check-07",
        "texto": "Diferenciar disjuntor de seccionadora e explicar seletividade da proteção",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m02/aparato.json",
          "campo": "checklist_final.itens[6].texto",
          "linha": 2771
        }
      },
      {
        "id": "m02-check-08",
        "texto": "Desenhar a curva líquida de um dia ensolarado e apontar a rampa do fim da tarde",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m02/aparato.json",
          "campo": "checklist_final.itens[7].texto",
          "linha": 2772
        }
      },
      {
        "id": "m02-check-09",
        "texto": "Explicar a ordem de mérito e o valor da água — e por que estiagem encarece o Brasil inteiro",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m02/aparato.json",
          "campo": "checklist_final.itens[8].texto",
          "linha": 2773
        }
      },
      {
        "id": "m02-check-10",
        "texto": "Citar a frase: custo mínimo sujeito a restrições de segurança e física da rede",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m02/aparato.json",
          "campo": "checklist_final.itens[9].texto",
          "linha": 2774
        }
      },
      {
        "id": "m02-check-11",
        "texto": "Listar três coisas que o ONS faz e três que ele não faz, nomeando quem faz",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m02/aparato.json",
          "campo": "checklist_final.itens[10].texto",
          "linha": 2775
        }
      },
      {
        "id": "m02-check-12",
        "texto": "Narrar a cascata de horizontes: PMO → PDO → tempo real → pós-operação",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m02/aparato.json",
          "campo": "checklist_final.itens[11].texto",
          "linha": 2776
        }
      },
      {
        "id": "m02-check-13",
        "texto": "Diferenciar reserva girante, operativa e fria — e defender por que reserva parada custa dinheiro",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m02/aparato.json",
          "campo": "checklist_final.itens[12].texto",
          "linha": 2777
        }
      },
      {
        "id": "m02-check-14",
        "texto": "Listar quatro serviços ancilares e conectar suporte de tensão ao kvar do Módulo 01",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m02/aparato.json",
          "campo": "checklist_final.itens[13].texto",
          "linha": 2778
        }
      },
      {
        "id": "m02-check-15",
        "texto": "Narrar os dez segundos pós-perda de usina: inércia → regulação primária → CAG → ERAC",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m02/aparato.json",
          "campo": "checklist_final.itens[14].texto",
          "linha": 2779
        }
      },
      {
        "id": "m02-check-16",
        "texto": "Contar 2001, 2009 e 2023 em duas frases cada — com a lição certa de cada um",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m02/aparato.json",
          "campo": "checklist_final.itens[15].texto",
          "linha": 2780
        }
      },
      {
        "id": "m02-check-17",
        "texto": "Explicar TUSD × TUST e por que migrar ao livre não elimina a conta da distribuidora",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m02/aparato.json",
          "campo": "checklist_final.itens[16].texto",
          "linha": 2781
        }
      },
      {
        "id": "m02-check-18",
        "texto": "Explicar onde o custo do congestionamento aparece (spread de PLD) e onde se esconde (ESS) — e o que é curtailment",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m02/aparato.json",
          "campo": "checklist_final.itens[17].texto",
          "linha": 2782
        }
      }
    ]
  }
];
