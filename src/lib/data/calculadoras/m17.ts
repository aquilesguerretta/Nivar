// @ts-nocheck — o corpo de cada instrumento é JavaScript copiado verbatim do
// <script> da fonte; tipá-lo exigiria reescrevê-lo, e reescrever é o que o
// porte verbatim proíbe (Q06). O contrato exportado (CALCULADORAS) é tipado.
//
// GERADO por tools/alexandria-dados/porte/gerar-instrumentos-m17.mjs — não edite à mão.
// Fonte: Alexandria modulos/alexandria_modulo17.html (só leitura).
// Conferência contra o script original executado: verificar-instrumentos-m16-m17.mjs 17.
// Posse: a sessão de porte do M17.
import type { CalculateFn, EntradaInstrumento } from '../alexandria-instrument-calculators';

function criarFonte(document, window) {
/* ── utilitários, verbatim (L4100–L4179) ── */
function $id(x){ return document.getElementById(x); }
function esc(s){ return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
function nfmt(v,d){
  if(!isFinite(v)) return '—';
  return v.toLocaleString('pt-BR',{minimumFractionDigits:d===undefined?0:d,
                                   maximumFractionDigits:d===undefined?0:d});
}
function clamp(v,lo,hi){ return v<lo?lo:(v>hi?hi:v); }
function parseNum(raw,fallback){
  if(raw===null||raw===undefined) return fallback;
  var s=String(raw).trim();
  if(s==='') return fallback;
  s=s.replace(/\s/g,'').replace(/\.(?=\d{3}(\D|$))/g,'').replace(',','.');
  var v=parseFloat(s);
  return isFinite(v)?v:fallback;
}

/* chips categóricos: devolve função que lê o estado atual */
function chips(wrapId, items, onPick, startIdx){
  var w=$id(wrapId); if(!w) return function(){return null;};
  var cur = (startIdx===undefined?0:startIdx);
  function paint(){
    w.innerHTML = items.map(function(it,i){
      return '<button type="button" class="tl-chip'+(i===cur?' on':'')+'" data-i="'+i+'">'+
             esc(it.label)+'</button>';
    }).join('');
  }
  w.addEventListener('click', function(ev){
    var b=ev.target.closest('.tl-chip'); if(!b) return;
    cur=parseInt(b.getAttribute('data-i'),10);
    paint(); onPick(items[cur], cur);
  });
  paint();
  onPick(items[cur], cur);
  return function(){ return items[cur]; };
}

/* campo numérico espelhado: input number + slider */
function field(cfg){
  return '<div class="field">'+
   '<div class="field-label"><span>'+esc(cfg.label)+'</span><span class="unit">'+esc(cfg.unit)+'</span></div>'+
   '<input type="number" id="'+cfg.id+'" value="'+cfg.val+'" step="'+cfg.step+'" min="'+cfg.min+'" max="'+cfg.max+'">'+
   '<input type="range" id="'+cfg.id+'-s" value="'+cfg.val+'" step="'+cfg.step+'" min="'+cfg.min+'" max="'+cfg.max+'">'+
   '</div>';
}
function bindFields(cfgs, recompute){
  cfgs.forEach(function(c){
    var n=$id(c.id), s=$id(c.id+'-s');
    if(!n||!s) return;
    n.addEventListener('input', function(){
      var v=clamp(parseNum(n.value,c.val), c.min, c.max);
      s.value=v; recompute();
    });
    n.addEventListener('blur', function(){
      var v=clamp(parseNum(n.value,c.val), c.min, c.max);
      n.value=v; s.value=v; recompute();
    });
    s.addEventListener('input', function(){
      n.value=s.value; recompute();
    });
  });
}
function readVal(cfg){
  var n=$id(cfg.id);
  return clamp(parseNum(n?n.value:cfg.val, cfg.val), cfg.min, cfg.max);
}
function ro(k,n,u,cls){
  return '<div class="ro"><div class="k">'+esc(k)+'</div><div class="n'+(cls?' '+cls:'')+'">'+
         n+(u?'<span class="u">'+esc(u)+'</span>':'')+'</div></div>';
}
function gcmp(rows){
  return '<div class="gcmp">'+rows.map(function(r){
    return '<div class="gk">'+esc(r[0])+'</div><div class="gv">'+r[1]+'</div>';
  }).join('')+'</div>';
}
function verdict(el, cls, html){
  if(!el) return;
  el.className='verdict '+cls;
  el.innerHTML=html;
}
/* ── base J, verbatim (L4185–L4291) ── */
var J = [
 {k:'br', n:'Brasil', core:true, tag:'uni', tagl:'uniforme por submercado',
  preco:'uniforme_modelado', descarb:'dotacao_renovavel', regul:'leilao_longo_prazo', invest:'leilao_regulado',
  desp:'Custo declarado, otimização centralizada hidrotérmica',
  gran:'Uniforme por submercado; separa quando o intercâmbio satura',
  risco:'Comprador contratado assume volume; diferença liquidada no curto prazo',
  disp:'Obrigação de lastro vinculada a contrato + leilões dedicados de potência',
  dispPreco:'Não há preço separado para o atributo; embutido no contrato',
  dispPen:'Vinculada a contrato e a lastro',
  dispInst:'Operador de sistema, câmara de comercialização, agência reguladora',
  dot:'Bacia continental com estocagem plurianual; irradiação alta; vento complementar',
  d4:'Preço modelado · renovável por dotação · leilão de longo prazo · leilão regulado'},

 {k:'pjm', n:'Mercado organizado do meio-atlântico', core:true, tag:'nod', tagl:'nodal · capacidade central',
  preco:'nodal', descarb:'preco_carbono_portfolio', regul:'capacidade_central', invest:'credito_fiscal',
  desp:'Por oferta, programação do dia anterior e ajuste em tempo real',
  gran:'Nodal, decomposto em energia, congestionamento e perdas',
  risco:'Agente supridor; consumidor pode contratar direito financeiro entre pontos',
  disp:'Leilão plurianual de capacidade com acreditação probabilística',
  dispPreco:'US$/MW-dia formado em leilão com curva de demanda administrada',
  dispPen:'Penalidade por não-desempenho em evento de estresse',
  dispInst:'Operador independente, monitor de mercado, regulador federal de atacado',
  dot:'Gás doméstico barato, nuclear herdado, densidade de carga alta e crescente',
  d4:'Preço nodal · política estadual e carbono regional · capacidade central · crédito fiscal'},

 {k:'erc', n:'Mercado organizado do sul central', core:true, tag:'nod', tagl:'nodal · só energia',
  preco:'nodal', descarb:'gas_domestico', regul:'so_energia', invest:'credito_fiscal',
  desp:'Por oferta, com cootimização de energia e ancilares em tempo real desde dez/2025',
  gran:'Nodal, com cauda de preço longa por desenho',
  risco:'Agente e consumidor, com contrato bilateral e financeiro',
  disp:'Nenhum produto central; receita de energia, ancilares e escassez',
  dispPreco:'Emerge do preço de energia e das curvas de demanda por ancilares',
  dispPen:'Implícita: quem não entrega não recebe o preço de escassez',
  dispInst:'Operador estadual, comissão estadual, legislatura; e um compromisso informal de não intervir no preço',
  dot:'Gás doméstico, recurso eólico e solar excepcionais, rede quase isolada',
  d4:'Preço nodal · gás doméstico · só energia · crédito fiscal'},

 {k:'de', n:'Alemanha', core:true, tag:'zon', tagl:'zonal · mercado acoplado',
  preco:'zonal', descarb:'preco_carbono_portfolio', regul:'so_energia', invest:'cfd_premio',
  desp:'Por oferta, dentro de zona única nacional acoplada ao mercado continental',
  gran:'Zonal; congestionamento interno resolvido por redespacho com custo socializado',
  risco:'Agente supridor; consumidor exposto ao preço zonal, sem risco de base interno',
  disp:'Sem leilão central; reserva estratégica fora do mercado',
  dispPreco:'Não há produto de capacidade com preço próprio',
  dispPen:'Não aplicável na mesma forma',
  dispInst:'Operadores nacionais de transmissão, regulador nacional, rede europeia de operadores',
  dot:'Vento bom no norte, sem hidráulica de estocagem, interconexão continental densa',
  d4:'Preço zonal · carbono e política de apoio · só energia · contrato por diferença'},

 {k:'cn', n:'China', core:true, tag:'adm', tagl:'administrado em transição',
  preco:'administrado', descarb:'escala_termica', regul:'planejamento_estatal', invest:'estatal_dirigido',
  desp:'Provincial, historicamente administrado, em transição para mercado com calendário público',
  gran:'Provincial, misto entre regulado e mercado; comércio interprovincial em expansão',
  risco:'Estado e empresas estatais absorvem a maior parte',
  disp:'Adequação por planejamento estatal com metas provinciais',
  dispPreco:'Definido administrativamente, com componentes de mercado crescentes',
  dispPen:'Administrativa, por meta e por responsabilidade provincial',
  dispInst:'Autoridade central de planejamento, autoridade nacional de energia, dois grupos estatais de rede',
  dot:'Recurso no oeste e no norte; carga no litoral leste; distância como variável estruturante',
  d4:'Preço administrado · escala com térmica dominante · planejamento estatal · financiamento dirigido'},

 {k:'cl', n:'Chile', core:true, tag:'nod', tagl:'nodal · leilão de longo prazo',
  preco:'nodal', descarb:'dotacao_renovavel', regul:'leilao_longo_prazo', invest:'leilao_regulado',
  desp:'Por custo auditado, num sistema longitudinal',
  gran:'Nodal, com diferenças acentuadas entre norte e centro',
  risco:'Gerador com contrato de longo prazo; risco de perfil e de congestionamento relevante',
  disp:'Pagamento por potência de suficiência mais leilões de contrato de longo prazo',
  dispPreco:'Potência de suficiência remunerada por regra; contrato por leilão',
  dispPen:'Vinculada à suficiência apurada',
  dispInst:'Coordenador independente, comissão nacional de energia, superintendência',
  dot:'Irradiação excepcional no norte desértico; carga no centro; poucos caminhos de rede',
  d4:'Preço nodal · dotação solar e eólica · leilão de longo prazo · leilão regulado'},

 {k:'cai', n:'Operador da costa oeste norte-americana', tag:'nod', tagl:'nodal · obrigação de supridor',
  preco:'nodal', descarb:'preco_carbono_portfolio', regul:'obrigacao_supridor', invest:'credito_fiscal',
  d4:'Preço nodal · política climática estadual · adequação por contrato de supridor · crédito fiscal'},
 {k:'nyi', n:'Operador do nordeste atlântico', tag:'nod', tagl:'nodal · capacidade central',
  preco:'nodal', descarb:'escolha_nuclear', regul:'capacidade_central', invest:'credito_fiscal',
  d4:'Preço nodal · nuclear e hidráulica herdadas · capacidade central · crédito fiscal'},
 {k:'mis', n:'Operador do meio-oeste', tag:'nod', tagl:'nodal · capacidade sazonal',
  preco:'nodal', descarb:'gas_domestico', regul:'capacidade_central', invest:'credito_fiscal',
  d4:'Preço nodal · substituição de carvão por gás · capacidade central sazonal · crédito fiscal'},
 {k:'ine', n:'Operador do extremo nordeste', tag:'nod', tagl:'nodal · capacidade a prazo',
  preco:'nodal', descarb:'escolha_nuclear', regul:'capacidade_central', invest:'credito_fiscal',
  d4:'Preço nodal · nuclear estruturante · capacidade contratada a prazo · crédito fiscal'},
 {k:'spp', n:'Operador das planícies centrais', tag:'nod', tagl:'nodal · sem leilão central',
  preco:'nodal', descarb:'dotacao_renovavel', regul:'so_energia', invest:'credito_fiscal',
  d4:'Preço nodal · dotação eólica excepcional · sem produto central de adequação · crédito fiscal'},
 {k:'fr', n:'França', tag:'zon', tagl:'zonal · base nuclear',
  preco:'zonal', descarb:'escolha_nuclear', regul:'obrigacao_supridor', invest:'cfd_premio',
  d4:'Preço zonal · frota nuclear padronizada · obrigação de supridor com certificados · contrato por diferença'},
 {k:'ib', n:'Península ibérica', tag:'zon', tagl:'zonal · interconexão limitada',
  preco:'zonal', descarb:'dotacao_renovavel', regul:'so_energia', invest:'cfd_premio',
  d4:'Preço zonal · dotação solar e eólica · adequação em revisão · contrato por diferença'},
 {k:'mx', n:'Jurisdição norte-americana de língua espanhola', tag:'nod', tagl:'nodal · prevalência estatal',
  preco:'nodal', descarb:'escala_termica', regul:'leilao_longo_prazo', invest:'leilao_regulado',
  d4:'Preço nodal · térmica dominante · planejamento com prevalência estatal · contratação regulada'},
 {k:'ar', n:'Jurisdição vizinha do cone sul', tag:'adm', tagl:'administrado · instabilidade macro',
  preco:'administrado', descarb:'escala_termica', regul:'planejamento_estatal', invest:'estatal_dirigido',
  d4:'Preço administrado · térmica e nuclear · planejamento estatal · financiamento dirigido'},
 {k:'in', n:'Sistema asiático de escala continental', tag:'zon', tagl:'zonal · distribuidoras estaduais',
  preco:'zonal', descarb:'escala_termica', regul:'leilao_longo_prazo', invest:'leilao_regulado',
  d4:'Preço zonal com bifurcação · escala com carvão dominante · leilão de longo prazo · leilão regulado'},
 {k:'au', n:'Mercado insular do hemisfério sul', tag:'zon', tagl:'zonal · obrigação de supridor',
  preco:'zonal', descarb:'dotacao_renovavel', regul:'obrigacao_supridor', invest:'merchant',
  d4:'Preço zonal por região · dotação solar e eólica · obrigação de supridor · receita de mercado'}
];
/* ── DIMS, verbatim (L4293–L4325) ── */
var DIMS = {
 preco:{ label:'Preço', pergunta:'como o preço de curto prazo se forma',
   nao:'Isto não ordena por nível de preço. Nível sem as sete declarações de perímetro não é comparável.',
   buckets:{
     nodal:'Nodal por ponto da rede',
     zonal:'Zonal por área ampla',
     uniforme_modelado:'Uniforme por submercado, valor modelado',
     administrado:'Administrado, em transição declarada para mercado'}},
 descarb:{ label:'Descarbonização', pergunta:'o que domina a explicação da intensidade de emissão',
   nao:'Isto não ordena por quem está mais avançado. &ldquo;Avançado&rdquo; embute uma meta que cada país define diferente.',
   buckets:{
     dotacao_renovavel:'Dotação renovável dominante',
     escolha_nuclear:'Escolha nuclear estruturante',
     preco_carbono_portfolio:'Preço de carbono e política de portfólio',
     gas_domestico:'Substituição de carvão por gás doméstico',
     escala_termica:'Escala, com térmica ainda dominante na geração'}},
 regul:{ label:'Regulação', pergunta:'quem decide adequação de recursos',
   nao:'Isto não ordena por qualidade regulatória. Cada arquitetura entrega uma coisa e custa outra.',
   buckets:{
     capacidade_central:'Mercado central de capacidade',
     obrigacao_supridor:'Obrigação contratada por agente supridor',
     leilao_longo_prazo:'Leilão de contrato de longo prazo com planejamento',
     planejamento_estatal:'Planejamento estatal direto',
     so_energia:'Nenhum produto central de adequação'}},
 invest:{ label:'Investimento', pergunta:'o que estabiliza a receita de um projeto novo',
   nao:'Isto não ordena por atratividade. Atratividade depende de custo de capital, moeda e prazo de conexão.',
   buckets:{
     leilao_regulado:'Leilão regulado de longo prazo',
     cfd_premio:'Contrato por diferença ou prêmio regulado',
     credito_fiscal:'Crédito fiscal transferível com contrato bilateral',
     estatal_dirigido:'Financiamento estatal dirigido',
     merchant:'Receita de mercado com contrato financeiro'}}
};
return {
/* ── m17-inst-01 · Mapa · Mapa das jurisdições · reagrupamento por dimensão — corpo da IIFE, verbatim (L4408–L4423) ── */
i01: function () {
  var out=$id('i01-out'), v=$id('i01-v'); if(!out) return;
  var dims=['preco','descarb','regul','invest'];
  chips('i01-dim', dims.map(function(d){ return {label:DIMS[d].label, k:d}; }), function(it){
    var d=DIMS[it.k];
    var rows=Object.keys(d.buckets).map(function(b){
      var membros=J.filter(function(j){ return j[it.k]===b; });
      return [ d.buckets[b],
        membros.map(function(j){
          return '<b>'+esc(j.n)+'</b>';
        }).join(' &middot; ') + ' <span class="u">('+membros.length+')</span>' ];
    });
    out.innerHTML = '<p class="disc">Agrupamento por: '+esc(d.pergunta)+'.</p>' + gcmp(rows);
    verdict(v,'att','<b>O que este reagrupamento não é.</b> '+d.nao+
      ' Troque a dimensão e observe que a composição dos grupos muda por completo — é isso que prova '+
      'que não existe uma ordenação única, e portanto não existe ranking.');
  });
},
/* ── m17-inst-02 · Verificador de perímetro de preço — corpo da IIFE, verbatim (L4430–L4474) ── */
i02: function () {
  var rowsEl=$id('i02-rows'), v=$id('i02-v'); if(!rowsEl) return;
  var DECL=[
   {k:'camada', n:'O que está dentro', f:'Energia, transporte, encargos e tributos são quatro camadas. A razão entre atacado e fatura cheia pode passar de três.'},
   {k:'consum', n:'Quem é o consumidor', f:'Nível de tensão e fator de carga. &ldquo;A indústria&rdquo; é um agregado de composição diferente em cada país.'},
   {k:'mercado',n:'Qual mercado formou', f:'Atacado, contrato, leilão, tarifa ou fatura final. São cinco processos de formação distintos.'},
   {k:'granul', n:'Granularidade e período', f:'Média aritmética, ponderada pela carga, ponderada pelo perfil, ponta; ano civil ou hidrológico.'},
   {k:'tribut', n:'Tributo e subsídio', f:'Tributo recuperável não é custo. Subsídio cruzado não aparece em lugar nenhum e é reversível.'},
   {k:'cambio', n:'Base cambial', f:'Nominal para competitividade; paridade para acessibilidade. Nunca as duas misturadas.'},
   {k:'desenho',n:'Qual desenho formou', f:'Nodal, zonal ou uniforme por submercado. É a que quase ninguém faz e a que mais decide.'}
  ];
  var state={};
  DECL.forEach(function(d){ state[d.k]=false; });

  function paint(){
    rowsEl.innerHTML='<div class="p7">'+DECL.map(function(d,i){
      var on=state[d.k];
      return '<div class="p7-r '+(on?'have':'miss')+'" data-k="'+d.k+'" style="cursor:pointer">'+
        '<div class="p7-n">'+(i+1)+'</div>'+
        '<div class="p7-k">'+esc(d.n)+'</div>'+
        '<div class="p7-v">'+(on?'<b>Declarada.</b> ':'<b>Ausente.</b> ')+d.f+'</div></div>';
    }).join('')+'</div>';
    calc();
  }
  function calc(){
    var falta=DECL.filter(function(d){ return !state[d.k]; });
    if(falta.length===0){
      verdict(v,'ok','<b>As sete estão declaradas.</b> A comparação é agora válida como comparação — '+
        'o que não quer dizer que a conclusão esteja pronta. A diferença que sobrou é objeto da '+
        '<b>decomposição em três parcelas</b> da Aula 02: quanto é dotação, quanto é desenho, quanto é '+
        'política, e qual das três não explica nada.');
      return;
    }
    var so = (falta.length===1);
    verdict(v, falta.length>=4?'per':'att',
      '<b>'+falta.length+' de 7 ausente'+(so?'':'s')+'. A comparação é inválida, não imprecisa.</b> '+
      'Falta declarar: '+falta.map(function(d){return '<b>'+esc(d.n.toLowerCase())+'</b>';}).join('; ')+'. '+
      '<br><br>A resposta correta não é estimar a diferença: é <b>devolver a pergunta</b> e pedir a '+
      'declaração que falta. Se você concluir alguma coisa a partir daqui, a conclusão herda o defeito — '+
      'e ela vai soar razoável, que é justamente o problema.');
  }
  rowsEl.addEventListener('click', function(ev){
    var r=ev.target.closest('.p7-r'); if(!r) return;
    var k=r.getAttribute('data-k'); state[k]=!state[k]; paint();
  });
  paint();
},
/* ── m17-inst-03 · Decompositor de diferença — corpo da IIFE, verbatim (L4481–L4569) ── */
i03: function () {
  var out=$id('i03-out'), v=$id('i03-v'); if(!out) return;

  /* pares × dimensão → {dot,des,pol, vinc, zero, nota} — pesos ordinais, não medida */
  var PARES=[
   {k:'br_pjm', label:'Brasil × meio-atlântico'},
   {k:'pjm_erc', label:'Meio-atlântico × sul central'},
   {k:'br_de',  label:'Brasil × Alemanha'},
   {k:'br_cn',  label:'Brasil × China'},
   {k:'br_cl',  label:'Brasil × Chile'},
   {k:'de_fr',  label:'Alemanha × França'}
  ];
  var DIMSEL=[
   {k:'preco',   label:'Preço'},
   {k:'descarb', label:'Descarbonização'},
   {k:'regul',   label:'Regulação'},
   {k:'invest',  label:'Investimento'}
  ];
  var M={
  br_pjm:{
   preco:  {dot:2,des:7,pol:1, nota:'Preço uniforme por submercado formado por modelo contra preço nodal formado por oferta. <b>Desenho vincula</b>: são definições diferentes antes de serem números diferentes.', zero:'política'},
   descarb:{dot:8,des:1,pol:1, nota:'<b>Dotação vincula com folga.</b> Uma bacia continental contra um parque térmico e nuclear herdado. Nenhum dos dois escolheu a sua geologia.', zero:'desenho'},
   regul:  {dot:3,des:6,pol:1, nota:'Leilão de longo prazo com obrigação de lastro contra leilão central de capacidade. <b>Desenho vincula</b>, com dotação concorrendo — estocagem plurianual muda a forma do problema de adequação.', zero:'política'},
   invest: {dot:1,des:4,pol:5, nota:'Leilão regulado contra crédito fiscal transferível. <b>Política concorre fortemente e é a parcela volátil</b>: o crédito tem data de término e já foi antecipado uma vez.', zero:'dotação'}},
  pjm_erc:{
   preco:  {dot:1,des:8,pol:1, nota:'<b>O par mais limpo do módulo.</b> Mesmo país, moeda, regime tributário e cadeia. A distribuição de preço diverge por desenho: quem não compra disponibilidade separadamente precisa da cauda de preço.', zero:'política'},
   descarb:{dot:5,des:2,pol:3, nota:'Dotação vincula por pouco — gás doméstico dos dois lados, mas recurso eólico e solar muito superior num deles. Política concorre por regra estadual de portfólio.', zero:'nenhuma'},
   regul:  {dot:2,des:8,pol:0, nota:'<b>Desenho vincula quase sozinho.</b> Leilão central de capacidade contra nenhum produto de adequação. <b>Política não explica nada</b>: a política federal é idêntica nos dois.', zero:'política'},
   invest: {dot:1,des:3,pol:6, nota:'Crédito fiscal federal idêntico nos dois; o que diverge é fila de conexão e receita esperada. <b>Política domina o nível</b> e desenho domina a diferença entre eles.', zero:'dotação'}},
  br_de:{
   preco:  {dot:5,des:3,pol:2, nota:'Antes de qualquer parcela, <b>o perímetro resolve boa parte</b>: o número citado costuma ser tarifa cheia contra atacado. Do que sobra, dotação vincula — ausência de hidráulica de estocagem e gás importado.', zero:'nenhuma'},
   descarb:{dot:6,des:0,pol:4, nota:'<b>Dotação vincula</b> pelo lado brasileiro e <b>política concorre</b> pelo lado alemão. <b>Desenho não explica nada</b>: a mesma trajetória existiria sob outra arquitetura de mercado.', zero:'desenho'},
   regul:  {dot:3,des:6,pol:1, nota:'Leilão de longo prazo contra mercado só de energia com reserva estratégica. Desenho vincula; dotação concorre via interconexão, que é o que permite prescindir de produto de adequação.', zero:'política'},
   invest: {dot:1,des:4,pol:5, nota:'Leilão regulado contra contrato por diferença. São dois instrumentos que fazem a mesma coisa — estabilizar receita — com titularidade e risco diferentes.', zero:'dotação'}},
  br_cn:{
   preco:  {dot:4,des:6,pol:0, nota:'Preço uniforme por submercado contra preço provincial em transição. <b>Desenho vincula</b>; dotação concorre porque a distância entre recurso e carga é enorme nos dois casos e resolvida de modos diferentes.', zero:'política'},
   descarb:{dot:5,des:1,pol:4, nota:'Dotação vincula — bacia continental contra carvão abundante. Política concorre fortemente do outro lado, via meta e financiamento dirigido. Cuidado com a grandeza: capacidade instalada contra geração.', zero:'desenho'},
   regul:  {dot:1,des:5,pol:4, nota:'Planejamento com leilão contra planejamento estatal direto. E há uma quarta parcela que a decomposição precisa nomear: <b>capacidade institucional de execução</b>, que se comporta como dotação.', zero:'nenhuma'},
   invest: {dot:2,des:2,pol:6, nota:'<b>Política vincula.</b> Leilão regulado contra financiamento estatal dirigido em escala. A diferença é de capacidade fiscal do Estado, não de arquitetura de mercado.', zero:'nenhuma'}},
  br_cl:{
   preco:  {dot:4,des:6,pol:0, nota:'Os dois despacham por custo; divergem na granularidade. <b>Desenho vincula</b> e a comparação é a mais informativa do módulo justamente por isso — quase tudo o mais é parecido.', zero:'política'},
   descarb:{dot:8,des:1,pol:1, nota:'<b>Dotação vincula com folga nos dois lados</b>, por caminhos diferentes: hidráulica contra irradiação desértica. Nenhuma das duas é conquista de política.', zero:'desenho'},
   regul:  {dot:2,des:5,pol:3, nota:'Arranjos institucionais próximos: coordenador independente e leilão de longo prazo dos dois lados. Desenho vincula por pouco, via pagamento por potência de suficiência.', zero:'nenhuma'},
   invest: {dot:2,des:6,pol:2, nota:'Leilão regulado nos dois. <b>Desenho vincula</b> pela exposição locacional: preço nodal impõe risco de perfil e de congestionamento que o preço uniforme por submercado não impõe do mesmo modo.', zero:'nenhuma'}},
  de_fr:{
   preco:  {dot:5,des:2,pol:3, nota:'Mesma zona acoplada, mesmo bloco normativo. <b>Dotação vincula</b>: uma frota de base firme contra um parque variável muda a formação de preço sem que o desenho difira muito.', zero:'nenhuma'},
   descarb:{dot:2,des:1,pol:7, nota:'<b>Política vincula, em horizontes muito diferentes.</b> Uma frota nuclear padronizada de décadas contra apoio à receita renovável de duas décadas. <b>Desenho quase não explica.</b>', zero:'desenho'},
   regul:  {dot:1,des:7,pol:2, nota:'Só energia com reserva estratégica contra obrigação descentralizada de supridor com certificados. <b>Desenho vincula</b> — mesmo bloco, escolhas de adequação opostas.', zero:'dotação'},
   invest: {dot:1,des:5,pol:4, nota:'Contrato por diferença dos dois lados, com objeto diferente. A diferença é de qual tecnologia recebe o instrumento, o que é política, e de como o risco é alocado, que é desenho.', zero:'dotação'}}
  };

  var getPar=null, getDim=null;
  function render(){
    if(!getPar||!getDim) return;
    var p=getPar(), d=getDim();
    var m=M[p.k][d.k];
    var tot=m.dot+m.des+m.pol;
    function seg(cls,val,lab){
      if(val===0) return '<div class="par3-seg zero" style="flex:0.6">'+lab+': 0</div>';
      return '<div class="par3-seg '+cls+'" style="flex:'+val+'">'+lab+'</div>';
    }
    var vinc = (m.dot>=m.des && m.dot>=m.pol) ? 'dotação'
             : (m.des>=m.pol ? 'desenho' : 'política');
    out.innerHTML =
      '<div class="par3"><div class="par3-hd">'+esc(p.label)+' &middot; dimensão: '+esc(d.label)+'</div>'+
      '<div class="par3-bd">'+
      '<div class="par3-bar">'+seg('dot',m.dot,'dotação')+seg('des',m.des,'desenho')+seg('pol',m.pol,'política')+'</div>'+
      '<div class="par3-lg"><span><i class="dot"></i>dotação '+m.dot+'/'+tot+'</span>'+
      '<span><i class="des"></i>desenho '+m.des+'/'+tot+'</span>'+
      '<span><i class="pol"></i>política '+m.pol+'/'+tot+'</span></div>'+
      '<div class="par3-nt">'+m.nota+'</div>'+
      (m.zero!=='nenhuma'
        ? '<div class="par3-no"><b>A parcela que não explica nada aqui: '+esc(m.zero)+'.</b> '+
          'Essa é a informação que quase nunca aparece — e é ela que impede a recomendação errada.</div>'
        : '<div class="par3-no">Nenhuma das três é irrelevante neste par. Quando as três concorrem, '+
          'a conclusão precisa ser condicional, não categórica.</div>')+
      '</div></div>';
    verdict(v,'ok','<b>Parcela vinculante: '+vinc+'.</b> '+
      (vinc==='dotação'
        ? 'Diferença dominada por dotação <b>não é lição — é geografia</b>. Não há o que importar.'
        : vinc==='política'
          ? 'Diferença dominada por política <b>não é modelo — é um governo</b>, e a parcela muda em horizonte de mandato.'
          : 'Só a parcela de desenho é discutível como escolha. Antes de propor importação, aplique o '+
            '<b>Instrumento 08</b>: de que instituição o mecanismo depende, e quem ocupa aquela função aqui.')+
      ' <br><br>Os pesos acima são <b>ordinais e ilustrativos</b>, não medida — servem para mostrar a forma '+
      'da decomposição e para forçar a declaração da parcela que não explica.');
  }
  getPar = chips('i03-par', PARES.map(function(p){return {label:p.label,k:p.k};}), function(){ render(); });
  getDim = chips('i03-dim', DIMSEL, function(){ render(); });
  render();
},
/* ── m17-inst-04 · Comparador de desenho de despacho — corpo da IIFE, verbatim (L4576–L4621) ── */
i04: function () {
  var out=$id('i04-out'), v=$id('i04-v'); if(!out) return;
  var core=J.filter(function(j){ return j.core; });
  var VIS=[
   {k:'desp',  label:'Quem despacha e por qual critério'},
   {k:'gran',  label:'Granularidade do preço'},
   {k:'risco', label:'Quem assume risco de volume'}
  ];
  var getJ=null, getV=null;
  function render(){
    if(!getJ||!getV) return;
    var j=getJ(), dim=getV();
    var rows=[
      ['Despacho', esc(j.desp)],
      ['Granularidade', esc(j.gran)],
      ['Risco de volume', esc(j.risco)],
      ['Dotação relevante', esc(j.dot)]
    ];
    out.innerHTML = gcmp(rows);
    var msg;
    if(dim.k==='desp'){
      msg = j.desp.indexOf('Custo declarado')===0 || j.desp.indexOf('custo auditado')>0
        ? '<b>Regime de custo declarado.</b> O preço não resulta de ofertas; resulta de otimização com parâmetros '+
          'regulatórios. Pressuposto institucional: operador com mandato de otimização, modelo auditável e '+
          'regulador com competência para fixar parâmetros.'
        : '<b>Regime de oferta.</b> Preço e despacho saem do mesmo processo. Pressuposto institucional: '+
          '<b>monitor de mercado independente com poder de mitigação de oferta</b> — sem ele, oferta vira poder de mercado.';
    } else if(dim.k==='gran'){
      msg = j.preco==='nodal'
        ? '<b>Preço nodal.</b> Sinal locacional preciso, e um risco de base entre o ponto contratado e o ponto '+
          'consumido que exige instrumento financeiro próprio. Esse instrumento é hedge de <b>um</b> componente, não de todos.'
        : (j.preco==='zonal'
          ? '<b>Preço zonal.</b> Congestionamento interno assumido inexistente por convenção e resolvido por '+
            'redespacho, cujo custo alguém paga — normalmente socializado. Simplicidade comprada com sinal locacional.'
          : '<b>Preço não formado por oferta.</b> Comparar este número com um preço de mercado de ofertas é '+
            'comparar dois objetos de naturezas distintas. É a sétima declaração de perímetro.');
    } else {
      msg = '<b>Alocação de risco de volume.</b> É a variável que decide quem quebra quando a previsão erra, e '+
            'ela quase nunca aparece numa comparação de preço. Compare-a antes de comparar o número.';
    }
    verdict(v,'ok', msg + ' <br><br><b>Nenhuma das três granularidades domina as outras em abstrato.</b> '+
      'O que decide é a relação entre onde está o recurso, onde está a carga e quanto custa a linha entre os dois.');
  }
  getJ = chips('i04-jur', core.map(function(j){ return {label:j.n.length>24?j.n.slice(0,22)+'…':j.n, k:j.k,
                 desp:j.desp, gran:j.gran, risco:j.risco, dot:j.dot, preco:j.preco}; }), function(){ render(); });
  getV = chips('i04-dim', VIS, function(){ render(); });
  render();
},
/* ── m17-inst-05 · Grade de remuneração de disponibilidade — corpo da IIFE, verbatim (L4628–L4661) ── */
i05: function () {
  var out=$id('i05-out'), v=$id('i05-v'); if(!out) return;
  var core=J.filter(function(j){ return j.core; });
  chips('i05-jur', core.map(function(j){
    return {label:j.n.length>24?j.n.slice(0,22)+'…':j.n, j:j};
  }), function(it){
    var j=it.j;
    out.innerHTML = gcmp([
      ['Quem remunera e com que produto', esc(j.disp)],
      ['Como o preço se forma', esc(j.dispPreco)],
      ['Penalidade por não-desempenho', esc(j.dispPen)],
      ['Pressuposto institucional', esc(j.dispInst)]
    ]);
    var m;
    if(j.regul==='capacidade_central'){
      m='<b>Mercado central de capacidade.</b> Compra <b>disponibilidade futura acreditada</b> — não energia, '+
        'não a placa da usina, não a promessa do proprietário. O que decide o resultado não é a existência do '+
        'mercado: é a qualidade da acreditação e o rigor da penalidade, dois parâmetros de segunda ordem que '+
        'quase nunca aparecem na conversa.';
    } else if(j.regul==='so_energia'){
      m='<b>Só energia, com escassez.</b> Não é ausência de mecanismo: é um mecanismo diferente, cujo pressuposto '+
        'é o <b>compromisso crível de que o preço alto será permitido</b>. Esse pressuposto não é uma instituição '+
        'formal — é uma expectativa, e é o mais frágil de todos porque não tem titular a quem cobrar.';
    } else if(j.regul==='leilao_longo_prazo'){
      m='<b>Leilão de contrato de longo prazo com obrigação de lastro.</b> A função de remunerar disponibilidade '+
        '<b>existe</b> e tem nome diferente. A diferença real é que o atributo não recebe preço separado: ele é '+
        'embutido no preço da energia contratada. Dizer &ldquo;não tem mercado de capacidade&rdquo; e '+
        '&ldquo;é a mesma coisa com outro nome&rdquo; são as duas frases erradas, em direções opostas.';
    } else {
      m='<b>Planejamento estatal direto.</b> Adequação decidida por meta e por responsabilidade administrativa, '+
        'não por produto de mercado. O pressuposto é capacidade de financiamento estatal em escala — '+
        'o menos importável de todos os pressupostos deste módulo.';
    }
    verdict(v,'ok', m);
  });
},
/* ── m17-inst-06 · Conversor de preço de disponibilidade — corpo da IIFE, verbatim (L4668–L4700) ── */
i06: function () {
  var wrap=$id('i06-f'), r=$id('i06-r'), v=$id('i06-v'); if(!wrap) return;
  var CFG=[
   {id:'i06-p',  label:'Preço de capacidade',        unit:'US$/MW-dia', val:325, min:0,   max:900,  step:1},
   {id:'i06-mw', label:'Capacidade acreditada',      unit:'MW',         val:100, min:1,   max:5000, step:1},
   {id:'i06-fc', label:'Fator de carga da carga',    unit:'%',          val:85,  min:5,   max:100,  step:1},
   {id:'i06-d',  label:'Dias da janela de entrega',  unit:'dias',       val:365, min:1,   max:400,  step:1}
  ];
  wrap.innerHTML = CFG.map(field).join('');
  function calc(){
    var p=readVal(CFG[0]), mw=readVal(CFG[1]), fc=readVal(CFG[2])/100, d=readVal(CFG[3]);
    var anual = p*mw*d;                       /* US$ */
    var mwh   = mw*fc*24*d;                   /* MWh no período */
    var perMwh= mwh>0 ? anual/mwh : NaN;
    r.innerHTML =
      ro('Custo da janela','US$ '+nfmt(anual/1e6,2),'mi','gold')+
      ro('Energia no período', nfmt(mwh/1000,1),'GWh')+
      ro('Equivalente', 'US$ '+nfmt(perMwh,2),'/MWh')+
      ro('Sobre a placa?','não','', 'sm');
    var alerta='';
    if(fc<0.35) alerta='<br><br><b>Fator de carga baixo.</b> O equivalente por MWh sobe rapidamente porque o '+
      'denominador encolhe. É o mesmo mecanismo da parcela de demanda numa fatura industrial — Módulo 10.';
    if(p===0) alerta='<br><br><b>Preço zero.</b> Corresponde a um desenho sem produto central de disponibilidade, '+
      'em que a mesma função é remunerada dentro do preço da energia.';
    verdict(v,'att',
      '<b>Este número não é o custo de capacidade de uma carga específica.</b> Três razões, e todas as três '+
      'importam antes de qualquer citação: a obrigação recai sobre <b>capacidade acreditada</b>, que não é a '+
      'placa e não é a demanda contratada; a alocação ao consumidor final se dá por meio do agente supridor, '+
      'segundo regra de rateio própria; e o preço vigente está <b>no teto negociado</b>, o que significa que '+
      'ele não é o preço que o mercado formaria. '+
      '<br><br>Use o resultado para <b>ordem de grandeza e para conversa</b> — nunca como custo apurado.'+alerta);
  }
  bindFields(CFG, calc);
  calc();
},
/* ── m17-inst-07 · Régua de estágio aplicada a política estrangeira — corpo da IIFE, verbatim (L4724–L4786) ── */
i07: function () {
  var out=$id('i07-out'), v=$id('i07-v'); if(!out) return;
  var POS={
    anunciado:   {n:'Anunciado',    cls:'per', ev:'Comunicado, discurso ou nota de intenção. Nenhuma norma.'},
    proposto:    {n:'Proposto',     cls:'per', ev:'Texto em tramitação, consulta pública aberta ou minuta publicada.'},
    aprovado:    {n:'Aprovado',     cls:'att', ev:'Norma publicada com nome, número e ano. Sem regulamentação de detalhe.'},
    regulamentado:{n:'Regulamentado',cls:'att',ev:'Atos de execução publicados, prazos definidos, obrigação identificável.'},
    operacao:    {n:'Em operação',  cls:'ok',  ev:'Obrigação corrente com resultado apurado e verificável.'}
  };
  var OBJ=[
  {label:'Ajuste de fronteira — regime definitivo', p:'operacao',
   d:'Regime definitivo em vigor desde 1º de janeiro de 2026, sucedendo o período transitório apenas de relato encerrado em dezembro de 2025. Seis setores cobertos.',
   nao:'Não autoriza concluir que há desembolso corrente. A obrigação de 2026 se acumula, mas a venda de certificados só começa em 2027 e há fator de entrada gradual até 2034.',
   gat:'Alteração do rol de setores, do fator de entrada ou do tratamento de emissão indireta.'},
  {label:'Venda de certificados de fronteira', p:'regulamentado',
   d:'Data definida em norma: 1º de fevereiro de 2027. Primeira declaração, referente a importações de 2026, vence em 30 de setembro de 2027.',
   nao:'Não autoriza somar exposição bruta como se fosse caixa de 2026. É o erro nº 17 da seção de erros comuns.',
   gat:'Novo adiamento por regulamento de alteração — já ocorreu uma vez.'},
  {label:'Abatimento por preço de carbono pago na origem', p:'regulamentado',
   d:'Existe em duas vias na norma: preço efetivamente pago, comprovado e certificado; ou preço de referência padrão publicado pela autoridade de destino a partir de 2027. Consulta pública sobre a segunda via encerrada em junho de 2026.',
   nao:'Não autoriza supor abatimento para exportador brasileiro hoje. Não há preço de carbono pago no Brasil, e não haverá antes de 2030 no calendário vigente.',
   gat:'Publicação da lista de preços de referência por país; ou início da fase de transação plena do sistema brasileiro.'},
  {label:'Término antecipado de créditos de eletricidade limpa', p:'operacao',
   d:'Lei orçamentária federal de 4 de julho de 2025. O prazo de início de construção — 4 de julho de 2026 — já venceu. Projetos que não o atingiram precisam entrar em operação até 31 de dezembro de 2027.',
   nao:'Não autoriza concluir que o incentivo acabou para todas as tecnologias. Armazenamento e outras não sofreram o mesmo término, e o tratamento não é uniforme.',
   gat:'Nova lei orçamentária; ou orientação administrativa sobre documentação de início de construção.'},
  {label:'Critério de gasto mínimo de início de construção', p:'operacao',
   d:'Restringido por orientação administrativa em 2025 a instalações solares de pequeno porte; restaurado em 2026 por decisão judicial federal fundada em falha de motivação administrativa.',
   nao:'Não autoriza tratar a questão como encerrada. Decisão judicial de primeira instância é posição vigente, não posição final.',
   gat:'Recurso, nova orientação administrativa motivada, ou norma que consolide o critério.'},
  {label:'Cootimização em tempo real no operador do sul central', p:'operacao',
   d:'Em operação desde 5 de dezembro de 2025. Curvas de demanda por serviço ancilar substituíram a curva de reserva operativa; adicionais de preço passaram a integrar o preço nodal.',
   nao:'Não autoriza concluir que o risco caiu. Preços mais baixos e menos voláteis nos primeiros seis meses são resultado de desenho; clima, combustível e limite de transmissão continuam onde estavam.',
   gat:'Evento climático extremo; ou revisão das curvas de demanda por ancilares.'},
  {label:'Mercado do dia anterior estendido na costa oeste', p:'operacao',
   d:'Publicação de resultados com suficiência de recursos, preços, reservas de desequilíbrio e transferências a partir da data de operação de 1º de maio de 2026.',
   nao:'Não autoriza concluir que houve unificação de política energética. É ampliação de coordenação de mercado, e política de recursos continua estadual.',
   gat:'Entrada ou saída de participantes; ou mudança em programa estadual de adequação.'},
  {label:'Teto de preço do leilão de capacidade do meio-atlântico', p:'operacao',
   d:'Acordado entre os governadores dos estados da região e o regulador federal; vigente nas entregas 2026/2027 a 2028/2029 e estendido até a entrega 2029/2030.',
   nao:'Não autoriza ler o preço de fechamento como preço de mercado. O operador estima que, sem teto, todas as zonas teriam fechado em patamar cerca de 70% acima.',
   gat:'Fim do acordo; ou reforma da curva de demanda ou da metodologia de acreditação.'},
  {label:'Meta de 70% do consumo transacionado até 2030', p:'aprovado',
   d:'Opiniões de implementação sobre o sistema nacional unificado de mercado de eletricidade, publicadas pelo gabinete do conselho de Estado em fevereiro de 2026. Unificação plena declarada para 2035.',
   nao:'Não autoriza tratar 70% como resultado. O valor apurado para 2025 é cerca de 64% do consumo, e a meta é normativa, não realizada.',
   gat:'Regras provinciais de implementação; ou revisão no próximo ciclo de planejamento.'},
  {label:'Sistema brasileiro de comércio de emissões', p:'regulamentado',
   d:'Lei nº 15.042/2024. Cronograma público: normas infralegais da primeira fase até dezembro de 2026, relato de emissões a partir de 2027, teto e plano nacional de alocação em 2030, consolidação em 2031.',
   nao:'Não autoriza supor preço de carbono brasileiro disponível para abatimento em mecanismo de fronteira. Estágio: <b>regulado e não construído</b>.',
   gat:'Publicação das normas infralegais; ou alteração do cronograma pela secretaria responsável.'}
  ];
  chips('i07-obj', OBJ.map(function(o){ return {label:o.label, o:o}; }), function(it){
    var o=it.o, p=POS[o.p];
    out.innerHTML = gcmp([
      ['Posição na régua', '<b>'+esc(p.n)+'</b>'],
      ['Evidência que a posição exige', esc(p.ev)],
      ['Estado verificado em 04·08·2026', esc(o.d)],
      ['Gatilho que mudaria a posição', esc(o.gat)]
    ]);
    verdict(v, p.cls, '<b>O que esta posição não autoriza concluir.</b> '+o.nao+
      ' <br><br>A régua de cinco posições é construção do Módulo 16 e aqui é <b>citada, não reconstruída</b>. '+
      'A diferença entre este módulo e o anterior é a categoria de perecibilidade: lá era o estágio de uma '+
      'tecnologia; aqui é <b>política de governo estrangeiro</b>, que é a mais volátil das três parcelas.');
  });
},
/* ── m17-inst-08 · Verificador de pressuposto institucional — corpo da IIFE, verbatim (L4793–L4897) ── */
i08: function () {
  var out=$id('i08-out'), v=$id('i08-v'); if(!out) return;
  var E={
    ok:  {t:'existe',                 c:'<span class="jtag uni">ocupada</span>'},
    dif: {t:'existe, natureza distinta',c:'<span class="jtag adm">ocupada com outra natureza</span>'},
    aus: {t:'ausente',                c:'<span class="jtag nod" style="color:var(--rd);border-color:var(--rd-line);background:var(--rd-dim)">ausente</span>'}
  };
  var MEC=[
  {label:'Mercado central de capacidade',
   f:[['Operar','Cálculo de requisito de confiabilidade com modelo probabilístico auditável','ok',
       'Distribuída entre planejador federal e operador de sistema'],
      ['Contabilizar','Acreditação de cada recurso por contribuição marginal à confiabilidade, com metodologia publicada','dif',
       'Existe como garantia física, apurada por metodologia distinta e com finalidade contratual'],
      ['Liquidar','Curva de demanda administrada que forma preço separado para o atributo disponibilidade','aus',
       'O instrumento brasileiro não forma preço separado: embute o atributo no preço da energia contratada'],
      ['Fiscalizar','Penalidade crível por não-desempenho em momento de estresse','dif',
       'Existe vinculada a contrato e a lastro, não a um produto de capacidade'],
      ['Financiar','Recuperação do custo junto ao consumidor por meio do agente supridor','ok',
       'Estrutura de encargo setorial cumpre função equivalente']],
   s:'<b>Duas das cinco funções mudariam de natureza.</b> A resposta a &ldquo;o Brasil deveria adotar?&rdquo; não é sim nem não: é que a adoção criaria um preço separado para um atributo que hoje é embutido, e trocaria a apuração de garantia física por acreditação probabilística. Ambas são escolhas de desenho com custo e benefício próprios.'},
  {label:'Preço nodal com direitos financeiros de transmissão',
   f:[['Operar','Cálculo de preço por ponto, com decomposição em energia, congestionamento e perdas','dif',
       'Existe capacidade de modelagem de rede; o preço publicado é uniforme por submercado por escolha de desenho'],
      ['Contabilizar','Emissão e alocação de direitos financeiros entre pares de pontos','aus',
       'Não há instrumento equivalente; o risco locacional interno ao submercado não é precificado'],
      ['Liquidar','Regra de suficiência de receita do conjunto de direitos emitidos','aus',
       'Depende do anterior'],
      ['Fiscalizar','Monitor de mercado com poder de mitigação de oferta','aus',
       'O despacho por custo declarado torna o problema estruturalmente menor; a função não existe na mesma forma'],
      ['Julgar','Instância de disputa sobre alocação e sobre congestionamento','dif',
       'Agência reguladora e judiciário cumprem a função com procedimento diverso']],
   s:'<b>Três funções ausentes.</b> Importar preço nodal sem o mercado de direitos financeiros transferiria risco de base a agentes sem instrumento de proteção. A pergunta operacional não é se o preço nodal é melhor: é se o ganho de sinal locacional compensa criar três instituições.'},
  {label:'Despacho por oferta',
   f:[['Operar','Otimização por ofertas de preço, com programação do dia anterior e ajuste em tempo real','dif',
       'Existe otimização; o insumo é custo apurado ou modelado, não oferta de preço'],
      ['Contabilizar','Registro de ofertas e apuração de exercício de poder de mercado','aus',
       'Não aplicável ao regime vigente'],
      ['Fiscalizar','Monitor de mercado independente com poder de mitigação de oferta','aus',
       'É o pressuposto central e não tem equivalente direto'],
      ['Julgar','Instância de revisão de decisão de mitigação','aus','Depende do anterior'],
      ['Financiar','Nenhuma função específica','ok','Não há requisito adicional']],
   s:'<b>O pressuposto central está ausente.</b> Despacho por oferta sem monitor de mercado com poder de mitigação não é um mercado mais liberal: é um mercado sem defesa. E a escolha entre os dois regimes é condicionada pela dotação — num sistema com estocagem plurianual, a oferta descentralizada precificaria um recurso comum intertemporal.'},
  {label:'Mercado só de energia com preço de escassez',
   f:[['Operar','Curva administrada que precifica escassez de reserva dentro do despacho','dif',
       'Existe custo de déficit e mecanismo de aversão a risco, com formulação diversa'],
      ['Liquidar','Exposição plena do consumidor ao preço de escassez','dif',
       'Existe teto regulatório de preço, o que é escolha oposta'],
      ['Fiscalizar','Nenhuma função de adequação central','ok','Compatível'],
      ['Julgar','Compromisso crível de não intervir no preço em evento extremo','aus',
       'Não é uma instituição formal e não tem titular a quem cobrar. É o pressuposto mais frágil deste módulo'],
      ['Financiar','Gestão de risco e crédito para receita concentrada em eventos raros','aus',
       'Mercado de derivativos de energia de profundidade insuficiente para essa função']],
   s:'<b>O pressuposto decisivo não é uma instituição — é uma expectativa.</b> Se o preço extremo é revertido administrativamente no primeiro evento, a receita que justificava o investimento em ponta desaparece sem que nenhuma regra tenha sido alterada.'},
  {label:'Sistema de teto e comércio',
   f:[['Operar','Definição de teto e de plano de alocação','dif',
       'Previsto em lei; plano nacional de alocação programado para 2030'],
      ['Contabilizar','Medição, relato e verificação por instalação','dif',
       'Relato obrigatório previsto a partir de 2027; hoje o regime é voluntário e fragmentado'],
      ['Liquidar','Registro central e mercado secundário de ativos','dif',
       'Previsto em lei; não construído'],
      ['Fiscalizar','Verificação acreditada por terceiro','dif',
       'Existe como serviço privado, não como sistema reconhecido'],
      ['Julgar','Instância de disputa sobre alocação e conformidade','dif','Estrutura prevista, não instalada']],
   s:'<b>Cinco funções previstas e nenhuma em operação.</b> É a definição de <b>regulado e não construído</b> na régua do Módulo 16 — e é por isso que não há preço de carbono pago no Brasil para abater em mecanismo de fronteira.'},
  {label:'Ajuste de fronteira, pelo lado do exportador',
   f:[['Operar','Enquadramento aduaneiro em oito dígitos por embarque','dif',
       'Existe estrutura aduaneira; a informação raramente está organizada para essa finalidade na empresa'],
      ['Contabilizar','Medição, relato e verificação de intensidade por instalação e por produto','aus',
       'Regime obrigatório só a partir de 2027; sem isso, aplicam-se valores padrão com acréscimo deliberado'],
      ['Fiscalizar','Verificação acreditada por terceiro reconhecido pela autoridade de destino','dif',
       'Existe como serviço privado; o reconhecimento é da autoridade estrangeira, não brasileira'],
      ['Liquidar','Preço de carbono efetivamente pago, comprovável e certificável','aus',
       'Não existe e não existirá antes de 2030 no calendário vigente'],
      ['Financiar','Nenhuma função específica','ok','Não há requisito adicional']],
   s:'<b>Duas funções ausentes, e a segunda é a que decide a exposição.</b> Sem preço pago na origem, resta a via de preço de referência publicado pela autoridade de destino. E o ativo mais urgente para um exportador não é uma usina: é o sistema de medição que evita o valor padrão.'},
  {label:'Contrato por diferença com prêmio regulado',
   f:[['Operar','Definição do preço de referência e do produto elegível','ok',
       'Estrutura de leilão regulado cumpre função equivalente'],
      ['Contabilizar','Apuração da diferença entre preço de referência e preço de mercado','dif',
       'Existe apuração contratual; o instrumento brasileiro estabiliza receita pelo próprio contrato de leilão'],
      ['Liquidar','Fluxo bidirecional entre gerador e contraparte pública','dif','Fluxo unidirecional no arranjo vigente'],
      ['Fiscalizar','Verificação de entrega e de disponibilidade','ok','Existe'],
      ['Financiar','Contraparte pública com capacidade de absorver o fluxo em ambas as direções','dif',
       'Existe estrutura de encargo; a bidirecionalidade exigiria desenho fiscal próprio']],
   s:'<b>Nenhuma função ausente — as duas arquiteturas fazem a mesma coisa.</b> Leilão regulado de longo prazo e contrato por diferença estabilizam receita com titularidade e alocação de risco diferentes. É o caso em que a comparação revela equivalência funcional, e concluir superioridade seria erro de atribuição.'},
  {label:'Planejamento estatal com financiamento dirigido',
   f:[['Operar','Autoridade central de planejamento com horizonte plurianual e metas vinculantes','dif',
       'Existe planejamento indicativo com horizonte decenal; as metas não são vinculantes do mesmo modo'],
      ['Contabilizar','Metas territoriais com responsabilidade administrativa atribuída','aus','Não há equivalente'],
      ['Fiscalizar','Autoridade de desapropriação e de licenciamento com prazo compatível','aus',
       'Estrutura federativa e ambiental impõe prazo e contraditório de outra natureza'],
      ['Financiar','Capacidade de financiamento estatal em escala e cadeia industrial doméstica','aus',
       'É o pressuposto real, e o menos importável de todos os listados neste instrumento'],
      ['Julgar','Contencioso limitado sobre decisão de planejamento','aus','Incompatível com o desenho constitucional vigente']],
   s:'<b>Quatro funções ausentes, e a diferença não é de desenho de mercado.</b> É capacidade fiscal e industrial, que se comporta como dotação por não ser importável no horizonte de uma decisão de investimento. Isto não é juízo sobre a política de ninguém: é a constatação de que copiar a meta sem a capacidade de execução produz proteção sem produtividade.'}
  ];
  chips('i08-mec', MEC.map(function(m){ return {label:m.label, m:m}; }), function(it){
    var m=it.m;
    out.innerHTML = gcmp(m.f.map(function(row){
      return [ row[0]+' — '+row[1], E[row[2]].c+'<br>'+esc(row[3]) ];
    }));
    var aus=m.f.filter(function(r){ return r[2]==='aus'; }).length;
    verdict(v, aus>=3?'per':(aus>=1?'att':'ok'), m.s+
      ' <br><br><b>Funções ausentes: '+aus+' de '+m.f.length+'.</b> O mapa institucional brasileiro usado como '+
      'gabarito é o do <b>Módulo 07</b> e não é reensinado aqui.');
  });
},
/* ── m17-inst-09 · Calculadora de ajuste de fronteira — corpo da IIFE, verbatim (L4904–L4963) ── */
i09: function () {
  var wrap=$id('i09-f'), r=$id('i09-r'), v=$id('i09-v'); if(!wrap) return;
  var SET=[
   {label:'Ferro e aço',   k:'aco',  ind:false},
   {label:'Alumínio',      k:'alu',  ind:false},
   {label:'Cimento',       k:'cim',  ind:true},
   {label:'Fertilizantes', k:'fer',  ind:true}
  ];
  var CFG=[
   {id:'i09-vol', label:'Volume exportado',            unit:'kt/ano',      val:100, min:0, max:2000, step:1},
   {id:'i09-dir', label:'Intensidade direta',          unit:'tCO₂e/t',     val:1.6, min:0, max:12,   step:0.01},
   {id:'i09-ind', label:'Intensidade indireta (eletricidade)', unit:'tCO₂e/t', val:0.25, min:0, max:12, step:0.01},
   {id:'i09-pc',  label:'Preço do certificado',        unit:'€/t',         val:75,  min:0, max:250,  step:0.01},
   {id:'i09-fe',  label:'Fator de entrada gradual',    unit:'%',           val:5,   min:0, max:100,  step:0.5},
   {id:'i09-or',  label:'Preço de carbono pago na origem', unit:'€/t',     val:0,   min:0, max:250,  step:0.01}
  ];
  wrap.innerHTML = CFG.map(field).join('');
  var setor=SET[0];
  function calc(){
    var vol=readVal(CFG[0])*1000, dir=readVal(CFG[1]), ind=readVal(CFG[2]),
        pc=readVal(CFG[3]), fe=readVal(CFG[4])/100, or=readVal(CFG[5]);
    var intens = dir + (setor.ind ? ind : 0);
    var tco2   = vol*intens;
    var bruto  = tco2*pc;
    var comFe  = bruto*fe;
    var liq    = tco2*Math.max(0, pc-or)*fe;
    var porT   = vol>0 ? liq/vol : 0;
    r.innerHTML =
      ro('Base contabilizada', nfmt(tco2/1000,1),'kt CO₂e')+
      ro('Exposição bruta','€ '+nfmt(bruto/1e6,2),'mi')+
      ro('Com fator de entrada','€ '+nfmt(comFe/1e6,2),'mi','gold')+
      ro('Após abatimento','€ '+nfmt(liq/1e6,2),'mi','gold')+
      ro('Por tonelada','€ '+nfmt(porT,2),'/t')+
      ro('Indireta contabilizada', setor.ind?'sim':'não','', 'sm');
    var razao = comFe>0 ? bruto/comFe : 0;
    var msgInd = setor.ind
      ? '<b>Neste setor a emissão indireta de eletricidade É contabilizada.</b> Ela entra na base, e a parcela '+
        'elétrica passa a importar diretamente para a exposição.'
      : '<b>Neste setor a emissão indireta de eletricidade NÃO é contabilizada</b> no regime definitivo. '+
        'Mude o campo de intensidade indireta e observe que o resultado não se move: para ferro, aço e '+
        'alumínio, a parcela elétrica está fora da obrigação — e é justamente a parcela que uma análise de '+
        'energia otimizaria. Dizer isso contraria o interesse de quem escreve este módulo, e é o dado correto.';
    verdict(v,'att',
      '<b>Isto não é um imposto sobre o produto.</b> É a obrigação de adquirir certificados correspondentes ao '+
      'carbono incorporado, com preço vinculado ao sistema doméstico de teto e comércio do país de destino, '+
      'devida pelo <b>importador</b> — a incidência econômica sobre o exportador depende do poder de barganha '+
      'na cadeia, que este instrumento não modela.'+
      '<br><br>'+msgInd+
      (razao>1.5 ? '<br><br><b>Exposição bruta é '+nfmt(razao,1)+'× a obrigação do período.</b> Somar bruto sem '+
        'o fator de entrada é o erro nº 17 e ele muda a ordem de grandeza da conta, não a margem.' : '')+
      (or>0 ? '<br><br><b>Atenção ao abatimento.</b> Você lançou preço pago na origem. Verifique se ele é '+
        'comprovável e certificável: no Brasil não há preço de carbono pago hoje, e a via de preço de '+
        'referência padrão só começa em 2027.' : '')+
      '<br><br><b>Antes de tudo isto</b>, verifique o enquadramento em oito dígitos. Se o produto não estiver na '+
      'lista, nenhum destes números existe.');
  }
  chips('i09-set', SET.map(function(s){ return {label:s.label, s:s}; }), function(it){
    setor=it.s; calc();
  });
  bindFields(CFG, calc);
  calc();
},
/* ── m17-inst-10 · Decompositor de penetração renovável — corpo da IIFE, verbatim (L4970–L5026) ── */
i10: function () {
  var wrap=$id('i10-f'), r=$id('i10-r'), v=$id('i10-v'); if(!wrap) return;
  var CFG=[
   {id:'i10-cr', label:'Capacidade renovável',     unit:'GW',  val:140, min:0,  max:4000, step:0.1},
   {id:'i10-ct', label:'Capacidade total',         unit:'GW',  val:250, min:1,  max:5000, step:0.1},
   {id:'i10-gr', label:'Geração renovável',        unit:'TWh', val:190, min:0,  max:8000, step:1},
   {id:'i10-gt', label:'Geração total',            unit:'TWh', val:520, min:1,  max:12000,step:1},
   {id:'i10-pk', label:'Pico instantâneo de participação', unit:'%', val:78, min:0, max:100, step:0.1},
   {id:'i10-cu', label:'Corte de geração renovável',unit:'TWh', val:12, min:0,  max:2000, step:0.1},
   {id:'i10-sx', label:'Saldo importador líquido',  unit:'TWh', val:45, min:-2000, max:2000, step:0.1}
  ];
  wrap.innerHTML = CFG.map(field).join('');
  function calc(){
    var cr=readVal(CFG[0]), ct=readVal(CFG[1]), gr=readVal(CFG[2]), gt=readVal(CFG[3]),
        pk=readVal(CFG[4]), cu=readVal(CFG[5]), sx=readVal(CFG[6]);
    if(cr>ct) cr=ct; if(gr>gt) gr=gt;
    var n1 = ct>0 ? cr/ct*100 : 0;
    var n2 = gt>0 ? gr/gt*100 : 0;
    var n3 = pk;
    /* n4: importação tratada como não renovável; exportação abatida da parcela renovável */
    var consumo, renCons;
    if(sx>=0){ consumo = gt+sx;                renCons = gr; }
    else      { consumo = Math.max(1e-9,gt+sx); renCons = Math.max(0, gr+sx); }
    var n4 = consumo>0 ? renCons/consumo*100 : 0;
    var disp = gr+cu;
    var perda = disp>0 ? cu/disp*100 : 0;
    var arr=[n1,n2,n3,n4];
    var mx=Math.max.apply(null,arr), mn=Math.min.apply(null,arr);
    var razao = mn>0 ? mx/mn : Infinity;
    r.innerHTML =
      ro('1 · Capacidade instalada', nfmt(n1,1),'%')+
      ro('2 · Geração no ano',       nfmt(n2,1),'%')+
      ro('3 · Pico instantâneo',     nfmt(n3,1),'%')+
      ro('4 · Consumida líquida',    nfmt(n4,1),'%','gold')+
      ro('Corte sobre disponível',   nfmt(perda,1),'%')+
      ro('Maior ÷ menor', isFinite(razao)?nfmt(razao,2)+'×':'—','','sm');
    var msg='<b>Este instrumento recusa reportar um número isolado.</b> Os quatro medem coisas diferentes e '+
      'nenhum deles é &ldquo;a penetração renovável&rdquo;. ';
    if(isFinite(razao) && razao>=1.4){
      msg += 'Com os valores lançados, o maior é <b>'+nfmt(razao,2)+'× o menor</b> — e essa razão é, na prática, '+
        'o tamanho do erro que uma citação sem rótulo comete.';
    } else {
      msg += 'Com os valores lançados os quatro estão próximos, o que é incomum e normalmente indica um sistema '+
        'com pouca fonte variável, pouco corte de geração e intercâmbio pequeno.';
    }
    msg += '<br><br><b>Regra de atribuição usada no número 4, declarada:</b> importação tratada como não '+
      'renovável; exportação abatida da parcela renovável. É uma convenção conservadora, e outra convenção '+
      'produz outro número — por isso ela precisa ser declarada junto com o valor, e não depois.';
    if(perda>=8) msg += '<br><br><b>Corte de geração elevado.</b> Quando o corte é grande, o número 2 descreve '+
      'o que o sistema conseguiu escoar, não o que ele conseguiria produzir. Um fator de utilização comparado '+
      'sem separar corte atribui à tecnologia um efeito que é da rede.';
    if(sx>0) msg += '<br><br><b>Sistema importador líquido.</b> Parte da adequação foi resolvida fora da '+
      'fronteira. Um sistema com alta penetração e interconexão forte não demonstrou a mesma coisa que um '+
      'sistema com alta penetração e interconexão fraca.';
    verdict(v,'att', msg);
  }
  bindFields(CFG, calc);
  calc();
},
/* ── m17-inst-11 · Normalizador de preço ao consumidor — corpo da IIFE, verbatim (L5033–L5078) ── */
i11: function () {
  var wrap=$id('i11-f'), r=$id('i11-r'), v=$id('i11-v'); if(!wrap) return;
  var CFG=[
   {id:'i11-ae', label:'A · energia',            unit:'un/MWh', val:40, min:0, max:400, step:0.5},
   {id:'i11-ar', label:'A · transporte e encargos',unit:'un/MWh', val:45, min:0, max:400, step:0.5},
   {id:'i11-at', label:'A · tributos não recuperáveis', unit:'un/MWh', val:12, min:0, max:400, step:0.5},
   {id:'i11-be', label:'B · energia',            unit:'un/MWh', val:65, min:0, max:400, step:0.5},
   {id:'i11-br', label:'B · transporte e encargos',unit:'un/MWh', val:20, min:0, max:400, step:0.5},
   {id:'i11-bt', label:'B · tributos não recuperáveis', unit:'un/MWh', val:8,  min:0, max:400, step:0.5}
  ];
  wrap.innerHTML = CFG.map(field).join('');
  function calc(){
    var ae=readVal(CFG[0]), ar=readVal(CFG[1]), at=readVal(CFG[2]),
        be=readVal(CFG[3]), br=readVal(CFG[4]), bt=readVal(CFG[5]);
    var c1a=ae,          c1b=be;
    var c2a=ae+ar,       c2b=be+br;
    var c3a=ae+ar+at,    c3b=be+br+bt;
    function d(a,b){ return b!==0 ? (a-b)/b*100 : 0; }
    function cheaper(a,b){ return a<b?'A':(a>b?'B':'empate'); }
    r.innerHTML =
      ro('Só energia', nfmt(c1a,1)+' vs '+nfmt(c1b,1),'','sm')+
      ro('+ transporte e encargos', nfmt(c2a,1)+' vs '+nfmt(c2b,1),'','sm')+
      ro('Fatura cheia', nfmt(c3a,1)+' vs '+nfmt(c3b,1),'','sm gold')+
      ro('Δ só energia', nfmt(d(c1a,c1b),1),'%')+
      ro('Δ fatura cheia', nfmt(d(c3a,c3b),1),'%')+
      ro('Mais barato na cheia', cheaper(c3a,c3b),'','sm');
    var inv = cheaper(c1a,c1b)!==cheaper(c3a,c3b) && cheaper(c1a,c1b)!=='empate' && cheaper(c3a,c3b)!=='empate';
    var msg;
    if(inv){
      msg='<b>A ordenação inverte entre camadas.</b> Na camada de energia, '+cheaper(c1a,c1b)+' é mais barato; '+
        'na fatura cheia, '+cheaper(c3a,c3b)+' é. As duas afirmações são verdadeiras e descrevem a mesma dupla '+
        'de consumidores. <b>É a primeira declaração de perímetro em forma de número</b>, e é a razão de a '+
        'pergunta &ldquo;o que exatamente está dentro?&rdquo; vir antes de qualquer conclusão.';
    } else {
      msg='<b>A ordenação se mantém entre camadas com estes valores.</b> Isso não dispensa a declaração: mude '+
        'transporte e encargos de um dos lados e observe a inversão aparecer. A robustez da conclusão à mudança '+
        'de perímetro é ela própria um resultado que precisa ser reportado.';
    }
    verdict(v,'att', msg+
      '<br><br><b>Este instrumento ainda não conclui nada.</b> Faltam as outras cinco declarações: classe e '+
      'fator de carga do consumidor, mercado que formou cada parcela, estatística e período, tratamento '+
      'simétrico de tributo recuperável, e base cambial única. As unidades acima são deliberadamente '+
      '<b>adimensionais</b> — se elas trouxessem símbolo de moeda, o instrumento estaria fingindo uma conversão '+
      'que ele não fez.');
  }
  bindFields(CFG, calc);
  calc();
},
/* ── m17-inst-12 · Instrumento · Verificador de comparação · instrumento assinatura — corpo da IIFE, verbatim (L5085–L5173) ── */
i12: function () {
  var out=$id('i12-out'), nav=$id('i12-nav'); if(!out) return;
  var CAT={
    per:{n:'Perímetro não declarado', cls:'per'},
    atr:{n:'Atribuição errada',       cls:'att'},
    ins:{n:'Pressuposto omitido',     cls:'att'},
    uni:{n:'Unidade inconsistente',   cls:'per'}
  };
  var E=[
  {c:'per', e:'&ldquo;O preço médio de atacado deles foi de €89/MWh no ano passado; o nosso ficou bem abaixo disso.&rdquo;',
   falta:'Camada, consumidor, mercado de formação, estatística, período e desenho. Um dos números é média aritmética horária de mercado de ofertas; o outro é valor de liquidação de diferenças que a carga contratada não paga.',
   perg:'O que exatamente está dentro de cada um desses dois números, e qual dos dois alguém efetivamente desembolsa?',
   corr:'Dois valores de atacado, formados por processos de naturezas distintas, foram observados no mesmo ano. Nenhum dos dois corresponde ao custo de um consumidor industrial, e eles não são comparáveis entre si sem reconstrução das camadas.'},
  {c:'per', e:'&ldquo;A tarifa industrial média lá é 30% menor que a brasileira.&rdquo;',
   falta:'Quais camadas cada tarifa inclui, qual nível de tensão, qual fator de carga, e se os tributos são recuperáveis dos dois lados.',
   perg:'Essa tarifa inclui transporte, encargos e tributos? E o tributo é recuperável pela indústria em qual dos dois países?',
   corr:'Dois agregados chamados &ldquo;tarifa industrial média&rdquo; diferem em 30%. A composição setorial, o nível de tensão e o tratamento tributário de cada agregado precisam ser reconstruídos antes de qualquer leitura.'},
  {c:'per', e:'&ldquo;Naquele nó o preço chegou a dez vezes a média — a energia lá é caríssima.&rdquo;',
   falta:'A sétima declaração. Preço nodal é o custo de atender mais um megawatt <b>naquele ponto</b>, com congestionamento e perdas dentro. Não é o preço de uma região nem de um país.',
   perg:'Esse é o preço de um ponto ou de uma área? E qual parcela dele é congestionamento?',
   corr:'Num ponto específico da rede, o preço superou em dez vezes a média do sistema numa hora congestionada. Isso descreve uma restrição de rede localizada, não o custo da energia naquela jurisdição.'},
  {c:'atr', e:'&ldquo;A matriz deles é quase toda de baixo carbono — deveríamos estudar o modelo de mercado deles.&rdquo;',
   falta:'A decomposição. Quando a baixa emissão vem de uma frota nuclear construída em décadas, ou de uma bacia hidrográfica continental, a parcela de desenho de mercado explica quase nada.',
   perg:'Quanto disso é dotação, quanto é desenho e quanto é política — e qual das três não explica nada?',
   corr:'A intensidade de emissão daquele sistema é explicada predominantemente por política de longo prazo e por dotação. A arquitetura de mercado é a parcela que menos contribui, e portanto não é o objeto de estudo indicado para essa diferença.'},
  {c:'atr', e:'&ldquo;Eles têm recurso solar excelente, então é o melhor lugar do mundo para investir em solar.&rdquo;',
   falta:'A distinção entre competitividade em custo e competitividade em receita. Recurso é dotação; receita depende de preço capturado, que cai com canibalização e com corte de geração.',
   perg:'Qual o preço capturado por essa fonte, e qual o corte de geração observado?',
   corr:'Aquela jurisdição tem custo de geração solar entre os mais baixos do mundo. A receita de um projeto ali depende separadamente de risco de perfil, diferença de preço entre pontos, corte de geração e prazo de conexão.'},
  {c:'atr', e:'&ldquo;Depois da mudança de governo, o modelo de mercado deles virou outro.&rdquo;',
   falta:'A separação entre política e desenho. Governo altera a parcela de política; raramente altera desenho no mesmo mandato; nunca altera dotação.',
   perg:'Qual instrumento mudou, aprovado por qual instituição, com qual prazo — e o desenho de despacho ou de formação de preço foi alterado?',
   corr:'Créditos tributários e critérios de elegibilidade foram alterados por lei, ordem executiva, orientação administrativa e decisão judicial num período de um ano. O desenho de mercado — despacho por oferta, preço nodal, leilão de capacidade — não foi alterado.'},
  {c:'ins', e:'&ldquo;O mecanismo de capacidade deles funciona; bastaria copiar a regra aqui.&rdquo;',
   falta:'As cinco funções institucionais: cálculo de requisito, acreditação probabilística, curva de demanda administrada, leilão com obrigação e penalidade crível.',
   perg:'Quem calcula o requisito, quem acredita cada recurso, quem define a curva de demanda, quem penaliza — e quem faz cada uma dessas coisas aqui?',
   corr:'O mecanismo depende de cinco funções institucionais. No arranjo brasileiro, duas delas mudariam de natureza: o atributo passaria a ter preço separado, e a apuração de garantia física seria substituída por acreditação probabilística.'},
  {c:'ins', e:'&ldquo;Eles conseguem construir muito mais rápido; é uma questão de desburocratizar.&rdquo;',
   falta:'O pressuposto real: financiamento estatal em escala, cadeia industrial doméstica, autoridade territorial e coordenação de longo prazo. Nenhum é importável por norma.',
   perg:'Que capacidade de financiamento e que cadeia industrial sustentam essa velocidade, e qual instituição as detém?',
   corr:'A velocidade de execução depende de uma combinação de capacidade fiscal, cadeia industrial e autoridade territorial. Essa combinação se comporta como dotação para efeito de decisão, por não ser replicável no horizonte de um investimento.'},
  {c:'ins', e:'&ldquo;Preço nodal dá o sinal certo; é só publicar preço por nó aqui.&rdquo;',
   falta:'O mercado de direitos financeiros de transmissão, com emissão, alocação, negociação, liquidação e regra de suficiência de receita — cinco funções que só existem porque o preço é nodal.',
   perg:'Com que instrumento um consumidor se protege da diferença entre o ponto contratado e o ponto consumido?',
   corr:'Publicar preço nodal sem o instrumento de proteção locacional transferiria risco de base a agentes sem hedge disponível. O ganho de sinal locacional precisa ser pesado contra o custo de criar as instituições correspondentes.'},
  {c:'uni', e:'&ldquo;Quase metade da capacidade deles já é eólica e solar — o carvão foi superado.&rdquo;',
   falta:'A distinção entre potência e energia. É o número 1 da escada — capacidade instalada. É compatível com térmica ainda majoritária em geração no mesmo ano.',
   perg:'Esse número é capacidade instalada ou geração? E qual o fator de utilização de cada fonte?',
   corr:'Eólica e solar respondem por cerca de metade da capacidade instalada daquele sistema. A participação em geração é substancialmente menor, e a capacidade térmica pode crescer enquanto o seu fator de utilização cai.'},
  {c:'uni', e:'&ldquo;A meta deles para 2030 é bem mais ambiciosa que o nosso resultado de 2025.&rdquo;',
   falta:'A separação entre meta, política adotada e resultado verificado. São três estágios distintos da mesma régua.',
   perg:'Estamos comparando meta com meta, ou meta com resultado? E em que posição da régua de estágio está o instrumento que sustenta a meta?',
   corr:'A meta normativa daquela jurisdição para 2030 é superior ao resultado brasileiro apurado em 2025. Comparar as duas grandezas exige, antes, classificar o instrumento que sustenta a meta entre anunciado, aprovado e regulamentado.'},
  {c:'uni', e:'&ldquo;Ajustando pelo poder de compra, a energia industrial deles é mais cara que a nossa.&rdquo;',
   falta:'A base cambial correta para a pergunta. Paridade de poder de compra responde a acessibilidade doméstica; competitividade industrial exportadora, dívida em moeda forte e equipamento importado correm em câmbio nominal.',
   perg:'A pergunta é sobre acessibilidade na renda local ou sobre competitividade de um produto exportado?',
   corr:'Em paridade de poder de compra, o custo daquela energia pesa mais na renda local. Em câmbio nominal, que é a base pertinente para competitividade exportadora, a comparação precisa ser refeita.'}
  ];
  var filtro='todos', idx=0;
  function lista(){ return filtro==='todos' ? E : E.filter(function(x){ return x.c===filtro; }); }
  function render(){
    var L=lista();
    if(L.length===0){ out.innerHTML=''; nav.innerHTML=''; return; }
    if(idx>=L.length) idx=0; if(idx<0) idx=L.length-1;
    var x=L[idx], c=CAT[x.c];
    out.innerHTML =
      '<div class="tl-panel"><div class="yr">Enunciado '+(idx+1)+' de '+L.length+' &middot; verdadeiro e insuficiente</div>'+
// gridalpha-detect-disable-next-line no-pure-black-white — estilo inline do script da fonte; simplificar() o remove, nunca chega à tela
      '<p style="font-size:15px;color:#fff;line-height:1.6;margin:10px 0 4px">'+x.e+'</p></div>'+
      gcmp([
        ['Defeito dominante', '<b>'+esc(c.n)+'</b>'],
        ['O que exatamente falta', x.falta],
        ['A pergunta que você faz', '<b>'+esc(x.perg)+'</b>'],
        ['Forma corrigida do enunciado', esc(x.corr)]
      ]);
    nav.innerHTML =
      '<button type="button" class="btn ghost" data-d="-1">&larr; anterior</button>'+
      '<button type="button" class="btn" data-d="1">próximo &rarr;</button>';
  }
  nav.addEventListener('click', function(ev){
    var b=ev.target.closest('button'); if(!b) return;
    idx += parseInt(b.getAttribute('data-d'),10); render();
  });
  chips('i12-fil', [
    {label:'Todos', k:'todos'},
    {label:'Perímetro', k:'per'},
    {label:'Atribuição', k:'atr'},
    {label:'Pressuposto', k:'ins'},
    {label:'Unidade', k:'uni'}
  ], function(it){ filtro=it.k; idx=0; render(); });
  render();
},
};
}

/* ── ambiente mínimo do M17: um `document` para o script verbatim rodar ──
   O script do M17 é UMA IIFE com os utilitários dentro ($id, chips, field,
   bindFields, readVal, ro, gcmp, verdict) e um segundo <script> que os
   recebe por window.M17. Aqui os utilitários e os dados vêm verbatim dentro de
   `criarFonte(document, window)`, e o `document` é este: getElementById devolve
   um elemento que guarda innerHTML/className/value e os ouvintes que o script
   registra. A escolha do aluno chega como o clique que a página receberia
   (`gatilhos`): no chip (`data-i`), na linha (`data-k`), na navegação (`data-d`).
   Nada aqui calcula. */
function criarDocumento(entradas) {
  const els = {};
  const lista = () => {
    const s = new Set();
    return { add: (c) => s.add(c), remove: (c) => s.delete(c), contains: (c) => s.has(c), toggle: (c, f) => ((f ?? !s.has(c)) ? s.add(c) : s.delete(c)) };
  };
  const novo = (id) => {
    const v = entradas[id];
    const ouvintes = {};
    const el = {
      id,
      innerHTML: '',
      _texto: null,
      className: '',
      value: v === undefined || v === null ? '' : String(v),
      style: {},
      classList: lista(),
      _ouvintes: ouvintes,
      addEventListener(t, fn) { (ouvintes[t] ??= []).push(fn); },
      getAttribute: () => null,
      setAttribute() {},
      querySelector: () => null,
      querySelectorAll: () => [],
    };
    Object.defineProperty(el, 'textContent', {
      get() { return this._texto ?? this.innerHTML.replace(/<[^>]+>/g, ''); },
      set(t) { this._texto = String(t); this.innerHTML = String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;'); },
    });
    return el;
  };
  const document = {
    getElementById: (id) => (els[id] ??= novo(id)),
    querySelector: () => null,
    querySelectorAll: () => [],
    addEventListener() {},
    documentElement: { scrollHeight: 0, clientHeight: 0, scrollTop: 0 },
  };
  const window = { addEventListener() {} };
  const clicar = (alvo, seletor, attrs) => {
    const el = els[alvo];
    if (!el) return;
    const ev = { target: { closest: (sel) => (sel === seletor ? { getAttribute: (a) => attrs[a] ?? null } : null) } };
    for (const fn of el._ouvintes.click ?? []) fn(ev);
  };
  return { document, window, els, clicar };
}

/** HTML do painel da fonte → HTML curto que a aula v3 renderiza (b, em, br). */
function simplificar(h) {
  let s = String(h);
  s = s.replace(/<div class="p7-n">([\s\S]*?)<\/div>/g, '$1 · ');
  s = s.replace(/<(div|span)\s+class="(?:gk|p7-k|yr|par3-hd|k)"[^>]*>([\s\S]*?)<\/\1>/g, '<b>$2</b><br>');
  s = s.replace(/<\/(div|p|li|tr)>/g, '<br>');
  s = s.replace(/<\/span>\s*<span/g, '</span> · <span');
  s = s.replace(/<(?!\/?(b|strong|em|i|br|sub|sup)\b)[^>]*>/g, '');
  s = s.replace(/<i\b[^>]*><\/i>/g, '');
  s = s.replace(/<br\s*\/?>/g, '<br>');
  s = s.replace(/(\s*<br>\s*){3,}/g, '<br><br>');
  s = s.replace(/^(\s*<br>\s*)+|(\s*<br>\s*)+$/g, '');
  return s.replace(/[ \t\n]+/g, ' ').trim();
}

/** Saídas `ro()` de um contêiner: rótulo e valor como o script escreveu. */
function lerRos(h) {
  return [...String(h).matchAll(/<div class="ro"><div class="k">([\s\S]*?)<\/div><div class="n[^"]*">([\s\S]*?)<\/div><\/div>/g)].map((m) => ({ k: m[1], n: m[2] }));
}
function lerReadout(h) {
  const t = String(h).replace(/<(span|small)[^>]*>[\s\S]*?<\/\1>/g, '').replace(/<[^>]+>/g, '').replace(/^\s*(R\$|US\$|€)\s*/, '').trim();
  // número, e depois só palavras que não começam por dígito ("2,32×", "0 tCO2e alterada");
  // "72,0 vs 80,0", "não", "A" são saída textual (ficam em `textos`)
  const m = t.match(/^(-?[\d.]+(?:,\d+)?)(?: ?[^\d\s]\S*(?: [^\d\s]\S*)*)?$/);
  if (!m) return NaN;
  const v = Number(m[1].replace(/\./g, '').replace(',', '.'));
  return Number.isFinite(v) ? v : NaN;
}
function textoDoReadout(h) {
  return String(h)
    .replace(/<(span|small)[^>]*>([\s\S]*?)<\/\1>/g, (m, t, u) => (u.startsWith('/') || u === '%' ? u : ` ${u}`))
    .replace(/<[^>]+>/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}
function editar(s, editoriais) {
  let r = s;
  for (const [de, para] of editoriais) r = r.split(de).join(para);
  return r;
}

function calcular(chave, entradas, spec, editoriais, extratores) {
  const amb = criarDocumento(entradas);
  const fonte = criarFonte(amb.document, amb.window);
  fonte[chave]();
  for (const g of spec.gatilhos) {
    const v = entradas[g.campo];
    if (v === undefined || v === null || v === '') continue;
    if (g.tipo === 'chips') amb.clicar(g.alvo, '.tl-chip', { 'data-i': String(v) });
    else if (g.tipo === 'linha') { if (String(v) === 'declarada') amb.clicar(g.alvo, '.p7-r', { 'data-k': g.chave }); }
    else if (g.tipo === 'nav') for (let k = 0; k < Number(v); k++) amb.clicar(g.alvo, 'button', { 'data-d': '1' });
  }
  const valores = {};
  const textos = {};
  for (const c of spec.paineisRo) {
    lerRos(amb.document.getElementById(c).innerHTML).forEach((r, i) => {
      valores[`${c}-${i + 1}`] = lerReadout(r.n);
      textos[`${c}-${i + 1}`] = textoDoReadout(r.n);
    });
  }
  const bruto = Object.fromEntries(Object.entries(amb.els).map(([k, e]) => [k, e.innerHTML]));
  for (const [id, ler] of Object.entries(extratores ?? {})) {
    const v = ler(bruto, entradas);
    if (v !== null && v !== undefined) textos[id] = String(v);
  }
  const partes = spec.textos.map((id) => simplificar(bruto[id] ?? '')).filter(Boolean);
  // O script da fonte já formata em pt-BR (toLocaleString): a tela não troca ponto por vírgula.
  return { valores, textos, veredito: editar(partes.join('<br><br>'), editoriais), vereditoPtBr: true, bruto, ros: Object.fromEntries(spec.paineisRo.map((c) => [c, lerRos(bruto[c] ?? '')])) };
}

const EDITORIAIS = [["GridAlpha","NIVAR"],["declarada no &sect;00.6","declarada na abertura do módulo"],["declarada no §00.6","declarada na abertura do módulo"]];

/** Saída de escolha (previsão categórica), lida do HTML que o script escreveu. */
const EXTRATORES = {
  'm17-inst-01': {
    'i01-grupo-brasil': (b) => {
            const r = [...(b['i01-out'] || '').matchAll(/<div class="gk">([^<]*)<\/div><div class="gv">([\s\S]*?)<\/div>/g)].find((x) => x[2].includes('<b>Brasil</b>'));
            return r ? r[1] : null;
          },
  },
  'm17-inst-03': {
    'i03-vinculante': (b) => {
            const m = (b['i03-v'] || '').match(/Parcela vinculante: ([^.<]+)\./);
            return m ? m[1] : null;
          },
  },
  'm17-inst-07': {
    'i07-posicao': (b) => {
            const m = (b['i07-out'] || '').match(/Posição na régua<\/div><div class="gv"><b>([^<]+)<\/b>/);
            return m ? m[1] : null;
          },
  },
  'm17-inst-12': {
    'i12-defeito': (b) => {
            const m = (b['i12-out'] || '').match(/Defeito dominante<\/div><div class="gv"><b>([^<]+)<\/b>/);
            return m ? m[1] : null;
          },
  },
};

export const CALCULADORAS: Record<string, CalculateFn> = {
  'm17-inst-01': (e: Record<string, EntradaInstrumento>) => calcular('i01', e, {"textos":["i01-out","i01-v"],"paineisRo":[],"gatilhos":[{"campo":"i01-dim","tipo":"chips","alvo":"i01-dim"}]}, EDITORIAIS, EXTRATORES['m17-inst-01']),
  'm17-inst-02': (e: Record<string, EntradaInstrumento>) => calcular('i02', e, {"textos":["i02-rows","i02-v"],"paineisRo":[],"gatilhos":[{"campo":"i02-camada","tipo":"linha","alvo":"i02-rows","chave":"camada"},{"campo":"i02-consum","tipo":"linha","alvo":"i02-rows","chave":"consum"},{"campo":"i02-mercado","tipo":"linha","alvo":"i02-rows","chave":"mercado"},{"campo":"i02-granul","tipo":"linha","alvo":"i02-rows","chave":"granul"},{"campo":"i02-tribut","tipo":"linha","alvo":"i02-rows","chave":"tribut"},{"campo":"i02-cambio","tipo":"linha","alvo":"i02-rows","chave":"cambio"},{"campo":"i02-desenho","tipo":"linha","alvo":"i02-rows","chave":"desenho"}]}, EDITORIAIS, EXTRATORES['m17-inst-02']),
  'm17-inst-03': (e: Record<string, EntradaInstrumento>) => calcular('i03', e, {"textos":["i03-out","i03-v"],"paineisRo":[],"gatilhos":[{"campo":"i03-par","tipo":"chips","alvo":"i03-par"},{"campo":"i03-dim","tipo":"chips","alvo":"i03-dim"}]}, EDITORIAIS, EXTRATORES['m17-inst-03']),
  'm17-inst-04': (e: Record<string, EntradaInstrumento>) => calcular('i04', e, {"textos":["i04-out","i04-v"],"paineisRo":[],"gatilhos":[{"campo":"i04-jur","tipo":"chips","alvo":"i04-jur"},{"campo":"i04-dim","tipo":"chips","alvo":"i04-dim"}]}, EDITORIAIS, EXTRATORES['m17-inst-04']),
  'm17-inst-05': (e: Record<string, EntradaInstrumento>) => calcular('i05', e, {"textos":["i05-out","i05-v"],"paineisRo":[],"gatilhos":[{"campo":"i05-jur","tipo":"chips","alvo":"i05-jur"}]}, EDITORIAIS, EXTRATORES['m17-inst-05']),
  'm17-inst-06': (e: Record<string, EntradaInstrumento>) => calcular('i06', e, {"textos":["i06-v"],"paineisRo":["i06-r"],"gatilhos":[]}, EDITORIAIS, EXTRATORES['m17-inst-06']),
  'm17-inst-07': (e: Record<string, EntradaInstrumento>) => calcular('i07', e, {"textos":["i07-out","i07-v"],"paineisRo":[],"gatilhos":[{"campo":"i07-obj","tipo":"chips","alvo":"i07-obj"}]}, EDITORIAIS, EXTRATORES['m17-inst-07']),
  'm17-inst-08': (e: Record<string, EntradaInstrumento>) => calcular('i08', e, {"textos":["i08-out","i08-v"],"paineisRo":[],"gatilhos":[{"campo":"i08-mec","tipo":"chips","alvo":"i08-mec"}]}, EDITORIAIS, EXTRATORES['m17-inst-08']),
  'm17-inst-09': (e: Record<string, EntradaInstrumento>) => calcular('i09', e, {"textos":["i09-v"],"paineisRo":["i09-r"],"gatilhos":[{"campo":"i09-set","tipo":"chips","alvo":"i09-set"}]}, EDITORIAIS, EXTRATORES['m17-inst-09']),
  'm17-inst-10': (e: Record<string, EntradaInstrumento>) => calcular('i10', e, {"textos":["i10-v"],"paineisRo":["i10-r"],"gatilhos":[]}, EDITORIAIS, EXTRATORES['m17-inst-10']),
  'm17-inst-11': (e: Record<string, EntradaInstrumento>) => calcular('i11', e, {"textos":["i11-v"],"paineisRo":["i11-r"],"gatilhos":[]}, EDITORIAIS, EXTRATORES['m17-inst-11']),
  'm17-inst-12': (e: Record<string, EntradaInstrumento>) => calcular('i12', e, {"textos":["i12-out"],"paineisRo":[],"gatilhos":[{"campo":"i12-fil","tipo":"chips","alvo":"i12-fil"},{"campo":"i12-nav","tipo":"nav","alvo":"i12-nav"}]}, EDITORIAIS, EXTRATORES['m17-inst-12']),
};

/** Alvos do script que compõem o painel e gatilhos de cada campo (para a conferência). */
export const TEXTOS: Record<string, string[]> = {"m17-inst-01":["i01-out","i01-v"],"m17-inst-02":["i02-rows","i02-v"],"m17-inst-03":["i03-out","i03-v"],"m17-inst-04":["i04-out","i04-v"],"m17-inst-05":["i05-out","i05-v"],"m17-inst-06":["i06-v"],"m17-inst-07":["i07-out","i07-v"],"m17-inst-08":["i08-out","i08-v"],"m17-inst-09":["i09-v"],"m17-inst-10":["i10-v"],"m17-inst-11":["i11-v"],"m17-inst-12":["i12-out"]};
export const GATILHOS: Record<string, { campo: string; tipo: string; alvo: string; chave?: string }[]> = {"m17-inst-01":[{"campo":"i01-dim","tipo":"chips","alvo":"i01-dim"}],"m17-inst-02":[{"campo":"i02-camada","tipo":"linha","alvo":"i02-rows","chave":"camada"},{"campo":"i02-consum","tipo":"linha","alvo":"i02-rows","chave":"consum"},{"campo":"i02-mercado","tipo":"linha","alvo":"i02-rows","chave":"mercado"},{"campo":"i02-granul","tipo":"linha","alvo":"i02-rows","chave":"granul"},{"campo":"i02-tribut","tipo":"linha","alvo":"i02-rows","chave":"tribut"},{"campo":"i02-cambio","tipo":"linha","alvo":"i02-rows","chave":"cambio"},{"campo":"i02-desenho","tipo":"linha","alvo":"i02-rows","chave":"desenho"}],"m17-inst-03":[{"campo":"i03-par","tipo":"chips","alvo":"i03-par"},{"campo":"i03-dim","tipo":"chips","alvo":"i03-dim"}],"m17-inst-04":[{"campo":"i04-jur","tipo":"chips","alvo":"i04-jur"},{"campo":"i04-dim","tipo":"chips","alvo":"i04-dim"}],"m17-inst-05":[{"campo":"i05-jur","tipo":"chips","alvo":"i05-jur"}],"m17-inst-06":[],"m17-inst-07":[{"campo":"i07-obj","tipo":"chips","alvo":"i07-obj"}],"m17-inst-08":[{"campo":"i08-mec","tipo":"chips","alvo":"i08-mec"}],"m17-inst-09":[{"campo":"i09-set","tipo":"chips","alvo":"i09-set"}],"m17-inst-10":[],"m17-inst-11":[],"m17-inst-12":[{"campo":"i12-fil","tipo":"chips","alvo":"i12-fil"},{"campo":"i12-nav","tipo":"nav","alvo":"i12-nav"}]};
