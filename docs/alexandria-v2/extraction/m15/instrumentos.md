# M15 · grupo "instrumentos"

Fonte (só leitura): `C:/dev/GridAlpha v2/Alexandria modulos/alexandria_modulo15.html`. Saída: [`instrumentos.json`](instrumentos.json). Camada: **fonte**.
Método: extratores/m15_instrumentos.mjs — marcação por regex dentro de cada div.inst (walker balanceado); script por recorte do IIFE "/* ===== INST·NN" e avaliação dos literais de dados; cenário-padrão e prova de fidelidade executando o script original em DOM simulado.
Verificação literal: 504 strings, 0 falhas.

## Resumo

| Id | Título | Seção | kind (código) | Num. | Sel. | Saídas | Ramos | Status | Fidelidade |
|---|---|---|---|---|---|---|---|---|---|
| INST·01 | Mapa da cadeia · quatro reagrupamentos | §MAP | explorador | 0 | 1 | 0 | 0 | divergente | sem readouts · 36/36 painéis de texto idênticos |
| INST·02 | Comparador de regimes | Aula 01 | comparador | 0 | 2 | 0 | 1 | portado | sem readouts · 12/12 vereditos idênticos |
| INST·03 | Régua de grandeza de subsolo | Aula 02 | simulador | 5 | 2 | 6 | 5 | portado | 664/664 casos com readouts idênticos e valores[] coerentes · 664/664 vereditos idênticos |
| INST·04 | Calculadora de parcela do Estado | Aula 03 | calculadora | 6 | 1 | 6 | 3 | divergente | 249/249 casos com readouts idênticos e valores[] coerentes · 249/249 vereditos idênticos |
| INST·05 | Decompositor de preço de combustível | Aula 04 | calculadora | 6 | 0 | 5 | 3 | divergente | 83/83 casos com readouts idênticos e valores[] coerentes · 83/83 vereditos idênticos |
| INST·06 | Régua de refino · capacidade contra produto | Aula 05 | calculadora | 4 | 0 | 6 | 4 | portado | 83/83 casos com readouts idênticos e valores[] coerentes · 83/83 vereditos idênticos |
| INST·07 | Régua de contrato de gás | Aula 06 | simulador | 6 | 1 | 5 | 3 | divergente | 249/249 casos com readouts idênticos e valores[] coerentes · 249/249 vereditos idênticos |
| INST·08 | Classificador de elo | Aula 07 | explorador | 0 | 3 | 0 | 2 | divergente | sem readouts · 30/30 vereditos idênticos |
| INST·09 | Simulador de acoplamento gás → despacho | Aula 08 | simulador | 6 | 0 | 6 | 4 | divergente | 74/83 casos com readouts idênticos e valores[] coerentes · 83/83 vereditos idênticos |
| INST·10 | Verificador de regime e de camada · instrumento assinatura | Aula 09 | explorador | 0 | 1 | 0 | 0 | divergente | sem readouts · 60/60 painéis de texto idênticos |

Contagens: instrumentos = 10 · em_aula = 9 · de_modulo = 1 · entradas_numericas = 33 · seletores = 11 · saidas_readout = 34 · ramos_de_veredito = 25 · casos_de_fidelidade = 1549 · status = {"divergente":7,"portado":3}.

**Status:** "portado" = cálculo e veredito idênticos ao original em todos os casos testados e sem divergência de campo no dado;
"divergente" = há diferença de campo, rótulo, unidade ou cálculo (listada); "não portado" = ausente. Nenhum está "não portado".
Itens marcados "leitura de código" não foram medidos na tela.

## Prova de fidelidade

O `<script>` original de cada instrumento rodou num DOM simulado (inputs e botões lidos da marcação, cliques simulados) e
foi comparado com a porta de `alexandria-instrument-calculators.ts` (cópia temporária). Espaço exaustivo nos
instrumentos de seleção (01, 02, 08, 10); amostra com padrões, extremos, vazio, fora de faixa e aleatórios nos demais.
Único defeito de cálculo encontrado: **INST·09 `ac-gb`** (a fonte mostra "—" com gb ≤ 0; a porta publica o número negativo).

- Nenhum instrumento declara pergunta, gabarito ou tolerância.
- Três instrumentos se chamam "Régua" (03, 06, 07) e o código lhes deu kinds diferentes (simulador, calculadora, simulador) com mecânica equivalente (campos numéricos → readouts + veredito por faixa). O INST·04 (calculadora) tem a mesma forma do INST·07 (simulador). Registrado, não resolvido (§3; taxonomia sem o M15).
- Fontes dos números: INST·03 declara ANP (Boletim Anual de Recursos e Reservas, 10/04/2026); INST·04 declara "modelo didático simplificado" com preço/câmbio do 1º tri 2026; INST·05, INST·07 e INST·09 declaram valores didáticos/ordem de grandeza; INST·06 mistura anuário ANP (capacidade, utilização) e valores didáticos (rendimento, demanda). P19 vale para todos: nunca apresentar como dado oficial sem verificação.

## Instrumentos

### INST·01 · Mapa da cadeia · quatro reagrupamentos

- **Onde:** §MAP · Recursos do Módulo (§MAP, fora de aula — protocolo §3) · marcação L1059–L1084.
- **Ponto do texto:** depois de bloco div.cad (L1047); antes de div.box gd "Onde isso entra no produto Este mapa é o esqueleto de leitur…" (L1086). Invocação textual: "O instrumento abaixo existe para mostrar que os mesmos nove objetos se reagrupam conforme a pergunta que você faz".
- **Pergunta:** `null`. **Tolerâncias:** `null` (não declaradas).
- **Intro:** "Escolha a dimensão de agrupamento. Os nove elos são sempre os mesmos; o que muda é a pergunta. Clique em um elo para abrir a ficha resumida — regime, órgão competente, grandeza medida, natureza do preço e o que aquele número não diz."

| Seletor | Rótulo | Opções (valor = texto) | Padrão |
|---|---|---|---|
| mp-dim | Agrupar por | seg = Segmento; reg = Regime jurídico; ac = Acoplamento elétrico; pr = Natureza do preço | seg |

Escolha dinâmica: `mp-chips` — DIMS[dim].ordem → ELOS[k].n (rótulo) e ELOS[k][dim] (sobrelinha) (sem rótulo na fonte).

**Leitura (0 ramos):** sem classe de veredito; o texto sai de um painel montado com os dados do script (ver dados_script).
Templates literais dos contêineres (script): `mp-flux` (L3430), `mp-panel` (L3441). Texto completo em `conteineres_dinamicos[].templates_script`.
Dados do script:`ELOS` (L3335–L3417), `DIMS` (L3418–L3423).

**Fonte dos números (p.disc, L1079):** "Fonte da estrutura: Lei nº 9.478/1997 e Lei nº 12.351/2010 para os regimes de E&P; Lei nº 14.134/2021 e Decreto nº 10.712/2021, alterado pelo Decreto nº 12.153/2024, para transporte e infraestruturas essenciais de gás; competência estadual de distribuição de gás canalizado do art. 25, §2º da Constituição. Consulta em 4 de agosto de 2026."

**Código:** DIVERGENTE — `MODULO_15_INSTRUMENTOS (fora de aula)`, kind `explorador`, 2 campos, 0 saídas. Fidelidade: 36/36 painéis idênticos (exaustivo (todas as combinações)).
- campo "mp-elo" (label "Elo da cadeia") existe só no código — na fonte a escolha é por chips gerados pelo script, sem rótulo próprio (o texto do label não ocorre na fonte)
- p.disc (fonte dos números/estrutura) não portado: o código não carrega a nota de procedência do instrumento
- tom do veredito (classe verdict ok/att/per da fonte) não é portado: ResultadoInstrumento só tem valores + veredito

### INST·02 · Comparador de regimes

- **Onde:** Aula 01 (`aula-15-01`) · aula (por posição) · marcação L1191–L1222.
- **Ponto do texto:** depois de §01.4 "Individualização da produção: quando a jazida ignora o contrato", bloco p (L1183); antes de h3 "01.5 Ficha de elo 01 — campo em regime de concessão…" (L1224). Sem invocação textual (vínculo por posição).
- **Pergunta:** `null`. **Tolerâncias:** `null` (não declaradas).
- **Intro:** "Escolha um regime e uma dimensão de comparação. Toda dimensão devolve, além da resposta, uma ressalva de comparabilidade: o que muda, naquela dimensão, quando você tenta comparar dois números produzidos sob regimes diferentes."

| Seletor | Rótulo | Opções (valor = texto) | Padrão |
|---|---|---|---|
| rg-reg | Regime | conc = Concessão; part = Partilha; cess = Cessão onerosa | conc |
| rg-dim | Dimensão | tit = Titularidade da molécula; est = O que o Estado recebe; lic = Como se disputa a área; ris = Quem corre o risco | tit |

**Leitura (1 ramos):** `sem condição (sempre)` → att (L3503). No padrão: verdict att, "Ressalva de comparabilidade. Comparabilidade: a produção de um campo de concessão é integralmente receita bruta do consó…"
Templates literais dos contêineres (script): `rg-out` (L3499). Texto completo em `conteineres_dinamicos[].templates_script`.
Dados do script:`R` (L3465–L3493), `DIMN` (L3494–L3494).

**Fonte dos números (p.disc, L1216):** "Fontes: Lei nº 9.478/1997 (concessão); Lei nº 12.351/2010 e Lei nº 12.304/2010 (partilha e PPSA); Lei nº 12.276/2010 (cessão onerosa); editais vigentes de Oferta Permanente de Concessão e de Partilha. Distribuição por regime das áreas produtoras conforme Boletim Mensal da Produção da ANP referente a junho de 2026, divulgado em 3 de agosto de 2026. Consulta em 4 de agosto de 2026."

**Código:** PORTADO — `aula-15-01`, kind `comparador`, 2 campos, 0 saídas. Fidelidade: 12/12 vereditos idênticos (exaustivo (todas as combinações)).
- p.disc (fonte dos números/estrutura) não portado: o código não carrega a nota de procedência do instrumento
- tom do veredito (classe verdict ok/att/per da fonte) não é portado: ResultadoInstrumento só tem valores + veredito

### INST·03 · Régua de grandeza de subsolo

- **Onde:** Aula 02 (`aula-15-02`) · aula (por posição) · marcação L1382–L1439.
- **Ponto do texto:** depois de §02.3 "Dois indicadores derivados, e o que cada um esconde", bloco div.lv (L1368); antes de div.box cy "O teste de trinta segundos Alguém diz: "o Brasil tem quase 2…" (L1441). Sem invocação textual (vínculo por posição).
- **Pergunta:** `null`. **Tolerâncias:** `null` (não declaradas).
- **Intro:** "Informe um volume provado e as razões típicas entre critérios da sua carteira. O instrumento devolve a mesma jazida sob os três critérios lado a lado, calcula R/P e IRR, e se recusa a emitir veredito quando falta a data de certificação — porque um volume de reserva sem data de referência não é um número, é uma afirmação."

| Entrada | Rótulo | Unidade | Faixa | Passo | Padrão |
|---|---|---|---|---|---|
| gs-1p-n | Reserva provada · 1P | bi bbl | 0.1–120 | 0.001 | 17.488 |
| gs-2p-n | Razão 2P / 1P | × | 1–3 | 0.001 | 1.387 |
| gs-3p-n | Razão 3P / 1P | × | 1–4 | 0.001 | 1.651 |
| gs-pd-n | Produção anual | bi bbl/ano | 0.01–6 | 0.001 | 1.380 |
| gs-ad-n | Adições líquidas 1P no ano | bi bbl | 0–8 | 0.001 | 2.023 |

| Seletor | Rótulo | Opções (valor = texto) | Padrão |
|---|---|---|---|
| gs-dt | Data de certificação declarada na fonte | sim = Sim — data de referência conhecida; nao = Não — a fonte não declara | sim |
| gs-cr | Critério citado pela fonte | p1 = 1P · provada; p2 = 2P; p3 = 3P; nd = Não declarado | p1 |

| Saída | Rótulo | Fórmula de exibição (script) | Padrão calculado |
|---|---|---|---|
| gs-v1 | Volume sob 1P | $id('gs-v1').innerHTML=fmt(v1,3)+'<span class="u"> bi</span>'; | 17,488 bi |
| gs-v2 | Volume sob 2P | $id('gs-v2').innerHTML=fmt(v2,3)+'<span class="u"> bi</span>'; | 24,256 bi |
| gs-v3 | Volume sob 3P | $id('gs-v3').innerHTML=fmt(v3,3)+'<span class="u"> bi</span>'; | 28,873 bi |
| gs-am | Amplitude entre critérios | $id('gs-am').innerHTML='+'+fmt(amp,1)+'<span class="u">%</span>'; | +65,1% |
| gs-rp | R/P sobre o critério citado | $id('gs-rp').innerHTML=(cr==='nd'?'—':fmt(rp,1)+'<span class="u"> anos</span>'); | 12,7 anos |
| gs-ir | IRR do período | $id('gs-ir').innerHTML=fmt(irr,1)+'<span class="u">%</span>'; | 146,6% |

Cálculo (script, L3513): `var p1=numOf($id('gs-1p-n'),17.488,0.1,120); var k2=numOf($id('gs-2p-n'),1.387,1,3); var k3=numOf($id('gs-3p-n'),1.651,1,4); var pd=numOf($id('gs-pd-n'),1.380,0.01,6); var ad=numOf($id('gs-ad-n'),2.023,0,8); if(k3<k2){k3=k2;} var v1=p1, v2=p1*k2, v3=p1*k3; var cr=segVal('gs-cr','data-c')||'p1'; var dt=segVal('gs-dt','data-t')||'sim'; var vc = cr==='p2'?v2:(cr==='p3'?v3:v1); var amp = v1>0 ? (v3/v1-1)*100 : 0; var rp = pd>0 ? vc/pd : NaN; var irr = pd>0 ? ad/pd*100 : NaN; var mx=Math.max(v3,0.0001);`

**Leitura (5 ramos):** `if(dt==='nao')` → per (L3545); `else if(cr==='nd')` → per (L3548); `else if(irr<100 && rp<10)` → per (L3551); `else if(irr>=100 && rp>=10)` → ok (L3554); `else` → att (L3557). No padrão: verdict ok, "Dois sinais favoráveis, e nenhuma conclusão sobre o futuro. Reposição de 146,6% e relação reserva/produção de 12,7 anos …"
Templates literais dos contêineres (script): `gs-bars` (L3533). Texto completo em `conteineres_dinamicos[].templates_script`.


**Fonte dos números (p.disc, L1433):** "Valores iniciais: reservas brasileiras declaradas à ANP com data de referência em 31/12/2025, publicadas no Boletim Anual de Recursos e Reservas em 10/04/2026. Razões 2P/1P e 3P/1P calculadas a partir dos volumes publicados. Produção anual e adições líquidas de 2025. Todos os campos são editáveis: substitua pelos números da carteira que você estiver lendo. Consulta em 4 de agosto de 2026."

**Código:** PORTADO — `aula-15-02`, kind `simulador`, 7 campos, 6 saídas. Fidelidade: 664/664 casos com readouts idênticos e valores[] coerentes, 664/664 vereditos idênticos (amostrado: 664 casos (padrões, mínimos, máximos, vazio, fora de faixa e aleatórios com semente 15, para cada combinação de botões)).
- p.disc (fonte dos números/estrutura) não portado: o código não carrega a nota de procedência do instrumento
- formatação: o painel usa fmt(v, 2) (até 2 casas, sem casas fixas) em vez das casas fixas do script (0, 1, 2 ou 3) e perde prefixos/sufixos compostos — leitura de InstrumentPanel.tsx, não medida na tela
- tom do veredito (classe verdict ok/att/per da fonte) não é portado: ResultadoInstrumento só tem valores + veredito
- visualização não portada (desenho, §12): gs-bars

### INST·04 · Calculadora de parcela do Estado

- **Onde:** Aula 03 (`aula-15-03`) · aula (por posição) · marcação L1549–L1604.
- **Ponto do texto:** depois de §03.4 "Três variáveis que não se movem juntas", bloco p (L1541); antes de div.box gd "Onde isso entra no produto Um ente produtor é um cliente de …" (L1606). Sem invocação textual (vínculo por posição).
- **Pergunta:** `null`. **Tolerâncias:** `null` (não declaradas).
- **Intro:** "Todos os parâmetros são editáveis, inclusive as alíquotas — porque nenhum deles é constante e porque alíquota efetiva não é alíquota nominal. O instrumento devolve royalty e participação especial separadamente, e o veredito se recusa a ler a receita fiscal por um único sinal: precisa de volume, preço e câmbio ao mesmo tempo."

| Entrada | Rótulo | Unidade | Faixa | Passo | Padrão |
|---|---|---|---|---|---|
| pe-vol-n | Produção do campo | mil bbl/d | 1–1200 | 1 | 180 |
| pe-pr-n | Preço de referência | US$/bbl | 20–160 | 0.01 | 80.61 |
| pe-cx-n | Câmbio | R$/US$ | 2.5–9 | 0.01 | 5.26 |
| pe-al-n | Alíquota de royalty | % | 5–15 | 0.1 | 10 |
| pe-de-n | Deduções sobre a receita bruta | % da receita | 10–90 | 0.5 | 45 |
| pe-pa-n | Alíquota de participação especial | % | 0–40 | 0.5 | 25 |

| Seletor | Rótulo | Opções (valor = texto) | Padrão |
|---|---|---|---|
| pe-rep | Desenho de repartição aplicável | ter = Campo terrestre; mar = Marítimo · comercialidade após 12/2012; pre = Marítimo no polígono · comercialidade anterior | ter |

| Saída | Rótulo | Fórmula de exibição (script) | Padrão calculado |
|---|---|---|---|
| pe-rb | Receita bruta anual | $id('pe-rb').innerHTML='R$ '+fmt(rb,1)+'<span class="u"> bi</span>'; | R$ 27,9 bi |
| pe-ry | Royalty anual | $id('pe-ry').innerHTML='R$ '+fmt(ry,2)+'<span class="u"> bi</span>'; | R$ 2,79 bi |
| pe-ps | Participação especial anual | $id('pe-ps').innerHTML='R$ '+fmt(ps,2)+'<span class="u"> bi</span>'; | R$ 3,13 bi |
| pe-tk | Parcela do Estado sobre a receita | $id('pe-tk').innerHTML=fmt(tk,1)+'<span class="u">%</span>'; | 21,3% |
| pe-es | Aos estados | $id('pe-es').innerHTML='R$ '+fmt(es,2)+'<span class="u"> bi</span>'; | R$ 2,37 bi |
| pe-mu | Aos municípios | $id('pe-mu').innerHTML='R$ '+fmt(mu,2)+'<span class="u"> bi</span>'; | R$ 0,59 bi |

Cálculo (script, L3579): `var vol=numOf($id('pe-vol-n'),180,1,1200); var pr=numOf($id('pe-pr-n'),80.61,20,160); var cx=numOf($id('pe-cx-n'),5.26,2.5,9); var al=numOf($id('pe-al-n'),10,5,15); var de=numOf($id('pe-de-n'),45,10,90); var pa=numOf($id('pe-pa-n'),25,0,40); var rep=segVal('pe-rep','data-p')||'ter'; var R=REP[rep]; var rb=vol*1000*365*pr*cx/1e9; var ry=rb*al/100; var base=rb*(1-de/100)-ry; if(base<0)base=0; var ps=base*pa/100; var tot=ry+ps; var tk=rb>0?tot/rb*100:0; var es=tot*R.e/100, mu=tot*R.m/100; var mx=Math.max(ry,ps,0.0001);`

**Leitura (3 ramos):** `if(ps<=0.0001 && ry>0)` → att (L3611); `else if(tk>35)` → per (L3614); `else` → ok (L3617). No padrão: verdict ok, "Royalty e participação especial calculados separadamente. Parcela pública de 21,3% da receita bruta, dos quais R$ 2,37 b…"
Templates literais dos contêineres (script): `pe-bars` (L3602). Texto completo em `conteineres_dinamicos[].templates_script`.
Dados do script:`REP` (L3570–L3577).

**Fonte dos números (p.disc, L1597):** "Modelo didático simplificado, não regime legal: as alíquotas reais de participação especial são progressivas por faixa e variam com a localização da lavra, o número de anos de produção e o volume trimestral fiscalizado, e as deduções seguem regra própria. Percentuais de repartição conforme art. 50 da Lei nº 9.478/1997 e Lei nº 12.858/2013. Preço e câmbio iniciais correspondem à média da referência internacional de petróleo e ao dólar médio de venda reportados para o primeiro trimestre de 2026. Consulta em 4 de agosto de 2026."

**Código:** DIVERGENTE — `aula-15-03`, kind `calculadora`, 7 campos, 6 saídas. Fidelidade: 249/249 casos com readouts idênticos e valores[] coerentes, 249/249 vereditos idênticos (amostrado: 249 casos (padrões, mínimos, máximos, vazio, fora de faixa e aleatórios com semente 15, para cada combinação de botões)).
- pe-rb: prefixo "R$" da fonte não chega à tela (o painel só antepõe "R$ " quando unit === "R$")
- pe-ry: prefixo "R$" da fonte não chega à tela (o painel só antepõe "R$ " quando unit === "R$")
- pe-ps: prefixo "R$" da fonte não chega à tela (o painel só antepõe "R$ " quando unit === "R$")
- pe-es: prefixo "R$" da fonte não chega à tela (o painel só antepõe "R$ " quando unit === "R$")
- pe-mu: prefixo "R$" da fonte não chega à tela (o painel só antepõe "R$ " quando unit === "R$")
- p.disc (fonte dos números/estrutura) não portado: o código não carrega a nota de procedência do instrumento
- formatação: o painel usa fmt(v, 2) (até 2 casas, sem casas fixas) em vez das casas fixas do script (0, 1, 2 ou 3) e perde prefixos/sufixos compostos — leitura de InstrumentPanel.tsx, não medida na tela
- tom do veredito (classe verdict ok/att/per da fonte) não é portado: ResultadoInstrumento só tem valores + veredito
- visualização não portada (desenho, §12): pe-bars

### INST·05 · Decompositor de preço de combustível

- **Onde:** Aula 04 (`aula-15-04`) · aula (por posição) · marcação L1738–L1787.
- **Ponto do texto:** depois de §04.3 "A estratégia comercial da companhia estatal, como mecanismo", bloco div.box rd (L1728); antes de div.box gd "Onde isso entra no produto O Regulatory Radar faz rastreamen…" (L1789). Sem invocação textual (vínculo por posição).
- **Pergunta:** `null`. **Tolerâncias:** `null` (não declaradas).
- **Intro:** "Cada camada é entrada editável, inclusive a subvenção — que entra com sinal negativo. O instrumento devolve a composição, a participação percentual de cada camada e um veredito que se recusa a atribuir a variação a uma única camada sem que você tenha mexido em uma só."

| Entrada | Rótulo | Unidade | Faixa | Passo | Padrão |
|---|---|---|---|---|---|
| cb-p4-n | Preço do produtor · camada 4 | R$/litro | 0.5–6 | 0.01 | 3.10 |
| cb-bi-n | Biocombustível de mistura | R$/litro | 0–2 | 0.01 | 0.62 |
| cb-tf-n | Tributos federais | R$/litro | 0–2 | 0.01 | 0.42 |
| cb-te-n | Tributo estadual | R$/litro | 0–3 | 0.01 | 1.47 |
| cb-dr-n | Distribuição e revenda | R$/litro | 0–3 | 0.01 | 0.98 |
| cb-sb-n | Subvenção econômica | R$/litro · negativa | 0–1.2 | 0.01 | 0 |

| Saída | Rótulo | Fórmula de exibição (script) | Padrão calculado |
|---|---|---|---|
| cb-tot | Preço final estimado | $id('cb-tot').innerHTML='R$ '+fmt(tot,2)+'<span class="u">/L</span>'; | R$ 6,59/L |
| cb-pp | Parcela do produtor | $id('cb-pp').innerHTML=fmt(p4/tot*100,1)+'<span class="u">%</span>'; | 47,0% |
| cb-ct | Carga tributária total | $id('cb-ct').innerHTML=fmt(ct/tot*100,1)+'<span class="u">%</span>'; | 28,7% |
| cb-pb | Parcela de biocombustível | $id('cb-pb').innerHTML=fmt(bi/tot*100,1)+'<span class="u">%</span>'; | 9,4% |
| cb-pd | Parcela de distribuição e revenda | $id('cb-pd').innerHTML=fmt(dr/tot*100,1)+'<span class="u">%</span>'; | 14,9% |

Cálculo (script, L3631): `var p4=numOf($id('cb-p4-n'),3.10,0.5,6); var bi=numOf($id('cb-bi-n'),0.62,0,2); var tf=numOf($id('cb-tf-n'),0.42,0,2); var te=numOf($id('cb-te-n'),1.47,0,3); var dr=numOf($id('cb-dr-n'),0.98,0,3); var sb=numOf($id('cb-sb-n'),0,0,1.2); var sub=Math.min(sb,tf); var tot=p4+bi+tf+te+dr-sub; if(tot<0.01)tot=0.01; var ct=tf+te-sub;`

**Leitura (3 ramos):** `if(sub>0)` → att (L3664); `else if(ct/tot>0.40)` → per (L3667); `else` → ok (L3670). No padrão: verdict ok, "Composição decomposta em cinco camadas. A parcela do produtor é 47,0% do preço final — o que significa que 53,0% se form…"
Templates literais dos contêineres (script): `cb-bar` (L3653), `cb-lg` (L3657); lista `segs` (L3646). Texto completo em `conteineres_dinamicos[].templates_script`.


**Fonte dos números (p.disc, L1780):** "Modelo didático de composição, com valores iniciais de ordem de grandeza para gasolina C. Não reproduz alíquota específica de nenhum estado nem preço de nenhum polo de suprimento: para números vigentes, consulte o levantamento de preços da ANP, a legislação tributária federal e estadual aplicável e a página de formação de preços do produtor. A parcela de biocombustível de mistura obrigatória é objeto do Módulo 14 e entra aqui apenas como camada de preço. Consulta em 4 de agosto de 2026."

**Código:** DIVERGENTE — `aula-15-04`, kind `calculadora`, 6 campos, 5 saídas. Fidelidade: 83/83 casos com readouts idênticos e valores[] coerentes, 83/83 vereditos idênticos (amostrado: 83 casos (padrões, mínimos, máximos, vazio, fora de faixa e aleatórios com semente 15, para cada combinação de botões)).
- cb-tot: prefixo "R$" da fonte não chega à tela (o painel só antepõe "R$ " quando unit === "R$")
- p.disc (fonte dos números/estrutura) não portado: o código não carrega a nota de procedência do instrumento
- formatação: o painel usa fmt(v, 2) (até 2 casas, sem casas fixas) em vez das casas fixas do script (0, 1, 2 ou 3) e perde prefixos/sufixos compostos — leitura de InstrumentPanel.tsx, não medida na tela
- tom do veredito (classe verdict ok/att/per da fonte) não é portado: ResultadoInstrumento só tem valores + veredito
- visualização não portada (desenho, §12): cb-bar, cb-lg

### INST·06 · Régua de refino · capacidade contra produto

- **Onde:** Aula 05 (`aula-15-05`) · aula (por posição) · marcação L1880–L1918.
- **Ponto do texto:** depois de §05.3 "Margem de refino: o que ela mede e o que ela não mede", bloco div.fx (L1869); antes de h3 "05.4 Ficha de elo 03 — refinaria…" (L1920). Sem invocação textual (vínculo por posição).
- **Pergunta:** `null`. **Tolerâncias:** `null` (não declaradas).
- **Intro:** "Quatro entradas independentes. O instrumento devolve quanto de um produto específico o parque consegue entregar e onde fica o descompasso com a demanda — e o veredito separa as quatro causas possíveis do déficit em vez de atribuí-lo a "falta de refinaria"."

| Entrada | Rótulo | Unidade | Faixa | Passo | Padrão |
|---|---|---|---|---|---|
| rf-cap-n | Capacidade instalada | mil bpd | 200–4000 | 10 | 1800 |
| rf-uti-n | Fator de utilização | % | 40–100 | 0.1 | 86.4 |
| rf-ren-n | Rendimento em diesel | % da carga | 10–60 | 0.5 | 40 |
| rf-dem-n | Demanda nacional de diesel | mil bpd | 100–2000 | 5 | 900 |

| Saída | Rótulo | Fórmula de exibição (script) | Padrão calculado |
|---|---|---|---|
| rf-cg | Carga processada | $id('rf-cg').innerHTML=fmt(cg,0)+'<span class="u"> mil bpd</span>'; | 1.555 mil bpd |
| rf-di | Diesel produzido | $id('rf-di').innerHTML=fmt(di,0)+'<span class="u"> mil bpd</span>'; | 622 mil bpd |
| rf-de | Descompasso | $id('rf-de').innerHTML=(def>=0?'+':'')+fmt(def,0)+'<span class="u"> mil bpd</span>'; | -278 mil bpd |
| rf-oc | Capacidade ociosa | $id('rf-oc').innerHTML=fmt(oc,0)+'<span class="u"> mil bpd</span>'; | 245 mil bpd |
| rf-c1 | Diesel se rodasse a 100% | $id('rf-c1').innerHTML=fmt(c1,0)+'<span class="u"> mil bpd</span>'; | 720 mil bpd |
| rf-rn | Rendimento necessário para zerar | $id('rf-rn').innerHTML=fmt(rn,1)+'<span class="u">% da carga</span>'; | 50,0% da carga |

Cálculo (script, L3684): `var cap=numOf($id('rf-cap-n'),1800,200,4000); var uti=numOf($id('rf-uti-n'),86.4,40,100); var ren=numOf($id('rf-ren-n'),40,10,60); var dem=numOf($id('rf-dem-n'),900,100,2000); var cg=cap*uti/100; var di=cg*ren/100; var def=di-dem; var oc=cap-cg; var c1=cap*ren/100; var rn=cap>0?dem/cap*100:0;`

**Leitura (4 ramos):** `if(def>=0)` → ok (L3702); `else if(c1>=dem)` → att (L3705); `else if(rn<=60)` → att (L3708); `else` → per (L3711). No padrão: verdict att, "Déficit de 278 mil bpd — a causa dominante é rendimento. Seria preciso extrair 50,0% de diesel da carga total instalada …"


**Fonte dos números (p.disc, L1913):** "Valores iniciais: capacidade instalada de processamento e fator de utilização de ordem de grandeza do parque nacional em 2025, conforme anuário estatístico da ANP; rendimento e demanda em valores didáticos editáveis. O instrumento não recomenda construir, ampliar nem importar: devolve a estrutura do descompasso e as quatro causas possíveis. Consulta em 4 de agosto de 2026."

**Código:** PORTADO — `aula-15-05`, kind `calculadora`, 4 campos, 6 saídas. Fidelidade: 83/83 casos com readouts idênticos e valores[] coerentes, 83/83 vereditos idênticos (amostrado: 83 casos (padrões, mínimos, máximos, vazio, fora de faixa e aleatórios com semente 15, para cada combinação de botões)).
- p.disc (fonte dos números/estrutura) não portado: o código não carrega a nota de procedência do instrumento
- formatação: o painel usa fmt(v, 2) (até 2 casas, sem casas fixas) em vez das casas fixas do script (0, 1, 2 ou 3) e perde prefixos/sufixos compostos — leitura de InstrumentPanel.tsx, não medida na tela
- tom do veredito (classe verdict ok/att/per da fonte) não é portado: ResultadoInstrumento só tem valores + veredito

### INST·07 · Régua de contrato de gás

- **Onde:** Aula 06 (`aula-15-06`) · aula (por posição) · marcação L2041–L2095.
- **Ponto do texto:** depois de §06.3 "Retirada mínima, indexação e o preço que não é do dia", bloco p (L2034); antes de div.box rd "Fonte com posição — como usar sem contaminar Uma nota técnic…" (L2097). Sem invocação textual (vínculo por posição).
- **Pergunta:** `null`. **Tolerâncias:** `null` (não declaradas).
- **Intro:** "O instrumento separa a molécula do transporte, aplica a retirada mínima sobre o volume efetivamente consumido e devolve o custo efetivo entregue — que é o número que importa e que quase nunca é o número citado. A comparação com o preço de referência do dia serve para mostrar de quanto é a distância, não para sugerir que o contrato deveria acompanhá-lo."

| Entrada | Rótulo | Unidade | Faixa | Passo | Padrão |
|---|---|---|---|---|---|
| gc-mol-n | Preço da molécula · contrato | US$/MMBtu | 2–30 | 0.01 | 8.50 |
| gc-tra-n | Custo de transporte | US$/MMBtu | 0–12 | 0.01 | 1.60 |
| gc-dis-n | Margem de distribuição e tributos | US$/MMBtu | 0–15 | 0.01 | 3.20 |
| gc-top-n | Retirada mínima contratada | % do volume | 0–100 | 1 | 80 |
| gc-ret-n | Volume efetivamente retirado | % do contratado | 0–120 | 1 | 65 |
| gc-spo-n | Referência de mercado do dia | US$/MMBtu | 1–40 | 0.01 | 6.00 |

| Seletor | Rótulo | Opções (valor = texto) | Padrão |
|---|---|---|---|
| gc-cam | Camada em que o custo está sendo lido | mol = Molécula na saída do processamento; cty = Entregue no city gate; ind = Final ao consumidor industrial | mol |

| Saída | Rótulo | Fórmula de exibição (script) | Padrão calculado |
|---|---|---|---|
| gc-nom | Custo nominal da camada | $id('gc-nom').innerHTML='US$ '+fmt(nom,2)+'<span class="u">/MMBtu</span>'; | US$ 8,50/MMBtu |
| gc-vf | Volume faturado | $id('gc-vf').innerHTML=fmt(fat,0)+'<span class="u">% do contratado</span>'; | 80% do contratado |
| gc-ef | Custo efetivo por unidade consumida | $id('gc-ef').innerHTML=(isFinite(ef)?'US$ '+fmt(ef,2):'—')+'<span class="u">/MMBtu</span>'; | US$ 10,46/MMBtu |
| gc-sc | Sobrecusto da retirada mínima | $id('gc-sc').innerHTML=(isFinite(sc)?'+US$ '+fmt(sc,2):'—')+'<span class="u">/MMBtu</span>'; | +US$ 1,96/MMBtu |
| gc-dt | Distância da referência do dia | $id('gc-dt').innerHTML=(dt>=0?'+':'')+fmt(dt/spo*100,1)+'<span class="u">% vs. referência</span>'; | +41,7% vs. referência |

Cálculo (script, L3729): `var mol=numOf($id('gc-mol-n'),8.50,2,30); var tra=numOf($id('gc-tra-n'),1.60,0,12); var dis=numOf($id('gc-dis-n'),3.20,0,15); var top=numOf($id('gc-top-n'),80,0,100); var ret=numOf($id('gc-ret-n'),65,0,120); var spo=numOf($id('gc-spo-n'),6.00,1,40); var cam=segVal('gc-cam','data-c')||'mol'; var nom = cam==='mol'?mol:(cam==='cty'?mol+tra:mol+tra+dis); var fat = Math.max(ret,top); var ef = ret>0 ? nom*fat/ret : NaN; var sc = isFinite(ef) ? ef-nom : NaN; var dt = nom-spo; var mx=Math.max(nom,isFinite(ef)?ef:0,spo,0.0001);`

**Leitura (3 ramos):** `if(ret<=0)` → per (L3759); `else if(ret<top)` → att (L3762); `else` → ok (L3765). No padrão: verdict att, "Retirada abaixo do mínimo contratado — o custo efetivo é 23,1% acima do preço nominal. Na camada "Molécula na saída do p…"
Templates literais dos contêineres (script): `gc-bars` (L3747). Texto completo em `conteineres_dinamicos[].templates_script`.
Dados do script:`CAM` (L3723–L3727).

**Fonte dos números (p.disc, L2088):** "Valores iniciais são didáticos e de ordem de grandeza. Para preços efetivamente praticados, a fonte primária é o boletim mensal de comercialização de gás natural da ANP, publicado em atendimento à Resolução ANP nº 52/2011, que divulga preço médio e volumes em três categorias separadas: vendas a distribuidoras e consumidores livres, vendas entre produtores e vendas a comercializadores. As três categorias são camadas diferentes e não se comparam entre si. Consulta em 4 de agosto de 2026."

**Código:** DIVERGENTE — `aula-15-06`, kind `simulador`, 7 campos, 5 saídas. Fidelidade: 249/249 casos com readouts idênticos e valores[] coerentes, 249/249 vereditos idênticos (amostrado: 249 casos (padrões, mínimos, máximos, vazio, fora de faixa e aleatórios com semente 15, para cada combinação de botões)).
- gc-nom: prefixo "US$" da fonte não chega à tela (o painel só antepõe "R$ " quando unit === "R$")
- gc-ef: prefixo "US$" da fonte não chega à tela (o painel só antepõe "R$ " quando unit === "R$")
- gc-sc: prefixo "+US$" da fonte não chega à tela (o painel só antepõe "R$ " quando unit === "R$")
- p.disc (fonte dos números/estrutura) não portado: o código não carrega a nota de procedência do instrumento
- formatação: o painel usa fmt(v, 2) (até 2 casas, sem casas fixas) em vez das casas fixas do script (0, 1, 2 ou 3) e perde prefixos/sufixos compostos — leitura de InstrumentPanel.tsx, não medida na tela
- tom do veredito (classe verdict ok/att/per da fonte) não é portado: ResultadoInstrumento só tem valores + veredito
- visualização não portada (desenho, §12): gc-bars

### INST·08 · Classificador de elo

- **Onde:** Aula 07 (`aula-15-07`) · aula (por posição) · marcação L2232–L2270.
- **Ponto do texto:** depois de §07.4 "O vocabulário mínimo de quem compra capacidade", bloco div.scroll (L2219); antes de h3 "07.5 Ficha de elo 04 — gasoduto de transporte…" (L2272). Sem invocação textual (vínculo por posição).
- **Pergunta:** `null`. **Tolerâncias:** `null` (não declaradas).
- **Intro:** "Escolha a grandeza citada e o elo em que alguém a atribuiu. O instrumento devolve se a combinação se aplica, qual regime e qual órgão a governam, e o que aquele número não diz. Quando a combinação não se aplica, ele diz por que não e onde aquela grandeza de fato mora — porque atribuir a grandeza ao elo errado é um erro tão comum quanto errar o número."

| Seletor | Rótulo | Opções (valor = texto) | Padrão |
|---|---|---|---|
| cl-gr | Grandeza citada | po = Produção de petróleo; pg = Produção de gás; rs = Reserva | po |
| cl-gr2 | Grandeza citada | cp = Capacidade; pr = Preço; cv = Custo variável | cp |
| cl-el | Elo ao qual foi atribuída | ca = Campo; ep = Escoamento e processamento; tr = Transporte; di = Distribuição; ut = Termelétrica | ca |

**Leitura (2 ramos):** `if(c.ok)` → att (L3830); `else` → per (L3838). No padrão: verdict att, "O que este número não diz. Não diz sob qual regime o volume foi produzido, sem o que a receita não se apura; não diz a p…"
Templates literais dos contêineres (script): `cl-out` (L3825, L3833). Texto completo em `conteineres_dinamicos[].templates_script`.
Dados do script:`GN` (L3778–L3778), `EN` (L3779–L3779), `M` (L3782–L3819).

**Fonte dos números (p.disc, L2264):** "A dimensão de grandeza tem dois seletores por espaço de tela: o segundo prevalece sobre o primeiro quando você clica nele, e vice-versa. Fontes de competência: Lei nº 9.478/1997 e Lei nº 12.351/2010 para E&P; Lei nº 14.134/2021 e Resolução ANP nº 1.003/2026 para infraestruturas essenciais de gás; competência estadual sobre distribuição de gás canalizado; Módulos 08 e 09 para as grandezas do setor elétrico. Consulta em 4 de agosto de 2026."

**Código:** DIVERGENTE — `aula-15-07`, kind `explorador`, 2 campos, 0 saídas. Fidelidade: 30/30 vereditos idênticos (exaustivo (todas as combinações)).
- seletor cl-gr2 ausente como campo no código (fundido em cl-gr, 6 opções)
- p.disc (fonte dos números/estrutura) não portado: o código não carrega a nota de procedência do instrumento
- tom do veredito (classe verdict ok/att/per da fonte) não é portado: ResultadoInstrumento só tem valores + veredito

### INST·09 · Simulador de acoplamento gás → despacho

- **Onde:** Aula 08 (`aula-15-08`) · aula (por posição) · marcação L2421–L2472.
- **Ponto do texto:** depois de §08.3 "O regulador precifica exatamente essa distinção", bloco div.lv (L2407); antes de h3 "08.4 Ficha de elo 06 — termelétrica a gás…" (L2474). Sem invocação textual (vínculo por posição).
- **Pergunta:** `null`. **Tolerâncias:** `null` (não declaradas).
- **Intro:** "Monte o CVU a partir do gás entregue e veja onde a usina cai na ordem de despacho. O veredito nunca conclui por um único sinal: ele exige a posição relativa ao custo marginal e o patamar de inflexibilidade declarada, porque uma usina pode estar gerando com CVU altíssimo e outra pode estar parada com CVU baixo."

| Entrada | Rótulo | Unidade | Faixa | Passo | Padrão |
|---|---|---|---|---|---|
| ac-gas-n | Gás entregue à usina | US$/MMBtu | 2–30 | 0.01 | 9.00 |
| ac-cx-n | Câmbio | R$/US$ | 2.5–9 | 0.01 | 5.40 |
| ac-hr-n | Consumo específico | MMBtu/MWh | 5.5–14 | 0.01 | 7.10 |
| ac-om-n | O&M variável e encargos | R$/MWh | 0–200 | 1 | 58 |
| ac-cmo-n | Custo marginal de operação | R$/MWh | 20–1200 | 1 | 330 |
| ac-inf-n | Inflexibilidade declarada | % da capacidade | 0–100 | 1 | 40 |

| Saída | Rótulo | Fórmula de exibição (script) | Padrão calculado |
|---|---|---|---|
| ac-cc | Custo de combustível | $id('ac-cc').innerHTML='R$ '+fmt(cc,0)+'<span class="u">/MWh</span>'; | R$ 345/MWh |
| ac-cvu | CVU simplificado | $id('ac-cvu').innerHTML='R$ '+fmt(cvu,0)+'<span class="u">/MWh</span>'; | R$ 403/MWh |
| ac-ef | Eficiência implícita | $id('ac-ef').innerHTML=fmt(ef,1)+'<span class="u">%</span>'; | 48,1% |
| ac-po | Posição vs. custo marginal | $id('ac-po').innerHTML=(cvu<=cmo?'Dentro do mérito':'Fora do mérito')+ '<span class="u"> · '+(cvu>=cmo?'+':'')+fmt(cvu-cmo,0)+' R$/MWh</span>'; | Fora do mérito · +73 R$/MWh |
| ac-gs | Geração sem sinal econômico | $id('ac-gs').innerHTML=fmt(inf,0)+'<span class="u">% da capacidade</span>'; | 40% da capacidade |
| ac-gb | Preço do gás que zeraria a distância | $id('ac-gb').innerHTML=(gb>0?'US$ '+fmt(gb,2):'—')+'<span class="u">/MMBtu</span>'; | US$ 7,09/MMBtu |

Cálculo (script, L3862): `var ESC=1200; var gas=numOf($id('ac-gas-n'),9.00,2,30); var cx=numOf($id('ac-cx-n'),5.40,2.5,9); var hr=numOf($id('ac-hr-n'),7.10,5.5,14); var om=numOf($id('ac-om-n'),58,0,200); var cmo=numOf($id('ac-cmo-n'),330,20,1200); var inf=numOf($id('ac-inf-n'),40,0,100); var cc=gas*cx*hr; var cvu=cc+om; var ef=100/(hr*293.07/1000); var gb=(cmo-om)/(cx*hr); var pc=clamp(cvu/ESC*100,0,100); var pm=clamp(cmo/ESC*100,0,100);`

**Leitura (4 ramos):** `if(cvu<=cmo && inf>0)` → att (L3889); `else if(cvu<=cmo && inf<=0)` → ok (L3892); `else if(cvu>cmo && inf>0)` → per (L3895); `else` → ok (L3898). No padrão: verdict per, "A usina vai gerar sem sinal econômico algum. Custo variável de R$ 403 acima do custo marginal de R$ 330 — o mérito a dis…"
Templates literais dos contêineres (script): `ac-track` (L3883). Texto completo em `conteineres_dinamicos[].templates_script`.


**Fonte dos números (p.disc, L2465):** "Modelo didático. O CVU efetivo declarado ao operador segue metodologia própria e inclui componentes que este instrumento simplifica. A ordem de despacho real resulta de otimização energética que considera hidrologia, armazenamento, restrições elétricas, requisitos de acionamento e decisões de garantia de suprimento — o eixo aqui representa apenas a dimensão de custo. Consulte o programa mensal de operação e os boletins do operador nacional para os valores vigentes. Consulta em 4 de agosto de 2026."

**Código:** DIVERGENTE — `aula-15-08`, kind `simulador`, 6 campos, 5 saídas. Fidelidade: 74/83 casos com readouts idênticos e valores[] coerentes, 83/83 vereditos idênticos (amostrado: 83 casos (padrões, mínimos, máximos, vazio, fora de faixa e aleatórios com semente 15, para cada combinação de botões)).
- CÁLCULO: valores[] diverge do readout da fonte em 9 caso(s) (ac-gb): a fonte exibe "—" quando a condição de exibição falha (ex.: gb>0), a porta publica o número (negativo) em valores, e o painel o mostraria. Ex.: {"tipo":"valor","id":"ac-gb","entrada":{"ac-gas-n":"","ac-cx-n":"6.81","ac-hr-n":"9.99","ac-om-n":"149","ac-cmo-n":"-1","ac-inf-n":"26"},"original":"—<span class=\"u\">/MMBtu</span>","val
- ac-om-n: label "O&amp;M variável e encargos" guarda a entidade HTML da marcação; o painel renderiza label como texto puro (InstrumentPanel.tsx), então a tela mostraria "&amp;" em vez de "&" — leitura de código, não medida na tela
- ac-cc: prefixo "R$" da fonte não chega à tela (o painel só antepõe "R$ " quando unit === "R$")
- ac-cvu: prefixo "R$" da fonte não chega à tela (o painel só antepõe "R$ " quando unit === "R$")
- saída ac-po ("Posição vs. custo marginal") não está em outputs — texto; a porta a antepõe ao veredito como "Posição vs. custo marginal"
- ac-gb: prefixo "US$" da fonte não chega à tela (o painel só antepõe "R$ " quando unit === "R$")
- p.disc (fonte dos números/estrutura) não portado: o código não carrega a nota de procedência do instrumento
- formatação: o painel usa fmt(v, 2) (até 2 casas, sem casas fixas) em vez das casas fixas do script (0, 1, 2 ou 3) e perde prefixos/sufixos compostos — leitura de InstrumentPanel.tsx, não medida na tela
- tom do veredito (classe verdict ok/att/per da fonte) não é portado: ResultadoInstrumento só tem valores + veredito
- visualização não portada (desenho, §12): ac-track

### INST·10 · Verificador de regime e de camada · instrumento assinatura

- **Onde:** Aula 09 (`aula-15-09`) · aula (por posição) · marcação L2527–L2550.
- **Ponto do texto:** depois de §09.1 "O protocolo de leitura, em ordem", bloco div.stp (L2516); antes de h3 "09.2 A companhia estatal listada: mandatos múltiplos, não co…" (L2552). Sem invocação textual (vínculo por posição).
- **Pergunta:** `null`. **Tolerâncias:** `null` (não declaradas).
- **Intro:** "Doze enunciados, todos verdadeiros e insuficientes. Nenhum contém erro factual; todos omitem algo que muda a conclusão. Identifique o defeito dominante, e compare com o diagnóstico. Use o filtro para treinar uma categoria por vez."

| Seletor | Rótulo | Opções (valor = texto) | Padrão |
|---|---|---|---|
| vf-flt | Filtrar por tipo de defeito | all = Todos; rg = Regime não declarado; cm = Camada confundida; gr = Grandeza confundida; ac = Acoplamento omitido | all |

Escolha dinâmica: `vf-chips` — E[].n (rótulo) e E[].y (sobrelinha), filtrados por vf-flt (sem rótulo na fonte).

**Leitura (0 ramos):** sem classe de veredito; o texto sai de um painel montado com os dados do script (ver dados_script).
Templates literais dos contêineres (script): `vf-panel` (L3990). Texto completo em `conteineres_dinamicos[].templates_script`.
Dados do script:`E` (L3911–L3984).

**Fonte dos números (p.disc, L2546):** "Os doze enunciados foram construídos a partir de números e regras verificados em fontes primárias em 4 de agosto de 2026. Cada um seria aceito sem objeção numa conversa, e cada um levaria o interlocutor a uma conclusão que o dado não sustenta."

**Código:** DIVERGENTE — `aula-15-09`, kind `explorador`, 2 campos, 0 saídas. Fidelidade: 60/60 painéis idênticos (exaustivo (todas as combinações)).
- campo "vf-en" (label "Enunciado") existe só no código — na fonte a escolha é por chips gerados pelo script, sem rótulo próprio (o texto do label não ocorre na fonte)
- p.disc (fonte dos números/estrutura) não portado: o código não carrega a nota de procedência do instrumento
- tom do veredito (classe verdict ok/att/per da fonte) não é portado: ResultadoInstrumento só tem valores + veredito


## Divergências (11)

- **div-m15-inst-01** (fonte×fonte) — INST·03: cenário-padrão calculado × números da prosa da Aula 02.
  - INST·03 com os valores iniciais (script): 2P 24,256 bi · 3P 28,873 bi · IRR 146,6% · R/P 12,7 anos
  - Aula 02 (L1328, L1325, L1359): 2P 24,265 bi · 3P 28,877 bi · IRR 147,03% · R/P "cerca de 12,7 anos"
  - Nota: As razões 2P/1P = 1,387 e 3P/1P = 1,651 e a produção 1,380 estão arredondadas; o instrumento reproduz os volumes com erro na 2ª casa e mostra IRR 146,6% contra os 147,03% da prosa. A disc diz que as razões foram "calculadas a partir dos volumes publicados". Diferença de arredondamento, não de fonte; P19/P20 regem a exibição.
- **div-m15-inst-02** (fonte×fonte) — INST·06: capacidade inicial × prosa da Aula 05.
  - INST·06 valores iniciais: capacidade 1800 mil bpd × 86,4% → carga 1.555 mil bpd
  - Aula 05 (L1838): cerca de 2,2 milhões de barris por dia de derivados, operando a aproximadamente 86,4% da capacidade instalada
  - INST·06 p.disc: capacidade instalada de processamento e fator de utilização de ordem de grandeza do parque nacional em 2025, conforme anuário estatístico da ANP
  - Nota: Com 86,4% de utilização, 2,2 milhões de bpd de derivados implicam capacidade da ordem de 2,5 milhões de bpd; o padrão do instrumento é 1,8 milhão, embora a disc o atribua ao anuário. CONTENT QA — verificação autoritativa necessária (P20); não resolvido aqui.
- **div-m15-inst-03** (fonte×fonte) — INST·01: nove elos diferentes dos nove do div.cad do §MAP; "natureza do preço" com 9 valores, não 4.
  - modulo.json: div-m15-01-nove-elos e div-m15-02-reagrupamentos
  - Nota: Ponteiro; detalhe no grupo modulo.
- **div-m15-inst-04** (fonte (resíduo)) — INST·01: cartão "Recebe" mostra o segmento.
  - script INST·01 painel(): '<span class="fzk">Recebe</span><span class="fzv">'+esc(e.seg)
  - Nota: Preservado na porta (fiel). Sinalizado, não corrigido (§10).
- **div-m15-inst-05** (fonte×código) — INST·09: ac-gb negativo publicado em valores.
  - fonte: (gb>0?'US$ '+fmt(gb,2):'—')
  - alexandria-instrument-calculators.ts m15-inst-09: put("ac-gb", gb);
  - Nota: Prova de fidelidade: 9 casos em 83 em que a fonte mostra "—" e a porta entrega número negativo ao painel.
- **div-m15-inst-06** (fonte×código) — INST·09: rótulo "O&amp;M" com entidade crua em campo de texto.
  - alexandria-modulo-15-content.ts: label: "O&amp;M variável e encargos"
  - fonte (renderizada): O&M variável e encargos
  - Nota: InstrumentPanel.tsx renderiza label como texto React; por leitura de código a tela mostraria "O&amp;M". Não medido na tela.
- **div-m15-inst-07** (fonte×código) — Prefixos monetários e casas decimais.
  - fonte: 'R$ '+fmt(rb,1)+' bi' · 'US$ '+fmt(nom,2) · fmt(v1,3)
  - código: unit "bi" / "/MMBtu" / "/MWh"; painel fmt(v, 2) com maximumFractionDigits
  - Nota: INST·04, 05, 07 e 09 perdem R$/US$ na tela; INST·03 perde a 3ª casa (17,488 → 17,49); readouts de 0 casas passam a mostrar decimais. Leitura de código.
- **div-m15-inst-08** (fonte×código) — Seletores e chips reestruturados.
  - INST·08: dois grupos seg (cl-gr, cl-gr2) → um select cl-gr de 6 opções
  - INST·01 / INST·10: chips gerados pelo script → select com label "Elo da cadeia" / "Enunciado", textos que não existem na fonte
  - INST·01 porta: antepõe ao painel a linha "<dimensão> · <sobrelinha do chip>" (composição da porta a partir de DIMS[d].lb e ELOS[k][d])
  - Nota: Conteúdo textual preservado (prova de fidelidade 100%); a forma de escolha e dois rótulos são da porta.
- **div-m15-inst-09** (fonte×código) — INST·01 não alcança a interface.
  - código: MODULO_15_INSTRUMENTOS = [m15-inst-01]
  - RecursosDoModulo.tsx: não importa MODULO_15_INSTRUMENTOS; RECURSOS só tem 'modulo-01'..'modulo-09'
  - Nota: Leitura de código.
- **div-m15-inst-10** (fonte×código) — Procedência (p.disc) e tom do veredito não portados.
  - fonte: 10 p.disc com fonte/data de consulta; classe verdict ok/att/per em 25 ramos
  - código: Instrument sem campo de procedência; ResultadoInstrumento = { valores, veredito }
  - Nota: P19 exige mostrar "cenário didático; fonte externa não declarada" — a disc é a origem literal dessa informação e não está no código.
- **div-m15-inst-11** (fonte×taxonomia) — M15 fora do catálogo de instrumentos.
  - docs/alexandria/instrument-taxonomy.md: auditoria cobre Módulos 01–07
  - código: INST·03/07/09 simulador, INST·04/05/06 calculadora, INST·01/08/10 explorador, INST·02 comparador
  - Nota: Três "Régua" com kinds diferentes e mecânica equivalente; pendência FOUNDRY.

## Verificação

Verificador independente (scripts próprios, sem reaproveitar `lib.mjs` nem `verify-m15.mjs`): o `var Q` do quiz
foi avaliado direto do HTML e comparado campo a campo; checklist, exercícios, glossário, referências, erros comuns e
roteiro oral foram reparseados por regex próprio e comparados em igualdade estrita (html com espaços colapsados);
as 558 origens com `linha_aprox` dos três JSONs foram conferidas contra a janela de ±3 linhas; as linhas de cálculo,
fórmulas de exibição e ramos dos 10 instrumentos foram conferidos na linha declarada; os `dados_script` foram
reavaliados do literal e comparados em profundidade; as contagens foram recontadas no HTML.

Resultado neste grupo: 100% das linhas de `calculo_script`, das `formula_script` e dos ramos na linha declarada;
`dados_script` idênticos ao literal nas 9 estruturas avaliáveis (o `M` do INST·08 depende da função `si` e não foi
reavaliado isoladamente); fidelidade reexecutada com o mesmo resultado (1.549 casos; INST·09 com 9 valores
incoerentes em 83).

**Correção 2 — origem fora da janela.** O seletor `cl-gr2` (INST·08) não tem `seg-lb` próprio e herdava como
`trecho_inicial` o rótulo "Grandeza citada" da L2242, 6 linhas acima da `linha_aprox` 2248. O trecho passa a ser o
do próprio grupo ("Capacidade"); o rótulo herdado e a nota continuam em `rotulo`/`rotulo_nota`.

**Correção 3 — templates de contêiner não extraídos.** Os `innerHTML` de painéis, barras e legendas (`mp-flux`,
`mp-panel`, `rg-out`, `gs-bars`, `pe-bars`, `cb-bar`, `cb-lg`, `gc-bars`, `cl-out` ×2, `ac-track`, `vf-panel`)
e a lista `segs` do INST·05 ficavam fora da extração. O texto que eles exibem só aparecia no cenário-padrão
renderizado, e parte dele não aparecia em lugar nenhum: o ramo "Não se aplica." do INST·08 ("Por que não",
"Onde essa grandeza mora"), os rótulos de barra ("Part. especial", "Efetivo consumido"…), a legenda de subvenção
do INST·05 e as faixas "ordem de mérito"/"fora do mérito" do INST·09. Agora ficam literais em
`conteineres_dinamicos[].templates_script` e `lista_segs_script`, conferidos pelo `verify-m15.mjs` (491 → 504
strings, 0 falhas).

**Segunda verificação adversarial (2026-09-17), sem correções.** Scripts novos, sem reaproveitar os extratores:
as 548 origens com `trecho_inicial` ficaram dentro de ±3 linhas; 1.003 campos de texto e 1.103 campos html/script
foram buscados na fonte normalizada, e as únicas ausências são anotações (`literal` das divergências, que compõem
leituras) e textos calculados (`cenario_padrao.veredito`), além do espaço que o `texto` das fichas insere antes de
`span.mini`. Houve igualdade estrita em 10/10 questões do quiz, 2/2 faixas, 28/28 itens do checklist, 15/15
exercícios, 174/174 termos, 36/36 referências, 20/20 erros e 9/9 trechos de voz. Conferiram também as 34 fórmulas
de readout (cada escrita do script, na linha declarada), as 88 linhas de cálculo e os 25 ramos, que batem com as
25 classes `verdict` do script. As contagens recontadas no HTML batem com as declaradas: 33 entradas, 11 grupos
`seg`, 34 células `ro`, 11 linhas "GridAlpha" (10 + 1 no script), 10 blocos P7 e 6 "Preencha.". Os 4 valores
distintos de seg, os 5 de reg, os 4 de ac e os 9 de pr foram reavaliados do `var ELOS`. As afirmações sobre o
código foram reconferidas: `RECURSOS` vai até `modulo-09`, `O&amp;M` aparece na L693, `put("ac-gb", gb)`,
o painel usa `maximumFractionDigits` e há 2/2 horas em `alexandria-blocks.ts`.
