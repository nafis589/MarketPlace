'use client';

import React, { useState } from 'react';
import { X, ChevronLeft, Check } from 'lucide-react';
import { useAuth } from '@/app/context/AuthContext';

// --- Types ---
type AuthStep = 'welcome' | 'login' | 'signup';

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
    const { login } = useAuth();
    const [step, setStep] = useState<AuthStep>('welcome');
    const [email, setEmail] = useState('');

    if (!isOpen) return null;

    const handleBack = () => {
        if (step === 'login' || step === 'signup') setStep('welcome');
    };

    const handleContinue = (e: React.FormEvent) => {
        e.preventDefault();
        // Simulation: check if email exists
        if (email.includes('test') || email.includes('login')) {
            setStep('login');
        } else {
            setStep('signup');
        }
    };

    const handleFinalSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // In a real app, we would validate credentials here
        login();
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
            {/* Modal Container */}
            <div className="relative w-full h-full bg-white sm:h-auto sm:max-w-[480px] sm:shadow-2xl overflow-y-auto">

                {/* Header Actions */}
                <div className="flex items-center justify-between p-4 border-b sm:border-none">
                    {step !== 'welcome' ? (
                        <button onClick={handleBack} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                            <ChevronLeft size={24} />
                        </button>
                    ) : (
                        <div className="w-10 h-10" />
                    )}

                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <X size={24} />
                    </button>
                </div>

                <div className="px-6 py-4 pb-12 sm:px-12">
                    {/* Welcome Step */}
                    {step === 'welcome' && (
                        <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
                            <div className="text-center">
                                <h2 className="text-3xl font-serif font-bold mb-3 tracking-tight">Bienvenue</h2>
                                <p className="text-gray-500 text-sm">Prêt(e) à découvrir des pépites ?</p>
                            </div>

                            <form onSubmit={handleContinue} className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-wider text-gray-400">EMAIL</label>
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="votre@email.com"
                                        className="w-full border-b-2 border-gray-200 py-3 text-lg focus:border-black outline-none transition-colors rounded-none px-0"
                                    />
                                </div>
                                <button type="submit" className="w-full bg-black text-white py-4 font-bold hover:bg-gray-900 transition-colors uppercase tracking-widest text-xs">
                                    Continuer
                                </button>
                            </form>

                            <div className="relative flex items-center py-4">
                                <div className="flex-grow border-t border-gray-100"></div>
                                <span className="flex-shrink mx-4 text-gray-400 text-xs uppercase font-medium">Ou continuer avec</span>
                                <div className="flex-grow border-t border-gray-100"></div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <button onClick={login} className="flex items-center justify-center gap-3 border border-gray-200 py-3 hover:bg-gray-50 transition-colors rounded-sm">
                                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                    </svg>
                                    <span className="text-sm font-semibold">Google</span>
                                </button>
                                <button onClick={login} className="flex items-center justify-center gap-3 border border-gray-200 py-3 hover:bg-gray-50 transition-colors rounded-sm text-blue-600">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                    </svg>
                                    <span className="text-sm font-semibold">Facebook</span>
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Step: Inscription */}
                    {step === 'signup' && (
                        <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
                            <div className="text-left">
                                <h2 className="text-2xl font-serif font-bold mb-2">Créez votre compte</h2>
                                <p className="text-gray-500 text-sm">Rejoignez la communauté de luxe.</p>
                            </div>

                            <form onSubmit={handleFinalSubmit} className="space-y-4">
                                <div className="space-y-4">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold uppercase text-gray-400">NOM D'UTILISATEUR</label>
                                        <input type="text" required className="w-full border-b border-gray-200 py-2 outline-none focus:border-black" />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold uppercase text-gray-400">MOT DE PASSE</label>
                                        <input type="password" required className="w-full border-b border-gray-200 py-2 outline-none focus:border-black" />
                                    </div>
                                    <div className="flex items-start gap-3 py-2">
                                        <div className="mt-1 w-5 h-5 bg-black rounded-sm flex items-center justify-center flex-shrink-0">
                                            <Check size={14} className="text-white" />
                                        </div>
                                        <p className="text-[11px] text-gray-500 leading-relaxed">
                                            En créant un compte, j'accepte les Conditions Générales et la Politique de Confidentialité de FRIPERIE LUXE.
                                        </p>
                                    </div>
                                </div>
                                <button type="submit" className="w-full bg-black text-white py-4 font-bold uppercase tracking-widest text-xs">
                                    S'inscrire
                                </button>
                            </form>
                        </div>
                    )}

                    {/* Step: Connexion */}
                    {step === 'login' && (
                        <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
                            <div className="text-left">
                                <h2 className="text-2xl font-serif font-bold mb-2">Bon retour !</h2>
                                <p className="text-gray-500 text-sm">Connectez-vous à votre compte.</p>
                            </div>

                            <form onSubmit={handleFinalSubmit} className="space-y-4">
                                <div className="space-y-4">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold uppercase text-gray-400">EMAIL</label>
                                        <input
                                            type="email"
                                            value={email}
                                            readOnly
                                            className="w-full border-b border-gray-200 py-2 outline-none bg-gray-50 cursor-not-allowed"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold uppercase text-gray-400">MOT DE PASSE</label>
                                        <div className="flex items-center">
                                            <input type="password" required className="flex-1 border-b border-gray-200 py-2 outline-none focus:border-black" />
                                            <button type="button" className="ml-2 text-[10px] font-bold underline">OUBLIÉ ?</button>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 py-2">
                                        <div className="w-5 h-5 border border-black rounded-sm flex items-center justify-center flex-shrink-0">
                                            <Check size={14} className="text-black" />
                                        </div>
                                        <span className="text-[11px] text-gray-700 font-medium">Rester connecté</span>
                                    </div>
                                </div>
                                <button type="submit" className="w-full bg-black text-white py-4 font-bold uppercase tracking-widest text-xs">
                                    Se connecter
                                </button>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AuthModal;
