/**
 * Environment Configuration Module for TodoFlow Frontend
 * Centralizes all environment variable handling and validation
 */

// Environment configuration object
const config = {
  // Backend API Configuration
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  API_TIMEOUT: parseInt(import.meta.env.VITE_API_TIMEOUT) || 30000,
  
  // Application Configuration
  APP_NAME: import.meta.env.VITE_APP_NAME || 'TodoFlow',
  APP_VERSION: import.meta.env.VITE_APP_VERSION || '1.0.0',
  APP_ENVIRONMENT: import.meta.env.VITE_APP_ENVIRONMENT || 'development',
  
  // Authentication Configuration
  TOKEN_STORAGE_KEY: import.meta.env.VITE_TOKEN_STORAGE_KEY || 'todoflow_token',
  USER_STORAGE_KEY: import.meta.env.VITE_USER_STORAGE_KEY || 'todoflow_user',
  TOKEN_REFRESH_THRESHOLD: parseInt(import.meta.env.VITE_TOKEN_REFRESH_THRESHOLD) || 300000, // 5 minutes
  
  // Theme Configuration
  DEFAULT_THEME: import.meta.env.VITE_DEFAULT_THEME || 'blue',
  THEME_STORAGE_KEY: import.meta.env.VITE_THEME_STORAGE_KEY || 'todoflow_theme',
  DARK_MODE_STORAGE_KEY: import.meta.env.VITE_DARK_MODE_STORAGE_KEY || 'todoflow_dark_mode',
  
  // Local Storage Configuration
  STORAGE_PREFIX: import.meta.env.VITE_STORAGE_PREFIX || 'todoflow_',
  CACHE_EXPIRY: parseInt(import.meta.env.VITE_CACHE_EXPIRY) || 86400000, // 24 hours
  
  // Development Configuration
  DEBUG_MODE: import.meta.env.VITE_DEBUG_MODE === 'true',
  ENABLE_CONSOLE_LOGS: import.meta.env.VITE_ENABLE_CONSOLE_LOGS === 'true',
  
  // Feature Flags
  FEATURES: {
    EMAIL_RESET: import.meta.env.VITE_ENABLE_EMAIL_RESET === 'true',
    SUBTASKS: import.meta.env.VITE_ENABLE_SUBTASKS === 'true',
    CATEGORIES: import.meta.env.VITE_ENABLE_CATEGORIES === 'true',
    THEMES: import.meta.env.VITE_ENABLE_THEMES === 'true',
  },
  
  // Performance Configuration
  DEBOUNCE_DELAY: parseInt(import.meta.env.VITE_DEBOUNCE_DELAY) || 300,
  SEARCH_MIN_LENGTH: parseInt(import.meta.env.VITE_SEARCH_MIN_LENGTH) || 2,
  AUTO_SAVE_DELAY: parseInt(import.meta.env.VITE_AUTO_SAVE_DELAY) || 1000,
  
  // Environment helpers
  isDevelopment: () => config.APP_ENVIRONMENT === 'development',
  isProduction: () => config.APP_ENVIRONMENT === 'production',
  isTesting: () => config.APP_ENVIRONMENT === 'test'
};

/**
 * Custom console logger that respects environment settings
 */
const logger = {
  log: (...args) => {
    if (config.ENABLE_CONSOLE_LOGS && config.DEBUG_MODE) {
      console.log(`[${config.APP_NAME}]`, ...args);
    }
  },
  warn: (...args) => {
    if (config.ENABLE_CONSOLE_LOGS) {
      console.warn(`[${config.APP_NAME}]`, ...args);
    }
  },
  error: (...args) => {
    if (config.ENABLE_CONSOLE_LOGS) {
      console.error(`[${config.APP_NAME}]`, ...args);
    }
  },
  debug: (...args) => {
    if (config.DEBUG_MODE && config.ENABLE_CONSOLE_LOGS) {
      console.debug(`[${config.APP_NAME}] DEBUG:`, ...args);
    }
  }
};

/**
 * Local storage utility with prefix and expiry support
 */
const storage = {
  setItem: (key, value, expiry = config.CACHE_EXPIRY) => {
    try {
      const item = {
        value,
        timestamp: Date.now(),
        expiry: expiry ? Date.now() + expiry : null
      };
      localStorage.setItem(config.STORAGE_PREFIX + key, JSON.stringify(item));
    } catch (error) {
      logger.error('Error setting localStorage item:', error);
    }
  },
  
  getItem: (key) => {
    try {
      const itemStr = localStorage.getItem(config.STORAGE_PREFIX + key);
      if (!itemStr) return null;
      
      // Try to parse as JSON
      try {
        const item = JSON.parse(itemStr);
        
        // If it's our structured format with value/expiry
        if (typeof item === 'object' && item !== null && 'value' in item) {
          // Check if item has expired
          if (item.expiry && Date.now() > item.expiry) {
            storage.removeItem(key);
            return null;
          }
          return item.value;
        }
        
        // If it's a valid JSON value but not our structure, return as-is
        return item;
      } catch {
        // If JSON.parse fails, it might be a plain string, return as-is
        return itemStr;
      }
    } catch (error) {
      logger.error('Error getting localStorage item:', error);
      return null;
    }
  },
  
  removeItem: (key) => {
    try {
      localStorage.removeItem(config.STORAGE_PREFIX + key);
    } catch (error) {
      logger.error('Error removing localStorage item:', error);
    }
  },

  // Utility to migrate old format values to new format
  migrateItem: (key, ttlMinutes = null) => {
    try {
      const itemStr = localStorage.getItem(config.STORAGE_PREFIX + key);
      if (!itemStr) return;

      try {
        const parsed = JSON.parse(itemStr);
        // If it already has our structure, no migration needed
        if (typeof parsed === 'object' && parsed !== null && 'value' in parsed) {
          return;
        }
      } catch {
        // If it's not valid JSON, treat as string
      }

      // Migrate to new format
      const value = storage.getItem(key); // This will handle the old format
      storage.setItem(key, value, ttlMinutes); // This will store in new format
      logger.debug(`Migrated storage item: ${key}`);
    } catch (error) {
      logger.error('Error migrating localStorage item:', error);
    }
  },

  // Clear all app-specific items
  clear: () => {
    try {
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith(config.STORAGE_PREFIX)) {
          localStorage.removeItem(key);
        }
      });
      logger.debug('Cleared all TodoFlow localStorage items');
    } catch (error) {
      logger.error('Error clearing localStorage:', error);
    }
  }
};

/**
 * Validate environment configuration
 */
function validateEnvironment() {
  const warnings = [];
  const errors = [];
  
  // Check required configurations
  if (!config.API_BASE_URL) {
    errors.push('VITE_API_BASE_URL is not defined');
  }
  
  // Validate API URL format
  try {
    new URL(config.API_BASE_URL);
  } catch {
    warnings.push('VITE_API_BASE_URL may not be a valid URL');
  }
  
  // Production validations
  if (config.isProduction()) {
    if (config.API_BASE_URL.includes('localhost')) {
      warnings.push('Using localhost API URL in production environment');
    }
    
    if (config.DEBUG_MODE) {
      warnings.push('Debug mode is enabled in production');
    }
  }
  
  // Development warnings
  if (config.isDevelopment()) {
    if (!config.DEBUG_MODE) {
      warnings.push('Debug mode is disabled in development');
    }
  }
  
  // Display validation results
  if (errors.length > 0) {
    logger.error('❌ Environment configuration errors:');
    errors.forEach(error => logger.error(`   - ${error}`));
    throw new Error('Invalid environment configuration');
  }
  
  if (warnings.length > 0) {
    logger.warn('⚠️  Environment configuration warnings:');
    warnings.forEach(warning => logger.warn(`   - ${warning}`));
  }
  
  logger.log('✅ Frontend environment configuration validated');
}

/**
 * Display configuration summary (development only)
 */
function displayConfig() {
  if (config.isDevelopment() && config.DEBUG_MODE) {
    logger.log('📋 Frontend Configuration:');
    logger.log(`   APP_NAME: ${config.APP_NAME}`);
    logger.log(`   APP_VERSION: ${config.APP_VERSION}`);
    logger.log(`   APP_ENVIRONMENT: ${config.APP_ENVIRONMENT}`);
    logger.log(`   API_BASE_URL: ${config.API_BASE_URL}`);
    logger.log(`   DEFAULT_THEME: ${config.DEFAULT_THEME}`);
    logger.log(`   DEBUG_MODE: ${config.DEBUG_MODE}`);
    logger.log(`   Features: ${Object.entries(config.FEATURES).filter(([, enabled]) => enabled).map(([name]) => name).join(', ')}`);
  }
}

// Auto-validate on import
try {
  validateEnvironment();
  displayConfig();
} catch (error) {
  console.error('Frontend environment validation failed:', error.message);
}

export { config, logger, storage };
export default config;
