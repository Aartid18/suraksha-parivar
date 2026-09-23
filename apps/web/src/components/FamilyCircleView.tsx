'use client';

import React, { useState } from 'react';
import { Users, UserPlus, ShieldCheck, PhoneCall, MessageCircle, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { Language, i18nDict } from '../lib/i18n';

interface FamilyCircleViewProps {
  lang: Language;
}

export const FamilyCircleView: React.FC<FamilyCircleViewProps> = ({ lang }) => {
  const t = i18nDict[lang];
  const [inviteCopied, setInviteCopied] = useState(false);
  const [consentLevel, setConsentLevel] = useState<'alert_only' | 'redacted_summary' | 'full_message'>('redacted_summary');

  const mockAlerts = [
    {
      id: "alert_101",
      from: "Ramesh Sharma (Dad)",
      category: "Fake Police Digital Arrest",
      verdict: "LIKELY_SCAM",
      risk_score: 88,
      time: "10 mins ago",
      summary: "Received video call from caller claiming to be CBI officer threatening digital arrest.",
      status: "new",
      whatsapp_url: "https://wa.me/?text=Hi%20Dad,%20I%20saw%20your%20Suraksha%20alert.%20Do%20not%20pay%20anyone!"
    },
    {
      id: "alert_102",
      from: "Sunita Sharma (Mom)",
      category: "Electricity Disconnection Threat",
      verdict: "SUSPICIOUS",
      risk_score: 55,
      time: "2 hours ago",
      summary: "SMS claiming electricity will be cut tonight at 9:30 PM.",
      status: "confirmed_scam",
      whatsapp_url: "https://wa.me/?text=Hi%20Mom,%20that%20electricity%20bill%20SMS%20is%20a%20fake%20scam."
    }
  ];

  const handleCopyInvite = () => {
    navigator.clipboard.writeText("https://suraksha.app/join?token=sharma-family-2026");
    setInviteCopied(true);
    setTimeout(() => setInviteCopied(false), 3000);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Family Circle Banner */}
      <div className="bg-gradient-to-r from-teal-700 to-teal-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl space-y-3">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-white/10 backdrop-blur-md rounded-2xl">
            <Users className="w-8 h-8 text-teal-200" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black">
              {t.family_circle_title} (Sharma Parivar)
            </h2>
            <p className="text-xs sm:text-sm text-teal-100 font-medium">
              Protected Members: 3 | Active Guardians: 2
            </p>
          </div>
        </div>

        {/* Invite Link Generator */}
        <div className="pt-4 flex flex-col sm:flex-row items-center gap-3">
          <button
            onClick={handleCopyInvite}
            className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-white text-teal-900 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 hover:bg-teal-50 transition-all shadow-md"
          >
            <UserPlus className="w-4 h-4 text-teal-700" />
            <span>{inviteCopied ? "Invite Link Copied! (Share via WhatsApp)" : t.invite_member}</span>
          </button>

          <span className="text-xs text-teal-200 font-medium">
            Single-use link valid for 48 hours via WhatsApp / SMS
          </span>
        </div>
      </div>

      {/* Privacy Consent Settings */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-md space-y-4">
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-6 h-6 text-teal-700 dark:text-teal-400" />
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Granular Consent & Sharing Settings
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Control what information your family guardian sees when you trigger an alert.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <button
            onClick={() => setConsentLevel('alert_only')}
            className={`p-3.5 rounded-2xl border text-left text-xs font-semibold transition-all ${
              consentLevel === 'alert_only'
                ? 'border-teal-700 bg-teal-50 dark:bg-teal-950 text-teal-900 dark:text-teal-200 font-bold'
                : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
            }`}
          >
            <div className="font-bold mb-1">1. Alert Only</div>
            <p className="text-[11px] font-normal opacity-80">Notify guardian that a scam was detected without sharing message contents.</p>
          </button>

          <button
            onClick={() => setConsentLevel('redacted_summary')}
            className={`p-3.5 rounded-2xl border text-left text-xs font-semibold transition-all ${
              consentLevel === 'redacted_summary'
                ? 'border-teal-700 bg-teal-50 dark:bg-teal-950 text-teal-900 dark:text-teal-200 font-bold'
                : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
            }`}
          >
            <div className="font-bold mb-1">2. Redacted Summary (Recommended)</div>
            <p className="text-[11px] font-normal opacity-80">Share category, risk score, and plain language summary with PII masked.</p>
          </button>

          <button
            onClick={() => setConsentLevel('full_message')}
            className={`p-3.5 rounded-2xl border text-left text-xs font-semibold transition-all ${
              consentLevel === 'full_message'
                ? 'border-teal-700 bg-teal-50 dark:bg-teal-950 text-teal-900 dark:text-teal-200 font-bold'
                : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
            }`}
          >
            <div className="font-bold mb-1">3. Full Message</div>
            <p className="text-[11px] font-normal opacity-80">Share complete text with guardian for maximum clarity.</p>
          </button>
        </div>
      </div>

      {/* Guardian Alert Inbox */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-amber-500" />
          <span>{t.guardian_inbox} ({mockAlerts.length})</span>
        </h3>

        <div className="space-y-3">
          {mockAlerts.map((alert) => (
            <div key={alert.id} className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-lg space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-rose-500 animate-ping" />
                  <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                    Alert from {alert.from}
                  </h4>
                </div>
                <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {alert.time}
                </span>
              </div>

              <div className="bg-slate-50 dark:bg-slate-800 p-3.5 rounded-2xl border border-slate-100 dark:border-slate-700 space-y-1 text-xs sm:text-sm">
                <div className="font-bold text-rose-700 dark:text-rose-400">
                  {alert.category} ({alert.verdict})
                </div>
                <p className="text-slate-700 dark:text-slate-300 font-medium">
                  &quot;{alert.summary}&quot;
                </p>
              </div>

              {/* 1-Tap Guardian Response Actions */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <a
                    href={alert.whatsapp_url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 sm:flex-none py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs inline-flex items-center justify-center gap-2 shadow-sm"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>WhatsApp Member</span>
                  </a>

                  <a
                    href="tel:+919876543210"
                    className="flex-1 sm:flex-none py-2.5 px-4 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs inline-flex items-center justify-center gap-2 shadow-sm"
                  >
                    <PhoneCall className="w-4 h-4" />
                    <span>Call Back</span>
                  </a>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold">
                  <span>Status:</span>
                  <span className="bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 px-2.5 py-1 rounded-full uppercase text-[10px]">
                    {alert.status}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
