# Peça A · Rodada 5 — o globo com a mesma gravura do Titã, e o letreiro que se lê

Continuam valendo os briefs anteriores (`piece-A.md`, `piece-A-r02.md`, `piece-A-r03.md`, `piece-A-r04.md`).

## Resultado da r04

| Critic | Veredito |
|---|---|
| Brief | **PASS** |
| System | FAIL |
| Craft | FAIL |

**Pares cegos:**
- r04 × North Star: **3 × 0, margem clara** (E2 e E0).
- r04 × Atlas: 3 × 0, clara.
- r04 × r00: 3 × 0, clara.
- r04 × r03: 2 × 1, leve.

**System — o gate reprovado era defeito do harness.** O "texto de 10px no shell" das rotas de aula e de módulo é o
cabeçalho do instrumento "INST · 06" e a navegação "Aula anterior / Próxima", ambos do corpo da Peça C. A medida
confundia `<header>`/`<nav>` internos com o shell. **Correção:** o shell agora se marca com `data-shell` (cabeçalho,
localizador, nav-movel, sumario, rodape), e a `legend.json` mede por esse atributo.

## A maior lacuna — acabamento do globo e legibilidade do letreiro (Craft + Brief)

1. **Mar.** A pauta reta e regular lê como "linhas de varredura digitais" ao lado da hachura do Titã, e o disco navy
   ainda parece liso na escala exibida.
   - O mar precisa ler como **gravura de verdade**.
   - Teste pelo menos três soluções e escolha às cegas, na escala de exibição, dentro da prancha:
     - **(a) meia-tinta (mezzotint):** grão fino navy com áreas brunidas mais claras do lado da luz. É a técnica
       histórica de tons ricos que o North Star evoca ("gravura em meia-tinta");
     - **(b) talho curvo:** linhas claras sobre navy que **seguem a curvatura da esfera** e engrossam ou afinam com a
       luz;
     - **(c) contra-hachura curva no terminador**, com mar pontilhado.
   - Evitar padrão periódico reto.
   - O navy continua.
2. **Terra.** As massas "sem forma" precisam ler como cartografia na escala exibida:
   - costa em tinta firme, com sombra de costa e water-lining;
   - relevo em perfil graúdo;
   - rios e matas legíveis;
   - silhuetas de ilha claramente inventadas (nada de continente real).
3. **Letreiro.**
   - O nome do território III não pode sair vertical nem espremido no limbo, e nenhum nome pode colidir com
     marcador ou traçado (E2b: "I · FUNDAMENTOS UNIVERSAIS" × marcador 04).
   - **Solução recomendada:** nomes dos territórios **fora do disco**, sobre o céu da prancha, em letreiro de carta
     (arco externo largo ou horizontal), com fio-guia fino até a ilha, como nos frontispícios de atlas. No disco
     ficam só os códigos e os marcadores.
   - Estações rasantes no limbo (ex.: 12–17 em V1) mantêm o código fora da borda, com fio-guia, ou omitem o código
     se não houver `label_ok`. Continua valendo "estações visíveis e com `label_ok` têm código legível".
   - Verificar **todos os estados** (E0, E1, E2, E2b) em **todas as larguras** (390, 768, 1280, 1440, 1920, 3440).

## Entram junto

- **Legenda e microcopy no pé da coluna.** A legenda de estados e "Sobre esta figura" diluem o fim da coluna.
  Devolva-as a uma faixa própria junto à imagem (como na r03), legível (≥ 12px, contraste ≥ 4,5:1).
- **Legenda de estados.** Só lista glifos que aparecem no objeto no estado atual. Em E2 não há "a seguir" visível.
- **3440.**
  - Header e conteúdo alinhados à mesma grade (contêiner de largura máxima comum, ou conteúdo que ocupa a largura).
  - Sem faixa de papel quase vazia à esquerda: a gravura se estende ou a composição se reancora.
- **1280.** Lede em no máximo 3 linhas.
- **Faixa navy a 1440.** Hoje corta o Titã na cintura. Avalie se a figura assenta melhor (base de rocha ou nuvem na
  prancha) ou se a faixa ganha respiro.

## Guarda de regressão

A r05 não pode ficar abaixo da r04 na comparação cega. Presença, identidade e composição da r04 ficam; muda o
acabamento.
