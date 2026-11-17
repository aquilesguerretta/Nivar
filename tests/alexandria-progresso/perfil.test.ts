// Perfil da Alexandria (V2): XP, nível, medalhas derivadas, faixas, histórico, calendário.
// `npm run test:progresso`.

import assert from 'node:assert/strict';
import test from 'node:test';
import {
  calendario,
  diaEmQueAlcancouSequencia,
  diaEmQueSomouDias,
  faixaDestravada,
  faixaEmUso,
  FAIXAS,
  historico,
  inicioDoNivel,
  medalhasDerivadas,
  nivelDe,
  xpTotal,
  type DiaDeEstudo,
  type PrimeiraVez,
} from '../../src/lib/alexandria/perfil/regras.ts';
import { palavrasProibidasEm } from '../../src/lib/alexandria/progresso/conquistas.ts';

const d = (dia: string, eventos = 1): DiaDeEstudo => ({ dia, eventos });
const p = (tipo: string, entityId: string, em: string, aulaId: string | null = null): PrimeiraVez => ({ tipo, entityId, em, aulaId });

test('XP: só a primeira vez vale, e cada dia de estudo soma 5', () => {
  const primeiras = [
    p('aula_iniciada', 'aula-01-01', '2026-11-01T12:00:00Z'),
    p('aula_concluida', 'aula-01-01', '2026-11-01T13:00:00Z'),
    p('exercicio_respondido', 'aula-01-01#ex-1', '2026-11-01T13:10:00Z'),
    p('instrumento_usado', 'lab-01', '2026-11-02T13:10:00Z'),
    p('badge_conquistado', 'x', '2026-11-02T13:10:00Z'),
  ];
  assert.equal(xpTotal(primeiras, [d('2026-11-01', 3), d('2026-11-02'), d('2026-11-03', 0)]), 50 + 10 + 15 + 2 * 5);
  assert.equal(xpTotal([], []), 0);
});

test('nível: limiares 0, 100, 300, 600, 1000 e fração dentro do nível', () => {
  assert.deepEqual([1, 2, 3, 4, 5].map(inicioDoNivel), [0, 100, 300, 600, 1000]);
  assert.equal(nivelDe(0).nivel, 1);
  assert.equal(nivelDe(99).nivel, 1);
  assert.equal(nivelDe(100).nivel, 2);
  const n = nivelDe(450);
  assert.equal(n.nivel, 3);
  assert.equal(n.inicio, 300);
  assert.equal(n.proximo, 600);
  assert.equal(n.fracao, 0.5);
  assert.equal(nivelDe(-10).nivel, 1);
});

test('sequência: dia em que a corrida de N foi alcançada', () => {
  const dias = [d('2026-11-01'), d('2026-11-02'), d('2026-11-04'), d('2026-11-05'), d('2026-11-06'), d('2026-11-07', 0)];
  assert.equal(diaEmQueAlcancouSequencia(dias, 2), '2026-11-02');
  assert.equal(diaEmQueAlcancouSequencia(dias, 3), '2026-11-06');
  assert.equal(diaEmQueAlcancouSequencia(dias, 4), null);
  // atravessa virada de mês
  assert.equal(diaEmQueAlcancouSequencia([d('2026-10-31'), d('2026-11-01')], 2), '2026-11-01');
  assert.equal(diaEmQueSomouDias(dias, 5), '2026-11-06');
  assert.equal(diaEmQueSomouDias(dias, 6), null);
});

test('medalhas derivadas: hábito, territórios e instrumentos', () => {
  const territorio = (id: string) => ({ '01': 'I', '06': 'II', '12': 'III' } as Record<string, string>)[id.slice(5, 7)] ?? null;
  const primeiras = [
    p('aula_iniciada', 'aula-01-01', '2026-11-01T12:00:00Z'),
    p('aula_iniciada', 'aula-06-01', '2026-11-03T12:00:00Z'),
    p('aula_concluida', 'aula-12-02', '2026-11-05T12:00:00Z'),
    p('instrumento_usado', 'lab-01', '2026-11-02T12:00:00Z'),
  ];
  const dias = [d('2026-11-01'), d('2026-11-02'), d('2026-11-03')];
  const m = medalhasDerivadas({ dias, primeiras, territorioDaAula: territorio });
  const por = (id: string) => m.find((x) => x.id === id)!;
  assert.equal(por('habito.sequencia.3').obtidaEm, '2026-11-03');
  assert.equal(por('habito.sequencia.7').obtidaEm, null);
  assert.equal(por('habito.sequencia.7').feito, 3);
  assert.equal(por('exploracao.tres-territorios-abertos').obtidaEm, '2026-11-05T12:00:00Z');
  assert.equal(por('exploracao.instrumentos.1').obtidaEm, '2026-11-02T12:00:00Z');
  assert.equal(por('exploracao.instrumentos.10').feito, 1);
  for (const x of m) assert.deepEqual(palavrasProibidasEm(`${x.nome} ${x.criterio}`), [], x.id);
});

test('faixas: nunca mostra uma faixa não destravada', () => {
  const nada = { aulasConcluidas: 0, territoriosComModulo: new Set<string>(), nivel: 1 };
  assert.equal(faixaEmUso('trilha-ii', nada).id, 'papel');
  assert.equal(faixaEmUso('inexistente', nada).id, 'papel');
  const algo = { aulasConcluidas: 9, territoriosComModulo: new Set(['II']), nivel: 5 };
  assert.equal(faixaEmUso('trilha-ii', algo).id, 'trilha-ii');
  assert.equal(faixaDestravada('trilha-i', algo), false);
  assert.equal(faixaDestravada('sala-de-aula', algo), true);
  assert.ok(FAIXAS.every((f) => /^[a-z0-9][a-z0-9-]{0,63}$/.test(f.id)), 'ids aceitos pelo backend');
});

test('histórico: agrupa por dia no fuso e soma o XP do dia', () => {
  const h = historico(
    [
      // 02:00 UTC de 2/nov = 23:00 de 1/nov em São Paulo
      p('aula_concluida', 'aula-01-01', '2026-11-02T02:00:00Z'),
      p('exercicio_respondido', 'aula-01-01#ex-1', '2026-11-01T20:00:00Z'),
      p('instrumento_usado', 'lab-01', '2026-11-03T15:00:00Z'),
    ],
    'America/Sao_Paulo',
  );
  assert.deepEqual(h.map((x) => x.dia), ['2026-11-03', '2026-11-01']);
  assert.deepEqual(h[1].aulasConcluidas, ['aula-01-01']);
  assert.equal(h[1].exercicios, 1);
  assert.equal(h[1].xp, 5 + 50 + 10);
});

test('calendário: semanas de domingo a sábado, terminando hoje', () => {
  const c = calendario([d('2026-11-15', 3), d('2026-11-09', 12)], '2026-11-15', 2);
  assert.equal(c.length, 2);
  assert.equal(c[0][0].dia, '2026-11-08'); // domingo
  assert.equal(c[1][0].dia, '2026-11-15'); // 15/11/2026 é domingo
  assert.equal(c[1][0].tom, 2);
  assert.equal(c[0][1].tom, 4);
  assert.ok(c[1][1].futuro);
});

test('semana de XP, melhor dia e turno', async () => {
  const { xpPorDia, semanaDeXp, melhorDia, turnoPreferido } = await import('../../src/lib/alexandria/perfil/regras.ts');
  const prim = [
    p('aula_concluida', 'aula-01-01', '2026-11-14T23:00:00Z'), // 20h em SP, dia 14
    p('exercicio_respondido', 'aula-01-01#ex-1', '2026-11-15T22:00:00Z'), // 19h, dia 15
    p('instrumento_usado', 'lab-1', '2026-11-05T13:00:00Z'), // 10h, dia 5
  ];
  const m = xpPorDia(prim, [d('2026-11-14'), d('2026-11-15'), d('2026-11-05'), d('2026-11-10', 0)], 'America/Sao_Paulo');
  assert.equal(m.get('2026-11-14'), 55);
  assert.equal(m.get('2026-11-15'), 15);
  assert.equal(m.get('2026-11-05'), 20);
  assert.equal(m.has('2026-11-10'), false);
  const s = semanaDeXp(m, '2026-11-15');
  assert.equal(s.dias.length, 7);
  assert.equal(s.dias[6].dia, '2026-11-15');
  assert.equal(s.total, 70);
  assert.equal(s.anterior, 20);
  assert.deepEqual(melhorDia(m), { dia: '2026-11-14', xp: 55 });
  assert.equal(turnoPreferido(prim, 'America/Sao_Paulo')?.turno, 'noite');
  assert.equal(turnoPreferido([], 'America/Sao_Paulo'), null);
});
