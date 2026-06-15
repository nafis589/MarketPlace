'use client';

import React from 'react';
import { MapPin, Heart } from 'lucide-react';

const ROW = {
  brand: 'min-h-[1.25rem]',
  title: 'min-h-[2.5rem]',
  condition: 'min-h-[1.25rem]',
  price: 'min-h-[2.75rem]',
  region: 'min-h-[1rem]',
} as const;

interface ProductCardContentProps {
  brand: string;
  title: string;
  condition: string;
  price: React.ReactNode;
  region: string;
  onFavoriteClick?: (e: React.MouseEvent) => void;
}

export default function ProductCardContent({
  brand,
  title,
  condition,
  price,
  region,
  onFavoriteClick,
}: ProductCardContentProps) {
  return (
    <div className="flex flex-col gap-1 mt-1 flex-1">
      <div className={`flex justify-between items-start gap-2 ${ROW.brand}`}>
        <p className="font-bold text-sm uppercase text-gray-900 tracking-wide truncate line-clamp-1 flex-1">
          {brand || '\u00A0'}
        </p>
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onFavoriteClick?.(e);
          }}
          className="shrink-0"
          aria-label="Ajouter aux favoris"
        >
          <Heart
            className="w-5 h-5 text-gray-900 hover:text-red-500 transition-colors cursor-pointer"
            strokeWidth={1}
          />
        </button>
      </div>

      <p className={`text-gray-600 text-sm line-clamp-2 ${ROW.title}`}>{title}</p>

      <p className={`text-gray-500 text-sm line-clamp-1 ${ROW.condition}`}>
        {condition || '\u00A0'}
      </p>

      <div className={`mt-auto pt-1 flex items-end ${ROW.price}`}>{price}</div>

      <div className={`flex items-center gap-1 text-xs text-gray-500 ${ROW.region}`}>
        <MapPin size={12} strokeWidth={2} className="shrink-0" />
        <span className="truncate">{region || '\u00A0'}</span>
      </div>
    </div>
  );
}
