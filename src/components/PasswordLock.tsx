"use client";

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Lock, ArrowRight } from 'lucide-react';

interface PasswordLockProps {
  onSuccess: () => void;
  isDarkMode?: boolean;
}

export const PasswordLock: React.FC<PasswordLockProps> = ({ onSuccess, isDarkMode = false }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const correctPassword = 'Tda669669!';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === correctPassword) {
      onSuccess();
    } else {
      setError(true);
      setTimeout(() => setError(false), 500);
    }
  };

  return (
    <div className={`fixed inset-0 z-[500] flex items-center justify-center px-6 transition-colors duration-500 ${isDarkMode ? 'bg-brand-dark' : 'bg-[#FDFCF7]'}`}>
      <div className={`absolute top-[-10%] left-[-10%] w-[60%] h-[40%] blur-[120px] rounded-full transition-opacity ${isDarkMode ? 'bg-brand-red/20 opacity-100' : 'bg-brand-red/10 opacity-50'}`} />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm relative z-10"
      >
        <div className="flex flex-col items-center text-center mb-10">
          <div className={`w-16 h-16 rounded-3xl flex items-center justify-center mb-6 border ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-black/5 border-black/10'}`}>
            <Lock className="w-8 h-8 text-brand-red" />
          </div>
          <h1 className={`text-2xl font-black uppercase tracking-tighter mb-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Acesso Restrito</h1>
          <p className={`text-sm font-medium ${isDarkMode ? 'text-white/40' : 'text-slate-400'}`}>Insira sua chave de acesso para continuar</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Digite a senha"
              className={`w-full rounded-2xl py-4 px-6 text-white placeholder:text-slate-500 outline-none transition-all border-2 ${
                isDarkMode ? 'bg-white/5 text-white' : 'bg-black/5 text-slate-900'
              } ${
                error ? 'border-brand-red animate-shake' : (isDarkMode ? 'border-white/5 focus:border-brand-red/50' : 'border-black/5 focus:border-brand-red/50')
              }`}
              autoFocus
            />
            <button
              type="submit"
              className="absolute right-2 top-2 bottom-2 aspect-square bg-brand-red text-white rounded-xl flex items-center justify-center active:scale-95 transition-transform"
            >
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
          {error && (
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center text-brand-red text-[11px] font-bold uppercase tracking-widest"
            >
              Senha Incorreta
            </motion.p>
          )}
        </form>

        <div className="mt-16 text-center">
          <p className={`text-[10px] font-bold uppercase tracking-[0.3em] ${isDarkMode ? 'text-white/20' : 'text-slate-300'}`}>CashFlow Pro • Secured</p>
        </div>
      </motion.div>
    </div>
  );
};