#!/usr/bin/env node
// .claude/hooks/block-git-add-all.mjs
// ARCHITECT — Método Wave 1, Fase 4.
//
// PreToolUse sobre Bash. Nega `git add -A`, `git add --all` e `git add .`.
//
// POR QUE ISTO EXISTE: a regra está escrita em AGENTS.md desde sempre e
// foi violada mesmo assim. O commit `f955e62` carregou trabalho não
// commitado de uma sessão paralela sob a mensagem de outra wave, e o
// histórico não pôde ser reescrito porque já estava pushado numa branch
// com quatro sessões ativas. Aqui a regra deixa de depender de
// disciplina e passa a ser determinística.
//
// Em NODE e não em bash+jq: `jq` não existe neste ambiente (medido);
// `node` já é dependência dura do repo — o auditor roda nele.

let bruto = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', (c) => { bruto += c; });
process.stdin.on('end', () => {
  let comando = '';
  try {
    comando = JSON.parse(bruto)?.tool_input?.command ?? '';
  } catch {
    // Payload ilegível não é motivo para bloquear trabalho legítimo.
    process.exit(0);
  }
  if (typeof comando !== 'string' || comando === '') process.exit(0);

  // Um comando pode encadear vários (`cd x && git add -A`), então a
  // checagem é por segmento, não sobre a string inteira.
  const segmentos = comando.split(/(?:\|\||&&|[;&|\n])/);

  for (const seg of segmentos) {
    const tokens = seg.trim().split(/\s+/).filter(Boolean);
    const iGit = tokens.findIndex((t) => t === 'git' || t.endsWith('/git'));
    if (iGit === -1) continue;

    // `git -C caminho add ...` — pula as opções globais antes do
    // subcomando em vez de exigir que `add` venha logo depois.
    let i = iGit + 1;
    while (i < tokens.length && tokens[i].startsWith('-')) {
      if (tokens[i] === '-C' || tokens[i] === '-c') i += 2;
      else i += 1;
    }
    if (tokens[i] !== 'add') continue;

    const args = tokens.slice(i + 1);
    const culpado = args.find((a) => {
      if (a === '.' || a === './' || a === ':/' || a === '*') return true;
      if (a === '--all' || a === '--no-ignore-removal') return true;
      // Cacho de opção curta contendo A: -A, -Au, -vA…
      return /^-[A-Za-z]*A[A-Za-z]*$/.test(a);
    });
    if (!culpado) continue;

    const razao =
      `Bloqueado: \`git add ${culpado}\` estagia tudo na árvore, ` +
      `inclusive trabalho não commitado de sessões paralelas. ` +
      `Este repositório roda várias sessões na mesma árvore — o commit ` +
      `f955e62 já carregou trabalho alheio sob a mensagem errada por ` +
      `causa disto. Estague caminho explícito: ` +
      `\`git add src/a/b.tsx docs/c.md\`. ` +
      `Confira com \`git diff --cached --stat\` antes de commitar.`;

    process.stdout.write(JSON.stringify({
      hookSpecificOutput: {
        hookEventName: 'PreToolUse',
        permissionDecision: 'deny',
        permissionDecisionReason: razao,
      },
    }));
    process.exit(0);
  }
  process.exit(0);
});
