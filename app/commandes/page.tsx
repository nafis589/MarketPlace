'use client';

import React, { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { Package, Loader2 } from 'lucide-react';
import Header from '@/app/components/sections/Header';
import Footer from '@/app/components/sections/Footer';
import { useAuth } from '@/app/context/AuthContext';
import { useUI } from '@/app/context/UIContext';
import { ordersApi, type OrderStatus, type StoreOrder } from '@/lib/orders-api';
import {
  formatOrderDate,
  formatOrderRef,
  formatPrice,
  getOrderStatusBadgeClass,
  getOrderStatusLabel,
} from '@/app/lib/order-utils';

type StatusFilter = 'ALL' | OrderStatus | 'ACTIVE';

const STATUS_TABS: { key: StatusFilter; label: string }[] = [
  { key: 'ALL', label: 'Toutes' },
  { key: 'PENDING', label: 'En attente' },
  { key: 'ACTIVE', label: 'En cours' },
  { key: 'DELIVERED', label: 'Livrées' },
  { key: 'CANCELLED', label: 'Annulées' },
  { key: 'REFUSED', label: 'Refusées' },
];

const ACTIVE_STATUSES: OrderStatus[] = ['CONFIRMED', 'PREPARING', 'SHIPPED'];

function matchesFilter(order: StoreOrder, filter: StatusFilter): boolean {
  if (filter === 'ALL') return true;
  if (filter === 'ACTIVE') return ACTIVE_STATUSES.includes(order.status);
  return order.status === filter;
}

export default function CommandesPage() {
  const { user, isLoading: authLoading } = useAuth();
  const { openLogin } = useUI();
  const [orders, setOrders] = useState<StoreOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('ALL');

  useEffect(() => {
    if (!authLoading && !user) {
      openLogin();
    }
  }, [authLoading, user, openLogin]);

  const loadOrders = useCallback(async () => {
    if (!user) return;
    setIsLoading(true);
    setError(null);
    try {
      const apiStatus = statusFilter !== 'ALL' && statusFilter !== 'ACTIVE'
        ? statusFilter
        : undefined;
      const { data } = await ordersApi.listOrders({ status: apiStatus, limit: 50 });
      const list = statusFilter === 'ACTIVE'
        ? data.filter((o) => ACTIVE_STATUSES.includes(o.status))
        : data;
      setOrders(list);
    } catch {
      setError('Impossible de charger vos commandes');
      setOrders([]);
    } finally {
      setIsLoading(false);
    }
  }, [user, statusFilter]);

  useEffect(() => {
    if (user) {
      void loadOrders();
    }
  }, [user, loadOrders]);

  const filtered = orders.filter((o) => matchesFilter(o, statusFilter));

  return (
    <main>
      <Header />

      <div className="pt-[100px] md:pt-[120px] min-h-screen bg-white">
        <div className="max-w-[900px] mx-auto px-4 md:px-8 py-8 md:py-12">
          <nav className="flex items-center gap-2 text-xs text-gray-400 mb-6">
            <Link href="/" className="hover:text-black transition-colors">Accueil</Link>
            <span>/</span>
            <span className="text-black font-medium">Mes commandes</span>
          </nav>

          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-serif font-medium tracking-tight">
              Mes commandes
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Suivez et gérez vos achats
            </p>
          </div>

          <div className="border-b border-gray-200 mb-6 flex gap-0 overflow-x-auto scrollbar-hide">
            {STATUS_TABS.map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setStatusFilter(tab.key)}
                className={`flex-shrink-0 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  statusFilter === tab.key
                    ? 'border-black text-black'
                    : 'border-transparent text-gray-500 hover:text-black'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {authLoading || (user && isLoading) ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
            </div>
          ) : error ? (
            <p className="text-center text-sm text-red-500 py-16">{error}</p>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16 text-gray-400 border border-gray-200 rounded-xl">
              <Package className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p className="text-sm">Aucune commande trouvée</p>
              <Link href="/" className="inline-block mt-4 text-sm underline text-black">
                Découvrir nos articles
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {filtered.map((order) => (
                <Link
                  key={order.id}
                  href={`/commandes/${order.id}`}
                  className="block border border-gray-200 rounded-xl p-4 md:p-5 hover:border-gray-300 hover:shadow-sm transition-all"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                    <div>
                      <p className="font-mono text-sm font-semibold text-black">
                        {formatOrderRef(order.id)}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">{formatOrderDate(order.created_at)}</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={getOrderStatusBadgeClass(order.status)}>
                        {getOrderStatusLabel(order.status)}
                      </span>
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                        order.payment_status === 'PAID'
                          ? 'bg-green-100 text-green-700'
                          : order.payment_status === 'REFUNDED'
                          ? 'bg-gray-100 text-gray-600'
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {order.payment_status === 'PAID' && 'Payé ✓'}
                        {order.payment_status === 'UNPAID' && 'Non payé'}
                        {order.payment_status === 'FAILED' && 'Paiement échoué'}
                        {order.payment_status === 'REFUNDED' && 'Remboursé'}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">
                      {order.payment_method === 'CARD' ? 'Carte bancaire (Stripe)' : 'Paiement à la livraison'}
                    </span>
                    <span className="font-semibold text-black">{formatPrice(order.total_amount)}</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </main>
  );
}
