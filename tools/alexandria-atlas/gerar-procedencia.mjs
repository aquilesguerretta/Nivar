// Escreve docs/alexandria-v3/atlas/procedencia.md a partir do manifesto das
// fontes (manifesto-fontes.json) e do índice dos dados gerados (indice.json).
// O documento nunca é editado à mão: se um arquivo mudar, roda-se de novo.
//
//   node tools/alexandria-atlas/gerar-procedencia.mjs

import { readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const AQUI = dirname(fileURLToPath(import.meta.url));
const RAIZ = join(AQUI, '..', '..');
const manifesto = JSON.parse(await readFile(join(AQUI, 'manifesto-fontes.json'), 'utf8'));
const indice = JSON.parse(await readFile(join(RAIZ, 'public', 'alexandria', 'atlas', 'dados', 'indice.json'), 'utf8'));

const nf = new Intl.NumberFormat('pt-BR');
const dataBr = (iso) => iso.slice(0, 10).split('-').reverse().join('/');
const kb = (b) => `${nf.format(Math.round(b / 1024))} KB`;
const c = indice.camadas;
const s = indice.series;

// ── comércio exterior: arquivo montado por tools/alexandria-atlas/comercio/ (agente dados-comercio);
// a seção lê o próprio arquivo publicado (fontes, notas, conferência) e o hash dele, se existir
const DADOS = join(RAIZ, 'public', 'alexandria', 'atlas', 'dados');
const comercio = await (async () => {
  try {
    const { createHash } = await import('node:crypto');
    const ler = async (n) => {
      const t = await readFile(join(DADOS, n), 'utf8');
      return { n, texto: t, bytes: Buffer.byteLength(t), sha256: createHash('sha256').update(t).digest('hex') };
    };
    const principal = await ler('comercio-2025.json');
    const extras = [];
    try {
      extras.push(await ler('comercio-rotas-licenca.json'));
    } catch {
      /* sem arquivo de licença */
    }
    return { j: JSON.parse(principal.texto), arquivos: [principal, ...extras] };
  } catch {
    return null;
  }
})();

function secaoComercio() {
  const brutoDoComercio = Object.keys(manifesto).filter((k) => k.startsWith('comercio-'));
  if (!comercio) return '### 9. Comércio exterior\n\nNão publicado nesta árvore (`public/alexandria/atlas/dados/comercio-2025.json` ausente).';
  const { j, arquivos } = comercio;
  const fontes = Object.values(j.fontes ?? {});
  const linhaF = (f) => `| ${f.orgao ?? '—'} | ${f.conjunto ?? '—'} | \`${f.endereco ?? '—'}\` | ${f.acesso ? dataBr(f.acesso) : '—'} | ${f.licenca ?? 'não declarada no arquivo'} |`;
  const conf = j.conferencia?.linhas ?? [];
  return `### 9. Comércio exterior de energia (${j.ano ?? '—'}) — Comex Stat, ONS, ANP; rotas esquemáticas

- **Arquivos publicados:** ${arquivos.map((a) => `\`public/alexandria/atlas/dados/${a.n}\` (${kb(a.bytes)}, SHA-256 \`${a.sha256.slice(0, 16)}\`)`).join('; ')}. Montados por \`tools/alexandria-atlas/comercio/\` (não por \`construir.mjs\`); esta seção lê os blocos \`fontes\`, \`leia\` e \`conferencia\` do próprio arquivo.

| órgão | conjunto | endereço | acesso | licença |
| --- | --- | --- | --- | --- |
${fontes.map(linhaF).join('\n')}

${fontes.filter((f) => f.sha256 || f.avisoDeModificacao || f.origemDaRede || f.portoes).map((f) => `- **${f.orgao}, ${f.conjunto}:** ${[f.sha256 ? `SHA-256 do arquivo usado \`${f.sha256}\`` : null, f.repositorio ? `repositório <${f.repositorio}>` : null, f.origemDaRede, f.avisoDeModificacao, f.grade ? `Grade: ${f.grade}` : null, f.ilhas ? `Ilhas: ${f.ilhas}` : null, f.escolhasDeModelo ? `Escolhas de modelo: ${f.escolhasDeModelo}` : null, f.destino ? `Destino: ${f.destino}` : null, f.contorno ? `Contorno: ${f.contorno}` : null, ...(f.portoes ?? []).map((g) => `Portão ${g.nome}: ${g.fonte}`), f.semPortao].filter(Boolean).join('. ')}`).join('\n')}
- **Como ler:**
${(j.leia ?? []).map((x) => `  - ${x}`).join('\n')}
- **Rotas que dão a volta por falta de portão:** ${Object.entries(j.rotas ?? {}).filter(([, r]) => r?.contorno).map(([k]) => `\`${k}\``).join(', ') || 'nenhuma'}.
- **Horas do ONS na eletricidade:** ${Object.entries(j.eletricidade?.paises ?? {}).map(([a3, p]) => `${p.nome ?? a3} ${nf.format(p.horas ?? 0)} de ${nf.format(j.eletricidade?.horasDoAno ?? 0)} horas`).join('; ')}. ${j.eletricidade?.horasNota ?? ''}
- **Conferência contra fonte independente** (${j.conferencia?.nota ?? ''}):
${conf.map((x) => `  - ${x.item}: Comex ${nf.format(x.comex)}, referência ${nf.format(x.referencia)} ${x.unidade ?? ''} (${x.fonteReferencia}); diferença ${nf.format(x.diferencaPct)}%.`).join('\n')}
- **Hash do bruto:** ${
    brutoDoComercio.length
      ? `os ${brutoDoComercio.length} arquivos baixados para o comércio estão no \`manifesto-fontes.json\` sob o prefixo \`comercio-\` (o prefixo evita que entrem nas séries anuais do ONS e nas camadas da ANP, que são lidas por prefixo). O corpo de cada consulta ao Comex Stat está no campo \`forma\` da entrada.

| id | órgão | conjunto | acesso | bytes | SHA-256 do arquivo guardado no bruto |
| --- | --- | --- | --- | ---: | --- |
${brutoDoComercio.map((id) => `| \`${id}\` | ${manifesto[id].orgao} | ${manifesto[id].conjunto} | ${dataBr(manifesto[id].acesso)} | ${nf.format(manifesto[id].bytes)} | \`${manifesto[id].sha256}\` |`).join('\n')}`
      : 'o manifesto não tem entradas do comércio (prefixo `comercio-`); vale o hash dos arquivos publicados acima e o das fontes que o próprio arquivo registra.'
  }`;
}

// ── um dia real (geração por usina hora a hora): arquivo montado por tools/alexandria-atlas/operacao/
// (agente dados-operacao); a seção lê o próprio arquivo (regra dos dias, fontes, leia, conferência)
async function secaoOperacao() {
  let t;
  try {
    t = await readFile(join(DADOS, 'operacao-dias.json'), 'utf8');
  } catch {
    return '### 9b. Um dia real\n\nNão publicado nesta árvore (`public/alexandria/atlas/dados/operacao-dias.json` ausente).';
  }
  const { createHash } = await import('node:crypto');
  const j = JSON.parse(t);
  const ids = Object.keys(manifesto).filter((k) => k.startsWith('operacao-'));
  const pct = (x) => `${nf.format(x)}%`;
  const linhaDia = (d) => {
    const c = d.conferencia;
    const subs = j.subsistemas.map((sb) => `${sb} ${pct(c.porSubsistema[sb].difPct)}`).join(', ');
    return `| ${dataBr(d.dia)} | ${d.razao} | ${subs}; Sudeste somando a Itaipu 50 Hz ${pct(c.itaipu50.seSomando50Hz.difPct)} | ${nf.format(c.comPonto.entidades)} entidades, ${pct(c.comPonto.pct)} | ${pct(c.semPonto.pct)} (previsão ${nf.format(c.semPonto.previsaoMWh)} MWh) | ${nf.format(d.corte.entidades.n)} |`;
  };
  return `### 9b. Um dia real: geração por usina hora a hora e corte eólico e solar — ONS

- **Arquivo publicado:** \`public/alexandria/atlas/dados/operacao-dias.json\` (${kb(Buffer.byteLength(t))}, SHA-256 \`${createHash('sha256').update(t).digest('hex').slice(0, 16)}\`), montado por \`tools/alexandria-atlas/operacao/\` (não por \`construir.mjs\`); esta seção lê os blocos \`regraDosDias\`, \`fontes\`, \`leia\` e \`conferencia\` do próprio arquivo. ${nf.format(j.entidades.n)} entidades (usina com CEG casado pelo núcleo com o cadastro da ANEEL, ou conjunto do ONS no centro dos membros que o Atlas posiciona), ${j.dias.length} dias.
- **Regra dos dias:** ${j.regraDosDias}
- **Unidade e hora:** ${j.unidade}. ${j.horario}

| órgão | conjunto | endereço | acesso | licença |
| --- | --- | --- | --- | --- |
${j.fontes.map((f) => `| ${f.orgao} | ${f.conjunto} | \`${f.endereco}\` | ${dataBr(f.acesso)} | ${f.licenca} |`).join('\n')}

- **Como ler:**
${j.leia.map((x) => `  - ${x}`).join('\n')}
- **Definições:** ${Object.entries(j.definicoes).map(([k, v]) => `\`${k}\`: ${v}`).join(' ')}
- **Conferência por dia** (gravada no arquivo; ${j.dias[0].conferencia.nota}):

| dia | por quê | publicado × balanço do ONS | com ponto no mapa | sem ponto | entidades com corte |
| --- | --- | --- | --- | --- | ---: |
${j.dias.map(linhaDia).join('\n')}

- **Itaipu:** as linhas PRIT60 (60 Hz, setor brasileiro) e PYIT50 (50 Hz, setor paraguaio) são duas entidades; a de 50 Hz não entra na soma do Brasil. ${j.dias[0].conferencia.itaipu50.leitura}
${j.notas?.subsistema ? `- **Subsistema:** ${j.notas.subsistema} ${j.dias
    .filter((d) => d.conferencia.subsistemaDoArquivoDoMes)
    .map((d) => {
      const s = d.conferencia.subsistemaDoArquivoDoMes;
      return `Em ${dataBr(d.dia)}: ${s.entidades.map((e) => `${e.id} (arquivo do mês ${e.noArquivoDoMes}, usado ${e.usado})`).join(', ')}; com o do arquivo do mês, ${j.subsistemas.map((sb) => `${sb} ${pct(s.porSubsistemaSeFosseOArquivoDoMes[sb])}`).join(', ')}.`;
    })
    .join(' ')}\n` : ''}${j.notas?.membrosDaEntidade ? `- **Membros dos conjuntos:** ${j.notas.membrosDaEntidade} Conjuntos com composição própria em algum dia: ${[...new Set(j.dias.flatMap((d) => Object.keys(d.membrosNoDia ?? {}).map((i) => j.entidades.id[i])))].join(', ') || 'nenhum'}.\n` : ''}${j.notas?.cegEmLinhas ? `- **Uma usina, várias linhas:** ${j.notas.cegEmLinhas} Linhas assim: ${j.entidades.id.filter((_, i) => j.entidades.cegEmLinhas?.[i]).join(', ')}.\n` : ''}- **Hash do bruto:** ${
    ids.length
      ? `os ${ids.length} arquivos baixados estão no \`manifesto-fontes.json\` sob o prefixo \`operacao-\` (o prefixo evita que entrem nas séries anuais do ONS, lidas por prefixo).

${cabecalho}
${ids.map(linhaFonte).join('\n')}`
      : 'o manifesto não tem entradas `operacao-`; vale o bloco `bruto` do próprio arquivo publicado.'
  }`;
}

const linhaFonte = (id) => {
  const m = manifesto[id];
  return `| \`${id}\` | ${m.orgao} | ${m.conjunto} | ${dataBr(m.acesso)} | ${nf.format(m.bytes)} | \`${m.sha256}\` |`;
};
const cabecalho = '| id | órgão | conjunto | acesso | bytes | SHA-256 do arquivo guardado no bruto |\n| --- | --- | --- | --- | ---: | --- |';
const lista = (xs) => xs.join(', ');
const parcial = (p) => (p ? `o último mês (${p.mes}) está incompleto na fonte, que vai até ${dataBr(p.ultimoDia)}` : 'o último mês está completo na fonte');

const grupo = (prefixo) => Object.keys(manifesto).filter((k) => k.startsWith(prefixo)).sort();
const resumoSerie = (prefixo, rotulo) => {
  const ids = grupo(prefixo);
  const bytes = ids.reduce((a, k) => a + manifesto[k].bytes, 0);
  const acessos = ids.map((k) => manifesto[k].acesso).sort();
  return `| ${rotulo} | ${ids.length} arquivos anuais (${ids[0].slice(-4)}–${ids.at(-1).slice(-4)}) | ${dataBr(acessos[0])} | ${nf.format(bytes)} | um hash por arquivo no manifesto |`;
};

// ── ANP: lista de camadas do GetCapabilities guardado no bruto (se houver) ──
const capasAnp = await (async () => {
  const m = manifesto['anp-wfs-capacidades'];
  if (!m) return [];
  try {
    const x = await readFile(join(RAIZ, m.arquivo), 'utf8');
    return x
      .split(/<FeatureType[ >]/)
      .slice(1)
      .map((f) => ({ nome: (f.match(/<Name>([^<]*)<\/Name>/) || [])[1], titulo: (f.match(/<Title>([^<]*)<\/Title>/) || [])[1] }));
  } catch {
    return [];
  }
})();
const anpCamadasNoServico = capasAnp.length ? nf.format(capasAnp.length) : 'não contadas (bruto ausente)';

function secaoAnp() {
  const k = indice.combustivel;
  if (!k) return '### 6. Gás e petróleo — ANP\n\nNão gerado nesta rodada (rode `baixar.mjs anp` e `construir.mjs`).';
  const ids = Object.keys(manifesto).filter((x) => x.startsWith('anp-'));
  const nfd = (n) => nf.format(Math.round(n * 10) / 10);
  const g = k.gasodutos;
  const r = k.instalacoes.refino;
  const lin = (xs) => (xs.length ? xs.map((x) => `${x.camada}: ${x.item}${x.problema ? ` — ${x.problema}` : ''}`).join('; ') : 'nenhuma');
  return `### 6. Gás e petróleo — ANP · GeoServer

${cabecalho}
${ids.map(linhaFonte).join('\n')}

- **Serviço:** \`https://gishub.anp.gov.br/geoserver/ows\` (WFS 2.0, GeoServer). Página de dados abertos: <${manifesto['anp-gasodutos-transporte'].pagina}>
- **Forma do acesso:** ${manifesto['anp-gasodutos-transporte'].forma}.
- **Licença:** ${k.licenca} O rodapé do portal gov.br da ANP declara CC BY-ND 3.0 para "o conteúdo deste site"; isso não foi estendido aos dados do geoserviço.
- **Data do dado:** nenhuma camada traz campo de data de referência e o serviço não informa data de atualização: vale a data da consulta (${dataBr(k.acesso)}).
- **Gasodutos de transporte:** ${nf.format(g.trechos)} trechos de ${nf.format(g.dutos)} dutos; ${nfd(g.kmDeclarado)} km pela extensão que a ANP declara em cada trecho e ${nfd(g.kmTraco)} km medidos no traçado da fonte. Traçado **simplificado** por Douglas-Peucker com tolerância de ${String(g.toleranciaGraus).replace('.', ',')}° (≈ 11 m, abaixo de 1 pixel no zoom 11): de ${nf.format(g.verticesNaFonte)} para ${nf.format(g.verticesNoMapa)} vértices. ${g.nota} → ${arq('combustivel-gasodutos.geojson')}.
- **Instalações:** ${Object.entries(k.instalacoes.porTipo).map(([t, n]) => `${n} ${{ refinaria: 'refinarias (inclui a unidade de xisto)', gnl: 'terminais de GNL', upgn: 'unidades de processamento de gás natural (UPGN e UPCGN)', terminal: 'terminais de combustíveis líquidos' }[t] ?? t}`).join(', ')} → ${arq('combustivel-instalacoes.geojson')}. Capacidade de refino somada: ${nf.format(r.bpdTotal)} bbl/d (${nf.format(r.m3dTotal)} m³/d) em ${r.refinarias - r.semCapacidadeNaFonte.length} refinarias; sem capacidade na fonte: ${lista(r.semCapacidadeNaFonte)}. ${r.nota} ${k.instalacoes.gnl.nota}
- **Campos de produção:** ${nf.format(k.campos.total)} polígonos, simplificados com tolerância de ${String(k.campos.toleranciaGraus).replace('.', ',')}° (de ${nf.format(k.campos.verticesNaFonte)} para ${nf.format(k.campos.verticesNoMapa)} vértices) → ${arq('combustivel-campos.geojson')}.
- **Blocos exploratórios sob contrato:** ${nf.format(k.blocos.total)} polígonos, tolerância de ${String(k.blocos.toleranciaGraus).replace('.', ',')}° (de ${nf.format(k.blocos.verticesNaFonte)} para ${nf.format(k.blocos.verticesNoMapa)} vértices) → ${arq('combustivel-blocos.geojson')}.
- **Bacias sedimentares:** ${nf.format(k.baciasSedimentares.total)} polígonos, tolerância de ${String(k.baciasSedimentares.toleranciaGraus).replace('.', ',')}° (de ${nf.format(k.baciasSedimentares.verticesNaFonte)} para ${nf.format(k.baciasSedimentares.verticesNoMapa)} vértices) → ${arq('combustivel-bacias.geojson')}.
- **Polígono do pré-sal:** ${k.presal.total} polígono de ${k.presal.vertices} vértices, sem simplificação → ${arq('combustivel-presal.geojson')}.
- **Repetições na fonte:** ${lin(k.repetidas)}.
- **Incoerências detectadas no build:** ${lin(k.incoerencias)}.
- **Fora do Brasil e da ZEE (marcado \`fora: true\`, não corrigido):** ${lista(k.foraDoBrasilOuZee) || 'nenhum'}.
- **Datas ilegíveis na fonte (publicadas como nulas):** ${k.datasIlegiveis.map((d) => `"${d}"`).join(', ') || 'nenhuma'}.
- **Ausências declaradas:**
${k.ausencias.map((a) => `  - ${a}`).join('\n')}
- **Camadas do serviço** (${anpCamadasNoServico}, do GetCapabilities guardado): ${capasAnp.map((c) => `\`${c.nome}\``).join(', ')}.`;
}

const arq = (nome) => `\`public/alexandria/atlas/dados/${nome}\` (${kb(indice.arquivos[nome].bytes)})`;

// ── precisão da coordenada (campo prec) ──
function secaoPrecisao() {
  const p = c.usinas.precisaoDaCoordenada;
  if (!p) return '';
  const dist = (o) => [4, 3, 2, 1, 0].map((k) => `${k === 4 ? '4 ou mais' : k}: ${nf.format(o[k] ?? 0)}`).join(' · ');
  const contar = (xs) => xs.reduce((o, x) => ((o[x] = (o[x] || 0) + 1), o), {});
  return `#### Precisão da coordenada (campo \`prec\`)

- **O que é:** em cada usina, subestação e instalação da ANP, o número de casas decimais **significativas** da coordenada como a fonte bruta a traz, antes do arredondamento a 4 casas: o zero final não conta (o SIGA escreve 8 casas fixas) e o resíduo de ponto flutuante abaixo da 10ª casa é descartado; vale a pior das duas coordenadas; 4 quer dizer "4 ou mais". O erro da posição é meia unidade da última casa (4 casas ≈ 5,6 m; 3 ≈ 56 m; 2 ≈ 555 m; 1 ≈ 5,6 km). É o que a regra das maquetes lê para saber se a posição sustenta uma maquete; antes, ela lia o texto do número já arredondado, e o zero final derrubava usina precisa.
- **Usinas (todas as fases), casas → registros:** ${dist(p.porCasas)}. Só as em operação: ${dist(p.emOperacaoPorCasas)}.
- **Subestações:** ${dist(c.subestacoes.precisaoPorCasas ?? {})}.
- **Instalações da ANP:** ${dist(indice.combustivel?.instalacoes?.precisaoPorCasas ?? {})}.`;
}

// ── rumo das barragens (ANA · SNIRH) ──
function secaoRumo() {
  const r = c.usinas.rumoDasBarragens;
  if (!r) return '';
  const m = manifesto['ana-massas-dagua-hidro'];
  const t = (k) => r.porTipo[k] ?? { total: 0, comRumo: 0, semPoligonoA1km: 0, poligonoDeOutroNome: 0, reprovadasNoTeste: 0, posicaoAConfirmar: 0 };
  const linha = (k) => { const x = t(k); return `| ${k} | ${nf.format(x.total)} | ${nf.format(x.comRumo)} | ${nf.format(x.semPoligonoA1km)} | ${nf.format(x.poligonoDeOutroNome)} | ${nf.format(x.reprovadasNoTeste)} | ${nf.format(x.posicaoAConfirmar)} |`; };
  return `#### Rumo das barragens — ANA · SNIRH (campo \`rumoB\`)

${cabecalho}
${linhaFonte('ana-massas-dagua-hidro')}

- **Serviço:** \`${m.url}\`. Ficha de metadados do conjunto: <${m.pagina}>.
- **Forma do acesso:** ${m.forma}. ${m.nota}
- **Licença:** ${m.licenca}
- **Para que serve:** o cadastro não diz para onde a barragem está virada. Onde a ANA mapeou o reservatório com o nome da usina, a borda do polígono junto ao ponto do cadastro dá o eixo da crista e o lado com água dá o montante. ${r.significado}
- **Critério (o teste da água):** ${r.criterio}. Sem rumo derivado, a maquete segue a convenção leste–oeste, e a ficha diz qual das duas regras vale. Nenhum rumo foi medido a olho na foto de satélite.
- **Cobertura** (UHE e PCH em operação, com coordenada; ${nf.format(r.poligonosNaFonte)} polígonos de UHE, PCH e CGH na fonte):

| Tipo | Em operação | Com rumo da ANA | Sem polígono a 1 km | Polígono de outro nome | Reprovadas no teste | Posição a confirmar |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
${linha('UHE')}
${linha('PCH')}

- **Passaram no teste, mas ficam na convenção pela coordenada imprecisa na fonte** (menos de 3 casas significativas): ${[...t('UHE').coordenadaImprecisa ?? [], ...t('PCH').coordenadaImprecisa ?? []].join(', ') || 'nenhuma'}.
- **Com rumo (rumoB = rumo do montante; entre parênteses, o eixo da crista):** ${r.comRumo.map((x) => `${x.nome} ${x.rumoB}° (${x.rumoDaCrista}°)`).join('; ')}.
- **Limites:** ${r.nota}`;
}

// ── etapas da potência por unidade geradora do ONS (coluna `etapas` das usinas) ──
function etapasTexto() {
  const e = c.usinas.etapasPorUnidade;
  if (!e) return '- **Potência ao longo dos anos:** sem etapas por unidade neste índice; cada usina entra inteira no ano do SIGA.';
  const mw = (kw) => `${nf.format(Math.round(kw / 100) / 10)} MW`;
  const conf = e.conferencia
    .filter((x) => !x.ausente)
    .map((x) => {
      const p = [];
      for (let i = 0; i < x.etapas.length; i += 2) p.push(`${x.etapas[i]}: ${mw(x.etapas[i + 1])}`);
      return `${x.nome} (SIGA: ${x.anoSiga ?? 'sem ano'}) — ${p.join(', ')}`;
    });
  return `- **Potência ao longo dos anos (coluna \`${e.campo}\`):** ${nf.format(e.usinas)} usinas em operação (${nf.format(e.gw)} GW) têm a potência datada por unidade geradora; ${nf.format(e.comMaisDeUmAno)} delas (${nf.format(e.gwComMaisDeUmAno)} GW) cresceram em mais de um ano, e em ${nf.format(e.primeiroAnoDiferenteDoSiga)} o ano da primeira unidade difere do ano do SIGA. ${nf.format(e.emOperacaoSemEtapas)} usinas do mapa em operação não têm etapas. Regra: ${e.regra} Formato: ${e.formato}. Em ${nf.format(e.divergenciaAcimaDe5PorCento.usinas)} usinas a soma das unidades do ONS difere da ANEEL em mais de 5% (${lista(e.divergenciaAcimaDe5PorCento.exemplos.slice(0, 5).map((x) => `${x.nome}, ANEEL ${mw(x.kwAneel)} e ONS ${mw(x.kwOns)}`))}). Conferência contra o bruto: ${conf.join('; ')}.`;
}

// ── submercados do Atlas (Roraima no Norte) ──
function secaoSubmercados() {
  const sm = c.submercados;
  if (!sm) return '';
  const cf = sm.conferencias;
  const a = cf.areaKm2;
  return `### 8. Submercados — IBGE, com Roraima no Norte pelo cadastro do ONS

| id | órgão | conjunto | acesso | bytes | SHA-256 do arquivo guardado no bruto |
| --- | --- | --- | --- | ---: | --- |
${linhaFonte('ibge-rr-uf-2024')}

- **Arquivo do Atlas:** ${arq(sm.arquivo)}, construído por \`construir.mjs\` (\`montarSubmercados\`) a partir de dois arquivos do Portal BR que **não são alterados**: \`public/br/submercados.geojson\` e \`public/br/brasil-outline.geojson\`, ambos da API de malhas do IBGE em qualidade mínima. Mesmas propriedades do arquivo do Portal (\`id\`, \`nome\`, \`sigla\`, \`ufsIbge\`); o Norte passa a listar ${sm.ufsIbge.norte.join(', ')}.
- **Por que:** ${sm.nota}
- **Operação:** no anel principal do Norte, o trecho entre os tríplices ${cf.tripliceParaRoraimaGuiana.coordenada} (Pará, Roraima e Guiana) e ${cf.tripliceAmazonasRoraimaVenezuela.coordenada} (Amazonas, Roraima e Venezuela) — a divisa de Roraima com o Pará e o Amazonas, ${cf.verticesTrocados.divisaRetirada} vértices — foi trocado pelo trecho do contorno do país entre os mesmos dois pontos (a fronteira internacional de Roraima, ${cf.verticesTrocados.fronteiraIncluida} vértices). Os dois tríplices existem, idênticos, nos dois arquivos. Nenhum vértice novo; o anel passa de ${nf.format(cf.verticesDoAnelDoNorte.antes)} para ${nf.format(cf.verticesDoAnelDoNorte.depois)} vértices.
- **Conferências que \`construir.mjs\` exige (senão para):** os dois tríplices presentes uma vez em cada anel; ${cf.autointersecoes} autointerseções no anel novo; o ganho de área (${nf.format(a.ganho)} km², ${cf.metodoDaArea}) a menos de 1% da área oficial de Roraima no IBGE (${nf.format(a.roraimaOficialIbge)} km², campo AREA_KM2 da malha 2024; desvio de ${nf.format(Math.round(a.desvioDoGanho * 10000) / 100)}%); as subestações de Roraima do cadastro do ONS (${cf.subestacoesDeRoraimaNoCadastroDoOns.map((x) => x.nome).join(', ')}) dentro do anel novo (e fora do antigo), todas no subsistema N; as ${cf.unidadesGeradorasDeRoraimaNoCadastroDoOns.unidades} unidades geradoras de Roraima no cadastro de capacidade, no subsistema N; uma só data de entrada em operação para as linhas de 500 kV de Roraima (${cf.linhasDe500kVDeRoraima.linhas.join('; ')}): ${dataBr(cf.linhasDe500kVDeRoraima.entradaEmOperacao)}.
- **Declarações oficiais consultadas:** ${sm.declaracoes.map((x) => `${x.orgao}, <${x.pagina}> (acesso em ${dataBr(x.acesso)}): ${x.diz}`).join('; ')}. As datas não coincidem: o MME dá o início da energização e o cadastro do ONS, a entrada em operação; o Atlas usa a do cadastro.
- **O que muda nos números:** nada nas séries (as do ONS já contam Roraima no Norte desde a interligação e não separam o estado). Na conferência de posição contra o estado declarado, as usinas e subestações de Roraima passam a cair no Norte (antes não caíam em submercado nenhum), menos algumas pequenas na faixa da fronteira com a Guiana, que o contorno de qualidade mínima deixa do lado de fora (sem acusação: só conta o ponto que cai DENTRO de outro submercado), e uma subestação declarada em outro estado mas posicionada em Roraima passou a ser acusada (seção 3).
- **Antes da interligação:** ${sm.roraimaAParte ? `o arquivo traz, fora de \`features\`, o membro \`roraimaAParte\` (o anel de Roraima e a geometria do Norte sem Roraima, a do Portal BR, sem vértice novo), para o mapa desenhar Roraima fora do Norte nos meses anteriores a ${sm.roraimaAParte.primeiroMesNoNorte.split('-').reverse().join('/')} e nos anos anteriores a ${sm.roraimaAParte.primeiroAnoNoNorte}. ${sm.roraimaAParte.nota}` : 'sem geometria à parte para Roraima neste índice.'}
- **Licença da área oficial:** ${manifesto['ibge-rr-uf-2024'].licenca}`;
}

// ── áreas de atuação das distribuidoras (ANEEL · BDGD · ARAT) ──
const dist = indice.distribuicao;
const semArat = dist && !dist.ausente ? dist.fora.semCamadaArat.map((x) => `${x.nome} (${x.codigo})`).join(', ') : 'CFLO, CNEE, EDEVP e EEB';

function secaoDistribuicao() {
  const d = dist;
  if (!d || d.ausente)
    return `### 7. Áreas de atuação das distribuidoras — ANEEL · BDGD\n\nNão publicado nesta árvore: \`public/alexandria/atlas/dados/distribuicao-areas.geojson\` ausente (gere com \`tools/alexandria-atlas/concessoes/\`).`;
  const m = manifesto['aneel-bdgd-arat'];
  const pct = (f) => `${nf.format(Math.round(f * 1000) / 10)}%`;
  return `### 7. Áreas de atuação das distribuidoras — ANEEL · BDGD (camada ARAT)

${cabecalho}
${linhaFonte('aneel-bdgd-arat')}

- **Fonte:** ${d.fonte.conjunto}. Hub de dados abertos da ANEEL no ArcGIS Online: <${d.fonte.pagina}>. Endereço de cada item: ${d.fonte.urls.replace(/^(\S+)/, '`$1`')}.
- **Forma do acesso:** ${m.forma}.
- **Licença:** ${d.fonte.licenca}
- **Data-base:** a BDGD mais recente de cada distribuidora: ${Object.entries(d.porDataBase).map(([k, n]) => `${n} com data-base ${dataBr(k)}`).join(' e ')} (campo \`dataBase\` de cada feição; as de 2023 são as únicas BDGD que a fonte tem dessas distribuidoras). Acesso em ${dataBr(d.fonte.acesso)}.
- **O que tem:** ${nf.format(d.total)} áreas de atuação, ${nf.format(d.concessionarias)} de concessionárias e ${nf.format(d.permissionarias)} de permissionárias, com código ANEEL, nome, tipo de outorga, número do contrato, \`COD_ID\` cru da ARAT, data-base e item do ArcGIS.
- **Método:** ${d.nota} Geometria Polygon/MultiPolygon em SIRGAS 2000, ${nf.format(d.vertices)} vértices no arquivo. O GeoJSON é montado por \`tools/alexandria-atlas/concessoes/\` (Python + GDAL; ver o README de lá); \`construir.mjs\` só o lê, confere e registra no índice.
- **Fora do arquivo (${d.fora.sucedidas.length + d.fora.semCamadaArat.length} códigos da BDGD):**
  - Sucedidas por fusão (BDGD antiga coberta em 85% ou mais por distribuidora de mesma outorga com BDGD mais nova): ${d.fora.sucedidas.map((x) => `${x.nome} (${x.codigo}, ${x.dataBase.slice(0, 4)}) → ${x.sucessora} (${x.por}), ${pct(x.fracao)}`).join('; ')}.
  - Sem camada ARAT (BDGD de 2016, Módulo 6; nenhuma tem BDGD posterior): ${semArat}. A sucessão delas é presumida, sem prova geométrica; nada delas é publicado.
- **Ausências declaradas:**
${d.ausencias.map((a) => `  - ${a}`).join('\n')}
- **Arquivo publicado:** ${arq(d.arquivo)}, SHA-256 \`${d.sha256}\`.`;
}

const textoDaOperacao = await secaoOperacao(); // dados-operacao

// todo arquivo da pasta publicada, com o hash calculado sobre o arquivo como está; para os de
// construir.mjs, confere contra o hash que o índice registrou (diferença derruba o script)
const arquivosPublicados = await (async () => {
  const { readdir } = await import('node:fs/promises');
  const { createHash } = await import('node:crypto');
  const quemGera = (n) =>
    indice.arquivos[n] ? '`construir.mjs`'
    : n === 'indice.json' ? '`construir.mjs` (o índice; não se lista a si mesmo)'
    : n.startsWith('comercio-') ? '`tools/alexandria-atlas/comercio/` (seção 9)'
    : n.startsWith('operacao-') ? '`tools/alexandria-atlas/operacao/` (seção 10)'
    : 'sem gerador registrado';
  const nomes = (await readdir(DADOS)).filter((n) => /\.(geo)?json$/.test(n)).sort();
  const out = [];
  for (const n of nomes) {
    const buf = await readFile(join(DADOS, n));
    const sha256 = createHash('sha256').update(buf).digest('hex').slice(0, 16);
    const reg = indice.arquivos[n];
    if (reg && reg.sha256 !== sha256) throw new Error(`${n}: o hash no disco (${sha256}) difere do índice (${reg.sha256}); rode construir.mjs antes`);
    out.push({ n, bytes: buf.length, sha256, quem: quemGera(n) });
  }
  const faltam = Object.keys(indice.arquivos).filter((n) => !nomes.includes(n));
  if (faltam.length) throw new Error(`arquivos do índice ausentes da pasta: ${faltam.join(', ')}`);
  return out;
})();
const md = `# Atlas da Alexandria v3 — procedência dos dados

> Documento **gerado** por \`tools/alexandria-atlas/gerar-procedencia.mjs\` em ${dataBr(indice.gerado)}, a
> partir de \`tools/alexandria-atlas/manifesto-fontes.json\` (o que foi baixado) e de
> \`public/alexandria/atlas/dados/indice.json\` (o que foi publicado). Não edite à mão.

Toda camada do Atlas vem de fonte primária oficial brasileira (ANEEL, ONS, ANP, IBGE, ANA e, no comércio exterior, MDIC/SECEX; o traçado esquemático das rotas marítimas é calculado sobre a terra do Natural Earth, de domínio público, seção 9), e cada uma tem aqui: a fonte, o
endereço, a data do acesso, a licença declarada, o hash do arquivo guardado (ver abaixo o caso do SINDAT) e o que foi feito com ele. Onde a fonte
não traz um dado, o mapa declara a ausência; nada foi estimado, interpolado ou completado.

## Como reproduzir

\`\`\`
node tools/alexandria-atlas/baixar.mjs --tudo      # baixa as fontes para tools/alexandria-atlas/bruto/ e regrava o manifesto
node tools/alexandria-atlas/construir.mjs          # gera public/alexandria/atlas/dados/
node tools/alexandria-atlas/gerar-procedencia.mjs  # regrava este documento
\`\`\`

O bruto (${nf.format(Object.keys(manifesto).length)} arquivos, cerca de 330 MB) **não está no git**: está em
\`tools/alexandria-atlas/bruto/\`, ignorado por um \`.gitignore\` local. O que prova a procedência é o manifesto, com o
SHA-256 de cada arquivo guardado no bruto. Para os arquivos do Portal de Dados Abertos do ONS e da ANEEL, é o hash dos
bytes exatamente como vieram do servidor. **Para as quatro camadas do SINDAT não é**: o serviço entrega páginas de até
1.000 feições, e o arquivo guardado é montado localmente por \`baixar.mjs\` (páginas concatenadas na ordem de
\`OBJECTID\`, mais um bloco \`_servico\` com o endereço, o total de feições, os sistemas de referência e os campos); o hash é
desse arquivo montado, e muda se a montagem mudar, mesmo com a fonte idêntica. Baixar de novo dá outro hash sempre que a
fonte tiver sido atualizada (o ONS atualiza os cadastros todos os dias); o manifesto registra o estado do dia do acesso.

## Acesso às fontes: o que foi medido em 15 e 16/11/2026

| Fonte | Endereço | Resultado medido |
| --- | --- | --- |
| ONS · SINDAT (serviço geográfico) | \`sig.ons.org.br/server/rest/services/SINDAT\` | Responde. Serviço ArcGIS público, sem token, com geometria real. |
| ONS · Dados Abertos | \`dados.ons.org.br\` (arquivos em \`ons-aws-prod-opendata.s3.amazonaws.com\`) | Responde. Licença CC-BY declarada em cada conjunto. |
| ANEEL · Dados Abertos (SIGA) | \`dadosabertos.aneel.gov.br\` | **Não conecta de fora do Brasil** (timeout de TCP). O arquivo usado é a captura íntegra do CSV oficial no Internet Archive. |
| ANEEL · SIGEL | \`sigel.aneel.gov.br\` | **Não conecta de fora do Brasil** (mesmo bloqueio). Não usado. |
| EPE · WebMap | \`gisepeprd2.epe.gov.br\` | **Fora do ar** ("Sistema em manutenção", HTTP 503). Não usado. |
| ANP · GeoServer | \`gishub.anp.gov.br/geoserver\` | Responde. WFS 2.0 público, sem token, ${anpCamadasNoServico} camadas no GetCapabilities (seção 6). |
| ANEEL · ArcGIS Online (BDGD) | \`www.arcgis.com/sharing/rest/content/items/<item>/data\` (organização \`J5unWNi0P2dwjI3y\`; Hub \`dadosabertos-aneel.opendata.arcgis.com\`) | Responde (HTTP 200, \`Accept-Ranges: bytes\`). 1.014 itens File Geodatabase da BDGD, de 114 códigos de distribuidora; a camada ARAT é lida por faixa HTTP (seção 7). Busca na organização por concessão, atuação, ARAT, distribuidoras ou permissionárias: 0 resultados; não existe Feature Service nacional de área de concessão. |
| IBGE · API de malhas e localidades | \`servicodados.ibge.gov.br\` | **Não conecta de fora do Brasil** (timeout de TCP; de novo em 16/11/2026). Não usado diretamente (os arquivos do Portal BR vieram dela em 26/07/2026). |
| IBGE · geoftp | \`geoftp.ibge.gov.br\` | Responde (medido em 16/11/2026). Usado só para a área oficial de Roraima, que confere a união de Roraima ao Norte (seção 8). |
| ANA · SNIRH (serviço geográfico) | \`www.snirh.gov.br/arcgis/rest/services\` | Responde (medido em 16/11/2026). ArcGIS público, sem token; a camada de massas d'água não pagina. Usado para o rumo das barragens (seção 1). O catálogo de metadados (\`metadados.snirh.gov.br\`) também responde. |

Medição das áreas de concessão, 15/11/2026 entre 19h10 e 19h30 UTC: o SIGEL (\`sigel.aneel.gov.br\`: \`/arcgis/rest/services\`,
\`/PORTAL/Downloads/FeatureServer\`, \`/server/rest/services\`, \`/portal/home/\`) e o CKAN da ANEEL (\`dadosabertos.aneel.gov.br\`,
\`package_search?q=concess\` e \`?q=BDGD\`) não responderam (conexão expirada em 21 s, sem código HTTP); o Internet Archive não
tem captura de \`PORTAL/Downloads/FeatureServer\`; o servidor da EPE (\`gisepeprd2.epe.gov.br/arcgis/rest/services\`) devolveu
HTTP 503, "Sistema em manutenção"; \`dados.gov.br/dados/api\` devolveu HTTP 401. A BDGD no ArcGIS Online foi o único caminho
oficial que respondeu.

Consequência: a rede de transmissão e as subestações vêm do ONS (SINDAT), e não da EPE/ANEEL como o brief previa. O
SINDAT é a base geográfica do próprio operador do sistema, então a troca não rebaixa a fonte. As camadas de gás e
petróleo vêm do GeoServer da ANP (seção 6); o que só a EPE publica (oleodutos, plano de expansão) **não entrou**. As áreas
de atuação das distribuidoras vêm da BDGD da ANEEL (seção 7), não do SIGEL.

## Camadas

### 1. Usinas — ANEEL · SIGA

${cabecalho}
${linhaFonte('aneel-siga')}
${linhaFonte('ons-capacidade-geracao')}

- **Página do conjunto:** <${manifesto['aneel-siga'].pagina}>
- **Endereço baixado:** \`${manifesto['aneel-siga'].url}\`
- **Licença:** ${manifesto['aneel-siga'].licenca}.
- **Data-base do cadastro:** ${dataBr(c.usinas.dataBase)} (coluna \`DatGeracaoConjuntoDados\` do próprio arquivo).
- **Observação de acesso:** ${manifesto['aneel-siga'].nota}
- **O que o cadastro tem:** ${nf.format(c.usinas.total)} empreendimentos; ${nf.format(c.usinas.emOperacao)} em operação, somando ${nf.format(c.usinas.gwEmOperacao)} GW de potência fiscalizada, e ${nf.format(c.usinas.naoOperam)} que ainda não operam (em construção ou só outorgadas).
- **Empreendimentos repetidos na fonte:** o arquivo tem ${nf.format(c.usinas.linhasNaFonte)} linhas; ${c.usinas.repetidasNaFonte.length} empreendimentos aparecem duas vezes, uma por tipo de outorga, iguais em todo o resto (${lista(c.usinas.repetidasNaFonte.map((x) => `${x.nome}, ${x.ceg}`))}). São contados e desenhados uma vez. Se um CEG repetido divergir em qualquer outro campo, \`construir.mjs\` para com erro em vez de escolher uma linha.
- **O que está no mapa:** ${nf.format(c.usinas.noMapa)} usinas, das quais ${nf.format(c.usinas.noMapa - c.usinas.naoOperamNoMapa)} em operação e ${nf.format(c.usinas.naoOperamNoMapa)} que ainda não operam. **As outras ${nf.format(c.usinas.semCoordenadaNaFonte)} não têm coordenada na fonte** (latitude e longitude zeradas) e ficam de fora; a interface diz isso na legenda.
- **Municípios:** como a fonte escreve, cada um com a própria UF ("Selvíria - MS, Ilha Solteira - SP"); usina em rio de divisa tem municípios de dois estados.
- **Transformação:** nenhuma sobre a posição além de arredondar a 4 casas (≈ 11 m). A fonte de geração do mapa é a do cadastro (\`DscOrigemCombustivel\`), com o fóssil aberto por \`DscFonteCombustivel\` em gás natural, carvão, petróleo e outros. A potência mostrada é a fiscalizada para usina em operação e a outorgada para a que ainda não opera.
- **Datas ausentes:** o SIGA grava 1900 (quase sempre 03/01/1900) em \`DatEntradaOperacao\` quando não tem a data; o Atlas lê esse ano como ausência. ${nf.format(c.usinas.emOperacaoSemDataNaFonte)} usinas do mapa em operação estão nesse caso; a ficha diz "sem data na fonte". Usina que ainda não opera nunca mostra data.
- **Posição incoerente na própria fonte:** em ${nf.format(c.usinas.posicaoIncoerenteComOEstado)} usinas a coordenada cai dentro de outro submercado que não o de nenhum estado dos municípios declarados, a mais de 0,25° da divisa (exemplos: ${c.usinas.exemplosDePosicaoIncoerente.slice(0, 3).map((x) => `${x.nome}, declarada em ${x.uf} e posicionada no ${x.caiEm}`).join('; ')}). O Atlas **não corrige**: desenha onde o cadastro diz e avisa na ficha.
- **Proprietário:** a ficha mostra o campo de proprietário e regime como o cadastro escreve.
- **Vínculo com o ONS:** ${nf.format(c.usinas.vinculadasAoOns)} usinas do mapa casam com a base de Capacidade Instalada do ONS pelo núcleo do CEG (o código de seis dígitos que as duas bases compartilham). Dessas a ficha traz modalidade de operação, subsistema e potência efetiva; das demais, a ficha diz "fora da base de capacidade do ONS". Unidades que o ONS marca fora dos quatro subsistemas não entram na soma da usina brasileira: ${lista(c.usinas.unidadesOnsForaDoSin.map((x) => `${x.usina}, ${x.unidades} unidades`)) || 'nenhuma'}.
${etapasTexto()}
- **Arquivos publicados:** ${arq('usinas-principais.json')} com as ${nf.format(c.usinas.principais)} usinas a partir de ${c.usinas.limiarKw / 1000} MW, carregado de saída; ${arq('usinas-menores.json')} com as ${nf.format(c.usinas.menores)} menores, carregado só quando o zoom pede ou quando alguém busca.

Cada par de colunas descreve a mesma população: "no cadastro" conta também as usinas sem coordenada; "no mapa" só as desenhadas. A camada de cada fonte desenha só as que operam; as demais ficam na camada de usinas em construção ou só outorgadas.

| Fonte | Usinas no cadastro (todas as fases) | No mapa (todas as fases) | Em operação no cadastro | GW em operação no cadastro | Em operação no mapa | GW em operação no mapa |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
${Object.entries(c.usinas.porCategoria).map(([k, v]) => `| ${k} | ${nf.format(v.usinas)} | ${nf.format(v.noMapa)} | ${nf.format(v.emOperacao)} | ${nf.format(v.gwOperacao)} | ${nf.format(v.noMapaEmOperacao)} | ${nf.format(v.gwOperacaoNoMapa)} |`).join('\n')}

${secaoPrecisao()}

${secaoRumo()}

### 2. Linhas de transmissão — ONS · SINDAT

${cabecalho}
${linhaFonte('sindat-linhas')}
${linhaFonte('sindat-linhas-cc')}

- **Serviço:** \`${manifesto['sindat-linhas'].url}\` (corrente alternada) e \`${manifesto['sindat-linhas-cc'].url}\` (corrente contínua). Página: <${manifesto['sindat-linhas'].pagina}>
- **Forma do acesso:** ${manifesto['sindat-linhas'].forma}.
- **Licença:** ${manifesto['sindat-linhas'].licenca}
- **O que tem:** ${nf.format(c.linhas.alternada)} linhas de corrente alternada e ${nf.format(c.linhas.continua)} circuitos de corrente contínua (contagem por identificador), em ${nf.format(c.linhas.trechos)} feições desenhadas: o ONS entrega ${nf.format(c.linhas.trechos - c.linhas.total)} linhas em duas feições com o mesmo identificador (em algumas as duas geometrias diferem; o Atlas desenha as duas e conta a linha uma vez). ${nf.format(c.linhas.kmEmOperacao)} km em operação pelo campo de comprimento da fonte, contado uma vez por linha.
- **Linhas sem entrada em operação:** ${nf.format(c.linhas.previstas)} não têm data de entrada em operação na fonte; o mapa as desenha tracejadas, numa camada à parte, desligada de saída. **${nf.format(c.linhas.previstasComPrevisaoVencida)} delas têm previsão registrada para um ano que já passou**: o cadastro não diz se já operam, e o Atlas não afirma que não operam. ${nf.format(c.linhas.previstasComPrevisaoSentinela)} trazem previsão em 2090 ou depois (2099), marcador de "sem previsão": o Atlas publica a previsão como ausente.
- **Data de carga do cadastro:** nos ativos antigos o SINDAT registra, no lugar da data de entrada em operação, a data em que a base foi carregada: o mesmo dia em centenas de instalações (${lista(c.linhas.datasDeCargaDoCadastro.map(dataBr))}; critério: dia repetido em 50 ou mais linhas e subestações). ${nf.format(c.linhas.emOperacaoComDataDeCarga)} linhas em operação estão nesse caso. O Atlas as trata como em operação, mas não publica esse ano como ano de entrada (\`op\` nulo, \`opAntesDe\` com o ano da carga); a ficha diz que o cadastro registra a data de carga da base, não a de entrada. Outros dias repetidos em poucas instalações não foram tratados como data de carga.
- **Traçado:** é o do ONS, **generalizado na origem** (média de 14 vértices por linha). Serve para a escala do país e do estado; não mostra cada torre. Nenhum vértice foi acrescentado ou movido; só o arredondamento a 4 casas.
- **Por tensão (kV), todas as linhas, por identificador:** ${Object.entries(c.linhas.porTensao).map(([k, v]) => `${k}: ${v}`).join(' · ')}.
- **Por tensão (kV), só em operação:** ${Object.entries(c.linhas.porTensaoEmOperacao).map(([k, v]) => `${k}: ${v}`).join(' · ')}.
- **Arquivo publicado:** ${arq('rede-linhas.geojson')}.

### 3. Subestações — ONS · SINDAT e Dados Abertos

${cabecalho}
${linhaFonte('sindat-subestacoes')}
${linhaFonte('ons-subestacao')}

- **O que está no mapa:** ${nf.format(c.subestacoes.total)} subestações: ${nf.format(c.subestacoes.doMapaSindat)} do mapa do SINDAT e ${nf.format(c.subestacoes.soNoCadastro)} que só existem no cadastro de Dados Abertos.
- **Posição:** a do SINDAT. **Tensão e subsistema:** do cadastro, quando o identificador casa.
- **Ausências declaradas:** ${nf.format(c.subestacoes.total - c.subestacoes.comTensao)} subestações não têm tensão no cadastro (a ficha diz "tensão não informada na fonte"); ${nf.format(c.subestacoes.foraPorFaltaDeNome)} pontos do SINDAT sem nome nem identificador e ${nf.format(c.subestacoes.foraPorFaltaDeCoordenada)} linhas do cadastro sem coordenada ficaram fora.
- **Situação:** das ${nf.format(c.subestacoes.doMapaSindat)} do SINDAT, ${nf.format(c.subestacoes.emOperacao)} têm data de entrada em operação e ${nf.format(c.subestacoes.previstas)} não têm (previstas; ${nf.format(c.subestacoes.previstasComPrevisaoSentinela)} delas com previsão em 2090 ou depois, publicada como ausente). As ${nf.format(c.subestacoes.soNoCadastro)} que só existem no cadastro de Dados Abertos não têm situação na fonte.
- **Data de carga do cadastro:** ${nf.format(c.subestacoes.emOperacaoComDataDeCarga)} subestações em operação trazem como data de entrada a data de carga da base (${lista(c.linhas.datasDeCargaDoCadastro.map(dataBr))}); o Atlas não publica esse ano como ano de entrada, pelo mesmo critério das linhas.
- **Repetições na fonte:** o SINDAT devolve ${nf.format(c.subestacoes.repetidasNaFonte)} pontos a mais com identificador já visto (${lista(c.subestacoes.idsRepetidosNaFonte)}); fica o primeiro ponto de cada uma.
- **Divergência entre as duas bases do ONS:** em ${nf.format(c.subestacoes.posicaoDivergenteEntreAsDuasBases)} subestações a posição difere em mais de 0,05° (≈ 5 km). O mapa usa a do SINDAT. A divergência não foi resolvida, só registrada.
- **Posição incoerente com o estado:** em ${nf.format(c.subestacoes.posicaoIncoerenteComOEstado)} subestações a coordenada cai em outro submercado que não o do estado declarado, a mais de 0,25° da divisa (${lista(c.subestacoes.exemplosDePosicaoIncoerente.map((x) => `${x.nome}, declarada em ${x.uf} e posicionada no ${x.caiEm}`))}). Mesmo critério das usinas; não corrigido. A conferência é por submercado: conflito entre estados do mesmo submercado não é detectado.
- **Arquivo publicado:** ${arq('rede-subestacoes.geojson')}.

### 4. Reservatórios e bacias — ONS · Dados Abertos

${cabecalho}
${linhaFonte('ons-reservatorio')}
${linhaFonte('ons-bacia_contorno')}

- **Reservatórios:** ${nf.format(c.reservatorios.noMapa)} no mapa, ${nf.format(c.reservatorios.comRegularizacao)} com volume útil. O cadastro tem ${nf.format(c.reservatorios.total)} linhas porque traz uma por usina, e ${c.reservatorios.repetidosPorUsina.length} reservatórios atendem mais de uma (${lista(c.reservatorios.repetidosPorUsina.map((x) => x.usinas.join(' e ')))}): são ${nf.format(c.reservatorios.distintos)} reservatórios, um ponto cada, com as usinas juntas na ficha; nenhum ficou de fora (${nf.format(c.reservatorios.semCoordenadaNaFonte)} sem coordenada). Posição, rio, bacia, reservatório equivalente e volumes vêm do cadastro.
- **Bacias:** ${nf.format(c.bacias.total)} contornos do shapefile do ONS (data do arquivo: 31/01/2023). **Simplificado** por Douglas-Peucker com tolerância de ${String(c.bacias.toleranciaGraus).replace('.', ',')}° (≈ 2 km): de ${nf.format(c.bacias.verticesNaFonte)} para ${nf.format(c.bacias.verticesNoMapa)} vértices. É a única geometria do Atlas que foi simplificada aqui.
- **Licença:** ${manifesto['ons-reservatorio'].licenca}.
- **Arquivos publicados:** ${arq('agua-reservatorios.geojson')} e ${arq('agua-bacias.geojson')}.

### 5. Séries — ONS · Dados Abertos

| Série | Arquivos | Acesso | Bytes | Hash |
| --- | --- | --- | ---: | --- |
${resumoSerie('ons-ear-subsistema', 'EAR Diário por Subsistema')}
${resumoSerie('ons-ear-reservatorio', 'EAR Diário por Reservatório')}
${resumoSerie('ons-intercambio', 'Intercâmbios entre Subsistemas')}
${resumoSerie('ons-balanco', 'Balanço de Energia nos Subsistemas')}

- **Licença:** Creative Commons Atribuição (CC-BY), declarada no portal.
- **Anos das séries:** os que o manifesto registra (o que foi baixado); \`construir.mjs\` para se faltar um ano no meio ou se o arquivo de um ano já fechado não chegar a 31/12.
- **Energia armazenada (capítulo "A água"):** de ${s.ear.de} a ${s.ear.ate}; ${parcial(s.ear.mesCorrenteParcial)}. O valor de cada mês é o do **último dia** (é variável de estoque), em % da energia armazenável máxima. A fonte traz série própria de ${nf.format(s.earReservatorios.reservatorios)} reservatórios: ${nf.format(s.earReservatorios.noMapa)} estão no mapa; ${s.earReservatorios.semCadastro.length ? `${s.earReservatorios.semCadastro.length} (${lista(s.earReservatorios.semCadastro.map((x) => x.n))}) não estão no cadastro de reservatórios e por isso não têm ponto no mapa (a série fica no arquivo, sem tela que a mostre)` : 'nenhuma série fica sem ponto'}. Os demais reservatórios do mapa são a fio d'água ou não têm série na fonte. → ${arq('serie-ear-subsistema.json')}, ${arq('serie-ear-reservatorios.json')}.
- **Intercâmbio (capítulo "As trocas"):** saldo líquido mensal por elo (Norte–Nordeste, Norte–Sudeste, Nordeste–Sudeste, Sudeste–Sul), em MW médios. **A fonte tem dois formatos.** Até 2025, cada elo vem num sentido fixo, com sinal. Em 2026, cada hora vem uma vez por elo, rotulada pelo sentido em que a energia foi, sempre positiva, e há uma coluna nova de intercâmbio programado (não usada). Nos dois casos o Atlas soma com sinal no sentido de referência e divide pelas horas do mês com registro. Conferido em 10/08/2026 às 14h: Nordeste→Norte + Nordeste→Sudeste = 11.824,9 MW, igual ao intercâmbio do Nordeste no balanço da mesma hora. Par fora dos quatro elos, ou o mesmo elo duas vezes na mesma hora, faz \`construir.mjs\` parar. Série de ${s.intercambio.de} a ${s.intercambio.ate}; ${parcial(s.intercambio.mesCorrenteParcial)} (último registro: ${s.intercambio.ultimoInstante}), e a média desse mês é das horas publicadas até então. → ${arq('serie-intercambio.json')}.
- **Balanço (capítulo "Um dia"):** perfil horário médio de geração por fonte e de carga em cada subsistema, nos doze últimos meses completos (${s.balanco.perfilHorario[0]} a ${s.balanco.perfilHorario.at(-1)}), decididos pelo último registro da fonte (${s.balanco.ultimoInstante}). A fonte reúne todas as térmicas numa série só. Na média mensal, ${parcial(s.balanco.mesCorrenteParcial)}. → ${arq('serie-perfil-horario.json')}, ${arq('serie-balanco-mensal.json')}.
- **Horas sem dado no balanço:** a fonte traz linhas de preenchimento (carga vazia ou zero, geração "0E-8") em ${nf.format(s.balanco.horasSemDadoNaFonte.reduce((a, x) => a + x.horas, 0))} horas-subsistema, em ${new Set(s.balanco.horasSemDadoNaFonte.map((x) => x.mes)).size} meses (${lista([...new Set(s.balanco.horasSemDadoNaFonte.map((x) => x.mes))])}): dias inteiros e as horas de virada do horário de verão. Não são horas medidas: saem da média, e o índice lista quantas por mês e subsistema.
- **As setas do capítulo "As trocas" são um esquema**, não geografia: ligam o centroide (calculado do polígono) de um subsistema ao de outro. A interface diz isso.

${secaoAnp()}

${secaoDistribuicao()}

${secaoSubmercados()}

${secaoComercio()}

${textoDaOperacao}

### 10. O que já existia e o Atlas só lê

| Camada | Arquivo | Fonte |
| --- | --- | --- |
| Submercados e contorno do país (Portal BR) | \`public/br/submercados.geojson\`, \`public/br/brasil-outline.geojson\` | IBGE, API de malhas territoriais v3, qualidade mínima (arquivos do Portal Brasil da NIVAR, Wave 2; no do Portal, Roraima não está em submercado nenhum). O Atlas não os altera: lê os dois para montar o próprio \`submercados.geojson\`, com Roraima no Norte (seção 8). |
| Fronteiras dos países | \`public/alexandria/geo/world-110m.json\` | Natural Earth 1:110m (TopoJSON \`world-atlas@2.0.2\`, MD5 registrado em \`src/lib/atlas/worldApi.ts\`). |
| Perfil energético dos países | \`/api/atlas/world\` (API da NIVAR) | Our World in Data, 188 países, fonte citada por campo no perfil. |
| Base cartográfica | tiles do Mapbox | Mapbox Streets v8, Terrain-DEM v1 e Satellite; © Mapbox © OpenStreetMap. Só desenho de fundo: relevo, água, divisas, nomes de lugar e foto de satélite. |

## O que não entrou, e por quê

| O que | Por quê |
| --- | --- |
| Oleodutos, gasodutos de escoamento e de distribuição, city gates, estações de compressão | O GeoServer da ANP não tem essas camadas (GetCapabilities de 15/11/2026); o WebMap da EPE estava fora do ar no dia do acesso. |
| Área de atuação de ${semArat} | A BDGD dessas distribuidoras é de 2016 e não tem camada ARAT; nenhuma tem BDGD posterior (seção 7). As demais áreas de atuação entraram. |
| Geração distribuída (telhado) | O cadastro usado é o de usinas outorgadas ou registradas (SIGA); a GD tem base própria, na ANEEL. |
| Linhas e subestações de distribuição | O SINDAT cobre a Rede de Operação (transmissão). |
| Sistemas isolados como camada | Não há camada oficial acessível; as termelétricas a óleo e diesel da Amazônia aparecem na camada de usinas. |
| Traçado exato (torre a torre) das linhas | A fonte acessível é generalizada. O traçado detalhado é da EPE/ANEEL. |

## Arquivos publicados

| Arquivo | Tamanho | SHA-256 (16 primeiros) | Gerado por |
| --- | ---: | --- | --- |
${arquivosPublicados.map(({ n, bytes, sha256, quem }) => `| \`${n}\` | ${kb(bytes)} | \`${sha256}\` | ${quem} |`).join('\n')}

Os tamanhos são do arquivo sem compressão; o servidor entrega com gzip ou brotli. A tabela lista TODO arquivo da pasta
\`public/alexandria/atlas/dados/\` no momento em que este documento foi gerado: os de \`construir.mjs\` com o hash que o
índice registra; os demais (o próprio índice, o comércio e a operação) com o hash calculado aqui, sobre o arquivo como está.
`;

await writeFile(join(RAIZ, 'docs', 'alexandria-v3', 'atlas', 'procedencia.md'), md);
console.log(`procedencia.md gravado (${md.length} caracteres, ${Object.keys(manifesto).length} fontes no manifesto)`);
