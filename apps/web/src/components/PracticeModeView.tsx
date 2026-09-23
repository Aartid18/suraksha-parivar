'use client';

import React, { useState } from 'react';
import { HelpCircle, CheckCircle2, XCircle, ArrowRight, RotateCcw, Award } from 'lucide-react';
import { Language } from '../lib/i18n';

interface PracticeModeViewProps {
  lang: Language;
}

const SCENARIOS = [
  {
    id: 1,
    situation: "An unknown WhatsApp caller claims to be a CBI Officer. He says your parcel contained illegal drugs and demands you stay on video call or transfer Rs 50,000 to a verification account.",
    options: [
      { text: "Pay Rs 50,000 immediately to avoid arrest", isCorrect: false },
      { text: "Stay on video call and do not tell family", isCorrect: false },
      { text: "Hang up, verify through official police office, and tell family", isCorrect: true },
      { text: "Send your Aadhaar photo to prove innocence", isCorrect: false }
    ],
    explanation: "No genuine police or CBI officer arrests anyone over video call or asks for money to clear a case. Always hang up and ask family."
  },
  {
    id: 2,
    situation: "You receive an SMS: 'Dear Customer, your Electricity bill is pending. Power will be cut tonight at 9:30 PM. Call Electricity Officer at 9876543210 immediately.'",
    options: [
      { text: "Call the personal mobile number given in SMS", isCorrect: false },
      { text: "Check your bill in official app or call official helpline", isCorrect: true },
      { text: "Click any link in the SMS to pay", isCorrect: false },
      { text: "Share your UPI PIN to clear bill", isCorrect: false }
    ],
    explanation: "Electricity companies send official bill numbers, never personal mobile numbers for urgent payments."
  },
  {
    id: 3,
    situation: "A buyer on OLX says he sent you money via UPI. He asks you to scan a QR code or enter your UPI PIN to RECEIVE the payment.",
    options: [
      { text: "Enter UPI PIN to receive money", isCorrect: false },
      { text: "Scan the QR code on WhatsApp", isCorrect: false },
      { text: "Refuse. UPI PIN is only for SENDING money, never for receiving", isCorrect: true },
      { text: "Share your OTP with buyer", isCorrect: false }
    ],
    explanation: "Entering a UPI PIN or scanning a QR code ALWAYS deducts money from your account."
  }
];

export const PracticeModeView: React.FC<PracticeModeViewProps> = ({ lang }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [score, setScore] = useState(0);

  const scenario = SCENARIOS[currentIndex];

  const handleSelectOption = (idx: number) => {
    if (selectedOption !== null) return;
    setSelectedOption(idx);
    if (scenario.options[idx].isCorrect) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNext = () => {
    setSelectedOption(null);
    if (currentIndex < SCENARIOS.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setScore(0);
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white flex items-center justify-center gap-2">
          <HelpCircle className="w-7 h-7 text-teal-700 dark:text-teal-400" />
          <span>Spot the Scam - Practice Game</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
          Learn how to spot digital scam tricks before encountering them in real life.
        </p>
      </div>

      {currentIndex < SCENARIOS.length ? (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xl space-y-5">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500">
            <span>Scenario {currentIndex + 1} of {SCENARIOS.length}</span>
            <span>Score: {score}/{currentIndex}</span>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 space-y-1">
            <h3 className="text-xs font-bold text-amber-900 dark:text-amber-300 uppercase tracking-wider">
              Situation / Received Message:
            </h3>
            <p className="text-sm sm:text-base font-semibold text-slate-900 dark:text-white">
              &quot;{scenario.situation}&quot;
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">What would you do?</h4>
            <div className="space-y-2">
              {scenario.options.map((opt, idx) => {
                let borderStyle = "border-slate-200 dark:border-slate-800 hover:border-teal-500";
                if (selectedOption !== null) {
                  if (opt.isCorrect) borderStyle = "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-900 dark:text-emerald-200 font-bold";
                  else if (selectedOption === idx) borderStyle = "border-rose-500 bg-rose-50 dark:bg-rose-950/50 text-rose-900 dark:text-rose-200 font-bold";
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectOption(idx)}
                    className={`w-full p-4 rounded-2xl border text-left text-xs sm:text-sm font-semibold transition-all flex items-center justify-between gap-3 ${borderStyle}`}
                  >
                    <span>{opt.text}</span>
                    {selectedOption !== null && opt.isCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />}
                    {selectedOption !== null && selectedOption === idx && !opt.isCorrect && <XCircle className="w-5 h-5 text-rose-600 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>

          {selectedOption !== null && (
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-3">
              <p className="text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300">
                💡 <b>Explanation:</b> {scenario.explanation}
              </p>

              {currentIndex < SCENARIOS.length - 1 ? (
                <button
                  onClick={handleNext}
                  className="w-full py-3 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md"
                >
                  <span>Next Question</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={() => setCurrentIndex(SCENARIOS.length)}
                  className="w-full py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md"
                >
                  <span>See Final Score</span>
                  <Award className="w-4 h-4" />
                </button>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-xl text-center space-y-4">
          <Award className="w-16 h-16 text-amber-500 mx-auto animate-bounce" />
          <h3 className="text-2xl font-black text-slate-900 dark:text-white">
            Practice Completed!
          </h3>
          <p className="text-lg font-bold text-teal-700 dark:text-teal-400">
            You scored {score} out of {SCENARIOS.length}
          </p>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Great job! Sharing these simple rules with your family members helps keep everyone safe against digital scammers.
          </p>
          <button
            onClick={handleRestart}
            className="py-3 px-6 rounded-2xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-sm inline-flex items-center gap-2 shadow-md"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Try Again</span>
          </button>
        </div>
      )}
    </div>
  );
};
