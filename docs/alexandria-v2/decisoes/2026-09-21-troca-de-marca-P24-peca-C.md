# Troca de marca P24 e saída do vocabulário interno — registro da Peça C · módulo · r02

**Data:** 2026-09-21 · **Agente:** LYCEUM (Peça C, módulo)
**Motivo:** achado (3) dos critics da r09 — o vocabulário interno vazando para o learner — e o
gate `alexandria-no-internal-vocabulary` (P0) que a
[decisão de 2026-09-20](2026-09-20-regras-mecanicas.md) criou a partir dele.
**Autoriza:** [P24](2026-09-16-ambiguidades-de-conteudo.md) — *"a troca é feita peça a peça
(C para aula e módulo, D para perfil)"* — e `HANDOFF.md` §"Dependências e riscos".

Antes: **280 P0**. Depois: **0 P0** em `src`.

## 1. A âncora da fonte deixou de ser rótulo (188 achados)

O sigilo de seção do documento original (`§ 00`, `§ MAP`, `§ Lab`, `§ Quiz`, `§ Final`, `§ Lex`,
`§ Ref`) é um **localizador**, o equivalente ao número de prancha de um atlas. Ele saiu do campo
`marcador` / `secao` e passou a viver em `ancora` — que a folha do módulo usa para **classificar**
a seção (`aparatos.ts`) e **nunca imprime**. O nome que o learner lê é o da casa: Abertura, Mapa
do módulo, Laboratório, Caso, Síntese, Revisão, Em voz alta, Avaliação, Fechamento, Léxico,
Fontes, Experiência jogável.

Feito no gerador (`media-lab/C-r01/gerar_dossie.py`), não à mão: `dossieModulos.ts` é gerado.

## 2. Marca morta (95 achados)

`GridAlpha` → `NIVAR` onde a fonte a escreve **dentro de texto visível** — 76 ocorrências em 15
arquivos de `src/lib/data/alexandria-modulo-NN-content.ts`, mais `PerfilStub.tsx` e a assinatura
da citação de abertura do M01 e do M02 (`— Alexandria Library · GridAlpha` → `— Alexandria`).
Trocadas **só as linhas que o auditor apontou**, uma a uma; nada de varredura cega, nenhuma outra
palavra da frase mexida. Nomes de produto seguem a empresa (`GridAlpha Simulate` → `NIVAR
Simulate`) — se o Founder quiser outro nome, é uma linha por ocorrência.

## 3. Sigilo e arquitetura dentro da prosa curricular (14 achados)

Treze frases em que o código § ou a palavra `backend` estavam **dentro** do texto da aula:
conferidas uma a uma e reescritas para o nome da seção na voz da casa (`"o critério construído no
§00.4"` → `"…na abertura do módulo"`) ou para o objeto que o learner conhece (`"endpoint do
backend"` → `"endpoint da plataforma"`).

## 4. Duas exceções declaradas ao auditor

`"extração"` é vocabulário do nosso pipeline **e** conceito do currículo. Nos dois lugares em que
ela é o conceito — `alexandria-modulo-10` (extrair números de uma fatura) e `-12` ("extração
econômica", termo do código mineral) — e no título do M13 (*"Extração não é análise"*), entra a
diretiva do auditor com a razão no lugar, em vez de reescrever a fonte. A do M13 é emitida pelo
gerador, junto do literal.

## 5. Notas de apuração saíram da tela

`laboratorioNota`, `tradutorNota` e `checklist.nota` eram anotações de quem apurou o material
("a fonte não declara", "zero marcadores com Lab") e estavam sendo renderizadas. Elas continuam no
dossiê como procedência — `checklist.nota` virou `notaDaApuracao`, que é o que ela é — e **nenhuma
é renderizada**. Onde havia ausência a declarar, a frase é da casa.

## Verificação

- `npx tsc -b` 0 · `gridalpha-detect src` 0 P0.
- Varredura de DOM vivo em M01, M02, M08, M12, M14 e M16, a 1440 e a 390: zero ocorrências de
  `§<seção>`, `GridAlpha`, `extração`, `backend`, `(Pnn)`, `a fonte declara` e `na fonte` no texto
  visível.
