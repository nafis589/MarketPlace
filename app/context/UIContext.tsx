'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { useCart } from './CartContext';

export type LoginIntent = 'sell' | null;

interface UIContextType {
  loginOpen: boolean;
  registerOpen: boolean;
  cartOpen: boolean;
  searchOpen: boolean;
  notifOpen: boolean;
  loginIntent: LoginIntent;
  openLogin: () => void;
  openLoginForSell: () => void;
  openRegister: () => void;
  openCart: () => void;
  openNotif: () => void;
  closeNotif: () => void;
  openSearch: () => void;
  closeSearch: () => void;
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
  const [searchOpen, setSearchOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [loginIntent, setLoginIntent] = useState<LoginIntent>(null);

  const clearLoginIntent = useCallback(() => setLoginIntent(null), []);

  const openLogin = useCallback(() => {
    setLoginIntent(null);
    setRegisterOpen(false);
    setSearchOpen(false);
    setNotifOpen(false);
    setLoginOpen(true);
    setIsCartOpen(false);
  }, [setIsCartOpen]);

  const openLoginForSell = useCallback(() => {
    setLoginIntent('sell');
    setRegisterOpen(false);
    setSearchOpen(false);
    setNotifOpen(false);
    setLoginOpen(true);
    setIsCartOpen(false);
  }, [setIsCartOpen]);

  const openRegister = useCallback(() => {
    setLoginOpen(false);
    setRegisterOpen(true);
    setSearchOpen(false);
    setNotifOpen(false);
    setIsCartOpen(false);
  }, [setIsCartOpen]);

  const openCart = useCallback(() => {
    setLoginOpen(false);
    setRegisterOpen(false);
    setSearchOpen(false);
    setNotifOpen(false);
    setIsCartOpen(true);
  }, [setIsCartOpen]);

  const openNotif = useCallback(() => {
    setLoginOpen(false);
    setRegisterOpen(false);
    setSearchOpen(false);
    setIsCartOpen(false);
    setNotifOpen(true);
  }, [setIsCartOpen]);

  const closeNotif = useCallback(() => {
    setNotifOpen(false);
  }, []);

  const openSearch = useCallback(() => {
    setLoginOpen(false);
    setRegisterOpen(false);
    setIsCartOpen(false);
    setNotifOpen(false);
    setSearchOpen(true);
  }, [setIsCartOpen]);

  const closeSearch = useCallback(() => {
    setSearchOpen(false);
  }, []);

  const closeAll = useCallback(() => {
    setLoginOpen(false);
    setRegisterOpen(false);
    setIsCartOpen(false);
    setSearchOpen(false);
    setNotifOpen(false);
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
        searchOpen,
        notifOpen,
        loginIntent,
        openLogin,
        openLoginForSell,
        openRegister,
        openCart,
        openNotif,
        closeNotif,
        openSearch,
        closeSearch,
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
