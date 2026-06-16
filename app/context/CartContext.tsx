'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from 'react';
import { cartApi, type CartItem } from '@/lib/cart-api';
import { useAuth } from './AuthContext';

interface CartContextType {
  items: CartItem[];
  total: number;
  count: number;
  isLoading: boolean;
  addItem: (productId: string, quantity?: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  updateQuantity: (itemId: string, qty: number) => Promise<void>;
  clearCart: () => Promise<void>;
  refresh: () => Promise<void>;
  isCartOpen: boolean;
  setIsCartOpen: (isOpen: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

function applyCartData(
  data: { items: CartItem[]; total: number; itemCount: number },
  setItems: (items: CartItem[]) => void,
  setTotal: (total: number) => void,
  setCount: (count: number) => void,
) {
  setItems(data.items);
  setTotal(data.total);
  setCount(data.itemCount);
}

export function CartProvider({ children }: { children: ReactNode }) {
  const { isLoggedIn, isLoading: authLoading } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [total, setTotal] = useState(0);
  const [count, setCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const refresh = useCallback(async () => {
    try {
      const { data } = await cartApi.getCart();
      applyCartData(data, setItems, setTotal, setCount);
    } catch {
      setItems([]);
      setTotal(0);
      setCount(0);
    }
  }, []);

  useEffect(() => {
    refresh().finally(() => setIsLoading(false));
  }, [refresh]);

  useEffect(() => {
    if (!authLoading) {
      refresh();
    }
  }, [isLoggedIn, authLoading, refresh]);

  const addItem = useCallback(
    async (productId: string, quantity = 1) => {
      const { data } = await cartApi.addItem(productId, quantity);
      applyCartData(data, setItems, setTotal, setCount);
    },
    [],
  );

  const removeItem = useCallback(async (itemId: string) => {
    const { data } = await cartApi.removeItem(itemId);
    applyCartData(data, setItems, setTotal, setCount);
  }, []);

  const updateQuantity = useCallback(async (itemId: string, qty: number) => {
    if (qty < 1) {
      const { data } = await cartApi.removeItem(itemId);
      applyCartData(data, setItems, setTotal, setCount);
      return;
    }
    const { data } = await cartApi.updateItem(itemId, qty);
    applyCartData(data, setItems, setTotal, setCount);
  }, []);

  const clearCart = useCallback(async () => {
    const { data } = await cartApi.clearCart();
    applyCartData(data, setItems, setTotal, setCount);
  }, []);

  return (
    <CartContext.Provider
      value={{
        items,
        total,
        count,
        isLoading,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        refresh,
        isCartOpen,
        setIsCartOpen,
      }}
    >
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

export type { CartItem };
