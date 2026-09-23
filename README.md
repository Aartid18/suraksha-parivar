# Suraksha Parivar (सुरक्षा परिवार / सुरक्षा कुटुंब) 🛡️
> **A Family Anti-Scam Shield for India (English / Hindi / Marathi)**

[![License: MIT](https://img.shields.io/badge/License-MIT-teal.svg)](LICENSE)
[![Python 3.11+](https://img.shields.io/badge/Python-3.11+-blue.svg)](apps/api)
[![Next.js 14](https://img.shields.io/badge/Next.js-14.2-black.svg)](apps/web)
[![F1 Score](https://img.shields.io/badge/Evaluation_F1-87.78%25-emerald.svg)](eval/reports/latest.md)

**Suraksha Parivar** helps ordinary Indian families detect digital scam messages, alert trusted family guardians in 1 tap, and respond correctly during the critical first 30 minutes after a fraud.

---

## Key Features

- **Tri-lingual Plain-Language Verdicts**: Instant plain-language analysis in **English, Hindi (हिंदी), and Marathi (मराठी)** with Web Speech API read-aloud TTS.
- **Hybrid Multi-Layer Detection Engine**:
  1. **Preprocessing & PII Redaction**: Phone numbers, UPI IDs, Aadhaar numbers, and emails masked prior to processing.
  2. **YAML Rules Engine v1**: Versioned rules with negation & context checking (distinguishing genuine bank OTP warnings vs scam requests).
  3. **Vector KB & Retrieval**: Curated knowledge base of 16 scam categories (Fake CBI Digital Arrest, UPI PIN refund, Electricity cut, Part-time job scams, Remote APK tools).
  4. **Deterministic Score Fusion**: Hard overrides forcing `LIKELY_SCAM` when explicit requests to share OTP/PIN or install remote access software are detected.
- **Privacy-First Family Circle & Guardian Alerts**: Consent-driven alerts (`Alert me only`, `Redacted summary`, `Full message`) with 1-tap WhatsApp (`wa.me`) or phone call actions for adult child guardians.
- **First 30 Minutes Panic Flow**: Interactive step-by-step guided checklist with active elapsed-time timer and downloadable **Evidence Pack PDF** formatted for Cyber Crime Helpline **1930** and `cybercrime.gov.in`.
- **Evaluation Harness & Benchmark**: 410-item synthetic multilingual dataset.

---

## Measured Evaluation Benchmark

| Metric | Empirical Value |
| :--- | :--- |
| **Precision** | **95.07%** |
| **Recall** | **81.54%** |
| **F1 Score** | **87.78%** |
| **Benign False-Positive Rate** | **7.33%** |
| **Accuracy** | **85.37%** |
| **Latency (p50)** | **< 10 ms** |

---

## Quick Start (< 10 Minutes)

### Prerequisites
- Python 3.11+
- Node.js 18+ and npm

### 1. Install & Run Backend (FastAPI API)
```bash
# Clone repository
git clone https://github.com/your-username/suraksha-parivar.git
cd suraksha-parivar

# Install backend python requirements
pip install -r apps/api/requirements.txt

# Run backend unit tests
python -m pytest apps/api/tests/test_detector.py

# Run evaluation harness benchmark
python -m eval.run_eval

# Start FastAPI backend API (Port 8000)
python -m uvicorn apps.api.main:app --reload --port 8000
```

### 2. Install & Run Frontend (Next.js PWA)
```bash
# In a new terminal window:
cd apps/web
npm install
npm run dev
```
Open **`http://localhost:3000`** in your browser to view the application.

---

## Repository Structure
```
Parivar/
├── README.md                  # Project pitch, quick start, metrics
├── BUILD_LOG.md               # Date & phase-by-phase build log
├── LICENSE                    # MIT License
├── Makefile                   # Dev, test, lint, eval targets
├── docker-compose.yml         # Local Postgres + Redis + API + Web containers
├── apps/
│   ├── api/                   # FastAPI backend (detector, routes, pdf generator)
│   └── web/                   # Next.js App Router PWA (EN, HI, MR UI)
├── packages/
│   └── shared/                # Taxonomy definitions & schemas
├── rules/                     # scam_rules.v1.yaml versioned rule definitions
├── eval/                      # Multilingual 410-item dataset & run_eval.py harness
└── docs/                      # 17+ Complete documentation files
```

---

## Documentation Index
- 📄 [Case Study](docs/CASE_STUDY.md) - Recruiter-facing problem, user personas, and technical architecture.
- 📐 [Architecture](docs/ARCHITECTURE.md) - Mermaid context, container, and sequence diagrams.
- ⚙️ [Detection Engine](docs/DETECTION_ENGINE.md) - Rules, LLM contract, fusion logic, and hard overrides.
- 📊 [Evaluation Report](docs/EVALUATION_REPORT.md) - Metrics tables, confusion matrix, and reproduction steps.
- 🔌 [API Reference](docs/API.md) - OpenAPI endpoints and worked curl examples.
- 🗄️ [Data Model](docs/DATA_MODEL.md) - ERD diagram and table descriptions.
- 🔒 [Privacy & DPDP Notes](docs/PRIVACY_AND_DPDP_NOTES.md) - India DPDP Act compliance notes.
- 🛡️ [Threat Model](docs/THREAT_MODEL.md) - STRIDE threat matrix and security controls.
- 🎨 [Design System](docs/DESIGN_SYSTEM.md) - Design tokens, typography, and accessibility features.
- 📖 [User Guide (EN)](docs/USER_GUIDE.md) | [Hindi Guide](docs/USER_GUIDE.hi.md) | [Marathi Guide](docs/USER_GUIDE.mr.md)
- 💻 [Developer Guide](docs/DEVELOPER_GUIDE.md) - Repo tour, setup, coding standards.
- 🚀 [Deployment Guide](docs/DEPLOYMENT.md) - Vercel & Render deployment walkthrough.
- 📝 [Decisions (ADRs)](docs/DECISIONS.md) - Short Architectural Decision Records.
- 🗣️ [i18n Review](docs/I18N_REVIEW.md) - Translation approach and glossary.
- 🗺️ [Roadmap](docs/ROADMAP.md) - Future features and milestones.
- 🎤 [Demo Script & Interview Prep](docs/DEMO_SCRIPT.md) - 3-minute demo script & top 10 interview Q&As.

---

## Disclaimer
*Suraksha Parivar is an independent open-source family safety assistant. It does not claim to be a bank, police, or government service, and does not automatically file official complaints or guarantee fund recovery. Always report official cybercrime cases directly via helpline **1930** or **cybercrime.gov.in**.*
