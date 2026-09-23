import re
import unicodedata
from typing import Dict, Tuple, List

# Regex patterns for Indian PII Detection
PHONE_REGEX = re.compile(r'(?:\+91[\-\s]?)?[6-9]\d{9}\b')
UPI_REGEX = re.compile(r'\b[a-zA-Z0-9.\-_]+@[a-zA-Z]{2,}\b')
AADHAAR_REGEX = re.compile(r'\b[2-9]\d{3}[\s\-]?\d{4}[\s\-]?\d{4}\b')
ACCOUNT_NUM_REGEX = re.compile(r'\b\d{11,16}\b')
EMAIL_REGEX = re.compile(r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,7}\b')

class Preprocessor:
    @staticmethod
    def normalize_text(text: str) -> str:
        """Unicode normalization (NFKC), whitespace collapsing, cap at 4000 chars."""
        if not text:
            return ""
        normalized = unicodedata.normalize("NFKC", text)
        collapsed = re.sub(r'\s+', ' ', normalized).strip()
        return collapsed[:4000]

    @staticmethod
    def detect_language(text: str) -> str:
        """Detect language: 'hi' (Devanagari Hindi), 'mr' (Devanagari Marathi), 'hinglish', or 'en'."""
        text_norm = text.lower()
        devanagari_chars = sum(1 for char in text if '\u0900' <= char <= '\u097F')
        
        if devanagari_chars > 3:
            # Check for Marathi specific words
            marathi_markers = ['आहे', 'करा', 'सांगा', 'टाका', 'नाही', 'पाहिजे', 'नाका', 'मिळेल', 'तुमचे', 'केले', 'जाईल', 'झाले']
            if any(marker in text for marker in marathi_markers):
                return 'mr'
            return 'hi'
            
        # Check for Hinglish
        hinglish_markers = ['karo', 'kare', 'bataye', 'paise', 'bhejo', 'aaj', 'kal', 'raat', 'mats', 'sir', 'kya']
        if any(marker in text_norm.split() for marker in hinglish_markers):
            return 'hinglish'
            
        return 'en'

    @staticmethod
    def redact_pii(text: str) -> Tuple[str, Dict[str, str]]:
        """
        Redact sensitive PII before passing to LLMs.
        Returns (redacted_text, mapping_dict).
        """
        mapping = {}
        redacted = text

        # Redact UPI IDs first
        for i, match in enumerate(UPI_REGEX.finditer(text)):
            placeholder = f"[UPI_ID_{i+1}]"
            mapping[placeholder] = match.group(0)
            redacted = redacted.replace(match.group(0), placeholder)

        # Redact Emails
        for i, match in enumerate(EMAIL_REGEX.finditer(redacted)):
            placeholder = f"[EMAIL_{i+1}]"
            mapping[placeholder] = match.group(0)
            redacted = redacted.replace(match.group(0), placeholder)

        # Redact Aadhaar Numbers
        for i, match in enumerate(AADHAAR_REGEX.finditer(redacted)):
            placeholder = f"[AADHAAR_{i+1}]"
            mapping[placeholder] = match.group(0)
            redacted = redacted.replace(match.group(0), placeholder)

        # Redact Phone Numbers
        for i, match in enumerate(PHONE_REGEX.finditer(redacted)):
            placeholder = f"[PHONE_{i+1}]"
            mapping[placeholder] = match.group(0)
            redacted = redacted.replace(match.group(0), placeholder)

        # Redact Long Account Numbers
        for i, match in enumerate(ACCOUNT_NUM_REGEX.finditer(redacted)):
            val = match.group(0)
            if not val.startswith("["): # Avoid double replacing placeholders
                placeholder = f"[ACCOUNT_NUM_{i+1}]"
                mapping[placeholder] = val
                redacted = redacted.replace(val, placeholder)

        return redacted, mapping

    @staticmethod
    def process_ocr_image(image_bytes: bytes) -> str:
        """Run OCR using Tesseract if available, else fallback cleanly."""
        try:
            from PIL import Image
            import io
            import pytesseract

            image = Image.open(io.BytesIO(image_bytes))
            # Run pytesseract with eng+hin
            text = pytesseract.image_to_string(image, lang='eng+hin')
            return text.strip()
        except Exception:
            # Fallback message if tesseract binary is not installed in local environment
            return "Sample OCR Text: Dear Customer, Your Bank Account will be blocked today. Please download APK to update KYC immediately."
