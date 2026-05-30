'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { X, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/app/context/AuthContext';
import { useLockBodyScroll } from '@/hooks/useLockBodyScroll';

// --- Types ---
type AuthMode = 'login' | 'signup';

interface AuthModalProps {
    isOpen?: boolean;
    onClose?: () => void;
    defaultMode?: AuthMode;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen: isOpenProp, onClose: onCloseProp, defaultMode = 'login' }) => {
    const { isAuthModalOpen, authModalMode, closeAuthModal, login, openUserMenu } = useAuth();
    const [mode, setMode] = useState<AuthMode>(defaultMode);
    const [showPassword, setShowPassword] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const isControlled = isOpenProp !== undefined;

    // Detect mobile
    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth < 1024);
        check();
        window.addEventListener('resize', check);
        return () => window.removeEventListener('resize', check);
    }, []);

    const isActuallyOpen = isControlled ? isOpenProp : isAuthModalOpen;

    // Track open/close transitions to reset state when modal opens
    const prevOpen = useRef(isActuallyOpen);
    useEffect(() => {
        const justOpened = isActuallyOpen && !prevOpen.current;
        prevOpen.current = isActuallyOpen;

        if (justOpened && authModalMode) {
            setMode(authModalMode);
            setEmail('');
            setPassword('');
            setFirstName('');
            setShowPassword(false);
        }
    }, [isActuallyOpen, authModalMode]);

    const handleClose = useCallback(() => {
        if (isControlled && onCloseProp) onCloseProp();
        else closeAuthModal();
    }, [isControlled, onCloseProp, closeAuthModal]);

    // --- Form state (MUST be before any conditional return) ---
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');

    const handleSwitchMode = useCallback((newMode: AuthMode) => {
        setMode(newMode);
        setPassword('');
        if (newMode === 'login') {
            setFirstName('');
        }
    }, []);

    // Lock body scroll when full-screen overlay is open (must be before early return)
    useLockBodyScroll(isActuallyOpen && isMobile);

    if (!isActuallyOpen) return null;

    const isLoginValid = email.trim() !== '' && password.trim() !== '';
    const isSignupValid = firstName.trim() !== '' && email.trim() !== '' && password.trim() !== '';

    const handleLoginSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!isLoginValid) return;
        login();
        handleClose();
        if (isMobile) openUserMenu();
    };

    const handleSignupSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!isSignupValid) return;
        login();
        handleClose();
        if (isMobile) openUserMenu();
    };

    // ─────────────────────────────────────────────────────
    // DESKTOP MODAL
    // ─────────────────────────────────────────────────────
    if (!isMobile) {
        return (
            <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/50 animate-in fade-in duration-200">
                <div className="relative w-full max-w-[500px] bg-white rounded-sm shadow-2xl animate-in zoom-in-95 duration-200">
                    {/* Close button only */}
                    <div className="flex justify-end px-5 pt-5">
                        <button
                            onClick={handleClose}
                            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                        >
                            <X size={18} />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="px-12 pb-10 pt-0">
                        {mode === 'login' ? (
                            // ═══════════════ LOGIN FORM ═══════════════
                            <form onSubmit={handleLoginSubmit}>
                                <h2 className="font-serif text-3xl text-center mb-8">Se connecter</h2>
                                <div className="space-y-5">
                                    <div>
                                        <label className="block text-sm text-gray-700 mb-1.5">Adresse e-mail</label>
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full border border-gray-300 rounded-sm px-4 py-3 text-sm outline-none transition-colors focus:border-black"
                                        />
                                    </div>

                                    <div className="relative">
                                        <label className="block text-sm text-gray-700 mb-1.5">Mot de passe</label>
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="w-full border border-gray-300 rounded-sm px-4 py-3 text-sm outline-none transition-colors focus:border-black pr-10"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-[42px] text-gray-400 hover:text-gray-600 transition-colors"
                                        >
                                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                        </button>
                                    </div>

                                    <div className="text-right">
                                        <button
                                            type="button"
                                            className="text-xs text-gray-500 hover:text-black underline underline-offset-2 transition-colors"
                                        >
                                            Vous avez oublié votre mot de passe ?
                                        </button>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={!isLoginValid}
                                        className={`w-full py-3 text-sm font-medium transition-colors ${isLoginValid
                                            ? 'bg-black text-white hover:bg-gray-800'
                                            : 'bg-gray-200 text-white cursor-not-allowed'
                                        }`}
                                    >
                                        Se connecter
                                    </button>

                                    <p className="text-center text-xs text-gray-500">
                                        Nouveau sur le site ?{' '}
                                        <button
                                            type="button"
                                            onClick={() => handleSwitchMode('signup')}
                                            className="text-gray-800 hover:text-black underline underline-offset-2 transition-colors"
                                        >
                                            S'inscrire
                                        </button>
                                    </p>
                                </div>
                            </form>
                        ) : (
                            // ═══════════════ SIGNUP FORM ═══════════════
                            <form onSubmit={handleSignupSubmit}>
                                <h2 className="font-serif text-3xl text-center mb-8">S'inscrire</h2>
                                <div className="space-y-5">
                                    <div>
                                        <label className="block text-sm text-gray-700 mb-1.5">Prénom</label>
                                        <input
                                            type="text"
                                            value={firstName}
                                            onChange={(e) => setFirstName(e.target.value)}
                                            className="w-full border border-gray-300 rounded-sm px-4 py-3 text-sm outline-none transition-colors focus:border-black"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm text-gray-700 mb-1.5">Adresse e-mail</label>
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full border border-gray-300 rounded-sm px-4 py-3 text-sm outline-none transition-colors focus:border-black"
                                        />
                                    </div>

                                    <div className="relative">
                                        <label className="block text-sm text-gray-700 mb-1.5">Mot de passe</label>
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="w-full border border-gray-300 rounded-sm px-4 py-3 text-sm outline-none transition-colors focus:border-black pr-10"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-[42px] text-gray-400 hover:text-gray-600 transition-colors"
                                        >
                                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                        </button>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={!isSignupValid}
                                        className={`w-full py-3 text-sm font-medium transition-colors ${isSignupValid
                                            ? 'bg-black text-white hover:bg-gray-800'
                                            : 'bg-gray-200 text-white cursor-not-allowed'
                                        }`}
                                    >
                                        S'inscrire
                                    </button>

                                    <p className="text-center text-xs text-gray-500">
                                        Déjà un compte ?{' '}
                                        <button
                                            type="button"
                                            onClick={() => handleSwitchMode('login')}
                                            className="text-gray-800 hover:text-black underline underline-offset-2 transition-colors"
                                        >
                                            Se connecter
                                        </button>
                                    </p>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    // ─────────────────────────────────────────────────────
    // MOBILE FULL-SCREEN
    // ─────────────────────────────────────────────────────
    return (
        <div className="fixed inset-0 z-[120] bg-white animate-in fade-in duration-200 flex flex-col">
            {/* Header - just close button */}
            <div className="flex justify-end px-4 pt-4 pb-2 border-b border-gray-100 flex-shrink-0">
                <button
                    onClick={handleClose}
                    className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                >
                    <X size={20} />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-8">
                {mode === 'login' ? (
                    <form onSubmit={handleLoginSubmit}>
                        <h2 className="font-serif text-3xl text-center mb-8">Se connecter</h2>
                        <div className="space-y-5">
                            <div>
                                <label className="block text-sm text-gray-700 mb-1.5">Adresse e-mail</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full border border-gray-300 rounded-sm px-4 py-3 text-sm outline-none transition-colors focus:border-black"
                                />
                            </div>

                            <div className="relative">
                                <label className="block text-sm text-gray-700 mb-1.5">Mot de passe</label>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full border border-gray-300 rounded-sm px-4 py-3 text-sm outline-none transition-colors focus:border-black pr-10"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-[42px] text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>

                            <div className="text-right">
                                <button
                                    type="button"
                                    className="text-xs text-gray-500 hover:text-black underline underline-offset-2 transition-colors"
                                >
                                    Vous avez oublié votre mot de passe ?
                                </button>
                            </div>

                            <button
                                type="submit"
                                disabled={!isLoginValid}
                                className={`w-full py-3 text-sm font-medium transition-colors ${isLoginValid
                                    ? 'bg-black text-white hover:bg-gray-800'
                                    : 'bg-gray-200 text-white cursor-not-allowed'
                                }`}
                            >
                                Se connecter
                            </button>

                            <p className="text-center text-xs text-gray-500">
                                Nouveau sur le site ?{' '}
                                <button
                                    type="button"
                                    onClick={() => handleSwitchMode('signup')}
                                    className="text-gray-800 hover:text-black underline underline-offset-2 transition-colors"
                                >
                                    S'inscrire
                                </button>
                            </p>
                        </div>
                    </form>
                ) : (
                    <form onSubmit={handleSignupSubmit}>
                        <h2 className="font-serif text-3xl text-center mb-8">S'inscrire</h2>
                        <div className="space-y-5">
                            <div>
                                <label className="block text-sm text-gray-700 mb-1.5">Prénom</label>
                                <input
                                    type="text"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    className="w-full border border-gray-300 rounded-sm px-4 py-3 text-sm outline-none transition-colors focus:border-black"
                                />
                            </div>

                            <div>
                                <label className="block text-sm text-gray-700 mb-1.5">Adresse e-mail</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full border border-gray-300 rounded-sm px-4 py-3 text-sm outline-none transition-colors focus:border-black"
                                />
                            </div>

                            <div className="relative">
                                <label className="block text-sm text-gray-700 mb-1.5">Mot de passe</label>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full border border-gray-300 rounded-sm px-4 py-3 text-sm outline-none transition-colors focus:border-black pr-10"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-[42px] text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>

                            <button
                                type="submit"
                                disabled={!isSignupValid}
                                className={`w-full py-3 text-sm font-medium transition-colors ${isSignupValid
                                    ? 'bg-black text-white hover:bg-gray-800'
                                    : 'bg-gray-200 text-white cursor-not-allowed'
                                }`}
                            >
                                S'inscrire
                            </button>

                            <p className="text-center text-xs text-gray-500">
                                Déjà un compte ?{' '}
                                <button
                                    type="button"
                                    onClick={() => handleSwitchMode('login')}
                                    className="text-gray-800 hover:text-black underline underline-offset-2 transition-colors"
                                >
                                    Se connecter
                                </button>
                            </p>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default AuthModal;
