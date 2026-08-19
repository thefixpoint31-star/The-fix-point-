import React, { useState, useEffect, useMemo } from 'react';
import { RepairRequest, OrderStatus, PickupSubStatus, ServiceType, PickupDeliveryDetails, CourierUser } from '../../types';
import { OrderService, subscribeToOrders, STATUS_METADATA, PICKUP_SUB_STATUSES } from '../../services/orderService';
import { CourierService, subscribeToCouriers } from '../../services/courierService';
import { useLanguage } from '../../context/LanguageContext';
import { TheFixPointLogo } from '../TheFixPointLogo';
import { 
  Search, Phone, MessageCircle, MapPin, Navigation, 
  Wrench, CheckCircle2, Clock, Truck, ShieldAlert, 
  Sparkles, RefreshCw, X, Edit3, Save, Check, 
  ChevronDown, ChevronUp, AlertCircle, ArrowLeft, ArrowRight,
  DollarSign, FileText, User, Smartphone, Plus, Layers, LogOut,
  Send, ExternalLink, Calendar, KeyRound, Trash2, Power, UserPlus
} from 'lucide-react';

interface AdminDashboardProps {
  onExitAdmin: () => void;
  onTrackOrderInCustomerView: (orderId: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onExitAdmin,
  onTrackOrderInCustomerView,
}) => {
  const { lang, isRtl } = useLanguage();
  const [adminViewSection, setAdminViewSection] = useState<'orders' | 'couriers'>('orders');
  const [orders, setOrders] = useState<RepairRequest[]>([]);
  const [couriers, setCouriers] = useState<CourierUser[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<RepairRequest | null>(null);
  const [activeTabFilter, setActiveTabFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Couriers Management state
  const [isAddCourierModalOpen, setIsAddCourierModalOpen] = useState(false);
  const [selectedCourierForOrders, setSelectedCourierForOrders] = useState<CourierUser | null>(null);
  const [newCourierName, setNewCourierName] = useState('');
  const [newCourierPhone, setNewCourierPhone] = useState('');
  const [newCourierPin, setNewCourierPin] = useState('');
  const [newCourierVehicle, setNewCourierVehicle] = useState<'moto' | 'car' | 'scooter'>('moto');
  const [newCourierPlate, setNewCourierPlate] = useState('');
  const [newCourierCommune, setNewCourierCommune] = useState('وهران وسط / بير الجير');

  // Edit state inside modal
  const [editingPrice, setEditingPrice] = useState<string>('');
  const [editingNotes, setEditingNotes] = useState<string>('');
  const [selectedCourierIdToAssign, setSelectedCourierIdToAssign] = useState<string>('');
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  const refreshData = () => {
    const list = OrderService.getAllOrders();
    setOrders(list);
    const couriersList = CourierService.getAllCouriers();
    setCouriers(couriersList);

    if (selectedOrder) {
      const updated = list.find((o) => o.id === selectedOrder.id);
      if (updated) {
        setSelectedOrder(updated);
        setEditingPrice((updated.finalPrice ?? updated.estimatedTotal ?? 0).toString());
        setEditingNotes(updated.internalNotes || '');
        setSelectedCourierIdToAssign(updated.assignedCourierId || '');
      }
    }
  };

  useEffect(() => {
    refreshData();
    const unsubOrders = subscribeToOrders(() => refreshData());
    const unsubCouriers = subscribeToCouriers(() => refreshData());
    return () => {
      unsubOrders();
      unsubCouriers();
    };
  }, []);

  const stats = useMemo(() => {
    return OrderService.getOrderStats();
  }, [orders]);

  // Filtered orders
  const filteredOrders = useMemo(() => {
    let result = [...orders];

    // If viewing orders of a specific courier
    if (selectedCourierForOrders) {
      result = result.filter((o) => o.assignedCourierId === selectedCourierForOrders.id);
    }

    // Status Tab Filter
    if (activeTabFilter === 'NEW') {
      result = result.filter((o) => o.status === 'NEW');
    } else if (activeTabFilter === 'IN_REPAIR') {
      result = result.filter((o) =>
        ['CONFIRMED', 'COURIER_ASSIGNED', 'COURIER_ON_WAY', 'TECHNICIAN_ON_WAY', 'PHONE_PICKED_UP', 'RECEIVED_AT_WORKSHOP', 'DIAGNOSIS', 'REPAIRING', 'READY_FOR_RETURN', 'COURIER_RETURNING'].includes(o.status)
      );
    } else if (activeTabFilter === 'READY') {
      result = result.filter((o) => o.status === 'READY' || o.status === 'READY_FOR_RETURN');
    } else if (activeTabFilter === 'DELIVERED') {
      result = result.filter((o) => o.status === 'DELIVERED');
    } else if (activeTabFilter === 'CANCELLED') {
      result = result.filter((o) => o.status === 'CANCELLED');
    }

    // Search Query (Order ID or Phone Number or Customer Name)
    if (searchQuery.trim()) {
      const query = searchQuery.trim().toLowerCase();
      result = result.filter(
        (o) =>
          o.id.toLowerCase().includes(query) ||
          o.phoneNumber.replace(/\s+/g, '').includes(query.replace(/\s+/g, '')) ||
          o.customerName.toLowerCase().includes(query) ||
          o.model.toLowerCase().includes(query) ||
          (o.assignedCourierName && o.assignedCourierName.toLowerCase().includes(query))
      );
    }

    return result;
  }, [orders, activeTabFilter, searchQuery, selectedCourierForOrders]);

  const handleOpenOrderDetails = (order: RepairRequest) => {
    setSelectedOrder(order);
    setEditingPrice((order.finalPrice ?? order.estimatedTotal ?? 0).toString());
    setEditingNotes(order.internalNotes || '');
    setSelectedCourierIdToAssign(order.assignedCourierId || '');
    setSaveSuccessMsg(null);
  };

  const handleUpdateStatus = (newStatus: OrderStatus) => {
    if (!selectedOrder) return;
    const updated = OrderService.updateOrderStatus(
      selectedOrder.id,
      newStatus,
      `تم تحديث الحالة إلى ${STATUS_METADATA[newStatus]?.labelAr || newStatus} من لوحة الإدارة`,
      'admin'
    );
    if (updated) {
      setSelectedOrder(updated);
      showTemporarySuccess('تم تحديث الحالة بنجاح وإرسال الإشعار للزبون!');
    }
  };

  const handleUpdatePickupSubStatus = (subStatus: PickupSubStatus) => {
    if (!selectedOrder) return;
    const updated = OrderService.updatePickupSubStatus(selectedOrder.id, subStatus);
    if (updated) {
      setSelectedOrder(updated);
      showTemporarySuccess('تم تحديث مرحلة الاستلام والإرجاع بنجاح!');
    }
  };

  const handleSavePrice = () => {
    if (!selectedOrder) return;
    const num = parseInt(editingPrice.replace(/[^\d]/g, ''), 10);
    if (!isNaN(num)) {
      const updated = OrderService.updateFinalPrice(selectedOrder.id, num, `تعديل السعر النهائي إلى ${num.toLocaleString()} دج`);
      if (updated) {
        setSelectedOrder(updated);
        showTemporarySuccess('تم حفظ السعر النهائي بنجاح!');
      }
    }
  };

  const handleAssignCourier = () => {
    if (!selectedOrder) return;
    if (!selectedCourierIdToAssign) {
      showTemporarySuccess('يرجى اختيار عامل توصيل من القائمة');
      return;
    }
    const courier = couriers.find((c) => c.id === selectedCourierIdToAssign);
    if (!courier) return;

    const updated = OrderService.assignCourier(
      selectedOrder.id,
      courier.id,
      courier.name,
      courier.phoneNumber,
      'admin'
    );
    if (updated) {
      setSelectedOrder(updated);
      showTemporarySuccess(`تم تعيين عامل التوصيل ${courier.name} بنجاح!`);
    }
  };

  const handleSaveNotes = () => {
    if (!selectedOrder) return;
    OrderService.updateInternalNotes(selectedOrder.id, editingNotes);
    showTemporarySuccess('تم حفظ الملاحظات بنجاح!');
  };

  // Create new courier
  const handleAddNewCourier = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCourierName.trim() || !newCourierPhone.trim() || !newCourierPin.trim()) return;

    CourierService.addCourier({
      name: newCourierName.trim(),
      phoneNumber: newCourierPhone.trim(),
      pin: newCourierPin.trim(),
      vehicleType: newCourierVehicle,
      vehiclePlate: newCourierPlate.trim() || undefined,
      commune: newCourierCommune.trim(),
      isActive: true,
    });

    setNewCourierName('');
    setNewCourierPhone('');
    setNewCourierPin('');
    setNewCourierPlate('');
    setIsAddCourierModalOpen(false);
    showTemporarySuccess('تمت إضافة عامل التوصيل الجديد بنجاح!');
  };

  const showTemporarySuccess = (msg: string) => {
    setSaveSuccessMsg(msg);
    setTimeout(() => {
      setSaveSuccessMsg(null);
    }, 3000);
  };

  // Quick Scenario Generator for Testing
  const handleCreateTestScenario = () => {
    const testOrder = OrderService.createOrder({
      customerName: 'محمد بن يحيى (وهران)',
      phoneNumber: '0555 11 22 33',
      serviceType: 'pickup_return',
      brand: 'Apple',
      model: 'iPhone 13',
      problemId: 'screen',
      problemNameAr: 'شاشة مكسورة',
      problemNameFr: 'Écran OLED Original',
      problemDescription: 'شاشة مكسورة بالكامل بعد السقوط، تم تأكيد السعر من الكتالوج 18,500 دج.',
      commune: 'عقيد لطفي (Akid Lotfi)',
      address: 'شارع طرابلس، وهران',
      locationInstructions: 'بجانب الصيدلية المركزية',
      preferredDate: 'اليوم',
      preferredTime: '15:00 - 17:00',
      partPrice: 12500,
      laborFee: 5000,
      travelFee: 2000,
      discount: 1000,
      estimatedTotal: 18500,
      finalPrice: 18500,
      geoCoords: { lat: 35.7065, lng: -0.6012 },
    });
    setSelectedOrder(testOrder);
    setEditingPrice('18500');
    setEditingNotes(testOrder.internalNotes || '');
    setSelectedCourierIdToAssign('');
    showTemporarySuccess(`تم إنشاء الطلب التجريبي ${testOrder.id} بنجاح!`);
  };

  return (
    <div id="admin-dashboard-container" className="space-y-4 pb-12 animate-in fade-in duration-200">
      {/* Top Admin Bar */}
      <div className="bg-slate-900 text-white rounded-3xl p-4.5 shadow-xl border border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-blue-600 flex items-center justify-center font-black text-white shadow-md shadow-blue-500/30">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-black tracking-wide text-white">لوحة تحكم THE FIX POINT</h2>
              <span className="text-[9px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded-full">
                مسؤول الإدارة
              </span>
              <span className="text-[9px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-full flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>سحابي Firebase</span>
              </span>
            </div>
            <p className="text-[11px] text-slate-400">إدارة الطلبات والأسعار وفريق التوصيل بوهران</p>
          </div>
        </div>

        {/* Navigation Section Tabs & Exit Button */}
        <div className="flex items-center gap-2">
          {/* Switch between Orders and Couriers */}
          <div className="bg-slate-800 p-1 rounded-2xl flex items-center border border-slate-700">
            <button
              onClick={() => {
                setAdminViewSection('orders');
                setSelectedCourierForOrders(null);
              }}
              className={`py-1.5 px-3 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1.5 ${
                adminViewSection === 'orders'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>الطلبات ({orders.length})</span>
            </button>

            <button
              onClick={() => setAdminViewSection('couriers')}
              className={`py-1.5 px-3 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1.5 ${
                adminViewSection === 'couriers'
                  ? 'bg-amber-500 text-slate-950 font-black shadow-sm'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Truck className="w-3.5 h-3.5" />
              <span>عمال التوصيل ({couriers.length})</span>
            </button>
          </div>

          {/* Exit Admin Mode */}
          <button
            id="btn-exit-admin"
            onClick={onExitAdmin}
            className="py-2 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
            title="الرجوع لواجهة الزبون"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>{lang === 'ar' ? 'واجهة الزبون' : 'Client'}</span>
          </button>
        </div>
      </div>

      {saveSuccessMsg && (
        <div className="bg-emerald-600 text-white px-4 py-2.5 rounded-2xl text-xs font-bold text-center flex items-center justify-center gap-1.5 shadow-md animate-in slide-in-from-top-2">
          <Check className="w-4 h-4" />
          <span>{saveSuccessMsg}</span>
        </div>
      )}

      {/* COURIERS MANAGEMENT VIEW */}
      {adminViewSection === 'couriers' ? (
        <div className="space-y-4">
          {/* Couriers Top Bar */}
          <div className="bg-white rounded-3xl p-4 border border-slate-200/90 shadow-xs flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="font-black text-sm text-slate-900 flex items-center gap-2">
                <Truck className="w-4 h-4 text-amber-600" />
                <span>إدارة عمال التوصيل (Couriers)</span>
              </h3>
              <p className="text-xs text-slate-500">إضافة وتفعيل ومتابعة مهام فريق التوصيل لخدمة استلام وإرجاع الأجهزة بوهران</p>
            </div>

            <button
              onClick={() => setIsAddCourierModalOpen(true)}
              className="py-2.5 px-4 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-md shadow-amber-500/20 active:scale-95 transition-all cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              <span>إضافة عامل توصيل جديد</span>
            </button>
          </div>

          {/* Couriers Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {couriers.map((c) => {
              const assignedOrders = CourierService.getCourierAssignedOrders(c.id);
              const cStats = CourierService.getCourierStats(c.id);

              return (
                <div
                  key={c.id}
                  className={`bg-white rounded-3xl p-4 border transition-all space-y-3 ${
                    c.isActive ? 'border-slate-200/90 shadow-xs hover:border-blue-300' : 'border-rose-200 bg-rose-50/20 opacity-80'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-black text-sm shadow-md">
                        {c.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-extrabold text-xs text-slate-900">{c.name}</h4>
                        <span className="text-[11px] text-blue-700 font-mono block" dir="ltr">{c.phoneNumber}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        CourierService.toggleCourierActive(c.id);
                        refreshData();
                      }}
                      className={`p-1.5 rounded-xl border text-[10px] font-extrabold flex items-center gap-1 cursor-pointer transition-all ${
                        c.isActive
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200'
                          : 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200'
                      }`}
                      title={c.isActive ? 'تعطيل الحساب' : 'تفعيل الحساب'}
                    >
                      <Power className="w-3 h-3" />
                      <span>{c.isActive ? 'نشط' : 'معطل'}</span>
                    </button>
                  </div>

                  <div className="bg-slate-50 rounded-2xl p-2.5 text-[11px] space-y-1 text-slate-700">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">المركبة:</span>
                      <span className="font-bold text-slate-900">
                        {c.vehicleType === 'moto' ? 'دراجة نارية (Moto)' : c.vehicleType === 'car' ? 'سيارة' : 'سكوتر'} • {c.vehiclePlate || '18492-116-31'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">نطاق التغطية:</span>
                      <span className="font-bold text-slate-800">{c.commune}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">رمز PIN الدخول:</span>
                      <span className="font-mono font-bold text-slate-900 bg-white px-2 py-0.5 rounded-md border border-slate-200">
                        {c.pin}
                      </span>
                    </div>
                  </div>

                  {/* Tasks Counters */}
                  <div className="grid grid-cols-2 gap-2 text-center text-xs">
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-2">
                      <span className="text-base font-black text-blue-900 block font-mono">{cStats.inProgress}</span>
                      <span className="text-[10px] text-blue-700 font-bold">مهام قيد التنفيذ</span>
                    </div>

                    <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-2">
                      <span className="text-base font-black text-emerald-900 block font-mono">{cStats.completed}</span>
                      <span className="text-[10px] text-emerald-700 font-bold">تسليمات ناجحة</span>
                    </div>
                  </div>

                  {/* Filter Orders by this Courier */}
                  <button
                    onClick={() => {
                      setSelectedCourierForOrders(c);
                      setAdminViewSection('orders');
                      setActiveTabFilter('ALL');
                    }}
                    className="w-full py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Layers className="w-3.5 h-3.5 text-blue-600" />
                    <span>عرض طلبات {c.name.split(' ')[0]} ({assignedOrders.length})</span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* ORDERS MANAGEMENT VIEW */
        <div className="space-y-4">
          {/* Active Courier Filter Banner if active */}
          {selectedCourierForOrders && (
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-3 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-blue-700" />
                <span>عرض الطلبات المعينة للعامل: <strong>{selectedCourierForOrders.name}</strong></span>
              </div>
              <button
                onClick={() => setSelectedCourierForOrders(null)}
                className="py-1 px-2.5 rounded-lg bg-white border border-blue-300 text-blue-800 font-bold text-[11px] hover:bg-blue-100 cursor-pointer"
              >
                عرض كل الطلبات
              </button>
            </div>
          )}

          {/* 4 Stats Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <button
              onClick={() => setActiveTabFilter('NEW')}
              className={`p-3.5 rounded-2xl border text-start transition-all cursor-pointer ${
                activeTabFilter === 'NEW'
                  ? 'bg-amber-500 text-white border-amber-600 shadow-md shadow-amber-500/20 scale-[1.02]'
                  : 'bg-white border-slate-200/90 text-slate-800 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className={`text-[11px] font-bold ${activeTabFilter === 'NEW' ? 'text-amber-100' : 'text-slate-500'}`}>
                  طلبات جديدة
                </span>
                <Sparkles className={`w-4 h-4 ${activeTabFilter === 'NEW' ? 'text-white' : 'text-amber-500'}`} />
              </div>
              <p className="text-2xl font-black font-mono">{stats.newOrders}</p>
              <span className={`text-[10px] ${activeTabFilter === 'NEW' ? 'text-amber-100' : 'text-slate-400'}`}>
                تحتاج تعيين وتأكيد
              </span>
            </button>

            <button
              onClick={() => setActiveTabFilter('IN_REPAIR')}
              className={`p-3.5 rounded-2xl border text-start transition-all cursor-pointer ${
                activeTabFilter === 'IN_REPAIR'
                  ? 'bg-blue-600 text-white border-blue-700 shadow-md shadow-blue-600/20 scale-[1.02]'
                  : 'bg-white border-slate-200/90 text-slate-800 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className={`text-[11px] font-bold ${activeTabFilter === 'IN_REPAIR' ? 'text-blue-100' : 'text-slate-500'}`}>
                  قيد التنفيذ / التوصيل
                </span>
                <Wrench className={`w-4 h-4 ${activeTabFilter === 'IN_REPAIR' ? 'text-white' : 'text-blue-600'}`} />
              </div>
              <p className="text-2xl font-black font-mono">{stats.inRepair}</p>
              <span className={`text-[10px] ${activeTabFilter === 'IN_REPAIR' ? 'text-blue-100' : 'text-slate-400'}`}>
                مع السائق أو بالورشة
              </span>
            </button>

            <button
              onClick={() => setActiveTabFilter('READY')}
              className={`p-3.5 rounded-2xl border text-start transition-all cursor-pointer ${
                activeTabFilter === 'READY'
                  ? 'bg-emerald-600 text-white border-emerald-700 shadow-md shadow-emerald-600/20 scale-[1.02]'
                  : 'bg-white border-slate-200/90 text-slate-800 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className={`text-[11px] font-bold ${activeTabFilter === 'READY' ? 'text-emerald-100' : 'text-slate-500'}`}>
                  جاهزة للإرجاع
                </span>
                <CheckCircle2 className={`w-4 h-4 ${activeTabFilter === 'READY' ? 'text-white' : 'text-emerald-600'}`} />
              </div>
              <p className="text-2xl font-black font-mono">{stats.readyOrders}</p>
              <span className={`text-[10px] ${activeTabFilter === 'READY' ? 'text-emerald-100' : 'text-slate-400'}`}>
                جاهزة للتوصيل للزبون
              </span>
            </button>

            <button
              onClick={() => setActiveTabFilter('DELIVERED')}
              className={`p-3.5 rounded-2xl border text-start transition-all cursor-pointer ${
                activeTabFilter === 'DELIVERED'
                  ? 'bg-slate-800 text-white border-slate-900 shadow-md shadow-slate-900/20 scale-[1.02]'
                  : 'bg-white border-slate-200/90 text-slate-800 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className={`text-[11px] font-bold ${activeTabFilter === 'DELIVERED' ? 'text-slate-300' : 'text-slate-500'}`}>
                  طلبات مكتملة
                </span>
                <Truck className={`w-4 h-4 ${activeTabFilter === 'DELIVERED' ? 'text-white' : 'text-slate-600'}`} />
              </div>
              <p className="text-2xl font-black font-mono">{stats.completedOrders}</p>
              <span className={`text-[10px] ${activeTabFilter === 'DELIVERED' ? 'text-slate-300' : 'text-slate-400'}`}>
                تم الدفع والتسليم
              </span>
            </button>
          </div>

          {/* Search & Actions Bar */}
          <div className="bg-white rounded-3xl p-3 border border-slate-200/90 shadow-xs space-y-2.5">
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute top-3 start-3" />
                <input
                  id="admin-search-input"
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="البحث برقم الطلب (ZP-000001)، الهاتف، الزبون أو عامل التوصيل..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl ps-9 pe-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute top-2.5 end-3 text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              <button
                onClick={handleCreateTestScenario}
                className="py-2 px-3 rounded-2xl bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 text-xs font-bold flex items-center gap-1.5 shrink-0 active:scale-95 transition-all cursor-pointer"
                title="إنشاء طلب تجريبي سريع"
              >
                <Plus className="w-4 h-4" />
                <span>طلب تجريبي</span>
              </button>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1 overflow-x-auto no-scrollbar pb-1 text-xs">
              {[
                { id: 'ALL', label: `الكل (${orders.length})` },
                { id: 'NEW', label: `جديدة (${stats.newOrders})` },
                { id: 'IN_REPAIR', label: `قيد التنفيذ (${stats.inRepair})` },
                { id: 'READY', label: `جاهزة (${stats.readyOrders})` },
                { id: 'DELIVERED', label: `مكتملة (${stats.completedOrders})` },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTabFilter(tab.id)}
                  className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer ${
                    activeTabFilter === tab.id
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Orders List */}
          <div className="space-y-2.5">
            {filteredOrders.length === 0 ? (
              <div className="bg-white rounded-3xl p-8 border border-slate-200 text-center space-y-2">
                <AlertCircle className="w-10 h-10 text-slate-300 mx-auto" />
                <h3 className="font-bold text-sm text-slate-800">لا توجد طلبات مطابقة</h3>
                <p className="text-xs text-slate-500">جرب تغيير كلمات البحث أو اختيار تبويب آخر.</p>
              </div>
            ) : (
              filteredOrders.map((order) => {
                const meta = STATUS_METADATA[order.status] || STATUS_METADATA.NEW;
                const isPickup = order.serviceType === 'pickup_return';

                return (
                  <div
                    key={order.id}
                    id={`admin-order-card-${order.id}`}
                    onClick={() => handleOpenOrderDetails(order)}
                    className="bg-white rounded-3xl p-4 border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer space-y-3"
                  >
                    {/* Header: ID + Status + Service Badge */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm font-black text-slate-900 bg-slate-100 px-2 py-0.5 rounded-lg">
                          {order.id}
                        </span>
                        <span
                          className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md border ${meta.badgeBg} ${meta.badgeText}`}
                        >
                          {meta.labelAr}
                        </span>
                        {order.assignedCourierName && (
                          <span className="text-[10px] font-bold bg-amber-50 text-amber-900 border border-amber-200 px-2 py-0.5 rounded-md flex items-center gap-1">
                            <Truck className="w-3 h-3 text-amber-600" />
                            <span>السائق: {order.assignedCourierName.split(' ')[0]}</span>
                          </span>
                        )}
                      </div>

                      <span className="text-[10px] text-slate-400 font-mono">
                        {order.createdAt}
                      </span>
                    </div>

                    {/* Device & Problem */}
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h4 className="font-black text-xs text-slate-900 flex items-center gap-1.5">
                          <Smartphone className="w-3.5 h-3.5 text-blue-600" />
                          <span>{order.brand} {order.model}</span>
                        </h4>
                        <p className="text-[11px] text-slate-600 mt-0.5">
                          {order.problemNameAr} • {order.commune}
                        </p>
                      </div>

                      {/* Price */}
                      <div className="text-end">
                        <span className="text-xs font-black text-blue-700 font-mono block">
                          {(order.finalPrice ?? order.estimatedTotal ?? 0).toLocaleString()} دج
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {order.serviceType === 'at_home'
                            ? 'إصلاح منزلي'
                            : order.serviceType === 'parts_delivery'
                            ? 'توصيل قطعة'
                            : 'استلام وإرجاع'}
                        </span>
                      </div>
                    </div>

                    {/* Customer quick info */}
                    <div className="bg-slate-50 rounded-2xl p-2.5 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-[10px]">
                          {order.customerName.charAt(0)}
                        </div>
                        <div>
                          <span className="font-bold text-slate-800 block text-[11px]">{order.customerName}</span>
                          <span className="text-[10px] text-slate-500 font-mono">{order.phoneNumber}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <a
                          href={`tel:${order.phoneNumber.replace(/\s+/g, '')}`}
                          onClick={(e) => e.stopPropagation()}
                          className="p-1.5 rounded-lg bg-white text-blue-700 hover:bg-blue-50 border border-slate-200 transition-colors"
                          title="اتصال هاتفي"
                        >
                          <Phone className="w-3.5 h-3.5" />
                        </a>
                        <a
                          href={`https://wa.me/213${order.phoneNumber.replace(/\D/g, '').replace(/^0/, '')}?text=Bonjour%20The%20Fix%20Point%20concernant%20votre%20demande%20${order.id}`}
                          target="_blank"
                          rel="noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 transition-colors"
                          title="واتساب"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* Detailed Order Modal */}
      {selectedOrder && (
        <div
          id="admin-order-detail-modal"
          className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-150"
        >
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 max-h-[92vh] flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between gap-2 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <span className="font-mono text-base font-black text-white bg-blue-600 px-2.5 py-1 rounded-xl">
                  {selectedOrder.id}
                </span>
                <div>
                  <h3 className="font-bold text-xs text-slate-100">
                    {selectedOrder.brand} {selectedOrder.model}
                  </h3>
                  <span className="text-[10px] text-sky-300">
                    {selectedOrder.createdAt}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => onTrackOrderInCustomerView(selectedOrder.id)}
                  className="py-1 px-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                  title="عرض في شاشة التتبع للزبون"
                >
                  <ExternalLink className="w-3 h-3" />
                  <span>معاينة الزبون</span>
                </button>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 flex items-center justify-center cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-4 overflow-y-auto space-y-4 text-xs divide-y divide-slate-100">
              {/* Customer & Call Section */}
              <div className="space-y-2">
                <h4 className="font-extrabold text-slate-900 text-xs flex items-center gap-1.5">
                  <User className="w-4 h-4 text-blue-600" />
                  <span>بيانات الزبون والموقع</span>
                </h4>

                <div className="bg-slate-50 rounded-2xl p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-black text-slate-900 text-sm block">
                        {selectedOrder.customerName}
                      </span>
                      <span className="font-mono text-xs text-blue-700 font-bold" dir="ltr">
                        {selectedOrder.phoneNumber}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <a
                        href={`tel:${selectedOrder.phoneNumber.replace(/\s+/g, '')}`}
                        className="py-2 px-3 rounded-xl bg-blue-600 text-white font-bold flex items-center gap-1 hover:bg-blue-700 shadow-xs active:scale-95 transition-all"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>اتصال هاتف</span>
                      </a>
                      <a
                        href={`https://wa.me/213${selectedOrder.phoneNumber.replace(/\D/g, '').replace(/^0/, '')}?text=Bonjour%20The%20Fix%20Point%20Oran`}
                        target="_blank"
                        rel="noreferrer"
                        className="py-2 px-3 rounded-xl bg-emerald-600 text-white font-bold flex items-center gap-1 hover:bg-emerald-700 shadow-xs active:scale-95 transition-all"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>واتساب</span>
                      </a>
                    </div>
                  </div>

                  <div className="border-t border-slate-200/80 pt-2 text-[11px] space-y-1">
                    <p className="flex items-start gap-1.5 text-slate-700">
                      <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
                      <span><strong>العنوان:</strong> {selectedOrder.address} ({selectedOrder.commune})</span>
                    </p>
                    {selectedOrder.locationInstructions && (
                      <p className="text-slate-500 ms-5">
                        <strong>إرشادات:</strong> {selectedOrder.locationInstructions}
                      </p>
                    )}
                    {selectedOrder.geoCoords && (
                      <a
                        href={`https://www.google.com/maps?q=${selectedOrder.geoCoords.lat},${selectedOrder.geoCoords.lng}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-blue-600 hover:underline font-bold ms-5 mt-1"
                      >
                        <Navigation className="w-3 h-3" />
                        <span>فتح الموقع على Google Maps ({selectedOrder.geoCoords.lat.toFixed(4)}, {selectedOrder.geoCoords.lng.toFixed(4)})</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {/* Courier Assignment Section */}
              <div className="pt-3 space-y-2">
                <h4 className="font-extrabold text-slate-900 text-xs flex items-center gap-1.5">
                  <Truck className="w-4 h-4 text-amber-600" />
                  <span>تعيين عامل التوصيل (Courier Assignment)</span>
                </h4>

                <div className="bg-amber-50/60 border border-amber-200/80 rounded-2xl p-3 space-y-2">
                  <div className="flex items-center gap-2">
                    <select
                      value={selectedCourierIdToAssign}
                      onChange={(e) => setSelectedCourierIdToAssign(e.target.value)}
                      className="flex-1 bg-white border border-amber-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:border-amber-600"
                    >
                      <option value="">-- اختر عامل التوصيل المكلف --</option>
                      {couriers.filter((c) => c.isActive).map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name} ({c.commune})
                        </option>
                      ))}
                    </select>

                    <button
                      type="button"
                      onClick={handleAssignCourier}
                      className="py-2 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs flex items-center gap-1 shadow-sm active:scale-95 cursor-pointer"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>تعيين</span>
                    </button>
                  </div>

                  {selectedOrder.assignedCourierName && (
                    <div className="flex items-center justify-between text-[11px] text-amber-900 pt-1">
                      <span>العامل المكلف حالياً: <strong>{selectedOrder.assignedCourierName}</strong></span>
                      <span className="font-mono text-slate-600">{selectedOrder.assignedCourierPhone}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Status Changer Section */}
              <div className="pt-3 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-extrabold text-slate-900 text-xs flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-blue-600" />
                    <span>تغيير حالة الطلب وإرسال إشعار للزبون</span>
                  </h4>
                  <span
                    className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md border ${
                      STATUS_METADATA[selectedOrder.status]?.badgeBg
                    } ${STATUS_METADATA[selectedOrder.status]?.badgeText}`}
                  >
                    {STATUS_METADATA[selectedOrder.status]?.labelAr}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-1.5">
                  {(
                    [
                      'NEW',
                      'CONFIRMED',
                      'COURIER_ASSIGNED',
                      'COURIER_ON_WAY',
                      'PHONE_PICKED_UP',
                      'RECEIVED_AT_WORKSHOP',
                      'DIAGNOSIS',
                      'REPAIRING',
                      'READY_FOR_RETURN',
                      'COURIER_RETURNING',
                      'READY',
                      'DELIVERED',
                      'CANCELLED',
                    ] as OrderStatus[]
                  ).map((st) => {
                    const isCurrent = selectedOrder.status === st;
                    const meta = STATUS_METADATA[st];

                    return (
                      <button
                        key={st}
                        onClick={() => handleUpdateStatus(st)}
                        className={`p-2 rounded-xl text-center font-bold text-[11px] border transition-all cursor-pointer ${
                          isCurrent
                            ? 'bg-blue-600 text-white border-blue-700 shadow-sm font-black'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {meta?.labelAr || st}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Proof of Pickup Card Preview if recorded */}
              {selectedOrder.proofOfPickup && (
                <div className="pt-3 space-y-2">
                  <h4 className="font-extrabold text-purple-900 text-xs flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-purple-600" />
                    <span>إثبات استلام الجهاز بواسطة عامل التوصيل</span>
                  </h4>

                  <div className="bg-purple-50/70 border border-purple-200 rounded-2xl p-3 space-y-2 text-xs">
                    <div className="flex items-center justify-between text-purple-950 font-bold">
                      <span>العامل: {selectedOrder.proofOfPickup.courierName}</span>
                      <span className="font-mono text-[10px] text-purple-700">{selectedOrder.proofOfPickup.timestamp}</span>
                    </div>

                    <p className="text-[11px] text-purple-900">
                      <strong>ملاحظات الحالة:</strong> {selectedOrder.proofOfPickup.conditionNotes}
                    </p>

                    <p className="text-[11px] text-purple-900">
                      <strong>الملحقات المستلمة:</strong> {selectedOrder.proofOfPickup.accessories.join(', ')}
                      {selectedOrder.proofOfPickup.customAccessories ? ` • ${selectedOrder.proofOfPickup.customAccessories}` : ''}
                    </p>

                    {selectedOrder.proofOfPickup.photoUrl && (
                      <div className="pt-1">
                        <img
                          src={selectedOrder.proofOfPickup.photoUrl}
                          alt="صورة الاستلام"
                          className="w-full max-h-36 object-cover rounded-xl border border-purple-300"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Proof of Delivery Card Preview if recorded */}
              {selectedOrder.proofOfDelivery && (
                <div className="pt-3 space-y-2">
                  <h4 className="font-extrabold text-emerald-900 text-xs flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>إثبات تسليم الجهاز والمبلغ المستلم</span>
                  </h4>

                  <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-3 space-y-2 text-xs">
                    <div className="flex items-center justify-between text-emerald-950 font-bold">
                      <span>العامل: {selectedOrder.proofOfDelivery.courierName}</span>
                      <span className="font-mono text-emerald-800 text-sm font-black">
                        المبلغ: {selectedOrder.proofOfDelivery.amountCollected.toLocaleString()} دج
                      </span>
                    </div>

                    <p className="text-[11px] text-emerald-900">
                      <strong>ملاحظات التسليم:</strong> {selectedOrder.proofOfDelivery.deliveryNotes}
                    </p>

                    <div className="flex items-center gap-3 text-[10px] text-emerald-800">
                      <span>✓ تم تحصيل الكاش</span>
                      <span>✓ تم فحص الجهاز مع الزبون</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Price Breakdown & Editable Final Price */}
              <div className="pt-3 space-y-2">
                <h4 className="font-extrabold text-slate-900 text-xs flex items-center gap-1.5">
                  <DollarSign className="w-4 h-4 text-blue-600" />
                  <span>التسعيرة وتعديل السعر النهائي</span>
                </h4>

                <div className="bg-slate-50 rounded-2xl p-3 space-y-2">
                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div>
                      <span className="text-slate-500">سعر القطعة:</span>
                      <p className="font-bold font-mono text-slate-800">
                        {selectedOrder.partPrice ? `${selectedOrder.partPrice.toLocaleString()} دج` : 'يحدد بعد الفحص'}
                      </p>
                    </div>
                    <div>
                      <span className="text-slate-500">اليد العاملة:</span>
                      <p className="font-bold font-mono text-slate-800">
                        {selectedOrder.laborFee ? `${selectedOrder.laborFee.toLocaleString()} دج` : 'مضمنة'}
                      </p>
                    </div>
                    <div>
                      <span className="text-slate-500">التنقل:</span>
                      <p className="font-bold font-mono text-slate-800">{selectedOrder.travelFee.toLocaleString()} دج</p>
                    </div>
                    <div>
                      <span className="text-slate-500">الخصم:</span>
                      <p className="font-bold font-mono text-emerald-600">
                        {selectedOrder.discount ? `-${selectedOrder.discount.toLocaleString()} دج` : '0 دج'}
                      </p>
                    </div>
                  </div>

                  {/* Final Price Modifier */}
                  <div className="pt-2 border-t border-slate-200 flex items-center justify-between gap-2">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-600">السعر النهائي للتحصيل (دج):</label>
                      <input
                        id="input-edit-final-price"
                        type="number"
                        value={editingPrice}
                        onChange={(e) => setEditingPrice(e.target.value)}
                        className="w-32 bg-white border border-slate-300 rounded-xl px-2.5 py-1 text-sm font-black font-mono text-blue-900 focus:outline-none focus:border-blue-600"
                      />
                    </div>
                    <button
                      id="btn-save-final-price"
                      onClick={handleSavePrice}
                      className="py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1 active:scale-95 transition-all cursor-pointer"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>حفظ السعر</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Internal Notes Section */}
              <div className="pt-3 space-y-2">
                <h4 className="font-extrabold text-slate-900 text-xs flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-blue-600" />
                  <span>ملاحظات داخلية (خاصة بالإدارة والفني)</span>
                </h4>

                <textarea
                  rows={2}
                  value={editingNotes}
                  onChange={(e) => setEditingNotes(e.target.value)}
                  placeholder="أدخل ملاحظات داخلية (تشخيص إضافي، رقم القطعة، تفاصيل الفني...)"
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white resize-none"
                />

                <button
                  onClick={handleSaveNotes}
                  className="py-1.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs flex items-center gap-1 cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>حفظ الملاحظات</span>
                </button>
              </div>

              {/* Order History Timeline / Logs */}
              <div className="pt-3 space-y-2">
                <h4 className="font-extrabold text-slate-900 text-xs flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-blue-600" />
                  <span>سجل تتبع الحالات (Audit Log)</span>
                </h4>

                <div className="space-y-1.5 max-h-40 overflow-y-auto">
                  {(selectedOrder.history || []).map((log, index) => (
                    <div key={log.id || index} className="p-2 rounded-xl bg-slate-50 border border-slate-100 flex items-start justify-between text-[11px]">
                      <div>
                        <span className="font-bold text-slate-800 block">{log.note || log.status}</span>
                        <span className="text-[10px] text-slate-400">بواسطة: {log.actor}</span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono">{log.timestamp}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-2">
              <button
                onClick={() => setSelectedOrder(null)}
                className="py-2 px-4 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs cursor-pointer"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add New Courier Modal */}
      {isAddCourierModalOpen && (
        <div
          id="add-courier-modal"
          className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-150"
        >
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-black">
                  <UserPlus className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-sm text-white">إضافة عامل توصيل جديد</h3>
              </div>
              <button
                onClick={() => setIsAddCourierModalOpen(false)}
                className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddNewCourier} className="p-4 space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">الاسم الكامل لعامل التوصيل *</label>
                <input
                  type="text"
                  required
                  value={newCourierName}
                  onChange={(e) => setNewCourierName(e.target.value)}
                  placeholder="مثال: يوسف بلحاج (Youcef Belhadj)"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">رقم الهاتف *</label>
                  <input
                    type="text"
                    required
                    value={newCourierPhone}
                    onChange={(e) => setNewCourierPhone(e.target.value)}
                    placeholder="0550 00 11 22"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-mono text-slate-900 focus:outline-none focus:border-blue-600"
                    dir="ltr"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">رمز PIN للدخول *</label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={newCourierPin}
                    onChange={(e) => setNewCourierPin(e.target.value)}
                    placeholder="1234"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-mono text-center text-slate-900 focus:outline-none focus:border-blue-600"
                    dir="ltr"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">نوع المركبة</label>
                  <select
                    value={newCourierVehicle}
                    onChange={(e) => setNewCourierVehicle(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-600"
                  >
                    <option value="moto">دراجة نارية (Moto)</option>
                    <option value="car">سيارة (Voiture)</option>
                    <option value="scooter">سكوتر (Scooter)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">رقم لوحة الترقيم</label>
                  <input
                    type="text"
                    value={newCourierPlate}
                    onChange={(e) => setNewCourierPlate(e.target.value)}
                    placeholder="12345-116-31"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-mono text-slate-900 focus:outline-none focus:border-blue-600"
                    dir="ltr"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">نطاق التغطية / البلديات بوهران</label>
                <input
                  type="text"
                  value={newCourierCommune}
                  onChange={(e) => setNewCourierCommune(e.target.value)}
                  placeholder="وهران وسط / عقيد لطفي / السانية"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-600"
                />
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddCourierModalOpen(false)}
                  className="py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="py-2 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black flex items-center gap-1 cursor-pointer"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>إضافة وتفعيل</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

