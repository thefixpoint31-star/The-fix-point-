import React, { useState } from 'react';
import { RepairRequest } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { 
  Camera, CheckCircle2, X, Upload, Smartphone, 
  ShieldCheck, AlertCircle, FileText, CheckSquare, Square
} from 'lucide-react';

interface ProofOfPickupModalProps {
  order: RepairRequest;
  courierName: string;
  courierId: string;
  onClose: () => void;
  onConfirm: (data: {
    photoUrl?: string;
    conditionNotes: string;
    accessories: string[];
    customAccessories?: string;
    courierId: string;
    courierName: string;
  }) => void;
}

const COMMON_ACCESSORIES = [
  'الهاتف فقط',
  'الشاحن الأصلي',
  'غطاء الحماية (الكفر)',
  'بطاقة SIM',
  'بطاقة ذاكرة (SD Card)',
  'العلبة الأصلية',
];

const PRESET_CONDITION_NOTES = [
  'الهاتف بحالة جيدة مع كسر في الشاشة فقط',
  'خدوش بسيطة في الإطار والهيكل الخارجي',
  'كسر في الزجاج الخلفي بالإضافة للشاشة',
  'انحناء طفيف في الهيكل الخارجي',
  'الهاتف لا يستجيب للشحن تماماً',
];

export const ProofOfPickupModal: React.FC<ProofOfPickupModalProps> = ({
  order,
  courierName,
  courierId,
  onClose,
  onConfirm,
}) => {
  const { lang, isRtl } = useLanguage();
  const [conditionNotes, setConditionNotes] = useState<string>('خدوش بسيطة في الإطار والشاشة مكسورة');
  const [selectedAccessories, setSelectedAccessories] = useState<string[]>(['الهاتف فقط']);
  const [customAccessories, setCustomAccessories] = useState<string>('');
  const [photoPreview, setPhotoPreview] = useState<string | null>(
    'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=600&auto=format&fit=crop&q=80'
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleAccessory = (acc: string) => {
    if (acc === 'الهاتف فقط') {
      setSelectedAccessories(['الهاتف فقط']);
      return;
    }

    let updated = selectedAccessories.filter((a) => a !== 'الهاتف فقط');
    if (updated.includes(acc)) {
      updated = updated.filter((a) => a !== acc);
      if (updated.length === 0) updated = ['الهاتف فقط'];
    } else {
      updated.push(acc);
    }
    setSelectedAccessories(updated);
  };

  const handleSimulatePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        if (uploadEvent.target?.result) {
          setPhotoPreview(uploadEvent.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      onConfirm({
        photoUrl: photoPreview || undefined,
        conditionNotes: conditionNotes.trim(),
        accessories: selectedAccessories,
        customAccessories: customAccessories.trim() || undefined,
        courierId,
        courierName,
      });
      setIsSubmitting(false);
    }, 400);
  };

  return (
    <div
      id="proof-of-pickup-modal"
      className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-150"
    >
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 max-h-[92vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-purple-600 flex items-center justify-center text-white shadow-md">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-white">إثبات استلام الهاتف</h3>
              <p className="text-[11px] text-purple-300 font-mono">الطلب: {order.id} • {order.brand} {order.model}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 flex items-center justify-center cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Form */}
        <form onSubmit={handleSubmit} className="p-4 overflow-y-auto space-y-4 text-xs">
          {/* Customer & Device Banner */}
          <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-3 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-slate-500 block">الزبون:</span>
              <span className="font-extrabold text-slate-900 text-xs">{order.customerName}</span>
              <span className="text-[11px] text-blue-700 block font-mono" dir="ltr">{order.phoneNumber}</span>
            </div>
            <div className="text-end">
              <span className="text-[10px] text-slate-500 block">الجهاز والعطل:</span>
              <span className="font-bold text-slate-800 text-xs">{order.brand} {order.model}</span>
              <span className="text-[11px] text-slate-600 block">{order.problemNameAr}</span>
            </div>
          </div>

          {/* 1. Device Photo Upload / Preview */}
          <div className="space-y-1.5">
            <label className="block font-extrabold text-slate-900 text-xs flex items-center gap-1.5">
              <Camera className="w-3.5 h-3.5 text-purple-600" />
              <span>1. تصوير الهاتف وحالة الجهاز عند الاستلام *</span>
            </label>

            <div className="border-2 border-dashed border-purple-200 bg-purple-50/50 rounded-2xl p-3 text-center space-y-2">
              {photoPreview ? (
                <div className="relative inline-block max-w-full">
                  <img
                    src={photoPreview}
                    alt="معاينة الهاتف المستلم"
                    className="w-full max-h-48 object-cover rounded-xl border border-purple-300 shadow-sm"
                    referrerPolicy="no-referrer"
                  />
                  <label
                    htmlFor="pickup-photo-input"
                    className="absolute bottom-2 end-2 py-1 px-2.5 rounded-lg bg-slate-900/90 text-white text-[10px] font-bold flex items-center gap-1 cursor-pointer hover:bg-slate-900 shadow-md"
                  >
                    <Upload className="w-3 h-3" />
                    <span>تغيير الصورة</span>
                  </label>
                </div>
              ) : (
                <label
                  htmlFor="pickup-photo-input"
                  className="py-6 flex flex-col items-center justify-center cursor-pointer"
                >
                  <Camera className="w-8 h-8 text-purple-600 mb-1" />
                  <span className="font-bold text-slate-700 text-xs">اضغط لتصوير الهاتف أو رفع صورة</span>
                  <span className="text-[10px] text-slate-400">توثيق حالة الشاشة والهيكل قبل النقل للورشة</span>
                </label>
              )}

              <input
                id="pickup-photo-input"
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleSimulatePhotoUpload}
                className="hidden"
              />
            </div>
          </div>

          {/* 2. Device Condition Notes */}
          <div className="space-y-1.5">
            <label className="block font-extrabold text-slate-900 text-xs flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-purple-600" />
              <span>2. حالة الجهاز والملاحظات المسجلة *</span>
            </label>

            {/* Presets */}
            <div className="flex flex-wrap gap-1 pb-1">
              {PRESET_CONDITION_NOTES.map((preset) => (
                <button
                  type="button"
                  key={preset}
                  onClick={() => setConditionNotes(preset)}
                  className={`text-[10px] px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                    conditionNotes === preset
                      ? 'bg-purple-600 text-white border-purple-700 font-bold'
                      : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                  }`}
                >
                  {preset}
                </button>
              ))}
            </div>

            <textarea
              rows={2}
              required
              value={conditionNotes}
              onChange={(e) => setConditionNotes(e.target.value)}
              placeholder="مثال: خدوش بسيطة في الإطار، الشاشة لا تستجيب للمس، الهيكل سليم..."
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-2.5 text-xs text-slate-900 focus:outline-none focus:border-purple-600 focus:bg-white resize-none"
            />
          </div>

          {/* 3. Received Accessories Checklist */}
          <div className="space-y-1.5">
            <label className="block font-extrabold text-slate-900 text-xs flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
              <span>3. الملحقات المستلمة مع الهاتف *</span>
            </label>

            <div className="grid grid-cols-2 gap-1.5">
              {COMMON_ACCESSORIES.map((acc) => {
                const isSelected = selectedAccessories.includes(acc);
                return (
                  <button
                    type="button"
                    key={acc}
                    onClick={() => toggleAccessory(acc)}
                    className={`p-2 rounded-xl text-start border flex items-center gap-2 transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-purple-50 border-purple-300 text-purple-900 font-bold'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {isSelected ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                    ) : (
                      <Square className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    )}
                    <span className="text-[11px]">{acc}</span>
                  </button>
                );
              })}
            </div>

            <input
              type="text"
              value={customAccessories}
              onChange={(e) => setCustomAccessories(e.target.value)}
              placeholder="ملحقات أخرى إن وجدت (اختياري)..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-purple-600 focus:bg-white"
            />
          </div>

          {/* Security & Responsibility Guarantee */}
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-2.5 flex items-start gap-2 text-[10px] text-amber-900">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <p>
              يتحمل عامل التوصيل ({courierName}) مسؤولية نقل الجهاز داخل حقيبة الحماية المخصصة حتى تسليمه لورشة The Fix Point بوهران.
            </p>
          </div>

          {/* Footer Buttons */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer"
            >
              إلغاء
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="py-2.5 px-5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs flex items-center gap-1.5 shadow-md shadow-purple-600/25 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isSubmitting ? 'جاري الحفظ...' : 'تأكيد استلام الهاتف'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
