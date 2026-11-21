// alexandria-modulo-04-content.ts
// Bloco 4 — Economia de Mercados de Energia. Nível 1, track 'universal'.
//
// EXTRAÍDO de `Alexandria modulos/alexandria_modulo04.html` (180.140
// bytes sem o <script>), não transcrito. Nome do arquivo conferido no
// disco antes de abrir: limpo, sem sufixo de cópia.
//
// ── A FONTE MUDOU DE VOCABULÁRIO ──────────────────────────────
// Este módulo NÃO usa a marcação dos Módulos 01-03. Contagens brutas
// dos seletores das três extrações anteriores, medidas neste arquivo:
//
//     class="aula"      0        div.exercise      0
//     aula-marker       0        exercise-tag      0
//     glossary-item     0        checklist-item    0
//
// O vocabulário aqui é abreviado: `sec-id` delimita seção, `lede` é o
// lead, `inst` o instrumento, `box` a nota destacada, `lv` um
// explicador em três níveis, `det-bd` o corpo de exercício em
// <details>. Nenhum regex das waves anteriores serve.
//
// ── CONTAGEM REAL, três sinais concordando ────────────────────
// Pela primeira vez em quatro módulos, prosa e markup concordam em
// TUDO — não houve divergência a registrar:
//
//     | sinal       | prosa da fonte          | markup |
//     | aulas       | §MAP "Sete aulas"       | 7 seções `Aula NN` |
//     | exercícios  | §Ex "Nove exercícios"   | 9 <details> |
//     | glossário   | §Lex "Cinquenta e oito" | 58 .term |
//
// 17 seções ao todo: 7 aulas + 10 de aparato (§00 §MAP §Caso §Erros
// §Ex §Quiz §Voz §Final §Lex §Ref).
//
// ── SEM GRAVURA, POR CONTRATO ─────────────────────────────────
// `bloco-04` tem `illustrationPrefix: null` no catálogo da FOUNDRY, e
// não existe pasta de gravura correspondente. `illustrations: []` nas
// SETE aulas, sem exceção. Não foi usada gravura `orn-` para preencher:
// `orn-` é mobília de interface (Tier B), não conteúdo de aula, e
// misturar as duas coisas quebraria a separação que a Wave 5 firmou.
//
// ── video: null, MEDIDO ───────────────────────────────────────
// Zero <video>, zero <iframe>, zero youtube, zero vimeo, zero .mp4 no
// arquivo inteiro. Não é herança dos módulos anteriores — é medição.
//
// ── OS NOVE EXERCÍCIOS SÃO TODOS SOLTOS ───────────────────────
// Nos Módulos 01-03 a tag do exercício apontava a aula (`Ex · 04 ·
// Aula 05`). Aqui o <summary> traz só `NN · Título`, e a varredura por
// /[Aa]ula\s*\d+/ no enunciado E no gabarito dos nove devolve ZERO
// ocorrência. A fonte não declara o vínculo, então ele não foi
// inventado: os nove vão para `MODULO_04_EXERCICIOS_SOLTOS` e as sete
// aulas ficam com `activities: []`. É a primeira vez que 100% dos
// exercícios de um módulo são soltos.

import type { CurriculumAula, Instrument, LessonActivity } from '@/lib/types/alexandria';
import type { AulaBloco } from './alexandria-modulo-01-content';

/** Limites regulatórios vigentes citados no próprio <script> da fonte:
 *  "limites regulatórios vigentes 2026 — ANEEL Despacho 3.850/2025".
 *  Reexportados porque os calculadores dos INST 01, 02, 05 e 07 os usam. */
export const PLD_MIN = 57.31;
export const PLD_MAX_HORARIO = 1611.04;
export const PLD_MAX_ESTRUTURAL = 785.27;


// ── OS SETE INSTRUMENTOS ──────────────────────────────────────
// Um por aula, sem exceção — nenhum solto no aparato (o Módulo 01 tinha
// o `LAB · 01` fora de qualquer aula; aqui não há equivalente).
//
// TIPO CONFIRMADO NA MARCAÇÃO, não presumido. Seis se declaram
// "Simulador"; o sétimo é "Mesa de hedge · swap simples".
//
// "Mesa de hedge" NÃO é membro de `InstrumentKind` (que tem nove:
// calculadora, controles, laboratorio, simulador, comparador,
// explorador, cadeia-de-transformacao, dimensionador, quebra-cabeca), e
// `src/lib/types/alexandria.ts` é somente-leitura nesta wave. Como a
// mecânica do INST 06 é idêntica à dos outros seis — campos numéricos
// → readouts → veredito — ele entra como `kind: 'simulador'` com o
// TÍTULO LITERAL preservado. Nada se perde na tela: o painel renderiza
// `title`, e é lá que "Mesa de hedge" aparece para o aluno. O `kind` é
// taxonomia interna.
//
// CAMPOS: a fonte pareia cada controle numérico com um <input
// type="range"> gêmeo ligado ao mesmo valor (mesmo padrão do Módulo
// 02). São UM campo lógico — fica o `number`, que carrega
// value/min/max/step, e o `kind` vira 'range' porque o deslizador
// existe.
//
// SAÍDAS: a fonte declara 28 readouts (4 por instrumento, perfeitamente
// regular). Vinte e duas entram. As SEIS abaixo ficam de fora porque a
// fonte as renderiza como TEXTO, e `ResultadoInstrumento.valores` é
// `Record<string, number>`:
//
//     i1-m    "Usina marginal"     → nome ('Gás', 'Hidráulica'…)
//     i1-lim  "Limite aplicado"    → categoria ('piso R$ 57,31'…)
//     i2-mes  "Mês crítico"        → mês ('Set')
//     i5-lo   "Mês mais barato"    → composto ('Fev · R$ 3,2 mi')
//     i5-w    "Mês mais caro"      → composto
//     i7-w    "Pior mês"           → composto
//
// Emitir índice numérico cru sob o rótulo "Mês crítico" seria pior que
// omitir — é o defeito que a Wave 19 registrou ("Vale do portfólio: 7"
// deveria ler "Agosto"). A informação não se perde: o veredito literal
// da fonte já a carrega ("Pico em Set a R\$ …"). A correção de verdade
// é de contrato, não de extração — mesma pendência da Wave 19.
export const INSTRUMENTOS_MODULO_04: Instrument[] = [
  {
    id: "m04-inst-01",
    kind: "simulador",
    title: "Simulador · Formador de preço",
    formula: null,
    fields: [
      { id: "i1-d-n", label: "Demanda do sistema", unit: "MW", kind: "range", defaultValue: 1000, min: 300, max: 1600, step: 25 },
      { id: "i1-r-n", label: "Disponibilidade renovável", unit: "%", kind: "range", defaultValue: 100, min: 0, max: 100, step: 5 },
      { id: "i1-h-n", label: "Nível de reservatório", unit: "%", kind: "range", defaultValue: 100, min: 0, max: 100, step: 5 },
      { id: "i1-g-n", label: "Preço do gás no CVU", unit: "R$/MWh", kind: "range", defaultValue: 250, min: 120, max: 600, step: 10 },
    ],
    outputs: [
      { id: "i1-p", label: "Preço formado", unit: null },
      { id: "i1-def", label: "Déficit", unit: "MW" },
    ],
    note: null,
  },
  {
    id: "m04-inst-02",
    kind: "simulador",
    title: "Simulador · PLD ao longo do ano",
    formula: null,
    fields: [
      { id: "i2-e-n", label: "ENA — afluência", unit: "% da MLT", kind: "range", defaultValue: 100, min: 40, max: 140, step: 2 },
      { id: "i2-a-n", label: "EAR inicial em janeiro", unit: "%", kind: "range", defaultValue: 60, min: 10, max: 95, step: 1 },
      { id: "i2-c-n", label: "Variação da carga", unit: "%", kind: "range", defaultValue: 0, min: -5, max: 10, step: 1 },
    ],
    outputs: [
      { id: "i2-p", label: "PLD médio do ano", unit: null },
      { id: "i2-max", label: "Pico do ano", unit: null },
      { id: "i2-x", label: "1 MW médio descoberto", unit: null },
    ],
    note: null,
  },
  {
    id: "m04-inst-03",
    kind: "simulador",
    title: "Simulador · O dinheiro que falta",
    formula: null,
    fields: [
      { id: "i3-p-n", label: "Potência do ativo", unit: "MW", kind: "range", defaultValue: 200, min: 10, max: 500, step: 10 },
      { id: "i3-h-n", label: "Horas de despacho por ano", unit: "h", kind: "range", defaultValue: 200, min: 10, max: 3000, step: 10 },
      { id: "i3-m-n", label: "Margem líquida quando gera", unit: "R$/MWh", kind: "range", defaultValue: 400, min: 20, max: 1400, step: 10 },
      { id: "i3-f-n", label: "Custo fixo de disponibilidade", unit: "R$/kW-ano", kind: "range", defaultValue: 300, min: 80, max: 700, step: 10 },
    ],
    outputs: [
      { id: "i3-r", label: "Receita de energia", unit: null },
      { id: "i3-c", label: "Custo fixo anual", unit: null },
      { id: "i3-g", label: "Dinheiro que falta", unit: null },
      { id: "i3-k", label: "Preço de capacidade necessário", unit: null },
    ],
    note: null,
  },
  {
    id: "m04-inst-04",
    kind: "simulador",
    title: "Simulador · Sala do leilão reverso",
    formula: null,
    fields: [
      { id: "i4-d-n", label: "Quantidade demandada", unit: "MW", kind: "range", defaultValue: 1000, min: 0, max: 2100, step: 50 },
      { id: "i4-t-n", label: "Preço-teto do edital", unit: "R$/MWh", kind: "range", defaultValue: 300, min: 150, max: 400, step: 5 },
    ],
    outputs: [
      { id: "i4-q", label: "Contratado", unit: null },
      { id: "i4-c", label: "Preço de corte", unit: null },
      { id: "i4-m", label: "Preço médio por lance", unit: null },
      { id: "i4-f", label: "Demanda não atendida", unit: null },
    ],
    note: null,
  },
  {
    id: "m04-inst-05",
    kind: "simulador",
    title: "Simulador · Contrato × spot ao longo de 12 meses",
    formula: null,
    fields: [
      { id: "i5-c-n", label: "Parcela contratada em PPA", unit: "%", kind: "range", defaultValue: 70, min: 0, max: 100, step: 5 },
      { id: "i5-p-n", label: "Preço do PPA", unit: "R$/MWh", kind: "range", defaultValue: 355, min: 180, max: 500, step: 5 },
      { id: "i5-l-n", label: "PLD médio do cenário", unit: "R$/MWh", kind: "range", defaultValue: 250, min: 57, max: 800, step: 1 },
      { id: "i5-s-n", label: "Amplitude mensal do PLD", unit: "± R$/MWh", kind: "range", defaultValue: 120, min: 0, max: 350, step: 10 },
    ],
    outputs: [
      { id: "i5-a", label: "Custo médio", unit: null },
      { id: "i5-r", label: "Amplitude anual", unit: null },
    ],
    note: null,
  },
  {
    id: "m04-inst-06",
    kind: "simulador",
    title: "Mesa de hedge · swap simples",
    formula: null,
    fields: [
      { id: "i6-f-n", label: "Preço fixo do swap", unit: "R$/MWh", kind: "range", defaultValue: 300, min: 150, max: 600, step: 5 },
      { id: "i6-p-n", label: "PLD realizado no mês", unit: "R$/MWh", kind: "range", defaultValue: 250, min: 57, max: 1611, step: 1 },
      { id: "i6-v-n", label: "Volume travado", unit: "MWh", kind: "range", defaultValue: 8000, min: 0, max: 16000, step: 500 },
    ],
    outputs: [
      { id: "i6-r", label: "Resultado do swap", unit: null },
      { id: "i6-a", label: "Custo sem hedge", unit: null },
      { id: "i6-b", label: "Custo com hedge", unit: null },
      { id: "i6-u", label: "Custo efetivo", unit: null },
    ],
    note: null,
  },
  {
    id: "m04-inst-07",
    kind: "simulador",
    title: "Simulador · Portfólio em camadas",
    formula: null,
    fields: [
      { id: "i7-a-n", label: "Base longa · R$ 330/MWh", unit: "%", kind: "range", defaultValue: 50, min: 0, max: 120, step: 5 },
      { id: "i7-b-n", label: "Camada média · R$ 348/MWh", unit: "%", kind: "range", defaultValue: 25, min: 0, max: 120, step: 5 },
      { id: "i7-c-n", label: "Camada curta · R$ 366/MWh", unit: "%", kind: "range", defaultValue: 15, min: 0, max: 120, step: 5 },
      { id: "i7-s-n", label: "Choque de PLD no 2º semestre", unit: "intensidade", kind: "range", defaultValue: 0, min: 0, max: 100, step: 5 },
    ],
    outputs: [
      { id: "i7-e", label: "Exposição residual", unit: null },
      { id: "i7-m", label: "Custo médio anual", unit: null },
      { id: "i7-r", label: "Amplitude do ano", unit: null },
    ],
    note: null,
  },
];


/** Lead de cada aula — o `p.lede` logo abaixo do título. */
export const MODULO_04_LEAD: Record<string, string> = {
  'aula-04-01': "Você já sabe que as usinas entram por ordem de custo variável. A pergunta desta aula é outra: uma vez montada a fila, qual preço ela produz — e para quem esse preço vale.",
  'aula-04-02': "O PLD é o número mais citado e mais mal-usado do setor elétrico brasileiro. Ele não é o preço da energia. Ele é o preço de uma diferença .",
  'aula-04-03': "A pergunta que fecha o Módulo 03 tem resposta aqui: se o LCOE da solar é menor que o do gás, por que o gás roda? Porque LCOE e disponibilidade medem coisas diferentes — e o mercado paga separado por cada uma. Ou deveria.",
  'aula-04-04': "Num mercado onde o comprador é uma distribuidora regulada obrigada a contratar, ninguém pode simplesmente negociar. O leilão é o instrumento que substitui a negociação bilateral por competição pública — e o preço que sai dele vira referência para todo mundo.",
  'aula-04-05': "Um PPA é apresentado como um preço. Ele é, na verdade, uma alocação de riscos entre duas partes, em que o preço é apenas a cláusula que todo mundo lê. As outras doze é que decidem se o contrato foi bom.",
  'aula-04-06': "Hedge não é uma aposta de que o preço vai subir. É a decisão consciente de abrir mão do cenário bom para eliminar o cenário ruim. Quem confunde as duas coisas acaba explicando prejuízo para o conselho.",
  'aula-04-07': "Nenhuma empresa madura decide \"spot ou contrato\". Ela decide quanto de cada um, em quais prazos, sob qual política escrita — e revisa isso periodicamente. Comprar energia é gerir uma carteira, não fechar uma compra.",
};


/** Corpo de apostila — 114 blocos nas sete aulas, na ordem do documento.
 *
 *  O explicador em três níveis da fonte (`div.lv`: "Criança de 12 anos"
 *  / "Executivo" / "Especialista") vira UMA nota com os três rotulados
 *  dentro. `AulaBloco` não tem kind de abas, e criar um exigiria tocar
 *  um contrato que esta wave só pode ler — o texto dos três níveis é
 *  preservado integralmente. */
export const MODULO_04_CORPO: Record<string, AulaBloco[]> = {
  'aula-04-01': [
    { kind: 'titulo', numero: "1.1", texto: "O princípio marginalista, em uma frase" },
    { kind: 'paragrafo', html: "Num sistema onde a demanda precisa ser atendida integralmente, o custo de atender <strong>o próximo MWh</strong> é o custo da usina que está no topo da fila naquele instante. Essa usina é a <strong>marginal</strong>, e o custo dela é o <strong>Custo Marginal de Operação — CMO</strong>. Todas as usinas abaixo dela na fila geram com custo menor; a diferença entre o CMO e o custo próprio de cada uma é a margem inframarginal</b> — e é dessa margem, não de um pagamento de capacidade, que uma usina em mercado só-de-energia precisa recuperar seu custo fixo. Guarde isso: é a semente da Aula 03." },
    { kind: 'paragrafo', html: "A consequência contraintuitiva é que <strong>uma usina de custo zero nunca define o preço enquanto houver demanda acima dela</strong>. A solar com CVU nulo não puxa o preço para zero — ela <em>desloca a curva para a direita</em>, empurrando a usina marginal para uma posição mais barata. O preço cai porque quem ficou na margem é mais barato, não porque a solar é barata. É uma distinção fina e ela decide conversas inteiras com investidor." },
    { kind: 'paragrafo', html: "Vale separar três custos que a conversa cotidiana embaralha. <strong>Custo fixo</strong> existe mesmo com a usina parada: investimento, financiamento, depreciação, seguros, conexão, equipe mínima. <strong>Custo variável</strong> cresce com a geração — dominado por combustível em térmicas. <strong>Custo marginal</strong> é o custo do próximo MWh, e é o único dos três que forma preço de curto prazo. Uma usina solar tem custo fixo alto e custo marginal quase nulo; uma térmica a óleo tem custo fixo modesto e custo marginal altíssimo. As duas podem ter o mesmo custo médio ao longo da vida e comportamentos de mercado opostos." },
    { kind: 'titulo', numero: "1.2", texto: "A diferença brasileira: preço calculado, não ofertado" },
    { kind: 'paragrafo', html: "Aqui está o ponto que diferencia o Brasil de quase tudo que se lê em livro-texto. Na maior parte dos mercados organizados, os geradores <strong>ofertam preço</strong> e o operador cruza ofertas. No Brasil, o despacho é <strong>centralizado e por custo</strong>: o gerador térmico declara seu CVU segundo regra, e o ONS despacha segundo modelos de otimização que minimizam o custo esperado de operação do sistema — o encadeamento NEWAVE → DECOMP → DESSEM, do horizonte de anos ao horizonte de meia hora." },
    { kind: 'paragrafo', html: "Isso tem duas implicações que um analista precisa carregar sempre. Primeira: o preço brasileiro de curto prazo é um <strong>resultado de modelo</strong>, não de pregão. Ele responde a premissas de afluência, a funções de custo futuro e a decisões de política operativa — e por isso pode se mover sem que nada tenha se movido fisicamente naquele instante. Essa característica é fonte recorrente de atrito no mercado: quando o preço muda por atualização de deck ou de premissa, agentes expostos sentem no caixa uma variação que nenhuma turbina explicou." },
    { kind: 'paragrafo', html: "Segunda: como o modelo otimiza o futuro, o <strong>valor da água</strong> (Módulo 02) entra na fila como um custo de oportunidade real. Usar água hoje é não tê-la amanhã. Reservatório cheio empurra a hidráulica para baixo na ordem de mérito; reservatório esvaziando empurra a mesma usina para cima — às vezes acima do gás. É o mecanismo mais importante da formação de preço brasileira e o mais mal explicado publicamente." },
    { kind: 'titulo', numero: "1.3", texto: "Custo marginal não é uma coisa só" },
    { kind: 'paragrafo', html: "Cada tecnologia produz seu custo marginal por um caminho diferente, e confundir os caminhos é erro de analista júnior. Numa <strong>térmica</strong>, o custo marginal é dominado por combustível e eficiência: quanto de gás é preciso queimar por MWh entregue. Combustível mais caro ou máquina menos eficiente empurram o CVU para cima de forma direta e verificável." },
    { kind: 'paragrafo', html: "Numa <strong>hidrelétrica com reservatório</strong>, não há desembolso de combustível — há custo de oportunidade intertemporal, o valor da água. Em <strong>solar e eólica</strong>, o custo marginal operacional é próximo de zero, mas essas fontes não são despacháveis no mesmo sentido: quando o recurso está lá, gerar é economicamente óbvio, desde que a rede absorva. Numa <strong>bateria</strong>, não há combustível, mas há eficiência de ciclo e degradação: cada ciclo consome vida útil, então o custo relevante de descarregar é o preço de carga dividido pela eficiência, mais o desgaste. E na <strong>demanda flexível</strong>, o custo marginal de reduzir carga é o custo de oportunidade da produção não realizada — que pode ser altíssimo, e é por isso que resposta da demanda é cara e escassa, não porque seja tecnicamente difícil." },
    { kind: 'nota', tom: "gold", label: "A fila real", html: "Despacho real = ordem econômica <strong>+</strong> restrições de transmissão <strong>+</strong> segurança operativa <strong>+</strong> requisitos de reserva e ancilares <strong>+</strong> regra regulatória. Todo simulador de ordem de mérito — inclusive o desta página — mostra apenas o primeiro termo dessa soma." },
    { kind: 'nota', tom: "neutro", label: "Ordem de mérito · três níveis", html: "<b>Criança de 12 anos.</b> É uma fila. As usinas mais baratas de operar entram primeiro, as mais caras só entram se ainda faltar energia. Quem é a última a entrar é quem manda no preço daquela hora — porque foi ela que precisou ser chamada.<br/><b>Executivo.</b> É a lógica de despacho que aciona primeiro os recursos de menor custo variável e vai subindo a fila conforme a demanda exige. A última usina necessária define o custo marginal do sistema, e é esse custo — não a média das usinas — que forma o preço de curto prazo.<br/><b>Especialista.</b> É a ordenação dos recursos por custo variável unitário, sujeita a restrições de transmissão, rampa, disponibilidade, reserva operativa e requisitos de segurança. No modelo hidrotérmico brasileiro, a posição da hidráulica na fila é dada pelo valor da água derivado da função de custo futuro, e o resultado da otimização encadeada NEWAVE/DECOMP/DESSEM é o CMO — insumo direto do PLD, após aplicação dos limites regulatórios." },
    { kind: 'nota', tom: "neutro", label: "Onde isso entra no produto", html: "Esta é a lógica que sustenta o <strong>Brazil Pulse</strong>: exibir CMO/PLD ao lado da composição do despacho e do nível dos reservatórios permite que o usuário veja <em>por que</em> o preço está onde está, em vez de apenas <em>qual</em> é o preço. O diferencial analítico está na atribuição causal, não no número." },
  ],
  'aula-04-02': [
    { kind: 'titulo', numero: "2.1", texto: "O que o PLD é, exatamente" },
    { kind: 'paragrafo', html: "O <strong>Preço de Liquidação das Diferenças</strong> é o preço usado para valorar o descasamento entre o que um agente contratou e o que ele efetivamente mediu — consumiu ou gerou. Se uma indústria contratou 1.000 MWh e consumiu 1.100 MWh, esses 100 MWh de diferença são liquidados na CCEE ao PLD do período. Se contratou 1.000 e consumiu 900, a sobra é liquidada da mesma forma, na direção oposta." },
    { kind: 'paragrafo', html: "A CCEE calcula o PLD diariamente, <strong>para cada hora do dia seguinte</strong>, a partir do CMO, respeitando os limites máximo e mínimo vigentes em cada período de apuração e em cada submercado. Desde 2021 a base é horária — antes era semanal, em três patamares de carga. Essa mudança aumentou muito a aderência do preço à condição real do sistema e, na mesma medida, aumentou a exposição de quem opera sem gestão horária." },
    { kind: 'paragrafo', html: "Os <strong>quatro submercados</strong> — Sudeste/Centro-Oeste, Sul, Nordeste e Norte — têm preços próprios. Quando os intercâmbios estão livres, os preços convergem e diz-se que o sistema está <em>acoplado</em>. Quando um limite de transmissão satura, os preços descolam, e essa diferença tem nome comercial: <strong>risco de submercado</strong>, ou risco de base. Um contrato registrado num submercado e um consumo em outro não se anulam perfeitamente." },
    { kind: 'titulo', numero: "2.2", texto: "Os limites: quando a regra manda mais que a economia" },
    { kind: 'paragrafo', html: "O CMO pode teoricamente ir a qualquer valor. O PLD não. A ANEEL fixa anualmente um piso e dois tetos, corrigidos por IPCA, e a existência desses limites é uma decisão de política econômica: proteger o mercado de preços extremos e persistentes capazes de quebrar agentes solventes. O preço de fazer isso aparece inteiro na Aula 03." },
    { kind: 'tabela', linhas: [["Limite (2026)","Valor","O que ele faz"],["PLDmin","R$ 57,31/MWh","Piso. Corresponde ao maior valor entre a TEO e a TEO Itaipu. Impede que o preço vá a zero mesmo em sobreoferta severa."],["PLDmax horário","R$ 1.611,04/MWh","Teto de cada hora individual. Referenciado no custo variável das térmicas mais caras representadas na programação."],["PLDmax estrutural","R$ 785,27/MWh","Teto da média do período. Os 24 valores horários do dia são ajustados para que a média respeite este limite, preservando o perfil da curva."]] },
    { kind: 'paragrafo', html: "Fonte: ANEEL, Despacho nº 3.850, de 23/12/2025. TEO fixada em R$ 18,27/MWh e TEO Itaipu em R$ 57,31/MWh para o mesmo ano. A metodologia de cálculo dos limites está na Resolução Normativa ANEEL nº 858/2019." },
    { kind: 'nota', tom: "neutro", label: "Números vivos · verificar na fonte antes de uso externo", html: "Limites de PLD são redefinidos todo ano por despacho da ANEEL. PLD realizado muda de hora em hora. Curvas de contrato mudam diariamente. Nenhum número desta aula deve ir para material de cliente sem consulta à CCEE e à ANEEL na data de uso." },
    { kind: 'titulo', numero: "2.3", texto: "O que move o PLD" },
    { kind: 'paragrafo', html: "Num sistema hidrotérmico, a variável dominante é <strong>hidrológica</strong>: energia natural afluente (ENA) contra a média de longo termo, e energia armazenada (EAR) nos reservatórios. Afluência abaixo da média força o modelo a preservar água, o que significa despachar térmica, o que eleva o CMO. Depois vêm carga, disponibilidade térmica, geração renovável no período e restrições de transmissão." },
    { kind: 'paragrafo', html: "Existe ainda um efeito sazonal estrutural que todo analista brasileiro carrega de cabeça: o <strong>período úmido</strong>, aproximadamente de dezembro a abril, recompõe reservatórios e alivia preço; o <strong>período seco</strong>, de maio a novembro, consome estoque e pressiona. Quando o período úmido frustra, o sistema entra no seco com menos água do que o planejado — e o preço não sobe em maio, sobe já em fevereiro, porque o modelo antecipa." },
    { kind: 'paragrafo', html: "Um retrato de janeiro de 2026 mostra a mecânica funcionando. No dia 8, o PLD operava perto de <strong>R$ 156/MWh</strong> em todos os quatro submercados — sistema acoplado, sem estresse local. Onze dias depois, a EAR estava em 43,3% no Sudeste/Centro-Oeste, 47,2% no Nordeste, 55,9% no Norte e 66,2% no Sul, com chuvas abaixo do padrão histórico em pleno período úmido. E a curva de contratos para o ano de 2026 no Sudeste/Centro-Oeste já negociava perto de <strong>R$ 355/MWh</strong>, contra uma média de cerca de R$ 223/MWh em 2025." },
    { kind: 'nota', tom: "gold", label: "Leia esses dois números juntos", html: "PLD spot em R$ 156 e contrato anual em R$ 355 <em>ao mesmo tempo</em> não é contradição nem erro de mercado. O spot precifica a hora que está acontecendo; o contrato precifica a <strong>expectativa</strong> de todas as horas do ano <strong>mais o prêmio de risco</strong> que alguém cobra para carregar essa incerteza no lugar do comprador. Quem compara os dois diretamente e conclui \"contrato está caro\" não entendeu o que está comprando." },
    { kind: 'titulo', numero: "2.4", texto: "Por que o PLD não é o preço da conta de luz" },
    { kind: 'paragrafo', html: "Este é o erro mais comum de quem chega ao setor pelo noticiário. O PLD valora apenas a diferença contratual. A fatura de um consumidor industrial é composta por energia contratada, tarifa de uso da rede (TUSD, e TUST quando aplicável), encargos setoriais, tributos e — só então — o resultado da liquidação no curto prazo, que para um agente bem contratado é uma fração pequena. Um PLD de R$ 800/MWh não multiplica a conta por cinco; ele encarece a parcela descoberta. É por isso que a pergunta comercial correta nunca é \"o PLD está alto?\", e sim \"qual é a minha exposição, em MWh, e em qual submercado?\"</b>." },
    { kind: 'nota', tom: "neutro", label: "PLD · três níveis", html: "<b>Criança de 12 anos.</b> É um preço de referência da energia para o pouquinho que sobrou ou faltou. Se você combinou comprar dez e usou onze, o um que faltou é cobrado por esse preço — e ele muda toda hora, dependendo de quanta água tem nos reservatórios.<br/><b>Executivo.</b> É o preço usado para liquidar a diferença entre a energia contratada e a energia efetivamente medida. Ele reflete a condição de curto prazo do sistema e é a principal fonte de volatilidade para quem opera no mercado livre sem contratação alinhada ao consumo real.<br/><b>Especialista.</b> É o preço de liquidação das diferenças, apurado por hora e por submercado a partir do CMO obtido no encadeamento NEWAVE/DECOMP/DESSEM, com aplicação dos limites mínimo, máximo horário e máximo estrutural vigentes. Sua leitura correta exige acompanhar ENA, EAR, carga, despacho térmico, restrições de intercâmbio, ESS e o fator de ajuste do MRE." },
    { kind: 'nota', tom: "neutro", label: "Onde isso entra no produto", html: "<strong>Conta de Luz Express</strong> e <strong>Mercado Livre Readiness</strong> dependem desta aula. A pergunta que os dois produtos respondem não é \"quanto custa a energia\", e sim \"quanto do custo desta empresa está descoberto e o que acontece com esse pedaço em cada cenário de PLD\". Sem 12 meses de dados medidos, qualquer resposta é hipótese — e o material sai como <em>oportunidades potenciais a validar</em>, nunca como economia estimada." },
  ],
  'aula-04-03': [
    { kind: 'titulo', numero: "3.1", texto: "Dois produtos, duas unidades" },
    { kind: 'paragrafo', html: "<strong>Energia é MWh</strong>: quanto foi efetivamente produzido ao longo de um período. <strong>Capacidade é MW</strong>: quanta potência estará disponível no instante em que o sistema precisar. Uma usina solar entrega muita energia anual e pouca capacidade no pico noturno. Uma térmica flexível pode entregar pouquíssima energia anual e ser decisiva na hora crítica. São produtos distintos, com clientes distintos e lógicas de remuneração distintas." },
    { kind: 'paragrafo', html: "O LCOE mede o primeiro produto e é <em>cego</em> ao segundo. Ele divide o valor presente dos custos pelo valor presente da geração — o que embute a premissa de que todo MWh vale o mesmo, independentemente de quando e onde aparece. Não vale. Um MWh às 13h de um dia de sol abundante e um MWh às 19h de um dia de reservatório baixo são mercadorias diferentes vendidas com o mesmo nome." },
    { kind: 'paragrafo', html: "E os produtos não param em dois. Um mesmo ativo pode vender <strong>energia</strong> (MWh), <strong>capacidade</strong> (MW disponíveis), <strong>flexibilidade</strong> (velocidade de subir e descer carga), <strong>serviços ancilares</strong> (controle de frequência, suporte de reativo, reserva operativa, autorrestabelecimento) e <strong>atributos ambientais</strong> (certificados). Empilhar essas receitas sobre o mesmo investimento tem nome no jargão de projeto — <em>revenue stacking</em> — e é o que torna viável um ativo que nenhuma dessas receitas sozinha pagaria." },
    { kind: 'titulo', numero: "3.2", texto: "O missing money, mecanicamente" },
    { kind: 'paragrafo', html: "Considere uma térmica de ponta. Ela existe para rodar poucas horas por ano, nas horas em que o sistema está apertado. Num mercado puramente de energia, ela recupera custo fixo apenas com a margem inframarginal dessas poucas horas — a diferença entre o preço daquele instante e o custo dela. A teoria diz que isso funciona: nas horas de escassez o preço deveria disparar o suficiente para pagar a disponibilidade do ano inteiro." },
    { kind: 'paragrafo', html: "Na prática, três coisas quebram o mecanismo. <strong>Tetos regulatórios</strong> impedem que o preço de escassez chegue ao valor que a teoria exige — no Brasil, o PLDmax horário e o estrutural da Aula 02. <strong>Eventos críticos são raros</strong>, o que torna a receita altamente incerta e cara de financiar: um fluxo de caixa que depende de 50 horas por ano tem variância que nenhum banco precifica com conforto. E preços muito altos são politicamente insustentáveis</b>: nenhum regulador aceita repassar ao consumidor final o preço que faria a matemática fechar sozinha. O resultado é o <strong>missing money problem</strong> — a receita de energia é estruturalmente insuficiente para remunerar a capacidade que o sistema precisa ter disponível." },
    { kind: 'titulo', numero: "3.3", texto: "Preço de escassez: a solução teórica que ninguém aplica inteira" },
    { kind: 'paragrafo', html: "A resposta ortodoxa ao missing money é deixar o preço subir muito nas horas críticas — o chamado <em>scarcity pricing</em>. A lógica é elegante: preço altíssimo sinaliza simultaneamente que se precisa de mais oferta, de menos demanda e de mais investimento, e remunera exatamente quem estava disponível quando importava. A referência conceitual para calibrar esse preço é o <strong>valor da energia não suprida</strong> — quanto custa à economia não atender a carga." },
    { kind: 'paragrafo', html: "O problema é que esse valor é enorme e desigual. Uma hora sem energia numa residência tem um custo; numa siderúrgica com forno em operação, num hospital ou num data center, tem outro, ordens de grandeza acima. Um preço que reflita honestamente essa média seria socialmente inaceitável quando aparecesse na fatura. Por isso praticamente todo sistema do mundo impõe teto — e, tendo imposto teto, precisa de um segundo mecanismo para pagar a capacidade que o teto impediu de remunerar. É uma escolha coerente, não uma incoerência: <strong>o teto e o mecanismo de capacidade são duas metades da mesma decisão</strong>." },
    { kind: 'nota', tom: "gold", label: "A frase que resolve a pergunta do Módulo 03", html: "A solar ganha no LCOE porque LCOE compara <strong>custo médio por MWh entregue</strong>. O gás roda porque o sistema não compra apenas MWh — compra também <strong>a garantia de que alguém liga às 19h de um dia ruim</strong>. Enquanto essas duas mercadorias forem pagas pelo mesmo mecanismo, uma delas será subremunerada." },
    { kind: 'titulo', numero: "3.4", texto: "Como o Brasil está endereçando isso" },
    { kind: 'paragrafo', html: "O Brasil não tem um mercado de capacidade formal e contínuo, do tipo que existe em mercados internacionais organizados. O que existe é uma sequência de <strong>leilões de reserva de capacidade na forma de potência — LRCAP</strong>, contratações pontuais em que o objeto não é entregar energia, mas <em>estar disponível</em>. É o mesmo problema atacado por outra porta: em vez de um mecanismo permanente que precifica capacidade todo ano, contratações discretas que compram disponibilidade por prazo determinado." },
    { kind: 'paragrafo', html: "O ciclo de 2026 é a melhor ilustração disponível — e também a mais controversa. O <strong>2º LRCAP</strong>, realizado em 18 de março de 2026, negociou <strong>18,97 GW</strong> de potência de hidrelétricas e térmicas a gás natural e carvão, com investimentos da ordem de R$ 64,5 bilhões e entregas escalonadas entre 2026 e 2031. O <strong>3º LRCAP</strong>, dois dias depois, contratou 501,3 MW de térmicas a óleo diesel, óleo combustível e biodiesel. A homologação pela ANEEL avançou em maio e junho de 2026 sob contestação do Ministério Público Federal, questionamentos no Tribunal de Contas da União e ações judiciais, com parte dos projetos ainda pendente de deliberação." },
    { kind: 'paragrafo', html: "A controvérsia não é acessória — ela é a aula. Contratar disponibilidade por quinze anos significa comprometer encargo de longo prazo do consumidor com base numa projeção de necessidade futura. Se a projeção estiver certa, o sistema comprou segurança barata. Se estiver errada, comprou uma dívida cara e irreversível. É exatamente a tensão da pergunta \"quem deve construir nova capacidade\" da tese deste módulo, e não existe desenho que a elimine — só desenhos que a distribuem melhor ou pior." },
    { kind: 'paragrafo', html: "Uma das críticas centrais ao desenho desses certames foi a <strong>exclusão do armazenamento</strong>. E é exatamente essa porta que se abriu em seguida: a Portaria Normativa MME nº 136, de junho de 2026, estabeleceu o <strong>1º LRCAP de armazenamento</strong>, em duas modalidades — uma com requisito de conteúdo nacional credenciado no BNDES e outra aberta —, com certames previstos para 2 e 4 de dezembro de 2026, início de suprimento em agosto de 2028 e contratos de potência de 15 anos." },
    { kind: 'nota', tom: "gold", label: "Conecte com o Módulo 03", html: "O leilão de baterias que você estudou como <em>notícia tecnológica</em> no Módulo 03 é, na verdade, um <strong>instrumento de desenho de mercado</strong>. Ele não existe porque bateria é uma tecnologia interessante. Ele existe porque o sistema tem um problema de capacidade que o preço de energia não resolve — e bateria é um jeito de comprar disponibilidade sem construir térmica." },
    { kind: 'nota', tom: "neutro", label: "Números vivos · verificar na fonte antes de uso externo", html: "Resultados, volumes e status de homologação do LRCAP estão em disputa administrativa e judicial ativa. Datas de certame e regras do leilão de armazenamento podem mudar por portaria. Antes de usar qualquer número desta aula em conversa comercial, confirme em ANEEL, EPE e MME." },
    { kind: 'nota', tom: "neutro", label: "Capacidade e missing money · três níveis", html: "<b>Criança de 12 anos.</b> É como o bombeiro. Ele quase nunca apaga incêndio, mas você paga o salário dele todo mês — porque no dia que pegar fogo, você precisa que ele esteja lá. Se você só pagasse por incêndio apagado, não sobraria bombeiro nenhum.<br/><b>Executivo.</b> Energia é o que a usina produz; capacidade é a garantia de que ela vai estar disponível na hora crítica. Um mercado que paga só por produção não remunera adequadamente ativos que existem para a emergência — o que cria risco de suprimento no médio prazo e exige mecanismos específicos de contratação de potência.<br/><b>Especialista.</b> É a insuficiência de receita inframarginal e de escassez num desenho <em>energy-only</em>, causada por tetos de preço, baixa frequência de eventos críticos e intervenções regulatórias, levando à necessidade de mecanismos de capacidade, contratos de confiabilidade ou leilões de reserva. No caso brasileiro, o instrumento é o LRCAP, com contratação de potência desacoplada da entrega de energia e remuneração por receita fixa de disponibilidade." },
    { kind: 'nota', tom: "neutro", label: "Onde isso entra no produto", html: "Esta é a aula que sustenta o <strong>GridAlpha Simulate</strong> quando ele sair do roadmap: avaliar um ativo de flexibilidade — bateria, gerador próprio, deslocamento de carga — exige empilhar receitas de fontes diferentes. Arbitragem de energia sozinha quase nunca fecha a conta; o caso forte combina arbitragem, redução de demanda contratada e, onde a regra permitir, disponibilidade." },
  ],
  'aula-04-04': [
    { kind: 'titulo', numero: "4.1", texto: "Leilão reverso, e a diferença entre corte e média" },
    { kind: 'paragrafo', html: "Num leilão comum, compradores sobem o preço. Num <strong>leilão reverso</strong>, vendedores <em>descem</em>. O comprador anuncia quanto quer contratar e sob quais requisitos técnicos; os vendedores competem oferecendo preços cada vez menores; o certame fecha quando a quantidade demandada é atendida. O último lance aceito é o <strong>preço de corte</strong>." },
    { kind: 'paragrafo', html: "Repare numa distinção que separa quem entende de quem repete: preço de corte não é preço médio contratado</b>. Se o certame liquida por lance individual, cada vencedor recebe o preço que ofertou, e a média fica <em>abaixo</em> do corte. Se liquida por preço uniforme, todos recebem o corte, e média e corte coincidem. A regra está no edital de cada leilão, não na teoria — e a diferença entre os dois arranjos vale bilhões ao longo de contratos de vinte anos." },
    { kind: 'paragrafo', html: "Existe ainda um terceiro elemento que a versão simplificada esconde: leilões reais raramente ordenam apenas por preço. Aplicam <strong>índices de custo-benefício</strong> que ajustam o lance pela contribuição do projeto ao sistema — disponibilidade em horários relevantes, garantia física, localização em relação à carga, custo de escoamento pela rede. Um projeto com lance nominal mais alto pode vencer um mais barato se entregar mais valor sistêmico. É por isso que ler resultado de leilão só pela coluna de R$/MWh produz conclusões erradas com frequência incômoda." },
    { kind: 'titulo', numero: "4.2", texto: "A escada A-1 a A-6" },
    { kind: 'paragrafo', html: "A nomenclatura confunde no começo e depois nunca mais. A letra <strong>A</strong> marca o ano de início do suprimento; o número diz <strong>quantos anos antes</strong> daquele início o contrato foi assinado. Um A-5 é um leilão realizado cinco anos antes da entrega. A lógica é simples: quanto mais longo o prazo de maturação do projeto, mais cedo ele precisa ter contrato para levantar financiamento." },
    { kind: 'tabela', linhas: [["Leilão","Antecedência","Perfil típico de vendedor","Função no sistema"],["A-1","1 ano","Predominantemente energia existente","Ajuste fino da contratação da distribuidora — corrige erro de projeção recente"],["A-3 / A-4","3–4 anos","Projetos de implantação rápida: solar e eólica cabem nesta janela","Expansão de curto ciclo, sensível a tecnologia que barateia depressa"],["A-5 / A-6","5–6 anos","Maturação longa: hidrelétricas, térmicas de porte, obras com licenciamento pesado","Expansão estrutural — decisões que amarram a matriz por décadas"]] },
    { kind: 'titulo', numero: "4.3", texto: "Energia nova, energia existente e os leilões de segurança" },
    { kind: 'paragrafo', html: "Há uma segunda distinção, ortogonal à primeira. <strong>Energia nova</strong> viabiliza empreendimento que ainda não existe: o contrato é a garantia de receita que destrava o financiamento, e o preço precisa cobrir capital novo. <strong>Energia existente</strong> vem de usina já operando e já amortizada, ou parcialmente: a lógica é de recontratação, não de expansão, e o preço tende a ser mais baixo porque o capital afundado já foi pago. Comparar preço de leilão de energia nova com preço de existente e concluir que \"a energia ficou mais cara\" é erro básico e frequente na imprensa." },
    { kind: 'paragrafo', html: "Fora do eixo de contratação das distribuidoras, existe uma terceira família: os leilões voltados à <strong>segurança do sistema</strong>. Energia de reserva contrata lastro adicional além do necessário para o mercado. E reserva de capacidade — o LRCAP da Aula 03 — contrata disponibilidade de potência, com objeto e lógica de remuneração completamente distintos: o vencedor se compromete a estar disponível, não a entregar volume." },
    { kind: 'titulo', numero: "4.4", texto: "O que o leilão resolve e o que ele não resolve" },
    { kind: 'paragrafo', html: "Resolve competição transparente, previsibilidade para o investidor, padronização contratual, coordenação da expansão e — quando bem desenhado — modicidade tarifária. Um contrato de vinte anos assinado num certame competitivo é o instrumento de financiamento mais barato disponível no setor elétrico brasileiro, e é por isso que ele existe." },
    { kind: 'paragrafo', html: "Não resolve o problema da <strong>previsão</strong>, e é aqui que a análise fica interessante. Um leilão contrata hoje para entregar daqui a cinco anos com base na demanda projetada de então. Se a projeção erra para cima, o consumidor cativo paga sobrecontratação por duas décadas. Se erra para baixo, o sistema fica exposto e a correção vem em leilão de ajuste, mais caro, feito sob pressão. Não resolve, tampouco, o risco de <strong>execução</strong>: lance agressivo demais é atraente no dia do certame e vira projeto atrasado ou inviabilizado depois — o que transfere o problema de volta ao sistema com anos de defasagem. E não resolve o <strong>envelhecimento tecnológico</strong>: um contrato longo assinado sobre a tecnologia e os custos de hoje pode se tornar caro quando a curva de custos se move, e o consumidor cativo carrega esse descompasso na tarifa sem ter como sair." },
    { kind: 'nota', tom: "gold", label: "O que ler num resultado de leilão", html: "Quatro números, nesta ordem: <strong>volume contratado</strong> contra volume demandado — mostra se houve competição real ou escassez de oferta; <strong>deságio</strong> contra o preço-teto — mostra quanta folga havia no teto; <strong>composição por fonte</strong> — mostra qual tecnologia estava competitiva naquele ciclo; e <strong>preço médio contra preço de corte</strong> — mostra a regra de liquidação e quanto valor ficou com cada lado." },
    { kind: 'nota', tom: "neutro", label: "Onde isso entra no produto", html: "Preços de leilão são o dado público mais limpo que existe para benchmark de custo de geração no Brasil — melhor que qualquer LCOE estimado, porque são preços de transação com contrato assinado. Para o <strong>Brazil Pulse</strong>, uma série histórica de preços de corte por fonte e por certame é ativo analítico de alto valor e baixo custo de coleta." },
  ],
  'aula-04-05': [
    { kind: 'titulo', numero: "5.1", texto: "Por que contratos de longo prazo existem" },
    { kind: 'paragrafo', html: "Duas necessidades opostas se encontram. Do lado do gerador: um projeto exige capital pesado desembolsado <em>antes</em> de qualquer receita, e nenhum banco financia um fluxo de caixa que depende de um preço spot volátil. Do lado do consumidor industrial: energia é custo relevante e orçamento anual não convive bem com variância. O contrato de longo prazo troca <strong>previsibilidade por flexibilidade</strong> — para os dois lados, na mesma assinatura." },
    { kind: 'paragrafo', html: "O que o contrato <em>não</em> faz é eliminar risco. Ele <strong>transforma</strong> risco. O comprador reduz exposição ao spot e assume, em troca, risco de volume, de perfil, de indexação e de contraparte. O vendedor ganha receita previsível e assume risco de entrega, de lastro e de submercado. Nada some. Tudo muda de dono — e o preço da cláusula é o pagamento por essa transferência." },
    { kind: 'titulo', numero: "5.2", texto: "As treze cláusulas que decidem o resultado" },
    { kind: 'tabela', linhas: [["Cláusula","O que ela decide","Onde costuma doer"],["Prazo","Horizonte do compromisso","Prazo longo trava o comprador se o mercado cair"],["Volume","Quanta energia é comprada","Volume acima do consumo real gera sobrecontratação estrutural"],["Preço","R$/MWh de partida","É a linha que todos leem e a que menos diferencia propostas"],["Indexação","Como o preço reajusta","IPCA, IGP-M, dólar ou fórmula híbrida mudam o custo total drasticamente"],["Submercado","Referência locacional","Contrato num submercado e carga em outro = risco de base aberto"],["Modulação","Distribuição horária","Contrato flat com carga noturna deixa exposição nas horas caras"],["Sazonalização","Distribuição mensal","Crítico para safra, irrigação, mineração sazonal e refrigeração"],["Flexibilidade","Banda de variação sem penalidade","Banda estreita transfere o risco de volume inteiro ao comprador"],["Take-or-pay","Pagamento mínimo obrigatório","Protege o vendedor; vira custo morto se a produção cair"],["Garantias","Proteção contra inadimplência","Carta fiança e depósito consomem capital de giro"],["Rescisão","Custo de sair","Multa pesada transforma contrato ruim em prisão"],["Change in law","Quem paga mudança regulatória","No setor elétrico brasileiro, cláusula essencial e frequentemente subestimada"],["Atributos","Quem fica com certificados renováveis","Relevante para meta de descarbonização e reporte de emissões indiretas"]] },
    { kind: 'titulo', numero: "5.3", texto: "Físico, financeiro e as variantes que aparecem em proposta" },
    { kind: 'paragrafo', html: "Num <strong>PPA físico</strong>, existe compromisso associado à entrega e ao registro do montante de energia. Num <strong>PPA financeiro</strong>, as partes liquidam apenas a diferença entre o preço contratado e um preço de referência — o contrato funciona como proteção de preço, não como suprimento. A distinção é decisiva e frequentemente obscurecida em apresentação comercial: um PPA financeiro não coloca um elétron a mais na fábrica, e a empresa continua precisando comprar energia física de alguém." },
    { kind: 'paragrafo', html: "Três variantes aparecem com frequência crescente. O <strong>contrato por diferença</strong> liquida contra um preço de exercício: se o mercado fica abaixo, uma parte paga; se fica acima, a outra compensa. O <strong>PPA virtual</strong> é a versão corporativa disso, associado a um projeto renovável específico, em que o comprador não recebe fisicamente aquela energia mas liquida diferenças e recebe os atributos ambientais. E o <strong>PPA intermediado</strong> — quando uma comercializadora se coloca entre gerador e consumidor, assumindo funções de balanço, gestão e liquidação. Cada arranjo move o risco de contraparte de lugar, e a pergunta correta em todos é a mesma: <em>quem está entre mim e o gerador, e o que acontece se essa parte sumir?</em>" },
    { kind: 'titulo', numero: "5.4", texto: "Perfil é mais importante que preço médio" },
    { kind: 'paragrafo', html: "Este é o erro caro mais comum em PPA renovável, e vale a pena vê-lo devagar. Uma empresa com consumo concentrado à noite recebe proposta de PPA solar com preço médio atraente e contrato <em>flat</em> — mesmo volume em todas as horas. No papel, o preço médio anual fecha. Na operação, a energia contratada aparece de dia e o consumo acontece de noite. O resultado é sobra de dia liquidada a preço baixo e falta de noite liquidada a preço alto, nas duas pontas contra o comprador. O contrato barato produziu uma exposição cara." },
    { kind: 'paragrafo', html: "A regra prática: uma usina não captura o preço médio do ano; captura o preço das horas em que gera</b>. Solar captura preço diurno; eólica captura preço nas horas de vento; hidráulica com reservatório tem alguma escolha, dentro das restrições operativas. Quando muita geração da mesma fonte se concentra nas mesmas horas, o preço daquelas horas cai e o valor capturado por todos os projetos daquela fonte cai junto — fenômeno que se chama <strong>canibalização</strong>. É o motivo pelo qual o vigésimo projeto solar de uma região vale menos que o primeiro, mesmo tendo exatamente a mesma ficha técnica." },
    { kind: 'titulo', numero: "5.5", texto: "O risco que virou protagonista: curtailment" },
    { kind: 'paragrafo', html: "Um PPA pressupõe que a energia contratada será gerada. No Brasil recente, essa premissa parou de ser segura. O corte de geração — <em>curtailment</em>, ou <em>constrained-off</em> quando determinado pelo operador — passou de exceção a fator estrutural nas fontes eólica e solar centralizada, com patamares que em 2025 se aproximaram de <strong>um quinto da geração possível</strong> dessas fontes. Mais importante que o número: a <em>razão</em> do corte mudou. Antes predominava restrição de transmissão; cada vez mais predomina <strong>sobreoferta</strong> — energia que simplesmente não tem demanda naquele instante. Projeções do operador apontam que, no fim desta década, a razão energética responderá pela quase totalidade dos cortes." },
    { kind: 'paragrafo', html: "Isso reposiciona três coisas de uma vez. Reposiciona o risco de receita de qualquer projeto renovável, e portanto o custo de capital dele. Reposiciona a cláusula de PPA que define <em>quem absorve o corte</em>, que deixou de ser detalhe jurídico e virou variável econômica de primeira ordem — o ressarcimento existe em regra para determinadas situações e modalidades, mas é objeto de disputa contínua entre agentes, regulador e operador. E reposiciona a discussão de armazenamento e de atração de carga — data centers, hidrogênio, eletrificação industrial — como resposta de demanda a um problema de oferta." },
    { kind: 'nota', tom: "neutro", label: "Números vivos · verificar na fonte antes de uso externo", html: "Percentuais de curtailment, composição por motivo e regras de ressarcimento mudam a cada ciclo regulatório e são objeto de disputa entre agentes, ANEEL e ONS. Use os dados abertos do ONS na data de consulta. Igualmente vivo: a Lei 15.269/2025 alterou o acesso ao desconto de TUSD para novos contratos de energia incentivada, mudando a economia de PPAs desse tipo — verifique a regulamentação vigente antes de qualquer comparação de custo." },
    { kind: 'nota', tom: "neutro", label: "PPA · três níveis", html: "<b>Criança de 12 anos.</b> É um combinado longo: eu compro sua energia por vários anos, e a gente decide agora o preço, quanto e quando. Assim ninguém leva susto — mas também ninguém pode mudar de ideia depois.<br/><b>Executivo.</b> É um contrato de médio ou longo prazo que fixa preço, volume, prazo e condições de fornecimento. Ele reduz a incerteza de custo do comprador e viabiliza o financiamento do vendedor, mas cria obrigações de volume e de indexação que precisam ser compatíveis com o perfil real de consumo.<br/><b>Especialista.</b> É um contrato bilateral que aloca explicitamente riscos de preço, volume, perfil, submercado, indexação, entrega, curtailment, contraparte e atributos ambientais. Pode ser físico, com entrega e registro do montante, ou financeiro, liquidando a diferença contra um preço de referência — caso em que funciona como instrumento de hedge e não como suprimento." },
    { kind: 'nota', tom: "neutro", label: "Onde isso entra no produto", html: "É o coração do <strong>Mercado Livre Readiness</strong>. Uma proposta de comercializadora se avalia lendo as treze cláusulas contra o perfil medido do cliente — não comparando R$/MWh contra a tarifa cativa. E toda saída do produto usa a linguagem da trava: <em>oportunidades potenciais a validar com dados completos</em>, nunca economia prometida." },
  ],
  'aula-04-06': [
    { kind: 'titulo', numero: "6.1", texto: "A definição operacional" },
    { kind: 'paragrafo', html: "Fazer hedge é assumir uma posição cujo resultado se move na direção <em>oposta</em> à da exposição que se quer proteger. Uma indústria descoberta perde quando o PLD sobe; portanto, o hedge dela precisa ganhar quando o PLD sobe. O resultado combinado é um custo mais estável — quase sempre acima do melhor cenário possível e sempre abaixo do pior." },
    { kind: 'paragrafo', html: "A consequência lógica, que precisa ser dita em voz alta antes de qualquer contrato: hedge não reduz o custo esperado; reduz a dispersão em torno dele</b>. Se o mercado cair depois, o hedge vai parecer um erro. Não foi. Foi um seguro que não precisou ser acionado, e ninguém chama o seguro do carro de erro porque não houve batida." },
    { kind: 'titulo', numero: "6.2", texto: "Os três instrumentos e o que cada um cobra" },
    { kind: 'paragrafo', html: "No <strong>swap</strong>, uma parte troca preço variável por preço fixo. O comprador de proteção paga um valor fixo e recebe o preço flutuante; se o PLD sobe, ele ganha no swap o que perde na liquidação física. Custo aparente zero, custo real embutido no nível do preço fixo, que sempre carrega prêmio de risco." },
    { kind: 'paragrafo', html: "No <strong>collar</strong>, o comprador aceita um teto e abre mão do benefício abaixo de um piso. Ele não paga prêmio explícito porque financia a proteção contra a alta vendendo o direito de aproveitar a baixa. É a estrutura preferida de quem tem restrição de caixa e não quer desembolsar prêmio — e a que mais gera arrependimento em mercado de queda, porque o piso corta justamente o ganho que apareceria." },
    { kind: 'paragrafo', html: "Na <strong>opção</strong>, o comprador paga um prêmio e adquire o direito, não a obrigação, de operar a determinado nível. É o único dos três que preserva integralmente o cenário favorável — e por isso é o único que custa dinheiro de saída. Em mercados de energia com liquidez limitada, opções são caras e escassas." },
    { kind: 'titulo', numero: "6.3", texto: "O estado real do mercado brasileiro" },
    { kind: 'paragrafo', html: "É preciso ser honesto sobre isso, porque a literatura internacional descreve um mercado que o Brasil não tem. Derivativos de energia padronizados e líquidos <strong>ainda são incipientes aqui</strong>. A esmagadora maioria do hedge praticado no mercado livre brasileiro é <strong>contratual</strong>, não financeira: você trava preço comprando energia por contrato bilateral, não comprando um derivativo. A referência de curva de preços futuros vem principalmente da negociação em ambiente de balcão organizado, com liquidez concentrada no submercado Sudeste/Centro-Oeste e nos vencimentos curtos — o que significa que travar preço para um horizonte de cinco anos num submercado do Norte é, na prática, uma negociação bilateral com pouca referência pública." },
    { kind: 'paragrafo', html: "Consequência prática para o analista: quando alguém diz \"vamos fazer hedge\", pergunte imediatamente <strong>com qual instrumento e contra qual referência</strong>. Se a resposta é \"comprando um contrato de energia\", isso é hedge físico-contratual e traz junto todas as treze cláusulas da Aula 05. Não é a mesma coisa que um swap financeiro, e o risco de contraparte é bem diferente." },
    { kind: 'titulo', numero: "6.4", texto: "O que sempre sobra" },
    { kind: 'paragrafo', html: "Hedge perfeito não existe. Sobra <strong>risco de base</strong> — a diferença entre o preço da referência do hedge e o preço da exposição real. Sobra descasamento de <strong>perfil</strong>, quando a proteção é mensal e a exposição é horária. Sobra risco de <strong>volume</strong>, quando o hedge cobre uma quantidade e o consumo entrega outra. E sobra risco de <strong>contraparte</strong>, que num contrato de quinze anos não é detalhe: a pergunta \"quem garante que essa comercializadora existe daqui a dez anos?\" é legítima e merece resposta documental — estrutura societária, rating, garantias bilaterais, limites de exposição por contraparte — e não retórica comercial." },
    { kind: 'nota', tom: "neutro", label: "Hedge · três níveis", html: "<b>Criança de 12 anos.</b> É como combinar um preço fixo do lanche pro ano inteiro. Se o preço subir, você se deu bem. Se cair, você paga um pouco mais — mas você já sabia quanto ia gastar, e era isso que você queria.<br/><b>Executivo.</b> É a proteção contra variação de preço. Reduz a volatilidade do custo de energia e torna o orçamento previsível, ao preço de abrir mão de parte do ganho se o mercado cair. A decisão correta depende da política de risco da empresa, não da expectativa de preço de quem está vendendo o instrumento.<br/><b>Especialista.</b> É a construção de uma posição de resultado inversamente correlacionado à exposição, via swap, collar, opção ou contrato físico. Residualmente permanecem risco de base, de perfil, de volume e de crédito. No mercado brasileiro, a liquidez de derivativos padronizados é limitada e o hedge predominante é contratual, o que traz junto risco de contraparte de longo prazo." },
    { kind: 'nota', tom: "gold", label: "Teste de sanidade", html: "Se o volume travado é maior que o consumo, aquilo deixou de ser hedge. Virou <strong>posição direcional</strong> — uma aposta na direção do preço, feita por uma empresa cujo negócio não é apostar em preço de energia. O instrumento acima mostra exatamente o ponto em que a curva atravessa essa fronteira." },
  ],
  'aula-04-07': [
    { kind: 'titulo', numero: "7.1", texto: "Contratação em camadas" },
    { kind: 'paragrafo', html: "A estrutura para a qual a maioria dos consumidores sofisticados converge é a mesma, e ela existe por um motivo econômico preciso: <strong>diferentes parcelas do consumo têm diferentes graus de certeza</strong>. O consumo que a empresa tem quase certeza de que existirá em cinco anos merece tratamento diferente do consumo que depende do plano de expansão que ainda não foi aprovado." },
    { kind: 'paragrafo', html: "Daí a estrutura: uma <strong>base longa</strong> que cobre o consumo estrutural, uma <strong>camada média</strong> que acompanha o horizonte de planejamento industrial, uma <strong>camada curta</strong> ajustada ao ano corrente e uma <strong>exposição residual</strong> deliberada. A exposição residual não é descuido — é a folga que permite absorver variação de produção sem cair em sobrecontratação. Uma empresa contratada a 100% do previsto não está protegida; está apenas trocando um risco por outro, e o outro costuma ser pior porque é irreversível." },
    { kind: 'tabela', linhas: [["Camada","Função","O que ela protege","O que ela custa"],["Base longa","Travar o consumo estrutural","Orçamento plurianual e financiamento de expansão","Rigidez se a operação encolher; multa se precisar sair"],["Média","Acompanhar o plano industrial","Ciclo de investimento e crescimento previsto","Prêmio de prazo intermediário"],["Curta","Ajustar ao ano corrente","Desvio já observado de consumo","Exposição ao preço do momento da compra"],["Residual","Absorver variação operacional","Flexibilidade real da planta","Exposição direta ao PLD"]] },
    { kind: 'paragrafo', html: "Há uma estrutura a termo escondida nessa tabela. Em condições normais, contratos mais longos carregam prêmio sobre contratos curtos, porque o vendedor está assumindo incerteza por mais tempo. Mas essa relação inverte com frequência: em ano de estresse hidrológico, o produto curto pode ficar <em>mais caro</em> que o longo, porque o curto precifica um problema que já está acontecendo e o longo precifica a reversão à média. Ler essa inversão é uma das leituras mais valiosas que um gestor de energia faz — e ela só é visível para quem acompanha a curva, não só o spot." },
    { kind: 'titulo', numero: "7.2", texto: "A política de risco, por escrito" },
    { kind: 'paragrafo', html: "O que separa uma empresa que <em>gere</em> energia de uma que <em>reage</em> a energia é um documento de uma página. Ele define: <strong>percentual mínimo contratado</strong> por horizonte, <strong>limite máximo de exposição</strong> ao curto prazo em MWh e em reais, <strong>indexadores permitidos</strong> e vedados, <strong>prazo máximo</strong> de contrato, <strong>critérios de contraparte</strong> — rating mínimo, garantias exigidas, limite de concentração por vendedor — e <strong>alçadas de aprovação</strong> por tamanho de decisão." },
    { kind: 'paragrafo', html: "Sem esse documento, cada decisão de contratação é tomada pelo humor do mercado e pela habilidade do vendedor da vez. Com ele, a conversa muda de natureza: em vez de \"esse preço está bom?\", a pergunta passa a ser \"essa proposta cabe na nossa política?\" — que é respondível com dados e não depende de prever preço. É a diferença entre uma decisão defensável em auditoria e uma decisão que precisa dar certo para ser justificada." },
    { kind: 'titulo', numero: "7.3", texto: "Cenários, não previsão" },
    { kind: 'paragrafo', html: "A pergunta certa nunca é \"qual vai ser o PLD\". É \"esta decisão sobrevive a quais cenários\". Um mínimo defensável são cinco: <strong>base</strong>, com premissas mais prováveis; <strong>PLD alto</strong>, com seca prolongada e despacho térmico intenso; <strong>PLD baixo</strong>, com hidrologia favorável e sobreoferta renovável; <strong>consumo abaixo do previsto</strong>, que expõe sobrecontratação e take-or-pay; e <strong>consumo acima do previsto</strong>, que força compra no curto prazo possivelmente no pior momento." },
    { kind: 'paragrafo', html: "Testar um cenário por vez é <em>análise de sensibilidade</em> — muda-se uma premissa e observa-se o efeito. Testar milhares de combinações simultâneas é <em>simulação estocástica</em>, útil quando o risco não é linear, que é justamente o caso quando existem cláusulas de take-or-pay, bandas de flexibilidade e multas: essas cláusulas criam degraus na função de custo, e degraus não aparecem numa análise de sensibilidade simples. Uma proposta só é boa se sobrevive aos cenários ruins — no cenário base, toda proposta parece boa; é para isso que ela foi escrita</b>." },
    { kind: 'titulo', numero: "7.4", texto: "O custo que importa e como ler uma proposta" },
    { kind: 'paragrafo', html: "O R$/MWh de uma proposta é a primeira parcela de sete. O custo total esperado soma <strong>energia contratada</strong>, <strong>custo da exposição</strong>, <strong>encargos setoriais</strong>, <strong>uso da rede</strong>, <strong>tributos</strong>, <strong>custo das garantias</strong> — que travam capital de giro e têm preço — e <strong>custo do risco</strong>, que é a diferença entre o cenário base e o cenário ruim ponderada pelo apetite da empresa. Comparar propostas pela primeira parcela é comparar carros pelo preço do pneu." },
    { kind: 'paragrafo', html: "Dez perguntas expõem uma proposta fraca em poucos minutos, e todas são respondíveis com documento: qual consumo histórico foi usado como base; se a economia estimada considerou perfil horário ou apenas média mensal; quais encargos foram incluídos e quais ficaram de fora; se o preço é fixo ou indexado e por qual índice; qual a multa de saída e sua fórmula; se o contrato acompanha crescimento de carga; quem assume risco de submercado; o que acontece se o consumo cair; se a comparação considerou demanda e uso de rede; e quais cenários de PLD foram testados. Uma proposta que não responde a essas dez com números não é uma proposta — é uma peça de venda." },
    { kind: 'nota', tom: "neutro", label: "Portfólio de contratação · três níveis", html: "<b>Criança de 12 anos.</b> É como não colocar todo o dinheiro num único lugar. Uma parte você combina agora por muitos anos, outra por pouco tempo, e deixa um pedacinho livre para o caso de precisar mudar. Assim, se der errado, dá errado só num pedaço.<br/><b>Executivo.</b> É contratar energia em camadas de prazos diferentes, em vez de tomar uma única decisão de compra. Reduz a dependência de acertar o momento certo do mercado, permite ajustar ao consumo real e distribui o risco ao longo do tempo — mas exige gestão contínua e uma política de risco definida pela diretoria.<br/><b>Especialista.</b> É a construção de uma carteira de contratos com escalonamento de prazos e de indexadores, calibrada por uma política formal que fixa percentual mínimo contratado, limite de exposição ao curto prazo, prazo máximo, indexadores admitidos, critérios de contraparte e alçadas. A avaliação é feita por cenários e sensibilidades sobre custo total esperado, não sobre preço unitário de energia." },
    { kind: 'nota', tom: "neutro", label: "Onde isso entra no produto", html: "Esta aula é a arquitetura conceitual de todo o portfólio GridAlpha do lado industrial: <strong>Conta de Luz Express</strong> diagnostica a posição atual, <strong>Mercado Livre Readiness</strong> avalia a mudança de ambiente, <strong>Brazil Pulse</strong> monitora as variáveis que movem a exposição, e <strong>GridAlpha Simulate</strong> — quando sair do roadmap — testa os cenários. Quatro produtos, uma única cadeia lógica." },
  ],
};


/** Os nove exercícios do § Ex. Nenhum aponta aula — ver o cabeçalho.
 *  `kind: 'discursiva'` porque todos pedem raciocínio escrito com
 *  gabarito em prosa; nenhum é múltipla escolha (o § Quiz, que é
 *  objetivo, é outra seção e não foi extraído nesta wave). */
export const MODULO_04_EXERCICIOS_SOLTOS: LessonActivity[] = [
  {
    id: "m04-ex-01",
    kind: 'discursiva' as const,
    prompt: "Demanda de 900 MW. Disponível: solar 200 MW a R$ 0/MWh, eólica 200 MW a R$ 20/MWh, hidráulica 300 MW com valor da água estimado em R$ 90/MWh, gás 300 MW com CVU de R$ 300/MWh. Qual usina é marginal e qual preço se forma?",
    points: 1,
    config: { tag: "01 · Quem é a usina marginal", gabarito: "Solar + eólica + hidráulica somam 700 MW. Faltam 200 MW, atendidos por gás. A usina marginal é o gás e o preço formado é R$ 300/MWh. O detalhe que importa: 700 dos 900 MW foram gerados a custo bem abaixo de R$ 300. A solar embolsou R$ 300/MWh tendo custo zero; a eólica, R$ 280 de margem; a hidráulica, R$ 210. Essa é a margem inframarginal, e é dela que essas usinas recuperam custo fixo. Quem só olha o preço formado não vê que a mesma hora produziu quatro resultados econômicos completamente diferentes." },
  },
  {
    id: "m04-ex-02",
    kind: 'discursiva' as const,
    prompt: "Mesmo sistema do exercício 01, mas o reservatório caiu e o valor da água subiu para R$ 340/MWh. O que acontece com a ordem e com o preço?",
    points: 1,
    config: { tag: "02 · O reservatório muda a fila", gabarito: "A hidráulica sai da terceira posição e vai para a quarta, atrás do gás. A fila vira: solar 200, eólica 200, gás 300 = 700 MW; faltam 200 MW, atendidos pela hidráulica. A marginal agora é a hidráulica e o preço é R$ 340/MWh. Repare no que aconteceu: nenhuma usina mudou, nenhum combustível ficou mais caro, a demanda é a mesma — e o preço subiu 13%. O que mudou foi uma expectativa sobre o futuro, traduzida em custo de oportunidade pelo modelo. É esse mecanismo que torna o preço brasileiro tão sensível a notícia de chuva." },
  },
  {
    id: "m04-ex-03",
    kind: 'discursiva' as const,
    prompt: "Uma indústria contratou 1.000 MWh no mês e mediu 1.150 MWh. O PLD médio do período foi R$ 480/MWh. Qual o custo bruto da exposição? E se o PLD tivesse sido R$ 156/MWh?",
    points: 1,
    config: { tag: "03 · Custo da exposição", gabarito: "Exposição = 150 MWh. A R$ 480/MWh: R$ 72.000. A R$ 156/MWh: R$ 23.400. Mesma decisão de contratação, mesmo desvio operacional, custo três vezes maior — e a empresa não controlou nenhuma das duas variáveis. É por isso que a banda de flexibilidade é uma cláusula econômica, não jurídica: ela define o tamanho da aposta que a empresa faz involuntariamente todo mês." },
  },
  {
    id: "m04-ex-04",
    kind: 'discursiva' as const,
    prompt: "A mesma indústria contratou 1.000 MWh a R$ 355/MWh e mediu apenas 850 MWh, com PLD de R$ 140/MWh. Qual o problema econômico?",
    points: 1,
    config: { tag: "04 · Sobrecontratação", gabarito: "Ela pagou 1.000 MWh a R$ 355 = R$ 355.000, e a sobra de 150 MWh é liquidada a R$ 140/MWh = R$ 21.000. O custo efetivo dos 850 MWh que ela de fato usou é (355.000 − 21.000) / 850 ≈ R$ 393/MWh — acima do preço que ela julgava ter travado. Sobrecontratar não é neutro: é comprar caro para revender barato. E a assimetria é cruel — a sobra costuma aparecer justamente quando o PLD está baixo, porque as duas coisas têm a mesma causa: atividade econômica fraca." },
  },
  {
    id: "m04-ex-05",
    kind: 'discursiva' as const,
    prompt: "Uma térmica de ponta de 150 MW custa R$ 320/kW-ano para ficar disponível. Ela roda 180 horas por ano com margem líquida de R$ 450/MWh. A receita de energia cobre o custo fixo? Quanto falta, por kW-ano?",
    points: 1,
    config: { tag: "05 · Missing money na mão", gabarito: "Energia gerada = 150 MW × 180 h = 27.000 MWh. Receita = 27.000 × 450 = R$ 12,15 milhões. Custo fixo = 150.000 kW × 320 = R$ 48 milhões. Falta R$ 35,85 milhões — ou R$ 239/kW-ano. Esse número é exatamente o que um mecanismo de capacidade precisaria pagar para o ativo existir. É o missing money, medido. E note quanto teria que subir a margem para fechar sem capacidade: seriam necessários R$ 1.778/MWh nas 180 horas — acima do teto horário do PLD. O teto não é um detalhe do problema; é o problema." },
  },
  {
    id: "m04-ex-06",
    kind: 'discursiva' as const,
    prompt: "Um leilão reverso demanda 800 MW. Propostas: A 300 MW a R$ 180; B 250 MW a R$ 210; C 400 MW a R$ 245; D 200 MW a R$ 290. Teto do edital: R$ 260/MWh. Qual o preço de corte, qual o preço médio por lance, e qual o custo anual da diferença entre os dois arranjos de liquidação, considerando 800 MW médios?",
    points: 1,
    config: { tag: "06 · Preço de corte e preço médio", gabarito: "D está acima do teto e é excluída. Contratam-se A (300), B (250) e 250 MW de C — total 800 MW. Preço de corte = R$ 245/MWh. Preço médio por lance = (300×180 + 250×210 + 250×245) / 800 = (54.000 + 52.500 + 61.250) / 800 = R$ 209,69/MWh . A diferença é R$ 35,31/MWh. Sobre 800 MW médios ao longo de um ano — 800 × 8.760 = 7.008.000 MWh — isso equivale a cerca de R$ 247 milhões por ano transferidos do consumidor para os geradores, dependendo apenas da regra de liquidação do edital. Nenhuma tecnologia mudou; só a regra." },
  },
  {
    id: "m04-ex-07",
    kind: 'discursiva' as const,
    prompt: "Uma empresa com 900 MWh/mês de consumo, concentrado no período noturno, recebe proposta de PPA solar de 600 MWh/mês em contrato flat, a preço abaixo da curva de mercado. Liste os riscos a analisar antes de qualquer conclusão.",
    points: 1,
    config: { tag: "07 · PPA com perfil errado", gabarito: "Descasamento de perfil — geração diurna contra consumo noturno, gerando sobra de dia e falta de noite, ambas liquidadas contra o comprador; ausência de modulação; sazonalização da geração solar contra a sazonalidade do consumo; submercado do contrato contra submercado da carga; quem absorve corte de geração; natureza do contrato — físico, financeiro ou virtual; titularidade dos atributos ambientais; garantias exigidas e seu custo de capital de giro; multa de rescisão; e efeito da regra vigente de desconto na tarifa de uso da rede sobre a economia comparada. O preço médio abaixo do mercado é a última coisa a olhar, não a primeira — e frequentemente é baixo justamente porque o vendedor sabe que o perfil vale menos." },
  },
  {
    id: "m04-ex-08",
    kind: 'discursiva' as const,
    prompt: "Uma empresa consome 10.000 MWh/mês e trava 7.000 MWh num swap a R$ 320/MWh. O PLD do mês fecha em R$ 470/MWh. Qual o resultado do swap, o custo total do mês e o custo efetivo por MWh? E se o PLD tivesse fechado em R$ 180?",
    points: 1,
    config: { tag: "08 · Swap e custo efetivo", gabarito: "Cenário alto: resultado do swap = (470 − 320) × 7.000 = +R$ 1,05 milhão . Custo sem hedge = 10.000 × 470 = R$ 4,7 milhões. Custo com hedge = R$ 3,65 milhões. Custo efetivo = R$ 365/MWh . Cenário baixo: resultado = (180 − 320) × 7.000 = −R$ 980 mil . Custo sem hedge = R$ 1,8 milhão. Custo com hedge = R$ 2,78 milhões. Custo efetivo = R$ 278/MWh . A amplitude sem hedge seria de R$ 180 a R$ 470 — 290 reais. Com hedge, de R$ 278 a R$ 365 — 87 reais. O hedge não escolheu um lado; ele comprimiu o intervalo em 70%. Essa é a única coisa que ele faz, e é a única coisa que se deve prometer ao conselho." },
  },
  {
    id: "m04-ex-09",
    kind: 'discursiva' as const,
    prompt: "Uma empresa consome 10.000 MWh/mês e tem política de risco que exige no mínimo 80% contratado e limita a exposição ao curto prazo a R$ 500 mil por mês no cenário de estresse. O cenário de estresse adotado é PLD de R$ 700/MWh. A empresa está contratada em 85%. A posição atende à política?",
    points: 1,
    config: { tag: "09 · Portfólio e política de risco", gabarito: "Exposição = 15% × 10.000 = 1.500 MWh/mês. No cenário de estresse: 1.500 × 700 = R$ 1,05 milhão — mais que o dobro do limite de R$ 500 mil. Ou seja: a empresa cumpre o critério de percentual e viola o critério de valor. Os dois critérios não são redundantes, e é comum uma política ter só o primeiro. Para respeitar o limite de R$ 500 mil a R$ 700/MWh, a exposição máxima seria de 714 MWh/mês — cerca de 7,1% do consumo. A política precisaria exigir 93% contratado, não 80%. A lição é sobre desenho de política, não sobre contratação: limite percentual e limite financeiro precisam ser calibrados um contra o outro, no cenário de estresse que a empresa realmente teme. Uma política com os dois números desalinhados dá conforto falso — e o falso conforto é pior que a ausência de política, porque ninguém revisa o que parece resolvido." },
  },
];


export const MODULO_04_AULAS: CurriculumAula[] = [
  {
    id: 'aula-04-01',
    moduleId: 'modulo-04',
    number: 1,
    totalInModule: 7,
    title: "Ordem de mérito como formador de preço",
    subtitle: "Formação de preço",
    track: 'universal',
    language: 'pt-BR',
    durationMinutes: null,
    difficulty: null,
    submercados: [],
    competencies: [],
    illustrations: [],
    video: null,
    // § Ref existe (17ª seção), mas é bibliografia do MÓDULO, não da
    // aula — mesma constatação que a Wave 15 fez para o Módulo 01.
    references: [],
    activities: [],
    instruments: [INSTRUMENTOS_MODULO_04[0]],
  },
  {
    id: 'aula-04-02',
    moduleId: 'modulo-04',
    number: 2,
    totalInModule: 7,
    title: "PLD: o preço do curto prazo",
    subtitle: "Curto prazo",
    track: 'universal',
    language: 'pt-BR',
    durationMinutes: null,
    difficulty: null,
    submercados: [],
    competencies: [],
    illustrations: [],
    video: null,
    // § Ref existe (17ª seção), mas é bibliografia do MÓDULO, não da
    // aula — mesma constatação que a Wave 15 fez para o Módulo 01.
    references: [],
    activities: [],
    instruments: [INSTRUMENTOS_MODULO_04[1]],
  },
  {
    id: 'aula-04-03',
    moduleId: 'modulo-04',
    number: 3,
    totalInModule: 7,
    title: "Energia × capacidade e o missing money",
    subtitle: "Desenho de mercado",
    track: 'universal',
    language: 'pt-BR',
    durationMinutes: null,
    difficulty: null,
    submercados: [],
    competencies: [],
    illustrations: [],
    video: null,
    // § Ref existe (17ª seção), mas é bibliografia do MÓDULO, não da
    // aula — mesma constatação que a Wave 15 fez para o Módulo 01.
    references: [],
    activities: [],
    instruments: [INSTRUMENTOS_MODULO_04[2]],
  },
  {
    id: 'aula-04-04',
    moduleId: 'modulo-04',
    number: 4,
    totalInModule: 7,
    title: "Leilões: como o regulador descobre o preço",
    subtitle: "Descoberta de preço",
    track: 'universal',
    language: 'pt-BR',
    durationMinutes: null,
    difficulty: null,
    submercados: [],
    competencies: [],
    illustrations: [],
    video: null,
    // § Ref existe (17ª seção), mas é bibliografia do MÓDULO, não da
    // aula — mesma constatação que a Wave 15 fez para o Módulo 01.
    references: [],
    activities: [],
    instruments: [INSTRUMENTOS_MODULO_04[3]],
  },
  {
    id: 'aula-04-05',
    moduleId: 'modulo-04',
    number: 5,
    totalInModule: 7,
    title: "PPA: onde mora a economia real",
    subtitle: "Longo prazo",
    track: 'universal',
    language: 'pt-BR',
    durationMinutes: null,
    difficulty: null,
    submercados: [],
    competencies: [],
    illustrations: [],
    video: null,
    // § Ref existe (17ª seção), mas é bibliografia do MÓDULO, não da
    // aula — mesma constatação que a Wave 15 fez para o Módulo 01.
    references: [],
    activities: [],
    instruments: [INSTRUMENTOS_MODULO_04[4]],
  },
  {
    id: 'aula-04-06',
    moduleId: 'modulo-04',
    number: 6,
    totalInModule: 7,
    title: "Hedge: travando exposição ao PLD",
    subtitle: "Gestão de risco",
    track: 'universal',
    language: 'pt-BR',
    durationMinutes: null,
    difficulty: null,
    submercados: [],
    competencies: [],
    illustrations: [],
    video: null,
    // § Ref existe (17ª seção), mas é bibliografia do MÓDULO, não da
    // aula — mesma constatação que a Wave 15 fez para o Módulo 01.
    references: [],
    activities: [],
    instruments: [INSTRUMENTOS_MODULO_04[5]],
  },
  {
    id: 'aula-04-07',
    moduleId: 'modulo-04',
    number: 7,
    totalInModule: 7,
    title: "Portfólio de contratação",
    subtitle: "Síntese",
    track: 'universal',
    language: 'pt-BR',
    durationMinutes: null,
    difficulty: null,
    submercados: [],
    competencies: [],
    illustrations: [],
    video: null,
    // § Ref existe (17ª seção), mas é bibliografia do MÓDULO, não da
    // aula — mesma constatação que a Wave 15 fez para o Módulo 01.
    references: [],
    activities: [],
    instruments: [INSTRUMENTOS_MODULO_04[6]],
  },
];

export const getAulaModulo04 = (id: string): CurriculumAula | undefined =>
  MODULO_04_AULAS.find((a) => a.id === id);
