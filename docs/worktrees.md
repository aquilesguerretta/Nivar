# Worktree por wave concorrente

Um `git worktree` é uma segunda pasta de trabalho ligada ao **mesmo**
repositório: object store compartilhado, **HEAD e index próprios**. É o
que impede uma sessão de commitar trabalho de outra.

**Este arquivo é instrução.** O histórico de como o padrão foi provado
está em `docs/registro-de-waves.md`, Método Wave 2.

## Quando usar, e quando não

Use quando **duas ou mais waves vão rodar ao mesmo tempo** na mesma
árvore — duas janelas de Claude Code, ou Claude Code e Cursor, ou o Codex
quando entrar. O eixo é **wave concorrente**, não ferramenta: duas
janelas da mesma ferramenta colidem exatamente como duas ferramentas
diferentes.

Não use para sessão única sem concorrência, investigação só de leitura,
ou consertar um arquivo em cinco minutos. O preço é **~1 GB de disco** e
um `npm ci` por worktree; não vale por hábito.

## Convenção

| | |
| --- | --- |
| pasta | `C:\dev\gridalpha-v2-<assunto-curto>` |
| branch | `wave/<assunto-curto>` |

O `<assunto-curto>` é o mesmo nos dois, em kebab, para o pareamento ser
legível de bate no `git worktree list`.

**A pasta fica irmã da árvore principal em `C:\dev`, nunca dentro dela**,
e **sem espaço no caminho** — a árvore principal tem um (`GridAlpha v2`)
e espaço já custou nesta trilha. A ausência de espaço passa a distinguir
worktree de árvore principal no prompt.

**O prefixo de branch nunca leva nome de ferramenta.** `cursor`,
`architect`, `lyceum` são **nomes de agente** neste projeto; reusá-los
como prefixo de branch confunde quem for ler o histórico depois.

**Branch de worktree tem vida curta:** nasce na abertura da wave, morre
no fechamento dela. `feature/full-shell-buildout` segue sendo a fonte da
verdade o tempo todo — a divergência dura uma wave, não indefinidamente.
**Nunca push para `main`** continua valendo, sem exceção.

## Abrir

```
git worktree add "C:/dev/gridalpha-v2-<assunto>" -b wave/<assunto> feature/full-shell-buildout
```

**A mesma branch não pode ser checada em dois worktrees** — o git recusa
com `fatal: '...' is already used by worktree at ...`. Daí a branch
própria; não é preferência, é o que o git permite.

## Primeira vez em cada worktree: o que copiar à mão

Worktree novo nasce só com o que está sob controle de versão. O resto
não vem.

```
# obrigatorio — sem ele o Mapbox nao carrega
Copy-Item "C:\dev\GridAlpha v2\.env.local" "C:\dev\gridalpha-v2-<assunto>\.env.local"

# conveniencia — so permissions.allow; sem ele a sessao re-pergunta tudo
Copy-Item "C:\dev\GridAlpha v2\.claude\settings.local.json" "C:\dev\gridalpha-v2-<assunto>\.claude\settings.local.json"

# dependencias — proprias, nunca compartilhadas (ver abaixo)
cd "C:\dev\gridalpha-v2-<assunto>"; npm ci
```

Só se a wave precisar: `npm ci` em `tools/gridalpha-detect/` (38 MB, para
rodar o auditor de lá) e o venv de `tools/gridalpha-tokens-mcp/`
(139 MB, refeito por `CONFIGURATION.md`).

**O backend não precisa de nada.** Não há `.env` na raiz nem venv de
backend no repo, e `app/` não usa `dotenv` — as variáveis vêm do Railway,
e o dev server encaminha `/api` para lá por padrão.

`dist/` e `__pycache__/` não se copiam: são saída, não entrada.

### `node_modules` é próprio de cada worktree, sempre

Nunca compartilhe por junction ou symlink. Três razões, em ordem de
gravidade:

1. **Cache de pré-bundle do Vite.** O Vite grava em `node_modules/.vite`.
   Dois dev servers sobre o mesmo `node_modules` disputam o mesmo cache;
   worktrees em commits diferentes de `vite.config.ts` ou de dependência
   se corrompem mutuamente.
2. **`npm ci` obedece ao `package-lock.json` da árvore onde roda.** Com
   `node_modules` compartilhado, quem rodar por último reescreve as
   dependências da outra árvore, em silêncio, no meio da sessão dela.
3. **Binário nativo por plataforma** mora lá dentro
   (`@rollup/rollup-win32-x64-msvc`, `@img/sharp-win32-x64`,
   `@next/swc-win32-x64-msvc`).

O custo é **disco, não tempo**: o cache do npm já é global
(`C:\Users\aquil\AppData\Local\npm-cache`), então o `npm ci` de um
worktree novo é local, sem rede. O `.git` **não** é duplicado.

## Fechar — passo obrigatório de toda wave feita em worktree

Vai junto com a fase "Verificar e fechar", não depois dela.

```
# 1. no worktree: tudo commitado, e rebase na base atualizada
cd "C:\dev\gridalpha-v2-<assunto>"
git status --short                      # precisa estar vazio
git fetch origin feature/full-shell-buildout
git rebase feature/full-shell-buildout

# 2. na arvore principal: merge sem merge commit
cd "C:\dev\GridAlpha v2"
git merge --ff-only wave/<assunto>
git push origin feature/full-shell-buildout

# 3. apagar branch e worktree
git worktree remove "C:/dev/gridalpha-v2-<assunto>"
git branch -d wave/<assunto>
git push origin --delete wave/<assunto>   # so se a branch foi pushada
git worktree prune
git worktree list                          # confirmar que sumiu
```

**`--ff-only` é deliberado.** O histórico desta trilha é linear; o rebase
do passo 1 garante o fast-forward do passo 2. Se o `--ff-only` falhar, a
base andou depois do rebase — repita o passo 1, não troque por um merge
comum.

## Armadilhas medidas

- **`git worktree remove` recusa** com qualquer arquivo modificado *ou*
  não rastreado — `fatal: ... contains modified or untracked files`,
  exit 128. É proteção, não defeito. Só use `--force` depois de olhar o
  que ia se perder.
- **`.claude/launch.json` é rastreado**, e o `CLAUDE.md` proíbe
  commitá-lo. Todo worktree nasce com a versão commitada e diverge dali.
  **Divergir é o esperado**; não commite para "consertar".
- **`.mcp.json` carrega caminho absoluto** para o venv do servidor
  `gridalpha-tokens`, hoje apontando para o caminho antigo do OneDrive,
  que não existe mais. Vale para toda worktree. Enquanto não for
  corrigido, esse MCP não sobe em lugar nenhum.
- **Resíduo órfão em `.git/worktrees/`** pode sobrar de uso anterior:
  invisível ao `git worktree list` e capaz de fazer o `git worktree
  prune` falhar com `Permission denied`. Se acontecer, apague a pasta do
  resíduo à mão e rode o `prune` de novo.
