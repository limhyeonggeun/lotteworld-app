import { useUser } from '@/context/UserContext';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { getFCMToken } from '../utils/fcm';

const NotificationTokenContext = createContext<{ token: string | null }>({ token: null });

export const NotificationTokenProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useUser(); 
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const register = async () => {
      if (!user?.id) {
        console.log('로그인 정보 없음, FCM 등록 보류');
        return;
      }

      const fcmToken = await getFCMToken();
      if (!fcmToken) {
        console.warn('FCM 토큰 없음');
        return;
      }

      setToken(fcmToken); 
    };

    register();
  }, [user?.id]);

  return (
    <NotificationTokenContext.Provider value={{ token }}>
      {children}
    </NotificationTokenContext.Provider>
  );
};

export const useNotificationToken = () => useContext(NotificationTokenContext);