# NIV-88 · SEC EDGAR Submissions da Petrobras

O adaptador interno usa apenas o feed de submissões da Petrobras (`0001119639`). O transporte padrão consulta exclusivamente `https://data.sec.gov/submissions/` por HTTPS. As URLs de documentos são referências construídas para eventual revisão autorizada. Nenhuma delas é requisitada pelo adaptador.

## Executar offline

Na raiz do worktree, com o ambiente Python do projeto:

```powershell
python -m pytest -q tests/argos_sec_edgar
```

Os testes injetam `httpx.MockTransport` e relógio monotônico. Os accessions, nomes de arquivos e datas dos testes foram criados para esta suíte. O CIK identifica o recorte real do adaptador.

Em um cliente injetado, `poll()` avalia o bloco `recent`. `poll(archive_pages=3, filed_from=date(2026, 1, 1), filed_through=date(2026, 11, 20))` usa a janela inclusiva proposta em NIV-90. A seleção percorre os arquivos que o feed declara para o mesmo CIK e exclui os que têm intervalo conhecido fora da janela. O limite por poll é de três arquivos históricos na ordem da SEC. A saída informa quantos arquivos elegíveis estavam disponíveis e quantos foram examinados. A lista e o orçamento não garantem cobertura histórica integral. A data de corte filtra `filingDate` no estado observado durante o poll.

## Identidade, versões e direitos

- Candidato a Source Registry `sec.edgar.submissions.0001119639`, conforme NIV-90. `SOURCE` descreve o recurso, seu publicador, CIK, razão social, cadência upstream e escopo de autoridade. `local_archive`, `client_display` e `external_api` têm direitos desconhecidos e o conjunto de canais habilitados está vazio. A futura integração consulta o `read_source` de NIV-83 para o canal atual, antes de retenção, exibição, API ou acesso a versões históricas.
- O Document ID é `document:sec-edgar:<accession>`. A referência J2 `sec-cik:0001119639` é um identificador externo do emissor. A associação a um CorporateEntity persistido pertence à integração J2. A projeção retém formulário, accession, `filingDate`, carimbo nativo de `acceptanceDateTime`, `reportDate` quando informado, nome validado do documento e referência à SEC. Idioma e disseminação ficam desconhecidos. `observed_at` usa UTC na primeira observação da versão e `checked_at` registra o sucesso da checagem.
- `new`, `unchanged` e `corrected` descrevem os metadados no recorte. SHA-256 cobre apenas a projeção normalizada. Correções para o mesmo accession incrementam a revisão e apontam para a versão anterior. Um `/A` com accession novo tem identidade própria. A origem de uma emenda exige evidência separada. Uma linha ausente pode refletir rotação ou cobertura parcial.
- A SEC é a fonte do registro do filing. A base de conhecimento deve tratar eventuais declarações no documento como atribuídas ao emissor até revisão independente. Este adaptador gera metadados de Document. A filtragem editorial de J2 para `20-F`, `20-F/A`, `6-K` e `6-K/A` pode ocorrer na integração autorizada.
- O cache de processo mantém só validadores e metadados normalizados. A janela e os validadores só avançam após a validação de todas as páginas selecionadas. Falhas retornam erro. Os caches e o estado de revisão do cliente são descartados no encerramento. Integração posterior com o registro precisa validar direitos e dispor de política para retirada confirmada, retenção e revisão das permissões.

## Smoke manual em desenvolvimento

Somente após autorização de aquisição real, configure `ARGOS_SEC_EDGAR_USER_AGENT` com o nome da organização e o e-mail operacional real do responsável. O processo requer `ARGOS_SEC_EDGAR_ENV=development` e o opt-in explícito abaixo. Os deploys identificados por Railway, Vercel ou `APP_ENV` de produção são recusados.

```powershell
$env:ARGOS_SEC_EDGAR_ENV = 'development'
python -m app.adapters.argos_sec_edgar --allow-live
```

O smoke verifica o bloco recente e imprime somente a contagem. O piloto usa uma requisição em voo e espaçamento mínimo de um segundo entre inícios de requisição, compartilhado pelos clientes reais no mesmo processo. Use um único processo no piloto para preservar o limite agregado. Em 403 ou 429, o processo pausa por pelo menos dez minutos e respeita um `Retry-After` maior. Nova tentativa depende de outra chamada após a pausa. Demais falhas propagam erro para o chamador.

[API de submissões](https://www.sec.gov/search-filings/edgar-application-programming-interfaces) · [EDGAR Fair Access e correções pós-aceite](https://www.sec.gov/search-filings/edgar-search-assistance/accessing-edgar-data) · [Internet Security Policy](https://www.sec.gov/about/privacy-information)

[NIV-83 · contrato de integração](https://linear.app/nivarenergy/issue/NIV-83/argos-source-registry-runtime-v0-executable-rightshealth-contract#comment-5a076fc3-089f-48b7-ad7e-b3997c15b529) · [NIV-90 · decisão de pesquisa por canal](https://linear.app/nivarenergy/issue/NIV-90/argos-source-rights-and-cadence-p1-evidence-for-first-global-api#comment-2b2952de-78b2-4071-8449-85b599407b8a)
