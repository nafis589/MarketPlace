'use client';

import type { ReactNode } from 'react';
import { Loader2 } from 'lucide-react';
import type { CartShippingCalculateResult, CartVendorShipping } from '@/lib/types';
import { formatPrice as formatFcfa } from '@/app/utils/formatPrice';

interface CheckoutOrderSummaryProps {
  shippingResult: CartShippingCalculateResult | null;
  isCalculating?: boolean;
  title?: string;
}

function formatShippingLabel(vendor: CartVendorShipping): string {
  const { shipping } = vendor;
  if (shipping.method === 'FIXED') {
    if (shipping.detail?.includes('inter-région')) return 'prix fixe';
    return shipping.detail || 'prix fixe';
  }
  return shipping.detail || '—';
}

function vendorSubtotal(vendor: CartVendorShipping): number {
  return vendor.items_total + vendor.shipping.fee;
}

function RecapRow({
  label,
  value,
  muted,
  bold,
}: {
  label: ReactNode;
  value: ReactNode;
  muted?: boolean;
  bold?: boolean;
}) {
  return (
    <div
      className={[
        'flex justify-between gap-3 text-[14px] leading-snug',
        muted ? 'text-[#999]' : 'text-[#1A1A1A]',
        bold ? 'font-semibold' : '',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <span className="min-w-0">{label}</span>
      <span className="shrink-0 text-right font-medium">{value}</span>
    </div>
  );
}

export default function CheckoutOrderSummary({
  shippingResult,
  isCalculating = false,
  title = 'Récapitulatif commande',
}: CheckoutOrderSummaryProps) {
  const grandTotal = shippingResult
    ? shippingResult.vendors
        .filter((v) => !v.shipping.error)
        .reduce((sum, v) => sum + vendorSubtotal(v), 0)
    : null;

  return (
    <div className="space-y-4">
      <h3 className="text-[16px] font-bold text-[#1A1A1A]">{title}</h3>

      {isCalculating && (
        <div className="flex items-center justify-center gap-2 py-6 text-[13px] text-[#777]">
          <Loader2 size={14} className="animate-spin shrink-0" />
          Calcul des livraisons…
        </div>
      )}

      {!isCalculating && !shippingResult && (
        <p className="text-[13px] text-[#999]">
          Sélectionnez une adresse sur la carte pour voir le récapitulatif.
        </p>
      )}

      {!isCalculating && shippingResult && (
        <div className="space-y-4">
          {shippingResult.vendors.map((vendor, index) => {
            const hasError = !!vendor.shipping.error;
            const subtotal = vendorSubtotal(vendor);
            const isLast = index === shippingResult.vendors.length - 1;

            return (
              <div
                key={vendor.vendor_id}
                className={[
                  'space-y-2.5 pb-4',
                  !isLast ? 'border-b border-[#E0E0E0]' : '',
                  hasError ? 'opacity-60' : '',
                ].join(' ')}
              >
                <div className="flex items-start justify-between gap-3">
                  <p className="text-[14px] font-semibold text-[#1A1A1A] leading-snug">
                    {vendor.shop_name}
                  </p>
                  {hasError && (
                    <span className="shrink-0 text-[10px] font-medium px-2 py-0.5 rounded-full bg-red-100 text-red-700">
                      Non livrable
                    </span>
                  )}
                </div>

                <div className="space-y-2">
                  {vendor.items.map((item) => (
                    <RecapRow
                      key={item.product_id}
                      muted={hasError}
                      label={
                        <>
                          {item.title}
                          {item.quantity > 1 ? ` × ${item.quantity}` : ''}
                        </>
                      }
                      value={formatFcfa(item.price * item.quantity)}
                    />
                  ))}

                  {hasError ? (
                    <p className="text-[12px] text-red-600 pt-1">
                      {vendor.shipping.error?.message}
                    </p>
                  ) : (
                    <>
                      <RecapRow
                        label={
                          <span className="text-[#666] font-normal">
                            Livraison ({formatShippingLabel(vendor)})
                          </span>
                        }
                        value={formatFcfa(vendor.shipping.fee)}
                      />
                      <RecapRow bold label="Sous-total" value={formatFcfa(subtotal)} />
                    </>
                  )}
                </div>
              </div>
            );
          })}

          <div className="flex justify-between items-baseline gap-3 pt-4 border-t border-[#E0E0E0]">
            <span className="text-[15px] font-bold text-[#1A1A1A]">TOTAL GÉNÉRAL</span>
            <span className="text-[24px] font-bold text-[#1A1A1A]">
              {grandTotal !== null ? formatFcfa(grandTotal) : '—'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
