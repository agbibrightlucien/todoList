import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, User, Palette } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../hooks/useTheme';
import { useToast } from '../hooks/useToast';
import ToastContainer from './Toast';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const { isDarkMode, toggleDarkMode } = useTheme();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');

  const { login, register, forgotPassword } = useAuth();
  const toast = useToast();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear errors when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!isLogin && !formData.name) {
      newErrors.name = 'Name is required';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!isLogin && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    if (showForgotPassword) {
      if (!formData.email) {
        setErrors({ email: 'Email is required' });
        return;
      }

      setLoading(true);
      const result = await forgotPassword(formData.email);
      setLoading(false);

      if (result.success) {
        toast.success(result.message || 'Password reset email sent! Check your inbox.');
        setShowForgotPassword(false);
        setMessage('');
      } else {
        toast.error(result.error);
        setMessage('');
      }
      return;
    }

    if (!validateForm()) return;

    setLoading(true);
    setMessage(''); // Clear any previous messages

    try {
      let result;
      if (isLogin) {
        result = await login(formData.email, formData.password);
      } else {
        result = await register(formData.name, formData.email, formData.password);
      }

      if (result.success) {
        toast.success(result.message);
        resetForm();
      } else {
        toast.error(result.error);
      }
    } catch (err) {
      console.error('Authentication error:', err);
      toast.error('An unexpected error occurred. Please try again.');
    }

    setLoading(false);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      password: '',
      confirmPassword: ''
    });
    setErrors({});
    setMessage('');
  };

  const switchMode = () => {
    setIsLogin(!isLogin);
    setShowForgotPassword(false);
    resetForm();
  };

  const handleForgotPassword = () => {
    setShowForgotPassword(true);
    setIsLogin(true);
    resetForm();
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
      {/* Theme Toggle Button */}
      <button
        onClick={toggleDarkMode}
        className="fixed top-4 right-4 btn btn-ghost btn-icon z-50"
        title={`Switch to ${isDarkMode ? 'Light' : 'Dark'} Mode`}
        style={{ 
          background: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
          color: isDarkMode ? '#fff' : '#000'
        }}
      >
        {isDarkMode ? '☀️' : '🌙'}
      </button>
      
      <div className="auth-form container-sm animate-fade-in"
        style={{
          background: isDarkMode ? 'rgba(30, 41, 59, 0.8)' : undefined
        }}
      >
        <div className="auth-form-header">
          <div className="mb-4">
            <div className="w-16 h-16 bg-white bg-opacity-20 rounded-xl flex items-center justify-center mx-auto mb-4">
              <User className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold mb-2">
              {showForgotPassword ? 'Reset Password' : isLogin ? 'Welcome Back' : 'Create Account'}
            </h1>
            <p className="text-primary-100 text-lg">
              {showForgotPassword 
                ? 'Enter your email to receive a password reset link'
                : isLogin 
                  ? 'Sign in to your todo account' 
                  : 'Join us to start organizing your tasks'
              }
            </p>
          </div>
        </div>

        <div className="auth-form-content">
          {message && (
            <div className={`mb-6 animate-slide-up ${
              message.includes('sent') || message.includes('successful') 
                ? 'success-message' 
                : 'error-message'
            }`}>
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && !showForgotPassword && (
              <div className="input-group animate-slide-up">
                <label className="input-label">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`input pl-12 ${
                      errors.name ? 'input-error' : ''
                    }`}
                    placeholder="Enter your full name"
                  />
                </div>
                {errors.name && <p className="text-sm text-danger-600 mt-1">{errors.name}</p>}
              </div>
            )}

            <div className="input-group animate-slide-up">
              <label className="input-label">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`input pl-12 ${
                    errors.email ? 'input-error' : ''
                  }`}
                  placeholder="Enter your email"
                />
              </div>
              {errors.email && <p className="text-sm text-danger-600 mt-1">{errors.email}</p>}
            </div>

            {!showForgotPassword && (
              <>
                <div className="input-group animate-slide-up">
                  <label className="input-label">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className={`input pl-12 pr-12 ${
                        errors.password ? 'input-error' : ''
                      }`}
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-all"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {errors.password && <p className="text-sm text-danger-600 mt-1">{errors.password}</p>}
                </div>

                {!isLogin && (
                  <div className="input-group animate-slide-up">
                    <label className="input-label">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        className={`input pl-12 ${
                          errors.confirmPassword ? 'input-error' : ''
                        }`}
                        placeholder="Confirm your password"
                      />
                    </div>
                    {errors.confirmPassword && <p className="text-sm text-danger-600 mt-1">{errors.confirmPassword}</p>}
                  </div>
                )}
              </>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary btn-lg w-full animate-bounce-in"
            >
              {loading && <div className="loading-spinner spinner-sm mr-2" />}
              {loading ? 'Processing...' : showForgotPassword ? 'Send Reset Email' : isLogin ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          <div className="form-divider">
            <span>or</span>
          </div>

          <div className="text-center">
            {showForgotPassword ? (
              <button
                onClick={() => {
                  setShowForgotPassword(false);
                  resetForm();
                }}
                className="btn btn-ghost"
              >
                ← Back to Sign In
              </button>
            ) : (
              <>
                {isLogin && (
                  <button
                    onClick={handleForgotPassword}
                    className="btn btn-ghost mb-4 w-full"
                  >
                    Forgot your password?
                  </button>
                )}
                <p className="text-gray-600 text-sm">
                  {isLogin ? "Don't have an account? " : 'Already have an account? '}
                  <button
                    onClick={switchMode}
                    className="text-primary-600 hover:text-primary-700 font-semibold transition-all"
                  >
                    {isLogin ? 'Sign up' : 'Sign in'}
                  </button>
                </p>
              </>
            )}
          </div>
        </div>
      </div>
      
      {/* Toast Container */}
      <ToastContainer toasts={toast.toasts} removeToast={toast.removeToast} />
    </div>
  );
};

export default Auth;
