import React from 'react';
import { ScreenTab } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { Home, Wrench, Search, Tag, User, Clock } from 'lucide-react';

interface BottomNavProps {
  currentTab: ScreenTab;
  onSelectTab: (tab: ScreenTab) => void;
  activeOrdersCount?: number;
}

export const BottomNavigation: React.FC<BottomNavProps> = ({
  currentTab,
  onSelectTab,
  activeOrdersCount = 1,
}) => {
  const { t } = useLanguage();

  const navItems: { id: ScreenTab; label: string; icon: React.ComponentType<{ className?: string }>; badge?: number; isFab?: boolean }[] = [
    {
      id: 'home',
      label: t('navHome'),
      icon: Home,
    },
    {
      id: 'request',
      label: t('navRequest'),
      icon: Wrench,
      isFab: true,
    },
    {
      id: 'tracking',
      label: t('navTracking'),
      icon: Clock,
      badge: activeOrdersCount > 0 ? activeOrdersCount : undefined,
    },
    {
      id: 'prices',
      label: t('navPrices'),
      icon: Search,
    },
    {
      id: 'offers',
      label: t('navOffers'),
      icon: Tag,
    },
    {
      id: 'account',
      label: t('navAccount'),
      icon: User,
    },
  ];

  return (
    <nav
      id="android-bottom-nav"
      className="sticky bottom-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 px-2 py-1.5 shadow-lg select-none"
    >
      <div className="max-w-md mx-auto grid grid-cols-6 items-center gap-1">
        {navItems.map((item) => {
          const isActive = currentTab === item.id;
          const Icon = item.icon;

          if (item.isFab) {
            return (
              <button
                key={item.id}
                id={`bottom-nav-${item.id}`}
                onClick={() => onSelectTab(item.id)}
                className="col-span-1 flex flex-col items-center justify-center -mt-4 group active:scale-95 transition-transform"
              >
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-blue-700 text-white ring-4 ring-blue-100 scale-105'
                      : 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-500/25'
                  }`}
                >
                  <Icon className="w-6 h-6" />
                </div>
                <span
                  className={`text-[10px] font-bold mt-1 truncate max-w-full ${
                    isActive ? 'text-blue-700 font-extrabold' : 'text-slate-600'
                  }`}
                >
                  {item.label}
                </span>
              </button>
            );
          }

          return (
            <button
              key={item.id}
              id={`bottom-nav-${item.id}`}
              onClick={() => onSelectTab(item.id)}
              className={`relative col-span-1 flex flex-col items-center justify-center py-1 rounded-xl transition-all ${
                isActive ? 'text-blue-700' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <div
                className={`relative px-3 py-1 rounded-full transition-all duration-200 ${
                  isActive ? 'bg-blue-50 text-blue-700 font-bold' : ''
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />

                {item.badge !== undefined && (
                  <span className="absolute -top-1 -end-1 w-4 h-4 bg-emerald-500 text-white rounded-full text-[9px] font-mono font-bold flex items-center justify-center ring-2 ring-white">
                    {item.badge}
                  </span>
                )}
              </div>

              <span
                className={`text-[10px] tracking-tight truncate max-w-full mt-0.5 ${
                  isActive ? 'font-black text-blue-700' : 'font-medium text-slate-500'
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
