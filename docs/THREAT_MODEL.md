# STRIDE Threat Model - Suraksha Parivar

## Threat Matrix

| Threat Category | Potential Attack Vector | Mitigation in Suraksha Parivar | Residual Risk |
| :--- | :--- | :--- | :--- |
| **Spoofing** | Fake invite links used to gain unauthorised guardian access. | Single-use 48h invite tokens hashed with SHA-256 in memory/DB. | Low |
| **Tampering** | Scammers attempting prompt injection inside check messages to alter verdict. | Untrusted inputs delimited inside `<UNTRUSTED_MESSAGE>` tags; strict JSON schema validation; hard rule overrides. | Low |
| **Repudiation** | User denies granting consent to alert family guardian. | Audit log records timestamped consent grant and level (`alert_only`, `redacted_summary`, `full_message`). | Low |
| **Information Disclosure** | PII leakage in LLM logs or API responses. | Client-side and preprocessor PII redaction (phones, UPI IDs, Aadhaar numbers) before LLM invocation. | Low |
| **Denial of Service** | API flooding with massive text/image requests. | Rate limiting per IP, 4000 character limit on checks, 10MB image upload cap. | Low |
| **Elevation of Privilege** | Unauthorised member attempting guardian status. | Role-based permission checks on family endpoints. | Low |
