@AGENTS.md

# Exclusivo do Claude Code

O que está acima vale para qualquer agente. O que está aqui embaixo são
os mecanismos do Claude Code especificamente — outra ferramenta abrindo
este repositório pode ignorar esta seção inteira.

## Skills

Ficam em `.claude/skills/`, carregadas por sessão:

- **`NIVAR Design System`** — vocabulário do Portal BR, `/conta` e
  produtos Advisory. Tokens em `.claude/skills/NIVAR Design System/`,
  espelhados em produção em `src/design/nivar/`. Autoritativa quando
  conflitar com prosa.
- **`gridalpha-terminal`** — vocabulário do terminal americano. Carregue
  `references/terminal-antipatterns.md` antes das demais; consulte
  tipografia / cor / composição / movimento / densidade conforme a tarefa.

A Alexandria não tem skill: o sistema dela vive em
`src/design/alexandria-tokens.ts`, com procedência por linha no handoff
em `docs/alexandria/design-handoff/`.

## Slash commands

- **`/screenshot-loop`** (`.claude/commands/screenshot-loop.md`) — gera
  UI, sobe o dev server, captura em 1440×900 / 1920×1080 / 3440×1440 e
  itera contra as regras da skill. Embuta
  `tools/screenshot-loop/brief-template.md` em qualquer brief de UI.

## Servidores MCP

Registrados em `.mcp.json`, lidos automaticamente ao abrir o repo:

- **`gridalpha-tokens`** — `tokens_search`, `primitive_lookup`,
  `figma_reference_lookup` sobre `src/design/tokens.ts`. Consulte antes
  de gerar código de design system. O caminho do comando é absoluto e
  específico da máquina; outra máquina precisa refazer o venv seguindo
  `tools/gridalpha-tokens-mcp/CONFIGURATION.md`.
- **`playwright`** — laço visual. Quando o painel Browser da sessão não
  compõe frames (acontece), o fallback que funciona é `playwright-core`
  isolado no scratchpad dirigindo o Chrome do sistema; o chromium do
  `ms-playwright` falha com `spawn UNKNOWN` sob o sandbox do shell.

## Hooks

Em `.claude/hooks/`, registrados em `.claude/settings.json`:

- **`block-git-add-all`** (`PreToolUse` sobre `Bash`) — nega `git add -A`
  e `git add .`. A regra existe em `AGENTS.md` desde sempre e foi violada
  mesmo assim (`f955e62`, que carregou trabalho de sessão paralela sob a
  mensagem errada). Aqui ela deixa de depender de disciplina.

Bypass legítimo não existe para este: se precisar mesmo de tudo, liste os
caminhos.

## Gitignored

`.env.local`, `.claude/settings.local.json`. E `.claude/launch.json`
**não é ignorado mas não deve ser commitado** — carrega entradas de porta
de várias sessões ao mesmo tempo.

## Documento paralelo, não reconciliado

`CODEX-OPERATING-PROTOCOL.md` está na raiz, **não rastreado**, 400 linhas,
e se declara referência permanente multi-IA. Os invariantes dele foram
absorvidos por `AGENTS.md` na Método Wave 1; o arquivo em si não foi
tocado, porque decidir o destino dele (apagar, rastrear, ou manter como
briefing específico do Codex) é do Aquiles. Enquanto os dois existirem,
`AGENTS.md` é o que vale.
