import React, { useState, useEffect } from 'react';
import { CourierUser } from '../../types';
import { CourierService } from '../../services/courierService';
import { 
  Truck, ShieldCheck, Lock, Phone, User, KeyRound, 
  X, CheckCircle2, AlertCircle, ArrowLeft, ArrowRight
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface CourierAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (courier: CourierUser) => void;
  onLoginSuccess?: (courier: CourierUser) => void;
}

export const CourierAuthModal: React.FC<CourierAuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  onLoginSuccess,
}) => {
  const { isRtl } = useLanguage();
  const [couriers, setCouriers] = useState<CourierUser[]>([]);
  const [selectedCourierId, setSelectedCourierId] = useState<string>('courier-1');
  const [phoneInput, setPhoneInput] = useState<string>('0555 44 33 22');
  const [pinInput, setPinInput] = useState<string>('1111');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      const all = CourierService.getAllCouriers();
      setCouriers(all);
      const activeFirst = all.find((c) => c.isActive) || all[0];
      if (activeFirst) {
        setSelectedCourierId(activeFirst.id);
        setPhoneInput(activeFirst.phoneNumber);
        setPinInput(activeFirst.pin);
      }
      setErrorMsg(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSelectCourier = (c: CourierUser) => {
    setSelectedCourierId(c.id);
    setPhoneInput(c.phoneNumber);
    setPinInput(c.pin);
    setErrorMsg(null);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg(null);

    setTimeout(() => {
      const courier = CourierService.loginCourier(phoneInput, pinInput);
      if (courier) {
        const callback = onSuccess || onLoginSuccess;
        if (callback) {
          callback(courier);
        }
      } else {
        setErrorMsg('رقم الهاتف أو رمز PIN غير صحيح، أو الحساب غير مفعل.');
      }
      setIsLoading(false);
    }, 300);
  };

  return (
    <div
      id="courier-auth-modal"
      className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-150"
    >
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 p-5 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 end-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 flex items-center justify-center cursor-pointer transition-all"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-2xl bg-amber-500 flex items-center justify-center text-slate-950 shadow-lg shadow-amber-500/20 font-black">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1 bg-amber-500/20 text-amber-300 text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-amber-400/30 mb-0.5">
                <ShieldCheck className="w-3 h-3" />
                <span>بوابة خاصة بعمال التوصيل</span>
              </div>
              <h2 className="text-lg font-black text-white">تسجيل دخول عامل التوصيل</h2>
            </div>
          </div>
          <p className="text-xs text-slate-300">
            يرجى إدخال رقم الهاتف المسجل مع رمز PIN للوصول إلى مهام الاستلام والتسليم الخاصة بك.
          </p>
        </div>

        {/* Quick Courier Demo Selector */}
        <div className="p-4 bg-slate-50 border-b border-slate-200">
          <label className="block text-[11px] font-extrabold text-slate-600 mb-2">
            اختر حساب عامل توصيل (للتجربة السريعة):
          </label>
          <div className="grid grid-cols-3 gap-2">
            {couriers.map((c) => {
              const isSelected = selectedCourierId === c.id;
              return (
                <button
                  type="button"
                  key={c.id}
                  onClick={() => handleSelectCourier(c)}
                  className={`p-2 rounded-2xl border text-center transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-blue-600 text-white border-blue-700 shadow-sm font-bold scale-[1.02]'
                      : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="w-6 h-6 rounded-full mx-auto mb-1 flex items-center justify-center text-xs font-black bg-white/20">
                    <User className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-[11px] block truncate font-extrabold">{c.name.split(' ')[0]}</span>
                  <span className={`text-[9px] block font-mono ${isSelected ? 'text-blue-100' : 'text-slate-400'}`}>
                    PIN: {c.pin}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="p-5 space-y-4">
          {errorMsg && (
            <div className="bg-rose-50 border border-rose-200 text-rose-800 p-3 rounded-2xl text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="space-y-1">
            <label className="block text-xs font-extrabold text-slate-800 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-blue-600" />
              <span>رقم هاتف عامل التوصيل</span>
            </label>
            <input
              type="text"
              required
              value={phoneInput}
              onChange={(e) => setPhoneInput(e.target.value)}
              placeholder="0555 44 33 22"
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white font-mono"
              dir="ltr"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-extrabold text-slate-800 flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5 text-blue-600" />
              <span>رمز المرور الشخصي (PIN)</span>
            </label>
            <input
              type="password"
              maxLength={6}
              required
              value={pinInput}
              onChange={(e) => setPinInput(e.target.value)}
              placeholder="••••"
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-2.5 text-sm tracking-widest text-center text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white font-mono"
              dir="ltr"
            />
          </div>

          <div className="bg-blue-50/60 border border-blue-200/80 rounded-2xl p-3 text-[11px] text-blue-900 flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <p>
              حساب عامل التوصيل مخصص فقط لمتابعة وتنفيذ مهام الاستلام والتسليم الخاصة بك بدون إمكانية الوصول للوحة التحكم الرئيسية أو الأسعار.
            </p>
          </div>

          <div className="pt-2 flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-4 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer transition-all"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-2 py-3 px-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-600/25 active:scale-98 transition-all cursor-pointer disabled:opacity-50"
            >
              <Truck className="w-4 h-4" />
              <span>{isLoading ? 'جاري التحقق...' : 'دخول إلى بوابة التوصيل'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
