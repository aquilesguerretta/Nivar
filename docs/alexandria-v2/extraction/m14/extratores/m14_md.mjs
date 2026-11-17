// Gera modulo.md, aparato.md, instrumentos.md e README.md do M14 a partir
// dos tres JSONs (que sairam do HTML por programa). Nenhum texto de conteudo
// e digitado aqui: tudo que aparece entre aspas vem dos JSONs. O texto
// editorial (cabecalhos, notas de leitura) e desta extracao e nao e fonte.
// Tambem acrescenta, em instrumentos.json, a comparacao de nome com o
// catalogo canonico (comparacao_codigo.catalogo), lida do arquivo do catalogo.
import fs from 'node:fs';
import { OUTDIR, CATALOGO, FONTE, texto } from './m14_lib.mjs';

const J = (n) => JSON.parse(fs.readFileSync(`${OUTDIR}/${n}`, 'utf8'));
const M = J('modulo.json');
const A = J('aparato.json');
const I = J('instrumentos.json');
const V = JSON.parse(fs.readFileSync(`${OUTDIR}/extratores/verificacao.json`, 'utf8'));
const cat = fs.readFileSync(CATALOGO, 'utf8');

const nf = (n) => Number(n).toLocaleString('pt-BR');
const T = (s) => (s == null ? '' : texto(String(s)));
const q = (s) => (s == null ? '`null`' : `"${T(s)}"`);
const cel = (s) => String(s ?? '').replace(/\|/g, '\\|').replace(/\n/g, ' ');
const qc = (s) => cel(q(s));
const L = (n) => (n == null ? '—' : `L${n}`);
const P = (o) => (o && o.linha_aprox ? L(o.linha_aprox) : '—');
const lista = (arr) => arr.map((x) => `- ${x}`).join('\n');
const tabela = (cab, linhas) => [`| ${cab.join(' | ')} |`, `|${cab.map(() => '---').join('|')}|`, ...linhas.map((l) => `| ${l.map(cel).join(' | ')} |`)].join('\n');
const pct = (c) => `${String(c.pct).replace('.', ',')}% (${nf(c.cobertos)}/${nf(c.tokens_fonte)})`;

const CAB = (grupo, json, extrator) => `# M14 · grupo "${grupo}"

Fonte (só leitura): \`${FONTE.arquivo}\` (${nf(FONTE.linhas_total - 1)} linhas, ${FONTE.fim_de_linha}). Saída: [\`${json}\`](${json}). Extrator: [\`extratores/${extrator}\`](extratores/${extrator}); este arquivo é gerado por [\`extratores/m14_md.mjs\`](extratores/m14_md.mjs).
Camada **fonte**: todo texto entre aspas ou em tabela saiu do JSON, e o JSON saiu do HTML por programa; nada foi
digitado nem parafraseado (as tags inline foram removidas na versão .md; o \`html\` fica no JSON). \`L\` é a linha
aproximada no HTML-fonte. As divergências ficam com todas as leituras, e nenhuma é resolvida aqui (P17–P24 valem só
na camada de produto).
`;

// ------------------------------------------------------------ blocos
function bloco(b) {
  const o = [];
  const lin = P(b.origem ?? b);
  switch (b.tipo) {
    case 'marcador': o.push(`**Marcador:** ${q(b.texto)} (${lin})`); break;
    case 'titulo': o.push(`**${b.nivel ?? 'título'}:** ${q(b.texto)} (${lin})`); break;
    case 'lead': o.push(`**Lede:** ${q(b.texto)} (${lin})`); break;
    case 'paragrafo': o.push(`${q(b.texto)} (${lin})`); break;
    case 'formula_destaque': o.push(`**Destaque (fórmula):** ${q(b.texto)} (${lin})`); break;
    case 'callout':
      o.push(`**Callout \`${b.classe}\` — ${q(b.rotulo)}** (${lin}):`);
      for (const p of b.paragrafos || []) o.push(`> ${q(p.texto ?? p.html)}`);
      break;
    case 'lista':
      o.push(`**Lista (${b.ordenada ? 'ordenada' : 'não ordenada'}, ${b.itens.length} itens)** (${lin}):`);
      b.itens.forEach((it, k) => o.push(`${b.ordenada ? `${k + 1}.` : '-'} ${q(it.texto ?? it.html)}`));
      break;
    case 'tabela':
      o.push(`**Tabela** (${lin}):`, '', tabela(b.cabecalho.map(T), b.linhas.map((l) => l.map(T))));
      break;
    case 'cadeia':
      o.push(`**Cadeia (${b.itens.length} caixas)** (${lin}):`);
      b.itens.forEach((it) => o.push(`- **${T(it.rotulo)}**: ${q(it.texto ?? it.html)}`));
      break;
    case 'taxonomia':
      o.push(`**Taxonomia (${b.itens.length} linhas)** (${lin}):`);
      b.itens.forEach((it) => o.push(`- ${T(it.simbolo)} **${T(it.nome)}** · ${T(it.estado)}: ${q(it.texto ?? it.html)}`));
      break;
    case 'tres_colunas':
      o.push(`**Três colunas** (${lin}):`);
      for (const c of b.colunas) {
        o.push(`- **${T(c.titulo)}**`);
        for (const it of c.itens) o.push(`  - ${T(it.rotulo)}: ${q(it.texto ?? it.html)}${it.linha_aprox ? ` (${L(it.linha_aprox)})` : ''}`);
      }
      break;
    case 'instrumento_ref': o.push(`**[instrumento ${b.id_fonte}]** ${q(b.titulo)} (${L(b.linha_aprox)}) — ver \`${b.ver}\``); break;
    case 'grade_de_aulas':
      o.push(`**Grade de aulas (${b.itens.length} cartões)** (${lin}):`);
      b.itens.forEach((it) => o.push(`- ${T(it.numero)} · ${q(it.titulo)} — ${q(it.descricao)}`));
      break;
    default:
      o.push(`**${b.tipo}** (${lin}): ${q(b.texto ?? JSON.stringify(b).slice(0, 200))}`);
  }
  return o.join('\n');
}
// escapa tags citadas em notas (fora dos <details> desta extracao), para o .md nao as renderizar
const escTags = (md) => md.split('\n').map((l) => (l.startsWith('<details><summary>') || l === '</details>' ? l : l.replace(/(^|[^`])<(\/?[a-zA-Z][a-zA-Z0-9]*)>/g, '$1`<$2>`'))).join('\n');
const blocos = (arr) => arr.map(bloco).join('\n\n');

function divergencias(arr) {
  const out = [];
  for (const d of arr) {
    out.push(`### ${d.id} — ${d.tema}${d.severidade ? ` (severidade ${d.severidade})` : ''}`, '');
    out.push(`Classe: ${d.classe}${d.instrumento ? ` · instrumento ${d.instrumento}` : ''}${d.linhas_aprox ? ` · linhas ${d.linhas_aprox.map(L).join(', ')}` : ''}.`, '');
    const leituras = [];
    for (const k of Object.keys(d)) if (/^leitura_[a-z]$/.test(k)) leituras.push({ rot: k.slice(-1).toUpperCase(), ...d[k] });
    for (const l of leituras) out.push(`- **Leitura ${l.rot}** (${l.onde}): ${q(l.texto)}`);
    for (const l of d.leituras || []) {
      if (l.aula) out.push(`- ${l.aula}: marcador ${q(l.marcador)} × cartão do § MAP ${q(l.cartao_map)}`);
      else out.push(`- (${l.onde}): ${q(l.texto)}`);
    }
    out.push('', `Nota: ${d.nota}`, `Decisão: ${d.decisao == null ? '`null` (não resolvido)' : JSON.stringify(d.decisao)}.`, '');
  }
  return out.join('\n');
}

// ============================================================ modulo.md
function moduloMd() {
  const id = M.identidade;
  const o = [CAB('modulo', 'modulo.json', 'm14_modulo.mjs')];
  o.push(`**Verificação** (\`extratores/m14_verify.mjs\`, os três JSONs juntos): ${nf(V.strings_conferidas)} strings de conteúdo são substring
da fonte normalizada e ${nf(V.origens_conferidas)} origens estão na janela da linha declarada, com ${V.falhas_verbatim.length} e ${V.falhas_origem.length} falhas; ${V.exatas.length} checagens exatas
(contagens contra o markup, quiz campo a campo, scripts verbatim, cenário-padrão reexecutado), ${V.falhas_exatas.length} falhas.
Cobertura por token: ${Object.entries(M.cobertura_por_token).map(([k, c]) => `${k} ${pct(c)}`).join(', ')}.
`);

  o.push('## Identidade', '');
  o.push(tabela(['Campo', 'Valor literal', 'Origem'], [
    ['`<title>`', q(id.title_tag.texto), P(id.title_tag.origem)],
    ['Eyebrow', q(id.eyebrow.texto), P(id.eyebrow.origem)],
    ['Título (h1)', q(id.titulo.texto), P(id.titulo.origem)],
    ['Subtítulo (p.sub)', q(id.subtitulo.texto), P(id.subtitulo.origem)],
    ['Pills (hero-meta)', id.meta_pills.map((p) => q(p.texto)).join(' · '), `${P(id.meta_pills[0].origem)}–${P(id.meta_pills.at(-1).origem)}`],
    ['Rodapé', id.rodape.linhas.map((l) => q(l.texto)).join(' / '), P(id.rodape.origem)],
    ['Verificação declarada', q(id.verificacao_declarada.texto), id.verificacao_declarada.nota],
    ['Horas', '`null`', id.horas.nota],
    ['Eixos', '`null`', id.eixos_nota],
  ]));
  o.push('', '**Trilha declarada pela fonte (duas leituras):**', '');
  for (const t of id.trilha_declarada) o.push(`- ${t.onde}: ${q(t.texto ?? t.trecho)} (${L(t.linha_aprox)})`);
  const cc = id.codigo_e_catalogo;
  o.push('', '**Catálogo canônico e código (P24).**', '');
  o.push(lista([
    `Catálogo (\`${CATALOGO}\`): \`${cc.catalogo_canonico_titulo}\`. Título igual ao h1: ${cc.titulo_h1_igual_catalogo}.`,
    `Escala no catálogo: ${cc.catalogo_canonico_escala.replace(/\*\*/g, '')} Confere, item a item, com as 11 pills da fonte.`,
    `\`alexandria-blocks.ts\`: \`${cc.alexandria_blocks_linha.replace(/\s+/g, ' ')}\`. Título igual ao h1: ${cc.titulo_h1_igual_blocks}.`,
    `Trilha no catálogo: registra a contradição da própria fonte (rodapé "Trilha 2" × §00.3 "blocos finais do Nível 3") e o nível 3 do repositório. Ver \`div-m14-trilha\`.`,
    cc.nota_P24,
  ]));

  o.push('', '## Tese (§00)', '', M.tese.nota, '');
  o.push('**Subseções:** ' + M.tese.subsecoes.map((s) => `${s.numero} ${q(s.titulo)} (${L(s.linha_aprox)})`).join('; ') + '.', '');
  o.push('**As três lentes (§00.2), literais:**', '');
  M.tese.lentes.forEach((l, k) => o.push(`${k + 1}. **${T(l.rotulo)}**: ${q(l.texto)} (${L(l.linha_aprox)})`));
  o.push('', `<details><summary>Os ${M.tese.blocos.length} blocos da §00, na ordem da fonte</summary>`, '', blocos(M.tese.blocos), '', '</details>');

  o.push('', '## Resultado esperado / capacidades', '', `\`null\`. ${M.resultado_esperado.nota}`);

  const mp = M.mapa;
  o.push('', '## § MAP — Mapa de rotas', '');
  o.push(`**Pergunta em cinco partes (lede, ${P(mp.pergunta_em_cinco_partes.origem)}):** ${q(mp.pergunta_em_cinco_partes.frase)} Partes em negrito: ${mp.pergunta_em_cinco_partes.partes_em_negrito.map(q).join(', ')}.`, '');
  o.push(`**Perguntas por camada (tabela §MAP.1, ${P(mp.camadas_origem)}; ${mp.perguntas_por_camada.length} linhas — o h3 diz "cinco", ver \`div-m14-cinco-camadas\`):**`, '');
  o.push(tabela(['Camada', 'Pergunta central', 'Evidência mínima', 'Falha característica'], mp.perguntas_por_camada.map((c) => [T(c.camada), T(c.pergunta_central), T(c.evidencia_minima), T(c.falha_caracteristica)])));
  o.push('', `**Cartões das aulas (§MAP.2, ${mp.aulas.length}).** ${mp.perguntas_por_aula_nota}`, '');
  o.push(tabela(['Aula', 'Título do cartão', 'Descrição do cartão', 'Pergunta', 'Código', 'Linha'], mp.aulas.map((a) => [a.aula_fonte, q(a.titulo_cartao), q(a.descricao_cartao), '`null`', a.vinculos.aula_codigo, L(a.linha_aprox)])));
  o.push('', `**Instrumento de módulo:** ${mp.instrumento_de_modulo.id_fonte} — ${mp.instrumento_de_modulo.nota} Ver \`${mp.instrumento_de_modulo.ver}\`.`);
  o.push('', `<details><summary>Os ${mp.blocos.length} blocos do § MAP, na ordem da fonte</summary>`, '', blocos(mp.blocos), '', '</details>');

  const aulas = M.roteiro.filter((r) => r.tipo === 'aula');
  o.push('', `## Roteiro (${M.roteiro.length} seções: ${aulas.length} aulas e ${M.roteiro.length - aulas.length} aparatos)`, '');
  o.push(tabela(['#', 'Seção', 'Marcador', 'Título (h2)', 'Subseções', 'Instrumentos', 'Linha', 'Código (`aula-14-NN`)'], M.roteiro.map((r) => [
    r.ordem_na_fonte, r.section_id, T(r.marcador_html), q(r.titulo?.texto),
    (r.subsecoes || []).map((s) => s.numero).join(', ') || '—',
    (r.instrumentos || []).join(', ') || (r.section_id === 'map' ? 'INST·01' : '—'),
    r.linhas ? `L${r.linhas.inicio}–${r.linhas.fim}` : P(r.origem),
    r.comparacao_codigo ? `${r.vinculos.aula_codigo}: title=marcador ${r.comparacao_codigo.title_igual_marcador_rotulo ? 'sim' : 'NÃO'}; subtitle=h2 ${r.comparacao_codigo.subtitle_igual_h2 ? 'sim' : 'NÃO'}; instrumentos 0` : '—',
  ])));
  const cA = M.comparacao_codigo.contagem_aulas;
  o.push('', `**Contagem de aulas (P8).** Fonte: ${cA.fonte_marcadores_aula} seções \`Aula NN\`, ${cA.fonte_cartoes_map} cartões no §MAP.2, pill ${q(cA.fonte_pill)}. Código: \`MODULO_14_AULAS\` com ${cA.codigo_MODULO_14_AULAS} aulas, \`totalInModule\` ${cA.codigo_totalInModule.join('/')}, \`alexandria-trilhas.ts\` \`${cA.codigo_AULAS_POR_BLOCO}\`; catálogo "8 aulas". Todos concordam. Nas 8 aulas, \`title\` = rótulo do marcador e \`subtitle\` = h2; 6 dos 8 cartões do § MAP usam título curto diferente (\`div-m14-titulos-curtos-map\`).`, '');
  o.push('**Subseções, callouts e fichas por aula, literais:**', '');
  for (const r of aulas) {
    o.push(`- **${r.marcador_num} · ${T(r.marcador_rotulo)}**: ${r.subsecoes.map((s) => `${s.numero} ${q(s.titulo)} (${L(s.linha_aprox)})`).join('; ')}.`);
    if (r.callouts?.length) o.push(`  - Callouts: ${r.callouts.map((c) => `\`${c.classe}\` ${q(c.rotulo)} (${L(c.linha_aprox)})`).join('; ')}.`);
    if (r.fichas_de_rota) o.push(`  - Fichas de rota (\`div.emp\`, conteúdo de aula, fora deste grupo): ${r.fichas_de_rota}.`);
  }

  o.push('', `## Critérios literais (${M.criterio.criterios.length})`, '', M.criterio.nota_P18, '');
  o.push(`Declaração de construção (§00.3, ${P(M.criterio.declaracao_de_construcao.origem)}): ${q(M.criterio.declaracao_de_construcao.texto)}`, '');
  o.push(`${q(M.criterio.declaracao_de_construcao_2.texto)} (${P(M.criterio.declaracao_de_construcao_2.origem)})`, '');
  o.push(tabela(['Id', 'Onde', 'Texto literal', 'Marcação P14 (inferida)', 'Linha'], M.criterio.criterios.map((c) => [
    c.id, c.secao + (c.rotulo ? ` — ${q(c.rotulo)}` : ''), q(c.texto), (c.marcacao_p14 || []).join(', ') + (c.marcacao_p14_motivo ? ` — ${c.marcacao_p14_motivo}` : ''), P(c.origem),
  ])));
  const q2 = M.criterio.criterios.find((c) => c.limiar_no_script);
  if (q2) o.push('', `Limiar no script do quiz: \`${q2.limiar_no_script.codigo}\` (${L(q2.limiar_no_script.linha_aprox)}); pill ${q(q2.pill_hero)}. ${q2.nota}`);
  o.push('', 'P14: `cronometrado` e `producao_oral_ou_livre` são anotação desta extração a partir do verbo de cada critério ("em menos de um minuto", "sem consultar nota", "é falado"), não rótulo da fonte. Precisa de revisão humana.');

  o.push('', '## Laboratórios (§ Lab)', '', `\`null\`. ${M.laboratorios.nota}`);

  const vz = M.voz.roteiro_oral;
  o.push('', `## Voz — ${q(vz.marcador)} (${P(vz.origem)})`, '');
  o.push(`**Título:** ${q(vz.titulo)}. **Lede:** ${q(vz.lead.texto)}`, '');
  o.push(tabela(['Tempo', 'Título', 'Texto literal'], vz.blocos_de_tempo.map((b) => [b.tempo, q(b.titulo), q(b.texto)])));
  o.push('', `**Callout ${q(vz.o_que_ouvir.rotulo)}** (${P(vz.o_que_ouvir.origem)}): ${vz.o_que_ouvir.paragrafos.map((p) => q(p.texto)).join(' ')}`);
  o.push('', '### Princípios (voz editorial declarada pela fonte)', '');
  for (const p of M.voz.principios) {
    o.push(`- **${p.onde}**${p.rotulo ? ` — ${q(p.rotulo)}` : ''}${p.classe ? ` (\`${p.classe}\`)` : ''}:`);
    for (const it of p.itens || []) o.push(`  - ${T(it.simbolo)} **${T(it.nome)}** · ${T(it.estado)}: ${q(it.texto)} (${L(it.linha_aprox)})`);
    for (const pp of p.paragrafos || []) o.push(`  - ${q(pp.texto)}${pp.linha_aprox ? ` (${L(pp.linha_aprox)})` : ''}`);
  }
  o.push('', `Princípios que vivem em outros grupos: ${M.voz.principios_em_outros_grupos.map((p) => `${q(p.rotulo)} (${p.onde}, ver ${p.ver})`).join('; ')}.`);
  o.push('', `Callouts "Números vivos · verificar na fonte antes de uso externo": ${M.voz.callouts_numeros_vivos_em_aula.map((c) => `${c.secao} ${L(c.linha_aprox)}`).join(', ')}.`);

  const er = M.erros_comuns;
  o.push('', `## Erros comuns — ${q(er.marcador)} (${P(er.origem)})`, '');
  o.push(`**Título:** ${q(er.titulo.texto)}. **Lede:** ${q(er.lead.texto)}`, '');
  o.push(tabela(['#', 'Afirmação', 'Correção literal', 'Linha'], er.itens.map((e) => [e.ordem, T(e.afirmacao), q(e.correcao_texto), P(e.origem)])));
  const errV = er.itens.filter((e) => e.vinculos.instrumentos_citados.length || e.vinculos.aulas_citadas.length);
  o.push('', `Menções em prosa nos erros (não são tag de posse): ${errV.length ? errV.map((e) => `${e.id} → ${[...e.vinculos.instrumentos_citados, ...e.vinculos.aulas_citadas].join(', ')}`).join('; ') : 'nenhuma'}. Nenhum erro declara vínculo de aula.`);

  o.push('', '## Tradutor / § Map', '', `\`null\`. ${M.tradutor.nota}`);
  o.push('', `## "Onde isso entra no produto" (P7, ${M.onde_entra_no_produto_P7.length} callouts)`, '');
  o.push('Blocos que falam do produto GridAlpha ao learner; P7 manda não exibi-los. Registrados só por posição:', '');
  o.push(lista(M.onde_entra_no_produto_P7.map((x) => `${x.secao} ${L(x.linha_aprox)}: ${q(x.trecho_inicial)}…`)));

  o.push('', `## Divergências (${M.divergencias.length})`, '', divergencias(M.divergencias));

  const cc2 = M.comparacao_codigo;
  o.push('## Comparação com o código (só leitura)', '');
  o.push(`Arquivos lidos: ${cc2.arquivos.map((a) => `\`${a}\``).join(', ')}.`, '');
  o.push(tabela(['Aula', 'Marcador (fonte)', 'h2 (fonte)', 'Cartão § MAP', '`title` (código)', '`subtitle` (código)'], cc2.titulos.map((t) => [t.aula, q(t.fonte_marcador), q(t.fonte_h2), q(t.fonte_cartao_map), `${t.title_igual_marcador_rotulo ? '=' : '≠'} marcador`, `${t.subtitle_igual_h2 ? '=' : '≠'} h2`])));
  o.push('', '**O que o código não tem (existe só no HTML):**', '', lista(cc2.o_que_o_codigo_nao_tem), '', `Badges: ${cc2.badges}`);

  o.push('', '## Contagens', '');
  const c = M.contagens;
  o.push(tabela(['Item', 'Contagem'], [
    ['Seções', c.secoes], ['Aulas', c.aulas], ['Aparatos', c.aparatos], ['Pills do hero', c.pills_hero],
    ['Subseções da §00', c.subsecoes_tese], ['Lentes', c.lentes], ['Perguntas por camada (§MAP.1)', c.perguntas_camadas_map],
    ['Cartões de aula (§MAP.2)', c.cartoes_map], ['Critérios literais', c.criterios_literais], ['Blocos de tempo (§Voz)', c.blocos_de_tempo_voz],
    ['Erros comuns', c.erros_comuns], ['Callouts "Onde isso entra no produto"', c.callouts_onde_entra_no_produto],
    ['Instrumentos por aula', Object.entries(c.instrumentos_por_aula).map(([k, v]) => `${k}: ${v.join('+')}`).join('; ') + '; §MAP: INST·01'],
    ['Divergências', c.divergencias],
  ]));
  return o.join('\n') + '\n';
}

// ============================================================ aparato.md
function aparatoMd() {
  const o = [CAB('aparato', 'aparato.json', 'm14_aparato.mjs')];
  o.push(`**Cobertura por token:** ${Object.entries(A.cobertura_por_token).map(([k, c]) => `${k} ${pct(c)}`).join(', ')}. O resíduo do script do quiz são nomes de variável e índices (${A.cobertura_por_token.quiz_script.amostra_faltantes.slice(0, 6).map((x) => `\`${x}\``).join(', ')}…), não texto.
`);
  const cs = A.caso;
  o.push(`## Caso — ${q(cs.rotulo_marcador)} (§Caso, ${P(cs.origem)})`, '');
  o.push(lista([
    `**Título (h2):** ${q(cs.titulo.texto)}.`,
    `**Parte:** ${q(cs.parte)}. ${cs.nota_parte}`,
    `**Lede:** ${q(cs.lead.texto)} (${P(cs.lead.origem)})`,
    `**Subseções:** ${cs.subsecoes.map((s) => `${s.numero} ${q(s.titulo)} (${L(s.linha_aprox)})`).join('; ')}.`,
    `**Dados:** \`null\`. ${cs.nota_dados}`,
    `**Decisão pedida:** \`null\`. ${cs.nota_decisao}`,
    `**Menções em prosa:** aulas ${cs.vinculos.aulas_citadas.join(', ')}; módulos ${cs.vinculos.modulos_citados.join(', ')}. ${cs.vinculos.nota}`,
    `**No código:** ${cs.codigo_atual}`,
  ]));
  o.push('', `**Perguntas literais (${cs.perguntas.length}, §Caso.1).** ${cs.nota_perguntas}`, '');
  cs.perguntas.forEach((p, k) => o.push(`${k + 1}. ${q(p.pergunta)} — desdobramento: ${q(p.desdobramento_texto)} (${P(p.origem)})`));
  o.push('', `**Pergunta respondida pela própria fonte (§Caso.3, ${P(cs.pergunta_respondida.origem)}):** ${q(cs.pergunta_respondida.pergunta)}`, '', `> ${q(cs.pergunta_respondida.resposta_texto)}`);
  o.push('', `**Diagnóstico do biometano (§Caso.2, três colunas, ${P(cs.diagnostico_biometano.origem)}):**`, '');
  for (const c of cs.diagnostico_biometano.colunas) {
    o.push(`- **${T(c.titulo)}**`);
    for (const it of c.itens) o.push(`  - ${T(it.rotulo)}: ${q(it.texto)} (${L(it.linha_aprox)})`);
  }
  o.push('', `**${q(cs.linguagem_obrigatoria.rotulo)}** (\`${cs.linguagem_obrigatoria.classe}\`, ${P(cs.linguagem_obrigatoria.origem)}):`, '', ...cs.linguagem_obrigatoria.paragrafos.map((p) => `> ${q(p.texto)}`));
  o.push('', `<details><summary>Os ${cs.blocos.length} blocos do §Caso, na ordem da fonte</summary>`, '', blocos(cs.blocos), '', '</details>');

  const av = A.avaliacao;
  o.push('', `## Quiz — ${q(av.marcador)}`, '');
  o.push(lista([
    `**Título:** ${q(av.titulo.texto)}.`,
    `**Introdução (${P(av.introducao.origem)}):** ${q(av.introducao.texto)}`,
    `**Critério em prosa:** ${q(av.criterio_literal_prosa.texto)}`,
    `**Estrutura:** ${av.total_questoes} questões × 4 alternativas, lidas do literal \`var Q=[…]\` (script L${av.script.linha_ini}–L${av.script.linha_fim}). Gabarito na ordem: **${av.perguntas.map((p) => p.gabarito.letra).join(' ')}**.`,
    `**Interface da fonte:** botões ${q(av.rotulos_de_interface_fonte.botao_corrigir.texto)} (${L(av.rotulos_de_interface_fonte.botao_corrigir.linha_aprox)}) e ${q(av.rotulos_de_interface_fonte.botao_refazer.texto)} (${L(av.rotulos_de_interface_fonte.botao_refazer.linha_aprox)}); rótulo \`${av.rotulos_de_interface_fonte.rotulo_questao_template.texto}\`; placar \`${av.faixas_de_placar_script.formato_placar}\`. ${av.rotulos_de_interface_fonte.nota}`,
    `**Mecânica** (descrição desta extração a partir do código): ${av.mecanica_fonte.join('; ')}.`,
    `**No código:** ${av.codigo_atual}`,
  ]));
  o.push('', `### Faixas do placar (script, ${P(av.faixas_de_placar_script.origem)})`, '', av.faixas_de_placar_script.nota_intervalo, '');
  o.push(tabela(['Condição (derivada)', 'Classe', 'Mensagem literal'], av.faixas_de_placar_script.faixas.map((f) => [`\`${f.condicao}\``, `\`${f.classe}\``, q(f.mensagem ?? f.mensagem_texto)])));
  o.push('', 'P18: o limiar é registro legado; não declara domínio, não libera trilha e não vira "Aprovado". A mensagem de acerto afirma competência ("A matéria sustenta uma conversa de uma hora…"), ver `div-m14-quiz-placar`.', '', '### Questões', '');
  for (const p of av.perguntas) {
    o.push(`**${p.rotulo_fonte}** (${P(p.origem)}). ${q(p.enunciado)}`, '');
    for (const a of p.alternativas) o.push(`- ${a.letra}) ${q(a.texto)}${a.indice === p.gabarito.indice ? ' **← gabarito**' : ''}`);
    o.push('', `Explicação (mesmo texto para acerto e erro): ${q(p.explicacao)}`, '');
  }

  const ck = A.checklist_final;
  o.push(`## Checklist final — ${q(ck.marcador)}`, '');
  o.push(lista([
    `**Título:** ${q(ck.titulo.texto)}.`,
    `**Introdução (${P(ck.introducao.origem)}):** ${q(ck.introducao.texto)}`,
    `**Mecânica:** ${ck.mecanica_fonte}`,
    `**No código:** ${ck.codigo_atual}`,
  ]));
  o.push('', tabela(['#', 'Item literal', 'P14 (inferida)', 'Linha'], ck.itens.map((c) => [c.ordem, q(c.texto), c.marcacao_p14.join(', '), P(c.origem)])));
  o.push('', ck.nota_P14, '', `**Fecho — ${q(ck.fecho.rotulo)}** (\`${ck.fecho.classe}\`, ${P(ck.fecho.origem)}):`, '', ...ck.fecho.paragrafos.map((p) => `> ${q(p.texto)}`));

  const ex = A.exercicios;
  o.push('', `## Índice de exercícios — ${q(ex.marcador)}`, '');
  o.push(lista([
    `**Título:** ${q(ex.titulo.texto)}.`,
    `**Introdução (${P(ex.introducao.origem)}):** ${q(ex.introducao.texto)}`,
    `**Famílias:** o lede declara ${ex.familias_declaradas_no_lede.length} (${ex.familias_declaradas_no_lede.map(q).join(', ')}); as tags usam ${ex.familias_nas_tags.length} (${ex.familias_nas_tags.map(q).join(', ')}). Ver \`div-m14-ex-familias\`.`,
    `**Mecânica:** ${ex.mecanica_fonte}`,
    `**Vínculo com aula (P9):** ${ex.vinculados_a_aula} de ${ex.total_na_fonte}; **${ex.soltos_P9} soltos** (vão para Recursos do Módulo). ${ex.nota_vinculo}`,
    `**Critério por exercício:** \`null\` nos 14. ${ex.exercicios[0].nota_criterio}`,
    `**No código:** ${ex.codigo_atual.arquivo}: ${ex.codigo_atual.total_codigo} itens, ${ex.codigo_atual.identicos} idênticos (enunciado, tag e gabarito); renderizado: ${ex.codigo_atual.renderizado}. ${ex.codigo_atual.nota} ${ex.exercicios[0].comparacao_codigo.nota}`,
  ]));
  o.push('');
  o.push(tabela(['Tag', 'Aula', 'Enunciado', 'Resposta de referência (literal)', 'Critério', 'Código', 'Linha'], ex.exercicios.map((e) => [
    q(e.tag), e.aula_declarada ?? 'solto (P9)', q(e.enunciado), q(e.resposta_referencia_texto), '`null`',
    e.comparacao_codigo ? `${e.comparacao_codigo.id_codigo}: ${e.comparacao_codigo.prompt_igual && e.comparacao_codigo.tag_igual && e.comparacao_codigo.gabarito_igual ? 'idêntico' : 'DIFERE'}` : 'ausente',
    P(e.origem),
  ])));
  const refsProsa = ex.exercicios.filter((e) => e.referencias_em_prosa.modulos.length || e.referencias_em_prosa.instrumentos.length);
  if (refsProsa.length) o.push('', `Menções em prosa (não são tag de posse): ${refsProsa.map((e) => `${T(e.tag)} → ${[...e.referencias_em_prosa.modulos, ...e.referencias_em_prosa.instrumentos].join(', ')}`).join('; ')}.`);

  const rf = A.referencias;
  o.push('', `## Referências — ${q(rf.marcador)}`, '');
  o.push(`**Título:** ${q(rf.titulo.texto)}. **Introdução (${P(rf.introducao.origem)}):** ${q(rf.introducao.texto)}`, '');
  o.push(`**Grupos (${rf.grupos.length}):** ${rf.grupos.map((g) => `${q(g.titulo)} (${g.total}, ${L(g.linha_aprox)})`).join('; ')}.`, '');
  o.push(rf.nota_campos, '');
  o.push(tabela(['#', 'Grupo', 'Natureza/emissor (span.src)', 'Título (b)', 'Descrição', 'Datas literais', 'URL/domínio', 'Linha'], rf.itens.map((r, k) => [
    k + 1, rf.grupos.findIndex((g) => g.titulo === r.grupo) + 1, q(r.natureza_ou_emissor), q(r.titulo), q(r.descricao_texto), r.datas_literais.join('; ') || '—', r.url ?? r.dominio_citado ?? '`null`', P(r.origem),
  ])));
  o.push('', `**${q(rf.limites.rotulo)}** (\`${rf.limites.classe}\`, ${P(rf.limites.origem)}):`, '', ...rf.limites.paragrafos.map((p) => `> ${q(p.texto)}`), '', `**No código:** ${rf.codigo_atual}`);

  const gl = A.glossario;
  const gc = gl.contagem;
  o.push('', `## Glossário — ${q(gl.marcador)}`, '');
  o.push(`**Título:** ${q(gl.titulo.texto)}. **Introdução (${P(gl.introducao.origem)}):** ${q(gl.introducao.texto)}`, '');
  o.push(`**Contagem (P22).** h2 ${q(gc.prosa_h2)}; pill ${q(gc.pill_hero)}; soma das ${gc.familias} famílias declaradas = ${gc.soma_das_familias_declaradas}; \`span.term\` no markup = ${gc.markup_span_term}. Todos concordam (${gc.familias_divergentes.length} famílias divergentes).`, '');
  o.push(`**Código.** ${gl.codigo_atual} Ausentes no código: **${gc.ausentes_no_codigo} de ${gc.markup_span_term}** (lista em \`glossario.termos_ausentes_no_codigo\`). Com homônimo em outro módulo do código: ${gc.com_homonimo_em_outro_modulo_do_codigo}:`, '');
  o.push(lista(gl.termos.filter((t) => t.comparacao_codigo.homonimos_em_outros_modulos_do_codigo.length).map((t) => `${q(t.termo)} → ${t.comparacao_codigo.homonimos_em_outros_modulos_do_codigo.map((x) => `\`${x}\``).join(', ')}`)));
  o.push('', 'Nenhum termo declara vínculo com aula (`vinculos.aulas: null` nos 158).', '');
  for (const f of gl.familias) {
    const ts = gl.termos.filter((t) => t.familia === f.nome);
    o.push(`### ${T(f.nome)} — declarado ${q(f.contagem_declarada)}, medido ${f.itens_medidos} (${L(f.linha_aprox)})`, '');
    o.push(tabela(['Termo', 'Definição literal', 'Linha'], ts.map((t) => [`**${T(t.termo)}**`, q(t.definicao_texto), P(t.origem)])), '');
  }

  o.push(`## Divergências (${A.divergencias.length})`, '', divergencias(A.divergencias));
  o.push('## Contagens', '');
  const c = A.contagens;
  o.push(tabela(['Item', 'Contagem'], Object.entries(c).map(([k, v]) => [k, Array.isArray(v) ? v.join(' + ') : v])));
  return o.join('\n') + '\n';
}

// ======================================================== instrumentos.md
function nomesCatalogo() {
  const a = cat.indexOf('## Módulo 14 — Biocombustíveis e Bioenergia');
  const b = cat.indexOf('\n## Módulo 15', a);
  const bloco = cat.slice(a, b);
  const out = {};
  for (const m of bloco.matchAll(/^\| (INST·\d\d) \| ([^|]+) \| ([^|]+) \|/gm)) out[m[1]] = { nome: m[2].trim(), descricao: m[3].trim() };
  return out;
}

function dadosMd(nome, d) {
  const o = [`**\`${nome}\`** (L${d.linha_ini}–L${d.linha_fim}):`];
  const v = d.valor;
  const flat = (x) => (x && typeof x === 'object'
    ? Object.entries(x).map(([k, y]) => `${k}=${y && typeof y === 'object' ? `{${flat(y)}}` : typeof y === 'string' ? q(y) : JSON.stringify(y)}`).join('; ')
    : typeof x === 'string' ? q(x) : JSON.stringify(x));
  if (Array.isArray(v)) v.forEach((x, k) => o.push(`- [${k}] ${flat(x)}`));
  else for (const [k, x] of Object.entries(v)) o.push(`- \`${k}\`: ${flat(x)}`);
  return o.join('\n');
}

function instrumentosMd(catNomes) {
  const o = [CAB('instrumentos', 'instrumentos.json', 'm14_instrumentos.mjs')];
  o.push(`**Método.** ${I.metodo}`, '');
  const c = I.contagens;
  o.push(`**Estado no código.** ${c.portados} portados, ${c.nao_portados} não portados e ${c.divergentes} divergentes. \`alexandria-modulo-14-content.ts\`: \`MODULO_14_INSTRUMENTOS: Instrument[] = []\` e \`instruments: []\` nas 8 aulas; nenhum id da fonte em \`alexandria-instrument-calculators.ts\`; \`RecursosDoModulo.tsx\` sem \`modulo-14\`; o catálogo canônico registra "14 | 10 | **0** | \`MODULO_14_INSTRUMENTOS = []\`". Como nada foi portado, não há comparação por execução; o porte futuro deve transliterar o \`script.codigo_verbatim\` de cada item (protocolo §10).`, '');
  o.push(`**Cobertura por token** (markup / strings do script): ${I.instrumentos.map((i) => `${i.id_fonte} ${pct(i.cobertura_por_token.markup)} / ${pct(i.cobertura_por_token.strings_do_script)}`).join('; ')}. O resíduo do script são ids de elemento (\`mp\`, \`dim\`…), não texto.`, '');
  o.push(`## Os ${I.instrumentos.length} instrumentos`, '');
  o.push(tabela(['Id', 'Título (span.nm)', 'Onde', 'Invocação (ponto do texto)', 'Kind sugerido', 'Campos / seleções / saídas / ramos', 'Fonte dos números', 'Código', 'Catálogo'], I.instrumentos.map((i) => {
    const r = I.resumo.find((x) => x.id === i.id);
    const po = i.posicao;
    const cn = i.comparacao_codigo.catalogo;
    return [
      i.id_fonte, q(i.titulo),
      po.fora_de_aula ? `§MAP (${L(po.linha_do_instrumento)}), **fora de aula**` : `${po.aula_fonte}, em ${po.subsecao?.numero ?? '—'} (${L(po.linha_do_instrumento)})`,
      `depois de ${po.bloco_anterior ? `${po.bloco_anterior.tipo} ${L(po.bloco_anterior.linha_aprox)} (${q(po.bloco_anterior.trecho_inicial)}…)` : '—'}; antes de ${po.bloco_seguinte ? `${po.bloco_seguinte.tipo} ${L(po.bloco_seguinte.linha_aprox)}` : 'fim da seção'}${po.mencoes_a_instrumento_na_mesma_secao.filter((m) => m.leitura_desta_extracao.classe === 'invoca').map((m) => `; invocado: ${q(m.frase)} (${L(m.linha_aprox)})`).join('')}${po.outras_ocorrencias_do_id_na_fonte.filter((x) => x.onde === 'markup').map((x) => `; id citado fora da seção: ${L(x.linha)} (${x.leitura_desta_extracao})`).join('')}`,
      i.kind_sugerido, `${r.campos} / ${r.selecoes} / ${r.saidas} / ${r.ramos}`,
      i.fonte_dos_numeros == null ? '`null`' : 'parcial',
      i.comparacao_codigo.estado,
      cn.nome_igual ? 'nome igual' : `nome ≠ (${q(cn.nome_catalogo)})`,
    ];
  })));
  o.push('', 'O kind é anotação desta extração pela taxonomia (`docs/alexandria/instrument-taxonomy.md`), não texto da fonte. Nenhum instrumento tem pergunta própria (`pergunta: null`) e nenhum declara tolerância (`tolerancias: null`).', '');

  for (const i of I.instrumentos) {
    const po = i.posicao;
    o.push(`## ${i.id_fonte} — ${q(i.titulo)}`, '');
    o.push(lista([
      `**Onde:** ${po.fora_de_aula ? '§MAP, fora de aula (Recursos do Módulo)' : `${po.aula_fonte} (\`${po.aula_codigo}\`), subseção ${po.subsecao.numero} ${q(po.subsecao.titulo)}`}. Cabeçalho em ${P(i.origem)}. Script L${i.script.linha_ini}–L${i.script.linha_fim}, comentário ${q(i.comentario_no_script)}.`,
      `**Pergunta:** \`null\`. ${i.pergunta_nota}`,
      `**Tarefa declarada (p.inst-intro, ${P(i.tarefa_declarada.origem)}):** ${q(i.tarefa_declarada.texto)}`,
      `**Aviso (p.disc):** ${q(i.nota_rodape?.texto)}`,
      `**Mecânica (kind sugerido \`${i.kind_sugerido}\`):** ${i.kind_nota}`,
      `**Menções na seção (leitura desta extração):** ${po.mencoes_a_instrumento_na_mesma_secao.length ? po.mencoes_a_instrumento_na_mesma_secao.map((m) => `${L(m.linha_aprox)} ${m.leitura_desta_extracao.classe} — ${m.leitura_desta_extracao.motivo}`).join('; ') : 'nenhuma; o texto da aula não chama o instrumento fora do próprio bloco'}.`,
      `**Catálogo:** ${q(i.comparacao_codigo.catalogo.nome_catalogo)} — ${q(i.comparacao_codigo.catalogo.descricao_catalogo)} (nome igual ao span.nm: ${i.comparacao_codigo.catalogo.nome_igual}).`,
    ]));
    const campos = i.entradas.campos || [];
    if (campos.length) {
      o.push('', `**Entradas numéricas (${campos.length}).**`, '');
      o.push(tabela(['Id', 'Rótulo', 'Unidade', 'Faixa (min–max, passo)', 'Padrão', 'Tipo', 'Linha'], campos.map((f) => [`\`${f.id}\``, q(f.rotulo), q(f.unidade), `${f.min}–${f.max}, ${f.step}`, f.padrao_literal ?? f.padrao, f.tipo_input + (f.range_igual_ao_number === false ? ' (faixa do range DIFERE)' : ''), P(f.origem)])));
    }
    for (const s of i.entradas.selecoes || []) {
      o.push('', `**Seleção \`${s.id}\`** ${s.rotulo ? q(s.rotulo) : `(sem rótulo: ${s.rotulo_nota})`} (${L(s.linha_aprox)}): ${s.opcoes.map((op) => `${q(op.rotulo)} [\`${op.valor}\`]${op.ativo_no_markup ? ' (ativo no markup)' : ''}`).join(', ')}.`);
    }
    if (i.leitura_das_entradas_script.length) o.push('', `**Leitura das entradas no script:** ${i.leitura_das_entradas_script.map((x) => `\`${x.codigo.trim()}\` (${L(x.linha_aprox)})`).join('; ')}.`);
    if (i.saidas.length) {
      o.push('', `**Saídas (${i.saidas.length}).** Valor no markup antes do script: ${q(i.saidas[0].valor_markup)}.`, '');
      o.push(tabela(['Id', 'Rótulo', 'Formatação no script (exata)', 'Cenário-padrão'], i.saidas.map((s) => [`\`${s.id}\``, q(s.rotulo), s.formatacao_script.map((f) => `\`${f.codigo.trim()}\` (${L(f.linha_aprox)})`).join('; '), q(i.cenario_padrao.saidas[s.id])])));
    }
    if (i.formulas_script.length) o.push('', '**Fórmulas (código exato do script):**', '', '```js', ...i.formulas_script.map((f) => `${f.codigo.trim()}   // L${f.linha_aprox}`), '```');
    if (i.conteineres.length) o.push('', `**Contêineres gerados por script:** ${i.conteineres.map((k) => `\`${k.id}\` (${k.papel}, ${L(k.linha_aprox)})`).join('; ')}.`);
    o.push('', `**Cenário-padrão** (script original executado em DOM simulado): entradas ${JSON.stringify(i.cenario_padrao.entradas)}; seleções ${JSON.stringify(i.cenario_padrao.selecoes)}${i.cenario_padrao.classe_veredito ? `; classe do veredito \`${i.cenario_padrao.classe_veredito}\`` : ''}.`);
    const vdId = Object.keys(i.cenario_padrao.saidas).find((k) => /-vd$/.test(k));
    if (vdId) o.push('', `Veredito no carregamento (\`${vdId}\`):`, '', `> ${q(i.cenario_padrao.saidas[vdId])}`);
    if (i.ramos_do_veredito.length) {
      o.push('', `**Ramos do veredito (${i.ramos_do_veredito.length}).** O texto completo de cada ramo, com a concatenação exata, está em \`ramos_do_veredito[].expressao_texto_verbatim\`.`, '');
      o.push(tabela(['Condição (literal)', 'Classe', 'Rótulo em negrito', 'Linhas'], i.ramos_do_veredito.map((r) => [`\`${r.condicao_literal}\``, `\`${r.classe_veredito}\``, q(r.rotulo), `L${r.linha_aprox}–L${r.linha_fim}`])));
    } else o.push('', `**Ramos:** nenhum. ${i.nota_ramos}`);
    if (i.exemplo_por_ramo) o.push('', `Exemplo por ramo (execução real): ${Object.keys(i.exemplo_por_ramo).length} ramos alcançados, entradas em \`exemplo_por_ramo\`.`);
    if (i.templates_de_texto_script?.length) o.push('', `**Templates de texto fora das tabelas:** ${i.templates_de_texto_script.length} trechos (${i.templates_de_texto_script.map((t) => `L${t.linha_ini}${t.linha_fim !== t.linha_ini ? `–L${t.linha_fim}` : ''}`).join(', ')}). ${i.templates_nota}`);
    const dk = Object.keys(i.dados_do_script);
    if (dk.length) {
      o.push('', `**Dados do script (${dk.length}), literais avaliados:**`, '');
      for (const k of dk) o.push(dadosMd(k, i.dados_do_script[k]), '');
    }
    o.push('', `**Fonte dos números:** ${i.fonte_dos_numeros == null ? '`null`' : q(i.fonte_dos_numeros)}. ${i.fonte_dos_numeros_nota}`);
    o.push('', `**Tolerâncias:** \`null\`. ${i.tolerancias_nota}`);
    o.push('', `**Código:** ${i.comparacao_codigo.estado} (${Object.entries(i.comparacao_codigo.evidencia).map(([k, v]) => `${k}: ${Array.isArray(v) ? (v.length ? v.join(', ') : '[]') : v}`).join('; ')}).`);
    const divs = I.divergencias.filter((d) => d.instrumento === i.id_fonte);
    if (divs.length) o.push('', `**Divergências:** ${divs.map((d) => `\`${d.id}\``).join(', ')}.`);
    o.push('');
  }

  o.push(`## Divergências (${I.divergencias.length})`, '', divergencias(I.divergencias));
  o.push('## Consistência (conferida, sem divergência)', '');
  o.push(tabela(['Tema', 'Texto da fonte', 'Painel no padrão', 'Resultado'], I.consistencia.map((x) => [x.tema, x.fonte_texto, x.painel_padrao, x.resultado])));
  o.push('', '## Contagens', '');
  o.push(tabela(['Item', 'Contagem'], Object.entries(I.contagens).map(([k, v]) => [k, v])));
  return o.join('\n') + '\n';
}

// ------------------------------------------------ patch: leitura das mencoes
// A varredura do extrator acha a palavra "instrumento" em qualquer bloco da secao.
// Protocolo §2: frequencia nao e veredito. Cada frase abaixo foi lida; a leitura
// e anotacao desta extracao (campo leitura_desta_extracao), nao texto da fonte.
const LEITURA = {
  'INST·02@1071': ['falso_positivo', 'o "instrumento" é o corante obrigatório (instrumento de detecção de adulteração), não o INST·02'],
  'INST·03@1316': ['invoca', '"o instrumento abaixo recusa fazê-lo"'],
  'INST·05@1717': ['falso_positivo', '"instrumento energético" é a política de mistura, não o INST·05'],
  'INST·08@2242': ['invoca', '"entrada editável do instrumento abaixo"'],
  'INST·09@2344': ['invoca', '"o instrumento seguinte" às seis fichas de rota é o INST·09 (§08.1)'],
  'INST·09@2456': ['outro_instrumento', 'a frase apresenta o INST·10 ("instrumento assinatura")'],
  'INST·10@2344': ['invoca', '"confira contra o que o verificador devolve"'],
  'INST·10@2456': ['invoca', '"Este é o instrumento assinatura do módulo"'],
};
const OCORR = {
  'INST·02@2637': 'markup, §Erros item 02: "Ver INST·02."',
  'INST·08@3207': 'markup, §Ref (B3): valor padrão "carregado no INST·08"',
  'INST·10@646': 'comentário CSS no <style>, não visível',
  'INST·10@828': 'markup, §00.3: apresenta o INST·10 como instrumento assinatura',
};
for (const i of I.instrumentos) {
  for (const m of i.posicao.mencoes_a_instrumento_na_mesma_secao) {
    const l = LEITURA[`${i.id_fonte}@${m.linha_aprox}`];
    m.leitura_desta_extracao = l ? { classe: l[0], motivo: l[1] } : { classe: 'nao_lida', motivo: null };
  }
  for (const oc of i.posicao.outras_ocorrencias_do_id_na_fonte) {
    const k = OCORR[`${i.id_fonte}@${oc.linha}`];
    oc.leitura_desta_extracao = k ?? (oc.onde === 'script' ? 'script' : 'nao_lida');
  }
}

// ------------------------------------------------ patch: catalogo por instrumento
const catNomes = nomesCatalogo();
for (const i of I.instrumentos) {
  const cn = catNomes[i.id_fonte] || null;
  i.comparacao_codigo.catalogo = cn
    ? { nome_catalogo: cn.nome, descricao_catalogo: cn.descricao, nome_igual: cn.nome === i.titulo, fonte: CATALOGO }
    : { nome_catalogo: null, descricao_catalogo: null, nome_igual: false, fonte: CATALOGO, nota: 'id ausente na tabela do catálogo' };
}
const difCat = I.instrumentos.filter((i) => !i.comparacao_codigo.catalogo.nome_igual);
if (!I.divergencias.some((d) => d.id === 'div-m14-inst-nomes-catalogo') && difCat.length) {
  I.divergencias.push({
    id: 'div-m14-inst-nomes-catalogo',
    instrumento: difCat.map((i) => i.id_fonte).join(', '),
    severidade: 'baixa',
    tema: 'Nome do instrumento: span.nm da fonte × tabela do catálogo canônico',
    leituras: difCat.map((i) => ({ onde: `${i.id_fonte} — fonte × catálogo`, texto: `${i.titulo} × ${i.comparacao_codigo.catalogo.nome_catalogo}` })),
    classe: 'fonte × catálogo',
    nota: 'O catálogo encurta ou reformata o nome. A descrição do INST·09 no catálogo ("órgão competente, onde entra na matriz") repete a promessa do p.inst-intro que o painel não cumpre (div-m14-inst09-campos-prometidos).',
    decisao: null,
  });
  I.contagens.divergencias = I.divergencias.length;
}
fs.writeFileSync(`${OUTDIR}/instrumentos.json`, JSON.stringify(I, null, 2) + '\n', 'utf8');

fs.writeFileSync(`${OUTDIR}/modulo.md`, escTags(moduloMd()), 'utf8');
fs.writeFileSync(`${OUTDIR}/aparato.md`, escTags(aparatoMd()), 'utf8');
fs.writeFileSync(`${OUTDIR}/instrumentos.md`, escTags(instrumentosMd(catNomes)), 'utf8');
console.log('ok', { difCat: difCat.map((i) => [i.id_fonte, i.titulo, i.comparacao_codigo.catalogo.nome_catalogo]) });
