import React, { useState, useMemo } from 'react';
import { RepairRequest, OrderStatus, PickupSubStatus, TimelineStep } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { TheFixPointLogo } from '../TheFixPointLogo';
import { OrderService, STATUS_METADATA, PICKUP_SUB_STATUSES } from '../../services/orderService';
import { 
  Search, Clock, CheckCircle2, Circle, Truck, Wrench, 
  Smartphone, Phone, MessageCircle, MapPin, AlertCircle, 
  Calendar, ShieldCheck, ChevronDown, ChevronUp, Sparkles, RefreshCw,
  DollarSign, ArrowRight, ArrowLeft, Send
} from 'lucide-react';

interface TrackingScreenProps {
  orders: RepairRequest[];
  selectedOrderId?: string;
  onUpdateOrderStatus?: (orderId: string, newStatus: OrderStatus) => void;
  onNavigateNewRequest: () => void;
}

export const TrackingScreen: React.FC<TrackingScreenProps> = ({
  orders,
  selectedOrderId,
  onUpdateOrderStatus,
  onNavigateNewRequest,
}) => {
  const { lang, t, isRtl } = useLanguage();
  const [searchInput, setSearchInput] = useState(selectedOrderId || (orders[0]?.id ?? 'ZP-000001'));
  const [activeOrderId, setActiveOrderId] = useState<string>(selectedOrderId || (orders[0]?.id ?? 'ZP-000001'));
  const [notFoundQuery, setNotFoundQuery] = useState<string | null>(null);

  // Sync if selectedOrderId changes from outside
  React.useEffect(() => {
    if (selectedOrderId) {
      setActiveOrderId(selectedOrderId);
      setSearchInput(selectedOrderId);
      setNotFoundQuery(null);
    }
  }, [selectedOrderId]);

  // Find order in current list or fetch from database
  const currentOrder = useMemo(() => {
    // First try provided list
    let match = orders.find((o) => o.id.toUpperCase() === activeOrderId.toUpperCase());
    if (!match) {
      // Try global service (e.g. if user searches any valid order ID)
      match = OrderService.getOrderById(activeOrderId);
    }
    return match || orders[0];
  }, [orders, activeOrderId]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchInput.trim().toUpperCase();
    if (!q) return;

    const match = orders.find((o) => o.id.toUpperCase() === q) || OrderService.getOrderById(q);
    if (match) {
      setActiveOrderId(match.id);
      setNotFoundQuery(null);
    } else {
      setNotFoundQuery(q);
    }
  };

  // Build standard timeline steps
  const getStandardTimelineSteps = (order: RepairRequest): TimelineStep[] => {
    const isAtHome = order.serviceType === 'at_home';
    const isParts = order.serviceType === 'parts_delivery';

    let statusSequence: OrderStatus[] = [];
    if (isParts) {
      statusSequence = ['NEW', 'CONFIRMED', 'TECHNICIAN_ON_WAY', 'DELIVERED'];
    } else if (isAtHome) {
      statusSequence = ['NEW', 'CONFIRMED', 'TECHNICIAN_ON_WAY', 'DIAGNOSIS', 'REPAIRING', 'READY', 'DELIVERED'];
    } else {
      statusSequence = ['NEW', 'CONFIRMED', 'TECHNICIAN_ON_WAY', 'PHONE_PICKED_UP', 'DIAGNOSIS', 'REPAIRING', 'READY', 'DELIVERED'];
    }

    // Map order status to sequence index
    const currentStatus = order.status;
    let resolvedIdx = statusSequence.indexOf(currentStatus);
    if (resolvedIdx === -1) {
      if (currentStatus === 'CANCELLED') resolvedIdx = 0;
      else resolvedIdx = 0;
    }

    return statusSequence.map((st, idx) => {
      const isCompleted = idx < resolvedIdx || (currentStatus === 'DELIVERED' && idx === resolvedIdx);
      const isCurrent = idx === resolvedIdx && currentStatus !== 'DELIVERED';
      const meta = STATUS_METADATA[st];

      let descAr = meta.clientNotificationAr;
      let descFr = meta.clientNotificationFr;

      if (st === 'TECHNICIAN_ON_WAY') {
        descAr = `التقني في الطريق إلى عنوانك في ${order.commune}`;
        descFr = `Technicien en route vers ${order.commune}`;
      }

      return {
        status: st,
        titleAr: meta.labelAr,
        titleFr: meta.labelFr,
        descAr,
        descFr,
        isCompleted,
        isCurrent,
      };
    });
  };

  // Build 9-step timeline for "Collecte et retour" (استلام وإرجاع الهاتف)
  const getPickupTimelineSteps = (order: RepairRequest): TimelineStep[] => {
    const currentSub = order.pickupDeliveryDetails?.pickupSubStatus || 'WAITING_DRIVER';
    const subIdx = PICKUP_SUB_STATUSES.findIndex((s) => s.id === currentSub);
    const resolvedIdx = subIdx === -1 ? 0 : subIdx;

    return PICKUP_SUB_STATUSES.map((sub, idx) => {
      const isCompleted = idx < resolvedIdx || (currentSub === 'DELIVERED' && idx === resolvedIdx);
      const isCurrent = idx === resolvedIdx && currentSub !== 'DELIVERED';

      return {
        status: sub.id,
        titleAr: sub.titleAr,
        titleFr: sub.titleFr,
        descAr: sub.descAr,
        descFr: sub.descFr,
        isCompleted,
        isCurrent,
      };
    });
  };

  const isPickupAndReturn = currentOrder?.serviceType === 'pickup_return';
  const timelineSteps = currentOrder
    ? isPickupAndReturn
      ? getPickupTimelineSteps(currentOrder)
      : getStandardTimelineSteps(currentOrder)
    : [];

  const statusMeta = currentOrder ? STATUS_METADATA[currentOrder.status] || STATUS_METADATA.NEW : STATUS_METADATA.NEW;
  const isCancelled = currentOrder?.status === 'CANCELLED';

  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  return (
    <div id="screen-tracking-order" className="space-y-4 pb-12 animate-in fade-in duration-200">
      {/* Search Order ID Box */}
      <div className="bg-white rounded-3xl p-3.5 border border-slate-200/90 shadow-xs space-y-2">
        <label className="block text-[11px] font-bold text-slate-700">
          {lang === 'ar' ? 'البحث عن طلبك وتتبع حالته:' : 'Suivre une demande de réparation :'}
        </label>

        <form onSubmit={handleSearchSubmit} className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute top-3 start-3" />
            <input
              id="input-tracking-id"
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="ZP-000001"
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl ps-9 pe-3 py-2 text-xs font-mono font-bold tracking-wider text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white transition-all uppercase"
            />
          </div>

          <button
            id="btn-submit-track-search"
            type="submit"
            className="py-2 px-4 rounded-2xl bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
          >
            <span>{lang === 'ar' ? 'تتبع' : 'Suivre'}</span>
            <ArrowIcon className="w-3.5 h-3.5" />
          </button>
        </form>

        {notFoundQuery && (
          <div className="p-2 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              {lang === 'ar'
                ? `لم يتم العثور على الطلب (${notFoundQuery}). يرجى التحقق من الرقم.`
                : `Aucune demande trouvée avec le numéro (${notFoundQuery}).`}
            </span>
          </div>
        )}
      </div>

      {!currentOrder ? (
        <div className="bg-white rounded-3xl p-8 border border-slate-200 text-center space-y-3">
          <AlertCircle className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="font-bold text-sm text-slate-800">
            {lang === 'ar' ? 'لا يوجد طلب محدد' : 'Aucune demande'}
          </h3>
          <p className="text-xs text-slate-500">
            {lang === 'ar' ? 'أدخل رقم طلبك أعلاه أو اطلب تصليحاً جديداً.' : 'Entrez votre numéro ou créez une demande.'}
          </p>
          <button
            onClick={onNavigateNewRequest}
            className="py-2.5 px-4 rounded-xl bg-blue-600 text-white font-bold text-xs inline-flex items-center gap-2 cursor-pointer"
          >
            <span>{t('btnNewRequest')}</span>
          </button>
        </div>
      ) : (
        <>
          {/* Order Header Badge Card */}
          <div className="bg-slate-900 text-white rounded-3xl p-5 shadow-xl relative overflow-hidden space-y-3.5">
            <div className="absolute -top-10 -end-10 w-40 h-40 bg-blue-600/30 rounded-full blur-3xl pointer-events-none"></div>

            <div className="flex items-start justify-between gap-2 relative z-10">
              <div>
                <span className="text-[10px] font-bold text-sky-400 block mb-0.5">
                  {lang === 'ar' ? 'رقم الطلب الرسمي' : 'Numéro de demande'}
                </span>
                <h2 className="text-xl font-black font-mono tracking-wider text-white" id="tracked-order-id">
                  {currentOrder.id}
                </h2>
              </div>

              <div className="text-end">
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black border ${statusMeta.badgeBg} ${statusMeta.badgeText}`}
                >
                  <span className="w-2 h-2 rounded-full bg-current animate-ping"></span>
                  <span>{lang === 'ar' ? statusMeta.labelAr : statusMeta.labelFr}</span>
                </span>
                <span className="text-[10px] text-slate-400 block mt-1 font-mono">
                  {currentOrder.createdAt}
                </span>
              </div>
            </div>

            {/* Service & Device Info */}
            <div className="bg-white/10 backdrop-blur-xs rounded-2xl p-3 border border-white/10 flex items-center justify-between text-xs relative z-10">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white">
                  <Smartphone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-extrabold text-white">
                    {currentOrder.brand} {currentOrder.model}
                  </h4>
                  <p className="text-[11px] text-sky-200">
                    {lang === 'ar' ? currentOrder.problemNameAr : currentOrder.problemNameFr}
                  </p>
                </div>
              </div>

              <div className="text-end">
                <span className="text-[10px] font-bold text-slate-300 block">
                  {currentOrder.serviceType === 'at_home'
                    ? lang === 'ar' ? 'إصلاح منزلي' : 'À domicile'
                    : currentOrder.serviceType === 'parts_delivery'
                    ? lang === 'ar' ? 'توصيل قطعة' : 'Livraison pièce'
                    : lang === 'ar' ? 'استلام وإرجاع' : 'Collecte & retour'}
                </span>
                <span className="text-[11px] font-black text-sky-300 font-mono">
                  {(currentOrder.finalPrice ?? currentOrder.estimatedTotal ?? 0).toLocaleString()} دج
                </span>
              </div>
            </div>

            {/* Customer notification notice */}
            {currentOrder.technicianNotes && (
              <div className="bg-blue-950/70 border border-blue-800/80 rounded-xl p-2.5 text-[11px] text-sky-200 flex items-start gap-2 relative z-10">
                <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <p className="leading-relaxed">{currentOrder.technicianNotes}</p>
              </div>
            )}
          </div>

          {/* If service is "Collecte et retour", show dedicated Delivery & Pickup Card */}
          {isPickupAndReturn && currentOrder.pickupDeliveryDetails && (
            <div className="bg-white rounded-3xl p-4.5 border border-blue-200/90 shadow-xs space-y-3 animate-in fade-in">
              <div className="flex items-center justify-between">
                <h3 className="font-extrabold text-xs text-blue-950 flex items-center gap-1.5">
                  <Truck className="w-4 h-4 text-blue-600" />
                  <span>{lang === 'ar' ? 'تفاصيل استلام وإرجاع الهاتف' : 'Détails Collecte et Retour'}</span>
                </h3>
                <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                  9 مراحل تتبع
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {/* Driver Status without personal details */}
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-[10px] text-slate-500 block mb-0.5">
                    {lang === 'ar' ? 'حالة التوصيل والاستلام:' : 'Statut de livraison :'}
                  </span>
                  <p className="font-bold text-slate-900 text-xs">
                    {currentOrder.assignedCourierId || currentOrder.pickupDeliveryDetails?.assignedDriver ? (
                      <span className="text-emerald-700 inline-flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        <span>
                          {currentOrder.status === 'COURIER_ON_WAY' || currentOrder.status === 'TECHNICIAN_ON_WAY' || currentOrder.status === 'COURIER_RETURNING' || currentOrder.pickupDeliveryDetails?.pickupSubStatus === 'DRIVER_ON_WAY' || currentOrder.pickupDeliveryDetails?.pickupSubStatus === 'DRIVER_RETURNING'
                            ? (lang === 'ar' ? 'عامل التوصيل في الطريق' : 'Le livreur est en route')
                            : (lang === 'ar' ? 'تم تعيين عامل توصيل لطلبك' : 'Un livreur a été assigné à votre commande')}
                        </span>
                      </span>
                    ) : (
                      <span className="text-slate-500">
                        {lang === 'ar' ? 'في انتظار تعيين عامل التوصيل' : 'En attente d\'assignation'}
                      </span>
                    )}
                  </p>
                </div>

                {/* Timing */}
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-[10px] text-slate-500 block mb-0.5">
                    {lang === 'ar' ? 'وقت الاستلام المحدد:' : 'Créneau horaire :'}
                  </span>
                  <p className="font-bold text-slate-900 font-mono">
                    {currentOrder.preferredDate} ({currentOrder.preferredTime})
                  </p>
                </div>

                {/* Pickup Address */}
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 sm:col-span-2">
                  <span className="text-[10px] text-slate-500 block mb-0.5">
                    {lang === 'ar' ? 'عنوان الاستلام والإرجاع:' : 'Adresse de collecte / retour :'}
                  </span>
                  <p className="font-bold text-slate-800 flex items-start gap-1">
                    <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
                    <span>{currentOrder.address} ({currentOrder.commune})</span>
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Timeline Card */}
          <div className="bg-white rounded-3xl p-4.5 border border-slate-200/90 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-xs text-slate-900 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-blue-600" />
                <span>{lang === 'ar' ? 'مراحل تنفيذ الطلب خطوة بخطوة' : 'Étapes de traitement'}</span>
              </h3>
              <span className="text-[10px] text-slate-400 font-mono">
                The Fix Point Oran
              </span>
            </div>

            {/* Stepper list */}
            <div className="relative ps-3 space-y-4">
              {timelineSteps.map((step, index) => {
                const isLast = index === timelineSteps.length - 1;

                return (
                  <div key={step.status} className="relative flex items-start gap-3">
                    {/* Vertical Connector Line */}
                    {!isLast && (
                      <div
                        className={`absolute top-6 start-3 -translate-x-1/2 w-0.5 h-full ${
                          step.isCompleted ? 'bg-blue-600' : 'bg-slate-200'
                        }`}
                      ></div>
                    )}

                    {/* Step Icon Badge */}
                    <div
                      className={`relative z-10 w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-xs font-bold transition-all ${
                        step.isCompleted
                          ? 'bg-blue-600 text-white shadow-xs'
                          : step.isCurrent
                          ? 'bg-blue-600 text-white ring-4 ring-blue-100 animate-pulse'
                          : 'bg-slate-100 text-slate-400 border border-slate-200'
                      }`}
                    >
                      {step.isCompleted ? (
                        <CheckCircle2 className="w-4 h-4" />
                      ) : (
                        <span className="text-[10px]">{index + 1}</span>
                      )}
                    </div>

                    {/* Step Text */}
                    <div className="flex-1 pb-1">
                      <div className="flex items-center justify-between">
                        <h4
                          className={`text-xs font-bold ${
                            step.isCurrent
                              ? 'text-blue-700 font-extrabold text-sm'
                              : step.isCompleted
                              ? 'text-slate-900'
                              : 'text-slate-400'
                          }`}
                        >
                          {lang === 'ar' ? step.titleAr : step.titleFr}
                        </h4>
                        {step.isCurrent && (
                          <span className="text-[9px] font-extrabold bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                            {lang === 'ar' ? 'المرحلة الحالية' : 'En cours'}
                          </span>
                        )}
                      </div>

                      <p
                        className={`text-[11px] mt-0.5 leading-relaxed ${
                          step.isCurrent ? 'text-slate-700 font-medium' : 'text-slate-500'
                        }`}
                      >
                        {lang === 'ar' ? step.descAr : step.descFr}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Pricing & Cash On Delivery Guarantee Card */}
          <div className="bg-white rounded-3xl p-4.5 border border-slate-200/90 shadow-xs space-y-3">
            <h3 className="font-extrabold text-xs text-slate-900 flex items-center gap-1.5">
              <DollarSign className="w-4 h-4 text-blue-600" />
              <span>{lang === 'ar' ? 'تفاصيل الحساب وطريقة الدفع' : 'Tarification et Paiement'}</span>
            </h3>

            <div className="space-y-2 text-xs divide-y divide-slate-100">
              <div className="flex items-center justify-between pt-1">
                <span className="text-slate-500">{lang === 'ar' ? 'سعر القطعة الأصلية:' : 'Prix de la pièce :'}</span>
                <span className="font-bold text-slate-800 font-mono">
                  {currentOrder.partPrice ? `${currentOrder.partPrice.toLocaleString()} دج` : (lang === 'ar' ? 'يحدد بعد الفحص' : 'Après diagnostic')}
                </span>
              </div>

              <div className="flex items-center justify-between pt-1.5">
                <span className="text-slate-500">{lang === 'ar' ? 'اليد العاملة (التركيب):' : 'Main d\'œuvre :'}</span>
                <span className="font-bold text-slate-800 font-mono">
                  {currentOrder.laborFee ? `${currentOrder.laborFee.toLocaleString()} دج` : (lang === 'ar' ? 'مضمنة' : 'Incluse')}
                </span>
              </div>

              <div className="flex items-center justify-between pt-1.5">
                <span className="text-slate-500">{lang === 'ar' ? 'تكلفة التنقل (وهران):' : 'Frais de déplacement :'}</span>
                <span className="font-bold text-slate-800 font-mono">
                  {currentOrder.travelFee.toLocaleString()} دج
                </span>
              </div>

              {Boolean(currentOrder.discount) && (
                <div className="flex items-center justify-between pt-1.5">
                  <span className="text-emerald-700 font-bold">{lang === 'ar' ? 'الخصم المطبق:' : 'Réduction :'}</span>
                  <span className="font-bold text-emerald-600 font-mono">
                    -{currentOrder.discount.toLocaleString()} دج
                  </span>
                </div>
              )}

              <div className="flex items-center justify-between pt-2.5 text-sm">
                <span className="font-black text-slate-900">
                  {currentOrder.finalPrice !== null && currentOrder.finalPrice !== undefined
                    ? (lang === 'ar' ? 'المبلغ النهائي الواجب دفعه:' : 'Total Final :') 
                    : (lang === 'ar' ? 'المجموع التقريبي:' : 'Total Estimé :')}
                </span>
                <span className="font-black text-blue-700 font-mono text-base">
                  {currentOrder.finalPrice !== null && currentOrder.finalPrice !== undefined
                    ? `${currentOrder.finalPrice.toLocaleString()} دج`
                    : currentOrder.estimatedTotal !== null && currentOrder.estimatedTotal !== undefined
                    ? `${currentOrder.estimatedTotal.toLocaleString()} دج`
                    : (lang === 'ar' ? 'يحدد بعد التشخيص' : 'Sur diagnostic')}
                </span>
              </div>
            </div>

            {/* No Online Pay Banner */}
            <div className="bg-blue-50 border border-blue-200/80 rounded-2xl p-3 text-[11px] text-blue-900 leading-relaxed flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0" />
              <p>
                <strong>{lang === 'ar' ? 'الدفع نقداً فقط (Cash):' : 'Paiement en espèces :'}</strong>{' '}
                {lang === 'ar'
                  ? 'الدفع يكون عند وصول التقني أو عند تسليم الهاتف بعد الفحص والتجربة الكاملة مع الضمان.'
                  : 'Le règlement s\'effectue à la livraison après vérification et remise de la garantie.'}
              </p>
            </div>
          </div>

          {/* Quick Direct Help Actions */}
          <div className="grid grid-cols-2 gap-2.5">
            <a
              href="tel:0549994001"
              className="py-3 px-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-blue-600/20 active:scale-95 transition-all"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>{lang === 'ar' ? 'اتصل بـ The Fix Point' : 'Appeler l\'atelier'}</span>
            </a>

            <a
              href={`https://wa.me/213549994001?text=Bonjour,%20concernant%20ma%20demande%20${currentOrder.id}%20(${currentOrder.brand}%20${currentOrder.model})`}
              target="_blank"
              rel="noreferrer"
              className="py-3 px-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-emerald-600/20 active:scale-95 transition-all"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </a>
          </div>
        </>
      )}
    </div>
  );
};
