# M13 · grupo "instrumentos"

Fonte (só leitura): `C:/dev/GridAlpha v2/Alexandria modulos/alexandria_modulo13.html` (4.267 linhas). Saída: [`instrumentos.json`](instrumentos.json). Extrator: [`extratores/m13_instrumentos.mjs`](extratores/m13_instrumentos.mjs).
Camada **fonte**: todo texto entre aspas ou em tabela saiu do JSON, e o JSON saiu do HTML por programa; nada foi
digitado nem parafraseado. `L` é a linha aproximada no HTML-fonte. As divergências ficam com as duas leituras, e
nenhuma é resolvida aqui (P17–P24 valem só na camada de produto).

**Método.** Markup por parser próprio; dados por avaliação em vm dos literais `var NOME=[…]` de cada bloco /* INST·NN */; fórmulas, ramos e rótulos copiados do código por programa (`codigo`, `codigo_texto`); `modelo_legivel` é conversão mecânica da concatenação JS ("…{expr}…"). Cenário-padrão, cobertura cartesiana e alcance de ramos medidos executando o script original em DOM simulado (a única alteração é o marcador `__ramo(k)` inserido após cada `cls=`, só na varredura).

**Estado no código.** 0 portados, 11 não portados e 0 divergentes. alexandria-modulo-13-content.ts: `instruments: []` nas 8 aulas (comentário "INSTRUMENTOS: NÃO PORTADOS NESTA WAVE"); nenhuma entrada m13 em alexandria-instrument-calculators.ts; RecursosDoModulo.tsx sem modulo-13; catálogo canônico: "13 \| 11 \| 0".
Como nada foi portado, não há comparação por execução contra `alexandria-instrument-calculators.ts`. O porte futuro
deve usar o código do script de cada item (transliteração mecânica, protocolo §10). Atenção: `script.codigo` só é verbatim
inteiro nos instrumentos numéricos (`codigo_verbatim: true`). Nos outros, os literais de dados foram trocados por marcador
(ver `script.codigo_nota`), e o texto integral está nas linhas `script.linha_inicio`–`linha_fim` do HTML.

**Cobertura por token** (markup / strings do script): INST·01 100% (108/108) / 100% (2.348/2.348); INST·02 100% (161/161) / 100% (385/385); INST·03 100% (284/284) / 100% (299/299); INST·04 100% (113/113) / 100% (785/785); INST·05 100% (128/128) / 100% (564/564); INST·06 100% (103/103) / 100% (899/899); INST·07 100% (74/74) / 100% (317/317); INST·08 100% (193/193) / 100% (416/416); INST·09 100% (104/104) / 100% (972/972); INST·10 100% (110/110) / 100% (620/620); INST·11 100% (147/147) / 100% (2.910/2.910).

## Os 11 instrumentos

| Id | Título (span.nm) | Onde | Invocação (ponto do texto) | Kind sugerido | Mecânica | Fonte dos números | Código |
|---|---|---|---|---|---|---|---|
| INST·01 | "Painel de controle setorial" | §MAP (L813), **fora de aula** | depois de p.srcnote L809 (…"atro destes dez mudaram de estado nos doze meses anteriores."); antes de h3 L848 | explorador | Dois seletores segmentados (lente; ordenação) + grade de 10 empresas → texto revelado; nenhuma saída numérica. | null | não portado |
| INST·02 | "Calculadora de múltiplo com alavancagem" | Aula 01, em 01.3 (L1000–1060) | depois de p L993 (…"lassificar qualquer coisa sem cruzar pelo menos dois sinais."); antes de h3 L1062; menções: "É por isso que o instrumento a seguir se recusa a classificar qualquer coisa sem cruzar pelo menos dois sinais" (a01 L997) | calculadora | 6 campos numéricos (par number+range) → 6 saídas + veredito de 6 ramos. | null | não portado |
| INST·03 | "Simulador de DCF de concessão com prazo definido" | Aula 02, em 02.4 (L1254–1339) | depois de div.lv L1221 (…"agens que produzem erros de sinal contrário e não se anulam."); antes de div.box.gd L1341; menções: "todos são entradas editáveis nos instrumentos deste módulo" (a02 L1180) | simulador | 8 campos numéricos → 6 saídas + 4 barras de sensibilidade + veredito de 4 ramos. | parcial | não portado |
| INST·04 | "Roteiro cronometrado de leitura" | Aula 03, em 03.2 (L1385–1408) | depois de p L1377 (…"calibração de momento. O critério de uma hora exige os dois."); antes de h3 L1410 | explorador | 1 seletor (documento) + grade de etapas → texto revelado. | null | não portado |
| INST·05 | "Verificador de lacuna" | Aula 03, em 03.4 (L1441–1467) | depois de p L1438 (…"ente o que torna a habilidade treinável em vez de intuitiva."); antes de p L1469; menções: "As cinco categorias que o instrumento percorre" (a03 L1469) | explorador | Grade de 6 trechos + seletor de vista (3) → texto revelado. Nome "Verificador" fora do enum; mecânica de consulta. | null | não portado |
| INST·06 | "Classificador de arquétipo de controle" | Aula 04, em 04.3 (L1588–1608) | depois de div.box.cy L1579 (…"completude só aparece exatamente quando importa: numa crise."); antes de h3 L1610 | explorador | Grade de 12 casos → arquétipo e textos revelados. Nome "Classificador" fora do enum; a classificação é tabela fixa, não cálculo. | null | não portado |
| INST·07 | "Comparador de participação e voto" | Aula 04, em 04.4 (L1671–1688) | depois de div.lv L1643 (…"o menos informativo quando há divergência entre as classes."); antes de div.box.gd L1690 | comparador | Grade de 5 situações → duas colunas lado a lado (participação × voto) + nota. | null | não portado |
| INST·08 | "Régua de estrutura de capital e cobertura" | Aula 05, em 05.4 (L1804–1874) | depois de div.box.rd L1795 (…"aparece exatamente no cenário em que ele importa: o adverso."); antes de h3 L1876 | simulador | 8 campos numéricos → 6 saídas + veredito de 6 ramos (base × choque). | null | não portado |
| INST·09 | "Matriz de risco em duas lentes" | Aula 06, em 06.1 (L1957–1981) | depois de p L1951 (…"trumento abaixo percorre as oito categorias nas duas lentes."); antes de h3 L1983; menções: "O instrumento abaixo percorre as oito categorias nas duas lentes" (a06 L1954) | explorador | Seletor de lente (2) + grade de 8 riscos → texto revelado (16 combinações). | null | não portado |
| INST·10 | "Comparador empresa × indicador" | Aula 07, em 07.1 (L2218–2244) | depois de p L2213 (…"ue o mesmo rótulo significa coisas diferentes em cada linha."); antes de h3 L2246; menções: "mais um instrumento comparativo que cobre as quatro restantes por indicador" (a07 L2109); "entram pelo instrumento comparativo" (a07 L2214) | comparador | Seletor de indicador (5) → tabela das 10 empresas lado a lado + ressalva. | null | não portado |
| INST·11 | "Andaime de tese de investimento · instrumento assinatura" | Aula 08, em 08.2 (L2335–2365) | depois de div.t333 L2314 (…"a resposta não muda nada, não era lacuna — era curiosidade."); antes de h3 L2367; menções: "o Andaime de Tese de Investimento da Aula 08" (tese L720); "o Andaime da Aula 08 é o instrumento que a constrói" (a07 L2116); "usando o Andaime da Aula 08" (a07 L2131); "O que o Andaime pergunta antes de assinar" (caso L2446); "o andaime de três teses" (caso L2448) | explorador | Grade de 6 empresas + navegação de 3 blocos → 3 itens revelados. Mesmo verbo do M12 INST 11 ("Andaime de conversa", mapeado como explorador); mecânica confirmada por leitura: consulta, sem cálculo. | null | não portado |

Por aula: §MAP 1, Aula 01 1, Aula 02 1, Aula 03 2, Aula 04 2, Aula 05 1, Aula 06 1, Aula 07 1, Aula 08 1. Kind sugerido: explorador 6, calculadora 1, simulador 2, comparador 2.
O kind é anotação desta extração pela taxonomia, não texto da fonte. Nenhum instrumento tem pergunta própria (`pergunta: null`), e nenhum declara tolerância (`tolerancias: null`).

## INST·01 — "Painel de controle setorial"

- **Onde:** §MAP, fora de aula (Recursos do Módulo). Cabeçalho em L814. Script L3379–3477: `/* ===================== INST·01 — PAINEL DE CONTROLE SETORIAL ===================== */`.
- **Pergunta:** `null`. A fonte não dá pergunta própria ao instrumento. O que existe é a intro (abaixo) e, em alguns, a "Pergunta de verificação" como saída.
- **Intro:** "Escolha uma lente e uma empresa. A mesma companhia lida por controle, por capital e por lacuna produz três diagnósticos diferentes — e é a sobreposição dos três, não qualquer um deles isolado, que sustenta uma tese. Alterne também a ordenação para ver que o ranking muda de significado conforme a dimensão." (L818)
- **Aviso (p.disc):** "Instrumento de classificação estrutural. Não atribui valor, não ordena por atratividade e não devolve recomendação. A ordenação por evento usa a data do último fato societário relevante verificado, não a data de divulgação de resultado." (L842)
- **Mecânica:** Dois seletores segmentados (lente; ordenação) + grade de 10 empresas → texto revelado; nenhuma saída numérica. Anotação desta extração pela taxonomia (docs/alexandria/instrument-taxonomy.md): mecânica lida no markup e no script, não inferida pelo nome.

**Controles (3).**

- `pn-seg` "Lente ativa", segmentado (um botão ativo): "Controle" [`ctrl`] (inicial), "Capital" [`cap`], "Lacuna" [`lac`]
- `pn-ord` "Ordenar as dez por", segmentado (um botão ativo): "Arquétipo de controle" [`arq`] (inicial), "Segmento" [`seg`], "Evento mais recente" [`ev`]
- `pn-grid` (sem rótulo: Sem rótulo próprio; o seg-lb anterior ("Ordenar as dez por") pertence ao controle pn-ord.), chips gerados por script (um ativo; o primeiro nasce ativo): ver cenario_padrao / dados

**Dados (literais do script, avaliados em vm):** `LENTES` (L3382, 3 chaves: ctrl, cap, lac); `EMP` (L3387, 10 itens); `ORD` (L3429, 3 chaves: arq, seg, ev). O texto revelado está todo nesses literais.

**Cenário-padrão** (Estado após o carregamento, com o script original executado em DOM simulado (m13_lib.runScript).):

- `pn-lens`: "Lente ativa" / "Lente de controle" / "A lente de controle pergunta quem decide, de fato, quando a decisão é difícil. Ela não se resolve com a tabela de participação: exige verificar composição por classe de ação, acordo de acionistas arquivado, limitação est…"
- `pn-item`: "Controle · Estatal com voto limitado" / "AXIA Energia" / "Companhia sem controlador único desde a capitalização e privatização de 2022. A União mantém participação relevante no capital total, com direitos de voto estatutariamente limitados a um teto. Termo de conciliação homolo…"

**Espaço de entrada (script original executado, espaço inteiro):** combinacoes_clicadas = 90; paineis_nao_vazios = 90; pares_lente_empresa_distintos = 30; esperado = "3 lentes × 10 empresas = 30 pares".

**Fonte dos números:** `null`. Valores e estados societários em texto; o §MAP declara "Estado societário verificado em 2 de agosto de 2026" (p.srcnote L809) e manda confirmar na página de RI e na CVM. Nenhuma fonte por item.
**Tolerâncias:** `null`. Nenhuma tolerância declarada na fonte.
**Código:** não portado.

## INST·02 — "Calculadora de múltiplo com alavancagem"

- **Onde:** Aula 01 (`section#a01`, rótulo "Múltiplos"). Cabeçalho em L1001. Script L3478–3527: `/* ===================== INST·02 — CALCULADORA DE MÚLTIPLO COM ALAVANCAGEM ===================== */`.
- **Pergunta:** `null`. A fonte não dá pergunta própria ao instrumento. O que existe é a intro (abaixo) e, em alguns, a "Pergunta de verificação" como saída.
- **Intro:** "Informe valor de mercado, dívida líquida, EBITDA e a parcela do EBITDA consumida por despesa financeira e impostos. O instrumento devolve EV/EBITDA e P/E lado a lado — e um diagnóstico que recusa dizer "caro" ou "barato" a partir de um múltiplo isolado. Todos os valores são editáveis: nenhum deles é constante do setor." (L1005)
- **Aviso (p.disc):** "O lucro implícito é uma aproximação didática: EBITDA menos depreciação menos despesa financeira, tributado à alíquota informada. Não substitui a demonstração de resultado real, que contém equivalência patrimonial, resultado de participações, marcação a mercado e efeitos regulatórios. O instrumento existe para mostrar o sentido do efeito, não para produzir o número de nenhuma companhia específica." (L1054)
- **Mecânica:** 6 campos numéricos (par number+range) → 6 saídas + veredito de 6 ramos. Anotação desta extração pela taxonomia (docs/alexandria/instrument-taxonomy.md): mecânica lida no markup e no script, não inferida pelo nome.

**Entradas (6).** Par `number` + `range` gêmeo, lido pelo script com `numOf(el, padrão, mín, máx)`.

| Id | Variável | Rótulo | Unidade | Faixa (number) | Passo | Padrão | Script | Coerência (range / script) |
|---|---|---|---|---|---|---|---|---|
| mu-eq-n | eq | "Valor de mercado do capital próprio" | R$ bi | 0.5–120 | 0.5 | 30 | `var eq=numOf($id('mu-eq-n'),30,0.5,120);` | true / true |
| mu-dl-n | dl | "Dívida líquida" | R$ bi | 0–120 | 0.5 | 25 | `var dl=numOf($id('mu-dl-n'),25,0,120);` | true / true |
| mu-eb-n | eb | "EBITDA dos últimos doze meses" | R$ bi | 0.2–45 | 0.1 | 10 | `var eb=numOf($id('mu-eb-n'),10,0.2,45);` | true / true |
| mu-jf-n | jf | "Despesa financeira sobre EBITDA" | % | 0–95 | 1 | 30 | `var jf=numOf($id('mu-jf-n'),30,0,95);` | true / true |
| mu-da-n | da | "Depreciação sobre EBITDA" | % | 0–80 | 1 | 25 | `var da=numOf($id('mu-da-n'),25,0,80);` | true / true |
| mu-tx-n | tx | "Alíquota efetiva de tributos" | % | 0–45 | 1 | 34 | `var tx=numOf($id('mu-tx-n'),34,0,45);` | true / true |

**Saídas (6), com a expressão exata do script.**

| Id | Rótulo | Código |
|---|---|---|
| mu-ev | "Enterprise value" | `$id('mu-ev').innerHTML=fmt(ev,1)+'<span class="u">R$ bi</span>';` |
| mu-ee | "EV / EBITDA" | `$id('mu-ee').innerHTML=fmt(ee,1)+'<span class="u">×</span>';` |
| mu-pe | "P / E" | `$id('mu-pe').innerHTML=(lucro>0?fmt(pe,1)+'<span class="u">×</span>':'n.d.');` |
| mu-al | "Dívida líq. / EBITDA" | `$id('mu-al').innerHTML=fmt(al,2)+'<span class="u">×</span>';` |
| mu-de | "Dívida sobre EV" | `$id('mu-de').textContent=fmt(de,0)+'% do valor da firma';` |
| mu-lu | "Lucro implícito" | `$id('mu-lu').textContent=(lucro>0?'R$ '+fmt(lucro,2)+' bi':'prejuízo de R$ '+fmt(Math.abs(lucro),2)+' bi');` |

**Cálculo** (Linhas de cálculo do upd() na ordem do script (sem as leituras numOf, que estão em entradas[].script_numOf, e sem o veredito, em ramos_veredito). Algumas linhas vêm depois das primeiras saídas no script original (ex.: c1–c4 no INST·03).):

```js

var ev=eq+dl;
var ee=ev/eb;
var al=dl/eb;
var de=dl/ev*100;
var ebit=eb*(1-da/100);
var lai=ebit-eb*(jf/100);
var lucro=lai>0?lai*(1-tx/100):lai;
var pe=lucro>0?eq/lucro:NaN;
```

**Ramos do veredito (6), na ordem do script.** O texto completo está em `ramos_veredito[].codigo_texto` (verbatim) e `modelo_legivel`.

| # | Condição | Classe | Início do texto (modelo legível) |
|---|---|---|---|
| 1 | `lucro<=0` | per | "<b>Preço sobre lucro indefinido — e isso é informação, não falha do instrumento.</b> Com despesa financeira de {fmt(jf,0)}% do resultado operacional e depreciaç"… |
| 2 | `al>=4 && ee>=8` | per | "<b>Dois sinais na mesma direção, e é a combinação que importa.</b> Alavancagem de {fmt(al,2)} vezes com valor da firma a {fmt(ee,1)} vezes o resultado operacion"… |
| 3 | `al>=4` | att | "<b>Alavancagem alta com múltiplo contido — combinação que exige a terceira pergunta.</b> Dívida líquida de {fmt(al,2)} vezes o resultado operacional e valor da"… |
| 4 | `ee>=8 && al<2` | att | "<b>Múltiplo elevado com alavancagem baixa — sinais em direções opostas.</b> Com dívida líquida de apenas {fmt(al,2)} vezes o resultado operacional, os {fmt(ee,1"… |
| 5 | `ee<5 && al<3` | ok | "<b>Múltiplo baixo com alavancagem contida — e ainda assim não é conclusão.</b> Valor da firma a {fmt(ee,1)} vezes com dívida líquida de {fmt(al,2)} vezes. É a c"… |
| 6 | `else` | ok | "<b>Faixa intermediária nos dois sinais.</b> Valor da firma a {fmt(ee,1)} vezes o resultado operacional, alavancagem de {fmt(al,2)} vezes, dívida representando {"… |

**Cenário-padrão** (Estado após o carregamento, com o script original executado em DOM simulado (m13_lib.runScript).):

- `mu-ev`: "55,0R$ bi"
- `mu-ee`: "5,5×"
- `mu-pe`: "10,1×"
- `mu-al`: "2,50×"
- `mu-de`: "45% do valor da firma"
- `mu-lu`: "R$ 2,97 bi"
- `mu-vd`: "Faixa intermediária nos dois sinais. Valor da firma a 5,5 vezes o resultado operacional, alavancagem de 2,50 vezes, dívida representando 45% do valor da firma, e preço sobre lucro de 10,1 vezes. Nenhum dos dois sinais es…"

**Espaço de entrada (script original executado):** 15.625 combinações (Varredura por grade (5 pontos por campo: mín, padrão, 25%, 50%, máx) com o script original instrumentado só para registrar o ramo (`__ramo(k)` após cada `cls=`). Indica ramos alcançáveis; não é prova de cobertura total.). Ramos atingidos: 1→4.375, 2→3.330, 3→720, 4→540, 5→4.590, 6→2.070.

**Fonte dos números:** `null`. Cenário-padrão sem fonte: a própria intro diz "Todos os valores são editáveis: nenhum deles é constante do setor." e o aviso chama o lucro implícito de "aproximação didática".
**Tolerâncias:** `null`. Nenhuma tolerância declarada na fonte.
**Código:** não portado.

## INST·03 — "Simulador de DCF de concessão com prazo definido"

- **Onde:** Aula 02 (`section#a02`, rótulo "DCF de concessão"). Cabeçalho em L1255. Script L3528–3590: `/* ===================== INST·03 — DCF DE CONCESSÃO COM PRAZO DEFINIDO ===================== */`.
- **Pergunta:** `null`. A fonte não dá pergunta própria ao instrumento. O que existe é a intro (abaixo) e, em alguns, a "Pergunta de verificação" como saída.
- **Intro:** "Todas as entradas são editáveis, inclusive a taxa livre de risco — que é derivada da Selic corrente e da inflação projetada, ambas declaradas com fonte e data no painel abaixo, e nenhuma delas cravada no código. O instrumento devolve o valor presente, a contribuição de cada componente e a sensibilidade a cada entrada isolada." (L1259)
- **Aviso (p.disc):** "Modelo em termos reais, com fluxo e taxa na mesma base — nunca misture um fluxo real com uma taxa nominal. O resultado é valor da firma, não valor do capital próprio: dele ainda se deduz dívida líquida, provisões e participação de não controladores, e se somam ativos não operacionais. Não é modelo de nenhuma companhia específica e não produz preço-alvo." (L1334)
- **Mecânica:** 8 campos numéricos → 6 saídas + 4 barras de sensibilidade + veredito de 4 ramos. Anotação desta extração pela taxonomia (docs/alexandria/instrument-taxonomy.md): mecânica lida no markup e no script, não inferida pelo nome.
- **Caixas internas:** "Âncora das taxas · declarada, não presumida": "Selic meta em 2 de agosto de 2026: 14,25% ao ano, fixada na reunião do Copom de 17 de junho de 2026 (Banco Central do Brasil). Inflação projetada para o fim de 2026 pelo boletim de expectativas de julho de 2026: 5,16%. Taxa livre de risco real implícita por Fisher: ≈ 8,6%. Altere os dois campos abaixo sempre que a data de leitura for diferente da data de verificação."

**Entradas (8).** Par `number` + `range` gêmeo, lido pelo script com `numOf(el, padrão, mín, máx)`.

| Id | Variável | Rótulo | Unidade | Faixa (number) | Passo | Padrão | Script | Coerência (range / script) |
|---|---|---|---|---|---|---|---|---|
| dc-se-n | se | "Selic nominal (ou taxa livre de risco nominal)" | % a.a. | 2–25 | 0.25 | 14.25 | `var se=numOf($id('dc-se-n'),14.25,2,25);` | true / true |
| dc-ip-n | ip | "Inflação projetada" | % a.a. | 0–15 | 0.1 | 5.16 | `var ip=numOf($id('dc-ip-n'),5.16,0,15);` | true / true |
| dc-pr-n | pr | "Prêmio sobre a taxa livre de risco real" | p.p. | 0–10 | 0.1 | 0.5 | `var pr=numOf($id('dc-pr-n'),0.5,0,10);` | true / true |
| dc-hz-n | hz | "Anos remanescentes de concessão" | anos | 1–40 | 1 | 20 | `var hz=Math.round(numOf($id('dc-hz-n'),20,1,40));` | true / true |
| dc-f1-n | f1 | "Fluxo de caixa livre real no ano 1" | R$ mi | 50–6000 | 10 | 900 | `var f1=numOf($id('dc-f1-n'),900,50,6000);` | true / true |
| dc-gr-n | gr | "Crescimento real do fluxo" | % a.a. | -4–6 | 0.1 | 1 | `var gr=numOf($id('dc-gr-n'),1,-4,6);` | true / true |
| dc-in-n | ind | "Indenização estimada no termo" | R$ mi | 0–12000 | 50 | 1200 | `var ind=numOf($id('dc-in-n'),1200,0,12000);` | true / true |
| dc-pi-n | pi | "Probabilidade de recebimento da indenização" | % | 0–100 | 5 | 70 | `var pi=numOf($id('dc-pi-n'),70,0,100);` | true / true |

**Saídas (6), com a expressão exata do script.**

| Id | Rótulo | Código |
|---|---|---|
| dc-tx | "Taxa real de desconto" | `$id('dc-tx').innerHTML=fmt(taxa*100,2)+'<span class="u">% a.a.</span>';` |
| dc-vo | "VP dos fluxos operacionais" | `$id('dc-vo').innerHTML=fmt(b.vo,0)+'<span class="u">R$ mi</span>';` |
| dc-vi | "VP da indenização esperada" | `$id('dc-vi').innerHTML=fmt(b.vi,0)+'<span class="u">R$ mi</span>';` |
| dc-ev | "Valor da firma simplificado" | `$id('dc-ev').innerHTML=fmt(b.tot,0)+'<span class="u">R$ mi</span>';` |
| dc-pw | "Peso da indenização" | `$id('dc-pw').textContent=fmt(b.vi/b.tot*100,1)+'% do valor total';` |
| dc-pp | "Se fosse perpetuidade" | `$id('dc-pp').textContent=(isFinite(perp)?'R$ '+fmt(perp,0)+' mi · '+fmt(perp/b.tot,1)+'× o valor correto':'indefinido: crescimento ≥ taxa');` |

**Cálculo** (Linhas de cálculo do upd() na ordem do script (sem as leituras numOf, que estão em entradas[].script_numOf, e sem o veredito, em ramos_veredito). Algumas linhas vêm depois das primeiras saídas no script original (ex.: c1–c4 no INST·03).):

```js
function vp(taxa,hz,f1,gr,ind,pi){
    var vo=0;
    for(var t=1;t<=hz;t++){
      var f=f1*Math.pow(1+gr/100,t-1);
      vo+=f/Math.pow(1+taxa,t);
    }
    var vi=(ind*pi/100)/Math.pow(1+taxa,hz);
    return {vo:vo,vi:vi,tot:vo+vi};
  }
var rreal=(1+se/100)/(1+ip/100)-1;
var taxa=rreal+pr/100;
if(taxa<=0.001)taxa=0.001;
var b=vp(taxa,hz,f1,gr,ind,pi);
var perp=(taxa-gr/100)>0.002?f1/(taxa-gr/100):NaN;
var c1=vp(Math.max(taxa-0.01,0.001),hz,f1,gr,ind,pi).tot;
var c3=vp(taxa+0.01,hz,f1,gr,ind,pi).tot;
var c4=vp(taxa,Math.max(hz-5,1),f1,gr,ind,pi).tot;
var mx=Math.max(c1,b.tot,c3,c4,1);
var dtaxa=(c1-c3)/b.tot*100;
var dhz=(b.tot-c4)/b.tot*100;
var pesoInd=b.vi/b.tot*100;
```

**Barras (4):** "Taxa −1 p.p." → `$id('dc-s1').style.width=clamp(c1/mx*100,2,100)+'%'; $id('dc-v1').textContent=fmt(c1,0);`; "Cenário base" → `$id('dc-s2').style.width=clamp(b.tot/mx*100,2,100)+'%'; $id('dc-v2').textContent=fmt(b.tot,0);`; "Taxa +1 p.p." → `$id('dc-s3').style.width=clamp(c3/mx*100,2,100)+'%'; $id('dc-v3').textContent=fmt(c3,0);`; "Horizonte −5 anos" → `$id('dc-s4').style.width=clamp(c4/mx*100,2,100)+'%'; $id('dc-v4').textContent=fmt(c4,0);`.

**Ramos do veredito (4), na ordem do script.** O texto completo está em `ramos_veredito[].codigo_texto` (verbatim) e `modelo_legivel`.

| # | Condição | Classe | Início do texto (modelo legível) |
|---|---|---|---|
| 1 | `pesoInd>=25` | per | "<b>A indenização responde por {fmt(pesoInd,1)}% do valor — e ela é a premissa menos verificável do modelo.</b> Com horizonte de {hz} anos e probabilidade de rec"… |
| 2 | `hz<=7` | att | "<b>Horizonte curto: {hz} anos.</b> Reduzir cinco anos derruba o valor em {fmt(dhz,1)}%, o que é a maior sensibilidade individual deste modelo. Em concessão com"… |
| 3 | `Math.abs(dtaxa)>=22` | att | "<b>Modelo dominado pela taxa: um ponto percentual para cada lado move o valor em {fmt(Math.abs(dtaxa),1)}%.</b> Com horizonte de {hz} anos e taxa real de {fmt(t"… |
| 4 | `else` | ok | "<b>Modelo equilibrado entre os componentes.</b> Valor da firma simplificado de R$ {fmt(b.tot,0)} milhões, dos quais {fmt(pesoInd,1)}% vêm da indenização esperad"… |

**Cenário-padrão** (Estado após o carregamento, com o script original executado em DOM simulado (m13_lib.runScript).):

- `dc-tx`: "9,14% a.a."
- `dc-vo`: "8.708R$ mi"
- `dc-vi`: "146R$ mi"
- `dc-ev`: "8.854R$ mi"
- `dc-pw`: "1,6% do valor total"
- `dc-pp`: "R$ 11.051 mi · 1,2× o valor correto"
- `dc-v1`: "9.562"
- `dc-v2`: "8.854"
- `dc-v3`: "8.225"
- `dc-v4`: "7.824"
- `dc-vd`: "Modelo equilibrado entre os componentes. Valor da firma simplificado de R$ 8.854 milhões, dos quais 1,6% vêm da indenização esperada e o restante dos fluxos operacionais até o termo. Sensibilidade de 15,1% a um ponto per…"

**Espaço de entrada (script original executado):** 6.561 combinações (Varredura por grade (3 pontos por campo: mín, padrão, máx), script original instrumentado só para registrar o ramo.). Ramos atingidos: 1→1.217, 2→1.377, 3→651, 4→3.316.

**Fonte dos números:** parcial. Declarados: Selic 14,25% a.a. (Copom de 17/06/2026, Banco Central do Brasil) e inflação 5,16% (boletim de expectativas de julho de 2026), no box "Âncora das taxas" L1264-1271. Sem fonte: prêmio 0,5 p.p., horizonte 20 anos, fluxo ano 1 R$ 900 mi, crescimento 1%, indenização R$ 1.200 mi, probabilidade 70%. O aviso declara "Não é modelo de nenhuma companhia específica e não produz preço-alvo."
**Tolerâncias:** `null`. Nenhuma tolerância declarada na fonte.
**Código:** não portado.

## INST·04 — "Roteiro cronometrado de leitura"

- **Onde:** Aula 03 (`section#a03`, rótulo "Leitura de documento"). Cabeçalho em L1386. Script L3591–3662: `/* ===================== INST·04 — ROTEIRO CRONOMETRADO DE LEITURA ===================== */`.
- **Pergunta:** `null`. A fonte não dá pergunta própria ao instrumento. O que existe é a intro (abaixo) e, em alguns, a "Pergunta de verificação" como saída.
- **Intro:** "Escolha o documento e a etapa. O instrumento devolve o que procurar, onde procurar, e — o mais importante — qual pergunta essa etapa precisa deixar respondida antes de você avançar. Se a pergunta ficar aberta, não avance: anote como lacuna e siga." (L1390)
- **Aviso (p.disc):** "Os tempos são referência de treino, não regra. O que não é negociável é a ordem: perímetro antes de operação, operação antes de resultado, resultado antes de caixa, caixa antes de dívida, e síntese apenas no fim. Ler o destaque da capa primeiro é a forma mais eficiente de ancorar a leitura na narrativa da administração." (L1403)
- **Mecânica:** 1 seletor (documento) + grade de etapas → texto revelado. Anotação desta extração pela taxonomia (docs/alexandria/instrument-taxonomy.md): mecânica lida no markup e no script, não inferida pelo nome.

**Controles (2).**

- `rt-seg` "Documento", segmentado (um botão ativo): "Release trimestral · 30 min" [`rel`] (inicial), "Formulário de Referência · 60 min" [`fre`]
- `rt-grid` (sem rótulo: Sem rótulo próprio; o seg-lb anterior ("Documento") pertence ao controle rt-seg.), chips gerados por script (um ativo; o primeiro nasce ativo): ver cenario_padrao / dados

**Dados (literais do script, avaliados em vm):** `ETAPAS` (L3594, 2 chaves: rel, fre). O texto revelado está todo nesses literais.

**Cenário-padrão** (Estado após o carregamento, com o script original executado em DOM simulado (m13_lib.runScript).):

- `rt-item`: "0-3 min · Release trimestral" / "Perímetro e contexto" / "Data, trimestre, moeda, escopo de consolidação e — o item que quase todo mundo pula — mudanças de perímetro desde o período comparativo. Uma aquisição, uma alienação ou a entrada em operação de um ativo relevante tornam …"

**Espaço de entrada (script original executado, espaço inteiro):** combinacoes_clicadas = 15; paineis_nao_vazios = 15; esperado = "7 etapas (release) + 8 (Formulário) = 15".

**Fonte dos números:** `null`. Tempos por etapa sem fonte; o aviso diz "Os tempos são referência de treino, não regra."
**Tolerâncias:** `null`. Nenhuma tolerância declarada na fonte.
**Código:** não portado.

## INST·05 — "Verificador de lacuna"

- **Onde:** Aula 03 (`section#a03`, rótulo "Leitura de documento"). Cabeçalho em L1442. Script L3663–3714: `/* ===================== INST·05 — VERIFICADOR DE LACUNA ===================== */`.
- **Pergunta:** `null`. A fonte não dá pergunta própria ao instrumento. O que existe é a intro (abaixo) e, em alguns, a "Pergunta de verificação" como saída.
- **Intro:** "Cada trecho abaixo é um fragmento hipotético de release ou de Formulário de Referência, construído para ser verdadeiro, completo em si mesmo e insuficiente. Escolha um e identifique a categoria de lacuna. O instrumento devolve a categoria, a pergunta exata a fazer à área de relações com investidores, e como a resposta mudaria a conclusão." (L1446)
- **Aviso (p.disc):** "Todos os trechos são hipotéticos e construídos para o exercício. Nenhum é transcrição de documento de companhia real, e nenhuma categoria de lacuna implica irregularidade: lacuna é ausência de informação necessária para decidir, não indício de que algo esteja errado. A divulgação pode estar integralmente conforme a norma e ainda deixar a lacuna aberta." (L1462)
- **Mecânica:** Grade de 6 trechos + seletor de vista (3) → texto revelado. Nome "Verificador" fora do enum; mecânica de consulta. Anotação desta extração pela taxonomia (docs/alexandria/instrument-taxonomy.md): mecânica lida no markup e no script, não inferida pelo nome.

**Controles (2).**

- `lc-seg` "Ver por", segmentado (um botão ativo): "Categoria e diagnóstico" [`cat`] (inicial), "Pergunta a fazer" [`perg`], "Impacto na conclusão" [`imp`]
- `lc-grid` "Trecho a analisar", chips gerados por script (um ativo; o primeiro nasce ativo): ver cenario_padrao / dados

**Dados (literais do script, avaliados em vm):** `CASOS` (L3666, 6 itens). O texto revelado está todo nesses literais.

**Cenário-padrão** (Estado após o carregamento, com o script original executado em DOM simulado (m13_lib.runScript).):

- `lc-item`: "Trecho 01 · Categoria e diagnóstico" / "Garantias constituídas" / "Trecho hipotético"A Companhia mantém garantias reais e fidejussórias constituídas em favor de credores no âmbito de contratos de financiamento de suas controladas, conforme detalhado nas notas explicativas.""

**Espaço de entrada (script original executado, espaço inteiro):** combinacoes_clicadas = 18; paineis_nao_vazios = 18; esperado = "6 trechos × 3 vistas = 18"; nota = "A prosa após o instrumento (L1469) fala em "cinco categorias que o instrumento percorre" e numa "sexta" (caixa restrito); o instrumento tem os seis trechos, g6 incluído.".

**Fonte dos números:** `null`. O aviso declara: "Todos os trechos são hipotéticos e construídos para o exercício."
**Tolerâncias:** `null`. Nenhuma tolerância declarada na fonte.
**Código:** não portado.

## INST·06 — "Classificador de arquétipo de controle"

- **Onde:** Aula 04 (`section#a04`, rótulo "Lente de controle"). Cabeçalho em L1589. Script L3715–3775: `/* ===================== INST·06 — CLASSIFICADOR DE ARQUÉTIPO DE CONTROLE ===================== */`.
- **Pergunta:** `null`. A fonte não dá pergunta própria ao instrumento. O que existe é a intro (abaixo) e, em alguns, a "Pergunta de verificação" como saída.
- **Intro:** "Escolha uma empresa do rol — ou um dos dois casos hipotéticos ao fim da lista. O instrumento devolve o arquétipo, quem decide de fato, o comportamento esperado sob estresse e a pergunta de verificação que precisa ser respondida antes de aceitar a classificação. Produto cartesiano completo: os seis arquétipos são todos alcançáveis." (L1593)
- **Aviso (p.disc):** "Classificação estrutural para leitura de risco. Não avalia se o arranjo de controle é bom ou ruim, não julga decisões de nenhum controlador e não implica qualquer qualidade do investimento. Arquétipo de controle é dado de entrada da análise, não conclusão." (L1604)
- **Mecânica:** Grade de 12 casos → arquétipo e textos revelados. Nome "Classificador" fora do enum; a classificação é tabela fixa, não cálculo. Anotação desta extração pela taxonomia (docs/alexandria/instrument-taxonomy.md): mecânica lida no markup e no script, não inferida pelo nome.

**Controles (1).**

- `ct-grid` "Empresa ou caso", chips gerados por script (um ativo; o primeiro nasce ativo): ver cenario_padrao / dados

**Dados (literais do script, avaliados em vm):** `ARQ` (L3718, 6 chaves: estvl, estsub, estrpriv, patroc, semctrl, jv); `CASOS` (L3744, 12 itens). O texto revelado está todo nesses literais.

**Cenário-padrão** (Estado após o carregamento, com o script original executado em DOM simulado (m13_lib.runScript).):

- `ct-item`: "Arquétipo identificado" / "Estatal com voto limitado" / "Quem decide de fato. Administração profissional, com participação estatal relevante cujo poder de voto está limitado por estatuto ou por acordo firmado no momento da desestatização. A influência do Estado, quando se rest…"
- `ct-out`: "Comportamento sob estresseSob estresse, a tensão aparece entre disciplina de capital e prioridade de política pública. Disputas migram para o Judiciário em vez de se resolverem em assembleia, e o desfecho é mais lento e …" / "Pergunta de verificaçãoQual o teto estatutário de voto, e existe termo de conciliação, acordo de investimento ou decisão judicial que altere a composição de conselho ou obrigações societárias?" / "O que não concluirArquétipo de controle é dado de entrada da análise, nunca conclusão sobre a qualidade da companhia. Nenhum dos seis é melhor que outro em abstrato: cada um é mais adequado a um horizonte e a uma tolerân…"

**Espaço de entrada (script original executado, espaço inteiro):** casos_clicados = 12; saidas_nao_vazias = 12; arquetipos_alcancados = "Estatal com voto limitado", "Estatal subnacional", "Controlador estrangeiro privado majoritário", "Patrocinador financeiro", "Corporação sem controlador definido", "Associação com dois controladores coordenados"; esperado = ""os seis arquétipos são todos alcançáveis" (intro)".

**Fonte dos números:** `null`. Classificação das 10 empresas sem fonte por item; nota de AXIA "Verificado em 02·08·2026". Dois casos declarados hipotéticos (h1, h2).
**Tolerâncias:** `null`. Nenhuma tolerância declarada na fonte.
**Código:** não portado.

## INST·07 — "Comparador de participação e voto"

- **Onde:** Aula 04 (`section#a04`, rótulo "Lente de controle"). Cabeçalho em L1672. Script L3776–3823: `/* ===================== INST·07 — COMPARADOR DE PARTICIPAÇÃO E VOTO ===================== */`.
- **Pergunta:** `null`. A fonte não dá pergunta própria ao instrumento. O que existe é a intro (abaixo) e, em alguns, a "Pergunta de verificação" como saída.
- **Intro:** "Cinco situações em que os dois números divergem — ou não. Escolha uma e veja os dois lados declarados separadamente, com o mecanismo que produz a divergência e a consequência prática para leitura de risco." (L1676)
- **Aviso (p.disc):** "Percentuais aproximados, com data de verificação declarada em cada caso. Estruturas societárias mudam. Todo battlecard que cite participação deve declarar qual das duas grandezas está sendo citada e em que data foi verificada." (L1684)
- **Mecânica:** Grade de 5 situações → duas colunas lado a lado (participação × voto) + nota. Anotação desta extração pela taxonomia (docs/alexandria/instrument-taxonomy.md): mecânica lida no markup e no script, não inferida pelo nome.

**Controles (1).**

- `pv-grid` (sem rótulo: —), chips gerados por script (um ativo; o primeiro nasce ativo): ver cenario_padrao / dados

**Dados (literais do script, avaliados em vm):** `CASOS` (L3779, 5 itens). O texto revelado está todo nesses literais.

**Cenário-padrão** (Estado após o carregamento, com o script original executado em DOM simulado (m13_lib.runScript).):

- `pv-dual`: "Participação econômica adquirida" / "68% do capital total" / "Fatia do resultado e do patrimônio que passou a pertencer ao comprador privado. Em qualquer conta de valor econômico, é este número que importa."
- `pv-note`: "Mecanismo e consequência" / "Operadora nuclear · 2026" / "Mecanismo: classes de ações com direitos distintos, somadas a exigência setorial de controle. A operação foi anunciada em outubro de 2025, aprovada pelo Cade em dezembro, liberada pela renúncia ao direito de preferência …"

**Espaço de entrada (script original executado, espaço inteiro):** casos_clicados = 5; saidas_nao_vazias = 5; esperado = ""Cinco situações" (intro)".

**Fonte dos números:** `null`. O aviso diz "Percentuais aproximados, com data de verificação declarada em cada caso", mas só p1 traz datas no texto (out 2025 – mar 2026); p2-p4 não têm data e p5 é "Caso hipotético".
**Tolerâncias:** `null`. Nenhuma tolerância declarada na fonte.
**Código:** não portado.

## INST·08 — "Régua de estrutura de capital e cobertura"

- **Onde:** Aula 05 (`section#a05`, rótulo "Project finance"). Cabeçalho em L1805. Script L3824–3879: `/* ===================== INST·08 — RÉGUA DE ESTRUTURA DE CAPITAL E COBERTURA ===================== */`.
- **Pergunta:** `null`. A fonte não dá pergunta própria ao instrumento. O que existe é a intro (abaixo) e, em alguns, a "Pergunta de verificação" como saída.
- **Intro:** "Informe investimento total, proporção de dívida, custo real, prazo e o caixa disponível para o serviço da dívida no primeiro ano. O instrumento devolve o serviço da dívida, o índice de cobertura e o comportamento sob choque — e o veredito cruza cobertura com folga até o gatilho de bloqueio de dividendos, recusando classificar por um único sinal." (L1809)
- **Aviso (p.disc):** "Serviço da dívida calculado como parcela constante — o exemplo didático mais simples. Em estrutura real, a amortização é esculpida para acompanhar o CFADS, o que muda o perfil ano a ano e exige cálculo em todos os períodos, não só no primeiro. O instrumento não substitui modelo horário, sazonalidade, conta-reserva de manutenção, degradação do ativo, perfil de juros durante a obra e ordem mensal de uso do caixa." (L1868)
- **Mecânica:** 8 campos numéricos → 6 saídas + veredito de 6 ramos (base × choque). Anotação desta extração pela taxonomia (docs/alexandria/instrument-taxonomy.md): mecânica lida no markup e no script, não inferida pelo nome.

**Entradas (8).** Par `number` + `range` gêmeo, lido pelo script com `numOf(el, padrão, mín, máx)`.

| Id | Variável | Rótulo | Unidade | Faixa (number) | Passo | Padrão | Script | Coerência (range / script) |
|---|---|---|---|---|---|---|---|---|
| ds-cx-n | cx | "Investimento total do projeto" | R$ mi | 100–9000 | 10 | 2100 | `var cx=numOf($id('ds-cx-n'),2100,100,9000);` | true / true |
| ds-al-n | alv | "Proporção financiada por dívida" | % | 0–90 | 1 | 70 | `var alv=numOf($id('ds-al-n'),70,0,90);` | true / true |
| ds-kd-n | kd | "Custo real da dívida" | % a.a. | 1–16 | 0.1 | 7.5 | `var kd=numOf($id('ds-kd-n'),7.5,1,16);` | true / true |
| ds-pz-n | pz | "Prazo de amortização" | anos | 3–30 | 1 | 15 | `var pz=Math.round(numOf($id('ds-pz-n'),15,3,30));` | true / true |
| ds-cf-n | cf | "CFADS no ano 1" | R$ mi | 10–1200 | 1 | 235 | `var cf=numOf($id('ds-cf-n'),235,10,1200);` | true / true |
| ds-mn-n | mn | "DSCR mínimo de covenant" | × | 1–2.5 | 0.05 | 1.25 | `var mn=numOf($id('ds-mn-n'),1.25,1,2.5);` | true / true |
| ds-lk-n | lk | "Gatilho de bloqueio de dividendos" | × | 1–3 | 0.05 | 1.35 | `var lk=numOf($id('ds-lk-n'),1.35,1,3);` | true / true |
| ds-ch-n | ch | "Choque de estresse sobre o CFADS" | % | 0–45 | 1 | 10 | `var ch=numOf($id('ds-ch-n'),10,0,45);` | true / true |

**Saídas (6), com a expressão exata do script.**

| Id | Rótulo | Código |
|---|---|---|
| ds-dv | "Dívida sênior" | `$id('ds-dv').innerHTML=fmt(dv,0)+'<span class="u">R$ mi</span>';` |
| ds-eq | "Capital próprio" | `$id('ds-eq').innerHTML=fmt(eq,0)+'<span class="u">R$ mi</span>';` |
| ds-sv | "Serviço da dívida ano 1" | `$id('ds-sv').innerHTML=fmt(sv,1)+'<span class="u">R$ mi</span>';` |
| ds-d0 | "DSCR base" | `$id('ds-d0').innerHTML=fmt(d0,2)+'<span class="u">×</span>';` |
| ds-d1 | "DSCR sob choque" | `$id('ds-d1').innerHTML=fmt(d1,2)+'<span class="u">×</span>';` |
| ds-be | "Choque até o mínimo" | `$id('ds-be').textContent=(quedaMin>0?fmt(quedaMin,1)+'% de queda no CFADS':'já abaixo do mínimo');` |

**Cálculo** (Linhas de cálculo do upd() na ordem do script (sem as leituras numOf, que estão em entradas[].script_numOf, e sem o veredito, em ramos_veredito). Algumas linhas vêm depois das primeiras saídas no script original (ex.: c1–c4 no INST·03).):

```js
function servico(dv,kd,pz){
    var i=kd/100;
    if(i<=0)return dv/pz;
    return dv*i/(1-Math.pow(1+i,-pz));
  }
var dv=cx*alv/100, eq=cx-dv;
var sv=servico(dv,kd,pz);
var d0=sv>0?cf/sv:NaN;
var cfc=cf*(1-ch/100);
var d1=sv>0?cfc/sv:NaN;
var quedaMin=cf>0?(1-(mn*sv)/cf)*100:NaN;
var folgaLk=d0-lk, folgaMn=d0-mn;
```

**Ramos do veredito (6), na ordem do script.** O texto completo está em `ramos_veredito[].codigo_texto` (verbatim) e `modelo_legivel`.

| # | Condição | Classe | Início do texto (modelo legível) |
|---|---|---|---|
| 1 | `lk<mn` | per | "<b>Parâmetros contratuais incoerentes: o gatilho de bloqueio de dividendos ({fmt(lk,2)}×) está abaixo do mínimo de covenant ({fmt(mn,2)}×).</b> Nessa configuraç"… |
| 2 | `folgaMn<=0` | per | "<b>Cobertura de {fmt(d0,2)}× já no cenário base, abaixo do mínimo de {fmt(mn,2)}×.</b> Isso caracteriza inadimplemento técnico desde o primeiro ano, e a estrutu"… |
| 3 | `d1<mn` | per | "<b>Dois sinais cruzados, e o segundo é o que decide.</b> No cenário base a cobertura é de {fmt(d0,2)}×, acima do mínimo — mas um choque de {fmt(ch,0)}% no caixa"… |
| 4 | `d1<lk` | att | "<b>Resiste ao mínimo, não resiste ao bloqueio.</b> Cobertura base de {fmt(d0,2)}× e de {fmt(d1,2)}× sob choque de {fmt(ch,0)}%: acima do mínimo de {fmt(mn,2)}×"… |
| 5 | `folgaLk>=0.35 && alv<=70` | ok | "<b>Folga em ambos os sinais.</b> Cobertura base de {fmt(d0,2)}× e de {fmt(d1,2)}× sob choque de {fmt(ch,0)}%, ambas acima do gatilho de bloqueio de {fmt(lk,2)}×"… |
| 6 | `else` | ok | "<b>Cobertura adequada com folga estreita — e as duas coisas precisam ser ditas juntas.</b> Base de {fmt(d0,2)}×, choque de {fmt(ch,0)}% levando a {fmt(d1,2)}×,"… |

**Cenário-padrão** (Estado após o carregamento, com o script original executado em DOM simulado (m13_lib.runScript).):

- `ds-dv`: "1.470R$ mi"
- `ds-eq`: "630R$ mi"
- `ds-sv`: "166,5R$ mi"
- `ds-d0`: "1,41×"
- `ds-d1`: "1,27×"
- `ds-be`: "11,4% de queda no CFADS"
- `ds-vd`: "Resiste ao mínimo, não resiste ao bloqueio. Cobertura base de 1,41× e de 1,27× sob choque de 10%: acima do mínimo de 1,25× e abaixo do gatilho de 1,35×. O projeto continua adimplente e o capital próprio para de receber. …"

**Espaço de entrada (script original executado):** 6.561 combinações (Varredura por grade (3 pontos por campo: mín, padrão, máx), script original instrumentado só para registrar o ramo.). Ramos atingidos: 1→2.187, 2→1.584, 3→106, 4→163, 5→535, 6→1.986.

**Fonte dos números:** `null`. Padrões sem fonte declarada. Observação (não é fonte): 2.100 e 70% reproduzem a tabela hipotética de fontes e usos da Aula 05 (L1756-1763: dívida 1.470, capital 630 — o que o instrumento devolve no padrão) e a heurística 70/30 (05.2); 1,25× coincide com o Ex 04 e o quiz Q07. CFADS 235, custo 7,5%, prazo 15, gatilho 1,35× e choque 10% não aparecem em outro ponto da fonte.
**Tolerâncias:** `null`. Nenhuma tolerância declarada na fonte.
**Código:** não portado.

## INST·09 — "Matriz de risco em duas lentes"

- **Onde:** Aula 06 (`section#a06`, rótulo "Riscos"). Cabeçalho em L1958. Script L3880–3941: `/* ===================== INST·09 — MATRIZ DE RISCO EM DUAS LENTES ===================== */`.
- **Pergunta:** `null`. A fonte não dá pergunta própria ao instrumento. O que existe é a intro (abaixo) e, em alguns, a "Pergunta de verificação" como saída.
- **Intro:** "Escolha uma categoria de risco e alterne entre a lente de empresa e a lente de projeto. Cada combinação devolve como o risco se manifesta, o que o mitiga, e o indicador de alerta — o sinal observável que aparece antes do problema. Produto cartesiano completo: oito riscos por duas lentes, dezesseis combinações, nenhuma vazia." (L1962)
- **Aviso (p.disc):** "Classificação de risco para leitura estrutural. Não estima probabilidade, não atribui severidade em escala e não substitui a seção de fatores de risco do Formulário de Referência da companhia específica — que é sempre a fonte primária." (L1977)
- **Mecânica:** Seletor de lente (2) + grade de 8 riscos → texto revelado (16 combinações). Anotação desta extração pela taxonomia (docs/alexandria/instrument-taxonomy.md): mecânica lida no markup e no script, não inferida pelo nome.

**Controles (2).**

- `rk-seg` "Lente", segmentado (um botão ativo): "Empresa aberta" [`emp`] (inicial), "Sociedade de projeto" [`prj`]
- `rk-grid` (sem rótulo: Sem rótulo próprio; o seg-lb anterior ("Lente") pertence ao controle rk-seg.), chips gerados por script (um ativo; o primeiro nasce ativo): ver cenario_padrao / dados

**Dados (literais do script, avaliados em vm):** `R` (L3883, 8 itens). O texto revelado está todo nesses literais.

**Cenário-padrão** (Estado após o carregamento, com o script original executado em DOM simulado (m13_lib.runScript).):

- `rk-item`: "Empresa aberta" / "Risco hidrológico" / "Manifesta-se como variação de resultado: geração abaixo da garantia física obriga a companhia a comprar energia no mercado de curto prazo para honrar contratos, com custo que não estava no orçamento. Numa geradora divers…"
- `rk-out`: "MitigaçãoDiversificação de fontes e de bacias; desenho contratual que aloque o risco de forma explícita; sazonalização; e dimensionamento da dívida em percentil adverso de geração, não no cenário central." / "Indicador de alertaGeração acumulada abaixo da garantia física por dois trimestres consecutivos; elevação do custo de compra de energia para revenda na demonstração de resultado."

**Espaço de entrada (script original executado, espaço inteiro):** combinacoes_clicadas = 16; paineis_nao_vazios = 16; esperado = ""oito riscos por duas lentes, dezesseis combinações, nenhuma vazia" (intro)".

**Fonte dos números:** `null`. Classificação qualitativa; o aviso diz que não estima probabilidade nem severidade.
**Tolerâncias:** `null`. Nenhuma tolerância declarada na fonte.
**Código:** não portado.

## INST·10 — "Comparador empresa × indicador"

- **Onde:** Aula 07 (`section#a07`, rótulo "Fichas de empresa"). Cabeçalho em L2219. Script L3942–4027: `/* ===================== INST·10 — COMPARADOR EMPRESA × INDICADOR ===================== */`.
- **Pergunta:** `null`. A fonte não dá pergunta própria ao instrumento. O que existe é a intro (abaixo) e, em alguns, a "Pergunta de verificação" como saída.
- **Intro:** "Escolha um indicador. A tabela reordena as dez empresas vivas por aquela dimensão e devolve, além do valor, a ressalva que impede a comparação direta — porque em quase todos os casos existe uma. Produto cartesiano completo: dez empresas por cinco indicadores." (L2223)
- **Aviso (p.disc):** "Ordenação para leitura estrutural. Não é ranking de qualidade, de atratividade nem de risco relativo, e a ordem não implica preferência. Os valores têm trimestre declarado e exigem reconstrução na fonte primária antes de uso externo — a coluna de ressalva existe justamente porque a comparação direta entre linhas é, na maior parte dos casos, indevida." (L2239)
- **Mecânica:** Seletor de indicador (5) → tabela das 10 empresas lado a lado + ressalva. Anotação desta extração pela taxonomia (docs/alexandria/instrument-taxonomy.md): mecânica lida no markup e no script, não inferida pelo nome.

**Controles (1).**

- `cp-seg` "Indicador", segmentado (um botão ativo): "Controle" [`ctrl`] (inicial), "Modelo de negócio" [`seg`], "Alavancagem" [`alav`], "Resultado" [`ind`], "Evento societário" [`ev`]

**Dados (literais do script, avaliados em vm):** `E` (L3945, 10 itens); `NOTA` (L4007, 5 chaves: ctrl, seg, alav, ind, ev); `TIT` (L4014, 5 chaves: ctrl, seg, alav, ind, ev). O texto revelado está todo nesses literais.

**Cenário-padrão** (Estado após o carregamento, com o script original executado em DOM simulado (m13_lib.runScript).):

- `cp-tab`: "EmpresaControlador" / "AXIA EnergiaSem controlador único; União com voto limitado por estatutoParticipação, voto e assentos de conselho divergem entre si" / "CemigGoverno do Estado de Minas GeraisFatia do votante maior que a do capital total"
- `cp-note`: "Ressalva de comparabilidade" / "Controlador" / "A comparação mais legítima da tabela — e a única que não depende de trimestre. Arquétipo de controle é estrutural: muda por evento societário, não por resultado. Repare que três companhias compartilham o mesmo arquétipo …"

**Espaço de entrada (script original executado, espaço inteiro):** indicadores_clicados = 5; tabelas_com_10_linhas = 5; celulas = 50; celulas_com_valor_e_ressalva = 50; esperado = ""dez empresas por cinco indicadores" (intro)".

**Fonte dos números:** `null`. Valores com trimestre declarado por linha (1T26, 2T26, exercício 2025, ano-safra 2025/26); o aviso manda reconstruir na fonte primária antes de uso externo. Sem fonte por célula.
**Tolerâncias:** `null`. Nenhuma tolerância declarada na fonte.
**Código:** não portado.

## INST·11 — "Andaime de tese de investimento · instrumento assinatura"

- **Onde:** Aula 08 (`section#a08`, rótulo "Síntese"). Cabeçalho em L2336. Script L4028–4144: `/* ===================== INST·11 — ANDAIME DE TESE DE INVESTIMENTO ===================== */`.
- **Pergunta:** `null`. A fonte não dá pergunta própria ao instrumento. O que existe é a intro (abaixo) e, em alguns, a "Pergunta de verificação" como saída.
- **Intro:** "Escolha uma das seis empresas com ficha e um dos três blocos. O andaime devolve três itens estruturados — cada um com âncora e contraponto declarados — não como resposta a ser copiada, mas como modelo de forma. O conteúdo dos itens deriva da estrutura verificável de cada companhia; a peça analítica final continua sendo sua, e o objetivo do treino é produzir os nove sem consultar este painel, em menos de uma hora." (L2340)
- **Aviso (p.disc):** "Este instrumento não emite recomendação de compra, venda ou manutenção, não define preço-alvo e não projeta retorno. Toda saída é diagnóstico de estrutura: alavancagem, controlador, evento pendente, informação ausente — e o que isso implica para quem avalia. As teses são hipóteses a testar, formuladas com contraponto explícito precisamente para não serem lidas como conclusão." (L2359)
- **Mecânica:** Grade de 6 empresas + navegação de 3 blocos → 3 itens revelados. Mesmo verbo do M12 INST 11 ("Andaime de conversa", mapeado como explorador); mecânica confirmada por leitura: consulta, sem cálculo. Anotação desta extração pela taxonomia (docs/alexandria/instrument-taxonomy.md): mecânica lida no markup e no script, não inferida pelo nome.

**Controles (2).**

- `an-nav` "Bloco", segmentado (um botão ativo): "Teses" / "3 itens" [`tese`] (inicial), "Riscos" / "3 itens" [`risco`], "Lacunas" / "3 itens" [`lacuna`]
- `an-grid` "Empresa", chips gerados por script (um ativo; o primeiro nasce ativo): ver cenario_padrao / dados

**Dados (literais do script, avaliados em vm):** `A` (L4031, 6 chaves: axia, cemig, engie, eneva, eqtl, raiz); `ORDEM` (L4111, 6 itens); `ROT` (L4114, 3 chaves: tese, risco, lacuna). O texto revelado está todo nesses literais.

**Cenário-padrão** (Estado após o carregamento, com o script original executado em DOM simulado (m13_lib.runScript).):

- `an-bd`: "AXIA Energia" / "Três teses de investimento" / "Escala e diversificação convertidas em caixa livreÂncora: Resultado operacional ajustado de ordem de R$ 8,5 bi no 1T26 contra investimento de cerca de R$ 1,4 bi no mesmo trimestre, com alavancagem divulgada entre 1,8× e …"

**Espaço de entrada (script original executado, espaço inteiro):** combinacoes_clicadas = 18; itens_renderizados = 54; esperado = "6 empresas × 3 blocos × 3 itens = 54".

**Fonte dos números:** `null`. Itens derivados "da estrutura verificável de cada companhia" (intro); números repetem as fichas da Aula 07 (1T26 etc.). Sem fonte por item.
**Tolerâncias:** `null`. Nenhuma tolerância declarada na fonte.
**Código:** não portado.

## Divergências registradas neste grupo (9)

| Id | Eixo | Sev. | Leitura A | Leitura B |
|---|---|---|---|---|
| div-m13-taxa-real-8-6-vs-8-7 | fonte × fonte | alta | Aula 02, fórmula "Conversão entre taxa nominal e taxa real" (L1214-1218): "a taxa real implícita é de aproximadamente 8,7% ao ano — não 9,09%" e "a diferença […] passa de meio ponto percentual". | INST·03 box "Âncora das taxas" (L1269): "≈ 8,6%"; Ex 03: "≈ 8,64%" e "um erro de cerca de 0,45 ponto percentual"; o script calcula (1,1425/1,0516)−1 = 8,64%. 9,09 − 8,64 = 0,45 < 0,5. |
| div-m13-riscos-seis-vs-oito | fonte × fonte | media | Aula 06, h2: "Seis categorias de risco, e a sexta é a que o currículo não nomeia"; lede: cinco riscos + dimensão socioambiental, omitindo crédito; INST·09 (cred): "A sexta categoria". | Aula 06 (L1954) e INST·09: "oito categorias"/"oito riscos" — hidrológico, regulatório, cambial, descasamento, operacional, construção, mercado e recontratação, crédito (sem socioambiental). O §Lex (Família 8) tem sete termos de risco (inclui socioambiental; não tem construção nem mercado). |
| div-m13-inst06-h2-mecanismo | fonte × fonte | media | INST·06 caso h2 "Hipotética · 68% do total, 35% do voto" → arquétipo "Estatal com voto limitado", "construído sobre o padrão real da operadora nuclear". | INST·07 p1 e Aula 04: na operadora nuclear o mecanismo é "classes de ações com direitos distintos, somadas a exigência setorial de controle"; "limitação estatutária de voto" é o mecanismo da AXIA (INST·07 p2). A classificação do h2 usa o arquétipo do outro mecanismo. |
| div-m13-axia-estatal | fonte × fonte | baixa | Arquétipo da AXIA: "Estatal com voto limitado" (§MAP.1, ficha, INST·01, INST·06). | §MAP.1 (L851-853): a AXIA "não é estatal nem é uma privada comum"; ficha: "Companhia sem controlador único". |
| div-m13-inst07-datas | fonte × fonte | baixa | INST·07 aviso: "Percentuais aproximados, com data de verificação declarada em cada caso." | Só o caso p1 tem datas; p2, p3 e p4 não declaram data; p5 é hipotético. |
| div-m13-inst05-cinco-seis | fonte × fonte | baixa | Aula 03 (L1469): "As cinco categorias que o instrumento percorre […] Há uma sexta […] caixa restrito". | INST·05 percorre seis trechos (g6 = caixa restrito por sociedade de projeto). |
| div-m13-auren-alavancagem | fonte × fonte | baixa | INST·10 (Auren): "≈ 5,2× · a mais alta entre as abertas do rol". | INST·10/ficha (Raízen, RAIZ4): "≈ 5,2×" também; no §MAP a Raízen está no estado "Reestruturação", não "Aberta" — a frase só se sustenta com essa leitura de "abertas". |
| div-m13-numof-vazio | comportamento do script | baixa | Durante a digitação (evento input), campo vazio ou inválido vale o PADRÃO do campo (`numOf(el, def, …)`). | No evento change, campo vazio vira o MÍNIMO (`pair`: `if(isNaN(v))v=mn`). O mesmo campo vazio produz dois valores conforme o evento. Resíduo do original; não corrigido. |
| div-m13-instrumentos-codigo | fonte × código × catálogo | alta | Fonte: 11 instrumentos (INST·01 no §MAP; Aulas 03 e 04 com dois cada). | Código: 0 portados (`instruments: []`, sem calculadora, sem Recursos do Módulo). Catálogo canônico: "13 \| 11 \| 0". Concordam entre si; divergem da fonte. |

## Contagens

| Item | Contagem |
|---|---|
| instrumentos | 11 |
| fora_de_aula | 1 |
| de_aula | 10 |
| por_aula | {"§MAP":1,"Aula 01":1,"Aula 02":1,"Aula 03":2,"Aula 04":2,"Aula 05":1,"Aula 06":1,"Aula 07":1,"Aula 08":1} |
| por_kind_sugerido | {"explorador":6,"calculadora":1,"simulador":2,"comparador":2} |
| numericos | 3 |
| campos_numericos | 22 |
| saidas_numericas | 18 |
| ramos_de_veredito | 16 |
| portados | 0 |
| nao_portados | 11 |
| divergentes | 0 |


## Verificação

Verificação adversarial de 2026-09-17, feita com scripts próprios contra o HTML-fonte.

- **Fórmulas, 100%.** 69 expressões dos três instrumentos numéricos (INST·02 20, INST·03 27, INST·08 22) foram
  conferidas como substrings exatas do script, sem nenhuma falha.
  - Entram as linhas de `calculo.linhas`, os `codigo_saida` e os `script_numOf.codigo`.
  - O cenário-padrão do INST·02 foi recalculado à mão e bate: EV 55,0, EV/EBITDA 5,5, P/E 10,1, alavancagem 2,50 e
    dívida 45%.
- **Distribuição.** A distribuição por seção confere:
  - §MAP 1;
  - Aulas 01, 02, 05, 06, 07 e 08 com 1 cada;
  - Aulas 03 e 04 com 2 cada.

  Confere também `instruments: []` nas 8 aulas do código.
- **Correção (código do script).** O README e este arquivo diziam que `script.codigo` era verbatim, mas isso só vale
  para os 3 instrumentos numéricos.
  - Nos outros 8 (INST·01, 04, 05, 06, 07, 09, 10 e 11), o extrator troca os literais de dados por
    `/* literal NOME: ver dados.NOME */`, e isso não estava declarado.
  - Agora cada `script` traz `codigo_verbatim` e, quando o valor é `false`, também `codigo_nota`.
  - O extrator `m13_instrumentos.mjs` foi corrigido, e o conteúdo do código não mudou.
- **Divergências.** Estas foram conferidas na fonte e todas se sustentam: taxa real, riscos 6×8, AXIA, Vibra,
  arquétipo JV, cinco/seis lacunas, Auren 5,2× e numOf.
