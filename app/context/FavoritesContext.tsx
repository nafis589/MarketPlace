'use client';

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import { useAuth } from './AuthContext';
import { favoritesApi, type FavoriteProduct } from '@/lib/favorites-api';

interface FavoritesContextType {
  favoriteIds: Set<string>;
  favorites: FavoriteProduct[];
  loading: boolean;
  isFavorite: (productId: string) => boolean;
  refreshFavorites: () => Promise<void>;
  toggleFavorite: (productId: string) => Promise<boolean>;
  removeFavorite: (productId: string) => Promise<void>;
  animatingId: string | null;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const { isLoggedIn, isLoading: authLoading } = useAuth();
  const [favorites, setFavorites] = useState<FavoriteProduct[]>([]);
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const [animatingId, setAnimatingId] = useState<string | null>(null);

  const refreshFavorites = useCallback(async () => {
    if (!isLoggedIn) {
      setFavorites([]);
      setFavoriteIds(new Set());
      return;
    }
    setLoading(true);
    try {
      const list = await favoritesApi.list();
      setFavorites(list);
      setFavoriteIds(new Set(list.map((f) => f.id)));
    } catch {
      setFavorites([]);
      setFavoriteIds(new Set());
    } finally {
      setLoading(false);
    }
  }, [isLoggedIn]);

  useEffect(() => {
    if (authLoading) return;
    void refreshFavorites();
  }, [authLoading, isLoggedIn, refreshFavorites]);

  const isFavorite = useCallback(
    (productId: string) => favoriteIds.has(productId),
    [favoriteIds],
  );

  const removeFavorite = useCallback(async (productId: string) => {
    await favoritesApi.remove(productId);
    setFavoriteIds((prev) => {
      const next = new Set(prev);
      next.delete(productId);
      return next;
    });
    setFavorites((prev) => prev.filter((f) => f.id !== productId));
  }, []);

  const toggleFavorite = useCallback(
    async (productId: string): Promise<boolean> => {
      setAnimatingId(productId);
      try {
        if (favoriteIds.has(productId)) {
          await favoritesApi.remove(productId);
          setFavoriteIds((prev) => {
            const next = new Set(prev);
            next.delete(productId);
            return next;
          });
          setFavorites((prev) => prev.filter((f) => f.id !== productId));
          return false;
        }

        await favoritesApi.add(productId);
        setFavoriteIds((prev) => new Set(prev).add(productId));
        void refreshFavorites();
        return true;
      } finally {
        window.setTimeout(() => setAnimatingId(null), 300);
      }
    },
    [favoriteIds, refreshFavorites],
  );

  return (
    <FavoritesContext.Provider
      value={{
        favoriteIds,
        favorites,
        loading,
        isFavorite,
        refreshFavorites,
        toggleFavorite,
        removeFavorite,
        animatingId,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
}
