'use client';

import type { MouseEvent } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { useUI } from '@/app/context/UIContext';
import { useFavorites } from '@/app/context/FavoritesContext';
import { useToast } from '@/app/components/ui/Toast';
import { ApiClientError } from '@/lib/api-client';

export function useFavoriteToggle(productId: string) {
  const { isLoggedIn } = useAuth();
  const { openLogin } = useUI();
  const { isFavorite, toggleFavorite, animatingId } = useFavorites();
  const { showToast } = useToast();

  const handleFavoriteClick = async (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isLoggedIn) {
      openLogin();
      return;
    }
    try {
      const added = await toggleFavorite(productId);
      showToast(added ? 'Ajouté aux favoris' : 'Retiré des favoris');
    } catch (err) {
      const message =
        err instanceof ApiClientError && err.status === 403
          ? 'Les favoris sont réservés aux acheteurs'
          : 'Impossible de mettre à jour les favoris';
      showToast(message);
    }
  };

  return {
    isFavorite: isFavorite(productId),
    animating: animatingId === productId,
    handleFavoriteClick,
  };
}
