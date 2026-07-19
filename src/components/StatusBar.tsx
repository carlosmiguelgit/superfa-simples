import React from 'react';
import { Signal, Wifi, Moon, Sun } from 'lucide-react';
import { PopularBadge } from './PopularBadge';

interface StatusBarProps {
  onBatteryClick: () => void;
  isDarkMode: boolean;
  onThemeToggle: () => void;
  popularRank: number;
}

export const StatusBar: React.FC<StatusBarProps> = ({ 
  onBatteryClick, 
  isDarkMode, 
  onThemeToggle,
  popularRank
}) => {
  return (
    <div className="relative z-30 px-6 pt-4 pb-0 flex justify-between items-start tracking-tight">
      <div className="flex flex-col items-start gap-1">
        <button 
          type="button"
          onClick={(e) => {
            e.preventDefault();
            onThemeToggle();
          }}
          className={`flex items-center gap-1.5 py-1 px-2 rounded-full border transition-all active:scale-95 cursor-pointer ${
            isDarkMode 
              ? 'bg-white/10 border-white/20 text-white/70' 
              : 'bg-black/5 border-black/10 text-slate-500'
          }`}
        >
          {isDarkMode ? <Sun className="w-2.5 h-2.5" /> : <Moon className="w-2.5 h-2.5" />}
          <span className="text-[8px] font-black uppercase tracking-wider">
            {isDarkMode ? 'Light' : 'Dark'}
          </span>
        </button>
      </div>

      <div className="flex flex-col items-end">
        <div className={`flex items-center gap-1.5 mt-1 ${isDarkMode ? 'text-white/50' : 'text-slate-400'}`}>
          <Signal className="w-3 h-3" />
          <Wifi className="w-3 h-3" />
          <div 
            className="flex items-center gap-0.5 cursor-pointer active:scale-95 transition-transform"
            onClick={onBatteryClick}
          >
            <div className={`w-5 h-2.5 border rounded-[3px] p-[1px] flex items-center ${isDarkMode ? 'border-white/30' : 'border-black/20'}`}>
              <div className={`h-full w-[80%] rounded-[1px] ${isDarkMode ? 'bg-white/60' : 'bg-slate-500'}`} />
            </div>
            <div className={`w-0.5 h-1 rounded-r-full ${isDarkMode ? 'bg-white/30' : 'bg-black/20'}`} />
          </div>
        </div>
        
        <PopularBadge rank={popularRank} isDarkMode={isDarkMode} />
      </div>
    </div>
  );
};