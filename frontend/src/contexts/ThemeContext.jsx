import React, { useEffect, useState } from 'react';
import { themes } from '../constants/themes';
import { ThemeContext } from '../hooks/useTheme';
import { config, logger, storage } from '../config/environment';

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [currentTheme, setCurrentTheme] = useState(config.DEFAULT_THEME);

  // Initialize theme from storage or system preference
  useEffect(() => {
    // One-time cleanup for problematic old storage values
    const migrationKey = 'storage_migration_v1';
    if (!localStorage.getItem(migrationKey)) {
      // Remove old format items that might cause JSON parsing errors
      ['theme', 'dark_mode', 'todoflow_theme', 'todoflow_dark_mode'].forEach(key => {
        const value = localStorage.getItem(key);
        if (value && !value.startsWith('{"')) {
          logger.debug(`Removing old format storage: ${key} = ${value}`);
          localStorage.removeItem(key);
        }
      });
      localStorage.setItem(migrationKey, 'completed');
    }
    
    // Try to get from new storage first, then fallback to old storage keys
    let savedTheme = storage.getItem('theme');
    if (!savedTheme) {
      // Check old storage locations
      savedTheme = localStorage.getItem(config.THEME_STORAGE_KEY) || 
                   localStorage.getItem('theme') || 
                   localStorage.getItem('todoflow_theme');
    }
    
    let savedMode = storage.getItem('dark_mode');
    if (savedMode === null) {
      // Check old storage locations
      const oldMode = localStorage.getItem(config.DARK_MODE_STORAGE_KEY) || 
                      localStorage.getItem('dark_mode') || 
                      localStorage.getItem('todoflow_dark_mode');
      savedMode = oldMode === 'true' || oldMode === true;
    }
    
    if (savedTheme && themes[savedTheme]) {
      setCurrentTheme(savedTheme);
      logger.debug('Loaded saved theme:', savedTheme);
    } else {
      setCurrentTheme(config.DEFAULT_THEME);
      logger.debug('Using default theme:', config.DEFAULT_THEME);
    }
    
    if (savedMode !== null) {
      setIsDarkMode(savedMode === 'true');
      logger.debug('Loaded saved dark mode preference:', savedMode);
    } else {
      // Detect system preference
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDarkMode(systemPrefersDark);
      logger.debug('Using system dark mode preference:', systemPrefersDark);
    }
  }, []);

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e) => {
      // Only auto-switch if user hasn't manually set a preference
      const savedMode = storage.getItem('dark_mode') || localStorage.getItem(config.DARK_MODE_STORAGE_KEY);
      if (savedMode === null) {
        setIsDarkMode(e.matches);
        logger.debug('System theme changed, updating to:', e.matches ? 'dark' : 'light');
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Apply theme to CSS variables
  useEffect(() => {
    console.log('Applying theme - isDarkMode:', isDarkMode, 'currentTheme:', currentTheme);
    const root = document.documentElement;
    const theme = themes[currentTheme];
    
    // Apply theme colors
    Object.entries(theme.colors.primary).forEach(([shade, color]) => {
      root.style.setProperty(`--primary-${shade}`, color);
    });

    // Apply dark/light mode
    if (isDarkMode) {
      logger.debug('Setting dark mode');
      root.setAttribute('data-theme', 'dark');
      root.style.setProperty('--bg-primary', '#0f172a');
      root.style.setProperty('--bg-secondary', '#1e293b');
      root.style.setProperty('--bg-tertiary', '#334155');
      root.style.setProperty('--text-primary', '#f8fafc');
      root.style.setProperty('--text-secondary', '#cbd5e1');
      root.style.setProperty('--text-tertiary', '#94a3b8');
      root.style.setProperty('--border-color', '#334155');
      root.style.setProperty('--shadow-color', 'rgba(0, 0, 0, 0.5)');
    } else {
      logger.debug('Setting light mode');
      root.setAttribute('data-theme', 'light');
      root.style.setProperty('--bg-primary', '#ffffff');
      root.style.setProperty('--bg-secondary', '#f8fafc');
      root.style.setProperty('--bg-tertiary', '#f1f5f9');
      root.style.setProperty('--text-primary', '#0f172a');
      root.style.setProperty('--text-secondary', '#334155');
      root.style.setProperty('--text-tertiary', '#64748b');
      root.style.setProperty('--border-color', '#e2e8f0');
      root.style.setProperty('--shadow-color', 'rgba(0, 0, 0, 0.1)');
    }

    // Save preferences using both storage systems
    storage.setItem('theme', currentTheme);
    storage.setItem('dark_mode', isDarkMode.toString());
    localStorage.setItem(config.THEME_STORAGE_KEY, currentTheme);
    localStorage.setItem(config.DARK_MODE_STORAGE_KEY, isDarkMode.toString());
    
    logger.debug('Theme applied:', { isDarkMode, currentTheme });
  }, [isDarkMode, currentTheme]);

  const toggleDarkMode = () => {
    logger.debug('Toggling dark mode from:', isDarkMode, 'to:', !isDarkMode);
    setIsDarkMode(prev => !prev);
  };

  const changeTheme = (themeId) => {
    if (themes[themeId]) {
      logger.debug('Changing theme to:', themeId);
      setCurrentTheme(themeId);
    } else {
      logger.warn('Invalid theme ID:', themeId);
    }
  };

  // Theme-related utilities
  const resetTheme = () => {
    logger.debug('Resetting theme to default');
    setCurrentTheme(config.DEFAULT_THEME);
    setIsDarkMode(false);
  };

  const value = {
    isDarkMode,
    currentTheme,
    themes,
    toggleDarkMode,
    changeTheme,
    resetTheme,
    config: {
      defaultTheme: config.DEFAULT_THEME,
      enableThemes: config.FEATURES.THEMES
    }
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
