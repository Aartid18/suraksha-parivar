# Interview Demo Script & Q&A Prep - Suraksha Parivar

## 3-Minute Demo Walkthrough

### 1. The Hook (0:00 - 0:30)
> *"Digital fraud in India causes thousands of crores in monetary losses every year. Elderly parents are targeted with fake CBI 'digital arrest' video calls or UPI refund tricks. Official helplines like 1930 exist, but victims panic and isolated. Meet Suraksha Parivar — a family anti-scam shield built in English, Hindi, and Marathi."*

### 2. Live Quick Check Demo (0:30 - 1:30)
> *"Watch how easy this is. I paste a sample message claiming to be a CBI officer demanding a video call. In milliseconds, our hybrid engine runs unicode normalization, redacts all PII, checks versioned rules, and fuses the score. Notice the traffic light card: LIKELY SCAM, 88/100 risk score, top red flags quoted directly from the text, and simple plain language advice in Hindi/Marathi. Tap 'Read Aloud' and Web Speech API reads the verdict aloud."*

### 3. Family Alert & Panic Incident Flow (1:30 - 2:30)
> *"If a parent feels rushed, one tap on 'Ask My Family' sends a consent-preserving alert to their guardian's inbox with 1-tap WhatsApp and phone call buttons. And if money was already sent, the 'I Already Responded' tab launches an emergency guided checklist with an active timer and generates a pre-formatted Evidence Pack PDF for Cyber Crime Helpline 1930."*

### 4. Measurable Evaluation Headlines (2:30 - 3:00)
> *"Behind the UI is an offline evaluation harness testing 410 synthetic items across 16 scam categories. We achieved an 87.78% F1 score, 95.07% precision, and <7.4% false-positive rate on genuine bank messages."*

---

## 60-Second Elevator Pitch
> *"Suraksha Parivar is an open-source, tri-lingual Family Anti-Scam Shield for India. It combines deterministic rules, PII redaction, and LLMs to detect digital scams in English, Hindi, and Marathi. In 1 tap, vulnerable members alert a family guardian, or launch an emergency 'First 30 Minutes' panic guide with an evidence PDF for 1930 helpline reporting. Measured at 95% precision on a 410-item evaluation benchmark."*

---

## Top 10 Technical Interview Q&As

### Q1: Why use a hybrid rules + LLM approach instead of fine-tuning an LLM?
**Answer**: Pure LLMs suffer from non-deterministic latency, hallucinations, and prompt injection vulnerabilities. Critical safety rules (e.g. direct requests to share OTP or install AnyDesk APKs) require deterministic hard overrides (`risk_score >= 85`). The rules engine acts as the primary safety gate, while the LLM provides contextual explanation.

### Q2: How do you prevent genuine bank OTP warnings from being falsely flagged?
**Answer**: Our rules engine inspects a 30-character context window prior to pattern matches for negation phrases (`do not`, `never`, `न करें`, `सांगू नका`). In our eval benchmark, this kept false positives on genuine bank alerts down to 7.33%.

### Q3: How do you comply with India's DPDP Act?
**Answer**: All PII (phones, UPI IDs, Aadhaar numbers) is redacted *before* external processing. Raw text is never stored by default. We enforce 7/30/90-day retention limits, and provide instant data export (`GET /v1/me/export`) and permanent erasure (`DELETE /v1/me`).

### Q4: How is evidence stored securely?
**Answer**: Sensitive evidence fields (UTR numbers, suspect handles) are encrypted at rest using AES Fernet application-level encryption (`cryptography` library) with keys derived via PBKDF2HMAC.

### Q5: How do you ensure Devanagari text renders properly in PDFs?
**Answer**: We use ReportLab with explicit typography style configurations and fallback string formatting to generate clean Devanagari PDFs.

### Q6: How does the family alert consent model work?
**Answer**: Members select from 3 consent levels (`Alert me only`, `Redacted summary`, `Full message`). No alert is dispatched to a guardian without an affirmative consent record.

### Q7: What happens if the backend API or LLM provider is down?
**Answer**: The system falls back cleanly to deterministic local rules matching and client-side mock classification so the app never hard-fails.

### Q8: How was the evaluation dataset constructed?
**Answer**: 410 synthetic items across 16 scam taxonomy categories (Digital Arrest, UPI refund, electricity cut, part-time job, etc.) and genuine bank/delivery hard negatives, balanced across English, Hindi, Marathi, and Hinglish.

### Q9: Can this app auto-read user WhatsApp chats?
**Answer**: No. Suraksha Parivar strictly follows privacy by default. We do not automatically read WhatsApp, SMS, or call logs.

### Q10: How do you mitigate prompt injection attacks in scam messages?
**Answer**: User message content is treated as untrusted data, delimited inside `<UNTRUSTED_MESSAGE>` tags in system prompts, forbidden from tool calls, and strictly schema-validated via Pydantic.
