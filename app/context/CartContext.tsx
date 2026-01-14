'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface CartItem {
    id: number;
    brand: string;
    type: string;
    size: string;
    price: number;
    image: string;
}

interface CartContextType {
    cartItems: CartItem[];
    addToCart: (item: any) => void;
    removeFromCart: (id: number) => void;
    isCartOpen: boolean;
    setIsCartOpen: (isOpen: boolean) => void;
    isAddModalOpen: boolean;
    setIsAddModalOpen: (isOpen: boolean) => void;
    lastAddedItem: CartItem | null;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [lastAddedItem, setLastAddedItem] = useState<CartItem | null>(null);

    const addToCart = (product: any) => {
        // Determine image source
        const image = product.image || (product.images && product.images[0]) || '';

        const newItem: CartItem = {
            id: Date.now(),
            brand: product.brand || 'Inconnu',
            type: product.category || product.type || 'Article',
            size: product.size || 'Taille unique',
            price: product.price || 0,
            image: image
        };

        setCartItems(prev => [...prev, newItem]);
        setLastAddedItem(newItem);
        setIsAddModalOpen(true);
    };

    const removeFromCart = (id: number) => {
        setCartItems(prev => prev.filter(item => item.id !== id));
    };

    return (
        <CartContext.Provider value={{
            cartItems,
            addToCart,
            removeFromCart,
            isCartOpen,
            setIsCartOpen,
            isAddModalOpen,
            setIsAddModalOpen,
            lastAddedItem
        }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}
