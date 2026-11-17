// GERADO por tools/alexandria-dados/glossario/gerar-glossario.mjs — não editar à mão.
// Fonte: docs/alexandria-v2/extraction/glossario/glossario.json, módulo m02 (Como Funciona uma Rede Elétrica).
// 65 verbetes, na ordem do glossário do módulo. Literal da extração.
// Sem troca editorial neste módulo.

import type { VerbeteDaFonte } from './tipo';

export const GLOSSARIO_M02: readonly VerbeteDaFonte[] = [
  {
    id: "gl-m02-alimentador",
    fonte: "m02-lex-01",
    term: "Alimentador",
    unit: "Distribuição",
    definition:
      "Circuito de média tensão que sai de uma subestação de distribuição e abastece uma região — bairros, distritos industriais, zonas rurais. A falha de um alimentador desliga todos os consumidores a jusante; por isso religadores e seletividade são desenhados nesse nível.",
  },
  {
    id: "gl-m02-barramento",
    fonte: "m02-lex-02",
    term: "Barramento",
    unit: "Subestação",
    definition:
      "Condutor comum que interliga os circuitos dentro de uma subestação. A configuração do barramento (simples, duplo, em anel) define a flexibilidade de manobra e a confiabilidade da instalação inteira — é decisão de projeto, não detalhe.",
  },
  {
    id: "gl-m02-bipolo",
    fonte: "m02-lex-03",
    term: "Bipolo",
    unit: "HVDC",
    definition:
      "Configuração padrão dos grandes elos de corrente contínua: dois polos (positivo e negativo) operando em conjunto, com capacidade de seguir transmitindo parcialmente se um polo falhar. Os elos de Itaipu (±600 kV), Madeira (±600 kV) e Belo Monte (±800 kV) são bipolos.",
  },
  {
    id: "gl-m02-black-start",
    fonte: "m02-lex-04",
    term: "Black start",
    unit: "Ancilar",
    definition:
      "Capacidade de uma usina partir sem alimentação externa e energizar trechos da rede do zero após um colapso amplo. Define a velocidade da recomposição: unidades black start acendem ilhas, que sincronizam entre si até o sistema inteiro voltar.",
  },
  {
    id: "gl-m02-cag",
    fonte: "m02-lex-05",
    term: "CAG",
    unit: "Controle",
    definition:
      "Controle Automático de Geração — a regulação secundária de frequência. Comandado pelos centros de operação do ONS, redistribui geração em escala de minutos para devolver a frequência a 60,00 Hz e os intercâmbios entre áreas aos valores programados, recompondo a reserva consumida pela regulação primária.",
  },
  {
    id: "gl-m02-ccee",
    fonte: "m02-lex-06",
    term: "CCEE",
    unit: "Instituição",
    definition:
      "Câmara de Comercialização de Energia Elétrica. Contabiliza e liquida as operações de compra e venda do setor e publica o PLD. No vocabulário deste módulo: o ONS decide o despacho físico; a CCEE fecha as contas financeiras que resultam dele — inclusive o rateio do ESS.",
  },
  {
    id: "gl-m02-cmo",
    fonte: "m02-lex-07",
    term: "CMO",
    unit: "Preço",
    definition:
      "Custo Marginal de Operação — o custo de atender 1 MWh adicional de carga, apurado por submercado pela cadeia de modelos NEWAVE/DECOMP/DESSEM, com CVU auditado para térmicas e valor da água para hidrelétricas. É a base de cálculo do PLD, que o limita por piso e teto regulatórios.",
  },
  {
    id: "gl-m02-congestionamento",
    fonte: "m02-lex-08",
    term: "Congestionamento",
    unit: "Rede",
    definition:
      "Condição em que o fluxo desejado excede o limite de um elemento da rede, obrigando redespacho fora da ordem de mérito (constrained-on/off). Entre submercados, separa os PLDs e aparece como spread; dentro de um submercado, o modelo de preço não o enxerga — o sobrecusto vira ESS rateado entre consumidores.",
  },
  {
    id: "gl-m02-constrained-on-constrained-off",
    fonte: "m02-lex-09",
    term: "Constrained-on / constrained-off",
    unit: "Operação",
    definition:
      "Os dois lados do redespacho: <b>constrained-on</b> é a usina cara acionada fora da ordem de mérito por necessidade da rede; <b>constrained-off</b> é a usina barata impedida de gerar pela restrição. A compensação do constrained-off de eólicas e solares no NE é a disputa regulatória mais quente do tema no Brasil.",
  },
  {
    id: "gl-m02-curtailment",
    fonte: "m02-lex-10",
    term: "Curtailment",
    unit: "Operação",
    definition:
      "Corte de geração disponível — tipicamente renovável — determinado pelo operador. No Brasil, classificado por <b>razão elétrica</b> (segurança/limites de rede) ou <b>razão energética</b> (excesso de oferta). Cresceu fortemente no Nordeste após as restrições operativas de 2023 e a expansão renovável acima do ritmo do escoamento.",
  },
  {
    id: "gl-m02-curva-de-carga",
    fonte: "m02-lex-11",
    term: "Curva de carga",
    unit: "Operação",
    definition:
      "Representação da demanda ao longo do tempo — o retrato de como o consumo respira no dia, na semana, no ano. Residencial tem picos de manhã e noite; industrial pode ser 24/7, em turnos ou sazonal. O SIN soma todos os perfis.",
  },
  {
    id: "gl-m02-curva-liquida",
    fonte: "m02-lex-12",
    term: "Curva líquida",
    unit: "Operação",
    definition:
      "Carga total menos a geração variável (solar e eólica) — o que sobra para a geração despachável atender. Afunda no meio do dia com o sol a pino e dispara no pôr do sol, criando a rampa do fim da tarde, a janela mais tensa da operação moderna.",
  },
  {
    id: "gl-m02-cust-cusd",
    fonte: "m02-lex-13",
    term: "CUST / CUSD",
    unit: "Contratos",
    definition:
      "Contratos de Uso do Sistema de <b>Transmissão</b> (com o ONS, para conectados à Rede Básica) e de <b>Distribuição</b> (com a distribuidora local). Definem a fronteira institucional de quem paga TUST e quem paga TUSD. O CUSD é fonte primária em qualquer diagnóstico de cliente industrial.",
  },
  {
    id: "gl-m02-cvu",
    fonte: "m02-lex-14",
    term: "CVU",
    unit: "R$/MWh",
    definition:
      "Custo Variável Unitário de uma usina termelétrica — combustível e custos variáveis por MWh, declarado e auditado. É o que posiciona cada térmica na ordem de mérito do despacho brasileiro — no modelo de custo auditado, a usina não oferta preço: declara custo e é fiscalizada.",
  },
  {
    id: "gl-m02-decomp",
    fonte: "m02-lex-15",
    term: "DECOMP",
    unit: "Modelo",
    definition:
      "Modelo de médio prazo da cadeia de planejamento da operação: detalha a decisão do NEWAVE em horizonte de meses e semanas, conectando a política de uso dos reservatórios à programação que o DESSEM refinará em base horária.",
  },
  {
    id: "gl-m02-despacho-centralizado",
    fonte: "m02-lex-16",
    term: "Despacho centralizado",
    unit: "Operação",
    definition:
      "Regime em que o operador do sistema — não o dono da usina — decide quem gera, quanto e quando, com base em custos auditados e otimização. É o modelo brasileiro, em contraste com mercados de ofertas onde o despacho emerge de lances dos agentes.",
  },
  {
    id: "gl-m02-dessem",
    fonte: "m02-lex-17",
    term: "DESSEM",
    unit: "Modelo",
    definition:
      "Modelo de programação diária da operação, com resolução horária (e rede elétrica representada). Desde 2021 é dele que saem o CMO horário e, por consequência, o PLD horário publicado pela CCEE.",
  },
  {
    id: "gl-m02-disjuntor",
    fonte: "m02-lex-18",
    term: "Disjuntor",
    unit: "Equipamento",
    definition:
      "Equipamento de manobra capaz de interromper correntes de curto-circuito. Comandado pelos relés de proteção, abre o circuito em poucos ciclos (dezenas de milissegundos), isolando a falta. A dupla relé + disjuntor é o sistema imunológico da rede.",
  },
  {
    id: "gl-m02-dit",
    fonte: "m02-lex-19",
    term: "DIT",
    unit: "Rede",
    definition:
      "Demais Instalações de Transmissão — ativos de transmissoras em tensão inferior a 230 kV (tipicamente 69–138 kV), fora da Rede Básica. Zona intermediária que conecta a malha principal às distribuidoras e a grandes consumidores.",
  },
  {
    id: "gl-m02-erac",
    fonte: "m02-lex-20",
    term: "ERAC",
    unit: "Proteção sistêmica",
    definition:
      "Esquema Regional de Alívio de Carga: corte automático e escalonado de blocos de consumo quando a frequência afunda além dos limiares (primeiro estágio tipicamente na casa de 58,5 Hz, conforme a região). Última linha de defesa — sacrifica parte da carga para evitar o colapso do sistema inteiro.",
  },
  {
    id: "gl-m02-ess",
    fonte: "m02-lex-21",
    term: "ESS",
    unit: "Encargo",
    definition:
      "Encargos de Serviços do Sistema — a conta dos custos de operação que não cabem no preço de energia: despacho fora da ordem de mérito por restrição elétrica ou segurança energética, serviços ancilares e afins. Rateado entre consumidores na liquidação da CCEE. É onde o congestionamento interno do submercado se esconde.",
  },
  {
    id: "gl-m02-fio-b",
    fonte: "m02-lex-22",
    term: "Fio B",
    unit: "Tarifa",
    definition:
      "Componente da TUSD que remunera os ativos e a operação da rede da própria distribuidora — em oposição ao Fio A, que repassa custos de transmissão a montante. Em discussões de reforma tarifária e de MMGD, \"quem paga o Fio B\" é a pergunta central.",
  },
  {
    id: "gl-m02-grid-forming-grid-following",
    fonte: "m02-lex-23",
    term: "Grid-forming / grid-following",
    unit: "Tecnologia",
    definition:
      "Duas filosofias de controle de inversores. Grid-following segue uma referência de tensão e frequência que já existe na rede; grid-forming ajuda a criar essa referência — comportamento essencial em sistemas com alta penetração renovável e pouca máquina síncrona.",
  },
  {
    id: "gl-m02-hvdc",
    fonte: "m02-lex-24",
    term: "HVDC",
    unit: "Tecnologia",
    definition:
      "High-Voltage Direct Current — transmissão em corrente contínua de alta tensão. Vence o AC em três situações: distâncias muito longas, interligação de sistemas assíncronos (Itaipu 50 Hz) e travessias submarinas. O Brasil opera alguns dos elos mais longos do mundo.",
  },
  {
    id: "gl-m02-ilhamento",
    fonte: "m02-lex-25",
    term: "Ilhamento",
    unit: "Estabilidade",
    definition:
      "Separação elétrica de uma parte da rede, que passa a operar como ilha e precisa equilibrar sozinha sua geração e carga. Desequilíbrio grande derruba a ilha; ilhamento intencional e controlado, por outro lado, é a base de microrredes e de etapas da recomposição.",
  },
  {
    id: "gl-m02-inercia",
    fonte: "m02-lex-26",
    term: "Inércia",
    unit: "Física do sistema",
    definition:
      "Energia cinética armazenada nas massas girantes sincronizadas (turbinas, rotores), sacada automaticamente quando há desbalanço — freia a variação de frequência e compra tempo para os controles. Geração conectada por inversor não contribui inércia naturalmente, tornando o sistema mais sensível a perdas de geração.",
  },
  {
    id: "gl-m02-inflexibilidade",
    fonte: "m02-lex-27",
    term: "Inflexibilidade",
    unit: "Operação",
    definition:
      "Parcela mínima de geração que uma usina (tipicamente térmica) declara não poder reduzir por razões técnicas ou contratuais. Geração inflexível entra no balanço mesmo fora do mérito — e em cenários de excesso, compete com renovável e contribui para curtailment.",
  },
  {
    id: "gl-m02-intercambio",
    fonte: "m02-lex-28",
    term: "Intercâmbio",
    unit: "Operação",
    definition:
      "Fluxo de energia entre subsistemas/submercados pelos grandes troncos de interligação. Quando o intercâmbio satura, os submercados se separam em preço — o spread de PLD é o sintoma visível. Monitorar intercâmbios é monitorar a costura do SIN.",
  },
  {
    id: "gl-m02-microrrede",
    fonte: "m02-lex-29",
    term: "Microrrede",
    unit: "Rede moderna",
    definition:
      "Sistema local — geração distribuída, bateria, geração de apoio e controle inteligente — capaz de operar conectado à rede principal ou ilhado dela. Aplicações típicas: hospitais, mineração, data centers, comunidades isoladas. Exige engenharia de controle e proteção, não só equipamentos.",
  },
  {
    id: "gl-m02-mmgd",
    fonte: "m02-lex-30",
    term: "MMGD",
    unit: "Geração",
    definition:
      "Micro e Minigeração Distribuída — majoritariamente solar em telhado, conectada na rede de distribuição e compensada via créditos. Dezenas de GW instalados que o operador enxerga como redução de carga, deprimindo a demanda líquida do meio-dia e criando a rampa do pôr do sol.",
  },
  {
    id: "gl-m02-n-1",
    fonte: "m02-lex-31",
    term: "N-1",
    unit: "Critério",
    definition:
      "Critério de segurança: o sistema deve suportar a perda de qualquer elemento único (linha, transformador, gerador) sem corte de carga nem violação de limites. Protege contra falhas simples — não contra modos de falha comuns que levam vários elementos de uma vez, como em Itaberá/2009.",
  },
  {
    id: "gl-m02-newave",
    fonte: "m02-lex-32",
    term: "NEWAVE",
    unit: "Modelo",
    definition:
      "Modelo de longo prazo (horizonte de anos) da cadeia de planejamento: decide a política ótima de uso dos reservatórios sob incerteza hidrológica, gerando a função de custo futuro da água que ancora todo o despacho hidrotérmico brasileiro.",
  },
  {
    id: "gl-m02-ons",
    fonte: "m02-lex-33",
    term: "ONS",
    unit: "Instituição",
    definition:
      "Operador Nacional do Sistema Elétrico (Lei 9.648/1998). Associação civil sem fins lucrativos, fiscalizada pela ANEEL, que opera o SIN: despacho centralizado, intercâmbios, segurança, administração da transmissão (CUST) e planejamento da operação, sob os Procedimentos de Rede. Não vende energia, não tarifa, não regula, não constrói.",
  },
  {
    id: "gl-m02-ordem-de-merito",
    fonte: "m02-lex-34",
    term: "Ordem de mérito",
    unit: "Operação",
    definition:
      "Princípio universal do despacho econômico: empilhar a oferta do menor para o maior custo variável e despachar até cobrir a demanda. A usina marginal — a última necessária para fechar o balanço — define o custo marginal do sistema: no Brasil, o CMO, base do PLD.",
  },
  {
    id: "gl-m02-parcela-variavel",
    fonte: "m02-lex-35",
    term: "Parcela Variável",
    unit: "Transmissão",
    definition:
      "Desconto aplicado à RAP da transmissora quando a instalação fica indisponível ou opera com restrição. É o instrumento que transforma \"receita por disponibilidade\" em incentivo real: linha parada é receita perdida.",
  },
  {
    id: "gl-m02-perdas-nao-tecnicas",
    fonte: "m02-lex-36",
    term: "Perdas não técnicas",
    unit: "Rede",
    definition:
      "Energia injetada e não faturada por furto (\"gatos\"), fraude de medição ou falhas de cadastro/faturamento. Concentradas na baixa tensão, com enorme variância regional. O nível regulatório reconhecido pela ANEEL é repassado à tarifa; o excedente sai da margem da distribuidora.",
  },
  {
    id: "gl-m02-perdas-tecnicas",
    fonte: "m02-lex-37",
    term: "Perdas técnicas",
    unit: "Rede",
    definition:
      "Dissipação física inevitável do transporte: efeito Joule (I²R) em condutores e perdas de núcleo em transformadores. Crescem nos níveis baixos de tensão, onde a corrente é alta. Ordem de ~2% na Rede Básica e várias vezes isso na distribuição.",
  },
  {
    id: "gl-m02-pld",
    fonte: "m02-lex-38",
    term: "PLD",
    unit: "R$/MWh · preview",
    definition:
      "Preço de Liquidação das Diferenças — o preço spot brasileiro, publicado pela CCEE por submercado e por hora: na essência, o CMO da cadeia de modelos submetido a piso e teto homologados anualmente pela ANEEL. Dissecação completa no Bloco 9.",
  },
  {
    id: "gl-m02-pmo-pdo",
    fonte: "m02-lex-39",
    term: "PMO / PDO",
    unit: "Operação",
    definition:
      "Programa Mensal e Programa Diário da Operação — os dois elos da cascata de planejamento do ONS. O PMO fixa diretrizes de geração térmica e intercâmbios com discretização semanal; o PDO transforma a diretriz em programação horária do dia seguinte, que o tempo real executa e corrige.",
  },
  {
    id: "gl-m02-ponto-de-conexao",
    fonte: "m02-lex-40",
    term: "Ponto de conexão",
    unit: "Fronteira",
    definition:
      "Fronteira física e contratual entre a rede da concessionária e a instalação do consumidor. Define tensão de fornecimento (logo, grupo tarifário), local da medição de faturamento, referência dos indicadores de qualidade (PRODIST M8) e a divisa de titularidade de ativos e perdas.",
  },
  {
    id: "gl-m02-procedimentos-de-rede",
    fonte: "m02-lex-41",
    term: "Procedimentos de Rede",
    unit: "Norma",
    definition:
      "Corpo normativo público elaborado pelo ONS e homologado pela ANEEL que disciplina a operação do SIN: conexão, planejamento da operação, operação em tempo real, proteção, recomposição e serviços ancilares. Fonte primária obrigatória para qualquer afirmação operativa em conversa técnica.",
  },
  {
    id: "gl-m02-rampa",
    fonte: "m02-lex-42",
    term: "Rampa",
    unit: "Operação",
    definition:
      "Velocidade de variação da carga líquida que a geração despachável precisa acompanhar, medida em GW por hora. A rampa do fim da tarde — solar caindo enquanto o consumo residencial sobe — é a mais severa do dia e valoriza hidro flexível, baterias e resposta da demanda.",
  },
  {
    id: "gl-m02-rap",
    fonte: "m02-lex-43",
    term: "RAP",
    unit: "Transmissão",
    definition:
      "Receita Anual Permitida — a remuneração da concessionária de transmissão, definida no leilão (vence a menor RAP) e paga por disponibilidade ao longo da concessão (tipicamente 30 anos). Independe do MWh transportado; sofre desconto de Parcela Variável por indisponibilidade.",
  },
  {
    id: "gl-m02-recomposicao",
    fonte: "m02-lex-44",
    term: "Recomposição",
    unit: "Operação",
    definition:
      "Processo coordenado de religar o sistema após uma perturbação ampla: unidades black start energizam trechos, usinas sincronizam, cargas retornam em blocos, ilhas se reconectam. Segue procedimentos pré-estudados — religar tudo de uma vez derrubaria o sistema de novo.",
  },
  {
    id: "gl-m02-rede-basica",
    fonte: "m02-lex-45",
    term: "Rede Básica",
    unit: "Rede",
    definition:
      "Conjunto das instalações de transmissão em tensão igual ou superior a 230 kV. Operada centralizadamente pelo ONS, acessada via CUST e remunerada via TUST. Abaixo dela: DIT e redes de distribuição. A fronteira dos 230 kV é fronteira de regime jurídico, operador e cobrança.",
  },
  {
    id: "gl-m02-regulacao-primaria",
    fonte: "m02-lex-46",
    term: "Regulação primária",
    unit: "Controle",
    definition:
      "Resposta automática e local dos reguladores de velocidade das usinas ao desvio de frequência, em escala de segundos. Estanca a queda (ou subida) em um valor estável — porém fora de 60,00 Hz; quem devolve ao valor nominal é a regulação secundária (CAG).",
  },
  {
    id: "gl-m02-rele-de-protecao",
    fonte: "m02-lex-47",
    term: "Relé de proteção",
    unit: "Equipamento",
    definition:
      "Dispositivo que monitora continuamente grandezas elétricas e, ao detectar uma falta, comanda a abertura de disjuntores em milissegundos. A coordenação entre relés implementa a seletividade. Atuação incorreta de proteção é gatilho recorrente de grandes perturbações — inclusive no 15/08/2023.",
  },
  {
    id: "gl-m02-religador",
    fonte: "m02-lex-48",
    term: "Religador",
    unit: "Proteção",
    definition:
      "Equipamento de distribuição que desliga ao detectar falta e tenta religar automaticamente após instantes. Resolve a maioria das faltas, que são temporárias — galho, animal, descarga atmosférica — sem deslocar equipe, e precisa de coordenação para não religar sobre falta permanente.",
  },
  {
    id: "gl-m02-reserva-girante",
    fonte: "m02-lex-49",
    term: "Reserva girante",
    unit: "Reserva",
    definition:
      "Capacidade já sincronizada ao sistema — usinas girando abaixo do máximo — pronta para elevar geração em segundos. É a primeira reserva a responder depois da inércia e da regulação primária. Exemplo: usina a 80 MW podendo gerar 100 carrega 20 MW de reserva girante.",
  },
  {
    id: "gl-m02-reserva-operativa",
    fonte: "m02-lex-50",
    term: "Reserva operativa",
    unit: "Reserva",
    definition:
      "Margem de capacidade mantida disponível para cobrir variações de carga, erros de previsão e contingências, mobilizável em minutos. Junto da girante (segundos) e da fria (horas), forma o colchão que permite ao sistema absorver sustos — e que custa dinheiro mesmo parado.",
  },
  {
    id: "gl-m02-resiliencia",
    fonte: "m02-lex-51",
    term: "Resiliência",
    unit: "Confiabilidade",
    definition:
      "Capacidade de resistir, adaptar-se e recuperar-se depois que a falha acontece — complementar à confiabilidade, que busca evitá-la. Um sistema resiliente isola rápido, mantém cargas críticas, recompõe em etapas e aprende com o evento.",
  },
  {
    id: "gl-m02-resposta-da-demanda",
    fonte: "m02-lex-52",
    term: "Resposta da demanda",
    unit: "Rede moderna",
    definition:
      "Ajuste voluntário de consumo para ajudar o sistema ou reduzir custo: deslocar produção para fora do pico, reduzir carga na rampa, mudar horários de bombeamento. Transforma a demanda de passiva em recurso operacional — e, em desenhos maduros, em receita.",
  },
  {
    id: "gl-m02-rocof",
    fonte: "m02-lex-53",
    term: "RoCoF",
    unit: "Hz/s",
    definition:
      "Rate of Change of Frequency — a taxa inicial de variação da frequência após um desbalanço, inversamente proporcional à inércia do sistema (RoCoF ∝ ΔP/2H). Métrica central da discussão sobre penetração de inversores: menos inércia, RoCoF maior, menos tempo para os controles agirem.",
  },
  {
    id: "gl-m02-scada",
    fonte: "m02-lex-54",
    term: "SCADA",
    unit: "Sistema",
    definition:
      "Supervisory Control and Data Acquisition — a camada de telemetria e telecomando que leva o estado de cada subestação aos centros de operação em tempo real e permite manobras remotas. É o sistema nervoso que torna possível operar um continente de uma sala.",
  },
  {
    id: "gl-m02-seccionadora",
    fonte: "m02-lex-55",
    term: "Seccionadora",
    unit: "Subestação",
    definition:
      "Chave que isola trechos para manutenção criando separação visível e segura. Não interrompe corrente de falha — essa função é do disjuntor. Confundir os dois equipamentos é o erro clássico que denuncia quem nunca pisou numa subestação.",
  },
  {
    id: "gl-m02-seletividade",
    fonte: "m02-lex-56",
    term: "Seletividade",
    unit: "Proteção",
    definition:
      "Princípio de coordenação da proteção: isolar a menor região possível, no menor tempo possível, deixando o resto do sistema intacto. Quando a seletividade falha, eventos locais escalam — o ingrediente clássico do apagão em cascata.",
  },
  {
    id: "gl-m02-servicos-ancilares",
    fonte: "m02-lex-57",
    term: "Serviços ancilares",
    unit: "Ancilar",
    definition:
      "Funções que não são venda de energia, mas sem as quais a rede não opera com segurança: controle de frequência (regulação primária e secundária), suporte de tensão e reativos, reservas de potência e black start. Coordenados pelo ONS e remunerados conforme regras setoriais.",
  },
  {
    id: "gl-m02-sin",
    fonte: "m02-lex-58",
    term: "SIN",
    unit: "Sistema",
    definition:
      "Sistema Interligado Nacional — a malha eletroenergética que conecta geração e carga em escala continental, atendendo a quase totalidade do consumo do país, dividida em quatro subsistemas (SE/CO, S, NE, N) que coincidem com os submercados de preço.",
  },
  {
    id: "gl-m02-sinal-locacional",
    fonte: "m02-lex-59",
    term: "Sinal locacional",
    unit: "Conceito",
    definition:
      "Incentivo econômico que diferencia agentes pela posição na malha. No desenho brasileiro ele mora no fio — a TUST nodal, anual e estável — e não no preço da energia, que é zonal por submercado. Gerador longe da carga tende a pagar mais pelo uso da transmissão.",
  },
  {
    id: "gl-m02-smf",
    fonte: "m02-lex-60",
    term: "SMF",
    unit: "Medição",
    definition:
      "Sistema de Medição para Faturamento — o conjunto de medidores e requisitos técnicos, no ponto de conexão, que lastreia a contabilização na CCEE para agentes do mercado. Sem SMF adequado, não há migração ao ACL.",
  },
  {
    id: "gl-m02-subestacao",
    fonte: "m02-lex-61",
    term: "Subestação",
    unit: "Rede",
    definition:
      "Instalação onde a rede transforma (tensão), manobra (disjuntores e seccionadoras), protege (relés) e mede/telecomanda (SCADA). As articulações do sistema — entre a usina e a tomada existem, tipicamente, de quatro a sete delas.",
  },
  {
    id: "gl-m02-submercado",
    fonte: "m02-lex-62",
    term: "Submercado",
    unit: "Mercado",
    definition:
      "Zona de apuração do PLD — quatro no Brasil, coincidentes com os subsistemas do SIN. Dentro do submercado, preço único (restrições internas viram ESS); entre submercados, os preços se separam quando os intercâmbios saturam.",
  },
  {
    id: "gl-m02-tusd",
    fonte: "m02-lex-63",
    term: "TUSD",
    unit: "Tarifa",
    definition:
      "Tarifa de Uso do Sistema de Distribuição — o pedágio pago à distribuidora local por todo conectado à sua rede, inclusive consumidores livres. Para o Grupo A, cobrada em demanda (R$/kW) e energia (R$/MWh); carrega Fio B, repasses (Fio A/TUST), encargos e perdas reconhecidas.",
  },
  {
    id: "gl-m02-tust",
    fonte: "m02-lex-64",
    term: "TUST",
    unit: "Tarifa",
    definition:
      "Tarifa de Uso do Sistema de Transmissão — paga por geradores e grandes consumidores conectados à Rede Básica (via CUST). Calculada por metodologia nodal: o valor depende da localização do agente na malha — o sinal locacional brasileiro.",
  },
  {
    id: "gl-m02-valor-da-agua",
    fonte: "m02-lex-65",
    term: "Valor da água",
    unit: "R$/MWh",
    definition:
      "Custo de oportunidade de turbinar água hoje em vez de guardá-la para o futuro — calculado pela cadeia NEWAVE/DECOMP/DESSEM, não declarado por agente. É o que posiciona a hidroeletricidade na ordem de mérito e, na maior parte das horas, o que efetivamente precifica o Brasil.",
  },
];
