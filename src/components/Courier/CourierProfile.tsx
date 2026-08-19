import React from 'react';
import { CourierUser } from '../../types';
import { CourierService } from '../../services/courierService';
import { 
  User, Phone, Truck, ShieldCheck, MapPin, 
  CheckCircle2, Clock, LogOut, PhoneCall, AlertTriangle
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface CourierProfileProps {
  courier: CourierUser;
  onLogout: () => void;
  onNavigateToTasks: () => void;
}

export const CourierProfile: React.FC<CourierProfileProps> = ({
  courier,
  onLogout,
  onNavigateToTasks,
}) => {
  const { lang, isRtl } = useLanguage();
  const stats = CourierService.getCourierStats(courier.id);

  return (
    <div id="courier-profile-view" className="space-y-4 pb-20 animate-in fade-in duration-150">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-3xl p-5 text-white shadow-lg relative overflow-hidden">
        <div className="absolute top-0 end-0 -mt-4 -me-4 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-center gap-3.5 relative z-10">
          <div className="w-14 h-14 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-black text-xl shadow-lg shadow-amber-500/20">
            {courier.name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-black text-white">{courier.name}</h2>
              <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                عامل توصيل معتمد
              </span>
            </div>
            <p className="text-xs text-blue-200 font-mono mt-0.5" dir="ltr">{courier.phoneNumber}</p>
            <p className="text-[11px] text-slate-300 flex items-center gap-1 mt-1">
              <MapPin className="w-3 h-3 text-amber-400" />
              <span>نطاق التغطية: {courier.commune}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Performance Stats Grid */}
      <div className="grid grid-cols-3 gap-2.5">
        <div className="bg-white border border-slate-200/90 rounded-2xl p-3.5 text-center shadow-xs">
          <div className="w-7 h-7 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center mx-auto mb-1.5 font-bold">
            <Clock className="w-4 h-4" />
          </div>
          <span className="text-lg font-black text-slate-900 block font-mono">{stats.inProgress}</span>
          <span className="text-[10px] font-bold text-slate-500 block">قيد التنفيذ</span>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-2xl p-3.5 text-center shadow-xs">
          <div className="w-7 h-7 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto mb-1.5 font-bold">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <span className="text-lg font-black text-emerald-700 block font-mono">{stats.completed}</span>
          <span className="text-[10px] font-bold text-slate-500 block">طلبات مكتملة</span>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-2xl p-3.5 text-center shadow-xs">
          <div className="w-7 h-7 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center mx-auto mb-1.5 font-bold">
            <Truck className="w-4 h-4" />
          </div>
          <span className="text-lg font-black text-slate-900 block font-mono">{stats.total}</span>
          <span className="text-[10px] font-bold text-slate-500 block">إجمالي المهام</span>
        </div>
      </div>

      {/* Vehicle & Identity Details */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-4 space-y-3 shadow-xs text-xs">
        <h3 className="font-extrabold text-slate-900 text-xs flex items-center gap-1.5 border-b border-slate-100 pb-2">
          <Truck className="w-4 h-4 text-blue-600" />
          <span>بيانات المركبة والاعتماد</span>
        </h3>

        <div className="grid grid-cols-2 gap-3 text-slate-700">
          <div>
            <span className="text-[10px] text-slate-400 block">نوع المركبة:</span>
            <span className="font-bold text-slate-900">
              {courier.vehicleType === 'moto' ? 'دراجة نارية (Moto)' : courier.vehicleType === 'car' ? 'سيارة (Voiture)' : 'سكوتر'}
            </span>
          </div>

          <div>
            <span className="text-[10px] text-slate-400 block">رقم لوحة الترقيم:</span>
            <span className="font-bold text-slate-900 font-mono" dir="ltr">{courier.vehiclePlate || '18492-116-31'}</span>
          </div>

          <div>
            <span className="text-[10px] text-slate-400 block">حالة الحساب:</span>
            <span className="inline-flex items-center gap-1 text-emerald-700 font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>نشط ومتاح لاستلام المهام</span>
            </span>
          </div>

          <div>
            <span className="text-[10px] text-slate-400 block">تاريخ الانضمام:</span>
            <span className="font-bold text-slate-800 font-mono">{courier.createdAt}</span>
          </div>
        </div>
      </div>

      {/* Direct Contact with The Fix Point Dispatch */}
      <div className="bg-slate-900 text-white rounded-2xl p-4 space-y-2.5">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-black text-xs text-white">إدارة التنسيق والورشة (Dispatch)</h4>
            <p className="text-[10px] text-slate-300">لأي طارئ أو استفسار فني يرجى الاتصال فوراً</p>
          </div>
          <a
            href="tel:0549994001"
            className="py-2 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center gap-1 shadow-sm transition-all"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>اتصال بالورشة</span>
          </a>
        </div>
      </div>

      {/* Security Statement */}
      <div className="bg-blue-50 border border-blue-200/80 rounded-2xl p-3 flex items-start gap-2.5 text-[11px] text-blue-900">
        <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
        <p>
          حسابك محمي بنظام أمان معزول. يتم تسجيل جميع عمليات الاستلام والتسليم مع التوقيت والتوثيق الفوتوغرافي لضمان أعلى معايير الشفافية والموثوقية.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="space-y-2 pt-2">
        <button
          type="button"
          onClick={onNavigateToTasks}
          className="w-full py-3 px-4 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-md shadow-blue-600/20 active:scale-98 transition-all cursor-pointer"
        >
          <Truck className="w-4 h-4" />
          <span>العودة إلى قائمة المهام والطلبات</span>
        </button>

        <button
          type="button"
          onClick={onLogout}
          className="w-full py-3 px-4 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-extrabold text-xs flex items-center justify-center gap-2 active:scale-98 transition-all cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>تسجيل الخروج من حساب عامل التوصيل</span>
        </button>
      </div>
    </div>
  );
};
