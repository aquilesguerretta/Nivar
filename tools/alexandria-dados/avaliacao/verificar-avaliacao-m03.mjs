// Conferência da avaliação do M03. Núcleo: verificar-avaliacao-m02-m03.mjs.
// Uso: node tools/alexandria-dados/avaliacao/verificar-avaliacao-m03.mjs
import { verificar } from './verificar-avaliacao-m02-m03.mjs';
import { EDITORIAIS, VINCULOS } from './gerar-avaliacao-m03.mjs';

process.exit(await verificar(3, { editoriais: EDITORIAIS, vinculos: VINCULOS }));
