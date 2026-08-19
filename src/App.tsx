/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ScreenTab, ServiceType, RepairRequest, OrderStatus } from './types';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { AndroidStatusBar } from './components/AndroidStatusBar';
import { Header } from './components/Header';
import { BottomNavigation } from './components/BottomNavigation';
import { NotificationBanner } from './components/NotificationBanner';
import { HomeScreen } from './components/screens/HomeScreen';
import { RequestScreen } from './components/screens/RequestScreen';
import { TrackingScreen } from './components/screens/TrackingScreen';
import { PricesScreen } from './components/screens/PricesScreen';
import { OffersScreen } from './components/screens/OffersScreen';
import { AccountScreen } from './components/screens/AccountScreen';
import { AdminDashboard } from './components/Admin/AdminDashboard';
import { AdminAuthModal } from './components/Admin/AdminAuthModal';
import { CourierDashboard } from './components/Courier/CourierDashboard';
import { CourierAuthModal } from './components/Courier/CourierAuthModal';
import { OrderService, subscribeToOrders } from './services/orderService';
import { CourierService } from './services/courierService';
import { CourierUser } from './types';
import { WifiOff, AlertTriangle } from 'lucide-react';

const MainAppContent: React.FC = () => {
  const { lang, isRtl } = useLanguage();
  const [currentTab, setCurrentTab] = useState<ScreenTab>('home');
  const [clientOrders, setClientOrders] = useState<RepairRequest[]>([]);
  const [selectedTrackingOrderId, setSelectedTrackingOrderId] = useState<string>('ZP-000001');
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);

  // Admin Mode states
  const [isAdminMode, setIsAdminMode] = useState<boolean>(false);
  const [isAdminAuthModalOpen, setIsAdminAuthModalOpen] = useState<boolean>(false);

  // Courier Mode states
  const [currentCourier, setCurrentCourier] = useState<CourierUser | null>(null);
  const [isCourierAuthModalOpen, setIsCourierAuthModalOpen] = useState<boolean>(false);

  // Prefill state for Request Flow
  const [prefilledService, setPrefilledService] = useState<ServiceType>('at_home');
  const [prefilledBrand, setPrefilledBrand] = useState<string>('Apple');
  const [prefilledModel, setPrefilledModel] = useState<string>('iPhone 13');
  const [prefilledProblemId, setPrefilledProblemId] = useState<string>('screen');
  const [prefilledPromoCode, setPrefilledPromoCode] = useState<string>('');

  const reloadOrders = () => {
    const list = OrderService.getClientOrders();
    setClientOrders(list);
    if (list.length > 0 && (!selectedTrackingOrderId || selectedTrackingOrderId === 'ZP-000001')) {
      setSelectedTrackingOrderId(list[0].id);
    }
  };

  useEffect(() => {
    reloadOrders();
    const storedCourier = CourierService.getCurrentCourier();
    if (storedCourier) {
      setCurrentCourier(storedCourier);
    }

    const unsubscribe = subscribeToOrders(() => {
      reloadOrders();
    });

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      unsubscribe();
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Handle service selection from home cards
  const handleSelectServiceFromHome = (service: ServiceType) => {
    setPrefilledService(service);
    setCurrentTab('request');
  };

  // Handle brand selection from quick brand grid
  const handleSelectBrandForRepair = (brandName: string) => {
    setPrefilledBrand(brandName);
    setPrefilledModel('');
    setCurrentTab('request');
  };

  // Handle repair ordering from Prices screen
  const handleOrderSpecificRepair = (brand: string, model: string, problemCategory: string) => {
    setPrefilledBrand(brand);
    setPrefilledModel(model);
    setPrefilledProblemId(problemCategory);
    setCurrentTab('request');
  };

  // Handle offer promo apply
  const handleApplyOffer = (promoCode: string) => {
    setPrefilledPromoCode(promoCode);
    setCurrentTab('request');
  };

  // When a new order is confirmed in RequestScreen
  const handleOrderCreated = (newOrder: RepairRequest) => {
    reloadOrders();
    setSelectedTrackingOrderId(newOrder.id);
  };

  // Navigate to tracking screen for a specific order
  const handleTrackOrder = (orderId: string) => {
    setSelectedTrackingOrderId(orderId);
    setIsAdminMode(false);
    setCurrentCourier(null);
    setCurrentTab('tracking');
  };

  // Demo status updater for tracking screen
  const handleUpdateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    OrderService.updateOrderStatus(orderId, newStatus, undefined, 'client');
    reloadOrders();
  };

  const handleCourierLogout = () => {
    CourierService.logout();
    setCurrentCourier(null);
  };

  const activeOrdersCount = clientOrders.filter(
    (o) => o.status !== 'DELIVERED' && o.status !== 'CANCELLED'
  ).length;

  return (
    <div className="min-h-screen bg-slate-900 flex justify-center items-start sm:p-4 md:py-6">
      {/* Android Device Shell Container */}
      <div
        id="android-device-shell"
        className="w-full max-w-md bg-slate-100 min-h-screen sm:min-h-[850px] sm:max-h-[92vh] sm:rounded-4xl shadow-2xl flex flex-col overflow-hidden relative border-0 sm:border-8 sm:border-slate-800"
      >
        {/* Native Android Status Bar */}
        <AndroidStatusBar />

        {/* Offline Network Warning Banner */}
        {!isOnline && (
          <div
            id="offline-alert-banner"
            className="bg-amber-600 text-white px-3 py-1.5 text-[11px] font-bold flex items-center justify-center gap-2 shadow-xs transition-all animate-in fade-in"
          >
            <WifiOff className="w-3.5 h-3.5 shrink-0" />
            <span>
              {lang === 'ar'
                ? 'أنت غير متصل بالإنترنت حالياً • وضع العرض المحلي نشط'
                : 'Mode hors ligne actif • Consultation locale activée'}
            </span>
          </div>
        )}

        {/* Top App Bar Header with The Fix Point Logo & Lang Switcher */}
        {!currentCourier && (
          <Header
            onNavigateHome={() => {
              setIsAdminMode(false);
              setCurrentTab('home');
            }}
            onOpenQuickRequest={() => {
              setIsAdminMode(false);
              setCurrentTab('request');
            }}
          />
        )}

        {/* In-App Notifications Toast (Popup when technician status changes) */}
        {!currentCourier && !isAdminMode && (
          <NotificationBanner onTrackOrder={handleTrackOrder} />
        )}

        {/* Scrollable Main Screen Container */}
        <main
          id="app-main-viewport"
          className="flex-1 overflow-y-auto px-4 py-3 sm:px-4.5 no-scrollbar scroll-smooth"
        >
          {currentCourier ? (
            <CourierDashboard
              courier={currentCourier}
              onLogout={handleCourierLogout}
            />
          ) : isAdminMode ? (
            <AdminDashboard
              onExitAdmin={() => setIsAdminMode(false)}
              onTrackOrderInCustomerView={handleTrackOrder}
            />
          ) : (
            <>
              {currentTab === 'home' && (
                <HomeScreen
                  onSelectService={handleSelectServiceFromHome}
                  onNavigateTab={(tab) => setCurrentTab(tab)}
                  onSelectBrandForRepair={handleSelectBrandForRepair}
                />
              )}

              {currentTab === 'request' && (
                <RequestScreen
                  initialService={prefilledService}
                  initialBrand={prefilledBrand}
                  initialModel={prefilledModel}
                  initialProblemId={prefilledProblemId}
                  initialPromoCode={prefilledPromoCode}
                  onOrderCreated={handleOrderCreated}
                  onTrackOrder={handleTrackOrder}
                  onGoHome={() => setCurrentTab('home')}
                />
              )}

              {currentTab === 'tracking' && (
                <TrackingScreen
                  orders={clientOrders}
                  selectedOrderId={selectedTrackingOrderId}
                  onUpdateOrderStatus={handleUpdateOrderStatus}
                  onNavigateNewRequest={() => setCurrentTab('request')}
                />
              )}

              {currentTab === 'prices' && (
                <PricesScreen
                  onOrderSpecificRepair={handleOrderSpecificRepair}
                />
              )}

              {currentTab === 'offers' && (
                <OffersScreen
                  onApplyOffer={handleApplyOffer}
                />
              )}

              {currentTab === 'account' && (
                <AccountScreen
                  orders={clientOrders}
                  onTrackOrder={handleTrackOrder}
                  onNavigateNewRequest={() => setCurrentTab('request')}
                  onOpenAdmin={() => setIsAdminAuthModalOpen(true)}
                  onOpenCourier={() => setIsCourierAuthModalOpen(true)}
                />
              )}
            </>
          )}
        </main>

        {/* Android Material 3 Bottom Navigation Bar (Hidden in Admin/Courier Mode for clarity) */}
        {!isAdminMode && !currentCourier && (
          <BottomNavigation
            currentTab={currentTab}
            onSelectTab={(tab) => {
              setIsAdminMode(false);
              setCurrentTab(tab);
            }}
            activeOrdersCount={activeOrdersCount}
          />
        )}

        {/* Android System Gesture Bar Indicator */}
        <div className="w-full bg-white pb-1 pt-0.5 flex justify-center">
          <div className="w-28 h-1 bg-slate-300 rounded-full"></div>
        </div>
      </div>

      {/* Admin Authentication PIN Modal */}
      <AdminAuthModal
        isOpen={isAdminAuthModalOpen}
        onClose={() => setIsAdminAuthModalOpen(false)}
        onSuccess={() => {
          setIsAdminAuthModalOpen(false);
          setIsAdminMode(true);
        }}
      />

      {/* Courier Authentication PIN Modal */}
      <CourierAuthModal
        isOpen={isCourierAuthModalOpen}
        onClose={() => setIsCourierAuthModalOpen(false)}
        onSuccess={(courier) => {
          setIsCourierAuthModalOpen(false);
          setCurrentCourier(courier);
        }}
      />
    </div>
  );
};

export default function App() {
  return (
    <LanguageProvider>
      <MainAppContent />
    </LanguageProvider>
  );
}
