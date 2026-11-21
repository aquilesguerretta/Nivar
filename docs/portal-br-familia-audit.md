# Portal BR — auditoria de terreno para expansão em cinco famílias

Wave de reconhecimento, só leitura. Resolve o estado real do repositório
antes do primeiro brief de construção da expansão em cinco famílias
comerciais (Advisory, Intelligence, Academy, Software, Hardware) sair.
Nenhum arquivo de `src/` foi tocado nesta wave.

## Fase 1 — N e o estado real da trilha PORTAL BR

**N não estava confirmado no brief — resolvido contra o CLAUDE.md do disco,
não contra citação de mensagem anterior.**

Última seção `## ARCHITECT — PORTAL BR WAVE N` no `CLAUDE.md`: **Wave 6**
("TESE, CONFLITO E MÉTODO NO HERO", linha 8787). Depois dela, duas
revisões diretas NÃO numeradas (mesmo idioma que as revisões diretas do
LYCEUM pós-Wave 16/28/36 já usam):

- `## ARCHITECT — REVISÃO DIRETA PÓS-WAVE 6` (linha 8855) — logo colorida
  nos dois modos, faixa incandescente no topo, marca GridAlpha→NIVAR na
  superfície `/conta`, seção "O mercado agora" + Glossário na landing.
- `## ARCHITECT — REVISÃO DIRETA 2 PÓS-WAVE 6` (linha 8924) — glossário
  removido da landing, prévia do Terminal Brasil que liga sozinha ao
  entrar em viewport, passos com pulso de corrente, contadores reais da
  Alexandria, CTA duplo, FAQ.

**Não existe nenhuma "Wave 5" registrada com esse número** — o que o
brief chama de Wave 5 é a seção que fechei como **Wave 5 · Marca, Sistema
Visual e Movimento NIVAR** (linha 8650), que É numerada e É a origem real
dos tokens NIVAR na superfície. A trilha, portanto, é: Wave 1 → 2 → 3 → 4
→ **5 (NIVAR)** → **6 (tese/conflito/método)** → revisão direta → revisão
direta 2. Não há lacuna nem wave "perdida" entre a 4 e a 5.

### A premissa do "Fable Ultracode" não bate com o histórico de commits

O brief descreve uma sessão de ferramenta de design externa
("Fable Ultracode") que teria reconstruído a página em seis seções,
admitindo não ter seguido o sketch original nem o sistema NIVAR, seguida
de uma rodada de ajuste não confirmada. **`git log` não sustenta essa
leitura.**

`git log --oneline -- src/pages/br/PortalBR.tsx`, do topo:

```
1b21c56 architect: fecha revisao direta 2 pos-wave 6
861a419 architect: previa do terminal que liga, corrente, contadores reais, cta e faq na landing
5735177 architect: fecha revisao direta pos-wave 6
e2bb473 architect: adiciona mercado agora e glossario a landing do portal br
c429a21 architect: troca marca gridalpha por nivar na superficie de conta
97452ef architect: wordmark colorido nos dois modos e faixa incandescente no topo
e640c1c architect: adiciona secao conflito de interesse
3a1111e architect: adiciona method disclosure ao mapa
b6f9da0 architect: fase 1 wave 6 — pontos de insercao confirmados
301a295 architect: aplica sistema de movimento nivar no portal br
4ca139d architect: aplica sistema visual nivar nos dois modos
2d0cea4 architect: substitui marca gridalpha por nivar no portal br
fa840d6 architect: fase 1 wave 5 — inventario de arquivo confirmado
```

**`1b21c56` é o HEAD atual da branch** — conferido por `git log -5`, é o
commit mais recente que existe. Não há nenhum commit depois dele. Os dois
hashes que o brief cita como marcos do episódio Fable (`861a419` e
`1b21c56`) são, na verdade, dois dos **meus próprios** commits de fechamento
das duas revisões diretas — a "previa do terminal que liga" e o "fecha
revisao direta 2 pos-wave 6". A mensagem de cada commit e o diff batem
exatamente com o que a Wave 6 e as revisões diretas registraram no
`CLAUDE.md`: nenhuma seção nova, nenhum autor diferente, nenhuma
reescrita silenciosa.

**Conclusão factual, não interpretação:** o estado de seis seções (hero
com CTA, prévia de terminal interativa, quatro passos, contador da
Alexandria, FAQ, CTA final) que o brief atribui ao Fable é o mesmo estado
que as Waves 5-6 e as duas revisões diretas já documentam como próprio
trabalho, seguindo o sistema NIVAR (confirmado na Fase 2, abaixo). Não há
evidência no histórico git de uma segunda rodada de ajuste ("tirar a
prévia sempre-ligada em favor de vídeo, reordenar seções") tendo
rodado — se ela aconteceu, não chegou a commit nenhum nesta branch.

## Fase 2 — Estado real de `/br` hoje

Lido direto de `src/pages/br/PortalBR.tsx` (HEAD `5f4662a`), não presumido.
Nove `<section>` na página, nesta ordem — clique real não foi necessário
para confirmar a ordem porque o JSX é sequencial e sem `sort`/condicional
de reordenação:

| # | `aria-label` / `aria-labelledby` | Conteúdo |
| --- | --- | --- |
| — | (hero, componente `PortalHero`) | H1, tese, subtítulo, CTA duplo, mapa dos 4 submercados |
| 1 | "O portal em números" | faixa de fatos (4 submercados, geografia IBGE, contagem de destinos) |
| 2 | "Prévia do Terminal Brasil — amostra ilustrativa" | terminal que liga ao entrar em viewport |
| 3 | "Como a NIVAR lê o mercado" | 4 passos com fio de corrente |
| 4 | "Destinos" | **os CINCO CARDS DE PRODUTO ainda estão aqui** — `DestinoCard` × `DESTINOS_BR`, não a faixa de família que o Aquiles decidiu |
| 5 | "A Alexandria em números" | contador real (3 trilhas / 17 módulos / 141 aulas) |
| 6 | `#br-conflito` (componente inline) | seção Conflito de Interesse |
| 7 | `#br-independencia` (componente `FaixaIndependencia`) | os três compromissos afirmativos |
| 8 | `#br-perguntas` | FAQ, 5 perguntas |
| 9 | "Criar conta" | CTA final |

**Não é a versão das Waves 1-4** (cinco cards + Independência + rodapé
sem o resto), **não é um híbrido em transição** — é exatamente o estado
final que a Wave 6 e as duas revisões diretas fecharam, de ponta a ponta.
**O glossário que a Revisão Direta 1 tinha adicionado não está mais na
página** — confirmado ausente (a Revisão Direta 2 o removeu, como o
próprio `CLAUDE.md` registra).

### Marca — GridAlpha ou NIVAR

`grep -in "gridalpha" src/pages/br/PortalBR.tsx src/components/br/*.tsx`
devolve **zero ocorrências** nos cinco arquivos (`PortalBR.tsx`,
`PortalHero.tsx`, `DestinoCard.tsx`, `FaixaIndependencia.tsx`,
`SeletorMercado.tsx`, `AcessoConta.tsx`). A marca visível é NIVAR — o
wordmark SVG inline com gradiente de incandescência, nos dois modos.

### Teste decisivo dos tokens

`grep -c` de `--accent-house`, `--text-strong`, `data-mode`,
`--surface-page`, `var(--rule` em `PortalBR.tsx`: **90 ocorrências**.
Presente, sem ambiguidade — a página inteira é construída em cima dos
tokens de `src/design/nivar/`, com `data-mode="noturno"` como escopo de
alternância no elemento raiz.

## Fase 3 — Convenção de rota para sub-página

Lido de `src/main.tsx` (a única tabela de rotas do app — sem arquivo de
rotas separado). Trecho relevante:

```tsx
<Route path="/" element={<PortalBR />} />
...
<Route path="/br" element={<PortalBR />} />
<Route path="/us" element={<LandingPage />} />
<Route path="*" element={<PortalBR />} />
```

**`/br` é rota RASA — não existe padrão de sub-rota hoje.** `/` e `/br`
apontam para o mesmo componente `PortalBR`; `*` (catch-all) também. Não
há nenhum `<Route path="/br/...">`, e `grep -rn "\"/br/" src/` devolve
zero ocorrências em todo o código-fonte — nenhuma rota `/br/x` foi
injetada por ninguém, em nenhum momento.

**O padrão de sub-rota que existe no app é o da Alexandria, e é
splat + router aninhado**, não rota rasa: `main.tsx` casa
`/alexandria/*` com o componente `AlexandriaHome`, que por sua vez
declara seu próprio `<Routes>` interno em `AlexandriaRouter.tsx`
(`trilha/:trilhaId`, `biblioteca`, `perfil`, `atlas`, `glossario`, `*`).
`AlexandriaHome.tsx` documenta explicitamente por que não usa
`<Routes>` duplo por padrão do React Router.

**Nada do que o Fable teria injetado tem rota própria para reconciliar**
— porque não há evidência de que algo tenha sido injetado fora do que
esta própria trilha (Waves 5-6 + revisões diretas) já registrou, e essa
trilha nunca criou rota nova nenhuma. `/br` continua a única entrada.

**Implicação para a Fase 5 (não decisão, só o fato):** cinco páginas de
família (`Advisory`, `Intelligence`, `Academy`, `Software`, `Hardware`)
exigem escolher entre dois padrões já existentes no app — rotas rasas
adicionais em `main.tsx` (`/br/advisory`, `/br/intelligence`, …, ao
lado de `/br`) ou o padrão splat+router-aninhado que a Alexandria já
usa (`/br/*` com um `PortalBRRouter` interno). Nenhum dos dois está
montado hoje; a escolha fica para o brief de construção.

## Fase 4 — Inventário dos ativos reusáveis

Cada item confirmado por `git log` no arquivo real (não presumido pelo
que uma wave anterior *disse* ter feito) e por leitura de conteúdo.

### Login / conta — `AcessoConta.tsx` não é a tela de login

O brief chama `AcessoConta.tsx` de "(login)". **Não é.** Confirmado por
leitura: é o widget de 109 linhas no cabeçalho do Portal (mostra
"Entrar" sem sessão, "Conta · nome" com sessão) — só um link, não um
formulário. A tela de login real é `EntrarView.tsx` (139 linhas), com
`CriarContaView.tsx` (207) para cadastro e `PerfilPlataforma.tsx` (326)
para o perfil, todas envelopadas por `ContaShell.tsx` (283).

| Arquivo | `git log` (mais recente primeiro) | Mudou desde a última wave que o tocou? |
| --- | --- | --- |
| `AcessoConta.tsx` | `4ca139d` (minha própria Wave 5) ← `fc9ff54` (Identidade Wave 1, criação) | Não — meu próprio commit é o mais recente |
| `PerfilPlataforma.tsx` | `c429a21` (minha revisão direta) ← Topologia Wave 3 ← Identidade Wave 1 | Não |
| `EntrarView.tsx` | (não tocado por nenhuma wave desta trilha) | — |
| `ContaShell.tsx` | (idem) | — |

**Reusabilidade — precisa de adaptação, não está pronto como está.**
`grep` em `ContaShell.tsx` e `EntrarView.tsx` por tokens: **1 ocorrência
de `jaguar-tokens` em cada, zero de `--accent-house`/`--surface-*`**.
Ou seja: o texto GridAlpha→NIVAR já foi trocado nessas telas (revisão
direta anterior), mas o SISTEMA DE COR E ESPAÇO por baixo continua
sendo `src/design/jaguar-tokens.ts`, não os tokens NIVAR de
`src/design/nivar/`. Reusar essas telas dentro da estrutura de família
exige a mesma migração de tokens que `PortalBR.tsx` já passou — a
pendência que a própria Wave 5 registrou ("A migração de `/conta` para
NIVAR (hoje em Jaguar) é wave própria") continua aberta, e ainda não é
esta wave.

### Especime de movimento — SEIS seções está certo; DEZ peças está errado

O brief herdou "dez peças em seis seções" de citação anterior. **Medido
no DOM renderizado** (não no HTML bruto — o agrupamento é montado por
JS), a estrutura real é:

| # | Seção | Contagem própria da seção |
| --- | --- | --- |
| 01 | A marca surgindo | 5 variantes — Colapso, Energização, Corrente, Religamento, Sincronização |
| 02 | Estados de carregamento | 9 estados — desenho, nunca spinner |
| 03 | Loaders de dado | 6 leituras — "o dado desenha a própria espera" |
| 04 | Estados de produto | Score · Simulação · Apuração · Comparador |
| 05 | Transições e sobreposição | 6 movimentos — corte por opacidade e fio |
| 06 | Sequência de boot | 1 composição, 16:9 · 14s · exportável como vídeo |

**Seis seções, sim. Não dez peças — trinta e uma.** Confirmado por
segunda via independente: `data-el` únicos no DOM renderizado somam
**34**, dos quais três (`page`, `rm`, `b`) são controles estruturais do
harness, não peças de animação — sobram **31**. `5 + 9 + 6 + 4 + 6 + 1
(boot) = 31`, batendo exatamente com a contagem de `data-el`. O brief
que abriu esta wave já avisava para não copiar números de citação
antiga sem reconferir — este é exatamente esse caso.

**Reusabilidade:** alta, sem adaptação de código — é HTML/CSS/JS
autocontido, não componente React. O que a esqueleto de vídeo do
Aquiles (player + pôster) precisaria é da peça **06 · Sequência de
boot** especificamente ("16:9 · 14s · exportável como vídeo") — é a
única das seis pensada para virar clipe, as outras cinco são
demonstrações interativas de estado de UI, não sequência de abertura.

### Tokens de produção + wordmark de substrato escuro

`src/design/nivar/` — confirmado intocado desde a FOUNDRY NIVAR Wave 2
(`f0603df`, wordmark papel) por `git log`. Contém `colors.css`,
`typography.css`, `space.css`, `motion.css`, `fonts.css`, `base.css` e
`assets/nivar-wordmark-papel.svg`. **Reusabilidade: total, já em
produção** — é exatamente o que `PortalBR.tsx` importa hoje (90
ocorrências de tokens, Fase 2). Qualquer página de família nova herda
os mesmos tokens sem nenhuma adaptação.

Nota que a Revisão Direta 1 já registrou e que continua válida: a
variante `nivar-wordmark-papel.svg` está em produção mas **sem
consumidor** — a decisão de usar sempre o wordmark colorido (Revisão
Direta 1) deixou essa variante órfã. Não é bug, é ativo disponível sem
uso ainda.

## Fase 5 — Consolidação e recomendação de sequência

**Recomendação, não decisão.** A ordem abaixo é sugerida a partir do que
as quatro fases acima mediram — quem escrever o próximo brief decide.

### 1. Rota + página primeiro

É o bloqueio estrutural: hoje **não existe nenhuma sub-rota sob `/br`**
(Fase 3), e a seção "Destinos" da página ainda renderiza os **cinco
cards de produto** (`DestinoCard` × `DESTINOS_BR`, Fase 2) — não a
faixa de família que o Aquiles decidiu. Duas decisões de arquitetura
precisam sair antes de qualquer página de família existir:

- Escolher entre rota rasa (`/br/advisory` ao lado de `/br` em
  `main.tsx`) ou splat + router aninhado (`/br/*` com um
  `PortalBRRouter`, no padrão que `/alexandria/*` já usa) — Fase 3.
- Decidir se a faixa de família substitui a seção "Destinos" no lugar,
  ou se ganha seção própria — a numeração de seção do sistema
  (`01`…`09`, Fase 2) precisaria deslocar de novo, como já aconteceu
  três vezes nesta trilha (Wave 6, Revisão 1, Revisão 2).

Isso desbloqueia tudo o mais: sem rota, não há "página própria" para
cada família crescer; sem decidir onde a faixa entra, qualquer outra
mudança na página corre risco de precisar refazer a numeração de novo.

### 2. Login e perfil encaixados depois

`AcessoConta.tsx` já está pronto — é widget de header, já em tokens
NIVAR, zero adaptação. **`EntrarView` / `CriarContaView` /
`PerfilPlataforma` / `ContaShell` não estão** — rodam sobre
`jaguar-tokens.ts`, não sobre os tokens NIVAR que a página de Portal já
usa (Fase 4). Migrar essas quatro telas (283 + 139 + 207 + 326 = 955
linhas) para os tokens de `src/design/nivar/` é o mesmo tipo de
trabalho que a Wave 5 já fez em `PortalBR.tsx` — replicável, mas é
volume real, não ajuste cosmético. Faz sentido depois da estrutura de
família estar de pé, porque a UI de conta provavelmente ganha um
seletor ou indicador de família (qual produto/família a conta ativou),
que só faz sentido desenhar depois que a família em si existe como
conceito de rota e página.

### 3. Esqueleto de vídeo e movimento por último

O especime tem exatamente **uma** peça pensada para virar clipe: **06 ·
Sequência de boot**, 14s, 16:9, "exportável como vídeo" (Fase 4). As
outras 30 são demonstrações interativas de estado de UI — reusáveis
como referência de comportamento (como a Wave 5-6 já fez: Corrente,
Energização, o loader da casa), não como fonte de vídeo. Fazer o
esqueleto de player+pôster antes de saber o conteúdo real de cada
página de família significa desenhar uma moldura para um clipe que
ainda não tem roteiro — melhor depois que ao menos a página mínima de
uma família (a primeira a sair do papel) existir, para o pôster ter algo
real para retratar em vez de mockup genérico.

### Registrado, não resolvido por esta wave

- **Onde a faixa de família entra na página** e **como a numeração de
  seção reage** — decisão de composição, não desta wave de
  reconhecimento.
- **Rota rasa vs. splat aninhado** — as duas opções existem no app
  hoje; nenhuma foi escolhida aqui.
- **Migração de tokens das quatro telas de conta** — trabalho real
  medido (955 linhas), não uma linha de CSS.
- **Conteúdo de cada página de família** — esta wave não leu
  `br-destinos.ts` para saber o que cada família herdaria de copy, por
  estar fora da posse (`src/lib/data/` é NUNCA MODIFICAR, e mesmo
  leitura não foi pedida nesta wave).

---

**Todos os quatro commits desta wave estão pushados** — confirmado por
`git status -sb` sem `ahead`/`behind` depois de cada push (Fases 1-4).
Zero arquivo de `src/` foi tocado; a única mudança em toda a wave é este
documento.
