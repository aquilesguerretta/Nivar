// Gera modulo.md e instrumentos.md a partir dos JSON (os literais vêm dos
// JSON, nunca digitados). Uso: node m05_md.mjs
import fs from 'node:fs';
import path from 'node:path';
import { OUTDIR } from './m05_lib.mjs';

const rd = (f) => JSON.parse(fs.readFileSync(path.join(OUTDIR, f), 'utf8'));
const M = rd('modulo.json');
const I = rd('instrumentos.json');
const A = rd('aparato.json');
const V = JSON.parse(fs.readFileSync(path.join(OUTDIR, 'extratores/verify-result.json'), 'utf8'));
const C = JSON.parse(fs.readFileSync(path.join(OUTDIR, 'extratores/cobertura-estrita.json'), 'utf8'));
const cell = (s) => String(s ?? '—').replace(/\|/g, '\\|').replace(/\n/g, ' ');
const q = (s) => `"${s}"`;
const L = (o) => (o?.linha_aprox ? `L${o.linha_aprox}` : '—');

// Verificação adversarial independente (2026-09-17): parser e normalização
// próprios, sem reaproveitar m05_lib. Registrada aqui para sobreviver a nova
// geração dos .md.
const VERIF_INDEP = {
  data: '2026-09-17',
  metodo: 'Parser e normalização próprios (sem m05_lib): tags removidas, entidades decodificadas e espaços ignorados; texto comparado contra a janela da fonte em torno de linha_aprox (±3 linhas, alargada pelo tamanho do texto). Quiz: o literal var Q avaliado de novo e comparado campo a campo. Script: cada {linha, codigo} comparado com a linha da fonte.',
  amostras: {
    textos_e_origens_aparato: '694 checagens, 0 falhas (todos os itens com texto e origem)',
    textos_e_origens_modulo: '640 checagens; 9 acusações, todas falso-positivo do medidor (convenções, título do catálogo L441 de outro arquivo, títulos de instrumento no roteiro ancorados por linhas[] e não pela origem do pai)',
    textos_e_origens_instrumentos: '143 checagens, 0 falhas',
    quiz: '10/10 questões: enunciado, 4 alternativas, gabarito e explicação idênticos ao var Q avaliado; rótulo "Questão N de 10"; linha ±3; 2 faixas de placar (L1872, L1875) conferidas',
    checklist: '21/21 itens: html idêntico ao <li> e linha exata (ul.ck única, L1224)',
    formulas_script: '403/403 pares {linha, codigo} idênticos; cobertura das linhas não vazias de cada bloco INST 01–06 completa; 23/23 ramos de veredito (condição e expressao_js) idênticos às linhas 1493–1757',
    exercicios: '10/10: tag, enunciado e cada parágrafo do gabarito (html e linha) idênticos',
    referencias: '16/16 (texto igual, exceto <br> → espaço), 4 URLs idênticas',
    glossario: '72/72: termo, definição e linha; 5 resumos de família literais',
    voz_e_erros: '34/34 perguntas-relâmpago, 6/6 ataques e 12/12 erros: html e linha idênticos',
  },
  contagens_recalculadas: 'Todas as contagens declaradas conferem com a recontagem direta no HTML: 16 sec-id; 6 aulas; 6 div.inst; 21 ranges (4+3+4+1+6+3); 8 sinais (array SIG, pesos somam 100); 24 readouts (4 por instrumento), 4 textuais; 23 ramos vd() (4+3+5+4+4+3); 72 termos (12/12/11/17/20; 92 span.term − 20 do §Ex); 10 exercícios; 21 itens; 10 × 4 no quiz; 8 perguntas no caso; 16 referências (4 com href); 6 map-card; 7 pílulas; 34/6/5 na §Voz; 12 erros; 6 painéis lv; 7 boxes "Onde isso entra no produto"; 10 linhas com "GridAlpha"; 30 h3 nas aulas; 0 Lab/Tradutor/Resultado esperado/vídeo.',
  reproducoes: 'Cenários-padrão refeitos à mão pelas fórmulas do script: INST·01 R$ 630; INST·02 32/30/63; INST·03 227,50 / 319,90 / 184,80; INST·05 R$ 1,1 bi, 78,57, participação 27%; INST·06 coerência 84, distância 0, quadrante e risco. Grade INST·01: 360 casos e 27 ramos coincidentes reproduzidos; tamanhos das demais grades (1764, 1815, 768, 972, 9261) conferem. m05_verify.mjs rodado de novo: saída idêntica (2227/0).',
  divergencias: 'As 25 conferidas contra a fonte e o código (inst-01 id "i1" × i[\'i1-n\'] em alexandria-instrument-calculators.ts L2870; inst-03 texto único; inst-06 selects "(N pts)"; mod-06 "Criança de 12 anos Executivo Especialista" num <b> só; literal da taxonomia citado em inst-04 confere). Nenhuma inventada.',
  correcoes: [
    'div-m05-mod-02, leitura_b.onde: listava "§Voz lede, Aula 05 lede" sob o literal "Bloco 5", mas nessas linhas a fonte diz só "Neste bloco" (L1148) e "do bloco" (L761). O literal "Bloco 5" está em L287, L325 e L1222. Corrigido em modulo.json e em m05_modulo.mjs, com as 7 linhas de "bloco" em minúscula listadas à parte.',
  ],
  observacoes_sem_correcao: [
    'marcacao_p14 do checklist: o item 01 ("Aplica a régua…") não recebe "aplicacao" e o item 17 ("Aplica o teste… a uma decisão concreta") recebe. É a regra declarada no extrator (só "a uma decisão concreta" ou "Plota"), não um erro; continua como anotação a revisar.',
    'O lead da Aula 06 no código difere da fonte só pelo escape das aspas (\\"), então lead_igual = true se mantém.',
  ],
};
const verifMd = () => [
  '## Verificação', '',
  `Verificação adversarial independente em ${VERIF_INDEP.data}. ${VERIF_INDEP.metodo}`, '',
  ...Object.entries(VERIF_INDEP.amostras).map(([k, v]) => `- **${k}:** ${v}`),
  `- **Contagens:** ${VERIF_INDEP.contagens_recalculadas}`,
  `- **Reproduções:** ${VERIF_INDEP.reproducoes}`,
  `- **Divergências:** ${VERIF_INDEP.divergencias}`, '',
  '**Correções aplicadas:**', '',
  ...VERIF_INDEP.correcoes.map((c) => `- ${c}`), '',
  '**Observações sem correção:**', '',
  ...VERIF_INDEP.observacoes_sem_correcao.map((c) => `- ${c}`), '',
];

// ───────────────────────────── modulo.md ─────────────────────────────
{
  const id = M.identidade;
  const cc = id.comparacao_catalogo;
  const o = [];
  o.push('# M05 · Grupo "módulo": como ler a extração', '');
  o.push(`**Fonte (só leitura):** \`${M.fonte.arquivo}\`, com ${M.fonte.linhas_total.toLocaleString('pt-BR')} linhas (sha256 \`${M.fonte.sha256.slice(0, 12)}…\`).`);
  o.push('**Arquivo gerado:** [`modulo.json`](modulo.json), produzido por [`extratores/m05_modulo.mjs`](extratores/m05_modulo.mjs).');
  o.push(`**Data:** ${M.gerado_em}. Tudo aqui é camada fonte: o texto é literal, cada item tem origem, e as contradições ficam registradas sem resolução.`, '');

  o.push('## Identidade (P24)', '');
  o.push('| Campo | Literal | Origem |', '|---|---|---|');
  o.push(`| \`<title>\` | ${cell(id.titulo_documento.texto)} | ${L(id.titulo_documento.origem)} |`);
  o.push(`| kicker | ${cell(id.eyebrow.texto)} | ${L(id.eyebrow.origem)} |`);
  o.push(`| título (h1) | ${cell(id.titulo.texto)} | ${L(id.titulo.origem)} |`);
  o.push(`| subtítulo | ${cell(id.subtitulo.texto)} | ${L(id.subtitulo.origem)} |`);
  o.push(`| horas | ${cell(id.horas.texto)} (min/max = null na fonte) | ${L(id.horas.origem)} |`);
  id.rodape.forEach((r, i) => o.push(`| rodapé ${i + 1} | ${cell(r.texto)} | ${L(r.origem)} |`));
  o.push('');
  o.push(`- **Pílulas do hero (${id.pilulas.length}):** ${id.pilulas.map((p) => q(p.texto)).join(' · ')}.`);
  o.push(`- **Catálogo canônico** (\`${path.basename(cc.catalogo_md.arquivo)}\`, L${cc.catalogo_md.linha_aprox}): título ${q(cc.catalogo_md.titulo)}; escala ${q(cc.catalogo_md.escala)}.`);
  o.push(`- **Código** (\`alexandria-blocks.ts\` bloco-05): título ${q(cc.codigo_blocks.title)}, nível ${cc.codigo_blocks.level}, trilha \`${cc.codigo_blocks.track}\`, horas ${cc.codigo_blocks.estimatedHoursMin}–${cc.codigo_blocks.estimatedHoursMax}, \`illustrationPrefix\` ${cc.codigo_blocks.illustrationPrefix}. Em \`alexandria-trilhas.ts\`, \`totalAulas\` = ${cc.codigo_modulo.totalAulas}.`);
  o.push(`- **Resultado:** o título da fonte é igual ao do catálogo (${cc.titulo_fonte_igual_catalogo}) e ao do código (${cc.titulo_fonte_igual_codigo}). Não há divergência de título. O kicker e o rodapé 2 citam "GridAlpha", o que P24 manda não exibir ao learner.`);
  o.push(`- **Trilha e eixos:** a fonte não declara trilha (o catálogo a marca como "atribuída") nem eixos do módulo (\`eixos\` = null). Os "dois eixos" da Aula 06 e do INST·06 descrevem o desenho de mercado, não o módulo.`, '');

  o.push('## Roteiro (P8)', '');
  o.push(`${M.roteiro.length} seções \`sec-id\`: ${M.roteiro.filter((r) => r.tipo === 'aula').length} aulas e ${M.roteiro.filter((r) => r.tipo !== 'aula').length} de aparato. Não há § Lab.`, '');
  o.push('| # | Marcador | Rótulo | Título (h2) | Linhas | Subseções | Instrumento | Código: título/subtítulo/lead iguais |', '|---|---|---|---|---|---|---|---|');
  for (const r of M.roteiro) {
    const cod = r.comparacao_codigo ? `${r.comparacao_codigo.title_igual}/${r.comparacao_codigo.subtitle_igual}/${r.comparacao_codigo.lead_igual}` : '—';
    o.push(`| ${r.ordem_na_fonte} | ${cell(r.marcador)} | ${cell(r.rotulo_marcador)} | ${cell(r.titulo.texto)} | ${r.linhas.join('–')} | ${r.subsecoes ? r.subsecoes.map((s) => s.numero).join(', ') : '—'} | ${r.instrumentos?.length ? r.instrumentos.map((x) => x.id_fonte).join(', ') : '—'} | ${cod} |`);
  }
  const ca = M.comparacao_codigo.contagem_aulas;
  o.push('');
  o.push(`**Contagem de aulas.** Três sinais independentes concordam em 6: os sec-id "Aula NN" (${ca.fonte_secid_aula}), os cartões do § MAP (${ca.fonte_map_cards}, h2 ${q(ca.fonte_h2_map)}) e a pílula ${q(ca.fonte_pilula_hero)}. No código, \`MODULO_05_AULAS\` tem ${ca.codigo_MODULO_05_AULAS} aulas, \`totalAulas\` = ${ca.codigo_totalAulas_modulo} e há ${ca.codigo_instrumentos} instrumentos. Resultado: concordam = ${ca.concordam}.`, '');

  o.push('## Resultado esperado', '');
  o.push(`\`itens\` = null. ${M.resultado_esperado.nota}`, '');

  o.push('## § MAP (perguntas do mapa)', '');
  o.push(`${q(M.mapa.titulo_secao.texto)} (${L(M.mapa.titulo_secao.origem)}). Lead: ${q(M.mapa.lead.texto)}`, '');
  o.push(`\`perguntas\` = null. ${M.mapa.perguntas_nota}`, '');
  o.push('| Cartão | Título do cartão | = h2? | Descrição (literal) | Origem |', '|---|---|---|---|---|');
  for (const c of M.mapa.linhas) o.push(`| ${c.rotulo_aula} | ${cell(c.titulo_card)} | ${c.titulo_card_igual_h2 ? 'sim' : `**não** (h2: ${cell(c.titulo_h2_da_aula)})`} | ${cell(c.descricao.texto)} | ${L(c.origem)} |`);
  o.push('');

  o.push('## Critérios (P14, P18)', '');
  o.push(`${M.criterio.nota_p18}`, '');
  o.push('| id | Seção | Literal | Limiar literal | P14 (inferido) | Origem |', '|---|---|---|---|---|---|');
  for (const c of M.criterio.criterios) o.push(`| ${c.id} | ${c.secao} | ${cell(c.texto)} | ${c.limiar ? c.limiar.fonte_literal : '—'} | ${c.marcacao_p14.join(', ') || '—'} | ${L(c.origem)} |`);
  o.push('');
  const cq = M.criterio.criterios.find((c) => c.id === 'm05-crit-quiz');
  o.push('**Mensagens do placar no script:**');
  for (const m of cq.mensagens_do_script) o.push(`- \`${m.condicao}\` (${L(m.origem)}): ${q(m.mensagem)}`);
  const cv = M.criterio.criterios.find((c) => c.id === 'm05-crit-voz');
  o.push('', '**Partes do § Voz (todas orais e cronometradas):**');
  for (const p of cv.partes) o.push(`- ${p.numero} ${q(p.titulo)}: ${p.marcacao_p14.join('; ')}.`);
  o.push('', `A marcação P14 é inferência desta extração a partir do verbo e da instrução de cada item. Precisa de revisão humana. Os 21 itens do § Final estão marcados um a um em \`aparato.json\`.`, '');

  o.push('## Laboratórios e Tradutor', '');
  o.push(`- **Laboratórios:** \`itens\` = null. ${M.laboratorios.nota}`);
  o.push(`- **Tradutor:** \`itens\` = null. ${M.tradutor.nota}`, '');

  o.push('## Voz e princípios editoriais', '');
  o.push('| id | Tipo | Rótulo | Onde |', '|---|---|---|---|');
  for (const v of M.voz) o.push(`| ${v.id} | ${v.tipo} | ${cell(v.rotulo ?? '(sem rótulo)')} | ${v.origem ? L(v.origem) : v.linhas ? v.linhas.map((x) => L(x.origem)).join(', ') : '—'} |`);
  const vo = M.voz_dominio_oral;
  o.push('');
  o.push(`**§ Voz (domínio oral).** Tem ${vo.perguntas_relampago.total_markup} perguntas-relâmpago (a prosa diz ${q(vo.perguntas_relampago.declarado_prosa)}), ${vo.ataques_decisor_cetico.total_markup} ataques de decisor cético (a prosa diz ${q(vo.ataques_decisor_cetico.declarado_prosa)}) e um roteiro de cinco minutos em ${vo.roteiro_cinco_minutos.total} parágrafos. As contagens batem. ${vo.nota}`, '');

  o.push('## Erros comuns (§ Erros)', '');
  o.push(`${q(M.erros_comuns.titulo_secao.texto)}: a prosa declara ${q(M.erros_comuns.declarado_prosa)}, e o markup tem ${M.erros_comuns.total_markup}. A frase errada fica em \`frase_errada_*\` e a correção em \`correcao_*\`. A fonte não liga erro a aula. ${M.erros_comuns.codigo_atual}`, '');
  for (const e of M.erros_comuns.itens) o.push(`${e.ordem}. ${e.frase_errada_texto} (${L(e.origem)})`);
  o.push('');

  o.push('## Explicadores em três níveis e blocos de produto', '');
  o.push(`- **Explicadores (${M.tres_niveis.length}):** um por aula, com as abas ${M.tres_niveis[0].abas.map(q).join(' / ')}. Os três painéis estão literais em \`tres_niveis[].paineis\`.`);
  o.push(`  - No código, só o painel 0 está presente (${M.tres_niveis.map((t) => t.comparacao_codigo.paineis_presentes.map((b) => (b ? '1' : '0')).join('')).join(' ')}), e os três rótulos se fundem num único \`<b>\`.`);
  o.push(`- **Blocos "Onde isso entra no produto" (${M.blocos_de_produto.length}):** ${M.blocos_de_produto.map((b) => `${b.secao} ${L(b.origem)}`).join(', ')}. P7 manda não exibi-los. Ficam registrados literalmente.`, '');

  o.push('## Divergências do grupo', '');
  o.push('| id | Tipo | Sev. | Tema | Nota |', '|---|---|---|---|---|');
  for (const d of M.divergencias) o.push(`| ${d.id} | ${d.tipo} | ${d.severidade ?? '—'} | ${cell(d.tema)} | ${cell(d.nota)} |`);
  o.push('');
  o.push('Sobre div-m05-mod-08: o comentário em `alexandria-trilhas.ts` fala de `<h3>`, mas os títulos de aula da fonte são `<h2>`.', '');

  o.push('## Lacunas', '');
  o.push('- **Resultado esperado:** não existe na fonte.');
  o.push('- **Perguntas do § MAP:** não existem (o mapa só tem cartões descritivos).');
  o.push('- **Trilha, nível e eixos:** não são declarados.');
  o.push('- **Horas:** min e max ficam null (só existe a string).');
  o.push('- **§ Lab e Tradutor:** não existem.');
  o.push('- **Vínculos com aula:** nenhum erro, critério ou item de voz declara aula.');
  o.push('- **Por aula:** duração, dificuldade e vídeo não existem na fonte. O código traz `null`/medido, ver `roteiro[].comparacao_codigo`.');
  o.push('- **Corpo das aulas:** fica fora deste grupo. Aqui entram só o roteiro, os explicadores e os ponteiros; os instrumentos estão em `instrumentos.json`.');
  o.push('');
  o.push(...verifMd());
  fs.writeFileSync(path.join(OUTDIR, 'modulo.md'), o.join('\n'), 'utf8');
}

// ─────────────────────────── instrumentos.md ─────────────────────────
{
  const o = [];
  o.push('# M05 · Grupo "instrumentos": como ler a extração', '');
  o.push('**Arquivo gerado:** [`instrumentos.json`](instrumentos.json), produzido por [`extratores/m05_instrumentos.mjs`](extratores/m05_instrumentos.mjs).');
  o.push(`**Data:** ${I.gerado_em}.`, '');
  o.push('## Método', '');
  o.push(`- **Leitura.** ${I.metodo}`);
  o.push(`- **Total.** São ${I.total} instrumentos, todos dentro de aula (Aulas 01–06, um por aula). Fora de aula: ${I.fora_de_aula.length}. ${I.fora_de_aula_nota}`);
  o.push('- **Fórmulas e vereditos.** Ficam no JSON como código verbatim do `<script>` (L1460–1761): `formulas_script`, `script.codigo[]`, `veredito.ramos[].expressao_js`.');
  o.push(`  - Os formatadores comuns (L${I.formatadores_comuns.helpers[0].linha}–) estão em \`formatadores_comuns\`.`);
  o.push('  - Esta página não reescreve fórmula nenhuma; ela só aponta as linhas.');
  o.push('- **Cenário-padrão.** Vem da execução do script original inteiro em DOM simulado (`node:vm`), com os `value=` do markup.');
  o.push('- **Comparação com o código.** Grade exaustiva por instrumento: script original × `INSTRUMENT_CALCULATORS` (bundle esbuild). Mede o valor numérico, o ramo do veredito e o texto verbatim.', '');

  o.push('## Resumo', '');
  o.push('| Id | Título | Aula · posição | Entradas | Saídas (textuais) | Ramos | Cenário-padrão (saídas) | Ramo padrão | Status no código |', '|---|---|---|---|---|---|---|---|---|');
  for (const x of I.instrumentos) {
    const p = x.posicao_no_texto;
    o.push(`| ${x.id_fonte} | ${cell(x.titulo)} | A${x.aula} §${p.subsecao.numero}, L${p.linhas.join('–')} | ${x.entradas.length}${x.sinais ? ` + ${x.sinais.total} sinais` : ''} | ${x.saidas.length} (${x.mecanica.saidas_textuais.join(', ') || '—'}) | ${x.veredito.ramos.length} | ${cell(Object.values(x.cenario_padrao.saidas).map((s) => s.texto).join(' ; '))} | ${x.cenario_padrao.veredito.classe} (L${x.cenario_padrao.veredito.ramo_linha}) | **${x.comparacao_codigo.status === 'divergente' ? 'divergente' : x.comparacao_codigo.status}** |`);
  }
  o.push('');
  o.push('- **Status.** Os 6 estão portados, mas **divergentes**: todos têm o veredito parafraseado. Os detalhes estão nas fichas abaixo e em `divergencias`.');
  o.push('- **Pergunta.** Nenhum instrumento tem pergunta própria (`pergunta` = null). O `inst-intro` é instrução, e a pergunta de previsão fica para a camada Alexandria (P19).');
  o.push('- **Fonte dos números.** É null nos 6. Cada disclaimer declara o instrumento "Didático/ilustrativo".');
  o.push('- **Tolerâncias.** São null nos 6, porque nenhuma é declarada.');
  o.push('- **Invocação no texto.** Nenhuma frase de aula chama o instrumento. As ligações indiretas estão em `invocacoes_nota`.', '');

  for (const x of I.instrumentos) {
    const c = x.comparacao_codigo;
    const t = c.teste;
    o.push(`## ${x.id_fonte} — ${x.titulo}`, '');
    o.push(`- **Aula:** ${x.aula} (\`${x.aula_id_codigo}\`).`);
    o.push(`- **Posição:** L${x.posicao_no_texto.linhas.join('–')}, na §${x.posicao_no_texto.subsecao.numero} ${q(x.posicao_no_texto.subsecao.titulo)}. Fica depois de ${x.posicao_no_texto.depois_de.tipo} (L${x.posicao_no_texto.depois_de.linha_aprox}) e antes de ${x.posicao_no_texto.antes_de.tipo} ${q(x.posicao_no_texto.antes_de.rotulo)} (L${x.posicao_no_texto.antes_de.linha_aprox}).`);
    o.push(`- **Kind:** \`${x.mecanica.kind_catalogo_taxonomia}\`. O gráfico é ${x.mecanica.grafico} e não porta (§12).`);
    o.push(`- **Intro (literal, ${L(x.intro.origem)}):** ${q(x.intro.texto)}`);
    o.push(`- **Invocações:** ${x.invocacoes_nota}`, '');
    o.push('| Entrada | Rótulo | Unidade | Faixa | Passo | Padrão |', '|---|---|---|---|---|---|');
    for (const e of x.entradas) o.push(`| \`${e.id}\` | ${cell(e.rotulo)} | ${cell(e.unidade)} | ${e.min} a ${e.max} | ${e.passo} | ${e.padrao} |`);
    if (x.sinais) {
      o.push('', `**Sinais (${x.sinais.total} checkboxes, soma dos pesos ${x.sinais.soma_pesos}; padrão: ${x.sinais.padrao}; array \`SIG\` em L${x.sinais.origem.linha_aprox}):**`, '');
      o.push('| # | Peso | Título | Descrição |', '|---|---|---|---|');
      for (const s of x.sinais.itens) o.push(`| ${s.indice} | ${s.peso} | ${cell(s.titulo)} | ${cell(s.descricao)} |`);
    }
    o.push('', '| Saída | Rótulo | Textual | Atribuição (linha do script) | Padrão |', '|---|---|---|---|---|');
    for (const s of x.saidas) o.push(`| \`${s.id}\` | ${cell(s.rotulo)} | ${s.textual ? 'sim' : 'não'} | ${s.atribuicao_script.map((a) => `L${a.linha}`).join(', ')} | ${cell(x.cenario_padrao.saidas[s.id]?.texto)} |`);
    o.push('', `**Fórmulas:** ${x.formulas_script.map((f) => `L${f.linha}`).join(', ')}. O código exato está em \`formulas_script\`.`, '');
    o.push('**Ramos do veredito** (a expressão literal está em `veredito.ramos[].expressao_js`):', '');
    o.push('| # | Condição | Classe | Linha |', '|---|---|---|---|');
    for (const r of x.veredito.ramos) o.push(`| ${r.ordem} | \`${r.palavra}${r.condicao ? ` (${r.condicao})` : ''}\` | ${r.classe_css} | L${r.linha} |`);
    o.push('', `**Veredito no cenário-padrão (literal, calculado):** ${q(x.cenario_padrao.veredito.texto)}`, '');
    o.push(`**Disclaimer (${L(x.disclaimer.origem)}):** ${q(x.disclaimer.texto)}`, '');
    o.push('**Comparação com o código:**', '');
    o.push(`- **Status:** **${c.status}**. Título igual: ${c.titulo_igual}. Nota igual ao disclaimer: ${c.nota_igual_disclaimer}.`);
    o.push(`- **Campos divergentes:** ${c.campos_divergentes.length ? c.campos_divergentes.map((d) => `\`${d.campo}\` (${d.diferencas.join('; ')})`).join('; ') : 'nenhum'}.`);
    o.push(`- **Saídas:** extras no código: ${c.valores_extras_no_codigo.join(', ') || 'nenhuma'}. Textuais omitidas em \`valores\`: ${c.saidas_textuais_omitidas_em_valores.join(', ') || 'nenhuma'}.`);
    o.push(`- **Grade (${t.casos} casos):**`);
    o.push(`  - numérico como o painel semeia: ${t.numerico_como_o_painel_semeia.ok} ok / ${t.numerico_como_o_painel_semeia.falha} falhas;`);
    o.push(`  - numérico com os ids da fonte: ${t.numerico_com_ids_da_fonte.ok}/${t.numerico_com_ids_da_fonte.falha};`);
    o.push(`  - ramo do veredito: ${t.ramo_do_veredito.ok}/${t.ramo_do_veredito.falha};`);
    o.push(`  - veredito verbatim: ${t.veredito_verbatim};`);
    o.push(`  - ramos da fonte cobertos: ${t.ramos_fonte_cobertos}.`);
    o.push('');
  }

  o.push('## Divergências do grupo', '');
  o.push('| id | Tipo | Sev. | Tema | Nota |', '|---|---|---|---|---|');
  for (const d of I.divergencias) o.push(`| ${d.id} | ${d.tipo} | ${d.severidade ?? '—'} | ${cell(d.tema)} | ${cell(d.nota)} |`);
  o.push('');
  o.push('## Lacunas', '');
  o.push('- **Por instrumento:** pergunta, fonte dos números e tolerâncias são null nos 6 (P6, P19).');
  o.push('- **Constantes:** não têm procedência (div-m05-inst-08). O disclaimer do INST·04 diz literalmente que os pesos são arbitrários.');
  o.push('- **Invocação:** nenhuma aula tem frase que chame o instrumento. A posição é só a do markup.');
  o.push('- **Desenho:** SVG e barras não portam. Legendas e rótulos literais estão em `grafico`.');
  o.push('');
  o.push(...verifMd());
  fs.writeFileSync(path.join(OUTDIR, 'instrumentos.md'), o.join('\n'), 'utf8');
}

// ─────────────────────────── verificacao.json ────────────────────────
fs.writeFileSync(path.join(OUTDIR, 'verificacao.json'), JSON.stringify({
  gerado_em: M.gerado_em,
  verbatim_e_origem: { checks: V.checks, falhas: V.falhas, script: 'extratores/m05_verify.mjs' },
  cobertura_por_token_global: Object.fromEntries(Object.entries(V.cobertura).map(([k, v]) => [k, v.pct])),
  cobertura_por_token_estrita: Object.fromEntries(Object.entries(C).map(([k, v]) => [k, { pct: v.pct, tokens: v.tokens_fonte, escopo: v.escopo }])),
  nota: 'Global: saco único de tokens de todos os JSON (m05_verify.mjs). Estrita: saco por seção, só com nós cuja âncora de linha cai na seção (m05_cobertura_estrita.mjs). Nas aulas, mede só o markup do instrumento (o corpo da aula não é deste pacote).',
  instrumentos_grade: Object.fromEntries(I.instrumentos.map((x) => [x.id_fonte, { casos: x.comparacao_codigo.teste.casos, numerico_painel: `${x.comparacao_codigo.teste.numerico_como_o_painel_semeia.ok}/${x.comparacao_codigo.teste.casos}`, ramo: `${x.comparacao_codigo.teste.ramo_do_veredito.ok}/${x.comparacao_codigo.teste.casos}`, verbatim: x.comparacao_codigo.teste.veredito_verbatim }])),
  aparato_contagens: { quiz: A.avaliacao.perguntas.length, checklist: A.checklist_final.itens.length, exercicios: A.exercicios.itens.length, referencias: A.referencias.itens.length, termos: A.glossario.termos.length },
  verificacao_independente: VERIF_INDEP,
}, null, 2) + '\n', 'utf8');
console.log('ok: modulo.md, instrumentos.md, verificacao.json');
