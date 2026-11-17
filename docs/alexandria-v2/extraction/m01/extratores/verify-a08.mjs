import fs from 'fs';
const src = fs.readFileSync('C:/dev/GridAlpha v2/Alexandria modulos/alexandria_modulo01.html','utf8');
const lines = src.split('\n');
const j = JSON.parse(fs.readFileSync('C:/dev/gridalpha-v2-alexandria-v2-restructure/docs/alexandria-v2/extraction/m01/aula-08.json','utf8'));
const dec = s=>s.replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&amp;/g,'&').replace(/&quot;/g,'"');
const strip = s=>dec(s.replace(/<[^>]+>/g,''));
const norm = s=>s.replace(/\s+/g,' ').trim();
const srcN = norm(src), srcT = norm(strip(src));
const skipKeys = new Set(['nota','o_que','argumento','decisao','vinculo_nota','seletor','kind_nota','titulo_nota','unidade_nota','leitura_largura','fonte_citada_nota','max_nota','formatacao_descricao','pergunta_nota','vinculos_nota','ausencias_nota','instrumento_nota','criterio_nota','mecanica_fonte','fonte_dos_numeros_nota','tolerancias_nota','figura_prometida_nota','posicao_instrumento','vale_lembrar_nota','tabelas_nota','metodo','onde','fonte','uso','papel','origem','contrato','protocolo','taxonomia','exemplos','tipo','id','ref','bloco','alvo','ids','ausencia','vinculos','kind_taxonomia','condicao_literal','tom','classe_cor','id_fonte','tag_fonte','gravidade','arquivos','conforme','ocorrencias_contexto','tokens_nao_casados','comparacao_codigo','meta','cobertura_texto_por_token','cenario_padrao','feedback_q','texto_leitura_pelo_script']);
const bad=[];
function walk(o,path){
  if(Array.isArray(o)) return o.forEach((v,i)=>walk(v,path+'['+i+']'));
  if(o&&typeof o==='object'){ for(const [k,v] of Object.entries(o)){ if(skipKeys.has(k)) continue; walk(v,path+'.'+k);} return;}
  if(typeof o==='string' && o.length>3){
    const n=norm(o);
    if(srcN.includes(n)||srcT.includes(n)||srcN.includes(norm(dec(n)))||srcT.includes(norm(strip(n)))) return;
    // try split parts by ' | '
    bad.push(path+' :: '+n.slice(0,120));
  }
}
walk(j,'');
console.log('NOT FOUND:\n'+bad.join('\n'));
// origem checks
const obad=[];
function walkO(o,path){
  if(Array.isArray(o)) return o.forEach((v,i)=>walkO(v,path+'['+i+']'));
  if(o&&typeof o==='object'){
    if(o.linha_aprox && o.trecho_inicial!==undefined){
      const t=norm(o.trecho_inicial).split(' ').slice(0,3).join(' ');
      const L=o.linha_aprox; let ok=false;
      for(let d=-2;d<=2;d++){ const ln=lines[L-1+d]; if(ln && (t==='' || norm(strip(ln)).includes(t) || norm(ln).includes(t))) ok=true; }
      if(!ok) obad.push(path+' L'+L+' :: '+t+' | line: '+norm(lines[L-1]||'').slice(0,80));
    } else if (o.linha_aprox) { obad.push('(sem trecho) '+path+' L'+o.linha_aprox+' :: '+norm(lines[o.linha_aprox-1]||'').slice(0,90)); }
    for(const [k,v] of Object.entries(o)) walkO(v,path+'.'+k);
  }
}
walkO(j,'');
console.log('ORIGEM:\n'+obad.join('\n'));
