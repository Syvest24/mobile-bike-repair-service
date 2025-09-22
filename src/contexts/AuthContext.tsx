import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { supabase, mockUser } from '../lib/supabase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check for existing session
    const checkUser = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          const userData = {
            id: session.user.id,
            email: session.user.email!,
            name: session.user.user_metadata?.name || session.user.email!.split('@')[0],
            phone: session.user.user_metadata?.phone,
            subscription_plan: 'basic' as const,
            created_at: session.user.created_at
          };
          setUser(userData);
        }
      } catch (err) {
        console.error('Error checking session:', err);
        // Fallback to localStorage for demo
        const savedUser = localStorage.getItem('bike-repair-user');
        if (savedUser) {
          setUser(JSON.parse(savedUser));
        }
      }
      setLoading(false);
    };

    checkUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          const userData = {
            id: session.user.id,
            email: session.user.email!,
            name: session.user.user_metadata?.name || session.user.email!.split('@')[0],
            phone: session.user.user_metadata?.phone,
            subscription_plan: 'basic' as const,
            created_at: session.user.created_at
          };
          setUser(userData);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          localStorage.removeItem('bike-repair-user');
        }
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        // For demo purposes, allow any email/password combination
        if (authError.message.includes('Invalid login credentials')) {
          const userData = { ...mockUser, email };
          setUser(userData);
          localStorage.setItem('bike-repair-user', JSON.stringify(userData));
        } else {
          throw authError;
        }
      }
    } catch (err: any) {
      setError(err.message || 'Failed to sign in');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const { data, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
          }
        }
      });

      if (authError) {
        // For demo purposes, create user locally
        const userData = { ...mockUser, email, name };
        setUser(userData);
        localStorage.setItem('bike-repair-user', JSON.stringify(userData));
      }
    } catch (err: any) {
      setError(err.message || 'Failed to create account');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    setError(null);
    
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.error('Error signing out:', err);
    } finally {
      setUser(null);
      localStorage.removeItem('bike-repair-user');
      setLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      error, 
      signIn, 
      signUp, 
      signOut, 
      clearError 
    }}>
      {children}
    </AuthContext.Provider>
  );
}
    setLoading(false);
  };

  const signUp = async (email: string, password: string, name: string) => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const userData = { ...mockUser, email, name };
    setUser(userData);
    localStorage.setItem('bike-repair-user', JSON.stringify(userData));
    setLoading(false);
  };

  const signOut = async () => {
    setUser(null);
    localStorage.removeItem('bike-repair-user');
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
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