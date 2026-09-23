import pytest
from fastapi.testclient import TestClient

from apps.api.main import app
from apps.api.detector.preprocessor import Preprocessor
from apps.api.detector.rules_engine import RulesEngine
from apps.api.detector.llm_client import LLMClient
from apps.api.detector.fusion import FusionEngine

client = TestClient(app)

def test_health_endpoint():
    res = client.get("/v1/health")
    assert res.status_code == 200
    assert res.json()["status"] == "healthy"

def test_preprocessor_pii_redaction():
    text = "Call me at +91 9876543210 or pay to user@upi. Send Aadhaar 2345 6789 0123."
    redacted, mapping = Preprocessor.redact_pii(text)
    
    assert "+91 9876543210" not in redacted
    assert "user@upi" not in redacted
    assert "2345 6789 0123" not in redacted
    assert len(mapping) >= 3

def test_preprocessor_language_detection():
    assert Preprocessor.detect_language("Dear customer your account is blocked") == "en"
    assert Preprocessor.detect_language("आपका बैंक खाता आज ही बंद हो जाएगा") == "hi"
    assert Preprocessor.detect_language("तुमचे बँक खाते आजच ब्लॉक केले जाईल") == "mr"

def test_rules_engine_negation_handling():
    rules_engine = RulesEngine()
    
    # Genuine warning (Negated)
    genuine_text = "Important Security Notice: Do NOT share your OTP or UPI PIN with anyone."
    gen_eval = rules_engine.evaluate(genuine_text, lang="en")
    assert gen_eval["rule_score"] < 50
    assert not gen_eval["hard_override"]

    # Scam request (Not negated)
    scam_text = "Urgent: Share your OTP immediately to receive your Rs 5000 refund."
    scam_eval = rules_engine.evaluate(scam_text, lang="en")
    assert scam_eval["rule_score"] >= 90
    assert scam_eval["hard_override"]

def test_fusion_hard_override():
    rule_res = {
        "rule_score": 90,
        "hard_override": True,
        "category_hints": ["upi_collect_or_refund"],
        "triggered_rules": [{"rule_id": "RULE_OTP_PIN_REQUEST", "matched_span": "share your OTP", "explanation": {"en": "OTP request"}}]
    }
    llm_client = LLMClient()
    llm_res = llm_client.classify("Share your OTP", lang="en")
    
    fusion = FusionEngine.fuse(rule_res, llm_res, [], lang="en")
    assert fusion["verdict"] == "LIKELY_SCAM"
    assert fusion["risk_score"] >= 85
    assert fusion["should_alert_guardian"] is True

def test_checks_api_post():
    res = client.post("/v1/checks", json={
        "text": "Your Electricity will be disconnected tonight at 9:30 PM. Call officer at 9876543210 immediately.",
        "language": "en"
    })
    assert res.status_code == 200
    data = res.json()
    assert data["verdict"] in ["LIKELY_SCAM", "SUSPICIOUS"]
    assert "risk_score" in data
    assert len(data["red_flags"]) > 0
