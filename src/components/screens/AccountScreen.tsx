import React, { useState } from 'react';
import { RepairRequest } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { TheFixPointLogo } from '../TheFixPointLogo';
import { STATUS_METADATA } from '../../services/orderService';
import { 
  User, Smartphone, Clock, ShieldCheck, MapPin, 
  Globe, Bell, Phone, MessageCircle, FileText, ChevronRight, 
  ChevronLeft, Award, HelpCircle, CheckCircle2, ShieldAlert, Lock, ArrowRight, Truck
} from 'lucide-react';

interface AccountScreenProps {
  orders: RepairRequest[];
  onTrackOrder: (orderId: string) => void;
  onNavigateNewRequest: () => void;
  onOpenAdmin: () => void;
  onOpenCourier: () => void;
}

export const AccountScreen: React.FC<AccountScreenProps> = ({
  orders,
  onTrackOrder,
  onNavigateNewRequest,
  onOpenAdmin,
  onOpenCourier,
}) => {
  const { lang, setLang, t, isRtl } = useLanguage();
  const [pushEnabled, setPushEnabled] = useState(true);
  const [smsEnabled, setSmsEnabled] = useState(true);

  const activeOrder = orders.find((o) => o.status !== 'DELIVERED' && o.status !== 'CANCELLED') || orders[0];

  const ArrowIcon = isRtl ? ChevronLeft : ChevronRight;

  return (
    <div id="screen-user-account" className="space-y-4 pb-12 animate-in fade-in duration-200">
      {/* User Profile Header Card */}
      <div className="bg-slate-900 text-white rounded-3xl p-5 shadow-xl relative overflow-hidden space-y-3">
        <div className="absolute -top-6 -end-6 w-32 h-32 bg-blue-600/30 rounded-full blur-2xl pointer-events-none"></div>

        <div className="flex items-center gap-3.5 relative z-10">
          <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white font-black text-xl flex items-center justify-center shadow-lg shadow-blue-500/25">
            YZ
          </div>
          <div>
            <h2 className="text-base font-extrabold text-white">
              {lang === 'ar' ? 'ياسين زناتي' : 'Yassine Zenati'}
            </h2>
            <p className="text-xs text-sky-300 font-mono" dir="ltr">0550 12 34 56</p>
            <span className="inline-flex items-center gap-1 text-[10px] text-slate-300 bg-white/10 px-2 py-0.5 rounded-md mt-1">
              <MapPin className="w-2.5 h-2.5 text-sky-400" />
              {lang === 'ar' ? 'عقيد لطفي، وهران' : 'Akid Lotfi, Oran'}
            </span>
          </div>
        </div>
      </div>

      {/* Courier Portal Access Banner */}
      <div className="bg-linear-to-r from-amber-500/10 via-amber-500/5 to-slate-900 text-slate-900 rounded-3xl p-4 border border-amber-400/40 shadow-xs flex items-center justify-between gap-3 bg-white">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center shrink-0 font-black shadow-md shadow-amber-500/20">
            <Truck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-extrabold text-xs text-slate-900">
              {lang === 'ar' ? 'فضاء عامل التوصيل (Courier)' : 'Espace Livreur / Courier'}
            </h4>
            <p className="text-[10px] text-slate-500">
              {lang === 'ar' ? 'تسجيل الدخول، إدارة مهام الاستلام والتسليم وإثبات التسليم' : 'Missions de collecte, livraison et preuves'}
            </p>
          </div>
        </div>

        <button
          id="btn-open-courier-portal"
          onClick={onOpenCourier}
          className="py-2 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black shrink-0 flex items-center gap-1 shadow-xs active:scale-95 transition-all cursor-pointer"
        >
          <span>{lang === 'ar' ? 'دخول العامل' : 'Connexion'}</span>
          <ArrowIcon className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Admin Dashboard Access Banner (Secured) */}
      <div className="bg-linear-to-r from-slate-900 to-blue-950 text-white rounded-3xl p-4 border border-blue-500/30 shadow-md flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-blue-500/20 text-blue-300 border border-blue-500/30 flex items-center justify-center shrink-0">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-extrabold text-xs text-white">
              {lang === 'ar' ? 'لوحة تحكم The Fix Point (للإدارة)' : 'Espace Administration & Atelier'}
            </h4>
            <p className="text-[10px] text-slate-300">
              {lang === 'ar' ? 'إدارة كل الطلبات، تعيين عمال التوصيل وتعديل الأسعار' : 'Gestion globale, assignation et tarifs'}
            </p>
          </div>
        </div>

        <button
          id="btn-open-admin-portal"
          onClick={onOpenAdmin}
          className="py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shrink-0 flex items-center gap-1 shadow-xs active:scale-95 transition-all cursor-pointer"
        >
          <span>{lang === 'ar' ? 'دخول الإدارة' : 'Accéder'}</span>
          <ArrowIcon className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Cloud Firestore Live Status Banner */}
      <div className="bg-emerald-50 rounded-3xl p-3.5 border border-emerald-200/80 shadow-xs flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-700 flex items-center justify-center font-black">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <h5 className="font-bold text-xs text-emerald-900">
                {lang === 'ar' ? 'قاعدة بيانات سحابية متزامنة (Firebase Firestore)' : 'Base de données Firestore Connectée'}
              </h5>
            </div>
            <p className="text-[10px] text-emerald-700">
              {lang === 'ar' ? 'تحديث لحظي مباشر (Orders, Couriers, Prices, History)' : 'Synchronisation temps réel active'}
            </p>
          </div>
        </div>
        <span className="text-[10px] font-mono font-bold bg-emerald-600 text-white px-2 py-0.5 rounded-md">
          LIVE
        </span>
      </div>

      {/* Active Request Card */}
      {activeOrder && (
        <div className="bg-white rounded-3xl p-4.5 border border-blue-200 shadow-md space-y-3">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 text-xs font-black text-blue-700">
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping"></span>
              <span>{t('activeRequest')}</span>
            </span>
            <span className="font-mono text-xs font-black text-slate-900">
              {activeOrder.id}
            </span>
          </div>

          <div className="bg-blue-50/70 rounded-2xl p-3 flex items-center justify-between">
            <div>
              <h4 className="font-bold text-xs text-slate-900">
                {activeOrder.brand} {activeOrder.model}
              </h4>
              <p className="text-[11px] text-slate-600">
                {lang === 'ar' ? activeOrder.problemNameAr : activeOrder.problemNameFr}
              </p>
            </div>

            <button
              onClick={() => onTrackOrder(activeOrder.id)}
              className="py-1.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1 shadow-xs active:scale-95 transition-all cursor-pointer"
            >
              <span>{t('btnTrackOrder')}</span>
              <ArrowIcon className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Language Switcher & Settings */}
      <div className="bg-white rounded-3xl p-4 border border-slate-200/90 shadow-xs space-y-3">
        <h3 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
          <Globe className="w-4 h-4 text-blue-600" />
          <span>{t('appLanguage')}</span>
        </h3>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => setLang('ar')}
            className={`py-2.5 px-3 rounded-2xl text-xs font-bold border flex items-center justify-between transition-all cursor-pointer ${
              lang === 'ar'
                ? 'bg-blue-50 border-blue-600 text-blue-900 font-black'
                : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
          >
            <span>العربية (الافتراضية)</span>
            {lang === 'ar' && <CheckCircle2 className="w-4 h-4 text-blue-600" />}
          </button>

          <button
            onClick={() => setLang('fr')}
            className={`py-2.5 px-3 rounded-2xl text-xs font-bold border flex items-center justify-between transition-all cursor-pointer ${
              lang === 'fr'
                ? 'bg-blue-50 border-blue-600 text-blue-900 font-black'
                : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
          >
            <span>Français</span>
            {lang === 'fr' && <CheckCircle2 className="w-4 h-4 text-blue-600" />}
          </button>
        </div>
      </div>

      {/* Notifications Preferences */}
      <div className="bg-white rounded-3xl p-4 border border-slate-200/90 shadow-xs space-y-3">
        <h3 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
          <Bell className="w-4 h-4 text-blue-600" />
          <span>{lang === 'ar' ? 'إشعارات متابعة الصيانة' : 'Notifications de réparation'}</span>
        </h3>

        <div className="space-y-2 text-xs">
          <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50">
            <div>
              <span className="font-bold text-slate-800 block">
                {lang === 'ar' ? 'إشعارات التطبيق المباشرة' : 'Notifications Push'}
              </span>
              <span className="text-[10px] text-slate-500">
                {lang === 'ar' ? 'تنبيهك فور انطلاق التقني أو انتهاء التصليح' : 'Alerte départ du technicien et fin de réparation'}
              </span>
            </div>
            <input
              type="checkbox"
              checked={pushEnabled}
              onChange={(e) => setPushEnabled(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50">
            <div>
              <span className="font-bold text-slate-800 block">
                {lang === 'ar' ? 'رسائل تأكيد SMS' : 'SMS de confirmation'}
              </span>
              <span className="text-[10px] text-slate-500">
                {lang === 'ar' ? 'استلام رقم الطلب والتفاصيل بالرسائل القصيرة' : 'Réception du code de demande par SMS'}
              </span>
            </div>
            <input
              type="checkbox"
              checked={smsEnabled}
              onChange={(e) => setSmsEnabled(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Previous Repair Requests History */}
      <div className="bg-white rounded-3xl p-4.5 border border-slate-200/90 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-blue-600" />
            <span>{t('myRequests')}</span>
          </h3>
          <span className="text-[11px] font-bold text-slate-500">
            {orders.length} {lang === 'ar' ? 'طلبات' : 'demandes'}
          </span>
        </div>

        <div className="space-y-2">
          {orders.map((ord) => {
            const meta = STATUS_METADATA[ord.status] || STATUS_METADATA.NEW;
            return (
              <div
                key={ord.id}
                onClick={() => onTrackOrder(ord.id)}
                className="p-3 rounded-2xl border border-slate-100 bg-slate-50/70 hover:bg-blue-50/50 hover:border-blue-200 transition-all cursor-pointer flex items-center justify-between gap-2"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-xs text-blue-900">{ord.id}</span>
                    <span
                      className={`text-[9px] font-bold px-2 py-0.5 rounded-md border ${meta.badgeBg} ${meta.badgeText}`}
                    >
                      {lang === 'ar' ? meta.labelAr : meta.labelFr}
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-slate-800 mt-0.5">
                    {ord.brand} {ord.model} • {lang === 'ar' ? ord.problemNameAr : ord.problemNameFr}
                  </p>
                  <span className="text-[10px] text-slate-400 font-mono block">
                    {ord.createdAt}
                  </span>
                </div>

                <div className="text-end shrink-0 flex items-center gap-1">
                  <span className="font-mono font-bold text-xs text-slate-900">
                    {(ord.finalPrice ?? ord.estimatedTotal ?? 0).toLocaleString()} {t('dzd')}
                  </span>
                  <ArrowIcon className="w-4 h-4 text-slate-400" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Oran Coverage Area & Warranty Reassurance Card */}
      <div className="bg-linear-to-br from-blue-900 to-slate-950 text-white rounded-3xl p-5 shadow-lg space-y-3">
        <div className="flex items-center gap-2 font-black text-sm">
          <ShieldCheck className="w-5 h-5 text-sky-400" />
          <span>{t('warrantyTitle')}</span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          {t('warrantyDesc')}
        </p>

        <div className="pt-2 border-t border-slate-800 text-xs space-y-1">
          <p className="font-bold text-sky-300">{t('coverageArea')}:</p>
          <p className="text-slate-300 text-[11px]">
            {t('coverageDesc')}
          </p>
        </div>

        <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs text-slate-300">
          <span>{t('workshopLocation')}:</span>
          <span className="font-medium text-white">{t('workshopAddress')}</span>
        </div>
      </div>
    </div>
  );
};
