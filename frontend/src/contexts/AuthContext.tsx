import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { isAuthenticated, getCurrentUser, logout as logoutApi } from '../api/authApi';
import { useNavigate } from 'react-router-dom';

interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  login: (userData: User, _token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  // 初始化时检查用户认证状态
  useEffect(() => {
    const checkAuth = () => {
      const isAuthenticatedUser = isAuthenticated();
      if (isAuthenticatedUser) {
        const currentUser = getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
          setIsLoggedIn(true);
        }
      }
    };

    checkAuth();
  }, []);

  const login = (userData: User, _token: string) => {
    setUser(userData);
    setIsLoggedIn(true);
    // 用户信息和token已经由authApi保存到localStorage
    // _token参数未使用但保留用于接口兼容性
  };

  const logout = () => {
    logoutApi();
    setUser(null);
    setIsLoggedIn(false);
    navigate('/login');
  };

  const value = {
    user,
    isLoggedIn,
    login,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
