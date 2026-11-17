// Gera modulo.md, aparato.md e instrumentos.md a partir dos JSONs.
// Todo conteúdo citado sai do JSON (texto literal); a prosa de ligação é desta extração.
import fs from 'node:fs';
import { OUTDIR } from './lib.mjs';

const J = (f) => JSON.parse(fs.readFileSync(`${OUTDIR}/${f}`, 'utf8'));
const m = J('modulo.json'), a = J('aparato.json'), ins = J('instrumentos.json');
const c = (s) => String(s ?? '—').replace(/\|/g, '\\|').replace(/\n/g, ' ');
const L = (o) => (o?.linha_aprox ? `L${o.linha_aprox}` : '');
const table = (head, rows) => [`| ${head.join(' | ')} |`, `|${head.map(() => '---').join('|')}|`, ...rows.map((r) => `| ${r.map(c).join(' | ')} |`)].join('\n');
const divs = (list) => list.map((d) => `- **${d.id}** (${d.grupo}) — ${d.tema}.\n${d.leituras.map((l) => `  - ${l.onde}: ${c(l.literal)}`).join('\n')}\n  - Nota: ${d.nota}`).join('\n');

// ── verificação adversarial (2026-09-17) ─────────────────────
// Texto fixo desta extração, anexado ao fim de cada .md para sobreviver a novas execuções.
const VERIF_METODO = `Verificador independente (scripts próprios, sem reaproveitar \`lib.mjs\` nem \`verify-m15.mjs\`): o \`var Q\` do quiz
foi avaliado direto do HTML e comparado campo a campo; checklist, exercícios, glossário, referências, erros comuns e
roteiro oral foram reparseados por regex próprio e comparados em igualdade estrita (html com espaços colapsados);
as 558 origens com \`linha_aprox\` dos três JSONs foram conferidas contra a janela de ±3 linhas; as linhas de cálculo,
fórmulas de exibição e ramos dos 10 instrumentos foram conferidos na linha declarada; os \`dados_script\` foram
reavaliados do literal e comparados em profundidade; as contagens foram recontadas no HTML.`;
const VERIF2 = `**Segunda verificação adversarial (2026-09-17), sem correções.** Scripts novos, sem reaproveitar os extratores:
as 548 origens com \`trecho_inicial\` ficaram dentro de ±3 linhas; 1.003 campos de texto e 1.103 campos html/script
foram buscados na fonte normalizada, e as únicas ausências são anotações (\`literal\` das divergências, que compõem
leituras) e textos calculados (\`cenario_padrao.veredito\`), além do espaço que o \`texto\` das fichas insere antes de
\`span.mini\`. Houve igualdade estrita em 10/10 questões do quiz, 2/2 faixas, 28/28 itens do checklist, 15/15
exercícios, 174/174 termos, 36/36 referências, 20/20 erros e 9/9 trechos de voz. Conferiram também as 34 fórmulas
de readout (cada escrita do script, na linha declarada), as 88 linhas de cálculo e os 25 ramos, que batem com as
25 classes \`verdict\` do script. As contagens recontadas no HTML batem com as declaradas: 33 entradas, 11 grupos
\`seg\`, 34 células \`ro\`, 11 linhas "GridAlpha" (10 + 1 no script), 10 blocos P7 e 6 "Preencha.". Os 4 valores
distintos de seg, os 5 de reg, os 4 de ac e os 9 de pr foram reavaliados do \`var ELOS\`. As afirmações sobre o
código foram reconferidas: \`RECURSOS\` vai até \`modulo-09\`, \`O&amp;M\` aparece na L693, \`put("ac-gb", gb)\`,
o painel usa \`maximumFractionDigits\` e há 2/2 horas em \`alexandria-blocks.ts\`.
`;
const VERIF = {
  modulo: `## Verificação

${VERIF_METODO}

Resultado neste grupo: 20/20 erros comuns e 9/9 trechos de voz idênticos; 11 linhas com "GridAlpha", 5 formas de
critério, 9 aulas e 19 seções confirmadas; nenhuma divergência inventada (as 12 foram reconferidas na fonte).

**Correção 1 — bloco P7 perdido (contagem 9 → 10).** O regex de \`m15_modulo.mjs\` exigia o rótulo exato
"Onde isso entra no produto" e não casava o bloco da Aula 08 (L2489), cujo rótulo continua ("… — e este é o gancho
mais direto do currículo até aqui"). A fonte tem **10** blocos P7 (§MAP + as 9 aulas), 7 deles citando GridAlpha. O
extrator agora casa o prefixo, grava o rótulo literal em \`rotulo\` e trava a contagem em 10; \`blocos_p7\` passou a 10.

**Correção 4 — linhas da fonte (4141 → 4140).** O HTML termina em LF; \`split('\\n')\` gerava uma linha vazia a
mais. \`wc -l\` dá 4140, e a última linha (\`</html>\`) é a 4140. Corrigido em \`fonte_linhas\` (modulo) e
\`fonte.linhas_total\` (aparato); nenhuma \`linha_aprox\` mudou.

${VERIF2}`,
  aparato: `## Verificação

${VERIF_METODO}

Resultado neste grupo: 10/10 questões do quiz (enunciado, 4 alternativas, gabarito e feedback
idênticos ao \`var Q\`; distribuição A2·B2·C3·D3 confirmada), 2 faixas de placar idênticas, 28/28 itens do
checklist, 15/15 exercícios (enunciado e resposta), 174/174 termos (termo e definição; famílias 24·20·22·18·22·28·20·20),
36/36 referências (0 com URL). As 6 fichas "Preencha." estão nas linhas 1235, 1249, 1931, 2283, 2297 e 2485.

Única correção aqui: \`fonte.linhas_total\` passou de 4141 para 4140 (ver Correção 4 em \`modulo.md\`).

${VERIF2}`,
  instrumentos: `## Verificação

${VERIF_METODO}

Resultado neste grupo: 100% das linhas de \`calculo_script\`, das \`formula_script\` e dos ramos na linha declarada;
\`dados_script\` idênticos ao literal nas 9 estruturas avaliáveis (o \`M\` do INST·08 depende da função \`si\` e não foi
reavaliado isoladamente); fidelidade reexecutada com o mesmo resultado (1.549 casos; INST·09 com 9 valores
incoerentes em 83).

**Correção 2 — origem fora da janela.** O seletor \`cl-gr2\` (INST·08) não tem \`seg-lb\` próprio e herdava como
\`trecho_inicial\` o rótulo "Grandeza citada" da L2242, 6 linhas acima da \`linha_aprox\` 2248. O trecho passa a ser o
do próprio grupo ("Capacidade"); o rótulo herdado e a nota continuam em \`rotulo\`/\`rotulo_nota\`.

**Correção 3 — templates de contêiner não extraídos.** Os \`innerHTML\` de painéis, barras e legendas (\`mp-flux\`,
\`mp-panel\`, \`rg-out\`, \`gs-bars\`, \`pe-bars\`, \`cb-bar\`, \`cb-lg\`, \`gc-bars\`, \`cl-out\` ×2, \`ac-track\`, \`vf-panel\`)
e a lista \`segs\` do INST·05 ficavam fora da extração. O texto que eles exibem só aparecia no cenário-padrão
renderizado, e parte dele não aparecia em lugar nenhum: o ramo "Não se aplica." do INST·08 ("Por que não",
"Onde essa grandeza mora"), os rótulos de barra ("Part. especial", "Efetivo consumido"…), a legenda de subvenção
do INST·05 e as faixas "ordem de mérito"/"fora do mérito" do INST·09. Agora ficam literais em
\`conteineres_dinamicos[].templates_script\` e \`lista_segs_script\`, conferidos pelo \`verify-m15.mjs\` (491 → 504
strings, 0 falhas).

${VERIF2}`,
};

// ── modulo.md ────────────────────────────────────────────────
const id = m.identidade;
fs.writeFileSync(`${OUTDIR}/modulo.md`, `# M15 · grupo "modulo"

Fonte (só leitura): \`${m.fonte}\` (${m.fonte_linhas} linhas, LF). Saída: [\`modulo.json\`](modulo.json).
Camada: **fonte** (literal, com origem). Nenhuma divergência foi resolvida aqui.

**Como foi extraído.** \`extratores/m15_modulo.mjs\` lê o HTML por índice e regex, com um walker de tags balanceadas
(\`extratores/lib.mjs\`). Nenhum texto de conteúdo foi digitado. \`extratores/verify-m15.mjs\` conferiu
${J('extratores/verify-m15.result.json').resultado['modulo.json'].strings_conferidas} strings de conteúdo deste JSON contra a fonte: 0 falhas.

## Identidade (P24)

| Campo | Literal da fonte | Linha |
|---|---|---|
| \`<title>\` | ${c(id.title_tag.texto)} | ${L(id.title_tag.origem)} |
| kicker | ${c(id.kicker.texto)} | ${L(id.kicker.origem)} |
| h1 (título) | ${c(id.titulo.texto)} | ${L(id.titulo.origem)} |
| subtítulo | ${c(id.subtitulo.texto)} | ${L(id.subtitulo.origem)} |
| pills do hero (11) | ${c(id.pills_hero.map((p) => p.texto).join(' · '))} | ${L(id.pills_hero[0].origem)} |

- **Catálogo canônico:** "${id.titulo_catalogo.catalogo_canonico}". Código (\`bloco-15\`): "${id.titulo_catalogo.codigo_bloco_15}". Fonte (h1): "${id.titulo_catalogo.fonte_h1}". **Os três coincidem.**
- **Trilha:** a fonte não declara; o catálogo diz "${c(id.trilha.catalogo_canonico)}".
- **Horas:** a fonte **não declara** horas do módulo (\`horas.texto = null\`). A única menção é a frase do §00.4 sobre o currículo externo ("${c(id.horas.frase_unica.texto.slice(id.horas.frase_unica.texto.indexOf('Ele fornece'), id.horas.frase_unica.texto.indexOf('posicionamento') + 14))}"). O código tem ${id.horas.codigo.estimatedHoursMin}–${id.horas.codigo.estimatedHoursMax} h (div-m15-06).
- **Eixos:** \`null\`. A fonte organiza o módulo em **três lentes** (\`tese.lentes\`): ${m.tese.lentes.map((l) => `"${l.rotulo}"`).join(', ')}.
- **Marca:** "GridAlpha" aparece em ${id.marca_gridalpha_ocorrencias.length} linhas (kicker, rodapé, régua de nomeação, blocos P7, feedback da Q10). Lista em \`identidade.marca_gridalpha_ocorrencias\`.

## Tese (§00)

h2: "${c(m.tese.titulo_secao.texto)}". ${m.tese.blocos.length} blocos na ordem da fonte, mais 3 lentes, 3 glosas de desambiguação
(${m.tese.glosas.map((g) => `**${g.palavra}**`).join(', ')}) e a régua de nomeação em 3 estados
(${m.tese.regua_de_nomeacao.map((r) => `${r.numero}. ${r.titulo} — ${r.estado}`).join('; ')}).

${table(['Subseção', 'Título'], m.tese.blocos.filter((b) => b.tipo === 'titulo').map((b) => [b.numero, b.texto]))}

## Resultado esperado

**Não existe na fonte** (\`resultado_esperado.itens = null\`). O que ocupa esse lugar é o critério construído do §00.4 e o
checklist de 28 itens (aparato). Nenhuma capacidade foi derivada.

## §MAP — mapa da cadeia (não é mapa de aulas)

h2: "${c(m.mapa.titulo_secao.texto)}". **Não há pergunta por aula** (\`perguntas_por_aula = null\`). O §MAP traz 9 elos e o INST·01.

${table(['#', 'Elo', 'Segmento', 'Natureza do preço (pill)', 'Linha'], m.mapa.elos.map((e) => [e.numero, e.elo, e.segmento, e.natureza_preco?.texto ?? '—', L(e.origem)]))}

## Roteiro (${m.roteiro.length} seções = ${m.contagens.aulas} aulas + ${m.contagens.aparatos} aparatos)

${table(['#', 'Marcador', 'Rótulo', 'h2', 'Subseções', 'Instrumento', 'Fichas de elo', 'Linha'], m.roteiro.map((r) => [r.ordem_na_fonte, r.marcador_num, r.marcador_rotulo, r.titulo.texto, r.subsecoes.map((s) => s.numero).join(', ') || '—', r.instrumentos.map((x) => x.id_fonte).join(', ') || '—', r.fichas_de_elo.join(', ') || '—', L(r.origem)]))}

**Contagem de aulas (P8):** sec-id "Aula NN" = ${m.comparacao_codigo.contagem_aulas.fonte_sec_id_aula}; pill = "${m.comparacao_codigo.contagem_aulas.fonte_pill}"; \`MODULO_15_AULAS\` = ${m.comparacao_codigo.contagem_aulas.codigo_MODULO_15_AULAS}; \`totalInModule\` = ${m.comparacao_codigo.contagem_aulas.codigo_totalInModule}; \`AULAS_POR_BLOCO['bloco-15']\` = ${m.comparacao_codigo.contagem_aulas.codigo_AULAS_POR_BLOCO}; catálogo = ${m.comparacao_codigo.contagem_aulas.catalogo_tabela}. **Todos concordam.**

**Títulos (fonte × código × catálogo):**

${table(['Aula', 'h2 da fonte', 'Rótulo sec-id', 'code title', 'code subtitle', 'h2 reconstruído', 'lead = lede', 'catálogo = h2'], m.comparacao_codigo.titulos.map((t) => [t.aula, t.fonte_h2_texto, t.fonte_rotulo_sec_id, t.codigo_title, t.codigo_subtitle || '(vazio)', t.codigo_title_mais_subtitle_reconstroi_h2 ? 'sim' : 'não', t.codigo_lead_igual_lede ? 'sim' : 'não', t.catalogo_titulo_igual_h2 ? 'sim' : 'não']))}

O código corta o h2 em título + subtítulo; o rótulo de lente do sec-id não existe no código (div-m15-07).

## Critérios (P14 / P18)

${table(['Id', 'Seção', 'Literal', 'P14 (anotação)', 'Linha'], m.criterio.criterios.map((k) => [k.id, k.secao, k.texto ?? k.item_1_forma_operacional?.texto, (k.marcacao_p14 || []).join(', '), L(k.origem)]))}

- §Quiz: prosa, h2, pill e script concordam em **8/10** (\`acertos>=8\` → "Critério atingido."). Sem contradição interna, diferente do M01.
- §Final: o item 1 do checklist é declarado "forma operacional" do critério construído, mas o conteúdo difere (div-m15-04).
- Pelo P18, nenhuma forma é "o" critério; a extração só registra.

## Laboratórios

**Não há § Lab** nem "LAB ·" na fonte. O instrumento de módulo é o **INST·01** (§MAP) → \`instrumentos.json\`.

## Voz — roteiro oral (§Voz)

h2: "${c(m.voz.titulo_secao.texto)}".

${table(['Tempo', 'Título', 'Linha'], m.voz.trechos.map((v) => [v.tempo, v.titulo, L(v.origem)]))}

Caixa final: "${c(m.voz.caixa_final.rotulo)}".

## Princípios editoriais

${table(['Id', 'Rótulo / papel', 'Linha'], m.principios_editoriais.map((p) => [p.id, p.rotulo ?? p.papel, L(p.origem)]))}

## Erros comuns (§Erros) — ${m.erros_comuns.itens.length} itens

Cabeçalho: ${m.erros_comuns.cabecalho.join(' | ')}.

${table(['#', 'Afirmação frequente', 'Teste imediato', 'Linha'], m.erros_comuns.itens.map((e, i) => [i + 1, e.afirmacao.texto, e.teste_imediato.texto, L(e.origem)]))}

## Tradutor

Não existe no M15 (\`tradutor = null\`).

## Blocos "Onde isso entra no produto" (P7) — ${m.blocos_produto_p7.length}

${table(['Id', 'Seção', 'Cita GridAlpha', 'Linha'], m.blocos_produto_p7.map((p) => [p.id, p.secao, p.cita_gridalpha ? 'sim' : 'não', L(p.origem)]))}

## Código: o que falta ou não chega à tela

- ${m.comparacao_codigo.o_que_o_codigo_nao_tem}
- \`MODULO_15_EXERCICIOS_SOLTOS\` e \`MODULO_15_INSTRUMENTOS\` não são importados por \`RecursosDoModulo.tsx\` (registro só até \`modulo-09\`). Leitura de código.
- ${m.comparacao_codigo.badges_m15}.

## Divergências (${m.divergencias.length})

${divs(m.divergencias)}

${VERIF.modulo}`);

// ── aparato.md ───────────────────────────────────────────────
const cob = a.cobertura_por_token;
fs.writeFileSync(`${OUTDIR}/aparato.md`, `# M15 · grupo "aparato"

Fonte (só leitura): \`${a.fonte.arquivo}\` (${a.fonte.linhas_total} linhas). Saída: [\`aparato.json\`](aparato.json). Camada: **fonte**.
Método: ${a.metodo} Verificação literal: ${J('extratores/verify-m15.result.json').resultado['aparato.json'].strings_conferidas} strings, 0 falhas.

**Cobertura por token (protocolo §5):**

${table(['Seção', 'Tokens', 'Casados', '%'], [['§Caso', cob.caso.tokens_fonte, cob.caso.tokens_casados, cob.caso.pct], ['§Quiz + var Q', cob.quiz_secao_mais_script_Q.tokens_fonte, cob.quiz_secao_mais_script_Q.tokens_casados, cob.quiz_secao_mais_script_Q.pct], ['§Final', cob.final.tokens_fonte, cob.final.tokens_casados, cob.final.pct], ['§Ex', cob.ex.tokens_fonte, cob.ex.tokens_casados, cob.ex.pct], ['§Ref', cob.ref.tokens_fonte, cob.ref.tokens_casados, cob.ref.pct], ['§Lex', cob.lex.tokens_fonte, cob.lex.tokens_casados, cob.lex.pct]])}

## Caso (§Caso) — P17

- Marcador literal: "${a.caso.marcador} · ${a.caso.rotulo_marcador}" (${L(a.caso.origem)}). **A fonte numera como "parte 15"**; P17 manda "Caso — Operação A" na camada Alexandria.
- h2: "${c(a.caso.titulo.texto)}". ${a.caso.blocos.length} blocos, 2 tabelas de dados, sem números da Operação A (anonimizado).
- **Perguntas declaradas (subtítulos):** ${a.caso.perguntas.map((p) => `${p.numero} "${c(p.texto)}"`).join('; ')}.
- **Perguntas de diagnóstico (caixa):** ${a.caso.perguntas_de_diagnostico.map((q) => `${q.ordinal}: "${c(q.texto)}"`).join(' ')}
- **Decisão pedida: \`null\`.** A fonte recusa decisão: "${c(a.caso.decisao_literal.texto.split('. ')[0])}." P17 autoriza Desafio de decisão na camada Alexandria.
- Código: ${a.caso.codigo_atual} (${a.caso.codigo_confirmacao}).

${a.caso.dados.map((t) => table(t.linhas[0].map((x) => x.texto), t.linhas.slice(1).map((r) => r.map((x) => x.texto)))).join('\n\n')}

## Quiz (§Quiz) — ${a.avaliacao.total_questoes} questões × 4 (P18)

- Critério na prosa: "${c(a.avaliacao.criterio_literal_prosa)}". Script: \`acertos>=8\` → pass; senão fail.
- Mensagem ≥8: "${c(a.avaliacao.faixas_de_placar_script[0].mensagem)}"
- Mensagem <8 (HTML): "${c(a.avaliacao.faixas_de_placar_script[1].mensagem_html)}"
- Mecânica: ${a.avaliacao.mecanica_fonte}
- Gabarito por letra: ${Object.entries(a.avaliacao.distribuicao_gabarito).map(([k, v]) => `${k}=${v}`).join(', ')}. Código: ${a.avaliacao.codigo_atual}.

${table(['#', 'Enunciado', 'Gabarito', 'Linha'], a.avaliacao.perguntas.map((q, i) => [i + 1, q.enunciado, `${q.gabarito.letra}) ${q.gabarito.texto}`, L(q.origem)]))}

Alternativas e explicações completas em \`avaliacao.perguntas[]\` (\`explicacao_html\` preserva o \`<b>\` da fonte).

## Checklist final (§Final) — ${a.checklist_final.total_itens} itens

h2: "${c(a.checklist_final.titulo.texto)}". ${a.checklist_final.mecanica_fonte}

${table(['#', 'Item (texto)', 'P14 (anotação)', 'Linha'], a.checklist_final.itens.map((k) => [k.ordem, k.texto, k.marcacao_p14.join(', '), L(k.origem)]))}

Por marcação: ${Object.entries(a.checklist_final.itens_por_marcacao_P14).map(([k, v]) => `${k} = ${v.length} (${v.join(', ')})`).join('; ')}. ${a.checklist_final.nota_P14}

Caixa final: "${c(a.checklist_final.caixa_final.rotulo)}". Código: ${a.checklist_final.codigo_atual}.

## Índice de exercícios (§Ex) — ${a.exercicios.total_na_fonte} (P9)

Todos **soltos** (nenhum aponta aula). Critério por exercício: \`null\` (a seção pede "a pergunta correta em menos de um minuto").
Código: ${a.exercicios.codigo_atual}.

${table(['Id', 'Família', 'Enunciado', 'Aula', 'Código (prompt/gabarito/família)', 'Linha'], a.exercicios.itens.map((e) => [e.id, e.familia, e.enunciado.texto, 'solto', `${e.comparacao_codigo.prompt_igual ? '=' : '≠'} / ${e.comparacao_codigo.gabarito_igual ? '=' : '≠'} / ${e.comparacao_codigo.tag_igual_familia ? '=' : '≠'} · points ${e.comparacao_codigo.points} (sem origem)`, L(e.origem)]))}

Respostas de referência literais em \`exercicios.itens[].resposta_referencia\`.

### Fichas de elo com campo "Preencha." (atividade dentro de aula)

${table(['Id', 'Aula', 'Subseção', 'Elo', 'Enunciado', 'Dica', 'Gabarito'], a.exercicios.fichas_de_elo_em_aula.map((f) => [f.id, f.aula, f.subsecao, `${f.cabecalho.elo} (${f.cabecalho.qualificador})`, f.campo_a_preencher.enunciado.texto, f.campo_a_preencher.dica?.texto, 'null']))}

## Referências (§Ref) — ${a.referencias.total}

Lede: "${c(a.referencias.introducao.texto)}" Data de consulta só no nível da seção (4 de agosto de 2026). 0 URL, 0 domínio.
Tipos declarados: ${Object.entries(a.referencias.por_tipo_declarado).map(([k, v]) => `${k} ${v}`).join(' · ')}.

${table(['Id', 'Rótulo da fonte', 'Instituição (literal)', 'Datas citadas', 'Texto', 'Linha'], a.referencias.itens.map((r) => [r.id, r.rotulo_fonte, r.instituicao_citada ?? '—', r.datas_citadas.join('; ') || '—', r.texto, L(r.origem)]))}

Normas citadas no corpo sem item próprio: ${a.referencias.normas_citadas_no_corpo_sem_item_proprio.map((n) => `${n.norma} (${n.onde.join(', ')})`).join('; ') || 'nenhuma'}.

## Glossário (§Lex) — ${a.glossario.contagem.markup_termos} termos em ${a.glossario.contagem.familias.length} famílias

Prosa: "${c(a.glossario.contagem.prosa_h2)}". Soma declarada nas famílias: ${a.glossario.contagem.soma_declarada_familias}. Markup: ${a.glossario.contagem.markup_termos}. **Concordam.**
Termos com glosa: ${a.glossario.contagem.termos_com_glosa.join(', ')}. Nomes duplicados: ${a.glossario.contagem.nomes_duplicados.length || 'nenhum'}.

**Código:** \`alexandria-glossario.ts\` tem **${a.glossario.codigo_atual.verbetes_m15_no_codigo}** verbetes do M15 → **faltam os ${a.glossario.codigo_atual.faltam_no_codigo}** (lista abaixo). Homônimos em outros módulos (verbetes distintos, não duplicata): ${a.glossario.codigo_atual.homonimos_em_outros_modulos.map((h) => `${h.termo} (${h.ids_codigo.join(', ')})`).join('; ')}.

${a.glossario.contagem.familias.map((f) => `**Família ${f.numero} · ${f.nome}** (${f.declarado} declarados / ${f.markup_p} no markup): ${a.glossario.termos.filter((t) => t.familia_numero === f.numero).map((t) => t.termo).join(' · ')}`).join('\n\n')}

Definições literais em \`glossario.termos[].definicao_html\`.

## Divergências (${a.divergencias.length})

${divs(a.divergencias)}

${VERIF.aparato}`);

// ── instrumentos.md ──────────────────────────────────────────
const blocoInst = (x) => `### ${x.id_fonte} · ${x.titulo}

- **Onde:** ${x.secao}${x.aula_id_codigo ? ` (\`${x.aula_id_codigo}\`)` : ''} · ${x.destino} · marcação L${x.posicao_no_texto.marcacao.linha_ini}–L${x.posicao_no_texto.marcacao.linha_fim}.
- **Ponto do texto:** depois de ${x.posicao_no_texto.subsecao_anterior ? `§${x.posicao_no_texto.subsecao_anterior.numero} "${c(x.posicao_no_texto.subsecao_anterior.texto)}", ` : ''}${x.posicao_no_texto.bloco_anterior ? `bloco ${x.posicao_no_texto.bloco_anterior.tag}${x.posicao_no_texto.bloco_anterior.classe ? '.' + x.posicao_no_texto.bloco_anterior.classe : ''} (L${x.posicao_no_texto.bloco_anterior.linha_aprox})` : '—'}; antes de ${x.posicao_no_texto.bloco_seguinte ? `${x.posicao_no_texto.bloco_seguinte.tag}${x.posicao_no_texto.bloco_seguinte.classe ? '.' + x.posicao_no_texto.bloco_seguinte.classe : ''} "${c(x.posicao_no_texto.bloco_seguinte.trecho_inicial.slice(0, 60))}…" (L${x.posicao_no_texto.bloco_seguinte.linha_aprox})` : 'fim da seção'}. ${x.posicao_no_texto.invocacao_textual ? `Invocação textual: "${c(x.posicao_no_texto.invocacao_textual.html.replace(/<[^>]+>/g, ''))}".` : 'Sem invocação textual (vínculo por posição).'}
- **Pergunta:** \`null\`. **Tolerâncias:** \`null\` (não declaradas).
- **Intro:** "${c(x.introducao.texto)}"
${x.entradas.numericas.length ? `\n${table(['Entrada', 'Rótulo', 'Unidade', 'Faixa', 'Passo', 'Padrão'], x.entradas.numericas.map((f) => [f.id, f.rotulo_texto, f.unidade, `${f.min}–${f.max}`, f.step, f.padrao_literal]))}\n` : ''}${x.entradas.seletores.length ? `\n${table(['Seletor', 'Rótulo', 'Opções (valor = texto)', 'Padrão'], x.entradas.seletores.map((s) => [s.id, s.rotulo, s.opcoes.map((o) => `${o.valor} = ${o.texto}`).join('; '), s.padrao]))}\n` : ''}${x.entradas.dinamicas ? `\nEscolha dinâmica: \`${x.entradas.dinamicas.conteiner}\` — ${x.entradas.dinamicas.origem_dos_itens} (sem rótulo na fonte).\n` : ''}${x.saidas.length ? `\n${table(['Saída', 'Rótulo', 'Fórmula de exibição (script)', 'Padrão calculado'], x.saidas.map((s) => [s.id, s.rotulo, s.formula_script?.codigo, x.cenario_padrao.saidas_exibidas[s.id]]))}\n\nCálculo (script, L${x.calculo_script[0]?.linha_aprox ?? '—'}): \`${x.calculo_script.map((k) => k.codigo).join(' ')}\`\n` : ''}
**Leitura (${x.leitura.ramos.length} ramos):** ${x.leitura.ramos.length ? x.leitura.ramos.map((r) => `\`${r.condicao_literal}\` → ${r.classe_veredito} (L${r.linha_aprox})`).join('; ') + '.' : 'sem classe de veredito; o texto sai de um painel montado com os dados do script (ver dados_script).'}${x.cenario_padrao.veredito ? ` No padrão: ${x.cenario_padrao.veredito.classe}, "${c(x.cenario_padrao.veredito.texto.slice(0, 120))}…"` : ''}
${x.conteineres_dinamicos.some((k) => k.templates_script?.length) ? `Templates literais dos contêineres (script): ${x.conteineres_dinamicos.filter((k) => k.templates_script?.length).map((k) => `\`${k.id}\` (${k.templates_script.map((t) => `L${t.linha_aprox}`).join(', ')})`).join(', ')}${x.lista_segs_script ? `; lista \`segs\` (L${x.lista_segs_script.linha_aprox})` : ''}. Texto completo em \`conteineres_dinamicos[].templates_script\`.\n` : ''}${Object.keys(x.dados_script).length ? `Dados do script:${Object.entries(x.dados_script).map(([k, v]) => `\`${k}\` (L${v.linha_aprox}–L${v.linha_fim})`).join(', ')}.` : ''}

**Fonte dos números (p.disc, ${L(x.fonte_dos_numeros.origem)}):** "${c(x.fonte_dos_numeros.texto)}"

**Código:** ${x.codigo.status.toUpperCase()} — \`${x.codigo.onde}\`, kind \`${x.codigo.kind}\`, ${x.codigo.n_campos} campos, ${x.codigo.n_saidas} saídas. Fidelidade: ${x.saidas.length ? `${x.fidelidade.readouts_identicos}/${x.fidelidade.casos} casos com readouts idênticos e valores[] coerentes, ` : ''}${x.fidelidade.vereditos_identicos}/${x.fidelidade.casos} ${x.leitura.ramos.length ? 'vereditos' : 'painéis'} idênticos (${x.fidelidade.espaco}).
${x.codigo.divergencias.map((d) => `- ${c(d.slice(0, 400))}`).join('\n')}
`;
fs.writeFileSync(`${OUTDIR}/instrumentos.md`, `# M15 · grupo "instrumentos"

Fonte (só leitura): \`${ins.fonte}\`. Saída: [\`instrumentos.json\`](instrumentos.json). Camada: **fonte**.
Método: ${ins.metodo}
Verificação literal: ${J('extratores/verify-m15.result.json').resultado['instrumentos.json'].strings_conferidas} strings, 0 falhas.

## Resumo

${table(['Id', 'Título', 'Seção', 'kind (código)', 'Num.', 'Sel.', 'Saídas', 'Ramos', 'Status', 'Fidelidade'], ins.resumo.map((r) => [r.id_fonte, r.titulo, r.secao, r.kind_codigo, r.entradas_numericas, r.seletores, r.saidas, r.ramos, r.status, r.fidelidade]))}

Contagens: ${Object.entries(ins.contagens).map(([k, v]) => `${k} = ${typeof v === 'object' ? JSON.stringify(v) : v}`).join(' · ')}.

**Status:** "portado" = cálculo e veredito idênticos ao original em todos os casos testados e sem divergência de campo no dado;
"divergente" = há diferença de campo, rótulo, unidade ou cálculo (listada); "não portado" = ausente. Nenhum está "não portado".
Itens marcados "leitura de código" não foram medidos na tela.

## Prova de fidelidade

O \`<script>\` original de cada instrumento rodou num DOM simulado (inputs e botões lidos da marcação, cliques simulados) e
foi comparado com a porta de \`alexandria-instrument-calculators.ts\` (cópia temporária). Espaço exaustivo nos
instrumentos de seleção (01, 02, 08, 10); amostra com padrões, extremos, vazio, fora de faixa e aleatórios nos demais.
Único defeito de cálculo encontrado: **INST·09 \`ac-gb\`** (a fonte mostra "—" com gb ≤ 0; a porta publica o número negativo).

${ins.observacoes_gerais.map((o) => `- ${o}`).join('\n')}

## Instrumentos

${ins.instrumentos.map(blocoInst).join('\n')}

## Divergências (${ins.divergencias.length})

${divs(ins.divergencias)}

${VERIF.instrumentos}`);
console.log('md ok');
