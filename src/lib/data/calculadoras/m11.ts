// @ts-nocheck — o corpo de cada instrumento é o JavaScript LITERAL do <script> da fonte.
// GERADO por tools/alexandria-dados/porte/gerar-instrumentos-m11.mjs — não editar à mão.
// Posse: a sessão de porte do M11. Uma chave aqui SUBSTITUI a de mesmo id em INSTRUMENT_CALCULATORS.
//
// Por quê: o porte antigo dos onze reescreveu a lógica com os mesmos textos e números, mas
// com o veredito sem a classe, a exibição numérica da fonte perdida ("+12,3%"), saídas de
// texto embutidas no veredito e — no painel v3 — a troca de ponto por vírgula estragando
// "1.000 kW". Aqui roda o código da fonte, sem reescrita, contra um ambiente mínimo.
import type { CalculateFn, EntradaInstrumento } from '../alexandria-instrument-calculators';

// ── os auxiliares do script (L3046–3079), literais ───────────────────────────
function esc(t){return String(t).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');}
function clamp(v,a,b){if(isNaN(v))return a;return v<a?a:(v>b?b:v);}
function numOf(el,def,a,b){if(!el)return def;var v=parseFloat(String(el.value).replace(',','.'));if(isNaN(v))return def;return clamp(v,a,b);}
function fmt(n,d){if(isNaN(n)||!isFinite(n))return '—';return n.toLocaleString('pt-BR',{minimumFractionDigits:d||0,maximumFractionDigits:d||0});}

// ── o ambiente mínimo: o que o script usa do DOM, e nada mais ────────────────
const MAPA_CAMPO: Record<string, string> = {"mp-seg":"mp-lente","mp-grid":"mp-item","se-grid":"se-a","rg-nav":"rg-m","sa-grid":"sa-s","or-nav":"or-p"};
function ambiente(entradas: Record<string, EntradaInstrumento>) {
  const els: Record<string, any> = {};
  const valor = (sid: string) => {
    const v = entradas[MAPA_CAMPO[sid] ?? sid];
    return v === undefined || v === '' ? undefined : String(v);
  };
  const $id = (sid: string) =>
    (els[sid] ??= {
      id: sid, value: valor(sid) ?? '', textContent: '', innerHTML: '', className: '', style: {},
      classList: { add() {}, remove() {} }, setAttribute() {}, getAttribute() { return null; },
      addEventListener() {}, querySelector() { return null; },
    });
  const tratadores: [string, (x: any) => void, boolean][] = [];
  return {
    els,
    valor,
    $id,
    $all: () => [],
    segVal: (sid: string) => valor(sid) ?? null,
    segBind: (sid: string, fn: (b: any) => void) => { tratadores.push([sid, fn, true]); },
    chips: (sid: string, _l: unknown, _a: unknown, fn: (k: string) => void) => { tratadores.push([sid, fn, false]); },
    pair: () => {},
    aplicar() {
      for (const [sid, fn, botao] of tratadores) {
        const v = valor(sid);
        if (v !== undefined) fn(botao ? { getAttribute: () => v } : v);
      }
    },
  };
}

/** HTML do painel da fonte → HTML curto do produto: yr/ti em negrito, blocos separados por
 *  linha, e só b/strong/i/em/br/sub/sup. Nenhuma palavra muda. */
function curto(h: string): string {
  return String(h)
    .replace(/<div class="(?:yr|ti)">([\s\S]*?)<\/div>/g, '<b>$1</b><br>')
    .replace(/<\/(?:p|div)>/g, '<br>')
    .replace(/<(?!\/?(?:b|strong|i|em|br|sub|sup)\b)[^>]+>/g, '')
    .replace(/(?:\s*<br>\s*){2,}/g, '<br><br>')
    .replace(/^(?:\s*<br>)+|(?:<br>\s*)+$/g, '')
    .trim();
}
const textoDe = (el: any) => (el.innerHTML ? el.innerHTML : esc(el.textContent));
/** Número de um readout pt-BR ("+12,3%", "175,3 MWh/ano", "1.260") — para a previsão. */
function numero(t: string): number | undefined {
  const m = String(t).replace(/<[^>]+>/g, '').replace(/−/g, '-').match(/[-+]?\d[\d.]*(?:,\d+)?/);
  if (!m) return undefined;
  const x = Number(m[0].replace(/\./g, '').replace(',', '.'));
  return Number.isFinite(x) ? x : undefined;
}

function instrumento(corpo: Function, readouts: string[], telas: string[], nav: string | null): CalculateFn {
  return (entradas) => {
    const amb = ambiente(entradas);
    const ganchos: Record<string, (v: string) => void> = {};
    corpo(amb.$id, amb.$all, amb.segVal, amb.segBind, amb.chips, amb.pair, ganchos);
    amb.aplicar();
    if (nav && ganchos.escolher && amb.valor(nav) !== undefined) ganchos.escolher(amb.valor(nav) as string);
    const textos: Record<string, string> = {};
    const valores: Record<string, number> = {};
    for (const id of readouts) {
      const t = textoDe(amb.$id(id));
      textos[id] = t;
      const v = numero(t);
      if (v !== undefined) valores[id] = v;
    }
    const veredito = telas.map((id) => curto(amb.$id(id).innerHTML)).filter(Boolean).join('<br><br>');
    return { valores, textos, veredito, vereditoPtBr: true };
  };
}

// ── INST·01 — MAPA DA PROPOSTA, QUATRO LENTES (L3111–L3178, literal) ──
function corpo01($id, $all, segVal, segBind, chips, pair, __ganchos) {
  var LENTES={
    eixo:'Cada afirmação de uma proposta pertence a um dos quatro eixos, e o eixo determina que tipo de verdade a afirmação admite. Eixo 1 admite comparação com base publicada. Eixo 2 admite subsunção a norma, com resposta binária. Eixo 3 não admite verificação de valor, apenas de ancoragem. Eixo 4 não produz número, produz pergunta.',
    fonte:'Toda afirmação verificável tem uma fonte independente do vendedor, e quase todas essas fontes são brasileiras, públicas e gratuitas. Quando a fonte independente é o próprio fabricante do equipamento cotado, a verificação continua sendo independente do integrador que vendeu, que é quem tem o incentivo comercial no resultado.',
    sozinho:'A pergunta que separa uma verificação executável de uma verificação teórica. A maior parte dos itens de uma proposta pode ser conferida por quem não é engenheiro, com consulta a base pública e aritmética de planilha. Engenheiro é necessário para dimensionar; para conferir premissa declarada contra fonte publicada, o que se exige é método.',
    falta:'A ausência de um item numa proposta não é neutra: ela é uma premissa feita sem declaração. Ausência de degradação equivale a degradação zero na planilha. Ausência de operação e manutenção equivale a custo zero. Ausência de data de protocolo deixa indeterminado o regime que governa o faturamento por toda a vida útil do sistema.'
  };
  var ITENS=[
    {k:'pot',n:'Potência instalada',
      eixo:'<b>Eixo 1 — físico.</b> A potência é um dado do projeto, não uma projeção. Mas atenção à unidade: o enquadramento de porte usa potência instalada em corrente alternada, e a proposta costuma anunciar potência de pico dos módulos, em corrente contínua. São dois números diferentes e a diferença muda a classificação regulatória.',
      fonte:'A ficha técnica do inversor, para a potência nominal em corrente alternada, e a do módulo, para a potência de pico. Ambas públicas, ambas do fabricante, ambas independentes de quem vendeu.',
      sozinho:'Sim, integralmente. Some a potência nominal dos inversores e compare com o limiar de setenta e cinco quilowatts. Some a potência de pico dos módulos e verifique qual dos dois números a proposta usou para afirmar o porte.',
      falta:'Se a proposta declara apenas potência de pico, o porte não está determinado e o rito de conexão, os prazos legais de injeção e a exigência de garantia de fiel cumprimento ficam indefinidos. Peça a potência nominal dos inversores.'},
    {k:'ger',n:'Geração anual estimada',
      eixo:'<b>Eixo 1 — físico.</b> É o produto de potência instalada, irradiação no plano dos módulos e desempenho global. Os dois primeiros têm referência externa; o terceiro é escolhido por quem faz a conta e é onde a estimativa se infla sem que nada de falso seja afirmado.',
      fonte:'A base nacional de irradiação do instituto de pesquisas espaciais, para a localidade específica, ou a ferramenta de consulta por ponto do centro de referência em energia solar e eólica. Downloads e consultas públicas e gratuitas.',
      sozinho:'Sim. Consulte a irradiação da coordenada, multiplique por potência e por trezentos e sessenta e cinco, e divida a geração declarada pelo resultado. O quociente é o desempenho global implícito. Se ele passa de cem por cento, a afirmação é fisicamente impossível.',
      falta:'Se a proposta não declara irradiação de referência, base de origem, desempenho global, orientação e inclinação, a estimativa não é reprodutível. Premissa que não permite reprodução não é premissa: é resultado apresentado como se fosse dado.'},
    {k:'deg',n:'Taxa de degradação',
      eixo:'<b>Eixo 1 — físico.</b> A degradação é característica previsível do material e é objeto de garantia contratual. Não é opinião do vendedor: é número que o fabricante assumiu por escrito para aquele modelo.',
      fonte:'O termo de garantia de performance do modelo especificado, que declara a perda do primeiro ano e a taxa máxima de degradação anual garantida depois dela. Documento do fabricante, anexo ao datasheet.',
      sozinho:'Sim, e é a verificação mais rápida do módulo inteiro: compare a taxa usada na projeção com a taxa garantida no datasheet. Se a projeção é mais otimista que a garantia, a planilha projeta desempenho que o próprio fabricante não assegura.',
      falta:'Proposta sem menção de degradação está aplicando degradação zero na projeção, ou seja, afirmando que o equipamento entrega no último ano exatamente o que entregou no primeiro. E proposta que não especifica o modelo torna a verificação impossível, o que é, por si só, o achado.'},
    {k:'equip',n:'Modelo e conformidade do equipamento',
      eixo:'<b>Eixo 1 — físico, com componente regulatório.</b> A existência de registro de conformidade é fato verificável; o que ele cobre e o que fica fora do escopo compulsório é matéria de norma.',
      fonte:'O portal do instituto de metrologia, para consulta de registro do produto. A consulta é feita por modelo, nunca por marca, e o que importa é registro vigente obtido sob o regulamento aplicável.',
      sozinho:'Sim. Peça modelo exato de módulo e inversor e consulte o registro. Verifique também se o inversor do projeto está dentro do escopo compulsório, que alcança inversores até setenta e cinco quilowatts, ou fora dele.',
      falta:'Sem o modelo, nada pode ser verificado: nem conformidade, nem degradação garantida, nem características elétricas. A frase equipamento certificado, sem modelo, não é informação verificável e não deve ser aceita como resposta.'},
    {k:'mod',n:'Modalidade de participação declarada',
      eixo:'<b>Eixo 2 — regulatório.</b> Resposta binária. O arranjo de titularidade descrito ou se encaixa na modalidade nomeada, ou não se encaixa, e não há gradação nem margem de interpretação.',
      fonte:'A lei de dois mil e vinte e dois, no artigo que define as quatro modalidades, e a norma de condições gerais, que as incorporou. Além dos documentos societários do próprio cliente, que provam a titularidade.',
      sozinho:'Sim, com o auxílio de quem cuida do jurídico. A verificação é documental: qual documento comprova que o arranjo descrito satisfaz os requisitos da modalidade nomeada. Se a proposta usa vocabulário comercial de plataforma, o primeiro passo é traduzir para o termo da norma.',
      falta:'Se a modalidade não está declarada, ou está declarada em vocabulário de marca, a elegibilidade do arranjo permanece indeterminada, e com ela a legitimidade de todo o benefício projetado para as unidades beneficiárias.'},
    {k:'data',n:'Data de protocolo do pedido de acesso',
      eixo:'<b>Eixo 2 — regulatório.</b> É a variável de maior consequência financeira de toda a proposta, e ela não está no equipamento nem no porte: está num protocolo administrativo na distribuidora.',
      fonte:'O próprio protocolo da distribuidora, com data. Para sistemas existentes, o parecer de acesso. A regra que a data aciona está na lei de dois mil e vinte e dois e na regulamentação de dois mil e vinte e três.',
      sozinho:'Sim. Pergunte a data e compare com os marcos: sete de janeiro de dois mil e vinte e três define o direito adquirido; sete de julho do mesmo ano define a janela que posterga a regra pós-transição para dois mil e trinta e um.',
      falta:'Sem a data, o regime de faturamento aplicável é indeterminado, e portanto toda a projeção de custo da energia compensada é indeterminada. Este é o campo ausente mais caro que uma proposta pode ter.'},
    {k:'reg',n:'Regime de faturamento projetado',
      eixo:'<b>Eixo 2 — regulatório, com fronteira no Eixo 3.</b> Até dois mil e vinte e oito, o percentual está fixado em lei e é verificável. De dois mil e vinte e nove em diante, a regra depende de metodologia ainda em elaboração.',
      fonte:'A lei de dois mil e vinte e dois, nos artigos de transição e na regra pós-transição, e o estado do projeto regulatório da agência, cuja conclusão está prevista para dois mil e vinte e sete.',
      sozinho:'Sim, quanto ao percentual do ano corrente. Quanto ao período posterior a dois mil e vinte e oito, o que se verifica não é o número: é se a proposta reconhece que a regra ainda não existe.',
      falta:'Proposta que projeta o horizonte inteiro sob a mesma regra está tratando como conhecido um parâmetro em elaboração. O achado correto não é que o número está errado, e sim que ele é hipótese apresentada como projeção.'},
    {k:'tar',n:'Trajetória de reajuste tarifário',
      eixo:'<b>Eixo 3 — premissa financeira.</b> Não existe verificação de valor. Existe premissa ancorada em série identificável e premissa solta, e a diferença entre as duas não é o número, é a reprodutibilidade.',
      fonte:'Os atos homologatórios de reajuste tarifário anual da distribuidora que atende a unidade, publicados pela agência reguladora. Série pública, por área de concessão.',
      sozinho:'Sim. Levante os reajustes homologados dos últimos anos daquela concessionária e compare com a taxa que a proposta usou. Não para dizer qual é a certa, e sim para medir o afastamento e perguntar de onde veio a premissa.',
      falta:'Se a taxa não está declarada e apenas está embutida no resultado, a projeção não é auditável. Peça a planilha aberta, ou ao menos a taxa e a fonte da ancoragem.'},
    {k:'om',n:'Operação, manutenção e substituição de inversor',
      eixo:'<b>Eixo 3 — premissa financeira, com teste de coerência interna.</b> Não é preciso saber o custo correto para apontar o problema: basta notar que a projeção pressupõe desempenho que depende de manutenção que ela não orçou.',
      fonte:'O contrato de serviço, se houver, e a vida útil declarada do inversor no seu datasheet. A coerência entre a projeção de desempenho e o orçamento de manutenção é verificável dentro do próprio documento.',
      sozinho:'Sim. Procure a linha de operação e manutenção e a linha de substituição de inversor. Se não existirem, a premissa embutida acaba de ser identificada, e a pergunta ao vendedor é em que ano a troca está prevista.',
      falta:'Ausência de linha de manutenção equivale a custo zero de manutenção com desempenho mantido. Ausência de substituição de inversor equivale a supor que um equipamento eletrônico de potência opera duas décadas e meia sem troca.'},
    {k:'gar',n:'Garantias e responsabilidades',
      eixo:'<b>Eixo 4 — contratual.</b> Não produz número. Produz uma lista de perguntas com destinatário definido, e é o eixo que continua operando por vinte anos depois que todos os outros viraram história.',
      fonte:'O contrato e seus anexos, o termo de garantia do fabricante, e a norma apenas de forma indireta, quanto aos prazos legais de conexão e às vedações de titularidade.',
      sozinho:'Sim, com leitura atenta. As cinco perguntas são sempre as mesmas: prazo de cada garantia, garantidor de cada uma, procedimento de acionamento, quem paga a mão de obra da substituição, e o que sobrevive à extinção do fornecedor.',
      falta:'Se o contrato não foi fornecido, o eixo não pode ser avaliado, e o veredito correto é de insuficiência, não de aprovação. Contrato que só aparece na assinatura é contrato lido por quem já decidiu.'}
  ];
  var lente='eixo', item='pot';
  function render(){
    var lp=$id('mp-lens'); if(lp)lp.innerHTML='<div class="ti">Lente ativa</div><div class="bd2">'+LENTES[lente]+'</div>';
    var it=ITENS.filter(function(o){return o.k===item;})[0];
    var ip=$id('mp-item');
    if(ip&&it)ip.innerHTML='<div class="ti">'+esc(it.n)+'</div><div class="bd2">'+it[lente]+'</div>';
  }
  chips('mp-grid',ITENS,'i',function(k){item=k;render();});
  segBind('mp-seg',function(b){lente=b.getAttribute('data-l');render();});
  render();

}

// ── INST·02 — SEPARADOR DE EIXOS (L3183–L3242, literal salvo a correção abaixo) ──
// CORREÇÃO (Q13, div-m11-inst-01-acentos): «Autoproducao por equiparacao e outro regime juridico» → «Autoprodução por equiparação é outro regime jurídico» — a afirmação a12 perdeu os acentos no script; o resto do arquivo escreve a frase acentuada
function corpo02($id, $all, segVal, segBind, chips, pair, __ganchos) {
  var A=[
    {k:'a1',n:'Gera 1.750 kWh por kWp ao ano',
      e:'Eixo 1 — físico',
      m:'Reconstrução da estimativa a partir da irradiação publicada da localidade e do desempenho global declarado.',
      x:'Não autoriza nenhuma conclusão financeira. Geração por unidade de potência é entrada da conta, não resultado dela.'},
    {k:'a2',n:'Equipamento com certificação',
      e:'Eixo 1 — físico, com componente regulatório',
      m:'Consulta de registro por modelo no portal do instituto de metrologia, com verificação de vigência e de regulamento aplicável.',
      x:'Não autoriza concluir que o equipamento é adequado ao projeto. Certificação atesta conformidade a requisitos, não adequação a um dimensionamento específico. E inversores acima de setenta e cinco quilowatts estão fora do escopo compulsório.'},
    {k:'a3',n:'Sistema enquadrado como microgeração',
      e:'Eixo 2 — regulatório',
      m:'Comparação da potência instalada em corrente alternada com o limiar de setenta e cinco quilowatts. Subsunção binária.',
      x:'Não autoriza usar a potência de pico dos módulos como base da comparação. São grandezas distintas e a confusão entre elas é o erro de porte mais comum.'},
    {k:'a4',n:'Modalidade: geração compartilhada',
      e:'Eixo 2 — regulatório',
      m:'Verificação do instrumento associativo, da lista de participantes, da distribuidora comum e da participação de cada titular no excedente.',
      x:'Não autoriza supor que o regime de faturamento é o padrão. Acima de quinhentos quilowatts em fonte não despachável, com titular único detendo vinte e cinco por cento ou mais, o regime é o agravado.'},
    {k:'a5',n:'Créditos acumulados serão usados no inverno',
      e:'Eixo 2 — regulatório, com aritmética de Eixo 1',
      m:'Comparação da geração estimada com o consumo compensável das beneficiárias, contra o prazo legal de expiração de sessenta meses.',
      x:'Não autoriza supor acúmulo indefinido. Crédito expira e reverte em prol da modicidade tarifária, sem compensação ao consumidor.'},
    {k:'a6',n:'Tarifa sobe 10% ao ano no horizonte',
      e:'Eixo 3 — premissa financeira',
      m:'Comparação com a série de reajustes homologados da concessionária específica. Avaliação de ancoragem, não de valor.',
      x:'Não autoriza afirmar que a premissa é falsa. Autoriza afirmar que ela se afasta da única referência disponível e que a proposta não declara por quê.'},
    {k:'a7',n:'Não há custos recorrentes relevantes',
      e:'Eixo 3 — premissa embutida por omissão',
      m:'Teste de coerência interna: a projeção pressupõe desempenho mantido, que depende de limpeza, monitoramento e reposição.',
      x:'Não autoriza arbitrar um valor de manutenção no lugar. Autoriza registrar a incoerência e pedir o orçamento de manutenção que sustenta a projeção de desempenho.'},
    {k:'a8',n:'Garantia de 25 anos',
      e:'Eixo 4 — contratual',
      m:'Leitura do contrato e do termo de garantia. Separação entre garantia de produto e de performance, com prazo e garantidor de cada uma.',
      x:'Não autoriza tratar a afirmação como obrigação de escopo definido. Sem garantidor, procedimento e custeio de mão de obra, é frase de marketing dentro de um contrato.'},
    {k:'a9',n:'A conta de luz ficará zerada',
      e:'Eixo 2 — regulatório, com resposta imediata',
      m:'Confronto com o valor mínimo faturável previsto na norma e reiterado na lei de dois mil e vinte e dois.',
      x:'Não autoriza nenhuma discussão de grau. A afirmação é incorreta por construção: a fatura de unidade participante do sistema de compensação não chega a zero.'},
    {k:'a10',n:'A demanda contratada cairá com a geração',
      e:'Eixo 2 — regulatório, com base no Módulo 10',
      m:'Verificação de que a proposta descreve alguma ação sobre o contrato de uso, e não apenas a instalação da geração.',
      x:'Não autoriza projetar redução de demanda faturada como efeito automático da instalação. Geração reduz consumo; demanda contratada só muda por ato contratual.'},
    {k:'a11',n:'Instale agora, antes que o Fio B suba',
      e:'Eixo 2 — verdadeiro e incompleto',
      m:'Verificação de que a mesma fonte também informa que a regra a partir de dois mil e vinte e nove ainda não foi definida.',
      x:'Não autoriza tratar a urgência como neutra. A afirmação de base é verdadeira, e é justamente por isso que funciona como argumento de venda. A omissão que costuma acompanhá-la é o que precisa ser notado.'},
    {k:'a12',n:'Seu projeto será autoprodução',
      e:'Eixo 2 — regime jurídico incorreto',
      m:'Confronto com os limiares do regime de equiparação: demanda agregada de trinta mil quilowatts, composta por unidades de três mil quilowatts, e participação societária na titular da outorga.',
      x:'Não autoriza tratar o termo como sinônimo elegante de gerar a própria energia. Autoprodução por equiparação é outro regime jurídico, de outro universo de consumidor.'}
  ];
  function render(k){
    var a=A.filter(function(o){return o.k===k;})[0]; if(!a)return;
    var p=$id('se-out');
    if(p)p.innerHTML='<div class="ti">'+esc(a.n)+'</div>'+
      '<div class="bd2"><b>'+esc(a.e)+'</b><br><br>'+
      '<b>Método de verificação:</b> '+esc(a.m)+'<br><br>'+
      '<b>O que esta afirmação NÃO autoriza concluir:</b> '+esc(a.x)+'</div>';
  }
  chips('se-grid',A,'a',render);
  render('a1');

}

// ── INST·03 — RÉGUA DO MARCO REGULATÓRIO (L3247–L3312, literal) ──
function corpo03($id, $all, segVal, segBind, chips, pair, __ganchos) {
  var M=[
    {k:'m1',n:'2012',
      t:'Resolução Normativa nº 482, de 17 de abril de 2012',
      norma:'Resolução normativa da agência reguladora.',
      desde:'17 de abril de 2012. <b>Revogada</b> pela resolução de fevereiro de 2023.',
      fez:'Criou o acesso de microgeração e minigeração distribuída aos sistemas de distribuição e instituiu o sistema de compensação de energia elétrica no plano infralegal. Por uma década foi a base de tudo, e foi alterada por resoluções sucessivas ao longo do período.',
      estado:'Sem vigência. Proposta comercial que a cita como norma aplicável está desatualizada em pelo menos três instrumentos normativos, e isso é um achado datável.'},
    {k:'m2',n:'2021',
      t:'Resolução Normativa nº 1.000, de 7 de dezembro de 2021',
      norma:'Resolução normativa da agência reguladora — condições gerais de fornecimento.',
      desde:'7 de dezembro de 2021, com alterações posteriores.',
      fez:'Consolidou as regras de prestação do serviço público de distribuição num único instrumento e absorveu a matéria de geração distribuída. É a norma que o Módulo 10 já ensinou a navegar, e é onde a matéria vive hoje.',
      estado:'Vigente e sob alteração contínua. Toda consulta deve ser feita ao texto consolidado, com atenção às notas de inclusão que indicam qual resolução inseriu cada dispositivo.'},
    {k:'m3',n:'2022',
      t:'Lei nº 14.300, de 6 de janeiro de 2022',
      norma:'Lei federal — marco legal da microgeração e minigeração distribuída.',
      desde:'Publicada em 7 de janeiro de 2022; vigência na data da publicação. Partes vetadas promulgadas em agosto de 2022.',
      fez:'Definiu as quatro modalidades e os limiares de porte, instituiu o sistema de compensação em lei, criou o regime de direito adquirido até 2045, estabeleceu o cronograma de transição do componente de rede e delegou à agência a regra que vale depois da transição. Também fixou prazos de conexão, vedações de titularidade e o prazo de expiração de créditos.',
      estado:'Vigente, com alterações pontuais posteriores. É a peça central e a única que precisa ser lida na íntegra por quem avalia propostas.'},
    {k:'m4',n:'2023',
      t:'Resolução Normativa nº 1.059, de 7 de fevereiro de 2023',
      norma:'Resolução normativa da agência reguladora — regulamentação do marco legal.',
      desde:'Publicada em 10 de fevereiro de 2023, com vigência na data da publicação e retificação posterior.',
      fez:'Inseriu na norma de condições gerais as definições de microgeração e minigeração distribuída e a modalidade autoconsumo remoto; criou o capítulo de faturamento do sistema de compensação e as classes GD I, GD II e GD III; e revogou a resolução de 2012 e outras quatro que a haviam alterado.',
      estado:'Vigente. É a fonte da nomenclatura de classes que aparece na resolução homologatória de tarifas da distribuidora e, portanto, na fatura.'},
    {k:'m5',n:'2024',
      t:'Resolução Normativa nº 1.098, de 23 de julho de 2024 · e Resolução CNPE nº 2, de 22 de abril de 2024',
      norma:'Resolução normativa da agência reguladora e resolução do conselho de política energética.',
      desde:'A resolução da agência a partir de julho de 2024; a do conselho publicada em 7 de maio de 2024.',
      fez:'A resolução da agência inseriu a definição de autoconsumo local na norma de condições gerais, dois anos e meio depois de a lei criar o termo, e tratou dos cenários de dispensa de análise de inversão de fluxo. A resolução do conselho fixou as diretrizes de valoração de custos e benefícios da geração distribuída, em cumprimento tardio ao prazo legal de seis meses.',
      estado:'Vigentes. A resolução do conselho é diretriz, não metodologia: ela diz o que a agência deve considerar, não como calcular.'},
    {k:'m6',n:'2025',
      t:'Lei nº 15.269, de 24 de novembro de 2025',
      norma:'Lei federal — reforma do setor elétrico, conversão de medida provisória.',
      desde:'Publicada em 25 de novembro de 2025, sancionada com mais de vinte vetos.',
      fez:'Redefiniu a autoprodução por equiparação com os limiares de trinta mil quilowatts agregados e três mil quilowatts individuais, mais participação societária com direito a voto. Alterou o artigo 25 e revogou o parágrafo único do artigo 22 da lei de 2022, ambos sobre o custeio temporário de componentes não remuneradas pelo consumidor-gerador. Vetou o dispositivo que teria permitido a usinas de grande porte migrar ao regime de geração distribuída pela conexão à distribuição.',
      estado:'<b>Vigente com vetos pendentes de deliberação.</b> Na data de consulta, a sessão conjunta do Congresso Nacional destinada aos vetos havia sido cancelada e dezenas permaneciam trancando a pauta. Verificar o estado antes de uso externo.'},
    {k:'m7',n:'2027 · previsto',
      t:'Metodologia de valoração dos benefícios sistêmicos — a regulamentar',
      norma:'Resolução da agência reguladora, ainda não editada.',
      desde:'<b>Não vigente.</b> Prazo legal original: dezoito meses da publicação da lei de 2022, ou seja, julho de 2023.',
      fez:'Nada ainda. O que existe é processo: tomada de subsídios aberta em dezembro de 2025, com contribuições até março de 2026, a ser seguida de análise de impacto regulatório e consulta pública.',
      estado:'<b>Em projeto regulatório, com conclusão prevista para 2027.</b> É a peça que determina o faturamento das unidades participantes do sistema de compensação a partir de 2029. Toda projeção que atravesse esse ano projeta sobre regra inexistente, e dizer isso é a informação de maior valor que uma avaliação independente pode entregar.'}
  ];
  var nav=$id('rg-nav');
  if(nav){
    nav.innerHTML=M.map(function(m,i){
      return '<button class="tl-chip'+(i===0?' on':'')+'" data-m="'+m.k+'">'+esc(m.n)+'</button>';
    }).join('');
    $all('button',nav).forEach(function(b){
      b.addEventListener('click',function(){
        $all('button',nav).forEach(function(o){o.classList.remove('on');});
        b.classList.add('on'); render(b.getAttribute('data-m'));
      });
    });
  }
  function render(k){
    var m=M.filter(function(o){return o.k===k;})[0]; if(!m)return;
    var p=$id('rg-panel'); if(!p)return;
    p.innerHTML='<div class="ti">'+esc(m.t)+'</div><div class="bd2">'+
      '<b>Qual instrumento:</b> '+m.norma+'<br><br>'+
      '<b>Desde quando:</b> '+m.desde+'<br><br>'+
      '<b>O que mudou:</b> '+m.fez+'<br><br>'+
      '<b>Estado de regulamentação:</b> '+m.estado+'</div>';
  }
  render('m1');
  // GANCHO (acrescentado): __ganchos.escolher = function (v) { render(v); };
  __ganchos.escolher = function (v) { render(v); };
}

// ── INST·04 — CLASSIFICADOR DE PORTE E MODALIDADE (L3317–L3387, literal salvo a correção abaixo) ──
// CORREÇÃO (Q07, div-m11-inst-02-limiar-1000): «if(pot>1000)t.push(» → «if(pot>=1000)t.push(» — com 1.000 kW exatos o script mostrava o ramo "abaixo de 1.000 kW" (2,5%), contra o texto do próprio ramo ("1.000 kW ou mais", 5%) e a prosa da Aula 06
function corpo04($id, $all, segVal, segBind, chips, pair, __ganchos) {
  var MOD={
    local:{n:'Autoconsumo local',
      d:'Geração eletricamente junto à carga, com excedente e crédito integralmente compensados pela mesma unidade consumidora. Definida no inciso I do artigo 1º da lei de 2022 e incorporada ao artigo 2º da norma de condições gerais pela resolução de julho de 2024.',
      prova:'Documento que demonstre que a unidade geradora e a unidade consumidora são a mesma, com o número de instalação. Se a proposta menciona beneficiar outras unidades, o enquadramento declarado está incorreto.',
      esp:false},
    remoto:{n:'Autoconsumo remoto',
      d:'Unidades de titularidade de uma mesma pessoa física ou jurídica, incluídas matriz e filial, com a geração em local diferente das beneficiárias e todas atendidas pela mesma distribuidora. Definida no inciso II do artigo 1º e incorporada ao artigo 2º da norma pela resolução de fevereiro de 2023.',
      prova:'Prova documental de titularidade idêntica de todas as unidades envolvidas e confirmação de que todas são atendidas pela mesma distribuidora. Grupo econômico com pessoas jurídicas distintas não satisfaz o requisito de titularidade.',
      esp:true},
    compart:{n:'Geração compartilhada',
      d:'Reunião de consumidores por consórcio, cooperativa, condomínio civil voluntário ou edilício ou outra associação civil instituída para esse fim, com todas as unidades atendidas pela mesma distribuidora. Definida no inciso X do artigo 1º.',
      prova:'Instrumento associativo com data, lista de participantes, participação de cada titular no excedente, e confirmação de distribuidora comum. A participação do maior titular é o campo que determina se incide o regime agravado.',
      esp:true},
    emuc:{n:'Empreendimento com múltiplas unidades consumidoras',
      d:'Conjunto de unidades em mesma propriedade ou propriedades contíguas, sem separação por via pública, passagem aérea ou subterrânea ou propriedade de terceiro, com as instalações de uso comum constituindo unidade consumidora distinta. Definido no inciso VII do artigo 1º.',
      prova:'Comprovação de contiguidade, existência de unidade consumidora distinta para as áreas de uso comum e responsabilidade formal do condomínio, administração ou proprietário sobre ela.',
      esp:false}
  };
  function calc(){
    var pot=numOf($id('cl-pot'),180,1,6000);
    var f=segVal('cl-fonte','data-f')||'solar';
    var a=segVal('cl-arr','data-a')||'local';
    var m=MOD[a];
    var teto, tetoTx, despachavel;
    if(f==='desp'){despachavel=true;teto=5000;tetoTx='5 MW — fonte despachável';}
    else if(f==='solarbat'){despachavel=true;teto=3000;tetoTx='3 MW — fotovoltaica com baterias qualificadas permanece limitada a 3 MW pelo próprio inciso que a qualifica como despachável';}
    else {despachavel=false;teto=3000;tetoTx='3 MW — fonte não despachável';}
    var porte, pcls;
    if(pot<=75){porte='Microgeração distribuída';pcls='';}
    else if(pot<=teto){porte='Minigeração distribuída';pcls='';}
    else {porte='Fora dos limites de porte';pcls='gold';}
    $id('cl-porte').textContent=porte;
    $id('cl-porte').className='n sm'+(pcls?' '+pcls:'');
    $id('cl-teto').textContent=tetoTx;
    $id('cl-mod').textContent=m.n;

    var vd=$id('cl-vd'); var cls='ok'; var t=[];
    t.push('<b>Classificação.</b> Com '+fmt(pot,0)+' kW instalados em corrente alternada e fonte '+
      (despachavel?'classificada como despachável':'não despachável')+', o sistema é <b>'+porte.toLowerCase()+'</b>. '+
      'O limiar entre micro e minigeração é de 75 kW; o teto superior aplicável a este caso é de '+tetoTx.split(' — ')[0]+'.');
    if(pot>teto){
      cls='per';
      t.push('<b>Fora de escopo.</b> Acima do teto aplicável, a central não se enquadra como geração distribuída e não pode participar do sistema de compensação nesses termos. Verifique se a proposta não está descrevendo um projeto de outro regime, e lembre que é vedado dividir a central em unidades menores para caber no limite.');
    }
    t.push('<b>Modalidade.</b> '+m.d);
    t.push('<b>O que a proposta precisa provar.</b> '+m.prova);
    if(pot>75&&pot<=teto&&!despachavel&&m.esp){
      if(pot>500){
        cls=(cls==='per'?'per':'att');
        t.push('<b>Atenção ao regime especial.</b> Minigeração acima de 500 kW em fonte não despachável, nesta modalidade, cai no regime agravado do parágrafo 1º do artigo 27 <b>se um único titular detiver 25% ou mais da participação do excedente</b>. Este é o campo decisivo, e é o que a proposta mais frequentemente omite. Pergunte a distribuição de participação antes de qualquer outra coisa.');
      } else {
        t.push('<b>Regime especial não aplicável por porte.</b> O regime agravado do parágrafo 1º do artigo 27 pressupõe minigeração acima de 500 kW. Abaixo desse patamar, a modalidade não aciona o agravamento, ainda que haja concentração de participação.');
      }
    } else if(m.esp&&despachavel&&pot>500){
      t.push('<b>Regime especial não aplicável por fonte.</b> O regime agravado exige fonte não despachável. Confirme, no entanto, que a qualificação como despachável está documentada — no caso fotovoltaico, exige armazenamento com modulação de pelo menos vinte por cento da capacidade de geração mensal, despachável por controlador.');
    } else if(!m.esp&&pot>500){
      t.push('<b>Regime especial não aplicável por modalidade.</b> O regime agravado alcança apenas autoconsumo remoto e geração compartilhada. Esta modalidade não é alcançada, o que reduz materialmente a exposição regulatória do arranjo.');
    }
    if(pot>75){
      if(pot>=1000)t.push('<b>Garantia de fiel cumprimento.</b> Para centrais de 1.000 kW ou mais, o artigo 4º exige garantia de cinco por cento do investimento, salvo dispensa aplicável a geração compartilhada por consórcio ou cooperativa e a empreendimento com múltiplas unidades. Verifique se a proposta contemplou esse custo.');
      else if(pot>500)t.push('<b>Garantia de fiel cumprimento.</b> Para centrais acima de 500 kW e abaixo de 1.000 kW, o artigo 4º exige garantia de dois e meio por cento do investimento, salvo dispensa aplicável. Verifique se a proposta contemplou esse custo.');
      t.push('<b>Prazo de conexão.</b> Para minigeração de fonte solar, o prazo de início de injeção é de doze meses da emissão do parecer de acesso; para as demais fontes, trinta meses. Para microgeração, cento e vinte dias, independentemente da fonte.');
    } else {
      t.push('<b>Prazo de conexão e custeio.</b> Para microgeração, o prazo de início de injeção é de cento e vinte dias da emissão do parecer de acesso, e melhorias ou reforços de rede em função exclusiva da conexão são integralmente custeados pela distribuidora, sem participação financeira do consumidor.');
    }
    vd.className='verdict '+cls;
    vd.innerHTML=t.map(function(x){return '<p>'+x+'</p>';}).join('');
  }
  pair('cl-pot','cl-potr',calc);
  segBind('cl-fonte',calc); segBind('cl-arr',calc);
  calc();

}

// ── INST·05 — ROTEADOR DE REGIME (L3392–L3470, literal) ──
function corpo05($id, $all, segVal, segBind, chips, pair, __ganchos) {
  var ESC={2023:15,2024:30,2025:45,2026:60,2027:75,2028:90};
  function calc(){
    var d=segVal('rr-data','data-d')||'ate2022';
    var p=segVal('rr-porte','data-p')||'micro';
    var m=segVal('rr-mod','data-m')||'localemuc';
    var ano=Math.round(numOf($id('rr-ano'),2026,2023,2032));
    var classe, perc, estado, cls='ok', t=[];

    var agravado = (d!=='ate2022'&&d!=='doze') && p==='mini500mais' && m==='conc';

    if(d==='ate2022'||d==='doze'){
      classe='GD I — direito adquirido';
      perc='0% até 31 de dezembro de 2045';
      estado='Regra vigente e integralmente regulamentada';
      cls='ok';
      t.push('<b>Regime.</b> A unidade está abrangida pelo artigo 26 da lei de 2022: conectada na data da publicação ou com solicitação protocolada nos doze meses seguintes. As disposições do artigo 17 <b>não se aplicam até 31 de dezembro de 2045</b>, e todas as componentes tarifárias incidem apenas sobre a diferença positiva entre o consumido e a soma da energia injetada com o crédito acumulado.');
      t.push('<b>Norma, vigência e regulamentação.</b> Lei nº 14.300/2022, artigo 26 e parágrafos; regulamentado no artigo 655-O da norma de condições gerais, com a redação da resolução de fevereiro de 2023. Vigente desde a publicação da lei. Classe GD I para efeito de faturamento e de aplicação de benefícios tarifários na resolução homologatória da distribuidora.');
      t.push('<b>Atenção às hipóteses de cessação.</b> O regime deixa de ser aplicável em três situações: encerramento da relação contratual, salvo troca de titularidade; comprovação de irregularidade de medição atribuível ao consumidor; e, <b>na parcela de aumento</b>, ampliação de potência protocolada após o marco de doze meses. Uma proposta de ampliação que projeta o conjunto inteiro sob este regime está incorreta.');
      t.push('<b>Teto de porte.</b> Para as unidades deste regime, o limite de potência instalada da minigeração é de 5 MW até 31 de dezembro de 2045, independentemente do enquadramento da fonte.');
      if(ano>2045){
        cls='att';
        t.push('<b>Além do horizonte do direito adquirido.</b> O ano informado ultrapassa 31 de dezembro de 2045. A partir daí, a unidade passa a sujeitar-se à regra do artigo 17, cuja metodologia não existe hoje e será definida décadas antes desse marco — mas por processo cujo primeiro ciclo ainda não terminou.');
      }
    } else if(agravado){
      classe='GD III — regime de concentração';
      perc='100% das componentes de distribuição + 40% das de transmissão e conexão + 100% de P&D, EE e taxa de fiscalização';
      estado=(ano<=2028?'Regra vigente e regulamentada':'Regra pós-transição, metodologia a regulamentar');
      cls='per';
      t.push('<b>Regime.</b> Minigeração acima de 500 kW, em fonte não despachável, na modalidade autoconsumo remoto ou geração compartilhada, com um único titular detendo 25% ou mais da participação do excedente. Aplica-se o parágrafo 1º do artigo 27, substancialmente mais oneroso que a escada padrão.');
      t.push('<b>Composição do faturamento até 2028.</b> Cem por cento das componentes relativas à remuneração dos ativos de distribuição, à quota de reintegração regulatória e ao custo de operação e manutenção da distribuição; quarenta por cento das componentes de uso da rede básica, de transformadores de fronteira, de demais instalações de transmissão compartilhadas, de sistemas de distribuição de outras distribuidoras e de conexão; e cem por cento dos encargos de pesquisa e desenvolvimento, eficiência energética e taxa de fiscalização.');
      t.push('<b>Norma, vigência e regulamentação.</b> Lei nº 14.300/2022, artigo 27, parágrafo 1º; regulamentado no artigo 655-P da norma de condições gerais. Classe GD III. Vigente e regulamentado até 2028; a partir de 2029, remissão ao artigo 17.');
      t.push('<b>Por que este regime existe.</b> Ele distingue compartilhamento real de compartilhamento aparente. Um projeto verdadeiramente compartilhado tem participação pulverizada. Um arranjo estruturado para concentrar benefício num único titular por trás de fachada associativa é exatamente o que o limiar de vinte e cinco por cento captura — e é a estrutura que aparece em proposta agressiva de geração compartilhada de grande porte.');
      if(ano>=2029){
        t.push('<b>A partir de 2029.</b> O inciso IV do parágrafo 1º remete à regra do artigo 17, tal como o inciso VII do caput. A metodologia que a define está em projeto regulatório com conclusão prevista para 2027.');
      }
    } else {
      classe='GD II — transição padrão';
      var limiteArt17 = (d==='semestre')?2031:2029;
      if(ano<=2028){
        perc=(ESC[ano]!==undefined?ESC[ano]+'% das componentes de distribuição':'Percentual não fixado para o ano informado');
        estado='Regra vigente e regulamentada';
        cls=(ano>=2027?'att':'ok');
      } else if(ano<limiteArt17){
        perc='90% das componentes de distribuição, conforme regulamentação aplicável ao período';
        estado='Período posterior à escada, com incidência do artigo 17 postergada';
        cls='att';
      } else {
        perc='Todas as componentes não associadas ao custo da energia, abatidos os benefícios sistêmicos — valor a regulamentar';
        estado='<b>Metodologia a regulamentar</b>';
        cls='per';
      }
      t.push('<b>Regime.</b> A unidade não é abrangida pelo artigo 26 e não satisfaz os requisitos cumulativos do regime de concentração. Aplica-se a escada do caput do artigo 27, incidente sobre <b>toda</b> a energia ativa compensada. Classe GD II.');
      t.push('<b>A escada, ano a ano.</b> Quinze por cento a partir de 2023, trinta a partir de 2024, quarenta e cinco a partir de 2025, sessenta a partir de 2026, setenta e cinco a partir de 2027 e noventa a partir de 2028. Os percentuais incidem sobre as componentes de remuneração de ativos, depreciação e operação e manutenção da distribuição — <b>não sobre a tarifa integral</b>.');
      if(d==='semestre'){
        t.push('<b>Janela de postergação.</b> O protocolo caiu entre 8 de janeiro e 7 de julho de 2023, ou seja, entre o décimo terceiro e o décimo oitavo mês da publicação da lei. Pelo parágrafo 2º do artigo 27, a aplicação do artigo 17 dá-se apenas <b>a partir de 2031</b> — dois anos a mais que o padrão. Regulamentado no artigo 655-P da norma de condições gerais.');
      } else {
        t.push('<b>Sem postergação.</b> O protocolo é posterior a 7 de julho de 2023, fora da janela do parágrafo 2º do artigo 27. A regra do artigo 17 incide a partir de 2029.');
      }
      if(ano>=limiteArt17){
        t.push('<b>Aqui a projeção deixa o terreno conhecido.</b> A partir de '+limiteArt17+', o inciso VII do artigo 27 remete ao artigo 17, que manda incidir todas as componentes não associadas ao custo da energia, <b>abatidos todos os benefícios ao sistema elétrico</b>. Tratar isso como cem por cento é adotar a hipótese de que os benefícios calculados serão zero — hipótese possível, e não o texto da lei.');
        t.push('<b>Estado do processo.</b> As diretrizes de valoração vieram pela resolução do conselho de política energética de abril de 2024, quase dois anos após o prazo legal. A agência abriu tomada de subsídios em dezembro de 2025, com contribuições até março de 2026, a ser seguida de análise de impacto regulatório e consulta pública, e <b>conclusão do projeto regulatório prevista para 2027</b>. Nenhuma proposta comercial conhece esse número, porque ele não existe.');
      }
      if(p==='mini500mais'&&m==='pulv'){
        t.push('<b>Por que o regime agravado não incide aqui.</b> O porte e a fonte satisfazem os requisitos, mas nenhum titular detém vinte e cinco por cento ou mais da participação do excedente. A pulverização é o que mantém o arranjo no regime padrão — e é o campo que precisa estar declarado por escrito na proposta, porque é ele que sustenta o enquadramento.');
      }
      if(p==='mini500mais'&&m==='localemuc'){
        t.push('<b>Por que o regime agravado não incide aqui.</b> O porte e a fonte satisfazem os requisitos, mas a modalidade não: o parágrafo 1º do artigo 27 alcança apenas autoconsumo remoto e geração compartilhada. Autoconsumo local e empreendimento com múltiplas unidades ficam fora, ainda que de grande porte.');
      }
    }
    $id('rr-classe').textContent=classe;
    $id('rr-perc').textContent=perc;
    $id('rr-estado').innerHTML=estado;
    var vd=$id('rr-vd');
    vd.className='verdict '+cls;
    vd.innerHTML=t.map(function(x){return '<p>'+x+'</p>';}).join('');
  }
  pair('rr-ano','rr-anor',calc);
  segBind('rr-data',calc); segBind('rr-porte',calc); segBind('rr-mod',calc);
  calc();

}

// ── INST 06 · VERIFICADOR DE GERAÇÃO ESTIMADA (L3475–L3533, literal) ──
function corpo06($id, $all, segVal, segBind, chips, pair, __ganchos) {
  if(!$id('gv-pot'))return;
  function calc(){
    var pot=numOf($id('gv-pot'),100,1,3000);
    var ger=numOf($id('gv-ger'),175,1,6000);
    var irr=numOf($id('gv-irr'),5.2,2,7.5);
    var pr =numOf($id('gv-pr'),78,50,92);
    var refkWh=pot*irr*365*(pr/100);
    var refMWh=refkWh/1000;
    var dev=(ger*1000/refkWh-1)*100;
    var prImp=(ger*1000)/(pot*irr*365)*100;

    $id('gv-ref').textContent=fmt(refMWh,1)+' MWh/ano';
    $id('gv-dev').textContent=(dev>=0?'+':'')+fmt(dev,1)+'%';
    $id('gv-prim').textContent=fmt(prImp,1)+'%';

    var cls,t=[];
    if(prImp>95){
      cls='per';
      t.push('<b>A proposta declara um desempenho global implícito de '+fmt(prImp,1)+' por cento.</b> Esse número não é uma opinião: ele é o que sobra quando se divide a geração declarada pela energia que a irradiação informada entrega à potência instalada. Nenhum sistema fotovoltaico em operação de campo entrega desempenho global nessa ordem, e por isso a faixa está acima do teto do valor de referência que esta conferência admite como entrada. Um sistema fotovoltaico real perde energia em toda a cadeia — temperatura de operação da célula acima da condição de ensaio, sujidade acumulada entre limpezas, descasamento elétrico entre módulos da mesma série, queda ôhmica nos condutores, rendimento de conversão do inversor, indisponibilidade por manutenção e por desligamento da rede. A soma dessas perdas não desaparece por escolha comercial.');
      t.push('<b>O que costuma causar.</b> Três origens, em ordem de frequência. A primeira é usar a irradiação no plano horizontal quando a estimativa deveria usar a irradiação no plano dos módulos, ou o contrário, sem declarar qual foi usada. A segunda é adotar desempenho global de catálogo de fabricante, medido em condição de laboratório, como se fosse desempenho de campo. A terceira é simplesmente arbitrar a geração a partir do resultado financeiro desejado e apresentar o número como se tivesse saído de um modelo.');
      t.push('<b>O que o comprador confirma sozinho.</b> Pergunte qual irradiação foi usada, em que plano, e de qual base de dados. Consulte o mesmo município no Atlas Brasileiro de Energia Solar ou na ferramenta de consulta do centro de referência para energia solar e eólica, e compare. Depois peça, por escrito, o valor de desempenho global adotado. Uma proposta que não sabe informar esses dois números não fez estimativa: fez arredondamento.');
      t.push('<b>O que ainda exige análise especializada.</b> A conferência de ordem de grandeza feita aqui não substitui simulação com sombreamento do terreno, orientação e inclinação reais da cobertura, e curva de temperatura local. Se o desvio for material, o passo seguinte é exigir o relatório de simulação com as premissas visíveis, não recalcular por conta própria.');
    } else if(dev>30){
      cls='per';
      t.push('<b>Desvio de '+fmt(dev,1)+' por cento acima da referência reconstruída.</b> Nesta faixa não se trata mais de divergência de premissa: a geração declarada e a geração que a irradiação informada sustenta para essa potência instalada são grandezas diferentes. Toda a planilha de resultado da proposta foi construída sobre o número maior, o que significa que nenhuma linha financeira dela é aproveitável enquanto a geração não for reconciliada.');
      t.push('<b>O que costuma causar.</b> Confusão entre potência de pico dos módulos em corrente contínua e potência instalada em corrente alternada é a causa mais comum e a mais fácil de verificar. Também aparece a soma de geração de mais de um arranjo quando só um foi orçado, e o uso de irradiação de outro município — em geral um município mais ensolarado da mesma região, o que torna o erro invisível para quem não consultou a base.');
      t.push('<b>O que o comprador confirma sozinho.</b> Some a potência dos módulos listados na proposta e compare com a potência declarada. Consulte a irradiação do município exato da instalação, não do município da sede da empresa nem da capital do estado. Esses dois cruzamentos, feitos em cinco minutos, resolvem a maior parte dos casos desta faixa.');
      t.push('<b>O que ainda exige análise especializada.</b> Se a proposta insistir no número após a reconciliação, o desempate é o relatório de simulação assinado por profissional habilitado, com as premissas de perda explicitadas item a item. Sem esse documento não há como concluir, e o resultado correto da avaliação é a solicitação dele.');
    } else if(dev>15){
      cls='per';
      t.push('<b>Desvio de '+fmt(dev,1)+' por cento acima da referência.</b> Esta é a faixa de desvio material: grande o suficiente para mudar toda a conversa de resultado, pequeno o suficiente para passar despercebido em leitura rápida. É exatamente por caber dentro da margem em que uma estimativa otimista ainda parece razoável que este é o sinal de alerta mais frequente de todos.');
      t.push('<b>O que costuma causar.</b> Empilhamento de premissas favoráveis, cada uma defensável isoladamente: irradiação do melhor mês tratada como média anual, desempenho global no teto da faixa técnica, ausência de perda por sujidade, disponibilidade de cem por cento. Nenhuma dessas escolhas é mentira, e a soma delas produz um número que o sistema não entrega.');
      t.push('<b>O que o comprador confirma sozinho.</b> Peça a decomposição da estimativa: irradiação adotada, plano de referência, desempenho global e a lista de perdas consideradas. Se a proposta apresentar geração anual sem essa decomposição, o pedido dela já é a verificação — e a recusa em fornecê-la é, ela própria, um achado.');
      t.push('<b>O que ainda exige análise especializada.</b> Distinguir entre desvio de premissa e desvio de projeto exige o levantamento da cobertura ou do terreno. Um sistema bem projetado com premissa otimista e um sistema mal orientado com premissa correta produzem desvios parecidos na conferência de ordem de grandeza e problemas completamente diferentes na operação.');
    } else if(dev>6){
      cls='att';
      t.push('<b>Desvio de '+fmt(dev,1)+' por cento acima da referência.</b> Faixa de atenção, não de rejeição. Um sistema pode legitimamente superar a referência reconstruída aqui: orientação e inclinação otimizadas, módulos bifaciais sobre superfície refletiva, limpeza programada com frequência alta, ou simplesmente um desempenho global melhor que o adotado nesta conferência. O que a faixa exige é que a proposta declare qual dessas condições está assumindo.');
      t.push('<b>O que costuma causar.</b> Na maior parte dos casos, um desempenho global adotado alguns pontos acima do usado aqui como referência de conferência — o que é legítimo se estiver declarado e justificado. Em minoria dos casos, o início de empilhamento de premissas favoráveis que ainda não chegou à faixa material.');
      t.push('<b>O que o comprador confirma sozinho.</b> Ajuste o desempenho global desta conferência para o valor que a proposta declara e observe se o desvio fecha. Se fechar, o desvio era de premissa declarada e a proposta é consistente consigo mesma. Se não fechar, a diferença está na irradiação ou na potência, e essas duas são verificáveis contra fonte externa.');
      t.push('<b>O que ainda exige análise especializada.</b> A confirmação de ganho por bifacialidade, por rastreamento ou por orientação privilegiada depende de medição no local e de projeto executivo. Nada disso invalida a proposta nesta faixa; apenas transfere o ônus de declarar a condição para quem a está assumindo.');
    } else if(dev>=-12){
      cls='ok';
      t.push('<b>Desvio de '+(dev>=0?'+':'')+fmt(dev,1)+' por cento.</b> A geração declarada é compatível com a irradiação informada para a potência instalada proposta. Este é o resultado que a maior parte das propostas bem feitas produz, e reconhecê-lo com naturalidade é parte do critério de domínio: a conferência serve tanto para apontar problema quanto para liberar o Eixo 1 e permitir que a avaliação avance.');
      t.push('<b>O que isso libera e o que não libera.</b> Libera a discussão de premissa financeira, que só é julgável depois que a premissa técnica que a sustenta foi confirmada. Não libera nada sobre degradação, sobre certificação do equipamento nem sobre o texto do contrato, que são verificações independentes desta.');
      t.push('<b>O que o comprador ainda confirma sozinho.</b> Que a irradiação usada nesta conferência é a do município da instalação, e que a potência informada é a potência instalada em corrente alternada, que é a grandeza que decide a classificação de porte no Eixo 2. Compatibilidade calculada sobre a potência errada não é compatibilidade.');
      t.push('<b>Redação recomendada do achado.</b> A estimativa de geração é compatível com a irradiação da localidade, verificada em base de dados nacional pública, para a potência declarada. Premissa do Eixo 1 confirmada na ordem de grandeza; segue para verificação de degradação.');
    } else {
      cls='att';
      t.push('<b>Desvio de '+fmt(dev,1)+' por cento abaixo da referência.</b> Declarar menos do que a irradiação sustenta não é problema comercial para o comprador, mas é sinal de que alguma coisa não foi dita. Uma estimativa conservadora deliberada é uma boa prática; uma estimativa deprimida por restrição física do local é uma informação que muda o dimensionamento e o preço justo do sistema.');
      t.push('<b>O que costuma causar.</b> Sombreamento parcial conhecido pelo projetista e não declarado na proposta, orientação da cobertura distante do ideal, limitação de potência do inversor em relação à potência dos módulos, ou restrição de injeção acordada com a distribuidora. Também pode ser simples conservadorismo de quem prefere entregar acima do prometido.');
      t.push('<b>O que o comprador confirma sozinho.</b> Pergunte diretamente se há sombreamento, qual é a orientação e a inclinação previstas, e qual é a relação entre a potência dos módulos e a potência do inversor. Se a resposta for conservadorismo deliberado, peça que conste por escrito — porque a estimativa declarada é a base de qualquer garantia de performance que venha a ser negociada.');
      t.push('<b>O que ainda exige análise especializada.</b> Quantificar perda por sombreamento exige levantamento no local com medição de horizonte. Nesta faixa, o achado correto não é um veredito sobre a proposta: é a pergunta que ainda não foi respondida.');
    }
    var vd=$id('gv-vd'); vd.className='verdict '+cls;
    vd.innerHTML=t.map(function(x){return '<p>'+x+'</p>';}).join('');
  }
  pair('gv-pot','gv-potr',calc); pair('gv-ger','gv-gerr',calc);
  pair('gv-irr','gv-irrr',calc); pair('gv-pr','gv-prr',calc);
  calc();

}

// ── INST 07 · VERIFICADOR DE DEGRADAÇÃO (L3538–L3603, literal) ──
function corpo07($id, $all, segVal, segBind, chips, pair, __ganchos) {
  if(!$id('dg-prop'))return;
  function serie(y1,d,hz){
    var acc=0,fin=1;
    for(var k=1;k<=hz;k++){
      var p=(1-y1/100)*Math.pow(1-d/100,k-1);
      acc+=p; if(k===hz)fin=p;
    }
    return {acc:acc,fin:fin};
  }
  function calc(){
    var prop=numOf($id('dg-prop'),0.4,0,2);
    var ds  =numOf($id('dg-ds'),0.55,0,2);
    var y1  =numOf($id('dg-y1'),2,0,5);
    var hz  =Math.round(numOf($id('dg-hz'),25,5,30));
    var A=serie(y1,prop,hz), B=serie(y1,ds,hz);
    var gap=A.acc>0?((A.acc-B.acc)/A.acc*100):0;
    var delta=ds-prop;

    $id('dg-p1').textContent=fmt(A.fin*100,1)+'%';
    $id('dg-p2').textContent=fmt(B.fin*100,1)+'%';
    $id('dg-gap').textContent=(gap>=0?'':'')+fmt(gap,1)+'%';

    var cls,t=[];
    if(prop===0){
      cls='per';
      t.push('<b>A projeção não aplica degradação nenhuma.</b> Isso não é uma premissa otimista: é a ausência de uma premissa obrigatória. Módulo fotovoltaico perde desempenho ao longo da vida por processos físicos conhecidos e o próprio termo de garantia do fabricante reconhece essa perda — é justamente por isso que a garantia de performance é escrita como uma curva decrescente, e não como um valor único. Uma planilha sem degradação projeta, no ano vinte e cinco, a mesma energia do primeiro ano.');
      t.push('<b>O que costuma causar.</b> Planilha construída a partir de uma geração anual única, replicada por linha, sem coluna de ano. É o formato mais comum de proposta comercial e o mais difícil de auditar, porque a ausência da coluna esconde a ausência da premissa. Em propostas de porte maior, aparece também como degradação aplicada só sobre a geração e não sobre o resultado, o que produz o mesmo efeito.');
      t.push('<b>O que o comprador confirma sozinho.</b> Abra o termo de garantia do módulo especificado e leia a taxa máxima de perda anual garantida e a perda do primeiro ano. Esses dois números estão sempre no documento, e informá-los neste instrumento já mostra a distância entre o que a proposta projetou e o que o fabricante se obriga a entregar.');
      t.push('<b>O que ainda exige análise especializada.</b> Nada, neste caso. A ausência de degradação é verificável por leitura, não por cálculo, e o achado correto é objetivo: a projeção precisa ser refeita com a curva do termo de garantia do modelo efetivamente especificado.');
    } else if(y1===0){
      cls='att';
      t.push('<b>A projeção ignora a perda do primeiro ano.</b> A taxa anual está declarada, mas a queda inicial não. Termos de garantia de performance separam essas duas grandezas justamente porque elas têm origens físicas diferentes: a perda inicial é rápida e ocorre nos primeiros meses de exposição, a degradação anual é lenta e acumulativa. Tratar só a segunda subestima a perda ao longo de todo o horizonte, porque toda a curva parte de um patamar mais alto do que o real.');
      t.push('<b>O que costuma causar.</b> Uso da taxa anual do datasheet sem ler o parágrafo anterior, que declara a garantia do primeiro ano em separado. É um erro de leitura, não de intenção, e aparece tanto em proposta agressiva quanto em proposta honesta.');
      t.push('<b>O que o comprador confirma sozinho.</b> No termo de garantia, procure o percentual garantido ao fim do primeiro ano. A diferença entre cem por cento e esse percentual é a perda inicial. Informe esse valor aqui e observe o deslocamento de toda a curva.');
      t.push('<b>O que ainda exige análise especializada.</b> Nenhuma, para a correção da premissa. A verificação de que o módulo entregue corresponde ao modelo cujo termo de garantia foi lido é outra verificação, e pertence ao eixo de certificação.');
    } else if(delta<=0){
      cls='ok';
      t.push('<b>A proposta assume degradação igual ou maior que a garantida pelo fabricante.</b> Divergência de '+fmt(Math.abs(delta),2)+' ponto percentual ao ano na direção conservadora. Este é o resultado que uma proposta bem construída produz, e dizê-lo é parte do trabalho: a projeção não está apoiada em desempenho que o fabricante não se obriga a entregar.');
      t.push('<b>O que isso significa na prática.</b> A produção no fim do horizonte declarado fica em '+fmt(A.fin*100,1)+' por cento da produção inicial pela premissa da proposta, contra '+fmt(B.fin*100,1)+' por cento pelo piso garantido. A proposta está abaixo do piso, o que dá margem em vez de consumir margem.');
      t.push('<b>O que o comprador ainda confirma sozinho.</b> Que o termo de garantia lido é o do modelo efetivamente listado na proposta, e não o de um modelo equivalente do mesmo fabricante. Substituição de modelo entre a proposta e a entrega é um evento comum e é matéria de cláusula contratual, não de planilha.');
      t.push('<b>Redação recomendada do achado.</b> A premissa de degradação é conservadora em relação ao termo de garantia de performance do módulo especificado. Eixo 3 ancorado neste item; verificar se a mesma disciplina se repete na trajetória tarifária e no custo de operação e manutenção.');
    } else if(delta<=0.1){
      cls='ok';
      t.push('<b>Premissa alinhada ao termo de garantia.</b> Divergência de '+fmt(delta,2)+' ponto percentual ao ano, dentro do que se explica por arredondamento ou por uso de valor típico em vez do valor garantido do modelo. A projeção não depende de desempenho melhor do que o fabricante assegura em grau relevante.');
      t.push('<b>O que isso significa na prática.</b> A energia acumulada no horizonte pela premissa da proposta excede em '+fmt(gap,1)+' por cento a energia acumulada pelo piso garantido. Uma diferença nessa ordem não muda a natureza da decisão; ela apenas indica que a proposta usou o valor esperado e não o valor garantido, que é uma escolha metodológica defensável desde que declarada.');
      t.push('<b>O que o comprador confirma sozinho.</b> Pergunte se a taxa usada é a esperada ou a garantida. As duas respostas são aceitáveis; o que não é aceitável é a proposta não saber qual das duas está na planilha.');
      t.push('<b>O que ainda exige análise especializada.</b> Nada aqui. A distinção entre taxa esperada e taxa garantida é documental, e o documento é público — acompanha o módulo e costuma estar disponível no sítio do fabricante.');
    } else if(delta<=0.3){
      cls='att';
      t.push('<b>Divergência de '+fmt(delta,2)+' ponto percentual ao ano entre a planilha e o piso garantido.</b> Faixa de atenção. A proposta está projetando desempenho melhor do que o fabricante se obriga a entregar, e a diferença, composta ao longo de '+hz+' anos, acumula '+fmt(gap,1)+' por cento de energia que a garantia não assegura.');
      t.push('<b>O que costuma causar.</b> Adoção de taxa média de mercado em vez da taxa do modelo especificado. Como a taxa média circula em material técnico e a taxa do modelo está num documento anexo, a substituição é silenciosa e quase nunca é intencional.');
      t.push('<b>O que o comprador confirma sozinho.</b> Substitua a taxa da planilha pela taxa do termo de garantia neste instrumento e observe o deslocamento. Se a decisão mudar de natureza com essa substituição, a premissa não era detalhe. Se não mudar, o achado é registrado e a avaliação segue.');
      t.push('<b>O que ainda exige análise especializada.</b> Estimar degradação real de um modelo específico em condição de campo brasileira exige série de medição, que não existe para equipamento novo. Por isso o piso garantido é a referência correta: não é o valor mais provável, é o único valor que alguém se obrigou a entregar.');
    } else {
      cls='per';
      t.push('<b>Divergência de '+fmt(delta,2)+' ponto percentual ao ano.</b> Nesta faixa a projeção deixa de ser otimista e passa a ser incompatível com o documento que a sustenta. A planilha conta com '+fmt(gap,1)+' por cento a mais de energia acumulada no horizonte do que o termo de garantia do próprio módulo especificado assegura — e o termo de garantia é o único documento com efeito jurídico entre os dois.');
      t.push('<b>O que costuma causar.</b> Taxa escolhida a partir do resultado desejado, ou taxa copiada de material de um modelo de linha superior ao efetivamente orçado. A segunda hipótese é verificável imediatamente: basta conferir se o modelo do datasheet anexo é o mesmo da lista de materiais.');
      t.push('<b>O que o comprador confirma sozinho.</b> Confira o código exato do modelo na lista de materiais contra o código no termo de garantia anexo. Depois peça a planilha refeita com a taxa garantida. Uma proposta que se recusa a refazer a projeção com o piso do próprio fabricante está declarando que o resultado não sobrevive a ele.');
      t.push('<b>O que ainda exige análise especializada.</b> Se a proposta oferecer garantia de performance própria, superior à do fabricante, a análise passa a ser de solidez do garantidor e de execução da garantia — matéria do Eixo 4, não do Eixo 3, e que exige leitura do contrato e não da planilha.');
    }
    var vd=$id('dg-vd'); vd.className='verdict '+cls;
    vd.innerHTML=t.map(function(x){return '<p>'+x+'</p>';}).join('');
  }
  pair('dg-prop','dg-propr',calc); pair('dg-ds','dg-dsr',calc);
  pair('dg-y1','dg-y1r',calc); pair('dg-hz','dg-hzr',calc);
  calc();

}

// ── INST 08 · VERIFICADOR DE TRAJETÓRIA TARIFÁRIA (L3608–L3662, literal) ──
function corpo08($id, $all, segVal, segBind, chips, pair, __ganchos) {
  if(!$id('tt-prop'))return;
  function calc(){
    var p=numOf($id('tt-prop'),9,0,20);
    var h=numOf($id('tt-hist'),6,0,20);
    var hz=Math.round(numOf($id('tt-hz'),20,5,30));
    var anc=segVal('tt-anc','data-t')||'fonte';
    var ip=Math.pow(1+p/100,hz), ih=Math.pow(1+h/100,hz);
    var gap=p-h;
    var exc=(ip/ih-1)*100;

    $id('tt-gap').textContent=(gap>=0?'+':'')+fmt(gap,2)+' p.p.';
    $id('tt-i1').textContent=fmt(ip*100,0);
    $id('tt-exc').textContent=(exc>=0?'+':'')+fmt(exc,1)+'%';

    var cls,t=[];
    if(gap>1.5){
      cls='per';
      t.push('<b>A premissa da proposta supera a ancoragem histórica em '+fmt(gap,2)+' ponto percentual ao ano.</b> Composta por '+hz+' anos, essa diferença faz o índice final da premissa ficar '+fmt(exc,1)+' por cento acima do índice que a própria série histórica da concessionária produziria. Não é uma diferença de opinião sobre o futuro: é uma diferença que carrega sozinha uma parte relevante do resultado apresentado.');
      t.push('<b>Por que isso é premissa e não fato.</b> Reajuste tarifário anual é ato homologatório da agência reguladora, calculado por área de concessão a partir de itens que não se repetem: variação de custos não gerenciáveis, componentes financeiros de períodos anteriores, quotas de encargos e o resultado do processo tarifário da distribuidora específica. Nenhuma dessas parcelas tem trajetória garantida, e a série passada é a única ancoragem disponível — não porque preveja o futuro, mas porque é a única coisa auditável.');
      t.push('<b>O que o comprador confirma sozinho.</b> Os atos homologatórios de reajuste anual da distribuidora que atende a unidade são públicos e estão no sítio da agência reguladora. Levantar a série dos últimos dez anos leva poucos minutos e produz o número que este instrumento pede como ancoragem. Feito isso, a pergunta ao vendedor é direta e específica: de onde veio a taxa da planilha.');
      t.push('<b>O que ainda exige análise especializada.</b> Projetar trajetória tarifária com fundamento exige modelar revisão tarifária periódica, base de remuneração regulatória e a evolução dos encargos — e nem isso produz garantia. Por isso a saída deste instrumento é índice adimensional e afastamento, e nunca valor monetário: o objetivo é medir a distância entre a premissa e a ancoragem, não substituir uma previsão por outra.');
    } else if(gap>0.5){
      cls='att';
      t.push('<b>Afastamento de '+fmt(gap,2)+' ponto percentual ao ano acima da ancoragem.</b> Faixa de atenção. O índice final da premissa fica '+fmt(exc,1)+' por cento acima do índice histórico ao longo de '+hz+' anos. Um afastamento nesta ordem pode ser defendido — pressão de encargos, ciclo de investimento da distribuidora, expectativa de inflação acima da média da série — mas precisa ser defendido explicitamente, e não embutido.');
      t.push('<b>Por que a faixa importa.</b> Diferença pequena ao ano vira diferença grande no horizonte porque a composição é multiplicativa. É a mesma aritmética da degradação, e produz o mesmo tipo de ilusão: a premissa parece razoável quando lida isolada e domina o resultado quando lida composta.');
      t.push('<b>O que o comprador confirma sozinho.</b> Levante a média dos reajustes homologados da concessionária nos últimos dez anos e informe aqui. Se o afastamento se fechar com a série real, a premissa era ancorada e o achado se resolve. Se persistir, o que resta é pedir a justificativa por escrito.');
      t.push('<b>O que ainda exige análise especializada.</b> Separar, dentro da série histórica, o que foi reajuste ordinário do que foi revisão tarifária periódica ou componente financeiro extraordinário. Essa decomposição muda a média e é a diferença entre uma ancoragem bem feita e uma ancoragem ingênua.');
    } else if(gap>=-0.5){
      cls='ok';
      t.push('<b>Premissa alinhada à ancoragem histórica.</b> Afastamento de '+fmt(Math.abs(gap),2)+' ponto percentual ao ano, dentro do que a própria dispersão da série explica. O índice final da premissa fica '+fmt(exc,1)+' por cento em relação ao índice histórico ao longo de '+hz+' anos — uma diferença que não carrega o resultado.');
      t.push('<b>O que isso libera.</b> Este é o item do Eixo 3 mais fácil de inflar e o menos verificável por quem não conhece o processo tarifário, o que o torna o teste mais informativo sobre a disciplina metodológica de quem escreveu a proposta. Uma trajetória ancorada é indício de que as demais premissas financeiras também foram construídas, e não escolhidas.');
      t.push('<b>O que o comprador ainda confirma sozinho.</b> Que a ancoragem informada é da distribuidora que efetivamente atende a unidade, e não uma média nacional. Trajetória tarifária varia por área de concessão pela mesma razão que a tarifa varia: o processo tarifário é individual.');
      t.push('<b>Redação recomendada do achado.</b> A trajetória tarifária assumida é compatível com a série homologada da concessionária que atende a unidade, no horizonte declarado. Premissa do Eixo 3 ancorada neste item.');
    } else {
      cls='ok';
      t.push('<b>A premissa está abaixo da ancoragem histórica em '+fmt(Math.abs(gap),2)+' ponto percentual ao ano.</b> A proposta projeta trajetória mais lenta do que a série da concessionária sugere, o que é a direção conservadora e reduz, e não aumenta, o resultado apresentado.');
      t.push('<b>O que observar mesmo assim.</b> Premissa conservadora num item e agressiva em outro produz um documento que parece equilibrado no agregado e é frágil em cada parte. Se a trajetória está conservadora, vale conferir se a geração e a degradação também estão — o padrão relevante é a consistência de método, não a soma dos otimismos.');
      t.push('<b>O que o comprador confirma sozinho.</b> Se a proposta declara conservadorismo deliberado, peça que a premissa e sua justificativa constem por escrito. Premissa favorável ao comprador também é premissa, e também precisa de rastro.');
      t.push('<b>O que ainda exige análise especializada.</b> Nada de imediato neste item. A verificação relevante passa a ser de consistência entre os três verificadores, e é essa leitura cruzada que o roteador de veredito organiza.');
    }
    if(anc==='soi'){
      t.push('<b>Sobre a declaração da premissa.</b> A proposta declara a taxa mas não a origem. Isso mantém o número auditável quanto ao efeito e inauditável quanto à fundamentação: dá para medir o que ele produz, não dá para saber se ele foi construído. A pergunta ao vendedor é única e específica — de qual série, de qual concessionária, em qual período.');
      if(cls==='ok')cls='att';
    } else if(anc==='nada'){
      t.push('<b>Sobre a declaração da premissa.</b> A taxa não está declarada: ela está embutida no resultado. Uma premissa embutida não é uma premissa conservadora nem agressiva — é uma premissa que não pode ser discutida, e essa é a característica que importa. Enquanto ela não for explicitada, o Eixo 3 permanece não verificado, qualquer que seja o valor que este instrumento devolva.');
      cls='per';
    } else {
      t.push('<b>Sobre a declaração da premissa.</b> A proposta declara a taxa e a fonte da ancoragem. Isso é a condição mínima para que o item seja verificável, e é o que permite que a conversa mude de "esse número está certo?" para "essa fonte é a certa?" — que é uma pergunta com resposta.');
    }
    var vd=$id('tt-vd'); vd.className='verdict '+cls;
    vd.innerHTML=t.map(function(x){return '<p>'+x+'</p>';}).join('');
  }
  pair('tt-prop','tt-propr',calc); pair('tt-hist','tt-histr',calc);
  pair('tt-hz','tt-hzr',calc); segBind('tt-anc',calc);
  calc();

}

// ── INST 09 · ANATOMIA DOS OITO SINAIS (L3667–L3721, literal) ──
function corpo09($id, $all, segVal, segBind, chips, pair, __ganchos) {
  var grid=$id('sa-grid'), out=$id('sa-out');
  if(!grid||!out)return;
  var S={
    ger:{n:'1 · Geração estimada exagerada',
      c:'A geração anual declarada excede o que a irradiação do município sustenta para a potência instalada proposta, ou o desempenho global implícito na conta ultrapassa o que um sistema real entrega em campo. É o sinal com maior efeito sobre o resultado, porque toda a projeção financeira é construída sobre esse número.',
      f:'Atlas Brasileiro de Energia Solar, segunda edição, do instituto nacional de pesquisas espaciais, ou a ferramenta de consulta por localidade do centro de referência para energia solar e eólica. Ambas são públicas e permitem consulta por município.',
      s:'Consultar a irradiação do município exato da instalação e reconstruir a ordem de grandeza da geração pela potência declarada. Somar a potência dos módulos listados e conferir contra a potência informada. Os dois cruzamentos levam poucos minutos e não exigem formação técnica.',
      p:'Qual irradiação foi usada, em que plano, de qual base de dados e com que desempenho global? Peço a decomposição da estimativa e o relatório de simulação com as premissas de perda visíveis.'},
    fin:{n:'2 · Resultado financeiro sem premissa declarada',
      c:'A proposta apresenta a conclusão financeira sem expor as premissas que a produzem: trajetória tarifária assumida, degradação, custo de operação e manutenção, e o tratamento dado ao período em que a regra tarifária ainda não está definida. Sem essas quatro, o número é uma saída sem entradas visíveis.',
      f:'A própria proposta, na seção de premissas — e a ausência dessa seção é o achado. Para a ancoragem tarifária, os atos homologatórios de reajuste anual da distribuidora, publicados pela agência reguladora.',
      s:'Procurar, no documento, a lista de premissas. Se existir, conferir cada uma contra a fonte correspondente. Se não existir, o achado está completo sem nenhuma conta: a conclusão não é auditável.',
      p:'Quais premissas produzem esse resultado, e qual é a fonte de cada uma? Peço a planilha com as premissas em células visíveis e editáveis, não o resultado consolidado.'},
    deg:{n:'3 · Degradação ignorada ou subestimada',
      c:'A projeção não aplica perda anual de desempenho, ignora a perda do primeiro ano, ou usa taxa menor que a máxima garantida no termo de garantia de performance do módulo efetivamente especificado. O efeito é pequeno em cada ano e material no acumulado do horizonte.',
      f:'Termo de garantia de performance e ficha técnica do modelo listado na proposta, fornecidos pelo fabricante e normalmente disponíveis publicamente.',
      s:'Ler no termo de garantia dois números: o percentual garantido ao fim do primeiro ano e a perda máxima anual subsequente. Conferir se o código do modelo no termo é o mesmo da lista de materiais.',
      p:'Qual taxa de degradação está na planilha, e ela é a esperada ou a garantida? Peço a projeção refeita com a curva do termo de garantia do modelo especificado.'},
    tar:{n:'4 · Trajetória tarifária irrealista',
      c:'A taxa de crescimento tarifário assumida se afasta materialmente da série homologada da concessionária que atende a unidade, ou não está declarada e vem embutida no resultado. Composta ao longo do horizonte, uma diferença anual pequena domina a projeção.',
      f:'Atos homologatórios de reajuste tarifário anual da distribuidora específica, publicados pela agência reguladora, com a série dos últimos anos.',
      s:'Levantar a série de reajustes homologados da concessionária e comparar com a taxa da planilha. A série é pública e a comparação é aritmética simples.',
      p:'Qual taxa de reajuste está assumida, de qual série ela vem, de qual concessionária e em qual período? A série inclui revisão tarifária periódica ou só reajuste ordinário?'},
    cert:{n:'5 · Equipamento sem certificação adequada',
      c:'Módulo, inversor, controlador de carga ou bateria sem registro válido no programa de avaliação da conformidade, ou registro obtido sob regulamento anterior ao vigente. Ter selo e ter o registro vigente sob a norma correta não são a mesma verificação.',
      f:'Consulta pública ao registro de objeto no instituto nacional de metrologia, e o texto das portarias de certificação compulsória de 2022 e de 2023, que definem escopo, requisitos e prazos.',
      s:'Localizar o código do modelo na lista de materiais e consultar o registro. Conferir se o equipamento está dentro do escopo da certificação compulsória — inversores acima de setenta e cinco quilowatts, por exemplo, ficam fora dele, o que não os torna irregulares, apenas não certificados por esse regime.',
      p:'Qual é o número de registro de cada equipamento e sob qual portaria ele foi obtido? Se algum item está fora do escopo da certificação compulsória, qual documento atesta a conformidade dele?'},
    gar:{n:'6 · Garantias mal explicadas',
      c:'A proposta menciona garantia sem distinguir garantia de produto, que cobre defeito de fabricação do equipamento, de garantia de performance, que assegura um percentual de produção ao longo do tempo, de garantia de instalação, que responde pelo serviço. Quem responde por cada uma, e por quanto tempo, quase nunca está no mesmo parágrafo.',
      f:'Termo de garantia do fabricante e o contrato de prestação de serviços com o integrador, incluídos os anexos. Os dois documentos, não apenas a página de resumo da proposta.',
      s:'Verificar, para cada tipo de garantia, três campos: prazo, quem é o garantidor e qual é o procedimento de acionamento. Se um dos três estiver ausente para qualquer das garantias, o achado está caracterizado.',
      p:'Quem responde pela garantia de performance, o fabricante ou o integrador? Qual é o procedimento se o equipamento falhar e o integrador não existir mais? Peço os termos completos em anexo.'},
    oem:{n:'7 · Operação e manutenção ausente do orçamento',
      c:'O orçamento não inclui limpeza periódica, monitoramento, inspeção elétrica nem substituição do inversor ao longo do horizonte, mas a projeção de resultado assume produção compatível com um sistema mantido. Custo omitido do orçamento e desempenho suposto na planilha são incompatíveis.',
      f:'A própria proposta e o contrato de serviços. Para a vida útil esperada do inversor, a ficha técnica e o termo de garantia do modelo especificado.',
      s:'Procurar a linha de operação e manutenção no orçamento e a linha correspondente na projeção. Verificar se há evento de substituição de inversor dentro do horizonte declarado e se ele está orçado.',
      p:'Operação e manutenção estão no escopo e no orçamento? Qual é a periodicidade e o que ela inclui? A substituição do inversor está prevista dentro do horizonte da projeção, e por conta de quem?'},
    reg:{n:'8 · Risco regulatório omitido',
      c:'A proposta trata o enquadramento e o percentual do componente de rede como constantes, não declara a data de protocolo que determina o regime aplicável, e projeta o período posterior ao fim da transição como se a regra já existisse. É o sinal mais difícil de ver, porque exige saber que a regra futura ainda está em elaboração.',
      f:'Lei do marco legal de 2022, artigos 26 e 27; resolução normativa da agência de 2023, que criou a classificação de regime e os artigos de faturamento; e o estado do projeto regulatório que definirá a regra posterior à transição.',
      s:'Verificar se a proposta declara a data de protocolo da solicitação de acesso e o regime resultante. Verificar se a projeção usa percentual variável por ano ou percentual fixo. Percentual fixo ao longo de todo o horizonte é, por si só, o achado.',
      p:'Qual é a data prevista de protocolo e qual regime ela produz? A projeção aplica o percentual de cada ano do cronograma legal? Que hipótese foi adotada para o período posterior ao fim da transição, e ela está declarada como hipótese?'}
  };
  var ordem=['ger','fin','deg','tar','cert','gar','oem','reg'];
  function render(k){
    var s=S[k];
    out.innerHTML='<div class="yr">'+esc(s.n)+'</div>'+
      '<p><b>O que caracteriza o sinal.</b> '+s.c+'</p>'+
      '<p><b>Fonte independente que confirma.</b> '+s.f+'</p>'+
      '<p><b>O que o comprador verifica sozinho, sem ajuda técnica.</b> '+s.s+'</p>'+
      '<p><b>Pergunta a levar ao vendedor.</b> '+s.p+'</p>';
  }
  chips('sa-grid',ordem.map(function(k){return {k:k,n:S[k].n};}),'s',render);
  render('ger');

}

// ── INST 10 · ROTEADOR DE VEREDITO (L3726–L3768, literal) ──
function corpo10($id, $all, segVal, segBind, chips, pair, __ganchos) {
  if(!$id('rv-e1'))return;
  var E1={ok:'O Eixo 1 confere: a geração declarada é compatível com a irradiação da localidade e a degradação assumida não é melhor que a garantida.',
          desvio:'O Eixo 1 apresenta desvio material entre a premissa declarada e a referência independente, o que compromete toda a projeção construída sobre ela.',
          falta:'O Eixo 1 não pôde ser verificado: falta a ficha técnica do módulo ou do inversor, ou falta a decomposição da estimativa de geração.'};
  var E2={ok:'O Eixo 2 confere: porte, modalidade e regime declarados correspondem ao arranjo descrito e à norma vigente.',
          erro:'O Eixo 2 está incompatível: a modalidade declarada não comporta o arranjo de titularidade descrito, ou o regime informado não decorre da data de protocolo.',
          falta:'O Eixo 2 não pôde ser verificado: a proposta não declara a data de protocolo da solicitação de acesso ou não descreve a titularidade das unidades beneficiárias.'};
  var E3={ok:'O Eixo 3 está ancorado: as premissas financeiras estão declaradas e referenciadas a série verificável.',
          solta:'O Eixo 3 está declarado sem ancoragem: as premissas aparecem, mas nenhuma indica de onde veio.',
          omissa:'O Eixo 3 está embutido: as premissas não aparecem no documento e só existem dentro do resultado.'};
  var E4={ok:'O Eixo 4 está completo: o contrato e os anexos respondem quem garante o quê, por quanto tempo, com qual procedimento, sob qual hipótese de rescisão e o que ocorre se a conexão atrasar.',
          lacuna:'O Eixo 4 está documentado mas incompleto: o contrato existe e deixa ao menos uma das perguntas de responsabilidade sem resposta.',
          ausente:'O Eixo 4 não foi avaliado: o contrato ou os anexos não foram fornecidos.'};
  function calc(){
    var a=segVal('rv-e1','data-v')||'ok', b=segVal('rv-e2','data-v')||'ok';
    var c=segVal('rv-e3','data-v')||'ok', d=segVal('rv-e4','data-v')||'ok';
    var insuf=(a==='falta')||(b==='falta')||(d==='ausente');
    var prob=(a==='desvio')||(b==='erro')||(c==='solta')||(c==='omissa')||(d==='lacuna');
    var cls,cab,red,passo;
    if(insuf){
      cls='att';
      cab='Não é possível concluir sem os documentos que faltam';
      red='A avaliação foi executada até onde a documentação disponível permite. Um ou mais eixos permanecem não verificados por insuficiência documental, e essa insuficiência tem precedência sobre qualquer conclusão sobre os demais: não se emite parecer sobre o que não se leu. O que segue é a lista do que falta para concluir, não um veredito sobre a proposta.';
      passo='Solicitar por escrito os documentos faltantes e reexecutar a avaliação. Registrar a data do pedido: a demora em fornecer ficha técnica, contrato ou anexos é, ela própria, informação sobre a contraparte — e não é informação sobre a qualidade técnica da proposta, que continua indeterminada.';
    } else if(prob){
      cls='per';
      cab='Problema identificado, com documentação suficiente para caracterizá-lo';
      red='A documentação foi suficiente para executar as duas trilhas, e a avaliação identificou ao menos um achado material. O achado está caracterizado contra fonte independente e é comunicável ao fornecedor em termos específicos, não como impressão geral.';
      passo='Levar cada achado ao fornecedor na forma de pergunta específica, com a fonte que o sustenta, e pedir a proposta revista. Um achado caracterizado contra fonte é negociável; uma desconfiança genérica não é. Aqui há oportunidades potenciais de economia a serem validadas com dados completos, e nenhuma delas se converte em valor antes da revisão.';
    } else {
      cls='ok';
      cab='Proposta sólida nas duas trilhas';
      red='As duas trilhas foram executadas com a documentação completa e nenhum achado material foi identificado. As premissas técnicas conferem com fonte independente, o enquadramento regulatório corresponde ao arranjo descrito, as premissas financeiras estão declaradas e ancoradas, e o contrato responde às perguntas de responsabilidade. Este parecer tem exatamente o mesmo peso do parecer contrário e deve ser emitido com a mesma naturalidade.';
      passo='Comunicar que a proposta é sólida e registrar o que foi verificado e contra qual fonte. Um parecer favorável sem rastro de verificação vale tão pouco quanto um parecer desfavorável sem ele. Permanecem em aberto os itens que nenhuma avaliação documental resolve: levantamento do local e projeto executivo.';
    }
    var vd=$id('rv-vd'); vd.className='verdict '+cls;
    vd.innerHTML='<p><b>'+esc(cab)+'</b></p>'+
      '<p>'+E1[a]+'</p><p>'+E2[b]+'</p><p>'+E3[c]+'</p><p>'+E4[d]+'</p>'+
      '<p><b>Redação recomendada.</b> '+red+'</p>'+
      '<p><b>Próximo passo.</b> '+passo+'</p>';
  }
  segBind('rv-e1',calc); segBind('rv-e2',calc); segBind('rv-e3',calc); segBind('rv-e4',calc);
  calc();

}

// ── INST 11 · ORDEM DE AVALIAÇÃO EM TRINTA MINUTOS (L3773–L3839, literal) ──
function corpo11($id, $all, segVal, segBind, chips, pair, __ganchos) {
  var nav=$id('or-nav'), pan=$id('or-panel'), bars=$id('or-bars');
  if(!nav||!pan||!bars)return;
  var P=[
    {n:'01',tr:'Técnica',t0:0,t1:3,sinc:false,
     tit:'Identificar potência instalada em corrente alternada e classificar o porte',
     faz:'Localizar, na lista de materiais, a potência dos módulos e a potência do inversor, e identificar qual das duas a proposta chama de potência instalada. A classificação de porte usa a potência em corrente alternada, que é a do inversor. Setenta e cinco quilowatts separam microgeração de minigeração.',
     fon:'Lei do marco legal de 2022, artigo 1º, incisos que definem microgeração e minigeração; e a resolução da agência de 2021, com a redação dada pela resolução de 2023, que incorporou as mesmas definições.',
     err:'Classificar o porte pela potência de pico dos módulos. É o erro de partida mais comum e ele se propaga por todo o resto: porte errado leva a modalidade elegível errada, que leva a regime errado.'},
    {n:'02',tr:'Contratual',t0:0,t1:3,sinc:false,
     tit:'Inventariar os documentos e registrar o que não veio',
     faz:'Listar o que existe: proposta, planilha de premissas, ficha técnica do módulo, ficha técnica do inversor, termo de garantia de performance, minuta de contrato e anexos. O inventário se faz antes de qualquer leitura, porque ele determina quais trilhas podem ser concluídas.',
     fon:'A própria proposta e seus anexos. Nenhuma fonte externa é necessária neste passo.',
     err:'Começar a ler o documento mais interessante em vez de inventariar. Quem começa pela planilha descobre no minuto vinte e cinco que o contrato nunca veio, e perde a avaliação inteira.'},
    {n:'03',tr:'Técnica',t0:3,t1:8,sinc:false,
     tit:'Conferir a geração estimada contra a irradiação da localidade',
     faz:'Consultar a irradiação do município da instalação na base nacional, reconstruir a ordem de grandeza da geração pela potência declarada e comparar com a geração da proposta. Calcular o desempenho global implícito e verificar se ele cabe no que um sistema real entrega.',
     fon:'Atlas Brasileiro de Energia Solar, segunda edição, do instituto nacional de pesquisas espaciais; ou a ferramenta de consulta por localidade do centro de referência para energia solar e eólica.',
     err:'Usar irradiação da capital do estado ou da sede da empresa. Irradiância varia por município, e a diferença entre dois municípios da mesma região pode explicar sozinha o desvio que se está tentando investigar.'},
    {n:'04',tr:'Técnica',t0:8,t1:12,sinc:true,
     tit:'Confrontar a modalidade declarada com o arranjo de titularidade real',
     faz:'Verificar qual das quatro modalidades a proposta declara e se a titularidade descrita cabe nela: mesma unidade, mesmo titular em unidades distintas na mesma distribuidora, associação civil de consumidores, ou unidades em propriedade contígua. Verificar também se a unidade não migrou para o ambiente livre, hipótese em que não pode aderir ao sistema de compensação.',
     fon:'Lei do marco legal de 2022, artigo 1º para as definições, artigo 9º para quem pode aderir; resolução da agência de 2021, artigo 2º, com as inclusões das resoluções de 2023 e de 2024.',
     err:'Aceitar o nome comercial do arranjo como se fosse a modalidade regulatória. Denominação de produto não é nomenclatura de norma, e a elegibilidade se verifica contra a segunda. Este é o primeiro ponto de sincronização: sem modalidade confirmada, a trilha contratual não tem contra o que conferir o objeto do contrato.'},
    {n:'05',tr:'Técnica',t0:12,t1:17,sinc:false,
     tit:'Determinar o regime de faturamento pela data de protocolo',
     faz:'Identificar a data prevista ou realizada do protocolo da solicitação de acesso e derivar o regime aplicável, o percentual do componente de rede do ano corrente e o ano em que a regra posterior à transição passa a incidir. Verificar se a projeção da proposta aplica percentual variável por ano ou percentual fixo.',
     fon:'Lei do marco legal de 2022, artigos 26 e 27; resolução da agência de 2021, artigos de faturamento incluídos pela resolução de 2023, que estabelecem a classificação de regime.',
     err:'Tratar o percentual como constante ao longo do horizonte, e tratar o período posterior ao fim da transição como se a regra já estivesse definida. Ela não está: as diretrizes de valoração foram publicadas em 2024 e o projeto regulatório que produzirá o cálculo tem conclusão prevista para 2027.'},
    {n:'06',tr:'Contratual',t0:17,t1:22,sinc:false,
     tit:'Separar garantia de produto, de performance e de instalação',
     faz:'Para cada uma das três, registrar prazo, garantidor e procedimento de acionamento. Conferir se o termo de garantia anexo é do modelo efetivamente listado na lista de materiais, e não de um modelo equivalente.',
     fon:'Termo de garantia do fabricante e minuta de contrato de prestação de serviços com os anexos.',
     err:'Ler a página de resumo da proposta em vez dos termos. O resumo diz vinte e cinco anos de garantia; o termo diz qual garantia, de quem, sob qual condição, e é ele que vale.'},
    {n:'07',tr:'Contratual',t0:22,t1:26,sinc:false,
     tit:'Ler responsabilidade, prazos de conexão e hipóteses de rescisão',
     faz:'Verificar quem protocola a solicitação de acesso, quem responde pelo atraso da distribuidora, qual é o efeito de o prazo legal de injeção não ser cumprido, o que ocorre com o pagamento se a homologação demorar, e sob quais hipóteses cada parte pode rescindir.',
     fon:'Lei do marco legal de 2022, artigo 26 e seus parágrafos, para os prazos de início de injeção; e as vedações dos artigos 5º, 6º, 10 e 11 da mesma lei, que alcançam transferência de titularidade, comercialização de parecer de acesso, forma de remuneração de terreno e divisão de central.',
     err:'Supor que o atraso da distribuidora é risco do fornecedor por padrão. Não é: é matéria de cláusula, e a cláusula precisa existir. Perder o prazo legal de injeção pode custar o regime de faturamento inteiro.'},
    {n:'08',tr:'Ambas',t0:26,t1:30,sinc:true,
     tit:'Fechar: veredito das duas trilhas ou lista de solicitações',
     faz:'Consolidar o estado dos quatro eixos, aplicar a precedência da insuficiência documental sobre qualquer outro estado, e emitir uma das três saídas: proposta sólida, problema identificado e caracterizado, ou lista do que falta para concluir.',
     fon:'Os achados dos sete passos anteriores, cada um com a fonte que o sustenta registrada ao lado.',
     err:'Emitir veredito sobre eixo não verificado, e não emitir o veredito favorável quando ele é o correto. Os dois erros têm a mesma origem — a expectativa de que o parecer precise encontrar alguma coisa — e o segundo é o mais caro para a reputação de quem avalia. Este é o segundo ponto de sincronização, e a avaliação termina aqui com ou sem conclusão.'}
  ];
  var at=0;
  function render(){
    nav.innerHTML=P.map(function(p,i){
      return '<button class="tr-chip'+(i===at?' on':'')+'" data-i="'+i+'">'+p.n+' · '+esc(p.tr)+(p.sinc?' ⟂':'')+'</button>';
    }).join('');
    $all('button',nav).forEach(function(b){
      b.addEventListener('click',function(){at=parseInt(b.getAttribute('data-i'),10);render();});
    });
    var p=P[at];
    pan.innerHTML='<div class="yr">Passo '+p.n+' · trilha '+esc(p.tr)+' · minuto '+p.t0+' ao '+p.t1+(p.sinc?' · ponto de sincronização':'')+'</div>'+
      '<p><b>'+esc(p.tit)+'</b></p>'+
      '<p><b>O que fazer.</b> '+p.faz+'</p>'+
      '<p><b>Fonte a consultar.</b> '+p.fon+'</p>'+
      '<p><b>Erro que o passo previne.</b> '+p.err+'</p>';
    bars.innerHTML=P.map(function(q,i){
      var w=(q.t1-q.t0)/30*100, off=q.t0/30*100;
      var cor=q.tr==='Técnica'?'var(--cy)':(q.tr==='Contratual'?'var(--gd)':'var(--gr)');
      return '<div class="bar-row"><div class="lb">'+q.n+' · '+esc(q.tr)+'</div>'+
        '<div class="bar-track"><div class="bar-fill" style="margin-left:'+off+'%;width:'+w+'%;background:'+cor+';opacity:'+(i===at?1:.42)+'"></div></div>'+
        '<div class="vl">'+q.t0+'–'+q.t1+' min</div></div>';
    }).join('');
  }
  render();
  // GANCHO (acrescentado): __ganchos.escolher = function (v) { at = parseInt(v, 10); render(); };
  __ganchos.escolher = function (v) { at = parseInt(v, 10); render(); };
}

export const CALCULADORAS: Record<string, CalculateFn> = {
  'm11-inst-01': instrumento(corpo01, [], ["mp-lens","mp-item"], null),
  'm11-inst-02': instrumento(corpo02, [], ["se-out"], null),
  'm11-inst-03': instrumento(corpo03, [], ["rg-panel"], "rg-nav"),
  'm11-inst-04': instrumento(corpo04, ["cl-porte","cl-teto","cl-mod"], ["cl-vd"], null),
  'm11-inst-05': instrumento(corpo05, ["rr-classe","rr-perc","rr-estado"], ["rr-vd"], null),
  'm11-inst-06': instrumento(corpo06, ["gv-ref","gv-dev","gv-prim"], ["gv-vd"], null),
  'm11-inst-07': instrumento(corpo07, ["dg-p1","dg-p2","dg-gap"], ["dg-vd"], null),
  'm11-inst-08': instrumento(corpo08, ["tt-gap","tt-i1","tt-exc"], ["tt-vd"], null),
  'm11-inst-09': instrumento(corpo09, [], ["sa-out"], null),
  'm11-inst-10': instrumento(corpo10, [], ["rv-vd"], null),
  'm11-inst-11': instrumento(corpo11, [], ["or-panel","or-bars"], "or-nav"),
};
