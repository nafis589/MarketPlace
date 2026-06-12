export const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? process.env.API_URL ?? 'http://localhost:9000';

/** Server-side fetch that never throws — returns null on network errors. */
export async function safeServerFetch(
  url: string,
  init?: RequestInit,
): Promise<Response | null> {
  try {
    return await fetch(url, init);
  } catch {
    return null;
  }
}

export interface ApiCategory {
  id: string;
  name: string;
  slug: string;
  parent_id: string | null;
  image_url: string | null;
  children?: ApiCategory[];
}

export interface ApiProductListItem {
  id: string;
  title: string;
  price: number;
  brand: string | null;
  size: string | null;
  condition: string | null;
  primary_image: string | null;
  shop_name?: string | null;
  vendor_region?: string | null;
}

interface ApiListResponse {
  data: ApiProductListItem[];
  meta?: { total: number; page: number; limit: number };
}

interface ApiCategoriesResponse {
  data: ApiCategory[];
}

export async function safeFetchJson<T>(url: string, init?: RequestInit): Promise<T | null> {
  const res = await safeServerFetch(url, init);
  if (!res?.ok) return null;
  try {
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

export async function fetchRootCategories(): Promise<ApiCategory[]> {
  const json = await safeFetchJson<ApiCategoriesResponse>(`${API_URL}/api/store/categories`, {
    next: { revalidate: 3600 },
  });
  if (!json?.data?.length) return [];
  return json.data.filter((c) => c.parent_id === null);
}

export async function fetchProductsList(
  params: Record<string, string | number | undefined>,
  revalidate = 900,
): Promise<ApiProductListItem[]> {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== '') {
      search.set(key, String(value));
    }
  }
  const json = await safeFetchJson<ApiListResponse>(
    `${API_URL}/api/store/products?${search.toString()}`,
    { next: { revalidate } },
  );
  return json?.data ?? [];
}

export async function fetchTrendingProducts(): Promise<ApiProductListItem[]> {
  const json = await safeFetchJson<{ data: ApiProductListItem[] }>(
    `${API_URL}/api/store/trending`,
    { next: { revalidate: 3600 } },
  );
  return json?.data ?? [];
}

export async function fetchTaggedProducts(
  tag: 'offer' | 'we_love',
  fallback: Record<string, string | number>,
): Promise<ApiProductListItem[]> {
  const tagged = await fetchProductsList({ ...fallback, tag, limit: 10 }, 1800);
  if (tagged.length > 0) return tagged;
  return fetchProductsList({ ...fallback, limit: 10 });
}
