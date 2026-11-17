// Calculadoras novas ou corrigidas do M12 (porte verbatim do script da fonte).
// Posse: a sessão de porte do M12. Uma chave aqui SUBSTITUI a de mesmo id em
// INSTRUMENT_CALCULATORS — é assim que um conserto (Q05/Q07) entra sem editar o arquivo grande.
import type { CalculateFn, EntradaInstrumento } from '../alexandria-instrument-calculators';
import {
  MODULO_12_VETORES,
  MODULO_12_FRENTES,
  MODULO_12_NUMEROS,
  MODULO_12_MARCOS,
  MODULO_12_PARCEIROS,
  MODULO_12_INSTRUMENTOS_COMERCIAIS,
  MODULO_12_CLASSES_PRODUTO,
  MODULO_12_FRONTEIRA_INVENTARIO,
  MODULO_12_VERIFICACAO_INVENTARIO,
  MODULO_12_DADO_PRECURSOR,
  MODULO_12_CARBONO_DOMESTICO,
  MODULO_12_ITENS_MATURIDADE,
  MODULO_12_ENTIDADES,
  MODULO_12_CATEGORIAS_NOME,
  MODULO_12_MOVIMENTOS,
} from '../alexandria-modulo-12-content';

// Fonte: `Alexandria modulos/alexandria_modulo12.html`, <script> L3114–4057.
// Extração verificada: docs/alexandria-v2/extraction/m12/instrumentos.json.
// Prova: tools/alexandria-dados/porte/verificar-instrumentos-m12.mjs (roda o
// script original em DOM simulado sobre o espaço de entrada inteiro e compara).
//
// Regra de saída (InstrumentoV3): o veredito é UM parágrafo de TEXTO PURO — sem
// tag e sem quebra. Por isso cada texto da fonte entra sem marcação: o `<b>` da
// fonte some (o texto dele fica), o `<br><br>` vira espaço, a lista vira itens
// separados por " · ". Os rótulos de painel/leitura da fonte ("Lente ativa",
// "Posição do dado", "Item em foco"…) entram como prefixo "Rótulo: valor".
// Nenhuma palavra vem de fora do instrumento na fonte.
//
// INST·02, 03, 04, 05 e 09 já estavam portados no arquivo grande (i2m12…i9m12,
// não exportadas): a lógica vem copiada VERBATIM de lá — mesmos números, mesmas
// faixas, mesmos helpers (nOu12/fm12/pc12) — e a única mudança é o veredito
// passar por `tx()`, porque lá ele saía com <b>/<br> que o InstrumentoV3 mostra
// literal.
//
// Os dados são os literais da fonte, importados do arquivo de conteúdo (iguais à
// fonte por igualdade profunda na extração). Defeito de script (Q07): nenhum
// encontrado nos onze instrumentos — faixas gêmeas conferem (estágio do
// INST·08 e ramos do veredito usam os mesmos cortes 4/8/12/16), não há campo
// vazio que valha 1 e todo ramo de texto é alcançável (o verificador percorre
// os 81 e os 19.683 casos e registra os ramos vistos).

/** Texto puro de um trecho HTML da fonte: tag vira espaço, entidade decodifica, espaço colapsa. */
const tx = (h: string): string =>
  String(h)
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .replace(/\s+([,.;:])/g, '$1')
    .trim();

/** Junta pedaços de texto com um espaço, sem espaço duplo. */
const junta = (...partes: string[]): string => partes.map(tx).filter(Boolean).join(' ');

const sel = (v: unknown, def: string): string => (v === undefined || v === '' ? def : String(v));

// ── helpers copiados verbatim do arquivo grande (bloco "MÓDULO 12") ───────────
//   numOf(el, def, a, b) → `nOu12` — vazio ou NaN vira o DEFAULT, e só então é preso em [a,b].
//   fmt(n, d)            → `fm12`  — pt-BR, `—` para NaN/Infinity.
//   pc(v)                → `pc12`  — precisão VARIÁVEL por magnitude (INST·09, L3717).
const nOu12 = (v: EntradaInstrumento | undefined, def: number, a: number, b: number): number => {
  if (v === undefined || v === '') return def;
  const x = typeof v === 'number' ? v : parseFloat(String(v).replace(',', '.'));
  if (Number.isNaN(x)) return def;
  return x < a ? a : x > b ? b : x;
};
const fm12 = (x: number, d = 0): string =>
  !Number.isFinite(x) ? '—' : x.toLocaleString('pt-BR', { minimumFractionDigits: d, maximumFractionDigits: d });
const s12 = (v: EntradaInstrumento | undefined, def: string): string =>
  v === undefined || v === '' ? def : String(v);
const pc12 = (v: number): string => {
  if (!Number.isFinite(v)) return '—';
  if (v === 0) return '0%';
  if (v < 0.01) return v.toFixed(4).replace('.', ',') + '%';
  if (v < 1) return v.toFixed(3).replace('.', ',') + '%';
  return v.toFixed(1).replace('.', ',') + '%';
};
const VETOR_NOME12: Record<string, string> = {
  cap: 'Capital', reg: 'Regulação e diplomacia', cad: 'Cadeia de valor',
};

/** Envolve uma calculadora: mesmo resultado, veredito em texto puro. */
const puro = (fn: CalculateFn): CalculateFn => (i) => {
  const r = fn(i);
  return r.veredito === undefined ? r : { ...r, veredito: tx(r.veredito) };
};

// ── INST·02 · Separador de grandeza (L3236–3268) — cópia de i2m12 ─────────────
// Original: w = pe/100 · ag = w·el + (1−w)·ne · di = el − ag
//           de = ag − of · co = w·el.
const i2m12: CalculateFn = (i) => {
  const el = nOu12(i['sg-el'], 86.8, 0, 100);
  const pe = nOu12(i['sg-pe'], 19, 1, 100);
  const ne = nOu12(i['sg-ne'], 41, 0, 100);
  const of = nOu12(i['sg-of'], 50, 0, 100);

  const w = pe / 100;
  const ag = w * el + (1 - w) * ne;
  const di = el - ag;
  const de = ag - of;
  const co = w * el;
  const ad = Math.abs(de);

  const txt = ad <= 2
    ? `<b>Consistente.</b> A renovabilidade agregada implícita fica dentro de dois pontos percentuais do valor oficial que você informou. Isso significa que os três parâmetros de entrada descrevem a mesma economia que a estatística oficial descreve — e que a diferença de ${fm12(Math.abs(di), 1)} pontos entre matriz elétrica e matriz energética é real, não artefato de conta. É essa distância que precisa ser dita sempre que um percentual de renovabilidade for citado.`
    : ad <= 6
      ? `<b>Divergência moderada.</b> A agregada implícita está a ${fm12(ad, 1)} pontos do valor oficial informado. Antes de concluir qualquer coisa, verifique a fronteira contábil do peso da eletricidade: consumo final de eletricidade contra oferta interna de energia dá um número; oferta interna de energia elétrica contra oferta interna de energia total dá outro, porque a segunda inclui as perdas de transformação. Divergência dessa ordem quase sempre é escolha de fronteira, não erro de dado.`
      : `<b>Divergência alta.</b> A agregada implícita está a ${fm12(ad, 1)} pontos do valor oficial. Nessa faixa não se trata mais de fronteira contábil: pelo menos um dos três parâmetros não pertence à mesma base estatística dos outros — ano-base diferente, país diferente, ou grandeza trocada. A conduta correta não é ajustar o parâmetro até fechar: é <b>voltar à fonte de cada um dos três</b> e conferir ano-base e denominador antes de usar qualquer resultado.`;

  return {
    valores: { 'sg-ag': ag, 'sg-di': di, 'sg-de': de, 'sg-co': co },
    veredito: txt,
  };
};

// ── INST·03 · Verificador de fonte de número (L3270–3325) — cópia de i3m12 ────
const i3m12: CalculateFn = (i) => {
  const k = s12(i['vn-sel'], MODULO_12_NUMEROS[0].k);
  const o = MODULO_12_NUMEROS.find((x) => x.k === k) ?? MODULO_12_NUMEROS[0];
  return {
    valores: {},
    veredito:
      `<b>${o.n}.</b>` +
      `<br><br><b>Fonte provável.</b> ${o.f}` +
      `<br><br><b>O que a grandeza mede.</b> ${o.m}` +
      `<br><br><b>Erro típico de citação.</b> ${o.e}` +
      `<br><br><b>O que verificar antes de repetir.</b> ${o.v}`,
  };
};

// ── INST·04 · Régua diplomático-regulatória (L3327–3398) — cópia de i4m12 ─────
const i4m12: CalculateFn = (i) => {
  const k = s12(i['rd-sel'], MODULO_12_MARCOS[0].k);
  const idx = Math.max(0, MODULO_12_MARCOS.findIndex((x) => x.k === k));
  const m = MODULO_12_MARCOS[idx];
  return {
    valores: {},
    veredito:
      `<b>${m.y} · marco ${idx + 1} de ${MODULO_12_MARCOS.length} — ${m.n}.</b>` +
      `<br><br><b>O que é.</b> ${m.o}` +
      `<br><br><b>Estado em 2 de agosto de 2026.</b> ${m.e}` +
      `<br><br><b>O que ainda falta.</b> ${m.f}`,
  };
};

// ── INST·05 · Comparador de parceiros bilaterais (L3400–3473) — cópia de i5m12 ─
const i5m12: CalculateFn = (i) => {
  const p = s12(i['cb-par'], 'china') as keyof typeof MODULO_12_PARCEIROS;
  const v = s12(i['cb-vet'], 'cap') as 'cap' | 'reg' | 'cad';
  const C = MODULO_12_PARCEIROS[p];
  const d = C[v];
  const vl = VETOR_NOME12[v];
  return {
    valores: {},
    veredito:
      `<b>${C.n} pelo vetor ${vl.toLowerCase()}.</b> Troque o vetor mantendo o parceiro e observe que a leitura muda inteiramente. Nenhum parceiro é melhor em abstrato: a avaliação depende do vetor pelo qual se pergunta e do interesse de quem faz a pergunta — e dizer isso, numa conversa, é mais informativo do que qualquer ranking.` +
      `<br><br><b>Estrutura principal.</b> ${d.a}` +
      `<br><br><b>Segundo elemento.</b> ${d.b}` +
      `<br><br><b>Fricção ou ressalva.</b> ${d.c}` +
      `<br><br><b>Leitura operacional.</b> ${d.d}`,
  };
};

// ── INST·09 · Razão reserva-produção (L3714–3774) — cópia de i9m12 ────────────
// Ramo por ramo como no original, inclusive os dois casos-limite
// (entrada incoerente e produção nula) que vêm ANTES das faixas.
const i9m12: CalculateFn = (i) => {
  const rn = nOu12(i['rp-rn'], 21, 0.1, 200);
  const rm = nOu12(i['rp-rm'], 85, 1, 500);
  const pn = nOu12(i['rp-pn'], 0.02, 0, 500);
  const pm = nOu12(i['rp-pm'], 390, 1, 5000);

  const sr = (rn / rm) * 100;
  const sp = (pn / pm) * 100;
  const incons = rn > rm || pn > pm;
  const ra = sp > 0 ? sr / sp : Infinity;
  const anos = pn > 0 ? (rn * 1000) / pn : Infinity;

  let txt: string;
  if (incons) {
    txt = '<b>Entrada inconsistente.</b> ' +
      (rn > rm ? 'A reserva nacional informada é maior que a reserva mundial. ' : '') +
      (pn > pm ? 'A produção nacional informada é maior que a produção mundial. ' : '') +
      'O instrumento não corrige a entrada porque o objetivo é justamente esse: quando duas fontes diferentes são combinadas sem checagem de coerência, a aritmética continua funcionando e o resultado continua parecendo um número. Confira se os dois valores vêm da mesma metodologia e do mesmo ano-base antes de dividir um pelo outro.';
  } else if (pn === 0) {
    txt = '<b>Produção nacional nula: a assimetria é máxima e a razão é indefinida.</b> Este é o caso-limite que o módulo existe para nomear. Um país pode deter parcela relevante da reserva mundial de um mineral e produzir zero, e nessa situação a reserva não confere nenhuma posição de barganha — confere apenas a <b>possibilidade</b> de construir uma, ao custo e no prazo de uma cadeia industrial que ainda não existe. Reserva no subsolo não é oferta no mercado.';
  } else if (ra >= 100) {
    txt = `<b>Assimetria extrema: participação na reserva ${ra >= 1000 ? fm12(Math.round(ra)) : ra.toFixed(0)} vezes maior que na produção.</b> Este é aproximadamente o caso brasileiro em terras-raras nos valores de referência: parcela expressiva da reserva mundial e produção de ordem de grandeza desprezível. A leitura correta não é "o Brasil é uma potência mineral" nem "o Brasil não tem nada" — é que o país tem <b>dotação sem cadeia</b>. E o gargalo, na maioria dos minerais críticos, não está na mina: está na separação, no refino e na manufatura do componente final, etapas que exigem capital, escala, tecnologia e demanda contratada.`;
  } else if (ra >= 5) {
    txt = `<b>Assimetria alta.</b> A participação na reserva excede a participação na produção por fator de ${ra.toFixed(1).replace('.', ',')}. Há produção real, mas muito abaixo do que a dotação permitiria. Neste intervalo, a pergunta de política pública deixa de ser "como começar" e passa a ser "o que limita a expansão" — e as respostas típicas são licenciamento, infraestrutura de escoamento, capital e ausência de comprador de longo prazo, não ausência de recurso.`;
  } else if (ra >= 1.5) {
    txt = `<b>Assimetria moderada.</b> Fator de ${ra.toFixed(1).replace('.', ',')} entre reserva e produção. O país produz aquém da sua dotação, mas está no jogo. Neste intervalo, participação de mercado passa a ser objeto de negociação comercial e não apenas de política industrial, e a posição de barganha começa a existir de fato.`;
  } else if (ra >= 0.8) {
    txt = '<b>Participações proporcionais.</b> A parcela na produção corresponde aproximadamente à parcela na reserva. É a situação do Brasil em minério de ferro e, em outra ordem de grandeza, em nióbio — dotação convertida em cadeia. Vale notar que mesmo aqui a pergunta de valor agregado permanece aberta: produzir na proporção da reserva não significa capturar a etapa de maior margem.';
  } else {
    txt = `<b>Produção acima da parcela na reserva.</b> Fator de ${ra.toFixed(2).replace('.', ',')}. O país extrai proporcionalmente mais do que detém, o que pode indicar cadeia madura, custo competitivo ou depleção mais rápida do estoque conhecido. As três hipóteses exigem verificação separada, e nenhuma delas se resolve por esta razão isoladamente.`;
  }
  if (pn > 0) {
    txt += ` <br><br><b>Sobre "anos de reserva ao ritmo atual":</b> ${fm12(Math.round(anos))} anos é uma razão entre estoque e fluxo, não uma previsão. Números na casa das centenas de milhares não descrevem abundância eterna — descrevem produção quase nula em relação ao estoque, que é exatamente o mesmo fato que a razão de assimetria já mostrou, expresso em outra unidade.`;
  }

  return {
    // `rp-ra` e `rp-an` ficam fora quando indefinidos: Infinity não é
    // número exibível, e o veredito já diz "indefinida".
    valores: {
      'rp-pr': sr, 'rp-pp': sp,
      ...(Number.isFinite(ra) ? { 'rp-ra': ra } : {}),
      ...(Number.isFinite(anos) ? { 'rp-an': Math.round(anos) } : {}),
    },
    veredito: `${txt}<br><br><b>Participação na reserva:</b> ${pc12(sr)} · <b>na produção:</b> ${pc12(sp)}.`,
  };
};

// ── INST·01 · Tabuleiro geopolítico (L3181–3234) ──────────────────────
// renderLente (L3211) + renderItem (L3217). Antes: perdia "Lente ativa" e o
// cabeçalho "‹Vetor› · ‹Frente›" do painel tb-item.
const VETOR_TITULO: Record<string, string> = { cap: 'Vetor capital', reg: 'Vetor regulação e diplomacia', cad: 'Vetor cadeia de valor' }; // L3213
const VETOR_ROTULO: Record<string, string> = { cap: 'Capital', reg: 'Regulação e diplomacia', cad: 'Cadeia de valor' }; // L3221
const PERGUNTA: Record<string, string> = { // L3226–3228
  cap: 'Qual é a moeda, a condicionalidade, o horizonte e a governança que acompanham esse capital?',
  reg: 'Isso é lei em vigor, lei sem regulamento, projeto em tramitação, ou compromisso sem força vinculante? E com que data?',
  cad: 'O Brasil está na etapa de recurso ou na etapa de transformação? E onde exatamente está o gargalo que impede o salto?',
};
const i1: CalculateFn = (i) => {
  const vet = sel(i['tb-seg'], 'cap') as keyof typeof MODULO_12_VETORES;
  const fk = sel(i['tb-frente'], MODULO_12_FRENTES[0].k);
  const f = MODULO_12_FRENTES.find((o) => o.k === fk) ?? MODULO_12_FRENTES[0];
  const vl = VETOR_ROTULO[vet];
  return {
    valores: {},
    veredito: junta(
      `Lente ativa: ${VETOR_TITULO[vet]}.`,
      MODULO_12_VETORES[vet],
      `${vl} · ${f.n}: ${f.n} pelo vetor ${vl.toLowerCase()}.`,
      f[vet],
      `Pergunta de verificação: ${PERGUNTA[vet]}`,
    ),
  };
};

// ── INST·06 · Roteador de instrumento comercial (L3475–3538) ──────────
// upd (L3520). As quatro leituras (rt-aut/pra/jud/rev) são texto: entram com o
// rótulo do markup. Antes: perdia o rótulo "Instrumento" do painel rt-nota (L3535).
const i6: CalculateFn = (i) => {
  const ik = sel(i['rt-inst'], 'emerg') as keyof typeof MODULO_12_INSTRUMENTOS_COMERCIAIS;
  const pk = sel(i['rt-prod'], 'energia') as keyof typeof MODULO_12_CLASSES_PRODUTO;
  const d = MODULO_12_INSTRUMENTOS_COMERCIAIS[ik] ?? MODULO_12_INSTRUMENTOS_COMERCIAIS.emerg;
  const q = (MODULO_12_CLASSES_PRODUTO[pk] ?? MODULO_12_CLASSES_PRODUTO.energia) as Record<string, string>;
  return {
    valores: {},
    veredito: junta(
      `Autoridade: ${d.aut}.`,
      `Prazo típico: ${d.pra}.`,
      `Controle judicial: ${d.jud}.`,
      `Reversibilidade: ${d.rev}.`,
      `${q.n} sob ${d.n.toLowerCase()}.`,
      q[ik],
      'Antes de repetir qualquer alíquota: a incidência é definida por código tarifário, produto a produto, e a sobretaxa se soma à tarifa regular já aplicável. Um produto com 5% de tarifa regular sob uma sobretaxa de 25% passa a pagar 30%, não 25%.', // L3533
      `Instrumento: ${d.n}.`,
      d.nota,
    ),
  };
};

// ── INST·07 · Prontidão de dado de carbono (L3540–3603) ───────────────
// upd (L3549), verbatim. Antes: três dos quatro ramos do veredito eram texto
// inventado, os dois adendos sobre o desconto doméstico estavam perdidos e
// `pc-base` (que a fonte não exibe) saía em `valores`. As quatro leituras são
// texto (L3578–3581) e entram com o rótulo do markup.
const i7: CalculateFn = (i) => {
  const f = sel(i['pc-fr'], 'corp') as keyof typeof MODULO_12_FRONTEIRA_INVENTARIO;
  const v = sel(i['pc-vr'], 'nao') as keyof typeof MODULO_12_VERIFICACAO_INVENTARIO;
  const p = sel(i['pc-pr'], 'nao') as keyof typeof MODULO_12_DADO_PRECURSOR;
  const c = sel(i['pc-cd'], 'nao') as keyof typeof MODULO_12_CARBONO_DOMESTICO;
  const FR = MODULO_12_FRONTEIRA_INVENTARIO[f] ?? MODULO_12_FRONTEIRA_INVENTARIO.corp;
  const sf = FR.s;
  const sv = (MODULO_12_VERIFICACAO_INVENTARIO[v] ?? MODULO_12_VERIFICACAO_INVENTARIO.nao).s;
  const sp = (MODULO_12_DADO_PRECURSOR[p] ?? MODULO_12_DADO_PRECURSOR.nao).s;
  const sc = (MODULO_12_CARBONO_DOMESTICO[c] ?? MODULO_12_CARBONO_DOMESTICO.nao).s;
  const base = sf + sv + sp;

  let pos: string; // L3557
  if (sf === 0) pos = 'Não atribuível a produto';
  else if (base >= 5) pos = 'Defensável';
  else if (base >= 3) pos = 'Parcial';
  else pos = 'Frágil';
  let blq: string; // L3562
  if (sf === 0) blq = 'Fronteira do inventário';
  else if (sv === 0) blq = 'Ausência de verificação';
  else if (sp === 0) blq = 'Ausência de dado de precursor';
  else if (sv === 1) blq = 'Verificação apenas interna';
  else if (sp === 1) blq = 'Cobertura parcial de precursor';
  else if (sf === 1) blq = 'Fronteira pode ser insuficiente para o produto';
  else blq = 'Nenhum eixo bloqueia o dado';
  let vpd: string; // L3570
  if (sf === 0 || sp === 0) vpd = 'Alto — valor padrão provável';
  else if (sv === 0) vpd = 'Alto — dado sem verificação';
  else if (base >= 5) vpd = 'Baixo';
  else vpd = 'Moderado';
  let des: string; // L3575
  if (sc === 0) des = 'Indisponível — sem regime no país';
  else if (sc === 1) des = 'Indisponível hoje, previsível no futuro';
  else des = 'Potencialmente aplicável, sujeito a reconhecimento';

  let txt: string; // L3582
  if (sf === 0) {
    txt = `Bloqueio na fronteira, e nenhum outro eixo compensa. ${FR.d} Enquanto o inventário for corporativo, verificação por terceiro e dado de precursor não resolvem — porque não há a quem atribuir a emissão. O primeiro movimento, e o único que importa neste estado, é construir inventário por produto. Todo o resto vem depois.`;
  } else if (base >= 5) {
    txt = 'Posição defensável. Fronteira de produto declarada, verificação e dado de precursor em nível que sustenta negociação com comprador exigente. Neste estado, a vantagem da eletricidade brasileira de baixo fator de emissão pode ser efetivamente demonstrada, em vez de apenas afirmada. Duas ressalvas permanecem: emissões de processo e de combustível térmico não são compensadas pela matriz elétrica, e a metodologia aplicável é a do mecanismo, não a do inventário corporativo.';
  } else if (base >= 3) {
    txt = `Posição parcial. O dado existe e é atribuível a produto, mas o eixo que bloqueia — ${blq.toLowerCase()} — é o que o comprador vai apontar primeiro. Em negociação, dado não verificado ou com precursor incompleto tende a ser tratado como não existente, e o resultado prático é o mesmo de não ter dado: aplicação de valor padrão. O investimento de maior retorno aqui não é redução de emissão, é fechamento do eixo que falta.`;
  } else {
    txt = 'Posição frágil. A fronteira é de produto, o que é o passo mais difícil e já foi dado, mas verificação e dado de precursor estão em nível que não sustenta comprovação perante terceiro. Sem eles, o inventário é declaração unilateral. A sequência de menor custo é fechar precursor dos principais fornecedores primeiro e verificação por terceiro depois — nessa ordem, porque verificar um inventário sem dado de precursor apenas certifica a lacuna.';
  }
  // Adendos (L3595). Assimetria da fonte, mantida: com sf===0 o adendo de
  // regime operacional (sc===2) não sai, o de regime em regulamentação (sc===1) sai.
  if (sc === 2 && sf > 0) {
    txt += ' Sobre o desconto de carbono doméstico: com regime operacional e reconhecido, o preço de carbono já pago no país pode ser considerado — o que depende de reconhecimento formal e de comprovação de pagamento, não da simples existência da lei.';
  } else if (sc === 1) {
    txt += ' Sobre o desconto de carbono doméstico: um regime em regulamentação não produz desconto. É a situação brasileira na data de verificação — lei de dezembro de 2024, regulamentação infralegal em construção, mercado regulado previsto para o início da década de 2030.';
  }
  return {
    valores: {},
    veredito: junta(
      `Posição do dado: ${pos}.`,
      `Eixo que bloqueia: ${blq}.`,
      `Risco de valor padrão: ${vpd}.`,
      `Desconto de carbono doméstico: ${des}.`,
      txt,
    ),
  };
};

// ── INST·08 · Régua de maturidade (L3605–3712) ───────────────────────
// upd (L3652), verbatim. Antes: os seis ramos do veredito eram texto inventado
// e o item em foco vinha de um campo `mp-sel` que a fonte não tem. Aqui o foco é
// o da fonte (L3693–3696): primeiro item crítico não vinculante com nota; senão
// o primeiro não vinculante com nota; senão o nono item. `mp-sel` é ignorado.
// Pontuação e vinculantes são número (valores); estágio, bloqueios e item em
// foco são texto e entram com o rótulo do markup/painel.
const i8: CalculateFn = (i) => {
  const IT = MODULO_12_ITENS_MATURIDADE;
  const st: Record<string, number> = {};
  for (const o of IT) {
    const v = Number(sel(i[`mp-e-${o.k}`], '0'));
    st[o.k] = v === 1 || v === 2 ? v : 0; // a fonte só produz 0, 1 ou 2 (data-v dos botões)
  }
  let pts = 0;
  let vin = 0;
  const blq: string[] = [];
  for (const o of IT) {
    const v = st[o.k];
    pts += v;
    if (v === 2) vin++;
    if (o.crit && v === 0) blq.push(o.n);
  }
  let est: string; // L3660
  if (pts <= 3) est = 'Anúncio';
  else if (pts <= 7) est = 'Estudo';
  else if (pts <= 11) est = 'Desenvolvimento';
  else if (pts <= 15) est = 'Estruturação avançada';
  else est = 'Pronto para implantação';
  const blqTxt = blq.length === 0 ? 'nenhum' : `${blq.length} de 3`; // L3668

  let txt: string; // L3670
  if (blq.length === 3) {
    txt = 'Os três itens críticos estão ausentes. Independentemente da pontuação total, este é um anúncio. Energia, comprador e capital são o que converte intenção em projeto, e nenhum avanço em licenciamento, engenharia ou terreno substitui os três. Um projeto neste estado pode ser real, sério e bem conduzido — mas não pertence à mesma tabela de um projeto contratado, e somar os dois produz um número que não significa nada.';
  } else if (blq.length > 0) {
    txt = `Bloqueio crítico: ${blq.join('; ')}. A pontuação de ${pts} pode sugerir maturidade, e é exatamente aí que a soma engana. ` +
      (pts >= 12 ? `Com ${pts} pontos, este projeto aparece como avançado em qualquer tabela agregada, e ainda assim falta o item que decide se ele existe. ` : '') +
      'Antes de qualquer discussão sobre prazo de entrega ou capacidade instalada, a pergunta é o que falta para destravar esse item específico — e se o que falta está sob controle do proponente ou depende de terceiro.';
  } else if (pts >= 16) {
    txt = 'Pronto para implantação, com os três críticos atendidos. Este é o único estado em que a capacidade anunciada pode ser somada a outras da mesma categoria sem produzir distorção. Duas ressalvas de método permanecem: a régua mede evidência documental, não execução — projetos com decisão final de investimento atrasam, encarecem e ocasionalmente são cancelados; e "pronto" não é "em operação", que é uma categoria distinta e verificável separadamente.';
  } else if (pts >= 12) {
    txt = 'Estruturação avançada, sem bloqueio crítico. Os três itens que decidem estão pelo menos indicativos, e o que falta é conversão de indicativo em vinculante. Neste estágio, a pergunta útil não é sobre o projeto e sim sobre a sequência: qual item precisa fechar primeiro para que os demais possam fechar, e qual deles depende de ato de terceiro — regulador, financiador ou comprador — em vez de depender do proponente.';
  } else if (pts >= 8) {
    txt = 'Desenvolvimento. Há trabalho real e verificável, e nenhum crítico em zero. Ainda assim, indicativo não é vinculante: memorando, carta de interesse e termo indicativo são documentos que registram intenção e não obrigam a nada. Ao ler um comunicado sobre um projeto neste estágio, o teste de uma linha é procurar a palavra que descreve o vínculo — e, na ausência dela, presumir que não existe.';
  } else if (pts >= 4) {
    txt = 'Estudo. O projeto tem substância técnica e nenhum compromisso firmado. É um estágio legítimo e necessário — todo projeto passa por ele —, mas a distância até a operação continua sendo medida em anos e em decisões que ainda não foram tomadas. Capacidade nesse estágio não deve entrar em nenhuma soma apresentada como potencial do país.';
  } else {
    txt = 'Anúncio. Nada aqui é vinculante. Note que este é o estado da maior parte da capacidade que aparece em manchetes sobre hidrogênio no Brasil e no mundo, e que somar essas capacidades produz um total impressionante e analiticamente vazio. A formulação honesta para descrever este conjunto é potencial de implementação, com o horizonte declarado — que foi, aliás, a formulação adotada pela própria chamada pública brasileira de polos.';
  }

  // Item em foco (L3693–3699).
  type Item = (typeof IT)[number] & { nota?: string };
  const itens = IT as readonly Item[];
  const alvo: Item =
    itens.find((o) => o.crit && st[o.k] < 2 && o.nota) ??
    itens.find((o) => st[o.k] < 2 && o.nota) ??
    itens[8];

  return {
    valores: { 'mp-pts': pts, 'mp-vin': vin },
    veredito: junta(
      `Estágio classificado: ${est}.`,
      `Bloqueios críticos: ${blqTxt}.`,
      txt,
      `Item em foco · estado ${st[alvo.k]} de 2: ${alvo.n}.`,
      alvo.nota ?? '',
    ),
  };
};

// ── INST·10 · Classificador de nome (L3776–3852) ──────────────────────
// upd (L3838). Antes: os rótulos "Classificação", "Onde pode aparecer" e
// "Substituição correta" (L3843–3845) viraram texto novo.
const i10: CalculateFn = (i) => {
  const k = sel(i['cn-sel'], MODULO_12_ENTIDADES[0].k);
  const e = MODULO_12_ENTIDADES.find((o) => o.k === k) ?? MODULO_12_ENTIDADES[0];
  const c = MODULO_12_CATEGORIAS_NOME[String(e.cat) as keyof typeof MODULO_12_CATEGORIAS_NOME];
  return {
    valores: {},
    // A classificação calculada, para a previsão por escolha (modulos-v3/m12.ts). Não é
    // saída de tela: `cn-cat` não está em `outputs`, e o veredito já a mostra.
    textos: { 'cn-cat': c.n },
    veredito: junta(
      `Classificação: ${c.n}.`,
      `Onde pode aparecer: ${e.ond}`,
      `Substituição correta: ${e.sub}`,
      `${c.st}.`,
      e.por,
    ),
  };
};

// ── INST·11 · Andaime de conversa (L3854–3936) ────────────────────────
// render (L3916). Antes: as âncoras saíam coladas por vírgula (Array→String),
// o relógio perdia "Minuto t" e os rótulos da ponte e do erro eram outros. As
// âncoras (ul.and-anc) viram itens separados por " · ".
const i11: CalculateFn = (i) => {
  const M = MODULO_12_MOVIMENTOS;
  const t = sel(i['an-sel'], M[0].t);
  const idx = Math.max(0, M.findIndex((o) => o.t === t));
  const m = M[idx];
  return {
    valores: {},
    veredito: junta(
      `Minuto ${m.t} · movimento ${idx + 1} de 8.`,
      m.q,
      `Âncoras: ${m.anc.map(tx).join(' · ')}`,
      `Ponte para o movimento seguinte: ${m.br}`,
      `Erro que faz a conversa voltar: ${m.no}`,
    ),
  };
};

const CALCULOS: Record<string, CalculateFn> = {
  'm12-inst-01': i1,
  'm12-inst-02': puro(i2m12),
  'm12-inst-03': puro(i3m12),
  'm12-inst-04': puro(i4m12),
  'm12-inst-05': puro(i5m12),
  'm12-inst-06': i6,
  'm12-inst-07': i7,
  'm12-inst-08': i8,
  'm12-inst-09': puro(i9m12),
  'm12-inst-10': i10,
  'm12-inst-11': i11,
};

// Todo veredito deste módulo já sai formatado em pt-BR pelo próprio porte (ponto só como
// separador de milhar: "Lei nº 14.948", "4.818×", "R$ 8.854 milhões"). `vereditoPtBr` diz
// à tela para não trocar ponto por vírgula (medido em todos os cenários das opções e dos
// extremos das faixas: nenhum ponto decimal).
export const CALCULADORAS: Record<string, CalculateFn> = Object.fromEntries(
  Object.entries(CALCULOS).map(([id, fn]) => [id, ((i) => ({ ...fn(i), vereditoPtBr: true })) as CalculateFn]),
);
