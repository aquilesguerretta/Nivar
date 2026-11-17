// Calculadoras novas ou corrigidas do M08 (porte verbatim do script da fonte).
// Posse: a sessão de porte do M08. Uma chave aqui SUBSTITUI a de mesmo id em
// INSTRUMENT_CALCULATORS — é assim que um conserto (Q05/Q07) entra sem editar o arquivo grande.
//
// Fonte: `<script>` de `Alexandria modulos/alexandria_modulo08.html`. Os corpos de `corrigirRodada` e
// `i3calcM08` são cópias das funções do arquivo grande (vereditos verbatim, conferidos pela extração do M08);
// o que mudou:
//   INST 03 · as leituras saem em `textos` na formatação da fonte, inclusive a "Faixa típica · <fonte>"
//             ("40% a 60%"), que o porte antigo partia em dois números sem o nome da fonte.
//   INST 04 · D17 (decisão do Founder, 15/11): o reconstrutor volta a ser UM instrumento, como na fonte,
//             com a rodada (capacidade / geração) como campo. O botão "Corrigir esta rodada" da fonte vira
//             um seletor: até o aluno escolher corrigir, a correção (leituras e veredito) não existe — a
//             tela mostra só a instrução da rodada, como a fonte. Voltam a leitura "Ordem das fontes" e as
//             linhas de erro por fonte (`err-row`). "Normalizar para 100%" e "Zerar" não têm equivalente
//             (o modelo de aula não tem ação que altere campos); registrado em docs/alexandria-v3/porte/m08.md.
//   INST 07 · leitura "Mês" em texto, como o painel da fonte ("Mês 7").
//   INST 10 · "Bloco 10" → "Módulo 10" no veredito (Q02/Q03).

import type { CalculateFn, EntradaInstrumento, ResultadoInstrumento } from '../alexandria-instrument-calculators';
import {
  M08_INST07_MESES,
  M08_INST03_FAIXAS,
  M08_INST04_FONTES,
  M08_INST04_REF,
  M08_INST04_TOL,
  M08_INST04_RODADAS,
} from '../alexandria-modulo-08-content';

/** `f1` e `f0` da fonte (L2048–2049). */
const f1m08 = (x: number) => (Math.round(x * 10) / 10).toFixed(1).replace('.', ',');
const f0m08 = (x: number) => String(Math.round(x));
/** `clamp` da fonte: não-finito cai no MÍNIMO (comportamento literal). */
const clampM08 = (v: EntradaInstrumento, a: number, b: number) => {
  const x = Number(v);
  if (!Number.isFinite(x)) return a;
  return Math.min(b, Math.max(a, x));
};

// ── INST 03 · calculadora de fator de capacidade (L2160–2210) ──────────────
function i3calcM08(i: Record<string, EntradaInstrumento>): ResultadoInstrumento {
  const p = clampM08(i['i3-p'] ?? 300, 1, 15000);
  const e = clampM08(i['i3-e'] ?? 1200, 1, 80000);
  const h = clampM08(i['i3-h'] ?? 8760, 24, 8784);
  const chave = String(i['i3-s'] ?? 'hid');
  const fx = M08_INST03_FAIXAS[chave] ?? M08_INST03_FAIXAS.hid;

  const teor = (p * h) / 1000;
  const fc = teor > 0 ? (e / teor) * 100 : 0;
  const horasEq = p > 0 ? (e * 1000) / p : 0;

  let msg: string;
  if (fc > 100) {
    msg = '<b>Fator acima de 100% — impossível fisicamente.</b> A energia informada excede a que a potência declarada consegue produzir no período. Três causas cobrem quase todos os casos: unidade trocada entre MWh e GWh, período menor que o efetivo de geração, ou potência informada abaixo da real. Antes de investigar qualquer coisa no ativo, confira as unidades.';
  } else if (fc < fx.lo) {
    msg = `<b>Abaixo da faixa típica de ${fx.nome}.</b> ${fx.baixo} Lembre que o fator de capacidade é sintoma, não diagnóstico: ele mistura recurso, disponibilidade, despacho e restrição numa razão só, e separar essas causas exige a série horária, não o total do período.`;
  } else if (fc > fx.hi) {
    msg = `<b>Acima da faixa típica de ${fx.nome}.</b> ${fx.alto} Um valor fora da faixa é sinal para investigar, nunca prova de erro — as faixas são ordens de grandeza para leitura rápida, não parâmetros de projeto.`;
  } else {
    msg = `<b>Dentro da faixa típica de ${fx.nome}.</b> As ${String(Math.round(horasEq))} horas equivalentes a plena carga são a tradução mais intuitiva do resultado: é como se a usina tivesse operado no máximo durante esse número de horas e ficado parada no resto do período. Guarde essa leitura — ela torna a comparação entre fontes imediata sem precisar de percentual.`;
  }
  return {
    valores: { 'i3-teor': teor, 'i3-fc': fc, 'i3-heq': horasEq, 'i3-fx-lo': fx.lo, 'i3-fx-hi': fx.hi },
    textos: {
      'i3-teor': `${f0m08(teor)} GWh`,
      'i3-fc': `${f1m08(fc)}%`,
      'i3-heq': `${f0m08(horasEq)} h`,
      'i3-fx': `${fx.nome} · ${fx.lo}% a ${fx.hi}%`,
    },
    veredito: msg,
    vereditoPtBr: true,
  };
}

// ── INST 04 · reconstrutor de matriz (L2290–2400) ──────────────────────────
function corrigirRodada(
  rodada: 'cap' | 'ger',
  i: Record<string, EntradaInstrumento>,
): ResultadoInstrumento {
  const ref = M08_INST04_REF[rodada];
  const pal: Record<string, number> = {};
  let faltando = 0;
  for (const f of M08_INST04_FONTES) {
    const bruto = i[f.id];
    // Campo vazio não vira 0: a fonte distingue ausente de zero
    // (`pal[f.k] === undefined` → faltando).
    if (bruto === undefined || bruto === '') { faltando++; continue; }
    pal[f.id] = clampM08(bruto, 0, 100);
  }
  if (faltando > 0) {
    return {
      valores: {},
      vereditoPtBr: true,
      veredito: `<b>Faltam ${faltando} estimativa${faltando > 1 ? 's' : ''}.</b> Preencha todas as seis antes de corrigir. Chutar é parte do exercício: o objetivo não é acertar, é descobrir em que direção você erra — e para isso o instrumento precisa de todas as fatias.`,
    };
  }
  const soma = M08_INST04_FONTES.reduce((a, f) => a + pal[f.id], 0);
  let errTotal = 0;
  let acertos = 0;
  const superest: string[] = [];
  const subest: string[] = [];
  for (const f of M08_INST04_FONTES) {
    const d = pal[f.id] - ref[f.id];
    errTotal += Math.abs(d);
    if (Math.abs(d) <= M08_INST04_TOL) acertos++;
    else if (d > 0) superest.push(f.nome);
    else subest.push(f.nome);
  }
  const ordPal = [...M08_INST04_FONTES].sort((a, b) => pal[b.id] - pal[a.id]).map((f) => f.id).join(',');
  const ordRef = [...M08_INST04_FONTES].sort((a, b) => ref[b.id] - ref[a.id]).map((f) => f.id).join(',');
  const ordemOk = ordPal === ordRef;
  let msg: string;
  if (Math.abs(soma - 100) > 8) {
    msg = `<b>A soma das suas fatias é ${f1m08(soma)}%, não 100%.</b> Antes de qualquer diagnóstico de conteúdo, corrija isso — uma pizza que não fecha em cem por cento não é uma estimativa da matriz, é uma lista de palpites independentes. Use o botão de normalizar e observe como as fatias se reorganizam: essa reorganização já ensina metade do exercício, porque mostra quais fontes você estava inflando sem perceber.`;
  } else if (ordemOk && acertos === 6) {
    msg = `<b>Reconstrução correta.</b> Ordem certa e todas as seis fatias dentro da tolerância de ${M08_INST04_TOL} pontos. Isso é o critério oficial de domínio deste bloco cumprido para a pizza de ${rodada === 'cap' ? 'capacidade' : 'geração'}. Faça a outra rodada e, ao terminar, explique em voz alta cada troca de posição entre as duas — é a explicação, não o acerto, que consolida.`;
  } else if (ordemOk) {
    msg = `<b>Ordem correta, com ${6 - acertos} fatia${6 - acertos > 1 ? 's' : ''} fora da tolerância.</b> Isso é aprovação no critério que importa. A ordem e a ordem de grandeza são conhecimento durável; o decimal tem prazo de validade de um ano e você deve consultá-lo, não decorá-lo. Se quiser fechar o exercício por completo, revise apenas as fontes marcadas em vermelho — mas não gaste tempo memorizando os valores exatos.`;
  } else {
    msg = `<b>A ordem das fontes está incorreta.</b> Esse é o erro que importa neste bloco, e é bem mais grave que errar decimal. A ordem é o que você usa numa conversa sem consultar nada, e é o que impede a frase indefensável do tipo "a segunda maior fonte do Brasil". Refaça esta rodada olhando as fichas da Aula 02, com atenção especial ao fator de capacidade de cada fonte — é ele que determina a posição em cada uma das duas pizzas.`;
  }
  if (superest.length || subest.length) {
    msg += '<br><br><b>Diagnóstico do seu viés.</b> ';
    if (superest.length) msg += 'Você superestimou: ' + superest.join(', ') + '. ';
    if (subest.length) msg += 'Você subestimou: ' + subest.join(', ') + '. ';
    if (rodada === 'cap' && subest.indexOf('Térmica fóssil') >= 0) {
      msg += 'Subestimar a térmica em capacidade é o viés mais comum e tem causa identificável: como ela gera pouco em ano bom, a intuição a encolhe. Ela é maior do que parece justamente porque existe para os anos ruins — capacidade que raramente é usada continua sendo capacidade.';
    }
    if (rodada === 'ger' && superest.indexOf('Solar') >= 0) {
      msg += 'Superestimar a solar em geração é o segundo viés mais comum. Ela é a fonte mais visível, a que mais aparece em notícia e a que mais cresce em potência, e essa saliência empurra a estimativa de energia para cima. O corretivo é lembrar que o recurso só existe durante parte do dia.';
    }
    if (rodada === 'ger' && subest.indexOf('Hidrelétrica') >= 0) {
      msg += 'Subestimar a hidrelétrica em geração costuma vir de exposição excessiva à narrativa de expansão renovável variável. A hidro perdeu participação por diluição, não por encolhimento: a fatia caiu porque a pizza cresceu.';
    }
  }
  // Linhas de erro por fonte (`err-row` da fonte): nome e desvio com sinal, em pontos percentuais.
  const linhas = M08_INST04_FONTES.map((f) => {
    const d = pal[f.id] - ref[f.id];
    return `<b>${f.nome}</b> ${d >= 0 ? '+' : '−'}${f1m08(Math.abs(d))} pp`;
  }).join('<br>');
  return {
    valores: { 'i4-acertos': acertos, 'i4-err': errTotal, 'i4-soma': soma },
    textos: {
      'i4-acertos': `${acertos} de 6`,
      'i4-err': `${f1m08(errTotal)} pp`,
      'i4-soma': `${f1m08(soma)}%`,
      'i4-ordem': ordemOk ? 'Correta' : 'Incorreta',
    },
    veredito: `${linhas}<br><br>${msg}`,
    vereditoPtBr: true,
  };
}

const inst04: CalculateFn = (i) => {
  const rodada = i['i4-rodada'] === 'ger' ? 'ger' : 'cap';
  // Antes do gesto de corrigir, a fonte mostra só a instrução da rodada (handler do `i4-seg`).
  if (i['i4-corrigir'] !== 'sim') return { valores: {}, veredito: M08_INST04_RODADAS[rodada], vereditoPtBr: true };
  return corrigirRodada(rodada, i);
};

// ── INST 07 · calendário sazonal — cópia do porte antigo; a leitura "Mês" sai em texto ("Mês 7",
//    como o painel da fonte), em vez do número formatado com casas decimais ──────────────────
function i7renderM08(i: Record<string, EntradaInstrumento>): ResultadoInstrumento {
  const bruto = Number(i['i7-sel'] ?? 7);
  // A fonte indexa `I7.meses[I7.sel-1]` e só chega aqui por clique num
  // mês existente; o grampo cobre valor fora da faixa sem inventar mês.
  const sel = Number.isFinite(bruto) ? Math.min(Math.max(Math.trunc(bruto), 1), 12) : 7;
  const m = M08_INST07_MESES[sel - 1];
  const linha = (r: string, v: string) => `<b>${r}</b> — ${v}`;
  return {
    valores: { 'i7-mes': m.n },
    veredito: [
      `<b>${m.nome}</b>`,
      m.txt,
      [
        linha('Chuva', m.chuva),
        linha('Vento', m.vento),
        linha('Safra', m.safra),
        linha('Carga', m.carga),
        linha('Risco de corte', m.risco),
      ].join('<br>'),
    ].join('<br><br>'),
  };
}

const inst07: CalculateFn = (i) => {
  const r = i7renderM08(i);
  return { ...r, textos: { 'i7-mes': String(r.valores['i7-mes'] ?? '') }, vereditoPtBr: true };
};

// ── INST 10 · perfil de carga — cópia do porte antigo; Q02/Q03 no veredito ("Bloco 10" → "Módulo 10") ──
function i10calcM08(i: Record<string, EntradaInstrumento>): ResultadoInstrumento {
  const c = clampM08(i['i10-c'] ?? 120, 1, 600);
  const h = clampM08(i['i10-h'] ?? 24, 4, 24);
  const d = clampM08(i['i10-d'] ?? 7, 1, 7);
  const t = clampM08(i['i10-t'] ?? 40, 0, 100);

  const horasAno = h * d * 52;
  const demMed = horasAno > 0 ? (c * 1000) / horasAno : 0;
  const demMedAnual = (c * 1000) / 8760;
  const fatorCarga = demMed > 0 ? (demMedAnual / demMed) * 100 : 0;
  const horasDiurnas = Math.min(h, 7);
  const energiaDiurna = c * (t / 100);
  const potDiurna = horasDiurnas * d * 52 > 0 ? (energiaDiurna * 1000) / (horasDiurnas * d * 52) : 0;
  const coberturaSolar = demMed > 0
    ? Math.min(100, (potDiurna / demMed) * 100 * (horasDiurnas / Math.max(h, 1)))
    : 0;

  const fcTxt = f1m08(fatorCarga);
  let msg: string;
  if (fatorCarga >= 85) {
    msg = `<b>Perfil praticamente contínuo, fator de carga de ${fcTxt}%.</b> É o perfil típico de mineração, metalurgia, química de base e papel e celulose. A boa notícia: demanda contratada bem aproveitada e previsibilidade alta. A notícia relevante: praticamente nenhuma flexibilidade natural, o que significa que participação em resposta da demanda exige alteração de processo, não apenas de agenda. `;
  } else if (fatorCarga >= 55) {
    msg = `<b>Perfil de operação estendida, fator de carga de ${fcTxt}%.</b> Turnos longos com paradas definidas. Há espaço real para deslocar processos não críticos — refrigeração, bombeamento, carregamento de baterias, moagem — para janelas específicas, e esse espaço tem valor econômico mensurável. `;
  } else if (fatorCarga >= 30) {
    msg = `<b>Perfil concentrado, fator de carga de ${fcTxt}%.</b> A planta consome muito em poucas horas. A consequência direta é que a demanda contratada precisa cobrir um pico que existe numa fração pequena do tempo, e o custo dessa capacidade ociosa é frequentemente a maior oportunidade de otimização de uma conta industrial. `;
  } else {
    msg = `<b>Perfil altamente concentrado, fator de carga de ${fcTxt}%.</b> Este é o perfil que mais penaliza economicamente, porque exige capacidade instalada e contratada dimensionada para um pico que ocorre raramente. Antes de qualquer discussão sobre fonte ou contrato, a pergunta é se o pico pode ser achatado — deslocar carga costuma valer mais que negociar preço. `;
  }
  const tTxt = String(Math.round(t));
  if (t >= 70 && horasDiurnas >= 6) {
    msg += `<br><br><b>Casamento com solar.</b> Com ${tTxt}% do consumo concentrado no turno diurno, o perfil tem afinidade estrutural com geração fotovoltaica: a produção e o consumo ocorrem na mesma janela. É o caso menos comum na indústria pesada e o mais comum em comércio, serviços e agroindústria de beneficiamento.`;
  } else if (t <= 35) {
    msg += `<br><br><b>Descasamento com solar.</b> Com apenas ${tTxt}% do consumo no turno diurno, contratar exclusivamente solar deixa a maior parte da operação descoberta nas horas em que ela realmente consome. Isso não invalida a fonte — invalida a leitura de que basta comparar volume anual. A pergunta correta é qual fração do consumo cai dentro da janela de produção, e a resposta aqui é pequena.`;
  } else {
    msg += `<br><br><b>Casamento parcial com solar.</b> Com ${tTxt}% do consumo no turno diurno, a fonte cobre uma parte relevante e deixa o resto exposto. É a configuração mais comum e a mais mal analisada, porque o volume anual sugere um casamento melhor do que o perfil horário confirma.`;
  }
  if (h >= 20 && d >= 6) {
    msg += ' Operação praticamente ininterrupta também significa que o custo de uma interrupção não programada é alto: a confiabilidade local da distribuidora deixa de ser detalhe e vira variável de decisão independente do preço da energia.';
  }
  msg += '<br><br>Este instrumento não trata de estrutura tarifária, modalidade nem posto horário, que são matéria do Bloco 10. Ele responde apenas à pergunta de formato: qual é a forma da curva e com qual fonte ela conversa.';

  return {
    valores: {
      'i10-demmed': demMed,
      'i10-fc': fatorCarga,
      'i10-horas': horasAno,
      'i10-solar': coberturaSolar,
    },
    veredito: msg,
  };
}

const inst10: CalculateFn = (i) => {
  const r = i10calcM08(i);
  return { ...r, veredito: String(r.veredito ?? '').replace(/\bBloco (\d{1,2})\b/g, (_, k) => `Módulo ${String(k).padStart(2, '0')}`) };
};

export const CALCULADORAS: Record<string, CalculateFn> = {
  'm08-inst-03': i3calcM08,
  'm08-inst-04': inst04,
  'm08-inst-07': inst07,
  'm08-inst-10': inst10,
};
