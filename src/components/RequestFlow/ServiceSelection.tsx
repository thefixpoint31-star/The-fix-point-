import React from 'react';
import { ServiceType } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { ServiceCard } from '../ServiceCard';
import { CheckCircle2, ShieldCheck, MapPin, Sparkles } from 'lucide-react';

interface ServiceSelectionProps {
  selectedService: ServiceType;
  onSelectService: (service: ServiceType) => void;
  onNext: () => void;
}

export const ServiceSelection: React.FC<ServiceSelectionProps> = ({
  selectedService,
  onSelectService,
  onNext,
}) => {
  const { lang, t } = useLanguage();

  return (
    <div id="step-service-selection" className="space-y-4 animate-in fade-in duration-200">
      {/* Header instructions */}
      <div className="bg-blue-50/80 border border-blue-100 rounded-2xl p-3.5 flex items-start gap-3">
        <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 mt-0.5">
          <Sparkles className="w-4 h-4" />
        </div>
        <div className="text-xs text-slate-700 leading-relaxed">
          <p className="font-bold text-slate-900">
            {lang === 'ar' ? 'اختر الخدمة المناسبة لك بوهران:' : 'Choisissez le service souhaité à Oran :'}
          </p>
          <p className="mt-0.5 text-slate-600">
            {t('travelFeeNotice')} • {t('noOnlinePayNotice')}
          </p>
        </div>
      </div>

      {/* Service Cards Grid */}
      <div className="space-y-3">
        {/* Service 1 */}
        <ServiceCard
          type="at_home"
          isSelected={selectedService === 'at_home'}
          onSelect={(s) => onSelectService(s)}
        />

        {/* Service 2 */}
        <ServiceCard
          type="parts_delivery"
          isSelected={selectedService === 'parts_delivery'}
          onSelect={(s) => onSelectService(s)}
        />

        {/* Service 3 (Prominent) */}
        <ServiceCard
          type="pickup_return"
          isSelected={selectedService === 'pickup_return'}
          onSelect={(s) => onSelectService(s)}
        />
      </div>

      {/* Continue CTA */}
      <div className="pt-2">
        <button
          id="btn-next-from-service"
          onClick={onNext}
          className="w-full py-3.5 px-6 rounded-2xl bg-blue-600 hover:bg-blue-700 active:scale-98 text-white font-bold text-base shadow-lg shadow-blue-600/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          <span>{t('btnNext')}</span>
          <CheckCircle2 className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
