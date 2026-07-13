'use client';

import React, { useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Loader2, Heart } from 'lucide-react';
import ProductListingShell from '@/app/components/ProductListingShell';
import ProductGrid from '@/app/components/ProductGrid';
import { useAuth } from '@/app/context/AuthContext';
import { useUI } from '@/app/context/UIContext';
import { useFavorites } from '@/app/context/FavoritesContext';
import { formatPrice } from '@/app/utils/formatPrice';
import { PRODUCT_IMAGE_PLACEHOLDER } from '@/app/lib/mapHomeProduct';
import type { FavoriteProduct } from '@/lib/favorites-api';

const CONDITION_LABELS: Record<string, string> = {
  NEW: 'Neuf',
  VERY_GOOD: 'Très bon état',
  GOOD: 'Bon état',
  FAIR: 'État correct',
};

function mapFavoriteToCardProduct(favorite: FavoriteProduct) {
  const conditionLabel = favorite.condition
    ? (CONDITION_LABELS[favorite.condition] ?? favorite.condition)
    : '';

  return {
    id: favorite.id,
    brand: favorite.brand ?? '',
    title: favorite.title,
    image: favorite.primary_image ?? PRODUCT_IMAGE_PLACEHOLDER,
    priceLabel: formatPrice(favorite.price),
    condition: conditionLabel || favorite.size || '',
    vendorRegion: favorite.vendor_region ?? '',
    sold: favorite.status === 'SOLD',
  };
}

export default function FavorisPage() {
  const { user, isLoading: authLoading } = useAuth();
  const { openLogin } = useUI();
  const { favorites, loading, refreshFavorites } = useFavorites();

  useEffect(() => {
    if (!authLoading && !user) {
      openLogin();
    }
  }, [authLoading, user, openLogin]);

  useEffect(() => {
    if (user) {
      void refreshFavorites();
    }
  }, [user, refreshFavorites]);

  const products = useMemo(() => favorites.map(mapFavoriteToCardProduct), [favorites]);

  return (
    <ProductListingShell>
      <div className="mb-8">
        <nav className="mb-4 flex items-center gap-2 text-xs text-gray-400">
          <Link href="/" className="transition-colors hover:text-black">
            Accueil
          </Link>
          <span>/</span>
          <span className="font-medium text-black">Favoris</span>
        </nav>
        <h1 className="font-serif text-3xl font-medium tracking-tight text-gray-900 md:text-4xl">
          Mes favoris
        </h1>
      </div>

      {authLoading || (user && loading) ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      ) : products.length === 0 ? (
        <div className="rounded-xl border border-gray-200 py-16 text-center text-gray-400">
          <Heart className="mx-auto mb-3 h-10 w-10 opacity-30" />
          <p className="text-sm">Vous n&apos;avez pas encore de favoris</p>
          <Link href="/nouveautes" className="mt-4 inline-block text-sm text-black underline">
            Découvrir nos articles
          </Link>
        </div>
      ) : (
        <ProductGrid products={products} />
      )}
    </ProductListingShell>
  );
}
