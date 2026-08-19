import React, { useState, useEffect } from 'react';
import { CourierUser, RepairRequest, OrderStatus } from '../../types';
import { OrderService, STATUS_METADATA, subscribeToOrders } from '../../services/orderService';
import { CourierService, subscribeToCouriers } from '../../services/courierService';
import { ProofOfPickupModal } from './ProofOfPickupModal';
import { ProofOfDeliveryModal } from './ProofOfDeliveryModal';
import { CourierProfile } from './CourierProfile';
import { useLanguage } from '../../context/LanguageContext';
import { 
  Truck, Phone, MapPin, Navigation, CheckCircle2, 
  Clock, Package, Camera, Banknote, User, LogOut, 
  RotateCw, ChevronRight, MessageCircle, AlertCircle, 
  Filter, Smartphone, Sparkles, Check, ArrowRight
} from 'lucide-react';

interface CourierDashboardProps {
  courier: CourierUser;
  onLogout: () => void;
}

type CourierTab = 'tasks' | 'profile';
type FilterType = 'all' | 'pickup' | 'return' | 'completed';

export const CourierDashboard: React.FC<CourierDashboardProps> = ({
  courier,
  onLogout,
}) => {
  const { lang, isRtl } = useLanguage();
  const [activeTab, setActiveTab] = useState<CourierTab>('tasks');
  const [filter, setFilter] = useState<FilterType>('all');
  const [orders, setOrders] = useState<RepairRequest[]>([]);
  const [selectedOrderForPickup, setSelectedOrderForPickup] = useState<RepairRequest | null>(null);
  const [selectedOrderForDelivery, setSelectedOrderForDelivery] = useState<RepairRequest | null>(null);
  const [refreshKey, setRefreshKey] = useState<number>(0);
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string | null>(null);

  // Load strictly courier-assigned orders
  useEffect(() => {
    const assigned = CourierService.getCourierAssignedOrders(courier.id);
    setOrders(assigned);
  }, [courier.id, refreshKey]);

  // Subscribe to order and courier changes
  useEffect(() => {
    const unsub = subscribeToOrders(() => {
      const assigned = CourierService.getCourierAssignedOrders(courier.id);
      setOrders(assigned);
    });
    return () => unsub();
  }, [courier.id]);

  const stats = CourierService.getCourierStats(courier.id);

  // Handle status update to "COURIER_ON_WAY"
  const handleMarkOnTheWay = (order: RepairRequest, type: 'pickup' | 'return') => {
    const newStatus: OrderStatus = type === 'pickup' ? 'COURIER_ON_WAY' : 'COURIER_RETURNING';
    const note = type === 'pickup' 
      ? `عامل التوصيل ${courier.name} في الطريق لاستلام الهاتف من الزبون`
      : `عامل التوصيل ${courier.name} في الطريق لإرجاع الهاتف بعد إتمام الصيانة`;

    OrderService.updateOrderStatus(order.id, newStatus, note, `courier:${courier.name}`);
    setActionSuccessMsg(type === 'pickup' ? 'تم تحديث الحالة: أنت في الطريق للاستلام' : 'تم تحديث الحالة: أنت في الطريق للإرجاع');
    setRefreshKey((prev) => prev + 1);
    setTimeout(() => setActionSuccessMsg(null), 4000);
  };

  // Submit Proof of Pickup
  const handleConfirmPickup = (data: {
    photoUrl?: string;
    conditionNotes: string;
    accessories: string[];
    customAccessories?: string;
    courierId: string;
    courierName: string;
  }) => {
    if (!selectedOrderForPickup) return;
    OrderService.submitProofOfPickup(selectedOrderForPickup.id, data);
    setSelectedOrderForPickup(null);
    setActionSuccessMsg(`تم توثيق استلام الهاتف بنجاح للطلب ${selectedOrderForPickup.id}`);
    setRefreshKey((prev) => prev + 1);
    setTimeout(() => setActionSuccessMsg(null), 4000);
  };

  // Submit Proof of Delivery
  const handleConfirmDelivery = (data: {
    photoUrl?: string;
    deliveryNotes: string;
    amountCollected: number;
    isCashCollected: boolean;
    isTestedWithCustomer: boolean;
    courierId: string;
    courierName: string;
  }) => {
    if (!selectedOrderForDelivery) return;
    OrderService.submitProofOfDelivery(selectedOrderForDelivery.id, data);
    setSelectedOrderForDelivery(null);
    setActionSuccessMsg(`تم تأكيد تسليم الهاتف بنجاح للطلب ${selectedOrderForDelivery.id}`);
    setRefreshKey((prev) => prev + 1);
    setTimeout(() => setActionSuccessMsg(null), 4000);
  };

  // Helper for opening Google Maps Navigation
  const handleOpenMaps = (order: RepairRequest) => {
    if (order.geoCoords) {
      window.open(`https://www.google.com/maps/dir/?api=1&destination=${order.geoCoords.lat},${order.geoCoords.lng}`, '_blank');
    } else {
      const addressQuery = encodeURIComponent(`${order.address}, ${order.commune}, Oran, Algeria`);
      window.open(`https://www.google.com/maps/search/?api=1&query=${addressQuery}`, '_blank');
    }
  };

  // Filter orders based on active tab filter
  const filteredOrders = orders.filter((order) => {
    if (filter === 'all') return true;
    if (filter === 'pickup') {
      return ['NEW', 'CONFIRMED', 'COURIER_ASSIGNED', 'COURIER_ON_WAY', 'TECHNICIAN_ON_WAY'].includes(order.status);
    }
    if (filter === 'return') {
      return ['READY_FOR_RETURN', 'COURIER_RETURNING', 'READY'].includes(order.status);
    }
    if (filter === 'completed') {
      return order.status === 'DELIVERED';
    }
    return true;
  });

  return (
    <div id="courier-dashboard" className="min-h-screen bg-slate-100 text-slate-900 pb-20">
      {/* Top Courier Navigation Header */}
      <header className="sticky top-0 z-40 bg-slate-900 text-white shadow-md">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-black shadow-md shadow-amber-500/20">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-black text-white">{courier.name}</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              </div>
              <span className="text-[10px] text-slate-300 font-mono" dir="ltr">{courier.phoneNumber}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setRefreshKey((prev) => prev + 1)}
              title="تحديث البيانات"
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 cursor-pointer transition-all active:rotate-180 duration-300"
            >
              <RotateCw className="w-4 h-4" />
            </button>

            <button
              onClick={onLogout}
              className="py-1.5 px-3 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 text-xs font-bold flex items-center gap-1 cursor-pointer transition-all"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>خروج</span>
            </button>
          </div>
        </div>

        {/* Tab Switcher (Tasks vs Profile) */}
        <div className="max-w-4xl mx-auto px-4 flex border-t border-slate-800">
          <button
            onClick={() => setActiveTab('tasks')}
            className={`flex-1 py-2.5 text-center text-xs font-extrabold border-b-2 transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'tasks'
                ? 'border-amber-400 text-amber-300 bg-white/5'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>مهامي المعينة ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`flex-1 py-2.5 text-center text-xs font-extrabold border-b-2 transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'profile'
                ? 'border-amber-400 text-amber-300 bg-white/5'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <User className="w-4 h-4" />
            <span>حسابي وإحصائياتي</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-4xl mx-auto px-3.5 py-4">
        {actionSuccessMsg && (
          <div className="mb-4 bg-emerald-600 text-white p-3 rounded-2xl shadow-lg flex items-center gap-2 text-xs font-bold animate-in fade-in slide-in-from-top duration-200">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{actionSuccessMsg}</span>
          </div>
        )}

        {activeTab === 'profile' ? (
          <CourierProfile
            courier={courier}
            onLogout={onLogout}
            onNavigateToTasks={() => setActiveTab('tasks')}
          />
        ) : (
          <div className="space-y-4">
            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-3 gap-2.5">
              <div className="bg-white border border-slate-200/90 rounded-2xl p-3 shadow-xs">
                <span className="text-[10px] font-bold text-slate-500 block">طلبات اليوم</span>
                <span className="text-base font-black text-slate-900 font-mono">{stats.today}</span>
              </div>

              <div className="bg-blue-50/80 border border-blue-200 rounded-2xl p-3 shadow-xs">
                <span className="text-[10px] font-bold text-blue-700 block">قيد التنفيذ</span>
                <span className="text-base font-black text-blue-900 font-mono">{stats.inProgress}</span>
              </div>

              <div className="bg-emerald-50/80 border border-emerald-200 rounded-2xl p-3 shadow-xs">
                <span className="text-[10px] font-bold text-emerald-700 block">طلبات مكتملة</span>
                <span className="text-base font-black text-emerald-900 font-mono">{stats.completed}</span>
              </div>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
              <button
                type="button"
                onClick={() => setFilter('all')}
                className={`py-1.5 px-3 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all cursor-pointer ${
                  filter === 'all'
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                الكل ({orders.length})
              </button>

              <button
                type="button"
                onClick={() => setFilter('pickup')}
                className={`py-1.5 px-3 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1 ${
                  filter === 'pickup'
                    ? 'bg-purple-700 text-white shadow-sm'
                    : 'bg-white text-purple-800 border border-purple-200 hover:bg-purple-50'
                }`}
              >
                <span>استلام هاتف</span>
                <span className="bg-purple-100 text-purple-900 text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                  {stats.pickupTasks}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setFilter('return')}
                className={`py-1.5 px-3 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1 ${
                  filter === 'return'
                    ? 'bg-blue-700 text-white shadow-sm'
                    : 'bg-white text-blue-800 border border-blue-200 hover:bg-blue-50'
                }`}
              >
                <span>إرجاع هاتف</span>
                <span className="bg-blue-100 text-blue-900 text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                  {stats.returnTasks}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setFilter('completed')}
                className={`py-1.5 px-3 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all cursor-pointer ${
                  filter === 'completed'
                    ? 'bg-emerald-700 text-white shadow-sm'
                    : 'bg-white text-emerald-800 border border-emerald-200 hover:bg-emerald-50'
                }`}
              >
                مكتملة ({stats.completed})
              </button>
            </div>

            {/* Orders List */}
            {filteredOrders.length === 0 ? (
              <div className="bg-white rounded-3xl p-8 text-center border border-slate-200 shadow-xs space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                  <Package className="w-6 h-6" />
                </div>
                <h3 className="font-extrabold text-slate-800 text-sm">لا توجد طلبات معينة في هذا القسم</h3>
                <p className="text-xs text-slate-500 max-w-xs mx-auto">
                  ستظهر الطلبات هنا فور تعيينها لك من قبل إدارة The Fix Point.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredOrders.map((order) => {
                  const meta = STATUS_METADATA[order.status] || STATUS_METADATA.NEW;
                  
                  // Determine task type: Pickup vs Return
                  const isPickupTask = ['NEW', 'CONFIRMED', 'COURIER_ASSIGNED', 'COURIER_ON_WAY', 'TECHNICIAN_ON_WAY'].includes(order.status);
                  const isReturnTask = ['READY_FOR_RETURN', 'COURIER_RETURNING', 'READY'].includes(order.status);
                  const isDelivered = order.status === 'DELIVERED';
                  const totalDue = order.finalPrice || order.estimatedTotal || 0;

                  return (
                    <div
                      key={order.id}
                      className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-4 space-y-3 transition-all hover:border-slate-300"
                    >
                      {/* Top Row: Order ID, Task Badge, Status Badge */}
                      <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-2.5">
                        <div className="flex items-center gap-2">
                          <span className="font-black text-slate-900 font-mono text-sm">{order.id}</span>
                          
                          {isPickupTask && (
                            <span className="bg-purple-100 text-purple-900 font-extrabold text-[10px] px-2 py-0.5 rounded-md border border-purple-200">
                              مهمة استلام
                            </span>
                          )}
                          {isReturnTask && (
                            <span className="bg-blue-100 text-blue-900 font-extrabold text-[10px] px-2 py-0.5 rounded-md border border-blue-200">
                              مهمة إرجاع للزبون
                            </span>
                          )}
                          {isDelivered && (
                            <span className="bg-emerald-100 text-emerald-900 font-extrabold text-[10px] px-2 py-0.5 rounded-md border border-emerald-200">
                              تم التسليم
                            </span>
                          )}
                        </div>

                        <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border ${meta.badgeBg} ${meta.badgeText}`}>
                          {meta.labelAr}
                        </span>
                      </div>

                      {/* Customer & Location */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        {/* Customer & Phone */}
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5 text-slate-800">
                            <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span className="font-extrabold">{order.customerName}</span>
                          </div>

                          <div className="flex items-center gap-2" dir="ltr">
                            <a
                              href={`tel:${order.phoneNumber.replace(/\s+/g, '')}`}
                              className="text-xs font-bold text-blue-600 hover:text-blue-800 font-mono flex items-center gap-1 bg-blue-50 px-2 py-0.5 rounded-lg border border-blue-200"
                            >
                              <Phone className="w-3 h-3" />
                              <span>{order.phoneNumber}</span>
                            </a>

                            <a
                              href={`https://wa.me/213${order.phoneNumber.replace(/^0/, '').replace(/\s+/g, '')}`}
                              target="_blank"
                              rel="noreferrer"
                              className="p-1 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200"
                              title="مراسلة عبر واتساب"
                            >
                              <MessageCircle className="w-3.5 h-3.5" />
                            </a>
                          </div>
                        </div>

                        {/* Address & Navigation */}
                        <div className="space-y-1">
                          <div className="flex items-start gap-1.5 text-slate-700">
                            <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
                            <div>
                              <span className="font-bold text-slate-900 block">{order.commune}</span>
                              <span className="text-[11px] text-slate-600 block">{order.address}</span>
                              {order.locationInstructions && (
                                <span className="text-[10px] text-amber-700 block italic">({order.locationInstructions})</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Phone Brand, Model, Problem */}
                      <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-2.5 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <Smartphone className="w-4 h-4 text-slate-500" />
                          <div>
                            <span className="font-extrabold text-slate-900">{order.brand} {order.model}</span>
                            <span className="text-slate-500 text-[11px] block">{order.problemNameAr}</span>
                          </div>
                        </div>

                        {/* Preferred Time */}
                        <div className="text-end text-[11px]">
                          <span className="text-slate-400 block">الموعد:</span>
                          <span className="font-bold text-slate-700 font-mono">{order.preferredDate} ({order.preferredTime})</span>
                        </div>
                      </div>

                      {/* Cash to collect preview if in return stage */}
                      {isReturnTask && (
                        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-2 flex items-center justify-between text-xs">
                          <div className="flex items-center gap-1.5 text-emerald-900 font-bold">
                            <Banknote className="w-4 h-4 text-emerald-700" />
                            <span>المبلغ المطلوب تحصيله كاش عند التسليم:</span>
                          </div>
                          <span className="font-black text-emerald-800 text-sm font-mono">
                            {totalDue.toLocaleString()} دج
                          </span>
                        </div>
                      )}

                      {/* Proof of Pickup info if already recorded */}
                      {order.proofOfPickup && (
                        <div className="bg-purple-50/70 border border-purple-200 rounded-xl p-2 text-[11px] text-purple-950 space-y-1">
                          <div className="flex items-center justify-between font-bold">
                            <span className="flex items-center gap-1">
                              <Camera className="w-3.5 h-3.5 text-purple-700" />
                              <span>تم توثيق الاستلام في ({order.proofOfPickup.timestamp})</span>
                            </span>
                            <span className="text-purple-700 text-[10px]">بواسطة {order.proofOfPickup.courierName}</span>
                          </div>
                          <p className="text-[10px] text-purple-900">
                            الحالة: {order.proofOfPickup.conditionNotes} • الملحقات: {order.proofOfPickup.accessories.join(', ')}
                          </p>
                        </div>
                      )}

                      {/* Proof of Delivery info if delivered */}
                      {order.proofOfDelivery && (
                        <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-2 text-[11px] text-emerald-950 space-y-1">
                          <div className="flex items-center justify-between font-bold">
                            <span className="flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                              <span>تم التسليم بنجاح ({order.proofOfDelivery.timestamp})</span>
                            </span>
                            <span className="text-emerald-700 font-mono text-[10px]">المبلغ: {order.proofOfDelivery.amountCollected.toLocaleString()} دج</span>
                          </div>
                          <p className="text-[10px] text-emerald-800">
                            {order.proofOfDelivery.deliveryNotes}
                          </p>
                        </div>
                      )}

                      {/* Action Bar */}
                      <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                        {/* Location Link Button */}
                        <button
                          type="button"
                          onClick={() => handleOpenMaps(order)}
                          className="py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all"
                        >
                          <Navigation className="w-3.5 h-3.5 text-blue-600" />
                          <span>فتح الموقع في الخريطة</span>
                        </button>

                        {/* Workflow Action Buttons */}
                        <div className="flex items-center gap-1.5 ms-auto">
                          {/* 1. Pickup Stage Actions */}
                          {order.status === 'COURIER_ASSIGNED' || order.status === 'CONFIRMED' ? (
                            <button
                              type="button"
                              onClick={() => handleMarkOnTheWay(order, 'pickup')}
                              className="py-2 px-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold flex items-center gap-1.5 shadow-sm active:scale-95 transition-all cursor-pointer"
                            >
                              <Truck className="w-3.5 h-3.5" />
                              <span>أنا في الطريق للاستلام</span>
                            </button>
                          ) : null}

                          {order.status === 'COURIER_ON_WAY' || order.status === 'TECHNICIAN_ON_WAY' ? (
                            <button
                              type="button"
                              onClick={() => setSelectedOrderForPickup(order)}
                              className="py-2 px-3.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-extrabold flex items-center gap-1.5 shadow-sm shadow-purple-600/20 active:scale-95 transition-all cursor-pointer"
                            >
                              <Camera className="w-3.5 h-3.5" />
                              <span>توثيق واستلام الهاتف</span>
                            </button>
                          ) : null}

                          {/* 2. Return Stage Actions */}
                          {order.status === 'READY_FOR_RETURN' || order.status === 'READY' ? (
                            <button
                              type="button"
                              onClick={() => handleMarkOnTheWay(order, 'return')}
                              className="py-2 px-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold flex items-center gap-1.5 shadow-sm active:scale-95 transition-all cursor-pointer"
                            >
                              <Truck className="w-3.5 h-3.5" />
                              <span>أنا في طريق الإرجاع للزبون</span>
                            </button>
                          ) : null}

                          {order.status === 'COURIER_RETURNING' ? (
                            <button
                              type="button"
                              onClick={() => setSelectedOrderForDelivery(order)}
                              className="py-2 px-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold flex items-center gap-1.5 shadow-sm shadow-emerald-600/20 active:scale-95 transition-all cursor-pointer"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>توثيق وتأكيد التسليم</span>
                            </button>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Proof of Pickup Modal */}
      {selectedOrderForPickup && (
        <ProofOfPickupModal
          order={selectedOrderForPickup}
          courierId={courier.id}
          courierName={courier.name}
          onClose={() => setSelectedOrderForPickup(null)}
          onConfirm={handleConfirmPickup}
        />
      )}

      {/* Proof of Delivery Modal */}
      {selectedOrderForDelivery && (
        <ProofOfDeliveryModal
          order={selectedOrderForDelivery}
          courierId={courier.id}
          courierName={courier.name}
          onClose={() => setSelectedOrderForDelivery(null)}
          onConfirm={handleConfirmDelivery}
        />
      )}
    </div>
  );
};
