from fastapi import APIRouter
from apps.api.config import settings

router = APIRouter(prefix="/v1", tags=["health"])

@router.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "service": settings.APP_NAME,
        "demo_mode": settings.DEMO_MODE,
        "environment": settings.ENVIRONMENT
    }
