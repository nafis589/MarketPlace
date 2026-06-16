import type { ApiCategory, ApiProductListItem } from './homeApi';

/** Same-origin store API (proxied to backend via next.config rewrites). */
const STORE_API = '/api/store';

export interface ProductFiltersData {
  conditions: { value: string; label: string; count: number }[];
  sizes: { value: string; count: number }[];
  colors: { value: string; count: number }[];
  materials: { value: string; count: number }[];
  brands: { value: string; count: number }[];
  price: { min: number; max: number } | null;
}

const EMPTY_FILTERS: ProductFiltersData = {
  conditions: [],
  sizes: [],
  colors: [],
  materials: [],
  brands: [],
  price: null,
};

interface ApiListResponse {
  data: ApiProductListItem[];
  meta?: { total: number; page: number; limit: number; totalPages?: number };
}

async function safeFetch(url: string, init?: RequestInit): Promise<Response | null> {
  try {
    return await fetch(url, init);
  } catch {
    return null;
  }
}

export async function fetchProductsFromApi(
  query: string,
): Promise<{ products: ApiProductListItem[]; total: number; page: number; limit: number }> {
  const res = await safeFetch(`${STORE_API}/products?${query}`, { cache: 'no-store' });
  if (!res?.ok) {
    return { products: [], total: 0, page: 1, limit: 24 };
  }
  const json = (await res.json()) as ApiListResponse;
  return {
    products: json.data ?? [],
    total: json.meta?.total ?? 0,
    page: json.meta?.page ?? 1,
    limit: json.meta?.limit ?? 24,
  };
}

export async function fetchProductFiltersFromApi(
  scopeQuery: string,
): Promise<ProductFiltersData> {
  const res = await safeFetch(`${STORE_API}/products/filters?${scopeQuery}`, { cache: 'no-store' });
  if (!res?.ok) return EMPTY_FILTERS;
  try {
    const json = (await res.json()) as { data?: ProductFiltersData };
    return json.data ?? EMPTY_FILTERS;
  } catch {
    return EMPTY_FILTERS;
  }
}

export async function fetchCategoryBySlug(slug: string): Promise<ApiCategory | null> {
  const res = await safeFetch(`${STORE_API}/categories/${slug}`, { cache: 'no-store' });
  if (!res?.ok) return null;
  try {
    const json = (await res.json()) as { data?: ApiCategory };
    return json.data ?? null;
  } catch {
    return null;
  }
}
