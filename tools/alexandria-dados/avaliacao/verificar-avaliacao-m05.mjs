// Confere src/lib/alexandria/avaliacao/m05.dados.ts contra a extração e o texto das aulas.
// Uso: node tools/alexandria-dados/avaliacao/verificar-avaliacao-m05.mjs (sai com 1 se houver falha)
import { verificar } from './avaliacao-m04-m05.mjs';
import { ESPEC } from './especificacao-m05.mjs';
process.exit(await verificar(5, ESPEC));
