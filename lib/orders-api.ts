import { ApiClientError } from './api-client';
import type { ApiError } from './types';
import type { ShippingMethod } from './types';

export type OrderStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'PREPARING'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'CANCELLED'
  | 'RETURNED';

export interface ShippingAddress {
  first_name: string;
  last_name: string;
  phone: string;
  notes?: string | null;
  latitude: number;
  longitude: number;
  region_id: string;
  address_label?: string | null;
}

export interface OrderItemSnapshot {
  title: string;
  image: string | null;
  brand: string | null;
}

export interface StoreOrderItem {
  id: string;
  order_id: string;
  product_id: string | null;
  quantity: number;
  unit_price: number;
  offer_id: string | null;
  original_price: number | null;
  product_snapshot: OrderItemSnapshot;
}

export interface OrderVendorSummary {
  id: string;
  shop_name: string;
}

export interface StoreOrder {
  id: string;
  buyer_id: string;
  vendor_id: string;
  status: OrderStatus;
  total_amount: number;
  shipping_fee: number;
  payment_method: string;
  shipping_address: ShippingAddress;
  shipping_region_id: string;
  shipping_method: ShippingMethod;
  shipping_distance_km: number | null;
  tracking_number: string | null;
  created_at: string;
  updated_at: string;
}

export interface StoreOrderDetail extends StoreOrder {
  items: StoreOrderItem[];
  status_history: Array<{
    id: string;
    order_id: string;
    status: OrderStatus;
    note: string | null;
    created_by: string;
    created_at: string;
  }>;
  vendor: OrderVendorSummary;
}

export interface PlaceOrderPayload {
  payment_method: 'CASH_ON_DELIVERY' | 'BANK_TRANSFER';
  shipping_address: ShippingAddress;
  shipping_fee: number;
  shipping_method: ShippingMethod;
  shipping_distance_km?: number | null;
}

interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

async function parseResponse<T>(res: Response): Promise<T> {
  const json = (await res.json()) as T | ApiError;
  if (!res.ok) {
    const err = json as ApiError;
    let message = err.error?.message ?? 'Erreur serveur';

    if (err.error?.code === 'VALIDATION_ERROR' && err.error.details) {
      const details = err.error.details as Record<string, string[] | undefined>;
      const fieldMessages = Object.entries(details)
        .flatMap(([field, messages]) =>
          (messages ?? []).map((msg) => `${field}: ${msg}`),
        )
        .join(' · ');
      if (fieldMessages) message = fieldMessages;
    }

    throw new ApiClientError(err.error?.code ?? 'UNKNOWN_ERROR', message, res.status);
  }
  return json as T;
}

async function orderRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`/api/orders${path}`, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });
  return parseResponse<T>(res);
}

export const ordersApi = {
  placeOrder: (body: PlaceOrderPayload) =>
    orderRequest<{ data: { orders: StoreOrder[] } }>('', {
      method: 'POST',
      body: JSON.stringify(body),
    }),

  listOrders: (params?: { status?: OrderStatus; page?: number; limit?: number }) => {
    const search = new URLSearchParams();
    if (params?.status) search.set('status', params.status);
    if (params?.page) search.set('page', String(params.page));
    if (params?.limit) search.set('limit', String(params.limit));
    const qs = search.toString();
    return orderRequest<{ data: StoreOrder[]; meta: PaginationMeta }>(
      qs ? `?${qs}` : '',
    );
  },

  getOrder: (id: string) =>
    orderRequest<{ data: StoreOrderDetail }>(`/${id}`),

  cancelOrder: (id: string) =>
    orderRequest<{ data: StoreOrder }>(`/${id}/cancel`, { method: 'POST' }),
};
