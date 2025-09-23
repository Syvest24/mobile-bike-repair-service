import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, name?: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        if (supabase) {
          const { data: { session } } = await supabase.auth.getSession();
          setUser(session?.user ?? null);
        } else {
          // Mock user for development when Supabase is not configured
          setUser({
            id: 'mock-user-id',
            email: 'demo@example.com',
            user_metadata: { full_name: 'Demo User' }
          } as any);
        }
      } catch (error) {
        console.error('Error getting initial session:', error);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    // Listen for auth changes
    let subscription: any;
    
    if (supabase) {
      const { data } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          setUser(session?.user ?? null);
          setLoading(false);
        }
      );
      subscription = data.subscription;
    }

    return () => subscription?.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      if (supabase) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) {
          setError(error.message);
        }
        return { error };
      } else {
        // Mock authentication for development
        if (email === 'demo@example.com' && password === 'password') {
          setUser({
            id: 'mock-user-id',
            email: 'demo@example.com',
            user_metadata: { full_name: 'Demo User' }
          } as any);
          return { error: null };
        } else {
          setError('Invalid credentials. Use demo@example.com / password');
          return { error: { message: 'Invalid credentials' } };
        }
      }
    } catch (error) {
      setError('An unexpected error occurred');
      return { error };
    }
  };

  const signUp = async (email: string, password: string, name?: string) => {
    try {
      if (supabase) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: name ? {
            data: {
              full_name: name,
            }
          } : undefined,
        });
        if (error) {
          setError(error.message);
        }
        return { error };
      } else {
        // Mock sign up for development
        setUser({
          id: 'mock-user-id',
          email: email,
          user_metadata: { full_name: name || 'New User' }
        } as any);
        return { error: null };
      }
    } catch (error) {
      setError('An unexpected error occurred');
      return { error };
    }
  };

  const signOut = async () => {
    try {
      if (supabase) {
        await supabase.auth.signOut();
      } else {
        // Mock sign out
        setUser(null);
      }
    } catch (error) {
      console.error('Error signing out:', error);
      setError('Error signing out');
    }
  };

  const clearError = () => {
    setError(null);
  };

  const value = {
    user,
    loading,
    error,
    signIn,
    signUp,
    signOut,
    clearError,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};