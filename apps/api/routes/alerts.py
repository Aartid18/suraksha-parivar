import uuid
import datetime
from typing import Dict, Any, List
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

router = APIRouter(prefix="/v1/alerts", tags=["alerts"])

ALERTS_DB: Dict[str, Dict[str, Any]] = {
    "demo_alert_1": {
        "id": "demo_alert_1",
        "check_id": "demo_check_1",
        "family_id": "demo_family_1",
        "from_user_name": "Ramesh (Dad)",
        "from_user_id": "user_dad_1",
        "to_user_id": "user_guardian_1",
        "category": "digital_arrest_impersonation",
        "verdict": "LIKELY_SCAM",
        "risk_score": 88,
        "summary": "Caller claiming to be CBI Officer demanding video call and safe account transfer.",
        "status": "new",
        "created_at": datetime.datetime.utcnow().isoformat(),
        "whatsapp_url": "https://wa.me/?text=Hi%20Dad,%20I%20got%20your%20scam%20alert.%20Do%20not%20pay%20anyone!"
    }
}

class CreateAlertRequest(BaseModel):
    check_id: str
    family_id: str
    from_user_id: str
    from_user_name: str
    summary_text: str

class AlertStatusUpdate(BaseModel):
    status: str = Field(..., example="seen | confirmed_scam | was_genuine | need_info")

@router.post("")
async def send_alert(req: CreateAlertRequest):
    alert_id = str(uuid.uuid4())
    alert_data = {
        "id": alert_id,
        "check_id": req.check_id,
        "family_id": req.family_id,
        "from_user_name": req.from_user_name,
        "from_user_id": req.from_user_id,
        "category": "digital_arrest_impersonation",
        "verdict": "LIKELY_SCAM",
        "risk_score": 85,
        "summary": req.summary_text,
        "status": "new",
        "created_at": datetime.datetime.utcnow().isoformat(),
        "whatsapp_url": f"https://wa.me/?text=Hi,%20I%20saw%20your%20Suraksha%20Parivar%20alert."
    }
    ALERTS_DB[alert_id] = alert_data
    return alert_data

@router.get("")
async def get_alerts():
    return list(ALERTS_DB.values())

@router.patch("/{alert_id}")
async def update_alert_status(alert_id: str, req: AlertStatusUpdate):
    if alert_id not in ALERTS_DB:
        raise HTTPException(status_code=404, detail="Alert not found")
    ALERTS_DB[alert_id]["status"] = req.status
    return ALERTS_DB[alert_id]
