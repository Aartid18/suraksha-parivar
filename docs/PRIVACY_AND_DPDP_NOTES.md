# Privacy & DPDP Act Compliance Notes - Suraksha Parivar

> [!NOTE]
> Disclaimer: This is an engineering design document mapping technical features to principles of India's Digital Personal Data Protection (DPDP) Act. It does not constitute formal legal advice.

## Technical Implementation of DPDP Principles

| DPDP Principle | Suraksha Parivar Technical Mitigation |
| :--- | :--- |
| **Notice & Plain Language** | Clear notice in English, Hindi, and Marathi on the landing and check screen prior to submission. |
| **Affirmative Consent** | Explicit consent toggle required before any check summary is shared with a family guardian. |
| **Data Minimisation** | Phone numbers, UPI IDs, Aadhaar numbers, and emails are redacted *before* processing. Raw text is never stored by default. |
| **Purpose Limitation** | Redacted inputs are processed strictly to calculate scam risk scores; data is never sold or used for ad targeting. |
| **Retention & Erasure** | Auto-expiring retention worker (Checks: 7 days, Alerts: 30 days, Incidents: 90 days). Instant user erasure via `DELETE /v1/me`. |
| **Data Portability / Export** | Complete user JSON export available via `GET /v1/me/export`. |
| **Encryption at Rest** | Evidence pack fields (UTR, suspect handles) encrypted with AES Fernet. |
