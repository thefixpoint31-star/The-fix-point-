import React, { useState } from 'react';
import { ServiceType, ProblemOption } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { calculateRepairEstimate, BASE_TRAVEL_FEE } from '../../services/pricingService';
import { 
  CheckCircle2, ShieldCheck, MapPin, Calendar, Clock, 
  Smartphone, Wrench, ArrowLeft, ArrowRight, AlertCircle, 
  Info, Tag, Sparkles, AlertTriangle, Truck
} from 'lucide-react';

interface OrderSummaryProps {
  serviceType: ServiceType;
  brand: string;
  model: string;
  problem: ProblemOption | null;
  problemDescription: string;
  mediaFiles: string[];
  customerName: string;
  phoneNumber: string;
  commune: string;
  address: string;
  locationInstructions: string;
  preferredDate: string;
  preferredTime: string;
  notes: string;
  appliedPromoCode?: string;
  onConfirm: () => void;
  onBack: () => void;
  isSubmitting: boolean;
}

export const OrderSummary: React.FC<OrderSummaryProps> = ({
  serviceType,
  brand,
  model,
  problem,
  problemDescription,
  mediaFiles,
  customerName,
  phoneNumber,
  commune,
  address,
  locationInstructions,
  preferredDate,
  preferredTime,
  notes,
  appliedPromoCode,
  onConfirm,
  onBack,
  isSubmitting,
}) => {
  const { lang, t, isRtl } = useLanguage();
  const [promoInput, setPromoInput] = useState(appliedPromoCode || '');
  const [promoApplied, setPromoApplied] = useState(Boolean(appliedPromoCode));
  const [discountValue, setDiscountValue] = useState(appliedPromoCode ? 1000 : 0);

  // Calculate pricing using The Fix Point official pricing engine
  const problemId = problem?.id || 'screen';
  const estimate = calculateRepairEstimate(brand, model, problemId, BASE_TRAVEL_FEE);

  // Service Name helper
  const getServiceName = () => {
    switch (serviceType) {
      case 'at_home':
        return lang === 'ar' ? 'إصلاح الهاتف في مكان الزبون (Réparation à domicile)' : 'Réparation à domicile (إصلاح في مكان الزبون)';
      case 'parts_delivery':
        return lang === 'ar' ? 'توصيل قطع الغيار فقط (Livraison de pièces)' : 'Livraison de pièces (توصيل قطع الغيار)';
      case 'pickup_return':
        return lang === 'ar' ? 'استلام وإرجاع الهاتف (Collecte et retour)' : 'Collecte et retour (استلام وإرجاع)';
    }
  };

  const handleApplyPromo = () => {
    const code = promoInput.trim().toUpperCase();
    if (code === 'FIXORAN50' || code === 'BATTERY20' || code === 'VERRE9D') {
      setPromoApplied(true);
      setDiscountValue(1000);
    } else {
      setPromoApplied(false);
      setDiscountValue(0);
    }
  };

  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;
  const BackArrowIcon = isRtl ? ArrowRight : ArrowLeft;

  // Final total calculations
  const hasKnownPrice = estimate.isPriceKnown && estimate.estimatedTotal !== null;
  const calculatedTotalWithDiscount = hasKnownPrice
    ? Math.max(0, (estimate.estimatedTotal || 0) - discountValue)
    : null;

  return (
    <div id="step-order-summary" className="space-y-4 animate-in fade-in duration-200">
      {/* Title */}
      <div className="bg-blue-600 text-white rounded-2xl p-4 shadow-md shadow-blue-600/20">
        <div className="flex items-center gap-2 font-bold text-sm">
          <ShieldCheck className="w-5 h-5 text-sky-300" />
          <span>{t('summaryTitle')}</span>
        </div>
        <p className="text-xs text-blue-100 mt-1">
          {lang === 'ar'
            ? 'يرجى مراجعة تفاصيل الطلب وتسعيرة القطع الرسمية قبل التأكيد'
            : 'Veuillez vérifier les détails et le tarif officiel de la pièce avant confirmation'}
        </p>
      </div>

      {/* Main Details Card */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs space-y-3.5 divide-y divide-slate-100 text-xs">
        {/* Service Type Item */}
        <div className="flex items-start justify-between gap-2 pt-1">
          <span className="text-slate-500 font-semibold">{t('serviceLabel')}:</span>
          <span className="font-extrabold text-blue-900 text-end">{getServiceName()}</span>
        </div>

        {/* Device Item */}
        <div className="flex items-start justify-between gap-2 pt-2.5">
          <span className="text-slate-500 font-semibold flex items-center gap-1">
            <Smartphone className="w-3.5 h-3.5 text-blue-600" />
            <span>{t('deviceLabel')}:</span>
          </span>
          <div className="text-end">
            <span className="font-bold text-slate-900 block">
              {brand} {model}
            </span>
            {estimate.screenRecord && (
              <span className="text-[10px] text-blue-600 font-medium block">
                {lang === 'ar' ? estimate.screenRecord.screenTypeAr : estimate.screenRecord.screenTypeFr}
              </span>
            )}
            {estimate.batteryRecord && (
              <span className="text-[10px] text-emerald-600 font-medium block">
                {lang === 'ar' ? estimate.batteryRecord.batteryTypeAr : estimate.batteryRecord.batteryTypeFr} {estimate.batteryRecord.capacityMah ? `(${estimate.batteryRecord.capacityMah}mAh)` : ''}
              </span>
            )}
            {estimate.globalRecord && (
              <span className="text-[10px] text-blue-600 font-medium block">
                {lang === 'ar' ? estimate.globalRecord.itemNameAr : estimate.globalRecord.itemNameFr}
              </span>
            )}
          </div>
        </div>

        {/* Problem Item */}
        <div className="flex items-start justify-between gap-2 pt-2.5">
          <span className="text-slate-500 font-semibold flex items-center gap-1">
            <Wrench className="w-3.5 h-3.5 text-blue-600" />
            <span>{t('problemLabel')}:</span>
          </span>
          <span className="font-bold text-slate-900 text-end">
            {problem ? (lang === 'ar' ? problem.nameAr : problem.nameFr) : (lang === 'ar' ? 'تشخيص عام' : 'Diagnostic')}
          </span>
        </div>

        {problemDescription && (
          <div className="pt-2.5">
            <span className="text-slate-500 font-semibold block mb-1">{t('problemDetails')}:</span>
            <p className="bg-slate-50 p-2.5 rounded-xl text-slate-700 text-[11px] leading-relaxed">
              {problemDescription}
            </p>
          </div>
        )}

        {/* Date & Time Slot */}
        <div className="flex items-start justify-between gap-2 pt-2.5">
          <span className="text-slate-500 font-semibold flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-blue-600" />
            <span>{t('preferredDate')}:</span>
          </span>
          <span className="font-bold text-slate-900 text-end">
            {preferredDate} ({preferredTime})
          </span>
        </div>

        {/* Customer & Location */}
        <div className="pt-2.5 space-y-1">
          <div className="flex items-start justify-between gap-2">
            <span className="text-slate-500 font-semibold">{t('fullName')}:</span>
            <span className="font-bold text-slate-900">{customerName}</span>
          </div>
          <div className="flex items-start justify-between gap-2">
            <span className="text-slate-500 font-semibold">{t('phoneNumber')}:</span>
            <span className="font-bold text-blue-600 font-mono" dir="ltr">{phoneNumber}</span>
          </div>
          <div className="flex items-start justify-between gap-2">
            <span className="text-slate-500 font-semibold flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-blue-600" />
              <span>{t('streetAddress')}:</span>
            </span>
            <span className="font-medium text-slate-800 text-end max-w-[60%]">
              {commune} - {address}
            </span>
          </div>
          {locationInstructions && (
            <p className="text-[11px] text-slate-500 italic text-end">
              ({locationInstructions})
            </p>
          )}
        </div>
      </div>

      {/* Promo Code Input Card */}
      <div className="bg-white rounded-2xl p-3.5 border border-slate-200/90 shadow-xs flex items-center gap-2">
        <Tag className="w-4 h-4 text-blue-600 shrink-0" />
        <input
          id="input-promo-code"
          type="text"
          value={promoInput}
          onChange={(e) => setPromoInput(e.target.value)}
          placeholder={lang === 'ar' ? 'كود تخفيض (مثال: FIXORAN50)' : 'Code promo (ex: FIXORAN50)'}
          className="flex-1 bg-slate-50 uppercase font-mono text-xs border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-blue-600"
        />
        <button
          type="button"
          onClick={handleApplyPromo}
          className="px-3 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-black transition-colors cursor-pointer"
        >
          {lang === 'ar' ? 'تطبيق' : 'Appliquer'}
        </button>
      </div>

      {/* EXACT THE FIX POINT PRICING BREAKDOWN */}
      <div className="bg-slate-950 text-white rounded-2xl p-4 shadow-xl border border-slate-800 space-y-3">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <span className="text-xs font-bold text-sky-400 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{lang === 'ar' ? 'تفاصيل التسعيرة الرسمية' : 'Détail de la tarification'}</span>
          </span>
          <span className="text-[10px] bg-sky-950 text-sky-300 px-2 py-0.5 rounded-full font-semibold border border-sky-800/60">
            {lang === 'ar' ? 'السعر التقريبي' : 'Prix indicatif'}
          </span>
        </div>

        {/* 1. Part Price (سعر القطعة) */}
        <div className="flex items-center justify-between text-xs text-slate-300">
          <span className="flex items-center gap-1">
            <span>{lang === 'ar' ? 'سعر القطعة (الأصلية):' : 'Prix de la pièce (Originale) :'}</span>
          </span>
          {estimate.partPrice !== null ? (
            <span className="font-mono font-bold text-white">
              {estimate.partPrice.toLocaleString()} {t('dzd')}
            </span>
          ) : (
            <span className="text-[11px] text-amber-300 font-medium">
              {lang === 'ar' ? 'يحدد بعد التشخيص' : 'Après diagnostic'}
            </span>
          )}
        </div>

        {/* 2. Labor Fee (Main-d'œuvre) */}
        {serviceType !== 'parts_delivery' && (
          <div className="flex items-center justify-between text-xs text-slate-300">
            <span>{lang === 'ar' ? 'أجرة التركيب (Main-d\'œuvre):' : 'Main-d\'œuvre (Installation) :'}</span>
            {estimate.laborFee !== null ? (
              <span className="font-mono font-bold text-white">
                {estimate.laborFee.toLocaleString()} {t('dzd')}
              </span>
            ) : (
              <span className="text-[11px] text-slate-400 font-medium">
                {lang === 'ar' ? 'حسب فئة القطعة' : 'Selon barème pièce'}
              </span>
            )}
          </div>
        )}

        {/* 3. Travel (التنقل ابتداءً من 2,000 دج) */}
        <div className="flex items-center justify-between text-xs text-slate-300">
          <span className="flex items-center gap-1">
            <Truck className="w-3.5 h-3.5 text-sky-400 shrink-0" />
            <span>{lang === 'ar' ? 'التنقل ابتداءً من:' : 'Déplacement à partir de :'}</span>
          </span>
          <span className="font-mono font-bold text-white">
            {estimate.travelFee.toLocaleString()} {t('dzd')}
          </span>
        </div>

        {/* Promo discount if active */}
        {discountValue > 0 && hasKnownPrice && (
          <div className="flex items-center justify-between text-xs text-emerald-400 border-t border-slate-800/80 pt-2">
            <span>{lang === 'ar' ? 'تخفيض كود الترويجي:' : 'Remise code promo :'}</span>
            <span className="font-mono font-bold">
              -{discountValue.toLocaleString()} {t('dzd')}
            </span>
          </div>
        )}

        {/* 4. Total Estimatif (المجموع التقريبي) */}
        <div className="border-t border-slate-800 pt-3 flex items-center justify-between">
          <div>
            <span className="font-extrabold text-sm text-white block">
              {lang === 'ar' ? 'المجموع التقريبي' : 'Total estimatif'}
            </span>
            <span className="text-[10px] text-slate-400">
              {lang === 'ar' ? '(السعر التقريبي)' : '(Prix indicatif)'}
            </span>
          </div>

          <div className="text-end">
            {hasKnownPrice && calculatedTotalWithDiscount !== null ? (
              <>
                <span className="text-lg font-black text-sky-400 font-mono block">
                  ~ {calculatedTotalWithDiscount.toLocaleString()} {t('dzd')}
                </span>
                <span className="text-[10px] text-slate-400 font-medium">
                  {lang === 'ar' ? 'القطعة + التركيب + التنقل' : 'Pièce + Main-d\'œuvre + Déplacement'}
                </span>
              </>
            ) : (
              <>
                <span className="text-xs font-bold text-amber-300 block">
                  {lang === 'ar' ? 'يحدد بعد الفحص' : 'Confirmé après diagnostic'}
                </span>
                <span className="text-[10px] text-slate-400">
                  {lang === 'ar' ? '+ التنقل من 2,000 دج' : '+ Déplacement dès 2 000 DA'}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Missing/Unknown Model Notice if not in database */}
        {!estimate.isPriceKnown && (
          <div className="bg-amber-950/70 border border-amber-800/80 rounded-xl p-2.5 text-[11px] text-amber-200 flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <span>
              {lang === 'ar' ? estimate.unknownNoticeAr : estimate.unknownNoticeFr}
            </span>
          </div>
        )}
      </div>

      {/* Mandatory Price Disclaimer Warnings */}
      <div className="bg-amber-50 border border-amber-200/90 rounded-2xl p-3.5 text-xs text-amber-900 space-y-1.5 leading-relaxed">
        <div className="flex items-center gap-1.5 font-bold text-amber-950">
          <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
          <span>{lang === 'ar' ? 'تنبيهات مهمة حول السعر والخدمة' : 'Informations importantes'}</span>
        </div>
        <p className="text-[11px] text-amber-900 font-bold">
          • {lang === 'ar' ? estimate.disclaimerAr : estimate.disclaimerFr}
        </p>
        <p className="text-[11px] text-amber-800">
          • {lang === 'ar'
            ? 'الدفع يتم عند انتهاء التصليح والتجربة الكاملة في مكانك (لا يوجد دفع إلكتروني مسبق).'
            : 'Paiement effectué sur place après intervention et vérification complète du téléphone.'}
        </p>
      </div>

      {/* Confirmation CTA Buttons */}
      <div className="flex items-center gap-2 pt-2">
        <button
          id="btn-back-from-summary"
          onClick={onBack}
          disabled={isSubmitting}
          type="button"
          className="py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-700 font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
        >
          <BackArrowIcon className="w-4 h-4" />
          <span>{t('btnBack')}</span>
        </button>

        <button
          id="btn-confirm-order-final"
          onClick={onConfirm}
          disabled={isSubmitting}
          type="button"
          className="flex-1 py-4 px-6 rounded-2xl bg-blue-600 hover:bg-blue-700 active:scale-98 text-white font-extrabold text-base shadow-xl shadow-blue-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          {isSubmitting ? (
            <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
          ) : (
            <>
              <CheckCircle2 className="w-5 h-5" />
              <span>{t('btnConfirmOrder')}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
