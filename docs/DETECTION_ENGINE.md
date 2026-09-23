# Detection Engine Specification - Suraksha Parivar

## Overview
The detection engine operates as a deterministic 4-step pipeline where AI is a component, not the sole judge of last resort.

## Pipeline Steps
1. **Preprocessing & PII Redaction (`step_0`)**:
   - NFKC normalization, whitespace collapsing, 4000 character cap.
   - Regex-based PII masking for phone numbers, account numbers, UPI IDs, Aadhaar 12-digit numbers, and emails.
2. **Deterministic Rules Engine (`step_1`)**:
   - Evaluated against `rules/scam_rules.v1.yaml`.
   - Negation handling: Inspects 30-character context window prior to pattern matches for negation keywords (`do not`, `never`, `न करें`, `सांगू नका`).
3. **Knowledge Base Retrieval (`step_2`)**:
   - Searches top-k matching scam patterns and official advisories (I4C, RBI, NCPI) via pgvector embeddings or BM25 fallback.
4. **Structured LLM Classification (`step_3`)**:
   - Structured JSON output validated by Pydantic (`LLMVerdictSchema`).
5. **Score Fusion & Hard Overrides (`step_4`)**:
   - Formula: `final_score = int(0.50 * rule_score + 0.40 * llm_risk_score + 0.10 * kb_sim_score)`
   - Hard Overrides: If rules detect explicit requests to share OTP/PIN, install remote APKs, or transfer money to "safe" accounts, verdict is forced to `LIKELY_SCAM` with `risk_score >= 85`.
