import { ApiClientError } from './api-client';
import type { ApiError } from './types';

export interface CartItemVendor {
  id: string;
  shop_name: string;
  total_sales: number;
  active_products: number;
  region: string | null;
}

export interface CartItemProduct {
  title: string;
  primary_image: string | null;
  price: number;
  status: string;
  vendor: CartItemVendor;
}

export interface CartItem {
  id: string;
  product_id: string;
  quantity: number;
  price_snapshot: number;
  product: CartItemProduct;
}

export interface CartData {
  id: string;
  items: CartItem[];
  total: number;
  itemCount: number;
}

interface CartResponse {
  data: CartData;
}

async function parseResponse<T>(res: Response): Promise<T> {
  const json = (await res.json()) as T | ApiError;

  if (!res.ok) {
    const err = json as ApiError;
    throw new ApiClientError(
      err.error?.code ?? 'UNKNOWN_ERROR',
      err.error?.message ?? 'Erreur serveur',
      res.status,
    );
  }

  return json as T;
}

async function cartRequest<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const res = await fetch(`/api/cart${path}`, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });
  return parseResponse<T>(res);
}

export const cartApi = {
  getCart: () => cartRequest<CartResponse>(''),

  addItem: (productId: string, quantity = 1) =>
    cartRequest<CartResponse>('/items', {
      method: 'POST',
      body: JSON.stringify({ product_id: productId, quantity }),
    }),

  updateItem: (itemId: string, quantity: number) =>
    cartRequest<CartResponse>(`/items/${itemId}`, {
      method: 'PATCH',
      body: JSON.stringify({ quantity }),
    }),

  removeItem: (itemId: string) =>
    cartRequest<CartResponse>(`/items/${itemId}`, { method: 'DELETE' }),

  clearCart: () => cartRequest<CartResponse>('', { method: 'DELETE' }),
};

export function getLineTotal(item: CartItem): number {
  return item.price_snapshot * item.quantity;
}
