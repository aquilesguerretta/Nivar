# Um dia real: geração por usina hora a hora e corte eólico e solar (ONS)

Dado do modo "dia real" do capítulo "Um dia". Produz `public/alexandria/atlas/dados/operacao-dias.json`
(cerca de 445 KB; cinco dias, ~640 entidades). O perfil médio do mês (`serie-perfil-horario.json`, de
`construir.mjs`) continua sendo o modo padrão do capítulo; este arquivo é outra coisa.

## Reproduzir

```
node tools/alexandria-atlas/operacao/baixar.mjs        # bruto em tools/alexandria-atlas/bruto/operacao/ (fora do git), ~600 MB, ~2 min
node tools/alexandria-atlas/operacao/construir.mjs     # monta o arquivo publicado e as entradas operacao-* do manifesto (~15 s)
node tools/alexandria-atlas/gerar-procedencia.mjs      # seção 9b da procedência
```

Opções: `baixar.mjs --hoje AAAA-MM-DD` (data que decide os trimestres fechados), `--meses AAAA-MM,…` (troca a
lista dos mensais), `--so <regex>`; `construir.mjs --dias AAAA-MM-DD,…` (só ensaio: o arquivo diz "ensaio"),
`--sem-manifesto`. Node 24, sem dependência nova: os mensais vêm em CSV e são lidos linha a linha (o Parquet
pediria um leitor que o projeto não tem).

`baixar.mjs` grava `bruto/operacao/consultas.json`: por arquivo, endereço, data de acesso, `Last-Modified` da
fonte, bytes e SHA-256 (calculado no caminho, com o arquivo indo em fluxo para o disco; o download para se os
bytes não baterem com o `Content-Length`). `construir.mjs` recusa rodar se algum arquivo do bruto não bater com
o SHA-256 registrado. User-Agent genérico, sem conta, sem formulário.

## Regra dos dias (`comum.mjs`)

- Para cada um dos QUATRO últimos trimestres fechados antes da data do acesso, o dia de maior carga do SIN: a
  maior soma das 24 horas de `val_carga` da linha SIN do balanço de energia por subsistema, contando só dia
  com as 24 horas de carga > 0.
- Mais o último dia completo publicado: o mais recente inteiro nas quatro bases (geração por usina, 24 horas;
  corte eólico e fotovoltaico, 48 meias-horas; balanço, 24 horas). Em 16/11/2026 a geração e o corte iam até
  15/11, o balanço até 14/11: valeu 14/11.
- Acesso de 16/11/2026: 02/12/2025, 19/02/2026, 07/04/2026, 30/09/2026 e 14/11/2026.

## Fontes (todas do ONS, portal dados.ons.org.br, CC-BY declarada sem versão)

| Arquivo do bruto | Conjunto |
| --- | --- |
| `ons-geracao-usina-AAAA-MM.csv` | `geracao-usina-2`: geração verificada horária por usina, conjunto e grupo de pequenas usinas (MWmed) |
| `ons-corte-eolica-AAAA-MM.csv` | `restricao_coff_eolica_usi`: constrained-off eólico, semi-horário |
| `ons-corte-fotovoltaica-AAAA-MM.csv` | `restricao_coff_fotovoltaica`: constrained-off fotovoltaico, semi-horário |
| `ons-balanco-AAAA.csv` | `balanco-energia-subsistema`: carga por subsistema (publicada) e geração por fonte (conferência) |
| `ons-relacionamento-usina-conjunto.csv` | `usina_conjunto`: membros de cada conjunto, com início e fim |
| `ons-dicionario-*.json`, `ons-pacote-*.json` | dicionários e metadados CKAN (as definições citadas no arquivo saem daqui) |

O ponto de cada usina é o que o Atlas já publica (`usinas-principais.json` e `usinas-menores.json`, ANEEL SIGA).

## Como o casamento é feito

- **Usina:** núcleo do CEG (4º bloco, antes do hífen) do ONS contra o do Atlas, como `construir.mjs` já faz
  para `mwOns`. O sufixo difere entre as bases (`.01` no ONS, `.1` na ANEEL). A chave publicada (`ceg`) é a da ANEEL.
- **Conjunto** (`Conjunto de Usinas`, sem CEG): membros pela relação do ONS vigente no dia (início ≤ dia ≤ fim),
  o mesmo CEG contado uma vez (a relação repete membros em alguns conjuntos). O ponto é a média das posições dos
  membros que o Atlas desenha. A geração NÃO é repartida entre os membros. A lista de `entidades` é a do dia
  mais novo em que o conjunto aparece; num dia em que a composição era outra, `dias[].membrosNoDia` traz os
  membros, os sem ponto e a potência somada daquele dia (hoje: Caju, 18 membros até abr/2026 e 20 depois; e
  Serra do Tigre, `CJU_RN5ETGS`, mesma contagem e outro membro). O ponto continua o do dia mais novo, e a ficha diz.
- **Subsistema:** o arquivo de geração de cada MÊS traz o subsistema como estava no mês. O ONS passou dois
  conjuntos de subsistema: `CJU_BASDA1` (Serra das Almas II, BA) é NE nos arquivos até abr/2026 e SE depois;
  `CJU_MTCFAZ` (Fazenda, MT) é N em fev/2026 e SE em nov/2026. Medido: o balanço por subsistema do ONS conta
  os dois no SUBSISTEMA NOVO em todos os dias publicados (em 02/12/2025, tirar Serra das Almas II do SE deixa
  91% da eólica do SE do balanço sem par; com o subsistema do arquivo do mês, o NE vai de 0,02% a 0,38% e o
  SE com a 50 Hz de 0,00% a −0,17%). A relação usina–conjunto também os dá no novo. O Atlas usa o novo
  (`entidades.sub`); `dias[].subNoDia` guarda o do arquivo do mês e a conferência grava como ficaria com ele
  (`subsistemaDoArquivoDoMes`). Saída da medida: `subs.cjs` no rascunho da leva 4 do agente operacao.
- **Uma usina, várias linhas:** `entidades.cegEmLinhas` lista as outras linhas do ONS do mesmo CEG; `kw` é a
  potência da ANEEL para o CEG inteiro (Pimental mostra 11,2 GW porque é a potência de Belo Monte inteira): a
  ficha diz isso em vez de dar o número como da linha.
- **Sem ponto:** "Pequenas Usinas (MMGD)" e "(Tipo III)" por estado são previsão (texto do portal citado no
  arquivo) e vão somadas por hora, por subsistema e categoria, no bloco `semPonto`. As poucas entidades sem
  par no Atlas ficam em `mw` como as demais (lon/lat nulos) e só são listadas em `conferencia.semPonto.semPar`:
  não entram nos grupos, para não somar duas vezes (até a leva 3 entravam também num grupo `semPar`; estavam
  zeradas, então nenhum número publicado mudou).
- **Último dia:** o mais novo que está completo em CADA uma das quatro bases (interseção dos dias completos),
  e não o menor dos últimos dias completos de cada base, que podia cair num buraco de outra.
- **Itaipu:** `PRIT60` e `PYIT50` têm o mesmo CEG e são duas entidades; a de 50 Hz nunca entra na soma do Brasil.
  Outras usinas que o ONS publica em duas linhas com o mesmo CEG (Belo Monte e Pimental, Itiquira I e II, Anta e
  Simplício, Henry Borden externa e subterrânea) também ficam separadas, com `obs`.
- **`val_geracao` vazio** nas 24 horas: a entidade fica `null` naquele dia (sem valor publicado, que não é zero) e
  vai listada em `conferencia.entidadesSemValorNoDia`.
- **Corte:** GNRa (`val_geracaonaorealizadaapurada`), estimativa do ONS, média das duas meias-horas; motivo da hora =
  o da meia-hora de maior GNRa; texto e origem = os mais frequentes. Entra a entidade com restrição e perda ≥ 0,5 MWh.

## Conferência (gravada no arquivo, por dia)

Soma das entidades (sem Itaipu 50 Hz) + `semPonto`, por subsistema e hora, contra hidráulica + térmica +
eólica + solar do balanço do ONS. Acesso de 16/11/2026: N, NE e S dentro de ±0,3% no dia, exceto o Nordeste em
07/04/2026 (+1,09%) e 30/09/2026 (+0,82%), que vêm da eólica (a geração por usina soma 1,4–1,6% a mais que o
balanço nesses dois dias). Investigado na leva 4, sem causa achada: não é o subsistema trocado (acima; com ele o
excesso cresce), nem o bloco Tipo III (não acompanha), nem uma entidade (a melhor série única explica só um terço
do excesso por hora). Em 07/04 o excesso está nas horas 0–6 (270 a 760 MW) e é menor que 60 MW no resto do dia;
em 30/09, de noite (230–460 MW) e negativo perto do meio-dia. Fica declarado como diferença entre as duas bases do
ONS. O Sudeste só fecha (≤ 0,1%) SOMANDO a Itaipu 50 Hz: o balanço
inclui as duas linhas de Itaipu. Parte da energia do Brasil com ponto no mapa: 78,7% a 88,1%.
Uma conferência independente (que não importa nada deste construtor e lê os CSV crus) bateu série por série.
