'use client';

import { X } from 'lucide-react';
import type { ShippingFeeResult } from '@/lib/types';

interface ShippingInfoCardProps {
  result: ShippingFeeResult;
  className?: string;
  onClose?: () => void;
}

function formatFcfa(value: number): string {
  return `${Math.round(value).toLocaleString('fr-FR')} FCFA`;
}

function formatDistance(km: number): string {
  return km.toLocaleString('fr-FR', { minimumFractionDigits: 0, maximumFractionDigits: 1 });
}

export default function ShippingInfoCard({ result, className, onClose }: ShippingInfoCardProps) {
  const title =
    result.method === 'PER_KM' && result.distanceKm != null
      ? `Livraison locale — ${formatDistance(result.distanceKm)} km`
      : 'Livraison inter-région';

  const tarifMatch = result.detail?.match(/×\s*([\d\s]+)\s*FCFA\/km/);
  const tarif = tarifMatch ? `${tarifMatch[1].trim()} FCFA/km` : '—';
  const zone = result.detail?.includes(' vers ')
    ? (result.detail.split(' vers ')[1] ?? '—')
    : '—';

  const columns = [
    { label: 'Calcul', value: result.detail ?? '—' },
    { label: 'Frais', value: formatFcfa(result.fee) },
    {
      label: result.method === 'PER_KM' ? 'Tarif' : 'Zone',
      value: result.method === 'PER_KM' ? tarif : zone,
    },
  ];

  return (
    <div
      className={[
        'bg-white rounded-[10px] shadow-[0_4px_24px_rgba(0,0,0,0.10)] pointer-events-auto',
        'px-5 py-5 sm:px-6 sm:py-5',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {/* En-tête : titre + fermer */}
      <div className="flex items-start justify-between gap-4 mb-5">
        <h3 className="text-[15px] sm:text-[16px] font-bold text-[#1A1A1A] leading-snug">
          {title}
        </h3>
        {onClose && (
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

      {/* Colonnes label / valeur */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        {columns.map((col) => (
          <div key={col.label} className="min-w-0">
            <p className="text-[12px] text-[#AAAAAA] mb-1 leading-none">{col.label}</p>
            <p className="text-[13px] sm:text-[14px] font-medium text-[#1A1A1A] leading-snug break-words">
              {col.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
