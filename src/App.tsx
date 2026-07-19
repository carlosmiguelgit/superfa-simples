import { useState, useEffect } from 'react';
import { StatusBar } from './components/StatusBar';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { Extrato } from './components/Extrato';
import { Ranking } from './components/Ranking';
import { BottomNav } from './components/BottomNav';
import { PasswordLock } from './components/PasswordLock';
import PrivateChat from './components/PrivateChat';
import { Notification } from './types';
import { useNotificationSystem } from './hooks/useNotificationSystem';

const MONTHS_TO_DECREASE_RANK = 10;

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState<'dash' | 'depoimentos' | 'ranking'>('dash');
  const [confirmedNotifications, setConfirmedNotifications] = useState<Notification[]>([]);
  const [isAnonymousMode, setIsAnonymousMode] = useState(false);
  const [chatNotification, setChatNotification] = useState<Notification | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [batteryClickCount, setBatteryClickCount] = useState(0);
  const [totalMonthsConfirmed, setTotalMonthsConfirmed] = useState(0);
  const [isViewingChat, setIsViewingChat] = useState(false);
  const {
    notifications,
    setNotifications,
    dynamicTestimonials,
    setPendingTestimonials,
    addToBlacklist
  } = useNotificationSystem();

  const popularRank = Math.max(1, 99 - Math.floor(totalMonthsConfirmed / MONTHS_TO_DECREASE_RANK));

  useEffect(() => {
    const root = window.document.documentElement;
    if (isDarkMode) {
      root.classList.add('theme-dark');
      root.classList.remove('theme-light');
      root.style.backgroundColor = '#0a0a0a';
    } else {
      root.classList.add('theme-light');
      root.classList.remove('theme-dark');
      root.style.backgroundColor = '#FDFCF7';
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
  };

  const handleBatteryClick = () => {
    setBatteryClickCount(prev => {
      const next = prev + 1;
      if (next === 3) {
        setIsAnonymousMode(!isAnonymousMode);
        return 0;
      }
      return next;
    });
    setTimeout(() => setBatteryClickCount(0), 3000);
  };

  const handleStartChat = (notif: Notification) => {
    setChatNotification(notif);
    setIsViewingChat(false);
  };

  const handleExtratoPersonClick = (notif: Notification) => {
    setChatNotification(notif);
    setIsViewingChat(true);
  };

  const handleRessarcir = (notif: Notification) => {
    setNotifications(prev => prev.filter(n => n.id !== notif.id));
  };

  const handleLiberarRecompensa = (notif: Notification) => {
    setConfirmedNotifications(prev => [notif, ...prev]);
    setNotifications(prev => prev.filter(n => n.id !== notif.id));
    setTotalMonthsConfirmed(prev => prev + notif.months);
    addToBlacklist(notif.name);
    if (Math.random() < 0.85) {
      const delaySeconds = Math.floor(Math.random() * 180) + 300;
      const visibleAt = Date.now() + (delaySeconds * 1000);
      setPendingTestimonials(prev => [...prev, {
        id: `dyn-${notif.id}`,
        name: notif.name,
        username: notif.username,
        value: notif.value,
        gender: notif.gender,
        photo: notif.photo,
        months: notif.months,
        timestamp: new Date(Date.now() - 3600000),
        visibleAt
      }]);
    }
  };

  const handleChatComplete = (name: string, pixKey: string) => {
    if (!chatNotification) return;

    if (isViewingChat) {
      setChatNotification(null);
      setIsViewingChat(false);
      return;
    }

    const notif = { ...chatNotification, name, pixKey };
    setConfirmedNotifications(prev => [notif, ...prev]);
    setNotifications(prev => prev.filter(n => n.id !== chatNotification.id));
    setTotalMonthsConfirmed(prev => prev + chatNotification.months);
    addToBlacklist(chatNotification.name);
    if (Math.random() < 0.85) {
      const delaySeconds = Math.floor(Math.random() * 180) + 300;
      const visibleAt = Date.now() + (delaySeconds * 1000);
      setPendingTestimonials(prev => [...prev, {
        id: `dyn-${chatNotification.id}`,
        name: chatNotification.name,
        username: chatNotification.username,
        value: chatNotification.value,
        gender: chatNotification.gender,
        photo: chatNotification.photo,
        months: chatNotification.months,
        timestamp: new Date(Date.now() - 3600000),
        visibleAt
      }]);
    }
    setChatNotification(null);
  };

  const handleChatBack = () => {
    setChatNotification(null);
    setIsViewingChat(false);
  };

  if (!isAuthenticated) {
    return <PasswordLock onSuccess={() => setIsAuthenticated(true)} isDarkMode={isDarkMode} />;
  }

  return (
    <div className={`flex justify-center items-center h-screen overflow-hidden transition-colors duration-500 ${isDarkMode ? 'bg-black' : 'bg-[#e5e7eb]'}`}>
      <div className={`relative w-full max-w-3xl h-full overflow-hidden shadow-2xl border-x transition-colors duration-500 flex flex-col ${isDarkMode ? 'bg-brand-dark border-white/5 text-white' : 'bg-[#FDFCF7] border-black/5 text-slate-900'}`}>
        <StatusBar 
          onBatteryClick={handleBatteryClick} 
          isDarkMode={isDarkMode}
          onThemeToggle={toggleTheme}
          popularRank={popularRank}
        />
        
        <div className={`absolute top-[-10%] left-[-10%] w-[60%] h-[40%] blur-[120px] rounded-full transition-opacity duration-700 ${isDarkMode ? 'bg-brand-red/10 opacity-100' : 'bg-brand-red/5 opacity-50'}`} />
        <div className={`absolute bottom-[-10%] right-[-10%] w-[60%] h-[40%] blur-[120px] rounded-full transition-opacity duration-700 ${isDarkMode ? 'bg-blue-500/10 opacity-100' : 'bg-blue-500/5 opacity-30'}`} />
        
        <Header 
          isDarkMode={isDarkMode} 
        />
        
        <main className="relative z-10 flex-1 px-4 flex flex-col gap-4 overflow-y-auto pb-4 pt-2">
          {activeTab === 'dash' && (
            <Dashboard
              notifications={notifications}
              isAnonymousMode={isAnonymousMode}
              isDarkMode={isDarkMode}
              onStartChat={handleStartChat}
              onRessarcir={handleRessarcir}
              onLiberarRecompensa={handleLiberarRecompensa}
            />
          )}
          {activeTab === 'depoimentos' && (
            <Extrato 
              confirmedNotifications={confirmedNotifications} 
              dynamicTestimonials={dynamicTestimonials}
              isAnonymousMode={isAnonymousMode} 
              isDarkMode={isDarkMode}
              onPersonClick={handleExtratoPersonClick}
            />
          )}
          {activeTab === 'ranking' && (
            <Ranking 
              confirmedNotifications={confirmedNotifications}
              isAnonymousMode={isAnonymousMode}
              isDarkMode={isDarkMode}
            />
          )}
        </main>
        
        <div className="shrink-0">
          <BottomNav 
            activeTab={activeTab} 
            setActiveTab={setActiveTab} 
            isDarkMode={isDarkMode} 
          />
        </div>
        
        <div className={`absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1.5 rounded-full z-20 transition-colors duration-500 ${isDarkMode ? 'bg-white/10' : 'bg-black/10'}`} />

        {chatNotification && (
          <PrivateChat
            username={chatNotification.username}
            nickname={chatNotification.name}
            fullName={chatNotification.fullName}
            avatar={chatNotification.photo}
            followingCount={chatNotification.followingCount}
            followerCount={chatNotification.followerCount}
            onComplete={handleChatComplete}
            onBack={handleChatBack}
            isViewing={isViewingChat}
          />
        )}
      </div>
    </div>
  );
}