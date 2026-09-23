import os
import sys
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Ensure api directory is in python path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from apps.api.config import settings
from apps.api.routes import health, checks, families, alerts, incidents, library, me

app = FastAPI(
    title=settings.APP_NAME,
    description="Family Anti-Scam Shield API for India - Tri-lingual scam detection, family alerts & incident response.",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register Routers
app.include_router(health.router)
app.include_router(checks.router)
app.include_router(families.router)
app.include_router(alerts.router)
app.include_router(incidents.router)
app.include_router(library.router)
app.include_router(me.router)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("apps.api.main:app", host="0.0.0.0", port=8000, reload=True)
