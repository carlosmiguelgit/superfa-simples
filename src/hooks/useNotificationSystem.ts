import { useState, useEffect, useCallback, useRef } from 'react';
import { Notification, Testimonial } from '../types';
import { NOTIF_SOUND } from '../constants';
import tiktokUsers from '../tiktok-users.json';

interface TikTokUser {
  username: string;
  nickname: string;
  fullName?: string;
  avatar: string;
  followingCount?: number;
  followerCount?: number;
}

interface PendingTestimonial extends Testimonial {
  visibleAt: number;
}

const userPool = tiktokUsers as TikTokUser[];

export const useNotificationSystem = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [dynamicTestimonials, setDynamicTestimonials] = useState<Testimonial[]>([]);
  const [pendingTestimonials, setPendingTestimonials] = useState<PendingTestimonial[]>([]);
  const [unreadDepoimentos, setUnreadDepoimentos] = useState(0);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const poolIndexRef = useRef(0);
  const confirmedBlacklistRef = useRef<string[]>([]);
  const monthsCycleRef = useRef<{ months: number; alerta: boolean }[]>([]);
  const monthsIndexRef = useRef(0);

  const getNextEntry = useCallback((): { months: number; alerta: boolean } => {
    if (monthsIndexRef.current >= monthsCycleRef.current.length) {
      const pool = [
        { months: 1, alerta: false }, { months: 1, alerta: false },
        { months: 3, alerta: false }, { months: 3, alerta: false },
        { months: 6, alerta: false }, { months: 6, alerta: false },
        { months: 12, alerta: true }, { months: 12, alerta: true },
        { months: 12, alerta: false }, { months: 12, alerta: false },
      ];
      for (let i = pool.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [pool[i], pool[j]] = [pool[j], pool[i]];
      }
      monthsCycleRef.current = pool;
      monthsIndexRef.current = 0;
    }
    return monthsCycleRef.current[monthsIndexRef.current++];
  }, []);

  const getNextUser = useCallback((): TikTokUser | null => {
    if (userPool.length === 0) return null;

    const user = userPool[poolIndexRef.current % userPool.length];
    poolIndexRef.current++;
    return user;
  }, []);

  const playSound = useCallback(() => {
    if (!audioRef.current) audioRef.current = new Audio(NOTIF_SOUND);
    audioRef.current.currentTime = 0;
    audioRef.current.play().catch(() => {});
  }, []);

  const generateNotification = useCallback(() => {
    const user = getNextUser();
    if (!user) return;

    const { months, alerta } = getNextEntry();
    const value = ({1:500, 3:1000, 6:2000, 12:5000} as Record<number, number>)[months];

    const newNotif: Notification = {
      id: `notif-${Math.random().toString(36).substr(2, 9)}`,
      name: user.nickname,
      username: user.username,
      fullName: user.fullName,
      photo: user.avatar,
      followingCount: user.followingCount,
      followerCount: user.followerCount,
      pixKey: `${Math.floor(Math.random() * 899) + 100}.***.***-${Math.floor(Math.random() * 89) + 10}`,
      months,
      participationCount: months,
      value: alerta ? 0 : value,
      timestamp: new Date(),
      gender: 'male',
      alerta
    };

    setNotifications(prev => [newNotif, ...prev.slice(0, 11)]);
    playSound();
  }, [getNextUser, getNextEntry, playSound]);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    const loop = () => {
      const delay = Math.floor(Math.random() * 60000) + 30000;
      timeoutId = setTimeout(() => {
        generateNotification();
        loop();
      }, delay);
    };
    timeoutId = setTimeout(() => {
      generateNotification();
      loop();
    }, 2000);
    return () => clearInterval(timeoutId);
  }, [generateNotification]);

  const addToBlacklist = useCallback((name: string) => {
    confirmedBlacklistRef.current = [name, ...confirmedBlacklistRef.current].slice(0, 30);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      setPendingTestimonials(prev => {
        const ready = prev.filter(t => t.visibleAt <= now);
        if (ready.length > 0) {
          setDynamicTestimonials(current => {
            const newItems = ready.filter(r => !current.some(c => c.id === r.id));
            if (newItems.length > 0) {
              setUnreadDepoimentos(u => u + newItems.length);
              return [...newItems, ...current];
            }
            return current;
          });
          return prev.filter(t => t.visibleAt > now);
        }
        return prev;
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return {
    notifications,
    setNotifications,
    dynamicTestimonials,
    unreadDepoimentos,
    setUnreadDepoimentos,
    setPendingTestimonials,
    addToBlacklist,
    generateNotification
  };
};
