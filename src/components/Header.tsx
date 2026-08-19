import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { TheFixPointLogo } from './TheFixPointLogo';
import { Phone, MessageCircle, MapPin, Globe, Sparkles, X } from 'lucide-react';

interface HeaderProps {
  onNavigateHome: () => void;
  onOpenQuickRequest?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onNavigateHome }) => {
  const { lang, setLang, t, isRtl } = useLanguage();
  const [showContactModal, setShowContactModal] = useState(false);

  return (
    <>
      <header
        id="app-main-header"
        className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-3.5 py-2.5 shadow-xs transition-all"
      >
        <div className="max-w-md mx-auto flex items-center justify-between gap-2">
          {/* Logo & City Brand */}
          <button
            id="header-logo-button"
            onClick={onNavigateHome}
            className="flex items-center text-start gap-2 hover:opacity-90 active:scale-98 transition-transform"
          >
            <TheFixPointLogo variant="compact" size="md" />
            <div className="hidden xs:flex flex-col items-start border-s border-slate-200 ps-2 ms-0.5">
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded-md">
                <MapPin className="w-2.5 h-2.5 text-blue-600 shrink-0" />
                {isRtl ? 'وهران' : 'Oran'}
              </span>
            </div>
          </button>

          {/* Right Actions: Lang Switcher + Fast Direct Contact */}
          <div className="flex items-center gap-1.5">
            {/* Language Switcher Pill */}
            <div
              id="lang-switcher-toggle"
              className="inline-flex items-center p-0.5 bg-slate-100 rounded-full border border-slate-200/90 text-xs font-bold"
            >
              <button
                id="btn-lang-ar"
                onClick={() => setLang('ar')}
                className={`px-2 py-1 rounded-full transition-all duration-200 ${
                  lang === 'ar'
                    ? 'bg-blue-600 text-white shadow-xs font-black'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                عربي
              </button>
              <button
                id="btn-lang-fr"
                onClick={() => setLang('fr')}
                className={`px-2 py-1 rounded-full transition-all duration-200 ${
                  lang === 'fr'
                    ? 'bg-blue-600 text-white shadow-xs font-black'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                FR
              </button>
            </div>

            {/* Quick Contact Action */}
            <button
              id="btn-quick-contact"
              onClick={() => setShowContactModal(true)}
              className="w-8.5 h-8.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 flex items-center justify-center hover:bg-blue-100 active:scale-95 transition-all"
              title="اتصل بالتقني / Contacter"
            >
              <Phone className="w-4 h-4 text-blue-700" />
            </button>
          </div>
        </div>
      </header>

      {/* Quick Direct Contact Modal */}
      {showContactModal && (
        <div
          id="contact-technician-modal"
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
        >
          <div className="bg-white w-full max-w-sm rounded-3xl p-5 shadow-2xl border border-slate-100 relative">
            <button
              id="close-contact-modal"
              onClick={() => setShowContactModal(false)}
              className="absolute top-4 end-4 w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20">
                <TheFixPointLogo variant="mark-only" size="sm" theme="blue-bg" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">THE FIX POINT ORAN</h3>
                <p className="text-xs text-slate-500">{t('singleTechBadge')}</p>
              </div>
            </div>

            <div className="bg-blue-50/70 border border-blue-100 rounded-2xl p-3.5 mb-4 text-xs text-blue-900 leading-relaxed">
              <div className="font-semibold mb-1 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                {isRtl ? 'خدمة سريعة في وهران' : 'Service rapide à Oran'}
              </div>
              <p>{t('travelFeeNotice')}</p>
              <p className="mt-1 text-slate-600 font-medium">{t('noOnlinePayNotice')}</p>
            </div>

            <div className="space-y-2.5">
              <a
                id="direct-call-link"
                href="tel:0549994001"
                className="w-full py-3 px-4 rounded-xl bg-blue-600 text-white font-bold text-sm flex items-center justify-center gap-2 hover:bg-blue-700 active:scale-98 shadow-sm transition-all"
              >
                <Phone className="w-4 h-4" />
                <span>{t('btnCallDirect')} (0549 99 40 01)</span>
              </a>

              <a
                id="whatsapp-chat-link"
                href="https://wa.me/213549994001?text=Bonjour%20The%20Fix%20Point%20Oran,%20j'aimerais%20une%20r%C3%A9paration%20de%20t%C3%A9l%C3%A9phone"
                target="_blank"
                rel="noreferrer"
                className="w-full py-3 px-4 rounded-xl bg-emerald-600 text-white font-bold text-sm flex items-center justify-center gap-2 hover:bg-emerald-700 active:scale-98 shadow-sm transition-all"
              >
                <MessageCircle className="w-4 h-4" />
                <span>{t('btnWhatsAppContact')}</span>
              </a>
            </div>

            <p className="text-[11px] text-slate-400 text-center mt-3.5">
              {isRtl ? 'المقر: شارع فلسطين، وهران' : 'Atelier : Rue de Palestine, Oran'}
            </p>
          </div>
        </div>
      )}
    </>
  );
};
