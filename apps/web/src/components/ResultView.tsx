'use client';

import React, { useState } from 'react';
import { AlertTriangle, CheckCircle2, ShieldAlert, ArrowLeft, Users, AlertOctagon, ThumbsUp, ThumbsDown, Sparkles } from 'lucide-react';
import { Language, i18nDict } from '../lib/i18n';
import { RiskMeter } from './RiskMeter';
import { ReadAloudButton } from './ReadAloudButton';

interface ResultViewProps {
  result: any;
  lang: Language;
  onReset: () => void;
  onAlertFamily: () => void;
  onOpenPanic: () => void;
}

export const ResultView: React.FC<ResultViewProps> = ({
  result,
  lang,
  onReset,
  onAlertFamily,
  onOpenPanic
}) => {
  const [feedbackSent, setFeedbackSent] = useState<string | null>(null);
  const t = i18nDict[lang];

  const verdict = result.verdict || 'SUSPICIOUS';
  const score = result.risk_score || 50;
  const redFlags = result.red_flags || [];
  const actions = result.recommended_actions || [];
  const explanation = result.explanation?.[lang] || result.explanation?.en || "Please review detected red flags.";

  let verdictTitle = t.suspicious_verdict;
  let verdictBg = 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200';
  let IconComponent = AlertTriangle;

  if (verdict === 'SAFE') {
    verdictTitle = t.safe_verdict;
    verdictBg = 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200';
    IconComponent = CheckCircle2;
  } else if (verdict === 'LIKELY_SCAM') {
    verdictTitle = t.likely_scam_verdict;
    verdictBg = 'bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800 text-rose-900 dark:text-rose-200';
    IconComponent = ShieldAlert;
  }

  const handleFeedback = (type: string) => {
    setFeedbackSent(type);
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6">
      {/* Back Button */}
      <button
        onClick={onReset}
        className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Check Another Message</span>
      </button>

      {/* Main Verdict Card */}
      <div className={`p-6 sm:p-8 rounded-3xl border-2 shadow-xl space-y-6 ${verdictBg}`}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-white dark:bg-slate-900 shadow-md">
              <IconComponent className="w-8 h-8 text-current" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight">
                {verdictTitle}
              </h2>
              <p className="text-xs font-semibold opacity-90">
                Category: <span className="uppercase">{result.category || 'Fraud Alert'}</span>
              </p>
            </div>
          </div>

          <ReadAloudButton
            textToRead={`${verdictTitle}. ${explanation}`}
            lang={lang}
            buttonLabel={t.read_aloud}
          />
        </div>

        {/* Risk Meter */}
        <RiskMeter score={score} verdict={verdict} label={t.risk_score_label} />

        {/* Plain Language Explanation */}
        <div className="bg-white/80 dark:bg-slate-900/80 p-4 sm:p-5 rounded-2xl border border-black/5 dark:border-white/10 space-y-1">
          <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Plain Language Summary
          </h3>
          <p className="text-sm sm:text-base font-medium text-slate-800 dark:text-slate-200">
            {explanation}
          </p>
        </div>

        {/* Top Red Flags */}
        {redFlags.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-600" />
              <span>{t.red_flags_label} ({redFlags.length})</span>
            </h3>
            <div className="space-y-2">
              {redFlags.map((rf: any, idx: number) => (
                <div key={idx} className="p-3.5 bg-white dark:bg-slate-900 rounded-2xl border border-rose-200 dark:border-rose-900/50 shadow-sm space-y-1">
                  <div className="flex items-center justify-between text-xs font-bold text-rose-700 dark:text-rose-400">
                    <span>FLAG #{idx + 1}: {rf.code}</span>
                    <span className="text-[10px] bg-rose-100 dark:bg-rose-950 px-2 py-0.5 rounded-full">High Warning</span>
                  </div>
                  <p className="text-xs text-slate-700 dark:text-slate-300 font-medium">
                    {rf.explanation?.[lang] || rf.explanation?.en || "Suspicious pattern match"}
                  </p>
                  {rf.evidence_span && (
                    <div className="text-[11px] font-mono bg-rose-50 dark:bg-rose-950/60 p-2 rounded-xl text-rose-900 dark:text-rose-300 border border-rose-100 dark:border-rose-900">
                      Quote: &quot;{rf.evidence_span}&quot;
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recommended Actions */}
        {actions.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              {t.actions_label}
            </h3>
            <div className="space-y-2">
              {actions.map((act: any, idx: number) => (
                <div key={idx} className="p-3.5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-teal-100 text-teal-800 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </div>
                  <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 font-medium">
                    {act.text?.[lang] || act.text?.en}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Family Alert & Panic Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            onClick={onAlertFamily}
            className="flex-1 py-3.5 px-5 rounded-2xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition-all hover:scale-[1.01]"
          >
            <Users className="w-4 h-4" />
            <span>{t.ask_family}</span>
          </button>

          <button
            onClick={onOpenPanic}
            className="flex-1 py-3.5 px-5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition-all hover:scale-[1.01]"
          >
            <AlertOctagon className="w-4 h-4" />
            <span>{t.panic_btn}</span>
          </button>
        </div>

        {/* Feedback Section */}
        <div className="flex items-center justify-between pt-4 border-t border-black/5 dark:border-white/10 text-xs font-semibold text-slate-600 dark:text-slate-400">
          <span>Was this verdict accurate?</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleFeedback('correct')}
              className={`p-2 rounded-xl border transition-colors ${
                feedbackSent === 'correct'
                  ? 'bg-emerald-100 border-emerald-300 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                  : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
              }`}
            >
              <ThumbsUp className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleFeedback('wrong')}
              className={`p-2 rounded-xl border transition-colors ${
                feedbackSent === 'wrong'
                  ? 'bg-rose-100 border-rose-300 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                  : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
              }`}
            >
              <ThumbsDown className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
