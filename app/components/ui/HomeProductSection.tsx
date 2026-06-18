'use client';

import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { formatPrice } from '@/app/utils/formatPrice';
import ProductCardContent from '@/app/components/ProductCardContent';
import ProductCardImage from '@/app/components/ProductCardImage';

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

const SCROLL_OFFSET = 300;

export default function HomeProductSection({ title, products, viewAllHref }: HomeProductSectionProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    scrollContainerRef.current?.scrollBy({ left: -SCROLL_OFFSET, behavior: 'smooth' });
  };

  const scrollRight = () => {
    scrollContainerRef.current?.scrollBy({ left: SCROLL_OFFSET, behavior: 'smooth' });
  };

  const viewMoreLinkClassName =
    'rounded-full border border-black bg-white px-8 py-2.5 text-sm font-semibold text-black transition-colors hover:bg-gray-100';

  return (
    <div className="bg-gray-50 py-10 px-6 font-sans">
      <div className="mx-auto mb-6 flex max-w-[1600px] items-end justify-between gap-4">
        <h2 className="text-4xl font-serif text-[#0B1E3B]">{title}</h2>
        {viewAllHref ? (
          <Link href={viewAllHref} className={`${viewMoreLinkClassName} hidden shrink-0 md:inline-flex`}>
            Voir plus
          </Link>
        ) : null}
      </div>

      <div className="relative max-w-[1600px] mx-auto group/section">
        <button
          type="button"
          onClick={scrollLeft}
          className="absolute -left-5 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center border border-black bg-white shadow-sm transition-colors hover:bg-gray-100 lg:flex"
          aria-label="Voir précédent"
        >
          <ChevronLeft size={20} strokeWidth={1} />
        </button>

        <div
          ref={scrollContainerRef}
          className="flex items-stretch overflow-x-auto snap-x snap-mandatory scrollbar-hide -mr-6 divide-x divide-gray-200 border border-gray-200 bg-white md:mr-0"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {products.map((product) => (
            <Link
              key={product.id}
              href={`/product/product-${product.id}`}
              className="group relative flex h-full w-1/2 shrink-0 cursor-pointer snap-start flex-col p-4 transition-colors hover:bg-gray-50 sm:w-[280px] md:w-[300px] xl:w-1/5"
            >
              <ProductCardImage
                src={product.imageUrl}
                alt={product.name}
                badge={
                  product.badge ? (
                    <div className="absolute bottom-0 left-0 z-10">
                      <ProductBadge type={product.badge} />
                    </div>
                  ) : undefined
                }
              />

              <ProductCardContent
                brand={product.brand}
                title={product.name}
                condition={product.size}
                region={product.location}
                price={
                  product.oldPrice ? (
                    <div className="flex flex-col leading-tight">
                      <span className="text-sm text-gray-400 line-through decoration-1">
                        {product.currency === 'FCFA'
                          ? formatPrice(product.oldPrice)
                          : `${product.currency}${product.oldPrice}`}
                      </span>
                      <span className="text-base font-bold text-[#D32F2F]">
                        {product.currency === 'FCFA'
                          ? formatPrice(product.price)
                          : `${product.currency}${product.price}`}
                      </span>
                    </div>
                  ) : (
                    <span className="text-base font-bold text-gray-900">
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
          className="absolute -right-5 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center border border-black bg-white shadow-sm transition-colors hover:bg-gray-100 lg:flex"
          aria-label="Voir plus"
        >
          <ChevronRight size={20} strokeWidth={1} />
        </button>
      </div>

      {viewAllHref ? (
        <div className="mx-auto mt-8 flex max-w-[1600px] justify-center px-2 md:hidden">
          <Link
            href={viewAllHref}
            className={`${viewMoreLinkClassName} w-full max-w-xl py-3.5 text-center sm:max-w-2xl sm:py-4 sm:text-base`}
          >
            Voir plus
          </Link>
        </div>
      ) : null}
    </div>
  );
}
