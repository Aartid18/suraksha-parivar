# Case Study: Suraksha Parivar (सुरक्षा परिवार)

## Executive Summary
Cyber fraud in India accounts for tens of thousands of crores in monetary losses annually, with over 15+ lakh complaints registered on the National Cyber Crime Reporting Portal. Maharashtra and major metropolitan hubs report high vulnerability to sophisticated digital scam patterns including fake police/CBI "digital arrests", UPI PIN refund tricks, and electricity disconnection threats.

**Suraksha Parivar** was designed and engineered as a family-first anti-scam shield to solve three critical bottlenecks:
1. **Language & Clarity**: Translating complex fraud warnings into plain Hindi, Marathi, and English.
2. **Speed & Isolation Reduction**: Enabling 1-tap alerts to trusted family guardians before money or OTPs are lost.
3. **Panic Flow**: Providing a step-by-step guided action plan during the first 30 critical minutes post-fraud to freeze bank transactions and generate a pre-formatted Evidence Pack PDF for Cyber Crime Helpline 1930.

---

## Target Personas
- **Protected Member (Age 50-75)**: Prefers Hindi/Marathi, uses WhatsApp and UPI, medium digital confidence. Needs big readable text, voice read-aloud (Web Speech API), clear traffic-light verdicts, and reassurance.
- **Family Guardian (Adult Child)**: English/Hindi comfortable. Needs privacy-preserving alerts, 1-tap WhatsApp (`wa.me`) or call back actions, and status tracking without reading private chats.
- **Self-User**: Needs quick no-login checks with 100% on-device/redacted privacy.

---

## Technical Highlights & Evaluation Results
- **Hybrid Multi-Layer Engine**: YAML rules engine v1 + LLM structured classification + pgvector Knowledge Base retrieval with hard override safety rules.
- **Precision & Recall**: Evaluated against a synthetic 410-item dataset (260 scam + 150 benign hard-negatives):
  - **F1 Score**: 87.78%
  - **Precision**: 95.07%
  - **Recall**: 81.54%
  - **Benign False-Positive Rate**: 7.33%
  - **Latency (p50)**: < 10 ms (Local Rules/Mock)
- **DPDP Act Compliance**: Zero raw text storage, pre-LLM PII redaction, 7/30/90-day retention limits, instant data export (JSON), and permanent data erasure (`DELETE /v1/me`).
