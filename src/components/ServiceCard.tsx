import React from 'react';
import { ServiceType } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { Wrench, Package, ArrowRight, ArrowLeft, ShieldCheck, Sparkles, MapPin, Truck } from 'lucide-react';

interface ServiceCardProps {
  type: ServiceType;
  isSelected?: boolean;
  onSelect: (type: ServiceType) => void;
  compact?: boolean;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({
  type,
  isSelected = false,
  onSelect,
  compact = false,
}) => {
  const { lang, isRtl } = useLanguage();
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  if (type === 'at_home') {
    return (
      <div
        id="service-card-at-home"
        onClick={() => onSelect('at_home')}
        className={`group relative rounded-2xl p-4 sm:p-5 transition-all duration-200 cursor-pointer border ${
          isSelected
            ? 'bg-blue-50/70 border-blue-600 ring-2 ring-blue-600/20 shadow-md'
            : 'bg-white border-slate-200/90 hover:border-blue-300 hover:shadow-md'
        }`}
      >
        <div className="flex items-start justify-between gap-3">
          {/* Service Icon Illustration */}
          <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-blue-500/25">
            <svg viewBox="0 0 48 48" fill="none" className="w-7 h-7">
              <path d="M10 38V18L24 8L38 18V38C38 39.1 37.1 40 36 40H12C10.9 40 10 39.1 10 38Z" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="#1E40AF" />
              {/* Smartphone & Wrench inside home */}
              <rect x="20" y="20" width="8" height="14" rx="2" fill="white" />
              <circle cx="24" cy="31" r="1" fill="#0D6EFD" />
              <path d="M16 28L19 31L32 18" stroke="#38BDF8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>

          {/* Badge */}
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-blue-100/90 text-blue-800">
            <Sparkles className="w-3 h-3 text-blue-600" />
            {lang === 'ar' ? 'تصليح فوري' : 'Sur place'}
          </span>
        </div>

        <div className="mt-3">
          <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
            {lang === 'ar' ? 'تصليح عندك في مكانك' : 'Réparation à domicile'}
          </h3>
          <p className="text-xs text-slate-600 mt-1 leading-relaxed">
            {lang === 'ar'
              ? 'نأتي إليك ونصلح هاتفك في مكانك'
              : 'Nous venons chez vous et réparons votre téléphone'}
          </p>
        </div>

        <div className="mt-3.5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
          <span className="text-slate-500 flex items-center gap-1 font-medium">
            <MapPin className="w-3.5 h-3.5 text-blue-600" />
            {lang === 'ar' ? 'كل أحياء وهران' : 'Tout Oran'}
          </span>
          <span className="font-bold text-blue-600 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
            <span>{lang === 'ar' ? 'طلب الخدمة' : 'Choisir'}</span>
            <ArrowIcon className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>
    );
  }

  if (type === 'parts_delivery') {
    return (
      <div
        id="service-card-parts-delivery"
        onClick={() => onSelect('parts_delivery')}
        className={`group relative rounded-2xl p-4 sm:p-5 transition-all duration-200 cursor-pointer border ${
          isSelected
            ? 'bg-blue-50/70 border-blue-600 ring-2 ring-blue-600/20 shadow-md'
            : 'bg-white border-slate-200/90 hover:border-blue-300 hover:shadow-md'
        }`}
      >
        <div className="flex items-start justify-between gap-3">
          {/* Parts Delivery Icon */}
          <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center shrink-0 shadow-md shadow-slate-900/20">
            <svg viewBox="0 0 48 48" fill="none" className="w-7 h-7">
              <path d="M24 6L40 15V33L24 42L8 33V15L24 6Z" stroke="white" strokeWidth="2.5" strokeLinejoin="round" fill="#1E293B" />
              <path d="M8 15L24 24L40 15" stroke="white" strokeWidth="2.5" strokeLinejoin="round" />
              <path d="M24 24V42" stroke="white" strokeWidth="2.5" />
              {/* Electronic Chip component inside */}
              <circle cx="24" cy="24" r="3" fill="#38BDF8" />
              <rect x="20" y="30" width="8" height="6" rx="1" fill="#0D6EFD" />
            </svg>
          </div>

          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-800">
            <Package className="w-3 h-3 text-slate-700" />
            {lang === 'ar' ? 'قطع غيار أصلية' : 'Pièces certifiées'}
          </span>
        </div>

        <div className="mt-3">
          <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
            {lang === 'ar' ? 'توصيل القطع إليك' : 'Livraison de pièces'}
          </h3>
          <p className="text-xs text-slate-600 mt-1 leading-relaxed">
            {lang === 'ar'
              ? 'نوصل لك القطعة التي تحتاجها'
              : 'Nous livrons la pièce dont vous avez besoin'}
          </p>
        </div>

        <div className="mt-3.5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
          <span className="text-slate-500 flex items-center gap-1 font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            {lang === 'ar' ? 'ضمان تجربة القطعة' : 'Pièce garantie'}
          </span>
          <span className="font-bold text-blue-600 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
            <span>{lang === 'ar' ? 'طلب القطعة' : 'Choisir'}</span>
            <ArrowIcon className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>
    );
  }

  // CARD 3: استلام الهاتف وإرجاعه / Collecte et retour (EXTREMELY IMPORTANT & PROMINENT)
  return (
    <div
      id="service-card-pickup-return"
      onClick={() => onSelect('pickup_return')}
      className={`group relative rounded-2xl p-4 sm:p-5.5 transition-all duration-200 cursor-pointer border ${
        isSelected
          ? 'bg-blue-50/80 border-blue-600 ring-2 ring-blue-600/30 shadow-lg'
          : 'bg-linear-to-br from-white via-blue-50/20 to-slate-50 border-blue-200/90 hover:border-blue-500 hover:shadow-lg shadow-sm'
      }`}
    >
      {/* Prominent Label Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          {/* Custom Delivery Worker Handing Phone Package Illustration */}
          <div className="w-13 h-13 rounded-2xl bg-linear-to-tr from-blue-700 to-sky-500 text-white flex items-center justify-center shrink-0 shadow-lg shadow-blue-600/30 ring-2 ring-white">
            <svg viewBox="0 0 64 64" fill="none" className="w-8 h-8">
              {/* Delivery Courier with Cap & Bag handing protected phone box */}
              {/* Courier Head / Cap */}
              <circle cx="26" cy="18" r="6" fill="#FFFFFF" />
              <path d="M20 18C20 14.7 22.7 12 26 12C29.3 12 32 14.7 32 18H36L35 15H20L20 18Z" fill="#0F172A" />
              
              {/* Courier Body */}
              <path d="M16 38C16 31 20 27 26 27C32 27 36 31 36 38V42H16V38Z" fill="#1E40AF" />
              
              {/* Courier Arm reaching forward holding sealed phone box */}
              <path d="M30 33L42 33L44 38" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
              
              {/* Secured Phone Package Box with Fix Point Blue seal */}
              <rect x="36" y="24" width="22" height="15" rx="3" fill="#FFFFFF" stroke="#0F172A" strokeWidth="1.5" />
              <rect x="42" y="27" width="10" height="9" rx="1.5" fill="#0D6EFD" />
              <line x1="47" y1="25" x2="47" y2="38" stroke="#F59E0B" strokeWidth="1.5" />
              <circle cx="47" cy="31" r="1.5" fill="#FFFFFF" />

              {/* Dynamic Return Arrows (Collect -> Workshop -> Return) */}
              <path d="M12 48C16 52 24 54 32 54C42 54 50 49 54 44" stroke="#0D6EFD" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="3 3" />
              <polygon points="56,44 50,43 54,49" fill="#0D6EFD" />
              <path d="M52 14C46 10 38 8 30 8" stroke="#38BDF8" strokeWidth="2" strokeLinecap="round" strokeDasharray="2 2" />
            </svg>
          </div>

          <div>
            <span className="inline-flex items-center gap-1 text-[11px] font-extrabold px-2.5 py-0.5 rounded-full bg-blue-600 text-white shadow-xs">
              <Truck className="w-3 h-3" />
              {lang === 'ar' ? 'الخدمة المميزة' : 'Service Signature'}
            </span>
          </div>
        </div>

        <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
          {lang === 'ar' ? 'استلام + إرجاع' : 'Collecte + Retour'}
        </span>
      </div>

      <div className="mt-3">
        <h3 className="text-base sm:text-lg font-black text-slate-900 leading-snug flex items-center gap-2">
          <span>{lang === 'ar' ? 'استلام الهاتف وإرجاعه' : 'Collecte et retour'}</span>
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
        </h3>
        <p className="text-xs font-medium text-slate-700 mt-1 leading-relaxed">
          {lang === 'ar'
            ? 'نرسل عاملًا لاستلام هاتفك، نصلحه في الورشة ثم نعيده إليك'
            : 'Nous envoyons un livreur récupérer votre téléphone, nous le réparons à l\'atelier puis nous vous le retournons'}
        </p>
      </div>

      {/* 3-Step Process Micro-bar */}
      <div className="mt-3 bg-white/90 border border-blue-100 rounded-xl p-2.5 grid grid-cols-3 gap-1 text-center text-[10px] font-semibold text-slate-700">
        <div className="flex flex-col items-center">
          <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-800 font-bold flex items-center justify-center mb-1">1</span>
          <span>{lang === 'ar' ? 'استلام من عندك' : 'Collecte'}</span>
        </div>
        <div className="flex flex-col items-center border-x border-slate-100">
          <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-800 font-bold flex items-center justify-center mb-1">2</span>
          <span>{lang === 'ar' ? 'تصليح بالورشة' : 'Atelier'}</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center mb-1">3</span>
          <span>{lang === 'ar' ? 'إرجاع وتجربة' : 'Retour'}</span>
        </div>
      </div>

      <div className="mt-3.5 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
        <span className="text-slate-500 font-medium">
          {lang === 'ar' ? 'التنقل ابتداءً من 2000 دج' : 'Déplacement dès 2000 DA'}
        </span>
        <span className="font-extrabold text-blue-700 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
          <span>{lang === 'ar' ? 'اطلب استلام الهاتف' : 'Demander la collecte'}</span>
          <ArrowIcon className="w-3.5 h-3.5" />
        </span>
      </div>
    </div>
  );
};
