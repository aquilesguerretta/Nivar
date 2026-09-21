// alexandria-modulo-01-content.ts
// Conteúdo real do Módulo 01 — Física de Energia e Eletricidade.
//
// Extraído de `Alexandria modulos/alexandria_modulo01.html` por parsing
// determinístico, não por transcrição. O HTML tem 19 seções `.aula`; nove
// são aula real e dez são aparato (§ 00, § MAP, § Caso, § Lab, § Map,
// § Drill, § Quiz, § Final, § Lex, § Ref).
//
// O QUE A FONTE NÃO DECLARA — e por isso não está aqui:
//   · duração por aula     → `durationMinutes: null` nas nove. O hero
//                            declara 4-6 h para o MÓDULO; dividir por
//                            nove seria inventar.
//   · dificuldade por aula → `difficulty: null` nas nove.
//   · vídeo                → `video: null` nas nove. Não existe vídeo
//                            nenhum no HTML. Estado real, não lacuna.
//   · submercado, competência, gravura → arrays vazios. O Módulo 01 é
//                            física universal, sem recorte regional.
//   · referência por aula  → o § Ref é do módulo, não da aula.
//
// O corpo de texto vive em `MODULO_01_CORPO`, ao lado e não dentro de
// `CurriculumAula`: o contrato da FOUNDRY não tem campo de corpo, e
// acrescentar um não é estritamente necessário — dá para manter a aula
// conforme o contrato e o corpo ao lado. Candidato a `body` no contrato
// quando a FOUNDRY quiser.

import type { CurriculumAula, Instrument, LessonActivity } from '@/lib/types/alexandria';

/** Bloco de apostila. O vocabulário saiu de um levantamento dos elementos
 *  que realmente aparecem nas nove aulas — nenhuma categoria inventada. */
export type AulaBloco =
  | { kind: 'titulo'; numero: string | null; texto: string }
  | { kind: 'paragrafo'; html: string }
  | { kind: 'formula'; eq: string; desc: string | null }
  | { kind: 'nota'; tom: string; label: string | null; html: string }
  | { kind: 'lista'; itens: string[] }
  | { kind: 'tabela'; linhas: string[][] };

/** Os sete instrumentos: INST 01-06 dentro das aulas, LAB 01 no aparato
 *  § Lab. Campos, unidades, faixas e textos são literais do HTML. */
export const INSTRUMENTOS_MODULO_01: Instrument[] = [
{
    id: "inst-01",
    kind: "calculadora",
    title: "Calculadora · kWh = kW × h",
    formula: "kWh = kW × h",
    fields: [
      { id: "i01-kw", label: "Potência", unit: "kW", kind: "number", defaultValue: 10, min: 0, step: 0.5 },
      { id: "i01-h", label: "Tempo", unit: "h", kind: "number", defaultValue: 5, min: 0, step: 0.5 },
    ],
    outputs: [
      { id: "i01-out", label: "Energia consumida", unit: "kWh" },
    ],
    note: "Experimente comparar dois cenários: <b>50 kW × 1 h</b> e <b>1 kW × 50 h</b>. Mesmo kWh, perfis completamente diferentes. A primeira instalação exige rede para 50 kW de pico. A segunda, para 1 kW. <b>O kWh igual mascara que são problemas de engenharia opostos.</b>",
  },
  {
    id: "inst-02",
    kind: "calculadora",
    title: "Calculadora · Lei de Ohm",
    formula: "V = I × R",
    fields: [
      { id: "i02-v", label: "Tensão", unit: "V", kind: "number", defaultValue: '' },
      { id: "i02-i", label: "Corrente", unit: "A", kind: "number", defaultValue: '' },
      { id: "i02-r", label: "Resistência", unit: "Ω", kind: "number", defaultValue: '' },
    ],
    outputs: [
      { id: "i02-status", label: "Status", unit: null },
    ],
    note: "Em <b>220 V × 10 A</b>, a potência aproximada é 2.200 W = 2,2 kW</span>. Ligando por 5 horas: 11 kWh</span>. Essa cadeia <i>V × A → W → kW → kWh × tarifa = R$</i> é a espinha física da fatura elétrica.",
  },
  {
    id: "inst-03",
    kind: "calculadora",
    title: "Calculadora · Perdas resistivas",
    formula: "P = I² × R",
    fields: [
      { id: "i03-i", label: "Corrente", unit: "A", kind: "range", defaultValue: 100, min: 10, max: 500, step: 5 },
      { id: "i03-r", label: "Resistência", unit: "Ω", kind: "range", defaultValue: 0.5, min: 0.1, max: 5, step: 0.1 },
    ],
    outputs: [
      { id: "i03-out", label: "Perda dissipada", unit: "W" },
    ],
    note: "Dobre a corrente. Veja a perda <b>quadruplicar</b>. Esse comportamento exponencial é a razão por que transmissão de energia em escala continental usa alta tensão.",
  },
  {
    id: "inst-04",
    kind: "calculadora",
    title: "Calculadora · Demanda média e fator de carga",
    formula: "FC = P média ÷ P máxima",
    fields: [
      { id: "i04-kwh", label: "Consumo mensal", unit: "kWh", kind: "number", defaultValue: 144000, min: 0, step: 1000 },
      { id: "i04-h", label: "Horas do período", unit: "h", kind: "number", defaultValue: 720, min: 0, step: 24 },
      { id: "i04-pmax", label: "Demanda máxima", unit: "kW", kind: "number", defaultValue: 800, min: 0, step: 50 },
    ],
    outputs: [
      { id: "i04-pmed", label: "Demanda média", unit: "kW" },
      { id: "i04-fc", label: "Fator de carga", unit: null },
      { id: "i04-fcp", label: "Fator de carga (%)", unit: "%" },
    ],
    note: "<b>Fator de carga baixo: muitos picos altos em relação ao uso médio. Pode indicar partidas simultâneas, operação concentrada em poucas horas ou demanda mal dimensionada — investigar antes de recomendar mudança contratual.</b>",
  },
  {
    id: "inst-05",
    kind: "controles",
    title: "Controles · Triângulo de potência",
    formula: null,
    fields: [
      { id: "i05-kw", label: "Potência ativa", unit: "kW", kind: "range", defaultValue: 800, min: 100, max: 1500, step: 10 },
      { id: "i05-kvar", label: "Potência reativa", unit: "kVAr", kind: "range", defaultValue: 480, min: 0, max: 1200, step: 10 },
    ],
    outputs: [

    ],
    note: "Reduza a potência reativa e veja o fator de potência subir. Esse é o efeito esperado de um banco de capacitores bem dimensionado: <b>menos kVAr → mais FP → menos cobrança regulatória → menos kVA exigido da rede</b>.",
  },
  {
    id: "inst-06",
    kind: "calculadora",
    title: "Calculadora · Fator de capacidade",
    formula: "FC = geração ÷ (capacidade × horas)",
    fields: [
      { id: "i06-cap", label: "Capacidade instalada", unit: "MW", kind: "number", defaultValue: 100, min: 0, step: 10 },
      { id: "i06-gen", label: "Geração no período", unit: "MWh", kind: "number", defaultValue: 220000, min: 0, step: 1000 },
      { id: "i06-h", label: "Horas do período", unit: "h", kind: "number", defaultValue: 8760, min: 0, step: 24 },
    ],
    outputs: [
      { id: "i06-fc", label: "Fator de capacidade", unit: "%" },
    ],
    note: "<b>Faixa típica de usina solar fotovoltaica em latitudes brasileiras. Compare com FCs típicos abaixo.</b>",
  },
  {
    id: "lab-01",
    kind: "laboratorio",
    title: "Laboratório · Comparador de perfil elétrico",
    formula: null,
    fields: [
      { id: "lab-kwh", label: "Consumo mensal · ambas", unit: "kWh", kind: "number", defaultValue: 100000, min: 10000, step: 5000 },
      { id: "lab-tarifa", label: "Tarifa energia média", unit: "R$/MWh", kind: "number", defaultValue: 450, min: 100, step: 10 },
      { id: "lab-a-dem", label: "Fábrica A · Demanda máxima", unit: "kW", kind: "range", defaultValue: 250, min: 100, max: 800, step: 10 },
      { id: "lab-a-fp", label: "Fábrica A · Fator de potência", unit: null, kind: "range", defaultValue: 0.96, min: 0.7, max: 1, step: 0.01 },
      { id: "lab-a-ponta", label: "Fábrica A · Consumo em horário de ponta", unit: "%", kind: "range", defaultValue: 5, min: 0, max: 50, step: 1 },
      { id: "lab-b-dem", label: "Fábrica B · Demanda máxima", unit: "kW", kind: "range", defaultValue: 600, min: 100, max: 1500, step: 10 },
      { id: "lab-b-fp", label: "Fábrica B · Fator de potência", unit: null, kind: "range", defaultValue: 0.84, min: 0.7, max: 1, step: 0.01 },
      { id: "lab-b-ponta", label: "Fábrica B · Consumo em horário de ponta", unit: "%", kind: "range", defaultValue: 25, min: 0, max: 50, step: 1 },
    ],
    outputs: [
      { id: "lab-a-energia", label: "Fábrica A · Energia", unit: "R$" },
      { id: "lab-a-demanda", label: "Fábrica A · Demanda", unit: "R$" },
      { id: "lab-a-reativo", label: "Fábrica A · Reativo excedente", unit: "R$" },
      { id: "lab-a-adicponta", label: "Fábrica A · Adicional ponta", unit: "R$" },
      { id: "lab-b-energia", label: "Fábrica B · Energia", unit: "R$" },
      { id: "lab-b-demanda", label: "Fábrica B · Demanda", unit: "R$" },
      { id: "lab-b-reativo", label: "Fábrica B · Reativo excedente", unit: "R$" },
      { id: "lab-b-adicponta", label: "Fábrica B · Adicional ponta", unit: "R$" },
      { id: "lab-a-total", label: "Fábrica A · Fatura estimada", unit: "R$" },
      { id: "lab-b-total", label: "Fábrica B · Fatura estimada", unit: "R$" },
    ],
    note: "<b>Atenção · simulação didática.</b> Os valores acima usam coeficientes simplificados para fins pedagógicos. Tarifas reais dependem de modalidade (verde/azul), grupo tarifário, distribuidora, bandeira tarifária, encargos e tributos. <b>Não use este simulador como cálculo financeiro de cliente</b> — apenas para internalizar como o perfil elétrico move a fatura. Em um relatório Conta de Luz Express real, a fatura é decomposta linha por linha com base no documento fiscal efetivo.",
  },
];

/** Parágrafo de abertura de cada aula (`p.lead` na fonte). */
export const MODULO_01_LEAD: Record<string, string> = {
'aula-01-01': "Se você dominar uma distinção neste módulo, que seja essa. O erro de tratar kW e kWh como sinônimos é a primeira fluência que separa quem entende setor elétrico de quem só fala sobre ele.",
  'aula-01-02': "V, A, W, kW, kWh, kVA, kVAr. Quem domina essas sete unidades e a relação entre elas consegue ler qualquer fatura industrial brasileira sem precisar perguntar o que cada linha significa.",
  'aula-01-03': "A rede elétrica brasileira oscila sessenta vezes por segundo. Esse ritmo não é arbitrário — é a evidência física de que oferta e demanda estão em equilíbrio em tempo real. Entender frequência é entender por que existe o ONS.",
  'aula-01-04': "Toda a arquitetura física do sistema elétrico brasileiro — alta tensão na transmissão, média tensão na distribuição, baixa tensão no consumidor — existe porque perdas resistivas crescem com o quadrado da corrente. Sem essa lei, nenhuma rede de país continental seria viável.",
  'aula-01-05': "A segunda fluência que separa analista credível de iniciante: entender que demanda não é uma cobrança esotérica nem um truque tarifário. É a tradução econômica de uma realidade física da rede.",
  'aula-01-06': "No Brasil, tensão não é apenas um parâmetro técnico. É o eixo central de classificação tarifária. Saber em que nível de tensão um cliente é atendido é saber, imediatamente, qual estrutura de fatura ele recebe.",
  'aula-01-07': "Esta aula é o coração técnico do módulo. Fator de potência é, simultaneamente, um conceito físico, um indicador de eficiência elétrica e uma linha real de cobrança em fatura industrial. Quem domina os três aspectos lê qualquer fatura do Grupo A sem hesitar.",
  'aula-01-08': "Comparar fontes de geração apenas por capacidade instalada é o erro de leitor casual da matriz elétrica. Para análise séria, o que importa é o fator de capacidade — quanto a usina <em>efetivamente</em> entrega ao longo do tempo.",
  'aula-01-09': "Qualidade de energia é tema técnico cuja consequência é financeira. Tensão fora da faixa, harmônicos, afundamentos, interrupções — qualquer um deles pode parar uma linha de produção, danificar equipamento, encurtar vida útil de motor. Para o gestor industrial, qualidade é custo operacional.",
};

/** Corpo de texto — a apostila. */
export const MODULO_01_CORPO: Record<string, AulaBloco[]> = {
'aula-01-01': [
    { kind: 'titulo', numero: "1.1", texto: "Energia, primeiro" },
    { kind: 'paragrafo', html: "Energia é a capacidade de realizar trabalho ou produzir transformação. Quando algo se move, esquenta, ilumina, gira, bombeia, comprime, levanta, resfria, funde, corta ou transporta, há energia envolvida. A gasolina no tanque tem energia química. A água em uma represa tem energia potencial gravitacional. O vento tem energia cinética. Um forno industrial usa energia térmica. Um motor elétrico transforma energia elétrica em movimento." },
    { kind: 'paragrafo', html: "Eletricidade é apenas <strong>uma das formas</strong> de energia — a forma que predomina em redes públicas de transmissão e distribuição. Mas pensar em energia apenas como eletricidade é estreitar demais a análise. Quando uma indústria brasileira decide entre rede e cogeração a gás, está decidindo entre formas diferentes de energia para o mesmo trabalho útil." },
    { kind: 'nota', tom: "neutro", label: null, html: "Princípio físico subjacente" },
    { kind: 'paragrafo', html: "Energia não é criada nem destruída — apenas transformada. Uma hidrelétrica não \"cria\" energia; transforma energia potencial gravitacional da água em energia cinética na turbina e em energia elétrica no gerador. Cada transformação tem perda. Cada perda tem custo. <strong>O problema econômico do setor elétrico nasce exatamente das perdas e custos de cada transformação física.</strong>" },
    { kind: 'titulo', numero: "1.2", texto: "Potência é a taxa" },
    { kind: 'paragrafo', html: "Potência é a velocidade com que energia é usada, gerada ou transformada. Energia responde \"quanto foi usado no total?\". Potência responde \"com que ritmo está sendo usado agora?\"." },
    { kind: 'paragrafo', html: "A analogia mais útil é a torneira enchendo uma caixa d'água:" },
    { kind: 'tabela', linhas: [["Analogia hidráulica","Equivalente elétrico","O que mede"],["Vazão da torneira (L/s)","<b>Potência</b> (kW)","Quanto fluxo neste instante"],["Volume na caixa (L)","<b>Energia</b> (kWh)","Quanto se acumulou no tempo"],["Pressão da água","<b>Tensão</b> (V)","A \"força\" que empurra"],["Diâmetro do cano","<b>Corrente</b> (A)","Quanta carga atravessa"]] },
    { kind: 'paragrafo', html: "Uma torneira muito forte por dois minutos enche pouco volume — alta potência, baixa energia. Uma torneira fraca aberta por oito horas enche bastante volume — baixa potência, alta energia. <strong>Volume e velocidade não são a mesma grandeza.</strong>" },
    { kind: 'titulo', numero: "1.3", texto: "A cadeia de unidades" },
    { kind: 'tabela', linhas: [["Unidade","Significa","Escala típica"],["<b>W</b>","watt — unidade base de potência","Lâmpada LED ≈ 9 W"],["<b>kW</b>","1.000 W — potência residencial e comercial","Chuveiro elétrico ≈ 5,5 kW"],["<b>MW</b>","1.000 kW — escala industrial e sistêmica","Britador de mineração ≈ 2 MW"],["<b>GW</b>","1.000 MW — escala nacional","Itaipu ≈ 14 GW de capacidade"],["<b>kWh</b>","energia: 1 kW durante 1 hora","Geladeira/mês ≈ 40 kWh"],["<b>MWh</b>","1.000 kWh — escala industrial","Cimenteira/mês ≈ 5.000 MWh"],["<b>GWh / TWh</b>","escala de matriz nacional","Brasil consome ≈ 530 TWh/ano"]] },
    { kind: 'titulo', numero: "1.4", texto: "A fórmula que conecta tudo" },
    { kind: 'formula', eq: "Energia = Potência × Tempo", desc: null },
    { kind: 'paragrafo', html: "Um motor de 10 kW</span> ligado por 5 horas</span> consome 50 kWh</span>. Um equipamento de 2 kW</span> ligado por 10 horas</span> consome 20 kWh</span>. A multiplicação é trivial. O que não é trivial é resistir à tentação de tratá-las como intercambiáveis. Pratique abaixo." },
    { kind: 'titulo', numero: "1.5", texto: "O erro fatal: confundir kW com kWh" },
    { kind: 'nota', tom: "red", label: null, html: "Erro de fluência" },
    { kind: 'paragrafo', html: "<strong>\"Essa usina gerou 100 MW no mês.\"</strong> Errado. MW mede potência, não energia. O correto é: \"a usina tem capacidade de 100 MW\" ou \"a usina gerou 30.000 MWh no mês\"." },
    { kind: 'titulo', numero: "1.6", texto: "O conceito em três níveis" },
    { kind: 'nota', tom: "neutro", label: null, html: "Onde isso entra no produto" },
    { kind: 'paragrafo', html: "No <strong>Conta de Luz Express</strong>, a primeira checagem ao receber uma fatura é separar cobrança por demanda de cobrança por consumo. Se o cliente diz \"minha conta subiu\", a próxima pergunta deve ser estruturada: subiu por kWh, por kW, por horário, por bandeira, por reativo, por imposto, ou por reajuste? <strong>Sem essa separação, você não está analisando conta — está lendo boleto.</strong>" },
  ],
  'aula-01-02': [
    { kind: 'titulo', numero: "2.1", texto: "Volt — a \"pressão\" do circuito" },
    { kind: 'paragrafo', html: "Volt (V) mede <strong>tensão elétrica</strong>: a diferença de potencial que empurra a corrente pelo condutor. Na analogia da torneira, tensão é a pressão da água. Um valor de tensão maior empurra carga por circuitos com mais resistência." },
    { kind: 'paragrafo', html: "No Brasil, você verá tensões em escalas muito diferentes ao longo da cadeia elétrica:" },
    { kind: 'tabela', linhas: [["Tensão","Onde aparece","Quem consome"],["127 / 220 V","Baixa tensão residencial e comercial","Casas, lojas, pequenos comércios"],["220 / 380 / 440 V","Baixa tensão trifásica","Pequenas indústrias e cargas comerciais"],["13,8 kV","Distribuição em média tensão","Grandes comércios e indústrias médias <b>(Grupo A4)</b>"],["23 / 34,5 kV","Distribuição média tensão expandida","Indústrias maiores <b>(A4 / A3a)</b>"],["69 kV","Subtransmissão","Grandes consumidores industriais <b>(A3)</b>"],["88 / 138 kV","Subtransmissão de alta capacidade","Indústrias muito grandes <b>(A2)</b>"],["230 kV +","Transmissão de alta tensão","Indústrias eletrointensivas <b>(A1)</b>"]] },
    { kind: 'titulo', numero: "2.2", texto: "Ampere — o fluxo de carga" },
    { kind: 'paragrafo', html: "Ampere (A) mede <strong>corrente elétrica</strong>: o fluxo de carga elétrica passando pelo condutor por segundo. Se tensão é pressão, corrente é vazão. Cargas grandes — motores industriais, britadores, fornos — puxam mais corrente, especialmente em tensões mais baixas." },
    { kind: 'titulo', numero: "2.3", texto: "Watt — a potência ativa" },
    { kind: 'paragrafo', html: "Watt (W) mede <strong>potência</strong>. Em corrente contínua (e como aproximação inicial em corrente alternada), a relação é direta:" },
    { kind: 'formula', eq: "P (W) = V (volts) × I (amperes)", desc: null },
    { kind: 'titulo', numero: "2.4", texto: "Lei de Ohm — a relação fundamental" },
    { kind: 'paragrafo', html: "Em qualquer circuito elétrico, três grandezas se relacionam de forma rígida: tensão, corrente e <strong>resistência</strong> (R, medida em ohms, Ω). A Lei de Ohm é uma das peças mais elementares de toda a engenharia elétrica:" },
    { kind: 'formula', eq: "V = I × R", desc: null },
    { kind: 'paragrafo', html: "Resistência é a oposição que o material oferece à passagem de carga. Todo cabo, conexão, motor e equipamento tem resistência. <strong>Resistência não é maldade física — é consequência da matéria.</strong> Mas, como veremos na Aula 04, resistência multiplicada por corrente ao quadrado é exatamente onde nascem as perdas técnicas do sistema elétrico." },
    { kind: 'titulo', numero: "2.5", texto: "kVA e kVAr — quando a rede vê mais do que trabalho útil" },
    { kind: 'paragrafo', html: "Em corrente alternada (que é o padrão da rede pública), a história é mais sutil. Nem toda potência que circula entre rede e instalação se converte em trabalho útil. Em equipamentos indutivos — motores, transformadores, compressores — parte da potência <strong>oscila</strong> para sustentar campos eletromagnéticos sem realizar trabalho mecânico no eixo da máquina." },
    { kind: 'tabela', linhas: [["Grandeza","Unidade","Função"],["<b>Potência ativa</b>","kW","Realiza trabalho útil (gira eixo, esquenta forno, aciona esteira)"],["<b>Potência reativa</b>","kVAr","Sustenta campos magnéticos em motores e transformadores"],["<b>Potência aparente</b>","kVA","Total que a rede precisa entregar (combinação vetorial de ativa e reativa)"]] },
    { kind: 'paragrafo', html: "Essas três grandezas formam um <strong>triângulo retângulo</strong>: kW e kVAr são os catetos, kVA é a hipotenusa. Veremos isso em profundidade na Aula 07, onde toda a lógica do fator de potência fica explícita. Por enquanto, basta fixar: kW é o que vira produção; kVAr ocupa a rede sem virar produção; kVA é o que a rede precisa dimensionar." },
  ],
  'aula-01-03': [
    { kind: 'titulo', numero: "3.1", texto: "DC: o fluxo constante" },
    { kind: 'paragrafo', html: "<strong>Corrente contínua (DC)</strong> tem fluxo em uma direção principal constante. É o que existe dentro de baterias, pilhas, painéis solares antes do inversor e na maioria da eletrônica interna de equipamentos. Polaridade fixa: positivo e negativo. Sinal \"reto\" no osciloscópio." },
    { kind: 'titulo', numero: "3.2", texto: "AC: o fluxo que oscila" },
    { kind: 'paragrafo', html: "<strong>Corrente alternada (AC)</strong> tem fluxo cujo sentido alterna periodicamente. No Brasil, a alternância ocorre <strong>60 vezes por segundo</strong> — frequência de 60 Hz</span>. Sinal senoidal no osciloscópio." },
    { kind: 'titulo', numero: "3.3", texto: "Por que AC venceu historicamente" },
    { kind: 'paragrafo', html: "Na chamada Guerra das Correntes do final do século XIX (Westinghouse/Tesla pela AC vs. Edison pela DC), a corrente alternada venceu por uma razão técnica decisiva: <strong>com AC é simples elevar e reduzir tensão usando transformadores</strong>. Em DC, o equivalente é tecnologicamente muito mais caro e complexo." },
    { kind: 'paragrafo', html: "Essa habilidade de mudar de tensão é o que torna possível transmitir energia em alta tensão por centenas de quilômetros e depois entregá-la em baixa tensão para a casa do consumidor. <strong>Sem transformadores, a rede elétrica moderna não existiria nesta escala.</strong>" },
    { kind: 'paragrafo', html: "DC volta com força hoje em aplicações específicas: solar fotovoltaica, armazenamento em baterias, eletrônica embarcada, e transmissão HVDC em interligações de longa distância (como o sistema de transmissão de Belo Monte para o Sudeste, que usa elos de corrente contínua)." },
    { kind: 'titulo', numero: "3.4", texto: "Frequência: o termômetro do equilíbrio" },
    { kind: 'paragrafo', html: "A regra física que governa todo sistema interligado em corrente alternada é simples e absoluta:" },
    { kind: 'formula', eq: "Geração ≈ Consumo, em tempo real", desc: null },
    { kind: 'paragrafo', html: "Se o consumo aumenta e a geração não acompanha, a frequência da rede <strong>cai</strong>. Se a geração supera o consumo, a frequência <strong>sobe</strong>. Não há buffer físico: a eletricidade que entra na rede precisa ser consumida no mesmo instante. Por isso a frequência funciona como o batimento cardíaco do sistema — qualquer descompasso é imediatamente visível, e operadores como o <strong>ONS (Operador Nacional do Sistema Elétrico)</strong> existem para manter esse batimento dentro de faixas seguras." },
    { kind: 'nota', tom: "gold", label: null, html: "Conexão com o Bloco 02 (próximo módulo)" },
    { kind: 'paragrafo', html: "O ONS não \"organiza energia\" como quem organiza planilha. Coordena um sistema físico que precisa equilibrar oferta e demanda 86.400 vezes por dia — uma vez por segundo, todos os segundos. Quando estudarmos despacho, reservas operacionais e CMO no próximo módulo, a frequência será o sinal que justifica cada decisão." },
    { kind: 'titulo', numero: "3.5", texto: "Por que isso afeta o consumidor industrial" },
    { kind: 'paragrafo', html: "Quedas ou desvios relevantes de frequência afetam diretamente equipamentos sensíveis: motores síncronos perdem sincronismo, drives de velocidade variável desarmam por proteção, sistemas de controle de processo travam. Mesmo que o consumidor final raramente veja a frequência na fatura, ela está por trás de toda a confiabilidade do fornecimento. Quando estudarmos qualidade de energia na Aula 09, voltaremos a este ponto." },
  ],
  'aula-01-04': [
    { kind: 'titulo', numero: "4.1", texto: "De onde vem a perda" },
    { kind: 'paragrafo', html: "Quando corrente elétrica passa por um condutor com resistência, parte da energia elétrica se transforma em <strong>calor</strong>. Isso é dissipação resistiva — o famoso \"efeito Joule\". A fórmula é uma das mais consequentes de toda a engenharia elétrica:" },
    { kind: 'formula', eq: "P perdas = I 2 × R", desc: null },
    { kind: 'paragrafo', html: "O exponencial é o que muda tudo. Se a corrente <strong>dobra</strong>, as perdas <strong>quadruplicam</strong>. Se a corrente triplica, as perdas crescem nove vezes. Veja:" },
    { kind: 'titulo', numero: "4.2", texto: "A solução: trocar corrente por tensão" },
    { kind: 'paragrafo', html: "Para transmitir a mesma potência (P = V × I), você pode escolher: usar tensão alta com corrente baixa, ou tensão baixa com corrente alta. Como perdas dependem de I² × R, a primeira opção dissipa drasticamente menos energia ao longo dos cabos. Por isso:" },
    { kind: 'nota', tom: "neutro", label: null, html: "Por que isso aparece na sua fatura" },
    { kind: 'paragrafo', html: "A componente <strong>TUSD-fio</strong> da tarifa cobre os custos de uso do sistema de distribuição — incluindo as <em>perdas técnicas</em> previstas no fluxo até o consumidor. Quando a ANEEL revisa periodicamente as tarifas das distribuidoras, uma das variáveis revisadas é justamente o nível regulatório de perdas técnicas reconhecido. Quem opera em alta tensão (Grupo A1, A2) paga menos perdas embutidas que quem opera em baixa tensão, porque está fisicamente mais próximo da geração e atravessa menos camadas de rede." },
    { kind: 'titulo', numero: "4.3", texto: "Perdas técnicas vs. perdas não técnicas" },
    { kind: 'tabela', linhas: [["Tipo","Origem","Tratamento regulatório"],["<b>Técnicas</b>","Físicas — aquecimento de cabos, perdas em transformadores, perdas magnéticas, perdas mecânicas","Reconhecidas pela ANEEL nos processos de revisão tarifária; embutidas na TUSD"],["<b>Não técnicas</b>","Comerciais — furto de energia, fraude no medidor, inadimplência, erro de medição","Parcela controvertida; afetam tarifas via ressarcimento parcial reconhecido em revisão"]] },
    { kind: 'paragrafo', html: "Para o analista, essa distinção importa porque <strong>perdas não técnicas concentradas em áreas urbanas brasileiras</strong> (especialmente Norte e Nordeste) são uma das razões pelas quais tarifas locais sobem ao longo dos anos, mesmo quando o custo da energia em si está estável. Quando um cliente em Manaus reclama da fatura, parte do que ele paga é a externalidade de um sistema de distribuição com altas perdas comerciais." },
  ],
  'aula-01-05': [
    { kind: 'titulo', numero: "5.1", texto: "Consumo é volume. Demanda é dimensão da rede." },
    { kind: 'paragrafo', html: "Imagine uma estrada que liga uma fábrica a um centro logístico. Se a fábrica trabalha em ritmo constante, basta uma estrada de tamanho moderado. Se a fábrica concentra toda a operação em um turno de quatro horas — descarrega tudo, depois fica vazia — a estrada precisa ser dimensionada para o <strong>pico</strong>, não para a média. Mesmo que ela passe a maior parte do tempo subutilizada." },
    { kind: 'paragrafo', html: "Na rede elétrica, a lógica é idêntica. A distribuidora precisa ter transformadores, cabos, subestações e proteção dimensionados para o <strong>pior momento simultâneo</strong> em que todos os clientes daquela rede puxam energia. Essa infraestrutura tem custo fixo: existe e custa, mesmo se a fábrica usar pouco." },
    { kind: 'paragrafo', html: "<strong>Demanda</strong> é a cobrança por essa capacidade reservada da rede." },
    { kind: 'titulo', numero: "5.2", texto: "Os três conceitos de demanda" },
    { kind: 'tabela', linhas: [["Conceito","O que significa","Como é cobrado"],["<b>Demanda contratada</b>","Capacidade em kW que a empresa contrata junto à distribuidora","Cobrada integralmente, mesmo se a empresa não usar"],["<b>Demanda medida</b>","Maior demanda efetivamente registrada no intervalo de medição (tipicamente 15 minutos integralizados) no período de faturamento","Compara-se com a contratada para determinar enquadramento"],["<b>Demanda de ultrapassagem</b>","Parcela da demanda medida que excede a contratada, observada tolerância regulatória","Pode ser tarifada em valor superior, conforme regras vigentes"]] },
    { kind: 'nota', tom: "red", label: null, html: "Atenção · regras de ultrapassagem" },
    { kind: 'paragrafo', html: "Os detalhes operacionais e contratuais de ultrapassagem de demanda dependem da modalidade tarifária, da tensão de fornecimento, da distribuidora e das regras regulatórias vigentes (atualmente <strong>Resolução Normativa ANEEL nº 1.000/2021</strong>, que substituiu a REN 414/2010 a partir de janeiro de 2022). Antes de transformar qualquer recomendação de redução de demanda em recomendação financeira, valide a regra específica aplicável ao contrato. Esta é uma trava operacional da GridAlpha." },
    { kind: 'titulo', numero: "5.3", texto: "Demanda média e fator de carga" },
    { kind: 'paragrafo', html: "Demanda média é uma construção: o consumo total do período dividido pelas horas do período. Não é uma medição real, mas uma média virtual que ajuda a comparar com a demanda máxima medida." },
    { kind: 'paragrafo', html: "Fator de carga é a razão entre demanda média e demanda máxima. Ele mede <strong>quão bem a instalação aproveita a capacidade que paga</strong>:" },
    { kind: 'titulo', numero: "5.4", texto: "Como ler o fator de carga" },
    { kind: 'tabela', linhas: [["FC","Perfil típico","Implicação"],["0,70 – 0,90","Operação contínua, carga estável (24/7)","Bom aproveitamento — pouca oportunidade em ajuste de demanda"],["0,40 – 0,70","Operação em turnos, sazonalidade moderada","Possível oportunidade em gestão de carga, a validar com 12 meses"],["0,15 – 0,40","Picos altos, operação concentrada, partidas simultâneas","Investigação operacional necessária antes de qualquer mudança contratual"],["< 0,15","Padrão raro — pode indicar erro de medição ou contratação superdimensionada","Auditoria de medição e revisão completa"]] },
    { kind: 'nota', tom: "neutro", label: null, html: "Onde isso entra no produto" },
    { kind: 'paragrafo', html: "No <strong>Conta de Luz Express</strong>, demanda é um dos primeiros campos do relatório. O output deve sempre informar: demanda contratada, demanda medida, diferença, existência de ultrapassagem, histórico necessário antes de recomendar alteração, e risco operacional de reduzir demanda sem entender expansão e sazonalidade. Linguagem segura: <em>\"há possível oportunidade de ajuste de demanda contratada, a validar com 12 meses de histórico e entendimento operacional\"</em>. Nunca: \"você pode reduzir e economizar X reais\". Promessa sem validação fere a Trava 4 do War Room." },
  ],
  'aula-01-06': [
    { kind: 'titulo', numero: "6.1", texto: "Grupo A e Grupo B — a divisão fundamental" },
    { kind: 'paragrafo', html: "A regulação brasileira divide consumidores em dois grandes grupos, com base na tensão de fornecimento:" },
    { kind: 'tabela', linhas: [["Grupo","Tensão de fornecimento","Quem é"],["<b>Grupo B</b>","Baixa tensão (< 2,3 kV)","Residências, pequenos comércios, pequenas propriedades rurais"],["<b>Grupo A</b>","Alta e média tensão (≥ 2,3 kV)","Indústrias, grandes comércios, grandes consumidores"]] },
    { kind: 'paragrafo', html: "A diferença entre os grupos não é cosmética. Grupo B paga uma tarifa simples (essencialmente: kWh × tarifa). Grupo A paga uma estrutura tarifária binômia: <strong>uma componente para consumo (kWh)</strong> e <strong>outra para demanda (kW)</strong>. Toda a complexidade analítica da Alexandria nasce aí." },
    { kind: 'titulo', numero: "6.2", texto: "Os subgrupos do Grupo A" },
    { kind: 'tabela', linhas: [["Subgrupo","Tensão","Perfil típico"],["<b>A1</b>","≥ 230 kV","Indústrias eletrointensivas (alumínio, siderurgia, eletroquímica)"],["<b>A2</b>","88 a 138 kV","Grandes indústrias e parques industriais"],["<b>A3</b>","69 kV","Indústrias de grande porte"],["<b>A3a</b>","30 a 44 kV","Indústrias médias e grandes"],["<b>A4</b>","2,3 a 25 kV","Indústrias médias e grandes comércios — <strong>onde concentra a maioria do mercado livre potencial</strong>"],["<b>AS</b>","< 2,3 kV (subterrâneo)","Centros urbanos com rede subterrânea"]] },
    { kind: 'paragrafo', html: "Para fins de prospecção da GridAlpha no Brasil, o <strong>Grupo A4 é o terreno mais fértil</strong>: grande volume de consumidores, complexidade tarifária suficiente para gerar diagnóstico relevante, e ainda não atendido por consultorias premium que se concentram em A1/A2. Quando você falar com diretor de energia de mineradora média em Minas Gerais, A4 é provavelmente o subgrupo dele." },
    { kind: 'titulo', numero: "6.3", texto: "Por que tensão maior implica tarifa menor (em geral)" },
    { kind: 'paragrafo', html: "Quanto mais alta a tensão de fornecimento, mais próximo o consumidor está fisicamente da geração e da transmissão troncal, e menos camadas de rede ele atravessa. Logo:" },
    { kind: 'paragrafo', html: "Um cliente A1 (em 230 kV) paga, em geral, tarifa total menor que um A4 (em 13,8 kV) para o mesmo kWh — exatamente porque o A1 está usando muito menos infraestrutura de rede." },
    { kind: 'titulo', numero: "6.4", texto: "Monofásico, bifásico e trifásico" },
    { kind: 'paragrafo', html: "Além do nível de tensão, o número de fases do fornecimento importa. Em corrente alternada, fases são a forma de organizar a entrega:" },
    { kind: 'tabela', linhas: [["Sistema","Onde aparece","Limitação típica"],["<b>Monofásico</b>","Residências simples, pequenos comércios","Cargas pequenas (≤ ~10 kW), sem motores grandes"],["<b>Bifásico</b>","Residências e comércios com carga acima do monofásico, dependendo da distribuidora","Limites regionais variam"],["<b>Trifásico</b>","Padrão industrial; comércios médios e grandes; motores trifásicos","Padrão acima de ~15 kW"]] },
    { kind: 'paragrafo', html: "Motores trifásicos são mais eficientes, mais estáveis e mais adequados para cargas industriais. Praticamente toda a operação industrial relevante no Brasil — mineração, manufatura, agroindústria, data center, refrigeração comercial — opera em fornecimento trifásico." },
  ],
  'aula-01-07': [
    { kind: 'titulo', numero: "7.1", texto: "Por que existe potência reativa" },
    { kind: 'paragrafo', html: "Em equipamentos puramente resistivos — uma resistência de chuveiro, uma lâmpada incandescente — a corrente está perfeitamente em fase com a tensão. Toda a potência elétrica entregue vira trabalho útil (calor, luz). Toda potência aparente é potência ativa." },
    { kind: 'paragrafo', html: "Em equipamentos <strong>indutivos</strong> — motores, transformadores, compressores, fornos a arco, bobinas de solda — algo diferente acontece. Esses equipamentos precisam de <strong>campos magnéticos</strong> para funcionar. A criação e sustentação desses campos exige que a corrente fique levemente \"atrasada\" em relação à tensão. Quando isso acontece, parte da potência que circula entre a rede e a instalação não realiza trabalho útil no eixo da máquina — apenas oscila entre rede e equipamento, sustentando o campo magnético." },
    { kind: 'paragrafo', html: "Essa parcela é a <strong>potência reativa (kVAr)</strong>. Ela é necessária para a operação, mas <strong>não vira produção</strong>." },
    { kind: 'titulo', numero: "7.2", texto: "O triângulo de potência" },
    { kind: 'paragrafo', html: "As três potências formam um triângulo retângulo:" },
    { kind: 'titulo', numero: "7.3", texto: "A fórmula do fator de potência" },
    { kind: 'formula', eq: "FP = kW ÷ kVA = cos φ", desc: null },
    { kind: 'paragrafo', html: "Um FP de <strong>1,00</strong> significa que toda a potência aparente está virando potência ativa — instalação puramente resistiva, sem reativo. Um FP de <strong>0,85</strong> significa que apenas 85% da potência aparente vira trabalho útil; os outros 15% são reativos circulando pela rede. FP baixo é ineficiência elétrica visível para a rede." },
    { kind: 'titulo', numero: "7.4", texto: "Por que isso vira cobrança regulatória" },
    { kind: 'paragrafo', html: "Quando uma instalação industrial opera com FP baixo, ela força a distribuidora a entregar mais kVA para produzir o mesmo kW útil. Isso ocupa capacidade de transformadores, cabos e proteção, além de aumentar perdas — externalidades que afetam todos os outros clientes daquela rede." },
    { kind: 'paragrafo', html: "Para combater isso, a regulação brasileira estabelece um <strong>fator de potência mínimo de referência de 0,92</strong> para unidades do Grupo A, tanto no comportamento indutivo quanto no capacitivo. Quando o consumidor opera abaixo desse limite, pode haver cobrança adicional sobre o excedente reativo — historicamente conhecida como <strong>UFER (Unidade de Faturamento de Energia Reativa)</strong>, hoje regulada no contexto da Resolução Normativa ANEEL nº 1.000/2021 e suas regulamentações complementares." },
    { kind: 'nota', tom: "neutro", label: null, html: "Referência regulatória" },
    { kind: 'paragrafo', html: "A base regulatória atual da prestação do serviço público de distribuição é a <strong>Resolução Normativa ANEEL nº 1.000/2021</strong>, em vigor desde janeiro de 2022. Os fenômenos de qualidade do produto — incluindo fator de potência, harmônicos, variações de tensão, desequilíbrios e flutuações — são tratados no <strong>Módulo 8 do PRODIST</strong> (Qualidade do Fornecimento). Antes de qualquer recomendação financeira específica, validar a regra exata aplicável ao contrato." },
    { kind: 'titulo', numero: "7.5", texto: "A solução clássica: banco de capacitores" },
    { kind: 'paragrafo', html: "Equipamentos indutivos exigem reativo. Capacitores fornecem reativo. A solução clássica para FP indutivo baixo é instalar um <strong>banco de capacitores</strong> próximo à carga, que fornece localmente a potência reativa necessária — reduzindo o reativo puxado da rede e elevando o FP medido." },
    { kind: 'nota', tom: "red", label: null, html: "Cuidado · diagnóstico antes de solução" },
    { kind: 'paragrafo', html: "Banco de capacitores é uma solução comum, mas <strong>não é diagnóstico</strong>. Antes de recomendar, é preciso entender: causa exata do reativo, recorrência, presença de harmônicos (que podem amplificar problemas em sistemas com capacitores), perfil de carga, sazonalidade. Compensação excessiva pode criar FP capacitivo, que também é problemático. <strong>A linguagem GridAlpha correta é: \"seu perfil indica possível custo por reativo; precisamos identificar causa, recorrência e melhor correção técnica\"</strong> — nunca \"instale banco de capacitores\"." },
  ],
  'aula-01-08': [
    { kind: 'titulo', numero: "8.1", texto: "Capacidade instalada vs. geração efetiva" },
    { kind: 'paragrafo', html: "<strong>Capacidade instalada</strong> é o tamanho nominal da usina ou equipamento de geração — o máximo teórico que ela pode produzir se operasse em potência plena, 24 horas por dia, 365 dias por ano. Uma usina solar de 100 MW tem capacidade instalada de 100 MW." },
    { kind: 'paragrafo', html: "Isso não significa que ela gera 100 MW o tempo todo. A solar não gera à noite. A eólica depende do vento. A hidrelétrica depende de chuva e reservatório. A térmica depende de combustível disponível e despacho do sistema. <strong>Geração efetiva</strong> é o que a usina <em>realmente</em> produziu em um período, medido em MWh." },
    { kind: 'titulo', numero: "8.2", texto: "O fator de capacidade" },
    { kind: 'paragrafo', html: "Uma usina de 100 MW</span> tem geração máxima teórica em um ano de 100 × 8.760 = 876.000 MWh</span>. Se ela gerou efetivamente 220.000 MWh</span>, o FC foi de 25,1%. Use a calculadora abaixo:" },
    { kind: 'titulo', numero: "8.3", texto: "FCs típicos por fonte" },
    { kind: 'paragrafo', html: "Cada tecnologia tem um fator de capacidade característico, determinado pela física da fonte primária, pela tecnologia de geração e pelo padrão de despacho no sistema:" },
    { kind: 'nota', tom: "gold", label: null, html: "Por que isso importa para o Brasil" },
    { kind: 'paragrafo', html: "A matriz brasileira é dominada por hidrelétricas com fator de capacidade médio em torno de 50%, fortemente dependente de regime hidrológico anual. Quando você lê \"a matriz brasileira é 60% hidro\", essa é a participação por <strong>capacidade instalada</strong>. Em <strong>geração efetiva</strong>, a participação flutua ano a ano com chuvas, despacho térmico complementar e estado dos reservatórios. Confundir capacidade com geração — esse é o erro que separa estudante de analista nas conversas sobre matriz elétrica." },
  ],
  'aula-01-09': [
    { kind: 'titulo', numero: "9.1", texto: "As três dimensões da qualidade" },
    { kind: 'paragrafo', html: "A ANEEL trata qualidade do fornecimento em três dimensões:" },
    { kind: 'tabela', linhas: [["Dimensão","O que mede","Indicadores"],["<b>Qualidade do serviço (continuidade)</b>","Frequência e duração de interrupções","DEC, FEC (coletivos) · DIC, FIC, DMIC, DICRI (individuais)"],["<b>Qualidade do produto (tensão)</b>","Conformidade da tensão entregue","DRP, DRC · faixas adequada, precária, crítica"],["<b>Qualidade comercial</b>","Atendimento da distribuidora ao consumidor","Indicadores de prazo, atendimento, reclamações"]] },
    { kind: 'titulo', numero: "9.2", texto: "Indicadores de continuidade" },
    { kind: 'tabela', linhas: [["Sigla","Significa","O que mede"],["<b>DEC</b>","Duração Equivalente de interrupção por unidade Consumidora","Tempo total médio de interrupção por consumidor no ano (em horas)"],["<b>FEC</b>","Frequência Equivalente de interrupção por unidade Consumidora","Número médio de interrupções por consumidor no ano"],["<b>DIC</b>","Duração de Interrupção por unidade Consumidora individual","Tempo total de interrupção naquela unidade específica"],["<b>FIC</b>","Frequência de Interrupção individual","Número de interrupções naquela unidade no período"],["<b>DMIC</b>","Duração Máxima de Interrupção Contínua","Maior interrupção individual no período"],["<b>DICRI</b>","DIC em dia crítico","Indicador específico para dias de alta severidade operacional"]] },
    { kind: 'titulo', numero: "9.3", texto: "Harmônicos, afundamentos e desequilíbrios" },
    { kind: 'paragrafo', html: "Mesmo sem interrupção total, há fenômenos que degradam a qualidade do produto entregue:" },
    { kind: 'tabela', linhas: [["Fenômeno","O que é","Consequência industrial"],["<b>Harmônicos</b>","Distorções na forma de onda elétrica, comuns em cargas não lineares (drives, inversores, fontes eletrônicas)","Aquecimento de motores e transformadores, disparo de proteções, redução de vida útil"],["<b>Afundamento de tensão (voltage sag)</b>","Queda rápida e temporária da tensão","Desliga equipamentos sensíveis, reseta sistemas de controle, para linha de produção"],["<b>Sobretensão</b>","Elevação acima dos limites","Reduz vida útil de equipamento, pode causar falhas em isolação"],["<b>Desequilíbrio entre fases</b>","Tensão desigual nas três fases de um sistema trifásico","Aquecimento de motores, perda de eficiência, vibração"],["<b>Flicker (flutuação de tensão)</b>","Variações rápidas e visíveis","Comum em cargas como fornos a arco; afeta vizinhança elétrica"]] },
    { kind: 'nota', tom: "neutro", label: null, html: "Conformidade de tensão · PRODIST Módulo 8" },
    { kind: 'paragrafo', html: "A ANEEL define faixas para tensão entregue ao consumidor — <strong>adequada</strong>, <strong>precária</strong> e <strong>crítica</strong> — com medição integralizada em intervalos de 10 minutos por pelo menos sete dias consecutivos, totalizando 1.008 leituras. Sobre essa amostra calculam-se os indicadores <strong>DRP</strong> (Duração Relativa da transgressão para tensão Precária) e <strong>DRC</strong> (idem para Crítica). Quando o consumidor identifica problema sistemático de tensão, esse é o caminho técnico para abrir tratativa com a distribuidora." },
    { kind: 'titulo', numero: "9.4", texto: "Por que isso é custo operacional, não só técnico" },
    { kind: 'paragrafo', html: "Para uma residência, qualidade de energia ruim é incômodo. Para uma indústria, é prejuízo direto:" },
    { kind: 'nota', tom: "neutro", label: null, html: "Onde isso entra no produto" },
    { kind: 'paragrafo', html: "No <strong>Power Quality Audit (PQA)</strong> da GridAlpha, a checagem inicial é uma triagem: existe cobrança de reativo na fatura? Há histórico de interrupções ou quedas? Há relato de queima de equipamentos? Há motores grandes, inversores, soldas, fornos? O cliente tem medição própria ou só fatura? Essa checklist não substitui medição — define se vale escalar para auditoria com instrumentação dedicada." },
  ],
};

/** Exercício de síntese do § Drill. Não pertence a nenhuma aula: o tag é
 *  'Ex · 08 · Síntese · Diagnóstico inicial', sem número de aula. */
export const MODULO_01_SINTESE: LessonActivity[] = [
{ id: 'ex-08', kind: 'discursiva' as const, prompt: "Um cliente em Minas Gerais te diz: <i>\"Minha conta de luz está cara, quero migrar para o mercado livre.\"</i> Responda em até oito linhas: por que você não começa imediatamente falando de mercado livre? Quais fundamentos do módulo você checa primeiro? Que dados pede?", points: 1, config: { tag: "Ex · 08 · Síntese · Diagnóstico inicial", gabarito: "\"Mercado livre pode ser relevante, mas primeiro precisamos entender a estrutura atual de custo da sua fatura. Antes de qualquer migração, eu checaria: consumo em kWh, demanda contratada e medida em kW, fator de carga, fator de potência, modalidade tarifária, distribuição ponta/fora-ponta e existência de cobranças de reativo. Pediria 12 faturas completas, contrato de demanda, tensão de fornecimento, horários de operação e lista das maiores cargas. <b>Sem isso, estaríamos propondo uma solução antes de diagnosticar o problema</b> — e mercado livre só faz sentido depois de eliminadas as oportunidades estruturais no contrato atual.\"" } },
];

export const MODULO_01_AULAS: CurriculumAula[] = [
{
    id: 'aula-01-01',
    moduleId: 'modulo-01',
    number: 1,
    totalInModule: 9,
    title: "Energia é volume. Potência é velocidade.",
    subtitle: "Energia × Potência",
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
        id: 'ex-01',
        kind: 'discursiva',
        prompt: "Um motor de <b>15 kW</b> opera por <b>8 horas</b>. Qual o consumo em kWh? E se o motor operar 12 horas, o que muda: kW, kWh ou ambos?",
        points: 1,
        config: { tag: "Ex · 01 · Aula 01", gabarito: "Consumo: <span class=\"calc\">15 × 8 = 120 kWh</span>. Operando por 12 horas: <span class=\"calc\">15 × 12 = 180 kWh</span>. O kW (potência) <b>não muda</b> — a máquina continua sendo 15 kW. O que muda é apenas o kWh acumulado, porque o tempo de operação aumentou. Para um gestor industrial: <i>\"a potência da máquina é a mesma; ela só ficou ligada por mais horas\".</i>" },
      },
    ],
    references: [],
    instruments: [INSTRUMENTOS_MODULO_01.find((x) => x.id === 'inst-01')!],
  },
  {
    id: 'aula-01-02',
    moduleId: 'modulo-01',
    number: 2,
    totalInModule: 9,
    title: "Sete símbolos. Toda a linguagem.",
    subtitle: "As sete unidades essenciais",
    track: 'universal',
    language: 'pt-BR',
    durationMinutes: null,
    difficulty: null,
    submercados: [],
    competencies: [],
    illustrations: ['fis-04-triangulo-potencia.png'],
    video: null,
    activities: [
      {
        id: 'ex-02',
        kind: 'discursiva',
        prompt: "Um equipamento opera em <b>220 V</b> e puxa <b>20 A</b>. Qual a potência aproximada em kW? Se ficar ligado 6 horas, qual o consumo?",
        points: 1,
        config: { tag: "Ex · 02 · Aula 02", gabarito: "Potência: <span class=\"calc\">220 × 20 = 4.400 W = 4,4 kW</span>. Consumo em 6 horas: <span class=\"calc\">4,4 × 6 = 26,4 kWh</span>. Observe a cadeia completa: V × A → W → kW → kWh." },
      },
    ],
    references: [],
    instruments: [INSTRUMENTOS_MODULO_01.find((x) => x.id === 'inst-02')!],
  },
  {
    id: 'aula-01-03',
    moduleId: 'modulo-01',
    number: 3,
    totalInModule: 9,
    title: "A rede tem um batimento cardíaco. Ele se chama 60 Hz.",
    subtitle: "Corrente alternada e frequência",
    track: 'universal',
    language: 'pt-BR',
    durationMinutes: null,
    difficulty: null,
    submercados: [],
    competencies: [],
    illustrations: ['fis-01-dinamo-cc.png', 'fis-02-alternador-ca.png', 'fis-06-medidor-frequencia.png'],
    video: null,
    activities: [

    ],
    references: [],
    instruments: [],
  },
  {
    id: 'aula-01-04',
    moduleId: 'modulo-01',
    number: 4,
    totalInModule: 9,
    title: "Por que perdas crescem ao quadrado. E por que isso desenhou toda a rede.",
    subtitle: "Tensão, corrente e perdas",
    track: 'universal',
    language: 'pt-BR',
    durationMinutes: null,
    difficulty: null,
    submercados: [],
    competencies: [],
    illustrations: ['fis-03-transformador-elevador.png'],
    video: null,
    activities: [
      {
        id: 'ex-03',
        kind: 'discursiva',
        prompt: "Se a corrente em um condutor <b>dobra</b>, o que acontece com as perdas resistivas? Por quê?",
        points: 1,
        config: { tag: "Ex · 03 · Aula 04", gabarito: "As perdas <b>quadruplicam</b>. Como P<sub>perdas</sub> = I² × R, se a corrente dobra (×2), o quadrado dela é multiplicado por 4. Mantendo R constante, a perda aumenta 4 vezes. Essa é a justificativa física para transmitir energia em alta tensão: alta tensão permite baixa corrente para a mesma potência, e baixa corrente reduz drasticamente as perdas." },
      },
    ],
    references: [],
    instruments: [INSTRUMENTOS_MODULO_01.find((x) => x.id === 'inst-03')!],
  },
  {
    id: 'aula-01-05',
    moduleId: 'modulo-01',
    number: 5,
    totalInModule: 9,
    title: "Por que uma fábrica paga por capacidade reservada.",
    subtitle: "Demanda e fator de carga",
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
        id: 'ex-04',
        kind: 'discursiva',
        prompt: "Uma empresa consome <b>144.000 kWh</b> em um mês de 720 horas. Demanda máxima medida foi <b>800 kW</b>. Calcule demanda média e fator de carga. Como interpretar?",
        points: 1,
        config: { tag: "Ex · 04 · Aula 05", gabarito: "Demanda média: <span class=\"calc\">144.000 ÷ 720 = 200 kW</span>. Fator de carga: <span class=\"calc\">200 ÷ 800 = 0,25 = 25%</span>. <b>Interpretação:</b> fator de carga baixo indica picos elevados em relação ao consumo médio. Pode haver oportunidade de gestão de demanda (sequenciamento, automação, deslocamento), mas <b>não recomende mudança contratual sem ver 12 meses de histórico e entender a operação</b>. O perfil pode ser legitimamente concentrado por razões de processo produtivo." },
      },
      {
        id: 'ex-07',
        kind: 'discursiva',
        prompt: "Explique <b>\"demanda contratada\"</b> em três versões: para uma criança de 12 anos, para um CFO industrial, e para um especialista de setor.",
        points: 1,
        config: { tag: "Ex · 07 · 3 níveis · Aula 05", gabarito: "<b>12 anos:</b> \"É como reservar uma estrada grande o suficiente para o maior trânsito que a fábrica pode causar. Mesmo que a estrada fique vazia a maior parte do tempo, ela precisa estar pronta para o pior momento.\" <b>CFO:</b> \"É a capacidade em kW que a empresa contrata da distribuidora. Se contratar demais, paga capacidade ociosa todo mês. Se contratar de menos, pode pagar ultrapassagem em valor superior. O ajuste exige histórico de 12 meses e entendimento de planos de expansão e sazonalidade.\" <b>Especialista:</b> \"É o montante de demanda, em kW, contratado para faturamento de unidade do Grupo A junto à distribuidora, comparado à demanda medida em intervalos de integração definidos, sujeito às regras da modalidade tarifária aplicável e ao Contrato de Uso do Sistema de Distribuição (CUSD), no contexto regulatório atualmente regido pela REN ANEEL 1.000/2021.\"" },
      },
    ],
    references: [],
    instruments: [INSTRUMENTOS_MODULO_01.find((x) => x.id === 'inst-04')!],
  },
  {
    id: 'aula-01-06',
    moduleId: 'modulo-01',
    number: 6,
    totalInModule: 9,
    title: "A tensão de fornecimento define a tarifa que você paga.",
    subtitle: "Tensão como categoria econômica",
    track: 'universal',
    language: 'pt-BR',
    durationMinutes: null,
    difficulty: null,
    submercados: [],
    competencies: [],
    illustrations: [],
    video: null,
    activities: [

    ],
    references: [],
    instruments: [],
  },
  {
    id: 'aula-01-07',
    moduleId: 'modulo-01',
    number: 7,
    totalInModule: 9,
    title: "Existe energia que ocupa a rede e não vira produção.",
    subtitle: "Triângulo de potência e fator de potência",
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
        id: 'ex-05',
        kind: 'discursiva',
        prompt: "Uma instalação industrial usa <b>900 kW de potência ativa</b> e exige <b>1.000 kVA</b> de potência aparente. Qual o fator de potência? Está dentro do esperado para Grupo A? Qual cuidado antes de recomendar solução?",
        points: 1,
        config: { tag: "Ex · 05 · Aula 07", gabarito: "FP: <span class=\"calc\">900 ÷ 1.000 = 0,90</span>. Está <b>abaixo da referência prática de 0,92</b> para Grupo A — alerta. Pode haver cobrança por excedente reativo. <b>Cuidado essencial:</b> não recomendar banco de capacitores automaticamente. Antes: verificar causa exata (cargas indutivas? harmônicos?), recorrência, perfil ao longo do dia, presença de cargas não lineares. Compensação excessiva pode criar FP capacitivo, que também é problemático. Solução correta exige diagnóstico técnico estruturado." },
      },
    ],
    references: [],
    instruments: [INSTRUMENTOS_MODULO_01.find((x) => x.id === 'inst-05')!],
  },
  {
    id: 'aula-01-08',
    moduleId: 'modulo-01',
    number: 8,
    totalInModule: 9,
    title: "100 MW solar ≠ 100 MW térmica.",
    subtitle: "Capacidade instalada e fator de capacidade",
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
        id: 'ex-06',
        kind: 'discursiva',
        prompt: "Uma usina solar de <b>50 MW</b> gerou <b>131.400 MWh</b> em um ano (8.760 horas). Calcule o fator de capacidade. É um número razoável para solar no Brasil?",
        points: 1,
        config: { tag: "Ex · 06 · Aula 08", gabarito: "Geração máxima teórica: <span class=\"calc\">50 × 8.760 = 438.000 MWh</span>. FC: <span class=\"calc\">131.400 ÷ 438.000 = 0,30 = 30%</span>. <b>Interpretação:</b> 30% é um pouco acima da média típica brasileira (~20–28%) — sugere usina bem localizada (Nordeste ou regiões de alta irradiação) e/ou tecnologia mais moderna com tracker solar. Para comparação: hidrelétrica brasileira média opera em torno de 50% de FC; nuclear opera 85–95%; térmica peaker pode ficar abaixo de 15%." },
      },
    ],
    references: [],
    instruments: [INSTRUMENTOS_MODULO_01.find((x) => x.id === 'inst-06')!],
  },
  {
    id: 'aula-01-09',
    moduleId: 'modulo-01',
    number: 9,
    totalInModule: 9,
    title: "Energia ruim pode custar mais do que energia cara.",
    subtitle: "Qualidade de energia",
    track: 'universal',
    language: 'pt-BR',
    durationMinutes: null,
    difficulty: null,
    submercados: [],
    competencies: [],
    illustrations: [],
    video: null,
    activities: [

    ],
    references: [],
    instruments: [],
  },
];

export const getAulaModulo01 = (id: string) =>
  MODULO_01_AULAS.find((a) => a.id === id) ?? null;

/** `true` quando a aula tem conteúdo extraído nesta wave. As demais aulas
 *  do currículo seguem sem viewer. */
export const temConteudoReal = (aulaId: string) =>
  MODULO_01_AULAS.some((a) => a.id === aulaId);
