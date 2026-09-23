import uuid
import time
from typing import Optional, List, Dict, Any
from fastapi import APIRouter, File, UploadFile, HTTPException
from pydantic import BaseModel, Field

from apps.api.detector.preprocessor import Preprocessor
from apps.api.detector.rules_engine import RulesEngine
from apps.api.detector.retrieval import KnowledgeRetrieval
from apps.api.detector.llm_client import LLMClient
from apps.api.detector.fusion import FusionEngine

router = APIRouter(prefix="/v1/checks", tags=["checks"])

# In-memory store for demo mode checks
CHECKS_DB: Dict[str, Dict[str, Any]] = {}

class CheckRequest(BaseModel):
    text: str = Field(..., max_length=4000, description="Message text or transcription to check")
    language: Optional[str] = Field("en", description="Preferred response language (en, hi, mr)")
    consent_store_redacted: Optional[bool] = Field(False, description="User consent to store redacted message")

class FeedbackRequest(BaseModel):
    user_label: str = Field(..., description="correct | wrong_too_scary | wrong_missed_scam")

rules_engine = RulesEngine()
retrieval_engine = KnowledgeRetrieval()
llm_client = LLMClient()

@router.post("", summary="Perform hybrid scam detection on text")
async def create_check(req: CheckRequest):
    start_time = time.time()

    # Step 0: Preprocessing & PII Redaction
    text_norm = Preprocessor.normalize_text(req.text)
    detected_lang = Preprocessor.detect_language(text_norm)
    lang = req.language if req.language in ["en", "hi", "mr"] else detected_lang
    if lang == "hinglish":
        lang = "en"

    redacted_text, pii_map = Preprocessor.redact_pii(text_norm)

    # Step 1: Rules Engine
    rule_res = rules_engine.evaluate(redacted_text, lang=lang)

    # Step 2: Knowledge Base Retrieval
    kb_matches = retrieval_engine.search(redacted_text, top_k=2)

    # Step 3: LLM Classifier
    llm_res = llm_client.classify(
        redacted_text=redacted_text,
        lang=lang,
        rule_summary=rule_res,
        kb_snippets=kb_matches
    )

    # Step 4: Fusion Logic
    fused_res = FusionEngine.fuse(
        rule_res=rule_res,
        llm_res=llm_res,
        kb_matches=kb_matches,
        lang=lang
    )

    latency_ms = int((time.time() - start_time) * 1000)
    check_id = str(uuid.uuid4())

    response_payload = {
        "id": check_id,
        "language": lang,
        "verdict": fused_res["verdict"],
        "risk_score": fused_res["risk_score"],
        "category": fused_res["category"],
        "confidence": fused_res["confidence"],
        "red_flags": fused_res["red_flags"],
        "explanation": fused_res["explanation"],
        "recommended_actions": fused_res["recommended_actions"],
        "should_alert_guardian": fused_res["should_alert_guardian"],
        "hard_override_triggered": fused_res["hard_override_triggered"],
        "kb_references": fused_res["kb_references"],
        "pii_redact_count": len(pii_map),
        "latency_ms": latency_ms,
        "rules_version": "1.0",
        "model_id": "mock-v1"
    }

    # Cache check result
    CHECKS_DB[check_id] = response_payload

    return response_payload

@router.post("/image", summary="Extract text via OCR and perform scam check")
async def create_check_from_image(file: UploadFile = File(...), language: str = "en"):
    contents = await file.read()
    if len(contents) > 10 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="File size exceeds 10MB limit")

    ocr_text = Preprocessor.process_ocr_image(contents)
    if not ocr_text:
        raise HTTPException(status_code=400, detail="Could not extract readable text from image")

    check_req = CheckRequest(text=ocr_text, language=language)
    res = await create_check(check_req)
    res["extracted_ocr_text"] = ocr_text
    return res

@router.get("/{check_id}", summary="Get existing check result")
async def get_check(check_id: str):
    if check_id not in CHECKS_DB:
        raise HTTPException(status_code=404, detail="Check result not found or expired")
    return CHECKS_DB[check_id]

@router.post("/{check_id}/feedback", summary="Submit feedback on check result")
async def submit_feedback(check_id: str, req: FeedbackRequest):
    if check_id not in CHECKS_DB:
        raise HTTPException(status_code=404, detail="Check result not found")
    CHECKS_DB[check_id]["feedback"] = req.user_label
    return {"status": "success", "message": "Feedback submitted successfully"}
