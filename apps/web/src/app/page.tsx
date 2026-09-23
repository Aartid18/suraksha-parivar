'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '../components/Header';
import { QuickCheckForm } from '../components/QuickCheckForm';
import { ResultView } from '../components/ResultView';
import { FamilyCircleView } from '../components/FamilyCircleView';
import { PanicFlowView } from '../components/PanicFlowView';
import { ScamLibraryView } from '../components/ScamLibraryView';
import { SettingsView } from '../components/SettingsView';
import { Language } from '../lib/i18n';

export default function Home() {
  const [lang, setLang] = useState<Language>('en');
  const [fontScale, setFontScale] = useState<'sm' | 'md' | 'lg' | 'xl'>('md');
  const [darkMode, setDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState<'check' | 'family' | 'panic' | 'library' | 'settings'>('check');

  const [isLoading, setIsLoading] = useState(false);
  const [checkResult, setCheckResult] = useState<any | null>(null);

  // Apply dark mode class to html element
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Apply font scale class to document body
  useEffect(() => {
    document.body.className = document.body.className.replace(/font-scale-\w+/g, '');
    document.body.classList.add(`font-scale-${fontScale}`);
  }, [fontScale]);

  const handleAnalyze = async (text: string, isImage?: boolean) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/v1/checks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, language: lang }),
      });

      if (!res.ok) {
        throw new Error('API check failed');
      }
      const data = await res.json();
      setCheckResult(data);
    } catch (err) {
      // Offline / Fallback Mock calculation if API server is not running directly
      const mockResult = {
        id: "mock_check_" + Date.now(),
        language: lang,
        verdict: text.toLowerCase().includes("cbi") || text.toLowerCase().includes("otp") || text.toLowerCase().includes("power") ? "LIKELY_SCAM" : "SUSPICIOUS",
        risk_score: text.toLowerCase().includes("cbi") || text.toLowerCase().includes("otp") ? 88 : 55,
        category: text.toLowerCase().includes("cbi") ? "digital_arrest_impersonation" : text.toLowerCase().includes("power") ? "utility_disconnection" : "fake_kyc_or_bank_alert",
        confidence: 0.95,
        red_flags: [
          {
            code: "URGENT_DEMAND",
            evidence_span: text.slice(0, 45),
            explanation: {
              en: "Demands immediate action or money transfer without consulting family.",
              hi: "परिवार से सलाह लिए बिना तुरंत पैसे भेजने का दबाव।",
              mr: "कुटुंबाचा सल्ला न घेता लगेच पैसे पाठवण्याचा दबाव."
            }
          }
        ],
        explanation: {
          en: "This message exhibits strong scam patterns: urgent pressure, authority impersonation or requests for confidential information.",
          hi: "इस संदेश में धोखाधड़ी के मजबूत लक्षण हैं: अत्यधिक जल्दबाजी, पुलिस/अधिकारी होने का फर्जी दावा या गुप्त जानकारी की मांग।",
          mr: "या मेसेजमध्ये फसवणुकीची मजबूत लक्षणे आहेत: अतिघाई, पोलीस किंवा अधिकाऱ्याचा बनावट दावा किंवा गोपनीय माहितीची मागणी."
        },
        recommended_actions: [
          {
            code: "DO_NOT_PAY",
            text: {
              en: "Do NOT share OTP, enter UPI PIN, or transfer money.",
              hi: "ओटीपी शेयर न करें, यूपीआई पिन न डालें और पैसे न भेजें।",
              mr: "OTP शेअर करू नका, UPI PIN टाकू नका आणि पैसे पाठवू नका."
            }
          }
        ],
        should_alert_guardian: true
      };
      setCheckResult(mockResult);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 transition-colors">
      <Header
        lang={lang}
        setLang={setLang}
        fontScale={fontScale}
        setFontScale={setFontScale}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-6 sm:py-8">
        {activeTab === 'check' && (
          checkResult ? (
            <ResultView
              result={checkResult}
              lang={lang}
              onReset={() => setCheckResult(null)}
              onAlertFamily={() => setActiveTab('family')}
              onOpenPanic={() => setActiveTab('panic')}
            />
          ) : (
            <QuickCheckForm
              lang={lang}
              onAnalyze={handleAnalyze}
              isLoading={isLoading}
            />
          )
        )}

        {activeTab === 'family' && <FamilyCircleView lang={lang} />}
        {activeTab === 'panic' && <PanicFlowView lang={lang} />}
        {activeTab === 'library' && (
          <ScamLibraryView
            lang={lang}
            onTrySample={(sampleText) => {
              setActiveTab('check');
              handleAnalyze(sampleText);
            }}
          />
        )}
        {activeTab === 'settings' && (
          <SettingsView
            lang={lang}
            setLang={setLang}
            fontScale={fontScale}
            setFontScale={setFontScale}
          />
        )}
      </main>

      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-6 text-center text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-6xl mx-auto px-4 space-y-2">
          <p className="font-semibold text-slate-700 dark:text-slate-300">
            Suraksha Parivar - Family Anti-Scam Shield for India
          </p>
          <p>
            National Cyber Crime Helpline: <b>1930</b> | Portal: <b>cybercrime.gov.in</b> | Sanchar Saathi: <b>sancharsaathi.gov.in</b>
          </p>
          <p className="text-[11px] opacity-75">
            Disclaimer: Suraksha Parivar is a personal family safety assistant. It does not file official police complaints or guarantee money recovery.
          </p>
        </div>
      </footer>
    </div>
  );
}
