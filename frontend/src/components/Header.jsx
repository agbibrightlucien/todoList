import React, { useState } from 'react';
import { LogOut, User, CheckSquare, Palette } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../hooks/useTheme';
import ThemeSettings from './ThemeSettings';

const Header = () => {
  const { user, logout } = useAuth();
  const { isDarkMode, toggleDarkMode } = useTheme();
  const [showThemeSettings, setShowThemeSettings] = useState(false);

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      logout();
    }
  };

  return (
    <header className="header-nav sticky top-0 z-50">
      <div className="container">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center">
              <CheckSquare className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="nav-brand text-2xl">TodoFlow</h1>
              <p className="text-xs text-gray-500 hidden sm:block">Organize • Focus • Achieve</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-3 px-4 py-2 bg-secondary rounded-xl" style={{background: 'var(--bg-secondary)'}}>
              <div className="w-8 h-8 bg-gradient-to-br from-primary-400 to-primary-500 rounded-lg flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <div className="text-left">
                <p className="text-sm font-semibold text-primary">{user?.name}</p>
                <p className="text-xs text-secondary hidden md:block">{user?.email}</p>
              </div>
            </div>
            
            <button
              onClick={() => setShowThemeSettings(true)}
              className="btn btn-ghost btn-icon group"
              title="Theme Settings"
            >
              <Palette className="w-5 h-5 group-hover:rotate-12 transition-transform" />
            </button>
            
            {/* Temporary test button */}
            <button
              onClick={toggleDarkMode}
              className="btn btn-ghost btn-icon group"
              title={`Switch to ${isDarkMode ? 'Light' : 'Dark'} Mode`}
              style={{ background: isDarkMode ? '#374151' : '#f3f4f6', color: isDarkMode ? '#fff' : '#000' }}
            >
              {isDarkMode ? '☀️' : '🌙'}
            </button>
            
            <button
              onClick={handleLogout}
              className="btn btn-ghost btn-icon group"
              title="Logout"
            >
              <LogOut className="w-5 h-5 group-hover:rotate-12 transition-transform" />
            </button>
          </div>
        </div>
      </div>
      
      {/* Theme Settings Modal */}
      <ThemeSettings 
        isOpen={showThemeSettings} 
        onClose={() => setShowThemeSettings(false)} 
      />
    </header>
  );
};

export default Header;
