from typing import List, Dict, Any

KB_PATTERNS = [
    {
        "id": "KB_DIGITAL_ARREST",
        "category": "digital_arrest_impersonation",
        "title": "Digital Arrest Scam",
        "keywords": ["digital arrest", "police", "cbi", "ed", "customs", "illegal parcel", "video call"],
        "summary": "Scammers pose as law enforcement or CBI officers over WhatsApp video calls, threatening immediate arrest unless money is transferred to a 'verification' account.",
        "official_advice": "No Indian law enforcement agency (CBI, Police, ED) ever arrests anyone over video call or demands money transfers.",
        "source": "Cyber Crime Helpline 1930 / I4C Advisory 2024"
    },
    {
        "id": "KB_UPI_REFUND",
        "category": "upi_collect_or_refund",
        "title": "UPI Collect & PIN Scam",
        "keywords": ["upi pin", "collect request", "refund", "receive money", "qr code"],
        "summary": "Scammers send a UPI collect request or ask victim to scan a QR code/enter PIN claiming it is required to receive money or a refund.",
        "official_advice": "A UPI PIN is only required to SEND money. You never need to enter a PIN or scan a QR code to receive money.",
        "source": "NCPI & RBI Safety Guidelines"
    },
    {
        "id": "KB_FAKE_KYC",
        "category": "fake_kyc_or_bank_alert",
        "title": "Fake KYC / Bank Disconnection Alert",
        "keywords": ["kyc update", "sim block", "account block", "download apk", "bank alert"],
        "summary": "SMS claiming bank account or SIM card will be deactivated today unless a link is clicked or an app/APK is downloaded.",
        "official_advice": "Banks and telecom operators never send APK files or demand password/OTP entry via SMS links.",
        "source": "RBI Cyber Security Warning"
    },
    {
        "id": "KB_ELECTRICITY_CUT",
        "category": "utility_disconnection",
        "title": "Electricity Disconnection Scam",
        "keywords": ["electricity", "power cut", "disconnection tonight", "bill pending", "call officer"],
        "summary": "Urgent SMS claiming power will be cut tonight at 9:30 PM due to unpaid bills, giving a personal mobile number to call.",
        "official_advice": "Utility companies do not provide personal mobile numbers for bill payments or disconnect power without official written notice.",
        "source": "State Electricity Distribution Advisories"
    },
    {
        "id": "KB_PARTTIME_TASK",
        "category": "task_or_parttime_job",
        "title": "Part-Time Job / Video Like Scam",
        "keywords": ["part time job", "like video", "prepaid task", "telegram group", "earn daily"],
        "summary": "Promised high earnings for simple online tasks (liking YouTube videos/rating hotels), followed by demands to deposit money for 'prepaid tasks'.",
        "official_advice": "Legitimate jobs never require you to pay upfront fees or deposit money to earn your salary.",
        "source": "Indian Cyber Crime Coordination Centre (I4C)"
    }
]

class KnowledgeRetrieval:
    def __init__(self):
        self.kb_entries = KB_PATTERNS

    def search(self, query: str, top_k: int = 2) -> List[Dict[str, Any]]:
        """Keyword/BM25 similarity search over curated knowledge base."""
        query_lower = query.lower()
        results = []

        for entry in self.kb_entries:
            score = 0
            for kw in entry["keywords"]:
                if kw in query_lower:
                    score += 2
            
            # Additional title match weight
            if entry["title"].lower() in query_lower:
                score += 3
                
            if score > 0:
                results.append({
                    "entry": entry,
                    "score": score
                })

        # Sort by score descending
        results.sort(key=lambda x: x["score"], reverse=True)
        return [r["entry"] for r in results[:top_k]]
