import React, { useState, useMemo, useEffect } from 'react';
import { PriceCatalogProduct } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { 
  getAllCatalogProducts, saveCatalogProduct, deleteCatalogProduct, 
  resetCatalogToOfficial, getAvailableBrands, getModelsForBrand, 
  getPartsForModel, searchCatalog 
} from '../../services/catalogService';
import { 
  calculateScreenLaborFee, calculateBatteryLaborFee, calculateGeneralLaborFee,
  BASE_TRAVEL_FEE 
} from '../../services/pricingService';
import { 
  Search, ShieldAlert, Sparkles, Smartphone, 
  BatteryCharging, Zap, Wrench, Clock, ShieldCheck, ArrowRight, ArrowLeft,
  Truck, Settings, Edit3, CheckCircle2, RotateCcw, X
} from 'lucide-react';

interface PricesScreenProps {
  onOrderSpecificRepair: (brand: string, model: string, problemCategory: string) => void;
}

export const PricesScreen: React.FC<PricesScreenProps> = ({ onOrderSpecificRepair }) => {
  const { lang, t, isRtl } = useLanguage();
  
  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  
  // Hierarchical Step 1 -> Step 2 -> Step 3
  const [selectedBrand, setSelectedBrand] = useState<string>('Apple');
  const [selectedModel, setSelectedModel] = useState<string>('');
  
  // Catalog state
  const [catalogItems, setCatalogItems] = useState<PriceCatalogProduct[]>([]);
  
  // Admin Management Modal State
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<PriceCatalogProduct | null>(null);
  
  // Admin Form Fields
  const [formCategory, setFormCategory] = useState<'screen' | 'battery' | 'charging' | 'camera' | 'speaker' | 'software' | 'other'>('screen');
  const [formBrand, setFormBrand] = useState('Apple');
  const [formModel, setFormModel] = useState('');
  const [formPartTypeAr, setFormPartTypeAr] = useState('شاشة أصلية OLED');
  const [formPartTypeFr, setFormPartTypeFr] = useState('Écran Original OLED');
  const [formPartPrice, setFormPartPrice] = useState<number>(10000);
  const [formCustomLabor, setFormCustomLabor] = useState<string>('');
  const [formDiscount, setFormDiscount] = useState<number>(0);
  const [formWarrantyMonths, setFormWarrantyMonths] = useState<number>(3);
  const [formDurationMinutes, setFormDurationMinutes] = useState<number>(35);

  const refreshCatalog = () => {
    const items = getAllCatalogProducts();
    setCatalogItems(items);
  };

  useEffect(() => {
    refreshCatalog();
  }, []);

  // Brands & Models dynamically derived from current catalog
  const availableBrands = useMemo(() => getAvailableBrands(), [catalogItems]);
  
  const modelsForSelectedBrand = useMemo(() => {
    if (!selectedBrand) return [];
    return getModelsForBrand(selectedBrand);
  }, [selectedBrand, catalogItems]);

  // Set default model on brand change if none selected
  useEffect(() => {
    if (modelsForSelectedBrand.length > 0 && !modelsForSelectedBrand.includes(selectedModel)) {
      setSelectedModel(modelsForSelectedBrand[0]);
    }
  }, [selectedBrand, modelsForSelectedBrand]);

  // Parts for the chosen Model in Hierarchical mode
  const currentModelParts = useMemo(() => {
    if (!selectedBrand || !selectedModel) return [];
    return getPartsForModel(selectedBrand, selectedModel);
  }, [selectedBrand, selectedModel, catalogItems]);

  // Search Results
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    return searchCatalog(searchQuery);
  }, [searchQuery, catalogItems]);

  // Save or edit in Admin Modal
  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formModel.trim()) return;

    let catNameAr = 'شاشات أصلية';
    let catNameFr = 'Écrans Originaux';
    if (formCategory === 'battery') {
      catNameAr = 'بطاريات أصلية';
      catNameFr = 'Batteries Originales';
    } else if (formCategory === 'charging') {
      catNameAr = 'مدخل الشحن';
      catNameFr = 'Connecteur de charge';
    } else if (formCategory === 'camera') {
      catNameAr = 'الكاميرا والعدسة';
      catNameFr = 'Caméra';
    } else if (formCategory === 'software') {
      catNameAr = 'النظام والبرمجة';
      catNameFr = 'Système & Logiciel';
    }

    const customLaborNum = formCustomLabor.trim() !== '' ? Number(formCustomLabor) : undefined;

    const productToSave: PriceCatalogProduct = {
      id: editingProduct?.id || `cat-${Date.now()}`,
      category: formCategory,
      categoryNameAr: catNameAr,
      categoryNameFr: catNameFr,
      brand: formBrand.trim(),
      model: formModel.trim(),
      partTypeAr: formPartTypeAr.trim() || 'قطعة أصلية',
      partTypeFr: formPartTypeFr.trim() || 'Pièce Originale',
      partPrice: formPartPrice > 0 ? formPartPrice : null,
      laborFee: null,
      customLaborFee: customLaborNum,
      servicePrice: null,
      travelFee: BASE_TRAVEL_FEE,
      discount: Number(formDiscount) || 0,
      estimatedTotal: null,
      warrantyMonths: Number(formWarrantyMonths) || 3,
      durationMinutes: Number(formDurationMinutes) || 30,
      inStock: true,
    };

    saveCatalogProduct(productToSave);
    refreshCatalog();
    setEditingProduct(null);
    setFormModel('');
    setFormCustomLabor('');
    setFormDiscount(0);
  };

  const handleResetCatalog = () => {
    if (window.confirm(lang === 'ar' ? 'هل تريد استعادة جميع أسعار ملف Excel الأصلية؟' : 'Restaurer le catalogue officiel Excel ?')) {
      resetCatalogToOfficial();
      refreshCatalog();
    }
  };

  const openEditModalForProduct = (item: PriceCatalogProduct) => {
    setEditingProduct(item);
    setFormCategory(item.category);
    setFormBrand(item.brand);
    setFormModel(item.model);
    setFormPartTypeAr(item.partTypeAr);
    setFormPartTypeFr(item.partTypeFr);
    setFormPartPrice(item.partPrice || 0);
    setFormCustomLabor(item.customLaborFee !== undefined ? String(item.customLaborFee) : '');
    setFormDiscount(item.discount || 0);
    setFormWarrantyMonths(item.warrantyMonths || 3);
    setFormDurationMinutes(item.durationMinutes || 30);
    setShowAdminModal(true);
  };

  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  const renderProductCard = (item: PriceCatalogProduct) => {
    const hasPartPrice = item.partPrice !== null && item.partPrice > 0;
    const labor = item.laborFee ?? (hasPartPrice ? 2000 : null);
    const servicePrice = item.servicePrice ?? (hasPartPrice && labor ? item.partPrice! + labor : null);
    const travel = item.travelFee || BASE_TRAVEL_FEE;
    const discount = item.discount || 0;
    const estimatedTotal = item.estimatedTotal ?? (servicePrice !== null ? servicePrice + travel - discount : null);

    let badgeBg = 'bg-blue-50 text-blue-700';
    let IconComp = Smartphone;
    if (item.category === 'battery') {
      badgeBg = 'bg-emerald-50 text-emerald-700';
      IconComp = BatteryCharging;
    } else if (item.category === 'charging') {
      badgeBg = 'bg-amber-50 text-amber-700';
      IconComp = Zap;
    } else if (item.category === 'software') {
      badgeBg = 'bg-purple-50 text-purple-700';
      IconComp = Settings;
    }

    return (
      <div
        key={item.id}
        className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs hover:border-blue-300 hover:shadow-md transition-all space-y-3"
      >
        {/* Top row: Brand/Model & Part Type */}
        <div className="flex items-start justify-between gap-2">
          <div>
            <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md mb-1 ${badgeBg}`}>
              <IconComp className="w-3 h-3" />
              <span>{item.brand} • {item.model}</span>
            </span>
            <h3 className="font-extrabold text-sm text-slate-900">
              {lang === 'ar' ? item.partTypeAr : item.partTypeFr}
            </h3>
          </div>

          {/* Service Price Badge (Part + Labor) */}
          <div className="text-end shrink-0">
            {servicePrice !== null ? (
              <>
                <span className="text-[10px] text-slate-500 font-semibold block">
                  {lang === 'ar' ? 'سعر الخدمة (القطعة + التركيب)' : 'Prix de la réparation'}
                </span>
                <span className="font-black text-blue-700 text-lg font-mono">
                  {servicePrice.toLocaleString()} {t('dzd')}
                </span>
              </>
            ) : (
              <span className="inline-block text-[11px] font-bold text-amber-800 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-xl">
                {lang === 'ar' ? 'السعر يحدد بعد التشخيص' : 'Après diagnostic'}
              </span>
            )}
          </div>
        </div>

        {/* Strict 4-Column Exact Breakdown */}
        {hasPartPrice && labor !== null && (
          <div className="bg-slate-50 rounded-xl p-2.5 grid grid-cols-4 gap-1 text-center text-[11px] border border-slate-100">
            <div>
              <span className="text-slate-500 block text-[10px]">
                {lang === 'ar' ? 'سعر القطعة' : 'Pièce'}
              </span>
              <span className="font-bold text-slate-800 font-mono">
                {item.partPrice!.toLocaleString()} {t('dzd')}
              </span>
            </div>

            <div className="border-x border-slate-200">
              <span className="text-slate-500 block text-[10px]">
                {lang === 'ar' ? 'اليد العاملة' : 'Main-d\'œuvre'}
              </span>
              <span className="font-bold text-blue-600 font-mono">
                {labor.toLocaleString()} {t('dzd')}
              </span>
            </div>

            <div>
              <span className="text-slate-500 block text-[10px]">
                {lang === 'ar' ? 'التنقل من' : 'Déplacement'}
              </span>
              <span className="font-bold text-slate-800 font-mono">
                {travel.toLocaleString()} {t('dzd')}
              </span>
            </div>

            <div className="border-s border-slate-200">
              <span className="text-slate-500 block text-[10px]">
                {lang === 'ar' ? 'الخصم' : 'Remise'}
              </span>
              <span className="font-bold text-emerald-600 font-mono">
                {discount > 0 ? `-${discount.toLocaleString()}` : '0'} {t('dzd')}
              </span>
            </div>
          </div>
        )}

        {/* Estimated Total with Travel */}
        <div className="flex items-center justify-between text-xs px-1">
          <span className="text-slate-600 flex items-center gap-1 font-medium text-[11px]">
            <Truck className="w-3.5 h-3.5 text-blue-600" />
            <span>{lang === 'ar' ? 'المجموع التقريبي (شامل التنقل والخصم):' : 'Total estimatif (avec déplacement) :'}</span>
          </span>
          <span className="font-extrabold text-slate-950 font-mono text-sm">
            {estimatedTotal !== null ? `~ ${estimatedTotal.toLocaleString()} ${t('dzd')}` : (lang === 'ar' ? 'يحدد بعد التشخيص' : 'Après diagnostic')}
          </span>
        </div>

        {/* Footer with Warranty & Order Action */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
          <div className="flex items-center gap-3 text-[11px] text-slate-500">
            {item.warrantyMonths > 0 && (
              <span className="flex items-center gap-1 font-semibold text-emerald-700">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>{t('warrantyLabel')} {item.warrantyMonths} {t('months')}</span>
              </span>
            )}
            <span className="flex items-center gap-1 font-mono">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>~{item.durationMinutes} {t('minutes')}</span>
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Edit single item in technician modal */}
            <button
              type="button"
              onClick={() => openEditModalForProduct(item)}
              className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
              title={lang === 'ar' ? 'تعديل السعر' : 'Modifier le tarif'}
            >
              <Edit3 className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onClick={() => onOrderSpecificRepair(item.brand, item.model, item.category)}
              className="py-1.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold text-xs flex items-center gap-1 shadow-xs transition-all cursor-pointer"
            >
              <span>{t('btnOrderThisRepair')}</span>
              <ArrowIcon className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div id="screen-price-catalog" className="space-y-4 pb-8 animate-in fade-in duration-200">
      {/* Header & Title */}
      <div className="flex items-start justify-between gap-2">
        <div>
          <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
            <Search className="w-5 h-5 text-blue-600" />
            <span>{lang === 'ar' ? 'كتالوج الأسعار الرسمي (Price Catalog)' : 'Catalogue officiel des tarifs'}</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {lang === 'ar'
              ? 'تصفح دقيق لأسعار قطع الغيار وخدمات الصيانة المعتمدة لـ The Fix Point وهران'
              : 'Barème officiel des pièces et réparations The Fix Point Oran'}
          </p>
        </div>

        {/* Technician Management Button */}
        <button
          type="button"
          id="btn-open-catalog-admin"
          onClick={() => {
            setEditingProduct(null);
            setShowAdminModal(true);
          }}
          className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-800 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shrink-0"
          title={lang === 'ar' ? 'لوحة إدارة الأسعار والخصومات' : 'Gestionnaire des tarifs et remises'}
        >
          <Settings className="w-4 h-4 text-blue-600" />
          <span className="hidden sm:inline">{lang === 'ar' ? 'إدارة الكتالوج' : 'Gérer'}</span>
        </button>
      </div>

      {/* Official Rules & Disclaimer Box */}
      <div className="bg-slate-950 text-white border border-slate-800 rounded-2xl p-3.5 text-xs space-y-2 leading-relaxed shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 font-bold text-sky-400">
            <ShieldAlert className="w-4 h-4 text-sky-400 shrink-0" />
            <span>{lang === 'ar' ? 'معادلة حساب السعر التقريبي' : 'Formule du prix estimatif'}</span>
          </div>
          <span className="text-[10px] bg-sky-950 text-sky-300 px-2 py-0.5 rounded-full font-semibold border border-sky-800">
            {lang === 'ar' ? 'السعر التقريبي' : 'Prix indicatif'}
          </span>
        </div>

        {/* Formula breakdown */}
        <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800 text-[11px] font-mono text-center text-slate-200">
          <span className="text-sky-300 font-bold">{lang === 'ar' ? 'سعر القطعة' : 'Pièce'}</span>
          {' + '}
          <span className="text-emerald-300 font-bold">{lang === 'ar' ? 'اليد العاملة' : 'Main-d\'œuvre'}</span>
          {' + '}
          <span className="text-amber-300 font-bold">{lang === 'ar' ? 'التنقل (2,000 دج)' : 'Déplacement (2 000 DA)'}</span>
          {' - '}
          <span className="text-rose-300 font-bold">{lang === 'ar' ? 'الخصم' : 'Remise'}</span>
          {' = '}
          <span className="text-white font-black bg-blue-600/30 px-1.5 py-0.5 rounded-md border border-blue-500/40">
            {lang === 'ar' ? 'المجموع التقريبي' : 'Total estimatif'}
          </span>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-1 text-[11px] text-slate-400 pt-1 border-t border-slate-800/80">
          <span>• {lang === 'ar' ? 'التنقل داخل وهران ابتداءً من 2,000 دج.' : 'Déplacement dès 2 000 DA à Oran.'}</span>
          <span className="font-bold text-amber-300">
            • {lang === 'ar' ? 'السعر النهائي يحدد بعد فحص الهاتف.' : 'Le prix final est confirmé après diagnostic.'}
          </span>
        </div>
      </div>

      {/* Search Input for Quick Model Search (e.g. iPhone 13, iPhone 15, Samsung A54, Redmi Note 13) */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute top-3.5 start-3.5" />
        <input
          id="catalog-quick-search"
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={
            lang === 'ar'
              ? 'بحث فوري بالموديل (مثال: iPhone 13, iPhone 15, Samsung A54, Redmi Note 13...)'
              : 'Recherche rapide (ex: iPhone 13, iPhone 15, Samsung A54, Redmi Note 13...)'
          }
          className="w-full bg-white border border-slate-200 rounded-2xl ps-10 pe-10 py-3 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 shadow-xs transition-colors"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery('')}
            className="absolute top-3 end-3 p-1 text-slate-400 hover:text-slate-600 rounded-full"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* QUICK TEST SHORTCUTS FOR VERIFICATION */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 text-[11px]">
        <span className="text-slate-400 font-semibold shrink-0 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-amber-500" />
          <span>{lang === 'ar' ? 'اختبار سريع:' : 'Test rapide :'}</span>
        </span>
        {[
          { label: 'iPhone 13', q: 'iPhone 13' },
          { label: 'iPhone 15', q: 'iPhone 15' },
          { label: 'Samsung A54', q: 'Galaxy A54' },
          { label: 'Redmi Note 13', q: 'Redmi Note 13' },
        ].map((item) => (
          <button
            key={item.label}
            type="button"
            onClick={() => setSearchQuery(item.q)}
            className="px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-700 font-bold shrink-0 transition-colors border border-slate-200 cursor-pointer"
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* ========================================================================= */}
      {/* MODE 1: LIVE SEARCH RESULTS (When user types a search query) */}
      {/* ========================================================================= */}
      {searchQuery.trim() !== '' ? (
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <span>{lang === 'ar' ? 'نتائج البحث عن:' : 'Résultats pour :'}</span>
              <span className="text-blue-600 font-mono">"{searchQuery}"</span>
              <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-bold">
                {searchResults.length}
              </span>
            </span>
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="text-xs text-blue-600 hover:underline font-semibold"
            >
              {lang === 'ar' ? 'الرجوع للتصفح' : 'Voir par catégorie'}
            </button>
          </div>

          {searchResults.length > 0 ? (
            <div className="space-y-3">
              {searchResults.map((product) => renderProductCard(product))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-6 border border-slate-200 text-center space-y-3 shadow-xs">
              <Wrench className="w-8 h-8 text-blue-600 mx-auto" />
              <div>
                <p className="text-xs text-slate-800 font-bold">
                  {lang === 'ar' ? 'الموديل غير مسجل في قاعدة الأسعار الفورية' : 'Modèle non trouvé dans la base de données'}
                </p>
                <p className="text-[11px] text-amber-700 bg-amber-50 border border-amber-200/80 rounded-xl p-2.5 mt-2 font-medium">
                  {lang === 'ar' ? 'السعر يحدد بعد التشخيص وفحص الهاتف.' : 'Le prix est fixé après diagnostic.'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => onOrderSpecificRepair('Other', searchQuery, 'other')}
                className="py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs cursor-pointer shadow-md shadow-blue-600/20"
              >
                {lang === 'ar' ? 'طلب فحص وتشخيص في مكانك' : 'Demander un diagnostic à domicile'}
              </button>
            </div>
          )}
        </div>
      ) : (
        /* ========================================================================= */
        /* MODE 2: HIERARCHICAL DRILLDOWN: Brand -> Model -> Part Type               */
        /* (الماركة → الموديل → نوع القطعة)                                           */
        /* ========================================================================= */
        <div className="space-y-4">
          {/* STEP 1: BRAND SELECTOR (الماركة) */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-[10px] flex items-center justify-center font-black">1</span>
                <span>{lang === 'ar' ? 'اختر الماركة (Marque)' : 'Étape 1 : Choisissez la marque'}</span>
              </span>
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
              {availableBrands.map((brand) => {
                const isSelected = selectedBrand.toLowerCase() === brand.toLowerCase();
                return (
                  <button
                    key={brand}
                    type="button"
                    onClick={() => {
                      setSelectedBrand(brand);
                    }}
                    className={`px-3 py-2 rounded-2xl text-xs font-bold shrink-0 transition-all cursor-pointer flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25 scale-102'
                        : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <Smartphone className="w-3.5 h-3.5" />
                    <span>{brand}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* STEP 2: MODEL SELECTOR (الموديل) */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-[10px] flex items-center justify-center font-black">2</span>
                <span>{lang === 'ar' ? `اختر موديل ${selectedBrand}` : `Étape 2 : Choisissez le modèle (${selectedBrand})`}</span>
              </span>
              <span className="text-[10px] text-slate-400 font-mono">
                {modelsForSelectedBrand.length} {lang === 'ar' ? 'موديل' : 'modèles'}
              </span>
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
              {modelsForSelectedBrand.map((modelName) => {
                const isSelected = selectedModel === modelName;
                return (
                  <button
                    key={modelName}
                    type="button"
                    onClick={() => setSelectedModel(modelName)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-slate-900 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {modelName}
                  </button>
                );
              })}
            </div>
          </div>

          {/* STEP 3: PARTS & SERVICES FOR SELECTED MODEL (نوع القطعة والتسعيرة) */}
          <div className="space-y-2.5 pt-1">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-[10px] flex items-center justify-center font-black">3</span>
                <span>
                  {lang === 'ar' ? `القطع والأسعار المعتمدة لـ ${selectedBrand} ${selectedModel}` : `Tarifs des pièces (${selectedBrand} ${selectedModel})`}
                </span>
              </span>
            </div>

            {currentModelParts.length > 0 ? (
              <div className="space-y-3">
                {currentModelParts.map((product) => renderProductCard(product))}
              </div>
            ) : (
              <div className="bg-white rounded-2xl p-6 border border-slate-200 text-center space-y-2 shadow-xs">
                <Wrench className="w-7 h-7 text-blue-600 mx-auto" />
                <p className="text-xs text-slate-800 font-bold">
                  {lang === 'ar' ? 'هذا الموديل غير مسجل بعد في ورقة الأسعار' : 'Modèle non répertorié dans la grille'}
                </p>
                <p className="text-[11px] text-slate-600">
                  {lang === 'ar' ? 'السعر يحدد بعد التشخيص وفحص الهاتف.' : 'Le prix sera fixé après diagnostic.'}
                </p>
                <button
                  type="button"
                  onClick={() => onOrderSpecificRepair(selectedBrand, selectedModel, 'other')}
                  className="mt-2 py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs"
                >
                  {lang === 'ar' ? 'طلب فحص في مكانك' : 'Demander un diagnostic'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TECHNICIAN PRICE CATALOG MANAGEMENT MODAL                                  */}
      {/* ========================================================================= */}
      {showAdminModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-5 space-y-4 shadow-2xl animate-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-blue-600" />
                <div>
                  <h3 className="font-bold text-sm text-slate-900">
                    {lang === 'ar' ? 'لوحة إدارة وتعديل كتالوج الأسعار' : 'Gestionnaire des tarifs et remises'}
                  </h3>
                  <span className="text-[10px] text-slate-500">
                    {lang === 'ar' ? 'تعديل وحفظ فوري في ذاكرة التطبيق دون تعديل الكود' : 'Sauvegarde instantanée sans modification du code'}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowAdminModal(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSaveProduct} className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
              <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1">
                <Edit3 className="w-3.5 h-3.5 text-blue-600" />
                <span>
                  {editingProduct
                    ? (lang === 'ar' ? `تعديل سعر: ${editingProduct.brand} ${editingProduct.model}` : 'Modifier le tarif')
                    : (lang === 'ar' ? 'إضافة موديل أو قطعة جديدة للكتالوج' : 'Ajouter un nouveau produit')}
                </span>
              </h4>

              {/* Category & Brand */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">الفئة (Catégorie)</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as any)}
                    className="w-full bg-white border border-slate-300 rounded-xl p-2 font-semibold"
                  >
                    <option value="screen">الشاشات (Ecrans)</option>
                    <option value="battery">البطاريات (Batteries)</option>
                    <option value="charging">مدخل الشحن (Connecteur)</option>
                    <option value="camera">الكاميرا (Caméra)</option>
                    <option value="speaker">الصوت (Haut-parleur)</option>
                    <option value="software">النظام (Système)</option>
                    <option value="other">أعطال أخرى (Autre)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">الماركة (Marque)</label>
                  <input
                    type="text"
                    required
                    value={formBrand}
                    onChange={(e) => setFormBrand(e.target.value)}
                    placeholder="e.g. Apple, Samsung, Xiaomi..."
                    className="w-full bg-white border border-slate-300 rounded-xl p-2 text-xs font-semibold"
                  />
                </div>
              </div>

              {/* Model & Part Type */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">الموديل (Modèle)</label>
                  <input
                    type="text"
                    required
                    value={formModel}
                    onChange={(e) => setFormModel(e.target.value)}
                    placeholder="e.g. iPhone 15 Pro, Galaxy A54..."
                    className="w-full bg-white border border-slate-300 rounded-xl p-2 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">نوع القطعة (Type de pièce)</label>
                  <input
                    type="text"
                    required
                    value={formPartTypeAr}
                    onChange={(e) => setFormPartTypeAr(e.target.value)}
                    placeholder="e.g. شاشة أصلية OLED"
                    className="w-full bg-white border border-slate-300 rounded-xl p-2 text-xs"
                  />
                </div>
              </div>

              {/* Part Price & Custom Labor Fee */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    سعر القطعة (Prix pièce en DZD)
                  </label>
                  <input
                    type="number"
                    required
                    min={0}
                    step={100}
                    value={formPartPrice}
                    onChange={(e) => setFormPartPrice(Number(e.target.value))}
                    className="w-full bg-white border border-slate-300 rounded-xl p-2 font-mono font-bold text-blue-900"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    اليد العاملة (مخصصة أو اترك فارغاً)
                  </label>
                  <input
                    type="number"
                    min={0}
                    step={100}
                    value={formCustomLabor}
                    onChange={(e) => setFormCustomLabor(e.target.value)}
                    placeholder="تلقائي حسب الفئة"
                    className="w-full bg-white border border-slate-300 rounded-xl p-2 font-mono"
                  />
                </div>
              </div>

              {/* Discount & Warranty */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    الخصم إن وجد (Remise en DZD)
                  </label>
                  <input
                    type="number"
                    min={0}
                    step={100}
                    value={formDiscount}
                    onChange={(e) => setFormDiscount(Number(e.target.value))}
                    className="w-full bg-white border border-slate-300 rounded-xl p-2 font-mono text-emerald-700 font-bold"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    الضمان (بالأشهر)
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={24}
                    value={formWarrantyMonths}
                    onChange={(e) => setFormWarrantyMonths(Number(e.target.value))}
                    className="w-full bg-white border border-slate-300 rounded-xl p-2"
                  />
                </div>
              </div>

              {/* Live Calculation Preview in Modal */}
              <div className="bg-slate-900 text-white p-3 rounded-xl text-xs space-y-1 font-mono">
                <span className="text-[10px] text-slate-400 block mb-1">المعاينة الحسابية الفورية:</span>
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-300">سعر القطعة:</span>
                  <span>{formPartPrice.toLocaleString()} DZD</span>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-300">اليد العاملة:</span>
                  <span className="text-sky-300">
                    {formCustomLabor.trim() !== ''
                      ? Number(formCustomLabor).toLocaleString()
                      : (formCategory === 'screen'
                          ? calculateScreenLaborFee(formPartPrice)?.toLocaleString()
                          : formCategory === 'battery'
                          ? calculateBatteryLaborFee(formPartPrice)?.toLocaleString()
                          : calculateGeneralLaborFee(formPartPrice)?.toLocaleString())}{' '}
                    DZD
                  </span>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-300">التنقل:</span>
                  <span>{BASE_TRAVEL_FEE.toLocaleString()} DZD</span>
                </div>
                {formDiscount > 0 && (
                  <div className="flex justify-between text-[11px] text-emerald-400">
                    <span>الخصم:</span>
                    <span>-{formDiscount.toLocaleString()} DZD</span>
                  </div>
                )}
              </div>

              {/* Submit & Cancel */}
              <div className="flex items-center gap-2 pt-1">
                <button
                  type="submit"
                  className="flex-1 py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-blue-600/20"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{editingProduct ? (lang === 'ar' ? 'حفظ التعديل' : 'Enregistrer') : (lang === 'ar' ? 'إضافة للكتالوج' : 'Ajouter')}</span>
                </button>
                {editingProduct && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingProduct(null);
                      setFormModel('');
                      setFormCustomLabor('');
                    }}
                    className="py-2.5 px-3 rounded-xl bg-slate-200 text-slate-700 font-bold text-xs"
                  >
                    {lang === 'ar' ? 'إلغاء' : 'Annuler'}
                  </button>
                )}
              </div>
            </form>

            {/* Reset to Excel Button */}
            <div className="pt-2 border-t flex items-center justify-between text-xs">
              <span className="text-slate-500 font-mono text-[11px]">
                {catalogItems.length} {lang === 'ar' ? 'منتج مسجل' : 'articles'}
              </span>
              <button
                type="button"
                onClick={handleResetCatalog}
                className="text-red-600 hover:underline font-bold flex items-center gap-1 text-[11px]"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{lang === 'ar' ? 'استعادة أسعار Excel الأصلية' : 'Restaurer Excel officiel'}</span>
              </button>
            </div>

            <div>
              <button
                type="button"
                onClick={() => setShowAdminModal(false)}
                className="w-full py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs"
              >
                {lang === 'ar' ? 'إغلاق' : 'Fermer'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
