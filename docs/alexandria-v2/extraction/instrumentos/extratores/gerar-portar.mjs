/* ============================================================================
   gerar-portar.mjs — ordem recomendada de porte dos 165 instrumentos.

   Lê ../instrumentos.json (produzido por gerar-instrumentos.mjs) e emite
   ../PORTAR.md. A prosa é escrita; toda contagem e todo custo são derivados
   do próprio documento, nunca digitados.

   uso: node gerar-instrumentos.mjs && node gerar-portar.mjs
   ============================================================================ */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const AQUI = path.dirname(fileURLToPath(import.meta.url));
const SAIDA = path.resolve(AQUI, '..');
const doc = JSON.parse(fs.readFileSync(path.join(SAIDA, 'instrumentos.json'), 'utf8'));
const { instrumentos, contagens } = doc;

const esc = s => String(s ?? '—').replace(/\|/g, '\\|').replace(/\n+/g, ' ');
const byId = Object.fromEntries(instrumentos.map(i => [i.identidade.id, i]));
const MODULOS_NAO_PORTADOS = contagens.porte.modulos_nao_portados;
const NIVEIS_C7 = ['atende', 'atende em parte', 'não atende'];

const DIAS = { P: 0.5, M: 1.5, G: 3 };
const custoDe = id => DIAS[(byId[id] && byId[id].forma_prometida.custo_estimado) || 'P'] || 0;
const soma = ids => ids.reduce((a, id) => a + custoDe(id), 0);
const br = n => n.toFixed(1).replace('.', ',');
const tit = id => (byId[id] && (byId[id].identidade.titulo || byId[id].identidade.titulo_ausencia)) || '—';
const est = id => (byId[id] && byId[id].forma_prometida.estado_c5) || '—';
const cst = id => (byId[id] && byId[id].forma_prometida.custo_estimado) || '—';

/* Famílias de figura: uma implementação parametrizável serve a vários
   instrumentos. As listas vêm da leitura do campo `o_que_desenhar` de cada um
   e das notas de reúso do overlay. */
const FAMILIAS = [
  ['F1 · coluna estável recolorida por lente',
    'Uma lista fixa que não muda; um seletor de lente que reclassifica todos os itens de uma vez; um painel de detalhe que abre sem tirar os outros da tela. A reclassificação simultânea é o conteúdo.',
    ['m03-inst-01', 'm10-inst-01', 'm11-inst-01', 'm13-inst-01', 'm14-inst-01', 'm15-inst-01', 'm16-inst-01', 'm17-inst-01']],
  ['F2 · matriz de leitura lateral',
    'Linhas × colunas com todas as células visíveis e a célula ativa aberta abaixo. Serve a todo instrumento cujo intro declara produto cartesiano completo ou leitura lateral — nesses casos a promessa é a completude.',
    ['m07-inst-02', 'm08-inst-05', 'm09-inst-03', 'm09-inst-06', 'm10-inst-07', 'm11-inst-09', 'm12-inst-01', 'm12-inst-05', 'm13-inst-09', 'm13-inst-10', 'm13-inst-11', 'm14-inst-04', 'm14-inst-09', 'm15-inst-02', 'm16-inst-03', 'm16-inst-10', 'm17-inst-04', 'm17-inst-05']],
  ['F3 · barra de tempo segmentada',
    'Uma faixa de duração total dividida em segmentos proporcionais aos tempos que a fonte declara, preenchendo-se conforme o percurso. Onde há duas trilhas, duas faixas paralelas com conectores de sincronização.',
    ['m07-inst-04', 'm07-inst-06', 'm09-inst-10', 'm10-inst-10', 'm11-inst-11', 'm12-inst-11', 'm13-inst-04']],
  ['F4 · régua com faixas e marcas',
    'Um eixo de uma grandeza, faixas nomeadas sombreadas ao longo dele e uma ou mais marcas. É a figura mais barata e a mais reutilizada do currículo.',
    ['m08-inst-03', 'm10-inst-03', 'm12-inst-08', 'm13-inst-08', 'm14-inst-03', 'm14-inst-05', 'm14-inst-07', 'm15-inst-03', 'm15-inst-06', 'm15-inst-09', 'm16-inst-02', 'm16-inst-05', 'm17-inst-07', 'm17-inst-10']],
  ['F5 · trajetória sobre eixo de tempo',
    'Uma ou duas curvas sobre horas, meses ou anos, com marcas de mínimo, de máximo ou de cruzamento, e a área entre curvas sombreada quando é ela o resultado.',
    ['m02-inst-04', 'm02-inst-07', 'm03-inst-03', 'm03-inst-04', 'm03-inst-05', 'm04-inst-02', 'm05-inst-05', 'm06-inst-02', 'm06-inst-03', 'm06-inst-04', 'm06-inst-07', 'm08-inst-06', 'm08-inst-10', 'm11-inst-05', 'm11-inst-07', 'm11-inst-08', 'm16-inst-06']],
  ['F6 · pilha ordenada e barra composta',
    'Faixas empilhadas por custo, por camada ou por mês, com a marginal ou o total destacados. Cobre despacho, composição de preço, custo mensal por camada e comparação de duas pilhas.',
    ['m01-lab-01', 'm02-inst-03', 'm02-inst-05', 'm03-inst-06', 'm04-inst-01', 'm04-inst-04', 'm04-inst-05', 'm04-inst-07', 'm12-inst-02', 'm14-inst-06', 'm15-inst-04', 'm15-inst-05', 'm15-inst-07', 'm16-inst-08', 'm17-inst-03', 'm17-inst-11']],
  ['F7 · plano de dois eixos com quadrantes',
    'Dois eixos, quadrantes nomeados e um ponto que migra. Inclui a diagonal de indiferença quando a pergunta é qual dos dois lados ganha.',
    ['m05-inst-06', 'm08-inst-08', 'm14-inst-02']],
  ['F8 · grafo sobre geometria fixa',
    'Nós em posições fixas e conjuntos de arestas alternáveis. É a família mais cara e a mais insubstituível: a fixidez da geometria é o que permite comparar os fluxos.',
    ['m07-inst-01', 'm08-inst-01', 'm09-inst-01']],
  ['F9 · cascata de reduções',
    'Degraus sucessivos sobre a mesma base, cada um rotulado com o que o reduziu. Onde o primeiro e o último número diferem por uma ordem de grandeza, é a cascata que explica.',
    ['m14-inst-08', 'm16-inst-04', 'm16-inst-09', 'm17-inst-09']],
  ['F10 · duas pizzas lado a lado',
    'Duas composições de 100% com as mesmas categorias e as mesmas cores, com a troca de posição marcada. A fonte já desenha no m08-inst-02; o m08-inst-04 precisa delas e da banda de tolerância.',
    ['m08-inst-02', 'm08-inst-04']],
  ['F11 · eixo de tempo datado com estado',
    'Marcos posicionados pela data real, pintados pelo estado, com faixa fora do eixo para os marcos que a fonte declara sem data.',
    ['m06-inst-01', 'm11-inst-03', 'm12-inst-04', 'm16-inst-07']],
  ['F12 · duas barras comparadas com a diferença marcada',
    'Duas alturas na mesma escala e a distância entre os topos rotulada. É a figura de todo verificador — e a que exige escala logarítmica declarada quando as duas diferem por ordens de grandeza.',
    ['m10-inst-09', 'm11-inst-06', 'm12-inst-09', 'm13-inst-02', 'm13-inst-07']]
];

const naoPortadosIds = instrumentos.filter(i => MODULOS_NAO_PORTADOS.includes(i.identidade.modulo)).map(i => i.identidade.id);
const promessaSemDesenhoIds = instrumentos.filter(i => /sem desenho/.test(i.forma_prometida.estado_c5 || '')).map(i => i.identidade.id);
const alertaDePorteIds = instrumentos.filter(i => i.forma_prometida.alerta_de_porte).map(i => i.identidade.id);
const bloqueioIds = instrumentos.filter(i => i.previsao.bloqueio).map(i => i.identidade.id);
const revisaoIds = instrumentos.filter(i => i.tolerancia.revisao_tecnica_pedida).map(i => i.identidade.id);

const P = [];
P.push('# PORTAR.md — ordem recomendada de porte dos 165 instrumentos');
P.push('');
P.push('> Gerado por `extratores/gerar-portar.mjs` a partir de `instrumentos.json`. A prosa é escrita;');
P.push('> **toda contagem e todo custo são derivados do próprio documento**, nunca digitados. Esta lista');
P.push('> é ordem de trabalho, não promessa de prazo.');
P.push('');
P.push('## Como ler o custo');
P.push('');
P.push('O custo é o da **forma prometida** — a figura —, não o do instrumento inteiro. Entradas, saídas e');
P.push('fórmulas já estão especificadas linha a linha em `instrumentos.md`, e portá-las é transcrição.');
P.push('');
P.push('| Nível | O que é | Ordem de grandeza |');
P.push('|---|---|---|');
P.push('| **P** | Régua, tabela transposta, duas ou três barras, cascata curta | meio dia |');
P.push('| **M** | Uma figura com eixos: trajetória, pilha ordenada, matriz completa, plano de quadrantes | um dia e meio |');
P.push('| **G** | Figura composta: grafo sobre geometria fixa, duas pilhas com o fluxo entre elas | três dias |');
P.push('');
P.push(`Somando os ${instrumentos.length}, se cada figura fosse feita do zero: **${br(soma(instrumentos.map(i => i.identidade.id)))} dias**. As famílias da Onda 1 existem para que não sejam.`);
P.push('');
P.push('## O que esta especificação corrige no diagnóstico de partida');
P.push('');
P.push('O brief desta rodada diz que **só um instrumento desenha a forma que o nome promete**. Essa');
P.push('medida é do código. Na camada fonte o quadro é outro, e é melhor:');
P.push('');
P.push(`- **${contagens.forma_prometida.prometem_forma} prometem uma forma** no título ou na própria intro.`);
P.push(`- **${contagens.forma_prometida.cumprida_na_fonte} a fonte já desenha**, e outros ${contagens.forma_prometida.cumprida_em_parte} desenham em parte. O HTML original tem svg, pilha, cadeia, grade e quadrante — com legenda, rótulo de eixo e viewBox literais.`);
P.push(`- **${contagens.forma_prometida.promessa_sem_desenho} prometem e não desenham nada.** É aqui que está a dívida de C5 dentro da própria fonte.`);
P.push(`- **${contagens.forma_prometida.nao_prometem_forma} não prometem forma** e não devem ganhar figura por decoração (C6).`);
P.push('');
P.push('Isso inverte a ordem do trabalho: **boa parte do que falta na tela não precisa ser desenhada,');
P.push('precisa ser portada.** Os instrumentos com *alerta de porte* na Onda 3 têm figura na fonte que o');
P.push('código perdeu.');
P.push('');
P.push(`Sobre tolerância, a medida da camada fonte é mais dura que a do brief: **${contagens.tolerancia.declarada_pela_fonte} instrumento de ${instrumentos.length}**`);
P.push(`declara tolerância — \`${contagens.tolerancia.quais.join(', ')}\`, três pontos percentuais por fonte. Nos outros 164,`);
P.push('`"tolerancia": null`, e portanto **nenhum veredito “dentro/fora”**: autoavaliação em três níveis');
P.push(`(${NIVEIS_C7.join(' · ')}), como manda C7. Nenhuma margem foi inventada (P6).`);
P.push('');
P.push(`Os cinco instrumentos do M01 sem extração de camada fonte — \`${contagens.sem_extracao_de_camada_fonte.join('`, `')}\` —`);
P.push('saem com **ausência declarada** em todos os campos. Eles existem no código, mas o código não é');
P.push('fonte: especificá-los a partir dele seria inventar a fonte a partir do porte.');
P.push('');

P.push('## Onda 0 — decisões antes de qualquer porte');
P.push('');
P.push('Nada aqui é trabalho de builder. São decisões do Founder ou de content QA, e cada uma trava um');
P.push('readout específico. O resto do instrumento pode ser portado em paralelo.');
P.push('');
P.push('### 0.1 · Reconciliações que travam um número na tela');
P.push('');
P.push('| Instrumento | O que está em conflito |');
P.push('|---|---|');
for (const id of bloqueioIds)
  P.push(`| \`${id}\` · ${tit(id)} | ${esc(byId[id].avisos.divergencia || byId[id].previsao.resposta_no_cenario_padrao)} |`);
P.push('');
P.push('Enquanto não houver decisão, esses readouts **não são portados como estão**, e as perguntas de');
P.push('previsão correspondentes ficam fora do ar.');
P.push('');
P.push('### 0.2 · Pedido de revisão técnica de tolerância');
P.push('');
P.push('Estes comparam a resposta do learner — ou uma premissa declarada — com uma referência, emitem');
P.push('juízo por faixa, e a fonte não declara a faixa. **Não inventar (P6).** São candidatos a');
P.push('tolerância declarada, e a decisão é do Founder:');
P.push('');
P.push('| Instrumento | O que se pede |');
P.push('|---|---|');
for (const id of revisaoIds)
  P.push(`| \`${id}\` · ${tit(id)} | ${esc(byId[id].tolerancia.pedido)} |`);
P.push('');
P.push('Até a decisão, os cinco descrevem o desvio e **não aprovam nem reprovam**.');
P.push('');
P.push('O caso do `m12-inst-02` é o mais urgente dos cinco: o texto do veredito da fonte já diz, com');
P.push('todas as letras, que o resultado é consistente quando fica **dentro de dois pontos percentuais**');
P.push('do valor oficial. Ou isso é tolerância declarada — e então o veredito dentro/fora é legítimo ali');
P.push('—, ou é limiar de ramo de texto. A extração registrou `tolerancias: null`; a frase diz outra');
P.push('coisa. É reconciliação de uma linha.');
P.push('');

P.push('## Onda 1 — as famílias de figura, feitas uma vez');
P.push('');
P.push('Doze famílias cobrem quase toda a dívida de desenho. Construí-las antes dos módulos é o que');
P.push('transforma um inventário de figuras num sistema — e é o que faz a Alexandria parecer uma coisa');
P.push('só, em vez de 165 coisas.');
P.push('');
P.push('| Família | Instrumentos | Custo isolado | O que é |');
P.push('|---|---:|---:|---|');
let totalFamilias = 0;
for (const [nome, desc, ids] of FAMILIAS) {
  const v = ids.filter(id => byId[id]);
  totalFamilias += soma(v);
  P.push(`| **${nome}** | ${v.length} | ${br(soma(v))} d | ${esc(desc)} |`);
}
const cobertos = new Set(FAMILIAS.flatMap(f => f[2]).filter(id => byId[id]));
P.push('');
P.push(`As doze cobrem **${cobertos.size} dos ${instrumentos.length} instrumentos**. Somadas isoladamente dariam ${br(totalFamilias)} dias; feitas como`);
P.push('componente parametrizável, a conta vira o custo de doze figuras mais a parametrização de cada uso.');
P.push('');
for (const [nome, , ids] of FAMILIAS) {
  const v = ids.filter(id => byId[id]);
  P.push(`**${nome}** — ${v.map(id => '`' + id + '`').join(', ')}`);
  P.push('');
}

P.push('## Onda 2 — os 55 que não têm porte nenhum');
P.push('');
P.push(`Os módulos **${MODULOS_NAO_PORTADOS.join(', ')}** somam ${naoPortadosIds.length} instrumentos e nenhum objeto no código. Vêm primeiro`);
P.push('porque a ausência aqui é total: não é uma figura faltando, é a aula sem o instrumento que ela');
P.push('invoca.');
P.push('');
P.push('A ordem dentro da onda é por módulo, e dentro do módulo é a da fonte — o instrumento de módulo');
P.push('(§ MAP) primeiro, porque enquadra os outros, e depois aula a aula. Meio módulo portado não é');
P.push('metade de um módulo utilizável.');
P.push('');
P.push(`Total da onda: **${br(soma(naoPortadosIds))} dias de figura**, antes do desconto das famílias.`);
P.push('');
for (const m of MODULOS_NAO_PORTADOS) {
  const sub = instrumentos.filter(i => i.identidade.modulo === m);
  P.push(`### ${m} — ${sub.length} instrumentos · ${br(soma(sub.map(i => i.identidade.id)))} dias de figura`);
  P.push('');
  P.push('| # | Instrumento | Estado da forma | Custo | Família |');
  P.push('|---|---|---|---|---|');
  sub.forEach((i, k) => {
    const id = i.identidade.id;
    const fam = FAMILIAS.filter(f => f[2].includes(id)).map(f => f[0].split(' · ')[0]).join(', ') || '—';
    P.push(`| ${k + 1} | \`${id}\` · ${esc(tit(id))} | ${esc(est(id))} | ${cst(id)} | ${fam} |`);
  });
  P.push('');
}

P.push('## Onda 3 — a figura que a fonte tem e o porte perdeu');
P.push('');
P.push('Casos em que **não há nada a projetar**: o HTML original desenha e o objeto no código guardou só');
P.push('os readouts. Custo baixo, ganho alto, e cada um fecha um problema que o bar registra por nome.');
P.push('');
if (alertaDePorteIds.length) {
  P.push('| Instrumento | Alerta |');
  P.push('|---|---|');
  for (const id of alertaDePorteIds) P.push(`| \`${id}\` · ${tit(id)} | ${esc(byId[id].forma_prometida.alerta_de_porte)} |`);
} else P.push('*(nenhum)*');
P.push('');
P.push(`Além desses, **todo instrumento marcado “cumprido na fonte” tem desenho declarado na extração — são ${contagens.forma_prometida.cumprida_na_fonte}.**`);
P.push('Antes de desenhar qualquer um deles do zero, abrir o `desenho_declarado_na_fonte`');
P.push('correspondente: legenda, rótulo de eixo, cor por série e viewBox costumam estar literais.');
P.push('');

const ondaQuatro = promessaSemDesenhoIds.filter(id => !MODULOS_NAO_PORTADOS.includes(byId[id].identidade.modulo));
P.push('## Onda 4 — as promessas sem desenho nos módulos já portados');
P.push('');
P.push(`São ${ondaQuatro.length} instrumentos fora dos cinco módulos da Onda 2: existem no código, funcionam, e não`);
P.push('desenham o que o nome promete. Vêm por último porque a tela já tem alguma coisa — mas é aqui que');
P.push('está a diferença entre um instrumento que calcula e um que ensina.');
P.push('');
P.push(`Total da onda: **${br(soma(ondaQuatro))} dias de figura.**`);
P.push('');
P.push('| Instrumento | O que falta desenhar | Custo |');
P.push('|---|---|---|');
for (const id of ondaQuatro)
  P.push(`| \`${id}\` · ${esc(tit(id))} | ${esc((byId[id].forma_prometida.o_que_desenhar || '').slice(0, 200))}… | ${cst(id)} |`);
P.push('');

P.push('## Tabela completa — os 165, com custo, tolerância e previsão');
P.push('');
P.push('| Instrumento | Promete forma | Estado | Custo | Tolerância | Previsão |');
P.push('|---|---|---|---|---|---|');
for (const i of instrumentos) {
  const id = i.identidade.id;
  P.push(`| \`${id}\` · ${esc(tit(id)).slice(0, 62)} | ${i.forma_prometida.promete === true ? 'sim' : (i.forma_prometida.promete === false ? 'não' : '—')} | ${esc(est(id)).slice(0, 46)} | ${cst(id)} | ${i.tolerancia.declarada_pela_fonte ? '**declarada**' : (i.tolerancia.revisao_tecnica_pedida ? 'revisão pedida' : 'null')} | ${i.previsao.util === true ? (i.previsao.bloqueio ? 'bloqueada' : 'sim') : (i.previsao.util === false ? 'outro ato' : '—')} |`);
}
P.push('');

fs.writeFileSync(path.join(SAIDA, 'PORTAR.md'), P.join('\n'));
console.log('PORTAR.md gerado.');
