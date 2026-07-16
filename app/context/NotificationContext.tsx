'use client';

import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { io, type Socket } from 'socket.io-client';
import { useAuth } from './AuthContext';
import { notificationsApi, type StoreNotification } from '@/lib/notifications-api';
import { useToast } from '@/app/components/ui/Toast';
import { formatOrderRef } from '@/app/lib/order-utils';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:9000';

interface NotificationContextType {
  notifications: StoreNotification[];
  unreadCount: number;
  isLoading: boolean;
  hasMore: boolean;
  loadInitial: () => Promise<void>;
  loadMore: () => Promise<void>;
  prependNotification: (notification: StoreNotification) => void;
  markOneRead: (id: string) => Promise<void>;
  markAllRead: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

async function fetchSocketToken(): Promise<string | null> {
  try {
    const res = await fetch('/api/auth/socket-token', { credentials: 'include' });
    if (!res.ok) return null;
    const json = (await res.json()) as { token: string | null };
    return json.token ?? null;
  } catch {
    return null;
  }
}

const PAGE_SIZE = 20;

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const { isLoggedIn, isLoading: authLoading } = useAuth();
  const { showToast } = useToast();
  const [notifications, setNotifications] = useState<StoreNotification[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const loadingMoreRef = useRef(false);
  const socketRef = useRef<Socket | null>(null);

  const unreadCount = useMemo(
    () => notifications.reduce((acc, n) => acc + (n.is_read ? 0 : 1), 0),
    [notifications],
  );

  const loadInitial = useCallback(async () => {
    if (!isLoggedIn) {
      setNotifications([]);
      setPage(1);
      setHasMore(false);
      return;
    }
    setIsLoading(true);
    try {
      const res = await notificationsApi.list({ type: 'UPDATE', page: 1, limit: PAGE_SIZE });
      const list = res.data ?? [];
      setNotifications(list);
      setPage(1);
      const totalPages = res.meta?.totalPages ?? 1;
      setHasMore(totalPages > 1 && list.length >= PAGE_SIZE);
    } catch {
      setNotifications([]);
      setHasMore(false);
    } finally {
      setIsLoading(false);
    }
  }, [isLoggedIn]);

  const loadMore = useCallback(async () => {
    if (!isLoggedIn || !hasMore || loadingMoreRef.current) return;
    loadingMoreRef.current = true;
    try {
      const nextPage = page + 1;
      const res = await notificationsApi.list({ type: 'UPDATE', page: nextPage, limit: PAGE_SIZE });
      const list = res.data ?? [];
      setNotifications((prev) => {
        const seen = new Set(prev.map((n) => n.id));
        const merged = [...prev];
        for (const item of list) {
          if (!seen.has(item.id)) merged.push(item);
        }
        return merged;
      });
      setPage(nextPage);
      const totalPages = res.meta?.totalPages ?? nextPage;
      setHasMore(nextPage < totalPages && list.length >= PAGE_SIZE);
    } catch {
      setHasMore(false);
    } finally {
      loadingMoreRef.current = false;
    }
  }, [hasMore, isLoggedIn, page]);

  const prependNotification = useCallback((notification: StoreNotification) => {
    setNotifications((prev) => {
      const withoutDup = prev.filter((n) => n.id !== notification.id);
      return [notification, ...withoutDup];
    });
  }, []);

  const markOneRead = useCallback(async (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, is_read: true } : n)));
    try {
      await notificationsApi.markRead(id);
    } catch {
      // keep optimistic state
    }
  }, []);

  const markAllRead = useCallback(async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    try {
      await notificationsApi.markAllRead();
    } catch {
      // keep optimistic state
    }
  }, []);

  useEffect(() => {
    if (authLoading) return;
    if (!isLoggedIn) {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
      setNotifications([]);
      setHasMore(false);
      return;
    }

    let cancelled = false;
    let socket: Socket | null = null;

    (async () => {
      const token = await fetchSocketToken();
      if (cancelled || !token) return;

      socket = io(API_URL, {
        auth: { token },
        transports: ['websocket', 'polling'],
      });
      socketRef.current = socket;

      socket.on('notification:new', (payload: { notification?: StoreNotification }) => {
        if (payload.notification) {
          prependNotification(payload.notification);
        }
      });

      socket.on(
        'order:refused',
        (payload: { orderId?: string; reason?: string | null; orderRef?: string }) => {
          if (!payload.orderId) return;

          const ref = payload.orderRef ?? formatOrderRef(payload.orderId);
          const toastMessage = payload.reason
            ? `Votre commande ${ref} a été refusée par le vendeur : ${payload.reason}`
            : `Votre commande ${ref} a été refusée par le vendeur`;

          showToast(toastMessage, {
            variant: 'danger',
            duration: 6000,
            href: `/commandes/${payload.orderId}`,
            hrefLabel: 'Voir la commande',
          });
        },
      );
    })();

    void loadInitial();

    return () => {
      cancelled = true;
      if (socket) socket.disconnect();
      socketRef.current = null;
    };
  }, [authLoading, isLoggedIn, loadInitial, prependNotification, showToast]);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        isLoading,
        hasMore,
        loadInitial,
        loadMore,
        prependNotification,
        markOneRead,
        markAllRead,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}
