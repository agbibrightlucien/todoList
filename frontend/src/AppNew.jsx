import React from 'react';
import { AuthProvider } from './contexts/AuthContext.jsx';
import { useAuth } from './hooks/useAuth';
import Auth from './components/Auth';
import Header from './components/Header';
import TodoApp from './components/TodoApp';
import './App.css';

const AppContent = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center animate-fade-in">
          <div className="loading-spinner spinner-lg mx-auto mb-4 text-primary-500"></div>
          <p className="text-gray-600 font-medium">Initializing TodoFlow...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Auth />;
  }

  return (
    <div className="app-layout">
      <Header />
      <TodoApp />
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
