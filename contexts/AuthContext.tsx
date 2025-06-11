'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { logger } from '@/lib/logger';

interface User {
  id: string;
  email: string;
  name: string;
  verified: boolean;
  avatar?: string;
  location?: string;
  bio?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, firstName: string, lastName: string, phone?: string) => Promise<void>;
  signOut: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on mount
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      logger.debug('Checking authentication status', undefined, 'AuthContext');
      
      const response = await fetch('/api/auth/me', {
        credentials: 'include', // Include cookies
      });
      
      if (response.ok) {
        const userData = await response.json();
        logger.info('User authenticated', { email: userData.user?.email }, 'AuthContext');
        setUser(userData.user);
      } else {
        logger.debug('No valid authentication found', undefined, 'AuthContext');
        setUser(null);
      }
    } catch (error) {
      logger.error(error instanceof Error ? error : new Error('Auth check failed'), 'AuthContext');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      logger.info('Attempting sign in', { email }, 'AuthContext');
      
      const response = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Include cookies
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const error = await response.json();
        logger.warn('Sign in failed', { email, error: error.error }, 'AuthContext');
        throw new Error(error.error || 'Sign in failed');
      }

      const data = await response.json();
      logger.info('Sign in successful', { email }, 'AuthContext');
      setUser(data.user);
    } catch (error) {
      logger.error(error instanceof Error ? error : new Error('Sign in error'), 'AuthContext');
      throw error;
    }
  };

  const signUp = async (email: string, password: string, firstName: string, lastName: string, phone?: string) => {
    try {
      logger.info('Attempting sign up', { email }, 'AuthContext');
      
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Include cookies
        body: JSON.stringify({ email, password, firstName, lastName, phone }),
      });

      if (!response.ok) {
        const error = await response.json();
        logger.warn('Sign up failed', { email, error: error.error }, 'AuthContext');
        throw new Error(error.error || 'Sign up failed');
      }

      const data = await response.json();
      logger.info('Sign up successful', { email }, 'AuthContext');
      setUser(data.user);
    } catch (error) {
      logger.error(error instanceof Error ? error : new Error('Sign up error'), 'AuthContext');
      throw error;
    }
  };

  const signOut = async () => {
    try {
      logger.info('Attempting sign out', 'AuthContext');
      
      await fetch('/api/auth/signout', { 
        method: 'POST',
        credentials: 'include', // Include cookies
      });
      
      setUser(null);
      logger.info('Sign out successful', 'AuthContext');
      
      // Force a page reload to clear any cached state
      window.location.href = '/';
    } catch (error) {
      logger.error(error instanceof Error ? error : new Error('Sign out error'), 'AuthContext');
      // Even if the API call fails, clear the local state
      setUser(null);
      window.location.href = '/';
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      signIn,
      signUp,
      signOut,
      isAuthenticated: !!user,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
}