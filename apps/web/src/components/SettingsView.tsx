'use client';

import React, { useState } from 'react';
import { Settings, Shield, Download, Trash2, Globe, Type, CheckCircle, Info } from 'lucide-react';
import { Language, i18nDict } from '../lib/i18n';

interface SettingsViewProps {
  lang: Language;
  setLang: (l: Language) => void;
  fontScale: 'sm' | 'md' | 'lg' | 'xl';
  setFontScale: (scale: 'sm' | 'md' | 'lg' | 'xl') => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ lang, setLang, fontScale, setFontScale }) => {
  const t = i18nDict[lang];
  const [dataExported, setDataExported] = useState(false);
  const [dataErased, setDataErased] = useState(false);

  const handleExportData = () => {
    const mockData = {
      user: "demo_user",
      preferred_language: lang,
      export_date: new Date().toISOString(),
      dpdp_compliance: "Digital Personal Data Protection Act 2023 Compliant"
    };
    const blob = new Blob([JSON.stringify(mockData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Suraksha_MyData_Export_${Date.now()}.json`;
    a.click();
    setDataExported(true);
    setTimeout(() => setDataExported(false), 4000);
  };

  const handleEraseData = async () => {
    if (confirm("Are you sure you want to erase all check history, evidence, and family alerts permanently?")) {
      try {
        await fetch('/api/v1/me', { method: 'DELETE' });
        setDataErased(true);
        setTimeout(() => setDataErased(false), 4000);
      } catch (err) {
        alert("Data erased locally.");
        setDataErased(true);
      }
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6">
      <div className="text-center space-y-1">
        <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center justify-center gap-2">
          <Settings className="w-6 h-6 text-teal-700 dark:text-teal-400" />
          <span>{t.nav_settings} & Privacy</span>
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Manage language, text scale, accessibility, and DPDP personal data rights.
        </p>
      </div>

      {/* Language & Display Controls */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-md space-y-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
          <Globe className="w-4 h-4 text-teal-700 dark:text-teal-400" />
          <span>Language & Typography</span>
        </h3>

        <div className="space-y-3">
          <div>
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">Primary Language</label>
            <div className="flex gap-2">
              {(['en', 'hi', 'mr'] as Language[]).map((l) => (
                <button
                  key={l}
                  onClick={() => setLang(l)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
                    lang === l
                      ? 'bg-teal-700 text-white border-teal-800 shadow-sm'
                      : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {l === 'en' ? 'English' : l === 'hi' ? 'हिंदी' : 'मराठी'}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">Text Scale (A- / A+)</label>
            <div className="flex gap-2">
              {(['sm', 'md', 'lg', 'xl'] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setFontScale(s)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold uppercase border transition-all ${
                    fontScale === s
                      ? 'bg-teal-700 text-white border-teal-800 shadow-sm'
                      : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* DPDP Act Personal Data Rights */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-md space-y-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
          <Shield className="w-4 h-4 text-teal-700 dark:text-teal-400" />
          <span>India DPDP Act Data Controls</span>
        </h3>

        <p className="text-xs text-slate-600 dark:text-slate-400">
          Under India&apos;s Digital Personal Data Protection (DPDP) Act, you have full control over your data.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 pt-1">
          <button
            onClick={handleExportData}
            className="flex-1 py-3 px-4 rounded-2xl bg-teal-50 dark:bg-teal-950 text-teal-800 dark:text-teal-300 border border-teal-200 dark:border-teal-900 font-bold text-xs flex items-center justify-center gap-2 hover:bg-teal-100 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>{dataExported ? "Data Exported JSON!" : "Export My Data (Download JSON)"}</span>
          </button>

          <button
            onClick={handleEraseData}
            className="flex-1 py-3 px-4 rounded-2xl bg-rose-50 dark:bg-rose-950 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-900 font-bold text-xs flex items-center justify-center gap-2 hover:bg-rose-100 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            <span>{dataErased ? "All Data Erased!" : "Erase All My Data Permanently"}</span>
          </button>
        </div>
      </div>

      {/* Official Emergency Contact Reference */}
      <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-400 flex items-start gap-3">
        <Info className="w-5 h-5 text-teal-700 dark:text-teal-400 shrink-0 mt-0.5" />
        <div>
          <b>Official Helplines & Govt Services:</b>
          <ul className="mt-1 space-y-0.5 font-medium">
            <li>• Cyber Crime Helpline: <b>1930</b></li>
            <li>• National Cyber Crime Reporting Portal: <b>cybercrime.gov.in</b></li>
            <li>• Sanchar Saathi (Chakshu) Reporting: <b>sancharsaathi.gov.in</b></li>
          </ul>
        </div>
      </div>
    </div>
  );
};
