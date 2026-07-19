import React from 'react';

interface PopularBadgeProps {
  rank: number;
  isDarkMode: boolean;
}

export const PopularBadge: React.FC<PopularBadgeProps> = ({ rank, isDarkMode }) => {
  return (
    <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full transition-all duration-500 self-end mt-1.5 ${
      isDarkMode 
        ? 'bg-black/40 text-white/90 border border-white/5' 
        : 'bg-black/10 text-slate-700 border border-black/5'
    }`}>
      {/* Imagem popular.png com tamanho aumentado em 10% */}
      <img 
        src="/popular.png" 
        alt="Popular Rank" 
        className="w-[15px] h-[14px] object-contain"
      />
      
      <span className="text-[11px] font-bold tracking-tight">
        Popular no. {rank}
      </span>
    </div>
  );
};