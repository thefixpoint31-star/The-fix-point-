export type Language = 'ar' | 'fr';

export type ServiceType = 'at_home' | 'parts_delivery' | 'pickup_return';

export type ScreenTab = 'home' | 'request' | 'tracking' | 'prices' | 'offers' | 'account' | 'admin';

export type UserRole = 'CUSTOMER' | 'ADMIN' | 'COURIER';

// Official Order Statuses as requested
export type OrderStatus =
  | 'NEW'                    // طلب جديد
  | 'CONFIRMED'              // تم تأكيد الطلب
  | 'COURIER_ASSIGNED'       // تم تعيين عامل التوصيل
  | 'COURIER_ON_WAY'         // عامل التوصيل في الطريق (استلام)
  | 'TECHNICIAN_ON_WAY'      // التقني في الطريق
  | 'PHONE_PICKED_UP'        // تم استلام الهاتف
  | 'RECEIVED_AT_WORKSHOP'   // وصل إلى الورشة
  | 'DIAGNOSIS'              // جاري التشخيص
  | 'REPAIRING'              // جاري التصليح
  | 'READY_FOR_RETURN'       // جاهز للإرجاع
  | 'COURIER_RETURNING'      // عامل التوصيل في طريق العودة (إرجاع)
  | 'READY'                  // تم الانتهاء / جاهز
  | 'DELIVERED'              // تم التسليم بنجاح
  | 'CANCELLED';             // تم إلغاء الطلب

// Courier User Model
export interface CourierUser {
  id: string;                // e.g. 'courier-1'
  name: string;              // e.g. 'أمين دحماني (Amine Dahmani)'
  phoneNumber: string;       // e.g. '0555 44 33 22'
  pin: string;               // e.g. '1111'
  vehicleType: 'moto' | 'car' | 'scooter';
  vehiclePlate?: string;     // e.g. '12345-116-31'
  commune: string;           // e.g. 'وهران (Oran)'
  isActive: boolean;
  activeOrdersCount?: number;
  completedOrdersCount?: number;
  createdAt: string;
}

// Proof of Pickup Model
export interface ProofOfPickup {
  photoUrl?: string;         // صورة الهاتف عند الاستلام
  conditionNotes: string;    // حالة الجهاز e.g. خدوش بسيطة في الإطار
  accessories: string[];     // الملحقات المستلمة e.g. الهاتف فقط، الشاحن
  customAccessories?: string;// ملحقات إضافية
  timestamp: string;         // وقت الاستلام
  courierId: string;         // معرّف العامل
  courierName: string;       // اسم العامل
}

// Proof of Delivery Model
export interface ProofOfDelivery {
  photoUrl?: string;         // صورة إثبات التسليم
  deliveryNotes: string;     // ملاحظة التسليم
  amountCollected: number;   // قيمة الدفع المستلمة كاش
  isCashCollected: boolean;  // تأكيد استلام المبلغ
  isTestedWithCustomer: boolean; // تأكيد فحص الجهاز مع الزبون
  timestamp: string;         // وقت التسليم
  courierId: string;         // معرّف العامل
  courierName: string;       // اسم العامل
}

// Backward-compatible alias
export type RepairStatus = OrderStatus | 'submitted' | 'confirmed' | 'technician_en_route' | 'phone_collected' | 'diagnosing' | 'completed';

// Pickup and Return specific 9 sub-statuses
export type PickupSubStatus =
  | 'WAITING_DRIVER'       // في انتظار عامل التوصيل
  | 'DRIVER_ON_WAY'        // عامل التوصيل في الطريق
  | 'PHONE_PICKED_UP'      // تم استلام الهاتف
  | 'ARRIVED_AT_WORKSHOP'  // وصل إلى الورشة
  | 'DIAGNOSIS'            // قيد التشخيص
  | 'REPAIRING'            // قيد الإصلاح
  | 'READY_FOR_RETURN'     // جاهز للإرجاع
  | 'DRIVER_RETURNING'     // عامل التوصيل في طريق العودة
  | 'DELIVERED';           // تم التسليم

export interface OrderAuditLog {
  id: string;
  timestamp: string;
  status: OrderStatus | PickupSubStatus;
  note?: string;
  actor?: string; // 'client' | 'admin' | 'technician' | 'system'
}

export interface PickupDeliveryDetails {
  assignedDriver?: string;       // عامل التوصيل المطلوب (e.g. أمين / رشيد)
  pickupAddress?: string;        // عنوان الاستلام
  pickupTime?: string;           // وقت الاستلام
  returnAddress?: string;        // عنوان الإرجاع
  pickupStatus?: string;         // حالة الاستلام
  repairStatus?: string;         // حالة الإصلاح
  pickupSubStatus?: PickupSubStatus;
}

export interface InAppNotification {
  id: string;
  orderId: string;
  titleAr: string;
  titleFr: string;
  messageAr: string;
  messageFr: string;
  timestamp: string;
  isRead: boolean;
  status: OrderStatus;
}

export interface RepairRequest {
  id: string;                    // e.g. ZP-000001
  customerName: string;          // اسم الزبون
  phoneNumber: string;           // رقم الهاتف
  serviceType: ServiceType;      // نوع الخدمة
  brand: string;                 // ماركة الهاتف
  model: string;                 // موديل الهاتف
  problemId: string;             // معرّف المشكلة
  problemNameAr: string;         // نوع العطل بالعربية
  problemNameFr: string;         // نوع العطل بالفرنسية
  problemDescription?: string;   // وصف المشكلة
  mediaFiles?: string[];         // الصور إن وجدت
  commune: string;               // البلدية بوهران
  address: string;               // العنوان التفصيلي
  locationInstructions?: string; // إرشادات الوصول
  geoCoords?: { lat: number; lng: number }; // الموقع GPS إن سمح المستخدم
  preferredDate: string;         // التاريخ
  preferredTime: string;         // الوقت
  notes?: string;                // ملاحظات الزبون
  partPrice?: number | null;     // سعر القطعة
  screenPartPrice?: number | null; // توافق خلفي
  laborFee?: number | null;      // اليد العاملة
  travelFee: number;             // التنقل (2000 دج)
  discount?: number;             // الخصم
  discountAmount?: number;       // توافق خلفي
  promoCode?: string;            // كود التخفيض
  estimatedRepairPrice?: number | null; // سعر الصيانة
  isPriceKnown?: boolean;        // هل السعر معروف بدقة أم يحتاج فحص
  estimatedTotal: number | null; // المجموع التقريبي
  finalPrice?: number | null;    // السعر النهائي المحدد من الإدارة
  createdAt: string;             // تاريخ إنشاء الطلب
  status: OrderStatus;           // حالة الطلب
  internalNotes?: string;        // ملاحظات داخلية خاصة بالإدارة
  technicianNotes?: string;      // ملاحظات للزبون
  assignedCourierId?: string;    // معرّف عامل التوصيل المكلف
  assignedCourierName?: string;  // اسم عامل التوصيل المكلف
  assignedCourierPhone?: string; // رقم هاتف عامل التوصيل
  proofOfPickup?: ProofOfPickup; // إثبات استلام الجهاز مع الصور والملاحظات والملحقات
  proofOfDelivery?: ProofOfDelivery; // إثبات تسليم الجهاز مع تفاصيل الدفع
  pickupDeliveryDetails?: PickupDeliveryDetails; // تفاصيل خدمة الاستلام والإرجاع
  history?: OrderAuditLog[];     // سجل تتبع الحالات والتغييرات
}

export interface TimelineStep {
  status: OrderStatus | PickupSubStatus;
  titleAr: string;
  titleFr: string;
  descAr: string;
  descFr: string;
  time?: string;
  isCompleted: boolean;
  isCurrent: boolean;
}

export interface ScreenPriceRecord {
  id: string;
  brand: string;
  model: string;
  screenTypeAr: string; // e.g. 'شاشة أصلية OLED' / 'شاشة Super AMOLED'
  screenTypeFr: string; // e.g. 'Écran OLED Original' / 'Écran Super AMOLED'
  partPrice: number; // exact DZD screen part price from The Fix Point database
  warrantyMonths: number;
  durationMinutes: number;
  inStock?: boolean;
}

export interface BatteryPriceRecord {
  id: string;
  brand: string;
  model: string;
  batteryTypeAr: string; // e.g. 'بطارية أصلية عالية الكفاءة'
  batteryTypeFr: string; // e.g. 'Batterie Originale Haute Capacité'
  capacityMah?: number;
  partPrice: number; // exact DZD battery part price from Batteries_Updated
  warrantyMonths: number;
  durationMinutes: number;
  inStock?: boolean;
}

export interface GlobalCatalogRecord {
  id: string;
  category: 'screen' | 'battery' | 'charging' | 'camera' | 'speaker' | 'network' | 'software' | 'other';
  brand: string;
  model: string;
  itemNameAr: string;
  itemNameFr: string;
  partPrice: number | null; // null if requires diagnostic
  warrantyMonths: number;
  durationMinutes: number;
}

export interface PriceCatalogProduct {
  id: string;
  category: 'screen' | 'battery' | 'charging' | 'camera' | 'speaker' | 'motherboard' | 'software' | 'other';
  categoryNameAr: string;
  categoryNameFr: string;
  brand: string;
  model: string;
  partTypeAr: string; // نوع القطعة
  partTypeFr: string;
  partPrice: number | null; // سعر القطعة (null if diagnostic required)
  laborFee: number | null; // اليد العاملة (null if diagnostic required)
  customLaborFee?: number; // custom override if set by admin
  servicePrice: number | null; // سعر الخدمة = سعر القطعة + اليد العاملة
  travelFee: number; // التنقل (ابتداءً من 2,000 دج)
  discount: number; // الخصم
  estimatedTotal: number | null; // السعر التقريبي
  warrantyMonths: number;
  durationMinutes: number;
  inStock?: boolean;
}

export interface BrandItem {
  id: string;
  name: string;
  logo?: string;
  popularModels: string[];
}

export interface ProblemOption {
  id: string;
  nameAr: string;
  nameFr: string;
  descAr: string;
  descFr: string;
  iconName: string;
  baseEstimatedPrice?: number; // Starting price in DZD, or undefined for custom quote
}

export interface PriceItem {
  id: string;
  category: 'screen' | 'battery' | 'charging' | 'camera' | 'system' | 'other';
  brand: string;
  model: string;
  repairNameAr: string;
  repairNameFr: string;
  startingPrice: number | null; // null means "السعر يحدد بعد التشخيص"
  warrantyMonths: number;
  durationMinutes: number;
}

export interface OfferItem {
  id: string;
  titleAr: string;
  titleFr: string;
  descriptionAr: string;
  descriptionFr: string;
  originalPrice: number;
  discountedPrice: number;
  discountPercentage: number;
  promoCode: string;
  validUntil: string;
  tagAr: string;
  tagFr: string;
  serviceType?: ServiceType;
  applicableBrand?: string;
}

export interface OranCommune {
  id: string;
  nameAr: string;
  nameFr: string;
  baseDeliveryFee: number;
  estimatedTravelTime: string;
}
