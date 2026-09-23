import json
import os
import sys
import time
from typing import Dict, Any, List

# Ensure apps/api is in import path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from apps.api.detector.preprocessor import Preprocessor
from apps.api.detector.rules_engine import RulesEngine
from apps.api.detector.retrieval import KnowledgeRetrieval
from apps.api.detector.llm_client import LLMClient
from apps.api.detector.fusion import FusionEngine

def run_evaluation():
    dataset_file = os.path.join(os.path.dirname(__file__), "data", "dataset.jsonl")
    if not os.path.exists(dataset_file):
        print(f"Error: Dataset file {dataset_file} not found.")
        return

    items = []
    with open(dataset_file, "r", encoding="utf-8") as f:
        for line in f:
            if line.strip():
                items.append(json.loads(line))

    print(f"Loaded {len(items)} items for evaluation...")

    rules_engine = RulesEngine()
    retrieval_engine = KnowledgeRetrieval()
    llm_client = LLMClient()

    tp, fp, tn, fn = 0, 0, 0, 0
    latencies = []

    per_language = {}
    per_category = {}

    for item in items:
        start_t = time.time()
        
        text_norm = Preprocessor.normalize_text(item["text"])
        lang = item.get("language", "en")
        redacted_text, pii_map = Preprocessor.redact_pii(text_norm)

        rule_res = rules_engine.evaluate(redacted_text, lang=lang)
        kb_matches = retrieval_engine.search(redacted_text, top_k=2)
        llm_res = llm_client.classify(redacted_text, lang=lang, rule_summary=rule_res)
        fused = FusionEngine.fuse(rule_res, llm_res, kb_matches, lang=lang)

        elapsed_ms = (time.time() - start_t) * 1000
        latencies.append(elapsed_ms)

        pred_verdict = fused["verdict"] # LIKELY_SCAM, SUSPICIOUS, SAFE
        actual_verdict = item["label_verdict"]

        # Scam vs Not Scam decision (SUSPICIOUS and LIKELY_SCAM counted as Positive)
        is_pred_scam = pred_verdict in ["LIKELY_SCAM", "SUSPICIOUS"]
        is_actual_scam = actual_verdict in ["LIKELY_SCAM", "SUSPICIOUS"]

        if is_pred_scam and is_actual_scam:
            tp += 1
        elif is_pred_scam and not is_actual_scam:
            fp += 1
        elif not is_pred_scam and not is_actual_scam:
            tn += 1
        elif not is_pred_scam and is_actual_scam:
            fn += 1

        # Per Language Stats
        if lang not in per_language:
            per_language[lang] = {"total": 0, "correct": 0}
        per_language[lang]["total"] += 1
        if is_pred_scam == is_actual_scam:
            per_language[lang]["correct"] += 1

        # Per Category Stats
        cat = item.get("label_category", "unknown")
        if cat not in per_category:
            per_category[cat] = {"total": 0, "correct": 0}
        per_category[cat]["total"] += 1
        if is_pred_scam == is_actual_scam:
            per_category[cat]["correct"] += 1

    # Calculate Metrics
    precision = tp / (tp + fp) if (tp + fp) > 0 else 0.0
    recall = tp / (tp + fn) if (tp + fn) > 0 else 0.0
    f1 = 2 * precision * recall / (precision + recall) if (precision + recall) > 0 else 0.0
    fp_rate = fp / (fp + tn) if (fp + tn) > 0 else 0.0

    latencies.sort()
    p50_latency = latencies[int(len(latencies) * 0.50)]
    p95_latency = latencies[int(len(latencies) * 0.95)]

    report_json = {
        "timestamp": time.strftime("%Y-%m-%d %H:%M:%S UTC"),
        "total_samples": len(items),
        "scam_samples": tp + fn,
        "benign_samples": tn + fp,
        "confusion_matrix": {"tp": tp, "fp": fp, "tn": tn, "fn": fn},
        "metrics": {
            "precision": round(precision, 4),
            "recall": round(recall, 4),
            "f1_score": round(f1, 4),
            "benign_false_positive_rate": round(fp_rate, 4),
            "accuracy": round((tp + tn) / len(items), 4)
        },
        "latency_ms": {
            "p50": round(p50_latency, 2),
            "p95": round(p95_latency, 2)
        },
        "cost_per_check_usd": 0.00,
        "per_language": per_language,
        "per_category": per_category
    }

    # Save JSON report
    reports_dir = os.path.join(os.path.dirname(__file__), "reports")
    os.makedirs(reports_dir, exist_ok=True)
    json_path = os.path.join(reports_dir, "latest.json")
    with open(json_path, "w", encoding="utf-8") as f:
        json.dump(report_json, f, indent=2)

    # Save Markdown report
    md_path = os.path.join(reports_dir, "latest.md")
    with open(md_path, "w", encoding="utf-8") as f:
        f.write(f"# Suraksha Parivar - Evaluation Report\n\n")
        f.write(f"**Generated**: {report_json['timestamp']}\n\n")
        f.write(f"## Core Performance Headlines\n\n")
        f.write(f"| Metric | Value |\n")
        f.write(f"| :--- | :--- |\n")
        f.write(f"| **Precision** | {report_json['metrics']['precision'] * 100:.2f}% |\n")
        f.write(f"| **Recall** | {report_json['metrics']['recall'] * 100:.2f}% |\n")
        f.write(f"| **F1 Score** | {report_json['metrics']['f1_score'] * 100:.2f}% |\n")
        f.write(f"| **Benign False-Positive Rate** | {report_json['metrics']['benign_false_positive_rate'] * 100:.2f}% |\n")
        f.write(f"| **Accuracy** | {report_json['metrics']['accuracy'] * 100:.2f}% |\n")
        f.write(f"| **Latency (p50)** | {report_json['latency_ms']['p50']} ms |\n")
        f.write(f"| **Latency (p95)** | {report_json['latency_ms']['p95']} ms |\n")
        f.write(f"| **Avg Cost / Check** | $0.00 (Demo Mode / Local Rules) |\n\n")

        f.write(f"## Confusion Matrix\n\n")
        f.write(f"- True Positives (Scams correctly flagged): **{tp}**\n")
        f.write(f"- False Positives (Benign messages falsely flagged): **{fp}**\n")
        f.write(f"- True Negatives (Benign messages marked safe): **{tn}**\n")
        f.write(f"- False Negatives (Scams missed): **{fn}**\n\n")

        f.write(f"## Breakdown by Language\n\n")
        f.write(f"| Language | Total Samples | Accuracy |\n")
        f.write(f"| :--- | :--- | :--- |\n")
        for l_code, stats in per_language.items():
            acc = stats["correct"] / stats["total"] * 100 if stats["total"] > 0 else 0
            f.write(f"| `{l_code}` | {stats['total']} | {acc:.1f}% |\n")

    print(f"\n--- EVALUATION COMPLETE ---")
    print(f"F1 Score: {f1*100:.2f}% | Precision: {precision*100:.2f}% | Recall: {recall*100:.2f}%")
    print(f"Benign False Positive Rate: {fp_rate*100:.2f}%")
    print(f"Report written to {md_path}")

if __name__ == "__main__":
    run_evaluation()
