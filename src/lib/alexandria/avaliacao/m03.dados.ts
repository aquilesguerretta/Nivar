// GERADO por tools/alexandria-dados/avaliacao/gerar-avaliacao-m03.mjs — não editar à mão.
// Avaliação do M03: exercícios por aula, exercícios sem aula, prova e checklist.
// Fonte: docs/alexandria-v2/extraction/m03/aparato.json (itens 'fonte') e o texto da própria
// aula (itens 'derivado-da-aula', com o trecho literal em `evidencias`).
// Relatório: docs/alexandria-v3/porte/m03.md. Posse: a sessão de porte do M03.
// 30 itens por aula (10 da fonte, 20 derivados) · 0 sem aula · 10 questões na prova · checklist de 18.
import type { ChecklistDoModulo, ExercicioDaAula, ExercicioDoModulo, ProvaDoModulo } from '../avaliacao';

export const EXERCICIOS_DAS_AULAS: ExercicioDaAula[] = [
  {
    "id": "m03-ex-01",
    "moduloId": "modulo-03",
    "aula": 1,
    "origem": "fonte",
    "tipo": "aberto",
    "enunciado": "Uma UFV de <b>200 MW</b> opera com FC de <b>28%</b>. Quanta energia ela entrega por ano, em GWh? E que potência uma usina nuclear (FC 88%) precisaria ter para entregar o mesmo?",
    "gabarito": null,
    "referencia": "E = 200 × 8.760 × 0,28 = <span class=\"calc\">490.560 MWh ≈ 490 GWh/ano</span>. Para a mesma energia com FC 88%: P = 490.560 ÷ (8.760 × 0,88) = <span class=\"calc\">≈ 64 MW</span>. Três vezes menos potência para a mesma energia — é o fator de capacidade convertendo MW de manchete em MWh de realidade. Nenhuma das duas é \"melhor\": entregam a mesma energia com atributos completamente diferentes.",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "docs/alexandria-v2/extraction/m03/aparato.json",
      "campo": "exercicios.itens[0].enunciado.html",
      "linha": 2282
    },
    "evidencias": [
      {
        "arquivo": "docs/alexandria-v2/extraction/m03/aparato.json",
        "campo": "exercicios.itens[0].enunciado.texto",
        "linha": 2282,
        "trecho": "Uma UFV de 200 MW opera com FC de 28%. Quanta energia ela entrega por ano, em GWh? E que potência uma usina nuclear (FC 88%) precisaria ter para entregar o mesmo?"
      },
      {
        "arquivo": "docs/alexandria-v2/extraction/m03/aparato.json",
        "campo": "exercicios.itens[0].resposta_de_referencia.paragrafos",
        "linha": 2282,
        "trecho": "E = 200 × 8.760 × 0,28 = 490.560 MWh ≈ 490 GWh/ano. Para a mesma energia com FC 88%: P = 490.560 ÷ (8.760 × 0,88) = ≈ 64 MW. Três vezes menos potência para a mesma energia — é o fator de capacidade convertendo MW de manchete em MWh de realidade. Nenhuma das duas é \"melhor\": entregam a mesma energia com atributos completamente diferentes."
      }
    ]
  },
  {
    "id": "m03-ex-02",
    "moduloId": "modulo-03",
    "aula": 1,
    "origem": "fonte",
    "tipo": "aberto",
    "enunciado": "Manchete: \"Brasil bate recorde com 25% da capacidade vinda da energia solar\". Um diretor pergunta: \"então um quarto da nossa energia é solar?\". Corrija em três frases.",
    "gabarito": null,
    "referencia": "Não — 25% da <b>capacidade</b> não é 25% da <b>energia</b>. Como o FC solar (~25–30%) é cerca de metade do FC médio do resto do parque, a participação na energia gerada fica na casa de 10%. E parte dessa solar é MMGD, que nem aparece como geração nos painéis do operador — aparece como redução de carga. Capacidade, energia e fator de capacidade: três lentes, três números.",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "docs/alexandria-v2/extraction/m03/aparato.json",
      "campo": "exercicios.itens[1].enunciado.html",
      "linha": 2291
    },
    "evidencias": [
      {
        "arquivo": "docs/alexandria-v2/extraction/m03/aparato.json",
        "campo": "exercicios.itens[1].enunciado.texto",
        "linha": 2291,
        "trecho": "Manchete: \"Brasil bate recorde com 25% da capacidade vinda da energia solar\". Um diretor pergunta: \"então um quarto da nossa energia é solar?\". Corrija em três frases."
      },
      {
        "arquivo": "docs/alexandria-v2/extraction/m03/aparato.json",
        "campo": "exercicios.itens[1].resposta_de_referencia.paragrafos",
        "linha": 2291,
        "trecho": "Não — 25% da capacidade não é 25% da energia. Como o FC solar (~25–30%) é cerca de metade do FC médio do resto do parque, a participação na energia gerada fica na casa de 10%. E parte dessa solar é MMGD, que nem aparece como geração nos painéis do operador — aparece como redução de carga. Capacidade, energia e fator de capacidade: três lentes, três números."
      }
    ]
  },
  {
    "id": "m03-a01-d01",
    "moduloId": "modulo-03",
    "aula": 1,
    "origem": "derivado-da-aula",
    "tipo": "aberto",
    "enunciado": "Por que a MMGD não aparece como geração nos painéis do ONS, segundo a aula?",
    "gabarito": null,
    "referencia": "a MMGD não aparece como geração nos painéis do ONS — aparece como redução de carga. O telhado da fábrica gera atrás do medidor; o operador enxerga só o líquido.",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "Alexandria modulos/alexandria_modulo03.html",
      "campo": "aula-03-01 · bloco [5] (paragrafo)",
      "linha": 1503
    },
    "evidencias": [
      {
        "arquivo": "Alexandria modulos/alexandria_modulo03.html",
        "campo": "aula-03-01 · bloco [5] (paragrafo)",
        "linha": 1503,
        "trecho": "a MMGD não aparece como geração nos painéis do ONS — aparece como redução de carga. O telhado da fábrica gera atrás do medidor; o operador enxerga só o líquido."
      }
    ]
  },
  {
    "id": "m03-ex-03",
    "moduloId": "modulo-03",
    "aula": 2,
    "origem": "fonte",
    "tipo": "aberto",
    "enunciado": "Duas hidrelétricas de <b>1.000 MW</b> cada: uma com grande reservatório, outra a fio d'água num rio de forte sazonalidade. Num setembro seco, qual gera mais? E qual \"vale mais\" para o sistema naquele mês? Justifique com os conceitos certos.",
    "gabarito": null,
    "referencia": "A fio d'água gera o que a vazão de setembro permitir — tipicamente uma fração pequena da capacidade (no Xingu, o vale chega a ~10–20% — ONS, vivo). A de reservatório gera o que o <b>despacho decidir</b>, sacando do estoque acumulado na cheia — pode sustentar perto da capacidade. Em setembro, o MWh das duas custa \"zero\" de combustível, mas o da reservatório carrega valor da água e entrega <b>firmeza</b> — o atributo escasso do mês. Mesma placa de 1.000 MW, produtos diferentes: energia média vs energia firme.",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "docs/alexandria-v2/extraction/m03/aparato.json",
      "campo": "exercicios.itens[2].enunciado.html",
      "linha": 2300
    },
    "evidencias": [
      {
        "arquivo": "docs/alexandria-v2/extraction/m03/aparato.json",
        "campo": "exercicios.itens[2].enunciado.texto",
        "linha": 2300,
        "trecho": "Duas hidrelétricas de 1.000 MW cada: uma com grande reservatório, outra a fio d'água num rio de forte sazonalidade. Num setembro seco, qual gera mais? E qual \"vale mais\" para o sistema naquele mês? Justifique com os conceitos certos."
      },
      {
        "arquivo": "docs/alexandria-v2/extraction/m03/aparato.json",
        "campo": "exercicios.itens[2].resposta_de_referencia.paragrafos",
        "linha": 2300,
        "trecho": "A fio d'água gera o que a vazão de setembro permitir — tipicamente uma fração pequena da capacidade (no Xingu, o vale chega a ~10–20% — ONS, vivo). A de reservatório gera o que o despacho decidir, sacando do estoque acumulado na cheia — pode sustentar perto da capacidade. Em setembro, o MWh das duas custa \"zero\" de combustível, mas o da reservatório carrega valor da água e entrega firmeza — o atributo escasso do mês. Mesma placa de 1.000 MW, produtos diferentes: energia média vs energia firme."
      }
    ]
  },
  {
    "id": "m03-a02-d01",
    "moduloId": "modulo-03",
    "aula": 2,
    "origem": "derivado-da-aula",
    "tipo": "escolha",
    "enunciado": "Como se chama a medida da \"bateria do Brasil\", publicada diariamente pelo ONS por subsistema?",
    "alternativas": [
      "ENA",
      "EAR",
      "CVU",
      "GSF"
    ],
    "gabarito": 1,
    "referencia": "A medida dessa bateria tem nome técnico: EAR — Energia Armazenada, publicada diariamente pelo ONS por subsistema.",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "alternativa-correta",
    "fonte": {
      "arquivo": "Alexandria modulos/alexandria_modulo03.html",
      "campo": "aula-03-02 · bloco [3] (paragrafo)",
      "linha": 1591
    },
    "evidencias": [
      {
        "arquivo": "Alexandria modulos/alexandria_modulo03.html",
        "campo": "aula-03-02 · bloco [3] (paragrafo)",
        "linha": 1591,
        "trecho": "A medida dessa bateria tem nome técnico: EAR — Energia Armazenada, publicada diariamente pelo ONS por subsistema."
      }
    ]
  },
  {
    "id": "m03-a02-d02",
    "moduloId": "modulo-03",
    "aula": 2,
    "origem": "derivado-da-aula",
    "tipo": "aberto",
    "enunciado": "Que caso a aula chama de \"trauma formativo\" do preço socioambiental dos reservatórios, e por quê?",
    "gabarito": null,
    "referencia": "O trauma formativo tem nome: Balbina (AM, anos 1980) — área gigante alagada para potência pífia, o anti-exemplo citado até hoje.",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "Alexandria modulos/alexandria_modulo03.html",
      "campo": "aula-03-02 · bloco [9] (paragrafo)",
      "linha": 1632
    },
    "evidencias": [
      {
        "arquivo": "Alexandria modulos/alexandria_modulo03.html",
        "campo": "aula-03-02 · bloco [9] (paragrafo)",
        "linha": 1632,
        "trecho": "O trauma formativo tem nome: Balbina (AM, anos 1980) — área gigante alagada para potência pífia, o anti-exemplo citado até hoje."
      }
    ]
  },
  {
    "id": "m03-a03-d01",
    "moduloId": "modulo-03",
    "aula": 3,
    "origem": "derivado-da-aula",
    "tipo": "aberto",
    "enunciado": "Por que Belo Monte gera, em média, bem menos do que a sua capacidade instalada?",
    "gabarito": null,
    "referencia": "porque o Xingu tem uma das sazonalidades mais brutais do planeta — caudaloso na cheia amazônica, magro na seca.",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "Alexandria modulos/alexandria_modulo03.html",
      "campo": "aula-03-03 · bloco [1] (paragrafo)",
      "linha": 1665
    },
    "evidencias": [
      {
        "arquivo": "Alexandria modulos/alexandria_modulo03.html",
        "campo": "aula-03-03 · bloco [1] (paragrafo)",
        "linha": 1665,
        "trecho": "porque o Xingu tem uma das sazonalidades mais brutais do planeta — caudaloso na cheia amazônica, magro na seca."
      }
    ]
  },
  {
    "id": "m03-a03-d02",
    "moduloId": "modulo-03",
    "aula": 3,
    "origem": "derivado-da-aula",
    "tipo": "escolha",
    "enunciado": "Qual hidráulica a aula descreve como a \"bateria hidráulica\" clássica, que bombeia água morro acima com energia barata?",
    "alternativas": [
      "PCH",
      "CGH",
      "reversível (UHR)"
    ],
    "gabarito": 2,
    "referencia": "e a reversível (UHR) — bombeia água morro acima com energia barata para turbinar na hora cara, a \"bateria hidráulica\" clássica",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "alternativa-correta",
    "fonte": {
      "arquivo": "Alexandria modulos/alexandria_modulo03.html",
      "campo": "aula-03-03 · bloco [5] (paragrafo)",
      "linha": 1698
    },
    "evidencias": [
      {
        "arquivo": "Alexandria modulos/alexandria_modulo03.html",
        "campo": "aula-03-03 · bloco [5] (paragrafo)",
        "linha": 1698,
        "trecho": "e a reversível (UHR) — bombeia água morro acima com energia barata para turbinar na hora cara, a \"bateria hidráulica\" clássica"
      }
    ]
  },
  {
    "id": "m03-a03-d03",
    "moduloId": "modulo-03",
    "aula": 3,
    "origem": "derivado-da-aula",
    "tipo": "aberto",
    "enunciado": "Para onde migrou a regularização que o sistema perdeu com as hidrelétricas a fio d'água?",
    "gabarito": null,
    "referencia": "A regularização que o sistema perdeu migrou para outros ombros: os reservatórios antigos (cada vez mais exigidos), as térmicas flexíveis (Aula 06), e — a partir do leilão de 2026 — as baterias eletroquímicas (Aula 09).",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "Alexandria modulos/alexandria_modulo03.html",
      "campo": "aula-03-03 · bloco [4] (paragrafo)",
      "linha": 1670
    },
    "evidencias": [
      {
        "arquivo": "Alexandria modulos/alexandria_modulo03.html",
        "campo": "aula-03-03 · bloco [4] (paragrafo)",
        "linha": 1670,
        "trecho": "A regularização que o sistema perdeu migrou para outros ombros: os reservatórios antigos (cada vez mais exigidos), as térmicas flexíveis (Aula 06), e — a partir do leilão de 2026 — as baterias eletroquímicas (Aula 09)."
      }
    ]
  },
  {
    "id": "m03-ex-04",
    "moduloId": "modulo-03",
    "aula": 4,
    "origem": "fonte",
    "tipo": "aberto",
    "enunciado": "Dois sítios eólicos: vento médio de <b>8 m/s</b> no sítio A e <b>10 m/s</b> no sítio B. Usando só a física da aula, estime quantas vezes mais energia por área o sítio B oferece. (Ignore curva de potência e limites da turbina.)",
    "gabarito": null,
    "referencia": "P ∝ v³ → razão = (10/8)³ = 1,25³ = <span class=\"calc\">≈ 1,95 — praticamente o dobro</span>. Vinte e cinco por cento mais vento, cem por cento mais energia disponível: é o cubo que faz micrositing valer fortunas, torres crescerem e o litoral do NE virar ativo de classe mundial. (Na turbina real, a curva de potência satura na nominal — mas a vantagem econômica do sítio B sobrevive inteira.)",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "docs/alexandria-v2/extraction/m03/aparato.json",
      "campo": "exercicios.itens[3].enunciado.html",
      "linha": 2309
    },
    "evidencias": [
      {
        "arquivo": "docs/alexandria-v2/extraction/m03/aparato.json",
        "campo": "exercicios.itens[3].enunciado.texto",
        "linha": 2309,
        "trecho": "Dois sítios eólicos: vento médio de 8 m/s no sítio A e 10 m/s no sítio B. Usando só a física da aula, estime quantas vezes mais energia por área o sítio B oferece. (Ignore curva de potência e limites da turbina.)"
      },
      {
        "arquivo": "docs/alexandria-v2/extraction/m03/aparato.json",
        "campo": "exercicios.itens[3].resposta_de_referencia.paragrafos",
        "linha": 2309,
        "trecho": "P ∝ v³ → razão = (10/8)³ = 1,25³ = ≈ 1,95 — praticamente o dobro. Vinte e cinco por cento mais vento, cem por cento mais energia disponível: é o cubo que faz micrositing valer fortunas, torres crescerem e o litoral do NE virar ativo de classe mundial. (Na turbina real, a curva de potência satura na nominal — mas a vantagem econômica do sítio B sobrevive inteira.)"
      }
    ]
  },
  {
    "id": "m03-a04-d01",
    "moduloId": "modulo-03",
    "aula": 4,
    "origem": "derivado-da-aula",
    "tipo": "escolha",
    "enunciado": "Acima de que velocidade do vento (cut-out) a turbina desliga para se proteger, segundo a aula?",
    "alternativas": [
      "~3 m/s",
      "~12 m/s",
      "~25 m/s"
    ],
    "gabarito": 2,
    "referencia": "da nominal ao limite de segurança (cut-out, ~25 m/s) ela entrega potência cheia controlando o ângulo das pás; acima, desliga para se proteger.",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "alternativa-correta",
    "fonte": {
      "arquivo": "Alexandria modulos/alexandria_modulo03.html",
      "campo": "aula-03-04 · bloco [1] (paragrafo)",
      "linha": 1722
    },
    "evidencias": [
      {
        "arquivo": "Alexandria modulos/alexandria_modulo03.html",
        "campo": "aula-03-04 · bloco [1] (paragrafo)",
        "linha": 1722,
        "trecho": "da nominal ao limite de segurança (cut-out, ~25 m/s) ela entrega potência cheia controlando o ângulo das pás; acima, desliga para se proteger."
      }
    ]
  },
  {
    "id": "m03-a04-d02",
    "moduloId": "modulo-03",
    "aula": 4,
    "origem": "derivado-da-aula",
    "tipo": "aberto",
    "enunciado": "Que complementaridade sazonal a aula descreve entre o vento do Nordeste e os reservatórios do Sudeste?",
    "gabarito": null,
    "referencia": "O vento do NE sopra mais forte no segundo semestre — exatamente a estação seca dos reservatórios do Sudeste. Quando a chuva vai embora, o vento chega.",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "Alexandria modulos/alexandria_modulo03.html",
      "campo": "aula-03-04 · bloco [4] (paragrafo)",
      "linha": 1727
    },
    "evidencias": [
      {
        "arquivo": "Alexandria modulos/alexandria_modulo03.html",
        "campo": "aula-03-04 · bloco [4] (paragrafo)",
        "linha": 1727,
        "trecho": "O vento do NE sopra mais forte no segundo semestre — exatamente a estação seca dos reservatórios do Sudeste. Quando a chuva vai embora, o vento chega."
      }
    ]
  },
  {
    "id": "m03-ex-05",
    "moduloId": "modulo-03",
    "aula": 5,
    "origem": "fonte",
    "tipo": "aberto",
    "enunciado": "Explique por que <b>1 MWh gerado no telhado da fábrica</b> (MMGD) pode valer mais para o dono do que <b>1 MWh comprado de uma UFV</b> — mesmo sendo a mesma física e, muitas vezes, o telhado custando mais caro por MWh gerado.",
    "gabarito": null,
    "referencia": "Porque as réguas são diferentes. O MWh do telhado evita a <b>tarifa cheia de varejo</b> — energia + fio + encargos + tributos (com a transição do Fio B da Lei 14.300 descontando parte do fio). O MWh da UFV compete no <b>atacado</b>, contra preço de geração. Como o varejo custa múltiplas vezes o atacado, a MMGD fecha conta com LCOE que seria perdedor em leilão. Mesma tecnologia, economias opostas — é o limite nº 1 do LCOE aplicado: o valor depende de <i>onde</i> o MWh entra.",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "docs/alexandria-v2/extraction/m03/aparato.json",
      "campo": "exercicios.itens[4].enunciado.html",
      "linha": 2318
    },
    "evidencias": [
      {
        "arquivo": "docs/alexandria-v2/extraction/m03/aparato.json",
        "campo": "exercicios.itens[4].enunciado.texto",
        "linha": 2318,
        "trecho": "Explique por que 1 MWh gerado no telhado da fábrica (MMGD) pode valer mais para o dono do que 1 MWh comprado de uma UFV — mesmo sendo a mesma física e, muitas vezes, o telhado custando mais caro por MWh gerado."
      },
      {
        "arquivo": "docs/alexandria-v2/extraction/m03/aparato.json",
        "campo": "exercicios.itens[4].resposta_de_referencia.paragrafos",
        "linha": 2318,
        "trecho": "Porque as réguas são diferentes. O MWh do telhado evita a tarifa cheia de varejo — energia + fio + encargos + tributos (com a transição do Fio B da Lei 14.300 descontando parte do fio). O MWh da UFV compete no atacado, contra preço de geração. Como o varejo custa múltiplas vezes o atacado, a MMGD fecha conta com LCOE que seria perdedor em leilão. Mesma tecnologia, economias opostas — é o limite nº 1 do LCOE aplicado: o valor depende de onde o MWh entra."
      }
    ]
  },
  {
    "id": "m03-a05-d01",
    "moduloId": "modulo-03",
    "aula": 5,
    "origem": "derivado-da-aula",
    "tipo": "escolha",
    "enunciado": "Que norma consolidou o marco legal da MMGD, segundo a aula?",
    "alternativas": [
      "Lei 15.097/2025",
      "Lei 14.300/2022",
      "Portaria Normativa nº 136/2026"
    ],
    "gabarito": 1,
    "referencia": "a Lei 14.300/2022 consolidou o marco legal",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "alternativa-correta",
    "fonte": {
      "arquivo": "Alexandria modulos/alexandria_modulo03.html",
      "campo": "aula-03-05 · bloco [3] (paragrafo)",
      "linha": 1761
    },
    "evidencias": [
      {
        "arquivo": "Alexandria modulos/alexandria_modulo03.html",
        "campo": "aula-03-05 · bloco [3] (paragrafo)",
        "linha": 1761,
        "trecho": "a Lei 14.300/2022 consolidou o marco legal"
      }
    ]
  },
  {
    "id": "m03-a05-d02",
    "moduloId": "modulo-03",
    "aula": 5,
    "origem": "derivado-da-aula",
    "tipo": "aberto",
    "enunciado": "O que a aula chama de canibalização da solar?",
    "gabarito": null,
    "referencia": "canibalização (cada novo MW solar gera nas mesmas horas dos anteriores e corrói o próprio preço)",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "Alexandria modulos/alexandria_modulo03.html",
      "campo": "aula-03-05 · bloco [5] (paragrafo)",
      "linha": 1764
    },
    "evidencias": [
      {
        "arquivo": "Alexandria modulos/alexandria_modulo03.html",
        "campo": "aula-03-05 · bloco [5] (paragrafo)",
        "linha": 1764,
        "trecho": "canibalização (cada novo MW solar gera nas mesmas horas dos anteriores e corrói o próprio preço)"
      }
    ]
  },
  {
    "id": "m03-ex-06",
    "moduloId": "modulo-03",
    "aula": 6,
    "origem": "fonte",
    "tipo": "aberto",
    "enunciado": "Pilha didática: renováveis must-run <b>45 GW</b> (custo ~0), nuclear <b>2 GW</b> (R$ 30), hidro reservatório <b>40 GW</b> (valor da água R$ 200), GN ciclo combinado <b>12 GW</b> (R$ 250), GN ciclo simples <b>8 GW</b> (R$ 450), óleo <b>5 GW</b> (R$ 1.100). Demanda = <b>92 GW</b>. Fonte marginal e CMO? E se um take-or-pay obrigar 4 GW de GN simples a rodar na base, o que muda no custo total — sem mudar a demanda?",
    "gabarito": null,
    "referencia": "Empilhando: 45 + 2 + 40 = 87; faltam 5 → GN combinado na margem, <span class=\"calc\">CMO = R$ 250/MWh</span> (despachando 5 dos 12 GW). Com o take-or-pay: 4 GW de GN simples (R$ 450) rodam <i>fora da ordem</i>, deslocando 4 GW de geração mais barata; a margem econômica até melhora de posição (87 + 4 = 91; falta 1 do combinado), mas o sistema paga R$ 450 por energia que custaria R$ 250 — sobrecusto de despacho fora do mérito que não aparece no preço e vira <b>encargo (ESS)</b>. Flexibilidade é atributo do conjunto máquina + contrato.",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "docs/alexandria-v2/extraction/m03/aparato.json",
      "campo": "exercicios.itens[5].enunciado.html",
      "linha": 2327
    },
    "evidencias": [
      {
        "arquivo": "docs/alexandria-v2/extraction/m03/aparato.json",
        "campo": "exercicios.itens[5].enunciado.texto",
        "linha": 2327,
        "trecho": "Pilha didática: renováveis must-run 45 GW (custo ~0), nuclear 2 GW (R$ 30), hidro reservatório 40 GW (valor da água R$ 200), GN ciclo combinado 12 GW (R$ 250), GN ciclo simples 8 GW (R$ 450), óleo 5 GW (R$ 1.100). Demanda = 92 GW. Fonte marginal e CMO? E se um take-or-pay obrigar 4 GW de GN simples a rodar na base, o que muda no custo total — sem mudar a demanda?"
      },
      {
        "arquivo": "docs/alexandria-v2/extraction/m03/aparato.json",
        "campo": "exercicios.itens[5].resposta_de_referencia.paragrafos",
        "linha": 2327,
        "trecho": "Empilhando: 45 + 2 + 40 = 87; faltam 5 → GN combinado na margem, CMO = R$ 250/MWh (despachando 5 dos 12 GW). Com o take-or-pay: 4 GW de GN simples (R$ 450) rodam fora da ordem, deslocando 4 GW de geração mais barata; a margem econômica até melhora de posição (87 + 4 = 91; falta 1 do combinado), mas o sistema paga R$ 450 por energia que custaria R$ 250 — sobrecusto de despacho fora do mérito que não aparece no preço e vira encargo (ESS). Flexibilidade é atributo do conjunto máquina + contrato."
      }
    ]
  },
  {
    "id": "m03-a06-d01",
    "moduloId": "modulo-03",
    "aula": 6,
    "origem": "derivado-da-aula",
    "tipo": "escolha",
    "enunciado": "Qual configuração de térmica tem eficiência na casa de 55–60%, segundo a aula?",
    "alternativas": [
      "Ciclo simples (ou aberto)",
      "Ciclo combinado",
      "Carvão"
    ],
    "gabarito": 1,
    "referencia": "Ciclo combinado: aproveita o calor de exaustão para gerar vapor e girar uma segunda turbina. Eficiência sobe para 55–60%",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "alternativa-correta",
    "fonte": {
      "arquivo": "Alexandria modulos/alexandria_modulo03.html",
      "campo": "aula-03-06 · bloco [1] (paragrafo)",
      "linha": 1828
    },
    "evidencias": [
      {
        "arquivo": "Alexandria modulos/alexandria_modulo03.html",
        "campo": "aula-03-06 · bloco [1] (paragrafo)",
        "linha": 1828,
        "trecho": "Ciclo combinado: aproveita o calor de exaustão para gerar vapor e girar uma segunda turbina. Eficiência sobe para 55–60%"
      }
    ]
  },
  {
    "id": "m03-a06-d02",
    "moduloId": "modulo-03",
    "aula": 6,
    "origem": "derivado-da-aula",
    "tipo": "aberto",
    "enunciado": "Por que, segundo a aula, flexibilidade não é atributo da turbina?",
    "gabarito": null,
    "referencia": "flexibilidade não é atributo da turbina, é atributo do conjunto máquina + contrato + combustível. Uma turbina ágil presa a um take-or-pay é um atleta de pernas amarradas.",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "Alexandria modulos/alexandria_modulo03.html",
      "campo": "aula-03-06 · bloco [6] (paragrafo)",
      "linha": 1840
    },
    "evidencias": [
      {
        "arquivo": "Alexandria modulos/alexandria_modulo03.html",
        "campo": "aula-03-06 · bloco [6] (paragrafo)",
        "linha": 1840,
        "trecho": "flexibilidade não é atributo da turbina, é atributo do conjunto máquina + contrato + combustível. Uma turbina ágil presa a um take-or-pay é um atleta de pernas amarradas."
      }
    ]
  },
  {
    "id": "m03-a07-d01",
    "moduloId": "modulo-03",
    "aula": 7,
    "origem": "derivado-da-aula",
    "tipo": "escolha",
    "enunciado": "Que encargo socializa nacionalmente o sobrecusto do diesel dos sistemas isolados?",
    "alternativas": [
      "ESS",
      "CCC",
      "GSF"
    ],
    "gabarito": 1,
    "referencia": "O sobrecusto é socializado nacionalmente pela CCC (Conta de Consumo de Combustíveis)",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "alternativa-correta",
    "fonte": {
      "arquivo": "Alexandria modulos/alexandria_modulo03.html",
      "campo": "aula-03-07 · bloco [3] (paragrafo)",
      "linha": 1922
    },
    "evidencias": [
      {
        "arquivo": "Alexandria modulos/alexandria_modulo03.html",
        "campo": "aula-03-07 · bloco [3] (paragrafo)",
        "linha": 1922,
        "trecho": "O sobrecusto é socializado nacionalmente pela CCC (Conta de Consumo de Combustíveis)"
      }
    ]
  },
  {
    "id": "m03-a07-d02",
    "moduloId": "modulo-03",
    "aula": 7,
    "origem": "derivado-da-aula",
    "tipo": "aberto",
    "enunciado": "Por que a aula diz que a biomassa da cana é complementar à hidrologia?",
    "gabarito": null,
    "referencia": "a safra do Centro-Sul vai de abril a novembro — precisamente a estação seca dos reservatórios. Quando a água some, a cana chega.",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "Alexandria modulos/alexandria_modulo03.html",
      "campo": "aula-03-07 · bloco [5] (paragrafo)",
      "linha": 1925
    },
    "evidencias": [
      {
        "arquivo": "Alexandria modulos/alexandria_modulo03.html",
        "campo": "aula-03-07 · bloco [5] (paragrafo)",
        "linha": 1925,
        "trecho": "a safra do Centro-Sul vai de abril a novembro — precisamente a estação seca dos reservatórios. Quando a água some, a cana chega."
      }
    ]
  },
  {
    "id": "m03-a07-d03",
    "moduloId": "modulo-03",
    "aula": 7,
    "origem": "derivado-da-aula",
    "tipo": "aberto",
    "enunciado": "Que paradoxo amazônico a aula descreve?",
    "gabarito": null,
    "referencia": "Eis o paradoxo amazônico: a energia mais cara do país atende as populações de menor renda — e todo consumidor brasileiro ajuda a pagar.",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "Alexandria modulos/alexandria_modulo03.html",
      "campo": "aula-03-07 · bloco [3] (paragrafo)",
      "linha": 1922
    },
    "evidencias": [
      {
        "arquivo": "Alexandria modulos/alexandria_modulo03.html",
        "campo": "aula-03-07 · bloco [3] (paragrafo)",
        "linha": 1922,
        "trecho": "Eis o paradoxo amazônico: a energia mais cara do país atende as populações de menor renda — e todo consumidor brasileiro ajuda a pagar."
      }
    ]
  },
  {
    "id": "m03-ex-07",
    "moduloId": "modulo-03",
    "aula": 8,
    "origem": "fonte",
    "tipo": "aberto",
    "enunciado": "Defenda em quatro frases, para um investidor, a tese: <b>\"Angra 3 não é um debate nuclear — é um debate de custo de capital.\"</b> Use pelo menos três números da aula (marcados como vivos).",
    "gabarito": null,
    "referencia": "Estrutura esperada: (1) a física e a segurança de Angra 3 são as mesmas de centenas de reatores PWR operando — o que a distingue são <b>39 anos de canteiro</b>; (2) capital parado compõe: são <b>~R$ 1 bilhão/ano</b> em juros e manutenção sem entregar um MWh; (3) a tarifa de referência discutida — <b>R$ 778–817/MWh</b> — contra solar leiloada na casa de R$ 170 mostra que o problema é o numerador de capital, não o reator; (4) e a decisão real do CNPE é entre R$ 24 bi para concluir e até R$ 26 bi para enterrar — ou seja, uma escolha entre dois passivos, governada por WACC e prazo, não por física. (Números vivos — reverificar antes de usar externamente.)",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "docs/alexandria-v2/extraction/m03/aparato.json",
      "campo": "exercicios.itens[6].enunciado.html",
      "linha": 2336
    },
    "evidencias": [
      {
        "arquivo": "docs/alexandria-v2/extraction/m03/aparato.json",
        "campo": "exercicios.itens[6].enunciado.texto",
        "linha": 2336,
        "trecho": "Defenda em quatro frases, para um investidor, a tese: \"Angra 3 não é um debate nuclear — é um debate de custo de capital.\" Use pelo menos três números da aula (marcados como vivos)."
      },
      {
        "arquivo": "docs/alexandria-v2/extraction/m03/aparato.json",
        "campo": "exercicios.itens[6].resposta_de_referencia.paragrafos",
        "linha": 2336,
        "trecho": "Estrutura esperada: (1) a física e a segurança de Angra 3 são as mesmas de centenas de reatores PWR operando — o que a distingue são 39 anos de canteiro; (2) capital parado compõe: são ~R$ 1 bilhão/ano em juros e manutenção sem entregar um MWh; (3) a tarifa de referência discutida — R$ 778–817/MWh — contra solar leiloada na casa de R$ 170 mostra que o problema é o numerador de capital, não o reator; (4) e a decisão real do CNPE é entre R$ 24 bi para concluir e até R$ 26 bi para enterrar — ou seja, uma escolha entre dois passivos, governada por WACC e prazo, não por física. (Números vivos — reverificar antes de usar externamente.)"
      }
    ]
  },
  {
    "id": "m03-a08-d01",
    "moduloId": "modulo-03",
    "aula": 8,
    "origem": "derivado-da-aula",
    "tipo": "aberto",
    "enunciado": "Por que a Eletronuclear ficou fora da privatização da Eletrobras, segundo a aula?",
    "gabarito": null,
    "referencia": "ficou fora da privatização da Eletrobras por exigência constitucional: a atividade nuclear é monopólio da União",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "Alexandria modulos/alexandria_modulo03.html",
      "campo": "aula-03-08 · bloco [1] (paragrafo)",
      "linha": 1960
    },
    "evidencias": [
      {
        "arquivo": "Alexandria modulos/alexandria_modulo03.html",
        "campo": "aula-03-08 · bloco [1] (paragrafo)",
        "linha": 1960,
        "trecho": "ficou fora da privatização da Eletrobras por exigência constitucional: a atividade nuclear é monopólio da União"
      }
    ]
  },
  {
    "id": "m03-a08-d02",
    "moduloId": "modulo-03",
    "aula": 8,
    "origem": "derivado-da-aula",
    "tipo": "aberto",
    "enunciado": "O que são os SMRs e que problema a aula diz que eles prometem atacar?",
    "gabarito": null,
    "referencia": "Pequenos reatores modulares (SMRs) prometem atacar exatamente o problema do prazo e da escala",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "Alexandria modulos/alexandria_modulo03.html",
      "campo": "aula-03-08 · bloco [6] (paragrafo)",
      "linha": 1972
    },
    "evidencias": [
      {
        "arquivo": "Alexandria modulos/alexandria_modulo03.html",
        "campo": "aula-03-08 · bloco [6] (paragrafo)",
        "linha": 1972,
        "trecho": "Pequenos reatores modulares (SMRs) prometem atacar exatamente o problema do prazo e da escala"
      }
    ]
  },
  {
    "id": "m03-ex-08",
    "moduloId": "modulo-03",
    "aula": 9,
    "origem": "fonte",
    "tipo": "aberto",
    "enunciado": "Uma bateria de <b>100 MW / 400 MWh</b> com eficiência de ciclo de <b>88%</b> faz um ciclo completo por dia. Quanta energia ela desloca por dia, quanta consome para carregar e quanta perde? E por que o leilão de dezembro de 2026 pagaria por ela mesmo que o spread de preço entre horários fosse zero?",
    "gabarito": null,
    "referencia": "Desloca (entrega) <span class=\"calc\">400 MWh/dia</span>; consome 400 ÷ 0,88 ≈ <span class=\"calc\">455 MWh</span>; perde ≈ <span class=\"calc\">55 MWh/dia</span> em calor. E o LRCAP pagaria mesmo sem spread porque o produto leiloado é <b>potência (MW) disponível sob comando do ONS</b> — reserva de capacidade para as horas críticas, não arbitragem de energia. A receita do contrato remunera a largura do cano; o uso do tanque é instrução do operador. Confundir os dois produtos é confundir MW com MWh — o erro nº 5 da tabela de mitos.",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "docs/alexandria-v2/extraction/m03/aparato.json",
      "campo": "exercicios.itens[7].enunciado.html",
      "linha": 2345
    },
    "evidencias": [
      {
        "arquivo": "docs/alexandria-v2/extraction/m03/aparato.json",
        "campo": "exercicios.itens[7].enunciado.texto",
        "linha": 2345,
        "trecho": "Uma bateria de 100 MW / 400 MWh com eficiência de ciclo de 88% faz um ciclo completo por dia. Quanta energia ela desloca por dia, quanta consome para carregar e quanta perde? E por que o leilão de dezembro de 2026 pagaria por ela mesmo que o spread de preço entre horários fosse zero?"
      },
      {
        "arquivo": "docs/alexandria-v2/extraction/m03/aparato.json",
        "campo": "exercicios.itens[7].resposta_de_referencia.paragrafos",
        "linha": 2345,
        "trecho": "Desloca (entrega) 400 MWh/dia; consome 400 ÷ 0,88 ≈ 455 MWh; perde ≈ 55 MWh/dia em calor. E o LRCAP pagaria mesmo sem spread porque o produto leiloado é potência (MW) disponível sob comando do ONS — reserva de capacidade para as horas críticas, não arbitragem de energia. A receita do contrato remunera a largura do cano; o uso do tanque é instrução do operador. Confundir os dois produtos é confundir MW com MWh — o erro nº 5 da tabela de mitos."
      }
    ],
    "alertas": [
      "O enunciado (100 MW / 400 MWh, 88%) é o cenário-padrão do INST·07 (Aula 09): deslocado, consumido e perdido são o calculado do instrumento. O cálculo do INST·07 só abre depois da tentativa deste exercício."
    ]
  },
  {
    "id": "m03-a09-d01",
    "moduloId": "modulo-03",
    "aula": 9,
    "origem": "derivado-da-aula",
    "tipo": "escolha",
    "enunciado": "Que vocação a aula atribui a uma bateria com duração de menos de 1 hora?",
    "alternativas": [
      "serviços rápidos",
      "pico e arbitragem",
      "deslocamento longo"
    ],
    "gabarito": 0,
    "referencia": "menos de 1 hora, é máquina de serviços rápidos",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "alternativa-correta",
    "fonte": {
      "arquivo": "Alexandria modulos/alexandria_modulo03.html",
      "campo": "aula-03-09 · bloco [1] (paragrafo)",
      "linha": 1992
    },
    "evidencias": [
      {
        "arquivo": "Alexandria modulos/alexandria_modulo03.html",
        "campo": "aula-03-09 · bloco [1] (paragrafo)",
        "linha": 1992,
        "trecho": "menos de 1 hora, é máquina de serviços rápidos"
      }
    ]
  },
  {
    "id": "m03-a09-d02",
    "moduloId": "modulo-03",
    "aula": 9,
    "origem": "derivado-da-aula",
    "tipo": "aberto",
    "enunciado": "Por que a aula diz que a bateria não veio substituir o reservatório?",
    "gabarito": null,
    "referencia": "o reservatório desloca energia entre estações; a bateria, entre horas. A bateria não veio substituir o reservatório — veio substituir a térmica de ponta, o diesel de emergência e o corte de renovável.",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "Alexandria modulos/alexandria_modulo03.html",
      "campo": "aula-03-09 · bloco [6] (paragrafo)",
      "linha": 2036
    },
    "evidencias": [
      {
        "arquivo": "Alexandria modulos/alexandria_modulo03.html",
        "campo": "aula-03-09 · bloco [6] (paragrafo)",
        "linha": 2036,
        "trecho": "o reservatório desloca energia entre estações; a bateria, entre horas. A bateria não veio substituir o reservatório — veio substituir a térmica de ponta, o diesel de emergência e o corte de renovável."
      }
    ]
  },
  {
    "id": "m03-ex-09",
    "moduloId": "modulo-03",
    "aula": 10,
    "origem": "fonte",
    "tipo": "aberto",
    "enunciado": "Calcule o LCOE didático de uma UFV: CAPEX <b>R$ 3.500/kW</b>, O&M fixo <b>R$ 50/kW·ano</b>, FC <b>27%</b>, vida <b>25 anos</b>, WACC <b>10%</b> (CRF ≈ 0,110), variável zero. Depois diga, em uma frase por item, dois motivos pelos quais esse número <b>não</b> basta para decidir contra um PPA de gás.",
    "gabarito": null,
    "referencia": "Custo anual = 3.500 × 0,110 + 50 = <span class=\"calc\">R$ 435/kW·ano</span>. Energia anual = 8.760 × 0,27 = <span class=\"calc\">2.365 kWh = 2,365 MWh/kW</span>. LCOE = 435 ÷ 2,365 ≈ <span class=\"calc\">R$ 184/MWh</span>. Por que não basta: (1) <b>atributos</b> — o MWh solar é diurno e variável; o do gás é firme e sob comando: produtos diferentes pela mesma régua (limite 1); (2) <b>circularidade</b> — o LCOE do gás depende de quantas horas ele rodará, que depende justamente de quanta solar existe (limite 2). A comparação certa é custo do portfólio com e sem cada peça.",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "docs/alexandria-v2/extraction/m03/aparato.json",
      "campo": "exercicios.itens[8].enunciado.html",
      "linha": 2354
    },
    "evidencias": [
      {
        "arquivo": "docs/alexandria-v2/extraction/m03/aparato.json",
        "campo": "exercicios.itens[8].enunciado.texto",
        "linha": 2354,
        "trecho": "Calcule o LCOE didático de uma UFV: CAPEX R$ 3.500/kW, O&M fixo R$ 50/kW·ano, FC 27%, vida 25 anos, WACC 10% (CRF ≈ 0,110), variável zero. Depois diga, em uma frase por item, dois motivos pelos quais esse número não basta para decidir contra um PPA de gás."
      },
      {
        "arquivo": "docs/alexandria-v2/extraction/m03/aparato.json",
        "campo": "exercicios.itens[8].resposta_de_referencia.paragrafos",
        "linha": 2354,
        "trecho": "Custo anual = 3.500 × 0,110 + 50 = R$ 435/kW·ano. Energia anual = 8.760 × 0,27 = 2.365 kWh = 2,365 MWh/kW. LCOE = 435 ÷ 2,365 ≈ R$ 184/MWh. Por que não basta: (1) atributos — o MWh solar é diurno e variável; o do gás é firme e sob comando: produtos diferentes pela mesma régua (limite 1); (2) circularidade — o LCOE do gás depende de quantas horas ele rodará, que depende justamente de quanta solar existe (limite 2). A comparação certa é custo do portfólio com e sem cada peça."
      }
    ],
    "alertas": [
      "O enunciado (CAPEX R$ 3.500/kW, O&M R$ 50, FC 27%, 25 anos, WACC 10%) é o cenário-padrão do INST·08 (Aula 10): o LCOE é o calculado do instrumento. O cálculo do INST·08 só abre depois da tentativa deste exercício."
    ]
  },
  {
    "id": "m03-ex-10",
    "moduloId": "modulo-03",
    "aula": 10,
    "origem": "fonte",
    "tipo": "aberto",
    "enunciado": "Teste dos três níveis: explique <b>\"por que o sistema não compra fontes, compra atributos\"</b> em três versões — criança de 12 anos, diretor industrial, especialista de setor. Fale em voz alta antes de abrir.",
    "gabarito": null,
    "referencia": "<b>Criança:</b> um time não compra \"o melhor jogador\" cinco vezes — compra goleiro, zagueiro e atacante, porque o jogo precisa de funções diferentes; a eletricidade também: tem usina barata, usina que liga na hora, usina que guarda. <b>Diretor:</b> sua conta paga produtos distintos — energia em volume, potência firme nas horas caras, flexibilidade e qualidade; cada tecnologia entrega um pacote diferente desses produtos, e o contrato bom compra o encaixe contra a sua curva de carga, não a etiqueta da fonte. <b>Especialista:</b> a otimização do sistema valora separadamente energia, capacidade, flexibilidade, inércia e localização sob restrições de rede e estoque; tecnologias são cestas distintas desses atributos, e a expansão eficiente resolve um problema de portfólio — razão pela qual ranking por LCOE não reproduz nem o despacho nem o plano ótimo.",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "docs/alexandria-v2/extraction/m03/aparato.json",
      "campo": "exercicios.itens[9].enunciado.html",
      "linha": 2363
    },
    "evidencias": [
      {
        "arquivo": "docs/alexandria-v2/extraction/m03/aparato.json",
        "campo": "exercicios.itens[9].enunciado.texto",
        "linha": 2363,
        "trecho": "Teste dos três níveis: explique \"por que o sistema não compra fontes, compra atributos\" em três versões — criança de 12 anos, diretor industrial, especialista de setor. Fale em voz alta antes de abrir."
      },
      {
        "arquivo": "docs/alexandria-v2/extraction/m03/aparato.json",
        "campo": "exercicios.itens[9].resposta_de_referencia.paragrafos",
        "linha": 2363,
        "trecho": "Criança: um time não compra \"o melhor jogador\" cinco vezes — compra goleiro, zagueiro e atacante, porque o jogo precisa de funções diferentes; a eletricidade também: tem usina barata, usina que liga na hora, usina que guarda. Diretor: sua conta paga produtos distintos — energia em volume, potência firme nas horas caras, flexibilidade e qualidade; cada tecnologia entrega um pacote diferente desses produtos, e o contrato bom compra o encaixe contra a sua curva de carga, não a etiqueta da fonte. Especialista: a otimização do sistema valora separadamente energia, capacidade, flexibilidade, inércia e localização sob restrições de rede e estoque; tecnologias são cestas distintas desses atributos, e a expansão eficiente resolve um problema de portfólio — razão pela qual ranking por LCOE não reproduz nem o despacho nem o plano ótimo."
      }
    ],
    "alertas": [
      "Vínculo mecânico: a fonte não prende este exercício a aula; \"atributos\" aparece nas Aulas 8, 10; vai para a última, a 10."
    ]
  },
  {
    "id": "m03-a10-d01",
    "moduloId": "modulo-03",
    "aula": 10,
    "origem": "derivado-da-aula",
    "tipo": "aberto",
    "enunciado": "Que conceito sucessor do LCOE a aula apresenta, e o que ele pergunta?",
    "gabarito": null,
    "referencia": "O conceito sucessor — valor de sistema, ou \"LCOE ajustado\" — pergunta o que cada MWh vale dado quando e onde entra.",
    "contaParaCriterioDoDrill": false,
    "tolerancia": null,
    "verificacao": "autoavaliacao",
    "fonte": {
      "arquivo": "Alexandria modulos/alexandria_modulo03.html",
      "campo": "aula-03-10 · bloco [4] (paragrafo)",
      "linha": 2120
    },
    "evidencias": [
      {
        "arquivo": "Alexandria modulos/alexandria_modulo03.html",
        "campo": "aula-03-10 · bloco [4] (paragrafo)",
        "linha": 2120,
        "trecho": "O conceito sucessor — valor de sistema, ou \"LCOE ajustado\" — pergunta o que cada MWh vale dado quando e onde entra."
      }
    ]
  }
];

export const EXERCICIOS_DO_MODULO: ExercicioDoModulo[] = [];

export const PROVAS: ProvaDoModulo[] = [
  {
    "moduloId": "modulo-03",
    "criterio": "Quiz de fluência. Cada resposta tem feedback explicativo. O critério de domínio do módulo é acertar pelo menos 8 de 10 sem consultar.",
    "acertosMinimos": 8,
    "total": 10,
    "questoes": [
      {
        "id": "m03-quiz-q01",
        "enunciado": "A solar responde por ~25% da capacidade instalada brasileira, mas ~10% da energia gerada. A explicação correta é:",
        "alternativas": [
          "Curtailment no Nordeste corta a maior parte da geração solar",
          "O fator de capacidade solar (~25–30%) é cerca de metade do FC médio do resto do parque",
          "A MMGD não é contabilizada em nenhuma estatística oficial",
          "Os inversores limitam a potência das usinas fotovoltaicas"
        ],
        "correta": 1,
        "explicacao": "É a aritmética das três lentes: participação em energia ≈ participação em capacidade × (FC da fonte ÷ FC médio do parque). Com FC de ~27% contra um parque que tira ~50%, a fatia cai pela metade. Curtailment e contabilização da MMGD são reais, mas são efeitos de segunda ordem — o FC explica o grosso.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m03/aparato.json",
          "campo": "avaliacao.questoes[0]",
          "linha": 3414
        }
      },
      {
        "id": "m03-quiz-q02",
        "enunciado": "Mesma seca, duas usinas de 1.000 MW: uma a fio d'água, outra com grande reservatório. O que distingue o produto entregue por cada uma?",
        "alternativas": [
          "A fio d'água gera mais barato, porque dispensa o custo do reservatório",
          "A de reservatório entrega energia firme — sustenta geração na estiagem sacando do estoque; a fio d'água entrega o que o rio mandar",
          "Não há diferença relevante: ambas têm CVU zero e mesma garantia física",
          "A fio d'água é mais flexível para acompanhar a rampa do fim da tarde"
        ],
        "correta": 1,
        "explicacao": "Mesma física de conversão, atributo oposto: o estoque é o que transforma fonte variável em fonte despachável. A fio d'água vende energia média; o reservatório vende a certeza — e a certeza é exatamente o que ficou escassa na matriz pós-2000. CVU zero nas duas não significa mesmo produto.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m03/aparato.json",
          "campo": "avaliacao.questoes[1]",
          "linha": 3425
        }
      },
      {
        "id": "m03-quiz-q03",
        "enunciado": "Por que os reservatórios do SIN são chamados de 'a bateria do Brasil'?",
        "alternativas": [
          "Porque armazenam eletricidade gerada nos horários de sobra solar",
          "Porque estocam a fonte primária — água em altura — em escala de meses, deslocando energia entre estações",
          "Porque fornecem a inércia que estabiliza a frequência do sistema",
          "Porque o ONS os recarrega bombeando água nos horários baratos"
        ],
        "correta": 1,
        "explicacao": "Ninguém estoca elétrons em escala de rede — a restrição do Módulo 02 segue válida. O reservatório estoca a chuva: EAR na casa de 200 TWh equivalentes (ONS, ordem viva), cinco ordens de grandeza acima de uma grande BESS. Bombear é a reversível (UHR) — outra tecnologia. Inércia eles também dão, mas não é isso que a metáfora descreve.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m03/aparato.json",
          "campo": "avaliacao.questoes[2]",
          "linha": 3436
        }
      },
      {
        "id": "m03-quiz-q04",
        "enunciado": "Um sítio eólico tem vento médio 25% mais rápido que outro. Pela física da fonte, a energia disponível no vento é aproximadamente:",
        "alternativas": [
          "25% maior — a relação é linear",
          "56% maior — cresce com o quadrado",
          "O dobro — cresce com o cubo da velocidade",
          "Igual — o que muda é apenas o desgaste da turbina"
        ],
        "correta": 2,
        "explicacao": "P ∝ v³: 1,25³ ≈ 1,95 — praticamente o dobro. O cubo é o negócio inteiro da indústria: explica micrositing valendo fortunas, torres cada vez mais altas e o porquê de o litoral do NE, com alísios fortes e estáveis, entregar FC de 40–55% — classe mundial sem sair da terra.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m03/aparato.json",
          "campo": "avaliacao.questoes[3]",
          "linha": 3447
        }
      },
      {
        "id": "m03-quiz-q05",
        "enunciado": "Por que um sistema de MMGD pode 'fechar conta' onde uma UFV centralizada jamais competiria?",
        "alternativas": [
          "Porque os módulos usados na MMGD são mais eficientes",
          "Porque a MMGD recebe subsídio direto do Tesouro por MWh gerado",
          "Porque a MMGD compete contra a tarifa cheia de varejo (energia + fio + encargos + tributos), enquanto a UFV compete contra o preço de atacado",
          "Porque a MMGD não paga nenhum componente de rede após a Lei 14.300"
        ],
        "correta": 2,
        "explicacao": "Mesma física, réguas opostas. O MWh do telhado evita varejo — que custa múltiplas vezes o atacado — por isso o boom brasileiro foi de telhado. E a Lei 14.300 não zerou a rede: instituiu justamente a cobrança gradual do Fio B dos novos sistemas. É o limite 1 do LCOE aplicado: o valor depende de onde o MWh entra.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m03/aparato.json",
          "campo": "avaliacao.questoes[4]",
          "linha": 3458
        }
      },
      {
        "id": "m03-quiz-q06",
        "enunciado": "A frase 'a térmica é um conversor de preço de combustível em preço de energia' descreve qual mecânica?",
        "alternativas": [
          "CVU ≈ preço do combustível × heat rate + O&M variável — e a marginal transfere esse custo ao preço do sistema",
          "O reajuste anual das tarifas de distribuição pela inflação",
          "A indexação dos contratos do mercado livre ao câmbio",
          "O rateio do custo da CCC entre todos os consumidores"
        ],
        "correta": 0,
        "explicacao": "O heat rate é a taxa de conversão: combustível caro no mercado global vira CVU alto, e quando essa máquina marca a margem, vira custo marginal do país. Foi o GNL spot fazendo exatamente isso em 2021 — CVUs acima de R$ 1.000/MWh dentro do despacho e a bandeira de escassez de R$ 14,20/100 kWh na fatura.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m03/aparato.json",
          "campo": "avaliacao.questoes[5]",
          "linha": 3469
        }
      },
      {
        "id": "m03-quiz-q07",
        "enunciado": "Um contrato take-or-pay de gás obriga uma térmica de CVU alto a gerar mesmo sem mérito econômico. Onde o sobrecusto desse despacho aparece?",
        "alternativas": [
          "No PLD do submercado onde a usina está",
          "Na TUST paga pela usina à transmissão",
          "Como encargo (ESS), rateado entre os consumidores — invisível em qualquer preço",
          "No CVU homologado da própria usina, que é reajustado para cima"
        ],
        "correta": 2,
        "explicacao": "Despacho fora da ordem de mérito não passa pelo preço — vira ESS na liquidação, pago por todos e visto por ninguém. A lição estrutural da Aula 06: flexibilidade é atributo do conjunto máquina + contrato + combustível. Uma turbina ágil amarrada num take-or-pay é uma atleta de pernas amarradas.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m03/aparato.json",
          "campo": "avaliacao.questoes[6]",
          "linha": 3480
        }
      },
      {
        "id": "m03-quiz-q08",
        "enunciado": "Qual é o debate tecnicamente correto sobre Angra 3?",
        "alternativas": [
          "Segurança: reatores PWR têm risco operacional incompatível com áreas povoadas",
          "Capital e prazo: 39 anos de obra, ~R$ 1 bi/ano parada, e tarifa de referência na casa de R$ 800/MWh — contra a decisão entre ~R$ 24 bi para concluir e ~R$ 26 bi para enterrar",
          "Combustível: o Brasil não domina o ciclo do urânio",
          "Rede: não há transmissão para escoar a energia no Sudeste"
        ],
        "correta": 1,
        "explicacao": "A física de Angra 3 é a de centenas de PWRs operando no mundo; o que a distingue é o histórico de capital parado compondo por décadas. Com CAPEX dominante, prazo e WACC mandam — nenhuma engenharia salva a planilha. (Números vivos: a decisão do CNPE e a situação societária Âmbar/ENBPar estavam abertas em jun/2026 — verificar antes de citar.)",
        "alertas": [
          "D11: a alternativa D perdeu o número \"1,4 GW\", que o módulo nunca estabelece."
        ],
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m03/aparato.json",
          "campo": "avaliacao.questoes[7]",
          "linha": 3491
        }
      },
      {
        "id": "m03-quiz-q09",
        "enunciado": "O LRCAP 2026 – Armazenamento (Portaria MME 136/2026) contrata baterias para entregar qual produto?",
        "alternativas": [
          "Energia (MWh) para deslocar a barriga solar via arbitragem por conta própria",
          "Potência (MW) disponível por 15 anos, sob despacho do ONS, com suprimento a partir de agosto de 2028",
          "Inércia sintética para substituir as máquinas síncronas",
          "Créditos de compensação para a MMGD industrial"
        ],
        "correta": 1,
        "explicacao": "O produto é a largura do cano, não o tanque: reserva de capacidade sob comando do operador — certames em 2/dez (com requisitos de nacionalização) e 4/dez/2026 (aberto), contratos de 15 anos. Confundir MW com MWh é o erro nº 5 da tabela de mitos — e este leilão é o exemplo institucional da diferença. (Regras vivas: verificar edital vigente.)",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m03/aparato.json",
          "campo": "avaliacao.questoes[8]",
          "linha": 3502
        }
      },
      {
        "id": "m03-quiz-q10",
        "enunciado": "Qual das afirmações abaixo é um uso CORRETO do LCOE?",
        "alternativas": [
          "Como a solar tem o menor LCOE, o sistema deveria expandir apenas solar",
          "O LCOE do gás flexível prova que térmicas são investimento ruim",
          "Comparar dois projetos solares de sítios diferentes, sob as mesmas premissas de capital",
          "Somar os LCOEs das fontes para estimar a tarifa final do consumidor"
        ],
        "correta": 2,
        "explicacao": "LCOE compara máquinas da mesma natureza sob premissas comuns — para isso, é excelente. Os outros três usos tropeçam nos limites: ignorar atributos e canibalização (a), circularidade do FC térmico (b), e confundir custo de geração com formação tarifária (d). A régua de sistema é outra: custo do portfólio com e sem cada peça.",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m03/aparato.json",
          "campo": "avaliacao.questoes[9]",
          "linha": 3513
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
        "mensagem": "Domínio sólido. Pronto para o Módulo 04 — Economia de Mercados."
      }
    ],
    "faixasFonte": {
      "arquivo": "docs/alexandria-v2/extraction/m03/aparato.json",
      "campo": "avaliacao.placar.faixas",
      "linha": 3571
    },
    "criterioFonte": {
      "arquivo": "docs/alexandria-v2/extraction/m03/aparato.json",
      "campo": "avaliacao.introducao.texto",
      "linha": 2379
    }
  }
];

export const CHECKLISTS: ChecklistDoModulo[] = [
  {
    "moduloId": "modulo-03",
    "introducao": "Você só passa neste módulo se conseguir, sem consultar nenhum material, fazer todas as ações abaixo. Marque ao longo do estudo. Quando todas estiverem marcadas — e o quiz fechar em 8/10 ou mais — você está pronto para o Módulo 04 — Economia de Mercados.",
    "itens": [
      {
        "id": "m03-checklist-01",
        "texto": "Desenhar num guardanapo a matriz brasileira em capacidade E em energia — dois desenhos diferentes, com ordens de grandeza por fonte",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m03/aparato.json",
          "campo": "checklist_final.itens[0].texto",
          "linha": 2467
        }
      },
      {
        "id": "m03-checklist-02",
        "texto": "Definir fator de capacidade pela fórmula e citar as faixas típicas de hidro, eólica NE, solar e nuclear",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m03/aparato.json",
          "campo": "checklist_final.itens[1].texto",
          "linha": 2468
        }
      },
      {
        "id": "m03-checklist-03",
        "texto": "Explicar a \"usina invisível\": por que a MMGD aparece como redução de carga, não como geração",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m03/aparato.json",
          "campo": "checklist_final.itens[2].texto",
          "linha": 2469
        }
      },
      {
        "id": "m03-checklist-04",
        "texto": "Explicar por que os reservatórios são a bateria do Brasil — com a ordem de grandeza da EAR e a era em que foram construídos",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m03/aparato.json",
          "campo": "checklist_final.itens[3].texto",
          "linha": 2470
        }
      },
      {
        "id": "m03-checklist-05",
        "texto": "Contar a história do valor da água pelo lado do ativo: o que o estoque transforma na usina",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m03/aparato.json",
          "campo": "checklist_final.itens[4].texto",
          "linha": 2471
        }
      },
      {
        "id": "m03-checklist-06",
        "texto": "Explicar o trade-off do fio d'água e a consequência sistêmica \"mais energia média, menos firmeza por MW\" — com Belo Monte como âncora",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m03/aparato.json",
          "campo": "checklist_final.itens[5].texto",
          "linha": 2472
        }
      },
      {
        "id": "m03-checklist-07",
        "texto": "Defender o vento do NE com o cubo da velocidade, os FCs de 40–55% e a complementaridade sazonal com a hidrologia",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m03/aparato.json",
          "campo": "checklist_final.itens[6].texto",
          "linha": 2473
        }
      },
      {
        "id": "m03-checklist-08",
        "texto": "Separar UFV de MMGD pela régua econômica — atacado vs tarifa cheia — e citar o papel da Lei 14.300/2022",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m03/aparato.json",
          "campo": "checklist_final.itens[7].texto",
          "linha": 2474
        }
      },
      {
        "id": "m03-checklist-09",
        "texto": "Explicar canibalização solar e a rampa do fim da tarde como consequências do mesmo perfil",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m03/aparato.json",
          "campo": "checklist_final.itens[8].texto",
          "linha": 2475
        }
      },
      {
        "id": "m03-checklist-10",
        "texto": "Escrever a equação do CVU, diferenciar ciclo simples de combinado e explicar \"a térmica é um conversor de preço de combustível\"",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m03/aparato.json",
          "campo": "checklist_final.itens[9].texto",
          "linha": 2476
        }
      },
      {
        "id": "m03-checklist-11",
        "texto": "Explicar o que o take-or-pay faz com a ordem de mérito e onde o sobrecusto aparece (ESS)",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m03/aparato.json",
          "campo": "checklist_final.itens[10].texto",
          "linha": 2477
        }
      },
      {
        "id": "m03-checklist-12",
        "texto": "Citar o papel real de carvão, óleo/diesel (CCC, paradoxo amazônico) e biomassa (safra = estação seca)",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m03/aparato.json",
          "campo": "checklist_final.itens[11].texto",
          "linha": 2478
        }
      },
      {
        "id": "m03-checklist-13",
        "texto": "Narrar Angra 3 em quatro frases como debate de capital e prazo — com três números vivos e a ressalva de verificação",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m03/aparato.json",
          "campo": "checklist_final.itens[12].texto",
          "linha": 2479
        }
      },
      {
        "id": "m03-checklist-14",
        "texto": "Explicar MW vs MWh de bateria, a perda do ciclo, e o que o LRCAP 2026 – Armazenamento compra (potência) com as datas-chave",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m03/aparato.json",
          "campo": "checklist_final.itens[13].texto",
          "linha": 2480
        }
      },
      {
        "id": "m03-checklist-15",
        "texto": "Situar reservatório (estações) e bateria (horas) como estoques de fusos diferentes — cinco ordens de grandeza",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m03/aparato.json",
          "campo": "checklist_final.itens[14].texto",
          "linha": 2481
        }
      },
      {
        "id": "m03-checklist-16",
        "texto": "Calcular um LCOE didático no guardanapo e recitar os quatro limites como vacina",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m03/aparato.json",
          "campo": "checklist_final.itens[15].texto",
          "linha": 2482
        }
      },
      {
        "id": "m03-checklist-17",
        "texto": "Montar \"o time\" da matriz — a função de cada fonte — e sustentar o roteiro de 5 minutos sem travar",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m03/aparato.json",
          "campo": "checklist_final.itens[16].texto",
          "linha": 2483
        }
      },
      {
        "id": "m03-checklist-18",
        "texto": "Reproduzir a leitura da Operação A Parte 3: três candidaturas tecnológicas, perguntas a verificar, e a linguagem de oportunidades potenciais a validar",
        "fonte": {
          "arquivo": "docs/alexandria-v2/extraction/m03/aparato.json",
          "campo": "checklist_final.itens[17].texto",
          "linha": 2484
        }
      }
    ]
  }
];
