# ARGOS Investigate v0 (NIV-86)

## Executar localmente

```powershell
npm ci
node tests/argos_investigate/server.mjs
```

Abra `http://127.0.0.1:5286/tests/argos_investigate/fixture.html`. O harness usa a porta 5286 em loopback e inicializa Vite em `argos-local` com configuração isolada. Dispensa backend, banco e arquivos de ambiente.

Busque **TOPCon**, **China wafers 2024**, **Evento MOFCOM** ou **Pesquisa tandem**. As relações têm destino e predicado. O acervo só mostra leitura sustentada por uma revisão permitida. Imagens reservadas têm legenda que identifica a futura ilustração autoral ou a fotografia licenciada.

Em **Ver evidência**, a gaveta identifica fonte, documento, versão, datas disponíveis e direitos. Feche com Escape ou **Fechar** para retornar ao botão de origem. Em um marco com histórico, selecione a versão anterior, abra novamente a gaveta e copie o link local para reproduzir a leitura. Um link fixado traz as duas versões exatas e sempre inicia com a gaveta fechada. O parâmetro `q` preserva a consulta para o retorno aos resultados.

## Integração

`Investigate` recebe um `InvestigateCatalog` sob o router React e os tokens NIVAR. O adaptador de demonstração em `catalog.ts` projeta as jornadas J1, J3 e J4 já incorporadas na base. IDs e valores vêm dos respectivos modelos. A mesma observação é apresentada em wafer e China. O alias da jurisdição J3 aponta para `country:CHN`. Textos editoriais derivam de pares autorizados de fato e documento, e relações dependem da resolução da evidência indicada.

NIV-82 é o ponto de integração da navegação. Depois de disponibilizado, o envelope do NIV-85 fornece identidade, predicados e referências versionadas ao adaptador web. Os resultados restritos devem ser projetados como status sem conteúdo. Os campos de publicação, coleta, conhecimento e corte são distintos. O protótipo reproduz pins exatos e deixa filtros gerais `as_of` e `known_at` para a integração do contrato. J2 aguarda sua integração na base.

O módulo de apresentação e o fixture ficam fora da entrada padrão do Vite. A demonstração usa resumos autorais e metadados para revisão privada. Atos do MOFCOM usam referência bibliográfica. Os ensaios de tandem permanecem no escopo do dispositivo e do método reportados.

## Verificação

```powershell
node --experimental-strip-types --test tests/argos_investigate/reading.test.ts
npx tsc -b tests/argos_investigate/tsconfig.json
npx eslint src/features/argos_investigate tests/argos_investigate

# Aponte para uma instalação do Playwright e use o Chrome instalado.
$env:ARGOS_PLAYWRIGHT = 'C:/Users/aquil/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright'
node --test tests/argos_investigate/browser.test.mjs

npm run build
$env:VERCEL_ENV = 'preview'
$env:ARGOS_INVESTIGATE_PREVIEW_DIST = Join-Path $env:TEMP 'niv-86-investigate-preview'
npx vite build --outDir $env:ARGOS_INVESTIGATE_PREVIEW_DIST --emptyOutDir
node --test tests/argos_investigate/build-exclusion.test.mjs
```

O teste de Chrome inicia seu próprio harness. As capturas usam `ARGOS_INVESTIGATE_SCREENSHOTS` ou a pasta `niv-86-investigate` em `TEMP`.
