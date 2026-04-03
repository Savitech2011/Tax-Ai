import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, db } from '../lib/firebase';
import { onAuthStateChanged, signOut as firebaseSignOut, User as FirebaseUser } from 'firebase/auth';
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
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        // Only consider the user logged in if they used Google (auto-verified) or verified their email
        if (firebaseUser.emailVerified || firebaseUser.providerData.some(p => p.providerId === 'google.com')) {
          let name = firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User';
          
          // Set user immediately so UI doesn't block
          setUser({
            id: firebaseUser.uid,
            email: firebaseUser.email || '',
            name,
            emailVerified: firebaseUser.emailVerified
          });
          setIsLoading(false);

          // Fetch profile asynchronously
          getDoc(doc(db, 'users', firebaseUser.uid)).then(userDoc => {
            if (userDoc.exists() && userDoc.data().displayName) {
              setUser(prev => prev ? { ...prev, name: userDoc.data().displayName } : null);
            }
          }).catch(err => {
            console.error("Error fetching user profile:", err);
          });

        } else {
          setUser(null);
          setIsLoading(false);
        }
      } else {
        setUser(null);
        setIsLoading(false);
      }
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
