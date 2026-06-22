'use client';

import React, { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';
import { offersApi, type OfferStatus, type StoreOffer } from '@/lib/offers-api';
import { formatPrice } from '@/app/utils/formatPrice';
import { PRODUCT_IMAGE_PLACEHOLDER } from '@/app/lib/mapHomeProduct';

function statusBadge(status: OfferStatus, counterAmount: number | null) {
  switch (status) {
    case 'PENDING':
      return { label: 'En attente', className: 'bg-amber-100 text-amber-800' };
    case 'ACCEPTED':
      return { label: 'Acceptée ✓', className: 'bg-green-100 text-green-800' };
    case 'DECLINED':
      return { label: 'Refusée', className: 'bg-red-100 text-red-800' };
    case 'COUNTER':
      return {
        label: counterAmount != null ? `Contre-offre : ${formatPrice(counterAmount)}` : 'Contre-offre',
        className: 'bg-blue-100 text-blue-800',
      };
    case 'EXPIRED':
      return { label: 'Expirée', className: 'bg-gray-100 text-gray-600' };
    default:
      return { label: status, className: 'bg-gray-100 text-gray-600' };
  }
}

export default function MesOffresPage() {
  const [offers, setOffers] = useState<StoreOffer[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await offersApi.list();
      setOffers(data);
    } catch {
      setError('Impossible de charger vos offres');
      setOffers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const handleAcceptCounter = async (offerId: string) => {
    setActionId(offerId);
    try {
      await offersApi.acceptCounter(offerId);
      await load();
    } finally {
      setActionId(null);
    }
  };

  const handleDeclineCounter = async (offerId: string) => {
    setActionId(offerId);
    try {
      await offersApi.declineCounter(offerId);
      await load();
    } finally {
      setActionId(null);
    }
  };

  return (
    <div>
      <h1 className="mb-6 font-serif text-3xl text-gray-900">Mes offres</h1>

      {loading ? (
        <div className="flex items-center justify-center py-16 text-gray-500">
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          Chargement…
        </div>
      ) : error ? (
        <p className="py-8 text-sm text-red-600">{error}</p>
      ) : offers.length === 0 ? (
        <p className="py-8 text-sm text-gray-500">Vous n&apos;avez pas encore fait d&apos;offre.</p>
      ) : (
        <ul className="divide-y divide-gray-100 overflow-hidden rounded-lg border border-gray-100">
          {offers.map((offer) => {
            const badge = statusBadge(offer.status, offer.counter_amount);
            const busy = actionId === offer.id;
            const image = offer.product.image || PRODUCT_IMAGE_PLACEHOLDER;

            return (
              <li key={offer.id} className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center">
                <div className="flex min-w-0 flex-1 gap-4">
                  <Link href={`/product/${offer.product_id}`} className="h-20 w-16 shrink-0 overflow-hidden bg-gray-50">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={image} alt="" className="h-full w-full object-cover mix-blend-multiply" />
                  </Link>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-gray-900">
                      {offer.product.brand || offer.product.title}
                    </p>
                    <p className="truncate text-sm text-gray-600">{offer.product.title}</p>
                    <p className="mt-1 text-xs text-gray-500">
                      Votre offre : {formatPrice(offer.amount)} · Prix : {formatPrice(offer.product.price)}
                    </p>
                    <p className="mt-1 text-xs text-gray-400">Boutique {offer.shop_name}</p>
                    <span className={`mt-2 inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${badge.className}`}>
                      {badge.label}
                    </span>
                  </div>
                </div>

                <div className="flex shrink-0 flex-wrap gap-2 sm:flex-col sm:items-end">
                  {offer.status === 'ACCEPTED' && (
                    <Link
                      href={`/product/${offer.product_id}`}
                      className="bg-black px-4 py-2 text-xs font-bold text-white hover:bg-gray-800"
                    >
                      Commander maintenant
                    </Link>
                  )}
                  {offer.status === 'COUNTER' && (
                    <>
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => void handleAcceptCounter(offer.id)}
                        className="bg-black px-4 py-2 text-xs font-bold text-white hover:bg-gray-800 disabled:opacity-60"
                      >
                        Accepter
                      </button>
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => void handleDeclineCounter(offer.id)}
                        className="border border-gray-300 px-4 py-2 text-xs font-bold text-gray-700 hover:bg-gray-50 disabled:opacity-60"
                      >
                        Refuser
                      </button>
                    </>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
