import React from 'react';
import { Moon, Sun, Palette, X } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import { themes } from '../constants/themes';

const ThemeSettings = ({ isOpen, onClose }) => {
  const { isDarkMode, currentTheme, toggleDarkMode, changeTheme } = useTheme();

  if (!isOpen) return null;

  const handleThemeChange = (themeId) => {
    changeTheme(themeId);
  };

  console.log('ThemeSettings - isDarkMode:', isDarkMode, 'currentTheme:', currentTheme);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-6 z-50 animate-fade-in">
      <div className="theme-settings-modal card card-elevated w-full max-w-md animate-bounce-in">
        <div className="card-header">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Theme Settings</h2>
            <button
              onClick={onClose}
              className="btn btn-ghost btn-icon"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="card-content space-y-6">
          {/* Dark Mode Toggle */}
          <div className="theme-section">
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              {isDarkMode ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
              Appearance
            </h3>
            <div className="flex items-center gap-4">
              <button
                onClick={toggleDarkMode}
                className={`theme-toggle ${isDarkMode ? 'active' : ''}`}
              >
                <div className="theme-toggle-track">
                  <div className="theme-toggle-thumb">
                    {isDarkMode ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                  </div>
                </div>
              </button>
              <span className="text-sm text-secondary">
                {isDarkMode ? 'Dark Mode' : 'Light Mode'}
              </span>
            </div>
          </div>

          {/* Color Theme Selection */}
          <div className="theme-section">
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Palette className="w-5 h-5" />
              Color Theme
            </h3>
            
            <div className="grid grid-cols-2 gap-3">
              {Object.values(themes).map((theme) => (
                <button
                  key={theme.id}
                  onClick={() => handleThemeChange(theme.id)}
                  className={`theme-color-option ${currentTheme === theme.id ? 'active' : ''}`}
                >
                  <div className="theme-preview">
                    <div 
                      className="theme-preview-primary"
                      style={{ backgroundColor: theme.colors.primary[500] }}
                    />
                    <div 
                      className="theme-preview-secondary"
                      style={{ backgroundColor: theme.colors.primary[200] }}
                    />
                    <div 
                      className="theme-preview-accent"
                      style={{ backgroundColor: theme.colors.primary[600] }}
                    />
                  </div>
                  <span className="text-sm font-medium">{theme.name}</span>
                  {currentTheme === theme.id && (
                    <div className="theme-check">✓</div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Preview */}
          <div className="theme-section">
            <h3 className="text-lg font-semibold mb-3">Preview</h3>
            <div className="theme-preview-card">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-4 h-4 rounded bg-primary-500"></div>
                <span className="font-medium">Sample Todo Task</span>
              </div>
              <p className="text-sm text-secondary mb-3">
                This is how your todos will look with the selected theme.
              </p>
              <div className="flex gap-2">
                <span className="badge badge-high">High Priority</span>
                <span className="badge-category badge-work">💼 Work</span>
              </div>
            </div>
          </div>
        </div>

        <div className="card-footer">
          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="btn btn-secondary"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThemeSettings;
