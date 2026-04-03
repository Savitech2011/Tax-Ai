import React, { useState, useEffect } from 'react';
import LandingPage from './components/LandingPage';
import ChatInterface from './components/ChatInterface';
import AuthPage from './components/AuthPage';
import { AuthProvider, useAuth } from './contexts/AuthContext';

function AppContent() {
  const [started, setStarted] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (user) {
      setStarted(true);
      setShowAuth(false);
    }
  }, [user]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f4f5f7]">
        <div className="w-8 h-8 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (showAuth && !user) {
    return <AuthPage onLogin={() => setStarted(true)} />;
  }

  if (!started) {
    return <LandingPage onStart={() => {
      if (user) {
        setStarted(true);
      } else {
        setShowAuth(true);
      }
    }} />;
  }

  return <ChatInterface onBack={() => {
    setStarted(false);
    setShowAuth(false);
  }} />;
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
