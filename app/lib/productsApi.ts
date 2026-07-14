import type { ApiProductListItem } from './homeApi';
import { API_URL, fetchProductsList, safeServerFetch } from './homeApi';

export interface ApiProductDetail extends ApiProductListItem {
  vendor_id: string;
  description: string | null;
  category_id: string | null;
  material: string | null;
  color: string | null;
  status: string;
  views_count: number;
  created_at: string;
  images: { id: string; url: string; position: number; is_primary: boolean }[];
  vendor: { shop_name: string; shop_logo: string | null; rating: number; total_sales: number };
  vendor_region?: string | null;
  category_path?: {
    universe: string | null;
    category: string | null;
    subcategory: string | null;
  };
  reviews: { id: string; rating: number; comment: string | null }[];
}

export async function fetchProductById(id: string): Promise<ApiProductDetail | null> {
  const res = await safeServerFetch(`${API_URL}/api/store/products/${id}`, {
    next: { revalidate: 300 },
  });
  if (!res?.ok) return null;
  try {
    const json = (await res.json()) as { data?: ApiProductDetail };
    return json.data ?? null;
  } catch {
    return null;
  }
}

export type ProductListParams = Record<string, string | number | undefined>;

export { fetchProductsList };

export async function fetchCategoryProductsBySlug(
  slug: string,
  params: ProductListParams = {},
): Promise<{ products: ApiProductListItem[]; total: number }> {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== '') search.set(key, String(value));
  }
  const qs = search.toString();
  const res = await safeServerFetch(
    `${API_URL}/api/store/categories/${slug}/products${qs ? `?${qs}` : ''}`,
    { next: { revalidate: 900 } },
  );
  if (!res?.ok) return { products: [], total: 0 };
  try {
    const json = (await res.json()) as { data?: ApiProductListItem[]; meta?: { total: number } };
    return { products: json.data ?? [], total: json.meta?.total ?? 0 };
  } catch {
    return { products: [], total: 0 };
  }
}
