import React, { useContext, useEffect, useState, ReactNode } from 'react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged, 
  User,
  sendPasswordResetEmail,
  updateProfile
} from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { AuthContext } from './AuthContextObject';
import { AuthContextType } from './types';

interface AuthProviderProps {
  children: ReactNode;
}

const AuthProviderComponent = ({ children }: AuthProviderProps) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  async function signup(email: string, password: string, displayName: string) {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(userCredential.user, { displayName });
    setCurrentUser(userCredential.user);
  }

  async function login(email: string, password: string) {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    setCurrentUser(userCredential.user);
  }

  async function logout() {
    await signOut(auth);
    setCurrentUser(null);
  }

  async function resetPassword(email: string) {
    await sendPasswordResetEmail(auth, email);
  }

  async function updateDisplayName(displayName: string) {
    if (currentUser) {
      await updateProfile(currentUser, { displayName });
      // Update the current user state to reflect the change
      setCurrentUser({ ...currentUser, displayName } as User);
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    login,
    signup,
    logout,
    resetPassword,
    updateDisplayName,
    loading
  };

  // Show a loading spinner while checking auth state
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export function AuthProvider({ children }: AuthProviderProps) {
  return <AuthProviderComponent>{children}</AuthProviderComponent>;
}