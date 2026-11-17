// Fixtures de CAPTURA da Alexandria v2 (bar §8, "Estados").
//
// Existem só dentro do harness: o Playwright intercepta /api/* e responde
// com estes corpos. Nenhum arquivo de produto importa este módulo, e nada
// daqui chega ao build. Toda captura que usa um estado ≠ E0 declara a
// fixture na legenda (legend.json → "fixture").
//
// E0 = visitante sem sessão (o /api/auth/me responde 401, como em produção).
// E1 = conta sem eventos. E2 = Trilha 1 em curso. E2b = Trilha 2 em curso.
// E3 = E2 + estado de revisão (o backend ainda não tem campo para "a revisar";
//      ver bar §9 — o harness não inventa esse campo).

const AGORA = '2026-09-16T15:00:00.000Z';

const usuario = (id, name) => ({
  id,
  email: `${id}@fixture.invalid`,
  name,
  authMethods: ['password'],
  createdAt: '2026-08-01T12:00:00.000Z',
  updatedAt: AGORA,
});

// Sequência no contrato da Peça D (`streak_payload`): conta sem dia de
// estudo é `semRegistro: true` com números null — nunca "0 dias".
const DIA = { fuso: 'America/Sao_Paulo', diaDeReferencia: '2026-09-16' };
const SEM_REGISTRO = { ...DIA, atual: null, maior: null, ultimoDiaAtivo: null, maiorAte: null, semRegistro: true };
export { SEM_REGISTRO };

const range = (mod, from, to) =>
  Array.from({ length: to - from + 1 }, (_, i) => `aula-${mod}-${String(from + i).padStart(2, '0')}`);

export const FIXTURES = {
  E0: { user: null, progress: null, aulas: {} },
  E1: {
    user: usuario('fixture-e1', 'Aprendiz Novo'),
    progress: { aulasConcluidas: [], aulasEmAndamento: [], badges: [], streak: SEM_REGISTRO },
    aulas: {},
  },
  E2: {
    user: usuario('fixture-e2', 'Marina Costa'),
    progress: {
      aulasConcluidas: range('01', 1, 7),
      aulasEmAndamento: ['aula-01-08'],
      badges: [],
      streak: { ...DIA, atual: 3, maior: 5, ultimoDiaAtivo: '2026-09-16', maiorAte: '2026-09-02', semRegistro: false },
    },
    aulas: {
      'aula-01-08': { status: 'em_andamento', startedAt: '2026-09-14T22:10:00.000Z', completedAt: null },
    },
  },
  E2b: {
    user: usuario('fixture-e2b', 'Rafael Nunes'),
    progress: {
      aulasConcluidas: [...range('01', 1, 9), ...range('02', 1, 10), ...range('03', 1, 10), ...range('04', 1, 7), ...range('05', 1, 6)],
      aulasEmAndamento: ['aula-06-01'],
      badges: [],
      streak: { ...DIA, atual: 1, maior: 12, ultimoDiaAtivo: '2026-09-16', maiorAte: '2026-08-28', semRegistro: false },
    },
    aulas: {
      'aula-06-01': { status: 'em_andamento', startedAt: '2026-09-15T11:30:00.000Z', completedAt: null },
    },
  },
};
FIXTURES.E3 = { ...FIXTURES.E2, user: usuario('fixture-e3', 'Marina Costa') };

export const FIXED_TIME = AGORA;
