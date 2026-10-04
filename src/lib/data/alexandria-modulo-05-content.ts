// alexandria-modulo-05-content.ts
// Conteúdo real do Módulo 05 — Regulação e Desenho de Mercados.
// ÚLTIMO módulo da Trilha 1: com ele, Fundamentos Universais fecha.
//
// Extraído de `Alexandria modulos/alexandria_modulo05.html` por parsing
// determinístico, não por transcrição.
//
// VOCABULÁRIO DE CLASSE — medido, não presumido. Os sete seletores dos
// Módulos 01-03 dão ZERO neste arquivo (`class="aula"`, `aula-marker`,
// `exercise-tag`, `glossary-item`, `instrument-title`, `checklist-item`,
// `class="lead"`). O vocabulário é o do Módulo 04: `sec-id` delimita
// seção, `lede` é o lead, `inst` o instrumento, `box gd` a nota, `lv` o
// explicador em três níveis, `det-bd` o corpo de exercício.
//
// CONTAGEM: 16 seções `sec-id` = 6 aulas + 10 de aparato (§00, §MAP,
// §Caso, §Erros, §Ex, §Quiz, §Voz, §Final, §Lex, §Ref). Os seis títulos
// batem 1:1 com os `<h3>` da fonte (3,5,4,6,7,5). 126 blocos de apostila.
//
// O QUE A FONTE NÃO DECLARA — verificado, não herdado:
//   · vídeo       → `video: null` nas seis. Zero `<video>`, `<iframe>`,
//                   'youtube', 'vimeo' e '.mp4' no arquivo inteiro.
//   · duração     → `durationMinutes: null`.
//   · dificuldade → `difficulty: null`. As ocorrências de "nível" são
//                   prosa ("achar seu nível", "por nível de tensão",
//                   "custo nivelado"), nenhuma é marcador.
//   · gravura     → `illustrations: []` nas seis. `bloco-05` tem
//                   `illustrationPrefix: null` desde a FOUNDRY Wave 1;
//                   não existe conjunto de gravura para este bloco.
//
// TRÊS PRECEDENTES DA WAVE 24, TODOS REPETIDOS AQUI:
//
// 1. `kind` fora de `InstrumentKind` — duas vezes. `Termômetro`
//    (Inst 04) e `Mapa` (Inst 06) não são membros do tipo. Título
//    literal preservado na tela; mapeamento interno decidido pela
//    MECÂNICA, não pelo nome:
//      · Termômetro → `quebra-cabeca`: oito chaves booleanas
//        independentes com peso + um campo numérico → índice. É a
//        mesma mecânica do quebra-cabeça do Módulo 03.
//      · Mapa → `simulador`: três campos numéricos → posição e
//        veredito, idêntico aos quatro `Simulador` deste módulo.
//
// 2. Saída inerentemente textual — quatro delas, em três instrumentos:
//    `i2-b` (grau ótimo: 'Contábil'/'Funcional'/'Jurídica'/'Societária'),
//    `i4-r` (reprodutibilidade: 'não'/'parcial'/'sim'), `i6-q`
//    (quadrante) e `i6-r` (risco dominante). `ResultadoInstrumento
//    .valores` é `Record<string, number>`, então não cabem — ficam fora,
//    e o veredito literal já carrega a informação em prosa.
//
// 3. Exercício sem vínculo a aula — testado EXPLICITAMENTE em resumo,
//    enunciado e gabarito dos dez: nove não mencionam aula nenhuma, e o
//    décimo tem "Aula 06" no fecho do gabarito como referência de
//    conteúdo ("é precisamente o caminho híbrido descrito na Aula 06"),
//    não como tag de posse — a tag dele é `10 · Onde plotar o sistema`,
//    sem aula, igual às outras nove. Os dez vão para
//    `MODULO_05_EXERCICIOS_SOLTOS`.

import type { CurriculumAula, Instrument, LessonActivity } from '@/lib/types/alexandria';
import type { AulaBloco } from './alexandria-modulo-01-content';


/** Os seis instrumentos, um por aula. O `kind` de `Termômetro` e `Mapa`
 *  é mapeamento interno por mecânica — o título literal da fonte é o que
 *  o aluno lê, e `InstrumentKind` é somente-leitura nesta wave.
 *
 *  Campos: a fonte pareia cada controle numérico com um `<input
 *  type="range">` gêmeo. São UM campo lógico — fica o `number`, que
 *  carrega value/min/max/step.
 *
 *  Os oito sinais do Termômetro vivem no `<script>`, não no markup: a
 *  `sig-grid` nasce vazia e é populada por JS. Extraídos de lá com os
 *  pesos literais (22+20+20+12+12+6+5+3 = 100). */
export const INSTRUMENTOS_MODULO_05: Instrument[] = [
  {
    id: "m05-inst-01",
    kind: "simulador",
    title: "Simulador · Quando duplicar a rede fica caro",
    formula: null,
    fields: [
      { id: "i1-q", label: "Consumidores no mercado", unit: "mil", kind: "range", defaultValue: 200, min: 5, max: 1000, step: 5 },
      { id: "i1-f", label: "Custo fixo de uma rede completa", unit: "R$ mi", kind: "range", defaultValue: 900, min: 50, max: 3000, step: 25 },
      { id: "i1-c", label: "Custo incremental por consumidor", unit: "R$/ano", kind: "range", defaultValue: 180, min: 20, max: 1200, step: 10 },
      { id: "i1", label: "Operadores concorrentes na área", unit: "redes", kind: "range", defaultValue: 1, min: 1, max: 6, step: 1 },
    ],
    outputs: [
      { id: "i1-cm", label: "Custo médio", unit: null },
      { id: "i1-c1", label: "Com rede única", unit: null },
      { id: "i1-w", label: "Desperdício", unit: null },
      { id: "i1-tf", label: "Custo fixo total", unit: null },
      { id: "i1-vd", label: "Veredito", unit: null },
    ],
    note: "Didático/ilustrativo — não usar para dimensionamento real. O modelo assume que cada operador replica integralmente o custo fixo e divide os consumidores igualmente, e converte o custo fixo em anuidade por um fator de recuperação de capital único de 10% ao ano. Redes reais têm compartilhamento parcial de infraestrutura, densidades muito diferentes por área e estrutura de custo por nível de tensão — nada disso está aqui.",
  },
  {
    id: "m05-inst-02",
    kind: "simulador",
    title: "Simulador · Grau de separação",
    formula: null,
    fields: [
      { id: "i2-g", label: "Grau de separação", unit: "1 contábil → 4 societária", kind: "range", defaultValue: 3, min: 1, max: 4, step: 1 },
      { id: "i2-c", label: "Dependência de coordenação", unit: "índice", kind: "range", defaultValue: 50, min: 0, max: 100, step: 5 },
      { id: "i2-f", label: "Qualidade da fiscalização de acesso", unit: "índice", kind: "range", defaultValue: 55, min: 0, max: 100, step: 5 },
    ],
    outputs: [
      { id: "i2-r", label: "Conflito residual", unit: null },
      { id: "i2-k", label: "Custo de coordenação", unit: null },
      { id: "i2-t", label: "Atrito total", unit: null },
      { id: "i2-b", label: "Grau de menor atrito", unit: null },
      { id: "i2-vd", label: "Veredito", unit: null },
    ],
    note: "Didático/ilustrativo — não usar para dimensionamento real. Os índices são adimensionais e construídos apenas para tornar visível o formato do trade-off: o conflito residual cai com o grau de separação e é atenuado pela fiscalização de acesso; o custo de coordenação sobe com o grau e é amplificado pela dependência de coordenação. Nenhum dos dois é mensurável desta forma em um sistema real.",
  },
  {
    id: "m05-inst-03",
    kind: "simulador",
    title: "Simulador · Composição de contratação",
    formula: null,
    fields: [
      { id: "i3-l", label: "Contrato longo", unit: "% do volume", kind: "range", defaultValue: 60, min: 0, max: 100, step: 5 },
      { id: "i3-c", label: "Contrato curto", unit: "% do volume", kind: "range", defaultValue: 25, min: 0, max: 100, step: 5 },
      { id: "i3-p", label: "Prêmio do contrato longo", unit: "R$/MWh", kind: "range", defaultValue: 40, min: -60, max: 160, step: 5 },
      { id: "i3-v", label: "Volatilidade do curto prazo", unit: "índice", kind: "range", defaultValue: 55, min: 0, max: 100, step: 5 },
    ],
    outputs: [
      { id: "i3-e", label: "Custo esperado", unit: null },
      { id: "i3-w", label: "Cenário ruim", unit: null },
      { id: "i3-a", label: "Amplitude", unit: null },
      { id: "i3-d", label: "Descoberto", unit: null },
      { id: "i3-vd", label: "Veredito", unit: null },
    ],
    note: "Didático/ilustrativo — não usar para dimensionamento real. Preço de referência do curto prazo fixado em R$ 200/MWh, com dispersão proporcional ao índice de volatilidade e cenário ruim tomado como a cauda superior da faixa simulada. Não há modelagem hidrológica, sazonalidade, submercado, encargo, perda nem tributo — o instrumento existe apenas para mostrar como a composição desloca simultaneamente nível e dispersão do custo.",
  },
  {
    id: "m05-inst-04",
    kind: "quebra-cabeca",
    title: "Termômetro · Risco de captura",
    formula: null,
    fields: [
      { id: "i4-m", label: "Materialidade da decisão", unit: "R$ mi/ano em jogo", kind: "range", defaultValue: 120, min: 1, max: 2000, step: 1 },
      { id: "i4-s0", label: "Resultado não reproduzível por terceiro (22 pts)", unit: null, kind: "select", defaultValue: "off", options: [{ value: "on", label: "Presente" }, { value: "off", label: "Ausente" }] },
      { id: "i4-s1", label: "Metodologia divulgada depois da decisão (20 pts)", unit: null, kind: "select", defaultValue: "off", options: [{ value: "on", label: "Presente" }, { value: "off", label: "Ausente" }] },
      { id: "i4-s2", label: "Dados de entrada não disponíveis (20 pts)", unit: null, kind: "select", defaultValue: "off", options: [{ value: "on", label: "Presente" }, { value: "off", label: "Ausente" }] },
      { id: "i4-s3", label: "Contribuições sem resposta motivada (12 pts)", unit: null, kind: "select", defaultValue: "off", options: [{ value: "on", label: "Presente" }, { value: "off", label: "Ausente" }] },
      { id: "i4-s4", label: "Tratamento assimétrico entre pares (12 pts)", unit: null, kind: "select", defaultValue: "off", options: [{ value: "on", label: "Presente" }, { value: "off", label: "Ausente" }] },
      { id: "i4-s5", label: "Decisão contraria metodologia publicada (6 pts)", unit: null, kind: "select", defaultValue: "off", options: [{ value: "on", label: "Presente" }, { value: "off", label: "Ausente" }] },
      { id: "i4-s6", label: "Trânsito de quadros sem quarentena efetiva (5 pts)", unit: null, kind: "select", defaultValue: "off", options: [{ value: "on", label: "Presente" }, { value: "off", label: "Ausente" }] },
      { id: "i4-s7", label: "Participação concentrada no próprio setor (3 pts)", unit: null, kind: "select", defaultValue: "off", options: [{ value: "on", label: "Presente" }, { value: "off", label: "Ausente" }] },
    ],
    outputs: [
      { id: "i4-n", label: "Sinais marcados", unit: null },
      { id: "i4-o", label: "Índice de opacidade", unit: null },
      { id: "i4-e", label: "Exposição", unit: null },
      { id: "i4-r", label: "Reprodutibilidade", unit: null },
      { id: "i4-vd", label: "Veredito", unit: null },
    ],
    note: "Didático/ilustrativo — não usar para dimensionamento real, e jamais como imputação a instituição ou pessoa. Os pesos são arbitrários e servem para treinar a hierarquia dos sinais: irreprodutibilidade e metodologia posterior pesam mais que participação desigual, porque as duas primeiras impedem qualquer verificação externa enquanto a terceira apenas a dificulta. A exposição é a materialidade ponderada pela opacidade.",
  },
  {
    id: "m05-inst-05",
    kind: "simulador",
    title: "Simulador · Ciclo de revisão tarifária",
    formula: null,
    fields: [
      { id: "i5-b", label: "Base de remuneração líquida", unit: "R$ mi", kind: "range", defaultValue: 4000, min: 200, max: 20000, step: 100 },
      { id: "i5-w", label: "WACC regulatório", unit: "% real a.a.", kind: "range", defaultValue: 7.5, min: 3, max: 14, step: 0.1 },
      { id: "i5-o", label: "OPEX eficiente", unit: "R$ mi/ano", kind: "range", defaultValue: 620, min: 30, max: 3000, step: 10 },
      { id: "i5-d", label: "Reintegração regulatória", unit: "R$ mi/ano", kind: "range", defaultValue: 180, min: 10, max: 1500, step: 10 },
      { id: "i5-e", label: "Energia faturada", unit: "GWh/ano", kind: "range", defaultValue: 14000, min: 500, max: 60000, step: 500 },
      { id: "i5-x", label: "Índice de preços − Fator X", unit: "% a.a.", kind: "range", defaultValue: 2.5, min: -4, max: 12, step: 0.5 },
    ],
    outputs: [
      { id: "i5-p", label: "Parcela B ano 0", unit: null },
      { id: "i5-c", label: "Componente médio", unit: null },
      { id: "i5-s", label: "Efeito de +1 p.p. no WACC", unit: null },
      { id: "i5-f", label: "Parcela B ano 4", unit: null },
      { id: "i5-vd", label: "Veredito", unit: null },
    ],
    note: "Didático/ilustrativo — não usar para dimensionamento real. Todos os valores são hipotéticos. O modelo mantém base, OPEX e reintegração constantes ao longo do ciclo e aplica o índice líquido do Fator X apenas sobre a Parcela B — simplificação grosseira: na prática a base cresce com investimento, a reintegração acompanha a base, o mercado varia e há componentes financeiros. O componente médio em R$/MWh não é tarifa: exclui Parcela A, perdas, tributos e estrutura horária.",
  },
  {
    id: "m05-inst-06",
    kind: "simulador",
    title: "Mapa · Posição no desenho de mercado",
    formula: null,
    fields: [
      { id: "i6-x", label: "Revelação de custo", unit: "0 oferta → 100 custo declarado", kind: "range", defaultValue: 85, min: 0, max: 100, step: 5 },
      { id: "i6-y", label: "Remuneração de capacidade", unit: "0 só energia → 100 formal", kind: "range", defaultValue: 45, min: 0, max: 100, step: 5 },
      { id: "i6-h", label: "Peso do recurso armazenável plurianual", unit: "%", kind: "range", defaultValue: 60, min: 0, max: 100, step: 5 },
    ],
    outputs: [
      { id: "i6-q", label: "Quadrante", unit: null },
      { id: "i6-co", label: "Coerência com o parque", unit: null },
      { id: "i6-d", label: "Distância do Brasil", unit: null },
      { id: "i6-r", label: "Risco dominante", unit: null },
      { id: "i6-vd", label: "Veredito", unit: null },
    ],
    note: "Didático/ilustrativo — não usar para dimensionamento real. Os eixos são índices adimensionais construídos para este módulo; os pontos A, B e C são configurações genéricas de referência, não representações de sistemas reais. A \"coerência com o parque\" é uma heurística que penaliza revelação por oferta quando o peso do recurso armazenável plurianual é alto, e penaliza remuneração puramente de energia quando esse peso é baixo — nada além disso.",
  },
];

/** Lead de cada aula — o `<p class="lede">` da fonte. */
export const MODULO_05_LEAD: Record<string, string> = {
  'aula-05-01': "A resposta curta é que duplicar a rede é mais caro que ter uma só. A resposta longa — a que sustenta uma conversa com investidor — envolve estrutura de custos, poder de barganha depois que o investimento já foi feito, e uma distinção fina entre competir <em>no</em> mercado e competir <em>pelo</em> mercado.",
  'aula-05-02': "Se apenas a rede é monopólio natural, por que separar geração e comercialização dela? Porque quem controla o único caminho pode usar esse controle para vencer nos negócios em que teria de competir de verdade. Unbundling é a resposta a esse incentivo — e ele tem preço.",
  'aula-05-03': "Há duas maneiras puras de organizar a compra e venda de energia no atacado, e nenhum sistema real usa uma delas isoladamente. Entender por quê é entender a distinção que dissolve metade da confusão do setor: contrato coordena dinheiro; operador coordena elétrons.",
  'aula-05-04': "A palavra sugere crime, e é por isso que ela é usada errado. Captura não exige propina, nem má-fé, nem sequer que alguém perceba que está acontecendo. Ela é um resultado de incentivos e informação — e é o argumento econômico mais forte por trás da existência de análise independente.",
  'aula-05-05': "Esta é a aula mais concreta do bloco: é o ponto em que toda a teoria de monopólio natural vira um número que a fábrica paga. Se você entender só uma coisa daqui, que seja a identidade central — base de ativos vezes custo de capital, mais custo operacional eficiente, mais depreciação regulatória, é a receita que a rede tem direito de recuperar.",
  'aula-05-06': "As cinco aulas anteriores descreveram instrumentos isolados. Esta os organiza num mapa de dois eixos, plota o Brasil nele com precisão e destrói a dicotomia mais repetida e mais errada do setor — a de que existem sistemas \"centralizados\" e sistemas \"descentralizados\".",
};

/** Corpo de texto — a apostila. 126 blocos nas seis aulas. */
export const MODULO_05_CORPO: Record<string, AulaBloco[]> = {
  'aula-05-01': [
    { kind: 'titulo', numero: "1.1", texto: "Monopólio natural: uma propriedade de custo, não de propriedade" },
    { kind: 'paragrafo', html: "Existe <strong>monopólio natural</strong> quando o custo de atender todo o mercado com uma única infraestrutura é menor que o custo de dividir esse mercado entre duas ou mais infraestruturas concorrentes. É uma afirmação sobre a função de custo da atividade, e nada mais. Linhas, postes, torres, subestações, faixas de servidão e centros de operação têm custo inicial altíssimo e custo incremental baixo para atender mais um cliente dentro da área já coberta. O custo médio por unidade servida cai ao longo de praticamente toda a faixa relevante de demanda." },
    { kind: 'paragrafo', html: "Duas palavras merecem atenção. <strong>\"Natural\"</strong> não significa bom, justo, necessário ou desejável — significa apenas que a tecnologia e a estrutura de custos empurram para um único operador, independentemente do que se ache disso. E monopólio natural <span class=\"hl\">não implica propriedade estatal</span>. O operador pode ser público, privado, de capital misto ou cooperativo; a estrutura de custos não muda com o CNPJ. Confundir o conceito econômico com uma preferência sobre propriedade é o erro mais comum e o mais fácil de derrubar numa conversa técnica." },
    { kind: 'paragrafo', html: "A consequência prática é contraintuitiva: <em>é a eficiência que cria o problema</em>. Justamente porque uma rede só é mais barata, o dono dela fica sem rival. E o problema econômico não aparece no momento de construir — aparece depois. Enquanto a concessão está sendo disputada, há competição. Depois que os ativos estão enterrados no chão, o usuário não tem alternativa física razoável, e o proprietário passa a poder cobrar acima do custo eficiente, atrasar conexão de concorrentes, deixar a qualidade cair ou adiar investimento sem perder cliente. Regulação existe para substituir a pressão que a rivalidade deixou de exercer: ela define quanto se pode faturar, quem tem direito de acesso, qual qualidade é obrigatória, quanta perda é tolerada e quando tudo isso é recalculado." },
    { kind: 'titulo', numero: "1.2", texto: "Competir no mercado × competir pelo mercado" },
    { kind: 'paragrafo', html: "Esta é a distinção que salva a discussão de virar ideologia, e é a que menos gente carrega. <strong>Competição no mercado</strong> é o que se imagina por padrão: vários fornecedores disputando o mesmo cliente simultaneamente, todo dia. Numa rede física, isso é o que não faz sentido — duas distribuidoras cabeando a mesma rua desperdiçam capital, espaço público e licença ambiental para entregar o mesmo elétron." },
    { kind: 'paragrafo', html: "<strong>Competição pelo mercado</strong> é outra coisa: várias empresas disputam, num único momento, o direito de ser o monopolista por um prazo determinado e sob regras fixadas de antemão. É exatamente o que acontece num leilão de concessão de linha de transmissão: dezenas de consórcios competem ferozmente por um ativo que, uma vez construído, não terá concorrente nenhum. A competição foi real, aconteceu antes, e o mecanismo que a capturou foi o leilão — não o mercado diário." },
    { kind: 'paragrafo', html: "Isso explica um padrão que parece incoerente à primeira vista: a expansão da transmissão brasileira é decidida por planejamento centralizado e adjudicada por leilão competitivo, e as duas coisas são compatíveis. O planejamento define <em>o que</em> construir, porque a rede é um sistema e não uma soma de decisões privadas independentes; o leilão define <em>quem</em> constrói e <em>por quanto</em>, porque nisso a competição funciona muito bem. Quem só conhece competição no mercado lê essa arquitetura como estatismo. Quem conhece as duas lê como o que é: alocação do instrumento certo em cada camada." },
    { kind: 'titulo', numero: "1.3", texto: "As outras três razões, além do custo de rede" },
    { kind: 'paragrafo', html: "Monopólio natural sozinho justificaria regular apenas transmissão e distribuição. Mas o setor elétrico é regulado além disso, e por razões que não se confundem entre si." },
    { kind: 'paragrafo', html: "A primeira é a <strong>essencialidade combinada com demanda inelástica</strong>. Eletricidade é insumo de hospital, água tratada, telecomunicação, pagamento, cadeia fria e produção contínua. Uma interrupção não fica contida em quem deixou de pagar: ela se espalha por terceiros que não participaram de nenhuma transação. E, no curto prazo, a demanda quase não responde a preço — o Módulo 04 mostrou o que isso faz com a formação de preço quando a oferta encosta no limite físico. Um sistema que dependesse exclusivamente do preço para racionar em escassez racionaria por capacidade de pagamento, não por valor social do uso." },
    { kind: 'paragrafo', html: "A segunda é o conjunto de <strong>externalidades</strong> — custos e benefícios que recaem sobre quem não decidiu nada." },
    { kind: 'tabela', linhas: [["Externalidade", "Mecanismo", "Por que o preço privado não resolve sozinho"], ["Emissões e poluição local", "Geração fóssil impõe custo climático e sanitário difuso", "O gerador não paga automaticamente o dano marginal que causa a terceiros"], ["Confiabilidade sistêmica", "Falha de um agente se propaga pela rede inteira", "Cada empresa subinveste em reserva e manutenção se o benefício for coletivo"], ["Uso do território", "Linhas, reservatórios e usinas afetam comunidades e ecossistemas", "Negociação privada fragmentada não trata impacto cumulativo nem servidão"], ["Universalização", "Atender área remota tem custo por usuário muito acima da média", "Tarifa estritamente local excluiria consumidores ou inviabilizaria o serviço"], ["Aprendizado tecnológico", "Tecnologia nova gera conhecimento que se difunde", "Quem investe primeiro captura só parte do benefício social que gerou"], ["Segurança de suprimento", "Dependência de um combustível ou de um fornecedor cria risco agregado", "A empresa individual não internaliza resiliência de escala nacional"]] },
    { kind: 'paragrafo', html: "A terceira é a <strong>necessidade de coordenação física em tempo real</strong>, já estabelecida no Módulo 02. Frequência, tensão, reserva e restrição de transmissão precisam ser resolvidas simultaneamente por alguém com autoridade sobre todos os agentes. Isso não é uma escolha de política econômica — é uma consequência de a rede ser um único sistema físico acoplado. Mesmo desenhos de mercado radicalmente descentralizados no lado comercial mantêm um operador central de segurança, porque a alternativa é a rede colapsar. Guarde este ponto: ele é a chave da Aula 06 e o erro conceitual mais comum sobre desenho de mercado comparado." },
    { kind: 'nota', tom: "neutro", label: null, html: "Numa atividade competitiva, o cliente disciplina o fornecedor com a ameaça de ir embora. Num monopólio de rede, essa ameaça não existe. A regulação tenta reconstruir artificialmente cada função que a ameaça de saída exercia: pressão sobre custo (benchmark e Fator X), pressão sobre qualidade (indicadores e penalidade), pressão sobre preço (receita regulada) e pressão sobre investimento (obrigação de expansão e teste de prudência). Todo instrumento regulatório é uma prótese de uma disciplina competitiva ausente — e, como toda prótese, funciona pior que o original." },
    { kind: 'nota', tom: "gold", label: null, html: "É a fundação conceitual do <strong>Regulatory Radar</strong>. Um radar que apenas lista publicações da agência é um leitor de diário oficial. Um radar que classifica cada mudança pela falha que ela endereça — e, portanto, por quem ela desloca risco e custo — é análise. A régua das quatro perguntas é literalmente o esquema de classificação do produto." },
    { kind: 'nota', tom: "neutro", label: "Monopólio natural · três níveis", html: "<b>Criança de 12 anos Executivo Especialista</b> Imagine cinco empresas cavando a mesma rua para colocar cinco fios até a sua casa. Você só vai usar um. Os outros quatro custaram caro e não serviram para nada. Por isso deixa-se só uma empresa fazer o fio — e, como ela fica sozinha e você não pode escolher outra, alguém precisa vigiar quanto ela cobra." },
  ],
  'aula-05-02': [
    { kind: 'titulo', numero: "2.1", texto: "O incentivo que a integração vertical cria" },
    { kind: 'paragrafo', html: "Uma empresa verticalmente integrada gera, transporta, distribui e vende energia. Do ponto de vista de engenharia, isso tem vantagens reais: coordenação mais simples, planejamento unificado, menos interfaces contratuais, economias de escopo verdadeiras. Do ponto de vista de incentivos, cria um problema grave e previsível." },
    { kind: 'paragrafo', html: "A rede é aquilo que a literatura de defesa da concorrência chama de <strong>infraestrutura essencial</strong>: um ativo indispensável para atuar no mercado a jusante e que não pode ser replicado economicamente. Quem é dono dela e ao mesmo tempo compete no mercado a jusante tem um repertório inteiro de instrumentos para prejudicar rivais sem cobrar um centavo a mais de tarifa. Pode colocar o pedido de conexão do concorrente no fim da fila e o da afiliada na frente. Pode exigir estudo técnico adicional que só o rival precisa fazer. Pode ser lento em informar capacidade disponível. Pode alocar custo de atividade competitiva dentro da contabilidade da atividade regulada — de modo que o consumidor cativo financia a operação que disputa clientes livres. Pode compartilhar com a afiliada informação comercial que obteve por ser operador da rede: quem consome quanto, quando, e cujo contrato vence em três meses." },
    { kind: 'paragrafo', html: "Repare que nenhuma dessas condutas exige violar a tarifa publicada. Elas operam nas margens do processo, na fila, no prazo, no dado e na alocação contábil — precisamente onde é difícil provar intenção. É por isso que a resposta regulatória não é apenas proibir a conduta, e sim <span class=\"hl\">remover a estrutura que torna a conduta lucrativa</span>." },
    { kind: 'titulo', numero: "2.2", texto: "Quatro graus de separação" },
    { kind: 'paragrafo', html: "Unbundling não é um botão binário. É um espectro de profundidade, e cada degrau reduz mais conflito ao custo de perder mais coordenação. Saber em que degrau um país está é o que permite dizer o que ainda pode dar errado ali." },
    { kind: 'tabela', linhas: [["Grau", "O que separa", "Conflito que resolve", "O que continua aberto"], ["Contábil", "Livros e centros de custo por atividade", "Subsídio cruzado explícito entre atividade regulada e competitiva", "Decisão continua unificada; alocação de custo comum é disputável"], ["Funcional", "Gestão, equipes, sistemas e informação", "Vazamento de informação comercial e favorecimento operacional cotidiano", "O acionista é o mesmo e o incentivo econômico continua alinhado"], ["Jurídica", "Personalidades jurídicas distintas", "Confusão patrimonial, obrigações e responsabilidades cruzadas", "Controle societário comum preserva o interesse econômico consolidado"], ["Societária", "Controle acionário — donos diferentes", "O interesse econômico de discriminar simplesmente deixa de existir", "Perde-se coordenação e economias de escopo; custo de transação sobe"]] },
    { kind: 'paragrafo', html: "A leitura correta da tabela é econômica, não moral. Separação profunda não é sempre melhor: ela troca um risco de conduta por um custo de coordenação. Num sistema onde a rede precisa integrar recursos distribuídos, armazenamento e resposta da demanda, separação excessiva pode produzir uma rede sem incentivo para digitalizar e um comercializador sem acesso ao dado que tornaria o serviço melhor. A pergunta de desenho é sempre: <em>qual grau de separação compra mais redução de conflito por unidade de coordenação perdida?</em>" },
    { kind: 'titulo', numero: "2.3", texto: "Os quatro segmentos e sua natureza econômica" },
    { kind: 'tabela', linhas: [["Segmento", "Natureza econômica predominante", "Regra coerente com essa natureza"], ["Geração", "Potencialmente competitivo — projetos e tecnologias disputam capital e contrato", "Concorrência, outorga, regra de conexão e controle de poder de mercado"], ["Transmissão", "Monopólio natural por corredor, com forte exigência de coordenação sistêmica", "Planejamento central, leilão de concessão, receita regulada, acesso aberto"], ["Distribuição", "Monopólio natural local, rede capilar e serviço público de massa", "Concessão territorial, receita regulada por incentivo, metas de qualidade e perda"], ["Comercialização", "Potencialmente competitivo — contrato, risco, serviço e atendimento", "Livre entrada com exigência de garantia, solvência e transparência ao cliente"]] },
    { kind: 'paragrafo', html: "A classificação não é absoluta e o analista precisa saber onde ela vaza. Geração pode exercer poder de mercado local quando há congestionamento e um único gerador consegue atender a região ilhada. Comercialização, apesar de competitiva, exige regra prudencial: um comercializador que quebra deixa um rombo de liquidação que alguém paga. E transmissão, embora seja monopólio em operação, é adjudicada competitivamente — aplicação direta do \"competir pelo mercado\" da Aula 01." },
    { kind: 'titulo', numero: "2.4", texto: "O corte que o Brasil fez" },
    { kind: 'paragrafo', html: "O Brasil implementou unbundling de forma gradual e deliberadamente parcial. Ao longo dos anos 1990 foram estabelecidos o livre acesso às redes mediante encargos e condições reguladas e o caráter competitivo das atividades de geração e comercialização. Em <strong>2004</strong> — marco institucional fixo aqui, e história contada no Bloco 6 — a reorganização da contratação em dois ambientes veio acompanhada de uma restrição direta: as distribuidoras do sistema interligado passaram a ficar limitadas às atividades próprias do serviço de distribuição, não podendo exercer livremente atividades competitivas dentro da mesma empresa." },
    { kind: 'paragrafo', html: "O ponto que quase todo material de mercado erra é o seguinte: <strong>isso não é separação societária</strong>. Grupos econômicos brasileiros podem deter empresas em segmentos diferentes, desde que respeitadas as separações jurídica, regulatória e contábil. O Brasil parou no terceiro degrau da tabela — separação jurídica, com forte camada regulatória de acesso e contabilidade —, não no quarto. Dizer que \"o Brasil separou geração de distribuição\" está certo; dizer que \"no Brasil não existe grupo que faça as duas coisas\" está errado, e essa imprecisão derruba credibilidade numa conversa com quem trabalha no setor." },
    { kind: 'paragrafo', html: "Sobre a arquitetura que resultou disso, três funções ficaram deliberadamente em casas diferentes: a agência reguladora cuida de outorga, tarifa e acesso; o operador nacional coordena e controla a operação do sistema interligado; e a câmara de comercialização registra contratos, mede, contabiliza e liquida. Distribuir funções entre instituições distintas reduz o risco de que uma só decida tudo — mas cria interfaces, custo de coordenação e zonas de fronteira onde a responsabilidade é ambígua. Essa é a troca, e ela é permanente." },
    { kind: 'titulo', numero: "2.5", texto: "O que unbundling não resolve" },
    { kind: 'paragrafo', html: "Acesso formal não é acesso efetivo. Um regime pode ter tarifa de rede publicada, regra de fila escrita e obrigação legal de conectar terceiros, e ainda assim produzir prazos de conexão sistematicamente mais longos para quem não é do grupo, exigências técnicas assimétricas, ou informação de capacidade disponível que chega tarde e agregada demais para ser útil. A pergunta empírica que separa análise de retórica é simples e verificável: <em>qual o prazo médio, em dias, entre solicitação e conexão, segmentado por vínculo societário do solicitante?</em> Onde esse dado não existe ou não é público, a assimetria persiste independentemente do que diga a norma — e é exatamente esse tipo de lacuna que a Aula 04 vai tratar como sinal." },
    { kind: 'nota', tom: "gold", label: null, html: "Esta aula é o que permite ao <strong>Brazil Pulse</strong> ler estrutura societária como variável analítica, e não como curiosidade corporativa. Saber que um grupo tem geração, comercialização e rede sob o mesmo controlador — no limite permitido pela separação jurídica — muda a leitura de uma proposta comercial, de um pedido de reajuste e de uma contribuição a consulta pública. É a mesma lente que a Aula 04 aplica ao regulador." },
    { kind: 'nota', tom: "neutro", label: "Unbundling · três níveis", html: "<b>Criança de 12 anos Executivo Especialista</b> A empresa que cuida dos fios não pode ser a mesma que vende a energia. Senão ela usaria os fios para atrapalhar os concorrentes — demorando para ligar o de outra empresa e correndo para ligar o dela." },
  ],
  'aula-05-03': [
    { kind: 'titulo', numero: "3.1", texto: "Pool: coordenação central" },
    { kind: 'paragrafo', html: "Num arranjo de <strong>pool</strong>, um operador central recebe informação de todos os recursos — ofertas de preço e quantidade, ou custos declarados e disponibilidade, dependendo do desenho — e resolve um único problema de otimização sujeito à demanda, aos limites de cada usina, às rampas, aos limites de transmissão e aos critérios de segurança. Do resultado dessa otimização saem duas coisas: quem gera e a que preço a energia de curtíssimo prazo é valorada." },
    { kind: 'paragrafo', html: "O que o pool compra é coordenação. Ninguém precisa negociar fisicamente com todos os outros; a rede é tratada como o sistema único que de fato é; congestionamento, perda e contingência entram no cálculo em vez de serem externalidades da negociação privada. Onde a energia não pode ser tratada como produto uniforme — porque hora e local mudam o valor —, um mecanismo central resolve o que uma soma de contratos bilaterais não resolveria." },
    { kind: 'paragrafo', html: "O que o pool custa é concentração de poder num lugar específico e frequentemente invisível: <span class=\"hl\">o desenho do algoritmo, as regras de declaração, as premissas dos modelos e a governança de quem os opera</span>. Quem define a metodologia define o resultado econômico de bilhões em transações, e faz isso por meio de documentos técnicos que quase ninguém do mercado consegue reproduzir. Guarde isso — é o gancho direto da Aula 04." },
    { kind: 'titulo', numero: "3.2", texto: "Bilateral: alocação privada de risco" },
    { kind: 'paragrafo', html: "No arranjo <strong>bilateral</strong> puro, comprador e vendedor negociam diretamente preço, volume, prazo, perfil de entrega, indexação, garantias e penalidades. O Módulo 04 já mostrou o que essas cláusulas fazem: elas alocam risco entre as partes com uma granularidade que nenhum preço spot único consegue reproduzir. O contrato longo dá previsibilidade ao comprador e bancabilidade ao gerador — é ele, e não o preço de curto prazo, que financia ativo de capital intensivo." },
    { kind: 'paragrafo', html: "Um mercado exclusivamente bilateral, porém, tem patologias conhecidas. A informação de preço fica dispersa em contratos privados, o que enfraquece a formação de uma referência pública confiável. A liquidez é baixa e o custo de busca é alto. Agentes pequenos negociam em desvantagem estrutural contra contrapartes que veem o mercado inteiro. E o operador do sistema, sem um mecanismo central de revelação de custo, tem menos informação para despachar economicamente." },
    { kind: 'titulo', numero: "3.3", texto: "A distinção que resolve a confusão" },
    { kind: 'paragrafo', html: "Aqui está o erro conceitual mais comum do setor inteiro, e ele aparece em conversa de investidor toda semana: acreditar que o contrato bilateral determina de onde vêm os elétrons. Não determina, e não pode." },
    { kind: 'paragrafo', html: "A energia injetada se mistura na rede. O fluxo físico obedece às leis da rede e às instruções do operador, não ao papel assinado. Se uma fábrica compra dez megawatts médios de uma usina eólica distante e o operador manda uma térmica próxima gerar, <strong>o contrato não foi descumprido</strong>: ele nunca foi uma promessa de trajetória física. Ele é uma obrigação econômica sobre um volume e um preço, e a diferença entre o que foi contratado e o que foi efetivamente medido é apurada e liquidada segundo as regras do sistema." },
    { kind: 'nota', tom: "neutro", label: null, html: "Pool e bilateral não são alternativas excludentes, porque não fazem a mesma coisa. <strong>O operador coordena elétrons; o contrato coordena dinheiro e risco.</strong> Todo sistema de grande porte precisa dos dois, e o que varia entre países é a proporção, o mecanismo de revelação de custo e quem carrega qual risco — nunca a existência de um dos dois." },
    { kind: 'titulo', numero: "3.4", texto: "O híbrido brasileiro, em três dimensões" },
    { kind: 'paragrafo', html: "Chamar o Brasil de \"híbrido\" sem qualificar é impreciso. O hibridismo brasileiro tem três dimensões independentes, e confundi-las é fonte permanente de erro analítico." },
    { kind: 'paragrafo', html: "<strong>Primeira dimensão — a operação é centralizada.</strong> O operador nacional coordena e controla a geração e a transmissão no sistema interligado, programa o despacho, define intercâmbios entre subsistemas e determina intervenções. Não há autonomia de despacho para a usina despachável: ela gera quando é mandada gerar. Isso é pool na dimensão física, e é inegociável dado o acoplamento da rede." },
    { kind: 'paragrafo', html: "<strong>Segunda dimensão — a contratação é plural.</strong> No ambiente regulado, as distribuidoras compram energia por mecanismos regulados — principalmente leilões e contratos padronizados, todo o cardápio do Módulo 04. No ambiente livre, os agentes negociam bilateralmente preço, prazo, perfil e garantias. Os dois ambientes coexistem, com regras de migração e de lastro que o Bloco 9 detalha." },
    { kind: 'paragrafo', html: "<strong>Terceira dimensão — a contabilização é centralizada.</strong> Todos os contratos, dos dois ambientes, são registrados na câmara de comercialização; a energia é medida; a diferença entre contratado e medido é valorada no mercado de curto prazo pelo preço de liquidação das diferenças, por hora e por submercado. Um agente com contrato bilateral no ambiente livre está, ainda assim, liquidando diferenças num mecanismo central." },
    { kind: 'paragrafo', html: "A pergunta que fecha a aula é <em>por que</em> essa combinação, e a resposta não é ideológica. É a <strong>otimização hidrotérmica intertemporal</strong> do Módulo 02. Reservatórios conectam presente e futuro: usar água hoje muda o custo e o risco de amanhã. Um gerador individual, otimizando o próprio lucro, não internaliza o valor sistêmico de guardar água para reduzir risco de escassez futura do sistema inteiro. Num parque predominantemente térmico, o custo de gerar hoje é o combustível de hoje e a coordenação central é menos necessária. Num parque predominantemente hídrico com reservatórios plurianuais, o custo de gerar hoje é uma função do futuro — e essa função só pode ser calculada olhando o sistema como um todo. O desenho brasileiro é uma consequência da fisiografia, não uma preferência política herdada." },
    { kind: 'nota', tom: "gold", label: null, html: "É a lente que impede o diagnóstico industrial de virar venda de migração. Migrar de ambiente muda <em>onde</em> a energia é comprada; não muda o operador, não muda a liquidação de diferenças, não muda a rede e não muda a maior parte dos encargos. O <strong>Mercado Livre Readiness</strong> só é um produto independente porque começa separando o que muda do que não muda — que é precisamente o conteúdo desta aula." },
    { kind: 'nota', tom: "neutro", label: "Pool e bilateral · três níveis", html: "<b>Criança de 12 anos Executivo Especialista</b> No pool, tem um juiz que organiza quem gera e por quanto vale a energia daquela hora. No bilateral, duas empresas combinam um preço entre elas. Mas mesmo quando elas combinam, a energia continua se misturando na rede — o combinado é sobre o dinheiro, não sobre por onde o elétron passa." },
  ],
  'aula-05-04': [
    { kind: 'titulo', numero: "4.1", texto: "A definição correta, e por que a errada atrapalha" },
    { kind: 'paragrafo', html: "<strong>Captura regulatória</strong> é o desvio persistente da decisão pública em favor dos interesses de um grupo organizado — normalmente o próprio setor regulado, mas não só ele — em detrimento do interesse difuso que a regulação deveria proteger. Três palavras carregam a definição inteira. <em>Persistente</em>, porque um resultado isolado favorável ao regulado não é captura; é apenas um resultado. <em>Organizado</em>, porque o mecanismo depende de capacidade de ação coletiva, não de virtude ou vício individual. E <em>desvio</em>, porque a referência é a metodologia declarada e o mandato legal — não a opinião de quem discorda do resultado." },
    { kind: 'paragrafo', html: "A definição criminal atrapalha por dois motivos opostos. Ela produz falsos negativos, porque uma agência inteiramente honesta pode estar capturada por assimetria de informação sem que ninguém tenha cometido ilícito algum. E produz falsos positivos, porque transforma qualquer decisão favorável a uma empresa em acusação, o que desqualifica quem faz a acusação e, na prática, protege os casos reais. <span class=\"hl\">Captura é diagnóstico institucional, não veredito moral</span> — e é essa a diferença entre um analista que é levado a sério e um que não é." },
    { kind: 'paragrafo', html: "A intuição econômica por trás disso é antiga e simples: o benefício de uma regra favorável é <strong>concentrado</strong> em poucos agentes que ganham muito cada um, enquanto o custo é <strong>difuso</strong> entre milhões que perdem pouco cada um. O lado concentrado tem incentivo racional para financiar equipe jurídica, consultoria econômica, participação em toda consulta pública e presença permanente em Brasília. O lado difuso não tem incentivo individual para se organizar, porque o ganho de cada um não paga o esforço. O desequilíbrio não vem de caráter; vem da matemática da ação coletiva. Nenhuma regra de conduta corrige isso sozinha, porque não é conduta — é estrutura." },
    { kind: 'titulo', numero: "4.2", texto: "Os seis mecanismos" },
    { kind: 'tabela', linhas: [["Mecanismo", "Como opera", "Sinal observável"], ["Porta giratória", "Quadros circulam entre empresa regulada e agência, nos dois sentidos", "Trânsito sem quarentena efetiva; decisões que favorecem antigo ou provável futuro empregador"], ["Assimetria de informação", "O regulado conhece os próprios ativos e custos; o regulador reconstrói a partir de dados fornecidos pelo regulado", "Modelo depende de premissa não auditável ou não reproduzível por terceiro"], ["Participação desigual", "O setor contribui em todas as consultas com equipe dedicada; o consumidor, quase nunca", "Consulta formalmente aberta com diversidade efetiva de contribuintes baixíssima"], ["Restrição de capacidade", "Orçamento e quadro técnico insuficientes para fiscalizar e testar dados", "Atrasos crônicos, terceirização de análise, aceitação de dado sem verificação independente"], ["Captura política", "Decisão tarifária é adiada, antecipada ou suavizada por conveniência conjuntural", "Decisão contradiz metodologia publicada sem justificativa técnica pública"], ["Captura cognitiva", "O regulador passa a enxergar o setor exclusivamente pela ótica de quem regula", "Alternativas tecnológicas e risco do consumidor desaparecem da análise sem serem descartados explicitamente"]] },
    { kind: 'paragrafo', html: "A captura cognitiva é a mais difícil de detectar e a mais frequente. Ela não exige nenhum ator mal-intencionado: exige apenas que a única narrativa tecnicamente bem financiada, repetida por anos em audiências, seminários e notas técnicas, acabe parecendo a única narrativa possível. O sinal dela não é uma decisão errada — é o desaparecimento silencioso de alternativas do documento, sem que elas tenham sido consideradas e rejeitadas." },
    { kind: 'titulo', numero: "4.3", texto: "Por que o setor elétrico é terreno especialmente fértil" },
    { kind: 'paragrafo', html: "Três características se somam. A assimetria de informação é aguda porque a base de ativos de uma distribuidora — o que existe, onde está, quanto custou, quanto está em serviço — é conhecida em detalhe pela empresa e reconstruída pelo regulador a partir de declaração da própria empresa, sob teste amostral. A materialidade é enorme e concentrada: um único ponto percentual num parâmetro de remuneração de capital vale, sobre uma base de bilhões, dezenas de milhões por ano — todo ano, por todo o ciclo. E a complexidade técnica é alta o suficiente para que a decisão fique fora do alcance de escrutínio público espontâneo: o documento é público, mas ser público não é o mesmo que ser verificável por alguém." },
    { kind: 'titulo', numero: "4.4", texto: "Os antídotos institucionais brasileiros" },
    { kind: 'paragrafo', html: "O arcabouço brasileiro não é ingênuo quanto a isso, e conhecer os instrumentos pelo nome é o que permite avaliar se eles estão funcionando em vez de apenas existirem." },
    { kind: 'lista', itens: ["<b>Mandato fixo e não coincidente.</b> Dirigentes com prazo definido e demissão limitada a hipóteses estritas reduzem a punição por decisão técnica impopular. É o alicerce da autonomia decisória das agências reguladoras federais.", "<b>Quarentena e regime de conflito de interesses.</b> Período de impedimento após a saída do cargo, com vedação a atuar junto ao ente regulado, e regras de declaração de conflito durante o exercício.", "<b>Dever de motivação.</b> No processo administrativo federal, decisão que nega, limita ou afeta direito precisa de motivação explícita, clara e congruente. Decisão sem memória de cálculo é decisão sem motivação de fato, ainda que tenha motivação de forma.", "<b>Consulta e audiência públicas com resposta motivada.</b> Abrir a consulta é o mínimo; o que separa participação real de teatro é o relatório que responde às contribuições dizendo por que cada uma foi ou não acolhida.", "<b>Análise de impacto regulatório.</b> Exigência de que a agência compare alternativas antes de editar o ato, e não justifique depois a alternativa escolhida.", "<b>Transparência ativa e acesso à informação.</b> Dado público, em formato reprocessável, é o que permite que um terceiro refaça a conta — e é a única forma de accountability que não depende de confiar em ninguém.", "<b>Contrapeso analítico externo.</b> Imprensa especializada, academia, associações de consumidores e análise independente capazes de reproduzir cálculo e traduzir efeito. Este é o único item da lista que o Estado não consegue produzir por decreto."] },
    { kind: 'titulo', numero: "4.5", texto: "O teste de sete perguntas" },
    { kind: 'paragrafo', html: "Uma decisão favorável à concessionária não prova captura. Antes de afirmar qualquer coisa, responda:" },
    { kind: 'lista', itens: ["<b>A metodologia foi publicada antes da decisão</b>, ou construída depois para justificá-la?", "<b>Os dados de entrada são públicos</b> e em formato que permite refazer a conta?", "<b>As contribuições contrárias foram respondidas</b> com argumento técnico, ou apenas registradas?", "<b>Empresas comparáveis receberam tratamento igual</b> no mesmo ciclo, sob a mesma regra?", "<b>O retorno reconhecido é coerente com o risco</b> da atividade e com o custo de capital observável no mercado?", "<b>Há evidência de contrapartida</b> — qualidade medida, perda reduzida, investimento efetivamente em serviço?", "<b>Um terceiro competente reproduziria o resultado</b> partindo dos mesmos dados e da mesma metodologia?"] },
    { kind: 'paragrafo', html: "Sete \"sim\" indicam decisão técnica, ainda que desagradável para quem paga. A falha se concentra tipicamente nas perguntas 1, 2 e 7 — método construído depois, dado indisponível, resultado irreproduzível. Essas três são as que valem a pena investigar primeiro." },
    { kind: 'titulo', numero: "4.6", texto: "Onde isso vira a tese da GridAlpha" },
    { kind: 'paragrafo', html: "A Aula 04 é o ponto do currículo em que o posicionamento da GridAlpha deixa de ser uma frase de apresentação e passa a ser uma proposição econômica. O argumento tem três passos e precisa ser dito nessa ordem." },
    { kind: 'paragrafo', html: "<strong>Primeiro:</strong> em setores de alta complexidade técnica, o público não consegue verificar sozinho se um reajuste é necessário, se um investimento foi prudente ou se uma exceção beneficia um grupo. A transparência formal existe — o documento é publicado — mas verificação exige capacidade técnica que quase ninguém do lado difuso tem. O gargalo não é acesso; é capacidade de leitura." },
    { kind: 'paragrafo', html: "<strong>Segundo:</strong> a função de uma análise independente é justamente essa — tornar premissas observáveis, comparar alternativas e separar três coisas que o debate público mistura permanentemente: <em>retorno justo</em>, <em>ineficiência</em> e <em>renda de monopólio</em>. São três diagnósticos diferentes, com três respostas de política diferentes, e tratá-los como um só é o que torna a discussão tarifária brasileira improdutiva." },
    { kind: 'paragrafo', html: "<strong>Terceiro, e é aqui que a coisa fica verificável:</strong> independência não é uma declaração de intenção nem uma afirmação sobre o caráter de quem analisa. É uma propriedade do modelo de receita. Um analista cuja remuneração depende de comissão sobre o contrato que ele recomenda tem incentivo estrutural, não moral, para recomendar o contrato — e trocar as pessoas não muda isso. Um analista cuja receita vem exclusivamente de assinatura, diagnóstico e educação não tem esse incentivo. <strong>A GridAlpha é uma nova camada independente</strong> porque não vende energia, não opera comercializadora e não recebe comissão sobre contrato de energia — três fatos auditáveis por qualquer contraparte, não três promessas." },
    { kind: 'nota', tom: "neutro", label: null, html: "\"Com escala, a GridAlpha não vira exatamente o que critica?\" A resposta honesta é: <strong>o risco é real e é do mesmo tipo</strong>. Uma plataforma analítica que cresce passa a ter clientes grandes cuja renovação importa, e clientes grandes exercem pressão. A única defesa é a mesma que se cobra do regulador — metodologia publicada antes, dado de entrada disponível, resultado reproduzível por terceiro, e nenhuma linha de receita cuja existência dependa da conclusão. Quem responde essa pergunta com indignação não entendeu a aula. Quem responde com o desenho institucional que a impede, entendeu." },
    { kind: 'nota', tom: "gold", label: null, html: "O teste de sete perguntas é o critério editorial do <strong>Regulatory Radar</strong>. Cada ato relevante entra no radar com as sete respostas preenchidas, e é isso — não a velocidade da notícia — que constitui o produto. E a Aula 04 inteira é a fundamentação econômica formal da narrativa de independência: quando um jornalista ou investidor perguntar por que independência importa, a resposta não é uma frase de marketing, é esta aula." },
    { kind: 'nota', tom: "neutro", label: "Captura regulatória · três níveis", html: "<b>Criança de 12 anos Executivo Especialista</b> É quando o juiz começa a ver o jogo só pelo lado de um dos times. Não precisa ter recebido dinheiro: basta que só aquele time converse com ele, explique as regras do jeito dele e apareça em todas as reuniões. Depois de um tempo, o juiz acha que aquele jeito de ver é o único que existe." },
  ],
  'aula-05-05': [
    { kind: 'titulo', numero: "5.1", texto: "Como se disciplina um monopólio" },
    { kind: 'paragrafo', html: "A distribuidora atende uma área de concessão sem concorrente. Não há cliente que possa ir embora, logo não há pressão de mercado sobre preço, custo ou qualidade. O regulador tem, em tese, duas famílias de resposta." },
    { kind: 'paragrafo', html: "A primeira é <strong>custo de serviço</strong>: reconhecer os custos que a empresa efetivamente teve e adicionar uma margem. É simples de administrar e péssimo em incentivo — se todo custo é reconhecido, gastar mais aumenta a receita, e a empresa tende a inflar base de ativos. A segunda é <strong>regulação por incentivo</strong>, popularmente chamada de <em>price cap</em>: o regulador fixa uma trajetória de receita ou preço para um período, e o que a empresa economizar dentro desse período fica com ela. Na revisão seguinte, a régua é recalibrada e parte do ganho de produtividade é repassada ao consumidor." },
    { kind: 'paragrafo', html: "O Brasil opera na segunda família, com um detalhe que muda tudo na leitura: a eficiência não é medida contra o custo histórico da própria empresa, e sim contra uma <strong>empresa de referência</strong> — uma construção regulatória de quanto custaria operar aquela concessão de forma eficiente, dadas características objetivas como número de consumidores, extensão de rede, dispersão geográfica e mercado atendido. Isso é benchmark artificial substituindo a rivalidade ausente, exatamente como a Aula 01 antecipou. E é também o ponto de maior tensão técnica de qualquer revisão, porque a metodologia de comparação decide quanto a empresa pode gastar." },
    { kind: 'titulo', numero: "5.2", texto: "Parcela A e Parcela B" },
    { kind: 'paragrafo', html: "Antes de qualquer conta, é preciso saber o que está sendo calculado. A receita requerida de uma distribuidora divide-se em duas parcelas com naturezas completamente diferentes." },
    { kind: 'paragrafo', html: "A <strong>Parcela A</strong> agrupa os custos considerados predominantemente não gerenciáveis pela distribuidora: compra de energia, uso da transmissão e encargos setoriais. A distribuidora é, nesse pedaço, uma repassadora — ela compra energia por mecanismos regulados e transfere o custo, sob regras de repasse. A <strong>Parcela B</strong> agrupa o que é próprio da atividade de distribuição: custo operacional, remuneração do capital investido e depreciação regulatória. É sobre a Parcela B que incidem os incentivos de eficiência." },
    { kind: 'paragrafo', html: "A consequência analítica é imediata e é onde quase todo debate público erra. <span class=\"hl\">Um aumento tarifário grande pode ocorrer com a Parcela B praticamente estável</span>, se a energia comprada ficou mais cara ou um encargo subiu. E uma queda no custo da energia pode ser mascarada por outro componente. Atribuir um reajuste inteiro à \"ganância da distribuidora\" sem decompor as parcelas é a forma mais rápida de perder credibilidade numa conversa técnica — e a decomposição é pública." },
    { kind: 'titulo', numero: "5.3", texto: "A mecânica da Parcela B" },
    { kind: 'paragrafo', html: "A <strong>Base de Remuneração Regulatória</strong> — a base de ativos reconhecida — não é o que a empresa declarou ter gasto. O regulador reconhece ativos que sejam prudentes, úteis, efetivamente em serviço e vinculados à concessão, aplicando critérios de avaliação, elegibilidade e depreciação. Ativo superavaliado, ocioso ou não prudente pode ser glosado. Sobre a base líquida — bruta menos depreciação acumulada — incide a remuneração do capital; a <strong>quota de reintegração regulatória</strong> devolve o capital investido ao longo da vida útil dos ativos." },
    { kind: 'titulo', numero: "5.4", texto: "WACC regulatório: o parâmetro que move tudo" },
    { kind: 'paragrafo', html: "O custo médio ponderado de capital combina o retorno exigido pelos acionistas e o custo da dívida, ponderados pela estrutura de capital e ajustados por tributos. Na regulação, ele não é o custo de capital <em>real</em> daquela empresa: é o retorno que o regulador julga compatível com o risco da atividade regulada para uma empresa eficiente, estimado por metodologia padronizada e parâmetros públicos." },
    { kind: 'paragrafo', html: "O regulador está preso entre dois erros simétricos e igualmente caros. Se a taxa ficar <strong>abaixo</strong> do custo eficiente de financiamento, a concessionária adia investimento, a qualidade se deteriora e o capital vai para outro setor — o consumidor paga menos hoje e paga uma rede pior depois. Se ficar <strong>acima</strong>, o consumidor transfere renda ao acionista por um risco que ele não está de fato correndo. Não existe folga confortável entre os dois erros: existe uma faixa estreita, e a discussão metodológica sobre onde ela está é o coração técnico de qualquer revisão." },
    { kind: 'paragrafo', html: "Há uma armadilha operacional que derruba analista júnior com frequência: <strong>consistência de bases</strong>. A taxa pode ser expressa em termos reais ou nominais, antes ou depois de impostos, e precisa ser aplicada sobre uma base construída na mesma convenção. Se a base está em moeda constante e a taxa embute inflação, há dupla contagem; se o fluxo é pós-impostos e a taxa é pré-impostos, a remuneração sai inconsistente. Erro de convenção produz números que parecem plausíveis e estão errados por vários pontos percentuais." },
    { kind: 'nota', tom: "neutro", label: null, html: "O valor vigente do custo de capital regulatório, a estrutura de capital de referência, os prêmios de risco e o tratamento tributário são definidos na versão vigente do submódulo de custo de capital dos procedimentos de regulação tarifária e atualizados por despacho da agência. Nada disso é estável. Este módulo usa exclusivamente <strong>valores hipotéticos</strong> para ensinar a mecânica, e nenhum percentual daqui deve ser usado em análise externa sem consulta à fonte primária na data de uso. O mesmo vale para resultados de revisão de distribuidoras específicas e para qualquer processo em curso." },
    { kind: 'titulo', numero: "5.5", texto: "Revisão periódica, reajuste anual e revisão extraordinária" },
    { kind: 'paragrafo', html: "Três movimentos diferentes, frequentemente confundidos num só." },
    { kind: 'tabela', linhas: [["Movimento", "O que faz", "Periodicidade", "O que recalcula"], ["Revisão tarifária periódica", "Recalibra a estrutura econômica da concessão", "Ciclo definido no contrato de concessão de cada distribuidora — tipicamente da ordem de quatro a cinco anos", "Base de ativos, custo de capital, custo operacional eficiente, perdas, qualidade e Fator X"], ["Reajuste tarifário anual", "Atualiza a tarifa entre revisões", "Anual, na data de aniversário do contrato", "Parcela A por repasse conforme regra; Parcela B por índice de preços menos o Fator X"], ["Revisão extraordinária", "Restabelece o equilíbrio econômico-financeiro", "Eventual", "O que o evento imprevisível e relevante tiver desequilibrado"]] },
    { kind: 'paragrafo', html: "O <strong>Fator X</strong> é o instrumento que compartilha com o consumidor o ganho de produtividade esperado ao longo do ciclo. Ele entra subtraindo do índice de correção da Parcela B: se o índice de preços subiu e o Fator X é positivo, a Parcela B sobe menos que a inflação. É o mecanismo que impede que a eficiência conquistada pela empresa entre uma revisão e outra fique permanentemente com ela — e é, previsivelmente, um dos pontos mais disputados de toda revisão. Note a assimetria de atenção: a periodicidade da revisão é o item que menos importa e o mais citado; o Fator X e a empresa de referência são os que mais importam e quase nunca aparecem no noticiário." },
    { kind: 'titulo', numero: "5.6", texto: "Regulatório não é de projeto" },
    { kind: 'tabela', linhas: [["Dimensão", "WACC de projeto", "WACC regulatório"], ["Pergunta que responde", "Este projeto cria valor para quem investe?", "Que retorno eficiente o consumidor deve reconhecer a um monopólio?"], ["Quem define", "O investidor, conforme risco e financiamento próprios", "O regulador, por metodologia padronizada e parâmetros públicos"], ["Risco embutido", "Construção, preço, volume, contraparte, corte de geração", "Risco sistemático e regulatório de uma empresa eficiente com receita parcialmente protegida"], ["Uso", "Valor presente líquido, custo nivelado, decisão de investir", "Remuneração da base de ativos e receita permitida"], ["Efeito de taxa maior", "Reduz o valor presente e sobe o preço mínimo viável", "Aumenta a receita reconhecida e tende a elevar a tarifa"], ["Erro típico", "Usar taxa genérica que não reflete o risco daquele projeto", "Tratar o custo de capital real da empresa como se fosse garantia de reconhecimento"]] },
    { kind: 'paragrafo', html: "A matemática é a mesma; a pergunta institucional é oposta. No projeto, a taxa disciplina o investidor. Na concessão, a taxa disciplina o regulador. Uma usina solar com custo de capital de projeto bem acima do regulatório de uma distribuidora não é contradição nenhuma — são riscos diferentes respondendo a perguntas diferentes." },
    { kind: 'titulo', numero: "5.7", texto: "Por que isso aparece na conta industrial mesmo no mercado livre" },
    { kind: 'paragrafo', html: "Um consumidor industrial que migrou integralmente para o ambiente livre deixou de comprar energia da distribuidora. <strong>Não deixou de usar a rede dela.</strong> A tarifa de uso do sistema de distribuição continua sendo paga, e ela é, em essência, a Parcela B rateada entre os usuários. Isso significa que uma revisão tarifária afeta o custo de energia de uma planta que nunca mais comprou um megawatt-hora daquela concessionária." },
    { kind: 'paragrafo', html: "Há um segundo efeito, mais sutil e mais frequentemente ignorado: além de mudar a receita total, uma revisão pode mudar a <strong>alocação</strong> dessa receita entre classes, níveis de tensão, componentes de demanda e de energia e postos horários. Uma planta pode ver a conta subir sem que a receita da distribuidora tenha crescido, apenas porque a estrutura tarifária transferiu custo para o perfil dela. Por isso, ao analisar uma revisão, as perguntas certas são cinco: a receita total mudou? Qual componente mudou? A estrutura transferiu custo entre demanda e energia, ou entre postos? O perfil de carga da planta mudou no período? E existe alavanca de gestão — ponta, fator de potência, modalidade tarifária, geração própria, armazenamento — ou o custo é inevitável?" },
    { kind: 'nota', tom: "gold", label: null, html: "Duas frentes. No <strong>Regulatory Radar</strong>, esta aula é o que permite traduzir uma mudança de parâmetro em impacto estimado por distribuidora e, daí, em impacto sobre o custo de rede de um cliente industrial — que é a diferença entre noticiar e analisar. No <strong>diagnóstico industrial</strong>, é o que sustenta a leitura da tarifa de uso da rede como variável analisável, e não como um número dado na fatura. Qualquer achado se comunica como <strong>oportunidade potencial a ser validada com dados completos</strong>." },
    { kind: 'nota', tom: "neutro", label: "WACC regulatório · três níveis", html: "<b>Criança de 12 anos Executivo Especialista</b> É quanto de lucro por ano o governo deixa a empresa dos fios ganhar sobre o dinheiro que ela colocou nos postes e nas subestações. Se deixar de menos, ela para de investir e a luz cai mais. Se deixar demais, todo mundo paga a mais na conta sem motivo." },
  ],
  'aula-05-06': [
    { kind: 'titulo', numero: "6.1", texto: "Os dois eixos que organizam qualquer desenho" },
    { kind: 'paragrafo', html: "Todo sistema elétrico de grande porte precisa resolver duas perguntas que são independentes uma da outra. Confundi-las é o que torna a comparação internacional confusa; separá-las é o que a torna trivial." },
    { kind: 'paragrafo', html: "<strong>Eixo 1 — como o custo é revelado para coordenar o despacho.</strong> Num extremo, os geradores <em>ofertam</em> preço e quantidade, e o operador cruza ofertas sujeitas às restrições de rede. No outro extremo, os custos são <em>declarados sob regra e auditados</em>, e o despacho sai de modelos de otimização que minimizam o custo esperado do sistema. Não é uma escala de quanto o Estado interfere: é uma escala de <em>qual informação entra no problema de otimização</em> — uma oferta voluntária, que embute estratégia, ou um custo declarado, que embute regra e auditoria." },
    { kind: 'paragrafo', html: "<strong>Eixo 2 — como a capacidade firme é remunerada.</strong> Num extremo, o sistema é <em>só de energia</em>: quem investe recupera custo fixo exclusivamente da margem inframarginal e dos preços altos das horas de escassez — o Módulo 04 mostrou por que isso é frágil, e o nome do problema é <em>missing money</em>. No outro extremo, existe um <em>mecanismo formal</em> que contrata disponibilidade como produto separado da energia, com pagamento próprio. Entre os dois há posições intermediárias: contratação pontual de reserva de capacidade, obrigações de lastro impostas a quem atende carga, e leilões de longo prazo que financiam capacidade indiretamente." },
    { kind: 'titulo', numero: "6.2", texto: "O que cada posição compra e o que ela paga" },
    { kind: 'tabela', linhas: [["Posição no mapa", "O que ela compra", "O que ela paga", "Onde ela quebra"], ["Despacho por oferta + só energia", "Sinal de preço agudo, decisão de investimento descentralizada, saída rápida de ativo ineficiente", "Volatilidade alta transferida ao consumidor final e receita instável para o investidor", "Quando teto de preço, aversão política a preço extremo ou raridade do evento crítico impedem o preço de escassez de pagar a capacidade"], ["Despacho por oferta + capacidade formal", "Adequação contratada com antecedência e receita previsível para capacidade firme", "Custo administrativo permanente e dependência de projeção de demanda", "Quando o produto \"disponibilidade\" é mal definido e paga atributo que não é entregue na hora crítica"], ["Despacho por custo + só energia", "Coordenação intertemporal e uso ótimo de recurso armazenável", "Concentração de poder na metodologia e no modelo, com preço pouco contestável", "Quando o limite regulatório sobre o preço suprime justamente o sinal que financiaria capacidade"], ["Despacho por custo + capacidade híbrida", "Segurança de suprimento sem depender do preço spot para financiar ponta", "Muitas decisões deslocadas para o planejador; erro de projeção vira tarifa", "Quando planejamento e contratação envelhecem mais devagar que a tecnologia disponível"]] },
    { kind: 'titulo', numero: "6.3", texto: "Onde o Brasil fica, e por quê" },
    { kind: 'paragrafo', html: "No eixo 1, o Brasil está <strong>próximo do extremo de despacho por custo</strong>. Custo variável declarado sob regra, otimização encadeada de horizontes, valor da água derivado de função de custo futuro, preço de curto prazo como resultado de modelo e não de pregão. A razão não é preferência: é a otimização hidrotérmica intertemporal da Aula 03. Um sistema com reservatórios plurianuais precisa de alguém que otimize o uso da água ao longo do tempo, porque nenhum agente individual internaliza esse valor." },
    { kind: 'paragrafo', html: "No eixo 2, o Brasil está numa <strong>posição intermediária</strong> e vem se deslocando. Não há mercado de capacidade permanente. Há leilões de longo prazo que financiam expansão, obrigação de lastro para quem atende carga, e contratações específicas de reserva de capacidade em que o objeto contratado é estar disponível — não entregar energia. O Módulo 04 tratou desse mecanismo em detalhe; o que a Aula 06 acrescenta é a localização dele no mapa: é um híbrido deliberado, não uma etapa incompleta rumo a um modelo puro." },
    { kind: 'paragrafo', html: "Há ainda uma terceira característica brasileira que não é um eixo, mas condiciona os dois: <strong>a expansão da transmissão é planejada centralmente e adjudicada por leilão</strong>. Isso importa porque desloca para o planejador a decisão de onde a rede vai crescer, com todos os riscos de erro de projeção que isso implica — e, ao mesmo tempo, evita que o desenho dependa de sinal locacional de preço para induzir investimento em rede." },
    { kind: 'titulo', numero: "6.4", texto: "A dicotomia falsa que você precisa desmontar" },
    { kind: 'paragrafo', html: "Este é o ponto que separa quem estudou de quem repetiu. A frase \"no Brasil o despacho é centralizado, lá fora o mercado é descentralizado\" está errada e é dita todo dia." },
    { kind: 'paragrafo', html: "Praticamente todo sistema elétrico interligado de grande porte tem <strong>despacho central de segurança</strong>. Alguém precisa resolver, em tempo real, um problema de otimização sujeito a restrições de rede, reserva e estabilidade — a Aula 01 mostrou que isso decorre da física, não da política. Mercados internacionais organizados executam despacho econômico centralizado com restrição de segurança tanto quanto um sistema de despacho por custo executa." },
    { kind: 'paragrafo', html: "O que varia entre desenhos não é <em>se</em> há coordenação central, e sim <strong>qual informação alimenta a coordenação e quem carrega o risco do resultado</strong>. Ofertas voluntárias com preço locacional de um lado; custos declarados e modelos de otimização hidrotérmica do outro. E a contratação comercial — a camada de dinheiro da Aula 03 — pode ser descentralizada nos dois casos, e geralmente é. Quem enuncia a dicotomia \"centralizado versus descentralizado\" está misturando a camada física com a camada comercial. Corrigir essa mistura, em voz alta, com naturalidade, é o teste prático de que este bloco foi aprendido." },
    { kind: 'nota', tom: "neutro", label: null, html: "Todo sistema grande tem operador central por razão física. A diferença entre desenhos está em <strong>quem revela o custo</strong> — oferta voluntária ou custo declarado e auditado — e em <strong>como a capacidade firme é paga</strong> — pela margem de energia ou por um produto próprio. O Brasil combina revelação por custo, imposta pela hidrotermia, com remuneração híbrida de capacidade, construída por leilão e por contratação de disponibilidade." },
    { kind: 'titulo', numero: "6.5", texto: "A matriz que você leva para qualquer desenho" },
    { kind: 'paragrafo', html: "Encerrando o bloco: nove perguntas que se aplicam a qualquer regra, mercado ou proposta de reforma. Elas são a régua das quatro perguntas da §00, desdobrada em operação." },
    { kind: 'tabela', linhas: [["Pergunta", "Sinal de bom desenho", "Sinal de risco"], ["Quem é o monopólio natural aqui?", "Fronteira clara entre segmentos e acesso neutro", "O monopólio avança sobre segmentos contestáveis"], ["Quem fiscaliza o fiscalizador?", "Decisão reproduzível e prestação de contas efetiva", "Autonomia formal sem capacidade técnica ou controle"], ["Como o sistema paga confiabilidade?", "Receita coerente com o atributo efetivamente entregue", "Pagamento duplicado ou atributo mal definido"], ["Quem assume risco de previsão?", "O risco fica com quem tem instrumento para gerenciá-lo", "Risco privado socializado depois que a perda aconteceu"], ["Como se forma o preço?", "Metodologia pública e contestável", "Caixa-preta ou exceção frequente à regra publicada"], ["O desenho recompensa eficiência?", "Ganho temporário com compartilhamento posterior", "Gastar mais aumenta a receita, sem teste de prudência"], ["O consumidor consegue ver a decisão?", "Componentes separáveis e explicáveis na fatura", "Reajuste agregado, sem causalidade decomponível"], ["Como trata transição tecnológica?", "Neutralidade tecnológica com pagamento por serviço prestado", "Ativo legado protegido contra entrante mais eficiente"], ["Há plano para evento extremo?", "Padrão obrigatório, teste periódico e responsabilidade definida", "Confiança exclusiva no preço ou no cenário médio de planejamento"]] },
    { kind: 'nota', tom: "gold", label: null, html: "É a fundação da camada internacional da GridAlpha. Um terminal que cobre mais de um mercado só é analiticamente coerente se houver uma taxonomia comum por trás — caso contrário, cada mercado vira um dashboard isolado com jargão próprio. Estes dois eixos são essa taxonomia: eles permitem comparar mercados sem traduzir sigla por sigla, e permitem que uma leitura de um mercado informe a leitura de outro." },
    { kind: 'nota', tom: "neutro", label: "Desenho de mercado · três níveis", html: "<b>Criança de 12 anos Executivo Especialista</b> Todo país precisa de alguém dizendo quais usinas ligam agora, senão a rede quebra. O que muda de país para país é como esse alguém descobre quanto custa cada usina, e como se paga a usina que fica parada esperando o dia em que todo mundo precisa dela." },
  ],
};

/** Os dez exercícios do § Ex. NENHUM aponta aula — testado em resumo,
 *  enunciado e gabarito. Mesmo tratamento dos nove do Módulo 04. */
export const MODULO_05_EXERCICIOS_SOLTOS: LessonActivity[] = [
  {
    id: "ex-01",
    kind: 'discursiva' as const,
    prompt: "<span class=\"term\">Enunciado.</span> Uma cidade com 200 mil consumidores avalia autorizar cinco distribuidoras, cada uma com postes, cabos e subestações próprios. Nomeie a falha econômica e diga por que o problema não se resolve com a concorrência entre as cinco.",
    points: 1,
    config: { tag: "01 · A rua com cinco redes", gabarito: "<span class=\"term\">Gabarito.</span> Monopólio natural por economias de escala e de densidade. O custo fixo de uma rede completa é replicado cinco vezes para atender o mesmo mercado, então o custo médio por consumidor sobe substancialmente — a concorrência não reduz custo aqui, ela o multiplica. A resposta eficiente é uma rede regulada com acesso não discriminatório, adjudicada por competição <em>pelo</em> mercado, não competição <em>no</em> mercado. Detalhe que separa a boa resposta da resposta decorada: a duplicação também consome bem público não replicável — espaço no subsolo e na via, licença ambiental, servidão. Não é só capital desperdiçado; é capital desperdiçado consumindo um recurso escasso que não pertence a nenhuma das cinco." },
  },
  {
    id: "ex-02",
    kind: 'discursiva' as const,
    prompt: "<span class=\"term\">Enunciado.</span> Uma transmissora conecta a geradora do próprio grupo em 60 dias e conecta rivais em 240 dias, sem justificativa técnica registrada. A tarifa cobrada é idêntica e publicada. Qual conceito se aplica e qual instrumento regulatório endereça isso?",
    points: 1,
    config: { tag: "02 · A afiliada que conecta mais rápido", gabarito: "<span class=\"term\">Gabarito.</span> Discriminação vertical por meio de infraestrutura essencial. A tarifa igual não resolve nada, porque a discriminação opera no prazo e na fila, não no preço. Os instrumentos são unbundling em grau suficiente, regra pública de fila, obrigação de acesso não discriminatório e — o item que efetivamente muda o comportamento — publicação do prazo médio de conexão segmentado por vínculo societário do solicitante. Sem esse dado, a regra existe e não é fiscalizável." },
  },
  {
    id: "ex-03",
    kind: 'discursiva' as const,
    prompt: "<span class=\"term\">Enunciado.</span> Uma fábrica no Sudeste compra 10 MW médios de uma eólica no Nordeste. No mês seguinte, o operador despacha térmicas no Sudeste e restringe geração eólica no Nordeste. O contrato foi descumprido?",
    points: 1,
    config: { tag: "03 · Contrato descumprido?", gabarito: "<span class=\"term\">Gabarito.</span> Não. O contrato é obrigação econômica sobre volume e preço, não promessa de trajetória física — nada no papel determina por onde o elétron viaja. O despacho atende segurança e otimização sistêmica. Medição e liquidação de diferenças resolvem economicamente o que não coincidiu. Onde o exercício fica interessante: a resposta completa precisa mencionar que <em>existe</em> um risco real ali, só que outro. Restrição de geração e diferença de preço entre submercados são riscos contratuais concretos, e a pergunta certa é qual cláusula do contrato aloca cada um — assunto do Módulo 04, não invalidação do princípio desta aula." },
  },
  {
    id: "ex-04",
    kind: 'discursiva' as const,
    prompt: "<span class=\"term\">Enunciado.</span> A base de remuneração líquida de uma distribuidora é de R$ 6 bilhões. O custo de capital regulatório passa de 7,2% para 8,0%, tudo o mais constante. Qual o efeito anual aproximado sobre a remuneração do capital, e isso é evidência de captura?",
    points: 1,
    config: { tag: "04 · Um ponto percentual", gabarito: "<span class=\"term\">Gabarito.</span> Variação de 0,8 ponto percentual = 0,008. Efeito ≈ 6.000 × 0,008 = <strong>R$ 48 milhões por ano</strong>, antes de qualquer outro efeito. E não, não é evidência de nada: o custo de capital de mercado pode ter subido, e o parâmetro deve seguir o mercado. A avaliação exige comparar período de dados, estrutura de capital de referência, prêmios de risco, consistência de convenção real ou nominal, e verificar se a mesma metodologia foi aplicada às concessionárias comparáveis no mesmo ciclo." },
  },
  {
    id: "ex-05",
    kind: 'discursiva' as const,
    prompt: "<span class=\"term\">Enunciado.</span> A agência aprova um retorno maior após alta de juros, publica a metodologia com antecedência, disponibiliza os dados de entrada, responde às contribuições contrárias e aplica a mesma regra a todas as distribuidoras do ciclo. Associações de consumidores denunciam captura. Quem tem razão?",
    points: 1,
    config: { tag: "05 · Captura ou ajuste técnico", gabarito: "<span class=\"term\">Gabarito.</span> Com essa descrição, não há evidência de captura. Anterioridade metodológica, dado público, resposta motivada e simetria de tratamento são justamente as quatro condições que caracterizam decisão técnica. Resultado desfavorável ao consumidor não é sinônimo de desvio. A resposta madura acrescenta o que ainda faltaria verificar: a metodologia publicada é reproduzível por terceiro a partir dos dados divulgados? Se sim, o caso está encerrado. Se a memória de cálculo não permite reconstruir o número, o processo é transparente na forma e opaco no efeito — e é aí, e só aí, que o argumento das associações ganha tração." },
  },
  {
    id: "ex-06",
    kind: 'discursiva' as const,
    prompt: "<span class=\"term\">Enunciado.</span> A fatura de uma indústria cativa subiu 12% no ano. A Parcela B da distribuidora subiu 2%. Dê três explicações possíveis para o restante e diga qual dado você pediria primeiro.",
    points: 1,
    config: { tag: "06 · A conta subiu 12%", gabarito: "<span class=\"term\">Gabarito.</span> Três candidatos: aumento do custo de compra de energia repassado pela Parcela A; aumento de encargos setoriais ou de custo de transmissão; e variação tributária ou de componente financeiro. Uma quarta possibilidade, frequentemente esquecida: mudança de estrutura tarifária que realocou custo para o perfil daquela indústria sem alterar a receita total. Primeiro dado a pedir: a decomposição da variação por componente na própria fatura, comparada com a nota técnica do reajuste. Sem isso, qualquer atribuição de causa é chute — e chute com número é a forma mais rápida de perder um cliente técnico." },
  },
  {
    id: "ex-07",
    kind: 'discursiva' as const,
    prompt: "<span class=\"term\">Enunciado.</span> Uma planta migrou 100% para o ambiente livre e reduziu o preço contratado de energia. O diretor financeiro conclui que a empresa \"saiu do regulado\" e que revisão tarifária deixou de importar. Onde está o erro?",
    points: 1,
    config: { tag: "07 · Migrou e continua exposta", gabarito: "<span class=\"term\">Gabarito.</span> A planta saiu do mercado <em>de energia</em> regulado; continua integralmente dentro da <em>rede</em> regulada. A tarifa de uso do sistema de distribuição continua sendo paga e é, no essencial, a Parcela B rateada entre usuários. Revisão tarifária, Fator X e custo de capital regulatório seguem afetando o custo total de energia da operação. Consequência prática: uma economia anunciada apenas sobre o componente de energia superestima o resultado se, no mesmo período, o componente de rede subiu. A leitura correta compara custo total por MWh consumido, decomposto, antes e depois — e mesmo isso é uma oportunidade a validar com dados completos, não uma economia comprovada." },
  },
  {
    id: "ex-08",
    kind: 'discursiva' as const,
    prompt: "<span class=\"term\">Enunciado.</span> Um investidor pergunta por que o Brasil não substitui a otimização central por um mercado em que geradores ofertem preço a cada meia hora. Responda em até quatro frases, sem citar nenhum outro país.",
    points: 1,
    config: { tag: "08 · Por que não leiloar o despacho", gabarito: "<span class=\"term\">Gabarito.</span> Porque o custo de gerar de uma hidrelétrica com reservatório hoje não é um custo de hoje: é o valor de oportunidade da água que deixará de existir amanhã. Esse valor depende de afluência futura, do estado de todos os outros reservatórios e do risco de escassez do sistema inteiro — informação que nenhum gerador individual tem nem tem incentivo para internalizar. Num parque predominantemente térmico, o custo de gerar é o combustível de hoje e a oferta revela bem esse custo; num parque com armazenamento plurianual, não revela. O despacho por custo é consequência da fisiografia do sistema, não uma preferência sobre o papel do Estado." },
  },
  {
    id: "ex-09",
    kind: 'discursiva' as const,
    prompt: "<span class=\"term\">Enunciado.</span> Num processo decisório, você identifica: metodologia divulgada depois da decisão, dados de entrada não disponibilizados, contribuições registradas sem resposta, e materialidade de R$ 400 milhões por ano. Qual conclusão você publica?",
    points: 1,
    config: { tag: "09 · O termômetro dá vermelho", gabarito: "<span class=\"term\">Gabarito.</span> Que a decisão <strong>não é reproduzível por terceiro</strong> e que a materialidade é alta — e nada além disso. Não se publica acusação de captura, porque captura é padrão institucional inferido ao longo do tempo, e não diagnóstico de um ato isolado. O que se publica é a lacuna verificável, o pedido formal dos dados e o compromisso de refazer a conta quando eles vierem. Esta é a disciplina que separa análise independente de ativismo. Ativismo publica a conclusão que quer; análise publica o que consegue reproduzir e diz explicitamente o que não conseguiu — o que, feito de forma consistente, é mais devastador e infinitamente mais defensável." },
  },
  {
    id: "ex-10",
    kind: 'discursiva' as const,
    prompt: "<span class=\"term\">Enunciado.</span> Um sistema tem 70% da energia vinda de reservatórios plurianuais, despacho coordenado a partir de custos declarados e auditados, nenhum pagamento permanente por disponibilidade e teto regulatório apertado sobre o preço de curto prazo. Onde ele fica no mapa de dois eixos e qual o risco dominante?",
    points: 1,
    config: { tag: "10 · Onde plotar o sistema", gabarito: "<span class=\"term\">Gabarito.</span> Alto no eixo de revelação por custo — coerente com o peso do recurso armazenável — e baixo no eixo de remuneração de capacidade. O risco dominante é o <em>missing money</em>: o teto suprime exatamente o sinal de preço que financiaria a capacidade de ponta, e não há produto de disponibilidade que o substitua. É a combinação que produz, com o tempo, subinvestimento em capacidade firme ou contratação emergencial cara. A resposta completa nota que a saída não é remover o teto — remover o teto num sistema de demanda inelástica transfere risco extremo ao consumidor. A saída é criar um produto próprio de disponibilidade, que é precisamente o caminho híbrido descrito na Aula 06." },
  },
];

export const MODULO_05_AULAS: CurriculumAula[] = [
  {
    id: 'aula-05-01',
    moduleId: 'modulo-05',
    number: 1,
    totalInModule: 6,
    title: "Por que regulado",
    subtitle: "Fundamento econômico",
    track: 'universal',
    language: 'pt-BR',
    durationMinutes: null,
    difficulty: null,
    submercados: [],
    competencies: [],
    illustrations: [],
    video: null,
    activities: [],
    references: [],
    instruments: [INSTRUMENTOS_MODULO_05[0]],
  },
  {
    id: 'aula-05-02',
    moduleId: 'modulo-05',
    number: 2,
    totalInModule: 6,
    title: "Unbundling",
    subtitle: "Arquitetura setorial",
    track: 'universal',
    language: 'pt-BR',
    durationMinutes: null,
    difficulty: null,
    submercados: [],
    competencies: [],
    illustrations: [],
    video: null,
    activities: [],
    references: [],
    instruments: [INSTRUMENTOS_MODULO_05[1]],
  },
  {
    id: 'aula-05-03',
    moduleId: 'modulo-05',
    number: 3,
    totalInModule: 6,
    title: "Pool e bilateral",
    subtitle: "Desenho do atacado",
    track: 'universal',
    language: 'pt-BR',
    durationMinutes: null,
    difficulty: null,
    submercados: [],
    competencies: [],
    illustrations: [],
    video: null,
    activities: [],
    references: [],
    instruments: [INSTRUMENTOS_MODULO_05[2]],
  },
  {
    id: 'aula-05-04',
    moduleId: 'modulo-05',
    number: 4,
    totalInModule: 6,
    title: "Captura regulatória",
    subtitle: "Economia política da regulação",
    track: 'universal',
    language: 'pt-BR',
    durationMinutes: null,
    difficulty: null,
    submercados: [],
    competencies: [],
    illustrations: [],
    video: null,
    activities: [],
    references: [],
    instruments: [INSTRUMENTOS_MODULO_05[3]],
  },
  {
    id: 'aula-05-05',
    moduleId: 'modulo-05',
    number: 5,
    totalInModule: 6,
    title: "Revisão tarifária",
    subtitle: "Regulação econômica",
    track: 'universal',
    language: 'pt-BR',
    durationMinutes: null,
    difficulty: null,
    submercados: [],
    competencies: [],
    illustrations: [],
    video: null,
    activities: [],
    references: [],
    instruments: [INSTRUMENTOS_MODULO_05[4]],
  },
  {
    id: 'aula-05-06',
    moduleId: 'modulo-05',
    number: 6,
    totalInModule: 6,
    title: "Desenho de mercado comparado",
    subtitle: "Síntese",
    track: 'universal',
    language: 'pt-BR',
    durationMinutes: null,
    difficulty: null,
    submercados: [],
    competencies: [],
    illustrations: [],
    video: null,
    activities: [],
    references: [],
    instruments: [INSTRUMENTOS_MODULO_05[5]],
  },
];

export const getAulaModulo05 = (id: string) =>
  MODULO_05_AULAS.find((a) => a.id === id) ?? null;
