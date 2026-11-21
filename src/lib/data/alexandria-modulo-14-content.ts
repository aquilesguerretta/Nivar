// alexandria-modulo-14-content.ts
// Bloco 14 — Biocombustíveis e Bioenergia. Nível 3, track 'brasil'.
// SEGUNDO módulo da Trilha 3 (Especialização Estratégica), cujos blocos
// são 13 a 17.
//
// CATÁLOGO CONFIRMADO na FOUNDRY, não herdado da wave anterior nem de
// suposição própria:
//   { id: 'bloco-14', level: 3, track: 'brasil',
//     title: 'Biocombustíveis e Bioenergia', illustrationPrefix: null }
// O título da fonte BATE com o catálogo — `<title>` e `<h1>` trazem
// "Biocombustíveis e Bioenergia", literal. Sem a divergência que o
// Módulo 11 teve (protocolo §7).
//
// EXTRAÍDO de `Alexandria modulos/alexandria_modulo14.html` — 330.820
// bytes (249.396 de markup + 81.407 de <script>).
//
// ── VOCABULÁRIO MEDIDO (protocolo §6) ────────────────────────
// Os sete seletores dos Módulos 01-03 dão ZERO. É o vocabulário
// abreviado dos Módulos 04+, com a inversão do Módulo 11 confirmada:
// `inst-hd` traz `span.id` ANTES de `span.nm`.
//
// ── CONTAGEM POR TRÊS SINAIS (protocolo §5) ──────────────────
// 18 seções = 8 aulas + 10 de aparato. Os três sinais CONCORDAM, e a
// prosa do hero declara cada um deles:
//   aulas        8   (8 seções casando `Aula NN`)
//   instrumentos 10  (10 `div.inst`: 1 no §MAP, 9 em aula)
//   exercícios   14  (14 `<details>` no §Ex)
//   termos       158 (158 `.term` no §Lex)
// Nenhuma divergência prosa × markup a registrar neste módulo.
//
// ── COBERTURA DE TEXTO (o gate do protocolo §5) ──────────────
// Medida por token sobre o corpo de cada aula, com o markup dos
// instrumentos descontado do denominador. 135 blocos nas oito aulas:
//   a01 99,5% · a02 99,8% · a03 99,8% · a04 99,8%
//   a05 99,8% · a06 99,9% · a07 99,9% · a08 99,9%
// Nenhuma aula abaixo de 85%. O resíduo é normalização de entidade e
// pontuação de aparato.
//
// ── ESTRUTURAS DA FONTE, TODAS CAPTURADAS ────────────────────
// Este módulo mistura estruturas que o protocolo já registrou como
// perdidas em waves anteriores, mais quatro próprias do domínio:
//   div.emp   6 fichas de rota, 48 pares chave/valor (o "6 fichas de
//             rota" que o hero declara) — mesma natureza do src-card
//             do Módulo 08 e do div.fi do Módulo 09
//   div.fx    7 fórmulas com nome, equação e leitura → kind 'formula'
//   div.saf   calendário de safra por cadeia, mês a mês  (NOVO)
//   div.rt    destinos concorrentes do bagaço            (NOVO)
//   div.flux  três grandezas que não se convertem        (NOVO)
//   div.clk   linha do tempo normativa                   (NOVO)
//   div.dual  par de cartões rótulo/valor/leitura
//   div.est   faixa de estado regulatório (teto/vigente/anúncio/vencido)
//   div.lv    explicador de três níveis · div.scroll > table.tbl
//
// ── VOCABULÁRIO DE COMMODITY AGRÍCOLA — o primeiro do currículo ──
// A pista do brief se confirma na fonte: este é o primeiro módulo a
// integrar vocabulário de commodity agrícola a vocabulário de energia.
// Termos que nenhum módulo anterior teve motivo de usar: ano-safra
// (ciclo abril-março, contra ano-calendário), ATR (açúcar total
// recuperável), mix açúcar-etanol, moagem, bagaço, vinhaça, palha,
// hidratado × anidro, biodiesel B${n}, CBIO, RenovaBio, biometano,
// safra/entressafra, Centro-Sul.
//
// A CONSEQUÊNCIA de extração está no eixo temporal: o módulo inteiro
// gira em torno de ano-safra NÃO ser ano-calendário, e é por isso que
// nenhum número daqui é diretamente comparável a estatística elétrica
// sem declarar a base. Os números foram preservados com a base temporal
// colada, como a fonte os escreve.
//
// ── GRAVURA: ZERO, com dois sinais concordando (protocolo §7) ─
// `illustrationPrefix: null` no catálogo E zero `<img>` no markup.
// `illustrations: []` nas oito — nenhuma biblioteca de outro bloco foi
// forçada por semelhança de tema, que é exatamente o que a regra proíbe.
//
// ── video / durationMinutes / difficulty: null MEDIDOS ───────
// Zero <video>, <iframe>, youtube, vimeo, .mp4 e <audio> no arquivo.

import type { CurriculumAula, Instrument, LessonActivity } from '@/lib/types/alexandria';
import type { AulaBloco } from './alexandria-modulo-01-content';

export const MODULO_14_LEAD: Record<string, string> = {
  'aula-14-01': "A destilaria é a mesma. A cana é a mesma. A fermentação é a mesma. E ainda assim o etanol hidratado e o etanol anidro são dois produtos comercialmente distintos, com dois motores de demanda que não se comunicam: um responde a preço de bomba, e o outro responde a uma resolução de conselho. Quem lê \"produção de etanol\" como um número só perdeu essa separação, e com ela perdeu a capacidade de explicar por que a produção total caiu enquanto uma das duas metades subia.",
  'aula-14-02': "Esta é a aula que dá nome à espinha dorsal do módulo. A mesma tonelada de cana carrega uma quantidade de açúcar recuperável que pode virar açúcar ou virar etanol, e a escolha entre os dois é feita comercialmente, dentro da planta, ao longo de toda a safra. Não há operador nacional nisso. Há preço relativo, contrato já assinado, posição de proteção já montada — e uma restrição de engenharia que decide quanto da arbitragem é sequer executável.",
  'aula-14-03': "O currículo não nomeia nenhuma das duas rotas desta aula, e a produção do módulo torna as duas difíceis de omitir — por razões opostas. O etanol de milho é estruturalmente diferente porque <b>quebra a sazonalidade</b> que organiza todo o resto do bloco. O etanol de segunda geração é estruturalmente importante porque usa <b>exatamente o mesmo bagaço</b> que a cogeração usa, e portanto é a ilustração mais limpa da Lente de Arbitragem em todo o módulo: não é competição entre empresas, é competição entre destinos do mesmo insumo dentro da mesma planta.",
  'aula-14-04': "Esta é a aula da terceira lente. O biodiesel é o exemplo mais limpo do currículo de um mercado que existe porque uma regra determina que ele exista: retire o percentual obrigatório e a demanda não cai — ela some. Entender esse mecanismo é entender uma categoria inteira de política pública que o Bloco 16 vai reencontrar em outras formas, e é o que separa \"o Brasil produz dez bilhões de litros de biodiesel\" de \"o Brasil <b>determinou</b> que dez bilhões de litros de biodiesel fossem comprados\".",
  'aula-14-05': "O currículo escreve, sobre o bagaço de cana: \"setor sucroenergético entrega energia firme na safra\". A frase está correta e é enganosa se repetida sem desdobramento, porque \"firme\" no vocabulário do setor elétrico significa disponibilidade contratável — e uma usina sucroenergética do Centro-Sul não gera fora da safra. Esta aula resolve a aparente contradição, e ela se resolve de um jeito específico: <b>a sazonalidade não é defeito, é complementaridade</b>. E para enxergar isso é preciso separar três grandezas que material de divulgação apresenta como uma.",
  'aula-14-06': "Esta é a rota em que a distância entre potencial anunciado e capacidade contratada é a maior de todo o bloco, e a razão é específica: o insumo está <b>espalhado</b>. Cana está concentrada em usinas; grão está concentrado em armazéns; resíduo orgânico está distribuído por milhares de propriedades, aterros e estações de tratamento, cada uma com um volume que isoladamente não paga uma planta. Por isso a economia desta rota não é de tecnologia — a digestão anaeróbia é conhecida há décadas. É de <b>logística e de escala mínima</b>.",
  'aula-14-07': "O currículo descreve o RenovaBio em uma linha: \"política de descarbonização, CBIOs como créditos de descarbonização\". A linha é verdadeira e omite a única coisa que importa para leitura: <b>o crédito é um ativo negociado</b>, com preço formado em mercado organizado, meta anual definida por ato do regulador, obrigação individualizada por distribuidor de combustível e regime de penalidade por descumprimento. É a quarta coisa que sai da mesma tonelada — e a única que não tem massa.",
  'aula-14-08': "As sete aulas anteriores trataram cada rota por dentro. Esta as coloca lado a lado, em <b>campos idênticos</b>, porque campo fixo é o que permite leitura lateral: com a mesma pergunta na mesma posição em todas as seis fichas, a diferença entre rotas salta sem esforço, e o que é comum a todas deixa de parecer característica de uma delas. É o mesmo princípio que as fichas dos Módulos 07 a 13 já validaram — e aqui a ficha é de <b>rota</b>, não de empresa, porque o objeto deste bloco é uma cadeia produtiva. O bloco de empresa já é o 13, e duplicá-lo aqui seria desperdício de escopo.",
};

/** 135 blocos nas oito aulas, na ordem do documento. */
export const MODULO_14_CORPO: Record<string, AulaBloco[]> = {
  'aula-14-01': [
    { kind: 'titulo', numero: "01.1", texto: "A diferença física, e por que ela é comercial" },
    { kind: 'paragrafo', html: "O <b>etanol hidratado combustível</b> contém água dentro da especificação e é vendido diretamente ao consumidor, para veículos com motor flexível. O <b>etanol anidro combustível</b> passa por uma etapa adicional de desidratação e é misturado à gasolina A para formar a gasolina C — a que existe na bomba. A especificação dos dois e os respectivos controles de qualidade estão na <b>Resolução ANP nº 907/2022</b>, que também trata do teor de metanol; o anidro recebe corante justamente para tornar detectável a fraude por adição de água. Essa é a diferença física, e ela cabe em um parágrafo." },
    { kind: 'paragrafo', html: "A diferença comercial é o conteúdo da aula. O hidratado <b>compete na bomba</b>: ele disputa o tanque do motorista com a gasolina C, litro a litro, e responde a preço relativo, renda, sazonalidade e disponibilidade regional em prazo curto. Cada motorista de veículo flexível é uma unidade de arbitragem descentralizada, e o conjunto deles forma um mecanismo de ajuste de demanda que nenhum outro mercado de combustível do mundo tem na mesma escala. O anidro <b>não compete com nada</b>: a demanda dele é derivada, e igual ao volume de gasolina C vendido multiplicado pelo percentual de mistura obrigatória. Um número que a agência publica e o outro que um conselho fixa. Nada disso passa pela decisão do motorista." },
    { kind: 'tabela', linhas: [["Lado", "Valor", "Leitura"], ["Hidratado · demanda de bomba", "22,7 bi L", "Produção nacional em <b>ano-calendário 2025</b>. As vendas do produto caíram 5,9% no ano, e a agência atribui a queda explicitamente à menor competitividade de preço frente à gasolina C. Fonte: ANP, Anuário Estatístico 2026, publicado em 26 de junho de 2026."], ["Anidro · demanda derivada", "13,2 bi L", "Produção nacional em <b>ano-calendário 2025</b>, com alta de 3,1% no ano. A agência atribui a alta explicitamente à elevação da mistura obrigatória de 27% para 30% a partir de agosto de 2025. Mesma fonte, mesma base temporal."]] },
    { kind: 'paragrafo', html: "Repare no que os dois números fazem juntos. A produção total de etanol em 2025 <b>caiu 2,8%</b>, para cerca de 35,9 bilhões de litros. Se você citar apenas esse total, terá dito algo verdadeiro e terá escondido o movimento inteiro: uma das metades subiu por decisão regulatória e a outra desceu por preço relativo, e a soma das duas coisas produziu um número agregado que não descreve nenhuma das duas. É o mesmo defeito que o Módulo 08 catalogou para a matriz elétrica quando se soma fonte sazonal com fonte de base — só que aqui a origem da divergência não é hidrologia, é política." },
    { kind: 'nota', tom: "neutro", label: "Hidratado contra anidro — três níveis", html: "<b>Nível 1.</b> São dois tipos do mesmo álcool feito de cana ou de milho. Um deles tem um pouquinho de água e vai puro no tanque de carros que aceitam os dois combustíveis. O outro é mais seco e nunca aparece sozinho: ele é misturado dentro da gasolina antes de a gasolina chegar ao posto. Quem escolhe o primeiro é o motorista. Quem decide quanto do segundo vai dentro da gasolina é o governo.<br><b>Nível 2.</b> São dois produtos com dois motores de demanda independentes. O hidratado é venda direta ao consumidor e responde a preço relativo com elasticidade alta e resposta rápida — se a gasolina fica barata, a demanda migra em semanas. O anidro é demanda derivada: volume de gasolina vendido vezes percentual obrigatório de mistura. O primeiro exige inteligência de preço e de logística regional; o segundo exige inteligência regulatória, porque o percentual muda por ato infralegal e pode mudar em qualquer reunião de conselho.<br><b>Nível 3.</b> Dois produtos de mesma molécula e especificações distintas conforme a Resolução ANP nº 907/2022, separados pela etapa de desidratação e por controle de teor de água, com corante obrigatório no anidro como instrumento de detecção de adulteração. A elasticidade-preço cruzada do hidratado contra a gasolina C é alta e assimétrica por região, em função de carga tributária estadual e de custo de frete a partir do Centro-Sul; a do anidro é estruturalmente nula, porque a quantidade é fixada exogenamente pelo produto entre volume de ciclo Otto e teor obrigatório. A capacidade de desidratação instalada, e não a de destilação, é a restrição física que limita a resposta da oferta de anidro a uma elevação de teor." },
    { kind: 'titulo', numero: "01.2", texto: "O teor mudou ontem, e isso é a aula" },
    { kind: 'paragrafo', html: "Em 30 de julho de 2026, em edição extra do Diário Oficial da União, foi publicada a <b>Resolução CNPE nº 9/2026</b>, aprovada na reunião do colegiado de 14 de julho de 2026, que elevou de 30% para <b>32%</b> o percentual obrigatório de etanol anidro na gasolina C comum e na gasolina C comum aditivada, em todo o território nacional, a partir de <b>1º de agosto de 2026</b>. A medida é declaradamente <b>excepcional e temporária</b>: vigência de 180 dias, prorrogável uma única vez por igual período. A gasolina premium permanece em 25%. As demais especificações da gasolina previstas na Resolução ANP nº 807/2020 não foram alteradas neste momento, incluindo o número de octano pesquisa, mantido em 94,0." },
    { kind: 'paragrafo', html: "Guarde a estrutura dessa frase, porque ela contém os quatro estados que a Aula 04 vai formalizar. O teto legal autorizado pela <b>Lei nº 14.993/2024</b> — a Lei do Combustível do Futuro — é <b>E35</b>. O percentual em vigor hoje é <b>E32</b>. O percentual anterior, vigente até 31 de julho de 2026, era E30. E a adoção <em>definitiva</em> do E32 ou de misturas superiores está condicionada, pela própria resolução, à realização dos testes de durabilidade para o E35. Quatro informações distintas, todas verdadeiras ao mesmo tempo, e nenhuma delas substituível pelas outras." },
    { kind: 'lista', itens: ["Teto legal autorizado · E35 · Lei nº 14.993/2024", "Em vigor · E32 · Res. CNPE nº 9/2026 · desde 1º/8/2026", "Temporário · 180 dias, prorrogável uma vez", "Anterior · E30 · vigente de 1º/8/2025 a 31/7/2026"] },
    { kind: 'nota', tom: "alerta", label: "Números vivos · verificar na fonte antes de uso externo", html: "Percentual de mistura obrigatória é <b>o número mais perecível de todo o currículo</b>. Ele é fixado por resolução de conselho, dentro de teto autorizado por lei, e pode ser alterado sem qualquer processo legislativo novo — o que o torna estruturalmente mais volátil que qualquer norma de agência que os Módulos 09, 10 e 11 trataram. O E32 vigente hoje tem prazo de validade declarado. <b>Verifique em CNPE/MME e ANP na data de uso</b>: qual o percentual em vigor, se houve prorrogação ou reversão ao fim dos 180 dias, e se os testes para E35 avançaram. Consulta em 2 de agosto de 2026. Um número de mistura sem data e sem norma não é dado — é lembrança." },
    { kind: 'titulo', numero: "01.3", texto: "A paridade, e por que a regra dos 70% é uma aproximação histórica e não uma lei" },
    { kind: 'paragrafo', html: "A frase circula em todo posto de combustível do país: \"etanol vale a pena até 70% do preço da gasolina\". Ela é uma aproximação razoável para um veículo médio de uma época média, e é sistematicamente errada para qualquer veículo específico. O etanol tem poder calorífico menor que a gasolina, e por isso um litro dele rende menos quilômetros; a razão entre os dois rendimentos depende do motor, da calibração, do trajeto, da manutenção e da idade do veículo. O limiar correto não é 70% — é <b>a razão de eficiência medida daquele carro</b>, e ela varia." },
    { kind: 'titulo', numero: null, texto: "Custo por quilômetro" },
    { kind: 'formula', eq: "Custo/km = Preço por litro ÷ Rendimento em km por litro", desc: "A única comparação que decide. O combustível mais barato por litro pode ser mais caro por quilômetro , e é exatamente isso que a regra dos 70% esconde quando aplicada a um veículo cuja razão de eficiência real não é 0,70." },
    { kind: 'titulo', numero: null, texto: "Índice de paridade — triagem, não decisão" },
    { kind: 'formula', eq: "Índice = Preço do hidratado ÷ Preço da gasolina C", desc: "Serve para uma triagem de dez segundos. A decisão só sai da comparação entre esse índice e a razão real de rendimento do veículo — não contra 0,70, que é um número herdado e não medido." },
    { kind: 'paragrafo', html: "Para frota, a conta muda de natureza e não apenas de escala. Entram tempo de abastecimento, disponibilidade do produto na rota, contrato de fornecimento, política de manutenção, exposição cambial indireta via preço do fóssil, e — dependendo do cliente final — exigência de redução de emissões declarada. Paridade de bomba não captura custo total de propriedade, e apresentá-la como se capturasse é o erro que transforma uma planilha em argumento de venda." },
    { kind: 'nota', tom: "gold", label: "Onde isso entra no produto", html: "A separação entre demanda de bomba e demanda derivada é exatamente o tipo de leitura que o <b>GridAlpha Energy Brief</b> existe para entregar: quando o total de etanol cai e uma das metades sobe, a notícia publicada registra o total e a análise registra a divergência. A capacidade analítica que esta aula constrói é a de olhar para um agregado e perguntar quais dois movimentos opostos ele está escondendo — não a de prever qual deles continua." },
    { kind: 'nota', tom: "neutro", label: "Didático/ilustrativo", html: "Uma frase de ponte, e apenas isso: a eletrificação da frota altera o denominador de longo prazo do ciclo Otto e, portanto, a demanda derivada de anidro. Esse é objeto do Bloco 16, e não se desenvolve aqui." },
  ],
  'aula-14-02': [
    { kind: 'titulo', numero: "02.1", texto: "A tonelada de cana não é uma unidade de valor" },
    { kind: 'paragrafo', html: "O indicador central da cadeia da cana não é a tonelada — é o <b>ATR</b>, sigla de Açúcares Totais Recuperáveis, expresso em quilos de ATR por tonelada de cana. Duas moagens iguais em tonelagem podem entregar valores muito diferentes conforme a qualidade da matéria-prima, que depende de variedade, idade do canavial, chuva, temperatura, pragas, grau de mecanização e distância entre o talhão e a moenda. Mais cana com ATR baixo pode valer menos que menos cana com ATR alto." },
    { kind: 'titulo', numero: null, texto: "Base de produto recuperável" },
    { kind: 'formula', eq: "ATR total = Cana moída (t) × ATR médio (kg/t)", desc: "Converta as unidades antes de comparar. Três milhões de toneladas a 138 kg de ATR por tonelada equivalem a 414 milhões de quilos de ATR antes de perdas industriais e de conversão — e é sobre esse número, não sobre a tonelagem, que a decisão de mix incide." },
    { kind: 'titulo', numero: null, texto: "Produtividade agrícola" },
    { kind: 'formula', eq: "TCH = Cana colhida (t) ÷ Área colhida (ha)", desc: "Toneladas de cana por hectare. Precisa ser lida junto com o ATR e com a idade média do canavial: TCH alto com ATR baixo e canavial velho descreve uma situação completamente diferente de TCH médio com ATR alto e canavial renovado." },
    { kind: 'paragrafo', html: "Na safra 2026/27, o primeiro levantamento da Conab, divulgado em 28 de abril de 2026, projetou <b>709,1 milhões de toneladas</b> de cana no país — alta de 5,3% sobre o ciclo anterior e o segundo maior volume da série histórica da companhia —, com área destinada à colheita de 9,1 milhões de hectares, a maior da série iniciada em 2005/06, e produtividade média nacional estimada em 77.753 quilos por hectare, recuperação de 3,4%. Todos esses números são de <b>ano-safra</b>, de um ciclo que começou em abril de 2026 e se encerra em março de 2027, e são de <b>primeiro levantamento</b>: a Conab faz quatro estimativas ao longo do ciclo, e as três seguintes vão revisá-los." },
    { kind: 'titulo', numero: "02.2", texto: "O mix visível nos dados" },
    { kind: 'paragrafo', html: "A arbitragem não é uma abstração de aula — ela aparece nas projeções do mesmo levantamento, e aparece com sinal oposto nos dois produtos:" },
    { kind: 'tabela', linhas: [["Produto", "Projeção safra 2026/27", "Variação sobre 2025/26", "O que o sinal indica"], ["Etanol total (cana + milho)", "40,69 bilhões de litros", "<b>+8,5%</b>", "Recorde projetado na série da companhia; mercado de combustível mais sustentado"], ["&nbsp;&nbsp;· Etanol de cana", "29,26 bilhões de litros", "+7,1%", "Hidratado 18,29 bi L (+6,3%); anidro 10,97 bi L (+8,4%) — o anidro cresce mais, puxado pela mistura"], ["&nbsp;&nbsp;· Etanol de milho", "11,43 bilhões de litros", "+12,3%", "Rota que não disputa ATR com o açúcar; ver Aula 03"], ["Açúcar", "43,95 milhões de toneladas", "<b>−0,5%</b>", "Preço internacional deprimido em meio a oferta global elevada; o mesmo ATR foi para o outro lado"]] },
    { kind: 'paragrafo', html: "Leia as duas linhas destacadas juntas: <b>etanol sobe 8,5% e açúcar cai 0,5% no mesmo ciclo, sobre uma safra de cana que cresce 5,3%</b>. Parte do crescimento do etanol vem de mais cana e de mais milho; parte vem de ATR que <em>deixou de virar açúcar</em>. Não dá para separar as duas contribuições sem o dado de mix industrial, e é por isso que o produto concorrente é a terceira informação que o critério de domínio deste bloco exige: sem ela, um crescimento de volume de etanol pode ser expansão de área, ganho de produtividade, deslocamento de mix, ou os três em proporções desconhecidas." },
    { kind: 'titulo', numero: "02.3", texto: "A restrição que o preço não mostra" },
    { kind: 'paragrafo', html: "Aqui está o ponto que separa a leitura de quem entende a cadeia da leitura de quem leu um gráfico de preço relativo. <b>Nenhuma planta alterna livremente entre açúcar e etanol.</b> A faixa de alternância é uma característica de engenharia da unidade: depende de capacidade de cristalização instalada, de capacidade de destilação, de tancagem, de logística de escoamento de cada produto e de contratos de fornecimento já firmados. Uma unidade desenhada para açúcar tem piso de açúcar; uma destilaria autônoma tem teto de açúcar igual a zero. A faixa típica de uma unidade mista é ampla, mas não é de 0% a 100%, e não muda no meio de uma safra sem investimento." },
    { kind: 'paragrafo', html: "A consequência é direta: <b>um sinal de preço favorável ao etanol não move nenhum ATR se a planta já está no teto de etanol da sua faixa.</b> O preço relativo diz para onde a planta gostaria de ir; a capacidade de alternância diz até onde ela consegue ir; e a posição de venda já contratada — inclusive proteção de preço já montada em bolsa para o açúcar — diz quanto dessa distância ainda está disponível. Concluir sobre uma arbitragem a partir de preço relativo isolado é o erro estrutural desta aula, e o instrumento abaixo recusa fazê-lo." },
    { kind: 'nota', tom: "neutro", label: "A pergunta que fecha a Lente de Arbitragem", html: "Diante de qualquer afirmação sobre mix — \"as usinas estão priorizando etanol\", \"o açúcar puxou a margem do setor\" —, a sequência de verificação tem três passos e nenhum deles é opcional. <b>Um:</b> qual a base temporal, ano-safra ou ano-calendário, e qual ciclo. <b>Dois:</b> a afirmação descreve preço relativo (sinal) ou mix efetivamente praticado (resultado)? São coisas diferentes e circulam com as mesmas palavras. <b>Três:</b> qual a faixa de alternância do conjunto de plantas de que se está falando — porque um sinal de preço que aponta para além do teto físico do parque não desloca nada, e vai aparecer nos dados como \"o setor não respondeu ao preço\", que é uma descrição errada de uma restrição de engenharia." },
    { kind: 'nota', tom: "gold", label: "Onde isso entra no produto", html: "Análise de mix é o núcleo de uma análise setorial de agro, e <b>agro está nomeado textualmente</b> entre os setores de análise setor-específica do <b>GridAlpha Research</b>. O que esta aula entrega ao produto não é a previsão de mix — é a disciplina de nunca reportar um sinal de preço como se fosse um resultado de despacho, e de sempre declarar a faixa de alternância como a variável que limita a conversão de um no outro." },
  ],
  'aula-14-03': [
    { kind: 'titulo', numero: "03.1", texto: "Milho: o grão que espera" },
    { kind: 'paragrafo', html: "A diferença que organiza tudo é banal e decisiva: <b>cana apodrece, grão não</b>. Cana colhida precisa ser moída em horas, o que amarra a operação industrial ao calendário agrícola e produz a sazonalidade que a Aula 05 vai tratar. Milho é armazenável, e por isso a planta pode operar de forma muito mais contínua ao longo do ano, comprando estoque e moendo conforme a programação industrial e não conforme a colheita. A rota se expandiu sobretudo no Centro-Oeste, aproveitando o milho de segunda safra, a logística regional e a integração com a cadeia de proteína animal; no primeiro levantamento 2026/27 a Conab registra o Centro-Oeste como região líder e aponta o Nordeste ganhando espaço com a entrada de novas unidades." },
    { kind: 'tabela', linhas: [["Cadeia", "Meses (maiúscula = ativo)"], ["Cana · Centro-Sul moagem típica", "jan · fev · mar · ABR · MAI · JUN · JUL · AGO · SET · OUT · NOV · dez"], ["Milho moagem típica", "JAN · FEV · MAR · ABR · MAI · JUN · JUL · AGO · SET · OUT · NOV · DEZ"]] },
    { kind: 'nota', tom: "neutro", label: null, html: "Esquema ilustrativo de janela operacional típica, não de qualquer unidade específica. O ponto não é o mês exato — é que o ciclo da cana no Centro-Sul atravessa dois anos-calendário e a operação com grão não precisa atravessar. Daí decorre toda a confusão de base temporal que este módulo ensina a desfazer." },
    { kind: 'paragrafo', html: "A economia da rota de milho não se lê pelo preço do milho. Ela se lê por um conjunto: preço do grão, receita dos coprodutos — <b>DDGS</b> (grãos secos de destilaria com solúveis, coproduto proteico destinado a ração), óleo de milho e dióxido de carbono biogênico —, custo da fonte térmica, frete, eficiência industrial, localização dos confinamentos que compram o DDGS e tratamento tributário aplicável. O coproduto não é bônus gratuito: ele exige mercado, especificação e logística próprios, e um DDGS sem confinamento a distância econômica é um custo de disposição, não uma receita." },
    { kind: 'nota', tom: "neutro", label: "A diferença térmica, que é o custo escondido da rota de milho", html: "A unidade de cana <b>queima o próprio resíduo</b>: o bagaço fornece o vapor de processo e, com caldeira e turbina adequadas, ainda gera excedente elétrico exportável. A unidade de milho <b>não tem resíduo combustível equivalente</b> e precisa contratar fonte térmica externa — biomassa comprada, cavaco, ou gás. Isso tem três consequências que aparecem em qualquer análise séria da rota: um custo operacional que a rota de cana não tem; uma exposição a preço de combustível que a rota de cana não tem; e uma <b>intensidade de carbono</b> que depende diretamente de qual fonte térmica foi contratada, e que por isso varia entre plantas que produzem exatamente a mesma molécula." },
    { kind: 'titulo', numero: "03.2", texto: "Segunda geração: a rota que disputa o bagaço com a caldeira" },
    { kind: 'paragrafo', html: "O etanol de segunda geração usa as frações celulósicas do <b>bagaço e da palha</b> — pré- tratamento, hidrólise, fermentação, separação e integração energética. Quimicamente, o produto final é etanol: a mesma molécula, o mesmo uso, a mesma especificação. A diferença está inteira na matéria-prima e na rota, e o argumento estratégico é produzir mais combustível por hectare já plantado, sem expandir área, acessando mercados que remuneram baixa intensidade de carbono." },
    { kind: 'paragrafo', html: "E aqui está a arbitragem em estado puro. <b>O bagaço tem no mínimo três destinos concorrentes dentro da mesma planta</b>, e o quarto está a uma decisão de distância:" },
    { kind: 'lista', itens: ["<b>Destino 1 · Vapor de processo</b> Uso interno obrigatório: sem vapor não há moagem, destilação nem cristalização. É o primeiro chamado sobre o bagaço, e não é negociável.", "<b>Destino 2 · Eletricidade exportada</b> Excedente após o vapor de processo, convertido em turbina e vendido à rede. Quanto mais eficiente a fábrica, mais vapor sobra para a turbina.", "<b>Destino 3 · Hidrólise · etanol 2G</b> Fibra retirada do circuito térmico para virar combustível líquido. Cada tonelada que vai para cá não gera vapor nem eletricidade.", "<b>Destino 4 · Venda como biomassa</b> Bagaço e palha comercializados para terceiros — caldeira industrial vizinha, pellet, papel e celulose — quando o preço regional supera o valor do uso interno."] },
    { kind: 'paragrafo', html: "Não existe leitura correta de um projeto de segunda geração que não feche esse balanço. Retirar fibra do circuito para a hidrólise significa <b>faltar vapor ou faltar exportação elétrica</b>, e o valor do 2G precisa superar o valor do que deixou de ser produzido, não apenas cobrir o próprio custo. É a mesma disciplina que o Módulo 08 exigiu para capacidade contra geração, aplicada agora a um insumo com múltiplos destinos." },
    { kind: 'tabela', linhas: [["O que precisa ser provado", "Evidência que fecha a questão", "Risco de aceitar sem provar"], ["Disponibilidade de biomassa", "Balanço fechado entre caldeira, palha recolhida, hidrólise e vendas externas, na mesma safra", "Retirar fibra e faltar vapor ou exportação elétrica no pico da safra"], ["Rendimento", "Litros por tonelada seca em regime estável, por campanha completa e não por batelada", "Tomar resultado de campanha piloto como desempenho replicável"], ["Investimento", "Custo completo com integração ao sítio existente e contingência declarada", "Subestimar complexidade de adaptação em planta em operação"], ["Custo operacional", "Consumo de enzimas e insumos químicos medido, tratamento de efluentes incluído", "Consumo real acima do modelo, corroendo a margem unitária"], ["Mercado", "Contrato firmado, prêmio de baixa intensidade de carbono aceito e certificação reconhecida pelo comprador", "Prêmio insuficiente para pagar o custo incremental da rota"], ["Escala e curva", "Curva de aprendizagem declarada, com utilização esperada por ano até o regime", "Longo período de baixa utilização destruindo o retorno projetado"]] },
    { kind: 'paragrafo', html: "A <b>Raízen</b> — a única empresa nomeada no Bloco 14 do currículo — informa produção comercial de etanol de segunda geração e divulga que o reaproveitamento de bagaço e palha pode elevar a produção por área em até 50%, além de certificações voluntárias de sustentabilidade. Trate isso com o mesmo critério que o Módulo 13 aplicou a qualquer informação de origem corporativa: <b>é informação da companhia, não dado de terceiro</b>, e precisa ser confrontada com volume efetivamente produzido, curva de ramp-up, custo unitário, consumo de enzimas e impacto sobre a bioeletricidade exportada da mesma planta. A estrutura de capital, a recuperação extrajudicial e a leitura de risco de crédito dessa companhia foram tratadas integralmente no Módulo 13 e <b>não se reabrem aqui</b>; esta aula desenvolve o lado agroindustrial, que lá era fronteira declarada." },
    { kind: 'nota', tom: "gold", label: "A régua de maturidade, reaproveitada do Módulo 12 sem alteração", html: "Projeto de rota nova — 2G, biometano, combustível de aviação — chega ao mercado em quatro estágios, e material de divulgação setorial <b>soma os quatro na mesma tabela de potencial</b>. <b>Memorando de intenção</b> não é projeto. <b>Estudo conceitual</b> não é projeto. <b>Planta anunciada sem financiamento fechado nem contrato de venda</b> não é projeto. <b>Planta com contrato, financiamento e licença</b> é projeto. Somar estágios diferentes numa mesma tabela é o modo característico de inflar um pipeline, e a régua funciona igual aqui e no Bloco 12." },
  ],
  'aula-14-04': [
    { kind: 'titulo', numero: "04.1", texto: "A rota, em um parágrafo" },
    { kind: 'paragrafo', html: "Biodiesel é produzido principalmente por <b>transesterificação</b> de óleos e gorduras com um álcool, gerando ésteres — o produto — e glicerina como coproduto. O produto puro, chamado <b>B100</b>, é misturado ao diesel A para formar o <b>diesel B</b>, que é o que existe na bomba. A especificação e o controle de qualidade estão na <b>Resolução ANP nº 920/2023</b>; a <b>Resolução ANP nº 989/2025</b> atualizou o método de ensaio de contaminação total sem alterar os limites — uma distinção que importa, porque mudança de método e mudança de limite produzem manchetes iguais e consequências muito diferentes. E em julho de 2026 a agência publicou regras de transição para <b>usos voluntários acima do teor obrigatório</b>, incluindo aplicações comunicadas com teores mais altos, o que abre uma frente industrial e de frota que não existia — e que não elimina teste de compatibilidade, garantia de equipamento nem gestão de qualidade ao longo da cadeia." },
    { kind: 'titulo', numero: "04.2", texto: "Os quatro estados de um percentual" },
    { kind: 'paragrafo', html: "Este é o conceito central da aula, e ele generaliza para o anidro, para o biometano e para qualquer política de conteúdo obrigatório que apareça no futuro. Um percentual de mistura <b>nunca é um número só</b>. No caso do biodiesel, em 2 de agosto de 2026, os quatro estados coexistem:" },
    { kind: 'lista', itens: ["Teto legal autorizado · B25 · Lei nº 14.993/2024, mediante viabilidade técnica comprovada", "Em vigor · B15 · desde 1º/8/2025", "Meta de trajetória · B20 até março de 2030", "Prazo legal vencido e não implementado · B16 previsto para março de 2026"] },
    { kind: 'paragrafo', html: "Leia o quarto estado com atenção, porque ele é o que quase nunca aparece em material de imprensa. A Lei do Combustível do Futuro previu a elevação para <b>B16 a partir de março de 2026</b>, condicionada à constatação de viabilidade técnica. A data passou. O percentual não subiu. Os testes técnicos foram iniciados em 2026 e o colegiado não bateu o martelo. Ou seja: existe no ordenamento um percentual com <b>data legal já vencida que não está em vigor</b> — e alguém que leia apenas o texto da lei, sem verificar a resolução, afirmará com convicção um número que não descreve nenhum litro de diesel vendido no Brasil hoje." },
    { kind: 'paragrafo', html: "Em 14 de julho de 2026 o conselho reuniu-se e alterou as regras de <b>fornecimento</b> do biodiesel destinado ao cumprimento do percentual obrigatório, determinando que ele venha exclusivamente de unidades autorizadas pela agência. Isso é uma mudança material de regra — e <b>não é</b> uma mudança de percentual. Confundir as duas foi um erro frequente na cobertura da mesma reunião que aprovou o E32. A pergunta de verificação correta diante de qualquer notícia de reunião de conselho é sempre a mesma: <em>mudou o número, mudou a regra de quem pode fornecer, ou mudou o prazo?</em>" },
    { kind: 'nota', tom: "alerta", label: "Números vivos · verificar na fonte antes de uso externo", html: "Percentual de biodiesel em vigor, teto legal, calendário de elevação e regras de fornecimento mudam por ato do Conselho Nacional de Política Energética e por resolução da agência, sem processo legislativo novo. Verificado em <b>2 de agosto de 2026</b>: B15 em vigor desde 1º de agosto de 2025; teto legal de 25% na Lei nº 14.993/2024 condicionado a viabilidade técnica comprovada; B16 com prazo legal de março de 2026 não implementado; trajetória legal apontando para 20% até março de 2030. <b>Antes de qualquer uso externo, reconfirme os quatro estados separadamente</b> em CNPE/MME e ANP. Nenhum deles substitui os outros." },
    { kind: 'titulo', numero: "04.3", texto: "A demanda que a regra cria" },
    { kind: 'paragrafo', html: "A aritmética é trivial e as consequências não são. A demanda teórica de B100 é o produto entre o volume de diesel B comercializado e o teor obrigatório. Isso significa que <b>um ponto percentual de mistura vale bilhões de litros de demanda garantida</b>, e que a decisão de mover esse ponto é, ao mesmo tempo, uma política de descarbonização, uma política industrial, uma política de renda agrícola e uma decisão de preço para todo consumidor de diesel do país. Os quatro efeitos são reais e simultâneos; escolher mencionar só um deles é o que caracteriza material de parte interessada, dos dois lados." },
    { kind: 'titulo', numero: "04.4", texto: "Matéria-prima, concentração e o trade-off que precisa ser dito" },
    { kind: 'paragrafo', html: "A cadeia brasileira de biodiesel é fortemente concentrada em <b>óleo de soja</b>, que responde pela maior parte das matérias-primas segundo o Balanço Energético Nacional 2026; sebo bovino, óleo de palma, óleo de cozinha usado e outras gorduras completam o quadro. A concentração cria escala, integração com a cadeia de proteína e previsibilidade de suprimento — e cria exposição direta a preço de soja, a câmbio, a decisão de exportação de grão e ao debate sobre uso do solo. A produção nacional de B100 cresceu 8,7% em 2025 sobre 2024, em ano-calendário, segundo a agência." },
    { kind: 'paragrafo', html: "Cada matéria-prima traz um perfil distinto de custo, de intensidade de carbono, de estabilidade a frio e de resistência à oxidação. Uma unidade pode aceitar múltiplas matérias-primas, mas flexibilidade química exige pré-tratamento, controle de impurezas e rastreabilidade — não é uma opção sem custo. E as propriedades de qualidade importam mais neste combustível que em qualquer outro do bloco, porque ele percorre armazenamento, transporte e distribuição antes de chegar ao motor: estabilidade à oxidação, teor de água e contaminação total, ponto de entupimento de filtro a frio, glicerídeos residuais, metanol residual e metais são críticos, e cada um deles tem um modo de falha operacional próprio." },
    { kind: 'nota', tom: "neutro", label: "Os dois lados, ditos por inteiro", html: "<b>A favor.</b> A política cria demanda previsível, viabiliza escala industrial nacional, internaliza parte do custo de carbono do transporte pesado, reduz importação de derivado fóssil, distribui renda para a cadeia agrícola e, por meio de programa de inclusão produtiva vinculado à aquisição de matéria-prima de agricultura familiar, alcança um público que nenhum outro instrumento energético alcança. <b>Contra.</b> A mistura obrigatória é, do ponto de vista de quem abastece, <b>um custo antes de ser um benefício ambiental</b>: se o biocombustível fosse mais barato que o fóssil, não precisaria ser obrigatório. Ela concentra renda em uma cadeia específica, cria dependência regulatória permanente, e pode mascarar ineficiência produtiva se a fiscalização de qualidade for fraca. A concentração em uma única oleaginosa vincula o preço do combustível ao mercado de alimentos. E o ganho climático líquido depende da intensidade de carbono da rota, que varia por planta — não do rótulo \"renovável\". Apresentar os dois lados <b>é o conteúdo desta aula</b>, não uma concessão a nenhum deles. Uma leitura que só apresenta um lado é reconhecível de longe, e quem a lê desconta o resto." },
    { kind: 'nota', tom: "gold", label: "Onde isso entra no produto", html: "Mistura obrigatória é o caso de uso canônico do <b>Regulatory Radar</b>. Os quatro estados de um percentual, o calendário legal que venceu sem implementação, a alteração de regra de fornecimento que não altera o teor, o prazo de 180 dias de uma medida excepcional — nada disso é acompanhável por um cliente industrial sozinho, porque muda por ato infralegal, sem processo legislativo, e frequentemente em edição extra do Diário Oficial. O que o produto entrega é rastreamento com norma, data de vigência e estado declarados. O que ele nunca entrega é recomendação de troca de combustível." },
  ],
  'aula-14-05': [
    { kind: 'titulo', numero: "05.1", texto: "Potência instalada, energia gerada, energia exportada" },
    { kind: 'paragrafo', html: "São três números diferentes para a mesma planta, e a distância entre eles é maior em bioenergia do que em qualquer outra fonte do currículo. A causa são dois fatores próprios deste setor: <b>a sazonalidade</b>, que faz uma usina com potência instalada X entregar energia por metade do ano; e o <b>autoconsumo</b>, que faz parte relevante da energia gerada nunca chegar à rede porque vira vapor e eletricidade de processo dentro da própria fábrica." },
    { kind: 'lista', itens: ["<b>Grandeza 1 · Potência instalada</b> Capacidade nominal do conjunto caldeira-turbina-gerador, em MW. É o número que aparece em release de inauguração e em base de capacidade da agência. Não descreve nenhuma entrega.", "<b>Grandeza 2 · Energia gerada</b> Produção bruta ao longo dos dias efetivos de safra, em MWh. Depende de dias de moagem, disponibilidade da planta, umidade e fibra do bagaço, e pressão da caldeira.", "<b>Grandeza 3 · Energia exportada</b> O que sobra depois do autoconsumo de processo e das perdas, e efetivamente entra na rede. É a única das três que gera receita de venda de energia.", "<b>Derivada · Fator de capacidade anual</b> Energia exportada dividida pelo produto entre potência instalada e as 8.760 horas do ano. É onde a frase \"energia firme na safra\" se resolve numericamente."] },
    { kind: 'titulo', numero: null, texto: "Energia exportável" },
    { kind: 'formula', eq: "Exportado = Geração bruta − Autoconsumo de processo − Perdas", desc: "Capacidade instalada não equivale a energia vendida, e a diferença aqui é maior que em qualquer fonte tratada no Módulo 08. Quanto mais eficiente a fábrica no uso de vapor de processo, mais sobra para a turbina — e a eficiência térmica da fábrica, que é uma variável industrial, aparece diretamente na receita elétrica." },
    { kind: 'titulo', numero: "05.2", texto: "A sazonalidade como complementaridade, não como defeito" },
    { kind: 'paragrafo', html: "O período de safra do Centro-Sul coincide, aproximadamente, com o período seco das principais bacias hidrográficas que sustentam a geração hidrelétrica brasileira. Isso não é coincidência retórica — é o que torna a cogeração a bagaço um <b>complemento sazonal à hidrologia</b>, e não um substituto anual dela. A planta entrega justamente quando o reservatório não entrega." },
    { kind: 'paragrafo', html: "Há uma verificação empírica disponível para 2025, e ela é limpa. Naquele ano, segundo o Anuário Estatístico de Energia Elétrica 2026, a geração hidráulica <b>recuou 4,8%</b> em condição hidrológica desfavorável, e o país operou com bandeira tarifária amarela em maio e dezembro e bandeira vermelha entre junho e novembro — ou seja, a bandeira mais cara cobriu quase exatamente a janela de moagem do Centro-Sul. No mesmo ano, a bioeletricidade atingiu <b>66,1 TWh</b>, geração recorde por mais um ano, elevando sua participação para <b>8,5% da matriz elétrica</b>, composta majoritariamente por bagaço de cana (60,9%) e licor preto (28,1%). A capacidade instalada de termelétricas a bagaço e outras biomassas cresceu 1,1 GW no ano." },
    { kind: 'nota', tom: "neutro", label: "Uma leitura fina que a maioria não faz", html: "O Balanço Energético Nacional 2026 registra, para o mesmo ano de 2025, uma <b>redução de 1,7% no uso de bagaço de cana</b> no consumo final do setor industrial, enquanto o licor preto subiu 6,3%. E a bioeletricidade bateu recorde. As duas coisas não se contradizem — elas medem grandezas diferentes. Consumo final de bagaço no setor industrial é uma medida de <b>energia contida no insumo consumido</b>; bioeletricidade é uma medida de <b>eletricidade entregue à rede</b>. Entre uma e outra estão a eficiência da caldeira, a pressão de operação, o rendimento da turbina e a fração de vapor destinada a processo. Uma planta que investe em caldeira de maior pressão entrega mais megawatt-hora exportado por tonelada de bagaço, e por isso pode aumentar a exportação elétrica sem aumentar — ou até reduzindo — o consumo de fibra. Quem cita as duas séries como se fossem a mesma coisa produz uma contradição que existe apenas na leitura." },
    { kind: 'titulo', numero: "05.3", texto: "Como essa energia aparece em contrato" },
    { kind: 'paragrafo', html: "Aqui a conexão com o Módulo 09 é obrigatória, e ela é o ponto que faz esta aula valer para quem vem do setor elétrico. Uma fonte que entrega em metade do ano <b>não se contrata como uma fonte que entrega o ano inteiro</b>. A energia de bagaço é vendida tanto no ambiente regulado quanto no livre, e nos dois casos a sazonalidade da entrega é exatamente o que torna a estrutura contratual dela diferente: exige sazonalização declarada do montante, exige tratamento explícito do período de entressafra, e exige que a diferença entre montante contratado e entrega física seja resolvida por algum mecanismo — flexibilidade contratual, modulação, compra de energia de terceiros para cobrir o período seco de produção, ou desconto no preço." },
    { kind: 'paragrafo', html: "Daí a leitura correta da palavra \"firme\": a energia é firme <b>enquanto a planta está moendo</b>, e a firmeza depende de combustível disponível, disponibilidade da planta, capacidade de conexão e do próprio contrato — não apenas da coincidência sazonal. Todo megawatt-hora de biomassa não é automaticamente firme, e a diferença entre potência contratada e energia entregue precisa estar declarada no contrato, com o mecanismo de cobertura do período em que a planta não gera." },
    { kind: 'titulo', numero: "05.4", texto: "Palha, licor preto e as outras biomassas" },
    { kind: 'paragrafo', html: "Bioenergia elétrica não é sinônimo de cana. O <b>licor preto</b>, subproduto da produção de celulose, responde por 28,1% da bioeletricidade brasileira em 2025 e tem um comportamento completamente diferente: ele acompanha a produção de celulose, que é industrial e não agrícola, e portanto <b>não tem a sazonalidade da cana</b>. Uma planta de celulose com recuperação de licor opera de forma contínua. Somar licor preto e bagaço numa única linha chamada \"biomassa\" e depois descrever essa linha como sazonal é um erro que aparece com frequência, e ele decorre exatamente de não perguntar a rota." },
    { kind: 'paragrafo', html: "A <b>palha</b> amplia o recurso disponível — é fibra que ficaria no campo —, mas o recolhimento excessivo tem custo agronômico real: afeta cobertura de solo, ciclagem de nutrientes, retenção de umidade e erosão, além de elevar o custo logístico por unidade de energia recolhida. A decisão de quanto recolher é um balanço entre energia, agronomia e usos concorrentes, e não uma otimização puramente energética. Cavaco e resíduo florestal exigem origem legal e manejo; casca de arroz exige destino para as cinzas; resíduo urbano exige controle de contaminantes e uma pergunta prévia sobre qual fração dele é sequer renovável." },
    { kind: 'nota', tom: "gold", label: "Onde isso entra no produto", html: "A separação entre as três grandezas é o tipo de rigor que sustenta uma análise setorial de <b>GridAlpha Research</b> e a distingue de material de divulgação: capacidade instalada é o número que qualquer um encontra, e energia exportada é o número que decide se existe receita. A capacidade analítica que esta aula constrói é a de nunca aceitar um único número para uma planta de bioenergia — e de perguntar, antes de qualquer conta, quantos dias por ano ela mói." },
  ],
  'aula-14-06': [
    { kind: 'titulo', numero: "06.1", texto: "Biogás não é biometano, e a diferença tem norma" },
    { kind: 'paragrafo', html: "<b>Biogás</b> é a mistura gasosa produzida por digestão anaeróbia: metano, dióxido de carbono, umidade e contaminantes, entre os quais sulfeto de hidrogênio e siloxanos. <b>Biometano</b> é o biogás purificado até atender à especificação da agência, apto a substituir gás natural em uso veicular, térmico, industrial ou por injeção em rede. Entre um e outro está uma planta de purificação, compressão e medição, com custo de capital e de operação próprios. Precificar biogás bruto como se fosse gás natural, sem incluir purificação, compressão, medição e logística, é o erro característico desta rota — e ele aparece em apresentação comercial com frequência desconfortável." },
    { kind: 'paragrafo', html: "As rotas de matéria-prima estão separadas em duas resoluções distintas, e vale saber qual se aplica: a <b>Resolução ANP nº 886/2022</b> trata do biometano oriundo de aterros sanitários e de estações de tratamento de esgoto; a <b>Resolução ANP nº 906/2022</b> cobre produtos e resíduos orgânicos agrossilvopastoris e comerciais — o que inclui vinhaça, torta de filtro, dejeto animal e resíduo agroindustrial. A agência mantém painel dinâmico com produtores autorizados, capacidade e matérias-primas processadas, e essa é a fonte primária para qualquer afirmação sobre tamanho efetivo do mercado." },
    { kind: 'titulo', numero: null, texto: "Equivalência energética" },
    { kind: 'formula', eq: "Energia anual = Volume (Nm³) × Poder calorífico inferior (MJ/Nm³)", desc: "Use o poder calorífico do contrato ou da especificação, não um valor de manual. Com 36 MJ por metro cúbico normal, 10 milhões de Nm³ equivalem a 360 TJ antes da eficiência do equipamento que vai queimar o gás. Equivalência energética não é equivalência de consumo: substituição real depende de eficiência do motor, densidade, pressão e regime operacional." },
    { kind: 'titulo', numero: "06.2", texto: "A rota de entrega decide a economia" },
    { kind: 'paragrafo', html: "Uma vez purificado, o biometano precisa chegar ao cliente, e é aqui que a rota se decide. Cada caminho de entrega tem uma vantagem e uma limitação, e a escolha entre eles é uma decisão de logística com consequência direta sobre o investimento necessário e sobre o preço mínimo viável." },
    { kind: 'tabela', linhas: [["Rota de entrega", "Vantagem", "Limitação que decide"], ["Uso térmico local", "Evita compressão e frete longo; menor investimento por unidade de energia entregue", "Exige cliente térmico junto à fonte, com demanda compatível e contínua"], ["Cogeração no próprio sítio", "Entrega eletricidade e calor a partir do mesmo gás", "Eficiência global depende do aproveitamento efetivo da parcela térmica"], ["Gás comprimido em carreta", "Atende cliente sem acesso a gasoduto", "Compressão, cilindros, distância e o custo do retorno vazio da carreta"], ["Gás liquefeito", "Densidade maior, viabiliza distâncias longas", "Liquefação é complexa e intensiva em energia; só fecha em escala"], ["Injeção em rede", "Escala e fungibilidade física com o gás natural", "Qualidade, ponto de conexão, tarifa de acesso e capacidade disponível na rede"], ["Combustível veicular dedicado", "Desloca diesel e reduz emissões locais da frota", "Exige frota adaptada, estação de abastecimento e contrato de prazo longo"]] },
    { kind: 'titulo', numero: "06.3", texto: "O programa que criou a demanda, e o estado dele hoje" },
    { kind: 'paragrafo', html: "Até 2024, biometano no Brasil era um mercado voluntário: quem comprava, comprava porque queria ou porque tinha meta própria. Isso mudou com a criação, pela <b>Lei nº 14.993/2024</b>, do Programa Nacional de Descarbonização do Produtor e Importador de Gás Natural e de Incentivo ao Biometano, regulamentado pelo <b>Decreto nº 12.614/2025</b>. A arquitetura é deliberadamente parecida com a do programa de biocombustíveis líquidos: o conselho fixa uma meta nacional anual de redução de emissões, a agência a individualiza entre os agentes obrigados conforme participação de mercado, e o cumprimento se dá pelo uso direto de biometano ou pela aquisição de certificados." },
    { kind: 'tabela', linhas: [["Marco", "O que estabelece"], ["Lei", "<b>Lei nº 14.993/2024</b>Cria o programa, dentro do pacote do Combustível do Futuro, junto com os programas de combustível sustentável de aviação, diesel verde e captura de carbono."], ["Decreto", "<b>Decreto nº 12.614/2025</b>Regulamenta o programa e atribui ao conselho a definição da meta anual compulsória e à agência a individualização."], ["Fev · 2026", "<b>Resoluções ANP nº 995/2026 e nº 996/2026</b>Aprovadas em 27 de fevereiro de 2026. A primeira disciplina a individualização das metas; a segunda regulamenta a certificação de origem, o credenciamento dos agentes certificadores, a geração de lastro e as regras de escrituração e registro do certificado."], ["Abr · 2026", "<b>Resolução CNPE nº 4/2026</b>Fixa a meta inicial de redução de emissões do mercado de gás natural em <b>0,5%</b> para 2026, em caráter excepcional, nos termos previstos na Lei nº 15.269/2025, considerando as condições correntes de oferta e infraestrutura."], ["Abr · 2026", "<b>Primeiro agente certificador credenciado</b>A agência credencia o primeiro agente certificador de origem do país, tornando operacional a emissão do certificado."]] },
    { kind: 'paragrafo', html: "Quatro precisões que separam quem leu a norma de quem leu a manchete. <b>Primeira:</b> a meta de 0,5% é expressa em <b>redução de emissões</b>, e não é uma obrigação volumétrica de 0,5% de todo o gás — as duas coisas produzem números diferentes. <b>Segunda:</b> estão sujeitos às metas individuais os produtores e importadores de gás natural com volume médio anual acima de um limiar definido em norma, o que significa que nem todo agente do mercado é agente obrigado. <b>Terceira:</b> as metas individuais relativas a 2026 têm publicação condicionada a um gatilho operacional ligado à emissão do primeiro certificado — ou seja, o cronograma efetivo depende de um evento de mercado, não apenas de calendário. <b>Quarta:</b> o certificado tem validade plurianual condicionada a monitoramento anual pelo agente certificador e a vistoria presencial na certificação inicial, com janelas de prazo específicas para a solicitação." },
    { kind: 'nota', tom: "neutro", label: "A resposta regulatória à dupla contagem, que quase ninguém cita", html: "A norma admite que a <b>mesma nota fiscal</b> gere simultaneamente um crédito de descarbonização e um certificado de garantia de origem de biometano. Isso soa como dupla contagem e é tratado como não sendo: para garantir transparência ao comprador, o registro do certificado de origem deve <b>declarar</b> que a mesma nota fiscal também gerou crédito de descarbonização, e há janela de prazo diferenciada para solicitação quando a emissão concomitante é possível. A pergunta correta de auditoria, portanto, deixa de ser \"houve dupla emissão?\" — que pode ser legítima — e passa a ser <b>\"o registro declara a emissão concomitante, e o contrato de venda diz quem é dono de cada atributo?\"</b>. Essa é a diferença entre uma pergunta de auditoria que a norma já respondeu e uma que ela deliberadamente deixou para o contrato." },
    { kind: 'nota', tom: "alerta", label: "Números vivos · verificar na fonte antes de uso externo", html: "Estado verificado em <b>2 de agosto de 2026</b>: programa criado por lei de 2024, regulamentado por decreto de 2025, com regulamentação operacional da agência concluída em fevereiro de 2026, meta nacional inicial de 0,5% fixada por resolução do conselho em abril de 2026 e primeiro agente certificador credenciado no mesmo mês. <b>Confirme na agência, na data de uso</b>: se as metas individuais de 2026 já foram publicadas, quantos certificados já foram efetivamente emitidos, e se houve alteração do percentual de meta para o ciclo seguinte. Um programa regulamentado não é o mesmo que um mercado com liquidez: <b>não atribua receita firme de certificado a nenhum projeto sem norma final aplicável, elegibilidade confirmada, contrato assinado e preço verificável</b>." },
    { kind: 'paragrafo', html: "Sobre potencial: existem estimativas oficiais de que uma fração relevante do consumo brasileiro de gasolina e diesel poderia ser substituída por biometano de resíduos agropecuários em condições modeladas. Isso é <b>potencial técnico-econômico espacial</b> — um exercício de mapeamento que responde \"onde e sob quais condições seria economicamente possível\". Não é previsão de produção, não é capacidade autorizada, não é volume contratado, e não implica infraestrutura existente. Aplique aqui a régua de maturidade da Aula 03 sem alteração, e nunca some estágios diferentes na mesma tabela." },
    { kind: 'nota', tom: "gold", label: "Onde isso entra no produto", html: "Marco regulatório de biometano é o segundo caso de uso canônico do <b>Regulatory Radar</b>, e por uma razão estrutural: entre a lei de 2024 e a operacionalização de 2026 há um decreto, duas resoluções de agência, uma resolução de conselho e um credenciamento — cinco atos infralegais em dezoito meses, nenhum deles com aviso prévio útil para um cliente industrial. O que o produto entrega é o estado de regulamentação declarado com norma, número e data. O que ele não entrega, nunca, é a conclusão de que um cliente deve investir na rota." },
  ],
  'aula-14-07': [
    { kind: 'titulo', numero: "07.1", texto: "A arquitetura, do conselho à aposentadoria" },
    { kind: 'paragrafo', html: "A política foi instituída pela <b>Lei nº 13.576/2017</b> e regulamentada pelo <b>Decreto nº 9.888/2019</b>. A engrenagem tem seis etapas, e cada uma tem um responsável, um documento e um modo próprio de falhar. Ler o programa sem essa separação é o que produz afirmações do tipo \"o governo paga um crédito por litro de etanol\", que não descreve nenhuma etapa real." },
    { kind: 'tabela', linhas: [["Etapa", "Quem faz", "Documento ou dado", "Modo de falhar"], ["Meta nacional", "Conselho Nacional de Política Energética", "Resolução anual, dentro de trajetória plurianual", "Mudança de trajetória e judicialização do próprio ato"], ["Meta individual", "Agência reguladora", "Despacho com a meta de cada distribuidor, por participação no mercado fóssil", "Ajustes, abatimentos e decisões judiciais deslocando o total"], ["Certificação da rota", "Firma inspetora credenciada, com aprovação da agência", "Certificado da produção eficiente e nota de eficiência calculada em ferramenta oficial", "Dado agrícola ou industrial incorreto na origem do cálculo"], ["Emissão", "Produtor certificado, via escriturador", "Nota fiscal de venda do biocombustível e fator de emissão da rota", "Volume inelegível, duplicado ou fora da janela de solicitação"], ["Negociação", "Bolsa e participantes", "Preço, custódia e posição registrada", "Volatilidade, iliquidez e formação de estoque estrutural"], ["Aposentadoria", "Distribuidor obrigado, ou parte não obrigada por escolha", "Retirada definitiva do crédito de circulação", "Atraso, insuficiência e sanção"]] },
    { kind: 'paragrafo', html: "Duas observações estruturais que a tabela não diz. <b>A primeira</b>: o produtor não recebe crédito por ter capacidade instalada. Ele precisa estar certificado, <em>vender</em> volume elegível e comprovar a documentação — capacidade autorizada não gera nenhum crédito. <b>A segunda</b>: a mesma companhia pode estar dos <em>dois</em> lados do mesmo mercado. Um grupo integrado que produz etanol certificado e também distribui combustível fóssil é emissor primário de um lado e agente obrigado do outro — a <b>Raízen</b> é o exemplo nomeável, e a leitura correta da posição dela no programa exige olhar as duas pontas, não uma." },
    { kind: 'titulo', numero: "07.2", texto: "Meta nacional não é a soma das metas individuais" },
    { kind: 'paragrafo', html: "Este é o ponto em que quase toda leitura de imprensa erra, e ele tem prova aritmética direta no ciclo corrente. A <b>Resolução CNPE nº 21, de 30 de dezembro de 2025</b>, fixou a meta nacional de 2026 em <b>48,09 milhões</b> de créditos. Em 31 de março de 2026 a agência publicou as metas individuais compulsórias definitivas, calculadas a partir daquela meta nacional conforme a metodologia de participação de mercado. A soma das metas individuais definitivas ficou em <b>49,01 milhões</b> — cerca de 1,9% <em>acima</em> da meta nacional." },
    { kind: 'tabela', linhas: [["Lado", "Valor", "Leitura"], ["Meta nacional · 2026", "48,09 mi", "Fixada por <b>Resolução CNPE nº 21/2025</b>, publicada em 30 de dezembro de 2025. É o valor central da meta compulsória anual de redução de emissões para a comercialização de combustíveis."], ["Soma das metas individuais · 2026", "49,01 mi", "Publicada pela agência em <b>31 de março de 2026</b>. Reflete a metodologia de individualização, os abatimentos por contrato de longo prazo com produtor certificado e ajustes de ciclos anteriores. As três maiores distribuidoras concentram 52,7% do total."]] },
    { kind: 'paragrafo', html: "Os dois números estão corretos e medem coisas diferentes. Quem cita um deles como \"a meta do RenovaBio\" sem dizer qual está produzindo um número que não pode ser comparado com o de nenhum outro ciclo nem com o de nenhuma outra fonte. E a distinção não é acadêmica: ela explica um par de percentuais que circulou de forma contraditória sobre o ciclo anterior. Em 2025, foram aposentados cerca de 40 milhões de créditos, equivalentes a <b>99%</b> da meta nacional daquele ano, de 40,39 milhões; as metas individuais ajustadas somaram 45,28 milhões, e o cumprimento contra <em>elas</em> foi de <b>88%</b>. Dois percentuais, o mesmo ano, o mesmo programa, denominadores diferentes. Quem escolhe um e omite o outro produz uma narrativa — de sucesso ou de fracasso, conforme a escolha." },
    { kind: 'titulo', numero: "07.3", texto: "Como o crédito nasce: intensidade de carbono e nota de eficiência" },
    { kind: 'paragrafo', html: "Um crédito de descarbonização representa <b>uma tonelada de dióxido de carbono equivalente evitada</b> segundo a metodologia do programa. A quantidade que um produtor pode emitir depende de três coisas: o volume de biocombustível efetivamente comercializado, a energia contida nesse volume, e a diferença entre a intensidade de carbono do combustível fóssil de referência e a intensidade certificada da rota daquela planta." },
    { kind: 'titulo', numero: null, texto: "Estimativa conceitual — não é a fórmula regulatória" },
    { kind: 'formula', eq: "Créditos ≈ Volume × Densidade energética × (IC fóssil − IC da rota) ÷ 10⁶", desc: "Com volume em litros, densidade energética em MJ por litro e intensidades em gramas de CO₂ equivalente por MJ, a divisão por um milhão converte gramas em toneladas. A fórmula exata, os fatores de elegibilidade e os arredondamentos seguem a regra da agência — esta expressão existe para ensinar de onde vem a ordem de grandeza, não para substituir o cálculo oficial nem para ser citada como método." },
    { kind: 'paragrafo', html: "A intensidade de carbono é calculada em ferramenta oficial de ciclo de vida, que produz a <b>nota de eficiência energético-ambiental</b> da unidade. Entram produção agrícola, insumos, energia consumida na conversão, transporte, tratamento de coprodutos e demais parâmetros da rota. A <b>Resolução ANP nº 984/2025</b> consolidou as regras de certificação; os certificados têm validade plurianual, sujeita a renovação e a monitoramento." },
    { kind: 'paragrafo', html: "A consequência prática é a que mais importa para leitura: <b>duas plantas que produzem a mesma molécula podem ter notas diferentes</b>. Cana própria com alta produtividade, baixo consumo de diesel na operação agrícola, fertilização eficiente, cogeração renovável cobrindo a demanda térmica e logística curta produz um resultado diferente de matéria-prima distante com energia térmica fóssil. Na rota de milho, a origem do grão, a secagem, a fonte térmica contratada e o método de alocação atribuído aos coprodutos são decisivos. Na rota de biometano, capturar metano que seria emitido pode produzir um benefício elevado — e vazamentos ao longo da cadeia reduzem esse benefício de forma desproporcional, porque o próprio metano é o produto." },
    { kind: 'nota', tom: "neutro", label: "Seis lugares onde uma alegação de carbono se desfaz", html: "<b>Fronteira</b> — declarar do campo ao uso, conforme a regra do programa, e não apenas a emissão da chaminé. <b>Coprodutos</b> — aplicar método de alocação documentado, e não atribuir todo o impacto ao produto menos conveniente. <b>Uso da terra</b> — rastrear elegibilidade da área e expansão, incluindo deslocamento indireto. <b>Metano</b> — medir vazamento e destruição, e não assumir captura perfeita. <b>Eletricidade</b> — usar fator de emissão coerente com o contrato, e não chamar energia de rede de totalmente renovável sem atributo correspondente. <b>Titularidade</b> — definir contratualmente quem é dono do atributo e quem o aposenta, para que a mesma redução não seja vendida duas vezes." },
    { kind: 'titulo', numero: "07.4", texto: "O preço, e por que ele é a grandeza mais volátil do módulo" },
    { kind: 'paragrafo', html: "O crédito é negociado em bolsa, e portanto tem preço de mercado formado por oferta e demanda. A demanda é a obrigação anual das distribuidoras; a oferta é a emissão dos produtores certificados, que acompanha a produção de biocombustível. Quando a produção cresce e a obrigação não acompanha, forma-se <b>estoque estrutural</b> — e foi exatamente o que aconteceu." },
    { kind: 'paragrafo', html: "O mercado abriu 2026 com cerca de <b>19,5 milhões</b> de créditos em estoque, a maior parte deles em mãos de produtores. Com esse estoque acumulado e com projeção de produção recorde de etanol, o preço operou em 2026 nos menores níveis desde 2020, na faixa de poucas dezenas de reais por crédito — contra patamar superior a cem reais observado em 2024. A judicialização por parte de distribuidores inadimplentes deslocou demanda e adicionou uma camada de incerteza que não é de mercado, é jurídica." },
    { kind: 'nota', tom: "alerta", label: "Números vivos · verificar na fonte antes de uso externo", html: "<b>Preço de crédito de descarbonização é a grandeza mais volátil deste módulo inteiro, e por isso não aparece cravado em nenhuma linha de prosa deste ativo.</b> Ele existe apenas como <b>entrada editável</b> do instrumento abaixo, com fonte e data no próprio painel. A referência correta é o índice de preço médio do crédito publicado pela bolsa registradora, consultado na data de uso. O valor padrão carregado no instrumento reflete a ordem de grandeza observada no primeiro semestre de 2026 e <b>deve ser substituído</b> antes de qualquer uso externo. É a mesma disciplina que o Módulo 09 estabeleceu para preço de curto prazo de energia elétrica: não se crava." },
    { kind: 'nota', tom: "gold", label: "Onde isso entra no produto", html: "Meta anual, individualização, regime de penalidade, metodologia de nota de eficiência, validade de certificado: cinco variáveis que mudam por ato infralegal e que determinam se existe receita ambiental em um projeto — território direto do <b>Regulatory Radar</b>. E há uma aplicação de <b>GridAlpha Research</b> específica: quando a soma das metas individuais diverge da meta nacional, quem acompanha só a manchete não vê a divergência. A capacidade analítica que esta aula constrói é a de sempre perguntar qual denominador está sendo usado antes de citar um percentual de cumprimento — e a de nunca tratar receita de atributo ambiental como receita contratada." },
  ],
  'aula-14-08': [
    { kind: 'paragrafo', html: "O último campo de cada ficha — <b>\"o que este número não diz\"</b> — está propositalmente incompleto. Ele é exercício: preencha-o antes de olhar o instrumento seguinte, e depois confira contra o que o verificador devolve." },
    { kind: 'titulo', numero: null, texto: "Etanol de cana · primeira geração ROTA 01 · Rota de referência da cadeia sucroenergética" },
    { kind: 'tabela', linhas: [["Insumo e origem", "Caldo e melaço de <b>cana-de-açúcar</b>. Concentração histórica no Centro-Sul, com participação relevante do Nordeste em ciclo agrícola distinto. Insumo <b>perecível</b>: exige moagem em horas após a colheita, o que amarra a operação industrial ao calendário agrícola."], ["Rota de conversão", "Moagem e extração do caldo, tratamento, fermentação alcoólica, destilação — e, para o anidro, uma etapa adicional de desidratação."], ["Produto e uso final", "Hidratado para uso direto em veículo flexível; anidro para mistura obrigatória na gasolina C; etanol neutro para química, bebidas e cosméticos."], ["Escala e sazonalidade", "Projeção de <b>29,26 bilhões de litros</b> na <b>safra 2026/27</b>, alta de 7,1% — sendo 18,29 bi L de hidratado e 10,97 bi L de anidro. Fonte: Conab, 1º Levantamento, divulgado em 28 de abril de 2026. Base temporal: <b>ano-safra</b>, ciclo iniciado em abril de 2026. Primeiro de quatro levantamentos; sujeito a três revisões."], ["Marco e órgão", "Especificação e controle de qualidade na <b>Resolução ANP nº 907/2022</b>. Percentual de mistura do anidro fixado por resolução do <b>CNPE</b>, dentro de teto legal da Lei nº 14.993/2024. Estado: regulamentado e vigente; percentual de mistura em estado <b>excepcional e temporário</b> desde 1º/8/2026."], ["Onde entra na matriz", "Matriz <b>energética</b>, no setor de transportes. Não entra na matriz elétrica — a eletricidade da mesma planta vem da rota 06, e são coisas distintas."], ["Produto concorrente", "<b>Açúcar</b>, pelo mesmo ATR. É a arbitragem central do setor, limitada pela faixa de alternância da unidade."], ["O que este número não diz", "<b>Exercício.</b> Um volume de etanol de cana em ano-safra não diz o mix praticado, não diz quanto veio de área nova contra produtividade, e não diz… Complete com pelo menos mais dois itens antes de seguir."]] },
    { kind: 'titulo', numero: null, texto: "Etanol de milho ROTA 02 · Rota sem sazonalidade de safra da mesma forma" },
    { kind: 'tabela', linhas: [["Insumo e origem", "<b>Milho</b>, sobretudo de segunda safra, com concentração no Centro-Oeste e entrada de novas unidades no Nordeste. Insumo <b>armazenável</b>, o que permite operação industrial muito mais contínua ao longo do ano."], ["Rota de conversão", "Moagem do grão, liquefação e sacarificação do amido, fermentação, destilação e desidratação, com separação dos coprodutos."], ["Produto e uso final", "Etanol hidratado e anidro — quimicamente idênticos aos da rota 01 — mais <b>DDGS</b> para ração, óleo de milho e dióxido de carbono biogênico."], ["Escala e sazonalidade", "<b>25%</b> da produção nacional de etanol em <b>ano-calendário 2025</b> (BEN 2026, EPE). Projeção de <b>11,43 bilhões de litros</b> na <b>safra 2026/27</b>, alta de 12,3% (Conab, 1º Levantamento). Base temporal: os dois números têm bases distintas e <b>não são comparáveis entre si</b> sem conversão declarada. Ver §00.1."], ["Marco e órgão", "Mesma especificação de produto da rota 01, <b>Resolução ANP nº 907/2022</b>: o etanol de milho não é um combustível diferente. Autorização de produção e painel de capacidade na <b>ANP</b>. Estado: regulamentado e vigente, sem regime específico por matéria-prima."], ["Onde entra na matriz", "Matriz <b>energética</b>, transportes. Pode aparecer marginalmente na matriz elétrica se a planta cogerar com biomassa contratada — o que é decisão de projeto, não característica da rota."], ["Produto concorrente", "<b>Milho para ração, para exportação e para alimentação humana.</b> Não disputa ATR com açúcar — disputa grão com a cadeia de proteína, e devolve parte dele como DDGS."], ["O que este número não diz", "<b>Exercício.</b> Uma participação percentual do milho no etanol nacional não diz de qual base temporal veio, não diz qual fonte térmica a planta usou, e não diz… Complete com pelo menos mais dois itens."]] },
    { kind: 'titulo', numero: null, texto: "Etanol de segunda geração ROTA 03 · Compete pelo insumo da própria cogeração" },
    { kind: 'tabela', linhas: [["Insumo e origem", "Frações celulósicas de <b>bagaço e palha</b> — o mesmo insumo da rota 06, retirado do circuito térmico da própria planta. Origem geográfica é a da unidade sucroenergética que a hospeda."], ["Rota de conversão", "Pré-tratamento da fibra, hidrólise enzimática da celulose, fermentação, separação e integração energética com a planta de primeira geração."], ["Produto e uso final", "Etanol — a <b>mesma molécula</b> da rota 01. A diferença comercial está na matéria-prima e na intensidade de carbono certificada, não no produto."], ["Escala e sazonalidade", "Escala nacional pequena diante das rotas 01 e 02. Produção comercial informada por operador do setor; volumes efetivos, curva de ramp-up e utilização precisam ser confirmados em fonte da própria companhia. Base temporal: informação corporativa; declare o exercício social ou o ano-safra de referência antes de citar qualquer número desta rota."], ["Marco e órgão", "Mesma especificação de produto, <b>ANP</b>. A rota tem tratamento diferenciado apenas na camada de <b>certificação de intensidade de carbono</b>, onde a nota tende a ser distinta da rota 01. Estado: regulamentado como etanol; sem marco próprio de rota."], ["Onde entra na matriz", "Matriz <b>energética</b>, transportes — e, indiretamente, <b>reduz</b> a contribuição da mesma planta à matriz elétrica, ao consumir fibra que iria para a turbina."], ["Produto concorrente", "<b>Vapor de processo, eletricidade exportada e venda de biomassa a terceiros</b> — três destinos concorrentes para o mesmo bagaço, dentro da mesma unidade. É a arbitragem mais limpa do módulo."], ["O que este número não diz", "<b>Exercício.</b> Um volume de etanol de segunda geração não diz quanto de exportação elétrica deixou de existir na mesma planta, não diz o consumo de enzimas por litro, e não diz… Complete com pelo menos mais dois itens."]] },
    { kind: 'titulo', numero: null, texto: "Biodiesel ROTA 04 · Mercado criado e dimensionado por conteúdo obrigatório" },
    { kind: 'tabela', linhas: [["Insumo e origem", "Óleos e gorduras: <b>óleo de soja</b> como matéria-prima majoritária, com sebo bovino, óleo de palma, óleo de cozinha usado e outras gorduras completando. Produção concentrada nas regiões Sul e Centro-Oeste, próxima ao esmagamento."], ["Rota de conversão", "<b>Transesterificação</b> do óleo ou gordura com um álcool, gerando ésteres — o B100 — e glicerina como coproduto."], ["Produto e uso final", "B100 misturado ao diesel A para formar diesel B, mais glicerina. Desde julho de 2026 há regras de transição para <b>usos voluntários acima do teor obrigatório</b> em aplicações comunicadas."], ["Escala e sazonalidade", "Produção nacional de B100 com alta de <b>8,7% em ano-calendário 2025</b> sobre 2024 (ANP, Anuário Estatístico 2026, publicado em 26 de junho de 2026). Base temporal: <b>ano-calendário</b>. A rota não tem sazonalidade de safra própria — tem sazonalidade de oferta de matéria-prima, que é outra coisa."], ["Marco e órgão", "Especificação na <b>Resolução ANP nº 920/2023</b>, com método de contaminação total atualizado pela <b>Resolução ANP nº 989/2025</b> sem alteração de limites. Teor obrigatório fixado por resolução do <b>CNPE</b>. Estado: <b>B15</b> em vigor desde 1º/8/2025; teto legal de 25% na Lei nº 14.993/2024 mediante viabilidade técnica; B16 com prazo legal de março de 2026 <b>não implementado</b>."], ["Onde entra na matriz", "Matriz <b>energética</b>, transportes. Não entra na matriz elétrica."], ["Produto concorrente", "<b>Óleo de soja para alimentação e para exportação</b>, e crescentemente <b>diesel verde e combustível de aviação</b>, que disputam a mesma matéria-prima por rotas diferentes."], ["O que este número não diz", "<b>Exercício.</b> Um volume de B100 produzido não diz qual matéria-prima o originou, não diz se o teor que o demandou é teto, vigente ou anunciado, e não diz… Complete com pelo menos mais dois itens."]] },
    { kind: 'titulo', numero: null, texto: "Biogás e biometano ROTA 05 · Economia de logística e de escala mínima" },
    { kind: 'tabela', linhas: [["Insumo e origem", "<b>Resíduos orgânicos</b>: vinhaça e torta de filtro de usina, dejeto animal, resíduo agroindustrial, aterro sanitário e esgoto. Insumo <b>distribuído</b> — é essa dispersão, e não a tecnologia, que define a economia da rota."], ["Rota de conversão", "Digestão anaeróbia produzindo biogás; purificação até a especificação, com remoção de dióxido de carbono, umidade e contaminantes, gerando biometano."], ["Produto e uso final", "Biogás para uso térmico ou cogeração no próprio sítio; biometano para injeção em rede, uso industrial, gás comprimido em carreta ou combustível veicular dedicado. Digestato como subproduto com destino a definir."], ["Escala e sazonalidade", "Capacidade autorizada e produção efetiva estão no painel dinâmico de produtores da <b>ANP</b>, atualizado periodicamente — <b>consulte a base, não a estimativa de potencial</b>. Sem sazonalidade de safra própria, mas com sazonalidade de disponibilidade de substrato quando o insumo é resíduo de usina. Base temporal: painel com data-base declarada; use a data-base, não o ano."], ["Marco e órgão", "<b>Resolução ANP nº 886/2022</b> para aterro e esgoto; <b>Resolução ANP nº 906/2022</b> para resíduos agrossilvopastoris e comerciais. Programa de incentivo criado pela <b>Lei nº 14.993/2024</b>, regulamentado pelo <b>Decreto nº 12.614/2025</b>, operacionalizado pelas <b>Resoluções ANP nº 995 e nº 996/2026</b>, com meta inicial de 0,5% fixada pela <b>Resolução CNPE nº 4/2026</b>. Estado: regulamentado; mercado de certificado em <b>fase inicial de operação</b> — primeiro agente certificador credenciado em abril de 2026."], ["Onde entra na matriz", "Matriz <b>energética</b> como gás; matriz <b>elétrica</b> apenas na parcela que vai para cogeração. Uma das duas rotas do módulo que pode aparecer nas duas matrizes — e nunca nas duas com o mesmo metro cúbico."], ["Produto concorrente", "<b>Outros destinos do mesmo resíduo</b>: fertirrigação da vinhaça, compostagem, disposição, ou simplesmente a emissão do metano para a atmosfera — que é o cenário de referência contra o qual o benefício climático da rota é medido."], ["O que este número não diz", "<b>Exercício.</b> Um potencial de biometano em metros cúbicos não diz o raio econômico de coleta, não diz se existe cliente na distância assumida, e não diz… Complete com pelo menos mais dois itens."]] },
    { kind: 'titulo', numero: null, texto: "Cogeração a bagaço ROTA 06 · Complementaridade sazonal à hidrologia" },
    { kind: 'tabela', linhas: [["Insumo e origem", "<b>Bagaço</b> resultante da moagem, mais <b>palha</b> recolhida do campo em fração variável. Origem estritamente vinculada à unidade que mói — não há mercado nacional líquido de bagaço."], ["Rota de conversão", "Queima em caldeira gerando vapor de alta pressão, expansão em turbina, geração de eletricidade e extração de vapor de processo para a fábrica."], ["Produto e uso final", "<b>Vapor de processo</b> para uso interno e <b>eletricidade</b> — parcela autoconsumida e parcela exportada à rede, vendida no ambiente regulado ou no livre."], ["Escala e sazonalidade", "Bioeletricidade total de <b>66,1 TWh</b> e <b>8,5% da matriz elétrica</b> em <b>ano-calendário 2025</b>, com bagaço respondendo por 60,9% e licor preto por 28,1% (EPE, Anuário Estatístico de Energia Elétrica 2026). <b>Sazonal por construção</b>: entrega concentrada na janela de moagem. Base temporal: <b>ano-calendário</b>. Compare com o dado de safra apenas com conversão declarada."], ["Marco e órgão", "Capacidade instalada e geração efetiva na <b>ANEEL</b> e no <b>ONS</b>; comercialização na <b>CCEE</b>. Regras contratuais e de sazonalização seguem o ambiente de contratação, tratado no Módulo 09. Estado: regulamentado e vigente; sem regime especial por combustível."], ["Onde entra na matriz", "Matriz <b>elétrica</b> — a única das seis rotas cujo produto principal é eletricidade. Também aparece na matriz energética como consumo de bagaço no setor industrial, que é <b>outra grandeza</b>."], ["Produto concorrente", "<b>Etanol de segunda geração e venda de biomassa a terceiros</b>, pelo mesmo bagaço; e, dentro da própria planta, o <b>vapor de processo</b>, que tem prioridade absoluta sobre a exportação."], ["O que este número não diz", "<b>Exercício.</b> Uma potência instalada de cogeração não diz quantos dias por ano a planta mói, não diz o autoconsumo de processo, e não diz… Complete com pelo menos mais dois itens."]] },
    { kind: 'titulo', numero: "08.1", texto: "O classificador: dado um insumo, o que sai e o que deixa de sair" },
    { kind: 'titulo', numero: "08.2", texto: "O verificador: enunciados verdadeiros e insuficientes" },
    { kind: 'paragrafo', html: "Este é o instrumento assinatura do módulo, e ele funciona como o Verificador de Lacuna do Módulo 13. Cada enunciado abaixo é <b>verdadeiro</b>. Cada um é citável. E nenhum é utilizável como está — porque falta base temporal, falta rota, há confusão entre grandezas, ou falta o produto concorrente. Leia o enunciado, decida <em>antes de clicar</em> qual dos quatro defeitos ele tem, e só então confira." },
    { kind: 'nota', tom: "neutro", label: "O critério, em uma sequência de um minuto", html: "Diante de qualquer número de bioenergia, três perguntas em ordem. <b>Um — base temporal:</b> isto é ano-safra ou ano-calendário, e qual ciclo? Se for safra, é levantamento preliminar ou fechamento? <b>Dois — rota:</b> de qual insumo, por qual conversão? \"Etanol\" não é uma rota; etanol de cana de primeira geração é. <b>Três — concorrente:</b> o que deixou de ser feito com o mesmo insumo para que este número existisse? Se as três tiverem resposta, o número é utilizável. Se qualquer uma faltar, a resposta correta ao interlocutor não é discordar — é <b>perguntar</b>, e a pergunta certa quase sempre encerra a discussão sem que ninguém precise ter razão." },
    { kind: 'nota', tom: "gold", label: "Onde isso entra no produto", html: "A ficha de campo fixo é a estrutura de dado que sustenta qualquer produto comparativo, e a disciplina do campo \"o que este número não diz\" é o que impede uma base de rotas de virar um ranking. Para <b>GridAlpha Research</b>, é a diferença entre uma análise setorial de agro que um cliente institucional usa e um resumo que ele já tinha. A independência aqui não é postura: é o motivo pelo qual o campo do concorrente existe na ficha — quem vende uma rota nunca preenche esse campo." },
  ],
};

/** Os CATORZE exercícios do § Ex. Todos SOLTOS: a varredura por
 *  `/[Aa]ula\s*\d+/` no resumo, no enunciado E no gabarito dos catorze
 *  devolve ZERO ocorrência — a fonte não vincula nenhum a aula
 *  específica. É o padrão desde o Módulo 04 (protocolo §4), agora pelo
 *  sétimo módulo seguido. A tag literal da fonte fica em `config.tag`. */
export const MODULO_14_EXERCICIOS_SOLTOS: LessonActivity[] = [
  {
    id: "m14-ex-01",
    kind: 'discursiva',
    prompt: "Uma apresentação afirma: \"o Brasil produziu 40,7 bilhões de litros de etanol\". Esse dado é comparável a uma estatística elétrica de 2025?",
    points: 10,
    config: { tag: "Ex 01 · Base temporal", gabarito: "Não, e a resposta correta identifica a ambiguidade <b>antes</b> de tentar a comparação. O valor de 40,69 bilhões de litros é a projeção do primeiro levantamento da Conab para o <b>ano-safra 2026/27</b> — ciclo iniciado em abril de 2026 e encerrado em março de 2027. Uma estatística elétrica de 2025 é de <b>ano-calendário</b>. As duas janelas não coincidem, e a diferença pode chegar a doze meses. Além disso, o número é <b>projeção de primeiro levantamento</b>, sujeito a três revisões ao longo do ciclo, enquanto a estatística elétrica é realizada. Duas incompatibilidades, não uma. A pergunta correta ao interlocutor é: \"de qual base temporal é esse número, e é levantamento ou fechamento?\"" },
  },
  {
    id: "m14-ex-02",
    kind: 'discursiva',
    prompt: "Uma cogeração tem 80 MW de potência instalada. Quanta energia ela entrega à rede no ano?",
    points: 10,
    config: { tag: "Ex 02 · Grandeza", gabarito: "A resposta correta <b>recusa responder</b> com a informação dada, e nomeia as três grandezas separadamente. Faltam: <b>dias efetivos de safra</b>, <b>disponibilidade da planta dentro da safra</b> e <b>autoconsumo de vapor e eletricidade de processo</b>. Com 210 dias de safra, 88% de disponibilidade e 55% de autoconsumo, os 80 MW produzem cerca de 355 GWh brutos e entregam cerca de 160 GWh à rede — um fator de capacidade anual em torno de 23%, contra os 100% que a multiplicação ingênua por 8.760 horas sugeriria. Potência instalada, energia gerada e energia exportada são <b>três números</b>, e só o terceiro gera receita de venda de energia." },
  },
  {
    id: "m14-ex-03",
    kind: 'discursiva',
    prompt: "Um interlocutor afirma que a mistura de biodiesel no diesel é de 16%. Está em vigor?",
    points: 10,
    config: { tag: "Ex 03 · Estado de política", gabarito: "Não. Em 2 de agosto de 2026, o teor em vigor é <b>B15</b>, vigente desde 1º de agosto de 2025. O B16 estava previsto na Lei nº 14.993/2024 para <b>março de 2026</b>, condicionado a viabilidade técnica comprovada — a data passou e o percentual não subiu; os testes foram iniciados em 2026 e o conselho não deliberou a elevação. A resposta completa distingue os quatro estados: <b>teto legal autorizado</b> de 25% mediante viabilidade técnica; <b>em vigor</b> B15; <b>trajetória legal</b> apontando para 20% até março de 2030; e <b>prazo legal vencido e não implementado</b>, que é o caso do B16. Onde verificar: resolução do CNPE e página da ANP, na data de uso." },
  },
  {
    id: "m14-ex-04",
    kind: 'discursiva',
    prompt: "Dado o insumo \"bagaço de cana\", qual rota, qual produto, qual órgão competente, e o que deixou de ser feito?",
    points: 10,
    config: { tag: "Ex 04 · Rota", gabarito: "Há <b>quatro destinos concorrentes</b> para o mesmo bagaço, e a resposta correta os nomeia. <b>Um:</b> vapor de processo — uso interno, prioridade absoluta, sem ele não há moagem. <b>Dois:</b> queima em caldeira e turbina gerando eletricidade exportada — órgão competente ANEEL para outorga e capacidade, ONS para operação, CCEE para comercialização. <b>Três:</b> hidrólise para etanol de segunda geração — órgão competente ANP, produto etanol. <b>Quatro:</b> venda como biomassa a terceiros. Cada tonelada que vai para um dos destinos <b>não</b> vai para os outros três, e é essa a informação que quase nunca acompanha um número de 2G ou de bioeletricidade." },
  },
  {
    id: "m14-ex-05",
    kind: 'discursiva',
    prompt: "Uma base prepara 10 milhões de litros de gasolina C sob o teor em vigor em agosto de 2026. Quanto de anidro e de gasolina A, ignorando variação volumétrica?",
    points: 10,
    config: { tag: "Ex 05 · Cálculo", gabarito: "Sob <b>E32</b>, vigente desde 1º de agosto de 2026 por Resolução CNPE nº 9/2026: <b>3,2 milhões de litros de anidro</b> e <b>6,8 milhões de litros de gasolina A</b>. Sob o teor anterior, E30, seriam 3,0 e 7,0 milhões. A diferença de dois pontos percentuais move <b>200 mil litros</b> nesta única base — e é a mesma aritmética que, na escala nacional, o governo apresentou como razão para deixar de importar volume relevante de gasolina. Note também: o exercício exige declarar o teor <b>e a data</b>, porque a medida tem vigência de 180 dias prorrogável uma vez, e a gasolina premium permanece em E25." },
  },
  {
    id: "m14-ex-06",
    kind: 'discursiva',
    prompt: "Uma distribuidora comercializa 200 milhões de litros de diesel B. Quanto de B100 está incorporado?",
    points: 10,
    config: { tag: "Ex 06 · Cálculo", gabarito: "Sob B15: <b>30 milhões de litros</b>. Se o teor subisse para B16, seriam 32 milhões — <b>2 milhões de litros de demanda adicional criados por um único ponto percentual</b>, nesta distribuidora. Multiplique pela escala nacional do diesel B e você tem a razão pela qual um ponto de mistura é objeto de disputa política contínua, e por que uma entidade que representa produtores tem interesse declarado nessa variável." },
  },
  {
    id: "m14-ex-07",
    kind: 'discursiva',
    prompt: "A agência reporta 35,9 bilhões de litros de etanol e a companhia de abastecimento reporta 37,5 bilhões para períodos próximos. Uma das duas está errada?",
    points: 10,
    config: { tag: "Ex 07 · Base temporal", gabarito: "Nenhuma. As duas medem coisas diferentes, e a coexistência é normal. A agência consolida <b>produção por ano-calendário</b>, por produto autorizado. A companhia de abastecimento reporta <b>safra</b>, em janela agrícola, e pode agregar etanol de cana e de milho conforme a metodologia do levantamento. Cobertura, origem e janela diferem. Antes de comparar qualquer par de números deste setor, alinhe quatro coisas: <b>período, unidade, produto e cobertura</b>. Se qualquer uma das quatro divergir, a comparação precisa de conversão declarada ou não deve ser feita." },
  },
  {
    id: "m14-ex-08",
    kind: 'discursiva',
    prompt: "Um projeto de biometano informa volume anual de 8 milhões de Nm³ com poder calorífico inferior de 36 MJ/Nm³. Qual a energia anual, e o que esse número não diz?",
    points: 10,
    config: { tag: "Ex 08 · Grandeza", gabarito: "<b>288 milhões de MJ</b>, ou 288 mil GJ, ou 288 TJ. O que esse número <b>não</b> diz: se o volume é capacidade autorizada, produção efetiva ou volume vendável após autoconsumo, perdas e indisponibilidade; se o poder calorífico é o do contrato ou um valor de manual; qual a distância até o cliente e por qual rota de entrega; e qual a eficiência do equipamento que vai queimar o gás — porque equivalência energética não é equivalência de consumo. Quatro perguntas antes de o número virar dado." },
  },
  {
    id: "m14-ex-09",
    kind: 'discursiva',
    prompt: "Uma unidade mói 2,5 milhões de toneladas de cana a 140 kg de ATR por tonelada. Qual o ATR total, e por que ele importa mais que a tonelagem?",
    points: 10,
    config: { tag: "Ex 09 · Cálculo", gabarito: "<b>350 milhões de quilos de ATR</b> antes de perdas industriais. Importa mais que a tonelagem porque é sobre o ATR, e não sobre a cana, que incide a decisão de mix: cada quilo de ATR pode virar açúcar ou etanol, e a remuneração relativa dos dois destinos é o sinal de arbitragem. Duas unidades com a mesma moagem e ATR diferente têm bases de produto recuperável diferentes, e portanto receitas potenciais diferentes com o mesmo mix." },
  },
  {
    id: "m14-ex-10",
    kind: 'discursiva',
    prompt: "Uma notícia informa que o conselho \"aprovou mudanças na mistura de biodiesel\" em julho de 2026. O teor mudou?",
    points: 10,
    config: { tag: "Ex 10 · Estado de política", gabarito: "Não. Na reunião de 14 de julho de 2026, o colegiado alterou as regras de <b>fornecimento</b> — determinando que o biodiesel destinado ao cumprimento do percentual obrigatório venha exclusivamente de unidades autorizadas pela agência — <b>sem</b> alterar o teor, que permanece em B15. Na mesma reunião foi aprovada a elevação do etanol anidro na gasolina para 32%. Duas decisões, dois combustíveis, naturezas distintas, uma manchete só. A pergunta de verificação diante de qualquer notícia de reunião de conselho é sempre a mesma: <b>mudou o número, mudou a regra de quem fornece, ou mudou o prazo?</b>" },
  },
  {
    id: "m14-ex-11",
    kind: 'discursiva',
    prompt: "Uma planta produz etanol usando gás natural como fonte térmica. Isso é possível, e o que muda?",
    points: 10,
    config: { tag: "Ex 11 · Rota", gabarito: "É possível e é característico da <b>rota de milho</b>, que não tem resíduo combustível equivalente ao bagaço e precisa contratar fonte térmica externa — biomassa comprada, cavaco ou gás. O que muda: um custo operacional que a rota de cana não tem; uma exposição a preço de combustível que a rota de cana não tem; e, decisivamente, uma <b>intensidade de carbono diferente</b>, porque a energia consumida na conversão entra no cálculo de ciclo de vida. Duas plantas produzindo a mesma molécula podem ter notas de eficiência distintas exatamente por isso — e é por isso que \"etanol\" não é uma rota, e a nota de eficiência é por unidade produtora, não por combustível." },
  },
  {
    id: "m14-ex-12",
    kind: 'discursiva',
    prompt: "Uma apresentação soma \"potencial de biometano de resíduos\" com \"capacidade autorizada\" e com \"produção\" numa única tabela de mercado. Qual o defeito?",
    points: 10,
    config: { tag: "Ex 12 · Grandeza", gabarito: "São <b>três estágios diferentes</b> somados como se fossem a mesma grandeza, e o defeito é o mesmo que a régua de maturidade do Módulo 12 catalogou. <b>Potencial</b> é mapeamento técnico-econômico: responde \"onde seria possível\", não \"onde existe\". <b>Capacidade autorizada</b> é ato administrativo: existe planta habilitada, não necessariamente operando. <b>Produção</b> é medição. E falta ainda a quarta: <b>volume contratado</b>, que é o único que gera receita. Somar estágios diferentes na mesma tabela é o modo característico de inflar um mercado, e a correção é separar as colunas e declarar a data-base de cada uma." },
  },
  {
    id: "m14-ex-13",
    kind: 'discursiva',
    prompt: "Uma rota vende 100 milhões de litros elegíveis, com 21,1 MJ/L e diferencial de intensidade de carbono de 55 gCO₂e/MJ. Qual a ordem de grandeza de créditos, e por que é apenas teto?",
    points: 10,
    config: { tag: "Ex 13 · Cálculo", gabarito: "100.000.000 × 21,1 × 55 = 116,05 bilhões de gramas, ou cerca de <b>116.050 toneladas de CO₂ equivalente</b> — ordem de grandeza de 116 mil créditos. É <b>teto conceitual</b> por três razões: a fórmula exata, os fatores de elegibilidade e os arredondamentos seguem a regra da agência; o volume precisa ser efetivamente comercializado e documentado, não produzido; e a nota de eficiência precisa estar vigente na data. Além disso, o valor econômico depende do preço formado em bolsa, que variou de mais de cem reais por crédito em 2024 para poucas dezenas em 2026 — e por isso <b>nunca se crava</b> receita de atributo ambiental em caso base de projeto." },
  },
  {
    id: "m14-ex-14",
    kind: 'discursiva',
    prompt: "Um interlocutor entusiasmado afirma: \"o Brasil já resolveu o transporte com etanol\". Responda.",
    points: 10,
    config: { tag: "Ex 14 · Síntese", gabarito: "A resposta correta <b>nem confirma nem desmente</b> — devolve grandeza, base temporal e trade-off. Quatro movimentos. <b>Um:</b> qual fração do consumo energético do setor de transportes é renovável, em qual ano-calendário, segundo qual fonte? <b>Dois:</b> por qual rota — etanol de cana, de milho, biodiesel, biometano? A composição muda a conclusão. <b>Três:</b> qual parcela dessa fração existe por <b>decisão regulatória</b> — mistura obrigatória — e qual existe por escolha de consumidor no ponto de abastecimento? São mecanismos diferentes com durabilidades diferentes. <b>Quatro:</b> à custa de qual uso alternativo do insumo, e com qual intensidade de carbono certificada por rota? Quem responde assim não parece cético nem entusiasmado — parece quem leu. É a mesma disciplina que o Módulo 12 exigiu para \"o Brasil é uma boa aposta?\" e o Módulo 13 para \"essa ação é uma boa compra?\"." },
  },
];

export const MODULO_14_AULAS: CurriculumAula[] = [
  {
    id: "aula-14-01",
    moduleId: 'modulo-14',
    number: 1,
    totalInModule: 8,
    title: "Etanol hidratado e etanol anidro",
    subtitle: "Dois produtos da mesma destilaria, dois mercados que não se parecem em nada",
    track: 'brasil',
    language: 'pt-BR',
    durationMinutes: null,
    difficulty: null,
    submercados: [],
    competencies: [],
    illustrations: [],
    video: null,
    references: [],
    activities: [],
    instruments: [],
  },
  {
    id: "aula-14-02",
    moduleId: 'modulo-14',
    number: 2,
    totalInModule: 8,
    title: "O mix açúcar-etanol",
    subtitle: "A arbitragem que a planta faz todo dia, e a restrição que o preço relativo não mostra",
    track: 'brasil',
    language: 'pt-BR',
    durationMinutes: null,
    difficulty: null,
    submercados: [],
    competencies: [],
    illustrations: [],
    video: null,
    references: [],
    activities: [],
    instruments: [],
  },
  {
    id: "aula-14-03",
    moduleId: 'modulo-14',
    number: 3,
    totalInModule: 8,
    title: "Rotas alternativas de etanol",
    subtitle: "Uma rota que não tem safra do mesmo jeito, e outra que come o insumo da própria caldeira",
    track: 'brasil',
    language: 'pt-BR',
    durationMinutes: null,
    difficulty: null,
    submercados: [],
    competencies: [],
    illustrations: [],
    video: null,
    references: [],
    activities: [],
    instruments: [],
  },
  {
    id: "aula-14-04",
    moduleId: 'modulo-14',
    number: 4,
    totalInModule: 8,
    title: "Biodiesel e a política de conteúdo obrigatório",
    subtitle: "Como um percentual fixado por resolução cria um mercado inteiro — e quem paga por ele",
    track: 'brasil',
    language: 'pt-BR',
    durationMinutes: null,
    difficulty: null,
    submercados: [],
    competencies: [],
    illustrations: [],
    video: null,
    references: [],
    activities: [],
    instruments: [],
  },
  {
    id: "aula-14-05",
    moduleId: 'modulo-14',
    number: 5,
    totalInModule: 8,
    title: "Bagaço, cogeração e a sazonalidade",
    subtitle: "Três números para a mesma planta, e por que meio ano de entrega é complementaridade",
    track: 'brasil',
    language: 'pt-BR',
    durationMinutes: null,
    difficulty: null,
    submercados: [],
    competencies: [],
    illustrations: [],
    video: null,
    references: [],
    activities: [],
    instruments: [],
  },
  {
    id: "aula-14-06",
    moduleId: 'modulo-14',
    number: 6,
    totalInModule: 8,
    title: "Biogás e biometano",
    subtitle: "O resíduo como insumo, e uma economia que é de logística e de escala mínima",
    track: 'brasil',
    language: 'pt-BR',
    durationMinutes: null,
    difficulty: null,
    submercados: [],
    competencies: [],
    illustrations: [],
    video: null,
    references: [],
    activities: [],
    instruments: [],
  },
  {
    id: "aula-14-07",
    moduleId: 'modulo-14',
    number: 7,
    totalInModule: 8,
    title: "RenovaBio e o crédito de descarbonização",
    subtitle: "O produto que não é físico: quem tem obrigação, como o preço se forma, e por que ele não pode ser cravado",
    track: 'brasil',
    language: 'pt-BR',
    durationMinutes: null,
    difficulty: null,
    submercados: [],
    competencies: [],
    illustrations: [],
    video: null,
    references: [],
    activities: [],
    instruments: [],
  },
  {
    id: "aula-14-08",
    moduleId: 'modulo-14',
    number: 8,
    totalInModule: 8,
    title: "Síntese — ler uma cadeia",
    subtitle: "Seis fichas de campo fixo, e um campo deixado deliberadamente em branco",
    track: 'brasil',
    language: 'pt-BR',
    durationMinutes: null,
    difficulty: null,
    submercados: [],
    competencies: [],
    illustrations: [],
    video: null,
    references: [],
    activities: [],
    instruments: [],
  },
];

/** Instrumento de MÓDULO — o do § MAP, fora de qualquer aula. Populado
 *  na fase de cálculo desta wave. */
export const MODULO_14_INSTRUMENTOS: Instrument[] = [];
