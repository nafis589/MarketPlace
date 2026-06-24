import { ApiClientError } from './api-client';
import type { ApiError } from './types';

export type NotificationType =
  | 'ORDER_NEW'
  | 'ORDER_STATUS'
  | 'OFFER_RECEIVED'
  | 'OFFER_COUNTER'
  | 'OFFER_DECLINED'
  | 'PRICE_DROP'
  | 'CART_REMINDER'
  | 'FOLLOW_NEW'
  | 'SYSTEM'
  | string;

export interface StoreNotification {
  id: string;
  user_id: string;
  type: NotificationType;
  title: string;
  body: string;
  is_read: boolean;
  metadata: Record<string, unknown> | null;
  created_at: string;
}

export interface NotificationListResponse {
  data: StoreNotification[];
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
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

async function notificationsRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`/api/notifications${path}`, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });
  return parseResponse<T>(res);
}

export const notificationsApi = {
  list: (params?: { type?: 'UPDATE'; page?: number; limit?: number }) => {
    const query = new URLSearchParams();
    if (params?.type) query.set('type', params.type);
    if (params?.page) query.set('page', String(params.page));
    if (params?.limit) query.set('limit', String(params.limit));
    const suffix = query.toString() ? `?${query.toString()}` : '';
    return notificationsRequest<NotificationListResponse>(suffix);
  },

  markRead: (id: string) =>
    notificationsRequest<{ data: { message: string } }>(`/${id}/read`, { method: 'PATCH' }),

  markAllRead: () =>
    notificationsRequest<{ data: { message: string } }>('/read-all', { method: 'PATCH' }),
};
