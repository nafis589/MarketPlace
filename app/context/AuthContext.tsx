'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

type AuthModalMode = 'login' | 'signup';

export interface UserProfile {
    name: string;
    email: string;
    avatar?: string;
}

interface AuthContextType {
    isLoggedIn: boolean;
    user: UserProfile | null;
    login: (userData?: UserProfile) => void;
    logout: () => void;
    isAuthModalOpen: boolean;
    authModalMode: AuthModalMode;
    openAuthModal: (mode: AuthModalMode) => void;
    closeAuthModal: () => void;
    isUserMenuOpen: boolean;
    openUserMenu: () => void;
    closeUserMenu: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState<UserProfile | null>(null);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [authModalMode, setAuthModalMode] = useState<AuthModalMode>('login');
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

    const login = (userData?: UserProfile) => {
        setIsLoggedIn(true);
        setUser(userData || { name: 'Utilisateur', email: 'user@email.com' });
        setIsAuthModalOpen(false);
    };
    const logout = () => {
        setIsLoggedIn(false);
        setUser(null);
        setIsUserMenuOpen(false);
    };

    const openAuthModal = (mode: AuthModalMode) => {
        setAuthModalMode(mode);
        setIsAuthModalOpen(true);
    };

    const closeAuthModal = () => {
        setIsAuthModalOpen(false);
    };

    const openUserMenu = () => setIsUserMenuOpen(true);
    const closeUserMenu = () => setIsUserMenuOpen(false);

    return (
        <AuthContext.Provider value={{ isLoggedIn, user, login, logout, isAuthModalOpen, authModalMode, openAuthModal, closeAuthModal, isUserMenuOpen, openUserMenu, closeUserMenu }}>
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
