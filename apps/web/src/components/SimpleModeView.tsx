'use client';

import React from 'react';
import { MessageSquare, DollarSign, PhoneCall, ExternalLink, Users, AlertOctagon, HeartHandshake } from 'lucide-react';
import { Language } from '../lib/i18n';

interface SimpleModeViewProps {
  lang: Language;
  onSelectAction: (action: string, presetText?: string) => void;
}

const ACTION_TILES = {
  en: {
    title: "What do you want to do?",
    subtitle: "Tap any large button below. We will guide you step by step.",
    actions: [
      { id: "check_message", label: "Check a Message", sub: "Verify SMS or WhatsApp message", icon: MessageSquare, bg: "bg-teal-700 hover:bg-teal-800 text-white" },
      { id: "sent_money", label: "I Sent Money", sub: "Freeze bank transaction now", icon: DollarSign, bg: "bg-rose-600 hover:bg-rose-700 text-white" },
      { id: "someone_called", label: "Someone Called Me", sub: "Police, CBI or Bank caller check", icon: PhoneCall, bg: "bg-amber-600 hover:bg-amber-700 text-white" },
      { id: "clicked_link", label: "I Clicked a Link", sub: "Check website or APK download", icon: ExternalLink, bg: "bg-indigo-700 hover:bg-indigo-800 text-white" },
      { id: "ask_family", label: "Ask My Family", sub: "Alert your family guardian", icon: Users, bg: "bg-emerald-700 hover:bg-emerald-800 text-white" },
      { id: "emergency", label: "Emergency Helpline 1930", sub: "Call Cyber Crime Police Hotline", icon: AlertOctagon, bg: "bg-red-700 hover:bg-red-800 text-white" }
    ]
  },
  hi: {
    title: "आप क्या करना चाहते हैं?",
    subtitle: "नीचे दिए गए बड़े बटन पर टैप करें। हम आपकी मदद करेंगे।",
    actions: [
      { id: "check_message", label: "मैसेज की जांच करें", sub: "व्हाट्सएप या एसएमएस जांचें", icon: MessageSquare, bg: "bg-teal-700 hover:bg-teal-800 text-white" },
      { id: "sent_money", label: "मैंने पैसे भेज दिए हैं", sub: "तुरंत बैंक ट्रांसफर ब्लॉक करें", icon: DollarSign, bg: "bg-rose-600 hover:bg-rose-700 text-white" },
      { id: "someone_called", label: "किसी का कॉल आया था", sub: "पुलिस या बैंक कॉल की जांच", icon: PhoneCall, bg: "bg-amber-600 hover:bg-amber-700 text-white" },
      { id: "clicked_link", label: "मैंने लिंक खोला है", sub: "वेबसाइट या ऐप डाउनलोड जांचें", icon: ExternalLink, bg: "bg-indigo-700 hover:bg-indigo-800 text-white" },
      { id: "ask_family", label: "परिवार से पूछें", sub: "अभिभावक को अलर्ट भेजें", icon: Users, bg: "bg-emerald-700 hover:bg-emerald-800 text-white" },
      { id: "emergency", label: "इमरजेंसी हेल्पलाइन 1930", sub: "साइबर पुलिस को कॉल करें", icon: AlertOctagon, bg: "bg-red-700 hover:bg-red-800 text-white" }
    ]
  },
  mr: {
    title: "तुम्हाला काय करायचे आहे?",
    subtitle: "खालील मोठ्या बटणावर दाबा. आम्ही तुम्हाला मदत करू.",
    actions: [
      { id: "check_message", label: "मेसेज तपासा", sub: "व्हॉट्सॲप किंवा मेसेज तपासा", icon: MessageSquare, bg: "bg-teal-700 hover:bg-teal-800 text-white" },
      { id: "sent_money", label: "मी पैसे दिले आहेत", sub: "बँक ट्रान्सफर लगेच ब्लॉक करा", icon: DollarSign, bg: "bg-rose-600 hover:bg-rose-700 text-white" },
      { id: "someone_called", label: "कोणाचातरी कॉल आला होता", sub: "पोलीस किंवा बँक कॉल तपासणी", icon: PhoneCall, bg: "bg-amber-600 hover:bg-amber-700 text-white" },
      { id: "clicked_link", label: "मी लिंक उघडली आहे", sub: "वेबसाईट किंवा ॲप फसवणूक तपासा", icon: ExternalLink, bg: "bg-indigo-700 hover:bg-indigo-800 text-white" },
      { id: "ask_family", label: "कुटुंबाला विचारा", sub: "पालकाला सावध मेसेज पाठवा", icon: Users, bg: "bg-emerald-700 hover:bg-emerald-800 text-white" },
      { id: "emergency", label: "इमर्जन्सी हेल्पलाइन १९३०", sub: "सायबर पोलिसांना कॉल करा", icon: AlertOctagon, bg: "bg-red-700 hover:bg-red-800 text-white" }
    ]
  }
};

export const SimpleModeView: React.FC<SimpleModeViewProps> = ({ lang, onSelectAction }) => {
  const content = ACTION_TILES[lang] || ACTION_TILES.en;

  const handleClick = (actionId: string) => {
    if (actionId === 'check_message') {
      onSelectAction('check');
    } else if (actionId === 'sent_money' || actionId === 'emergency') {
      onSelectAction('panic');
    } else if (actionId === 'someone_called') {
      onSelectAction('check', "Someone called claiming to be CBI / Police / Bank Officer demanding video call and money.");
    } else if (actionId === 'clicked_link') {
      onSelectAction('check', "Clicked an SMS link claiming bank account blocked update KYC immediately.");
    } else if (actionId === 'ask_family') {
      onSelectAction('family');
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Simple Mode Header */}
      <div className="text-center space-y-2 bg-gradient-to-r from-teal-50 to-emerald-50 dark:from-slate-900 dark:to-slate-800 p-6 rounded-3xl border border-teal-200 dark:border-slate-700 shadow-sm">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-700 text-white text-xs font-extrabold uppercase tracking-wider mb-1">
          <HeartHandshake className="w-4 h-4" />
          <span>Simple Mode (वृद्ध व सोपी पद्धत)</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
          {content.title}
        </h2>
        <p className="text-sm sm:text-base font-semibold text-slate-700 dark:text-slate-300 max-w-md mx-auto">
          {content.subtitle}
        </p>
      </div>

      {/* 6 Large Touch Targets Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {content.actions.map((tile) => {
          const IconComp = tile.icon;
          return (
            <button
              key={tile.id}
              onClick={() => handleClick(tile.id)}
              className={`p-6 sm:p-8 rounded-3xl shadow-xl flex items-center gap-5 transition-all hover:scale-[1.02] active:scale-[0.98] text-left border-2 border-black/10 dark:border-white/10 ${tile.bg}`}
            >
              <div className="p-4 rounded-2xl bg-white/20 backdrop-blur-md shrink-0">
                <IconComp className="w-9 h-9 text-current" />
              </div>
              <div>
                <h3 className="text-lg sm:text-2xl font-black tracking-tight">
                  {tile.label}
                </h3>
                <p className="text-xs sm:text-sm font-semibold opacity-90 mt-1">
                  {tile.sub}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
