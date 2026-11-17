// Fixtures de CAPTURA da revisão espaçada (LYCEUM, 15/11/2026).
//
// Só para o harness: respondem `GET /api/progress/revisao` no lugar do
// backend. Nenhum arquivo de produto importa isto. Os estados reaproveitam
// usuário e progresso de `fixtures.mjs` e acrescentam o log de tentativas.
//
// "Hoje" do aluno é `HOJE` (o servidor diz o dia; o front não usa o relógio
// para agendar). Com a regra de `src/lib/alexandria/revisao/agenda.ts`:
//
//   R1 — conta COM itens vencidos: 5 vencidos (um de hoje, quatro atrasados)
//        e 1 que volta amanhã.
//   R2 — conta SEM item vencido, com agenda: só o que volta amanhã.
//   R0 — conta sem tentativa nenhuma (E1 + log vazio).
//   E0 — visitante: a rota de revisão nem é lida (o hook não chama sem conta).

import { FIXTURES } from './fixtures.mjs';

export const HOJE = '2026-11-15';

const ex = (entityId, aula, dia, extra = {}) => ({
  entityId,
  aulaId: `aula-01-${String(aula).padStart(2, '0')}`,
  moduloId: 'modulo-01',
  origem: null,
  autoavaliacao: null,
  resposta: 'resposta registrada na aula',
  respostaCortada: false,
  occurredAt: `${dia}T15:00:00+00:00`,
  dia,
  ...extra,
});
const rev = (entityId, aula, dia, autoavaliacao, extra = {}) =>
  ex(entityId, aula, dia, { origem: 'revisao', autoavaliacao, ...extra });

// volta amanhã (etapa 2: 9/11 + 7 dias = 16/11)
const EM_DIA = [
  ex('m01-ex-02', 2, '2026-11-05'),
  rev('m01-ex-02', 2, '2026-11-06', 'atende'),
  rev('m01-ex-02', 2, '2026-11-09', 'atende'),
];

const VENCIDOS = [
  // aberto, só a tentativa da aula (sem autoavaliação): volta no dia seguinte
  ex('m01-ex-01', 1, '2026-11-10'),
  // escolha errada na aula: "não atende" pela comparação
  ex('m01-a01-d01', 1, '2026-11-08', { resposta: 'alternativa que não é a da referência' }),
  // escolha certa na aula: atende, etapa 0
  ex('m01-a03-d01', 3, '2026-11-12', { resposta: 'A frequência da rede cai' }),
  // revisão anterior julgada "atende em parte"
  ex('m01-a02-d02', 2, '2026-11-01'),
  rev('m01-a02-d02', 2, '2026-11-02', 'atende'),
  rev('m01-a02-d02', 2, '2026-11-05', 'atende em parte'),
  // vence hoje
  ex('m01-ex-03', 4, '2026-11-14'),
];

const resposta = (tentativas) => ({
  fuso: 'America/Sao_Paulo',
  diaDeReferencia: HOJE,
  semRegistro: tentativas.length === 0,
  truncado: false,
  tentativas,
});

const streak = { fuso: 'America/Sao_Paulo', diaDeReferencia: HOJE, atual: 4, maior: 6, ultimoDiaAtivo: '2026-11-14', maiorAte: '2026-10-30', semRegistro: false };

export const FIXTURES_REVISAO = {
  E0: { ...FIXTURES.E0, revisao: null },
  R0: { ...FIXTURES.E1, revisao: resposta([]) },
  R1: { ...FIXTURES.E2, progress: { ...FIXTURES.E2.progress, streak }, revisao: resposta([...EM_DIA, ...VENCIDOS]) },
  R2: { ...FIXTURES.E2, progress: { ...FIXTURES.E2.progress, streak }, revisao: resposta(EM_DIA) },
};
