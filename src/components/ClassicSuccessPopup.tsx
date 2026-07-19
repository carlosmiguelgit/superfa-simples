"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { TwoDotLoader } from './TwoDotLoader';

interface ClassicSuccessPopupProps {
  isOpen: boolean;
  onClose: () => void;
  name: string;
  value: number;
  isDarkMode: boolean;
}

export const ClassicSuccessPopup: React.FC<ClassicSuccessPopupProps> = ({
  isOpen,
  onClose,
  name,
  value,
  isDarkMode
}) => {
  const [step, setStep] = useState<'loading' | 'success'>('loading');
  const [loadingText, setLoadingText] = useState("Validando usuário...");

  useEffect(() => {
    if (isOpen) {
      setStep('loading');
      setLoadingText("Validando usuário...");
      
      const t1 = setTimeout(() => setLoadingText("Processando transação..."), 1200);
      const t2 = setTimeout(() => setLoadingText("Finalizando..."), 2400);
      const t3 = setTimeout(() => setStep('success'), 3500);
      
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
        clearTimeout(t3);
      };
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center px-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/90 backdrop-blur-md"
          />
          
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className={`relative w-full max-w-xs rounded-[32px] p-8 text-center shadow-2xl border ${
              isDarkMode ? 'bg-zinc-900 border-white/10' : 'bg-white border-black/5'
            }`}
          >
            {step === 'loading' ? (
              <div className="py-6 flex flex-col items-center gap-8">
                <TwoDotLoader size="md" />
                <p className={`text-sm font-bold uppercase tracking-widest ${isDarkMode ? 'text-white/70' : 'text-slate-500'}`}>
                  {loadingText}
                </p>
              </div>
            ) : (
              <>
                <div className="mb-6 flex justify-center">
                   <div className="w-16 h-1 bg-brand-red rounded-full opacity-50 mb-2" />
                </div>
                
                <h3 className={`text-2xl font-black mb-2 uppercase tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                  Transferência concluída
                </h3>
                
                <div className="my-6 space-y-1">
                  <p className={`text-sm ${isDarkMode ? 'text-white/60' : 'text-slate-500'}`}>
                    Você enviou para <span className="font-bold text-brand-red">{name}</span>
                  </p>
                  <p className="text-3xl font-black text-brand-red">
                    R$ {value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                </div>

                <button
                  onClick={onClose}
                  className="w-full py-4 bg-brand-red text-white font-black uppercase tracking-[0.2em] rounded-2xl active:scale-95 transition-transform shadow-lg shadow-brand-red/20"
                >
                  Fechar
                </button>
              </>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};