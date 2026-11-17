// Gera modulo.md, aparato.md e instrumentos.md a partir dos três JSON.
// Todo texto de conteúdo citado aqui sai dos JSON (que saem da fonte);
// a prosa de enquadramento é anotação desta extração.
import fs from 'node:fs';
import { OUTDIR } from './m08_lib.mjs';

const J = (f) => JSON.parse(fs.readFileSync(`${OUTDIR}/${f}`, 'utf8'));
const M = J('modulo.json'); const A = J('aparato.json'); const I = J('instrumentos.json');
const V = J('extratores/verificacao.json'); const VE = J('extratores/verificacao_estrita.json');
const cel = (s) => String(s ?? '—').replace(/\|/g, '\\|').replace(/\n+/g, ' ').replace(/</g, '&lt;');
const n =(x) => x.toLocaleString('pt-BR');
const FONTE = '`C:/dev/GridAlpha v2/Alexandria modulos/alexandria_modulo08.html`';
const verif = (f) => { const a = V.arquivos[f]; const e = VE.resumo[f]; return `${n(a.strings_conferidas)} strings de conteúdo e ${n(a.origens_conferidas)} origens, ${a.falhas + a.origens_falhas} falhas; passada estrita: ${n(e.conferidas)} folhas, ${e.nao_achadas} não achadas literalmente (todas inspecionadas, ver abaixo)`; };
const P14 = { reconstrucao_de_memoria: 'reconstrução de memória', producao_oral_ou_livre: 'produção oral/livre', sem_consulta: 'sem consulta', cronometrado: 'cronometrado' };
const p14 = (arr) => (arr && arr.length ? arr.map((x) => P14[x] ?? x).join(', ') : '—');

// ═══════════════════════════ modulo.md ═══════════════════════════
{
  const id = M.identidade; const cc = M.comparacao_codigo; const cat = cc.catalogo_canonico;
  const aulas = M.roteiro.filter((r) => r.tipo === 'aula');
  const L = [];
  L.push('# M08 · grupo "modulo"', '');
  L.push(`Fonte (só leitura): ${FONTE} (3.132 linhas, LF, 326.382 bytes; \`<script>\` em L2042–3130).`);
  L.push('Saída: [`modulo.json`](modulo.json). Extrator: [`extratores/m08_modulo.mjs`](extratores/m08_modulo.mjs).', '');
  L.push('**Como foi extraído.** Um walker por profundidade de tag percorre os filhos diretos de `.wrap` em cada `<section id>`; nenhum texto de conteúdo foi digitado. Onde há HTML inline, o item traz `html` (literal, espaços colapsados) e `texto` (sem tags). Todo item traz `origem {seletor, trecho_inicial, linha_aprox}`. O critério do quiz sai do `<script>` original executado em DOM simulado.', '');
  L.push('**Vocabulário medido.** `sec-id`, `lede`, `inst`, `box rd|gd|cy`, `lv`, `form`, `src-card`, `map-card`, `ck`: o vocabulário dos M04–M17. Zero `aula-marker`.', '');

  L.push('## Estrutura do JSON', '', '| Chave | O que contém |', '|---|---|');
  L.push(`| \`identidade\` | \`<title>\`, eyebrow, h1, subtítulo, ${id.contagens_declaradas.length} pílulas do hero, horas (string), ${id.eixos.length} eixos (tabela de T.3), rodapé, ocorrências de "GridAlpha" (P24) |`);
  L.push(`| \`tese\` | § 00: ${M.tese.blocos.length} blocos (T.1–T.3, 2 tabelas, 4 destaques) |`);
  L.push('| `resultado_esperado` | `secao_resultado_esperado: null` (a fonte não tem); o destaque "Critério de domínio deste módulo" e a lista 7.5 "O que sobra quando os números vencerem" ficam aqui sem conversão |');
  L.push(`| \`mapa\` | § MAP: ${M.mapa.blocos.length} blocos (inclui o INST · 01) e ${M.mapa.cartoes.length} cartões (7 aulas e o § Caso). \`perguntas: null\` |`);
  L.push(`| \`roteiro\` | ${M.roteiro.length} seções na ordem da fonte (${aulas.length} aulas e ${M.roteiro.length - aulas.length} aparatos), com subseções, instrumentos e comparação com o código |`);
  L.push(`| \`criterio\` | ${M.criterio.length} formas literais de critério, com \`marcacao_p14\` |`);
  L.push('| `laboratorios` | `secao_lab: null`; aponta o instrumento de módulo (INST · 01) |');
  L.push(`| \`voz_principios\` | a regra do módulo, ${M.voz_principios.destaques_numeros_vivos.length} destaques "Números vivos"/data de corte, ${M.voz_principios.destaques_de_metodo.length} destaques de método, rodapé de escopo |`);
  L.push(`| \`erros_comuns\` | § Erros: ${M.erros_comuns.itens.length} linhas erro × correção |`);
  L.push('| `tradutor` | `null` (não há Tradutor nem segundo § Map) |');
  L.push(`| \`blocos_de_produto_P7\` | ${M.blocos_de_produto_P7.length} caixas "Onde isso entra no produto" (tese, 7 aulas, caso) |`);
  L.push('| `comparacao_codigo` | aulas (P8), títulos, cobertura por token do corpo portado, fatos canônicos, catálogo do repo e catálogo canônico |');
  L.push(`| \`divergencias\` | ${M.divergencias.length} itens; nenhum resolvido |`, '');

  L.push('## Identidade e catálogo (P24)', '');
  L.push(`- **Título (h1, \`<title>\`, rodapé):** "${id.titulo.texto}".`);
  L.push(`- **Catálogo canônico:** \`${cat.cabecalho.texto}\` (L${cat.cabecalho.linha}) — igual à fonte. A tabela-resumo abrevia para "Matriz Elétrica Brasileira" (L${cat.tabela_resumo.linha}).`);
  L.push(`- **Catálogo do repositório** (\`alexandria-blocks.ts\`): \`title: 'Matriz Elétrica'\`, \`priority: 'confirmar'\`. Divergência registrada (mod-div-01); pelo P24, o canônico governa o nome.`);
  L.push(`- **Subtítulo** (\`p.sub\`): "${id.subtitulo.texto}"`);
  L.push(`- **Eyebrow:** "${id.eyebrow.texto}". A trilha é **declarada** ("${id.trilha_declarada.texto}"); o código usa \`level: 2\`, \`track: 'brasil'\`.`);
  L.push(`- **Horas:** só a pílula "${id.horas.texto}" (L${id.horas.origem.linha_aprox}); \`min\`/\`max\` ficam \`null\`. O catálogo do repo tem \`estimatedHoursMin/Max: null\` (mod-div-03).`);
  L.push(`- **Pílulas do hero (${id.contagens_declaradas.length}):** ${id.contagens_declaradas.map((p) => `${p.valor} ${p.rotulo}`).join(' · ')}.`);
  L.push(`- **Marca:** "GridAlpha" aparece ${id.marca_na_fonte.ocorrencias_gridalpha.length} vezes (L${id.marca_na_fonte.ocorrencias_gridalpha.map((o) => o.linha).join(', L')}), uma delas no rodapé ("Trilha 2 do currículo GridAlpha"). Texto literal mantido (camada fonte).`, '');

  L.push('### Os três eixos (declarados na tabela de T.3)', '', '| Eixo | As duas pontas | O que muda entre elas |', '|---|---|---|');
  for (const e of id.eixos) L.push(`| ${cel(e.eixo)} | ${cel(e.pontas.texto)} | ${cel(e.o_que_muda.texto)} |`);
  L.push('');

  L.push('## Resultado esperado e capacidades', '');
  L.push('A fonte **não tem** "Resultado esperado" nem lista de capacidades (`secao_resultado_esperado: null`). O que existe, sem conversão:', '');
  L.push(`1. **§ 00, destaque "${M.resultado_esperado.criterio_de_dominio_do_modulo.rotulo}"** (L${M.resultado_esperado.criterio_de_dominio_do_modulo.origem.linha_aprox}): "${M.resultado_esperado.criterio_de_dominio_do_modulo.paragrafos[0].texto}"`);
  L.push(`2. **Aula 07, ${M.resultado_esperado.sintese_duravel_aula07.titulo_subsecao}** — ${M.resultado_esperado.sintese_duravel_aula07.itens.length} itens em \`ul.ck\`:`);
  for (const it of M.resultado_esperado.sintese_duravel_aula07.itens) L.push(`   - ${it.texto}`);
  L.push('3. **§ Final** — 26 verificações (em `aparato.json › checklist_final`).', '');

  L.push('## § MAP', '');
  L.push(`h2: "${M.roteiro[1].titulo.texto}". Lead: "${M.roteiro[1].lead.texto}"`, '');
  L.push('`perguntas: null`: o § MAP não tem tabela aula × pergunta; os cartões trazem número, tema e descrição.', '');
  L.push('| Cartão | Tema | Descrição (literal) |', '|---|---|---|');
  for (const c of M.mapa.cartoes) L.push(`| ${cel(c.rotulo)} | ${cel(c.tema)} | ${cel(c.descricao.texto)} |`);
  L.push('', 'O § MAP carrega o **INST · 01** (instrumento de módulo; ver `instrumentos.md`).', '');

  L.push('## Roteiro e contagem de aulas (P8)', '');
  const ca = cc.aulas;
  L.push(`Todos os sinais dão **${ca.fonte} aulas**: sec-id "Aula NN" (${ca.fonte}), pílula do hero (${ca.pill_hero}), cartões de aula no § MAP (${ca.cartoes_map}), \`MODULO_08_AULAS\` (${ca.codigo_MODULO_08_AULAS}, \`totalInModule\` ${ca.totalInModule.join('/')}), \`AULAS_POR_BLOCO['bloco-08']\` (${ca.AULAS_POR_BLOCO}) e o catálogo canônico ("7 aulas").`, '');
  L.push('| # | Seção | Marcador | Rótulo (sec-id) | Título (h2) | Subseções | Instrumentos |', '|---|---|---|---|---|---|---|');
  for (const r of M.roteiro) {
    const subs = r.subsecoes.map((s) => s.split(' ')[0]);
    L.push(`| ${r.ordem_na_fonte} | \`${r.section_id}\` | ${cel(r.marcador)} | ${cel(r.rotulo)} | ${cel(r.titulo.texto)} | ${subs.length ? `${subs[0]}–${subs[subs.length - 1]} (${subs.length})` : '—'} | ${r.instrumentos.length ? r.instrumentos.map((x) => x.replace('m08-inst-', '')).join(', ') : '—'} |`);
  }
  L.push('', 'A Aula 02 não tem `h3` numerado: ela se organiza pelas 6 fichas `src-card` (o hero declara "6 fichas de fonte"; a Aula 06 tem mais 2 `src-card`, 8 no total).', '');

  L.push('### Aulas: fonte × código', '');
  L.push('| Aula | `title` = h2 | `subtitle` = rótulo | lead = lede | Instrumentos no código | Blocos no código | Cobertura por token do corpo | Elementos perdidos |', '|---|---|---|---|---|---|---|---|');
  const cob = Object.fromEntries(cc.cobertura_corpo_por_token.map((c) => [c.aula, c]));
  for (const r of aulas) {
    const c = r.comparacao_codigo; const k = cob[r.marcador];
    const perd = k.elementos_perdidos.filter((e) => e.elemento !== 'div.src-card');
    L.push(`| ${r.marcador.slice(5)} | ${c.title_igual_h2 ? 'sim' : 'não'} | ${c.subtitle_igual_rotulo ? 'sim' : 'não'} | ${c.lead_igual_fonte ? 'sim' : (c.lead_igual_salvo_espacos ? 'só espaço antes do ponto' : 'não')} | ${c.instrumentos_codigo.join(', ') || '—'} | ${k.blocos_no_codigo} | ${String(k.cobertura).replace('.', ',')}% | ${perd.length ? perd.map((e) => `\`${e.elemento}\` L${e.linha_aprox}`).join('; ') : 'nenhum'} |`);
  }
  L.push('', `${cc.cobertura_corpo_nota}`, '');
  L.push('- **Aula 01 perdeu o único `div.form` do módulo** (L584–587: "Fator de capacidade = geração do período ÷ (capacidade nominal × horas do período)" e a nota sobre o denominador). O token-bag deu 95,4% porque as palavras da fórmula existem em outros blocos; o início do bloco não existe no código.');
  L.push('- As 6 fichas `src-card` da Aula 02 estão no código com 100% dos tokens, mas como `titulo` + `tabela` (protocolo §15: o primeiro par chave-valor virou cabeçalho).');
  const hl = M.divergencias.find((d) => d.id === 'mod-div-cod-hl');
  L.push(`- **\`</b>\` órfão:** ${hl.medicao.fechamentos_orfaos_no_codigo} parágrafos do código têm \`</b>\` sem abertura, exatamente onde a fonte tem \`<span class="hl">\` (${hl.medicao.spans_hl_nas_aulas_da_fonte} nas aulas). Mesmo defeito do M01 (COD-03).`);
  L.push('- `durationMinutes`, `difficulty` e `video` são `null` no código; a fonte não tem `<video>`, `<iframe>` nem `<img>` (medido).');
  L.push('- **Comentário de cabeçalho desatualizado** em `alexandria-modulo-08-content.ts` ("SÓ O INST · 04 PORTADO"): o código real tem os 11 instrumentos (mod-div-11).', '');
  L.push('### Fatos canônicos do código (`alexandria-modulo-08-fatos.ts`)', '');
  const fx = cc.fatos_codigo;
  L.push(`Os ${fx.M08_FATOS.length} textos de \`M08_FATOS\` existem literalmente na fonte (${fx.M08_FATOS.map((f) => `"${f.texto}"`).join(', ')}), e os 4 universos de \`M08_UNIVERSOS_CAPACIDADE\` (${fx.M08_UNIVERSOS_CAPACIDADE.map((u) => u.rotulo).join(', ')}) têm rótulo, data-base, universo e publicação literais na tabela do § 00. \`M08_CAPACIDADE_POR_FONTE\` é o vetor \`I2.src\` do INST · 02.`, '');
  L.push('### Existe só na fonte', '');
  for (const x of cc.nao_existe_no_codigo) L.push(`- ${x}`);
  L.push('- § Caso, § Quiz, § Final, § Voz e § Ref (medido em `aparato.json › apa-div-08`)', '');

  L.push('## Critérios literais (P14)', '');
  L.push('Marcação: *reconstrução de memória*, *produção oral/livre*, *sem consulta*, *cronometrado*. Nenhum critério é resolvido aqui (P18).', '');
  L.push('| Id | Onde | Marcação P14 | Texto literal (início) |', '|---|---|---|---|');
  for (const c of M.criterio) {
    const t = c.paragrafos?.[0]?.texto ?? c.texto ?? c.lead?.texto ?? c.mensagens?.[0]?.texto ?? (c.textos ? `script: ${c.textos.map((x) => x.codigo).join(' / ')}` : '');
    L.push(`| \`${c.id}\` | ${cel(c.local)} | ${p14(c.marcacao_p14)} | ${cel(t.slice(0, 160))}${t.length > 160 ? '…' : ''} |`);
  }
  const cf = M.criterio.find((c) => c.id === 'm08-crit-final');
  const cnt = {}; cf.itens.forEach((i) => (i.marcacao_p14 || []).forEach((m) => { cnt[m] = (cnt[m] || 0) + 1; }));
  L.push('', `No § Final, cada um dos ${cf.itens.length} itens tem marcação própria: ${Object.entries(cnt).map(([k, v]) => `${P14[k]} ${v}`).join(', ')}. **Cronometrado** aparece no § Voz ("Grave-se … em dez minutos"; corte final "em três minutos") e na instrução das perguntas-relâmpago (hesitar "mais de três segundos").`);
  L.push('', `Mensagens do quiz (script, L3116): \`n >= 8\` → "${M.criterio.find((c) => c.id === 'm08-crit-quiz').mensagens[0].texto}" / senão → "${M.criterio.find((c) => c.id === 'm08-crit-quiz').mensagens[1].texto}" (P18: registro legado).`, '');

  L.push('## Laboratórios, Tradutor', '');
  L.push(`- ${M.laboratorios.nota}`);
  L.push(`- ${M.tradutor_nota}`, '');

  L.push('## Voz e princípios', '');
  L.push(`- **${M.voz_principios.regra_do_modulo.rotulo}** (§ 00): "${M.voz_principios.regra_do_modulo.paragrafos[0].texto}"`);
  L.push(`- **Destaques de método:** ${M.voz_principios.destaques_de_metodo.map((d) => `"${d.rotulo}" (${d.secao})`).join('; ')}.`);
  L.push(`- **Números vivos / data de corte:** ${M.voz_principios.destaques_numeros_vivos.map((d) => d.secao).join(', ')}.`);
  L.push(`- **Rodapé de escopo:** "${M.voz_principios.rodape_escopo.texto}"`);
  L.push('- O § Voz (40 perguntas-relâmpago, 7 ataques, roteiro oral) está em `aparato.json › voz_oral`.', '');

  L.push(`## § Erros (${M.erros_comuns.itens.length})`, '');
  L.push(`h2: "${M.erros_comuns.titulo.texto}".`, '');
  L.push(`| # | ${M.erros_comuns.cabecalho.map(cel).join(' | ')} |`, '|---|---|---|');
  M.erros_comuns.itens.forEach((e, i) => L.push(`| ${i + 1} | ${cel(e.erro.texto)} | ${cel(e.correcao.texto)} |`));
  L.push('');

  L.push(`## Blocos "Onde isso entra no produto" (P7): ${M.blocos_de_produto_P7.length}`, '');
  L.push(`Em ${M.blocos_de_produto_P7.map((b) => b.secao).join(', ')}. Ficam registrados e fora da interface. Citam "Brazil Pulse", "Brasil Terminal" e "Diagnóstico Energético" (vocabulário interno de produto).`, '');

  L.push('## Divergências', '');
  L.push('| Id | Tipo | Tema |', '|---|---|---|');
  for (const d of M.divergencias) L.push(`| \`${d.id}\` | ${cel(d.tipo)} | ${cel(d.tema)} |`);
  L.push('', 'Detalhes (leituras A e B, medições, linhas) no JSON.', '');
  L.push('## Verificação', '');
  L.push("- **Segundo verificador adversarial (2026-09-17), sem mudança:** script próprio (HTML sem tags e sem espaço, entidades decodificadas) achou todas as folhas de conteúdo do `modulo.json` na fonte (as não achadas são metadados, marcações P14 e rótulos de local desta extração) e as 168 origens a ±3; recontagem: 12 pílulas, 7 `box rd`, 4 `box cy`, 10 `box gd` (9 com \"Onde isso entra no produto\"), 8 `map-card`, 8 `src-card` estáticos (6 na Aula 02, 2 na Aula 06), 11 `li` na 7.5, 18 linhas de erro, 1 `div.form`, 0 mídia; cobertura por bloco de texto de hero, § 00 e § MAP completa; os 10 `</b>` órfãos e a ausência do `div.form` no código conferem.");
  L.push("- **Verificador adversarial (2026-09-17), corrigido:** `comparacao_codigo.catalogo_canonico.criterio_citado` e `mod-div-04.leitura_b` cortavam a citação do catálogo canônico na L812 (`slice(i, i + 4)`), justamente antes da L813 (\"complementaridade hidro-eólica.\"), que é a evidência da divergência. Agora L809–813.");
  L.push("- **Verificador adversarial (2026-09-17), corrigido:** `catalogo_canonico.frase_entre_aspas` e `mod-div-05.leitura_b` só tinham a L816, que termina em \"não existe a\". Agora L816–817, com \"pizza\" — o fecho da frase que a divergência diz não existir na fonte (conferido: zero ocorrências no HTML).");
  L.push("- **Verificador adversarial (2026-09-17), sem mudança:** recontagem independente no HTML (17 seções, 7 aulas, 11 `div.inst`, 12 pílulas, 8 `map-card`, 9 \"Onde isso entra no produto\", 7 `box rd` \"Números vivos\", 1 `div.form`, 11 itens em 7.5, 18 erros) confere; todas as strings de conteúdo e as 594 origens (±3 linhas) conferidas por script próprio; as divergências mod-div-01…12 foram rechecadas na fonte, no catálogo e no código.");
  L.push(`- \`m08_verify.mjs\`: ${verif('modulo.json')}.`);
  L.push(`- Não achadas na passada estrita: ${VE.nao_achadas.filter((x) => x.arquivo === 'modulo.json').map((x) => `\`${x.path}\` = "${x.valor}"`).join('; ')} — id desta extração e identificador de módulo.`);
  L.push('- Contagens cruzadas por três sinais (aulas, instrumentos, termos, exercícios, erros, quiz, checklist, referências, § Voz): todas conferem, ver `extratores/verificacao.json › sinais`.');
  fs.writeFileSync(`${OUTDIR}/modulo.md`, L.join('\n') + '\n');
}

// ═══════════════════════════ aparato.md ═══════════════════════════
{
  const L = [];
  L.push('# M08 · grupo "aparato"', '');
  L.push(`Fonte (só leitura): ${FONTE}. Saída: [\`aparato.json\`](aparato.json). Extrator: [\`extratores/m08_aparato.mjs\`](extratores/m08_aparato.mjs).`, '');
  L.push('O quiz sai do literal `QZ` do `<script>` original (executado em DOM simulado); o resto, do markup. Nada foi digitado.', '');
  L.push('| Grupo | Contagem | Observação |', '|---|---|---|');
  const c = A.contagens;
  L.push(`| Caso | ${c.caso_secoes} subseções, ${c.caso_tabelas} tabelas | perguntas \`null\`, decisão \`null\` (P17) |`);
  L.push(`| Quiz | ${c.quiz_questoes} questões × 4 = ${c.quiz_alternativas} alternativas; ${c.quiz_faixas_placar} faixas de placar | gabarito e explicação por questão |`);
  L.push(`| Checklist final | ${c.checklist_itens} itens | nenhum vínculo de aula declarado |`);
  L.push(`| Exercícios | ${c.exercicios} | ${c.exercicios_com_aula} com aula (todos soltos, P9); ${c.exercicios_com_criterio} com critério próprio |`);
  L.push(`| § Voz | ${c.voz_perguntas_relampago} perguntas-relâmpago, ${c.voz_ataques} ataques, roteiro de ${c.voz_roteiro_linhas} blocos | — |`);
  L.push(`| Referências | ${c.referencias} | ${c.referencias_com_url} com URL; ${c.referencias_com_data_ou_ano} com data ou ano no texto |`);
  L.push(`| Glossário | ${c.glossario_termos} termos em ${c.glossario_grupos} grupos | ${c.glossario_faltam_no_codigo} faltam no código; ${c.glossario_definicoes_diferentes} definições diferentes |`, '');

  const k = A.caso;
  L.push('## Caso', '');
  L.push(`- **Marcador:** "${k.marcador} · ${k.rotulo_marcador}". **h2:** "${k.titulo.texto}".`);
  L.push(`- **Parte:** a fonte declara "${k.parte_declarada}". ${k.parte_nota}`);
  L.push(`- **Lead:** "${k.lead.texto}"`);
  L.push(`- **Vínculos:** anterior — ${k.vinculos.modulo_anterior}; seguinte — ${k.vinculos.modulo_seguinte}.`, '');
  L.push('| Seção | Título | Blocos |', '|---|---|---|');
  for (const s of k.secoes) L.push(`| ${s.numero} | ${cel(s.titulo)} | ${s.blocos.map((b) => b.tipo).join(', ')} |`);
  L.push('', '**Dados literais.** ' + k.dados.nota, '');
  for (const t of k.dados.tabelas) {
    L.push(`| ${t.cabecalho.map(cel).join(' | ')} |`, `|${t.cabecalho.map(() => '---').join('|')}|`);
    for (const l of t.linhas) L.push(`| ${l.map((x) => cel(x.texto)).join(' | ')} |`);
    L.push('');
  }
  L.push(`**Perguntas e decisão:** \`null\`. ${k.nota_perguntas_decisao}`, '');
  L.push(`**Bloco de produto (P7):** "${k.bloco_de_produto_P7[0].paragrafos[0].texto}"`, '');

  const q = A.quiz;
  L.push('## Quiz', '');
  L.push(`Marcador "${q.marcador.marcador} · ${q.marcador.rotulo}". h2 "${q.titulo.texto}". Lead: "${q.lead.texto}"`, '');
  L.push(`Botões: ${q.botoes.map((b) => `"${b.rotulo}" (\`${b.id_fonte}\`)`).join(', ')}. Feedback: correta → \`${q.feedback_formato.correta.trim()}\`; incorreta → \`${q.feedback_formato.incorreta.trim()}\` + explicação. ${q.nota}`, '');
  L.push('| # | Enunciado | Alternativa correta | Aulas citadas na explicação |', '|---|---|---|---|');
  for (const x of q.questoes) L.push(`| ${x.ordem} | ${cel(x.enunciado)} | ${x.gabarito_indice + 1}. ${cel(x.alternativas[x.gabarito_indice].texto)} | ${x.aulas_citadas_na_explicacao.join(', ') || '—'} |`);
  L.push('', 'Alternativas completas e explicações literais no JSON (`questoes[].alternativas`, `questoes[].explicacao`).', '');
  L.push(`**Placar** (\`${q.placar.formato}\`):`);
  for (const f of q.placar.faixas) L.push(`- \`${f.condicao}\` (ramo ${f.ramo}, classe \`${f.classe}\`): "${f.mensagem}"`);
  L.push('', 'P18: "Critério de domínio atingido" e "Abaixo do critério de 8 em 10" são registro legado; não viram aprovação.', '');

  const ck = A.checklist_final;
  L.push(`## Checklist final (${ck.itens.length})`, '');
  L.push(`"${ck.marcador.marcador} · ${ck.marcador.rotulo}". h2 "${ck.titulo.texto}". Lead: "${ck.lead.texto}"`, '');
  const crit = M.criterio.find((x) => x.id === 'm08-crit-final');
  const mk = Object.fromEntries(crit.itens.map((i) => [i.id, i.marcacao_p14]));
  ck.itens.forEach((it) => L.push(`${it.ordem}. ${it.texto} — *${p14(mk[it.id])}*`));
  L.push('', ck.nota, '');

  const ex = A.exercicios;
  L.push(`## Exercícios (${ex.itens.length})`, '');
  L.push(`h2 "${ex.titulo.texto}". ${ex.nota}`, '');
  L.push('| Tag | Bloco | Enunciado (resumo literal do `summary`) | Critério | Aula | Código |', '|---|---|---|---|---|---|');
  for (const e of ex.itens) {
    const cd = e.comparacao_codigo;
    L.push(`| ${e.tag} | ${cel(e.bloco)} | ${cel(e.resumo_literal)} | ${e.criterio ? cel(e.criterio.texto) : '`null`'} | solto | ${cd ? `\`${cd.id}\`, gabarito ${cd.gabarito_igual_texto ? 'igual' : (cd.gabarito_igual_salvo_espacos ? 'igual salvo espaços' : 'diferente')}; \`prompt: "${cd.prompt}"\`, \`points: ${cd.points}\`` : '—'} |`);
  }
  L.push('', 'Resposta de referência: parágrafos literais em `itens[].resposta_de_referencia`. No código, o gabarito virou texto corrido, `prompt` está vazio e `points: 1` não tem origem na fonte (apa-div-07).', '');

  const vz = A.voz_oral;
  L.push('## § Voz', '');
  L.push(`h2 "${vz.titulo.texto}". Lead: "${vz.lead.texto}"`, '');
  L.push(`- **${vz.perguntas_relampago.subtitulo.numero} ${vz.perguntas_relampago.subtitulo.texto}** (${vz.perguntas_relampago.itens.length}). Instrução: "${vz.perguntas_relampago.instrucao.texto}" — *${p14(vz.perguntas_relampago.marcacao_p14)}*.`);
  L.push(`- **${vz.ataques_de_decisor.subtitulo.numero} ${vz.ataques_de_decisor.subtitulo.texto}** (${vz.ataques_de_decisor.itens.length}). Interlocutores: ${vz.ataques_de_decisor.itens.map((a) => a.interlocutor).join(', ')}. Cada um traz pergunta e partes rotuladas ("O que não fazer:" etc.).`);
  L.push(`- **${vz.roteiro_oral.subtitulo.numero} ${vz.roteiro_oral.subtitulo.texto}.** Instrução: "${vz.roteiro_oral.instrucao.texto}" — *${p14(vz.roteiro_oral.marcacao_p14)}*.`, '');
  L.push(`| ${vz.roteiro_oral.tabela.cabecalho.map(cel).join(' | ')} |`, '|---|---|---|');
  for (const l of vz.roteiro_oral.tabela.linhas) L.push(`| ${l.map((x) => cel(x.texto)).join(' | ')} |`);
  L.push('', `Fecho: "${vz.roteiro_oral.fecho.texto}"`, '');

  const rf = A.referencias;
  L.push(`## Referências (${rf.itens.length})`, '');
  L.push(`h2 "${rf.titulo.texto}". Lead: "${rf.lead.texto}"`, '');
  L.push(rf.nota.replace(/</g, '&lt;'), '');
  L.push('| # | Grupo | Título | Instituição | Datas/anos no texto | URL |', '|---|---|---|---|---|---|');
  for (const r of rf.itens) L.push(`| ${r.numero} | ${cel(r.grupo)} | ${cel(r.titulo)} | ${cel(r.instituicao)} | ${r.datas_e_anos_literais.length ? cel(r.datas_e_anos_literais.join('; ')) : '—'} | \`null\` |`);
  L.push('', `**${rf.data_de_corte.rotulo}** (box rd, L${rf.data_de_corte.origem.linha_aprox}): "${rf.data_de_corte.paragrafos[0].texto}"`, '');

  const g = A.glossario;
  L.push(`## Glossário (${g.termos.length})`, '');
  L.push(`h2 "${g.titulo.texto}". Contagens: h2 ${g.contagem.declarada_h2}, hero ${g.contagem.declarada_hero}, soma dos grupos ${g.contagem.soma_declarada_grupos}, medida ${g.contagem.medida} — **todas iguais** (diferente do M01, P22).`, '');
  L.push('| Grupo | Declarados | Medidos |', '|---|---|---|');
  for (const x of g.grupos) L.push(`| ${cel(x.rotulo)} | ${x.declarados} | ${x.medidos} |`);
  const gc = g.comparacao_codigo;
  L.push('', `**Código (\`alexandria-glossario.ts\`):** ${gc.verbetes_gl_m08_no_codigo} verbetes \`gl-m08-*\`; faltam ${gc.faltam_no_codigo.length}; definições diferentes ${gc.definicoes_diferentes.length}; verbetes no código sem termo na fonte ${gc.no_codigo_sem_termo_na_fonte.length}; \`aulaIds\` preenchidos em ${gc.aulaIds_preenchidos_no_codigo} (${g.termos.filter((t) => t.codigo.aulaIds.length).map((t) => `${t.termo} → ${t.codigo.aulaIds.join(', ')}`).join('; ')}). A fonte não vincula termo a aula.`, '');
  const hom = g.termos.filter((t) => t.outros_modulos_com_mesmo_termo.length);
  L.push(`**Homônimos em outros módulos** (${hom.length}, para o produto decidir duplicata; P22): ${hom.map((t) => `${t.termo} (${t.outros_modulos_com_mesmo_termo.join(', ')})`).join('; ')}.`, '');
  L.push('**Termos** (texto do `span.term` sem o ponto final; definição literal em `termos[].definicao`):', '');
  for (const x of g.grupos) L.push(`- *${x.rotulo}:* ${g.termos.filter((t) => t.grupo === x.rotulo).map((t) => t.termo).join(' · ')}`);
  L.push('');

  L.push('## Divergências', '', '| Id | Tipo | Tema |', '|---|---|---|');
  for (const d of A.divergencias) L.push(`| \`${d.id}\` | ${cel(d.tipo)} | ${cel(d.tema)} |`);
  L.push('', '`apa-div-05` é uma verificação que confere (contagem do glossário), não uma divergência.', '');
  L.push('## Verificação', '');
  L.push("- **Segundo verificador adversarial (2026-09-17), sem mudança:** quiz 100% contra o `QZ` avaliado (enunciado, 4 alternativas, `correta`, gabarito e explicação idênticos byte a byte); checklist 100% (26 `li`, texto e origem); glossário 100% (124 termos: termo, definição, grupo e origem por linha); 12 exercícios (resumo e corpo do `det-bd` inteiros; o critério do Ex 02 aparece também em `resposta_de_referencia`, de propósito); 28 referências idênticas ao `li`; cobertura por bloco de texto do caso, § Erros, § Ex, § Quiz, § Voz, § Final, § Lex e § Ref completa; 337 origens a ±3. Nenhuma correção.");
  L.push("- **Verificador adversarial (2026-09-17), sem mudança:** quiz 100% conferido contra o array `QZ` avaliado do script (10 enunciados, 40 alternativas, gabaritos 0123130123, 10 explicações, aulas citadas, origens ±3); checklist 100% (26 `li` idênticos, origens ±3); recontagem independente: 124 `span.term` em 7 grupos (18+16+18+16+20+16+20), 12 `details` no § Ex (1 \"Critério\"), 40 perguntas, 7 ataques, 8 linhas de roteiro, 28 referências (0 `<a>`/URL, 8 com data ou ano, 2 com instituição logo após o título), caso com 4 `h3`, 2 tabelas e nenhum \"?\". Nenhuma correção.");
  L.push(`- \`m08_verify.mjs\`: ${verif('aparato.json')}.`);
  L.push('- Não achadas na passada estrita: 40 `rotulo_exibido` ("opção N", composto pelo script a partir do índice) e o identificador de módulo.');
  L.push(`- Cobertura por token do markup (sem instrumentos): ${Object.entries(V.cobertura_por_token).filter(([k]) => ['caso', 'ex', 'quiz_markup', 'quiz_script', 'voz', 'final', 'lex', 'ref'].includes(k)).map(([k, v]) => `${k} ${String(v.cobertura).replace('.', ',')}%`).join(', ')}.`);
  fs.writeFileSync(`${OUTDIR}/aparato.md`, L.join('\n') + '\n');
}

// ═══════════════════════════ instrumentos.md ═══════════════════════════
{
  const L = [];
  L.push('# M08 · instrumentos', '');
  L.push(`- **Fonte (só leitura):** ${FONTE}; markup em \`div.inst\` (precedido de \`<!-- INST NN -->\`), script em L2042–3130 com um cabeçalho \`INST NN — …\` por instrumento.`);
  L.push('- **Saída:** [`instrumentos.json`](instrumentos.json). **Extrator:** [`extratores/m08_instrumentos.mjs`](extratores/m08_instrumentos.mjs).', '');
  L.push('## Método (protocolo §10)', '');
  L.push(`- ${I.metodo.replace("<script>", "`<script>`")}`);
  L.push('- **Fórmulas:** `saidas.calculo_verbatim` são as linhas `var …` da função de cálculo, literais, com linha; `saidas.readouts_do_script` são os `div.ro` montados pelo script (rótulo, expressão, unidade).');
  L.push('- **Ramos:** `ramos_de_leitura[]` traz a condição, a linha e o `corpo_verbatim` (classe e mensagem literais do ramo). O bloco inteiro do instrumento está em `script.codigo_verbatim`.');
  L.push('- **Cenário-padrão:** estado renderizado pelo script original sem nenhuma interação (valores do markup e do objeto `I{n}`).');
  L.push(`- **Prova diferencial:** ${n(I.contagens.casos_diferenciais)} casos, fonte executada × \`INSTRUMENT_CALCULATORS\` do código. Espaço inteiro quando é finito (INST 01, 05, 06, 07, 08, 09, 11); grade + aleatórios de semente fixa nos contínuos.`, '');
  L.push('**Campos que a fonte não preenche:** `pergunta: null` em todos (nenhuma pergunta própria de instrumento); `fonte_dos_numeros: null` onde não há `span.srcnote`; `tolerancia: null` onde a fonte não declara.', '');

  L.push('## Os 11 instrumentos', '');
  L.push('| Id | Título | Onde | Entradas | Saídas | Ramos | Fonte dos números | Tolerância | `kind` no código | Estado |', '|---|---|---|---|---|---|---|---|---|---|');
  for (const x of I.instrumentos) {
    const e = x.entradas;
    const ent = [
      ...e.grupos_segmentados.map((g) => `${g.rotulo} (${g.opcoes.length || 'chips'})`),
      ...e.campos_no_markup.map((f) => f.rotulo),
      ...(e.campos_gerados_por_script.length ? [`${e.campos_gerados_por_script.length} campos gerados`] : []),
      ...(e.controles_sem_campo ? ['controles gerados'] : []),
    ].join('; ');
    const sai = x.saidas.readouts_do_script.length ? x.saidas.readouts_do_script.map((r) => r.rotulo_bruto).join('; ') + ' + veredito' : 'painel textual';
    const onde = x.invocacao.secao === 'map' ? '**§ MAP (módulo)**' : `Aula ${x.invocacao.secao.slice(1)}${x.invocacao.subsecao ? `, após ${x.invocacao.subsecao.numero}` : ''}`;
    L.push(`| ${x.id.slice(4)} | ${cel(x.titulo.texto)} | ${onde}, L${x.invocacao.bloco_div_linhas.join('–')} | ${cel(ent)} | ${cel(sai)} | ${x.ramos_de_leitura.length} | ${x.fonte_dos_numeros ? 'srcnote' : '`null`'} | ${x.tolerancia ? `${x.tolerancia.valor} ${x.tolerancia.unidade}` : '`null`'} | ${[...new Set(x.codigo.comparacao_estatica.map((k) => k.kind))].join(', ')} | ${x.codigo.status} |`);
  }
  L.push('', `Contagem: ${I.contagens.instrumentos} (${I.contagens.de_aula} de aula + ${I.contagens.de_modulo} de módulo). As Aulas 01, 02 e 03 têm dois cada. Código: ${Object.entries(I.contagens.por_status).map(([k, v]) => `${v} ${k}`).join(', ')}; nenhum "não portado".`, '');

  for (const x of I.instrumentos) {
    L.push(`## ${x.numero_fonte} — ${x.titulo.texto}`, '');
    L.push(`- **Escopo:** ${x.escopo}. **Invocação:** seção \`${x.invocacao.secao}\`${x.invocacao.aula_id_codigo ? ` (\`${x.invocacao.aula_id_codigo}\`)` : ''}${x.invocacao.subsecao ? `, subseção ${x.invocacao.subsecao.numero} "${x.invocacao.subsecao.titulo}"` : ''}; \`div.inst\` em L${x.invocacao.bloco_div_linhas.join('–')}.`);
    if (x.invocacao.elemento_anterior) L.push(`- **Antes:** \`${x.invocacao.elemento_anterior.tipo}\` L${x.invocacao.elemento_anterior.linha_aprox} "${x.invocacao.elemento_anterior.trecho.slice(0, 90)}…". **Depois:** ${x.invocacao.elemento_seguinte ? `\`${x.invocacao.elemento_seguinte.tipo}\` L${x.invocacao.elemento_seguinte.linha_aprox} "${x.invocacao.elemento_seguinte.trecho.slice(0, 90)}…"` : '—'}`);
    const fr = x.invocacao.frases_com_palavra_instrumento.flatMap((p) => p.frases.map((f) => `L${p.linha_aprox}: "${f}"`));
    if (fr.length) L.push(`- **Frases da seção com "instrumento/reconstrutor"** (sinal, não vínculo): ${fr.join(' · ')}`);
    L.push(`- **Pergunta:** \`null\`. **Intro:** "${x.intro.texto}"`);
    const e = x.entradas;
    if (e.grupos_segmentados.length) for (const gq of e.grupos_segmentados) L.push(`- **Entrada "${gq.rotulo}"** (\`${gq.id_fonte}\`): ${gq.opcoes.length ? gq.opcoes.map((o) => `${o.rotulo}${o.inicial ? ' (padrão)' : ''}`).join(' · ') : 'opções geradas pelo script'}`);
    for (const f of e.campos_no_markup) L.push(`- **Entrada "${f.rotulo}"** (${f.unidade}): ${f.inputs.map((i) => `\`${i.id_fonte}\` ${i.tipo} ${i.min}–${i.max}, passo ${i.step}, padrão ${i.padrao}`).join('; ')}`);
    if (e.campos_gerados_por_script.length) L.push(`- **Entradas geradas pelo script:** ${e.campos_gerados_por_script.map((f) => `${f.rotulo} (${f.unidade}; ${f.inputs.map((i) => `\`${i.id_fonte}\` ${i.min}–${i.max}, padrão ${i.padrao ?? `vazio${i.placeholder ? ` "${i.placeholder}"` : ''}`}`).join(', ')})`).join('; ')}`);
    if (e.controles_sem_campo) L.push(`- **Controles:** ${e.controles_sem_campo.descricao_script}`);
    if (e.nota_faixas) L.push(`- *${e.nota_faixas}*`);
    if (x.botoes.length) L.push(`- **Botões:** ${x.botoes.map((b) => `"${b.rotulo}"`).join(', ')}`);
    if (x.rotulos_estaticos?.length) L.push(`- **Rótulos fixos do markup:** ${x.rotulos_estaticos.map((r) => `"${r.texto}"${r.unidade ? ` (unidade "${r.unidade}", \`#${r.container}\`)` : ''} L${r.origem.linha_aprox}`).join(' · ')}`);
    if (x.saidas.calculo_verbatim.length) {
      L.push(`- **Cálculo (\`${x.saidas.funcao}\`, literal):**`, '', '```js');
      for (const cl of x.saidas.calculo_verbatim) L.push(`${cl.codigo}   // L${cl.linha}`);
      L.push('```', '');
    }
    if (x.saidas.readouts_do_script.length) {
      L.push('| Saída | Expressão (script) | Unidade | Linha |', '|---|---|---|---|');
      for (const r of x.saidas.readouts_do_script) L.push(`| ${cel(r.rotulo_bruto)} | \`${cel(r.expressao)}\` | ${cel(r.unidade)} | ${r.linha} |`);
      L.push('');
    }
    if (x.ramos_de_leitura.length) L.push(`- **Ramos de leitura (${x.ramos_de_leitura.length}):** ${x.ramos_de_leitura.map((r) => `L${r.linha} \`${r.cond}\``).join(' → ')}`);
    const cp = x.cenario_padrao;
    const cpTxt = [];
    if (cp.saidas) cpTxt.push(cp.saidas.map((s) => `${s.k} = ${s.n}${s.u ? ' ' + s.u : ''}`).join('; '));
    if (cp.termometro) cpTxt.push(`termômetro ${cp.termometro.join(' / ')}`);
    if (cp.veredito) cpTxt.push(`veredito (\`${cp.veredito.classe}\`): "${cp.veredito.texto.slice(0, 220)}${cp.veredito.texto.length > 220 ? '…' : ''}"`);
    for (const kk of ['painel', 'legenda', 'legenda_pizza1', 'legenda_pizza2', 'corpo_texto', 'ficha_texto']) if (cp[kk]) cpTxt.push(`${kk}: "${cp[kk].texto.slice(0, 200)}${cp[kk].texto.length > 200 ? '…' : ''}"`);
    L.push(`- **Cenário-padrão (fonte executada):** ${cpTxt.join(' · ')}`);
    L.push(`- **Fonte dos números:** ${x.fonte_dos_numeros ? `"${x.fonte_dos_numeros.texto}"` : `\`null\`. ${x.fonte_dos_numeros_nota}`}`);
    L.push(`- **Aviso:** "${x.disclaimer.texto}"`);
    L.push(`- **Tolerância:** ${x.tolerancia ? `${x.tolerancia.valor} ${x.tolerancia.unidade} (declarada: ${x.tolerancia.declaracoes.map((d) => `L${d.origem.linha_aprox}`).join(', ')})` : '`null` (não declarada)'}`);
    if (x.detalhe) L.push(`- **Detalhe (\`details\`):** "${x.detalhe.summary}"`);
    const cd = x.codigo; const pd = cd.prova_diferencial;
    L.push(`- **Código — ${cd.status}** (\`${cd.ids.join('`, `')}\`). ${cd.problemas.length ? 'Problemas: ' + cd.problemas.join('; ') + '.' : 'Sem problemas.'}`);
    if (pd) L.push(`  Prova diferencial: ${pd.espaco}; ${n(pd.casos)} casos; numéricas iguais ${n(pd.numericas_ok)}, diferentes ${pd.numericas_div}; texto completo ${n(pd.textos_completos)}, incompleto ${n(pd.textos_incompletos)}; veredito da fonte contido no do código ${n(pd.veredito_substring_ok)}.${pd.tokens_ausentes_freq?.length ? ` Tokens ausentes mais frequentes: ${pd.tokens_ausentes_freq.slice(0, 8).map((t) => `${t[0]} (${t[1]})`).join(', ')}.` : ''}`);
    L.push('');
  }
  L.push('### Leitura dos "divergentes"', '');
  L.push('- **Nenhuma divergência numérica** em nenhum instrumento (0 em todas as provas).');
  L.push('- **INST 02, 03, 10:** o código tem um campo `formula` com texto que a fonte não escreve (fórmula didática redigida no porte).');
  L.push('- **INST 03:** falta no código o quarto readout textual "Faixa típica · {fonte}" / "lo% a hi%".');
  L.push('- **INST 04:** o toggle de rodada virou dois instrumentos (`-cap`, `-ger`) com título acrescido; faltam o readout "Ordem das fontes" (Correta/Incorreta) e a lista de erro por fonte em pp; o `details` de referência editável não foi portado.');
  L.push('- **INST 01, 05, 06, 07:** intro e/ou aviso não aparecem verbatim na `note` do código; SVG/curvas/calendário não portam (protocolo §12).', '');

  L.push('## Divergências internas da fonte', '', '| Id | Severidade | Tipo | Instrumentos | Tema |', '|---|---|---|---|---|');
  for (const d of I.divergencias_fonte) L.push(`| \`${d.id}\` | ${d.severidade} | ${cel(d.tipo)} | ${(d.instrumentos || []).join(', ')} | ${cel(d.tema)} |`);
  L.push('', 'As duas leituras de cada uma estão no JSON. `inst-div-04` é **CONTENT QA — AUTHORITATIVE VERIFICATION REQUIRED** (P20).', '');
  L.push('## Verificação', '');
  L.push("- **Verificador adversarial (2026-09-17), sem mudança:** 100% das 112 linhas de cálculo/readout (`calculo_verbatim`, `readouts_do_script`) e dos 38 ramos (condição e corpo) conferidos na linha declarada (±3; as duas instruções de várias linhas conferem com espaço tolerado); os 11 `codigo_verbatim` são idênticos às linhas declaradas; cenário-padrão do INST 02 recalculado à mão (261,0 GW, 761 TWh, 33,3%, 2 trocas, +10,5/−13,3, ordem de geração hid > eol > sol > fos > bio > nuc), assim como os de INST 08 (fluxo fraco × próximo do normal, 17 meses), 09 (P2 útil normal → texto da madrugada, carga \"Elevada\") e 10 (8.736 h, 99,7%). As divergências inst-div-01…09 conferem na fonte.");
  L.push("- **Segundo verificador adversarial (2026-09-17), corrigido:** a cobertura por nó de texto de cada `div.inst` (script próprio) achou 4 rótulos fixos do markup ausentes do JSON: os `h5` \"Pizza 1 · capacidade instalada (GW)\" (L615) e \"Pizza 2 · geração efetiva (TWh/ano)\" (L620) do INST 02, e os `div.th-lb` \"Fluxo · afluência\" (L1030, unidade \"% MLT\") e \"Estoque · armazenamento\" (L1031, unidade \"% útil\") do INST 08, cujos valores já estavam em `cenario_padrao.termometro` sem rótulo. Acrescentado o campo `rotulos_estaticos[]` (com origem) nos 11 instrumentos (vazio nos outros 9), no extrator `m08_instrumentos.mjs` e, por remendo idêntico, no `instrumentos.json` (só inserções). Nenhum desses quatro rótulos existe em `src/` (limitação de contrato, protocolo §12); o status dos INST 02 e 08 não mudou, porque o critério de status do extrator não mede rótulos fixos.");
  L.push("- **Segundo verificador adversarial (2026-09-17), sem mudança:** 112 linhas de cálculo/readout e 38 ramos rechecados contra a fonte (2 acusações do script próprio eram instruções de várias linhas, falso positivo); 93 origens a ±3 (89 anteriores + 4 novas); os outros 9 `div.inst` têm 100% dos nós de texto no JSON; contagens de status (3 portado, 8 divergente) e de `formula` não nula (INST 02, 03, 10) conferidas no código.");
  L.push(`- \`m08_verify.mjs\`: ${verif('instrumentos.json')}.`);
  L.push('- Não achadas na passada estrita: estados renderizados pelo script (vereditos com número interpolado, painéis, legendas), descrições desta extração dos controles gerados e o identificador de módulo. Nenhum texto parafraseado.');
  fs.writeFileSync(`${OUTDIR}/instrumentos.md`, L.join('\n') + '\n');
}
console.log('md ok');
