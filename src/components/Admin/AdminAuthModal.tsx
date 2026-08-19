import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { ShieldCheck, Lock, KeyRound, X, ArrowRight, ArrowLeft, AlertCircle } from 'lucide-react';

interface AdminAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AdminAuthModal: React.FC<AdminAuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { lang, isRtl } = useLanguage();
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Default admin PIN is 1234 or fixpoint
    if (pin === '1234' || pin.toLowerCase() === 'fixpoint' || pin === '0000') {
      setError(false);
      setPin('');
      onSuccess();
    } else {
      setError(true);
    }
  };

  const handleQuickDemoBypass = () => {
    setError(false);
    setPin('');
    onSuccess();
  };

  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  return (
    <div
      id="admin-auth-modal"
      className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200"
    >
      <div className="bg-white w-full max-w-xs rounded-3xl p-5 shadow-2xl border border-slate-200 text-center space-y-4 relative">
        <button
          onClick={onClose}
          className="absolute top-4 end-4 w-7 h-7 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="w-14 h-14 mx-auto rounded-2xl bg-blue-50 text-blue-600 border border-blue-200 flex items-center justify-center shadow-md">
          <ShieldCheck className="w-7 h-7" />
        </div>

        <div>
          <h3 className="text-base font-black text-slate-900">
            {lang === 'ar' ? 'لوحة تحكم The Fix Point' : 'Accès Espace Admin'}
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            {lang === 'ar' ? 'مخصصة لإدارة ومتابعة طلبات وهران' : 'Réservé aux techniciens et administrateurs'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1 text-start">
              {lang === 'ar' ? 'رمز الدخول (PIN):' : 'Code PIN Admin :'}
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-slate-400 absolute top-2.5 start-3" />
              <input
                id="admin-pin-input"
                type="password"
                maxLength={8}
                value={pin}
                onChange={(e) => {
                  setPin(e.target.value);
                  setError(false);
                }}
                placeholder="1234"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl ps-9 pe-3 py-2 text-center text-sm font-mono tracking-widest text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white"
                autoFocus
              />
            </div>
            {error && (
              <p className="text-[11px] text-rose-600 font-bold mt-1 flex items-center justify-center gap-1">
                <AlertCircle className="w-3 h-3" />
                <span>{lang === 'ar' ? 'الرمز غير صحيح (الرمز الافتراضي 1234)' : 'Code erroné (Défaut: 1234)'}</span>
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-blue-600/20 active:scale-95 transition-all cursor-pointer"
          >
            <span>{lang === 'ar' ? 'دخول لوحة الإدارة' : 'Accéder'}</span>
            <ArrowIcon className="w-3.5 h-3.5" />
          </button>
        </form>

        <div className="pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={handleQuickDemoBypass}
            className="text-[11px] text-blue-600 hover:underline font-bold"
          >
            {lang === 'ar' ? '⚡ تجربة سريعة (رمز افتراضي 1234)' : '⚡ Accès démo rapide (1234)'}
          </button>
        </div>
      </div>
    </div>
  );
};
