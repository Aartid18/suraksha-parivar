'use client';

import React, { useState, useEffect } from 'react';
import { ShieldAlert, Clock, Phone, FileText, CheckSquare, Square, Download, AlertOctagon, ArrowRight } from 'lucide-react';
import { Language, i18nDict } from '../lib/i18n';
import { ReadAloudButton } from './ReadAloudButton';

interface PanicFlowViewProps {
  lang: Language;
}

const CHECKLIST_STEPS = [
  {
    id: "stop_contact",
    title: {
      en: "1. Stop All Contact Immediately",
      hi: "1. तुरंत संपर्क बंद करें",
      mr: "1. संपर्क तात्काळ थांबवा"
    },
    detail: {
      en: "Disconnect the call or chat. Do not send more money under any pressure. Do NOT delete chat messages or call logs - keep them as evidence.",
      hi: "कॉल या व्हाट्सएप तुरंत बंद करें। दबाव में आकर और पैसे न भेजें। चैट और कॉल हिस्ट्री डिलीट न करें - यह साक्ष्य है।",
      mr: "कॉल किंवा व्हॉट्सॲप मेसेज लगेच थांबवा. दबावाखाली अधिक पैसे पाठवू नका. मेसेज किंवा कॉल लॉग डिलीट करू नका - हा पुरावा आहे."
    }
  },
  {
    id: "call_bank",
    title: {
      en: "2. Call Your Bank Helpline to Freeze Transfer",
      hi: "2. अपने बैंक हेल्पलाइन पर कॉल कर पैसे ब्लॉक करवाएं",
      mr: "2. तुमच्या बँक हेल्पलाइनवर कॉल करून ट्रान्सफर ब्लॉक करा"
    },
    detail: {
      en: "Call the official number printed on the back of your debit/credit card or inside your official bank app. Ask them to block card/UPI and freeze the UTR transaction immediately.",
      hi: "अपने एटीएम कार्ड के पीछे या बैंक पासबुक पर छपे आधिकारिक नंबर पर कॉल करें। यूपीआई आईडी ब्लॉक कराएं और ट्रांजैक्शन यूटीआर (UTR) नंबर बताएं।",
      mr: "तुमच्या एटीएम कार्डच्या मागे किंवा बँकेच्या अधिकृत नंबरवर कॉल करा. कार्ड/UPI ब्लॉक करा आणि ट्रान्सफर फ्रीज करायला सांगा."
    }
  },
  {
    id: "call_1930",
    title: {
      en: "3. Dial National Cyber Crime Helpline 1930",
      hi: "3. राष्ट्रीय साइबर अपराध हेल्पलाइन 1930 पर तुरंत कॉल करें",
      mr: "3. राष्ट्रीय सायबर गुन्हा हेल्पलाइन १९३० वर तातडीने कॉल करा"
    },
    detail: {
      en: "Dial 1930 from your phone as soon as possible. Reporting within the first 30-60 minutes significantly increases the chance of funds being frozen before withdrawal.",
      hi: "जितनी जल्दी हो सके 1930 नंबर डायल करें। शुरुआती 30-60 मिनट में शिकायत करने से पैसे होल्ड पर डाले जाने की संभावना बहुत बढ़ जाती है।",
      mr: "जितक्या लवकर होईल तितक्या लवकर १९३० डायल करा. पहिल्या ३०-६० मिनिटांत तक्रार केल्याने पैसे परत मिळण्याची शक्यता वाढते."
    }
  },
  {
    id: "file_portal",
    title: {
      en: "4. File Complaint on cybercrime.gov.in",
      hi: "4. cybercrime.gov.in पोर्टल पर शिकायत दर्ज करें",
      mr: "4. cybercrime.gov.in पोर्टलवर तक्रार नोंदवा"
    },
    detail: {
      en: "Submit the fraud details on the official National Cyber Crime Reporting Portal (cybercrime.gov.in). Use our exportable Evidence Pack PDF to easily paste transaction IDs.",
      hi: "आधिकारिक नेशनल साइबर क्राइम रिपोर्टिंग पोर्टल (cybercrime.gov.in) पर विवरण दर्ज करें। हमारे पीडीएफ (PDF) साक्ष्य दस्तावेज का उपयोग करें।",
      mr: "अधिकृत नॅशनल सायबर क्राईम रिपोर्टिंग पोर्टल (cybercrime.gov.in) वर माहिती सबमिट करा."
    }
  },
  {
    id: "secure_device",
    title: {
      en: "5. Secure Your Phone & Uninstall Remote Apps",
      hi: "5. अपने फोन को सुरक्षित करें और संदिग्ध ऐप्स हटाएं",
      mr: "5. तुमचा फोन सुरक्षित करा आणि ॲप्स काढून टाका"
    },
    detail: {
      en: "If you downloaded any app (AnyDesk, QuickSupport, .apk), uninstall it immediately. Turn off mobile data/Wi-Fi briefly, and change banking passwords from a separate safe device.",
      hi: "यदि आपने AnyDesk, QuickSupport या कोई APK इंस्टॉल किया है, तो उसे तुरंत अनइंस्टॉल करें। इंटरनेट बंद करें और पासवर्ड बदलें।",
      mr: "जर तुम्ही AnyDesk किंवा APK डाउनलोड केले असेल, तर ते लगेच अनइन्स्टॉल करा. इंटरनेट बंद करा आणि पासवर्ड बदला."
    }
  },
  {
    id: "report_number",
    title: {
      en: "6. Report Scammer Number on Sanchar Saathi (Chakshu)",
      hi: "6. संचार साथी (चक्षु) पर नंबर रिपोर्ट करें",
      mr: "6. संचार साथी (चक्षू) वर नंबर रिपोर्ट करा"
    },
    detail: {
      en: "Report the fraud caller/WhatsApp number on Sanchar Saathi (Chakshu portal) to help government block the scammer's SIM card.",
      hi: "धोखेबाज़ का नंबर संचार साथी (Chakshu) पोर्टल पर दर्ज करें ताकि सरकार उस सिम कार्ड को ब्लॉक कर सके।",
      mr: "फसवणूक करणाऱ्याचा नंबर संचार साथी (चक्षू) वर रिपोर्ट करा जेणेकरून सिम कार्ड ब्लॉक केले जाईल."
    }
  }
];

export const PanicFlowView: React.FC<PanicFlowViewProps> = ({ lang }) => {
  const t = i18nDict[lang];
  const [seconds, setSeconds] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Record<string, boolean>>({ stop_contact: true });

  // Evidence Form State
  const [amount, setAmount] = useState('25000');
  const [utrNumber, setUtrNumber] = useState('481920194821');
  const [suspectContact, setSuspectContact] = useState('+91 98765 43210');
  const [platform, setPlatform] = useState('WhatsApp Video Call');

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleStep = (id: string) => {
    setCompletedSteps((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleDownloadPDF = () => {
    // Open backend PDF generator endpoint inline
    const pdfUrl = `/api/v1/incidents/demo_incident/evidence-pack.pdf?lang=${lang}`;
    window.open(pdfUrl, '_blank');
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Panic Emergency Banner */}
      <div className="bg-rose-600 text-white rounded-3xl p-6 sm:p-8 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-white/20 backdrop-blur-md rounded-2xl">
              <AlertOctagon className="w-8 h-8 text-white animate-pulse" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black">
                {t.first_30_mins_title}
              </h2>
              <p className="text-xs sm:text-sm text-rose-100 font-medium">
                You are not alone. Acting fast in the first 30 minutes significantly helps freeze stolen funds.
              </p>
            </div>
          </div>

          {/* Incident Timer */}
          <div className="bg-black/30 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/20 flex items-center gap-2 self-start sm:self-auto">
            <Clock className="w-5 h-5 text-amber-300 animate-spin" />
            <div>
              <div className="text-[10px] uppercase tracking-wider text-rose-200 font-bold">{t.panic_timer}</div>
              <div className="text-lg font-mono font-bold text-white">{formatTime(seconds)}</div>
            </div>
          </div>
        </div>

        <div className="bg-white/10 p-3.5 rounded-2xl border border-white/10 text-xs font-semibold flex items-center justify-between">
          <span>Official Helpline Hotline: Dial <b>1930</b> | Portal: <b>cybercrime.gov.in</b></span>
          <a
            href="tel:1930"
            className="px-3 py-1.5 rounded-xl bg-white text-rose-700 font-bold hover:bg-rose-50 transition-colors inline-flex items-center gap-1 text-xs shadow-md"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>Call 1930 Now</span>
          </a>
        </div>
      </div>

      {/* Guided Checklist Steps */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-lg space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <CheckSquare className="w-5 h-5 text-teal-700 dark:text-teal-400" />
            <span>Step-by-Step Action Plan ({Object.values(completedSteps).filter(Boolean).length}/{CHECKLIST_STEPS.length} Completed)</span>
          </h3>
        </div>

        <div className="space-y-3">
          {CHECKLIST_STEPS.map((step) => {
            const isDone = completedSteps[step.id] || false;
            const titleText = step.title[lang] || step.title.en;
            const detailText = step.detail[lang] || step.detail.en;

            return (
              <div
                key={step.id}
                className={`p-4 rounded-2xl border transition-all ${
                  isDone
                    ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-900'
                    : 'bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div 
                    onClick={() => toggleStep(step.id)}
                    className="flex items-start gap-3 cursor-pointer flex-1"
                  >
                    {isDone ? (
                      <CheckSquare className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                    ) : (
                      <Square className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
                    )}
                    <div>
                      <h4 className={`text-sm sm:text-base font-bold ${isDone ? 'line-through text-slate-500' : 'text-slate-900 dark:text-white'}`}>
                        {titleText}
                      </h4>
                      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium mt-1">
                        {detailText}
                      </p>
                    </div>
                  </div>

                  <ReadAloudButton textToRead={`${titleText}. ${detailText}`} lang={lang} buttonLabel="Listen" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Evidence Capture Form */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-lg space-y-4">
        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <FileText className="w-5 h-5 text-teal-700 dark:text-teal-400" />
          <span>Evidence Details (For 1930 & PDF Export)</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-bold text-slate-600 dark:text-slate-400 block mb-1">Stolen Amount (INR)</label>
            <input
              type="text"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm font-semibold"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-600 dark:text-slate-400 block mb-1">Transaction Ref / UTR Number</label>
            <input
              type="text"
              value={utrNumber}
              onChange={(e) => setUtrNumber(e.target.value)}
              className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm font-mono font-semibold"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-600 dark:text-slate-400 block mb-1">Scammer Phone / UPI Handle</label>
            <input
              type="text"
              value={suspectContact}
              onChange={(e) => setSuspectContact(e.target.value)}
              className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm font-semibold"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-600 dark:text-slate-400 block mb-1">Platform Used</label>
            <input
              type="text"
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}
              className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm font-semibold"
            />
          </div>
        </div>

        {/* Download Evidence Pack PDF */}
        <div className="pt-2">
          <button
            onClick={handleDownloadPDF}
            className="w-full py-3.5 px-6 rounded-2xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg transition-all hover:scale-[1.01]"
          >
            <Download className="w-5 h-5" />
            <span>{t.download_pdf}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
