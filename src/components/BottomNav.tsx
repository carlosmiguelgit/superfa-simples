import React from 'react';
import { LayoutDashboard, MessageSquareText, Trophy } from 'lucide-react';

interface BottomNavProps {
  activeTab: 'dash' | 'depoimentos' | 'ranking';
  setActiveTab: (tab: 'dash' | 'depoimentos' | 'ranking') => void;
  isDarkMode?: boolean;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, setActiveTab, isDarkMode = true }) => {
  return (
    <nav className={`relative z-20 h-16 backdrop-blur-2xl border-t flex items-center justify-around px-4 transition-colors duration-500 ${isDarkMode ? 'bg-black/90 border-white/10' : 'bg-white/80 border-black/5'}`}>
      <button 
        onClick={() => setActiveTab('dash')}
        className={`flex flex-col items-center justify-center gap-1 transition-all duration-300 ${activeTab === 'dash' ? 'text-brand-red' : (isDarkMode ? 'text-white/40 hover:text-white/70' : 'text-slate-300 hover:text-slate-500')}`}
      >
        <LayoutDashboard className={`w-5 h-5 transition-transform ${activeTab === 'dash' ? 'scale-110' : ''}`} />
        <span className="text-[9px] font-bold uppercase tracking-widest">Dash</span>
      </button>
      <button 
        onClick={() => setActiveTab('depoimentos')}
        className={`flex flex-col items-center justify-center gap-1 transition-all duration-300 ${activeTab === 'depoimentos' ? 'text-brand-red' : (isDarkMode ? 'text-white/40 hover:text-white/70' : 'text-slate-300 hover:text-slate-500')}`}
      >
        <MessageSquareText className={`w-5 h-5 transition-transform ${activeTab === 'depoimentos' ? 'scale-110' : ''}`} />
        <span className="text-[9px] font-bold uppercase tracking-widest">Depoimentos</span>
      </button>
      <button 
        onClick={() => setActiveTab('ranking')}
        className={`flex flex-col items-center justify-center gap-1 transition-all duration-300 ${activeTab === 'ranking' ? 'text-brand-red' : (isDarkMode ? 'text-white/40 hover:text-white/70' : 'text-slate-300 hover:text-slate-500')}`}
      >
        <Trophy className={`w-5 h-5 transition-transform ${activeTab === 'ranking' ? 'scale-110' : ''}`} />
        <span className="text-[9px] font-bold uppercase tracking-widest">Ranking</span>
      </button>
    </nav>
  );
};