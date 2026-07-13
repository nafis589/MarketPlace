'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/navigation';
import { Loader2, X } from 'lucide-react';
import { useUI } from '@/app/context/UIContext';
import { useChat } from '@/app/context/ChatContext';
import { useNotifications } from '@/app/context/NotificationContext';
import { getInitials, relativeTime } from '@/app/components/chat/chatUtils';
import { PRODUCT_IMAGE_PLACEHOLDER } from '@/app/lib/mapHomeProduct';
import type { StoreNotification } from '@/lib/notifications-api';
import { useLockBodyScroll } from '@/hooks/useLockBodyScroll';

type NotificationTab = 'UPDATES' | 'MESSAGES';

const NAVBAR_OFFSET = '120px';

function getMetadataString(metadata: Record<string, unknown> | null, key: string): string | null {
  const value = metadata?.[key];
  return typeof value === 'string' && value.trim() ? value : null;
}

function getMetadataNumber(metadata: Record<string, unknown> | null, key: string): number | null {
  const value = metadata?.[key];
  if (typeof value === 'number') return value;
  if (typeof value === 'string') {
    const parsed = Number(value);
    return Number.isNaN(parsed) ? null : parsed;
  }
  return null;
}

function formatCompactFcfa(value: number): string {
  return `${new Intl.NumberFormat('fr-FR').format(Math.round(value))} FCFA`;
}

function resolveNotificationImage(metadata: Record<string, unknown> | null): string {
  return (
    getMetadataString(metadata, 'product_image') ??
    getMetadataString(metadata, 'productImage') ??
    getMetadataString(metadata, 'image') ??
    PRODUCT_IMAGE_PLACEHOLDER
  );
}

function NotificationThumbnail({
  src,
  productId,
  alt,
}: {
  src: string;
  productId: string | null;
  alt: string;
}) {
  const [displaySrc, setDisplaySrc] = useState(src);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setDisplaySrc(src);
    setFailed(false);
  }, [src]);

  useEffect(() => {
    if (src !== PRODUCT_IMAGE_PLACEHOLDER || !productId) return;

    const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:9000';
    void fetch(`${apiUrl}/api/store/products/${productId}`)
      .then((res) => (res.ok ? res.json() : null))
      .then(
        (json: {
          data?: {
            primary_image?: string | null;
            images?: { url: string; is_primary: boolean }[];
          };
        } | null) => {
          const image =
            json?.data?.primary_image ??
            json?.data?.images?.find((item) => item.is_primary)?.url ??
            json?.data?.images?.[0]?.url;
          if (image) setDisplaySrc(image);
        },
      )
      .catch(() => undefined);
  }, [src, productId]);

  const finalSrc = failed ? PRODUCT_IMAGE_PLACEHOLDER : displaySrc;

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={finalSrc}
      alt={alt}
      className="h-full w-full object-cover"
      onError={() => setFailed(true)}
    />
  );
}

function displayBody(n: StoreNotification): string {
  const metadata = n.metadata as Record<string, unknown> | null;
  const priceValue = getMetadataNumber(metadata, 'counterAmount') ?? getMetadataNumber(metadata, 'amount');
  switch (n.type) {
    case 'ORDER_NEW':
      return 'Votre commande a été confirmée';
    case 'ORDER_STATUS':
      return n.body || 'Votre commande a été mise à jour';
    case 'OFFER_ACCEPTED':
    case 'OFFER_RECEIVED':
      return "🤝 Offre acceptée : c'est parti !";
    case 'OFFER_COUNTER':
      return priceValue
        ? `Le vendeur propose ${formatCompactFcfa(priceValue)} — votre offre a été refusée`
        : 'Le vendeur a refusé votre offre et propose une contre-offre';
    case 'OFFER_DECLINED':
      return 'Votre offre a été refusée';
    case 'PRICE_DROP':
      return priceValue
        ? `Le vendeur est prêt à baisser le prix à ${formatCompactFcfa(priceValue)}`
        : 'Le vendeur est prêt à baisser le prix';
    case 'CART_REMINDER':
      return "N'oubliez pas de finaliser votre commande";
    case 'FOLLOW_NEW': {
      const vendor = getMetadataString(metadata, 'vendorName') ?? 'Le vendeur';
      return `${vendor} a un nouvel article`;
    }
    case 'SYSTEM':
      return n.body || n.title || 'Notification système';
    default:
      return n.body || n.title || 'Nouvelle notification';
  }
}

function resolveNotificationHref(notification: StoreNotification): string {
  const metadata = notification.metadata as Record<string, unknown> | null;
  const orderId = getMetadataString(metadata, 'orderId');
  const offerId = getMetadataString(metadata, 'offerId');
  const productId = getMetadataString(metadata, 'productId');
  if (orderId) return '/commandes';
  if (offerId) return '/offres';
  if (productId) return `/product/${productId}`;
  return '/';
}

export default function NotificationPanel() {
  const router = useRouter();
  const { notifOpen, closeNotif } = useUI();
  const { conversations, openConversation, totalUnread: msgCount } = useChat();
  const {
    notifications,
    unreadCount,
    isLoading,
    hasMore,
    loadInitial,
    loadMore,
    markOneRead,
    markAllRead,
  } = useNotifications();

  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [tab, setTab] = useState<NotificationTab>('UPDATES');
  const listRef = useRef<HTMLDivElement | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setMounted(true);
    const check = () => setIsMobile(window.innerWidth < 1024);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  useLockBodyScroll(notifOpen && isMobile);

  useEffect(() => {
    if (!notifOpen) return;
    void loadInitial();
    void markAllRead();
  }, [notifOpen, loadInitial, markAllRead]);

  useEffect(() => {
    if (!notifOpen || tab !== 'UPDATES') return;
    const sentinel = sentinelRef.current;
    if (!sentinel) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          void loadMore();
        }
      },
      { root: listRef.current, rootMargin: '120px' },
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [notifOpen, tab, loadMore, notifications.length]);

  const chats = useMemo(() => conversations.slice(0, 20), [conversations]);

  const onNotificationClick = async (notification: StoreNotification) => {
    if (!notification.is_read) {
      await markOneRead(notification.id);
    }
    closeNotif();
    router.push(resolveNotificationHref(notification));
  };

  const onConversationClick = (id: string) => {
    closeNotif();
    openConversation(id);
  };

  if (!mounted || !notifOpen) return null;

  const content = (
    <div className="fixed inset-0 z-[1100]">
      <button
        type="button"
        aria-label="Fermer le panneau notifications"
        className="absolute inset-0 bg-transparent"
        onClick={closeNotif}
      />

      <aside
        className={`absolute right-0 flex flex-col bg-white border-l border-t border-gray-200 transition-transform duration-300 ${
          notifOpen ? 'translate-x-0' : 'translate-x-full'
        } top-0 h-full w-full lg:top-[var(--notif-nav-offset)] lg:h-[calc(100vh-var(--notif-nav-offset))] lg:w-[380px]`}
        style={{ '--notif-nav-offset': NAVBAR_OFFSET } as React.CSSProperties}
      >
        <div className="flex h-full flex-col">
          <div className="border-b border-gray-200 px-5 pt-4">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-serif text-2xl font-medium leading-none text-gray-900 lg:text-xl">Notifications</h2>
              <button type="button" onClick={closeNotif} className="text-gray-400 hover:text-black">
                <X className="h-6 w-6" strokeWidth={1.5} />
              </button>
            </div>

            <div className="flex items-center gap-6">
              <button
                type="button"
                onClick={() => setTab('UPDATES')}
                className={`border-b-2 pb-2 font-serif text-lg font-medium lg:text-base ${
                  tab === 'UPDATES'
                    ? 'border-black text-black'
                    : 'border-transparent text-gray-500 hover:text-black'
                }`}
              >
                Mises à jour
                {unreadCount > 0 && (
                  <span className="ml-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-red-600 px-1 text-[11px] font-bold text-white">
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </span>
                )}
              </button>
              <button
                type="button"
                onClick={() => setTab('MESSAGES')}
                className={`border-b-2 pb-2 font-serif text-lg font-medium lg:text-base ${
                  tab === 'MESSAGES'
                    ? 'border-black text-black'
                    : 'border-transparent text-gray-500 hover:text-black'
                }`}
              >
                Messages
                {msgCount > 0 && (
                  <span className="ml-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-red-600 px-1 text-[11px] font-bold text-white">
                    {msgCount > 99 ? '99+' : msgCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {tab === 'UPDATES' ? (
            <div ref={listRef} className="flex-1 overflow-y-auto">
              <div className="border-b border-gray-100 px-5 py-3 text-sm font-semibold text-black">Tout</div>

              {isLoading ? (
                <div className="flex justify-center py-10">
                  <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                </div>
              ) : notifications.length === 0 ? (
                <p className="px-5 py-10 text-center text-sm text-gray-500">Aucune mise à jour</p>
              ) : (
                <>
                  <ul className="divide-y divide-gray-100">
                    {notifications.map((n) => {
                      const metadata = n.metadata as Record<string, unknown> | null;
                      const image = resolveNotificationImage(metadata);
                      const productId = getMetadataString(metadata, 'productId');
                      return (
                        <li key={n.id}>
                          <button
                            type="button"
                            onClick={() => void onNotificationClick(n)}
                            className="flex w-full items-start gap-3 px-5 py-4 text-left transition-colors hover:bg-gray-50"
                          >
                            <span className="relative h-10 w-10 shrink-0">
                              {!n.is_read && (
                                <span className="absolute -left-2.5 top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-red-600" />
                              )}
                              <span className="block h-10 w-10 overflow-hidden rounded-md bg-gray-100">
                                <NotificationThumbnail src={image} productId={productId} alt="" />
                              </span>
                            </span>
                            <span className="min-w-0 flex-1">
                              <span
                                className={`block text-sm leading-snug text-gray-900 ${
                                  n.is_read ? 'font-normal' : 'font-semibold'
                                }`}
                              >
                                {displayBody(n)}
                              </span>
                            </span>
                            <span className="shrink-0 pt-1 text-xs text-gray-500">
                              {relativeTime(n.created_at)}
                            </span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>

                  {hasMore && <div ref={sentinelRef} className="h-10" />}
                </>
              )}
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto">
              {chats.length === 0 ? (
                <p className="px-5 py-10 text-center text-sm text-gray-500">Aucun message</p>
              ) : (
                <ul className="divide-y divide-gray-100">
                  {chats.map((conversation) => {
                    const preview =
                      conversation.last_message?.content.length
                        ? conversation.last_message.content.slice(0, 60)
                        : 'Nouvelle conversation';
                    const avatar = conversation.counterpart.avatar;
                    return (
                      <li key={conversation.id}>
                        <button
                          type="button"
                          onClick={() => onConversationClick(conversation.id)}
                          className="flex w-full items-start gap-3 px-5 py-4 text-left transition-colors hover:bg-gray-50"
                        >
                          <span className="relative h-10 w-10 shrink-0">
                            {conversation.unread_count > 0 && (
                              <span className="absolute -left-2.5 top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-red-600" />
                            )}
                            <span className="grid h-10 w-10 place-items-center overflow-hidden rounded-full bg-gray-200 text-xs font-semibold text-gray-600">
                              {avatar ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={avatar} alt="" className="h-full w-full object-cover" />
                              ) : (
                                getInitials(conversation.counterpart.name)
                              )}
                            </span>
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="block truncate text-sm font-bold text-gray-900">
                              {conversation.counterpart.name}
                            </span>
                            <span className="block truncate text-sm text-black">{preview}</span>
                          </span>
                          <span className="shrink-0 pt-1 text-xs text-gray-500">
                            {relativeTime(conversation.last_message_at)}
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          )}
        </div>
      </aside>
    </div>
  );

  return createPortal(content, document.body);
}
