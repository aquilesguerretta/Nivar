// Extrator deterministico do grupo "modulo" do M14 -> modulo.json
import fs from 'node:fs';
import {
  FONTE, ROOT, html, find, findAll, kids, sel, inner, texto, inline, ht, origem, line, secao, blocos,
  hasCls, readRepo, write, pad, HOJE, CATALOGO, cobertura, semInstrumento, lineOf,
} from './m14_lib.mjs';

// ------------------------------------------------------------ identidade
const hero = find(ROOT, sel('div', 'hero'));
const titleTag = find(ROOT, sel('title'));
const kicker = find(hero, sel('div', 'kicker'));
const h1 = find(hero, sel('h1'));
const sub = find(hero, sel('p', 'sub'));
const pills = findAll(hero, sel('span', 'pill')).map((p, i) => {
  const b = find(p, sel('b'));
  return { id: `m14-hero-pill-${pad(i + 1)}`, html: inline(inner(p)), texto: texto(inner(p)), valor_destacado: b ? texto(inner(b)) : null, origem: origem('div.hero span.pill', p) };
});
const footer = find(ROOT, sel('footer'));
const rodapeLinhas = findAll(footer, (n) => n.tag === 'div' && !hasCls(n, 'wrap')).map((d) => ({ classe: d.attrs.class || null, texto: texto(inner(d)), linha_aprox: line(d) }));

const blocksTS = readRepo('src/lib/data/alexandria-blocks.ts');
const b14 = blocksTS.split('\n').find((l) => l.includes("id: 'bloco-14'"));
const catalogo = fs.readFileSync(CATALOGO, 'utf8');
const catHead = catalogo.split('\n').findIndex((l) => l.startsWith('## Módulo 14'));
const catSecao = catalogo.split('\n').slice(catHead, catalogo.split('\n').findIndex((l, i) => i > catHead && l.startsWith('## Módulo 15')));

const tese = secao('tese');
const teseBlocos = blocos(tese.wrap, 'm14-tese', 'section#tese');
const nivel3 = teseBlocos.find((b) => b.tipo === 'paragrafo' && b.texto.includes('Nível 3'));

const identidade = {
  id: 'm14-identidade',
  tipo: 'identidade',
  title_tag: { texto: texto(inner(titleTag)), origem: origem('head > title', titleTag) },
  eyebrow: { ...ht(kicker), origem: origem('div.hero div.kicker', kicker) },
  titulo: { ...ht(h1), origem: origem('div.hero h1', h1) },
  subtitulo: { ...ht(sub), origem: origem('div.hero p.sub', sub) },
  meta_pills: pills,
  horas: {
    texto: null, min: null, max: null,
    nota: 'A fonte não declara carga horária em lugar nenhum (busca por "hora" só devolve prosa de conteúdo). O único dado de duração é o pill "roteiro oral 8 min" (§Voz). alexandria-blocks.ts traz estimatedHoursMin: 2 / estimatedHoursMax: 2 para bloco-14, sem origem neste HTML (ver div-m14-horas).',
  },
  eixos: null,
  eixos_nota: 'A fonte não rotula eixos. Ela declara "três lentes" (§00.2, ver tese, bloco do tipo "cadeia") e a regra de leitura "o ano-safra, a rota, e o produto concorrente" (hero e §00). Nenhuma das duas é chamada de eixo; "muda de eixo" (§00 lede) é figura de linguagem.',
  trilha_declarada: [
    { onde: 'footer (rodapé)', texto: rodapeLinhas.find((l) => l.texto.startsWith('Trilha'))?.texto ?? null, linha_aprox: rodapeLinhas.find((l) => l.texto.startsWith('Trilha'))?.linha_aprox ?? null },
    { onde: '§00.3 (tese), parágrafo', trecho: nivel3 ? nivel3.texto.slice(nivel3.texto.indexOf('A hipótese'), nivel3.texto.indexOf('Nível 3') + 7) : null, linha_aprox: nivel3?.origem.linha_aprox ?? null },
  ],
  rodape: { html: findAll(footer, (n) => n.tag === 'div' && !hasCls(n, 'wrap')).map((d) => inline(inner(d))), linhas: rodapeLinhas, origem: origem('footer', footer) },
  verificacao_declarada: { texto: pills.find((p) => p.texto.startsWith('verificado'))?.texto ?? null, nota: 'Mesma data aparece por extenso no rodapé e nos callouts "Números vivos" e "Data de verificação e limites deste ativo" (2 de agosto de 2026).' },
  codigo_e_catalogo: {
    alexandria_blocks_linha: b14 ? b14.trim() : null,
    catalogo_canonico_titulo: catSecao[0] ?? null,
    catalogo_canonico_escala: (() => { const i = catSecao.findIndex((l) => l.startsWith('**Escala**')); return i < 0 ? null : catSecao.slice(i, i + 3).join(' '); })(),
    titulo_h1_igual_catalogo: catSecao[0]?.includes(texto(inner(h1))) ?? false,
    titulo_h1_igual_blocks: b14 ? b14.includes(`'${texto(inner(h1))}'`) : false,
    nota_P24: 'O título do h1, do <title> e dos dois catálogos coincide ("Biocombustíveis e Bioenergia"). O subtítulo (p.sub) é candidato a descritor editorial (P24), nunca a segundo título. Eyebrow e rodapé trazem a marca GridAlpha (div-m14-marca).',
  },
};

// ------------------------------------------------------------------ tese
const teseObj = {
  id: 'm14-tese', tipo: 'tese-secao-00',
  nota: 'Seção § 00 completa, bloco a bloco, na ordem da fonte. Contém a espinha dorsal, as três lentes (§00.2), a declaração de que o critério é construído (§00.3), a regra de nomeação em três estados (§00.4) e as fronteiras (§00.5). Os callouts "Onde isso entra no produto" ficam registrados, mas pelo P7 não vão para a interface.',
  blocos: teseBlocos,
  subsecoes: teseBlocos.filter((b) => b.tipo === 'titulo' && b.nivel === 'h3').map((b) => ({ numero: b.numero, titulo: b.titulo_sem_numero, linha_aprox: b.origem.linha_aprox })),
  lentes: teseBlocos.find((b) => b.tipo === 'cadeia')?.itens.map((x) => ({ rotulo: x.rotulo, texto: x.texto, linha_aprox: x.linha_aprox })) ?? null,
  origem: origem('section#tese', tese.s, 'Tese'),
};

// ---------------------------------------------------------------- mapa
const map = secao('map');
const mapBlocos = blocos(map.wrap, 'm14-map', 'section#map');
const mapLead = mapBlocos.find((b) => b.tipo === 'lead');
const leadNode = find(map.wrap, sel('p', 'lede'));
const cinco = findAll(leadNode, sel('b')).map((b) => texto(inner(b)));
const camadas = mapBlocos.find((b) => b.tipo === 'tabela');
const grade = mapBlocos.find((b) => b.tipo === 'grade_de_aulas');
const mapa = {
  id: 'm14-mapa', tipo: 'mapa-secao-MAP',
  blocos: mapBlocos,
  pergunta_em_cinco_partes: {
    partes_em_negrito: cinco,
    frase: mapLead.texto.slice(0, mapLead.texto.indexOf('Quem responde')).trim(),
    origem: mapLead.origem,
  },
  perguntas_por_camada: camadas.linhas_texto.map((r, i) => ({ id: `m14-map-camada-${pad(i + 1)}`, camada: r[0], pergunta_central: r[1], evidencia_minima: r[2], falha_caracteristica: r[3], html: camadas.linhas[i] })),
  camadas_origem: camadas.origem,
  aulas: grade.itens.map((c) => ({
    id: `m14-map-aula-${c.numero.replace(/\D/g, '')}`,
    aula_fonte: c.numero, href: c.href, titulo_cartao: c.titulo, descricao_cartao: c.descricao,
    pergunta: null,
    vinculos: { aula_codigo: `aula-14-${c.numero.replace(/\D/g, '')}` },
    linha_aprox: c.linha_aprox,
  })),
  perguntas_por_aula_nota: 'Diferente do M01, o § MAP do M14 não tem coluna de pergunta por aula: cada cartão (a.map-card) traz número, título curto e uma descrição declarativa. `pergunta: null` em todas as 8. As perguntas literais do § MAP são a pergunta em cinco partes (lede) e a "Pergunta central" de cada camada (tabela §MAP.1).',
  instrumento_de_modulo: { id_fonte: 'INST·01', ver: 'instrumentos.json (m14-inst-01)', nota: 'Único instrumento fora de aula: vive dentro do § MAP, antes de §MAP.1.' },
  origem: origem('section#map', map.s, 'Mapa de rotas'),
};

// ------------------------------------------------------------- roteiro
const conteudoTS = readRepo('src/lib/data/alexandria-modulo-14-content.ts');
const aulasTS = [...conteudoTS.matchAll(/id: "(aula-14-\d\d)",[\s\S]*?number: (\d+),\s*totalInModule: (\d+),\s*title: "([^"]*)",\s*subtitle: "([^"]*)"/g)]
  .map((m) => ({ id: m[1], number: +m[2], totalInModule: +m[3], title: m[4], subtitle: m[5] }));
const sections = findAll(ROOT, (n) => n.tag === 'section');
const roteiro = sections.map((s, i) => {
  const wrap = find(s, sel('div', 'wrap'));
  const sid = find(wrap, sel('div', 'sec-id'));
  const b = find(sid, sel('b'));
  const h2 = find(wrap, sel('h2'));
  const marcadorTxt = texto(inner(sid));
  const num = marcadorTxt.split(' · ')[0];
  const eAula = /^Aula \d\d$/.test(num);
  const item = {
    id: `m14-sec-${s.attrs.id}`,
    tipo: eAula ? 'aula' : 'aparato',
    ordem_na_fonte: i + 1,
    section_id: s.attrs.id,
    marcador_num: num,
    marcador_rotulo: texto(inner(b)),
    marcador_html: inline(inner(sid)),
    titulo: ht(h2),
    origem: origem(`section#${s.attrs.id} > div.sec-id`, sid),
  };
  if (eAula) {
    const n = num.replace(/\D/g, '');
    const bl = blocos(wrap, `m14-a${n}`, `section#${s.attrs.id}`);
    item.subsecoes = bl.filter((x) => x.tipo === 'titulo' && x.nivel === 'h3').map((x) => ({ numero: x.numero, titulo: x.titulo_sem_numero, linha_aprox: x.origem.linha_aprox }));
    item.instrumentos = bl.filter((x) => x.tipo === 'instrumento_ref').map((x) => x.id_fonte);
    item.callouts = bl.filter((x) => x.tipo === 'callout').map((x) => ({ classe: x.classe, rotulo: x.rotulo, linha_aprox: x.origem.linha_aprox }));
    item.fichas_de_rota = findAll(wrap, sel('div', 'emp')).length;
    const card = grade.itens.find((c) => c.href === `#${s.attrs.id}`);
    item.cartao_map = card ? { titulo: card.titulo, descricao: card.descricao } : null;
    const ts = aulasTS.find((a) => a.id === `aula-14-${n}`);
    item.vinculos = { aula_codigo: `aula-14-${n}`, mapa: `m14-map-aula-${n}` };
    item.comparacao_codigo = ts ? {
      codigo_title: ts.title, codigo_subtitle: ts.subtitle, codigo_totalInModule: ts.totalInModule,
      title_igual_marcador_rotulo: ts.title === item.marcador_rotulo,
      subtitle_igual_h2: ts.subtitle === item.titulo.texto,
      cartao_map_titulo_igual_marcador: card ? card.titulo === item.marcador_rotulo : null,
    } : null;
    item.linhas = { inicio: line(s), fim: lineOf(s.c0) };
  }
  return item;
});
const aulasRot = roteiro.filter((r) => r.tipo === 'aula');

// ------------------------------------------------------------ criterios
const bTese = (pred) => teseBlocos.find(pred);
const critBox = bTese((b) => b.tipo === 'callout' && b.rotulo?.startsWith('Critério de domínio'));
const quiz = secao('quiz');
const quizBl = blocos(quiz.wrap, 'm14-quiz', 'section#quiz');
const voz = secao('voz');
const vozBl = blocos(voz.wrap, 'm14-voz', 'section#voz');
const fin = secao('final');
const finBl = blocos(fin.wrap, 'm14-final', 'section#final');
const a08 = secao('a08');
const a08Bl = blocos(a08.wrap, 'm14-a08', 'section#a08');
const critA08 = a08Bl.find((b) => b.tipo === 'callout' && b.rotulo?.startsWith('O critério'));
const exS = secao('ex');
const exBl = blocos(exS.wrap, 'm14-ex', 'section#ex');
const scriptQuiz = html.slice(html.indexOf('/* ===================== QUIZ'), html.indexOf('</script>'));
const limiar = scriptQuiz.match(/acertos>=(\d+)\?'pass':'fail'/);
const criterio = {
  id: 'm14-criterio', tipo: 'criterios-literais',
  nota_P18: 'Registro literal de todas as formas de critério que a fonte declara. Nenhuma é escolhida (P5/P18). A fonte declara que o critério do bloco é CONSTRUÍDO, não citado do Currículo Definitivo (§00.3). `marcacao_p14` é anotação desta extração, inferida do texto, e precisa de revisão humana.',
  declaracao_de_construcao: bTese((b) => b.tipo === 'paragrafo' && b.texto.startsWith('Uma declaração de método')),
  declaracao_de_construcao_2: bTese((b) => b.tipo === 'paragrafo' && b.texto.startsWith('O critério abaixo é, portanto')),
  criterios: [
    { id: 'm14-crit-01', secao: '§00.3', rotulo: critBox.rotulo, html: critBox.paragrafos[0].html, texto: critBox.paragrafos[0].texto, marcacao_p14: ['cronometrado', 'producao_oral_ou_livre'], marcacao_p14_motivo: '"em menos de um minuto" (cronometrado); "explicar, sem consultar nota" (produção oral/livre)', origem: critBox.origem },
    { id: 'm14-crit-02', secao: '§Quiz', onde_na_secao: 'h2 + lede', titulo: quizBl.find((b) => b.tipo === 'titulo').texto, html: quizBl.find((b) => b.tipo === 'lead').html, texto: quizBl.find((b) => b.tipo === 'lead').texto, frase_criterio: 'O critério é oito de dez.', limiar_no_script: limiar ? { codigo: limiar[0], minimo_aprovacao: +limiar[1], linha_aprox: lineOf(html.indexOf(limiar[0])) } : null, pill_hero: pills.find((p) => p.texto.startsWith('quiz'))?.texto ?? null, marcacao_p14: ['automatizavel_quiz'], nota: 'Mensagens do placar em aparato.json (avaliacao.faixas_de_placar_script). P18: o limiar não declara domínio.', origem: quizBl.find((b) => b.tipo === 'lead').origem },
    { id: 'm14-crit-03', secao: '§Voz', onde_na_secao: 'lede', html: vozBl.find((b) => b.tipo === 'lead').html, texto: vozBl.find((b) => b.tipo === 'lead').texto, frase_criterio: 'O teste real deste bloco não é escrito — é falado', pill_hero: pills.find((p) => p.texto.startsWith('roteiro oral'))?.texto ?? null, marcacao_p14: ['producao_oral_ou_livre', 'cronometrado'], marcacao_p14_motivo: 'gravar oito minutos sem ler; métrica: número citado sem base temporal', origem: vozBl.find((b) => b.tipo === 'lead').origem },
    { id: 'm14-crit-04', secao: '§Final', onde_na_secao: 'lede do checklist', html: finBl.find((b) => b.tipo === 'lead').html, texto: finBl.find((b) => b.tipo === 'lead').texto, frase_criterio: 'O primeiro item é o critério de domínio deste bloco.', total_itens: finBl.find((b) => b.tipo === 'lista').itens.length, marcacao_p14: ['autodeclarado'], nota: 'Os 26 itens estão em aparato.json (checklist_final), com marcação P14 item a item.', origem: finBl.find((b) => b.tipo === 'lead').origem },
    { id: 'm14-crit-05', secao: 'Aula 08 (§08.2)', rotulo: critA08.rotulo, html: critA08.paragrafos[0].html, texto: critA08.paragrafos[0].texto, marcacao_p14: ['cronometrado', 'producao_oral_ou_livre'], marcacao_p14_motivo: 'rótulo "em uma sequência de um minuto"; três perguntas feitas ao interlocutor', origem: critA08.origem },
    { id: 'm14-crit-06', secao: '§Ex', onde_na_secao: 'lede (tentativa antes do gabarito)', html: exBl.find((b) => b.tipo === 'lead').html, texto: exBl.find((b) => b.tipo === 'lead').texto, frase_criterio: null, marcacao_p14: ['producao_oral_ou_livre'], nota: 'Não traz limiar numérico. Registra a instrução de tentar antes de abrir o gabarito (relevante para C7).', origem: exBl.find((b) => b.tipo === 'lead').origem },
  ],
};

// ------------------------------------------------- resultado esperado / lab
const resultado_esperado = {
  id: 'm14-resultado-esperado', tipo: 'resultado-esperado',
  titulo: null, preambulo: null, itens: null,
  nota: 'A fonte não tem seção "Resultado esperado" nem lista de capacidades (busca por "resultado esperado" e "capacidade" como rótulo: zero). O conteúdo mais próximo é o critério construído (m14-crit-01) e os 26 itens do checklist (aparato.json). Nenhuma capacidade foi derivada aqui (P3/P11).',
};
const laboratorios = {
  id: 'm14-lab', tipo: 'laboratorios', secao_lab: null,
  nota: 'Não existe § Lab no M14 (18 seções; nenhuma com marcador Lab; busca por "laborat": zero). O único instrumento de módulo é o INST·01, dentro do § MAP (instrumentos.json).',
};

// ---------------------------------------------------------------- voz
const principio = (b, onde) => ({ id: `m14-principio-${b.id}`, onde, rotulo: b.rotulo ?? null, classe: b.classe ?? null, paragrafos: b.paragrafos ?? null, itens: b.itens ?? null, origem: b.origem });
const vozObj = {
  id: 'm14-voz', tipo: 'voz',
  roteiro_oral: {
    marcador: vozBl[0].texto, titulo: vozBl[1].texto, lead: { html: vozBl[2].html, texto: vozBl[2].texto, origem: vozBl[2].origem },
    blocos_de_tempo: vozBl.find((b) => b.tipo === 'linha_do_tempo').itens.map((x, i) => ({ id: `m14-voz-${pad(i + 1)}`, ...x })),
    o_que_ouvir: vozBl.find((b) => b.tipo === 'callout'),
    origem: origem('section#voz', voz.s, 'Roteiro oral'),
  },
  principios: [
    principio(bTese((b) => b.tipo === 'taxonomia'), '§00.4 — regra de nomeação em três estados'),
    principio(bTese((b) => b.tipo === 'callout' && b.rotulo === 'O que este módulo não conclui'), '§00.5'),
    principio(bTese((b) => b.tipo === 'callout' && b.rotulo?.startsWith('Números vivos')), '§00.1'),
  ],
  principios_em_outros_grupos: [
    { rotulo: 'Linguagem obrigatória — Travas do War Room', onde: '§Caso', ver: 'aparato.json caso' },
    { rotulo: 'lede do § Ref (separação por natureza da fonte)', onde: '§Ref', ver: 'aparato.json referencias.introducao' },
    { rotulo: 'Data de verificação e limites deste ativo', onde: '§Ref', ver: 'aparato.json referencias.limites' },
    { rotulo: 'A frase que fecha o bloco', onde: '§Final', ver: 'aparato.json checklist_final.fecho' },
  ],
  callouts_numeros_vivos_em_aula: findAll(ROOT, (n) => hasCls(n, 'box') && hasCls(n, 'rd') && texto(inner(find(n, sel('span', 'tag')) || n)).startsWith('Números vivos'))
    .map((n) => ({ linha_aprox: line(n), secao: n.parent?.parent?.attrs?.id ?? null })),
};

// ----------------------------------------------------------- erros comuns
const er = secao('erros');
const erBl = blocos(er.wrap, 'm14-erros', 'section#erros');
const erLista = find(er.wrap, sel('ol', 'num-list'));
const erros_comuns = {
  id: 'm14-erros', tipo: 'erros-comuns', secao_de_modulo: '§Erros',
  marcador: erBl[0].texto, titulo: { html: erBl[1].html, texto: erBl[1].texto }, lead: { html: erBl[2].html, texto: erBl[2].texto, origem: erBl[2].origem },
  total: kids(erLista, sel('li')).length,
  itens: kids(erLista, sel('li')).map((li, i) => {
    const b = find(li, sel('b')); const it = find(li, sel('i'));
    return { id: `m14-erro-${pad(i + 1)}`, tipo: 'erro-comum', ordem: i + 1, afirmacao: texto(inner(b)), correcao_html: inline(inner(it)), correcao_texto: texto(inner(it)), vinculos: { instrumentos_citados: (texto(inner(it)).match(/INST·\d\d/g) || []), aulas_citadas: (texto(inner(li)).match(/Aula \d\d/g) || []) }, origem: origem('section#erros ol.num-list > li', li) };
  }),
  origem: origem('section#erros', er.s, 'Dezoito afirmações'),
};

const tradutor = { id: 'm14-tradutor', secao: null, nota: 'Não há Tradutor nem § Map (minúsculo) no M14. O único marcador de mapa é §MAP (mapa de rotas).' };

const produto = findAll(ROOT, (n) => hasCls(n, 'box') && find(n, sel('span', 'tag')) && texto(inner(find(n, sel('span', 'tag')))) === 'Onde isso entra no produto')
  .map((n) => ({ secao: n.parent?.parent?.attrs?.id ?? null, linha_aprox: line(n), trecho_inicial: texto(inner(find(n, sel('p')))).slice(0, 60) }));

// --------------------------------------------------------- divergencias
const bodyTxt = texto(html.slice(html.indexOf('<body>'), html.indexOf('<script>')));
const scriptTxt = html.slice(html.indexOf('<script>'), html.indexOf('</script>'));
const cntGA = (bodyTxt.match(/GridAlpha/g) || []).length;
const cntGAs = (scriptTxt.match(/GridAlpha/g) || []).length;
const linhasGA = html.split('\n').map((l, i) => (l.includes('GridAlpha') ? i + 1 : null)).filter(Boolean);
const mapH3 = mapBlocos.find((b) => b.tipo === 'titulo' && b.numero === '§MAP.1');
const trilhasTS = readRepo('src/lib/data/alexandria-trilhas.ts').split('\n').find((l) => l.includes("'bloco-14'"));

const divergencias = [
  { id: 'div-m14-trilha', tema: 'Trilha/nível do módulo', leitura_a: { onde: 'rodapé (footer)', texto: identidade.trilha_declarada[0].texto }, leitura_b: { onde: '§00.3', texto: identidade.trilha_declarada[1].trecho }, leitura_c: { onde: 'alexandria-blocks.ts', texto: b14?.trim() }, linhas_aprox: [identidade.trilha_declarada[0].linha_aprox, identidade.trilha_declarada[1].linha_aprox], classe: 'fonte × fonte × código', nota: 'Registrado também no catálogo canônico (divergência 2). Não resolvido.', decisao: null },
  { id: 'div-m14-horas', tema: 'Carga horária', leitura_a: { onde: 'fonte', texto: null }, leitura_b: { onde: 'alexandria-blocks.ts', texto: 'estimatedHoursMin: 2, estimatedHoursMax: 2' }, classe: 'fonte × código', nota: 'A fonte não declara horas; o valor do código não tem origem neste HTML. O catálogo canônico também não traz horas para o M14.', decisao: null },
  { id: 'div-m14-cinco-camadas', tema: '"cinco" × seis linhas na cadeia do § MAP', leitura_a: { onde: 'h3 §MAP.1', texto: mapH3.texto }, leitura_b: { onde: 'tabela §MAP.1', texto: `${camadas.linhas.length} linhas: ${camadas.linhas_texto.map((r) => r[0]).join(', ')}` }, leitura_c: { onde: 'lede do § MAP', texto: `pergunta em cinco partes: ${cinco.join(', ')}` }, leitura_d: { onde: 'callout do § MAP', texto: 'faça as duas primeiras ... As outras quatro dependem das duas.' }, linhas_aprox: [mapH3.origem.linha_aprox, camadas.origem.linha_aprox, mapLead.origem.linha_aprox], classe: 'fonte × fonte', nota: 'O título diz cinco camadas, a tabela tem seis (e o callout soma seis: duas + quatro). As "cinco partes" do lede são outra lista (mercado e órgão não são linhas da tabela; logística, carbono e economia não são partes da pergunta). Markup vence a prosa na contagem (protocolo §5), mas as duas listas ficam registradas.', decisao: null },
  { id: 'div-m14-titulos-curtos-map', tema: 'Título curto do cartão do § MAP × rótulo do marcador da aula', leituras: aulasRot.filter((a) => a.cartao_map && a.cartao_map.titulo !== a.marcador_rotulo).map((a) => ({ aula: a.marcador_num, marcador: a.marcador_rotulo, cartao_map: a.cartao_map.titulo })), classe: 'fonte × fonte', nota: 'Variantes de nome da mesma aula. O código usa o rótulo do marcador (title) e o h2 (subtitle); a descrição dos cartões não está no código.', decisao: null },
  { id: 'div-m14-criterio', tema: 'Critério do bloco em várias formas', leituras: criterio.criterios.map((c) => ({ onde: c.secao, texto: c.frase_criterio ?? c.texto })), classe: 'fonte × fonte', nota: 'Critério construído (§00.3) × quiz 8/10 (h2, lede, pill e script `acertos>=8`) × checklist de 26 cujo 1º item "é o critério" × "o teste real ... é falado" (§Voz) × sequência de um minuto (§08). Nenhuma forma prevalece (P18).', decisao: null },
  { id: 'div-m14-quatro-defeitos', tema: 'As "quatro" categorias de erro mudam de uma seção para outra', leituras: [
    { onde: '§Ex lede', texto: 'identificação de base temporal, classificação de rota, separação de grandeza e estado de política' },
    { onde: '§Quiz lede', texto: 'base temporal, rota, grandeza, estado de política' },
    { onde: 'script do quiz, mensagem < 8', texto: 'base temporal, rota não declarada, grandeza confundida, estado de política' },
    { onde: 'INST·10 (filtro e categorias)', texto: 'Base temporal, Rota não declarada, Grandeza confundida, Concorrente omitido' },
    { onde: '§00, §Erros lede, §08 callout', texto: 'três: base temporal, rota, produto concorrente' },
  ], classe: 'fonte × fonte', nota: '"Estado de política" é família do §Ex e do quiz, mas não categoria do INST·10 (lá o enunciado e3 tem rótulo "estado de política" e categoria "base"). "Concorrente omitido" é categoria do INST·10, mas não família do §Ex nem do quiz. Detalhe em instrumentos.json (m14-inst-10).', decisao: null },
  { id: 'div-m14-marca', tema: 'Marca GridAlpha visível ao learner (P24)', leitura_a: { onde: 'fonte', texto: `"GridAlpha" aparece ${cntGA} vezes no texto do corpo e ${cntGAs} vez(es) em strings do script (quiz Q10)` }, linhas_aprox: linhasGA, classe: 'fonte × produto', nota: 'Eyebrow, rodapé, §00.4 ("concorrente direto do GridAlpha"), callouts "Onde isso entra no produto" (GridAlpha Research / Energy Brief / Regulatory Radar), § Ref "Documentos internos do GridAlpha" e o feedback da Q10. Texto mantido literal; a troca é da camada Alexandria.', decisao: null },
  { id: 'div-m14-war-room', tema: 'Vocabulário interno "War Room"/"Travas" visível ao learner', leituras: [
    { onde: '§Caso callout', texto: 'Linguagem obrigatória — Travas do War Room' },
    { onde: '§Voz callout', texto: 'é o que a Trava 1 do War Room existe para impedir' },
    { onde: '§Ref (Documentos internos)', texto: 'GridAlpha — War Room, Quatro Travas de Segurança' },
  ], classe: 'fonte × produto', nota: 'Não há conflito de numeração neste módulo (a Trava 1 do §Voz é compatível com a primeira trava listada no §Ref, "Linguagem pública defensável"), mas a lista do §Ref só enumera as travas em prosa, sem números. Ver P23.', decisao: null },
  { id: 'div-m14-catalogo-criterio', tema: 'Citação do critério construído truncada no catálogo canônico', leitura_a: { onde: 'fonte §00.3', texto: critBox.paragrafos[0].texto }, leitura_b: { onde: 'catalogo-modulos-alexandria.md', texto: 'termina em "...por que uma usina sucroenergética entrega energia firme durante metade do ano." (sem "e por que isso é complementaridade e não defeito")' }, classe: 'fonte × catálogo', nota: 'A citação do catálogo corta a última oração do critério sem marcar o corte.', decisao: null },
  { id: 'div-m14-codigo-nao-renderizado', tema: 'Dados do M14 no código que nenhuma tela lê', leituras: [
    { onde: 'alexandria-modulo-14-content.ts', texto: 'MODULO_14_EXERCICIOS_SOLTOS (14) e MODULO_14_INSTRUMENTOS ([]) são exportados' },
    { onde: 'RecursosDoModulo.tsx', texto: "registro RECURSOS vai só até 'modulo-09'; 'modulo-14' ausente" },
    { onde: 'alexandria-curriculo.ts', texto: 'importa só MODULO_14_AULAS, _CORPO e _LEAD' },
  ], classe: 'código', nota: 'Os 14 exercícios existem no código mas não aparecem na interface; os 10 instrumentos não existem no código.', decisao: null },
  { id: 'div-m14-aulas-por-bloco', tema: 'Contagem de aulas', leitura_a: { onde: 'fonte', texto: `${aulasRot.length} seções "Aula NN"; ${grade.itens.length} cartões no §MAP.2; pill "${pills[0].texto}"` }, leitura_b: { onde: 'código', texto: `MODULO_14_AULAS: ${aulasTS.length}; totalInModule: ${[...new Set(aulasTS.map((a) => a.totalInModule))].join(',')}; ${trilhasTS?.trim()}` }, classe: 'fonte × código (sem divergência)', nota: 'Os sinais concordam em 8. Registro de conferência, não de conflito.', decisao: null },
];

// ------------------------------------------------------ comparacao codigo
const comparacao_codigo = {
  arquivos: [
    'src/lib/data/alexandria-modulo-14-content.ts',
    'src/lib/data/alexandria-curriculo.ts',
    'src/lib/data/alexandria-trilhas.ts',
    'src/lib/data/alexandria-blocks.ts',
    'src/components/alexandria/navigation/RecursosDoModulo.tsx',
    'C:/dev/GridAlpha v2/docs/catalogo-modulos-alexandria.md',
  ],
  contagem_aulas: { fonte_marcadores_aula: aulasRot.length, fonte_cartoes_map: grade.itens.length, fonte_pill: pills[0].texto, codigo_MODULO_14_AULAS: aulasTS.length, codigo_totalInModule: [...new Set(aulasTS.map((a) => a.totalInModule))], codigo_AULAS_POR_BLOCO: trilhasTS?.trim() ?? null },
  titulos: aulasRot.map((a) => ({ aula: a.marcador_num, fonte_marcador: a.marcador_rotulo, fonte_h2: a.titulo.texto, fonte_cartao_map: a.cartao_map?.titulo ?? null, ...a.comparacao_codigo })),
  o_que_o_codigo_nao_tem: ['tese (§00) e as três lentes', 'critérios (construído, quiz, voz, checklist)', 'perguntas do § MAP e tabela das camadas', 'descrições dos cartões do § MAP', 'roteiro oral (§Voz)', 'erros comuns (§Erros, 18)', 'princípios (§00.4, §00.5)', 'os 10 instrumentos (MODULO_14_INSTRUMENTOS = [] e instruments: [] nas 8 aulas)'],
  badges: 'alexandria-badges.ts não referencia o M14 (busca por "14"/"bloco-14": nada relativo ao módulo).',
};

// ------------------------------------------------------------- cobertura
const cob = {
  tese: cobertura(inner(tese.wrap), teseObj.blocos),
  map: cobertura(semInstrumento(inner(map.wrap)), mapa.blocos),
  erros: cobertura(inner(er.wrap), [erros_comuns.marcador, erros_comuns.titulo.texto, erros_comuns.lead.texto, erros_comuns.itens.map((x) => [x.afirmacao, x.correcao_texto])]),
  voz: cobertura(inner(voz.wrap), [vozObj.roteiro_oral.marcador, vozObj.roteiro_oral.titulo, vozObj.roteiro_oral.lead.texto, vozObj.roteiro_oral.blocos_de_tempo, vozObj.roteiro_oral.o_que_ouvir]),
  hero_e_rodape: cobertura(inner(hero) + inner(footer), [identidade.eyebrow.texto, identidade.titulo.texto, identidade.subtitulo.texto, pills.map((p) => p.texto), rodapeLinhas]),
};

const out = {
  schema: 'alexandria-v2/extracao-fonte/modulo@1',
  modulo: 14,
  grupo: 'modulo',
  camada: 'fonte',
  fonte: FONTE,
  gerado_em: HOJE,
  gerado_por: 'docs/alexandria-v2/extraction/m14/extratores/m14_modulo.mjs (árvore de elementos própria, sem digitação)',
  convencoes: {
    html: 'HTML inline da fonte com espaços colapsados',
    texto: 'mesmo conteúdo sem tags, entidades decodificadas',
    linha_aprox: 'linha (1-based) da abertura do elemento na fonte',
    marcacao_p14: 'anotação desta extração, não texto da fonte',
    null: 'ausência na fonte; sempre acompanhado de nota',
  },
  identidade,
  tese: teseObj,
  resultado_esperado,
  mapa,
  roteiro,
  criterio,
  laboratorios,
  voz: vozObj,
  erros_comuns,
  tradutor,
  onde_entra_no_produto_P7: produto,
  divergencias,
  comparacao_codigo,
  cobertura_por_token: cob,
  contagens: {
    secoes: roteiro.length,
    aulas: aulasRot.length,
    aparatos: roteiro.length - aulasRot.length,
    pills_hero: pills.length,
    subsecoes_tese: teseObj.subsecoes.length,
    lentes: teseObj.lentes.length,
    perguntas_camadas_map: mapa.perguntas_por_camada.length,
    cartoes_map: mapa.aulas.length,
    criterios_literais: criterio.criterios.length,
    blocos_de_tempo_voz: vozObj.roteiro_oral.blocos_de_tempo.length,
    erros_comuns: erros_comuns.itens.length,
    callouts_onde_entra_no_produto: produto.length,
    instrumentos_por_aula: Object.fromEntries(aulasRot.map((a) => [a.marcador_num, a.instrumentos])),
    divergencias: divergencias.length,
  },
};
write('modulo.json', out);
console.log(JSON.stringify(out.contagens), JSON.stringify(cob, null, 0));
