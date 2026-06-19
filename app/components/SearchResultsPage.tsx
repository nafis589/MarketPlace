'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

import EmptyState from '@/app/components/EmptyState';
import ProductFilterControls from '@/app/components/ProductFilterControls';
import ProductGrid from '@/app/components/ProductGrid';
import PopularSearches from '@/app/components/search/PopularSearches';
import { ProductListingHeader } from '@/app/components/ProductListingParts';
import { mapApiProductsToGridProducts } from '@/app/lib/mapProductGrid';
import { fetchSearchFiltersFromApi, fetchSearchResults } from '@/app/lib/search-api';
import type { ProductFiltersData } from '@/app/lib/productsClient';
import { useProductFilters } from '@/hooks/useProductFilters';
import { useRouter } from 'next/navigation';

const FILTER_KEYS = ['condition', 'color', 'size', 'material', 'brand', 'price_min', 'price_max', 'sort', 'page', 'limit'] as const;

export default function SearchResultsPage() {
  const router = useRouter();
  const {
    getFilter,
    setFilter,
    setFilters,
    currentSort,
    currentPage,
    searchParams,
  } = useProductFilters();

  const q = (searchParams.get('q') ?? '').trim();

  const [products, setProducts] = useState<ReturnType<typeof mapApiProductsToGridProducts>>([]);
  const [total, setTotal] = useState(0);
  const [limit, setLimit] = useState(24);
  const [isLoading, setIsLoading] = useState(true);
  const [filterOptions, setFilterOptions] = useState<ProductFiltersData | null>(null);

  const paramsKey = searchParams.toString();

  const queryKey = useMemo(() => {
    if (!q) return '';
    const params = new URLSearchParams();
    params.set('q', q);
    FILTER_KEYS.forEach((key) => {
      const val = searchParams.get(key);
      if (val) params.set(key, val);
    });
    if (!params.has('limit')) params.set('limit', '24');
    if (!params.has('sort')) params.set('sort', 'newest');
    return params.toString();
  }, [paramsKey, q, searchParams]);

  const getFilterRef = useRef(getFilter);
  const setFiltersRef = useRef(setFilters);
  getFilterRef.current = getFilter;
  setFiltersRef.current = setFilters;

  useEffect(() => {
    if (!q) return;
    let cancelled = false;

    const loadFilters = async () => {
      const options = await fetchSearchFiltersFromApi(q);
      if (cancelled) return;
      setFilterOptions(options);

      const read = getFilterRef.current;
      const stale: Record<string, string | null> = {};
      const condition = read('condition');
      const size = read('size');
      const color = read('color');
      const material = read('material');
      const brand = read('brand');

      if (condition && !options.conditions.some((o) => o.value === condition)) {
        stale.condition = null;
      }
      if (size && !options.sizes.some((o) => o.value === size)) stale.size = null;
      if (color && !options.colors.some((o) => o.value === color)) stale.color = null;
      if (material && !options.materials.some((o) => o.value === material)) stale.material = null;
      if (brand && !options.brands.some((o) => o.value === brand)) stale.brand = null;

      if (Object.keys(stale).length > 0) setFiltersRef.current(stale);
    };

    void loadFilters();
    return () => {
      cancelled = true;
    };
  }, [q]);

  useEffect(() => {
    if (!queryKey) {
      setProducts([]);
      setTotal(0);
      setIsLoading(false);
      return;
    }

    let cancelled = false;

    const load = async () => {
      setIsLoading(true);
      try {
        const { products: data, total: count, limit: pageLimit } = await fetchSearchResults(queryKey);
        if (cancelled) return;
        setProducts(mapApiProductsToGridProducts(data));
        setTotal(count);
        setLimit(pageLimit);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    void load();
    return () => {
      cancelled = true;
    };
  }, [queryKey]);

  const totalPages = Math.max(1, Math.ceil(total / limit));

  const handlePageChange = (page: number) => {
    setFilter('page', String(page));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetFilters = () => {
    if (!q) {
      router.push('/recherche');
      return;
    }
    router.push(`/recherche?q=${encodeURIComponent(q)}`);
  };

  const handlePopularSelect = (term: string) => {
    router.push(`/recherche?q=${encodeURIComponent(term)}`);
  };

  if (!q) {
    return (
      <EmptyState message="Entrez un terme de recherche pour commencer." />
    );
  }

  const displayTitle = isLoading
    ? `… résultats pour « ${q} »`
    : `${total} résultat${total !== 1 ? 's' : ''} pour « ${q} »`;

  return (
    <>
      <ProductListingHeader
        title={displayTitle}
        total={total}
        breadcrumbs={[
          { label: 'Accueil', href: '/' },
          { label: 'Recherche', href: '/recherche' },
        ]}
        isLoading={isLoading}
        hideResultCount
        titleClassName="normal-case"
      />

      <ProductFilterControls
        getFilter={getFilter}
        setFilter={setFilter}
        setFilters={setFilters}
        resetFilters={resetFilters}
        currentSort={currentSort}
        searchParamsKey={paramsKey}
        filterOptions={filterOptions}
      />

      {isLoading ? (
        <div className="grid grid-cols-2 border-l border-t border-gray-200 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="aspect-[3/4] animate-pulse border-r border-b border-gray-200 bg-gray-100" />
          ))}
        </div>
      ) : products.length > 0 ? (
        <ProductGrid
          products={products}
          pagination={{
            currentPage,
            totalPages,
            onPageChange: handlePageChange,
            disableNext: currentPage * limit >= total,
          }}
        />
      ) : (
        <div className="space-y-8">
          <EmptyState message={`Aucun résultat pour « ${q} »`} />
          <div className="mx-auto max-w-md">
            <PopularSearches onSelect={handlePopularSelect} />
          </div>
        </div>
      )}
    </>
  );
}
