// Confere a avaliação do M07 (ver verificar-avaliacao-m06-m08.mjs).
// Uso: node tools/alexandria-dados/avaliacao/verificar-avaliacao-m07.mjs
import { verificarAvaliacao } from './verificar-avaliacao-m06-m08.mjs';

process.exit(
  await verificarAvaliacao(7, {
    // (B) prova do M07 contra aparato.json (§Quiz: perguntas, critério do h2, faixas do script)
    extras: ({ prova, ap, ed, norm }) => {
      const f = [];
      const q = ap.avaliacao;
      if (prova.criterio !== ed(q.criterio_literal[0].texto)) f.push('critério ≠ h2 do §Quiz');
      q.perguntas.forEach((x, i) => {
        const p = prova.questoes[i];
        if (!p) return f.push(`questão ${i + 1} ausente`);
        if (norm(p.enunciado) !== ed(x.enunciado)) f.push(`${p.id}: enunciado`);
        x.alternativas.forEach((a, k) => norm(p.alternativas[k]) !== ed(a.texto) && f.push(`${p.id}: alternativa ${k}`));
        if (p.correta !== x.gabarito.indice) f.push(`${p.id}: correta ${p.correta} × ${x.gabarito.indice}`);
        if (norm(p.explicacao) !== ed(x.explicacao)) f.push(`${p.id}: explicação`);
      });
      q.faixas_de_placar_script.forEach((x, i) => norm(prova.faixas[i]?.mensagem) !== ed(x.mensagem) && f.push(`faixa ${i}: mensagem`));
      return f;
    },
  }),
);
