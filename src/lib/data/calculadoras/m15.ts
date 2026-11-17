// Calculadoras do M15 no contrato da aula v3. Posse: a sessão de porte do M15.
// GERADO por tools/alexandria-dados/porte/gerar-calculadoras-m15.mjs — não editar à mão.
//
// Cópia das funções m15-inst-01…10 de alexandria-instrument-calculators.ts (transliteração
// do <script> da fonte, conferida pela extração), com UMA troca: o retorno entrega
// `textos: OUT` — o innerHTML exato de cada readout da fonte, que a função já montava e
// descartava — e `vereditoPtBr: true`. Uma chave aqui SUBSTITUI a de mesmo id no arquivo
// grande. Conferência: tools/alexandria-dados/porte/verificar-calculadoras-m15.mjs.
import type { CalculateFn, EntradaInstrumento } from '../alexandria-instrument-calculators';

/** Helpers do Módulo 11 — espelham `numOf`/`segVal`/`fmt` do <script>
 *  da fonte, que os instrumentos transliterados chamam. `nm` reproduz o
 *  `parseFloat` com vírgula, o fallback em NaN e o clamp, nessa ordem. */
const nm = (v: EntradaInstrumento | undefined, def: number, a: number, b: number): number => {
  const x = v === undefined || v === '' ? NaN : parseFloat(String(v).replace(',', '.'));
  const y = Number.isNaN(x) ? def : x;
  return Number.isNaN(y) ? a : Math.min(b, Math.max(a, y));
};
const sv = (v: EntradaInstrumento | undefined, def: string): string =>
  v === undefined || v === '' ? def : String(v);
/** `fmt` da fonte: casas fixas, pt-BR, e '—' para não-finito. */
const fmt11 = (n: number, d?: number): string =>
  !Number.isFinite(n) ? '—' : n.toLocaleString('pt-BR', { minimumFractionDigits: d || 0, maximumFractionDigits: d || 0 });

/** Helpers do script do Módulo 15, homônimos dos do M11 (`nm`/`sv`/`fmt11`),
 *  para a transliteração mecânica não precisar reescrever chamada nenhuma
 *  além das de DOM. */
const esc15 = (t: unknown): string =>
  String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** Reescreve a moldura de bloco da fonte no idioma da Alexandria.
 *
 *  A fonte compõe cartões (`ocard`, `ro`, `vf-bk`, `fz`) com classes de
 *  CSS que não existem aqui. A regra é UMA e vale para os quatro
 *  instrumentos de consulta: rótulo de bloco vira negrito, fim de bloco
 *  vira quebra, e toda a marcação estrutural restante sai — sobra
 *  ênfase (`b`/`i`/`em`) e quebra. Nenhum texto é acrescentado,
 *  removido ou reordenado, e é isso que a prova de fidelidade confere,
 *  comparando o conteúdo textual contra o do script original. */
const alx15 = (h: string): string =>
  h
    .replace(/<span class="fzv">([\s\S]*?)<\/span>/g, '<b>$1</b>')
    .replace(/<span class="fzn">/g, '<br>')
    .replace(/<span class="(?:ok2|vf-lb|fzk)">([\s\S]*?)<\/span>/g, '<b>$1</b> · ')
    .replace(/<div class="k">([\s\S]*?)<\/div>/g, '<b>$1</b> · ')
    .replace(/<div class="(?:yr|ti|vf-en)">([\s\S]*?)<\/div>/g, '<b>$1</b><br>')
    .replace(/<\/(?:div|p)>/g, '<br>')
    .replace(/<(?!\/?(?:b|i|em|strong|br)\b)[^>]*>/g, '')
    .replace(/(?:<br>\s*){3,}/g, '<br><br>')
    .replace(/^(?:<br>\s*)+/, '')
    .replace(/<\/b>(?=[A-Za-zÀ-ÿ"“])/g, '</b><br>')
    .trim();

/** OUT (readouts do script) + T (readouts guardados à parte), sem o que veio vazio. */
const textosDe = (OUT: Record<string, string>, T: Record<string, string> = {}): Record<string, string> =>
  Object.fromEntries(Object.entries({ ...OUT, ...T }).filter(([, v]) => typeof v === 'string' && v !== ''));

export const CALCULADORAS: Record<string, CalculateFn> = {
  // ── m15 INST 10 · Verificador de regime e de camada · instrumento assinatura ──
  'm15-inst-10': (i) => {
    const OUT: Record<string, string> = {};
    let VER = '';
    const P: string[] = [];
    const E: any = [
    {k:'e01',f:'rg',y:'Regime',n:'Receita por participação',
    en:'"O campo produziu 180 mil barris por dia e a operadora tem 30% de participação; logo a receita dela foi de 54 mil barris por dia vezes o preço realizado."',
    d:'Regime não declarado.',
    falta:'A conta está aritmeticamente correta e só vale sob concessão. Se o campo estiver em partilha, a molécula é da União: a operadora recebe custo em óleo mais uma fatia do excedente, e a receita pode ser fração muito menor do volume que sua participação sugere.',
    p:'Sob qual regime este campo produz — e, se for partilha, qual o percentual de excedente ofertado e em que estágio está a recuperação de custo?',
    c:'"Sob concessão, a receita bruta atribuída à operadora corresponde à sua participação econômica no volume produzido, ao preço realizado. Sob partilha, a mesma participação não se traduz em receita pelo mesmo caminho."'},
    {k:'e02',f:'rg',y:'Regime',n:'Soma de áreas produtoras',
    en:'"Em junho de 2026 o Brasil produziu em 272 áreas produtoras; somando a produção de todas, chega-se à receita bruta do setor."',
    d:'Regime não declarado.',
    falta:'Volume físico soma; receita não. Das 272 áreas, 254 estavam em concessão, 7 em cessão onerosa e 11 em partilha. Nas de partilha, parte relevante da produção é da União, não de quem operou.',
    p:'Quanto do volume total veio de cada um dos três regimes, e qual o excedente da União no período?',
    c:'"A produção nacional somou 5,842 milhões de boe/d em junho de 2026, distribuída em 272 áreas sob três regimes distintos. A receita privada correspondente exige a separação por regime antes de qualquer soma."'},
    {k:'e03',f:'rg',y:'Regime',n:'Localização não define regime',
    en:'"O campo fica dentro do polígono do pré-sal, portanto está sob regime de partilha."',
    d:'Regime não declarado — e inferido a partir da geografia.',
    falta:'O polígono define o regime das <em>novas contratações</em>. Dentro dele coexistem contratos de concessão anteriores, contratos de cessão onerosa e contratos de partilha — e há campos com dois regimes simultâneos, quando o volume excedeu o teto da cessão e o excedente foi licitado sob partilha.',
    p:'Qual é o contrato aplicável a este campo, e há mais de um contrato incidindo sobre volumes distintos do mesmo campo?',
    c:'"O campo está no polígono do pré-sal. O regime aplicável depende do contrato, e a verificação precisa considerar a possibilidade de sobreposição entre cessão onerosa e partilha."'},
    {k:'e04',f:'cm',y:'Camada',n:'Dois preços de gás',
    en:'"O gás natural é negociado a cerca de US$ 6 por MMBtu, mas a indústria brasileira paga mais de US$ 11; a diferença é margem."',
    d:'Camada de preço confundida.',
    falta:'Os dois números pertencem a camadas diferentes da mesma cadeia. Entre a molécula e o consumidor industrial há processamento, transporte contratado, distribuição estadual e tributos. Chamar a diferença de "margem" atribui a um agente o que é a soma de quatro camadas com naturezas de preço distintas — mercado, contrato, tarifa e tributo.',
    p:'Cada um destes dois preços se formou em qual ponto da cadeia, e o que cada um já inclui?',
    c:'"O preço da molécula e o preço final ao consumidor industrial diferem por transporte, distribuição e tributos. Decompor a diferença por camada é o passo anterior a qualquer conclusão sobre competitividade."'},
    {k:'e05',f:'cm',y:'Camada',n:'Reajuste e bomba',
    en:'"A companhia reajustou a gasolina em R$ 0,48 por litro; logo o consumidor pagará R$ 0,48 a mais."',
    d:'Camada de preço confundida.',
    falta:'O reajuste é da camada do produtor. Entre ela e a bomba há mistura obrigatória, tributos federais, tributo estadual, subvenção econômica quando vigente, distribuição e margem de revenda. No caso de 28 de maio de 2026, o mesmo comunicado trazia desconto de R$ 0,44 por litro pela subvenção — efeito líquido de quatro centavos.',
    p:'Quais outras camadas se moveram na mesma janela, e havia subvenção vigente na data?',
    c:'"O preço de venda do produtor às distribuidoras subiu R$ 0,48 por litro. O efeito na bomba depende das cinco camadas seguintes, que se movem por regras e em datas próprias."'},
    {k:'e06',f:'cm',y:'Camada',n:'Referência e receita',
    en:'"A referência internacional de petróleo caiu 10% no trimestre, então a receita do produtor caiu 10%."',
    d:'Camada de preço confundida.',
    falta:'Entre a referência e o preço realizado há diferencial de qualidade do óleo específico, frete e — decisivo — a janela de apreçamento definida em cada contrato de venda. Cada cliente e cada negociação podem ter índice e período próprios, o que faz a variação chegar ao resultado com defasagem e amortecida. Some-se o efeito cambial, que pode compensar ou amplificar.',
    p:'O preço realizado da companhia caiu quanto, e qual foi o efeito cambial no mesmo período?',
    c:'"A referência internacional recuou 10% no trimestre. O efeito sobre a receita depende do preço realizado, das janelas de apreçamento contratuais e do câmbio."'},
    {k:'e07',f:'gr',y:'Grandeza',n:'Reserva vira anos',
    en:'"O Brasil tem 28,877 bilhões de barris de reserva e produz 1,38 bilhão por ano; portanto tem 21 anos de produção garantida."',
    d:'Grandeza de subsolo confundida — e critério não declarado.',
    falta:'Duas coisas. O número citado é 3P, a agregação mais ampla; sob critério provado são 17,488 bilhões, e a relação cai para cerca de 12,7 anos. E a relação reserva/produção <b>não é prazo garantido</b>: congela o denominador no ritmo atual e ignora adições, revisões e declínio.',
    p:'Sob qual critério de certeza, em qual data de referência, e você está lendo isso como indicador estático ou como previsão?',
    c:'"As reservas provadas eram de 17,488 bilhões de barris em 31/12/2025, o que corresponde a uma relação reserva/produção de cerca de 12,7 anos — indicador estático, não prazo de esgotamento."'},
    {k:'e08',f:'gr',y:'Grandeza',n:'Produção vira oferta',
    en:'"A produção de gás foi de 217 milhões de m³/d; logo há 217 milhões disponíveis para a indústria e para as térmicas."',
    d:'Grandeza confundida — bruta contra disponibilizada.',
    falta:'O balanço físico subtrai reinjeção, consumo nas unidades e queima. Em junho de 2026, dos 217,35 milhões de m³/d produzidos, chegaram ao mercado 64,36 milhões — menos de 30%. O aproveitamento reportado foi de 97%, porque reinjeção e consumo contam como uso e não como perda.',
    p:'Este número é produção bruta ou gás disponibilizado ao mercado — e, se for bruta, qual foi a destinação do restante?',
    c:'"A produção bruta foi de 217,35 milhões de m³/d e o gás disponibilizado ao mercado, de 64,36 milhões. A diferença foi reinjeção, consumo nas unidades e queima."'},
    {k:'e09',f:'gr',y:'Grandeza',n:'Reposição vira descoberta',
    en:'"O índice de reposição foi de 147%, então o país descobriu 47% mais petróleo do que produziu."',
    d:'Grandeza confundida — adição líquida contra descoberta.',
    falta:'O índice mede <em>adições líquidas de reserva</em>, e adição tem seis origens possíveis: nova descoberta, extensão de campo conhecido, revisão técnica, revisão por mudança de premissa de preço, aquisição de participação e reclassificação entre critérios de certeza. Reposição por revisão de preço se desfaz quando o preço cai; reposição por descoberta, não.',
    p:'Qual a decomposição das adições por origem, e quanto veio efetivamente de descoberta nova?',
    c:'"O índice de reposição de reservas provadas foi de 147,03% em 2025, correspondente a cerca de 2,023 bilhões de barris de adições líquidas, cuja composição por origem precisa ser verificada antes de qualquer leitura de tendência exploratória."'},
    {k:'e10',f:'ac',y:'Acoplamento',n:'Despacho vira preço de gás',
    en:'"As térmicas a gás estão despachando, logo o gás está barato."',
    d:'Acoplamento elétrico omitido.',
    falta:'Cinco motivos levam uma térmica a gerar: ordem de mérito, inflexibilidade declarada, restrição elétrica, requisitos de acionamento e decisão de garantia de suprimento. Só o primeiro carrega informação econômica sobre o combustível. Inflexibilidade nasce tipicamente da retirada mínima do contrato de gás — se o combustível será pago de todo modo, gerar é melhor que não gerar.',
    p:'A geração está acima ou abaixo do patamar de inflexibilidade declarada, e houve despacho por restrição elétrica ou por decisão de garantia de suprimento no período?',
    c:'"Há geração térmica a gás no período. Determinar se ela responde a mérito econômico exige separar a parcela inflexível e verificar se houve despacho fora da ordem de mérito."'},
    {k:'e11',f:'ac',y:'Acoplamento',n:'Queda internacional vira alívio',
    en:'"O gás caiu no mercado internacional, então o custo variável das térmicas vai cair e o preço de curto prazo também."',
    d:'Acoplamento elétrico omitido — e camada contratual ignorada.',
    falta:'O custo do gás que entra no custo variável não é o preço do dia: é o preço de um contrato com índice, fator de aplicação e defasagem próprios, acrescido do transporte contratado à parte, que se reajusta por regra e em data diferentes. O alívio internacional chega com atraso e amortecido, e pode ser anulado por movimento cambial de sinal contrário.',
    p:'Qual o índice e a defasagem dos contratos de gás das térmicas relevantes, e qual foi o movimento cambial no mesmo período?',
    c:'"Houve recuo da referência internacional de gás. O efeito sobre o custo variável das térmicas depende da fórmula de indexação de cada contrato, da defasagem, do custo de transporte contratado e do câmbio."'},
    {k:'e12',f:'ac',y:'Acoplamento',n:'Eficiência vira competitividade',
    en:'"A usina tem 600 MW de ciclo combinado eficiente, logo tem custo variável competitivo."',
    d:'Acoplamento elétrico omitido — e potência confundida com custo.',
    falta:'Consumo específico é um dos três fatores do custo de combustível; os outros dois são o preço do gás <em>entregue</em>, que inclui transporte contratado, e o câmbio. Uma usina eficiente com contrato caro tem custo variável alto, e uma usina menos eficiente com contrato barato pode despachar antes dela. Potência instalada não entra na conta de custo variável em nenhum ponto.',
    p:'Qual o preço do gás entregue na usina, incluindo transporte, e qual o câmbio usado na declaração do custo variável?',
    c:'"A usina é de ciclo combinado, com consumo específico da ordem de 7 MMBtu por MWh. Seu custo variável depende ainda do preço do gás entregue e do câmbio, e não da potência instalada."'}
    ];
    const f = sv(i['vf-flt'], 'all');
    const lista = E.filter((x: any) => f === 'all' || x.f === f);
    let k = String(i['vf-en'] ?? 'e01');
    if (!lista.some((x: any) => x.k === k)) k = lista.length ? lista[0].k : 'e01';

    let e=null;
    for(let i=0;i<E.length;i++){if(E[i].k===k){e=E[i];break;}}
    if(!e)return { valores: {}, veredito: alx15(P.join('') + VER) };
    P.push('<div class="vf-card">'+
    '<div class="vf-en">'+esc15(e.en)+'</div>'+
    '<div class="ro"><div class="k">Defeito dominante</div><div class="n sm">'+esc15(e.d)+'</div></div>'+
    '<div class="vf-bk"><span class="vf-lb">O que exatamente falta</span><p>'+e.falta+'</p></div>'+
    '<div class="vf-bk"><span class="vf-lb">A pergunta que você faz</span><p>'+esc15(e.p)+'</p></div>'+
    '<div class="vf-bk ok"><span class="vf-lb">Forma corrigida</span><p>'+esc15(e.c)+'</p></div>'+
    '<p class="vf-nt">O enunciado original não contém erro factual. Ele é verdadeiro e insuficiente — que é exatamente a categoria mais difícil de detectar numa conversa.</p>'+
    '</div>');

    OUT['vf-cat'] = e.y; // exposto para a previsão (etiqueta do chip na fonte)
    void OUT;
    const valores: Record<string, number> = {};
    return { valores, textos: textosDe(OUT), veredito: alx15(P.join('') + VER), vereditoPtBr: true };
  },
  // ── m15 INST 01 · Mapa da cadeia · quatro reagrupamentos ──
  'm15-inst-01': (i) => {
    const OUT: Record<string, string> = {};
    let VER = '';
    const P: string[] = [];
    const ELOS: any = {
    campo:{n:'Campo produtor',
    seg:'Upstream', reg:'Os três regimes de E&P', ac:'Indireto', pr:'Misto — mercado e contrato',
    faz:'Eleva, separa e trata o fluido do reservatório, e mede a produção em ponto de medição fiscal.',
    tit:'Concessionário, na concessão; União, na partilha; cessionária, no volume cedido.',
    gra:'Produção em bbl/d e m³/d; soma em boe/d por fator declarado.',
    pre:'Óleo a preço de mercado, com diferencial e frete; gás por contrato bilateral.',
    org:'ANP · Lei nº 9.478/1997, Lei nº 12.351/2010, Lei nº 12.276/2010',
    dev:'Óleo para navio aliviador; gás para gasoduto de escoamento.',
    nao:'Não diz a participação econômica no consórcio, não diz o preço realizado, e não diz sob qual dos três regimes o volume foi produzido.'},
    medicao:{n:'Ponto de medição fiscal',
    seg:'Upstream', reg:'Os três regimes de E&P', ac:'Nenhum', pr:'Valor fixado por norma',
    faz:'Mede o volume produzido para efeitos contratuais e fiscais. É onde o número nasce.',
    tit:'É o ponto em que, na concessão, a titularidade da molécula passa ao concessionário.',
    gra:'Volume medido, em m³ e bbl, com incerteza metrológica declarada.',
    pre:'Não há preço aqui — há preço de referência apurado por metodologia da agência para calcular participações.',
    org:'ANP · regulamento técnico de medição e contratos de E&P',
    dev:'O número que alimenta royalty, participação especial e a contabilidade de todos os elos seguintes.',
    nao:'Não diz o preço de venda: o preço de referência fiscal e o preço realizado são camadas distintas e não precisam coincidir.'},
    escoamento:{n:'Gasoduto de escoamento',
    seg:'Midstream', reg:'Acessório ao contrato de E&P', ac:'Indireto', pr:'Acesso negociado entre partes',
    faz:'Leva o gás do campo até a costa ou até a unidade de processamento.',
    tit:'Do proprietário da instalação, que costuma ser o próprio consórcio produtor.',
    gra:'Capacidade e volume movimentado, em m³/d.',
    pre:'Acesso negociado; a regulamentação do acesso de terceiros estava em consulta pública em 04/08/2026.',
    org:'ANP · art. 28 da Lei nº 14.134/2021, sem norma vigente para este tipo de infraestrutura',
    dev:'Gás bruto à unidade de processamento.',
    nao:'Não diz quanto da capacidade está disponível a terceiros — porque a regra que definiria isso ainda não existia na data de consulta.'},
    upgn:{n:'Unidade de processamento',
    seg:'Midstream', reg:'Acessório ao contrato de E&P', ac:'Indireto', pr:'Serviço contratado',
    faz:'Retira contaminantes e frações pesadas, entregando molécula dentro de especificação comercial.',
    tit:'Do proprietário da unidade; a molécula continua sendo de quem a produziu.',
    gra:'Capacidade de processamento em m³/d; rendimento em líquidos de gás natural.',
    pre:'Tarifa ou preço de serviço de processamento, negociado. Sem norma vigente de acesso de terceiros em 04/08/2026.',
    org:'ANP · art. 28 da Lei nº 14.134/2021, regulamentação em consulta pública desde 10/07/2026',
    dev:'Gás especificado — só a partir daqui existe produto comercial.',
    nao:'Não diz se há capacidade disponível para molécula de terceiros, que é exatamente o gargalo que a reforma do gás pretende destravar.'},
    transporte:{n:'Gasoduto de transporte',
    seg:'Midstream', reg:'Fora do E&P · autorização federal', ac:'Direto', pr:'Tarifa de entrada e saída',
    faz:'Movimenta gás especificado em alta pressão entre pontos de entrada e de saída, para carregadores.',
    tit:'Do transportador, que por exigência legal não pode ser dono da molécula que transporta.',
    gra:'Capacidade contratada, capacidade disponível e volume movimentado — três números distintos no mesmo duto.',
    pre:'Tarifa regulada, por modalidade firme ou interruptível.',
    org:'ANP · Lei nº 14.134/2021 e Decreto nº 10.712/2021, alterado pelo Decreto nº 12.153/2024',
    dev:'Molécula no ponto de saída — city gate, térmica ou consumidor livre.',
    nao:'Não diz quanto está efetivamente contratado nem quanto sobra: capacidade instalada e capacidade disponível são grandezas diferentes.'},
    gnl:{n:'Terminal de regaseificação',
    seg:'Midstream', reg:'Fora do E&P · autorização federal', ac:'Direto', pr:'Capacidade contratada e serviço',
    faz:'Recebe gás liquefeito por navio, armazena e devolve a molécula ao estado gasoso.',
    tit:'Do operador do terminal; a molécula é de quem a importou. Quando são o mesmo agente, há exigência de separação contábil.',
    gra:'Capacidade de regaseificação em m³/d; armazenamento em m³ de líquido.',
    pre:'Capacidade mais serviço, sob acesso negociado e não discriminatório, com código de acesso aprovado previamente pela agência.',
    org:'ANP · Resolução nº 1.003/2026, publicada em 02/07/2026, com prazo de 90 dias para os códigos de acesso',
    dev:'Molécula disponível em prazo de semanas — a única oferta nova com esse tempo de resposta no sistema.',
    nao:'Não diz qual parcela do volume está reservada ao uso preferencial do proprietário — campo que a norma de 2026 passou a exigir revisar periodicamente.'},
    refino:{n:'Refinaria',
    seg:'Downstream', reg:'Fora do E&P · autorização federal', ac:'Nenhum', pr:'Misto — estratégia comercial e mercado',
    faz:'Separa e converte a mistura de hidrocarbonetos em produtos especificados.',
    tit:'Do refinador, que compra o cru e é dono dos derivados que produz.',
    gra:'Capacidade instalada e carga processada em bpd; rendimento em % da carga; margem em US$/bbl.',
    pre:'Na saída, estratégia comercial do produtor por polo, sem periodicidade definida. Na entrada, mercado com diferencial de qualidade.',
    org:'ANP para autorização e especificação; órgãos ambientais para licenciamento; defesa da concorrência para conduta',
    dev:'Derivados especificados à distribuição, e o déficit que vira importação.',
    nao:'Não diz o rendimento por produto nem a disponibilidade real — capacidade instalada e produção de um derivado específico são coisas diferentes.'},
    distribuicao:{n:'Distribuidora estadual de gás',
    seg:'Downstream', reg:'Fora do E&P · concessão estadual', ac:'Indireto', pr:'Tarifa regulada estadual',
    faz:'Entrega gás canalizado ao consumidor final por rede de distribuição.',
    tit:'Da concessionária estadual, dentro da sua área de concessão.',
    gra:'Volume distribuído em m³/d, por classe de consumo.',
    pre:'Tarifa regulada por agência estadual, escalonada por faixa de consumo, mais tributos.',
    org:'Agência reguladora estadual · competência do art. 25, §2º da Constituição',
    dev:'Molécula ao consumidor industrial, comercial, residencial ou veicular.',
    nao:'Não diz se o consumidor pode escolher outro fornecedor: essa regra é estadual, varia por unidade da federação, e é objeto de contencioso em pelo menos um estado.'},
    ute:{n:'Termelétrica a gás',
    seg:'Downstream', reg:'Fora do E&P · outorga do setor elétrico', ac:'Fronteira — é onde a cadeia vira eletricidade', pr:'Custo variável declarado',
    faz:'Converte a energia química do gás em energia elétrica e entrega ao sistema interligado.',
    tit:'Do gerador, que é comprador da molécula e titular da energia gerada.',
    gra:'Potência em MW; energia em MWh; consumo específico em MMBtu/MWh; custo variável em R$/MWh.',
    pre:'Do lado do combustível, contrato com indexação e retirada mínima. Do lado da energia, receita fixa pela disponibilidade e variável pelo despacho.',
    org:'ANEEL, ONS, CCEE, MME — e ANP para o parecer de viabilidade de fornecimento de gás',
    dev:'Energia elétrica e um componente de custo que entra no preço pago por todo agente exposto.',
    nao:'Não diz o preço do gás nem se o despacho foi por mérito ou por inflexibilidade: cinco motivos possíveis, e o dado bruto não distingue nenhum.'}
    };
    const DIMS: any = {
    seg:{lb:'Segmento',ordem:['campo','medicao','escoamento','upgn','transporte','gnl','refino','distribuicao','ute']},
    reg:{lb:'Regime jurídico',ordem:['campo','medicao','escoamento','upgn','transporte','gnl','refino','ute','distribuicao']},
    ac:{lb:'Acoplamento elétrico',ordem:['ute','transporte','gnl','campo','escoamento','upgn','distribuicao','medicao','refino']},
    pr:{lb:'Natureza do preço',ordem:['campo','refino','medicao','ute','escoamento','upgn','gnl','transporte','distribuicao']}
    };
    const d = sv(i['mp-dim'], 'seg');
    let k = String(i['mp-elo'] ?? 'campo');
    if (!ELOS[k]) k = 'campo';
    P.push('<div class="ro"><div class="k">' + DIMS[d].lb + '</div><div class="n">' + esc15(ELOS[k][d]) + '</div></div>');

    let e=ELOS[k];
    P.push('<div class="fz i"><span class="fzk">Recebe</span><span class="fzv">'+esc15(e.seg)+
    '</span><span class="fzn">'+esc15(e.faz)+'</span></div>'+
    '<div class="fz c"><span class="fzk">Titularidade</span><span class="fzv">Quem é dono</span>'+
    '<span class="fzn">'+esc15(e.tit)+'</span></div>'+
    '<div class="fz p"><span class="fzk">Grandeza</span><span class="fzv">O que se mede</span>'+
    '<span class="fzn">'+esc15(e.gra)+'</span></div>'+
    '<div class="fz m"><span class="fzk">Preço</span><span class="fzv">'+esc15(e.pr)+
    '</span><span class="fzn">'+esc15(e.pre)+'</span></div>'+
    '<div class="fz o"><span class="fzk">Órgão e norma</span><span class="fzv">Competência</span>'+
    '<span class="fzn">'+esc15(e.org)+'</span></div>');
    P.push('<div class="tl-panel"><div class="yr">'+esc15(e.seg)+' · '+esc15(e.reg)+'</div>'+
    '<div class="ti">'+esc15(e.n)+'</div>'+
    '<div class="bd2">Devolve à camada seguinte: '+esc15(e.dev)+'</div>'+
    '<div class="lg"><b>O que este número não diz</b>'+esc15(e.nao)+'</div></div>');

    void OUT;
    const valores: Record<string, number> = {};
    return { valores, textos: textosDe(OUT), veredito: alx15(P.join('') + VER), vereditoPtBr: true };
  },
  // ── m15 INST 02 · Comparador de regimes ──
  'm15-inst-02': (i) => {
    const OUT: Record<string, string> = {};
    let VER = '';
    const P: string[] = [];
    const R: any = {
    conc:{n:'Concessão',lei:'Lei nº 9.478/1997',
    tit:{t:'O concessionário é titular do petróleo e do gás a partir do ponto de medição. A União é titular da jazida no subsolo, nunca da molécula extraída.',
    res:'Comparabilidade: a produção de um campo de concessão é integralmente receita bruta do consórcio, na proporção da participação econômica de cada sócio. Um volume de partilha não se soma a este para efeito de receita.'},
    est:{t:'Em dinheiro: bônus de assinatura ofertado, royalty mensal sobre o valor da produção, participação especial trimestral quando o campo se qualifica, retenção de área e tributos.',
    res:'Comparabilidade: a parcela pública depende de alíquota e de rentabilidade apurada depois. Ela não é conhecida no momento da licitação, ao contrário do que ocorre na partilha.'},
    lic:{t:'Disputa-se bônus de assinatura e programa exploratório mínimo. O sexto ciclo da Oferta Permanente de Concessão tinha sessão marcada para 07/10/2026, com 495 blocos e cinco áreas de acumulação marginal em oferta potencial.',
    res:'Comparabilidade: o resultado do leilão informa quanto o Estado recebeu adiantado, e nada sobre a repartição da produção futura.'},
    ris:{t:'Integralmente do concessionário. Poço seco é custo irrecuperável, sem ressarcimento e sem compensação em produção futura.',
    res:'Comparabilidade: por carregar todo o risco, o concessionário fica com toda a produção. Comparar o "quanto o Estado leva" entre regimes sem considerar quem carrega o risco exploratório produz conclusão errada.'}},
    part:{n:'Partilha da produção',lei:'Lei nº 12.351/2010',
    tit:{t:'A União é titular do petróleo e do gás produzidos. O contratado tem direito ao custo em óleo e a uma fatia do excedente em óleo, conforme percentual ofertado.',
    res:'Comparabilidade: o mesmo volume físico gera receita privada substancialmente menor que sob concessão. Somar produção de partilha com produção de concessão para estimar receita do setor é o erro estrutural deste tema.'},
    est:{t:'Royalty mensal, tributos, e — o que distingue o regime — hidrocarboneto em espécie: a parcela da União no excedente em óleo, gerida e comercializada pela PPSA, que integra o consórcio e o comitê operacional.',
    res:'Comparabilidade: parte da receita pública não é dinheiro, é molécula. Ela só vira caixa depois de vendida, o que expõe o Estado a preço e a câmbio como qualquer produtor.'},
    lic:{t:'Bônus de assinatura fixo no edital. Disputa-se o percentual de excedente em óleo ofertado à União, a partir de um mínimo. O quarto ciclo da Oferta Permanente de Partilha tinha sessão marcada para 07/10/2026.',
    res:'Comparabilidade: aqui o leilão informa diretamente quanto da produção futura ficará com o Estado — informação que a licitação de concessão não produz.'},
    ris:{t:'O risco exploratório é do contratado, mas o custo reconhecido é recuperável em óleo, dentro de limites contratuais. A União participa sem investir e sem correr o risco de perfuração.',
    res:'Comparabilidade: o perfil de risco-retorno é diferente do da concessão em ambas as pontas. Comparar taxa de retorno entre os dois regimes sem ajustar por recuperação de custo é comparação inválida.'}},
    cess:{n:'Cessão onerosa',lei:'Lei nº 12.276/2010',
    tit:{t:'Contrato único que cedeu à companhia estatal, mediante pagamento e sem licitação, o direito de pesquisa e lavra em áreas do pré-sal, até o teto de cinco bilhões de barris de óleo equivalente.',
    res:'Comparabilidade: quando o volume recuperável excede o teto cedido, o excedente foi licitado sob partilha. O mesmo campo físico passa a ter dois contratos sobre volumes distintos — e duas apurações.'},
    est:{t:'Pagamento pela cessão, royalties e ajustes contratuais previstos no instrumento. Não há disputa competitiva na origem, porque não houve licitação.',
    res:'Comparabilidade: a parcela pública deste regime não é comparável com a de um contrato leiloado, porque o preço da cessão foi negociado e depois revisado, não formado em pregão.'},
    lic:{t:'Não há. É regime de contrato único, perímetro fixo e teto volumétrico, fechado à entrada de novos contratados. Em junho de 2026 respondia por sete das 272 áreas produtoras do país.',
    res:'Comparabilidade: sete áreas parecem pouco até se observar que estão entre as mais produtivas. Número de áreas não é volume, e volume não é receita.'},
    ris:{t:'A cessionária assumiu risco de pesquisa e lavra nas áreas cedidas, com contrapartida financeira definida no ato da cessão e revisões contratuais posteriores.',
    res:'Comparabilidade: por ser contrato único e negociado, este regime é o menos comparável dos três. Toda leitura precisa dizer explicitamente qual parcela do volume do campo está sob cessão e qual está sob partilha.'}}
    };
    const DIMN: any = {tit:'Titularidade da molécula',est:'O que o Estado recebe',lic:'Como se disputa a área',ris:'Quem corre o risco'};

    let r=sv(i['rg-reg'], 'conc');
    let d=sv(i['rg-dim'], 'tit');
    let o=R[r], c=o[d];
    P.push('<div class="ocard"><span class="ok2">Regime</span><b>'+esc15(o.n)+'</b> · '+esc15(o.lei)+'</div>'+
    '<div class="ocard gd2"><span class="ok2">'+esc15(DIMN[d])+'</span>'+esc15(c.t)+'</div>');


    VER = '<b>Ressalva de comparabilidade.</b> '+esc15(c.res);

    void OUT;
    const valores: Record<string, number> = {};
    return { valores, textos: textosDe(OUT), veredito: alx15(P.join('') + VER), vereditoPtBr: true };
  },
  // ── m15 INST 03 · Régua de grandeza de subsolo ──
  'm15-inst-03': (i) => {
    const OUT: Record<string, string> = {};
    let VER = '';

    let p1=nm(i['gs-1p-n'], 17.488, 0.1, 120);
    let k2=nm(i['gs-2p-n'], 1.387, 1, 3);
    let k3=nm(i['gs-3p-n'], 1.651, 1, 4);
    let pd=nm(i['gs-pd-n'], 1.380, 0.01, 6);
    let ad=nm(i['gs-ad-n'], 2.023, 0, 8);
    if(k3<k2){k3=k2;}
    let v1=p1, v2=p1*k2, v3=p1*k3;
    let cr=sv(i['gs-cr'], 'p1');
    let dt=sv(i['gs-dt'], 'sim');
    let vc = cr==='p2'?v2:(cr==='p3'?v3:v1);
    let amp = v1>0 ? (v3/v1-1)*100 : 0;
    let rp = pd>0 ? vc/pd : NaN;
    let irr = pd>0 ? ad/pd*100 : NaN;
    OUT['gs-v1'] = fmt11(v1,3)+'<span class="u"> bi</span>';
    OUT['gs-v2'] = fmt11(v2,3)+'<span class="u"> bi</span>';
    OUT['gs-v3'] = fmt11(v3,3)+'<span class="u"> bi</span>';
    OUT['gs-am'] = '+'+fmt11(amp,1)+'<span class="u">%</span>';
    OUT['gs-rp'] = (cr==='nd'?'—':fmt11(rp,1)+'<span class="u"> anos</span>');
    OUT['gs-ir'] = fmt11(irr,1)+'<span class="u">%</span>';



    if(dt==='nao'){

    VER = '<b>Recusa de leitura — falta a data de referência.</b> Uma reserva sem data de certificação não é um número, é uma afirmação: o mesmo campo pode ter volumes distintos em anos consecutivos por revisão técnica ou por mudança de premissa de preço, sem que nada tenha mudado no subsolo. Antes de comparar com qualquer outro número de reserva, obtenha a data de referência.';
    } else if(cr==='nd'){

    VER = '<b>Recusa de leitura — falta o critério de certeza.</b> Entre o critério mais restrito e o mais amplo desta carteira há '+fmt11(amp,1)+'% de diferença, e ambos os números estariam corretos. Sem saber se a fonte citou provada, provada mais provável, ou as três, o volume não é comparável com nada — inclusive com o do próprio ano anterior.';
    } else if(irr<100 && rp<10){

    VER = '<b>Dois sinais adversos simultâneos.</b> Reposição de '+fmt11(irr,1)+'% — abaixo do produzido no período — combinada com relação reserva/produção de '+fmt11(rp,1)+' anos sob o critério '+(cr==='p1'?'provado':(cr==='p2'?'2P':'3P'))+'. Nenhum dos dois isolado autorizaria conclusão; juntos, indicam carteira que encolhe. Ainda assim, verifique a origem das adições antes de concluir: um único ano é volátil.';
    } else if(irr>=100 && rp>=10){

    VER = '<b>Dois sinais favoráveis, e nenhuma conclusão sobre o futuro.</b> Reposição de '+fmt11(irr,1)+'% e relação reserva/produção de '+fmt11(rp,1)+' anos sob o critério citado. Relação reserva/produção <b>não é prazo de esgotamento</b>: ela congela o denominador no ritmo atual. E a reposição precisa ser decomposta — descoberta, extensão, revisão técnica, revisão de preço, aquisição ou reclassificação produzem o mesmo indicador com significados diferentes.';
    } else {

    VER = '<b>Sinais divergentes — não conclua por um só.</b> Reposição de '+fmt11(irr,1)+'% e relação reserva/produção de '+fmt11(rp,1)+' anos sob o critério citado. Quando reposição e vida de reservas apontam em sentidos opostos, a explicação costuma estar na composição das adições ou numa mudança recente de ritmo de produção. Peça a decomposição antes de qualquer leitura de tendência.';
    }

    void OUT;
    const valores: Record<string, number> = {};
    const put = (k: string, v: number) => { if (Number.isFinite(v)) valores[k] = v; };
    put("gs-v1", v1);
    put("gs-v2", v2);
    put("gs-v3", v3);
    put("gs-am", amp);
    put("gs-rp", cr === 'nd' ? NaN : rp);
    put("gs-ir", irr);
    return { valores, textos: textosDe(OUT), veredito: alx15(VER), vereditoPtBr: true };
  },
  // ── m15 INST 04 · Calculadora de parcela do Estado ──
  'm15-inst-04': (i) => {
    const OUT: Record<string, string> = {};
    let VER = '';
    const REP: any = {
    ter:{n:'Campo terrestre',u:50,e:40,m:10,
    nt:'Art. 50 da Lei nº 9.478/1997: 50% à União, 40% aos estados produtores e 10% aos municípios produtores.'},
    mar:{n:'Marítimo · comercialidade após 12/2012',u:50,e:40,m:10,
    nt:'Mesmos percentuais, com beneficiários confrontantes, nos termos da Lei nº 12.858/2013, que também vinculou parcela a educação e saúde.'},
    pre:{n:'Marítimo no polígono · comercialidade anterior',u:50,e:40,m:10,
    nt:'Campos com comercialidade anterior a 03/12/2012 e produção no polígono seguem desenho próprio previsto na legislação; os percentuais aqui são simplificação didática.'}
    };

    let vol=nm(i['pe-vol-n'], 180, 1, 1200);
    let pr=nm(i['pe-pr-n'], 80.61, 20, 160);
    let cx=nm(i['pe-cx-n'], 5.26, 2.5, 9);
    let al=nm(i['pe-al-n'], 10, 5, 15);
    let de=nm(i['pe-de-n'], 45, 10, 90);
    let pa=nm(i['pe-pa-n'], 25, 0, 40);
    let rep=sv(i['pe-rep'], 'ter');
    let R=REP[rep];
    let rb=vol*1000*365*pr*cx/1e9;
    let ry=rb*al/100;
    let base=rb*(1-de/100)-ry;
    if(base<0)base=0;
    let ps=base*pa/100;
    let tot=ry+ps;
    let tk=rb>0?tot/rb*100:0;
    let es=tot*R.e/100, mu=tot*R.m/100;
    OUT['pe-rb'] = 'R$ '+fmt11(rb,1)+'<span class="u"> bi</span>';
    OUT['pe-ry'] = 'R$ '+fmt11(ry,2)+'<span class="u"> bi</span>';
    OUT['pe-ps'] = 'R$ '+fmt11(ps,2)+'<span class="u"> bi</span>';
    OUT['pe-tk'] = fmt11(tk,1)+'<span class="u">%</span>';
    OUT['pe-es'] = 'R$ '+fmt11(es,2)+'<span class="u"> bi</span>';
    OUT['pe-mu'] = 'R$ '+fmt11(mu,2)+'<span class="u"> bi</span>';



    if(ps<=0.0001 && ry>0){

    VER = '<b>Participação especial nula, royalty positivo — e isso é normal.</b> Com deduções de '+fmt11(de,1)+'% da receita bruta, a base de participação especial ficou em zero. Royalty é compensação sobre o valor da produção e é devida haja ou não lucro; participação especial só existe onde há rentabilidade apurada. <b>São dois fluxos, não um.</b> '+esc15(R.nt);
    } else if(tk>35){

    VER = '<b>Parcela pública de '+fmt11(tk,1)+'% da receita bruta — e um único sinal não sustenta isso.</b> O número depende simultaneamente de volume, de preço de referência e de câmbio, que não se movem juntos. Antes de concluir sobre carga fiscal, teste as três variáveis separadamente: uma queda de preço com câmbio estável, e uma queda de câmbio com preço estável, produzem efeitos diferentes sobre o mesmo campo. '+esc15(R.nt);
    } else {

    VER = '<b>Royalty e participação especial calculados separadamente.</b> Parcela pública de '+fmt11(tk,1)+'% da receita bruta, dos quais R$ '+fmt11(es,2)+' bi aos estados e R$ '+fmt11(mu,2)+' bi aos municípios sob o desenho selecionado. Lembre-se de que os dois fluxos alcançam <b>conjuntos de beneficiários muito diferentes</b>: royalty chega a centenas de municípios, participação especial a poucas dezenas. '+esc15(R.nt);
    }

    void OUT;
    const valores: Record<string, number> = {};
    const put = (k: string, v: number) => { if (Number.isFinite(v)) valores[k] = v; };
    put("pe-rb", rb);
    put("pe-ry", ry);
    put("pe-ps", ps);
    put("pe-tk", tk);
    put("pe-es", es);
    put("pe-mu", mu);
    return { valores, textos: textosDe(OUT), veredito: alx15(VER), vereditoPtBr: true };
  },
  // ── m15 INST 05 · Decompositor de preço de combustível ──
  'm15-inst-05': (i) => {
    const OUT: Record<string, string> = {};
    let VER = '';

    let p4=nm(i['cb-p4-n'], 3.10, 0.5, 6);
    let bi=nm(i['cb-bi-n'], 0.62, 0, 2);
    let tf=nm(i['cb-tf-n'], 0.42, 0, 2);
    let te=nm(i['cb-te-n'], 1.47, 0, 3);
    let dr=nm(i['cb-dr-n'], 0.98, 0, 3);
    let sb=nm(i['cb-sb-n'], 0, 0, 1.2);
    let sub=Math.min(sb,tf);
    let tot=p4+bi+tf+te+dr-sub;
    if(tot<0.01)tot=0.01;
    let ct=tf+te-sub;
    OUT['cb-tot'] = 'R$ '+fmt11(tot,2)+'<span class="u">/L</span>';
    OUT['cb-pp'] = fmt11(p4/tot*100,1)+'<span class="u">%</span>';
    OUT['cb-ct'] = fmt11(ct/tot*100,1)+'<span class="u">%</span>';
    OUT['cb-pb'] = fmt11(bi/tot*100,1)+'<span class="u">%</span>';
    OUT['cb-pd'] = fmt11(dr/tot*100,1)+'<span class="u">%</span>';





    if(sub>0){

    VER = '<b>Há subvenção ativa nesta composição — e ela muda a leitura de qualquer reajuste.</b> Um aumento na camada do produtor pode ser total ou parcialmente neutralizado por ela, como ocorreu em 28 de maio de 2026, quando um ajuste de R$ 0,48 por litro veio acompanhado de desconto de R$ 0,44 no âmbito da subvenção federal. A subvenção é temporária por construção, editada por medida provisória e revogável por decisão do Executivo: <b>verifique o estado dela na data antes de usar esta composição</b>.';
    } else if(ct/tot>0.40){

    VER = '<b>Tributo responde por '+fmt11(ct/tot*100,1)+'% do preço final — e isso não atribui causa a ninguém.</b> A composição mostra participação, não responsabilidade por variação. Para atribuir uma variação de preço a uma camada, é preciso que <em>apenas ela</em> tenha se movido na janela observada. Mudança simultânea de alíquota estadual, teor de mistura e preço do produtor produz efeito líquido que nenhuma das três explica sozinha.';
    } else {

    VER = '<b>Composição decomposta em cinco camadas.</b> A parcela do produtor é '+fmt11(p4/tot*100,1)+'% do preço final — o que significa que '+fmt11(100-p4/tot*100,1)+'% se formam fora da refinaria. Antes de atribuir uma variação de preço a qualquer camada, verifique se as outras quatro permaneceram constantes na mesma janela. Na maioria dos casos observados, não permaneceram.';
    }

    void OUT;
    const valores: Record<string, number> = {};
    const put = (k: string, v: number) => { if (Number.isFinite(v)) valores[k] = v; };
    put("cb-tot", tot);
    put("cb-pp", p4 / tot * 100);
    put("cb-ct", ct / tot * 100);
    put("cb-pb", bi / tot * 100);
    put("cb-pd", dr / tot * 100);
    return { valores, textos: textosDe(OUT), veredito: alx15(VER), vereditoPtBr: true };
  },
  // ── m15 INST 06 · Régua de refino · capacidade contra produto ──
  'm15-inst-06': (i) => {
    const OUT: Record<string, string> = {};
    let VER = '';

    let cap=nm(i['rf-cap-n'], 1800, 200, 4000);
    let uti=nm(i['rf-uti-n'], 86.4, 40, 100);
    let ren=nm(i['rf-ren-n'], 40, 10, 60);
    let dem=nm(i['rf-dem-n'], 900, 100, 2000);
    let cg=cap*uti/100;
    let di=cg*ren/100;
    let def=di-dem;
    let oc=cap-cg;
    let c1=cap*ren/100;
    let rn=cap>0?dem/cap*100:0;
    OUT['rf-cg'] = fmt11(cg,0)+'<span class="u"> mil bpd</span>';
    OUT['rf-di'] = fmt11(di,0)+'<span class="u"> mil bpd</span>';
    OUT['rf-de'] = (def>=0?'+':'')+fmt11(def,0)+'<span class="u"> mil bpd</span>';
    OUT['rf-oc'] = fmt11(oc,0)+'<span class="u"> mil bpd</span>';
    OUT['rf-c1'] = fmt11(c1,0)+'<span class="u"> mil bpd</span>';
    OUT['rf-rn'] = fmt11(rn,1)+'<span class="u">% da carga</span>';

    if(def>=0){

    VER = '<b>Superávit de '+fmt11(def,0)+' mil bpd no produto avaliado.</b> Isso não significa autossuficiência em derivados: o excedente de um produto convive com déficit de outro, porque a configuração das unidades reparte a carga numa proporção que não é livre. Verifique a cesta inteira antes de concluir, e lembre que rendimento e demanda são editáveis justamente porque nenhum dos dois é constante.';
    } else if(c1>=dem){

    VER = '<b>Déficit de '+fmt11(-def,0)+' mil bpd — e a causa dominante é <em>utilização</em>, não capacidade.</b> Rodando a 100% com o mesmo rendimento, a produção chegaria a '+fmt11(c1,0)+' mil bpd e cobriria a demanda. Mas capacidade ociosa não é produto disponível: só se converte se o cru disponível e a configuração das unidades permitirem. Antes de concluir "falta refinaria", teste as outras três causas — qualidade do cru, configuração e perfil da demanda.';
    } else if(rn<=60){

    VER = '<b>Déficit de '+fmt11(-def,0)+' mil bpd — a causa dominante é <em>rendimento</em>.</b> Seria preciso extrair '+fmt11(rn,1)+'% de diesel da carga total instalada para zerar o descompasso, contra os '+fmt11(ren,1)+'% atuais. Isso é uma questão de configuração de unidades e de qualidade do cru, resolvida por investimento em conversão e por anos de obra — não por elevar a utilização.';
    } else {

    VER = '<b>Déficit de '+fmt11(-def,0)+' mil bpd, e nenhuma causa isolada o explica.</b> Zerar exigiria rendimento de '+fmt11(rn,1)+'% sobre a capacidade instalada total, que está acima do que a configuração de um parque típico entrega. Quando utilização e rendimento juntos não fecham, a conta só se resolve com capacidade adicional, com mudança de cesta de cru, com importação — ou com alguma combinação das três. <b>Este instrumento não recomenda nenhuma delas</b>: devolve a estrutura do descompasso.';
    }

    void OUT;
    const valores: Record<string, number> = {};
    const put = (k: string, v: number) => { if (Number.isFinite(v)) valores[k] = v; };
    put("rf-cg", cg);
    put("rf-di", di);
    put("rf-de", def);
    put("rf-oc", oc);
    put("rf-c1", c1);
    put("rf-rn", rn);
    return { valores, textos: textosDe(OUT), veredito: alx15(VER), vereditoPtBr: true };
  },
  // ── m15 INST 07 · Régua de contrato de gás ──
  'm15-inst-07': (i) => {
    const OUT: Record<string, string> = {};
    let VER = '';
    const CAM: any = {
    mol:{n:'Molécula na saída do processamento',inc:'apenas a molécula especificada'},
    cty:{n:'Entregue no city gate',inc:'molécula mais transporte contratado'},
    ind:{n:'Final ao consumidor industrial',inc:'molécula, transporte, distribuição e tributos'}
    };

    let mol=nm(i['gc-mol-n'], 8.50, 2, 30);
    let tra=nm(i['gc-tra-n'], 1.60, 0, 12);
    let dis=nm(i['gc-dis-n'], 3.20, 0, 15);
    let top=nm(i['gc-top-n'], 80, 0, 100);
    let ret=nm(i['gc-ret-n'], 65, 0, 120);
    let spo=nm(i['gc-spo-n'], 6.00, 1, 40);
    let cam=sv(i['gc-cam'], 'mol');
    let nom = cam==='mol'?mol:(cam==='cty'?mol+tra:mol+tra+dis);
    let fat = Math.max(ret,top);
    let ef = ret>0 ? nom*fat/ret : NaN;
    let sc = isFinite(ef) ? ef-nom : NaN;
    let dt = nom-spo;
    OUT['gc-nom'] = 'US$ '+fmt11(nom,2)+'<span class="u">/MMBtu</span>';
    OUT['gc-vf'] = fmt11(fat,0)+'<span class="u">% do contratado</span>';
    OUT['gc-ef'] = (isFinite(ef)?'US$ '+fmt11(ef,2):'—')+'<span class="u">/MMBtu</span>';
    OUT['gc-sc'] = (isFinite(sc)?'+US$ '+fmt11(sc,2):'—')+'<span class="u">/MMBtu</span>';
    OUT['gc-dt'] = (dt>=0?'+':'')+fmt11(dt/spo*100,1)+'<span class="u">% vs. referência</span>';



    if(ret<=0){

    VER = '<b>Sem retirada, o custo por unidade consumida é indefinido — e o custo total não é zero.</b> Com retirada mínima de '+fmt11(top,0)+'%, o comprador paga por esse volume ainda que não retire nada. É o caso extremo do que a cláusula faz: transferir risco de volume do vendedor para o comprador. Verifique se o contrato tem mecanismo de recuperação posterior antes de tratar o pagamento como perda.';
    } else if(ret<top){

    VER = '<b>Retirada abaixo do mínimo contratado — o custo efetivo é '+fmt11(sc/nom*100,1)+'% acima do preço nominal.</b> Na camada "'+esc15(CAM[cam].n)+'", que inclui '+esc15(CAM[cam].inc)+', o preço citado é US$ '+fmt11(nom,2)+', mas cada unidade efetivamente consumida custa US$ '+fmt11(ef,2)+'. <b>Nenhum dos dois números é errado</b> — eles medem coisas diferentes, e material de divulgação cita o primeiro. Note ainda que a distância para a referência do dia é de '+fmt11(dt/spo*100,1)+'%: o contrato responde ao seu índice, não à cotação corrente.';
    } else {

    VER = '<b>Retirada acima do mínimo — custo efetivo igual ao nominal na camada "'+esc15(CAM[cam].n)+'".</b> Este preço inclui '+esc15(CAM[cam].inc)+', e por isso não se compara com um preço de outra camada nem com a referência do dia sem ajuste. A distância observada para a referência é de '+fmt11(dt/spo*100,1)+'%, e ela não indica erro de precificação: indica que o contrato tem índice, fator e defasagem próprios.';
    }

    void OUT;
    const valores: Record<string, number> = {};
    const put = (k: string, v: number) => { if (Number.isFinite(v)) valores[k] = v; };
    put("gc-nom", nom);
    put("gc-vf", fat);
    put("gc-ef", ef);
    put("gc-sc", sc);
    put("gc-dt", dt / spo * 100);
    return { valores, textos: textosDe(OUT), veredito: alx15(VER), vereditoPtBr: true };
  },
  // ── m15 INST 08 · Classificador de elo ──
  'm15-inst-08': (i) => {
    const OUT: Record<string, string> = {};
    let VER = '';
    const P: string[] = [];
    const no = (pq: any, onde: any): any => {return {ok:false,pq:pq,onde:onde};};
    const si = (reg: any, org: any, nao: any): any => {return {ok:true,reg:reg,org:org,nao:nao};};
    const GN: any = {po:'Produção de petróleo',pg:'Produção de gás',rs:'Reserva',cp:'Capacidade',pr:'Preço',cv:'Custo variável'};
    const EN: any = {ca:'Campo',ep:'Escoamento e processamento',tr:'Transporte',di:'Distribuição',ut:'Termelétrica'};
    const M: any = {
    po:{
    ca:si('Os três regimes de E&P — concessão, partilha ou cessão onerosa','ANP · Lei nº 9.478/1997, Lei nº 12.351/2010 e Lei nº 12.276/2010','Não diz sob qual regime o volume foi produzido, sem o que a receita não se apura; não diz a participação econômica de cada sócio no consórcio; e não diz o preço realizado, que difere da referência internacional por qualidade, frete e janela de apreçamento.'),
    ep:no('Escoamento e processamento movimentam e tratam fluido; não produzem. Um número em barris por dia atribuído a este elo é volume movimentado, não produção medida.','A produção nasce no campo, no ponto de medição fiscal. É o único ponto da cadeia em que essa grandeza existe.'),
    tr:no('Gasoduto de transporte movimenta gás especificado, não petróleo. O óleo deixa a unidade de produção por navio aliviador, e segue por infraestrutura logística distinta.','No campo, para a produção; em terminais e oleodutos, para a movimentação de óleo — que é outro número.'),
    di:no('Distribuição entrega produto ao consumidor final: derivado, no caso dos líquidos, ou gás canalizado. Nenhum dos dois é petróleo cru.','No campo, para produção; na refinaria, para produção de derivados. Confundir os dois é o erro que faz alguém somar cru e derivado.'),
    ut:no('Termelétrica consome combustível e produz eletricidade. Não há produção de petróleo neste elo em nenhuma hipótese.','No campo. A térmica pertence ao fim da cadeia do gás, não à do óleo.')},
    pg:{
    ca:si('Os três regimes de E&P','ANP · Boletim Mensal da Produção','Não diz se o número é produção bruta ou gás disponibilizado ao mercado. Em junho de 2026 a diferença nacional foi de 217,35 para 64,36 milhões de m³/d — menos de 30% do bruto chegou ao mercado.'),
    ep:si('Acessório ao contrato de E&P; acesso de terceiros sem norma vigente em 04/08/2026','ANP · art. 28 da Lei nº 14.134/2021, em consulta pública desde 10/07/2026','<b>Aplica com ressalva:</b> aqui o número é volume movimentado ou processado, nunca produzido. E não diz quanto da capacidade está disponível a terceiros, porque a regra que definiria isso ainda não existia na data de consulta.'),
    tr:no('Transporte movimenta gás já especificado; o volume que passa pelo duto é movimentação, e pode incluir molécula importada e regaseificada que nunca foi produzida no país.','No campo, para produção. No duto, o número correto é volume movimentado, e a distinção importa porque as duas séries divergem.'),
    di:no('A distribuidora estadual entrega gás ao consumidor final; o volume dela é distribuído, não produzido, e reflete demanda local e não oferta nacional.','No campo, para produção. Na distribuidora, volume distribuído por classe de consumo.'),
    ut:no('A térmica consome gás. Um número em m³/d atribuído a ela é consumo de combustível, e depende de quanto ela despachou — não de quanto o país produziu.','No campo, para produção. Na usina, consumo, que se relaciona com a produção nacional apenas de forma indireta.')},
    rs:{
    ca:si('Os três regimes de E&P; a reserva é atributo do contrato e do campo, não do subsolo em abstrato','ANP · Resolução nº 47/2014, declaração anual das operadoras','Não diz o critério de certeza — provada, provada mais provável, ou as três — nem a data de referência. Sem os dois, o número não é comparável com nenhum outro, inclusive com o do próprio campo no ano anterior.'),
    ep:no('Reserva é volume comercialmente recuperável no subsolo. Um duto de escoamento não contém reserva; contém, no máximo, volume em trânsito.','No campo, com critério de certeza e data de referência declarados.'),
    tr:no('Transporte não contém reserva. O gás em linha é estoque operacional, grandeza de outra ordem e de duração de horas, não de anos.','No campo. E cuidado com a colisão de sentido: "reserva" aqui não é reserva de capacidade nem nível de reservatório do setor elétrico.'),
    di:no('A distribuidora não tem reserva de hidrocarboneto. Pode ter estoque contratado ou capacidade de armazenamento, que são coisas distintas.','No campo. Estoque e reserva não são sinônimos e diferem em ordem de grandeza e em regime jurídico.'),
    ut:no('Uma usina não tem reserva. Pode ter combustível estocado ou contrato firme de suprimento — nenhum dos dois é reserva no sentido deste módulo.','No campo. A confusão aqui é frequente porque o setor elétrico usa "reserva" com outros dois sentidos.')},
    cp:{
    ca:si('Os três regimes de E&P','ANP · plano de desenvolvimento aprovado','Aqui capacidade é a da unidade de produção, em bbl/d de processamento de líquido e em m³/d de gás. Não diz a produção efetiva, que depende de poços conectados, disponibilidade e parada programada.'),
    ep:si('Acessório ao contrato de E&P; acesso de terceiros em regulamentação','ANP · art. 28 da Lei nº 14.134/2021','Capacidade de escoamento e de processamento em m³/d. Não diz quanto está comprometido com a produção do próprio proprietário nem quanto sobra para terceiros — que é exatamente o gargalo que a reforma do gás pretende destravar.'),
    tr:si('Fora do E&P · autorização federal','ANP · Lei nº 14.134/2021 e Decreto nº 10.712/2021','Capacidade contratada, capacidade disponível e volume movimentado são <b>três números distintos no mesmo duto</b>. Um número de capacidade sozinho não diz qual dos três é.'),
    di:si('Fora do E&P · concessão estadual','Agência reguladora estadual · art. 25, §2º da Constituição','Capacidade da rede de distribuição. Não diz se há regra estadual que permita ao consumidor escolher outro fornecedor, que é a variável decisiva para quem quer comprar molécula de terceiro.'),
    ut:si('Fora do E&P · outorga do setor elétrico','ANEEL para outorga; ONS para despacho','Potência instalada em MW. <b>Não é energia gerada e não é energia contratada</b> — a mesma separação de grandeza dos Módulos 08 e 14, terceira aparição. E não diz o consumo específico, sem o qual não se converte potência em demanda de gás.')},
    pr:{
    ca:si('Os três regimes de E&P','ANP para o preço de referência fiscal; contratos privados para o preço realizado','Óleo a preço de mercado com diferencial e frete; gás por contrato bilateral. Não diz qual das duas lógicas está em uso, e não diz se o número é preço realizado ou preço de referência apurado para fins fiscais — que não precisam coincidir.'),
    ep:si('Acessório ao contrato de E&P','ANP · regulamentação de acesso em consulta pública','Preço ou tarifa de serviço de escoamento e de processamento, sob acesso negociado. Não diz se houve efetiva possibilidade de negociação por terceiro, porque a norma que a disciplinaria ainda não estava vigente em 04/08/2026.'),
    tr:si('Fora do E&P · autorização federal','ANP · tarifas de transporte','Tarifa de entrada e de saída, por modalidade firme ou interruptível. Não diz o custo total do gás entregue: molécula e transporte são contratos separados, e somar um sem o outro subestima o custo em ponto.'),
    di:si('Fora do E&P · concessão estadual','Agência reguladora estadual','Tarifa regulada, escalonada por faixa de consumo, mais tributos estaduais. Não é comparável com preço de molécula na origem sem somar transporte e distribuição — e é essa comparação indevida que produz a maior parte das afirmações sobre competitividade do gás brasileiro.'),
    ut:no('A termelétrica não vende gás; ela o compra. Um preço atribuído a este elo é preço de compra do combustível, que pertence à camada anterior, ou preço da energia vendida, que é outra grandeza inteiramente.','No campo, no processamento, no transporte ou na distribuição, conforme a camada. Na usina, o que existe é custo variável e receita de energia.')},
    cv:{
    ca:no('Custo variável unitário é conceito do despacho centralizado do setor elétrico. Um campo produtor tem custo de elevação, custo operacional e investimento — nenhum deles entra em ordem de mérito.','Na termelétrica. No campo, a grandeza análoga é o custo de elevação por barril de óleo equivalente, que não inclui investimento, participações nem tributos.'),
    ep:no('Escoamento e processamento têm custo de serviço, não custo variável de despacho.','Na termelétrica. Aqui a grandeza é tarifa ou preço de serviço.'),
    tr:no('Transporte tem tarifa regulada, não custo variável unitário. A confusão decorre de ambos serem componentes do custo final da energia térmica.','Na termelétrica — onde o custo do transporte contratado entra <em>dentro</em> do custo variável, somado ao da molécula.'),
    di:no('Distribuição tem tarifa, não custo variável de despacho. Uma distribuidora estadual de gás não participa da ordem de mérito do setor elétrico.','Na termelétrica. E note que uma térmica conectada à malha de distribuição paga tarifa de distribuição dentro do seu custo variável.'),
    ut:si('Fora do E&P · outorga do setor elétrico','ONS para o despacho; CCEE para a contabilização; MME para as diretrizes de leilão','<b>Aqui a grandeza mora.</b> Mas o número não diz se a usina despachou por mérito ou por inflexibilidade contratual, não diz o consumo específico usado, e não diz qual parcela do custo é molécula e qual é transporte contratado. Cinco motivos levam uma térmica a gerar, e o custo variável explica apenas um.')}
    };
    const gAtual = sv(i['cl-gr'], 'po');

    let e=sv(i['cl-el'], 'ca');
    let c=M[gAtual][e];
    if(c.ok){
    P.push('<div class="ocard gr2"><span class="ok2">Combinação</span><b>Aplica.</b> '+esc15(GN[gAtual])+' é grandeza legítima do elo <b>'+esc15(EN[e])+'</b>.</div>'+
    '<div class="ocard"><span class="ok2">Regime aplicável</span>'+esc15(c.reg)+'</div>'+
    '<div class="ocard gd2"><span class="ok2">Órgão competente</span>'+esc15(c.org)+'</div>');


    VER = '<b>O que este número não diz.</b> '+c.nao;
    } else {
    P.push('<div class="ocard rd2"><span class="ok2">Combinação</span><b>Não se aplica.</b> '+esc15(GN[gAtual])+' não é grandeza do elo <b>'+esc15(EN[e])+'</b>.</div>'+
    '<div class="ocard"><span class="ok2">Por que não</span>'+esc15(c.pq)+'</div>'+
    '<div class="ocard gd2"><span class="ok2">Onde essa grandeza mora</span>'+esc15(c.onde)+'</div>');


    VER = '<b>Atribuição de grandeza ao elo errado.</b> Este é um erro tão frequente quanto errar o valor, e mais difícil de perceber, porque o número citado costuma ser correto — apenas pertence a outro ponto da cadeia. Antes de aceitar qualquer dado, confirme que a grandeza e o elo se correspondem.';
    }

    OUT['cl-comb'] = c.ok ? 'Aplica' : 'Não se aplica'; // exposto para a previsão (estado do painel)
    void OUT;
    const valores: Record<string, number> = {};
    return { valores, textos: textosDe(OUT), veredito: alx15(P.join('') + VER), vereditoPtBr: true };
  },
  // ── m15 INST 09 · Simulador de acoplamento gás → despacho ──
  'm15-inst-09': (i) => {
    const OUT: Record<string, string> = {};
    let VER = '';
    const T: Record<string, string> = {};

    let gas=nm(i['ac-gas-n'], 9.00, 2, 30);
    let cx=nm(i['ac-cx-n'], 5.40, 2.5, 9);
    let hr=nm(i['ac-hr-n'], 7.10, 5.5, 14);
    let om=nm(i['ac-om-n'], 58, 0, 200);
    let cmo=nm(i['ac-cmo-n'], 330, 20, 1200);
    let inf=nm(i['ac-inf-n'], 40, 0, 100);
    let cc=gas*cx*hr;
    let cvu=cc+om;
    let ef=100/(hr*293.07/1000);
    let gb=(cmo-om)/(cx*hr);
    OUT['ac-cc'] = 'R$ '+fmt11(cc,0)+'<span class="u">/MWh</span>';
    OUT['ac-cvu'] = 'R$ '+fmt11(cvu,0)+'<span class="u">/MWh</span>';
    OUT['ac-ef'] = fmt11(ef,1)+'<span class="u">%</span>';
    T['ac-po'] = (cvu<=cmo?'Dentro do mérito':'Fora do mérito')+
    '<span class="u"> · '+(cvu>=cmo?'+':'')+fmt11(cvu-cmo,0)+' R$/MWh</span>';
    OUT['ac-gs'] = fmt11(inf,0)+'<span class="u">% da capacidade</span>';
    OUT['ac-gb'] = (gb>0?'US$ '+fmt11(gb,2):'—')+'<span class="u">/MMBtu</span>';




    if(cvu<=cmo && inf>0){

    VER = '<b>Dois sinais, e eles não dizem a mesma coisa.</b> A usina está dentro da ordem de mérito, com custo variável de R$ '+fmt11(cvu,0)+' contra custo marginal de R$ '+fmt11(cmo,0)+'. <b>Mas '+fmt11(inf,0)+'% da capacidade geraria de qualquer modo</b>, por inflexibilidade declarada — e essa parcela não carrega informação econômica sobre o combustível. Observar a usina gerando não permite inferir o preço do gás: só a geração <em>acima</em> do patamar de inflexibilidade responde ao mérito.';
    } else if(cvu<=cmo && inf<=0){

    VER = '<b>Único caso em que o despacho carrega sinal econômico limpo.</b> Custo variável de R$ '+fmt11(cvu,0)+' abaixo do custo marginal de R$ '+fmt11(cmo,0)+', sem inflexibilidade declarada. Aqui, e apenas aqui, a geração da usina informa algo sobre o custo do combustível. Ainda assim, restrição elétrica, requisitos de acionamento e decisão de garantia de suprimento continuam podendo alterar o despacho efetivo.';
    } else if(cvu>cmo && inf>0){

    VER = '<b>A usina vai gerar sem sinal econômico algum.</b> Custo variável de R$ '+fmt11(cvu,0)+' acima do custo marginal de R$ '+fmt11(cmo,0)+' — o mérito a dispensaria —, mas '+fmt11(inf,0)+'% da capacidade está declarada como inflexível e o despacho ocorre assim mesmo. Esta é a situação que a frase "a térmica ligou, logo o gás está caro" descreve exatamente ao contrário: o gás pode estar caro <em>e</em> a usina gerar, porque quem manda é o contrato. Para entrar no mérito, o gás entregue precisaria cair para cerca de US$ '+fmt11(gb,2)+' por MMBtu.';
    } else {

    VER = '<b>Fora do mérito e sem inflexibilidade — a usina não é convocada por custo.</b> Custo variável de R$ '+fmt11(cvu,0)+' contra custo marginal de R$ '+fmt11(cmo,0)+'. Para entrar na ordem de mérito, o gás entregue precisaria cair para cerca de US$ '+fmt11(gb,2)+' por MMBtu, mantidos câmbio e consumo específico. Note que uma variação cambial de R$ 0,50 move o custo de combustível em cerca de R$ '+fmt11(0.5*gas*hr,0)+' por MWh <em>sem que o preço do gás tenha mudado</em>.';
    }

    void OUT;
    const valores: Record<string, number> = {};
    const put = (k: string, v: number) => { if (Number.isFinite(v)) valores[k] = v; };
    put("ac-cc", cc);
    put("ac-cvu", cvu);
    put("ac-ef", ef);
    put("ac-gs", inf);
    put("ac-gb", gb);
    return { valores, textos: textosDe(OUT, T), veredito: alx15('<b>Posição vs. custo marginal</b><br>' + (T['ac-po'] ?? '') + '<br><br>' + VER), vereditoPtBr: true };
  },
};
