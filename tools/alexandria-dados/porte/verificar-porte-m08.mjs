// Verifica o porte do Módulo 08 contra o HTML original (ver verificar-porte-m06-m08.mjs).
// Uso: node tools/alexandria-dados/porte/verificar-porte-m08.mjs
import { verificar } from './verificar-porte-m06-m08.mjs';

// Faltas que não cabem no tipo do produto. Chave = prefixo do id da falta; valor = razão, impressa.
const FALTAS_EXPLICADAS = {
  'm08-inst-08/grupo':
    'Seletor "Carregar fotografia de" (quatro botões que PREENCHEM os dois campos com a fotografia de cada subsistema): o modelo de aula não tem ação que altere campos. As quatro fotografias vão literais na nota do instrumento ("Fotografias por subsistema, junho de 2026 — …").',
};

process.exit(
  await verificar({
    n: 8,
    faltasExplicadas: FALTAS_EXPLICADAS,
    instrumentosDoModulo: (mod) => mod.MODULO_08_INSTRUMENTOS?.some((i) => i.id === 'm08-inst-01'),
    // Inst · 01 do §MAP: na Aula 01 (regra de colocação de 15/11).
    mapa: { aula: 1, id: 'm08-inst-01' },
  }),
);
