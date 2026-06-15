'use client';

import React, { useRef } from 'react';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { formatPrice } from '@/app/utils/formatPrice';
import ProductCardContent from '@/app/components/ProductCardContent';

export type BadgeType = 'BLACK_FRIDAY' | 'WE_LOVE' | null;

export interface Product {
  id: number | string;
  brand: string;
  name: string;
  size: string;
  price: number;
  oldPrice?: number;
  currency: string;
  location: string;
  imageUrl: string;
  badge: BadgeType;
  hasDuties?: boolean;
}

const ProductBadge = ({ type }: { type: BadgeType }) => {
  if (type === 'BLACK_FRIDAY') {
    return (
      <span className="bg-[#3D0A0A] text-white text-[10px] font-bold px-2 py-1 uppercase tracking-wider">
        Black Friday
      </span>
    );
  }
  if (type === 'WE_LOVE') {
    return (
      <span className="bg-white text-gray-800 border border-gray-300 text-[10px] font-bold px-2 py-1 uppercase tracking-wider">
        We Love
      </span>
    );
  }
  return null;
};

interface HomeProductSectionProps {
  title: string;
  products: Product[];
  viewAllHref?: string;
}

export default function HomeProductSection({ title, products, viewAllHref }: HomeProductSectionProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollRight = () => {
    scrollContainerRef.current?.scrollBy({ left: 300, behavior: 'smooth' });
  };

  return (
    <div className="bg-gray-50 py-10 px-6 font-sans">
      <div className="max-w-[1600px] mx-auto flex items-end justify-between mb-6 gap-4">
        <h2 className="text-4xl font-serif text-[#0B1E3B]">{title}</h2>
        {viewAllHref && (
          <Link
            href={viewAllHref}
            className="text-sm font-bold uppercase tracking-widest border-b border-black pb-1 hover:text-gray-600 hover:border-gray-600 transition-colors shrink-0"
          >
            Voir tout
          </Link>
        )}
      </div>

      <div className="relative max-w-[1600px] mx-auto group/section">
        <div
          ref={scrollContainerRef}
          className="flex items-stretch overflow-x-auto snap-x snap-mandatory scrollbar-hide bg-white border border-gray-200 divide-x divide-gray-200 -mr-6 md:mr-0"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {products.map((product) => (
            <Link
              key={product.id}
              href={`/product/product-${product.id}`}
              className="snap-start shrink-0 w-1/2 sm:w-[280px] md:w-[300px] xl:w-1/5 group relative p-4 flex flex-col h-full hover:bg-gray-50 transition-colors cursor-pointer"
            >
              <div className="relative aspect-[3/3.5] mb-3 w-full overflow-hidden bg-gray-100 shrink-0">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {product.badge && (
                  <div className="absolute bottom-0 left-0 z-10">
                    <ProductBadge type={product.badge} />
                  </div>
                )}
              </div>

              <ProductCardContent
                brand={product.brand}
                title={product.name}
                condition={product.size}
                region={product.location}
                price={
                  product.oldPrice ? (
                    <div className="flex flex-col leading-tight">
                      <span className="text-gray-400 text-sm line-through decoration-1">
                        {product.currency === 'FCFA'
                          ? formatPrice(product.oldPrice)
                          : `${product.currency}${product.oldPrice}`}
                      </span>
                      <span className="text-[#D32F2F] font-bold text-base">
                        {product.currency === 'FCFA'
                          ? formatPrice(product.price)
                          : `${product.currency}${product.price}`}
                      </span>
                    </div>
                  ) : (
                    <span className="text-gray-900 font-bold text-base">
                      {product.currency === 'FCFA'
                        ? formatPrice(product.price)
                        : `${product.currency}${product.price}`}
                    </span>
                  )
                }
              />
            </Link>
          ))}
        </div>

        <button
          type="button"
          onClick={scrollRight}
          className="absolute -right-5 top-1/2 -translate-y-1/2 z-10 bg-white border border-black w-10 h-10 hidden lg:flex items-center justify-center hover:bg-gray-100 transition-colors shadow-sm"
          aria-label="Voir plus"
        >
          <ChevronRight size={20} strokeWidth={1} />
        </button>
      </div>
    </div>
  );
}
