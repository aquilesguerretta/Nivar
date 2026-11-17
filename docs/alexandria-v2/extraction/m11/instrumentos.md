# M11 · grupo "instrumentos"

Fonte (só leitura): `C:/dev/GridAlpha v2/Alexandria modulos/alexandria_modulo11.html`. O `<script>` vai de L3043 a
L3962; os blocos dos instrumentos ocupam L3109–3841. Saída: [`instrumentos.json`](instrumentos.json).

**Como foi extraído.** `extratores/m11_instrumentos.mjs` faz o trabalho em três frentes.

1. **Marcação.** Lê os 11 `div.inst` pela árvore: `.inst-hd` (id e nome), `p.inst-intro`, `.field` (number + range
   gêmeo), `.seg` (botões), `.ro` (readouts) e `p.srcnote`.
2. **Lógica.** Lê o bloco do script de cada instrumento, entre os cabeçalhos `/* ===== INST… ===== */`, em quatro
   partes:
   - linhas verbatim em `script.codigo_verbatim`;
   - literais de dados avaliados com `new Function` em `dados_do_script`;
   - fórmulas exatas em `saidas.formulas_exatas_script`;
   - cada `t.push(...)` e `cls=` com a cadeia de condições até ele, em `ramos_do_veredito`.
3. **Cenário-padrão e confronto.** Executa o `<script>` **original, sem reescrita**, num DOM simulado.
   - O cenário-padrão é o estado no carregamento.
   - O confronto roda o script em **3.387 casos** (grade de entradas) e compara com
     `INSTRUMENT_CALCULATORS` do código (empacotado com esbuild, só leitura).

**Verificação.** `m11_verify.mjs` conferiu 118 strings de marcação e 60 origens, sem falha. Também conferiu 148 ramos
(código presente no script), 353 literais de dados/quiz (idênticos aos literais avaliados) e os 11 blocos verbatim
(idênticos às linhas declaradas). A marcação estática dos 11 `div.inst` tem 99,8% de cobertura por token. As 3
palavras restantes ("progresso", "avaliação", "da") estão fora de campo de conteúdo.

## Regras desta camada

- **Pergunta própria: nenhuma.** Zero "?" em `inst-intro` e `srcnote`, então `pergunta = null` nos 11. A intenção
  declarada é o `intro` (literal). Pergunta de previsão é camada Alexandria (P3/P11/P19).
- **Tolerâncias: nenhuma declarada** (`null` nos 11). Os limiares dos ramos (`dev>30`, `delta<=0.1`, `gap>1.5`…)
  classificam o veredito; não são tolerância de resposta.
- **Fonte dos números: `null` nos 11.** A fonte não declara de onde vêm os `value=` nem os limiares.
  - O que ela declara está no `srcnote`: base normativa e data de consulta 1º/8/2026.
  - Inst · 06 e 08 dizem "Instrumento didático e ilustrativo"; o 07 diz "Instrumento didático".
  - P19: cenário didático sem fonte externa.
- **Nenhuma frase do texto invoca um instrumento.** O vínculo é só a posição do `div.inst`. O JSON registra o elemento
  imediatamente antes e depois.

## Quadro geral

| Id | Título (literal) | Onde | Mecânica | Status no código | Catálogo |
|---|---|---|---|---|---|
| Inst · 01 | Mapa da proposta — quatro lentes sobre a mesma estrutura | § MAP (L598) — instrumento de módulo | 2 seletores (lente × item) → 2 painéis de texto | divergente | abrevia |
| Inst · 02 | Separador de eixos — a que categoria pertence cada afirmação | Aula 01, após 01.4 (L797) | 1 seletor (12 afirmações) → painel | divergente | abrevia |
| Inst · 03 | Régua do marco regulatório — sete marcos com data, efeito e estado | Aula 02, após 02.4 (L990) | 1 navegação (7 marcos) → painel de 4 campos | divergente | abrevia |
| Inst · 04 | Classificador de porte e modalidade — produto cartesiano completo | Aula 03, após 03.2 (L1172) | 1 número + 2 seletores → 3 textos + veredito | divergente | abrevia |
| Inst · 05 | Roteador de regime — data de protocolo determina tudo | Aula 04, em 04.3 (L1391) | 3 seletores + ano → 3 textos + veredito | divergente | **idêntico** |
| Inst · 06 | Verificador de geração estimada — desvio contra referência independente | Aula 05, em 05.2 (L1547) | 4 números → 3 números + veredito | divergente | abrevia |
| Inst · 07 | Verificador de degradação declarada — planilha contra garantia do fabricante | Aula 05, em 05.3 (L1621) | 4 números → 3 números + veredito | divergente | abrevia |
| Inst · 08 | Verificador de trajetória tarifária — premissa contra ancoragem histórica | Aula 06, em 06.1 (L1785) | 3 números + 1 seletor → 3 números + veredito | divergente | abrevia |
| Inst · 09 | Anatomia dos oito sinais de alerta — sinal, fonte, conta, pergunta | Aula 07, em 07.3 (L2071) | 1 seletor (8 sinais) → painel de 4 campos | divergente | abrevia |
| Inst · 10 | Roteador de veredito — três classes, todas alcançáveis | Aula 08, em 08.2 (L2166) | 4 seletores (81 combinações) → classe + redação + próximo passo | divergente | abrevia |
| Inst · 11 | Ordem de avaliação em trinta minutos — duas trilhas sincronizadas | Aula 08, em 08.3 (L2232) | 1 navegação (8 passos) → painel + barras de tempo | divergente | **divergente** |

**Contagens.**
- 11 instrumentos: 1 no § MAP e 10 em aula (Aulas 05 e 08 com dois cada).
- Entradas: 13 campos numéricos, 11 seletores fixos e 5 grades dinâmicas (geradas pelo script).
- Saídas: 15 readouts, 6 vereditos e 97 parágrafos de veredito no script.
- O pill "11 instrumentos" confere.

**Status "portado / não portado / divergente".** Os 11 existem no código, então nenhum está "não portado". Nenhum é
"portado" sem ressalva, então os **11 são "divergentes"**.
- **Texto.** Os textos dos painéis e vereditos são **iguais** em 100% dos casos executados (3.387/3.387).
- **Números.** Os valores numéricos também são iguais: 7.965/7.965.
- **O que diverge** é a forma, conforme a tabela abaixo.

## Por instrumento

### Inst · 01 — Mapa da proposta (§ MAP, L598–629; script L3109–3180)
- **Entradas.** Seletor "Lente ativa" com 4 lentes (padrão `eixo`) e grade dinâmica "Item da proposta" com 10 itens
  (script `ITENS`; padrão `pot`, "Potência instalada").
- **Saídas.** `mp-lens` (texto da lente) e `mp-item` (resposta item × lente). São 40 células, todas literais em
  `dados_do_script.LENTES/ITENS`.
- **Cenário-padrão.** Lente "A que eixo pertence" × "Potência instalada", que devolve "Eixo 1 — físico. A potência é um
  dado do projeto, não uma projeção…".
- **Nota de fonte.** Lei 14.300/2022; REN 1.000/2021 (com 1.059/2023 e 1.098/2024); Portarias Inmetro 140/2022 e
  515/2023; Atlas 2ª ed.
- **Código.** `MODULO_11_INSTRUMENTOS` (módulo). Selects no lugar da grade; o `srcnote` não foi portado. **Não é
  renderizado:** `RecursosDoModulo.tsx` não tem `modulo-11`.

### Inst · 02 — Separador de eixos (Aula 01, L797–812; script L3181–3244)
- **Entrada.** Grade dinâmica "Afirmação da proposta" com 12 afirmações do script `A`; o padrão é a1, "Gera 1.750 kWh
  por kWp ao ano".
- **Saída.** `se-out`: eixo, "Método de verificação:" e "O que esta afirmação NÃO autoriza concluir:".
- **Sem `srcnote`.**
- **Achado.** A afirmação a12 está **sem acentos** no script (L3231, "Autoproducao por equiparacao e outro regime
  juridico…"), e o código herdou o texto (`div-m11-inst-01`).
- **Código.** Rótulo "Afirmação típica de proposta" × fonte "Afirmação da proposta". O `inst-intro` não foi portado.

### Inst · 03 — Régua do marco regulatório (Aula 02, L990–1009; script L3245–3314)
- **Entrada.** Navegação `rg-nav` pelos 7 marcos do script `M`; o padrão é m1, "2012". A navegação não tem rótulo na
  fonte, e o código usa "Marco".
- **Saída.** `rg-panel` com 4 campos: "Qual instrumento", "Desde quando", "O que mudou" e "Estado de regulamentação".
- **Nota de fonte.** REN 482/2012 (revogada), REN 1.000/2021, Lei 14.300/2022, REN 1.059/2023, REN 1.098/2024, CNPE
  2/2024, Lei 15.269/2025, TS ANEEL 23/2025.
- **Achado.** "Sete marcos" contra "seis instrumentos" do h2 da Aula 02 (`div-m11-inst-07`).

### Inst · 04 — Classificador de porte e modalidade (Aula 03, L1172–1219; script L3315–3389)
- **Entradas.**
  - "Potência instalada em corrente alternada" [kW], de 1 a 6000, padrão 180.
  - "Fonte e armazenamento": Solar sem baterias* / Solar com baterias qualificadas / Outra fonte despachável.
  - "Arranjo de titularidade descrito na proposta": Gera e consome na mesma unidade* / Outras unidades, mesmo titular /
    Titulares distintos em associação / Mesma propriedade, área comum.
- **Saídas** (script `MOD` + ramos).
  - "Classificação de porte" = `porte`.
  - "Teto de porte aplicável" = `tetoTx`.
  - "Modalidade regulatória" = `m.n`.
  - Veredito em parágrafos, com 14 ramos: `pot>teto`; regime agravado `pot>75&&pot<=teto&&!despachavel&&m.esp`; a
    garantia de fiel cumprimento `pot>1000` / `pot>500`…
- **Cenário-padrão.** Minigeração distribuída · "3 MW — fonte não despachável" · Autoconsumo local.
- **Achado (`div-m11-inst-02`, média).** Com `pot = 1000` exatos, o script exibe o ramo "acima de 500 kW e abaixo de
  1.000 kW… dois e meio por cento". O outro ramo diz "1.000 kW ou mais… cinco por cento", e o § Lex diz "a partir de
  1.000 kW". Isso foi confirmado executando o original.
- **Código.**
  - Os 3 textos não têm slot em `outputs` e vão no veredito com rótulo composto.
  - A classe `ok/att/per` é descartada (`void cls`).
  - Os rótulos "Fonte"/"Arranjo" não são literais.
  - `inst-intro` e `srcnote` não foram portados.

### Inst · 05 — Roteador de regime (Aula 04, L1391–1446; script L3390–3472)
- **Entradas.**
  - "Data de protocolo do pedido de acesso": Até 7 de janeiro de 2022* / 8 jan 2022 a 7 jan 2023 / 8 jan 2023 a 7 jul
    2023 / Após 7 de julho de 2023.
  - "Porte e fonte": Microgeração, até 75 kW* / Minigeração até 500 kW / Minigeração acima de 500 kW, não despachável.
  - "Modalidade e concentração do excedente": Autoconsumo local ou empreendimento com múltiplas unidades* / Remoto ou
    compartilhado, maior titular abaixo de 25% / Remoto ou compartilhado, maior titular com 25% ou mais.
  - "Ano de referência da leitura" [ano], de 2023 a 2032, padrão 2026.
- **Fórmulas.**
  - `var agravado = (d!=='ate2022'&&d!=='doze') && p==='mini500mais' && m==='conc';`
  - `var limiteArt17 = (d==='semestre')?2031:2029;`
  - A escada vem de `ESC`, com 6 chaves.
- **Saídas.**
  - "Classe de faturamento".
  - "Componentes de distribuição sobre a energia compensada".
  - "Estado da regra no ano informado".
  - Veredito (37 ramos).
- **Cenário-padrão.** "GD I — direito adquirido" · "0% até 31 de dezembro de 2045" · "Regra vigente e integralmente
  regulamentada".
- **Achados.**
  - O ramo `ano>2045` é **inalcançável**: o ano vai de 2023 a 2032 (`div-m11-inst-03`).
  - O intro pede a "fonte" como entrada separada, mas ela só existe embutida numa opção de porte (`div-m11-inst-04`).
- **Código.** O mesmo padrão do 04: textos no veredito, `void cls`, rótulos de porte e modalidade não literais,
  `inst-intro` e `srcnote` não portados.

### Inst · 06 — Verificador de geração estimada (Aula 05, L1547–1595; script L3473–3535)
- **Entradas.**
  - "Potência instalada declarada" [kWp], de 1 a 3000, padrão 100.
  - "Geração anual declarada na proposta" [MWh/ano], de 1 a 6000, padrão 175.
  - "Irradiação da localidade, plano dos módulos" [kWh/m²·dia], de 2 a 7,5 (passo 0,05), padrão 5,2.
  - "Desempenho global de referência adotado na conferência" [%], de 50 a 92, padrão 78.
- **Fórmulas exatas.**
  - `var refkWh=pot*irr*365*(pr/100);`
  - `var refMWh=refkWh/1000;`
  - `var dev=(ger*1000/refkWh-1)*100;`
  - `var prImp=(ger*1000)/(pot*irr*365)*100;`
- **Saídas.**
  - "Geração de referência reconstruída" = `fmt(refMWh,1)+' MWh/ano'`.
  - "Desvio da declarada sobre a referência" = `(dev>=0?'+':'')+fmt(dev,1)+'%'`.
  - "Desempenho global implícito na proposta" = `fmt(prImp,1)+'%'`.
- **Faixas do veredito, em ordem.** `prImp>95` → `dev>30` → `dev>15` → `dev>6` → `dev>=-12` → senão (30 ramos).
- **Cenário-padrão.** 148,0 MWh/ano · +18,2% · 92,2%, com o veredito "Desvio de 18,2 por cento acima da referência…".
- **Achado.** O rótulo "Potência instalada" com unidade kWp contra a definição do módulo, que reserva o nome à grandeza
  em CA (`div-m11-inst-08`).
- **Código.** Valores iguais (4.500/4.500), mas a exibição diverge em 4.003/4.500: o painel usa até 2 casas e não põe
  sinal. No padrão, "148,04 MWh/ano", "18,21 %" e "92,2 %". Além disso: `formula: null`, `void cls`, `inst-intro` e
  `srcnote` não portados.

### Inst · 07 — Verificador de degradação declarada (Aula 05, L1621–1669; script L3536–3605)
- **Entradas.**
  - "Degradação anual usada na proposta" [%/ano], de 0 a 2 (passo 0,05), padrão 0,4.
  - "Degradação máxima garantida no datasheet" [%/ano], de 0 a 2, padrão 0,55.
  - "Perda declarada no primeiro ano" [%], de 0 a 5, padrão 2.
  - "Horizonte da projeção da proposta" [anos], de 5 a 30, padrão 25.
- **Fórmulas.**
  - `serie(y1,d,hz)`: `p=(1-y1/100)*Math.pow(1-d/100,k-1)`; acumula `acc`; `fin` no ano `hz`.
  - `A=serie(y1,prop,hz)`, `B=serie(y1,ds,hz)`.
  - `gap=A.acc>0?((A.acc-B.acc)/A.acc*100):0`.
  - `delta=ds-prop`.
- **Saídas.**
  - "Produção final sob a premissa da proposta" = `fmt(A.fin*100,1)+'%'`.
  - "Produção final sob a garantia do fabricante" = `fmt(B.fin*100,1)+'%'`.
  - "Energia acumulada a menos no horizonte" = `(gap>=0?'':'')+fmt(gap,1)+'%'`. O prefixo é vazio nos dois ramos, um
    resíduo (`div-m11-inst-05`).
- **Faixas.** `prop===0` → `y1===0` → `delta<=0` → `delta<=0.1` → `delta<=0.3` → senão.
- **Cenário-padrão.** 89,0% · 85,9% · 1,8%, com "Divergência de 0,15 ponto percentual ao ano entre a planilha e o piso
  garantido. Faixa de atenção…".
- **Código.** Valores iguais (1.980/1.980); a exibição diverge em 1.706/1.980 ("89,01 %", "85,85 %", "1,76 %").
  `formula: null`, `void cls`.

### Inst · 08 — Verificador de trajetória tarifária (Aula 06, L1785–1836; script L3606–3664)
- **Entradas.**
  - "Reajuste anual assumido na proposta" [%/ano], de 0 a 20 (passo 0,25), padrão 9.
  - "Média histórica homologada da concessionária" [%/ano], de 0 a 20, padrão 6.
  - "Horizonte da projeção" [anos], de 5 a 30, padrão 20.
  - "O que a proposta declara sobre a premissa": Declara a taxa e a fonte da ancoragem* / Declara a taxa, sem dizer de
    onde veio / Não declara a taxa; ela está embutida.
- **Fórmulas.**
  - `ip=Math.pow(1+p/100,hz)`, `ih=Math.pow(1+h/100,hz)`.
  - `gap=p-h`.
  - `exc=(ip/ih-1)*100`.
- **Saídas.**
  - "Afastamento anual da ancoragem" = `(gap>=0?'+':'')+fmt(gap,2)+' p.p.'`.
  - "Índice final sob a premissa da proposta" = `fmt(ip*100,0)`.
  - "Excesso acumulado sobre a ancoragem" = `(exc>=0?'+':'')+fmt(exc,1)+'%'`.
- **Faixas.** `gap>1.5` → `gap>0.5` → `gap>=-0.5` → senão, com um parágrafo adicional para a ancoragem (`soi` /
  `nada` / senão).
- **Cenário-padrão.** +3,00 p.p. · 560 · +74,7%.
- **Código.** Valores iguais (1.485/1.485); a exibição diverge em 1.389/1.485 ("3 p.p.", "560,44", "74,75 %"). O
  rótulo do seletor não é literal. `formula: null`, `void cls`.

### Inst · 09 — Anatomia dos oito sinais (Aula 07, L2071–2091; script L3665–3723)
- **Entrada.** Grade dinâmica `sa-grid` com os 8 sinais (`S` + `ordem`); o padrão é "1 · Geração estimada exagerada".
- **Saída.** `sa-out` com 4 campos: "O que caracteriza o sinal", fonte independente, o que o comprador verifica e a
  pergunta ao vendedor.
- **Nota de fonte.** "Sinais conforme a tabela do currículo definitivo do Bloco 11…".
- **Código.** A grade não tem rótulo na fonte; o código usa "Sinal de alerta".

### Inst · 10 — Roteador de veredito (Aula 08, L2166–2211; script L3724–3770)
- **Entradas.** Quatro seletores, com o padrão marcado por *:
  - "Eixo 1 — premissa técnica": Confere com a fonte independente* / Desvio material identificado / Falta dado para
    verificar.
  - "Eixo 2 — enquadramento regulatório": Correto para o arranjo descrito* / Incompatível com o arranjo / Falta declarar
    data ou titularidade.
  - "Eixo 3 — premissa financeira": Declarada e ancorada* / Declarada sem ancoragem / Embutida por omissão.
  - "Eixo 4 — documentação contratual": Contrato completo e responde às cinco perguntas* / Contrato completo, com
    lacuna de responsabilidade / Contrato ou anexos não fornecidos.
- **Lógica.**
  - `insuf=(a==='falta')||(b==='falta')||(d==='ausente')`.
  - `prob=(a==='desvio')||(b==='erro')||(c==='solta')||(c==='omissa')||(d==='lacuna')`.
  - Precedência: `if(insuf)` → `else if(prob)` → senão, com 12 ramos. Os textos vêm de `E1`…`E4`.
- **Cenário-padrão.** "Proposta sólida nas duas trilhas".
- **Nota de fonte.** "Produto cartesiano completo de 81 combinações, com três classes de veredito alcançáveis e nenhuma
  célula órfã…". O confronto executou as 81 combinações, todas iguais no texto.
- **Código.** Os rótulos das opções dos Eixos 2–4 não são literais. `void cls`.

### Inst · 11 — Ordem de avaliação em trinta minutos (Aula 08, L2232–2253; script L3771–3841)
- **Entrada.** Navegação `or-nav` pelos 8 passos do script `P`; o padrão é "01 · Técnica".
- **Saídas.**
  - `or-panel`: "Passo NN · trilha X · minuto a ao b", título, "O que fazer", fonte e erro que previne.
  - `or-bars`: barras de tempo por passo.
- **Janelas.** 01 Técnica 0–3; 02 Contratual 0–3; 03 3–8; 04 8–12; 05 12–17; 06 17–22; 07 22–26; 08 26–30.
- **Pontos de sincronização.** `sinc:true` só nos passos 04 e 08.
- **Intro.** "Este é o instrumento assinatura do módulo…".
- **Achados.**
  - A Aula 08 diz **três** pontos de sincronização (`div-m11-inst-06`, alta).
  - A divisão de tempo difere da prosa de 08.3 (ver `modulo.json` `div-m11-03`).
  - O catálogo chama o instrumento de "— instrumento assinatura", que vem do intro, não do título
    (`div-m11-inst-09-catalogo-11`).
- **Código.** Rótulo "Passo" sem literal na fonte.

## Padrões fonte × código (todos os 11)

| Padrão | Instrumentos |
|---|---|
| Textos de painel e veredito idênticos ao original executado | 11/11 (3.387 casos) |
| Valores numéricos idênticos | 06, 07, 08 (7.965 saídas) |
| Exibição numérica diferente: até 2 casas, sem sinal `+`, espaço antes de `%` | 06, 07, 08 |
| Grade `.seg` com botões virou `select` | 01, 02, 03, 09, 11 (e os seletores de 04, 05, 08, 10) |
| Rótulo de campo ou opção não literal | 02, 03, 04, 05, 08, 09, 10, 11 |
| Saída de texto sem slot em `outputs`, embutida no veredito | 04, 05 |
| Classe do veredito (`ok`/`att`/`per`) descartada (`void cls`) | 04, 05, 06, 07, 08, 10 |
| `p.inst-intro` não portado no instrumento (`note: null`) | 02–11 |
| `p.srcnote` não portado | 01, 03–11 (o 02 não tem `srcnote`) |
| `formula: null` (a fonte só tem a fórmula no script, sem `div.formula`) | 06, 07, 08 |
| Não renderizado (sem `modulo-11` em `RecursosDoModulo.tsx`) | 01 |

## Catálogo canônico × fonte

Só o Inst · 05 tem o nome idêntico ao título. Nove nomes do catálogo são um **prefixo** do título da fonte, isto é,
omitem o complemento depois do travessão ou parte dele. O Inst · 11 diverge ("— instrumento assinatura" × "— duas
trilhas sincronizadas"). Detalhe em `instrumentos[*].comparacao_catalogo`.

## Divergências (instrumentos.json)

| id | Sev. | Resumo |
|---|---|---|
| `div-m11-inst-01-acentos` | baixa | Inst · 02 a12 sem acentos (L3231); o código herdou |
| `div-m11-inst-02-limiar-1000` | média | Inst · 04: com 1.000 kW, exibe 2,5% contra o texto de "1.000 kW ou mais" (5%) e o § Lex |
| `div-m11-inst-03-ramo-inalcancavel` | baixa | Inst · 05: `ano>2045` é inalcançável (ano limitado a 2023–2032) |
| `div-m11-inst-04-intro-fonte` | baixa | Inst · 05: o intro promete a entrada "fonte", que só existe embutida no porte > 500 kW |
| `div-m11-inst-05-residuo-gap` | baixa | Inst · 07: `(gap>=0?'':'')` não tem efeito |
| `div-m11-inst-06-sinc` | **alta** | Inst · 11 tem 2 pontos de sincronização; a Aula 08 diz 3 |
| `div-m11-inst-07-regua-seis-sete` | baixa | "sete marcos" × "seis instrumentos" |
| `div-m11-inst-08-unidade-pot` | baixa | Inst · 06 "Potência instalada" em kWp × definição em CA (kW) |
| `div-m11-inst-09-catalogo-11` | baixa | **(nova)** Nome do Inst · 11 no catálogo × título da fonte |

## Verificação (verificador adversarial, 2026-09-17)

- **Código e fórmulas.** Os 11 `codigo_verbatim` e todos os `codigo` de ramo, readout e leitura estão literais na fonte,
  na linha declarada (±3). Os trechos literais dos `texto_template` também estão, 147 de 147.
- **Posições.** As 11 posições (`div.inst`: MAP L598, a01 L797, a02 L990, a03 L1172, a04 L1391, a05 L1547/L1621,
  a06 L1785, a07 L2071, a08 L2166/L2232) conferem, assim como as contagens de campos (13), seletores `.seg` (11),
  readouts `.ro` (15) e vereditos (6).
- **Cenário-padrão do Inst · 06.** Recalculado à mão: 148,0 MWh/ano, +18,2% e 92,2%. Confere.
- **Divergências.** Todas procedem:
  - `inst-03`: o `max` de `rr-ano` é 2032, então `ano>2045` é inalcançável;
  - `inst-06`: só os passos 04 e 08 têm `sinc:true`;
  - `inst-01`: a a12 está sem acentos (L3231).
- **Correções.** Nenhuma neste grupo.
- **Não recalculado.** Os 3.387 casos confrontados com o código não foram reexecutados de forma independente.

## Verificação — segunda passada (verificador adversarial, 2026-09-17)

Conferência independente: todos os campos de código e fórmula dos 11 instrumentos são substrings da fonte na linha
declarada (±3); os textos de marcação (títulos, intro, srcnote, rótulos) são literais; as saídas do cenário-padrão que
não estão na fonte são as calculadas pelo script no carregamento. A distribuição (1 no § MAP, 2 na a05, 2 na a08), a
comparação com o catálogo (1 idêntico, 9 abreviados, 1 divergente) e as 9 divergências deste grupo foram conferidas.
**Nenhuma correção neste grupo.** Detalhe em `modulo.md` › Verificação — segunda passada.
