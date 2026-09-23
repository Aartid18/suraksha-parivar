'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface RiskMeterProps {
  score: number; // 0-100
  verdict: 'SAFE' | 'SUSPICIOUS' | 'LIKELY_SCAM';
  label: string;
}

export const RiskMeter: React.FC<RiskMeterProps> = ({ score, verdict, label }) => {
  let badgeBg = 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-300';
  let barColor = 'bg-emerald-500';

  if (verdict === 'SUSPICIOUS') {
    badgeBg = 'bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300 border-amber-300';
    barColor = 'bg-amber-500';
  } else if (verdict === 'LIKELY_SCAM') {
    badgeBg = 'bg-rose-100 text-rose-900 dark:bg-rose-950 dark:text-rose-300 border-rose-300';
    barColor = 'bg-rose-600';
  }

  return (
    <div className="w-full bg-slate-50 dark:bg-slate-800/80 rounded-2xl p-4 border border-slate-200 dark:border-slate-700">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
          {label}
        </span>
        <span className={`text-xs font-bold px-3 py-1 rounded-full border ${badgeBg}`}>
          {score}/100 Risk Score
        </span>
      </div>

      {/* Meter Bar */}
      <div className="relative w-full h-4 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden shadow-inner">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className={`h-full ${barColor} rounded-full`}
        />
      </div>

      {/* Ticks */}
      <div className="flex justify-between text-[10px] font-medium text-slate-500 dark:text-slate-400 mt-1 px-1">
        <span>0 (Safe)</span>
        <span>35 (Suspicious)</span>
        <span>70 (Likely Scam)</span>
      </div>
    </div>
  );
};
