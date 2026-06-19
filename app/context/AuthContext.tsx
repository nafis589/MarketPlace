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

  const fetchSessionUser = useCallback(async (): Promise<User | null> => {
    try {
      const res = await fetch('/api/auth/session');
      if (!res.ok) return null;
      const json = (await res.json()) as ProfileResponse;
      return json.data ?? null;
    } catch {
      return null;
    }
  }, []);

  const hydrateUser = useCallback(async () => {
    const sessionUser = await fetchSessionUser();
    if (sessionUser) {
      setUser(sessionUser);
    }
  }, [fetchSessionUser]);

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
    const enriched = (await fetchSessionUser()) ?? data.user;
    setUser(enriched);
    return enriched;
  }, [fetchSessionUser]);

  const register = useCallback(async (registerData: RegisterData): Promise<User> => {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(registerData),
    });
    const json = (await res.json()) as AuthResponse | { error?: { code: string; message: string } };
    if (!res.ok) {
      const err = json as { error?: { code: string; message: string } };
      throw new ApiClientError(
        err.error?.code ?? 'REGISTER_FAILED',
        err.error?.message ?? 'Inscription impossible',
        res.status,
      );
    }
    const { data } = json as AuthResponse;
    await storeToken(data.accessToken);
    const enriched = (await fetchSessionUser()) ?? data.user;
    setUser(enriched);
    return enriched;
  }, [fetchSessionUser]);

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
