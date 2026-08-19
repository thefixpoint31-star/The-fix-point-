import React, { useState, useEffect } from 'react';
import { Wifi, Signal, BatteryCharging } from 'lucide-react';

export const AndroidStatusBar: React.FC = () => {
  const [time, setTime] = useState<string>('09:41');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      setTime(`${hours}:${minutes}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      id="android-status-bar"
      className="w-full bg-slate-950 text-slate-200 px-4 py-1.5 flex items-center justify-between text-xs font-semibold select-none z-50 transition-colors"
      dir="ltr"
    >
      <div className="flex items-center gap-1.5">
        <span className="font-mono text-[11px] tracking-tight text-slate-100">{time}</span>
        <span className="text-[10px] px-1 py-0.2 rounded bg-blue-600/30 text-blue-300 font-mono">4G+</span>
      </div>

      <div className="flex items-center gap-2 text-slate-300">
        <Signal className="w-3.5 h-3.5" />
        <Wifi className="w-3.5 h-3.5" />
        <div className="flex items-center gap-0.5">
          <span className="text-[10px] font-mono">98%</span>
          <BatteryCharging className="w-4 h-4 text-emerald-400" />
        </div>
      </div>
    </div>
  );
};
