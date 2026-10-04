// alexandria-modulo-03-content.ts
// Conteúdo real do Módulo 03 — Tecnologias de Geração.
//
// Extraído de `Alexandria modulos/alexandria_modulo03.html` por parsing
// determinístico, não por transcrição. Mesmo método das Waves 4 e 18.
//
// CONTAGEM, confirmada por três sinais antes de fechar:
//   · 20 seções `.aula` no bruto — classe compartilhada com o aparato.
//   · 10 marcadores `Aula NN`; os outros 10 são § 00, MAP, Caso, Erros,
//     Ex, Quiz, Voz, Final, Lex, Ref.
//   · o hero declara "Dez aulas".
//   89 blocos de apostila nas dez. O Módulo 03 é mais enxuto em prosa que
//   o 02 (156 blocos): tem 1-3 subseções por aula contra 3-6, porque
//   argumenta por tecnologia em vez de por mecanismo.
//
// O QUE A FONTE NÃO DECLARA — verificado, não herdado:
//   · vídeo       → `video: null` nas dez. Zero <video>, <iframe>,
//                   'youtube' ou 'vimeo' no arquivo inteiro.
//   · duração     → `durationMinutes: null`.
//   · dificuldade → `difficulty: null`. Zero marcador de nível.
//   · submercado / competência / referência → arrays vazios; o § Ref é
//                   do módulo, não da aula.
//
// A PROSA E O MARKUP CONCORDAM, pela primeira vez: o § Ex diz "Dez
// exercícios" e há dez `div.exercise`, todos com `exercise-tag`. Nos
// Módulos 01 e 02 a prosa subestimava o markup.
//
// Duas tags fogem do padrão `Ex · NN · Aula NN`:
//   · `Ex · 03 · Aulas 02–03` — PLURAL, aponta duas aulas. Fica na
//     primeira nomeada, com a tag inteira preservada em `config.tag`
//     para o aluno ver que cobre as duas. Duplicar criaria exercício
//     repetido na interface e dobraria os pontos.
//   · `Ex · 10 · Síntese` — sem aula. Vai para
//     `MODULO_03_EXERCICIOS_SOLTOS`, mesmo tratamento do
//     `MODULO_01_SINTESE` e do `MODULO_02_EXERCICIOS_SOLTOS`.

import type { CurriculumAula, Instrument, LessonActivity } from '@/lib/types/alexandria';
import type { AulaBloco } from './alexandria-modulo-01-content';


/** Os nove instrumentos do Módulo 03. Todos vinculados a aula — as Aulas
 *  01 e 10 têm dois cada; as Aulas 04, 07 e 08 não têm nenhum.
 *
 *  TRÊS TIPOS ESTREADOS AQUI, e nenhum precisou de mecânica nova:
 *
 *  · `comparador` (INST 04 e 08) — campo numérico + readouts. O INST 08
 *    ainda tem `pill-row` de cinco tecnologias, que já mapeia em `select`
 *    desde o Módulo 02.
 *  · `dimensionador` (INST 07) — três campos numéricos + readouts.
 *  · `quebra-cabeca` (INST 09) — a fonte usa `src-toggle-row`: QUATRO
 *    chaves booleanas independentes (`data-src`), não arrastar, ordenar
 *    nem parear. Cada chave vira um `select` de duas opções, que é o
 *    primitivo que o InstrumentPanel já renderiza. Nenhum componente
 *    mudou.
 *
 *  Campos: a fonte pareia cada controle numérico com um `<input
 *  type="range">` gêmeo de id `<algo>-range`. São UM campo lógico — fica
 *  o `number`, que carrega value/min/max/step. */
export const INSTRUMENTOS_MODULO_03: Instrument[] = [
  {
    id: "m03-inst-01",
    kind: "explorador",
    title: "Explorador · A matriz nas duas lentes",
    formula: null,
    fields: [
      { id: "i01-pills", label: "Seleção", unit: null, kind: "select", defaultValue: "cap", options: [{ value: "cap", label: "Capacidade instalada" }, { value: "ene", label: "Energia gerada" }] },
    ],
    outputs: [
      { id: "i01-verdict", label: "Veredito", unit: null },
    ],
    note: "Participações <b>didáticas, em ordem de grandeza</b>, construídas sobre ANEEL/SIGA (capacidade, incl. MMGD no total) e ONS/EPE (geração) — composições típicas recentes, não foto de um mês específico. Hidrologia e expansão mudam esses números continuamente. <b>Não usar para citação externa sem reverificar na fonte.</b>",
  },
  {
    id: "m03-inst-02",
    kind: "calculadora",
    title: "Calculadora · FC × energia anual",
    formula: null,
    fields: [
      { id: "i02-mw", label: "Potência instalada", unit: "MW", kind: "range", defaultValue: 100, min: 1, max: 2000, step: 1 },
      { id: "i02-fc", label: "Fator de capacidade", unit: "%", kind: "range", defaultValue: 27, min: 5, max: 95, step: 1 },
    ],
    outputs: [
      { id: "i02-gwh", label: "Energia anual", unit: null },
      { id: "i02-heq", label: "Equivale a rodar pleno", unit: null },
      { id: "i02-pct", label: "Do consumo nacional*", unit: null },
      { id: "i02-verdict", label: "Veredito", unit: null },
    ],
    note: "Didático. *Consumo nacional tomado em ~550 TWh/ano (EPE/ONS — número vivo). A mesma potência com FC diferente é, na prática, <b>outra usina</b>: compare 100 MW solares (FC 27) com 100 MW nucleares (FC 88) e veja a energia mais que triplicar.",
  },
  {
    id: "m03-inst-03",
    kind: "simulador",
    title: "Simulador · A bateria do Brasil (EAR ao longo do ano)",
    formula: null,
    fields: [
      { id: "i03-ena", label: "Cenário hidrológico", unit: "ENA % da média", kind: "range", defaultValue: 100, min: 55, max: 130, step: 5 },
      { id: "i03-ear", label: "EAR inicial (1º de janeiro)", unit: "%", kind: "range", defaultValue: 60, min: 20, max: 95, step: 5 },
    ],
    outputs: [
      { id: "i03-min", label: "EAR mínima do ano", unit: null },
      { id: "i03-mes", label: "Mês crítico", unit: null },
      { id: "i03-term", label: "Meses com térmica pesada", unit: null },
      { id: "i03-verdict", label: "Veredito", unit: null },
    ],
    note: "Modelo didático de balanço mensal: afluência sazonal típica do SIN (cheia dez–abr, seca mai–nov), geração hidráulica alvo constante, estoque limitado. <b>Não é o NEWAVE — é a intuição do NEWAVE.</b> Ajuste a ENA para ~75% e veja o desenho de 2021; para ~60%, o fantasma de 2001.",
  },
  {
    id: "m03-inst-04",
    kind: "comparador",
    title: "Comparador · Reservatório × fio d'água sob a mesma seca",
    formula: null,
    fields: [
      { id: "i04-ena", label: "Hidrologia do ano", unit: "ENA % da média", kind: "range", defaultValue: 100, min: 55, max: 130, step: 5 },
    ],
    outputs: [
      { id: "i04-fcfio", label: "Fio d'água · FC anual", unit: null },
      { id: "i04-minfio", label: "Fio · pior mês (% da capac.)", unit: null },
      { id: "i04-firme", label: "Reservatório · entrega firme", unit: null },
      { id: "i04-stk", label: "Reservatório · estoque final", unit: null },
      { id: "i04-verdict", label: "Veredito", unit: null },
    ],
    note: "Duas usinas didáticas sob a mesma afluência sazonal: a fio d'água gera o que o rio manda (limitada pela turbina); a de reservatório tenta sustentar entrega constante usando o estoque. <b>Didático — não usar para dimensionamento real.</b> O ponto não é qual \"ganha\": é ver que entregam <i>produtos diferentes</i> — energia média vs energia firme.",
  },
  {
    id: "m03-inst-05",
    kind: "simulador",
    title: "Simulador · O dia do sistema: solar, vento e o resíduo",
    formula: null,
    fields: [
      { id: "i05-sol", label: "Solar total no sistema", unit: "GW instalados", kind: "range", defaultValue: 35, min: 0, max: 80, step: 5 },
      { id: "i05-eol", label: "Eólica gerando", unit: "GW médios no dia", kind: "range", defaultValue: 12, min: 0, max: 28, step: 1 },
    ],
    outputs: [
      { id: "i05-min", label: "Resíduo mínimo (meio-dia)", unit: null },
      { id: "i05-rampa", label: "Rampa do pôr do sol", unit: null },
      { id: "i05-exc", label: "Excedente didático", unit: null },
      { id: "i05-verdict", label: "Veredito", unit: null },
    ],
    note: "Carga didática típica do SIN (~70–100 GW), solar em perfil de dia claro, eólica com leve reforço noturno (perfil NE). O <b>resíduo</b> é o que sobra para hidro despachável + térmicas + baterias. Didático — não usar para análise real de operação.",
  },
  {
    id: "m03-inst-06",
    kind: "simulador",
    title: "Simulador · A pilha de CVU: monte a ordem de mérito",
    formula: null,
    fields: [
      { id: "i06-dem", label: "Demanda do sistema", unit: "GW", kind: "range", defaultValue: 75, min: 40, max: 105, step: 1 },
      { id: "i06-agua", label: "Valor da água", unit: "R$/MWh", kind: "range", defaultValue: 150, min: 60, max: 650, step: 10 },
      { id: "i06-gas", label: "Preço do gás / GNL", unit: null, kind: "select", defaultValue: "1", options: [{ value: "0.7", label: "Baixo (mercado folgado)" }, { value: "1", label: "Médio" }, { value: "1.8", label: "Alto (crise global, 2021/2022)" }] },
    ],
    outputs: [
      { id: "i06-marg", label: "Fonte marginal", unit: null },
      { id: "i06-cmo", label: "CMO didático", unit: null },
      { id: "i06-term", label: "Térmica despachada", unit: null },
      { id: "i06-verdict", label: "Veredito", unit: null },
    ],
    note: "Pilha didática com capacidades e CVUs <b>ilustrativos em ordem de grandeza</b> (faixas inspiradas em CVUs homologados pela ANEEL/CCEE — vivos, mudam a cada revisão e a cada cotação de combustível). Piso de R$ 61 como referência do piso regulatório do PLD. <b>Não usar para análise real de despacho.</b> Suba o preço do gás e veja o \"conversor de preço\" em ação: o mesmo sistema, a mesma demanda — e o custo marginal multiplicado.",
  },
  {
    id: "m03-inst-07",
    kind: "dimensionador",
    title: "Dimensionador · MW, MWh e o preço da viagem no tempo",
    formula: null,
    fields: [
      { id: "i07-mw", label: "Potência", unit: "MW", kind: "range", defaultValue: 100, min: 10, max: 500, step: 10 },
      { id: "i07-h", label: "Duração", unit: "horas", kind: "range", defaultValue: 4, min: 0.5, max: 6, step: 0.5 },
      { id: "i07-eff", label: "Eficiência de ciclo", unit: "%", kind: "range", defaultValue: 88, min: 82, max: 95, step: 1 },
    ],
    outputs: [
      { id: "i07-mwh", label: "Tanque (energia)", unit: null },
      { id: "i07-desl", label: "Deslocado por dia (1 ciclo)", unit: null },
      { id: "i07-perda", label: "Perdido no caminho / dia", unit: null },
      { id: "i07-voc", label: "Vocação", unit: null },
      { id: "i07-verdict", label: "Veredito", unit: null },
    ],
    note: "Didático: um ciclo completo por dia, eficiência aplicada na carga. <b>Não usar para dimensionamento real</b> — projeto de verdade modela degradação, profundidade de descarga, temperatura e estratégia de ciclagem. O ponto pedagógico: potência e energia são produtos <i>diferentes</i> — e o leilão de 2026 compra um deles.",
  },
  {
    id: "m03-inst-08",
    kind: "comparador",
    title: "Comparador · LCOE por tecnologia — e seus limites",
    formula: null,
    fields: [
      { id: "i08-fc", label: "Fator de capacidade", unit: "%", kind: "range", defaultValue: 27, min: 10, max: 92, step: 1 },
      { id: "i08-wacc", label: "WACC real", unit: "% a.a.", kind: "range", defaultValue: 10, min: 8, max: 14, step: 0.5 },
      { id: "i08-pills", label: "Seleção", unit: null, kind: "select", defaultValue: "solar", options: [{ value: "solar", label: "Solar UFV" }, { value: "eolica", label: "Eólica NE" }, { value: "gas", label: "Gás CC" }, { value: "hidro", label: "Hidro grande" }, { value: "nuclear", label: "Nuclear" }] },
    ],
    outputs: [
      { id: "i08-lcoe", label: "LCOE", unit: null },
      { id: "i08-cap", label: "Parcela de capital", unit: null },
      { id: "i08-om", label: "O&M + variável", unit: null },
      { id: "i08-pre", label: "Premissas do preset", unit: null },
      { id: "i08-verdict", label: "Veredito", unit: null },
    ],
    note: "Presets <b>didáticos em ordem de grandeza</b> (CAPEX, O&M, vida útil, custo variável inspirados em EPE / Lazard LCOE+ — vivos). Fórmula: capital anualizado pelo CRF + O&M fixo, dividido pela energia anual, mais variável. <b>Não usar para decisão de investimento.</b> Faça o teste-chave: selecione Gás CC e arraste o FC de 45% para 15% — o LCOE quase dobra sem mudar nada na usina. Esse é o limite nº 2 abaixo.",
  },
  {
    id: "m03-inst-09",
    kind: "quebra-cabeca",
    title: "Quebra-cabeça · O encaixe sazonal das fontes",
    formula: null,
    fields: [
      { id: "i09-checks-hidro", label: "Hidro (ENA)", unit: null, kind: "select", defaultValue: "on", options: [{ value: "on", label: "Ligada" }, { value: "off", label: "Desligada" }] },
      { id: "i09-checks-eolica", label: "Eólica NE", unit: null, kind: "select", defaultValue: "off", options: [{ value: "on", label: "Ligada" }, { value: "off", label: "Desligada" }] },
      { id: "i09-checks-solar", label: "Solar", unit: null, kind: "select", defaultValue: "off", options: [{ value: "on", label: "Ligada" }, { value: "off", label: "Desligada" }] },
      { id: "i09-checks-bio", label: "Biomassa (safra)", unit: null, kind: "select", defaultValue: "off", options: [{ value: "on", label: "Ligada" }, { value: "off", label: "Desligada" }] },
    ],
    outputs: [
      { id: "i09-ratio", label: "Mês mais fraco vs mais forte", unit: null },
      { id: "i09-vale", label: "Vale do portfólio", unit: null },
      { id: "i09-verdict", label: "Veredito", unit: null },
    ],
    note: "Perfis mensais <b>didáticos</b> (índice 100 = média do ano de cada fonte; pesos aproximados de participação na energia), inspirados nas sazonalidades reais ONS/UNICA/ABEEólica. Ligue as fontes uma a uma, na ordem, e observe o índice mês-fraco/mês-forte subir: <b>o encaixe é o produto</b>. Não usar para análise real.",
  },
];

/** Lead de cada aula — o `<p class="lead">` da fonte. */
export const MODULO_03_LEAD: Record<string, string> = {
  'aula-03-01': "Toda conversa séria sobre geração usa três medidas — e toda manchete ruim confunde as três. <strong>Capacidade instalada</strong> (MW) é o tamanho do motor: quanto a usina consegue entregar no máximo, agora. <strong>Energia gerada</strong> (MWh) é quanto o motor andou no ano. <strong>Fator de capacidade</strong> é a razão entre as duas: a fração do tempo-equivalente em que a usina operou a plena carga. Mesma matriz, três fotografias diferentes — e quem só conhece uma toma decisão errada com convicção.",
  'aula-03-02': "O princípio é o mais antigo do portfólio: água acumulada em altura é energia potencial; a queda converte em energia cinética; a turbina converte em rotação; o gerador, em eletricidade. A potência de uma hidrelétrica é, essencialmente, <span class=\"hl\">vazão × queda</span> — quanto rio passa, de que altura cai. Mas o que faz da hidrelétrica com reservatório a peça mais nobre da matriz brasileira não é gerar barato. É outra coisa: ela é a única tecnologia do portfólio que <strong>estoca a própria fonte primária em escala de meses</strong>.",
  'aula-03-03': "Fio d'água é a hidrelétrica sem estoque relevante: o reservatório, quando existe, regula horas ou dias — não estações. A usina gera conforme a vazão que chega. Mesma física de conversão da Aula 02, atributo oposto: <span class=\"hl\">toda a energia, nenhuma escolha</span>. E a partir dos anos 2000, por decisão socioambiental deliberada, praticamente toda grande hidrelétrica nova do Brasil nasceu assim.",
  'aula-03-04': "O princípio: a turbina extrai energia cinética do ar em movimento. A física que importa cabe numa relação: <span class=\"hl\">a potência disponível no vento cresce com o cubo da velocidade</span>. Dez por cento mais vento ≈ um terço mais energia. Esse cubo explica quase tudo da indústria — por que a localização exata do parque (micrositing) vale fortunas, por que torres ficaram mais altas (vento mais rápido e estável em altura), por que pás ficaram gigantes (mais área varrida), e por que o litoral do Nordeste brasileiro virou um dos endereços eólicos mais cobiçados do planeta.",
  'aula-03-05': "O princípio fotovoltaico é o mais elegante do cardápio: fóton incide no semicondutor, desloca elétron, corrente contínua flui — o inversor converte para alternada. <strong>Sem partes móveis, sem combustível, sem ciclo térmico.</strong> Disso derivam as três marcas da fonte: modularidade absoluta (do telhado de 5 kW à usina de 1 GW, a mesma célula), custo dominado por manufatura (e manufatura aprende), e zero inércia — eletrônica de potência pura.",
  'aula-03-06': "A térmica a gás é a Família 2 em estado puro: relativamente barata de construir, cara de rodar. Cada MWh queima um combustível com preço de mercado internacional. E é exatamente por isso que ela é valiosa: <span class=\"hl\">a térmica converte dinheiro em energia sob comando, a qualquer hora, em qualquer estação</span>. Num portfólio dominado por fontes que dependem de chuva, vento e sol, alguém precisa obedecer ao operador — e cobrar por isso.",
  'aula-03-07': "Três tecnologias térmicas completam o cardápio — e não poderiam ser mais diferentes entre si. Uma está saindo de cena por decisão de política. Outra é o seguro mais caro do sistema, escondido onde o Brasil é menos visível. A terceira é o subproduto agrícola que virou usina — com um calendário que parece desenhado pela providência hidrológica.",
  'aula-03-08': "Tecnicamente, a nuclear é uma térmica — fissão aquece água, vapor gira turbina — cujo combustível tem densidade energética absurda: uma pastilha de urânio do tamanho de uma borracha escolar equivale a toneladas de carvão. Disso derivam os atributos: <strong>CVU baixíssimo</strong> (combustível é fração pequena do custo), <strong>CAPEX gigantesco</strong>, e uma vocação econômica única — rodar na base, sempre, a 85–90% de fator de capacidade. A nuclear é a Família 1 levada ao extremo: quase todo o custo é capital; parada, ela queima dinheiro na mesma velocidade que rodando.",
  'aula-03-09': "Comece pela frase que corrige 90% das conversas erradas sobre o tema: <strong>bateria não é fonte de geração — é logística temporal</strong>. Ela compra energia de um horário e entrega em outro, perdendo um pedaço no caminho (eficiência de ciclo completo de 85–90% para lítio). Você <em>perde</em> energia para <em>ganhar</em> tempo. Num sistema cuja restrição central é não ter estoque, vender estoque é um dos melhores negócios possíveis — desde que se entenda o que exatamente está sendo vendido.",
  'aula-03-10': "Falta a régua que compara o cardápio inteiro. Ela existe e chama-se <strong>LCOE — custo nivelado de energia</strong>: todo o custo da vida útil de uma usina (capital, O&M, combustível), trazido a valor presente, dividido por toda a energia que ela gera na vida, também descontada. O resultado é um único número em R$/MWh — sedutor, comparável, citável. E perigoso exatamente por isso: <span class=\"hl\">o LCOE responde \"quanto custa o MWh médio desta usina\" — não \"quanto vale este MWh para o sistema\"</span>. São perguntas diferentes, e confundi-las é o erro mais sofisticado do setor.",
};

/** Corpo de texto — a apostila. 89 blocos nas dez aulas. */
export const MODULO_03_CORPO: Record<string, AulaBloco[]> = {
  'aula-03-01': [
    { kind: 'formula', eq: "FC = Energia gerada no ano ÷ ( Potência instalada × 8.760 h )", desc: "100 MW a fator de capacidade de 27% entregam o mesmo que 30 MW rodando o ano inteiro" },
    { kind: 'paragrafo', html: "O número que organiza tudo: em 1º de janeiro de 2026, o Brasil somava <span class=\"hl\">215,9 GW de potência centralizada fiscalizada</span> (ANEEL/SIGA), com 84,6% dessa capacidade vinda de fontes renováveis — patamar raro entre sistemas elétricos de grande porte. Fora dessa conta, há ainda a geração distribuída (MMGD), na casa de <strong>40 GW</strong> espalhados por milhões de telhados e pequenas usinas (ANEEL/ABSOLAR). Somadas a fotovoltaica centralizada e a distribuída, a solar tornou-se a <strong>segunda fonte da matriz em capacidade</strong> — atrás apenas da hidráulica (ABSOLAR)." },
    { kind: 'paragrafo', html: "Agora a segunda lente — e o choque pedagógico do módulo. Em <em>capacidade</em>, a hidráulica responde por algo perto de metade; a solar total, por cerca de um quarto. Em <em>energia gerada</em>, a hidráulica sobe para a casa dos 55–60% e a solar encolhe para a casa dos 10% (ONS/EPE). Não é mistério, é fator de capacidade: o sol entrega seu melhor por seis a oito horas por dia; o rio, quando há água e reservatório, entrega o dia inteiro. A nuclear faz o caminho inverso — quase invisível em capacidade (~1%), mas com FC de 85–90%, pesa o dobro disso em energia. Use o instrumento e veja a matriz mudar de cara conforme a lente:" },
    { kind: 'nota', tom: "red", label: "Números vivos · verificar na fonte antes de uso externo", html: "Capacidade total (215,9 GW centralizados em 1º/jan/2026 — ANEEL/SIGA), MMGD (~40 GW — ANEEL/ABSOLAR), participação renovável (84,6% — SIGA) e a expansão projetada para 2026 (+9,1 GW, puxada por 4,6 GW de solar — ANEEL/RALIE) são números que <strong>mudam todo mês</strong>. Antes de citar em conversa de Summit, material público ou análise de cliente: SIGA e RALIE são atualizados diariamente; o BEN da EPE consolida o ano. A ordem de grandeza você carrega de cabeça; o decimal, você verifica." },
    { kind: 'titulo', numero: "1.1", texto: "A usina invisível" },
    { kind: 'paragrafo', html: "Um detalhe que separa analista de leitor de manchete: a MMGD <strong>não aparece como geração</strong> nos painéis do ONS — aparece como <em>redução de carga</em>. O telhado da fábrica gera atrás do medidor; o operador enxerga só o líquido. É exatamente a mecânica da curva líquida que você dominou no Módulo 02, Aula 04: a \"barriga\" do meio-dia é, em boa parte, essa usina invisível de dezenas de gigawatts trabalhando sem aparecer na coluna de geração. Quando alguém compara \"geração solar\" entre países usando só dados de operador, está deixando a usina invisível de fora — e no Brasil ela é quase metade da solar total." },
    { kind: 'paragrafo', html: "A terceira lente — o fator de capacidade — é a que converte MW de manchete em MWh de realidade. Memorize as faixas brasileiras como vocabulário ativo:" },
    { kind: 'tabela', linhas: [["Fonte", "FC típico no Brasil", "O que governa"], ["<b>Hidro com reservatório</b>", "~50–55%", "Hidrologia + decisão de despacho (valor da água)"], ["<b>Hidro fio d'água</b>", "~40–55%, sazonal", "A vazão do rio, sem direito a opinião"], ["<b>Eólica (Nordeste)</b>", "~40–55%", "Alísios — entre os melhores ventos do planeta"], ["<b>Solar UFV (com tracker)</b>", "~25–30%", "O relógio e a latitude"], ["<b>Biomassa (bagaço)</b>", "~50% na safra, baixo fora", "O calendário da cana, não o ONS"], ["<b>Gás natural</b>", "de &lt;15% a &gt;60%", "O despacho — FC de térmica é consequência, não atributo"], ["<b>Nuclear</b>", "~85–90%", "Paradas programadas; o resto é base contínua"]] },
    { kind: 'paragrafo', html: "Repare na linha do gás: o FC de uma térmica <span class=\"hl\">não é uma propriedade da máquina — é o diário de quantas vezes o sistema precisou dela</span>. Essa diferença vai explodir de importância na Aula 10, quando o LCOE do gás se revelar refém do próprio despacho. Faixas: EPE/ONS/ABEEólica/ABSOLAR — ordens de grandeza vivas." },
    { kind: 'nota', tom: "gold", label: "Onde isso entra no produto", html: "O <strong>Brazil Pulse</strong> mostra a matriz nas duas lentes em tempo quase real — geração por fonte (ONS) contra capacidade (SIGA) — exatamente o INST·01 com dado vivo. E o <strong>Conta de Luz Express</strong> usa a lente do FC ao avaliar propostas que chegam ao cliente: quando um fornecedor vende \"X MWp de solar\", a primeira pergunta do relatório é quantos MWh isso vira no perfil real da planta — oportunidade potencial a validar, nunca número prometido." },
  ],
  'aula-03-02': [
    { kind: 'paragrafo', html: "Pense no que isso significa contra a restrição central do Módulo 02 — eletricidade não se armazena. A frase continua verdadeira: ninguém estoca elétrons em escala de rede. Mas o reservatório estoca a <em>chuva</em>. A energia fica guardada na forma de água em altura, esperando a decisão de virar eletricidade. Por isso o jargão que você vai ouvir em qualquer mesa séria do setor: <strong>os reservatórios são a bateria do Brasil</strong> — uma bateria continental, construída em concreto entre os anos 1960 e 1990, décadas antes da primeira célula de lítio comercial." },
    { kind: 'titulo', numero: "2.1", texto: "As âncoras: Itaipu, Tucuruí e a era dos gigantes" },
    { kind: 'paragrafo', html: "<strong>Itaipu</strong> — 14 GW binacionais no Paraná, vinte unidades geradoras, historicamente responsável por algo na casa de 8–10% do consumo elétrico brasileiro (Itaipu Binacional — número vivo, varia com a hidrologia). <strong>Tucuruí</strong> — ~8,5 GW no Tocantins, a maior usina 100% brasileira. <strong>Furnas, Três Marias, Sobradinho, Serra da Mesa</strong> — os grandes reservatórios de regularização do Sudeste, do São Francisco e do Tocantins. Essa geração de usinas foi construída sob lógica de Estado: financiamento público, horizonte de décadas, e um objetivo explícito — <em>regularização plurianual</em>: guardar água de anos úmidos para atravessar anos secos." },
    { kind: 'paragrafo', html: "A medida dessa bateria tem nome técnico: <strong>EAR — Energia Armazenada</strong>, publicada diariamente pelo ONS por subsistema. A capacidade máxima de armazenamento do SIN está na casa de <span class=\"hl\">200 TWh</span> em energia equivalente (ONS — ordem de grandeza viva): meses de geração hidráulica guardados em altura. Guarde esse número — na Aula 09 ele vai esmagar, por cinco ordens de grandeza, a maior bateria eletroquímica do planeta." },
    { kind: 'titulo', numero: "2.2", texto: "O custo que não é custo: o valor da água, agora do lado do ativo" },
    { kind: 'paragrafo', html: "No Módulo 02 você aprendeu o valor da água do ponto de vista do operador: turbinar hoje é não ter água na estiagem, e esse custo de oportunidade — calculado pela cadeia NEWAVE/DECOMP/DESSEM — posiciona a hidro na ordem de mérito. Agora olhe do lado do ativo: <span class=\"hl\">o reservatório é o que transforma a hidrelétrica de fonte variável em fonte despachável</span>. Sem estoque, a usina gera o que o rio mandar (Aula 03). Com estoque, ela escolhe <em>quando</em> gerar — e essa escolha vale dinheiro exatamente nas horas em que o resto do portfólio não entrega: o pico das 19h, a estiagem de setembro, o ano de chuva ruim." },
    { kind: 'paragrafo', html: "Características operacionais que você cita de cabeça: <strong>flexível</strong> (sobe e desce carga em minutos — é quem historicamente faz a rampa do fim da tarde no Brasil), <strong>com inércia</strong> (máquinas síncronas gigantes — relembre a Aula 08 do Módulo 02), <strong>despachável até o limite do estoque</strong>, CVU zero mas custo de oportunidade calculado, e vida útil de 50 a 100 anos — o ativo mais longevo do setor elétrico." },
    { kind: 'paragrafo', html: "O instrumento ensina a leitura que o mercado inteiro faz todo dia: <strong>EAR caindo fora de época = térmica cara entrando = PLD e bandeira subindo = a fatura da Operação A piorando três meses depois</strong>. A cadeia causal completa você fecha no Bloco de mercados; a física dela está aqui." },
    { kind: 'titulo', numero: "2.3", texto: "O preço do gigante" },
    { kind: 'paragrafo', html: "Nada disso é de graça. Reservatório significa área alagada — e área alagada significa deslocamento de populações, impacto sobre ecossistemas e povos indígenas, emissões de decomposição em zonas tropicais, e batalhas de licenciamento que duram mais que governos. O trauma formativo tem nome: <strong>Balbina</strong> (AM, anos 1980) — área gigante alagada para potência pífia, o anti-exemplo citado até hoje. Esse passivo socioambiental, somado ao esgotamento dos melhores sítios próximos à carga, é o que explica a decisão coletiva que define a Aula 03: o Brasil continuou construindo hidrelétricas — mas <em>parou de construir reservatórios</em>." },
    { kind: 'nota', tom: "gold", label: "Onde isso entra no produto", html: "O <strong>Brazil Pulse</strong> acompanha EAR por subsistema e ENA contra a média histórica — os dois dials desta aula, com dado aberto do ONS. Para o cliente industrial, a tradução é direta: EAR é o indicador antecedente do humor da fatura. Ensinar o cliente a ler essa curva antes da bandeira chegar é inteligência independente — ninguém que vende energia tem incentivo para fazer isso." },
  ],
  'aula-03-03': [
    { kind: 'titulo', numero: "3.1", texto: "Belo Monte: o compromisso em concreto" },
    { kind: 'paragrafo', html: "<strong>Belo Monte</strong> (Xingu, PA) é a âncora obrigatória: ~11,2 GW instalados — terceira maior capacidade hidrelétrica do mundo — desenhada a fio d'água para reduzir a área alagada do projeto original. O resultado é o caso de estudo perfeito da diferença entre MW e MWh: a geração média fica na casa de 4–5 GW médios, fator de capacidade em torno de 40% (ONS — vivo), porque o Xingu tem uma das sazonalidades mais brutais do planeta — caudaloso na cheia amazônica, magro na seca. Na cheia, Belo Monte é um colosso; na estiagem, opera a uma fração do nome de batismo. <strong>Madeira</strong> (Jirau e Santo Antônio, ~7 GW somados) conta história parecida em outro rio." },
    { kind: 'paragrafo', html: "Nada disso é defeito de engenharia — é o trade-off escolhido: <em>menos área alagada, menos regularização</em>. A pergunta de adulto não é \"fio d'água é pior?\", e sim \"quem passou a fazer o serviço que o reservatório não faz mais?\"." },
    { kind: 'titulo', numero: "3.2", texto: "A consequência sistêmica: mais energia média, menos firmeza por MW" },
    { kind: 'paragrafo', html: "Eis o efeito agregado que separa o analista do torcedor: cada GW hidráulico novo adicionado desde os anos 2000 trouxe energia média, mas quase nenhum estoque novo. A \"bateria do Brasil\" parou de crescer enquanto a carga seguiu crescendo — ou seja, <span class=\"hl\">a bateria ficou proporcionalmente menor</span>. A regularização que o sistema perdeu migrou para outros ombros: os reservatórios antigos (cada vez mais exigidos), as térmicas flexíveis (Aula 06), e — a partir do leilão de 2026 — as baterias eletroquímicas (Aula 09). Quando você ouvir \"o Brasil ficou mais térmico apesar de mais renovável\", a raiz está aqui." },
    { kind: 'paragrafo', html: "Complete o quadro com as outras hidráulicas do cardápio: <strong>PCH</strong> (Pequenas Centrais Hidrelétricas, até 30 MW) e <strong>CGH</strong> (até 5 MW) — somam alguns GW, gozam de tratamento regulatório próprio e historicamente alimentaram o mercado de energia incentivada; e a <strong>reversível (UHR)</strong> — bombeia água morro acima com energia barata para turbinar na hora cara, a \"bateria hidráulica\" clássica, padrão na Europa e na China, ainda sem projeto de grande porte operando no Brasil (EPE estuda — vivo). Guarde a reversível: ela volta como personagem na Aula 09." },
    { kind: 'nota', tom: "gold", label: "Onde isso entra no produto", html: "Quando uma proposta de PPA chega lastreada em hidráulica, a primeira pergunta do <strong>Conta de Luz Express</strong> é estrutural: reservatório ou fio? A resposta muda o perfil de entrega, a exposição à sazonalização e o risco hidrológico embutido (o GSF que você verá no Bloco de mercados). Mesma palavra \"hidrelétrica\", dois produtos diferentes — e o cliente raramente sabe qual está comprando. Apontar isso é análise independente em estado puro." },
  ],
  'aula-03-04': [
    { kind: 'formula', eq: "Pvento ∝ ρ × A × v³", desc: "Densidade do ar × área varrida pelas pás × velocidade ao cubo — o cubo é o negócio inteiro" },
    { kind: 'paragrafo', html: "A operação da máquina em uma frase: abaixo de uma velocidade mínima (cut-in, ~3 m/s) ela não gira; entre o cut-in e a velocidade nominal (~12 m/s) a potência sobe seguindo o cubo; da nominal ao limite de segurança (cut-out, ~25 m/s) ela entrega potência cheia controlando o ângulo das pás; acima, desliga para se proteger. É a <strong>curva de potência</strong> — o documento que define o que cada modelo de turbina extrai de cada sítio." },
    { kind: 'titulo', numero: "4.1", texto: "Por que o Nordeste é especial — duas vezes" },
    { kind: 'paragrafo', html: "<strong>Primeira: a qualidade.</strong> Os ventos alísios do litoral e dos planaltos do NE (BA, RN, CE, PI) são fortes, <em>estáveis e unidirecionais</em> — o oposto do vento turbulento europeu. Resultado: fatores de capacidade de 40–55% nos bons sítios (ABEEólica/ONS — vivo), contra 25–30% típicos do onshore europeu. Em FC, o Nordeste onshore compete com o <em>offshore</em> do Mar do Norte — sem precisar molhar o pé. O parque brasileiro soma capacidade na casa de <strong>33–35 GW</strong> (ABEEólica/SIGA — vivo), esmagadoramente concentrada no NE." },
    { kind: 'paragrafo', html: "<strong>Segunda: o calendário.</strong> O vento do NE sopra mais forte no segundo semestre — exatamente a estação seca dos reservatórios do Sudeste. <span class=\"hl\">Quando a chuva vai embora, o vento chega.</span> Essa complementaridade sazonal hidro–eólica é um presente geofísico que pouquíssimos sistemas elétricos do mundo receberam, e é um dos argumentos centrais da Aula 10. O perfil diário também ajuda: no NE, o vento tende a firmar no fim da tarde e na noite — quando a solar sai de cena." },
    { kind: 'titulo', numero: "4.2", texto: "O que a eólica não entrega" },
    { kind: 'paragrafo', html: "Disciplina de analista: depois de elogiar, listar os limites. <strong>Variabilidade</strong> — gera sob condição, não sob comando; o termo profissional é fonte <em>variável</em> (prefira a \"intermitente\", que sugere liga-desliga binário que não descreve bem o recurso). <strong>Sem inércia síncrona</strong> — conecta-se por inversores; relembre o papel disso na anatomia do apagão de 2023 (Módulo 02, Aula 08). <strong>Localização concentrada longe da carga</strong> — o melhor vento está a milhares de quilômetros do consumo do Sudeste, e o gargalo de escoamento Norte/Nordeste transformou parte dessa energia em <em>curtailment</em> (Módulo 02, Aula 10): vento de classe mundial, cortado por falta de fio. <strong>Estrutura de custo</strong>: Família 1 pura — CAPEX na casa de R$ 5–6 milhões/MW (EPE — vivo), CVU ~zero, O&M moderado, vida útil 20–25 anos com possibilidade de repotenciação." },
    { kind: 'paragrafo', html: "<strong>E o offshore?</strong> O marco legal saiu — Lei 15.097/2025 — e o potencial técnico da costa brasileira é medido em centenas de GW (EPE). Mas o onshore nacional é tão competitivo que o offshore, vários múltiplos mais caro por MWh hoje, ainda não fecha conta sem desenho de incentivo. É horizonte, não presente: acompanhe a regulamentação e os vetos derrubados ou mantidos no Congresso (vivo — verificar status antes de citar). Frase de Summit: \"o offshore brasileiro espera o onshore ficar caro — e o onshore se recusa\"." },
    { kind: 'nota', tom: "red", label: "Números vivos · verificar na fonte antes de uso externo", html: "Capacidade eólica instalada (~33–35 GW), FC médio por estado, e curtailment acumulado no NE mudam mês a mês (ABEEólica, ONS, CCEE). O contencioso sobre <strong>quem paga o curtailment</strong> — gerador, consumidor, rateio — segue em disputa regulatória e judicial; trate como questão aberta, nunca como resolvida." },
    { kind: 'nota', tom: "gold", label: "Onde isso entra no produto", html: "Contratos no mercado livre lastreados em eólica chegam com sazonalização agressiva — entrega forte no 2º semestre. Para uma planta com consumo flat, isso cria descasamento mensal que vira exposição. O <strong>GridAlpha Simulate</strong> cruza o perfil de entrega da fonte com a curva de carga real do cliente e mostra o descasamento <em>antes</em> da assinatura — oportunidades e riscos potenciais a validar, quantificados de forma independente." },
  ],
  'aula-03-05': [
    { kind: 'paragrafo', html: "A curva de aprendizado é a história econômica mais importante da energia neste século: o custo do módulo fotovoltaico caiu na ordem de <strong>90% em pouco mais de uma década</strong> (IRENA/Lazard — vivo), puxado por escala de manufatura concentrada na China. No Brasil, o resultado apareceu nos leilões: a solar centralizada passou a vencer certames com preços na casa de <strong>R$ 150–220/MWh</strong> (CCEE/EPE — vivo), entre os menores valores já registrados para energia nova no país. Em capacidade, a fonte explodiu: somando centralizada e distribuída, a solar é hoje a segunda da matriz (ABSOLAR — vivo)." },
    { kind: 'titulo', numero: "5.1", texto: "UFV e MMGD: mesma física, economias opostas" },
    { kind: 'paragrafo', html: "Aqui mora a distinção que separa o analista do entusiasta. <strong>UFV</strong> — Usina Fotovoltaica centralizada: dezenas a centenas de MW, concentrada no NE e Centro-Oeste (irradiação alta, terra barata), com rastreadores de eixo (trackers) levando o FC a 25–30%. Vende energia no <em>atacado</em>: leilão regulado ou contrato no mercado livre. Compete contra o preço de geração — a régua dura." },
    { kind: 'paragrafo', html: "<strong>MMGD</strong> — Micro e Minigeração Distribuída: o telhado, o galpão, a fazenda solar de poucos MW. Gera <em>atrás do medidor</em> ou compensa via SCEE (Sistema de Compensação de Energia Elétrica). A régua dela é outra: compete contra a <strong>tarifa cheia de varejo</strong> — energia + fio + encargos + tributos. Como a tarifa de varejo é múltiplas vezes o preço de atacado, a MMGD fecha conta onde a UFV nem competiria. É por isso que o \"boom solar\" brasileiro foi, antes de tudo, um boom de telhado: a Lei <strong>14.300/2022</strong> consolidou o marco legal, garantiu regras de transição para quem já estava conectado (compensação integral preservada por prazo longo) e instituiu a cobrança gradual do Fio B para os novos — o \"pedágio\" pela rede que o prosumidor continua usando como bateria virtual. Resultado: milhões de unidades e ~40 GW (ANEEL/ABSOLAR — vivo), a usina invisível da Aula 01." },
    { kind: 'titulo', numero: "5.2", texto: "O preço do meio-dia e a fatura das 19h" },
    { kind: 'paragrafo', html: "Operacionalmente, a solar é a fonte mais previsível e mais rígida do portfólio: o perfil é o relógio. Toda a entrega se concentra entre ~6h e ~18h, pico ao meio-dia — <em>exatamente o desenho da barriga da curva líquida</em> do Módulo 02. As consequências sistêmicas, você já conhece os nomes: meio-dia com energia sobrando (PLD batendo no piso regulatório, na casa de R$ 60 — ANEEL recalcula o piso anualmente, vivo), <strong>canibalização</strong> (cada novo MW solar gera nas mesmas horas dos anteriores e corrói o próprio preço), rampa do fim da tarde para quem é despachável, e curtailment onde falta fio. Use o instrumento — agora com as duas variáveis juntas:" },
    { kind: 'nota', tom: "gold", label: "Onde isso entra no produto", html: "Dupla porta de entrada. No <strong>Conta de Luz Express</strong>: faturas com créditos de SCEE são leitura obrigatória — enquadramento na transição da Lei 14.300, valoração dos créditos, e o erro comum de dimensionamento que gera crédito sobrando ou faltando. No <strong>GridAlpha Simulate</strong>: o estudo solar da planta — telhado/pátio via MMGD versus autoprodução versus contrato por fonte no livre — modelado contra a curva de carga real, sempre como <em>oportunidades potenciais a validar</em>, com a régua certa para cada modalidade. É exatamente o estudo que a Operação A vai receber no § Caso." },
  ],
  'aula-03-06': [
    { kind: 'titulo', numero: "6.1", texto: "Ciclo simples, ciclo combinado: a mesma chama, dois rendimentos" },
    { kind: 'paragrafo', html: "<strong>Ciclo simples (ou aberto)</strong>: uma turbina a gás — essencialmente um motor de avião estacionário — queima o combustível e gira o gerador. Eficiência na casa de 35–40%: dois terços da energia do gás saem pela chaminé como calor. Em troca, parte rápido (minutos) e segue carga com agilidade. É a máquina de ponta e emergência. <strong>Ciclo combinado</strong>: aproveita o calor de exaustão para gerar vapor e girar uma segunda turbina. Eficiência sobe para 55–60% — o melhor rendimento térmico do portfólio — ao custo de partida mais lenta e CAPEX maior. É a máquina de quem espera rodar muitas horas." },
    { kind: 'paragrafo', html: "A estrutura de custo cabe numa equação que você vai usar a vida inteira:" },
    { kind: 'formula', eq: "CVU ≈ Preço do combustível × Heat rate + O&M variável", desc: "Heat rate = quanta energia de combustível a máquina queima por MWh elétrico — o inverso da eficiência" },
    { kind: 'paragrafo', html: "Leia a equação como analista: <span class=\"hl\">a térmica é um conversor de preço de combustível em preço de energia</span>. Gás caro no mercado internacional = CVU alto = teto de preço alto nas horas em que ela marca a margem. O Brasil importa parte do gás (Bolívia, GNL spot), e o GNL chega indexado ao humor do mercado global — foi ele que, em 2021, empurrou CVUs acima de <strong>R$ 1.000/MWh</strong> para dentro do despacho, mês após mês, durante a crise hídrica. A bandeira de escassez hídrica de R$ 14,20/100 kWh que o consumidor pagou (ANEEL, 2021) era, na raiz, heat rate vezes preço de GNL." },
    { kind: 'titulo', numero: "6.2", texto: "O paradoxo da inflexibilidade" },
    { kind: 'paragrafo', html: "Aqui entra a sutileza que separa quem leu de quem operou: parte do parque térmico brasileiro é <em>contratualmente inflexível</em>. Contratos de gás com cláusula <strong>take-or-pay</strong> (paga mesmo sem consumir) e usinas com compromissos de geração mínima criam térmicas que rodam <em>mesmo quando o sistema não precisa</em> — às vezes ao lado de vento sendo cortado no mesmo subsistema. Esse despacho fora da ordem de mérito vira encargo (o ESS que você conheceu no Módulo 02). A lição estrutural: <strong>flexibilidade não é atributo da turbina, é atributo do conjunto máquina + contrato + combustível</strong>. Uma turbina ágil presa a um take-or-pay é um atleta de pernas amarradas." },
    { kind: 'paragrafo', html: "O cenário institucional completa o quadro: o <strong>Novo Mercado de Gás</strong> abriu o setor pós-monopólio da Petrobras, mas a malha de gasodutos continua limitada a uma fração do território — térmica a gás só nasce onde o gás chega (ou onde o GNL atraca). E o mapa societário mudou: a <strong>Âmbar Energia (grupo J&F)</strong> comprou o parque térmico da antiga Eletrobras em 2024 e se tornou protagonista do segmento — movimento que volta a importar na Aula 08, com a mesma compradora batendo em outra porta." },
    { kind: 'nota', tom: "red", label: "Números vivos · verificar na fonte antes de uso externo", html: "CVUs reais são homologados e atualizados continuamente (ANEEL/CCEE, por usina) e oscilam com câmbio e cotação de combustível — as faixas deste módulo (GN ciclo combinado na casa de R$ 150–300, ciclo simples R$ 300–600, GNL spot podendo passar de R$ 1.000 em crise) são <strong>ordens de grandeza pedagógicas</strong>. Antes de citar em material externo: tabela de CVU vigente na CCEE. O episódio 2021 (CVUs &gt; R$ 1.000 despachados, bandeira escassez R$ 14,20/100 kWh) é histórico documentado — esse pode citar com data." },
    { kind: 'nota', tom: "gold", label: "Onde isso entra no produto", html: "O <strong>Brazil Pulse</strong> acompanha a geração térmica despachada e o CMO/PLD — quando a pilha começa a subir na direção dos CVUs altos, o cliente industrial é avisado <em>antes</em> da bandeira mudar. É o mesmo instrumento desta aula, com dado vivo do ONS/CCEE, traduzido para quem paga a conta: inteligência independente, sem nada a vender além da própria leitura." },
  ],
  'aula-03-07': [
    { kind: 'titulo', numero: "7.1", texto: "Carvão: o fim de linha programado" },
    { kind: 'paragrafo', html: "O carvão brasileiro é pequeno (~2–3 GW, SIGA — vivo) e geograficamente concentrado: <strong>Candiota</strong> e o polo de Santa Catarina/Rio Grande do Sul, queimando carvão nacional de baixo poder calorífico, ao lado da mina. A fonte sobrevive por contratos legados e subsídios explícitos (encargos setoriais), não por competitividade — e tem aposentadoria marcada em lei e em política energética, com o debate real deslocado para a <strong>transição justa</strong>: o que fazer com as cidades, empregos e cadeias que vivem da mina. Para o analista, o carvão é o lembrete de que tecnologia de geração também é política regional — uma usina pode ser inviável na planilha e inadiável no mapa eleitoral." },
    { kind: 'titulo', numero: "7.2", texto: "Óleo e diesel: a energia mais cara para quem menos pode pagar" },
    { kind: 'paragrafo', html: "No SIN, óleo combustível e diesel são a última prateleira da pilha — CVUs de R$ 1.000–2.000/MWh (CCEE — vivo), acionados em emergência. Mas o papel estrutural deles está fora do mapa do SIN: os <strong>sistemas isolados</strong> da Amazônia, centenas de localidades onde a energia chega de barcaça, em tambor de diesel, rio acima. O sobrecusto é socializado nacionalmente pela <strong>CCC</strong> (Conta de Consumo de Combustíveis), o encargo que você conheceu no Módulo 02. Eis o <span class=\"hl\">paradoxo amazônico</span>: a energia mais cara do país atende as populações de menor renda — e todo consumidor brasileiro ajuda a pagar. É também a fronteira de disrupção mais óbvia do setor: solar + bateria competindo contra diesel a mil reais o MWh é a conta mais fácil do Brasil, e os leilões de suprimento dos isolados já refletem essa transição (EPE — vivo)." },
    { kind: 'titulo', numero: "7.3", texto: "Biomassa: a usina que segue o calendário da cana" },
    { kind: 'paragrafo', html: "A biomassa sucroenergética é a térmica renovável do portfólio: ~15–17 GW (SIGA/UNICA — vivo) queimando sobretudo <strong>bagaço de cana</strong> em cogeração — a usina de açúcar e etanol gera vapor de processo e eletricidade, e exporta o excedente à rede. O detalhe que transforma curiosidade em tese: a safra do Centro-Sul vai de <strong>abril a novembro</strong> — precisamente a estação seca dos reservatórios. <span class=\"hl\">Quando a água some, a cana chega.</span> É a segunda complementaridade sazonal de presente geofísico (a primeira foi o vento do NE, Aula 04). Limites com a mesma honestidade: a biomassa é despachável <em>dentro da safra</em> — o combustível obedece ao calendário agrícola, não ao ONS; fora da safra, o parque hiberna ou queima combustível alternativo. E a decisão de gerar compete com a decisão de produzir açúcar e etanol — o despacho dela tem um custo de oportunidade agrícola, análogo conceitual do valor da água." },
    { kind: 'tabela', linhas: [["Tecnologia", "Escala (ordem)", "CVU típico", "Papel real no sistema"], ["<b>Carvão</b>", "~2–3 GW", "R$ 200–350", "Legado em saída programada; questão de transição justa regional"], ["<b>Óleo / diesel</b>", "poucos GW no SIN + isolados", "R$ 1.000–2.000", "Emergência no SIN; espinha dorsal (cara) dos sistemas isolados via CCC"], ["<b>Biomassa (bagaço)</b>", "~15–17 GW", "moderado, sazonal", "Térmica renovável da estação seca — complementar à hidrologia"]] },
    { kind: 'paragrafo', html: "Faixas: SIGA, CCEE, UNICA — ordens de grandeza vivas. A síntese da aula: essas três fontes provam que \"térmica\" não é uma categoria — é três contratos diferentes com a realidade. Uma paga dívida histórica regional, outra paga o custo de existir longe do fio, a terceira paga em renovável a conta da estiagem." },
    { kind: 'nota', tom: "gold", label: "Onde isso entra no produto", html: "Para clientes do agronegócio e da indústria sucroenergética, a biomassa abre a conversa inversa do GridAlpha: o cliente não é só consumidor — pode ser <strong>gerador</strong>. O <strong>Simulate</strong> modela o trade-off exportar energia × consumir no processo × vender no livre, com o calendário de safra como restrição. Mesmo rigor, outro lado do medidor — e sempre oportunidades potenciais a validar." },
  ],
  'aula-03-08': [
    { kind: 'titulo', numero: "8.1", texto: "O parque real: dois reatores e um canteiro de 39 anos" },
    { kind: 'paragrafo', html: "O Brasil opera <strong>Angra 1</strong> (640 MW, em operação desde 1985) e <strong>Angra 2</strong> (1.350 MW, desde 2001) — juntas, ~2 GW, na casa de 1% da capacidade e ~2–3% da energia do país (Eletronuclear/ONS — vivo), ancorando tensão e base no Sudeste, coladas no maior centro de carga. A operadora, <strong>Eletronuclear</strong>, ficou fora da privatização da Eletrobras por exigência constitucional: a atividade nuclear é monopólio da União (CF, art. 21 e 177) — controle estatal via ENBPar." },
    { kind: 'paragrafo', html: "E há <strong>Angra 3</strong>: iniciada em <strong>1984</strong>, paralisada, retomada, paralisada de novo (Lava Jato), hoje com obra civil substancialmente avançada e <strong>39 anos de canteiro</strong>. Os números da decisão em curso (imprensa setorial/Eletronuclear, dez/2025–fev/2026 — vivos): concluir custa na casa de <strong>R$ 24 bilhões</strong>; abandonar, até <strong>R$ 26 bilhões</strong> (distratos, dívidas, descomissionamento). Enquanto nada se decide, a usina parada consome <strong>~R$ 1 bilhão por ano</strong> — R$ 800 milhões só de juros de dívida com BNDES e Caixa — sem entregar um MWh. A tarifa discutida para viabilizar a conclusão gira em <strong>R$ 778–817/MWh</strong> — contra solar nova contratada na casa de R$ 170. E o tabuleiro societário se moveu: no fim de 2025, a <strong>AXIA</strong> (ex-Eletrobras) vendeu sua fatia na Eletronuclear (~68% do capital total, 35,3% do votante) à <strong>Âmbar Energia (J&F)</strong> por R$ 535 milhões — a mesma compradora das térmicas da Aula 06 — com o controle permanecendo com a União/ENBPar e a decisão final sobre a obra nas mãos do <strong>CNPE</strong>, ainda pendente." },
    { kind: 'nota', tom: "red", label: "Números vivos · Angra 3 é noticiário em movimento", html: "Tudo no parágrafo acima — custos de conclusão vs descontinuidade, tarifa de referência, situação societária Âmbar/ENBPar, caixa da Eletronuclear, decisão do CNPE — estava em aberto na última verificação (jun/2026) e <strong>pode ter mudado na semana do Summit</strong>. Antes de citar: notícias MME/CNPE e comunicados Eletronuclear da semana. A estrutura analítica da aula não muda; os números, sim." },
    { kind: 'titulo', numero: "8.2", texto: "A lição que vale para qualquer ativo de capital pesado" },
    { kind: 'paragrafo', html: "O debate público trata Angra 3 como questão de segurança nuclear. O debate técnico é outro: <span class=\"hl\">é uma aula sobre o que o tempo faz com capital parado</span>. Em ativos de CAPEX dominante, o inimigo não é o risco físico — é o prazo. Juros durante a construção capitalizam; cada ano de atraso compõe sobre bilhões; e uma usina que ficaria competitiva concluída em 6 anos vira inviável concluída em 40. França e Coreia constroem reatores em série e diluem aprendizado; o Brasil construiu um a cada vinte anos e pagou a curva de aprendizado inteira, três vezes. A fórmula do LCOE da Aula 10 vai mostrar isso friamente: com WACC de dois dígitos e décadas de obra, <strong>nenhuma física salva a planilha</strong>." },
    { kind: 'paragrafo', html: "O contraponto honesto, para não virar torcida contrária: 2 GW firmes, sem carbono, com FC de 88%, colados na carga do Sudeste, têm valor sistêmico real — firmeza, diversidade, suporte de tensão. A pergunta de adulto não é \"nuclear sim ou não\": é <em>\"este projeto específico, com este histórico de capital, entrega esse valor a que custo — e quem paga a diferença?\"</em>. Pequenos reatores modulares (SMRs) prometem atacar exatamente o problema do prazo e da escala — promessa em validação no mundo, horizonte distante no Brasil." },
    { kind: 'nota', tom: "gold", label: "Onde isso entra no produto", html: "Nenhum cliente industrial vai comprar energia de Angra 3 amanhã — mas todo cliente vive num sistema que decide, neste exato momento, se soma R$ 24 bilhões à conta coletiva. Saber narrar Angra 3 em três minutos — capital, prazo, tarifa de referência, quem paga — é o tipo de fluência que estabelece autoridade numa mesa de Summit. É conteúdo de <strong>Brazil Pulse</strong> editorial: o número vivo, a fonte, e a leitura independente que ninguém com usina para vender faria." },
  ],
  'aula-03-09': [
    { kind: 'titulo', numero: "9.1", texto: "MW e MWh: a ficha técnica em duas dimensões" },
    { kind: 'paragrafo', html: "Toda bateria é definida por dois números independentes: <strong>potência</strong> (MW — a largura do cano: quanto entrega de uma vez) e <strong>energia</strong> (MWh — o tamanho do tanque: por quanto tempo sustenta). A razão entre eles é a <strong>duração</strong> — e a duração define a vocação: menos de 1 hora, é máquina de serviços rápidos (regulação de frequência, a resposta em milissegundos que a perda de inércia do Módulo 02 valorizou); 2–4 horas, é a ferramenta clássica de pico e arbitragem — carrega na barriga solar do meio-dia, descarrega na rampa das 17–21h, exatamente a janela do INST·05; acima disso, começa a disputar o território do deslocamento longo, onde a reversível hidráulica e o próprio reservatório reinam." },
    { kind: 'titulo', numero: "9.2", texto: "O leilão de 2026: o que o Brasil está comprando" },
    { kind: 'paragrafo', html: "O marco aconteceu <strong>agora</strong> — na semana anterior ao Summit. Em <strong>3 de junho de 2026</strong>, o MME publicou a <strong>Portaria Normativa nº 136/2026</strong> com as diretrizes do que chama de leilão inédito de baterias: o <strong>LRCAP 2026 – Armazenamento</strong>, em dois certames — 2 de dezembro (produto com requisitos de nacionalização, credenciamento BNDES) e 4 de dezembro (aberto a qualquer sistema). Contratos de <strong>15 anos</strong>, suprimento a partir de <strong>1º de agosto de 2028</strong>, cadastro dos projetos na EPE entre <strong>15 de junho e 31 de julho de 2026</strong> (MME — verificado em jun/2026). E o detalhe que conecta tudo o que você estudou: <span class=\"hl\">o produto leiloado é potência (MW), não energia</span> — o sistema está comprando a largura do cano para as horas críticas, sob despacho do ONS, não o tanque em si." },
    { kind: 'paragrafo', html: "Leia o leilão como capítulo da história que este módulo contou: o LRCAP de potência de março/2026 contratou ~19 GW majoritariamente térmicos, e o ONS seguiu apontando que os critérios de segurança até 2030 ainda não fecham (vivo). O fio d'água não trouxe estoque novo (Aula 03); solar e eólica trouxeram energia sem comando (Aulas 04–05); a térmica cobre, mas a preço de combustível (Aula 06). A bateria entra como a peça que falta na rampa — e como alternativa que <em>não queima nada</em> para entregar potência às 19h." },
    { kind: 'titulo', numero: "9.3", texto: "A escala que humilha: a bateria que já existia" },
    { kind: 'paragrafo', html: "Agora o fechamento que conecta com a Aula 02. A capacidade de armazenamento dos reservatórios do SIN está na casa de <strong>200 TWh</strong> de energia equivalente (ONS — ordem viva). Um grande complexo de baterias de classe mundial mede-se em poucos <strong>GWh</strong>. São <span class=\"hl\">cinco ordens de grandeza</span>. A conclusão correta não é \"bateria é irrelevante\" — é que <strong>operam em escalas de tempo diferentes</strong>: o reservatório desloca energia entre <em>estações</em>; a bateria, entre <em>horas</em>. A bateria não veio substituir o reservatório — veio substituir a térmica de ponta, o diesel de emergência e o corte de renovável. Cada tecnologia de estoque tem seu fuso horário." },
    { kind: 'nota', tom: "red", label: "Números vivos · o leilão está em andamento agora", html: "Cronograma, demanda contratada, preços-teto e regras do LRCAP 2026 – Armazenamento podem mudar por errata, questionamento de tribunal de contas ou nova portaria — <strong>verificar gov.br/mme e EPE na semana de qualquer citação</strong>. Custos de bateria (queda da ordem de 80–90% na década — BNEF/Lazard) e a fronteira lítio LFP × sódio também são vivos. Em jun/2026, este era o estado: Portaria 136/2026, certames 2 e 4/dez, 15 anos, suprimento ago/2028." },
    { kind: 'nota', tom: "gold", label: "Onde isso entra no produto", html: "Atrás do medidor, a mesma física vira decisão industrial: a Operação A tem gerador diesel de emergência e tarifa com ponta cara — bateria entra como candidata a <em>cortar demanda de ponta, segurar processo crítico e aposentar parte do diesel</em>. O <strong>GridAlpha Simulate</strong> roda exatamente esse estudo: curva de carga real × tarifa × cenários de bateria, com payback apresentado como faixa e premissas abertas — oportunidades potenciais a validar com medição, nunca promessa de fornecedor. E o LRCAP de dezembro é pauta quente de <strong>Brazil Pulse</strong> no mês do Summit." },
  ],
  'aula-03-10': [
    { kind: 'formula', eq: "LCOE ≈ ( CAPEX anualizado + O&M fixo ) ÷ Energia anual + Custo variável", desc: "CAPEX anualizado via fator de recuperação de capital — onde o WACC e a vida útil moram" },
    { kind: 'paragrafo', html: "Duas alavancas dominam a fórmula. <strong>O denominador é o fator de capacidade</strong>: a mesma usina entregando o dobro de energia tem metade do custo unitário de capital — é por isso que o vento do NE e o tracker solar venceram leilões. <strong>O WACC governa o numerador</strong>: em ativos de capital pesado, cada ponto de custo de capital pesa mais que qualquer otimização de engenharia — é a matemática que condenou Angra 3 e que faz a mesma usina solar ter LCOEs diferentes em países diferentes. Manipule as duas no instrumento:" },
    { kind: 'titulo', numero: "10.1", texto: "Os quatro limites do LCOE — memorize como vacina" },
    { kind: 'tabela', linhas: [["#", "Limite", "O que ele esconde"], ["<b>1</b>", "Compara energia, não atributos", "Firmeza, flexibilidade, inércia, localização — tudo que as Aulas 02–09 mostraram ter preço — não aparecem no número. Um MWh firme das 19h e um MWh variável do meio-dia saem \"iguais\"."], ["<b>2</b>", "FC de térmica é circular", "O LCOE do gás depende de quantas horas ele roda — que depende do resto do sistema. Comparar LCOE de térmica flexível com LCOE de solar é comparar um seguro com uma commodity."], ["<b>3</b>", "Cega para o valor temporal", "Com canibalização, o MWh solar marginal captura preço cada vez menor. Custo médio baixo com receita média em queda — o LCOE não vê o segundo termo."], ["<b>4</b>", "Ignora custo de integração", "Transmissão de escoamento, reserva adicional, curtailment, serviços ancilares — custos reais que a fonte impõe ao sistema e a planilha individual não carrega."]] },
    { kind: 'paragrafo', html: "O conceito sucessor — valor de sistema, ou \"LCOE ajustado\" — pergunta o que cada MWh <em>vale</em> dado quando e onde entra. É a lógica que mercados internacionais de preço nodal levam ao limite, precificando cada hora e cada barra; o desenho brasileiro chega lá por outros caminhos (leilões de produto, encargos, o próprio LRCAP de potência). A régua certa para decisão nunca é o custo da usina isolada: é <strong>o custo do sistema com e sem ela</strong>." },
    { kind: 'titulo', numero: "10.2", texto: "A síntese: o portfólio como time" },
    { kind: 'paragrafo', html: "Feche o módulo com a imagem que organiza tudo — e que se sustenta numa conversa de cinco minutos. A matriz brasileira é um time: a <strong>hidro com reservatório</strong> é a capitã — barata, flexível, com inércia, limitada pelo estoque; <strong>fio d'água, eólica e solar</strong> são o ataque de volume — energia abundante de custo variável zero, cada uma com seu relógio e seu calendário; a <strong>biomassa</strong> é o reforço da estação seca; a <strong>nuclear</strong>, a zagueira fixa que nunca sai de campo; o <strong>gás</strong>, o goleiro caro que ganha o jogo nas noites difíceis — e cobra por disponibilidade, como os jogadores de banco do Módulo 02; a <strong>bateria</strong>, a substituta veloz que entra justamente nos minutos da rampa. Nenhuma peça é \"a melhor\" — e o instrumento final mostra o porquê em doze meses:" },
    { kind: 'nota', tom: "gold", label: "Onde isso entra no produto", html: "A tese do <strong>GridAlpha Simulate</strong> é esta aula aplicada ao lado do consumidor: nenhuma proposta — solar no pátio, PPA eólico, bateria, autoprodução — é avaliada pelo custo isolado da fonte, e sim pelo efeito no <em>portfólio de suprimento do cliente</em>: curva de carga real, sazonalidade contratada, exposição residual ao curto prazo. Custo da planta com e sem a peça — a régua de sistema, na escala da fábrica. Independência metodológica é o moat: quem vende a peça nunca fará essa conta contra a própria peça." },
  ],
};

/** O exercício que NÃO aponta aula (`Ex · 10 · Síntese`). */
export const MODULO_03_EXERCICIOS_SOLTOS: LessonActivity[] = [
  {
    id: "ex-10",
    kind: 'discursiva' as const,
    prompt: "Teste dos três níveis: explique <b>\"por que o sistema não compra fontes, compra atributos\"</b> em três versões — criança de 12 anos, diretor industrial, especialista de setor. Fale em voz alta antes de abrir.",
    points: 1,
    config: { tag: "Ex · 10 · Síntese", gabarito: "<b>Criança:</b> um time não compra \"o melhor jogador\" cinco vezes — compra goleiro, zagueiro e atacante, porque o jogo precisa de funções diferentes; a eletricidade também: tem usina barata, usina que liga na hora, usina que guarda. <b>Diretor:</b> sua conta paga produtos distintos — energia em volume, potência firme nas horas caras, flexibilidade e qualidade; cada tecnologia entrega um pacote diferente desses produtos, e o contrato bom compra o encaixe contra a sua curva de carga, não a etiqueta da fonte. <b>Especialista:</b> a otimização do sistema valora separadamente energia, capacidade, flexibilidade, inércia e localização sob restrições de rede e estoque; tecnologias são cestas distintas desses atributos, e a expansão eficiente resolve um problema de portfólio — razão pela qual ranking por LCOE não reproduz nem o despacho nem o plano ótimo." },
  },
];

export const MODULO_03_AULAS: CurriculumAula[] = [
  {
    id: 'aula-03-01',
    moduleId: 'modulo-03',
    number: 1,
    totalInModule: 10,
    title: "Capacidade, energia e o fator que liga as duas.",
    subtitle: "A matriz em três lentes",
    track: 'universal',
    language: 'pt-BR',
    durationMinutes: null,
    difficulty: null,
    submercados: [],
    competencies: [],
    illustrations: [],
    video: null,
    activities: [
      {
        id: "ex-01",
        kind: 'discursiva' as const,
        prompt: "Uma UFV de <b>200 MW</b> opera com FC de <b>28%</b>. Quanta energia ela entrega por ano, em GWh? E que potência uma usina nuclear (FC 88%) precisaria ter para entregar o mesmo?",
        points: 1,
        config: { tag: "Ex · 01 · Aula 01", gabarito: "E = 200 × 8.760 × 0,28 = <span class=\"calc\">490.560 MWh ≈ 490 GWh/ano</span>. Para a mesma energia com FC 88%: P = 490.560 ÷ (8.760 × 0,88) = <span class=\"calc\">≈ 64 MW</span>. Três vezes menos potência para a mesma energia — é o fator de capacidade convertendo MW de manchete em MWh de realidade. Nenhuma das duas é \"melhor\": entregam a mesma energia com atributos completamente diferentes." },
      },
      {
        id: "ex-02",
        kind: 'discursiva' as const,
        prompt: "Manchete: \"Brasil bate recorde com 25% da capacidade vinda da energia solar\". Um diretor pergunta: \"então um quarto da nossa energia é solar?\". Corrija em três frases.",
        points: 1,
        config: { tag: "Ex · 02 · Aula 01", gabarito: "Não — 25% da <b>capacidade</b> não é 25% da <b>energia</b>. Como o FC solar (~25–30%) é cerca de metade do FC médio do resto do parque, a participação na energia gerada fica na casa de 10%. E parte dessa solar é MMGD, que nem aparece como geração nos painéis do operador — aparece como redução de carga. Capacidade, energia e fator de capacidade: três lentes, três números." },
      },
    ],
    references: [],
    instruments: [INSTRUMENTOS_MODULO_03[0], INSTRUMENTOS_MODULO_03[1]],
  },
  {
    id: 'aula-03-02',
    moduleId: 'modulo-03',
    number: 2,
    totalInModule: 10,
    title: "A bateria que veio antes do lítio.",
    subtitle: "Hidrelétrica com reservatório",
    track: 'universal',
    language: 'pt-BR',
    durationMinutes: null,
    difficulty: null,
    submercados: [],
    competencies: [],
    illustrations: [],
    video: null,
    activities: [
      {
        id: "ex-03",
        kind: 'discursiva' as const,
        prompt: "Duas hidrelétricas de <b>1.000 MW</b> cada: uma com grande reservatório, outra a fio d'água num rio de forte sazonalidade. Num setembro seco, qual gera mais? E qual \"vale mais\" para o sistema naquele mês? Justifique com os conceitos certos.",
        points: 1,
        config: { tag: "Ex · 03 · Aulas 02–03", gabarito: "A fio d'água gera o que a vazão de setembro permitir — tipicamente uma fração pequena da capacidade (no Xingu, o vale chega a ~10–20% — ONS, vivo). A de reservatório gera o que o <b>despacho decidir</b>, sacando do estoque acumulado na cheia — pode sustentar perto da capacidade. Em setembro, o MWh das duas custa \"zero\" de combustível, mas o da reservatório carrega valor da água e entrega <b>firmeza</b> — o atributo escasso do mês. Mesma placa de 1.000 MW, produtos diferentes: energia média vs energia firme." },
      },
    ],
    references: [],
    instruments: [INSTRUMENTOS_MODULO_03[2]],
  },
  {
    id: 'aula-03-03',
    moduleId: 'modulo-03',
    number: 3,
    totalInModule: 10,
    title: "A hidrelétrica que não escolhe quando gerar.",
    subtitle: "Fio d'água",
    track: 'universal',
    language: 'pt-BR',
    durationMinutes: null,
    difficulty: null,
    submercados: [],
    competencies: [],
    illustrations: ["ger-06-usina-fio-dagua.png", "ger-07-pch-rio-encaixado.png"],
    video: null,
    activities: [],
    references: [],
    instruments: [INSTRUMENTOS_MODULO_03[3]],
  },
  {
    id: 'aula-03-04',
    moduleId: 'modulo-03',
    number: 4,
    totalInModule: 10,
    title: "O vento de classe mundial do Nordeste.",
    subtitle: "Eólica",
    track: 'universal',
    language: 'pt-BR',
    durationMinutes: null,
    difficulty: null,
    submercados: [],
    competencies: [],
    illustrations: ["ger-14-aerogerador-onshore.png", "ger-17-aerogerador-offshore.png"],
    video: null,
    activities: [
      {
        id: "ex-04",
        kind: 'discursiva' as const,
        prompt: "Dois sítios eólicos: vento médio de <b>8 m/s</b> no sítio A e <b>10 m/s</b> no sítio B. Usando só a física da aula, estime quantas vezes mais energia por área o sítio B oferece. (Ignore curva de potência e limites da turbina.)",
        points: 1,
        config: { tag: "Ex · 04 · Aula 04", gabarito: "P ∝ v³ → razão = (10/8)³ = 1,25³ = <span class=\"calc\">≈ 1,95 — praticamente o dobro</span>. Vinte e cinco por cento mais vento, cem por cento mais energia disponível: é o cubo que faz micrositing valer fortunas, torres crescerem e o litoral do NE virar ativo de classe mundial. (Na turbina real, a curva de potência satura na nominal — mas a vantagem econômica do sítio B sobrevive inteira.)" },
      },
    ],
    references: [],
    instruments: [],
  },
  {
    id: 'aula-03-05',
    moduleId: 'modulo-03',
    number: 5,
    totalInModule: 10,
    title: "A fonte que quebrou a curva de custos — e endureceu o relógio.",
    subtitle: "Solar — UFV e MMGD",
    track: 'universal',
    language: 'pt-BR',
    durationMinutes: null,
    difficulty: null,
    submercados: [],
    competencies: [],
    illustrations: ["ger-18-modulo-fotovoltaico.png", "ger-20-usina-solar-centralizada.png", "ger-21-telhado-solar-residencial.png"],
    video: null,
    activities: [
      {
        id: "ex-05",
        kind: 'discursiva' as const,
        prompt: "Explique por que <b>1 MWh gerado no telhado da fábrica</b> (MMGD) pode valer mais para o dono do que <b>1 MWh comprado de uma UFV</b> — mesmo sendo a mesma física e, muitas vezes, o telhado custando mais caro por MWh gerado.",
        points: 1,
        config: { tag: "Ex · 05 · Aula 05", gabarito: "Porque as réguas são diferentes. O MWh do telhado evita a <b>tarifa cheia de varejo</b> — energia + fio + encargos + tributos (com a transição do Fio B da Lei 14.300 descontando parte do fio). O MWh da UFV compete no <b>atacado</b>, contra preço de geração. Como o varejo custa múltiplas vezes o atacado, a MMGD fecha conta com LCOE que seria perdedor em leilão. Mesma tecnologia, economias opostas — é o limite nº 1 do LCOE aplicado: o valor depende de <i>onde</i> o MWh entra." },
      },
    ],
    references: [],
    instruments: [INSTRUMENTOS_MODULO_03[4]],
  },
  {
    id: 'aula-03-06',
    moduleId: 'modulo-03',
    number: 6,
    totalInModule: 10,
    title: "A flexibilidade que se paga — e o sistema paga.",
    subtitle: "Térmicas a gás",
    track: 'universal',
    language: 'pt-BR',
    durationMinutes: null,
    difficulty: null,
    submercados: [],
    competencies: [],
    illustrations: ["ger-08-termica-ciclo-combinado.png", "ger-09-turbina-gas-corte.png", "ger-13-terminal-gnl.png"],
    video: null,
    activities: [
      {
        id: "ex-06",
        kind: 'discursiva' as const,
        prompt: "Pilha didática: renováveis must-run <b>45 GW</b> (custo ~0), nuclear <b>2 GW</b> (R$ 30), hidro reservatório <b>40 GW</b> (valor da água R$ 200), GN ciclo combinado <b>12 GW</b> (R$ 250), GN ciclo simples <b>8 GW</b> (R$ 450), óleo <b>5 GW</b> (R$ 1.100). Demanda = <b>92 GW</b>. Fonte marginal e CMO? E se um take-or-pay obrigar 4 GW de GN simples a rodar na base, o que muda no custo total — sem mudar a demanda?",
        points: 1,
        config: { tag: "Ex · 06 · Aula 06", gabarito: "Empilhando: 45 + 2 + 40 = 87; faltam 5 → GN combinado na margem, <span class=\"calc\">CMO = R$ 250/MWh</span> (despachando 5 dos 12 GW). Com o take-or-pay: 4 GW de GN simples (R$ 450) rodam <i>fora da ordem</i>, deslocando 4 GW de geração mais barata; a margem econômica até melhora de posição (87 + 4 = 91; falta 1 do combinado), mas o sistema paga R$ 450 por energia que custaria R$ 250 — sobrecusto de despacho fora do mérito que não aparece no preço e vira <b>encargo (ESS)</b>. Flexibilidade é atributo do conjunto máquina + contrato." },
      },
    ],
    references: [],
    instruments: [INSTRUMENTOS_MODULO_03[5]],
  },
  {
    id: 'aula-03-07',
    moduleId: 'modulo-03',
    number: 7,
    totalInModule: 10,
    title: "O resto do parque térmico: o que cada um ainda resolve.",
    subtitle: "Carvão, óleo e biomassa",
    track: 'universal',
    language: 'pt-BR',
    durationMinutes: null,
    difficulty: null,
    submercados: [],
    competencies: [],
    illustrations: ["ger-22-cogeracao-bagaco.png"],
    video: null,
    activities: [],
    references: [],
    instruments: [],
  },
  {
    id: 'aula-03-08',
    moduleId: 'modulo-03',
    number: 8,
    totalInModule: 10,
    title: "Angra 3, ou: uma aula de custo de capital em concreto armado.",
    subtitle: "Nuclear",
    track: 'universal',
    language: 'pt-BR',
    durationMinutes: null,
    difficulty: null,
    submercados: [],
    competencies: [],
    illustrations: ["ger-11-reator-pwr-corte.png"],
    video: null,
    activities: [
      {
        id: "ex-07",
        kind: 'discursiva' as const,
        prompt: "Defenda em quatro frases, para um investidor, a tese: <b>\"Angra 3 não é um debate nuclear — é um debate de custo de capital.\"</b> Use pelo menos três números da aula (marcados como vivos).",
        points: 1,
        config: { tag: "Ex · 07 · Aula 08", gabarito: "Estrutura esperada: (1) a física e a segurança de Angra 3 são as mesmas de centenas de reatores PWR operando — o que a distingue são <b>39 anos de canteiro</b>; (2) capital parado compõe: são <b>~R$ 1 bilhão/ano</b> em juros e manutenção sem entregar um MWh; (3) a tarifa de referência discutida — <b>R$ 778–817/MWh</b> — contra solar leiloada na casa de R$ 170 mostra que o problema é o numerador de capital, não o reator; (4) e a decisão real do CNPE é entre R$ 24 bi para concluir e até R$ 26 bi para enterrar — ou seja, uma escolha entre dois passivos, governada por WACC e prazo, não por física. (Números vivos — reverificar antes de usar externamente.)" },
      },
    ],
    references: [],
    instruments: [],
  },
  {
    id: 'aula-03-09',
    moduleId: 'modulo-03',
    number: 9,
    totalInModule: 10,
    title: "A bateria desloca energia. Quem gera é o resto.",
    subtitle: "Armazenamento",
    track: 'universal',
    language: 'pt-BR',
    durationMinutes: null,
    difficulty: null,
    submercados: [],
    competencies: [],
    illustrations: ["ger-24-celula-litio-corte.png"],
    video: null,
    activities: [
      {
        id: "ex-08",
        kind: 'discursiva' as const,
        prompt: "Uma bateria de <b>100 MW / 400 MWh</b> com eficiência de ciclo de <b>88%</b> faz um ciclo completo por dia. Quanta energia ela desloca por dia, quanta consome para carregar e quanta perde? E por que o leilão de dezembro de 2026 pagaria por ela mesmo que o spread de preço entre horários fosse zero?",
        points: 1,
        config: { tag: "Ex · 08 · Aula 09", gabarito: "Desloca (entrega) <span class=\"calc\">400 MWh/dia</span>; consome 400 ÷ 0,88 ≈ <span class=\"calc\">455 MWh</span>; perde ≈ <span class=\"calc\">55 MWh/dia</span> em calor. E o LRCAP pagaria mesmo sem spread porque o produto leiloado é <b>potência (MW) disponível sob comando do ONS</b> — reserva de capacidade para as horas críticas, não arbitragem de energia. A receita do contrato remunera a largura do cano; o uso do tanque é instrução do operador. Confundir os dois produtos é confundir MW com MWh — o erro nº 5 da tabela de mitos." },
      },
    ],
    references: [],
    instruments: [INSTRUMENTOS_MODULO_03[6]],
  },
  {
    id: 'aula-03-10',
    moduleId: 'modulo-03',
    number: 10,
    totalInModule: 10,
    title: "A planilha que ordena custos não é a planilha que decide o sistema.",
    subtitle: "LCOE, valor de sistema e portfólio",
    track: 'universal',
    language: 'pt-BR',
    durationMinutes: null,
    difficulty: null,
    submercados: [],
    competencies: [],
    illustrations: [],
    video: null,
    activities: [
      {
        id: "ex-09",
        kind: 'discursiva' as const,
        prompt: "Calcule o LCOE didático de uma UFV: CAPEX <b>R$ 3.500/kW</b>, O&M fixo <b>R$ 50/kW·ano</b>, FC <b>27%</b>, vida <b>25 anos</b>, WACC <b>10%</b> (CRF ≈ 0,110), variável zero. Depois diga, em uma frase por item, dois motivos pelos quais esse número <b>não</b> basta para decidir contra um PPA de gás.",
        points: 1,
        config: { tag: "Ex · 09 · Aula 10", gabarito: "Custo anual = 3.500 × 0,110 + 50 = <span class=\"calc\">R$ 435/kW·ano</span>. Energia anual = 8.760 × 0,27 = <span class=\"calc\">2.365 kWh = 2,365 MWh/kW</span>. LCOE = 435 ÷ 2,365 ≈ <span class=\"calc\">R$ 184/MWh</span>. Por que não basta: (1) <b>atributos</b> — o MWh solar é diurno e variável; o do gás é firme e sob comando: produtos diferentes pela mesma régua (limite 1); (2) <b>circularidade</b> — o LCOE do gás depende de quantas horas ele rodará, que depende justamente de quanta solar existe (limite 2). A comparação certa é custo do portfólio com e sem cada peça." },
      },
    ],
    references: [],
    instruments: [INSTRUMENTOS_MODULO_03[7], INSTRUMENTOS_MODULO_03[8]],
  },
];

export const getAulaModulo03 = (id: string) =>
  MODULO_03_AULAS.find((a) => a.id === id) ?? null;
