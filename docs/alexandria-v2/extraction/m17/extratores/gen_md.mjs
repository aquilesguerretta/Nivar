// Gera modulo.md, aparato.md e instrumentos.md a partir dos JSONs (as tabelas
// literais saem do JSON; a prosa de leitura é desta extração).
import fs from 'node:fs';
import * as L from './lib.mjs';

const J = (f) => JSON.parse(fs.readFileSync(L.OUTDIR + '/' + f, 'utf8'));
const m = J('modulo.json'), a = J('aparato.json'), ins = J('instrumentos.json');
const esc = (s) => String(s ?? '—').replace(/\|/g, '\\|').replace(/\n/g, ' ');
const cut = (s, n = 110) => { s = String(s ?? ''); return s.length > n ? s.slice(0, n - 1) + '…' : s; };
const w = (name, lines) => fs.writeFileSync(L.OUTDIR + '/' + name, lines.join('\n') + '\n', 'utf8');
const divTable = (ds) => ['| Id | Tipo | Tema | Leitura A | Leitura B |', '|---|---|---|---|---|',
  ...ds.map((d) => `| ${d.id} | ${esc(d.tipo)} | ${esc(d.tema)} | ${esc(cut(d.leitura_a && d.leitura_a.texto, 90))} (${esc(d.leitura_a && d.leitura_a.onde)}) | ${esc(cut(d.leitura_b && d.leitura_b.texto, 90))} (${esc(d.leitura_b && d.leitura_b.onde)}) |`)];

// Seção "Verificação" (verificador adversarial, 2026-09-17). Método próprio, independente de verify.mjs:
// recontagem por regex direto no HTML, avaliação do `var Q`/`var J`/`var M` com vm e comparação campo a campo.
const VER_COMUM = [
  'Verificador adversarial, 2026-09-17, com método próprio (independente de `verify.mjs`): recontagem por regex direto no HTML, `var Q`/`var J`/`var M` avaliados com `vm` e comparação campo a campo.',
  '',
  '- **Contagens recalculadas e confirmadas:** 22 seções, 11 aulas, 12 instrumentos (1 no §MAP), 192 termos em 8 famílias (25/19/26/27/20/23/23/29), 18 exercícios (5/5/4/4, `div.dvs`), 30 itens de checklist, 20 erros, 10 questões × 4, 6 fichas × 7, caso 2/5/7 (6 ausentes), 7 faixas de voz, 6 glosas, 8 blocos de referência + 6 categorias (script: 14), 17 jurisdições (15 assinaturas distintas, 13 exclusivas), 11 homônimos no glossário do código, 0 instrumentos/termos do M17 no código.',
  '- **Verbatim, 100%:** 10 questões (enunciado, 4 alternativas, gabarito, explicação), 30 itens de checklist, 192 termos + definições (e linhas), 20 erros, 18 exercícios (categoria, enunciado, resposta), 42 campos de ficha, 5 etapas e 7 declarações do caso, 7 faixas de voz, 22 entradas do roteiro, fórmulas dos 12 instrumentos contra o `<script>` (e cenário-padrão recalculado nos 06, 09, 10 e 11).',
  '- **Amostra:** 298 campos de conteúdo com origem espalhados por todos os grupos: 0 falha verbatim (fora os estados de instrumento, que são composição do script e foram conferidos por fragmento). Origem fora de ±3 linhas: só `m17-cap-08` (L2292 = abertura do `div.box.gd`, trecho em L2296), coerente com a convenção "linha da abertura"; mantido.',
  '- **Divergências conferidas na fonte:** todas as de fonte×fonte citadas (Aula 08/09, glosa carbono, glosa capacidade, 15/13 assinaturas, "Duas coisas" × 4 linhas, flex 2/2/6, 554,72 − 325, I03 13/24 com peso 1, I09 +15,6/+100/+20%, I04 3 chips/4 linhas, I05 6 jurisdições). Nenhuma inventada.',
];

// ───────────── modulo.md ─────────────
{
  const c = m.contagens;
  const L1 = [
    '# M17 · grupo "modulo"', '',
    `Fonte (só leitura): \`${m.fonte.arquivo}\` (${m.fonte.linhas_total} linhas). Saída: [\`modulo.json\`](modulo.json). Extrator: \`extratores/m17_modulo.mjs\`.`, '',
    '**Como foi extraído.** Parser de DOM próprio (sem dependência) sobre o HTML; literais do `<script>` avaliados com `vm`. Nenhum texto de conteúdo foi digitado. `extratores/verify.mjs` confere cada campo `html`/`texto` como substring normalizada da fonte e cada `origem` contra a linha declarada (resultado em `extratores/verify-resultado.json`).', '',
    '## Identidade', '',
    `| Campo | Valor literal | Linha |`, '|---|---|---|',
    `| \`<title>\` | ${esc(m.identidade.title_tag.texto)} | ${m.identidade.title_tag.origem.linha_aprox} |`,
    `| kicker | ${esc(m.identidade.kicker.texto)} | ${m.identidade.kicker.origem.linha_aprox} |`,
    `| h1 (título) | ${esc(m.identidade.titulo.texto)} | ${m.identidade.titulo.origem.linha_aprox} |`,
    `| subtítulo | ${esc(cut(m.identidade.subtitulo.texto, 160))} | ${m.identidade.subtitulo.origem.linha_aprox} |`,
    `| horas | **null** — ${esc(m.identidade.horas_nota)} | — |`,
    `| trilha | **null** — ${esc(m.identidade.trilha_nota)} | — |`,
    '',
    `**Catálogo canônico (P24).** Título "${esc(m.comparacao_codigo.catalogo_canonico.titulo)}": igual ao h1 = **${m.comparacao_codigo.catalogo_canonico.titulo_igual_fonte}**. Títulos dos 12 instrumentos iguais: ${m.comparacao_codigo.catalogo_canonico.instrumentos_titulos_iguais_fonte}. Rótulos e títulos das 11 aulas iguais na fonte, no código e no catálogo: ${m.comparacao_codigo.titulos.filter((t) => t.iguais).length}/11.`, '',
    '### Pills do hero', '',
    '| Pill (markup) | Valor que o script escreve | Regra do script |', '|---|---|---|',
    ...m.identidade.pills.map((p) => `| ${esc(p.texto)} | ${p.valor_calculado_pelo_script ?? '(estático)'} | ${esc(p.regra_script ? cut(p.regra_script, 90) : '')} |`),
    '',
    `Marca: ${m.identidade.marca_P24.ocorrencias_GridAlpha_no_body} ocorrências de "GridAlpha" no corpo (P24/P7).`, '',
    '## §00 Tese', '',
    `${m.tese.blocos.length} blocos, literais, em \`tese.blocos\` (tipos: ${[...new Set(m.tese.blocos.map((b) => b.tipo))].join(', ')}). Seis glosas de desambiguação com ${c.sentidos_de_glosa} sentidos no total.`, '',
    '## Resultado esperado / capacidades', '',
    '**`secao_de_modulo: null`.** ' + m.resultado_esperado.nota, '',
    '| Id | Seção | Capacidade (literal, dentro de bloco P7) | P14 |', '|---|---|---|---|',
    ...m.resultado_esperado.capacidades_em_blocos_de_produto.map((x) => `| ${x.id} | ${x.secao} | ${esc(x.texto ?? '(bloco de produto sem frase "Capacidade entregue")')} | ${esc((x.marcacao_p14 || []).join(', '))} |`),
    '',
    '## §MAP — perguntas do mapa', '',
    esc(m.mapa.perguntas_por_aula_nota), '',
    '| Dimensão | Pergunta (script DIMS) | O que agrupa | O que não agrupa |', '|---|---|---|---|',
    ...m.mapa.dimensoes.map((d) => `| ${esc(d.dimensao)} | ${esc(d.script.pergunta)} | ${esc(cut(d.agrupa_texto, 100))} | ${esc(cut(d.nao_agrupa_texto, 80))} |`),
    '',
    `Grade: ${m.mapa.grade_17.length} jurisdições (${m.mapa.grade_17.filter((j) => j.ficha).length} com ficha), em \`mapa.grade_17\`.`, '',
    '## Roteiro', '',
    '| # | Tipo | Marcador | Título (h2) | Instrumentos | Código |', '|---|---|---|---|---|---|',
    ...m.roteiro.map((r) => `| ${r.ordem} | ${r.tipo} | ${esc(r.marcador_texto)} | ${esc(r.titulo.texto)} | ${r.instrumentos.map((i) => i.rotulo.replace('Instrumento ', 'I')).join(', ') || '—'} | ${r.codigo ? (r.codigo.title_igual_h2 && r.codigo.subtitle_igual_rotulo ? 'título/subtítulo iguais' : 'DIVERGE') + ` · instruments ${r.codigo.instruments}` : '—'} |`),
    '',
    `**Contagem de aulas (P8):** seções "Aula NN" ${m.comparacao_codigo.contagem_aulas.fonte_secoes_Aula_NN} · regra do hero ${m.comparacao_codigo.contagem_aulas.fonte_regra_hero_script} · código ${m.comparacao_codigo.contagem_aulas.codigo_MODULO_17_AULAS} (totalInModule ${m.comparacao_codigo.contagem_aulas.codigo_totalInModule}) · AULAS_POR_BLOCO ${m.comparacao_codigo.contagem_aulas.codigo_AULAS_POR_BLOCO} · catálogo ${m.comparacao_codigo.contagem_aulas.catalogo_canonico}. Concordam: **${m.comparacao_codigo.contagem_aulas.concordam}**.`, '',
    '## Critérios (P14/P18)', '',
    m.criterio.nota_P18, '',
    '| Id | Seção | Literal | P14 |', '|---|---|---|---|',
    ...m.criterio.criterios.map((k) => `| ${k.id} | ${k.secao} | ${esc(cut(k.texto || (k.titulo_secao && k.titulo_secao.texto) || (k.lede && k.lede.texto), 140))} | ${esc(k.marcacao_p14.join(', '))} |`),
    '',
    `Mensagens do placar (script): ≥8 → "${m.criterio.criterios[2].script.mensagens.acertos_ge_8}" · <8 → "${m.criterio.criterios[2].script.mensagens.acertos_lt_8}".`, '',
    '## Laboratórios', '', m.laboratorios.nota, '',
    '## Voz e princípios', '',
    `Roteiro oral (§Voz), ${m.voz.roteiro_oral.faixas.length} faixas, P14 = oral + cronometrado:`, '',
    '| Faixa | Título |', '|---|---|',
    ...m.voz.roteiro_oral.faixas.map((f) => `| ${esc(f.faixa)} | ${esc(f.titulo)} |`),
    '',
    'Princípios (ponteiros para `tese.blocos`): ' + m.voz.principios_editoriais.map((p) => `${p.nome_anotacao} (${p.ref_bloco}, L${p.linha_aprox})`).join('; ') + '.', '',
    '## Erros comuns', '',
    `${m.erros_comuns.itens.length} itens literais (§Erros), mais ${m.erros_comuns.ponteiros_em_aula.length} ponteiros para destaques de erro dentro das aulas (${m.erros_comuns.ponteiros_em_aula.map((p) => `${p.aula_id} "${p.rotulo}"`).join('; ')}).`, '',
    '| # | Erro | Correção imediata |', '|---|---|---|',
    ...m.erros_comuns.itens.map((e) => `| ${e.numero} | ${esc(e.erro_texto)} | ${esc(e.correcao_texto)} |`),
    '',
    '## Tradutor / § Map', '', m.tradutor.nota, '',
    '## Comparação com o código (P8)', '',
    `- Leads do código iguais ao lede da fonte (texto): ${m.comparacao_codigo.leads.filter((x) => x.lead_codigo_igual_lede_fonte_texto).length}/11.`,
    `- Cobertura por palavra (código × fonte, sem instrumento): ${m.comparacao_codigo.cobertura_por_palavra_codigo_vs_fonte.map((x) => `${x.aula_id.slice(-2)} ${x.pct}%`).join(' · ')}. Os únicos tokens não casados são os rótulos dos blocos "três níveis" (COD-M17-01).`,
    `- Instrumentos no código: ${m.comparacao_codigo.instrumentos_no_codigo}. Exercícios: ${m.comparacao_codigo.exercicios_no_codigo.MODULO_17_EXERCICIOS_SOLTOS} (importados em alexandria-curriculo.ts: ${m.comparacao_codigo.exercicios_no_codigo.importado_em_alexandria_curriculo_ts}).`,
    `- Catálogo do código (bloco-17): level ${m.comparacao_codigo.catalogo_codigo_bloco_17.level}, track ${m.comparacao_codigo.catalogo_codigo_bloco_17.track}, horas ${m.comparacao_codigo.catalogo_codigo_bloco_17.estimatedHoursMin}–${m.comparacao_codigo.catalogo_codigo_bloco_17.estimatedHoursMax} (sem origem na fonte).`, '',
    '| Id | Sev. | Tema | Evidência |', '|---|---|---|---|',
    ...m.codigo_divergencias.map((d) => `| ${d.id} | ${d.sev} | ${esc(d.tema)} | ${esc(cut(d.evidencia, 220))} |`),
    '',
    '## Divergências (fonte × fonte, × catálogo, × código)', '', 'Nenhuma resolvida (camada fonte).', '',
    ...divTable(m.divergencias), '',
    '## Verificações da fonte que conferem', '',
    ...m.verificacoes_da_fonte.map((v) => `- **${v.tema}.** ${v.resultado}`), '',
    '## Ausências declaradas', '',
    '| Campo | Valor | Motivo |', '|---|---|---|',
    '| `identidade.horas` | null | a fonte não declara horas |',
    '| `identidade.trilha` | null | só "Alexandria · GridAlpha · Módulo 17" |',
    '| `identidade.eixos` | null | não há eixos rotulados |',
    '| `resultado_esperado.secao_de_modulo` | null | capacidades só existem em blocos P7 |',
    '| `mapa.perguntas_por_aula` | null | o §MAP é jurisdição × dimensão |',
    '| `laboratorios.secao_lab` | null | não há § Lab |',
    '| `tradutor.secao` | null | não há Tradutor |',
    '',
    '## Verificação', '', ...VER_COMUM,
    '- **Correção 1 (inequívoca):** `criterio.criterios[m17-crit-quiz].script.mensagens` trazia `"pass"`/`"fail"` (a regex pegava o 1º ternário, que é a classe CSS). Agora traz as duas mensagens exibidas pelo script (L5288–5289). Corrigido no extrator.',
    '- **Correção 2 (inequívoca):** `div-m17-09` leitura B dizia "o .ref-list tem 7 blocos de fonte"; a fonte tem 8 `p` no `.ref-list` (L3987–4046), e 8 + (7 `tr` − 1) = 14, o número do script. Corrigido no extrator.',
    '',
    '## Contagens', '', '```json', JSON.stringify(m.contagens, null, 1), '```',
  ];
  w('modulo.md', L1);
}

// ───────────── aparato.md ─────────────
{
  const k = a.contagens;
  const L2 = [
    '# M17 · grupo "aparato"', '',
    `Fonte (só leitura): \`${a.fonte.arquivo}\`. Saída: [\`aparato.json\`](aparato.json). Extrator: \`extratores/m17_aparato.mjs\`. ${a.metodo}`, '',
    '## Caso — Operação A', '',
    `Marcador literal: **${esc(a.caso.marcador.texto)}** (L${a.caso.marcador.origem.linha_aprox}). Título: "${esc(a.caso.titulo.texto)}". \`parte\` = "${a.caso.parte}". ${a.caso.nota_parte}`, '',
    'Perguntas (literais, h3):', '', ...a.caso.perguntas.map((p) => `- ${esc(p.texto)} (L${p.origem.linha_aprox})`), '',
    `Pergunta 1 em ${a.caso.etapas_pergunta_1.length} etapas; pergunta 2 com as 7 declarações (${k.caso_declaracoes_ausentes} ausentes, 1 declarada):`, '',
    '| # | Declaração | Estado na fonte |', '|---|---|---|',
    ...a.caso.diagnostico_pergunta_2.map((d) => `| ${d.numero} | ${esc(d.chave)} | ${d.estado_fonte} |`), '',
    `**\`decisao_pedida: null\`.** ${a.caso.nota_decisao}`, '',
    `**\`dados_do_caso: null\`.** ${a.caso.nota_dados}`, '',
    '## Fichas de jurisdição (§Fichas)', '',
    `${a.fichas.itens.length} fichas × ${a.fichas.itens[0].campos.length} campos; o item (c) de "Não permite concluir" é uma lacuna-exercício em todas.`, '',
    '| Ficha | Etiqueta | Campos |', '|---|---|---|',
    ...a.fichas.itens.map((f) => `| ${esc(f.jurisdicao)} | ${esc(f.etiqueta && f.etiqueta.texto)} | ${f.campos.map((c) => c.campo).join(' · ')} |`), '',
    '## Quiz (§Quiz)', '',
    `Título: "${esc(a.avaliacao.titulo.texto)}". Lede: "${esc(a.avaliacao.introducao.texto)}"`, '',
    a.avaliacao.mecanica_fonte, '',
    '| Faixa | Condição | Mensagem (literal) |', '|---|---|---|',
    ...a.avaliacao.faixas_de_placar_script.faixas.map((f) => `| ${f.intervalo} | ${f.condicao} | ${esc(f.mensagem)} |`), '',
    '| Q | Enunciado | Gabarito (nº exibido) | Menções |', '|---|---|---|---|',
    ...a.avaliacao.perguntas.map((q) => `| ${q.numero} | ${esc(cut(q.enunciado_texto, 120))} | ${q.gabarito.numero_exibido}: ${esc(cut(q.gabarito.texto, 70))} | ${q.mencoes_em_prosa.join(', ') || '—'} |`), '',
    `Distribuição do gabarito: ${JSON.stringify(a.avaliacao.distribuicao_gabarito)}. Alternativas e explicações completas no JSON.`, '',
    '## Checklist final (§Final)', '',
    `${a.checklist_final.itens.length} itens. ${a.checklist_final.nota_P14}`, '',
    ...a.checklist_final.itens.map((i) => `${i.numero}. ${i.texto}`), '',
    '## Exercícios (§Ex)', '',
    `${a.exercicios.total_na_fonte} exercícios; nenhum com tag de aula (P9: todos soltos). Categoria estrutural pelo divisor \`div.dvs\` anterior: ${Object.entries(a.exercicios.por_categoria).map(([x, n]) => `${x} ${n}`).join(' · ')}. Critério por exercício: null (a fonte não declara).`, '',
    '| Tag | Categoria | Enunciado | Aula | Código |', '|---|---|---|---|---|',
    ...a.exercicios.itens.map((e) => `| ${e.tag} | ${esc(e.categoria_estrutural)} | ${esc(cut(e.enunciado_texto, 110))} | **sem aula** | ${e.codigo ? `${e.codigo.id} (prompt ${e.codigo.prompt_igual ? '=' : '≠'}, gabarito ${e.codigo.gabarito_igual ? '=' : '≠'}, points ${e.codigo.points})` : 'ausente'} |`), '',
    `Mais ${a.exercicios.exercicios_implicitos_fichas.length} exercícios implícitos (item (c) das fichas), sem resposta de referência e sem aula.`, '',
    '## Referências (§Ref)', '',
    `${a.referencias.nota_itens} Data geral: ${a.referencias.data_de_verificacao_geral}.`, '',
    '| Id | Bloco | Consulta em | Datas citadas | Norma |', '|---|---|---|---|---|',
    ...a.referencias.itens.map((r) => `| ${r.id} | ${esc(r.bloco)} | ${esc(r.data_consulta)} | ${esc(r.datas_citadas.join('; '))} | ${esc(r.norma_citada.join('; '))} |`), '',
    'Hierarquia de fontes (tabela literal):', '',
    '| Categoria | Serve como fonte de | Não serve como fonte de |', '|---|---|---|',
    ...a.referencias.hierarquia_de_fontes.linhas.map((l) => `| ${esc(l.categoria)} | ${esc(l.serve_texto)} | ${esc(l.nao_serve_texto)} |`), '',
    '## Glossário (§Lex)', '',
    `${a.glossario.termos.length} termos em ${a.glossario.contagem.familias} famílias (${a.glossario.contagem.por_familia.map((f) => f.termos).join(' + ')}). Código: **${a.glossario.codigo_atual.verbetes_m17} verbetes M17 — faltam os ${a.glossario.contagem.ausentes_no_codigo}**. Homônimos em outros módulos (informativo, não são o verbete M17): ${a.glossario.codigo_atual.homonimos_em_outros_modulos.map((h) => h.termo).join(', ')}. Parentes por prefixo (informativo; colisões anunciadas pelo §Lex, não cobrem o termo M17): ${a.glossario.codigo_atual.parentes_por_prefixo.map((h) => `${h.termo} ~ ${h.verbetes_relacionados.map((v) => v.id).join('/')}`).join('; ')}.`, '',
    '| Id | Família | Termo | Definição (literal) |', '|---|---|---|---|',
    ...a.glossario.termos.map((t) => `| ${t.id} | ${t.familia_indice} | ${esc(t.termo)} | ${esc(t.definicao_texto)} |`), '',
    '## Divergências', '', ...divTable(a.divergencias), '',
    '## Verificação', '', ...VER_COMUM,
    '- **Correção 1 (inequívoca):** `avaliacao.faixas_de_placar_script.faixas[].mensagem` trazia `"pass"`/`"fail"` (a regex pegava o ternário da classe CSS). Agora traz as duas mensagens literais do placar (L5288–5289); a tabela "Faixa" acima reflete isso. Corrigido no extrator.',
    '',
    '## Contagens', '', '```json', JSON.stringify(a.contagens, null, 1), '```',
  ];
  w('aparato.md', L2);
}

// ───────────── instrumentos.md ─────────────
{
  const L3 = [
    '# M17 · instrumentos', '',
    `Fonte (só leitura): \`${ins.fonte.arquivo}\`. Saída: [\`instrumentos.json\`](instrumentos.json). Extrator: \`extratores/m17_instrumentos.mjs\`.`, '',
    ins.metodo, '',
    '## Resumo', '',
    '| Id | Título | Onde | Invocado entre | Kind (anotação) | Entradas | Fonte dos números | Tolerância | Código |', '|---|---|---|---|---|---|---|---|---|',
    ...ins.instrumentos.map((x) => `| ${x.id} | ${esc(x.titulo.texto)} | ${x.aula_id || '§MAP (fora de aula)'} L${x.ponto_de_invocacao.origem.linha_aprox} | ${esc(cut(x.ponto_de_invocacao.bloco_anterior && x.ponto_de_invocacao.bloco_anterior.texto_inicial, 40))} ⟶ ${esc(cut(x.ponto_de_invocacao.bloco_seguinte ? x.ponto_de_invocacao.bloco_seguinte.texto_inicial : '(fim da aula)', 40))} | ${x.kind_sugerido} | ${x.entradas.length} | ${x.fonte_dos_numeros ? 'srcnote' : 'null'} | null | ${x.estado_codigo} |`), '',
    `**Estado no código:** ${ins.comparacao_codigo.conclusao} (instruments nas aulas: ${ins.comparacao_codigo.instruments_nas_aulas}).`, '',
    '## Por instrumento', '',
  ];
  for (const x of ins.instrumentos) {
    L3.push(`### ${x.rotulo} · ${x.titulo.texto}`, '');
    L3.push(`- **Onde:** ${x.aula_id || 'fora de aula (§MAP)'}, L${x.ponto_de_invocacao.origem.linha_aprox}, ${x.ponto_de_invocacao.posicao_na_secao}.`);
    L3.push(`- **Instrução (literal):** ${x.instrucao.texto}`);
    L3.push(`- **Pergunta:** null. ${x.pergunta_nota}`);
    if (x.mencoes_no_texto.length) L3.push(`- **Menções no texto:** ${x.mencoes_no_texto.map((mm) => `${mm.secao} L${mm.linha_aprox}`).join('; ')}.`);
    L3.push(`- **Fonte dos números:** ${x.fonte_dos_numeros ? x.fonte_dos_numeros.texto : 'null (a fonte não declara)'}`);
    L3.push('- **Tolerâncias:** null (não declaradas).');
    L3.push('', '| Entrada | Tipo | Unidade | Faixa | Padrão |', '|---|---|---|---|---|');
    for (const e of x.entradas) L3.push(`| ${esc(e.rotulo || e.id)} | ${esc(e.tipo)} | ${esc(e.unidade || '')} | ${e.min !== undefined ? `${e.min}–${e.max} (passo ${e.passo})` : esc(cut((e.opcoes || []).join(' / '), 120))} | ${esc(e.padrao)} |`);
    L3.push('', '| Saída | Fórmula (script) |', '|---|---|');
    for (const s of x.saidas) L3.push(`| ${esc(s.rotulo || s.id)} ${s.unidade ? `(${esc(s.unidade)})` : ''} | ${esc(s.formula || s.descricao_anotacao || (s.classe_fixa ? `veredito, classe ${s.classe_fixa}` : ''))} |`);
    const cp = x.cenario_padrao;
    if (cp && cp.saidas) L3.push('', `**Cenário-padrão:** ${cp.saidas.map((o) => `${o.rotulo} = ${o.valor}${o.unidade ? ' ' + o.unidade : ''}`).join(' · ')}`);
    if (cp && cp.leitura) L3.push('', `**Leitura no cenário-padrão (capturada):** ${cut(cp.leitura.texto, 400)}`);
    if (x.ramos) L3.push('', '**Ramos:** ' + x.ramos.map((r) => `\`${r.condicao}\``).join(' · '));
    if (x.estados) L3.push('', `Estados capturados: ${x.estados.length}.`);
    if (x.anomalias_dos_dados && x.anomalias_dos_dados.length) L3.push('', `Anomalias dos dados: ${x.anomalias_dos_dados.length} (ver JSON).`);
    if (x.observacoes) L3.push('', ...x.observacoes.map((o) => `- ${o}`));
    L3.push('');
  }
  L3.push('## Grades geradas por script', '', `- \`#jg-main\` (§MAP): ${ins.grades_geradas_por_script.jg_main.linhas.length} linhas.`, `- \`#jg-us\` (Aula 05): ${ins.grades_geradas_por_script.jg_us.linhas.length} linhas — ${ins.grades_geradas_por_script.jg_us.estado_codigo}.`, '');
  L3.push('## Divergências', '', ...divTable(ins.divergencias), '', '## Verificação', '', ...VER_COMUM,
    '- **Acréscimo (inequívoco):** `div-m17-inst-10-i12-entidade-escapada`. O `corr` do enunciado 2 do Instrumento 12 (L5100) contém `&ldquo;`/`&rdquo;` e o render passa por `esc()` (L5156, L4101), então o learner vê as entidades como texto. O estado capturado já mostrava `&amp;ldquo;`, mas a divergência não estava registrada. Acrescentada no extrator.',
    '- **Fórmulas:** as 12 conferidas contra o script. São condensadas (declarado em `metodo`); a trava `if(cr>ct) cr=ct; if(gr>gt) gr=gt;` do 10 está em `regra_de_consistencia`. Nenhuma diverge.',
    '', '## Contagens', '', '```json', JSON.stringify(ins.contagens, null, 1), '```');
  w('instrumentos.md', L3);
}
console.log('md ok');
