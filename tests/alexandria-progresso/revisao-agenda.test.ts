// Revisão espaçada da Alexandria: a regra pura de agendamento.
// `npm run test:progresso`.
//
// Os intervalos são regra de produto da casa (`INTERVALOS_EM_DIAS`). Os testes
// leem a constante em vez de repetir números, para que mudar a regra não
// exija reescrever a suíte — o que se testa aqui é a FORMA da regra.

import assert from 'node:assert/strict';
import test from 'node:test';
import {
  agendaDoItem,
  agendaDoLog,
  atraso,
  depoisDaRevisao,
  diasEntre,
  INTERVALOS_EM_DIAS,
  proximaEtapa,
  quandoVolta,
  resultadoDaTentativa,
  revisaoDoDia,
  somarDias,
  TETO_DA_REVISAO_DO_DIA,
  type AgendaDoItem,
  type ItemRevisavel,
  type TentativaDoLog,
} from '../../src/lib/alexandria/revisao/agenda.ts';

const ABERTO: ItemRevisavel = { id: 'm01-ex-01', textoDoGabarito: null };
const ESCOLHA: ItemRevisavel = { id: 'm01-a03-d02', textoDoGabarito: 'Potência ativa' };
const I = INTERVALOS_EM_DIAS;
const ULTIMA = I.length - 1;

let n = 0;
function t(dia: string, extra: Partial<TentativaDoLog> = {}): TentativaDoLog {
  n += 1;
  return {
    entityId: ABERTO.id,
    aulaId: 'aula-01-01',
    moduloId: 'modulo-01',
    origem: null,
    autoavaliacao: null,
    resposta: 'minha resposta',
    respostaCortada: false,
    occurredAt: `${dia}T12:00:${String(n % 60).padStart(2, '0')}.000+00:00`,
    dia,
    ...extra,
  };
}
const rev = (dia: string, autoavaliacao: string, extra: Partial<TentativaDoLog> = {}) =>
  t(dia, { origem: 'revisao', autoavaliacao, ...extra });

// ── a regra de produto num lugar só ──────────────────────────

test('intervalos: crescem estritamente, começam em 1 dia', () => {
  assert.equal(I[0], 1);
  for (let k = 1; k < I.length; k += 1) assert.ok(I[k] > I[k - 1], `etapa ${k} maior que ${k - 1}`);
  assert.ok(TETO_DA_REVISAO_DO_DIA > 0);
});

// ── datas de calendário ──────────────────────────────────────

test('datas: soma atravessa mês, ano e 29 de fevereiro', () => {
  assert.equal(somarDias('2026-11-15', 1), '2026-11-16');
  assert.equal(somarDias('2026-11-30', 1), '2026-12-01');
  assert.equal(somarDias('2026-12-31', 1), '2027-01-01');
  assert.equal(somarDias('2028-02-28', 1), '2028-02-29');
  assert.equal(somarDias('2026-11-15', 60), '2027-01-14');
  assert.equal(diasEntre('2026-11-15', '2026-11-18'), 3);
  assert.equal(diasEntre('2026-11-18', '2026-11-15'), -3);
  // dado fora do formato volta como veio: não se maquia
  assert.equal(somarDias('ontem', 1), 'ontem');
});

// ── o julgamento de uma tentativa ────────────────────────────

test('resultado: autoavaliação registrada vale primeiro', () => {
  assert.equal(resultadoDaTentativa(rev('2026-11-10', 'atende em parte'), ABERTO), 'atende em parte');
  assert.equal(resultadoDaTentativa(rev('2026-11-10', 'não atende'), ESCOLHA), 'não atende');
});

test('resultado: aberto sem autoavaliação é null — sem julgamento, não se inventa', () => {
  assert.equal(resultadoDaTentativa(t('2026-11-10'), ABERTO), null);
  assert.equal(resultadoDaTentativa(t('2026-11-10', { autoavaliacao: 'ótimo' }), ABERTO), null);
});

test('resultado: escolha compara o texto da alternativa, como a aula', () => {
  const e = { entityId: ESCOLHA.id };
  assert.equal(resultadoDaTentativa(t('2026-11-10', { ...e, resposta: 'Potência ativa' }), ESCOLHA), 'atende');
  assert.equal(resultadoDaTentativa(t('2026-11-10', { ...e, resposta: ' Potência ativa ' }), ESCOLHA), 'atende');
  assert.equal(resultadoDaTentativa(t('2026-11-10', { ...e, resposta: 'Potência reativa' }), ESCOLHA), 'não atende');
});

test('resultado: resposta cortada no transporte nunca julga', () => {
  const x = t('2026-11-10', { entityId: ESCOLHA.id, resposta: 'Potência ativa', respostaCortada: true });
  assert.equal(resultadoDaTentativa(x, ESCOLHA), null);
});

// ── a progressão da etapa ────────────────────────────────────

test('etapa: atende sobe, até a última', () => {
  assert.equal(proximaEtapa(-1, 'atende'), 0);
  assert.equal(proximaEtapa(0, 'atende'), 1);
  assert.equal(proximaEtapa(ULTIMA, 'atende'), ULTIMA);
});

test('etapa: atende em parte e não atende ENCURTAM o intervalo', () => {
  const de = 3;
  const atende = I[proximaEtapa(de, 'atende')];
  const parte = I[proximaEtapa(de, 'atende em parte')];
  const nao = I[proximaEtapa(de, 'não atende')];
  assert.ok(parte < I[de], 'atende em parte volta antes do intervalo atual');
  assert.ok(nao < parte, 'não atende volta antes de atende em parte');
  assert.ok(atende > I[de], 'atende volta depois do intervalo atual');
  assert.equal(proximaEtapa(de, 'não atende'), 0);
  assert.equal(proximaEtapa(0, 'atende em parte'), 0);
  assert.equal(proximaEtapa(-1, 'não atende'), 0);
});

test('etapa: sem julgamento não promove nem rebaixa', () => {
  assert.equal(proximaEtapa(-1, null), 0);
  assert.equal(proximaEtapa(2, null), 2);
});

// ── a agenda de um item ──────────────────────────────────────

test('agenda: um exercício aberto na aula volta amanhã', () => {
  const a = agendaDoItem([t('2026-11-10')], ABERTO)!;
  assert.equal(a.etapa, 0);
  assert.equal(a.vence, somarDias('2026-11-10', I[0]));
  assert.equal(a.ultimoResultado, null);
  assert.equal(a.diasPraticados, 1);
});

test('agenda: revisões que atendem espaçam cada vez mais', () => {
  const dia0 = '2026-10-01';
  const log: TentativaDoLog[] = [t(dia0)];
  let a = agendaDoItem(log, ABERTO)!;
  const vistos: number[] = [];
  for (let k = 0; k < I.length + 2; k += 1) {
    log.push(rev(a.vence, 'atende'));
    const b = agendaDoItem(log, ABERTO)!;
    vistos.push(diasEntre(b.ultimoDia, b.vence));
    a = b;
  }
  // 1 → 3 → 7 … e para na última etapa
  assert.deepEqual(vistos.slice(0, I.length - 1), [...I.slice(1)]);
  assert.equal(vistos[vistos.length - 1], I[ULTIMA]);
});

test('agenda: "não atende" numa etapa alta faz o item voltar amanhã', () => {
  const log = [t('2026-10-01'), rev('2026-10-02', 'atende'), rev('2026-10-05', 'atende'), rev('2026-10-12', 'não atende')];
  const a = agendaDoItem(log, ABERTO)!;
  assert.equal(a.etapa, 0);
  assert.equal(a.vence, '2026-10-13');
  assert.equal(a.ultimoResultado, 'não atende');
});

test('agenda: várias tentativas no mesmo dia são UM dia de prática, vale o último julgamento', () => {
  const dia = '2026-11-01';
  const log = [
    rev(dia, 'não atende', { occurredAt: `${dia}T10:00:00+00:00` }),
    rev(dia, 'atende', { occurredAt: `${dia}T10:05:00+00:00` }),
    t(dia, { occurredAt: `${dia}T10:06:00+00:00` }), // nova tentativa sem julgamento não apaga o julgamento do dia
  ];
  const a = agendaDoItem(log, ABERTO)!;
  assert.equal(a.diasPraticados, 1);
  assert.equal(a.ultimoResultado, 'atende');
  assert.equal(a.etapa, 0);
});

test('agenda: a ordem de chegada do log não muda o resultado', () => {
  const log = [t('2026-10-01'), rev('2026-10-02', 'atende'), rev('2026-10-05', 'atende em parte')];
  assert.deepEqual(agendaDoItem([...log].reverse(), ABERTO), agendaDoItem(log, ABERTO));
});

test('agenda: sem tentativa válida não há agenda', () => {
  assert.equal(agendaDoItem([], ABERTO), null);
  assert.equal(agendaDoItem([t('sem-dia')], ABERTO), null);
  assert.equal(agendaDoItem([t('2026-10-01', { entityId: 'outro' })], ABERTO), null);
});

// ── o log inteiro e o dia ────────────────────────────────────

test('log: item fora do catálogo fica de fora — sem enunciado, nada a devolver', () => {
  const catalogo = new Map([[ABERTO.id, ABERTO]]);
  const agendas = agendaDoLog([t('2026-10-01'), t('2026-10-01', { entityId: 'aula-01-08#previsao' })], catalogo);
  assert.deepEqual(agendas.map((a) => a.id), [ABERTO.id]);
});

const ag = (id: string, vence: string, etapa = 0): AgendaDoItem => ({
  id,
  etapa,
  ultimoDia: somarDias(vence, -I[etapa]),
  ultimoResultado: null,
  diasPraticados: 1,
  vence,
});

test('dia: só vencidos, o mais atrasado primeiro, depois o mais frágil', () => {
  const hoje = '2026-11-15';
  const r = revisaoDoDia(
    [ag('c', '2026-11-15', 2), ag('a', '2026-11-12', 1), ag('b', '2026-11-15', 0), ag('d', '2026-11-16'), ag('e', '2026-11-20')],
    hoje,
  );
  assert.deepEqual(r.hoje.map((a) => a.id), ['a', 'b', 'c']);
  assert.equal(r.vencidos, 3);
  assert.equal(r.proximoDia, '2026-11-16');
  assert.equal(r.noProximoDia, 1);
  assert.equal(r.naAgenda, 5);
});

test('dia: o teto corta a sessão, e o resto continua vencido', () => {
  const muitos = Array.from({ length: TETO_DA_REVISAO_DO_DIA + 5 }, (_, k) => ag(`x${String(k).padStart(2, '0')}`, '2026-11-10'));
  const r = revisaoDoDia(muitos, '2026-11-15');
  assert.equal(r.hoje.length, TETO_DA_REVISAO_DO_DIA);
  assert.equal(r.vencidos, TETO_DA_REVISAO_DO_DIA + 5);
});

test('dia: nada praticado = nada vencido e nenhum próximo dia', () => {
  assert.deepEqual(revisaoDoDia([], '2026-11-15'), { hoje: [], vencidos: 0, proximoDia: null, noProximoDia: 0, naAgenda: 0 });
});

// ── depois da revisão ────────────────────────────────────────

test('depois da revisão: a mesma regra decide quando o item volta', () => {
  const log = [t('2026-11-01'), rev('2026-11-02', 'atende'), rev('2026-11-05', 'atende')]; // etapa 2
  const hoje = '2026-11-12';
  assert.equal(depoisDaRevisao(log, ABERTO, hoje, 'atende').vence, somarDias(hoje, I[3]));
  assert.equal(depoisDaRevisao(log, ABERTO, hoje, 'atende em parte').vence, somarDias(hoje, I[1]));
  assert.equal(depoisDaRevisao(log, ABERTO, hoje, 'não atende').vence, somarDias(hoje, I[0]));
});

test('depois da revisão: a tentativa de agora vence uma anterior do mesmo dia', () => {
  const hoje = '2026-11-12';
  const log = [t('2026-11-01'), rev(hoje, 'atende', { occurredAt: `${hoje}T23:59:00+00:00` })];
  assert.equal(depoisDaRevisao(log, ABERTO, hoje, 'não atende').ultimoResultado, 'não atende');
});

// ── frases ───────────────────────────────────────────────────

test('frases: quando volta e há quanto tempo espera', () => {
  const hoje = '2026-11-15';
  assert.equal(quandoVolta('2026-11-16', hoje), 'amanhã');
  assert.equal(quandoVolta('2026-11-18', hoje), 'em 3 dias');
  assert.equal(quandoVolta('2026-11-29', hoje), 'em 14 dias · 29 nov.');
  assert.equal(atraso('2026-11-15', hoje), 'vence hoje');
  assert.equal(atraso('2026-11-14', hoje), 'esperando desde ontem');
  assert.equal(atraso('2026-11-10', hoje), 'esperando há 5 dias');
});
