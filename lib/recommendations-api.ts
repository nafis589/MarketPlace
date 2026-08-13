import { ApiClientError } from './api-client';
import type { ApiError } from './types';
import type { ApiProductListItem } from '@/app/lib/homeApi';

export interface RecoData {
  products: ApiProductListItem[];
  explanation: string | null;
  ai_generated: boolean;
  cached: boolean;
}

async function parseDataResponse<T>(res: Response): Promise<T> {
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

async function recommendationsRequest<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const res = await fetch(`/api/recommendations${path}`, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });
  return parseDataResponse<T>(res);
}

export const recommendationsApi = {
  getAi: async (
    params?: { limit?: number; contextProductId?: string },
    signal?: AbortSignal,
  ): Promise<RecoData | null> => {
    const search = new URLSearchParams();
    if (params?.limit) search.set('limit', String(params.limit));
    if (params?.contextProductId) search.set('context_product_id', params.contextProductId);
    const query = search.toString();

    const res = await fetch(`/api/recommendations/ai${query ? `?${query}` : ''}`, {
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      signal,
    });

    const json = (await res.json()) as
      | { data: RecoData | null; visitor?: boolean }
      | ApiError;

    if (!res.ok) {
      const err = json as ApiError;
      throw new ApiClientError(
        err.error?.code ?? 'UNKNOWN_ERROR',
        err.error?.message ?? 'Erreur serveur',
        res.status,
      );
    }

    const payload = json as { data: RecoData | null; visitor?: boolean };
    return payload.data;
  },

  postVisitor: (productIds: string[], limit?: number, signal?: AbortSignal) =>
    recommendationsRequest<RecoData>('/visitor', {
      method: 'POST',
      body: JSON.stringify({ product_ids: productIds, limit }),
      signal,
    }),

  /** Visiteur sans historique → déléguer au backend qui retourne les trending */
  getTrending: (limit?: number, signal?: AbortSignal) =>
    recommendationsRequest<RecoData>('/visitor', {
      method: 'POST',
      body: JSON.stringify({ product_ids: [], limit }),
      signal,
    }),

  syncHistory: (productIds: string[], signal?: AbortSignal) =>
    recommendationsRequest<{ synced: number }>('/sync-history', {
      method: 'POST',
      body: JSON.stringify({ product_ids: productIds }),
      signal,
    }),
};
