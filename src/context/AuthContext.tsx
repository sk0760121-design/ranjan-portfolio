import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured, CMSService } from '../lib/supabase';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isAdmin: boolean;
  loading: boolean;
  authError: string | null;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  signOutAllSessions: () => Promise<void>;
  isConfigured: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LOCAL_ADMIN_KEY = 'ranjan_portfolio_admin_user';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function initializeAuth() {
      if (isSupabaseConfigured && supabase) {
        try {
          const { data: { session } } = await supabase.auth.getSession();
          if (!mounted) return;

          if (session?.user) {
            setUser(session.user);
            setSession(session);
            const admin = await CMSService.checkAdminStatus(session.user);
            if (mounted) setIsAdmin(admin);
          }
        } catch (e) {
          console.error('Supabase getSession error:', e);
        }

        // Listen to auth state transitions
        const { data: authListener } = supabase.auth.onAuthStateChange(
          async (_event, session) => {
            if (!mounted) return;
            setSession(session);
            setUser(session?.user ?? null);
            if (session?.user) {
              const admin = await CMSService.checkAdminStatus(session.user);
              if (mounted) setIsAdmin(admin);
            } else {
              if (mounted) setIsAdmin(false);
            }
            if (mounted) setLoading(false);
          }
        );

        if (mounted) setLoading(false);
        return () => {
          authListener?.subscription.unsubscribe();
        };
      } else {
        // Fallback persistent session check for standalone mode
        const saved = localStorage.getItem(LOCAL_ADMIN_KEY);
        if (saved) {
          try {
            const parsed = JSON.parse(saved);
            setUser(parsed);
            setIsAdmin(true);
          } catch (e) {
            localStorage.removeItem(LOCAL_ADMIN_KEY);
          }
        }
        if (mounted) setLoading(false);
      }
    }

    initializeAuth();

    return () => {
      mounted = false;
    };
  }, []);

  const signIn = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    setAuthError(null);
    setLoading(true);

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

        if (error) {
          setAuthError(error.message);
          setLoading(false);
          return { success: false, error: error.message };
        }

        if (data.user) {
          const admin = await CMSService.checkAdminStatus(data.user);
          if (!admin) {
            await supabase.auth.signOut();
            setAuthError('ACCESS DENIED: Your account does not have administrator privileges.');
            setLoading(false);
            return {
              success: false,
              error: 'ACCESS DENIED: Your account does not have administrator privileges.',
            };
          }

          setUser(data.user);
          setSession(data.session);
          setIsAdmin(true);
          setLoading(false);
          return { success: true };
        }
      } catch (err: any) {
        const msg = err.message || 'Authentication failed';
        setAuthError(msg);
        setLoading(false);
        return { success: false, error: msg };
      }
    }

    // Local / Standalone mode validation
    const cleanEmail = email.trim().toLowerCase();
    const authorizedEmails = [
      'sk0760121@gmail.com',
      'ranjan.cinematicx@gmail.com',
      'admin@ranjankumar.com',
      'ranjan@portfolio.com',
    ];

    if (!authorizedEmails.includes(cleanEmail)) {
      setAuthError('ACCESS DENIED: Email not authorized as administrator.');
      setLoading(false);
      return { success: false, error: 'ACCESS DENIED: Email not authorized as administrator.' };
    }

    if (!password || password.length < 6) {
      setAuthError('Password must be at least 6 characters.');
      setLoading(false);
      return { success: false, error: 'Password must be at least 6 characters.' };
    }

    const mockUser: any = {
      id: 'usr-admin-ranjan',
      email: cleanEmail,
      app_metadata: { role: 'admin' },
      user_metadata: { name: 'Ranjan Kumar' },
      aud: 'authenticated',
      created_at: new Date().toISOString(),
    };

    localStorage.setItem(LOCAL_ADMIN_KEY, JSON.stringify(mockUser));
    setUser(mockUser);
    setIsAdmin(true);
    setLoading(false);
    return { success: true };
  };

  const signUp = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    setAuthError(null);
    setLoading(true);

    const cleanEmail = email.trim().toLowerCase();
    const authorizedEmails = [
      'sk0760121@gmail.com',
      'ranjan.cinematicx@gmail.com',
      'admin@ranjankumar.com',
    ];

    if (!authorizedEmails.includes(cleanEmail)) {
      setAuthError('ACCESS DENIED: Only authorized portfolio owner emails can register as admin.');
      setLoading(false);
      return { success: false, error: 'ACCESS DENIED: Only authorized portfolio owner emails can register as admin.' };
    }

    if (password.length < 6) {
      setAuthError('Password must be at least 6 characters.');
      setLoading(false);
      return { success: false, error: 'Password must be at least 6 characters.' };
    }

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.auth.signUp({
          email: cleanEmail,
          password,
        });

        if (error) {
          setAuthError(error.message);
          setLoading(false);
          return { success: false, error: error.message };
        }

        if (data.user) {
          // Ensure entry in admin_users
          try {
            await supabase.from('admin_users').upsert({
              user_id: data.user.id,
              email: cleanEmail,
              role: 'admin',
            });
          } catch (e) {}

          setUser(data.user);
          setSession(data.session);
          setIsAdmin(true);
          setLoading(false);
          return { success: true };
        }
      } catch (err: any) {
        setAuthError(err.message || 'Registration failed');
        setLoading(false);
        return { success: false, error: err.message };
      }
    }

    return signIn(email, password);
  };

  const signOut = async () => {
    setLoading(true);
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut();
    }
    localStorage.removeItem(LOCAL_ADMIN_KEY);
    setUser(null);
    setSession(null);
    setIsAdmin(false);
    setLoading(false);
  };

  const signOutAllSessions = async () => {
    setLoading(true);
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut({ scope: 'global' });
    }
    localStorage.removeItem(LOCAL_ADMIN_KEY);
    setUser(null);
    setSession(null);
    setIsAdmin(false);
    setLoading(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isAdmin,
        loading,
        authError,
        signIn,
        signUp,
        signOut,
        signOutAllSessions,
        isConfigured: isSupabaseConfigured,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
