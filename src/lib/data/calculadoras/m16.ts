// @ts-nocheck — o corpo de cada instrumento é JavaScript copiado verbatim do
// <script> da fonte; tipá-lo exigiria reescrevê-lo, e reescrever é o que o
// porte verbatim proíbe (Q06). O contrato exportado (CALCULADORAS) é tipado.
//
// GERADO por tools/alexandria-dados/porte/gerar-instrumentos-m16-m17.mjs 16 — não edite à mão.
// Fonte: Alexandria modulos/alexandria_modulo16.html (só leitura).
// Conferência contra o script original executado: verificar-instrumentos-m16-m17.mjs 16.
//
// Posse: a sessão de porte do M16. Uma chave aqui SUBSTITUI a de mesmo id em
// INSTRUMENT_CALCULATORS.
import type { CalculateFn, EntradaInstrumento } from '../alexandria-instrument-calculators';

/* ── helpers puros, verbatim da fonte ── */
/* L4903 */ function esc(t){return String(t).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');}
/* L4904 */ function clamp(v,a,b){if(isNaN(v))return a;return v<a?a:(v>b?b:v);}
/* L4905 */ function numOf(el,def,a,b){if(!el)return def;var v=parseFloat(String(el.value).replace(',','.'));if(isNaN(v))return def;return clamp(v,a,b);}
/* L4906 */ function fmt(n,d){if(isNaN(n)||!isFinite(n))return '—';return n.toLocaleString('pt-BR',{minimumFractionDigits:d||0,maximumFractionDigits:d||0});}

/* ── dados compartilhados, verbatim da fonte (L4973–L4980) ── */
var TND={
  ele:{n:'Eletrificação de transporte',c:'ele'},
  arm:{n:'Armazenamento em baterias',c:'arm'},
  med:{n:'Medição avançada',c:'med'},
  agr:{n:'Agregação de recursos distribuídos',c:'agr'},
  car:{n:'Mercado regulado de carbono',c:'car'},
  dcs:{n:'Demanda de centros de dados',c:'dcs'}
};

/* ── ambiente mínimo: o papel do DOM, para o corpo verbatim rodar ──
   Nada aqui calcula. `$id` devolve um objeto que guarda o que o script
   escreve; `segVal` devolve a escolha do aluno; `segBind`, `pair` e `chips`
   registram os ouvintes da fonte, e `calcular` os dispara com a escolha do
   aluno, na ordem em que a página os dispararia (seletor antes de chip). */
function criarAmbiente(entradas) {
  const els = {};
  const ouvintesSeg = [];
  const chipsReg = {};
  const lista = () => {
    const s = new Set();
    return { add: (c) => s.add(c), remove: (c) => s.delete(c), contains: (c) => s.has(c), toggle: (c, f) => ((f ?? !s.has(c)) ? s.add(c) : s.delete(c)) };
  };
  const $id = (id) => {
    if (!els[id]) {
      const v = entradas[id];
      els[id] = {
        id,
        innerHTML: '',
        _texto: null,
        className: '',
        value: v === undefined || v === null ? '' : String(v),
        style: {},
        classList: lista(),
        getAttribute: () => null,
        setAttribute() {},
        addEventListener() {},
        querySelector: () => null,
        querySelectorAll: () => [],
      };
      Object.defineProperty(els[id], 'textContent', {
        get() { return this._texto ?? this.innerHTML.replace(/<[^>]+>/g, ''); },
        set(t) { this._texto = String(t); this.innerHTML = esc(t); },
      });
    }
    return els[id];
  };
  return {
    els,
    $id,
    $all: () => [],
    segBind: (id, fn) => { ouvintesSeg.push({ id, fn }); },
    segVal: (id) => (entradas[id] === undefined || entradas[id] === null || entradas[id] === '' ? null : String(entradas[id])),
    pair() {},
    chips: (wrapId, list, attr, onPick) => { chipsReg[wrapId] = { list, onPick }; },
    bars() {},
    disparar() {
      for (const { id, fn } of ouvintesSeg) {
        const v = entradas[id];
        if (v === undefined || v === null || v === '') continue;
        fn({ getAttribute: () => String(v), classList: lista() });
      }
      for (const [wrapId, { list, onPick }] of Object.entries(chipsReg)) {
        const v = entradas[wrapId];
        if (v === undefined || v === null || v === '') continue;
        if (list.some((o) => String(o.k) === String(v))) onPick(String(v));
      }
    },
  };
}

/** HTML do painel da fonte → HTML curto que a aula v3 renderiza (b, em, br).
 *  Rótulo de cartão vira negrito; bloco vira quebra; lista numerada mantém
 *  o número. O texto é o da fonte, sem palavra nova. */
function simplificar(h) {
  let s = String(h);
  s = s.replace(/<ol[^>]*>([\s\S]*?)<\/ol>/g, (m, corpo) => {
    let k = 0;
    return '<br>' + corpo.replace(/<li[^>]*>/g, () => `${++k}. `).replace(/<\/li>/g, '<br>');
  });
  s = s.replace(/<ul[^>]*>([\s\S]*?)<\/ul>/g, (m, corpo) => '<br>' + corpo.replace(/<li[^>]*>/g, '').replace(/<\/li>/g, '<br>'));
  s = s.replace(/<span class="fzk">([\s\S]*?)<\/span>/g, '<b>$1</b> ');
  s = s.replace(/<span class="fzn">([\s\S]*?)<\/span>/g, ' · $1');
  s = s.replace(/<(div|span)\s+class="(?:ok2|tg2|tag|vf-lb|k|yr|ti|grg-k|ck2|jk|lb2|sub2|hd2|cl|nm2)"[^>]*>([\s\S]*?)<\/\1>/g, '<b>$2</b><br>');
  s = s.replace(/<div class="lg"><b>([\s\S]*?)<\/b>/g, '<b>$1</b><br>');
  s = s.replace(/<\/(div|p|li|tr)>/g, '<br>');
  s = s.replace(/<(?!\/?(b|strong|em|i|br|sub|sup)\b)[^>]*>/g, '');
  s = s.replace(/<br\s*\/?>/g, '<br>');
  s = s.replace(/(\s*<br>\s*){3,}/g, '<br><br>');
  s = s.replace(/^(\s*<br>\s*)+|(\s*<br>\s*)+$/g, '');
  return s.replace(/[ \t\n]+/g, ' ').trim();
}

/** Número que o script escreveu no readout ("1.234,5<span class=u>MWh</span>"). */
function lerReadout(h) {
  const semUnidade = String(h).replace(/<(span|small)[^>]*>[\s\S]*?<\/\1>/g, '').replace(/<[^>]+>/g, '').replace(/^R\$\s*/, '').trim();
  const t = semUnidade.replace(/\./g, '').replace(',', '.').replace(/[^\d.eE+-]/g, '');
  const v = t === '' || t === '-' ? NaN : Number(t);
  return Number.isFinite(v) ? v : NaN;
}
function unidadeDoReadout(h) {
  const u = (String(h).match(/<(span|small)[^>]*>([\s\S]*?)<\/\1>/) || [])[2] ?? '';
  const rs = /^\s*R\$/.test(String(h).replace(/<[^>]+>/g, '')) ? 'R$' : '';
  return rs ? (u.startsWith('/') ? `${rs}${u}` : `${rs} ${u}`.trim()) : u || null;
}
function editar(s, editoriais) {
  let r = s;
  for (const [de, para] of editoriais) r = r.split(de).join(para);
  return r;
}

/** Readout como a fonte o escreve, com a unidade: "378.592 MWh/ano", "R$ 93,02/MWh". */
function textoDoReadout(h) {
  return String(h)
    .replace(/<(span|small)[^>]*>([\s\S]*?)<\/\1>/g, (m, t, u) => (u.startsWith('/') || u === '%' ? u : ` ${u}`))
    .replace(/<[^>]+>/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function calcular(fn, entradas, spec, editoriais, extratores) {
  const amb = criarAmbiente(entradas);
  fn(amb.$id, amb.$all, amb.segBind, amb.segVal, amb.pair, amb.chips, amb.bars);
  amb.disparar();
  const valores = {};
  const unidades = {};
  const textos = {};
  for (const id of spec.readouts) {
    const h = amb.$id(id).innerHTML;
    valores[id] = lerReadout(h);
    unidades[id] = unidadeDoReadout(h);
    textos[id] = textoDoReadout(h);
  }
  const bruto = Object.fromEntries(Object.entries(amb.els).map(([k, e]) => [k, e.innerHTML]));
  // Saída de escolha (previsão categórica): lida do que o script escreveu, nunca calculada aqui.
  for (const [id, ler] of Object.entries(extratores ?? {})) {
    const v = ler(bruto, entradas);
    if (v !== null && v !== undefined) textos[id] = String(v);
  }
  const partes = spec.textos.map((id) => simplificar(amb.$id(id).innerHTML)).filter(Boolean);
  // O script da fonte já formata em pt-BR (toLocaleString): a tela não troca ponto por vírgula.
  return { valores, textos, veredito: editar(partes.join('<br><br>'), editoriais), vereditoPtBr: true, unidades, bruto };
}

/* ── m16-inst-01 · Mapa · Mapa das seis tendências — corpo da IIFE, verbatim (L4984–L5070) ── */
function inst01($id, $all, segBind, segVal, pair, chips, bars) {
  var chipsW=$id('mp-chips'); if(!chipsW)return;

  /* AS QUATRO ORDENAÇÕES, ESCRITAS LADO A LADO ANTES DE QUALQUER DADO.
     Confirmação visual de que são quatro sequências distintas:
       estágio    : ele  agr  med  arm  car  dcs
       gargalo    : med  agr  car  arm  ele  dcs
       carga      : dcs  ele  arm  agr  med  car
       horizonte  : med  car  arm  dcs  ele  agr                                   */
  var ORD={
    est:['ele','agr','med','arm','car','dcs'],
    grg:['med','agr','car','arm','ele','dcs'],
    crg:['dcs','ele','arm','agr','med','car'],
    hor:['med','car','arm','dcs','ele','agr']
  };

  var ROT={
    est:{ele:'1 · escala',agr:'2 · piloto',med:'3 · regulado',arm:'3 · regulado',car:'3 · regulado',dcs:'4 · anunciado'},
    grg:{med:'Regra',agr:'Regra',car:'Regra',arm:'Sinal econômico',ele:'Cadeia',dcs:'Conexão'},
    crg:{dcs:'Acrescenta rígida',ele:'Acrescenta flexível',arm:'Move e perde',agr:'Torna flexível',med:'Habilita',car:'Indireto'},
    hor:{med:'14/08/2026',car:'28/08/2026',arm:'02 e 04/12/2026',dcs:'Sem data',ele:'Mensal',agr:'2027+'}
  };

  var D={
    est:{
      ele:{t:'Em operação em escala',d:'Série mensal de emplacamento com mais de uma década, taxonomia por tecnologia e apurações sucessivas de pontos de recarga. É a única das seis com número medido, publicado e comparável entre períodos.',f:'Compilação de entidade setorial; base oficial é o registro nacional de veículos.'},
      agr:{t:'Em operação piloto',d:'Existem projetos e experimentação em ambiente de teste regulatório, sem escala e sem série histórica que sustente extrapolação. A base sobre a qual atuaria — a geração distribuída instalada — existe e é grande; o recurso comandável, não.',f:'Consulta pública sobre excedentes e flexibilidade operativa encerrada em 06/06/2026.'},
      med:{t:'Regulado, em implantação inicial',d:'Obrigação quantificada em vigor desde 1º/03/2026: 2% das unidades consumidoras por ano, por 24 meses. A norma de requisitos técnicos mínimos ainda está em consulta. Caso raro: a obrigação de instalar veio antes da definição do que instalar.',f:'Portaria ministerial de 2026; consulta pública em segunda fase até 14/08/2026.'},
      arm:{t:'Regulado e não construído',d:'Duas resoluções normativas publicadas em 24/06/2026 criaram outorga, regras de acesso, cobrança pelo uso da rede e regime de penalidades. Não há ativo em escala de sistema operando na configuração criada por elas. Atrás do medidor, há oferta comercial — posição 2 para esse recorte.',f:'Resoluções normativas de 02/06/2026; portaria de diretrizes de 1º/06/2026.'},
      car:{t:'Regulado e não construído',d:'Lei em vigor desde 12/12/2024, decretos de governança editados, resoluções do comitê consultivo em vigor desde 11/05/2026 — e nenhum operador sujeito a obrigação de relato ou de entrega de ativo nesta data. O órgão gestor permanente não está constituído.',f:'Lei de 2024; consulta pública sobre etapas de mensuração aberta até 28/08/2026.'},
      dcs:{t:'Anunciado com data',d:'O parque instalado está em operação em escala; a carga incremental — que é o objeto deste bloco — está entre anúncio e projeção. Os números que circulam são pedidos de parecer de acesso, primeiro degrau de uma escada de cinco.',f:'Informação ministerial de 1º/06/2026 e contabilidade da empresa de planejamento.'}
    },
    grg:{
      ele:{t:'Cadeia de suprimento',d:'Os veículos existem, os carregadores existem e a demanda cresceu 125% no semestre. O que decide o ritmo é a capacidade de produção local diante da alíquota de importação de 35% em vigor desde 1º/07/2026.',f:'Não vinculam: maturidade tecnológica; conexão à rede no agregado.'},
      arm:{t:'Sinal econômico',d:'A regra foi resolvida em junho de 2026. Existe uma fonte de receita contratada e nenhum mercado organizado para as demais — e a cobrança pelo uso da rede passou a incidir cumulativamente sobre consumo e injeção.',f:'Não vinculam: regra habilitante; maturidade tecnológica.'},
      med:{t:'Regra habilitante',d:'Existe obrigação de instalar e ainda não existe definição final do que instalar, de prazo e forma de acesso do consumidor ao dado, nem de metodologia de custo-benefício — remetida a 2028.',f:'Não vincula: maturidade tecnológica. Sinal econômico é o próximo a vincular.'},
      agr:{t:'Regra habilitante',d:'Faltam três definições sem as quais não há contrato possível: quem comanda o recurso, quem responde se ele não entregar, e contra qual linha de base se mede o serviço entregue.',f:'Não vinculam: maturidade tecnológica; cadeia de suprimento. Medição é pré-requisito, não gargalo independente.'},
      car:{t:'Regra habilitante',d:'Falta a norma infralegal e falta o órgão gestor permanente, cuja proposta de criação é meta até dezembro de 2026. O prazo original da fase I venceu em 12/12/2025 e corre a prórroga.',f:'Não vincula sinal econômico — porque ainda não existe preço.'},
      dcs:{t:'Conexão à rede',d:'A magnitude dos pedidos e a criação de política específica de gestão da fila de acesso ao sistema de transmissão são a evidência direta. Regra habilitante vincula parcialmente, pelo regime tributário pendente de votação.',f:'Não vinculam: maturidade tecnológica; sinal econômico.'}
    },
    crg:{
      dcs:{t:'Acrescenta carga rígida',d:'É a maior das seis por unidade de empreendimento. Um projeto de 100 MW de tecnologia da informação, com eficiência de 1,30 e 90% de utilização, implica 117 MW médios e cerca de 1,02 TWh ao ano. A rigidez é contratual antes de ser física.',f:'Cargas especiais entre 1,2% e 12,9% da demanda total de 2035, conforme o cenário.'},
      ele:{t:'Acrescenta carga potencialmente flexível',d:'Pouca energia e muita potência local. Projeção oficial de 627 GWh em 2025 para 7,8 TWh em 2035 — 0,83% do consumo projetado no cenário de referência. A flexibilidade depende de sinal tarifário e de controle de recarga.',f:'Problema de potência local, não de energia nacional.'},
      arm:{t:'Move energia e perde na conversão',d:'Não acrescenta carga líquida relevante — acrescenta a perda de ciclo — e acrescenta muita flexibilidade. É o único ativo do bloco que muda de sinal ao longo do dia, aparecendo como carga e como geração na mesma série.',f:'Produto contratado: potência por quatro horas, até dois ciclos diários, teto de 366 ciclos anuais.'},
      agr:{t:'Torna flexível carga existente',d:'Não acrescenta nem retira carga. Converte carga e geração já instaladas em recurso despachável — ou seja, é a tendência que mais acrescenta flexibilidade por real investido, porque não constrói ativo novo.',f:'Sem ela, a resposta operativa disponível para excedente na borda é o corte.'},
      med:{t:'Habilita a conversão',d:'Não acrescenta nem retira carga. Habilita a conversão de carga rígida em carga flexível — mas só em conjunto com sinal de preço que varie no tempo. Medição sem tarifa horária produz relatório, não flexibilidade.',f:'Tarifa horária obrigatória para baixa tensão acima de 1.000 kWh/mês alcança cerca de 2,5 milhões de unidades.'},
      car:{t:'Efeito indireto sobre a carga',d:'Não acrescenta nem retira carga elétrica diretamente. Altera o custo relativo entre rotas tecnológicas e, por essa via, desloca decisões de investimento — inclusive na direção da eletrificação de processos.',f:'O efeito é mediado por preço que ainda não existe.'}
    },
    hor:{
      med:{t:'14 de agosto de 2026',d:'Encerra a fase de contribuição sobre requisitos técnicos mínimos. A obrigação de instalar já corre desde março; o que se decide agora é o que exatamente será instalado — e portanto que serviços passam a ser possíveis.',f:'Marco mais próximo das seis tendências.'},
      car:{t:'28 de agosto de 2026',d:'Encerra a contribuição sobre as etapas de implementação das obrigações de mensuração, relato e verificação. É o documento que define quando cada setor começa a relatar — e a prórroga da fase I esgota em dezembro.',f:'Segundo marco mais próximo.'},
      arm:{t:'2 e 4 de dezembro de 2026',d:'Os dois certames de reserva de capacidade. O resultado move a tendência de "regulado e não construído" para "anunciado com data" e revela preço — que é a informação que ninguém tem hoje.',f:'Suprimento contratado inicia em 1º/08/2028.'},
      dcs:{t:'Sem data definida',d:'O regime tributário específico depende de deliberação legislativa sem prazo constitucional após a caducidade da medida provisória. Os pareceres de acesso seguem sendo emitidos individualmente, sem marco agregado datado.',f:'Ausência de data é informação: significa que a decisão não está calendarizada.'},
      ele:{t:'Acompanhamento mensal',d:'Não há marco único: há série mensal de emplacamento e apurações periódicas de recarga. A decisão relevante é de acompanhamento, não de posicionamento — com a ressalva de que a série do segundo semestre não é comparável à do primeiro.',f:'Mudança de regime de importação em 1º/07/2026 quebra a comparabilidade.'},
      agr:{t:'2027 em diante',d:'Depende da conclusão da regulamentação de medição avançada e da definição da figura do agregador, ambas em agenda regulatória do biênio. É a tendência com o horizonte de decisão mais distante das seis.',f:'A discussão de abertura do Grupo B a partir de 2027 é o vetor mais provável.'}
    }
  };

  var LAB={est:'Estágio na régua de cinco posições',grg:'Gargalo vinculante em 04/08/2026',
           crg:'Efeito sobre a carga do sistema',hor:'Marco verificável seguinte'};

  function listaPara(d){
    return ORD[d].map(function(k){return {k:k,n:TND[k].n,y:ROT[d][k]};});
  }
  function painel(d,k){
    var o=D[d][k];
    return '<div class="tl-panel"><div class="yr">'+esc(LAB[d])+'</div>'+
      '<div class="ti">'+esc(TND[k].n)+' — '+esc(o.t)+'</div>'+
      '<div class="bd2">'+esc(o.d)+'</div>'+
      '<div class="lg"><b>Nota de leitura</b>'+esc(o.f)+'</div></div>';
  }
  function fluxPara(d){
    return ORD[d].map(function(k,i){
      var cls=['i','c','p','m','o','c'][i];
      return '<div class="fz '+cls+'"><span class="fzk">'+(i+1)+'º</span>'+
        '<span class="fzv">'+esc(TND[k].n.split(' ')[0])+'<span class="fzn">'+esc(ROT[d][k])+'</span></span></div>';
    }).join('');
  }
  function render(d,k){
    $id('mp-flux').innerHTML=fluxPara(d);
    $id('mp-panel').innerHTML=painel(d,k);
  }
  function trocaDim(d){
    chips('mp-chips',listaPara(d),'t',function(k){render(d,k);});
    render(d,ORD[d][0]);
  }
  segBind('mp-dim',function(b){trocaDim(b.getAttribute('data-d'));});
  trocaDim('est');
}

/* ── m16-inst-02 · Régua de estágio de maturidade — corpo da IIFE, verbatim (L5075–L5139) ── */
function inst02($id, $all, segBind, segVal, pair, chips, bars) {
  if(!$id('rg-out'))return;
  var POS={
    1:{n:'Em operação em escala',ex:'Número de operação medido e publicado por fonte primária, com série histórica que permita ver a taxa. Perímetro declarado e mais de um período comparável.'},
    2:{n:'Em operação piloto',ex:'Instalação verificável operando, identificada por empreendimento e período, com resultado medido — e a declaração de que a economia ainda não é replicável.'},
    3:{n:'Regulado e não construído',ex:'Norma habilitante com número, data de publicação e estado de regulamentação — e a constatação explícita de ausência de ativo operando na configuração que ela criou.'},
    4:{n:'Anunciado com data',ex:'Documento do anúncio, com autor e data. Edital, cronograma, pedido protocolado ou comunicado de investimento — e a resposta a: o que acontece com quem não cumprir?'},
    5:{n:'Projeção',ex:'Autor nomeado, data, cenário específico entre os alternativos publicados, e a declaração de qual variável o autor tem interesse em ver crescer.'}
  };
  /* posição real de cada tendência em 04/08/2026 */
  var REAL={ele:1,agr:2,med:3,arm:3,car:3,dcs:4};
  var DISP={
    ele:{1:'215.023 leves eletrificados no primeiro semestre de 2026, dos quais 167.026 com tomada; série mensal com mais de uma década; 25.429 pontos públicos e semipúblicos em junho, contra 21.061 em fevereiro.',
         2:'Há também instalações piloto de recarga bidirecional e de gestão de frota — mas classificar a tendência inteira aqui subestima o que já é medido em escala.',
         3:'A exploração comercial da recarga é regulada, com preços livremente negociados; um marco específico de eletromobilidade consta da agenda regulatória do biênio.',
         4:'Há anúncios de expansão de capacidade produtiva e de rede de recarga — mas o anúncio é um subconjunto do que já opera, e não o contrário.',
         5:'Projeção oficial de 627 GWh em 2025 para 7,8 TWh em 2035, no caderno de eletromobilidade do plano decenal.'},
    agr:{1:'Não existe número de operação de agregação medido e publicado com série histórica. A geração distribuída instalada — cerca de 47 GW — é insumo, e não o recurso agregado.',
         2:'Experimentação em ambiente de teste regulatório e projetos de distribuidoras envolvendo microrredes, armazenamento e controle remoto de equipamentos.',
         3:'Não há norma habilitante da figura do agregador. Há consulta pública encerrada em 06/06/2026 sobre tratamento de excedentes e flexibilidade operativa na distribuição.',
         4:'Não há edital nem cronograma datado específico para agregação. A discussão consta da agenda regulatória do biênio, com decisão prevista sem data fixa.',
         5:'Cenários de recursos energéticos distribuídos constam de documento de planejamento de 2026 — projeção com autor identificável.'},
    med:{1:'Não há número publicado de pontos com os quatro componentes integrados operando. Há contagem de medidores eletrônicos, que mede outra coisa.',
         2:'Existem programas de distribuidoras com pontos comunicando e sistemas de gestão de dados operando, sem cobertura nacional nem série comparável.',
         3:'Obrigação de 2% das unidades consumidoras por ano em vigor desde 1º/03/2026, com funcionalidades mínimas definidas em portaria; norma de requisitos técnicos em consulta até 14/08/2026.',
         4:'Análise de custo-benefício das distribuidoras com prazo de entrega em 29/02/2028 — compromisso datado, com efeito futuro.',
         5:'Estimativas de investimento associadas à modernização da distribuição circulam, e são cenário de autor com interesse declarável.'},
    arm:{1:'Não há capacidade de armazenamento em escala de sistema operando com número medido e publicado no país.',
         2:'Instalações atrás do medidor operando em clientes comerciais e industriais, com oferta comercial disponível — esta é a posição correta para esse recorte específico.',
         3:'Resoluções normativas de 02/06/2026, publicadas em 24/06/2026, criando outorga, regras de acesso, cobrança pelo uso da rede e regime de penalidades. Nenhum ativo operando na configuração criada.',
         4:'Dois certames marcados para 2 e 4 de dezembro de 2026, com suprimento iniciando em 1º/08/2028 — edital com data, sem resultado.',
         5:'Estimativas de capacidade futura circulam em material de desenvolvedor e de fabricante; todas são cenário de parte interessada.'},
    car:{1:'Nenhum ativo do sistema foi emitido, negociado ou cancelado. Não há mercado operando.',
         2:'Não há operação piloto do sistema regulado. Há projetos no mercado voluntário, que é outro regime.',
         3:'Lei em vigor desde 12/12/2024; decretos de governança; resoluções do comitê consultivo em vigor desde 11/05/2026; registro central em desenvolvimento. Nenhum operador sujeito a obrigação de relato nesta data.',
         4:'Roteiro oficial com fases datadas: instrumentos de relato em 2027, monitoramento em 2028–2029, primeiro plano de alocação e mercado de ativos em 2030.',
         5:'Projeções de preço de carbono brasileiro circulam e não têm base: não há teto definido, não há cobertura setorial final e não há alocação.'},
    dcs:{1:'O parque instalado de centros de dados opera e tem consumo medido — mas esse não é o objeto deste bloco, que é a carga incremental.',
         2:'Não se aplica: não há piloto de carga incremental; há empreendimentos em construção e em análise de conexão.',
         3:'O regime tributário específico não está vigente — a medida provisória caducou em fevereiro de 2026 e o projeto substitutivo seguia pendente. Há regulação geral de acesso, que não é específica do tema.',
         4:'38 GW em pedidos de parecer de acesso informados em 1º/06/2026, dos quais 7,1 GW associados a R$ 159 bilhões; 26,3 GW em solicitações de conexão até 2038 na contabilidade do planejador.',
         5:'Cargas especiais entre 1,2% e 12,9% da demanda total de eletricidade em 2035, conforme o cenário do plano decenal.'}
  };
  function render(){
    var t=segVal('rg-tnd','data-t')||'ele';
    var p=parseInt(segVal('rg-pos','data-p')||'1',10);
    var real=REAL[t];
    $id('rg-out').innerHTML=
      '<div class="out">'+
      '<div class="ocard"><span class="ok2">Posição testada</span><b>'+esc(POS[p].n)+'</b></div>'+
      '<div class="ocard gd2"><span class="ok2">Evidência que esta posição exigiria</span>'+esc(POS[p].ex)+'</div>'+
      '<div class="ocard '+(p===real?'gr2':'rd2')+'"><span class="ok2">Evidência disponível em 04/08/2026</span>'+esc(DISP[t][p])+'</div>'+
      '</div>';
    var vd=$id('rg-vd');
    if(p===real){
      vd.className='verdict ok';
      vd.innerHTML='<b>É esta a posição.</b> '+esc(TND[t].n)+' está classificada como <b>'+esc(POS[real].n).toLowerCase()+'</b> em 4 de agosto de 2026, e a evidência disponível satisfaz o que a posição exige. Registre a data: um único ato normativo ou a realização de um certame reclassifica esta linha.';
    } else if(p<real){
      vd.className='verdict per';
      vd.innerHTML='<b>Acima da evidência disponível.</b> Classificar '+esc(TND[t].n)+' na posição '+p+' seria afirmar mais do que a evidência sustenta — a posição correta hoje é a '+real+', <b>'+esc(POS[real].n).toLowerCase()+'</b>. Este é o erro de estágio confundido: ler autorização, anúncio ou solicitação como implantação.';
    } else {
      vd.className='verdict att';
      vd.innerHTML='<b>Abaixo da evidência disponível.</b> Classificar '+esc(TND[t].n)+' na posição '+p+' subestima o que já existe — a posição correta hoje é a '+real+', <b>'+esc(POS[real].n).toLowerCase()+'</b>. Subclassificar também é erro: leva a tratar como especulação uma obrigação que já corre, e a perder prazo.';
    }
  }
  segBind('rg-tnd',render); segBind('rg-pos',render); render();
}

/* ── m16-inst-03 · Comparador de gargalo — corpo da IIFE, verbatim (L5144–L5198) ── */
function inst03($id, $all, segBind, segVal, pair, chips, bars) {
  if(!$id('gg-out'))return;
  var CAND=[
    {k:'tec',n:'Maturidade tecnológica'},
    {k:'reg',n:'Regra habilitante'},
    {k:'tar',n:'Sinal econômico tarifário'},
    {k:'cad',n:'Cadeia de suprimento'},
    {k:'con',n:'Conexão à rede'}
  ];
  var VINC={ele:'cad',arm:'tar',med:'reg',agr:'reg',car:'reg',dcs:'con'};
  var G={
    ele:{tec:'Não vincula. Os veículos operam, os carregadores operam e a taxonomia de tecnologia está estabelecida. Nenhuma barreira técnica explica o ritmo.',
         reg:'Não vincula. A exploração comercial da recarga é livre, com preços negociados, e a regulação foi deliberadamente mínima para evitar subsídio cruzado.',
         tar:'Não vincula hoje, e vinculará depois. Sem tarifa que varie no tempo, a recarga não se desloca — mas isso limita a flexibilidade da carga, não a adoção do veículo.',
         cad:'<b>Vincula.</b> Alíquota de importação de 35% sobre veículo elétrico importado em vigor desde 1º/07/2026, concluindo o cronograma de retomada progressiva. A capacidade de produção local é a variável que decide o ritmo. <b>O que mudaria:</b> ampliação de capacidade instalada de montagem e nacionalização de componentes.',
         con:'Não vincula no agregado e vincula pontualmente. A energia adicionada é pequena nacionalmente; a potência coincidente em garagem de frota ou em alimentador residencial denso é problema real e local.'},
    arm:{tec:'Não vincula. A tecnologia opera comercialmente em várias jurisdições e há oferta de equipamento disponível.',
         reg:'Não vincula mais. Vinculava até junho de 2026, e deixou de vincular com a publicação das duas resoluções normativas que criaram outorga, acesso, cobrança e penalidades. <b>É o exemplo mais limpo de deslocamento de gargalo do módulo.</b>',
         tar:'<b>Vincula.</b> Existe uma fonte de receita contratada — reserva de capacidade — e nenhum mercado organizado para arbitragem, serviços ancilares ou alívio de congestionamento. E a cobrança pelo uso da rede passou a incidir cumulativamente sobre consumo e injeção. <b>O que mudaria:</b> produto de mercado para os demais serviços, e definição de como o encargo incide sobre um ativo que consome e injeta.',
         cad:'Não vincula em geral, e vincula num recorte: o produto que exige nacionalização depende de capacidade produtiva local credenciada, o que restringe a competição naquele certame específico.',
         con:'Não vincula ainda, e tende a vincular depois. A metodologia de capacidade remanescente de escoamento por barramento foi publicada justamente porque a localização decide a elegibilidade.'},
    med:{tec:'Não vincula. Medidor, telecomunicação e sistema de gestão de dados são tecnologias maduras e disponíveis comercialmente.',
         reg:'<b>Vincula.</b> Existe obrigação de instalar em vigor desde 1º/03/2026 e não existe definição final do que instalar. A norma de requisitos mínimos está em consulta até 14/08/2026; prazo e forma de acesso do consumidor ao dado estão em discussão; a metodologia de custo-benefício foi remetida a outro processo. <b>O que mudaria:</b> publicação da resolução de requisitos e da metodologia de análise.',
         tar:'Não vincula hoje, e é o próximo a vincular. Quando a regra sair, a pergunta passa a ser quem paga e como o investimento se recupera — e a resposta é escolha regulatória, não questão técnica.',
         cad:'Não vincula. Há fornecimento de medidor, de comunicação e de integração disponível, e o ritmo obrigatório de 2% ao ano é modesto diante da capacidade de fornecimento.',
         con:'Não vincula. Medição avançada não exige ponto de conexão novo — atua sobre o ponto existente.'},
    agr:{tec:'Não vincula. Telemetria, controle e plataformas de agregação existem e operam comercialmente.',
         reg:'<b>Vincula.</b> Faltam três definições sem as quais não há contrato possível: quem comanda o recurso, quem responde se ele não entregar, e contra qual linha de base se mede o serviço. Não há figura regulatória geral do agregador. <b>O que mudaria:</b> criação da figura, definição de linha de base e de responsabilidade, e regra de remuneração do serviço.',
         tar:'Não vincula isoladamente, e é inseparável da regra: sem produto que compre flexibilidade, definir o agregador não cria mercado. Os dois precisam sair juntos.',
         cad:'Não vincula. O recurso já está instalado — cerca de 47 GW de geração distribuída — e a agregação não constrói ativo novo.',
         con:'Não vincula, e é o inverso: agregação bem feita <b>alivia</b> restrição de conexão, evitando ou adiando reforço físico. É a razão pela qual ela é a tendência que mais acrescenta flexibilidade por real investido.'},
    car:{tec:'Não vincula. Mensuração, relato e verificação são práticas estabelecidas, com metodologias em uso no mercado voluntário há anos.',
         reg:'<b>Vincula.</b> Falta a norma infralegal completa e falta o órgão gestor permanente, cuja proposta de criação é meta até dezembro de 2026. O prazo original de doze meses da fase I venceu em 12/12/2025 e a prórroga esgota em 12/12/2026. <b>O que mudaria:</b> publicação das normas infralegais e constituição do órgão gestor.',
         tar:'Não vincula, e não pode vincular ainda: não existe preço porque não existe teto, não existe cobertura setorial final e não existe alocação. Projeção de preço de carbono brasileiro hoje é cenário sem base.',
         cad:'Não vincula em geral, e há um recorte: capacidade de verificação independente acreditada é insumo escasso e cresce mais devagar que a demanda regulatória. Vale monitorar, não classificar como gargalo hoje.',
         con:'Não vincula. O sistema não depende de infraestrutura elétrica.'},
    dcs:{tec:'Não vincula. Equipamento, refrigeração e projeto de instalação são maduros e disponíveis internacionalmente.',
         reg:'Vincula parcialmente. O regime tributário específico não está vigente: a medida provisória caducou em fevereiro de 2026 e o projeto substitutivo seguia pendente de deliberação. Isso adia decisão de investimento, mas não impede o empreendimento.',
         tar:'Não vincula. A economia do centro de dados suporta o preço da energia com folga; o que ela não suporta é indisponibilidade e atraso de conexão.',
         cad:'Não vincula do lado elétrico. Do lado computacional há restrição de equipamento, mas ela é global e não específica desta jurisdição — e o Módulo 12 já tratou cadeia de suprimento como questão geopolítica.',
         con:'<b>Vincula.</b> A magnitude dos pedidos — 38 GW em pareceres de acesso, 26,3 GW em solicitações até 2038 na contabilidade do planejador — e a criação de política específica de gestão da fila de acesso ao sistema de transmissão são a evidência direta. <b>O que mudaria:</b> reforço de transmissão nos pontos de interesse e regra de garantia que desestimule reserva especulativa.'}
  };
  function render(){
    var t=segVal('gg-tnd','data-t')||'ele';
    var v=VINC[t];
    $id('gg-out').innerHTML='<div class="grg">'+CAND.map(function(c){
      var vinc=(c.k===v);
      return '<div class="grg-r '+(vinc?'vinc':'nao2')+'"><div class="grg-k">'+esc(c.n)+'</div>'+
        '<div class="grg-v"><span class="tg2">'+(vinc?'Vincula':'Não vincula')+'</span>'+G[t][c.k]+'</div></div>';
    }).join('')+'</div>';
    var nome=CAND.filter(function(c){return c.k===v;})[0].n;
    var vd=$id('gg-vd');
    vd.className='verdict att';
    vd.innerHTML='<b>Gargalo vinculante em 4 de agosto de 2026: '+esc(nome.toLowerCase())+'.</b> Os outros quatro candidatos foram avaliados e não vinculam — e dizer isso é parte da análise, não educação. Relaxar uma restrição folgada não altera trajetória nenhuma. <b>Registre a data:</b> gargalo se desloca, e o caso do armazenamento demonstra isso — a regra vinculava até junho de 2026 e deixou de vincular com a publicação das resoluções normativas.';
  }
  segBind('gg-tnd',render); render();
}

/* ── m16-inst-04 · Conversor de frota em carga — corpo da IIFE, verbatim (L5207–L5251) ── */
function inst04($id, $all, segBind, segVal, pair, chips, bars) {
  if(!$id('fc-vd'))return;
  function upd(){
    var N  = numOf($id('fc-n-n'),167026,1000,5000000);
    var km = numOf($id('fc-km-n'),12000,5000,60000);
    var e  = numOf($id('fc-e-n'),0.17,0.10,0.40);
    var ef = numOf($id('fc-ef-n'),90,80,98)/100;
    var pp = numOf($id('fc-p-n'),7.4,3.7,350);
    var co = numOf($id('fc-fc-n'),30,5,100)/100;
    var rf = numOf($id('fc-ref-n'),939,300,1200);
    var lm = numOf($id('fc-lim-n'),100,0.1,5000);

    var evKWh = km*e/ef;                 /* kWh por veículo por ano, retirados da rede */
    var eMWh  = N*evKWh/1000;            /* MWh por ano */
    var eTWh  = eMWh/1e6;
    var share = eTWh/rf*100;             /* % do consumo de referência */
    var pMW   = N*pp*co/1000;            /* MW coincidentes */
    var usoL  = pMW/lm*100;              /* % do limite local */
    var hEq   = pMW>0 ? eMWh/pMW : 0;    /* horas equivalentes na potência coincidente */

    $id('fc-en').innerHTML = fmt(eMWh,0)+'<span class="u">MWh/ano</span>';
    $id('fc-sh').innerHTML = fmt(share,3)+'<span class="u">%</span>';
    $id('fc-pc').innerHTML = fmt(pMW,1)+'<span class="u">MW</span>';
    $id('fc-ul').innerHTML = fmt(usoL,1)+'<span class="u">%</span>';
    $id('fc-ev').innerHTML = fmt(evKWh,0)+'<span class="u">kWh/veículo</span>';
    $id('fc-he').innerHTML = fmt(hEq,0)+'<span class="u">h/ano</span>';

    bars('fc-bars',[
      {lb:'Participação no consumo de referência',pct:clamp(share/5*100,0,100),vl:fmt(share,3)+'%',cor:'var(--cy)'},
      {lb:'Uso do limite local declarado',pct:clamp(usoL,0,100),vl:fmt(usoL,1)+'%',cor:usoL>100?'var(--rd)':(usoL>50?'var(--gd)':'var(--gr)')},
      {lb:'Fator de coincidência aplicado',pct:co*100,vl:fmt(co*100,0)+'%',cor:'var(--gd)'}
    ]);

    var vd=$id('fc-vd'), agr, loc;
    if(share<0.5)      agr='<b>No agregado, abaixo do ruído.</b> '+fmt(share,3)+'% do consumo de referência não move planejamento de suprimento nem de geração.';
    else if(share<3)   agr='<b>No agregado, visível.</b> '+fmt(share,2)+'% do consumo de referência já aparece em projeção de demanda, mas ainda não é o fator dominante.';
    else               agr='<b>No agregado, material.</b> '+fmt(share,2)+'% do consumo de referência é magnitude que exige tratamento explícito em planejamento de oferta.';

    if(usoL>100){ loc='<b>Localmente, excede.</b> '+fmt(pMW,1)+' MW coincidentes contra '+fmt(lm,1)+' MW disponíveis: a instalação não atende sem reforço, sem gestão de recarga ou sem ampliação de janela.'; vd.className='verdict per'; }
    else if(usoL>50){ loc='<b>Localmente, aperta.</b> '+fmt(pMW,1)+' MW coincidentes ocupam '+fmt(usoL,0)+'% do limite declarado — margem estreita para crescimento e para simultaneidade acima do previsto.'; vd.className='verdict att'; }
    else { loc='<b>Localmente, folgado.</b> '+fmt(pMW,1)+' MW coincidentes ocupam '+fmt(usoL,0)+'% do limite declarado.'; vd.className='verdict ok'; }

    vd.innerHTML = agr+' '+loc+' <b>O veredito cruza os dois sinais por construção</b>, porque nenhum deles conclui sozinho: eletrificação de transporte é problema de potência local e não de energia nacional, e o fator de coincidência de '+fmt(co*100,0)+'% é a variável que decide o segundo resultado. Antes de usar qualquer número acima, pergunte o perfil de chegada e a janela de recarga — sem eles, a potência coincidente é arbitrada, não calculada.';
  }
  ['n','km','e','ef','p','fc','ref','lim'].forEach(function(k){pair('fc-'+k+'-n','fc-'+k+'-r',upd);});
  upd();
}

/* ── m16-inst-05 · Régua de armazenamento — corpo da IIFE, verbatim (L5259–L5305) ── */
function inst05($id, $all, segBind, segVal, pair, chips, bars) {
  if(!$id('ar-vd'))return;
  function upd(){
    var P  = numOf($id('ar-p-n'),30,1,500);
    var d  = numOf($id('ar-d-n'),4,0.5,8);
    var dod= numOf($id('ar-dod-n'),90,50,100)/100;
    var rte= numOf($id('ar-rte-n'),86,70,95)/100;
    var pc = numOf($id('ar-pc-n'),80,0,500);
    var pv = numOf($id('ar-pv-n'),400,0,1500);
    var cy = numOf($id('ar-cy-n'),366,50,730);

    var enNom = P*d;                 /* MWh nominais */
    var euCic = enNom*dod;           /* MWh úteis por ciclo */
    var eAno  = euCic*cy;            /* MWh entregues no ano */
    var ecAno = eAno/rte;            /* MWh comprados no ano */
    var spMin = pc/rte;              /* spread mínimo de equilíbrio, R$/MWh */
    var receita = eAno*pv;
    var custo   = ecAno*pc;
    var margem  = receita-custo;
    var margemMW= margem/P;

    $id('ar-en').innerHTML = fmt(enNom,1)+'<span class="u">MWh</span>';
    $id('ar-eu').innerHTML = fmt(euCic,2)+'<span class="u">MWh</span>';
    $id('ar-ea').innerHTML = fmt(eAno,0)+'<span class="u">MWh/ano</span>';
    $id('ar-ec').innerHTML = fmt(ecAno,0)+'<span class="u">MWh/ano</span>';
    $id('ar-sp').innerHTML = 'R$ '+fmt(spMin,2)+'<span class="u">/MWh</span>';
    $id('ar-mg').innerHTML = 'R$ '+fmt(margemMW/1000,0)+'<span class="u">mil/MW-ano</span>';

    bars('ar-bars',[
      {lb:'Duração instalada',pct:clamp(d/8*100,0,100),vl:fmt(d,1)+' h',cor:d>=4?'var(--gr)':'var(--gd)'},
      {lb:'Perda de conversão no ano',pct:clamp((ecAno-eAno)/Math.max(ecAno,1)*100*5,0,100),vl:fmt(ecAno-eAno,0)+' MWh',cor:'var(--rd)'},
      {lb:'Spread mínimo sobre o preço de venda',pct:clamp(spMin/Math.max(pv,1)*100,0,100),vl:'R$ '+fmt(spMin,0)+' de R$ '+fmt(pv,0),cor:'var(--cy)'}
    ]);

    var vd=$id('ar-vd'), t1;
    if(margemMW<0)            { vd.className='verdict per'; t1='<b>O ciclo destrói valor.</b> Com spread mínimo de equilíbrio em R$ '+fmt(spMin,2)+'/MWh e preço de venda de R$ '+fmt(pv,2)+'/MWh, cada MWh entregue custa mais do que recebe.'; }
    else if(margemMW<250000)  { vd.className='verdict per'; t1='<b>Margem insuficiente isoladamente.</b> R$ '+fmt(margemMW/1000,0)+' mil por MW-ano não cobre capital, operação e reposição de um sistema desta natureza sem uma segunda fonte de receita.'; }
    else if(margemMW<600000)  { vd.className='verdict att'; t1='<b>Margem relevante e ainda insuficiente sozinha.</b> R$ '+fmt(margemMW/1000,0)+' mil por MW-ano é magnitude que entra na conta, mas não a fecha isoladamente.'; }
    else                      { vd.className='verdict att'; t1='<b>Margem elevada — e é o caso em que mais se erra.</b> R$ '+fmt(margemMW/1000,0)+' mil por MW-ano pressupõe que o spread informado se repita em '+fmt(cy,0)+' ciclos ao ano. Verifique com que frequência ele efetivamente ocorreu no histórico antes de aceitar o número.'; }

    var t2 = d>=4
      ? ' A duração de '+fmt(d,1)+' h atende o parâmetro mínimo de quatro horas consecutivas do produto contratado nos certames de dezembro de 2026.'
      : ' <b>Atenção de grandeza:</b> a duração de '+fmt(d,1)+' h não atende o mínimo de quatro horas consecutivas exigido no produto dos certames de dezembro de 2026 — o mesmo MW, com esta duração, é outro ativo.';

    vd.innerHTML = t1 + t2 + ' <b>Este instrumento recusa concluir por arbitragem isolada.</b> A margem acima é bruta: não incorpora o encargo de uso da rede, que desde junho de 2026 incide cumulativamente sobre a parcela de consumo e a de injeção, nem tributos, operação, reposição de células e custo de capital. Uma decisão exige pelo menos duas fontes de receita e a verificação de que elas são compatíveis — a mesma potência e o mesmo estado de carga não podem ser vendidos para obrigações incompatíveis.';
  }
  ['p','d','dod','rte','pc','pv','cy'].forEach(function(k){pair('ar-'+k+'-n','ar-'+k+'-r',upd);});
  upd();
}

/* ── m16-inst-06 · Rampa de medição avançada — corpo da IIFE, verbatim (L5312–L5356) ── */
function inst06($id, $all, segBind, segVal, pair, chips, bars) {
  if(!$id('am-vd'))return;
  function upd(){
    var uc = numOf($id('am-uc-n'),3000,10,30000);      /* mil UCs */
    var ro = numOf($id('am-ro-n'),2,0,10);
    var ra = numOf($id('am-ra-n'),0,0,15);
    var cp = numOf($id('am-cp-n'),550,100,1500);
    var hz = numOf($id('am-hz-n'),10,1,20);
    var rf = numOf($id('am-rf-n'),20,1,100);

    var ritmo = ro+ra;
    var cob   = Math.min(100, ritmo*hz);
    var ptAno = uc*ritmo/100;                 /* mil pontos por ano */
    var ptAcm = uc*cob/100;                   /* mil pontos acumulados */
    var capAno= ptAno*cp/1e6;                 /* R$ bilhões por ano */
    var capAcm= ptAcm*cp/1e6;                 /* R$ bilhões acumulados */
    var intens= capAno/rf*100;
    var anosT = ritmo>0 ? 100/ritmo : Infinity;

    $id('am-pa').innerHTML = fmt(ptAno,0)+'<span class="u">mil/ano</span>';
    $id('am-cb').innerHTML = fmt(cob,1)+'<span class="u">%</span>';
    $id('am-pt').innerHTML = fmt(ptAcm,0)+'<span class="u">mil pontos</span>';
    $id('am-ca').innerHTML = 'R$ '+fmt(capAno,2)+'<span class="u">bi/ano</span>';
    $id('am-cc').innerHTML = 'R$ '+fmt(capAcm,2)+'<span class="u">bi</span>';
    $id('am-at').innerHTML = isFinite(anosT)? fmt(anosT,1)+'<span class="u">anos</span>' : 'nunca';

    bars('am-bars',[
      {lb:'Cobertura no horizonte',pct:cob,vl:fmt(cob,1)+'%',cor:cob>=60?'var(--gr)':(cob>=20?'var(--gd)':'var(--rd)')},
      {lb:'Intensidade de capital anual',pct:clamp(intens,0,100),vl:fmt(intens,1)+'%',cor:'var(--cy)'},
      {lb:'Ritmo total aplicado',pct:clamp(ritmo/25*100,0,100),vl:fmt(ritmo,1)+'%/ano',cor:'var(--gd)'}
    ]);

    var vd=$id('am-vd'), a, b;
    if(cob>=99.99)   a='<b>Cobertura completa dentro do horizonte.</b> O ritmo de '+fmt(ritmo,1)+'% ao ano alcança a totalidade das '+fmt(uc,0)+' mil unidades em '+fmt(anosT,1)+' anos.';
    else if(cob>=60) a='<b>Cobertura ampla.</b> '+fmt(cob,1)+'% das unidades em '+fmt(hz,0)+' anos, e '+fmt(anosT,1)+' anos para a totalidade no mesmo ritmo.';
    else if(cob>=20) a='<b>Cobertura parcial.</b> '+fmt(cob,1)+'% das unidades em '+fmt(hz,0)+' anos. No ritmo obrigatório isolado de 2% ao ano, a cobertura total levaria 50 anos.';
    else             a='<b>Cobertura marginal.</b> '+fmt(cob,1)+'% das unidades em '+fmt(hz,0)+' anos não sustenta nenhuma afirmação sobre transformação do segmento.';

    if(intens>20)      { b=' <b>Intensidade de capital alta:</b> '+fmt(intens,1)+'% da referência anual de investimento declarada. Um programa desta magnitude disputa capital com todo o restante do plano de investimento.'; vd.className='verdict per'; }
    else if(intens>5)  { b=' <b>Intensidade de capital relevante:</b> '+fmt(intens,1)+'% da referência anual declarada.'; vd.className='verdict att'; }
    else               { b=' <b>Intensidade de capital baixa:</b> '+fmt(intens,1)+'% da referência anual declarada.'; vd.className='verdict ok'; }

    vd.innerHTML = a + b + ' <b>Este instrumento converte regra em quantidade e recusa avaliar mérito.</b> Cobertura e capital não dizem se o programa vale a pena — essa resposta depende da análise de custo-benefício, cuja metodologia foi remetida a processo regulatório próprio e cujo prazo de entrega pelas distribuidoras é 29 de fevereiro de 2028. Até lá, qualquer afirmação sobre retorno do programa é projeção de autor com interesse declarável.';
  }
  ['uc','ro','ra','cp','hz','rf'].forEach(function(k){pair('am-'+k+'-n','am-'+k+'-r',upd);});
  upd();
}

/* ── m16-inst-07 · Verificador de estado da política de carbono — corpo da IIFE, verbatim (L5451–L5526) ── */
function inst07($id, $all, segBind, segVal, pair, chips, bars) {
  if(!$id('cb-panel'))return;
  var L=[
    {k:'lei',n:'Lei do sistema de comércio de emissões',y:'12/12/2024',est:'vige',
     e:'Em vigor na data da publicação',
     d:'A lei instituiu o sistema, definiu os ativos, a governança em três instâncias, os patamares de emissão e o período transitório de cinco fases. Entrou em vigor na data da publicação — informação que parece formalidade e é a que permite contar todos os prazos.',
     q:'Qual dispositivo você está citando, e ele depende de ato do órgão gestor para produzir efeito?'},
    {k:'f1',n:'Prazo original da fase I',y:'12/12/2025',est:'venc',
     e:'Prazo legal vencido',
     d:'Doze meses contados da entrada em vigor para a edição da regulamentação. Venceu em 12 de dezembro de 2025 sem que a regulamentação estivesse completa. Este é o quarto estado de política, e ele está expressamente presente aqui.',
     q:'O vencimento produziu alguma consequência jurídica, ou a lei previa a própria prórroga?'},
    {k:'f1p',n:'Prórroga da fase I',y:'até 12/12/2026',est:'anun',
     e:'Prazo futuro em curso',
     d:'A lei previu prórroga por mais doze meses. O sistema opera dentro dela, e ela se esgota em 12 de dezembro de 2026. A pergunta correta a um interlocutor deixa de ser "quando começa?" e passa a ser "o que precisa estar publicado até dezembro, e o que acontece se não estiver?".',
     q:'Quais atos infralegais faltam para que a fase I se considere cumprida?'},
    {k:'sec',n:'Secretaria com competências de órgão gestor',y:'16/10/2025',est:'vige',
     e:'Em vigor, em caráter de fase inicial',
     d:'Decreto criou secretaria extraordinária vinculada à pasta fazendária, que assumiu as competências de órgão gestor para organizar, planejar e coordenar a fase inicial de implementação. É arranjo provisório por construção.',
     q:'A secretaria exerce as competências sancionatória e recursal previstas em lei, ou apenas as normativas e executivas?'},
    {k:'og',n:'Órgão gestor permanente',y:'meta até 12/2026',est:'teto',
     e:'Inexistente',
     d:'A lei desenha o órgão gestor como instância executora com competência normativa, regulatória, executiva, sancionatória e recursal. Ele não está constituído. A elaboração da proposta de governo para criá-lo consta como meta até dezembro de 2026.',
     q:'A criação exige lei, e portanto tramitação legislativa, ou basta ato do Poder Executivo?'},
    {k:'ctcp',n:'Comitê técnico consultivo permanente',y:'11/05/2026',est:'vige',
     e:'Instituído e deliberando',
     d:'Decreto de 2025 instituiu o comitê consultivo, e suas primeiras resoluções estão em vigor desde 11 de maio de 2026. O comitê inclui câmara de assuntos regulatórios composta por entidades representativas dos setores regulados, cuja oitiva é obrigatória para parte das competências normativas.',
     q:'A oitiva da câmara de assuntos regulatórios é obrigatória ou facultativa para o ato que você está analisando?'},
    {k:'cob',n:'Cobertura setorial',y:'19/05/2026',est:'anun',
     e:'Proposta preliminar, não norma',
     d:'Proposta preliminar delimitando quais segmentos econômicos estarão sujeitos às obrigações, apresentada ao comitê consultivo, com critérios de intensidade de emissões, estrutura de mercado, viabilidade de mensuração, exposição ao comércio exterior e capacidade operacional do futuro órgão gestor.',
     q:'Este documento é proposta ou norma? E ele passou por consulta pública com versão final publicada?'},
    {k:'mrv',n:'Etapas de mensuração, relato e verificação',y:'até 28/08/2026',est:'anun',
     e:'Consulta pública aberta',
     d:'Minuta define as etapas de implementação das obrigações de mensuração, relato e verificação, com início de monitoramento para alguns setores previsto para 2027. Contribuições até 28 de agosto de 2026. É o marco verificável mais próximo deste tema.',
     q:'A minuta em consulta fixa datas por setor, ou remete a ato posterior?'},
    {k:'reg',n:'Registro central',y:'desde 01/2026',est:'anun',
     e:'Em desenvolvimento',
     d:'Plataforma digital que deve receber informações de emissões e remoções, assegurar a contabilidade dos ativos e rastrear transações. Sem inscrição no registro, não há ativo reconhecido no sistema — o que torna o desenvolvimento dele condição de existência do mercado.',
     q:'Há data de entrada em operação publicada, ou apenas informação de que o desenvolvimento começou?'},
    {k:'pat',n:'Patamares de 10 mil e 25 mil toneladas',y:'previstos em lei',est:'teto',
     e:'Previstos, dependentes de ato',
     d:'Acima de 10 mil toneladas anuais, plano de monitoramento e relato; acima de 25 mil, acrescenta-se conciliação periódica. Os patamares podem ser majorados por ato do órgão gestor, e as obrigações só se aplicam a atividades com metodologias consolidadas.',
     q:'A atividade que você analisa tem metodologia consolidada definida? Sem ela, a obrigação não se aplica.'},
    {k:'agro',n:'Exclusão da produção primária agropecuária',y:'12/12/2024',est:'vige',
     e:'Em vigor',
     d:'A produção primária agropecuária, e os bens, benfeitorias e infraestrutura no interior de imóveis rurais a ela diretamente associados, não são considerados atividades, fontes ou instalações reguladas e não se submetem às obrigações do sistema.',
     q:'A instalação analisada é produção primária, ou é processamento industrial de produto agropecuário? A fronteira decide a aplicação.'},
    {k:'seg',n:'Obrigação do setor segurador em ativos ambientais',y:'desde a vigência',est:'vige',
     e:'Em vigor e correndo',
     d:'A lei determina que sociedades seguradoras, entidades abertas de previdência complementar, sociedades de capitalização e resseguradores locais adquiram, observado o mínimo de 1% ao ano dos recursos de suas reservas técnicas e provisões, ativos ambientais ou cotas de fundos de investimento em ativos ambientais — cumprindo a obrigação a partir do ano de entrada em vigor da lei.',
     q:'Esta é a obrigação menos citada da lei e uma das poucas já correndo. Ela está no seu mapa de agentes alcançados?'},
    {k:'trib',n:'Vedação de tributação sobre emissões reguladas',y:'12/12/2024',est:'vige',
     e:'Em vigor',
     d:'A lei veda expressamente a dupla regulação institucional e qualquer tributação sobre emissões de gases de efeito estufa por atividades, instalações ou fontes reguladas pelo sistema. É a resposta jurídica à pergunta "isso vira imposto?".',
     q:'A veda&ccedil;ão alcança apenas fontes reguladas — e as não reguladas? Verifique o perímetro antes de generalizar.'},
    {k:'val',n:'Ativos como valores mobiliários',y:'12/12/2024',est:'vige',
     e:'Em vigor',
     d:'Os ativos do sistema e os créditos de carbono, quando negociados no mercado financeiro e de capitais, são valores mobiliários sujeitos ao regime próprio. Admite-se colocação privada fora desse mercado, e nesse caso sem sujeição à regulamentação da autarquia de valores mobiliários.',
     q:'A operação analisada é negociação em mercado organizado ou colocação privada? O regime aplicável muda.'},
    {k:'mkt',n:'Mercado de ativos e primeiro plano de alocação',y:'previsto para 2030',est:'teto',
     e:'Anunciado com data indicativa',
     d:'O roteiro oficial prevê instrumentos de relato em 2027, monitoramento obrigatório em 2028 e 2029, e primeiro plano nacional de alocação com distribuição não onerosa e implementação do mercado de ativos em 2030, com plena operação depois.',
     q:'A data é indicativa de roteiro ou está fixada em norma? E de que ato ela depende para se confirmar?'}
  ];
  var CLS={vige:'vige',venc:'venc',anun:'anun',teto:'teto'};
  function painel(k){
    var o=L.filter(function(x){return x.k===k;})[0];
    return '<div class="tl-panel"><div class="yr">'+esc(o.y)+'</div>'+
      '<div class="ti">'+esc(o.n)+'</div>'+
      '<div class="est"><span class="'+CLS[o.est]+'">'+esc(o.e)+'</span></div>'+
      '<div class="bd2">'+esc(o.d)+'</div>'+
      '<div class="lg"><b>A pergunta que você faz</b>'+o.q+'</div></div>';
  }
  chips('cb-chips',L.map(function(o){return {k:o.k,n:o.n,y:o.y};}),'c',function(k){
    $id('cb-panel').innerHTML=painel(k);
  });
  $id('cb-panel').innerHTML=painel(L[0].k);
}

/* ── m16-inst-08 · Calculadora de escopo 2 — os dois métodos lado a lado — corpo da IIFE, verbatim (L5363–L5401) ── */
function inst08($id, $all, segBind, segVal, pair, chips, bars) {
  if(!$id('e2-vd'))return;
  function upd(){
    var cs = numOf($id('e2-cs-n'),120,0.1,5000);        /* GWh */
    var fm = numOf($id('e2-fm-n'),0.080,0.01,0.60);
    var fr = numOf($id('e2-fr-n'),0.120,0.01,0.80);
    var at = numOf($id('e2-at-n'),0,0,100)/100;
    var fi = numOf($id('e2-fi-n'),0,0,0.60);
    var met= segVal('e2-mt','data-m')||'loc';

    var MWh = cs*1000;
    var loc = MWh*fm;
    var mkt = MWh*(1-at)*fr + MWh*at*fi;
    var dif = loc-mkt;
    var raz = loc>0 ? mkt/loc : 0;

    $id('e2-loc').innerHTML = fmt(loc,0)+'<small>tCO2e</small>';
    $id('e2-mkt').innerHTML = fmt(mkt,0)+'<small>tCO2e</small>';
    $id('e2-locm').textContent = 'Consumo integral a '+fmt(fm,3)+' tCO2e/MWh, o fator médio da rede no período.';
    $id('e2-mktm').textContent = fmt((1-at)*100,0)+'% do consumo ao fator residual de '+fmt(fr,3)+' e '+fmt(at*100,0)+'% ao fator do instrumento contratado, de '+fmt(fi,3)+'.';
    $id('e2-df').innerHTML  = fmt(dif,0)+'<span class="u">tCO2e</span>';
    $id('e2-rz').innerHTML  = fmt(raz,2)+'<span class="u">×</span>';
    $id('e2-cb').innerHTML  = fmt(MWh*at,0)+'<span class="u">MWh</span>';
    $id('e2-fis').innerHTML = '0<span class="u">tCO2e alterada</span>';

    var vd=$id('e2-vd'), t;
    if(raz<0.25)      { vd.className='verdict per'; t='<b>O método de mercado reporta menos de um quarto do método de localização.</b> Uma divergência desta magnitude é quase sempre efeito de cobertura contratual alta com fator de instrumento próximo de zero — e é exatamente o caso em que citar apenas um dos dois números induz o leitor a erro.'; }
    else if(raz<0.9)  { vd.className='verdict att'; t='<b>Diferença material entre os métodos.</b> '+fmt(dif,0)+' tCO2e separam os dois números, e os dois estão corretos dentro do seu método. Um relatório que informe apenas um deles está incompleto, não errado.'; }
    else if(raz<=1.1) { vd.className='verdict ok';  t='<b>Métodos convergentes.</b> Com esta combinação de fatores e cobertura, os dois números ficam próximos — o que ocorre tipicamente quando a cobertura contratual é baixa e o fator residual se aproxima do fator médio.'; }
    else              { vd.className='verdict att'; t='<b>O método de mercado reporta mais que o de localização.</b> Isso não é anomalia: acontece quando o fator residual excede o fator médio, o que é o normal onde parte relevante dos atributos de baixa emissão já foi reivindicada por terceiros. É o caso que desmonta a ideia de que o método de mercado sempre favorece o relator.'; }

    var extra = (met==='mkt')
      ? ' <b>Nota sobre o método em discussão:</b> aplicar o fator médio, em vez do residual, ao consumo não coberto por instrumento contratual subestima sistematicamente a emissão de quem não contratou atributo — e é o atalho mais comum onde o fator residual não é publicado oficialmente, que é o caso brasileiro.'
      : ' <b>Nota sobre o método em discussão:</b> o fator médio da rede brasileira é baixo e volátil por hidrologia. Uma queda no número reportado entre dois anos pode significar apenas que choveu mais — e não que a empresa mudou alguma coisa.';

    vd.innerHTML = t + extra + ' <b>E a recusa central deste instrumento:</b> a diferença de '+fmt(Math.abs(dif),0)+' tCO2e entre os dois métodos <b>não é redução física de emissão</b>. A rede emitiu exatamente o mesmo. Um número mede a alegação contratual de uma empresa; o outro mede a física de um sistema — e os dois são verdadeiros.';
  }
  ['cs','fm','fr','at','fi'].forEach(function(k){pair('e2-'+k+'-n','e2-'+k+'-r',upd);});
  segBind('e2-mt',upd);
  upd();
}

/* ── m16-inst-09 · Decompositor de demanda de centro de dados — corpo da IIFE, verbatim (L5408–L5446) ── */
function inst09($id, $all, segBind, segVal, pair, chips, bars) {
  if(!$id('dc-vd'))return;
  function upd(){
    var ti = numOf($id('dc-ti-n'),100,1,1000);
    var pue= numOf($id('dc-pue-n'),1.30,1.05,2.00);
    var fc = numOf($id('dc-fc-n'),90,10,100)/100;
    var sol= numOf($id('dc-sol-n'),200,1,3000);
    var rp = numOf($id('dc-rp-n'),4,0.5,10);
    var rf = numOf($id('dc-ref-n'),939,300,1200);

    var cm  = ti*pue*fc;              /* MW médios */
    var pn  = ti*pue;                 /* MW de conexão sem utilização */
    var ea  = cm*8.76;                /* GWh por ano */
    var raz = cm>0 ? sol/cm : 0;
    var sh  = (ea/1000)/rf*100;
    var a1  = rp>=1 ? cm/rp : cm;

    $id('dc-cm').innerHTML = fmt(cm,1)+'<span class="u">MW</span>';
    $id('dc-pn').innerHTML = fmt(pn,1)+'<span class="u">MW</span>';
    $id('dc-ea').innerHTML = fmt(ea,0)+'<span class="u">GWh/ano</span>';
    $id('dc-rz').innerHTML = fmt(raz,2)+'<span class="u">×</span>';
    $id('dc-sh').innerHTML = fmt(sh,3)+'<span class="u">%</span>';
    $id('dc-a1').innerHTML = fmt(a1,1)+'<span class="u">MW</span>';

    bars('dc-bars',[
      {lb:'Carga média sobre o solicitado',pct:clamp(cm/Math.max(sol,0.001)*100,0,100),vl:fmt(cm,0)+' de '+fmt(sol,0)+' MW',cor:'var(--cy)'},
      {lb:'Infraestrutura sobre tecnologia da informação',pct:clamp((pue-1)*100,0,100),vl:fmt((pue-1)*100,0)+'%',cor:'var(--gd)'},
      {lb:'Participação no consumo de referência',pct:clamp(sh/6*100,0,100),vl:fmt(sh,3)+'%',cor:'var(--gr)'}
    ]);

    var vd=$id('dc-vd'), t;
    if(raz<1.2)      { vd.className='verdict ok';  t='<b>Pedido próximo da carga.</b> Razão de '+fmt(raz,2)+'× entre potência solicitada e carga média: um pedido dimensionado com pouca folga, o que é incomum e merece verificação — pode indicar ausência de redundância ou de espaço para expansão.'; }
    else if(raz<=2)  { vd.className='verdict ok';  t='<b>Folga usual.</b> Razão de '+fmt(raz,2)+'× entre solicitado e carga média é compatível com redundância de projeto e rampa de ocupação. Continua sendo folga, e não carga.'; }
    else if(raz<=5)  { vd.className='verdict att'; t='<b>Folga grande.</b> Razão de '+fmt(raz,2)+'× entre solicitado e carga média excede o que redundância e rampa costumam justificar. Verifique se o mesmo projeto solicitou acesso em mais de um ponto de conexão.'; }
    else             { vd.className='verdict per'; t='<b>O pedido não descreve carga.</b> Razão de '+fmt(raz,2)+'× entre solicitado e carga média. Nesta faixa, o número informa pressão sobre um processo administrativo — não demanda futura.'; }

    vd.innerHTML = t + ' <b>Os cinco números deste empreendimento, separados:</b> solicitado '+fmt(sol,0)+' MW; potência de conexão necessária pela carga instalada '+fmt(pn,1)+' MW; carga média em regime '+fmt(cm,1)+' MW; carga média no primeiro ano da rampa '+fmt(a1,1)+' MW; e energia anual em regime de '+fmt(ea,0)+' GWh, ou '+fmt(sh,3)+'% do consumo de referência declarado. <b>Apenas o penúltimo e o último descrevem consumo</b>, e nenhum deles é o número que circula publicamente. Este instrumento não projeta mercado e não conclui que a demanda vai crescer — separa os números e devolve qual deles o interlocutor está usando.';
  }
  ['ti','pue','fc','sol','rp','ref'].forEach(function(k){pair('dc-'+k+'-n','dc-'+k+'-r',upd);});
  upd();
}

/* ── m16-inst-10 · Grade de mapeamento de posicionamento — corpo da IIFE, verbatim (L5531–L5585) ── */
function inst10($id, $all, segBind, segVal, pair, chips, bars) {
  if(!$id('gp-out'))return;
  var ELO={fab:'Fabricação e fornecimento',ins:'Instalação e integração',ope:'Operação e serviço',
           fin:'Financiamento',dad:'Domínio do dado'};
  var GP={
   ele:{
    fab:{c:'Capacidade produtiva instalada de veículo, de conversor ou de equipamento de recarga, com conteúdo local suficiente diante do regime de importação vigente.',q:['Qual a capacidade nominal de produção da planta, e quantas unidades saíram dela nos últimos doze meses?','Qual o percentual de conteúdo local por componente crítico, e ele é auditado por quem?','Qual a exposição da linha a componente importado sujeito a alíquota, em percentual do custo?']},
    ins:{c:'Engenharia elétrica de baixa e média tensão, relação com a distribuidora e capacidade de executar obra de conexão em prazo comercial.',q:['Quantos pontos foram energizados nos últimos doze meses, e qual o prazo médio entre contrato e energização?','Qual o percentual de obras que exigiram reforço de rede, e qual o atraso médio nesses casos?','Qual a taxa de retrabalho por não conformidade em comissionamento?']},
    ope:{c:'Rede de pontos com localização de alto giro, plataforma de pagamento e acordo de itinerância, e capacidade de manter disponibilidade.',q:['Qual a energia entregue por ponto nos últimos doze meses, e qual a dispersão entre o melhor e o pior decil?','Qual o tempo de indisponibilidade acumulado por ponto no período?','Qual a margem por MWh depois de energia, encargos, perdas e meios de pagamento?']},
    fin:{c:'Custo de capital compatível com ativo de utilização baixa nos primeiros anos e capacidade de estruturar garantia sobre recebível difuso.',q:['Qual a taxa de inadimplência da carteira de financiamento de veículo elétrico contra a de veículo a combustão?','Qual o valor residual assumido, e ele é calibrado contra transações observadas ou contra premissa?','Qual o prazo médio de financiamento contra a vida útil declarada da bateria?']},
    dad:{c:'Base de sessões de recarga, curva de uso por localização e histórico de disponibilidade — insumo de precificação e de expansão.',q:['Quantas sessões por mês, com que granularidade de energia, potência e horário?','O dado da sessão é próprio ou vem de plataforma de terceiro, e quem detém o direito de uso?','O histórico permite estimar utilização de um ponto novo antes de instalá-lo?']}},
   arm:{
    fab:{c:'Produção de célula, de módulo, de conversor ou montagem de sistema, com credenciamento que habilite ao produto com exigência de nacionalização.',q:['A empresa está credenciada no sistema que habilita ao produto com conteúdo local, e desde quando?','Qual a capacidade produtiva em MWh por ano, e quanto disso é produção operante contra capacidade anunciada?','A origem das células é própria ou importada, e qual a exposição a política comercial?']},
    ins:{c:'Engenharia de conexão, proteção e comissionamento em média e alta tensão, com capacidade de atender requisitos de supervisão e controle.',q:['Quantos MW foram comissionados, em quais níveis de tensão, e com qual prazo médio?','A empresa já entregou sistema com os requisitos de controle exigidos no produto do certame?','Qual a taxa de indisponibilidade nos primeiros doze meses dos sistemas entregues?']},
    ope:{c:'Sistema de gestão de energia que respeite exclusividade contratual, e competência em mercado de curto prazo.',q:['O sistema de gestão reserva capacidade para a obrigação contratada antes de otimizar as demais receitas?','Qual a disponibilidade medida contra a contratada, e como a indisponibilidade é registrada?','Qual a política de estado de carga entre obrigação contratada e oportunidade de mercado?']},
    fin:{c:'Custo de capital compatível com receita fixa de quinze anos e capacidade de precificar risco de degradação e de reposição.',q:['Qual a curva de degradação assumida, e ela vem de garantia de fabricante ou de dado próprio de operação?','O modelo incorpora a incidência do encargo de rede sobre consumo e sobre injeção?','Qual a premissa de reposição de células, em que ano e a que custo?']},
    dad:{c:'Histórico próprio de operação, degradação e disponibilidade — a única barreira deste setor que se acumula com o tempo.',q:['Há quantos anos de operação medida em condições brasileiras, e em quantos sítios?','O dado de degradação é por célula, por módulo ou por sistema? Os três divergem.','O histórico permite prever indisponibilidade antes que ela ocorra?']}},
   med:{
    fab:{c:'Produção de medidor e de módulo de comunicação em conformidade com os requisitos mínimos que ainda estão em consulta.',q:['A linha de produto atende a proposta em consulta, ou exigirá redesenho quando a norma sair?','Qual a capacidade de fornecimento anual contra o ritmo obrigatório de 2% ao ano do mercado atendido?','Qual o histórico de aprovação em ensaio de conformidade metrológica?']},
    ins:{c:'Capacidade logística de troca em campo em volume, com gestão de estoque reverso e relacionamento com o consumidor.',q:['Quantas trocas por mês a operação sustenta, e qual a taxa de visita improdutiva?','Qual o percentual de pontos que passam a comunicar efetivamente após a troca?','Qual o custo por ponto instalado, discriminado entre equipamento, mão de obra e sistema?']},
    ope:{c:'Operação de sistema de gestão de dados de medição integrado a faturamento, atendimento e operação da rede.',q:['Qual o percentual de leituras válidas por ciclo, e qual o percentual de leitura estimada?','Qual o tempo entre a medição e a disponibilização ao consumidor?','O sistema registra evento de qualidade e de interrupção, ou apenas consumo?']},
    fin:{c:'Capacidade de sustentar investimento cuja recuperação depende de decisão regulatória ainda pendente.',q:['A análise de custo-benefício está estruturada, e qual o horizonte assumido?','Quais benefícios foram contabilizados, e há dupla contagem entre redução de perdas e redução de leitura?','Qual a hipótese sobre recuperação tarifária, e o que acontece se ela mudar?']},
    dad:{c:'Curva de consumo em intervalos curtos — insumo simultâneo de faturamento, de operação, de dado pessoal e de serviço comercial.',q:['Quem detém o direito de uso do dado, e sob qual base legal de tratamento?','Em que prazo e formato o dado é disponibilizado ao consumidor titular?','Há segregação entre o uso regulado e o uso comercial do mesmo dado?']}},
   agr:{
    fab:{c:'Fornecimento de inversor, controlador e equipamento de telemetria com capacidade de resposta a comando externo.',q:['O equipamento aceita comando externo com que latência e por qual protocolo?','Qual a base instalada compatível com comando, e não apenas com leitura?','A atualização de firmware é remota e assinada?']},
    ins:{c:'Capacidade de conectar e comissionar telemetria em muitos pontos pequenos, com custo unitário baixo.',q:['Qual o custo de conexão por recurso agregado, e ele cai com escala?','Qual a taxa de recursos que efetivamente respondem a comando após a instalação?','Qual o prazo entre a adesão do titular e a disponibilidade do recurso?']},
    ope:{c:'Capacidade de garantir entrega agregada apesar da variabilidade individual, e de medir contra linha de base.',q:['Qual a taxa de entrega efetiva contra a comprometida nos eventos ocorridos?','Qual a metodologia de linha de base usada, e ela é auditável por terceiro?','Qual a taxa de desistência de titulares por período?']},
    fin:{c:'Capacidade de assumir risco de não entrega e de remunerar o titular do recurso antes de receber pelo serviço.',q:['Quem assume a penalidade por não entrega — o agregador ou o titular do recurso?','Qual o prazo entre a prestação do serviço e o recebimento, e quem financia o intervalo?','O contrato com o titular remunera disponibilidade ou apenas acionamento?']},
    dad:{c:'Telemetria contínua de muitos recursos — a base sobre a qual toda a economia da agregação se apoia.',q:['Qual a granularidade e a latência da telemetria, e qual o percentual de falha de comunicação?','O dado permite reconstruir a linha de base contrafactual de cada recurso?','Quem detém o dado quando o titular encerra o contrato?']}},
   car:{
    fab:{c:'Não há elo de fabricação neste tema. O equivalente é a originação de projeto que gere ativo elegível.',q:['A metodologia usada é credenciável no sistema, ou é exclusiva do mercado voluntário?','O projeto passa nos testes de adicionalidade, permanência e vazamento com documento, e não com narrativa?','Há autorização prévia para transferência internacional, quando aplicável?']},
    ins:{c:'Implantação de sistemas de mensuração, coleta e controle interno de dados de emissão na instalação do operador.',q:['O inventário cobre quais fontes, com que fatores, e ele é reconciliável com o consumo medido?','Os dados de produção e de energia estão no mesmo perímetro do inventário?','O sistema suporta auditoria por organismo de avaliação de conformidade?']},
    ope:{c:'Verificação independente acreditada e gestão de posição de ativos ao longo do período de compromisso.',q:['O verificador tem acreditação reconhecida, e para qual escopo setorial?','Qual a capacidade de verificação em número de operadores por ano?','Há segregação entre consultoria de inventário e verificação do mesmo cliente?']},
    fin:{c:'Capacidade de precificar risco regulatório sobre ativo cujo teto, cobertura e alocação ainda não existem.',q:['A tese de investimento depende de preço, e o preço depende de qual ato ainda não publicado?','Há exposição a mudança de metodologia que descredencie ativos já adquiridos?','O custo marginal de abatimento próprio foi calculado, e contra qual curva?']},
    dad:{c:'Série própria de emissões por processo e por produto, reconciliada com produção — a base de qualquer posição futura.',q:['Há quantos anos de inventário auditado, e sob qual metodologia?','A intensidade de emissão por unidade produzida é comparável entre anos, ou o perímetro mudou?','O dado suporta simulação de alocação sob diferentes tetos?']}},
   dcs:{
    fab:{c:'Fornecimento de equipamento elétrico, de refrigeração e de infraestrutura de alta densidade.',q:['Qual a capacidade de fornecimento em MW por ano, e qual o prazo de entrega corrente?','O equipamento atende a densidade exigida por cargas de treinamento de modelos?','Qual a exposição a componente sujeito a restrição de comércio internacional?']},
    ins:{c:'Construção e comissionamento de instalação crítica em prazo, com engenharia de conexão em alta tensão.',q:['Quantos MW foram comissionados nos últimos vinte e quatro meses, e com qual desvio de prazo?','A empresa já executou obra de conexão em rede básica, e com que interface com o operador?','Qual a taxa de não conformidade em comissionamento de sistema crítico?']},
    ope:{c:'Operação com acordo de nível de serviço, gestão térmica e hídrica, e ocupação comercial que sustente a rampa.',q:['Qual a eficiência de uso de energia medida — e não projetada — nos últimos doze meses?','Qual o percentual de ocupação contratada contra a capacidade energizada?','Qual o consumo de água por MWh, e sob qual outorga?']},
    fin:{c:'Capacidade de financiar ativo de capital intensivo cuja receita depende de cliente âncora e cuja rampa dura anos.',q:['Há cliente âncora contratado, com que prazo e que percentual da capacidade?','O modelo assume qual curva de ocupação, e ela é calibrada contra projetos comparáveis?','Qual a hipótese sobre o regime tributário, e o que muda se ele não for aprovado?']},
    dad:{c:'Dados de consumo, densidade térmica e comportamento de carga de trabalho — insumo de eficiência e de eventual flexibilidade.',q:['O consumo é medido por sala, por fileira ou por instalação? Os três permitem análises diferentes.','Há registro de carga de trabalho por tipo, que permita identificar o que é deslocável?','Qual a granularidade temporal do dado de consumo disponível ao próprio operador?']}}
  };
  function render(){
    var t=segVal('gp-tnd','data-t')||'ele';
    var e=segVal('gp-elo','data-e')||'fab';
    var o=GP[t][e];
    $id('gp-out').innerHTML=
      '<div class="tl-panel"><div class="yr">'+esc(TND[t].n)+' &middot; '+esc(ELO[e])+'</div>'+
      '<div class="ti">Capacidade exigida para ocupar este elo</div>'+
      '<div class="bd2">'+esc(o.c)+'</div>'+
      '<div class="lg"><b>Três perguntas de verificação — resposta em documento, número ou data</b>'+
      '<ol style="margin:0 0 0 18px;padding:0">'+o.q.map(function(x){return '<li style="margin-bottom:6px">'+esc(x)+'</li>';}).join('')+'</ol></div></div>'+
      '<div class="box rd" style="margin-top:14px"><span class="tag">O que este painel não faz</span>'+
      '<p>Não nomeia ocupante deste elo e não diz se alguém está bem ou mal posicionado. Entrega a capacidade exigida e as perguntas que a verificam. O preenchimento com nomes é conversa de análise, não ativo publicado — decisão declarada no &sect;00.6.</p></div>';
  }
  segBind('gp-tnd',render); segBind('gp-elo',render); render();
}

/* ── m16-inst-11 · Verificador de estágio e de gargalo — corpo da IIFE, verbatim (L5590–L5687) ── */
function inst11($id, $all, segBind, segVal, pair, chips, bars) {
  if(!$id('vf-panel'))return;
  var E=[
   {k:'e1',f:'A',t:'38 GW em acesso',
    en:'"O Brasil tem 38 GW de projetos de centros de dados pedindo acesso à rede — mais de um terço da carga média projetada do país para 2035."',
    df:'Estágio confundido',
    fa:'A frase é verdadeira e a comparação é aritmeticamente correta. Falta declarar que 38 GW é o primeiro degrau de uma escada de cinco — potência solicitada em pedido de parecer, e não potência contratada, energizada ou consumida. E falta declarar que a carga média projetada é do quinto degrau.',
    pq:'Destes 38 GW, quantos têm parecer emitido, quantos têm contrato de uso assinado e quantos estão energizados?',
    ok:'"Foram protocolados pedidos de parecer de acesso somando 38 GW para projetos de centros de dados, informação ministerial de junho de 2026. Solicitação não é carga: o custo de protocolar é próximo de zero e um mesmo projeto pode solicitar em mais de um ponto. O número informa pressão sobre a fila de acesso, e não demanda futura."'},
   {k:'e2',f:'A',t:'Leilão de baterias',
    en:'"Com o primeiro leilão de armazenamento, o Brasil passou a ter um marco regulatório para baterias."',
    df:'Estágio confundido',
    fa:'Inverte a ordem dos fatos e atribui ao evento futuro o efeito de um ato já ocorrido. O marco regulatório — outorga, acesso, cobrança pelo uso da rede e regime de penalidades — foi publicado em 24 de junho de 2026 e vale independentemente do certame. Os certames estão marcados para dezembro de 2026 e não ocorreram.',
    pq:'O marco a que você se refere é a norma de junho ou o resultado do certame? Os dois têm datas e efeitos diferentes.',
    ok:'"Duas resoluções normativas publicadas em 24/06/2026 criaram o regime de outorga e de acesso para sistemas de armazenamento. Os dois certames de reserva de capacidade estão marcados para 2 e 4 de dezembro de 2026, com suprimento a partir de agosto de 2028 — sem resultado e sem preço conhecidos."'},
   {k:'e3',f:'A',t:'Capacidades somadas',
    en:'"Somando o armazenamento que será contratado nos leilões, o já instalado atrás do medidor e o anunciado por fabricantes, chega-se à capacidade do país."',
    df:'Estágio confundido',
    fa:'Soma três posições diferentes da régua: anunciado com data, em operação e projeção de parte interessada. Capacidades de estágios diferentes não têm a mesma probabilidade de existir, e o total não descreve nada — nem o presente nem o futuro.',
    pq:'Qual a probabilidade de realização de cada parcela? Se você não sabe, por que somou?',
    ok:'"Há três números distintos e não somáveis: a capacidade que será contratada nos certames de dezembro, ainda desconhecida; a capacidade atrás do medidor em operação, cuja contagem consolidada não é publicada; e capacidades anunciadas por fabricantes, que são projeção de parte interessada."'},
   {k:'e4',f:'B',t:'Bateria e custo',
    en:'"O armazenamento no Brasil vai deslanchar quando o custo da bateria cair mais um pouco."',
    df:'Gargalo não identificado',
    fa:'Nomeia maturidade tecnológica e custo de equipamento como restrição, quando o candidato que vincula é o sinal econômico: existe uma fonte de receita contratada e nenhum mercado organizado para as demais, e a cobrança pelo uso da rede passou a incidir cumulativamente sobre consumo e injeção.',
    pq:'Se o equipamento fosse dado de graça, quantas fontes de receita o ativo teria? A resposta não muda com o custo.',
    ok:'"O gargalo vinculante do armazenamento em escala de sistema é o sinal econômico. A regra deixou de vincular em junho de 2026. O que falta é produto de mercado para arbitragem e serviços ancilares, e definição de como o encargo de rede incide sobre um ativo que consome e injeta."'},
   {k:'e5',f:'B',t:'Medição e tecnologia',
    en:'"A medição inteligente no Brasil depende de a tecnologia amadurecer e de os medidores baratearem."',
    df:'Gargalo não identificado',
    fa:'Medidor, telecomunicação e sistema de gestão de dados são tecnologias maduras e disponíveis, e o ritmo obrigatório de 2% ao ano é modesto diante da capacidade de fornecimento. Vincula a regra habilitante: existe obrigação de instalar em vigor desde março de 2026 e não existe definição final do que instalar.',
    pq:'Existe hoje algum requisito técnico que o mercado fornecedor não consiga atender? Se não, o gargalo não é tecnológico.',
    ok:'"O gargalo vinculante da medição avançada é a regra habilitante. A obrigação de instalar corre desde 1º/03/2026; a norma de requisitos mínimos está em consulta até 14/08/2026; e a metodologia de custo-benefício foi remetida a processo próprio, com prazo de entrega em 2028."'},
   {k:'e6',f:'B',t:'Cinco desafios',
    en:'"Os cinco principais desafios da agregação de recursos distribuídos são tecnologia, regulação, tarifa, escala e cibersegurança."',
    df:'Gargalo não identificado',
    fa:'Lista candidatos sem hierarquia e sem dizer qual vincula. Relaxar uma restrição folgada não altera trajetória: investir em tecnologia de agregação enquanto falta a figura do agregador gasta recurso sem mover a curva.',
    pq:'Qual desses cinco, se resolvido isoladamente amanhã, mudaria a trajetória? E quais explicitamente não mudariam?',
    ok:'"Vincula a regra habilitante: faltam três definições sem as quais não há contrato possível — quem comanda, quem responde pela não entrega, e contra qual linha de base se mede. Tecnologia e cadeia de suprimento não vinculam; o sinal econômico é inseparável da regra e precisa sair junto com ela."'},
   {k:'e7',f:'C',t:'Frota e demanda',
    en:'"Os veículos eletrificados passaram de 9% para 16% das vendas em um ano. O impacto na rede será enorme."',
    df:'Carga não convertida',
    fa:'A participação está correta e não foi convertida em nada. Falta separar tomada de rótulo — 22,3% dos "eletrificados" não consomem da rede — e falta a conversão em energia e em potência coincidente. Sem isso, "enorme" não descreve grandeza nenhuma.',
    pq:'Quantos MWh por ano e quantos MW coincidentes? E a carga acrescentada é rígida ou flexível?',
    ok:'"Dos 215.023 leves eletrificados do primeiro semestre de 2026, 167.026 têm tomada. A projeção oficial leva o consumo da eletromobilidade de 627 GWh em 2025 a 7,8 TWh em 2035 — 0,83% do consumo projetado no cenário de referência. O efeito relevante é de potência local, e depende do perfil de recarga."'},
   {k:'e8',f:'C',t:'Carbono e demanda elétrica',
    en:'"Com o mercado de carbono, a indústria vai eletrificar processos e a demanda por eletricidade vai crescer."',
    df:'Carga não convertida',
    fa:'A cadeia causal é plausível e nenhum elo dela foi quantificado. Falta dizer qual preço de carbono torna a eletrificação competitiva em qual processo, quantos MW isso significa e em que horizonte — e falta declarar que o preço não existe porque não existe teto, cobertura final nem alocação.',
    pq:'A que preço por tonelada a substituição fecha, em qual processo, e quantos MW isso acrescenta?',
    ok:'"O sistema altera o custo relativo entre rotas tecnológicas e, por essa via, pode deslocar decisões de investimento na direção da eletrificação. O efeito sobre carga é indireto e mediado por um preço que ainda não existe: não há teto, cobertura setorial final nem plano de alocação."'},
   {k:'e9',f:'C',t:'Bateria e rede',
    en:'"Uma bateria de 100 MW atende cem mil residências."',
    df:'Carga não convertida',
    fa:'Cita potência e conclui sobre atendimento, que é energia ao longo do tempo. Falta a duração: 100 MW com uma hora e 100 MW com quatro horas atendem por períodos inteiramente diferentes. E falta a profundidade de descarga e a eficiência de ciclo, que reduzem a energia utilizável.',
    pq:'Cem mil residências por quantas horas? Qual a duração, a profundidade de descarga e a eficiência de ciclo?',
    ok:'"Um sistema de 100 MW e quatro horas armazena 400 MWh nominais. Com profundidade de descarga de 90%, a energia útil por ciclo é 360 MWh — e a energia comprada para entregá-la, com eficiência de ciclo de 86%, é de 419 MWh. O que ele atende depende da curva de carga, e não do número de unidades."'},
   {k:'e10',f:'D',t:'Atraso em rede inteligente',
    en:'"O Brasil está atrasado em rede inteligente em relação a outras jurisdições."',
    df:'Base de comparação não declarada',
    fa:'Pode ser verdadeira e não é verificável como está. Faltam cinco declarações: o que se conta como implantado, de quem é o medidor, como o investimento se recupera, qual a estrutura tarifária vigente e qual o desenho de mercado. Sem elas, os dois números comparados podem medir coisas diferentes.',
    pq:'Implantado significa medidor instalado, medidor comunicando, ponto integrado ao sistema de gestão ou ponto com serviço novo disponível ao consumidor?',
    ok:'"Uma comparação de implantação entre jurisdições exige declarar cinco condições antes de significar alguma coisa. Este módulo ensina quais são; a comparação em si é objeto do bloco de cenário internacional comparativo, e não é antecipada aqui."'},
   {k:'e11',f:'D',t:'Emissão que caiu',
    en:'"A empresa reduziu as emissões de escopo 2 em 40% em um ano."',
    df:'Base de comparação não declarada',
    fa:'Não declara o método, e os dois métodos válidos produzem números diferentes para o mesmo consumo. A queda pode vir de contratação de atributo — que não altera a física — ou de variação do fator médio da rede por hidrologia, sem que a empresa tenha mudado nada.',
    pq:'A queda é pelo método de localização ou pelo de mercado? E o fator médio da rede caiu no mesmo período?',
    ok:'"Pelo método de localização, a emissão variou conforme o fator médio da rede no período — que é baixo e volátil por hidrologia. Pelo método de mercado, a variação reflete os atributos contratados e aposentados. Os dois números são corretos, medem coisas diferentes, e a diferença entre eles não é redução física."'},
   {k:'e12',f:'D',t:'Participação que dobrou',
    en:'"A participação dos eletrificados dobrou em doze meses, de 7,7% para 18,3%."',
    df:'Base de comparação não declarada',
    fa:'Os dois números existem e são divulgados. O que falta declarar é que "eletrificado" é rótulo que agrupa cinco tecnologias, que a comparação exige a mesma taxonomia nos dois pontos, e que a base é venda mensal — indicador automotivo — e não frota circulante nem carga.',
    pq:'A taxonomia é a mesma nos dois pontos? E a comparação é entre meses isolados ou entre acumulados?',
    ok:'"A participação mensal do rótulo passou de 7,7% em junho de 2025 para 18,3% em junho de 2026, mantida a mesma taxonomia; no acumulado semestral, de 9,7% para 15,8%. Mês isolado e acumulado são bases distintas, e nenhuma das duas mede carga: para isso é preciso separar o que tem tomada."'}
  ];
  var DF={A:'A · estágio confundido',B:'B · gargalo não identificado',C:'C · carga não convertida',
          D:'D · base de comparação não declarada'};
  function painel(k){
    var o=E.filter(function(x){return x.k===k;})[0];
    if(!o)return '';
    return '<div class="vf-card">'+
      '<div class="vf-en">'+esc(o.en)+'</div>'+
      '<div class="ro"><div class="k">Defeito dominante</div><div class="n sm gold">'+esc(DF[o.f])+'</div></div>'+
      '<div class="vf-bk"><span class="vf-lb">O que exatamente falta</span><p>'+esc(o.fa)+'</p></div>'+
      '<div class="vf-bk"><span class="vf-lb">A pergunta que você faz</span><p>'+esc(o.pq)+'</p></div>'+
      '<div class="vf-bk ok"><span class="vf-lb">Forma corrigida</span><p>'+esc(o.ok)+'</p></div>'+
      '<p class="vf-nt">O enunciado original não é falso. Ele é verdadeiro e insuficiente — e é por isso que passa despercebido.</p></div>';
  }
  function render(){
    var f=segVal('vf-flt','data-f')||'all';
    var lista=E.filter(function(o){return f==='all'||o.f===f;});
    chips('vf-chips',lista.map(function(o){return {k:o.k,n:o.t,y:o.f};}),'v',function(k){
      $id('vf-panel').innerHTML=painel(k);
    });
    $id('vf-panel').innerHTML=painel(lista[0].k);
  }
  segBind('vf-flt',render);
  render();
}

const EDITORIAIS = [["GridAlpha","NIVAR"],["declarada no &sect;00.6","declarada na abertura do módulo"],["declarada no §00.6","declarada na abertura do módulo"]];

/** Saída de escolha de cada instrumento de seleção (previsão por escolha): lida do HTML que o
 *  script da fonte escreveu — instrumentos-config-m16-m17.mjs, `extratores`. */
const EXTRATORES = {
  'm16-inst-01': {
    'mp-ultima': (b) => {
            const m = [...(b['mp-flux'] || '').matchAll(/<span class="fzv">([^<]+)</g)];
            return m.length ? m[m.length - 1][1] : null;
          },
  },
  'm16-inst-02': {
    'rg-posicao-correta': (b, e) => {
            const vd = b['rg-vd'] || '';
            const m = vd.match(/posição correta hoje é a (\d)/);
            if (m) return m[1];
            return vd.includes('É esta a posição') ? String(e['rg-pos'] ?? 1) : null;
          },
  },
  'm16-inst-03': {
    'gg-vinculante': (b) => {
            const m = (b['gg-vd'] || '').match(/Gargalo vinculante em 4 de agosto de 2026: ([^.<]+)\./);
            return m ? m[1] : null;
          },
  },
  'm16-inst-11': {
    'vf-defeito': (b) => {
            const m = (b['vf-panel'] || '').match(/Defeito dominante<\/div><div class="n sm gold">([^<]+)</);
            return m ? m[1] : null;
          },
  },
};

export const CALCULADORAS: Record<string, CalculateFn> = {
  'm16-inst-01': (e: Record<string, EntradaInstrumento>) => calcular(inst01, e, {"readouts":[],"textos":["mp-flux","mp-panel"],"selecoes":{"mp-dim":"data-d","mp-chips":null}}, EDITORIAIS, EXTRATORES['m16-inst-01']),
  'm16-inst-02': (e: Record<string, EntradaInstrumento>) => calcular(inst02, e, {"readouts":[],"textos":["rg-out","rg-vd"],"selecoes":{"rg-tnd":"data-t","rg-pos":"data-p"}}, EDITORIAIS, EXTRATORES['m16-inst-02']),
  'm16-inst-03': (e: Record<string, EntradaInstrumento>) => calcular(inst03, e, {"readouts":[],"textos":["gg-out","gg-vd"],"selecoes":{"gg-tnd":"data-t"}}, EDITORIAIS, EXTRATORES['m16-inst-03']),
  'm16-inst-04': (e: Record<string, EntradaInstrumento>) => calcular(inst04, e, {"readouts":["fc-en","fc-sh","fc-pc","fc-ul","fc-ev","fc-he"],"textos":["fc-vd"],"selecoes":{}}, EDITORIAIS, EXTRATORES['m16-inst-04']),
  'm16-inst-05': (e: Record<string, EntradaInstrumento>) => calcular(inst05, e, {"readouts":["ar-en","ar-eu","ar-ea","ar-ec","ar-sp","ar-mg"],"textos":["ar-vd"],"selecoes":{}}, EDITORIAIS, EXTRATORES['m16-inst-05']),
  'm16-inst-06': (e: Record<string, EntradaInstrumento>) => calcular(inst06, e, {"readouts":["am-pa","am-cb","am-pt","am-ca","am-cc","am-at"],"textos":["am-vd"],"selecoes":{}}, EDITORIAIS, EXTRATORES['m16-inst-06']),
  'm16-inst-07': (e: Record<string, EntradaInstrumento>) => calcular(inst07, e, {"readouts":[],"textos":["cb-panel"],"selecoes":{"cb-chips":null}}, EDITORIAIS, EXTRATORES['m16-inst-07']),
  'm16-inst-08': (e: Record<string, EntradaInstrumento>) => calcular(inst08, e, {"readouts":["e2-df","e2-rz","e2-cb","e2-fis","e2-loc","e2-mkt"],"textos":["e2-locm","e2-mktm","e2-vd"],"selecoes":{"e2-mt":"data-m"}}, EDITORIAIS, EXTRATORES['m16-inst-08']),
  'm16-inst-09': (e: Record<string, EntradaInstrumento>) => calcular(inst09, e, {"readouts":["dc-cm","dc-pn","dc-ea","dc-rz","dc-sh","dc-a1"],"textos":["dc-vd"],"selecoes":{}}, EDITORIAIS, EXTRATORES['m16-inst-09']),
  'm16-inst-10': (e: Record<string, EntradaInstrumento>) => calcular(inst10, e, {"readouts":[],"textos":["gp-out"],"selecoes":{"gp-tnd":"data-t","gp-elo":"data-e"}}, EDITORIAIS, EXTRATORES['m16-inst-10']),
  'm16-inst-11': (e: Record<string, EntradaInstrumento>) => calcular(inst11, e, {"readouts":[],"textos":["vf-panel"],"selecoes":{"vf-flt":"data-f","vf-chips":null}}, EDITORIAIS, EXTRATORES['m16-inst-11']),
};

/** Alvos do script que compõem o painel de cada instrumento (para a conferência). */
export const TEXTOS: Record<string, string[]> = {"m16-inst-01":["mp-flux","mp-panel"],"m16-inst-02":["rg-out","rg-vd"],"m16-inst-03":["gg-out","gg-vd"],"m16-inst-04":["fc-vd"],"m16-inst-05":["ar-vd"],"m16-inst-06":["am-vd"],"m16-inst-07":["cb-panel"],"m16-inst-08":["e2-locm","e2-mktm","e2-vd"],"m16-inst-09":["dc-vd"],"m16-inst-10":["gp-out"],"m16-inst-11":["vf-panel"]};
