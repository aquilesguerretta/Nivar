# Final provenance and methodology handoff

The implementing owner reports **7 monetary and 9 physical periods of 12 source invoice months**. This handoff verifies retained source provenance, not application behavior. Exclusions and aggregate coverage must come from the saved calculation. The implemented model is a bounded historical demand-only counterfactual on a reviewed tariff reference, before consumer tax additions.

## Historical documents and current historical-data snapshot

| Source / primary URL | SHA256 | Evidence |
|---|---|---|
| [Sobral invoices](https://transparencia.sobral.ce.gov.br/arquivo/nome:16cfd06787b4b3080aa992f28bd18746.pdf) | `1d9b1eba3b46dd1b6f492b4fc7060799f0821b0b3b10d7e4753c2097c2ea822c` | Physical pages 3–14: twelve invoices, March 2019–February 2020; UC 429967, A4 Horosazonal Verde. Existing native OCR on scanned images. |
| [REH 2383/2018, Enel-hosted ANEEL copy](https://www.enel.com.br/content/dam/enel-br/one-hub-brasil---2018/tarifas-taxas-impostos/cear%C3%A1/REH_2383_2018-ENEL_Ceara.pdf) | `2bc83e615d4e2fe09f4b1a01e916ad34999709c72a26bd7af48cbc417b99c84e` | Page 1 Art. 3: 22 April 2018–21 April 2019. Page 4 Table 1: A4 Verde demand application 13.59 BRL/kW, distinct from economic-base 13.11. Page 2 Art. 11: PIS/Cofins additions. |
| [MME historical 2019 report](https://www.gov.br/mme/pt-br/assuntos/secretarias/secretaria-nacional-energia-eletrica/publicacoes/informativo-setor-eletrico/informativo-gestao-setor-eletrico-ano-2019.pdf) | `274a2bff72ae1c4580b574b10ea0e09da03525ed0d442df4cad464fe57b83cae` | Printed/physical page 43: A4 Verde, ENEL CE, REH 2530, 22 April, demand TUSD 15.20 BRL/kW. |
| [DOU 18 April 2019, page 71](https://pesquisa.in.gov.br/imprensa/servlet/INPDFViewer?captchafield=firstAccess&data=18%2F04%2F2019&jornal=515&pagina=71) | `01ed5661c96d2e5e704d4ba69e7de9aed7ba0e7a6710abb1ce5308d109e007bb` | REH 2530 summary: Enel CE fifth RTP effective 22 April 2019. Summary only; annex absent. |
| [Official ANEEL CSV snapshot with historical rows](https://dadosabertos.aneel.gov.br/dataset/5a583f3e-1646-4f67-bf0f-69db4203e89e/resource/fcf2906c-7c32-4b9b-a637-054e7a5234f4/download/tarifas-homologadas-distribuidoras-energia-eletrica.csv) | `1159c6d01d383a1f4a5c4396db73778f3d8da809ffd00ea4210f077fae1beb02` | Original rows 127460 and 143912, one-based including header; dates and all dimensions retained. Snapshot generated 3 October 2026, not claimed contemporaneous with 2019. |

The CSV is an original **October 2026 official snapshot carrying historical rows**, not a contemporaneous 2019 file. Source response bodies are preserved unchanged with final URL and acquisition UTC in provenance sidecars. All final URLs equal the primary URLs shown. Acquisitions occurred 3–4 October 2026 UTC.

## Historical normative publications

| Source / primary URL | SHA256 | Evidence |
|---|---|---|
| [do-2010-09-15-s1.pdf](https://www.gov.br/mme/pt-br/arquivos/do-15-09-2010-s1.pdf) | `02a1f072a56ca6f6c796ddf4b1f9703fb32e34367e65179832cbaa60779489bf` | Official DOU historical publication; applicability below. |
| [do-2010-12-01-s1.pdf](https://www.gov.br/mme/pt-br/arquivos/do-01-12-2010-s1.pdf) | `272013b5f0528fd36cb8c4b804fcafeddebf9c3888bc9b628819a3cecd0a25f6` | Official DOU historical publication; applicability below. |
| [do-2012-04-12-s1.pdf](https://www.gov.br/mme/pt-br/arquivos/do-12-04-2012-s1.pdf) | `e7374504e38d4c601bccc2670f2b37a409b9dc79eb6b56d40b11b781daa3e009` | Official DOU historical publication; applicability below. |
| [do-2016-05-18-page-52-official.pdf](https://pesquisa.in.gov.br/imprensa/servlet/INPDFViewer?captchafield=firstAccess&data=18%2F05%2F2016&jornal=1&pagina=52) | `55739770e2f87770953ebb0826448714cf4c88b00395ba9ad559eed4907aec25` | Official DOU historical publication; applicability below. |
| [do-2016-05-18-page-53-official.pdf](https://pesquisa.in.gov.br/imprensa/servlet/INPDFViewer?captchafield=firstAccess&data=18/05/2016&jornal=1&pagina=53) | `60d1c9cf023a6fb9953d5790cb33dbf48690fdcc2393b99aa58838c97e90dca9` | Official DOU historical publication; applicability below. |
| [do-2016-06-23-page-36-official.pdf](https://pesquisa.in.gov.br/imprensa/servlet/INPDFViewer?captchafield=firstAccess&data=23/06/2016&jornal=1&pagina=36) | `b38e282e1f53396e4e19427b452f3c61454a5f632ba41288e0033b113a13260d` | Official DOU historical publication; applicability below. |

| Act / historical applicability | Relevant provisions used by integration reviewer |
|---|---|
| REN 414/2010, published/effective 15 September 2010, subject to implementation transitions | Art. 2 XXI–XXIII demand definitions; Arts. 55–56 modalities; Art. 93 overrun; Art. 94 measurement losses; Art. 104 normal billable floor; Art. 134 test-period exceptions; Arts. 224/229 transitions. |
| REN 418/2010, published/effective 1 December 2010 | Art. 1 amends REN 414 Art. 93; ordinary billing plus additional overrun. Art. 2 entry into force. |
| REN 479/2012, published/effective 12 April 2012, relevant 30/120-day transitions completed before this case | Amendments Art. 36 → REN 414 Art. 56 (one Verde demand rate); Art. 60 → Art. 92 (cycle day weighting); Art. 61 → Art. 93 (overrun); Art. 70 → Art. 104 (normal floor); Art. 95 → Art. 134 exceptions; Arts. 137–138 transitions/effect. |
| REN 714/2016, published 18 May 2016; Art. 21 takes effect 60 days afterward | Art. 6 → REN 414 Art. 63 (normal minimum 30 kW and single Verde contract). Arts. 5/20 contract provisions/transitions. DOU 23 June 2016 page 36 rectifies Arts. 16/20, without changing the Art. 63 minimum used here. |

For supported normal A4 Verde: billable demand = `max(M,C)`; trigger is strictly `M > 1.05*C`; when triggered additional overrun = `(M-C)*2*T`, alongside ordinary billing. One cycle maximum is used; peak/off-peak demands are not added. Exact Decimal and component `ROUND_HALF_UP` cents are engineering choices, not asserted mandatory ANEEL rounding law. Normative version review is bounded to the March 2019–February 2020 case window.

## Current explanatory tax pages

| Source / primary URL | SHA256 | Evidence |
|---|---|---|
| [Current MME FAQ](https://www.gov.br/mme/pt-br/assuntos/secretarias/secretaria-nacional-energia-eletrica/perguntas-frequentes) | `0025b9230d05b8c4fe80f5475e029203b40312efda39f28dabd12a30cd113808` | Question 2 / extracted text line 331: final bill price combines ANEEL tariff with consumer ICMS/PIS/Cofins additions. |
| [Current ANEEL tariff explanation](https://www.gov.br/aneel/pt-br/assuntos/tarifas/entenda-a-tarifa/custo-da-energia-que-chega-aos-consumidores) | `adc893a3491b62fdf08e6da8e53a63d61e79d1c810a260aa289b28ee39371378` | Extracted text lines 468–470: consumer taxes beyond tariff; upstream embedded tax costs are not claimed absent. |
| [Current Enel Ceará tax page](https://www.enel.com.br/pt-ceara/Tarifas_Enel.html) | `80a5f1c4fe71b6d6f3d79b6e9eb2fe279e229b3626e46d704ae40e0adff38bed` | Impostos section: consumer PIS/Cofins, ICMS and CIP beyond tariff. Current page, not a historical tax schedule. |

These HTML sources are **current explanatory pages acquired in October 2026**, not archived 2018/2019 enactments. Their narrow role is distinguishing the published tariff from consumer ICMS/PIS/Cofins/CIP additions. No tax gross-up, exemption determination or gross-invoice comparison is implemented. Embedded regulatory costs are not asserted tax-free.

## Frozen tariff applicability and remaining limits

- Original ANEEL row **127460**: ordinary application demand TUSD **13.59 BRL/kW**, inclusive **22 April 2018–21 April 2019**, REH 2383/2018. Original row **143912**: **15.20 BRL/kW**, inclusive **22 April 2019–21 April 2020**, REH 2530/2019.
- Exact dimensions: CNPJ **07047251000170**, ENEL CE, A4, Verde, application tariff, class/subclass/detail/time band/accessing agent `Não se aplica`, demand `kW`, TE zero. APE, generation, distribution-agent and special-discount contexts are not silently promoted. Scope and ordinary applicability require operator review.
- Original 2019 REH annex remains unavailable **HTTP403**. Official ANEEL CSV, MME historical page 43 and DOU page 71 remain distinct evidence; none is mislabeled as that annex. Direct consolidated CEDOC normative access also failed; retained DOU acts supply the reviewed provisions. No exhaustive all-amendments or judicial-orders certificate is claimed.
- Actual CUSD and exception records are absent from the public corpus. Normal-regime selection remains an explicit assumption; rural, recognized seasonal, test-period, raw-measurement-loss and special-arrangement treatment is excluded when unsupported.
- May's 16 April–15 May reading interval crosses the 22 April tariff change. REN 414 Art. 92 requires cycle day weighting; unsupported mixed-rate monetary coverage is excluded. March OCR is poor. Other automatic exclusions must retain their actual stored reasons.
- The original Sobral scanned images remain **2409×3437, 8.28 MP, one-bit CCITT**. Original content and raster guard are unchanged. Native OCR candidates, human inspection facts and application-confirmed eligible inputs remain distinct; local PNG renders do not replace the source.
- ANEEL dataset ODbL is recorded; other public-source redistribution rights are not inferred. No regulatory, legal, commercial or real-case gates close.

Frozen local artifacts: `sobral-fact-manifest.json`; `tariff-reference.csv`; `tariff-reference.manifest.json`; `tariff-reference-qualification.json`; independent normative contract `authority-review/formula-contract.json`. Full exact hashes, acquisition UTCs and paths are in `final-provenance-methodology-handoff.json`.
