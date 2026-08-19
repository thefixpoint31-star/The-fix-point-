import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language } from '../types';

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  toggleLang: () => void;
  isRtl: boolean;
  t: (key: string) => string;
}

const translations: Record<string, { ar: string; fr: string }> = {
  // Brand & Slogan
  appName: { ar: 'THE FIX POINT', fr: 'THE FIX POINT' },
  locationCity: { ar: 'وهران، الجزائر', fr: 'Oran, Algérie' },
  tagline: { ar: 'إصلاح هاتفك، أينما كنت', fr: 'Réparez votre téléphone, où que vous soyez' },
  subTagline: { ar: 'خدمة سريعة، قطع أصلية، والدفع عند الاستلام', fr: 'Service rapide, pièces d\'origine et paiement sur place' },

  // Navigation
  navHome: { ar: 'الرئيسية', fr: 'Accueil' },
  navRequest: { ar: 'اطلب تصليح', fr: 'Demande' },
  navTracking: { ar: 'التتبع', fr: 'Suivi' },
  navPrices: { ar: 'الأسعار', fr: 'Prix' },
  navOffers: { ar: 'العروض', fr: 'Offres' },
  navAccount: { ar: 'حسابي', fr: 'Mon compte' },

  // Services
  servicesTitle: { ar: 'خدماتنا في وهران', fr: 'Nos Services à Oran' },
  service1Title: { ar: 'تصليح عندك في مكانك', fr: 'Réparation à domicile' },
  service1Desc: { ar: 'نأتي إليك ونصلح هاتفك في مكانك', fr: 'Nous venons chez vous et réparons votre téléphone' },
  service1Badge: { ar: 'الأكثر راحة', fr: 'Le plus pratique' },

  service2Title: { ar: 'توصيل القطع إليك', fr: 'Livraison de pièces' },
  service2Desc: { ar: 'نوصل لك القطعة التي تحتاجها', fr: 'Nous livrons la pièce dont vous avez besoin' },
  service2Badge: { ar: 'توصيل سريع', fr: 'Livraison express' },

  service3Title: { ar: 'استلام الهاتف وإرجاعه', fr: 'Collecte et retour' },
  service3Desc: { ar: 'نرسل عاملًا لاستلام هاتفك، نصلحه في الورشة ثم نعيده إليك', fr: 'Nous envoyons un livreur récupérer votre téléphone, nous le réparons à l\'atelier puis nous vous le retournons' },
  service3Badge: { ar: 'خدمة ورشة متكاملة', fr: 'Service atelier complet' },

  // Travel Fee
  travelFeeNotice: { ar: 'التنقل داخل وهران ابتداءً من 2000 دج', fr: 'Déplacement à Oran à partir de 2000 DA' },
  travelFeeStarting: { ar: 'ابتداءً من 2000 دج', fr: 'À partir de 2000 DA' },
  singleTechBadge: { ar: 'تقني متخصص ومعتمد بوهران', fr: 'Technicien qualifié dédié à Oran' },
  noOnlinePayNotice: { ar: 'الدفع نقدًا عند الاستلام / بعد انتهاء التصليح', fr: 'Paiement en espèces à la livraison / après réparation' },

  // Request Flow Steps
  step1Title: { ar: 'نوع الخدمة', fr: 'Type de service' },
  step2Title: { ar: 'الجهاز', fr: 'Appareil' },
  step3Title: { ar: 'المشكلة', fr: 'Problème' },
  step4Title: { ar: 'التفاصيل', fr: 'Détails' },
  step5Title: { ar: 'تأكيد الطلب', fr: 'Confirmation' },

  // Request Form
  selectBrand: { ar: 'اختر العلامة التجارية', fr: 'Choisissez la marque' },
  selectModel: { ar: 'اختر أو اكتب الموديل', fr: 'Modèle de l\'appareil' },
  searchModelPlaceholder: { ar: 'ابحث عن الموديل (مثل: iPhone 13, Galaxy A54...)', fr: 'Rechercher un modèle (ex: iPhone 13, Galaxy A54...)' },
  selectProblem: { ar: 'ما هي المشكلة التي تواجهها؟', fr: 'Quel est le problème ?' },
  problemDetails: { ar: 'وصف إضافي للمشكلة (اختياري)', fr: 'Description du problème (optionnel)' },
  problemDetailsPlaceholder: { ar: 'وضح تفاصيل العطل، كيف حدث، أو أي ملاحظة تهم التقني...', fr: 'Décrivez la panne, les symptômes ou détails pour le technicien...' },
  uploadPhotosVideos: { ar: 'إرفاق صور أو فيديو للهاتف (اختياري)', fr: 'Ajouter photos ou vidéo de l\'appareil (optionnel)' },
  takePhoto: { ar: 'التقاط صورة', fr: 'Prendre une photo' },
  chooseFile: { ar: 'اختر من المعرض', fr: 'Choisir depuis la galerie' },

  // Details Form
  fullName: { ar: 'الاسم واللقب', fr: 'Nom complet' },
  fullNamePlaceholder: { ar: 'مثال: ياسين بن علي', fr: 'Ex: Yassine Benali' },
  phoneNumber: { ar: 'رقم الهاتف (الجزائر)', fr: 'Numéro de téléphone' },
  phonePlaceholder: { ar: '05 / 06 / 07 xx xx xx xx', fr: '05 / 06 / 07 xx xx xx xx' },
  communeOran: { ar: 'المنطقة / الحي بوهران', fr: 'Quartier / Commune à Oran' },
  selectCommune: { ar: 'اختر منطقتك في وهران', fr: 'Sélectionnez votre zone' },
  streetAddress: { ar: 'العنوان بالتفصيل', fr: 'Adresse détaillée' },
  streetAddressPlaceholder: { ar: 'اسم الشارع، رقم العمارة، الطابق...', fr: 'Rue, N° bâtiment, étage, repère...' },
  locationInstructions: { ar: 'توجيهات الوصول للموقع (معلم معروف)', fr: 'Indications pour le livreur (repère)' },
  locationInstructionsPlaceholder: { ar: 'مثال: بجانب مسجد القدس أو صيدلية الأمل...', fr: 'Ex: en face de la pharmacie, près du rond-point...' },
  useMyLocation: { ar: 'استخدم موقعي الحالي', fr: 'Utiliser ma position' },
  locatingGps: { ar: 'جاري تحديد الموقع...', fr: 'Localisation GPS en cours...' },
  locationCaptured: { ar: 'تم تحديد إحداثيات موقعك بنجاح', fr: 'Position GPS détectée avec succès' },
  preferredDate: { ar: 'اليوم المفضل', fr: 'Date souhaitée' },
  preferredTime: { ar: 'التوقيت المفضل', fr: 'Créneau horaire' },
  today: { ar: 'اليوم (سريع)', fr: 'Aujourd\'hui (Urgent)' },
  tomorrow: { ar: 'غداً', fr: 'Demain' },
  timeMorning: { ar: 'صباحاً (09:00 - 12:00)', fr: 'Matin (09:00 - 12:00)' },
  timeAfternoon: { ar: 'ظهراً (13:00 - 17:00)', fr: 'Après-midi (13:00 - 17:00)' },
  timeEvening: { ar: 'مساءً (17:00 - 20:00)', fr: 'Soir (17:00 - 20:00)' },
  orderNotes: { ar: 'ملاحظات إضافية', fr: 'Notes complémentaires' },

  // Summary & Confirmation
  summaryTitle: { ar: 'مراجعة وتأكيد الطلب', fr: 'Récapitulatif de la demande' },
  serviceLabel: { ar: 'الخدمة المطلوبة', fr: 'Service demandé' },
  deviceLabel: { ar: 'الجهاز', fr: 'Appareil' },
  problemLabel: { ar: 'المشكلة المصرح بها', fr: 'Problème signalé' },
  estimatedPriceLabel: { ar: 'السعر التقريبي للتصليح', fr: 'Prix indicatif réparation' },
  travelFeeLabel: { ar: 'رسوم التنقل / التوصيل', fr: 'Frais de déplacement / livraison' },
  estimatedTotalLabel: { ar: 'المجموع التقريبي', fr: 'Total estimé' },
  priceNotice1: { ar: 'السعر التقريبي', fr: 'Prix indicatif' },
  priceNotice2: { ar: 'السعر النهائي يحدد بعد فحص الهاتف.', fr: 'Le prix final est confirmé après diagnostic.' },
  paymentNotice: { ar: 'الدفع عند الاستلام بعد فحص الهاتف وتجربته.', fr: 'Paiement sur place après vérification et test.' },
  btnConfirmOrder: { ar: 'تأكيد الطلب الآن', fr: 'Confirmer la demande' },
  btnNext: { ar: 'المتابعة', fr: 'Continuer' },
  btnBack: { ar: 'رجوع', fr: 'Retour' },
  btnCancel: { ar: 'إلغاء', fr: 'Annuler' },

  // Success
  successTitle: { ar: 'تم إرسال طلبك بنجاح!', fr: 'Votre demande a été envoyée avec succès !' },
  orderNumberIs: { ar: 'رقم طلبك هو:', fr: 'Numéro de demande :' },
  contactPromise: { ar: 'سنتواصل معك لتأكيد الموعد.', fr: 'Nous vous contacterons pour confirmer le rendez-vous.' },
  contactPromiseDesc: { ar: 'سيقوم تقني The Fix Point بالاتصال بك هاتفياً للتأكيد والانطلاق إليك.', fr: 'Le technicien The Fix Point vous appellera directement pour valider et se déplacer.' },
  btnTrackOrder: { ar: 'تتبع حالة الطلب', fr: 'Suivre ma demande' },
  btnHome: { ar: 'العودة للرئيسية', fr: 'Retour à l\'accueil' },
  btnWhatsAppContact: { ar: 'تواصل عبر واتساب', fr: 'Contacter sur WhatsApp' },
  btnCallDirect: { ar: 'اتصال هاتفي مباشر', fr: 'Appeler directement' },

  // Tracking
  trackingHeader: { ar: 'تتبع حالة التصليح', fr: 'Suivi de réparation en direct' },
  searchTrackingPlaceholder: { ar: 'أدخل رقم الطلب (مثال: ZP-1024)', fr: 'Entrez le N° de demande (ex: ZP-1024)' },
  btnSearch: { ar: 'بحث', fr: 'Rechercher' },
  noOrderFound: { ar: 'لم يتم العثور على طلب بهذا الرقم.', fr: 'Aucune demande trouvée avec ce numéro.' },
  statusSubmitted: { ar: 'تم إرسال الطلب', fr: 'Demande envoyée' },
  statusConfirmed: { ar: 'تم تأكيد الطلب', fr: 'Demande confirmée' },
  statusTechnicianEnRoute: { ar: 'التقني في الطريق', fr: 'Technicien en route' },
  statusPhoneCollected: { ar: 'تم استلام الهاتف', fr: 'Téléphone récupéré' },
  statusDiagnosing: { ar: 'جاري التشخيص', fr: 'Diagnostic en cours' },
  statusRepairing: { ar: 'جاري التصليح', fr: 'Réparation en cours' },
  statusCompleted: { ar: 'تم الانتهاء', fr: 'Réparation terminée' },
  statusDelivered: { ar: 'تم التسليم', fr: 'Livré' },
  assignedTech: { ar: 'التقني المسؤول', fr: 'Technicien assigné' },
  techName: { ar: 'أمين (The Fix Point Oran)', fr: 'Amine (The Fix Point Oran)' },
  estimatedArrival: { ar: 'الوقت المقدر للوصول:', fr: 'Arrivée estimée :' },

  // Prices
  pricesTitle: { ar: 'دليل الأسعار التقريبية', fr: 'Grille tarifaire indicative' },
  pricesSubtitle: { ar: 'أسعار شفافة تبدأ من الحد الأدنى مع ضمان على القطع', fr: 'Prix transparents avec pièces garanties' },
  searchPricePlaceholder: { ar: 'ابحث عن هاتف أو تصليح...', fr: 'Rechercher un modèle ou une pièce...' },
  allBrands: { ar: 'جميع العلامات', fr: 'Toutes les marques' },
  allCategories: { ar: 'جميع الفئات', fr: 'Toutes catégories' },
  catScreens: { ar: 'الشاشات', fr: 'Écrans' },
  catBatteries: { ar: 'البطاريات', fr: 'Batteries' },
  catCharging: { ar: 'مدخل الشحن', fr: 'Connecteur de charge' },
  catCamera: { ar: 'الكاميرات', fr: 'Caméras' },
  catSystem: { ar: 'النظام والسوفتوير', fr: 'Système & Logiciel' },
  catOther: { ar: 'تصليحات أخرى', fr: 'Autres réparations' },
  startingFrom: { ar: 'ابتداءً من', fr: 'À partir de' },
  priceAfterDiag: { ar: 'السعر يحدد بعد التشخيص', fr: 'Prix après diagnostic' },
  warrantyLabel: { ar: 'ضمان', fr: 'Garantie' },
  durationLabel: { ar: 'المدة المقدرة', fr: 'Durée estimée' },
  minutes: { ar: 'دقيقة', fr: 'min' },
  months: { ar: 'أشهر', fr: 'mois' },
  btnOrderThisRepair: { ar: 'طلب هذا التصليح', fr: 'Commander cette réparation' },

  // Offers
  offersTitle: { ar: 'العروض والتخفيضات', fr: 'Offres & Promotions' },
  offersSubtitle: { ar: 'عروض حصرية لسكان مدينة وهران وضواحيها', fr: 'Promotions exclusives pour Oran et environs' },
  copyCode: { ar: 'نسخ الكود', fr: 'Copier le code' },
  codeCopied: { ar: 'تم نسخ الكود!', fr: 'Code copié !' },
  useOfferBtn: { ar: 'استفد من العرض الآن', fr: 'Profiter de l\'offre' },

  // Account
  myAccountTitle: { ar: 'حسابي والطلبات', fr: 'Mon compte & Historique' },
  personalInfo: { ar: 'البيانات الشخصية', fr: 'Informations personnelles' },
  myRequests: { ar: 'طلباتي السابقة والحالية', fr: 'Mes demandes de réparation' },
  activeRequest: { ar: 'الطلب النشط حالياً', fr: 'Demande en cours' },
  settings: { ar: 'الإعدادات واللغة', fr: 'Paramètres & Langue' },
  appLanguage: { ar: 'لغة التطبيق', fr: 'Langue de l\'application' },
  coverageArea: { ar: 'منطقة التغطية بوهران', fr: 'Zone de couverture à Oran' },
  coverageDesc: { ar: 'نغطي كامل بلديات وأحياء وهران الكبرى (عقيد لطفي، وهران وسط، بئر الجير، كناستيل، مارافال، السانية، عين الترك، وغيرها)', fr: 'Nous couvrons tout le Grand Oran (Akid Lotfi, Centre Ville, Bir El Djir, Canastel, Maraval, Es Senia, Aïn El Turk...)' },
  aboutFixPoint: { ar: 'عن The Fix Point', fr: 'À propos de The Fix Point' },
  aboutFixPointDesc: { ar: 'خدمة إصلاح هواتف احترافية بوهران. نوفر لكم الصيانة السريعة عندكم في المنزل أو المكتب مع قطع غيار أصلية وضمان موثوق.', fr: 'Service de réparation mobile pro à Oran. Intervention rapide à domicile ou au bureau avec pièces d\'origine et garantie.' },
  warrantyTitle: { ar: 'سياسة الضمان', fr: 'Garantie & Qualité' },
  warrantyDesc: { ar: 'نقدم ضماناً مكتوباً من 3 إلى 6 أشهر على جميع الشاشات والبطاريات وقطع الغيار الأصلية المركبة.', fr: 'Garantie de 3 à 6 mois sur tous les écrans, batteries et pièces détachées remplacées.' },
  workshopLocation: { ar: 'مقر ورشة The Fix Point', fr: 'Atelier The Fix Point' },
  workshopAddress: { ar: 'شارع فلسطين، وهران، الجزائر', fr: 'Rue de Palestine, Oran, Algérie' },
  contactPhone: { ar: '0549 99 40 01', fr: '0549 99 40 01' },

  // Common Units
  dzd: { ar: 'دج', fr: 'DA' },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<Language>('ar');

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    document.documentElement.lang = newLang;
    document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr';
  };

  const toggleLang = () => {
    setLang(lang === 'ar' ? 'fr' : 'ar');
  };

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  }, [lang]);

  const t = (key: string): string => {
    const entry = translations[key];
    if (!entry) return key;
    return entry[lang] || entry.ar || key;
  };

  const isRtl = lang === 'ar';

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLang, isRtl, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
