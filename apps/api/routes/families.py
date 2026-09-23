import uuid
import datetime
from typing import Dict, Any, List, Optional
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

router = APIRouter(prefix="/v1", tags=["families"])

FAMILIES_DB: Dict[str, Dict[str, Any]] = {}
INVITES_DB: Dict[str, Dict[str, Any]] = {}
CONSENTS_DB: Dict[str, Dict[str, Any]] = {}

class FamilyCreateRequest(BaseModel):
    name: str = Field(..., example="Sharma Parivar")
    user_name: str = Field(..., example="Aarti Sharma")

class InviteRequest(BaseModel):
    created_by_user_id: str

class AcceptInviteRequest(BaseModel):
    token: str
    user_name: str
    role: str = Field("guardian", example="member | guardian | both")

class ConsentUpdateRequest(BaseModel):
    member_user_id: str
    guardian_user_id: str
    level: str = Field("redacted_summary", example="alert_only | redacted_summary | full_message")

@router.post("/families")
async def create_family(req: FamilyCreateRequest):
    family_id = str(uuid.uuid4())
    user_id = str(uuid.uuid4())
    family_data = {
        "id": family_id,
        "name": req.name,
        "created_by": user_id,
        "created_at": datetime.datetime.utcnow().isoformat(),
        "members": [
            {
                "user_id": user_id,
                "display_name": req.user_name,
                "role": "guardian"
            }
        ]
    }
    FAMILIES_DB[family_id] = family_data
    return family_data

@router.post("/families/{family_id}/invites")
async def create_invite(family_id: str, req: InviteRequest):
    if family_id not in FAMILIES_DB:
        raise HTTPException(status_code=404, detail="Family not found")
    
    token = str(uuid.uuid4())[:8]
    expires_at = (datetime.datetime.utcnow() + datetime.timedelta(hours=48)).isoformat()
    invite_data = {
        "token": token,
        "family_id": family_id,
        "created_by": req.created_by_user_id,
        "expires_at": expires_at,
        "invite_url": f"https://suraksha.app/join?token={token}"
    }
    INVITES_DB[token] = invite_data
    return invite_data

@router.post("/invites/{token}/accept")
async def accept_invite(token: str, req: AcceptInviteRequest):
    if token not in INVITES_DB:
        raise HTTPException(status_code=404, detail="Invite link invalid or expired")
    
    invite = INVITES_DB[token]
    family_id = invite["family_id"]
    family = FAMILIES_DB.get(family_id)
    if not family:
        raise HTTPException(status_code=404, detail="Family circle no longer exists")

    new_user_id = str(uuid.uuid4())
    member_entry = {
        "user_id": new_user_id,
        "display_name": req.user_name,
        "role": req.role
    }
    family["members"].append(member_entry)
    
    # Auto register default consent: redacted_summary
    consent_id = f"{new_user_id}_{family['created_by']}"
    CONSENTS_DB[consent_id] = {
        "member_user_id": new_user_id,
        "guardian_user_id": family["created_by"],
        "level": "redacted_summary",
        "granted_at": datetime.datetime.utcnow().isoformat()
    }

    return {
        "status": "success",
        "user_id": new_user_id,
        "family": family
    }

@router.put("/consents")
async def update_consent(req: ConsentUpdateRequest):
    key = f"{req.member_user_id}_{req.guardian_user_id}"
    CONSENTS_DB[key] = {
        "member_user_id": req.member_user_id,
        "guardian_user_id": req.guardian_user_id,
        "level": req.level,
        "updated_at": datetime.datetime.utcnow().isoformat()
    }
    return {"status": "success", "consent": CONSENTS_DB[key]}
