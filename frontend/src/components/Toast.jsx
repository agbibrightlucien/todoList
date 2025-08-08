import React, { useEffect } from 'react';
import { TOAST_TYPES } from '../utils/toastTypes';

/**
 * Individual Toast component
 */
const Toast = ({ id, type, message, duration, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(id);
    }, duration);

    return () => clearTimeout(timer);
  }, [id, duration, onClose]);

  const getToastStyles = () => {
    const baseStyles = "fixed top-4 right-4 z-50 max-w-sm bg-white border-l-4 rounded-lg shadow-lg p-4 mb-2 animate-slide-in";
    
    switch (type) {
      case TOAST_TYPES.SUCCESS:
        return `${baseStyles} border-green-500 bg-green-50`;
      case TOAST_TYPES.ERROR:
        return `${baseStyles} border-red-500 bg-red-50`;
      case TOAST_TYPES.WARNING:
        return `${baseStyles} border-yellow-500 bg-yellow-50`;
      case TOAST_TYPES.INFO:
      default:
        return `${baseStyles} border-blue-500 bg-blue-50`;
    }
  };

  const getIconStyles = () => {
    switch (type) {
      case TOAST_TYPES.SUCCESS:
        return "text-green-500";
      case TOAST_TYPES.ERROR:
        return "text-red-500";
      case TOAST_TYPES.WARNING:
        return "text-yellow-500";
      case TOAST_TYPES.INFO:
      default:
        return "text-blue-500";
    }
  };

  const getIcon = () => {
    switch (type) {
      case TOAST_TYPES.SUCCESS:
        return "✓";
      case TOAST_TYPES.ERROR:
        return "✕";
      case TOAST_TYPES.WARNING:
        return "⚠";
      case TOAST_TYPES.INFO:
      default:
        return "ℹ";
    }
  };

  const getTextStyles = () => {
    switch (type) {
      case TOAST_TYPES.SUCCESS:
        return "text-green-800";
      case TOAST_TYPES.ERROR:
        return "text-red-800";
      case TOAST_TYPES.WARNING:
        return "text-yellow-800";
      case TOAST_TYPES.INFO:
      default:
        return "text-blue-800";
    }
  };

  return (
    <div className={getToastStyles()} style={{ top: `${16 + (id * 80)}px` }}>
      <div className="flex items-start">
        <div className={`flex-shrink-0 mr-3 text-lg ${getIconStyles()}`}>
          {getIcon()}
        </div>
        <div className="flex-1">
          <p className={`text-sm font-medium ${getTextStyles()}`}>
            {message}
          </p>
        </div>
        <button
          onClick={() => onClose(id)}
          className={`ml-3 flex-shrink-0 text-lg hover:opacity-70 ${getTextStyles()}`}
        >
          ×
        </button>
      </div>
    </div>
  );
};

/**
 * Toast Container component
 */
const ToastContainer = ({ toasts, removeToast }) => {
  return (
    <div className="toast-container">
      {toasts.map((toast, index) => (
        <Toast
          key={toast.id}
          id={index}
          type={toast.type}
          message={toast.message}
          duration={toast.duration}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  );
};

export default ToastContainer;
