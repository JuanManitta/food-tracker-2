import { useState, useEffect } from 'react';
import { auth } from '../firebase';
import { signInWithGoogle, signOut } from '@/lib/auth';
// import { signInWithGoogle, signOu } from '../lib/auth';

export function useAuth() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return {
    user,
    loading,
    login: signInWithGoogle,
    logout: signOut
  };
}