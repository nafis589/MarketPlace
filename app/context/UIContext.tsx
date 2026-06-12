'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { useCart } from './CartContext';

export type LoginIntent = 'sell' | null;

interface UIContextType {
  loginOpen: boolean;
  registerOpen: boolean;
  cartOpen: boolean;
  loginIntent: LoginIntent;
  openLogin: () => void;
  openLoginForSell: () => void;
  openRegister: () => void;
  openCart: () => void;
  closeAll: () => void;
  clearLoginIntent: () => void;
  switchToLogin: () => void;
  switchToRegister: () => void;
}

const UIContext = createContext<UIContextType | undefined>(undefined);

export function UIProvider({ children }: { children: ReactNode }) {
  const { isCartOpen, setIsCartOpen } = useCart();
  const [loginOpen, setLoginOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);
  const [loginIntent, setLoginIntent] = useState<LoginIntent>(null);

  const clearLoginIntent = useCallback(() => setLoginIntent(null), []);

  const openLogin = useCallback(() => {
    setLoginIntent(null);
    setRegisterOpen(false);
    setLoginOpen(true);
    setIsCartOpen(false);
  }, [setIsCartOpen]);

  const openLoginForSell = useCallback(() => {
    setLoginIntent('sell');
    setRegisterOpen(false);
    setLoginOpen(true);
    setIsCartOpen(false);
  }, [setIsCartOpen]);

  const openRegister = useCallback(() => {
    setLoginOpen(false);
    setRegisterOpen(true);
    setIsCartOpen(false);
  }, [setIsCartOpen]);

  const openCart = useCallback(() => {
    setLoginOpen(false);
    setRegisterOpen(false);
    setIsCartOpen(true);
  }, [setIsCartOpen]);

  const closeAll = useCallback(() => {
    setLoginOpen(false);
    setRegisterOpen(false);
    setIsCartOpen(false);
    setLoginIntent(null);
  }, [setIsCartOpen]);

  const switchToLogin = useCallback(() => {
    setRegisterOpen(false);
    setLoginOpen(true);
  }, []);

  const switchToRegister = useCallback(() => {
    setLoginOpen(false);
    setRegisterOpen(true);
  }, []);

  return (
    <UIContext.Provider
      value={{
        loginOpen,
        registerOpen,
        cartOpen: isCartOpen,
        loginIntent,
        openLogin,
        openLoginForSell,
        openRegister,
        openCart,
        closeAll,
        clearLoginIntent,
        switchToLogin,
        switchToRegister,
      }}
    >
      {children}
    </UIContext.Provider>
  );
}

export function useUI() {
  const context = useContext(UIContext);
  if (!context) {
    throw new Error('useUI must be used within a UIProvider');
  }
  return context;
}
