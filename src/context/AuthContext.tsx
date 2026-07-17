import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { mockApi } from '../services/mockApi';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  theme: 'light' | 'dark';
  login: (phone: string, password?: string) => Promise<User>;
  register: (name: string, phone: string, district: string, crops: string[], password?: string) => Promise<User>;
  logout: () => void;
  updateUser: (updatedUser: User) => Promise<User>;
  toggleTheme: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  useEffect(() => {
    // Check local storage for current user
    const curUser = mockApi.getCurrentUser();
    if (curUser) {
      setUser(curUser);
    }
    
    // Check saved theme
    const savedTheme = localStorage.getItem('km_theme') as 'light' | 'dark' | null;
    if (savedTheme) {
      setTheme(savedTheme);
      applyTheme(savedTheme);
    } else {
      applyTheme('dark');
    }
    setLoading(false);
  }, []);

  const applyTheme = (t: 'light' | 'dark') => {
    const root = document.documentElement;
    const body = document.body;
    if (t === 'dark') {
      root.classList.add('dark');
      body.classList.remove('light-mode-active');
    } else {
      root.classList.remove('dark');
      body.classList.add('light-mode-active');
    }
  };

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    localStorage.setItem('km_theme', nextTheme);
    applyTheme(nextTheme);
  };

  const login = async (phone: string, password?: string) => {
    setLoading(true);
    try {
      const loggedUser = await mockApi.login(phone, password);
      setUser(loggedUser);
      return loggedUser;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, phone: string, district: string, crops: string[], password?: string) => {
    setLoading(true);
    try {
      const registeredUser = await mockApi.register(name, phone, district, crops, password);
      setUser(registeredUser);
      return registeredUser;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    mockApi.logout();
    setUser(null);
  };

  const updateUser = async (updatedUser: User) => {
    setLoading(true);
    try {
      const savedUser = await mockApi.updateProfile(updatedUser);
      setUser(savedUser);
      return savedUser;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        theme,
        login,
        register,
        logout,
        updateUser,
        toggleTheme,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
