import { RepairRequest, OrderStatus, PickupSubStatus, InAppNotification, OrderAuditLog, ServiceType, PickupDeliveryDetails } from '../types';
import { DatabaseService } from './databaseService';

const STORAGE_KEY_ALL_ORDERS = 'the_fix_point_all_orders_v4';
const STORAGE_KEY_CLIENT_ORDER_IDS = 'the_fix_point_my_order_ids_v4';
const STORAGE_KEY_NOTIFICATIONS = 'the_fix_point_notifications_v4';
const STORAGE_KEY_COUNTER = 'the_fix_point_order_seq_counter_v4';

// Helper to format 6-digit zero padded order IDs e.g. ZP-000001
export const formatOrderId = (seqNumber: number): string => {
  return `ZP-${seqNumber.toString().padStart(6, '0')}`;
};

// Initial orders for The Fix Point
export const DEFAULT_INITIAL_ORDERS: RepairRequest[] = [
  {
    id: 'ZP-000001',
    customerName: 'ياسين زناتي (Yassine Zenati)',
    phoneNumber: '0550 12 34 56',
    serviceType: 'pickup_return',
    brand: 'Apple',
    model: 'iPhone 13',
    problemId: 'screen',
    problemNameAr: 'شاشة مكسورة (Écran cassé)',
    problemNameFr: 'Écran OLED Original',
    problemDescription: 'سقوط الهاتف على أرضية صلبة وتوقف اللمس في النصف السفلي.',
    commune: 'عقيد لطفي (Akid Lotfi)',
    address: 'إقامة النرجس، عمارة ب، الطابق 3، وهران',
    locationInstructions: 'بجانب بنك الخليج الجزائر، يرجى الاتصال عند الوصول',
    geoCoords: { lat: 35.7065, lng: -0.6012 },
    preferredDate: 'اليوم',
    preferredTime: '14:00 - 16:00',
    partPrice: 12500,
    laborFee: 5000,
    travelFee: 2000,
    discount: 1000,
    estimatedTotal: 18500,
    finalPrice: 18500,
    status: 'COURIER_ON_WAY',
    createdAt: '2026-08-16 11:30',
    assignedCourierId: 'courier-1',
    assignedCourierName: 'أمين دحماني (Amine Dahmani)',
    assignedCourierPhone: '0555 44 33 22',
    internalNotes: 'الزبون مستعجل جداً، تم تكليف عامل التوصيل أمين دحماني باستلام الهاتف.',
    technicianNotes: 'عامل التوصيل أمين دحماني في الطريق لاستلام الهاتف لإحضاره لورشة The Fix Point.',
    pickupDeliveryDetails: {
      assignedDriver: 'أمين دحماني (0555 44 33 22)',
      pickupAddress: 'إقامة النرجس، عمارة ب، الطابق 3، عقيد لطفي، وهران',
      pickupTime: '14:30',
      returnAddress: 'إقامة النرجس، عمارة ب، الطابق 3، عقيد لطفي، وهران',
      pickupStatus: 'عامل التوصيل في الطريق',
      repairStatus: 'في انتظار وصول الجهاز للورشة',
      pickupSubStatus: 'DRIVER_ON_WAY',
    },
    history: [
      {
        id: 'log-1',
        timestamp: '2026-08-16 11:30',
        status: 'NEW',
        note: 'تم إنشاء الطلب من طرف الزبون',
        actor: 'client',
      },
      {
        id: 'log-2',
        timestamp: '2026-08-16 11:45',
        status: 'CONFIRMED',
        note: 'تم تأكيد الموعد هاتفياً وتجهيز الشاشة الأصلية',
        actor: 'admin',
      },
      {
        id: 'log-3',
        timestamp: '2026-08-16 12:00',
        status: 'COURIER_ASSIGNED',
        note: 'تم تعيين عامل التوصيل أمين دحماني',
        actor: 'admin',
      },
      {
        id: 'log-4',
        timestamp: '2026-08-16 12:15',
        status: 'COURIER_ON_WAY',
        note: 'عامل التوصيل أمين في الطريق نحو عقيد لطفي لاستلام الهاتف',
        actor: 'courier:أمين دحماني',
      },
    ],
  },
  {
    id: 'ZP-000002',
    customerName: 'فاطمة الزهراء (Fatima Zohra)',
    phoneNumber: '0770 98 76 54',
    serviceType: 'at_home',
    brand: 'Samsung',
    model: 'Galaxy A54 5G',
    problemId: 'battery',
    problemNameAr: 'بطارية (Batterie)',
    problemNameFr: 'Batterie Originale',
    problemDescription: 'البطارية تفرغ بسرعة فائقة وتنطفئ عند 30%',
    commune: 'وهران وسط (Oran Centre)',
    address: 'شارع العربي بن مهيدي، عمارة 14',
    locationInstructions: 'مقابل البريد المركزي',
    geoCoords: { lat: 35.6987, lng: -0.6349 },
    preferredDate: 'اليوم',
    preferredTime: '16:00 - 18:00',
    partPrice: 3200,
    laborFee: 2000,
    travelFee: 2000,
    discount: 0,
    estimatedTotal: 7200,
    finalPrice: 7200,
    status: 'REPAIRING',
    createdAt: '2026-08-16 09:15',
    internalNotes: 'تم فحص الشحن، المشكل بالبطارية فقط.',
    technicianNotes: 'جاري تركيب البطارية الأصلية وفحص دورات الشحن.',
    history: [
      {
        id: 'log-1',
        timestamp: '2026-08-16 09:15',
        status: 'NEW',
        note: 'تم تسجيل الطلب',
        actor: 'client',
      },
      {
        id: 'log-2',
        timestamp: '2026-08-16 09:40',
        status: 'CONFIRMED',
        note: 'تم تأكيد التدخل المنزلي',
        actor: 'admin',
      },
      {
        id: 'log-3',
        timestamp: '2026-08-16 10:30',
        status: 'REPAIRING',
        note: 'التقني وصل للموقع وباشر عملية التبديل',
        actor: 'technician',
      },
    ],
  },
  {
    id: 'ZP-000003',
    customerName: 'كريم مرابط (Karim M.)',
    phoneNumber: '0661 45 67 89',
    serviceType: 'parts_delivery',
    brand: 'Redmi',
    model: 'Redmi Note 13 4G',
    problemId: 'screen',
    problemNameAr: 'شاشة أصلية',
    problemNameFr: 'Écran Original',
    problemDescription: 'طلب توصيل شاشة Redmi Note 13 الأصلية فقط',
    commune: 'بئر الجير (Bir El Djir)',
    address: 'حي ميلينيوم، بجانب صيدلية النور',
    locationInstructions: 'الاتصال قبل الوصول بـ 10 دقائق',
    geoCoords: { lat: 35.718, lng: -0.562 },
    preferredDate: 'اليوم',
    preferredTime: '17:00 - 19:00',
    partPrice: 6500,
    laborFee: 0,
    travelFee: 2000,
    discount: 0,
    estimatedTotal: 8500,
    finalPrice: 8500,
    status: 'READY',
    createdAt: '2026-08-16 13:00',
    internalNotes: 'تم فحص الشاشة وتغليفها مع شهادة الضمان.',
    technicianNotes: 'القطعة جاهزة وجاري التوصيل.',
    history: [
      {
        id: 'log-1',
        timestamp: '2026-08-16 13:00',
        status: 'NEW',
        note: 'تم استلام طلب توصيل القطعة',
        actor: 'client',
      },
      {
        id: 'log-2',
        timestamp: '2026-08-16 13:20',
        status: 'READY',
        note: 'القطعة مفحوصة ومغلفة وجاهزة للتسليم',
        actor: 'admin',
      },
    ],
  },
  {
    id: 'ZP-000004',
    customerName: 'سفيان بلحاج',
    phoneNumber: '0558 77 88 99',
    serviceType: 'at_home',
    brand: 'Apple',
    model: 'iPhone 15',
    problemId: 'screen',
    problemNameAr: 'شاشة مكسورة',
    problemNameFr: 'Écran OLED Original',
    problemDescription: 'شاشة مكسورة تحتاج تبديل شاشة أصلية كاملة',
    commune: 'السانية (Es Senia)',
    address: 'حي 500 مسكن، عمارة 12، السانية',
    geoCoords: { lat: 35.651, lng: -0.627 },
    preferredDate: 'أمس',
    preferredTime: '11:00 - 13:00',
    partPrice: 28000,
    laborFee: 6000,
    travelFee: 2000,
    discount: 0,
    estimatedTotal: 36000,
    finalPrice: 36000,
    status: 'DELIVERED',
    createdAt: '2026-08-15 10:00',
    internalNotes: 'تم التركيب بنجاح واستلام المبلغ كاش (36,000 دج) وتسليم الضمان.',
    technicianNotes: 'تم تسليم الجهاز واختباره بنجاح.',
    history: [
      {
        id: 'log-1',
        timestamp: '2026-08-15 10:00',
        status: 'NEW',
        note: 'طلب جديد',
        actor: 'client',
      },
      {
        id: 'log-2',
        timestamp: '2026-08-15 11:30',
        status: 'DELIVERED',
        note: 'تم الانتهاء والتسليم بنجاح',
        actor: 'technician',
      },
    ],
  },
];

// Status labels & messages dictionary
export const STATUS_METADATA: Record<OrderStatus, {
  labelAr: string;
  labelFr: string;
  badgeBg: string;
  badgeText: string;
  clientNotificationAr: string;
  clientNotificationFr: string;
}> = {
  NEW: {
    labelAr: 'طلب جديد',
    labelFr: 'Nouvelle demande',
    badgeBg: 'bg-amber-100 border-amber-300',
    badgeText: 'text-amber-900',
    clientNotificationAr: 'تم استلام طلبك بنجاح وجاري مراجعته.',
    clientNotificationFr: 'Votre demande a été reçue avec succès.',
  },
  CONFIRMED: {
    labelAr: 'تم تأكيد الطلب',
    labelFr: 'Demande confirmée',
    badgeBg: 'bg-blue-100 border-blue-300',
    badgeText: 'text-blue-900',
    clientNotificationAr: 'تم تأكيد طلبك وتجهيز القطع اللازمة.',
    clientNotificationFr: 'Votre demande a été confirmée.',
  },
  COURIER_ASSIGNED: {
    labelAr: 'تم تعيين عامل التوصيل',
    labelFr: 'Livreur assigné',
    badgeBg: 'bg-sky-100 border-sky-300',
    badgeText: 'text-sky-900',
    clientNotificationAr: 'تم تعيين عامل التوصيل وسيتوجه لاستلام هاتفك قريباً.',
    clientNotificationFr: 'Un livreur a été assigné pour récupérer votre téléphone.',
  },
  COURIER_ON_WAY: {
    labelAr: 'عامل التوصيل في الطريق',
    labelFr: 'Livreur en route',
    badgeBg: 'bg-indigo-100 border-indigo-300',
    badgeText: 'text-indigo-900',
    clientNotificationAr: 'عامل التوصيل في الطريق إليك لاستلام الهاتف.',
    clientNotificationFr: 'Le livreur est en route vers votre adresse.',
  },
  TECHNICIAN_ON_WAY: {
    labelAr: 'التقني في الطريق',
    labelFr: 'Technicien en route',
    badgeBg: 'bg-indigo-100 border-indigo-300',
    badgeText: 'text-indigo-900',
    clientNotificationAr: 'التقني في الطريق إليك الآن.',
    clientNotificationFr: 'Le technicien est en route vers vous.',
  },
  PHONE_PICKED_UP: {
    labelAr: 'تم استلام الهاتف',
    labelFr: 'Téléphone récupéré',
    badgeBg: 'bg-purple-100 border-purple-300',
    badgeText: 'text-purple-900',
    clientNotificationAr: 'تم استلام هاتفك بنجاح ونقله بأمان إلى الورشة.',
    clientNotificationFr: 'Votre téléphone a été récupéré en toute sécurité.',
  },
  RECEIVED_AT_WORKSHOP: {
    labelAr: 'وصل إلى الورشة',
    labelFr: 'Arrivé à l\'atelier',
    badgeBg: 'bg-teal-100 border-teal-300',
    badgeText: 'text-teal-900',
    clientNotificationAr: 'وصل هاتفك إلى ورشة The Fix Point وبدأت إجراءات الفحص.',
    clientNotificationFr: 'Votre smartphone est arrivé à l\'atelier The Fix Point.',
  },
  DIAGNOSIS: {
    labelAr: 'جاري التشخيص',
    labelFr: 'Diagnostic en cours',
    badgeBg: 'bg-cyan-100 border-cyan-300',
    badgeText: 'text-cyan-900',
    clientNotificationAr: 'جاري فحص وتشخيص جهازك بدقة في الورشة.',
    clientNotificationFr: 'Diagnostic approfondi de votre appareil en cours.',
  },
  REPAIRING: {
    labelAr: 'جاري التصليح',
    labelFr: 'Réparation en cours',
    badgeBg: 'bg-orange-100 border-orange-300',
    badgeText: 'text-orange-900',
    clientNotificationAr: 'جاري تصليح جهازك وتركيب القطع الأصلية.',
    clientNotificationFr: 'Réparation et montage des pièces en cours.',
  },
  READY_FOR_RETURN: {
    labelAr: 'جاهز للإرجاع',
    labelFr: 'Prêt pour le retour',
    badgeBg: 'bg-emerald-100 border-emerald-300',
    badgeText: 'text-emerald-900',
    clientNotificationAr: 'تم الانتهاء من تصليح هاتفك وتجهيزه لإرجاعه إليك.',
    clientNotificationFr: 'Votre téléphone est réparé et prêt pour la livraison retour.',
  },
  COURIER_RETURNING: {
    labelAr: 'عامل التوصيل في طريق العودة',
    labelFr: 'Livreur en retour',
    badgeBg: 'bg-blue-100 border-blue-300',
    badgeText: 'text-blue-900',
    clientNotificationAr: 'عامل التوصيل في الطريق لإرجاع هاتفك إليك.',
    clientNotificationFr: 'Le livreur est en route pour vous ramener votre téléphone.',
  },
  READY: {
    labelAr: 'تم الانتهاء',
    labelFr: 'Prêt / Terminé',
    badgeBg: 'bg-emerald-100 border-emerald-300',
    badgeText: 'text-emerald-900',
    clientNotificationAr: 'تم الانتهاء من إصلاح هاتفك بنجاح وهو جاهز.',
    clientNotificationFr: 'La réparation de votre téléphone est terminée.',
  },
  DELIVERED: {
    labelAr: 'تم التسليم',
    labelFr: 'Livré & Clôturé',
    badgeBg: 'bg-slate-100 border-slate-300',
    badgeText: 'text-slate-900',
    clientNotificationAr: 'تم تسليم هاتفك بنجاح، شكراً لثقتكم بـ The Fix Point.',
    clientNotificationFr: 'Téléphone remis avec succès, merci pour votre confiance.',
  },
  CANCELLED: {
    labelAr: 'تم إلغاء الطلب',
    labelFr: 'Demande annulée',
    badgeBg: 'bg-rose-100 border-rose-300',
    badgeText: 'text-rose-900',
    clientNotificationAr: 'تم إلغاء هذا الطلب.',
    clientNotificationFr: 'Cette demande a été annulée.',
  },
};

// Pickup & Return 9 sub-statuses metadata
export const PICKUP_SUB_STATUSES: {
  id: PickupSubStatus;
  titleAr: string;
  titleFr: string;
  descAr: string;
  descFr: string;
  correspondingMainStatus: OrderStatus;
}[] = [
  {
    id: 'WAITING_DRIVER',
    titleAr: 'في انتظار عامل التوصيل',
    titleFr: 'En attente du livreur',
    descAr: 'تم حجز الموعد وفي انتظار انطلاق عامل التوصيل',
    descFr: 'Créneau validé, en attente du départ du livreur',
    correspondingMainStatus: 'CONFIRMED',
  },
  {
    id: 'DRIVER_ON_WAY',
    titleAr: 'عامل التوصيل في الطريق',
    titleFr: 'Livreur en route pour la collecte',
    descAr: 'عامل التوصيل في الطريق إلى موقعك لاستلام الجهاز',
    descFr: 'Le livreur se déplace vers votre adresse',
    correspondingMainStatus: 'TECHNICIAN_ON_WAY',
  },
  {
    id: 'PHONE_PICKED_UP',
    titleAr: 'تم استلام الهاتف',
    titleFr: 'Téléphone récupéré',
    descAr: 'تم استلام الجهاز ووضعه في حقيبة الحماية لنقله للورشة',
    descFr: 'Appareil scellé et sécurisé pour transport',
    correspondingMainStatus: 'PHONE_PICKED_UP',
  },
  {
    id: 'ARRIVED_AT_WORKSHOP',
    titleAr: 'وصل إلى الورشة',
    titleFr: 'Arrivé à l\'atelier The Fix Point',
    descAr: 'وصل الهاتف إلى ورشة The Fix Point بوهران وبدء التسجيل',
    descFr: 'Smartphone réceptionné à l\'atelier',
    correspondingMainStatus: 'DIAGNOSIS',
  },
  {
    id: 'DIAGNOSIS',
    titleAr: 'قيد التشخيص',
    titleFr: 'Diagnostic technique',
    descAr: 'فحص مجهري للوحة الأم وجميع وظائف الهاتف',
    descFr: 'Contrôle complet des circuits et composants',
    correspondingMainStatus: 'DIAGNOSIS',
  },
  {
    id: 'REPAIRING',
    titleAr: 'قيد الإصلاح',
    titleFr: 'Réparation en cours',
    descAr: 'تركيب القطع الأصلية مع العزل واختبار الأداء',
    descFr: 'Montage minutieux des pièces détachées',
    correspondingMainStatus: 'REPAIRING',
  },
  {
    id: 'READY_FOR_RETURN',
    titleAr: 'جاهز للإرجاع',
    titleFr: 'Prêt pour le retour',
    descAr: 'اجتياز فحص الجودة بنجاح وتجهيزه للتسليم',
    descFr: 'Tests qualité validés, prêt pour livraison',
    correspondingMainStatus: 'READY',
  },
  {
    id: 'DRIVER_RETURNING',
    titleAr: 'عامل التوصيل في طريق العودة',
    titleFr: 'Livreur en route pour la livraison',
    descAr: 'عامل التوصيل في الطريق لإرجاع هاتفك إليك',
    descFr: 'Le livreur est en route pour vous ramener le téléphone',
    correspondingMainStatus: 'READY',
  },
  {
    id: 'DELIVERED',
    titleAr: 'تم التسليم',
    titleFr: 'Livré & Réglé',
    descAr: 'تم تسليم الهاتف للزبون واستلام المبلغ كاش مع الضمان',
    descFr: 'Remise au client et règlement sur place avec garantie',
    correspondingMainStatus: 'DELIVERED',
  },
];

// Listeners for real-time reactivity
type Listener = () => void;
const listeners: Set<Listener> = new Set();

// Active Firestore Subscription management
let isFirestoreListening = false;
export const initFirestoreRealtimeSync = () => {
  if (isFirestoreListening) return;
  isFirestoreListening = true;

  // Initial seeding if cloud database is empty
  DatabaseService.seedInitialDataIfEmpty().catch((err) => {
    console.warn('Initial cloud seed skipped or already present:', err);
  });

  // Subscribe to real-time updates from Firestore collection
  DatabaseService.subscribeToOrders((firestoreOrders) => {
    if (firestoreOrders && firestoreOrders.length > 0) {
      try {
        localStorage.setItem(STORAGE_KEY_ALL_ORDERS, JSON.stringify(firestoreOrders));
        notifySubscribers();
      } catch (e) {
        console.warn('Failed to cache firestore orders to localStorage:', e);
      }
    }
  });
};

// Start background listener
if (typeof window !== 'undefined') {
  initFirestoreRealtimeSync();
}

export const subscribeToOrders = (listener: Listener) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

const notifySubscribers = () => {
  listeners.forEach((listener) => {
    try {
      listener();
    } catch (e) {
      console.error('Error in order subscriber:', e);
    }
  });
};

// Order Service Implementation
export const OrderService = {
  // Get next sequential order ID (ZP-000001, ZP-000002, ...)
  getNextOrderId(): string {
    const orders = this.getAllOrders();
    let highestSeq = orders.length;

    // Check stored counter
    try {
      const storedSeq = localStorage.getItem(STORAGE_KEY_COUNTER);
      if (storedSeq) {
        highestSeq = Math.max(highestSeq, parseInt(storedSeq, 10));
      }
    } catch {
      // ignore
    }

    // Also inspect existing order IDs to prevent any collision
    orders.forEach((o) => {
      if (o.id.startsWith('ZP-')) {
        const num = parseInt(o.id.replace('ZP-', ''), 10);
        if (!isNaN(num) && num > highestSeq) {
          highestSeq = num;
        }
      }
    });

    const nextSeq = highestSeq + 1;
    try {
      localStorage.setItem(STORAGE_KEY_COUNTER, nextSeq.toString());
    } catch {
      // ignore
    }

    return formatOrderId(nextSeq);
  },

  // Get ALL orders (For Admin Dashboard)
  getAllOrders(): RepairRequest[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY_ALL_ORDERS);
      if (data) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Error reading all orders from localStorage:', e);
    }

    // Initialize with default
    try {
      localStorage.setItem(STORAGE_KEY_ALL_ORDERS, JSON.stringify(DEFAULT_INITIAL_ORDERS));
      // Mark default first order as client's own order for initial demo
      localStorage.setItem(STORAGE_KEY_CLIENT_ORDER_IDS, JSON.stringify(['ZP-000001']));
    } catch {
      // ignore
    }
    return DEFAULT_INITIAL_ORDERS;
  },

  // Get Client's own orders ONLY (Strict Data Isolation)
  getClientOrders(): RepairRequest[] {
    const all = this.getAllOrders();
    let myIds: string[] = ['ZP-000001'];
    try {
      const data = localStorage.getItem(STORAGE_KEY_CLIENT_ORDER_IDS);
      if (data) {
        myIds = JSON.parse(data);
      }
    } catch {
      // fallback
    }

    return all.filter((o) => myIds.includes(o.id));
  },

  // Find a specific order by ID (e.g. for tracking search)
  getOrderById(id: string): RepairRequest | undefined {
    const all = this.getAllOrders();
    const cleanId = id.trim().toUpperCase();
    return all.find((o) => o.id.toUpperCase() === cleanId);
  },

  // Save full list
  saveAllOrders(orders: RepairRequest[]) {
    try {
      localStorage.setItem(STORAGE_KEY_ALL_ORDERS, JSON.stringify(orders));
      notifySubscribers();
    } catch (e) {
      console.error('Failed to save orders to localStorage:', e);
    }
  },

  // Create a new order
  createOrder(orderData: Omit<RepairRequest, 'id' | 'createdAt' | 'status'> & { id?: string }): RepairRequest {
    const orderId = orderData.id || this.getNextOrderId();
    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 16);

    const newOrder: RepairRequest = {
      ...orderData,
      id: orderId,
      status: 'NEW',
      createdAt: nowStr,
      discount: orderData.discount || 0,
      travelFee: orderData.travelFee ?? 2000,
      estimatedTotal: orderData.estimatedTotal ?? 3500,
      finalPrice: orderData.finalPrice ?? orderData.estimatedTotal ?? 3500,
      internalNotes: orderData.internalNotes || 'طلب جديد تم إنشاؤه عبر التطبيق.',
      history: [
        {
          id: `log-${Date.now()}`,
          timestamp: nowStr,
          status: 'NEW',
          note: 'تم إنشاء الطلب بنجاح في نظام The Fix Point',
          actor: 'client',
        },
      ],
      pickupDeliveryDetails:
        orderData.serviceType === 'pickup_return'
          ? {
              pickupAddress: orderData.address,
              pickupTime: orderData.preferredTime,
              returnAddress: orderData.address,
              pickupStatus: 'في انتظار عامل التوصيل',
              repairStatus: 'لم يبدأ بعد',
              pickupSubStatus: 'WAITING_DRIVER',
              ...orderData.pickupDeliveryDetails,
            }
          : undefined,
    };

    const all = this.getAllOrders();
    const updatedAll = [newOrder, ...all];
    this.saveAllOrders(updatedAll);

    // Save to client's device order list
    try {
      let myIds: string[] = [];
      const stored = localStorage.getItem(STORAGE_KEY_CLIENT_ORDER_IDS);
      if (stored) myIds = JSON.parse(stored);
      if (!myIds.includes(orderId)) {
        myIds.unshift(orderId);
        localStorage.setItem(STORAGE_KEY_CLIENT_ORDER_IDS, JSON.stringify(myIds));
      }
    } catch {
      // ignore
    }

    // Trigger Notification
    this.createNotification({
      orderId,
      status: 'NEW',
      titleAr: `تم إنشاء الطلب ${orderId}`,
      titleFr: `Demande ${orderId} créée`,
      messageAr: `تم استلام طلبك بنجاح برقم ${orderId}. سنتصل بك لتأكيد الموعد.`,
      messageFr: `Votre demande ${orderId} a été enregistrée. Nous vous contacterons pour confirmer.`,
    });

    // Cloud Persistence in Firebase Firestore
    DatabaseService.createOrder(newOrder).catch((err) => {
      console.warn('Firestore createOrder background sync:', err);
    });

    return newOrder;
  },

  // Update order status (Admin or Technician)
  updateOrderStatus(orderId: string, newStatus: OrderStatus, note?: string, actor = 'admin'): RepairRequest | null {
    const all = this.getAllOrders();
    const index = all.findIndex((o) => o.id.toUpperCase() === orderId.toUpperCase());
    if (index === -1) return null;

    const order = all[index];
    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 16);
    const meta = STATUS_METADATA[newStatus];

    const updatedHistory: OrderAuditLog[] = [
      ...(order.history || []),
      {
        id: `log-${Date.now()}`,
        timestamp: nowStr,
        status: newStatus,
        note: note || meta?.labelAr || `تغيير الحالة إلى ${newStatus}`,
        actor,
      },
    ];

    // If order has pickup details, sync sub-status if applicable
    let updatedPickup = order.pickupDeliveryDetails;
    if (updatedPickup) {
      if (newStatus === 'COURIER_ON_WAY' || newStatus === 'TECHNICIAN_ON_WAY') {
        updatedPickup = { ...updatedPickup, pickupSubStatus: 'DRIVER_ON_WAY', pickupStatus: 'عامل التوصيل في الطريق' };
      } else if (newStatus === 'PHONE_PICKED_UP') {
        updatedPickup = { ...updatedPickup, pickupSubStatus: 'PHONE_PICKED_UP', pickupStatus: 'تم استلام الهاتف' };
      } else if (newStatus === 'RECEIVED_AT_WORKSHOP') {
        updatedPickup = { ...updatedPickup, pickupSubStatus: 'ARRIVED_AT_WORKSHOP', pickupStatus: 'وصل إلى الورشة' };
      } else if (newStatus === 'DIAGNOSIS') {
        updatedPickup = { ...updatedPickup, pickupSubStatus: 'DIAGNOSIS', repairStatus: 'جاري الفحص المخبري' };
      } else if (newStatus === 'REPAIRING') {
        updatedPickup = { ...updatedPickup, pickupSubStatus: 'REPAIRING', repairStatus: 'جاري تصليح الجهاز' };
      } else if (newStatus === 'READY_FOR_RETURN' || newStatus === 'READY') {
        updatedPickup = { ...updatedPickup, pickupSubStatus: 'READY_FOR_RETURN', repairStatus: 'تم الانتهاء وجاهز للإرجاع' };
      } else if (newStatus === 'COURIER_RETURNING') {
        updatedPickup = { ...updatedPickup, pickupSubStatus: 'DRIVER_RETURNING', pickupStatus: 'عامل التوصيل في طريق العودة' };
      } else if (newStatus === 'DELIVERED') {
        updatedPickup = { ...updatedPickup, pickupSubStatus: 'DELIVERED', pickupStatus: 'تم التسليم' };
      }
    }

    const updatedOrder: RepairRequest = {
      ...order,
      status: newStatus,
      technicianNotes: note || order.technicianNotes,
      history: updatedHistory,
      pickupDeliveryDetails: updatedPickup,
    };

    all[index] = updatedOrder;
    this.saveAllOrders(all);

    // Sync to Firestore
    DatabaseService.updateOrderStatus(orderId, newStatus, actor, note).catch((err) => {
      console.warn('Firestore updateOrderStatus sync:', err);
    });

    // Create In-App Notification for customer
    const notifMsgAr =
      newStatus === 'CONFIRMED'
        ? `طلبك ${orderId} تم تأكيده.`
        : newStatus === 'COURIER_ASSIGNED'
        ? `تم تعيين عامل التوصيل لطلبك (${orderId}).`
        : newStatus === 'COURIER_ON_WAY' || newStatus === 'TECHNICIAN_ON_WAY'
        ? `عامل التوصيل في الطريق إليك (طلب ${orderId}).`
        : newStatus === 'PHONE_PICKED_UP'
        ? `تم استلام هاتفك ونقله لورشة The Fix Point.`
        : newStatus === 'RECEIVED_AT_WORKSHOP'
        ? `وصل هاتفك إلى ورشة The Fix Point.`
        : newStatus === 'READY_FOR_RETURN' || newStatus === 'READY'
        ? `تم الانتهاء من إصلاح هاتفك (طلب ${orderId}).`
        : newStatus === 'COURIER_RETURNING'
        ? `عامل التوصيل في الطريق لإرجاع هاتفك إليك.`
        : newStatus === 'DELIVERED'
        ? `تم تسليم هاتفك بنجاح، شكراً لثقتكم.`
        : meta?.clientNotificationAr || `تم تحديث حالة طلبك ${orderId}.`;

    const notifMsgFr =
      newStatus === 'CONFIRMED'
        ? `Votre demande ${orderId} a été confirmée.`
        : newStatus === 'COURIER_ASSIGNED'
        ? `Un livreur a été assigné pour votre commande (${orderId}).`
        : newStatus === 'COURIER_ON_WAY' || newStatus === 'TECHNICIAN_ON_WAY'
        ? `Le livreur est en route vers vous (${orderId}).`
        : newStatus === 'PHONE_PICKED_UP'
        ? `Votre téléphone a été récupéré (${orderId}).`
        : newStatus === 'READY_FOR_RETURN' || newStatus === 'READY'
        ? `La réparation de votre téléphone est terminée (${orderId}).`
        : newStatus === 'DELIVERED'
        ? `Votre téléphone a été livré avec succès.`
        : meta?.clientNotificationFr || `Mise à jour de votre demande ${orderId}.`;

    this.createNotification({
      orderId,
      status: newStatus,
      titleAr: meta?.labelAr || 'تحديث الطلب',
      titleFr: meta?.labelFr || 'Mise à jour',
      messageAr: notifMsgAr,
      messageFr: notifMsgFr,
    });

    return updatedOrder;
  },

  // Assign courier to an order
  assignCourier(orderId: string, courierId: string, courierName: string, courierPhone: string, actor = 'admin'): RepairRequest | null {
    const all = this.getAllOrders();
    const index = all.findIndex((o) => o.id.toUpperCase() === orderId.toUpperCase());
    if (index === -1) return null;

    const order = all[index];
    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 16);

    const nextStatus: OrderStatus = (order.status === 'NEW' || order.status === 'CONFIRMED') ? 'COURIER_ASSIGNED' : order.status;

    const updatedOrder: RepairRequest = {
      ...order,
      status: nextStatus,
      assignedCourierId: courierId,
      assignedCourierName: courierName,
      assignedCourierPhone: courierPhone,
      pickupDeliveryDetails: {
        ...(order.pickupDeliveryDetails || {}),
        assignedDriver: `${courierName} (${courierPhone})`,
        pickupStatus: 'تم تعيين عامل التوصيل',
      },
      history: [
        ...(order.history || []),
        {
          id: `log-${Date.now()}`,
          timestamp: nowStr,
          status: nextStatus,
          note: `تم تعيين عامل التوصيل: ${courierName}`,
          actor,
        },
      ],
    };

    all[index] = updatedOrder;
    this.saveAllOrders(all);

    // Sync to Firestore
    DatabaseService.assignCourier(orderId, courierId, courierName, courierPhone).catch((err) => {
      console.warn('Firestore assignCourier sync:', err);
    });

    this.createNotification({
      orderId,
      status: nextStatus,
      titleAr: 'تعيين عامل التوصيل',
      titleFr: 'Livreur assigné',
      messageAr: `تم تعيين عامل توصيل لطلبك ${orderId}. عامل التوصيل في طريقه إليك.`,
      messageFr: `Un livreur a été assigné pour votre commande ${orderId}. Le livreur est en route.`,
    });

    return updatedOrder;
  },

  // Submit Proof of Pickup by Courier
  submitProofOfPickup(
    orderId: string,
    proofData: {
      photoUrl?: string;
      conditionNotes: string;
      accessories: string[];
      customAccessories?: string;
      courierId: string;
      courierName: string;
    }
  ): RepairRequest | null {
    const all = this.getAllOrders();
    const index = all.findIndex((o) => o.id.toUpperCase() === orderId.toUpperCase());
    if (index === -1) return null;

    const order = all[index];
    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 16);

    const proof = {
      ...proofData,
      timestamp: nowStr,
    };

    const updatedOrder: RepairRequest = {
      ...order,
      status: 'PHONE_PICKED_UP',
      proofOfPickup: proof,
      pickupDeliveryDetails: {
        ...(order.pickupDeliveryDetails || {}),
        pickupStatus: 'تم استلام الهاتف',
        pickupSubStatus: 'PHONE_PICKED_UP',
      },
      history: [
        ...(order.history || []),
        {
          id: `log-${Date.now()}`,
          timestamp: nowStr,
          status: 'PHONE_PICKED_UP',
          note: `تم استلام الهاتف بنجاح بواسطة ${proofData.courierName}. الحالة: ${proofData.conditionNotes || 'عادية'}. الملحقات: ${proofData.accessories.join(', ')}`,
          actor: `courier:${proofData.courierName}`,
        },
      ],
    };

    all[index] = updatedOrder;
    this.saveAllOrders(all);

    // Sync to Firestore
    DatabaseService.updateOrderStatus(orderId, 'PHONE_PICKED_UP', 'COURIER', 'تم استلام الهاتف من الزبون', proof).catch((err) => {
      console.warn('Firestore submitProofOfPickup sync:', err);
    });

    this.createNotification({
      orderId,
      status: 'PHONE_PICKED_UP',
      titleAr: 'تم استلام هاتفك',
      titleFr: 'Téléphone récupéré',
      messageAr: `تم استلام هاتفك بنجاح وهو في طريقه إلى ورشة The Fix Point.`,
      messageFr: `Votre téléphone a été récupéré avec succès et est en route vers l'atelier The Fix Point.`,
    });

    return updatedOrder;
  },

  // Submit Proof of Delivery by Courier
  submitProofOfDelivery(
    orderId: string,
    proofData: {
      photoUrl?: string;
      deliveryNotes: string;
      amountCollected: number;
      isCashCollected: boolean;
      isTestedWithCustomer: boolean;
      courierId: string;
      courierName: string;
    }
  ): RepairRequest | null {
    const all = this.getAllOrders();
    const index = all.findIndex((o) => o.id.toUpperCase() === orderId.toUpperCase());
    if (index === -1) return null;

    const order = all[index];
    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 16);

    const proof = {
      ...proofData,
      timestamp: nowStr,
    };

    const updatedOrder: RepairRequest = {
      ...order,
      status: 'DELIVERED',
      proofOfDelivery: proof,
      pickupDeliveryDetails: {
        ...(order.pickupDeliveryDetails || {}),
        pickupStatus: 'تم تسليم الهاتف',
        pickupSubStatus: 'DELIVERED',
      },
      history: [
        ...(order.history || []),
        {
          id: `log-${Date.now()}`,
          timestamp: nowStr,
          status: 'DELIVERED',
          note: `تم تسليم الهاتف بنجاح للزبون بواسطة ${proofData.courierName}. المبلغ المحصل: ${proofData.amountCollected.toLocaleString()} دج. ملاحظات: ${proofData.deliveryNotes || 'لا توجد'}`,
          actor: `courier:${proofData.courierName}`,
        },
      ],
    };

    all[index] = updatedOrder;
    this.saveAllOrders(all);

    // Sync to Firestore
    DatabaseService.updateOrderStatus(orderId, 'DELIVERED', 'COURIER', 'تم تسليم الهاتف للزبون واستلام المبلغ كاش', undefined, proof).catch((err) => {
      console.warn('Firestore submitProofOfDelivery sync:', err);
    });

    this.createNotification({
      orderId,
      status: 'DELIVERED',
      titleAr: 'تم تسليم هاتفك بنجاح',
      titleFr: 'Téléphone livré',
      messageAr: 'تم تسليم هاتفك بنجاح. شكراً لثقتكم بـ The Fix Point.',
      messageFr: 'Votre téléphone a été livré avec succès. Merci pour votre confiance.',
    });

    return updatedOrder;
  },

  // Update pickup sub-status (For Collecte et retour)
  updatePickupSubStatus(orderId: string, subStatus: PickupSubStatus, note?: string): RepairRequest | null {
    const all = this.getAllOrders();
    const index = all.findIndex((o) => o.id.toUpperCase() === orderId.toUpperCase());
    if (index === -1) return null;

    const order = all[index];
    const subMeta = PICKUP_SUB_STATUSES.find((s) => s.id === subStatus);
    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 16);

    const updatedPickup: PickupDeliveryDetails = {
      ...(order.pickupDeliveryDetails || {}),
      pickupSubStatus: subStatus,
      pickupStatus: subMeta?.titleAr,
    };

    const mainStatus = subMeta?.correspondingMainStatus || order.status;

    const updatedOrder: RepairRequest = {
      ...order,
      status: mainStatus,
      pickupDeliveryDetails: updatedPickup,
      history: [
        ...(order.history || []),
        {
          id: `log-${Date.now()}`,
          timestamp: nowStr,
          status: subStatus,
          note: note || subMeta?.descAr || subMeta?.titleAr,
          actor: 'admin',
        },
      ],
    };

    all[index] = updatedOrder;
    this.saveAllOrders(all);

    // Sync to Firestore
    DatabaseService.updateOrderStatus(orderId, mainStatus, 'ADMIN', note || subMeta?.descAr).catch((err) => {
      console.warn('Firestore updatePickupSubStatus sync:', err);
    });

    this.createNotification({
      orderId,
      status: mainStatus,
      titleAr: subMeta?.titleAr || 'متابعة التوصيل',
      titleFr: subMeta?.titleFr || 'Suivi Collecte',
      messageAr: subMeta?.descAr || `تحديث مرحلة استلام وإرجاع الهاتف (${orderId})`,
      messageFr: subMeta?.descFr || `Mise à jour collecte & retour (${orderId})`,
    });

    return updatedOrder;
  },

  // Update final price
  updateFinalPrice(orderId: string, finalPrice: number, note?: string): RepairRequest | null {
    const all = this.getAllOrders();
    const index = all.findIndex((o) => o.id.toUpperCase() === orderId.toUpperCase());
    if (index === -1) return null;

    const order = all[index];
    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 16);

    const updatedOrder: RepairRequest = {
      ...order,
      finalPrice,
      history: [
        ...(order.history || []),
        {
          id: `log-${Date.now()}`,
          timestamp: nowStr,
          status: order.status,
          note: note || `تم تحديث السعر النهائي إلى ${finalPrice.toLocaleString()} دج`,
          actor: 'admin',
        },
      ],
    };

    all[index] = updatedOrder;
    this.saveAllOrders(all);

    // Sync to Firestore
    DatabaseService.updateOrderPricing(orderId, finalPrice, note).catch((err) => {
      console.warn('Firestore updateFinalPrice sync:', err);
    });

    return updatedOrder;
  },

  // Update internal notes (Admin notes)
  updateInternalNotes(orderId: string, internalNotes: string): RepairRequest | null {
    const all = this.getAllOrders();
    const index = all.findIndex((o) => o.id.toUpperCase() === orderId.toUpperCase());
    if (index === -1) return null;

    const updatedOrder: RepairRequest = {
      ...all[index],
      internalNotes,
    };

    all[index] = updatedOrder;
    this.saveAllOrders(all);
    return updatedOrder;
  },

  // Update pickup & delivery metadata (Driver name, pickup address, return address)
  updatePickupDeliveryDetails(orderId: string, details: Partial<PickupDeliveryDetails>): RepairRequest | null {
    const all = this.getAllOrders();
    const index = all.findIndex((o) => o.id.toUpperCase() === orderId.toUpperCase());
    if (index === -1) return null;

    const order = all[index];
    const updatedOrder: RepairRequest = {
      ...order,
      pickupDeliveryDetails: {
        ...(order.pickupDeliveryDetails || {}),
        ...details,
      },
    };

    all[index] = updatedOrder;
    this.saveAllOrders(all);
    return updatedOrder;
  },

  // Notifications management
  getNotifications(): InAppNotification[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY_NOTIFICATIONS);
      if (data) {
        return JSON.parse(data);
      }
    } catch {
      // ignore
    }
    return [];
  },

  createNotification(notif: Omit<InAppNotification, 'id' | 'timestamp' | 'isRead'>) {
    const newNotif: InAppNotification = {
      ...notif,
      id: `notif-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      isRead: false,
    };

    try {
      const list = this.getNotifications();
      const updated = [newNotif, ...list].slice(0, 20); // keep last 20
      localStorage.setItem(STORAGE_KEY_NOTIFICATIONS, JSON.stringify(updated));
      notifySubscribers();
    } catch {
      // ignore
    }
  },

  markNotificationAsRead(notifId: string) {
    try {
      const list = this.getNotifications();
      const updated = list.map((n) => (n.id === notifId ? { ...n, isRead: true } : n));
      localStorage.setItem(STORAGE_KEY_NOTIFICATIONS, JSON.stringify(updated));
      notifySubscribers();
    } catch {
      // ignore
    }
  },

  markAllNotificationsAsRead() {
    try {
      const list = this.getNotifications();
      const updated = list.map((n) => ({ ...n, isRead: true }));
      localStorage.setItem(STORAGE_KEY_NOTIFICATIONS, JSON.stringify(updated));
      notifySubscribers();
    } catch {
      // ignore
    }
  },

  // Calculate statistics for Admin Dashboard
  getOrderStats() {
    const orders = this.getAllOrders();

    const newOrders = orders.filter((o) => o.status === 'NEW').length;
    const inRepair = orders.filter((o) =>
      ['CONFIRMED', 'TECHNICIAN_ON_WAY', 'PHONE_PICKED_UP', 'DIAGNOSIS', 'REPAIRING'].includes(o.status)
    ).length;
    const readyOrders = orders.filter((o) => o.status === 'READY').length;
    const completedOrders = orders.filter((o) => o.status === 'DELIVERED').length;
    const cancelledOrders = orders.filter((o) => o.status === 'CANCELLED').length;

    const totalRevenue = orders
      .filter((o) => o.status === 'DELIVERED')
      .reduce((sum, o) => sum + (o.finalPrice || o.estimatedTotal || 0), 0);

    return {
      total: orders.length,
      newOrders,
      inRepair,
      readyOrders,
      completedOrders,
      cancelledOrders,
      totalRevenue,
    };
  },

  // Reset database to initial mock dataset
  resetToDefaults() {
    try {
      localStorage.setItem(STORAGE_KEY_ALL_ORDERS, JSON.stringify(DEFAULT_INITIAL_ORDERS));
      localStorage.setItem(STORAGE_KEY_CLIENT_ORDER_IDS, JSON.stringify(['ZP-000001']));
      localStorage.setItem(STORAGE_KEY_COUNTER, '4');
      localStorage.removeItem(STORAGE_KEY_NOTIFICATIONS);
      notifySubscribers();
    } catch {
      // ignore
    }
  },
};
