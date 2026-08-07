'use client';

import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { formatPrice } from '@/app/utils/formatPrice';
import ProductCardContent from '@/app/components/ProductCardContent';
import ProductCardImage from '@/app/components/ProductCardImage';
import { useFavoriteToggle } from '@/app/hooks/useFavoriteToggle';
import {
  homeHorizontalScroll,
  homeSectionBlock,
  homeSectionHeader,
  homeSectionPadding,
  homeSectionShell,
  homeSectionTitle,
} from '@/app/components/home/homeSectionStyles';

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
      <span className="bg-[#3D0A0A] px-2 py-1 text-[9px] font-bold uppercase tracking-wider text-white sm:text-[10px]">
        Black Friday
      </span>
    );
  }
  if (type === 'WE_LOVE') {
    return (
      <span className="border border-gray-300 bg-white px-2 py-1 text-[9px] font-bold uppercase tracking-wider text-gray-800 sm:text-[10px]">
        We Love
      </span>
    );
  }
  return null;
};

interface HomeProductSectionProps {
  title: React.ReactNode;
  products: Product[];
  viewAllHref?: string;
}

const SCROLL_OFFSET = 280;

function HomeProductCard({ product }: { product: Product }) {
  const { isFavorite, animating, handleFavoriteClick } = useFavoriteToggle(String(product.id));

  return (
    <Link
      href={`/product/product-${product.id}`}
      className="group relative flex h-full w-[44vw] min-w-[148px] shrink-0 cursor-pointer snap-start flex-col p-3 transition-colors hover:bg-gray-50 sm:w-[220px] sm:min-w-0 sm:p-4 md:w-[260px] lg:w-[280px] xl:w-1/5"
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
        isFavorite={isFavorite}
        animating={animating}
        onFavoriteClick={handleFavoriteClick}
        price={
          product.oldPrice ? (
            <div className="flex flex-col leading-tight">
              <span className="text-xs text-gray-400 line-through decoration-1 sm:text-sm">
                {product.currency === 'FCFA'
                  ? formatPrice(product.oldPrice)
                  : `${product.currency}${product.oldPrice}`}
              </span>
              <span className="text-sm font-bold text-[#D32F2F] sm:text-base">
                {product.currency === 'FCFA'
                  ? formatPrice(product.price)
                  : `${product.currency}${product.price}`}
              </span>
            </div>
          ) : (
            <span className="text-sm font-bold text-gray-900 sm:text-base">
              {product.currency === 'FCFA'
                ? formatPrice(product.price)
                : `${product.currency}${product.price}`}
            </span>
          )
        }
      />
    </Link>
  );
}

export default function HomeProductSection({ title, products, viewAllHref }: HomeProductSectionProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    scrollContainerRef.current?.scrollBy({ left: -SCROLL_OFFSET, behavior: 'smooth' });
  };

  const scrollRight = () => {
    scrollContainerRef.current?.scrollBy({ left: SCROLL_OFFSET, behavior: 'smooth' });
  };

  const viewMoreLinkClassName =
    'inline-flex items-center justify-center rounded-full border border-black bg-white px-6 py-2 text-xs font-semibold text-black transition-colors hover:bg-gray-100 sm:px-8 sm:py-2.5 sm:text-sm';

  return (
    <section className={`bg-gray-50 font-sans ${homeSectionBlock} ${homeSectionPadding}`}>
      <div className={homeSectionShell}>
        <div className={`flex items-end justify-between gap-3 sm:gap-4 ${homeSectionHeader}`}>
          <h2 className={homeSectionTitle}>{title}</h2>
          {viewAllHref ? (
            <Link href={viewAllHref} className={`${viewMoreLinkClassName} hidden shrink-0 md:inline-flex`}>
              Voir plus
            </Link>
          ) : null}
        </div>

        <div className="group/section relative">
          <button
            type="button"
            onClick={scrollLeft}
            className="absolute -left-3 top-1/2 z-10 hidden h-9 w-9 -translate-y-1/2 items-center justify-center border border-black bg-white shadow-sm transition-colors hover:bg-gray-100 lg:flex xl:-left-5 xl:h-10 xl:w-10"
            aria-label="Voir précédent"
          >
            <ChevronLeft size={20} strokeWidth={1} />
          </button>

          <div
            ref={scrollContainerRef}
            className={`${homeHorizontalScroll} items-stretch divide-x divide-gray-200 border border-gray-200 bg-white`}
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {products.map((product) => (
              <HomeProductCard key={product.id} product={product} />
            ))}
          </div>

          <button
            type="button"
            onClick={scrollRight}
            className="absolute -right-3 top-1/2 z-10 hidden h-9 w-9 -translate-y-1/2 items-center justify-center border border-black bg-white shadow-sm transition-colors hover:bg-gray-100 lg:flex xl:-right-5 xl:h-10 xl:w-10"
            aria-label="Voir plus"
          >
            <ChevronRight size={20} strokeWidth={1} />
          </button>
        </div>

        {viewAllHref ? (
          <div className="mt-6 flex justify-center sm:mt-8 md:hidden">
            <Link href={viewAllHref} className={`${viewMoreLinkClassName} w-full max-w-sm py-3 sm:max-w-md`}>
              Voir plus
            </Link>
          </div>
        ) : null}
      </div>
    </section>
  );
}
