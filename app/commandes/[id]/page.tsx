'use client';

import React, { use, useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Loader2 } from 'lucide-react';
import Header from '@/app/components/sections/Header';
import Footer from '@/app/components/sections/Footer';
import ConfirmModal from '@/app/components/ui/ConfirmModal';
import { PRODUCT_IMAGE_PLACEHOLDER } from '@/app/lib/mapHomeProduct';
import { ordersApi, type StoreOrderDetail } from '@/lib/orders-api';
import {
  TIMELINE_STEPS,
  formatOrderDateLong,
  formatOrderRef,
  formatPrice,
  formatShippingSummary,
  getItemsSubtotal,
  getOrderStatusBadgeClass,
  getOrderStatusLabel,
  getTimelineStep,
} from '@/app/lib/order-utils';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function CommandeDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const router = useRouter();
  const [order, setOrder] = useState<StoreOrderDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCancelling, setIsCancelling] = useState(false);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);

  const loadOrder = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { data } = await ordersApi.getOrder(id);
      setOrder(data);
    } catch {
      setError('Commande introuvable');
      setOrder(null);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    void loadOrder();
  }, [loadOrder]);

  const handleCancel = async () => {
    if (!order || order.status !== 'PENDING') return;
    setIsCancelling(true);
    try {
      await ordersApi.cancelOrder(order.id);
      setCancelModalOpen(false);
      await loadOrder();
    } catch {
      setError('Impossible d\'annuler la commande');
    } finally {
      setIsCancelling(false);
    }
  };

  const activeStep = order ? getTimelineStep(order.status) : 0;
  const subtotal = order ? getItemsSubtotal(order) : 0;

  return (
    <main>
      <Header />

      <div className="pt-[100px] md:pt-[120px] min-h-screen bg-white">
        <div className="max-w-[900px] mx-auto px-4 md:px-8 py-8 md:py-12">
          <Link
            href="/commandes"
            className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-black transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour aux commandes
          </Link>

          {isLoading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
            </div>
          ) : error || !order ? (
            <div className="text-center py-16 text-gray-500">
              <p>{error ?? 'Commande introuvable'}</p>
              <button
                type="button"
                onClick={() => router.push('/commandes')}
                className="mt-4 text-sm underline text-black"
              >
                Mes commandes
              </button>
            </div>
          ) : (
            <>
              <div className="flex flex-wrap items-start justify-between gap-4 mb-8">
                <div>
                  <h1 className="text-2xl md:text-3xl font-serif font-medium tracking-tight">
                    {formatOrderRef(order.id)}
                  </h1>
                  <p className="text-sm text-gray-500 mt-1">
                    Passée le {formatOrderDateLong(order.created_at)} · {order.vendor.shop_name}
                  </p>
                </div>
                <span className={getOrderStatusBadgeClass(order.status)}>
                  {getOrderStatusLabel(order.status)}
                </span>
              </div>

              {order.status !== 'CANCELLED' && (
                <section className="border border-gray-200 rounded-2xl p-5 md:p-7 mb-6">
                  <h2 className="text-base font-semibold mb-6">Suivi de commande</h2>
                  <div className="flex items-center justify-between relative px-2">
                    <div className="absolute top-4 left-8 right-8 h-0.5 bg-gray-200" />
                    {activeStep >= 0 && (
                      <div
                        className="absolute top-4 left-8 h-0.5 bg-black transition-all"
                        style={{
                          width: `calc(${(activeStep / (TIMELINE_STEPS.length - 1)) * 100}% - 2rem)`,
                          maxWidth: 'calc(100% - 4rem)',
                        }}
                      />
                    )}
                    {TIMELINE_STEPS.map((label, index) => {
                      const done = activeStep >= 0 && index < activeStep;
                      const current = activeStep === index;
                      const future = activeStep >= 0 && index > activeStep;
                      return (
                        <div key={label} className="relative flex flex-col items-center flex-1 z-10">
                          <div
                            className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${
                              done || current
                                ? 'bg-black border-black text-white'
                                : 'bg-white border-gray-300 text-gray-400'
                            } ${current ? 'ring-4 ring-black/10' : ''}`}
                          >
                            <span className="text-xs font-bold">{index + 1}</span>
                          </div>
                          <p
                            className={`mt-2 text-xs text-center font-medium ${
                              future ? 'text-gray-400' : 'text-black'
                            }`}
                          >
                            {label}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </section>
              )}

              <section className="border border-gray-200 rounded-2xl overflow-hidden mb-6">
                <div className="px-5 py-4 border-b border-gray-100 font-semibold">
                  Articles
                </div>
                <div className="divide-y divide-gray-100">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex gap-4 p-4 md:p-5">
                      <div className="w-16 h-20 bg-gray-100 shrink-0 overflow-hidden">
                        <img
                          src={item.product_snapshot.image || PRODUCT_IMAGE_PLACEHOLDER}
                          alt={item.product_snapshot.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm">{item.product_snapshot.title}</p>
                        {item.product_snapshot.brand && (
                          <p className="text-xs text-gray-500 mt-0.5">{item.product_snapshot.brand}</p>
                        )}
                        <p className="text-xs text-gray-500 mt-1">Qté : {item.quantity}</p>
                        {item.offer_id && item.original_price != null && (
                          <span className="mt-1.5 inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-semibold text-green-700">
                            Offre acceptée
                          </span>
                        )}
                      </div>
                      <div className="shrink-0 text-right">
                        <p className="text-sm font-semibold">
                          {formatPrice(item.unit_price * item.quantity)}
                        </p>
                        {item.offer_id && item.original_price != null && (
                          <p className="text-xs text-gray-400 line-through">
                            {formatPrice(item.original_price * item.quantity)}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <section className="border border-gray-200 rounded-2xl p-5 md:p-7 mb-6 space-y-3 text-sm">
                <h2 className="font-semibold mb-4">Livraison</h2>
                <p className="text-gray-600">
                  {order.shipping_address.first_name} {order.shipping_address.last_name}
                </p>
                <p className="text-gray-600">{order.shipping_address.phone}</p>
                {order.shipping_address.notes && (
                  <p className="text-gray-500 italic">{order.shipping_address.notes}</p>
                )}
                <p className="text-gray-600 pt-2 border-t border-gray-100">
                  {formatShippingSummary(order)}
                </p>
              </section>

              <section className="border border-gray-200 rounded-2xl p-5 md:p-7 mb-6">
                <div className="flex flex-col gap-2 text-sm max-w-sm ml-auto">
                  <div className="flex justify-between text-gray-600">
                    <span>Sous-total articles</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Livraison</span>
                    <span>{formatPrice(order.shipping_fee)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-base pt-2 border-t border-gray-200">
                    <span>Total</span>
                    <span>{formatPrice(order.total_amount)}</span>
                  </div>
                </div>
              </section>

              {order.status === 'PENDING' && (
                <button
                  type="button"
                  onClick={() => setCancelModalOpen(true)}
                  disabled={isCancelling}
                  className="w-full md:w-auto px-6 py-3 border border-red-300 text-red-600 text-sm font-medium hover:bg-red-50 disabled:opacity-50 transition-colors"
                >
                  Annuler la commande
                </button>
              )}
            </>
          )}
        </div>
      </div>

      <Footer />

      <ConfirmModal
        open={cancelModalOpen}
        title="Annuler cette commande ?"
        description="Cette action est définitive. Vous ne pourrez plus modifier cette commande."
        confirmLabel="Oui, annuler"
        cancelLabel="Non, garder"
        variant="danger"
        isLoading={isCancelling}
        onConfirm={() => void handleCancel()}
        onCancel={() => {
          if (!isCancelling) setCancelModalOpen(false);
        }}
      />
    </main>
  );
}
