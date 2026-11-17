// Núcleo comum do gerador e do verificador de avaliação do M02 e do M03
// (modelo: tools/alexandria-dados/gerar-avaliacao.mjs, que gera o M01).
//
// Duas origens, nunca misturadas:
//   'fonte'            — Ex·NN do § Ex, o quiz do § Quiz (com as faixas do script) e o
//                        checklist do § Final, copiados de docs/alexandria-v2/extraction/m0N/aparato.json.
//   'derivado-da-aula' — itens de recuperação cuja resposta está, LITERAL, no texto que o
//                        aluno lê na própria aula (MODULO_0N_CORPO do conteúdo portado). O
//                        gerador acha cada trecho na aula e para se não achar.
//
// O texto da aula é o do produto (alexandria-modulo-0N-content.ts), que o verificador de
// porte já conferiu contra o HTML com 0 falta; a linha citada é a do HTML-fonte, lida
// pela mesma leitura (tools/alexandria-dados/porte/aulas-html-m02-m03.mjs).

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { lerAulas } from '../porte/aulas-html-m02-m03.mjs';

export const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..');

export const norm = (s) =>
  String(s ?? '')
    .replace(/<br\s*\/?>/gi, ' ')
    .replace(/<[^>]+>/g, '')
    .replace(/&gt;/g, '>').replace(/&lt;/g, '<').replace(/&amp;/g, '&').replace(/&nbsp;/g, ' ')
    .replace(/[ \s]+/g, ' ')
    .trim();
export const baixa = (s) => norm(s).toLocaleLowerCase('pt-BR');

export const VOCABULARIO_INTERNO = /GridAlpha|War Room|Cobaia Zero|Summit/;

// A extração do M03 grava o aparato num esquema diferente do M02 (campos com outros nomes).
// Aqui ele é lido para a forma do M02, sem tocar em nenhum texto: só os nomes dos campos.
export function normalizarAparato(n, ap) {
  if (n !== 3) return ap;
  const pad = (id) => `Aula ${id.slice(-2)}`;
  return {
    ...ap,
    exercicios: {
      ...ap.exercicios,
      itens: ap.exercicios.itens.map((x) => ({
        id: x.id,
        tag: x.tag_fonte,
        aula_vinculada: x.vinculo_declarado?.length ? pad(x.vinculo_declarado[0]) : null,
        enunciado: x.enunciado,
        resposta_de_referencia: { paragrafos: [{ html: x.resposta_referencia.html }] },
        origem: { linha_aprox: x.enunciado?.origem?.linha_aprox ?? x.origem?.linha_aprox ?? null },
      })),
    },
    avaliacao: {
      introducao: ap.avaliacao.introducao,
      questoes: ap.avaliacao.perguntas,
      placar: {
        faixas: ap.avaliacao.faixas_de_placar_script.faixas.map((f) => ({ condicao_literal: f.condicao, faixa: f.intervalo, mensagem: f.mensagem, origem: f.origem })),
      },
    },
  };
}

export async function contexto(n) {
  const NN = String(n).padStart(2, '0');
  const EXT_REL = `docs/alexandria-v2/extraction/m${NN}`;
  const aparato = normalizarAparato(n, JSON.parse(fs.readFileSync(path.join(RAIZ, EXT_REL, 'aparato.json'), 'utf8')));
  const conteudo = await import(pathToFileURL(path.join(RAIZ, `src/lib/data/alexandria-modulo-${NN}-content.ts`)).href);
  const CORPO = conteudo[`MODULO_${NN}_CORPO`];
  const LEAD = conteudo[`MODULO_${NN}_LEAD`];
  const INST = conteudo[`INSTRUMENTOS_MODULO_${NN}`];
  const AULAS = conteudo[`MODULO_${NN}_AULAS`];
  const html = lerAulas(n);
  const ARQ_HTML = `Alexandria modulos/alexandria_modulo${NN}.html`;

  // Texto de cada aula, bloco a bloco, como o aluno lê; com a linha do HTML de cada bloco.
  // A ordem dos blocos do produto é a do HTML (verificada), menos os instrumentos, e os
  // três níveis viram três notas: a linha de um bloco é a do bloco-fonte correspondente.
  const blocosDaAula = (num) => {
    const id = `aula-${NN}-${String(num).padStart(2, '0')}`;
    const fonte = html.find((a) => a.num === num);
    const linhas = [];
    for (const b of fonte.blocos) {
      if (b.tipo === 'instrumento') continue;
      if (b.tipo === 'tres_niveis') b.abas.forEach(() => linhas.push(b.linha));
      else linhas.push(b.linha);
    }
    const out = [{ campo: 'lead', texto: norm(LEAD[id]), linha: fonte.linha }];
    (CORPO[id] ?? []).forEach((b, i) => {
      const t =
        b.kind === 'titulo' ? `${b.numero ?? ''} ${b.texto}`
        : b.kind === 'paragrafo' ? b.html
        : b.kind === 'formula' ? `${b.eq} — ${b.desc ?? ''}`
        : b.kind === 'nota' ? `${b.label ?? ''} — ${b.html}`
        : b.kind === 'lista' ? b.itens.join(' · ')
        : b.linhas.map((l) => l.join(' — ')).join(' · ');
      out.push({ campo: `${id} · bloco [${i}] (${b.kind}${b.label ? `: ${b.label}` : ''})`, texto: norm(t), linha: linhas[i] ?? null });
    });
    return out;
  };
  const textoDoModulo = baixa(Object.keys(CORPO).map((id) => `${LEAD[id] ?? ''} ${blocosDaAula(Number(id.slice(-2))).map((b) => b.texto).join(' ')}`).join(' '));

  return { n, NN, EXT_REL, ARQ_HTML, aparato, CORPO, LEAD, INST, AULAS, html, blocosDaAula, textoDoModulo };
}
