import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    APP_NAME: str = "Suraksha Parivar API"
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")
    DEMO_MODE: bool = os.getenv("DEMO_MODE", "true").lower() == "true"
    LOG_LEVEL: str = os.getenv("LOG_LEVEL", "INFO")
    
    # Secrets
    SECRET_KEY: str = os.getenv("SECRET_KEY", "dev-secret-key-32-chars-long-security-check!")
    EVIDENCE_ENCRYPTION_KEY: str = os.getenv("EVIDENCE_ENCRYPTION_KEY", "dev-encryption-key-32-chars-long!!")
    JWT_SECRET: str = os.getenv("JWT_SECRET", "dev-jwt-secret-key-32-chars-long!!")
    
    # AI Settings
    LLM_PROVIDER: str = os.getenv("LLM_PROVIDER", "mock")
    LLM_MODEL: str = os.getenv("LLM_MODEL", "mock-v1")
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    
    # Data Retention (Days)
    CHECK_RETENTION_DAYS: int = 7
    ALERT_RETENTION_DAYS: int = 30
    EVIDENCE_RETENTION_DAYS: int = 90
    
    # Official Helpline Details
    HELPLINE_1930_NAME: str = "National Cyber Crime Helpline"
    HELPLINE_1930_NUMBER: str = "1930"
    PORTAL_URL: str = "https://cybercrime.gov.in"
    CHAKSHU_URL: str = "https://sancharsaathi.gov.in/sancharsaathi/"

    class Config:
        env_file = ".env"
        extra = "ignore"

settings = Settings()
