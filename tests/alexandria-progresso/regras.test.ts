// Lógica pura do registro de progresso da Alexandria (v3, eventos).
// `npm run test:progresso`.

import assert from 'node:assert/strict';
import test from 'node:test';
import {
  criarAgrupador,
  ehGestoDeInicio,
  fimPassouPelaTela,
  formatarDia,
  fraseDaSequencia,
  idDoAto,
  montarMetadataDePratica,
  TETO_DA_RESPOSTA,
  vereditoDeConclusao,
  type Relogio,
  type SequenciaParaFrase,
  type SinaisDeConclusao,
} from '../../src/lib/alexandria/progresso/regras.ts';

// ── Pré-condição de conclusão ────────────────────────────────

const pronto: SinaisDeConclusao = { conta: 'conta', iniciou: true, chegouAoFim: true, status: 'em_andamento' };

test('conclusão: conta + gesto + fim do texto = pode', () => {
  assert.deepEqual(vereditoDeConclusao(pronto), { pode: true });
  assert.deepEqual(vereditoDeConclusao({ ...pronto, status: null }), { pode: true });
});

test('conclusão: sem conta nunca registra, e diz por quê', () => {
  const v = vereditoDeConclusao({ ...pronto, conta: 'visitante' });
  assert.equal(v.pode, false);
  assert.equal(v.pode === false && v.falta, 'conta');
  assert.match(v.pode === false ? v.frase : '', /nada é enviado/);
});

test('conclusão: sessão ainda carregando não é visitante nem conta', () => {
  const v = vereditoDeConclusao({ ...pronto, conta: 'carregando' });
  assert.equal(v.pode === false && v.falta, 'verificando-conta');
});

test('conclusão: abrir a rota (fim visível, sem gesto) NÃO conclui', () => {
  const v = vereditoDeConclusao({ ...pronto, iniciou: false });
  assert.equal(v.pode === false && v.falta, 'inicio');
});

test('conclusão: gesto sem o fim do texto NÃO conclui — ato não substitui leitura', () => {
  const v = vereditoDeConclusao({ ...pronto, chegouAoFim: false });
  assert.equal(v.pode === false && v.falta, 'fim-do-texto');
});

test('conclusão: aula já percorrida não registra de novo', () => {
  const v = vereditoDeConclusao({ ...pronto, status: 'concluido' });
  assert.equal(v.pode === false && v.falta, 'ja-registrada');
});

test('conclusão: nenhuma frase diz "concluída" — a aula é percorrida', () => {
  for (const sinais of [
    { ...pronto, conta: 'visitante' as const },
    { ...pronto, conta: 'carregando' as const },
    { ...pronto, iniciou: false },
    { ...pronto, chegouAoFim: false },
    { ...pronto, status: 'concluido' as const },
  ]) {
    const v = vereditoDeConclusao(sinais);
    assert.equal(v.pode, false);
    assert.doesNotMatch(v.pode === false ? v.frase : '', /conclu[íi]da/i);
  }
});

test('fim do texto: visível ou já acima da tela conta; abaixo não; janela sem altura não', () => {
  assert.equal(fimPassouPelaTela(400, 900), true); // na tela
  assert.equal(fimPassouPelaTela(-5000, 900), true); // pulou por cima (tecla End)
  assert.equal(fimPassouPelaTela(900, 900), true); // na borda
  assert.equal(fimPassouPelaTela(901, 900), false); // ainda abaixo
  assert.equal(fimPassouPelaTela(0, 0), false); // painel oculto
  assert.equal(fimPassouPelaTela(Number.NaN, 900), false);
});

// ── Gesto de início ──────────────────────────────────────────

test('início: clique, roda e toque dentro da aula ou no contêiner que rola', () => {
  for (const tipo of ['pointerdown', 'wheel', 'touchmove'] as const) {
    assert.equal(ehGestoDeInicio({ tipo, relacao: 'dentro', confiavel: true }), true, tipo);
    assert.equal(ehGestoDeInicio({ tipo, relacao: 'ancestral', confiavel: true }), true, tipo);
    assert.equal(ehGestoDeInicio({ tipo, relacao: 'fora', confiavel: true }), false, tipo);
  }
});

test('início: evento sintético (isTrusted false) nunca conta', () => {
  assert.equal(ehGestoDeInicio({ tipo: 'pointerdown', relacao: 'dentro', confiavel: false }), false);
  assert.equal(ehGestoDeInicio({ tipo: 'input', relacao: 'dentro', confiavel: false }), false);
});

test('início: digitar só conta dentro da aula', () => {
  assert.equal(ehGestoDeInicio({ tipo: 'input', relacao: 'dentro', confiavel: true }), true);
  assert.equal(ehGestoDeInicio({ tipo: 'input', relacao: 'ancestral', confiavel: true }), false);
});

test('início: Tab move foco, não começa a aula; tecla de rolagem começa', () => {
  assert.equal(ehGestoDeInicio({ tipo: 'keydown', relacao: 'ancestral', tecla: 'Tab', confiavel: true }), false);
  assert.equal(ehGestoDeInicio({ tipo: 'keydown', relacao: 'dentro', tecla: 'Tab', confiavel: true }), false);
  assert.equal(ehGestoDeInicio({ tipo: 'keydown', relacao: 'ancestral', tecla: 'PageDown', confiavel: true }), true);
  assert.equal(ehGestoDeInicio({ tipo: 'keydown', relacao: 'ancestral', tecla: ' ', confiavel: true }), true);
  assert.equal(ehGestoDeInicio({ tipo: 'keydown', relacao: 'ancestral', tecla: 'a', confiavel: true }), false);
  assert.equal(ehGestoDeInicio({ tipo: 'keydown', relacao: 'dentro', tecla: 'a', confiavel: true }), true);
  assert.equal(ehGestoDeInicio({ tipo: 'keydown', relacao: 'fora', tecla: 'PageDown', confiavel: true }), false);
});

// ── Frase da sequência ───────────────────────────────────────

const base: SequenciaParaFrase = {
  atual: null,
  maior: null,
  ultimoDiaAtivo: null,
  maiorAte: null,
  diaDeReferencia: '2026-11-14',
  semRegistro: true,
};

test('sequência: nunca estudou ≠ estudou e parou — frases diferentes', () => {
  const nunca = fraseDaSequencia(base);
  const parada = fraseDaSequencia({
    ...base,
    semRegistro: false,
    atual: 0,
    maior: 5,
    ultimoDiaAtivo: '2026-11-02',
    maiorAte: '2026-09-12',
  });
  assert.equal(nunca.caso, 'nunca');
  assert.equal(parada.caso, 'parada');
  assert.notEqual(nunca.principal, parada.principal);
  // "Nunca" não imprime zero: zero é medida e ali não há medida.
  assert.doesNotMatch(nunca.principal, /\b0\b/);
  assert.equal(nunca.recorde, null);
  assert.equal(parada.detalhe, 'Último dia com estudo registrado: 2 nov. 2026.');
  assert.equal(parada.recorde, 'A mais longa: 5 dias seguidos, até 12 set. 2026.');
});

test('sequência: semRegistro manda mesmo com número presente', () => {
  assert.equal(fraseDaSequencia({ ...base, atual: 0, semRegistro: true }).caso, 'nunca');
});

test('sequência viva: hoje, ontem, e recorde só quando maior que a atual', () => {
  const hoje = fraseDaSequencia({
    ...base,
    semRegistro: false,
    atual: 3,
    maior: 3,
    ultimoDiaAtivo: '2026-11-14',
    maiorAte: '2026-11-14',
  });
  assert.equal(hoje.caso, 'viva');
  assert.equal(hoje.principal, '3 dias seguidos com estudo registrado.');
  assert.equal(hoje.detalhe, null);
  assert.equal(hoje.recorde, null);

  const ontem = fraseDaSequencia({
    ...base,
    semRegistro: false,
    atual: 1,
    maior: 12,
    ultimoDiaAtivo: '2026-11-13',
    maiorAte: '2026-10-01',
  });
  assert.equal(ontem.principal, '1 dia com estudo registrado na sequência atual.');
  assert.match(ontem.detalhe ?? '', /segue até o fim do dia/);
  assert.equal(ontem.recorde, 'A mais longa: 12 dias seguidos, até 1 out. 2026.');
});

test('sequência: nenhuma frase alega competência', () => {
  const casos: SequenciaParaFrase[] = [
    base,
    { ...base, semRegistro: false, atual: 0, maior: 4, ultimoDiaAtivo: '2026-11-01', maiorAte: '2026-10-01' },
    { ...base, semRegistro: false, atual: 7, maior: 9, ultimoDiaAtivo: '2026-11-13', maiorAte: '2026-08-30' },
  ];
  for (const c of casos) {
    const f = fraseDaSequencia(c);
    const texto = [f.principal, f.detalhe, f.recorde].filter(Boolean).join(' ');
    assert.doesNotMatch(texto, /aprend|sabe|domin|mestre|especialista|%/i);
  }
});

test('formatarDia: determinístico, e dado fora do formato volta como veio', () => {
  assert.equal(formatarDia('2026-05-03'), '3 maio 2026');
  assert.equal(formatarDia('2026-12-31'), '31 dez. 2026');
  assert.equal(formatarDia('2026-13-01'), '2026-13-01');
  assert.equal(formatarDia('ontem'), 'ontem');
});

// ── Metadata da prática ──────────────────────────────────────

test('metadata: exercício leva aulaId, moduloId, ato, antesDaReferencia e a resposta', () => {
  const m = montarMetadataDePratica({
    tipo: 'exercicio_respondido',
    entidadeId: 'ex-06',
    aulaId: 'aula-01-08',
    moduloId: 'modulo-01',
    ato: 'exercicio',
    resposta: '  30 % · sim  ',
    antesDaReferencia: true,
  });
  assert.deepEqual(m, {
    aulaId: 'aula-01-08',
    moduloId: 'modulo-01',
    ato: 'exercicio',
    antesDaReferencia: true,
    resposta: '30 % · sim',
  });
});

test('metadata: sem aulaId (ou só espaço) o evento não sai', () => {
  const ev = {
    tipo: 'exercicio_respondido' as const,
    entidadeId: 'ex-01',
    ato: 'exercicio' as const,
    antesDaReferencia: true,
  };
  assert.equal(montarMetadataDePratica({ ...ev, aulaId: '' }), null);
  assert.equal(montarMetadataDePratica({ ...ev, aulaId: '   ' }), null);
  assert.equal(montarMetadataDePratica({ ...ev, aulaId: 'aula-01-01', entidadeId: '' }), null);
});

test('metadata: resposta acima do teto é cortada E o corte é declarado', () => {
  const m = montarMetadataDePratica({
    tipo: 'exercicio_respondido',
    entidadeId: 'ex-01',
    aulaId: 'aula-01-01',
    ato: 'exercicio',
    resposta: 'x'.repeat(TETO_DA_RESPOSTA + 10),
    antesDaReferencia: false,
  });
  assert.equal((m?.resposta as string).length, TETO_DA_RESPOSTA);
  assert.equal(m?.respostaTruncada, true);
  assert.equal(m?.antesDaReferencia, false);
});

test('metadata: resposta vazia não vira campo', () => {
  const m = montarMetadataDePratica({
    tipo: 'exercicio_respondido',
    entidadeId: 'ex-01',
    aulaId: 'aula-01-01',
    ato: 'previsao',
    resposta: '   ',
    antesDaReferencia: true,
  });
  assert.equal(m && 'resposta' in m, false);
});

test('metadata: instrumento leva modo, alterouParametro e só valores sãos', () => {
  const m = montarMetadataDePratica({
    tipo: 'instrumento_usado',
    entidadeId: 'inst-06',
    aulaId: 'aula-01-08',
    modo: 'ajuste',
    valores: { geracao: 438000, capacidade: 100, ruim: Number.NaN, vazio: undefined, cat: 'ger', longo: 'y'.repeat(200) },
  });
  assert.deepEqual(m, {
    aulaId: 'aula-01-08',
    modo: 'ajuste',
    alterouParametro: true,
    valores: { geracao: 438000, capacidade: 100, cat: 'ger' },
  });
  const c = montarMetadataDePratica({ tipo: 'instrumento_usado', entidadeId: 'm08-inst-04-cap', aulaId: 'aula-08-04', modo: 'correcao' });
  assert.equal(c?.alterouParametro, false);
  assert.equal(c && 'valores' in c, false);
});

test('idDoAto: estável e legível', () => {
  assert.equal(idDoAto('aula-01-08', 'previsao'), 'aula-01-08#previsao');
});

// ── Agrupador de uso de instrumento ──────────────────────────

function relogioFalso() {
  let agora = 0;
  let seq = 0;
  const timers = new Map<number, { quando: number; fn: () => void }>();
  const relogio: Relogio = {
    setTimeout: (fn, ms) => {
      seq += 1;
      timers.set(seq, { quando: agora + ms, fn });
      return seq;
    },
    clearTimeout: (id) => {
      timers.delete(id as number);
    },
  };
  const avancar = (ms: number) => {
    agora += ms;
    for (const [id, t] of [...timers].sort((a, b) => a[1].quando - b[1].quando)) {
      if (t.quando <= agora) {
        timers.delete(id);
        t.fn();
      }
    }
  };
  return { relogio, avancar };
}

test('agrupador: um arrasto de régua vira UM evento, com o valor assentado', () => {
  const { relogio, avancar } = relogioFalso();
  const emitidos: [string, number][] = [];
  const g = criarAgrupador<number>(1200, (k, v) => emitidos.push([k, v]), relogio);
  for (let v = 1; v <= 50; v++) {
    g.empurrar('inst-06', v);
    avancar(30);
  }
  assert.equal(emitidos.length, 0);
  avancar(1200);
  assert.deepEqual(emitidos, [['inst-06', 50]]);
});

test('agrupador: instrumentos diferentes não se misturam', () => {
  const { relogio, avancar } = relogioFalso();
  const emitidos: string[] = [];
  const g = criarAgrupador<number>(1000, (k) => emitidos.push(k), relogio);
  g.empurrar('a', 1);
  g.empurrar('b', 1);
  avancar(1000);
  assert.deepEqual(emitidos.sort(), ['a', 'b']);
});

test('agrupador: descarregar (saída da aula) emite o pendente uma vez', () => {
  const { relogio, avancar } = relogioFalso();
  const emitidos: number[] = [];
  const g = criarAgrupador<number>(1000, (_k, v) => emitidos.push(v), relogio);
  g.empurrar('inst-06', 7);
  g.descarregar();
  avancar(5000);
  assert.deepEqual(emitidos, [7]);
  assert.equal(g.pendentes, 0);
});
