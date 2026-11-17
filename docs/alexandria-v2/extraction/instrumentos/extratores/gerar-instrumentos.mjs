/* ============================================================================
   gerar-instrumentos.mjs — especificação dos 165 instrumentos da Alexandria

   Lê SOMENTE a camada fonte (docs/alexandria-v2/extraction/mNN/) e a camada de
   julgamento (../overlay/*.json). Não lê `src/`, não lê o HTML original, não
   busca nada fora da extração. Emite ../instrumentos.json e ../instrumentos.md.

   Regra que este script implementa (P3, P5, P6, P11, S4):
   - tudo o que é fato — rótulo, unidade, faixa, padrão, fórmula, cenário,
     tolerância — vem da extração, copiado, nunca redigitado;
   - tudo o que é julgamento — forma prometida, pergunta de previsão, pedido de
     revisão de tolerância — vem do overlay e sai marcado camada "alexandria";
   - onde a fonte não diz, a saída é ausência declarada, nunca preenchimento.

   uso: node gerar-instrumentos.mjs
   ============================================================================ */
import fs from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

const AQUI = path.dirname(fileURLToPath(import.meta.url));
const SAIDA = path.resolve(AQUI, '..');
const EXTRACAO = path.resolve(AQUI, '../..');
const OVERLAY = path.join(SAIDA, 'overlay');

const ler = p => JSON.parse(fs.readFileSync(p, 'utf8'));
const existe = p => fs.existsSync(p);

/* ---------- utilitários de leitura literal ---------------------------------- */

const S = v => {
  if (v == null) return null;
  if (typeof v === 'string') return v;
  if (typeof v === 'number' || typeof v === 'boolean') return String(v);
  if (Array.isArray(v)) return v.map(S).filter(Boolean).join(' | ') || null;
  if (typeof v === 'object')
    return v.texto ?? v.text ?? v.rotulo ?? v.html ?? v.valor ?? v.codigo ?? JSON.stringify(v);
  return String(v);
};
const pick = (o, ...ks) => { for (const k of ks) if (o && o[k] != null) return o[k]; return null; };

const SKIP_GRUPO = /calculo|formula|codigo|verbatim|logica|ramos|funcao|nota/i;
function flat(v, skip) {
  if (v == null) return [];
  if (Array.isArray(v)) return v;
  if (typeof v === 'object') {
    const out = [];
    for (const k of Object.keys(v)) {
      if (skip && SKIP_GRUPO.test(k)) continue;
      const sub = v[k];
      if (!Array.isArray(sub)) continue;
      for (const it of sub) {
        if (it && typeof it === 'object') out.push({ ...it, _grupo: k });
        else if (it != null) out.push({ rotulo: String(it), _grupo: k });
      }
    }
    return out;
  }
  return [];
}

function normEntrada(e) {
  if (e == null) return null;
  if (typeof e === 'string') return { id: null, rotulo: e, unidade: null, tipo: null, padrao: null, faixa: null, opcoes: null, linha: null };
  if (Array.isArray(e.inputs) && e.inputs.length) {
    const f = e.inputs[0];
    return {
      id: e.inputs.map(i => i.id_fonte || i.id).filter(Boolean).join(' / ') || null,
      rotulo: S(e.rotulo), rotulo_nota: S(e.rotulo_nota), unidade: S(e.unidade),
      tipo: S(e.tipo) || 'campos gerados por script', grupo: e._grupo || null,
      padrao: e.inputs.map(i => S(i.padrao ?? i.value)).join(' / '),
      faixa: (f.min != null || f.max != null)
        ? `${S(f.min)} – ${S(f.max)}${f.step != null ? ` / passo ${S(f.step)}` : ''}` : null,
      opcoes: null, linha: (e.origem && e.origem.linha_aprox) || null
    };
  }
  const num = e.number || e.numero || e.numero_attrs || e.input_number || null;
  const rng = e.range || e.deslizador || e.input_range || null;
  const min = pick(e, 'min') ?? (num && num.min) ?? (rng && rng.min) ?? (e.script_numOf && e.script_numOf.min);
  const max = pick(e, 'max') ?? (num && num.max) ?? (rng && rng.max) ?? (e.script_numOf && e.script_numOf.max);
  const passo = pick(e, 'passo', 'step') ?? (num && num.step) ?? (rng && rng.step);
  const padrao = pick(e, 'padrao', 'valor_padrao', 'default', 'valor')
    ?? (num && num.value) ?? (rng && rng.value) ?? (e.script_numOf && e.script_numOf.padrao);
  let opcoes = pick(e, 'opcoes', 'options', 'estados', 'valores', 'itens');
  if (Array.isArray(opcoes))
    opcoes = opcoes.map(o => typeof o === 'string' ? o : (o.rotulo ?? o.label ?? o.texto ?? o.valor ?? JSON.stringify(o)));
  return {
    id: S(pick(e, 'id', 'id_fonte', 'id_html', 'dom_id', 'id_number', 'id_campo')) || (num && S(num.id_fonte || num.id)) || null,
    rotulo: S(pick(e, 'rotulo', 'label', 'nome', 'titulo')),
    rotulo_nota: S(pick(e, 'rotulo_nota')),
    unidade: S(pick(e, 'unidade', 'unit')),
    tipo: S(pick(e, 'tipo', 'kind', 'controle')),
    grupo: e._grupo || null,
    padrao: S(padrao),
    faixa: (min != null || max != null) ? `${S(min)} – ${S(max)}${passo != null ? ` / passo ${S(passo)}` : ''}` : null,
    opcoes: Array.isArray(opcoes) ? opcoes : (opcoes ? [S(opcoes)] : null),
    linha: (e.origem && (e.origem.linha_aprox ?? e.origem.linha)) ?? e.linha_aprox ?? e.linha ?? null
  };
}

function normSaida(s) {
  if (s == null) return null;
  if (typeof s === 'string') return { id: null, rotulo: s, unidade: null, tipo: null, formula: null, estatico: null, linha: null };
  const atrib = s.atribuicao_script;
  let formula = pick(s, 'formula', 'codigo_saida', 'codigo', 'expressao', 'expressao_script', 'calculo', 'logica', 'formatacao_script');
  if (!formula && Array.isArray(atrib)) formula = atrib.map(a => a.codigo || S(a)).join(' ; ');
  if (!formula && atrib) formula = S(atrib);
  return {
    id: S(pick(s, 'id', 'id_fonte', 'id_html', 'dom_id')),
    rotulo: S(pick(s, 'rotulo', 'rotulo_bruto', 'label', 'k', 'titulo', 'nome'))
      || (Array.isArray(s.rotulos_fixos) ? s.rotulos_fixos.join(' · ') : null),
    unidade: S(pick(s, 'unidade', 'unidade_renderizada', 'unidade_no_markup_inicial', 'unit', 'u')),
    tipo: S(pick(s, 'tipo', 'tipo_saida', 'kind')),
    grupo: s._grupo || null,
    formula: formula ? S(formula).slice(0, 400) : null,
    estatico: S(pick(s, 'valor_estatico_no_markup', 'valor_padrao_renderizado', 'markup_inicial',
      'valor_markup', 'valor_inicial_markup', 'descricao_anotacao')),
    linha: (s.origem && (s.origem.linha_aprox ?? s.origem.linha)) ?? s.linha_aprox ?? null
  };
}

const DRAW_KEYS = ['desenho', 'grafico', 'grafo', 'barras', 'visuais', 'visual', 'painel', 'renderizacoes',
  'etapas_barras', 'pilha_no_cenario_padrao', 'legendas', 'legendas_renderizadas', 'cadeia'];
const FORM_KEYS = ['calculo', 'formulas_script', 'calculo_script', 'formulas', 'logica_literal', 'logica',
  'mecanica', 'mecanica_resumo_extracao', 'script', 'script_verbatim', 'ramos', 'veredito',
  'regra_de_consistencia', 'ramos_do_veredito', 'ramos_veredito', 'ramos_de_leitura'];

/* ---------- leitura da camada fonte ----------------------------------------- */

function daExtracao(mod, x, idx) {
  const entradas = [...flat(pick(x, 'entradas', 'controles', 'campos')), ...flat(x.controles_segmentados), ...flat(x.sinais)]
    .map(normEntrada).filter(Boolean);
  let saidas = [...flat(pick(x, 'saidas'), true), ...flat(x.containers_de_saida, true),
  ...flat(x.conteineres, true), ...flat(x.conteineres_dinamicos, true)].map(normSaida).filter(Boolean);
  saidas = saidas.filter(s => s.rotulo || s.id || s.tipo);
  if (!saidas.length) {
    const extra = [];
    const at = x.alvos_de_texto;
    if (at && !Array.isArray(at)) for (const k of Object.keys(at)) {
      const v = at[k];
      if (typeof v === 'string') extra.push({ id: v, rotulo: k, tipo: 'alvo de texto' });
      else if (Array.isArray(v)) v.forEach(i => extra.push({ id: typeof i === 'string' ? i : (i && i.id), rotulo: k, tipo: 'alvo de texto' }));
    }
    if (x.painel && Array.isArray(x.painel.campos))
      x.painel.campos.forEach(c => extra.push({ id: c, rotulo: x.painel.rotulo_legado || null, tipo: 'campo de painel' }));
    if (x.marcacao && Array.isArray(x.marcacao.alvos_dinamicos))
      x.marcacao.alvos_dinamicos.forEach(a => extra.push({ id: a.id, rotulo: null, tipo: 'alvo dinâmico' }));
    if (Array.isArray(x.renderizacoes) && x.renderizacoes.length)
      extra.push({ id: null, rotulo: 'painel renderizado', tipo: 'painel', formula: 'ver renderizacoes na extração do módulo' });
    const cp = x.cenario_padrao || {};
    for (const k of ['painel', 'ficha_texto', 'corpo_texto', 'leitura', 'termometro'])
      if (cp[k] != null) extra.push({ id: null, rotulo: `painel/ficha renderizado (${k})`, tipo: 'painel' });
    if (x.detalhe != null) extra.push({ id: null, rotulo: 'detalhe', tipo: 'painel' });
    saidas = extra.map(normSaida).filter(Boolean);
  }
  const draw = {}; for (const k of DRAW_KEYS) if (x[k] != null && !(Array.isArray(x[k]) && !x[k].length)) draw[k] = x[k];
  const form = {}; for (const k of FORM_KEYS) if (x[k] != null && !(Array.isArray(x[k]) && !x[k].length)) form[k] = x[k];
  const tol = pick(x, 'tolerancias', 'tolerancia');

  return {
    id: x.id || `${mod}-inst-${String(idx + 1).padStart(2, '0')}`,
    modulo: mod.toUpperCase(),
    id_fonte: S(pick(x, 'id_fonte', 'id_literal_fonte', 'rotulo_fonte', 'ref_fonte', 'codigo_fonte',
      'inst_id_fonte', 'rotulo', 'numero_fonte')),
    titulo: S(pick(x, 'titulo', 'nome')),
    aula: S(pick(x, 'aula', 'secao', 'escopo', 'aula_id', 'aula_id_codigo', 'local', 'destino')),
    fora_de_aula: x.fora_de_aula ?? x.de_modulo ?? null,
    kind: S(pick(x, 'kind_taxonomia', 'kind_sugerido', 'kind_codigo', 'kind_candidato', 'kind_no_codigo', 'tipo', 'mecanica')),
    pergunta: S(pick(x, 'pergunta')),
    pergunta_nota: S(pick(x, 'pergunta_nota', 'nota_pergunta')),
    intro: S(pick(x, 'intro', 'introducao', 'instrucao', 'tarefa_declarada', 'tarefa_declarada_na_fonte',
      'aviso', 'disclaimer', 'disc', 'aviso_didatico')),
    entradas, saidas,
    tolerancia_declarada: tol ?? null,
    tolerancia_nota: S(pick(x, 'tolerancias_nota', 'tolerancia_nota', 'nota_tolerancias')),
    fonte_dos_numeros: S(pick(x, 'fonte_dos_numeros')),
    fonte_dos_numeros_nota: S(pick(x, 'fonte_dos_numeros_nota')),
    cenario_padrao: x.cenario_padrao ?? x.cenario_padrao_renderizado ?? null,
    desenho_declarado_na_fonte: Object.keys(draw).length ? draw : null,
    formulas: Object.keys(form).length ? form : null,
    estado_no_codigo: S(pick(x, 'estado_no_codigo', 'estado_codigo', 'codigo_atual', 'comparacao_codigo', 'codigo'))
  };
}

/* ---------- M01: INST·01–06 (aulas 01–08) e LAB·01 (modulo.json) ------------- */

function m01Registros() {
  const a08 = ler(path.join(EXTRACAO, 'm01/aula-08.json'));
  const mod = ler(path.join(EXTRACAO, 'm01/modulo.json'));
  const regs = [];

  // INST·01–05 (nov/2026): a camada fonte vem das extrações das aulas, feitas
  // em sessões paralelas com esquemas levemente diferentes para as entradas
  // (campos planos; `number` + `range_gemeo`; `numero` + `deslizador`). A
  // normalização abaixo só REARRUMA campos — nenhum valor é redigitado.
  const ONDE = { 1: '01', 2: '02', 3: '04', 4: '05', 5: '07' };
  const faixaDe = (o) => o
    ? `${S(o.min) ?? '—'} – ${o.max == null ? 'sem atributo max na fonte' : S(o.max)}${o.step != null ? ` / passo ${S(o.step)}` : ''}`
    : null;
  for (let n = 1; n <= 5; n++) {
    const aula = ler(path.join(EXTRACAO, `m01/aula-${ONDE[n]}.json`));
    const i = (aula.instrumentos || [])[0];
    const entradas = (i.entradas || []).map(e => {
      const num = e.number || e.numero || e;            // campo numérico
      const rng = e.range_gemeo || e.deslizador || null; // deslizador gêmeo, se houver
      return {
        id: e.id, rotulo: e.rotulo, unidade: e.unidade,
        tipo: rng ? 'number + range gêmeo' : (num.tipo_input ?? null),
        padrao: S(num.padrao),
        faixa: faixaDe(num),
        faixa_do_deslizador: rng ? faixaDe(rng) : null,
        placeholder: e.placeholder ?? null,
        opcoes: null,
        linha: (e.origem && e.origem.linha_aprox) || (num.origem && num.origem.linha_aprox) || null
      };
    });
    let saidas = (i.saidas || []).map(s => ({
      id: s.id, rotulo: s.rotulo, unidade: s.unidade ?? null, tipo: 'readout',
      formula: Array.isArray(s.formula_exata_script) ? s.formula_exata_script.join(' ') : S(s.formula_exata_script),
      formula_exibida_na_aula: s.formula_exibida_na_aula ?? s.formula_exibida_na_aula_html ?? null,
      formatacao: s.formatacao_script ?? null,
      estatico: s.valor_inicial_marcacao ?? null, linha: s.origem && s.origem.linha_aprox
    }));
    let saidasNota = null;
    if (!saidas.length && i.leituras_externas_ref) {
      // INST·05: as leituras moram na figura do triângulo, fora do div.instrument.
      const fig = (aula.figuras || []).find(f => f.id === i.leituras_externas_ref);
      saidas = ((fig && fig.leituras) || []).map(l => ({
        id: l.id_valor, rotulo: l.rotulo, unidade: l.sufixo_unidade ?? null, tipo: 'readout (na figura)',
        formula: null, estatico: l.valor_inicial_marcacao ?? null, linha: l.origem && l.origem.linha_aprox
      }));
      saidasNota = i.saidas_nota || null;
    }
    regs.push({
      id: `m01-inst-0${n}`, modulo: 'M01', id_fonte: i.id_fonte, titulo: i.titulo,
      aula: `Aula ${ONDE[n]}`, fora_de_aula: false, kind: i.kind_taxonomia ?? null,
      pergunta: i.pergunta ?? null, pergunta_nota: i.pergunta_nota ?? null, intro: null,
      entradas, saidas, saidas_nota: saidasNota,
      tolerancia_declarada: i.tolerancias ?? null, tolerancia_nota: i.tolerancias_nota ?? null,
      fonte_dos_numeros: i.fonte_dos_numeros ?? null, fonte_dos_numeros_nota: i.fonte_dos_numeros_nota ?? null,
      cenario_padrao: i.cenario_padrao ?? null,
      desenho_declarado_na_fonte: i.figura_prometida ?? null,
      desenho_nota_da_fonte: i.figura_prometida_nota ?? null,
      formulas: { texto_leitura: i.texto_leitura ?? i.texto_nota_estatica ?? i.nota_estatica ?? null },
      estado_no_codigo: `divergente ou parcial — tabela COD-xx em extraction/m01/aula-${ONDE[n]}.md`,
      fonte_extraida: true
    });
  }

  const i6 = a08.instrumentos[0];
  regs.push({
    id: 'm01-inst-06', modulo: 'M01', id_fonte: i6.id_fonte, titulo: i6.titulo,
    aula: 'Aula 08', fora_de_aula: false, kind: i6.kind_taxonomia,
    pergunta: i6.pergunta, pergunta_nota: i6.pergunta_nota, intro: null,
    entradas: (i6.entradas || []).map(e => ({
      id: e.id, rotulo: e.rotulo, unidade: e.unidade, tipo: e.tipo_input,
      padrao: S(e.padrao),
      faixa: `${S(e.min)} – ${e.max == null ? 'sem atributo max na fonte' : S(e.max)}${e.step != null ? ` / passo ${S(e.step)}` : ''}`,
      opcoes: null, linha: e.origem && e.origem.linha_aprox
    })),
    saidas: (i6.saidas || []).map(s => ({
      id: s.id, rotulo: s.rotulo, unidade: s.unidade, tipo: 'readout',
      formula: (s.formula_exata_script || []).join(' '),
      formula_exibida_na_aula: s.formula_exibida_na_aula,
      formatacao: s.formatacao_script,
      estatico: s.valor_inicial_marcacao, linha: s.origem && s.origem.linha_aprox
    })),
    tolerancia_declarada: i6.tolerancias, tolerancia_nota: i6.tolerancias_nota,
    fonte_dos_numeros: i6.fonte_dos_numeros, fonte_dos_numeros_nota: i6.fonte_dos_numeros_nota,
    cenario_padrao: i6.cenario_padrao,
    desenho_declarado_na_fonte: i6.figura_prometida,
    desenho_nota_da_fonte: i6.figura_prometida_nota,
    formulas: { texto_leitura: i6.texto_leitura },
    estado_no_codigo: 'divergente (comparação registrada no README do M01)',
    fonte_extraida: true
  });

  const lab = mod.lab_01;
  const campos = [...(lab.campos_comuns || [])];
  for (const col of (lab.colunas || [])) for (const c of (col.campos || [])) campos.push({ ...c, _coluna: col.cabecalho });
  regs.push({
    id: 'm01-lab-01', modulo: 'M01', id_fonte: lab.instrument_id_fonte, titulo: lab.titulo_instrumento,
    aula: '§ Lab', fora_de_aula: true, kind: lab.tipo,
    pergunta: null,
    pergunta_nota: 'A fonte não declara pergunta, passos nem entregável para o LAB·01 (passos_nota e entregavel_nota na extração).',
    intro: lab.enunciado && lab.enunciado.texto,
    entradas: campos.map(c => ({
      id: c.input_number && c.input_number.id, rotulo: c.rotulo, unidade: c.unidade,
      tipo: c.input_range ? 'number + range gêmeo' : 'number',
      grupo: c._coluna || 'comum às duas fábricas',
      padrao: c.input_number && c.input_number.value,
      faixa: c.input_number ? `${c.input_number.min ?? '—'} – ${c.input_number.max ?? 'sem atributo max na fonte'}${c.input_number.step != null ? ` / passo ${c.input_number.step}` : ''}` : null,
      faixa_do_deslizador: c.input_range ? `${c.input_range.min} – ${c.input_range.max} / passo ${c.input_range.step}` : null,
      opcoes: null, linha: c.origem && c.origem.linha_aprox
    })),
    saidas: (lab.colunas || []).flatMap(col => [
      ...(col.saidas || []).map(s => ({ id: s.output_id, rotulo: s.rotulo, grupo: col.cabecalho, unidade: 'R$/mês', tipo: 'linha de comparação', formula: null, estatico: s.valor_estatico_no_markup, linha: s.origem && s.origem.linha_aprox })),
      col.total ? { id: col.total.output_id, rotulo: col.total.rotulo, grupo: col.cabecalho, unidade: 'R$/mês', tipo: 'total', formula: null, estatico: col.total.valor_estatico_no_markup, linha: col.total.origem && col.total.origem.linha_aprox } : null
    ].filter(Boolean)),
    tolerancia_declarada: null,
    tolerancia_nota: 'Nenhuma tolerância declarada (P6).',
    fonte_dos_numeros: null,
    fonte_dos_numeros_nota: 'A fonte não cita procedência para tarifa, demanda, fator de potência nem percentual de ponta.',
    cenario_padrao: { nota: 'Valores estáticos do markup; o script recalcula no carregamento e diverge na Fábrica B (ver divergência).' },
    desenho_declarado_na_fonte: null,
    formulas: null,
    estado_no_codigo: 'divergente: markup R$ 1.800 / R$ 67.425 contra script R$ 3.200 / R$ 68.825 (README do M01)',
    fonte_extraida: true
  });

  return regs;
}

/* ---------- elisão honesta de blobs longos ---------------------------------
   Strings muito longas (código completo de script) não são copiadas para cá:
   elas já existem, verbatim, na extração do módulo. No lugar fica um ponteiro
   com a contagem de caracteres, no mesmo estilo que as próprias extrações usam
   ("literal elidido, ver dados_do_script…"). As fórmulas linha a linha ficam
   inteiras — são elas que o builder precisa copiar.                            */

const LIMITE_BLOB = 1500;
function elidir(v, mod, caminho) {
  if (typeof v === 'string') {
    return v.length > LIMITE_BLOB
      ? `<elidido: ${v.length} caracteres — literal em extraction/${mod}/instrumentos.json → ${caminho}>`
      : v;
  }
  if (Array.isArray(v)) return v.map((it, k) => elidir(it, mod, `${caminho}[${k}]`));
  if (v && typeof v === 'object') {
    const o = {};
    for (const k of Object.keys(v)) o[k] = elidir(v[k], mod, `${caminho}.${k}`);
    return o;
  }
  return v;
}

/* ---------- montagem --------------------------------------------------------- */

const overlay = {};
for (const f of fs.readdirSync(OVERLAY).filter(f => f.endsWith('.json')).sort())
  Object.assign(overlay, ler(path.join(OVERLAY, f)));
delete overlay._nota;

const registros = [...m01Registros()];
for (let i = 2; i <= 17; i++) {
  const mod = 'm' + String(i).padStart(2, '0');
  const a = ler(path.join(EXTRACAO, mod, 'instrumentos.json'));
  a.instrumentos.forEach((x, k) => {
    const r = daExtracao(mod, x, k);
    r.formulas = elidir(r.formulas, mod, `[${k}] (fórmulas)`);
    r.cenario_padrao = elidir(r.cenario_padrao, mod, `[${k}].cenario_padrao`);
    r.desenho_declarado_na_fonte = elidir(r.desenho_declarado_na_fonte, mod, `[${k}] (desenho)`);
    registros.push({ ...r, fonte_extraida: true });
  });
}

/* ---------- unidade de saída (3.6) --------------------------------------------
   A extração só tinha `unidade` em parte das saídas. A unidade que a fonte
   declara em outro lugar — rótulo, markup, saída formatada pelo script — é
   recuperada executando o script REAL do módulo (tools/alexandria-dados/). Cada
   unidade recuperada carrega `unidade_origem` e `unidade_evidencia` (o trecho
   literal); o que a fonte não declara fica `null` com `unidade_motivo`.
   Texto de aula não é usado: associar unidade de prosa a uma saída é inferência. */
const { recuperarUnidades } = await import(
  pathToFileURL(path.resolve(AQUI, '../../../../../tools/alexandria-dados/recuperar-unidades.mjs')).href);
const contagemUnidades = recuperarUnidades(registros);

const NIVEIS_C7 = ['atende', 'atende em parte', 'não atende'];

function montar(r) {
  const o = overlay[r.id] || {};
  const temTolerancia = r.tolerancia_declarada != null
    && JSON.stringify(r.tolerancia_declarada) !== 'null'
    && JSON.stringify(r.tolerancia_declarada) !== '[]';

  const forma = o.fonte_extraida === false ? {
    camada: 'ausência declarada',
    promete: null,
    estado: 'ainda não disponível — este instrumento não tem extração de camada fonte'
  } : {
    camada: 'alexandria',
    promete: o.promete ?? null,
    evidencia_da_promessa: o.evidencia ?? null,
    desenho_declarado_na_fonte: o.desenho_na_fonte ?? null,
    estado_c5: o.estado_c5 ?? (o.promete === false ? 'sem promessa de forma' : null),
    o_que_desenhar: o.o_que_desenhar ?? null,
    eixos: (o.eixo_x || o.eixo_y) ? { x: o.eixo_x ?? null, y: o.eixo_y ?? null } : null,
    series: o.series ?? null,
    relacao_que_a_figura_tem_de_mostrar: o.relacao ?? null,
    derivacao: o.derivacao ?? null,
    sem_promessa_mas: o.sem_promessa_mas ?? null,
    reuso_de_figura: o.reuso ?? null,
    alerta_de_porte: o.alerta_de_porte ?? null,
    custo_estimado: o.custo ?? null
  };

  const tolerancia = {
    declarada_pela_fonte: temTolerancia,
    valor: temTolerancia ? r.tolerancia_declarada : null,
    nota_da_fonte: r.tolerancia_nota ?? null,
    veredito_permitido: temTolerancia ? 'dentro/fora' : 'autoavaliação em três níveis',
    niveis_de_autoavaliacao: temTolerancia ? null : NIVEIS_C7,
    revisao_tecnica_pedida: o.tolerancia_util === true,
    pedido: o.tolerancia_pedido ?? null,
    por_que_nao: o.tolerancia_motivo ?? null
  };

  const previsao = o.fonte_extraida === false ? {
    camada: 'ausência declarada',
    util: null,
    nota: 'ainda não disponível — sem extração de camada fonte'
  } : {
    camada: 'alexandria',
    util: o.previsao_util ?? null,
    motivo: o.previsao_motivo ?? null,
    pergunta: o.previsao_pergunta ?? null,
    cenario: r.cenario_padrao && (r.cenario_padrao.entradas ?? r.cenario_padrao.entrada ?? null),
    resposta_no_cenario_padrao: o.previsao_resposta_padrao ?? null,
    ato_alternativo: o.ato_alternativo ?? null,
    bloqueio: o.bloqueio ?? null
  };

  return {
    identidade: {
      id: r.id, modulo: r.modulo, id_fonte: r.id_fonte,
      titulo: r.titulo, titulo_ausencia: r.titulo_ausencia ?? null,
      aula: r.aula, fora_de_aula: r.fora_de_aula, kind: r.kind,
      o_que_pergunta: {
        pergunta_da_fonte: r.pergunta,
        nota: r.pergunta_nota,
        instrucao_ou_intro: r.intro
      },
      fonte_extraida: r.fonte_extraida
    },
    entradas: r.entradas,
    saidas: r.saidas,
    formulas_da_fonte: r.formulas,
    cenario_padrao: r.cenario_padrao,
    forma_prometida: forma,
    tolerancia,
    previsao,
    avisos: {
      fonte_dos_numeros: r.fonte_dos_numeros,
      fonte_dos_numeros_nota: r.fonte_dos_numeros_nota,
      fonte_declarada_no_overlay: o.fonte_declarada ?? null,
      conteudo_qa: o.conteudo_qa ?? null,
      divergencia: o.divergencia ?? null,
      nota_extracao: o.nota_extracao ?? null,
      nota_c5: o.nota_c5 ?? null,
      nota_produto: o.nota_produto ?? null
    },
    estado_no_codigo: r.estado_no_codigo,
    desenho_declarado_na_fonte: r.desenho_declarado_na_fonte
  };
}

const instrumentos = registros.map(montar);

/* ---------- contagens (derivadas, nunca digitadas) --------------------------- */

const semFonte = instrumentos.filter(i => !i.identidade.fonte_extraida);
const comFonte = instrumentos.filter(i => i.identidade.fonte_extraida);
const promete = comFonte.filter(i => i.forma_prometida.promete === true);
const prometeSemDesenho = promete.filter(i => /sem desenho/.test(i.forma_prometida.estado_c5 || ''));
const prometeCumprido = promete.filter(i => /cumprido na fonte/.test(i.forma_prometida.estado_c5 || ''));
const prometeParcial = promete.filter(i => /cumprido em parte/.test(i.forma_prometida.estado_c5 || ''));
const comTolerancia = instrumentos.filter(i => i.tolerancia.declarada_pela_fonte);
const pedeRevisao = instrumentos.filter(i => i.tolerancia.revisao_tecnica_pedida);
const comPrevisao = instrumentos.filter(i => i.previsao.util === true);
const bloqueados = instrumentos.filter(i => i.previsao.bloqueio);

const MODULOS_NAO_PORTADOS = ['M09', 'M13', 'M14', 'M16', 'M17'];
const naoPortados = instrumentos.filter(i => MODULOS_NAO_PORTADOS.includes(i.identidade.modulo));

const contagens = {
  instrumentos: instrumentos.length,
  por_modulo: Object.fromEntries(
    [...new Set(instrumentos.map(i => i.identidade.modulo))].sort()
      .map(m => [m, instrumentos.filter(i => i.identidade.modulo === m).length])),
  sem_extracao_de_camada_fonte: semFonte.map(i => i.identidade.id),
  entradas_especificadas: instrumentos.reduce((a, i) => a + i.entradas.length, 0),
  saidas_especificadas: instrumentos.reduce((a, i) => a + i.saidas.length, 0),
  unidades_de_saida: {
    saidas: contagemUnidades.saidas,
    com_unidade_na_extracao_bruta: contagemUnidades.com_unidade_na_extracao_bruta,
    com_unidade_agora: contagemUnidades.com_unidade,
    por_origem: contagemUnidades.por_origem,
    sufixo_textual_que_nao_e_unidade: contagemUnidades.sufixo_textual,
    sem_unidade_porque_nao_numerica: contagemUnidades.nao_numericas,
    sem_unidade_numerica_sem_declaracao: contagemUnidades.numericas_sem_unidade,
    sem_unidade_sem_id_na_extracao: contagemUnidades.sem_id,
  },
  forma_prometida: {
    prometem_forma: promete.length,
    cumprida_na_fonte: prometeCumprido.length,
    cumprida_em_parte: prometeParcial.length,
    promessa_sem_desenho: prometeSemDesenho.length,
    nao_prometem_forma: comFonte.length - promete.length
  },
  tolerancia: {
    declarada_pela_fonte: comTolerancia.length,
    quais: comTolerancia.map(i => i.identidade.id),
    revisao_tecnica_pedida: pedeRevisao.length,
    quais_pedem: pedeRevisao.map(i => i.identidade.id),
    veredito_dentro_fora_permitido: comTolerancia.map(i => i.identidade.id)
  },
  previsao: {
    util: comPrevisao.length,
    bloqueada_por_divergencia: bloqueados.map(i => i.identidade.id)
  },
  porte: {
    nao_portados_na_v2: naoPortados.length,
    modulos_nao_portados: MODULOS_NAO_PORTADOS
  },
  custo_por_nivel: Object.fromEntries(['P', 'M', 'G'].map(c =>
    [c, instrumentos.filter(i => i.forma_prometida.custo_estimado === c).length]))
};

const doc = {
  schema: 'alexandria-v2/instrumentos/1.0',
  titulo: 'Especificação dos 165 instrumentos da Alexandria',
  gerado_por: 'extratores/gerar-instrumentos.mjs',
  gerado_em: new Date().toISOString().slice(0, 10),
  metodo: [
    'Camada fonte: copiada de docs/alexandria-v2/extraction/mNN/ (instrumentos.json; no M01, aula-01..08.json e modulo.json). Nenhum valor foi redigitado.',
    'Camada alexandria: overlay/*.json — forma prometida, pergunta de previsão e pedido de revisão de tolerância. Escrita à mão, derivada do título, da intro e do desenho que a própria fonte declara.',
    'Nada foi buscado fora da extração. Onde a fonte não diz, a saída é ausência declarada (S4).',
    'Unidade de saída (3.6): a extração dá a unidade quando a tem; as demais são recuperadas do rótulo, do markup ou da saída formatada pelo script real do módulo (executado em tools/alexandria-dados/mini-dom.mjs), cada uma com `unidade_origem` e `unidade_evidencia`. Texto de aula não é usado. O que a fonte não declara fica `unidade: null` com `unidade_motivo`.',
    'Tolerância só existe onde a fonte a declara (P6). Sem tolerância, o instrumento não oferece veredito dentro/fora: oferece autoavaliação em três níveis (C7).'
  ],
  decisoes_aplicadas: ['P3', 'P5', 'P6', 'P8', 'P11', 'P14', 'P18', 'P19', 'P20', 'P24', 'P25', 'S4', 'C3', 'C5', 'C6', 'C7'],
  contagens,
  instrumentos
};

fs.writeFileSync(path.join(SAIDA, 'instrumentos.json'), JSON.stringify(doc, null, 1));

/* ---------- instrumentos.md --------------------------------------------------- */

const md = [];
const esc = s => String(s ?? '—').replace(/\|/g, '\\|').replace(/\n+/g, ' ');
const nn = v => (v == null || v === '' ? '—' : v);

md.push('# Os 165 instrumentos — especificação');
md.push('');
md.push('> Gerado por `extratores/gerar-instrumentos.mjs`. **Não editar à mão.** O que é fato vem da');
md.push('> extração; o que é julgamento vem de `overlay/*.json`. Ver `README.md`.');
md.push('');
md.push('## Contagens');
md.push('');
md.push(`- **${contagens.instrumentos} instrumentos**, ${contagens.entradas_especificadas} entradas e ${contagens.saidas_especificadas} saídas especificadas.`);
{
  const u = contagens.unidades_de_saida;
  md.push(`- **Unidade de saída:** ${u.com_unidade_agora} de ${u.saidas} saídas com unidade declarada pela fonte (antes: ${u.com_unidade_na_extracao_bruta} no campo bruto da extração) — origem: extração ${u.por_origem['extração']}, rótulo ${u.por_origem['rótulo']}, markup ${u.por_origem['markup']}, script ${u.por_origem['script']}. Sem unidade: ${u.sem_unidade_porque_nao_numerica} não numéricas, ${u.sem_unidade_numerica_sem_declaracao} numéricas sem declaração, ${u.sem_unidade_sem_id_na_extracao} sem id na extração. Cada uma com \`unidade_motivo\`.`);
}
md.push(`- **${contagens.sem_extracao_de_camada_fonte.length} sem extração de camada fonte:** ${contagens.sem_extracao_de_camada_fonte.join(', ')}.`);
md.push(`- **Forma prometida:** ${contagens.forma_prometida.prometem_forma} prometem; ${contagens.forma_prometida.cumprida_na_fonte} a fonte já desenha; ${contagens.forma_prometida.cumprida_em_parte} desenha em parte; **${contagens.forma_prometida.promessa_sem_desenho} prometem e não desenham nada**; ${contagens.forma_prometida.nao_prometem_forma} não prometem forma.`);
md.push(`- **Tolerância:** ${contagens.tolerancia.declarada_pela_fonte} declarada pela fonte (${contagens.tolerancia.quais.join(', ') || '—'}). ${contagens.tolerancia.revisao_tecnica_pedida} entram no pedido de revisão técnica. Todos os demais: autoavaliação em três níveis, sem veredito dentro/fora.`);
md.push(`- **Previsão:** ${contagens.previsao.util} instrumentos com pergunta de previsão útil; ${contagens.previsao.bloqueada_por_divergencia.length} bloqueados por divergência não reconciliada (${contagens.previsao.bloqueada_por_divergencia.join(', ') || '—'}).`);
md.push(`- **Custo de porte da forma:** P ${contagens.custo_por_nivel.P} · M ${contagens.custo_por_nivel.M} · G ${contagens.custo_por_nivel.G}.`);
md.push('');
md.push('## Índice por módulo');
md.push('');
md.push('| Módulo | Instrumentos | Prometem forma | Promessa sem desenho | Com tolerância |');
md.push('|---|---:|---:|---:|---:|');
for (const m of Object.keys(contagens.por_modulo)) {
  const sub = instrumentos.filter(i => i.identidade.modulo === m);
  md.push(`| ${m} | ${sub.length} | ${sub.filter(i => i.forma_prometida.promete === true).length} | ${sub.filter(i => /sem desenho/.test(i.forma_prometida.estado_c5 || '')).length} | ${sub.filter(i => i.tolerancia.declarada_pela_fonte).length} |`);
}
md.push('');

let modAtual = null;
for (const i of instrumentos) {
  const id = i.identidade;
  if (id.modulo !== modAtual) { modAtual = id.modulo; md.push(''); md.push(`## ${modAtual}`); md.push(''); }
  md.push(`### ${id.id} · ${id.titulo || id.titulo_ausencia || '—'}`);
  md.push('');
  if (!id.fonte_extraida) {
    md.push(`**${id.id_fonte}.** Ainda não disponível: o M01 não tem \`instrumentos.json\`, e este instrumento não foi extraído da camada fonte. Nada aqui foi preenchido por plausibilidade — nem título, nem entradas, nem fórmula.`);
    md.push('');
    md.push(`- **tolerância:** ${esc(i.tolerancia.nota_da_fonte)}`);
    md.push(`- **previsão:** ${esc(i.previsao.nota)}`);
    md.push('');
    continue;
  }
  md.push(`**Identidade.** ${esc(id.id_fonte)} · ${esc(id.aula)}${id.fora_de_aula ? ' (fora de aula)' : ''} · tipo: ${esc(id.kind)}`);
  md.push('');
  md.push(`**O que ele pergunta.** ${id.o_que_pergunta.pergunta_da_fonte ? esc(id.o_que_pergunta.pergunta_da_fonte) : '*A fonte não dá pergunta própria ao instrumento.*'} ${id.o_que_pergunta.instrucao_ou_intro ? '— instrução da fonte: “' + esc(id.o_que_pergunta.instrucao_ou_intro).slice(0, 320) + '”' : ''}`);
  md.push('');
  if (i.entradas.length) {
    md.push('**Entradas.**');
    md.push('');
    md.push('| id | rótulo | unidade | tipo | padrão | faixa | opções |');
    md.push('|---|---|---|---|---|---|---|');
    for (const e of i.entradas)
      md.push(`| ${esc(e.id)} | ${esc(e.rotulo)} | ${esc(e.unidade)} | ${esc(e.tipo)} | ${esc(e.padrao)} | ${esc(e.faixa)} | ${e.opcoes ? esc(e.opcoes.join(' / ')).slice(0, 200) : '—'} |`);
    md.push('');
  } else { md.push('**Entradas.** Nenhuma no markup — o instrumento é percorrido, não parametrizado.'); md.push(''); }
  if (i.saidas.length) {
    md.push('**Saídas.**');
    md.push('');
    md.push('| id | rótulo | unidade (origem) | tipo | fórmula declarada pela fonte |');
    md.push('|---|---|---|---|---|');
    for (const s of i.saidas)
      md.push(`| ${esc(s.id)} | ${esc(s.rotulo)} | ${s.unidade ? esc(s.unidade) + ' (' + s.unidade_origem + ')' : '—'} | ${esc(s.tipo)} | ${s.formula ? '`' + esc(s.formula).slice(0, 220) + '`' : '—'} |`);
    md.push('');
  }
  const f = i.forma_prometida;
  md.push('**Forma prometida (C5).**');
  md.push('');
  if (f.promete === true) {
    md.push(`- **Promete:** sim — ${f.estado_c5}`);
    if (f.evidencia_da_promessa) for (const ev of f.evidencia_da_promessa) md.push(`  - ${esc(ev)}`);
    md.push(`- **Desenho na fonte:** ${esc(f.desenho_declarado_na_fonte)}`);
    md.push(`- **O que precisa ser desenhado:** ${esc(f.o_que_desenhar)}`);
    if (f.eixos) { md.push(`- **Eixo x:** ${esc(f.eixos.x)}`); md.push(`- **Eixo y:** ${esc(f.eixos.y)}`); }
    if (f.series) md.push(`- **Séries:** ${esc(f.series.join(' · '))}`);
    md.push(`- **Relação que a figura tem de mostrar:** ${esc(f.relacao_que_a_figura_tem_de_mostrar)}`);
    md.push(`- **Derivação:** ${esc(f.derivacao)}`);
    if (f.reuso_de_figura) md.push(`- **Reúso:** ${esc(f.reuso_de_figura)}`);
    if (f.alerta_de_porte) md.push(`- **Alerta de porte:** ${esc(f.alerta_de_porte)}`);
    md.push(`- **Custo:** ${esc(f.custo_estimado)}`);
  } else {
    md.push(`- **Promete:** não — o nome e o texto não prometem forma desenhada.`);
    if (f.evidencia_da_promessa) for (const ev of f.evidencia_da_promessa) md.push(`  - ${esc(ev)}`);
    if (f.sem_promessa_mas) md.push(`- **Sem promessa, mas (C6):** ${esc(f.sem_promessa_mas)}`);
    if (f.reuso_de_figura) md.push(`- **Reúso:** ${esc(f.reuso_de_figura)}`);
    md.push(`- **Custo:** ${esc(f.custo_estimado)}`);
  }
  md.push('');
  const t = i.tolerancia;
  md.push('**Tolerância (P6).**');
  md.push('');
  if (t.declarada_pela_fonte) {
    md.push(`- **Declarada pela fonte:** ${esc(JSON.stringify(t.valor).slice(0, 300))}`);
    md.push(`- **Veredito permitido:** dentro/fora.`);
  } else {
    md.push(`- \`"tolerancia": null\` — a fonte não declara.`);
    md.push(`- **Veredito permitido:** nenhum. Autoavaliação em três níveis (${NIVEIS_C7.join(' · ')}).`);
    md.push(`- **Nota da fonte:** ${esc(t.nota_da_fonte)}`);
    if (t.revisao_tecnica_pedida) md.push(`- **Revisão técnica pedida ao Founder:** ${esc(t.pedido)}`);
    if (t.por_que_nao) md.push(`- **Por que não pedir:** ${esc(t.por_que_nao)}`);
  }
  md.push('');
  const p = i.previsao;
  md.push('**Previsão (C3).**');
  md.push('');
  if (p.util === true) {
    md.push(`- **Útil:** sim. ${esc(p.motivo)}`);
    md.push(`- **Pergunta (camada Alexandria):** ${esc(p.pergunta)}`);
    md.push(`- **Cenário-padrão:** ${esc(JSON.stringify(p.cenario)).slice(0, 300)}`);
    md.push(`- **Resposta no cenário-padrão:** ${esc(p.resposta_no_cenario_padrao)}`);
    if (p.ato_alternativo) md.push(`- **Ato alternativo:** ${esc(p.ato_alternativo)}`);
  } else {
    md.push(`- **Útil:** não. ${esc(p.motivo)}`);
    if (p.ato_alternativo) md.push(`- **Ato alternativo (C3):** ${esc(p.ato_alternativo)}`);
  }
  if (p.bloqueio) md.push(`- **BLOQUEIO:** ${esc(p.bloqueio)} — não formular a pergunta antes da reconciliação.`);
  md.push('');
  const av = i.avisos;
  const linhas = [];
  if (av.fonte_dos_numeros) linhas.push(`- **Fonte dos números:** ${esc(av.fonte_dos_numeros).slice(0, 400)}`);
  if (av.fonte_dos_numeros_nota) linhas.push(`- **Nota da fonte:** ${esc(av.fonte_dos_numeros_nota).slice(0, 400)}`);
  if (av.fonte_declarada_no_overlay) linhas.push(`- **Procedência declarada:** ${esc(av.fonte_declarada_no_overlay)}`);
  if (av.conteudo_qa) linhas.push(`- **Content QA (P20):** ${esc(av.conteudo_qa)}`);
  if (av.divergencia) linhas.push(`- **Divergência (P5/P8):** ${esc(av.divergencia)}`);
  if (av.nota_extracao) linhas.push(`- **Nota de extração:** ${esc(av.nota_extracao)}`);
  if (av.nota_c5) linhas.push(`- **Nota C5:** ${esc(av.nota_c5)}`);
  if (av.nota_produto) linhas.push(`- **Nota de produto:** ${esc(av.nota_produto)}`);
  if (linhas.length) { md.push('**Avisos.**'); md.push(''); md.push(...linhas); md.push(''); }
  md.push(`**Estado no código (informativo, não é camada fonte).** ${esc(i.estado_no_codigo).slice(0, 200)}`);
  md.push('');
}

fs.writeFileSync(path.join(SAIDA, 'instrumentos.md'), md.join('\n'));

console.log('instrumentos.json e instrumentos.md gerados.');
console.log(JSON.stringify(contagens, null, 1));
