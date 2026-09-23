# Architectural Decision Records (ADRs) - Suraksha Parivar

## ADR 001: Hybrid Detection Engine over Pure LLM
- **Status**: Accepted
- **Context**: LLM hallucination or high latency on pure LLM calls poses unacceptable risks for high-stakes scam detection.
- **Decision**: Use a deterministic 4-step pipeline where YAML rules and hard overrides force `LIKELY_SCAM` when explicit requests to share OTP/PIN, install remote APKs, or move money are matched.
- **Consequences**: Zero false negatives on explicit OTP/APK requests; predictable execution.

## ADR 002: Pre-LLM Client-Side & Server-Side PII Redaction
- **Status**: Accepted
- **Context**: DPDP Act mandates data minimisation and purpose limitation for personal digital data.
- **Decision**: Phone numbers, account numbers, UPI IDs, Aadhaar numbers, and emails are redacted before any external LLM invocation.
- **Consequences**: User chat content remains private.

## ADR 003: Verified Helpline Numbers Centralization
- **Status**: Accepted
- **Verification Date**: September 23, 2026
- **Verified Sources**: Official Ministry of Home Affairs I4C (cybercrime.gov.in) & Department of Telecommunications (sancharsaathi.gov.in).
- **Central Config**: `HELPLINE_1930_NUMBER="1930"`, `PORTAL_URL="https://cybercrime.gov.in"`, `CHAKSHU_URL="https://sancharsaathi.gov.in/sancharsaathi/"`.
