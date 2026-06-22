import { ApiClientError } from './api-client';
import type { ApiError } from './types';

export type OfferStatus = 'PENDING' | 'ACCEPTED' | 'DECLINED' | 'COUNTER' | 'EXPIRED';

export interface StoreOffer {
  id: string;
  product_id: string;
  buyer_id: string;
  vendor_id: string;
  amount: number;
  status: OfferStatus;
  counter_amount: number | null;
  expires_at: string;
  created_at: string;
  updated_at: string;
  product: {
    title: string;
    brand: string | null;
    price: number;
    image: string | null;
  };
  shop_name: string;
  final_amount: number | null;
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

async function offerRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`/api/offers${path}`, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });
  return parseResponse<T>(res);
}

export const offersApi = {
  list: () => offerRequest<StoreOffer[]>(''),

  create: (productId: string, amount: number) =>
    offerRequest<StoreOffer>('', {
      method: 'POST',
      body: JSON.stringify({ product_id: productId, amount }),
    }),

  acceptCounter: (offerId: string) =>
    offerRequest<StoreOffer>(`/${offerId}/accept-counter`, { method: 'PATCH' }),

  declineCounter: (offerId: string) =>
    offerRequest<StoreOffer>(`/${offerId}/decline`, { method: 'PATCH' }),
};
