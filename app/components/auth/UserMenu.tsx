'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import { useLockBodyScroll } from '@/hooks/useLockBodyScroll';

const menuItems = [
    { label: 'Mon profil', href: '/profil' },
    { label: 'Mes offres', href: '/compte/offres' },
    { label: 'Messages', href: '/messages' },
    { label: 'Paramètres', href: '/parametres' },
    { label: 'Mes commandes', href: '/commandes' },
];

interface UserMenuProps {
    variant: 'desktop' | 'mobile';
}

const UserMenu: React.FC<UserMenuProps> = ({ variant }) => {
    const { user, logout, isUserMenuOpen, closeUserMenu } = useAuth();
    const router = useRouter();
    const menuRef = useRef<HTMLDivElement>(null);
    const [isMobile, setIsMobile] = useState(false);

    const isActiveVariant = variant === 'mobile' ? isMobile : !isMobile;

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 1024);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Close on click outside — only for the active variant instance
    useEffect(() => {
        if (!isUserMenuOpen || !isActiveVariant || isMobile) return;

        const handleClickOutside = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                closeUserMenu();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isUserMenuOpen, isActiveVariant, isMobile, closeUserMenu]);

    useEffect(() => {
        if (!isUserMenuOpen || !isActiveVariant) return;
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') closeUserMenu();
        };
        document.addEventListener('keydown', handleEsc);
        return () => document.removeEventListener('keydown', handleEsc);
    }, [isUserMenuOpen, isActiveVariant, closeUserMenu]);

    useLockBodyScroll(isUserMenuOpen && isActiveVariant && isMobile);

    if (!isUserMenuOpen || !isActiveVariant) return null;

    const handleNavigate = (href: string) => {
        closeUserMenu();
        router.push(href);
    };

    const handleLogout = async () => {
        closeUserMenu();
        await logout();
    };

    // --- Mobile Full-Screen ---
    if (isMobile) {
        return (
            <div className="fixed inset-0 z-50 bg-white flex flex-col">
                <div className="flex justify-end px-4 pt-4">
                    <button
                        onClick={closeUserMenu}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        aria-label="Fermer"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="px-6 pt-4 pb-6 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gray-200 text-gray-700 flex items-center justify-center flex-shrink-0">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                        </svg>
                    </div>
                    <p className="text-2xl font-serif font-medium">{user?.first_name || 'Utilisateur'}</p>
                </div>

                <div>
                    {menuItems.map((item) => (
                        <button
                            key={item.label}
                            type="button"
                            onClick={() => handleNavigate(item.href)}
                            className="flex items-center w-full px-6 py-4 hover:bg-gray-50 transition-colors text-left"
                        >
                            <span className="text-sm font-medium">{item.label}</span>
                        </button>
                    ))}
                </div>

                <div className="px-6 pt-2 pb-8">
                    <button
                        type="button"
                        onClick={() => void handleLogout()}
                        className="flex items-center w-full py-3 text-gray-900 hover:text-black transition-colors"
                    >
                        <span className="text-sm font-medium">Déconnexion</span>
                    </button>
                </div>
            </div>
        );
    }

    // --- Desktop Dropdown ---
    return (
        <div
            ref={menuRef}
            className="absolute top-full right-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-xl z-[60] py-2"
        >
            <div className="px-4 py-4">
                <p className="text-lg font-serif font-medium">{user?.first_name || 'Utilisateur'}</p>
            </div>

            {menuItems.map((item) => (
                <button
                    key={item.label}
                    type="button"
                    onClick={() => handleNavigate(item.href)}
                    className="flex items-center w-full px-4 py-3 hover:bg-gray-50 transition-colors text-sm text-left"
                >
                    <span className="font-medium">{item.label}</span>
                </button>
            ))}

            <button
                type="button"
                onClick={() => void handleLogout()}
                className="flex items-center px-4 py-3 hover:bg-gray-50 transition-colors text-sm text-gray-900 hover:text-black w-full"
            >
                <span className="font-medium">Déconnexion</span>
            </button>
        </div>
    );
};

export default UserMenu;
