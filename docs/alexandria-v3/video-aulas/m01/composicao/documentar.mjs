// documentar.mjs — escreve docs/alexandria-v3/video-aulas/m01/aula-0N.md a partir de
// roteiros.mjs (texto e fonte) e de build/aula-0N/tempos.json (tempos medidos).
// Uso: node docs/alexandria-v3/video-aulas/m01/composicao/documentar.mjs <pasta-de-trabalho>
import fs from 'node:fs';
import path from 'node:path';
import { AULAS, FOTOS } from './roteiros.mjs';
import { resolver, residuo } from './verificar-lib.mjs';

const WORK = process.argv[2];
const DOCS = 'docs/alexandria-v3/video-aulas/m01';
const mmss = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${(s % 60).toFixed(1).padStart(4, '0')}`;
const TIPO = { fonte: 'Fonte (literal)', recorte: 'Recorte (literal, com corte/junção)', descricao: 'Descrição' };
const CENA = {
  pergunta: 'A pergunta da aula em Newsreader, termos-chave em óxido.',
  letreiro: 'Letreiro: a frase-chave do bloco, com a linha de fonte embaixo.',
  definicoes: 'Duas colunas: POTÊNCIA · kW e ENERGIA · kWh, com as perguntas da aula.',
  analogia: 'Tabela 1.2 (duas primeiras linhas: vazão ↔ potência, volume ↔ energia). A linha "diâmetro ↔ corrente" fica de fora (DIV-01 da A01).',
  formula: 'Fórmula da aula em destaque, com o texto de apoio.',
  formulas: 'As duas fórmulas da seção 5.3, uma por bloco.',
  retangulos: 'Diagrama D-A01-2: 50 kW × 1 h e 1 kW × 50 h na MESMA escala (0–50 h × 0–50 kW); área = 50 kWh nos dois.',
  erro: 'Frase errada riscada em óxido; as duas formas corretas abaixo.',
  foto: 'Foto real com legenda e crédito na tela; leve aproximação (Ken Burns, 4,5 %).',
  unidades: 'Três cartões: V, A, W, com a definição da aula; a fórmula P = V × I no terceiro.',
  cadeia: 'Diagrama D-A02-2: 220 V × 10 A → 2.200 W → 2,2 kW → × 5 h → 11 kWh; depois a cadeia V × A → W → kW → kWh × tarifa → R$.',
  escada: 'Diagrama D-A02-1: as sete faixas da tabela 2.1 em eixo logarítmico (100 V a 1 MV); "230 kV +" termina em seta aberta. Foto das torres ao lado.',
  triangulo: 'Diagrama D-A07-1: triângulo em escala 800 : 480, catetos desenhados um a um.',
  ondas: 'Diagrama D-A03-1: DC (constante) e AC 60 Hz, eixo em ms (4 ciclos ≈ 66,7 ms, derivado de 60 Hz), amplitude em unidade relativa.',
  retratos: 'Retratos: Westinghouse e Tesla (pela AC), Edison (pela DC), cada um com legenda e crédito.',
  balanca: 'Diagrama D-A03-2 (conceitual): equilíbrio, consumo > geração (frequência cai), geração > consumo (sobe). Sem número além de 60 Hz.',
  contagem: 'Contador até 86.400 vezes por dia.',
  curva: 'Diagrama D-A04-1: P = I² × 0,5 Ω, eixo 0–300 A × 0–50.000 W, pontos 100 A · 5.000 W, 200 A · 20.000 W (×4), 300 A · 45.000 W (×9).',
  escolha: 'Esquema sem escala: mesma potência, cabo fino (tensão alta, corrente baixa) × cabo grosso (tensão baixa, corrente alta).',
  degraus: 'Três degraus da lista 4.2: transmissão 230–750 kV, subtransmissão/distribuição 13,8–138 kV, baixa tensão 127/220 V; no 2º bloco, os nomes alta / média / baixa tensão da abertura da aula.',
  barras_demanda: 'Diagrama D-A05-1: barras 800 kW (máxima) e 200 kW (média), eixo em kW; ao lado, os dados do Ex · 04 e a conta.',
  regua_carga: 'Diagrama D-A05-3: régua 0–1 com as quatro faixas da tabela 5.4 (tons de tinta, sem semáforo); 0,90–1,00 marcado "sem faixa na tabela"; o 0,25 do exemplo em óxido.',
  grupos: 'Duas colunas: Grupo B · kWh × tarifa; Grupo A · consumo (kWh) + demanda (kW). Nenhum limite de tensão (QA-M01-A06 fora).',
  camadas: 'Esquema sem escala: Geração → Transmissão troncal → Distribuição → Baixa tensão.',
  a1a4: 'O mesmo esquema com o cliente A1 (230 kV) e o A4 (13,8 kV) na cadeia; posição ilustrativa.',
  fase: 'Diagrama D-A07-2: tensão e corrente em fase (resistiva) × corrente atrasada (indutiva); atraso ilustrativo φ = 31°, derivado do INST·05.',
  regua_fp: 'Régua de FP de 0,80 a 1,00 com a referência 0,92 (ouro) e o 0,90 do Ex · 05 (óxido). Sem barra empilhada (QA-M01-A07 fora).',
  barras_fc: 'Diagrama D-A08-1: barras 876.000 MWh (máximo teórico) e 220.000 MWh (real); contador até 25,1 %.',
  fenomenos: 'Os quatro fenômenos da abertura da aula e as três consequências.',
  dimensoes: 'Três cartões com as dimensões da tabela 9.1 e o que cada uma mede.',
  janela: 'Diagrama D-A09-1: linha do tempo de 7 dias com 1.008 traços (um por leitura de 10 min); as faixas adequada/precária/crítica só como nomes (a aula não dá valores).',
  prejuizos: 'Duas colunas: residência (incômodo) × indústria (prejuízo direto) com os três primeiros itens da lista 9.4.',
};

for (const a of AULAS) {
  const nn = String(a.n).padStart(2, '0');
  const t = JSON.parse(fs.readFileSync(path.join(WORK, `build/aula-${nn}/tempos.json`), 'utf8'));
  const tit = resolver(a.tituloSrc);
  const fotos = [...new Set(a.blocos.flatMap((b) => [b.cena.foto, ...(b.cena.t === 'retratos' ? ['westinghouse', 'tesla', 'edison'] : [])]).filter(Boolean))];
  let md = `# M01 · Aula ${nn} — vídeo-aula de abertura

**${a.titulo}** · ${a.tema}
Título e tema: \`${a.tituloSrc[0]}\`, ${a.tituloSrc[1]}, ${tit.linha}.

| | |
|---|---|
| Duração | ${t.total.toFixed(1)} s (abertura muda ${t.T0} s + narração ${t.durNarr.toFixed(1)} s + créditos) |
| Arquivos | \`public/alexandria/v3/aulas/m01/video/aula-${nn}.{mp4,webm}\`, \`aula-${nn}-poster.webp\`, \`aula-${nn}.pt-BR.vtt\` |
| Voz | ElevenLabs \`eleven_v4\`, voz "Henrique – Clear and Knowledgeable" (\`3ULAAai0IVN00DTWA6vF\`), a mesma nas nove aulas |
| Legendas | ${t.cues} deixas; texto na notação da aula, tempo pela transcrição local da narração (Parakeet), ${Math.round(t.cobertura * 100)} % das palavras da fala casadas |
| Procedência | [\`procedencia.md\`](procedencia.md) |

## Regra seguida

Toda frase narrada vem da aula — literal, ou recorte: trechos literais juntados, com corte marcado
por "[…]" na legenda e as palavras de ligação ("de… a…", "e") listadas no bloco.
Na **fala**, números e siglas vão por extenso para a voz pronunciar ("60 Hz" → "sessenta hertz");
a **legenda** mantém a notação da aula. A coluna *Origem* dá arquivo, campo e linha; o
verificador \`composicao/verificar.mjs\` acha cada trecho, literal, no arquivo citado.

Ficam de fora em todas as aulas: QA-M01-A06 (limite de 2,3 kV do Grupo A), QA-M01-A07
("os outros 15% são reativos"), QA-FCap-01 (faixas de fator de capacidade por fonte) e a
palavra "exponencial" (QA-M01-A04).

## 00:00 · Abertura — ponto de entrada do Founder

Cartela muda de ${t.T0} s: *Alexandria · Módulo 01 · Física de Energia e Eletricidade* / *Aula ${nn}* /
título / tema. É aqui que entra a fala gravada do Founder: troca-se a cena \`s0\` pela gravação e
aumenta-se \`T0\` em \`composicao/gerar.mjs\`; narração, cenas e legendas andam juntas. Nenhuma pessoa
foi gerada no lugar dele.

## Blocos
`;
  a.blocos.forEach((b, i) => {
    const tb = t.blocos[i];
    md += `\n### ${mmss(tb.ini)} · ${b.id} · ${TIPO[b.tipo]}\n\n> ${b.leg}\n\n`;
    if (b.fala !== b.leg) md += `Fala: *${b.fala}*\n\n`;
    md += `| Origem | Campo | Linha |\n|---|---|---|\n`;
    for (const s of b.src) { const r = resolver(s); md += `| \`${s[0]}\` | ${s[1]} | ${r.linha} |\n`; }
    const sobra = residuo(b);
    if (sobra) md += `
Fora dos trechos citados (palavras de ligação do roteiro): «${sobra}».
`;
    if (b.equivalencias) md += `
Notação: ${b.equivalencias.map(([x, y]) => `"${x}" na legenda = "${y}" na extração`).join('; ')}.
`;
    const c = b.cena.t === 'continua' ? null : b.cena;
    if (c) {
      md += `\nImagem: ${CENA[c.t] || c.t}`;
      if (c.foto) { const f = FOTOS[c.foto]; md += ` Foto: \`${f.arq}\` — ${f.leg} (${f.autor}, ${f.lic}).`; }
      if (c.fonte) md += ` Linha de fonte na tela: "FONTE · ${c.fonte}".`;
      md += '\n';
    } else md += `\nImagem: continua a cena anterior (próximo passo do diagrama).\n`;
  });
  md += `\n## ${mmss(t.total - 5)} · Créditos\n\nCartela: texto e números da própria aula; narração em voz sintética (ElevenLabs) lendo o texto da aula; diagramas com os números da aula${fotos.length ? '; fotos: ' + fotos.map((f) => `${FOTOS[f].autor} (${FOTOS[f].lic})`).join(', ') + ', via Wikimedia Commons' : ''}.\n`;
  if (fotos.length) {
    md += `\n## Fotos usadas\n\n| Arquivo | Mostra | Autor | Licença |\n|---|---|---|---|\n`;
    for (const f of fotos) md += `| \`public/alexandria/v3/aulas/m01/${FOTOS[f].arq}\` | ${FOTOS[f].leg} | ${FOTOS[f].autor} | ${FOTOS[f].lic} |\n`;
    md += `\nProcedência completa (SHA-1, página do Commons, o que a legenda não pode afirmar): \`docs/alexandria-v2/media-provenance.md\`, seção "Alexandria v3 — aulas do M01".\n`;
  }
  fs.writeFileSync(path.join(DOCS, `aula-${nn}.md`), md);
  console.log(`aula-${nn}.md`);
}
