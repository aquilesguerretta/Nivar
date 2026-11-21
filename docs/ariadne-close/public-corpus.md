# Authentic public corpus — provenance and retrieval

Local package: `C:\dev\ariadne-real-public-evaluation-20261003`, outside the repository/webroot. Originals, byte-preserving derivatives, HTTP acquisition sidecars, source verification scripts, native text/renders, browser evidence and exact saved export are retained there. **No ARIS PDF/extract/render/screenshot is committed or published**: public availability was verified, redistribution license was not established. ANEEL catalog/resources identify ODbL; attribution/license notices are preserved. Only metadata/retrieval instructions are committed here.

| Artifact | Bytes | Acquired UTC / version | SHA256 |
|---|---:|---|---|
| ARIS original administrative process |26680861|2026-10-03T21:47:00.043040Z|165b27b70497ba8b77724dd44687d3dd8ae2dc2defa134ca0af3a11e830864ed|
| Authentic invoice page derivative |133632|derived21:49:19.615566Z; passive provenance added21:56:17.044677Z|d45a16a3ededfb98efc1fa57419fbf48e411bee9a8b56815a4ca183d77a3d588|
| ANEEL original tariff CSV |89235715|2026-10-03T21:47:17.375489Z; generated2026-10-03|1159c6d01d383a1f4a5c4396db73778f3d8da809ffd00ea4210f077fae1beb02|
| ANEEL original dictionary PDF |198697|2026-10-03T21:46:51.795974Z; HTTP modified2026-06-12; documentv1.0 dated2022-03-15|6233892f8512c3064dce107066459557fcc29c7df18c3dec28284e2bacabc6ef|
| ANEEL B3 application five-row subset |1686|derived2026-10-03T21:51:07.873699Z|2cfa1ed02cc90c430284174a05c758d7b63a856dccbc16e6cab468fc10e57c8a|
| ANEEL broader122-row period subset |33304|same acquisition; original rows178153–178274|4018e5b0b04a8e4c121382549578f028039ef98e0e307bd09730de21df2dc84c|

Sources:

- [ARIS original process](https://aris.ce.gov.br/consultaarquivo/22/132/processo.pdf).
- [ANEEL catalog](https://dadosabertos.aneel.gov.br/dataset/tarifas-distribuidoras-energia-eletrica), catalogv1.0, metadata modified2026-10-03T10:03:44.847764, weekly updates.
- [Official tariff CSV resource](https://dadosabertos.aneel.gov.br/dataset/5a583f3e-1646-4f67-bf0f-69db4203e89e/resource/fcf2906c-7c32-4b9b-a637-054e7a5234f4/download/tarifas-homologadas-distribuidoras-energia-eletrica.csv).
- [Official dictionary resource](https://dadosabertos.aneel.gov.br/dataset/5a583f3e-1646-4f67-bf0f-69db4203e89e/resource/2d3478e0-8aa0-4cd4-81a7-5f8967cd8804/download/dd-tarifas-por-distribuidora.pdf).
- [Open Database License](https://opendatacommons.org/licenses/odbl/1-0/). Attribution: Contains information from ANEEL, Tarifas de aplicação das distribuidoras de energia elétrica, made available under the Open Database License (ODbL). Assess applicable license conditions before redistribution.

## Exact derivation

The process has304 pages. The requested invoice is **physical page190, zero-based189, printed footer Pág.189**. Physical page189 is a different invoice. `pypdf.PdfWriter.add_page(PdfReader(original).pages[189])` copied its authentic page. Decoded page contents, media box and native text were verified identical. Added passive Info metadata records original URL/hash/acquisition, physical/printed page and method; those assertions remain untrusted attribution until human review. No source text/images were recreated. Matching JSON sidecar also binds the derivative's own hash.

ANEEL subset retains exact original header plus complete original UTF-8 byte lines, semicolon delimiter, values/order/line endings. Filter:

```text
NumCNPJDistribuidora == 07047251000170
DatInicioVigencia <= 2021-09-30
DatFimVigencia >= 2021-09-01
DscSubGrupo == B3
DscBaseTarifaria == Tarifa de Aplicação
```

Original CSV row numbers (including header):178262,178264,178265,178266,178270. Subset rows2–6 correspond in that order; conventional B3 original178266 is subsetrow5. Sidecar retains filter, original URL/hash, subsethash, original row numbers, units attribution and ODbL. No application-schema fields, meter quantities or independent prices were invented. The broader subset omits the last two filters.

Dictionary says monthly updates and uses some older field names; the current catalog says weekly and the CSV headers differ. Those discrepancies are retained. Dictionary establishes TE/TUSD monetary units by applicable MWh/kW field; the relevant candidate is BRL/MWh. This is not tax-basis or applicability proof.

## Reproduce outside the app

Reuse the preserved package for exact historical comparison. Its `acquire_public.py` downloads only explicit source URLs, records response metadata/hash and refuses overwrite; `derive_invoice_page.py` copies the page, `add_passive_provenance_metadata.py` records attribution, `filter_tariffs.py` selects original lines, `build_evaluation_report.py` checks expected arithmetic independently of application functions, and `validate_package.py` verifies artifact hashes/sizes. These are local evaluation aids, not product URL ingestion.

On another machine, download the URLs above into a **new directory outside the repository/webroot**, record actual acquisition time/final URL/hash before processing, and compare hashes with this table. If a resource changed, label it a new corpus version; do not claim it reproduced this acquisition. Copy physicalpage190 with pypdf, verify unchanged decoded contents/native text/media box, append the passive provenance metadata/sidecar. Filter the CSV by the exact predicates above, retaining header and complete original byte lines; first confirm there are no multiline records, otherwise use record-aware byte boundaries. Preserve source license notices. Do not overwrite retained originals or source versions.

The primary product imports the resulting authentic page/subset and matching sidecars via normal file input. The app never downloads provenance URLs. Whole originals exceed its bounded8MiB intake, and the304-page process exceeds its100-page bound; this preprocessing is a real remaining operator burden, not hidden product automation.

## Claims supported and excluded

Verified invoice131111946, reference09/2021, total91.43BRL, distributorCNPJ07047251000170, account9010675. Native display arithmetic supports four internal checks. The meter panel reports0.00kWh and unchanged readings240378.00; the billed100.000 factor has no explicit line unit and is not an independent measurement. Reference month is not assumed equal to a calendar consumption interval. HeaderGRUPO A and B3/B-Optante classification require qualified applicability review.

ANEEL's conventional context row has TE257.20/TUSD331.58BRL/MWh, validity2021-04-22–2022-04-21, REH2859/2021. White/prepayment alternatives remain visible. The invoice has availability/flag/benefits rather than separable billedTE/TUSD, no independent eligible quantity and no comparable tax basis. **All seven rows remain NOT independently verifiable.** Neither source proves overbilling, savings, tax compliance or complete expected invoice entitlement.
