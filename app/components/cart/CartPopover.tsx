'use client';

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { X, XCircle } from 'lucide-react';
import { useCart } from '@/app/context/CartContext';

interface CartPopoverProps {
    isOpen: boolean;
    onClose: () => void;
}

const CartPopover: React.FC<CartPopoverProps> = ({ isOpen, onClose }) => {
    const { cartItems, removeFromCart } = useCart();
    const [mounted, setMounted] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        setMounted(true);
        const check = () => setIsMobile(window.innerWidth < 768);
        check();
        window.addEventListener('resize', check);
        return () => window.removeEventListener('resize', check);
    }, []);

    if (!isOpen) return null;

    const subtotal = cartItems.reduce((acc, item) => acc + item.price, 0);

    const content = (
        <div className={`
            fixed inset-0 z-[999] flex flex-col bg-white shadow-xl transition-all duration-300
            md:absolute md:inset-auto md:right-0 md:top-full md:mt-2 md:h-auto md:w-[380px] md:border md:border-gray-100 md:shadow-lg
        `}>
            {/* Header */}
            <div className="flex items-center justify-between p-5 md:pt-4 md:pb-2">
                <h2 className="font-serif text-3xl text-gray-900 md:hidden">Panier</h2>
                <div className="hidden md:block absolute -top-2 right-6 w-4 h-4 bg-white border-t border-l border-gray-100 rotate-45 transform" />
                <button onClick={onClose} className="text-gray-400 hover:text-black">
                    <X size={24} strokeWidth={1} />
                </button>
            </div>
            <div className="flex-1 overflow-y-auto px-5 py-2 md:max-h-[400px]">
                {cartItems.length === 0 ? (
                    <div className="py-10 text-center text-gray-500 text-sm">Votre panier est vide</div>
                ) : (
                    cartItems.map((item, index) => (
                        <div key={item.id} className={`flex gap-4 py-4 ${index !== cartItems.length - 1 ? 'border-b border-gray-100' : ''}`}>
                            <div className="h-20 w-16 shrink-0 bg-gray-50">
                                <img src={item.image} alt={item.brand} className="h-full w-full object-cover mix-blend-multiply" />
                            </div>
                            <div className="flex flex-1 flex-col justify-between">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="text-sm font-bold uppercase text-gray-900">{item.brand}</h3>
                                        <p className="text-sm text-gray-500">{item.type}</p>
                                        <p className="text-sm text-gray-500">{item.size}</p>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <span className="text-sm text-gray-900">${item.price}</span>
                                        <button onClick={() => removeFromCart(item.id)} className="text-gray-400 hover:text-red-500">
                                            <XCircle size={16} strokeWidth={1.5} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
            <div className="border-t border-gray-100 bg-white p-5">
                <div className="mb-4 flex items-center justify-between">
                    <span className="font-bold text-gray-900">Sous-total</span>
                    <span className="font-bold text-gray-900">${subtotal}</span>
                </div>
                <button className="mb-3 w-full bg-black py-3.5 text-sm font-bold text-white hover:opacity-90">
                    Procéder au paiement
                </button>
                <button className="w-full text-center text-sm font-medium text-gray-900 hover:underline">
                    Voir mon panier
                </button>
            </div>
        </div>
    );

    // Sur mobile, utiliser un portal vers document.body pour sortir du stacking context du <nav>
    if (isMobile && mounted) {
        return createPortal(content, document.body);
    }

    return content;
};

export default CartPopover;
