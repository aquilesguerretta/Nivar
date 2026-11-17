// Conferência da avaliação do M02. Núcleo: verificar-avaliacao-m02-m03.mjs.
// Uso: node tools/alexandria-dados/avaliacao/verificar-avaliacao-m02.mjs
import { verificar } from './verificar-avaliacao-m02-m03.mjs';
import { EDITORIAIS, VINCULOS } from './gerar-avaliacao-m02.mjs';

process.exit(await verificar(2, { editoriais: EDITORIAIS, vinculos: VINCULOS }));
