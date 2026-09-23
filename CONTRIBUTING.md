# Contributing to Suraksha Parivar

Thank you for your interest in contributing to **Suraksha Parivar**! We welcome contributions to help make Indian families safer against digital scams.

## How to Contribute
1. **Report Bugs**: File an issue describing the bug, steps to reproduce, and environment details.
2. **Suggest Rules or Categories**: Submit new rule patterns in `rules/scam_rules.v1.yaml` with synthetic test cases in `eval/data/dataset.jsonl`.
3. **Submit Code**:
   - Fork the repository and create a feature branch (`git checkout -b feature/my-feature`).
   - Run tests (`make test`), linting (`make lint`), and evaluation checks (`make eval`).
   - Open a Pull Request with a detailed summary.

## Guidelines
- **Synthetic Data Only**: Never include real phone numbers, real UPI IDs, personal Aadhaar numbers, or real victim chat screenshots in contributions or pull requests.
- **Tri-lingual Integrity**: Ensure user-facing strings are added in English, Hindi (`hi`), and Marathi (`mr`).
- **Privacy First**: Always respect data minimisation and PII redaction rules.
