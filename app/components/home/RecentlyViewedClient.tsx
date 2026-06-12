'use client';

import React, { useEffect, useState } from 'react';
import RecentlyViewed from '../sections/RecentlyViewed';
import type { Product } from '../ui/HomeProductSection';
import { API_URL } from '@/app/lib/homeApi';
import { mapApiProductsToHomeProducts } from '@/app/lib/mapHomeProduct';

const STORAGE_KEY = 'recently_viewed';

export default function RecentlyViewedClient() {
  const [products, setProducts] = useState<Product[] | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadRecentlyViewed() {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        const ids: string[] = raw ? (JSON.parse(raw) as string[]) : [];
        if (ids.length === 0) {
          if (!cancelled) setProducts([]);
          return;
        }

        const params = new URLSearchParams({
          ids: ids.join(','),
          limit: '10',
        });

        const res = await fetch(`${API_URL}/api/store/products?${params.toString()}`);
        if (!res.ok) {
          if (!cancelled) setProducts([]);
          return;
        }

        const json = (await res.json()) as { data: Parameters<typeof mapApiProductsToHomeProducts>[0] };
        const mapped = mapApiProductsToHomeProducts(json.data ?? []);
        if (!cancelled) setProducts(mapped);
      } catch {
        if (!cancelled) setProducts([]);
      }
    }

    void loadRecentlyViewed();

    return () => {
      cancelled = true;
    };
  }, []);

  if (products === null || products.length === 0) return null;

  return <RecentlyViewed products={products} />;
}
