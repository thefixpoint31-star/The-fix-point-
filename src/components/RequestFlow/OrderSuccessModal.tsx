import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { RepairRequest } from '../../types';
import { TheFixPointLogo } from '../TheFixPointLogo';
import { 
  CheckCircle2, Copy, Check, Phone, MessageCircle, 
  Clock, ArrowRight, ArrowLeft, Home, Sparkles 
} from 'lucide-react';

interface OrderSuccessModalProps {
  request: RepairRequest;
  onTrackOrder: (requestId: string) => void;
  onGoHome: () => void;
}

export const OrderSuccessModal: React.FC<OrderSuccessModalProps> = ({
  request,
  onTrackOrder,
  onGoHome,
}) => {
  const { lang, t, isRtl } = useLanguage();
  const [copied, setCopied] = useState(false);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(request.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  return (
    <div
      id="order-success-screen"
      className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in zoom-in-95 duration-200"
    >
      <div className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl border border-slate-100 text-center space-y-4">
        {/* Animated Checkmark Badge */}
        <div className="w-18 h-18 mx-auto rounded-full bg-emerald-50 text-emerald-600 border-4 border-emerald-100 flex items-center justify-center shadow-lg shadow-emerald-500/20">
          <CheckCircle2 className="w-10 h-10 animate-bounce" />
        </div>

        <div>
          <h2 className="text-xl font-black text-slate-900">
            {t('successTitle')}
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            {t('appName')} - {isRtl ? 'وهران' : 'Oran'}
          </p>
        </div>

        {/* Request Number Box */}
        <div className="bg-blue-50 border border-blue-200/80 rounded-2xl p-3.5 space-y-1">
          <span className="text-[11px] font-bold text-blue-700 block">
            {t('orderNumberIs')}
          </span>
          <div className="flex items-center justify-center gap-2">
            <span
              id="generated-request-id"
              className="text-2xl font-black font-mono tracking-wider text-blue-900"
            >
              {request.id}
            </span>
            <button
              onClick={handleCopyCode}
              className="p-1.5 rounded-lg bg-white text-blue-700 hover:bg-blue-100 border border-blue-200 transition-colors"
              title="Copy ID"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
          {copied && (
            <span className="text-[10px] font-bold text-emerald-600">
              {lang === 'ar' ? 'تم نسخ رقم الطلب' : 'Numéro copié !'}
            </span>
          )}
        </div>

        {/* Promise Box */}
        <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-100 text-start text-xs space-y-1">
          <p className="font-extrabold text-slate-900 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span>{t('contactPromise')}</span>
          </p>
          <p className="text-slate-600 text-[11px] leading-relaxed">
            {t('contactPromiseDesc')}
          </p>
          <p className="text-[11px] font-semibold text-blue-700 pt-1">
            {t('noOnlinePayNotice')}
          </p>
        </div>

        {/* Quick Contact Action Pills */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <a
            href="tel:0549994001"
            className="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center justify-center gap-1.5 transition-all"
          >
            <Phone className="w-3.5 h-3.5 text-blue-600" />
            <span>{lang === 'ar' ? 'اتصل الآن' : 'Appeler'}</span>
          </a>

          <a
            href={`https://wa.me/213549994001?text=Bonjour,%20je%20viens%20d'envoyer%20la%20demande%20${request.id}%20pour%20mon%20${request.brand}%20${request.model}`}
            target="_blank"
            rel="noreferrer"
            className="py-2.5 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center gap-1.5 transition-all"
          >
            <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
            <span>WhatsApp</span>
          </a>
        </div>

        {/* Primary Action Buttons */}
        <div className="space-y-2 pt-2">
          <button
            id="btn-track-submitted-order"
            onClick={() => onTrackOrder(request.id)}
            className="w-full py-3.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-98 text-white font-extrabold text-sm shadow-md shadow-blue-600/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Clock className="w-4 h-4" />
            <span>{t('btnTrackOrder')}</span>
            <ArrowIcon className="w-4 h-4" />
          </button>

          <button
            id="btn-back-home-after-order"
            onClick={onGoHome}
            className="w-full py-2.5 px-4 rounded-xl bg-transparent hover:bg-slate-100 text-slate-600 font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
          >
            <Home className="w-4 h-4" />
            <span>{t('btnHome')}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
