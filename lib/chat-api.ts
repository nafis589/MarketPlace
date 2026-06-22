import { ApiClientError } from './api-client';
import type { ApiError } from './types';

export type MessageType = 'TEXT' | 'OFFER' | 'SYSTEM';

export interface ChatCounterpart {
  name: string;
  username: string;
  avatar: string | null;
}

export interface ChatProduct {
  id: string;
  title: string;
  brand: string | null;
  condition: string | null;
  price: number | null;
  image: string | null;
}

export interface ChatConversation {
  id: string;
  role: 'buyer' | 'vendor';
  counterpart: ChatCounterpart;
  product: ChatProduct | null;
  last_message: {
    content: string;
    sender_id: string;
    type: string;
    created_at: string;
  } | null;
  last_message_at: string | null;
  unread_count: number;
  created_at: string;
}

export interface ChatMessage {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  type: MessageType;
  is_read: boolean;
  mine: boolean;
  created_at: string;
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

async function chatRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`/api/chat${path}`, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });
  return parseResponse<T>(res);
}

export const chatApi = {
  listConversations: () => chatRequest<ChatConversation[]>(''),

  createConversation: (vendorId: string, productId?: string | null) =>
    chatRequest<ChatConversation>('', {
      method: 'POST',
      body: JSON.stringify({ vendor_id: vendorId, product_id: productId ?? undefined }),
    }),

  getMessages: (conversationId: string) =>
    chatRequest<{ conversation: ChatConversation; messages: ChatMessage[] }>(
      `/${conversationId}/messages`,
    ),

  sendMessage: (conversationId: string, content: string, type: 'TEXT' | 'OFFER' = 'TEXT') =>
    chatRequest<ChatMessage>(`/${conversationId}/messages`, {
      method: 'POST',
      body: JSON.stringify({ content, type }),
    }),

  markRead: (conversationId: string) =>
    chatRequest<{ success: boolean }>(`/${conversationId}/read`, { method: 'PATCH' }),
};
