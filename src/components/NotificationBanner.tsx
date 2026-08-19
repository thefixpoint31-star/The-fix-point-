import React, { useState, useEffect } from 'react';
import { InAppNotification } from '../types';
import { OrderService, subscribeToOrders, STATUS_METADATA } from '../services/orderService';
import { useLanguage } from '../context/LanguageContext';
import { Bell, CheckCircle2, Truck, Wrench, X, ArrowRight, ArrowLeft, Sparkles, Smartphone } from 'lucide-react';

interface NotificationBannerProps {
  onTrackOrder: (orderId: string) => void;
}

export const NotificationBanner: React.FC<NotificationBannerProps> = ({ onTrackOrder }) => {
  const { lang, isRtl } = useLanguage();
  const [activeNotification, setActiveNotification] = useState<InAppNotification | null>(null);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [allNotifications, setAllNotifications] = useState<InAppNotification[]>([]);

  const loadNotifications = () => {
    const list = OrderService.getNotifications();
    setAllNotifications(list);
    const unread = list.filter((n) => !n.isRead);
    setUnreadCount(unread.length);

    // If there is a fresh unread notification, pop it up
    if (unread.length > 0) {
      setActiveNotification(unread[0]);
    }
  };

  useEffect(() => {
    loadNotifications();
    const unsubscribe = subscribeToOrders(() => {
      loadNotifications();
    });
    return () => unsubscribe();
  }, []);

  const handleDismissBanner = () => {
    if (activeNotification) {
      OrderService.markNotificationAsRead(activeNotification.id);
    }
    setActiveNotification(null);
  };

  const handleActionClick = (orderId: string, notifId?: string) => {
    if (notifId) {
      OrderService.markNotificationAsRead(notifId);
    }
    setActiveNotification(null);
    setShowDropdown(false);
    onTrackOrder(orderId);
  };

  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  return (
    <>
      {/* Floating Push-Like Toast Banner */}
      {activeNotification && (
        <div
          id="in-app-notification-toast"
          className="sticky top-14 z-50 px-3 py-1.5 animate-in slide-in-from-top-4 duration-300 pointer-events-auto"
        >
          <div className="bg-slate-900/95 text-white rounded-2xl p-3.5 shadow-2xl border border-blue-500/40 backdrop-blur-md flex items-start gap-3">
            {/* Status Icon */}
            <div className="w-9 h-9 rounded-xl bg-blue-600/90 text-white flex items-center justify-center shrink-0 shadow-md shadow-blue-500/30">
              {activeNotification.status === 'TECHNICIAN_ON_WAY' ? (
                <Truck className="w-4.5 h-4.5 text-sky-200 animate-pulse" />
              ) : activeNotification.status === 'READY' || activeNotification.status === 'DELIVERED' ? (
                <CheckCircle2 className="w-4.5 h-4.5 text-emerald-300" />
              ) : (
                <Bell className="w-4.5 h-4.5 text-amber-300" />
              )}
            </div>

            {/* Notification Text */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-1">
                <span className="text-[10px] font-mono font-bold text-sky-400 bg-sky-950/80 px-1.5 py-0.5 rounded">
                  {activeNotification.orderId}
                </span>
                <span className="text-[10px] text-slate-400">
                  {activeNotification.timestamp.split(' ')[1] || 'الآن'}
                </span>
              </div>

              <p className="text-xs font-black text-slate-100 mt-1 leading-snug">
                {lang === 'ar' ? activeNotification.messageAr : activeNotification.messageFr}
              </p>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 mt-2">
                <button
                  id="btn-toast-track"
                  onClick={() => handleActionClick(activeNotification.orderId, activeNotification.id)}
                  className="py-1 px-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-bold flex items-center gap-1 active:scale-95 transition-all cursor-pointer"
                >
                  <span>{lang === 'ar' ? 'تتبع الطلب الآن' : 'Suivre la demande'}</span>
                  <ArrowIcon className="w-3 h-3" />
                </button>

                <button
                  onClick={handleDismissBanner}
                  className="py-1 px-2 text-[11px] text-slate-300 hover:text-white cursor-pointer"
                >
                  {lang === 'ar' ? 'إغلاق' : 'Fermer'}
                </button>
              </div>
            </div>

            {/* Dismiss Cross */}
            <button
              onClick={handleDismissBanner}
              className="text-slate-400 hover:text-slate-200 p-1 rounded-lg hover:bg-white/10 shrink-0 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};
