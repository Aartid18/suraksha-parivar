'use client';

import React, { useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { Language } from '../lib/i18n';

interface ReadAloudProps {
  textToRead: string;
  lang: Language;
  buttonLabel?: string;
}

export const ReadAloudButton: React.FC<ReadAloudProps> = ({ textToRead, lang, buttonLabel = "Read Aloud (Voice)" }) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const handleSpeak = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      alert("Speech synthesis is not supported in this browser.");
      return;
    }

    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      return;
    }

    window.speechSynthesis.cancel(); // Stop any ongoing speech
    const utterance = new SpeechSynthesisUtterance(textToRead);

    if (lang === 'hi') {
      utterance.lang = 'hi-IN';
    } else if (lang === 'mr') {
      utterance.lang = 'mr-IN';
    } else {
      utterance.lang = 'en-IN';
    }

    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);

    setIsPlaying(true);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <button
      onClick={handleSpeak}
      className={`px-4 py-2.5 rounded-xl border text-sm font-semibold flex items-center gap-2 transition-colors ${
        isPlaying
          ? 'bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-950 dark:text-amber-300'
          : 'bg-teal-50 text-teal-800 border-teal-200 hover:bg-teal-100 dark:bg-slate-800 dark:text-teal-300 dark:border-slate-700'
      }`}
    >
      {isPlaying ? (
        <>
          <VolumeX className="w-4 h-4 text-amber-600 animate-pulse" />
          <span>Stop Voice</span>
        </>
      ) : (
        <>
          <Volume2 className="w-4 h-4 text-teal-700 dark:text-teal-400" />
          <span>{buttonLabel}</span>
        </>
      )}
    </button>
  );
};
