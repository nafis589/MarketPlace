'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

import EmptyState from '@/app/components/EmptyState';
import ProductFilterControls from '@/app/components/ProductFilterControls';
import ProductGrid from '@/app/components/ProductGrid';
import { ProductListingHeader } from '@/app/components/ProductListingParts';
import { mapApiProductsToGridProducts } from '@/app/lib/mapProductGrid';
import {
  fetchCategoryBySlug,
  fetchProductFiltersFromApi,
  fetchProductsFromApi,
  type ProductFiltersData,
} from '@/app/lib/productsClient';
import { useProductFilters } from '@/hooks/useProductFilters';

interface Breadcrumb {
  label: string;
  href: string;
}

export interface ProductListingPageProps {
  title?: string;
  breadcrumbs: Breadcrumb[];
  apiExtra?: Record<string, string>;
  categorySlug?: string;
  emptyMessage?: string;
}

export default function ProductListingPage({
  title: titleProp,
  breadcrumbs,
  apiExtra = {},
  categorySlug,
  emptyMessage = 'Aucun produit trouvé.',
}: ProductListingPageProps) {
  const {
    getFilter,
    setFilter,
    setFilters,
    resetFilters,
    currentSort,
    currentPage,
    searchParams,
  } = useProductFilters();

  const [products, setProducts] = useState<ReturnType<typeof mapApiProductsToGridProducts>>([]);
  const [total, setTotal] = useState(0);
  const [limit, setLimit] = useState(24);
  const [isLoading, setIsLoading] = useState(true);
  const [filterOptions, setFilterOptions] = useState<ProductFiltersData | null>(null);
  const [resolvedTitle, setResolvedTitle] = useState(titleProp ?? '');

  const tag = searchParams.get('tag');
  const displayTitle = useMemo(() => {
    if (titleProp) return titleProp;
    if (tag === 'offer') return 'Offres exceptionnelles';
    if (tag === 'we_love') return 'We Love';
    if (resolvedTitle) return resolvedTitle;
    return 'Produits';
  }, [titleProp, tag, resolvedTitle]);

  useEffect(() => {
    if (!categorySlug || titleProp) {
      setResolvedTitle(titleProp ?? '');
      return;
    }
    let cancelled = false;
    fetchCategoryBySlug(categorySlug)
      .then((cat) => {
        if (cancelled) return;
        setResolvedTitle(
          cat?.name ?? categorySlug.charAt(0).toUpperCase() + categorySlug.slice(1),
        );
      })
      .catch(() => {
        if (cancelled) return;
        setResolvedTitle(categorySlug.charAt(0).toUpperCase() + categorySlug.slice(1));
      });
    return () => {
      cancelled = true;
    };
  }, [categorySlug, titleProp]);

  const paramsKey = searchParams.toString();
  const extraKey = JSON.stringify(apiExtra);

  const queryKey = useMemo(() => {
    const params = new URLSearchParams(paramsKey);
    if (!params.has('limit')) params.set('limit', '24');
    if (!params.has('sort')) params.set('sort', 'newest');
    const extra = JSON.parse(extraKey) as Record<string, string>;
    Object.entries(extra).forEach(([key, value]) => {
      if (!value) return;
      if (key === 'sort' && params.get('sort')) return;
      params.set(key, value);
    });
    return params.toString();
  }, [paramsKey, extraKey]);

  const scopeKey = useMemo(() => {
    const params = new URLSearchParams();
    const urlParams = new URLSearchParams(paramsKey);
    const extra = JSON.parse(extraKey) as Record<string, string>;

    const category = extra.category ?? urlParams.get('category');
    const subcategory = extra.subcategory ?? urlParams.get('subcategory');
    const tag = extra.tag ?? urlParams.get('tag');

    if (category) params.set('category', category);
    if (subcategory) params.set('subcategory', subcategory);
    if (tag) params.set('tag', tag);

    return params.toString();
  }, [paramsKey, extraKey]);

  const getFilterRef = useRef(getFilter);
  const setFiltersRef = useRef(setFilters);
  getFilterRef.current = getFilter;
  setFiltersRef.current = setFilters;

  useEffect(() => {
    let cancelled = false;

    const loadFilters = async () => {
      const options = await fetchProductFiltersFromApi(scopeKey);
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
  }, [scopeKey]);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setIsLoading(true);
      try {
        const { products: data, total: count, limit: pageLimit } = await fetchProductsFromApi(
          queryKey,
        );
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

  return (
    <>
      <ProductListingHeader
        title={displayTitle}
        total={total}
        breadcrumbs={breadcrumbs}
        isLoading={isLoading}
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
        <EmptyState message={emptyMessage} />
      )}
    </>
  );
}
