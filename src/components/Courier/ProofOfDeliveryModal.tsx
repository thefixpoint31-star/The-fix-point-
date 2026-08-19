import React, { useState } from 'react';
import { RepairRequest } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { 
  CheckCircle2, X, Upload, Camera, Banknote, 
  ShieldCheck, AlertCircle, FileText, CheckSquare, Smartphone
} from 'lucide-react';

interface ProofOfDeliveryModalProps {
  order: RepairRequest;
  courierName: string;
  courierId: string;
  onClose: () => void;
  onConfirm: (data: {
    photoUrl?: string;
    deliveryNotes: string;
    amountCollected: number;
    isCashCollected: boolean;
    isTestedWithCustomer: boolean;
    courierId: string;
    courierName: string;
  }) => void;
}

export const ProofOfDeliveryModal: React.FC<ProofOfDeliveryModalProps> = ({
  order,
  courierName,
  courierId,
  onClose,
  onConfirm,
}) => {
  const { lang, isRtl } = useLanguage();
  const totalDue = order.finalPrice || order.estimatedTotal || 0;

  const [amountCollected, setAmountCollected] = useState<number>(totalDue);
  const [isCashCollected, setIsCashCollected] = useState<boolean>(true);
  const [isTestedWithCustomer, setIsTestedWithCustomer] = useState<boolean>(true);
  const [deliveryNotes, setDeliveryNotes] = useState<string>('تم تسليم الهاتف واختبار الشاشة واللمس بنجاح');
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    if (!isCashCollected) {
      alert('يرجى تأكيد استلام المبلغ المالي أو توضيح الملاحظة');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      onConfirm({
        photoUrl: photoPreview || undefined,
        deliveryNotes: deliveryNotes.trim(),
        amountCollected: Number(amountCollected) || 0,
        isCashCollected,
        isTestedWithCustomer,
        courierId,
        courierName,
      });
      setIsSubmitting(false);
    }, 400);
  };

  return (
    <div
      id="proof-of-delivery-modal"
      className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-150"
    >
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 max-h-[92vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 bg-emerald-950 text-white flex items-center justify-between border-b border-emerald-900">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-md">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-white">إثبات تسليم الهاتف للزبون</h3>
              <p className="text-[11px] text-emerald-300 font-mono">الطلب: {order.id} • {order.brand} {order.model}</p>
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
          {/* Customer & Order Summary */}
          <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-3 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-slate-500 block">الزبون:</span>
              <span className="font-extrabold text-slate-900 text-xs">{order.customerName}</span>
              <span className="text-[11px] text-blue-700 block font-mono" dir="ltr">{order.phoneNumber}</span>
            </div>
            <div className="text-end">
              <span className="text-[10px] text-slate-500 block">العنوان:</span>
              <span className="font-bold text-slate-800 text-xs">{order.commune}</span>
              <span className="text-[10px] text-slate-500 block truncate max-w-[150px]">{order.address}</span>
            </div>
          </div>

          {/* Amount Collection Card */}
          <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-3.5 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Banknote className="w-4 h-4 text-emerald-700" />
                <span className="font-extrabold text-emerald-950 text-xs">المبلغ المطلوب تحصيله كاش:</span>
              </div>
              <span className="font-black text-emerald-700 text-base font-mono">
                {totalDue.toLocaleString()} دج
              </span>
            </div>

            <div className="pt-2 border-t border-emerald-200/80 flex items-center gap-2">
              <span className="text-[11px] text-emerald-900 font-bold">المبلغ المستلم فعلياً:</span>
              <input
                type="number"
                value={amountCollected}
                onChange={(e) => setAmountCollected(Number(e.target.value))}
                className="w-32 bg-white border border-emerald-300 rounded-xl px-2.5 py-1 text-xs font-black text-emerald-900 focus:outline-none focus:border-emerald-600 text-center"
              />
              <span className="text-[11px] text-emerald-800 font-bold">دج</span>
            </div>
          </div>

          {/* Verification Checklist */}
          <div className="space-y-2">
            <label className="block font-extrabold text-slate-900 text-xs">
              تأكيدات التسليم الإلزامية:
            </label>

            {/* Checkbox 1: Cash */}
            <button
              type="button"
              onClick={() => setIsCashCollected(!isCashCollected)}
              className={`w-full p-2.5 rounded-2xl border text-start flex items-center gap-2.5 transition-all cursor-pointer ${
                isCashCollected
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-950 font-bold'
                  : 'bg-slate-50 border-slate-200 text-slate-600'
              }`}
            >
              <div className={`w-5 h-5 rounded-lg flex items-center justify-center ${isCashCollected ? 'bg-emerald-600 text-white' : 'border border-slate-400'}`}>
                {isCashCollected && <CheckCircle2 className="w-4 h-4" />}
              </div>
              <div className="flex-1">
                <span className="text-xs block">تم استلام المبلغ نقداً بالكامل ({amountCollected.toLocaleString()} دج)</span>
                <span className="text-[10px] text-slate-500 font-normal">تأكيد خلو الذمة المالية للزبون</span>
              </div>
            </button>

            {/* Checkbox 2: Tested */}
            <button
              type="button"
              onClick={() => setIsTestedWithCustomer(!isTestedWithCustomer)}
              className={`w-full p-2.5 rounded-2xl border text-start flex items-center gap-2.5 transition-all cursor-pointer ${
                isTestedWithCustomer
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-950 font-bold'
                  : 'bg-slate-50 border-slate-200 text-slate-600'
              }`}
            >
              <div className={`w-5 h-5 rounded-lg flex items-center justify-center ${isTestedWithCustomer ? 'bg-emerald-600 text-white' : 'border border-slate-400'}`}>
                {isTestedWithCustomer && <CheckCircle2 className="w-4 h-4" />}
              </div>
              <div className="flex-1">
                <span className="text-xs block">تم فحص وتشغيل الهاتف والتأكد من جودة الصيانة مع الزبون</span>
                <span className="text-[10px] text-slate-500 font-normal">تمت معاينة الشاشة والأزرار واللمس</span>
              </div>
            </button>
          </div>

          {/* Optional Delivery Photo */}
          <div className="space-y-1.5">
            <label className="block font-extrabold text-slate-900 text-xs flex items-center gap-1.5">
              <Camera className="w-3.5 h-3.5 text-emerald-700" />
              <span>صورة توثيق التسليم أو وصل الاستلام (اختياري)</span>
            </label>

            <div className="border border-dashed border-emerald-200 bg-emerald-50/30 rounded-2xl p-2.5 text-center">
              {photoPreview ? (
                <div className="relative inline-block max-w-full">
                  <img
                    src={photoPreview}
                    alt="معاينة إثبات التسليم"
                    className="w-full max-h-36 object-cover rounded-xl border border-emerald-300"
                    referrerPolicy="no-referrer"
                  />
                  <label
                    htmlFor="delivery-photo-input"
                    className="absolute bottom-2 end-2 py-1 px-2 rounded-lg bg-slate-900/90 text-white text-[10px] font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Upload className="w-3 h-3" />
                    <span>تغيير</span>
                  </label>
                </div>
              ) : (
                <label
                  htmlFor="delivery-photo-input"
                  className="py-3 flex flex-col items-center justify-center cursor-pointer"
                >
                  <Camera className="w-5 h-5 text-emerald-600 mb-1" />
                  <span className="font-bold text-slate-700 text-[11px]">التقاط صورة توثيق التسليم</span>
                </label>
              )}

              <input
                id="delivery-photo-input"
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleSimulatePhotoUpload}
                className="hidden"
              />
            </div>
          </div>

          {/* Delivery Notes */}
          <div className="space-y-1.5">
            <label className="block font-extrabold text-slate-900 text-xs flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-emerald-700" />
              <span>ملاحظات التسليم:</span>
            </label>
            <textarea
              rows={2}
              value={deliveryNotes}
              onChange={(e) => setDeliveryNotes(e.target.value)}
              placeholder="مثال: تم التسليم للزبون شخصياً وأبدى رضاه التام عن الشاشة..."
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-2.5 text-xs text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white resize-none"
            />
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
              disabled={isSubmitting || !isCashCollected}
              className="py-2.5 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-600/25 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isSubmitting ? 'جاري التأكيد...' : 'تأكيد التسليم النهائي بنجاح'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
