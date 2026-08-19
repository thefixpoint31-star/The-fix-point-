import React, { useState, useMemo } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { BRANDS } from '../../data/mockData';
import { Search, Smartphone, Check, ArrowRight, ArrowLeft, Plus } from 'lucide-react';

interface DeviceSelectionProps {
  selectedBrand: string;
  selectedModel: string;
  onSelectBrand: (brand: string) => void;
  onSelectModel: (model: string) => void;
  onNext: () => void;
  onBack: () => void;
}

export const DeviceSelection: React.FC<DeviceSelectionProps> = ({
  selectedBrand,
  selectedModel,
  onSelectBrand,
  onSelectModel,
  onNext,
  onBack,
}) => {
  const { lang, t, isRtl } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [customModelInput, setCustomModelInput] = useState(selectedModel || '');

  const currentBrandObj = useMemo(() => {
    return BRANDS.find((b) => b.name === selectedBrand) || BRANDS[0];
  }, [selectedBrand]);

  const filteredModels = useMemo(() => {
    if (!currentBrandObj) return [];
    if (!searchQuery.trim()) return currentBrandObj.popularModels;
    return currentBrandObj.popularModels.filter((m) =>
      m.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [currentBrandObj, searchQuery]);

  const handleBrandChange = (brandName: string) => {
    onSelectBrand(brandName);
    const brand = BRANDS.find((b) => b.name === brandName);
    if (brand && brand.popularModels.length > 0 && !selectedModel) {
      onSelectModel(brand.popularModels[0]);
      setCustomModelInput(brand.popularModels[0]);
    }
  };

  const handleModelSelect = (modelName: string) => {
    onSelectModel(modelName);
    setCustomModelInput(modelName);
  };

  const handleCustomModelSubmit = () => {
    if (customModelInput.trim()) {
      onSelectModel(customModelInput.trim());
    }
  };

  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;
  const BackArrowIcon = isRtl ? ArrowRight : ArrowLeft;

  const isValid = Boolean(selectedBrand && (selectedModel || customModelInput.trim()));

  return (
    <div id="step-device-selection" className="space-y-4 animate-in fade-in duration-200">
      {/* Brand Selection Section */}
      <div>
        <label className="block text-xs font-bold text-slate-800 mb-2">
          {t('selectBrand')} <span className="text-red-500">*</span>
        </label>
        
        {/* Brand Scrollable / Grid Pill selector */}
        <div className="grid grid-cols-3 xs:grid-cols-4 gap-2">
          {BRANDS.map((brand) => {
            const isSelected = selectedBrand === brand.name;
            return (
              <button
                key={brand.id}
                type="button"
                id={`brand-btn-${brand.id}`}
                onClick={() => handleBrandChange(brand.name)}
                className={`py-2.5 px-2 rounded-xl text-xs font-bold text-center border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/20'
                    : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <div className="truncate">{brand.name}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Model Selection Section */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
            <Smartphone className="w-4 h-4 text-blue-600" />
            <span>{t('selectModel')} - {selectedBrand || 'Apple'}</span>
          </label>
          {selectedModel && (
            <span className="text-[11px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
              {selectedModel}
            </span>
          )}
        </div>

        {/* Search Filter for Models */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute top-3 start-3" />
          <input
            id="model-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('searchModelPlaceholder')}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl ps-9 pe-3 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white transition-all"
          />
        </div>

        {/* Popular Models Grid */}
        <div className="max-h-48 overflow-y-auto no-scrollbar space-y-1.5 pt-1">
          {filteredModels.map((model) => {
            const isSelected = selectedModel === model;
            return (
              <button
                key={model}
                type="button"
                id={`model-btn-${model.replace(/\s+/g, '-').toLowerCase()}`}
                onClick={() => handleModelSelect(model)}
                className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-semibold text-start border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-blue-50 text-blue-900 border-blue-400 font-bold'
                    : 'bg-slate-50/70 text-slate-700 border-transparent hover:bg-slate-100'
                }`}
              >
                <span>{model}</span>
                {isSelected && (
                  <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center">
                    <Check className="w-3 h-3" />
                  </span>
                )}
              </button>
            );
          })}

          {filteredModels.length === 0 && (
            <p className="text-xs text-slate-500 py-3 text-center">
              {lang === 'ar' ? 'لم يتم العثور على الموديل في القائمة؟ اكتبه بالأسفل.' : 'Modèle introuvable ? Entrez-le ci-dessous.'}
            </p>
          )}
        </div>

        {/* Manual Custom Model Input */}
        <div className="pt-2 border-t border-slate-100">
          <label className="block text-[11px] font-semibold text-slate-600 mb-1.5">
            {lang === 'ar' ? 'أو أدخل اسم الموديل يدوياً:' : 'Ou saisissez le modèle manuellement :'}
          </label>
          <div className="flex gap-2">
            <input
              id="custom-model-input"
              type="text"
              value={customModelInput}
              onChange={(e) => {
                setCustomModelInput(e.target.value);
                onSelectModel(e.target.value);
              }}
              placeholder={lang === 'ar' ? 'مثال: iPhone 14 Pro Max 256GB' : 'Ex: Galaxy S24 Ultra 512GB'}
              className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white"
            />
            {customModelInput.trim() && selectedModel !== customModelInput && (
              <button
                type="button"
                onClick={handleCustomModelSubmit}
                className="px-3 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-black"
              >
                {lang === 'ar' ? 'تحديد' : 'Valider'}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Navigation Actions */}
      <div className="flex items-center gap-2 pt-2">
        <button
          id="btn-back-from-device"
          onClick={onBack}
          type="button"
          className="py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-700 font-bold text-xs flex items-center justify-center gap-1.5 transition-all"
        >
          <BackArrowIcon className="w-4 h-4" />
          <span>{t('btnBack')}</span>
        </button>

        <button
          id="btn-next-from-device"
          disabled={!isValid}
          onClick={() => {
            if (isValid) {
              if (customModelInput && !selectedModel) {
                onSelectModel(customModelInput);
              }
              onNext();
            }
          }}
          type="button"
          className={`flex-1 py-3.5 px-5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
            isValid
              ? 'bg-blue-600 hover:bg-blue-700 active:scale-98 text-white shadow-md shadow-blue-600/25 cursor-pointer'
              : 'bg-slate-200 text-slate-400 cursor-not-allowed'
          }`}
        >
          <span>{t('btnNext')}</span>
          <ArrowIcon className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
