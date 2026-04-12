import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchCurrentUser, signOutInsforge } from '../lib/insforge';

interface User {
  id: string;
  email: string;
  name: string;
  emailVerified: boolean;
}

interface AuthContextType {
  user: User | null;
  logout: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadCurrentUser = async () => {
      try {
        const currentUser = await fetchCurrentUser();
        if (!currentUser) {
          setUser(null);
          return;
        }

        setUser({
          id: currentUser.id,
          email: currentUser.email,
          name: currentUser.profile?.name || currentUser.email.split('@')[0] || 'User',
          emailVerified: Boolean(currentUser.emailVerified),
        });
      } catch (error) {
        console.error('Error resolving Insforge auth state:', error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    loadCurrentUser();
  }, []);

  const logout = async () => {
    await signOutInsforge();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
