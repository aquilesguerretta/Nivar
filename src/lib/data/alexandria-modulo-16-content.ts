// alexandria-modulo-16-content.ts
// Bloco 16 — Tendências e Disrupções. Nível 3, track 'brasil'.
// QUARTO módulo da Trilha 3 (blocos 13-17).
//
// CATÁLOGO CONFIRMADO no arquivo real, não herdado:
//   { id: 'bloco-16', level: 3, track: 'brasil',
//     title: 'Tendências e Disrupções', illustrationPrefix: null }
// O título da FONTE bate com o catálogo — <title> e <h1> literais.
//
// EXTRAÍDO de `Alexandria modulos/alexandria_modulo16.html` — 438.245
// bytes (342.086 de markup + 96.142 de <script>), a maior fonte do
// currículo até aqui.
//
// ── DIFERENÇA ESTRUTURAL DESTA FONTE (protocolo §6) ──────────
// 7.842 ENTIDADES HTML NOMEADAS em 29 tipos (`&atilde;` 1.936,
// `&ccedil;` 1.412, `&mdash;` 559, `&eta;` 3…), contra 4 no Módulo 14
// e ZERO no Módulo 12. Sem decodificar, todo texto extraído sai
// corrompido — e o defeito não aparece em contagem de bloco nenhuma,
// só na leitura. O walker decodifica as 29 mais as básicas, e o gate
// de fechamento é zero entidade sem tradução no arquivo inteiro.
//
// ── CONTAGEM POR TRÊS SINAIS (protocolo §5) ──────────────────
// 21 seções = 10 aulas + 11 de aparato (o §Fichas · Seis tendências
// é seção própria, com 12.951 chars — aparato, não corpo de aula).
//   aulas        10  (10 seções casando `Aula NN`)
//   instrumentos 11  (1 no §MAP, 10 em aula)
//   exercícios   16  (16 `<details>` no §Ex; o §Ex declara "Dezesseis")
//   termos       184 (184 `.term` no §Lex)
//
// ── COBERTURA DE TEXTO, por token (protocolo §5) ─────────────
// 167 blocos nas dez aulas, com o markup dos instrumentos descontado
// do denominador:
//   a01 99,2% · a02 99,6% · a03 99,9% · a04 99,8% · a05 99,9%
//   a06 99,8% · a07 99,6% · a08 99,7% · a09 99,6% · a10 99,8%
// A a10 media 91,6% na primeira rodada: o ramo de `div.chain` usava
// as chaves de `cn5-*`, que não existem lá, e produzia par vazio —
// 93 tokens perdidos. Corrigido, e `chain` passou a `lista`.
//
// ── PAR CHAVE-VALOR VAI PARA `nota`, NUNCA `tabela` ──────────
// Protocolo §14 (Wave 47): o componente `Tabela` trata a primeira
// linha como `<thead>` sempre, o que comeria o primeiro par como
// cabeçalho. Então `div.tri`, `div.grg`, `div.cad`, `div.cn5` e
// `div.par` viram `nota` com as linhas em <b>chave</b> — valor. Só as
// seis `div.scroll > table`, que têm `<th>` real na fonte, viram
// `tabela`.
//
// ── VOCABULÁRIO DE MATURIDADE TECNOLÓGICA — confirmado ───────
// A pista do brief se confirma: o módulo é um radar de seis
// tendências lido por TRÊS LENTES, e a lente é o que o `sec-id` de
// cada aula declara — Lente de Estágio (a01, a07), Lente de Gargalo
// (a02, a05, a06, a09), Lente de Carga (a03, a04, a08), Síntese
// (a10). Vocabulário que nenhum módulo anterior teve motivo de usar:
// estágio de maturidade, anúncio × outorga × solicitação ×
// implantação, gargalo vinculante, carga rígida × flexível, fila de
// conexão em cinco estágios, atrás × à frente do medidor.
//
// ── TÍTULO: vem do <h2>, e o `sec-id` vira subtítulo ─────────
// INVERSÃO deliberada em relação aos módulos anteriores, e é da
// fonte, não minha: aqui o `sec-id` NÃO carrega título, carrega o
// rótulo da lente — "Aula 03 · Lente de Carga". Três aulas dizem
// "Lente de Carga" e quatro dizem "Lente de Gargalo", então usar o
// `sec-id` como `title` deixaria a lista de aulas com títulos
// repetidos e o aluno sem saber qual é qual. O `<h2>` carrega o
// título real e distinto de cada uma. Os dois campos continuam
// literais da fonte — só trocaram de lugar.
//
// ── GRAVURA: ZERO, dois sinais concordando (protocolo §7) ────
// `illustrationPrefix: null` no catálogo E zero `<img>` no markup.
//
// ── video / durationMinutes / difficulty: null MEDIDOS ───────
// Zero <video>, <iframe>, youtube, vimeo, .mp4 e <audio>.

import type { CurriculumAula, Instrument, LessonActivity } from '@/lib/types/alexandria';
import type { AulaBloco } from './alexandria-modulo-01-content';

export const MODULO_16_LEAD: Record<string, string> = {
  'aula-16-01': "“Em formação” não é um estado. É a ausência de um. A frase aparece no currículo para descrever o mercado regulado de carbono, aparece em quase todo material de consultoria sobre armazenamento, e aparece em apresentação de fabricante sobre medição avançada — e nas três ocorrências ela cobre realidades incompatíveis. Esta aula substitui a frase por uma posição testável.",
  'aula-16-02': "Toda curva de crescimento encontra uma restrição. A pergunta útil não é se a restrição existe — existe sempre —, e sim qual das cinco está vinculando <em>hoje</em>, porque só a que vincula responde por mudança de trajetória. Os outros quatro candidatos podem ser reais, caros e irritantes, e ainda assim não mover nada se forem resolvidos.",
  'aula-16-03': "Esta é a tendência mais medida do bloco e a mais mal convertida. Existe dado mensal de emplacamento, existe série histórica longa, existe contagem de pontos de recarga — e mesmo assim quase toda afirmação pública sobre o impacto da frota elétrica na rede erra por um de três motivos: soma categorias que não consomem da rede, confunde energia anual com potência instantânea, ou ignora que o horário decide tudo.",
  'aula-16-04': "Esta é a quarta vez que o currículo encontra o mesmo erro estrutural. O Módulo 08 separou capacidade instalada de energia gerada. O Módulo 14 separou potência instalada, energia gerada e energia exportada. O Módulo 15 separou recurso, reserva e produção. Aqui a separação é mais consequente que as três anteriores, porque <b>“X MW de armazenamento” não é um número incompleto: é um número sem significado</b>.",
  'aula-16-05': "O currículo descreve este tópico em duas linhas: “rede inteligente no Brasil, atrasada em comparação estrangeira” e “infraestrutura avançada de medição e as disputas regulatórias em torno dela”. A segunda linha é o objeto real. A primeira tem três problemas de uma vez, e tratá-los é mais útil do que omiti-los — a seção 05.5 faz isso.",
  'aula-16-06': "A geração distribuída é integralmente Módulo 11 — compensação, marco legal, enquadramento e as dez fichas estão lá, e não se reabrem aqui. Neste bloco, “geração distribuída continua crescendo” é <b>um marcador de tendência, não um tópico</b>. O objeto novo é o que vem depois: a <b>agregação</b> de recursos distribuídos, a microrrede e a comunidade de energia — três coisas que o Módulo 11 não desenvolveu e que estão em três estágios diferentes.",
  'aula-16-07': "O currículo descreve o mercado regulado brasileiro como “em formação”. Esta aula substitui a expressão por dispositivos, datas e estados — e o resultado é mais interessante do que a frase sugere, porque <b>há um prazo legal já vencido, uma obrigação já correndo para um setor específico, e nenhum órgão gestor permanente constituído</b>. Os três fatos convivem, e nenhum material que trate o tema como bloco único consegue mostrar isso.",
  'aula-16-08': "",
  'aula-16-09': "Esta é a única das seis famílias do currículo que <b>não acrescenta nem retira um megawatt do sistema</b>. Inteligência artificial aplicada a previsão, a despacho, a negociação e a inspeção é uma <em>ferramenta</em>, e por isso ela não entra na lente de carga — entra na lente de gargalo, do outro lado: ela é candidata a <em>desvincular</em> gargalos que outras tendências enfrentam. Tratá-la como tendência de demanda é confundir a ferramenta com o centro de dados que a executa, que é a Aula 08.",
  'aula-16-10': "A segunda metade do critério de domínio pede mapear quais empresas brasileiras estão posicionadas para capturar cada tendência. A resolução declarada no §00.6 é que <b>o ativo entrega a grade e a conversa entrega os nomes</b>. Esta aula constrói a grade, e ela é mais útil do que uma lista de nomes seria — porque uma lista envelhece em meses e um método de verificação, não.",
};

/** 167 blocos nas dez aulas, na ordem do documento. */
export const MODULO_16_CORPO: Record<string, AulaBloco[]> = {
  'aula-16-01': [
    { kind: 'titulo', numero: "01.1", texto: "Por que anúncio, outorga e operação são três números diferentes" },
    { kind: 'paragrafo', html: "Um empreendimento de geração, de armazenamento ou de consumo intensivo atravessa uma sequência de estados antes de existir fisicamente, e <b>cada estado produz um número público</b>. O anúncio produz um número de investimento e de potência. O pedido de acesso produz um número de potência solicitada. A outorga produz um número de potência autorizada. O contrato de uso produz um número de potência contratada. A energização produz um número de potência disponível. E a operação produz o único número que descreve carga: o medido." },
    { kind: 'paragrafo', html: "A distorção não vem de má-fé. Vem de assimetria de custo: <b>protocolar um pedido custa quase nada e energizar custa quase tudo</b>. Quando protocolar é barato, o agente racional protocola em mais de um ponto de conexão para o mesmo projeto, protocola cedo para reservar posição na fila, e protocola por opção mesmo com decisão de investimento pendente. O resultado é que a soma dos pedidos descreve <em>opções tomadas</em>, não <em>carga futura</em> — e a razão entre a soma dos pedidos e a carga que efetivamente se materializa é rotineiramente de vários múltiplos." },
    { kind: 'nota', tom: "gold", label: "A pergunta que você faz", html: "Diante de qualquer número de capacidade futura: <b>este número foi anunciado, solicitado, autorizado, contratado, energizado ou medido?</b> Se a fonte não disser, o número não entra na sua planilha — entra na sua lista de coisas a verificar. E se a fonte disser “previsto”, a pergunta seguinte é: previsto por quem, em qual cenário entre os alternativos, e o que acontece com quem não cumprir." },
    { kind: 'titulo', numero: "01.2", texto: "A régua aplicada às seis tendências" },
    { kind: 'nota', tom: "neutro", label: "Anúncio contra operação", html: "<b>Nível 1.</b> Dizer que vai construir uma casa não é o mesmo que ter uma casa. As duas coisas aparecem no jornal com a mesma palavra, mas só numa delas dá pra morar.<br><b>Nível 2.</b> Anúncio é intenção de investir; operação é ativo produzindo. Entre os dois há terreno, capital, licença, conexão, obra, comissionamento e cliente — e a taxa de conversão entre um e outro não é uma constante nem entre setores nem entre ciclos. Planejamento que trata os dois como o mesmo número superestima capacidade instalada e subestima prazo de entrada em operação, simultaneamente.<br><b>Nível 3.</b> A assimetria é de custo de opção: protocolar pedido de acesso tem custo marginal próximo de zero e valor de opção positivo, o que produz sobre-solicitação estrutural — múltiplos pontos de conexão para um mesmo projeto e reserva especulativa de posição na fila. A resposta regulatória típica é exigir garantia vinculada ao pedido, o que converte opção gratuita em opção precificada e reduz o denominador da razão solicitado/energizado sem que a demanda real tenha mudado. Consequência analítica: uma queda na fila de pedidos pode significar aperto de garantia, e não arrefecimento de demanda." },
    { kind: 'nota', tom: "neutro", label: "Onde isso entra no produto", html: "A régua de estágio é a camada de metadado que separa uma síntese analítica de um agregador de notícias. Um agregador reproduz o comunicado; uma síntese diz em que posição o comunicado está e o que faltaria para movê-lo. É exatamente essa distinção que o <b>GridAlpha Energy Brief</b> entrega semanalmente — e a única maneira honesta de entregá-la é classificar antes de comentar." },
  ],
  'aula-16-02': [
    { kind: 'titulo', numero: "02.1", texto: "O que significa “vincular”" },
    { kind: 'paragrafo', html: "Um candidato vincula quando <b>relaxá-lo, sozinho, altera a trajetória</b>. É a mesma noção de restrição ativa que o Módulo 04 usou em formação de preço: a restrição que está no limite é a que tem preço sombra diferente de zero. As demais estão folgadas, e mexer nelas gasta esforço sem produzir efeito." },
    { kind: 'paragrafo', html: "Daí decorrem duas disciplinas que este módulo aplica sem exceção. A primeira: <b>gargalo se desloca</b>. Resolver a regra transfere a pressão para a conexão; resolver a conexão transfere para a cadeia de suprimento. Uma classificação de gargalo tem data, e a data importa mais aqui do que em qualquer outra categoria do módulo. A segunda: <b>dizer quais não vinculam é parte da análise</b>, não educação. Quando um relatório lista cinco “desafios” sem hierarquia, ele está recusando a fazer o trabalho." },
    { kind: 'titulo', numero: "02.2", texto: "Por que conexão à rede é o mais subestimado" },
    { kind: 'paragrafo', html: "Os quatro primeiros candidatos aparecem em qualquer apresentação de estratégia. O quinto raramente aparece, e há três razões estruturais para isso. <b>Primeira:</b> conexão é um problema local, e apresentação de estratégia é um documento nacional — a média esconde a restrição. <b>Segunda:</b> a informação de capacidade remanescente de escoamento por ponto não circula com a mesma facilidade que preço de equipamento, o que faz o gargalo parecer ausente para quem não o consultou. <b>Terceira:</b> o prazo de reforço de rede é medido em anos e determinado por processo de planejamento e de licitação — ou seja, ele não responde a capital privado no mesmo horizonte em que responde a decisão de investimento. Um projeto pode ter dinheiro, equipamento, licença e cliente, e ainda assim esperar reforço." },
    { kind: 'paragrafo', html: "Há uma consequência analítica que vale para os seis temas deste módulo: <b>quando o gargalo é conexão, a localização vira variável de primeira ordem</b>. Deixa de fazer sentido perguntar “quanto de armazenamento cabe no país” e passa a fazer sentido perguntar “quanto cabe naquele barramento, naquele ano”. Foi por isso que a metodologia de capacidade remanescente virou documento público do planejamento e do operador para o certame de armazenamento." },
    { kind: 'nota', tom: "gold", label: "Onde isso entra no produto", html: "A lente de gargalo é o que transforma acompanhamento regulatório em inteligibilidade. Saber que uma consulta pública abriu é informação; saber que <em>aquela</em> consulta trata do candidato que está vinculando <em>aquela</em> tendência é análise. É a função do <b>Regulatory Radar</b>, que acompanha a produção normativa dos órgãos do setor elétrico brasileiro e devolve o que muda para quem. <b>Ressalva declarada:</b> a descrição interna desse produto no plano de negócios enumera reguladores de duas jurisdições estrangeiras. Essa descrição <b>nunca</b> é citada verbatim em ativo publicado — sempre parafraseada, e sempre restrita aos órgãos brasileiros." },
  ],
  'aula-16-03': [
    { kind: 'titulo', numero: "03.1", texto: "A taxonomia que decide o número" },
    { kind: 'paragrafo', html: "“Eletrificado” é um rótulo comercial, não uma categoria elétrica. Ele agrupa cinco tecnologias, e <b>duas delas não consomem um único quilowatt-hora da rede</b>. Para carga, o único corte que importa é: <em>tem tomada externa?</em>" },
    { kind: 'tabela', linhas: [["Categoria", "Tomada externa", "O que mede", "Entra na carga?"], ["Veículo elétrico a bateria", "Sim", "Substituição integral do combustível no uso", "<b>Sim</b>, todo o quilômetro rodado"], ["Híbrido plug-in", "Sim", "Pode rodar eletricamente se for recarregado", "<b>Sim, parcialmente</b> — venda não garante uso elétrico"], ["Híbrido sem tomada", "Não", "Eficiência e regeneração de frenagem", "<b>Não</b>"], ["Híbrido flex sem tomada", "Não", "Eficiência com combustível flexível", "<b>Não</b>"], ["Micro-híbrido", "Não", "Assistência elétrica leve", "<b>Não</b> — e infla a estatística quando entra na conta"]] },
    { kind: 'paragrafo', html: "Com os dados do primeiro semestre de 2026: dos <b>215.023</b> veículos leves “eletrificados” comercializados, <b>90.626</b> foram elétricos a bateria e <b>76.400</b> foram híbridos plug-in — total de <b>167.026 com tomada</b>, ou 77,7% do rótulo. Os outros 47.997 são híbridos sem tomada e não acrescentam nenhuma carga ao sistema. E os micro-híbridos, que somaram 29.938 unidades no mesmo período, sequer entram no rótulo — mas entram nele em vários materiais." },
    { kind: 'nota', tom: "alerta", label: "Números vivos · verificados em 04/08/2026", html: "<b>Participação e volume:</b> 215.023 leves eletrificados no primeiro semestre de 2026, com participação de 15,8% no acumulado do semestre e recorde mensal de 18,3% em junho, contra 223.912 unidades e 9,3% no ano inteiro de 2025. <b>Composição do semestre:</b> 90.626 a bateria (42,2%), 76.400 plug-in (35,5%), 24.078 híbridos flex (11,2%) e 23.919 híbridos (11,1%). <b>Recarga:</b> 25.429 pontos públicos e semipúblicos em junho de 2026, 21% acima da apuração de fevereiro (21.061), sendo 34% de corrente contínua. <b>Ônibus:</b> 589 unidades no semestre, contra 306 no mesmo período de 2025. <b>Rotulagem obrigatória da fonte:</b> os números de emplacamento e de pontos de recarga acima são compilados e divulgados por <b>entidade setorial do veículo elétrico</b> e por plataforma privada de mobilidade — agentes com interesse declarável na aceleração que reportam. São citados como <em>posição com dado</em>, não como origem de número neutro. A base oficial de emplacamento é o registro nacional de veículos, sob a autoridade de trânsito; a verificação antes de uso externo se faz lá." },
    { kind: 'titulo', numero: "03.2", texto: "A conversão, e por que ela precisa de duas contas" },
    { kind: 'paragrafo', html: "Frota vira carga por duas contas separadas, e o erro mais comum é fazer só a primeira. A primeira devolve <b>energia</b>: quanto o conjunto consome no ano. A segunda devolve <b>potência</b>: quanto ele puxa num instante. As duas medem coisas diferentes e produzem conclusões diferentes sobre o mesmo conjunto de veículos." },
    { kind: 'titulo', numero: null, texto: "Energia anual da frota" },
    { kind: 'formula', eq: "E = N × km × e ÷ η", desc: "N é o número de veículos com tomada ; km é a quilometragem anual média; e é o consumo específico em kWh por quilômetro; η é a eficiência da recarga, que inclui perdas do carregador e da bateria. O resultado é a energia retirada da rede , não a energia entregue às rodas." },
    { kind: 'titulo', numero: null, texto: "Potência coincidente de recarga" },
    { kind: 'formula', eq: "P = N × P ponto × fc", desc: "P ponto é a potência nominal de cada carregador e fc é o fator de coincidência — a fração dos pontos em recarga simultânea no instante crítico. O fator de coincidência decide o resultado inteiro , e é a variável menos observada das cinco. Somar todas as potências nominais é um erro; assumir coincidência próxima de zero, o erro oposto." },
    { kind: 'titulo', numero: "03.3", texto: "A ordem de grandeza, e por que ela desarma os dois extremos" },
    { kind: 'paragrafo', html: "O planejamento setorial publicou, no caderno de eletromobilidade do plano decenal, uma projeção de consumo associado a veículos eletrificados subindo de <b>627 GWh em 2025 para 7,8 TWh em 2035</b>. Contra o consumo total projetado no cenário de referência para o mesmo ano — 939 TWh —, isso é <b>0,83% da eletricidade do país</b>. Um crescimento de mais de doze vezes em dez anos que, no agregado, permanece abaixo de um por cento." },
    { kind: 'paragrafo', html: "Esse número desarma os dois extremos ao mesmo tempo, e é por isso que ele é o mais importante da aula. Desarma <em>“a frota elétrica vai dobrar a demanda”</em>: no horizonte de dez anos, sob a projeção do próprio planejador, ela não chega a mover um ponto percentual do agregado. E desarma <em>“não tem impacto nenhum”</em>: o agregado nacional não é onde o problema aparece. O problema aparece num transformador de distribuição de um bairro em que trinta veículos chegam entre dezoito e vinte horas, ou numa garagem de logística em que cem veículos conectam simultaneamente ao fim do turno." },
    { kind: 'nota', tom: "neutro", label: "A frase que resume a aula", html: "<b>A eletrificação de transporte é um problema de potência local, e não de energia nacional.</b> Toda vez que alguém responder à pergunta errada — discutindo o agregado quando a restrição é o alimentador, ou discutindo o alimentador quando a pergunta era sobre suprimento — a conversa produz uma conclusão que não corresponde a nenhuma decisão real." },
    { kind: 'titulo', numero: "03.4", texto: "Recarga como categoria de mercado: três grandezas, de novo" },
    { kind: 'paragrafo', html: "Infraestrutura de recarga sofre exatamente do mesmo defeito de grandeza que o armazenamento sofrerá na próxima aula. <b>Número de pontos, potência instalada de recarga e energia efetivamente entregue são três números distintos</b>, e o primeiro é o único que circula." },
    { kind: 'nota', tom: "neutro", label: "Três grandezas, três perguntas diferentes", html: "<b>Grandeza 1 · nº de pontos</b> — Contagem de conectores ou de estações — e as duas contagens diferem, porque uma estação tem vários conectores. Não diz nada sobre potência nem sobre disponibilidade.<br><br><b>Grandeza 2 · MW instalados</b> — Soma das potências nominais. Um ponto de corrente contínua de 150 kW vale vinte pontos residenciais de 7,4 kW em potência, e nenhum número de contagem revela isso.<br><br><b>Grandeza 3 · MWh entregues</b> — A única que descreve receita e a única que descreve consumo da rede. Um carregador de 120 kW que entrega 157,7 MWh no ano opera com utilização média de 15%." },
    { kind: 'titulo', numero: null, texto: "Utilização de um ponto de recarga" },
    { kind: 'formula', eq: "U = MWh entregues ÷ (MW × 8.760)", desc: "O denominador é a energia que o ponto entregaria operando continuamente na potência nominal durante o ano inteiro. Utilização de recarga pública raramente passa da casa de um dígito alto; projetar receita com potência nominal contínua é o erro que mais destrói modelo de negócio de eletroposto." },
    { kind: 'titulo', numero: "03.5", texto: "O gargalo, e o que mudou em 1º de julho de 2026" },
    { kind: 'paragrafo', html: "Nenhum dos cinco candidatos vincula por maturidade tecnológica: os veículos existem, os carregadores existem, e a curva de 125% de crescimento semestral prova que a demanda também existe. O candidato que vincula hoje é <b>cadeia de suprimento</b>, e há uma data específica: desde <b>1º de julho de 2026 vigora alíquota de importação de 35% sobre veículos elétricos importados</b>, concluindo o cronograma de retomada progressiva iniciado em 2024. O efeito é direto sobre preço de aquisição de modelo importado e sobre a vantagem relativa da produção local." },
    { kind: 'paragrafo', html: "Isso produz uma consequência analítica que vale registrar sem juízo sobre a política: <b>a série de emplacamento do segundo semestre de 2026 não é comparável à do primeiro sem declarar essa mudança de regime</b>. Uma desaceleração observada em agosto pode ser efeito de antecipação de compra em junho, efeito de preço, ou efeito de mix — e as três leituras exigem dados diferentes. É a mesma disciplina de base temporal que o Módulo 14 aplicou a ano-safra contra ano-calendário." },
    { kind: 'nota', tom: "gold", label: "Onde isso entra no produto", html: "A conversão de frota em carga produz exatamente as duas variáveis que um terminal de mercado exibe: energia acrescentada ao ano e potência acrescentada ao patamar. É assim que uma tendência de mobilidade entra no <b>GridAlpha Brasil Terminal</b> — não como manchete, e sim como duas séries que se somam às já exibidas de mix de geração e de dinâmica de despacho. A capacidade analítica entregue é a de responder “quanto disso é carga, e quanto disso é rótulo”." },
  ],
  'aula-16-04': [
    { kind: 'titulo', numero: "04.1", texto: "Por que a duração muda o ativo, não o tamanho" },
    { kind: 'paragrafo', html: "Um sistema de 30 MW com uma hora de duração e um sistema de 30 MW com quatro horas de duração têm a mesma potência e são <b>ativos diferentes, com funções, custos e receitas incomparáveis</b>. O primeiro serve para responder a variação rápida — controle de frequência, alisível de rampa. O segundo serve para deslocar energia entre patamares de preço e para cobrir uma ponta inteira. O primeiro tem custo dominado pelo conversor; o segundo, pelas células." },
    { kind: 'nota', tom: "neutro", label: "Três grandezas, três perguntas diferentes", html: "<b>Potência · MW</b> — Quanto o sistema entrega ou absorve num instante. Determina o tamanho do serviço instantâneo e o dimensionamento da conexão.<br><br><b>Energia · MWh</b> — Quanto o sistema armazena. Determina por quanto tempo ele sustenta a potência e quanto volume ele move por ciclo.<br><br><b>Duração · h</b> — A razão entre as duas. É a grandeza que identifica <em>que tipo</em> de ativo é — e a que mais falta nos números publicados." },
    { kind: 'nota', tom: "neutro", label: "Potência, energia e duração", html: "<b>Nível 1.</b> Uma mangueira grossa enche o balde rápido; um balde grande guarda muita água. Saber só a grossura da mangueira não diz por quanto tempo você consegue regar.<br><b>Nível 2.</b> Potência dimensiona o serviço instantâneo e a conexão; energia dimensiona o volume que pode ser deslocado; a duração é a razão entre elas e define para qual serviço o ativo serve. Um contrato que remunera potência disponibilizada exige duração mínima justamente porque potência sem energia não entrega o produto contratado.<br><b>Nível 3.</b> A razão entre potência e energia define a taxa de operação do sistema, que por sua vez determina o estresse térmico e eletroquímico e, portanto, a curva de degradação. Daí decorrem três haircuts sucessivos sobre a energia nominal antes de chegar à energia utilizável de planejamento: profundidade de descarga admitida, eficiência de ciclo e disponibilidade. Consequência econômica: um mesmo MWh nominal produz receitas diferentes conforme a duração contratada, e a comparação de custo por MWh instalado entre sistemas de durações diferentes não significa nada sem normalizar pelo serviço entregue." },
    { kind: 'titulo', numero: "04.2", texto: "O marco regulatório, verificado item por item" },
    { kind: 'paragrafo', html: "O currículo escreveu “primeiro leilão de armazenamento previsto pra 2026”. Verificado em 4 de agosto de 2026, o estado é mais rico do que a frase sugere — e o mais importante não é o leilão, é a norma que veio antes dele." },
    { kind: 'tabela', linhas: [["Ato", "Objeto", "Estado em 04/08/2026"], ["Lei nº 15.269/2025", "Altera a lei de instituição da agência reguladora para incluir expressamente o armazenamento no escopo de sua finalidade", "<b>Em vigor.</b> É a base legal que faltava"], ["Resolução Normativa nº 1.161/2026", "Requisitos e procedimentos para outorga de autorização de sistemas de armazenamento; cria registro preliminar facultativo do requerimento; prazo-limite de 54 meses para entrada em operação comercial contado da outorga", "<b>Em vigor.</b> Aprovada em 02/06/2026, publicada em 24/06/2026"], ["Resolução Normativa nº 1.162/2026", "Armazenamento colocalizado, regras de distribuição, cobrança pelo uso da rede e regime de fiscalização e penalidades", "<b>Em vigor.</b> Mesma sessão e mesma publicação"], ["Portaria Normativa MME nº 136/2026", "Diretrizes e sistemática do primeiro certame de reserva de capacidade para contratação de potência a partir de novos sistemas de armazenamento", "<b>Em vigor.</b> De 1º/06/2026, publicada em 03/06/2026"], ["Os dois certames", "Produto Potência Armazenamento 2028 A, com exigência de nacionalização; e Produto 2028 B, sem essa exigência", "<b>Não realizados.</b> Previstos para 2 e 4 de dezembro de 2026"]] },
    { kind: 'nota', tom: "alerta", label: "Status correto, e a correção do marcador do currículo", html: "O marcador “primeiro leilão previsto pra 2026” está <b>correto e insuficiente</b>. Correto: os certames estão marcados para dezembro de 2026. Insuficiente: ele sugere que o leilão é o marco, quando o marco regulatório de fato — a classificação do armazenamento como ativo outorgável, com regras de acesso, encargos e penalidades — foi publicado seis meses antes e vale independentemente do resultado do certame. <b>Em 4 de agosto de 2026 existem norma, diretrizes e prazo. Não existe resultado, e não existe ativo contratado.</b> Projeto cadastrado não é vencedor; vencedor não é ativo construído; ativo construído não é automaticamente elegível a todas as receitas." },
    { kind: 'titulo', numero: "04.3", texto: "O produto que o certame compra — e o que ele não compra" },
    { kind: 'paragrafo', html: "Vale ler os parâmetros do certame com atenção, porque eles são a tradução mais limpa das três grandezas em obrigação contratual: sistemas de <b>no mínimo 30 MW</b>, capazes de fornecer <b>potência máxima por quatro horas consecutivas</b>, em até <b>dois ciclos diários</b>, limitados a <b>366 ciclos anuais</b>, com recarga completa em <b>até seis horas</b>. Suprimento de <b>quinze anos</b>, com início em <b>1º de agosto de 2028</b> e receita fixa anual corrigida por índice de preços. O despacho é comandado pelo operador nacional." },
    { kind: 'paragrafo', html: "Repare no que isso significa. O contrato remunera <b>disponibilidade de potência</b>, e não energia deslocada: a receita não depende de quantos ciclos o operador comandar. Isso tem três consequências que a maior parte do material publicado não extrai. <b>Primeira:</b> o teto de 366 ciclos anuais é um limite de <em>degradação</em> imposto ao comprador, não uma meta do vendedor. <b>Segunda:</b> a exigência de quatro horas fixa a duração mínima do ativo e portanto o tamanho do banco de células — ela é a razão pela qual o produto é comparável entre propostas. <b>Terceira:</b> a receita fixa contratada é uma fonte, e as demais — arbitragem, serviços ancilares, alívio de congestionamento — ou não têm mercado organizado, ou disputam a mesma potência e o mesmo estado de carga que a obrigação contratada já reservou." },
    { kind: 'titulo', numero: "04.4", texto: "Atrás e à frente do medidor: dois negócios" },
    { kind: 'paragrafo', html: "Armazenamento <b>atrás do medidor</b> atende a instalação e ganha dinheiro reduzindo o que a instalação pagaria. Armazenamento <b>à frente do medidor</b> presta serviço ao sistema e ganha dinheiro vendendo esse serviço. São dois negócios com clientes diferentes, regimes regulatórios diferentes e riscos diferentes — e a única coisa que têm em comum é o equipamento." },
    { kind: 'nota', tom: "neutro", label: "Atrás do medidor", html: "<b>Cliente</b>A própria instalação. Receita é custo evitado, não faturamento.<br><br><b>Fontes de valor</b>Redução de demanda faturável, deslocamento entre postos tarifários, aumento de autoconsumo, backup e qualidade.<br><br><b>Grandeza crítica</b>Redução de potência sustentada e previsível — não o pico isolado. Exige memória de massa.<br><br><b>Regime</b>Regra da distribuidora e enquadramento tarifário. A anatomia da fatura é Módulo 10 e não se reabre aqui.<br><br><b>Risco principal</b>Pico impreviśivel ou longo demais para a duração instalada; e disputa de estado de carga entre backup e economia." },
    { kind: 'nota', tom: "neutro", label: "À frente do medidor", html: "<b>Cliente</b>O sistema, por contrato, ou o mercado de curto prazo.<br><br><b>Fontes de valor</b>Potência contratada, resposta rápida, controle de tensão e de frequência, arbitragem, alívio de congestionamento.<br><br><b>Grandeza crítica</b>Disponibilidade medida e comandabilidade — e a localização, porque capacidade remanescente de escoamento é por barramento.<br><br><b>Regime</b>Outorga de autorização, contrato de uso do sistema, e agora regime de fiscalização e penalidades como agente regulado.<br><br><b>Risco principal</b>Empilhar receitas incompatíveis; e a cobrança pelo uso da rede incidir sobre consumo <em>e</em> sobre injeção." },
    { kind: 'nota', tom: "gold", label: "O detalhe da norma que muda a conta", html: "A resolução de 2026 sobre armazenamento colocalizado estabelece que o faturamento de central geradora com armazenamento colocalizado, ou de armazenamento autônomo, contemple <b>cumulativamente</b> a parcela associada ao <em>consumo</em> e a parcela associada à <em>injeção</em>. Em português de modelo financeiro: o ativo pode ser cobrado tanto pela energia que retira para carregar quanto pela demanda que injeta ao descarregar. Qualquer cálculo de arbitragem feito antes de junho de 2026 que ignore essa dupla incidência está superestimando a margem — e a magnitude do erro depende da modalidade tarifária e do horário de operação, não é um percentual fixo." },
    { kind: 'titulo', numero: "04.5", texto: "Por que arbitragem sozinha raramente paga" },
    { kind: 'titulo', numero: null, texto: "Margem de um ciclo de arbitragem" },
    { kind: 'formula', eq: "M = E out × P venda − (E out ÷ η ciclo ) × P compra", desc: "A eficiência de ciclo entra no denominador da energia comprada , e por isso ela não corta a margem proporcionalmente: ela eleva o preço efetivo de compra. Com eficiência de 86%, comprar a R$ 100 por MWh custa R$ 116,3 por MWh entregue . O spread mínimo de equilíbrio não é zero — é P compra dividido pela eficiência." },
    { kind: 'titulo', numero: "04.6", texto: "Quando o ativo é de outro: serviço em vez de compra" },
    { kind: 'paragrafo', html: "Há um arranjo comercial que muda quem responde a todas as perguntas acima, e ele merece tratamento explícito porque é a forma dominante de contratar armazenamento atrás do medidor: o <b>modelo de serviço</b>, em que o fornecedor financia, instala e opera o ativo, e o consumidor paga mensalidade, disponibilidade, unidade de serviço ou fração da economia obtida. O efeito imediato é atraente e verdadeiro: <b>elimina o desembolso inicial</b>. O efeito mediato é o que quase nunca aparece na proposta: <b>transfere o problema do orçamento de capital para o contrato</b> — e contrato de dez ou quinze anos é uma obrigação de longo prazo com custo de capital embutido e saída precificada." },
    { kind: 'paragrafo', html: "A leitura correta não é que o modelo é bom ou ruim. É que ele <b>desloca sete perguntas</b>, e cada uma tem uma resposta que precisa estar escrita em algum lugar antes da assinatura. Elas são as mesmas para armazenamento, para eficiência e para recarga de frota, e por isso valem para três das seis tendências deste bloco." },
    { kind: 'tabela', linhas: [["Cláusula", "A pergunta — e por que ela decide o resultado"], ["Linha de base", "Como consumo, pico e produção são normalizados? <b>Sem linha de base não existe economia mensurável</b> — existe apenas a diferença entre duas faturas, que varia com produção, clima e tarifa. É a mesma exigência que a Aula 06 impõe à agregação, pela mesma razão."], ["Desempenho garantido", "Qual potência, qual energia, qual disponibilidade e qual tempo de resposta estão garantidos? As três primeiras são as grandezas da §04.1; se o contrato garante só uma delas, ele não descreve o ativo."], ["Perímetro econômico", "Quais componentes tarifárias e quais eventos entram no cálculo da economia compartilhada? Redução de demanda faturável, arbitragem e evitação de interrupção são três contas diferentes."], ["Degradação", "Quem repõe células e a partir de que perda de capacidade? A degradação é certa; a dúvida é de quem é o custo dela e em que ano."], ["Segurança cibernética", "Quem acessa o sistema de gestão, quem o atualiza e quem responde a incidente? O ativo é comandável remotamente por um terceiro dentro da instalação do contratante — e isso é a Aula 09.4 aplicada a um contrato."], ["Mudança regulatória", "Quem absorve a perda se a regra mudar? Esta é a cláusula mais subestimada num setor cujo próprio marco de armazenamento foi publicado em junho de 2026 e cujo encargo de rede sobre injeção é ainda mais recente que isso."], ["Fim do contrato", "Compra pelo valor residual, remoção, reciclagem — e <b>a quem pertencem os dados de operação</b>? A última decide se o contratante sai do contrato sabendo o que aconteceu na própria planta, ou sem nenhum histórico para negociar o contrato seguinte."]] },
    { kind: 'nota', tom: "gold", label: "A conferência que substitui a comparação de mensalidade", html: "Comparar mensalidade contra conta de energia atual não é análise — é comparar dois números de naturezas diferentes. A conferência que substitui isso tem quatro itens: <b>custo total presente</b> das duas rotas ao longo do mesmo horizonte, incluindo saída; <b>cenários regulatórios</b>, com pelo menos um em que a regra que sustenta a economia muda; <b>valor residual</b> do ativo ao fim do prazo, e de quem ele é; e <b>liberdade operacional</b> — o que o contratante deixa de poder fazer com a própria carga enquanto o contrato durar. <b>Nenhum desses quatro aparece numa proposta comercial por iniciativa do proponente</b>, e nenhum deles é recomendação de contratar ou de não contratar: são o que precisa estar quantificado antes de a pergunta sequer fazer sentido." },
    { kind: 'nota', tom: "neutro", label: "Onde isso entra no produto", html: "Um ativo de armazenamento é o único deste bloco que aparece simultaneamente como carga e como geração na mesma série temporal, e que muda de sinal conforme o preço de curto prazo. Ler essa operação exige justamente o que o <b>GridAlpha Brasil Terminal</b> exibe: preço horário, mix de geração e dinâmica de despacho na mesma tela. A capacidade analítica entregue é a de observar quando o <em>spread</em> supera o mínimo de equilíbrio — e com que frequência, que é a pergunta que decide o ativo." },
  ],
  'aula-16-05': [
    { kind: 'titulo', numero: "05.1", texto: "Medidor eletrônico não é medição avançada" },
    { kind: 'paragrafo', html: "A proposta em discussão na agência reguladora define o sistema de medição inteligente como uma solução formada por <b>quatro componentes integrados</b>: o medidor, a interface de comunicação com o consumidor, o sistema de comunicação de dados e o sistema de gestão de dados. A palavra que carrega o peso é <em>integrados</em>. Trocar o medidor sem os outros três produz um equipamento mais preciso e nenhum serviço novo." },
    { kind: 'paragrafo', html: "Essa definição é o que separa duas afirmações que costumam ser tratadas como a mesma: “o país tem X milhões de medidores eletrônicos” e “o país tem X milhões de pontos com medição avançada”. A primeira mede equipamento instalado; a segunda mede <em>capacidade de serviço</em>, e exige telecomunicação funcionando, sistema de gestão de dados operando, e o dado chegando a alguém que decida com ele. <b>Um medidor que mede e não comunica é um relógio caro.</b>" },
    { kind: 'titulo', numero: "05.2", texto: "O estado regulatório, verificado" },
    { kind: 'paragrafo', html: "Aqui há uma correção relevante a fazer sobre a leitura mais comum do tema. A narrativa corrente — inclusive em material de referência recente — classifica a medição avançada como “arquitetura regulatória em formação”, o que sugere ausência de obrigação. <b>Não é o caso.</b> Existe obrigação quantificada em vigor." },
    { kind: 'lista', itens: ["Em vigor · obrigação quantificada", "Norma de requisitos mínimos em consulta", "Análise de custo-benefício com prazo futuro"] },
    { kind: 'tabela', linhas: [["Ato", "Conteúdo", "Estado em 04/08/2026"], ["Portaria MME nº 126/2026", "Determina que as distribuidoras instalem medição inteligente em <b>2% das unidades consumidoras por ano</b>, por 24 meses contados de 1º de março de 2026; define funcionalidades mínimas; exige análise de custo-benefício; e exige plano anual de investimento em digitalização", "<b>Em vigor desde 01/03/2026.</b> A obrigação corre independentemente da consulta da agência"], ["Consulta Pública nº 1/2026, fase 1", "Subsídios sobre barreiras regulatórias à digitalização da distribuição em baixa tensão", "<b>Encerrada.</b> De 29/01 a 16/03/2026, com 53 participantes"], ["Consulta Pública nº 1/2026, fase 2", "Minuta de resolução alterando os procedimentos de distribuição e a resolução de direitos e deveres do consumidor; requisitos mínimos, prazos de disponibilização de dados ao consumidor, pré-pagamento, segurança cibernética e interoperabilidade", "<b>Aberta.</b> De 01/07 a <b>14/08/2026</b> — encerra dez dias depois da data de verificação deste módulo"], ["Análise de custo-benefício", "Metodologia e planos de implantação das distribuidoras, remetidos a processo regulatório próprio", "<b>Prazo futuro.</b> Entrega até 29 de fevereiro de 2028"], ["Segurança cibernética", "A proposta remete às diretrizes da política setorial de segurança cibernética já existente e à legislação geral de proteção de dados", "<b>Em vigor</b>, por remissão; sem norma nova específica de medição"], ["Interoperabilidade", "A padronização técnica é remetida aos fóruns de normalização, em articulação com as autoridades de telecomunicações e de metrologia", "<b>Não regulada pela agência.</b> Deferência expressa a outro foro"]] },
    { kind: 'nota', tom: "alerta", label: "Correção de estágio", html: "Classificar medição avançada como “em discussão” é subclassificá-la. A posição correta na régua é <b>regulada e em implantação inicial, com ritmo mínimo obrigatório correndo desde março de 2026</b> — e com a norma de requisitos técnicos ainda em consulta. É um caso raro e instrutivo: <b>a obrigação de instalar veio antes da definição do que exatamente instalar</b>, o que explica por que a própria agência antecipou a regulamentação das funcionalidades mínimas e adiou a discussão de custo-benefício para outro processo." },
    { kind: 'titulo', numero: "05.3", texto: "As duas disputas reais" },
    { kind: 'paragrafo', html: "O currículo diz “disputas regulatórias” sem nomeá-las. São duas, e são de natureza diferente." },
    { kind: 'nota', tom: "neutro", label: "As disputas em aberto", html: "<b>Disputa 1 Quem paga, e como recupera</b> — Sinal econômico O medidor pertence à distribuidora, e o investimento entra na base de ativos remunerada — ou seja, <b>é recuperado na tarifa de todos os consumidores</b>. A pergunta crítica é se os benefícios se distribuem da mesma forma que o custo. Redução de perdas não técnicas e economia de leitura beneficiam predominantemente a concessionária e, por via da tarifa, o conjunto; tarifa horária e resposta da demanda beneficiam quem tem condições de deslocar consumo. <b>Não há resposta técnica para essa pergunta — há escolha regulatória</b>, e o instrumento dessa escolha é a análise de custo-benefício cujo prazo vence em 2028.<br><br><b>Disputa 2 De quem é o dado</b> — Regra habilitante O medidor gera curva de consumo em intervalos curtos, e essa curva é simultaneamente insumo de faturamento, insumo de operação da rede, dado pessoal do consumidor sob a legislação geral de proteção de dados, e ativo comercial para quem quiser oferecer serviço de gestão de energia. <b>Prazo e forma de disponibilização ao consumidor estão expressamente em discussão na fase aberta da consulta.</b> Sem essa definição, não existe agregador de recursos distribuídos operando em escala — e a Aula 06 depende disso." },
    { kind: 'paragrafo', html: "Há um terceiro elemento, e ele não é disputa: é a <b>contrapartida do lado da demanda</b>. A agenda regulatória do biênio prevê tarifa horária obrigatória para consumidores de baixa tensão acima de 1.000 kWh por mês, o que alcança cerca de dois milhóes e meio de unidades consumidoras. <b>Medição sem sinal de preço que varie no tempo não produz flexibilidade — produz um relatório.</b> As duas peças só funcionam juntas, e é por isso que elas estão na mesma agenda." },
    { kind: 'titulo', numero: "05.4", texto: "Convertendo a obrigação em quantidade" },
    { kind: 'titulo', numero: "05.5", texto: "“Atrasado” em relação a quê, medido como?" },
    { kind: 'paragrafo', html: "O currículo escreve que a rede inteligente brasileira está atrasada em comparação com dois mercados estrangeiros. A afirmação pode até ser verdadeira; o problema é que, <b>como está escrita, ela não é verificável</b> — e uma afirmação não verificável não serve nem para concordar nem para discordar. Este módulo não faz a comparação: <b>a comparação entre jurisdições é o objeto legítimo do Bloco 17</b>, e antecipá-la aqui seria fazer mal o que lá será feito bem. O que este módulo faz é ensinar <em>o que precisaria ser igual para que a comparação significasse alguma coisa</em>. São cinco coisas." },
    { kind: 'lista', itens: ["<b>O que exatamente está sendo contado como “implantado”</b> — medidor instalado, medidor comunicando, ponto com sistema de gestão de dados integrado, ou ponto com serviço novo disponível ao consumidor. As quatro contagens diferem por múltiplos, e nenhuma jurisdição publica as quatro.", "<b>Quem é dono do medidor</b> — se o ativo pertence à concessionária, ao consumidor ou a um terceiro prestador, a velocidade de implantação responde a incentivos completamente diferentes, e o custo aparece em lugares diferentes da conta.", "<b>Como o investimento é recuperado</b> — base de ativos remunerada, encargo específico, subsídio público ou tarifa de serviço. A forma de recuperação determina quem tem incentivo a acelerar e quem tem incentivo a resistir.", "<b>Qual é a estrutura tarifária vigente</b> — onde o preço ao consumidor final já varia ao longo do dia, o medidor tem função econômica imediata; onde não varia, ele é investimento cujo benefício depende de uma reforma que ainda não ocorreu.", "<b>Qual é o desenho de mercado</b> — se o consumidor de baixa tensão pode escolher fornecedor, a medição é pré-requisito de abertura e ganha um motor político próprio; se não pode, ela concorre por capital com todo o resto do plano de investimento da distribuidora."] },
    { kind: 'nota', tom: "gold", label: "A generalização que vale para todo o módulo", html: "Essa lista é um caso particular de um defeito mais geral, e ele vira a quarta categoria do verificador assinatura na Aula 10: <b>base de comparação não declarada</b>. Ele vale para comparação entre jurisdições, mas vale igualmente para comparação entre anos — quando a taxonomia mudou no meio — e entre metodologias — quando dois números da mesma grandeza foram apurados por critérios distintos. O escopo 2 da Aula 07 é o exemplo mais limpo do terceiro caso." },
    { kind: 'nota', tom: "neutro", label: "Onde isso entra no produto", html: "Uma consulta pública que encerra em 14 de agosto e uma obrigação que corre desde 1º de março são dois fatos regulatórios com consequências operacionais opostas para quem vende, instala ou depende de medição — e nenhum dos dois aparece como manchete. Rastrear a produção normativa dos órgãos brasileiros do setor elétrico, com prazo e com o que muda para quem, é a função do <b>Regulatory Radar</b>. A capacidade analítica entregue é saber qual prazo está correndo agora, não qual notícia saiu ontem." },
  ],
  'aula-16-06': [
    { kind: 'titulo', numero: "06.1", texto: "Do ativo conectado ao recurso comandado" },
    { kind: 'paragrafo', html: "A pergunta que organiza esta aula é: <em>o que muda quando o recurso distribuído deixa de ser observado e passa a ser comandado?</em> Muda tudo, e a mudança é institucional antes de ser técnica. Um sistema fotovoltaico conectado é um ativo do consumidor que injeta quando o sol permite. Um recurso agregado é um ativo cujo comportamento alguém se comprometeu a entregar — e então aparecem três perguntas que não existiam: quem comanda, quem responde se não entregar, e contra qual linha de base se mede o que foi entregue." },
    { kind: 'nota', tom: "neutro", label: "A cadeia, camada a camada", html: "<b>1 · Geração distribuída Módulo 11</b> — Ativo conectado do consumidor, com regra de compensação e enquadramento próprios. Fluxo predominantemente unidirecional na origem, bidirecional na escala. Regulado <b>Cerca de 47 GW de potência instalada</b>, segunda maior fonte da matriz. Não reaberto aqui.<br><br><b>2 · Observabilidade o gargalo atual</b> — O operador precisa <em>enxergar</em> o que a borda está fazendo para manter tensão e frequência. Com participação alta de geração não observada nem comandada, a resposta operativa disponível passa a ser o corte, que é a ferramenta mais grosseira. Em processo Consulta pública sobre tratamento de excedentes e flexibilidade operativa na rede de distribuição correu de 23/04 a 06/06/2026.<br><br><b>3 · Agregação o objeto novo</b> — Um agente reúne muitos recursos pequenos e os oferece ao sistema como um único recurso comandável. Exige telemetria, linha de base, contrato com o titular do ativo e remuneração do serviço entregue. Sem regime geral Não há figura regulatória geral do agregador em operação; há experimentação em ambiente de teste regulatório e discussão em agenda.<br><br><b>4 · Flexibilidade local consequência</b> — Com agregação e sinal de preço, a borda responde à necessidade da rede e evita ou adia reforço físico. Sem os dois, a borda é só incerteza adicional a ser coberta com margem. Depende de 2 e 3" },
    { kind: 'titulo', numero: "06.2", texto: "Três arranjos que não são a mesma coisa" },
    { kind: 'paragrafo', html: "“Microrrede”, “comunidade de energia” e “geração compartilhada” são usados como sinônimos com uma frequência desconfortável. Não são. E a diferença não é semântica — é de regime jurídico e de quem responde pelo quê." },
    { kind: 'tabela', linhas: [["Elemento", "Geração compartilhada", "Microrrede", "Comunidade de energia"], ["O que é", "Alocação de excedentes entre unidades consumidoras sob o sistema de compensação", "Conjunto local de cargas e recursos coordenados, capaz de operar conectado ou ilhado", "Arranjo de governança coletiva sobre geração, consumo, flexibilidade e repartição de benefícios"], ["Objeto", "Energia compensada em fatura", "Confiabilidade, qualidade e combustível evitado", "Energia, flexibilidade, serviços e decisão coletiva"], ["Forma preço local?", "Não", "Não, no sentido de mercado; pode otimizar internamente", "Pode envolver rateio ou mercado local, conforme o desenho"], ["Usa a rede da distribuidora?", "Sim, integralmente", "Sim, quando conectada; opera sem ela quando ilhada", "Sim — e precisa remunerar o uso, ou o custo migra para os demais"], ["Estado no Brasil", "<b>Regulado</b> no marco de geração distribuída", "<b>Nicho comercial e público</b>; documento de planejamento específico para sistemas isolados publicado em fevereiro de 2026", "<b>Sem regime geral próprio</b>; conceito importado sem norma equivalente"]] },
    { kind: 'nota', tom: "alerta", label: "Não importe o rótulo sem o desenho", html: "Copiar o termo estrangeiro sem copiar governança, proteção ao consumidor, sinal locacional e remuneração da rede produz material de marketing, não desenho de mercado. A pergunta que separa os dois é sempre a mesma e é sempre desconfortável: <b>se este arranjo usa a rede e paga menos por ela, quem paga a diferença?</b> É a mesma estrutura da controvérsia sobre subsídio à geração distribuída solar — um lado sustenta que o incentivo viabilizou democratização e deve continuar; o outro, que o subsídio cruzado recai sobre o consumidor cativo de menor renda. <b>Os dois argumentos têm peso empírico e este módulo não emite veredito sobre eles</b> — entrega o mecanismo, quem paga, quem recebe e o que precisaria ser medido para decidir." },
    { kind: 'titulo', numero: "06.3", texto: "Microrrede: onde ela fecha, e por quê" },
    { kind: 'paragrafo', html: "Microrrede não é uma tecnologia procurando aplicação — é uma arquitetura que fecha exatamente onde <b>o custo da energia alternativa é muito alto</b> ou <b>o custo da interrupção é muito alto</b>. Fora dessas duas condições, ela compete com a rede em condições desfavoráveis, porque a rede tem escala e diversidade de carga que uma instalação isolada não tem." },
    { kind: 'titulo', numero: null, texto: "Valor anual de uma microrrede" },
    { kind: 'formula', eq: "V = (C alternativa − C híbrido ) × E + VOLL × h evitadas", desc: "O primeiro termo é combustível e logística evitados; o segundo é o valor da carga não suprida multiplicado pelas horas de interrupção evitadas. O valor da carga não suprida é específico da operação — uma parada de forno de fusão e uma parada de escritório não têm o mesmo valor por hora — e usar um número genérico aqui é a forma mais comum de inflar o resultado." },
    { kind: 'paragrafo', html: "O documento de planejamento publicado em fevereiro de 2026 sobre microrredes para sistemas isolados é evidência de <b>maturação institucional</b>, e não de mercado massificado: ele integra análise técnica, econômica, regulatória e socioambiental para um conjunto de sistemas em que a alternativa corrente é geração a óleo diesel com logística cara. É um caso em que o gargalo <b>não</b> é sinal econômico — a economia fecha — e sim logística, operação e manutenção em local remoto." },
    { kind: 'nota', tom: "gold", label: "Onde isso entra no produto", html: "Agregação e comunidade de energia são os dois tópicos deste bloco cuja posição na régua depende inteiramente de norma que ainda não existe. Isso os torna acompanhamento regulatório puro — <b>Regulatory Radar</b> —, e não análise de mercado. A capacidade analítica entregue é a de distinguir, num anúncio de “comunidade de energia” no Brasil, o que é geração compartilhada com nome novo do que seria de fato um arranjo com governança e despacho próprios — que hoje não tem regime." },
  ],
  'aula-16-07': [
    { kind: 'titulo', numero: "07.1", texto: "A lei, e os quatro estados de política aplicados a ela" },
    { kind: 'paragrafo', html: "A Lei nº 15.042, de 11 de dezembro de 2024, instituiu o sistema brasileiro de comércio de emissões. Publicada em 12 de dezembro de 2024, ela <b>entrou em vigor na data da publicação</b> — e essa informação, que parece formalidade, é a que permite ler todo o resto, porque a contagem das fases parte daí." },
    { kind: 'paragrafo', html: "O artigo que define o período transitório estabelece cinco fases. A fase I é de <b>doze meses, prorrogáveis por mais doze, para a edição da regulamentação</b>, contados da entrada em vigor. Faça a conta: doze meses de 12/12/2024 vencem em <b>12 de dezembro de 2025</b>. Em 4 de agosto de 2026, portanto, <b>o prazo original da fase I está vencido</b>, e o sistema opera dentro da prórroga, que se esgota em 12 de dezembro de 2026." },
    { kind: 'lista', itens: ["Lei em vigor desde 12/12/2024", "Prazo original da fase I vencido em 12/12/2025", "Prórroga corre até 12/12/2026", "Mercado de ativos previsto para 2030"] },
    { kind: 'nota', tom: "alerta", label: "O quarto estado de política, e por que ele importa aqui", html: "Os Módulos 14 e 15 fixaram quatro estados: em vigor; autorização legal sem ato de implementação; anunciado com data futura; e <b>prazo legal vencido e não implementado</b>. O quarto é o que separa quem leu a lei de quem leu o decreto — e ele está presente aqui de forma explícita. A leitura correta não é “o sistema está atrasado”, que é juízo, e sim: <b>o instrumento legal previu a própria prórroga, ela foi acionada, e resta um prazo determinado</b>. Isso muda a pergunta que se faz a um interlocutor de: “quando começa?” para: “o que precisa estar publicado até dezembro de 2026, e o que acontece se não estiver?”" },
    { kind: 'titulo', numero: "07.2", texto: "A governança, e o órgão que ainda não existe" },
    { kind: 'paragrafo', html: "A lei desenha três instâncias: um comitê interministerial como órgão deliberativo, um <b>órgão gestor</b> como instância executora — com competência normativa, regulatória, executiva, sancionatória e recursal —, e um comitê técnico consultivo permanente. O ponto que quase nenhum material registra: <b>o órgão gestor permanente não está constituído</b>. Uma secretaria extraordinária criada por decreto em outubro de 2025, no âmbito da pasta fazendária, assumiu essas competências em caráter de fase inicial, e a elaboração da proposta de criação do órgão gestor permanente consta como <em>meta</em> até dezembro de 2026." },
    { kind: 'nota', tom: "gold", label: "Extensão declarada da Trava 2, em uso", html: "Ao citar a secretaria da pasta fazendária como fonte oficial deste bloco, este módulo usa a extensão declarada no §00.9 — e usa com a ressalva que a torna honesta: <b>trata-se de arranjo provisório por construção</b>. Uma classificação de estágio que ignore isso trata como instituição consolidada uma estrutura cuja própria meta é ser substituída." },
    { kind: 'titulo', numero: "07.3", texto: "Quem é alcançado, e quem não é" },
    { kind: 'paragrafo', html: "A lei fixa dois patamares anuais de emissão, e eles produzem dois conjuntos de obrigação distintos: acima de <b>10 mil toneladas de dióxido de carbono equivalente por ano</b>, o operador deve submeter plano de monitoramento e apresentar relato de emissões e remoções; acima de <b>25 mil toneladas</b>, acrescenta-se o dever de conciliação periódica — ou seja, de deter ativos em quantidade equivalente às emissões. Ambos os patamares podem ser majorados por ato do órgão gestor, e as obrigações só se aplicam a atividades para as quais existam metodologias consolidadas." },
    { kind: 'paragrafo', html: "Três recortes que mudam a leitura para quem analisa indústria brasileira. <b>Primeiro:</b> a produção primária agropecuária, e os bens e infraestrutura no interior de imóveis rurais a ela diretamente associados, <b>não são considerados atividades reguladas</b> e não se submetem às obrigações do sistema. <b>Segundo:</b> a lei veda expressamente a dupla regulação institucional e <b>qualquer tributação sobre emissões</b> por atividades, instalações ou fontes reguladas pelo sistema — o que responde, juridicamente, à pergunta “isso vira imposto?”. <b>Terceiro:</b> há uma obrigação já correndo que quase ninguém associa a este tema — a lei determina que sociedades seguradoras, entidades abertas de previdência complementar, sociedades de capitalização e resseguradores locais adquiram, observado o mínimo de 1% ao ano dos recursos de suas reservas técnicas e provisões, ativos ambientais ou cotas de fundos de investimento em ativos ambientais, cumprindo essa obrigação a partir do ano de entrada em vigor da lei." },
    { kind: 'titulo', numero: "07.4", texto: "Regulado e voluntário: dois mercados, e por que a conversão não é automática" },
    { kind: 'nota', tom: "neutro", label: "Crédito regulado contra crédito voluntário", html: "<b>Nível 1.</b> Um é como um ingresso que o governo exige que você tenha para poder entrar. O outro é como uma doação que você faz porque quer. Os dois custam dinheiro e têm papel escrito, mas só um deles vale na porta.<br><b>Nível 2.</b> O ativo regulado é instrumento de conformidade: sua demanda vem de uma obrigação legal e seu preço reflete o custo marginal de abatimento do setor coberto. O ativo voluntário é instrumento de comunicação e de compromisso privado: sua demanda vem de decisão corporativa e seu preço reflete percepção de integridade. <b>Um não substitui o outro</b> — e um crédito voluntário só entra no sistema regulado se a metodologia que o gerou for credenciada, se o resultado for verificado e se o ativo for inscrito no registro central.<br><b>Nível 3.</b> A separação tem três camadas. <em>Jurídica:</em> a lei define crédito de carbono como ativo transacionável autônomo, com natureza de fruto civil no caso florestal de preservação ou reflorestamento, e externo ao sistema; o certificado do sistema é ativo fungível reconhecido apenas por inscrição no registro central. <em>Contábil e tributária:</em> a conversão de crédito em ativo do sistema não configura hipótese de incidência. <em>De mercado:</em> o percentual máximo de certificados admitido na conciliação é definido no plano nacional de alocação — ou seja, existe um teto de substituição, e ele é variável de política, não de mercado. Consequência analítica: qualquer modelo que trate os dois preços como convergíveis por arbitragem está ignorando um parâmetro administrativo que domina a relação." },
    { kind: 'paragrafo', html: "Os critérios de integridade do mercado voluntário são os mesmos em qualquer metodologia séria, e cada um corresponde a uma pergunta de auditoria concreta. <b>Adicionalidade:</b> o projeto ocorreria sem a receita de carbono? <b>Linha de base:</b> o cenário de referência é conservador? <b>Permanência:</b> a remoção pode ser revertida, e quem cobre a reversão? <b>Vazamento:</b> a emissão migrou para outro lugar? <b>Dupla contagem:</b> quem mais reivindica a mesma tonelada? <b>Salvaguardas:</b> houve consulta e repartição de benefícios onde a lei as exige? Nenhum padrão privado de certificação é nomeado neste módulo, e a razão está declarada no §00.7: nomear padrão estrangeiro é nomear mercado estrangeiro por outro caminho, e <b>a distinção entre regulado e voluntário se ensina inteiramente por estrutura</b>." },
    { kind: 'titulo', numero: "07.5", texto: "Escopo 2: dois métodos, nenhum errado" },
    { kind: 'paragrafo', html: "Este é o ponto em que o carbono encosta no consumidor industrial, e é onde o currículo pára cedo demais. Ele escreve “relato de emissões de escopo 2” e não diz o que decide toda a leitura: <b>emissão de escopo 2 tem dois métodos de cálculo simultaneamente válidos</b>. O baseado em <em>localização</em> usa o fator médio da rede relevante. O baseado em <em>mercado</em> usa os atributos ambientais contratados pelo consumidor, quando atendidos os critérios de qualidade. A mesma empresa, no mesmo ano, com o mesmo consumo, reporta números diferentes pelos dois métodos — e <b>nenhum dos dois está errado</b>." },
    { kind: 'nota', tom: "neutro", label: "Escopo 2 pelos dois métodos", html: "<b>Nível 1.</b> Se todo mundo bebe da mesma caixa d'água, você pode dizer “bebi água da caixa” ou “paguei pela água da chuva que entrou na caixa”. As duas frases são verdadeiras. A caixa continua igual.<br><b>Nível 2.</b> O método de localização responde “qual foi a emissão média da eletricidade que eu consumi?”. O de mercado responde “quais atributos de geração eu contratei e aposentei?”. Empresas com meta corporativa costumam reportar pelo segundo; inventários setoriais e comparações entre países costumam usar o primeiro. Reportar um sem dizer qual é a origem da maior parte das divergências entre relatórios.<br><b>Nível 3.</b> A escolha de método determina o fator aplicado ao consumo não coberto por instrumento contratual: no método de mercado, esse consumo deveria receber o <em>fator residual</em> da rede — a média depois de retirados os atributos já reivindicados por terceiros — e não o fator médio. Onde o fator residual não é publicado, o método de mercado é aplicado com o fator médio como aproximação, o que <b>subestima sistematicamente</b> a emissão de quem não contratou atributo. Some-se a isso que o fator médio da rede brasileira é baixo e volátil por hidrologia, e obtém-se o caso em que uma empresa “reduz emissões” num ano sem ter mudado nada no seu consumo — apenas choveu mais." },
    { kind: 'nota', tom: "alerta", label: "O erro de fusão mais caro deste tema", html: "<b>Atributo ambiental contratado não é redução física de emissão.</b> Comprar atributo muda o número reportado pelo método de mercado e <b>não muda um grama</b> do que a rede emitiu naquele ano. Os dois fatos são verdadeiros e medem coisas diferentes: um mede a alegação contratual de uma empresa; o outro mede a física de um sistema. É a versão de escopo 2 do mesmo erro que o Módulo 14 catalogou para o crédito de descarbonização — e por isso a glosa de “crédito” do §00.5 precisa dos quatro sentidos, e não de dois." },
    { kind: 'titulo', numero: "07.6", texto: "O que mudou no relato corporativo em maio de 2026" },
    { kind: 'paragrafo', html: "Uma alteração de maio de 2026 na regulamentação do mercado de capitais reverteu o desenho anterior: a obrigatoriedade de divulgação do relatório de informações financeiras relacionadas à sustentabilidade para companhias abertas, que passaria a valer a partir dos exercícios iniciados em 1º de janeiro de 2026, <b>foi revogada</b>. O regime passou a ser voluntário, no modelo “pratique ou explique”: quem optar por não divulgar deve, a partir de 2027, justificar a decisão por comunicado ao mercado; quem optar por divulgar deve seguir os pronunciamentos brasileiros de sustentabilidade e os padrões internacionais correspondentes, manter a divulgação por pelo menos três exercícios consecutivos e observar a exigência de asseguração por auditor independente, que <b>não foi alterada</b>." },
    { kind: 'nota', tom: "gold", label: "Por que isso é um caso de estágio, e não de opinião", html: "Este é o exemplo mais limpo do currículo de uma norma que percorreu três estados em três anos: <em>anunciada com data futura</em> em 2023, <em>prestes a entrar em vigor</em> em 1º/01/2026, e <em>revogada antes de produzir efeito</em> em maio de 2026. Qualquer material anterior a junho de 2026 que descreva o Brasil como jurisdição de relato obrigatório está desatualizado — e a lista dos que estão é longa, porque a obrigatoriedade foi amplamente noticiada e a revogação, muito menos. <b>Este módulo não emite juízo sobre a decisão regulatória</b>: registra o estado, a data e o efeito prático, que é a substituição de um dever de divulgar por um dever de explicar." },
    { kind: 'nota', tom: "neutro", label: "Onde isso entra no produto", html: "Um consumidor industrial que exporta ou que fornece para cadeia global recebe a pergunta de escopo 2 antes de receber qualquer pergunta sobre carbono regulado — e a resposta correta exige o fator da rede no período, os instrumentos contratados e o método declarado. As duas primeiras informações são séries de mercado; a terceira é escolha do relator. É o cruzamento que o <b>GridAlpha Brasil Terminal</b> torna observável ao exibir mix de geração com granularidade temporal. A capacidade analítica entregue é explicar por que o mesmo consumo produz dois números — e por que nenhum dos dois é manipulação." },
  ],
  'aula-16-08': [
    { kind: 'nota', tom: "alerta", label: "Declaração de conflito de interesse", html: "Antes de qualquer número: <b>este é o tópico em que a disciplina de independência se vira contra o autor</b>. Centros de dados são um vertical de cliente nomeado explicitamente no plano de negócios deste projeto, entre os setores que a linha de pesquisa setor-específica pretende atender. Um módulo que afirma que a demanda de centros de dados vai explodir está escrevendo o próprio caso comercial. Por isso esta aula começa mostrando por que <b>o número mais citado deste tema não descreve carga</b> — e trata os números de centro de dados com a mesma exigência de fonte, de perimetro e de estágio que trataria um número de operadora de petróleo." },
    { kind: 'titulo', numero: "08.1", texto: "Cinco números, um empreendimento" },
    { kind: 'paragrafo', html: "O mesmo projeto de centro de dados produz cinco números públicos distintos, e a razão entre o primeiro e o último é rotineiramente de vários múltiplos. Citar qualquer um deles sem dizer <em>qual</em> é o defeito central do tema." },
    { kind: 'nota', tom: "neutro", label: "Os cinco estágios da fila", html: "<b>1 · Solicitado</b> — Potência declarada em pedido de parecer de acesso protocolado. <b>Custo de protocolar é próximo de zero</b>; um mesmo projeto pode solicitar em mais de um ponto de conexão, e um mesmo terreno pode ter mais de um interessado. É o número maior e o mais citado.<br><br><b>2 · Com parecer emitido</b> — Potência para a qual existe alternativa técnica de conexão reconhecida, com condições definidas. Já passou por avaliação de capacidade da rede. <b>Ainda não obriga ninguém a construir.</b><br><br><b>3 · Contratado</b> — Potência com contrato de uso do sistema assinado — direito e <b>obrigação de pagamento</b>. É o primeiro número da série com custo relevante de desistência, e por isso o primeiro com valor informativo alto.<br><br><b>4 · Energizado</b> — Potência com instalação de conexão pronta e comissionada. O ativo existe fisicamente. <b>Ainda não consome nada perto disso</b>, porque a ocupação é gradual.<br><br><b>5 · Consumido</b> — Carga efetivamente medida. <b>É o único dos cinco que descreve demanda.</b> Depende da carga de trabalho contratada pelos clientes do centro de dados, e sobe ao longo de anos de ocupação." },
    { kind: 'nota', tom: "alerta", label: "Números vivos · verificados em 04/08/2026", html: "Os dois números que circulam no país, ambos oficiais, ambos do primeiro degrau da escada: em 1º de junho de 2026, o ministério setorial informou <b>38 GW em pedidos de parecer de acesso</b> para projetos de centro de dados, dos quais <b>7,1 GW</b> associados a investimentos estimados em <b>R$ 159 bilhões</b>. Separadamente, a empresa de planejamento contabiliza <b>54,2 GW</b> em solicitações de conexão até 2038 para centros de dados <em>somados</em> a projetos de hidrogênio e amônia — sendo <b>26,3 GW</b> de centros de dados e <b>27,9 GW</b> de hidrogênio. O próprio ministério informa que os pedidos de conexão para novos empreendimentos cresceram <b>330% entre 2024 e 2025</b>. <b>Os dois conjuntos não são comparáveis</b>, e não por erro de ninguém: têm datas diferentes, perimetros diferentes — um contém hidrogênio, o outro não — e horizontes diferentes. Somá-los, ou tratar a divergência entre eles como contradição, são os dois erros simétricos." },
    { kind: 'titulo', numero: "08.2", texto: "Por que 38 GW é um número grande e uma informação pequena" },
    { kind: 'paragrafo', html: "Uma referência de escala ajuda a ver o problema: o plano decenal projeta que a carga global do sistema alcance <b>115 GW médios em 2035</b> no cenário de referência, e <b>138 GW médios</b> no cenário superior, com demanda máxima integrada podendo superar <b>180 GWh/h</b>. Ou seja: a soma dos <em>pedidos</em> de centro de dados é da mesma ordem de grandeza da carga média projetada do país inteiro daqui a dez anos. Duas leituras são possíveis diante disso, e só uma sobrevive." },
    { kind: 'paragrafo', html: "A leitura fraca é “os centros de dados vão dobrar a demanda do país”. Ela falha porque compara um número do degrau 1 com um número do degrau 5. A leitura forte é: <b>a magnitude dos pedidos indica que o gargalo se deslocou para conexão à rede</b> — que é exatamente o que a criação de uma política específica de gestão da fila de pedidos de acesso ao sistema de transmissão demonstra. O número não informa carga futura; informa <b>pressão sobre um processo administrativo</b>. Essas são duas coisas úteis e completamente diferentes." },
    { kind: 'paragrafo', html: "O plano decenal fez, pela primeira vez, o exercício correto: incluiu eletromobilidade, centros de dados e hidrogênio por eletrólise como <b>cargas especiais</b> e estimou que elas possam representar entre <b>1,2% e 12,9% da demanda total de eletricidade em 2035</b>, conforme o cenário. Repare na amplitude: um fator de dez entre o cenário inferior e o superior, publicado pelo próprio planejador. <b>Essa amplitude é a informação</b>, e citar apenas o extremo superior — que é o que quase todo material faz — é substituir uma faixa por um ponto sem dizer que substituiu." },
    { kind: 'titulo', numero: "08.3", texto: "A conversão correta, e o que ela exige" },
    { kind: 'titulo', numero: null, texto: "Eficiência do uso de energia da instalação" },
    { kind: 'formula', eq: "PUE = energia total da instalação ÷ energia dos equipamentos de tecnologia da informação", desc: "Um indicador de 1,30 significa 0,30 unidade de infraestrutura — refrigeração, conversão, iluminação — para cada unidade consumida por servidor. Não mede eficiência do algoritmo e não mede o carbono da eletricidade consumida: mede apenas o quanto a instalação gasta além da computação." },
    { kind: 'titulo', numero: null, texto: "Energia anual de um centro de dados" },
    { kind: 'formula', eq: "E = P TI × PUE × FC × 8.760", desc: "P TI é a potência de tecnologia da informação instalada e FC é o fator de carga médio — a ocupação efetiva. Separe sempre capacidade instalada, capacidade contratada e carga média: a potência solicitada na conexão costuma ser maior que a instalada, porque incorpora redundância e expansão futura." },
    { kind: 'titulo', numero: "08.4", texto: "Carga rígida, carga flexível, e a promessa que não se sustenta" },
    { kind: 'nota', tom: "neutro", label: "Carga rígida contra carga flexível", html: "<b>Nível 1.</b> Ligar o chuveiro meia hora mais tarde dá quase na mesma. Desligar o elevador do prédio meia hora, não. As duas coisas gastam eletricidade, mas só uma pode esperar.<br><b>Nível 2.</b> Carga rígida precisa ser atendida no instante em que ocorre; carga flexível pode ser deslocada dentro de uma janela sem perder a função. A distinção vale dinheiro: carga flexível responde a preço e reduz a necessidade de reforço de rede; carga rígida exige que o sistema tenha capacidade disponível para o pior instante. <b>Um megawatt flexível e um megawatt rígido custam ao sistema coisas muito diferentes.</b><br><b>Nível 3.</b> Flexibilidade não é um atributo binário do processo — é a combinação de três parâmetros: amplitude da janela de deslocamento, penalidade por deslocar e frequência admissível do evento. Um processo com janela larga e penalidade alta pode ser menos flexível na prática que um de janela curta e penalidade baixa. Daí decorre a exigência de linha de base: sem uma referência contrafactual do que o consumo teria sido, não se mede o serviço prestado e portanto não se remunera — e é por isso que a regulamentação de agregação precede economicamente qualquer discurso sobre flexibilidade de carga." },
    { kind: 'paragrafo', html: "Aplicando isso ao centro de dados: <b>a maior parte da carga de um centro de dados é rígida por contrato</b>, e não por física. O acordo de nível de serviço com o cliente, o desenho de redundância e a exigência de latência são o que a torna rígida. Parte das cargas de treinamento de modelos pode, em princípio, ser deslocada; serviços em linha críticos, não. E os sistemas de energia ininterrupta e os geradores de emergência foram dimensionados para <em>confiabilidade</em>, não para arbitragem — usar bateria de emergência para ganhar dinheiro no mercado consome a mesma reserva que existe para o evento que ela deveria cobrir." },
    { kind: 'paragrafo', html: "Isso não significa que a flexibilidade seja impossível — significa que qualquer proposta concreta de resposta da demanda em centro de dados precisa identificar <b>qual carga de trabalho, em qual janela, com qual mecanismo de transferência e sob responsabilidade de quem</b>. Sem essas quatro respostas, é um argumento de venda, e o interlocutor que o apresenta tem interesse declarável na conclusão." },
    { kind: 'titulo', numero: "08.5", texto: "O que ainda não é lei" },
    { kind: 'paragrafo', html: "O regime especial de tributação para serviços de centro de dados foi originalmente instituído por medida provisória de setembro de 2025, aprovado pela câmara baixa em fevereiro de 2026 na forma de projeto de lei substitutivo — e <b>a medida provisória caducou sem votação pela câmara alta dentro do prazo constitucional</b>. O projeto de lei permanecia em tramitação na segunda casa quando o recesso legislativo se estendeu até 31 de julho de 2026. O regime prevê suspensão de tributos federais na aquisição de equipamentos, condicionada a contrapartidas de uso de energia limpa ou renovável, eficiência energética e hídrica, pesquisa e desenvolvimento, e destinação de parcela mínima da capacidade instalada ao mercado interno." },
    { kind: 'nota', tom: "gold", label: "Classificação correta em 4 de agosto de 2026", html: "<b>Estágio 4 — anunciado com data, sem norma vigente.</b> Não há incentivo tributário federal específico em vigor para centros de dados nesta data. Qualquer projeção de investimento que pressuponha o regime está pressupondo um ato legislativo pendente — o que é legítimo como cenário e ilegítimo como premissa implícita. <b>Este módulo não emite juízo sobre o mérito do regime nem sobre a decisão de não votá-lo.</b>" },
    { kind: 'nota', tom: "neutro", label: "Onde isso entra no produto · com o conflito declarado", html: "A análise setor-específica de centros de dados é um dos verticais nomeados no plano de negócios da linha de pesquisa deste projeto — e é, portanto, o gancho de produto mais direto e o mais desconfortável de todo o currículo. A capacidade analítica que o <b>GridAlpha Research</b> entrega aqui não é dizer que a demanda vai crescer: <b>é separar os cinco números e dizer qual deles o interlocutor está usando</b>. Se a conclusão de uma análise nossa fosse sempre favorável ao crescimento do vertical que queremos atender, a análise não teria valor — nem para o cliente, nem para nós." },
  ],
  'aula-16-09': [
    { kind: 'titulo', numero: "09.1", texto: "A resposta correta a “a IA vai resolver o despacho”" },
    { kind: 'paragrafo', html: "Esta afirmação aparece em quase toda conversa sobre o tema, e a resposta correta <b>nem confirma nem desmente</b>. Ela separa duas coisas que a frase funde: <em>previsão</em> e <em>decisão</em>. Previsão é estimar o que vai acontecer — carga, vento, irradiação, vazão, preço. Decisão é escolher o que fazer dadas as restrições. São problemas de natureza diferente, e o aprendizado estatístico é muito melhor no primeiro do que no segundo." },
    { kind: 'nota', tom: "neutro", label: "Previsão contra decisão", html: "<b>Nível 1.</b> Adivinhar se vai chover é uma coisa. Decidir se o jogo acontece é outra — porque aí também entram o campo, o juiz e as regras do campeonato.<br><b>Nível 2.</b> Previsão melhora a entrada do problema; decisão é o problema. O despacho de um sistema elétrico é um problema de otimização sujeito a restrição física — limite de transmissão, reserva, segurança — e a restrição regulatória — regra de contabilização, ordem de mérito, requisitos de acionamento. Melhorar a previsão de carga em um ponto percentual pode valer muito; substituir a formulação do problema por um modelo estatístico é outra conversa.<br><b>Nível 3.</b> A distinção operacional é entre reduzir incerteza na função objetivo e reduzir o espaço viável. Modelos estatísticos entram naturalmente como estimadores de parâmetro e de cenário, e por isso convivem bem com programação estocástica. Já a decisão precisa de garantia de viabilidade sob restrição de segurança, de auditabilidade do resultado e de imputação de responsabilidade — três propriedades que não são subprodutos de acurácia. Consequência: o ganho próximo está em previsão, em priorização e em copiloto analítico com revisão humana, e não em autonomia irrestrita — e essa afirmação é sobre a estrutura do problema, não sobre a maturidade da técnica." },
    { kind: 'paragrafo', html: "Daí decorre a devolução correta ao interlocutor: <b>qual das duas coisas você está propondo, e qual gargalo ela desvincula?</b> Se a proposta melhora previsão de carga ou de geração variável, ela ataca incerteza — útil e mensurável contra uma linha de base. Se a proposta substitui a decisão de despacho, ela esbarra em restrição física e regulatória que nenhuma quantidade de dado remove. As duas conversas são legítimas; conduzi-las como se fossem uma só é que não é." },
    { kind: 'titulo', numero: "09.2", texto: "Onde a ferramenta desvincula gargalo, e onde não" },
    { kind: 'tabela', linhas: [["Aplicação", "O que produz", "Como se valida", "Gargalo que ela desvincula — ou não"], ["Previsão de carga e de geração variável", "MW por intervalo, com incerteza", "Erro médio por horizonte, contra linha de base simples, em amostra fora do período de ajuste", "<b>Desvincula</b> parte da necessidade de reserva — mas só se a regra permitir reduzir reserva por melhoria de previsão"], ["Otimização de operação de armazenamento", "Pontos de operação e estado de carga alvo", "Simulação contra histórico, com custos e penalidades reais", "<b>Não desvincula</b> o sinal econômico: se o <em>spread</em> não existe, otimizá-lo não cria receita"], ["Detecção de anomalia em medição", "Alerta com pontuação", "Precisão e revocação em conjunto de teste representativo", "<b>Depende</b> de medição avançada existir — é consequência da Aula 05, não alternativa a ela"], ["Manutenção baseada em condição", "Priorização de inspeção", "Custo de falso negativo contra custo de falso positivo, não acurácia agregada", "<b>Desvincula</b> restrição de equipe e de sobressalente — gargalo de cadeia, não de tecnologia"], ["Visão computacional em inspeção de linha", "Triagem de imagem por tipo de defeito", "Conjunto de teste rotulado e confirmação humana", "<b>Não desvincula</b> nada sozinha: o ganho aparece quando a ordem de serviço é redesenhada"], ["Negociação algorítmica", "Sinal, posição e execução", "Validação temporal sequencial, com custo, garantia e limite de crédito", "<b>Não é gargalo de tendência</b>: é atividade de mercado, com riscos próprios — ver 09.3"]] },
    { kind: 'nota', tom: "gold", label: "Linha de base antes de modelo", html: "Um modelo sofisticado treinado sobre medição não reconciliada apenas <b>automatiza erro com aparência de rigor</b> — e a aparência de rigor é o que torna o erro caro. A ordem correta é sempre a mesma: cadastro de ativo, relógio sincronizado, unidade de medida explícita, sinalizadores de qualidade e de estimativa, proprietário declarado do dado — e só então modelo. É a mesma disciplina de procedência que o Módulo 13 exigiu de demonstração financeira." },
    { kind: 'titulo', numero: "09.3", texto: "Negociação algorítmica e risco de modelo" },
    { kind: 'paragrafo', html: "Automatizar coleta, sinal, posição, limite e execução é tecnicamente rotineiro. O que não é rotineiro é sobreviver às condições reais do mercado brasileiro de energia: liquidez desigual entre produtos, predomínio de contrato bilateral, exigência de garantia, regras de contabilização e liquidação com calendário próprio, sazonalização e flexibilidade contratuais, e risco regulatório de mudança de regra no meio da posição." },
    { kind: 'paragrafo', html: "Os seis riscos de modelo que qualquer avaliação séria endereça são sempre os mesmos: <b>sobreajuste</b>, controlado por amostra fora do período e por simplicidade; <b>uso de informação futura</b>, controlado por marcação de tempo e disponibilidade real do dado; <b>viés de sobrevivência</b>, controlado por histórico completo de ativos e contratos; <b>mudança de regime</b>, testada por cenários de hidrologia, de regra e de estrutura de mercado; <b>execução</b>, com limite, liquidez e custo; e <b>governança</b>, com aprovação, interruptor de emergência e trilha de auditoria. <b>Resultado histórico simulado é evidência, não promessa</b> — e uma estratégia só se torna investível quando sobrevive a custo, garantia, restrição contratual e evento extremo." },
    { kind: 'nota', tom: "alerta", label: "O que este módulo não faz aqui", html: "Este módulo <b>não nomeia nenhum ocupante do espaço de plataforma de dados de energia, de otimização de despacho ou de negociação algorítmica</b>, e a razão é declarada e não técnica: esse é literalmente o espaço competitivo do produto que publica este material. Tratar concorrente direto como sujeito de análise neutra não produz análise — produz peça de posicionamento com aparência de estudo. Também não se emite aqui nenhuma recomendação de adoção de ferramenta." },
    { kind: 'titulo', numero: "09.4", texto: "Cibersegurança como condição econômica" },
    { kind: 'paragrafo', html: "Cada sensor, inversor, carregador, bateria e sistema conectado amplia a superfície de ataque, e a consequência não é uma nota de rodapé técnica: é uma <b>entrada negativa no valor esperado</b> de toda a agenda de digitalização. Um sistema que economiza energia mas permite parada de processo, fraude de medição ou comando indevido pode ter valor esperado negativo, e a conta que ignora isso está incompleta por construção." },
    { kind: 'paragrafo', html: "No plano regulatório, existe política setorial de segurança cibernética em vigor desde 2021, que exige dos agentes políticas para prevenir, mitigar e recuperar incidentes em redes críticas — e a proposta de medição avançada em consulta remete expressamente a ela e à legislação geral de proteção de dados, em vez de criar regime próprio. <b>Classificação de estágio: regulado e em implantação contínua</b> — um dos poucos itens deste bloco em que a norma precede o problema em vez de correr atrás dele." },
    { kind: 'nota', tom: "neutro", label: "Onde isso entra no produto", html: "A distinção entre previsão e decisão é exatamente o que separa uma síntese analítica de uma reprodução de comunicado sobre “inteligência artificial no setor elétrico” — que é a categoria de manchete mais abundante e menos informativa do momento. É trabalho de <b>Energy Brief</b>: dizer, de cada anúncio, se ele melhora uma estimativa, se ele muda uma decisão, e contra qual linha de base se mediria isso. <b>Conflito declarado:</b> este é o tópico em que este produto descreve a própria categoria em que se insere. A régua aplicada a terceiros vale integralmente para ele." },
  ],
  'aula-16-10': [
    { kind: 'titulo', numero: "10.1", texto: "Posicionamento é ocupar um elo, não estar no setor" },
    { kind: 'paragrafo', html: "“Posicionada” significa uma coisa específica: <b>possuir ativo, capacidade, dado, cliente, licença, contrato ou competência que reduza o custo de capturar valor naquele elo específico da cadeia</b> — e não significa que a empresa vencerá. Toda tendência se decompõe em cinco elos de captura de valor, e uma empresa pode dominar um e ser irrelevante nos outros quatro. Conglomerados incumbentes costumam ter distribuição e capital; empresas novas costumam ter velocidade e software; fabricantes têm equipamento. <b>O valor se reparte entre camadas, e quase nunca se concentra em uma.</b>" },
    { kind: 'nota', tom: "gold", label: "A regra das três perguntas", html: "Toda pergunta de verificação desta grade obedece a um critério: <b>a resposta precisa ser um documento, um número ou uma data</b> — nunca uma narrativa. “A empresa tem capacidade de execução?” não é uma pergunta de verificação. “Quantos pontos ela energizou nos últimos doze meses, e qual foi o prazo médio entre contrato e energização?” é. A diferença entre as duas é a diferença entre uma reunião e uma análise." },
    { kind: 'titulo', numero: "10.2", texto: "O instrumento assinatura: estágio e gargalo" },
    { kind: 'paragrafo', html: "O verificador abaixo segue a linhagem do Verificador de Lacuna do Módulo 13, do Verificador de Base Temporal do Módulo 14 e do Verificador de Regime e de Camada do Módulo 15. Os doze enunciados foram construídos para serem <b>verdadeiros e insuficientes</b> — nenhum deles é falso, e nenhum deles sustenta a conclusão que aparenta sustentar." },
    { kind: 'lista', itens: ["Defeito A <b>Estágio confundido.</b> Anúncio, outorga ou solicitação lidos como implantação; ou capacidades de estágios diferentes somadas.", "Defeito B <b>Gargalo não identificado.</b> Crescimento extrapolado sem nomear a restrição que vincula — ou com a restrição errada nomeada.", "Defeito C <b>Carga não convertida.</b> Tendência citada qualitativamente, sem a consequência em potência e energia, ou sem dizer se a carga é rígida ou flexível.", "Defeito D <b>Base de comparação não declarada.</b> Dois números comparados sem que se saiba se são comparáveis — entre jurisdições, entre anos ou entre metodologias."] },
    { kind: 'titulo', numero: "10.3", texto: "As três tendências do horizonte corrente" },
    { kind: 'paragrafo', html: "A primeira metade do critério pede três tendências relevantes. Relevância, aqui, não é tamanho esperado — é <b>proximidade do marco verificável seguinte</b>, porque é isso que determina se há decisão a tomar. Sob esse critério, e apenas na data desta verificação, as três são:" },
    { kind: 'nota', tom: "neutro", label: "Linha do tempo", html: "<b>14/08/26</b> — <b>Medição avançada</b>Encerra a fase de contribuição sobre requisitos mínimos. A obrigação de instalar já corre desde março; o que se decide agora é <em>o que</em> será instalado, e portanto que serviços passam a ser possíveis.<br><br><b>28/08/26</b> — <b>Carbono regulado</b>Encerra a contribuição sobre as etapas de implementação das obrigações de mensuração, relato e verificação. É o documento que define <em>quando</em> cada setor começa a relatar — e a prórroga da fase I esgota em dezembro.<br><br><b>02 e 04/12/26</b> — <b>Armazenamento</b>Os dois certames de reserva de capacidade. O resultado converte, de uma vez, uma tendência da posição “regulado e não construído” para “anunciado com data” — e revela preço, que é a informação que ninguém tem hoje." },
    { kind: 'nota', tom: "alerta", label: "A âncora do critério envelhece — e a lista também", html: "Estas três valem <b>na data desta verificação</b>, e por um critério declarado. Em janeiro de 2027 as três serão outras, e o método para encontrá-las é o mesmo: listar os marcos verificáveis dos próximos seis meses, verificar qual gargalo cada um endereça, e escolher aqueles em que o marco <em>desvincula</em> o gargalo que hoje vincula. <b>Uma lista de tendências sem data de verificação é um item de opinião</b>; com data e com marco, é uma agenda." },
    { kind: 'titulo', numero: "10.4", texto: "Fechamento, e a ponte para o próximo bloco" },
    { kind: 'paragrafo', html: "Este módulo não emite veredito sobre nenhuma das seis tendências. Não diz que o armazenamento vai deslanchar, nem que o mercado de carbono vai emperrar, nem que os centros de dados vão transformar o planejamento. Diz, de cada um, <b>em que posição está, qual restrição vincula, quantos MW e MWh significa se a curva continuar, e o que precisaria mudar para a leitura mudar</b>. É a mesma disciplina que o Módulo 12 ensinou para “o Brasil é uma boa aposta?”, o 13 para “essa ação é uma boa compra?”, o 14 para “qual biocombustível é o melhor investimento?” e o 15 para “o pré-sal é compatível com o clima?”." },
    { kind: 'paragrafo', html: "Duas controvérsias deste bloco merecem registro expresso, e nenhuma recebe veredito. A primeira é o <b>mercado de capacidade</b>: quem defende sustenta que ele se torna necessário com penetração alta de fonte variável; quem critica sustenta que ele eleva o custo do consumidor sem ganho proporcional de segurança. Os certames de armazenamento de dezembro de 2026 são, na prática, um teste empírico dessa disputa — e o preço de fechamento será o dado que hoje falta aos dois lados. A segunda é o <b>hidrogênio</b>, e ele é o item deste bloco com maior distância entre atenção recebida e ativo operando: aparece com 27,9 GW em solicitações de conexão até 2038 — degrau 1 da escada — e disputa a mesma fila de acesso que os centros de dados. Otimistas e céticos compõem a controvéria; este módulo entrega o estágio e o gargalo." },
    { kind: 'nota', tom: "neutro", label: "Ponte para o Bloco 17", html: "Este módulo ensinou <b>o que precisaria ser igual</b> para que uma comparação entre jurisdições significasse alguma coisa — desenho de mercado, estrutura tarifária, propriedade do medidor, forma de recuperação do investimento e definição do que se conta como implantado. <b>Não fez a comparação.</b> O Bloco 17 — Cenário Internacional Comparativo — é onde ela é o objeto legítimo, com mercados organizados, desenhos institucionais e trajetórias de política tratados diretamente. A lente de estágio e a de gargalo vão junto: comparar dois países sem classificar o estágio de cada um é o mesmo defeito, numa escala maior." },
  ],
};

/** Os DEZESSEIS exercícios do § Ex. Todos SOLTOS: a varredura por
 *  `/[Aa]ula\s*\d+/` no resumo, no enunciado E no gabarito dos dezesseis
 *  devolve ZERO ocorrência. Padrão desde o Módulo 04 (protocolo §4),
 *  agora pelo OITAVO módulo seguido. */
export const MODULO_16_EXERCICIOS_SOLTOS: LessonActivity[] = [
  {
    id: "m16-ex-01",
    kind: 'discursiva',
    prompt: "01 · “O Brasil tem 38 GW de data centers a caminho.” Em que estágio está essa afirmação?",
    points: 10,
    config: { tag: "Ex 1", gabarito: "<b>Posição 4, e mesmo isso é generoso.</b> O número descreve <em>pedidos de parecer de acesso protocolados</em> — degrau 1 da escada de cinco números. A evidência que a posição 4 exigiria seria compromisso público datado por empreendimento; a que existe é a soma de solicitações administrativas cujo custo de protocolar é próximo de zero. A leitura correta não é sobre carga: é que <b>o gargalo se deslocou para conexão à rede</b>, o que a criação de política específica de gestão da fila confirma." },
  },
  {
    id: "m16-ex-02",
    kind: 'discursiva',
    prompt: "02 · “O primeiro leilão de baterias do Brasil aconteceu em 2026.” Verdadeiro em 4 de agosto de 2026?",
    points: 10,
    config: { tag: "Ex 2", gabarito: "<b>Não.</b> Em 4 de agosto de 2026 existem diretrizes publicadas — portaria normativa de 1º/06/2026 — e dois certames <em>marcados</em> para 2 e 4 de dezembro de 2026. A afirmação está no futuro. O que <b>já aconteceu</b> é mais importante e menos citado: duas resoluções normativas publicadas em 24/06/2026 criaram outorga, regras de acesso, cobrança pelo uso da rede e regime de penalidades para o armazenamento — e valem independentemente do resultado do certame." },
  },
  {
    id: "m16-ex-03",
    kind: 'discursiva',
    prompt: "03 · “O mercado de carbono brasileiro está em formação.” Classifique.",
    points: 10,
    config: { tag: "Ex 3", gabarito: "<b>“Em formação” não é um estado</b> — é a ausência de um. Classificando dispositivo por dispositivo: a lei está <em>em vigor</em> desde 12/12/2024; o prazo original de doze meses da fase I está <em>vencido</em> desde 12/12/2025; a prórroga <em>corre</em> até 12/12/2026; o órgão gestor permanente <em>não existe</em>, e a proposta de sua criação é meta até dezembro de 2026; e há uma obrigação setorial específica já correndo desde a entrada em vigor da lei, no setor segurador. Quatro estados diferentes na mesma norma." },
  },
  {
    id: "m16-ex-04",
    kind: 'discursiva',
    prompt: "04 · Um material de 2025 descreve o Brasil como jurisdição de relato de sustentabilidade obrigatório. Está certo?",
    points: 10,
    config: { tag: "Ex 4", gabarito: "<b>Estava certo quando foi escrito e está errado agora.</b> A obrigatoriedade valeria a partir dos exercícios iniciados em 1º/01/2026 e foi <b>revogada em maio de 2026</b>, antes de produzir efeito, sendo substituída por regime voluntário de “pratique ou explique”. É o exemplo mais limpo do currículo de uma norma que percorreu três estados em três anos — e a revogação foi muito menos noticiada que a obrigatoriedade, o que torna esse erro frequente e difícil de detectar." },
  },
  {
    id: "m16-ex-05",
    kind: 'discursiva',
    prompt: "05 · As vendas de veículos com tomada cresceram 125% no semestre. A curva continua?",
    points: 10,
    config: { tag: "Ex 5", gabarito: "<b>A pergunta correta é qual restrição vincula.</b> Não é maturidade tecnológica — os veículos existem. Não é conexão à rede no agregado — a carga adicionada é pequena nacionalmente. Não é regra habilitante — a exploração comercial da recarga é livre. <b>Vincula cadeia de suprimento</b>, e há uma data: alíquota de importação de 35% em vigor desde 1º/07/2026. Consequência: a série do segundo semestre não é comparável à do primeiro sem declarar a mudança de regime." },
  },
  {
    id: "m16-ex-06",
    kind: 'discursiva',
    prompt: "06 · O armazenamento no Brasil é limitado pelo custo da bateria?",
    points: 10,
    config: { tag: "Ex 6", gabarito: "<b>Não é o candidato que vincula.</b> Vincula o <b>sinal econômico</b>: existe uma fonte de receita contratada — a reserva de capacidade — e nenhum mercado organizado para as demais, enquanto a cobrança pelo uso da rede passou a incidir cumulativamente sobre consumo e injeção. Diagnóstico errado produz recomendação errada com aparência de rigor: se o problema fosse custo de equipamento, a recomendação seria subsidiar compra; sendo remuneração, a recomendação é desenhar produto." },
  },
  {
    id: "m16-ex-07",
    kind: 'discursiva',
    prompt: "07 · Por que a agregação de recursos distribuídos não deslancha, se há 47 GW instalados?",
    points: 10,
    config: { tag: "Ex 7", gabarito: "Vincula <b>regra habilitante</b>, e faltam três definições específicas sem as quais não há contrato possível: <b>quem comanda</b> o recurso, <b>quem responde</b> se ele não entregar, e <b>contra qual linha de base</b> se mede o que foi entregue. Repare que medição avançada é pré-requisito e não gargalo independente — resolvê-la sozinha não cria agregador; e que os 47 GW são potência instalada, não recurso comandável." },
  },
  {
    id: "m16-ex-08",
    kind: 'discursiva',
    prompt: "08 · Um relatório lista cinco “desafios” para uma tendência, sem hierarquia. O que está faltando?",
    points: 10,
    config: { tag: "Ex 8", gabarito: "<b>A análise.</b> Listar restrições sem dizer qual vincula é recusar-se a fazer o trabalho, porque relaxar uma restrição folgada não altera trajetória nenhuma. A leitura completa exige três coisas: qual candidato vincula hoje, <b>quais explicitamente não vinculam e por quê</b>, e o que precisaria mudar para desvincular. Some-se a isso a data: gargalo se desloca, e resolver a regra costuma transferir a pressão para a conexão." },
  },
  {
    id: "m16-ex-09",
    kind: 'discursiva',
    prompt: "09 · Cinquenta vans rodam 30.000 km/ano a 0,24 kWh/km, com 10% de perdas de recarga. Quanta energia da rede?",
    points: 10,
    config: { tag: "Ex 9", gabarito: "50 × 30.000 × 0,24 = 360.000 kWh nas rodas; dividido por 0,90 de eficiência, <b>400.000 kWh — ou 400 MWh por ano</b>. Duas observações que a conta não mostra e que decidem a leitura: isso é <em>energia</em>, e não diz nada sobre potência; e a perda de recarga entra dividindo, não multiplicando — é energia que sai da rede e não chega à roda." },
  },
  {
    id: "m16-ex-10",
    kind: 'discursiva',
    prompt: "10 · Quarenta carregadores de 11 kW com coincidência de 35%. Qual a demanda?",
    points: 10,
    config: { tag: "Ex 10", gabarito: "40 × 11 × 0,35 = <b>154 kW</b>. A potência nominal somada seria 440 kW, e usá-la como demanda superdimensiona a instalação em quase três vezes. <b>Mas o fator de coincidência não é uma constante</b>: numa garagem de frota com horário único de retorno ele se aproxima de 1, e num condomínio residencial ele é muito menor. Antes de calcular, pergunte o perfil de chegada." },
  },
  {
    id: "m16-ex-11",
    kind: 'discursiva',
    prompt: "11 · Um sistema de 2 MW e 4 MWh, com 90% de profundidade de descarga e eficiência de ciclo de 86%. Quanto ele compra para entregar um ciclo?",
    points: 10,
    config: { tag: "Ex 11", gabarito: "Energia útil por ciclo = 4 × 0,90 = <b>3,6 MWh</b> entregues. Energia comprada = 3,6 ÷ 0,86 = <b>4,186 MWh</b>. A duração é 4 ÷ 2 = <b>2 horas</b> — o que já o desqualifica para o produto do certame de dezembro, que exige quatro horas consecutivas na potência máxima. <b>Três grandezas, três conclusões diferentes</b>, e nenhuma delas dedutível das outras duas." },
  },
  {
    id: "m16-ex-12",
    kind: 'discursiva',
    prompt: "12 · Um centro de dados anuncia 100 MW. Quanta carga isso significa?",
    points: 10,
    config: { tag: "Ex 12", gabarito: "<b>Depende de qual 100 MW.</b> Se forem 100 MW de tecnologia da informação, com eficiência de 1,30 e utilização média de 90%: carga média de <b>117 MW</b> e energia anual de <b>1,025 TWh</b>. Se forem 100 MW de potência solicitada no pedido de acesso, a carga média pode ser metade disso ou menos, porque o pedido incorpora redundância e expansão futura. E em nenhum dos dois casos a carga do primeiro ano é essa — a ocupação sobe ao longo de anos." },
  },
  {
    id: "m16-ex-13",
    kind: 'discursiva',
    prompt: "13 · A frota elétrica vai dobrar a demanda elétrica do país?",
    points: 10,
    config: { tag: "Ex 13", gabarito: "<b>Não, e o mesmo número que desmente isso desmente também o oposto.</b> A projeção oficial vai de 627 GWh em 2025 para 7,8 TWh em 2035 — crescimento de mais de doze vezes que, contra 939 TWh de consumo projetado no cenário de referência, representa <b>0,83% do total</b>. Mas “não tem impacto” também está errado: <b>o problema é de potência local</b> — um transformador de bairro, uma garagem de logística —, e nenhum número agregado o revela." },
  },
  {
    id: "m16-ex-14",
    kind: 'discursiva',
    prompt: "14 · Uma empresa consome 120 GWh com fator médio de 0,08 tCO2e/MWh e contrata atributo para 60% do consumo. Qual o escopo 2?",
    points: 10,
    config: { tag: "Ex 14", gabarito: "<b>Dois números, e os dois estão certos.</b> Pelo método de localização: 120.000 MWh × 0,08 = <b>9.600 tCO2e</b>. Pelo método de mercado, com fator zero para o atributo contratado e fator residual de, digamos, 0,12 para o restante: 48.000 × 0,12 = <b>5.760 tCO2e</b>. A diferença de 3.840 toneladas <b>não é redução física de emissão</b> — a rede emitiu exatamente o mesmo. E repare que aplicar o fator médio em vez do residual ao consumo não coberto subestimaria o resultado." },
  },
  {
    id: "m16-ex-15",
    kind: 'discursiva',
    prompt: "15 · Quais são os elos de captura de valor da eletrificação de transporte, e que três perguntas verificam o elo de operação?",
    points: 10,
    config: { tag: "Ex 15", gabarito: "Cinco elos: <b>fabricação e fornecimento</b> de veículo e de equipamento de recarga; <b>instalação e integração</b>, que inclui obra elétrica e conexão; <b>operação e serviço</b>, que é a rede de recarga em si; <b>financiamento</b>, do veículo e do ativo de recarga; e <b>domínio do dado</b>, de sessões, de disponibilidade e de comportamento de recarga. Três perguntas de verificação para o elo de operação, todas com resposta em número: qual a energia entregue por ponto nos últimos doze meses; qual o tempo de indisponibilidade acumulado; e qual a margem por MWh depois de energia, encargos e meios de pagamento." },
  },
  {
    id: "m16-ex-16",
    kind: 'discursiva',
    prompt: "16 · Um investidor pergunta quais empresas brasileiras estão posicionadas no armazenamento. O que você devolve?",
    points: 10,
    config: { tag: "Ex 16", gabarito: "<b>A grade, e depois os nomes — nessa ordem.</b> A grade primeiro porque “posicionada” significa ocupar um elo específico, e uma empresa pode dominar um e ser irrelevante nos outros quatro. Para o armazenamento: quem fabrica célula e quem monta sistema são elos diferentes com barreiras diferentes; quem integra depende de engenharia elétrica e de acesso a ponto de conexão; quem opera depende de sistema de gestão e de competência em mercado de curto prazo; quem financia depende de custo de capital e de leitura de risco regulatório; quem detém o dado de operação e de degradação constrói a única barreira que se acumula. <b>Este ativo não preenche a grade com nomes</b> — e essa recusa é declarada, não omissão: o preenchimento é conversa, e uma lista de nomes envelhece em meses enquanto o método não envelhece." },
  },
];

export const MODULO_16_AULAS: CurriculumAula[] = [
  {
    id: "aula-16-01",
    moduleId: 'modulo-16',
    number: 1,
    totalInModule: 10,
    title: "Cinco posições, e a evidência que cada uma exige",
    subtitle: "Lente de Estágio",
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
    id: "aula-16-02",
    moduleId: 'modulo-16',
    number: 2,
    totalInModule: 10,
    title: "Cinco candidatos, e quase nunca é o primeiro",
    subtitle: "Lente de Gargalo",
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
    id: "aula-16-03",
    moduleId: 'modulo-16',
    number: 3,
    totalInModule: 10,
    title: "Eletrificação de transporte: converter frota em MW",
    subtitle: "Lente de Carga",
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
    id: "aula-16-04",
    moduleId: 'modulo-16',
    number: 4,
    totalInModule: 10,
    title: "Armazenamento: potência, energia e duração são três números",
    subtitle: "Lente de Carga",
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
    id: "aula-16-05",
    moduleId: 'modulo-16',
    number: 5,
    totalInModule: 10,
    title: "Medição avançada: o que ela habilita, quem paga, e de quem é o dado",
    subtitle: "Lente de Gargalo",
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
    id: "aula-16-06",
    moduleId: 'modulo-16',
    number: 6,
    totalInModule: 10,
    title: "Descentralização depois da geração distribuída",
    subtitle: "Lente de Gargalo",
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
    id: "aula-16-07",
    moduleId: 'modulo-16',
    number: 7,
    totalInModule: 10,
    title: "Carbono: dois mercados sem relação de substituição",
    subtitle: "Lente de Estágio",
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
    id: "aula-16-08",
    moduleId: 'modulo-16',
    number: 8,
    totalInModule: 10,
    title: "Centros de dados: os cinco números do mesmo empreendimento",
    subtitle: "Lente de Carga",
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
    id: "aula-16-09",
    moduleId: 'modulo-16',
    number: 9,
    totalInModule: 10,
    title: "Inteligência artificial aplicada: separar previsão de decisão",
    subtitle: "Lente de Gargalo",
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
    id: "aula-16-10",
    moduleId: 'modulo-16',
    number: 10,
    totalInModule: 10,
    title: "Mapear posicionamento sem emitir veredito sobre ninguém",
    subtitle: "Síntese",
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

/** Instrumento de MÓDULO — o do § MAP, fora de qualquer aula. */
export const MODULO_16_INSTRUMENTOS: Instrument[] = [];
