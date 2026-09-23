'use client';

import React, { useState } from 'react';
import { ShieldAlert, ImageIcon, Sparkles, Send, FileText } from 'lucide-react';
import { Language, i18nDict } from '../lib/i18n';

interface QuickCheckFormProps {
  lang: Language;
  onAnalyze: (text: string, isImage?: boolean) => void;
  isLoading: boolean;
}

const SAMPLE_SCAMS = [
  {
    label: {
      en: "🚨 Fake CBI Digital Arrest",
      hi: "🚨 फर्जी सीबीआई अरेस्ट कॉल",
      mr: "🚨 बनावट सीबीआय डिजिटल अटक"
    },
    text: "CBI Notice: Illegal drugs found in your parcel sent from Mumbai. Video call immediately under digital arrest or transfer Rs 50,000 to safe verification account."
  },
  {
    label: {
      en: "📲 UPI PIN Refund Trick",
      hi: "📲 यूपीआई पिन रिफंड फ्रॉड",
      mr: "📲 UPI PIN रिफंड फसवणूक"
    },
    text: "Amazon Customer Care: You received Rs 4,999 refund. Click link and enter your UPI PIN to claim cash in bank immediately."
  },
  {
    label: {
      en: "⚡ Electricity Cut Threat",
      hi: "⚡ बिजली कटने की धमकी",
      mr: "⚡ वीज पुरवठा खंडित धमकी"
    },
    text: "Urgent Warning: Your Electricity bill is pending. Power will be disconnected tonight at 9:30 PM. Call Electricity Officer at 9876543210 to update."
  },
  {
    label: {
      en: "💼 Part-Time Job Scam",
      hi: "💼 पार्ट-टाइम जॉब लालच",
      mr: "💼 घरबसल्या नोकरी फसवणूक"
    },
    text: "Earn Rs 3,000 per day by liking YouTube videos from home. Deposit Rs 1,000 to unlock your VIP prepaid task now."
  }
];

export const QuickCheckForm: React.FC<QuickCheckFormProps> = ({ lang, onAnalyze, isLoading }) => {
  const [inputText, setInputText] = useState('');
  const t = i18nDict[lang];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    onAnalyze(inputText);
  };

  const handleSampleClick = (sampleText: string) => {
    setInputText(sampleText);
    onAnalyze(sampleText);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Simulate OCR image text insertion for demo
      const sampleOcrText = "Dear Customer, Your SBI Account blocked today. Please download APK to update KYC immediately: http://bit.ly/sbi-verify";
      setInputText(sampleOcrText);
      onAnalyze(sampleOcrText, true);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6">
      {/* Hero Header */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          {t.hero_title}
        </h2>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-xl mx-auto">
          {t.hero_subtitle}
        </p>
      </div>

      {/* Main Check Input Box */}
      <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
        <div className="relative">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            rows={5}
            placeholder={t.input_placeholder}
            className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-teal-700 focus:border-transparent text-sm sm:text-base resize-none transition-all"
          />
          <div className="absolute bottom-3 right-3 text-xs text-slate-400 font-medium">
            {inputText.length}/4000
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          <label className="cursor-pointer inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-teal-700 dark:text-teal-400 hover:text-teal-800 bg-teal-50 dark:bg-teal-950/40 px-3.5 py-2.5 rounded-xl border border-teal-200 dark:border-teal-900 transition-colors">
            <FileText className="w-4 h-4" />
            <span>{t.upload_img}</span>
            <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
          </label>

          <button
            type="submit"
            disabled={isLoading || !inputText.trim()}
            className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 transition-all hover:scale-[1.02]"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                {t.checking}
              </span>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>{t.check_btn}</span>
              </>
            )}
          </button>
        </div>

        <p className="text-xs text-slate-500 dark:text-slate-400 text-center font-medium pt-2 border-t border-slate-100 dark:border-slate-800">
          🔒 {t.privacy_promise}
        </p>
      </form>

      {/* Sample Scam Chips */}
      <div className="space-y-2">
        <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-center">
          {t.try_sample}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {SAMPLE_SCAMS.map((sample, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSampleClick(sample.text)}
              className="p-3 text-left rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 hover:border-teal-500 dark:hover:border-teal-500 hover:shadow-md transition-all group"
            >
              <div className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-teal-700 dark:group-hover:text-teal-400">
                {sample.label[lang] || sample.label.en}
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                {sample.text}
              </p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
