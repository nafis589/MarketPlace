import type { ApiProductListItem } from './homeApi';

const VENDOR_API = '/api/vendors';

export interface VendorProfile {
  id: string;
  shop_name: string;
  shop_logo: string | null;
  shop_banner: string | null;
  rating: number;
  total_sales: number;
  followers_count: number;
  following_count: number;
  member_since: string;
  region: string | null;
  description: string | null;
}

export interface VendorProductsResult {
  products: ApiProductListItem[];
  total: number;
  page: number;
  limit: number;
}

async function safeFetch(url: string, init?: RequestInit): Promise<Response | null> {
  try {
    return await fetch(url, { credentials: 'include', cache: 'no-store', ...init });
  } catch {
    return null;
  }
}

export async function fetchVendorProfile(id: string): Promise<VendorProfile | null> {
  const res = await safeFetch(`${VENDOR_API}/${id}`);
  if (!res?.ok) return null;
  try {
    const json = (await res.json()) as { data?: VendorProfile };
    return json.data ?? null;
  } catch {
    return null;
  }
}

export async function fetchVendorProducts(
  id: string,
  status: 'ACTIVE' | 'SOLD',
  page = 1,
  limit = 24,
): Promise<VendorProductsResult> {
  const params = new URLSearchParams({
    status,
    page: String(page),
    limit: String(limit),
  });
  const res = await safeFetch(`${VENDOR_API}/${id}/products?${params.toString()}`);
  if (!res?.ok) {
    return { products: [], total: 0, page, limit };
  }
  try {
    const json = (await res.json()) as {
      data?: ApiProductListItem[];
      meta?: { total: number; page: number; limit: number };
    };
    return {
      products: json.data ?? [],
      total: json.meta?.total ?? 0,
      page: json.meta?.page ?? page,
      limit: json.meta?.limit ?? limit,
    };
  } catch {
    return { products: [], total: 0, page, limit };
  }
}

export async function fetchFollowStatus(id: string): Promise<boolean> {
  const res = await safeFetch(`${VENDOR_API}/${id}/follow-status`);
  if (!res?.ok) return false;
  try {
    const json = (await res.json()) as { data?: { isFollowing?: boolean } };
    return Boolean(json.data?.isFollowing);
  } catch {
    return false;
  }
}

export interface FollowResult {
  isFollowing: boolean;
  followers_count: number;
}

export async function followVendor(id: string): Promise<FollowResult | null> {
  const res = await safeFetch(`${VENDOR_API}/${id}/follow`, { method: 'POST' });
  if (!res?.ok) return null;
  try {
    const json = (await res.json()) as { data?: FollowResult };
    return json.data ?? null;
  } catch {
    return null;
  }
}

export async function unfollowVendor(id: string): Promise<FollowResult | null> {
  const res = await safeFetch(`${VENDOR_API}/${id}/follow`, { method: 'DELETE' });
  if (!res?.ok) return null;
  try {
    const json = (await res.json()) as { data?: FollowResult };
    return json.data ?? null;
  } catch {
    return null;
  }
}
