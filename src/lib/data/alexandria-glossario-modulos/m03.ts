// GERADO por tools/alexandria-dados/glossario/gerar-glossario.mjs — não editar à mão.
// Fonte: docs/alexandria-v2/extraction/glossario/glossario.json, módulo m03 (Tecnologias de Geração).
// 63 verbetes, na ordem do glossário do módulo. Literal da extração.
// Sem troca editorial neste módulo.

import type { VerbeteDaFonte } from './tipo';

export const GLOSSARIO_M03: readonly VerbeteDaFonte[] = [
  {
    id: "gl-m03-aerogerador",
    fonte: "m03-lex-01",
    term: "Aerogerador",
    unit: "Eólica",
    definition:
      "O conjunto turbina eólica completo: rotor (pás + cubo), nacele (multiplicadora ou acionamento direto, gerador, controle) e torre. As máquinas modernas onshore passam de 100 m de altura de cubo e diâmetros de rotor acima de 150 m — altura e área existem por causa do cubo da velocidade.",
  },
  {
    id: "gl-m03-afluencia",
    fonte: "m03-lex-02",
    term: "Afluência",
    unit: "Hidro",
    definition:
      "A vazão de água que chega a um aproveitamento hidrelétrico num período. É a \"receita\" física da usina: o fio d'água a converte imediatamente; o reservatório escolhe entre turbinar e estocar.",
  },
  {
    id: "gl-m03-arbitragem-de-energia",
    fonte: "m03-lex-03",
    term: "Arbitragem (de energia)",
    unit: "Armazenamento",
    definition:
      "Comprar (carregar) energia na hora barata e vender (descarregar) na hora cara. É a aplicação clássica da bateria de 2–4 horas: barriga solar do meio-dia → rampa do fim da tarde. O valor capturado é o spread entre as horas, menos as perdas do ciclo.",
  },
  {
    id: "gl-m03-autoproducao",
    fonte: "m03-lex-04",
    term: "Autoprodução",
    unit: "Regulatório",
    definition:
      "Regime em que o consumidor gera (ou participa de geração) para consumo próprio, com tratamento regulatório e de encargos específico. Os desenhos e limiares de enquadramento — inclusive por participação societária em usina remota — mudaram nos últimos anos: item permanente de verificação vigente antes de qualquer estudo.",
  },
  {
    id: "gl-m03-bagaco-de-cana",
    fonte: "m03-lex-05",
    term: "Bagaço de cana",
    unit: "Biomassa",
    definition:
      "Resíduo fibroso da moagem da cana, queimado em caldeiras de cogeração no setor sucroenergético. Combustível \"grátis\" do ponto de vista da usina (subproduto), disponível no calendário da safra — abril a novembro no Centro-Sul.",
  },
  {
    id: "gl-m03-balbina",
    fonte: "m03-lex-06",
    term: "Balbina",
    unit: "História",
    definition:
      "UHE no Amazonas (anos 1980) que virou o anti-exemplo do setor: área alagada enorme para potência pequena. Trauma formativo citado em todo debate de licenciamento — parte da explicação de por que o país migrou para o fio d'água.",
  },
  {
    id: "gl-m03-bess",
    fonte: "m03-lex-07",
    term: "BESS",
    unit: "Armazenamento",
    definition:
      "Battery Energy Storage System — sistema de armazenamento por baterias, tipicamente lítio (química LFP dominante), com inversores e controle. Definido por dois números independentes: potência (MW) e energia (MWh).",
  },
  {
    id: "gl-m03-canibalizacao",
    fonte: "m03-lex-08",
    term: "Canibalização",
    unit: "Economia",
    definition:
      "Erosão do preço capturado por uma fonte variável à medida que sua própria penetração cresce: cada novo MW solar gera nas mesmas horas dos anteriores, derrubando o preço justamente quando a fonte produz. Custo médio em queda com receita unitária em queda mais rápida — o limite nº 3 do LCOE.",
  },
  {
    id: "gl-m03-capex",
    fonte: "m03-lex-09",
    term: "CAPEX",
    unit: "Economia",
    definition:
      "Capital expenditure — o investimento de construção do ativo. Nas fontes da Família 1 (hidro, eólica, solar, nuclear) domina o custo total; anualizado pelo CRF, é o numerador principal do LCOE.",
  },
  {
    id: "gl-m03-ccc",
    fonte: "m03-lex-10",
    term: "CCC",
    unit: "Encargo",
    definition:
      "Conta de Consumo de Combustíveis — encargo setorial que socializa nacionalmente o sobrecusto da geração (majoritariamente a diesel/óleo) dos sistemas isolados. O mecanismo do \"paradoxo amazônico\": todo consumidor do SIN ajuda a pagar a energia mais cara do país.",
  },
  {
    id: "gl-m03-cgh",
    fonte: "m03-lex-11",
    term: "CGH",
    unit: "Hidro",
    definition:
      "Central Geradora Hidrelétrica — aproveitamento hidrelétrico de pequeno porte (até 5 MW), com registro simplificado na ANEEL. Junto das PCHs, compõe a hidreletricidade de pequena escala do país.",
  },
  {
    id: "gl-m03-ciclo-combinado",
    fonte: "m03-lex-12",
    term: "Ciclo combinado",
    unit: "Térmica",
    definition:
      "Configuração em que o calor de exaustão da turbina a gás gera vapor para uma segunda turbina. Eficiência de 55–60% — o melhor rendimento térmico do portfólio — em troca de partida mais lenta e CAPEX maior. Vocação: rodar muitas horas.",
  },
  {
    id: "gl-m03-ciclo-simples",
    fonte: "m03-lex-13",
    term: "Ciclo simples",
    unit: "Térmica",
    definition:
      "Turbina a gás em ciclo aberto: queima, gira, exausta. Eficiência de 35–40%, partida em minutos, CAPEX baixo. Vocação: ponta, emergência, flexibilidade — a máquina que cobra caro por hora e barato por existir.",
  },
  {
    id: "gl-m03-cogeracao",
    fonte: "m03-lex-14",
    term: "Cogeração",
    unit: "Térmica",
    definition:
      "Produção combinada de eletricidade e calor útil de processo a partir do mesmo combustível. É o desenho padrão da biomassa sucroenergética: a caldeira fornece vapor à usina de açúcar/etanol e o excedente vira eletricidade exportada.",
  },
  {
    id: "gl-m03-crf",
    fonte: "m03-lex-15",
    term: "CRF",
    unit: "Finanças",
    definition:
      "Capital Recovery Factor — fator que converte um investimento em parcelas anuais equivalentes dada uma taxa (WACC) e uma vida útil: CRF = r(1+r)ⁿ / ((1+r)ⁿ − 1). Com r = 10% e n = 25 anos, ≈ 0,11 — cada real de CAPEX \"custa\" 11 centavos por ano.",
  },
  {
    id: "gl-m03-curtailment",
    fonte: "m03-lex-16",
    term: "Curtailment",
    unit: "Operação",
    definition:
      "Corte de geração renovável disponível por restrição de escoamento ou excesso sistêmico — energia de custo zero desperdiçada por falta de fio ou de demanda. Cresceu no NE com o boom eólico-solar; quem arca com o custo segue em disputa regulatória.",
  },
  {
    id: "gl-m03-curva-de-potencia",
    fonte: "m03-lex-17",
    term: "Curva de potência",
    unit: "Eólica",
    definition:
      "O gráfico potência × velocidade do vento de cada modelo de turbina: zero até o cut-in (~3 m/s), subida cúbica até a nominal (~12 m/s), platô de potência cheia até o cut-out (~25 m/s), desligamento acima. O documento que casa máquina com sítio.",
  },
  {
    id: "gl-m03-cut-in-cut-out",
    fonte: "m03-lex-18",
    term: "Cut-in / cut-out",
    unit: "Eólica",
    definition:
      "Velocidades de vento de partida (~3 m/s) e de desligamento por segurança (~25 m/s) de um aerogerador. Entre elas, a máquina extrai energia seguindo a curva de potência.",
  },
  {
    id: "gl-m03-cvu",
    fonte: "m03-lex-19",
    term: "CVU",
    unit: "Despacho",
    definition:
      "Custo Variável Unitário — o custo declarado e homologado de gerar 1 MWh adicional numa térmica, dominado pelo combustível (preço × heat rate) mais O&M variável. Ordena a pilha de despacho e, na margem, forma o preço de curto prazo.",
  },
  {
    id: "gl-m03-densidade-energetica",
    fonte: "m03-lex-20",
    term: "Densidade energética",
    unit: "Física",
    definition:
      "Energia contida por unidade de massa ou volume do combustível. O extremo é o urânio: uma pastilha equivale a toneladas de carvão — a razão física do CVU baixíssimo e do CAPEX altíssimo da nuclear.",
  },
  {
    id: "gl-m03-despachabilidade",
    fonte: "m03-lex-21",
    term: "Despachabilidade",
    unit: "Atributo",
    definition:
      "Capacidade de gerar sob comando do operador, não sob condição do recurso. Combina controlabilidade, velocidade de resposta e duração sustentável (limitada pelo estoque: água, combustível, carga da bateria). O atributo que separa as famílias do portfólio.",
  },
  {
    id: "gl-m03-ear",
    fonte: "m03-lex-22",
    term: "EAR",
    unit: "Hidro",
    definition:
      "Energia Armazenada — quanto de energia equivalente existe estocado nos reservatórios, publicado diariamente pelo ONS por subsistema, em % da capacidade máxima. O indicador antecedente do humor do preço e da bandeira.",
  },
  {
    id: "gl-m03-eficiencia-de-ciclo-round-trip",
    fonte: "m03-lex-23",
    term: "Eficiência de ciclo (round-trip)",
    unit: "Armazenamento",
    definition:
      "Razão entre a energia descarregada e a energia consumida para carregar uma bateria — 85–90% típico em lítio. O \"pedágio\" da viagem no tempo: perde-se energia para ganhar deslocamento temporal.",
  },
  {
    id: "gl-m03-ena",
    fonte: "m03-lex-24",
    term: "ENA",
    unit: "Hidro",
    definition:
      "Energia Natural Afluente — a afluência convertida em energia equivalente, geralmente expressa em % da média de longo termo (MLT). É a \"chuva em MWh\": o dial que o INST·03 manipula e que o mercado acompanha semanalmente.",
  },
  {
    id: "gl-m03-energia-firme-firmeza",
    fonte: "m03-lex-25",
    term: "Energia firme / firmeza",
    unit: "Atributo",
    definition:
      "Capacidade de sustentar entrega nas condições críticas — a estiagem, a noite sem vento, o pico. O atributo escasso do sistema moderno: abundância de energia média com escassez de firmeza é o resumo da matriz pós-fio d'água.",
  },
  {
    id: "gl-m03-fator-de-capacidade",
    fonte: "m03-lex-26",
    term: "Fator de capacidade",
    unit: "Métrica",
    definition:
      "Energia gerada ÷ (potência instalada × horas do período). A lente que converte MW de manchete em MWh de realidade: ~50–55% hidro, 40–55% eólica NE, 25–30% solar com tracker, 85–90% nuclear, e — para térmicas — o diário do despacho, não atributo da máquina.",
  },
  {
    id: "gl-m03-fio-b",
    fonte: "m03-lex-27",
    term: "Fio B",
    unit: "Tarifa",
    definition:
      "Parcela da TUSD que remunera os ativos da própria distribuidora. Virou protagonista na MMGD: a Lei 14.300 instituiu sua cobrança gradual dos novos sistemas compensados — o \"pedágio\" pela rede que o prosumidor usa como bateria virtual.",
  },
  {
    id: "gl-m03-fio-d-agua",
    fonte: "m03-lex-28",
    term: "Fio d'água",
    unit: "Hidro",
    definition:
      "Hidrelétrica sem reservatório de regularização relevante: gera conforme a vazão chega. Trade-off deliberado — menos área alagada, menos firmeza. O padrão das grandes usinas brasileiras pós-2000 (Belo Monte, Jirau, Santo Antônio).",
  },
  {
    id: "gl-m03-fissao-nuclear",
    fonte: "m03-lex-29",
    term: "Fissão nuclear",
    unit: "Nuclear",
    definition:
      "Quebra controlada de núcleos pesados (urânio-235) liberando calor, que gera vapor e move turbina. Tecnicamente, a nuclear é uma térmica cujo combustível tem densidade energética extrema — daí CVU baixo e CAPEX dominante.",
  },
  {
    id: "gl-m03-garantia-fisica",
    fonte: "m03-lex-30",
    term: "Garantia física",
    unit: "Regulatório",
    definition:
      "O lastro de energia que cada usina pode comercializar, calculado pelo MME/EPE a partir da contribuição da usina ao suprimento em condições críticas. Distinta do FC verificado: é métrica regulatória de contratação, não de operação. Protagonista no Bloco de mercados.",
  },
  {
    id: "gl-m03-gnl",
    fonte: "m03-lex-31",
    term: "GNL",
    unit: "Térmica",
    definition:
      "Gás Natural Liquefeito — gás resfriado para transporte marítimo, regaseificado em terminais. Dá flexibilidade de suprimento ao preço do mercado global: foi o GNL spot que empurrou CVUs acima de R$ 1.000/MWh na crise de 2021.",
  },
  {
    id: "gl-m03-gsf",
    fonte: "m03-lex-32",
    term: "GSF",
    unit: "Hidro · preview",
    definition:
      "Generation Scaling Factor — razão entre a geração hidráulica efetiva e a garantia física do conjunto de usinas do mecanismo de rateio hidrológico. GSF abaixo de 1 = risco hidrológico virando exposição financeira dos geradores. Tratamento completo no Bloco de mercados.",
  },
  {
    id: "gl-m03-heat-rate",
    fonte: "m03-lex-33",
    term: "Heat rate",
    unit: "Térmica",
    definition:
      "Quanta energia de combustível a máquina consome por MWh elétrico gerado — o inverso da eficiência. Multiplicado pelo preço do combustível, dá o coração do CVU: a térmica como conversor de preço de combustível em preço de energia.",
  },
  {
    id: "gl-m03-inercia-sincrona",
    fonte: "m03-lex-34",
    term: "Inércia síncrona",
    unit: "Estabilidade",
    definition:
      "Energia cinética das massas girantes acopladas à rede (hidro, térmicas, nuclear), que amortece variações de frequência nos primeiros segundos de um desbalanço. Eólica e solar conectam por inversores e não a fornecem nativamente — o desafio de estabilidade do Módulo 02 que o portfólio precisa repor.",
  },
  {
    id: "gl-m03-inflexibilidade",
    fonte: "m03-lex-35",
    term: "Inflexibilidade",
    unit: "Despacho",
    definition:
      "Geração mínima obrigatória de uma usina, por restrição técnica ou contratual (take-or-pay de combustível). Térmica inflexível roda mesmo sem mérito econômico, deslocando fonte mais barata — sobrecusto que vira encargo (ESS).",
  },
  {
    id: "gl-m03-itaipu",
    fonte: "m03-lex-36",
    term: "Itaipu",
    unit: "Âncora",
    definition:
      "UHE binacional Brasil–Paraguai no rio Paraná: 14 GW, vinte unidades, historicamente na casa de 8–10% do consumo elétrico brasileiro (número vivo, varia com hidrologia). O símbolo da era dos grandes reservatórios — embora seja, a rigor, usina com regularização limitada que depende da cascata a montante.",
  },
  {
    id: "gl-m03-lei-14-300-2022",
    fonte: "m03-lex-37",
    term: "Lei 14.300/2022",
    unit: "Regulatório",
    definition:
      "O marco legal da micro e minigeração distribuída: consolidou o SCEE, garantiu transição para sistemas existentes e instituiu a cobrança gradual do Fio B dos novos. O divisor de águas do boom de telhado brasileiro.",
  },
  {
    id: "gl-m03-lei-15-097-2025",
    fonte: "m03-lex-38",
    term: "Lei 15.097/2025",
    unit: "Regulatório",
    definition:
      "O marco legal da geração eólica offshore no Brasil: regime de outorga de áreas marítimas. Sancionada com vetos a dispositivos alheios ao tema (\"jabutis\") cujo destino no Congresso é item vivo de acompanhamento.",
  },
  {
    id: "gl-m03-lcoe",
    fonte: "m03-lex-39",
    term: "LCOE",
    unit: "Economia",
    definition:
      "Levelized Cost of Energy — custo total da vida útil descontado ÷ energia total descontada, em R$/MWh. Régua útil entre projetos da mesma natureza; perigosa entre famílias diferentes. Quatro limites: ignora atributos, FC térmico circular, cega ao valor temporal, ignora integração.",
  },
  {
    id: "gl-m03-lrcap",
    fonte: "m03-lex-40",
    term: "LRCAP",
    unit: "Leilão",
    definition:
      "Leilão de Reserva de Capacidade — certame que contrata potência (MW) disponível, não energia. A edição 2026 – Armazenamento (Portaria MME 136/2026) é a estreia das baterias: certames em 2 e 4/dez/2026, contratos de 15 anos, suprimento a partir de ago/2028 (vivo — verificar).",
  },
  {
    id: "gl-m03-mlt",
    fonte: "m03-lex-41",
    term: "MLT",
    unit: "Hidro",
    definition:
      "Média de Longo Termo — a média histórica de afluências usada como referência. \"ENA a 75% da MLT\" = chove(u) três quartos do normal; é a linguagem padrão dos boletins hidrológicos.",
  },
  {
    id: "gl-m03-mmgd",
    fonte: "m03-lex-42",
    term: "MMGD",
    unit: "Solar",
    definition:
      "Micro (até 75 kW) e Minigeração Distribuída (acima disso, até os limites legais por modalidade): geração junto à carga, compensada via SCEE. A \"usina invisível\" — dezenas de GW que aparecem ao operador como redução de carga, competindo contra a tarifa cheia de varejo.",
  },
  {
    id: "gl-m03-micrositing",
    fonte: "m03-lex-43",
    term: "Micrositing",
    unit: "Eólica",
    definition:
      "Posicionamento fino de cada aerogerador dentro do parque. Como a potência cresce com o cubo da velocidade, diferenças locais pequenas de vento viram diferenças grandes de energia — engenharia de detalhe que vale fortunas.",
  },
  {
    id: "gl-m03-must-run",
    fonte: "m03-lex-44",
    term: "Must-run",
    unit: "Despacho",
    definition:
      "Geração que entra na base da pilha independentemente de preço: renováveis variáveis (custo variável ~zero), inflexibilidades técnicas e contratuais. O bloco que o despacho \"recebe pronto\" antes de otimizar o resto.",
  },
  {
    id: "gl-m03-nacele",
    fonte: "m03-lex-45",
    term: "Nacele",
    unit: "Eólica",
    definition:
      "A \"casa de máquinas\" no topo da torre eólica: eixo, multiplicadora (quando há), gerador e sistemas de controle e giro (yaw). Pesa dezenas de toneladas a mais de 100 m de altura — parte do porquê de logística ser gargalo da fonte.",
  },
  {
    id: "gl-m03-o-m",
    fonte: "m03-lex-46",
    term: "O&M",
    unit: "Economia",
    definition:
      "Operação e Manutenção — custos recorrentes do ativo, divididos em fixos (R$/kW·ano, existem mesmo parado) e variáveis (R$/MWh, proporcionais à geração). Segundo termo do numerador do LCOE.",
  },
  {
    id: "gl-m03-ordem-de-merito",
    fonte: "m03-lex-47",
    term: "Ordem de mérito",
    unit: "Despacho",
    definition:
      "A fila de despacho por custo variável crescente: must-run e CVU ~zero na base, valor da água posicionando a hidro, térmicas por CVU no topo. A fonte marginal — a última a entrar — define o custo marginal do sistema. Fundamento do Módulo 02, esqueleto do INST·06.",
  },
  {
    id: "gl-m03-pch",
    fonte: "m03-lex-48",
    term: "PCH",
    unit: "Hidro",
    definition:
      "Pequena Central Hidrelétrica — aproveitamento de até 30 MW com características definidas em regulação, historicamente beneficiado como fonte incentivada. Junto das CGHs, soma alguns GW distribuídos pelo interior.",
  },
  {
    id: "gl-m03-piso-do-pld",
    fonte: "m03-lex-49",
    term: "Piso do PLD",
    unit: "Preço",
    definition:
      "Valor mínimo regulatório do preço de curto prazo, recalculado anualmente pela ANEEL (na casa de R$ 60/MWh — vivo). É onde o preço \"encosta\" nas horas de sobra estrutural — o sintoma do meio-dia solar.",
  },
  {
    id: "gl-m03-repotenciacao",
    fonte: "m03-lex-50",
    term: "Repotenciação",
    unit: "Ativo",
    definition:
      "Substituir máquinas antigas por tecnologia atual no mesmo sítio — turbinas eólicas maiores no mesmo parque, rotores e geradores novos em hidrelétricas. Compra energia adicional sem novo sítio: o \"retrofit\" do setor de geração.",
  },
  {
    id: "gl-m03-reversivel-uhr",
    fonte: "m03-lex-51",
    term: "Reversível (UHR)",
    unit: "Armazenamento",
    definition:
      "Usina Hidrelétrica Reversível: bombeia água morro acima nas horas baratas e turbina nas caras — armazenamento por gravidade, padrão mundial para deslocamento longo. Sem projeto de grande porte operando no Brasil; em estudo no planejamento (vivo).",
  },
  {
    id: "gl-m03-scee",
    fonte: "m03-lex-52",
    term: "SCEE",
    unit: "Solar",
    definition:
      "Sistema de Compensação de Energia Elétrica — o \"saldo\" da MMGD: energia injetada vira crédito que abate consumo, nas regras e prazos da Lei 14.300. A leitura correta de créditos na fatura é item de auditoria do CLE.",
  },
  {
    id: "gl-m03-sistemas-isolados",
    fonte: "m03-lex-53",
    term: "Sistemas isolados",
    unit: "Operação",
    definition:
      "Localidades fora do SIN — concentradas na Amazônia — supridas localmente, em geral a diesel/óleo, com sobrecusto socializado pela CCC. A fronteira mais óbvia para solar + bateria substituir combustível caro.",
  },
  {
    id: "gl-m03-smr",
    fonte: "m03-lex-54",
    term: "SMR",
    unit: "Nuclear",
    definition:
      "Small Modular Reactor — reatores nucleares pequenos e modulares, fabricados em série, prometendo atacar exatamente o problema de prazo e capital da nuclear tradicional. Em demonstração no mundo; horizonte distante no Brasil.",
  },
  {
    id: "gl-m03-take-or-pay",
    fonte: "m03-lex-55",
    term: "Take-or-pay",
    unit: "Contrato",
    definition:
      "Cláusula de suprimento de combustível em que se paga um volume mínimo, consumido ou não. Transforma custo variável em afundado e gera térmica contratualmente inflexível — a \"atleta de pernas amarradas\" que distorce a ordem de mérito.",
  },
  {
    id: "gl-m03-tracker",
    fonte: "m03-lex-56",
    term: "Tracker",
    unit: "Solar",
    definition:
      "Rastreador de eixo que gira os módulos seguindo o sol. Eleva o FC da UFV para 25–30% e alarga o \"ombro\" da geração diária — CAPEX adicional que quase sempre se paga em sítios de boa irradiação.",
  },
  {
    id: "gl-m03-transicao-justa",
    fonte: "m03-lex-57",
    term: "Transição justa",
    unit: "Política",
    definition:
      "O conjunto de políticas para regiões e trabalhadores dependentes de cadeias fósseis em desativação — no Brasil, o carvão de SC/RS. Lembrete de que tecnologia de geração também é geografia social e política regional.",
  },
  {
    id: "gl-m03-tucurui",
    fonte: "m03-lex-58",
    term: "Tucuruí",
    unit: "Âncora",
    definition:
      "UHE no rio Tocantins (PA), ~8,5 GW — a maior usina 100% brasileira. Parte da geração de gigantes com reservatório construída sob lógica de Estado entre os anos 1960 e 1990.",
  },
  {
    id: "gl-m03-ufv",
    fonte: "m03-lex-59",
    term: "UFV",
    unit: "Solar",
    definition:
      "Usina Fotovoltaica centralizada — dezenas a centenas de MW vendendo no atacado (leilão ou mercado livre), concentrada onde irradiação é alta e terra é barata. Mesma física da MMGD, régua econômica oposta.",
  },
  {
    id: "gl-m03-uhe",
    fonte: "m03-lex-60",
    term: "UHE",
    unit: "Hidro",
    definition:
      "Usina Hidrelétrica de grande porte (acima dos limites de PCH). O bloco dominante da matriz: ~103 GW somando as centralizadas (SIGA — vivo), entre reservatórios históricos e fio d'água recentes.",
  },
  {
    id: "gl-m03-valor-da-agua",
    fonte: "m03-lex-61",
    term: "Valor da água",
    unit: "Despacho",
    definition:
      "Custo de oportunidade de turbinar hoje versus guardar para a estiagem, calculado pelos modelos oficiais — o \"CVU implícito\" que posiciona a hidro com reservatório na ordem de mérito. Visto pelo lado do ativo: é o estoque que dá à usina o direito de escolher quando gerar.",
  },
  {
    id: "gl-m03-vertimento",
    fonte: "m03-lex-62",
    term: "Vertimento",
    unit: "Hidro",
    definition:
      "Água liberada pelo vertedouro sem passar pelas turbinas — energia potencial descartada, por reservatório cheio ou restrição operativa. O análogo hidráulico do curtailment.",
  },
  {
    id: "gl-m03-wacc",
    fonte: "m03-lex-63",
    term: "WACC",
    unit: "Finanças",
    definition:
      "Weighted Average Cost of Capital — o custo médio ponderado do capital que desconta os fluxos do projeto. Em ativos de CAPEX dominante, é a variável mais pesada do LCOE: cada ponto de WACC vale mais que qualquer otimização de engenharia — a matemática que condenou Angra 3.",
  },
];
