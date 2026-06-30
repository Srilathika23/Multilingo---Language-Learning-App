import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import AuthPage from './components/auth/AuthPage';
import MainLayout from './components/MainLayout';
import Loader from './components/Loader';

const AppContent: React.FC = () => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <Routes>
      <Route
        path="/auth"
        element={!currentUser ? <AuthPage /> : <Navigate to="/" replace />}
      />
      <Route
        path="/*"
        element={currentUser ? <MainLayout /> : <Navigate to="/auth" replace />}
      />
    </Routes>
  );
};


const App: React.FC = () => {
  return (
    <AuthProvider>
      <HashRouter>
        <AppContent />
      </HashRouter>
    </AuthProvider>
  );
};

export default App;