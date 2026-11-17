// Confere src/lib/alexandria/avaliacao/m04.dados.ts contra a extração e o texto das aulas.
// Uso: node tools/alexandria-dados/avaliacao/verificar-avaliacao-m04.mjs (sai com 1 se houver falha)
import { verificar } from './avaliacao-m04-m05.mjs';
import { ESPEC } from './especificacao-m04.mjs';
process.exit(await verificar(4, ESPEC));
