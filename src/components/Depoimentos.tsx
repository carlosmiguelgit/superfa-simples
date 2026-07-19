import React, { useEffect, useRef } from 'react';
import { MessageSquare, User } from 'lucide-react';
import { Testimonial } from '../types';

interface DepoimentosProps {
  dynamicTestimonials: Testimonial[];
  highlightName?: string | null;
  isDarkMode?: boolean;
}

export const Depoimentos: React.FC<DepoimentosProps> = ({ 
  dynamicTestimonials, 
  highlightName,
  isDarkMode = true
}) => {
  const allTestimonials = dynamicTestimonials;
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (highlightName) {
      const element = document.getElementById(`testimonial-${highlightName}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [highlightName]);

  return (
    <div className="mt-2" ref={containerRef}>
      <div className="flex items-center justify-between mb-4 px-2">
        <h4 className={`text-xs font-bold uppercase tracking-widest ${isDarkMode ? 'text-white/70' : 'text-slate-400'}`}>Depoimentos ({allTestimonials.length})</h4>
        <MessageSquare className={`w-4 h-4 ${isDarkMode ? 'text-white/50' : 'text-slate-300'}`} />
      </div>
      
      <div className="space-y-3">
        {allTestimonials.map((t, idx) => (
          <div 
            key={`${t.id}-${idx}`} 
            id={`testimonial-${t.name}`}
            className={`glass rounded-2xl p-4 flex items-center justify-between transition-all ${
              isDarkMode 
                ? 'bg-white/[0.04] border-white/5' 
                : 'bg-black/[0.02] border-black/5'
            } ${highlightName === t.name ? 'border-brand-red bg-brand-red/10 scale-[1.02]' : ''}`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center overflow-hidden border ${isDarkMode ? 'bg-white/5 border-white/20' : 'bg-black/5 border-black/10'}`}>
                {t.photo ? (
                  <img src={t.photo} alt={t.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                ) : (
                  <User className={`w-5 h-5 ${isDarkMode ? 'text-white/70' : 'text-slate-400'}`} />
                )}
              </div>
              <div>
                <p className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
                  {t.name}
                </p>
                {t.username && (
                  <p className={`text-[9px] ${isDarkMode ? 'text-white/40' : 'text-slate-400'}`}>
                    @{t.username}
                  </p>
                )}
                {t.months && (
                  <p className={`text-[10px] uppercase ${isDarkMode ? 'text-white/60' : 'text-slate-400'}`}>
                    {t.months} {t.months === 1 ? 'MÊS' : 'MESES'}
                  </p>
                )}
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold text-brand-red">{t.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
              <p className={`text-[8px] uppercase tracking-widest ${isDarkMode ? 'text-white/40' : 'text-slate-300'}`}>Liberado</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
