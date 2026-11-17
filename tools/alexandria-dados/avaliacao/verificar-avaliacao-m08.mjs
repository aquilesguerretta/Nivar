// Confere a avaliação do M08 (ver verificar-avaliacao-m06-m08.mjs).
// Uso: node tools/alexandria-dados/avaliacao/verificar-avaliacao-m08.mjs
import { verificarAvaliacao } from './verificar-avaliacao-m06-m08.mjs';

process.exit(
  await verificarAvaliacao(8, {
    // (B) prova do M08 contra aparato.json (quiz: questões, critério do lede, placar)
    extras: ({ prova, ap, ed, norm }) => {
      const f = [];
      const q = ap.quiz;
      if (prova.criterio !== ed(q.lead.texto.match(/O critério[^.]*\./)[0])) f.push('critério ≠ lede do §Quiz');
      q.questoes.forEach((x, i) => {
        const p = prova.questoes[i];
        if (!p) return f.push(`questão ${i + 1} ausente`);
        if (norm(p.enunciado) !== ed(x.enunciado)) f.push(`${p.id}: enunciado`);
        x.alternativas.forEach((a, k) => norm(p.alternativas[k]) !== ed(a.texto) && f.push(`${p.id}: alternativa ${k}`));
        if (p.correta !== x.gabarito_indice || !x.alternativas[x.gabarito_indice].correta) f.push(`${p.id}: correta ${p.correta} × ${x.gabarito_indice}`);
        if (norm(p.explicacao) !== ed(x.explicacao)) f.push(`${p.id}: explicação`);
      });
      q.placar.faixas.forEach((x, i) => norm(prova.faixas[i]?.mensagem) !== ed(x.mensagem) && f.push(`faixa ${i}: mensagem`));
      return f;
    },
  }),
);
