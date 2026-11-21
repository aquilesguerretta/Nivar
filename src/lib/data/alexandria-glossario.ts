// alexandria-glossario.ts
// Glossário Alexandria — os § Lex dos módulos extraídos.
//
// ── MÓDULO 01 (Wave 8) — 38 verbetes ──────────────────────────
// Fonte: `Alexandria modulos/alexandria_modulo01.html`, seção § Lex
// (L2520-2681) — `details.glossary-item` com `.term`, `.unit` e
// `.glossary-content` extraídos por parsing determinístico. Termo, etiqueta
// e definição são literais; HTML inline (<b>) e entidades preservados.
//
// DIVERGÊNCIA DA FONTE, registrada e não corrigida: a prosa do § Lex diz
// «Vinte e oito termos», mas o markup tem 38 `glossary-item`. A contagem
// real vence a prosa.
//
// `aulaIds` do Módulo 01 — cruzamento contra o corpo REAL das nove aulas
// (`MODULO_01_CORPO` + lead + título em alexandria-modulo-01-content.ts),
// método das Waves 4-5: varredura por padrão + leitura das frases nos casos
// de julgamento. Regras aplicadas:
//   · Palavra do termo, não símbolo de unidade — 'Volt' não mapeia toda
//     aula que escreve 'V'; senão vira ruído.
//   · Sentido do verbete, não colisão de palavra. Excluídos após leitura:
//     'oferta e demanda' (aula 03 — sentido sistêmico, não o conceito
//     tarifário), 'diretor de energia' (aula 06 — cargo), 'mercado livre
//     potencial' e 'ineficiência' (substring), 'motores mais eficientes'
//     (aula 06 — adjetivo incidental).
//   · Vazio é honesto: CCEE, CUSD e PLD são definidos no § Lex mas o corpo
//     do Módulo 01 não os usa. Ficam no glossário sem link de aula.
//
// ── MÓDULOS 02-08 (Wave 34) ───────────────────────────────────
// Contagens medidas na fonte, prosa e markup CONCORDANDO em todos:
//   M02 65 · M03 63 (vocabulário antigo, `details.glossary-item`)
//   M04 58 · M05 72 · M06 99 · M07 118 · M08 124 (vocabulário novo:
//   § Lex > details agrupados por categoria > p > span.term; o rótulo da
//   categoria — "Formação de preço e despacho" — vira o `unit`, sem a
//   contagem "· N termos"; o ponto final DENTRO do span.term é pontuação
//   de frase e foi removido do termo).
// No M04 o `.term` bruto dá 76 porque a classe também aparece no CORPO —
// a contagem §Lex-escopada dá os 58 que a prosa anuncia.
//
// Ids namespaçados por módulo (`gl-m02-…`): o mesmo termo pode ser
// definido em § Lex de módulos diferentes com definição própria (PLD nos
// M01 e M04, p.ex.) — são verbetes distintos, não duplicata a fundir.
// Os 38 do Módulo 01 mantêm os ids originais (`gl-…`), intocados.
//
// `aulaIds` dos M02-08 — âncora por ESTRUTURA, não por varredura de
// corpo: o termo ancora quando aparece (frase exata, fronteira de
// palavra, sem acento/caixa) no título, subtítulo ou num cabeçalho de
// seção (`kind: 'titulo'`) da aula, lidos do arquivo de conteúdo TS
// real. Cabeçalho é assunto; menção em prosa pode ser incidental — a
// regra é mais conservadora que a leitura de corpo da Wave 8, e o
// resultado de cada âncora foi auditado a olho antes de entrar.
// Termo sem âncora estrutural fica `aulaIds: []`, honestamente.

import type { GlossaryTerm } from '@/lib/types/alexandria';

/** Os verbetes, organizados por MODULO de origem (blocos abaixo) — a
 *  ordem do arquivo e de manutencao, nao de exibicao. */
const VERBETES: GlossaryTerm[] = [
  {
    id: "gl-ampere-a",
    term: "Ampere (A)",
    unit: "Corrente",
    definition:
      "Unidade de medida de corrente elétrica — o fluxo de carga que atravessa um condutor por segundo. Analogia hidráulica: vazão de água. Em instalações industriais, cargas grandes (motores, britadores, fornos) puxam alta corrente especialmente quando operam em tensões mais baixas.",
    aulaIds: ["aula-01-02"],
  },
  {
    id: "gl-banco-de-capacitores",
    term: "Banco de capacitores",
    unit: "Solução · FP",
    definition:
      "Conjunto de capacitores instalado próximo à carga industrial para fornecer localmente a potência reativa exigida por equipamentos indutivos. Eleva o fator de potência medido e reduz cobrança regulatória de excedente reativo. Exige diagnóstico técnico antes da especificação — compensação excessiva cria FP capacitivo, também problemático.",
    aulaIds: ["aula-01-07"],
  },
  {
    id: "gl-ccee",
    term: "CCEE",
    unit: "Instituição",
    definition:
      "Câmara de Comercialização de Energia Elétrica. Pessoa jurídica de direito privado, sob autorização da ANEEL, responsável pela contabilização e liquidação de operações de compra e venda de energia, e pela apuração do PLD (Preço de Liquidação das Diferenças). Atua nos ambientes ACR e ACL.",
    aulaIds: [],
  },
  {
    id: "gl-corrente-alternada-ac",
    term: "Corrente alternada (AC)",
    unit: "Forma de onda",
    definition:
      "Corrente elétrica cujo sentido alterna periodicamente. No Brasil, a frequência da rede pública é de 60 Hz — sessenta ciclos por segundo. Base de toda a rede pública de transmissão e distribuição moderna, porque permite elevação e redução de tensão por transformadores.",
    aulaIds: ["aula-01-02", "aula-01-03", "aula-01-06"],
  },
  {
    id: "gl-corrente-continua-dc",
    term: "Corrente contínua (DC)",
    unit: "Forma de onda",
    definition:
      "Corrente elétrica com fluxo em direção principal constante. Usada em baterias, painéis solares antes do inversor, eletrônica embarcada e transmissão HVDC de longa distância. Retoma relevância com a expansão de solar, BESS e tecnologias correlatas.",
    aulaIds: ["aula-01-02", "aula-01-03"],
  },
  {
    id: "gl-cusd",
    term: "CUSD",
    unit: "Contrato",
    definition:
      "Contrato de Uso do Sistema de Distribuição. Documento entre consumidor do Grupo A e distribuidora que formaliza demanda contratada, tensão de fornecimento, modalidade tarifária e demais condições de uso da rede. Fonte primária ao analisar qualquer cliente industrial.",
    aulaIds: [],
  },
  {
    id: "gl-dec-fec",
    term: "DEC / FEC",
    unit: "Continuidade · coletivos",
    definition:
      "<b>DEC</b> — Duração Equivalente de interrupção por unidade Consumidora. Tempo médio de interrupção por consumidor no período (horas/ano). <b>FEC</b> — Frequência Equivalente de interrupção por unidade Consumidora. Número médio de interrupções por consumidor no período. São indicadores coletivos que avaliam a qualidade do serviço de toda a distribuidora.",
    aulaIds: ["aula-01-09"],
  },
  {
    id: "gl-demanda",
    term: "Demanda",
    unit: "kW",
    definition:
      "Potência ativa exigida ou requerida por uma unidade consumidora em determinado intervalo de medição (tipicamente 15 minutos integralizados). Distinta do consumo (kWh), reflete a capacidade instantânea exigida da rede.",
    aulaIds: ["aula-01-01", "aula-01-05", "aula-01-06"],
  },
  {
    id: "gl-demanda-contratada",
    term: "Demanda contratada",
    unit: "kW",
    definition:
      "Capacidade em kW reservada contratualmente pelo consumidor do Grupo A junto à distribuidora. Cobrada integralmente todo mês, mesmo se não usada. Dimensionamento exige histórico de 12 meses, sazonalidade e planos de expansão.",
    aulaIds: ["aula-01-05"],
  },
  {
    id: "gl-dic-fic-dmic-dicri",
    term: "DIC / FIC / DMIC / DICRI",
    unit: "Continuidade · individuais",
    definition:
      "Indicadores individuais de continuidade — medem interrupções daquela unidade consumidora específica. <b>DIC</b>: duração total de interrupção. <b>FIC</b>: número de interrupções. <b>DMIC</b>: maior interrupção contínua. <b>DICRI</b>: DIC em dia crítico. Têm limites regulatórios cuja violação pode gerar compensação à unidade consumidora.",
    aulaIds: ["aula-01-09"],
  },
  {
    id: "gl-eficiencia",
    term: "Eficiência",
    unit: "Razão",
    definition:
      "Razão entre energia útil entregue e energia de entrada. Nenhum sistema real é 100% eficiente — parte da energia vira calor, vibração, ruído, perdas magnéticas e mecânicas. Em instalações industriais, eficiência de equipamento velho é uma das primeiras frentes legítimas de redução de custo.",
    aulaIds: ["aula-01-09"],
  },
  {
    id: "gl-energia",
    term: "Energia",
    unit: "kWh, MWh",
    definition:
      "Capacidade de realizar trabalho ou produzir transformação. Em eletricidade, energia é potência integrada no tempo (kWh = kW × h). É a grandeza cobrada como \"consumo\" na fatura.",
    aulaIds: ["aula-01-01", "aula-01-03", "aula-01-04", "aula-01-05", "aula-01-07", "aula-01-09"],
  },
  {
    id: "gl-fator-de-capacidade-fc",
    term: "Fator de capacidade (FC)",
    unit: "Geração",
    definition:
      "Razão entre a geração efetiva e a geração máxima teórica de uma usina, no período. Mede quanto da capacidade instalada foi efetivamente convertida em energia. Difere drasticamente por tecnologia: nuclear 85–95%, hidro BR ~50%, solar fotovoltaica BR ~25%, térmica peaker &lt;15%.",
    aulaIds: ["aula-01-08"],
  },
  {
    id: "gl-fator-de-carga-fc",
    term: "Fator de carga (FC)",
    unit: "Razão",
    definition:
      "Razão entre demanda média e demanda máxima de uma unidade consumidora. Mede quão bem a instalação aproveita a capacidade reservada. Operação contínua: 0,70–0,90. Operação concentrada com picos: 0,15–0,40. FC baixo não é necessariamente erro — pode refletir processo produtivo legítimo.",
    aulaIds: ["aula-01-05"],
  },
  {
    id: "gl-fator-de-potencia-fp",
    term: "Fator de potência (FP)",
    unit: "cos φ",
    definition:
      "Razão entre potência ativa (kW) e potência aparente (kVA). Em regime senoidal, equivale ao cosseno do ângulo de defasagem entre tensão e corrente. Referência prática regulatória brasileira para Grupo A: mínimo 0,92, indutivo ou capacitivo. Abaixo desse valor pode haver cobrança por excedente reativo.",
    aulaIds: ["aula-01-02", "aula-01-07"],
  },
  {
    id: "gl-frequencia",
    term: "Frequência",
    unit: "Hz",
    definition:
      "Número de ciclos por segundo de uma corrente alternada. No Brasil, 60 Hz. Funciona como termômetro físico do equilíbrio em tempo real entre geração e consumo — desvios indicam descasamento e disparam ações operacionais do ONS.",
    aulaIds: ["aula-01-03", "aula-01-09"],
  },
  {
    id: "gl-grupo-a",
    term: "Grupo A",
    unit: "Classificação",
    definition:
      "Classe de consumidores atendidos em alta ou média tensão (≥ 2,3 kV) — indústrias, grandes comércios. Subdivide-se em A1, A2, A3, A3a, A4 e AS por nível de tensão. Estrutura tarifária binômia (consumo + demanda). Todo o universo industrial relevante da GridAlpha está aqui.",
    aulaIds: ["aula-01-06", "aula-01-07"],
  },
  {
    id: "gl-grupo-b",
    term: "Grupo B",
    unit: "Classificação",
    definition:
      "Classe de consumidores atendidos em baixa tensão (&lt; 2,3 kV) — residências, pequenos comércios, pequenas propriedades rurais. Estrutura tarifária monômia (essencialmente kWh × tarifa).",
    aulaIds: ["aula-01-06"],
  },
  {
    id: "gl-harmonicos",
    term: "Harmônicos",
    unit: "Qualidade",
    definition:
      "Distorções na forma de onda elétrica em múltiplos da frequência fundamental. Comuns em cargas não lineares — drives de velocidade variável, inversores, fontes eletrônicas, máquinas de solda. Causam aquecimento, disparo de proteções, redução de vida útil. Tratamento técnico envolve filtros passivos ou ativos.",
    aulaIds: ["aula-01-07", "aula-01-09"],
  },
  {
    id: "gl-kva",
    term: "kVA",
    unit: "Potência aparente",
    definition:
      "Quilovolt-ampere. Unidade de potência aparente — combinação vetorial de potência ativa (kW) e reativa (kVAr). É o \"tamanho elétrico total\" que a rede precisa entregar à instalação. Dimensiona transformadores e cabos.",
    aulaIds: ["aula-01-02", "aula-01-07"],
  },
  {
    id: "gl-kvar",
    term: "kVAr",
    unit: "Potência reativa",
    definition:
      "Quilovolt-ampere reativo. Unidade de potência reativa — circula entre rede e equipamentos para sustentar campos magnéticos e elétricos sem realizar trabalho útil no eixo da máquina. Necessária para motores e transformadores, mas excessiva degrada o fator de potência.",
    aulaIds: ["aula-01-02", "aula-01-07"],
  },
  {
    id: "gl-kw",
    term: "kW",
    unit: "Potência ativa",
    definition:
      "Quilowatt. Unidade de potência ativa — a parcela da potência elétrica que realiza trabalho útil (gira eixo, esquenta forno, aciona esteira). 1 kW = 1.000 W. Não confundir com kWh, que é energia.",
    aulaIds: ["aula-01-01", "aula-01-02", "aula-01-05", "aula-01-06", "aula-01-07"],
  },
  {
    id: "gl-kwh",
    term: "kWh",
    unit: "Energia",
    definition:
      "Quilowatt-hora. Unidade de energia equivalente a um quilowatt durante uma hora. É a grandeza que aparece como \"consumo\" em qualquer fatura elétrica. kWh = kW × h.",
    aulaIds: ["aula-01-01", "aula-01-06"],
  },
  {
    id: "gl-lei-de-ohm",
    term: "Lei de Ohm",
    unit: "V = I × R",
    definition:
      "Relação fundamental entre tensão (V), corrente (I) e resistência (R) em um circuito elétrico. Junto com P = I² × R (perdas resistivas) e P = V × I (potência em DC), forma o tripé de qualquer cálculo elétrico de instalação.",
    aulaIds: ["aula-01-02"],
  },
  {
    id: "gl-modalidade-tarifaria",
    term: "Modalidade tarifária",
    unit: "Tarifa",
    definition:
      "Forma de estruturação tarifária aplicável ao consumidor. Para Grupo A: <b>Verde</b> (demanda única, mas tarifa de energia diferenciada por horário), <b>Azul</b> (demanda diferenciada por horário ponta/fora-ponta), e <b>Branca</b> (apenas Grupo B em casos específicos). A escolha tem impacto direto na fatura e exige análise do perfil operacional.",
    aulaIds: ["aula-01-05"],
  },
  {
    id: "gl-ons",
    term: "ONS",
    unit: "Operador",
    definition:
      "Operador Nacional do Sistema Elétrico. Pessoa jurídica de direito privado responsável pela coordenação e controle da operação das instalações de geração e transmissão de energia elétrica no Sistema Interligado Nacional (SIN). É quem mantém o batimento de 60 Hz da rede em tempo real.",
    aulaIds: ["aula-01-03"],
  },
  {
    id: "gl-perdas-tecnicas",
    term: "Perdas técnicas",
    unit: "Físicas",
    definition:
      "Perdas físicas no sistema elétrico — aquecimento de cabos, perdas em transformadores, perdas magnéticas, perdas mecânicas, perdas de conversão. Reconhecidas pela ANEEL nos processos de revisão tarifária e embutidas na componente fio da TUSD.",
    aulaIds: ["aula-01-02", "aula-01-04"],
  },
  {
    id: "gl-perdas-nao-tecnicas",
    term: "Perdas não técnicas",
    unit: "Comerciais",
    definition:
      "Perdas comerciais e operacionais — furto de energia, fraude no medidor, ligações clandestinas, erro de medição, inadimplência, problemas cadastrais. Afetam tarifas via ressarcimento parcial reconhecido em revisão. Concentram-se especialmente em centros urbanos do Norte e Nordeste.",
    aulaIds: ["aula-01-04"],
  },
  {
    id: "gl-pld",
    term: "PLD",
    unit: "Preço · CCEE",
    definition:
      "Preço de Liquidação das Diferenças. Preço de curto prazo da energia, apurado pela CCEE com base no Custo Marginal de Operação (CMO) calculado pelos modelos de despacho. Usado para liquidação financeira de diferenças entre energia contratada e energia medida. Tema-chave dos próximos módulos.",
    aulaIds: [],
  },
  {
    id: "gl-potencia",
    term: "Potência",
    unit: "W, kW, MW",
    definition:
      "Taxa instantânea de uso, geração ou transformação de energia. Unidade SI é o watt (W). Difere de energia: potência mede velocidade; energia mede volume acumulado.",
    aulaIds: ["aula-01-01", "aula-01-02", "aula-01-04", "aula-01-07", "aula-01-08"],
  },
  {
    id: "gl-prodist",
    term: "PRODIST",
    unit: "Procedimentos · ANEEL",
    definition:
      "Procedimentos de Distribuição de Energia Elétrica no Sistema Elétrico Nacional. Conjunto de documentos normativos que regulam tecnicamente o setor de distribuição. O <b>Módulo 8</b> trata especificamente de Qualidade do Fornecimento (continuidade, tensão, fator de potência, harmônicos).",
    aulaIds: ["aula-01-07", "aula-01-09"],
  },
  {
    id: "gl-ren-aneel-1-000-2021",
    term: "REN ANEEL 1.000/2021",
    unit: "Norma",
    definition:
      "Resolução Normativa ANEEL nº 1.000, de 7 de dezembro de 2021. Estabelece as regras de prestação do serviço público de distribuição de energia elétrica. Em vigor desde 3 de janeiro de 2022, substituiu a REN 414/2010. É a base regulatória atual para a relação distribuidora–consumidor.",
    aulaIds: ["aula-01-05", "aula-01-07"],
  },
  {
    id: "gl-tensao",
    term: "Tensão",
    unit: "V, kV",
    definition:
      "Diferença de potencial elétrico entre dois pontos de um circuito. Analogia hidráulica: pressão da água. Unidade SI é o volt (V). Define grupo tarifário no Brasil: Grupo B (baixa tensão, &lt; 2,3 kV) ou Grupo A (média/alta tensão, ≥ 2,3 kV).",
    aulaIds: ["aula-01-01", "aula-01-02", "aula-01-03", "aula-01-04", "aula-01-05", "aula-01-06", "aula-01-07", "aula-01-09"],
  },
  {
    id: "gl-trifasico",
    term: "Trifásico",
    unit: "Sistema",
    definition:
      "Sistema de fornecimento em corrente alternada com três fases defasadas em 120°. Padrão industrial. Permite maior potência, maior eficiência em motores, e melhor equilíbrio de carga. Praticamente todo consumidor relevante do Grupo A é atendido em trifásico.",
    aulaIds: ["aula-01-02", "aula-01-06", "aula-01-09"],
  },
  {
    id: "gl-tusd",
    term: "TUSD",
    unit: "Tarifa",
    definition:
      "Tarifa de Uso do Sistema de Distribuição. Componente tarifária que remunera o uso da infraestrutura de distribuição. Subdivide-se em TUSD-fio (rede física e perdas) e TUSD-demanda (capacidade reservada). Separada da TE (Tarifa de Energia) que remunera a energia em si.",
    aulaIds: ["aula-01-04"],
  },
  {
    id: "gl-ufer",
    term: "UFER",
    unit: "Cobrança · reativo",
    definition:
      "Unidade de Faturamento de Energia Reativa. Cobrança histórica aplicada ao consumidor do Grupo A quando o fator de potência opera abaixo do limite regulatório (referência 0,92). Hoje regulada no contexto da REN ANEEL 1.000/2021 e normativos complementares. Aparece em linha específica da fatura.",
    aulaIds: ["aula-01-07"],
  },
  {
    id: "gl-volt-v",
    term: "Volt (V)",
    unit: "Tensão",
    definition:
      "Unidade de medida de tensão elétrica. 1 V = 1 J/C (joule por coulomb). Em escala industrial, valores típicos no Brasil: 127/220 V (BT), 13,8 kV (A4), 69 kV (A3), 138 kV (A2), 230 kV+ (A1).",
    aulaIds: ["aula-01-02"],
  },
  {
    id: "gl-watt-w",
    term: "Watt (W)",
    unit: "Potência",
    definition:
      "Unidade SI de potência. 1 W = 1 J/s (joule por segundo). Em circuitos DC: W = V × A. Em escala industrial usa-se kW (1.000 W) ou MW (1.000.000 W).",
    aulaIds: ["aula-01-01", "aula-01-02"],
  },

  // ── Modulo 02 (Wave 34) ──────────────────────────────
  {
    id: "gl-m02-alimentador",
    term: "Alimentador",
    unit: "Distribuição",
    definition:
      "Circuito de média tensão que sai de uma subestação de distribuição e abastece uma região — bairros, distritos industriais, zonas rurais. A falha de um alimentador desliga todos os consumidores a jusante; por isso religadores e seletividade são desenhados nesse nível.",
    aulaIds: [],
  },
  {
    id: "gl-m02-barramento",
    term: "Barramento",
    unit: "Subestação",
    definition:
      "Condutor comum que interliga os circuitos dentro de uma subestação. A configuração do barramento (simples, duplo, em anel) define a flexibilidade de manobra e a confiabilidade da instalação inteira — é decisão de projeto, não detalhe.",
    aulaIds: [],
  },
  {
    id: "gl-m02-bipolo",
    term: "Bipolo",
    unit: "HVDC",
    definition:
      "Configuração padrão dos grandes elos de corrente contínua: dois polos (positivo e negativo) operando em conjunto, com capacidade de seguir transmitindo parcialmente se um polo falhar. Os elos de Itaipu (±600 kV), Madeira (±600 kV) e Belo Monte (±800 kV) são bipolos.",
    aulaIds: [],
  },
  {
    id: "gl-m02-black-start",
    term: "Black start",
    unit: "Ancilar",
    definition:
      "Capacidade de uma usina partir sem alimentação externa e energizar trechos da rede do zero após um colapso amplo. Define a velocidade da recomposição: unidades black start acendem ilhas, que sincronizam entre si até o sistema inteiro voltar.",
    aulaIds: [],
  },
  {
    id: "gl-m02-cag",
    term: "CAG",
    unit: "Controle",
    definition:
      "Controle Automático de Geração — a regulação secundária de frequência. Comandado pelos centros de operação do ONS, redistribui geração em escala de minutos para devolver a frequência a 60,00 Hz e os intercâmbios entre áreas aos valores programados, recompondo a reserva consumida pela regulação primária.",
    aulaIds: [],
  },
  {
    id: "gl-m02-ccee",
    term: "CCEE",
    unit: "Instituição",
    definition:
      "Câmara de Comercialização de Energia Elétrica. Contabiliza e liquida as operações de compra e venda do setor e publica o PLD. No vocabulário deste módulo: o ONS decide o despacho físico; a CCEE fecha as contas financeiras que resultam dele — inclusive o rateio do ESS.",
    aulaIds: [],
  },
  {
    id: "gl-m02-cmo",
    term: "CMO",
    unit: "Preço",
    definition:
      "Custo Marginal de Operação — o custo de atender 1 MWh adicional de carga, apurado por submercado pela cadeia de modelos NEWAVE/DECOMP/DESSEM, com CVU auditado para térmicas e valor da água para hidrelétricas. É a base de cálculo do PLD, que o limita por piso e teto regulatórios.",
    aulaIds: [],
  },
  {
    id: "gl-m02-congestionamento",
    term: "Congestionamento",
    unit: "Rede",
    definition:
      "Condição em que o fluxo desejado excede o limite de um elemento da rede, obrigando redespacho fora da ordem de mérito (constrained-on/off). Entre submercados, separa os PLDs e aparece como spread; dentro de um submercado, o modelo de preço não o enxerga — o sobrecusto vira ESS rateado entre consumidores.",
    aulaIds: ["aula-02-10"],
  },
  {
    id: "gl-m02-constrained-on-constrained-off",
    term: "Constrained-on / constrained-off",
    unit: "Operação",
    definition:
      "Os dois lados do redespacho: <b>constrained-on</b> é a usina cara acionada fora da ordem de mérito por necessidade da rede; <b>constrained-off</b> é a usina barata impedida de gerar pela restrição. A compensação do constrained-off de eólicas e solares no NE é a disputa regulatória mais quente do tema no Brasil.",
    aulaIds: [],
  },
  {
    id: "gl-m02-curtailment",
    term: "Curtailment",
    unit: "Operação",
    definition:
      "Corte de geração disponível — tipicamente renovável — determinado pelo operador. No Brasil, classificado por <b>razão elétrica</b> (segurança/limites de rede) ou <b>razão energética</b> (excesso de oferta). Cresceu fortemente no Nordeste após as restrições operativas de 2023 e a expansão renovável acima do ritmo do escoamento.",
    aulaIds: ["aula-02-10"],
  },
  {
    id: "gl-m02-curva-de-carga",
    term: "Curva de carga",
    unit: "Operação",
    definition:
      "Representação da demanda ao longo do tempo — o retrato de como o consumo respira no dia, na semana, no ano. Residencial tem picos de manhã e noite; industrial pode ser 24/7, em turnos ou sazonal. O SIN soma todos os perfis.",
    aulaIds: ["aula-02-04"],
  },
  {
    id: "gl-m02-curva-liquida",
    term: "Curva líquida",
    unit: "Operação",
    definition:
      "Carga total menos a geração variável (solar e eólica) — o que sobra para a geração despachável atender. Afunda no meio do dia com o sol a pino e dispara no pôr do sol, criando a rampa do fim da tarde, a janela mais tensa da operação moderna.",
    aulaIds: ["aula-02-04"],
  },
  {
    id: "gl-m02-cust-cusd",
    term: "CUST / CUSD",
    unit: "Contratos",
    definition:
      "Contratos de Uso do Sistema de <b>Transmissão</b> (com o ONS, para conectados à Rede Básica) e de <b>Distribuição</b> (com a distribuidora local). Definem a fronteira institucional de quem paga TUST e quem paga TUSD. O CUSD é fonte primária em qualquer diagnóstico de cliente industrial.",
    aulaIds: [],
  },
  {
    id: "gl-m02-cvu",
    term: "CVU",
    unit: "R$/MWh",
    definition:
      "Custo Variável Unitário de uma usina termelétrica — combustível e custos variáveis por MWh, declarado e auditado. É o que posiciona cada térmica na ordem de mérito do despacho brasileiro — no modelo de custo auditado, a usina não oferta preço: declara custo e é fiscalizada.",
    aulaIds: [],
  },
  {
    id: "gl-m02-decomp",
    term: "DECOMP",
    unit: "Modelo",
    definition:
      "Modelo de médio prazo da cadeia de planejamento da operação: detalha a decisão do NEWAVE em horizonte de meses e semanas, conectando a política de uso dos reservatórios à programação que o DESSEM refinará em base horária.",
    aulaIds: [],
  },
  {
    id: "gl-m02-despacho-centralizado",
    term: "Despacho centralizado",
    unit: "Operação",
    definition:
      "Regime em que o operador do sistema — não o dono da usina — decide quem gera, quanto e quando, com base em custos auditados e otimização. É o modelo brasileiro, em contraste com mercados de ofertas onde o despacho emerge de lances dos agentes.",
    aulaIds: [],
  },
  {
    id: "gl-m02-dessem",
    term: "DESSEM",
    unit: "Modelo",
    definition:
      "Modelo de programação diária da operação, com resolução horária (e rede elétrica representada). Desde 2021 é dele que saem o CMO horário e, por consequência, o PLD horário publicado pela CCEE.",
    aulaIds: [],
  },
  {
    id: "gl-m02-disjuntor",
    term: "Disjuntor",
    unit: "Equipamento",
    definition:
      "Equipamento de manobra capaz de interromper correntes de curto-circuito. Comandado pelos relés de proteção, abre o circuito em poucos ciclos (dezenas de milissegundos), isolando a falta. A dupla relé + disjuntor é o sistema imunológico da rede.",
    aulaIds: [],
  },
  {
    id: "gl-m02-dit",
    term: "DIT",
    unit: "Rede",
    definition:
      "Demais Instalações de Transmissão — ativos de transmissoras em tensão inferior a 230 kV (tipicamente 69–138 kV), fora da Rede Básica. Zona intermediária que conecta a malha principal às distribuidoras e a grandes consumidores.",
    aulaIds: ["aula-02-01"],
  },
  {
    id: "gl-m02-erac",
    term: "ERAC",
    unit: "Proteção sistêmica",
    definition:
      "Esquema Regional de Alívio de Carga: corte automático e escalonado de blocos de consumo quando a frequência afunda além dos limiares (primeiro estágio tipicamente na casa de 58,5 Hz, conforme a região). Última linha de defesa — sacrifica parte da carga para evitar o colapso do sistema inteiro.",
    aulaIds: [],
  },
  {
    id: "gl-m02-ess",
    term: "ESS",
    unit: "Encargo",
    definition:
      "Encargos de Serviços do Sistema — a conta dos custos de operação que não cabem no preço de energia: despacho fora da ordem de mérito por restrição elétrica ou segurança energética, serviços ancilares e afins. Rateado entre consumidores na liquidação da CCEE. É onde o congestionamento interno do submercado se esconde.",
    aulaIds: [],
  },
  {
    id: "gl-m02-fio-b",
    term: "Fio B",
    unit: "Tarifa",
    definition:
      "Componente da TUSD que remunera os ativos e a operação da rede da própria distribuidora — em oposição ao Fio A, que repassa custos de transmissão a montante. Em discussões de reforma tarifária e de MMGD, \"quem paga o Fio B\" é a pergunta central.",
    aulaIds: ["aula-02-10"],
  },
  {
    id: "gl-m02-grid-forming-grid-following",
    term: "Grid-forming / grid-following",
    unit: "Tecnologia",
    definition:
      "Duas filosofias de controle de inversores. Grid-following segue uma referência de tensão e frequência que já existe na rede; grid-forming ajuda a criar essa referência — comportamento essencial em sistemas com alta penetração renovável e pouca máquina síncrona.",
    aulaIds: [],
  },
  {
    id: "gl-m02-hvdc",
    term: "HVDC",
    unit: "Tecnologia",
    definition:
      "High-Voltage Direct Current — transmissão em corrente contínua de alta tensão. Vence o AC em três situações: distâncias muito longas, interligação de sistemas assíncronos (Itaipu 50 Hz) e travessias submarinas. O Brasil opera alguns dos elos mais longos do mundo.",
    aulaIds: ["aula-02-02"],
  },
  {
    id: "gl-m02-ilhamento",
    term: "Ilhamento",
    unit: "Estabilidade",
    definition:
      "Separação elétrica de uma parte da rede, que passa a operar como ilha e precisa equilibrar sozinha sua geração e carga. Desequilíbrio grande derruba a ilha; ilhamento intencional e controlado, por outro lado, é a base de microrredes e de etapas da recomposição.",
    aulaIds: [],
  },
  {
    id: "gl-m02-inercia",
    term: "Inércia",
    unit: "Física do sistema",
    definition:
      "Energia cinética armazenada nas massas girantes sincronizadas (turbinas, rotores), sacada automaticamente quando há desbalanço — freia a variação de frequência e compra tempo para os controles. Geração conectada por inversor não contribui inércia naturalmente, tornando o sistema mais sensível a perdas de geração.",
    aulaIds: ["aula-02-08"],
  },
  {
    id: "gl-m02-inflexibilidade",
    term: "Inflexibilidade",
    unit: "Operação",
    definition:
      "Parcela mínima de geração que uma usina (tipicamente térmica) declara não poder reduzir por razões técnicas ou contratuais. Geração inflexível entra no balanço mesmo fora do mérito — e em cenários de excesso, compete com renovável e contribui para curtailment.",
    aulaIds: [],
  },
  {
    id: "gl-m02-intercambio",
    term: "Intercâmbio",
    unit: "Operação",
    definition:
      "Fluxo de energia entre subsistemas/submercados pelos grandes troncos de interligação. Quando o intercâmbio satura, os submercados se separam em preço — o spread de PLD é o sintoma visível. Monitorar intercâmbios é monitorar a costura do SIN.",
    aulaIds: [],
  },
  {
    id: "gl-m02-microrrede",
    term: "Microrrede",
    unit: "Rede moderna",
    definition:
      "Sistema local — geração distribuída, bateria, geração de apoio e controle inteligente — capaz de operar conectado à rede principal ou ilhado dela. Aplicações típicas: hospitais, mineração, data centers, comunidades isoladas. Exige engenharia de controle e proteção, não só equipamentos.",
    aulaIds: [],
  },
  {
    id: "gl-m02-mmgd",
    term: "MMGD",
    unit: "Geração",
    definition:
      "Micro e Minigeração Distribuída — majoritariamente solar em telhado, conectada na rede de distribuição e compensada via créditos. Dezenas de GW instalados que o operador enxerga como redução de carga, deprimindo a demanda líquida do meio-dia e criando a rampa do pôr do sol.",
    aulaIds: [],
  },
  {
    id: "gl-m02-n-1",
    term: "N-1",
    unit: "Critério",
    definition:
      "Critério de segurança: o sistema deve suportar a perda de qualquer elemento único (linha, transformador, gerador) sem corte de carga nem violação de limites. Protege contra falhas simples — não contra modos de falha comuns que levam vários elementos de uma vez, como em Itaberá/2009.",
    aulaIds: ["aula-02-08"],
  },
  {
    id: "gl-m02-newave",
    term: "NEWAVE",
    unit: "Modelo",
    definition:
      "Modelo de longo prazo (horizonte de anos) da cadeia de planejamento: decide a política ótima de uso dos reservatórios sob incerteza hidrológica, gerando a função de custo futuro da água que ancora todo o despacho hidrotérmico brasileiro.",
    aulaIds: [],
  },
  {
    id: "gl-m02-ons",
    term: "ONS",
    unit: "Instituição",
    definition:
      "Operador Nacional do Sistema Elétrico (Lei 9.648/1998). Associação civil sem fins lucrativos, fiscalizada pela ANEEL, que opera o SIN: despacho centralizado, intercâmbios, segurança, administração da transmissão (CUST) e planejamento da operação, sob os Procedimentos de Rede. Não vende energia, não tarifa, não regula, não constrói.",
    aulaIds: ["aula-02-06"],
  },
  {
    id: "gl-m02-ordem-de-merito",
    term: "Ordem de mérito",
    unit: "Operação",
    definition:
      "Princípio universal do despacho econômico: empilhar a oferta do menor para o maior custo variável e despachar até cobrir a demanda. A usina marginal — a última necessária para fechar o balanço — define o custo marginal do sistema: no Brasil, o CMO, base do PLD.",
    aulaIds: ["aula-02-05"],
  },
  {
    id: "gl-m02-parcela-variavel",
    term: "Parcela Variável",
    unit: "Transmissão",
    definition:
      "Desconto aplicado à RAP da transmissora quando a instalação fica indisponível ou opera com restrição. É o instrumento que transforma \"receita por disponibilidade\" em incentivo real: linha parada é receita perdida.",
    aulaIds: [],
  },
  {
    id: "gl-m02-perdas-nao-tecnicas",
    term: "Perdas não técnicas",
    unit: "Rede",
    definition:
      "Energia injetada e não faturada por furto (\"gatos\"), fraude de medição ou falhas de cadastro/faturamento. Concentradas na baixa tensão, com enorme variância regional. O nível regulatório reconhecido pela ANEEL é repassado à tarifa; o excedente sai da margem da distribuidora.",
    aulaIds: ["aula-02-09"],
  },
  {
    id: "gl-m02-perdas-tecnicas",
    term: "Perdas técnicas",
    unit: "Rede",
    definition:
      "Dissipação física inevitável do transporte: efeito Joule (I²R) em condutores e perdas de núcleo em transformadores. Crescem nos níveis baixos de tensão, onde a corrente é alta. Ordem de ~2% na Rede Básica e várias vezes isso na distribuição.",
    aulaIds: ["aula-02-09"],
  },
  {
    id: "gl-m02-pld",
    term: "PLD",
    unit: "R$/MWh · preview",
    definition:
      "Preço de Liquidação das Diferenças — o preço spot brasileiro, publicado pela CCEE por submercado e por hora: na essência, o CMO da cadeia de modelos submetido a piso e teto homologados anualmente pela ANEEL. Dissecação completa no Bloco 9.",
    aulaIds: [],
  },
  {
    id: "gl-m02-pmo-pdo",
    term: "PMO / PDO",
    unit: "Operação",
    definition:
      "Programa Mensal e Programa Diário da Operação — os dois elos da cascata de planejamento do ONS. O PMO fixa diretrizes de geração térmica e intercâmbios com discretização semanal; o PDO transforma a diretriz em programação horária do dia seguinte, que o tempo real executa e corrige.",
    aulaIds: ["aula-02-06"],
  },
  {
    id: "gl-m02-ponto-de-conexao",
    term: "Ponto de conexão",
    unit: "Fronteira",
    definition:
      "Fronteira física e contratual entre a rede da concessionária e a instalação do consumidor. Define tensão de fornecimento (logo, grupo tarifário), local da medição de faturamento, referência dos indicadores de qualidade (PRODIST M8) e a divisa de titularidade de ativos e perdas.",
    aulaIds: ["aula-02-03"],
  },
  {
    id: "gl-m02-procedimentos-de-rede",
    term: "Procedimentos de Rede",
    unit: "Norma",
    definition:
      "Corpo normativo público elaborado pelo ONS e homologado pela ANEEL que disciplina a operação do SIN: conexão, planejamento da operação, operação em tempo real, proteção, recomposição e serviços ancilares. Fonte primária obrigatória para qualquer afirmação operativa em conversa técnica.",
    aulaIds: [],
  },
  {
    id: "gl-m02-rampa",
    term: "Rampa",
    unit: "Operação",
    definition:
      "Velocidade de variação da carga líquida que a geração despachável precisa acompanhar, medida em GW por hora. A rampa do fim da tarde — solar caindo enquanto o consumo residencial sobe — é a mais severa do dia e valoriza hidro flexível, baterias e resposta da demanda.",
    aulaIds: [],
  },
  {
    id: "gl-m02-rap",
    term: "RAP",
    unit: "Transmissão",
    definition:
      "Receita Anual Permitida — a remuneração da concessionária de transmissão, definida no leilão (vence a menor RAP) e paga por disponibilidade ao longo da concessão (tipicamente 30 anos). Independe do MWh transportado; sofre desconto de Parcela Variável por indisponibilidade.",
    aulaIds: [],
  },
  {
    id: "gl-m02-recomposicao",
    term: "Recomposição",
    unit: "Operação",
    definition:
      "Processo coordenado de religar o sistema após uma perturbação ampla: unidades black start energizam trechos, usinas sincronizam, cargas retornam em blocos, ilhas se reconectam. Segue procedimentos pré-estudados — religar tudo de uma vez derrubaria o sistema de novo.",
    aulaIds: [],
  },
  {
    id: "gl-m02-rede-basica",
    term: "Rede Básica",
    unit: "Rede",
    definition:
      "Conjunto das instalações de transmissão em tensão igual ou superior a 230 kV. Operada centralizadamente pelo ONS, acessada via CUST e remunerada via TUST. Abaixo dela: DIT e redes de distribuição. A fronteira dos 230 kV é fronteira de regime jurídico, operador e cobrança.",
    aulaIds: ["aula-02-01"],
  },
  {
    id: "gl-m02-regulacao-primaria",
    term: "Regulação primária",
    unit: "Controle",
    definition:
      "Resposta automática e local dos reguladores de velocidade das usinas ao desvio de frequência, em escala de segundos. Estanca a queda (ou subida) em um valor estável — porém fora de 60,00 Hz; quem devolve ao valor nominal é a regulação secundária (CAG).",
    aulaIds: [],
  },
  {
    id: "gl-m02-rele-de-protecao",
    term: "Relé de proteção",
    unit: "Equipamento",
    definition:
      "Dispositivo que monitora continuamente grandezas elétricas e, ao detectar uma falta, comanda a abertura de disjuntores em milissegundos. A coordenação entre relés implementa a seletividade. Atuação incorreta de proteção é gatilho recorrente de grandes perturbações — inclusive no 15/08/2023.",
    aulaIds: [],
  },
  {
    id: "gl-m02-religador",
    term: "Religador",
    unit: "Proteção",
    definition:
      "Equipamento de distribuição que desliga ao detectar falta e tenta religar automaticamente após instantes. Resolve a maioria das faltas, que são temporárias — galho, animal, descarga atmosférica — sem deslocar equipe, e precisa de coordenação para não religar sobre falta permanente.",
    aulaIds: [],
  },
  {
    id: "gl-m02-reserva-girante",
    term: "Reserva girante",
    unit: "Reserva",
    definition:
      "Capacidade já sincronizada ao sistema — usinas girando abaixo do máximo — pronta para elevar geração em segundos. É a primeira reserva a responder depois da inércia e da regulação primária. Exemplo: usina a 80 MW podendo gerar 100 carrega 20 MW de reserva girante.",
    aulaIds: [],
  },
  {
    id: "gl-m02-reserva-operativa",
    term: "Reserva operativa",
    unit: "Reserva",
    definition:
      "Margem de capacidade mantida disponível para cobrir variações de carga, erros de previsão e contingências, mobilizável em minutos. Junto da girante (segundos) e da fria (horas), forma o colchão que permite ao sistema absorver sustos — e que custa dinheiro mesmo parado.",
    aulaIds: [],
  },
  {
    id: "gl-m02-resiliencia",
    term: "Resiliência",
    unit: "Confiabilidade",
    definition:
      "Capacidade de resistir, adaptar-se e recuperar-se depois que a falha acontece — complementar à confiabilidade, que busca evitá-la. Um sistema resiliente isola rápido, mantém cargas críticas, recompõe em etapas e aprende com o evento.",
    aulaIds: [],
  },
  {
    id: "gl-m02-resposta-da-demanda",
    term: "Resposta da demanda",
    unit: "Rede moderna",
    definition:
      "Ajuste voluntário de consumo para ajudar o sistema ou reduzir custo: deslocar produção para fora do pico, reduzir carga na rampa, mudar horários de bombeamento. Transforma a demanda de passiva em recurso operacional — e, em desenhos maduros, em receita.",
    aulaIds: [],
  },
  {
    id: "gl-m02-rocof",
    term: "RoCoF",
    unit: "Hz/s",
    definition:
      "Rate of Change of Frequency — a taxa inicial de variação da frequência após um desbalanço, inversamente proporcional à inércia do sistema (RoCoF ∝ ΔP/2H). Métrica central da discussão sobre penetração de inversores: menos inércia, RoCoF maior, menos tempo para os controles agirem.",
    aulaIds: [],
  },
  {
    id: "gl-m02-scada",
    term: "SCADA",
    unit: "Sistema",
    definition:
      "Supervisory Control and Data Acquisition — a camada de telemetria e telecomando que leva o estado de cada subestação aos centros de operação em tempo real e permite manobras remotas. É o sistema nervoso que torna possível operar um continente de uma sala.",
    aulaIds: ["aula-02-06"],
  },
  {
    id: "gl-m02-seccionadora",
    term: "Seccionadora",
    unit: "Subestação",
    definition:
      "Chave que isola trechos para manutenção criando separação visível e segura. Não interrompe corrente de falha — essa função é do disjuntor. Confundir os dois equipamentos é o erro clássico que denuncia quem nunca pisou numa subestação.",
    aulaIds: [],
  },
  {
    id: "gl-m02-seletividade",
    term: "Seletividade",
    unit: "Proteção",
    definition:
      "Princípio de coordenação da proteção: isolar a menor região possível, no menor tempo possível, deixando o resto do sistema intacto. Quando a seletividade falha, eventos locais escalam — o ingrediente clássico do apagão em cascata.",
    aulaIds: [],
  },
  {
    id: "gl-m02-servicos-ancilares",
    term: "Serviços ancilares",
    unit: "Ancilar",
    definition:
      "Funções que não são venda de energia, mas sem as quais a rede não opera com segurança: controle de frequência (regulação primária e secundária), suporte de tensão e reativos, reservas de potência e black start. Coordenados pelo ONS e remunerados conforme regras setoriais.",
    aulaIds: ["aula-02-07"],
  },
  {
    id: "gl-m02-sin",
    term: "SIN",
    unit: "Sistema",
    definition:
      "Sistema Interligado Nacional — a malha eletroenergética que conecta geração e carga em escala continental, atendendo a quase totalidade do consumo do país, dividida em quatro subsistemas (SE/CO, S, NE, N) que coincidem com os submercados de preço.",
    aulaIds: ["aula-02-01"],
  },
  {
    id: "gl-m02-sinal-locacional",
    term: "Sinal locacional",
    unit: "Conceito",
    definition:
      "Incentivo econômico que diferencia agentes pela posição na malha. No desenho brasileiro ele mora no fio — a TUST nodal, anual e estável — e não no preço da energia, que é zonal por submercado. Gerador longe da carga tende a pagar mais pelo uso da transmissão.",
    aulaIds: ["aula-02-10"],
  },
  {
    id: "gl-m02-smf",
    term: "SMF",
    unit: "Medição",
    definition:
      "Sistema de Medição para Faturamento — o conjunto de medidores e requisitos técnicos, no ponto de conexão, que lastreia a contabilização na CCEE para agentes do mercado. Sem SMF adequado, não há migração ao ACL.",
    aulaIds: [],
  },
  {
    id: "gl-m02-subestacao",
    term: "Subestação",
    unit: "Rede",
    definition:
      "Instalação onde a rede transforma (tensão), manobra (disjuntores e seccionadoras), protege (relés) e mede/telecomanda (SCADA). As articulações do sistema — entre a usina e a tomada existem, tipicamente, de quatro a sete delas.",
    aulaIds: ["aula-02-03"],
  },
  {
    id: "gl-m02-submercado",
    term: "Submercado",
    unit: "Mercado",
    definition:
      "Zona de apuração do PLD — quatro no Brasil, coincidentes com os subsistemas do SIN. Dentro do submercado, preço único (restrições internas viram ESS); entre submercados, os preços se separam quando os intercâmbios saturam.",
    aulaIds: [],
  },
  {
    id: "gl-m02-tusd",
    term: "TUSD",
    unit: "Tarifa",
    definition:
      "Tarifa de Uso do Sistema de Distribuição — o pedágio pago à distribuidora local por todo conectado à sua rede, inclusive consumidores livres. Para o Grupo A, cobrada em demanda (R$/kW) e energia (R$/MWh); carrega Fio B, repasses (Fio A/TUST), encargos e perdas reconhecidas.",
    aulaIds: ["aula-02-10"],
  },
  {
    id: "gl-m02-tust",
    term: "TUST",
    unit: "Tarifa",
    definition:
      "Tarifa de Uso do Sistema de Transmissão — paga por geradores e grandes consumidores conectados à Rede Básica (via CUST). Calculada por metodologia nodal: o valor depende da localização do agente na malha — o sinal locacional brasileiro.",
    aulaIds: ["aula-02-10"],
  },
  {
    id: "gl-m02-valor-da-agua",
    term: "Valor da água",
    unit: "R$/MWh",
    definition:
      "Custo de oportunidade de turbinar água hoje em vez de guardá-la para o futuro — calculado pela cadeia NEWAVE/DECOMP/DESSEM, não declarado por agente. É o que posiciona a hidroeletricidade na ordem de mérito e, na maior parte das horas, o que efetivamente precifica o Brasil.",
    aulaIds: ["aula-02-05"],
  },

  // ── Modulo 03 (Wave 34) ──────────────────────────────
  {
    id: "gl-m03-aerogerador",
    term: "Aerogerador",
    unit: "Eólica",
    definition:
      "O conjunto turbina eólica completo: rotor (pás + cubo), nacele (multiplicadora ou acionamento direto, gerador, controle) e torre. As máquinas modernas onshore passam de 100 m de altura de cubo e diâmetros de rotor acima de 150 m — altura e área existem por causa do cubo da velocidade.",
    aulaIds: [],
  },
  {
    id: "gl-m03-afluencia",
    term: "Afluência",
    unit: "Hidro",
    definition:
      "A vazão de água que chega a um aproveitamento hidrelétrico num período. É a \"receita\" física da usina: o fio d'água a converte imediatamente; o reservatório escolhe entre turbinar e estocar.",
    aulaIds: [],
  },
  {
    id: "gl-m03-arbitragem-de-energia",
    term: "Arbitragem (de energia)",
    unit: "Armazenamento",
    definition:
      "Comprar (carregar) energia na hora barata e vender (descarregar) na hora cara. É a aplicação clássica da bateria de 2–4 horas: barriga solar do meio-dia → rampa do fim da tarde. O valor capturado é o spread entre as horas, menos as perdas do ciclo.",
    aulaIds: [],
  },
  {
    id: "gl-m03-autoproducao",
    term: "Autoprodução",
    unit: "Regulatório",
    definition:
      "Regime em que o consumidor gera (ou participa de geração) para consumo próprio, com tratamento regulatório e de encargos específico. Os desenhos e limiares de enquadramento — inclusive por participação societária em usina remota — mudaram nos últimos anos: item permanente de verificação vigente antes de qualquer estudo.",
    aulaIds: [],
  },
  {
    id: "gl-m03-bagaco-de-cana",
    term: "Bagaço de cana",
    unit: "Biomassa",
    definition:
      "Resíduo fibroso da moagem da cana, queimado em caldeiras de cogeração no setor sucroenergético. Combustível \"grátis\" do ponto de vista da usina (subproduto), disponível no calendário da safra — abril a novembro no Centro-Sul.",
    aulaIds: [],
  },
  {
    id: "gl-m03-balbina",
    term: "Balbina",
    unit: "História",
    definition:
      "UHE no Amazonas (anos 1980) que virou o anti-exemplo do setor: área alagada enorme para potência pequena. Trauma formativo citado em todo debate de licenciamento — parte da explicação de por que o país migrou para o fio d'água.",
    aulaIds: [],
  },
  {
    id: "gl-m03-bess",
    term: "BESS",
    unit: "Armazenamento",
    definition:
      "Battery Energy Storage System — sistema de armazenamento por baterias, tipicamente lítio (química LFP dominante), com inversores e controle. Definido por dois números independentes: potência (MW) e energia (MWh).",
    aulaIds: [],
  },
  {
    id: "gl-m03-canibalizacao",
    term: "Canibalização",
    unit: "Economia",
    definition:
      "Erosão do preço capturado por uma fonte variável à medida que sua própria penetração cresce: cada novo MW solar gera nas mesmas horas dos anteriores, derrubando o preço justamente quando a fonte produz. Custo médio em queda com receita unitária em queda mais rápida — o limite nº 3 do LCOE.",
    aulaIds: [],
  },
  {
    id: "gl-m03-capex",
    term: "CAPEX",
    unit: "Economia",
    definition:
      "Capital expenditure — o investimento de construção do ativo. Nas fontes da Família 1 (hidro, eólica, solar, nuclear) domina o custo total; anualizado pelo CRF, é o numerador principal do LCOE.",
    aulaIds: [],
  },
  {
    id: "gl-m03-ccc",
    term: "CCC",
    unit: "Encargo",
    definition:
      "Conta de Consumo de Combustíveis — encargo setorial que socializa nacionalmente o sobrecusto da geração (majoritariamente a diesel/óleo) dos sistemas isolados. O mecanismo do \"paradoxo amazônico\": todo consumidor do SIN ajuda a pagar a energia mais cara do país.",
    aulaIds: [],
  },
  {
    id: "gl-m03-cgh",
    term: "CGH",
    unit: "Hidro",
    definition:
      "Central Geradora Hidrelétrica — aproveitamento hidrelétrico de pequeno porte (até 5 MW), com registro simplificado na ANEEL. Junto das PCHs, compõe a hidreletricidade de pequena escala do país.",
    aulaIds: [],
  },
  {
    id: "gl-m03-ciclo-combinado",
    term: "Ciclo combinado",
    unit: "Térmica",
    definition:
      "Configuração em que o calor de exaustão da turbina a gás gera vapor para uma segunda turbina. Eficiência de 55–60% — o melhor rendimento térmico do portfólio — em troca de partida mais lenta e CAPEX maior. Vocação: rodar muitas horas.",
    aulaIds: ["aula-03-06"],
  },
  {
    id: "gl-m03-ciclo-simples",
    term: "Ciclo simples",
    unit: "Térmica",
    definition:
      "Turbina a gás em ciclo aberto: queima, gira, exausta. Eficiência de 35–40%, partida em minutos, CAPEX baixo. Vocação: ponta, emergência, flexibilidade — a máquina que cobra caro por hora e barato por existir.",
    aulaIds: ["aula-03-06"],
  },
  {
    id: "gl-m03-cogeracao",
    term: "Cogeração",
    unit: "Térmica",
    definition:
      "Produção combinada de eletricidade e calor útil de processo a partir do mesmo combustível. É o desenho padrão da biomassa sucroenergética: a caldeira fornece vapor à usina de açúcar/etanol e o excedente vira eletricidade exportada.",
    aulaIds: [],
  },
  {
    id: "gl-m03-crf",
    term: "CRF",
    unit: "Finanças",
    definition:
      "Capital Recovery Factor — fator que converte um investimento em parcelas anuais equivalentes dada uma taxa (WACC) e uma vida útil: CRF = r(1+r)ⁿ / ((1+r)ⁿ − 1). Com r = 10% e n = 25 anos, ≈ 0,11 — cada real de CAPEX \"custa\" 11 centavos por ano.",
    aulaIds: [],
  },
  {
    id: "gl-m03-curtailment",
    term: "Curtailment",
    unit: "Operação",
    definition:
      "Corte de geração renovável disponível por restrição de escoamento ou excesso sistêmico — energia de custo zero desperdiçada por falta de fio ou de demanda. Cresceu no NE com o boom eólico-solar; quem arca com o custo segue em disputa regulatória.",
    aulaIds: [],
  },
  {
    id: "gl-m03-curva-de-potencia",
    term: "Curva de potência",
    unit: "Eólica",
    definition:
      "O gráfico potência × velocidade do vento de cada modelo de turbina: zero até o cut-in (~3 m/s), subida cúbica até a nominal (~12 m/s), platô de potência cheia até o cut-out (~25 m/s), desligamento acima. O documento que casa máquina com sítio.",
    aulaIds: [],
  },
  {
    id: "gl-m03-cut-in-cut-out",
    term: "Cut-in / cut-out",
    unit: "Eólica",
    definition:
      "Velocidades de vento de partida (~3 m/s) e de desligamento por segurança (~25 m/s) de um aerogerador. Entre elas, a máquina extrai energia seguindo a curva de potência.",
    aulaIds: [],
  },
  {
    id: "gl-m03-cvu",
    term: "CVU",
    unit: "Despacho",
    definition:
      "Custo Variável Unitário — o custo declarado e homologado de gerar 1 MWh adicional numa térmica, dominado pelo combustível (preço × heat rate) mais O&M variável. Ordena a pilha de despacho e, na margem, forma o preço de curto prazo.",
    aulaIds: [],
  },
  {
    id: "gl-m03-densidade-energetica",
    term: "Densidade energética",
    unit: "Física",
    definition:
      "Energia contida por unidade de massa ou volume do combustível. O extremo é o urânio: uma pastilha equivale a toneladas de carvão — a razão física do CVU baixíssimo e do CAPEX altíssimo da nuclear.",
    aulaIds: [],
  },
  {
    id: "gl-m03-despachabilidade",
    term: "Despachabilidade",
    unit: "Atributo",
    definition:
      "Capacidade de gerar sob comando do operador, não sob condição do recurso. Combina controlabilidade, velocidade de resposta e duração sustentável (limitada pelo estoque: água, combustível, carga da bateria). O atributo que separa as famílias do portfólio.",
    aulaIds: [],
  },
  {
    id: "gl-m03-ear",
    term: "EAR",
    unit: "Hidro",
    definition:
      "Energia Armazenada — quanto de energia equivalente existe estocado nos reservatórios, publicado diariamente pelo ONS por subsistema, em % da capacidade máxima. O indicador antecedente do humor do preço e da bandeira.",
    aulaIds: [],
  },
  {
    id: "gl-m03-eficiencia-de-ciclo-round-trip",
    term: "Eficiência de ciclo (round-trip)",
    unit: "Armazenamento",
    definition:
      "Razão entre a energia descarregada e a energia consumida para carregar uma bateria — 85–90% típico em lítio. O \"pedágio\" da viagem no tempo: perde-se energia para ganhar deslocamento temporal.",
    aulaIds: [],
  },
  {
    id: "gl-m03-ena",
    term: "ENA",
    unit: "Hidro",
    definition:
      "Energia Natural Afluente — a afluência convertida em energia equivalente, geralmente expressa em % da média de longo termo (MLT). É a \"chuva em MWh\": o dial que o INST·03 manipula e que o mercado acompanha semanalmente.",
    aulaIds: [],
  },
  {
    id: "gl-m03-energia-firme-firmeza",
    term: "Energia firme / firmeza",
    unit: "Atributo",
    definition:
      "Capacidade de sustentar entrega nas condições críticas — a estiagem, a noite sem vento, o pico. O atributo escasso do sistema moderno: abundância de energia média com escassez de firmeza é o resumo da matriz pós-fio d'água.",
    aulaIds: ["aula-03-03"],
  },
  {
    id: "gl-m03-fator-de-capacidade",
    term: "Fator de capacidade",
    unit: "Métrica",
    definition:
      "Energia gerada ÷ (potência instalada × horas do período). A lente que converte MW de manchete em MWh de realidade: ~50–55% hidro, 40–55% eólica NE, 25–30% solar com tracker, 85–90% nuclear, e — para térmicas — o diário do despacho, não atributo da máquina.",
    aulaIds: [],
  },
  {
    id: "gl-m03-fio-b",
    term: "Fio B",
    unit: "Tarifa",
    definition:
      "Parcela da TUSD que remunera os ativos da própria distribuidora. Virou protagonista na MMGD: a Lei 14.300 instituiu sua cobrança gradual dos novos sistemas compensados — o \"pedágio\" pela rede que o prosumidor usa como bateria virtual.",
    aulaIds: [],
  },
  {
    id: "gl-m03-fio-d-agua",
    term: "Fio d'água",
    unit: "Hidro",
    definition:
      "Hidrelétrica sem reservatório de regularização relevante: gera conforme a vazão chega. Trade-off deliberado — menos área alagada, menos firmeza. O padrão das grandes usinas brasileiras pós-2000 (Belo Monte, Jirau, Santo Antônio).",
    aulaIds: ["aula-03-03"],
  },
  {
    id: "gl-m03-fissao-nuclear",
    term: "Fissão nuclear",
    unit: "Nuclear",
    definition:
      "Quebra controlada de núcleos pesados (urânio-235) liberando calor, que gera vapor e move turbina. Tecnicamente, a nuclear é uma térmica cujo combustível tem densidade energética extrema — daí CVU baixo e CAPEX dominante.",
    aulaIds: [],
  },
  {
    id: "gl-m03-garantia-fisica",
    term: "Garantia física",
    unit: "Regulatório",
    definition:
      "O lastro de energia que cada usina pode comercializar, calculado pelo MME/EPE a partir da contribuição da usina ao suprimento em condições críticas. Distinta do FC verificado: é métrica regulatória de contratação, não de operação. Protagonista no Bloco de mercados.",
    aulaIds: [],
  },
  {
    id: "gl-m03-gnl",
    term: "GNL",
    unit: "Térmica",
    definition:
      "Gás Natural Liquefeito — gás resfriado para transporte marítimo, regaseificado em terminais. Dá flexibilidade de suprimento ao preço do mercado global: foi o GNL spot que empurrou CVUs acima de R$ 1.000/MWh na crise de 2021.",
    aulaIds: [],
  },
  {
    id: "gl-m03-gsf",
    term: "GSF",
    unit: "Hidro · preview",
    definition:
      "Generation Scaling Factor — razão entre a geração hidráulica efetiva e a garantia física do conjunto de usinas do mecanismo de rateio hidrológico. GSF abaixo de 1 = risco hidrológico virando exposição financeira dos geradores. Tratamento completo no Bloco de mercados.",
    aulaIds: [],
  },
  {
    id: "gl-m03-heat-rate",
    term: "Heat rate",
    unit: "Térmica",
    definition:
      "Quanta energia de combustível a máquina consome por MWh elétrico gerado — o inverso da eficiência. Multiplicado pelo preço do combustível, dá o coração do CVU: a térmica como conversor de preço de combustível em preço de energia.",
    aulaIds: [],
  },
  {
    id: "gl-m03-inercia-sincrona",
    term: "Inércia síncrona",
    unit: "Estabilidade",
    definition:
      "Energia cinética das massas girantes acopladas à rede (hidro, térmicas, nuclear), que amortece variações de frequência nos primeiros segundos de um desbalanço. Eólica e solar conectam por inversores e não a fornecem nativamente — o desafio de estabilidade do Módulo 02 que o portfólio precisa repor.",
    aulaIds: [],
  },
  {
    id: "gl-m03-inflexibilidade",
    term: "Inflexibilidade",
    unit: "Despacho",
    definition:
      "Geração mínima obrigatória de uma usina, por restrição técnica ou contratual (take-or-pay de combustível). Térmica inflexível roda mesmo sem mérito econômico, deslocando fonte mais barata — sobrecusto que vira encargo (ESS).",
    aulaIds: ["aula-03-06"],
  },
  {
    id: "gl-m03-itaipu",
    term: "Itaipu",
    unit: "Âncora",
    definition:
      "UHE binacional Brasil–Paraguai no rio Paraná: 14 GW, vinte unidades, historicamente na casa de 8–10% do consumo elétrico brasileiro (número vivo, varia com hidrologia). O símbolo da era dos grandes reservatórios — embora seja, a rigor, usina com regularização limitada que depende da cascata a montante.",
    aulaIds: ["aula-03-02"],
  },
  {
    id: "gl-m03-lei-14-300-2022",
    term: "Lei 14.300/2022",
    unit: "Regulatório",
    definition:
      "O marco legal da micro e minigeração distribuída: consolidou o SCEE, garantiu transição para sistemas existentes e instituiu a cobrança gradual do Fio B dos novos. O divisor de águas do boom de telhado brasileiro.",
    aulaIds: [],
  },
  {
    id: "gl-m03-lei-15-097-2025",
    term: "Lei 15.097/2025",
    unit: "Regulatório",
    definition:
      "O marco legal da geração eólica offshore no Brasil: regime de outorga de áreas marítimas. Sancionada com vetos a dispositivos alheios ao tema (\"jabutis\") cujo destino no Congresso é item vivo de acompanhamento.",
    aulaIds: [],
  },
  {
    id: "gl-m03-lcoe",
    term: "LCOE",
    unit: "Economia",
    definition:
      "Levelized Cost of Energy — custo total da vida útil descontado ÷ energia total descontada, em R$/MWh. Régua útil entre projetos da mesma natureza; perigosa entre famílias diferentes. Quatro limites: ignora atributos, FC térmico circular, cega ao valor temporal, ignora integração.",
    aulaIds: ["aula-03-10"],
  },
  {
    id: "gl-m03-lrcap",
    term: "LRCAP",
    unit: "Leilão",
    definition:
      "Leilão de Reserva de Capacidade — certame que contrata potência (MW) disponível, não energia. A edição 2026 – Armazenamento (Portaria MME 136/2026) é a estreia das baterias: certames em 2 e 4/dez/2026, contratos de 15 anos, suprimento a partir de ago/2028 (vivo — verificar).",
    aulaIds: [],
  },
  {
    id: "gl-m03-mlt",
    term: "MLT",
    unit: "Hidro",
    definition:
      "Média de Longo Termo — a média histórica de afluências usada como referência. \"ENA a 75% da MLT\" = chove(u) três quartos do normal; é a linguagem padrão dos boletins hidrológicos.",
    aulaIds: [],
  },
  {
    id: "gl-m03-mmgd",
    term: "MMGD",
    unit: "Solar",
    definition:
      "Micro (até 75 kW) e Minigeração Distribuída (acima disso, até os limites legais por modalidade): geração junto à carga, compensada via SCEE. A \"usina invisível\" — dezenas de GW que aparecem ao operador como redução de carga, competindo contra a tarifa cheia de varejo.",
    aulaIds: ["aula-03-05"],
  },
  {
    id: "gl-m03-micrositing",
    term: "Micrositing",
    unit: "Eólica",
    definition:
      "Posicionamento fino de cada aerogerador dentro do parque. Como a potência cresce com o cubo da velocidade, diferenças locais pequenas de vento viram diferenças grandes de energia — engenharia de detalhe que vale fortunas.",
    aulaIds: [],
  },
  {
    id: "gl-m03-must-run",
    term: "Must-run",
    unit: "Despacho",
    definition:
      "Geração que entra na base da pilha independentemente de preço: renováveis variáveis (custo variável ~zero), inflexibilidades técnicas e contratuais. O bloco que o despacho \"recebe pronto\" antes de otimizar o resto.",
    aulaIds: [],
  },
  {
    id: "gl-m03-nacele",
    term: "Nacele",
    unit: "Eólica",
    definition:
      "A \"casa de máquinas\" no topo da torre eólica: eixo, multiplicadora (quando há), gerador e sistemas de controle e giro (yaw). Pesa dezenas de toneladas a mais de 100 m de altura — parte do porquê de logística ser gargalo da fonte.",
    aulaIds: [],
  },
  {
    id: "gl-m03-o-m",
    term: "O&M",
    unit: "Economia",
    definition:
      "Operação e Manutenção — custos recorrentes do ativo, divididos em fixos (R$/kW·ano, existem mesmo parado) e variáveis (R$/MWh, proporcionais à geração). Segundo termo do numerador do LCOE.",
    aulaIds: [],
  },
  {
    id: "gl-m03-ordem-de-merito",
    term: "Ordem de mérito",
    unit: "Despacho",
    definition:
      "A fila de despacho por custo variável crescente: must-run e CVU ~zero na base, valor da água posicionando a hidro, térmicas por CVU no topo. A fonte marginal — a última a entrar — define o custo marginal do sistema. Fundamento do Módulo 02, esqueleto do INST·06.",
    aulaIds: [],
  },
  {
    id: "gl-m03-pch",
    term: "PCH",
    unit: "Hidro",
    definition:
      "Pequena Central Hidrelétrica — aproveitamento de até 30 MW com características definidas em regulação, historicamente beneficiado como fonte incentivada. Junto das CGHs, soma alguns GW distribuídos pelo interior.",
    aulaIds: [],
  },
  {
    id: "gl-m03-piso-do-pld",
    term: "Piso do PLD",
    unit: "Preço",
    definition:
      "Valor mínimo regulatório do preço de curto prazo, recalculado anualmente pela ANEEL (na casa de R$ 60/MWh — vivo). É onde o preço \"encosta\" nas horas de sobra estrutural — o sintoma do meio-dia solar.",
    aulaIds: [],
  },
  {
    id: "gl-m03-repotenciacao",
    term: "Repotenciação",
    unit: "Ativo",
    definition:
      "Substituir máquinas antigas por tecnologia atual no mesmo sítio — turbinas eólicas maiores no mesmo parque, rotores e geradores novos em hidrelétricas. Compra energia adicional sem novo sítio: o \"retrofit\" do setor de geração.",
    aulaIds: [],
  },
  {
    id: "gl-m03-reversivel-uhr",
    term: "Reversível (UHR)",
    unit: "Armazenamento",
    definition:
      "Usina Hidrelétrica Reversível: bombeia água morro acima nas horas baratas e turbina nas caras — armazenamento por gravidade, padrão mundial para deslocamento longo. Sem projeto de grande porte operando no Brasil; em estudo no planejamento (vivo).",
    aulaIds: [],
  },
  {
    id: "gl-m03-scee",
    term: "SCEE",
    unit: "Solar",
    definition:
      "Sistema de Compensação de Energia Elétrica — o \"saldo\" da MMGD: energia injetada vira crédito que abate consumo, nas regras e prazos da Lei 14.300. A leitura correta de créditos na fatura é item de auditoria do CLE.",
    aulaIds: [],
  },
  {
    id: "gl-m03-sistemas-isolados",
    term: "Sistemas isolados",
    unit: "Operação",
    definition:
      "Localidades fora do SIN — concentradas na Amazônia — supridas localmente, em geral a diesel/óleo, com sobrecusto socializado pela CCC. A fronteira mais óbvia para solar + bateria substituir combustível caro.",
    aulaIds: [],
  },
  {
    id: "gl-m03-smr",
    term: "SMR",
    unit: "Nuclear",
    definition:
      "Small Modular Reactor — reatores nucleares pequenos e modulares, fabricados em série, prometendo atacar exatamente o problema de prazo e capital da nuclear tradicional. Em demonstração no mundo; horizonte distante no Brasil.",
    aulaIds: [],
  },
  {
    id: "gl-m03-take-or-pay",
    term: "Take-or-pay",
    unit: "Contrato",
    definition:
      "Cláusula de suprimento de combustível em que se paga um volume mínimo, consumido ou não. Transforma custo variável em afundado e gera térmica contratualmente inflexível — a \"atleta de pernas amarradas\" que distorce a ordem de mérito.",
    aulaIds: [],
  },
  {
    id: "gl-m03-tracker",
    term: "Tracker",
    unit: "Solar",
    definition:
      "Rastreador de eixo que gira os módulos seguindo o sol. Eleva o FC da UFV para 25–30% e alarga o \"ombro\" da geração diária — CAPEX adicional que quase sempre se paga em sítios de boa irradiação.",
    aulaIds: [],
  },
  {
    id: "gl-m03-transicao-justa",
    term: "Transição justa",
    unit: "Política",
    definition:
      "O conjunto de políticas para regiões e trabalhadores dependentes de cadeias fósseis em desativação — no Brasil, o carvão de SC/RS. Lembrete de que tecnologia de geração também é geografia social e política regional.",
    aulaIds: [],
  },
  {
    id: "gl-m03-tucurui",
    term: "Tucuruí",
    unit: "Âncora",
    definition:
      "UHE no rio Tocantins (PA), ~8,5 GW — a maior usina 100% brasileira. Parte da geração de gigantes com reservatório construída sob lógica de Estado entre os anos 1960 e 1990.",
    aulaIds: ["aula-03-02"],
  },
  {
    id: "gl-m03-ufv",
    term: "UFV",
    unit: "Solar",
    definition:
      "Usina Fotovoltaica centralizada — dezenas a centenas de MW vendendo no atacado (leilão ou mercado livre), concentrada onde irradiação é alta e terra é barata. Mesma física da MMGD, régua econômica oposta.",
    aulaIds: ["aula-03-05"],
  },
  {
    id: "gl-m03-uhe",
    term: "UHE",
    unit: "Hidro",
    definition:
      "Usina Hidrelétrica de grande porte (acima dos limites de PCH). O bloco dominante da matriz: ~103 GW somando as centralizadas (SIGA — vivo), entre reservatórios históricos e fio d'água recentes.",
    aulaIds: [],
  },
  {
    id: "gl-m03-valor-da-agua",
    term: "Valor da água",
    unit: "Despacho",
    definition:
      "Custo de oportunidade de turbinar hoje versus guardar para a estiagem, calculado pelos modelos oficiais — o \"CVU implícito\" que posiciona a hidro com reservatório na ordem de mérito. Visto pelo lado do ativo: é o estoque que dá à usina o direito de escolher quando gerar.",
    aulaIds: ["aula-03-02"],
  },
  {
    id: "gl-m03-vertimento",
    term: "Vertimento",
    unit: "Hidro",
    definition:
      "Água liberada pelo vertedouro sem passar pelas turbinas — energia potencial descartada, por reservatório cheio ou restrição operativa. O análogo hidráulico do curtailment.",
    aulaIds: [],
  },
  {
    id: "gl-m03-wacc",
    term: "WACC",
    unit: "Finanças",
    definition:
      "Weighted Average Cost of Capital — o custo médio ponderado do capital que desconta os fluxos do projeto. Em ativos de CAPEX dominante, é a variável mais pesada do LCOE: cada ponto de WACC vale mais que qualquer otimização de engenharia — a matemática que condenou Angra 3.",
    aulaIds: [],
  },

  // ── Modulo 04 (Wave 34) ──────────────────────────────
  {
    id: "gl-m04-custo-fixo",
    term: "Custo fixo",
    unit: "Formação de preço e despacho",
    definition:
      "Custo que existe independentemente de a usina gerar: investimento, serviço da dívida, depreciação, seguros, conexão e equipe mínima. Define quanto o ativo precisa faturar no ano para não destruir valor, mas não influencia a decisão de despachar hoje.",
    aulaIds: [],
  },
  {
    id: "gl-m04-custo-variavel",
    term: "Custo variável",
    unit: "Formação de preço e despacho",
    definition:
      "Custo que cresce com a geração, dominado por combustível em usinas térmicas e praticamente ausente em solar e eólica. É o que entra na ordem de mérito e, portanto, o que determina se a usina roda.",
    aulaIds: [],
  },
  {
    id: "gl-m04-custo-marginal",
    term: "Custo marginal",
    unit: "Formação de preço e despacho",
    definition:
      "Custo de produzir um megawatt-hora adicional a partir da condição atual do sistema. Único dos três custos que forma preço de curto prazo.",
    aulaIds: ["aula-04-01"],
  },
  {
    id: "gl-m04-custo-medio",
    term: "Custo médio",
    unit: "Formação de preço e despacho",
    definition:
      "Custo total dividido pela energia gerada no período. Útil para avaliar desempenho histórico de um ativo e enganoso para decidir despacho, porque embute custo fixo já afundado.",
    aulaIds: [],
  },
  {
    id: "gl-m04-cvu",
    term: "CVU",
    unit: "Formação de preço e despacho",
    definition:
      "Custo Variável Unitário declarado de uma usina térmica, em R$/MWh, segundo regra regulatória. É a informação que posiciona a usina na fila de despacho centralizado.",
    aulaIds: [],
  },
  {
    id: "gl-m04-ordem-de-merito",
    term: "Ordem de mérito",
    unit: "Formação de preço e despacho",
    definition:
      "Ordenação dos recursos de geração por custo variável crescente, do mais barato ao mais caro, até que a demanda seja atendida. É a espinha dorsal do despacho econômico e da formação de preço.",
    aulaIds: ["aula-04-01"],
  },
  {
    id: "gl-m04-usina-marginal",
    term: "Usina marginal",
    unit: "Formação de preço e despacho",
    definition:
      "Última usina necessária para atender a demanda em determinado instante. Seu custo define o custo marginal do sistema e, por consequência, o preço de curto prazo.",
    aulaIds: [],
  },
  {
    id: "gl-m04-margem-inframarginal",
    term: "Margem inframarginal",
    unit: "Formação de preço e despacho",
    definition:
      "Diferença entre o preço formado e o custo próprio de uma usina que gerou abaixo da margem. É a receita com a qual usinas de baixo custo variável recuperam seu custo fixo num mercado que remunera apenas energia.",
    aulaIds: [],
  },
  {
    id: "gl-m04-cmo",
    term: "CMO",
    unit: "Formação de preço e despacho",
    definition:
      "Custo Marginal de Operação — custo de atender uma unidade adicional de carga, obtido pela otimização do sistema considerando disponibilidade, restrições e valor futuro da água. É o insumo direto do PLD.",
    aulaIds: [],
  },
  {
    id: "gl-m04-valor-da-agua",
    term: "Valor da água",
    unit: "Formação de preço e despacho",
    definition:
      "Custo de oportunidade de usar hoje a água armazenada em vez de preservá-la para o futuro. Não é desembolso, é decisão intertemporal — e é o que posiciona a hidráulica na ordem de mérito num sistema hidrotérmico.",
    aulaIds: [],
  },
  {
    id: "gl-m04-despacho-centralizado",
    term: "Despacho centralizado",
    unit: "Formação de preço e despacho",
    definition:
      "Modelo em que o operador determina a geração de cada usina por otimização de custo do sistema, e não por cruzamento de lances de preço dos agentes. É o modelo brasileiro e a razão de o preço ser calculado, não negociado.",
    aulaIds: [],
  },
  {
    id: "gl-m04-efeito-ordem-de-merito",
    term: "Efeito ordem de mérito",
    unit: "Formação de preço e despacho",
    definition:
      "Redução do preço de curto prazo causada pela entrada de geração de custo marginal baixo, que desloca a curva de oferta e empurra a usina marginal para uma posição mais barata. O preço cai porque a margem mudou, não porque a fonte nova é barata.",
    aulaIds: [],
  },
  {
    id: "gl-m04-heat-rate",
    term: "Heat rate",
    unit: "Formação de preço e despacho",
    definition:
      "Quantidade de combustível necessária por unidade de energia gerada. Mede a eficiência de uma térmica e explica boa parte da diferença de custo variável entre duas usinas que queimam o mesmo combustível.",
    aulaIds: [],
  },
  {
    id: "gl-m04-curva-de-oferta",
    term: "Curva de oferta",
    unit: "Formação de preço e despacho",
    definition:
      "Representação da capacidade disponível ordenada por custo marginal crescente. Cruzá-la com a demanda produz o preço; deslocá-la para a direita reduz o preço sem que nenhum custo tenha mudado.",
    aulaIds: [],
  },
  {
    id: "gl-m04-demanda-flexivel",
    term: "Demanda flexível",
    unit: "Formação de preço e despacho",
    definition:
      "Carga capaz de reduzir ou deslocar consumo em resposta a sinal econômico ou a despacho. Compete com geração na formação do preço, mas seu custo marginal é o custo de oportunidade da produção não realizada — em geral alto.",
    aulaIds: [],
  },
  {
    id: "gl-m04-pld",
    term: "PLD",
    unit: "Curto prazo, liquidação e hidrologia",
    definition:
      "Preço de Liquidação das Diferenças. Preço que valora o descasamento entre energia contratada e energia efetivamente medida, apurado por hora e por submercado. Não é o preço da energia contratada nem o preço da conta de luz.",
    aulaIds: ["aula-04-02", "aula-04-06"],
  },
  {
    id: "gl-m04-pldmin",
    term: "PLDmin",
    unit: "Curto prazo, liquidação e hidrologia",
    definition:
      "Piso regulatório do PLD, fixado anualmente pela ANEEL e correspondente ao maior valor entre a TEO e a TEO Itaipu. Impede que o preço vá a zero mesmo em situação de sobreoferta severa.",
    aulaIds: [],
  },
  {
    id: "gl-m04-pldmax-horario",
    term: "PLDmax horário",
    unit: "Curto prazo, liquidação e hidrologia",
    definition:
      "Teto aplicável a cada hora individualmente, referenciado no custo variável das térmicas mais caras representadas na programação da operação.",
    aulaIds: [],
  },
  {
    id: "gl-m04-pldmax-estrutural",
    term: "PLDmax estrutural",
    unit: "Curto prazo, liquidação e hidrologia",
    definition:
      "Teto aplicável à média do período. Os valores horários do dia são ajustados para que a média o respeite, preservando o formato da curva de preços ao longo das 24 horas.",
    aulaIds: [],
  },
  {
    id: "gl-m04-submercado",
    term: "Submercado",
    unit: "Curto prazo, liquidação e hidrologia",
    definition:
      "Região de referência para preço e contabilização. São quatro: Sudeste/Centro-Oeste, Sul, Nordeste e Norte. Preços diferentes entre eles indicam restrição de intercâmbio.",
    aulaIds: [],
  },
  {
    id: "gl-m04-acoplamento",
    term: "Acoplamento",
    unit: "Curto prazo, liquidação e hidrologia",
    definition:
      "Situação em que os limites de intercâmbio não estão saturados e os preços dos submercados convergem. O descolamento é o sinal de que a rede, e não a economia, passou a determinar o preço local.",
    aulaIds: [],
  },
  {
    id: "gl-m04-liquidacao",
    term: "Liquidação",
    unit: "Curto prazo, liquidação e hidrologia",
    definition:
      "Processo de apuração e pagamento das diferenças entre contratado e medido no mercado de curto prazo, conduzido pela CCEE segundo as regras de comercialização vigentes.",
    aulaIds: [],
  },
  {
    id: "gl-m04-exposicao",
    term: "Exposição",
    unit: "Curto prazo, liquidação e hidrologia",
    definition:
      "Volume, em MWh, não coberto por contrato e portanto valorado ao preço de curto prazo. É a variável que transforma volatilidade de preço em variação de caixa — e a única sobre a qual o consumidor tem controle direto.",
    aulaIds: ["aula-04-06"],
  },
  {
    id: "gl-m04-ena",
    term: "ENA",
    unit: "Curto prazo, liquidação e hidrologia",
    definition:
      "Energia Natural Afluente. Energia equivalente à vazão que chega aos aproveitamentos hidrelétricos, comparada à média de longo termo. É o fluxo que entra no sistema.",
    aulaIds: [],
  },
  {
    id: "gl-m04-ear",
    term: "EAR",
    unit: "Curto prazo, liquidação e hidrologia",
    definition:
      "Energia Armazenada. Energia equivalente ao volume útil disponível nos reservatórios. É o estoque — e é a variável que o modelo protege quando o fluxo decepciona.",
    aulaIds: [],
  },
  {
    id: "gl-m04-periodo-umido-e-seco",
    term: "Período úmido e seco",
    unit: "Curto prazo, liquidação e hidrologia",
    definition:
      "Ciclo hidrológico anual do sistema brasileiro: aproximadamente dezembro a abril recompõe reservatórios, maio a novembro consome estoque. Um período úmido frustrado eleva o preço antes do período seco começar, porque o modelo antecipa.",
    aulaIds: [],
  },
  {
    id: "gl-m04-preco-spot",
    term: "Preço spot",
    unit: "Curto prazo, liquidação e hidrologia",
    definition:
      "Preço de curto prazo de uma commodity. No mercado elétrico brasileiro, essa função é cumprida pelo PLD, com a diferença de que ele é calculado por modelo e não formado por negociação.",
    aulaIds: [],
  },
  {
    id: "gl-m04-curva-forward",
    term: "Curva forward",
    unit: "Curto prazo, liquidação e hidrologia",
    definition:
      "Conjunto de preços negociados hoje para entrega futura. Reflete a expectativa do mercado somada ao prêmio de risco cobrado por quem carrega a incerteza — por isso pode divergir bastante do spot corrente.",
    aulaIds: [],
  },
  {
    id: "gl-m04-premio-de-risco",
    term: "Prêmio de risco",
    unit: "Curto prazo, liquidação e hidrologia",
    definition:
      "Diferença entre o preço de um contrato futuro e o valor esperado do preço spot no mesmo período. É o que o vendedor cobra para assumir a incerteza no lugar do comprador, e é a razão econômica de o contrato existir.",
    aulaIds: [],
  },
  {
    id: "gl-m04-ppa",
    term: "PPA",
    unit: "Contratos, cláusulas e ambientes",
    definition:
      "Power Purchase Agreement — contrato de compra e venda de energia de médio ou longo prazo que define preço, volume, prazo e condições comerciais, alocando riscos explicitamente entre vendedor e comprador.",
    aulaIds: ["aula-04-05"],
  },
  {
    id: "gl-m04-ppa-fisico",
    term: "PPA físico",
    unit: "Contratos, cláusulas e ambientes",
    definition:
      "Contrato associado à entrega e ao registro do montante de energia entre as partes. Substitui suprimento e é o formato padrão de contratação industrial no mercado livre brasileiro.",
    aulaIds: [],
  },
  {
    id: "gl-m04-ppa-financeiro",
    term: "PPA financeiro",
    unit: "Contratos, cláusulas e ambientes",
    definition:
      "Contrato que liquida apenas a diferença entre o preço contratado e um preço de referência. Funciona como proteção de preço e não coloca energia física na planta — o comprador continua precisando de suprimento.",
    aulaIds: [],
  },
  {
    id: "gl-m04-contrato-por-diferenca",
    term: "Contrato por diferença",
    unit: "Contratos, cláusulas e ambientes",
    definition:
      "Estrutura em que as partes liquidam contra um preço de exercício: se o mercado fica abaixo, uma paga; se fica acima, a outra compensa. É a forma financeira mais pura de travar preço.",
    aulaIds: [],
  },
  {
    id: "gl-m04-ppa-virtual",
    term: "PPA virtual",
    unit: "Contratos, cláusulas e ambientes",
    definition:
      "Contrato financeiro vinculado a um projeto renovável específico, em que o comprador não recebe fisicamente aquela energia mas liquida diferenças e normalmente recebe os atributos ambientais associados.",
    aulaIds: [],
  },
  {
    id: "gl-m04-modulacao",
    term: "Modulação",
    unit: "Contratos, cláusulas e ambientes",
    definition:
      "Distribuição horária do volume contratado. É a cláusula que determina se o contrato acompanha o perfil real de consumo ou entrega energia nas horas erradas.",
    aulaIds: [],
  },
  {
    id: "gl-m04-sazonalizacao",
    term: "Sazonalização",
    unit: "Contratos, cláusulas e ambientes",
    definition:
      "Distribuição mensal do volume contratado. Crítica para consumidores com ciclo definido — safra, irrigação, refrigeração, mineração sazonal — cujo consumo anual está certo mas mal distribuído.",
    aulaIds: [],
  },
  {
    id: "gl-m04-contrato-flat",
    term: "Contrato flat",
    unit: "Contratos, cláusulas e ambientes",
    definition:
      "Contrato com volume uniforme em todos os períodos. Simples de precificar e frequentemente inadequado, porque quase nenhuma planta industrial consome de forma uniforme.",
    aulaIds: [],
  },
  {
    id: "gl-m04-flexibilidade",
    term: "Flexibilidade",
    unit: "Contratos, cláusulas e ambientes",
    definition:
      "Banda percentual dentro da qual o consumo pode variar sem penalidade contratual. Banda larga custa mais caro no preço e vale mais quando a produção é volátil; banda estreita transfere o risco de volume ao comprador.",
    aulaIds: [],
  },
  {
    id: "gl-m04-take-or-pay",
    term: "Take-or-pay",
    unit: "Contratos, cláusulas e ambientes",
    definition:
      "Obrigação de pagar um volume mínimo mesmo sem consumi-lo. Protege a receita do vendedor e converte queda de produção em custo morto para o comprador.",
    aulaIds: [],
  },
  {
    id: "gl-m04-sobrecontratacao",
    term: "Sobrecontratação",
    unit: "Contratos, cláusulas e ambientes",
    definition:
      "Situação em que o volume contratado excede o consumo medido, gerando sobra liquidada ao preço de curto prazo — tipicamente baixo, porque as causas da queda de consumo e da queda de preço costumam ser as mesmas.",
    aulaIds: [],
  },
  {
    id: "gl-m04-indexacao",
    term: "Indexação",
    unit: "Contratos, cláusulas e ambientes",
    definition:
      "Mecanismo contratual de reajuste do preço ao longo do tempo, por índice de inflação, câmbio ou fórmula híbrida. Determina o custo total do contrato mais do que o preço de partida.",
    aulaIds: [],
  },
  {
    id: "gl-m04-change-in-law",
    term: "Change in law",
    unit: "Contratos, cláusulas e ambientes",
    definition:
      "Cláusula que define como mudanças regulatórias, tributárias ou setoriais afetam preço e obrigações. Em setor tão regulado quanto o elétrico brasileiro, é cláusula estrutural e não formalidade jurídica.",
    aulaIds: [],
  },
  {
    id: "gl-m04-lastro",
    term: "Lastro",
    unit: "Contratos, cláusulas e ambientes",
    definition:
      "Respaldo físico ou comercial exigido para que um agente possa vender energia. Vender sem lastro suficiente é infração de regra de mercado, não apenas risco comercial.",
    aulaIds: [],
  },
  {
    id: "gl-m04-acr",
    term: "ACR",
    unit: "Contratos, cláusulas e ambientes",
    definition:
      "Ambiente de Contratação Regulada, no qual distribuidoras contratam energia por leilão para atender consumidores cativos, que pagam tarifa regulada e não escolhem fornecedor.",
    aulaIds: [],
  },
  {
    id: "gl-m04-acl",
    term: "ACL",
    unit: "Contratos, cláusulas e ambientes",
    definition:
      "Ambiente de Contratação Livre, no qual consumidores elegíveis negociam diretamente preço, prazo, fonte, indexação e condições comerciais, assumindo em troca a gestão do próprio portfólio e da própria exposição.",
    aulaIds: [],
  },
  {
    id: "gl-m04-capacidade",
    term: "Capacidade",
    unit: "Capacidade, leilões, risco e métrica",
    definition:
      "Disponibilidade de potência, medida em MW. Responde à pergunta \"quem estará disponível quando o sistema precisar\" — e não à pergunta de quanto foi produzido.",
    aulaIds: ["aula-04-03"],
  },
  {
    id: "gl-m04-energia",
    term: "Energia",
    unit: "Capacidade, leilões, risco e métrica",
    definition:
      "Produção ou consumo ao longo do tempo, medido em MWh. Responde à pergunta \"quanto foi produzido\" e é o produto que praticamente todo mercado remunera bem.",
    aulaIds: ["aula-04-03"],
  },
  {
    id: "gl-m04-missing-money",
    term: "Missing money",
    unit: "Capacidade, leilões, risco e métrica",
    definition:
      "Insuficiência estrutural da receita de energia para remunerar a capacidade necessária à confiabilidade do sistema, causada por tetos de preço, raridade dos eventos de escassez e inaceitabilidade política de preços extremos.",
    aulaIds: ["aula-04-03"],
  },
  {
    id: "gl-m04-energy-only",
    term: "Energy-only",
    unit: "Capacidade, leilões, risco e métrica",
    definition:
      "Desenho de mercado que remunera principalmente energia, dependendo de margens inframarginais e de preços de escassez para financiar capacidade. Funciona em teoria e exige tetos altos ou nulos para funcionar na prática.",
    aulaIds: [],
  },
  {
    id: "gl-m04-preco-de-escassez",
    term: "Preço de escassez",
    unit: "Capacidade, leilões, risco e métrica",
    definition:
      "Elevação deliberada do preço em momentos de oferta insuficiente, com a função de remunerar disponibilidade e sinalizar necessidade de investimento. Economicamente eficiente e politicamente difícil de sustentar.",
    aulaIds: ["aula-04-03"],
  },
  {
    id: "gl-m04-valor-da-energia-nao-suprida",
    term: "Valor da energia não suprida",
    unit: "Capacidade, leilões, risco e métrica",
    definition:
      "Estimativa do custo econômico de não atender uma carga. Varia por ordens de grandeza entre uma residência e um processo industrial contínuo, e é a referência conceitual para calibrar preço de escassez.",
    aulaIds: [],
  },
  {
    id: "gl-m04-reserva-de-capacidade",
    term: "Reserva de capacidade",
    unit: "Capacidade, leilões, risco e métrica",
    definition:
      "Produto de disponibilidade contratado para segurança de suprimento, desacoplado da entrega de energia. O vencedor se compromete a estar disponível, e é remunerado por isso independentemente de gerar.",
    aulaIds: [],
  },
  {
    id: "gl-m04-lrcap",
    term: "LRCAP",
    unit: "Capacidade, leilões, risco e métrica",
    definition:
      "Leilão de Reserva de Capacidade na forma de Potência. Instrumento brasileiro de contratação de disponibilidade, realizado de forma pontual em vez de por mercado permanente de capacidade.",
    aulaIds: [],
  },
  {
    id: "gl-m04-leilao-reverso",
    term: "Leilão reverso",
    unit: "Capacidade, leilões, risco e métrica",
    definition:
      "Disputa em que os vendedores competem reduzindo preço até que a quantidade demandada seja atendida. Substitui a negociação bilateral por competição pública quando o comprador é regulado.",
    aulaIds: ["aula-04-04"],
  },
  {
    id: "gl-m04-preco-de-corte",
    term: "Preço de corte",
    unit: "Capacidade, leilões, risco e métrica",
    definition:
      "Preço do último lance aceito num leilão reverso. Coincide com o preço médio apenas quando o edital liquida por preço uniforme; quando liquida por lance individual, a média fica abaixo.",
    aulaIds: [],
  },
  {
    id: "gl-m04-revenue-stacking",
    term: "Revenue stacking",
    unit: "Capacidade, leilões, risco e métrica",
    definition:
      "Combinação de múltiplas fontes de receita sobre o mesmo ativo — energia, capacidade, serviços ancilares, redução de demanda, atributos. É o que viabiliza projetos que nenhuma dessas receitas pagaria sozinha.",
    aulaIds: [],
  },
  {
    id: "gl-m04-risco-de-base",
    term: "Risco de base",
    unit: "Capacidade, leilões, risco e métrica",
    definition:
      "Diferença entre o preço da referência contratual ou do instrumento de proteção e o preço da exposição efetiva. Aparece tipicamente como descasamento de submercado, e é o risco que sobra depois que todos os outros foram tratados.",
    aulaIds: [],
  },
  {
    id: "gl-m04-canibalizacao",
    term: "Canibalização",
    unit: "Capacidade, leilões, risco e métrica",
    definition:
      "Redução do preço capturado por uma fonte causada pela concentração da geração dessa mesma fonte nas mesmas horas. Explica por que o valor marginal de um projeto cai conforme a penetração da tecnologia cresce na região.",
    aulaIds: [],
  },

  // ── Modulo 05 (Wave 34) ──────────────────────────────
  {
    id: "gl-m05-monopolio-natural",
    term: "Monopólio natural",
    unit: "Fundamento econômico da regulação",
    definition:
      "Atividade em que o custo de atender todo o mercado com uma única infraestrutura é menor que o de dividi-lo entre infraestruturas concorrentes. Descreve estrutura de custos, não propriedade nem mérito.",
    aulaIds: ["aula-05-01"],
  },
  {
    id: "gl-m05-subaditividade-de-custos",
    term: "Subaditividade de custos",
    unit: "Fundamento econômico da regulação",
    definition:
      "Propriedade formal do monopólio natural: o custo de produção conjunta é inferior à soma dos custos de produção fragmentada, na faixa relevante de demanda.",
    aulaIds: [],
  },
  {
    id: "gl-m05-economias-de-escala",
    term: "Economias de escala",
    unit: "Fundamento econômico da regulação",
    definition:
      "Redução do custo médio à medida que o volume atendido cresce, típica de infraestrutura com custo fixo alto e custo incremental baixo.",
    aulaIds: [],
  },
  {
    id: "gl-m05-economias-de-densidade",
    term: "Economias de densidade",
    unit: "Fundamento econômico da regulação",
    definition:
      "Redução do custo por consumidor à medida que mais usuários são atendidos dentro da mesma área geográfica já coberta pela rede. É por isso que atender área rural custa muito mais por cliente que atender área urbana.",
    aulaIds: [],
  },
  {
    id: "gl-m05-custo-afundado",
    term: "Custo afundado",
    unit: "Fundamento econômico da regulação",
    definition:
      "Investimento que, uma vez feito, não pode ser recuperado por venda ou realocação. É o que gera exposição a comportamento oportunista depois que a rede está construída, e a razão de a regulação precisar de compromisso crível.",
    aulaIds: [],
  },
  {
    id: "gl-m05-infraestrutura-essencial",
    term: "Infraestrutura essencial",
    unit: "Fundamento econômico da regulação",
    definition:
      "Ativo indispensável para atuar num mercado a jusante e economicamente irreplicável. Quem a controla e compete a jusante tem incentivo estrutural a discriminar rivais.",
    aulaIds: [],
  },
  {
    id: "gl-m05-externalidade",
    term: "Externalidade",
    unit: "Fundamento econômico da regulação",
    definition:
      "Custo ou benefício de uma decisão que recai sobre terceiros e não é integralmente refletido no preço privado. No setor elétrico, cobre emissões, confiabilidade sistêmica, uso do território, universalização, aprendizado tecnológico e segurança de suprimento.",
    aulaIds: [],
  },
  {
    id: "gl-m05-bem-essencial",
    term: "Bem essencial",
    unit: "Fundamento econômico da regulação",
    definition:
      "Insumo cuja interrupção afeta terceiros que não participaram da transação — saúde, saneamento, telecomunicação, pagamento, produção contínua. Justifica obrigações de continuidade e universalização que um contrato privado não produziria.",
    aulaIds: [],
  },
  {
    id: "gl-m05-demanda-inelastica",
    term: "Demanda inelástica",
    unit: "Fundamento econômico da regulação",
    definition:
      "Demanda que responde pouco a variação de preço no horizonte relevante. Em escassez, um sistema que racionasse apenas por preço racionaria por capacidade de pagamento, não por valor do uso.",
    aulaIds: [],
  },
  {
    id: "gl-m05-falha-de-mercado",
    term: "Falha de mercado",
    unit: "Fundamento econômico da regulação",
    definition:
      "Situação em que a interação descentralizada não produz alocação eficiente — monopólio, externalidade, assimetria de informação, bem público. É a justificativa econômica da intervenção.",
    aulaIds: [],
  },
  {
    id: "gl-m05-falha-de-governo",
    term: "Falha de governo",
    unit: "Fundamento econômico da regulação",
    definition:
      "Situação em que a intervenção pública produz resultado pior que o problema que pretendia corrigir — por informação imperfeita, incentivo mal desenhado, captura ou rigidez. A comparação honesta é entre as duas falhas, não entre uma delas e um ideal.",
    aulaIds: [],
  },
  {
    id: "gl-m05-competicao-pelo-mercado",
    term: "Competição pelo mercado",
    unit: "Fundamento econômico da regulação",
    definition:
      "Disputa, num único momento e sob regras predefinidas, pelo direito de operar um monopólio por prazo determinado. É o que um leilão de concessão de transmissão captura, em oposição à competição diária no mercado.",
    aulaIds: [],
  },
  {
    id: "gl-m05-unbundling",
    term: "Unbundling",
    unit: "Unbundling e cadeia de valor",
    definition:
      "Separação das atividades verticalmente integradas da cadeia elétrica, em graus crescentes, para neutralizar o incentivo do dono da rede a discriminar concorrentes nos segmentos competitivos.",
    aulaIds: ["aula-05-02"],
  },
  {
    id: "gl-m05-separacao-contabil",
    term: "Separação contábil",
    unit: "Unbundling e cadeia de valor",
    definition:
      "Grau mais raso: livros e centros de custo separados por atividade. Ataca o subsídio cruzado explícito e deixa intactos o comando unificado e o incentivo econômico.",
    aulaIds: [],
  },
  {
    id: "gl-m05-separacao-funcional",
    term: "Separação funcional",
    unit: "Unbundling e cadeia de valor",
    definition:
      "Gestão, equipes, sistemas e fluxos de informação distintos entre a atividade de rede e as competitivas. Ataca o vazamento de informação comercial e o favorecimento operacional cotidiano.",
    aulaIds: [],
  },
  {
    id: "gl-m05-separacao-juridica",
    term: "Separação jurídica",
    unit: "Unbundling e cadeia de valor",
    definition:
      "Personalidades jurídicas distintas para cada atividade, com patrimônio e responsabilidades próprios. Controle societário comum pode permanecer, e com ele o interesse econômico consolidado.",
    aulaIds: [],
  },
  {
    id: "gl-m05-separacao-societaria",
    term: "Separação societária",
    unit: "Unbundling e cadeia de valor",
    definition:
      "Grau mais profundo: controle acionário efetivamente separado. Elimina o incentivo econômico de discriminar e é o mais custoso em perda de coordenação e de economias de escopo.",
    aulaIds: [],
  },
  {
    id: "gl-m05-integracao-vertical",
    term: "Integração vertical",
    unit: "Unbundling e cadeia de valor",
    definition:
      "Exercício de mais de um estágio da cadeia pela mesma empresa ou grupo. Traz economias de coordenação reais e, quando envolve a rede, cria incentivo a fechar mercado a jusante.",
    aulaIds: ["aula-05-02"],
  },
  {
    id: "gl-m05-subsidio-cruzado",
    term: "Subsídio cruzado",
    unit: "Unbundling e cadeia de valor",
    definition:
      "Alocação de custo de uma atividade competitiva dentro da contabilidade da atividade regulada, fazendo o consumidor cativo financiar a disputa por clientes livres. É o alvo direto da separação contábil.",
    aulaIds: [],
  },
  {
    id: "gl-m05-discriminacao-vertical",
    term: "Discriminação vertical",
    unit: "Unbundling e cadeia de valor",
    definition:
      "Conduta do operador de rede que prejudica rivais a jusante por prazo, fila, exigência técnica, acesso a dado ou alocação de custo — sem necessariamente alterar a tarifa publicada.",
    aulaIds: [],
  },
  {
    id: "gl-m05-acesso-nao-discriminatorio",
    term: "Acesso não discriminatório",
    unit: "Unbundling e cadeia de valor",
    definition:
      "Obrigação de permitir uso da rede por terceiros sob regras e tarifas públicas, com tratamento igual entre solicitantes independentemente de vínculo societário.",
    aulaIds: [],
  },
  {
    id: "gl-m05-livre-acesso",
    term: "Livre acesso",
    unit: "Unbundling e cadeia de valor",
    definition:
      "Direito de usar as redes de transmissão e distribuição mediante encargos e condições reguladas. É a condição necessária — e insuficiente — para que exista competição em geração e comercialização.",
    aulaIds: [],
  },
  {
    id: "gl-m05-concessao",
    term: "Concessão",
    unit: "Unbundling e cadeia de valor",
    definition:
      "Delegação contratual da prestação de serviço público ou do uso de bem público, por prazo determinado e sob regras de equilíbrio econômico-financeiro, qualidade e reversão de ativos.",
    aulaIds: [],
  },
  {
    id: "gl-m05-area-de-concessao",
    term: "Área de concessão",
    unit: "Unbundling e cadeia de valor",
    definition:
      "Território em que a distribuidora tem exclusividade e, simetricamente, obrigação de atender todos os pedidos de conexão sob as condições reguladas.",
    aulaIds: [],
  },
  {
    id: "gl-m05-pool",
    term: "Pool",
    unit: "Desenho do atacado",
    definition:
      "Arranjo em que ofertas ou custos declarados são centralizados e resolvidos num único problema de otimização sujeito a restrições de rede e segurança, do qual derivam despacho e preço de curtíssimo prazo.",
    aulaIds: ["aula-05-03"],
  },
  {
    id: "gl-m05-bilateral",
    term: "Bilateral",
    unit: "Desenho do atacado",
    definition:
      "Contrato direto entre comprador e vendedor, com preço, prazo, volume, perfil e garantias negociados pelas partes. É obrigação econômica, sem correspondência com trajetória física de energia.",
    aulaIds: ["aula-05-03"],
  },
  {
    id: "gl-m05-despacho-por-custo",
    term: "Despacho por custo",
    unit: "Desenho do atacado",
    definition:
      "Coordenação baseada em custos declarados sob regra e auditados, com uso de modelos de otimização. Adequado quando há recurso armazenável cujo valor depende do futuro do sistema.",
    aulaIds: [],
  },
  {
    id: "gl-m05-despacho-por-oferta",
    term: "Despacho por oferta",
    unit: "Desenho do atacado",
    definition:
      "Coordenação baseada em preços e quantidades ofertados voluntariamente pelos agentes, sujeitos às restrições de rede e segurança.",
    aulaIds: [],
  },
  {
    id: "gl-m05-despacho-centralizado-de-seguranca",
    term: "Despacho centralizado de segurança",
    unit: "Desenho do atacado",
    definition:
      "Determinação, em tempo real, da geração de cada recurso sujeita a limites térmicos, estabilidade, reserva e contingência. Existe em praticamente todo sistema interligado grande, independentemente do desenho comercial.",
    aulaIds: [],
  },
  {
    id: "gl-m05-ambiente-de-contratacao-regulada",
    term: "Ambiente de contratação regulada",
    unit: "Desenho do atacado",
    definition:
      "Ambiente em que as distribuidoras adquirem energia para os consumidores cativos por mecanismos regulados, principalmente leilões e contratos padronizados.",
    aulaIds: [],
  },
  {
    id: "gl-m05-ambiente-de-contratacao-livre",
    term: "Ambiente de contratação livre",
    unit: "Desenho do atacado",
    definition:
      "Ambiente em que agentes habilitados negociam bilateralmente preço, prazo, perfil e garantias. Detalhamento institucional completo é escopo do Bloco 9.",
    aulaIds: [],
  },
  {
    id: "gl-m05-liquidacao-de-diferencas",
    term: "Liquidação de diferenças",
    unit: "Desenho do atacado",
    definition:
      "Valoração, no mercado de curto prazo, da diferença entre energia contratada e energia efetivamente medida. É o mecanismo central que conecta contratos privados a um preço público.",
    aulaIds: [],
  },
  {
    id: "gl-m05-lastro",
    term: "Lastro",
    unit: "Desenho do atacado",
    definition:
      "Obrigação de comprovar contratação suficiente para cobrir a carga atendida. É o instrumento que impede que a soma dos contratos do sistema seja menor que a demanda real.",
    aulaIds: [],
  },
  {
    id: "gl-m05-submercado",
    term: "Submercado",
    unit: "Desenho do atacado",
    definition:
      "Recorte geográfico com preço próprio de curto prazo, definido pelas limitações de intercâmbio entre regiões do sistema. Já tratado em detalhe no Módulo 04.",
    aulaIds: [],
  },
  {
    id: "gl-m05-otimizacao-hidrotermica-intertemporal",
    term: "Otimização hidrotérmica intertemporal",
    unit: "Desenho do atacado",
    definition:
      "Problema de decidir hoje o uso de água armazenada considerando o valor futuro dela sob incerteza de afluência. É a razão física do despacho por custo no Brasil, e não uma preferência de política.",
    aulaIds: [],
  },
  {
    id: "gl-m05-captura-regulatoria",
    term: "Captura regulatória",
    unit: "Captura e governança regulatória",
    definition:
      "Desvio persistente da decisão pública em favor de interesses de um grupo organizado, em detrimento do interesse difuso protegido pelo mandato do regulador. Não exige ilícito.",
    aulaIds: ["aula-05-04"],
  },
  {
    id: "gl-m05-captura-cognitiva",
    term: "Captura cognitiva",
    unit: "Captura e governança regulatória",
    definition:
      "Adoção, pelo regulador, da visão de mundo do regulado como se fosse a única leitura tecnicamente possível — sem benefício pessoal e frequentemente sem consciência.",
    aulaIds: [],
  },
  {
    id: "gl-m05-captura-politica",
    term: "Captura política",
    unit: "Captura e governança regulatória",
    definition:
      "Decisão regulatória adiada, antecipada ou suavizada por conveniência conjuntural, contrariando a metodologia publicada sem justificativa técnica.",
    aulaIds: [],
  },
  {
    id: "gl-m05-porta-giratoria",
    term: "Porta giratória",
    unit: "Captura e governança regulatória",
    definition:
      "Circulação de quadros entre a empresa regulada e a agência, nos dois sentidos, com risco de que a decisão presente considere o empregador passado ou futuro.",
    aulaIds: [],
  },
  {
    id: "gl-m05-assimetria-de-informacao",
    term: "Assimetria de informação",
    unit: "Captura e governança regulatória",
    definition:
      "Situação em que o regulado conhece seus custos e ativos em detalhe e o regulador precisa reconstruí-los a partir de dados fornecidos pelo próprio regulado.",
    aulaIds: [],
  },
  {
    id: "gl-m05-beneficio-concentrado-e-custo-difuso",
    term: "Benefício concentrado e custo difuso",
    unit: "Captura e governança regulatória",
    definition:
      "Estrutura de incentivos em que poucos ganham muito com uma regra e milhões perdem pouco cada um. Origem estrutural do desequilíbrio de participação nos processos regulatórios.",
    aulaIds: [],
  },
  {
    id: "gl-m05-acao-coletiva",
    term: "Ação coletiva",
    unit: "Captura e governança regulatória",
    definition:
      "Problema de organizar um grupo grande e disperso em torno de um interesse comum quando o ganho individual não paga o esforço de participar. Explica por que o lado difuso quase nunca aparece.",
    aulaIds: [],
  },
  {
    id: "gl-m05-quarentena",
    term: "Quarentena",
    unit: "Captura e governança regulatória",
    definition:
      "Período de impedimento posterior ao exercício do cargo público, em que o ex-dirigente não pode atuar junto ao ente que regulava.",
    aulaIds: [],
  },
  {
    id: "gl-m05-conflito-de-interesses",
    term: "Conflito de interesses",
    unit: "Captura e governança regulatória",
    definition:
      "Situação em que interesse privado do agente público pode influenciar, ainda que potencialmente, o desempenho de sua função. Exige declaração e, conforme o caso, impedimento.",
    aulaIds: [],
  },
  {
    id: "gl-m05-mandato-fixo",
    term: "Mandato fixo",
    unit: "Captura e governança regulatória",
    definition:
      "Prazo determinado de exercício do cargo de dirigente, com hipóteses restritas de perda. Reduz o custo pessoal de decidir tecnicamente contra pressão conjuntural.",
    aulaIds: [],
  },
  {
    id: "gl-m05-consulta-publica",
    term: "Consulta pública",
    unit: "Captura e governança regulatória",
    definition:
      "Procedimento de coleta escrita de contribuições sobre proposta regulatória. Só é participação efetiva quando acompanhada de resposta motivada às contribuições.",
    aulaIds: [],
  },
  {
    id: "gl-m05-audiencia-publica",
    term: "Audiência pública",
    unit: "Captura e governança regulatória",
    definition:
      "Procedimento presencial ou remoto de manifestação oral sobre proposta regulatória, complementar à consulta escrita.",
    aulaIds: [],
  },
  {
    id: "gl-m05-analise-de-impacto-regulatorio",
    term: "Análise de impacto regulatório",
    unit: "Captura e governança regulatória",
    definition:
      "Avaliação prévia de alternativas e de seus efeitos antes da edição de ato normativo. Serve para que a alternativa seja escolhida antes, e não justificada depois.",
    aulaIds: [],
  },
  {
    id: "gl-m05-motivacao",
    term: "Motivação",
    unit: "Captura e governança regulatória",
    definition:
      "Dever de explicitar os fundamentos de fato e de direito da decisão administrativa. Decisão publicada sem memória de cálculo tem motivação formal e não tem motivação material.",
    aulaIds: [],
  },
  {
    id: "gl-m05-accountability",
    term: "Accountability",
    unit: "Captura e governança regulatória",
    definition:
      "Obrigação institucional de explicar, justificar e responder por decisões e resultados perante quem é afetado por elas.",
    aulaIds: [],
  },
  {
    id: "gl-m05-reprodutibilidade",
    term: "Reprodutibilidade",
    unit: "Captura e governança regulatória",
    definition:
      "Possibilidade de um terceiro competente refazer o cálculo do regulador a partir da metodologia e dos dados divulgados e chegar ao mesmo número. É o teste mais forte de transparência substantiva.",
    aulaIds: [],
  },
  {
    id: "gl-m05-independencia-analitica",
    term: "Independência analítica",
    unit: "Captura e governança regulatória",
    definition:
      "Propriedade de um analista cuja remuneração não depende do resultado comercial daquilo que ele avalia. É característica do modelo de receita, verificável por terceiros, e não uma declaração de intenção.",
    aulaIds: [],
  },
  {
    id: "gl-m05-regulacao-por-incentivo",
    term: "Regulação por incentivo",
    unit: "Regulação econômica e tarifa",
    definition:
      "Regime em que o regulador fixa uma trajetória de receita ou preço por um período e permite que a empresa retenha temporariamente o ganho de eficiência obtido dentro dele. Popularmente chamado de <em>price cap</em>.",
    aulaIds: [],
  },
  {
    id: "gl-m05-custo-de-servico",
    term: "Custo de serviço",
    unit: "Regulação econômica e tarifa",
    definition:
      "Regime alternativo em que se reconhecem os custos efetivamente incorridos mais uma margem. Simples de administrar e ruim em incentivo, porque gastar mais aumenta a receita.",
    aulaIds: [],
  },
  {
    id: "gl-m05-empresa-de-referencia",
    term: "Empresa de referência",
    unit: "Regulação econômica e tarifa",
    definition:
      "Construção regulatória de quanto custaria operar aquela concessão de forma eficiente, dadas características objetivas. É o benchmark artificial que substitui a rivalidade ausente.",
    aulaIds: [],
  },
  {
    id: "gl-m05-base-de-remuneracao-regulatoria",
    term: "Base de Remuneração Regulatória",
    unit: "Regulação econômica e tarifa",
    definition:
      "Conjunto de ativos reconhecidos pelo regulador como prudentes, úteis, em serviço e vinculados à concessão, sobre o qual incide a remuneração do capital. Corresponde ao que a literatura internacional chama de base de ativos regulatória.",
    aulaIds: [],
  },
  {
    id: "gl-m05-base-bruta-e-base-liquida",
    term: "Base bruta e base líquida",
    unit: "Regulação econômica e tarifa",
    definition:
      "Base bruta é o valor dos ativos reconhecidos antes da depreciação acumulada; base líquida é o que resta após ela. A remuneração incide sobre a líquida.",
    aulaIds: [],
  },
  {
    id: "gl-m05-prudencia",
    term: "Prudência",
    unit: "Regulação econômica e tarifa",
    definition:
      "Teste regulatório sobre necessidade, utilidade e razoabilidade de um investimento ou custo, aplicado antes de reconhecê-lo na base ou na receita.",
    aulaIds: [],
  },
  {
    id: "gl-m05-glosa",
    term: "Glosa",
    unit: "Regulação econômica e tarifa",
    definition:
      "Exclusão, pelo regulador, de ativo ou custo que não passe no teste de prudência, elegibilidade ou efetiva utilização.",
    aulaIds: [],
  },
  {
    id: "gl-m05-quota-de-reintegracao-regulatoria",
    term: "Quota de reintegração regulatória",
    unit: "Regulação econômica e tarifa",
    definition:
      "Parcela anual que devolve ao investidor o capital aplicado ao longo da vida útil dos ativos. É a depreciação em sua versão regulatória.",
    aulaIds: [],
  },
  {
    id: "gl-m05-wacc-regulatorio",
    term: "WACC regulatório",
    unit: "Regulação econômica e tarifa",
    definition:
      "Taxa de retorno definida pelo regulador para remunerar o capital aplicado na atividade regulada, calibrada para uma empresa eficiente e não para a estrutura financeira efetiva da concessionária.",
    aulaIds: ["aula-05-05"],
  },
  {
    id: "gl-m05-wacc-de-projeto",
    term: "WACC de projeto",
    unit: "Regulação econômica e tarifa",
    definition:
      "Taxa de desconto usada por um investidor para avaliar o fluxo de caixa e o risco de um projeto específico. Mesma matemática do regulatório, pergunta institucional oposta.",
    aulaIds: [],
  },
  {
    id: "gl-m05-custo-de-capital-proprio",
    term: "Custo de capital próprio",
    unit: "Regulação econômica e tarifa",
    definition:
      "Retorno exigido pelos acionistas para assumir o risco residual da atividade. Componente do custo médio ponderado.",
    aulaIds: [],
  },
  {
    id: "gl-m05-custo-de-capital-de-terceiros",
    term: "Custo de capital de terceiros",
    unit: "Regulação econômica e tarifa",
    definition:
      "Retorno exigido pelos credores, ajustado pelo efeito tributário da dedutibilidade de juros quando a metodologia assim previr.",
    aulaIds: [],
  },
  {
    id: "gl-m05-estrutura-de-capital-regulatoria",
    term: "Estrutura de capital regulatória",
    unit: "Regulação econômica e tarifa",
    definition:
      "Proporção de capital próprio e de terceiros adotada pelo regulador como referência para a ponderação, independentemente da estrutura real da empresa.",
    aulaIds: [],
  },
  {
    id: "gl-m05-parcela-a",
    term: "Parcela A",
    unit: "Regulação econômica e tarifa",
    definition:
      "Custos considerados predominantemente não gerenciáveis pela distribuidora: compra de energia, uso da transmissão e encargos setoriais.",
    aulaIds: ["aula-05-05"],
  },
  {
    id: "gl-m05-parcela-b",
    term: "Parcela B",
    unit: "Regulação econômica e tarifa",
    definition:
      "Custos e remuneração próprios da atividade de distribuição: custo operacional eficiente, remuneração do capital e reintegração. É sobre ela que incidem os incentivos de eficiência.",
    aulaIds: ["aula-05-05"],
  },
  {
    id: "gl-m05-fator-x",
    term: "Fator X",
    unit: "Regulação econômica e tarifa",
    definition:
      "Mecanismo que compartilha com o consumidor o ganho de produtividade esperado, subtraindo do índice de correção aplicado à Parcela B entre revisões.",
    aulaIds: [],
  },
  {
    id: "gl-m05-revisao-tarifaria-periodica",
    term: "Revisão tarifária periódica",
    unit: "Regulação econômica e tarifa",
    definition:
      "Recalibração estrutural da concessão em ciclo definido no contrato de concessão — tipicamente da ordem de quatro a cinco anos — abrangendo base de ativos, custo de capital, custo operacional eficiente, perdas, qualidade e Fator X.",
    aulaIds: [],
  },
  {
    id: "gl-m05-reajuste-tarifario-anual",
    term: "Reajuste tarifário anual",
    unit: "Regulação econômica e tarifa",
    definition:
      "Atualização da tarifa entre revisões, na data de aniversário do contrato, com repasse da Parcela A conforme regra e correção da Parcela B por índice menos Fator X.",
    aulaIds: [],
  },
  {
    id: "gl-m05-revisao-extraordinaria",
    term: "Revisão extraordinária",
    unit: "Regulação econômica e tarifa",
    definition:
      "Recomposição eventual do equilíbrio econômico-financeiro quando evento imprevisível e relevante o altera de forma material.",
    aulaIds: ["aula-05-05"],
  },
  {
    id: "gl-m05-modicidade-tarifaria",
    term: "Modicidade tarifária",
    unit: "Regulação econômica e tarifa",
    definition:
      "Objetivo de tarifa tão baixa quanto compatível com serviço adequado, qualidade e equilíbrio da concessão. É otimização intertemporal, não promessa de menor preço no ano corrente.",
    aulaIds: [],
  },

  // ── Modulo 06 (Wave 34) ──────────────────────────────
  {
    id: "gl-m06-cnaee",
    term: "CNAEE",
    unit: "Órgãos, empresas e instituições",
    definition:
      "Conselho Nacional de Águas e Energia Elétrica, criado em 1939 como órgão federal de consulta, orientação e controle do setor. Primeiro aparato federal permanente após o Código de Águas.",
    aulaIds: [],
  },
  {
    id: "gl-m06-dnaee",
    term: "DNAEE",
    unit: "Órgãos, empresas e instituições",
    definition:
      "Departamento Nacional de Águas e Energia Elétrica, órgão de regulação e fiscalização que antecedeu a ANEEL na estrutura da administração direta.",
    aulaIds: [],
  },
  {
    id: "gl-m06-eletrobras",
    term: "Eletrobras",
    unit: "Órgãos, empresas e instituições",
    definition:
      "Centrais Elétricas Brasileiras, holding federal autorizada por lei de 1961 e instalada em 1962; concentrou financiamento, coordenação e participação em subsidiárias. Desestatizada por capitalização em 2022.",
    aulaIds: ["aula-06-06"],
  },
  {
    id: "gl-m06-axia-energia",
    term: "AXIA Energia",
    unit: "Órgãos, empresas e instituições",
    definition:
      "Denominação adotada pela companhia em outubro de 2025, com negociação sob novos códigos a partir de novembro do mesmo ano. Mudança de marca com continuidade societária, contratual e regulatória integral.",
    aulaIds: [],
  },
  {
    id: "gl-m06-chesf",
    term: "Chesf",
    unit: "Órgãos, empresas e instituições",
    definition:
      "Companhia Hidro Elétrica do São Francisco, autorizada em 1945. Primeira grande empresa federal de geração e símbolo da eletrificação como política de desenvolvimento regional.",
    aulaIds: [],
  },
  {
    id: "gl-m06-furnas",
    term: "Furnas",
    unit: "Órgãos, empresas e instituições",
    definition:
      "Empresa federal criada em 1957 para enfrentar o risco de déficit no Centro-Sul, com projeto de grande porte no rio Grande.",
    aulaIds: [],
  },
  {
    id: "gl-m06-eletronorte",
    term: "Eletronorte",
    unit: "Órgãos, empresas e instituições",
    definition:
      "Empresa federal criada no início dos anos 1970 para levar geração e transmissão de grande porte à Amazônia. Responsável por Tucuruí.",
    aulaIds: [],
  },
  {
    id: "gl-m06-cemig",
    term: "Cemig",
    unit: "Órgãos, empresas e instituições",
    definition:
      "Companhia Energética de Minas Gerais, criada em 1952. Demonstrou que estado da federação também podia ser empreendedor elétrico, com planejamento e captação próprios.",
    aulaIds: [],
  },
  {
    id: "gl-m06-itaipu-binacional",
    term: "Itaipu Binacional",
    unit: "Órgãos, empresas e instituições",
    definition:
      "Entidade criada por tratado entre Brasil e Paraguai, de 1973, para construir e operar a usina de Itaipu. Regime jurídico próprio, não equiparável ao de uma concessionária brasileira.",
    aulaIds: [],
  },
  {
    id: "gl-m06-bnde-bndes",
    term: "BNDE / BNDES",
    unit: "Órgãos, empresas e instituições",
    definition:
      "Banco Nacional de Desenvolvimento Econômico, criado em 1952 e posteriormente acrescido do \"e Social\". Fonte central de financiamento de longo prazo da expansão elétrica em praticamente todos os ciclos.",
    aulaIds: [],
  },
  {
    id: "gl-m06-light",
    term: "Light",
    unit: "Órgãos, empresas e instituições",
    definition:
      "Concessionária do Rio de Janeiro com origem no capital canadense do início do século XX, sob a holding Brazilian Traction; adquirida pelo Estado brasileiro em 1979, privatizada em 1996 e em recuperação judicial deferida em 2023. É o caso brasileiro mais completo de ciclos de propriedade.",
    aulaIds: [],
  },
  {
    id: "gl-m06-amforp",
    term: "Amforp",
    unit: "Órgãos, empresas e instituições",
    definition:
      "American &amp; Foreign Power Company, grupo estrangeiro que a partir dos anos 1920 adquiriu concessionárias do interior. Seus ativos foram adquiridos pelo Estado brasileiro em 1964.",
    aulaIds: [],
  },
  {
    id: "gl-m06-gcoi",
    term: "GCOI",
    unit: "Órgãos, empresas e instituições",
    definition:
      "Grupo Coordenador para a Operação Interligada, criado em 1973 para coordenar a operação das empresas do sistema interligado. Antecessor institucional direto do ONS.",
    aulaIds: [],
  },
  {
    id: "gl-m06-mae",
    term: "MAE",
    unit: "Órgãos, empresas e instituições",
    definition:
      "Mercado Atacadista de Energia, criado em 1998 para organizar transações e preço de curto prazo. Enfrentou dificuldades de implantação e liquidação, e foi substituído pela CCEE em 2004.",
    aulaIds: [],
  },
  {
    id: "gl-m06-ons",
    term: "ONS",
    unit: "Órgãos, empresas e instituições",
    definition:
      "Operador Nacional do Sistema Elétrico, criado em 1998 sucedendo o GCOI. Entidade de direito privado sem fins lucrativos, autorizada e regulada, com função pública de coordenar e controlar a operação do sistema interligado.",
    aulaIds: [],
  },
  {
    id: "gl-m06-aneel",
    term: "ANEEL",
    unit: "Órgãos, empresas e instituições",
    definition:
      "Agência Nacional de Energia Elétrica, instituída por lei de 1996 e em operação a partir de dezembro de 1997. Primeira agência reguladora setorial com autonomia e mandato definidos em lei.",
    aulaIds: [],
  },
  {
    id: "gl-m06-ccee",
    term: "CCEE",
    unit: "Órgãos, empresas e instituições",
    definition:
      "Câmara de Comercialização de Energia Elétrica, criada em 2004 em substituição ao MAE. Registra contratos dos dois ambientes, mede, contabiliza e liquida diferenças.",
    aulaIds: [],
  },
  {
    id: "gl-m06-epe",
    term: "EPE",
    unit: "Órgãos, empresas e instituições",
    definition:
      "Empresa de Pesquisa Energética, criada em 2004 para produzir os estudos de planejamento do setor — dentro do Estado, fora do operador e fora da agência.",
    aulaIds: [],
  },
  {
    id: "gl-m06-cmse",
    term: "CMSE",
    unit: "Órgãos, empresas e instituições",
    definition:
      "Comitê de Monitoramento do Setor Elétrico, criado em 2004 para acompanhar continuamente continuidade e segurança de suprimento e recomendar ação preventiva. Resposta direta à falha de conversão de informação em decisão identificada em 2001.",
    aulaIds: [],
  },
  {
    id: "gl-m06-gce",
    term: "GCE",
    unit: "Órgãos, empresas e instituições",
    definition:
      "Câmara de Gestão da Crise de Energia Elétrica, criada em maio de 2001 sob coordenação da Casa Civil para conduzir o programa de racionamento. Extinta em 2002.",
    aulaIds: [],
  },
  {
    id: "gl-m06-canambra",
    term: "Canambra",
    unit: "Órgãos, empresas e instituições",
    definition:
      "Conjunto de estudos iniciados em 1963 que mapearam sistematicamente recursos e necessidades do Centro-Sul e inauguraram o tratamento de usinas e redes como sistema único.",
    aulaIds: [],
  },
  {
    id: "gl-m06-codigo-de-aguas",
    term: "Código de Águas",
    unit: "Marcos legais e normativos",
    definition:
      "Decreto nº 24.643, de 10 de julho de 1934. Separa o potencial hidráulico da propriedade do solo, concentra na União o poder concedente e a fiscalização, e fixa remuneração pelo custo histórico do investimento.",
    aulaIds: [],
  },
  {
    id: "gl-m06-lei-n-3-890-a-1961",
    term: "Lei nº 3.890-A/1961",
    unit: "Marcos legais e normativos",
    definition:
      "Autoriza a União a constituir as Centrais Elétricas Brasileiras. A empresa é efetivamente instalada em junho de 1962 — daí as duas datas citadas para a criação da Eletrobras.",
    aulaIds: [],
  },
  {
    id: "gl-m06-lei-n-4-156-1962",
    term: "Lei nº 4.156/1962",
    unit: "Marcos legais e normativos",
    definition:
      "Fortalece a base financeira da Eletrobras com o Imposto Único sobre Energia Elétrica e o empréstimo compulsório sobre o consumo.",
    aulaIds: [],
  },
  {
    id: "gl-m06-lei-n-8-631-1993",
    term: "Lei nº 8.631/1993",
    unit: "Marcos legais e normativos",
    definition:
      "Extingue a remuneração garantida e a equalização tarifária nacional e promove o encontro de contas. Pré-condição técnica de qualquer alienação posterior.",
    aulaIds: [],
  },
  {
    id: "gl-m06-lei-n-8-987-1995",
    term: "Lei nº 8.987/1995",
    unit: "Marcos legais e normativos",
    definition:
      "Regime geral de concessão e permissão de serviço público: serviço adequado, política tarifária e equilíbrio econômico-financeiro.",
    aulaIds: [],
  },
  {
    id: "gl-m06-lei-n-9-074-1995",
    term: "Lei nº 9.074/1995",
    unit: "Marcos legais e normativos",
    definition:
      "Outorgas e prorrogações, figura do produtor independente e do consumidor livre acima de limites de carga e tensão. Base legal de toda a escada de abertura posterior.",
    aulaIds: [],
  },
  {
    id: "gl-m06-lei-n-9-427-1996",
    term: "Lei nº 9.427/1996",
    unit: "Marcos legais e normativos",
    definition:
      "Institui a ANEEL e disciplina o regime das concessões de energia elétrica.",
    aulaIds: [],
  },
  {
    id: "gl-m06-projeto-re-seb",
    term: "Projeto RE-SEB",
    unit: "Marcos legais e normativos",
    definition:
      "Projeto de Reestruturação do Setor Elétrico Brasileiro, iniciado em 1996, que desenhou a separação entre geração, transmissão, distribuição e comercialização.",
    aulaIds: [],
  },
  {
    id: "gl-m06-lei-n-9-648-1998",
    term: "Lei nº 9.648/1998",
    unit: "Marcos legais e normativos",
    definition:
      "Cria o ONS e o MAE, separando a coordenação física da negociação comercial.",
    aulaIds: [],
  },
  {
    id: "gl-m06-decreto-n-2-655-1998",
    term: "Decreto nº 2.655/1998",
    unit: "Marcos legais e normativos",
    definition:
      "Regulamenta o caráter competitivo de geração e comercialização e assegura o livre acesso às redes mediante encargos e condições reguladas.",
    aulaIds: [],
  },
  {
    id: "gl-m06-lei-n-10-438-2002",
    term: "Lei nº 10.438/2002",
    unit: "Marcos legais e normativos",
    definition:
      "Cria o Proinfa e a Conta de Desenvolvimento Energético. Marca o momento em que a conta de luz passa formalmente a financiar política pública de diversificação.",
    aulaIds: [],
  },
  {
    id: "gl-m06-leis-n-10-847-e-n-10-848-2004",
    term: "Leis nº 10.847 e nº 10.848/2004",
    unit: "Marcos legais e normativos",
    definition:
      "Criam a EPE e a CCEE e organizam a contratação nos ambientes regulado e livre. O par de leis que constitui o Novo Modelo.",
    aulaIds: [],
  },
  {
    id: "gl-m06-decreto-n-5-163-2004",
    term: "Decreto nº 5.163/2004",
    unit: "Marcos legais e normativos",
    definition:
      "Regulamenta a comercialização e os leilões, detalhando obrigação de cobertura contratual e lastro.",
    aulaIds: [],
  },
  {
    id: "gl-m06-mp-579-2012-e-lei-n-12-783-2013",
    term: "MP 579/2012 e Lei nº 12.783/2013",
    unit: "Marcos legais e normativos",
    definition:
      "Prorrogação antecipada de concessões de geração e transmissão condicionada a receitas menores, com regime de cotas para hidrelétricas.",
    aulaIds: [],
  },
  {
    id: "gl-m06-lei-n-13-203-2015",
    term: "Lei nº 13.203/2015",
    unit: "Marcos legais e normativos",
    definition:
      "Abre a repactuação do risco hidrológico mediante pagamento de prêmio, primeira tentativa legislativa de encerrar a judicialização do GSF.",
    aulaIds: [],
  },
  {
    id: "gl-m06-lei-n-14-052-2020",
    term: "Lei nº 14.052/2020",
    unit: "Marcos legais e normativos",
    definition:
      "Estabelece novas condições de repactuação, com compensação por extensão do prazo de outorga condicionada à desistência das ações judiciais.",
    aulaIds: [],
  },
  {
    id: "gl-m06-portaria-mme-n-514-2018",
    term: "Portaria MME nº 514/2018",
    unit: "Marcos legais e normativos",
    definition:
      "Inicia a escada de redução dos limites de carga para migração ao mercado livre: 2.500 kW a partir de julho de 2019 e 2.000 kW a partir de janeiro de 2020.",
    aulaIds: [],
  },
  {
    id: "gl-m06-portaria-mme-n-465-2019",
    term: "Portaria MME nº 465/2019",
    unit: "Marcos legais e normativos",
    definition:
      "Continua a escada: 1.500 kW em 2021, 1.000 kW em 2022 e 500 kW em 2023, e determina estudo para abertura abaixo de 500 kW com cronograma a partir de 2024.",
    aulaIds: [],
  },
  {
    id: "gl-m06-lei-n-14-182-2021",
    term: "Lei nº 14.182/2021",
    unit: "Marcos legais e normativos",
    definition:
      "Autoriza a desestatização da Eletrobras por aumento de capital com renúncia da União ao direito de subscrição, e estabelece o limite de dez por cento de voto.",
    aulaIds: [],
  },
  {
    id: "gl-m06-lei-n-14-300-2022",
    term: "Lei nº 14.300/2022",
    unit: "Marcos legais e normativos",
    definition:
      "Marco legal da micro e minigeração distribuída, consolidando as regras de transição do sistema de compensação.",
    aulaIds: [],
  },
  {
    id: "gl-m06-portaria-normativa-n-50-gm-mme-de-2022",
    term: "Portaria Normativa nº 50/GM/MME, de 2022",
    unit: "Marcos legais e normativos",
    definition:
      "Determina que, a partir de 1º de janeiro de 2024, todo consumidor do Grupo A possa contratar energia livremente, sem exigência de carga mínima.",
    aulaIds: [],
  },
  {
    id: "gl-m06-lei-n-15-269-2025",
    term: "Lei nº 15.269/2025",
    unit: "Marcos legais e normativos",
    definition:
      "Sancionada em 24 de novembro de 2025 a partir de medida provisória. Estabelece cronograma legal de abertura à baixa tensão — até novembro de 2027 para indústria e comércio, até novembro de 2028 para os demais —, trata de armazenamento, reserva de capacidade, teto de custeio da CDE, supridor de última instância e produto padrão de baixa tensão.",
    aulaIds: [],
  },
  {
    id: "gl-m06-concessao",
    term: "Concessão",
    unit: "Regimes de propriedade e organização",
    definition:
      "Delegação, por prazo e condições definidos, do direito de prestar serviço público ou explorar bem ou potencial público.",
    aulaIds: ["aula-06-05"],
  },
  {
    id: "gl-m06-poder-concedente",
    term: "Poder concedente",
    unit: "Regimes de propriedade e organização",
    definition:
      "Autoridade pública competente para outorgar, fiscalizar e extinguir concessões. No setor elétrico brasileiro, a União, desde 1934.",
    aulaIds: [],
  },
  {
    id: "gl-m06-outorga",
    term: "Outorga",
    unit: "Regimes de propriedade e organização",
    definition:
      "Ato pelo qual o poder concedente confere o direito de explorar determinada atividade ou aproveitamento, com prazo e obrigações. Sua extensão virou moeda de compensação na solução do GSF.",
    aulaIds: [],
  },
  {
    id: "gl-m06-verticalizacao",
    term: "Verticalização",
    unit: "Regimes de propriedade e organização",
    definition:
      "Exercício de geração, transmissão, distribuição e comercialização pela mesma empresa ou grupo. Foi o padrão brasileiro até o fim dos anos 1990.",
    aulaIds: [],
  },
  {
    id: "gl-m06-desverticalizacao",
    term: "Desverticalização",
    unit: "Regimes de propriedade e organização",
    definition:
      "Separação entre esses segmentos para distinguir o que é monopólio natural do que pode competir. No Brasil, desenhada no RE-SEB e concretizada nas leis de 1998 e 2004.",
    aulaIds: [],
  },
  {
    id: "gl-m06-estatizacao",
    term: "Estatização",
    unit: "Regimes de propriedade e organização",
    definition:
      "Ampliação da propriedade e do controle estatal sobre ativos e empresas. Não é sinônimo de regulação: pode haver regulação forte com propriedade privada e o contrário.",
    aulaIds: [],
  },
  {
    id: "gl-m06-nacionalizacao",
    term: "Nacionalização",
    unit: "Regimes de propriedade e organização",
    definition:
      "Transferência de ativos antes controlados por capital estrangeiro a grupos nacionais, públicos ou privados. No Brasil, concluída com Amforp em 1964 e Light em 1979.",
    aulaIds: [],
  },
  {
    id: "gl-m06-privatizacao",
    term: "Privatização",
    unit: "Regimes de propriedade e organização",
    definition:
      "Transferência de controle ou de ativos estatais ao setor privado. Pode ocorrer sem liberalização e nunca elimina a regulação sobre o serviço concedido.",
    aulaIds: [],
  },
  {
    id: "gl-m06-liberalizacao",
    term: "Liberalização",
    unit: "Regimes de propriedade e organização",
    definition:
      "Abertura à competição e à liberdade de contratação. Pode ocorrer com empresas estatais e privadas coexistindo — é exatamente o caso brasileiro desde 2004.",
    aulaIds: [],
  },
  {
    id: "gl-m06-capitalizacao",
    term: "Capitalização",
    unit: "Regimes de propriedade e organização",
    definition:
      "Aumento de capital por emissão de ações novas, com recursos entrando na companhia e diluição de quem não acompanha. Mecanismo da desestatização da Eletrobras em 2022.",
    aulaIds: ["aula-06-06"],
  },
  {
    id: "gl-m06-corporation",
    term: "Corporation",
    unit: "Regimes de propriedade e organização",
    definition:
      "Companhia sem acionista controlador definido, com capital pulverizado e poder decisório concentrado no conselho. Configuração resultante da capitalização de 2022 combinada ao limite de voto.",
    aulaIds: [],
  },
  {
    id: "gl-m06-acao-de-classe-especial",
    term: "Ação de classe especial",
    unit: "Regimes de propriedade e organização",
    definition:
      "Participação que confere ao poder público veto em matérias delimitadas em estatuto, sem conferir controle. Mantida pela União na desestatização da Eletrobras.",
    aulaIds: [],
  },
  {
    id: "gl-m06-recuperacao-judicial",
    term: "Recuperação judicial",
    unit: "Regimes de propriedade e organização",
    definition:
      "Procedimento judicial de reestruturação de dívidas de empresa em crise, com suspensão temporária de execuções. Deferida à Light em maio de 2023.",
    aulaIds: [],
  },
  {
    id: "gl-m06-universalizacao",
    term: "Universalização",
    unit: "Regimes de propriedade e organização",
    definition:
      "Extensão do acesso ao serviço a consumidores e regiões que não seriam atendidos apenas por retorno privado imediato. Objetivo explícito do setor desde 2003.",
    aulaIds: [],
  },
  {
    id: "gl-m06-clausula-ouro",
    term: "Cláusula-ouro",
    unit: "Tarifa, financiamento e passivos históricos",
    definition:
      "Mecanismo que vinculava parte da tarifa ao ouro ou a moeda estrangeira, protegendo a concessionária contra desvalorização. Proibida por decreto em 1933.",
    aulaIds: [],
  },
  {
    id: "gl-m06-custo-historico",
    term: "Custo histórico",
    unit: "Tarifa, financiamento e passivos históricos",
    definition:
      "Base de remuneração ancorada no valor nominal do investimento no momento em que foi feito, sem atualização para custo de reposição. Regime instituído pelo Código de Águas.",
    aulaIds: [],
  },
  {
    id: "gl-m06-servico-pelo-custo",
    term: "Serviço pelo custo",
    unit: "Tarifa, financiamento e passivos históricos",
    definition:
      "Princípio tarifário em que a receita reconhecida busca cobrir custos prudentes mais remuneração do capital. Simples de administrar e fraco em incentivo à eficiência.",
    aulaIds: [],
  },
  {
    id: "gl-m06-remuneracao-garantida",
    term: "Remuneração garantida",
    unit: "Tarifa, financiamento e passivos históricos",
    definition:
      "Arranjo que assegurava taxa de retorno ao investimento reconhecido, com faixa legal usualmente citada entre dez e doze por cento ao ano. Extinta em 1993.",
    aulaIds: [],
  },
  {
    id: "gl-m06-equalizacao-tarifaria",
    term: "Equalização tarifária",
    unit: "Tarifa, financiamento e passivos históricos",
    definition:
      "Uniformização de tarifas entre concessionárias e regiões, com compensação de diferenças por contas próprias. Reduziu disparidade territorial e apagou o sinal de eficiência entre empresas. Extinta em 1993.",
    aulaIds: [],
  },
  {
    id: "gl-m06-divida-intrassetorial",
    term: "Dívida intrassetorial",
    unit: "Tarifa, financiamento e passivos históricos",
    definition:
      "Estoque de obrigações não honradas entre empresas do próprio setor, viável porque todas pertenciam em última instância ao mesmo dono. Tornou o fluxo financeiro do setor ilegível nos anos 1980.",
    aulaIds: [],
  },
  {
    id: "gl-m06-encontro-de-contas",
    term: "Encontro de contas",
    unit: "Tarifa, financiamento e passivos históricos",
    definition:
      "Liquidação dos saldos acumulados entre empresas do setor, promovida em 1993 para tornar os balanços avaliáveis.",
    aulaIds: [],
  },
  {
    id: "gl-m06-imposto-unico-sobre-energia-eletrica",
    term: "Imposto Único sobre Energia Elétrica",
    unit: "Tarifa, financiamento e passivos históricos",
    definition:
      "Tributo específico que, junto com o empréstimo compulsório, financiou a expansão do sistema a partir de 1962. Origem histórica da prática de embutir política pública na conta de luz.",
    aulaIds: [],
  },
  {
    id: "gl-m06-emprestimo-compulsorio",
    term: "Empréstimo compulsório",
    unit: "Tarifa, financiamento e passivos históricos",
    definition:
      "Recolhimento obrigatório sobre o consumo de energia, restituível, usado como fonte de financiamento da expansão no ciclo estatal.",
    aulaIds: [],
  },
  {
    id: "gl-m06-acordo-geral-do-setor-eletrico",
    term: "Acordo Geral do Setor Elétrico",
    unit: "Tarifa, financiamento e passivos históricos",
    definition:
      "Arranjo de recomposição tarifária extraordinária e financiamento firmado após o racionamento de 2001 para cobrir as perdas de receita das distribuidoras.",
    aulaIds: [],
  },
  {
    id: "gl-m06-conta-acr",
    term: "Conta-ACR",
    unit: "Tarifa, financiamento e passivos históricos",
    definition:
      "Mecanismo financeiro criado em 2014 para cobrir a exposição das distribuidoras ao custo de geração durante a crise hídrica, com pagamento posterior pelos consumidores.",
    aulaIds: [],
  },
  {
    id: "gl-m06-conta-covid",
    term: "Conta-Covid",
    unit: "Tarifa, financiamento e passivos históricos",
    definition:
      "Mecanismo equivalente criado em 2020 para preservar a liquidez das distribuidoras diante da queda de consumo na pandemia. Terceira aparição da mesma assinatura institucional.",
    aulaIds: [],
  },
  {
    id: "gl-m06-bandeiras-tarifarias",
    term: "Bandeiras tarifárias",
    unit: "Tarifa, financiamento e passivos históricos",
    definition:
      "Componente tarifário aplicado a partir de 2015 para sinalizar mensalmente a condição de geração e cobrar adicional quando o custo se eleva. Não é tributo.",
    aulaIds: [],
  },
  {
    id: "gl-m06-bandeira-escassez-hidrica",
    term: "Bandeira escassez hídrica",
    unit: "Tarifa, financiamento e passivos históricos",
    definition:
      "Bandeira específica instituída na crise de 2021, vigente de setembro de 2021 a abril de 2022.",
    aulaIds: [],
  },
  {
    id: "gl-m06-revisao-tarifaria-extraordinaria",
    term: "Revisão tarifária extraordinária",
    unit: "Tarifa, financiamento e passivos históricos",
    definition:
      "Recomposição eventual do equilíbrio econômico-financeiro quando evento imprevisível e relevante o altera materialmente. Aplicada em 2001-2002 e em 2015.",
    aulaIds: [],
  },
  {
    id: "gl-m06-cde",
    term: "CDE",
    unit: "Tarifa, financiamento e passivos históricos",
    definition:
      "Conta de Desenvolvimento Energético, criada em 2002, encargo e fundo que custeia políticas e subsídios setoriais. A lei de 2025 estabeleceu teto para suas fontes de custeio.",
    aulaIds: [],
  },
  {
    id: "gl-m06-racionamento",
    term: "Racionamento",
    unit: "Segurança de suprimento e crise",
    definition:
      "Redução compulsória e planejada do consumo, determinada por autoridade pública para compatibilizar demanda e oferta. É decisão administrativa, não falha técnica.",
    aulaIds: ["aula-06-03"],
  },
  {
    id: "gl-m06-blecaute",
    term: "Blecaute",
    unit: "Segurança de suprimento e crise",
    definition:
      "Interrupção involuntária do fornecimento por falha de operação ou de rede. Categoria distinta de racionamento, com causa, resposta e consequência contratual diferentes.",
    aulaIds: [],
  },
  {
    id: "gl-m06-seguranca-de-suprimento",
    term: "Segurança de suprimento",
    unit: "Segurança de suprimento e crise",
    definition:
      "Capacidade de atender a carga esperada com margem adequada diante de incertezas e contingências. Objetivo explícito do setor desde 2003, ao lado de modicidade e universalização.",
    aulaIds: [],
  },
  {
    id: "gl-m06-margem-de-capacidade-firme",
    term: "Margem de capacidade firme",
    unit: "Segurança de suprimento e crise",
    definition:
      "Folga de capacidade não hidráulica disponível para deslocar geração hidrelétrica e poupar armazenamento. Sua insuficiência é o elemento estrutural do racionamento de 2001.",
    aulaIds: [],
  },
  {
    id: "gl-m06-energia-assegurada",
    term: "Energia assegurada",
    unit: "Segurança de suprimento e crise",
    definition:
      "Conceito de lastro contratual vigente no arranjo dos anos 1990, cujas regras em disputa contribuíram para a instabilidade do período de transição.",
    aulaIds: [],
  },
  {
    id: "gl-m06-garantia-fisica",
    term: "Garantia física",
    unit: "Segurança de suprimento e crise",
    definition:
      "Quantidade de energia associada à contribuição de um empreendimento para a adequação do sistema, usada como lastro de contratação no modelo de 2004.",
    aulaIds: [],
  },
  {
    id: "gl-m06-lastro",
    term: "Lastro",
    unit: "Segurança de suprimento e crise",
    definition:
      "Obrigação de comprovar contratação e capacidade física suficientes para cobrir a carga atendida. É o instrumento que impede que a soma dos contratos seja menor que a demanda real.",
    aulaIds: [],
  },
  {
    id: "gl-m06-mre",
    term: "MRE",
    unit: "Segurança de suprimento e crise",
    definition:
      "Mecanismo de Realocação de Energia, que compartilha entre hidrelétricas participantes o risco de geração em relação à garantia física.",
    aulaIds: [],
  },
  {
    id: "gl-m06-gsf",
    term: "GSF",
    unit: "Segurança de suprimento e crise",
    definition:
      "Fator de ajuste aplicado quando a geração do conjunto do MRE fica abaixo da garantia física. Detalhamento mecânico é escopo do Bloco 9; aqui interessa a disputa institucional que ele gerou.",
    aulaIds: ["aula-06-05"],
  },
  {
    id: "gl-m06-risco-hidrologico",
    term: "Risco hidrológico",
    unit: "Segurança de suprimento e crise",
    definition:
      "Risco de a geração hidrelétrica efetiva ficar abaixo da referência contratual por razão de hidrologia e operação sistêmica. A indeterminação da sua fronteira é a origem da judicialização.",
    aulaIds: [],
  },
  {
    id: "gl-m06-judicializacao",
    term: "Judicialização",
    unit: "Segurança de suprimento e crise",
    definition:
      "Transferência de conflito regulatório ou comercial para o Judiciário, frequentemente por decisões liminares que alteram liquidação e rateio.",
    aulaIds: [],
  },
  {
    id: "gl-m06-rateio",
    term: "Rateio",
    unit: "Segurança de suprimento e crise",
    definition:
      "Distribuição proporcional, entre credores, do que efetivamente foi arrecadado num ciclo de liquidação. Explica por que a proteção judicial de um agente reduz o recebimento de todos os demais.",
    aulaIds: ["aula-06-05"],
  },
  {
    id: "gl-m06-repactuacao-do-risco-hidrologico",
    term: "Repactuação do risco hidrológico",
    unit: "Segurança de suprimento e crise",
    definition:
      "Solução negociada, construída em camadas legislativas sucessivas a partir de 2015, que troca litígio por prêmio de risco, extensão de outorga ou títulos negociáveis.",
    aulaIds: [],
  },
  {
    id: "gl-m06-acr",
    term: "ACR",
    unit: "Mercado, abertura e classes de consumidor",
    definition:
      "Ambiente de Contratação Regulada, no qual as distribuidoras adquirem energia por mecanismos regulados para atender os consumidores cativos. Formalizado em 2004.",
    aulaIds: [],
  },
  {
    id: "gl-m06-acl",
    term: "ACL",
    unit: "Mercado, abertura e classes de consumidor",
    definition:
      "Ambiente de Contratação Livre, no qual agentes elegíveis negociam bilateralmente preço, prazo, volume e garantias. Formalizado em 2004 sobre base legal de 1995.",
    aulaIds: [],
  },
  {
    id: "gl-m06-consumidor-livre",
    term: "Consumidor livre",
    unit: "Mercado, abertura e classes de consumidor",
    definition:
      "Consumidor elegível a contratar energia de qualquer fornecedor autorizado. A definição de elegibilidade mudou por norma pelo menos seis vezes entre 1995 e 2024.",
    aulaIds: [],
  },
  {
    id: "gl-m06-consumidor-especial",
    term: "Consumidor especial",
    unit: "Mercado, abertura e classes de consumidor",
    definition:
      "Faixa intermediária que podia contratar apenas de fontes incentivadas, com limite de carga próprio. Categoria absorvida com a abertura integral do Grupo A.",
    aulaIds: [],
  },
  {
    id: "gl-m06-produtor-independente",
    term: "Produtor independente",
    unit: "Mercado, abertura e classes de consumidor",
    definition:
      "Agente autorizado a gerar energia por sua conta e risco para venda, figura criada em 1995. Base da entrada privada em geração.",
    aulaIds: [],
  },
  {
    id: "gl-m06-autoprodutor",
    term: "Autoprodutor",
    unit: "Mercado, abertura e classes de consumidor",
    definition:
      "Consumidor titular de outorga de geração que produz energia por conta e risco próprios para consumo próprio. Regime revisitado pela lei de 2025.",
    aulaIds: [],
  },
  {
    id: "gl-m06-comercializador-varejista",
    term: "Comercializador varejista",
    unit: "Mercado, abertura e classes de consumidor",
    definition:
      "Agente que representa consumidores de menor porte no mercado livre, viabilizando migração sem que cada um se torne agente da câmara. Peça central da abertura de 2024 em diante.",
    aulaIds: [],
  },
  {
    id: "gl-m06-grupo-a",
    term: "Grupo A",
    unit: "Mercado, abertura e classes de consumidor",
    definition:
      "Consumidores atendidos em tensão igual ou superior a 2,3 kV, com tarifa binômia. Elegíveis integralmente ao mercado livre desde 1º de janeiro de 2024.",
    aulaIds: [],
  },
  {
    id: "gl-m06-grupo-b",
    term: "Grupo B",
    unit: "Mercado, abertura e classes de consumidor",
    definition:
      "Consumidores atendidos em baixa tensão, abaixo de 2,3 kV. Elegibilidade prevista em cronograma legal com prazos em novembro de 2027 e novembro de 2028.",
    aulaIds: [],
  },
  {
    id: "gl-m06-supridor-de-ultima-instancia",
    term: "Supridor de última instância",
    unit: "Mercado, abertura e classes de consumidor",
    definition:
      "Figura prevista na lei de 2025 para assegurar continuidade de atendimento em caso de falha ou encerramento da representação por agente varejista.",
    aulaIds: [],
  },
  {
    id: "gl-m06-produto-padrao-de-baixa-tensao",
    term: "Produto padrão de baixa tensão",
    unit: "Mercado, abertura e classes de consumidor",
    definition:
      "Contrato e preço de referência previstos na lei de 2025 para permitir comparação entre ofertas na abertura do varejo.",
    aulaIds: [],
  },
  {
    id: "gl-m06-geracao-distribuida",
    term: "Geração distribuída",
    unit: "Mercado, abertura e classes de consumidor",
    definition:
      "Geração conectada junto à unidade consumidora, com compensação de energia. Sistema criado por resolução em 2012 e consolidado em lei em 2022.",
    aulaIds: ["aula-06-05"],
  },
  {
    id: "gl-m06-mercado-enderecavel",
    term: "Mercado endereçável",
    unit: "Mercado, abertura e classes de consumidor",
    definition:
      "Conjunto de unidades consumidoras que, num dado momento, têm direito legal de escolher fornecedor — e que, portanto, precisam de análise para exercer essa escolha. No Brasil, ele é definido por norma e cresce em degraus datados.",
    aulaIds: [],
  },

  // ── Modulo 07 (Wave 34) ──────────────────────────────
  {
    id: "gl-m07-mme",
    term: "MME",
    unit: "Instituições e natureza jurídica",
    definition:
      "Ministério de Minas e Energia. Órgão da administração pública federal direta responsável pela formulação e coordenação das políticas nacionais de energia e mineração.",
    aulaIds: ["aula-07-01"],
  },
  {
    id: "gl-m07-cnpe",
    term: "CNPE",
    unit: "Instituições e natureza jurídica",
    definition:
      "Conselho Nacional de Política Energética. Órgão de assessoramento da Presidência da República para políticas e diretrizes de energia, presidido pelo Ministro de Minas e Energia.",
    aulaIds: ["aula-07-01"],
  },
  {
    id: "gl-m07-aneel",
    term: "ANEEL",
    unit: "Instituições e natureza jurídica",
    definition:
      "Agência Nacional de Energia Elétrica. Autarquia sob regime especial vinculada ao ministério, criada pela Lei nº 9.427/1996, com competência de regulação, outorga, fiscalização, processo tarifário, sanção e mediação administrativa.",
    aulaIds: ["aula-07-03"],
  },
  {
    id: "gl-m07-epe",
    term: "EPE",
    unit: "Instituições e natureza jurídica",
    definition:
      "Empresa de Pesquisa Energética. Empresa pública federal criada pela Lei nº 10.847/2004 para desenvolver estudos e pesquisas de planejamento energético.",
    aulaIds: ["aula-07-02"],
  },
  {
    id: "gl-m07-ons",
    term: "ONS",
    unit: "Instituições e natureza jurídica",
    definition:
      "Operador Nacional do Sistema Elétrico. Pessoa jurídica de direito privado sob a forma de associação civil sem fins lucrativos, criada em 1998 pela Lei nº 9.648 e regulamentada pelo Decreto nº 5.081/2004.",
    aulaIds: ["aula-07-04"],
  },
  {
    id: "gl-m07-ccee",
    term: "CCEE",
    unit: "Instituições e natureza jurídica",
    definition:
      "Câmara de Comercialização de Energia Elétrica. Pessoa jurídica de direito privado sem fins lucrativos, mantida pelos agentes e regulada e fiscalizada pela agência, criada no Novo Modelo de 2004 em substituição ao mercado atacadista anterior.",
    aulaIds: ["aula-07-05"],
  },
  {
    id: "gl-m07-cmse",
    term: "CMSE",
    unit: "Instituições e natureza jurídica",
    definition:
      "Comitê de Monitoramento do Setor Elétrico. Comitê interinstitucional constituído no âmbito do ministério para acompanhar e avaliar permanentemente a continuidade e a segurança do suprimento eletroenergético.",
    aulaIds: ["aula-07-06"],
  },
  {
    id: "gl-m07-cade",
    term: "CADE",
    unit: "Instituições e natureza jurídica",
    definition:
      "Conselho Administrativo de Defesa Econômica. Autarquia federal vinculada ao Ministério da Justiça e Segurança Pública, integrante do sistema de defesa da concorrência.",
    aulaIds: ["aula-07-06"],
  },
  {
    id: "gl-m07-autarquia-sob-regime-especial",
    term: "Autarquia sob regime especial",
    unit: "Instituições e natureza jurídica",
    definition:
      "Entidade da administração indireta com autonomia decisória reforçada, dirigentes de mandato fixo e ausência de subordinação hierárquica quanto ao mérito de seus atos.",
    aulaIds: [],
  },
  {
    id: "gl-m07-empresa-publica",
    term: "Empresa pública",
    unit: "Instituições e natureza jurídica",
    definition:
      "Entidade de direito privado integralmente controlada pelo poder público, com atuação limitada à finalidade legal que a criou.",
    aulaIds: [],
  },
  {
    id: "gl-m07-associacao-civil-sem-fins-lucrativos",
    term: "Associação civil sem fins lucrativos",
    unit: "Instituições e natureza jurídica",
    definition:
      "Pessoa jurídica de direito privado constituída pela união de associados para finalidade comum, sem distribuição de resultado. Natureza jurídica do operador e da câmara de comercialização.",
    aulaIds: [],
  },
  {
    id: "gl-m07-vinculacao",
    term: "Vinculação",
    unit: "Instituições e natureza jurídica",
    definition:
      "Relação administrativa entre entidade da administração indireta e o ministério de sua área. <strong>Não é subordinação:</strong> não autoriza o ministério a decidir o mérito de ato de agência.",
    aulaIds: [],
  },
  {
    id: "gl-m07-membro-associado-e-membro-participante",
    term: "Membro associado e membro participante",
    unit: "Instituições e natureza jurídica",
    definition:
      "Categorias de integrantes do operador — geradores, transmissores, distribuidores, consumidores livres, importadores e exportadores —, além do ministério e de representantes de conselhos de consumidores.",
    aulaIds: [],
  },
  {
    id: "gl-m07-convencao-de-comercializacao",
    term: "Convenção de Comercialização",
    unit: "Instituições e natureza jurídica",
    definition:
      "Instrumento que disciplina a organização e o funcionamento da câmara de comercialização, aprovado por ato regulatório.",
    aulaIds: [],
  },
  {
    id: "gl-m07-estatuto-social",
    term: "Estatuto social",
    unit: "Instituições e natureza jurídica",
    definition:
      "Documento constitutivo de entidade privada. No caso da câmara, é homologado pela agência, o que o torna simultaneamente ato privado e condição regulatória.",
    aulaIds: [],
  },
  {
    id: "gl-m07-secretaria-executiva-de-colegiado",
    term: "Secretaria-executiva de colegiado",
    unit: "Instituições e natureza jurídica",
    definition:
      "Unidade que organiza pauta, documentos e acompanhamento de um conselho ou comitê. No comitê de monitoramento, é exercida pela secretaria nacional de energia elétrica.",
    aulaIds: [],
  },
  {
    id: "gl-m07-lei",
    term: "Lei",
    unit: "Instrumentos jurídicos e atos",
    definition:
      "Norma aprovada pelo Poder Legislativo e sancionada. Cria competência, institui entidade e define regime. É o instrumento mais lento e o único que pode criar obrigação nova sem fundamento anterior.",
    aulaIds: [],
  },
  {
    id: "gl-m07-decreto",
    term: "Decreto",
    unit: "Instrumentos jurídicos e atos",
    definition:
      "Ato do Presidente da República. Regulamenta lei e define estrutura regimental de órgãos. É por decreto que a organização interna do ministério muda.",
    aulaIds: [],
  },
  {
    id: "gl-m07-medida-provisoria",
    term: "Medida provisória",
    unit: "Instrumentos jurídicos e atos",
    definition:
      "Ato com força de lei editado pelo Executivo em hipóteses constitucionais, submetido à deliberação do Congresso em prazo próprio.",
    aulaIds: [],
  },
  {
    id: "gl-m07-resolucao-cnpe",
    term: "Resolução CNPE",
    unit: "Instrumentos jurídicos e atos",
    definition:
      "Ato que formaliza diretriz ou decisão estratégica do conselho de política energética. Densidade normativa baixa, alcance estratégico alto.",
    aulaIds: [],
  },
  {
    id: "gl-m07-portaria-normativa",
    term: "Portaria normativa",
    unit: "Instrumentos jurídicos e atos",
    definition:
      "Ato ministerial de caráter geral que estabelece regras ou diretrizes no âmbito da competência do ministro.",
    aulaIds: [],
  },
  {
    id: "gl-m07-portaria-ordinaria",
    term: "Portaria ordinária",
    unit: "Instrumentos jurídicos e atos",
    definition:
      "Ato ministerial de objeto específico — outorga, designação, aprovação de documento, providência delimitada.",
    aulaIds: [],
  },
  {
    id: "gl-m07-ren-resolucao-normativa",
    term: "REN — Resolução Normativa",
    unit: "Instrumentos jurídicos e atos",
    definition:
      "Ato regulatório geral e abstrato da agência, aplicável a classes de agentes e de situações.",
    aulaIds: [],
  },
  {
    id: "gl-m07-reh-resolucao-homologatoria",
    term: "REH — Resolução Homologatória",
    unit: "Instrumentos jurídicos e atos",
    definition:
      "Ato regulatório concreto que homologa resultado de processo instruído. É o instrumento típico de tarifa e reajuste.",
    aulaIds: [],
  },
  {
    id: "gl-m07-rea-resolucao-autorizativa",
    term: "REA — Resolução Autorizativa",
    unit: "Instrumentos jurídicos e atos",
    definition:
      "Ato regulatório concreto e individual de outorga, autorização, transferência ou alteração de característica.",
    aulaIds: [],
  },
  {
    id: "gl-m07-despacho",
    term: "Despacho",
    unit: "Instrumentos jurídicos e atos",
    definition:
      "Ato de menor densidade normativa, de execução ou de trâmite, frequentemente usado para aprovar versão vigente de documento operacional.",
    aulaIds: [],
  },
  {
    id: "gl-m07-edital-de-leilao",
    term: "Edital de leilão",
    unit: "Instrumentos jurídicos e atos",
    definition:
      "Instrumento que estabelece as regras do processo competitivo: produtos, garantias, habilitação, cronograma, penalidades e contrato anexo.",
    aulaIds: [],
  },
  {
    id: "gl-m07-contrato-de-concessao",
    term: "Contrato de concessão",
    unit: "Instrumentos jurídicos e atos",
    definition:
      "Instrumento de longo prazo entre poder concedente e concessionária, com obrigações de qualidade, investimento, revisão, penalidade, extinção e alocação de risco. Contém a data contratual do ciclo tarifário.",
    aulaIds: [],
  },
  {
    id: "gl-m07-procedimentos-de-rede",
    term: "Procedimentos de Rede",
    unit: "Instrumentos jurídicos e atos",
    definition:
      "Conjunto modular de regras técnicas de coordenação, planejamento, programação, operação, integração e avaliação do sistema. <strong>Propostos pelo operador, aprovados pela agência.</strong>",
    aulaIds: ["aula-07-04"],
  },
  {
    id: "gl-m07-regras-de-comercializacao",
    term: "Regras de Comercialização",
    unit: "Instrumentos jurídicos e atos",
    definition:
      "Cadernos com a formulação algébrica aplicada na apuração comercial. Cada versão vigente está vinculada a um ato regulatório.",
    aulaIds: [],
  },
  {
    id: "gl-m07-procedimentos-de-comercializacao",
    term: "Procedimentos de Comercialização",
    unit: "Instrumentos jurídicos e atos",
    definition:
      "Documentos que descrevem responsabilidades, prazos e passos operacionais dos processos da câmara.",
    aulaIds: [],
  },
  {
    id: "gl-m07-ementa",
    term: "Ementa",
    unit: "Instrumentos jurídicos e atos",
    definition:
      "Frase inicial de um ato normativo que enuncia seu objeto. Primeiro campo a ler, sempre.",
    aulaIds: [],
  },
  {
    id: "gl-m07-vigencia",
    term: "Vigência",
    unit: "Instrumentos jurídicos e atos",
    definition:
      "Data a partir da qual o ato produz efeito. Distinta da data de publicação — e a distinção é fonte recorrente de erro de análise.",
    aulaIds: [],
  },
  {
    id: "gl-m07-diretoria-colegiada",
    term: "Diretoria colegiada",
    unit: "Rito, processo e participação",
    definition:
      "Órgão máximo de decisão da agência, composto por cinco diretores, um deles diretor-geral, com deliberação em reunião pública.",
    aulaIds: ["aula-07-03"],
  },
  {
    id: "gl-m07-mandato-fixo-escalonado",
    term: "Mandato fixo escalonado",
    unit: "Rito, processo e participação",
    definition:
      "Desenho em que os mandatos dos dirigentes não coincidem, de modo que a composição atravesse ciclos políticos.",
    aulaIds: [],
  },
  {
    id: "gl-m07-sabatina",
    term: "Sabatina",
    unit: "Rito, processo e participação",
    definition:
      "Arguição e aprovação prévia pelo Senado Federal de indicados a dirigente de agência reguladora.",
    aulaIds: [],
  },
  {
    id: "gl-m07-relator",
    term: "Relator",
    unit: "Rito, processo e participação",
    definition:
      "Diretor designado para instruir e apresentar voto em um processo submetido ao colegiado.",
    aulaIds: ["aula-07-03"],
  },
  {
    id: "gl-m07-voto",
    term: "Voto",
    unit: "Rito, processo e participação",
    definition:
      "Peça em que o relator expõe fundamentação e conclusão. É onde estão as premissas que interessam a quem vai modelar ou contestar.",
    aulaIds: ["aula-07-03"],
  },
  {
    id: "gl-m07-voto-vencido",
    term: "Voto vencido",
    unit: "Rito, processo e participação",
    definition:
      "Posição divergente registrada na deliberação. Insumo relevante de litígio e de crítica técnica.",
    aulaIds: [],
  },
  {
    id: "gl-m07-dispositivo",
    term: "Dispositivo",
    unit: "Rito, processo e participação",
    definition:
      "Parte do ato que produz efeito jurídico. A fundamentação explica; o dispositivo decide.",
    aulaIds: [],
  },
  {
    id: "gl-m07-reuniao-publica-ordinaria",
    term: "Reunião pública ordinária",
    unit: "Rito, processo e participação",
    definition:
      "Sessão do colegiado em que processos são deliberados, com calendário divulgado previamente.",
    aulaIds: [],
  },
  {
    id: "gl-m07-tomada-de-subsidios",
    term: "Tomada de subsídios",
    unit: "Rito, processo e participação",
    definition:
      "Instrumento de participação em fase precoce, antes de existir minuta. Maior alavancagem e menor disputa.",
    aulaIds: [],
  },
  {
    id: "gl-m07-consulta-publica",
    term: "Consulta pública",
    unit: "Rito, processo e participação",
    definition:
      "Procedimento de recebimento de contribuições documentais sobre minuta de norma, edital, contrato ou metodologia, com prazo definido.",
    aulaIds: [],
  },
  {
    id: "gl-m07-audiencia-publica",
    term: "Audiência pública",
    unit: "Rito, processo e participação",
    definition:
      "Sessão de manifestação oral, presencial ou remota, eventualmente combinada com consulta.",
    aulaIds: [],
  },
  {
    id: "gl-m07-air-analise-de-impacto-regulatorio",
    term: "AIR — Análise de Impacto Regulatório",
    unit: "Rito, processo e participação",
    definition:
      "Documento que expõe o problema regulatório, as alternativas consideradas e descartadas e os efeitos esperados da opção adotada.",
    aulaIds: [],
  },
  {
    id: "gl-m07-nota-tecnica",
    term: "Nota técnica",
    unit: "Rito, processo e participação",
    definition:
      "Peça da área técnica que fundamenta a proposta. É o documento a baixar antes da notícia e antes da própria minuta.",
    aulaIds: [],
  },
  {
    id: "gl-m07-relatorio-de-analise-das-contribuicoes",
    term: "Relatório de análise das contribuições",
    unit: "Rito, processo e participação",
    definition:
      "Documento em que o regulador responde às contribuições recebidas. Permite verificar se e por que uma contribuição foi acolhida.",
    aulaIds: [],
  },
  {
    id: "gl-m07-janela-de-influencia",
    term: "Janela de influência",
    unit: "Rito, processo e participação",
    definition:
      "Período em que o texto de um ato ainda pode ser alterado por contribuição externa documentada — tipicamente a soma da tomada de subsídios com a consulta pública.",
    aulaIds: [],
  },
  {
    id: "gl-m07-planejamento-indicativo",
    term: "Planejamento indicativo",
    unit: "Planejamento e seus produtos",
    definition:
      "Orientação que aponta necessidade e alternativa sem criar obrigação de investir, autorizar ou contratar.",
    aulaIds: [],
  },
  {
    id: "gl-m07-planejamento-determinativo",
    term: "Planejamento determinativo",
    unit: "Planejamento e seus produtos",
    definition:
      "Modelo em que o plano define o que será construído e por quem. Regime anterior ao desenho vigente, tratado no Módulo 06.",
    aulaIds: [],
  },
  {
    id: "gl-m07-pde-plano-decenal-de-expansao-de-energia",
    term: "PDE — Plano Decenal de Expansão de Energia",
    unit: "Planejamento e seus produtos",
    definition:
      "Estudo de horizonte de dez anos, ciclo anual, com consulta pública e aprovação por portaria ministerial ao final.",
    aulaIds: [],
  },
  {
    id: "gl-m07-ben-balanco-energetico-nacional",
    term: "BEN — Balanço Energético Nacional",
    unit: "Planejamento e seus produtos",
    definition:
      "Contabilidade energética anual do ano-base anterior, com série histórica longa. Contabiliza o passado; não projeta.",
    aulaIds: [],
  },
  {
    id: "gl-m07-pne-plano-nacional-de-energia",
    term: "PNE — Plano Nacional de Energia",
    unit: "Planejamento e seus produtos",
    definition:
      "Estudo prospectivo de longuíssimo prazo, publicado por cadernos, com cenários alternativos.",
    aulaIds: [],
  },
  {
    id: "gl-m07-caderno",
    term: "Caderno",
    unit: "Planejamento e seus produtos",
    definition:
      "Unidade de publicação dos planos, por tema — premissas, cenários, recursos, meio ambiente, consolidação de resultados.",
    aulaIds: [],
  },
  {
    id: "gl-m07-cenario-de-referencia",
    term: "Cenário de referência",
    unit: "Planejamento e seus produtos",
    definition:
      "Conjunto central de premissas usado como base de projeção. Não é previsão nem compromisso.",
    aulaIds: [],
  },
  {
    id: "gl-m07-sensibilidade",
    term: "Sensibilidade",
    unit: "Planejamento e seus produtos",
    definition:
      "Teste de como o resultado muda quando uma premissa varia. Existir sensibilidade e não usá-la é desperdício de informação.",
    aulaIds: [],
  },
  {
    id: "gl-m07-ano-base",
    term: "Ano-base",
    unit: "Planejamento e seus produtos",
    definition:
      "Ano de referência dos dados de um estudo, frequentemente anterior ao ano de publicação.",
    aulaIds: [],
  },
  {
    id: "gl-m07-data-de-corte",
    term: "Data de corte",
    unit: "Planejamento e seus produtos",
    definition:
      "Data até a qual a informação foi considerada no estudo. Determina o que o documento não pode saber.",
    aulaIds: [],
  },
  {
    id: "gl-m07-habilitacao-tecnica",
    term: "Habilitação técnica",
    unit: "Planejamento e seus produtos",
    definition:
      "Verificação, pela empresa de planejamento, dos requisitos mínimos de projeto para participação em leilão. Projeto não habilitado não participa.",
    aulaIds: [],
  },
  {
    id: "gl-m07-margem-de-escoamento",
    term: "Margem de escoamento",
    unit: "Planejamento e seus produtos",
    definition:
      "Capacidade disponível da rede para conexão e transporte de nova geração, no contexto de certame.",
    aulaIds: [],
  },
  {
    id: "gl-m07-estudos-de-expansao-da-transmissao",
    term: "Estudos de expansão da transmissão",
    unit: "Planejamento e seus produtos",
    definition:
      "Conjunto de relatórios que caracterizam obras, alternativas, custos, cronogramas e questões socioambientais da rede.",
    aulaIds: [],
  },
  {
    id: "gl-m07-plano-de-transicao-energetica",
    term: "Plano de transição energética",
    unit: "Planejamento e seus produtos",
    definition:
      "Instrumento que organiza ações de política de transição em roteiro operacional com ciclos de implementação, apoiado nos cenários de longo prazo.",
    aulaIds: [],
  },
  {
    id: "gl-m07-sin",
    term: "SIN",
    unit: "Operação: centros, produtos e modelos",
    definition:
      "Sistema Interligado Nacional. Conjunto de instalações de geração e transmissão coordenadas de forma integrada.",
    aulaIds: [],
  },
  {
    id: "gl-m07-sistemas-isolados",
    term: "Sistemas isolados",
    unit: "Operação: centros, produtos e modelos",
    definition:
      "Sistemas não conectados ao sistema interligado, cuja operação é objeto de planejamento próprio.",
    aulaIds: [],
  },
  {
    id: "gl-m07-cnos",
    term: "CNOS",
    unit: "Operação: centros, produtos e modelos",
    definition:
      "Centro Nacional de Operação do Sistema. Instância nacional de coordenação da operação.",
    aulaIds: [],
  },
  {
    id: "gl-m07-cosr",
    term: "COSR",
    unit: "Operação: centros, produtos e modelos",
    definition:
      "Centro de Operação do Sistema Regional. Instâncias regionais que operam as áreas do sistema.",
    aulaIds: [],
  },
  {
    id: "gl-m07-pmo",
    term: "PMO",
    unit: "Operação: centros, produtos e modelos",
    definition:
      "Programa Mensal de Operação Energética. Produto mensal com revisões semanais que estabelece políticas e metas de operação para o mês.",
    aulaIds: ["aula-07-04"],
  },
  {
    id: "gl-m07-revisao-semanal",
    term: "Revisão semanal",
    unit: "Operação: centros, produtos e modelos",
    definition:
      "Atualização do programa mensal ao longo do mês. Evento de cadência fixa e baixo monitoramento externo.",
    aulaIds: [],
  },
  {
    id: "gl-m07-pdo",
    term: "PDO",
    unit: "Operação: centros, produtos e modelos",
    definition:
      "Designação corrente para o conjunto de programação e produtos diários da operação. Nos documentos oficiais aparece como programação diária da operação eletroenergética.",
    aulaIds: [],
  },
  {
    id: "gl-m07-pre-operacao",
    term: "Pré-operação",
    unit: "Operação: centros, produtos e modelos",
    definition:
      "Etapa de preparação imediatamente anterior ao tempo real.",
    aulaIds: [],
  },
  {
    id: "gl-m07-tempo-real",
    term: "Tempo real",
    unit: "Operação: centros, produtos e modelos",
    definition:
      "Operação efetiva do sistema, com comandos, coordenação e tratamento de contingência.",
    aulaIds: [],
  },
  {
    id: "gl-m07-pos-operacao",
    term: "Pós-operação",
    unit: "Operação: centros, produtos e modelos",
    definition:
      "Apuração e análise do desempenho realizado, com revisão de dados e relatórios de ocorrência.",
    aulaIds: [],
  },
  {
    id: "gl-m07-newave",
    term: "NEWAVE",
    unit: "Operação: centros, produtos e modelos",
    definition:
      "Modelo de otimização de médio prazo, com representação de incerteza hidrológica e cálculo de funções de custo futuro.",
    aulaIds: [],
  },
  {
    id: "gl-m07-decomp",
    term: "DECOMP",
    unit: "Operação: centros, produtos e modelos",
    definition:
      "Modelo de curto prazo que detalha as semanas do mês, acoplando a política de médio prazo a maior detalhamento de usinas e restrições.",
    aulaIds: [],
  },
  {
    id: "gl-m07-dessem",
    term: "DESSEM",
    unit: "Operação: centros, produtos e modelos",
    definition:
      "Modelo de curtíssimo prazo com discretização intradiária e acionamento de unidades.",
    aulaIds: [],
  },
  {
    id: "gl-m07-funcao-de-custo-futuro",
    term: "Função de custo futuro",
    unit: "Operação: centros, produtos e modelos",
    definition:
      "Resultado que um modelo de horizonte mais longo entrega ao seguinte como condição de contorno.",
    aulaIds: [],
  },
  {
    id: "gl-m07-intercambio",
    term: "Intercâmbio",
    unit: "Operação: centros, produtos e modelos",
    definition:
      "Fluxo de energia entre subsistemas.",
    aulaIds: [],
  },
  {
    id: "gl-m07-restricao-eletrica",
    term: "Restrição elétrica",
    unit: "Operação: centros, produtos e modelos",
    definition:
      "Limite de rede ou de segurança que impede o despacho puramente econômico.",
    aulaIds: [],
  },
  {
    id: "gl-m07-reserva-operativa",
    term: "Reserva operativa",
    unit: "Operação: centros, produtos e modelos",
    definition:
      "Capacidade mantida disponível para responder a desvios e contingências.",
    aulaIds: [],
  },
  {
    id: "gl-m07-parecer-de-acesso",
    term: "Parecer de acesso",
    unit: "Operação: centros, produtos e modelos",
    definition:
      "Documento que avalia condições de conexão e uso da rede para uma instalação nova.",
    aulaIds: [],
  },
  {
    id: "gl-m07-mcp",
    term: "MCP",
    unit: "Comercialização: contabilização, contratos e sistemas",
    definition:
      "Mercado de Curto Prazo. Mecanismo de acerto das diferenças entre posição contratada e posição verificada — não é bolsa de toda a energia.",
    aulaIds: [],
  },
  {
    id: "gl-m07-pld",
    term: "PLD",
    unit: "Comercialização: contabilização, contratos e sistemas",
    definition:
      "Preço de Liquidação das Diferenças. Preço calculado e publicado pela câmara conforme metodologia e limites aprovados por ato regulatório.",
    aulaIds: [],
  },
  {
    id: "gl-m07-contabilizacao",
    term: "Contabilização",
    unit: "Comercialização: contabilização, contratos e sistemas",
    definition:
      "Aplicação das regras vigentes para apurar posições energéticas e financeiras de cada agente em cada período.",
    aulaIds: ["aula-07-05"],
  },
  {
    id: "gl-m07-liquidacao-financeira",
    term: "Liquidação financeira",
    unit: "Comercialização: contabilização, contratos e sistemas",
    definition:
      "Execução do fluxo financeiro das obrigações apuradas, de forma multilateral.",
    aulaIds: [],
  },
  {
    id: "gl-m07-liquidacao-multilateral",
    term: "Liquidação multilateral",
    unit: "Comercialização: contabilização, contratos e sistemas",
    definition:
      "Modelo em que a câmara apura obrigações e coordena o fluxo, sem transformar cada credor em cobrador de cada devedor.",
    aulaIds: [],
  },
  {
    id: "gl-m07-rateio",
    term: "Rateio",
    unit: "Comercialização: contabilização, contratos e sistemas",
    definition:
      "Distribuição proporcional do valor faltante entre credores quando o recurso aportado é insuficiente. Propriedade estrutural da liquidação multilateral.",
    aulaIds: [],
  },
  {
    id: "gl-m07-garantia-financeira",
    term: "Garantia financeira",
    unit: "Comercialização: contabilização, contratos e sistemas",
    definition:
      "Aporte exigido de agentes com posição devedora, segundo procedimento e cronograma próprios.",
    aulaIds: ["aula-07-05"],
  },
  {
    id: "gl-m07-recontabilizacao",
    term: "Recontabilização",
    unit: "Comercialização: contabilização, contratos e sistemas",
    definition:
      "Reprocessamento excepcional de período já contabilizado, sob condições previstas em regra.",
    aulaIds: [],
  },
  {
    id: "gl-m07-contestacao",
    term: "Contestação",
    unit: "Comercialização: contabilização, contratos e sistemas",
    definition:
      "Manifestação formal contra resultado preliminar de contabilização, dentro de prazo definido.",
    aulaIds: [],
  },
  {
    id: "gl-m07-exposicao",
    term: "Exposição",
    unit: "Comercialização: contabilização, contratos e sistemas",
    definition:
      "Diferença não coberta por contrato, sujeita a valoração ao preço de curto prazo.",
    aulaIds: [],
  },
  {
    id: "gl-m07-garantia-fisica",
    term: "Garantia física",
    unit: "Comercialização: contabilização, contratos e sistemas",
    definition:
      "Quantidade atribuída a um empreendimento conforme metodologia, usada como lastro e referência de contratação.",
    aulaIds: [],
  },
  {
    id: "gl-m07-mre",
    term: "MRE",
    unit: "Comercialização: contabilização, contratos e sistemas",
    definition:
      "Mecanismo de Realocação de Energia. Compartilha a energia produzida entre hidrelétricas participantes, porque o despacho é sistêmico e a usina individual não controla a própria geração.",
    aulaIds: ["aula-07-05"],
  },
  {
    id: "gl-m07-gsf",
    term: "GSF",
    unit: "Comercialização: contabilização, contratos e sistemas",
    definition:
      "Fator que expressa a geração do conjunto participante do mecanismo em relação à garantia física ajustada. Quando abaixo da unidade, gera exposição alocada conforme regra.",
    aulaIds: [],
  },
  {
    id: "gl-m07-ccear",
    term: "CCEAR",
    unit: "Comercialização: contabilização, contratos e sistemas",
    definition:
      "Contrato de Comercialização de Energia no Ambiente Regulado, por quantidade ou por disponibilidade, com preço e condições do certame.",
    aulaIds: [],
  },
  {
    id: "gl-m07-cceal",
    term: "CCEAL",
    unit: "Comercialização: contabilização, contratos e sistemas",
    definition:
      "Contrato de Comercialização de Energia no Ambiente Livre, com preço e condições livremente negociados entre as partes.",
    aulaIds: [],
  },
  {
    id: "gl-m07-ccen",
    term: "CCEN",
    unit: "Comercialização: contabilização, contratos e sistemas",
    definition:
      "Contrato de Cotas de Energia Nuclear. Alocação regulada da energia nuclear conforme regras.",
    aulaIds: [],
  },
  {
    id: "gl-m07-ccgf",
    term: "CCGF",
    unit: "Comercialização: contabilização, contratos e sistemas",
    definition:
      "Contrato de Cotas de Garantia Física, associado ao regime de cotas.",
    aulaIds: [],
  },
  {
    id: "gl-m07-cer",
    term: "CER",
    unit: "Comercialização: contabilização, contratos e sistemas",
    definition:
      "Contrato de Energia de Reserva, associado à contratação de reserva.",
    aulaIds: [],
  },
  {
    id: "gl-m07-crcap",
    term: "CRCAP",
    unit: "Comercialização: contabilização, contratos e sistemas",
    definition:
      "Contrato de Reserva de Capacidade, associado à contratação de capacidade.",
    aulaIds: [],
  },
  {
    id: "gl-m07-scde",
    term: "SCDE",
    unit: "Comercialização: contabilização, contratos e sistemas",
    definition:
      "Sistema de Coleta de Dados de Energia. Sistema por onde a medição entra na apuração comercial.",
    aulaIds: [],
  },
  {
    id: "gl-m07-modelagem",
    term: "Modelagem",
    unit: "Comercialização: contabilização, contratos e sistemas",
    definition:
      "Cadastro de unidade, ativo e perfil nos sistemas da câmara, condição para que medição e contrato produzam efeito na contabilização.",
    aulaIds: [],
  },
  {
    id: "gl-m07-varejista",
    term: "Varejista",
    unit: "Comercialização: contabilização, contratos e sistemas",
    definition:
      "Agente que representa consumidores ou geradores perante a câmara, assumindo a operação de mercado em nome do representado.",
    aulaIds: [],
  },
  {
    id: "gl-m07-proret",
    term: "PRORET",
    unit: "Regulação econômica, periferia e controle",
    definition:
      "Procedimentos de Regulação Tarifária. Organiza metodologias, conceitos e fórmulas dos processos tarifários. Responde <em>como se calcula e aloca receita</em>.",
    aulaIds: ["aula-07-03"],
  },
  {
    id: "gl-m07-prodist",
    term: "PRODIST",
    unit: "Regulação econômica, periferia e controle",
    definition:
      "Procedimentos de Distribuição de Energia Elétrica. Organiza requisitos técnicos e comerciais da distribuição. Responde <em>como a rede e a relação técnico-comercial funcionam</em>.",
    aulaIds: ["aula-07-03"],
  },
  {
    id: "gl-m07-rtp",
    term: "RTP",
    unit: "Regulação econômica, periferia e controle",
    definition:
      "Revisão Tarifária Periódica. Reposicionamento estrutural da receita, por concessão, em periodicidade contratual.",
    aulaIds: [],
  },
  {
    id: "gl-m07-rta",
    term: "RTA",
    unit: "Regulação econômica, periferia e controle",
    definition:
      "Reajuste Tarifário Anual. Atualização entre revisões, na data contratual da concessão.",
    aulaIds: [],
  },
  {
    id: "gl-m07-revisao-extraordinaria",
    term: "Revisão extraordinária",
    unit: "Regulação econômica, periferia e controle",
    definition:
      "Processo fora do ciclo, para eventos que rompam o equilíbrio econômico-financeiro do contrato.",
    aulaIds: [],
  },
  {
    id: "gl-m07-ouvidoria-setorial",
    term: "Ouvidoria setorial",
    unit: "Regulação econômica, periferia e controle",
    definition:
      "Canal da agência para intermediação entre consumidor e distribuidora, cujas solicitações também alimentam fiscalização e produção normativa.",
    aulaIds: [],
  },
  {
    id: "gl-m07-agencia-estadual-conveniada",
    term: "Agência estadual conveniada",
    unit: "Regulação econômica, periferia e controle",
    definition:
      "Entidade estadual que executa fiscalização e atendimento ao consumidor mediante convênio com a agência federal. Degrau frequentemente ignorado da escada de reclamação.",
    aulaIds: [],
  },
  {
    id: "gl-m07-mediacao-administrativa",
    term: "Mediação administrativa",
    unit: "Regulação econômica, periferia e controle",
    definition:
      "Procedimento de solução de divergência entre agentes, e entre agentes e consumidores, no âmbito da agência.",
    aulaIds: [],
  },
  {
    id: "gl-m07-bndes",
    term: "BNDES",
    unit: "Regulação econômica, periferia e controle",
    definition:
      "Banco Nacional de Desenvolvimento Econômico e Social. Instituição financeira pública de longo prazo que estrutura financiamento de infraestrutura energética.",
    aulaIds: [],
  },
  {
    id: "gl-m07-ibama",
    term: "IBAMA",
    unit: "Regulação econômica, periferia e controle",
    definition:
      "Instituto Brasileiro do Meio Ambiente e dos Recursos Naturais Renováveis. Autoridade ambiental federal; a competência para licenciar depende de critérios legais e pode ser estadual ou municipal.",
    aulaIds: [],
  },
  {
    id: "gl-m07-lp-li-e-lo",
    term: "LP, LI e LO",
    unit: "Regulação econômica, periferia e controle",
    definition:
      "Licença Prévia, de Instalação e de Operação. Etapas sucessivas do licenciamento ambiental, com condicionantes cumulativas.",
    aulaIds: [],
  },
  {
    id: "gl-m07-ana",
    term: "ANA",
    unit: "Regulação econômica, periferia e controle",
    definition:
      "Agência Nacional de Águas e Saneamento Básico. Regula o uso de recursos hídricos de domínio da União.",
    aulaIds: [],
  },
  {
    id: "gl-m07-drdh",
    term: "DRDH",
    unit: "Regulação econômica, periferia e controle",
    definition:
      "Declaração de Reserva de Disponibilidade Hídrica. Antecede a licitação ou autorização de aproveitamento hidrelétrico e depois se converte em outorga de direito de uso ao titular.",
    aulaIds: [],
  },
  {
    id: "gl-m07-tcu",
    term: "TCU",
    unit: "Regulação econômica, periferia e controle",
    definition:
      "Tribunal de Contas da União. Órgão de controle externo que audita legalidade, economicidade e governança de processos públicos, inclusive certames do setor.",
    aulaIds: [],
  },
  {
    id: "gl-m07-anp",
    term: "ANP",
    unit: "Regulação econômica, periferia e controle",
    definition:
      "Agência Nacional do Petróleo, Gás Natural e Biocombustíveis. Regula a cadeia federal de combustíveis, relevante à térmica pela via do insumo. Integra o comitê de monitoramento.",
    aulaIds: [],
  },
  {
    id: "gl-m07-ato-de-concentracao",
    term: "Ato de concentração",
    unit: "Regulação econômica, periferia e controle",
    definition:
      "Fusão, aquisição, incorporação ou associação sujeita à análise concorrencial quando preenchidos os critérios legais de notificação. Consumar antes da aprovação obrigatória é <em>gun jumping</em>.",
    aulaIds: [],
  },

  // ── Modulo 08 (Wave 34) ──────────────────────────────
  {
    id: "gl-m08-capacidade-instalada",
    term: "Capacidade instalada",
    unit: "Grandezas, unidades e universos",
    definition:
      "Potência nominal agregada dos equipamentos aptos a gerar, medida em MW ou GW numa data de referência. É estoque, não fluxo.",
    aulaIds: [],
  },
  {
    id: "gl-m08-capacidade-fiscalizada",
    term: "Capacidade fiscalizada",
    unit: "Grandezas, unidades e universos",
    definition:
      "Potência efetivamente verificada e registrada pela agência reguladora, que pode divergir da outorgada.",
    aulaIds: [],
  },
  {
    id: "gl-m08-capacidade-outorgada",
    term: "Capacidade outorgada",
    unit: "Grandezas, unidades e universos",
    definition:
      "Potência autorizada no ato de outorga, que precede e frequentemente excede a capacidade em operação.",
    aulaIds: [],
  },
  {
    id: "gl-m08-geracao-efetiva",
    term: "Geração efetiva",
    unit: "Grandezas, unidades e universos",
    definition:
      "Energia produzida e medida ao longo de um período, expressa em MWh, GWh ou TWh.",
    aulaIds: [],
  },
  {
    id: "gl-m08-geracao-bruta",
    term: "Geração bruta",
    unit: "Grandezas, unidades e universos",
    definition:
      "Energia produzida nos terminais do gerador, antes do consumo de serviços auxiliares da própria usina.",
    aulaIds: [],
  },
  {
    id: "gl-m08-geracao-liquida",
    term: "Geração líquida",
    unit: "Grandezas, unidades e universos",
    definition:
      "Geração bruta menos o consumo interno da usina em bombas, ventiladores e sistemas de controle.",
    aulaIds: [],
  },
  {
    id: "gl-m08-mw",
    term: "MW",
    unit: "Grandezas, unidades e universos",
    definition:
      "Megawatt. Unidade de potência — mede capacidade de entrega instantânea.",
    aulaIds: [],
  },
  {
    id: "gl-m08-mwh",
    term: "MWh",
    unit: "Grandezas, unidades e universos",
    definition:
      "Megawatt-hora. Unidade de energia — mede quantidade acumulada num período.",
    aulaIds: [],
  },
  {
    id: "gl-m08-mwmed",
    term: "MWmed",
    unit: "Grandezas, unidades e universos",
    definition:
      "Megawatt médio. Energia do período dividida pelo número de horas do período; converte energia em potência equivalente constante.",
    aulaIds: [],
  },
  {
    id: "gl-m08-twh",
    term: "TWh",
    unit: "Grandezas, unidades e universos",
    definition:
      "Terawatt-hora. Um bilhão de quilowatt-hora; unidade padrão de geração anual nacional.",
    aulaIds: [],
  },
  {
    id: "gl-m08-gw",
    term: "GW",
    unit: "Grandezas, unidades e universos",
    definition:
      "Gigawatt. Mil megawatts; unidade padrão de capacidade instalada nacional.",
    aulaIds: [],
  },
  {
    id: "gl-m08-tep",
    term: "tep",
    unit: "Grandezas, unidades e universos",
    definition:
      "Tonelada equivalente de petróleo. Unidade da matriz energética, usada para somar fontes de naturezas diferentes.",
    aulaIds: [],
  },
  {
    id: "gl-m08-matriz-eletrica",
    term: "Matriz elétrica",
    unit: "Grandezas, unidades e universos",
    definition:
      "Composição da eletricidade gerada, importada e consumida no país, por fonte.",
    aulaIds: [],
  },
  {
    id: "gl-m08-matriz-energetica",
    term: "Matriz energética",
    unit: "Grandezas, unidades e universos",
    definition:
      "Composição de toda a energia usada na economia, incluindo combustíveis de transporte e calor industrial.",
    aulaIds: [],
  },
  {
    id: "gl-m08-oferta-interna-de-energia-eletrica",
    term: "Oferta interna de energia elétrica",
    unit: "Grandezas, unidades e universos",
    definition:
      "Toda a geração nacional somada ao saldo líquido de importação; é a base sobre a qual se calcula a renovabilidade elétrica.",
    aulaIds: [],
  },
  {
    id: "gl-m08-oferta-interna-de-energia",
    term: "Oferta interna de energia",
    unit: "Grandezas, unidades e universos",
    definition:
      "Equivalente para a matriz energética completa, expressa em tep.",
    aulaIds: [],
  },
  {
    id: "gl-m08-consumo-final",
    term: "Consumo final",
    unit: "Grandezas, unidades e universos",
    definition:
      "Energia efetivamente entregue ao uso, deduzidas perdas e consumo próprio do setor energético.",
    aulaIds: [],
  },
  {
    id: "gl-m08-recorte",
    term: "Recorte",
    unit: "Grandezas, unidades e universos",
    definition:
      "Conjunto formado por universo, data-base e método adotados numa estatística. É o eixo invisível de toda comparação numérica.",
    aulaIds: ["aula-08-01"],
  },
  {
    id: "gl-m08-fator-de-capacidade",
    term: "Fator de capacidade",
    unit: "Métricas de utilização e desempenho",
    definition:
      "Razão entre a geração verificada no período e a geração máxima teórica à potência nominal no mesmo período.",
    aulaIds: [],
  },
  {
    id: "gl-m08-fator-de-capacidade-potencial",
    term: "Fator de capacidade potencial",
    unit: "Métricas de utilização e desempenho",
    definition:
      "Mesmo cálculo, mas somando à geração verificada a geração frustrada por restrição; a diferença para o realizado mede a exposição a corte.",
    aulaIds: [],
  },
  {
    id: "gl-m08-fator-de-carga",
    term: "Fator de carga",
    unit: "Métricas de utilização e desempenho",
    definition:
      "Razão entre demanda média e demanda máxima de um consumidor ou de um sistema num período.",
    aulaIds: [],
  },
  {
    id: "gl-m08-disponibilidade",
    term: "Disponibilidade",
    unit: "Métricas de utilização e desempenho",
    definition:
      "Percentual do tempo ou da potência em que o equipamento estava tecnicamente apto a operar.",
    aulaIds: [],
  },
  {
    id: "gl-m08-indisponibilidade-programada",
    term: "Indisponibilidade programada",
    unit: "Métricas de utilização e desempenho",
    definition:
      "Parada prevista para manutenção ou reabastecimento.",
    aulaIds: [],
  },
  {
    id: "gl-m08-indisponibilidade-forcada",
    term: "Indisponibilidade forçada",
    unit: "Métricas de utilização e desempenho",
    definition:
      "Parada não prevista, por falha.",
    aulaIds: [],
  },
  {
    id: "gl-m08-despachabilidade",
    term: "Despachabilidade",
    unit: "Métricas de utilização e desempenho",
    definition:
      "Capacidade de alterar a geração quando solicitado, dentro dos limites de rampa e de operação.",
    aulaIds: [],
  },
  {
    id: "gl-m08-inflexibilidade",
    term: "Inflexibilidade",
    unit: "Métricas de utilização e desempenho",
    definition:
      "Condição contratual ou técnica que obriga uma usina a gerar independentemente da ordem econômica.",
    aulaIds: [],
  },
  {
    id: "gl-m08-flexibilidade",
    term: "Flexibilidade",
    unit: "Métricas de utilização e desempenho",
    definition:
      "Capacidade de alterar produção ou consumo em resposta à necessidade do sistema.",
    aulaIds: [],
  },
  {
    id: "gl-m08-rampa",
    term: "Rampa",
    unit: "Métricas de utilização e desempenho",
    definition:
      "Variação de potência por unidade de tempo exigida do conjunto de recursos.",
    aulaIds: ["aula-08-03"],
  },
  {
    id: "gl-m08-potencia-firme",
    term: "Potência firme",
    unit: "Métricas de utilização e desempenho",
    definition:
      "Contribuição confiável de um recurso ao atendimento nas horas críticas, sob determinado nível de confiança.",
    aulaIds: [],
  },
  {
    id: "gl-m08-garantia-fisica",
    term: "Garantia física",
    unit: "Métricas de utilização e desempenho",
    definition:
      "Parâmetro regulatório-comercial de contribuição de um empreendimento ao suprimento; não é promessa de geração anual.",
    aulaIds: [],
  },
  {
    id: "gl-m08-reserva",
    term: "Reserva",
    unit: "Métricas de utilização e desempenho",
    definition:
      "Capacidade mantida disponível para responder a desvio de previsão e a contingência.",
    aulaIds: [],
  },
  {
    id: "gl-m08-servicos-ancilares",
    term: "Serviços ancilares",
    unit: "Métricas de utilização e desempenho",
    definition:
      "Serviços prestados ao sistema além da energia — controle de frequência, controle de tensão, reserva e recomposição.",
    aulaIds: [],
  },
  {
    id: "gl-m08-intensidade-de-carbono",
    term: "Intensidade de carbono",
    unit: "Métricas de utilização e desempenho",
    definition:
      "Emissões associadas a cada unidade de energia elétrica gerada, tipicamente em kg de CO₂ equivalente por MWh.",
    aulaIds: [],
  },
  {
    id: "gl-m08-data-de-entrada-em-operacao-comercial",
    term: "Data de entrada em operação comercial",
    unit: "Métricas de utilização e desempenho",
    definition:
      "Marco a partir do qual a usina passa a operar comercialmente; determina o denominador correto do fator de capacidade anual.",
    aulaIds: [],
  },
  {
    id: "gl-m08-geracao-centralizada",
    term: "Geração centralizada",
    unit: "Fontes de geração no agregado",
    definition:
      "Usina de escala conectada à rede de transmissão ou de distribuição em instalação dedicada, sob relacionamento operacional com o operador.",
    aulaIds: [],
  },
  {
    id: "gl-m08-geracao-distribuida",
    term: "Geração distribuída",
    unit: "Fontes de geração no agregado",
    definition:
      "Geração conectada próxima à carga, sob regras específicas de conexão e compensação.",
    aulaIds: [],
  },
  {
    id: "gl-m08-micro-e-minigeracao-distribuida",
    term: "Micro e minigeração distribuída",
    unit: "Fontes de geração no agregado",
    definition:
      "Modalidade de geração distribuída de pequeno porte, conectada à rede de distribuição e não despachada centralmente.",
    aulaIds: [],
  },
  {
    id: "gl-m08-autoproducao",
    term: "Autoprodução",
    unit: "Fontes de geração no agregado",
    definition:
      "Geração para consumo próprio do produtor, no próprio sítio ou em empreendimento remoto.",
    aulaIds: [],
  },
  {
    id: "gl-m08-autoproducao-nao-injetada",
    term: "Autoprodução não injetada",
    unit: "Fontes de geração no agregado",
    definition:
      "Parcela da autoprodução consumida no local sem transitar pela rede; entra em alguns universos estatísticos e não em outros.",
    aulaIds: [],
  },
  {
    id: "gl-m08-cogeracao",
    term: "Cogeração",
    unit: "Fontes de geração no agregado",
    definition:
      "Produção conjunta de vapor e eletricidade a partir do mesmo processo, típica em sucroenergia e em papel e celulose.",
    aulaIds: [],
  },
  {
    id: "gl-m08-bioeletricidade",
    term: "Bioeletricidade",
    unit: "Fontes de geração no agregado",
    definition:
      "Eletricidade gerada a partir de biomassa; agregação que pode diferir da rubrica \"biomassa\" conforme a base estatística.",
    aulaIds: [],
  },
  {
    id: "gl-m08-bagaco-de-cana",
    term: "Bagaço de cana",
    unit: "Fontes de geração no agregado",
    definition:
      "Principal combustível da bioeletricidade brasileira, com disponibilidade atrelada à safra.",
    aulaIds: [],
  },
  {
    id: "gl-m08-licor-preto",
    term: "Licor preto",
    unit: "Fontes de geração no agregado",
    definition:
      "Subproduto da produção de celulose usado como combustível em cogeração industrial.",
    aulaIds: [],
  },
  {
    id: "gl-m08-ciclo-combinado",
    term: "Ciclo combinado",
    unit: "Fontes de geração no agregado",
    definition:
      "Arranjo termelétrico que aproveita o calor residual da turbina a gás; mais eficiente e mais adequado a operação prolongada.",
    aulaIds: [],
  },
  {
    id: "gl-m08-ciclo-simples",
    term: "Ciclo simples",
    unit: "Fontes de geração no agregado",
    definition:
      "Arranjo termelétrico de resposta mais rápida e menor eficiência, adequado a atendimento de ponta e rampa.",
    aulaIds: [],
  },
  {
    id: "gl-m08-usina-a-fio-d-agua",
    term: "Usina a fio d'água",
    unit: "Fontes de geração no agregado",
    definition:
      "Hidrelétrica com capacidade de armazenamento pequena em relação à vazão; gera conforme a afluência.",
    aulaIds: [],
  },
  {
    id: "gl-m08-usina-com-reservatorio",
    term: "Usina com reservatório",
    unit: "Fontes de geração no agregado",
    definition:
      "Hidrelétrica capaz de armazenar água e deslocar geração no tempo, entre horas, meses ou anos.",
    aulaIds: [],
  },
  {
    id: "gl-m08-pequena-central-hidreletrica",
    term: "Pequena central hidrelétrica",
    unit: "Fontes de geração no agregado",
    definition:
      "Empreendimento hidrelétrico de porte reduzido, com regime regulatório próprio.",
    aulaIds: [],
  },
  {
    id: "gl-m08-central-geradora-hidreletrica",
    term: "Central geradora hidrelétrica",
    unit: "Fontes de geração no agregado",
    definition:
      "Empreendimento hidrelétrico de porte ainda menor, com exigências simplificadas.",
    aulaIds: [],
  },
  {
    id: "gl-m08-repotenciacao",
    term: "Repotenciação",
    unit: "Fontes de geração no agregado",
    definition:
      "Aumento de capacidade de usina existente por substituição ou modernização de equipamento.",
    aulaIds: [],
  },
  {
    id: "gl-m08-sistema-de-armazenamento-em-baterias",
    term: "Sistema de armazenamento em baterias",
    unit: "Fontes de geração no agregado",
    definition:
      "Recurso de resposta rápida capaz de deslocar energia dentro do dia e prestar serviços ao sistema.",
    aulaIds: [],
  },
  {
    id: "gl-m08-bombeamento-reversivel",
    term: "Bombeamento reversível",
    unit: "Fontes de geração no agregado",
    definition:
      "Armazenamento hidráulico que eleva água para um reservatório superior em horas de excedente.",
    aulaIds: [],
  },
  {
    id: "gl-m08-energia-natural-afluente",
    term: "Energia natural afluente",
    unit: "Hidrologia e armazenamento",
    definition:
      "Conversão das vazões que chegam aos aproveitamentos em energia equivalente; é grandeza de fluxo.",
    aulaIds: [],
  },
  {
    id: "gl-m08-media-de-longo-termo",
    term: "Média de longo termo",
    unit: "Hidrologia e armazenamento",
    definition:
      "Valor histórico esperado da afluência para determinado mês e subsistema; é a régua contra a qual a afluência é lida.",
    aulaIds: [],
  },
  {
    id: "gl-m08-energia-armazenada",
    term: "Energia armazenada",
    unit: "Hidrologia e armazenamento",
    definition:
      "Equivalente energético da água disponível nos reservatórios; é grandeza de estoque.",
    aulaIds: [],
  },
  {
    id: "gl-m08-volume-util",
    term: "Volume útil",
    unit: "Hidrologia e armazenamento",
    definition:
      "Parcela operável do armazenamento de um reservatório, entre os níveis mínimo e máximo operativos.",
    aulaIds: [],
  },
  {
    id: "gl-m08-reservatorio-equivalente-de-energia",
    term: "Reservatório equivalente de energia",
    unit: "Hidrologia e armazenamento",
    definition:
      "Representação agregada dos reservatórios de um subsistema como um único estoque energético.",
    aulaIds: [],
  },
  {
    id: "gl-m08-periodo-umido",
    term: "Período úmido",
    unit: "Hidrologia e armazenamento",
    definition:
      "Estação de maiores afluências, variável por bacia; no Sudeste/Centro-Oeste vai tipicamente de novembro a abril.",
    aulaIds: [],
  },
  {
    id: "gl-m08-periodo-seco",
    term: "Período seco",
    unit: "Hidrologia e armazenamento",
    definition:
      "Estação de menores afluências, complementar ao período úmido da mesma bacia.",
    aulaIds: [],
  },
  {
    id: "gl-m08-deplecionamento",
    term: "Deplecionamento",
    unit: "Hidrologia e armazenamento",
    definition:
      "Redução do nível de armazenamento ao longo do tempo, típica do período seco.",
    aulaIds: [],
  },
  {
    id: "gl-m08-vazao-minima",
    term: "Vazão mínima",
    unit: "Hidrologia e armazenamento",
    definition:
      "Defluência obrigatória por licença ambiental, navegação ou abastecimento; é uma das origens do piso de geração.",
    aulaIds: [],
  },
  {
    id: "gl-m08-defluencia",
    term: "Defluência",
    unit: "Hidrologia e armazenamento",
    definition:
      "Vazão liberada por um aproveitamento, turbinada ou vertida.",
    aulaIds: [],
  },
  {
    id: "gl-m08-vertimento",
    term: "Vertimento",
    unit: "Hidrologia e armazenamento",
    definition:
      "Água liberada sem passar pela turbina; vertimento turbinável é energia perdida.",
    aulaIds: [],
  },
  {
    id: "gl-m08-uso-multiplo-da-agua",
    term: "Uso múltiplo da água",
    unit: "Hidrologia e armazenamento",
    definition:
      "Conjunto de finalidades concorrentes — abastecimento, irrigação, navegação, controle de cheia — que condicionam a operação hidrelétrica.",
    aulaIds: [],
  },
  {
    id: "gl-m08-diversidade-hidrologica",
    term: "Diversidade hidrológica",
    unit: "Hidrologia e armazenamento",
    definition:
      "Descorrelação entre regimes de bacias distantes, que a integração nacional existe para aproveitar.",
    aulaIds: [],
  },
  {
    id: "gl-m08-piso-de-geracao-hidraulica",
    term: "Piso de geração hidráulica",
    unit: "Hidrologia e armazenamento",
    definition:
      "Nível mínimo de geração hidrelétrica abaixo do qual o sistema não opera, por requisitos ambientais, elétricos e de máquina.",
    aulaIds: [],
  },
  {
    id: "gl-m08-mecanismo-de-realocacao-de-energia",
    term: "Mecanismo de realocação de energia",
    unit: "Hidrologia e armazenamento",
    definition:
      "Arranjo que compartilha a geração hidrelétrica entre participantes para reduzir a exposição à hidrologia individual.",
    aulaIds: [],
  },
  {
    id: "gl-m08-fator-de-ajuste-do-mecanismo",
    term: "Fator de ajuste do mecanismo",
    unit: "Hidrologia e armazenamento",
    definition:
      "Razão entre a geração agregada alocável e a garantia física do conjunto de participantes.",
    aulaIds: [],
  },
  {
    id: "gl-m08-sistema-interligado-nacional",
    term: "Sistema Interligado Nacional",
    unit: "Sistema, submercados e transmissão",
    definition:
      "Rede que integra geração e consumo da maior parte do território brasileiro sob operação coordenada.",
    aulaIds: [],
  },
  {
    id: "gl-m08-sistema-isolado",
    term: "Sistema isolado",
    unit: "Sistema, submercados e transmissão",
    definition:
      "Sistema elétrico não conectado ao sistema interligado, atendido por geração local.",
    aulaIds: [],
  },
  {
    id: "gl-m08-submercado",
    term: "Submercado",
    unit: "Sistema, submercados e transmissão",
    definition:
      "Zona de contabilização e de formação de preço delimitada por restrições estruturais de transmissão.",
    aulaIds: [],
  },
  {
    id: "gl-m08-subsistema",
    term: "Subsistema",
    unit: "Sistema, submercados e transmissão",
    definition:
      "Recorte elétrico usado na operação e no planejamento, definido por topologia; nem sempre coincide com submercado.",
    aulaIds: [],
  },
  {
    id: "gl-m08-rede-basica",
    term: "Rede Básica",
    unit: "Sistema, submercados e transmissão",
    definition:
      "Conjunto de instalações de transmissão de interesse sistêmico, conforme critérios de tensão e função definidos em regulação.",
    aulaIds: [],
  },
  {
    id: "gl-m08-rede-basica-de-fronteira",
    term: "Rede Básica de Fronteira",
    unit: "Sistema, submercados e transmissão",
    definition:
      "Instalações de transformação na interface entre a Rede Básica e as redes de distribuição.",
    aulaIds: [],
  },
  {
    id: "gl-m08-demais-instalacoes-de-transmissao",
    term: "Demais instalações de transmissão",
    unit: "Sistema, submercados e transmissão",
    definition:
      "Instalações de transmissão que não integram a Rede Básica e atendem interesse restrito.",
    aulaIds: [],
  },
  {
    id: "gl-m08-intercambio",
    term: "Intercâmbio",
    unit: "Sistema, submercados e transmissão",
    definition:
      "Fluxo líquido de potência entre subsistemas.",
    aulaIds: [],
  },
  {
    id: "gl-m08-limite-de-intercambio",
    term: "Limite de intercâmbio",
    unit: "Sistema, submercados e transmissão",
    definition:
      "Máximo fluxo admissível entre subsistemas sem violar critérios de segurança e estabilidade.",
    aulaIds: [],
  },
  {
    id: "gl-m08-limite-de-exportacao",
    term: "Limite de exportação",
    unit: "Sistema, submercados e transmissão",
    definition:
      "Restrição sobre o quanto uma região pode injetar no restante do sistema num dado instante.",
    aulaIds: [],
  },
  {
    id: "gl-m08-corrente-continua-em-alta-tensao",
    term: "Corrente contínua em alta tensão",
    unit: "Sistema, submercados e transmissão",
    definition:
      "Tecnologia de transmissão para grandes blocos a longa distância, com controle de fluxo e menor perda relativa.",
    aulaIds: [],
  },
  {
    id: "gl-m08-bipolo",
    term: "Bipolo",
    unit: "Sistema, submercados e transmissão",
    definition:
      "Arranjo de transmissão em corrente contínua com dois polos; sua perda é contingência de grande magnitude.",
    aulaIds: [],
  },
  {
    id: "gl-m08-estacao-conversora",
    term: "Estação conversora",
    unit: "Sistema, submercados e transmissão",
    definition:
      "Instalação que converte entre corrente alternada e contínua nas extremidades de um elo.",
    aulaIds: [],
  },
  {
    id: "gl-m08-compensador-sincrono",
    term: "Compensador síncrono",
    unit: "Sistema, submercados e transmissão",
    definition:
      "Equipamento rotativo que fornece suporte dinâmico de potência reativa e contribui para a estabilidade de tensão.",
    aulaIds: [],
  },
  {
    id: "gl-m08-estabilidade-de-tensao",
    term: "Estabilidade de tensão",
    unit: "Sistema, submercados e transmissão",
    definition:
      "Capacidade do sistema de manter tensões aceitáveis após distúrbio; fator limitante do escoamento em regiões com alta penetração de fontes conectadas por inversor.",
    aulaIds: [],
  },
  {
    id: "gl-m08-recurso-conectado-por-inversor",
    term: "Recurso conectado por inversor",
    unit: "Sistema, submercados e transmissão",
    definition:
      "Fonte cuja interface com a rede é eletrônica, e não uma máquina síncrona; altera o comportamento dinâmico do sistema.",
    aulaIds: [],
  },
  {
    id: "gl-m08-contingencia",
    term: "Contingência",
    unit: "Sistema, submercados e transmissão",
    definition:
      "Perda de um ou mais elementos da rede, contra a qual a operação é planejada.",
    aulaIds: [],
  },
  {
    id: "gl-m08-contrato-de-uso-do-sistema-de-transmissao",
    term: "Contrato de uso do sistema de transmissão",
    unit: "Sistema, submercados e transmissão",
    definition:
      "Instrumento que assegura ao agente o direito de uso da rede; sua assinatura é indicador de expansão provável.",
    aulaIds: [],
  },
  {
    id: "gl-m08-margem-de-conexao",
    term: "Margem de conexão",
    unit: "Sistema, submercados e transmissão",
    definition:
      "Capacidade remanescente para conectar nova geração ou nova carga num ponto da rede.",
    aulaIds: [],
  },
  {
    id: "gl-m08-leilao-de-transmissao",
    term: "Leilão de transmissão",
    unit: "Sistema, submercados e transmissão",
    definition:
      "Certame pelo qual se outorga a construção e operação de instalações, com receita anual permitida como variável de disputa.",
    aulaIds: [],
  },
  {
    id: "gl-m08-corte-de-geracao",
    term: "Corte de geração",
    unit: "Restrição de geração e operação horária",
    definition:
      "Redução, limitação ou interrupção determinada da produção de uma usina disponível.",
    aulaIds: [],
  },
  {
    id: "gl-m08-restricao-por-confiabilidade",
    term: "Restrição por confiabilidade",
    unit: "Restrição de geração e operação horária",
    definition:
      "Corte motivado por limite de carregamento, tensão, estabilidade ou contingência.",
    aulaIds: [],
  },
  {
    id: "gl-m08-restricao-por-razao-energetica",
    term: "Restrição por razão energética",
    unit: "Restrição de geração e operação horária",
    definition:
      "Corte motivado por oferta instantânea superior à carga somada aos pisos de geração; não se resolve com transmissão.",
    aulaIds: [],
  },
  {
    id: "gl-m08-indisponibilidade-externa",
    term: "Indisponibilidade externa",
    unit: "Restrição de geração e operação horária",
    definition:
      "Corte decorrente de falha ou manutenção em instalação necessária ao escoamento; é a categoria com mecanismo de ressarcimento definido.",
    aulaIds: [],
  },
  {
    id: "gl-m08-geracao-frustrada",
    term: "Geração frustrada",
    unit: "Restrição de geração e operação horária",
    definition:
      "Energia que a usina teria produzido e não produziu por determinação de corte.",
    aulaIds: [],
  },
  {
    id: "gl-m08-carga",
    term: "Carga",
    unit: "Restrição de geração e operação horária",
    definition:
      "Potência elétrica demandada pelo sistema ou por um consumidor num instante ou período.",
    aulaIds: ["aula-08-06"],
  },
  {
    id: "gl-m08-carga-liquida",
    term: "Carga líquida",
    unit: "Restrição de geração e operação horária",
    definition:
      "Carga observada pelo operador após subtração da geração que ele não comanda, sobretudo a distribuída.",
    aulaIds: ["aula-08-03"],
  },
  {
    id: "gl-m08-carga-supervisionada",
    term: "Carga supervisionada",
    unit: "Restrição de geração e operação horária",
    definition:
      "Demanda observada no escopo de supervisão do operador, distinta do consumo final da sociedade.",
    aulaIds: [],
  },
  {
    id: "gl-m08-demanda-maxima",
    term: "Demanda máxima",
    unit: "Restrição de geração e operação horária",
    definition:
      "Maior valor de potência verificado num período; é o que dimensiona adequação de potência.",
    aulaIds: [],
  },
  {
    id: "gl-m08-patamar-horario",
    term: "Patamar horário",
    unit: "Restrição de geração e operação horária",
    definition:
      "Faixa de horas com comportamento típico de carga e de geração solar; a operação brasileira trabalha com quatro.",
    aulaIds: [],
  },
  {
    id: "gl-m08-inversao-de-fluxo",
    term: "Inversão de fluxo",
    unit: "Restrição de geração e operação horária",
    definition:
      "Circulação de energia da rede de distribuição para níveis superiores, decorrente de alta penetração de geração local.",
    aulaIds: [],
  },
  {
    id: "gl-m08-observabilidade",
    term: "Observabilidade",
    unit: "Restrição de geração e operação horária",
    definition:
      "Grau em que o operador consegue medir e conhecer o estado dos recursos conectados.",
    aulaIds: [],
  },
  {
    id: "gl-m08-controlabilidade",
    term: "Controlabilidade",
    unit: "Restrição de geração e operação horária",
    definition:
      "Grau em que o operador consegue comandar a alteração de produção ou consumo de um recurso.",
    aulaIds: [],
  },
  {
    id: "gl-m08-rateio-dos-cortes",
    term: "Rateio dos cortes",
    unit: "Restrição de geração e operação horária",
    definition:
      "Critério de distribuição do ônus da restrição entre os agentes; objeto de discussão regulatória em curso.",
    aulaIds: [],
  },
  {
    id: "gl-m08-recurso-energetico-distribuido",
    term: "Recurso energético distribuído",
    unit: "Restrição de geração e operação horária",
    definition:
      "Conjunto de geração, armazenamento e carga flexível conectados na distribuição.",
    aulaIds: [],
  },
  {
    id: "gl-m08-resposta-da-demanda",
    term: "Resposta da demanda",
    unit: "Restrição de geração e operação horária",
    definition:
      "Alteração voluntária do consumo em função de sinal de preço ou de necessidade do sistema.",
    aulaIds: [],
  },
  {
    id: "gl-m08-concessionaria-de-distribuicao",
    term: "Concessionária de distribuição",
    unit: "Distribuição, consumo e bases de dados",
    definition:
      "Empresa outorgada para prestar o serviço público de distribuição em área delimitada, com exclusividade e obrigações regulatórias.",
    aulaIds: [],
  },
  {
    id: "gl-m08-permissionaria",
    term: "Permissionária",
    unit: "Distribuição, consumo e bases de dados",
    definition:
      "Agente de distribuição sob regime de permissão, tipicamente de menor porte.",
    aulaIds: [],
  },
  {
    id: "gl-m08-cooperativa-de-eletrificacao-rural",
    term: "Cooperativa de eletrificação rural",
    unit: "Distribuição, consumo e bases de dados",
    definition:
      "Entidade regularizada como permissionária do serviço público de distribuição.",
    aulaIds: [],
  },
  {
    id: "gl-m08-area-de-concessao",
    term: "Área de concessão",
    unit: "Distribuição, consumo e bases de dados",
    definition:
      "Território em que a concessionária detém exclusividade e obrigação de atendimento.",
    aulaIds: [],
  },
  {
    id: "gl-m08-caducidade",
    term: "Caducidade",
    unit: "Distribuição, consumo e bases de dados",
    definition:
      "Extinção antecipada da concessão por falta grave do concessionário, mediante processo administrativo com contraditório.",
    aulaIds: [],
  },
  {
    id: "gl-m08-duracao-equivalente-de-interrupcao",
    term: "Duração equivalente de interrupção",
    unit: "Distribuição, consumo e bases de dados",
    definition:
      "Tempo médio, por unidade consumidora, em que o fornecimento esteve interrompido no período.",
    aulaIds: [],
  },
  {
    id: "gl-m08-frequencia-equivalente-de-interrupcao",
    term: "Frequência equivalente de interrupção",
    unit: "Distribuição, consumo e bases de dados",
    definition:
      "Número médio de interrupções por unidade consumidora no período.",
    aulaIds: [],
  },
  {
    id: "gl-m08-indicadores-individuais-de-continuidade",
    term: "Indicadores individuais de continuidade",
    unit: "Distribuição, consumo e bases de dados",
    definition:
      "Duração, frequência e maior interrupção contínua apuradas para a unidade consumidora específica.",
    aulaIds: [],
  },
  {
    id: "gl-m08-perdas-tecnicas",
    term: "Perdas técnicas",
    unit: "Distribuição, consumo e bases de dados",
    definition:
      "Energia dissipada fisicamente em condutores, transformadores e equipamentos.",
    aulaIds: [],
  },
  {
    id: "gl-m08-perdas-nao-tecnicas",
    term: "Perdas não técnicas",
    unit: "Distribuição, consumo e bases de dados",
    definition:
      "Energia perdida por furto, fraude e erro de medição, cadastro ou faturamento.",
    aulaIds: [],
  },
  {
    id: "gl-m08-perda-regulatoria",
    term: "Perda regulatória",
    unit: "Distribuição, consumo e bases de dados",
    definition:
      "Nível de perda reconhecido na tarifa como eficiente; o excedente é absorvido pela concessionária.",
    aulaIds: [],
  },
  {
    id: "gl-m08-unidade-consumidora",
    term: "Unidade consumidora",
    unit: "Distribuição, consumo e bases de dados",
    definition:
      "Ponto individualizado de entrega de energia, com medição e faturamento próprios.",
    aulaIds: [],
  },
  {
    id: "gl-m08-classe-de-consumo",
    term: "Classe de consumo",
    unit: "Distribuição, consumo e bases de dados",
    definition:
      "Categoria de consumidor por finalidade de uso — residencial, industrial, comercial, rural, poder público, serviço público e iluminação pública.",
    aulaIds: [],
  },
  {
    id: "gl-m08-ambiente-de-contratacao-regulada",
    term: "Ambiente de contratação regulada",
    unit: "Distribuição, consumo e bases de dados",
    definition:
      "Ambiente em que o consumidor é suprido pela distribuidora sob tarifa regulada.",
    aulaIds: [],
  },
  {
    id: "gl-m08-ambiente-de-contratacao-livre",
    term: "Ambiente de contratação livre",
    unit: "Distribuição, consumo e bases de dados",
    definition:
      "Ambiente em que o consumidor negocia diretamente sua energia com fornecedores.",
    aulaIds: [],
  },
  {
    id: "gl-m08-consumo-na-rede",
    term: "Consumo na rede",
    unit: "Distribuição, consumo e bases de dados",
    definition:
      "Consumo suprido através das redes de distribuição, excluindo autoprodução consumida no local.",
    aulaIds: [],
  },
  {
    id: "gl-m08-setor-eletrointensivo",
    term: "Setor eletrointensivo",
    unit: "Distribuição, consumo e bases de dados",
    definition:
      "Segmento industrial em que a eletricidade representa parcela expressiva do custo de produção.",
    aulaIds: [],
  },
  {
    id: "gl-m08-balanco-energetico-nacional",
    term: "Balanço energético nacional",
    unit: "Distribuição, consumo e bases de dados",
    definition:
      "Contabilidade anual da oferta, transformação e consumo de energia no país, com ano-base no ano anterior.",
    aulaIds: [],
  },
  {
    id: "gl-m08-anuario-estatistico-de-energia-eletrica",
    term: "Anuário estatístico de energia elétrica",
    unit: "Distribuição, consumo e bases de dados",
    definition:
      "Publicação anual com dados de consumo, consumidores, demanda, carga, preços e tarifas.",
    aulaIds: [],
  },
  {
    id: "gl-m08-plano-decenal-de-expansao",
    term: "Plano decenal de expansão",
    unit: "Distribuição, consumo e bases de dados",
    definition:
      "Estudo indicativo, e não determinativo, das perspectivas de expansão do setor energético em horizonte de dez anos.",
    aulaIds: [],
  },
];

/** Ordem ALFABETICA global no export — o GlossarioView agrupa por letra
 *  inicial assumindo catalogo ordenado (contrato da Wave 8, verdadeiro
 *  com um modulo so). Com oito blocos por modulo, cada um alfabetico
 *  por dentro, o array literal deixou de ser globalmente ordenado — as
 *  letras repetiriam a cada bloco. A ordenacao mora aqui, na fronteira
 *  do dado, para o arquivo continuar organizado por proveniencia. */
export const ALEXANDRIA_GLOSSARIO: GlossaryTerm[] = [...VERBETES].sort((a, b) =>
  a.term.localeCompare(b.term, 'pt-BR', { sensitivity: 'base' }),
);

/** Verbetes em que a aula aparece — para a página da aula referenciar. */
export const getTermosByAula = (aulaId: string): GlossaryTerm[] =>
  ALEXANDRIA_GLOSSARIO.filter((t) => t.aulaIds.includes(aulaId));

export const getTermoById = (id: string): GlossaryTerm | undefined =>
  ALEXANDRIA_GLOSSARIO.find((t) => t.id === id);
