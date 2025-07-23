import React, { useEffect, useState } from 'react';
import { themes } from '../constants/themes';
import { ThemeContext } from '../hooks/useTheme';

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [currentTheme, setCurrentTheme] = useState('blue');

  // Initialize theme from localStorage or system preference
  useEffect(() => {
    const savedTheme = localStorage.getItem('todoflow-theme');
    const savedMode = localStorage.getItem('todoflow-dark-mode');
    
    if (savedTheme && themes[savedTheme]) {
      setCurrentTheme(savedTheme);
    }
    
    if (savedMode !== null) {
      setIsDarkMode(savedMode === 'true');
    } else {
      // Detect system preference
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDarkMode(systemPrefersDark);
    }
  }, []);

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e) => {
      // Only auto-switch if user hasn't manually set a preference
      const savedMode = localStorage.getItem('todoflow-dark-mode');
      if (savedMode === null) {
        setIsDarkMode(e.matches);
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
      console.log('Setting dark mode');
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
      console.log('Setting light mode');
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

    // Save preferences
    localStorage.setItem('todoflow-theme', currentTheme);
    localStorage.setItem('todoflow-dark-mode', isDarkMode.toString());
  }, [isDarkMode, currentTheme]);

  const toggleDarkMode = () => {
    console.log('Toggling dark mode from:', isDarkMode, 'to:', !isDarkMode);
    setIsDarkMode(prev => !prev);
  };

  const changeTheme = (themeId) => {
    if (themes[themeId]) {
      setCurrentTheme(themeId);
    }
  };

  const value = {
    isDarkMode,
    currentTheme,
    themes,
    toggleDarkMode,
    changeTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
