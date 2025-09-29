import React, { createContext, useContext, useEffect, useState } from 'react';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { supabase, testSupabaseConnection } from '../lib/supabase';
import { User } from '../types';

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

  // Helper function to map Supabase user to our User type
  const mapSupabaseUser = (supabaseUser: SupabaseUser): User => {
    return {
      id: supabaseUser.id,
      email: supabaseUser.email || '',
      name: supabaseUser.user_metadata?.full_name || supabaseUser.email?.split('@')[0] || 'User',
      created_at: supabaseUser.created_at || new Date().toISOString(),
    };
  };

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      // Test Supabase connection first
      if (supabase) {
        const connectionTest = await testSupabaseConnection();
        if (!connectionTest) {
          console.warn('⚠️ Supabase connection failed, using mock data');
        }
      }

      try {
        if (supabase) {
          const { data: { session } } = await supabase.auth.getSession();
          console.log('🔐 Session status:', session ? 'Active' : 'None');
          setUser(session?.user ? mapSupabaseUser(session.user) : null);
        } else {
          console.warn('⚠️ Supabase not configured, using mock authentication');
          // Don't auto-login with mock user, let them sign in
          setUser(null);
        }
      } catch (error) {
        console.error('❌ Error getting initial session:', error);
        setUser(null);
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
          console.log('🔄 Auth state changed:', event, session ? 'User logged in' : 'User logged out');
          setUser(session?.user ? mapSupabaseUser(session.user) : null);
          setLoading(false);
        }
      );
      subscription = data.subscription;
    }

    return () => subscription?.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      setError(null);
      if (supabase) {
        console.log('🔐 Attempting sign in with:', email);
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) {
          console.error('❌ Sign in error:', error.message);
          setError(error.message);
        } else {
          console.log('✅ Sign in successful');
        }
        return { error };
      } else {
        // Mock authentication for development
        console.log('🧪 Using mock authentication');
        if (email === 'cyclist@example.com' && password === 'password123') {
          setUser({
            id: 'mock-user-id',
            email: 'cyclist@example.com',
            name: 'Alex Rider',
            phone: '+1 (555) 123-4567',
            subscription_plan: 'premium',
            created_at: new Date().toISOString(),
          });
          console.log('✅ Mock sign in successful');
          return { error: null };
        } else {
          setError('Invalid credentials. Use cyclist@example.com / password123');
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
      setError(null);
      if (supabase) {
        console.log('📝 Attempting sign up with:', email);
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
          console.error('❌ Sign up error:', error.message);
          setError(error.message);
        } else {
          console.log('✅ Sign up successful - check email for confirmation');
        }
        return { error };
      } else {
        // Mock sign up for development
        setUser({
          id: 'mock-user-id',
          email,
          name: name || 'New User',
          subscription_plan: 'basic',
          created_at: new Date().toISOString(),
        });
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
        console.log('👋 Signing out...');
        await supabase.auth.signOut();
        console.log('✅ Sign out successful');
      } else {
        // Mock sign out
        console.log('🧪 Mock sign out');
        setUser(null);
      }
    } catch (error) {
      console.error('❌ Error signing out:', error);
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