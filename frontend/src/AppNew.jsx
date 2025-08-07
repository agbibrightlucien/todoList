import React from 'react';
import { AuthProvider } from './contexts/AuthContext.jsx';
import { ThemeProvider } from './contexts/ThemeContext.jsx';
import { useAuth } from './hooks/useAuth';
import Auth from './components/Auth';
import Header from './components/Header';
import TodoApp from './components/TodoApp';
import { EnvironmentDisplay } from './components/EnvironmentDisplay';
import { config } from './config/environment';
import './App.css';

const AppContent = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
        <div className="text-center animate-fade-in">
          <div className="loading-spinner spinner-lg mx-auto mb-4 text-primary-500"></div>
          <p className="font-medium" style={{ color: 'var(--text-secondary)' }}>Initializing {config.APP_NAME}...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <>
        <Auth />
        <EnvironmentDisplay />
      </>
    );
  }

  return (
    <div className="app-layout">
      <Header />
      <TodoApp />
      <EnvironmentDisplay />
    </div>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
