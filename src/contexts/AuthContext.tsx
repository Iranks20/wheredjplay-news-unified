import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AuthService } from '../lib/api';

interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'editor' | 'author' | 'writer';
  status: 'active' | 'inactive';
  created_at: string;
  last_login?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing token on mount
  useEffect(() => {
    const storedToken = localStorage.getItem('auth-token');
    if (storedToken) {
      setToken(storedToken);
      refreshUser();
    } else {
      setIsLoading(false);
    }
  }, []);

  const refreshUser = async () => {
    try {
      const response = await AuthService.getCurrentUser();
      setUser(response.data);
    } catch (error) {
      // Token is invalid, clear auth state
      localStorage.removeItem('auth-token');
      setToken(null);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await AuthService.login(email, password);
      const { user: userData, token: authToken } = response.data;
      
      setUser(userData);
      setToken(authToken);
      localStorage.setItem('auth-token', authToken);
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('auth-token');
    localStorage.removeItem('admin-auth'); // Remove old admin auth
  };

  const value: AuthContextType = {
    user,
    token,
    isAuthenticated: !!user && !!token,
    isLoading,
    login,
    logout,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
