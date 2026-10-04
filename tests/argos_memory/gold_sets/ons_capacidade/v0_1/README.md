# Signal Gold Set v0.1

This directory is reference behavior for the Founder-approved Signal policy, not a Signal runtime implementation.

All controlled fixtures and contexts are synthetic (`TEST-GOLD-*`) and are never publisher history. SG-001 records independently verified M3 evidence by reference only; tests never connect to production.

`argos.signal-gold.ons-capacidade@0.1` is the released baseline. Its explicit release state is `RELEASED`; no future/reserved identifier is represented. This NIV-47 promotion is based on the accepted NIV-44/NIV-45 contract and makes no semantic policy changes. Engineering must not reinterpret the approved decisions or claim contracts in this pack.

`expected_policy.py` is the independently authored frozen semantic contract used to validate `manifest.json`. It pins the exact top-level metadata, per-case shapes, policy values, all SG-001..020 evidence references, and all SG-017..020 controlled-context payloads. Exact equality includes JSON types, so numeric values cannot substitute for booleans.

SG-001/015/016/017/018 must carry `content_delta: null`. SG-002..014/019/020 require a ContentDelta object. Their complete deltas are recomputed from actual fixture bytes through the existing parser/diff and cross-checked against frozen event facts, including identity. SG-019 retains a real delta despite its controlled rights context.

Acceptance requires both `validate_manifest` (frozen policy, conditional null rules, actual context artifacts) and the focused behavioral suite (real parser/diff output and event consistency). The policy validator alone does not recompute ContentDelta values. Reference validation never contacts production.

[INVARIANT_AUDIT.md](INVARIANT_AUDIT.md) records the complete pre-implementation field matrix, authority boundaries and attack model. The focused suite contains an explicit test-only coverage map and tests that it rejects new allowed fields without an authority. It also mutates every manifest/context field and exercises coordinated fixture/delta drift without changing committed evidence.
