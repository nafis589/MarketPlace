import type { ApiProductListItem } from './homeApi';
import type { ProductFiltersData } from './productsClient';

const STORE_API = '/api/store';

export type SearchSuggestionType = 'query' | 'brand' | 'category';

export interface SearchSuggestion {
  type: SearchSuggestionType;
  label: string;
  count: number;
}

async function safeFetch(url: string): Promise<Response | null> {
  try {
    return await fetch(url, { cache: 'no-store' });
  } catch {
    return null;
  }
}

export async function fetchPopularSearches(): Promise<string[]> {
  const res = await safeFetch(`${STORE_API}/search/popular`);
  if (!res?.ok) return [];
  try {
    const json = (await res.json()) as { data?: string[] };
    return json.data ?? [];
  } catch {
    return [];
  }
}

const VALID_SUGGESTION_TYPES: SearchSuggestionType[] = ['query', 'brand', 'category'];

export async function fetchSearchSuggestions(q: string): Promise<SearchSuggestion[]> {
  const params = new URLSearchParams({
    q,
    limit: '8',
    suggest: 'true',
  });
  const res = await safeFetch(`${STORE_API}/search?${params.toString()}`);
  if (!res?.ok) return [];
  try {
    const json = (await res.json()) as { data?: unknown };
    if (!Array.isArray(json.data)) return [];
    return json.data
      .filter(
        (item): item is SearchSuggestion =>
          !!item &&
          typeof item === 'object' &&
          typeof (item as SearchSuggestion).label === 'string' &&
          VALID_SUGGESTION_TYPES.includes((item as SearchSuggestion).type),
      )
      .map((item) => ({
        type: item.type,
        label: item.label,
        count: Number((item as SearchSuggestion).count) || 0,
      }));
  } catch {
    return [];
  }
}

export async function fetchSearchResults(
  query: string,
): Promise<{ products: ApiProductListItem[]; total: number; page: number; limit: number }> {
  const res = await safeFetch(`${STORE_API}/search?${query}`);
  if (!res?.ok) {
    return { products: [], total: 0, page: 1, limit: 24 };
  }
  try {
    const json = (await res.json()) as {
      data?: ApiProductListItem[];
      meta?: { total: number; page: number; limit: number };
    };
    return {
      products: json.data ?? [],
      total: json.meta?.total ?? 0,
      page: json.meta?.page ?? 1,
      limit: json.meta?.limit ?? 24,
    };
  } catch {
    return { products: [], total: 0, page: 1, limit: 24 };
  }
}

export async function fetchSearchFiltersFromApi(q: string): Promise<ProductFiltersData> {
  const params = new URLSearchParams({ q });
  const res = await safeFetch(`${STORE_API}/search/filters?${params.toString()}`);
  if (!res?.ok) {
    return {
      conditions: [],
      sizes: [],
      colors: [],
      materials: [],
      brands: [],
      price: null,
    };
  }
  try {
    const json = (await res.json()) as { data?: ProductFiltersData };
    return (
      json.data ?? {
        conditions: [],
        sizes: [],
        colors: [],
        materials: [],
        brands: [],
        price: null,
      }
    );
  } catch {
    return {
      conditions: [],
      sizes: [],
      colors: [],
      materials: [],
      brands: [],
      price: null,
    };
  }
}
