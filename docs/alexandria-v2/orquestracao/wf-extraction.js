export const meta = {
  name: 'alexandria-v2-extraction-m02-m17',
  description: 'Verified source-layer extraction of the missing apparatus, instruments, glossary and exercises for modules 02–17',
  phases: [
    { title: 'Extract', detail: 'one extractor per module' },
    { title: 'Verify', detail: 'adversarial verbatim check per module' },
    { title: 'Index', detail: 'cross-module index and count reconciliation' },
  ],
}
const WT = 'C:/dev/gridalpha-v2-alexandria-v2-restructure'
const SRC = 'C:/dev/GridAlpha v2/Alexandria modulos'
const OUT = `${WT}/docs/alexandria-v2/extraction`
const MODS = ['02','03','04','05','06','07','08','09','10','11','12','13','14','15','16','17']

const COMMON = (m) => `
CONTEXTO: Alexandria v2 (currículo de energia da NIVAR). O HTML original é a ÚNICA fonte de aula, exercício e instrumento. Fonte deste módulo (SÓ LEITURA): ${SRC}/alexandria_modulo${m}.html. Protocolo: ${WT}/docs/alexandria/extraction-protocol.md e ${WT}/docs/alexandria/instrument-taxonomy.md (leia).
MODELO A SEGUIR: a extração verificada do M01 em ${OUT}/m01/ (README.md, modulo.json/.md, aparato.json/.md, aula-08.json/.md) e os extratores em ${OUT}/m01/extratores/ (reaproveite e adapte: os 17 HTMLs têm estrutura parecida, mas confirme no arquivo).
DECISÕES DO FOUNDER (leia): ${WT}/docs/alexandria-v2/decisoes/2026-09-16-ambiguidades-de-conteudo.md. A extração é a CAMADA FONTE: literal, com origem; contradições são registradas com as duas leituras e nunca resolvidas aqui; a camada Alexandria (P17–P24) é aplicada depois, no produto.
JÁ NO CÓDIGO (SÓ LEITURA, para comparar e não duplicar): ${WT}/src/lib/data/alexandria-modulo-${m}-content.ts, alexandria-curriculo.ts, alexandria-trilhas.ts, alexandria-glossario.ts, alexandria-instrument-calculators.ts, alexandria-badges.ts${m === '08' ? ', alexandria-modulo-08-fatos.ts' : ''}. Catálogo canônico: C:/dev/GridAlpha v2/docs/catalogo-modulos-alexandria.md.
REGRAS: texto verbatim (espaços/entidades HTML tolerados), origem {seletor, trecho_inicial, linha_aprox}; ausência declarada (null + nota), nunca preenchida; nada parafraseado em campo de conteúdo. Escreva só em ${OUT}/m${m}/ (crie) — inclusive os extratores em ${OUT}/m${m}/extratores/. Não toque src/, public/, git.`

const TASK = (m) => `${COMMON(m)}

TAREFA — MÓDULO ${m}. Produza em ${OUT}/m${m}/:
1) modulo.json + modulo.md: identidade (título/subtítulo literais; compare com o catálogo canônico — P24), horas, "Resultado esperado"/capacidades, perguntas do mapa (§ MAP), roteiro com títulos e contagem de aulas (compare com o código — P8), critérios literais (marque orais/cronometrados — P14), laboratórios (§ Lab), voz/princípios, erros comuns, Tradutor/§ Map se houver.
2) aparato.json + aparato.md: caso (Operação A ou outro; texto e dados literais; perguntas/decisão se existirem, senão null — P17), quiz/avaliação (todas as questões, alternativas, gabarito, explicações, faixas/mensagens do script — P18), checklist final (itens literais), índice de exercícios (tag, aula vinculada, enunciado, resposta de referência, critério; marque os sem aula — P9), referências (título, instituição, domínio/URL como estão, data se houver), glossário do módulo (TODOS os termos com definição literal; compare com alexandria-glossario.ts e liste os que faltam no código).
3) instrumentos.json + instrumentos.md: TODOS os instrumentos do módulo (INST·NN e instrumentos de módulo): título, pergunta, entradas (rótulo, unidade, faixa, padrão), saídas (fórmula exata do script), cenário-padrão, textos de leitura/ramos, fonte dos números (ou null), tolerâncias (só se declaradas), aula e ponto do texto onde é invocado. Compare com o que já está portado no código e marque "portado" / "não portado" / "divergente".
4) Registre divergências (fonte × fonte; fonte × código; fonte × catálogo) e lacunas.
Contagens por item (aulas, instrumentos, termos, exercícios, itens de checklist, questões do quiz).`

const EXT_OUT = { type: 'object', properties: { module: { type: 'string' }, files: { type: 'array', items: { type: 'string' } }, counts: { type: 'object' }, divergences: { type: 'array', items: { type: 'string' } }, gaps: { type: 'array', items: { type: 'string' } } }, required: ['module', 'files', 'counts', 'divergences', 'gaps'] }
const VER_OUT = { type: 'object', properties: { module: { type: 'string' }, checked: { type: 'number' }, corrections: { type: 'array', items: { type: 'string' } }, missing: { type: 'array', items: { type: 'string' } }, verdict: { type: 'string', enum: ['ok', 'corrigido', 'refazer'] } }, required: ['module', 'checked', 'corrections', 'missing', 'verdict'] }

phase('Extract')
// Lotes de 3 módulos: a execução anterior estourou o limite de uso com 16 em paralelo.
const results = []
for (let i = 0; i < MODS.length; i += 3) results.push(...await pipeline(
  MODS.slice(i, i + 3),
  (m) => agent(TASK(m), { label: `extract:m${m}`, phase: 'Extract', schema: EXT_OUT, effort: 'high' }),
  (ext, m) => ext && agent(`Você é um VERIFICADOR adversarial de extração. ${COMMON(m)}
Arquivos extraídos: ${JSON.stringify(ext.files)}. Contagens declaradas: ${JSON.stringify(ext.counts)}.
Confira contra a fonte: (1) cada texto de conteúdo é verbatim (amostre no mínimo 60 itens espalhados por todos os grupos, e 100% das questões do quiz, dos itens do checklist e das fórmulas de instrumento); (2) origens corretas (±3 linhas); (3) CONTAGENS: recalcule cada contagem direto no HTML com seu próprio método e compare; (4) nada do escopo ficou de fora (busque ativamente os marcadores); (5) nenhuma divergência inventada. Corrija DIRETAMENTE os arquivos quando o erro for inequívoco e registre cada correção numa seção "Verificação" nos .md. Se a extração estiver estruturalmente errada, devolva verdict "refazer" com o motivo.`, { label: `verify:m${m}`, phase: 'Verify', schema: VER_OUT, effort: 'high' }).then((v) => ({ m, ext, ver: v })),
))
const redo = results.filter((r) => r && r.ver && r.ver.verdict === 'refazer')
if (redo.length) log(`refazer: ${redo.map((r) => r.m).join(', ')}`)
const redone = await parallel(redo.map((r) => () => agent(`${TASK(r.m)}\n\nATENÇÃO: uma extração anterior deste módulo foi reprovada pelo verificador: ${JSON.stringify(r.ver)}. Refaça corrigindo a causa, sobrescrevendo os arquivos.`, { label: `redo:m${r.m}`, phase: 'Verify', schema: EXT_OUT, effort: 'high' })))

phase('Index')
const index = await agent(`Escreva ${OUT}/README.md (português do Brasil): índice da extração da camada fonte dos 17 módulos (inclua m01 já existente em ${OUT}/m01/). Tabela por módulo: arquivos, contagens (aulas, instrumentos, termos, exercícios, itens de checklist, questões de quiz), veredito da verificação, instrumentos não portados, termos ausentes do código, principais divergências. Reconcilie os totais com os do preflight (${WT}/docs/alexandria-v2/preflight.md: 141 aulas, 165 instrumentos, 2.124 termos, 313 seções, 214 exercícios, 423 itens de checklist) e explique diferenças. Liste as contradições que precisam de CONTENT QA (P20) e as ocorrências de marca antiga (P24) por módulo. Não edite outros arquivos. Leia os .md de cada módulo para isso. Resultados: ${JSON.stringify({ results, redone }, null, 1).slice(0, 60000)}`, { label: 'index', phase: 'Index', effort: 'high' })
return { results, redone, index }