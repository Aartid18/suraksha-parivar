# API Reference - Suraksha Parivar

## Base URL
`/v1` (Local OpenAPI auto-docs available at `http://localhost:8000/docs`)

## Key Endpoints

### 1. Perform Scam Check
`POST /v1/checks`
- **Request**:
```json
{
  "text": "Your Electricity will be disconnected tonight at 9:30 PM. Call officer at 9876543210 immediately.",
  "language": "en"
}
```
- **Response**:
```json
{
  "id": "check_uuid",
  "language": "en",
  "verdict": "LIKELY_SCAM",
  "risk_score": 88,
  "category": "utility_disconnection",
  "confidence": 0.95,
  "red_flags": [
    {
      "code": "RULE_URGENCY_AND_THREAT",
      "evidence_span": "disconnected tonight",
      "explanation": {"en": "Extreme urgency deadline threat"}
    }
  ],
  "should_alert_guardian": true
}
```

### 2. Image OCR Check
`POST /v1/checks/image` (Multipart Form File)

### 3. Family Invites & Consents
- `POST /v1/families`: Create family circle
- `POST /v1/families/{id}/invites`: Generate 48h invite token
- `PUT /v1/consents`: Update sharing consent (`alert_only`, `redacted_summary`, `full_message`)

### 4. Incident Response & PDF Evidence Pack
- `POST /v1/incidents`: Start panic incident flow
- `GET /v1/incidents/{id}/evidence-pack.pdf?lang=en|hi|mr`: Download evidence PDF for 1930 reporting

### 5. DPDP Data Rights
- `GET /v1/me/export`: Download all user data JSON
- `DELETE /v1/me`: Erase user check history and evidence permanently
