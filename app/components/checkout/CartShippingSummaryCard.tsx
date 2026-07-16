'use client';

import { X, XCircle } from 'lucide-react';
import type { CartShippingCalculateResult, CartVendorShipping } from '@/lib/types';
import { formatPrice as formatFcfa } from '@/app/utils/formatPrice';

const TOGO_REGION_LABELS: Record<string, string> = {
  maritime: 'Maritime',
  plateaux: 'Plateaux',
  centrale: 'Centrale',
  kara: 'Kara',
  savanes: 'Savanes',
};

interface CartShippingSummaryCardProps {
  result?: CartShippingCalculateResult | null;
  isCalculating?: boolean;
  isOutsideTogo?: boolean;
  className?: string;
  onClose?: () => void;
}

function formatTarif(vendor: CartVendorShipping): string {
  const { shipping } = vendor;
  if (shipping.method === 'PER_KM') {
    const tarifMatch = shipping.detail?.match(/×\s*([\d\s]+)\s*FCFA\/km/);
    return tarifMatch ? `${tarifMatch[1].trim()} FCFA/km` : '—';
  }
  if (shipping.detail?.includes(' vers ')) {
    return shipping.detail.split(' vers ')[1] ?? '—';
  }
  return 'Tarif fixe';
}

function formatCoveredRegions(regionIds?: string[]): string {
  if (!regionIds?.length) return '';
  const names = regionIds.map((id) => TOGO_REGION_LABELS[id] ?? id);
  return `Livre dans : ${names.join(', ')}`;
}

function formatDistance(km: number): string {
  return km.toLocaleString('fr-FR', { minimumFractionDigits: 0, maximumFractionDigits: 1 });
}

function VendorShippingBlock({
  vendor,
  showShopName = true,
}: {
  vendor: CartVendorShipping;
  showShopName?: boolean;
}) {
  const hasError = !!vendor.shipping.error;
  const tarif = formatTarif(vendor);

  return (
    <div className={hasError ? 'opacity-70' : ''}>
      {showShopName && (
        <div className="flex items-start justify-between gap-3 mb-3">
          <p className="text-[14px] font-semibold text-[#1A1A1A] leading-snug">{vendor.shop_name}</p>
          {hasError && (
            <span className="shrink-0 text-[10px] font-medium px-2 py-0.5 rounded-full bg-orange-100 text-orange-700">
              Ne livre pas ici
            </span>
          )}
        </div>
      )}

      {hasError ? (
        <div className="space-y-1">
          <p className="text-[12px] font-medium leading-relaxed text-[#1A1A1A]">
            {vendor.shipping.error?.message}
          </p>
          {vendor.shipping.error?.code === 'REGION_NOT_COVERED' && (
            <p className="text-[12px] font-medium leading-relaxed text-[#1A1A1A]">
              {formatCoveredRegions(vendor.shipping.error.coveredRegions)}
            </p>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          <div className="min-w-0">
            <p className="text-[12px] text-[#AAAAAA] mb-1 leading-none">Calcul</p>
            <p className="text-[13px] sm:text-[14px] font-medium text-[#1A1A1A] leading-snug break-words">
              {vendor.shipping.detail || '—'}
            </p>
          </div>
          <div className="min-w-0">
            <p className="text-[12px] text-[#AAAAAA] mb-1 leading-none">Frais</p>
            <p className="text-[13px] sm:text-[14px] font-medium text-[#1A1A1A] leading-snug">
              {formatFcfa(vendor.shipping.fee)}
            </p>
          </div>
          <div className="min-w-0">
            <p className="text-[12px] text-[#AAAAAA] mb-1 leading-none">
              {vendor.shipping.method === 'PER_KM' ? 'Tarif' : 'Zone'}
            </p>
            <p className="text-[13px] sm:text-[14px] font-medium text-[#1A1A1A] leading-snug break-words">
              {tarif}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

function panelTitle(result: CartShippingCalculateResult): string {
  if (result.vendors.length === 1) {
    const vendor = result.vendors[0]!;
    if (!vendor.shipping.error && vendor.shipping.method === 'PER_KM' && vendor.shipping.distanceKm != null) {
      return `Livraison locale — ${formatDistance(vendor.shipping.distanceKm)} km`;
    }
    if (!vendor.shipping.error) return 'Livraison inter-région';
  }
  return 'Frais de livraison';
}

export default function CartShippingSummaryCard({
  result,
  isCalculating = false,
  isOutsideTogo = false,
  className,
  onClose,
}: CartShippingSummaryCardProps) {
  const vendorCount = result?.vendors.length ?? 0;
  const isScrollable = vendorCount > 2;

  const title = isCalculating
    ? 'Calcul des livraisons'
    : isOutsideTogo
      ? 'Livraison indisponible'
      : result
        ? panelTitle(result)
        : 'Frais de livraison';

  return (
    <div
      className={[
        'bg-white rounded-[10px] shadow-[0_4px_24px_rgba(0,0,0,0.10)] pointer-events-auto w-full',
        'flex flex-col overflow-hidden',
        isScrollable ? 'max-h-full' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <div className="flex items-start justify-between gap-4 px-5 pt-5 pb-3 shrink-0">
        <h3 className="text-[15px] sm:text-[16px] font-bold text-[#1A1A1A] leading-snug">{title}</h3>
        {onClose && !isCalculating && (
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 w-6 h-6 flex items-center justify-center text-[#BBBBBB] hover:text-[#1A1A1A] transition-colors -mt-0.5"
            aria-label="Fermer"
          >
            <X size={16} strokeWidth={1.75} />
          </button>
        )}
      </div>

      <div
        className={[
          'px-5 pb-5',
          isScrollable
            ? 'overflow-y-auto flex-1 min-h-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden'
            : '',
        ].join(' ')}
      >
        {isCalculating && (
          <div className="flex flex-col items-center justify-center gap-3 py-4 text-[#666]">
            <div className="w-6 h-6 border-2 border-[#1A1A1A] border-t-transparent rounded-full animate-spin" />
            <p className="text-[14px]">Calcul des livraisons...</p>
          </div>
        )}

        {!isCalculating && isOutsideTogo && (
          <div className="flex flex-col items-center justify-center gap-3 py-2 text-center">
            <XCircle size={32} className="text-red-500" strokeWidth={1.75} />
            <p className="text-[14px] font-medium text-[#1A1A1A]">
              Votre position est hors du Togo.
            </p>
          </div>
        )}

        {!isCalculating && !isOutsideTogo && result && (
          <div className={vendorCount > 1 ? 'space-y-4' : ''}>
            {result.vendors.map((vendor, index) => (
              <div
                key={vendor.vendor_id}
                className={index < result.vendors.length - 1 ? 'pb-4 border-b border-[#EBEBEB]' : ''}
              >
                <VendorShippingBlock vendor={vendor} showShopName={vendorCount > 1} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
