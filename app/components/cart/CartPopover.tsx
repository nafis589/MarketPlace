'use client';

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/navigation';
import { X, Minus, Plus } from 'lucide-react';
import { useCart } from '@/app/context/CartContext';
import { useLockBodyScroll } from '@/hooks/useLockBodyScroll';
import { formatPrice } from '@/app/utils/formatPrice';
import { getLineTotal } from '@/lib/cart-api';
import { PRODUCT_IMAGE_PLACEHOLDER } from '@/app/lib/mapHomeProduct';

interface CartPopoverProps {
    isOpen: boolean;
    onClose: () => void;
}

const CartPopover: React.FC<CartPopoverProps> = ({ isOpen, onClose }) => {
    const router = useRouter();
    const { items, total, updateQuantity, removeItem } = useCart();
    const [mounted, setMounted] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        setMounted(true);
        const check = () => setIsMobile(window.innerWidth < 768);
        check();
        window.addEventListener('resize', check);
        return () => window.removeEventListener('resize', check);
    }, []);

    useLockBodyScroll(isOpen && isMobile);

    if (!isOpen) return null;

    const handleCheckout = () => {
        onClose();
        router.push('/checkout');
    };

    const content = (
        <div className={`
            fixed inset-0 z-[999] flex flex-col bg-white shadow-xl transition-all duration-300
            md:absolute md:inset-auto md:right-0 md:top-full md:mt-2 md:h-auto md:w-[380px] md:border md:border-gray-100 md:shadow-lg
        `}>
            <div className="flex items-center justify-between p-5 md:pt-4 md:pb-2">
                <h2 className="font-serif text-3xl text-gray-900 md:hidden">Panier</h2>
                <div className="hidden md:block absolute -top-2 right-6 w-4 h-4 bg-white border-t border-l border-gray-100 rotate-45 transform" />
                <button onClick={onClose} className="text-gray-400 hover:text-black">
                    <X size={24} strokeWidth={1} />
                </button>
            </div>
            <div className="flex-1 overflow-y-auto px-5 py-2 md:max-h-[400px]">
                {items.length === 0 ? (
                    <div className="py-10 text-center text-gray-500 text-sm">Votre panier est vide</div>
                ) : (
                    items.map((item, index) => (
                        <div key={item.id} className={`flex gap-4 py-4 ${index !== items.length - 1 ? 'border-b border-gray-100' : ''}`}>
                            <div className="h-20 w-16 shrink-0 bg-gray-50">
                                <img
                                    src={item.product.primary_image || PRODUCT_IMAGE_PLACEHOLDER}
                                    alt={item.product.title}
                                    className="h-full w-full object-cover mix-blend-multiply"
                                />
                            </div>
                            <div className="flex flex-1 flex-col justify-between min-w-0">
                                <div className="flex justify-between items-start gap-2">
                                    <div className="min-w-0">
                                        <h3 className="text-sm font-bold text-gray-900 truncate">{item.product.title}</h3>
                                        <p className="text-sm text-gray-500 mt-0.5">{formatPrice(item.price_snapshot)}</p>
                                    </div>
                                    <button
                                        onClick={() => removeItem(item.id)}
                                        className="text-gray-400 hover:text-red-500 shrink-0"
                                        aria-label="Supprimer"
                                    >
                                        🗑
                                    </button>
                                </div>
                                <div className="flex items-center justify-between mt-2">
                                    <div className="flex items-center border border-gray-200">
                                        <button
                                            type="button"
                                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                            className="p-1.5 hover:bg-gray-50 text-gray-600"
                                            aria-label="Diminuer la quantité"
                                        >
                                            <Minus size={14} />
                                        </button>
                                        <span className="px-3 text-sm font-medium min-w-[2rem] text-center">{item.quantity}</span>
                                        <button
                                            type="button"
                                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                            className="p-1.5 hover:bg-gray-50 text-gray-600"
                                            aria-label="Augmenter la quantité"
                                        >
                                            <Plus size={14} />
                                        </button>
                                    </div>
                                    <span className="text-sm font-bold text-gray-900">{formatPrice(getLineTotal(item))}</span>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
            <div className="border-t border-gray-100 bg-white p-5">
                <div className="mb-4 flex items-center justify-between">
                    <span className="font-bold text-gray-900">Total</span>
                    <span className="font-bold text-gray-900">{formatPrice(total)}</span>
                </div>
                {items.length > 0 && (
                    <button
                        type="button"
                        onClick={handleCheckout}
                        className="w-full bg-black py-3.5 text-sm font-bold text-white hover:opacity-90"
                    >
                        Commander
                    </button>
                )}
            </div>
        </div>
    );

    if (isMobile && mounted) {
        return createPortal(content, document.body);
    }

    return content;
};

export default CartPopover;
