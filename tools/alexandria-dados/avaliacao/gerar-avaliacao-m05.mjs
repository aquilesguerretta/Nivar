// Gera src/lib/alexandria/avaliacao/m05.dados.ts. Método em avaliacao-m04-m05.mjs; decisões em especificacao-m05.mjs.
// Uso: node tools/alexandria-dados/avaliacao/gerar-avaliacao-m05.mjs
import { gerar } from './avaliacao-m04-m05.mjs';
import { ESPEC } from './especificacao-m05.mjs';
await gerar(5, ESPEC);
