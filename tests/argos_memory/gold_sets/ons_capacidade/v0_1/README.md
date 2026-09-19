# Signal Gold Set v0.1-alpha

This directory is reference behavior for the Founder-approved Signal policy, not a Signal runtime implementation.

All controlled fixtures and contexts are synthetic (`TEST-GOLD-*`) and are never publisher history. SG-001 records independently verified M3 evidence by reference only; tests never connect to production.

`argos.signal-gold.ons-capacidade@0.1-alpha` is materialized here. The released identifier `argos.signal-gold.ons-capacidade@0.1` remains reserved. Engineering must not reinterpret the approved decisions or claim contracts in this pack.

`expected_policy.py` is the independently authored frozen semantic contract used to validate `manifest.json`. It pins policy-critical fields, SG-001's reference-only evidence pointers, and the policy-relevant SG-017/018/020 controlled-context payloads without duplicating fixture bytes or the full manifest. Deterministic fixture behavior is still recomputed through the existing parser/diff tests; reference validation never contacts production.
