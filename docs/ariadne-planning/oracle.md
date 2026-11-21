# Independent numerical reference

The independent reviewer authored the oracle before reading the application or using its database. It uses source-reviewed literals, a separately frozen authority contract, Decimal precision64, and hand assertions. A second Fraction/integer-cent implementation checked the outputs. The implementing owner supplied an eligibility mask after observing the parser; the mask does not repair missing automatic fields.

Committed text freezes:

- `tests/ariadne_planning/oracle-expected.json`, SHA256 `63825d69a06451aeb90bbf1529d9e46093c3390f4cbcc92570d6736f7484d475`: 34 synthetic cases, six physical scenarios across12 visually reviewed months, and11 human-readable monetary months. These human observations are NOT silently substituted into the application.
- `tests/ariadne_planning/oracle-auto-expected.json`, SHA256 `e15642c24afdf5b5bed4ebb4329b2964ce82a654859562a11adf83cef28fb30d`: the actual automatic9/12 physical and7/12 monetary mask; six scenarios and61 curve points. All469 covered component pairs passed the independent rational check.
- `independent_arithmetic_oracle.py` contains the original independent arithmetic and34 hand-asserted cases, copied without formula changes. Run it directly; it imports no application code and writes no files. The full acquisition-aware generator and rational cross-check remain outside the repository with the original corpus.

The application tests compare exact monthly amounts, deltas, aggregate subtotals and the actual HTTP61-point curve to these frozen answers. They do not generate expected values using the production executor.

Automatic coverage is June, July, August, September, October, December2019 and February2020 for money. May and November remain physically supported but not monetary. March, April and January remain automatically unsupported. Human inspection of those pages is documented separately.

| Candidate kW | Covered7-month subtotal BRL | Delta to280 BRL |
|---|---:|---:|
|260|33118.97|1644.03|
|270|32022.14|547.20|
|280|31474.94|0.00|
|280.45|31474.94|0.00|
|280.46|31048.73|-426.21|
|300|31934.59|459.65|

At February M294.48/T15.20, C280.45 triggers: threshold294.4725; regular4476.10 plus426.51 equals4902.61. C280.46 does not: threshold294.4830; total4476.10. At exact equality M294/C280, no overrun; M294.001 does trigger. Engineering HALF_UP rounding applies per component.

The lowest sampled point on220–340kW in2kW steps is288kW:30938.69BRL, delta−536.25. This is a sampled, partial historical comparison, not a continuous optimum or advice. No gross invoice reconstruction, annual total or verified savings is asserted.

Original standalone package: `C:\dev\ariadne-planning-public-evaluation-20261003\oracle-review`. Preserve freezes; never regenerate them from application outputs.
