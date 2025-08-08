import React, { useState, useEffect } from 'react';
import { AuthContext } from './AuthContext';
import { authAPI } from '../services/api';
import { config, logger, storage } from '../config/environment';
import { getSuccessMessage } from '../utils/errorHandling';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(storage.getItem('token') || localStorage.getItem(config.TOKEN_STORAGE_KEY));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = storage.getItem('token') || localStorage.getItem(config.TOKEN_STORAGE_KEY);
      if (storedToken) {
        try {
          logger.debug('Initializing authentication with stored token');
          // Verify token by getting user info
          const data = await authAPI.getMe();
          setUser(data.user);
          setToken(storedToken);
          
          // Store user data with environment config
          storage.setItem('user', data.user);
          
          logger.log('Authentication initialized successfully');
        } catch (error) {
          logger.error('Auth initialization error:', error);
          
          // Clear all authentication data
          storage.removeItem('token');
          storage.removeItem('user');
          localStorage.removeItem(config.TOKEN_STORAGE_KEY);
          localStorage.removeItem(config.USER_STORAGE_KEY);
          
          setToken(null);
          setUser(null);
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (email, password) => {
    try {
      logger.debug('Attempting login for:', email);
      const data = await authAPI.login({ email, password });
      
      setUser(data.user);
      setToken(data.token);
      
      // Store with both new storage utility and legacy localStorage for compatibility
      storage.setItem('token', data.token);
      storage.setItem('user', data.user);
      localStorage.setItem(config.TOKEN_STORAGE_KEY, data.token);
      localStorage.setItem(config.USER_STORAGE_KEY, JSON.stringify(data.user));

      logger.log('Login successful for user:', data.user.email);
      return { 
        success: true, 
        user: data.user,
        message: getSuccessMessage('login')
      };
    } catch (error) {
      logger.error('Login error:', error.message);
      return { 
        success: false, 
        error: error.message 
      };
    }
  };

  const register = async (name, email, password) => {
    try {
      logger.debug('Attempting registration for:', email);
      const data = await authAPI.register({ name, email, password });

      setUser(data.user);
      setToken(data.token);
      
      // Store with both new storage utility and legacy localStorage for compatibility
      storage.setItem('token', data.token);
      storage.setItem('user', data.user);
      localStorage.setItem(config.TOKEN_STORAGE_KEY, data.token);
      localStorage.setItem(config.USER_STORAGE_KEY, JSON.stringify(data.user));

      logger.log('Registration successful for user:', data.user.email);
      return { 
        success: true, 
        user: data.user,
        message: getSuccessMessage('register')
      };
    } catch (error) {
      logger.error('Registration error:', error.message);
      return { 
        success: false, 
        error: error.message 
      };
    }
  };

  const logout = () => {
    logger.log('User logging out');
    
    setUser(null);
    setToken(null);
    
    // Clear all authentication data from both storage systems
    storage.removeItem('token');
    storage.removeItem('user');
    localStorage.removeItem(config.TOKEN_STORAGE_KEY);
    localStorage.removeItem(config.USER_STORAGE_KEY);
    localStorage.removeItem('token'); // Legacy support
  };

  const forgotPassword = async (email) => {
    try {
      logger.debug('Requesting password reset for:', email);
      const data = await authAPI.forgotPassword(email);
      logger.log('Password reset email sent successfully');
      return { 
        success: true, 
        message: data.message || getSuccessMessage('passwordReset')
      };
    } catch (error) {
      logger.error('Forgot password error:', error.message);
      return { 
        success: false, 
        error: error.message 
      };
    }
  };

  const resetPassword = async (token, password) => {
    try {
      logger.debug('Attempting password reset');
      const data = await authAPI.resetPassword(token, password);

      setUser(data.user);
      setToken(data.token);
      
      // Store with both new storage utility and legacy localStorage for compatibility
      storage.setItem('token', data.token);
      storage.setItem('user', data.user);
      localStorage.setItem(config.TOKEN_STORAGE_KEY, data.token);
      localStorage.setItem(config.USER_STORAGE_KEY, JSON.stringify(data.user));

      logger.log('Password reset successful');
      return { success: true, user: data.user };
    } catch (error) {
      logger.error('Reset password error:', error);
      return { success: false, error: error.message };
    }
  };

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    forgotPassword,
    resetPassword,
    isAuthenticated: !!token && !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
