import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ShieldCheck,
  Calendar,
  Wallet,
  TriangleAlert,
  Loader2,
  CheckCircle2,
  Ban
} from 'lucide-react';
import { Notification } from '../types';

interface DashboardProps {
  notifications: Notification[];
  isAnonymousMode: boolean;
  isDarkMode?: boolean;
  onStartChat: (notif: Notification) => void;
  onRessarcir?: (notif: Notification) => void;
  onLiberarRecompensa?: (notif: Notification) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  notifications,
  isAnonymousMode,
  isDarkMode = true,
  onStartChat,
  onRessarcir,
  onLiberarRecompensa,
}) => {
  const [activeNotification, setActiveNotification] = useState<Notification | null>(null);
  const [ressarcindo, setRessarcindo] = useState(false);
  const [ressarcido, setRessarcido] = useState(false);
  const [libertando, setLibertando] = useState(false);
  const [recompensaEnviada, setRecompensaEnviada] = useState(false);

  useEffect(() => {
    if (!ressarcindo) return;
    const t = setTimeout(() => {
      setRessarcindo(false);
      setRessarcido(true);
    }, 3000);
    return () => clearTimeout(t);
  }, [ressarcindo]);

  useEffect(() => {
    if (!ressarcido || !activeNotification) return;
    const t = setTimeout(() => {
      onRessarcir?.(activeNotification);
      setRessarcido(false);
      setActiveNotification(null);
    }, 1500);
    return () => clearTimeout(t);
  }, [ressarcido, activeNotification, onRessarcir]);

  useEffect(() => {
    if (!libertando) return;
    const t = setTimeout(() => {
      setLibertando(false);
      setRecompensaEnviada(true);
    }, 3000);
    return () => clearTimeout(t);
  }, [libertando]);

  useEffect(() => {
    if (!recompensaEnviada || !activeNotification) return;
    const t = setTimeout(() => {
      onLiberarRecompensa?.(activeNotification);
      setRecompensaEnviada(false);
      setActiveNotification(null);
    }, 1500);
    return () => clearTimeout(t);
  }, [recompensaEnviada, activeNotification, onLiberarRecompensa]);

  const handleRessarcir = () => {
    setRessarcindo(true);
  };

  const handleLiberar = () => {
    setLibertando(true);
  };
  return (
    <>
      <AnimatePresence mode="wait">
            {activeNotification && (
              <motion.div
                key={activeNotification.id}
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -10, opacity: 0 }}
                className={`border rounded-[32px] p-6 mb-4 relative shadow-2xl ${isDarkMode ? 'bg-white/[0.08] border-white/20' : 'bg-black/[0.03] border-black/10'}`}
              >
                <div className="relative z-10 flex flex-col gap-6">
                  <div 
                    className="flex items-center justify-between cursor-pointer active:opacity-70 transition-opacity"
                    onClick={() => setActiveNotification(null)}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-2xl overflow-hidden border ${isDarkMode ? 'bg-white/10 border-white/20' : 'bg-black/5 border-black/10'}`}>
                        {isAnonymousMode ? (
                          <div className="w-full h-full flex items-center justify-center">
                            <div className={`w-6 h-6 rounded-full ${isDarkMode ? 'bg-white/40' : 'bg-black/10'}`} />
                          </div>
                        ) : (
                          <img src={activeNotification.photo} alt={activeNotification.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        )}
                      </div>
                      <div>
                        <h3 className={`font-bold text-xl leading-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                          {isAnonymousMode ? 'Alguém' : activeNotification.name}
                        </h3>
                        
                        {!isAnonymousMode && (
                          <p className={`text-[10px] ${isDarkMode ? 'text-white/40' : 'text-slate-400'}`}>
                            @{activeNotification.username}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-brand-red/10 flex items-center justify-center border border-brand-red/20">
                      <ShieldCheck className="w-6 h-6 text-brand-red" />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className={`rounded-2xl p-4 flex items-center justify-between border ${isDarkMode ? 'bg-black/40 border-white/10' : 'bg-white/60 border-black/5'}`}>
                      <div className="flex items-center gap-3">
                        <Calendar className="w-5 h-5 text-brand-red" />
                        <span className={`text-sm font-medium ${isDarkMode ? 'text-white/80' : 'text-slate-600'}`}>Contribuição</span>
                      </div>
                      <span className="font-bold text-brand-red text-sm uppercase tracking-widest">{activeNotification.months} {activeNotification.months === 1 ? 'MÊS' : 'MESES'}</span>
                    </div>

                    <div className={`rounded-2xl p-4 flex items-center justify-between border ${isDarkMode ? 'bg-black/40 border-white/10' : 'bg-white/60 border-black/5'}`}>
                      <div className="flex items-center gap-3">
                        <Wallet className="w-5 h-5 text-brand-red" />
                        <span className={`text-sm font-medium ${isDarkMode ? 'text-white/80' : 'text-slate-600'}`}>Recompensa</span>
                      </div>
                      <span className="text-2xl font-bold text-brand-red tracking-tighter">
                        {activeNotification.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </span>
                    </div>

                    {activeNotification.alerta && (
                      <div className={`rounded-2xl p-4 flex items-center justify-between border border-yellow-500/30 ${isDarkMode ? 'bg-yellow-500/10' : 'bg-yellow-50'}`}>
                        <div className="flex items-center gap-3">
                          <TriangleAlert className="w-5 h-5 text-yellow-500" />
                          <span className={`text-sm font-medium ${isDarkMode ? 'text-yellow-300' : 'text-yellow-700'}`}>Alerta</span>
                        </div>
                        <span className={`text-xs font-bold text-right ${isDarkMode ? 'text-yellow-300' : 'text-yellow-700'} max-w-[160px]`}>Não permitido: Segunda vez participando</span>
                      </div>
                    )}

                    {activeNotification.alerta ? (
                      <button
                        onClick={handleRessarcir}
                        disabled={ressarcindo}
                        className={`w-full py-5 mt-4 rounded-2xl bg-yellow-500 text-white font-black uppercase tracking-[0.2em] text-lg transition-all active:scale-95 shadow-lg shadow-yellow-500/20 flex items-center justify-center gap-2 ${ressarcindo ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        {ressarcindo ? (
                          <><Loader2 className="w-5 h-5 animate-spin" /> PROCESSANDO...</>
                        ) : (
                          'RESSARCIR CONTRIBUIÇÃO'
                        )}
                      </button>
                    ) : (
                      <button 
                        onClick={handleLiberar}
                        disabled={libertando}
                        className="w-full py-5 mt-4 rounded-2xl bg-brand-red text-white font-black uppercase tracking-[0.2em] text-lg transition-all active:scale-95 shadow-lg shadow-brand-red/20 flex items-center justify-center gap-2"
                      >
                        {libertando ? (
                          <><Loader2 className="w-5 h-5 animate-spin" /> LIBERANDO...</>
                        ) : (
                          'LIBERAR RECOMPENSA'
                        )}
                      </button>
                    )}
                  </div>
                </div>

                {recompensaEnviada && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="absolute inset-0 z-20 flex items-center justify-center rounded-[32px]"
                  >
                    <motion.div
                      initial={{ scale: 0.6, y: 30 }}
                      animate={{ scale: 1, y: 0 }}
                      transition={{ type: 'spring', stiffness: 200, damping: 15, mass: 0.8 }}
                      className={`relative flex flex-col items-center gap-4 px-10 py-10 rounded-3xl border shadow-2xl ${isDarkMode ? 'bg-white/10 border-white/20' : 'bg-white/90 border-black/10'}`}
                    >
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 250, damping: 12, delay: 0.15 }}
                        className="w-16 h-16 rounded-2xl bg-brand-red flex items-center justify-center shadow-lg shadow-brand-red/30"
                      >
                        <CheckCircle2 className="w-9 h-9 text-white" />
                      </motion.div>
                      <motion.span
                        initial={{ y: 15, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.3, duration: 0.4 }}
                        className={`text-2xl font-black uppercase tracking-[0.12em] text-center leading-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}
                      >
                        RECOMPENSA<br />ENVIADA
                      </motion.span>
                    </motion.div>
                  </motion.div>
                )}

                {ressarcido && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="absolute inset-0 z-20 flex items-center justify-center rounded-[32px]"
                  >
                    <motion.div
                      initial={{ scale: 0.6, y: 30 }}
                      animate={{ scale: 1, y: 0 }}
                      transition={{ type: 'spring', stiffness: 200, damping: 15, mass: 0.8 }}
                      className={`relative flex flex-col items-center gap-4 px-10 py-10 rounded-3xl border shadow-2xl ${isDarkMode ? 'bg-white/10 border-white/20' : 'bg-white/90 border-black/10'}`}
                    >
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 250, damping: 12, delay: 0.15 }}
                        className="w-16 h-16 rounded-2xl bg-yellow-500 flex items-center justify-center shadow-lg shadow-yellow-500/30"
                      >
                        <Ban className="w-9 h-9 text-white" />
                      </motion.div>
                      <motion.span
                        initial={{ y: 15, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.3, duration: 0.4 }}
                        className={`text-2xl font-black uppercase tracking-[0.12em] text-center leading-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}
                      >
                        CONTRIBUIÇÃO<br />RESSARCIDA
                      </motion.span>
                    </motion.div>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-2">
            <div className="flex items-center justify-between mb-4 px-2">
              <h4 className={`text-xs font-bold uppercase tracking-widest ${isDarkMode ? 'text-white/70' : 'text-slate-400'}`}>Novas Contribuições</h4>
            </div>
            <div className="space-y-3">
              <AnimatePresence initial={false}>
                {notifications.map((notif) => (
                  <motion.div
                    key={notif.id}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: 20, opacity: 0 }}
                    className={`glass rounded-2xl p-4 flex items-center justify-between group cursor-pointer transition-all ${
                      activeNotification?.id === notif.id 
                        ? (isDarkMode ? 'border-brand-red/50 bg-white/15' : 'border-brand-red/50 bg-black/5') 
                        : (isDarkMode ? 'bg-white/[0.04] border-white/5 hover:bg-white/[0.08]' : 'hover:bg-black/5')
                    }`}
                    onClick={() => setActiveNotification(activeNotification?.id === notif.id ? null : notif)}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl overflow-hidden border ${isDarkMode ? 'bg-white/5 border-white/20' : 'bg-black/5 border-black/10'}`}>
                        {isAnonymousMode ? (
                          <div className="w-full h-full flex items-center justify-center">
                            <div className={`w-4 h-4 rounded-full ${isDarkMode ? 'bg-white/40' : 'bg-black/10'}`} />
                          </div>
                        ) : (
                          <img src={notif.photo} alt={notif.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-[13px] font-medium leading-tight ${isDarkMode ? 'text-white' : 'text-slate-700'}`}>
                          <span className="font-bold">{isAnonymousMode ? 'Alguém' : notif.name}</span> acaba de fazer uma contribuição
                        </p>
                        {!isAnonymousMode && (
                          <p className={`text-[10px] ${isDarkMode ? 'text-white/40' : 'text-slate-400'}`}>
                            @{notif.username}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="text-right flex flex-col items-center justify-center min-w-[60px]">
                      <span className="text-xl font-black text-brand-red leading-none">
                        {notif.months}
                      </span>
                      <span className="text-[9px] font-black text-brand-red uppercase leading-none mt-1">
                        {notif.months === 1 ? 'MÊS' : 'MESES'}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
    </>    
  );
};
