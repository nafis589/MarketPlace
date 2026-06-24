'use client';

import React, { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { Tag, Loader2 } from 'lucide-react';
import Header from '@/app/components/sections/Header';
import Footer from '@/app/components/sections/Footer';
import { useAuth } from '@/app/context/AuthContext';
import { useUI } from '@/app/context/UIContext';
import { offersApi, type OfferStatus, type StoreOffer } from '@/lib/offers-api';
import { formatPrice } from '@/app/utils/formatPrice';
import { PRODUCT_IMAGE_PLACEHOLDER } from '@/app/lib/mapHomeProduct';

type StatusFilter = 'ALL' | OfferStatus;

const STATUS_TABS: { key: StatusFilter; label: string }[] = [
  { key: 'ALL', label: 'Toutes' },
  { key: 'PENDING', label: 'En attente' },
  { key: 'ACCEPTED', label: 'Acceptées' },
  { key: 'DECLINED', label: 'Refusées' },
  { key: 'COUNTER', label: 'Contre-offres' },
  { key: 'EXPIRED', label: 'Expirées' },
];

function formatOfferDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '';
  return new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
}

function getOfferStatusLabel(status: OfferStatus, counterAmount: number | null): string {
  switch (status) {
    case 'PENDING':
      return 'En attente';
    case 'ACCEPTED':
      return 'Acceptée ✓';
    case 'DECLINED':
      return 'Refusée';
    case 'COUNTER':
      return counterAmount != null ? `Contre-offre : ${formatPrice(counterAmount)}` : 'Contre-offre';
    case 'EXPIRED':
      return 'Expirée';
    default:
      return status;
  }
}

function getOfferStatusBadgeClass(status: OfferStatus): string {
  const base = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium';
  switch (status) {
    case 'ACCEPTED':
      return `${base} bg-green-100 text-green-700`;
    case 'COUNTER':
      return `${base} bg-blue-100 text-blue-700`;
    case 'PENDING':
      return `${base} bg-amber-100 text-amber-700`;
    case 'DECLINED':
      return `${base} bg-red-100 text-red-600`;
    case 'EXPIRED':
      return `${base} bg-gray-100 text-gray-600`;
    default:
      return `${base} bg-gray-100 text-gray-600`;
  }
}

export default function OffresPage() {
  const { user, isLoading: authLoading } = useAuth();
  const { openLogin } = useUI();
  const [offers, setOffers] = useState<StoreOffer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('ALL');
  const [actionId, setActionId] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      openLogin();
    }
  }, [authLoading, user, openLogin]);

  const load = useCallback(async () => {
    if (!user) return;
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
  }, [user]);

  useEffect(() => {
    if (user) void load();
  }, [user, load]);

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

  const filtered =
    statusFilter === 'ALL' ? offers : offers.filter((o) => o.status === statusFilter);

  return (
    <main>
      <Header />

      <div className="min-h-screen bg-white pt-[100px] md:pt-[120px]">
        <div className="mx-auto max-w-[900px] px-4 py-8 md:px-8 md:py-12">
          <nav className="mb-6 flex items-center gap-2 text-xs text-gray-400">
            <Link href="/" className="transition-colors hover:text-black">
              Accueil
            </Link>
            <span>/</span>
            <span className="font-medium text-black">Mes offres</span>
          </nav>

          <div className="mb-8">
            <h1 className="font-serif text-2xl font-medium tracking-tight md:text-3xl">
              Mes offres
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Suivez vos négociations et répondez aux contre-offres
            </p>
          </div>

          <div className="mb-6 flex gap-0 overflow-x-auto border-b border-gray-200 scrollbar-hide">
            {STATUS_TABS.map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setStatusFilter(tab.key)}
                className={`flex-shrink-0 border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
                  statusFilter === tab.key
                    ? 'border-black text-black'
                    : 'border-transparent text-gray-500 hover:text-black'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {authLoading || (user && loading) ? (
            <div className="flex justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            </div>
          ) : error ? (
            <p className="py-16 text-center text-sm text-red-500">{error}</p>
          ) : filtered.length === 0 ? (
            <div className="rounded-xl border border-gray-200 py-16 text-center text-gray-400">
              <Tag className="mx-auto mb-3 h-10 w-10 opacity-30" />
              <p className="text-sm">Aucune offre trouvée</p>
              <Link href="/nouveautes" className="mt-4 inline-block text-sm text-black underline">
                Découvrir nos articles
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {filtered.map((offer) => {
                const busy = actionId === offer.id;
                const image = offer.product.image || PRODUCT_IMAGE_PLACEHOLDER;

                return (
                  <div
                    key={offer.id}
                    className="rounded-xl border border-gray-200 p-4 transition-all hover:border-gray-300 hover:shadow-sm md:p-5"
                  >
                    <div className="flex gap-4">
                      <Link
                        href={`/product/${offer.product_id}`}
                        className="h-20 w-16 shrink-0 overflow-hidden rounded-md bg-gray-50"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={image}
                          alt=""
                          className="h-full w-full object-cover mix-blend-multiply"
                        />
                      </Link>

                      <div className="min-w-0 flex-1">
                        <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-black">
                              {offer.product.brand || offer.product.title}
                            </p>
                            <p className="truncate text-sm text-gray-600">{offer.product.title}</p>
                            <p className="mt-1 text-xs text-gray-500">
                              {formatOfferDate(offer.created_at)} · {offer.shop_name}
                            </p>
                          </div>
                          <span className={getOfferStatusBadgeClass(offer.status)}>
                            {getOfferStatusLabel(offer.status, offer.counter_amount)}
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
                          <span className="text-gray-500">
                            Votre offre :{' '}
                            <span className="font-medium text-black">{formatPrice(offer.amount)}</span>
                            <span className="mx-1 text-gray-300">·</span>
                            Prix : {formatPrice(offer.product.price)}
                          </span>

                          <div className="flex flex-wrap gap-2">
                            {offer.status === 'ACCEPTED' && (
                              <Link
                                href={`/product/${offer.product_id}`}
                                className="bg-black px-4 py-2 text-xs font-bold text-white transition-colors hover:bg-gray-800"
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
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </main>
  );
}
