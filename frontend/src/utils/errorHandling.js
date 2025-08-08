/**
 * Error handling utilities for TodoFlow application
 * Provides user-friendly error messages and success notifications
 */

import { logger } from '../config/environment';

/**
 * Extract user-friendly error message from API response
 */
export const getErrorMessage = (error) => {
  // If it's a string, return as-is
  if (typeof error === 'string') {
    return error;
  }

  // Handle network errors
  if (!error.response) {
    if (error.code === 'ECONNABORTED') {
      return 'Request timed out. Please check your connection and try again.';
    }
    if (error.code === 'ERR_NETWORK') {
      return 'Network error. Please check your internet connection.';
    }
    return 'Unable to connect to the server. Please try again later.';
  }

  const { status, data } = error.response;

  // Handle specific HTTP status codes
  switch (status) {
    case 400:
      if (data?.message) {
        return data.message;
      }
      if (data?.error) {
        return data.error;
      }
      if (data?.errors && Array.isArray(data.errors)) {
        return data.errors.join(', ');
      }
      return 'Invalid request. Please check your input and try again.';

    case 401:
      return 'Invalid email or password. Please try again.';

    case 403:
      return 'Access denied. You do not have permission to perform this action.';

    case 404:
      return 'The requested resource was not found.';

    case 409:
      if (data?.message?.includes('email') || data?.message?.includes('Email')) {
        return 'An account with this email already exists. Please use a different email or try logging in.';
      }
      return data?.message || 'A conflict occurred. The resource may already exist.';

    case 422:
      if (data?.message) {
        return data.message;
      }
      if (data?.errors) {
        if (Array.isArray(data.errors)) {
          return data.errors.join(', ');
        }
        if (typeof data.errors === 'object') {
          return Object.values(data.errors).flat().join(', ');
        }
      }
      return 'Validation failed. Please check your input.';

    case 429:
      return 'Too many requests. Please wait a moment and try again.';

    case 500:
      return 'Server error. Please try again later.';

    case 503:
      return 'Service temporarily unavailable. Please try again in a few minutes.';

    default:
      return data?.message || data?.error || 'An unexpected error occurred. Please try again.';
  }
};

/**
 * Success message templates
 */
export const getSuccessMessage = (action, resource = '') => {
  const messages = {
    // Authentication
    login: 'Welcome back! You have been successfully logged in.',
    register: 'Account created successfully! Welcome to TodoFlow.',
    logout: 'You have been successfully logged out.',
    passwordReset: 'Password reset email sent! Please check your inbox.',
    passwordResetConfirm: 'Your password has been successfully reset.',

    // Todo operations
    todoCreate: `Todo "${resource}" created successfully!`,
    todoUpdate: `Todo "${resource}" updated successfully!`,
    todoDelete: `Todo "${resource}" deleted successfully!`,
    todoComplete: `Todo "${resource}" marked as complete!`,
    todoUncomplete: `Todo "${resource}" marked as incomplete.`,

    // Subtask operations
    subtaskCreate: 'Subtask added successfully!',
    subtaskUpdate: 'Subtask updated successfully!',
    subtaskDelete: 'Subtask deleted successfully!',

    // Theme operations
    themeChange: `Theme changed to ${resource} successfully!`,
    
    // General
    save: 'Changes saved successfully!',
    update: 'Updated successfully!',
    delete: 'Deleted successfully!',
    create: 'Created successfully!',
  };

  return messages[action] || 'Operation completed successfully!';
};

/**
 * Log errors appropriately
 */
export const logError = (context, error, additionalData = {}) => {
  logger.error(`[${context}] Error:`, {
    message: error.message,
    status: error.response?.status,
    data: error.response?.data,
    ...additionalData
  });
};

/**
 * Show user-friendly error in console for development
 */
export const showDevError = (context, error) => {
  if (import.meta.env.DEV) {
    console.group(`🚨 ${context} Error`);
    console.error('User message:', getErrorMessage(error));
    console.error('Technical details:', error);
    console.groupEnd();
  }
};

export default {
  getErrorMessage,
  getSuccessMessage,
  logError,
  showDevError
};
