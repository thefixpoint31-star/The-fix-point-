import React from 'react';
import { ServiceType, ScreenTab } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { ServiceCard } from '../ServiceCard';
import { TheFixPointLogo } from '../TheFixPointLogo';
import { BRANDS, PROMOTIONAL_OFFERS } from '../../data/mockData';
import { 
  Wrench, ShieldCheck, MapPin, Sparkles, Phone, MessageCircle, 
  Clock, ArrowRight, ArrowLeft, CheckCircle2, Award, Zap, Truck 
} from 'lucide-react';

interface HomeScreenProps {
  onSelectService: (service: ServiceType) => void;
  onNavigateTab: (tab: ScreenTab) => void;
  onSelectBrandForRepair: (brandName: string) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onSelectService,
  onNavigateTab,
  onSelectBrandForRepair,
}) => {
  const { lang, t, isRtl } = useLanguage();
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  return (
    <div id="screen-home" className="space-y-5 pb-6 animate-in fade-in duration-200">
      {/* Hero Brand Banner */}
      <section
        id="hero-banner-section"
        className="relative overflow-hidden rounded-3xl bg-slate-900 text-white p-5 sm:p-6 shadow-xl"
      >
        {/* Subtle geometric pattern background */}
        <div className="absolute inset-0 bg-[radial-gradient(#1e40af_1px,transparent_1px)] [background-size:16px_16px] opacity-25"></div>
        <div className="absolute -top-12 -end-12 w-48 h-48 rounded-full bg-blue-600/30 blur-3xl pointer-events-none"></div>

        <div className="relative z-10 space-y-3.5">
          {/* Top Badge: Oran + Verified Tech */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-600/30 border border-blue-400/40 text-blue-200 text-xs font-bold backdrop-blur-xs">
              <MapPin className="w-3.5 h-3.5 text-sky-400" />
              <span>{isRtl ? 'وهران، الجزائر' : 'Oran, Algérie'}</span>
            </span>

            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2.5 py-0.5 rounded-full">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              {isRtl ? 'التقني متاح الآن' : 'Technicien dispo'}
            </span>
          </div>

          {/* Main Headline (Mandated Arabic & French) */}
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-white leading-tight tracking-tight">
              {lang === 'ar' ? 'إصلاح هاتفك، أينما كنت' : 'Réparez votre téléphone, où que vous soyez'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 font-medium leading-relaxed">
              {lang === 'ar'
                ? 'خدمة صيانة الهواتف الذكية وتوصيل قطع الغيار الأصلية في جميع أحياء وهران'
                : 'Service de réparation de smartphones et livraison de pièces d\'origine à Oran'}
            </p>
          </div>

          {/* Travel Fee Highlight Banner */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/15 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-blue-500 text-white flex items-center justify-center shrink-0">
                <Truck className="w-4 h-4" />
              </div>
              <div className="text-xs">
                <span className="text-slate-300 block text-[10px]">
                  {lang === 'ar' ? 'رسوم التنقل بوهران' : 'Frais de déplacement'}
                </span>
                <span className="font-extrabold text-sky-300 text-xs sm:text-sm font-mono">
                  {lang === 'ar' ? 'ابتداءً من 2000 دج' : 'À partir de 2000 DA'}
                </span>
              </div>
            </div>

            <button
              id="hero-request-cta"
              onClick={() => onNavigateTab('request')}
              className="py-2 px-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 active:scale-95 text-white font-extrabold text-xs shadow-md shadow-blue-600/40 flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <span>{isRtl ? 'اطلب الآن' : 'Commander'}</span>
              <ArrowIcon className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* Main 3 Services Section (Core Requirement) */}
      <section id="main-services-section" className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-blue-600"></div>
            <h2 className="text-base sm:text-lg font-black text-slate-900">
              {t('servicesTitle')}
            </h2>
          </div>
          <span className="text-xs text-blue-600 font-bold">
            {lang === 'ar' ? '3 خدمات رئيسية' : '3 Services Pro'}
          </span>
        </div>

        {/* 3 Main Cards */}
        <div className="space-y-3">
          {/* Card 1: Réparation à domicile */}
          <ServiceCard
            type="at_home"
            onSelect={(s) => onSelectService(s)}
          />

          {/* Card 2: Livraison de pièces */}
          <ServiceCard
            type="parts_delivery"
            onSelect={(s) => onSelectService(s)}
          />

          {/* Card 3: Collecte et retour (Prominent & Special Illustration) */}
          <ServiceCard
            type="pickup_return"
            onSelect={(s) => onSelectService(s)}
          />
        </div>
      </section>

      {/* Popular Device Brands Quick Repair Launcher */}
      <section id="brands-quick-select-section" className="space-y-2.5">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xs font-bold text-slate-800">
            {lang === 'ar' ? 'اختر نوع هاتفك للتصليح السريع:' : 'Sélectionnez votre marque pour réparer :'}
          </h3>
          <button
            onClick={() => onNavigateTab('prices')}
            className="text-[11px] font-bold text-blue-600 hover:underline flex items-center gap-0.5"
          >
            <span>{t('navPrices')}</span>
            <ArrowIcon className="w-3 h-3" />
          </button>
        </div>

        {/* Brand Scrollable Badges */}
        <div className="grid grid-cols-4 gap-2">
          {BRANDS.slice(0, 8).map((b) => (
            <button
              key={b.id}
              onClick={() => onSelectBrandForRepair(b.name)}
              className="py-2.5 px-2 bg-white hover:bg-blue-50 border border-slate-200/90 rounded-2xl flex flex-col items-center justify-center text-center shadow-2xs hover:border-blue-300 active:scale-95 transition-all cursor-pointer"
            >
              <span className="text-xs font-bold text-slate-800 truncate w-full">{b.name}</span>
              <span className="text-[9px] text-blue-600 font-semibold mt-0.5">
                {lang === 'ar' ? 'صيانة' : 'Réparer'}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* Technician & Single Tech Card Notice */}
      <section id="technician-info-card" className="bg-white rounded-3xl p-4.5 border border-slate-200/90 shadow-xs space-y-3">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white font-black text-lg flex items-center justify-center shadow-md shadow-blue-500/20">
              TP
            </div>
            <span className="absolute -bottom-1 -end-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white flex items-center justify-center text-white text-[8px]">
              ✓
            </span>
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-1.5">
              <h3 className="font-extrabold text-sm text-slate-900">
                {lang === 'ar' ? 'التقني أمين - The Fix Point' : 'Amine - Technicien The Fix Point'}
              </h3>
              <Award className="w-4 h-4 text-blue-600" />
            </div>
            <p className="text-[11px] text-slate-500 font-medium">
              {lang === 'ar' ? 'تقني متخصص ومعتمد لإصلاح جميع أنواع الهواتف بوهران' : 'Technicien certifié multi-marques dédié à Oran'}
            </p>
          </div>
        </div>

        <div className="bg-slate-50 rounded-2xl p-3 grid grid-cols-3 gap-2 text-center text-[10px]">
          <div>
            <span className="block font-black text-slate-900 text-xs">100%</span>
            <span className="text-slate-500">{lang === 'ar' ? 'قطع أصلية' : 'Pièces Origine'}</span>
          </div>
          <div className="border-x border-slate-200">
            <span className="block font-black text-blue-700 text-xs font-mono">3-6 {t('months')}</span>
            <span className="text-slate-500">{t('warrantyLabel')}</span>
          </div>
          <div>
            <span className="block font-black text-emerald-700 text-xs">C.O.D</span>
            <span className="text-slate-500">{lang === 'ar' ? 'الدفع بعد الفحص' : 'Paiement sur place'}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 pt-1">
          <a
            href="tel:0549994001"
            className="flex-1 py-2.5 px-3 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
          >
            <Phone className="w-3.5 h-3.5 text-blue-600" />
            <span>0549 99 40 01</span>
          </a>

          <a
            href="https://wa.me/213549994001?text=Bonjour%20The%20Fix%20Point%20Oran"
            target="_blank"
            rel="noreferrer"
            className="flex-1 py-2.5 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
          >
            <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
            <span>WhatsApp Oran</span>
          </a>
        </div>
      </section>

      {/* Promotional Offers Teaser */}
      {PROMOTIONAL_OFFERS.length > 0 && (
        <section id="offers-teaser-section" className="space-y-2.5">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>{t('offersTitle')}</span>
            </h3>
            <button
              onClick={() => onNavigateTab('offers')}
              className="text-[11px] font-bold text-blue-600 hover:underline flex items-center gap-0.5"
            >
              <span>{isRtl ? 'عرض الكل' : 'Voir tout'}</span>
              <ArrowIcon className="w-3 h-3" />
            </button>
          </div>

          <div
            onClick={() => onNavigateTab('offers')}
            className="rounded-2xl p-4 bg-linear-to-r from-blue-900 via-blue-800 to-indigo-900 text-white shadow-md cursor-pointer hover:shadow-lg transition-all space-y-2"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold bg-amber-400 text-slate-950 px-2 py-0.5 rounded-full">
                {lang === 'ar' ? PROMOTIONAL_OFFERS[0].tagAr : PROMOTIONAL_OFFERS[0].tagFr}
              </span>
              <span className="font-mono text-xs text-sky-200">
                CODE: <span className="font-bold text-white underline">{PROMOTIONAL_OFFERS[0].promoCode}</span>
              </span>
            </div>
            <h4 className="font-extrabold text-sm text-white">
              {lang === 'ar' ? PROMOTIONAL_OFFERS[0].titleAr : PROMOTIONAL_OFFERS[0].titleFr}
            </h4>
            <p className="text-[11px] text-blue-100 line-clamp-2">
              {lang === 'ar' ? PROMOTIONAL_OFFERS[0].descriptionAr : PROMOTIONAL_OFFERS[0].descriptionFr}
            </p>
          </div>
        </section>
      )}
    </div>
  );
};
