'use client';

import React, { useState } from 'react';
import { BookOpen, ShieldAlert, CheckCircle, ArrowRight } from 'lucide-react';
import { Language, i18nDict } from '../lib/i18n';
import taxonomyData from '../../../../packages/shared/taxonomy.json';

interface ScamLibraryViewProps {
  lang: Language;
  onTrySample: (sampleText: string) => void;
}

export const ScamLibraryView: React.FC<ScamLibraryViewProps> = ({ lang, onTrySample }) => {
  const t = i18nDict[lang];
  const [selectedCat, setSelectedCat] = useState<any>(taxonomyData.categories[0]);

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center justify-center gap-2">
          <BookOpen className="w-7 h-7 text-teal-700 dark:text-teal-400" />
          <span>{t.nav_library}</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-lg mx-auto">
          Explore patterns, red flags, and truth behind India&apos;s 16 most common digital scam types.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Category List */}
        <div className="space-y-2 md:col-span-1 max-h-[600px] overflow-y-auto pr-1">
          {taxonomyData.categories.map((cat: any) => {
            const isSelected = selectedCat.id === cat.id;
            const labelText = cat.label[lang] || cat.label.en;

            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCat(cat)}
                className={`w-full p-3.5 rounded-2xl border text-left transition-all flex items-center justify-between gap-2 ${
                  isSelected
                    ? 'bg-teal-700 text-white border-teal-800 shadow-md font-bold'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-50'
                }`}
              >
                <span className="text-xs sm:text-sm line-clamp-1">{labelText}</span>
                <ArrowRight className={`w-4 h-4 shrink-0 ${isSelected ? 'text-white' : 'text-slate-400'}`} />
              </button>
            );
          })}
        </div>

        {/* Selected Category Details Card */}
        {selectedCat && (
          <div className="md:col-span-2 bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xl space-y-5">
            <div>
              <span className="text-[10px] uppercase font-bold text-teal-700 dark:text-teal-400 tracking-wider bg-teal-50 dark:bg-teal-950 px-2.5 py-1 rounded-full border border-teal-200 dark:border-teal-900">
                CATEGORY: {selectedCat.id}
              </span>
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mt-2">
                {selectedCat.label[lang] || selectedCat.label.en}
              </h3>
            </div>

            {/* Red Flags */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-rose-700 dark:text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4" />
                <span>Known Red Flags</span>
              </h4>
              <ul className="space-y-1.5">
                {(selectedCat.red_flags[lang] || selectedCat.red_flags.en || []).map((rf: string, idx: number) => (
                  <li key={idx} className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 flex items-start gap-2 bg-rose-50/50 dark:bg-rose-950/20 p-2.5 rounded-xl border border-rose-100 dark:border-rose-900">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-600 shrink-0 mt-2" />
                    <span>{rf}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Safe Truth */}
            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 space-y-1">
              <h4 className="text-xs font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span>The Safe Truth (What real agencies do)</span>
              </h4>
              <p className="text-xs sm:text-sm font-medium text-emerald-900 dark:text-emerald-200">
                {selectedCat.safe_truth[lang] || selectedCat.safe_truth.en}
              </p>
            </div>

            {/* Try Sample Button */}
            <div className="pt-2">
              <button
                onClick={() => onTrySample(`Sample text for category ${selectedCat.id}`)}
                className="w-full py-3 px-4 rounded-2xl bg-slate-900 hover:bg-slate-800 dark:bg-teal-700 dark:hover:bg-teal-800 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-all"
              >
                <span>Test a Sample of this Scam in Quick Check</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
