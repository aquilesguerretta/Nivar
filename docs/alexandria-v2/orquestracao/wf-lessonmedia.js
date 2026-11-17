export const meta = {
  name: 'alexandria-v2-lesson-media',
  description: 'Read all 141 lessons and curate/produce complementary images (real licensed first, engraved explanations or Blender otherwise) with verification',
  phases: [
    { title: 'Curate', detail: 'one curator per module: read lessons, plan, source/generate' },
    { title: 'Verify', detail: 'license + technical accuracy + removal test per module' },
    { title: 'Index', detail: 'cross-module index and contact sheets' },
  ],
}
const WT = 'C:/dev/gridalpha-v2-alexandria-v2-restructure'
const LAB = `${WT}/docs/alexandria-v2/media-lab/aulas`
const SRC = 'C:/dev/GridAlpha v2/Alexandria modulos'
const REAIS = `${WT}/docs/alexandria-v2/media-lab/fontes-reais`
const HF = 'mcp__1bd778ac-f4ca-47cf-b235-8be5dc610f70__'
const MODS = ['01','02','03','04','05','06','07','08','09','10','11','12','13','14','15','16','17']

const COMMON = (m) => `
CONTEXTO: Alexandria v2, o currículo de energia da NIVAR, redesenhado como "atlas vivo do conhecimento em energia". O Founder pediu: "leia cada aula com calma e, se for necessário, coloque boas imagens para complementar o texto, reais ou geradas; quero que tudo fique sensacional". Ele comprou créditos Higgsfield para isso (não economize na qualidade, mas não gere o que não ajuda).
LEIA ANTES: ${LAB}/ESTILO.md (guia comum OBRIGATÓRIO: quando pôr imagem, ordem de preferência, estilo da casa, formato do plano), ${WT}/docs/alexandria-v2/bar.md §7 (M1–M7) e §4 (C3, C4, C6), ${WT}/docs/alexandria-v2/decisoes/2026-09-16-ambiguidades-de-conteudo.md (P10, P19–P24).
AULAS DO MÓDULO ${m}: o corpo está em ${WT}/src/lib/data/alexandria-modulo-${m}-content.ts (export MODULO_${m}_CORPO[aulaId] = blocos; MODULO_${m}_AULAS com títulos; MODULO_${m}_LEAD). Fonte original para contexto: ${SRC}/alexandria_modulo${m}.html (SÓ LEITURA). Leia CADA aula inteira, com calma.
IMAGENS REAIS JÁ APROVADAS: ${REAIS}/CATALOGO.md (+ provenance.json e verificacao.json de cada frente; ${REAIS}/aula-m01-a08/ tem as imagens para a M01·A08). Reuse antes de buscar.
BUSCA DE IMAGENS REAIS: só arquivos confiáveis (Wikimedia Commons via API com -A "AlexandriaV2-media/1.0 (aquilesguerretta@gmail.com)", Agência Brasil só conteúdo próprio, NASA/USGS, Library of Congress, Rijksmuseum, Wellcome, Europeana aberta); licença lida na página (PD, CC0, CC BY, CC BY-SA); baixe só imagens (curl), nunca execute nada; sem marca d'água, sem pessoa identificável em primeiro plano, sem logotipo dominante (recorte se preciso e registre).
HIGGSFIELD: ToolSearch "select:${HF}models_explore,${HF}generate_image,${HF}generate_image_batch,${HF}jobs_wait,${HF}balance,${HF}media_upload,${HF}media_confirm,${HF}upscale_image". Consulte o catálogo, justifique o modelo, get_cost antes, use_unlim:false, prefira generate_image_batch + jobs_wait. Nunca texto dentro da imagem. Referência de gasto: ~80 créditos por módulo (pode passar em imagens de alto valor; registre balance antes/depois e o gasto em ${LAB}/m${m}/creditos.json). Outras sessões gastam na mesma conta em paralelo: registre só os seus jobs.
BLENDER (se precisar de geometria exata): python ${WT}/docs/alexandria-v2/media-lab/_ferramentas/gpu_lock.py -- "C:/Program Files/Blender Foundation/Blender 5.2/blender.exe" -b --factory-startup -P <script.py> -- <args> (Cycles/OptiX; após read_factory_settings configure prefs.compute_device_type='OPTIX' e ligue os devices). Scripts ficam em ${LAB}/m${m}/blender/.
Imagens: abra com Read e OLHE. Processamento com Python PIL. Trabalhe só em ${LAB}/m${m}/ (crie). Não toque src/, public/, git.`

const CUR = (m) => `${COMMON(m)}

TAREFA — CURADORIA DE IMAGENS DO MÓDULO ${m}.
Para cada aula: (1) leia inteira; escreva "o_que_ensina" (1–2 frases); (2) decida onde uma imagem melhora o entendimento (teste de remoção; trabalho nomeado; âncora = aulaId + bloco_indice + trecho inicial do bloco que a imagem explica); (3) para cada colocação, escolha o caminho (real > explicação gravada/Blender > gerada fotográfica com aviso) e PRODUZA o asset: busque/baixe ou gere e itere até ficar excelente e tecnicamente correto (olhe com zoom; rejeite qualquer erro técnico); (4) escreva legenda proposta (factual para documental; nunca nomeie lugar real em imagem gerada), alt, crédito, classe e aviso_visivel.
${m === '01' ? 'ATENÇÃO M01: é o primeiro módulo a ser redesenhado (Peças C1/C2). Capriche especialmente na Aula 08 (capacidade instalada e fator de capacidade: 100 MW solar ≠ 100 MW térmica), aproveitando as imagens reais já aprovadas em fontes-reais/aula-m01-a08/, e nas aulas de conceitos físicos (energia × potência, corrente, tensão, fator de potência, fatura).' : ''}
Entregue ${LAB}/m${m}/plano.json (todas as aulas, inclusive as sem imagem, com motivo), provenance.json, creditos.json, os arquivos web + originais/ e contato.jpg (miniaturas numeradas com o id da colocação).`

const CUR_OUT = { type: 'object', properties: { module: { type: 'string' }, aulas: { type: 'number' }, aulasComImagem: { type: 'number' }, colocacoesAceitas: { type: 'number' }, reais: { type: 'number' }, geradas: { type: 'number' }, blender: { type: 'number' }, credits: { type: 'string' }, destaques: { type: 'array', items: { type: 'string' } }, riscos: { type: 'array', items: { type: 'string' } } }, required: ['module', 'aulas', 'aulasComImagem', 'colocacoesAceitas', 'credits', 'riscos'] }
const VER_OUT = { type: 'object', properties: { module: { type: 'string' }, checked: { type: 'number' }, rejected: { type: 'array', items: { type: 'string' } }, fixed: { type: 'array', items: { type: 'string' } }, verdict: { type: 'string', enum: ['ok', 'corrigido', 'refazer'] }, notes: { type: 'string' } }, required: ['module', 'checked', 'rejected', 'fixed', 'verdict'] }

phase('Curate')
// Lotes de 3 módulos: a execução anterior estourou o limite de uso com 16 em paralelo.
const results = []
for (let i = 0; i < MODS.length; i += 3) results.push(...await pipeline(
  MODS.slice(i, i + 3),
  (m) => agent(CUR(m), { label: `curate:m${m}`, phase: 'Curate', schema: CUR_OUT, effort: 'high' }),
  (cur, m) => cur && agent(`Você é o VERIFICADOR independente da curadoria de imagens do módulo ${m}. ${COMMON(m)}
Abra ${LAB}/m${m}/plano.json e provenance.json e OLHE cada imagem aceita. Para cada uma verifique, presumindo reprovação se não conseguir confirmar:
(1) REAIS: licença na página da fonte (API Commons/extmetadata ou página da instituição), autor, SHA-1/dimensões do original, descrição factual e crédito; sem marca d'água/pessoa/logotipo dominante.
(2) GERADAS/BLENDER: correção técnica e física do que está desenhado (compare com o texto da aula e com conhecimento de engenharia elétrica/energia); lista de rejeição do ESTILO.md; nenhum texto/letra/número na imagem; não parece foto de lugar real sem aviso; coerência com o estilo da casa.
(3) Teste de remoção: a imagem ensina algo que o texto sozinho não mostra? Âncora correta (o bloco citado existe e é o que a imagem explica)?
(4) Legenda e classe honestas; aviso_visivel correto (P10).
Marque status "rejeitada" (com motivo em notas) no plano para o que falhar, corrija legendas/créditos/âncoras erradas diretamente, e registre tudo numa seção "verificacao" dentro do plano.json. Não gere imagens novas.`, { label: `verify:m${m}`, phase: 'Verify', schema: VER_OUT, effort: 'high' }).then((v) => ({ m, cur, ver: v })),
))

phase('Index')
const index = await agent(`Escreva ${LAB}/README.md (português do Brasil): índice da curadoria de imagens das 141 aulas. Por módulo: aulas, aulas com imagem, colocações aceitas/rejeitadas, reais × geradas × Blender, créditos gastos, destaques e riscos; totais; lista das aulas-chave onde a imagem muda a compreensão; pendências de revisão factual (todas pendentes); e instruções para a Peça C consumir os plano.json (âncora por aulaId + bloco_indice). Monte também ${LAB}/destaques.jpg com as ~24 melhores imagens (miniaturas numeradas, legenda curta abaixo de cada uma). Leia os plano.json de cada módulo. Não edite outros arquivos. Resultados: ${JSON.stringify(results, null, 1).slice(0, 50000)}`, { label: 'index', phase: 'Index', effort: 'high' })
return { results, index }