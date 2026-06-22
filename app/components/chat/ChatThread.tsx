'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import Link from 'next/link';
import { Send } from 'lucide-react';
import { useChat, type IncomingMessagePayload } from '@/app/context/ChatContext';
import { useAuth } from '@/app/context/AuthContext';
import { useCart } from '@/app/context/CartContext';
import { useUI } from '@/app/context/UIContext';
import { useToast } from '@/app/components/ui/Toast';
import { chatApi, type ChatConversation, type ChatMessage } from '@/lib/chat-api';
import { formatPrice } from '@/app/utils/formatPrice';
import { conditionLabel, messageDivider, sameDay, getInitials } from './chatUtils';
import { PRODUCT_IMAGE_PLACEHOLDER } from '@/app/lib/mapHomeProduct';
import OfferModal from '@/app/components/offers/OfferModal';

interface ChatThreadProps {
  conversation: ChatConversation;
  className?: string;
  /** Masque la carte produit sur md+ (drawer ouvert depuis la fiche produit). */
  hideProductBarOnDesktop?: boolean;
}

export default function ChatThread({
  conversation,
  className = '',
  hideProductBarOnDesktop = false,
}: ChatThreadProps) {
  const { subscribe, sendMessage, markRead } = useChat();
  const { user, isLoggedIn } = useAuth();
  const { addItem } = useCart();
  const { openLogin, openCart } = useUI();
  const { showToast } = useToast();

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [draft, setDraft] = useState('');
  const [sending, setSending] = useState(false);
  const [offerModalOpen, setOfferModalOpen] = useState(false);

  const scrollRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const conversationId = conversation.id;

  const appendMessage = useCallback((incoming: ChatMessage) => {
    setMessages((prev) => {
      if (prev.some((m) => m.id === incoming.id)) return prev;
      return [...prev, incoming];
    });
  }, []);

  // Load messages + mark read whenever the active conversation changes.
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    chatApi
      .getMessages(conversationId)
      .then((res) => {
        if (cancelled) return;
        setMessages(res.messages);
      })
      .catch(() => {
        if (!cancelled) setMessages([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    void markRead(conversationId);
    return () => {
      cancelled = true;
    };
  }, [conversationId, markRead]);

  // Live updates for this conversation.
  useEffect(() => {
    const unsubscribe = subscribe((payload: IncomingMessagePayload) => {
      if (payload.conversationId !== conversationId) return;
      appendMessage({
        id: payload.message.id,
        conversation_id: conversationId,
        sender_id: payload.message.sender_id,
        content: payload.message.content,
        type: payload.message.type,
        is_read: false,
        mine: payload.message.sender_id === user?.id,
        created_at: payload.message.created_at,
      });
      if (payload.message.sender_id !== user?.id) {
        void markRead(conversationId);
      }
    });
    return unsubscribe;
  }, [conversationId, subscribe, appendMessage, user?.id, markRead]);

  // Auto-scroll to the latest message.
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, loading]);

  const handleSend = useCallback(async () => {
    const text = draft.trim();
    if (!text || sending) return;
    setSending(true);
    setDraft('');
    const message = await sendMessage(conversationId, text);
    if (message) appendMessage(message);
    setSending(false);
    inputRef.current?.focus();
  }, [draft, sending, sendMessage, conversationId, appendMessage]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      void handleSend();
    }
  };

  const product = conversation.product;

  const handleStartOffer = () => {
    if (!product) return;
    if (!isLoggedIn) {
      openLogin();
      return;
    }
    setOfferModalOpen(true);
  };

  const handleAddToCart = async () => {
    if (!product) return;
    try {
      await addItem(product.id);
      showToast('Ajouté au panier ✓');
      openCart();
    } catch {
      showToast('Impossible d\'ajouter au panier');
    }
  };

  const productBarClass = hideProductBarOnDesktop ? 'md:hidden' : '';

  return (
    <div className={`flex h-full min-h-0 flex-col bg-white ${className}`}>
      {/* Product header — mobile only when opened from PDP drawer on desktop */}
      {product && (
        <div className={`flex items-center gap-3 border-b border-gray-100 px-4 py-3 ${productBarClass}`}>
          <Link href={`/product/${product.id}`} className="h-14 w-12 shrink-0 overflow-hidden bg-gray-50">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={product.image || PRODUCT_IMAGE_PLACEHOLDER}
              alt={product.title}
              className="h-full w-full object-cover mix-blend-multiply"
            />
          </Link>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-bold text-gray-900">
              {product.brand || product.title}
            </p>
            <p className="truncate text-xs text-gray-500">{conditionLabel(product.condition)}</p>
            {product.price != null && (
              <p className="text-xs font-semibold text-gray-900">{formatPrice(product.price)}</p>
            )}
          </div>
          <div className="flex shrink-0 gap-2">
            <button
              type="button"
              onClick={handleStartOffer}
              className="border border-black px-3 py-1.5 text-xs font-bold text-black transition-colors hover:bg-gray-50"
            >
              Faire une offre
            </button>
            <button
              type="button"
              onClick={() => void handleAddToCart()}
              className="bg-black px-3 py-1.5 text-xs font-bold text-white transition-colors hover:bg-gray-800"
            >
              Acheter
            </button>
          </div>
        </div>
      )}

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 min-h-0 space-y-4 overflow-y-auto px-4 py-4">

        {loading ? (
          <div className="space-y-3">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-10 w-2/3 animate-pulse rounded-2xl bg-gray-100" />
            ))}
          </div>
        ) : (
          messages.map((message, idx) => {
            const isMine = message.sender_id === user?.id;
            const prev = messages[idx - 1];
            const showDivider = !prev || !sameDay(prev.created_at, message.created_at);
            const initials = getInitials(
              isMine ? `${user?.first_name ?? ''} ${user?.last_name ?? ''}` : conversation.counterpart.name,
            );

            return (
              <div key={message.id} className="space-y-3">
                {showDivider && (
                  <div className="flex items-center justify-center py-1">
                    <span className="text-[11px] text-gray-400">{messageDivider(message.created_at)}</span>
                  </div>
                )}
                <div className={`flex items-end gap-2 ${isMine ? 'flex-row-reverse' : ''}`}>
                  {!isMine && (
                    <span className="grid h-7 w-7 shrink-0 place-items-center overflow-hidden rounded-full bg-gray-200 text-[10px] font-semibold text-gray-600">
                      {conversation.counterpart.avatar ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={conversation.counterpart.avatar}
                          alt=""
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        initials
                      )}
                    </span>
                  )}
                  <div
                    className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                      isMine
                        ? 'bg-black text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    {message.content}
                  </div>
                </div>
              </div>
            );
          })
        )}

        {!loading && (
          <p className="pt-1 text-center text-[11px] text-gray-400"></p>
        )}
      </div>

      {/* Composer */}
      <div className="p-3">
        <div className="flex items-end gap-2 rounded-full border border-gray-300 px-4 py-2 focus-within:border-gray-500">
          <textarea
            ref={inputRef}
            rows={1}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Écrire un message"
            className="max-h-28 flex-1 resize-none bg-transparent text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none"
          />
          <button
            type="button"
            onClick={() => void handleSend()}
            disabled={sending || draft.trim().length === 0}
            aria-label="Envoyer"
            className="shrink-0 text-gray-400 transition-colors enabled:hover:text-black disabled:cursor-not-allowed"
          >
            <Send size={20} strokeWidth={1.75} />
          </button>
        </div>
      </div>

      {product && product.price != null && (
        <OfferModal
          open={offerModalOpen}
          product={{
            id: product.id,
            title: product.title,
            brand: product.brand ?? '',
            price: product.price,
            priceLabel: formatPrice(product.price),
            condition: conditionLabel(product.condition),
            image: product.image,
          }}
          onClose={() => setOfferModalOpen(false)}
          onSuccess={() => showToast('Offre envoyée ! Le vendeur a 48h pour répondre.')}
        />
      )}
    </div>
  );
}
