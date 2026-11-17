# M09 · grupo "instrumentos"

**Fonte (só leitura):** `C:/dev/GridAlpha v2/Alexandria modulos/alexandria_modulo09.html`. O markup está nas L530–1758 e o
`<script>` nas L2359–3439.
**Arquivo gerado:** [`instrumentos.json`](instrumentos.json).
**Extrator:** [`extratores/m09_instrumentos.mjs`](extratores/m09_instrumentos.mjs), com o DOM simulado de
[`extratores/lib.mjs`](extratores/lib.mjs).
**Data:** 2026-09-17.

## Método (protocolo §10, "método mais forte")

1. **Markup.** Cada `.inst` é lido por linha: `inst-hd` (id e nome), `inst-intro`, `seg-lb`/`.seg` (seletores e opções,
   com a padrão marcada `on`), `.field` (rótulo, unidade, `min`/`max`/`step`/`value` e o deslizador gêmeo), `.ro`
   (readouts com o valor estático do markup), `.verdict`, `.out`, `.leg`, os rótulos do SVG e `p.disc`.
2. **Dados.** Cada `var NOME={…}` ou `[…]` do bloco do instrumento no script é lido por casamento de colchetes e avaliado
   com `vm`, só como dado. São 488 strings-folha, todas conferidas como substring da fonte.
3. **Código.** `script.codigo_de_calculo_e_ramos` copia **todas** as linhas do bloco (trim), menos as de dados e as
   vazias: fórmulas, limiares, ramos e textos com interpolação, exatamente como estão.
4. **Saídas.** O `<script>` inteiro, **sem nenhuma alteração**, roda num DOM simulado mínimo, com cliques e digitação
   simulados.
   - O **cenário-padrão** é o estado depois do carregamento, sem interação.
   - Os espaços finitos foram rodados por inteiro: INST·05, 288 combinações; INST·09, 729; INST·04, 18; INST·01, 24.

**Verificação:**
- **Strings e origens:** 683 strings de conteúdo e 57 origens conferidas, sem falha.
- **Cobertura por token, markup:** 100% em 10 instrumentos. No INST·01 fica em 97,7%, e o resíduo são os comentários
  HTML `<!-- arestas / nós -->` do SVG.
- **Cobertura por token, strings do script:** 100% em 10 instrumentos. No INST·04 fica em 99,1%, e o resíduo é o
  fragmento de markup `'<div class="ocard '` dentro de uma string.

## Contagem

| Medida | Valor |
|---|---|
| Na fonte | **11** (pill do hero "11 instrumentos", catálogo canônico 11) |
| Em aula | 10 (Aula 08 com três: INST·09, ·10 e ·11) |
| Fora de aula | 1: INST·01, no §MAP, que vai para Recursos do Módulo (protocolo §3) |
| Com cálculo | 5 (INST·04, ·05, ·07, ·08, ·09) |
| Só texto | 6 (INST·01, ·02, ·03, ·06, ·10, ·11) |
| Com pergunta própria | 0 |
| Com tolerância ou resposta de referência | 0 |
| **Portados no código** | **0**. `instruments: []` nas 8 aulas, nenhuma chave `m09-inst-*` em `alexandria-instrument-calculators.ts`, e `RecursosDoModulo.tsx` tem `'modulo-09' → instrumentos: []` |
| Estado | 11 **não portados**, 0 divergentes (não há porte a comparar) |

Os 11 nomes batem 1:1 com a tabela do catálogo canônico.

## Os 11

| Id | Título (literal) | Onde é invocado | Entradas | Saídas | `kind` candidato* |
|---|---|---|---|---|---|
| INST·01 | Mapa do mercado — energia, contrato, dinheiro | §MAP, depois do 3º parágrafo (L528), antes do destaque "O teste do guardanapo" (L653) | fluxo (3; padrão "Energia física"); clique em 8 agentes do SVG | `#mp-flow` (FLUXO[3]), `#mp-node` (NODE[8×3]) | explorador |
| INST·02 | Comparador componente a componente | Aula 01, fim do Eixo 1b (depois da L701), antes do h3 "Eixo 2" | chip de componente (10, gerado) | 4 cartões + nota por classe; 4 readouts **estáticos** | explorador |
| INST·03 | Anatomia do produto de leilão | Aula 02, fim de 02.4 (depois da L831), antes do h3 02.5 | família (6, em dois grupos exclusivos); modalidade (2) | 5 cartões + veredito da modalidade | explorador |
| INST·04 | Régua de elegibilidade e cronograma condicionado | Aula 03, depois do destaque "Regra em movimento" de 03.1 (L966), antes do h3 03.2 | segmento (3); data-marco (texto "11/2025", mês/ano); 2 prazos (0–120 meses, passo 1; 24 e 36, com range gêmeo igual); 5 requisitos liga/desliga (gerados) | cumpridos (0–5), teto de prazo (texto), estado (texto), veredito, 5 cartões | simulador (alt. quebra-cabeca) |
| INST·05 | Montador de contrato — perfil de risco resultante | Aula 04, fim de 04.5 (depois da L1240), antes do destaque de produto | horizonte (3), volume (4), flexibilidade (3), preço (4), submercado (2) | risco de preço, de volume e de perfil (texto); camadas descobertas (número); veredito; 6 cartões | quebra-cabeca (alt. simulador) |
| INST·06 | Matriz contrato × risco — produto cartesiano completo | Aula 05, fim de 05.7 (depois da L1358), antes do h3 05.8 | estrutura (6, em dois grupos); classe de risco (7, gerada) | 4 cartões por célula (42 × 4) + veredito | explorador |
| INST·07 | Simulador de exposição residual | Aula 06, depois do três-níveis "Exposição…" (L1436), antes do destaque de produto | consumo (50–50000 MWh, passo 50, padrão 1000); amplitude sazonal (0–60, 15); dispersão horária (0–80, 20); volume contratado (0–130 %, 100); banda (0–40, 10); forma (3) | exposição %, volume MWh, origem sazonal %, origem horária %, veredito | simulador |
| INST·08 | Anatomia do fator de ajuste | Aula 07, fim de 07.2 (depois da L1553), antes do três-níveis "Fator de ajuste" | fator (0.60–1.20, passo 0.01, padrão 0.92; range 60–120); garantia física (1–2000 MW médios, 100); posição vendida (0–130 % da GF, 95) | alocada, contratada, diferença (MW médios, 1 casa), situação (texto), veredito | simulador |
| INST·09 | Roteador — vale investigar, não vale, ou não dá para dizer | Aula 08, depois do destaque "A estrutura da decisão, sem número" (08.1), antes do h3 08.2 | 6 perguntas Sim/Não/Não sei (3 do tipo "dado", 3 do tipo "impedimento") | respondidas, lacunas ("não sei"), impedimentos, veredito (4 ramos), cartões | *pendente* (não é o "Roteador" do M07) |
| INST·10 | Régua do ciclo comercial — o que pode dar errado em cada etapa | Aula 08, fim de 08.3, depois da lista de 10 séries a observar (L1714) | etapa (8, gerada) | 4 cartões + veredito "Etapa N de 8" | explorador |
| INST·11 | Localizador de dado de mercado | Aula 08, logo depois do INST·10, antes do destaque de produto (L1760) | pergunta (8, gerada) | 4 cartões; sem veredito | explorador |

\* `kind_candidato` é anotação desta extração, pela taxonomia ("mecânica decide"). A decisão de tipo é da wave de porte.

**Menções no texto** (`mencoes_no_texto`, frases conferidas na fonte):
- **INST·06:** reaparece no §00.1 (L468), na Aula 01 (L730), no destaque da Aula 05 (L1397) e no roteiro oral do §Voz
  (L2089).
- **INST·09:** aparece no destaque de produto da Aula 08 (L1762) e na **questão 10 do quiz** (L3391).
- **INST·04 e INST·07:** aparecem nos destaques de produto das Aulas 03 e 06.

## Fórmulas (verbatim do script)

**INST·04** (L2690–2692): o teto de prazo só existe para BT. `addMonths("11/2025", 24)` dá "novembro de 2027", e com 36
dá "novembro de 2028".

```js
var meses=(seg==='bt1')?m1:m2;
prazo=addMonths(d0,meses);
if(n>=5){
```

**INST·05** (L2766–2770): a soma dos pesos `cam` define o veredito. `cam>=4` dá per, `cam>=2` dá att, e o resto dá ok.

```js
var cam=hz.cam+vol.cam+fx.cam+ix.cam+sb.cam;
var rp = (ix.n==='indexado ao curto prazo com teto')?'compartilhado':'vendedor, sobre o contratado';
var rv = (vol.n==='acompanha a carga')?'vendedor, dentro dos limites':((fx.n==='rígido')?'comprador, integral':'compartilhado pela banda');
var rperf = (vol.n==='modulado'||vol.n==='acompanha a carga')?'coberto em boa parte':'comprador';
```

**INST·07** (L3043–3049): as entradas passam por `numOf` com clamp. O veredito é `exp<3` ok, `exp<8` att e o resto per.
Saída com 1 casa (`fmt(exp,1)`), e o MWh com 0 casas.

```js
var sazRes = (e==='sazo'||e==='mod') ? S*0.15 : S;
var horRes = (e==='mod') ? H*0.20 : H;
var nivel = Math.abs(100-V);
var base = Math.sqrt(sazRes*sazRes + horRes*horRes) + nivel;
var exp = Math.max(0, base - F);
var mwh = C*exp/100;
```

**INST·08** (L3081–3083 e L3088): a faixa do fator é `f<0.85` per, `f<1.0` att e o resto ok. O texto do veredito se
compõe com o sinal de `diff` (±0,05).

```js
var aloc=g*f;
var cont=g*v/100;
var diff=cont-aloc;
(diff>0.05?'posição comprada':(diff<-0.05?'posição vendida':'equilibrada'))
```

**INST·09** (L3176–3205): "não sei" entra em `lac`. "Não" entra em `imped` se a pergunta for do tipo impedimento; se for
do tipo dado, entra em `lac`. A prioridade dos ramos é: `n<6` pede para responder; `ns>0` dá *Não é possível concluir*;
`imped>0` dá *Não vale*; `lac>0` dá *Não é possível concluir*; o resto dá *Vale investigar*.

## Cenário-padrão (script original, sem interação)

| Id | Entradas padrão | Saídas renderizadas |
|---|---|---|
| INST·01 | fluxo "fisico" | `mp-flow` = FLUXO.fisico; `mp-node` = texto de instrução |
| INST·02 | componente 0 (Energia) | readouts **1 / 3 / 4 / 2** (estáticos); nota = versão longa de `txt.f`, classe `verdict ok` |
| INST·03 | "nova", "qtd" | 5 cartões de Energia nova; veredito "Por quantidade…" (ok) |
| INST·04 | "ga", 11/2025, 24, 36, 0 requisitos | 0 · "não se aplica" · "elegível hoje" · veredito ok |
| INST·05 | curto, flat, rig, fixo, mesmo | "vendedor, sobre o contratado" · "comprador, integral" · "comprador" · **3** · "Exposição residual moderada" (att) |
| INST·06 | flat × preço | 4 cartões; veredito "Plano × Preço. Leia lateralmente…" (att) |
| INST·07 | 1000 / 15 / 20 / 100 / 10, flat | **15,0** % · **150** MWh · 15,0% · 20,0% · "Exposição residual alta" (per) |
| INST·08 | 0.92 / 100 / 95 | **92,0** · **95,0** · **3,0** · "posição comprada" · "Fator abaixo da unidade…" (att) |
| INST·09 | nenhuma resposta | 0 · 0 · 0 · "Responda as seis perguntas… **Responder "não sei" é uma resposta válida**…" |
| INST·10 | etapa 1 | 4 cartões de Medição; "Etapa 1 de 8 · Medição…" (att) |
| INST·11 | pergunta 1 | 4 cartões "Quantos consumidores migraram no mês?" |

Mais cenários, todos rodados no script original, estão em `enumeracao`:
- **INST·07:** sazonalizado dá 10,1 (per); modulado dá 0,0 (ok); sazonalizado com banda 15 dá 5,1 (att); entrada 999 é
  presa em 60 e dá 53,2.
- **INST·08:** 9 combinações de faixa × sinal, todas alcançáveis.
- **INST·04:** os 5 ramos (ga; bt1 e bt2, cada um pendente ou com as condições cumpridas).
- **INST·05:** distribuição das camadas (0:16, 1:56, 2:84, 3:74, 4:42, 5:14, 6:2).
- **INST·09:** Vale investigar 1, Não vale 56, Não é possível concluir 672.

## Fonte dos números e tolerâncias

- **`fonte_dos_numeros: null` nos 11.** A fonte não declara origem para coeficientes, pesos, limiares e padrões:
  - 0,15 e 0,20 no INST·07;
  - os pesos `cam` no INST·05;
  - 0,85, 1,0 e ±0,05 no INST·08.

  Os 24 e 36 meses do INST·04 batem com a Lei 15.269/2025 citada na Aula 03, mas o instrumento não a cita. Tratar como
  **cenário didático** (P19).
- **`tolerancias: null` nos 11.** Nenhuma é declarada.

## Divergências

| Id | Sev. | Resumo |
|---|---|---|
| div-m09-inst02-contadores | alta | O readout estático diz 1/**3**/**4**/2 (fornecedor/mecanismo/permanece/novo); os dados do script dão 1/**4**/**3**/2. O script nunca reescreve os contadores, então **a tela mostra o número errado** |
| div-m09-inst05-seis-de-cinco | alta | A soma máxima dos pesos é **6** (longo + plano + rígido + câmbio ou curto prazo + submercado diferente). O texto "6 camadas descobertas de cinco possíveis" e o readout "de 5" são alcançáveis (2 combinações) |
| div-m09-inst-codigo | alta | Nenhum dos 11 está portado |
| div-m09-inst09-imp-morto | média | Os textos `imp` das perguntas "estabilidade" e "proposta" (tipo dado) **nunca aparecem**. "Não sei" vence um impedimento determinado: o veredito diz "não é possível concluir" e o cartão de impedimento continua na tela |
| div-m09-inst03-quatro-perguntas | baixa | A intro diz "quatro perguntas idênticas"; o render mostra 5 cartões |
| div-m09-inst06-tres-perguntas | baixa | A intro diz "três perguntas"; as células têm 4 campos. O catálogo canônico repete "três" |
| div-m09-inst02-nota-inicial | baixa | A nota do markup nunca aparece (o script a sobrescreve com a versão longa) |
| div-m09-inst01-estatico | baixa | "Selecione um fluxo acima." nunca aparece |
| div-m09-inst09-estatico | baixa | O veredito do markup é sobrescrito no carregamento por uma versão mais longa |
| div-m09-inst08-rotulo | baixa | "posição comprada" para quem vendeu além da alocação × verbete do §Lex escrito pela ótica do consumidor |
| div-m09-inst-nomes-mesmos-prefixos | baixa | "Roteador" e "Régua" repetem nomes do M07 com mecânica diferente. Só o "Localizador" tem a mesma mecânica (explorador) |

Também registrado no JSON, sem ser divergência: o ramo "Célula incompleta" do INST·06 é inalcançável, porque as 42
células têm 4 campos.

## Lacunas

- **Pergunta própria.** Nenhum instrumento tem. Uma pergunta de previsão seria da camada Alexandria (P19 como
  precedente).
- **Números e tolerâncias.** Não há fonte dos números nem tolerância declarada.
- **SVG do INST·01.** Não porta (§12). Os rótulos de aresta e de nó entram como texto em `desenho`.
- **Saídas textuais.** Não cabem em `ResultadoInstrumento.valores` (§12): prazo e estado (INST·04), riscos (INST·05),
  situação (INST·08) e os vereditos.
- **Ids.** O INST·04 usa `el-*`, o INST·05 usa `mc-*` etc. A numeração `INST·NN` bate com a ordem e com o comentário do
  script em todos os 11.

## Verificação

Verificação adversarial independente em 2026-09-17. Resultado: **ok, nenhuma correção**.

- **Código dos 11 instrumentos.** As 407 linhas de `script.codigo_de_calculo_e_ramos` existem na fonte, idênticas
  (trim) e na linha declarada. As fórmulas dos blocos js deste .md também estão literais (L2690–2692, L2766–2770,
  L3043–3049, L3081–3083 e L3088).
- **Cenários recalculados à mão:**
  - INST·07: padrão 15,0 % / 150 MWh; sazonalizado 10,1; modulado 0,0; banda 15 dá 5,1; S=999 preso em 60 dá 53,2.
  - INST·08: 92,0 / 95,0 / 3,0, "posição comprada".
  - INST·05: pesos `cam` HZ 0/0/1, VOL 2/1/0/0, FLEX 1/0/0, IDX 0/0/1/1, SUB 0/1. São 288 combinações, com
    distribuição {0:16, 1:56, 2:84, 3:74, 4:42, 5:14, 6:2}, então "6 de cinco" é alcançável.
  - INST·09: 729 = 1 + 56 + 672.
- **Divergências confirmadas:**
  - **INST·02.** As classes do script são f1, m4, p3 e n2; o markup L717–720 diz 1/3/4/2.
  - **INST·09.** `estabilidade` e `proposta` são do tipo `dado`, com `imp`, e `ns>0` tem precedência.
  - **INST·03.** São 5 `ocard` contra "quatro perguntas".
  - **INST·06.** São 4 campos por célula contra "três perguntas".
- **Markup.** Os 11 `.field`, com min/max/step/value e o range gêmeo, conferem com a tabela. As `mencoes_no_texto`
  estão na linha declarada (±3).

### Segunda verificação adversarial (2026-09-17): ok, nenhuma correção

- **Scripts rodados de verdade.** O HTML foi aberto num navegador, com os scripts originais executando. As 41 saídas de
  `cenario_padrao.saidas_renderizadas` foram comparadas por hash com o `innerHTML` e o `textContent` ao vivo, e as 41
  batem. Isso inclui `cmp-c2 = 3` e `cmp-c3 = 4` na tela, o que confirma `div-m09-inst02-contadores`.
- **Dados literais.** Os 19 `dados_literais` foram reavaliados da fonte (`eval` do trecho `linhas`) e são iguais ao JSON
  em profundidade: FLUXO, NODE, CLS, COMP, txt, LEI, MOD, REQ, HZ, VOL, FLEX, IDX, SUB, RISCOS, CONTRATOS, M, Q, ET e
  LD.
- **Código.** As 407 linhas de código existem na fonte na linha declarada (±3). O que sobra fora delas nos blocos é só
  comentário, dado literal e chave de fechamento.
- **Enumerações recalculadas:**
  - INST·05: 288 combinações, distribuição {0:16, 1:56, 2:84, 3:74, 4:42, 5:14, 6:2};
  - INST·09: 729 = 1 ok + 672 att + 56 per (24/24/8);
  - INST·07: os 6 cenários;
  - INST·08: os 9 ramos;
  - INST·04: "novembro de 2027" e "novembro de 2028" saem de `addMonths('11/2025', 24/36)`.
