import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { ORAN_COMMUNES } from '../../data/mockData';
import { 
  User, Phone, MapPin, Navigation, Calendar, Clock, 
  FileText, ArrowRight, ArrowLeft, Sparkles, CheckCircle2, AlertCircle 
} from 'lucide-react';

interface DetailsFormProps {
  customerName: string;
  phoneNumber: string;
  commune: string;
  address: string;
  locationInstructions: string;
  preferredDate: string;
  preferredTime: string;
  notes: string;
  geoCoords?: { lat: number; lng: number };
  onChangeName: (val: string) => void;
  onChangePhone: (val: string) => void;
  onChangeCommune: (val: string) => void;
  onChangeAddress: (val: string) => void;
  onChangeLocationInstructions: (val: string) => void;
  onChangePreferredDate: (val: string) => void;
  onChangePreferredTime: (val: string) => void;
  onChangeNotes: (val: string) => void;
  onSetGeoCoords: (coords: { lat: number; lng: number }) => void;
  onNext: () => void;
  onBack: () => void;
}

export const DetailsForm: React.FC<DetailsFormProps> = ({
  customerName,
  phoneNumber,
  commune,
  address,
  locationInstructions,
  preferredDate,
  preferredTime,
  notes,
  geoCoords,
  onChangeName,
  onChangePhone,
  onChangeCommune,
  onChangeAddress,
  onChangeLocationInstructions,
  onChangePreferredDate,
  onChangePreferredTime,
  onChangeNotes,
  onSetGeoCoords,
  onNext,
  onBack,
}) => {
  const { lang, t, isRtl } = useLanguage();
  const [isLocating, setIsLocating] = useState(false);
  const [locationSuccess, setLocationSuccess] = useState<string | null>(
    geoCoords ? `${geoCoords.lat.toFixed(4)}, ${geoCoords.lng.toFixed(4)}` : null
  );

  const handleUseMyLocation = () => {
    setIsLocating(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          onSetGeoCoords(coords);
          setIsLocating(false);
          setLocationSuccess(`${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)} (GPS Oran)`);
          
          // Auto fill Oran address landmark if empty
          if (!address) {
            onChangeAddress(lang === 'ar' ? 'موقع محدد عبر GPS بوهران' : 'Position GPS confirmée à Oran');
          }
        },
        (error) => {
          // Fallback to Oran default center coordinates
          const defaultOranCoords = { lat: 35.6987, lng: -0.6349 };
          onSetGeoCoords(defaultOranCoords);
          setIsLocating(false);
          setLocationSuccess('35.6987, -0.6349 (Oran Centre)');
        },
        { timeout: 8000 }
      );
    } else {
      const defaultOranCoords = { lat: 35.6987, lng: -0.6349 };
      onSetGeoCoords(defaultOranCoords);
      setIsLocating(false);
      setLocationSuccess('35.6987, -0.6349 (Oran Centre)');
    }
  };

  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;
  const BackArrowIcon = isRtl ? ArrowRight : ArrowLeft;

  // Basic validation: name, phone, commune, address
  const isPhoneValid = phoneNumber.replace(/\s+/g, '').length >= 9;
  const isValid = Boolean(customerName.trim() && isPhoneValid && commune && address.trim());

  return (
    <div id="step-details-form" className="space-y-4 animate-in fade-in duration-200">
      {/* Travel Fee Banner */}
      <div className="bg-linear-to-r from-blue-900 to-blue-800 text-white rounded-2xl p-4 shadow-md shadow-blue-950/15 flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
          <MapPin className="w-5 h-5 text-sky-300" />
        </div>
        <div className="text-xs">
          <p className="font-extrabold text-sm text-sky-100">
            {t('travelFeeNotice')}
          </p>
          <p className="text-blue-200 text-[11px] mt-0.5">
            {lang === 'ar'
              ? 'تحدد التكلفة بدقة حسب موقعك في ولاية وهران • الدفع بعد الانتهاء'
              : 'Frais ajustés selon la commune du Grand Oran • Paiement sur place'}
          </p>
        </div>
      </div>

      {/* Customer Info Group */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs space-y-3">
        <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
          <User className="w-4 h-4 text-blue-600" />
          <span>{t('personalInfo')}</span>
        </h4>

        {/* Full Name */}
        <div>
          <label className="block text-[11px] font-bold text-slate-700 mb-1">
            {t('fullName')} <span className="text-red-500">*</span>
          </label>
          <input
            id="input-customer-name"
            type="text"
            value={customerName}
            onChange={(e) => onChangeName(e.target.value)}
            placeholder={t('fullNamePlaceholder')}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white transition-all"
          />
        </div>

        {/* Phone Number */}
        <div>
          <label className="block text-[11px] font-bold text-slate-700 mb-1">
            {t('phoneNumber')} <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              id="input-customer-phone"
              type="tel"
              value={phoneNumber}
              onChange={(e) => onChangePhone(e.target.value)}
              placeholder="05 50 12 34 56"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-900 font-mono placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white transition-all"
            />
            <span className="absolute top-2.5 end-3 text-[10px] font-bold text-slate-400 flex items-center gap-1">
              🇩🇿 +213
            </span>
          </div>
        </div>
      </div>

      {/* Address & Location Group */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-blue-600" />
            <span>{t('communeOran')} <span className="text-red-500">*</span></span>
          </h4>
        </div>

        {/* Commune Selector */}
        <div>
          <select
            id="select-oran-commune"
            value={commune}
            onChange={(e) => onChangeCommune(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-900 font-semibold focus:outline-none focus:border-blue-600 focus:bg-white transition-all cursor-pointer"
          >
            <option value="">-- {t('selectCommune')} --</option>
            {ORAN_COMMUNES.map((c) => (
              <option key={c.id} value={c.nameAr}>
                {lang === 'ar' ? c.nameAr : c.nameFr} (دج {c.baseDeliveryFee})
              </option>
            ))}
          </select>
        </div>

        {/* Geolocation Button "استخدم موقعي" */}
        <div>
          <button
            type="button"
            id="btn-use-my-location"
            onClick={handleUseMyLocation}
            disabled={isLocating}
            className={`w-full py-2.5 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              locationSuccess
                ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                : 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100'
            }`}
          >
            <Navigation className={`w-4 h-4 ${isLocating ? 'animate-spin' : ''}`} />
            <span>
              {isLocating
                ? t('locatingGps')
                : locationSuccess
                ? `${t('locationCaptured')}`
                : t('useMyLocation')}
            </span>
          </button>
          {locationSuccess && (
            <p className="text-[10px] text-emerald-700 font-mono mt-1 px-1 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              <span>GPS: {locationSuccess}</span>
            </p>
          )}
        </div>

        {/* Street Address */}
        <div>
          <label className="block text-[11px] font-bold text-slate-700 mb-1">
            {t('streetAddress')} <span className="text-red-500">*</span>
          </label>
          <input
            id="input-street-address"
            type="text"
            value={address}
            onChange={(e) => onChangeAddress(e.target.value)}
            placeholder={t('streetAddressPlaceholder')}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white transition-all"
          />
        </div>

        {/* Additional Location Instructions */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-600 mb-1">
            {t('locationInstructions')}
          </label>
          <input
            id="input-location-instructions"
            type="text"
            value={locationInstructions}
            onChange={(e) => onChangeLocationInstructions(e.target.value)}
            placeholder={t('locationInstructionsPlaceholder')}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white transition-all"
          />
        </div>
      </div>

      {/* Date & Time Slot Group */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs space-y-3">
        <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
          <Calendar className="w-4 h-4 text-blue-600" />
          <span>{t('preferredDate')} & {t('preferredTime')}</span>
        </h4>

        {/* Date Selector Pills */}
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            id="btn-date-today"
            onClick={() => onChangePreferredDate(t('today'))}
            className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
              preferredDate.includes('اليوم') || preferredDate.includes('Aujourd')
                ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
            }`}
          >
            {t('today')}
          </button>

          <button
            type="button"
            id="btn-date-tomorrow"
            onClick={() => onChangePreferredDate(t('tomorrow'))}
            className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
              preferredDate.includes('غداً') || preferredDate.includes('Demain')
                ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
            }`}
          >
            {t('tomorrow')}
          </button>
        </div>

        {/* Time Slot Selector */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-600 mb-1.5 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-slate-500" />
            <span>{t('preferredTime')}</span>
          </label>
          <div className="grid grid-cols-3 gap-1.5 text-[11px]">
            {[
              { id: 'morning', labelAr: 'صباحاً (09-12h)', labelFr: 'Matin (09-12h)' },
              { id: 'afternoon', labelAr: 'ظهراً (13-17h)', labelFr: 'Midi (13-17h)' },
              { id: 'evening', labelAr: 'مساءً (17-20h)', labelFr: 'Soir (17-20h)' }
            ].map((slot) => {
              const label = lang === 'ar' ? slot.labelAr : slot.labelFr;
              const isSelected = preferredTime === label;
              return (
                <button
                  key={slot.id}
                  type="button"
                  onClick={() => onChangePreferredTime(label)}
                  className={`py-2 px-1 rounded-xl font-bold text-center border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-blue-50 text-blue-900 border-blue-500 font-black'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <span className="truncate">{label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Additional notes */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-600 mb-1">
            {t('orderNotes')} ({lang === 'ar' ? 'اختياري' : 'Optionnel'})
          </label>
          <input
            id="input-optional-notes"
            type="text"
            value={notes}
            onChange={(e) => onChangeNotes(e.target.value)}
            placeholder={lang === 'ar' ? 'أي تعليمات أو ملاحظة إضافية...' : 'Instructions complémentaires...'}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white transition-all"
          />
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center gap-2 pt-2">
        <button
          id="btn-back-from-details"
          onClick={onBack}
          type="button"
          className="py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-700 font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
        >
          <BackArrowIcon className="w-4 h-4" />
          <span>{t('btnBack')}</span>
        </button>

        <button
          id="btn-next-from-details"
          disabled={!isValid}
          onClick={onNext}
          type="button"
          className={`flex-1 py-3.5 px-5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
            isValid
              ? 'bg-blue-600 hover:bg-blue-700 active:scale-98 text-white shadow-md shadow-blue-600/25 cursor-pointer'
              : 'bg-slate-200 text-slate-400 cursor-not-allowed'
          }`}
        >
          <span>{t('btnNext')}</span>
          <ArrowIcon className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
