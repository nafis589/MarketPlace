'use client';

import React, { useState } from 'react';
import { X, ChevronLeft, Check } from 'lucide-react';

// --- Types ---
type AuthStep = 'welcome' | 'login' | 'signup';

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
}

// --- Composants SVG pour les Logos (Google / Facebook) ---
const GoogleIcon = () => (
    <svg viewBox="0 0 24 24" className="w-5 h-5 mr-3" xmlns="http://www.w3.org/2000/svg">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
);

const FacebookIcon = () => (
    <svg viewBox="0 0 24 24" className="w-5 h-5 mr-3 text-[#1877F2]" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
);

// --- Composant Principal ---
export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
    const [step, setStep] = useState<AuthStep>('welcome');
    const [email, setEmail] = useState('');

    // Pour la démo, si on clique sur continuer avec un email rempli :
    const handleContinue = () => {
        // Dans une vraie app, on ferait un appel API pour vérifier si l'email existe
        // Ici, on simule : si l'email contient 'test', on va sur login, sinon signup
        if (email.includes('test') || email.includes('login')) {
            setStep('login'); // Simule un compte existant
        } else {
            setStep('signup'); // Simule un nouveau compte (défaut)
        }
    };

    if (!isOpen) return null;

    return (
        // Overlay: Transparent/Grisé sur PC, inexistant sur mobile pour que la modal prenne tout l'espace
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-white md:bg-black/50 md:backdrop-blur-[2px] transition-all">

            {/* Conteneur Modal : Plein écran sur mobile (h-full w-full), Centré et limité sur PC */}
            <div className="relative flex h-full w-full flex-col bg-white md:h-auto md:max-h-[90vh] md:w-[480px] md:shadow-2xl md:animate-in md:zoom-in-95 overflow-y-auto">

                {/* Header Navigation (Retour & Fermer) */}
                <div className="flex items-center justify-between p-4 md:p-6">
                    {step !== 'welcome' ? (
                        <button
                            onClick={() => setStep('welcome')}
                            className="flex items-center text-sm text-gray-500 hover:text-black transition-colors"
                        >
                            <ChevronLeft size={20} className="mr-1" />
                            Retour
                        </button>
                    ) : (
                        <div /> /* Spacer pour garder le X à droite */
                    )}

                    <button onClick={onClose} className="text-gray-400 hover:text-black transition-colors">
                        <X size={28} strokeWidth={1} />
                    </button>
                </div>

                {/* Contenu Dynamique */}
                <div className="flex-1 px-6 pb-10 pt-2 md:px-12 font-sans">

                    {/* --- Vue 1: WELCOME --- */}
                    {step === 'welcome' && (
                        <div className="flex flex-col items-center animate-in fade-in slide-in-from-right-4 duration-300">
                            <h2 className="mb-4 text-center font-serif text-3xl md:text-4xl text-gray-900 leading-tight">
                                Bienvenue chez Friperie Luxe !
                            </h2>
                            <p className="mb-8 text-center text-sm text-gray-500">
                                Inscrivez-vous ou connectez-vous pour continuer.
                            </p>

                            {/* Promo Box */}
                            <div className="mb-8 w-full bg-[#FFF8F2] p-4 text-center text-sm text-gray-800">
                                Utilisez le code WELCOMLUX pour -10% sur votre première commande. <span className="text-gray-500 underline cursor-pointer">Conditions</span>
                            </div>

                            {/* Social Buttons */}
                            <div className="flex w-full flex-col gap-3">
                                <button className="flex w-full items-center justify-center border border-black py-3 text-sm font-bold text-gray-900 hover:bg-gray-50 transition-colors">
                                    <GoogleIcon />
                                    Continuer avec Google
                                </button>
                                <button className="flex w-full items-center justify-center border border-black py-3 text-sm font-bold text-gray-900 hover:bg-gray-50 transition-colors">
                                    <FacebookIcon />
                                    Continuer avec Facebook
                                </button>
                            </div>

                            {/* Divider */}
                            <div className="my-6 flex w-full items-center">
                                <div className="h-px flex-1 bg-gray-200"></div>
                                <span className="px-4 text-xs text-gray-500">ou</span>
                                <div className="h-px flex-1 bg-gray-200"></div>
                            </div>

                            {/* Email Form */}
                            <div className="w-full">
                                <label className="mb-1 block text-sm text-gray-500">Email</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="votreemail@gmail.com"
                                    className="mb-6 w-full border border-gray-300 p-3 text-gray-900 focus:border-black focus:outline-none placeholder:text-gray-400"
                                />
                                <button
                                    onClick={handleContinue}
                                    className="w-full bg-black py-3.5 text-sm font-bold text-white hover:opacity-90 transition-opacity"
                                >
                                    Continuer
                                </button>
                            </div>

                            <div className="mt-8 text-center text-xs text-gray-500">
                                En continuant, vous acceptez notre Politique de Confidentialité
                            </div>
                        </div>
                    )}

                    {/* --- Vue 2: INSCRIPTION (Sign Up) --- */}
                    {step === 'signup' && (
                        <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                            <h2 className="mb-8 font-serif text-3xl md:text-4xl text-gray-900 text-center md:text-left">
                                S'inscrire
                            </h2>

                            <div className="flex flex-col gap-5">
                                <div>
                                    <label className="mb-1 block text-sm text-gray-500">Prénom</label>
                                    <input type="text" className="w-full border border-gray-300 p-3 focus:border-black focus:outline-none" />
                                </div>

                                <div>
                                    <label className="mb-1 block text-sm text-gray-500">Email</label>
                                    {/* Champ grisé comme sur la maquette */}
                                    <input
                                        type="email"
                                        value={email}
                                        readOnly
                                        className="w-full border border-gray-300 bg-gray-100 p-3 text-gray-500 focus:outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="mb-1 block text-sm text-gray-500">Mot de passe</label>
                                    <input type="password" className="w-full border border-gray-300 p-3 focus:border-black focus:outline-none" />
                                </div>

                                <div className="flex items-start gap-3 mt-2">
                                    <div className="relative flex items-center">
                                        <input type="checkbox" id="marketing" className="peer h-5 w-5 appearance-none border border-gray-300 checked:bg-black checked:border-black" />
                                        <Check size={14} className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 peer-checked:opacity-100" />
                                    </div>
                                    <label htmlFor="marketing" className="text-sm text-gray-900 font-medium leading-tight select-none">
                                        Inscrivez-vous pour profiter de réductions et de sélections personnalisées par email.
                                    </label>
                                </div>

                                <p className="mt-2 text-sm text-gray-600">
                                    En m'inscrivant, j'accepte les <span className="underline decoration-gray-400">Conditions générales d'utilisation</span> et la <span className="underline decoration-gray-400">Politique de Confidentialité</span> de Friperie Luxe.<br />
                                    Nous protégeons vos données
                                </p>

                                <button className="mt-4 w-full bg-[#333333] py-3.5 text-sm font-bold text-white hover:bg-black transition-colors">
                                    S'inscrire
                                </button>
                            </div>
                        </div>
                    )}

                    {/* --- Vue 3: CONNEXION (Login) --- */}
                    {step === 'login' && (
                        <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                            <h2 className="mb-8 font-serif text-3xl md:text-4xl text-gray-900 text-center md:text-left">
                                Se connecter
                            </h2>

                            <div className="flex flex-col gap-6">
                                <div>
                                    <label className="mb-1 block text-sm text-gray-500">Email</label>
                                    <input
                                        type="email"
                                        value={email}
                                        readOnly
                                        className="w-full border border-gray-300 bg-gray-100 p-3 text-gray-500 focus:outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="mb-1 block text-sm text-gray-500">Mot de passe</label>
                                    <input type="password" className="w-full border border-gray-300 p-3 focus:border-black focus:outline-none" />
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="relative flex items-center">
                                            <input type="checkbox" id="stay-connected" className="peer h-5 w-5 appearance-none border border-gray-300 checked:bg-black checked:border-black" />
                                            <Check size={14} className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 peer-checked:opacity-100" />
                                        </div>
                                        <label htmlFor="stay-connected" className="text-sm text-gray-800 select-none">Rester connecté·e</label>
                                    </div>

                                    <a href="#" className="text-xs text-gray-800 underline decoration-gray-400 hover:text-gray-600">
                                        Vous avez oublié votre mot de passe ?
                                    </a>
                                </div>

                                <button className="mt-6 w-full bg-[#333333] py-3.5 text-sm font-bold text-white hover:bg-black transition-colors">
                                    Se connecter
                                </button>
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
}
