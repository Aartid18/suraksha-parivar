# Deployment Walkthrough - Suraksha Parivar

## Recommended Free-Tier Deployment Stack
- **Frontend (`apps/web`)**: Deployed on **Vercel** (Free Tier). Connect root directory and set Root Directory to `apps/web`.
- **Backend (`apps/api`)**: Deployed on **Render / Fly.io / Railway** (Free/Low-Cost Tier). Dockerfile built from `apps/api/Dockerfile`.
- **Database**: **Supabase** or **Neon PostgreSQL** with `pgvector` extension enabled.

## Environment Variables
- `DEMO_MODE=true` (Runs full app and detection without requiring external paid API keys)
- `SECRET_KEY`: 32-char secure secret string
- `EVIDENCE_ENCRYPTION_KEY`: 32-char secret key for evidence AES encryption
- `DATABASE_URL`: PostgreSQL connection string with `asyncpg` driver
