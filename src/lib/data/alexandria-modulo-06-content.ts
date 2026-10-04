// alexandria-modulo-06-content.ts
// Bloco 6 — História do Setor Elétrico Brasileiro.
// Nível 2, track 'brasil' — PRIMEIRO módulo fora da Trilha 1.
//
// EXTRAÍDO de `Alexandria modulos/alexandria_modulo06.html` (207.980
// bytes sem o <script>, o maior módulo do currículo até aqui), não
// transcrito. Nome do arquivo conferido no disco antes de abrir.
//
// TRACK CONFIRMADO no catálogo da FOUNDRY, não presumido:
// `{ id: 'bloco-06', level: 2, track: 'brasil', illustrationPrefix: 'his-' }`.
// As seis aulas carregam `track: 'brasil'` — as 42 aulas dos Módulos
// 01-05 são 'universal'.
//
// ── VOCABULÁRIO MEDIDO ANTES DE ESCOLHER EXTRATOR ─────────────
// Os seletores dos Módulos 01-03 dão ZERO aqui (class="aula",
// aula-marker, div.exercise, exercise-tag, glossary-item,
// checklist-item). É o vocabulário abreviado dos Módulos 04-05:
// `sec-id` · `lede` · `inst` · `box` · `lv` · `det-bd`.
//
// ── CONTAGEM REAL, três sinais ────────────────────────────────
//     | sinal      | prosa da fonte              | markup |
//     | aulas      | §MAP "Seis aulas"           | 6 seções `Aula NN` |
//     | exercícios | §Ex "Dez exercícios"        | 10 <details> |
//     | glossário  | §Lex "Noventa e nove termos"| 99 .term |
//
// 16 seções = 6 aulas + 10 de aparato. **142 blocos de apostila.**
// Prosa e markup concordam nos três — segunda vez seguida (o Módulo 04
// foi a primeira).
//
// ── OS NOVE EXERCÍCIOS... SÃO DEZ, E TODOS SOLTOS ─────────────
// A varredura por /[Aa]ula\s*\d+/ no enunciado E no gabarito dos dez
// devolve ZERO ocorrência — o <summary> traz só `NN · Título`. Mesma
// situação do Módulo 04: o vínculo não foi inventado, os dez vão para
// `MODULO_06_EXERCICIOS_SOLTOS` e as aulas ficam com `activities: []`.
//
// ── video: null, MEDIDO ───────────────────────────────────────
// Zero <video>, <iframe>, youtube, vimeo e .mp4 no arquivo inteiro.

import type { CurriculumAula, Instrument, LessonActivity } from '@/lib/types/alexandria';
import type { AulaBloco } from './alexandria-modulo-01-content';


/** Os onze pares trauma → cicatriz do INST 08, literais do `var T` do
 *  <script> da fonte. Cada um traz o período, o problema revelado, a
 *  resposta institucional, a cicatriz que ainda opera e o risco novo
 *  que a resposta trouxe junto.
 *
 *  Vivem aqui e não no markup porque a fonte gera o grid por script —
 *  o HTML traz só `<div class="tr-grid" id="i8-grid"></div>` vazio. */
export const MODULO_06_TRAUMA_CICATRIZ: ReadonlyArray<{
  periodo: string; titulo: string; problema: string;
  resposta: string; cicatriz: string; riscoNovo: string;
}> = [
  { periodo: "1900–1930", titulo: "Concessão municipal diante de empresa continental",
    problema: "Prefeitura sem corpo técnico nem poder de auditoria negociando tarifa com companhia que operava em vários países, e rios que atravessavam divisas municipais sem que ninguém tivesse competência sobre a bacia inteira.",
    resposta: "Código de Águas de 1934: federalização do poder concedente, desvinculação do potencial hidráulico em relação ao solo e controle técnico, contábil e financeiro das concessionárias.",
    cicatriz: "Outorga e planejamento de aproveitamentos hidrelétricos permanecem federais. Rio, rede e segurança de suprimento são assunto da União — em todos os ciclos, sem exceção.",
    riscoNovo: "Uma regra nacional de remuneração pelo custo histórico, insensível à capacidade local de financiar expansão sob inflação e câmbio." },
  { periodo: "1940–1955", titulo: "Escassez sem capital para construir",
    problema: "A União tinha competência jurídica sobre o recurso e nenhuma capacidade de mobilizar capital para explorá-lo. Guerra, equipamento importado inacessível e demanda urbana acelerando produziram racionamentos.",
    resposta: "O Estado assume a construção: Chesf em 1945, BNDE e Cemig em 1952, Furnas em 1957 e a Eletrobras autorizada em 1961, com base financeira em imposto único e empréstimo compulsório.",
    cicatriz: "O Estado permanece planejador e financiador de última instância da expansão elétrica, mesmo com o setor majoritariamente privado — e a conta de luz continua carregando política pública embutida.",
    riscoNovo: "Tarifa e investimento passam a depender de decisão política, o que abriu caminho para o uso da tarifa como instrumento macroeconômico duas décadas depois." },
  { periodo: "Anos 1980", titulo: "Tarifa como âncora e dívida externa",
    problema: "Obrigação legal de expandir com preço definido por conveniência anti-inflacionária, dívida externa impagável após o choque de juros, remuneração garantida anulando o incentivo a custo e equalização apagando a comparação entre empresas.",
    resposta: "Lei nº 8.631/1993: extinção da remuneração garantida e da equalização, encontro de contas e tarifa por concessão. Em seguida, agência reguladora, desverticalização e privatização de distribuidoras.",
    cicatriz: "Tarifa individualizada por concessão, com lógica de equilíbrio econômico-financeiro contratual e revisão periódica — a arquitetura tarifária que o Módulo 05 descreveu como conceito.",
    riscoNovo: "As diferenças regionais de custo, antes ocultas pela equalização, tornam-se visíveis na conta — e geram pressão política recorrente por novos mecanismos de compensação." },
  { periodo: "1996–2000", titulo: "Reforma sem dono da expansão",
    problema: "Distribuição vendida, geração majoritariamente estatal, obrigação estatal de expandir removida e mecanismo privado de expansão ainda não funcional — sem preço confiável, sem contrato longo bancável e com regras em disputa.",
    resposta: "Criação do ONS e do MAE em 1998 e do arcabouço de livre acesso; e, depois do racionamento, a reconstrução completa de 2004.",
    cicatriz: "Separação institucional entre quem regula, quem opera e quem contabiliza — e a convicção, hoje quase consensual no setor, de que transição institucional precisa ser sequenciada, não simultânea.",
    riscoNovo: "Complexidade institucional crescente: mais órgãos, mais interfaces e mais custo de coordenação entre eles." },
  { periodo: "2001", titulo: "Racionamento",
    problema: "Margem de capacidade firme insuficiente encontrando hidrologia adversa, com risco de déficit conhecido desde 1999 que não se converteu em decisão nem em divulgação.",
    resposta: "Novo Modelo de 2004: EPE para planejar, CCEE para contabilizar, CMSE para monitorar continuamente, dois ambientes de contratação e — a peça decisiva — obrigação de cobertura contratual integral com antecedência e lastro.",
    cicatriz: "Toda a arquitetura de contratação de longo prazo do ambiente regulado, o planejamento indicativo estruturado e a cultura de que segurança de suprimento não pode depender de decisão discricionária.",
    riscoNovo: "Erro de projeção de demanda deixa de virar racionamento e passa a virar sobrecontratação repassada à tarifa. O risco não sumiu — trocou de forma e de pagador." },
  { periodo: "2012–2013", titulo: "Redução tarifária por prorrogação antecipada",
    problema: "Ativos amortizados remunerados como novos, e a renda de concessão em disputa. A resposta escolhida foi capturá-la para o consumidor por prorrogação antecipada com receita menor e regime de cotas.",
    resposta: "MP 579 e Lei nº 12.783/2013, com adesão voluntária e indenização por ativos não amortizados.",
    cicatriz: "O regime de cotas para parte das hidrelétricas e o debate permanente sobre renovação de outorga, valor de indenização e custo de capital em concessões maduras.",
    riscoNovo: "Mudança abrupta de fluxo de caixa afetando capacidade de investimento e valor de mercado das companhias atingidas, bem na virada da hidrologia. É a demonstração de que redução de tarifa sem compatibilidade com investimento apenas adia a conta." },
  { periodo: "2014–2015", titulo: "Crise hídrica e custo térmico",
    problema: "Despacho térmico prolongado elevando o custo de geração exatamente quando parte das tarifas havia sido comprimida, com distribuidoras contratualmente expostas à diferença.",
    resposta: "Conta-ACR em 2014, revisão tarifária extraordinária em 2015 e aplicação efetiva das bandeiras tarifárias.",
    cicatriz: "As bandeiras tarifárias, que aproximam o momento do custo do momento do pagamento e impedem a formação silenciosa de passivo — a doença crônica do setor desde os anos 1980.",
    riscoNovo: "Volatilidade mensal na conta de quem não tem instrumento para se proteger dela, e um mecanismo tarifário que o debate público confunde sistematicamente com tributo." },
  { periodo: "2015–2025", titulo: "GSF e judicialização",
    problema: "Fronteira contestável entre risco hidrológico contratualmente alocado ao gerador e efeito de decisões sistêmicas — despacho por segurança, atraso de transmissão, deslocamento por outras fontes.",
    resposta: "Três camadas legislativas sucessivas: repactuação por prêmio de risco em 2015, repactuação por extensão de outorga condicionada à renúncia em 2020 e conversão dos passivos em títulos negociáveis liquidáveis por leilão a partir de 2025.",
    cicatriz: "Atenção redobrada, em qualquer contrato de energia, à definição precisa do que conta como cada risco e de quem decide isso — e a consciência de que a liquidação é rateio, não caixa com fundo próprio.",
    riscoNovo: "Um precedente de renegociação retroativa de alocação contratual, que altera a expectativa dos agentes sobre a estabilidade de qualquer alocação futura." },
  { periodo: "2020", titulo: "Pandemia e queda de receita",
    problema: "Colapso do consumo comercial e industrial com custos fixos e obrigações contratuais intactos, pressionando o caixa das distribuidoras.",
    resposta: "Conta-Covid: antecipação coletiva de recursos para preservar liquidez e diferir o impacto tarifário.",
    cicatriz: "A confirmação de uma assinatura institucional brasileira: choque sistêmico gera mecanismo financeiro coletivo, com custo diferido para a tarifa. Foi assim em 2001, em 2014 e em 2020.",
    riscoNovo: "Normalização do socorro financeiro como resposta padrão, com acúmulo de componentes financeiros na tarifa que o consumidor não consegue rastrear." },
  { periodo: "2021", titulo: "Escassez severa sem racionamento",
    problema: "Uma das piores hidrologias em décadas testando o modelo de 2004 — desta vez com parque térmico maior, transmissão mais robusta e obrigação de contratação em vigor.",
    resposta: "Câmara de regras excepcionais para gestão hidroenergética, intensificação térmica e de importação, e bandeira específica de escassez hídrica de setembro de 2021 a abril de 2022.",
    cicatriz: "A demonstração empírica de que a arquitetura de 2004 funciona: choque comparável ao de 2001, e nenhum corte compulsório de consumo. É o melhor argumento disponível contra a leitura de que o setor não aprendeu nada.",
    riscoNovo: "A descoberta de que energia anual não é potência nem flexibilidade — e a agenda ainda aberta de reserva de capacidade e armazenamento que chega à lei de 2025." },
  { periodo: "2024–2028", titulo: "Erosão da base cativa",
    problema: "Cada consumidor que migra deixa de dividir custos fixos que continuam existindo, e a parcela é redistribuída entre os que ficam. Abrir rápido demais não é liberalizar — é transferir custo sem dizer.",
    resposta: "Abertura escalonada por portaria de 2019 a 2024, abertura integral do Grupo A em janeiro de 2024 e cronograma legal para a baixa tensão na Lei nº 15.269/2025, com supridor de última instância, produto padrão e fim do desconto de fio para novas migrações.",
    cicatriz: "Ainda em formação — esta é a única linha do mapa cuja cicatriz está sendo escrita agora, e é por isso que ela vale mais para a GridAlpha que todas as outras somadas.",
    riscoNovo: "Assimetria de informação e risco de contraparte transferidos para consumidores sem estrutura de gestão de risco. Um mercado de massa exige proteção ao consumidor que o mercado de grandes cargas nunca precisou ter." },
];


// ── OS SETE INSTRUMENTOS DE AULA ──────────────────────────────
//
// A fonte tem OITO `<div class="inst">`. O `Inst · 01` ("Linha do
// tempo · quatorze marcos, de 1879 a 2028") vive no § MAP, que é
// aparato — fora de qualquer aula — e por isso NÃO entra aqui, mesmo
// tratamento que o `LAB · 01` do Módulo 01 recebeu na Wave 4. A Aula
// 06 é a única com DOIS instrumentos (07 e 08).
//
// QUATRO TIPOS FORA DO ENUM, mapeados pela MECÂNICA e nunca pelo nome,
// com o título literal preservado na tela (é o `title` que o painel
// renderiza):
//
//   fonte                          mecânica real                     → kind
//   'Linha do tempo'               14 marcos clicáveis, sem cálculo    (fora de aula)
//   'Termômetro do racionamento'   4 campos numéricos → 4 readouts   → simulador
//   'Linha da abertura'            2 campos numéricos → 4 saídas     → simulador
//   'Mapa trauma → cicatriz'       11 itens, seleção revela texto    → explorador
//
// O 'Termômetro' aqui NÃO é o mesmo do Módulo 05: lá eram 8 chaves
// booleanas com peso (mapeado para 'quebra-cabeca'), aqui são campos
// numéricos de balanço energético. Mecânica decide, não nome — é essa
// a razão de não haver regra fixa por prefixo.
//
// SAÍDAS: a fonte declara 24 readouts nas sete. **Dezoito entram.**
// Seis ficam de fora por serem texto puro, que
// `ResultadoInstrumento.valores` (Record<string, number>) não comporta:
//
//   i4-nf  "Nível final sem corte"   → 'esgotado' ou percentual
//   i5-rb  "Horizonte de menor atrito" → '3 anos'
//   i7-st  "Situação"                → 'Elegível' / 'Não elegível'
//   i7-lm  "Limiar no ano"           → '—' / 'sem limite' / valor
//   i7-nm  "Norma habilitante"       → nome da norma
//   i7-el  "Elegível a partir de"    → ano de referência
//
// O INST 07 fica com ZERO saída numérica — as quatro dele são textuais.
// Não é defeito da porta: é um instrumento de consulta regulatória, e o
// veredito literal da fonte carrega a leitura inteira. Mesma pendência
// de contrato que as Waves 19 e 24 registraram.
export const INSTRUMENTOS_MODULO_06: Instrument[] = [
  {
    id: "m06-inst-02",
    kind: "simulador",
    title: "Simulador · a erosão do custo histórico",
    formula: null,
    fields: [
      { id: "i2-h-n", label: "Investimento original reconhecido", unit: "índice", kind: "range", defaultValue: 100, min: 20, max: 500, step: 5 },
      { id: "i2-i-n", label: "Inflação média anual", unit: "% a.a.", kind: "range", defaultValue: 12, min: 0, max: 40, step: 1 },
      { id: "i2-n-n", label: "Anos desde o investimento", unit: "anos", kind: "range", defaultValue: 15, min: 1, max: 30, step: 1 },
      { id: "i2-m-n", label: "Parcela importada do equipamento", unit: "%", kind: "range", defaultValue: 60, min: 0, max: 100, step: 5 },
      { id: "i2-c-n", label: "Câmbio acima da inflação", unit: "p.p. a.a.", kind: "range", defaultValue: 4, min: 0, max: 15, step: 1 },
    ],
    outputs: [
      { id: "i2-cb", label: "Cobertura", unit: null },
      { id: "i2-rp", label: "Custo de reposição", unit: null },
      { id: "i2-pc", label: "Poder de compra da receita", unit: null },
    ],
    note: null,
  },
  {
    id: "m06-inst-03",
    kind: "simulador",
    title: "Simulador · como se forma uma dívida intrassetorial",
    formula: null,
    fields: [
      { id: "i3-i-n", label: "Investimento anual exigido", unit: "índice", kind: "range", defaultValue: 100, min: 20, max: 300, step: 5 },
      { id: "i3-t-n", label: "Tarifa em relação ao custo do serviço", unit: "%", kind: "range", defaultValue: 72, min: 35, max: 130, step: 1 },
      { id: "i3-s-n", label: "Participação da dívida externa", unit: "%", kind: "range", defaultValue: 45, min: 0, max: 90, step: 5 },
      { id: "i3-c-n", label: "Câmbio acima da inflação", unit: "p.p. a.a.", kind: "range", defaultValue: 9, min: 0, max: 30, step: 1 },
      { id: "i3-y-n", label: "Anos de regime", unit: "anos", kind: "range", defaultValue: 8, min: 3, max: 12, step: 1 },
    ],
    outputs: [
      { id: "i3-af", label: "Autofinanciamento", unit: null },
      { id: "i3-df", label: "Dívida financeira", unit: null },
      { id: "i3-di", label: "Dívida intrassetorial", unit: null },
      { id: "i3-rt", label: "Passivo / investimento anual", unit: null },
    ],
    note: null,
  },
  {
    id: "m06-inst-04",
    kind: "simulador",
    title: "Termômetro do racionamento · balanço de energia num período seco",
    formula: null,
    fields: [
      { id: "i4-e-n", label: "Armazenamento inicial", unit: "% do máximo", kind: "range", defaultValue: 32, min: 5, max: 100, step: 1 },
      { id: "i4-a-n", label: "Afluência no período seco", unit: "% da média", kind: "range", defaultValue: 72, min: 30, max: 140, step: 1 },
      { id: "i4-m-n", label: "Margem de capacidade firme não hidráulica", unit: "% da carga", kind: "range", defaultValue: 3, min: 0, max: 30, step: 1 },
      { id: "i4-t-n", label: "Meses até o período úmido", unit: "meses", kind: "range", defaultValue: 7, min: 1, max: 12, step: 1 },
    ],
    outputs: [
      { id: "i4-ct", label: "Corte necessário", unit: null },
      { id: "i4-qm", label: "Queda mensal sem corte", unit: null },
    ],
    note: null,
  },
  {
    id: "m06-inst-05",
    kind: "comparador",
    title: "Comparador · três arquiteturas e onde o risco pousa",
    formula: null,
    fields: [
      { id: "i5-h-n", label: "Horizonte de contratação obrigatória", unit: "anos", kind: "range", defaultValue: 0, min: 0, max: 6, step: 1 },
    ],
    outputs: [
      { id: "i5-rf", label: "Risco de faltar", unit: null },
      { id: "i5-rs", label: "Risco de sobrar", unit: null },
      { id: "i5-rt", label: "Atrito total", unit: null },
    ],
    note: null,
  },
  {
    id: "m06-inst-06",
    kind: "simulador",
    title: "Simulador · o efeito de uma liminar num sistema de rateio",
    formula: null,
    fields: [
      { id: "i6-d-n", label: "Valor a liquidar no ciclo", unit: "R$ mi", kind: "range", defaultValue: 1500, min: 200, max: 6000, step: 50 },
      { id: "i6-p-n", label: "Parcela do devido protegida por liminar", unit: "%", kind: "range", defaultValue: 35, min: 0, max: 80, step: 1 },
      { id: "i6-g-n", label: "Garantias e reservas disponíveis", unit: "% do devido", kind: "range", defaultValue: 8, min: 0, max: 40, step: 1 },
      { id: "i6-n-n", label: "Agentes credores no rateio", unit: "agentes", kind: "range", defaultValue: 120, min: 10, max: 600, step: 5 },
    ],
    outputs: [
      { id: "i6-tx", label: "Taxa de recebimento", unit: null },
      { id: "i6-fa", label: "Falta no ciclo", unit: null },
      { id: "i6-pm", label: "Perda média por credor", unit: null },
      { id: "i6-ac", label: "Retido em 3 ciclos", unit: null },
    ],
    note: null,
  },
  {
    id: "m06-inst-07",
    kind: "simulador",
    title: "Linha da abertura · quando cada consumidor passou a poder escolher",
    formula: null,
    fields: [
      { id: "i7-y-n", label: "Ano", unit: "ano", kind: "range", defaultValue: 2024, min: 1995, max: 2028, step: 1 },
      { id: "i7-k-n", label: "Carga da unidade", unit: "kW", kind: "range", defaultValue: 800, min: 5, max: 5000, step: 5 },
    ],
    outputs: [

    ],
    note: null,
  },
  {
    id: "m06-inst-08",
    kind: "explorador",
    title: "Mapa trauma → cicatriz regulatória",
    formula: null,
    fields: [
      // Rótulos DERIVADOS de MODULO_06_TRAUMA_CICATRIZ, nunca digitados —
      // a extração da Wave 29 gerou o template com campos inexistentes e
      // os 11 labels saíram "undefined · undefined" literais (defeito
      // achado na regressão da Wave 34). O formato período · título é o
      // do chip da fonte: '<span class="y">'+T[i].y+'</span>'+esc(T[i].t).
      {
        id: "i8-sel", label: "Pressão histórica", unit: null, kind: "select", defaultValue: "0",
        options: MODULO_06_TRAUMA_CICATRIZ.map((t, i) => ({
          value: String(i),
          label: `${t.periodo} · ${t.titulo}`,
        })),
      },
    ],
    outputs: [

    ],
    note: null,
  },
];



// ── INST · 01 — Linha do tempo · quatorze marcos (Wave 38) ───
// Vive no § MAP, FORA de qualquer aula. A Wave 29 registrou que ele
// existia na fonte e não entrava; a taxonomia da FOUNDRY Wave 4 o
// listou como "mencionado em comentário, nunca materializado como
// dado". Materializado agora como Instrument de MÓDULO, com destino em
// Recursos do Módulo — mesmo caminho do LAB · 01 do Módulo 01.
//
// Quatorze marcos, cada um com ano, título, corpo e legado. O painel
// da fonte usa textContent, então o conteúdo é texto puro sem HTML.
//
// Gerado do array M do <script>, não transcrito.

export const M06_INST01_MARCOS: {
  ano: string; titulo: string; corpo: string; legado: string;
}[] = [
  {
    ano: "1879–1889", titulo: "A eletricidade chega, e chega local",
    corpo: "Seis lâmpadas de arco na estação da Estrada de Ferro D. Pedro II, no Rio, em 1879. Em 1883, o primeiro serviço público de iluminação em Campos e a aplicação hidrelétrica à mineração em Diamantina. Em 1889, Marmelos Zero, em Juiz de Fora. Instalações pontuais, cada uma amarrada a um serviço urbano ou a uma atividade produtiva específica — nenhuma delas parte de um sistema.",
    legado: "A eletrificação brasileira nasceu privada e municipal. Toda vez que alguém disser que o setor \"começou estatal\", este é o marco que desmonta a frase.",
  },
  {
    ano: "1899–1930", titulo: "O capital externo assume a escala",
    corpo: "A São Paulo Tramway, Light and Power organiza-se em 1899 e a congênere do Rio em 1904, com capital canadense e domicílio em Toronto, sob a holding Brazilian Traction. A partir dos anos 1920, a Amforp compra concessionárias do interior. Por volta de 1930, as duas dominam o suprimento das grandes cidades — trazendo capital, engenharia e velocidade, e criando uma assimetria de poder que nenhuma prefeitura conseguia arbitrar.",
    legado: "A distribuidora do Rio de hoje descende diretamente dessa empresa, e a assimetria de informação entre regulador e regulado que o Módulo 05 descreve como conceito aparece aqui na sua primeira forma brasileira.",
  },
  {
    ano: "1934", titulo: "Código de Águas: a União toma o rio",
    corpo: "Decreto nº 24.643, de 10 de julho de 1934. Separa o potencial hidráulico da propriedade do solo, concentra na União o poder de conceder e fiscalizar, e substitui a proteção cambial das concessionárias — a cláusula-ouro, proibida em 1933 — por remuneração sobre o custo histórico do investimento.",
    legado: "Rio, rede e segurança de suprimento são assunto federal. É a continuidade mais profunda de todo o bloco: atravessou estatização, privatização e reabertura sem jamais ser revertida.",
  },
  {
    ano: "1939–1957", titulo: "Regular não é construir",
    corpo: "CNAEE em 1939. A guerra fecha o acesso a equipamento importado enquanto a demanda urbana acelera, e o resultado são racionamentos nos anos 1940 e início dos 1950. A resposta é o Estado assumir a construção: Chesf em 1945, BNDE e Cemig em 1952, Furnas em 1957.",
    legado: "A primeira demonstração brasileira de que sistema elétrico não responde a decreto, responde a obra concluída. A mesma lição volta em 2001.",
  },
  {
    ano: "1961–1962", titulo: "Eletrobras",
    corpo: "Proposta enviada por Vargas em 1954, sete anos de disputa no Congresso, Lei nº 3.890-A em abril de 1961 autorizando a criação, e instalação efetiva em junho de 1962. No ano seguinte, o Imposto Único sobre Energia Elétrica e o empréstimo compulsório dão à holding a base financeira que faltava.",
    legado: "É aqui que a conta de luz brasileira passa a carregar política pública embutida — e nunca mais deixou de carregar. Toda discussão atual sobre encargos tem origem neste desenho.",
  },
  {
    ano: "1964–1979", titulo: "A nacionalização se completa",
    corpo: "Os ativos da Amforp são adquiridos pelo Estado brasileiro em 1964; os da Light, em 1979. A empresa que trouxe o capital canadense para o Rio em 1904 passa ao controle estatal setenta e cinco anos depois.",
    legado: "Primeira virada completa de regime de propriedade numa mesma empresa. Ela ainda daria mais duas voltas — privatização em 1996 e recuperação judicial em 2023.",
  },
  {
    ano: "1973–1984", titulo: "O esqueleto físico e a coordenação central",
    corpo: "Em 1973 nascem o GCOI, para coordenar a operação interligada, e a Eletronorte, e é assinado o Tratado de Itaipu, que cria uma entidade binacional. As obras de Itaipu começam em 1975 e as de Tucuruí em 1976; as primeiras unidades de ambas entram em operação em 1984.",
    legado: "O despacho centralizado brasileiro nasce aqui, não em 2001 — porque hidrelétrica em cascata exige coordenação intertemporal. Confundir as duas datas é erro de trinta anos.",
  },
  {
    ano: "Anos 1980", titulo: "A quebra financeira do modelo estatal",
    corpo: "Quatro vetores simultâneos: tarifa administrada usada como âncora anti-inflacionária, dívida externa impagável após o choque de juros, remuneração garantida que elimina o incentivo a controlar custo, e equalização tarifária que elimina a comparação entre empresas. Como todas pertenciam ao mesmo dono, deixar de pagar umas às outras virou saldo contábil: a dívida intrassetorial.",
    legado: "É a razão pela qual a reforma dos anos 1990 começou por um encontro de contas, e não por uma venda. Empresa cujo fluxo financeiro ninguém consegue ler não pode ser avaliada nem recapitalizada.",
  },
  {
    ano: "1993–1998", titulo: "A arquitetura da reforma",
    corpo: "Lei nº 8.631/1993 extingue remuneração garantida e equalização e faz o encontro de contas. Leis de concessão e de outorga em 1995 criam produtor independente e consumidor livre. A ANEEL é instituída em 1996 e opera a partir de 1997. A lei de 1998 cria o ONS, sucedendo o GCOI, e o MAE.",
    legado: "A separação entre regulação, operação e comércio que estrutura o setor até hoje. O ONS não privatizou o despacho: sucedeu um comitê numa função que já era centralizada.",
  },
  {
    ano: "1996–2000", titulo: "As privatizações, e a assimetria que elas deixaram",
    corpo: "A Light é leiloada em 21 de maio de 1996, no preço mínimo, para um consórcio com EDF, AES, Houston Industries e CSN. A Eletropaulo Metropolitana em 15 de abril de 1998, com a mesma constelação de nomes; a AES consolida o controle em 2001. Dezenas de distribuidoras estaduais seguem entre 1997 e 2000 — mas a geração permanece majoritariamente estatal.",
    legado: "A assimetria distribuição privada / geração estatal deixou a pergunta \"quem garante a expansão\" sem dono. É o buraco por onde 2001 entrou.",
  },
  {
    ano: "2001", titulo: "O racionamento",
    corpo: "Câmara de Gestão da Crise criada em maio de 2001 sob a Casa Civil; programa compulsório de redução de consumo de junho de 2001 a fevereiro de 2002, meta média em torno de vinte por cento, com bônus e sobretarifa. A comissão de análise presidida por Jérson Kelman concluiu que ministério, agência, operador e Eletrobras conheciam o risco elevado de déficit desde meados de 1999, e que houve orientação para não divulgar as avaliações.",
    legado: "Segurança de suprimento vira objetivo explícito do setor. E a lição institucional não foi \"planejar melhor\" — foi tirar a segurança de suprimento da dependência de uma decisão discricionária.",
  },
  {
    ano: "2004", titulo: "O Novo Modelo",
    corpo: "Leis nº 10.847 e nº 10.848, ambas de março de 2004. Criam a EPE, que devolve o planejamento a uma instituição dedicada; a CCEE, que substitui o MAE; o CMSE, que monitora continuamente a segurança de suprimento; formalizam ACR e ACL; e — a peça decisiva — obrigam a distribuidora a estar contratada para a totalidade da carga, com antecedência e lastro.",
    legado: "É o marco que ainda rege o setor. Não foi reestatização: manteve propriedade privada, competição em geração e mercado livre, e recolocou um dono na pergunta que tinha ficado órfã em 1998.",
  },
  {
    ano: "2012–2021", titulo: "A década do teste",
    corpo: "MP 579 em 2012 tenta reduzir tarifa antecipando renovação de concessões. Vem a crise hídrica de 2013 a 2015, com Conta-ACR e bandeiras tarifárias. O GSF gera liminares a partir de 2015 e uma década de judicialização resolvida em três camadas legislativas. A abertura do mercado desce em degraus por portaria, de 2.500 kW em 2019 a 500 kW em 2023. Em 2021, hidrologia severa — e nenhum racionamento.",
    legado: "Risco mal alocado não desaparece: vira dívida, encargo, bandeira ou processo. E a ausência de racionamento em 2021 é a melhor medida disponível do que foi aprendido desde 2001.",
  },
  {
    ano: "2022–2028", titulo: "Onde a história pousa — e para onde aponta",
    corpo: "Capitalização da Eletrobras em junho de 2022, com a União diluída de cerca de 72% para cerca de 40% do capital votante e limite legal de dez por cento de voto por acionista. Marca AXIA Energia adotada em outubro de 2025. Abertura de todo o Grupo A em 1º de janeiro de 2024, sem exigência de carga mínima. E a Lei nº 15.269/2025 dá cronograma legal à baixa tensão: até novembro de 2027 para indústria e comércio, até novembro de 2028 para todos.",
    legado: "O mercado endereçável de qualquer produto independente de inteligência energética no Brasil nasce em 2024 e multiplica em 2027 e 2028 — condicionado a regulamentação. É este o ponto do ciclo em que a GridAlpha entra.",
  },
];

/** Instrumento de MÓDULO: o Inst · 01 do § MAP. Não entra em
 *   de nenhuma aula. */
export const MODULO_06_INSTRUMENTOS: Instrument[] = [
  {
    id: 'm06-inst-01',
    kind: 'explorador',
    title: 'Linha do tempo · quatorze marcos',
    formula: null,
    fields: [
      {
        id: 'm06-i1-sel',
        label: 'Marco',
        unit: null,
        kind: 'select',
        defaultValue: '0',
        options: M06_INST01_MARCOS.map((m, k) => ({
          value: String(k),
          label: `${m.ano} · ${m.titulo}`,
        })),
      },
    ],
    outputs: [],
    note: 'Os quatorze marcos que organizam o bloco, do primeiro serviço elétrico de 1879 ao ciclo que se fecha em 2028. Escolha um marco para ler o que aconteceu e o que dele ficou.',
  },
];

export const MODULO_06_LEAD: Record<string, string> = {
  'aula-06-01': "O setor elétrico brasileiro nasceu privado, urbano, estrangeiro e fragmentado. Quem começa a estudar o setor pelo desenho atual tem a intuição invertida: acha que o Estado sempre esteve lá e que a abertura é a novidade. É o contrário. A presença do Estado é que é a novidade — ela começa em 1934, mais de meio século depois da primeira lâmpada.",
  'aula-06-02': "Meio século em que o Brasil construiu o esqueleto físico que ainda usa. Nenhuma das grandes hidrelétricas do país, nenhuma das grandes linhas de transmissão, nenhum dos centros de operação regional é obra do mercado — todos são obra de empresa estatal financiada por imposto, empréstimo compulsório e dívida externa. Entender esse período é entender por que o setor tem a musculatura que tem, e por que ele saiu dos anos 1980 falido.",
  'aula-06-03': "Esta é a aula central do bloco. Tudo que veio antes explica como o Brasil chegou aqui; tudo que veio depois é resposta ao que aconteceu aqui. E o resumo que circula — \"privatizaram e faltou luz\" — é curto demais para ser útil e errado o bastante para custar credibilidade em qualquer conversa técnica. A história real é mais interessante e muito mais instrutiva.",
  'aula-06-04': "O Novo Modelo de 2004 é o marco que ainda rege o setor, e é sistematicamente mal contado. Não foi reestatização, não foi fechamento do mercado livre e não foi ruptura com a reforma dos anos 1990. Foi uma reforma da reforma : manteve tudo que a década anterior tinha criado de competitivo e recolocou no lugar exatamente aquilo cuja ausência tinha custado o racionamento — um dono para a pergunta \"quem garante que a expansão aconteça\".",
  'aula-06-05': "Uma década que o setor levou para aprender uma frase: risco mal alocado não desaparece — ele muda de forma . Vira dívida, vira encargo, vira bandeira na conta, vira liminar. A década de 2010 é o laboratório dessa lei, e é também onde nasce quase toda a agenda regulatória que ainda está aberta hoje.",
  'aula-06-06': "Esta aula fecha o arco e faz a única coisa que o resto do bloco não podia fazer: colocar a GridAlpha dentro da história. O que a sequência de cento e cinquenta anos mostra não é que o setor esteja indo para algum lugar definitivo — é que ele nunca foi. E é exatamente daí que sai o argumento de independência, que é histórico antes de ser comercial.",
};


/** 142 blocos nas seis aulas, na ordem do documento. O explicador em
 *  três níveis (`div.lv`) vira UMA nota com os três rotulados dentro,
 *  como nos Módulos 04-05. */
export const MODULO_06_CORPO: Record<string, AulaBloco[]> = {
  'aula-06-01': [
    { kind: 'titulo', numero: "1.1", texto: "Uma tecnologia urbana, não um sistema" },
    { kind: 'paragrafo', html: "A primeira instalação permanente de iluminação elétrica no Brasil é de 1879: seis lâmpadas de arco na estação central da Estrada de Ferro D. Pedro II, no Rio de Janeiro. Em 1883, Campos dos Goytacazes inaugurou o primeiro serviço público de iluminação elétrica do país, por geração térmica, e Diamantina recebeu uma das primeiras aplicações hidrelétricas, destinada a mineração. Em 1889, a usina Marmelos Zero, em Juiz de Fora, tornou-se o marco da hidreletricidade voltada a iluminação pública e particular." },
    { kind: 'paragrafo', html: "O padrão dessas quatro datas é mais importante que as datas em si. Nenhuma delas é a inauguração de um sistema elétrico. São instalações pontuais, cada uma amarrada a um serviço urbano específico ou a uma atividade produtiva específica, financiadas por quem tinha aquele problema para resolver. Não havia rede entre cidades, não havia padrão de frequência, não havia padrão de tensão, e não havia qualquer razão econômica para que houvesse: cada usina servia ao seu bolsão de demanda e não tinha nada a ganhar em se conectar ao vizinho." },
    { kind: 'paragrafo', html: "A regulação correspondente era municipal, e correspondia bem ao problema. A prefeitura concedia o direito de iluminar ruas, operar bondes e vender força motriz, negociava o preço em contrato e fiscalizava o que conseguia fiscalizar. Enquanto a escala foi essa, o arranjo funcionava. O que quebra o arranjo não é ideologia — é escala." },
    { kind: 'titulo', numero: "1.2", texto: "Quando o capital externo assume a escala" },
    { kind: 'paragrafo', html: "A partir da virada do século, grupos estrangeiros consolidam o que estava disperso. A <strong>São Paulo Tramway, Light and Power Company</strong> foi organizada em 1899 e a <strong>Rio de Janeiro Tramway, Light and Power Company</strong> em 1904, ambas com capital canadense e domicílio legal em Toronto — o conjunto viria a ser reunido sob a holding <em>Brazilian Traction, Light and Power Company</em>, mais tarde sucedida pela Brascan. Em 1905, no Rio, a Light iniciou a construção da usina de Fontes, então a maior do país. É essa empresa, e não uma abstração, que estabelece o modelo de negócio elétrico brasileiro: verticalizado do gerador ao poste, e integrado com o transporte urbano, porque bonde e iluminação compartilham a mesma infraestrutura e a mesma curva de carga." },
    { kind: 'paragrafo', html: "A partir da década de 1920 entra o segundo grupo: a <strong>American &amp; Foreign Power Company</strong>, a Amforp, ligada ao grupo Electric Bond and Share, que comprou empresas do interior paulista, de Minas, do Nordeste e do Sul. Por volta de 1930, Light e Amforp respondiam pela parcela dominante do suprimento das principais cidades brasileiras." },
    { kind: 'paragrafo', html: "Vale registrar o que isso trouxe, porque a leitura política costuma comer o fato. Trouxe capital numa economia sem mercado de capitais doméstico capaz de financiar infraestrutura, trouxe engenharia, trouxe equipamento importado e trouxe capacidade gerencial. A eletrificação urbana brasileira foi rápida para os padrões da época, e foi rápida por causa desse capital. O problema não estava na origem do dinheiro. Estava na assimetria de poder que a escala produziu." },
    { kind: 'titulo', numero: "1.3", texto: "Três tensões que o arranjo municipal não conseguia resolver" },
    { kind: 'paragrafo', html: "A primeira tensão é <strong>informacional</strong>, e é literalmente o problema que o Módulo 05 descreveu como assimetria de informação, aparecendo aqui na sua primeira encarnação brasileira. A prefeitura precisava avaliar se a tarifa cobrada era compatível com o custo do serviço, e a única fonte de dado sobre esse custo era a própria concessionária. Um município não tinha corpo técnico, contabilidade regulatória nem poder de auditoria para enfrentar uma companhia que operava em vários países." },
    { kind: 'paragrafo', html: "A segunda é <strong>monetária</strong>. Boa parte do investimento era feita em moeda estrangeira, e os contratos de concessão da época carregavam a chamada <em>cláusula-ouro</em>: um mecanismo que vinculava parte da tarifa ao ouro ou a moeda estrangeira, protegendo a concessionária contra desvalorização. Do ponto de vista do investidor, era proteção legítima de um capital afundado por décadas. Do ponto de vista do consumidor e do prefeito, era uma tarifa que subia sozinha sempre que a moeda brasileira caía — o que, nos anos 1920 e 1930, era o tempo todo. A cláusula-ouro foi proibida por decreto em 1933, no início do ciclo Vargas, e essa proibição é a peça que faltava para entender o Código de Águas do ano seguinte." },
    { kind: 'paragrafo', html: "A terceira é <strong>territorial</strong>, e é a que decide tudo. Um rio não respeita divisa de município. Aproveitar uma cascata inteira exige decidir, para o rio todo, quem constrói o quê e em que ordem — e nenhuma prefeitura tem competência jurídica sobre o trecho do vizinho. Enquanto a eletricidade era iluminação, isso não importava. Quando ela vira insumo de industrialização, a decisão sobre o rio passa a ser decisão sobre o desenvolvimento de uma região inteira, e um contrato municipal não tem como carregá-la." },
    { kind: 'titulo', numero: "1.4", texto: "1934: a União toma o rio" },
    { kind: 'paragrafo', html: "O <strong>Código de Águas</strong> — Decreto nº 24.643, de 10 de julho de 1934 — é o primeiro marco federal do setor elétrico brasileiro e faz três coisas que ainda estão em vigor, em espírito e em boa parte na letra." },
    { kind: 'paragrafo', html: "Primeiro, <strong>separa o potencial hidráulico da propriedade do solo</strong>. Ter a fazenda onde está a queda d'água deixa de dar direito a explorá-la; o aproveitamento passa a depender de outorga federal. Segundo, <strong>concentra na União o poder concedente</strong> sobre esses aproveitamentos e a competência de fiscalizar técnica, financeira e contabilmente as concessionárias. Terceiro, <strong>fixa a remuneração pelo custo histórico do investimento</strong>, encerrando o regime em que a tarifa acompanhava moeda estrangeira." },
    { kind: 'paragrafo', html: "As duas primeiras decisões foram acertadas e permanecem. É delas que descende, em linha direta, a ideia de que rio, rede e segurança de suprimento são assunto federal — a continuidade mais profunda de todo este bloco, atravessando estatização, privatização e reabertura sem nunca ser revertida. A terceira é onde nasce a primeira cicatriz do setor, e é onde a história fica interessante." },
    { kind: 'paragrafo', html: "Remunerar pelo custo histórico é impecável em moeda estável. Em ambiente de inflação alta e desvalorização cambial, com equipamento importado, produz um resultado previsível: a receita reconhecida continua nominalmente ancorada num investimento feito anos atrás, enquanto o custo de repor aquele mesmo ativo sobe com a inflação e, na parcela importada, sobe mais que a inflação. Chega um ponto em que expandir deixa de fazer sentido econômico para quem já está lá. A regra conteve a tarifa — que era o objetivo declarado — e, junto com a incerteza política e a guerra que veio em seguida, secou o apetite de capital privado para expansão acelerada. O instrumento abaixo mostra a mecânica dessa erosão." },
    { kind: 'nota', tom: "neutro", label: "Código de Águas de 1934 · três níveis", html: "<b>Criança de 12 anos.</b> Antes de 1934, quem tivesse a terra com a cachoeira podia usar a cachoeira para fazer energia, e era a prefeitura que decidia quanto a empresa podia cobrar. Aí o governo federal disse duas coisas: a água é do país inteiro, não de quem tem a fazenda; e quem decide o preço agora sou eu. Isso ajudou a organizar os rios grandes — e atrapalhou o dinheiro de continuar chegando, porque o preço parou de acompanhar a alta dos custos.<br/><b>Executivo.</b> O Código de Águas transferiu para a União a competência de outorgar e fiscalizar aproveitamentos hidrelétricos e desvinculou o potencial hidráulico da propriedade do solo, tornando possível planejar bacias inteiras em vez de trechos municipais. Ao mesmo tempo, substituiu a proteção cambial das concessionárias por remuneração sobre o custo histórico do investimento. O primeiro efeito foi estrutural e permanente; o segundo, combinado com inflação, guerra e incerteza política, reduziu a disposição do capital privado a financiar a expansão — e abriu o espaço que o Estado ocuparia nas duas décadas seguintes.<br/><b>Especialista.</b> O Decreto nº 24.643/1934 constitui o marco de federalização do poder concedente sobre aproveitamentos hidráulicos, com dominialidade pública das águas, desvinculação do potencial em relação ao solo e instituição de controle técnico, contábil e financeiro das concessionárias. No plano tarifário, consolida o princípio de serviço pelo custo com base em custo histórico do investimento reconhecido, em sequência à vedação da cláusula-ouro editada em 1933. A tensão resultante é clássica em regulação de infraestrutura: um regime de remuneração ancorado em valor nominal histórico, sob inflação e sob exposição cambial na cesta de bens de capital, deprime o valor presente do fluxo reconhecido abaixo do custo de reposição e desestimula investimento incremental — de modo que o controle de renda monopolista de curto prazo é obtido às custas da adequação de capacidade de médio prazo." },
    { kind: 'nota', tom: "neutro", label: "Onde isso entra no produto", html: "É o caso fundador do padrão que a régua dos seis existe para detectar: uma regra que resolve com precisão o problema declarado e transfere o custo para uma dimensão que ninguém estava medindo. Toda análise de mudança regulatória no <strong>Regulatory Radar</strong> tem que fazer essa pergunta explicitamente — não \"a regra atinge o objetivo?\", mas \"qual variável ela deixa de proteger para atingir o objetivo?\". Em 1934 a variável desprotegida foi a capacidade de investimento, e a conta chegou nos racionamentos da década seguinte." },
  ],
  'aula-06-02': [
    { kind: 'titulo', numero: "2.1", texto: "Regular não é o mesmo que construir" },
    { kind: 'paragrafo', html: "Entre 1934 e 1945, o Brasil descobre da forma mais direta possível a diferença entre ter competência jurídica sobre um recurso e ter capacidade de mobilizar capital para explorá-lo. Em 1939 é criado o <strong>Conselho Nacional de Águas e Energia Elétrica</strong>, o CNAEE, órgão federal de consulta, orientação e controle. A moldura institucional existe. O que não existe é usina nova em ritmo compatível com a demanda." },
    { kind: 'paragrafo', html: "A Segunda Guerra fecha o acesso a equipamento importado exatamente quando urbanização e industrialização aceleram o consumo. O resultado aparece nos anos 1940 e no início dos 1950 na forma de <strong>racionamentos e insuficiência crônica de oferta</strong> nas principais capitais. É a primeira vez que o país descobre uma lição que vai reaprender em 2001 e ameaçar reaprender em 2021: sistema elétrico não responde a decreto, responde a obra concluída, e obra tem prazo de maturação que ignora o calendário político." },
    { kind: 'paragrafo', html: "Aplique a régua dos seis a esse momento e o diagnóstico sai sozinho. Dono: privado, concentrado, estrangeiro. Financiador: o mesmo, agora sem incentivo. Planejador: ninguém, em escala de bacia. Operador: cada empresa, isoladamente. Preço: custo histórico federal, insuficiente para atrair capital novo. E a crise que encerra o modelo é justamente a escassez que essa combinação produz." },
    { kind: 'titulo', numero: "2.2", texto: "O Estado vira empreendedor" },
    { kind: 'paragrafo', html: "A resposta não foi mudar a regra de preço. Foi trocar de dono. Se o capital privado não financiava projeto de escala regional nas condições existentes, o Estado financiaria — e, para financiar, precisaria construir." },
    { kind: 'paragrafo', html: "A sequência é rápida e vale decorar por arco, não por data isolada. Em <strong>1945</strong> é autorizada a Companhia Hidro Elétrica do São Francisco, a <strong>Chesf</strong>, e Paulo Afonso vira o símbolo de eletrificação como política de desenvolvimento regional. Em <strong>1952</strong> nascem duas peças que se completam: o <strong>Banco Nacional de Desenvolvimento Econômico</strong>, o BNDE, que se torna a fonte central de financiamento de longo prazo, e a <strong>Cemig</strong>, que mostra que estado da federação também pode ser empreendedor elétrico. Em <strong>1957</strong>, diante do risco de déficit no Centro-Sul, é criada <strong>Furnas</strong>. A eletricidade entra no plano de metas de Juscelino Kubitschek como infraestrutura de industrialização, não como serviço urbano." },
    { kind: 'paragrafo', html: "Falta a peça de cúpula. Getúlio Vargas envia ao Congresso, em <strong>1954</strong>, a proposta de uma <em>holding</em> federal de energia elétrica. A proposta enfrenta sete anos de disputa política e só é aprovada pela <strong>Lei nº 3.890-A, de 25 de abril de 1961</strong>, que autoriza a União a constituir as Centrais Elétricas Brasileiras. A empresa é efetivamente instalada em <strong>11 de junho de 1962</strong> — e essa distância de um ano entre a lei e a instalação é a razão de você encontrar tanto 1961 quanto 1962 citados como ano de criação da <strong>Eletrobras</strong>. As duas datas estão certas; elas medem coisas diferentes." },
    { kind: 'paragrafo', html: "No ano seguinte, a Lei nº 4.156/1962 dá à nova <em>holding</em> a base financeira que faltava, ancorada no Imposto Único sobre Energia Elétrica e no empréstimo compulsório sobre o consumo. Repare no desenho: o consumidor de energia passa a financiar diretamente a expansão do sistema que o atende, por instrumento fiscal e por empréstimo forçado, não por tarifa negociada. Essa é uma resposta à pergunta dois da régua que nenhum arranjo anterior tinha dado — e a primeira vez em que a conta de luz brasileira carrega, embutida, uma política pública. Ela nunca mais deixou de carregar." },
    { kind: 'titulo', numero: "2.3", texto: "O esqueleto físico" },
    { kind: 'paragrafo', html: "Com dono, financiador e planejador definidos, a construção acelera. Os estudos <strong>Canambra</strong>, iniciados em 1963, mapeiam sistematicamente os recursos e as necessidades do Centro-Sul, e mudam a natureza do planejamento: usinas e linhas passam a ser tratadas como um sistema único, com reservas compartilhadas e cascatas operadas de forma coordenada, em vez de projetos isolados." },
    { kind: 'paragrafo', html: "A nacionalização se completa em duas etapas: os ativos da <strong>Amforp</strong> são adquiridos em <strong>1964</strong> e os da <strong>Light</strong> em <strong>1979</strong>. Repare no arco: a empresa que trouxe o capital canadense para o Rio em 1904 passa ao controle estatal brasileiro em 1979, será privatizada em 1996 e entrará em recuperação judicial em 2023. Guarde essa trajetória — ela volta na Aula 06 como o argumento mais concreto deste bloco inteiro." },
    { kind: 'paragrafo', html: "Em <strong>1973</strong> acontecem três coisas que ainda estruturam o setor. É criado o <strong>Grupo Coordenador para a Operação Interligada</strong>, o GCOI, para coordenar a operação das empresas do sistema interligado — o antecessor institucional direto do operador nacional de hoje. É criada a <strong>Eletronorte</strong>, para levar a mesma lógica à Amazônia. E é assinado, entre Brasil e Paraguai, o <strong>Tratado de Itaipu</strong>, que dá origem à <strong>Itaipu Binacional</strong>: não uma usina brasileira, mas uma entidade criada por tratado internacional, com regime jurídico próprio — distinção que derruba muita gente em conversa técnica." },
    { kind: 'paragrafo', html: "As obras de Itaipu começam em 1975 e as de <strong>Tucuruí</strong> em 1976; as primeiras unidades de ambas entram em operação em <strong>1984</strong>. É o pico do modelo: escala continental, engenharia de ponta, financiamento externo abundante e decisão centralizada. E é também onde os custos do modelo ficam visíveis — endividamento em moeda estrangeira, deslocamento de populações, impacto ambiental e licenciamento incipiente, num período em que a prioridade declarada era crescimento e segurança nacional." },
    { kind: 'nota', tom: "gold", label: "Ponto que quase todo mundo erra", html: "A centralização operacional brasileira <strong>não nasceu em 2001</strong>. Ela foi construída ao longo dos anos 1960 e 1970, porque hidreletricidade em cascata exige coordenação intertemporal e geográfica — usar a água hoje muda o que o sistema inteiro pode fazer amanhã. O trauma de 2001 reforçou essa cultura e lhe deu justificativa política renovada; não a inventou. Atribuir o despacho centralizado exclusivamente a 2001 é um erro de trinta anos e sinaliza, para quem conhece o setor, que a pessoa aprendeu a história pela metade." },
    { kind: 'titulo', numero: "2.4", texto: "A crise que encerra o ciclo" },
    { kind: 'paragrafo', html: "O modelo estatal não quebra por incompetência de engenharia — a infraestrutura continuou crescendo até o fim. Ele quebra pela combinação de quatro coisas, e é essa combinação que precisa estar na ponta da língua." },
    { kind: 'paragrafo', html: "Primeira: <strong>tarifa como instrumento de política macroeconômica</strong>. Com inflação alta, o preço da energia — administrado, visível e presente em todos os índices — vira âncora anti-inflacionária. Contê-lo é politicamente irresistível e tecnicamente desastroso: a empresa continua com a obrigação legal de expandir e sem a receita para tanto." },
    { kind: 'paragrafo', html: "Segunda: <strong>choque de juros e dívida externa</strong>. Boa parte do financiamento das grandes obras estava em moeda estrangeira. A virada dos juros internacionais no fim dos anos 1970 e a desvalorização subsequente transformam um serviço de dívida administrável num serviço impagável, em cima de receita comprimida." },
    { kind: 'paragrafo', html: "Terceira: <strong>remuneração garantida e equalização tarifária</strong>. O regime assegurava ao investimento reconhecido uma faixa de remuneração legal — a ordem de grandeza usualmente citada é de dez a doze por cento ao ano — e, a partir de meados dos anos 1970, uniformizava tarifas entre concessionárias e regiões, compensando as diferenças por mecanismos de transferência. O objetivo era isonomia territorial e ele foi parcialmente atingido. O efeito colateral foi apagar completamente o sinal de eficiência: uma empresa cara e uma empresa eficiente chegavam ao mesmo resultado reconhecido, e a diferença virava crédito ou débito contra o sistema." },
    { kind: 'paragrafo', html: "Quarta, e a mais reveladora: <strong>a dívida intrassetorial</strong>. Como todas as empresas eram, em última instância, do mesmo dono, deixar de pagar umas às outras não produzia falência — produzia um saldo contábil. Distribuidora estadual não paga a geradora federal, que não paga o serviço da própria dívida, que é rolada. O fluxo financeiro do setor foi ficando opaco a ponto de ninguém conseguir dizer, com precisão, quem devia quanto a quem. Essa é a herança que a década de 1990 recebeu, e é o motivo pelo qual a primeira medida da reforma não foi privatizar nada: foi fazer um encontro de contas." },
    { kind: 'paragrafo', html: "A Constituição de 1988 reforça competências públicas, proteção ambiental e direitos sociais, e o país entra nos anos 1990 com um sistema físico impressionante operado por empresas descapitalizadas, com necessidade de investimento e sem fonte para financiá-lo. A pergunta seis da régua estava respondida. Faltava escolher o modelo seguinte." },
    { kind: 'nota', tom: "neutro", label: "Por que o modelo estatal quebrou · três níveis", html: "<b>Criança de 12 anos.</b> O governo mandava as empresas de energia construírem usinas novas e, ao mesmo tempo, proibia elas de cobrarem o preço que precisavam para pagar as obras — porque a conta de luz subindo deixava todo mundo bravo. Aí as empresas foram pegando dinheiro emprestado, muito dele lá fora. Quando o dólar subiu, a dívida virou uma bola de neve, e elas começaram a deixar de pagar umas às outras. Quem faz isso por muitos anos acaba quebrado, mesmo tendo construído coisas enormes.<br/><b>Executivo.</b> O modelo combinava obrigação de expandir com preço definido por conveniência macroeconômica. Isso é insustentável em qualquer setor de capital intensivo. Some a isso remuneração garantida — que remove o incentivo a controlar custo — e equalização tarifária — que remove a comparação entre empresas —, e você perde as duas fontes de disciplina econômica ao mesmo tempo. O ajuste veio por endividamento externo até o choque de juros, e depois por inadimplência dentro do próprio setor. Em 1993, antes de qualquer privatização, foi preciso extinguir a remuneração garantida e fazer um encontro de contas só para tornar as empresas financeiramente legíveis.<br/><b>Especialista.</b> A deterioração resulta da sobreposição de quatro vetores: uso da tarifa administrada como âncora nominal em regime de inflação alta, comprimindo a receita real; exposição cambial descoberta no passivo, ampliada pelo choque de juros do fim dos anos 1970; regime de remuneração garantida sobre investimento reconhecido, que anula o incentivo à eficiência produtiva; e equalização tarifária nacional com contas de compensação, que suprime o benchmarking implícito entre concessionárias. O resultado é acumulação de passivo em duas camadas — dívida financeira externa e interna, e obrigações intrassetoriais não honradas —, com opacidade de fluxo suficiente para inviabilizar avaliação patrimonial das empresas. A Lei nº 8.631/1993, ao extinguir remuneração garantida e equalização e promover encontro de contas, é pré-condição técnica de qualquer alienação subsequente." },
    { kind: 'nota', tom: "neutro", label: "Onde isso entra no produto", html: "Aqui está a resposta histórica para a pergunta cética mais comum sobre a GridAlpha: por que uma camada analítica externa vale alguma coisa se as instituições do setor já publicam dado. Porque durante quase três décadas o dono do ativo, o financiador, o planejador e o regulador foram a mesma parte — e o resultado foi um sistema cujo próprio fluxo financeiro deixou de ser legível para quem estava dentro dele. Independência analítica não é desconfiança de instituição; é a função que ninguém consegue exercer sobre si mesmo. É esse o argumento a levar para a mesa, e ele é histórico, não retórico." },
  ],
  'aula-06-03': [
    { kind: 'titulo', numero: "3.1", texto: "Antes de vender, tornar legível" },
    { kind: 'paragrafo', html: "A reforma começa três anos antes da primeira privatização, e começa pelo problema que a Aula 02 deixou em aberto: ninguém sabia quanto cada empresa realmente valia, porque o fluxo financeiro do setor era um emaranhado de obrigações não honradas entre empresas do mesmo dono." },
    { kind: 'paragrafo', html: "A <strong>Lei nº 8.631, de 1993</strong>, resolve isso de forma cirúrgica. Extingue a <strong>remuneração garantida</strong>, extingue a <strong>equalização tarifária</strong> nacional e promove um <strong>encontro de contas</strong> que liquida os saldos acumulados. A partir dali, cada concessão tem tarifa própria refletindo os próprios custos, e cada empresa tem balanço que significa alguma coisa. É uma medida técnica sem qualquer glamour político, e é a pré-condição de tudo que vem depois — inclusive de qualquer alternativa à privatização, porque também é impossível recapitalizar com dinheiro público uma empresa cujos números ninguém consegue ler." },
    { kind: 'paragrafo', html: "O efeito colateral é imediato e revelador: ao acabar a equalização, as diferenças regionais de custo, que estavam ocultas há duas décadas, aparecem na conta de luz. Nada tinha piorado. Só ficou visível." },
    { kind: 'titulo', numero: "3.2", texto: "A arquitetura desenhada" },
    { kind: 'paragrafo', html: "O desenho da reforma segue a lógica que o Módulo 05 já ensinou como conceito: separar o que pode competir do que não pode, criar regulador especializado, criar operador neutro e criar um lugar onde as transações de curto prazo sejam contabilizadas. As normas saem em sequência rápida." },
    { kind: 'tabela', linhas: [["Norma","O que instituiu","Pergunta da régua que ela responde"],["Lei nº 8.987/1995","Regime geral de concessão e permissão de serviço público: serviço adequado, política tarifária, equilíbrio econômico-financeiro","Como o preço é definido"],["Lei nº 9.074/1995","Outorgas, figura do produtor independente e do consumidor livre acima de limites de carga e tensão","Quem é dono e quem pode comprar de quem"],["Lei nº 9.427/1996","Criação da ANEEL , que entra em operação em dezembro de 1997","Quem arbitra o preço e fiscaliza"],["Projeto RE-SEB, a partir de 1996","Desenho da desverticalização em geração, transmissão, distribuição e comercialização","Quem faz o quê"],["Lei nº 9.648/1998","Criação do ONS , sucedendo o GCOI, e do MAE — Mercado Atacadista de Energia","Quem opera e onde o curto prazo é contabilizado"],["Decreto nº 2.655/1998","Caráter competitivo de geração e comercialização e livre acesso às redes","Quem pode usar a rede de quem"]] },
    { kind: 'paragrafo', html: "Duas observações que separam quem estudou de quem leu manchete. A primeira: <strong>o ONS não privatizou o despacho</strong>. Ele sucedeu o GCOI numa função que já era centralizada desde os anos 1970; o que mudou foi a natureza jurídica do coordenador — de comitê entre empresas do mesmo dono para entidade de direito privado sem fins lucrativos, autorizada e regulada, com agentes de propriedade diversa. A segunda: a operação continuou centralizada exatamente enquanto contratos e propriedade se descentralizavam. Essa combinação não é contradição; é a única configuração fisicamente possível num sistema hidrotérmico interligado, como o Módulo 05 já demonstrou." },
    { kind: 'titulo', numero: "3.3", texto: "A arquitetura entregue" },
    { kind: 'paragrafo', html: "A privatização concentrou-se em <strong>distribuição</strong>. É esse fato, e não uma preferência ideológica, que explica quase todo o resto da década." },
    { kind: 'paragrafo', html: "A <strong>Light</strong> foi leiloada na Bolsa de Valores do Rio de Janeiro em <strong>21 de maio de 1996</strong>, arrematada pelo preço mínimo, sem ágio. O comprador foi um consórcio internacional que reunia a <strong>EDF</strong> — a elétrica estatal francesa —, a <strong>AES Corporation</strong>, a <strong>Houston Industries Energy</strong>, depois renomeada Reliant, e a <strong>Companhia Siderúrgica Nacional</strong>, com participações remanescentes de Eletrobras, BNDESPar e acionistas minoritários. Vale registrar um detalhe que o resumo perde: a imprensa da época noticiou que o próprio governo teve de comprar ações para evitar que o leilão fracassasse. A venda da distribuidora do Rio, símbolo do programa, foi um sucesso apertado — e isso diz mais sobre o apetite real do capital privado por ativo elétrico brasileiro em 1996 do que qualquer discurso da época." },
    { kind: 'paragrafo', html: "Seguiram-se dezenas de distribuidoras estaduais entre 1997 e 2000. Em <strong>15 de abril de 1998</strong>, a <strong>Eletropaulo Metropolitana</strong>, resultado da cisão da estatal paulista, foi arrematada por um consórcio com a mesma constelação de nomes — AES, Houston Industries, EDF e CSN. Em 2001 a AES consolidou o controle comprando as fatias da Houston e da CSN, e é dessa operação, e não de uma decisão de marca, que nasce a <strong>AES Eletropaulo</strong>. Ou seja: a empresa que o currículo cita como embrião do setor no Rio e em São Paulo tem, na verdade, duas linhagens que se cruzam — a linhagem física, que vem da Light do começo do século, e a linhagem societária, que se forma nos leilões de 1996 e 1998." },
    { kind: 'nota', tom: "neutro", label: "Números vivos · verificar na fonte antes de uso externo", html: "O valor de venda da Light em 1996 aparece de forma diferente em fontes todas legítimas: cerca de <strong>R$ 2,2 bilhões</strong> em literatura acadêmica que reconstitui a operação, e cerca de <strong>US$ 2,26 bilhões</strong> em registros da época e enciclopédias que citam esses registros. Não são necessariamente números conflitantes — são moedas e recortes de perímetro diferentes —, mas quem cita um deles em material público sem dizer qual é a fonte e o que exatamente está sendo medido está assumindo um risco desnecessário. A mesma cautela vale para participações acionárias e para qualquer valor de privatização citado neste módulo. Data e composição do consórcio são âncoras firmes; valor exige checagem no momento do uso." },
    { kind: 'titulo', numero: "3.4", texto: "A assimetria que virou bomba" },
    { kind: 'paragrafo', html: "Ao fim da década, o retrato é este: <strong>distribuição majoritariamente privada, geração majoritariamente estatal</strong>, com alienações pontuais. Aplique a régua e veja onde ficou o buraco." },
    { kind: 'paragrafo', html: "Dono: misto. Financiador da expansão: ninguém, com clareza. Planejador: em transição, porque o planejamento determinativo do modelo antigo tinha sido desmontado e o planejamento indicativo do modelo novo ainda não tinha instituição própria. Operador: o ONS, recém-criado, ainda estruturando processos. Preço de curto prazo: o MAE, que enfrentou dificuldades de implantação, disputa entre agentes e atraso na liquidação. Crise que encerra o modelo: você já sabe qual." },
    { kind: 'paragrafo', html: "O ponto crítico é a segunda pergunta. No modelo estatal, expandir era obrigação legal de empresa pública com fonte fiscal definida. No modelo desenhado, expandir seria decisão de investidor privado respondendo a sinal de preço. Na transição, a obrigação tinha sido removida e o sinal ainda não funcionava — o MAE não entregava preço confiável, as regras de energia assegurada estavam em disputa, e o marco regulatório mudava enquanto os projetos eram avaliados. Nenhum investidor racional compromete capital de vinte anos com regra que muda no meio." },
    { kind: 'paragrafo', html: "O <strong>Programa Prioritário de Termeletricidade</strong>, lançado em 2000 para preencher esse vazio com usinas a gás, esbarrou em três problemas simultâneos: preço do gás indexado a moeda estrangeira, desvalorização cambial de 1999 e ausência de contrato de longo prazo que tornasse o projeto financiável. Boa parte das usinas anunciadas não saiu do papel." },
    { kind: 'titulo', numero: "3.5", texto: "2001: o racionamento" },
    { kind: 'paragrafo', html: "Comece pelo vocabulário, porque ele é a primeira coisa que um decisor testa. O episódio de 2001 é popularmente chamado de <em>apagão</em>, mas apagão é interrupção involuntária por falha de operação ou de rede. O que aconteceu em 2001 foi <strong>racionamento</strong>: um programa compulsório e planejado de redução de consumo, decidido por autoridade pública para preservar reservatórios e evitar o colapso desordenado. São coisas diferentes, com causas diferentes, respostas diferentes e consequências contratuais diferentes." },
    { kind: 'nota', tom: "gold", label: "Fronteira com o Módulo 02", html: "A mecânica física de como uma perturbação se propaga pela rede em segundos — a cascata de falha — é conteúdo do Módulo 02, e não se reabre aqui. Nesta aula, 2001 é tratado exclusivamente como <strong>balanço de energia e falha institucional</strong>: quanta água havia, quanta chegava, quanta margem firme existia e por que ninguém agiu antes. Se a explicação começar a falar em frequência, inércia ou propagação, você saiu do Bloco 6." },
    { kind: 'paragrafo', html: "A cronologia é apertada. Em maio de 2001 o governo cria a <strong>Câmara de Gestão da Crise de Energia Elétrica</strong>, a GCE, coordenada pela Casa Civil — o comando sai do Ministério de Minas e Energia e vai para o Planalto, o que por si só já é um diagnóstico institucional. A primeira resolução da câmara é de 16 de maio. O programa de redução compulsória vigora de <strong>junho de 2001 a fevereiro de 2002</strong>, atingindo Sudeste, Centro-Oeste, Nordeste e parte do Norte, com meta média em torno de <strong>vinte por cento</strong> de redução sobre o consumo de referência, variando por classe, e com um sistema de bônus para quem economizasse além da meta e sobretarifa progressiva — chegando à possibilidade de suspensão — para quem excedesse." },
    { kind: 'paragrafo', html: "O resultado agregado é notável e mudou a forma como o setor pensa demanda: a população cortou mais rápido do que os modelos supunham, e parte do corte não voltou. O consumo de eletricidade de 2000 só foi reencontrado em 2004. A eficiência ganha no racionamento — troca de lâmpadas, substituição de equipamento, mudança de hábito — virou patrimônio permanente. O custo, porém, foi real e desigualmente distribuído: o crescimento do PIB caiu de 4,4% em 2000 para 1,3% em 2001, e indústrias eletrointensivas e consumidores com pouca flexibilidade sofreram desproporcionalmente." },
    { kind: 'titulo', numero: "3.6", texto: "O que a comissão de investigação achou" },
    { kind: 'paragrafo', html: "Aqui está o fato que separa uma narrativa madura de uma narrativa de bar. Em 2001, uma comissão de análise presidida por <strong>Jérson Kelman</strong>, então à frente da Agência Nacional de Águas, investigou as causas. O relatório dividiu a responsabilidade entre <strong>Ministério de Minas e Energia, ANEEL, ONS e Eletrobras</strong>, e concluiu que essas instâncias sabiam, desde meados de 1999, que o risco de déficit para 2000 e 2001 era muito elevado. Registrou ainda que houve orientação para que as avaliações de risco não fossem divulgadas, a fim de não alarmar a população." },
    { kind: 'paragrafo', html: "Leia isso de novo, porque é o coração institucional do bloco. O problema não foi ausência de informação. Foi informação que existia e não virou decisão.</b> É por isso que a resposta de 2004 não foi \"criar mais dado\" — foi criar instituições cuja função é converter dado em obrigação: uma empresa de planejamento que produz o estudo, um comitê que monitora continuamente a segurança de suprimento, e uma regra que obriga a distribuidora a estar contratada com anos de antecedência, independentemente do que qualquer autoridade ache do risco naquele momento." },
    { kind: 'paragrafo', html: "A causa do racionamento, portanto, é uma cadeia, não um culpado. Hidrologia adversa foi o <strong>gatilho</strong>, e um gatilho dentro do universo previsível — sistemas hidrotérmicos são planejados justamente para atravessar anos ruins. Quando uma seca que cabe no critério de risco produz racionamento, o que falhou é a <strong>margem</strong>: expansão atrasada, capacidade firme insuficiente, transição institucional com responsabilidades fragmentadas, sinal de preço que não induziu resposta antecipada e comunicação de risco que não virou ação política. Atribuir tudo à privatização também não fecha: a geração continuava majoritariamente estatal, e o subinvestimento vinha da década anterior. Atribuir tudo à chuva é pior ainda." },
    { kind: 'titulo', numero: "3.7", texto: "A conta e a cicatriz" },
    { kind: 'paragrafo', html: "Um racionamento não é apenas um evento operacional; é um evento contratual. A queda de consumo derruba a receita das distribuidoras enquanto os custos fixos permanecem, e os contratos de compra continuam de pé. Daí o <strong>Acordo Geral do Setor Elétrico</strong>, com recomposição tarifária extraordinária e financiamento público para cobrir as perdas — mais uma vez, um choque sistêmico gerando um mecanismo financeiro coletivo cujo custo aparece na tarifa nos anos seguintes. Esse padrão vai se repetir em 2014 e em 2020, e reconhecê-lo é reconhecer a assinatura institucional do setor brasileiro." },
    { kind: 'paragrafo', html: "Em abril de 2002, a <strong>Lei nº 10.438</strong> cria o <strong>Proinfa</strong>, programa de incentivo a fontes alternativas, e a <strong>Conta de Desenvolvimento Energético</strong>. É o momento em que a conta de luz passa formalmente a financiar política pública de diversificação — e a origem histórica de boa parte do debate sobre encargos que domina o setor até hoje." },
    { kind: 'paragrafo', html: "A cicatriz principal, porém, é conceitual. Depois de 2001, <strong>segurança de suprimento</strong> passa a ser objetivo explícito do setor, ao lado de modicidade tarifária e universalização. O Brasil não abandonou mercado livre, não reestatizou a distribuição e não fechou a ANEEL. Fez outra coisa, mais interessante e mais difícil: manteve os elementos competitivos da reforma e recolocou o Estado no centro da coordenação da expansão. É isso que a Aula 04 descreve." },
    { kind: 'nota', tom: "neutro", label: "Por que 2001 aconteceu · três níveis", html: "<b>Criança de 12 anos.</b> Quase toda a energia do Brasil vinha de represas, e as represas guardam água como uma caixa d'água guarda água para o mês inteiro. Naquele ano choveu pouco — mas o problema maior é que fazia tempo que quase não se construíam usinas novas, então não tinha reserva. Quando a caixa d'água começou a esvaziar, não deu para consertar rápido, porque usina demora anos para ficar pronta. Aí o governo pediu para todo mundo usar 20% menos de luz, com desconto para quem economizasse e multa para quem gastasse demais.<br/><b>Executivo.</b> A hidrologia ruim foi o gatilho, não a causa. A causa foi a ausência de margem: a reforma dos anos 1990 removeu a obrigação estatal de expandir antes que o mecanismo privado de expansão estivesse funcionando, e o vazio durou tempo suficiente para consumir a folga do sistema. Some a isso responsabilidades fragmentadas entre ministério, agência e operador, e uma decisão de não divulgar publicamente avaliações de risco que já apontavam probabilidade alta de déficit desde 1999. Quando a seca chegou, não havia nem capacidade firme para poupar reservatório nem tempo para construir. A única alavanca restante era a demanda.<br/><b>Especialista.</b> O evento resulta da coincidência entre afluência abaixo da média em subsistemas com armazenamento já deprimido e uma configuração de oferta com margem de capacidade firme insuficiente para deslocar geração hidráulica na escala necessária. O vetor estrutural é a descontinuidade do mecanismo de expansão: extinção do planejamento determinativo sem consolidação do sinal de investimento no mercado atacadista em formação, com instabilidade das regras de energia assegurada e do processo de liquidação, e falha do programa emergencial de termeletricidade por exposição cambial do custo de combustível e ausência de contrato de longo prazo bancável. O componente de governança é documentado: a comissão de análise identificou conhecimento prévio do risco de déficit desde 1999 e falha de conversão de informação técnica em decisão política preventiva. A resposta de 2004 endereça precisamente esse componente ao institucionalizar planejamento, monitoramento contínuo e obrigação de cobertura contratual antecipada com lastro físico." },
    { kind: 'nota', tom: "neutro", label: "Onde isso entra no produto", html: "É o argumento fundador do <strong>Brazil Pulse</strong>. Toda vez que uma manchete diz que os reservatórios estão em determinado nível, ela está entregando uma variável de quatro. O nível sozinho não diz nada: depende da afluência esperada, da margem firme disponível e de quantos meses faltam para a próxima cheia. Um produto que republica o nível é um agregador de notícia; um produto que apresenta as quatro variáveis juntas e diz qual delas está mandando naquele momento é análise. A distinção nasceu literalmente em 2001, e o instrumento acima é o esqueleto do raciocínio." },
  ],
  'aula-06-04': [
    { kind: 'titulo', numero: "4.1", texto: "Três objetivos, e a ordem entre eles" },
    { kind: 'paragrafo', html: "Em 2003, o governo enuncia os três objetivos que passam a organizar toda a regulação do setor: <strong>segurança de suprimento</strong>, <strong>modicidade tarifária</strong> e <strong>universalização</strong>. A ordem não é decorativa. Antes de 2001, modicidade era o objetivo dominante do discurso público e segurança era pressuposta. Depois de 2001, segurança entra explicitamente no topo, e a partir dali toda regra do setor pode ser lida como um ponto no plano entre esses três eixos — que frequentemente se contradizem." },
    { kind: 'paragrafo', html: "A universalização deixa de ser retórica com o programa <strong>Luz para Todos</strong>, lançado em novembro de 2003, que leva conexão a milhões de domicílios, sobretudo rurais, que nenhum cálculo de retorno privado teria atendido. É a afirmação, em política pública, de que eletricidade é insumo de cidadania e não apenas mercadoria concedida — e a origem de uma parte relevante dos encargos que hoje aparecem na fatura." },
    { kind: 'titulo', numero: "4.2", texto: "Duas leis, uma arquitetura" },
    { kind: 'paragrafo', html: "As <strong>Leis nº 10.847 e nº 10.848, ambas de 15 de março de 2004</strong>, e o Decreto nº 5.163 do mesmo ano, montam a arquitetura que está de pé até hoje. Quatro criações institucionais e uma regra de comportamento." },
    { kind: 'tabela', linhas: [["Criação de 2004","Contra qual falha de 2001","O que ela faz até hoje"],["EPE — Empresa de Pesquisa Energética","Planejamento determinativo desmontado sem substituto institucional","Produz o estudo de expansão que orienta leilão, outorga e política — dentro do Estado, mas fora da empresa que opera e fora da agência que regula"],["CCEE — Câmara de Comercialização","MAE com dificuldade de implantação, liquidação atrasada e disputa entre agentes","Registra contratos dos dois ambientes, mede, contabiliza e liquida as diferenças"],["CMSE — Comitê de Monitoramento","Informação de risco existente que não virava decisão","Acompanha continuamente continuidade e segurança de suprimento e recomenda ação preventiva"],["ACR e ACL formalizados","Ambiguidade sobre quem compra o quê, de quem e sob qual regra","Dois ambientes com regras próprias: distribuidoras compram por mecanismo regulado; agentes elegíveis negociam bilateralmente"],["Obrigação de cobertura e lastro","Expansão sem dono e sem obrigação de antecedência","Distribuidora deve estar contratada para a totalidade da carga; contrato precisa de lastro físico correspondente"]] },
    { kind: 'paragrafo', html: "A peça menos comentada e mais importante é a última. A obrigação de cobertura contratual integral, com antecedência e com lastro, é o que impede estruturalmente a repetição de 1999: não depende de nenhuma autoridade avaliar corretamente o risco, nem de nenhuma autoridade decidir divulgá-lo. Ela transforma a segurança de suprimento numa obrigação contratual distribuída entre agentes, verificável, com consequência para quem descumpre. Foi essa a lição institucional do racionamento — não \"planejar mais\", e sim <strong>tirar a segurança de suprimento da dependência de uma decisão discricionária</strong>." },
    { kind: 'nota', tom: "gold", label: "Fronteira com o Módulo 04", html: "Como funcionam os leilões A-1 a A-6, como se forma o preço neles, o que é um contrato de quantidade e um de disponibilidade — tudo isso é <strong>mecanismo</strong> e já foi ensinado no Módulo 04. Aqui a pergunta é outra: <em>por que esse mecanismo nasceu em 2004</em>. Ele nasceu porque a alternativa — deixar o investimento responder ao preço de curto prazo — tinha acabado de falhar de forma documentada, e porque financiar uma usina exige receita contratada de longo prazo que o mercado spot não entrega." },
    { kind: 'titulo', numero: "4.3", texto: "O que mudou e o que não mudou" },
    { kind: 'paragrafo', html: "Vale enunciar isso com precisão, porque é aqui que a conversa técnica se ganha ou se perde." },
    { kind: 'paragrafo', html: "<strong>Não mudou:</strong> a propriedade privada das distribuidoras vendidas nos anos 1990 permaneceu privada; o mercado livre continuou existindo e foi formalizado, não fechado; a ANEEL continuou regulando; o ONS continuou operando de forma centralizada; a competição em geração continuou, agora com o leilão como forma de disputa." },
    { kind: 'paragrafo', html: "<strong>Mudou:</strong> o planejamento ganhou instituição própria e voltou a orientar a contratação; a expansão passou a ser puxada por contrato de longo prazo em vez de por expectativa de preço spot; as distribuidoras do sistema interligado ficaram restritas às atividades próprias de distribuição — a concretização brasileira do <em>unbundling</em> que o Módulo 05 descreveu como conceito, agora com data e norma; e a contabilização do curto prazo passou a ter uma câmara com governança própria." },
    { kind: 'paragrafo', html: "Note o desenho de risco. No modelo estatal, o risco de expansão insuficiente era do Estado, que carregava a obrigação. No modelo de transição, ele estava sem dono — e foi por isso que estourou. No modelo de 2004, ele é distribuído por contrato: a distribuidora responde por estar contratada, o gerador responde por entregar o lastro, e o consumidor final paga o custo da antecedência. É uma alocação explícita, e é melhor que a anterior. Também é uma alocação que compra um risco novo, e o instrumento abaixo mostra qual." },
    { kind: 'titulo', numero: "4.4", texto: "A retomada, e o preço dela" },
    { kind: 'paragrafo', html: "O mecanismo funcionou no que se propunha. O primeiro leilão de energia nova ocorre em <strong>2005</strong>; nos anos seguintes o país contrata térmicas, hidrelétricas e fontes alternativas em volume relevante. Os grandes projetos amazônicos — Santo Antônio e Jirau no rio Madeira, depois Belo Monte no Xingu — marcam o retorno da hidrelétrica de grande porte, agora com financiamento ancorado em contratos regulados de longo prazo e com sócios privados, e não mais com a lógica de execução direta dos anos 1970." },
    { kind: 'paragrafo', html: "Em <strong>2009</strong>, o primeiro leilão específico de energia eólica revela o que hoje é óbvio e na época não era: o recurso brasileiro é de qualidade excepcional e a fonte é competitiva quando disputa em leilão com contrato longo. A diversificação da matriz que se vê hoje começa ali, e começa por desenho institucional — leilão por fonte, contrato bancável, cadeia produtiva induzida — e não por espontaneidade de mercado." },
    { kind: 'paragrafo', html: "O preço dessa arquitetura é <strong>complexidade</strong>, e é preciso dizê-lo sem eufemismo. Encargos setoriais, contratos regulados de vários tipos, garantia física, mecanismos de compartilhamento, leilões segmentados por fonte, contas de compensação: cada peça foi criada para alocar um risco específico, e o conjunto tornou a fatura de energia quase ilegível para o consumidor que a paga. Isso não é apenas defeito burocrático — é o preço de tentar alocar hidrologia, construção, combustível, demanda e transmissão a agentes diferentes. Mas vira defeito quando as regras se sobrepõem, quando os incentivos se contradizem e quando o custo é socializado sem que ninguém consiga rastrear por quê. Boa parte da agenda regulatória de 2017 em diante — e da lei de 2025 — é tentativa de arrumar exatamente isso." },
    { kind: 'nota', tom: "neutro", label: "O Novo Modelo de 2004 · três níveis", html: "<b>Criança de 12 anos.</b> Depois do susto de 2001, o governo não voltou a ser dono de tudo nem deixou tudo por conta das empresas. Fez uma coisa no meio: criou um time que estuda de quanta energia o país vai precisar, obrigou as distribuidoras a comprarem essa energia com anos de antecedência, e criou uma câmara que faz as contas de quem entregou e quem recebeu. Assim, mesmo que alguém erre a previsão, já existe usina contratada e sendo construída bem antes de a energia fazer falta.<br/><b>Executivo.</b> O modelo de 2004 é híbrido por decisão, não por indecisão. Preservou propriedade privada, competição em geração e o mercado livre; recuperou planejamento com instituição dedicada, a EPE; substituiu o MAE pela CCEE com governança própria; criou monitoramento contínuo de segurança de suprimento no CMSE; e, sobretudo, transformou a expansão numa obrigação contratual com antecedência e lastro, em vez de uma aposta no sinal de preço de curto prazo. O ganho foi previsibilidade de financiamento para o gerador e segurança para o sistema. O custo foi complexidade e a transferência do erro de projeção de demanda para a tarifa.<br/><b>Especialista.</b> A arquitetura combina otimização centralizada da operação, planejamento indicativo estruturado pela EPE, contratação regulada por leilão com produtos padronizados e obrigação de cobertura integral com lastro em garantia física, coexistindo com contratação bilateral livre e liquidação centralizada das diferenças na CCEE. O deslocamento essencial em relação ao arranjo de 1998 é de natureza institucional: a adequação de capacidade deixa de depender da resposta endógena do investimento ao preço spot — com o problema de <em>missing money</em> tratado no Módulo 04 — e passa a depender de contrato de longo prazo bancável, com risco de crédito distribuído e verificável ex ante. O custo assumido é o de transferir erro de previsão de carga para exposição contratual das distribuidoras, mitigado por mecanismos de repasse e por leilões de ajuste, com efeito tarifário residual." },
    { kind: 'nota', tom: "neutro", label: "Onde isso entra no produto", html: "Este é o bloco que alimenta diretamente a <strong>Alexandria</strong> e faz a ponte para o Bloco 7. Um profissional que sabe que a EPE nasceu em 2004 contra uma falha específica lê a instituição de outro jeito — e consegue avaliar, quando surge uma proposta de mudar atribuições entre EPE, ONS e CCEE, se ela está mexendo numa peça acessória ou desfazendo a resposta a um trauma. Essa é exatamente a diferença entre noticiar uma consulta pública e analisá-la." },
  ],
  'aula-06-05': [
    { kind: 'titulo', numero: "5.1", texto: "Uma tentativa de reduzir tarifa pela concessão" },
    { kind: 'paragrafo', html: "Em setembro de 2012, a <strong>Medida Provisória nº 579</strong>, convertida na <strong>Lei nº 12.783/2013</strong>, oferece às concessões de geração e transmissão que se aproximavam do vencimento uma prorrogação antecipada, condicionada à aceitação de receitas reguladas menores. Para as hidrelétricas, o regime passa a ser de <strong>cotas</strong>: a energia é alocada às distribuidoras a um custo de operação e manutenção, e não vendida no mercado." },
    { kind: 'paragrafo', html: "A lógica econômica é defensável e vale entendê-la antes de julgá-la. Um ativo já amortizado — uma usina construída há quarenta anos e paga há muito tempo — não precisa continuar recebendo como se fosse novo. A renda que ele gera acima do custo de operar é renda da concessão, e a decisão sobre quem fica com ela é legítima e política. O governo optou por transferi-la ao consumidor via tarifa." },
    { kind: 'paragrafo', html: "O que deu errado não foi a ideia; foi a transição. Algumas empresas aceitaram, outras — várias estaduais — recusaram e preferiram esperar a licitação futura. As indenizações por ativos não amortizados ficaram em disputa. E a redução de receita atingiu simultaneamente a capacidade de investimento, o valor de mercado e o perfil de dívida das companhias afetadas, no mesmo momento em que a hidrologia começava a virar. Redução estrutural de tarifa precisa ser compatível com investimento, risco e contrato — quando o desenho muda o fluxo de caixa abruptamente, o efeito aparece em outro lugar do balanço poucos anos depois.</b>" },
    { kind: 'titulo', numero: "5.2", texto: "A seca encontra a tarifa reduzida" },
    { kind: 'paragrafo', html: "A partir de 2013, as afluências caem e o ONS passa a despachar térmicas por períodos prolongados para preservar energia armazenada. O custo de geração dispara exatamente quando parte das tarifas tinha acabado de ser reduzida, e as distribuidoras — contratualmente obrigadas a atender sua carga — ficam expostas à diferença." },
    { kind: 'paragrafo', html: "A resposta segue o padrão que a Aula 03 já mostrou. Em <strong>2014</strong> é criada a <strong>Conta-ACR</strong>: um financiamento coletivo que cobre a exposição das distribuidoras, com pagamento posterior pelos consumidores. Em <strong>2015</strong>, uma <strong>revisão tarifária extraordinária</strong> reprecifica o que a MP 579 tinha comprimido, e entra em aplicação efetiva o sistema de <strong>bandeiras tarifárias</strong>." },
    { kind: 'paragrafo', html: "As bandeiras merecem uma leitura institucional, não apenas operacional. Elas resolvem um problema de <em>timing</em>: antes delas, o custo extra de acionar térmicas era acumulado e cobrado meses ou anos depois, na forma de reajuste ou de conta financeira. A bandeira aproxima o momento em que o custo ocorre do momento em que ele é pago. Isso reduz a formação silenciosa de passivo — a doença crônica do setor desde os anos 1980 — e cria, em troca, volatilidade mensal na conta de quem não tem instrumento para se proteger dela. Mais uma vez: troca de risco, não eliminação. E vale a precisão: <strong>bandeira não é imposto</strong>. É componente tarifário administrado pela agência para sinalizar condição de geração, e confundir os dois é erro que derruba credibilidade na hora." },
    { kind: 'titulo', numero: "5.3", texto: "GSF: quando o rateio descobre que é um sistema fechado" },
    { kind: 'paragrafo', html: "Aqui está o episódio mais instrutivo da década, e ele não é sobre hidrologia. É sobre o que acontece quando a fronteira de um risco é contestável." },
    { kind: 'paragrafo', html: "As hidrelétricas participantes do mecanismo de realocação compartilham entre si o risco de geração: quem gera acima da garantia física cede o excedente a quem gerou abaixo. Quando o conjunto inteiro gera abaixo da garantia física, aplica-se um fator de ajuste — o <strong>GSF</strong> — que reduz a energia alocada a todos. Em anos de GSF baixo com preço de curto prazo alto, o gerador precisa comprar energia cara para honrar contratos que assinou." },
    { kind: 'nota', tom: "gold", label: "Fronteira com o Bloco 9", html: "A mecânica completa do mecanismo de realocação, o cálculo do fator de ajuste e as regras de contabilização são conteúdo do <strong>Bloco 9</strong>. O que interessa aqui é exclusivamente a consequência institucional: por que essa disputa foi parar no Judiciário e o que ela revelou sobre a arquitetura de liquidação do setor." },
    { kind: 'paragrafo', html: "Os geradores argumentaram que parte do déficit não decorria de hidrologia, mas de <strong>decisões sistêmicas</strong>: despacho térmico fora da ordem de mérito por razão de segurança, atraso de linhas de transmissão que impediu escoamento, deslocamento por outras fontes. Se o contrato diz que o gerador assume o risco hidrológico, e parte da perda não é hidrológica, então quem responde por essa parte? A pergunta é legítima e não tinha resposta clara no desenho." },
    { kind: 'paragrafo', html: "A partir de 2015, dezenas de geradores obtêm <strong>liminares</strong> limitando a aplicação do ajuste. E é aqui que o setor descobre, na prática, uma propriedade da sua própria arquitetura: a liquidação na câmara de comercialização é um sistema de rateio, não um caixa com fundo próprio</b>. O dinheiro que entra é o dinheiro que sai. Quando um agente é dispensado judicialmente de pagar, não existe reserva que absorva a diferença — ela é rateada entre os credores, que recebem menos do que lhes é devido. Esses credores, por sua vez, ficam expostos, e alguns buscam a própria liminar. A proteção individual, perfeitamente racional do ponto de vista de cada agente, produz inadimplência sistêmica." },
    { kind: 'paragrafo', html: "A ordem de grandeza retida por essa via chegou a ser citada em torno de <strong>oito a nove bilhões de reais</strong> travados no mercado de curto prazo. A saída foi construída em camadas: a <strong>Lei nº 13.203/2015</strong> abriu a repactuação do risco hidrológico mediante pagamento de prêmio; a <strong>Lei nº 14.052/2020</strong> ofereceu condições novas, com compensação por extensão do prazo de outorga em troca de desistência das ações, regulamentada pela agência ainda em 2020; e, em 2025, uma medida provisória incluiu na lei de 2015 a previsão de um <strong>leilão de passivos</strong>, convertendo os valores judicialmente retidos em títulos negociáveis liquidáveis contra extensão de outorga. Dez anos depois do primeiro liminar, o passivo ainda estava sendo desmontado." },
    { kind: 'titulo', numero: "5.4", texto: "Modernização em degraus" },
    { kind: 'paragrafo', html: "Em <strong>2017</strong>, uma consulta pública do ministério organiza a agenda de modernização do setor: separação entre lastro e energia, abertura do mercado, formação de preço, racionalização de subsídios e sustentabilidade da distribuição. A reforma ampla não passa de uma vez — mas várias peças avançam por portaria, resolução e projeto de lei ao longo dos anos seguintes." },
    { kind: 'paragrafo', html: "A abertura do mercado livre deixa de ser evento e vira <strong>processo escalonado</strong>. Vale guardar a escada, porque ela é literalmente o gráfico do mercado endereçável de qualquer produto de inteligência energética no Brasil:" },
    { kind: 'tabela', linhas: [["A partir de","Carga mínima para migrar","Norma"],["1º de julho de 2019","2.500 kW","Portaria MME nº 514/2018"],["1º de janeiro de 2020","2.000 kW","Portaria MME nº 514/2018"],["1º de janeiro de 2021","1.500 kW","Portaria MME nº 465/2019"],["1º de janeiro de 2022","1.000 kW","Portaria MME nº 465/2019"],["1º de janeiro de 2023","500 kW","Portaria MME nº 465/2019"],["1º de janeiro de 2024","sem limite de carga, todo o Grupo A","Portaria Normativa nº 50/GM/MME, de 2022"]] },
    { kind: 'paragrafo', html: "A gradualidade não foi timidez. Cada degrau exigia medição adequada, representação por comercializador varejista, capacidade de gestão de risco do consumidor que migra e, sobretudo, tratamento do custo que fica para trás: quem sai do ambiente regulado deixa de dividir custos fixos que continuam existindo, e essa parcela é redistribuída entre os que ficam. Abrir rápido demais não é liberalizar — é transferir custo sem dizer." },
    { kind: 'titulo', numero: "5.5", texto: "Geração distribuída, pandemia e o teste de 2021" },
    { kind: 'paragrafo', html: "Enquanto isso, a rede de distribuição deixa de ser um fluxo de mão única. A resolução normativa de <strong>2012</strong> criou o sistema de compensação para micro e minigeração distribuída; na segunda metade da década, a queda do custo dos módulos e o financiamento aceleram a instalação. O conflito é estrutural e conhecido: quem instala geração reduz a energia comprada, mas continua usando a rede, e a tarifa volumétrica tradicional cobra rede dentro do preço da energia. O <strong>Marco Legal da Geração Distribuída — Lei nº 14.300, de 6 de janeiro de 2022</strong> — consolida a regra de transição desse conflito, mas o debate começou uma década antes." },
    { kind: 'paragrafo', html: "Em <strong>2020</strong>, a pandemia derruba o consumo comercial e industrial, eleva o residencial e pressiona o caixa das distribuidoras. A resposta é a <strong>Conta-Covid</strong>: exatamente o mesmo instrumento do Acordo Geral de 2001 e da Conta-ACR de 2014, com outro nome. Três choques diferentes, uma assinatura institucional idêntica — antecipar recursos coletivamente para preservar liquidez e diferir o impacto tarifário." },
    { kind: 'paragrafo', html: "E então, em <strong>2021</strong>, o teste. O país enfrenta uma das piores condições hidrológicas em décadas. O governo cria uma câmara de regras excepcionais para gestão hidroenergética, intensifica térmicas e importação, e a agência institui uma bandeira específica de <strong>escassez hídrica</strong>, vigente de setembro de 2021 a abril de 2022. <strong>Não houve racionamento compulsório.</strong>" },
    { kind: 'paragrafo', html: "Essa diferença em relação a 2001 é a melhor medida disponível de aprendizado institucional, e é um dos argumentos mais fortes que você pode ter na mão numa conversa com decisor. Em 2021 o Brasil tinha ONS consolidado, EPE, CMSE, obrigação de contratação com lastro, parque térmico consideravelmente maior, transmissão mais robusta e diversidade renovável relevante. O sistema absorveu um choque hidrológico comparável sem cortar consumo. O custo, porém, foi alto e apareceu na conta — e a lição nova foi outra: <strong>energia anual não é o mesmo que potência e flexibilidade</strong>. Eólica e solar ampliam a energia disponível no ano e não resolvem sozinhas a necessidade de reserva, resposta de demanda e armazenamento. É essa constatação que empurra a agenda de reserva de capacidade e de armazenamento que chega à lei de 2025." },
    { kind: 'nota', tom: "neutro", label: "Por que risco mal alocado vira processo judicial · três níveis", html: "<b>Criança de 12 anos.</b> Imagine uma vaquinha onde todo mundo bota dinheiro e todo mundo tira. Se uma pessoa consegue uma autorização do juiz para não botar, mas continua tirando, falta dinheiro — e quem sobra recebe menos do que devia. Aí essas pessoas também vão procurar o juiz. Foi mais ou menos isso que aconteceu no setor elétrico: uma regra dizia quem pagava a conta quando faltava chuva, mas ninguém tinha combinado o que fazer quando faltava por outro motivo. Levou dez anos para desatar o nó.<br/><b>Executivo.</b> O contrato dizia que o gerador hidrelétrico assumia o risco hidrológico. A operação real, porém, é decidida centralmente, e parte da perda decorria de decisões sistêmicas — despacho por segurança, atraso de transmissão — que não são hidrologia. Com a fronteira contestável e o valor em jogo alto, a disputa foi para o Judiciário. Como a liquidação é rateio puro, cada liminar reduzia o caixa disponível e transferia o prejuízo para os demais, que também passaram a litigar. A lição para qualquer negociação de contrato de energia é direta: a cláusula precisa dizer não só quem carrega o risco, mas o que exatamente conta como aquele risco e quem decide isso.<br/><b>Especialista.</b> A judicialização decorre da indeterminação da fronteira entre risco hidrológico contratualmente alocado ao gerador do mecanismo de realocação e o efeito de decisões sistêmicas exógenas ao agente — despacho fora da ordem de mérito por restrição elétrica ou segurança energética, geração fora da ordem de mérito e restrições de escoamento. A arquitetura de liquidação, por ser de rateio sem fundo garantidor dimensionado para esse volume, converte a inadimplência protegida por tutela em corte proporcional aos credores, gerando contágio endógeno. A solução legislativa foi construída em três camadas sucessivas — repactuação por prêmio de risco em 2015, repactuação por extensão de outorga condicionada à renúncia em 2020, e conversão dos valores retidos em títulos negociáveis com liquidação por leilão a partir de 2025 —, todas desenhadas para trocar litígio por concessão de prazo, e nenhuma para relitigar a alocação original." },
    { kind: 'nota', tom: "neutro", label: "Onde isso entra no produto", html: "Esta aula é a defesa mais concreta da tese de independência da GridAlpha. Quem estruturou os contratos que geraram a disputa do GSF também vendia a energia. Não é acusação — é descrição de incentivo: quem ganha comissão por fechar contrato não é a parte com maior interesse em interrogar a cláusula de alocação de risco antes da assinatura. Uma camada analítica que não vende energia e não recebe comissão é a única posição a partir da qual a pergunta \"o que exatamente conta como risco hidrológico neste contrato?\" pode ser feita sem conflito. A história de 2015 a 2025 é a demonstração de quanto custa não perguntar." },
  ],
  'aula-06-06': [
    { kind: 'titulo', numero: "6.1", texto: "2022: capitalização não é venda" },
    { kind: 'paragrafo', html: "A <strong>Lei nº 14.182/2021</strong> autorizou a desestatização da Eletrobras por um mecanismo específico, e a diferença entre esse mecanismo e uma venda direta é o primeiro teste técnico que qualquer investidor faz sobre o assunto." },
    { kind: 'paragrafo', html: "Numa <strong>venda direta</strong>, o dono aliena ações que já existem a um comprador; o controle troca de mãos e o dinheiro vai para o vendedor. Numa <strong>capitalização</strong>, a empresa emite ações novas, os investidores aportam capital <em>na companhia</em>, e o acionista antigo é diluído porque não acompanha a emissão. Foi isso que ocorreu: em junho de 2022, com preço fixado em quarenta e dois reais por ação ordinária, a oferta movimentou cerca de <strong>R$ 33,7 bilhões</strong> considerando o lote suplementar, dos quais a maior parte entrou no caixa da própria companhia; houve também oferta secundária de ações detidas pelo BNDESPar. A participação da União no capital votante caiu de aproximadamente 72% para cerca de 40%, e as novas ações passaram a ser negociadas em 13 de junho de 2022." },
    { kind: 'paragrafo', html: "Só que 40% do capital votante não é controle — porque a lei impôs um <strong>limite de dez por cento nos votos</strong> de qualquer acionista ou grupo, independentemente da participação econômica. A empresa passou a ser uma <em>corporation</em>: companhia sem controlador definido, com capital pulverizado e governança própria. A União manteve ainda uma ação de classe especial com poderes limitados a matérias específicas. A operação veio acompanhada de novas outorgas, pagamentos ao poder concedente, aportes à Conta de Desenvolvimento Energético e programas regionais — ou seja, avaliar a desestatização exige separar quatro coisas que costumam ser misturadas: governança corporativa, efeito tarifário, obrigações legais assumidas e capacidade de investimento." },
    { kind: 'nota', tom: "neutro", label: "Correção de precisão do currículo · números vivos", html: "O currículo registra que \"o Governo Federal ainda mantém ~30%\". <strong>Não decore esse número.</strong> A participação econômica varia com operações societárias, classes de ação e movimentos de mercado, e diferentes fontes medem coisas diferentes — capital votante, capital total, participação direta da União, participação da União somada a entes estatais. O que é estável e defensável em qualquer conversa: a diluição levou o bloco estatal <em>abaixo do controle</em>; existe limite de 10% de voto por acionista ou grupo; e não há controlador definido. Para percentual atual, a fonte é a composição acionária divulgada pela companhia em relações com investidores, consultada na data de uso. O mesmo vale para o valor da operação: além dos R$ 33,7 bilhões da oferta, circulam números maiores que agregam outorgas e obrigações assumidas — são recortes diferentes, não contradições." },
    { kind: 'titulo', numero: "6.2", texto: "2025: de Eletrobras a AXIA" },
    { kind: 'paragrafo', html: "Em <strong>22 de outubro de 2025</strong>, a companhia anunciou ao mercado a adoção da marca <strong>AXIA Energia</strong> — do grego <em>axia</em>, valor, e do latim <em>axis</em>, eixo. Os papéis passaram a ser negociados sob os novos códigos a partir de 10 de novembro de 2025, na bolsa brasileira e na de Nova York. A mudança foi apresentada como consolidação do processo de transformação iniciado em 2022 e como reposicionamento para um mercado mais descentralizado e competitivo — e veio logo após a alienação da participação da companhia na Eletronuclear, que desatava um dos últimos vínculos societários herdados do período estatal." },
    { kind: 'paragrafo', html: "A precisão que importa aqui é jurídica, e é uma pergunta cética recorrente: <strong>rebranding não é sucessão</strong>. Concessões, contratos, obrigações regulatórias, passivos e histórico permanecem vinculados à mesma pessoa jurídica. Quem analisa a companhia pela marca — como se fosse uma empresa nova, sem história — está fazendo análise de comunicação, não de crédito. E quem trata o rebranding como se fosse um novo marco regulatório do setor está confundindo três categorias que este bloco inteiro existe para separar: mudança de marca, mudança de controle e mudança de regra." },
    { kind: 'titulo', numero: "6.3", texto: "Janeiro de 2024, e o que vem até 2028" },
    { kind: 'paragrafo', html: "Este é o marco mais importante deste bloco para a GridAlpha, e não por sentimentalismo: é literalmente o momento em que o mercado endereçável do produto passa a existir na escala que o justifica." },
    { kind: 'paragrafo', html: "A <strong>Portaria Normativa nº 50/GM/MME, de 2022</strong>, determinou que, a partir de <strong>1º de janeiro de 2024</strong>, todo consumidor classificado no <strong>Grupo A</strong> — atendido em alta ou média tensão — pudesse comprar energia de qualquer fornecedor autorizado, <em>sem exigência de carga mínima</em>. Para os menores, a entrada se dá por representação de comercializador varejista. Estimativas de associação setorial falam em cerca de <strong>165 mil empresas</strong> que se tornaram aptas a migrar nesse momento." },
    { kind: 'paragrafo', html: "E a história não parou ali. A <strong>Lei nº 15.269, de 24 de novembro de 2025</strong>, resultante da conversão de medida provisória, estabeleceu pela primeira vez <strong>cronograma legal para a baixa tensão</strong>: até novembro de 2027 para consumidores industriais e comerciais atendidos em tensão inferior a 2,3 kV, e até novembro de 2028 para os demais, incluindo residenciais e rurais. A mesma lei tratou de armazenamento, reserva de capacidade, teto para as fontes de custeio da Conta de Desenvolvimento Energético, criação da figura do supridor de última instância e de um produto padrão de baixa tensão para permitir comparação de ofertas, além de encerrar o desconto nas tarifas de uso para novas migrações." },
    { kind: 'nota', tom: "neutro", label: "Números vivos · verificar na fonte antes de uso externo", html: "A Lei nº 15.269/2025 foi sancionada com vetos, que seguem para deliberação do Congresso — e parte relevante do seu efeito prático depende de regulamentação pelo ministério, pela agência e pela câmara de comercialização. <strong>Lei aprovada não é mercado pronto.</strong> Prazos legais são obrigação de cronograma condicionada a pré-requisitos regulatórios e operacionais, não datas garantidas. Antes de qualquer material externo ou proposta comercial que dependa das datas de 2027 e 2028, verifique o estado da regulamentação e dos vetos na data de uso." },
    { kind: 'titulo', numero: "6.4", texto: "O padrão que só aparece de longe" },
    { kind: 'paragrafo', html: "Volte à Light e percorra a trajetória inteira de uma vez só, porque ela sozinha contém o bloco: capital canadense controlando a distribuição do Rio de Janeiro desde o começo do século XX; aquisição pelo Estado brasileiro em 1979; privatização em 1996 para um consórcio internacional; sucessivas trocas de controlador ao longo dos anos 2000; pulverização acionária; e <strong>recuperação judicial deferida pela Justiça do Rio de Janeiro em maio de 2023</strong>. Uma empresa, quatro regimes de propriedade, cento e vinte anos." },
    { kind: 'paragrafo', html: "Some a isso a Eletrobras — estatal em 1962, privatizada por capitalização em 2022, sem controlador desde então, sob nova marca em 2025. E a Eletropaulo, que atravessou cisão, leilão, três controladores e mudanças de razão social. E as distribuidoras estaduais, que foram estaduais, viraram privadas, e em alguns casos voltaram a mudar de mãos." },
    { kind: 'paragrafo', html: "O regime de propriedade do setor elétrico brasileiro mudou de direção quatro vezes em cento e cinquenta anos, e não há nada na história que sugira que parou.</b> Cada virada foi lida, no momento em que aconteceu, como o fim do ciclo anterior e o começo do arranjo definitivo. Nenhuma foi." },
    { kind: 'nota', tom: "neutro", label: "Capitalização, privatização e mudança de marca · três níveis", html: "<b>Criança de 12 anos.</b> A empresa não foi vendida para um dono novo. Ela criou pedacinhos novos dela mesma e vendeu esses pedacinhos para muita gente ao mesmo tempo. Com isso o governo, que antes tinha a maior parte, passou a ter uma parte menor — e ninguém mais manda sozinho, porque existe uma regra dizendo que nenhum dono pode ter mais de 10% dos votos. Depois a empresa trocou de nome, mas continua sendo a mesma empresa, com as mesmas contas e as mesmas obrigações.<br/><b>Executivo.</b> Três coisas diferentes aconteceram e precisam ser separadas na análise. Mudança de controle: a capitalização de 2022 diluiu a União abaixo do controle e, com o limite de 10% de voto, produziu uma companhia sem controlador definido. Mudança de marca: o rebranding de 2025 é reposicionamento comercial, com continuidade jurídica integral de concessões, contratos e passivos. Mudança de regra: essa veio à parte, na lei de 2025, e vale para o setor inteiro, não para uma empresa. Quem funde as três numa narrativa só erra a análise em qualquer direção que a leve.<br/><b>Especialista.</b> A desestatização por aumento de capital com renúncia da União ao direito de subscrição, autorizada pela Lei nº 14.182/2021, produz diluição do bloco estatal sem alienação de controle por transferência onerosa, com contrapartidas legais de outorga, aporte à CDE e programas setoriais. A limitação estatutária de voto a 10% por acionista ou grupo, combinada à ausência de acordo de acionistas controlador, caracteriza estrutura de capital disperso com poder decisório concentrado no conselho e sujeito a disputa por procuração. A ação de classe especial da União preserva veto em matérias delimitadas. Para efeito de análise de crédito e de risco regulatório, a alteração de denominação social e de códigos de negociação em 2025 é irrelevante: a personalidade jurídica, o perímetro de concessões, o passivo contingente e o histórico de cumprimento permanecem íntegros." },
    { kind: 'nota', tom: "neutro", label: "Onde isso entra no produto", html: "Aqui está o argumento mais forte que a Alexandria produziu até agora, e ele é histórico, não publicitário. Em cento e cinquenta anos, o setor elétrico brasileiro trocou de regime de propriedade quatro vezes, trocou de regime tarifário pelo menos cinco, criou e extinguiu órgãos de coordenação em cada ciclo, e está no meio de mais uma transição cujo desfecho ninguém conhece. Uma coisa não mudou em nenhum desses ciclos: em todos eles, quem tinha uma decisão energética para tomar precisava de análise em que pudesse confiar — e, em todos eles, a análise disponível vinha predominantemente de quem tinha interesse no resultado da decisão. É por isso que a GridAlpha se apresenta como <strong>uma nova camada independente</strong> de inteligência energética, e não como uma aposta num regime específico. A independência não é postura moral: é a única propriedade de um modelo de receita que sobrevive a uma virada de ciclo. Comercializadora depende de contrato; consultoria vinculada depende do produto que a controladora vende; empresa estatal depende de política de governo. Análise que não vende energia e não recebe comissão continua valendo exatamente o mesmo com o setor estatal, privado ou pulverizado — e a história deste bloco é a prova de que os três vão se alternar de novo." },
    { kind: 'nota', tom: "gold", label: "A frase que fecha o módulo", html: "O setor elétrico brasileiro não é estatal nem privado, livre nem regulado, centralizado nem descentralizado em sentido puro. Ele é <strong>híbrido porque cada crise acrescentou uma camada para corrigir o risco anterior</strong> — e nunca removeu a camada de baixo. Quem entende isso lê o setor. Quem tenta encaixá-lo num dos dois lados da gangorra passa a vida surpreso." },
  ],
};


/** Os dez exercícios do § Ex. Nenhum aponta aula — ver o cabeçalho. */
export const MODULO_06_EXERCICIOS_SOLTOS: LessonActivity[] = [
  {
    id: "m06-ex-01",
    kind: 'discursiva' as const,
    prompt: "",
    points: 1,
    config: { tag: "01 · Ordem institucional", gabarito: "Pergunta. Coloque em ordem cronológica e diga o ano de cada um: CCEE, Código de Águas, ONS, ANEEL, EPE, Eletrobras, GCOI, MAE. Gabarito. Código de Águas, 1934. Eletrobras, autorizada em 1961 e instalada em 1962. GCOI, 1973. ANEEL, criada pela lei de 1996 e em operação a partir de dezembro de 1997. ONS e MAE, ambos pela lei de 1998. EPE e CCEE, ambas pelas leis de 2004 — a CCEE sucedendo o MAE. Repare no padrão de pares: 1998 e 2004 criam duas instituições cada, e em ambos os casos uma delas é de coordenação e a outra é de contabilização. Quem acerta o ano mas erra o par não entendeu o desenho." },
  },
  {
    id: "m06-ex-02",
    kind: 'discursiva' as const,
    prompt: "",
    points: 1,
    config: { tag: "02 · Corrigir uma afirmação de mesa", gabarito: "Pergunta. Um interlocutor afirma: \"antes de 1995 tudo no setor elétrico brasileiro era estatal\". Corrija em três frases, sem soar pedante. Gabarito. Primeira: o setor nasceu privado e estrangeiro, com a Light e a Amforp dominando as grandes cidades até os anos 1930 — a nacionalização só se completa com a compra da Light em 1979. Segunda: mesmo no auge do modelo estatal, empresas privadas remanescentes e autoprodutores industriais continuaram existindo, e o controle era repartido entre União e estados, não homogêneo. Terceira: o que era estatal, de fato, era a liderança da expansão — quem financiava e construía —, e essa é a variável que muda em 1995, não a propriedade de tudo." },
  },
  {
    id: "m06-ex-03",
    kind: 'discursiva' as const,
    prompt: "",
    points: 1,
    config: { tag: "03 · Aplicar a régua dos seis", gabarito: "Pergunta. Aplique as seis perguntas ao período 1996–2000 e mostre, com a resposta da pergunta dois, por que o racionamento era previsível. Gabarito. Dono: distribuição majoritariamente privada, geração majoritariamente estatal. Financiador da expansão: indefinido — a obrigação estatal tinha sido removida e o investidor privado ainda não tinha sinal confiável nem contrato de longo prazo bancável. Planejador: em transição, com o planejamento determinativo desmontado e nenhuma instituição dedicada a substituí-lo. Operador: ONS recém-criado. Preço de curto prazo: MAE em implantação, com liquidação atrasada e regras em disputa. Crise: o racionamento. A resposta da pergunta dois é o diagnóstico inteiro: um sistema em que ninguém é responsável por garantir a expansão vai crescer menos que a demanda, e a única questão é quando a folga acumulada acaba. A seca definiu o quando , não o se ." },
  },
  {
    id: "m06-ex-04",
    kind: 'discursiva' as const,
    prompt: "",
    points: 1,
    config: { tag: "04 · Racionamento e blecaute", gabarito: "Pergunta. Explique por que confundir racionamento com blecaute não é preciosismo terminológico, mas erro analítico com consequência prática. Gabarito. Porque as duas coisas têm causa, resposta e consequência contratual completamente diferentes. Blecaute é falha de operação ou de rede, resolve-se em segundos ou horas, tem causa técnica e resposta operacional. Racionamento é decisão administrativa de reduzir demanda porque o balanço de energia não fecha no horizonte de meses; a causa é estrutural e a resposta é econômica e regulatória. Consequência prática: um blecaute gera discussão sobre indenização por interrupção e qualidade de serviço; um racionamento gera reprogramação de produção, revisão de demanda contratada, recomposição tarifária extraordinária e alteração do fluxo de caixa de toda a cadeia — foi exatamente isso que produziu o Acordo Geral do Setor Elétrico. Quem confunde os dois vai preparar a empresa para o risco errado." },
  },
  {
    id: "m06-ex-05",
    kind: 'discursiva' as const,
    prompt: "",
    points: 1,
    config: { tag: "05 · A lógica e o problema da MP 579", gabarito: "Pergunta. Qual era a lógica econômica da MP 579 e qual foi o problema de execução? Responda sem tomar partido. Gabarito. A lógica: um ativo já amortizado não precisa continuar sendo remunerado como se fosse novo, e a renda que ele gera acima do custo de operar é renda da concessão, cuja destinação é decisão legítima do poder concedente. Transferi-la ao consumidor por prorrogação antecipada com receita menor é economicamente coerente. O problema: a transição. A mudança de fluxo de caixa foi abrupta, as indenizações por ativos não amortizados ficaram em disputa, parte das concessionárias — inclusive estaduais — recusou a prorrogação, e a queda de receita atingiu simultaneamente capacidade de investimento, valor de mercado e perfil de dívida das companhias afetadas, no exato momento em que a hidrologia piorava. A lição não é que reduzir tarifa seja errado; é que redução estrutural precisa ser compatível com investimento, risco, contrato e governança das empresas atingidas." },
  },
  {
    id: "m06-ex-06",
    kind: 'discursiva' as const,
    prompt: "",
    points: 1,
    config: { tag: "06 · O rateio como sistema fechado", gabarito: "Pergunta. Por que uma liminar que protege um único gerador produz inadimplência sistêmica na liquidação do mercado de curto prazo? Gabarito. Porque a liquidação é rateio, não caixa com fundo próprio: o que entra é o que sai. Quando um devedor é judicialmente dispensado de pagar, não há reserva dimensionada para absorver a diferença, e o valor faltante é rateado entre os credores, que recebem proporcionalmente menos do que lhes era devido. Esses credores ficam expostos, e alguns buscam a própria proteção judicial — o que amplia a parcela protegida no ciclo seguinte e aprofunda o corte para quem restou. A racionalidade individual produz o resultado coletivo pior. É o motivo pelo qual a saída não foi judicial, e sim legislativa: prêmio de risco em 2015, extensão de outorga condicionada à renúncia em 2020 e conversão dos passivos em títulos negociáveis a partir de 2025." },
  },
  {
    id: "m06-ex-07",
    kind: 'discursiva' as const,
    prompt: "",
    points: 1,
    config: { tag: "07 · Capitalização versus venda direta", gabarito: "Pergunta. Explique a diferença entre capitalização e venda direta de controle e diga por que, no caso de 2022, o percentual da União importa menos que outra coisa. Gabarito. Na venda direta, o acionista aliena ações existentes; o dinheiro vai para o vendedor e o controle é transferido a um comprador identificado. Na capitalização, a companhia emite ações novas e recebe o aporte; quem não acompanha a emissão é diluído. Em 2022 foi capitalização: a maior parte dos recursos entrou na companhia e a participação da União no capital votante caiu de cerca de 72% para cerca de 40%. O percentual, porém, é a variável menos decisiva — o que produz a ausência de controle é o limite de dez por cento de voto por acionista ou grupo, imposto por lei. Com esse teto, mesmo uma participação econômica relevante não confere poder de controle. Por isso qualquer número de participação decorado envelhece; o desenho de governança, não." },
  },
  {
    id: "m06-ex-08",
    kind: 'discursiva' as const,
    prompt: "",
    points: 1,
    config: { tag: "08 · O que muda e o que não muda com uma marca", gabarito: "Pergunta. Um analista júnior diz que a AXIA é \"uma empresa nova, sem o passivo da Eletrobras\". Desmonte em quatro pontos. Gabarito. Primeiro: rebranding não cria pessoa jurídica nova nem opera sucessão — é alteração de denominação e identidade, com continuidade societária integral. Segundo: concessões, contratos de concessão, obrigações regulatórias e compromissos assumidos na desestatização permanecem vinculados à mesma companhia. Terceiro: passivo contingente, inclusive judicial, permanece — mudar de nome não extingue processo. Quarto, e o mais relevante para análise: o histórico de cumprimento regulatório e operacional continua sendo o mesmo histórico, e é ele que informa expectativa sobre comportamento futuro. A separação correta é entre três eventos distintos — mudança de controle em 2022, mudança de marca em 2025 e mudança de regra setorial pela lei de 2025 —, que só coincidem no calendário." },
  },
  {
    id: "m06-ex-09",
    kind: 'discursiva' as const,
    prompt: "",
    points: 1,
    config: { tag: "09 · A escada da abertura", gabarito: "Pergunta. Uma unidade industrial em média tensão com 700 kW de demanda contratada. Em que momento ela ficou elegível ao mercado livre para energia convencional, e por quê? E uma padaria em baixa tensão? Gabarito. A unidade de 700 kW ficou elegível em 1º de janeiro de 2023, quando o limiar caiu para 500 kW pela Portaria MME nº 465/2019 — antes disso, com o limiar em 1.000 kW ao longo de 2022, ela estava fora para energia convencional, ainda que pudesse contratar fonte incentivada como consumidor especial. Depois, em 1º de janeiro de 2024, a Portaria Normativa nº 50/2022 tornou a questão irrelevante para ela, porque eliminou a exigência de carga mínima para todo o Grupo A. A padaria, em baixa tensão, não é elegível hoje: ela depende do cronograma legal da Lei nº 15.269/2025, com prazo até novembro de 2027 para consumidores comerciais e industriais de baixa tensão — sujeito a regulamentação e aos pré-requisitos operacionais previstos na própria lei." },
  },
  {
    id: "m06-ex-10",
    kind: 'discursiva' as const,
    prompt: "",
    points: 1,
    config: { tag: "10 · Trauma, cicatriz e risco novo", gabarito: "Pergunta. Escolha três traumas históricos e, para cada um, dê a cadeia completa: problema revelado, resposta institucional, cicatriz que ainda opera e risco novo que a resposta criou. Gabarito (uma composição possível). Primeiro, 2001: revelou que expansão sem dono produz erosão de margem; a resposta foi EPE, CMSE, obrigação de contratação antecipada e lastro; a cicatriz é a arquitetura de contratação de longo prazo que ainda organiza o ACR; o risco novo é erro de projeção de demanda transformado em sobrecontratação repassada à tarifa. Segundo, a crise dos anos 1980: revelou que tarifa administrada como âncora anti-inflacionária descapitaliza a empresa obrigada a expandir; a resposta foi o fim da remuneração garantida e da equalização em 1993, tarifa por concessão e agência reguladora; a cicatriz é a lógica de equilíbrio econômico-financeiro por concessão individual; o risco novo é a exposição das diferenças regionais de custo, com pressão política recorrente por mecanismos de compensação. Terceiro, 2015: revelou que fronteira contestável de risco vira litígio e que rateio sem fundo garantidor propaga inadimplência; a resposta foi repactuação em camadas sucessivas, culminando na conversão de passivos em títulos negociáveis; a cicatriz é a atenção redobrada, em qualquer contrato de energia, à definição precisa do que conta como cada risco; o risco novo é a criação de um precedente de renegociação retroativa, que altera a expectativa dos agentes sobre a estabilidade de alocações contratuais futuras." },
  },
];


export const MODULO_06_AULAS: CurriculumAula[] = [
  {
    id: 'aula-06-01',
    moduleId: 'modulo-06',
    number: 1,
    totalInModule: 6,
    title: "Antes do Estado",
    subtitle: "1879–1934",
    track: 'brasil',
    language: 'pt-BR',
    durationMinutes: null,
    difficulty: null,
    submercados: [],
    competencies: [],
    illustrations: ["his-01-usina-seculo-xix.png", "his-02-documento-codigo-aguas.png"],
    video: null,
    references: [],
    activities: [],
    instruments: [INSTRUMENTOS_MODULO_06[0]],
  },
  {
    id: 'aula-06-02',
    moduleId: 'modulo-06',
    number: 2,
    totalInModule: 6,
    title: "O Estado dono de tudo",
    subtitle: "1934–1988",
    track: 'brasil',
    language: 'pt-BR',
    durationMinutes: null,
    difficulty: null,
    submercados: [],
    competencies: [],
    illustrations: ["his-03-barragem-construcao.png"],
    video: null,
    references: [],
    activities: [],
    instruments: [INSTRUMENTOS_MODULO_06[1]],
  },
  {
    id: 'aula-06-03',
    moduleId: 'modulo-06',
    number: 3,
    totalInModule: 6,
    title: "A reforma inacabada e o trauma fundador",
    subtitle: "1988–2002",
    track: 'brasil',
    language: 'pt-BR',
    durationMinutes: null,
    difficulty: null,
    submercados: [],
    competencies: [],
    illustrations: ["his-04-jornal-apagao-2001.png", "his-05-lampada-apagada.png", "his-09-leilao-privatizacao.png"],
    video: null,
    references: [],
    activities: [],
    instruments: [INSTRUMENTOS_MODULO_06[2]],
  },
  {
    id: 'aula-06-04',
    moduleId: 'modulo-06',
    number: 4,
    totalInModule: 6,
    title: "A reconstrução deliberada",
    subtitle: "2003–2011",
    track: 'brasil',
    language: 'pt-BR',
    durationMinutes: null,
    difficulty: null,
    submercados: [],
    competencies: [],
    illustrations: ["his-06-documento-novo-modelo.png"],
    video: null,
    references: [],
    activities: [],
    instruments: [INSTRUMENTOS_MODULO_06[3]],
  },
  {
    id: 'aula-06-05',
    moduleId: 'modulo-06',
    number: 5,
    totalInModule: 6,
    title: "O modelo é testado de novo",
    subtitle: "2012–2021",
    track: 'brasil',
    language: 'pt-BR',
    durationMinutes: null,
    difficulty: null,
    submercados: [],
    competencies: [],
    illustrations: ["his-07-reservatorio-seco.png", "his-08-martelo-juiz.png"],
    video: null,
    references: [],
    activities: [],
    instruments: [INSTRUMENTOS_MODULO_06[4]],
  },
  {
    id: 'aula-06-06',
    moduleId: 'modulo-06',
    number: 6,
    totalInModule: 6,
    title: "Onde a história pousa hoje",
    subtitle: "2022–2028 · síntese",
    track: 'brasil',
    language: 'pt-BR',
    durationMinutes: null,
    difficulty: null,
    submercados: [],
    competencies: [],
    illustrations: ["his-10-porta-industrial-2024.png"],
    video: null,
    references: [],
    activities: [],
    instruments: [INSTRUMENTOS_MODULO_06[5], INSTRUMENTOS_MODULO_06[6]],
  },
];

export const getAulaModulo06 = (id: string): CurriculumAula | undefined =>
  MODULO_06_AULAS.find((a) => a.id === id);
