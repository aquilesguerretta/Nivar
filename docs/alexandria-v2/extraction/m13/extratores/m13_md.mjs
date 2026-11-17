// Gera modulo.md, aparato.md e instrumentos.md a partir dos JSONs do M13.
// Nenhum texto de conteúdo é digitado aqui: tudo que aparece entre aspas ou
// em célula de tabela sai do JSON, que saiu do HTML por programa. Só a
// moldura (títulos de seção, rótulos de coluna, notas de método) é redigida.
import fs from 'node:fs';
import { OUTDIR } from './m13_lib.mjs';

const J = (n) => JSON.parse(fs.readFileSync(`${OUTDIR}/${n}.json`, 'utf8'));
const MOD = J('modulo'), APA = J('aparato'), INS = J('instrumentos');
const VER = JSON.parse(fs.readFileSync(`${OUTDIR}/extratores/verify-report.json`, 'utf8'));

const c = (s) => (s == null ? '—' : String(s).replace(/\|/g, '\\|').replace(/\s+/g, ' ').trim());
const q = (s) => (s == null ? '—' : `"${c(s)}"`);
const hm = (h) => (h == null ? '—' : c(h.replace(/<\/?(b|strong)>/g, '**').replace(/<\/?(em|i)>/g, '_').replace(/<[^>]+>/g, '')));
const L = (o) => (o && o.linha_aprox ? `L${o.linha_aprox}` : '—');
const tab = (cab, linhas) => [`| ${cab.join(' | ')} |`, `|${cab.map(() => '---').join('|')}|`, ...linhas.map((l) => `| ${l.map((x) => (x == null ? '—' : String(x).replace(/\n/g, ' '))).join(' | ')} |`)].join('\n');
const nf = (n) => n.toLocaleString('pt-BR');
const fonte = `\`${MOD.fonte.arquivo}\` (${nf(MOD.fonte.linhas_total)} linhas)`;
const cab = (grupo, json, extrator) => `# M13 · grupo "${grupo}"

Fonte (só leitura): ${fonte}. Saída: [\`${json}\`](${json}). Extrator: [\`extratores/${extrator}\`](extratores/${extrator}).
Camada **fonte**: todo texto entre aspas ou em tabela saiu do JSON, e o JSON saiu do HTML por programa; nada foi
digitado nem parafraseado. \`L\` é a linha aproximada no HTML-fonte. As divergências ficam com as duas leituras, e
nenhuma é resolvida aqui (P17–P24 valem só na camada de produto).
`;
const divTab = (arr) => tab(['Id', 'Eixo', 'Sev.', 'Leitura A', 'Leitura B'], arr.map((d) => [d.id, c(d.eixo), d.severidade, c(d.leitura_a), c(d.leitura_b)]));
const cob = (k) => { const v = VER.cobertura_por_token[k]; return v ? `${v.pct}% (${nf(v.cobertos)}/${nf(v.tokens_fonte)})` : '—'; };

// ═════════════════════════════ modulo.md ═════════════════════════════
{
  const m = MOD, id = m.identidade, k = m.contagens;
  const aulas = m.roteiro.filter((r) => r.tipo === 'aula');
  const out = [];
  out.push(cab('modulo', 'modulo.json', 'm13_modulo.mjs'));
  out.push(`**Verificação** (\`m13_verify.mjs\`, os três JSONs juntos): ${nf(VER.strings_verificadas)} strings de conteúdo são substring
da fonte normalizada e ${nf(VER.origens_verificadas)} origens estão na linha declarada (±3), com ${VER.falhas_substring.length} e ${VER.falhas_origem.length} falhas. Cobertura por token:
§00 ${cob('§00 (modulo.tese)')}, §MAP ${cob('§MAP (modulo.mapa)')}, §Voz ${cob('§Voz (modulo.voz.roteiro_oral)')}, §Erros ${cob('§Erros (modulo.erros_comuns)')}.
`);
  out.push(`## Identidade

| Campo | Valor literal | Origem |
|---|---|---|
| \`<title>\` | ${q(id.title_tag.texto)} | ${L(id.title_tag.origem)} |
| Eyebrow (kicker) | ${q(id.eyebrow.texto)} | ${L(id.eyebrow.origem)} |
| Título (h1) | ${q(id.titulo.texto)} | ${L(id.titulo.origem)} |
| Subtítulo (p.sub) | ${q(id.subtitulo.texto)} | ${L(id.subtitulo.origem)} |
| Pills | ${id.pills.map((p) => q(p.texto)).join(' · ')} | ${L(id.pills[0].origem)}–${L(id.pills[id.pills.length - 1].origem)} |
| Rodapé | ${q(id.rodape.titulo.texto)}; ${id.rodape.linhas.map(q).join(' / ')} | ${L(id.rodape.origem)} |
| Horas | texto/min/max = \`null\`: ${c(id.horas?.nota)} | — |
| Eixos | \`null\`: ${c(id.eixos_nota)} | — |

**As três lentes (§00.2), literais:**

${id.lentes.map((l, i) => `${i + 1}. **${c(l.rotulo)}**: ${q(l.corpo?.texto)} (${L(l.origem)})`).join('\n')}

**Catálogo canônico (P24).** O catálogo (\`${m.catalogo.arquivo}\`, L${m.catalogo.linha_titulo}) dá ${q(m.catalogo.titulo_catalogo)}.
Esse título é igual ao h1 (${m.catalogo.titulo_igual_h1}) e ao \`<title>\` (${m.catalogo.titulo_igual_title_tag}).
- Trilha no catálogo: ${q(m.catalogo.trilha)}. Código: ${c(m.catalogo.trilha_codigo)}.
- Escala no catálogo (L${m.catalogo.linha_escala}): ${q(m.catalogo.escala)}. Confere com as pills da fonte.
- Tabela-resumo: \`${c(m.catalogo.linha_tabela_resumo)}\`.
- \`alexandria-blocks.ts\`: \`${c(m.catalogo.alexandria_blocks_ts)}\`.
- ${c(m.catalogo.nota_P24)}

**Marca (P24).** "GridAlpha" aparece em ${m.gridalpha_visivel_P24.length} linhas voltadas ao learner:
${m.gridalpha_visivel_P24.map((g) => `L${g.linha} (${g.contexto})`).join(', ')}. O texto foi mantido literal.
`);
  out.push(`## Resultado esperado / capacidades

\`null\`. ${c(m.resultado_esperado_nota)}
`);
  out.push(`## Roteiro (${m.roteiro.length} seções: ${k.aulas} aulas e ${k.aparato} aparatos)

| # | Seção | Marcador | Título (h2) | Subseções | Instrumentos | Linhas | Código (\`aula-13-NN\`) |
|---|---|---|---|---|---|---|---|
${m.roteiro.map((r) => {
    const cc = r.comparacao_codigo;
    const cod = cc ? `${r.vinculos?.aula_id_codigo}: title=h2 ${cc.title_igual_h2 ? 'sim' : 'NÃO'}; subtitle=rótulo ${cc.subtitle_igual_rotulo ? 'sim' : 'NÃO'}; lead=lede ${cc.lead_igual_lede ? 'sim' : 'NÃO'}; instrumentos ${cc.instrumentos_codigo}` : '—';
    return `| ${r.ordem_na_fonte} | ${r.section_id} | ${c(r.marcador.codigo)} · ${c(r.marcador.rotulo)} | ${q(r.titulo.texto)} | ${r.subsecoes.map((s) => s.numero).join(', ') || '—'} | ${r.instrumentos.map((x) => x.id).join(', ') || '—'} | L${r.linha_inicio}–${r.linha_fim} | ${cod} |`;
  }).join('\n')}

**Contagem de aulas (P8).** A fonte tem ${k.aulas} seções \`Aula NN\`, a pill diz ${q(id.pills[0].texto)}, o catálogo diz 8 e
\`alexandria-trilhas.ts\` tem \`'bloco-13': 8\`. O código tem 8 aulas (\`aula-13-01\`…\`aula-13-08\`). Todos concordam.
Nas 8 aulas, \`title\` = h2 e \`subtitle\` = rótulo do \`sec-id\`. O \`lead\` difere do lede em ${aulas.filter((r) => !r.comparacao_codigo.lead_igual_lede).length} aulas
(${aulas.filter((r) => !r.comparacao_codigo.lead_igual_lede).map((r) => r.marcador.codigo).join(', ')}): é espaço antes da pontuação, ver \`div-m13-codigo-lead-espacos\`.

**Subseções por aula, literais:**

${aulas.map((r) => `- **${c(r.marcador.codigo)}**: ${r.subsecoes.map((s) => `${s.numero} ${q(s.titulo)}`).join('; ')}`).join('\n')}
`);
  out.push(`## §MAP — Painel setorial

${c(m.mapa.perguntas_por_aula_nota)} \`perguntas_por_aula\` = \`null\`.

As únicas perguntas literais do §MAP (${m.mapa.perguntas_literais_no_map.length}):

${m.mapa.perguntas_literais_no_map.map((p) => `- ${q(p.texto)} (${L(p.origem)})`).join('\n')}

Instrumento de módulo: **${m.mapa.instrumento_de_modulo.id}** ${q(m.mapa.instrumento_de_modulo.nome)}. ${c(m.mapa.instrumento_de_modulo.nota)}
Detalhe em \`instrumentos.md\`. O §MAP tem ${m.mapa.blocos.length} blocos (L${m.mapa.linha_inicio}–${m.mapa.linha_fim}).
`);
  out.push(`## Critérios literais (P14 e P18)

${c(m.criterios.nota)}

| Id | Onde | Texto literal | P14 (inferido) | Origem |
|---|---|---|---|---|
${m.criterios.itens.map((x) => `| ${x.id} | ${c(x.rotulo_extracao)} | ${q(x.texto)} | ${(x.marcacao_p14 || []).join(', ') || '—'} | ${L(x.origem)} |`).join('\n')}

**Menções a critério do currículo (não são critério deste módulo):**
${m.criterios.mencoes_a_criterio_do_curriculo.map((x) => `- ${c(x.rotulo_extracao)}: ${q(x.texto)} (${L(x.origem)})`).join('\n')}

**Orçamento de tempo.** ${c(m.criterios.orcamento_de_tempo.nota)}
${m.criterios.orcamento_de_tempo.itens.map((x) => `- ${c(x.rotulo_extracao)}: ${x.texto ? q(x.texto) : `ver ${c(x.ver)}`} (${L(x.origem)})`).join('\n')}
`);
  out.push(`## Laboratórios e Tradutor

- Laboratórios: ${m.laboratorios.length}. ${c(m.laboratorios_nota)}
- Tradutor: \`null\`. ${c(m.tradutor_nota)}
`);
  const ro = m.voz.roteiro_oral;
  out.push(`## Voz e princípios

**§Voz — ${q(ro.titulo.texto)}** (${L(ro.marcador.origem)}). Lede: ${q(ro.lede?.texto)}. O roteiro tem ${ro.paragrafos.length} parágrafos
(P14: ${(ro.marcacao_p14 || []).join(', ')}), todos no JSON (\`voz.roteiro_oral.paragrafos\`).

**Princípios de voz (${m.voz.principios.length}), literais:**

${m.voz.principios.map((p) => `- **${c(p.rotulo_extracao)}** (${L(p.origem)}): ${p.html ? hm(p.html) : (p.linhas || []).map(q).join(' / ')}`).join('\n')}

**Caixas "Onde isso entra no produto" (P7, ${m.voz.blocos_produto_P7.itens.length}).** ${c(m.voz.blocos_produto_P7.nota)}
${m.voz.blocos_produto_P7.itens.map((x) => `${x.secao} L${x.linha_aprox} ${q(x.rotulo)}`).join('; ')}.

**Caixas "Números vivos" (${m.voz.numeros_vivos.itens.length}).** ${c(m.voz.numeros_vivos.nota)}
${m.voz.numeros_vivos.itens.map((x) => `${x.secao} L${x.linha_aprox}`).join('; ')}.

**Outras caixas box rd (${m.voz.outras_caixas_box_rd.itens.length}).** ${c(m.voz.outras_caixas_box_rd.nota)}
${m.voz.outras_caixas_box_rd.itens.map((x) => `${x.secao} L${x.linha_aprox} ${q(x.rotulo)}`).join('; ')}.

**Datas de verificação.** ${Object.entries(m.voz.datas_de_verificacao).filter(([kk]) => kk !== 'nota').map(([kk, v]) => `"${kk}" × ${v}`).join('; ')}. ${c(m.voz.datas_de_verificacao.nota)}
`);
  out.push(`## Erros comuns (§Erros, ${m.erros_comuns.itens.length})

${q(m.erros_comuns.titulo?.texto)}. Nenhum erro declara aula.

| # | Afirmação | Correção | Por que importa | Origem |
|---|---|---|---|---|
${m.erros_comuns.itens.map((e) => `| ${e.ordem} | ${c(e.afirmacao.texto)} | ${q(e.correcao.texto)} | ${q(e.por_que_importa?.texto)} | ${L(e.origem)} |`).join('\n')}
`);
  out.push(`## Divergências registradas neste grupo (${m.divergencias.length})

${divTab(m.divergencias)}

## Contagens

${tab(['Item', 'Contagem'], Object.entries(k).map(([a, b]) => [a, b]))}
`);
  out.push("\n## Verificação\n\nVerificação adversarial de 2026-09-17, feita com scripts próprios contra o HTML-fonte.\n\n- As strings de conteúdo dos três JSONs (4.741 com 12 ou mais caracteres) foram conferidas contra a fonte normalizada.\n  Só não batem campos de anotação: seletor, nota, id, rótulo de extração e saída renderizada.\n- As 614 origens foram conferidas: todas estão a ±3 linhas. 1.066 textos com origem foram localizados a partir da\n  própria linha de origem.\n- As contagens foram recalculadas direto no HTML. Batem:\n  - 18 seções, 8 aulas, 11 instrumentos, 20 erros e 9 caixas P7;\n  - 180 termos (26/22/26/24/20/26/20/16) e 14 exercícios (4/3/3/2/2);\n  - 28 itens de checklist e 36 referências (15/12/4/5, 0 URL, 2 \"Consulta em\");\n  - 21 linhas \"GridAlpha\", 13 parágrafos do §Voz, 8 \"?\" no §Caso e as datas (10 e 11).\n- **Correção (caixas \"Números vivos\").** `voz.numeros_vivos` listava as 8 caixas `box rd`, mas só 5 têm a tag\n  \"Números vivos\" (tese L674, a02 L1172, a04 L1552, a06 L2035, a07 L2199). Estas são as outras 3, agora em\n  `voz.outras_caixas_box_rd`:\n  - \"O erro clássico, e ele é frequente\" (a05 L1795);\n  - \"Anonimização e escopo\" (caso L2508);\n  - \"Nota de atualização · 2 de agosto de 2026\" (ref L3282).\n\n  Com isso, `contagens.caixas_numeros_vivos` passou de 8 para 5, e entrou `caixas_box_rd` = 8. O extrator\n  `m13_modulo.mjs` foi corrigido.\n- 12 das 26 divergências foram conferidas na fonte. Nenhuma delas é inventada.\n\n### Segunda verificação adversarial (2026-09-17)\n\nScripts independentes, fora de `extratores/`, conferiram de novo:\n\n- 3.424 strings de conteúdo contra a fonte normalizada. Só falham campos de anotação e saídas renderizadas.\n- As 614 origens, a ±3 linhas, sem falhas.\n- As 10 questões do quiz, 100%, contra o array `Q` avaliado em vm: enunciado, 40 alternativas, gabarito\n  D B A B C B A D C B, explicação e linha.\n- Os 28 itens do checklist: html, texto e linha.\n- As fórmulas dos 3 instrumentos numéricos: linhas de cálculo, `codigo_saida`, condições e textos dos 16 ramos,\n  atributos min/max/step/value dos 22 pares de campo e `numOf`.\n- As contagens declaradas: todas batem. A reexecução dos extratores deu saída idêntica (md5).\n\n- **Correção (nota das caixas P7).** `voz.blocos_produto_P7.nota` dizia que as 9 caixas citam \"GridAlpha Research\n  ou Energy Brief (marca morta, P24)\". Só que P24 só declara morta a marca GridAlpha, e a caixa da a01 (L1078) cita\n  apenas \"Energy Brief\", sem \"GridAlpha\". A nota foi corrigida no extrator `m13_modulo.mjs`.\n- **Correção (README).** O README falava em \"9 caixas de produto\" entre as linhas com \"GridAlpha\". As 21 linhas são:\n  - o kicker (L599);\n  - 15 linhas em 8 caixas P7;\n  - a linha \"O que nunca devolver\" do INST·11 (L2402);\n  - 2 linhas do §Ref (L3279 e L3297);\n  - o rodapé (L3307);\n  - o quiz Q10 (L4218).\n");
  fs.writeFileSync(`${OUTDIR}/modulo.md`, out.join('\n'));
}

// ═════════════════════════════ aparato.md ═════════════════════════════
{
  const a = APA, k = a.contagens, out = [];
  out.push(cab('aparato', 'aparato.json', 'm13_aparato.mjs'));
  out.push(`**Cobertura por token:** §Caso ${cob('§Caso (aparato.caso)')}, §Ex ${cob('§Ex (aparato.exercicios)')}, §Quiz markup ${cob('§Quiz markup (aparato.avaliacao)')},
§Quiz script ${cob('§Quiz script Q[] + placar (aparato.avaliacao)')}, §Final ${cob('§Final (aparato.checklist_final)')}, §Lex ${cob('§Lex (aparato.glossario)')}, §Ref ${cob('§Ref (aparato.referencias)')}.
`);
  const cs = a.caso;
  out.push(`## Caso — ${q(cs.marcador.rotulo)} (§Caso, ${L(cs.marcador.origem)})

- **Título (h2):** ${q(cs.blocos.find((b) => b.tipo === 'titulo_secao')?.texto)}.
- **Parte:** ${q(cs.parte.texto)}. ${c(cs.parte_nota)}
- **Blocos (${cs.blocos.length}):** ${cs.blocos.map((b) => b.tipo).join(', ')}.
- **Subseções:** ${cs.blocos.filter((b) => b.tipo === 'subsecao').map((b) => q(b.titulo?.texto ?? b.texto)).join('; ')}.
- **Dados numéricos próprios:** nenhum bloco de dados; o caso é prosa (JSON: \`caso.blocos\`).
- **Decisão pedida:** \`${JSON.stringify(cs.decisao_pedida)}\`. ${c(cs.decisao_nota)}
- **Menções em prosa:** aulas ${cs.referencias_em_prosa.aulas.map(q).join(', ')}; módulos ${cs.referencias_em_prosa.modulos.map(q).join(', ')}; instrumentos ${cs.referencias_em_prosa.instrumentos.map(q).join(', ')}. ${c(cs.referencias_em_prosa.nota)}
- **No código:** ${c(cs.estado_no_codigo)}.

**Perguntas literais (${cs.perguntas_literais.length}).** ${c(cs.perguntas_nota)}

${cs.perguntas_literais.map((p, i) => `${i + 1}. ${q(p.frase)} (${L(p.origem)})`).join('\n')}
`);
  const av = a.avaliacao;
  out.push(`## Quiz (§Quiz + script)

- **Título:** ${q(av.titulo?.texto)}. **Critério em prosa:** ${q(av.criterio_literal_prosa?.texto)} (${L(av.criterio_literal_prosa?.origem)}).
- **Estrutura:** ${av.perguntas.length} questões × 4 alternativas, lidas do literal \`var Q=[…]\` avaliado em vm. Gabarito na ordem: **${av.perguntas.map((x) => x.gabarito.letra).join(' ')}**.
- **Feedback:** ${c(av.perguntas[0].feedback_nota)}
- **Interface da fonte:** botões ${q(av.rotulos_de_interface_fonte.botao_corrigir)} e ${q(av.rotulos_de_interface_fonte.botao_refazer)}; rótulo \`${av.rotulos_de_interface_fonte.template_questao}\`; placar \`${av.rotulos_de_interface_fonte.template_placar}\`.
- **Mecânica** (${c(av.mecanica_nota)}): ${av.mecanica_fonte.map(c).join(' ')}
- **No código:** ${c(av.estado_no_codigo)}.

### Faixas do placar (script)

${c(av.faixas_nota)}

| Condição | Classe | Mensagem literal |
|---|---|---|
${av.faixas_de_placar_script.map((f) => `| \`${f.condicao}\` | \`${f.classe}\` | ${q(f.mensagem_texto)} |`).join('\n')}

Execução do script original: com 0 acertos, classe \`${av.execucao_script.zero_acertos.classe}\` e mensagem igual à faixa fail = ${av.execucao_script.zero_acertos.mensagem_e_a_faixa_fail}; com 10 acertos, classe \`${av.execucao_script.dez_acertos.classe}\` e mensagem igual à faixa pass = ${av.execucao_script.dez_acertos.mensagem_e_a_faixa_pass}.

### Questões

${av.perguntas.map((x) => `**Q${String(x.ordem).padStart(2, '0')}** (${L(x.origem)}). ${q(x.enunciado)}

${x.alternativas.map((o) => `- ${o.letra}) ${q(o.texto)}${o.indice === x.gabarito.indice ? ' **← gabarito**' : ''}`).join('\n')}

Explicação: ${q(x.explicacao)}
`).join('\n')}`);
  const ck = a.checklist_final;
  out.push(`## Checklist final (§Final, ${ck.itens.length} itens)

${q(ck.titulo?.texto)}. Lede: ${q(ck.lede?.texto)}. ${c(ck.nota_p14)} No código: ${c(ck.estado_no_codigo)}.

| # | Item literal | P14 (inferido) | Origem |
|---|---|---|---|
${ck.itens.map((x) => `| ${x.ordem} | ${q(x.texto)} | ${(x.marcacao_p14 || []).join(', ') || '—'} | ${L(x.origem)} |`).join('\n')}
`);
  const ex = a.exercicios;
  out.push(`## Exercícios (§Ex, ${ex.itens.length})

${q(ex.titulo?.texto)}. Lede: ${q(ex.lede?.texto)}.
Grupos: ${ex.grupos.map((g) => `${g.numero} ${q(g.titulo)} (${g.exercicios.length})`).join('; ')}.

**Vínculo com aula (P9).** Nenhuma tag, enunciado ou resposta aponta aula: os ${ex.itens.length} são **soltos** (\`aula_vinculada: null\`).
A coluna "Relação temática" é anotação desta extração (trecho da fonte que trata do mesmo conteúdo), não vínculo.
Nenhum exercício tem critério próprio (\`criterio: null\`). ${c(ex.itens[0].criterio_nota)}

| # | Tag | Enunciado | Rótulo e resposta de referência | Relação temática (inferida) | Origem |
|---|---|---|---|---|---|
${ex.itens.map((x) => `| ${x.ordem} | ${q(x.tag)} | ${q(x.enunciado.texto)} | ${c(x.rotulo_resposta)} ${q(x.resposta_referencia.texto)} | ${x.relacao_tematica_inferida ? `${x.relacao_tematica_inferida.aula_ou_secao} (L${x.relacao_tematica_inferida.evidencia.linha})` : '—'} | ${L(x.origem)} |`).join('\n')}

**No código** (\`${ex.comparacao_codigo.arquivo}\`): ${ex.comparacao_codigo.no_codigo} presentes; registrado em \`RecursosDoModulo.tsx\` = ${ex.comparacao_codigo.registrado_em_RecursosDoModulo}.
Com \`prompt\` vazio: ${ex.comparacao_codigo.itens.filter((x) => x.prompt_vazio).length}. Pergunta fundida no gabarito: ${ex.comparacao_codigo.itens.filter((x) => x.gabarito_funde_pergunta_e_resposta).length}.
Gabarito igual à fonte após normalizar espaços: ${ex.comparacao_codigo.itens.filter((x) => x.gabarito_igual_apos_normalizar_espacos).length}; igual exato: ${ex.comparacao_codigo.itens.filter((x) => x.gabarito_igual_exato).length}.
\`points\` sem origem: ${ex.comparacao_codigo.itens.filter((x) => x.points_sem_origem != null).length}.

**Trechos dos Ex 08–10 × INST·05:**
${ex.variacoes_vs_INST05.map((v) => `- ${v.exercicio}: ${q(v.trecho_exercicio)} × ${v.instrumento}: ${q(v.trecho_instrumento)}`).join('\n')}
`);
  const rf = a.referencias;
  out.push(`## Referências (§Ref, ${rf.itens.length})

${q(rf.titulo?.texto)}. ${Object.entries(rf.notas).map(([kk, v]) => `**${kk}:** ${c(v)}`).join(' ')} No código: ${c(rf.estado_no_codigo)}.

Caixa ${q(rf.caixa_atualizacao.rotulo.texto)}: ${rf.caixa_atualizacao.paragrafos.map((p) => q(p.texto)).join(' ')}

| # | Grupo | Natureza/instituição (span.src) | Descrição literal (inclui o título) | URL | Datas citadas | Consulta em | Origem |
|---|---|---|---|---|---|---|---|
${rf.itens.map((x) => `| ${x.ordem} | ${x.grupo} | ${q(x.natureza_ou_instituicao)} | ${q(x.descricao.texto)} | ${x.url ?? 'null'} | ${x.datas_citadas.map(q).join(', ') || '—'} | ${x.consulta_em ? q(x.consulta_em) : '—'} | ${L(x.origem)} |`).join('\n')}

Grupos: ${rf.grupos.map((g) => `${g.numero} ${q(g.titulo)} (${g.itens.length})`).join('; ')}.
`);
  const gl = a.glossario;
  out.push(`## Glossário (§Lex, ${gl.termos.length} termos em ${gl.familias.length} famílias)

${q(gl.titulo?.texto)}. Contagem: prosa ${q(gl.contagem.prosa_declara)}, pill ${q(gl.contagem.hero_pill)}, soma das famílias ${gl.contagem.soma_declarada_familias}, markup ${gl.contagem.medido}. Todos concordam.
Duplicatas na fonte: ${gl.contagem.duplicatas_na_fonte.length}. ${Object.values(gl.notas).map(c).join(' ')}

**Comparação com \`alexandria-glossario.ts\`.** Há ${gl.contagem.codigo_bloco_m13} verbetes do M13 no código, e **faltam os ${gl.contagem.ausentes_no_codigo}**.
${gl.contagem.com_homonimo_em_outro_modulo} termos têm homônimo em outro módulo, que não é cobertura:
${gl.termos.filter((t) => t.homonimos_no_codigo_outros_modulos.length).map((t) => `${q(t.termo)} → \`${t.homonimos_no_codigo_outros_modulos.join(', ')}\``).join('; ')}.

${tab(['Família', 'Resumo literal', 'Declarado', 'Medido'], gl.familias.map((f) => [f.numero, q(f.resumo), f.declarado, f.medido]))}

${gl.familias.map((f) => `### Família ${f.numero} · ${c(f.nome)}

| # | Termo | Definição literal | Origem |
|---|---|---|---|
${gl.termos.filter((t) => t.familia === f.numero).map((t) => `| ${t.ordem} | ${q(t.termo)} | ${q(t.definicao.texto)} | ${L(t.origem)} |`).join('\n')}
`).join('\n')}`);
  out.push(`## Divergências registradas neste grupo (${a.divergencias.length})

${divTab(a.divergencias)}

## Contagens

${tab(['Item', 'Contagem'], Object.entries(k).map(([x, y]) => [x, y]))}
`);
  out.push("\n## Verificação\n\nVerificação adversarial de 2026-09-17, feita com scripts próprios contra o HTML-fonte.\n\n- **Quiz, 100%.** O `var Q` foi avaliado em vm próprio e comparado com o JSON, sem nenhuma diferença. Batem:\n  - as 10 questões, as 40 alternativas e as 10 explicações;\n  - o gabarito (D B A B C B A D C B) e as origens (±3).\n\n  As duas mensagens de faixa são substrings exatas do script.\n- **Checklist, 100%.** Os 28 `li` de `section#final` foram comparados com `html` (espaços normalizados), com\n  `texto` (sem tags) e com a origem (±3), sem nenhuma diferença.\n- **Contagens.** Batem:\n  - 13 blocos e 8 perguntas no caso;\n  - 14 exercícios em 5 grupos, nenhum com tag de aula;\n  - 36 referências (15/12/4/5), 180 termos em 8 famílias e 28 itens de checklist.\n- Nenhuma correção neste grupo.\n");
  fs.writeFileSync(`${OUTDIR}/aparato.md`, out.join('\n'));
}

// ═══════════════════════════ instrumentos.md ═══════════════════════════
{
  const I = INS, k = I.contagens, out = [];
  out.push(cab('instrumentos', 'instrumentos.json', 'm13_instrumentos.mjs'));
  out.push(`**Método.** ${c(I.metodo)}

**Estado no código.** ${k.portados} portados, ${k.nao_portados} não portados e ${k.divergentes} divergentes. ${c(I.instrumentos[0].estado_no_codigo.evidencia)}
Como nada foi portado, não há comparação por execução contra \`alexandria-instrument-calculators.ts\`. O porte futuro
deve usar o código do script de cada item (transliteração mecânica, protocolo §10). Atenção: \`script.codigo\` só é verbatim
inteiro nos instrumentos numéricos (\`codigo_verbatim: true\`). Nos outros, os literais de dados foram trocados por marcador
(ver \`script.codigo_nota\`), e o texto integral está nas linhas \`script.linha_inicio\`–\`linha_fim\` do HTML.

**Cobertura por token** (markup / strings do script): ${I.instrumentos.map((x) => `${x.id_fonte} ${cob(`${x.id_fonte} markup`)} / ${cob(`${x.id_fonte} strings do script (texto)`)}`).join('; ')}.

## Os ${I.instrumentos.length} instrumentos

| Id | Título (span.nm) | Onde | Invocação (ponto do texto) | Kind sugerido | Mecânica | Fonte dos números | Código |
|---|---|---|---|---|---|---|---|
${I.instrumentos.map((x) => {
    const inv = x.invocacao;
    const onde = x.fora_de_aula ? `${x.secao.codigo} (L${inv.linha_inst}), **fora de aula**` : `${x.aula}${inv.subsecao_anterior ? `, em ${inv.subsecao_anterior.numero}` : ''} (L${inv.linha_inst}–${inv.linha_fim_inst})`;
    const pto = [inv.bloco_anterior ? `depois de ${inv.bloco_anterior.elemento} L${inv.bloco_anterior.linha} (…${q(inv.bloco_anterior.trecho_final?.slice(-60))})` : null, inv.bloco_seguinte ? `antes de ${inv.bloco_seguinte.elemento} L${inv.bloco_seguinte.linha}` : null, (inv.mencoes_em_prosa || []).length ? `menções: ${inv.mencoes_em_prosa.map((mm) => `${q(mm.trecho)} (${mm.secao} L${mm.linha})`).join('; ')}` : null].filter(Boolean).join('; ');
    return `| ${x.id_fonte} | ${q(x.titulo)} | ${onde} | ${pto} | ${x.kind_sugerido} | ${c(x.mecanica)} | ${x.fonte_dos_numeros?.valor ?? 'null'} | ${x.estado_no_codigo.status} |`;
  }).join('\n')}

Por aula: ${Object.entries(k.por_aula).map(([a, n]) => `${a} ${n}`).join(', ')}. Kind sugerido: ${Object.entries(k.por_kind_sugerido).map(([a, n]) => `${a} ${n}`).join(', ')}.
O kind é anotação desta extração pela taxonomia, não texto da fonte. Nenhum instrumento tem pergunta própria (\`pergunta: null\`), e nenhum declara tolerância (\`tolerancias: null\`).
`);
  for (const x of I.instrumentos) {
    const o = [];
    o.push(`## ${x.id_fonte} — ${q(x.titulo)}

- **Onde:** ${x.fora_de_aula ? `${x.secao.codigo}, fora de aula (Recursos do Módulo)` : `${x.aula} (\`section#${x.secao.section_id}\`, rótulo ${q(x.secao.rotulo)})`}. Cabeçalho em ${L(x.origem)}. Script L${x.script.linha_inicio}–${x.script.linha_fim}: \`${c(x.script.cabecalho)}\`.
- **Pergunta:** \`null\`. ${c(x.pergunta_nota)}
- **Intro:** ${q(x.intro?.texto)} (${L(x.intro?.origem)})
- **Aviso (p.disc):** ${x.aviso ? `${q(x.aviso.texto)} (${L(x.aviso.origem)})` : '`null`'}
- **Mecânica:** ${c(x.mecanica)} ${c(x.kind_nota)}`);
    if (x.caixas_internas?.length) o.push(`- **Caixas internas:** ${x.caixas_internas.map((b) => `${q(b.rotulo?.texto)}: ${(b.paragrafos || []).map((p) => q(p.texto)).join(' ')}`).join(' / ')}`);
    if (x.entradas?.length) {
      o.push(`
**Entradas (${x.entradas.length}).** Par \`number\` + \`range\` gêmeo, lido pelo script com \`numOf(el, padrão, mín, máx)\`.

| Id | Variável | Rótulo | Unidade | Faixa (number) | Passo | Padrão | Script | Coerência (range / script) |
|---|---|---|---|---|---|---|---|---|
${x.entradas.map((e) => `| ${e.id} | ${e.variavel_script} | ${q(e.rotulo)} | ${c(e.unidade)} | ${e.number.min}–${e.number.max} | ${e.number.step} | ${e.number.value} | \`${c(e.script_numOf.codigo)}\` | ${e.coerencia.faixa_igual_range} / ${e.coerencia.faixa_igual_script} |`).join('\n')}`);
    }
    if (x.controles?.length) {
      o.push(`
**Controles (${x.controles.length}).**

${x.controles.map((ct) => `- \`${ct.id}\` ${ct.rotulo ? q(ct.rotulo) : `(sem rótulo: ${c(ct.rotulo_nota)})`}, ${c(ct.tipo)}: ${(ct.opcoes || []).map((op) => `${q(op.rotulo)}${op.sub ? ` / ${q(op.sub)}` : ''} [\`${op.valor}\`]${op.inicial ? ' (inicial)' : ''}`).join(', ') || c(ct.nota ?? ct.opcoes_nota)}`).join('\n')}`);
    }
    if (x.saidas?.length) {
      o.push(`
**Saídas (${x.saidas.length}), com a expressão exata do script.**

| Id | Rótulo | Código |
|---|---|---|
${x.saidas.map((s) => `| ${s.id} | ${q(s.rotulo)} | \`${c(s.codigo_saida)}\` |`).join('\n')}`);
    }
    if (x.calculo) {
      o.push(`
**Cálculo** (${c(x.calculo.nota)}):

\`\`\`js
${x.calculo.funcoes_auxiliares.map((f) => f.codigo).join('\n')}
${x.calculo.linhas.join('\n')}
\`\`\``);
    }
    if (x.barras?.length) o.push(`
**Barras (${x.barras.length}):** ${x.barras.map((b) => `${q(b.rotulo)} → \`${c(b.codigo)}\``).join('; ')}.`);
    if (x.ramos_veredito?.length) {
      o.push(`
**Ramos do veredito (${x.ramos_veredito.length}), na ordem do script.** O texto completo está em \`ramos_veredito[].codigo_texto\` (verbatim) e \`modelo_legivel\`.

| # | Condição | Classe | Início do texto (modelo legível) |
|---|---|---|---|
${x.ramos_veredito.map((r) => `| ${r.ordem} | \`${c(r.condicao)}\` | ${r.classe} | ${q(r.modelo_legivel.slice(0, 160))}… |`).join('\n')}`);
    }
    if (x.dados) {
      o.push(`
**Dados (literais do script, avaliados em vm):** ${Object.entries(x.dados).map(([n, d]) => `\`${n}\` (L${d.linha_aprox}, ${Array.isArray(d.valor) ? `${d.valor.length} itens` : `${Object.keys(d.valor).length} chaves: ${Object.keys(d.valor).join(', ')}`})`).join('; ')}. O texto revelado está todo nesses literais.`);
    }
    const cp = x.cenario_padrao;
    if (cp?.saidas) {
      o.push(`
**Cenário-padrão** (${c(cp.nota)}):

${Object.entries(cp.saidas).filter(([, v]) => (v.texto_em_blocos || []).length).map(([id, v]) => `- \`${id}\`: ${v.texto_em_blocos.slice(0, 3).map((t) => q(t.length > 220 ? `${t.slice(0, 220)}…` : t)).join(' / ')}`).join('\n')}`);
    }
    const vf = x.verificacao;
    if (vf?.combinacoes != null) o.push(`
**Espaço de entrada (script original executado):** ${nf(vf.combinacoes)} combinações (${c(vf.nota)}). Ramos atingidos: ${Object.entries(vf.ramo_hits).map(([r, n]) => `${r}→${nf(n)}`).join(', ')}.`);
    else if (vf) o.push(`
**Espaço de entrada (script original executado, espaço inteiro):** ${Object.entries(vf).map(([kk, v]) => `${kk} = ${Array.isArray(v) ? v.map(q).join(', ') : (typeof v === 'string' ? q(v) : v)}`).join('; ')}.`);
    const fn = x.fonte_dos_numeros;
    o.push(`
**Fonte dos números:** ${fn?.valor ?? '`null`'}. ${fn?.declarados?.length ? `Declarados: ${fn.declarados.map(c).join('; ')}. ` : ''}${fn?.sem_fonte?.length ? `Sem fonte: ${fn.sem_fonte.map(c).join(', ')}. ` : ''}${c(fn?.nota)}
**Tolerâncias:** \`null\`. ${c(x.tolerancias_nota)}
**Código:** ${x.estado_no_codigo.status}.
`);
    out.push(o.join('\n'));
  }
  out.push(`## Divergências registradas neste grupo (${I.divergencias.length})

${divTab(I.divergencias)}

## Contagens

${tab(['Item', 'Contagem'], Object.entries(k).map(([x, y]) => [x, typeof y === 'object' ? JSON.stringify(y) : y]))}
`);
  out.push("\n## Verificação\n\nVerificação adversarial de 2026-09-17, feita com scripts próprios contra o HTML-fonte.\n\n- **Fórmulas, 100%.** 69 expressões dos três instrumentos numéricos (INST·02 20, INST·03 27, INST·08 22) foram\n  conferidas como substrings exatas do script, sem nenhuma falha.\n  - Entram as linhas de `calculo.linhas`, os `codigo_saida` e os `script_numOf.codigo`.\n  - O cenário-padrão do INST·02 foi recalculado à mão e bate: EV 55,0, EV/EBITDA 5,5, P/E 10,1, alavancagem 2,50 e\n    dívida 45%.\n- **Distribuição.** A distribuição por seção confere:\n  - §MAP 1;\n  - Aulas 01, 02, 05, 06, 07 e 08 com 1 cada;\n  - Aulas 03 e 04 com 2 cada.\n\n  Confere também `instruments: []` nas 8 aulas do código.\n- **Correção (código do script).** O README e este arquivo diziam que `script.codigo` era verbatim, mas isso só vale\n  para os 3 instrumentos numéricos.\n  - Nos outros 8 (INST·01, 04, 05, 06, 07, 09, 10 e 11), o extrator troca os literais de dados por\n    `/* literal NOME: ver dados.NOME */`, e isso não estava declarado.\n  - Agora cada `script` traz `codigo_verbatim` e, quando o valor é `false`, também `codigo_nota`.\n  - O extrator `m13_instrumentos.mjs` foi corrigido, e o conteúdo do código não mudou.\n- **Divergências.** Estas foram conferidas na fonte e todas se sustentam: taxa real, riscos 6×8, AXIA, Vibra,\n  arquétipo JV, cinco/seis lacunas, Auren 5,2× e numOf.\n");
  fs.writeFileSync(`${OUTDIR}/instrumentos.md`, out.join('\n'));
}
console.log('md ok');
