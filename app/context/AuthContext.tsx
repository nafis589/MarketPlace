'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

type AuthModalMode = 'login' | 'signup';

interface AuthContextType {
    isLoggedIn: boolean;
    login: () => void;
    logout: () => void;
    isAuthModalOpen: boolean;
    authModalMode: AuthModalMode;
    openAuthModal: (mode: AuthModalMode) => void;
    closeAuthModal: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [authModalMode, setAuthModalMode] = useState<AuthModalMode>('login');

    const login = () => {
        setIsLoggedIn(true);
        setIsAuthModalOpen(false);
    };
    const logout = () => setIsLoggedIn(false);

    const openAuthModal = (mode: AuthModalMode) => {
        setAuthModalMode(mode);
        setIsAuthModalOpen(true);
    };

    const closeAuthModal = () => {
        setIsAuthModalOpen(false);
    };

    return (
        <AuthContext.Provider value={{ isLoggedIn, login, logout, isAuthModalOpen, authModalMode, openAuthModal, closeAuthModal }}>
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
