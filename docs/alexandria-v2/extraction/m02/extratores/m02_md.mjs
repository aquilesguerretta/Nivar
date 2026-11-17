// Gera modulo.md, aparato.md e instrumentos.md a partir dos JSONs (nenhum texto de conteúdo digitado:
// tudo que aparece entre aspas ou em tabela vem do JSON, que vem da fonte). Só a moldura é redigida aqui.
import fs from 'node:fs';
import { OUTDIR, escrever } from './lib.mjs';

const J = (n) => JSON.parse(fs.readFileSync(`${OUTDIR}/${n}`, 'utf8'));
const MOD = J('modulo.json'), APA = J('aparato.json'), INS = J('instrumentos.json'), VER = J('verificacao.json');
const c = (s) => (s == null ? '—' : String(s).replace(/\|/g, '\\|').replace(/\s+/g, ' ').trim());
const L = (o) => (o && o.linha_aprox ? `L${o.linha_aprox}` : '—');
const tabela = (cab, linhas) => [`| ${cab.join(' | ')} |`, `|${cab.map(() => '---').join('|')}|`, ...linhas.map((l) => `| ${l.map(c).join(' | ')} |`)].join('\n');
const origemTxt = (o) => {
  if (o == null) return '—';
  if (Array.isArray(o)) return o.map(origemTxt).join('; ');
  if (o.arquivo && !o.linha_aprox) return o.arquivo;
  if (o.arquivo) return `${o.arquivo.split('/').pop()} L${o.linha_aprox}`;
  return o.linha_aprox ? `L${o.linha_aprox}` : '—';
};
const divTabela = (arr) => tabela(['Id', 'Tipo', 'Sev.', 'Tema', 'Leitura A', 'Leitura B', 'Nota'],
  arr.map((d) => [d.id, d.tipo, d.severidade, d.tema, `${d.leitura_a.texto} (${origemTxt(d.leitura_a.origem)})`, `${d.leitura_b.texto} (${origemTxt(d.leitura_b.origem)})`, d.nota]));
const lacTabela = (arr) => tabela(['Id', 'Campo', 'Valor', 'Nota'], arr.map((l) => [l.id, l.campo, JSON.stringify(l.valor), l.nota]));
const cabecalho = (titulo, json, extra = '') => `# M02 · ${titulo}

Fonte (só leitura): \`${MOD.fonte.arquivo}\` (${MOD.fonte.linhas_total} linhas). Saída: [\`${json}\`](${json}).
Camada: **fonte**. Todo texto entre aspas ou em tabela saiu do JSON, que saiu do HTML por script
(\`extratores/\`); nada foi digitado. \`L\` = linha aproximada no HTML-fonte. Divergências ficam com as duas
leituras e nenhuma é resolvida aqui (P17–P24 valem só na camada de produto).
${extra}`;

// ── Verificação adversarial (2026-09-17) — moldura redigida, não conteúdo ──
const VERIF_COMUM = [
  'Verificador independente (scripts próprios, fora desta pasta), contra o HTML-fonte:',
  '',
  '- **Literalidade.** ~2.000 strings varridas no corpus normalizado; 1.766 conferidas também na janela da própria origem',
  '  (linha_aprox −6/+80). As únicas "falhas" são campos de metadado (ids, classes, seções, faixas derivadas), não conteúdo.',
  '- **Quiz (100%).** O literal `const questions` foi avaliado à parte: 10/10 enunciados, 40/40 alternativas (ordem e',
  '  `correta`), 10/10 explicações e o gabarito BBBCBBBBCB são idênticos; as origens estão a ±3.',
  '- **Checklist (100%).** 18/18 itens idênticos em html e texto, com origens a ±3. Três viram badge (itens 1, 11 e 15),',
  '  conferido em `alexandria-badges.ts`.',
  '- **Instrumentos (100% das fórmulas).** 172 linhas de script (leitura de entradas, cálculo, formatação, condições e',
  '  atribuições dos ramos) conferidas verbatim a ±3 linhas; os 9 `codigo_completo` batem com as linhas declaradas',
  '  (a menos de espaços). O ramo `minNet < 35` do INST · 04 foi re-simulado: nas 3.588 combinações ele só ocorre com',
  '  `rampa > 10` (44 casos), portanto é de fato inalcançável.',
  '- **Origens.** Todo `trecho_inicial` com `linha_aprox` fica a ±3 linhas.',
  '- **Contagens recontadas no HTML.** Todas conferem:',
  '  - 20 seções e 10 aulas, com subseções 5,5,5,4,4,4,3,6,4,6.',
  '  - 9 instrumentos: 24 entradas (22 `.field` + 2 grupos de pílulas), 37 saídas e 689.556 combinações, recalculadas',
  '    a partir das faixas.',
  '  - 65 termos, 10 `div.exercise` (8 com aula) e 18 itens de checklist.',
  '  - 16 referências (13 + 3), 11 delas com `span.mono`.',
  '  - 8 erros, 30 perguntas-relâmpago e 7 parágrafos no roteiro.',
  '  - 18 painéis "três níveis", em 6 blocos.',
  '  - 21 callouts: 4 de "Números vivos" e 7 de produto/marca.',
  '  - 16 ocorrências de "GridAlpha"; 0 LAB; 0 `<img>`, `<video>` ou `<iframe>`.',
  '- **Esclarecimento (sem mudar número).** `ramos_de_leitura_alcancados` (25) conta *chaves de texto mascaradas*',
  '  distintas, e não ramos `if/else` do script. O script tem 27 ramos literais, e 26 são alcançados:',
  '  - o INST · 02 dá 4 chaves para 3 ramos, porque o "> 100" muda o texto;',
  '  - o INST · 06 dá 3 chaves para 6 ramos, porque vocação e veredito andam juntos;',
  '  - o INST · 08 conta "(sem veredito)" como 1.',
].join('\n');
// ── 2ª verificação adversarial (2026-09-17) — moldura redigida, não conteúdo ──
const VERIF2_COMUM = [
  '',
  '### Segunda verificação adversarial (2026-09-17)',
  '',
  'Outro verificador, com método próprio (scripts fora desta pasta, sem reaproveitar `m02_verificar.mjs`):',
  '',
  '- **Literalidade.** Todo valor string dos três JSONs, fora os ramos de metadado, foi procurado no HTML-fonte',
  '  (tags removidas, e também com o markup cru). Resultado: 0 falhas de conteúdo. As únicas "falhas" são ids,',
  '  faixas derivadas do placar, `tom` dos callouts, dados do catálogo e textos *renderizados* pelos scripts. Estes',
  '  últimos foram conferidos de outro jeito, rodando o `<script>` original num DOM mínimo próprio.',
  '- **Quiz (100%).** O array `questions` foi avaliado direto da fonte e comparado campo a campo (10 enunciados,',
  '  40 alternativas, `correta`, 10 explicações, gabarito BBBCBBBBCB, origens a ±3). Tudo idêntico.',
  '- **Checklist (100%).** Os 18 `.checklist-text` foram comparados em html e texto, e as origens estão a ±3. As',
  '  marcações P14 (16 oral/livre, 2 desenho, 2 limite de extensão, 1 cálculo) e os 3 badges (itens 1, 11 e 15',
  '  em `alexandria-badges.ts`) conferem.',
  '- **Fórmulas dos instrumentos (100%).** 185 trechos de script (leitura, cálculo, formatação, condições e',
  '  atribuições de ramo) foram conferidos verbatim a ±3 linhas. Os 9 `codigo_completo` são idênticos às linhas',
  '  declaradas, a menos da quebra final. O cenário-padrão dos 9 foi refeito rodando o script original: os',
  '  valores batem, e o INST · 02 também foi conferido à mão (1.215 A; 39,0 MW; 3,9 %; R$ 47,0 mi).',
  '- **Contagens.** Todas foram recontadas no HTML e batem:',
  '  - seções, aulas e subseções por aula (também em `MODULO_02_CORPO`);',
  '  - instrumentos, entradas, saídas e combinações (recalculadas a partir das faixas do markup);',
  '  - termos (65 `details`, em ordem alfabética), exercícios (10, dos quais 8 com tag de aula) e checklist;',
  '  - referências (16; 11 com `span.mono`; 0 URL, já que os 5 `http` do arquivo são fontes/SVG);',
  '  - callouts (21 = 8 neutros + 9 gold + 4 red), painéis "três níveis" (18, e 0 no código), "GridAlpha" (16, nas',
  '    linhas listadas), "Summit", "Bloco N" e `<img>`.',
  '- **Divergências.** As 32 foram reconferidas, e nenhuma foi inventada.',
].join('\n');
const VERIF2_MODULO = [
  VERIF2_COMUM,
  '',
  '**Correções feitas pela segunda verificação**',
  '',
  '1. **Origem com a base errada.** Ao buscar dentro de um grupo capturado (`header`, `section.hero` e `footer`),',
  '   `m02_modulo.mjs` somava o índice ao início do *match*, e não ao do *grupo*. Isso atrasava 1 linha as origens',
  '   do hero (eyebrow, h1, subtítulo, 4 hero-meta, horas), do cabeçalho e dos 3 parágrafos do rodapé, inclusive',
  '   nas cópias em `criterio`/`voz`/`divergencias`. Todas ficavam dentro de ±3, mas eram erradas. Agora usam a',
  '   base do grupo, por exemplo o h1 em L1324 e o subtítulo em L1325.',
  '2. **Origem do rodapé.** `identidade.rodape.origem` apontava para `<footer>` (L3098) com o `trecho_inicial` da',
  '   `.footer-brand`. Agora aponta para `footer.alex-footer .footer-brand` (L3100).',
  '3. **Composição dos critérios.** `criterio.nota_p18` listava 5 formas com o placar, e o README listava 5 com o',
  '   "§ Ex sem limiar". A nota agora diz que o placar mora em `m02-crit-quiz.mensagens_do_script` e que a 5ª',
  '   entrada (`m02-crit-ex`) só registra a ausência de limiar. Nenhuma contagem mudou.',
].join('\n');
const VERIF2_OUTROS = [
  VERIF2_COMUM,
  '',
  '**Correções feitas pela segunda verificação:** nenhuma neste grupo.',
].join('\n');
const VERIF_MODULO = [
  VERIF_COMUM,
  '',
  '**Correções feitas por esta verificação**',
  '',
  '1. `div-m02-04`, leitura B. A origem apontava para `catalogo-modulos-alexandria.md` L111, que é a Escala do',
  '   **Módulo 01**; o "8 exercícios" do M02 está na L192. O extrator agora busca o trecho completo da Escala do M02.',
  '2. `div-m02-09`, leitura A. A origem apontava para `.alex-brand` ("GridAlpha · Alexandria Library"), e não para o',
  '   elemento citado. Agora aponta para `header.alex-header .header-meta` ("Módulo 02 · Cobaia Zero v2.0", L1246).',
  '',
  'Nenhuma divergência inventada: as 32 (15 + 9 + 8) foram conferidas contra a fonte, o catálogo e o código.',
  VERIF2_MODULO,
].join('\n');
const VERIF_OUTROS = [
  VERIF_COMUM,
  '',
  '**Correções feitas por esta verificação:** nenhuma neste grupo. As duas correções estão em `modulo.json`.',
  VERIF2_OUTROS,
].join('\n');

// ── modulo.md ───────────────────────────────────────────────────────────────
{
  const I = MOD.identidade;
  const out = [cabecalho('grupo "modulo"', 'modulo.json')];
  out.push(`## Contagens

${tabela(['Item', 'Valor'], Object.entries(MOD.contagens).map(([k, v]) => [k, Array.isArray(v) ? v.join(', ') : v]))}

## Identidade

${tabela(['Campo', 'Literal', 'Origem'], [
    ['<title>', I.titulo_documento.texto, L(I.titulo_documento.origem)],
    ['eyebrow', I.eyebrow.texto, L(I.eyebrow.origem)],
    ['h1 (título)', I.titulo.texto, L(I.titulo.origem)],
    ['subtítulo', I.subtitulo.texto, L(I.subtitulo.origem)],
    ...I.meta.map((m) => [`hero-meta · ${m.rotulo}`, m.valor, L(m.origem)]),
    ['cabeçalho', `${I.cabecalho.marca} · ${I.cabecalho.meta_texto}`, L(I.cabecalho.origem)],
    ['rodapé', `${I.rodape.marca} · ${I.rodape.paragrafos.map((p) => p.texto).join(' / ')}`, L(I.rodape.origem)],
  ])}

**Horas.** "${I.horas.texto}" (${L(I.horas.origem)}); \`min\`/\`max\` = null. ${I.horas.nota}

**Eixos.** null. ${I.eixos_nota}

**Catálogo canônico (P24).** Título "${I.catalogo_canonico.titulo}"; trilha "${I.catalogo_canonico.trilha}"; escala
"${I.catalogo_canonico.escala}". O título curto da fonte (\`<title>\` e rodapé) coincide com o catálogo; o h1 é
descritor editorial. Código (\`${I.codigo.bloco.arquivo}\` L${I.codigo.bloco.linha_codigo}): title
"${I.codigo.bloco.title}", level ${I.codigo.bloco.level}, track ${I.codigo.bloco.track}, illustrationPrefix
"${I.codigo.bloco.illustrationPrefix}", priority "${I.codigo.bloco.priority}", horas null/null.

## Tese (§ 00)

- **h2:** "${MOD.tese.titulo_secao.texto}" (${L(MOD.tese.titulo_secao.origem)})
- **lead:** "${MOD.tese.lead.texto}" (${L(MOD.tese.lead.origem)})
${MOD.tese.paragrafos.map((p) => `- **${p.id}:** "${p.texto}" (${L(p.origem)})`).join('\n')}
- **fórmula:** "${MOD.tese.formula.eq.texto}" · "${MOD.tese.formula.desc.texto}" (${L(MOD.tese.formula.origem)})
- **citação:** "${MOD.tese.citacao.texto}" ${MOD.tese.citacao.atribuicao} (${L(MOD.tese.citacao.origem)})

${tabela(['#', ...MOD.tese.consequencias.cabecalho.slice(1), 'Origem'], MOD.tese.consequencias.linhas.map((l) => [l.numero, l.consequencia_fisica.texto, l.instituicao_ou_cobranca.texto, L(l.origem)]))}

## Resultado esperado e critério de passagem

${MOD.resultado_esperado.nota}

**h4:** "${MOD.resultado_esperado.titulo.texto}" (${L(MOD.resultado_esperado.titulo.origem)})

**Critério de passagem** (${L(MOD.resultado_esperado.criterio_de_passagem.origem)}, P14: ${MOD.resultado_esperado.criterio_de_passagem.marcacao_p14.join(', ')}):
"${MOD.resultado_esperado.criterio_de_passagem.texto}"

**Capacidades** — preâmbulo "${MOD.resultado_esperado.preambulo.texto}":

${tabela(['Id', 'Capacidade (literal)', 'P14 (inferido)', 'Origem'], MOD.resultado_esperado.itens.map((x) => [x.id, x.texto, x.marcacao_p14.join(', '), L(x.origem)]))}

## § MAP — perguntas das aulas

h2 "${MOD.mapa.titulo_secao.texto}" · intro: "${MOD.mapa.intro.texto}"

${tabela(['Aula', 'Tema', 'Pergunta', 'Origem'], MOD.mapa.linhas.map((l) => [l.aula, l.tema, l.pergunta.texto, L(l.origem)]))}

## Roteiro (20 seções, ordem da fonte)

${tabela(['#', 'Marcador', 'Rótulo', 'h2', 'Subseções', 'Instrumentos', 'Exercícios com tag', 'Origem'], MOD.roteiro.map((r) => [r.ordem_na_fonte, r.marcador_num, r.marcador_rotulo, r.titulo.texto, r.subsecoes ? r.subsecoes.length : '', r.instrumentos ? r.instrumentos.join(', ') : '', r.exercicios_que_apontam_esta_aula ? r.exercicios_que_apontam_esta_aula.join(', ') : '', L(r.origem)]))}

### Aulas × código (P8)

Contagem: fonte ${MOD.comparacao_codigo.contagem_aulas.fonte} · h2 do § MAP "${MOD.comparacao_codigo.contagem_aulas.map_h2}" ·
MODULO_02_AULAS ${MOD.comparacao_codigo.contagem_aulas.codigo_MODULO_02_AULAS} · AULAS_POR_BLOCO
${MOD.comparacao_codigo.contagem_aulas.codigo_AULAS_POR_BLOCO} · catálogo ${MOD.comparacao_codigo.contagem_aulas.catalogo} ·
totalInModule ${MOD.comparacao_codigo.contagem_aulas.totalInModule_codigo.join(', ')}. **Todos concordam em 10.**

${tabela(['Aula', 'Id código', 'Título =', 'Subtítulo =', 'Subseções (fonte/código, =)', 'Lead =', 'Instr. (fonte → código)', 'Três níveis na fonte'], MOD.comparacao_codigo.aulas.map((a) => [a.aula, a.id_codigo, a.titulo_igual ? 'sim' : 'NÃO', a.subtitulo_igual ? 'sim' : 'NÃO', `${a.subsecoes_fonte}/${a.subsecoes_codigo} ${a.subsecoes_iguais ? 'sim' : 'NÃO'}`, a.lead_igual ? 'sim' : 'NÃO', `${a.instrumentos_fonte.join(', ') || '—'} → ${a.instrumentos_codigo.join(', ') || '—'}`, a.tres_niveis_na_fonte ? 'sim (não portado)' : '—']))}

Catálogo × fonte (tabela de aulas): ${MOD.comparacao_codigo.catalogo_aulas.every((x) => x.tema_igual_rotulo_fonte && x.afirma_igual_titulo_fonte) ? 'as 10 linhas batem com rótulo e h2 da fonte.' : 'há linhas diferentes (ver JSON).'}

## Critérios literais (P14 / P18)

${MOD.criterio.nota_p18}

${tabela(['Id', 'Seção', 'Tipo', 'Texto literal', 'P14', 'Origem'], MOD.criterio.criterios.map((k) => [k.id, k.secao, k.tipo, k.texto, (k.marcacao_p14 || []).join(', '), L(k.origem)]))}

**Mensagens do placar (script):**

${tabela(['Condição', 'Mensagem', 'Origem'], MOD.criterio.criterios[1].mensagens_do_script.map((m) => [m.condicao, m.mensagem, L(m.origem)]))}

## Laboratórios

Nenhum. ${MOD.laboratorios.nota}

## Voz e princípios

**§ Voz** — h2 "${MOD.voz.secao_voz.titulo_secao.texto}"; lead "${MOD.voz.secao_voz.lead.texto}" (${L(MOD.voz.secao_voz.lead.origem)}).

**${MOD.voz.secao_voz.perguntas_relampago.numero} ${MOD.voz.secao_voz.perguntas_relampago.titulo}** (oral, sem consulta):

${MOD.voz.secao_voz.perguntas_relampago.itens.map((q) => `${q.ordem}. ${q.texto} (${L(q.origem)})`).join('\n')}

**${MOD.voz.secao_voz.roteiro_oral.numero} ${MOD.voz.secao_voz.roteiro_oral.titulo}** (oral, cronometrado) — "${MOD.voz.secao_voz.roteiro_oral.instrucao.texto}"
Cartão: "${MOD.voz.secao_voz.roteiro_oral.cartao_titulo}" · "${MOD.voz.secao_voz.roteiro_oral.cartao_subtitulo}"

${MOD.voz.secao_voz.roteiro_oral.paragrafos.map((p) => `> ${p.texto} (${L(p.origem)})`).join('\n>\n')}

**Princípios editoriais:**

${tabela(['Id', 'Rótulo', 'Texto literal', 'Seção', 'Origem'], MOD.voz.principios_editoriais.map((p) => [p.id, p.rotulo, p.texto, p.secao, L(p.origem)]))}

**Callouts "Números vivos"** (${MOD.voz.callouts_numeros_vivos.length}):

${tabela(['Rótulo', 'Seção', 'Texto', 'Origem'], MOD.voz.callouts_numeros_vivos.map((p) => [p.rotulo, p.secao, p.texto, L(p.origem)]))}

**Todos os callouts da fonte** (${MOD.voz.callouts_por_rotulo.length}; ponteiros por rótulo):

${tabela(['Seção', 'Tom', 'Rótulo', 'Linha'], MOD.voz.callouts_por_rotulo.map((p) => [p.secao, p.tom, p.rotulo, p.linha_aprox]))}

## Erros comuns (§ Erros)

h2 "${MOD.erros_comuns.titulo_secao.texto}" · lead "${MOD.erros_comuns.lead.texto}"

${tabela(['#', MOD.erros_comuns.cabecalho_tabela[0], MOD.erros_comuns.cabecalho_tabela[1], 'Origem'], MOD.erros_comuns.itens.map((e) => [e.numero, e.mito.texto, e.correcao.texto, L(e.origem)]))}

Vínculo com aula: null. ${MOD.erros_comuns.vinculos.aula_nota}

## Tradutor / § Map

\`secao_map_tradutor\` = null. ${MOD.tradutor.nota}

${tabela(['Aula', 'Nível', 'Texto literal', 'Origem'], MOD.tradutor.tres_niveis.flatMap((t) => t.niveis.map((n) => [t.aula, n.nivel, n.texto, L(n.origem)])))}

## Divergências (${MOD.divergencias.length})

${divTabela(MOD.divergencias)}

## Lacunas (${MOD.lacunas.length})

${lacTabela(MOD.lacunas)}
`);
  out.push(`\n## Verificação\n\n${VERIF_MODULO}\n`);
  escrever('modulo.md', out.join('\n'));
}

// ── aparato.md ──────────────────────────────────────────────────────────────
{
  const A = APA;
  const C = A.caso;
  const out = [cabecalho('grupo "aparato"', 'aparato.json')];
  out.push(`## Contagens

${tabela(['Item', 'Valor'], [
    ['caso: dados / leituras / callout / pedidos / perguntas / decisões', `${A.contagens.caso.dados} / ${A.contagens.caso.leituras} / ${A.contagens.caso.callouts} / ${A.contagens.caso.pedidos} / ${A.contagens.caso.perguntas} / ${A.contagens.caso.decisoes}`],
    ['quiz: questões × alternativas', `${A.contagens.quiz.questoes} × ${A.contagens.quiz.alternativas_por_questao.join('/')}`],
    ['quiz: faixas do placar', A.contagens.quiz.faixas_placar],
    ['quiz: gabarito', A.contagens.quiz.gabarito_por_letra],
    ['checklist final: itens (como badge no código)', `${A.contagens.checklist_itens} (${A.contagens.checklist_como_badge_no_codigo})`],
    ['exercícios: total / com aula / sem aula (prosa diz)', `${A.contagens.exercicios.total} / ${A.contagens.exercicios.com_aula} / ${A.contagens.exercicios.sem_aula} ("${A.contagens.exercicios.prosa_declara}")`],
    ['referências: itens / grupos / com domínio / com URL', `${A.contagens.referencias.itens_li} / ${A.contagens.referencias.grupos} / ${A.contagens.referencias.com_dominio} / ${A.contagens.referencias.com_url}`],
    ['glossário: termos / faltam no código / sobram / divergentes / quebras de ordem', `${A.contagens.glossario.termos} / ${A.contagens.glossario.faltam_no_codigo} / ${A.contagens.glossario.sobram_no_codigo} / ${A.contagens.glossario.divergentes} / ${A.contagens.glossario.quebras_ordem}`],
    ['divergências / lacunas', `${A.contagens.divergencias} / ${A.contagens.lacunas}`],
  ])}

## Caso — ${C.titulo.texto}

Marcador ${C.marcador} · ${C.rotulo_marcador} (${L(C.origem)}). Etiqueta literal: "${C.etiqueta.texto}" (${L(C.etiqueta.origem)}).
${C.parte.nota}

- **lead:** "${C.lead.texto}"
- **cabeçalho:** "${C.cabecalho.texto}"
- **aviso:** "${C.aviso.texto}"

**Dados**

${tabela(['Rótulo', 'Valor', 'Alerta na fonte', 'Origem'], C.dados.map((d) => [d.rotulo, d.valor, d.marcado_como_alerta_na_fonte ? 'sim' : '', L(d.origem)]))}

**${C.leitura.titulo}**

${tabela(['Dimensão', 'Texto literal', 'Remissões em prosa', 'Origem'], C.leitura.itens.map((l) => [l.dimensao, l.texto, l.referencias_em_prosa.join(', '), L(l.origem)]))}

**Callout "${C.callout.rotulo}"** (${L(C.callout.origem)}): "${C.callout.texto}"

**${C.o_que_pedir.titulo}**

${C.o_que_pedir.itens.map((i) => `- ${i.texto} (${L(i.origem)})`).join('\n')}

**Perguntas:** null. ${C.perguntas_nota}
**Decisão pedida:** null. ${C.decisao_nota}
**Código:** ${C.codigo.nota}

## Quiz — ${A.avaliacao.titulo.texto}

Introdução: "${A.avaliacao.introducao.texto}" (${L(A.avaliacao.introducao.origem)}). Rótulo por questão (template do
script): \`${A.avaliacao.placar.rotulo_por_questao_template}\`. ${A.avaliacao.questoes[0].explicacao_nota}

${A.avaliacao.questoes.map((q) => `### Q${String(q.numero).padStart(2, '0')} — ${q.enunciado}

${q.alternativas.map((a) => `- ${a.letra}) ${a.texto}${a.correta ? ' **← gabarito**' : ''}`).join('\n')}

Explicação: "${q.explicacao}" (${L(q.origem)})`).join('\n\n')}

### Placar ("${A.avaliacao.placar.rotulo}", total "${A.avaliacao.placar.total_literal}")

${tabela(['Condição literal', 'Faixa (derivada)', 'Mensagem', 'Origem'], A.avaliacao.placar.faixas.map((f) => [f.condicao_literal, f.faixa, f.mensagem, L(f.origem)]))}

${A.avaliacao.placar.nota_p18}

## Checklist final — ${A.checklist_final.titulo.texto}

"${A.checklist_final.introducao.texto}" (${L(A.checklist_final.introducao.origem)}). Mecânica: ${A.checklist_final.mecanica}.

${tabela(['#', 'Item literal', 'P14 (inferido)', 'Badge no código', 'Origem'], A.checklist_final.itens.map((i) => [i.ordem, i.texto, i.marcacao_p14.join(', '), i.no_codigo_como_badge ? 'sim' : '', L(i.origem)]))}

## Índice de exercícios — ${A.exercicios.titulo.texto}

"${A.exercicios.introducao.texto}". Critério por exercício: null em todos (${A.exercicios.itens[0].criterio_nota}).

${tabela(['Tag', 'Aula vinculada', 'Enunciado', 'Resposta de referência', 'Limite literal', 'Código (id · enunciado= · gabarito)', 'Origem'], A.exercicios.itens.map((e) => [e.tag, e.aula_vinculada ?? '**sem aula (P9)**', e.enunciado.texto, e.resposta_de_referencia.paragrafos.map((p) => p.texto).join(' ¶ '), e.limite_de_resposta_literal, e.codigo.id ? `${e.codigo.id} · ${e.codigo.enunciado_igual ? 'sim' : 'NÃO'} · ${e.codigo.gabarito_codigo_cobre}` : 'não portado', L(e.origem)]))}

## Referências — ${A.referencias.titulo.texto}

"${A.referencias.introducao.texto}"

${A.referencias.grupos.map((g) => `### ${g.titulo}

${tabela(['Id', 'Título(s) em negrito', 'Obra', 'Instituição', 'Domínio/caminho (como está)', 'Datas no texto', 'Texto literal', 'Origem'], g.itens.map((r) => [r.id, r.titulos_em_negrito.join(' + '), r.titulo_obra, (r.instituicao || []).join(', '), r.dominio_ou_caminho_citado, r.datas_citadas.join(', '), r.texto, L(r.origem)]))}`).join('\n\n')}

URL: null em todos (${A.referencias.grupos[0].itens[0].url_nota}) ${A.referencias.grupos[0].itens[0].datas_nota}

Colofão (rodapé): "${A.referencias.colofao.texto}". Código: ${A.referencias.codigo.nota}

## Glossário — ${A.glossario.titulo.texto}

"${A.glossario.introducao.texto}" Contagem: markup ${A.glossario.contagem.markup} · prosa "${A.glossario.contagem.prosa_literal}" ·
catálogo ${A.glossario.contagem.catalogo} · código (gl-m02-*) ${A.glossario.contagem.codigo_gl_m02}.
**Faltam no código: ${A.glossario.comparacao_codigo.faltam_no_codigo.length ? A.glossario.comparacao_codigo.faltam_no_codigo.join(', ') : 'nenhum'}.**
Sobram no código: ${A.glossario.comparacao_codigo.sobram_no_codigo.length || 'nenhum'}. Divergentes (termo, etiqueta ou
definição): ${A.glossario.comparacao_codigo.divergentes.length || 'nenhum'}. aulaIds vazios no código:
${A.glossario.comparacao_codigo.aulaIds_vazios} (derivados pelo código, não declarados pela fonte).

${tabela(['#', 'Termo', 'Etiqueta', 'Definição literal', 'Código', 'Origem'], A.glossario.termos.map((t) => [t.ordem, t.termo, t.etiqueta, t.definicao.texto, t.codigo ? `${t.codigo.id}${t.codigo.definicao_igual ? '' : ' (DIVERGE)'}` : 'FALTA', L(t.origem)]))}

## Divergências (${A.divergencias.length})

${divTabela(A.divergencias)}

## Lacunas (${A.lacunas.length})

${lacTabela(A.lacunas)}
`);
  out.push(`\n## Verificação\n\n${VERIF_OUTROS}\n`);
  escrever('aparato.md', out.join('\n'));
}

// ── instrumentos.md ─────────────────────────────────────────────────────────
{
  const out = [cabecalho('instrumentos', 'instrumentos.json', `
Método: ${INS.metodo} O cenário-padrão e os ramos alcançados vêm da **execução do script original sem reescrita**
em DOM simulado; a comparação com o código varre o espaço de entrada inteiro do markup
(${INS.contagens.combinacoes_varridas.toLocaleString('pt-BR')} combinações).
`)];
  out.push(`## Resumo

${tabela(['Id fonte', 'Título literal', 'Aula · subseção', 'Kind (código)', 'Prefixo ids', 'Entradas', 'Saídas', 'Combinações', 'Ramos alcançados', 'Status no código'],
    INS.instrumentos.map((s) => [s.id_fonte, s.titulo, `${s.aula} · ${s.invocacao.subsecao.numero} ${s.invocacao.subsecao.titulo}`, s.kind_taxonomia, `${s.prefixo_ids_internos}${s.prefixo_bate_com_numero ? '' : ' (≠)'}`, s.entradas.length, s.saidas.length, s.espaco_de_entrada.combinacoes, s.espaco_de_entrada.ramos_alcancados.length, s.codigo.status]))}

Instrumentos de módulo: nenhum. ${INS.instrumentos_de_modulo.nota}

Menções textuais fora do cabeçalho:
${INS.mencoes_textuais.map((m) => `- ${m.id_citado} em ${m.onde} (L${m.linha_aprox}): "…${m.trecho}…"`).join('\n')}

Pergunta própria: null nos 9. Fonte dos números: null nos 9. Tolerâncias: null nos 9 (nenhuma declarada).
`);
  for (const s of INS.instrumentos) {
    const pad = s.cenario_padrao;
    out.push(`## ${s.id_fonte} · ${s.titulo}

- **Id:** \`${s.id}\` · comentário HTML "${s.comentario_html}" · bloco de script "${s.comentario_script}" (L${s.script.linhas[0]}–${s.script.linhas[1]}) · origem ${L(s.origem)}
- **Onde é invocado:** ${s.aula}, subseção ${s.invocacao.subsecao.numero} "${s.invocacao.subsecao.titulo}" (L${s.invocacao.subsecao.linha_aprox})
${s.invocacao.paragrafos_antes.map((p) => `  - antes: "${p.texto}" (${L(p.origem)})`).join('\n')}
${s.invocacao.paragrafo_imediatamente_depois ? `  - logo depois: "${s.invocacao.paragrafo_imediatamente_depois.texto}" (${L(s.invocacao.paragrafo_imediatamente_depois.origem)})` : '  - logo depois: —'}
- **Pergunta:** null. Candidatas literais: § MAP "${s.pergunta_candidatas.map_da_aula}"; subseção "${s.pergunta_candidatas.titulo_da_subsecao}".
- **Nota do instrumento:** ${s.nota_do_instrumento ? `"${s.nota_do_instrumento.texto}" (${L(s.nota_do_instrumento.origem)})` : 'null'}
- **Fonte dos números:** null. **Tolerâncias:** null.

**Entradas**

${tabela(['Id', 'Rótulo', 'Unidade', 'Tipo', 'Padrão', 'Faixa (min–max / passo)', 'Opções', 'Origem'], s.entradas.map((e) => [e.id, e.rotulo, e.unidade, e.tipo, e.padrao, e.min != null ? `${e.min}–${e.max} / ${e.passo}${e.faixas_campo_e_deslizador_iguais === false ? ' (deslizador ≠)' : ''}` : '', e.opcoes ? e.opcoes.map((o) => `${o.valor}=${o.rotulo}${o.selecionada ? '*' : ''}`).join('; ') : '', L(e.origem)]))}

**Saídas**

${tabela(['Id', 'Rótulo', 'Tipo', 'Cenário-padrão renderizado'], s.saidas.map((o) => [o.id, o.rotulo, o.tipo, pad.saidas_renderizadas[o.id]?.texto]))}
${s.visuais.length ? `\nVisuais gerados: ${s.visuais.map((v) => `${v.tipo} #${v.id}`).join(', ')} (não portáveis, §12).\n` : ''}
Cenário-padrão (entradas): \`${JSON.stringify(pad.entradas)}\`

**Leitura das entradas (verbatim)**

\`\`\`js
${s.script.leitura_entradas_verbatim.map((l) => `${l.codigo}  // L${l.linha_aprox}`).join('\n') || '// (seleção por pílula: dataset)'}
\`\`\`

**Cálculo (verbatim)**

\`\`\`js
${s.script.calculo_verbatim.map((l) => `${l.codigo}  // L${l.linha_aprox}`).join('\n') || '// sem cálculo numérico: consulta a tabela do script'}
\`\`\`

**Formatação das saídas (verbatim)**

\`\`\`js
${s.script.formatacao_saida_verbatim.map((l) => `${l.codigo}  // L${l.linha_aprox}`).join('\n') || '// ver dados_por_opcao'}
\`\`\`
${s.script.ramos_de_leitura_verbatim.length ? `
**Ramos de leitura (verbatim; ${s.script.ramos_de_leitura_verbatim.length} grupo(s))**

${s.script.ramos_de_leitura_verbatim.map((g, gi) => tabela(['Grupo', 'Tipo', 'Condição', 'Atribuições (verbatim)', 'Linha'], g.map((r) => [gi + 1, r.tipo, r.condicao, r.atribuicoes.join(' '), r.linha_aprox]))).join('\n\n')}
` : ''}
**Ramos alcançados na varredura** (${s.espaco_de_entrada.ramos_alcancados.length}; NaN/Infinity: ${s.espaco_de_entrada.saidas_com_NaN_ou_Infinity})${s.espaco_de_entrada.ramos_nao_alcancados.length ? ` · **não alcançados:** ${s.espaco_de_entrada.ramos_nao_alcancados.map((r) => `${r.tipo} (${r.condicao}) L${r.linha_aprox}`).join('; ')}` : ''}

${tabela(['Combinações', 'Exemplo de entrada', 'Texto renderizado (exemplo)'], s.espaco_de_entrada.ramos_alcancados.map((r) => [r.combinacoes, JSON.stringify(r.exemplo_entrada), r.exemplo_texto_renderizado]))}
${s.dados_por_opcao ? `
**Dados por opção (tabela do script, renderizada)**

${tabela(['Opção', ...s.saidas.map((o) => o.rotulo ?? o.id), ...(s.dados_por_opcao[0].trechos ? ['Trechos (tensão · trecho · perda)'] : [])], s.dados_por_opcao.map((d) => [`${d.opcao} (${d.rotulo})`, ...s.saidas.map((o) => d.saidas[o.id].texto), ...(d.trechos ? [d.trechos.map((t) => `${t.tensao} · ${t.trecho} · ${t.perda_exibida}`).join(' → ')] : [])]))}
` : ''}
**Código atual — ${s.codigo.status}** ${s.codigo.status_nota ?? ''}

${tabela(['Parte', 'Status'], Object.entries(s.codigo.status_por_parte))}

Cálculo: ${s.codigo.calculo_numerico.combinacoes_comparadas} combinações comparadas, ${s.codigo.calculo_numerico.divergentes} divergentes. Problemas: ${s.codigo.problemas.join('; ') || 'nenhum'}.
${s.codigo.textos_de_leitura.length ? `
Vereditos lado a lado (um exemplo por forma de texto):

${tabela(['Fonte (renderizado)', 'Código', 'Igual'], s.codigo.textos_de_leitura.map((x) => [x.fonte_exemplo, x.codigo_exemplo, x.igual ? 'sim' : 'não']))}
` : ''}`);
  }
  out.push(`## Divergências (${INS.divergencias.length})

${divTabela(INS.divergencias)}

## Lacunas (${INS.lacunas.length})

${lacTabela(INS.lacunas)}
`);
  out.push(`\n## Verificação\n\n${VERIF_OUTROS}\n`);
  escrever('instrumentos.md', out.join('\n'));
}
console.log('md ok');
