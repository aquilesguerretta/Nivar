// Conferência do texto das aulas do M15 contra o HTML original (0 falta, 0 inventado, 0 órfão).
// Atalho para verificar-porte-m14-m15.mjs 15; ver o cabeçalho de lá.
process.argv.splice(2, 0, '15');
await import('./verificar-porte-m14-m15.mjs');
