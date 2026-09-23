'use client';

import React from 'react';
import { Shield, Volume2, Moon, Sun, Type } from 'lucide-react';
import { Language, i18nDict } from '../lib/i18n';

interface HeaderProps {
  lang: Language;
  setLang: (l: Language) => void;
  fontScale: 'sm' | 'md' | 'lg' | 'xl';
  setFontScale: (scale: 'sm' | 'md' | 'lg' | 'xl') => void;
  darkMode: boolean;
  setDarkMode: (dm: boolean) => void;
  activeTab: 'check' | 'family' | 'panic' | 'library' | 'settings';
  setActiveTab: (tab: 'check' | 'family' | 'panic' | 'library' | 'settings') => void;
}

export const Header: React.FC<HeaderProps> = ({
  lang,
  setLang,
  fontScale,
  setFontScale,
  darkMode,
  setDarkMode,
  activeTab,
  setActiveTab,
}) => {
  const t = i18nDict[lang];

  const cycleFontScale = () => {
    const scales: ('sm' | 'md' | 'lg' | 'xl')[] = ['sm', 'md', 'lg', 'xl'];
    const idx = scales.indexOf(fontScale);
    setFontScale(scales[(idx + 1) % scales.length]);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
      <div className="max-w-6xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-3">
        {/* Brand & Title */}
        <div 
          onClick={() => setActiveTab('check')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-2xl bg-teal-700 dark:bg-teal-600 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
              {t.app_title}
            </h1>
            <p className="text-xs text-teal-700 dark:text-teal-400 font-medium">
              {t.app_tagline}
            </p>
          </div>
        </div>

        {/* Global Controls: Language, Text Size, Dark Mode */}
        <div className="flex items-center gap-2">
          {/* Language Switcher */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold">
            <button
              onClick={() => setLang('en')}
              className={`px-2.5 py-1.5 rounded-lg transition-all ${
                lang === 'en'
                  ? 'bg-teal-700 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
              }`}
            >
              English
            </button>
            <button
              onClick={() => setLang('hi')}
              className={`px-2.5 py-1.5 rounded-lg transition-all ${
                lang === 'hi'
                  ? 'bg-teal-700 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
              }`}
            >
              हिंदी
            </button>
            <button
              onClick={() => setLang('mr')}
              className={`px-2.5 py-1.5 rounded-lg transition-all ${
                lang === 'mr'
                  ? 'bg-teal-700 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
              }`}
            >
              मराठी
            </button>
          </div>

          {/* Text Scale Button */}
          <button
            onClick={cycleFontScale}
            title="Adjust text size (A- / A+)"
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors flex items-center gap-1 text-xs font-semibold"
          >
            <Type className="w-4 h-4" />
            <span className="uppercase">{fontScale}</span>
          </button>

          {/* Dark Mode Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            title="Toggle Dark/Light Mode"
            className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
          </button>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <nav className="border-t border-slate-100 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-900/50">
        <div className="max-w-6xl mx-auto px-4 flex items-center justify-around overflow-x-auto text-xs sm:text-sm font-semibold">
          <button
            onClick={() => setActiveTab('check')}
            className={`py-2.5 px-3 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'check'
                ? 'border-teal-700 text-teal-700 dark:border-teal-400 dark:text-teal-400 font-bold'
                : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            {t.nav_check}
          </button>
          <button
            onClick={() => setActiveTab('family')}
            className={`py-2.5 px-3 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'family'
                ? 'border-teal-700 text-teal-700 dark:border-teal-400 dark:text-teal-400 font-bold'
                : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            {t.nav_family}
          </button>
          <button
            onClick={() => setActiveTab('panic')}
            className={`py-2.5 px-3 border-b-2 transition-colors whitespace-nowrap text-rose-600 dark:text-rose-400 ${
              activeTab === 'panic'
                ? 'border-rose-600 dark:border-rose-400 font-bold bg-rose-50 dark:bg-rose-950/30'
                : 'border-transparent hover:text-rose-700'
            }`}
          >
            🚨 {t.nav_panic}
          </button>
          <button
            onClick={() => setActiveTab('library')}
            className={`py-2.5 px-3 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'library'
                ? 'border-teal-700 text-teal-700 dark:border-teal-400 dark:text-teal-400 font-bold'
                : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            {t.nav_library}
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`py-2.5 px-3 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'settings'
                ? 'border-teal-700 text-teal-700 dark:border-teal-400 dark:text-teal-400 font-bold'
                : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            {t.nav_settings}
          </button>
        </div>
      </nav>
    </header>
  );
};
