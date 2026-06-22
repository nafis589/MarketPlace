'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Pencil, Send, Info } from 'lucide-react';
import { useLockBodyScroll } from '@/hooks/useLockBodyScroll';
import { offersApi } from '@/lib/offers-api';
import { ApiClientError } from '@/lib/api-client';
import { formatPrice } from '@/app/utils/formatPrice';
import { PRODUCT_IMAGE_PLACEHOLDER } from '@/app/lib/mapHomeProduct';

export interface OfferModalProduct {
  id: string;
  title: string;
  brand: string;
  price: number;
  priceLabel: string;
  condition?: string;
  image?: string | null;
}

interface OfferModalProps {
  open: boolean;
  product: OfferModalProduct;
  onClose: () => void;
  onSuccess: () => void;
}

export default function OfferModal({ open, product, onClose, onSuccess }: OfferModalProps) {
  const [amountInput, setAmountInput] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useLockBodyScroll(open);

  useEffect(() => {
    if (!open) {
      setAmountInput('');
      setError(null);
      setSubmitting(false);
    }
  }, [open]);

  const amount = useMemo(() => {
    const parsed = parseInt(amountInput.replace(/\s/g, ''), 10);
    return Number.isFinite(parsed) ? parsed : 0;
  }, [amountInput]);

  const hint = useMemo(() => {
    if (amount <= 0) return null;
    if (amount >= product.price) {
      return { type: 'error' as const, text: 'Ce montant dépasse le prix. Achetez directement.' };
    }
    if (amount < product.price * 0.5) {
      return { type: 'warning' as const, text: 'Offre très basse, risque de refus.' };
    }
    return null;
  }, [amount, product.price]);

  const canSubmit = amount >= 100 && amount < product.price && !submitting;

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !submitting) onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, submitting, onClose]);

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setSubmitting(true);
    setError(null);
    try {
      await offersApi.create(product.id, amount);
      onSuccess();
      onClose();
    } catch (err) {
      if (err instanceof ApiClientError) {
        setError(err.message);
      } else {
        setError('Impossible d\'envoyer l\'offre');
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (!open || !mounted) return null;

  const imageSrc = product.image || PRODUCT_IMAGE_PLACEHOLDER;

  const modal = (
    <div className="fixed inset-0 z-[2000] flex items-end justify-center sm:items-center sm:p-4">
      <button
        type="button"
        className="absolute inset-0 bg-black/40"
        aria-label="Fermer"
        onClick={() => !submitting && onClose()}
      />

      <div className="relative flex max-h-[92vh] w-full max-w-lg flex-col overflow-hidden rounded-t-2xl bg-white shadow-2xl sm:rounded-2xl">
        <div className="flex items-start justify-between px-6 py-5">
          <h2 className="font-serif text-2xl text-gray-900 pr-8">Négocier le prix</h2>
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="text-gray-400 transition-colors hover:text-black disabled:opacity-50"
            aria-label="Fermer"
          >
            <X size={22} strokeWidth={1.5} />
          </button>
        </div>

        <div className="overflow-y-auto px-6 py-5">
          <div className="flex gap-4 pb-5">
            <div className="h-16 w-14 shrink-0 overflow-hidden bg-gray-50">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={imageSrc} alt={product.title} className="h-full w-full object-cover mix-blend-multiply" />
            </div>
            <div className="min-w-0 flex-1">
              {product.brand && (
                <p className="text-sm font-bold uppercase tracking-wide text-gray-900">{product.brand}</p>
              )}
              <p className="truncate text-sm text-gray-700">{product.title}</p>
              <p className="mt-1 flex items-center gap-1 text-sm text-gray-600">
                <span>Prix : {product.priceLabel}</span>
                <Info size={14} className="text-gray-400" strokeWidth={1.75} />
              </p>
            </div>
          </div>

          <div className="pt-5">
            <label htmlFor="offer-amount" className="mb-2 block text-sm text-gray-500">
              Votre offre
            </label>
            <div className="relative">
              <Pencil
                size={16}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                strokeWidth={1.75}
              />
              <input
                id="offer-amount"
                type="text"
                inputMode="numeric"
                value={amountInput}
                onChange={(e) => setAmountInput(e.target.value.replace(/[^\d\s]/g, ''))}
                placeholder="0"
                className="w-full rounded-full border border-gray-300 py-3.5 pl-11 pr-16 text-base text-gray-900 outline-none transition-colors focus:border-black"
              />
              <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-400">
                FCFA
              </span>
            </div>

            {hint && (
              <p
                className={`mt-2 text-sm ${
                  hint.type === 'error' ? 'text-red-600' : 'text-amber-600'
                }`}
              >
                {hint.text}
              </p>
            )}
            {amount > 0 && amount < 100 && (
              <p className="mt-2 text-sm text-gray-500">Montant minimum : 100 FCFA</p>
            )}
            {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
          </div>
        </div>

        <div className="p-6">
          <button
            type="button"
            onClick={() => void handleSubmit()}
            disabled={!canSubmit}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-black py-3.5 text-sm font-bold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:bg-gray-300"
          >
            <Send size={18} strokeWidth={1.75} />
            {amount > 0 && amount < product.price
              ? `Envoyer une offre de ${formatPrice(amount)}`
              : 'Envoyer une offre'}
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(modal, document.body);
}
