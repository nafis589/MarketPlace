'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { api, ApiClientError } from '@/lib/api-client';
import type { AuthResponse, ProfileResponse, User } from '@/lib/types';

export interface RegisterData {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isLoggedIn: boolean;
  login: (email: string, password: string) => Promise<User>;
  logout: () => Promise<void>;
  register: (data: RegisterData) => Promise<User>;
  isUserMenuOpen: boolean;
  openUserMenu: () => void;
  closeUserMenu: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

async function storeToken(token: string): Promise<void> {
  const res = await fetch('/api/auth/set-cookie', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token }),
  });
  if (!res.ok) {
    throw new Error('Impossible de sauvegarder la session');
  }
}

async function clearToken(): Promise<void> {
  await fetch('/api/auth/set-cookie', { method: 'DELETE' });
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const hydrateUser = useCallback(async () => {
    try {
      const res = await fetch('/api/auth/session');
      if (!res.ok) return;
      const json = (await res.json()) as ProfileResponse;
      if (json.data) {
        setUser(json.data);
      }
    } catch {
      // No session — stay logged out
    }
  }, []);

  useEffect(() => {
    hydrateUser().finally(() => setIsLoading(false));
  }, [hydrateUser]);

  const login = useCallback(async (email: string, password: string): Promise<User> => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email, password }),
    });
    const json = (await res.json()) as AuthResponse | { error?: { code: string; message: string } };
    if (!res.ok) {
      const err = json as { error?: { code: string; message: string } };
      throw new ApiClientError(
        err.error?.code ?? 'LOGIN_FAILED',
        err.error?.message ?? 'Connexion impossible',
        res.status,
      );
    }
    const { data } = json as AuthResponse;
    await storeToken(data.accessToken);
    setUser(data.user);
    return data.user;
  }, []);

  const register = useCallback(async (registerData: RegisterData): Promise<User> => {
    const { data } = await api.post<AuthResponse>('/api/store/auth/register', registerData);
    await storeToken(data.accessToken);
    setUser(data.user);
    return data.user;
  }, []);

  const logout = useCallback(async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    await clearToken();
    setUser(null);
    setIsUserMenuOpen(false);
  }, []);

  const openUserMenu = useCallback(() => setIsUserMenuOpen(true), []);
  const closeUserMenu = useCallback(() => setIsUserMenuOpen(false), []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isLoggedIn: !!user,
        login,
        logout,
        register,
        isUserMenuOpen,
        openUserMenu,
        closeUserMenu,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export { ApiClientError };
