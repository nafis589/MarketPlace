'use client';

import { useCallback } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

const API_FILTER_KEYS = [
  'condition',
  'color',
  'size',
  'material',
  'brand',
  'price_min',
  'price_max',
  'sort',
  'page',
  'limit',
  'category',
  'subcategory',
  'tag',
] as const;

export function useProductFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const getFilter = (key: string) => searchParams.get(key);
  const getFilterArray = (key: string) => searchParams.getAll(key);

  const setFilter = useCallback(
    (key: string, value: string | null) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value === null || value === '') {
        params.delete(key);
      } else {
        params.set(key, value);
      }
      if (key !== 'page') {
        params.set('page', '1');
      }
      const qs = params.toString();
      router.push(qs ? `${pathname}?${qs}` : pathname);
    },
    [searchParams, pathname, router],
  );

  const setFilters = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([key, value]) => {
        if (value === null || value === '') params.delete(key);
        else params.set(key, value);
      });
      params.set('page', '1');
      const qs = params.toString();
      router.push(qs ? `${pathname}?${qs}` : pathname);
    },
    [searchParams, pathname, router],
  );

  const resetFilters = useCallback(() => {
    router.push(pathname);
  }, [pathname, router]);

  const buildApiQuery = useCallback(
    (extra?: Record<string, string>) => {
      const params = new URLSearchParams();
      API_FILTER_KEYS.forEach((key) => {
        const val = searchParams.get(key);
        if (val) params.set(key, val);
      });
      if (extra) {
        Object.entries(extra).forEach(([k, v]) => {
          if (v) params.set(k, v);
        });
      }
      if (!params.has('limit')) params.set('limit', '24');
      if (!params.has('sort')) params.set('sort', 'newest');
      return params.toString();
    },
    [searchParams],
  );

  const activeFilters = API_FILTER_KEYS.filter((key) => {
    if (key === 'page' || key === 'limit' || key === 'sort') return false;
    return Boolean(searchParams.get(key));
  }).map((key) => ({ key, value: searchParams.get(key)! }));

  return {
    getFilter,
    getFilterArray,
    setFilter,
    setFilters,
    resetFilters,
    buildApiQuery,
    activeFilters,
    currentSort: searchParams.get('sort') || 'newest',
    currentPage: parseInt(searchParams.get('page') || '1', 10),
    searchParams,
  };
}
