// authContext.tsx
'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import axiosInstance from '../utils/axiosInstance';
import { AuthContextProps } from '../types/authContextProps';
import { login as loginService, logout as logoutService, getCurrentUser, signup as signupService } from '../services/authServices';

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

  const verifyToken = async (token) => {
    try {
      await axiosInstance.post('api/auth/token/verify/', { token });
      return true;
    } catch (error) {
      return false;
    }
  };

  const refreshToken = async (refreshToken) => {
    try {
      const response = await axiosInstance.post('api/auth/token/refresh/', { refresh: refreshToken });
      const user = getCurrentUser();
      const newUser = { ...user, token: response.data.access };
      localStorage.setItem('user', JSON.stringify(newUser));
      axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${response.data.access}`;
      return true;
    } catch (error) {
      return false;
    }
  };

  const checkAuthentication = async () => {
    const user = getCurrentUser();
    if (user && user.token) {
      const isTokenValid = await verifyToken(user.token);
      if (!isTokenValid) {
        const isRefreshSuccessful = await refreshToken(user.refreshToken);
        setIsAuthenticated(isRefreshSuccessful);
      } else {
        setIsAuthenticated(true);
      }
    } else {
      setIsAuthenticated(false);
    }
    setAuthChecked(true);
  };

  useEffect(() => {
    checkAuthentication();

    const handleStorageChange = () => {
      checkAuthentication();
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const login = async (username: string, password: string) => {
    await loginService(username, password);
    checkAuthentication();
  };

  const signup = async (firstName: string, lastName: string, email: string, password: string) => {
    await signupService(firstName, lastName, email, password);
  };

  const logout = () => {
    logoutService();
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, authChecked, login, logout, signup }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
