import api from '@/utils/axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {
  createContext,
  FC,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';

interface User {
  token: string;
  id: string;
  name: string;
  email: string;
  phone: string;
  isAdmin?: boolean;
}

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  setUserAndPersist: (user: User | null) => Promise<void>;
  clearUser: () => void;
  loginWithCredentials: (email: string, password: string) => Promise<boolean>;
}

interface UserProviderProps {
  children: ReactNode;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStoredUser = async () => {
      try {
        const stored = await AsyncStorage.getItem('user');
        if (stored) {
          const parsed = JSON.parse(stored);
          api.defaults.headers.common['Authorization'] = `Bearer ${parsed.token}`;
          setUser(parsed);
        }
      } finally {
        setLoading(false);
      }
    };
    loadStoredUser();
  }, []);

  const setUserAndPersist = async (newUser: User | null) => {
    if (newUser) {
      await AsyncStorage.setItem('user', JSON.stringify(newUser));
      api.defaults.headers.common['Authorization'] = `Bearer ${newUser.token}`;
      setUser(newUser);
    } else {
      setUser(null);
      await AsyncStorage.removeItem('user');
      await AsyncStorage.removeItem('token');
      delete api.defaults.headers.common['Authorization'];
    }
  };

  const clearUser = async () => {
    await setUserAndPersist(null);
  };

  const loginWithCredentials = async (
    email: string,
    password: string
  ): Promise<boolean> => {
    try {
      const res = await api.post('/api/auth/login', { email, password });
      const { user, token } = res.data;
      if (!user || !token) return false;
      const fullUser: User = { ...user, token };
      await setUserAndPersist(fullUser);
      return true;
    } catch {
      return false;
    }
  };

  if (loading) return null;

  return (
    <UserContext.Provider
      value={{ user, setUser, setUserAndPersist, clearUser, loginWithCredentials }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) throw new Error('useUser must be used within a UserProvider');
  return context;
};