'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { X, Sparkles, Send, ChevronLeft, ChevronRight } from 'lucide-react';
import { useLockBodyScroll } from '@/hooks/useLockBodyScroll';
import { formatPrice } from '@/app/utils/formatPrice';
import { PRODUCT_IMAGE_PLACEHOLDER } from '@/app/lib/mapHomeProduct';
import ProductCard from '@/app/components/ProductCard';

/* ─── Types ────────────────────────────────────────────────────────── */

interface AssistantProduct {
  id: string;
  title: string;
  price: number;
  primary_image: string | null;
  shop_name?: string | null;
  brand?: string | null;
  vendor_region?: string | null;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
  products?: AssistantProduct[];
  isLoading?: boolean;
  aiGenerated?: boolean;
}

interface AssistantApiResponse {
  data: {
    message: string;
    products: AssistantProduct[];
    ai_generated: boolean;
    topic_changed?: boolean;
  };
}

/* ─── Constants ────────────────────────────────────────────────────── */

const SUGGESTIONS = [
  'Un cadeau pour une femme, budget 15 000 FCFA',
  'Chaussures de sport pas chères',
  'Sac à main élégant',
  'Vêtements pour enfant',
];

const WELCOME_MESSAGE: Message = {
  role: 'assistant',
  content:
    'Bonjour ! 👋 Je suis votre assistant shopping. Décrivez-moi ce que vous cherchez et je trouverai les meilleurs articles du catalogue.',
  products: [],
  aiGenerated: false,
};

const ERROR_MESSAGE: Message = {
  role: 'assistant',
  content: 'Une erreur est survenue. Veuillez réessayer.',
  products: [],
  aiGenerated: false,
};

/* ─── Product Carousel ─────────────────────────────────────────────────── */

function AssistantProductCarousel({ products }: { products: AssistantProduct[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    scrollRef.current?.scrollBy({ left: -180, behavior: 'smooth' });
  };

  const scrollRight = () => {
    scrollRef.current?.scrollBy({ left: 180, behavior: 'smooth' });
  };

  return (
    <div className="group/carousel relative ml-9">
      <button
        type="button"
        onClick={scrollLeft}
        className="absolute -left-3 top-1/2 z-10 hidden h-8 w-8 -translate-y-1/2 items-center justify-center border border-black bg-white shadow-sm transition-colors hover:bg-gray-100 group-hover/carousel:flex"
        aria-label="Voir précédent"
      >
        <ChevronLeft size={18} strokeWidth={1} />
      </button>

      <div
        ref={scrollRef}
        className="flex gap-3 overflow-x-auto pb-3 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {products.map((product) => {
          const mappedProduct = {
            id: product.id,
            brand: product.brand || product.shop_name || 'Boutique',
            title: product.title,
            image: product.primary_image || PRODUCT_IMAGE_PLACEHOLDER,
            priceLabel: formatPrice(product.price),
            condition: 'Neuf',
            vendorRegion: product.vendor_region || 'Togo',
            sold: false,
          };

          return (
            <div key={product.id} className="w-[160px] shrink-0 snap-start">
              {/* Wrapper to reduce height/padding for the chat */}
              <div className="h-[240px] [&_a]:p-2 [&_img]:h-[100px]">
                <ProductCard product={mappedProduct} />
              </div>
            </div>
          );
        })}
      </div>

      <button
        type="button"
        onClick={scrollRight}
        className="absolute -right-3 top-1/2 z-10 hidden h-8 w-8 -translate-y-1/2 items-center justify-center border border-black bg-white shadow-sm transition-colors hover:bg-gray-100 group-hover/carousel:flex"
        aria-label="Voir plus"
      >
        <ChevronRight size={18} strokeWidth={1} />
      </button>
    </div>
  );
}

/* ─── Main component ───────────────────────────────────────────────── */

export function ShoppingAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [messages, setMessages] = useState<Message[]>([WELCOME_MESSAGE]);
  const [draft, setDraft] = useState('');
  const [sending, setSending] = useState(false);
  
  const isRequestPending = useRef(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  // Detect mobile + mounted (same pattern as ChatDrawer)
  useEffect(() => {
    setMounted(true);
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  useLockBodyScroll(isOpen && isMobile);

  // Auto-scroll to latest message
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages]);

  // Focus input when drawer opens
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => inputRef.current?.focus(), 150);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleSend = useCallback(
    async (text?: string) => {
      const content = (text ?? draft).trim();
      if (!content || sending || isRequestPending.current) return;
      
      isRequestPending.current = true;
      setSending(true);

      const userMessage: Message = { role: 'user', content };
      const loadingMessage: Message = { role: 'assistant', content: '', isLoading: true };

      setMessages((prev) => [...prev, userMessage, loadingMessage]);
      setDraft('');

      // Build history from non-loading messages, limited to last 6 messages, text only
      const history = messages
        .filter((m) => !m.isLoading && m.content.trim() !== '')
        .slice(-6)
        .map((m) => ({ role: m.role, content: m.content }));

      try {
        const res = await fetch('/api/store/ai/assistant', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: content, history }),
        });

        const json = (await res.json()) as AssistantApiResponse;
        const { data } = json;

        setMessages((prev) => {
          let updatedMessages = prev.filter((m) => !m.isLoading);
          
          // Clear products from previous messages if topic changed
          if (data.topic_changed !== false) { // Default to true if not specified
            updatedMessages = updatedMessages.map((m) => ({
              ...m,
              products: m.role === 'assistant' ? [] : m.products,
            }));
          }

          return [
            ...updatedMessages,
            {
              role: 'assistant',
              content: data.message,
              products: data.products ?? [],
              aiGenerated: data.ai_generated,
            },
          ];
        });
      } catch {
        setMessages((prev) => [...prev.filter((m) => !m.isLoading), ERROR_MESSAGE]);
      } finally {
        setSending(false);
        isRequestPending.current = false;
        inputRef.current?.focus();
      }
    },
    [draft, sending, messages],
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!sending && !isRequestPending.current && draft.trim()) {
        void handleSend();
      }
    }
  };

  const handleSuggestion = (text: string) => {
    if (sending || isRequestPending.current) return;
    setDraft('');
    void handleSend(text);
  };

  if (!isOpen) {
    // ── Floating button ──
    return (
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="fixed bottom-24 right-4 z-40 flex items-center justify-center rounded-full bg-black p-4 text-white shadow-lg transition-all hover:scale-105 hover:bg-gray-800 active:scale-95 md:bottom-6 md:right-6"
        aria-label="Ouvrir l'assistant shopping"
      >
        <Sparkles size={24} />
      </button>
    );
  }

  // ── Drawer (exact same shell as ChatDrawer) ──
  const content = (
    <div
      className="
        fixed inset-0 z-[1000] flex flex-col bg-white shadow-2xl
        md:inset-auto md:bottom-4 md:right-4 md:h-[600px] md:max-h-[80vh] md:w-[400px] md:rounded-lg md:border md:border-gray-200
      "
    >
      {/* Top bar — same as ChatDrawer */}
      <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
        <div className="flex items-center gap-2">
          <Sparkles size={16} className="text-gray-600" />
          <span className="truncate text-sm font-bold text-gray-900">Assistant Shopping</span>
          <span className="rounded-full bg-gray-100 px-1.5 py-0.5 text-[10px] font-medium text-gray-500">
            IA
          </span>
        </div>
        <button
          type="button"
          onClick={() => setIsOpen(false)}
          aria-label="Fermer"
          className="text-gray-400 transition-colors hover:text-black"
        >
          <X size={22} strokeWidth={1.75} />
        </button>
      </div>

      {/* Messages — same layout as ChatThread */}
      <div ref={scrollRef} className="flex-1 min-h-0 space-y-4 overflow-y-auto px-4 py-4">
        {/* Suggestion chips — shown only at start */}
        {messages.length === 1 && (
          <div className="space-y-2 pb-2">
            <p className="text-[11px] text-gray-400">Essayez par exemple :</p>
            {SUGGESTIONS.map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => handleSuggestion(suggestion)}
                disabled={sending || isRequestPending.current}
                className="w-full rounded-2xl border border-gray-200 px-4 py-2 text-left text-sm text-gray-700 transition-colors hover:border-gray-400 hover:bg-gray-50 disabled:opacity-50"
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}

        {/* Render messages */}
        {messages.map((msg, idx) => {
          const isUser = msg.role === 'user';

          // Loading indicator
          if (msg.isLoading) {
            return (
              <div key={`loading-${idx}`} className="flex items-end gap-2">
                <span className="grid h-7 w-7 shrink-0 place-items-center overflow-hidden rounded-full bg-gray-200">
                  <Sparkles size={14} className="text-gray-500" />
                </span>
                <div className="max-w-[75%] rounded-2xl bg-gray-100 px-4 py-2.5">
                  <div className="flex gap-1.5">
                    <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400" style={{ animationDelay: '0ms' }} />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400" style={{ animationDelay: '150ms' }} />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            );
          }

          return (
            <div key={`msg-${idx}`} className="space-y-3">
              <div className={`flex items-end gap-2 ${isUser ? 'flex-row-reverse' : ''}`}>
                {/* Avatar — assistant only */}
                {!isUser && (
                  <span className="grid h-7 w-7 shrink-0 place-items-center overflow-hidden rounded-full bg-gray-200 text-[10px] font-semibold text-gray-600">
                    <Sparkles size={14} className="text-gray-500" />
                  </span>
                )}

                {/* Bubble */}
                <div className="flex flex-col gap-1 max-w-[75%]">
                  <div
                    className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                      isUser ? 'bg-black text-white' : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    {msg.content}
                  </div>
                  
                  {/* AI badge or search note */}
                  {!isUser && idx > 0 && (
                    <div className="px-2">
                      {msg.aiGenerated ? (
                        <span className="inline-flex items-center gap-1 text-[10px] text-gray-500">
                          <Sparkles size={10} className="text-violet-500" /> 
                          Généré par Gemini
                        </span>
                      ) : (
                        <span className="text-[10px] text-gray-400 italic">
                          Réponse basée sur la recherche
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Product horizontal scroll grid */}
              {msg.products && msg.products.length > 0 && (
                <AssistantProductCarousel products={msg.products} />
              )}
            </div>
          );
        })}

        {!sending && (
          <p className="pt-1 text-center text-[11px] text-gray-400"></p>
        )}
      </div>

      {/* Composer — exact same as ChatThread */}
      <div className="p-3">
        <div className="flex items-end gap-2 rounded-full border border-gray-300 px-4 py-2 focus-within:border-gray-500">
          <textarea
            ref={inputRef}
            rows={1}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Décrivez ce que vous cherchez..."
            disabled={sending || isRequestPending.current}
            className="max-h-28 flex-1 resize-none bg-transparent text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none disabled:opacity-50"
          />
          <button
            type="button"
            onClick={() => void handleSend()}
            disabled={sending || isRequestPending.current || draft.trim().length === 0}
            aria-label="Envoyer"
            className="shrink-0 text-gray-400 transition-colors enabled:hover:text-black disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Send size={20} strokeWidth={1.75} />
          </button>
        </div>
        <p className="mt-2 text-center text-[11px] text-gray-400">
          Propulsé par Gemini IA
        </p>
      </div>
    </div>
  );

  // Portal on mobile (same as ChatDrawer)
  if (isMobile && mounted) {
    return createPortal(content, document.body);
  }
  return content;
}
