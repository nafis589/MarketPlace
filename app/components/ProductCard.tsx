'use client';

import Link from 'next/link';
import ProductCardContent from './ProductCardContent';
import ProductCardImage from './ProductCardImage';
import { useFavoriteToggle } from '@/app/hooks/useFavoriteToggle';

interface Product {
  id: string;
  brand: string;
  title: string;
  image: string;
  priceLabel: string;
  condition: string;
  vendorRegion: string;
  sold?: boolean;
}

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const productUrl = `/product/product-${product.id}`;
  const { isFavorite, animating, handleFavoriteClick } = useFavoriteToggle(product.id);

  return (
    <Link
      href={productUrl}
      className="group relative flex h-full flex-col border-r border-b border-gray-200 bg-white p-4 transition-colors hover:bg-gray-50"
    >
      <ProductCardImage src={product.image} alt={product.title} sold={product.sold} />

      <ProductCardContent
        brand={product.brand}
        title={product.title}
        condition={product.condition}
        region={product.vendorRegion}
        disabled={product.sold}
        isFavorite={isFavorite}
        animating={animating}
        onFavoriteClick={handleFavoriteClick}
        price={
          <span className="text-base font-bold text-gray-900">{product.priceLabel}</span>
        }
      />
    </Link>
  );
}
