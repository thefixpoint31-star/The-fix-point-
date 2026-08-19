import { BrandItem, ProblemOption, PriceItem, OfferItem, OranCommune, RepairRequest } from '../types';

export const ORAN_COMMUNES: OranCommune[] = [
  { id: 'oran_centre', nameAr: 'وهران وسط (Oran Centre)', nameFr: 'Oran Centre (Plateau / Ville Nouvelle)', baseDeliveryFee: 2000, estimatedTravelTime: '15-25 min' },
  { id: 'akid_lotfi', nameAr: 'عقيد لطفي (Akid Lotfi)', nameFr: 'Akid Lotfi', baseDeliveryFee: 2000, estimatedTravelTime: '20-30 min' },
  { id: 'bir_el_djir', nameAr: 'بئر الجير (Bir El Djir)', nameFr: 'Bir El Djir (Uranal, Belgaïd)', baseDeliveryFee: 2000, estimatedTravelTime: '25-35 min' },
  { id: 'maraval', nameAr: 'مارافال (Maraval / Yaghmoracen)', nameFr: 'Maraval / Yaghmoracen', baseDeliveryFee: 2000, estimatedTravelTime: '20-30 min' },
  { id: 'es_senia', nameAr: 'السانية (Es Senia)', nameFr: 'Es Senia (Cité Universitaire / Aéroport)', baseDeliveryFee: 2000, estimatedTravelTime: '25-35 min' },
  { id: 'canastel', nameAr: 'كناستيل (Canastel)', nameFr: 'Canastel / Bel Air', baseDeliveryFee: 2000, estimatedTravelTime: '25-35 min' },
  { id: 'gambetta', nameAr: 'غامبيطة (Gambetta)', nameFr: 'Gambetta / Point du Jour', baseDeliveryFee: 2000, estimatedTravelTime: '15-25 min' },
  { id: 'hai_khemisti', nameAr: 'حي خميستي (Haï Khemisti / Courbet)', nameFr: 'Haï Khemisti / Courbet', baseDeliveryFee: 2000, estimatedTravelTime: '20-30 min' },
  { id: 'castors', nameAr: 'الكاستور (Les Castors / El Othmania)', nameFr: 'Les Castors / El Othmania', baseDeliveryFee: 2000, estimatedTravelTime: '15-25 min' },
  { id: 'seddikia', nameAr: 'الصديقية (Seddikia / Carteaux)', nameFr: 'Seddikia / Carteaux', baseDeliveryFee: 2000, estimatedTravelTime: '20-30 min' },
  { id: 'petit_lac', nameAr: 'البحيرة الصغيرة (Petit Lac / Ibn Sina)', nameFr: 'Petit Lac / Haï Ibn Sina', baseDeliveryFee: 2000, estimatedTravelTime: '25-35 min' },
  { id: 'arzew', nameAr: 'أرزيو (Arzew)', nameFr: 'Arzew', baseDeliveryFee: 3000, estimatedTravelTime: '40-50 min' },
  { id: 'ain_el_turk', nameAr: 'عين الترك (Aïn El Turk)', nameFr: 'Aïn El Turk / Bousfer', baseDeliveryFee: 2500, estimatedTravelTime: '35-45 min' },
  { id: 'sidi_chami', nameAr: 'سيدي الشحمي (Sidi Chami)', nameFr: 'Sidi Chami', baseDeliveryFee: 2500, estimatedTravelTime: '30-40 min' },
  { id: 'misserghin', nameAr: 'مسرغين (Misserghin / Zabana)', nameFr: 'Misserghin / Pôle Zabana', baseDeliveryFee: 2500, estimatedTravelTime: '35-45 min' },
];

export const BRANDS: BrandItem[] = [
  {
    id: 'apple',
    name: 'Apple',
    popularModels: [
      'iPhone 16 Pro Max', 'iPhone 16 Pro', 'iPhone 16',
      'iPhone 15 Pro Max', 'iPhone 15 Pro', 'iPhone 15', 'iPhone 15 Plus',
      'iPhone 14 Pro Max', 'iPhone 14 Pro', 'iPhone 14', 'iPhone 14 Plus',
      'iPhone 13 Pro Max', 'iPhone 13 Pro', 'iPhone 13', 'iPhone 13 Mini',
      'iPhone 12 Pro Max', 'iPhone 12 Pro', 'iPhone 12', 'iPhone 12 Mini',
      'iPhone 11 Pro Max', 'iPhone 11 Pro', 'iPhone 11',
      'iPhone X / XS / XR', 'iPhone 8 / 7 / SE'
    ]
  },
  {
    id: 'samsung',
    name: 'Samsung',
    popularModels: [
      'Galaxy S24 Ultra', 'Galaxy S24+', 'Galaxy S24',
      'Galaxy S23 Ultra', 'Galaxy S23+', 'Galaxy S23',
      'Galaxy S22 Ultra', 'Galaxy S22',
      'Galaxy A55 5G', 'Galaxy A54 5G', 'Galaxy A35 5G', 'Galaxy A34 5G',
      'Galaxy A25 5G', 'Galaxy A15', 'Galaxy A14', 'Galaxy A05s',
      'Galaxy Z Fold 5 / 6', 'Galaxy Z Flip 5 / 6',
      'Galaxy Note 20 Ultra', 'Galaxy S21 FE'
    ]
  },
  {
    id: 'xiaomi',
    name: 'Xiaomi',
    popularModels: [
      'Xiaomi 14 Ultra', 'Xiaomi 14', 'Xiaomi 13T Pro', 'Xiaomi 13T',
      'Xiaomi 13 Pro', 'Xiaomi 12 Pro', 'Xiaomi 12',
      'Xiaomi Mi 11', 'Xiaomi Mi 10T'
    ]
  },
  {
    id: 'redmi',
    name: 'Redmi',
    popularModels: [
      'Redmi Note 13 Pro+ 5G', 'Redmi Note 13 Pro', 'Redmi Note 13 4G',
      'Redmi Note 12 Pro+ 5G', 'Redmi Note 12 Pro', 'Redmi Note 12',
      'Redmi Note 11 Pro', 'Redmi Note 11',
      'Redmi 13C', 'Redmi 12', 'Redmi 10C', 'Redmi 9A / 9C'
    ]
  },
  {
    id: 'oppo',
    name: 'Oppo',
    popularModels: [
      'Oppo Reno 11 Pro', 'Oppo Reno 11', 'Oppo Reno 10 Pro', 'Oppo Reno 8',
      'Oppo A98 5G', 'Oppo A78 4G', 'Oppo A58', 'Oppo A38', 'Oppo A18',
      'Oppo Find X6 Pro', 'Oppo Find X5'
    ]
  },
  {
    id: 'realme',
    name: 'Realme',
    popularModels: [
      'Realme 12 Pro+ 5G', 'Realme 12 5G', 'Realme 11 Pro+', 'Realme 11',
      'Realme C67', 'Realme C55', 'Realme C53', 'Realme C33',
      'Realme GT 6', 'Realme GT Neo'
    ]
  },
  {
    id: 'oneplus',
    name: 'OnePlus',
    popularModels: [
      'OnePlus 12', 'OnePlus 12R', 'OnePlus 11', 'OnePlus 10 Pro',
      'OnePlus Nord 3 5G', 'OnePlus Nord CE 3 Lite', 'OnePlus Nord 2T'
    ]
  },
  {
    id: 'infinix',
    name: 'Infinix',
    popularModels: [
      'Infinix Note 40 Pro', 'Infinix Note 30 Pro', 'Infinix Note 12',
      'Infinix Hot 40 Pro', 'Infinix Hot 30', 'Infinix Hot 20',
      'Infinix Smart 8', 'Infinix GT 20 Pro'
    ]
  },
  {
    id: 'tecno',
    name: 'Tecno',
    popularModels: [
      'Tecno Camon 30 Pro', 'Tecno Camon 20 Pro', 'Tecno Spark 20 Pro',
      'Tecno Spark 20', 'Tecno Spark 10 Pro', 'Tecno Pova 6 Pro'
    ]
  },
  {
    id: 'honor',
    name: 'Honor',
    popularModels: [
      'Honor Magic 6 Pro', 'Honor 200 Pro', 'Honor 90', 'Honor 70',
      'Honor X9b', 'Honor X8b', 'Honor X7b', 'Honor X6a'
    ]
  },
  {
    id: 'huawei',
    name: 'Huawei',
    popularModels: [
      'Huawei P60 Pro', 'Huawei Mate 50 Pro', 'Huawei Nova 11', 'Huawei Nova 10',
      'Huawei Nova 9', 'Huawei Y9a', 'Huawei P30 Pro'
    ]
  },
  {
    id: 'google',
    name: 'Google',
    popularModels: [
      'Pixel 9 Pro XL', 'Pixel 9 Pro', 'Pixel 9',
      'Pixel 8 Pro', 'Pixel 8', 'Pixel 8a',
      'Pixel 7 Pro', 'Pixel 7', 'Pixel 7a', 'Pixel 6 Pro'
    ]
  },
  {
    id: 'other',
    name: 'أخرى / Autre',
    popularModels: [
      'موديل آخر / Autre modèle', 'Nokia', 'Sony Xperia', 'Asus ROG Phone', 'Motorola'
    ]
  }
];

export const REPAIR_PROBLEMS: ProblemOption[] = [
  {
    id: 'screen',
    nameAr: 'شاشة مكسورة',
    nameFr: 'Écran cassé',
    descAr: 'كسر في الزجاج، شاشة سوداء، خطوط أو بقع، أو توقف اللمس',
    descFr: 'Vitre fissurée, écran noir, lignes/taches ou tactile bloqué',
    iconName: 'Smartphone',
    // Screen prices are resolved dynamically from The Fix Point database by phone model
  },
  {
    id: 'battery',
    nameAr: 'بطارية',
    nameFr: 'Batterie',
    descAr: 'تفريغ سريع، انتفاخ، انطفاء مفاجئ أو ضعف أداء البطارية',
    descFr: 'Décharge rapide, gonflement, extinction inopinée ou faible autonomie',
    iconName: 'BatteryCharging',
    baseEstimatedPrice: 4500
  },
  {
    id: 'charging',
    nameAr: 'الهاتف لا يشحن',
    nameFr: 'Problème de charge',
    descAr: 'تلف منفذ الشحن Type-C / Lightning، شحن بطيء أو عدم الاستجابة',
    descFr: 'Connecteur abîmé, faux contact, charge très lente ou nulle',
    iconName: 'Zap',
    baseEstimatedPrice: 2500
  },
  {
    id: 'wont_turn_on',
    nameAr: 'الهاتف لا يشتغل',
    nameFr: 'Téléphone ne s\'allume pas',
    descAr: 'انطفاء تام، تجميد على الشعار (Bootloop) أو ماس كهربائي',
    descFr: 'Éteint totalement, bloqué sur logo ou problème de carte mère',
    iconName: 'PowerOff',
  },
  {
    id: 'camera',
    nameAr: 'الكاميرا',
    nameFr: 'Caméra',
    descAr: 'زجاج مكسور، صورة ضبابية، اهتزاز أو تعطل الكاميرا الأمامية/الخلفية',
    descFr: 'Lentille cassée, flou, tremblement ou caméra noire',
    iconName: 'Camera',
  },
  {
    id: 'speaker',
    nameAr: 'الصوت',
    nameFr: 'Haut-parleur & Micro',
    descAr: 'انقطاع صوت المكالمات، وشيش السماعة، أو تعطل الميكروفون',
    descFr: 'Son faible ou grésillant, micro muet, écouteur d\'appel HS',
    iconName: 'Volume2',
  },
  {
    id: 'network',
    nameAr: 'الشبكة والواي فاي',
    nameFr: 'Réseau & Wi-Fi',
    descAr: 'لا توجد خدمة، مشكلة في الشريحة SIM، أو ضعف استقبال Wi-Fi/Bluetooth',
    descFr: 'Aucun service, problème carte SIM ou Wi-Fi grisé / faible',
    iconName: 'Wifi',
  },
  {
    id: 'liquid_damage',
    nameAr: 'أضرار السوائل',
    nameFr: 'Dégâts liquides',
    descAr: 'سقوط في الماء، أكسدة المكونات واللوحة الأم (نزع الأكسدة بالألتراسونيك)',
    descFr: 'Tombé dans l\'eau, oxydation circuits et désoxydation atelier',
    iconName: 'Droplets',
  },
  {
    id: 'software',
    nameAr: 'مشكلة في النظام',
    nameFr: 'Problème logiciel',
    descAr: 'فلاش، تحديث نظام، استرجاع بيانات، أو تجاوز قفل الهاتف',
    descFr: 'Flashage, mise à jour, réinitialisation ou récupération de données',
    iconName: 'Cpu',
    baseEstimatedPrice: 2000
  },
  {
    id: 'other',
    nameAr: 'أخرى',
    nameFr: 'Autre problème',
    descAr: 'أزرار الصوت/التشغيل، البصمة، الظهر الزجاجي أو مشكلة أخرى',
    descFr: 'Boutons volume/power, Face ID / empreinte, dos en verre, etc.',
    iconName: 'Wrench',
  }
];

export const SAMPLE_PRICE_LIST: PriceItem[] = [
  // Écrans (Calculated with real The Fix Point part price + labor tier)
  { id: 'p1', category: 'screen', brand: 'Apple', model: 'iPhone 16 Pro Max', repairNameAr: 'تغيير شاشة أصلية Super Retina XDR', repairNameFr: 'Remplacement Écran OLED Original', startingPrice: 58000, warrantyMonths: 3, durationMinutes: 45 },
  { id: 'p2', category: 'screen', brand: 'Apple', model: 'iPhone 15 Pro Max', repairNameAr: 'تغيير شاشة أصلية Super Retina XDR', repairNameFr: 'Remplacement Écran OLED Original', startingPrice: 52000, warrantyMonths: 3, durationMinutes: 45 },
  { id: 'p3', category: 'screen', brand: 'Apple', model: 'iPhone 15 Plus', repairNameAr: 'تغيير شاشة أصلية OLED', repairNameFr: 'Remplacement Écran OLED Original', startingPrice: 38000, warrantyMonths: 3, durationMinutes: 40 },
  { id: 'p4', category: 'screen', brand: 'Apple', model: 'iPhone 14 Pro Max', repairNameAr: 'تغيير شاشة أصلية Super Retina XDR', repairNameFr: 'Remplacement Écran OLED Original', startingPrice: 45000, warrantyMonths: 3, durationMinutes: 40 },
  { id: 'p5', category: 'screen', brand: 'Apple', model: 'iPhone 13 Pro Max', repairNameAr: 'تغيير شاشة أصلية OLED 120Hz', repairNameFr: 'Remplacement Écran OLED 120Hz Original', startingPrice: 40000, warrantyMonths: 3, durationMinutes: 40 },
  { id: 'p6', category: 'screen', brand: 'Apple', model: 'iPhone 13', repairNameAr: 'تغيير شاشة أصلية OLED', repairNameFr: 'Remplacement Écran OLED Original', startingPrice: 19500, warrantyMonths: 3, durationMinutes: 30 },
  { id: 'p7', category: 'screen', brand: 'Apple', model: 'iPhone 12 / 12 Pro', repairNameAr: 'تغيير شاشة أصلية OLED', repairNameFr: 'Remplacement Écran OLED Original', startingPrice: 18500, warrantyMonths: 3, durationMinutes: 30 },
  { id: 'p8', category: 'screen', brand: 'Apple', model: 'iPhone 11', repairNameAr: 'تغيير شاشة أصلية Liquid Retina', repairNameFr: 'Remplacement Écran Liquid Retina', startingPrice: 10500, warrantyMonths: 3, durationMinutes: 30 },
  { id: 'p9', category: 'screen', brand: 'Samsung', model: 'Galaxy S24 Ultra', repairNameAr: 'تغيير شاشة Dynamic AMOLED 2X', repairNameFr: 'Remplacement Écran Dynamic AMOLED 2X', startingPrice: 51000, warrantyMonths: 3, durationMinutes: 45 },
  { id: 'p10', category: 'screen', brand: 'Samsung', model: 'Galaxy S23 Ultra', repairNameAr: 'تغيير شاشة Dynamic AMOLED 2X', repairNameFr: 'Remplacement Écran Dynamic AMOLED 2X', startingPrice: 44000, warrantyMonths: 3, durationMinutes: 40 },
  { id: 'p11', category: 'screen', brand: 'Samsung', model: 'Galaxy A55 5G', repairNameAr: 'تغيير شاشة Super AMOLED 120Hz', repairNameFr: 'Remplacement Écran Super AMOLED 120Hz', startingPrice: 19000, warrantyMonths: 3, durationMinutes: 35 },
  { id: 'p12', category: 'screen', brand: 'Samsung', model: 'Galaxy A54 5G', repairNameAr: 'تغيير شاشة Super AMOLED 120Hz', repairNameFr: 'Remplacement Écran Super AMOLED 120Hz', startingPrice: 17000, warrantyMonths: 3, durationMinutes: 35 },
  { id: 'p13', category: 'screen', brand: 'Samsung', model: 'Galaxy A34 5G', repairNameAr: 'تغيير شاشة Super AMOLED', repairNameFr: 'Remplacement Écran Super AMOLED', startingPrice: 12500, warrantyMonths: 3, durationMinutes: 30 },
  { id: 'p14', category: 'screen', brand: 'Samsung', model: 'Galaxy A15', repairNameAr: 'تغيير شاشة Super AMOLED', repairNameFr: 'Remplacement Écran Super AMOLED', startingPrice: 8500, warrantyMonths: 3, durationMinutes: 30 },
  { id: 'p15', category: 'screen', brand: 'Redmi', model: 'Redmi Note 13 Pro+ 5G', repairNameAr: 'تغيير شاشة أصلية AMOLED 1.5K', repairNameFr: 'Remplacement Écran AMOLED 1.5K', startingPrice: 19000, warrantyMonths: 3, durationMinutes: 35 },
  { id: 'p16', category: 'screen', brand: 'Redmi', model: 'Redmi Note 13', repairNameAr: 'تغيير شاشة أصلية AMOLED', repairNameFr: 'Remplacement Écran AMOLED Original', startingPrice: 9500, warrantyMonths: 3, durationMinutes: 30 },
  { id: 'p17', category: 'screen', brand: 'Xiaomi', model: 'Xiaomi 13T', repairNameAr: 'تغيير شاشة AMOLED 144Hz', repairNameFr: 'Remplacement Écran AMOLED 144Hz', startingPrice: 23000, warrantyMonths: 3, durationMinutes: 35 },
  { id: 'p18', category: 'screen', brand: 'Oppo', model: 'Oppo Reno 11 Pro', repairNameAr: 'تغيير شاشة OLED 3D Curved', repairNameFr: 'Remplacement Écran OLED Incurvé', startingPrice: 23000, warrantyMonths: 3, durationMinutes: 35 },
  { id: 'p19', category: 'screen', brand: 'Oppo', model: 'Oppo Reno 8', repairNameAr: 'تغيير شاشة AMOLED', repairNameFr: 'Remplacement Écran AMOLED', startingPrice: 12500, warrantyMonths: 3, durationMinutes: 30 },
  { id: 'p20', category: 'screen', brand: 'Realme', model: 'Realme 12 Pro+ 5G', repairNameAr: 'تغيير شاشة OLED 120Hz', repairNameFr: 'Remplacement Écran OLED 120Hz', startingPrice: 21000, warrantyMonths: 3, durationMinutes: 35 },
  
  // Batteries
  { id: 'p21', category: 'battery', brand: 'Apple', model: 'iPhone 13 / 13 Pro', repairNameAr: 'تغيير بطارية أصلية (صحة 100%)', repairNameFr: 'Remplacement Batterie Origine 100%', startingPrice: 7500, warrantyMonths: 6, durationMinutes: 25 },
  { id: 'p22', category: 'battery', brand: 'Apple', model: 'iPhone 12 / 12 Pro', repairNameAr: 'تغيير بطارية أصلية', repairNameFr: 'Remplacement Batterie Haute Capacité', startingPrice: 6500, warrantyMonths: 6, durationMinutes: 25 },
  { id: 'p23', category: 'battery', brand: 'Samsung', model: 'Galaxy S22 / S23', repairNameAr: 'تغيير بطارية أصلية Samsung Service Pack', repairNameFr: 'Batterie Originale Samsung Service Pack', startingPrice: 6500, warrantyMonths: 6, durationMinutes: 30 },
  { id: 'p24', category: 'battery', brand: 'Redmi', model: 'Redmi Note 12 / 13', repairNameAr: 'تغيير بطارية 5000mAh أصلية', repairNameFr: 'Remplacement Batterie 5000mAh Origine', startingPrice: 4500, warrantyMonths: 6, durationMinutes: 25 },

  // Connecteur de charge
  { id: 'p25', category: 'charging', brand: 'Apple', model: 'iPhone 11 à 14', repairNameAr: 'تغيير فلكس مدخل الشحن Lightning', repairNameFr: 'Remplacement Nappe Connecteur Lightning', startingPrice: 4500, warrantyMonths: 3, durationMinutes: 35 },
  { id: 'p26', category: 'charging', brand: 'Samsung', model: 'Galaxy A Series (A14/A34/A54)', repairNameAr: 'تغيير بطاقة مدخل الشحن Type-C', repairNameFr: 'Remplacement Sub-Board Charge Type-C', startingPrice: 3500, warrantyMonths: 3, durationMinutes: 25 },
  
  // Caméras & Système
  { id: 'p27', category: 'camera', brand: 'Apple', model: 'iPhone 13 Pro', repairNameAr: 'تغيير وحدة الكاميرا الخلفية', repairNameFr: 'Remplacement Module Caméra Arrière', startingPrice: 14000, warrantyMonths: 3, durationMinutes: 30 },
  { id: 'p28', category: 'system', brand: 'All', model: 'Tous modèles', repairNameAr: 'فلاش، حل مشكلة التوقف وإعادة التشغيل', repairNameFr: 'Flashage logiciel & déblocage système', startingPrice: 2000, warrantyMonths: 1, durationMinutes: 20 },
  { id: 'p29', category: 'other', brand: 'All', model: 'Diagnostic complet en atelier', repairNameAr: 'فحص إلكتروني دقيق بالمايكروسكوب', repairNameFr: 'Diagnostic carte mère approfondi', startingPrice: null, warrantyMonths: 0, durationMinutes: 60 }
];

export const PROMOTIONAL_OFFERS: OfferItem[] = [
  {
    id: 'off_1',
    titleAr: 'عرض حماية الشاشة المجانية',
    titleFr: 'Pack Protection Écran Offert',
    descriptionAr: 'عند تغيير أي شاشة هاتف، احصل مجاناً على زجاج حماية مقوى 9D فائق الجودة وتركيب احترافي.',
    descriptionFr: 'Pour tout remplacement d\'écran, un verre trempé 9D haute protection est offert avec pose pro.',
    originalPrice: 2000,
    discountedPrice: 0,
    discountPercentage: 100,
    promoCode: 'VERRE9D',
    validUntil: '31/08/2026',
    tagAr: 'الأكثر طلباً بوهران',
    tagFr: 'Best-Seller Oran'
  },
  {
    id: 'off_2',
    titleAr: 'تخفيض 20% على تصليح البطاريات',
    titleFr: '-20% sur Remplacement Batterie',
    descriptionAr: 'استعد طاقة هاتفك مع بطاريات أصلية وضمان 6 أشهر كاملة في منزلك بوهران.',
    descriptionFr: 'Redonnez vie à votre smartphone avec nos batteries certifiées et garantie 6 mois.',
    originalPrice: 7500,
    discountedPrice: 6000,
    discountPercentage: 20,
    promoCode: 'BATTERY20',
    validUntil: '15/09/2026',
    tagAr: 'ضمان 6 أشهر',
    tagFr: 'Garantie 6 Mois'
  },
  {
    id: 'off_3',
    titleAr: 'خصم خاص على خدمة استلام وإرجاع الهاتف',
    titleFr: 'Offre Spéciale Collecte & Retour',
    descriptionAr: 'استفد من خصم 1000 دج على تكلفة التوصيل عند طلب خدمة استلام وإرجاع الهاتف من حي عقيد لطفي وبئر الجير.',
    descriptionFr: 'Profitez de 1000 DA de réduction sur les frais de collecte/retour à Akid Lotfi & Bir El Djir.',
    originalPrice: 2000,
    discountedPrice: 1000,
    discountPercentage: 50,
    promoCode: 'FIXORAN50',
    validUntil: '30/09/2026',
    tagAr: 'عرض خاص بوهران',
    tagFr: 'Offre Spéciale Oran'
  }
];

export const INITIAL_REQUESTS: RepairRequest[] = [
  {
    id: 'ZP-1024',
    serviceType: 'pickup_return',
    brand: 'Apple',
    model: 'iPhone 13',
    problemId: 'screen',
    problemNameAr: 'شاشة مكسورة',
    problemNameFr: 'Écran cassé',
    problemDescription: 'سقط الهاتف على أرضية صلبة، الشاشة فيها شروخ ولم يعد اللمس يستجيب في النصف السفلي.',
    customerName: 'ياسين زناتي',
    phoneNumber: '0550 12 34 56',
    commune: 'عقيد لطفي (Akid Lotfi)',
    address: 'إقامة النرجس، عمارة ب، الطابق 3، وهران',
    locationInstructions: 'بجانب بنك الخليج الجزائر، يرجى الاتصال عند الوصول',
    preferredDate: 'اليوم (Aujourd\'hui)',
    preferredTime: '14:00 - 16:00',
    screenPartPrice: 14500,
    laborFee: 5000,
    isPriceKnown: true,
    estimatedRepairPrice: 19500,
    travelFee: 2000,
    estimatedTotal: 21500,
    status: 'TECHNICIAN_ON_WAY',
    createdAt: '2026-08-16 11:30',
    technicianNotes: 'التقني أمين في الطريق لاستلام الهاتف لإحضاره لورشة The Fix Point.'
  },
  {
    id: 'ZP-000002',
    serviceType: 'at_home',
    brand: 'Samsung',
    model: 'Galaxy A54 5G',
    problemId: 'battery',
    problemNameAr: 'بطارية',
    problemNameFr: 'Batterie',
    problemDescription: 'البطارية تفرغ بسرعة وتنطفئ عند 30%',
    customerName: 'فاطمة الزهراء',
    phoneNumber: '0770 98 76 54',
    commune: 'وهران وسط (Oran Centre)',
    address: 'شارع العربي بن مهيدي، عمارة 14',
    preferredDate: 'أمس',
    preferredTime: '10:00 - 12:00',
    screenPartPrice: null,
    laborFee: 2000,
    isPriceKnown: true,
    estimatedRepairPrice: 6500,
    travelFee: 2000,
    estimatedTotal: 8500,
    status: 'READY',
    createdAt: '2026-08-15 09:15',
    technicianNotes: 'تم تغيير البطارية الأصلية بنجاح وتسليم فاتورة وضمان 6 أشهر.'
  },
  {
    id: 'ZP-000003',
    serviceType: 'parts_delivery',
    brand: 'Redmi',
    model: 'Redmi Note 12 Pro',
    problemId: 'charging',
    problemNameAr: 'الهاتف لا يشحن',
    problemNameFr: 'Connecteur de charge',
    problemDescription: 'توصيل بطاقة شحن أصلية Type-C',
    customerName: 'كريم م.',
    phoneNumber: '0661 45 67 89',
    commune: 'بئر الجير (Bir El Djir)',
    address: 'حي ميلينيوم، بجانب صيدلية النور',
    preferredDate: '14 أوت 2026',
    preferredTime: '17:00 - 19:00',
    screenPartPrice: null,
    laborFee: 2000,
    isPriceKnown: true,
    estimatedRepairPrice: 4500,
    travelFee: 2000,
    estimatedTotal: 6500,
    status: 'DELIVERED',
    createdAt: '2026-08-14 16:20',
    technicianNotes: 'تم تسليم القطعة الأصلية والتأكد من توافقها مع الزبون.'
  }
];
