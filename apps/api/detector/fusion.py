from typing import Dict, Any, List
from apps.api.detector.llm_client import LLMVerdictSchema, RedFlagItem

class FusionEngine:
    @staticmethod
    def fuse(
        rule_res: Dict[str, Any],
        llm_res: LLMVerdictSchema,
        kb_matches: List[Dict[str, Any]],
        lang: str = "en"
    ) -> Dict[str, Any]:
        rule_score = rule_res.get("rule_score", 0)
        hard_override = rule_res.get("hard_override", False)
        llm_score = llm_res.risk_score
        
        kb_sim_score = min(100, len(kb_matches) * 35)

        # Indicator Scoring Breakdown (Master JSON Spec)
        indicator_scores = {
            "otp_request": 25 if any(r["rule_id"] == "RULE_OTP_PIN_REQUEST" for r in rule_res.get("triggered_rules", [])) else 0,
            "remote_access_request": 25 if any(r["rule_id"] == "RULE_REMOTE_ACCESS_APK" for r in rule_res.get("triggered_rules", [])) else 0,
            "urgency": 20 if any(r["rule_id"] == "RULE_URGENCY_AND_THREAT" for r in rule_res.get("triggered_rules", [])) else 0,
            "payment_request": 20 if any(r["rule_id"] == "RULE_SAFE_ACCOUNT_TRANSFER" for r in rule_res.get("triggered_rules", [])) else 0,
            "suspicious_url": 20 if any(r["rule_id"] == "RULE_SUSPICIOUS_LINK_SHORTENER" for r in rule_res.get("triggered_rules", [])) else 0,
            "impersonation": 15 if any(r["rule_id"] == "RULE_AUTHORITY_IMPERSONATION" for r in rule_res.get("triggered_rules", [])) else 0,
        }

        # Weighted score blend
        sum_indicators = sum(indicator_scores.values())
        final_score = int(0.40 * sum_indicators + 0.40 * rule_score + 0.20 * llm_score)
        final_score = min(100, max(0, final_score))

        # Apply Hard Overrides
        if hard_override:
            verdict = "LIKELY_SCAM"
            final_score = max(final_score, 85)
            should_alert = True
        elif final_score >= 70:
            verdict = "LIKELY_SCAM"
            should_alert = True
        elif final_score >= 35:
            verdict = "SUSPICIOUS"
            should_alert = False
        else:
            verdict = "SAFE"
            should_alert = False

        # Strong disagreement check
        disagreement = False
        if llm_res.verdict == "SAFE" and rule_score >= 55:
            verdict = "SUSPICIOUS"
            disagreement = True
            should_alert = True

        # Category resolution
        if hard_override and rule_res.get("category_hints"):
            category = rule_res["category_hints"][0]
        else:
            category = llm_res.category

        # Explanation adjustment if disagreement
        explanation = llm_res.explanation
        if disagreement:
            explanation = {
                "en": "Not sure - suspicious patterns detected. Please ask a trusted family member.",
                "hi": "निश्चित नहीं - संदिग्ध बातें मिली हैं। कृपया परिवार के किसी सदस्य से पूछें।",
                "mr": "खात्री नाही - संशयास्पद गोष्टी आढळल्या. कृपया कुटुंबातील व्यक्तीला विचारा."
            }

        # Merge Red Flags (Rules + LLM), cap at max 6
        red_flags = []
        for r in rule_res.get("triggered_rules", []):
            red_flags.append({
                "code": r["rule_id"],
                "evidence_span": r["matched_span"],
                "explanation": r["explanation"]
            })

        for rf in llm_res.red_flags:
            if not any(existing["code"] == rf.code for existing in red_flags):
                red_flags.append({
                    "code": rf.code,
                    "evidence_span": rf.evidence_span,
                    "explanation": rf.explanation
                })

        red_flags = red_flags[:6]

        recommended_actions = [
            {"code": act.code, "text": act.text} for act in llm_res.recommended_actions
        ]

        return {
            "verdict": verdict,
            "risk_score": final_score,
            "category": category,
            "confidence": 0.95 if hard_override else llm_res.confidence,
            "red_flags": red_flags,
            "explanation": explanation,
            "recommended_actions": recommended_actions,
            "should_alert_guardian": should_alert,
            "hard_override_triggered": hard_override,
            "kb_references": [
                {"id": kb["id"], "title": kb["title"], "advice": kb["official_advice"]}
                for kb in kb_matches
            ]
        }
