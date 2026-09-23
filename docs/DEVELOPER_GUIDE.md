# Developer Guide - Suraksha Parivar

## Project Architecture
- `apps/web`: Next.js 14 App Router PWA frontend (TypeScript, Tailwind CSS, Framer Motion, Web Speech API).
- `apps/api`: Python FastAPI backend (`detector/` module, PII preprocessor, rules engine, LLM abstraction, ReportLab PDF generator).
- `packages/shared`: Shared taxonomy definitions and i18n keys.
- `eval/`: Synthetic multilingual evaluation harness and runner.

## Local Setup (< 10 Minutes)
```bash
# Clone and enter workspace
cd Parivar

# Run backend tests
python -m pytest apps/api/tests/test_detector.py

# Run evaluation harness
python -m eval.run_eval

# Start FastAPI API Backend (Port 8000)
python -m uvicorn apps.api.main:app --reload --port 8000

# In another terminal: Start Next.js Frontend (Port 3000)
cd apps/web
npm run dev
```

## Adding a New Rule
1. Open `rules/scam_rules.v1.yaml`.
2. Add a new rule item with `id`, `weight`, `category_hint`, `hard_override`, and regex patterns under `en`, `hi`, `mr`.
3. Add a synthetic test case in `eval/data/dataset.jsonl` and run `python -m eval.run_eval`.
