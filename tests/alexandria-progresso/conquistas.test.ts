// Família CONCLUSÃO das conquistas da Alexandria (v3, eventos).
// `npm run test:progresso`.

import assert from 'node:assert/strict';
import test from 'node:test';
import {
  catalogoDeConclusao,
  conquistasARegistrar,
  palavrasProibidasEm,
  type CurriculoParaConquistas,
  type ModuloParaConquistas,
  type Territorio,
} from '../../src/lib/alexandria/progresso/conquistas.ts';
import { INDICE } from '../../src/lib/alexandria/indice.dados.ts';

const aulas = (mod: string, n: number) =>
  Array.from({ length: n }, (_, i) => `aula-${mod}-${String(i + 1).padStart(2, '0')}`);

const modulo = (n: number, territorio: Territorio, totalAulas: number, reconciliado = true): ModuloParaConquistas => {
  const mod = String(n).padStart(2, '0');
  return { id: `modulo-${mod}`, codigo: `M${mod}`, territorio, aulaIds: aulas(mod, totalAulas), reconciliado };
};

// Currículo de brinquedo: dois módulos no I, um no II, um no III.
const CURRICULO: CurriculoParaConquistas = {
  modulos: [modulo(1, 'I', 3), modulo(2, 'I', 2), modulo(3, 'II', 2), modulo(4, 'III', 1)],
};
const CATALOGO = catalogoDeConclusao(CURRICULO);
const porId = (id: string) => {
  const c = CATALOGO.find((x) => x.id === id);
  assert.ok(c, `conquista ${id} existe`);
  return c;
};
const conj = (...ids: string[]) => new Set(ids);

test('catálogo: 1 primeira + 3 territórios + N módulos + 3 territórios + currículo + 4 contagens', () => {
  assert.equal(CATALOGO.length, 1 + 3 + CURRICULO.modulos.length + 3 + 1 + 4);
  assert.equal(new Set(CATALOGO.map((c) => c.id)).size, CATALOGO.length);
  assert.ok(CATALOGO.every((c) => c.familia === 'conclusao' && c.eventos[0] === 'aula_concluida'));
});

test('primeira aula: qualquer aula do currículo; id desconhecido não conta', () => {
  const c = porId('conclusao.primeira-aula');
  assert.equal(c.avaliar(conj()).estado, 'nao-obtida');
  assert.equal(c.avaliar(conj('aula-99-01')).estado, 'nao-obtida');
  assert.equal(c.avaliar(conj('aula-03-02')).estado, 'obtida');
});

test('primeira do território: qualquer aula de qualquer módulo do território', () => {
  assert.equal(porId('conclusao.primeira-do-territorio.I').avaliar(conj('aula-02-02')).estado, 'obtida');
  assert.equal(porId('conclusao.primeira-do-territorio.II').avaliar(conj('aula-02-02')).estado, 'nao-obtida');
});

test('módulo: todas as aulas listadas; parcial diz quantas de quantas', () => {
  const c = porId('conclusao.modulo.modulo-01');
  assert.deepEqual(c.avaliar(conj('aula-01-01', 'aula-01-03')), { estado: 'nao-obtida', feitas: 2, total: 3 });
  assert.equal(c.avaliar(conj(...aulas('01', 3))).estado, 'obtida');
});

test('módulo sem reconciliação (P8) é indisponível — nunca obtida nem não-obtida', () => {
  const cur: CurriculoParaConquistas = { modulos: [modulo(1, 'I', 2, false), modulo(2, 'I', 1)] };
  const cat = catalogoDeConclusao(cur);
  const m1 = cat.find((c) => c.id === 'conclusao.modulo.modulo-01')!;
  assert.equal(m1.avaliar(conj(...aulas('01', 2))).estado, 'indisponivel');
  // E contamina o território: "território concluído" com contagem em revisão seria afirmação sem base.
  const t = cat.find((c) => c.id === 'conclusao.territorio.I')!;
  assert.equal(t.avaliar(conj(...aulas('01', 2), ...aulas('02', 1))).estado, 'indisponivel');
});

test('módulo com contagem desconhecida é indisponível', () => {
  const cat = catalogoDeConclusao({ modulos: [{ id: 'modulo-09', codigo: 'M09', territorio: 'II', aulaIds: null, reconciliado: false }] });
  assert.equal(cat.find((c) => c.id === 'conclusao.modulo.modulo-09')!.avaliar(conj()).estado, 'indisponivel');
});

test('território e currículo: todos os módulos', () => {
  const tudoI = [...aulas('01', 3), ...aulas('02', 2)];
  assert.equal(porId('conclusao.territorio.I').avaliar(conj(...tudoI)).estado, 'obtida');
  assert.deepEqual(porId('conclusao.territorio.I').avaliar(conj(...aulas('01', 3))), { estado: 'nao-obtida', feitas: 1, total: 2 });
  const tudo = [...tudoI, ...aulas('03', 2), ...aulas('04', 1)];
  assert.equal(porId('conclusao.curriculo').avaliar(conj(...tudo)).estado, 'obtida');
  assert.equal(porId('conclusao.curriculo').avaliar(conj(...tudoI)).estado, 'nao-obtida');
});

test('contagem: aulas DIFERENTES; índice menor que a meta é indisponível', () => {
  // O brinquedo tem 8 aulas: a contagem de 10 não é alcançável, e dizer
  // "não obtida" seria prometer o que o índice não tem.
  assert.equal(porId('conclusao.contagem.10').avaliar(conj()).estado, 'indisponivel');
  const real = catalogoDeConclusao({ modulos: [modulo(1, 'I', 12)] });
  const dez = real.find((c) => c.id === 'conclusao.contagem.10')!;
  assert.deepEqual(dez.avaliar(conj(...aulas('01', 9))), { estado: 'nao-obtida', feitas: 9, total: 10 });
  assert.equal(dez.avaliar(conj(...aulas('01', 10))).estado, 'obtida');
});

test('registro: só o que esta conclusão tornou obtido, sem repetir o já registrado', () => {
  const r = conquistasARegistrar(CATALOGO, ['aula-01-01', 'aula-01-02', 'aula-01-03'], 'aula-01-03', ['conclusao.primeira-aula']);
  const ids = r.map((x) => x.id);
  assert.ok(ids.includes('conclusao.modulo.modulo-01'));
  assert.ok(!ids.includes('conclusao.primeira-aula'), 'já registrada não volta');
  assert.ok(!ids.includes('conclusao.contagem.10'), 'indisponível nunca registra');
  assert.equal(r.find((x) => x.id === 'conclusao.modulo.modulo-01')!.retroativa, false);
});

test('registro: retroativa quando a regra já estava satisfeita sem esta aula', () => {
  // Conclusões antigas do M01 inteiro; a aula de agora é do M03.
  const r = conquistasARegistrar(CATALOGO, [...aulas('01', 3), 'aula-03-01'], 'aula-03-01', []);
  assert.equal(r.find((x) => x.id === 'conclusao.modulo.modulo-01')!.retroativa, true);
  assert.equal(r.find((x) => x.id === 'conclusao.primeira-do-territorio.II')!.retroativa, false);
});

test('registro: a aula confirmada conta mesmo se a lista do servidor ainda não a trouxer', () => {
  const r = conquistasARegistrar(CATALOGO, [], 'aula-04-01', []);
  assert.ok(r.some((x) => x.id === 'conclusao.modulo.modulo-04'));
});

// ── O currículo REAL do índice v3 ────────────────────────────

const ROMANOS = new Set(['I', 'II', 'III']);
const CURRICULO_REAL: CurriculoParaConquistas = {
  modulos: INDICE.modulos.map((m) => {
    const romano = INDICE.trilhas.find((t) => t.id === m.trilhaId)?.romano;
    return {
      id: m.id,
      codigo: m.codigo,
      territorio: romano && ROMANOS.has(romano) ? (romano as Territorio) : null,
      aulaIds: m.aulas.map((a) => `aula-${String(m.numero).padStart(2, '0')}-${String(a.numero).padStart(2, '0')}`),
      reconciliado: true,
    };
  }),
};
const CATALOGO_REAL = catalogoDeConclusao(CURRICULO_REAL);

test('índice v3: 17 módulos em três territórios → 29 conquistas de conclusão', () => {
  assert.equal(CURRICULO_REAL.modulos.length, 17);
  assert.ok(CURRICULO_REAL.modulos.every((m) => m.territorio !== null));
  assert.equal(CATALOGO_REAL.length, 29);
});

test('nenhum texto de conquista usa palavra de competência, persona ou percentual', () => {
  for (const c of CATALOGO_REAL) {
    assert.deepEqual(palavrasProibidasEm(c.nome), [], `nome de ${c.id}: ${c.nome}`);
    assert.deepEqual(palavrasProibidasEm(c.criterio), [], `critério de ${c.id}: ${c.criterio}`);
  }
});

test('o verificador de palavras pega o que deve pegar', () => {
  assert.deepEqual(palavrasProibidasEm('Guardião do Fator de Potência'), ['guardião']);
  assert.deepEqual(palavrasProibidasEm('Acertou 90% das questões'), ['%']);
  assert.deepEqual(palavrasProibidasEm('Leitor de Mercado'), ['leitor de']);
  // "sabe" isolado, não dentro de outra palavra.
  assert.deepEqual(palavrasProibidasEm('Concluiu as aulas sabendo'), []);
});
