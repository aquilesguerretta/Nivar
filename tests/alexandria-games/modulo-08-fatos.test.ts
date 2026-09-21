// LYCEUM Wave 40 — teste de invariante de divergência do Módulo 08.
//
// O QUE ELE IMPEDE: o mesmo fato aparecer com dois valores no conteúdo
// de aula e no jogo. A auditoria da Wave 40 conferiu os 18 números do
// jogo contra a fonte HTML original e não achou divergência ativa — mas
// concordar hoje não é estar ligado, e duas cópias digitadas à mão
// divergem no primeiro dia em que alguém corrigir uma só.
//
// O QUE ELE NÃO IMPEDE: número genuinamente diferente existir. Ele não
// exige que os dois arquivos citem os mesmos fatos, nem proíbe grandeza
// nova — só cobra que, onde os dois falam do MESMO fato, o valor seja o
// mesmo, e que esse valor venha da camada canônica.
//
// Roda com: npm run test:games

import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { test } from 'node:test';

import {
  M08_FATOS,
  M08_UNIVERSOS_CAPACIDADE,
  M08_CAPACIDADE_POR_FONTE,
  M08_CAPACIDADE_TOTAL_GW,
  M08_FATIA_CAPACIDADE_PCT,
} from '../../src/lib/data/alexandria-modulo-08-fatos.ts';
import { MODULO_08_GAME } from '../../src/lib/games/modulo-08-game-data.ts';

// O arquivo de conteúdo NÃO é importado como módulo: ele e a cadeia de
// arquivos que ele puxa usam import sem extensão (a convenção do app,
// que o Vite resolve e o runner do node não). Ler como TEXTO evita
// acoplar este teste àquela convenção — e, para o que ele precisa
// provar, texto é prova mais forte: pega inclusive alguém redigitando
// a tabela em vez de reexportá-la.

const raiz = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const ler = (p: string) => readFileSync(resolve(raiz, p), 'utf8');

const CONTEUDO = ler('src/lib/data/alexandria-modulo-08-content.ts');
/** Toda a prosa que o jogo renderiza — claim, context, reconstruction,
 *  assistance. Interpolada, então o que se lê aqui é o valor final. */
const PROSA_DO_JOGO = MODULO_08_GAME.documents
  .map((d) => [d.claim, d.context, d.reconstruction, d.assistance ?? ''].join(' '))
  .join('\n');

/** Fatos que os dois lados citam, com quantas vezes cada texto canônico
 *  aparece hoje em cada arquivo.
 *
 *  A CONTAGEM é o mecanismo, e não a mera presença. A primeira versão
 *  deste teste usava `includes`, e a sabotagem de fechamento mostrou que
 *  ela não pegava o caso que mais importa: `86,8%` aparece TRÊS vezes no
 *  conteúdo, então trocar uma delas por `87,4%` deixava as outras duas
 *  satisfazendo o `includes` e o teste passava verde. Contar fecha esse
 *  buraco — mudar uma ocorrência de três derruba de 3 para 2 e quebra.
 *
 *  `jogo: 0` significa que o jogo não cita aquele fato em prosa (ele usa
 *  o valor cru interpolado, como o limiar de 230 kV e os 725 km); nesses
 *  o teste cobra só o lado do conteúdo.
 *
 *  SE VOCÊ ADICIONOU UMA MENÇÃO LEGÍTIMA e o teste quebrou: suba o número
 *  aqui. A quebra é o ponto — obriga a passar pela camada canônica em vez
 *  de digitar um valor solto. */
const FATOS_COMPARTILHADOS: {
  chave: keyof typeof M08_FATOS;
  conteudo: number;
  jogo: number;
}[] = [
  { chave: 'renovabilidadeEletrica', conteudo: 3, jogo: 4 },
  { chave: 'solarCapacidade', conteudo: 2, jogo: 2 },
  { chave: 'solarGeracao', conteudo: 2, jogo: 2 },
  { chave: 'curtailmentEnergetico2024', conteudo: 1, jogo: 1 },
  { chave: 'curtailmentContrafactual', conteudo: 1, jogo: 1 },
  { chave: 'corte2021', conteudo: 2, jogo: 1 },
  { chave: 'axiaParticipacao', conteudo: 2, jogo: 2 },
  { chave: 'axiaLimiarTensao', conteudo: 4, jogo: 0 },
  { chave: 'roraimaLinha', conteudo: 2, jogo: 0 },
];

const conta = (texto: string, alvo: string) => texto.split(alvo).length - 1;

test('TODA ocorrência do fato no CONTEÚDO DE AULA usa o valor canônico', () => {
  for (const { chave, conteudo } of FATOS_COMPARTILHADOS) {
    const fato = M08_FATOS[chave];
    assert.equal(
      conta(CONTEUDO, fato.texto),
      conteudo,
      `"${fato.texto}" (${chave} · ${fato.grandeza}) aparece ${conta(CONTEUDO, fato.texto)}x no conteúdo de aula, ` +
        `e o esperado era ${conteudo}x. Ou uma menção trocou de valor sem passar pela camada canônica, ` +
        'ou o valor canônico mudou sem atualizar a prosa, ou entrou uma menção nova que precisa ser registrada aqui.',
    );
  }
});

test('TODA ocorrência do fato na prosa do JOGO usa o valor canônico', () => {
  for (const { chave, jogo } of FATOS_COMPARTILHADOS) {
    const fato = M08_FATOS[chave];
    assert.equal(
      conta(PROSA_DO_JOGO, fato.texto),
      jogo,
      `"${fato.texto}" (${chave} · ${fato.grandeza}) aparece ${conta(PROSA_DO_JOGO, fato.texto)}x na prosa do jogo, ` +
        `e o esperado era ${jogo}x.`,
    );
  }
});

test('conteúdo e jogo não citam o mesmo fato com valores diferentes', () => {
  // O invariante em uma frase: onde os dois falam do mesmo fato, o
  // número é o mesmo — e é o da camada canônica.
  for (const { chave, conteudo, jogo } of FATOS_COMPARTILHADOS) {
    if (jogo === 0) continue; // o jogo não cita este em prosa
    const fato = M08_FATOS[chave];
    const noConteudo = conta(CONTEUDO, fato.texto);
    const noJogo = conta(PROSA_DO_JOGO, fato.texto);
    assert.ok(
      noConteudo === conteudo && noJogo === jogo && noConteudo > 0 && noJogo > 0,
      `divergência em ${chave}: conteúdo ${noConteudo}x (esperado ${conteudo}), jogo ${noJogo}x (esperado ${jogo}). ` +
        `Valor canônico: ${fato.texto} — ${fato.grandeza}, ${fato.universo}, ${fato.periodo}.`,
    );
  }
});

test('a capacidade solar do jogo é a MESMA da tabela por fonte', () => {
  const solar = M08_CAPACIDADE_POR_FONTE.find((s) => s.k === 'sol');
  assert.ok(solar, 'a tabela por fonte perdeu a linha da solar');
  assert.equal(
    solar.cap,
    M08_FATOS.solarCapacidade.valor,
    'a capacidade solar da tabela por fonte divergiu do fato canônico citado pelo jogo',
  );
});

test('o gabarito do Reconstrutor concorda com as fatias derivadas da tabela em GW', () => {
  // Este é o par que abriu a Wave 40 sob suspeita de divergência.
  // Não divergem: 64,8 GW ÷ 261,0 GW = 24,83 %, e o gabarito diz 24,8 %.
  // A tolerância é de 0,1 ponto porque o gabarito é arredondado a uma casa.
  const bloco = CONTEUDO.match(/cap:\s*\{([^}]*)\}/);
  assert.ok(bloco, 'não achei o bloco `cap` de M08_INST04_REF no arquivo de conteúdo');
  const gabarito: Record<string, number> = {};
  for (const m of bloco[1].matchAll(/'i4-(\w+)':\s*([\d.]+)/g)) {
    gabarito[m[1]] = Number(m[2]);
  }
  assert.equal(
    Object.keys(gabarito).length,
    M08_CAPACIDADE_POR_FONTE.length,
    `o gabarito tem ${Object.keys(gabarito).length} fontes e a tabela canônica tem ${M08_CAPACIDADE_POR_FONTE.length}`,
  );
  for (const fonte of M08_CAPACIDADE_POR_FONTE) {
    const derivada = M08_FATIA_CAPACIDADE_PCT[fonte.k];
    const declarado = gabarito[fonte.k];
    assert.ok(
      declarado !== undefined && Math.abs(derivada - declarado) <= 0.1,
      `${fonte.nome}: a fatia derivada de ${fonte.cap} GW é ${derivada.toFixed(2)}%, ` +
        `mas o gabarito do Reconstrutor diz ${declarado}%. Um dos dois mudou sem o outro.`,
    );
  }
});

test('a soma das seis fontes bate com o universo de conceito amplo da tabela do §00', () => {
  const amplo = M08_UNIVERSOS_CAPACIDADE[0];
  assert.ok(
    Math.abs(M08_CAPACIDADE_TOTAL_GW - amplo.gw) < 0.05,
    `a soma das seis fontes é ${M08_CAPACIDADE_TOTAL_GW.toFixed(1)} GW, ` +
      `mas a tabela do §00 declara ${amplo.rotulo} para o mesmo universo.`,
  );
});

test('o conteúdo de aula reexporta a tabela canônica, sem cópia própria', () => {
  // Se alguém redigitar a tabela no arquivo de conteúdo em vez de
  // reexportar, os dois voltam a poder divergir em silêncio.
  assert.match(
    CONTEUDO,
    /export const M08_INST02_SRC = M08_CAPACIDADE_POR_FONTE;/,
    'M08_INST02_SRC deixou de ser o reexport de M08_CAPACIDADE_POR_FONTE — virou cópia, e cópia diverge.',
  );
  // E o arquivo de conteúdo não pode voltar a declarar os GW à mão.
  for (const fonte of M08_CAPACIDADE_POR_FONTE) {
    assert.ok(
      !new RegExp(`cap:\\s*${fonte.cap}\\b`).test(CONTEUDO),
      `o arquivo de conteúdo voltou a digitar "cap: ${fonte.cap}" (${fonte.nome}) em vez de importar da camada canônica.`,
    );
  }
});

test('o jogo não cita número de planejamento ausente da fonte', () => {
  // O '78 GW' que a Wave 40 removeu: não existe em alexandria_modulo08.html.
  // Todo valor de planejamento citado tem que vir da tabela do §00.
  const doc = MODULO_08_GAME.documents.find((d) => d.id === 'm8-07');
  assert.ok(doc, 'o documento m8-07 sumiu');
  const prosa = [doc.claim, doc.context, doc.reconstruction, doc.assistance ?? ''].join(' ');
  assert.ok(
    !/\b78\s*GW\b/.test(prosa),
    'o m8-07 voltou a citar "78 GW", número que não existe na fonte do Módulo 08.',
  );
  const declarados = M08_UNIVERSOS_CAPACIDADE.map((u) => String(u.gw));
  const citados = [...prosa.matchAll(/\b(\d{2,4})\s*GW\b/g)].map((m) => m[1]);
  for (const c of citados) {
    assert.ok(
      declarados.includes(c),
      `o m8-07 cita ${c} GW, que não está na tabela dos quatro universos do §00 ` +
        `(declarados: ${declarados.join(', ')}).`,
    );
  }
});
