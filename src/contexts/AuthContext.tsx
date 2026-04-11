import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, db } from '../lib/firebase';
import { onAuthStateChanged, reload, signOut as firebaseSignOut, User as FirebaseUser } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

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
    const resolveAuthState = async (firebaseUser: FirebaseUser | null) => {
      if (!firebaseUser) {
        setUser(null);
        setIsLoading(false);
        return;
      }

      // Refresh user metadata so recently verified emails are recognized quickly.
      try {
        await reload(firebaseUser);
      } catch (error) {
        console.error('Could not reload Firebase user metadata:', error);
      }

      const currentUser = auth.currentUser ?? firebaseUser;
      const isGoogleUser = currentUser.providerData.some((provider) => provider.providerId === 'google.com');

      if (!currentUser.emailVerified && !isGoogleUser) {
        setUser(null);
        setIsLoading(false);
        return;
      }

      const name = currentUser.displayName || currentUser.email?.split('@')[0] || 'User';
      setUser({
        id: currentUser.uid,
        email: currentUser.email || '',
        name,
        emailVerified: currentUser.emailVerified
      });
      setIsLoading(false);

      // Fetch profile asynchronously and update name if profile exists.
      getDoc(doc(db, 'users', currentUser.uid))
        .then((userDoc) => {
          if (userDoc.exists() && userDoc.data().displayName) {
            setUser((prev) => (prev ? { ...prev, name: userDoc.data().displayName } : null));
          }
        })
        .catch((err) => {
          console.error('Error fetching user profile:', err);
        });
    };

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser: FirebaseUser | null) => {
      resolveAuthState(firebaseUser).catch((error) => {
        console.error('Error resolving auth state:', error);
        setUser(null);
        setIsLoading(false);
      });
    });

    return () => unsubscribe();
  }, []);

  const logout = async () => {
    await firebaseSignOut(auth);
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
