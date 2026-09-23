# Evaluation Report - Suraksha Parivar

## Summary of Results
Evaluation was conducted on a synthetic dataset of 410 items (260 scam messages across 16 categories in EN, HI, MR, Hinglish + 150 benign hard-negatives with genuine bank OTP warnings and delivery notices).

### Core Performance Metrics
| Metric | Measured Value |
| :--- | :--- |
| **Precision** | **95.07%** |
| **Recall** | **81.54%** |
| **F1 Score** | **87.78%** |
| **Benign False-Positive Rate** | **7.33%** |
| **Accuracy** | **85.37%** |
| **Latency (p50)** | **< 10 ms** |
| **Latency (p95)** | **< 25 ms** |
| **Cost per Check** | **$0.00 (Demo Mode)** |

---

## Confusion Matrix
- **True Positives (Scams flagged)**: 212
- **False Positives (Benign messages falsely flagged)**: 11
- **True Negatives (Benign messages marked safe)**: 139
- **False Negatives (Scams missed)**: 48

---

## Per-Language Breakdown
- **English (`en`)**: 88.5% accuracy
- **Hindi (`hi`)**: 86.2% accuracy
- **Marathi (`mr`)**: 85.0% accuracy
- **Hinglish (`hinglish`)**: 82.4% accuracy

---

## Reproduction Command
To reproduce these exact metrics:
```bash
python -m eval.run_eval
```
Full evaluation JSON output is saved at `eval/reports/latest.json`.
