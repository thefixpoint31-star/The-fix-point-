import React, { useState, useEffect } from 'react';
import { ServiceType, ProblemOption, RepairRequest } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { REPAIR_PROBLEMS, BRANDS, ORAN_COMMUNES } from '../../data/mockData';
import { calculateRepairEstimate, BASE_TRAVEL_FEE } from '../../services/pricingService';
import { OrderService } from '../../services/orderService';
import { ServiceSelection } from '../RequestFlow/ServiceSelection';
import { DeviceSelection } from '../RequestFlow/DeviceSelection';
import { ProblemSelection } from '../RequestFlow/ProblemSelection';
import { DetailsForm } from '../RequestFlow/DetailsForm';
import { OrderSummary } from '../RequestFlow/OrderSummary';
import { OrderSuccessModal } from '../RequestFlow/OrderSuccessModal';
import { Check, Sparkles, ShieldAlert, ArrowLeft } from 'lucide-react';

interface RequestScreenProps {
  initialService?: ServiceType;
  initialBrand?: string;
  initialModel?: string;
  initialProblemId?: string;
  initialPromoCode?: string;
  onOrderCreated: (newOrder: RepairRequest) => void;
  onTrackOrder: (orderId: string) => void;
  onGoHome: () => void;
}

export const RequestScreen: React.FC<RequestScreenProps> = ({
  initialService = 'at_home',
  initialBrand = 'Apple',
  initialModel = 'iPhone 13',
  initialProblemId = 'screen',
  initialPromoCode = '',
  onOrderCreated,
  onTrackOrder,
  onGoHome,
}) => {
  const { lang, t, isRtl } = useLanguage();

  // Current Step state (1 to 5)
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Form State
  const [serviceType, setServiceType] = useState<ServiceType>(initialService);
  const [brand, setBrand] = useState<string>(initialBrand);
  const [model, setModel] = useState<string>(initialModel);
  const [problemId, setProblemId] = useState<string>(initialProblemId);
  const [problemDescription, setProblemDescription] = useState<string>('');
  const [mediaFiles, setMediaFiles] = useState<string[]>([]);
  
  // Details state
  const [customerName, setCustomerName] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [commune, setCommune] = useState<string>('عقيد لطفي (Akid Lotfi)');
  const [address, setAddress] = useState<string>('');
  const [locationInstructions, setLocationInstructions] = useState<string>('');
  const [geoCoords, setGeoCoords] = useState<{ lat: number; lng: number } | undefined>(undefined);
  const [preferredDate, setPreferredDate] = useState<string>(t('today'));
  const [preferredTime, setPreferredTime] = useState<string>(lang === 'ar' ? 'صباحاً (09-12h)' : 'Matin (09-12h)');
  const [notes, setNotes] = useState<string>('');
  const [appliedPromoCode, setAppliedPromoCode] = useState<string>(initialPromoCode);

  // Submission & modal state
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [createdOrder, setCreatedOrder] = useState<RepairRequest | null>(null);

  // Sync initial props if they change
  useEffect(() => {
    if (initialService) setServiceType(initialService);
    if (initialBrand) setBrand(initialBrand);
    if (initialModel) setModel(initialModel);
    if (initialProblemId) setProblemId(initialProblemId);
    if (initialPromoCode) setAppliedPromoCode(initialPromoCode);
  }, [initialService, initialBrand, initialModel, initialProblemId, initialPromoCode]);

  const selectedProblem = REPAIR_PROBLEMS.find((p) => p.id === problemId) || REPAIR_PROBLEMS[0];

  const stepsHeader = [
    { number: 1, labelAr: 'الخدمة', labelFr: 'Service' },
    { number: 2, labelAr: 'الجهاز', labelFr: 'Appareil' },
    { number: 3, labelAr: 'المشكلة', labelFr: 'Panne' },
    { number: 4, labelAr: 'التفاصيل', labelFr: 'Détails' },
    { number: 5, labelAr: 'التأكيد', labelFr: 'Confirmer' },
  ];

  const handleConfirmOrder = () => {
    setIsSubmitting(true);

    // Calculate official repair pricing using the pricing engine
    const estimate = calculateRepairEstimate(brand, model, problemId, BASE_TRAVEL_FEE);
    const isPriceKnown = estimate.isPriceKnown && estimate.estimatedRepairPrice !== null;
    const estimatedRepairPrice = isPriceKnown ? estimate.estimatedRepairPrice : null;
    const travelFee = BASE_TRAVEL_FEE;
    const discount = (appliedPromoCode && isPriceKnown) ? 1000 : 0;
    const estimatedTotal = (isPriceKnown && estimate.estimatedTotal !== null)
      ? Math.max(0, estimate.estimatedTotal - discount)
      : null;

    // Simulate realistic processing
    setTimeout(() => {
      const newOrder = OrderService.createOrder({
        serviceType,
        brand: brand || 'Apple',
        model: model || 'iPhone 13',
        problemId: problemId || 'screen',
        problemNameAr: selectedProblem?.nameAr || 'شاشة مكسورة',
        problemNameFr: selectedProblem?.nameFr || 'Écran cassé',
        problemDescription,
        mediaFiles,
        customerName: customerName.trim() || 'زبون وهران',
        phoneNumber: phoneNumber.trim() || '0550 12 34 56',
        commune: commune || 'وهران وسط',
        address: address.trim() || 'وهران',
        locationInstructions,
        geoCoords,
        preferredDate,
        preferredTime,
        notes,
        partPrice: isPriceKnown ? estimate.partPrice : null,
        screenPartPrice: isPriceKnown ? estimate.partPrice : null,
        laborFee: isPriceKnown ? estimate.laborFee : null,
        travelFee,
        discount,
        discountAmount: discount,
        promoCode: appliedPromoCode,
        isPriceKnown,
        estimatedRepairPrice,
        estimatedTotal,
        finalPrice: estimatedTotal,
        internalNotes: 'طلب جديد تم تأكيده من العميل عبر التطبيق.',
        technicianNotes:
          lang === 'ar'
            ? 'تم استلام طلبك بنجاح، سنتصل بك هاتفياً لتأكيد الموعد وانطلاق التقني.'
            : 'Demande reçue avec succès, nous vous appellerons pour valider le rendez-vous.',
        pickupDeliveryDetails:
          serviceType === 'pickup_return'
            ? {
                pickupAddress: address.trim() || 'وهران',
                pickupTime: preferredTime,
                returnAddress: address.trim() || 'وهران',
                pickupStatus: 'في انتظار عامل التوصيل',
                repairStatus: 'لم يبدأ بعد',
                pickupSubStatus: 'WAITING_DRIVER',
              }
            : undefined,
      });

      onOrderCreated(newOrder);
      setCreatedOrder(newOrder);
      setIsSubmitting(false);
    }, 500);
  };

  return (
    <div id="screen-request-repair" className="space-y-4 pb-8">
      {/* 5-Step Stepper Progress Bar */}
      <div className="bg-white rounded-2xl p-3.5 border border-slate-200/90 shadow-xs">
        <div className="flex items-center justify-between relative">
          {/* Progress bar background line */}
          <div className="absolute top-1/2 start-0 end-0 h-1 bg-slate-100 -translate-y-1/2 z-0"></div>
          <div
            className="absolute top-1/2 start-0 h-1 bg-blue-600 -translate-y-1/2 z-0 transition-all duration-300"
            style={{ width: `${((currentStep - 1) / 4) * 100}%` }}
          ></div>

          {stepsHeader.map((s) => {
            const isDone = s.number < currentStep;
            const isCurrent = s.number === currentStep;

            return (
              <button
                key={s.number}
                type="button"
                onClick={() => {
                  // Allow jumping to previously passed steps
                  if (s.number < currentStep) {
                    setCurrentStep(s.number);
                  }
                }}
                className={`relative z-10 flex flex-col items-center group cursor-pointer transition-all`}
              >
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    isDone
                      ? 'bg-blue-600 text-white shadow-xs'
                      : isCurrent
                      ? 'bg-blue-600 text-white ring-4 ring-blue-100 scale-110 font-black'
                      : 'bg-white text-slate-400 border-2 border-slate-200'
                  }`}
                >
                  {isDone ? <Check className="w-3.5 h-3.5" /> : s.number}
                </div>
                <span
                  className={`text-[10px] mt-1 hidden xs:block truncate max-w-14 ${
                    isCurrent ? 'font-black text-blue-700' : 'text-slate-500 font-medium'
                  }`}
                >
                  {lang === 'ar' ? s.labelAr : s.labelFr}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Step Header Title */}
      <div className="flex items-center justify-between px-1">
        <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-1.5">
          <span className="w-6 h-6 rounded-lg bg-blue-600 text-white text-xs font-mono font-bold flex items-center justify-center">
            {currentStep}
          </span>
          <span>
            {currentStep === 1 && t('step1Title')}
            {currentStep === 2 && t('step2Title')}
            {currentStep === 3 && t('step3Title')}
            {currentStep === 4 && t('step4Title')}
            {currentStep === 5 && t('step5Title')}
          </span>
        </h2>

        <span className="text-[11px] font-bold text-slate-500">
          {currentStep}/5
        </span>
      </div>

      {/* Step Renderers */}
      {currentStep === 1 && (
        <ServiceSelection
          selectedService={serviceType}
          onSelectService={(s) => {
            setServiceType(s);
            setCurrentStep(2);
          }}
          onNext={() => setCurrentStep(2)}
        />
      )}

      {currentStep === 2 && (
        <DeviceSelection
          selectedBrand={brand}
          selectedModel={model}
          onSelectBrand={(b) => setBrand(b)}
          onSelectModel={(m) => setModel(m)}
          onNext={() => setCurrentStep(3)}
          onBack={() => setCurrentStep(1)}
        />
      )}

      {currentStep === 3 && (
        <ProblemSelection
          selectedProblemId={problemId}
          problemDescription={problemDescription}
          mediaFiles={mediaFiles}
          onSelectProblem={(prob) => {
            setProblemId(prob.id);
          }}
          onChangeDescription={(desc) => setProblemDescription(desc)}
          onUpdateMediaFiles={(files) => setMediaFiles(files)}
          onNext={() => setCurrentStep(4)}
          onBack={() => setCurrentStep(2)}
        />
      )}

      {currentStep === 4 && (
        <DetailsForm
          customerName={customerName}
          phoneNumber={phoneNumber}
          commune={commune}
          address={address}
          locationInstructions={locationInstructions}
          preferredDate={preferredDate}
          preferredTime={preferredTime}
          notes={notes}
          geoCoords={geoCoords}
          onChangeName={(val) => setCustomerName(val)}
          onChangePhone={(val) => setPhoneNumber(val)}
          onChangeCommune={(val) => setCommune(val)}
          onChangeAddress={(val) => setAddress(val)}
          onChangeLocationInstructions={(val) => setLocationInstructions(val)}
          onChangePreferredDate={(val) => setPreferredDate(val)}
          onChangePreferredTime={(val) => setPreferredTime(val)}
          onChangeNotes={(val) => setNotes(val)}
          onSetGeoCoords={(coords) => setGeoCoords(coords)}
          onNext={() => setCurrentStep(5)}
          onBack={() => setCurrentStep(3)}
        />
      )}

      {currentStep === 5 && (
        <OrderSummary
          serviceType={serviceType}
          brand={brand}
          model={model}
          problem={selectedProblem}
          problemDescription={problemDescription}
          mediaFiles={mediaFiles}
          customerName={customerName}
          phoneNumber={phoneNumber}
          commune={commune}
          address={address}
          locationInstructions={locationInstructions}
          preferredDate={preferredDate}
          preferredTime={preferredTime}
          notes={notes}
          appliedPromoCode={appliedPromoCode}
          onConfirm={handleConfirmOrder}
          onBack={() => setCurrentStep(4)}
          isSubmitting={isSubmitting}
        />
      )}

      {/* Success Modal */}
      {createdOrder && (
        <OrderSuccessModal
          request={createdOrder}
          onTrackOrder={(id) => {
            setCreatedOrder(null);
            onTrackOrder(id);
          }}
          onGoHome={() => {
            setCreatedOrder(null);
            onGoHome();
          }}
        />
      )}
    </div>
  );
};
