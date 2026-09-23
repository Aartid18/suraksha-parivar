import json
import logging
from typing import Dict, Any, List, Optional
from pydantic import BaseModel, Field

logger = logging.getLogger(__name__)

# Pydantic schema matching output JSON requirements
class RedFlagItem(BaseModel):
    code: str
    evidence_span: str
    explanation: Dict[str, str]

class RecommendedActionItem(BaseModel):
    code: str
    text: Dict[str, str]

class LLMVerdictSchema(BaseModel):
    verdict: str # SAFE, SUSPICIOUS, LIKELY_SCAM
    risk_score: int # 0-100
    category: str
    confidence: float # 0.0 - 1.0
    red_flags: List[RedFlagItem]
    explanation: Dict[str, str] # en, hi, mr
    recommended_actions: List[RecommendedActionItem]
    should_alert_guardian: bool

class LLMClient:
    def __init__(self, provider: str = "mock", model: str = "mock-v1"):
        self.provider = provider
        self.model = model

    def classify(
        self,
        redacted_text: str,
        lang: str = "en",
        rule_summary: Optional[Dict[str, Any]] = None,
        kb_snippets: Optional[List[Dict[str, Any]]] = None
    ) -> LLMVerdictSchema:
        """Classify message text using configured provider or mock fallback."""
        if self.provider == "mock" or not redacted_text:
            return self._mock_classification(redacted_text, lang, rule_summary)

        try:
            # Placeholder for OpenAI / Gemini API call
            # If API keys are missing, fallback cleanly to mock
            return self._mock_classification(redacted_text, lang, rule_summary)
        except Exception as e:
            logger.error(f"LLM call failed: {e}. Falling back to mock/rule classification.")
            return self._mock_classification(redacted_text, lang, rule_summary)

    def _mock_classification(
        self,
        text: str,
        lang: str = "en",
        rule_summary: Optional[Dict[str, Any]] = None
    ) -> LLMVerdictSchema:
        """Deterministic mock classifier based on rules and keyword heuristics."""
        rule_score = rule_summary.get("rule_score", 0) if rule_summary else 0
        triggered = rule_summary.get("triggered_rules", []) if rule_summary else []
        cat_hints = rule_summary.get("category_hints", []) if rule_summary else []

        text_lower = text.lower()

        # Determine verdict based on rule score & keywords
        if rule_score >= 70 or any("otp" in text_lower or "apk" in text_lower or "cbi" in text_lower or "police" in text_lower for item in [text_lower]):
            verdict = "LIKELY_SCAM"
            risk_score = max(75, rule_score)
            category = cat_hints[0] if cat_hints else "digital_arrest_impersonation"
            should_alert = True
        elif rule_score >= 35 or "urgent" in text_lower or "blocked" in text_lower or "link" in text_lower:
            verdict = "SUSPICIOUS"
            risk_score = max(45, rule_score)
            category = cat_hints[0] if cat_hints else "fake_kyc_or_bank_alert"
            should_alert = False
        else:
            verdict = "SAFE"
            risk_score = min(15, rule_score)
            category = "benign"
            should_alert = False

        # Build tri-lingual explanations and red flags
        if verdict == "LIKELY_SCAM":
            explanation = {
                "en": "This message exhibits strong scam patterns: urgent pressure, authority impersonation or requests for confidential information.",
                "hi": "इस संदेश में धोखाधड़ी के मजबूत लक्षण हैं: अत्यधिक जल्दबाजी, पुलिस/अधिकारी होने का फर्जी दावा या गुप्त जानकारी की मांग।",
                "mr": "या मेसेजमध्ये फसवणुकीची मजबूत लक्षणे आहेत: अतिघाई, पोलीस किंवा अधिकाऱ्याचा बनावट दावा किंवा गोपनीय माहितीची मागणी."
            }
            red_flags = [
                RedFlagItem(
                    code="URGENCY_AUTHORITY",
                    evidence_span=text[:60] if len(text) > 60 else text,
                    explanation={
                        "en": "Urgent threat or request to act without consulting family.",
                        "hi": "परिवार से सलाह लिए बिना तुरंत कदम उठाने की धमकी या दबाव।",
                        "mr": "कुटुंबाचा सल्ला न घेता लगेच कृती करण्याची धमकी."
                    }
                )
            ]
            actions = [
                RecommendedActionItem(
                    code="DO_NOT_PAY_OR_SHARE",
                    text={
                        "en": "Do NOT share OTP, enter UPI PIN, or transfer money.",
                        "hi": "ओटीपी शेयर न करें, यूपीआई पिन न डालें और पैसे न भेजें।",
                        "mr": "OTP शेअर करू नका, UPI PIN टाकू नका आणि पैसे पाठवू नका."
                    }
                ),
                RecommendedActionItem(
                    code="ASK_FAMILY",
                    text={
                        "en": "Tap 'Ask my family' to share a calm alert with your family guardian.",
                        "hi": "अपने परिवार को सतर्क करने के लिए 'परिवार से पूछें' बटन दबाएं।",
                        "mr": "कुटुंबाला सावध करण्यासाठी 'कुटुंबाला विचारा' बटण दाबा."
                    }
                )
            ]
        elif verdict == "SUSPICIOUS":
            explanation = {
                "en": "This message contains unusual cues (urgency, link, or unknown number). Proceed with caution.",
                "hi": "इस संदेश में कुछ असामान्य बातें हैं (जल्दबाजी, अनजान लिंक या प्रेषक)। कृपया सावधान रहें।",
                "mr": "या मेसेजमध्ये काही असामान्य गोष्टी आहेत (घाई, अनोळखी लिंक किंवा नंबर). कृपया सावध रहा."
            }
            red_flags = [
                RedFlagItem(
                    code="UNUSUAL_LINK_OR_SENDER",
                    evidence_span=text[:50] if len(text) > 50 else text,
                    explanation={
                        "en": "Contains links or urgent wording from an unverified source.",
                        "hi": "अपुष्ट स्रोत से अनजान लिंक या जल्दबाजी भरा संदेश।",
                        "mr": "अनोळखी स्रोताकडून लिंक किंवा घाईचा मेसेज."
                    }
                )
            ]
            actions = [
                RecommendedActionItem(
                    code="VERIFY_OFFICIAL",
                    text={
                        "en": "Check directly in your official bank/utility app, not via SMS links.",
                        "hi": "एसएमएस लिंक के बजाय सीधे अपने आधिकारिक बैंक ऐप या वेबसाइट पर जांचें।",
                        "mr": "SMS लिंकऐवजी थेट तुमच्या अधिकृत बँक ॲपवर तपासा."
                    }
                )
            ]
        else:
            explanation = {
                "en": "This message appears genuine. Still, remember never to share OTPs or UPI PINs.",
                "hi": "यह संदेश सुरक्षित लगता है। फिर भी याद रखें कि कभी किसी को ओटीपी या यूपीआई पिन न दें।",
                "mr": "हा मेसेज सुरक्षित वाटतो. तरीही, तुमचा OTP किंवा UPI PIN कोणालाही देऊ नका."
            }
            red_flags = []
            actions = [
                RecommendedActionItem(
                    code="STAY_SAFE",
                    text={
                        "en": "Never share bank details or OTPs with anyone.",
                        "hi": "कभी किसी के साथ अपने बैंक विवरण या ओटीपी साझा न करें।",
                        "mr": "कधीही कोणाशीही बँक तपशील किंवा OTP शेअर करू नका."
                    }
                )
            ]

        return LLMVerdictSchema(
            verdict=verdict,
            risk_score=risk_score,
            category=category,
            confidence=0.92,
            red_flags=red_flags,
            explanation=explanation,
            recommended_actions=actions,
            should_alert_guardian=should_alert
        )
