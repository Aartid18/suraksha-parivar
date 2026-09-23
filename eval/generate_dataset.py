import json
import os

CATEGORIES = [
    "digital_arrest_impersonation", "upi_collect_or_refund", "fake_kyc_or_bank_alert",
    "investment_or_trading_group", "task_or_parttime_job", "boss_or_ceo_impersonation",
    "fake_customer_care", "utility_disconnection", "courier_or_customs_parcel",
    "loan_app_harassment", "qr_code_trick", "remote_access_or_apk",
    "lottery_or_prize", "romance_or_matrimonial_investment", "sextortion_or_blackmail",
    "other_suspicious"
]

SCAM_TEMPLATES = {
    "digital_arrest_impersonation": [
        ("CBI Officer calling. Your passport was found in illegal drugs parcel. Video call immediately under digital arrest.", "en"),
        ("पुलिस हेडक्वाटर से नोटिस: आपके नाम पर गैरकानूनी पार्सल मिला है। तुरंत वीडियो कॉल पर आएं।", "hi"),
        ("पोलीस अरेस्ट वॉरंट: तुमच्या नावावर बेकायदेशीर पार्सल सापडले आहे. तातडीने ऑनलाइन हजर राहा.", "mr"),
        ("ED Officer calling sir, transfer money to safe government account to clear your name from digital arrest.", "hinglish")
    ],
    "upi_collect_or_refund": [
        ("You received Rs 5000 refund from Amazon. Enter your UPI PIN to claim money now.", "en"),
        ("पेटीएम रिफंड 2500 रुपये प्राप्त करें। तुरंत अपना यूपाआई पिन दर्ज करें।", "hi"),
        ("फोनपे ५००० रुपये परतावा मिळवा. तुमचा युपीआय पिन टाका.", "mr"),
        ("Enter UPI PIN to receive 10,000 cash prize in your bank account.", "en")
    ],
    "fake_kyc_or_bank_alert": [
        ("Dear Customer, your SBI Account blocked today. Update KYC by clicking link: http://bit.ly/sbi-kyc-verify", "en"),
        ("एचडीएफसी बैंक: आपका खाता आज रात बंद हो जाएगा। तुरंत इस लिंक पर जाकर केवाईसी अपडेट करें।", "hi"),
        ("तुमचे बँक खाते आज बंद होईल. खालील लिंकवरून ॲप इन्स्टॉल करा.", "mr"),
        ("Airtel SIM block alert: Download APK file to verify SIM immediately.", "en")
    ],
    "investment_or_trading_group": [
        ("Join our WhatsApp VIP trading group. Earn 20% daily guaranteed profit in stock market.", "en"),
        ("गारंटीड दैनिक कमाई! शेयर बाजार में रोज 15% मुनाफा कमाएं। व्हाट्सएप ग्रुप जॉइन करें।", "hi"),
        ("रोज ५००० रुपये खात्रीशीर नफा मिळवा. आमच्या टेलिग्राम ग्रुपमध्ये सामील व्हा.", "mr"),
        ("Crypto investment secret: Double your investment in 3 days. Contact sir now.", "hinglish")
    ],
    "task_or_parttime_job": [
        ("Earn Rs 3000 per day by liking YouTube videos. No experience needed. Contact Telegram.", "en"),
        ("पार्ट टाइम जॉब: यूट्यूब वीडियो लाइक करके रोज 2000 कमाएं। प्रीपेड टास्क पूरा करें।", "hi"),
        ("घरबसल्या जॉब: व्हिडिओ लाईक करून रोज पैसे कमवा. टेलिग्राम मेसेज करा.", "mr"),
        ("Part time work from home: deposit Rs 1000 to unlock Rs 5000 bonus task.", "en")
    ],
    "utility_disconnection": [
        ("Electricity bill pending. Power cut tonight at 9:30 PM. Call Electricity Officer at 9876543210 immediately.", "en"),
        ("बिजली विभाग चेतावनी: आज रात 9 बजे बिजली काट दी जाएगी। बिल भरने के लिए इस नंबर पर कॉल करें।", "hi"),
        ("वीज बिल बाकी आहे. आज रात्री वीज पुरवठा खंडित केला जाईल. अधिकाऱ्याला कॉल करा.", "mr"),
        ("Urgent: Pay water bill via link before midnight or face connection cut.", "en")
    ],
    "remote_access_or_apk": [
        ("Customer support: Download AnyDesk app so our officer can fix your bank transfer.", "en"),
        ("बैंक सहायता: एनीडेस्क ऐप डाउनलोड करें और स्क्रीन शेयर चालू रखें।", "hi"),
        ("ॲप अपडेटसाठी एनीडेस्क डाउनलोड करा आणि कोड सांगा.", "mr"),
        ("Install QuickSupport.apk to claim your cash refund immediately.", "en")
    ]
}

BENIGN_TEMPLATES = [
    ("Your OTP for HDFC NetBanking transaction is 482910. Do NOT share this OTP with anyone, including bank staff.", "en"),
    ("आपका एचडीएफसी बैंक ओटीपी 592014 है। यह कोड किसी के साथ साझा न करें।", "hi"),
    ("तुमचा बँक ओटीपी ३९४८२० आहे. हा कोड कोणालाही सांगू नका.", "mr"),
    ("Dear customer, your electricity bill of Rs 1,450 for A/C 4920194 is generated. Due date 28-Sep.", "en"),
    ("प्रिय ग्राहक, आपका एलपीजी सिलेंडर आज शाम 5 बजे डिलीवर होगा। धन्यवाद।", "hi"),
    ("तुमचे पार्सल आज डिलिव्हरीसाठी बाहेर पडले आहे. डिलिव्हरी बॉय क्रमांक ९८७६५४३२१०.", "mr"),
    ("Hey mom, reach home safely after shopping. Let me know when you reach.", "en"),
    ("पापा घर आते समय दूध ले आना।", "hi"),
    ("भावा आज संध्याकाळी भेटूया चहासाठी.", "mr"),
    ("Your Swiggy order #49102 has been picked up by delivery executive Rahul.", "en"),
    ("Alert: Rs 500 debited from account ending 4819 at D-Mart via UPI. Avail balance: Rs 14,200.", "en"),
    ("खाता संख्या 4819 से 1000 रुपये एटीएम से निकाले गए। शेष राशि 25,400 रुपये।", "hi"),
    ("याद दिलाना: कल सुबह 10 बजे डॉक्टर शर्मा के साथ आपका अपॉइंटमेंट है।", "hi"),
    ("Reminder: Your mobile recharge will expire in 3 days. Recharge now on MyJio app.", "en")
]

def generate_dataset():
    data = []
    item_id = 1

    # Generate ~250 Scam Items across categories and languages
    for i in range(16):
        cat = CATEGORIES[i % len(CATEGORIES)]
        templates = SCAM_TEMPLATES.get(cat, SCAM_TEMPLATES["digital_arrest_impersonation"])
        for text, lang in templates:
            # Create variations
            for var in [text, text + " Hurry act now!", text + " Strictly confidential."]:
                split = "test" if item_id % 4 == 0 else "dev" if item_id % 3 == 0 else "train"
                data.append({
                    "id": f"SCAM_{item_id:04d}",
                    "text": var,
                    "language": lang,
                    "label_verdict": "LIKELY_SCAM",
                    "label_category": cat,
                    "split": split,
                    "source": "synthetic",
                    "notes": f"Synthetic scam sample for category {cat}"
                })
                item_id += 1

    # Fill remaining to reach ~260 scam items
    while len(data) < 260:
        cat = CATEGORIES[len(data) % len(CATEGORIES)]
        data.append({
            "id": f"SCAM_{item_id:04d}",
            "text": f"Urgent security notice regarding {cat}: Transfer money to safe account immediately.",
            "language": "en",
            "label_verdict": "LIKELY_SCAM",
            "label_category": cat,
            "split": "test" if item_id % 4 == 0 else "dev",
            "source": "synthetic",
            "notes": "Synthetic scam sample"
        })
        item_id += 1

    # Generate ~150 Benign Items
    benign_count = 0
    while len(data) < 410:
        text, lang = BENIGN_TEMPLATES[benign_count % len(BENIGN_TEMPLATES)]
        split = "test" if item_id % 4 == 0 else "dev" if item_id % 3 == 0 else "train"
        data.append({
            "id": f"BENIGN_{item_id:04d}",
            "text": text if benign_count < len(BENIGN_TEMPLATES) else f"{text} Ref #{benign_count}",
            "language": lang,
            "label_verdict": "SAFE",
            "label_category": "benign",
            "split": split,
            "source": "synthetic",
            "notes": "Synthetic genuine message with hard negative cues"
        })
        item_id += 1
        benign_count += 1

    out_dir = os.path.join(os.path.dirname(__file__), "data")
    os.makedirs(out_dir, exist_ok=True)
    out_file = os.path.join(out_dir, "dataset.jsonl")

    with open(out_file, "w", encoding="utf-8") as f:
        for item in data:
            f.write(json.dumps(item, ensure_ascii=False) + "\n")

    print(f"Generated {len(data)} items in {out_file}")

if __name__ == "__main__":
    generate_dataset()
