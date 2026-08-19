import React from 'react';

interface LogoProps {
  variant?: 'full' | 'compact' | 'mark-only' | 'badge';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  theme?: 'dark' | 'light' | 'blue-bg';
  className?: string;
}

export const TheFixPointLogo: React.FC<LogoProps> = ({
  variant = 'full',
  size = 'md',
  theme = 'light',
  className = '',
}) => {
  // Size metrics
  const markSize = {
    sm: 'w-7 h-7',
    md: 'w-10 h-10',
    lg: 'w-13 h-13',
    xl: 'w-18 h-18',
  }[size];

  const titleSize = {
    sm: 'text-sm',
    md: 'text-lg',
    lg: 'text-2xl',
    xl: 'text-3xl',
  }[size];

  const subSize = {
    sm: 'text-[9px]',
    md: 'text-[11px]',
    lg: 'text-xs',
    xl: 'text-sm',
  }[size];

  const isLight = theme === 'light';
  const isBlueBg = theme === 'blue-bg';

  const textColorPrimary = isBlueBg ? 'text-white' : isLight ? 'text-slate-900' : 'text-white';
  const textColorSecondary = isBlueBg ? 'text-blue-100' : isLight ? 'text-slate-500' : 'text-slate-400';
  const accentBlue = '#0D6EFD';

  const LogoMark = (
    <div id="the-fix-point-mark" className={`relative flex items-center justify-center shrink-0 ${markSize}`}>
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-sm">
        {/* Outer Hexagon / Shield Frame */}
        <path
          d="M50 4L88 25V75L50 96L12 75V25L50 4Z"
          fill={isBlueBg ? '#FFFFFF' : '#0F172A'}
        />
        
        {/* Blue Core Layer */}
        <path
          d="M50 10L82 28V72L50 90L18 72V28L50 10Z"
          fill={isBlueBg ? '#0D6EFD' : '#0D6EFD'}
        />

        {/* Smartphone Contour in center */}
        <rect
          x="35"
          y="24"
          width="30"
          height="52"
          rx="6"
          fill={isBlueBg ? '#FFFFFF' : '#FFFFFF'}
        />
        
        {/* Screen inner area */}
        <rect
          x="38"
          y="30"
          width="24"
          height="40"
          rx="3"
          fill="#0F172A"
        />

        {/* Target / Fix Point Center Pin with Screwdriver cross & circuit node */}
        <circle cx="50" cy="50" r="7" fill="#0D6EFD" />
        <circle cx="50" cy="50" r="3" fill="#FFFFFF" />

        {/* Crosshair precision markers */}
        <line x1="50" y1="40" x2="50" y2="44" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="50" y1="56" x2="50" y2="60" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="40" y1="50" x2="44" y2="50" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="56" y1="50" x2="60" y2="50" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" />

        {/* Top Speaker slit */}
        <rect x="46" y="26.5" width="8" height="1.5" rx="0.75" fill="#94A3B8" />

        {/* Dynamic Tech Pulse Rings */}
        <path
          d="M26 44C26 38 30 33 36 31"
          stroke="#38BDF8"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <path
          d="M74 56C74 62 70 67 64 69"
          stroke="#38BDF8"
          strokeWidth="2.5"
          strokeLinecap="round"
        />

        {/* Wrench / Tool Accent indicator */}
        <circle cx="50" cy="80" r="2" fill="#38BDF8" />
      </svg>
    </div>
  );

  if (variant === 'mark-only') {
    return <div className={`inline-flex items-center ${className}`}>{LogoMark}</div>;
  }

  return (
    <div id="the-fix-point-logo-wrapper" className={`inline-flex items-center gap-2.5 sm:gap-3 ${className}`}>
      {LogoMark}
      
      {variant !== 'badge' && (
        <div className="flex flex-col text-start justify-center leading-tight">
          <div className="flex items-center gap-1.5 font-black tracking-tight font-sans">
            <span className={`font-black uppercase tracking-wider ${textColorPrimary} ${titleSize}`}>
              THE FIX <span className="text-blue-600">POINT</span>
            </span>
          </div>
          {variant === 'full' && (
            <div className={`flex items-center gap-1.5 font-medium tracking-wide ${textColorSecondary} ${subSize}`}>
              <span className="font-semibold text-blue-600">ORAN</span>
              <span>•</span>
              <span>REPAIR & DELIVERY</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
