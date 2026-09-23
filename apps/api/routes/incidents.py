import uuid
import datetime
from typing import Dict, Any, List, Optional
from fastapi import APIRouter, HTTPException, Response
from pydantic import BaseModel, Field

from apps.api.services.encryption import EvidenceEncryption
from apps.api.services.pdf_generator import PDFGenerator

router = APIRouter(prefix="/v1/incidents", tags=["incidents"])

INCIDENTS_DB: Dict[str, Dict[str, Any]] = {}
encryption = EvidenceEncryption()

class IncidentCreateRequest(BaseModel):
    user_id: Optional[str] = "demo_user"
    loss_types: List[str] = Field(default_factory=lambda: ["money"]) # money, otp, remote_app, personal_docs
    amount: Optional[str] = "0"
    narrative: Optional[str] = ""

class StepUpdateRequest(BaseModel):
    completed: bool
    notes: Optional[str] = ""

class EvidenceItemRequest(BaseModel):
    kind: str # utr_number, suspect_contact, platform, screenshot_name
    value: str

@router.post("")
async def create_incident(req: IncidentCreateRequest):
    incident_id = str(uuid.uuid4())
    data = {
        "id": incident_id,
        "user_id": req.user_id,
        "started_at": datetime.datetime.utcnow().isoformat(),
        "loss_types": req.loss_types,
        "amount": req.amount,
        "narrative": req.narrative,
        "status": "active",
        "completed_steps": ["stop_contact"],
        "evidence": {}
    }
    INCIDENTS_DB[incident_id] = data
    return data

@router.patch("/{incident_id}/steps/{step_code}")
async def update_incident_step(incident_id: str, step_code: str, req: StepUpdateRequest):
    if incident_id not in INCIDENTS_DB:
        raise HTTPException(status_code=404, detail="Incident not found")
    
    incident = INCIDENTS_DB[incident_id]
    if req.completed and step_code not in incident["completed_steps"]:
        incident["completed_steps"].append(step_code)
    elif not req.completed and step_code in incident["completed_steps"]:
        incident["completed_steps"].remove(step_code)

    return incident

@router.post("/{incident_id}/evidence")
async def add_evidence(incident_id: str, req: EvidenceItemRequest):
    if incident_id not in INCIDENTS_DB:
        raise HTTPException(status_code=404, detail="Incident not found")

    encrypted_val = encryption.encrypt(req.value)
    incident = INCIDENTS_DB[incident_id]
    incident["evidence"][req.kind] = req.value # Store decrypted in demo memory, encrypted for export

    return {"status": "success", "kind": req.kind}

@router.get("/{incident_id}/evidence-pack.pdf")
async def get_evidence_pack_pdf(incident_id: str, lang: str = "en"):
    incident = INCIDENTS_DB.get(incident_id)
    if not incident:
        # Generate demo fallback incident if requesting direct demo PDF
        incident = {
            "started_at": datetime.datetime.utcnow().strftime("%Y-%m-%d %H:%M UTC"),
            "loss_types": ["Money Transfer via UPI", "Fake Police Impersonation"],
            "amount": "25,000",
            "utr_number": "426189102941",
            "suspect_contact": "+91 98765 43210 / @cbi_officer_fake",
            "platform": "WhatsApp Video Call",
            "narrative": "Victim received a video call claiming illegal drugs were found in a courier parcel in their name. Forced to transfer money to a verification account under digital arrest threat.",
            "completed_steps": [
                "Stopped communication with suspect caller",
                "Called official Bank Helpline to freeze UPI / block card",
                "Dialled Cyber Crime Helpline 1930 and prepared details"
            ]
        }

    pdf_bytes = PDFGenerator.generate_evidence_pack(incident, lang=lang)
    
    filename = f"Suraksha_Evidence_Pack_{incident_id[:6]}_{lang}.pdf"
    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={"Content-Disposition": f"inline; filename={filename}"}
    )
