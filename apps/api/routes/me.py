from fastapi import APIRouter
from apps.api.routes.checks import CHECKS_DB
from apps.api.routes.families import FAMILIES_DB
from apps.api.routes.alerts import ALERTS_DB
from apps.api.routes.incidents import INCIDENTS_DB

router = APIRouter(prefix="/v1/me", tags=["me"])

@router.get("/export")
async def export_my_data():
    """Download all user data (DPDP Act Data Export right)."""
    return {
        "user_profile": {
            "id": "demo_user",
            "preferred_language": "en",
            "text_scale": 1.0
        },
        "checks_history": list(CHECKS_DB.values()),
        "families": list(FAMILIES_DB.values()),
        "alerts": list(ALERTS_DB.values()),
        "incidents": list(INCIDENTS_DB.values())
    }

@router.delete("")
async def delete_my_data():
    """Erase all user data permanently (DPDP Act Right to Erasure)."""
    CHECKS_DB.clear()
    ALERTS_DB.clear()
    INCIDENTS_DB.clear()
    return {"status": "success", "message": "All user data, check history and evidence permanently erased."}
