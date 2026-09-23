# System Architecture - Suraksha Parivar

## Overview
Suraksha Parivar is structured as a privacy-first monorepo combining a responsive Next.js PWA frontend and a Python FastAPI microservice engine.

```mermaid
graph TD
    User["Protected Member / User"] -->|HTTP / PWA| WebApp["Next.js PWA (apps/web)"]
    WebApp -->|REST API / JSON| API["FastAPI Backend (apps/api)"]
    API --> Detector["Detector Module"]
    Detector --> Rules["YAML Rules Engine v1"]
    Detector --> KB["pgvector / BM25 Knowledge Base"]
    Detector --> LLM["Provider LLM Client"]
    Detector --> Fusion["Deterministic Fusion Engine"]
    API --> PDFGen["ReportLab Evidence PDF Service"]
```

## Sequence Diagram: Scam Check & Alert Flow
```mermaid
sequenceDiagram
    autonumber
    actor U as Member
    participant W as Next.js Web App
    participant A as FastAPI Server
    participant P as Preprocessor
    participant R as Rules Engine
    participant F as Fusion Engine
    actor G as Family Guardian

    U->>W: Paste message / Upload image
    W->>A: POST /v1/checks (raw_text, lang)
    A->>P: Normalize text & Redact PII
    P-->>A: redacted_text, pii_mapping
    A->>R: Evaluate rules (scam_rules.v1.yaml)
    R-->>A: rule_score, hard_override, matched_spans
    A->>F: Blend scores & Hard Overrides
    F-->>A: final_verdict, risk_score, red_flags
    A-->>W: JSON Verdict Payload
    W->>U: Render traffic light verdict & red flags
    U->>W: Tap 'Ask My Family'
    W->>A: POST /v1/alerts
    A->>G: Send WhatsApp / Push Alert
```

## Data Boundaries
- **PII Boundary**: Raw phone numbers, UPI IDs, Aadhaar numbers, and names are stripped before external processing.
- **Retention Purge**: Temporary check hashes auto-expire after 7 days; evidence packs are stored with application-level encryption and auto-purged after 90 days.
