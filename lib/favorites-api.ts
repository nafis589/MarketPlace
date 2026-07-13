import { ApiClientError } from './api-client';
import type { ApiError } from './types';

export interface FavoriteProduct {
  id: string;
  title: string;
  price: number;
  brand: string | null;
  size: string | null;
  condition: string | null;
  status: string;
  primary_image: string | null;
  shop_name: string | null;
  vendor_region: string | null;
  favorited_at: string;
}

async function parseResponse<T>(res: Response): Promise<T> {
  const json = (await res.json()) as { data: T } | ApiError;
  if (!res.ok) {
    const err = json as ApiError;
    throw new ApiClientError(
      err.error?.code ?? 'UNKNOWN_ERROR',
      err.error?.message ?? 'Erreur serveur',
      res.status,
    );
  }
  return (json as { data: T }).data;
}

async function favoritesRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`/api/favorites${path}`, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });
  return parseResponse<T>(res);
}

export const favoritesApi = {
  list: () => favoritesRequest<FavoriteProduct[]>(''),

  add: (productId: string) =>
    favoritesRequest<{ product_id: string }>('', {
      method: 'POST',
      body: JSON.stringify({ product_id: productId }),
    }),

  remove: (productId: string) =>
    favoritesRequest<{ message: string }>(`/${productId}`, { method: 'DELETE' }),
};
