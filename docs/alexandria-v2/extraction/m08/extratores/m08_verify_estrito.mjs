// Segunda passada de verificação do M08, sem a lista de chaves de conteúdo:
// toda folha string dos três JSON é procurada na fonte (texto sem tags,
// markup cru ou script cru), exceto metadado desta extração e comparação
// com código/catálogo. O que não for achado é listado para inspeção humana.
import fs from 'node:fs';
import { html, decode, OUTDIR } from './m08_lib.mjs';

const N = (s) => decode(String(s)).replace(/<[^>]+>/g, ' ').replace(/\\'/g, "'").replace(/\s+/g, ' ').replace(/\s+([.,;:!?)])/g, '$1').trim().normalize('NFC');
const FT = N(html);
const FR = html.replace(/\\'/g, "'").replace(/\s+/g, ' ').normalize('NFC');
const FRx = html.replace(/\s+/g, ' ').normalize('NFC');

const META = /^(id|tipo|camada|fonte|gerado_por|metodo|seletor|trecho_inicial|linha_aprox|linha|linhas|origem|classe|classe_extra|alvo|section_id|status|ids|escopo|tema|severidade|aula_id_codigo|aula_no_codigo|kind|onde|id_fonte|atributo|funcao|secao|elemento|tipo_elemento|espaco|parte_nota|instituicao_nota|datas_nota|criterio_nota|local|bloco_catalogo_repo|arquivo|consequencia|cond)$/;
const PULAR = /^(nota.*|.*_nota|comparacao_codigo|comparacao_estatica|codigo|divergencias.*|contagens|marcacao_p14|prova_diferencial|problemas|presenca_verbatim_nas_notas|vinculos|invocacao|leitura_a|leitura_b|leituras|medicao|casos|ocorrencias|repo|decisao|protocolo|codigo_real|catalogo|ordem_geracao|fatias|aulas_citadas_na_explicacao|referencias_em_prosa|termo|grupo|outros_modulos_com_mesmo_termo|sem_aula|aula_vinculada|trilha_declarada|horas|voz_pointer|titulo_subsecao|instrumento_de_modulo|rotulo_marcador|parte_declarada|feedback_formato|formato|modulo_anterior|modulo_seguinte)$/;

const res = {}; const naoAchadas = [];
function walk(o, path, f) {
  if (Array.isArray(o)) return o.forEach((v, i) => walk(v, `${path}[${i}]`, f));
  if (!o || typeof o !== 'object') return;
  for (const [k, v] of Object.entries(o)) {
    if (META.test(k) || PULAR.test(k)) continue;
    if (typeof v === 'string') {
      if (!v.trim() || /^[\d.,\s%-]+$/.test(v)) continue;
      res[f].conferidas++;
      const n = N(v); const r = v.replace(/\s+/g, ' ').trim();
      const linhas = r.split(/ ?\n ?/);
      const ok = FT.includes(n) || FR.includes(r) || FRx.includes(r) || v.split('\n').every((l) => !l.trim() || FRx.includes(l.trim().replace(/\s+/g, ' ')));
      if (!ok) { res[f].nao_achadas++; naoAchadas.push({ arquivo: f, path: `${path}.${k}`, valor: v.slice(0, 140) }); }
    } else walk(v, `${path}.${k}`, f);
  }
}
for (const f of ['modulo.json', 'aparato.json', 'instrumentos.json']) {
  res[f] = { conferidas: 0, nao_achadas: 0 };
  walk(JSON.parse(fs.readFileSync(`${OUTDIR}/${f}`, 'utf8')), f.replace('.json', ''), f);
}
const out = { resumo: res, nao_achadas: naoAchadas };
fs.writeFileSync(`${OUTDIR}/extratores/verificacao_estrita.json`, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(res));
for (const x of naoAchadas) console.log(x.path, '::', x.valor);
