'use client';

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { ShoppingBag } from 'lucide-react';
import { useLockBodyScroll } from '@/hooks/useLockBodyScroll';

interface EmptyCartPopoverProps {
    isOpen: boolean;
    onClose?: () => void;
}

const EmptyCartPopover: React.FC<EmptyCartPopoverProps> = ({ isOpen, onClose }) => {
    const [mounted, setMounted] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        setMounted(true);
        const check = () => setIsMobile(window.innerWidth < 768);
        check();
        window.addEventListener('resize', check);
        return () => window.removeEventListener('resize', check);
    }, []);

    // Lock body scroll on mobile full-screen
    useLockBodyScroll(isOpen && isMobile);

    if (!isOpen) return null;

    // Contenu mobile - plein écran
    const mobileContent = (
        <div className="fixed inset-0 z-[999] flex flex-col bg-white">
            {/* Header */}
            <div className="flex items-center justify-between p-5">
                <h2 className="font-serif text-3xl text-gray-900">Panier</h2>
                <button onClick={onClose} className="text-gray-400 hover:text-black">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
            {/* Contenu centré */}
            <div className="flex-1 flex items-center justify-center px-5">
                <div className="flex flex-col items-center justify-center bg-[#F6F7F9] px-6 py-10 text-center w-full max-w-sm">
                    <div className="relative mb-4 flex items-center justify-center text-gray-600">
                        <ShoppingBag size={42} strokeWidth={1.5} className="text-gray-500" />
                        <span className="absolute mt-2 font-serif text-sm font-bold text-gray-700">V.</span>
                    </div>
                    <div className="space-y-1">
                        <p className="text-base text-gray-600 font-normal">Votre panier est vide ...</p>
                        <p className="text-base text-gray-600 font-normal">mais pas pour longtemps !</p>
                    </div>
                </div>
            </div>
        </div>
    );

    // Contenu desktop - popover dropdown
    const desktopContent = (
        <div className="absolute right-0 top-full mt-2 z-50">
            <div className="absolute -top-2 right-6 z-20 h-4 w-4 rotate-45 border-l border-t border-gray-100 bg-white" />
            <div className="relative z-10 w-full min-w-[300px] max-w-sm rounded-sm border border-gray-100 bg-white shadow-xl sm:w-[350px]">
                <div className="p-4">
                    <div className="flex flex-col items-center justify-center bg-[#F6F7F9] px-6 py-10 text-center">
                        <div className="relative mb-4 flex items-center justify-center text-gray-600">
                            <ShoppingBag size={42} strokeWidth={1.5} className="text-gray-500" />
                            <span className="absolute mt-2 font-serif text-sm font-bold text-gray-700">V.</span>
                        </div>
                        <div className="space-y-1">
                            <p className="text-base text-gray-600 font-normal">Votre panier est vide ...</p>
                            <p className="text-base text-gray-600 font-normal">mais pas pour longtemps !</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    // Sur mobile, portal vers document.body pour stack correct
    if (isMobile && mounted) {
        return createPortal(mobileContent, document.body);
    }

    // Desktop: render in-place (le dropdown positionné)
    return desktopContent;
};

export default EmptyCartPopover;
