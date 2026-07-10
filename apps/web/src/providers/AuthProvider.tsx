'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api from '@/lib/axiosClient';

export type User = {
  id: number;
  name: string;
  email: string;
  avatar: string;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;

  login: (user: User) => void;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const login = (user: User) => {
    setUser(user);
  };

  const logout = async () => {
    try {
      await api.post('/users/logout');
    } catch (err) {
      console.log(err);
    }
  };

  const refreshUser = async () => {
    try {
      const res = await api.get('/users/me');
      setUser(res.data.data);
    } catch {
      setUser(null);
    }
  };

  useEffect(() => {
    async function initialize() {
      try {
        const res = await api.get('/users/me');

        setUser(res.data.data);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    initialize();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }

  return context;
}
