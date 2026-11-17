# Peça D·Perfil — Progresso e Perfil (brief-base, Loop 2 antecipado pelo Founder)

**Régua:** [`../bar.md`](../bar.md) v1.1: §5 (D1, D2), S1–S7, §6, §7, e decisões P18, P22, P24 e P25.
Estratégia de sessão: [`../harness/sessao-de-teste.md`](../harness/sessao-de-teste.md).
Pedido do Founder: "faz uma modificação de perfil também… quero as badges lindas… animações de conclusão".

## Trabalho

A rota `/alexandria/perfil` (rótulo de conta: "Progresso", X4) é o estado de estudo num lugar só. Ela responde:
1. onde estou;
2. o que faço agora;
3. o que revisar (ou a ausência honesta: o evento "a revisar" ainda não existe, §9);
4. o que demonstrei ("Demonstrado: ainda não avaliado");
5. o que percorri e pratiquei, por módulo;
6. a camada de motivação, separada: sequência, conquistas de comportamento, marcos;
7. a conta.

**Além do conceito:**
- a jornada é o próprio globo ou carta do currículo com o trecho percorrido, na mesma linguagem da Home e das Trilhas,
  e não um donut;
- as conquistas são medalhas cunhadas, bonitas e honestas.

## Estado atual medido (`captures/D/r00-baseline/`)

- **Marca e linguagem interna:** "Identidade vem da sua conta GridAlpha" (P24) e texto interno visível
  ("demonstração fora da tela · 8", "valor calculado, não observado · 3", "conteúdo ainda não extraído").
- **Forma:** quatro cards iguais ("7 de 141 confirmadas", "0 de 13", "3 dia(s)"); caixas tracejadas; título em caixa
  alta total.
- **"Certificado Nível 1 · 17% do caminho":** afirmação de certificação sem regra (P18). A camada de conclusão pode
  existir como "Concluído", sem "certificado".
- **Tipografia:** texto de 9–10px (`minFontPx` 9).

## Direção

- **Camadas (S3, P18):**
  - **Evidência:** Percorrido, Praticado ("ainda não medido") e Demonstrado ("ainda não avaliado").
  - **Avaliações do módulo:** o lugar fica reservado, sem ponto de corte.
  - **Motivação:** abaixo e visualmente separada (sequência, conquistas, marcos).
  - Nenhum "Aprovado", "Dominado" ou "certificado".
  - Percentual só com escopo.
- **Jornada:**
  - globo ou carta da trilha atual (reaproveite a geometria e os renders em
    `../media-lab/A-r03|A-r04/globo/` e os mapas de `../media-lab/B-r01/mapas/`, quando existirem) com o trecho
    percorrido e "você está aqui";
  - lista acessível equivalente;
  - números idênticos aos da Home e das Trilhas no mesmo estado.
- **Conquistas (D2):**
  - use `../estudos/movimento-e-conquistas/sistema-de-conquistas.md` e as medalhas de
    `../media-lab/movimento-e-conquistas/medalhas/`, quando existirem;
  - obtidas: só as computáveis hoje a partir de `aula_concluida`, com critério em 1 frase e data real do evento;
  - não obtidas: disco cego;
  - dependentes do §9: "em desenho", sem data e sem controle;
  - nunca palavras de competência.
- **Conta:** nome, e-mail, "membro desde", "Alexandria ativada em", "Gerenciar conta" (link real para `/conta`) e
  "Sair" (ação real).
  - **Hierarquia:** a conta fica por último, discreta.
  - **Marca:** NIVAR, quando o sujeito é a empresa.
- **E0:** convite para entrar, sem nada pessoal.
- **E1:** estados vazios honestos e convidativos ("Por onde começar · M01·A01").
- **Movimento:** use `../estudos/movimento-e-conquistas/sistema-de-movimento.md` quando existir. Chegada da jornada
  (trecho traçado) e revelação da conquista, sem bounce nem confete; movimento reduzido chega ao mesmo estado.
- **390:** composição própria, com a jornada antes das listas e nada cortado.

## Dados

- **Fontes permitidas:** só `getMyProgress` / `getAulaStatus` / `useEstudo` (registro real) e o catálogo.
  `alexandria-progress-mock.ts` não entra.
- **Contagens (P22):** derivadas.
- **XP:** não existe campo no servidor, então não aparece como persistido. Se a camada de motivação precisar de
  pontos, fica "em desenho".

## Posse

- **CRIAR/MODIFICAR:**
  - `src/pages/alexandria/PerfilStub.tsx` (pode virar `PerfilView.tsx`, atualizando o import no router);
  - componentes novos em `src/components/alexandria/progresso/`;
  - no header, só o atributo `data-capture="conta"` na entrada de conta;
  - `public/alexandria/v2/progresso/`;
  - `docs/alexandria-v2/media-lab/D-rNN/`;
  - `docs/alexandria-v2/media-provenance.md`.
- **SOMENTE LEITURA:** `src/lib/progress/*` (`badgeRules.ts` pode ser lido; a nova regra de conquista vive num módulo
  novo em `src/components/alexandria/progresso/`, com teste); `src/lib/data/*`; home/*, via import.
- **NUNCA MODIFICAR:** `index.html`, `src/main.tsx`, `app/`, `/conta` (ARCHITECT), as rotas das Peças B e C.

## Verificação

- `npx tsc -b` limpo e `gridalpha-detect` com 0 P0.
- Captura: `node tools/alexandria-capture/capture.mjs --plan docs/alexandria-v2/captures/D/plans/piece-D-perfil.json --out docs/alexandria-v2/captures/D/rNN`.
- Na `legend.json`:
  - `horizontalOverflow` false;
  - `minFontPx` ≥ 11;
  - `truncatedText` vazio;
  - `smallTargets` vazio;
  - `media` com classe;
  - nenhuma ocorrência de "GridAlpha".
